/* global angular */
/* global Materialize */
/* global $ */
/* global google */
/* global Highcharts */

angular.module("ManagerApp").
controller("EducationProxyChartCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (EducationProxyChartCtrl)");

    $scope.apikey = "sos07";
        $scope.dataEarly = {};
        $scope.dataInvestEducationStat = {};
        var dataCacheEarly = {};
        var dataCacheInvestEducationStat = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //G03
        $scope.eslobjective = [];
        $scope.esltotal = [];
        //G07
        $scope.year = [];
        $scope.investEducationStat = [];

      

//G05
                
     $http.get("/proxy/earlyleavers").then(function(response){
                
                dataCacheEarly = response.data;
                $scope.dataEarly =dataCacheEarly;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.year.push($scope.dataEarly[i].year);
                    $scope.eslobjective.push(Number($scope.dataEarly[i]["eslobjective"]));
                    $scope.esltotal.push(Number($scope.dataEarly[i]["esltotal"]));
                }
                
                console.log("ESL: "+$scope.dataEarly);
                
              //G07
              
            $http.get("/api/v1/investEducationStats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheInvestEducationStat = response.data;
                $scope.dataInvestEducationStat =dataCacheInvestEducationStat;
                
                for(var i=0; i<response.data.length; i++){
                $scope.investEducationStat.push(Number($scope.dataInvestEducationStat[i].investEducationStat));
                }
                    console.log("ESL: "+$scope.dataInvestEducationStat);


                    Highcharts.chart('container',{
                        title: {
                            text: 'Integrated G03 & G07'
                        },
                        chart: {
                            type: 'column'
                        },
                        xAxis: {
                            categories: $scope.country
                        },
                        legend: {
                            layout: 'horizontal',
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
                            name: 'investEducationStat',
                            data: $scope.investEducationStat
                        },
                        {
                            name: 'eslobjective',
                            data: $scope.eslobjective
                        },
                        {
                            name: 'esltotal',
                            data: $scope.esltotal
                        }]
                    });});
         
     });
     

               

}]);
    



    
    
