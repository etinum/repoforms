(function (app) {
    var controller = function ($scope, $window, $dataService, $envService, $rootScope) {
        $scope.load = $dataService.getLoggedUser()
            .then(function (data) {
            $window.userdata = data;
            var winAuthName = $window.userdata.winAuthName;
            var roles = $window.userdata.roles;
            $rootScope.welcome = "Welcome " + winAuthName.toLowerCase().split("\\")[1];
            var isSuper = $rootScope.isSuperAdmin = roles.indexOf('SuperAdmin') > -1;
            $rootScope.isSystemAdmin = roles.indexOf('SystemAdmin') > -1 || isSuper;
            $rootScope.isManagement = roles.indexOf('Management') > -1 || isSuper;
            $rootScope.isAuditor = roles.indexOf('Auditor') > -1 || isSuper;
            $rootScope.isSkipTracer = roles.indexOf('SkipTracer') > -1 || isSuper;
        });
    };
    controller.$inject = ['$scope', '$window', 'dataService', 'envService', '$rootScope'];
    app.controller('masterCtrl', controller);
})(angular.module("repoFormsApp"));
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
        $scope.Tbd = function () {
            alert("If you build it, they will come");
        };
    };
    controller.$inject = ['$scope', '$location', 'dataService', '$window', 'envService'];
    app.controller('homeCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $dataService, $window, $routeParams, $uibModal, $location, $anchorScroll, $q) {
        $scope.ng_maxLength = 50;
        $scope.maxLength = 50;
        $dataService.getTypeAheadData()
            .then(function (data) {
            $scope.typeAheadModel = data;
            if (!$scope.typeAheadModel) {
                $scope.investigatorOptions = $dataService.investigatorOptions;
            }
            else {
                $scope.investigatorOptions = $dataService.investigatorOptions.concat($scope.typeAheadModel.investigator);
            }
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
        $scope.onVinSelect = function (data) {
            $scope.rf.notes = data.accountClientAccountNum;
        };
        $scope.submitted = false;
        $scope.closeTypeOptions = $dataService.closeTypeOptions;
        $scope.clientOptions = $dataService.clientOptions;
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
                $scope.isAdmin = true;
            });
        }
        else {
            $scope.rf = {};
            $scope.orf = angular.copy($scope.rf);
            $scope.isAdmin = false;
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
        $scope.processData = function () {
            $scope.addAdminVerified($scope.allItems);
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
                $scope.allItems = data;
                $scope.processData();
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
        $scope.requestDelete = function (row) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modalConfirmDeleteCtrl.html',
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
            },
            {
                'label': 'Audit',
                'id': $scope.enumFilterType.AUDIT
            },
            {
                'label': 'Score',
                'id': $scope.enumFilterType.SCORE
            }
        ];
        $scope.filterSelected = $scope.filterOptions.filter(function (item) { return item.id === $scope.enumFilterType.ATT; })[0];
        $scope.filter = function () {
            switch ($scope.filterSelected.id) {
                case $scope.enumFilterType.ALL:
                    $scope.fms = $scope.allItems.filter(function (item) { return item.closeType !== 'LPR'; });
                    break;
                case $scope.enumFilterType.ATT:
                    $scope.fms = $scope.allItems.filter(function (item) { return !item.administered && item.closeType !== 'LPR'; });
                    break;
                case $scope.enumFilterType.AUDIT:
                    $scope.fms = $scope.allItems.filter(function (item) { return item.initializedDate == null && item.closeType !== 'LPR'; });
                    break;
                case $scope.enumFilterType.SCORE:
                    $scope.fms = $scope.allItems.filter(function (item) { return !item.verified && item.closeType !== 'LPR'; });
                    break;
                case $scope.enumFilterType.LPR:
                    $scope.fms = $scope.allItems.filter(function (item) { return item.closeType === 'LPR'; });
                    break;
                default:
            }
            $scope.totalItems = $scope.fms.length;
        };
        $scope.itemsPerPage = 12;
        $scope.currentPage = 1;
        $scope.maxSize = 5;
        hub.client.UpdateList = function (updatedForm) {
            var index = $dataService.arrayObjectIndexOf($scope.allItems, updatedForm.id, "id");
            if (index === -1) {
                $scope.$evalAsync(function () {
                    $scope.allItems.push(updatedForm);
                    $scope.addAdminVerified($scope.allItems);
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
        $scope.processData = function () {
            $scope.addAdminVerified($scope.allItems);
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
                $scope.allItems = data;
                $scope.processData();
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
            $scope.totalItems = $scope.fms.length;
        };
        $scope.itemsPerPage = 12;
        $scope.currentPage = 1;
        $scope.maxSize = 5;
        hub.client.UpdateList = function (updatedForm) {
            var index = $dataService.arrayObjectIndexOf($scope.allItems, updatedForm.id, "id");
            if (index === -1) {
                $scope.$evalAsync(function () {
                    $scope.allItems.push(updatedForm);
                    $scope.addAdminVerified($scope.allItems);
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
    controller.$inject = ['$scope', 'dataService', '$location', '$window'];
    app.controller('submissionsCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $uibModalInstance, $timeout, $window, $location) {
        var timer = $timeout(function () {
            $scope.close();
        }, 3000);
        $scope.close = function () {
            $timeout.cancel(timer);
            $uibModalInstance.dismiss();
            $location.path('/submissions');
        };
    };
    controller.$inject = ['$scope', '$uibModalInstance', '$timeout', '$window', '$location'];
    app.controller('modalSubmittedCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $uibModalInstance, $timeout, $window, row) {
        $scope.row = row;
        $scope.delete = function () {
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
    var controller = function ($scope, $window, $dataService, $routeParams) {
        $scope.processOptionIds = function (data) {
            data.department = data.departmentOptions.filter(function (item) { return item.id === data.departmentId; })[0];
            data.directReportUser = data.directReportUserId != null ? data.userOptions.filter(function (item) { return item.id === data.directReportUserId; })[0].label : data.directReportUserId;
            data.dottedLineReportUser = data.dottedLineReportUserId != null
                ? data.userOptions.filter(function (item) { return item.id === data.dottedLineReportUserId; })[0].label
                : data.dottedLineReportUserId;
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
            $scope.submitted = true;
            if ($scope.uf.department != null) {
                $scope.uf.departmentId = $scope.uf.department.id;
            }
            $scope.$broadcast('show-errors-event');
            if ($scope.myForm.$invalid)
                return;
            $scope.load = $dataService.saveUser($scope.uf).then(function () {
            });
        };
        $scope.cancelForm = function () {
            $window.history.back();
        };
        $scope.resetForm = function () {
            location.reload();
        };
        if (!angular.isUndefined($routeParams.id) && !isNaN($routeParams.id) && $routeParams.id > -1) {
            if ($routeParams.id === 0) {
            }
            else {
                $scope.load = $dataService.getUser($routeParams.id)
                    .then(function (data) {
                    $scope.uf = data;
                    $scope.ouf = angular.copy($scope.uf);
                    $scope.processOptionIds($scope.uf);
                });
            }
        }
        else {
            alert("Error loading user");
        }
    };
    controller.$inject = ['$scope', '$window', 'dataService', '$routeParams'];
    app.controller('userCtrl', controller);
})(angular.module("repoFormsApp"));
(function (app) {
    var controller = function ($scope, $window, $dataService, $location) {
        $scope.getUsers = function () {
            $scope.load = $dataService.getAllUsers()
                .then(function (data) {
                $scope.fms = data;
                $scope.totalItems = $scope.fms.length;
            });
        };
        $scope.update = function () {
            $scope.getUsers();
        };
        $scope.edit = function (row) {
            var rowee = row;
            $location.path('/userform/' + rowee.id);
        };
        $scope.itemsPerPage = 12;
        $scope.currentPage = 1;
        $scope.maxSize = 5;
        $scope.update();
    };
    controller.$inject = ['$scope', '$window', 'dataService', '$location'];
    app.controller('viewUsersCtrl', controller);
})(angular.module("repoFormsApp"));
//# sourceMappingURL=Ctrl.js.map