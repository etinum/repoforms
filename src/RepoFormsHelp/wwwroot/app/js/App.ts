/// <reference path="../typings/angular.d.ts" />
/// <reference path="../typings/angular-resource.d.ts" />
/// <reference path="../typings/angular-environment.d.ts" />


// Global configurations: 
// superadmin all groups
// manager includes auditor
// auditor ...  etc.  
var superadmin = 'JFountaine,JAZiebro';
var management = 'Ertran,JAZiebro,JFountaine,knbaugher';
var auditor = 'TAKushnir,cashideler';



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
            .when("/admin", {
                templateUrl: "app/html/ViewReports.html",
                controller: "viewCtrl"
            })
            .otherwise({
                redirectTo: "/home"
            });

        $envServiceProvider.config({
            domains: {
                development: ['localhost', 'dev.local'],
                iisexpress: ['localhost:15021'],
                production: ['plsf', 'plsf.portfoliorecovery.com']
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

