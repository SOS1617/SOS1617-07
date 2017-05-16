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
        
    .when("/analytics",{
        templateUrl: "charts.html"
    })    

    .when("/salaries", {
            templateUrl: "angularSalaries/list.html",
            controller: "SalaryListCtrl"
        })
        .when("/salaries/:country/:year", {
            templateUrl: "angularSalaries/edit.html",
            controller: "SalaryEditCtrl"
        })
        
        .when("/salaries/chart", {
            templateUrl: "/angularSalaries/chart-ctrl.html",
            controller: "SalaryChartCtrl"
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
        ;

    console.log("App initialized and configured");
});
