//Obtengo el modulo y creo el controlador sobre él
angular
    .module("birthRateStatsManagerApp")
    .controller("ListCtrl",["$scope", "$http", function($scope, $http){
        
        $scope.url = "/api/v1/birthRateStats";

        console.log("Controller initialized ");
        
        //CARGAR DATOS
        $scope.loadInitialData= function(){
            $http.get($scope.url+"/loadInitialData?apikey="+$scope.apikey)
            .then(function(){
                console.log("Load initial data: OK");
                refresh();
            });
        };
        
    function refresh(){
      
            $http
                .get($scope.url+"?apikey="+ $scope.apikey )
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.birthRateStats = response.data;
                });
            }   
    
    
    //GET A UN CONJUNTO CON PAGINACIÓN
        $scope.getDataPag = function(){
           
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.birthRateStats = response.data;
                });
            
        } ;
        
    //GET SIN PAGINACION
        $scope.getData = function(){
            $http
                .get($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    $scope.birthRateStats = response.data;
                    console.log( "Showing data "  );
                    

            });
                
      };
   
        //MÉTODO PARA AÑADIR UN PAÍS    
        $scope.addbirthRateStat = function(){
            $http
            //$scope.newbirthRateStat guarda el país que le estoy metiendo
                .post($scope.url+"?apikey="+ $scope.apikey, $scope.newbirthRateStat)
                .then(function(response){
                    console.log($scope.newbirthRateStat.country + "stats added." );
                    refresh();
                });
        } ;
        
        
        //MÉTODO PARA MODIFICAR UN PAÍS    
        $scope.putbirthRateStat = function(){
            $http
            //$scope.newbirthRateStat guarda el birthRateStat que le estoy metiendo
                .put($scope.url +"/"+ $scope.newbirthRateStat.country + "/" +  $scope.newbirthRateStat.year + "?apikey="+ $scope.apikey, $scope.newbirthRateStat)
                .then(function(response){
                    console.log( $scope.newbirthRateStat.country + "and year" + $scope.newbirthRateStat.year + " stats has been modified. "  );
                    refresh();
                });
        };
        
        //MÉTODO PARA ELIMINAR TODOS LOS PAISES
        $scope.deleteAllbirthRateStats = function(){
            $http
                .delete($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    console.log("All stats delete");
                    refresh();
                });
        };
        
        //MÉTODO PARA BORRAR UN SALARIO
        $scope.deleteOnebirthRateStat = function(country,year){
            $http
                .delete($scope.url +"/"+ country +"/"+ year +"/?apikey="+$scope.apikey)
                .then(function(response){
                    console.log("birthRateStat delete: ");
                    refresh();
                });
        } ;
        
        
        //MÉTODO PARA LAS BÚSQUEDAS
        $scope.searches = function(){
            $http
                .get($scope.url+"?apikey="+$scope.apikey+"&from="+$scope.newbirthRateStat.from+"&to="+$scope.newbirthRateStat.to)
                .then(function(response){
                    console.log("The btween year: "+$scope.newbirthRateStat.from +" and year "+ $scope.newbirthRateStat.to+ " works correctly");
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.birthRateStats = response.data; 
                });
        };
           
}]);