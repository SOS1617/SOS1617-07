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

    .when("/salaries", {
            templateUrl: "angularSalaries/list.html",
            controller: "SalaryListCtrl"
        })
        .when("/salaries/:country/:year", {
            templateUrl: "angularSalaries/edit.html",
            controller: "SalaryEditCtrl"
        })

    .when("/gdp-per-capita", {     //Cambiar julio
            templateUrl: "gdp-per-capita/list.html",
            controller: "GdpPerCapitaListCtrl"
        })
        .when("/gdp-per-capita/:country/:year", {
            templateUrl: "gdp-per-capita/edit.html",
            controller: "GdpPerCapitaEditCtrl"
        });

    console.log("App initialized and configured");
});
