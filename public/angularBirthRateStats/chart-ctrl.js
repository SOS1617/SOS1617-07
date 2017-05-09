angular
    .module("ManagerApp")
    .controller("BirthRateChartCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "sos07";
        $scope.data = {};
        var dataCache = {};
        $scope.datos = [];
        $scope.birthRate= [];
        $scope.lifeExpectancy = [];
        $scope.mortalityRate = [];
        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        $http.get("/api/v1/birthRateStats/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<response.data.length; i++){
                $scope.datos.push(capitalizeFirstLetter($scope.data[i].country) + " " + $scope.data[i].year);
                $scope.birthRate.push(Number($scope.data[i].birthRate));
                $scope.lifeExpectancy.push(Number($scope.data[i].lifeExpectancy));
                $scope.mortalityRate.push(Number($scope.data[i].mortalityRate));
                
                
                console.log($scope.data[i].country);
            }
        });    
            
        console.log("Controller initialized");
        $http.get("/api/v1/birthRateStats/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            
           Highcharts.chart('containerBirth', {
    chart: {
        type: 'bar'
    },
    title: {
        text: ' birthRateStats in some years'
    },
    xAxis: {
        categories: $scope.datos
    },
    yAxis: {
        min: 0,
        title: {
            text: 'birthRateStats'
        }
    },
    legend: {
        reversed: true
    },
    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },
    series: [{
        name: 'birthRate',
        data: $scope.birthRate
    }, {
        name: 'lifeExpectancy',
        data: $scope.lifeExpectancy
    }, {
        name: 'mortalityRate',
        data: $scope.mortalityRate
    }]
});
            
        
           
            
            
            //Google
            google.charts.load('current', {
                'packages': ['controls','geochart']
            });
            google.charts.setOnLoadCallback(drawRegionsMap);
                        
        
            function drawRegionsMap() {
                var myData = [['Country','lifeExpectancy', 'Year']];
     
                response.data.forEach(function (d){
                    myData.push([capitalizeFirstLetter(d.country), Number(d.lifeExpectancy), Number(d.year)]);
                });
                    
                var data = google.visualization.arrayToDataTable(myData);
                var options = {
                    region: '150',
                    colorAxis: {colors: ['blue', 'green' , 'purple']}
                };
                var dashboardBirth = new google.visualization.Dashboard(document.getElementById('dashboardBirth'));

                var yearSelector = new google.visualization.ControlWrapper({
                    controlType: 'CategoryFilter',
                    containerId: 'filter',
                    options: {
                        filterColumnIndex: 2,
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
                dashboardBirth.bind(yearSelector, chart);
                dashboardBirth.draw(data, options);
            }    

 });
    }]);