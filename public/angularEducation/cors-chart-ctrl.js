/* global angular */
/* global Materialize */
/* global $ */
/* global google */
/* global Highcharts */

angular.module("ManagerApp").
controller("EducationCorsChartCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (EducationCorsChartCtrl)");
 $scope.apikey = "sos07";
        $scope.dataExport = {};
        $scope.datainvestEducationStat = {};
        var dataCacheExport = {};
        var dataCacheinvestEducationStat = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //G02
        $scope.exportS = [];
        //G07
        $scope.year = [];
        $scope.investEducationStat = [];

      

//G05
                
     $http.get("https://sos1617-04.herokuapp.com/api/v2/export-and-import/?apikey=12345").then(function(response){
                
                dataCacheExport = response.data;
                $scope.dataExport =dataCacheExport;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.year.push($scope.dataExport[i].year);
                    $scope.exportS.push(Number($scope.dataExport[i]["exportS"]));
                }
                
                
              //G07
              
            $http.get("/api/v1/investEducationStats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheinvestEducationStat = response.data;
                $scope.datainvestEducationStat =dataCacheinvestEducationStat;
                
                for(var i=0; i<response.data.length; i++){
                $scope.investEducationStat.push(Number($scope.datainvestEducationStat[i].investEducationStat));
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
                            name: 'investEducationStat',
                            data: $scope.investEducationStat
                        },
                        {
                            name: 'exportS',
                            data: $scope.exportS
                        }]
                    });});
         
     });
               

}]);