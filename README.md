# Prophet

A monitor dashboard backend for Ceph/Influxdb/


# 1.setup mariadb

	yum install mariadb-server mariadb -y
	systemctl start mariadb
	systemctl enable mariadb

# 2.create table

	mysql -uroot
```
create database prophet;
grant all on prophet.* to prophet@"127.0.0.1" 
identified by "123456" with grant option;

use prophet;
create table nodes(
hostname varchar(100) primary key,
ip varchar(20)
)default charset=utf8;
```

# 3.prepare influxdb

# 4.modify config
```
{
    "LogPath": "/var/log/prophet/prophet.log",
    "PanicLogPath": "/var/log/prophet/panic.log",
    "PidFile": "/var/run/prophet/prophet.pid",
    "BindPort": 8890,
    "DebugMode": false,
    "LogLevel": 5,
    "IamEndpoint": "http://127.0.0.1:8888",
    "DatabaseConnectionString": "prophet:123456@/prophet",
    "InfluxDbAddress": "http://127.0.0.1:8086",
    "InfluxDbUserName": "",
    "InfluxDbUserPassword": "",
    "InfluxDbName": "telegraf",
    "CephStatusReporterHostName": "node1",
    "LcExpireDays": 0,
    "LcStartTime": "03:00",
    "LcCmd": "/bin/echo 'lets rock at {{time}}'"
}
```

# 5.start service

	systemctl start prophet
