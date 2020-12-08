const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000; 
const cors = require("cors");
const mysql = require('mysql')
const bodyParser = require('body-parser')

// set up body parsing
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors());

require('dotenv').config();

// set up our database
const pool = mysql.createPool({
    waitForConnections: false,
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: process.env.SQL_PASSWORD,
    database: 'achord',
    multipleStatements: true
})

app.get("/", (req, res) => {
});

// post request to add outputs from searches to the SQL database
app.post("/add", (req, res) => {
    var source = req.body.source;
    var target = req.body.target;
    var path = "";
    req.body.path.forEach(element => {
        path += ";" + element;
    });
    var trackPath = ""
    req.body.trackPath.forEach(element => {
        trackPath += ";" + element;
    })
    var flag = 0;
    if (req.body.bool) {
        flag = 1;
    }
    console.log("Outside connection");
    pool.getConnection(function (err, connection) {
        console.log("Entered connection")
        if (err) throw err;
        connection.query({
            sql: "INSERT INTO searches (source, target, path, trackPath, success) VALUES (?, ?, ?, ?, ?); SELECT * FROM searches;",
            values: [source, target, path, trackPath, flag]
        }, function (err, result) {
            if (err) {
                console.error(err);
                res.send("Could not add search");
                return;
            }
            connection.release();
            res.send(result);
            console.log("Post request handled");
            return;
        });
    });
});

// get request to obtain all elements of the stored table of searches
app.get("/dummy", (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query({
            sql: "SELECT * FROM searches;",
            values: []
        }, function (err, result) {
            if (err) {
                console.error(err);
                res.send("Could not find entry");
                return;
            }
            connection.release();
            res.send(result);
        })
    })
    return;
});

// get request to obtain the last search row added to the stored table of searches
app.get("/result", (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query({
            sql: "SELECT success, path, trackPath FROM searches ORDER BY searchID DESC LIMIT 1;",
            values: []
        }, function (err, result) {
            if (err) {
                console.error(err);
                res.send("Could not find entry");
                return;
            }
            connection.release();
            res.send(result);
        })
    })
});

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}.`);
});