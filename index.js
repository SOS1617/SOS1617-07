var moment = require("moment");
var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var publicFolder = path.join(__dirname, '/public');
//FEEDBACK D03 inicializar cors
var cors = require("cors");

var apiAlvaro = require('./api/v1/apiAlvaro.js');

var apiJose = require('./api/v1/apiJose.js');

var apiJulio = require('./api/v1/apiJulio.js'); //Cambiar julio

var app = express();

var MongoClient = require('mongodb').MongoClient;
var mdbURL = "mongodb://test:test@ds131890.mlab.com:31890/sos";

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";
var dbJose;
var dbJulio; //cMBIAR JULIO
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

//FEEDBACK D03 inicializar cors
app.use(cors());

MongoClient.connect(mdbURL, {
    native_parser: true
}, function(err, database) {

    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }

    dbJose = database.collection("investEducationStats");
    dbJulio = database.collection("birthRateStats"); //Cambiar julio
    dbAlvaro = database.collection("averageSalaryStats");

    apiAlvaro.register(app, dbAlvaro, BASE_API_PATH, apiKeyCheck);

    apiJose.register(app, dbJose, BASE_API_PATH, apiKeyCheck);

    apiJulio.register(app, dbJulio, BASE_API_PATH, apiKeyCheck); //Cambiar julio

    app.listen(port, () => {
        console.log("Magic is happening on port  " + port);
    });

});

app.use("/", express.static(publicFolder));

//Correr en postman

app.use("/api/v1/tests", express.static(path.join(__dirname, "public/tests.html")));


//------------------------proxys--------------------------

// proxy Alvaro -G08 - minimum wages in some countries
app.get("/proxy/salaries", (req, res) => {
    console.log("INFO: New GET request to /proxy/salaries/");
    var http = require('http');

    var options = {
        host: 'sos1617-08.herokuapp.com',
        path: '/api/v1/wages?apikey=hf5HF86KvZ'
    };

    var request = http.request(options, (response) => {
        var input = '';

        response.on('data', function(chunk) {
            input += chunk;
        });

        response.on('end', function() {
            console.log("INFO: The Proxy request to /proxy/salaries/ worked correctly :)");
            res.send(input);
        });
    });

    request.on('error', function(e) {
        console.log("WARNING: New GET request to /proxy/salaries/ - ERROR TRYING TO ACCESS, sending 503...");
        res.sendStatus(503);
    });

    request.end();
  
});
