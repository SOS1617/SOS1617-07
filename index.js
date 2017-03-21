"use strict";
/* global __dirname */

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";


var dbAlvaro;
var dbJose;

var MongoClient = require('mongodb').MongoClient;
var mdbURL = "mongodb://test:test@ds131890.mlab.com:31890/sos";

MongoClient.connect(mdbURL,{native_parser:true}, function(err, database){
    if(err){
        console.log("Cant connect to database" +err);
        process.exit(1);
    }
    
    
    dbAlvaro = database.collection("averageSalaryStats");
    dbJose = database.collection("investEducationStats");
    
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
    dbAlvaro.find({}).toArray( function (err, salaries) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending salaries: " + JSON.stringify(salaries, 2, null));
            response.send(salaries);
        }
    });
});


// GET a collection de paises en un mismo año 

app.get(BASE_API_PATH + "/salaries/:year", function (request, response) {
    var year = request.params.year;
    var country = request.params.year;
    if(isNaN(request.params.year.charAt(0))){
            if (!country) {
        console.log("WARNING: New GET request to /salaries/:country without name, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /salaries/" + country);
        dbAlvaro.find({country:country}).toArray(function (err, results) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (results.length > 0) { 
                    var result = results; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending result: " + JSON.stringify(result, 2, null));
                    response.send(result);
                } else {
                    console.log("WARNING: There are not any result with country " + country);
                    response.sendStatus(404); // not found
                }
        });
}
    }else{
    if (!year) {
        console.log("WARNING: New GET request to /salaries/:year without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /salaries/" + year);
        dbAlvaro.find({year:year}).toArray(function (err, results) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (results.length > 0) { 
                    var result = results; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending result: " + JSON.stringify(result, 2, null));
                    response.send(result);
                } else {
                    console.log("WARNING: There are not any result with year " + year);
                    response.sendStatus(404); // not found
                
                }
        });
}
}});


//GET a recurso concreto con 2 parametros

app.get(BASE_API_PATH + "/salaries/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    if (!country || !year) {
        console.log("WARNING: New GET request to /salaries/:country without name or without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /salaries/" + country + "/" + year);
        dbAlvaro.find({country:country, $and:[{year:year}]}).toArray(function (err, results) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (results.length > 0) { 
                    var result = results[0]; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending result: " + JSON.stringify(result, 2, null));
                    response.send(result);
                } else {
                    console.log("WARNING: There are not any country with name " + country +  "and year " + year);
                    response.sendStatus(404); // not found
                
                }
        });
}
});


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
            dbAlvaro.find({}).toArray( function (err, salaries) {
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
                        dbAlvaro.insert(newstat);
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
            dbAlvaro.find({}).toArray( function (err, salaries) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var salariesBeforeInsertion = salaries.filter((stat) => {
                        return (stat.country.localeCompare(country, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (salariesBeforeInsertion.length > 0) {
                        dbAlvaro.update({country: country}, updatedstat);
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
    dbAlvaro.remove({}, {multi: true}, function (err, numRemoved) {
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
app.delete(BASE_API_PATH + "/salaries/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    if (!country || !year) {
        console.log("WARNING: New DELETE request to /salaries/:country/:year without country and year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /salaries/" + country + " and year " + year);
        dbAlvaro.remove({country:country, $and:[{year:year}]}, {}, function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: Results removed: " + numRemoved);
                if (numRemoved === 1) {
                    console.log("INFO: The result with country " + country + "and year " + year + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no countries to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

////////////////////////////////////API JOSE/////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////



// Base GET
app.get("/", function (request, response) {
    console.log("INFO: Redirecting to /investEducationStats");
    response.redirect(301, BASE_API_PATH + "/investEducationStats");
});


// GET a collection
app.get(BASE_API_PATH + "/investEducationStats", function (request, response) {
    console.log("INFO: New GET request to /investEducationStats");
    dbJose.find({}).toArray( function (err, investEducationStat) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending investEducationStat: " + JSON.stringify(investEducationStat, 2, null));
            response.send(investEducationStat);
        }
    });
});



/*function isLetter(countryParam)
{
  return countryParam.match("^[a-zA-Z\(\)]+$");    
}*/

// GET a collection de paises en un mismo año 

app.get(BASE_API_PATH + "/investEducationStats/:year", function (request, response) {
    var year = request.params.year;
    var country = request.params.year;
    if(isNaN(request.params.year.charAt(0))){
            if (!country) {
        console.log("WARNING: New GET request to /investEducationStats/:country without name, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /investEducationStats/" + country);
        dbJose.find({country:country}).toArray(function (err, investEducationStats) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (investEducationStats.length > 0) { 
                    var investEducationStat = investEducationStats; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending investEducationStat: " + JSON.stringify(investEducationStat, 2, null));
                    response.send(investEducationStat);
                } else {
                    console.log("WARNING: There are not any investEducationStat with country " + country);
                    response.sendStatus(404); // not found
                }
        });
}
    }else{
    if (!year) {
        console.log("WARNING: New GET request to /investEducationStats/:year without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /investEducationStats/" + year);
        dbJose.find({year:year}).toArray(function (err, investEducationStats) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (investEducationStats.length > 0) { 
                    var investEducationStat = investEducationStats; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending investEducationStat: " + JSON.stringify(investEducationStat, 2, null));
                    response.send(investEducationStat);
                } else {
                    console.log("WARNING: There are not any investEducationStat with year " + year);
                    response.sendStatus(404); // not found
                
                }
        });
}
}});


//GET a recurso concreto con 2 parametros

app.get(BASE_API_PATH + "/investEducationStats/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    if (!country || !year) {
        console.log("WARNING: New GET request to /investEducationStats/:country without name or without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /investEducationStats/" + country + "/" + year);
        dbJose.find({country:country, $and:[{year:year}]}).toArray(function (err, investEducationStats) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (investEducationStats.length > 0) { 
                    var investEducationStat = investEducationStats[0]; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending investEducationStat: " + JSON.stringify(investEducationStat, 2, null));
                    response.send(investEducationStat);
                } else {
                    console.log("WARNING: There are not any country with name " + country +  "and year " + year);
                    response.sendStatus(404); // not found
                
                }
        });
}
});



//Load Initial Data
app.get(BASE_API_PATH + "/investEducationStats/loadInitialData",function(request, response) {
    
    mdbURL.find({}).toArray(function(err,investEducationStats){
        
         if (err) {
        console.error('WARNING: Error while getting initial data from DB');
        return 0;
    }
    
      if (investEducationStats.length === 0) {
        console.log('INFO: Empty DB, loading initial data');

              var investEducationStats = [{
                 "country": "usa",
                "year": "2010",
                "investEducationStat": "13,169",
                "healthExpenditureStat:": "17,017",
                "militaryExpenditureStat:":"17,79"
                
            },{
                 "country": "usa",
                "year": "2012",
                "investEducationStat": "13,169827347",
                "healthExpenditureStat:": "17,02423417",
                "militaryExpenditureStat:":"17,724234239"
                
            },
            {
                "country": "spain",
                "year": "2005",
                "investEducationStat": "10,781",
                "healthExpenditureStat:": "8,119",
                "militaryExpenditureStat::":"8,815"
            },
            {
               "country": "france",
                "year": "2011",
                "investEducationStat": "9,864",
                "healthExpenditureStat:": "11335",
                "militaryExpenditureStat:":"4,704"
            
            }];
        
    mdbURL.insert(investEducationStats);
      } else {
        console.log('INFO: DB has ' + investEducationStats.length + ' investEducationStats ');
    }
});
});


//POST over a collection
app.post(BASE_API_PATH + "/investEducationStats", function (request, response) {
    var newstat = request.body;
    if (!newstat) {
        console.log("WARNING: New POST request to /investEducationStats/ without stat, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /investEducationStats with body: " + JSON.stringify(newstat, 2, null));
        if (!newstat.country || !newstat.year ||  !newstat.investEducationStat || !newstat.healthExpenditureStat || !newstat.militaryExpenditureStat) {
            console.log("WARNING: The stat " + JSON.stringify(newstat, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbJose.find({}, function (err, investEducationStat) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var investEducationStatBeforeInsertion = investEducationStat.filter((stat) => {
                        return (stat.country.localeCompare(newstat.country, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (investEducationStatBeforeInsertion.length > 0) {
                        console.log("WARNING: The stat " + JSON.stringify(newstat, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding stat " + JSON.stringify(newstat, 2, null));
                        dbJose.insert(newstat);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//POST over a single resource
app.post(BASE_API_PATH + "/investEducationStats/:country", function (request, response) {
    var country = request.params.country;
    console.log("WARNING: New POST request to /investEducationStats/" + country + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(BASE_API_PATH + "/investEducationStats", function (request, response) {
    console.log("WARNING: New PUT request to /investEducationStats, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
app.put(BASE_API_PATH + "/investEducationStats/:country", function (request, response) {
    var updatedstat = request.body;
    var country = request.params.country;
    if (!updatedstat) {
        console.log("WARNING: New PUT request to /investEducationStats/ without stat, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /investEducationStats/" + country + " with data " + JSON.stringify(updatedstat, 2, null));
        if (!updatedstat.country || !updatedstat.year ||  !updatedstat.investEducationStat || !updatedstat.healthExpenditureStat || !updatedstat.militaryExpenditureStat) {
            console.log("WARNING: The stat " + JSON.stringify(updatedstat, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbJose.find({}, function (err, investEducationStat) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var investEducationStatBeforeInsertion = investEducationStat.filter((stat) => {
                        return (stat.country.localeCompare(country, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (investEducationStatBeforeInsertion.length > 0) {
                        dbJose.update({country: country}, updatedstat);
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
app.delete(BASE_API_PATH + "/investEducationStats", function (request, response) {
    console.log("INFO: New DELETE request to /investEducationStats");
    dbJose.remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved > 0) {
                console.log("INFO: All the investEducationStat (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no investEducationStat to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/investEducationStats/:country", function (request, response) {
    var country = request.params.country;
    if (!country) {
        console.log("WARNING: New DELETE request to /investEducationStats/:country without country, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /investEducationStats/" + country);
        dbJose.remove({country: country}, {}, function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: investEducationStat removed: " + numRemoved);
                if (numRemoved === 1) {
                    console.log("INFO: The stat with country " + country + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no investEducationStat to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
})