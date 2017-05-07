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
        })
    .when("/analytics",{
        templateUrl: "analytics.html"
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

    .when("/birthRateStats", {     //Cambiar julio
            templateUrl: "angularBirthRateStats/list.html",
            controller: "birthRateStatsListCtrl"
        })
        .when("/birthRateStats/:country/:year", {
            templateUrl: "angularBirthRateStats/edit.html",
            controller: "birthRateStatsEditCtrl"
        });

    console.log("App initialized and configured");
});
