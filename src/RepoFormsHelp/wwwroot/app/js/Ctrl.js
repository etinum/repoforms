(function (app) {
    var controller = function ($scope, $location, $dataService, $window, $envService) {
        if ($envService.is('production')) {
            $scope.isProd = true;
        }
        else {
            $scope.isProd = false;
        }
        $scope.GotoRepoForm = function () {
            $location.path('/repoform');
        };
        $scope.ViewRepos = function () {
            $location.path('/admin');
        };
        $scope.ViewSubmissions = function () {
            $location.path('/submissions');
        };
        $scope.goContacts = function () {
            window.location.href = 'contacts.pdf';
        };
        $scope.ViewUsers = function () {
            $location.path('/viewusers');
        };
        $scope.ViewClients = function () {
            $location.path('/viewclients');
        };
        $scope.Tbd = function () {
            alert("If you build it, they will come");
        };
    };
    controller.$inject = ['$scope', '$location', 'dataService', '$window', 'envService'];
    app.controller('homeCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $dataService, $window, $routeParams, $uibModal, $location, $anchorScroll, $q) {
        var closeTypeOptions = {
            'REPO': 'REPO',
            'PAID': 'PAID',
            'LOCATE': 'LOCATE',
            'BK': 'BK',
            'FORWARD': 'FORWARD'
        };
        $scope.ng_maxLength = 50;
        $scope.maxLength = 50;
        $scope.investigatorOptions = $dataService.investigatorOptions;
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
        $scope.searchVin = function (searchString) {
            var deferred = $q.defer();
            if (searchString.length > 5) {
                $dataService.searchVin(searchString)
                    .then(function (data) {
                    return deferred.resolve(data);
                });
            }
            else {
                deferred.resolve(null);
            }
            return deferred.promise;
        };
        $scope.onClientSelect = function (data) {
            $scope.rf.clientId = data.id;
        };
        $scope.onCloseTypeSelect = function () {
            $scope.rf.closeTypeId = $scope.rf.closeType.id;
        };
        $scope.onVinSelect = function (data) {
            $scope.rf.notes = 'Client Account #: ' + data.accountClientAccountNum + ' (' + data.financeClientName + ')';
            $scope.rf.customerName = data.roName;
            $scope.rf.accountNumber = data.vehVin;
            var option;
            switch (data.accountType) {
                case 'repo':
                    option = $dataService
                        .arrayGetObject($scope.rf.closeTypeOptions, closeTypeOptions.REPO, 'name');
                    if (option != null) {
                        $scope.rf.closeType = { 'id': option.id };
                    }
                    break;
                case 'bankruptcy':
                    option = $dataService
                        .arrayGetObject($scope.rf.closeTypeOptions, closeTypeOptions.BK, 'name');
                    if (option != null) {
                        $scope.rf.closeType = { 'id': option.id };
                    }
                    break;
                case 'paid-current':
                case 'paid-down':
                case 'paid-off':
                    option = $dataService
                        .arrayGetObject($scope.rf.closeTypeOptions, closeTypeOptions.PAID, 'name');
                    if (option != null) {
                        $scope.rf.closeType = { 'id': option.id };
                    }
                    break;
                case 'forward':
                    option = $dataService
                        .arrayGetObject($scope.rf.closeTypeOptions, closeTypeOptions.FORWARD, 'name');
                    if (option != null) {
                        $scope.rf.closeType = { 'id': option.id };
                    }
                    break;
                default:
            }
            if ($scope.rf.closeType != null)
                $scope.rf.closeTypeId = $scope.rf.closeType.id;
        };
        $scope.submitted = false;
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];
        $scope.enumPopupType = {
            CREATED: 1,
            REPO: 2,
            SIGNED: 3
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
        $scope.requestCancel = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modalConfirmCtrl.html',
                controller: 'modalConfirmFormButtonCtrl',
                size: 'sm',
                resolve: {
                    input: function () {
                        return 'cancel';
                    }
                }
            });
            modalInstance.result.then(function () {
                cancelForm();
            }, function () {
            });
        };
        $scope.requestReset = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modalConfirmCtrl.html',
                controller: 'modalConfirmFormButtonCtrl',
                size: 'sm',
                resolve: {
                    input: function () {
                        return 'reset';
                    }
                }
            });
            modalInstance.result.then(function () {
                resetForm();
            }, function () {
            });
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
        function cancelForm() {
            $window.history.back();
        }
        ;
        function resetForm() {
            location.reload();
        }
        ;
        if (!angular.isUndefined($routeParams.id) && !isNaN($routeParams.id)) {
            $scope.load = $dataService.getForm($routeParams.id)
                .then(function (data) {
                $scope.rf = data;
                $scope.rf.client = $dataService.arrayGetObject($scope.rf.clientOptions, $scope.rf.clientId, 'id').name;
                $scope.rf.closeType = {
                    'id': $scope.rf.closeTypeId
                };
                $scope.orf = angular.copy($scope.rf);
            });
        }
        else {
            $scope.load = $dataService.getForm(0)
                .then(function (data) {
                $scope.rf = data;
                $dataService.getLoggedUserData()
                    .then(function (userData) {
                    if (userData.first == null || userData.first === "") {
                        $scope.rf.investigator = userData.winAuthName.toLowerCase().split("\\")[1];
                    }
                    else {
                        $scope.rf.investigator = userData.fullName;
                    }
                });
                $scope.orf = angular.copy($scope.rf);
            });
        }
        $scope.open = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modalSubmittedCtrl.html',
                controller: 'modalSubmittedCtrl',
                size: 'sm',
                resolve: {
                    data: function () {
                        return {
                            'endpoint': 'submissions'
                        };
                    }
                }
            });
            modalInstance.result.then(function () {
            }, function () {
            });
        };
    };
    controller.$inject = ['$scope', 'dataService', '$window', '$routeParams', '$uibModal', '$location', '$anchorScroll', '$q'];
    app.controller('repoCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $dataService, $location, $window, $uibModal) {
        $scope.enumFilterType = {
            ATT: 1,
            AUDIT: 2,
            SCORE: 3,
            ALL: 4
        };
        var hub = $.connection.repoHub;
        $scope.processData = function (data) {
            data.forEach(function (item) {
                item.client = $dataService.arrayGetObject($scope.clientOptions, item.clientId, 'id').name;
                item.closeType = $dataService.arrayGetObject($scope.closeTypeOptions, item.closeTypeId, 'id').name;
            });
            $scope.filter();
        };
        $scope.getForms = function () {
            $scope.load = $dataService.getForms()
                .then(function (data) {
                $scope.allItems = data.list;
                $scope.clientOptions = data.clientOptions;
                $scope.closeTypeOptions = data.closeTypeOptions;
                $scope.processData($scope.allItems);
            });
        };
        $scope.adminVerified = function (row, type) {
            $dataService.getLoggedUserData()
                .then(function (data) {
                switch (type) {
                    case "first":
                        row.adminUserId = data.id;
                        break;
                    case "second":
                        row.adminOtherUserId = data.id;
                        break;
                    default:
                }
                $scope.load = $dataService.saveForm(row)
                    .then(function () {
                    $scope.getForms();
                });
            });
        };
        $scope.update = function () {
            $scope.getForms();
        };
        $scope.requestDelete = function (row) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modalConfirmCtrl.html',
                controller: 'modalConfirmDeleteCtrl',
                size: 'sm',
                resolve: {
                    row: function () {
                        return row;
                    }
                }
            });
            modalInstance.result.then(function (id) {
                $scope.load = $dataService.deleteForm(id)
                    .then(function () {
                    $scope.getForms();
                });
            }, function (id) {
            });
        };
        $scope.edit = function (row) {
            var rowee = row;
            $location.path('/repoform/' + rowee.id);
        };
        $scope.filterOptions = [
            {
                'label': 'All',
                'id': $scope.enumFilterType.ALL
            },
            {
                'label': 'Need Attention',
                'id': $scope.enumFilterType.ATT
            }
        ];
        $scope.filterSelected = $scope.filterOptions.filter(function (item) { return item.id === $scope.enumFilterType.ATT; })[0];
        $scope.filter = function () {
            switch ($scope.filterSelected.id) {
                case $scope.enumFilterType.ALL:
                    $scope.fms = $scope.allItems;
                    break;
                case $scope.enumFilterType.ATT:
                    $scope.fms = $scope.allItems.filter(function (item) {
                        return item.adminUserId == null || item.adminOtherUserId == null;
                    });
                    break;
                default:
            }
        };
        hub.client.UpdateList = function (updatedForm) {
            var index = $dataService.arrayObjectIndexOf($scope.allItems, updatedForm.id, "id");
            if (index === -1) {
                $scope.$evalAsync(function () {
                    $scope.allItems.push(updatedForm);
                    $scope.processData($scope.allItems);
                    $scope.filter();
                });
            }
            else {
                $scope.$evalAsync(function () {
                    $scope.allItems.splice(index, 1, updatedForm);
                    $scope.filter();
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
    controller.$inject = ['$scope', 'dataService', '$location', '$window', '$uibModal'];
    app.controller('viewRepoFormCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $dataService, $location, $window) {
        var hub = $.connection.repoHub;
        $scope.processData = function (data) {
            data.forEach(function (item) {
                item.client = $dataService.arrayGetObject($scope.clientOptions, item.clientId, 'id').name;
                item.closeType = $dataService.arrayGetObject($scope.closeTypeOptions, item.closeTypeId, 'id').name;
            });
            $scope.filter();
        };
        $scope.addAdminVerified = function (data) {
            data.forEach(function (item) {
                item.administered = item.initializedDate !== null && $dataService.isTrue(item.verified);
            });
        };
        $scope.getForms = function () {
            $scope.load = $dataService.getForms()
                .then(function (data) {
                $scope.allItems = data.list;
                $scope.clientOptions = data.clientOptions;
                $scope.closeTypeOptions = data.closeTypeOptions;
                $scope.processData($scope.allItems);
            });
        };
        $scope.scored = function (row) {
            var saveobj = angular.copy(row);
            saveobj.verified = true;
            $scope.load = $dataService.saveForm(saveobj)
                .then(function () {
                $scope.getForms();
            });
        };
        $scope.update = function () {
            $scope.getForms();
        };
        $scope.edit = function (row) {
            var rowee = row;
            $location.path('/repoform/' + rowee.id);
        };
        $scope.filter = function () {
            $scope.fms = $scope.allItems;
        };
        hub.client.UpdateList = function (updatedForm) {
            var index = $dataService.arrayObjectIndexOf($scope.allItems, updatedForm.id, "id");
            if (index === -1) {
                $scope.$evalAsync(function () {
                    $scope.allItems.push(updatedForm);
                    $scope.processData($scope.allItems);
                    $scope.filter();
                });
            }
            else {
                $scope.$evalAsync(function () {
                    $scope.allItems.splice(index, 1, updatedForm);
                    $scope.addAdminVerified($scope.allItems);
                    $scope.filter();
                });
            }
        };
        $.connection.hub.start()
            .done(function () {
            $scope.update();
        });
    };
    controller.$inject = ['$scope', 'dataService', '$location', '$window'];
    app.controller('submissionsCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $window, $dataService, $routeParams, $uibModal) {
        $scope.processOptionIds = function (data) {
            if (data.id === 0) {
                data.winAuthName = "PRANT_1\\";
                return;
            }
            if (data.departmentId > 0) {
                data.departmentOptionSelected = {};
                data.departmentOptionSelected.id = data.departmentId;
            }
            data.directReportUser = data.directReportUserId != null ? data.userOptions.filter(function (item) { return item.id === data.directReportUserId; })[0].label : null;
            data.dottedLineReportUser = data.dottedLineReportUserId != null
                ? data.userOptions.filter(function (item) { return item.id === data.dottedLineReportUserId; })[0].label
                : null;
        };
        $scope.userSelect = function ($item, $type) {
            if ($type === 'direct') {
                $scope.uf.directReportUserId = $item.id;
            }
            else if ($type === 'dotted') {
                $scope.uf.dottedLineReportUserId = $item.id;
            }
        };
        $scope.submitForm = function () {
            if ($scope.uf.winAuthName === "PRANT_1\\") {
                alert("Please update the windows user name");
                return;
            }
            $scope.submitted = true;
            if ($scope.uf.departmentOptionSelected != null) {
                $scope.uf.departmentId = $scope.uf.departmentOptionSelected.id;
            }
            $scope.$broadcast('show-errors-event');
            if ($scope.myForm.$invalid)
                return;
            $scope.load = $dataService.saveUser($scope.uf).then(function () {
                $scope.open();
            });
        };
        $scope.cancelForm = function () {
            $window.history.back();
        };
        $scope.resetForm = function () {
            location.reload();
        };
        $scope.open = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modalSubmittedCtrl.html',
                controller: 'modalSubmittedCtrl',
                size: 'sm',
                resolve: {
                    data: function () {
                        return {
                            'endpoint': 'viewusers'
                        };
                    }
                }
            });
            modalInstance.result.then(function () {
            }, function () {
            });
        };
        if (!angular.isUndefined($routeParams.id) && !isNaN($routeParams.id) && $routeParams.id > -1) {
            $scope.load = $dataService.getUser($routeParams.id)
                .then(function (data) {
                $scope.uf = data;
                $scope.processOptionIds($scope.uf);
                $scope.ouf = angular.copy($scope.uf);
            });
        }
        else {
            alert("Error loading user");
        }
    };
    controller.$inject = ['$scope', '$window', 'dataService', '$routeParams', '$uibModal'];
    app.controller('userCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $window, $dataService, $location) {
        $scope.getUsers = function () {
            $scope.load = $dataService.getAllUsers()
                .then(function (data) {
                $scope.fms = data;
            });
        };
        $scope.update = function () {
            $scope.getUsers();
        };
        $scope.createUser = function () {
            $location.path('/userform/' + 0);
        };
        $scope.edit = function (row) {
            var rowee = row;
            $location.path('/userform/' + rowee.id);
        };
        $scope.update();
    };
    controller.$inject = ['$scope', '$window', 'dataService', '$location'];
    app.controller('viewUsersCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $window, $dataService, $location) {
        var rowEdit = { 'id': 0 };
        $scope.getClients = function () {
            $scope.load = $dataService.getClients()
                .then(function (data) {
                $scope.fms = data;
                updateCounts($scope.fms);
            });
        };
        function updateCounts(data) {
            data.forEach(function (item) {
                if (item.isEditMode == null) {
                    item.isEditMode = false;
                }
            });
        }
        $scope.refresh = function () {
            $scope.getClients();
        };
        $scope.save = function (client) {
            if (!client.name) {
                alert("Name field cannot be empty");
                return;
            }
            $scope.load = $dataService.saveClient(client)
                .then(function (id) {
                client.id = id;
                client.isEditMode = false;
            });
        };
        $scope.cancel = function (data) {
            $dataService.arrayDeleteMatchingObject($scope.fms, 0, 'id');
            data.isEditMode = false;
            data.name = rowEdit.name;
            data.isTieredPoints = rowEdit.isTieredPoints;
            rowEdit.id = 0;
        };
        $scope.edit = function (data) {
            $dataService.arrayDeleteMatchingObject($scope.fms, 0, 'id');
            $scope.fms.forEach(function (item) {
                if (item.isEditMode && item.id === rowEdit.id) {
                    item.isEditMode = false;
                    item.name = rowEdit.name;
                    item.isTieredPoints = rowEdit.isTieredPoints;
                    rowEdit.id = 0;
                }
            });
            data.isEditMode = true;
            rowEdit = angular.copy(data);
        };
        $scope.addField = function () {
            $dataService.gotoPage(1);
            if ($dataService.arrayGetObject($scope.fms, 0, 'id') !== null) {
                return;
            }
            var item = {};
            item.id = 0;
            item.name = "";
            item.isTieredPoints = false;
            item.active = true;
            item.isEditMode = true;
            $scope.fms.splice(0, 0, item);
            updateCounts($scope.fms);
        };
        $scope.refresh();
    };
    controller.$inject = ['$scope', '$window', 'dataService', '$location'];
    app.controller('viewClientsCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $uibModalInstance, $timeout, $window, $location, data) {
        var timer = $timeout(function () {
            $scope.close();
        }, 3000);
        $scope.close = function () {
            $timeout.cancel(timer);
            $uibModalInstance.dismiss();
            $location.path('/' + data.endpoint);
        };
    };
    controller.$inject = ['$scope', '$uibModalInstance', '$timeout', '$window', '$location', 'data'];
    app.controller('modalSubmittedCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $uibModalInstance, $timeout, $window, row) {
        $scope
            .bodyString =
            "Are you sure you want to delete account# " + row.accountNumber + " for investigator: " + row.investigator + "?";
        $scope.buttonString = "Delete";
        $scope.row = row;
        $scope.confirm = function () {
            $uibModalInstance.close(row.id);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss(row.id);
        };
    };
    controller.$inject = ['$scope', '$uibModalInstance', '$timeout', '$window', 'row'];
    app.controller('modalConfirmDeleteCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $uibModalInstance, $timeout, $window, $input) {
        $scope
            .bodyString =
            "Are you sure you want to " + $input + "?";
        $scope.buttonString = "Ok";
        $scope.confirm = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    };
    controller.$inject = ['$scope', '$uibModalInstance', '$timeout', '$window', 'input'];
    app.controller('modalConfirmFormButtonCtrl', controller);
})(angular.module("repoFormsApp"));
//# sourceMappingURL=Ctrl.js.map