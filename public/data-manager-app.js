angular.module("ManagerApp", ["ngRoute"]).config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "main.html"
    })

    .when("/salaries", {
            templateUrl: "angularSalaries/list.html",
            controller: "SalaryListCtrl"
        })
        .when("/salaries/:country/:year", {
            templateUrl: "angularSalaries/edit.html",
            controller: "SalaryEditCtrl"
            
        })
        .when("/birthRateStats", {
            templateUrl: "angularBirthRateStats/list.html",
            controller: "ListCtrl"
        })
        .when("/birthRateStats/:country/:year", {
            templateUrl: "angularBirthRateStats/edit.html",
            controller: "EditCtrl"
        })
        
        .when("/investEducationStats", {
            templateUrl: "investEducationStats/list.html",
            controller: "JoseListCtrl"
        })
        .when("/investEducationStats/:country/:year", {
            templateUrl: "investEducationStats/edit.html",
            controller: "JoseEditCtrl"
        });
        
    
    console.log("App initialized");
});
    