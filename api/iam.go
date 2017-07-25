package api

import (
	"bytes"
	"io/ioutil"
	"net/http"

	"github.com/bitly/go-simplejson"
	. "github.com/journeymidnight/prophet/api/datatype"
	"github.com/journeymidnight/prophet/helper"
	"gopkg.in/gin-gonic/gin.v1"
)

func IamHandle(c *gin.Context) {
	action := c.Param("action")
	reader := c.Request.Body
	defer reader.Close()
	body, _ := ioutil.ReadAll(reader)
	js, err := simplejson.NewJson(body)
	if err != nil {
		c.JSON(http.StatusBadRequest, QueryResponse{Message: "uncode body err", Data: err.Error()})
		return
	}
	js.Set("action", action)
	m_body, err := js.MarshalJSON()
	if err != nil {
		c.JSON(http.StatusInternalServerError, QueryResponse{Message: "MarshalJSON err", Data: err.Error()})
		return
	}
	iamClient := new(http.Client)
	request, err := http.NewRequest("POST", helper.CONFIG.IamEndpoint, bytes.NewReader(m_body))
	request.Header = c.Request.Header
	response, err := iamClient.Do(request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, QueryResponse{Message: "proxy request to iam failed", Data: err.Error()})
		return
	}
	res_body, _ := ioutil.ReadAll(response.Body)
	c.String(http.StatusOK, string(res_body))
	return
}
