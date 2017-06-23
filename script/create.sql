grant all on prophet.* to prophet@"127.0.0.1" identified by "123456" with grant option;

create table nodes(
hostname varchar(100) primary key,
ip varchar(20)
)default charset=utf8;