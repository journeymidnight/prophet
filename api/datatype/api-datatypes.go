package datatype

type QueryResponse struct {
	Data interface{} `json:"data"`
	Message string `json:"message"`
}

type NodeRecord struct {
	HostName string
	Ip string
}