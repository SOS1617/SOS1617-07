angular.module("ManagerApp").
controller("ApiExt2ChartCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    
        
        $scope.apikey = "sos07";
        $scope.data = {};
        var dataCache = {};
        $scope.nombre = [];
        $scope.albums= [];
        
        
        $scope.averageSalary = [];
        $scope.riskOfPoverty = [];
        $scope.year = [];


$http.get("https://api.myjson.com/bins/1lzv8").then(function(response){
                
                
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<response.data.length; i++){
                $scope.nombre.push($scope.data[i].name);
                $scope.albums.push(Number($scope.data[i].albums));
                
            }
            
            
            
            
            
            
        function datos(){
      var ret=[];
      
     response.data.forEach(function(d){
         response.data.name=d.name;
         response.data.albums=d.albums;
         
         
          ret.push({"name":response.data.name,
          "albums":response.data.albums,
          
          });
         
          });
     
      return ret;
     
  }
    new Morris.Bar({
        
      // ID of the element in which to draw the chart.
      element: 'myfirstchartext07',
      // Chart data records -- each entry in this array corresponds to a point on
      // the chart.
      
      data: datos(),
      // The name of the data record attribute that contains x-values.
      xkey: ['name'] ,
      // A list of names of data record attributes that contain y-values.
      ykeys: ['albums'],
      // Labels for the ykeys -- will be displayed when you hover over the
      // chart.
      labels: ['Albums']
    });

           
    });
}]);