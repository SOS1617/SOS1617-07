/* global angular */
/* global Materialize */
/* global $ */
/* global google */
/* global Highcharts */

angular.module("ManagerApp").
controller("SalaryCorsChartCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (SalaryCorsChartCtrl)");


     $scope.apikey = "sos07";
        $scope.dataEconomic = {};
        $scope.dataBirth = {};
        var dataCacheEconomic = {};
        var dataCacheBirth = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //G01
        $scope.investment = [];
        //G07
        $scope.year = [];
        $scope.minimumSalary = [];

      

//G05
                
     $http.get("https://sos1617-01.herokuapp.com/api/v2/startups-stats?apikey=sos161701").then(function(response){
                
                dataCacheEconomic = response.data;
                $scope.dataEconomic =dataCacheEconomic;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.year.push($scope.dataEconomic[i].year);
                    $scope.investment.push(Number($scope.dataEconomic[i]["investment"]));
                }
                
                
              //G07
              
            $http.get("/api/v1/salaries"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheBirth = response.data;
                $scope.dataBirth =dataCacheBirth;
                
                for(var i=0; i<response.data.length; i++){
                $scope.minimumSalary.push(Number($scope.dataBirth[i].minimumSalary));
                }


                    Highcharts.chart('container',{
                        title: {
                            text: 'Integrated G01 & G07'
                        },
                        chart: {
                            type: 'column'
                        },
                        xAxis: {
                            categories: $scope.year
                        },
                        legend: {
                            layout: 'vertical',
                            floating: true,
                            backgroundColor: '#FFFFFF',
                            //align: 'left',
                            verticalAlign: 'top',
                            align: 'right',
                            y: 20,
                            x: 0
                        },
                        tooltip: {
                            formatter: function () {
                                return '<b>' + this.series.name + '</b><br/>' +
                                   this.x + ': ' + this.y;
                            }
                        },
                        series:[{
                            name: 'Minimum Salary',
                            data: $scope.minimumSalary
                        },
                        {
                            name: 'investment',
                            data: $scope.investment
                        }]
                    });});
         
     });
               

}]);