angular
    .module("ManagerApp")
    .controller("AdicionalCors",["$scope","$http",function ($scope, $http){
        
        //$scope.apikey = "sos07";
        $scope.data = {};
        var dataCache = {};
        $scope.country = [];
        $scope.year = [];
       
       
        $scope.gdp_deflactor = [];
        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        $http.get("https://sos1617-06.herokuapp.com/api/v1/gdp/?apikey=secret").then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<response.data.length; i++){
                $scope.country.push(capitalizeFirstLetter($scope.data[i].country));
                $scope.year.push(Number($scope.data[i].year));
                $scope.gdp_deflactor.push(Number($scope.data[i].gdp_deflactor));
              
                
                
                
            }
        });    
            
        console.log("Controller initialized");
        $http.get("https://sos1617-06.herokuapp.com/api/v1/gdp/?apikey=secret").then(function(response){
            
            
            
            
            
            
            //taucharts
            
            function datos(){
      var ret=[];
      
     response.data.forEach(function(d){
         response.data.country=d.country;
         response.data.year=d.year;
        
          ret.push({"country":response.data.country,
          "year":response.data.year,
         
          });
         
          });
     
      return ret;
     
  }
             var chart = new tauCharts.Chart({
                data: datos(),
                type:'scatterplot',
                x : 'year',
                y: 'country',
                color:'countries',
                size: null,
                plugins:
                [
                tauCharts.api.plugins.get('tooltip')(),
                
                
               
]
});
chart.renderTo('#tau');
});
    }]);