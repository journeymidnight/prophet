package api
import (
	"gopkg.in/gin-gonic/gin.v1"
	. "github.com/journeymidnight/prophet/back/api/datatype"
	"net/http"
	"io/ioutil"
	"github.com/bitly/go-simplejson"
	"github.com/journeymidnight/prophet/back/db"
	"strconv"
	"math"
	"github.com/journeymidnight/prophet/back/helper"
	"time"
)

func LocalApiHandle(c *gin.Context) {
	action := c.Param("action")
	switch action {
	case  "addnode":
		AddNode(c)
	case  "delnode":
		DelNode(c)
	case  "listnodes":
		ListNodes(c)
	case  "fetchmatric":
		FetchMetric(c)
	default:
		c.JSON(http.StatusOK, QueryResponse{RetCode:4000,Message:"unkonw destination",Data:""})
		return
	}
	return
}

func AddNode(c *gin.Context) {
	reader := c.Request.Body
	defer reader.Close()
	body, _ := ioutil.ReadAll(reader)
	js, err := simplejson.NewJson(body)
	if err != nil {
		c.JSON(http.StatusOK, QueryResponse{RetCode:5000,Message:"uncode body err",Data:err.Error()})
		return
	}
	hostname, _ := js.Get("hostname").String()
	ip, _ := js.Get("ip").String()
	err = db.InsertNodeRecord(hostname, ip)
	if err != nil {
		c.JSON(http.StatusOK, QueryResponse{RetCode:5010,Message:"add node failed",Data:err.Error()})
		return
	}
	c.JSON(http.StatusOK, QueryResponse{RetCode:0,Message:"",Data:""})
	return
}

func DelNode(c *gin.Context) {
	reader := c.Request.Body
	defer reader.Close()
	body, _ := ioutil.ReadAll(reader)
	js, err := simplejson.NewJson(body)
	if err != nil {
		c.JSON(http.StatusOK, QueryResponse{RetCode:5000,Message:"uncode body err",Data:err.Error()})
		return
	}
	hostname, _ := js.Get("hostname").String()
	err = db.RemoveNodeRecord(hostname)
	if err != nil {
		c.JSON(http.StatusOK, QueryResponse{RetCode:5010,Message:"del node failed",Data:err.Error()})
		return
	}
	c.JSON(http.StatusOK, QueryResponse{RetCode:0,Message:"",Data:""})
	return

}

func ListNodes(c *gin.Context) {
	records, err := db.ListNodeRecords()
	if err != nil {
		c.JSON(http.StatusOK, QueryResponse{RetCode:5000,Message:"list node records err",Data:err.Error()})
		return
	}
	c.JSON(http.StatusOK, QueryResponse{RetCode:0,Message:"",Data:records})
}

const pointsPerGraph float64 = 200
const JavascriptISOString string = "2006-01-02T15:04:05.999Z07:00"
func buildQuery(fromTime int, toTime int, hostname string, measurement string, measure string) (string, error) {
	var groupByTime = math.Floor(float64((toTime - fromTime))/pointsPerGraph)
	if (groupByTime < 10) {
		groupByTime = 10
	}
	query := "SELECT MEAN(\"" + measure + "\") FROM " + measurement + " WHERE host='" + hostname + "'" +
		" AND time > '" + time.Unix(int64(fromTime), 0).Format(JavascriptISOString) + "' AND time < '" +
		time.Unix(int64(toTime), 0).Format(JavascriptISOString) + "' "
	query += " GROUP BY time(" + strconv.Itoa(int(groupByTime)) + "s)";
	helper.Logger.Print(5, "query string:", query)
	return query, nil
}

func FetchMetric(c *gin.Context) {
	reader := c.Request.Body
	defer reader.Close()
	body, _ := ioutil.ReadAll(reader)
	js, err := simplejson.NewJson(body)
	from, _ := js.Get("from").String()
	to, _ := js.Get("to").String()
	hostname, _ := js.Get("hostname").String()
	measurement, _ := js.Get("measurement").String()
	measure, _ := js.Get("measure").String()
	if measure == "" || measurement == "" ||  hostname == "" {
		c.JSON(http.StatusOK, QueryResponse{RetCode:4000,Message:"bad request",Data:""})
		return
	}
	fromTime, _ := strconv.Atoi(from)
	toTime, _ := strconv.Atoi(to)
	q, err := buildQuery(fromTime, toTime, hostname, measurement, measure)
	if err != nil {
		c.JSON(http.StatusOK, QueryResponse{RetCode:4000,Message:"buildQuery failed",Data:err.Error()})
		return
	}
	records, err := db.QueryDB(q)
	if err != nil {
		c.JSON(http.StatusOK, QueryResponse{RetCode:5000,Message:"FetchMetric  querydb err",Data:err.Error()})
		return
	}
	helper.Logger.Print(5, "records:", records)
	c.JSON(http.StatusOK, QueryResponse{RetCode:0,Message:"",Data:records[0].Series[0].Values})
}