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
            .when("/viewuserroles", {
                templateUrl: "app/html/ViewUserRoles.html",
                controller: "viewUserRolesCtrl"
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
                alt: ['plsf:7700'],
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
                alt: {
                    apiUrl: '//plsf:7700/webapi/',
                    staticUrl: '//plsf:7700/'
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
    var runner = ($rootScope, $dataService, $templateCache) => {
        $rootScope.load = $dataService.initiateRoles();

        // global pagination properties
        $rootScope.itemsByPage = 10;
        $rootScope.displayedPagesMax = 5;

        // template for smart table pagination
        $templateCache.put('template/smart-table/pagination.html',
            '<nav ng-if="numPages && pages.length >= 2"><ul class="pagination">' +
            '<li ng-class=""><a ng-click="selectPage(1)">First</a></li>' +
            '<li ng-class=""><a ng-click="selectPage(currentPage-1)"><i class="glyphicon glyphicon-menu-left"></i></i></a></li>' +
            '<li ng-repeat="page in pages" ng-class="{active: page==currentPage}"><a ng-click="selectPage(page)">{{page}}</a></li>' +
            '<li ng-class=""><a ng-click="selectPage(currentPage+1)"><i class="glyphicon glyphicon-menu-right"></i></i></a></li>' +
            '<li ng-class=""><a ng-click="selectPage(numPages)">Last</a></li>' +
            '</ul></nav>');


    };
    runner.$inject = ['$rootScope', 'dataService', '$templateCache'];
    app.run(runner);
})(angular.module("repoFormsApp"));

