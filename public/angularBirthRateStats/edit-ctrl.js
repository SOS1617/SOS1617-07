angular
    .module("ManagerApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location) {
    console.log("Controller initialized (EditCtrl)");
    
    var apikey = "sos07";

    function refresh() {
        $http
            .get("../api/v1/birthRateStats/" + $routeParams.country + "/" + $routeParams.year + "?" + "apikey=" + apikey)
            .then(function(response) {
                $scope.editDataUnit = response.data;
            });
    }
    
    $scope.discardData = function() {
        console.log("Discarding changes and returning back to main view");
        $location.path('/birthRateStats');
    };
    
       $scope.putbirthRateStat = function(){
            $http
            //$scope.newbirthRateStat guarda el birthRateStat que le estoy metiendo
                .put($scope.url +"/"+ $scope.newbirthRateStat.country + "/" +  $scope.newbirthRateStat.year + "?apikey="+ $scope.apikey, $scope.newbirthRateStat)
                .then(function(response){
                    console.log( $scope.newbirthRateStat.country + "and year" + $scope.newbirthRateStat.year + " stats has been modified. "  );
                    refresh();
                });
        };
   

    // $scope.editData = function(data) {

    //     var oldCountry = data.oldCountry;
    //     var oldYear = data.oldYear;
    //     delete data._id;
    //     delete data.oldCountry;
    //     delete data.oldYear;

    //     data.year = Number(data.year);
    //     $http
    //         .put("../api/v1/gdp/" + oldCountry + "/" + oldYear + "?" + "apikey=" + $scope.apikey, data)
    //         .then(function(response) {
    //             console.log("Data " + data.country + " edited!");
    //             Materialize.toast('<i class="material-icons">done</i> ' + oldCountry + ' has been edited succesfully!', 4000);
    //             refresh();
    //         }, function(response) {
    //             Materialize.toast('<i class="material-icons">error_outline</i> Error editing data!', 4000);
    //             refresh();
    //         });
    // };

    // $scope.updateContact = function(contact) {
    //     $http
    //         .put("api/v1/contacts/" + $routeParams.name, contact)
    //         .then(function(response) {
    //             console.log("Contact " + contact.name + " edited!");
    //             $location.path("/");
    //         });
    // };

    refresh();
}]);