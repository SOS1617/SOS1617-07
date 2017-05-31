angular.module("ManagerApp").
controller("ApiExt2ChartCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
            
        
        var ret=[];
        
        $scope.apikey = "sos07";
        $scope.data = {};
         $scope.data1 = {};
        var dataCache = {};
        var dataCache1 = {};
        $scope.nombre = [];
        $scope.albums= [];
        $scope.datos=[];
        
        
        $scope.averageSalary = [];
        $scope.riskOfPoverty = [];
        $scope.year = [];
         function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        $http.get("/api/v1/salaries/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache1 = response.data;
            $scope.data1 = dataCache1;
            
            for(var i=0; i<$scope.data1.length; i++){
                
                $scope.datos.push(capitalizeFirstLetter($scope.data1[i].country) + " " + $scope.data1[i].year);
                
            }


$http.get("https://api.myjson.com/bins/1lzv8").then(function(response){
                
                
            dataCache = response.data;
            $scope.data = dataCache;
            for(var i=0; i<$scope.data.length; i++){
                console.log($scope.datos[i]);
                ret.push({"country and year":$scope.datos[i],
                "albums":$scope.data[i].albums,
          
          });
            }
            
            
            
            
            
          
     Morris.Bar({
        
      // ID of the element in which to draw the chart.
      element: 'myfirstchartext07',
      // Chart data records -- each entry in this array corresponds to a point on
      // the chart.
      
      data: ret,
      // The name of the data record attribute that contains x-values.
      xkey: ['country and year'] ,
      // A list of names of data record attributes that contain y-values.
      ykeys: ['albums'],
      // Labels for the ykeys -- will be displayed when you hover over the
      // chart.
      labels: ['albums']
    });

           
    });
        });
}]);