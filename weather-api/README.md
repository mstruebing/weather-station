# weather-api

This is an api written in go to just POST and GET data
regarding our weather-station.

Currently there are 4 routes implemented:   
`/temperature`,  
`/humidity`,  
`/brightness`,   
`rain`   

For a POST-request every route expect a timestamp and a value, if one or both of them isn't present the data will not be
written to the database.

GET isn't supported now.

An example request with curl looks like this:  
`curl -X POST -d "value=210" -d "timestamp=$(date +%s)" http://localhost:8080/brightness`

CAUTION: The database will use UTC time.


The database are just 4 simple tables, named exactly like the routes(except the leading /),
with just a timestamp field and a field which is named like the table for the actual value on this time.

A database dump which creates the needed tables is located at `Build/Database/dump.sql`

The program can be compiled with just `go build api.go` - this will output a file named `api`
which can be normally executed via `./api`
If you want to specify a custom name for the binary you could pass the `-o <name>` flag like this:  
`go build -o <whatever the fuck you want> api.go`

To just run the program without compiling it you could use `go run api.go` // `API_PORT=1234 go run api.go`

CAUTION2: make sure you have go-sql-driver/mysql in your GOPATH, if not get it with `go get -u github.com/go-sql-driver/mysql`
before compiling

The program listens at port `8080` which can be overridden via environment variables like this:   
`API_PORT=1234 ./api`   
This will use port `1234` instead.

The default database settings are:
- user: admin
- password: pass
- database: weather_station
- host: 0.0.0.0
- port: 3306

They can be overridden with environment variables like this:

```
DATABASE_USER=<username>
DATABASE_PASSWORD=<password>
DATABASE_NAME=<databasename>
DATABASE_HOST=<databasehost>
DATABASE_PORT=<databaseport>
```

Foe example:

`DATABASE_USER=myUser DATABASE_PASSWORD=myPass DATABASE_NAME=mySpecialDatabase DATABASE_HOST=127.0.0.1 DATABASE_PORT=3307 ./api`

However, if you use _ANY_ of the default values you do not need to specify the environment variable for that.
