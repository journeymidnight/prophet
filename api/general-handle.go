package api
import (
	"gopkg.in/gin-gonic/gin.v1"
	"net/http"
	. "github.com/journeymidnight/prophet/back/api/datatype"
)

func GetHandle(c *gin.Context) {
	dst := c.Param("dst")
	switch dst {
	case "local":
		LocalGetApiHandle(c)
	default:
		c.JSON(http.StatusBadRequest, QueryResponse{Message:http.StatusText(http.StatusBadRequest),Data:""})
		return
	}
	return
}

func PutHandle(c *gin.Context) {
	dst := c.Param("dst")
	switch dst {
	case "local":
		LocalPutApiHandle(c)
	default:
		c.JSON(http.StatusBadRequest, QueryResponse{Message:http.StatusText(http.StatusBadRequest),Data:""})
		return
	}
	return
}

func DelHandle(c *gin.Context) {
	dst := c.Param("dst")
	switch dst {
	case "local":
		LocalDelApiHandle(c)
	default:
		c.JSON(http.StatusBadRequest, QueryResponse{Message:http.StatusText(http.StatusBadRequest),Data:""})
		return
	}
	return
}

func PostHandle(c *gin.Context) {
	dst := c.Param("dst")
	switch dst {
	case "iam":
		IamHandle(c)
	default:
		c.JSON(http.StatusBadRequest, QueryResponse{Message:http.StatusText(http.StatusBadRequest),Data:""})
		return
	}
	return
}
