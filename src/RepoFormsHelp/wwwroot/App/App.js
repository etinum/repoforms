var app = angular.module('repoFormsApp', ['ngRoute']);

app.config(["$routeProvider", "$locationProvider",
    function ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "app/Home.html",
                controller: "homeCtrl"
            })
            .when("/repoform", {
                templateUrl: "app/RepoForm.html",
                controller: "repoCtrl"
            })
            .when("/viewReports", {
                templateUrl: "app/ViewReports.html",
                controller: "viewCtrl"
            })
            .otherwise({
                redirectTo: "/home"
            });
        //$locationProvider.html5Mode(true);
    }]);

