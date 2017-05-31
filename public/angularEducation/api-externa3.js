angular.module("ManagerApp").

controller("ApiExt3ChartCtrlJose", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller 3 initialized (External Api 1");
        
        $scope.apikey = "sos07";
        $scope.data = {};
        $scope.data1 = {};
        var dataCache = {};
        var dataCache1 = {};
        $scope.datos = [];
        $scope.journalId = [];
        $scope.zoneId = [];
        //$scope.release_year= [];
        
        
          function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
       
       
              
 $http.get("/api/v1/investEducationStats/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache1 = response.data;
            $scope.data1 = dataCache1;
            
            for(var i=0; i<response.data.length; i++){
                $scope.datos.push(capitalizeFirstLetter($scope.data1[i].country) + " " + $scope.data1[i].year);
            }
       


$http.get("https://us.api.battle.net/wow/boss/?locale=en_US&apikey=2ern4ym5vrt82w5uf56ycu6hcwu23w8s").then(function(response){
                
                //https://us.api.battle.net/wow/achievement/2144?locale=en_US&apikey=2ern4ym5vrt82w5uf56ycu6hcwu23w8s
            dataCache = response.data;
            $scope.data = dataCache;
            
           console.log(response.data);
           
            for(var i=0; i<$scope.data1.length; i++){
                
                $scope.journalId.push(($scope.data.bosses[i].journalId *5.8));
                //$scope.release_year.push($scope.data[i].release_year);
                $scope.zoneId.push(($scope.data.bosses[i].zoneId ));
               

            }
           // console.log($scope.journalId);
          // console.log($scope.data.bosses[0].journalId );
          
            
        
       
            //ChartList
           new Chartist.Line('#chart', {
                        labels: [$scope.datos],
                        series: [$scope.journalId,$scope.zoneId]
                    }),{
                          high: 100000,
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