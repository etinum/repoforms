(function (app) {
    var service = function ($http, $q) {
        var getPersons = function () {
            var url = baseWebApiUrl + 'api/values/get';
            var deferred = $q.defer();
            $http.get(url)
                .then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                alert("There was a problem with the back end call, here is your status code: " + response.status);
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
                alert("There was a problem with the back end call, here is your status code: " + response.status);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        var saveForm = function (formdata) {
            var url = baseWebApiUrl + 'api/RepoForm/SaveForm';
            var deferred = $q.defer();
            $http.post(url, formdata)
                .then(function () {
                alert("Submission successful.");
                deferred.resolve();
            }, function (response) {
                alert("There was a problem with the back end call, here is your status code: " + response.status);
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
                alert("There was a problem with the back end call, here is your status code: " + response.status);
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
                alert("There was a problem with the back end call, here is your status code: " + response.status);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        return {
            getTypeAheadData: getTypeAheadData,
            saveForm: saveForm,
            getPersons: getPersons,
            addPerson: addPerson,
            getLocation: getLocation,
            favColorOptions: ['Red', 'Blue', 'Orange', 'Black', 'White'],
            favoriteIceCreamOptions: ['fudge', 'chocolate', 'vanila', 'almond fudge', 'rocky road'],
            states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
        };
    };
    service.$inject = ['$http', '$q'];
    app.factory("dataService", service);
})(angular.module("repoFormsApp"));
//# sourceMappingURL=Services.js.map