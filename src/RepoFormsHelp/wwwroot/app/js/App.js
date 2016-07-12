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
                alt: {
                    apiUrl: '//plsf:7700/webapi/',
                    staticUrl: '//plsf:7700/'
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
    var runner = function ($rootScope, $dataService, $templateCache) {
        $rootScope.load = $dataService.initiateRoles();
        $rootScope.itemsByPage = 10;
        $rootScope.displayedPagesMax = 5;
        $templateCache.put('template/smart-table/pagination.html', '<nav ng-if="numPages && pages.length >= 2"><ul class="pagination">' +
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
//# sourceMappingURL=App.js.map