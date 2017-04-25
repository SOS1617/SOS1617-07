angular.module("EducationManagerApp",["ngRoute"]).config(function ($routeProvider){
    
    $routeProvider.when("/",{
        templateURL : "list.html",
        controller : "ListCtrl"
    });
    
    $routeProvider.when("/stat", {
        templateURL : "edit.html"
        
     });
    
    console.log("App initialized and configurated");
});
    