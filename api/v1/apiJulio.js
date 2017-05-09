var exports = module.exports = {};

exports.register = function(app, dbJulio, BASE_API_PATH,apiKeyCheck) {
    
    
///CREACIÓN DE LA APIKEY////

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


var apikey = "sos07";


//Load Initial Data
app.get(BASE_API_PATH + "/birthRateStats/loadInitialData",function(request, response) {
    if(apiKeyCheck(request,response)==true){
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
                "birthRate": "13",
                "lifeExpectancy": "78.541",
                "mortalityRate": "8"
                
            },
            {
                "country": "Spain",
                "year": "2005",
                "birthRate": "10.6",
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
}
});


app.get(BASE_API_PATH + "/birthRateStats", function (request, response) {
    if (!apiKeyCheck(request, response)) return;
    console.log("INFO: New GET request to /birthRateStats");
    
         /*PRUEBA DE BUSQUEDA */
            var limit = parseInt(request.query.limit);
            var offset = parseInt(request.query.offset);
            var from = request.query.from;
            var to = request.query.to;
            var aux = [];
            var aux2= [];

            
            if (limit && offset >=0) {
            dbJulio.find({}).skip(offset).limit(limit).toArray(function(err, countries) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                     response.sendStatus(500); // internal server error
                } else {
                     if (countries.length === 0) {
                            response.sendStatus(404);
                        }
                    console.log("INFO: Sending countries: " + JSON.stringify(countries, 2, null));
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
                                response.sendStatus(404); // No content 
                            }
                        }
                        else {
                            response.send(countries);
                        }
                }
            });
            
            }
            else {

                dbJulio.find({}).toArray(function(err, countries) {
                    if (err) {
                        console.error('ERROR from database');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        if (countries.length === 0) {
                            response.sendStatus(204);
                            return;
                        }
                        console.log("INFO: Sending contacts: " + JSON.stringify(countries, 2, null));
                        if (from && to) {
                            aux = buscador(countries, aux, from, to);
                            if (aux.length > 0) {
                                console.log("busqueda");
                                response.send(aux);
                            }
                            else {
                                response.sendStatus(404); //No content
                            }
                        }
                        else {
                            response.send(countries);
                        }
                    }
                });
            }

});

// GET a collection
/*app.get(BASE_API_PATH + "/birthRateStats", function (request, response) {
    
    console.log("INFO: New GET request to /birthRateStats");
    if(apiKeyCheck(request,response)==true){
    dbJulio.find({}).toArray(function (err, birthRateStats) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending birthRateStats: " + JSON.stringify(birthRateStats, 2, null));
            response.send(birthRateStats);
        }
    });
    }
});
*/
// GET a collection  year

app.get(BASE_API_PATH + "/birthRateStats/:year", function (request, response) {
    var year = request.params.year;
    var country = request.params.year;
    if(apiKeyCheck(request,response)==true){
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
}
    
}});





// Get recurso concreto
app.get(BASE_API_PATH + "/birthRateStats/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    if(apiKeyCheck(request,response)==true){
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
}
});

//POST a una colección

app.post(BASE_API_PATH + "/birthRateStats", function (request, response) {
    var newbirthRateStat = request.body;
    if(apiKeyCheck(request,response)==true){
    if (!newbirthRateStat) {
        console.log("WARNING: New POST request to /birthRateStats/ without birthRateStat, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /birthRateStats with body: " + JSON.stringify(newbirthRateStat, 2, null));
        if (!newbirthRateStat.country || !newbirthRateStat.year || !newbirthRateStat.birthRate || !newbirthRateStat.lifeExpectancy || !newbirthRateStat.mortalityRate) {
            console.log("WARNING: The birthRateStat " + JSON.stringify(newbirthRateStat, 2, null) + " is not well-formed, sending 400...");
            response.sendStatus(400); // unprocessable entity
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
    }
});


//Post a un recurso 

app.post(BASE_API_PATH + "/birthRateStats/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    if(apiKeyCheck(request,response)==true){
    console.log("WARNING: New POST request to /country/" + country + " and year " + year + ", sending 405...");
    response.sendStatus(405); // method not allowed
    }
});



//Put a una coleccion

app.put(BASE_API_PATH + "/birthRateStats", function (request, response) {
    if(apiKeyCheck(request,response)==true){
    console.log("WARNING: New PUT request to /birthRateStats, sending 405...");
    
    response.sendStatus(405); // method not allowed
    }
});


// Delete a un recurso concreto

app.delete(BASE_API_PATH + "/birthRateStats/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    if(apiKeyCheck(request,response)==true){
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
    }
});



//PUT sobre un recurso concreto

app.put(BASE_API_PATH + "/birthRateStats/:country/:year", function (request, response) {
    var updatedbirthRateStat = request.body;
    var country = request.params.country;
    var year = request.params.year;
    if(apiKeyCheck(request,response)==true){
    if (!updatedbirthRateStat) {
        console.log("WARNING: New PUT request to /birthRateStats/ without birthRateStat, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /birthRateStats/" + country + " with data " + JSON.stringify(updatedbirthRateStat, 2, null));
        if (!updatedbirthRateStat.country || !updatedbirthRateStat.year || !updatedbirthRateStat.birthRate || !updatedbirthRateStat.lifeExpectancy || !updatedbirthRateStat.mortalityRate || updatedbirthRateStat.country !== country || updatedbirthRateStat.year !== year) {
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
    }
    });




//DELETE a una coleccion
app.delete(BASE_API_PATH + "/birthRateStats", function (request, response) {
    console.log("INFO: New DELETE request to /birthRateStats");
    if(apiKeyCheck(request,response)==true){
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
    }
});
};