(function (app) {
    var service = function ($http, $q, $envService, $window, $rootScope, $interval) {
        var userData = null;
        var arrayUnique = function (array) {
            var a = array.concat();
            for (var i = 0; i < a.length; ++i) {
                for (var j = i + 1; j < a.length; ++j) {
                    if (a[i] === a[j])
                        a.splice(j--, 1);
                }
            }
            return a;
        };
        function arrayDeleteMatchingObject(myArray, searchTerm, property) {
            for (var i = 0, len = myArray.length; i < len; i++) {
                var value = myArray[i][property];
                if (value === parseInt(value, 10)) {
                    if (parseInt(value, 10) === searchTerm) {
                        myArray.splice(i, 1);
                        return true;
                    }
                }
                else {
                    if (value.toLowerCase() === searchTerm.toLowerCase()) {
                        myArray.splice(i, 1);
                        return true;
                    }
                }
            }
            return false;
        }
        ;
        function arrayObjectIndexOf(myArray, searchTerm, property) {
            for (var i = 0, len = myArray.length; i < len; i++) {
                var value = myArray[i][property];
                if (value === parseInt(value, 10)) {
                    if (parseInt(value, 10) === searchTerm)
                        return i;
                }
                else {
                    if (value.toLowerCase() === searchTerm.toLowerCase())
                        return i;
                }
            }
            return -1;
        }
        ;
        function arrayGetObject(myArray, searchTerm, property) {
            for (var i = 0, len = myArray.length; i < len; i++) {
                var value = myArray[i][property];
                if (value === parseInt(value, 10)) {
                    if (parseInt(value, 10) === parseInt(searchTerm, 10))
                        return myArray[i];
                }
                else {
                    if (value.toLowerCase() === searchTerm.toString().toLowerCase())
                        return myArray[i];
                }
            }
            return null;
        }
        ;
        function isFalse(obj) {
            if (obj === null || obj === false || obj === undefined) {
                return false;
            }
            return true;
        }
        ;
        function isTrue(obj) {
            if (obj === true) {
                return true;
            }
            return false;
        }
        ;
        var baseWebApiUrl = $envService.read('apiUrl');
        var alertFailed = function (response) {
            alert("There was a problem with the back end call, here is your status code: " + response.status);
        };
        var saveForm = function (formdata) {
            var url = baseWebApiUrl + 'api/RepoForm/SaveForm';
            var deferred = $q.defer();
            $http.post(url, formdata)
                .then(function () {
                deferred.resolve();
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var deleteForm = function (id) {
            var url = baseWebApiUrl + 'api/RepoForm/DeleteForm';
            var deferred = $q.defer();
            $http.post(url, id)
                .then(function () {
                deferred.resolve();
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var searchVin = function (data) {
            var url = baseWebApiUrl + 'api/RepoForm/SearchVin';
            var deferred = $q.defer();
            $http.get(url, {
                params: {
                    searchVinString: data
                }
            })
                .then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var getLocation = function (val) {
            var deferred = $q.defer();
            $http.get('//maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: val + ', USA',
                    sensor: false
                }
            })
                .then(function (response) {
                deferred.resolve(response.data.results.map(function (r) { return r; }));
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var getTypeAheadData = function () {
            var url = baseWebApiUrl + 'api/RepoForm/TypeAheadData';
            var deferred = $q.defer();
            $http.get(url)
                .then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        function configureRolesPlus(user) {
            var roles = user.roles;
            $rootScope.welcome = "Welcome " + user.winAuthName.toLowerCase().split("\\")[1];
            var isSuper = $rootScope.isSuperAdmin = 1;
            $rootScope.isSystemAdmin = roles.indexOf('SystemAdmin') > -1 || isSuper;
            $rootScope.isManagement = roles.indexOf('Management') > -1 || isSuper;
            $rootScope.isAuditor = roles.indexOf('Auditor') > -1 || isSuper;
            $rootScope.isSkipTracer = roles.indexOf('SkipTracer') > -1 || isSuper;
        }
        var getLoggedUserData = function () {
            var deferred = $q.defer();
            var check = $interval(function () {
                checkUserData();
            }, 250);
            function checkUserData() {
                if (userData != null) {
                    deferred.resolve(userData);
                }
                if (angular.isDefined(check)) {
                    $interval.cancel(check);
                    check = undefined;
                }
            }
            ;
            return deferred.promise;
        };
        var initiateRoles = function () {
            var deferred = $q.defer();
            if (userData == null) {
                var url = baseWebApiUrl + 'api/User/GetLoggedUser';
                $http.get(url)
                    .then(function (response) {
                    userData = response.data;
                    configureRolesPlus(userData);
                    deferred.resolve(userData);
                }, function (response) {
                    alertFailed(response);
                    deferred.reject(response);
                });
            }
            else {
                deferred.resolve(userData);
            }
            return deferred.promise;
        };
        var getUser = function (id) {
            var url = baseWebApiUrl + 'api/User/GetUser';
            var deferred = $q.defer();
            $http.get(url, {
                params: {
                    id: id
                }
            })
                .then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var getAllUsers = function () {
            var url = baseWebApiUrl + 'api/User/GetAllUsers';
            var deferred = $q.defer();
            $http.get(url)
                .then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var deleteUser = function (id) {
            var url = baseWebApiUrl + 'api/User/DeleteUser';
            var deferred = $q.defer();
            $http.post(url, id)
                .then(function () {
                deferred.resolve();
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var getClients = function () {
            var url = baseWebApiUrl + 'api/Client/GetClients';
            var deferred = $q.defer();
            $http.get(url)
                .then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var saveClient = function (formdata) {
            var url = baseWebApiUrl + 'api/Client/SaveClient';
            var deferred = $q.defer();
            $http.post(url, formdata)
                .then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var saveUser = function (formdata) {
            var url = baseWebApiUrl + 'api/User/SaveUser';
            var deferred = $q.defer();
            $http.post(url, formdata)
                .then(function (response) {
                deferred.resolve(response);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var getForms = function () {
            var url = baseWebApiUrl + 'api/RepoForm/GetForms';
            var deferred = $q.defer();
            $http.get(url)
                .then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var getForm = function (id) {
            var url = baseWebApiUrl + 'api/RepoForm/GetForm';
            var deferred = $q.defer();
            $http.get(url, {
                params: {
                    id: id
                }
            })
                .then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        return {
            getUser: getUser,
            initiateRoles: initiateRoles,
            getLoggedUserData: getLoggedUserData,
            getAllUsers: getAllUsers,
            getClients: getClients,
            getTypeAheadData: getTypeAheadData,
            searchVin: searchVin,
            saveForm: saveForm,
            deleteForm: deleteForm,
            getLocation: getLocation,
            getForms: getForms,
            getForm: getForm,
            saveUser: saveUser,
            saveClient: saveClient,
            arrayUnique: arrayUnique,
            arrayObjectIndexOf: arrayObjectIndexOf,
            arrayGetObject: arrayGetObject,
            arrayDeleteMatchingObject: arrayDeleteMatchingObject,
            isFalse: isFalse,
            isTrue: isTrue,
            closeTypeOptions: ['BK', 'PAID', 'FORWARD', 'LOCATE', 'REPO'],
            clientOptions: ['UTOTRAKK', 'ALLY FINANCIAL', 'BAY ENTERPRISE GROUP', 'BHFC', 'C & F FINANCE', 'CARMAX AUTO FINANCE', 'CFAM', 'CHRYSLER CAPITAL-2', 'CHRYSLER CAPITAL-3', 'CITY WIDE INVESTIGATIONS', 'CLA', 'CONSUMER PORTFOLIO', 'EXETER', 'FORD MOTOR CREDIT', 'HYUNDAI MOTOR FINANCE', 'NISSAN MOTOR ACCEPTANCE ', 'NMAC LOSS RECOVERY IGS', 'SAFCO', 'SANTANDER-1', 'SANTANDER-2', 'SANTANDER-3', 'VW CREDIT-PSC', 'VW CREDIT-CSC', 'WELLS FARGO', 'WESTLAKE FINANCIAL', 'UNIVERSAL ACCEPTANCE CORP', 'TURBO TITLE LOANS', 'PRA RECEIVABLE MANAGEMENT', 'SANTANDER-4', 'PRA RECEIVABLES', 'CHRYSLER CAPITAL-1', 'VW CREDIT', 'SST'],
            investigatorOptions: ['Aaron Brazil', 'Aaron Steele', 'Adam Cuthbertson', 'Aimee Lamoureux', 'Alexandria Velis', 'Alexis Smith', 'Anthony D\'Lallo', 'Brandice Plunkett', 'Brandon Burkhouse', 'Brian Shultis', 'Bryan Olson', 'Casey Flissinger', 'Charles Ruth', 'Cheryl Stuckey', 'Christy Gallow', 'Courtney Kulik', 'Dak Brown', 'Denise Priano', 'Devin Hughes', 'Erica Farley', 'Erika Holiday', 'House', 'Janette Bailey', 'Jason Anderson', 'Jeremy Lynch', 'Jessica Westphal', 'Jinette Hernandez', 'Johanna Johnson', 'Keshia Fisher', 'Kevin Zwahlen', 'Katie Halling', 'Kristina Karavan', 'Kyle Baugher', 'Madison Post', 'Mary Sydloski', 'Nicole Seevers', 'Nicole Ho', 'Oliver Shipp', 'Patrick Mcdonnell', 'Priscilla Nava', 'Rachel Fader', 'Ricklene Smith', 'Roger Goss', 'Rolf Bell', 'Rose Cuellar', 'Sarah Blankenship', 'Sean Sasville', 'Shauna Harris', 'Shay Harmon', 'Stacy Fisher', 'Steve Estey', 'Tatyana Nesterova', 'Thomas Anderson', 'Timothy Beeman', 'Tony Quadra', 'Tonia Gatto', 'Travis Rudnick', 'Trey Jackson', 'Zac Bastien'],
            states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
        };
    };
    service.$inject = ['$http', '$q', 'envService', '$window', '$rootScope', '$interval'];
    app.factory("dataService", service);
})(angular.module("repoFormsApp"));
//# sourceMappingURL=Services.js.map