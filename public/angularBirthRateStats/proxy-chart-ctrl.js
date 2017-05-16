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
                    $scope.year.push($scope.data[i].year);
                    $scope.gdp.push(Number($scope.data[i]["gdp"]));
                    $scope.debt.push(Number($scope.data[i]["debt"]));
                }
                
                console.log("Wages: "+$scope.dataEconomic);
                
              //G07
              
            $http.get("/api/v1/economic"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheBirth = response.data;
                $scope.dataWages =dataCacheBirth;
                
                for(var i=0; i<response.data.length; i++){
                $scope.birthRate.push(Number($scope.dataBirth[i].birthRate));
                }
                    console.log("Wages: "+$scope.dataBirth);


                    Highcharts.chart('container',{
                        title: {
                            text: 'Integrated G05 & G07'
                        },
                        chart: {
                            type: 'bar'
                        },
                        xAxis: {
                            categories: $scope.categorias
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
                        },
                        
                        {
                            name: 'year ',
                            data: $scope.year
                        }]
                    });});
         
     });
               

}]);