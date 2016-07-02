var superadmin = 'Ertran,JFountaine,JAZiebro';
var management = 'JAZiebro,JFountaine,knbaugher,ajfader';
var auditor = 'TAKushnir,cashideler,ShHarmon,clwren,mashields';
angular.module('repoFormsApp', ['ngRoute', 'ngMessages', 'ui.bootstrap', 'environment', 'smart-table', 'cgBusy']);
(function (app) {
    var config = function ($routeProvider, $envServiceProvider, $locationProvider) {
        $routeProvider
            .when("/home", {
            templateUrl: "app/html/Home.html",
            controller: "homeCtrl"
        })
            .when("/repoform", {
            templateUrl: "app/html/RepoForm.html",
            controller: "repoCtrl"
        })
            .when("/repoform/:id", {
            templateUrl: "app/html/RepoForm.html",
            controller: "repoCtrl"
        })
            .when("/userform/:id", {
            templateUrl: "app/html/UserForm.html",
            controller: "userCtrl"
        })
            .when("/viewusers", {
            templateUrl: "app/html/ViewUsers.html",
            controller: "viewUsersCtrl"
        })
            .when("/admin", {
            templateUrl: "app/html/ViewReports.html",
            controller: "viewRepoFormCtrl"
        })
            .when("/submissions", {
            templateUrl: "app/html/ViewSubmissions.html",
            controller: "submissionsCtrl"
        })
            .otherwise({
            redirectTo: "/home"
        });
        $envServiceProvider.config({
            domains: {
                development: ['localhost', 'dev.local'],
                iisexpress: ['localhost:15021'],
                production: ['plsf', 'plsf.portfoliorecovery.com'],
                staging: ['plsf:9900']
            },
            vars: {
                development: {
                    apiUrl: '//localhost/webapi/',
                    staticUrl: '//localhost/'
                },
                staging: {
                    apiUrl: '//plsf:9900/webapi/',
                    staticUrl: '//plsf:9900/'
                },
                iisexpress: {
                    apiUrl: '//localhost:15021/webapi/',
                    staticUrl: '//localhost:15021/'
                },
                production: {
                    apiUrl: '//plsf/webapi/',
                    staticUrl: '//plsf/'
                }
            }
        });
        $envServiceProvider.check();
    };
    config.$inject = ['$routeProvider', 'envServiceProvider', '$locationProvider'];
    app.config(config);
})(angular.module("repoFormsApp"));
(function (app) {
    var runner = function ($rootScope, $dataService) {
        $rootScope.load = $dataService.initiateRoles();
    };
    runner.$inject = ['$rootScope', 'dataService'];
    app.run(runner);
})(angular.module("repoFormsApp"));
//# sourceMappingURL=App.js.map