angular
    .module("ManagerApp")
    .controller("SalaryProxyChartCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "sos07";
        $scope.dataEducation = {};
        $scope.dataWages = {};
        var dataCacheEducation = {};
        var dataCacheWages = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //G08
        $scope.year = [];
        $scope.varied = [];
        $scope.averageWage =[];
        //G07
        $scope.year1 = [];
        $scope.averageSalary = [];
        $scope.minimumSalary = [];
        $scope.riskOfPoverty = [];

      

//G07s
                
     $http.get("/proxy/salaries").then(function(response){
                
                dataCacheEducation = response.data;
                $scope.dataEducation =dataCacheEducation;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias.push($scope.dataEducation[i].province);
                    $scope.year.push(Number($scope.dataEducation[i].year));
                    $scope.varied.push(Number($scope.dataEducation[i].varied));
                    $scope.averageWage.push(Number($scope.dataEducation[i].averageWage));
                }
                
                console.log("Wages: "+$scope.dataEducation);
                
              //G08
              
            $http.get("/api/v1/salaries"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheWages = response.data;
                $scope.dataWages =dataCacheWages;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias1.push($scope.dataWages[i].country);
                    $scope.year1.push(Number($scope.dataWages[i]["year"]));
                    $scope.averageSalary.push(Number($scope.dataWages[i]["averageSalary"]));
                    $scope.minimumSalary.push(Number($scope.dataWages[i]["minimumSalary"]));
                    $scope.riskOfPoverty.push(Number($scope.dataWages[i]["riskOfPoverty"]));
                }
                    console.log("Wages: "+$scope.dataWages);


                    Highcharts.chart('container',{
                        title: {
                            text: 'Integrated G07 & G08'
                        },
                        chart: {
                            type: 'line'
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
                            name: 'year',
                            data: $scope.year,
                        },
                        
                        
                        {
                            name: 'averageSalary ',
                            data: $scope.averageSalary
                        },
                        
                        {
                            name: 'Risk of Poverty',
                            data: $scope.riskOfPoverty
                        }]
                    });});
         
     });
               

}]);