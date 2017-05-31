angular.module("ManagerApp").

controller("ApiExt2ChartCtrlJose", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (External Api 1");
        
        $scope.apikey = "sos07";
        $scope.data = {};
        $scope.data1 = {};
        var dataCache = {};
        var dataCache1 = {};
        $scope.datos = [];
        $scope.show_title = [];
        $scope.release_year= [];
        
        
          function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
       
       
              
 $http.get("/api/v1/investEducationStats/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache1 = response.data;
            $scope.data1 = dataCache1;
            
            for(var i=0; i<response.data.length; i++){
                $scope.datos.push(capitalizeFirstLetter($scope.data1[i].country) + " " + $scope.data1[i].year);
            }
       

$http.get("https://netflixroulette.net/api/api.php?actor=Brad%20Pitt").then(function(response){
                
                
            dataCache = response.data;
            $scope.data = dataCache;
            
           
            for(var i=0; i<response.data.length; i++){
                
                $scope.show_title.push($scope.data[i].show_title);
                //$scope.release_year.push($scope.data[i].release_year);
               
               
                
            }
          
            
        
       
            //ZingChart
            var myConfig = {
                "type": "line",
                
                "backgroundColor":'#FFFFFF',
                "title": {
                    "text": "Brad Pitt movies analytics",
                    "fontColor":'Black',
                    "font-size": "24px",
                    "adjust-layout": true
                },
                "plotarea": {
                    "margin": "dynamic 45 60 dynamic",
                },
                
                "legend": {
                    "layout": "float",
                    "background-color": "white",
                    "border-width": 0,
                    "shadow": 0,
                    "align": "center",
                    "adjust-layout": true,
                "item": {
                    "padding": 1,
                    "marginRight": 17,
                    "cursor": "hand"
                }
                },
                
                "scale-x": {
                    "label": {
                        "text": "Title",
                        "fontColor":'Black',

                    },
                    "labels": 
                        $scope.show_title
                    
                },
                "scale-y": {
                    "min-value": "0:2020",
                    "label": {
                        "text": "Ids",
                        "fontColor":'Black',

                    },
                    
                },
                
                "crosshair-x": {
                    "line-color": 'lightblue',
                    "plot-label": {
                    "border-radius": "5px",
                    "border-width": "1px",
                    "border-color": "#f6f7f8",
                    "padding": "10px",
                    "font-weight": "bold"
                },
                "scale-label": {
                    "font-color": 'Black',
                    "background-color": 'White',
                    "border-radius": "5px"
                }
            },
                
                "tooltip": {
                    "visible": false
                },
                
                "plot": {
                    "highlight": true,
                    "tooltip-text": "%t views: %v<br>%k",
                    "shadow": 0,
                    "line-width": "2px",
                    "marker": {
                    "type": "circle",
                    "size": 3
                },
                "highlight-state": {
                "line-width": 3
                },
                "animation": {
                    "effect": 1,
                    "sequence": 2,
                    "speed": 100,
                }
                },
                
                "series": [
                {
                    "values": $scope.datos,
                    "text": "Title",
                    "line-color": "lightblue",
                    "legend-item":{
                      "background-color": 'white',
                      "borderRadius":5,
                      "font-color":'white'
                    },
                    "legend-marker": {
                        "visible":false
                    },
                    "marker": {
                        "background-color": "#007790",
                        "border-width": 1,
                        "shadow": 0,
                        "border-color": "#69dbf1"
                    },
                    "highlight-marker":{
                      "size":6,
                      "background-color": "#007790",
                    }
                }
            ]
            };

            zingchart.render({
                id: 'chart',
                data: myConfig,
                height: '100%',
                width: '95%'
            });
});
});
}]);