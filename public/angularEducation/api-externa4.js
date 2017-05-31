angular.module("ManagerApp").

controller("ApiExt4ChartCtrlJose", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller 3 initialized (External Api 1");
        
        $scope.apikey = "sos07";
        $scope.data = {};
        $scope.data1 = {};
        var dataCache = {};
        var dataCache1 = {};
        $scope.datos = [];
       
        $scope.ip = [];
        //$scope.release_year= [];
        
        
          function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
       
       
              
 $http.get("/api/v1/investEducationStats/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache1 = response.data;
            $scope.data1 = dataCache1;
            
            for(var i=0; i<response.data.length; i++){
                $scope.datos.push($scope.data1[i].year);
            }
       


$http.get("https://mcapi.ca/blockedservers").then(function(response){
                
                //https://us.api.battle.net/wow/achievement/2144?locale=en_US&apikey=2ern4ym5vrt82w5uf56ycu6hcwu23w8s
            dataCache = response.data;
            $scope.data = dataCache;
            
           
           
            for(var i=0; i<$scope.data1.length; i++){
                
                
               
                $scope.ip.push(($scope.data.blocked[i]));
               
        
            }
         
          
            
        
       
            //ChartList
           new Chartist.Line('#chart', {
                        labels: [$scope.ip],
                        series: [$scope.datos]
                    }),{
                          high: 20,
                          low: 0,
                          showArea: true,
                          showLine: false,
                          showPoint: false,
                          fullWjournalIdth: true,
                          axisX: {
                            showLabel: false,
                            showGrjournalId: false
                          }
                        };
});
});
}]);