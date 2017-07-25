package db

import (
	//	"database/sql"
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	"github.com/influxdata/influxdb/client/v2"
	. "github.com/journeymidnight/prophet/api/datatype"
	"github.com/journeymidnight/prophet/helper"
)

var Db *sql.DB
var Client client.Client

func CreateDbConnection() *sql.DB {
	conn, err := sql.Open("mysql", helper.CONFIG.DatabaseConnectionString)
	if err != nil {
		panic(fmt.Sprintf("Error connecting to database: %v", err))
	}
	helper.Logger.Println(5, "Connected to database")
	return conn
}

func ListNodeRecords() ([]NodeRecord, error) {
	var records []NodeRecord
	rows, err := Db.Query("select * from nodes")
	if err != nil {
		helper.Logger.Println(5, "Error querying nodes: ", err)
		return records, err
	}
	defer rows.Close()
	for rows.Next() {
		var record NodeRecord
		if err := rows.Scan(
			&record.HostName,
			&record.Ip); err != nil {
			helper.Logger.Println(5, "Row scan error: ", err)
			continue
		}
		records = append(records, record)
	}
	if err := rows.Err(); err != nil {
		helper.Logger.Println(5, "Row error: ", err)
	}
	return records, err
}

func InsertNodeRecord(hostname string, ip string) error {
	_, err := Db.Exec("insert into nodes values( ?, ? )", hostname, ip)
	if err != nil {
		helper.Logger.Println(5, "Error add node hostname", hostname, err.Error())
	}
	return err
}

func RemoveNodeRecord(hostname string) error {
	_, err := Db.Exec("delete from nodes where hostname=(?)", hostname)
	if err != nil {
		helper.Logger.Println(5, "Error remove node hostname", hostname, err.Error())
	}
	return err
}

func QueryDB(cmd string) (res []client.Result, err error) {
	q := client.Query{
		Command:  cmd,
		Database: helper.CONFIG.InfluxDbName,
	}
	if response, err := Client.Query(q); err == nil {
		if response.Error() != nil {
			return res, response.Error()
		}
		res = response.Results
	} else {
		return res, err
	}
	return res, err
}

func CreateInfluxDbConnection() client.Client {
	c, err := client.NewHTTPClient(client.HTTPConfig{
		Addr:     helper.CONFIG.InfluxDbAddress,
		Username: helper.CONFIG.InfluxDbUserName,
		Password: helper.CONFIG.InfluxDbUserPassword,
	})
	if err != nil {
		helper.Logger.Fatal(5, err)
	}
	return c
}

func InitDb() {
	res, err := QueryDB("SHOW DATABASES")
	if err != nil {
		helper.Logger.Fatal(5, err)
	}
	dbExist := false
	values := res[0].Series[0].Values
	for _, value := range values {
		for _, subValue := range value {
			if subValue == helper.CONFIG.InfluxDbName {
				dbExist = true
				break
			}
		}
	}
	helper.Logger.Print(5, "DB existed:", dbExist)
	if dbExist != true {
		_, err := QueryDB(fmt.Sprintf("CREATE DATABASE %s", helper.CONFIG.InfluxDbName))
		if err != nil {
			helper.Logger.Fatal(5, err)
		}
		helper.Logger.Print(5, "DB created success")
	}

	return
}

/*
func InsertNodeRecord(ip string, name string) error {
	bp, err := client.NewBatchPoints(client.BatchPointsConfig{
		Database:  DbName,
		Precision: "s",
	})
	if err != nil {
		helper.Logger.Print(5, err)
		return err
	}

	// Create a point and add to batch
	tags := map[string]string{"name": name}
	fields := map[string]interface{}{
		"ip":   ip,
	}

	pt, err := client.NewPoint(Measure, tags, fields, time.Now())
	if err != nil {
		helper.Logger.Print(5, err)
		return err
	}
	bp.AddPoint(pt)

	// Write the batch
	if err := Client.Write(bp); err != nil {
		helper.Logger.Print(5, "failed InsertNodeRecord ip=", ip, err)
		return err
	}
	return nil
}

func RemoveNodeRecord(ip string) error {
	q := fmt.Sprintf("DELETE FROM %s WHERE 'ip'='%s'", Measure, ip)
	_, err := queryDB(q)
	if err != nil {
		helper.Logger.Print(5, "failed RemoveNodeRecord ip=", ip, err)
		return err
	}
	return nil

}

func ListNodeRecords() ([]NodeRecord, error) {
	var nodes []NodeRecord
	q := fmt.Sprintf("SELECT FROM %s", Measure)
	res, err := queryDB(q)
	if err != nil {
		helper.Logger.Print(5, "failed ListNodeRecords", err)
		return nodes, err
	}
	for _, node := range res {
		helper.Logger.Print(5, "list nodes:", node)
	}
	return nodes, nil
}*/
