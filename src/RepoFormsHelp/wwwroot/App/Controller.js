app.controller('homeCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.GotoRepoForm = function () {
        $location.path('/repoform');
    };

    $scope.ViewRepos = function () {
        alert('If you build it, they will come');
    };
}]);


app.controller('repoCtrl', ['$scope', '$http', function ($scope, $http) {


    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

    $scope.getLocation = function (val) {
        return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: val,
                sensor: false
            }
        }).then(function (response) {
            return response.data.results.map(function (item) {
                return item;
            });
        });
    };

    $scope.onSelect = function ($item) {
        var item = $item;

        var street = '';
        var stnumber = '';
        for (var ac = 0; ac < item.address_components.length; ac++) {
            if (item.address_components[ac].types[0] === "street_number") { stnumber = item.address_components[ac].long_name }
            if (item.address_components[ac].types[0] === "route") { street = item.address_components[ac].short_name }
            if (item.address_components[ac].types[0] === "locality") { $scope.rf.storageCity = item.address_components[ac].long_name }
            if (item.address_components[ac].types[0] === "administrative_area_level_1") { $scope.rf.storageState = item.address_components[ac].short_name }
            if (item.address_components[ac].types[0] === "postal_code") { $scope.rf.storageZip = item.address_components[ac].long_name }
        }

        if (stnumber !== null && street !== null) {
            $scope.rf.storageAddress = (stnumber + ' ' + street).trim();
            
        }

    };

    $scope.submitted = false;

    $scope.rf = { id: 0 }; // repo form
    $scope.orf = angular.copy($scope.repoForm); // original repo form, shouldn't be changed... 

    $scope.submitForm = function () {

        $scope.submitted = true;

        $scope.$broadcast('show-errors-event');
        if ($scope.repoForm.$invalid)
            return;
    };
    $scope.cancelForm = function() {};
    $scope.resetForm = function () { };




    // DATE configurations

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.today = function () {
        $scope.rf.createdDate = new Date();
        $scope.rf.repoDate = new Date();
    };
    $scope.today();

    $scope.openCreateDatePopup = function () {
        $scope.createdDatePopup.opened = true;
    };

    $scope.createdDatePopup = {
        opened: false
    };

    $scope.openRepoDatePopup = function () {
        $scope.repoDatePopup.opened = true;
    };

    $scope.repoDatePopup = {
        opened: false
    };


}]);

app.controller('viewCtrl', function ($scope) {

});