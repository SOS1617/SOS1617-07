angular
    .module("ManagerApp")
    .controller("SalaryChartCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "sos07";
        $scope.data = {};
        var dataCache = {};
        $scope.datos = [];
        $scope.minimumSalary= [];
        $scope.averageSalary = [];
        $scope.riskOfPoverty = [];
        $scope.year = [];
        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        $http.get("/api/v1/salaries/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<response.data.length; i++){
                $scope.datos.push(capitalizeFirstLetter($scope.data[i].country) + " " + $scope.data[i].year);
                $scope.minimumSalary.push(Number($scope.data[i].minimumSalary));
                $scope.averageSalary.push(Number($scope.data[i].averageSalary));
                $scope.riskOfPoverty.push(Number($scope.data[i].riskOfPoverty));
                $scope.year.push(Number($scope.data[i].year));
                
                
                console.log($scope.data[i].country);
            }
        });    
            
        console.log("Controller initialized");
        $http.get("/api/v1/salaries/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            
           Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Average Salaries in some years'
    },
    xAxis: {
        categories: $scope.datos
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Salaries'
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
        name: 'MinimumSalary',
        data: $scope.minimumSalary
    }, {
        name: 'AverageSalary',
        data: $scope.averageSalary
    }, {
        name: 'RiskOfPoverty',
        data: $scope.riskOfPoverty
    }]
});
            
        
           
            
            
            //Google
            google.charts.load('current', {
                'packages': ['controls','geochart']
            });
            google.charts.setOnLoadCallback(drawRegionsMap);
                        
        
            function drawRegionsMap() {
                var myData = [['Country','AverageSalary', 'Year']];
     
                response.data.forEach(function (d){
                    myData.push([capitalizeFirstLetter(d.country), Number(d.averageSalary), Number(d.year)]);
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



function datos(){
      var ret=[];
      
     response.data.forEach(function(d){
         response.data.country=d.country;
         response.data.averageSalary=d.averageSalary;
         response.data.minimumSalary=d.minimumSalary;
         
          ret.push({"country":response.data.country,
          "averageSalary":response.data.averageSalary,
          "minimum_salary":response.data.minimumSalary,
          });
         
          });
     
      return ret;
     
  }
new Morris.Bar({
    
  // ID of the element in which to draw the chart.
  element: 'myfirstchart07',
  // Chart data records -- each entry in this array corresponds to a point on
  // the chart.
  
  data: datos(),
  // The name of the data record attribute that contains x-values.
  xkey: ['country'] ,
  // A list of names of data record attributes that contain y-values.
  ykeys: ['minimum_salary','averageSalary'],
  // Labels for the ykeys -- will be displayed when you hover over the
  // chart.
  labels: ['Minimum Salary','Average Salary']
});
});
            }]);
  
   
                  
          