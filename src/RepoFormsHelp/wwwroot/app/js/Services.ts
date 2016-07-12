
/* TEMPLATE
(app => {

    var service = ($http, $q, $envService) => {
        // Implmentation
    };

    service.$inject = ['$http', '$q', 'envService'];
    app.factory("service_name", service);

})(angular.module("repoFormsApp"));
*/



(app => {

    var service = ($http, $q, $envService, $window, $rootScope, $interval) => {


        // Helper methods
        //var trimObjectProperties = (objectToTrim) => {
        //for (var key in objectToTrim) {
        //    if (objectToTrim[key] !== null && objectToTrim[key].trim)
        //        objectToTrim[key] = objectToTrim[key].trim();
        //}
        //};


        var userData = <modeltypings.UserViewModel>null;


        var arrayUnique = (array) => {
            var a = array.concat();
            for (var i = 0; i < a.length; ++i) {
                for (var j = i + 1; j < a.length; ++j) {
                    if (a[i] === a[j])
                        a.splice(j--, 1);
                }
            }
            return a;
        };


        function arrayDeleteMatchingObject(myArray, searchTerm, property): boolean {
            for (var i = 0, len = myArray.length; i < len; i++) {
                var value = myArray[i][property];
                if (value === parseInt(value, 10)) {
                    if (parseInt(value, 10) === searchTerm) {
                        myArray.splice(i, 1);
                        return true;
                    }
                } else {
                    if (value.toLowerCase() === searchTerm.toLowerCase()) {
                        myArray.splice(i, 1);
                        return true;
                    }
                }

            }
            return false;
        };

        function arrayObjectIndexOf(myArray, searchTerm, property): number {
            for (var i = 0, len = myArray.length; i < len; i++) {
                var value = myArray[i][property];
                if (value === parseInt(value, 10)) {
                    if (parseInt(value, 10) === searchTerm) return i;
                } else {
                    if (value.toLowerCase() === searchTerm.toLowerCase()) return i;
                }

            }
            return -1;
        };

        function arrayGetObject(myArray, searchTerm, property): any {
            for (var i = 0, len = myArray.length; i < len; i++) {
                var value = myArray[i][property];
                if (value === parseInt(value, 10)) {
                    if (parseInt(value, 10) === parseInt(searchTerm, 10)) return myArray[i];
                } else {
                    if (value.toLowerCase() === searchTerm.toString().toLowerCase()) return myArray[i];
                }

            }
            return null;
        };

        function isFalse(obj) {
            if (obj === null || obj === false || obj === undefined) {
                return false;
            }
            return true;
        };

        function isTrue(obj) {
            if (obj === true) {
                return true;
            }
            return false;
        };


        function gotoPage(page: number) {
            angular
                .element($('#pagerId'))
                .isolateScope()
                .selectPage(page);
        }


        var baseWebApiUrl = $envService.read('apiUrl');

        // Error messages
        var alertFailed = (response) => {
            alert("There was a problem with the back end call, here is your status code: " + response.status);
        };

        // Repo Form services
        var saveForm = (formdata) => {
            var url = baseWebApiUrl + 'api/RepoForm/SaveForm';
            var deferred = $q.defer();

            $http.post(url, formdata)
                .then(() => {
                    deferred.resolve();
                },
                (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        var deleteForm = (id) => {
            var url = baseWebApiUrl + 'api/RepoForm/DeleteForm';
            var deferred = $q.defer();

            $http.post(url, id)
                .then(() => {
                    deferred.resolve();
                },
                (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        var searchVin = (data: string): modeltypings.AccountVinClientViewModel => {
            var url = baseWebApiUrl + 'api/RepoForm/SearchVin';
            var deferred = $q.defer();

            $http.get(url,
                {
                    params: {
                        searchVinString: data
                    }
                })
                .then(response => {
                    deferred.resolve(response.data);
                },
                (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        };


        // Google api 
        var getLocation = (val) => {
            var deferred = $q.defer();

            $http.get('//maps.googleapis.com/maps/api/geocode/json',
                {
                    params: {
                        address: val + ', USA',
                        sensor: false
                    }
                })
                .then((response) => {
                    deferred.resolve(response.data.results.map(r => r));
                },
                (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        // TypeAhead data
        var getTypeAheadData = () => {
            var url = baseWebApiUrl + 'api/RepoForm/TypeAheadData';
            var deferred = $q.defer();

            $http.get(url)
                .then(response => {
                    deferred.resolve(response.data);
                },
                (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        };


        // Misc

        function configureRolesPlus(user: modeltypings.UserViewModel) {

            var roles = user.roles.map(r => r.name);
            $rootScope.welcome = "Welcome " + user.winAuthName.toLowerCase().split("\\")[1];

            //TODO: remove this when the system is ready.
            var isSuper = $rootScope.isSuperAdmin = 1; // roles.indexOf('SuperAdmin') > -1;
            $rootScope.isSystemAdmin = roles.indexOf('SystemAdmin') > -1 || isSuper;
            $rootScope.isManagement = roles.indexOf('Management') > -1 || isSuper;
            $rootScope.isAuditor = roles.indexOf('Auditor') > -1 || isSuper;
            $rootScope.isSkipTracer = roles.indexOf('SkipTracer') > -1 || isSuper;

        }

        var getLoggedUserData = (): modeltypings.UserViewModel => {
            var deferred = $q.defer();

            var check = $interval(() => {
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
            };


            return deferred.promise;

        }


        var initiateRoles = (): modeltypings.UserViewModel => {

            var deferred = $q.defer();

            if (userData == null) {
                var url = baseWebApiUrl + 'api/User/GetLoggedUser';
                $http.get(url)
                    .then(response => {
                        userData = response.data;
                        configureRolesPlus(userData);
                        deferred.resolve(userData);
                    },
                    (response) => {
                        alertFailed(response);
                        deferred.reject(response);
                    });
            } else {
                deferred.resolve(userData);
            }
            return deferred.promise;
        };

        var getUser = (id: number) => {
            var url = baseWebApiUrl + 'api/User/GetUser';
            var deferred = $q.defer();

            $http.get(url, {
                params: {
                    id: id
                }
            })
                .then(response => {
                    deferred.resolve(response.data);
                }, (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        var getUsers = () => {
            var url = baseWebApiUrl + 'api/User/GetUsers';
            var deferred = $q.defer();

            $http.get(url)
                .then(response => {
                    deferred.resolve(response.data);
                }, (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        var deleteUser = (id) => {
            var url = baseWebApiUrl + 'api/User/DeleteUser';
            var deferred = $q.defer();

            $http.post(url, id)
                .then(() => {
                    deferred.resolve();
                },
                (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        };


        var getClients = () => {
            var url = baseWebApiUrl + 'api/Client/GetClients';
            var deferred = $q.defer();

            $http.get(url)
                .then(response => {
                    deferred.resolve(response.data);
                }, (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        var saveClient = (formdata) => {
            var url = baseWebApiUrl + 'api/Client/SaveClient';
            var deferred = $q.defer();

            $http.post(url, formdata)
                .then((response) => {
                    deferred.resolve(response.data);
                }, (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        }



        var saveUser = (formdata) => {
            var url = baseWebApiUrl + 'api/User/SaveUser';
            var deferred = $q.defer();

            $http.post(url, formdata)
                .then((response) => {
                    deferred.resolve(response);
                }, (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        }


        var getForms = () => {
            var url = baseWebApiUrl + 'api/RepoForm/GetForms';
            var deferred = $q.defer();

            $http.get(url)
                .then(response => {
                    deferred.resolve(response.data);
                }, (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        var getForm = (id) => {
            var url = baseWebApiUrl + 'api/RepoForm/GetForm';
            var deferred = $q.defer();

            $http.get(url, {
                params: {
                    id: id
                }
            })
                .then(response => {
                    deferred.resolve(response.data);
                }, (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        };


        return {
            getUser: getUser,
            initiateRoles: initiateRoles,
            getLoggedUserData: getLoggedUserData,
            getUsers: getUsers,
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
            // Helper Methods
            arrayUnique: arrayUnique,
            arrayObjectIndexOf: arrayObjectIndexOf,
            arrayGetObject: arrayGetObject,
            arrayDeleteMatchingObject: arrayDeleteMatchingObject,
            isFalse: isFalse,
            isTrue: isTrue,
            gotoPage: gotoPage,
            // Static list 
            closeTypeOptions: ['BK', 'PAID', 'FORWARD', 'LOCATE', 'REPO'],
            clientOptions: ['UTOTRAKK', 'ALLY FINANCIAL', 'BAY ENTERPRISE GROUP', 'BHFC', 'C & F FINANCE', 'CARMAX AUTO FINANCE', 'CFAM', 'CHRYSLER CAPITAL-2', 'CHRYSLER CAPITAL-3', 'CITY WIDE INVESTIGATIONS', 'CLA', 'CONSUMER PORTFOLIO', 'EXETER', 'FORD MOTOR CREDIT', 'HYUNDAI MOTOR FINANCE', 'NISSAN MOTOR ACCEPTANCE ', 'NMAC LOSS RECOVERY IGS', 'SAFCO', 'SANTANDER-1', 'SANTANDER-2', 'SANTANDER-3', 'VW CREDIT-PSC', 'VW CREDIT-CSC', 'WELLS FARGO', 'WESTLAKE FINANCIAL', 'UNIVERSAL ACCEPTANCE CORP', 'TURBO TITLE LOANS', 'PRA RECEIVABLE MANAGEMENT', 'SANTANDER-4', 'PRA RECEIVABLES', 'CHRYSLER CAPITAL-1', 'VW CREDIT', 'SST'],
            investigatorOptions: ['Aaron Brazil', 'Aaron Steele', 'Adam Cuthbertson', 'Aimee Lamoureux', 'Alexandria Velis', 'Alexis Smith', 'Anthony D\'Lallo', 'Brandice Plunkett', 'Brandon Burkhouse', 'Brian Shultis', 'Bryan Olson', 'Casey Flissinger', 'Charles Ruth', 'Cheryl Stuckey', 'Christy Gallow', 'Courtney Kulik', 'Dak Brown', 'Denise Priano', 'Devin Hughes', 'Erica Farley', 'Erika Holiday', 'House', 'Janette Bailey', 'Jason Anderson', 'Jeremy Lynch', 'Jessica Westphal', 'Jinette Hernandez', 'Johanna Johnson', 'Keshia Fisher', 'Kevin Zwahlen', 'Katie Halling', 'Kristina Karavan', 'Kyle Baugher', 'Madison Post', 'Mary Sydloski', 'Nicole Seevers', 'Nicole Ho', 'Oliver Shipp', 'Patrick Mcdonnell', 'Priscilla Nava', 'Rachel Fader', 'Ricklene Smith', 'Roger Goss', 'Rolf Bell', 'Rose Cuellar', 'Sarah Blankenship', 'Sean Sasville', 'Shauna Harris', 'Shay Harmon', 'Stacy Fisher', 'Steve Estey', 'Tatyana Nesterova', 'Thomas Anderson', 'Timothy Beeman', 'Tony Quadra', 'Tonia Gatto', 'Travis Rudnick', 'Trey Jackson', 'Zac Bastien'],
            states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']

        };
    };

    service.$inject = ['$http', '$q', 'envService', '$window', '$rootScope', '$interval'];
    app.factory("dataService", service);

})(angular.module("repoFormsApp"));


