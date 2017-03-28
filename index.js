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
var dbJulio;

var MongoClient = require('mongodb').MongoClient;
var mdbURL = "mongodb://test:test@ds131890.mlab.com:31890/sos";

MongoClient.connect(mdbURL,{native_parser:true}, function(err, database){
    if(err){
        console.log("Cant connect to database" +err);
        process.exit(1);
    }
    
    
    dbAlvaro = database.collection("averageSalaryStats2");
    dbJose = database.collection("investEducationStats");
    dbJulio = database.collection("birthRateStats");
    
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////API ALVARO////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Boton del test POSTMAN

app.use("/api/v1", express.static(path.join(__dirname , "tests")));

//Load Initial Data
app.get(BASE_API_PATH + "/salaries/loadInitialData",function(request, response) {
    
    dbAlvaro.find({}).toArray(function(err,salaries){
        
         if (err) {
        console.error('WARNING: Error while getting initial data from DB');
        return 0;
    }
    
      if (salaries.length === 0) {
        console.log('INFO: Empty DB, loading initial data');

              var salary = [{
                "country": "usa",
                "year": "2010",
                "averageSalary": "34463",
                "minimumSalary": "8730",
                "riskOfPoverty": "15.1"
            },
            {
                "country": "spain",
                "year": "2005",
                "averageSalary": "20616",
                "minimumSalary": "610",
                "riskOfPoverty": "22"
            },
            {
                "country": "spain",
                "year": "2006",
                "averageSalary": "20617",
                "minimumSalary": "619",
                "riskOfPoverty": "21"
            },
            {
                "country": "france",
                "year": "2011",
                "averageSalary": "34693",
                "minimumSalary": "1367",
                "riskOfPoverty": "14"
            }
            ];
        
    dbAlvaro.insert(salary);
    response.sendStatus(201);
      } else {
        console.log('INFO: DB has ' + salaries.length + ' salaries ');
        response.sendStatus(200);
    }
});
});



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


//POST over a collection cambiar porque es copiado del de julio 
app.post(BASE_API_PATH + "/salaries", function (request, response) {
    var newSalaryStat = request.body;
    if (!newSalaryStat) {
        console.log("WARNING: New POST request to /salaries/ without salaryStat, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /salaries with body: " + JSON.stringify(newSalaryStat, 2, null));
        if (!newSalaryStat.country || !newSalaryStat.year || !newSalaryStat.averageSalary) {
            console.log("WARNING: The salaryStat " + JSON.stringify(newSalaryStat, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbAlvaro.find().toArray(function (err, salaries) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var salariesBeforeInsertion = salaries.filter((salary) => {
                        return (salary.country.localeCompare(newSalaryStat.country, "en", {'sensitivity': 'base'}) === 0);
                        
                        
     });
                        
                        
                    if (salariesBeforeInsertion.length > 0) {
                        console.log("WARNING: The newSalaryStat " + JSON.stringify(newSalaryStat, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding salary " + JSON.stringify(newSalaryStat, 2, null));
                        dbAlvaro.insert(newSalaryStat);
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
        if (!updatedstat.country || !updatedstat.year ) {
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
    dbAlvaro.remove({}, {multi: true}, function (err, result) {
        var numRemoved = JSON.parse(result);
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved.n > 0) {
                console.log("INFO: All the salaries (" + numRemoved.n + ") have been succesfully deleted, sending 204...");
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
        console.log("WARNING: New DELETE request to /salaries/:country/:year without country or year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /salaries/" + country + " and year " + year);
        dbAlvaro.remove({country:country, $and:[{"year":year}]}, {}, function (err, result) {
        var numRemoved = JSON.parse(result);   
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: Salaries removed: " + numRemoved.n);
                if (numRemoved.n === 1) {
                    console.log("INFO: The salary with country " + country + " and year " + year + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); //no content
                } else {
                    console.log("WARNING: There are no countries to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////API JOSE////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*// Base GET
app.get("/", function (request, response) {
    console.log("INFO: Redirecting to /investEducationStats");
    response.redirect(301, BASE_API_PATH + "/investEducationStats");
});
*/


app.use("/api/v1", express.static(path.join(__dirname , "tests")));

//Load Initial Data
app.get(BASE_API_PATH + "/investEducationStats/loadInitialData",function(request, response) {
    
    dbJose.find({}).toArray(function(err,investEducationStats){
        
         if (err) {
        console.error('WARNING: Error while getting initial data from DB');
        return 0;
    }
    
      if (investEducationStats.length === 0) {
        console.log('INFO: Empty DB, loading initial data');

              var investEducationStat = [{
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
        
    dbJose.insert(investEducationStat);
    response.sendStatus(201);
      } else {
        console.log('INFO: DB has ' + investEducationStats.length + ' investEducationStats ');
        response.sendStatus(200);
    }
});
});



// GET a collection
app.get(BASE_API_PATH + "/investEducationStats", function (request, response) {
    console.log("INFO: New GET request to /investEducationStats");
    dbJose.find({}).toArray( function (err, investEducationStats) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending investEducationStats: " + JSON.stringify(investEducationStats, 2, null));
            response.send(investEducationStats);
        }
    });
});


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
        dbJose.find({country:country}).toArray(function (err, results) {
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
        console.log("WARNING: New GET request to /investEducationStats/:year without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /investEducationStats/" + year);
        dbJose.find({year:year}).toArray(function (err, results) {
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

app.get(BASE_API_PATH + "/investEducationStats/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    if (!country || !year) {
        console.log("WARNING: New GET request to /investEducationStats/:country without name or without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /investEducationStats/" + country + "/" + year);
        dbJose.find({country:country, $and:[{year:year}]}).toArray(function (err, results) {
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
app.post(BASE_API_PATH + "/investEducationStats", function (request, response) {
    var newEducationStat = request.body;
    if (!newEducationStat) {
        console.log("WARNING: New POST request to /investEducationStats/ without investEducationStat, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /investEducationStats with body: " + JSON.stringify(newEducationStat, 2, null));
        if (!newEducationStat.country || !newEducationStat.year ) {
            console.log("WARNING: The investEducationStat " + JSON.stringify(newEducationStat, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbJose.find().toArray(function (err, investEducationStats) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var investEducationStatsBeforeInsertation = investEducationStats.filter((investEducationStat) => {
                        return (investEducationStat.country.localeCompare(newEducationStat.country, "en", {'sensitivity': 'base'}) === 0);
                        
                        
     });
                        
                        
                    if (investEducationStatsBeforeInsertation.length > 0) {
                        console.log("WARNING: The newEducationStat " + JSON.stringify(newEducationStat, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding investEducationStat " + JSON.stringify(newEducationStat, 2, null));
                        dbJose.insert(newEducationStat);
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
    console.log("WARNING: New PUT request to /salaries, sending 405...");
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
        if (!updatedstat.country || !updatedstat.year ) {
            console.log("WARNING: The stat " + JSON.stringify(updatedstat, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbJose.find({}).toArray( function (err, investEducationStats) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var investEducationStatBeforeInsertion = investEducationStats.filter((stat) => {
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
    dbJose.remove({}, {multi: true}, function (err, result) {
        var numRemoved = JSON.parse(result);
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved.n > 0) {
                console.log("INFO: All the investEducationStats (" + numRemoved.n + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no salaries to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/investEducationStats/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    
    if (!country || !year) {
        console.log("WARNING: New DELETE request to /investEducationStats/:country/:year without country or year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /investEducationStats/" + country + " and year " + year);
        dbJose.remove({country:country, $and:[{"year":year}]}, {}, function (err, result) {
        var numRemoved = JSON.parse(result);   
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: investEducationStats removed: " + numRemoved.n);
                if (numRemoved.n === 1) {
                    console.log("INFO: The investEducationStat with country " + country + " and year " + year + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); //no content
                } else {
                    console.log("WARNING: There are no countries to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////API JULIO////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////



app.get(BASE_API_PATH + "/birthRateStats/loadInitialData",function(request, response) {
    
    dbJulio.find({}).toArray(function(err,birthRateStats){
        
         if (err) {
        console.error('WARNING: Error while getting initial data from DB');
        return 0;
    }
    
      if (birthRateStats.length === 0) {
        console.log('INFO: Empty DB, loading initial data');

              var birthRateStats = [{
                "country": "USA",
                "year": "2010",
                "birtRate": "13",
                "lifeExpectancy": "78.541",
                "mortalityRate": "8"
                
            },
            {
                "country": "Spain",
                "year": "2005",
                "birtRate": "10.6",
                "lifeExpectancy": "80.171",
                "mortalityRate": "8.8"
            }];
        
    dbJulio.insert(birthRateStats);
    response.sendStatus(201);
      } else {
        console.log('INFO: DB has ' + birthRateStats.length + ' birthRateStats ');
        response.sendStatus(200);
    }
});
});



// GET a collection
app.get(BASE_API_PATH + "/birthRateStats", function (request, response) {
    
    console.log("INFO: New GET request to /birthRateStats");
    dbJulio.find({}).toArray(function (err, birthRateStats) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending birthRateStats: " + JSON.stringify(birthRateStats, 2, null));
            response.send(birthRateStats);
        }
    });
});

// GET a collection  year

app.get(BASE_API_PATH + "/birthRateStats/:year", function (request, response) {
    var year = request.params.year;
    var country = request.params.year;

    if(isNaN(request.params.year.charAt(0))){
        

            if (!country) {
        console.log("WARNING: New GET request to /birthRateStats/:country without name, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /birthRateStats/" + country);
        dbJulio.find({country:country}).toArray(function (err, birthRateStats) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (birthRateStats.length > 0) { 
                    var birthRateStat = birthRateStats; //since we expect to have exactly ONE birthRateStat with this name
                    console.log("INFO: Sending birthRateStat: " + JSON.stringify(birthRateStat, 2, null));
                    response.send(birthRateStat);
                } else {
                    console.log("WARNING: There are not any birthRateStat with country " + country);
                    response.sendStatus(404); // not found
                
                }
        });

}
    }else{

    if (!year) {
        console.log("WARNING: New GET request to /birthRateStats/:year without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /birthRateStats/" + year);
        dbJulio.find({year:year}).toArray(function (err, birthRateStats) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (birthRateStats.length > 0) { 
                    var birthRateStat = birthRateStats; //since we expect to have exactly ONE birthRateStat with this name
                    console.log("INFO: Sending birthRateStat: " + JSON.stringify(birthRateStat, 2, null));
                    response.send(birthRateStat);
                } else {
                    console.log("WARNING: There are not any birthRateStat with year " + year);
                    response.sendStatus(404); // not found
                
                }
        });
}
    
}});





// Get recurso concreto
app.get(BASE_API_PATH + "/birthRateStats/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    if (!country || !year) {
        console.log("WARNING: New GET request to /birthRateStats/:country without name or without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /birthRateStats/" + country + "/" + year);
        dbJulio.find({country:country, $and:[{year:year}]}).toArray(function (err, birthRateStats) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (birthRateStats.length > 0) { 
                    var birthRateStat = birthRateStats[0]; //since we expect to have exactly ONE birthRateStat with this name
                    console.log("INFO: Sending birthRateStat: " + JSON.stringify(birthRateStat, 2, null));
                    response.send(birthRateStat);
                } else {
                    console.log("WARNING: There are not any country with name " + country +  "and year " + year);
                    response.sendStatus(404); // not found
                
                }
        });
}
});

//POST a una colección

app.post(BASE_API_PATH + "/birthRateStats", function (request, response) {
    var newbirthRateStat = request.body;
    if (!newbirthRateStat) {
        console.log("WARNING: New POST request to /birthRateStats/ without birthRateStat, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /birthRateStats with body: " + JSON.stringify(newbirthRateStat, 2, null));
        if (!newbirthRateStat.country || !newbirthRateStat.year || !newbirthRateStat.birtRate || !newbirthRateStat.lifeExpectancy || !newbirthRateStat.mortalityRate) {
            console.log("WARNING: The birthRateStat " + JSON.stringify(newbirthRateStat, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbJulio.find({country:newbirthRateStat.country, $and:[{year:newbirthRateStat.year}]}).toArray(function (err, birthRateStats) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var birthRateStatsBeforeInsertion = birthRateStats.filter((birthRateStat) => {
                        return (birthRateStat.country.localeCompare(birthRateStat.country, "en", {'sensitivity': 'base'}) === 0);
                      
                      
                     
});

                    if (birthRateStatsBeforeInsertion.length > 0) {
                        console.log("WARNING: The birthRateStat " + JSON.stringify(newbirthRateStat, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding birthRateStat " + JSON.stringify(newbirthRateStat, 2, null));
                        dbJulio.insert(newbirthRateStat);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//Post a un recurso 

app.post(BASE_API_PATH + "/birthRateStats/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    console.log("WARNING: New POST request to /country/" + country + " and year " + year + ", sending 405...");
    response.sendStatus(405); // method not allowed
});



//Put a una coleccion

app.put(BASE_API_PATH + "/birthRateStats", function (request, response) {
    console.log("WARNING: New PUT request to /birthRateStats, sending 405...");
    response.sendStatus(405); // method not allowed
});


// Delete a un recurso concreto

app.delete(BASE_API_PATH + "/birthRateStats/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    if (!country || !year) {
        console.log("WARNING: New DELETE request to /salaries/:country/:year without country and year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /birthRateStats/" + country + " and year " + year);
        dbJulio.remove({country:country, $and:[{year:year}]}, {}, function (err, res) {
            var numRemoved = JSON.parse(res);
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: Results removed: " + numRemoved);
                if (numRemoved.n === 1) {
                    console.log("INFO: The result with country " + country + "and year " + year + " has been succesfully deleted, sending 200...");
                    response.sendStatus(200); // no content
                } else {
                    console.log("WARNING: There are no countries to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});



//PUT sobre un recurso concreto

app.put(BASE_API_PATH + "/birthRateStats/:country/:year", function (request, response) {
    var updatedbirthRateStat = request.body;
    var country = request.params.country;
    var year = request.params.year;
    if (!updatedbirthRateStat) {
        console.log("WARNING: New PUT request to /birthRateStats/ without birthRateStat, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /birthRateStats/" + country + " with data " + JSON.stringify(updatedbirthRateStat, 2, null));
        if (!updatedbirthRateStat.country || !updatedbirthRateStat.year || !updatedbirthRateStat.birtRate || !updatedbirthRateStat.lifeExpectancy || !updatedbirthRateStat.mortalityRate || updatedbirthRateStat.country !== country || updatedbirthRateStat.year !== year) {
            console.log("WARNING: The birthRateStat " + JSON.stringify(updatedbirthRateStat, 2, null) + " is not well-formed, sending 400...");
            response.sendStatus(400); // bad request
        } else {
            dbJulio.find({country:updatedbirthRateStat.country, $and:[{year:updatedbirthRateStat.year}]}).toArray(function (err, birthRateStats) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else if (birthRateStats.length > 0) {
                        dbJulio.update({country: updatedbirthRateStat.country, year: updatedbirthRateStat.year}, updatedbirthRateStat);
                        console.log("INFO: Modifying birthRateStat with country " + country + " with data " + JSON.stringify(updatedbirthRateStat, 2, null));
                        response.send(updatedbirthRateStat); // return the updated contact
                    } else {
                        console.log("WARNING: There are not any birthRateStats with country " + country);
                        response.sendStatus(404); // not found
                    }
                }
            )}
        }
    })




//DELETE a una coleccion
app.delete(BASE_API_PATH + "/birthRateStats", function (request, response) {
    console.log("INFO: New DELETE request to /birthRateStats");
    dbJulio.remove({}, {multi: true}, function (err, result) {
        var numRemoved = JSON.parse(result);
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved.n > 0) {
                console.log("INFO: All the birthRateStats (" + numRemoved.n + ") have been succesfully deleted, sending 200...");
                response.sendStatus(200); // no content
            } else {
                console.log("WARNING: There are no birthRateStats to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});