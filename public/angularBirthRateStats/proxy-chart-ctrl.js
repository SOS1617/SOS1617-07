/* global angular */
/* global Materialize */
/* global $ */
/* global google */
/* global Highcharts */

angular.module("ManagerApp").
controller("EconomicCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (EconomicCtrl)");

    if (!$rootScope.apikey) $rootScope.apikey = "sos07";

    $scope.refresh = function() {
        $http
            .get("../proxy/economic")
            .then(function(response) {
                console.log(JSON.stringify(response.data, null, 2));
            });
    };
    



    
    
}]);