angular
    .module("ManagerApp")
    .controller("AdicionalCors2",["$scope","$http",function ($scope, $http){
        
        //$scope.apikey = "sos07";
        $scope.data = {};
        var dataCache = {};
        $scope.country = [];
        $scope.year = [];
        
        $scope.investEducationStat=[];
       
       
        $scope.rpcyear = [];
        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        $http.get("https://sos1617-07.herokuapp.com/api/v1/investEducationStats?apikey=sos07").then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<$scope.data.length; i++){
               
                
                $scope.investEducationStat.push(Number($scope.data[i].investEducationStat));
              
                console.log($scope.investEducationStat);
                
                
            }
            
        $http.get("https://sos1617-02.herokuapp.com/api/v1/rpc-stats/?apikey=GVAODcH3").then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<$scope.investEducationStat.length; i++){
               // $scope.country.push(capitalizeFirstLetter($scope.data[i].country));
                //$scope.year.push(Number($scope.data[i].year));
                $scope.rpcyear.push(Number($scope.data[i].rpcyear));
              
                
                
               // console.log($scope.rpcyear);
            }
        });    
            
        console.log("Controller initialized");
        $http.get("https://sos1617-02.herokuapp.com/api/v1/rpc-stats/?apikey=GVAODcH3").then(function(response){
            
            
            
            
            
            
            //taucharts
            
            function datos(){
      var ret=[];
      var i = 1;
     response.data.forEach(function(d){
         
         
         
         response.data.investEducationStat=d.investEducationStat;
         response.data.rpcyear=d.rpcyear;
        
          ret.push({"rpcyear":$scope.rpcyear[i-1],
          "investEducationStat":
          $scope.investEducationStat[i-1],
         
          })
          i++;;
         
          });
          
          console.log(ret);
     
      return ret;
     
  }
             var chart = new tauCharts.Chart({
                data: datos(),
                type:'scatterplot',
                x : 'rpcyear',
                y: 'investEducationStat',
                color:'',
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