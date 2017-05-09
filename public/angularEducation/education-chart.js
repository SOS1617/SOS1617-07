angular
    .module("ManagerApp")
    .controller("JoseChartCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "sos07";
        $scope.data = {};
        var dataCache = {};
        $scope.datos = [];
        $scope.investEducationStat = [];
        $scope.healthExpenditureStat = [];
        $scope.militaryExpenditureStat = [];
        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        $http.get("/api/v1/investEducationStats/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<response.data.length; i++){
                $scope.datos.push(capitalizeFirstLetter($scope.data[i].country) + " " + $scope.data[i].year);
                $scope.investEducationStat.push(Number($scope.data[i].investEducationStat));
                $scope.healthExpenditureStat.push(Number($scope.data[i].healthExpenditureStat));
                $scope.militaryExpenditureStat.push(Number($scope.data[i].militaryExpenditureStat));
                
                
                console.log($scope.data[i].country);
            }
        });    
            
        console.log("Controller initialized");
        $http.get("/api/v1/investEducationStats/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            
           Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Invest Education Stat'
    },
    subtitle: {
        text: 'over Health and Military Expenditure'
    },
    xAxis: {
        categories: $scope.datos,
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Invest / Expenditure '
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'InvestEducationStat',
        data: $scope.investEducationStat

    }, {
        name: 'HealthExpenditureStat',
        data: $scope.healthExpenditureStat

    }, {
        name: 'MilitaryExpenditureStat',
        data: $scope.militaryExpenditureStat

    }]
});
            
            
        
            //Google
            google.charts.load('current', {
                'packages': ['controls','geochart']
            });
            google.charts.setOnLoadCallback(drawRegionsMap);
                        
        
            function drawRegionsMap() {
                var myData = [['Country','MilitaryExpenditureStat', 'Year']];
     
                response.data.forEach(function (d){
                    myData.push([capitalizeFirstLetter(d.country), Number(d.militaryExpenditureStat), Number(d.year)]);
                });
                    
                var data = google.visualization.arrayToDataTable(myData);
                var options = {
                    region: '150',
                    colorAxis: {colors: ['yellow', 'orange' , 'red']}
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
                        colorAxis: {colors: ['yellow', 'orange' , 'red']}
                    }
                });
                dashboard.bind(yearSelector, chart);
                dashboard.draw(data, options);
            } 
            
            
            
            
            
            //taucharts
            
            function datos(){
      var ret=[];
      
     response.data.forEach(function(d){
         response.data.country=d.country;
         response.data.year=d.year;
         response.data.investEducationStat=d.investEducationStat;
         response.data.healthExpenditureStat=d.healthExpenditureStat;
          ret.push({"country":response.data.country,
          "HealthExpenditureStat":response.data.healthExpenditureStat,
          "InvestEducationStat":response.data.investEducationStat,
          });
         
          });
     
      return ret;
     
  }
             var chart = new tauCharts.Chart({
                data: datos(),
                type:'scatterplot',
                x : 'HealthExpenditureStat',
                y: 'InvestEducationStat',
                color:'countries',
                size: null,
                plugins:
                [
                tauCharts.api.plugins.get('tooltip')(),
                tauCharts.api.plugins.get('legend')(),
                tauCharts.api.plugins.get('quick-filter')(),
               
]
});
chart.renderTo('#tau');
});
    }]);