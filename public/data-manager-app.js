angular.module("ManagerApp", ["ngRoute"]).config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "main.html"
    })

    .when("/salaries", {
            templateUrl: "angularSalaries/list.html",
            controller: "ListCtrl"
        })
        .when("/salaries/:country/:year", {
            templateUrl: "angularSalaries/edit.html",
            controller: "EditCtrl"
        });
    
    console.log("App initialized");
});
    