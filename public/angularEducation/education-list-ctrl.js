//Obtengo el modulo y creo el controlador sobre él

/* global Materialize */
angular
    .module("ManagerApp")
    .controller("JoseListCtrl",["$scope", "$http","$rootScope", function($scope, $http, $rootScope){
        
        $scope.url = "/api/v1/investEducationStats";
        $scope.apikey="sos07";

        console.log("Controller initialized ");
         function refresh(){
            $http
                .get($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.investEducationStats = response.data;
                });
            }
            refresh();
        
        //CARGAR DATOS
        $scope.loadInitialData= function(){
            $http.get($scope.url+"/loadInitialData?apikey="+$scope.apikey)
            .then(function(){
                console.log("Load initial data: OK");
                refresh();
            });
        };
        
    
    
    //GET A UN CONJUNTO CON PAGINACIÓN
        $scope.getDataPag = function(){
           
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.investEducationStats = response.data;
                });
            
        } ;
        
    //GET SIN PAGINACION
        $scope.getData = function(){
            $http
                .get($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    $scope.investEducationStats = response.data;
                    console.log( "Showing data "  );

            });
                
      };
   
        //MÉTODO PARA AÑADIR UN PAÍS    
        $scope.addInvestEducationStat  = function(){
            $http
            //$scope.newInvestEducationStat guarda el país que le estoy metiendo
                .post($scope.url+"?apikey="+ $scope.apikey, $scope.newInvestEducationStat)
                .then(function(response){
                    console.log($scope.newInvestEducationStat.country + "stats added." );
                    refresh();
                });
        } ;
        
        
        //MÉTODO PARA MODIFICAR UN PAÍS    
        $scope.putInvestEducationStat = function(){
            $http
            //$scope.newInvestEducationStat  guarda el InvestEducationStat  que le estoy metiendo
                .put($scope.url +"/"+ $scope.newInvestEducationStat.country + "/" +  $scope.newInvestEducationStat.year + "?apikey="+ $scope.apikey, $scope.newInvestEducationStat )
                .then(function(response){
                    console.log( $scope.newInvestEducationStat.country + "and year" + $scope.newInvestEducationStat.year + " stats has been modified. "  );
                    refresh();
                });
        };
        
        //MÉTODO PARA ELIMINAR TODOS LOS PAISES
        $scope.deleteAllInvestEducationStats  = function(){
            $http
                .delete($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    console.log("All stats delete");
                    refresh();
                });
        };
        
        //MÉTODO PARA BORRAR UN InvestEducationStat 
        $scope.deleteOneInvestEducationStat  = function(country,year){
            $http
                .delete($scope.url +"/"+ country +"/"+ year +"/?apikey="+$scope.apikey)
                .then(function(response){
                    console.log("InvestEducationStat delete: ");
                    refresh();
                });
        } ;
        
        
        //MÉTODO PARA LAS BÚSQUEDAS
        $scope.searches = function(){
            $http
                .get($scope.url+"?apikey="+$scope.apikey+"&from="+$scope.newInvestEducationStat.from+"&to="+$scope.newInvestEducationStat.to)
                .then(function(response){
                    console.log("The btween year: "+$scope.newInvestEducationStat.from +" and year "+ $scope.newInvestEducationStat.to+ " works correctly");
                    $scope.data = JSON.stringify(response.data, null, 2); // null,2 sirve para renderizar el JSON, que lo muestre bonito, etc...
                    $scope.investEducationStats  = response.data; 

                });
        };
        
        
        
        
        
        
        //--------------------------------------------------------------------------
        
var previousPage;
var nextPage;
var setPage;
var aux;

/*angular.module("InvestmentsEducationApp").
controller("InveListCtrl", ["$scope", "$http", "$rootScope",function($scope, $http, $rootScope) {
    console.log("Controller initialized");*/
    
    if (!$rootScope.apikey) $rootScope.apikey = "sos07";

   // $scope.url = "/api/v2/investmentseducation";
    $scope.search = {};
    $scope.searchAdd = {};

    $scope.data = {};	
    var dataCache = {};
    $scope.currentPage = 1;
    $scope.maxPages = 1;
    $scope.pages = [];
    $scope.pagesLeft = [];
    $scope.pagesMid = [];
    $scope.pagesRight = [];
	
	var modifier = "";
    var properties = "";

    var elementsPerPage = 2;

    function setPagination() {
        var pagesNearby = 2;
        $scope.pagesLeft = [];
        $scope.pagesMid = [];
        $scope.pagesRight = [];
        if ($scope.maxPages <= pagesNearby * 2) {
            for (var i = 1; i <= $scope.maxPages; i++) $scope.pagesLeft.push(i);
        }
        else if ($scope.currentPage >= 0 && $scope.currentPage <= pagesNearby) {
            //console.log("Left");
            //only left and mid
            for (var i = 1; i <= pagesNearby; i++) $scope.pagesLeft.push(i);
            for (i = $scope.maxPages - pagesNearby + 1; i <= $scope.maxPages; i++) $scope.pagesMid.push(i);
        }
        else if ($scope.currentPage >= $scope.maxPages - pagesNearby + 1 && $scope.currentPage <= $scope.maxPages) {
            //console.log("Right");
            //only left and mid
            for (var i = 1; i <= pagesNearby; i++) $scope.pagesMid.push(i);
            for (i = $scope.maxPages - pagesNearby + 1; i <= $scope.maxPages; i++) $scope.pagesRight.push(i);
        }
        else {
            //console.log("Mid");
            for (var i = 1; i <= pagesNearby; i++) $scope.pagesLeft.push(i);
            for (var i = Math.max($scope.currentPage - 1, pagesNearby + 1); i <= Math.min($scope.currentPage + 1, $scope.maxPages - pagesNearby); i++) $scope.pagesMid.push(i);
            for (i = $scope.maxPages - pagesNearby + 1; i <= $scope.maxPages; i++) $scope.pagesRight.push(i);
            if (($scope.pagesLeft[$scope.pagesLeft.length - 1] == $scope.pagesMid[0] - 1) && ($scope.pagesMid[$scope.pagesMid.length - 1] == $scope.pagesRight[0] - 1)) {
                //console.log("JOIN BOTH");
                $scope.pagesMid = $scope.pagesMid.concat($scope.pagesRight);
                $scope.pagesLeft = $scope.pagesLeft.concat($scope.pagesMid);
                $scope.pagesMid = [];
                $scope.pagesRight = [];
            }
            else if ($scope.pagesLeft[$scope.pagesLeft.length - 1] == $scope.pagesMid[0] - 1) {
                //console.log("JOIN MID INTO LEFT");
                $scope.pagesLeft = $scope.pagesLeft.concat($scope.pagesMid);
                $scope.pagesMid = [];
            }
            else if ($scope.pagesMid[$scope.pagesMid.length - 1] == $scope.pagesRight[0] - 1) {
                //console.log("JOIN MID INTO RIGHT");
                $scope.pagesRight = $scope.pagesMid.concat($scope.pagesRight);
                $scope.pagesMid = [];
            }
        }
    }

    $scope.setPage = function(page) {
        $scope.currentPage = page;
        $scope.refreshPage();
    };

    $scope.previousPage = function() {
        $scope.currentPage--;
        $scope.refreshPage();
    };

    $scope.nextPage = function() {
        $scope.currentPage++;
        $scope.refreshPage();
    };

    $scope.refreshPage = function() {
        if ($scope.currentPage <= 0) $scope.currentPage = 1;
        if ($scope.currentPage > $scope.maxPages) $scope.currentPage = $scope.maxPages;
        setPagination();
        if (dataCache.length > elementsPerPage) {
            $scope.data = dataCache.slice(Number(($scope.currentPage - 1) * elementsPerPage), Number(($scope.currentPage) * elementsPerPage));
        }
        else {
            $scope.data = dataCache;
        }
    };

    var refresh = $scope.refresh = function() {

       /* var modifier = "";
        var properties = "";
        if ($scope.search.country && $scope.search.year) {
            modifier = "/" + $scope.search.country + "/" + $scope.search.year;
        }
        else if ($scope.search.country) {
            modifier = "/" + $scope.search.country;
        }
        else if ($scope.search.year) {
            modifier = "/" + $scope.search.year;
        }
        for (var prop in $scope.searchAdd) {
            if ($scope.searchAdd.hasOwnProperty(prop) && prop) {
                properties += prop + "=" + $scope.searchAdd[prop] + "&";
            }
        }*/

        $http
            .get("../api/v2/investmentseducation" + modifier + "?" + "apikey=" + $scope.apikey + "&" + properties)
            .then(function(response) {
                $scope.maxPages = Math.max(Math.ceil(response.data.length / elementsPerPage), 1);
                dataCache = response.data;
                //console.log(JSON.stringify(dataCache, null, 2));
                $scope.refreshPage();
                aux = 1;
            }, function(response) {
                $scope.maxPages = 1;
                dataCache = {};
                $scope.refreshPage();
                Materialize.toast('<i class="material-icons">error_outline</i> There is no data available', 4000);
                /*Materialize.toast('<i class="material-icons">error_outline</i> There is no data available', 4000);
                $scope.data = {};*/
                aux = 0;
            });
    };
}]);