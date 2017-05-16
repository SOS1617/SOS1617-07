/* global angular */
/* global Materialize */
/* global $ */
/* global google */
/* global Highcharts */

angular.module("ManagerApp").
controller("RentCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (RentCtrl)");

    $scope.refresh = function() {
        $http
            .get("sos1617-05.herokuapp.com/api/v1/economic-situation-stats?apikey=cinco")
            .then(function(response) {
                console.log(JSON.stringify(response.data, null, 2));
            });
    };
    

    
}]);