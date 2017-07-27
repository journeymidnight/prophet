package api

import (
	"net/http"

	. "github.com/journeymidnight/prophet/api/datatype"
	"gopkg.in/gin-gonic/gin.v1"
)

func PostHandle(c *gin.Context) {
	dst := c.Param("dst")
	switch dst {
	case "iam":
		IamHandle(c)
	case "local":
		LocalApiHandle(c)
	default:
		c.JSON(http.StatusBadRequest, QueryResponse{Message: http.StatusText(http.StatusBadRequest), Data: ""})
		return
	}
	return
}
