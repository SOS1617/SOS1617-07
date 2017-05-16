angular
    .module("ManagerApp")
    .controller("SalaryCorsChartCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "sos07";
        $scope.dataEducation = {};
        $scope.dataWages = {};
        var dataCacheEducation = {};
        var dataCacheWages = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //G07
        $scope.investEducationStat = [];
        $scope.healthExpenditureStat = [];
        $scope.militaryExpenditureStat =[];
        //G08
        $scope.year = [];
        $scope.varied = [];

        
       function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }

//G07s
                
     $http.get("https://sos1617-01.herokuapp.com/api/v2/startups-stats?apikey=sos161701").then(function(response){
                
                dataCacheEducation = response.data;
                $scope.dataEducation =dataCacheEducation;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias.push($scope.dataEducation[i].country);
                    $scope.investEducationStat.push(Number($scope.dataEducation[i].investEducationStat));
                    $scope.healthExpenditureStat.push(Number($scope.dataEducation[i].healthExpenditureStat));
                    $scope.militaryExpenditureStat.push(Number($scope.dataEducation[i].militaryExpenditureStat));
                }
                
                console.log("Wages: "+$scope.dataEducation);
                
              //G08
              
            $http.get("/api/v1/wages"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheWages = response.data;
                $scope.dataWages =dataCacheWages;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias1.push($scope.dataWages[i].province);
                    $scope.year.push(Number($scope.dataWages[i]["year"]));
                    $scope.varied.push(Number($scope.dataWages[i]["varied"]));
                }
                    console.log("Wages: "+$scope.dataWages);


                    ////////////////////////////
                    ////COMPARATIVA  2017////
                    ////////////////////////////
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
                            name: 'investEducationStat',
                            data: $scope.investEducationStat,
                        },
                        {
                            name: 'healthExpenditureStat',
                            data: $scope.healthExpenditureStat,
                        },
                        {
                            name: 'militaryExpenditureStat',
                            data: $scope.militaryExpenditureStat,
                        },
                        
                        {
                            name: 'Wages Varied',
                            data: $scope.varied
                        }]
                    });});
         
     });
               

}]);