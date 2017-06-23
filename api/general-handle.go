package api
import (
	"gopkg.in/gin-gonic/gin.v1"
	"net/http"
	. "github.com/journeymidnight/prophet/back/api/datatype"
)

func ApiHandle(c *gin.Context) {
	dst := c.Param("dst")
	switch dst {
	case "iam":
		IamHandle(c)
	case "influxdb":
		InfluxDbHandle(c)
	case "local":
		LocalApiHandle(c)
	default:
		c.JSON(http.StatusOK, QueryResponse{RetCode:4000,Message:"unkonw destination",Data:""})
		return
	}
	return
}
