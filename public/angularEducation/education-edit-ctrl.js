angular
    .module("ManagerApp")
    .controller("JoseEditCtrl",["$scope", "$http","$location", function($scope, $http ,$location){
        
        $scope.url = "/api/v1/investEducationStats";

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
                    $scope.investEducationStats = response.data;
                });
            }   
    
    
    //GET A UN CONJUNTO CON PAGINACIÓN
        $scope.getDataPag = function(){
           
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.investEducationStats = response.data;
                });
            
        } ;
        
    //GET SIN PAGINACION
        $scope.getData = function(){
            $http
                .get($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    $scope.investEducationStats = response.data;
                    console.log( "Showing data "  );
                    

            });
                
      };
   
        //MÉTODO PARA AÑADIR UN PAÍS    
        $scope.addInvestEducationStats = function(){
            $http
            
                .post($scope.url+"?apikey="+ $scope.apikey, $scope.newInvestEducationStats)
                .then(function(response){
                    console.log($scope.investEducationStats.country + "stats added." );
                    refresh();
                });
        } ;
        
        
        //MÉTODO PARA MODIFICAR UN PAÍS    
        $scope.putInvestEducationStat = function(){
            $http
            
                .put($scope.url +"/"+ $scope.newInvestEducationStats.country + "/" +  $scope.newInvestEducationStats.year + "?apikey="+ $scope.apikey, $scope.newInvestEducationStats)
                .then(function(response){
                    console.log( $scope.newInvestEducationStats.country + "and year" + $scope.newInvestEducationStats.year + " stats has been modified. "  );
                    $location.path("/");
                });
        };
        
        //MÉTODO PARA ELIMINAR TODOS LOS PAISES
        $scope.deleteAllInvestEducationStats = function(){
            $http
                .delete($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    console.log("All stats delete");
                    refresh();
                });
        };
        
        //MÉTODO PARA BORRAR UN SALARIO
        $scope.deleteOneInvestEducationStat = function(country,year){
            $http
                .delete($scope.url +"/"+ country +"/"+ year +"/?apikey="+$scope.apikey)
                .then(function(response){
                    console.log("investEducationStats delete: ");
                    refresh();
                });
        } ;
        
        
        //MÉTODO PARA LAS BÚSQUEDAS
        $scope.searches = function(){
            $http
                .get($scope.url+"?apikey="+$scope.apikey+"&from="+$scope.newInvestEducationStats.from+"&to="+$scope.newInvestEducationStats.to)
                .then(function(response){
                    console.log("The btween year: "+$scope.newInvestEducationStats.from +" and year "+ $scope.newInvestEducationStats.to+ " works correctly");
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.investEducationStats = response.data; 
                });
        };
           
}]);