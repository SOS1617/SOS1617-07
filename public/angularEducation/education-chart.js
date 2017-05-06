angular
    .module("ManagerApp")
    .controller("JoseChartCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "sos07";
        $scope.data = {};
        var dataCache = {};
        $scope.datos = [];
        $scope.eslmale = [];
        $scope.eslfemale = [];
        $scope.esltotal = [];
        $scope.eslobjective = [];
        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        $http.get("/api/v1/investEducationStats/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<response.data.length; i++){
                $scope.datos.push(capitalizeFirstLetter($scope.data[i].country) + " " + $scope.data[i].year);
                $scope.investEducationStat.push($scope.data[i].investEducationStat);
                $scope.healthExpenditureStat.push($scope.data[i].healthExpenditureStat);
                $scope.militaryExpenditureStat.push($scope.data[i].militaryExpenditureStat);
                
                
                console.log($scope.data[i].country);
            }
        });    
            
        console.log("Controller initialized");
        $http.get("/api/v1/investEducationStats/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            
            Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Invest Education Stats '
    },
    subtitle: {
        text: 'over Health and Military Expenditure'
    },
    xAxis: {
        type: 'category',
        data: $scope.datos,
       
        title: {
            text: 'Country-Year'
        }
    },
    yAxis: {
        title: {
            text: 'Expenditure - Invest'
        },
        min: 0
    },
    tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
    },

    plotOptions: {
        spline: {
            marker: {
                enabled: true
            }
        }
    },

    series: [{
        name: 'Invest Education Stat',
        
        data: $scope.investEducationStat
    }, {
        name: 'Health Expenditure Stat',
        data: $scope.healthExpenditureStat
    }, {
        name: 'Military Expenditure Stat',
        data: $scope.militaryExpenditureStat
        }]
});
            
            //Google
            google.charts.load('current', {
                'packages': ['controls','geochart']
            });
            google.charts.setOnLoadCallback(drawRegionsMap);
                        
        
            function drawRegionsMap() {
                var myData = [['Country','ESL Total', 'Year']];
     
                response.data.forEach(function (d){
                    myData.push([capitalizeFirstLetter(d.country), Number(d.esltotal), Number(d.year)]);
                });
                    
                var data = google.visualization.arrayToDataTable(myData);
                var options = {
                    region: '150',
                    colorAxis: {colors: ['green', 'yellow' , 'red']}
                };
                var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard'));

                var yearSelector = new google.visualization.ControlWrapper({
                    controlType: 'CategoryFilter',
                    containerId: 'filter',
                    options: {
                        filterColumnIndex: 2,
                        ui: {
                            allowTyping: false,
                            allowMultiple: false,
                            allowNone: false
                        }
                    }
                });
                var chart = new google.visualization.ChartWrapper({
                    chartType: 'GeoChart',
                    containerId: 'map',
                    options: {
                        displayMode: 'regions',
                        region: '150',
                        colorAxis: {colors: ['green', 'yellow' , 'red']}
                    }
                });
                dashboard.bind(yearSelector, chart);
                dashboard.draw(data, options);
            }    
            
            
            //Echarts
            var myChart = echarts.init(document.getElementById('echarts'));

                // specify chart configuration item and data
            var option2 = {
                backgroundColor: '#0f375f',
                title: {
                    text: 'ECharts',
                    textStyle:{
                        color: '#ccc'
                    }
                },
                tooltip: {},
                legend: {
                    data:['ESL Total','ESL Objective'],
                    textStyle: {
                        color: '#ccc'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: $scope.datos,
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        }
                    }
                },
                yAxis: {
                    splitLine: {show: false},
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        }
                    }
                },
                series: [{
                    name: 'ESL Total',
                    type: 'line',
                    smooth: true,
                    showAllSymbol: true,
                    symbol: 'emptyCircle',
                    symbolSize: 15,
                    data: $scope.esltotal
                }, {
                    name: 'ESL Objective',
                    type: 'bar',
                    barWidth: 10,
                    itemStyle: {
                        normal: {
                            barBorderRadius: 5,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[{offset: 0, color: '#14c8d4'},
                                {offset: 1, color: '#43eec6'}])
                        }
                    },
                    data: $scope.eslobjective
                }, {
                    name: 'ESL Total',
                    type: 'bar',
                    barGap: '-100%',
                    barWidth: 10,
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[
                                {offset: 0, color: 'rgba(20,200,212,0.5)'},
                                {offset: 0.2, color: 'rgba(20,200,212,0.2)'},
                                {offset: 1, color: 'rgba(20,200,212,0)'}])
                        }
                    },
                    z: -12,
                    data: $scope.esltotal
                }, {
                    name: 'ESL Total',
                    type: 'pictorialBar',
                    symbol: 'rect',
                    itemStyle: {
                        normal: {
                            color: '#0f375f'
                        }
                    },
                    symbolRepeat: true,
                    symbolSize: [12, 4],
                        symbolMargin: 1,
                    z: -10,
                    data: $scope.esltotal
                }]
            };

            // use configuration item and data specified to show chart
            myChart.setOption(option2);
            });
    }]);