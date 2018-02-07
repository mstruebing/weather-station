package main

import (
    "database/sql"
    "errors"
    "fmt"
    "log"
    "net/http"
    "os"
    "strings"
    "strconv"
    "time"

    _ "github.com/go-sql-driver/mysql"
)

func maybeError(w http.ResponseWriter, errorCode int,  err error) {
    if err != nil {
        w.WriteHeader(errorCode)
        os.Stderr.WriteString("ERROR: " + err.Error() + "\n")
    }
}

func getValuesFromRequest(w http.ResponseWriter, r *http.Request) (int64, float64) {
    if r.FormValue("value") == "" {
        err := errors.New("value empty")
        maybeError(w, http.StatusBadRequest, err)
    }

    value, err := strconv.ParseFloat(r.FormValue("value"), 64)
    maybeError(w, http.StatusBadRequest, err)

    zone, _ := time.LoadLocation("Europe/Berlin")
    timestamp := time.Now().In(zone).Unix()

    return timestamp, value
}

func getDbConnectionString() string {
    var user = "admin"
    var pass = "pass"
    var host = "0.0.0.0"
    var port = "3306"
    var name = "weather_station"

    if os.Getenv("DATABASE_USER") != "" {
        user = os.Getenv("DATABASE_USER")
    }
    if os.Getenv("DATABASE_PASSWORD") != "" {
        pass = os.Getenv("DATABASE_PASSWORD")
    }
    if os.Getenv("DATABASE_HOST") != "" {
        host = os.Getenv("DATABASE_HOST")
    }
    if os.Getenv("DATABASE_PORT") != "" {
        port = os.Getenv("DATABASE_PORT")
    }
    if os.Getenv("DATABASE_NAME") != "" {
        name = os.Getenv("DATABASE_NAME")
    }

    return user + ":" + pass + "@tcp(" + host + ":" + port + ")/" + name
}

func executePreparedStatement(w http.ResponseWriter, preparedStatement string, timestamp int64, value float64) {
    db, err := sql.Open("mysql", getDbConnectionString())
    maybeError(w, http.StatusInternalServerError, err)
    defer db.Close()

    stmtIns, err := db.Prepare(preparedStatement)
    maybeError(w, http.StatusInternalServerError, err)
    defer stmtIns.Close()

    _, err = stmtIns.Exec(timestamp, value)
    maybeError(w, http.StatusInternalServerError, err)
}

func insertIntoDb(w http.ResponseWriter, r *http.Request) {
    // the url path is smth like /temperature
    // and maps directly to the table but without the leading /
    table := r.URL.Path[1:len(r.URL.Path)]
    timestamp, value := getValuesFromRequest(w, r)
    executePreparedStatement(w, "INSERT INTO`" + table + "` VALUES(?, ?)", timestamp, value)
}

func getFromDatabase(w http.ResponseWriter, r *http.Request) {
    var query string
    var jsonResponse string

    // the url path is smth like /temperature
    // and maps directly to the table but without the leading /
    table := r.URL.Path[1:len(r.URL.Path)]
    db, err := sql.Open("mysql", getDbConnectionString())
    maybeError(w, http.StatusInternalServerError, err)
    defer db.Close()

    fromTimestamp := r.URL.Query().Get("timestamp")
    if fromTimestamp != "" {
        query = "SELECT * FROM " + table + " WHERE timestamp > " + fromTimestamp + ""
    } else {
        query = "SELECT * FROM " + table
    }

    rows, err := db.Query(query)
    maybeError(w, http.StatusInternalServerError, err)
    defer rows.Close()

    jsonResponse = "{"
    for rows.Next() {
        var timestamp string
        var value string
        err := rows.Scan(&timestamp, &value)
        maybeError(w, http.StatusInternalServerError, err)
        jsonResponse += "\"" + timestamp + "\": \"" + value + "\", "
    }

    jsonResponse = strings.TrimSuffix(jsonResponse, ", ")
    jsonResponse += "}"

    err = rows.Err()
    maybeError(w, http.StatusInternalServerError, err)

    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(jsonResponse))
}

func handler(w http.ResponseWriter, r *http.Request) {
    if r.Method == "POST" {
        insertIntoDb(w, r)
        w.WriteHeader(http.StatusCreated)
    } else if r.Method == "GET" {
        getFromDatabase(w, r)
    } else {
        w.WriteHeader(http.StatusNotImplemented)
    }
}

func getPort() string {
    if os.Getenv("API_PORT") != "" {
        return ":" + os.Getenv("API_PORT")
    }

    return ":8080"
}

func main() {
    http.HandleFunc("/temperature", handler)
    http.HandleFunc("/humidity", handler)
    http.HandleFunc("/brightness", handler)
    http.HandleFunc("/rain", handler)

    port := getPort()

    fmt.Println("API listen on port", port)
    log.Fatal(http.ListenAndServe(port, nil))
}
