var exports = module.exports = {};

exports.register = function(app, dbJose, BASE_API_PATH,apiKeyCheck) {
    
    
///CREACIÓN DE LA APIKEY////





var apikey = "sos07";


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
                 "country": "england",
                "year": "2010",
                "investEducationStat": "13",
                "healthExpenditureStat": "17",
                "militaryExpenditureStat":"17"
                
            },{
                 "country": "usa",
                "year": "2012",
                "investEducationStat": "13",
                "healthExpenditureStat": "17",
                "militaryExpenditureStat":"17"
                
            },
            {
                "country": "spain",
                "year": "2005",
                "investEducationStat": "10",
                "healthExpenditureStat": "8",
                "militaryExpenditureStat":"8"
            },
            {
               "country": "france",
                "year": "2011",
                "investEducationStat": "9",
                "healthExpenditureStat": "11",
                "militaryExpenditureStat":"4"
            
            }];
        
    dbJose.insert(investEducationStat);
    response.sendStatus(201);
    return;
      } else {
        console.log('INFO: DB has ' + investEducationStats.length + ' investEducationStats ');
        response.sendStatus(200);
        return;
    }
});
});


// paginacion + busqueda + bla

app.get(BASE_API_PATH + "/investEducationStats", function (request, response) {
    if (!apiKeyCheck(request, response)) return;
    console.log("INFO: New GET request to /investEducationStats ");
    
         /*PRUEBA DE BUSQUEDA */
            var limit = parseInt(request.query.limit);
            var offset = parseInt(request.query.offset);
            var from = request.query.from;
            var to = request.query.to;
            var aux = [];
            var aux2= [];
            var aux3 = [];

            
            if (limit && offset >=0) {
            dbJose.find({}).skip(offset).limit(limit).toArray(function(err, countries) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                     response.sendStatus(500); // internal server error
                } else {
                     if (countries.length === 0) {
                            response.send(aux3);
                            return;
                        }
                    console.log("INFO: Sending countries:: " + JSON.stringify(countries, 2, null));
                    if (from && to) {

                            aux = buscador(countries, aux, from, to);
                            if (aux.length > 0) {
                                aux2 = aux.slice(offset, offset+limit);
                                console.log("INFO: Sending results with from and to and limit and offset: " + JSON.stringify(aux, 2, null));
                                console.log("INFO: Sending results with from and to and limit and offset: " + JSON.stringify(countries, 2, null));
                                console.log("INFO: Sending results with from and to and limit and offset: " + JSON.stringify(aux2, 2, null));
                                response.send(aux2);
                            }
                            else {
                                
                                response.send(404); // No content 
                                return;
                            }
                        }
                        else {
                            response.send(countries);
                        }
                }
            });
            
            }
            else {

                dbJose.find({}).toArray(function(err, countries) {
                    if (err) {
                        console.error('ERROR from database');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        if (countries.length === 0) {
                            
                            response.sendStatus(204);
                            return;
                        }
                        console.log("INFO: Sending investEducationStats: " + JSON.stringify(countries, 2, null));
                        if (from && to) {
                            aux = buscador(countries, aux, from, to);
                            if (aux.length > 0) {
                                response.send(aux);
                            }
                            else {
                                response.sendStatus(404); //No content
                                return;
                            }
                        }
                        else {
                            response.send(countries);
                        }
                    }
                });
            }

});




  
// SEARCH FUNCTION

var buscador = function(base, conjuntoauxiliar, desde, hasta) {

    var from = parseInt(desde);
    var to = parseInt(hasta);


    for (var j = 0; j < base.length; j++) {
        var anyo = base[j].year;
        if (to >= anyo && from <= anyo) {

            conjuntoauxiliar.push(base[j]);
        }
    }

    return conjuntoauxiliar;

};


// GET a collection de paises en un mismo año 

app.get(BASE_API_PATH + "/investEducationStats/:year", function (request, response) {
    if(apiKeyCheck(request,response)==true){
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
}
}});


//GET a recurso concreto con 2 parametros

app.get(BASE_API_PATH + "/investEducationStats/:country/:year", function (request, response) {
    if(apiKeyCheck(request,response)==true){
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
}
});


//POST over a collection 
app.post(BASE_API_PATH + "/investEducationStats", function (request, response) {
    if(apiKeyCheck(request,response)==true){
    var newEducationStat = request.body;
    if (!newEducationStat) {
        console.log("WARNING: New POST request to /investEducationStats/ without investEducationStat, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /investEducationStats with body: " + JSON.stringify(newEducationStat, 2, null));
        if (!newEducationStat.country || !newEducationStat.year ) {
            console.log("WARNING: The investEducationStat " + JSON.stringify(newEducationStat, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity1
        } else {
            dbJose.find().toArray(function (err, investEducationStats) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var investEducationStatsBeforeInsertation = investEducationStats.filter((investEducationStat) => {
                        return (investEducationStat.country.localeCompare(newEducationStat.country, "en", {'sensitivity': 'base'}) === 0) &&investEducationStat.year.localeCompare(newEducationStat.year, "en", {'sensitivity': 'base'}) === 0;
                        
                        
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
    }
});


//POST over a single resource
app.post(BASE_API_PATH + "/investEducationStats/:country", function (request, response) {
    if(apiKeyCheck(request,response)==true){
    var country = request.params.country;
    console.log("WARNING: New POST request to /investEducationStats/" + country + ", sending 405...");
    response.sendStatus(405); // method not allowed
    }
});


///PUT over a collection
app.put(BASE_API_PATH + "/investEducationStats", function (request, response) {
    if(apiKeyCheck(request,response)==true){
    console.log("WARNING: New PUT request to /salaries, sending 405...");
    response.sendStatus(405); // method not allowed
    }
});



//PUT over a single resource
app.put(BASE_API_PATH + "/investEducationStats/:country/:year", function (request, response) {
    if(apiKeyCheck(request,response)==true){
    var updatedStat = request.body;
    var country = request.params.country;
    var year = request.params.year;

    if (!updatedStat) {
        console.log("WARNING: New PUT request to /investEducationStats/ without stat, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /investEducationStats/" + country + " with data " + JSON.stringify(updatedStat, 2, null));
        if (!updatedStat.country || !updatedStat.year ||  !updatedStat.healthExpenditureStat || !updatedStat.militaryExpenditureStat || !updatedStat.investEducationStat) {
            console.log("WARNING: The stat " + JSON.stringify(updatedStat, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbJose.find({country:country, $and:[{year:year}]}).toArray( function (err, provinces) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else if (provinces.length > 0) {
                        dbJose.update({country: country, year: year}, updatedStat);
                        console.log("INFO: Modifying result with country " + country + " with data " + JSON.stringify(updatedStat, 2, null));
                        response.send(updatedStat); // return the updated contact
                    } else {
                        console.log("WARNING: There are not any result with province " + country);
                        response.sendStatus(404); // not found
                    }
                }
            )}
        }
    }
    });


//DELETE over a collection
app.delete(BASE_API_PATH + "/investEducationStats", function (request, response) {
    if(apiKeyCheck(request,response)==true){
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
                console.log("WARNING: There are no investEducationStats to delete");
                response.sendStatus(404); // not found
            }
        }
    });
    }
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/investEducationStats/:country/:year", function (request, response) {
    if(apiKeyCheck(request,response)==true){
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
    }
});
};