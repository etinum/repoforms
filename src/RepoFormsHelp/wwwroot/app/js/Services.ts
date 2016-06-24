
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

    var service = ($http, $q, $envService, $window) => {


        // Helper methods
        //var trimObjectProperties = (objectToTrim) => {
            //for (var key in objectToTrim) {
            //    if (objectToTrim[key] !== null && objectToTrim[key].trim)
            //        objectToTrim[key] = objectToTrim[key].trim();
            //}
        //};


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

        function arrayObjectIndexOf(myArray, searchTerm, property) {
            for (var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm) return i;
            }
            return -1;
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

        function isSuperAdmin(username) {
            if (!username) {
                username = $window.userdata;
            }

            if (!username)
                return false;

            var lcuser = username.toLowerCase().split("\\")[1];
            var names = superadmin.toLowerCase().split(",");
            if (names.indexOf(lcuser) > -1) {
                return true;
            }
            return false;
        };

        function isManagement(username) {
            if (!username) {
                username = $window.userdata;
            }

            if (!username)
                return false;

            var lcuser = username.toLowerCase().split("\\")[1];

            var qualified = superadmin + "," + management;

            var names = qualified.toLowerCase().split(",");
            if (names.indexOf(lcuser) > -1) {
                return true;
            }
            return false;
        };

        function isAuditor(username) {
            if (!username) {
                username = $window.userdata;
            }

            if (!username)
                return false;

            var lcuser = username.toLowerCase().split("\\")[1];

            var qualified = superadmin + "," + management + "," + auditor;

            var names = qualified.toLowerCase().split(",");

            if (names.indexOf(lcuser) > -1) {
                return true;
            }
            return false;
        };


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
                }, (response) => {
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
                }, (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        }


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
                }, (response) => {
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
                }, (response) => {
                    alertFailed(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        };


        // Misc
        var getLoggedUser = () => {
            var url = baseWebApiUrl + 'api/User/GetLoggedUser';
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

        var getUser = (id) => {
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

        var getAllUsers = () => {
            var url = baseWebApiUrl + 'api/User/GetAllUsers';
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

        var saveUser = (formdata) => {
            var url = baseWebApiUrl + 'api/RepoForm/SaveUser';
            var deferred = $q.defer();

            $http.post(url, formdata)
                .then(() => {
                    deferred.resolve();
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
            getLoggedUser: getLoggedUser,
            getAllUsers: getAllUsers,
            getTypeAheadData: getTypeAheadData,
            saveForm: saveForm,
            deleteForm: deleteForm,
            getLocation: getLocation,
            getForms: getForms,
            getForm: getForm,
            saveUser: saveUser,
            // Helper Methods
            arrayUnique: arrayUnique,
            arrayObjectIndexOf: arrayObjectIndexOf,
            isFalse: isFalse,
            isTrue: isTrue,
            isSuperAdmin: isSuperAdmin,
            isManagement: isManagement,
            isAuditor: isAuditor,
            // Static list 
            closeTypeOptions: ['BK', 'PAID', 'FORWARD', 'LOCATE', 'REPO'],
            clientOptions: ['UTOTRAKK', 'ALLY FINANCIAL', 'BAY ENTERPRISE GROUP', 'BHFC', 'C & F FINANCE', 'CARMAX AUTO FINANCE', 'CFAM', 'CHRYSLER CAPITAL-2', 'CHRYSLER CAPITAL-3', 'CITY WIDE INVESTIGATIONS', 'CLA', 'CONSUMER PORTFOLIO', 'EXETER', 'FORD MOTOR CREDIT', 'HYUNDAI MOTOR FINANCE', 'NISSAN MOTOR ACCEPTANCE ', 'NMAC LOSS RECOVERY IGS', 'SAFCO', 'SANTANDER-1', 'SANTANDER-2', 'SANTANDER-3', 'VW CREDIT-PSC', 'VW CREDIT-CSC', 'WELLS FARGO', 'WESTLAKE FINANCIAL', 'UNIVERSAL ACCEPTANCE CORP', 'TURBO TITLE LOANS', 'PRA RECEIVABLE MANAGEMENT', 'SANTANDER-4', 'PRA RECEIVABLES', 'CHRYSLER CAPITAL-1', 'VW CREDIT', 'SST'],
            investigatorOptions: ['Aaron Brazil', 'Aaron Steele', 'Adam Cuthbertson', 'Aimee Lamoureux', 'Alexandria Velis', 'Alexis Smith', 'Anthony D\'Lallo','Brandice Plunkett','Brandon Burkhouse','Brian Shultis','Bryan Olson','Casey Flissinger','Charles Ruth','Cheryl Stuckey','Christy Gallow','Courtney Kulik','Dak Brown','Denise Priano','Devin Hughes','Erica Farley','Erika Holiday','House','Janette Bailey','Jason Anderson','Jeremy Lynch','Jessica Westphal','Jinette Hernandez','Johanna Johnson','Keshia Fisher','Kevin Zwahlen','Katie Halling','Kristina Karavan','Kyle Baugher','Madison Post','Mary Sydloski','Nicole Seevers','Nicole Ho','Oliver Shipp','Patrick Mcdonnell','Priscilla Nava','Rachel Fader','Ricklene Smith','Roger Goss','Rolf Bell','Rose Cuellar','Sarah Blankenship','Sean Sasville','Shauna Harris','Shay Harmon','Stacy Fisher','Steve Estey','Tatyana Nesterova','Thomas Anderson','Timothy Beeman','Tony Quadra','Tonia Gatto','Travis Rudnick','Trey Jackson','Zac Bastien'],
            states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']

        };
    };

    service.$inject = ['$http', '$q', 'envService', '$window'];
    app.factory("dataService", service);

})(angular.module("repoFormsApp"));


