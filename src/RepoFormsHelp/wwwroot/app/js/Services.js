(function (app) {
    var service = function ($http, $q) {
        var getPersons = function () {
            var url = 'http://localhost/webapi/api/values/get';
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
            var url = 'http://localhost/webapi/api/values/post';
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
            var url = 'http://localhost/webapi/api/RepoForm/SaveForm';
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
        return {
            saveForm: saveForm,
            getPersons: getPersons,
            addPerson: addPerson,
            favColorOptions: ['Red', 'Blue', 'Orange', 'Black', 'White'],
            favoriteIceCreamOptions: ['fudge', 'chocolate', 'vanila', 'almond fudge', 'rocky road']
        };
    };
    service.$inject = ['$http', '$q'];
    app.factory("dataService", service);
})(app);
//# sourceMappingURL=Services.js.map