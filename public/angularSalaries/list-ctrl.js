//Obtengo el modulo y creo el controlador sobre él
angular
    .module("SalariesManagerApp")
    .controller("ListCtrl",["$scope", "$http", function($scope, $http){
        
        $scope.url = "/api/v1/salaries";

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
                    $scope.salaries = response.data;
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
        $scope.addSalary = function(){
            $http
            //$scope.newSalary guarda el país que le estoy metiendo
                .post($scope.url+"?apikey="+ $scope.apikey, $scope.newSalary)
                .then(function(response){
                    console.log($scope.newSalary.country + "stats added." );
                    refresh();
                });
        } ;
        
        
        //MÉTODO PARA MODIFICAR UN PAÍS    
        $scope.putSalary = function(){
            $http
            //$scope.newSalary guarda el salary que le estoy metiendo
                .put($scope.url +"/"+ $scope.newSalary.country + "/" +  $scope.newSalary.year + "?apikey="+ $scope.apikey, $scope.newSalary)
                .then(function(response){
                    console.log( $scope.newSalary.country + "and year" + $scope.newSalary.year + " stats has been modified. "  );
                    refresh();
                });
        };
        
        //MÉTODO PARA ELIMINAR TODOS LOS PAISES
        $scope.deleteAllSalaries = function(){
            $http
                .delete($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    console.log("All stats delete");
                    refresh();
                });
        };
        
        //MÉTODO PARA BORRAR UN SALARIO
        $scope.deleteOneSalary = function(country,year){
            $http
                .delete($scope.url +"/"+ country +"/"+ year +"/?apikey="+$scope.apikey)
                .then(function(response){
                    console.log("Salary delete: ");
                    refresh();
                });
        } ;
        
        
        //MÉTODO PARA LAS BÚSQUEDAS
        $scope.searches = function(){
            $http
                .get($scope.url+"?apikey="+$scope.apikey+"&from="+$scope.newSalary.from+"&to="+$scope.newSalary.to)
                .then(function(response){
                    console.log("The btween year: "+$scope.newSalary.from +" and year "+ $scope.newSalary.to+ " works correctly");
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.salaries = response.data; 
                });
        };
           
}]);