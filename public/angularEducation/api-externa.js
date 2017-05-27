angular.module("ManagerApp").

controller("ApiExtChartCtrlJose", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (External Api 1");
        
        $scope.apikey = "sos07";
        $scope.data = {};
        var dataCache = {};
        $scope.id = [];
        $scope.type= [];
       
    
       


$http.get("https://api.github.com/events").then(function(response){
                
                
            dataCache = response.data;
            $scope.data = dataCache;
            
            
            for(var i=0; i<response.data.length; i++){
                
                $scope.id.push(Number($scope.data[i].id));
                $scope.type.push($scope.data[i].type);
               
               
                
            }
            
           
            
            
            
       
            //ZingChart
            var myConfig = {
                "type": "line",
                
                "backgroundColor":'#FFFFFF',
                "title": {
                    "text": "Id analytics",
                    "fontColor":"#E3E3E5",
                    "font-size": "24px",
                    "adjust-layout": true
                },
                "plotarea": {
                    "margin": "dynamic 45 60 dynamic",
                },
                
                "legend": {
                    "layout": "float",
                    "background-color": "none",
                    "border-width": 0,
                    "shadow": 0,
                    "align": "center",
                    "adjust-layout": true,
                "item": {
                    "padding": 7,
                    "marginRight": 17,
                    "cursor": "hand"
                }
                },
                
                "scale-x": {
                    "label": {
                        "text": "Types",
                        "fontColor":"#E3E3E5",

                    },
                    "labels": 
                        $scope.type
                    
                },
                "scale-y": {
                    "min-value": "5954375400:1383292800000",
                    "label": {
                        "text": "Ids",
                        "fontColor":"#E3E3E5",

                    },
                    
                },
                
                "crosshair-x": {
                    "line-color": "#efefef",
                    "plot-label": {
                    "border-radius": "5px",
                    "border-width": "1px",
                    "border-color": "#f6f7f8",
                    "padding": "10px",
                    "font-weight": "bold"
                },
                "scale-label": {
                    "font-color": "#000",
                    "background-color": "#f6f7f8",
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
                    "values": $scope.id,
                    "text": "Id",
                    "line-color": "#007790",
                    "legend-item":{
                      "background-color": "#007790",
                      "borderRadius":5,
                      "font-color":"white"
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
    

    

}]);
