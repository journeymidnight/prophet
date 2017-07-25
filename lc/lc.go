package lc

import (
	"fmt"
	"log"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"github.com/journeymidnight/prophet/helper"
)

func isTimeUp(startTime string, lastLunchTime time.Time) (bool, error) {
	var hour int
	var min int
	now := time.Now()
	helper.Logger.Println(5, "lastlunchtime", lastLunchTime.String())
	if lastLunchTime.AddDate(0, 0, 1).After(now) {
		return false, nil
	}
	num, err := fmt.Sscanf(startTime, "%2d:%2d", &hour, &min)
	if err != nil || num < 2 {
		return false, err
	}
	helper.Logger.Println(5, "time compair", hour, min)
	if (now.Hour()*60 + now.Minute()) >= (hour*60 + min) {
		helper.Logger.Println(5, "Time is Up")
		return true, nil
	}
	helper.Logger.Println(5, "Time is not Up")
	return false, nil
}

var State string
var LastLanchTime time.Time

func LcLoop() error {
	var err error
	for {
		shouldStart, err := isTimeUp(helper.CONFIG.LcStartTime, LastLanchTime)
		if err == nil && shouldStart && State != "RUNNING" && helper.CONFIG.LcExpireDays != 0 {
			helper.Logger.Printf(5, "start to do lc ...")
			LastLanchTime = time.Now()
			cmdString := helper.CONFIG.LcCmd
			real := strings.Replace(cmdString, "{{time}}", strconv.Itoa(helper.CONFIG.LcExpireDays), 1)
			args := strings.Split(real, " ")
			cmd := exec.Command(args[0], args...)
			err := cmd.Start()
			if err != nil {
				log.Fatal(err)
			}
			State = "RUNNING"
			helper.Logger.Printf(5, "Waiting for command to finish...")
			err = cmd.Wait()
			State = "WAITING"
			helper.Logger.Printf(5, "Command finished with error: %v", err)
		}
		time.Sleep(5 * time.Second)
	}
	return err
}
