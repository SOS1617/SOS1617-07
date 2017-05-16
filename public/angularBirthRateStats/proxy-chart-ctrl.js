/* global angular */
/* global Materialize */
/* global $ */
/* global google */
/* global Highcharts */

angular.module("ManagerApp").
controller("EconomicCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (EconomicCtrl)");

     $scope.apikey = "sos07";
        $scope.dataEconomic = {};
        $scope.dataBirth = {};
        var dataCacheEconomic = {};
        var dataCacheBirth = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //G05
        $scope.gdp = [];
        $scope.debt = [];
        //G07
        $scope.year = [];
        $scope.birthRate = [];

      

//G05
                
     $http.get("/proxy/economic").then(function(response){
                
                dataCacheEconomic = response.data;
                $scope.dataEconomic =dataCacheEconomic;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.year.push($scope.dataEconomic[i].year);
                    $scope.gdp.push(Number($scope.dataEconomic[i]["gdp"]));
                    $scope.debt.push(Number($scope.dataEconomic[i]["debt"]));
                }
                
                
              //G07
              
            $http.get("/api/v1/birthRateStats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheBirth = response.data;
                $scope.dataBirth =dataCacheBirth;
                
                for(var i=0; i<response.data.length; i++){
                $scope.year.push($scope.dataBirth[i].year);
                $scope.birthRate.push(Number($scope.dataBirth[i].birthRate));
                }


                    Highcharts.chart('container',{
                        title: {
                            text: 'Integrated G05 & G07'
                        },
                        chart: {
                            type: 'bar'
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
                            name: 'birthRate',
                            data: $scope.birthRate
                        },
                        {
                            name: 'gdp',
                            data: $scope.gdp
                        },
                        {
                            name: 'debt',
                            data: $scope.debt
                        }]
                    });});
         
     });
               

}]);