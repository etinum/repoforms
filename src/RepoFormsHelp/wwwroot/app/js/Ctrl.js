(function (app) {
    var controller = function ($scope, $window, $dataService, $envService, $rootScope) {
        $dataService.getUser()
            .then(function (data) {
            $window.userdata = data;
            $scope.masterWelcome = "Welcome master " + data;
        });
        $scope.baseWebApiUrl = $envService.read('apiUrl');
    };
    controller.$inject = ['$scope', '$window', 'dataService', 'envService', '$rootScope'];
    app.controller('masterCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $location, $dataService, $window) {
        $scope.GotoRepoForm = function () {
            $location.path('/repoform');
        };
        $scope.ViewRepos = function () {
            $location.path('/viewReports');
        };
        $scope.Tbd = function () {
            alert("If you build it, they will come");
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
    controller.$inject = ['$scope', '$location', 'dataService', '$window'];
    app.controller('homeCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $dataService, $window, $routeParams, $uibModal) {
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
            var today = new Date().toString();
            $scope.rf.createdDate = new Date(today);
            $scope.rf.repoDate = new Date(today);
            $scope.rf.initializedDate = null;
        };
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
            $scope.load = $dataService.saveForm($scope.rf).then(function () {
                $scope.open();
            });
        };
        $scope.cancelForm = function () {
            $window.history.back();
        };
        $scope.resetForm = function () {
            location.reload();
        };
        var setRfDate = function (data) {
            $scope.rf.repoDate = data.repoDate ? new Date(data.repoDate.toString()) : null;
            $scope.rf.createdDate = data.createdDate ? new Date(data.createdDate.toString()) : null;
            $scope.rf.initializedDate = data.initializedDate ? new Date(data.initializedDate.toString()) : null;
        };
        if (!angular.isUndefined($routeParams.id) && !isNaN($routeParams.id)) {
            $scope.load = $dataService.getForm($routeParams.id)
                .then(function (data) {
                $scope.rf = data;
                setRfDate(data);
                $scope.orf = angular.copy($scope.rf);
            });
        }
        else {
            $scope.rf = {};
            $scope.orf = angular.copy($scope.rf);
            $scope.rf.repoDate = new Date("06/17/2016");
            $scope.today();
        }
        $scope.open = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modalSubmittedCtrl.html',
                controller: 'modalSubmittedCtrl',
                size: 'sm'
            });
            modalInstance.result.then(function () {
            }, function () {
            });
        };
    };
    controller.$inject = ['$scope', 'dataService', '$window', '$routeParams', '$uibModal'];
    app.controller('repoCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $uibModalInstance, $timeout, $window) {
        var timer = $timeout(function () {
            $scope.close();
        }, 3000);
        $scope.close = function () {
            $timeout.cancel(timer);
            $uibModalInstance.dismiss();
            $window.history.back();
        };
    };
    controller.$inject = ['$scope', '$uibModalInstance', '$timeout', '$window'];
    app.controller('modalSubmittedCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $dataService, $location) {
        var hub = $.connection.repoHub;
        $scope.addAdminVerified = function (data) {
            data.forEach(function (item) {
                item.isInitialized = item.initializedDate == null;
            });
        };
        $scope.update = function () {
            $scope.load = $dataService.getForms()
                .then(function (data) {
                $scope.fms = data;
                $scope.addAdminVerified($scope.fms);
                $scope.totalItems = $scope.fms.length;
            });
        };
        $scope.edit = function (row) {
            var rowee = row;
            $location.path('/repoform/' + rowee.id);
        };
        $scope.itemsPerPage = 6;
        $scope.currentPage = 1;
        $scope.maxSize = 5;
        hub.client.UpdateList = function (updatedForm) {
            var index = $dataService.arrayObjectIndexOf($scope.fms, updatedForm.id, "id");
            if (index === -1) {
                $scope.$apply(function () {
                    $scope.fms.push(updatedForm);
                });
            }
            else {
                $scope.$apply(function () {
                    $scope.fms.splice(index, 1);
                });
                $scope.$apply(function () {
                    $scope.fms.splice(index, 0, updatedForm);
                });
            }
        };
        hub.client.SendAlert = function (value) {
            alert('hello value: ' + value);
        };
        hub.client.test2 = function () {
            ;
            alert("first testing?");
        };
        hub.client.test = function () {
            alert("testing works");
        };
        $.connection.hub.start()
            .done(function () {
            $scope.update();
        });
    };
    controller.$inject = ['$scope', 'dataService', '$location'];
    app.controller('viewCtrl', controller);
})(angular.module("repoFormsApp"));
//# sourceMappingURL=Ctrl.js.map