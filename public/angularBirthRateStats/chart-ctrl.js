angular
    .module("ManagerApp")
    .controller("birthChartCtrl",["$scope","$http",function ($scope, $http){
       
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
            
            
           Highcharts.chart('container', {
    chart: {
        type: 'area'
    },
    title: {
        text: 'Average Birth Rate in some years'
    },
    xAxis: {
        categories: $scope.datos
    },
    yAxis: {
        min: 0,
        title: {
            text: 'BirthRates'
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
            /*
            Highcharts.chart('container', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Hola'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{$scope.datos}</b>: {point.percentage:.1f} %',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
            }
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
        
           */
            
           
            //Google
            google.charts.load('current', {
                'packages': ['controls','geochart']
            });
            google.charts.setOnLoadCallback(drawRegionsMap);
                        
        
            function drawRegionsMap() {
                var myData = [['Country','birthRate', 'Year']];
     
                response.data.forEach(function (d){
                    myData.push([capitalizeFirstLetter(d.country), Number(d.birthRate), Number(d.year)]);
                });
                    
                var data = google.visualization.arrayToDataTable(myData);
                var options = {
                    region: '150',
                    colorAxis: {colors: ['blue', 'green' , 'purple']}
                };
                var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard'));

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
                dashboard.bind(yearSelector, chart);
                dashboard.draw(data, options);
            }    

 });
   //////////////////////////////anychart//////////////////////////////

anychart.onDocumentReady(function () {

    // create column chart
   var chart = $scope.column();

    // turn on chart animation
    chart.animation(true);

    // set chart title text settings
    chart.title('Top 10 Cosmetic Products by Revenue');

    // create area series with passed data
    var series = chart.column([
        $scope.datos
    ]);

    // set series tooltip settings
    series.tooltip().titleFormat('{%X}');

    series.tooltip()
            .position('top')
            .anchor('bottom')
            .offsetX(0)
            .offsetY(5)
            .format('${%Value}{groupsSeparator: }');

    // set scale minimum
    chart.yScale().minimum(0);

    // set yAxis labels formatter
    chart.yAxis().labels().format('${%Value}{groupsSeparator: }');

    // tooltips position and interactivity settings
    chart.tooltip().positionMode('point');
    chart.interactivity().hoverMode('byX');

    // axes titles
    chart.xAxis().title('Country and Year');
    chart.yAxis().title('Birth Rate');

    // set container id for the chart
    chart.container('container');

    // initiate chart drawing
    chart.draw();
});


    }]);