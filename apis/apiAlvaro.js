var exports = module.exports = {};

exports.register = function(app, dbAlvaro, BASE_API_PATH) {
    
    
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
    
    
    
    //Load Initial Data
app.get(BASE_API_PATH + "/salaries/loadInitialData",function(request, response) {
    if(apiKeyCheck(request,response)==true){
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
    return;
      } else {
        console.log('INFO: DB has ' + salaries.length + ' salaries ');
        response.sendStatus(200);
        return;
    }
});
}
});

 // GET Collection (WITH SEARCH)

app.get(BASE_API_PATH + "/salaries", function (request, response) {
    if (!apiKeyCheck(request, response)) return;
    console.log("INFO: New GET request to /salaries");
    
         /*PRUEBA DE BUSQUEDA */
            var limit = parseInt(request.query.limit);
            var offset = parseInt(request.query.offset);
            var from = request.query.from;
            var to = request.query.to;
            var aux = [];
            var aux2= [];
            var aux3 = [];

            
            if (limit && offset >=0) {
            dbAlvaro.find({}).skip(offset).limit(limit).toArray(function(err, countries) {
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

                dbAlvaro.find({}).toArray(function(err, countries) {
                    if (err) {
                        console.error('ERROR from database');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        if (countries.length === 0) {
                            
                            response.sendStatus(204);
                            return;
                        }
                        console.log("INFO: Sending salaries: " + JSON.stringify(countries, 2, null));
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





/// GET a collection
/*
app.get(BASE_API_PATH + "/salaries", function (request, response) {
    console.log("INFO: New GET request to /salaries");
    if(apiKeyCheck(request,response)==true){
    dbAlvaro.find({}).toArray( function (err, salaries) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending salaries: " + JSON.stringify(salaries, 2, null));
            response.send(salaries);
        }
    });
    }
});
*/
// GET a collection de paises en un mismo año 

app.get(BASE_API_PATH + "/salaries/:year", function (request, response) {
    var year = request.params.year;
    var country = request.params.year;
    if(apiKeyCheck(request,response)==true){
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
}
}});


//GET a recurso concreto con 2 parametros

app.get(BASE_API_PATH + "/salaries/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    if(apiKeyCheck(request,response)==true){
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
}
});


//POST over a collection cambiar porque es copiado del de julio 
app.post(BASE_API_PATH + "/salaries", function (request, response) {
    var newSalaryStat = request.body;
    if(apiKeyCheck(request,response)==true){
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
                        return (salary.country.localeCompare(newSalaryStat.country  ,"en", {'sensitivity': 'base'}) === 0);
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
    }
});


//POST over a single resource
app.post(BASE_API_PATH + "/salaries/:country", function (request, response) {
    var country = request.params.country;
    if(apiKeyCheck(request,response)==true){
    console.log("WARNING: New POST request to /salaries/" + country + ", sending 405...");
    response.sendStatus(405); // method not allowed
    }
});


//PUT over a collection
app.put(BASE_API_PATH + "/salaries", function (request, response) {
    if(apiKeyCheck(request,response)==true){
    console.log("WARNING: New PUT request to /salaries, sending 405...");
    response.sendStatus(405); // method not allowed
    }
});


//PUT over a single resource
app.put(BASE_API_PATH + "/salaries/:country/:year", function (request, response) {
    var updatedStat = request.body;
    var country = request.params.country;
    var year = request.params.year;
    
    if(apiKeyCheck(request,response)==true){
    if (!updatedStat) {
        console.log("WARNING: New PUT request to /salaries/ without stat, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /salaries/" + country + " with data " + JSON.stringify(updatedStat, 2, null));
        if (!updatedStat.country || !updatedStat.year ||  !updatedStat.averageSalary || !updatedStat.minimumSalary || !updatedStat.riskOfPoverty) {
            console.log("WARNING: The stat " + JSON.stringify(updatedStat, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbAlvaro.find({country:country, $and:[{year:year}]}).toArray( function (err, provinces) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else if (provinces.length > 0) {
                        dbAlvaro.update({country: country, year: year}, updatedStat);
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
app.delete(BASE_API_PATH + "/salaries", function (request, response) {
    console.log("INFO: New DELETE request to /salaries");
    if(apiKeyCheck(request,response)==true){
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
    }
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/salaries/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    
    if(apiKeyCheck(request,response)==true){
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
    }
});
    
};