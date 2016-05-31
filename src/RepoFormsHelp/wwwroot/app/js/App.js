var myApp = angular.module('repoFormsApp', ['ngRoute', 'ngMessages', 'ui.bootstrap', 'signature', 'environment']);
var baseUrl = "http://localhost/";
var baseWebApiUrl = "http://localhost/webapi/";
(function (app) {
    var config = function ($routeProvider, $envServiceProvider) {
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
        $envServiceProvider.config({
            domains: {
                development: ['localhost', 'dev.local'],
                production: ['plsf', 'plsf.portfoliorecovery.com']
            },
            vars: {
                development: {
                    apiUrl: '//localhost/webapi/',
                    staticUrl: '//localhost/'
                },
                production: {
                    apiUrl: '//plsf/webapi/',
                    staticUrl: '//plsf/'
                }
            }
        });
        $envServiceProvider.check();
    };
    config.$inject = ['$routeProvider', 'envServiceProvider'];
    app.config(config);
})(angular.module("repoFormsApp"));
//# sourceMappingURL=App.js.map