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
            
        
            });
    }]);