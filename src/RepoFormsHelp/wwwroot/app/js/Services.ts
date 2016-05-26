(app => {

    var service = ($http, $q) => {

        // Testing service calls, can be removed later. 
        var getPersons = () => {
            var url = baseWebApiUrl + 'api/values/get';
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
            var url = baseWebApiUrl + 'api/values/post';
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


        // Repo Form services
        var saveForm = (formdata) => {
            var url = baseWebApiUrl + 'api/RepoForm/SaveForm';
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


        // Google api 
        var getLocation = (val) => {
            var url = baseWebApiUrl + 'api/RepoForm/SaveForm';
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
                    alert("There was a problem with the back end call, here is your status code: " + response.status);
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
                    alert("There was a problem with the back end call, here is your status code: " + response.status);
                    deferred.reject(response);
                });
            return deferred.promise;
        };


        // Misc
        var getUser = () => {
            var url = baseWebApiUrl + 'api/RepoForm/GetUser';
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



        return {
            getUser: getUser,
            getTypeAheadData: getTypeAheadData,
            saveForm: saveForm,
            getPersons: getPersons,
            addPerson: addPerson,
            getLocation: getLocation,
            // Static list 
            favColorOptions: ['Red', 'Blue', 'Orange', 'Black', 'White'],
            favoriteIceCreamOptions: ['fudge', 'chocolate', 'vanila', 'almond fudge', 'rocky road'],
            states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']

        };
    };

    service.$inject = ['$http', '$q'];
    app.factory("dataService", service);

})(angular.module("repoFormsApp"));

