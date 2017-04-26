angular
    .module("ManagerApp")
    .controller("SalaryEditCtrl",["$scope", "$http" ,"$location", function($scope, $http,$location){
        
        $scope.url = "/api/v1/salaries/";
        $scope.apikey = "sos07";

        console.log("Salary Controller initialized ");
        
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
                    $scope.salaries = response.data;
                });
            
        } ;
        
    //GET SIN PAGINACION
        $scope.getData = function(){
            $http
                .get($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    $scope.salaries = response.data;
                    console.log( "Showing data "  );
                    

            });
                
      };
   
        //MÉTODO PARA AÑADIR UN PAÍS    
        $scope.addbirthRateStat = function(){
            $http
            //$scope.newSalaryStat guarda el país que le estoy metiendo
                .post($scope.url+"?apikey="+ $scope.apikey, $scope.newSalaryStat)
                .then(function(response){
                    console.log($scope.newSalaryStat.country + "stats added." );
                    refresh();
                });
        } ;
        
        
        //MÉTODO PARA MODIFICAR UN PAÍS    
        $scope.putSalaryStat = function(){
            $http
            //$scope.newSalaryStat guarda el birthRateStat que le estoy metiendo
                .put($scope.url +"/"+ $scope.newSalaryStat.country + "/" +  $scope.newSalaryStat.year + "?apikey="+ $scope.apikey, $scope.newSalaryStat)
                .then(function(response){
                    console.log( $scope.newSalaryStat.country + "and year" + $scope.newSalaryStat.year + " stats has been modified. "  );
                     
                    $location.path("/salaries");
                    $scope.getData();
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
                .get($scope.url+"?apikey="+$scope.apikey+"&from="+$scope.newSalaryStat.from+"&to="+$scope.newSalaryStat.to)
                .then(function(response){
                    console.log("The btween year: "+$scope.newSalaryStat.from +" and year "+ $scope.newSalaryStat.to+ " works correctly");
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.birthRateStats = response.data; 
                });
        };
           
}]);