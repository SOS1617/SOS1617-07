angular.module("ManagerApp").
controller("ApiExtChartCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (SalaryCorsChartCtrl)");
        
        $scope.apikey = "sos07";
        $scope.data = {};
        var dataCache = {};
        $scope.nombrePais = [];
        $scope.population= [];
        $scope.averageSalary = [];
        $scope.riskOfPoverty = [];
        $scope.year = [];


$http.get("https://restcountries.eu/rest/v1/all").then(function(response){
                
                
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<response.data.length; i++){
                $scope.nombrePais.push($scope.data[i].name);
                $scope.population.push(Number($scope.data[i].population));
                
                
                
            }
            
            
       
             //Google
            google.charts.load('current', {
                'packages': ['controls','geochart']
            });
            google.charts.setOnLoadCallback(drawRegionsMap);
                        
        
            function drawRegionsMap() {
                var myData = [['Country','Population']];
     
                response.data.forEach(function (d){
                    
                        
                    
                    myData.push([(d.name), Number(d.population)]);
                    
                });
                    
                var data = google.visualization.arrayToDataTable(myData);
                var options = {
                    region: '150',
                    colorAxis: {colors: ['blue', 'green' , 'purple']}
                };
                var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard'));

                var populationSelector = new google.visualization.ControlWrapper({
                    controlType: 'CategoryFilter',
                    containerId: 'filter',
                    options: {
                        filterColumnIndex: 0,
                        ui: {
                            allowTyping: false,
                            allowMultiple: true,
                            allowNone: false
                        }
                    }
                });
                var chart = new google.visualization.ChartWrapper({
                    chartType: 'GeoChart',
                    containerId: 'map',
                    options: {
                        displayMode: 'regions',
                        colorAxis: {colors: ['blue', 'green' , 'purple']}
                    }
                });
                dashboard.bind(populationSelector, chart);
                dashboard.draw(data, options);
            }    
            
});
}]);