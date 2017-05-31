angular.module("ManagerApp").
controller("ApiExt3ChartCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (SalaryCorsChartCtrl)");
        
        var ret=[];
        $scope.apikey = "sos07";
        $scope.data = {};
        var dataCache = {};
        var dataCache1 = {};
        $scope.limit = [];
        $scope.datos=[];
        $scope.remaining= [];
        $scope.averageSalary = [];
        $scope.riskOfPoverty = [];
        $scope.year = [];

$http.get("/api/v1/salaries/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache1 = response.data;
            $scope.data1 = dataCache1;
            
            for(var i=0; i<$scope.data1.length; i++){
                
                $scope.datos.push(($scope.data1[i].country) + " " + $scope.data1[i].year);
                
            }

$http.get("https://api.github.com/gists/public").then(function(response){
                
                
            dataCache = response.data;
            $scope.data = dataCache;
            console.log($scope.data);
            for(var i=0; i<$scope.data1.length; i++){
                
                ret.push({"country and year":$scope.datos[i],
                "size":$scope.data[i].comments,
                
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
      ykeys: ['size'],
      // Labels for the ykeys -- will be displayed when you hover over the
      // chart.
      labels: ['comments']
    });
            });

});
}]);