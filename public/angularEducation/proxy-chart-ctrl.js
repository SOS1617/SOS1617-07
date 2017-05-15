/* global angular */
/* global Materialize */
/* global $ */
/* global google */
/* global Highcharts */

angular.module("ManagerApp").
controller("EducationProxyChartCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (EducationProxyChartCtrl)");

    if (!$rootScope.apikey) $rootScope.apikey = "sos07";

    $scope.refresh = function() {
        $http
            .get("../proxy/earlyleavers")
            .then(function(response) {
                console.log(JSON.stringify(response.data, null, 2));
            });
    };
    



    
    
}]);