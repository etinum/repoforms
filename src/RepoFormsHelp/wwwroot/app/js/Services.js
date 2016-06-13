(function (app) {
    var service = function ($http, $q, $envService, $window) {
        var trimObjectProperties = function (objectToTrim) {
        };
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
        function arrayObjectIndexOf(myArray, searchTerm, property) {
            for (var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm)
                    return i;
            }
            return -1;
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
        }
        ;
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
        }
        ;
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
        }
        ;
        var baseWebApiUrl = $envService.read('apiUrl');
        var alertFailed = function (response) {
            alert("There was a problem with the back end call, here is your status code: " + response.status);
        };
        var getPersons = function () {
            var url = baseWebApiUrl + 'api/values/get';
            var deferred = $q.defer();
            $http.get(url)
                .then(function (response) {
                trimObjectProperties(response.data);
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var addPerson = function (person) {
            var url = baseWebApiUrl + 'api/values/post';
            var deferred = $q.defer();
            $http.post(url, person)
                .then(function () {
                alert("Successfully saved.");
                deferred.resolve();
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
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
        var getLocation = function (val) {
            var url = baseWebApiUrl + 'api/RepoForm/SaveForm';
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
                trimObjectProperties(response.data);
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var getUser = function () {
            var url = baseWebApiUrl + 'api/RepoForm/GetUser';
            var deferred = $q.defer();
            $http.get(url)
                .then(function (response) {
                trimObjectProperties(response.data);
                deferred.resolve(response.data);
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
                trimObjectProperties(response.data);
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
                trimObjectProperties(response.data);
                deferred.resolve(response.data);
            }, function (response) {
                alertFailed(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        return {
            getUser: getUser,
            getTypeAheadData: getTypeAheadData,
            saveForm: saveForm,
            getPersons: getPersons,
            addPerson: addPerson,
            getLocation: getLocation,
            getForms: getForms,
            getForm: getForm,
            trimObjectProperties: trimObjectProperties,
            arrayUnique: arrayUnique,
            arrayObjectIndexOf: arrayObjectIndexOf,
            isFalse: isFalse,
            isTrue: isTrue,
            isSuperAdmin: isSuperAdmin,
            isManagement: isManagement,
            isAuditor: isAuditor,
            closeTypeOptions: ['BK', 'PAID', 'FORWARD', 'LOCATE', 'REPO', 'LPR'],
            clientOptions: ['UTOTRAKK', 'ALLY FINANCIAL', 'BAY ENTERPRISE GROUP', 'BHFC', 'C & F FINANCE', 'CARMAX AUTO FINANCE', 'CFAM', 'CHRYSLER CAPITAL-2', 'CHRYSLER CAPITAL-3', 'CITY WIDE INVESTIGATIONS', 'CLA', 'CONSUMER PORTFOLIO', 'EXETER', 'FORD MOTOR CREDIT', 'HYUNDAI MOTOR FINANCE', 'NISSAN MOTOR ACCEPTANCE ', 'NMAC LOSS RECOVERY IGS', 'SAFCO', 'SANTANDER-1', 'SANTANDER-2', 'SANTANDER-3', 'VW CREDIT-PSC', 'VW CREDIT-CSC', 'WELLS FARGO', 'WESTLAKE FINANCIAL', 'UNIVERSAL ACCEPTANCE CORP', 'TURBO TITLE LOANS', 'PRA RECEIVABLE MANAGEMENT', 'SANTANDER-4', 'PRA RECEIVABLES', 'CHRYSLER CAPITAL-1', 'VW CREDIT', 'SST'],
            investigatorOptions: ['Aaron Brazil', 'Aaron Steele', 'Adam Cuthbertson', 'Aimee Lamoureux', 'Alexandria Velis', 'Alexis Smith', 'Anthony D\'Lallo', 'Brandice Plunkett', 'Brandon Burkhouse', 'Brian Shultis', 'Bryan Olson', 'Casey Flissinger', 'Charles Ruth', 'Cheryl Stuckey', 'Christy Gallow', 'Courtney Kulik', 'Dak Brown', 'Denise Priano', 'Devin Hughes', 'Erica Farley', 'Erika Holiday', 'House', 'Janette Bailey', 'Jason Anderson', 'Jeremy Lynch', 'Jessica Westphal', 'Jinette Hernandez', 'Johanna Johnson', 'Keshia Fisher', 'Kevin Zwahlen', 'Katie Halling', 'Kristina Karavan', 'Kyle Baugher', 'Madison Post', 'Mary Sydloski', 'Nicole Seevers', 'Nicole Ho', 'Oliver Shipp', 'Patrick Mcdonnell', 'Priscilla Nava', 'Rachel Fader', 'Ricklene Smith', 'Roger Goss', 'Rolf Bell', 'Rose Cuellar', 'Sarah Blankenship', 'Sean Sasville', 'Shauna Harris', 'Shay Harmon', 'Stacy Fisher', 'Steve Estey', 'Tatyana Nesterova', 'Thomas Anderson', 'Timothy Beeman', 'Tony Quadra', 'Tonia Gatto', 'Travis Rudnick', 'Trey Jackson', 'Zac Bastien'],
            states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
        };
    };
    service.$inject = ['$http', '$q', 'envService', '$window'];
    app.factory("dataService", service);
})(angular.module("repoFormsApp"));
//# sourceMappingURL=Services.js.map