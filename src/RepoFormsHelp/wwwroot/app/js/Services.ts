(app => {
    var service = ($http, $q) => {

        var getPersons = () => {
            var url = 'http://localhost/webapi/api/values/get';
            var deferred = $q.defer();

            $http.get(url)
                .then(response => {
                    deferred.resolve(response.data);
                }, (response) => {
                    alert("There was a problem with the back end call, here is your status code: " + response.status);
                    deferred.reject(response);
                });
            return deferred.promise;
        };


        var addPerson = (person) => {
            var url = 'http://localhost/webapi/api/values/post';
            var deferred = $q.defer();

            $http.post(url, person)
                .then(() => {
                    alert("Successfully saved.");
                    deferred.resolve();
                }, (response) => {
                    alert("There was a problem with the back end call, here is your status code: " + response.status);
                    deferred.reject(response);
                });
            return deferred.promise;
        };        

        var saveForm = (formdata) => {
            var url = 'http://localhost/webapi/api/RepoForm/SaveForm';
            var deferred = $q.defer();

            $http.post(url, formdata)
                .then(() => {
                    alert("Submission successful.");
                    deferred.resolve();
                }, (response) => {
                    alert("There was a problem with the back end call, here is your status code: " + response.status);
                    deferred.reject(response);
                });
            return deferred.promise;
        }


        return {

            // Repo forms method
            saveForm: saveForm,
            // These guys are only used for testing
            getPersons: getPersons,
            addPerson: addPerson,
            // Dropdown configuration
            favColorOptions: ['Red', 'Blue', 'Orange', 'Black', 'White'],
            favoriteIceCreamOptions: ['fudge', 'chocolate', 'vanila', 'almond fudge', 'rocky road']

        };
    };

    service.$inject = ['$http', '$q'];
    app.factory("dataService", service);

})(app);





//// API services
//app.factory('dataService', ['$http', function ($http){




//    return {


//        // Testing
//        getPersons : getPersons(),


//    };


//    // Implementation
//    var getPersons = () => {
//        return $http.get('http://localhost/webapi/api/values/get')
//            .then(response => {
//                return response.data;
//            },
//            response => {
//                alert("Connection failed: " + response.status);
//            });
//    };



//}]);

