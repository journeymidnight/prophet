package helper

import (
	"encoding/json"
	"io/ioutil"
	"math/rand"
	"os"
)

func Ternary(IF bool, THEN interface{}, ELSE interface{}) interface{} {
	if IF {
		return THEN
	} else {
		return ELSE
	}
}

// Static alphaNumeric table used for generating unique request ids
var alphaNumericTable = []byte("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ")

var NumericTable = []byte("0123456789")

func GenerateRandomId() []byte {
	alpha := make([]byte, 16, 16)
	for i := 0; i < 16; i++ {
		n := rand.Intn(len(alphaNumericTable))
		alpha[i] = alphaNumericTable[n]
	}
	return alpha
}

func GenerateRandomIdByLength(length int) []byte {
	alpha := make([]byte, length, length)
	for i := 0; i < length; i++ {
		n := rand.Intn(len(alphaNumericTable))
		alpha[i] = alphaNumericTable[n]
	}
	return alpha
}

func GenerateRandomNumberId() []byte {
	alpha := make([]byte, 16, 16)
	for i := 0; i < 16; i++ {
		n := rand.Intn(len(NumericTable))
		alpha[i] = NumericTable[n]
	}
	return alpha
}

type Config struct {
	LogPath                    string
	PanicLogPath               string
	PidFile                    string
	BindPort                   int
	DebugMode                  bool
	LogLevel                   int //1-20
	IamEndpoint                string
	DatabaseConnectionString   string
	InfluxDbAddress            string
	InfluxDbUserName           string
	InfluxDbUserPassword       string
	InfluxDbName               string
	CephStatusReporterHostName string
	LcExpireDays               int
	LcStartTime                string
	LcCmd                      string
}

type config struct {
	LogPath                    string
	PanicLogPath               string
	PidFile                    string
	BindPort                   int
	DebugMode                  bool
	LogLevel                   int //1-20
	IamEndpoint                string
	DatabaseConnectionString   string
	InfluxDbAddress            string
	InfluxDbUserName           string
	InfluxDbUserPassword       string
	InfluxDbName               string
	CephStatusReporterHostName string
	LcExpireDays               int
	LcStartTime                string
	LcCmd                      string
}

var CONFIG Config

func SetupConfig() {
	f, err := os.Open("/etc/prophet/prophet.json")
	if err != nil {
		panic("Cannot open prophet.json")
	}
	defer f.Close()

	var c config
	err = json.NewDecoder(f).Decode(&c)
	if err != nil {
		panic("Failed to parse prophet.json: " + err.Error())
	}

	// setup CONFIG with defaults
	CONFIG.LogPath = c.LogPath
	CONFIG.PanicLogPath = c.PanicLogPath
	CONFIG.PidFile = c.PidFile
	CONFIG.BindPort = c.BindPort
	CONFIG.DebugMode = c.DebugMode
	CONFIG.LogLevel = Ternary(c.LogLevel == 0, 5, c.LogLevel).(int)
	CONFIG.IamEndpoint = c.IamEndpoint
	CONFIG.DatabaseConnectionString = c.DatabaseConnectionString
	CONFIG.InfluxDbAddress = Ternary(c.InfluxDbAddress == "", "http://localhost:8086", c.InfluxDbAddress).(string)
	CONFIG.InfluxDbName = c.InfluxDbName
	CONFIG.InfluxDbUserName = c.InfluxDbUserName
	CONFIG.InfluxDbUserPassword = c.InfluxDbUserPassword
	CONFIG.CephStatusReporterHostName = c.CephStatusReporterHostName
	CONFIG.LcExpireDays = Ternary(c.LcExpireDays == 0, 0, c.LcExpireDays).(int)
	CONFIG.LcStartTime = Ternary(c.LcStartTime == "", "00:00", c.LcStartTime).(string)
	CONFIG.LcCmd = Ternary(c.LcCmd == "", "echo 'lets rock at {{time}}'", c.LcCmd).(string)
}

func SaveConfig() error {

	b, err := json.MarshalIndent(CONFIG, "", "    ")
	if err != nil {
		Logger.Println(5, err)
	}
	err = ioutil.WriteFile("/etc/prophet/prophet.json", b, 0644)
	if err != nil {
		Logger.Println(5, "save config failed", err)
	}
	return err
}
