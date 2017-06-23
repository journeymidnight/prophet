package datatype

type QueryResponse struct {
	RetCode int `json:"retCode"`
	Data interface{} `json:"data"`
	Message string `json:"message"`
}

type NodeRecord struct {
	HostName string
	Ip string
}