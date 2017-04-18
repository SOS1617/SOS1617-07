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
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.stats = response.data;
                });
            }   
    
    
    //GET A UN CONJUNTO CON PAGINACIÓN
        $scope.getData = function(){
           
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.stats = response.data;
                    
                });
            
        } ;
   
        //MÉTODO PARA AÑADIR UN SALARIO    
        $scope.addStats = function(){
            $http
            //$scope.newSalary guarda el salario que le estoy metiendo
                .post($scope.url+"?apikey="+ $scope.apikey, $scope.newSalary)
                .then(function(response){
                    console.log($scope.newSalary.country + "salary added." );
                    refresh();
                });
        } ;
        
        
        //MÉTODO PARA MODIFICAR UN SALARIO    
        $scope.editStats = function(){
            $http
            //$scope.newSalary guarda el país que le estoy metiendo
                .put($scope.url +"/"+ $scope.newSalary.country + "?apikey="+ $scope.apikey, $scope.newSalary)
                .then(function(response){
                    console.log( $scope.newSalary.country + "a salary has been modified.. "  );
                    refresh();
                });
        };
        
        //MÉTODO PARA ELIMINAR TODOS LOS PAISES
        $scope.deleteAllStats = function(){
            $http
                .delete($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    console.log("All stats delete");
                    refresh();
                });
        };
        
        //MÉTODO PARA BORRAR UN PAÍS
        $scope.deleteOneCountry = function(country,year){
            $http
                .delete($scope.url +"/"+ country +"/"+ year +"/?apikey="+$scope.apikey)
                .then(function(response){
                    console.log("Salary  delete: "+ country);
                    refresh();
                });
        } ;
        
        
        //MÉTODO PARA LAS BÚSQUEDAS
        $scope.searches = function(){
            $http
                .get($scope.url+"?apikey="+$scope.apikey+"&country="+$scope.newCountry.country+"&year="+$scope.newCountry.year)
                .then(function(response){
                    console.log("The search of: "+$scope.newCountry.country +" in year "+ $scope.newCountry.year+ " works correctly");
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.stats = response.data; 
                });
        };
           
}]);  