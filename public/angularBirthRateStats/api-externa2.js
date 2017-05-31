angular.module("ManagerApp").

controller("ApiExtJulio2", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (External Api 1");
        
        $scope.apikey = "sos07";
        $scope.data = {};
        var dataCache = {};
        $scope.id = [];
       $scope.birthRate= [];
         $scope.datos = [];
        $scope.datos2 = [];
       
    
       
 $http.get("/api/v1/birthRateStats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheBirth = response.data;
                $scope.dataBirth =dataCacheBirth;
                
                for(var i=0; i<response.data.length; i++){
                $scope.birthRate.push(Number($scope.dataBirth[i].birthRate));
                }
$http.get("https://api.tvmaze.com/search/shows?q=girls").then(function(response){                
                
            dataCache = response.data;
            $scope.data = dataCache;
            
            
           
            for(var i=0; i<$scope.dataBirth.length; i++){
                var ar=[];
                ar.push($scope.data[i].show.name);
                ar.push($scope.birthRate[i]);
                ar.push($scope.data[i].score);
                
                
                $scope.datos2.push(ar);
            
           
           }      
          
          
          
/*$http.get("/proxy/weather").then(function(response){                
                
            dataCache = response.data;
            $scope.data = dataCache;
            
            
           
            for(var i=0; i<response.data.length; i++){
                var ar=[];
                ar.push($scope.data[i]["coord"]);
                if($scope.birthRate[i]!=null)
                    ar.push($scope.birthRate[i]);
                
                
                $scope.datos2.push(ar);
            
           
           }      
          */
            
 
chart = anychart.cartesian();
console.log($scope.datos2);
console.log(response.data.length);
  
  
// data

  
// add a marker seris
chart.bubble($scope.datos2);
  
// set chart title
chart.title("Bubble Chart");
chart.maxBubbleSize(20);
chart.minBubbleSize(10);
// set axes titles 
chart.xAxis().title("Serie");
chart.yAxis().title("BirthRate");
  
// draw
chart.container("charts07");
chart.draw();
});
});


    }]);