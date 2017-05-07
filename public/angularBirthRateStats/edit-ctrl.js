/* global angular */
/* global Materialize */
var previousPage;
var nextPage;
var setPage;

angular.module("ManagerApp").
controller("birthRateStatsEditCtrl", ["$scope", "$http", "$routeParams", "$location", "$rootScope", function($scope, $http, $routeParams, $location, $rootScope) {
    console.log("BirthRate Edit Controller initialized");

    if (!$rootScope.apikey) $rootScope.apikey = "sos07";

    function refresh() {
        $http
            .get("../api/v1/birthRateStats/" + $routeParams.country + "/" + $routeParams.year + "?" + "apikey=" + $rootScope.apikey)
            .then(function(response) {
                $scope.editDataUnit = response.data;
            }, function(response) {
                switch (response.status) {
                    case 401:
                        Materialize.toast('<i class="material-icons">error_outline</i> Error getting data - api key missing!', 4000);
                        break;
                    case 403:
                        Materialize.toast('<i class="material-icons">error_outline</i> Error getting data - api key incorrect!', 4000);
                        break;
                    case 404:
                        Materialize.toast('<i class="material-icons">error_outline</i> Error getting data - data not found!', 4000);
                        break;
                    default:
                        Materialize.toast('<i class="material-icons">error_outline</i> Error getting data!', 4000);
                        break;
                }
            });
    }

    $scope.discardData = function() {
        console.log("Discarding changes and returning back to main view");
        $location.path('/birthRateStats');
    };

    $scope.editData = function(data) {
        delete data._id;
        $http
            .put("../api/v1/birthRateStats/" + data.country + "/" + data.year + "?" + "apikey=" + $rootScope.apikey, data)
            .then(function(response) {
                console.log("Country  " + data.country + " correctly edited ");
                Materialize.toast('<i class="material-icons">done</i> ' + data.country + '  correctly edited', 4000);
                $location.path('/birthRateStats');
            }, function(response) {
                switch (response.status) {
                    case 400:
                        Materialize.toast('<i class="material-icons">error_outline</i> Error editing data - incorrect data was entered!', 4000);
                        break;
                    case 401:
                        Materialize.toast('<i class="material-icons">error_outline</i> Error getting data - api key missing!', 4000);
                        break;
                    case 403:
                        Materialize.toast('<i class="material-icons">error_outline</i> Error getting data - api key incorrect!', 4000);
                        break;
                    default:
                        Materialize.toast('<i class="material-icons">error_outline</i> Error editing data!', 4000);
                        break;
                }
            });
    };

    refresh();
}]);
