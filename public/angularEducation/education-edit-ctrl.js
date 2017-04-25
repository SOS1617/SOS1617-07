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
                    $scope.investEducationStat = response.data;
                });
            }   
    
    
    //GET A UN CONJUNTO CON PAGINACIÓN
        $scope.getDataPag = function(){
           
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.investEducationStat = response.data;
                });
            
        } ;
        
    //GET SIN PAGINACION
        $scope.getData = function(){
            $http
                .get($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    $scope.investEducationStat = response.data;
                    console.log( "Showing data "  );
                    

            });
                
      };
   
        //MÉTODO PARA AÑADIR UN PAÍS    
        $scope.addInvestEducationStat = function(){
            $http
            
                .post($scope.url+"?apikey="+ $scope.apikey, $scope.newInvestEducationStat)
                .then(function(response){
                    console.log($scope.investEducationStat.country + "stats added." );
                    refresh();
                });
        } ;
        
        
        //MÉTODO PARA MODIFICAR UN PAÍS    
        $scope.putInvestEducationStat = function(){
            $http
            
                .put($scope.url +"/"+ $scope.newInvestEducationStat.country + "/" +  $scope.newInvestEducationStat.year + "?apikey="+ $scope.apikey, $scope.newInvestEducationStat)
                .then(function(response){
                    console.log( $scope.newInvestEducationStat.country + "and year" + $scope.newInvestEducationStat.year + " stats has been modified. "  );
                     $location.path("/investEducationStats");
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
                .get($scope.url+"?apikey="+$scope.apikey+"&from="+$scope.newInvestEducationStat.from+"&to="+$scope.newInvestEducationStat.to)
                .then(function(response){
                    console.log("The btween year: "+$scope.newInvestEducationStat.from +" and year "+ $scope.newInvestEducationStat.to+ " works correctly");
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.investEducationStats = response.data; 
                });
        };
           
}]);