app.controller('homeCtrl', ['$scope', '$location', '$http', 'dataService', function ($scope, $location, $http, $dataService) {
        $scope.GotoRepoForm = function () {
            $location.path('/repoform');
        };
        $scope.ViewRepos = function () {
            alert('Build and they will come');
        };
        $scope.TestClick = function () {
            $dataService.getPersons()
                .then(function (data) {
                var testlist = data;
                $scope.tempPerson = testlist[0];
                alert($scope.tempPerson.age);
            });
        };
        $scope.SendClick = function () {
            $dataService.addPerson($scope.tempPerson);
        };
    }]);
app.controller('repoCtrl', ['$scope', '$http', 'dataService', function ($scope, $http, dataService) {
        $scope.ng_maxLength = 50;
        $scope.maxLength = 50;
        $http.get('http://localhost/webapi/api/RepoForm/TypeAheadData')
            .then(function (response) {
            var data = response.data;
            $scope.typeAheadModel = data;
        }, function (response) {
            alert("Connection failed: " + response.status);
        });
        $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
        $scope.getLocation = function (val) { return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: val + ', USA',
                sensor: false
            }
        }).then(function (response) { return response.data.results.map(function (r) { return r; }); }); };
        $scope.onSelect = function ($item, $type) {
            var item = $item;
            var street = '';
            var stnumber = '';
            var ac = 0;
            if ($type === 'storage') {
                for (ac = 0; ac < item.address_components.length; ac++) {
                    if (item.address_components[ac].types[0] === "street_number") {
                        stnumber = item.address_components[ac].long_name;
                    }
                    if (item.address_components[ac].types[0] === "route") {
                        street = item.address_components[ac].short_name;
                    }
                    if (item.address_components[ac].types[0] === "locality") {
                        $scope.rf.storageCity = item.address_components[ac].long_name;
                    }
                    if (item.address_components[ac].types[0] === "administrative_area_level_1") {
                        $scope.rf.storageState = item.address_components[ac].short_name;
                    }
                    if (item.address_components[ac].types[0] === "postal_code") {
                        $scope.rf.storageZip = item.address_components[ac].long_name;
                    }
                }
                if (stnumber !== null && street !== null) {
                    $scope.rf.storageAddress = (stnumber + ' ' + street).trim();
                }
            }
            else if ($type === 'recovery') {
                for (ac = 0; ac < item.address_components.length; ac++) {
                    if (item.address_components[ac].types[0] === "street_number") {
                        stnumber = item.address_components[ac].long_name;
                    }
                    if (item.address_components[ac].types[0] === "route") {
                        street = item.address_components[ac].short_name;
                    }
                    if (item.address_components[ac].types[0] === "locality") {
                        $scope.rf.recoveryCity = item.address_components[ac].long_name;
                    }
                    if (item.address_components[ac].types[0] === "administrative_area_level_1") {
                        $scope.rf.recoveryState = item.address_components[ac].short_name;
                    }
                    if (item.address_components[ac].types[0] === "postal_code") {
                        $scope.rf.recoveryZip = item.address_components[ac].long_name;
                    }
                }
                if (stnumber !== null && street !== null) {
                    $scope.rf.recoveryAddress = (stnumber + ' ' + street).trim();
                }
            }
        };
        $scope.submitted = false;
        $scope.rf = {};
        $scope.orf = angular.copy($scope.rf);
        $scope.favColorOptions = dataService.favColorOptions;
        $scope.favoriteIceCreamOptions = dataService.favoriteIceCreamOptions;
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];
        $scope.enumPopupType = {
            CREATED: 1,
            REPO: 2,
            SIGNED: 3
        };
        $scope.today = function () {
            $scope.rf.createdDate = new Date();
            $scope.rf.repoDate = new Date();
        };
        $scope.today();
        $scope.openDatePopup = function (popup) {
            switch (popup) {
                case $scope.enumPopupType.CREATED:
                    $scope.datePopupStatus.created = true;
                    break;
                case $scope.enumPopupType.REPO:
                    $scope.datePopupStatus.repo = true;
                    break;
                case $scope.enumPopupType.SIGNED:
                    $scope.datePopupStatus.signed = true;
                    break;
                default:
            }
        };
        $scope.datePopupStatus = {
            created: false,
            repo: false,
            signed: false
        };
        $scope.submitForm = function () {
            $scope.submitted = true;
            $scope.$broadcast('show-errors-event');
            if ($scope.myForm.$invalid)
                return;
            dataService.saveForm($scope.rf).then(function () { return location.reload(); });
        };
        $scope.cancelForm = function () { };
        $scope.resetForm = function () {
            $scope.today();
        };
    }]);
app.controller('viewCtrl', function ($scope) {
});
//# sourceMappingURL=Ctrl.js.map