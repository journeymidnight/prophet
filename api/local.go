package api

import (
	"math"
	"net/http"
	"strconv"
	"time"

	. "github.com/journeymidnight/prophet/api/datatype"
	"github.com/journeymidnight/prophet/db"
	"github.com/journeymidnight/prophet/helper"
	"github.com/journeymidnight/prophet/lc"
	"gopkg.in/gin-gonic/gin.v1"
)

func LocalApiHandle(c *gin.Context) {
	action := c.Param("action")
	switch action {
	case "listnodes":
		ListNodes(c)
	case "fetchmetric":
		FetchMetric(c)
	case "querydb":
		QueryDb(c)
	case "loadconfig":
		LoadConfig(c)
	case "addnode":
		AddNode(c)
	case "delnode":
		DelNode(c)
	case "setconfig":
		SetConfig(c)
	default:
		c.JSON(http.StatusBadRequest, QueryResponse{Message: http.StatusText(http.StatusBadRequest), Data: ""})
		return
	}
	return
}

func AddNode(c *gin.Context) {
	hostname := c.Query("hostname")
	helper.Logger.Print(5, "hostname:", hostname)
	if hostname == "" {
		c.JSON(http.StatusBadRequest, QueryResponse{Message: http.StatusText(http.StatusBadRequest), Data: ""})
		return
	}
	ip := c.Query("ip")
	err := db.InsertNodeRecord(hostname, ip)
	if err != nil {
		c.JSON(http.StatusInternalServerError, QueryResponse{Message: "add node failed", Data: err.Error()})
		return
	}
	c.JSON(http.StatusOK, QueryResponse{Message: "", Data: ""})
	return
}

func DelNode(c *gin.Context) {
	hostname := c.Query("hostname")
	if hostname == "" {
		c.JSON(http.StatusBadRequest, QueryResponse{Message: http.StatusText(http.StatusBadRequest), Data: ""})
		return
	}
	err := db.RemoveNodeRecord(hostname)
	if err != nil {
		c.JSON(http.StatusInternalServerError, QueryResponse{Message: "del node failed", Data: err.Error()})
		return
	}
	c.JSON(http.StatusOK, QueryResponse{Message: "", Data: ""})
	return

}

func ListNodes(c *gin.Context) {
	records, err := db.ListNodeRecords()
	if err != nil {
		c.JSON(http.StatusInternalServerError, QueryResponse{Message: "list node records err", Data: err.Error()})
		return
	}
	c.JSON(http.StatusOK, QueryResponse{Message: "", Data: records})
}

func SetConfig(c *gin.Context) {
	expiredays := c.Query("expiredays")
	days, err := strconv.Atoi(expiredays)
	if err != nil || days < 0 || days > 99999 {
		c.JSON(http.StatusBadRequest, QueryResponse{Message: http.StatusText(http.StatusBadRequest), Data: "expiredays exceed range allows"})
		return
	}
	starttime := c.Query("starttime")
	helper.CONFIG.LcExpireDays = days
	helper.CONFIG.LcStartTime = starttime
	err = helper.SaveConfig()
	if err != nil {
		c.JSON(http.StatusInternalServerError, QueryResponse{Message: "save config failed", Data: err.Error()})
	} else {
		lc.State = "WAITING"
		lc.LastLanchTime = time.Unix(0, 0)
		c.JSON(http.StatusOK, QueryResponse{Message: "", Data: ""})
	}
	return
}

func LoadConfig(c *gin.Context) {
	var msg struct {
		LcExpireDays int    `json:"expiredays"`
		LcStartTime  string `json:"starttime"`
	}
	msg.LcExpireDays = helper.CONFIG.LcExpireDays
	msg.LcStartTime = helper.CONFIG.LcStartTime
	c.JSON(http.StatusOK, QueryResponse{Message: "", Data: msg})

	return
}

const pointsPerGraph float64 = 200
const JavascriptISOString string = "2006-01-02T15:04:05.999Z07:00"

func buildQuery(fromTime int, toTime int, hostname string, measurement string, measure string, latest string) (string, error) {
	var groupByTime = math.Floor(float64((toTime - fromTime)) / pointsPerGraph / 1000)
	if groupByTime < 10 {
		groupByTime = 10
	}
	realHostname := ""
	query := ""
	if hostname == "SpecifiedByConfig" {
		realHostname = helper.CONFIG.CephStatusReporterHostName
	} else {
		realHostname = hostname
	}
	if latest == "false" {
		query = "SELECT MEAN(\"" + measure + "\") FROM " + measurement + " WHERE host='" + realHostname + "'" +
			" AND time >= '" + time.Unix(int64(fromTime)/1000, 0).Format(JavascriptISOString) + "' AND time <= '" +
			time.Unix(int64(toTime)/1000, 0).Format(JavascriptISOString) + "' "
		query += " GROUP BY time(" + strconv.Itoa(int(groupByTime)) + "s)"
	} else {
		query = "SELECT LAST(\"" + measure + "\") FROM " + measurement + " WHERE host='" + realHostname + "'"
	}

	helper.Logger.Print(5, "query string:", query)
	return query, nil
}

func FetchMetric(c *gin.Context) {
	from := c.Query("from")
	to := c.Query("to")
	hostname := c.Query("hostname")
	measurement := c.Query("measurement")
	measure := c.Query("measure")
	latest := c.Query("latest")
	if measure == "" || measurement == "" || hostname == "" {
		c.JSON(http.StatusBadRequest,
			QueryResponse{Message: "from or measure or measurement or hostname can not be empty", Data: ""})
		return
	}
	fromTime, _ := strconv.Atoi(from)
	var toTime int
	if to == "" {
		toTime = int((time.Now().UnixNano() / 1000000))
	} else {
		toTime, _ = strconv.Atoi(to)
	}
	q, err := buildQuery(fromTime, toTime, hostname, measurement, measure, latest)
	if err != nil {
		c.JSON(http.StatusInternalServerError, QueryResponse{Message: "buildQuery failed", Data: err.Error()})
		return
	}
	records, err := db.QueryDB(q)
	if err != nil {
		c.JSON(http.StatusInternalServerError, QueryResponse{Message: "FetchMetric  querydb err", Data: err.Error()})
		return
	}
	helper.Logger.Print(5, "records:", records)
	c.JSON(http.StatusOK, QueryResponse{Message: "", Data: records})
}

func QueryDb(c *gin.Context) {
	query := c.Query("q")
	records, err := db.QueryDB(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, QueryResponse{Message: "Redirect  querydb err", Data: err.Error()})
		return
	}
	helper.Logger.Print(5, "records:", records)
	c.JSON(http.StatusOK, QueryResponse{Message: "", Data: records})
}
