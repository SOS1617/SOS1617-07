angular
    .module("ManagerApp")
    .controller("AdicionalCors",["$scope","$http",function ($scope, $http){
        
        //$scope.apikey = "sos07";
        $scope.data = {};
        var dataCache = {};
        $scope.country = [];
        $scope.year = [];
        
        $scope.investEducationStat=[];
       
       
        $scope.gdp = [];
        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        $http.get("https://sos1617-07.herokuapp.com/api/v1/investEducationStats?apikey=sos07").then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<response.data.length; i++){
               
                
                $scope.investEducationStat.push(Number($scope.data[i].investEducationStat));
              
                console.log($scope.investEducationStat);
                
                
            }
            
        $http.get("https://sos1617-06.herokuapp.com/api/v1/gdp/?apikey=secret").then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<response.data.length; i++){
               // $scope.country.push(capitalizeFirstLetter($scope.data[i].country));
                //$scope.year.push(Number($scope.data[i].year));
                $scope.gdp.push(Number($scope.data[i].gdp));
              
                
                
               // console.log($scope.gdp);
            }
        });    
            
        console.log("Controller initialized");
        $http.get("https://sos1617-06.herokuapp.com/api/v1/gdp/?apikey=secret").then(function(response){
            
            
            
            
            
            
            //taucharts
            
            function datos(){
      var ret=[];
      
     response.data.forEach(function(d){
         response.data.investEducationStat=d.investEducationStat;
         response.data.gdp=d.gdp;
        
          ret.push({"gdp":response.data.gdp,
          "investEducationStat":
          $scope.investEducationStat[i],
         
          });
         
          });
     
      return ret;
     
  }
             var chart = new tauCharts.Chart({
                data: datos(),
                type:'scatterplot',
                x : 'gdp',
                y: 'investEducationStat',
                color:'countries',
                size: null,
                plugins:
                [
                tauCharts.api.plugins.get('tooltip')(),
                
                
               
]
});
chart.renderTo('#tau');
});
});
    }]);