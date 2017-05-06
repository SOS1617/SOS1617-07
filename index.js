var moment = require("moment");
var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var publicFolder = path.join(__dirname, '/public');

var apiAlvaro = require('./api/v1/apiAlvaro.js');

var apiJose = require('./api/v1/apiJose.js');

var gdp_per_capitaAPI = require('./api/v1/gdp-per-capita.js'); //Cambiar julio

var app = express();

var MongoClient = require('mongodb').MongoClient;
var mdbURL = "mongodb://test:test@ds131890.mlab.com:31890/sos";

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";
var dbJose;
var dbJf; //cMBIAR JULIO
var dbAlvaro;

var API_KEY = "sos07";

// Helper method to check for apikey
var apiKeyCheck = function(request, response) {
    if (!request.query.apikey) {
        console.error('WARNING: No apikey was sent!');
        response.sendStatus(401);
        return false;
    }
    if (request.query.apikey !== API_KEY) {
        console.error('WARNING: Incorrect apikey was used!');
        response.sendStatus(403);
        return false;
    }
    return true;
};

app.use(bodyParser.json());
app.use(helmet());

MongoClient.connect(mdbURL, {
    native_parser: true
}, function(err, database) {

    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }

    dbJose = database.collection("investEducationStats");
    dbJf = database.collection("gdp-per-capita"); //Cambiar julio
    dbAlvaro = database.collection("averageSalaryStats");

    apiAlvaro.register(app, dbAlvaro, BASE_API_PATH, apiKeyCheck);

    apiJose.register(app, dbJose, BASE_API_PATH, apiKeyCheck);

    gdp_per_capitaAPI.register(app, dbJf, BASE_API_PATH, apiKeyCheck); //Cambiar julio

    app.listen(port, () => {
        console.log("Magic is happening on port  " + port);
    });

});

app.use("/", express.static(publicFolder));

//Correr en postman

app.use("/api/v1/tests", express.static(path.join(__dirname, "public/tests.html")));
