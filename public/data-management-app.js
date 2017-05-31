/* global angular */
angular.module("ManagerApp", ["ngRoute"]).config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "main.html"
    })

    .when("/investEducationStats", {
            templateUrl: "angularEducation/education-list.html",
            controller: "JoseListCtrl"
        })
        .when("/investEducationStats/:country/:year", {
            templateUrl: "angularEducation/education-edit.html",
            controller: "JoseEditCtrl"
        })
        
        .when("/investEducationStats/chart", {
            templateUrl: "/angularEducation/education-chart.html",
            controller: "JoseChartCtrl"
        }).when("/proxy/earlyleavers", {
            templateUrl: "/angularEducation/proxy-chart-ctrl.html",
            controller: "EducationProxyChartCtrl",
        })
        
        .when("/remote/export", {
            templateUrl: "/angularEducation/cors-chart-ctrl.html",
            controller: "EducationCorsChartCtrl",
        })
        .when("/investEducationStats/apiext", {
            templateUrl: "/angularEducation/apiext.html",
            controller: "ApiExtChartCtrlJose"
        })
        
        .when("/investEducationStats/apiext2", {
            templateUrl: "/angularEducation/apiext2.html",
            controller: "ApiExt2ChartCtrlJose"
        })
        .when("/investEducationStats/api1", {
            templateUrl: "/angularEducation/api-adicional-cors.html",
            controller: "AdicionalCors"
        })
        .when("/investEducationStats/api2", {
            templateUrl: "/angularEducation/api-adicional2-cors.html",
            controller: "AdicionalCors2"
        })
         .when("/investEducationStats/apiext3", {
            templateUrl: "/angularEducation/apiext3.html",
            controller: "ApiExt3ChartCtrlJose"
        })
        .when("/investEducationStats/apiext4", {
            templateUrl: "/angularEducation/apiext4.html",
            controller: "ApiExt4ChartCtrlJose"
        })
        
    .when("/integrations",{
        templateUrl: "integrations.html"
    })  
    
    .when("/analytics", {
            templateUrl: "/analytics.html",
            controller: "ChartsCtrl",
        })
    .when("/governance", {
            templateUrl: "/governance.html",
            
        })    
        
    .when("/salaries", {
            templateUrl: "angularSalaries/list.html",
            controller: "SalaryListCtrl1"
        })
        .when("/salaries/:country/:year", {
            templateUrl: "angularSalaries/edit.html",
            controller: "SalaryEditCtrl"
        })
        
        .when("/salaries/chart", {
            templateUrl: "/angularSalaries/chart-ctrl.html",
            controller: "SalaryChartCtrl"
        })
        .when("/salaries/apiext", {
            templateUrl: "/angularSalaries/apiext.html",
            controller: "ApiExtChartCtrl"
        })
        
        .when("/salaries/apiext2", {
            templateUrl: "/angularSalaries/apiext2.html",
            controller: "ApiExt2ChartCtrl"
        })
        
        .when("/salaries/apiext3", {
            templateUrl: "/angularSalaries/apiext3.html",
            controller: "ApiExt3ChartCtrl"
        })
        
        .when("/salaries/apiext4", {
            templateUrl: "/angularSalaries/apiext4.html",
            controller: "ApiExt4ChartCtrl"
        })
        
        .when("/salaries/apiext5", {
            templateUrl: "/angularSalaries/apiext5.html",
            controller: "ApiExt5ChartCtrl"
        })
        
        .when("/proxy/salaries", {
            templateUrl: "/angularSalaries/proxy-chart-ctrl.html",
            controller: "SalaryProxyChartCtrl",
        })
        
        .when("/remote/salaries", {
            templateUrl: "/angularSalaries/cors-chart-ctrl.html",
            controller: "SalaryCorsChartCtrl",
        })

      .when("/birthRateStats", {     //Cambiar julio
            templateUrl: "angularBirthRateStats/list.html",
            controller: "birthRateStatsListCtrl",
        })
        
        .when("/birthRateStats/:country/:year", {
            templateUrl: "angularBirthRateStats/edit.html",
            controller: "birthRateStatsEditCtrl"
        })
        .when("/birthRateStats/chart", {
            templateUrl: "angularBirthRateStats/chart-ctrl.html",
            controller: "birthChartCtrl"
            
        }) .when("/proxy/economic", {
            templateUrl: "/angularBirthRateStats/proxy-chart-ctrl.html",
            controller: "EconomicCtrl",
        })
        
        .when("/remote/rent", {
            templateUrl: "/angularBirthRateStats/cors-chart-ctrl.html",
            controller: "RentCtrl",
        })
        .when("/birthRateStats/apiext", {
            templateUrl: "/angularBirthRateStats/apiext.html",
            controller: "ApiExtJulio"
        })
        .when("/birthRateStats/apiext2", {
            templateUrl: "/angularBirthRateStats/apiext2.html",
            controller: "ApiExtJulio2"
        })
        .when("/birthRateStats/apiext3", {
            templateUrl: "/angularBirthRateStats/apiext3.html",
            controller: "ApiExtJulio3"
        })
        .when("/birthRateStats/apiext4", {
            templateUrl: "/angularBirthRateStats/apiext4.html",
            controller: "ApiExtJulio4"
        })
        
        .when("/about", {
            templateUrl: "/about.html",
            
        })
        ;

    console.log("App initialized and configured");
});
