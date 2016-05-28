(function (app) {
    var controller = function ($scope, $window, $dataService) {
        $dataService.getUser()
            .then(function (data) {
            $window.userdata = data;
            $scope.masterWelcome = "Welcome master " + data;
        });
    };
    controller.$inject = ['$scope', '$window', 'dataService'];
    app.controller('masterCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $location, $dataService, $window, $timeout) {
        $scope.GotoRepoForm = function () {
            $location.path('/repoform');
        };
        $scope.ViewRepos = function () {
            $location.path('/viewReports');
        };
        $scope.$watch(function () { return $window.userdata; }, function (n) {
            if (n !== undefined) {
                $scope.welcome = "Pick something sir, " + $window.userdata;
            }
        });
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
    };
    controller.$inject = ['$scope', '$location', 'dataService', '$window', '$timeout'];
    app.controller('homeCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $dataService, $window) {
        $scope.ng_maxLength = 50;
        $scope.maxLength = 50;
        $dataService.getTypeAheadData()
            .then(function (data) {
            $scope.typeAheadModel = data;
        });
        $scope.states = $dataService.states;
        $scope.getLocation = $dataService.getLocation;
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
        $scope.favColorOptions = $dataService.favColorOptions;
        $scope.favoriteIceCreamOptions = $dataService.favoriteIceCreamOptions;
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
            $dataService.saveForm($scope.rf).then(function () { return location.reload(); });
        };
        $scope.cancelForm = function () { };
        $scope.resetForm = function () {
            $scope.today();
        };
    };
    controller.$inject = ['$scope', 'dataService', '$window'];
    app.controller('repoCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $window) {
        $scope.username = $window.userdata;
    };
    controller.$inject = ['$scope', '$window'];
    app.controller('viewCtrl', controller);
})(angular.module("repoFormsApp"));
//# sourceMappingURL=Ctrl.js.map