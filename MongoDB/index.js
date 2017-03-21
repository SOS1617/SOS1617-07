"use strict";
/* global __dirname */

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";


var db;

var MongoClient = require('mongodb').MongoClient;
var mdbURL = "mongodb://test:test@ds131890.mlab.com:31890/sos";

MongoClient.connect(mdbURL,{native_parser:true}, function(err, database){
    if(err){
        console.log("Cant connect to database" +err);
        process.exit(1);
    }
    db = database.collection("averageSalaryStats");
    app.listen(port, () => {
        console.log("Magic is happening on port " + port);
    });
    
});


var app = express();



app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security

// @see: https://curlbuilder.com/
// @see: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
// @see: https://i.stack.imgur.com/whhD1.png
// @see: https://blog.agetic.gob.bo/2016/07/elegir-un-codigo-de-estado-http-deja-de-hacerlo-dificil/





// GET a collection
app.get(BASE_API_PATH + "/salaries", function (request, response) {
    console.log("INFO: New GET request to /salaries");
    db.find({}).toArray( function (err, salaries) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending salaries: " + JSON.stringify(salaries, 2, null));
            response.send(salaries);
        }
    });
});

function isLetter(countryParam)
{
  return countryParam.match("^[a-zA-Z\(\)]+$");    
}


// GET a single resource
app.get(BASE_API_PATH + "/salaries/:country", function (request, response) {
    var countryParam = request.params.country;
    if(countryParam === "loadInitialData"){
        db.find({}).toArray(function (err, salaries) {
    console.log('INFO: Initialiting DB...');

    if (err) {
        console.error('WARNING: Error while getting initial data from DB');
        return 0;
    }
    if (salaries.length === 0) {
        console.log('INFO: Empty DB, loading initial Data');
        
            //db.insert(salary);
            response.redirect(BASE_API_PATH + "/salaries");
    } else {
        console.log('INFO: DB has ' + salaries.length + ' salaries ');
    }
});
        
    }else if(isLetter(countryParam)){    //lo que entra aqui es una letra, es decir, entra un pais, pero no funciona aun
        if (!countryParam) {
        console.log("WARNING: New GET request to /salaries/:country without country, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /salaries/" + countryParam);
        db.find({country:countryParam}).toArray( function (err, salaries) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                
                if (salaries.length > 0) {
                    var stat = salaries[0]; 
                    console.log("INFO: Sending stat: " + JSON.stringify(stat, 2, null));
                    response.send(stat);
                } else {
                    console.log("WARNING: There are not any stat with country " + countryParam);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
    }else{
        if (!countryParam) {         //ahora countryParam es un numero que corresponde al año
        console.log("WARNING: New GET request to /salaries/:year without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /salaries/" + countryParam);
        db.find({year:countryParam}).toArray( function (err, salaries) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                
                if (salaries.length > 0) {
                    var stat = salaries[0]; 
                    console.log("INFO: Sending stat: " + JSON.stringify(stat, 2, null));
                    response.send(stat);
                } else {
                    console.log("WARNING: There are not any stat with year " + countryParam);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
        
        
    
}});


//POST over a collection
app.post(BASE_API_PATH + "/salaries", function (request, response) {
    var newstat = request.body;
    if (!newstat) {
        console.log("WARNING: New POST request to /salaries/ without stat, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /salaries with body: " + JSON.stringify(newstat, 2, null));
        if (!newstat.country || !newstat.year ||  !newstat.averageSalary || !newstat.minimumSalary || !newstat.riskOfPoverty) {
            console.log("WARNING: The stat " + JSON.stringify(newstat, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            db.find({}).toArray( function (err, salaries) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var salariesBeforeInsertion = salaries.filter((stat) => {
                        return (stat.country.localeCompare(newstat.country, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (salariesBeforeInsertion.length > 0) {
                        console.log("WARNING: The stat " + JSON.stringify(newstat, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding stat " + JSON.stringify(newstat, 2, null));
                        db.insert(newstat);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//POST over a single resource
app.post(BASE_API_PATH + "/salaries/:country", function (request, response) {
    var country = request.params.country;
    console.log("WARNING: New POST request to /salaries/" + country + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(BASE_API_PATH + "/salaries", function (request, response) {
    console.log("WARNING: New PUT request to /salaries, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
app.put(BASE_API_PATH + "/salaries/:country", function (request, response) {
    var updatedstat = request.body;
    var country = request.params.country;
    if (!updatedstat) {
        console.log("WARNING: New PUT request to /salaries/ without stat, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /salaries/" + country + " with data " + JSON.stringify(updatedstat, 2, null));
        if (!updatedstat.country || !updatedstat.year ||  !updatedstat.averageSalary || !updatedstat.minimumSalary || !updatedstat.riskOfPoverty) {
            console.log("WARNING: The stat " + JSON.stringify(updatedstat, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            db.find({}).toArray( function (err, salaries) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var salariesBeforeInsertion = salaries.filter((stat) => {
                        return (stat.country.localeCompare(country, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (salariesBeforeInsertion.length > 0) {
                        db.update({country: country}, updatedstat);
                        console.log("INFO: Modifying stat with country " + country + " with data " + JSON.stringify(updatedstat, 2, null));
                        response.send(updatedstat); // return the updated stat
                    } else {
                        console.log("WARNING: There are not any stat with country " + country);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});


//DELETE over a collection
app.delete(BASE_API_PATH + "/salaries", function (request, response) {
    console.log("INFO: New DELETE request to /salaries");
    db.remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved > 0) {
                console.log("INFO: All the salaries (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no salaries to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/salaries/:country", function (request, response) {
    var country = request.params.country;
    if (!country) {
        console.log("WARNING: New DELETE request to /salaries/:country without country, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /salaries/" + country);
        db.remove({country: country}, {}, function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: salaries removed: " + numRemoved);
                if (numRemoved === 1) {
                    console.log("INFO: The stat with country " + country + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no salaries to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

