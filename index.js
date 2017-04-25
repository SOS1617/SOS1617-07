"use strict";
/* global __dirname */

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";

var publicFolder = path.join(__dirname, 'public');


var dbAlvaro;
var dbJose;
var dbJulio;

var MongoClient = require('mongodb').MongoClient;
var mdbURL = "mongodb://test:test@ds131890.mlab.com:31890/sos";

MongoClient.connect(mdbURL,{native_parser:true}, function(err, database){
    if(err){
        console.log("Cant connect to database" +err);
        process.exit(1);
    }
    
    
    dbAlvaro = database.collection("averageSalaryStats");
    dbJose = database.collection("investEducationStats");
    dbJulio = database.collection("birthRateStats");
    
    ///////////////////CONEXIÓN CON MÓDULO JUlio////////////////////////////
       moduleJulio.register(app, dbJulio, BASE_API_PATH);
    //////////////////////////////////////////////////////////////////////////
     ///////////////////CONEXIÓN CON MÓDULO Alvaro////////////////////////////
       moduleSalaries.register(app, dbAlvaro, BASE_API_PATH);
    //////////////////////////////////////////////////////////////////////////
    
     ///////////////////CONEXIÓN CON MÓDULO Alvaro////////////////////////////
       moduleEducationStats.register(app, dbJose, BASE_API_PATH);
    //////////////////////////////////////////////////////////////////////////
    app.listen(port, () => {
        console.log("Magic is happening on port " + port);
    });
    
});




var app = express();



app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security1

app.use("/",express.static(publicFolder));

app.use("/api/v1/tests", express.static(path.join(__dirname , "public/tests.html")));
app.use("/", express.static(path.join(__dirname , "public/index.html")));



// @see: https://curlbuilder.com/
// @see: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
// @see: https://i.stack.imgur.com/whhD1.png
// @see: https://blog.agetic.gob.bo/2016/07/elegir-un-codigo-de-estado-http-deja-de-hacerlo-dificil/


///CREACIÓN DE LA APIKEY////


var apikey = "sos07";

//FUNCIÓN QUE COMPRUEBE EL APIKEY
function apiKeyCheck(request,response){
    var apik = request.query.apikey;
    var check = true;
    
    if(!apik){
        console.log("WARNING: Necesita introducir una apikey para acceder a los datos. Aquí está su apikey: "+ apikey);
        check = false;
        response.sendStatus(401);
    }else{
        if(apik != apikey){
            console.log("WARNING: La APIKEY introducida no es válida, aquí está la apikey válida "+ apikey);
            check=false;
            response.sendStatus(403);
        }
    }
    return check;
}
///////////////////URL ANGULAR/////////////////////////////
app.get(BASE_API_PATH+"/salaries-angular", function(request, response){
    response.sendfile(publicFolder + "/angularSalaries/index.html");
});

app.get(BASE_API_PATH+"/birthRateStats-angular", function(request, response){
    response.sendfile(publicFolder + "/angularBirthRateStats/index.html");
});
///////////////////////////////////////////////////////////////
////URL JOSE ANGULAR
app.get(BASE_API_PATH+"/investEducationStats-angular", function(request, response){
    response.sendfile(publicFolder + "/angularEducation/index.html");
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////API ALVARO////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Módulo con api Alvaro
var moduleSalaries = require("./apis/apiAlvaro.js");



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////API JOSE////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var moduleEducationStats= require("./apis/apiJose.js");

/*// Base GET
app.get("/", function (request, response) {
    console.log("INFO: Redirecting to /investEducationStats");
    response.redirect(301, BASE_API_PATH + "/investEducationStats");
});
*/


//app.use("/api/v1", express.static(path.join(__dirname , "tests")));




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////API JULIO////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var moduleJulio = require("./apis/apiJulio.js");


