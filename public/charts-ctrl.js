angular
    .module("ManagerApp")
    .controller("ChartsCtrl",["$scope","$http",function ($scope, $http){
        
        
        //Salaries
        
        $scope.apikey = "sos07";
        $scope.dataSalary = {};
        var dataCacheSalary = {};
        $scope.datos = [];
        $scope.minimumSalary= [];
        $scope.averageSalary = [];
        $scope.riskOfPoverty = [];
        $scope.year = [];
        
        //BirthRate
        
        $scope.apikey = "sos07";
        $scope.dataEconomic = {};
        $scope.dataBirth = {};
        var dataCacheEconomic = {};
        var dataCacheBirth = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        
        //G07
        $scope.year = [];
        $scope.birthRate = [];
        
        //Education
        
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
        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
            
            //Get BirthRateStats
            
            $http.get("/api/v1/birthRateStats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheBirth = response.data;
                $scope.dataBirth =dataCacheBirth;
                
                for(var i=0; i<response.data.length; i++){
                $scope.birthRate.push(Number($scope.dataBirth[i].birthRate));
                }
            
            //Get Education
            
                $http.get("/api/v1/investEducationStats"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                    dataCacheinvestEducationStat = response.data;
                    $scope.datainvestEducationStat =dataCacheinvestEducationStat;
                
                    for(var i=0; i<response.data.length; i++){
                        $scope.investEducationStat.push(Number($scope.datainvestEducationStat[i].investEducationStat));
                }
            
            //Get Salary
            
                    $http.get("/api/v1/salaries"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                        dataCacheSalary = response.data;
                        $scope.dataSalary =dataCacheSalary;
                
                        for(var i=0; i<response.data.length; i++){
                            $scope.year.push(Number($scope.dataSalary[i].year));
                            $scope.minimumSalary.push(Number($scope.dataSalary[i].minimumSalary));
                }
                
                Highcharts.chart('container',{
                        title: {
                            text: 'Integrated G07 '
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
                            name: 'minimumSalary',
                            data: $scope.minimumSalary
                        },
                        {
                            name: 'birthRate',
                            data: $scope.birthRate
                        }]
                    });
                
                
                
                
                    })
                })
            })
    }]);