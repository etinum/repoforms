/// <reference path="../typings/angular.d.ts" />
/// <reference path="../typings/angular-resource.d.ts" />
/// <reference path="../typings/angular-environment.d.ts" />


// Global configurations: 
// superadmin all groups
// manager includes auditor
// auditor ...  etc.  
var superadmin = 'Ertran,JFountaine,JAZiebro';
var management = 'JAZiebro,JFountaine,knbaugher,ajfader';
var auditor = 'TAKushnir,cashideler,ShHarmon,clwren,mashields';


angular.module('repoFormsApp', ['ngRoute', 'ngMessages', 'ui.bootstrap', 'environment', 'smart-table', 'cgBusy']);
    

(app => {
    var config = ($routeProvider, $envServiceProvider, $locationProvider) => {
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
            .when("/viewclients", {
                templateUrl: "app/html/ViewClients.html",
                controller: "viewClientsCtrl"
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
                // anotherStage: ['domain1', 'domain2'],
                // anotherStage: ['domain1', 'domain2']
            },
            vars: {
                development: {
                    apiUrl: '//localhost/webapi/',
                    staticUrl: '//localhost/'
                    // antoherCustomVar: 'lorem',
                    // antoherCustomVar: 'ipsum'
                },
                staging: {
                    apiUrl: '//plsf:9900/webapi/',
                    staticUrl: '//plsf:9900/'
                },
                iisexpress: {
                    apiUrl: '//localhost:15021/webapi/',
                    staticUrl: '//localhost:15021/'
                    // antoherCustomVar: 'lorem',
                    // antoherCustomVar: 'ipsum'
                },
                production: {
                    apiUrl: '//plsf/webapi/',
                    staticUrl: '//plsf/'
                    // antoherCustomVar: 'lorem',
                    // antoherCustomVar: 'ipsum'
                }
                // anotherStage: {
                //  customVar: 'lorem',
                //  customVar: 'ipsum'
                // }
            }
        });

        $envServiceProvider.check();

        //$locationProvider.html5Mode(true);
    };

    config.$inject = ['$routeProvider', 'envServiceProvider', '$locationProvider'];
    app.config(config);
})(angular.module("repoFormsApp"));

(app => {
    var runner = ($rootScope, $dataService) => {
        $rootScope.load = $dataService.initiateRoles();

    };
    runner.$inject = ['$rootScope', 'dataService'];
    app.run(runner);
})(angular.module("repoFormsApp"));