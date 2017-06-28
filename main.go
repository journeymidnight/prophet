package main

import (
	"fmt"
	"os"
	"strconv"
	"syscall"
	"github.com/journeymidnight/prophet/back/helper"
	"github.com/journeymidnight/prophet/back/log"
	"github.com/journeymidnight/prophet/back/api"
	"gopkg.in/gin-gonic/gin.v1"
	"github.com/journeymidnight/prophet/back/db"
)

var logger *log.Logger

func main() {
	helper.SetupConfig()
	defer func(){
		if err:=recover();err!=nil{
			fmt.Println(err) // 这里的err其实就是panic传入的内容，55
		}
	}()
	if err := helper.CreatePidfile(helper.CONFIG.PidFile); err != nil {
		fmt.Printf("can not create pid file %s\n", helper.CONFIG.PidFile)
		return
	}
	defer helper.RemovePidfile(helper.CONFIG.PidFile)

	/* log  */
	f, err := os.OpenFile(helper.CONFIG.LogPath, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		panic("Failed to open log file " + helper.CONFIG.LogPath)
	}
	defer f.Close()
	logger = log.New(f, "[prophet]", log.LstdFlags, helper.CONFIG.LogLevel)
	helper.Logger = logger
	db.Db = db.CreateDbConnection()
	db.Client = db.CreateInfluxDbConnection()
	/* redirect stdout stderr to log  */
	syscall.Dup2(int(f.Fd()), 2)
	syscall.Dup2(int(f.Fd()), 1)
	router := gin.Default()
	router.GET("/:dst/:action", api.GetHandle)
	router.PUT("/:dst/:action", api.PutHandle)
	router.DELETE("/:dst/:action", api.DelHandle)
	router.POST("/:dst/:action", api.PostHandle)
	router.Run(":" + strconv.Itoa(helper.CONFIG.BindPort))
}

