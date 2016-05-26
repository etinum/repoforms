/// <reference path="../typings/angular.d.ts" />
/// <reference path="../typings/angular-resource.d.ts" />


angular.module('repoFormsApp', ['ngRoute', 'ngMessages', 'ui.bootstrap', 'signature']);

var baseUrl = "http://localhost/";
var baseWebApiUrl = "http://localhost/webapi/";

(app => {
    var routeConfig = ($routeProvider) => {
        $routeProvider
            .when("/home", {
                templateUrl: "app/html/Home.html",
                controller: "homeCtrl"
            })
            .when("/repoform", {
                templateUrl: "app/html/RepoForm.html",
                controller: "repoCtrl"
            })
            .when("/viewReports", {
                templateUrl: "app/html/ViewReports.html",
                controller: "viewCtrl"
            })
            .otherwise({
                redirectTo: "/home"
            });
    };

    routeConfig.$inject = ['$routeProvider'];
    app.config(routeConfig);
})(angular.module("repoFormsApp"));


