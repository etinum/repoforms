/// <reference path="../typings/persontest.cs.d.ts" />
/// <reference path="../typings/angular-environment.d.ts" />
/// <reference path="../typings/signalr.d.ts" />
/// <reference path="../typings/repoformviewmodels.cs.d.ts" />

/* Template for controllers
(app => {
        var controller = ($scope, $window, $dataService) => {

        };
    controller.$inject = ['$scope', '$window', 'dataService'];
    app.controller('nameOfCtrl', controller);
})(angular.module("repoFormsApp"));
*/

/* app.controller('homeCtrl', controller); */
(app => {

    var controller = ($scope, $location, $dataService, $window, $envService) => {

        // configure hiddden fields in production
        if ($envService.is('production')) {
            $scope.isProd = true;
        } else {
            $scope.isProd = false;
        }

        $scope.GotoRepoForm = () => {
            $location.path('/repoform');
        };

        $scope.ViewRepos = () => {
            $location.path('/admin');
        };

        $scope.ViewSubmissions = () => {
            $location.path('/submissions');
        };

        $scope.goContacts = () => {
            window.location.href = 'contacts.pdf';
        };

        $scope.ViewUsers = () => {
            $location.path('/viewusers');
        }

        $scope.ViewClients = () => {
            $location.path('/viewclients');
        }

        $scope.Tbd = () => {
            alert("If you build it, they will come");
        };

    };

    controller.$inject = ['$scope', '$location', 'dataService', '$window', 'envService'];
    app.controller('homeCtrl', controller);
})(angular.module("repoFormsApp"));

/* app.controller('repoCtrl', controller); */
(app => {
    var controller = ($scope, $dataService, $window, $routeParams, $uibModal, $location, $anchorScroll, $q) => {


        var closeTypeOptions = {
            'REPO': 'REPO',
            'PAID': 'PAID',
            'LOCATE': 'LOCATE',
            'BK': 'BK',
            'FORWARD': 'FORWARD'   
        }


        // Input constrain variables..
        $scope.ng_maxLength = 50;
        $scope.maxLength = 50;

        $scope.investigatorOptions = $dataService.investigatorOptions;

        $scope.states = $dataService.states;
        $scope.getLocation = $dataService.getLocation;
        $scope.onSelect = ($item, $type) => {

            // This is to cover the different address fields
            var item = $item;

            var street = '';
            var stnumber = '';
            var ac = 0;

            if ($type === 'storage') {
                for (ac = 0; ac < item.address_components.length; ac++) {
                    if (item.address_components[ac].types[0] === "street_number") { stnumber = item.address_components[ac].long_name }
                    if (item.address_components[ac].types[0] === "route") { street = item.address_components[ac].short_name }
                    if (item.address_components[ac].types[0] === "locality") { $scope.rf.storageCity = item.address_components[ac].long_name }
                    if (item.address_components[ac].types[0] === "administrative_area_level_1") { $scope.rf.storageState = item.address_components[ac].short_name }
                    if (item.address_components[ac].types[0] === "postal_code") { $scope.rf.storageZip = item.address_components[ac].long_name }
                }
                if (stnumber !== null && street !== null) {
                    $scope.rf.storageAddress = (stnumber + ' ' + street).trim();
                }
            } else if ($type === 'recovery') {
                for (ac = 0; ac < item.address_components.length; ac++) {
                    if (item.address_components[ac].types[0] === "street_number") { stnumber = item.address_components[ac].long_name }
                    if (item.address_components[ac].types[0] === "route") { street = item.address_components[ac].short_name }
                    if (item.address_components[ac].types[0] === "locality") { $scope.rf.recoveryCity = item.address_components[ac].long_name }
                    if (item.address_components[ac].types[0] === "administrative_area_level_1") { $scope.rf.recoveryState = item.address_components[ac].short_name }
                    if (item.address_components[ac].types[0] === "postal_code") { $scope.rf.recoveryZip = item.address_components[ac].long_name }
                }
                if (stnumber !== null && street !== null) {
                    $scope.rf.recoveryAddress = (stnumber + ' ' + street).trim();
                }
            }
        };

        $scope.searchVin = (searchString: string): modeltypings.AccountVinClientViewModel[] => {

            var deferred = $q.defer();

            if (searchString.length > 5) {
                $dataService.searchVin(searchString)
                    .then(data => {
                        return deferred.resolve(data);
                    });
            } else {
                deferred.resolve(null);
            }

            return deferred.promise;
        };

        $scope.onClientSelect = (data: modeltypings.ClientViewModel) => {

            $scope.rf.clientId = data.id;

        }

        $scope.onCloseTypeSelect = () => {
            $scope.rf.closeTypeId = $scope.rf.closeType.id;
        }

        $scope.onVinSelect = (data: modeltypings.AccountVinClientViewModel) => {
            $scope.rf.notes = 'Client Account #: ' + data.accountClientAccountNum + ' (' + data.financeClientName + ')';
            $scope.rf.customerName = data.roName;
            $scope.rf.accountNumber = data.vehVin;

            var option;
            switch (data.accountType) {
                case 'repo':
                    option = <modeltypings.CloseTypeViewModel>$dataService
                        .arrayGetObject($scope.rf.closeTypeOptions, closeTypeOptions.REPO, 'name');
                    if (option != null) {
                        $scope.rf.closeType = { 'id': option.id };
                    }
                    break;
                case 'bankruptcy':
                    option = <modeltypings.CloseTypeViewModel>$dataService
                        .arrayGetObject($scope.rf.closeTypeOptions, closeTypeOptions.BK, 'name');
                    if (option != null) {
                        $scope.rf.closeType = { 'id': option.id };
                    }
                    break;
                case 'paid-current':
                case 'paid-down':
                case 'paid-off':
                    option = <modeltypings.CloseTypeViewModel>$dataService
                        .arrayGetObject($scope.rf.closeTypeOptions, closeTypeOptions.PAID, 'name');
                    if (option != null) {
                        $scope.rf.closeType = { 'id': option.id };
                    }
                    break;
                case 'forward':
                    option = <modeltypings.CloseTypeViewModel>$dataService
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


        // DATE configurations

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.enumPopupType = {
            CREATED: 1,
            REPO: 2,
            SIGNED: 3
        }

        $scope.openDatePopup = popup => {
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

        // Form button handling
        $scope.requestCancel = () => {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modalConfirmCtrl.html',
                controller: 'modalConfirmFormButtonCtrl',
                size: 'sm',
                resolve: {
                    input() {
                        return 'cancel';
                    }
                }
            });

            modalInstance.result.then(() => {
                cancelForm();
            }, () => {
                // handling when cancel, you can get the value... 
            });

        };

        $scope.requestReset = () => {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modalConfirmCtrl.html',
                controller: 'modalConfirmFormButtonCtrl',
                size: 'sm',
                resolve: {
                    input() {
                        return 'reset';
                    }
                }
            });

            modalInstance.result.then(() => {
                resetForm();
            }, () => {
                // handling when cancel, you can get the value... 
            });

        };


        $scope.submitForm = () => {

            $scope.submitted = true;

            $scope.$broadcast('show-errors-event');
            if ($scope.myForm.$invalid)
                return;

            $scope.load = $dataService.saveForm($scope.rf).then(() => {
                $scope.open();
            });

        };

        function cancelForm () {
            $window.history.back();
        };

        function resetForm()  {
            location.reload();

        };


        //$scope.userData = $dataService.userData;

        //$scope.$watch('userData',
        //    (newval: modeltypings.UserViewModel, oldval: modeltypings.UserViewModel) => {
        //        if (newval == null) return;
        //    alert('hi: ' + newval.winAuthName);
        //});



        if (!angular.isUndefined($routeParams.id) && !isNaN($routeParams.id)) {
            //$scope.id = parseInt($routeParams.id);
            $scope.load = $dataService.getForm($routeParams.id)
                .then(data => {
                    $scope.rf = <modeltypings.RepoFormViewModel>data;

                    // Update the customer and close type based onthe ID. 
                    $scope.rf.client = $dataService.arrayGetObject($scope.rf.clientOptions, $scope.rf.clientId, 'id').name;
                    $scope.rf.closeType = {
                        'id': $scope.rf.closeTypeId
                    }

                    $scope.orf = angular.copy($scope.rf); // original repo form, shouldn't be changed...
                });
        } else {

            $scope.load = $dataService.getForm(0)
                .then(data => {
                    $scope.rf = <modeltypings.RepoFormViewModel>data;



                    $dataService.getLoggedUserData()
                        .then((userData : modeltypings.UserViewModel) => {

                            if (userData.first == null || userData.first === "") {
                                $scope.rf.investigator = userData.winAuthName.toLowerCase().split("\\")[1];
                            } else {
                                $scope.rf.investigator = userData.fullName;
                            }
                        });

                    $scope.orf = angular.copy($scope.rf); // original repo form, shouldn't be changed...
                });
        }


        $scope.open = () => {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modalSubmittedCtrl.html',
                controller: 'modalSubmittedCtrl',
                size: 'sm',
                resolve: {
                    data: () => {
                        return {
                            'endpoint': 'submissions'
                        };
                    }
                }
            });

            modalInstance.result.then(() => {
                // handing when close, you can get the parameter...
            }, () => {
                // handling when cancel, you can get the value... 
            });

        };

    };
    controller.$inject = ['$scope', 'dataService', '$window', '$routeParams', '$uibModal', '$location', '$anchorScroll', '$q'];
    app.controller('repoCtrl', controller);
})(angular.module("repoFormsApp"));

/* app.controller('viewRepoFormCtrl', controller); */
(app => {
    var controller = ($scope, $dataService, $location, $window, $uibModal) => {


        //$scope.delay = 0;
        //$scope.minDuration = 0;
        //$scope.message = 'Please Wait...';
        //$scope.backdrop = true;

        $scope.enumFilterType = {
            ATT: 1,
            AUDIT: 2,
            SCORE: 3,
            ALL: 4
            //LPR: 5
        }

        var hub = $.connection.repoHub;


        $scope.processData = (data : modeltypings.RepoFormViewModel[]) => {


            data.forEach(item => {

                // Update the customer and close type based onthe ID. 
                item.client = $dataService.arrayGetObject($scope.clientOptions, item.clientId, 'id').name;
                item.closeType = $dataService.arrayGetObject($scope.closeTypeOptions, item.closeTypeId, 'id').name;

            });

            //$scope.addAdminVerified(data);
            $scope.filter();

        }


        $scope.getForms = () => {
            $scope.load = $dataService.getForms()
                .then((data : modeltypings.RepoFormViewModel[]) => {
                    $scope.allItems = <modeltypings.RepoFormViewModel[]>data.list;
                    $scope.clientOptions = data.clientOptions;
                    $scope.closeTypeOptions = data.closeTypeOptions;
                    $scope.processData($scope.allItems);
                });
        };

        $scope.adminVerified = (row: modeltypings.RepoFormViewModel, type: string) => {

            $dataService.getLoggedUserData()
                .then((data: modeltypings.UserViewModel) => {

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
                        .then(() => {
                            $scope.getForms();
                        });
                });


        };


        $scope.update = () => {
            $scope.getForms();
        };

        $scope.requestDelete = (row) => {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modalConfirmCtrl.html',
                controller: 'modalConfirmDeleteCtrl',
                size: 'sm',
                resolve: {
                    row() {
                        return row;
                    }
                }
            });

            modalInstance.result.then((id) => {
                $scope.load = $dataService.deleteForm(id)
                    .then(() => {
                        $scope.getForms();
                    });
            }, (id) => {
                // handling when cancel, you can get the value... 
                // alert('row is cancelled: ' + id);
            });

        };


        $scope.edit = (row) => {
            var rowee = <modeltypings.RepoFormViewModel>row;
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

        // default value
        $scope.filterSelected = $scope.filterOptions.filter(item => item.id === $scope.enumFilterType.ATT)[0];

        $scope.filter = () => {

            switch ($scope.filterSelected.id) {
                case $scope.enumFilterType.ALL:
                    $scope.fms = $scope.allItems;
                    break;
                case $scope.enumFilterType.ATT:
                    $scope.fms = $scope.allItems.filter(item => {
                        return item.adminUserId == null || item.adminOtherUserId == null;
                    });
                    break;
                default:
            }

        };


        hub.client.UpdateList = (updatedForm: modeltypings.RepoFormViewModel) => {

            var index = $dataService.arrayObjectIndexOf($scope.allItems, updatedForm.id, "id");

            if (index === -1) {
                $scope.$evalAsync(() => {
                    $scope.allItems.push(updatedForm);
                    $scope.processData($scope.allItems);
                    $scope.filter();
                });
            } else {
                $scope.$evalAsync(() => {
                    //$scope.allItems.splice(index, 1);
                    $scope.allItems.splice(index, 1, updatedForm);
                    $scope.filter();
                });
            }
        };

        // Testing signalR
        hub.client.SendAlert = (value) => {
            alert('hello value: ' + value);
        };

        hub.client.test2 = () => {
            ;
            alert("first testing?");
        };

        hub.client.test = () => {
            alert("testing works");
        };


        $.connection.hub.start()
            .done(() => {
                $scope.update();
            });
    };

    controller.$inject = ['$scope', 'dataService', '$location', '$window', '$uibModal'];
    app.controller('viewRepoFormCtrl', controller);
})(angular.module("repoFormsApp"));

/* app.controller('submissionsCtrl', controller); */
(app => {
    var controller = ($scope, $dataService, $location, $window) => {


        var hub = $.connection.repoHub;

        $scope.processData = (data: modeltypings.RepoFormViewModel[]) => {


            data.forEach(item => {

                // Update the customer and close type based onthe ID. 
                item.client = $dataService.arrayGetObject($scope.clientOptions, item.clientId, 'id').name;
                item.closeType = $dataService.arrayGetObject($scope.closeTypeOptions, item.closeTypeId, 'id').name;

            });

            //$scope.addAdminVerified(data);
            $scope.filter();

        }

        $scope.addAdminVerified = (data) => {
            data.forEach(item => {
                item.administered = item.initializedDate !== null && $dataService.isTrue(item.verified);
            });
        };

        $scope.getForms = () => {
            $scope.load = $dataService.getForms()
                .then(data => {
                    $scope.allItems = <modeltypings.RepoFormViewModel[]>data.list;
                    $scope.clientOptions = data.clientOptions;
                    $scope.closeTypeOptions = data.closeTypeOptions;
                    $scope.processData($scope.allItems);
                });
        };


        $scope.scored = (row) => {
            var saveobj = angular.copy(row);
            saveobj.verified = true;
            $scope.load = $dataService.saveForm(saveobj)
                .then(() => {
                    $scope.getForms();
                });
        };


        $scope.update = () => {
            $scope.getForms();
        };

        $scope.edit = (row) => {
            var rowee = <modeltypings.RepoFormViewModel>row;
            $location.path('/repoform/' + rowee.id);

        };


        $scope.filter = () => {
            $scope.fms = $scope.allItems;
        };


        hub.client.UpdateList = (updatedForm: modeltypings.RepoFormViewModel) => {

            var index = $dataService.arrayObjectIndexOf($scope.allItems, updatedForm.id, "id");

            if (index === -1) {
                $scope.$evalAsync(() => {
                    $scope.allItems.push(updatedForm);
                    $scope.processData($scope.allItems);
                    $scope.filter();
                });
            } else {
                $scope.$evalAsync(() => {
                    //$scope.allItems.splice(index, 1);
                    $scope.allItems.splice(index, 1, updatedForm);
                    $scope.addAdminVerified($scope.allItems);
                    $scope.filter();
                });

            }

        };


        $.connection.hub.start()
            .done(() => {
                $scope.update();
            });
    };

    controller.$inject = ['$scope', 'dataService', '$location', '$window'];
    app.controller('submissionsCtrl', controller);
})(angular.module("repoFormsApp"));

/* app.controller('userCtrl', controller); */
(app => {
    var controller = ($scope, $window, $dataService, $routeParams, $uibModal) => {


        //TODO: In this controller we will need to populate the user foreign key elements as needed... 

        // Private Methods
        $scope.processOptionIds = (data : modeltypings.UserViewModel) => {

            if (data.id === 0) {
                data.winAuthName = "PRANT_1\\";
                return;
            }

            if (data.departmentId > 0) {
                data.departmentOptionSelected = <modeltypings.DepartmentOption>{};
                data.departmentOptionSelected.id = data.departmentId;
            }
                
                //data.departmentOptions.filter(item => item.id === data.departmentId)[0].name;

            data.directReportUser = data.directReportUserId != null ? data.userOptions.filter(item => item.id === data.directReportUserId)[0].label : null;
            data.dottedLineReportUser = data.dottedLineReportUserId != null
                ? data.userOptions.filter(item => item.id === data.dottedLineReportUserId)[0].label
                : null;
        };


        // Handlers
        $scope.userSelect = ($item, $type) => {
            if ($type === 'direct') {
                $scope.uf.directReportUserId = $item.id;
            } else if ($type === 'dotted') {
                $scope.uf.dottedLineReportUserId = $item.id;
            }
        };


        $scope.submitForm = () => {

            if ($scope.uf.winAuthName === "PRANT_1\\") {
                alert("Please update the windows user name");
                return; 
            }

            $scope.submitted = true;

            // process
            if ($scope.uf.departmentOptionSelected != null) {
                $scope.uf.departmentId = $scope.uf.departmentOptionSelected.id;
            }


            $scope.$broadcast('show-errors-event');
            if ($scope.myForm.$invalid)
                return;


            $scope.load = $dataService.saveUser($scope.uf).then(() => {
                $scope.open();
            });

        };
        $scope.cancelForm = () => {
            $window.history.back();
        };
        $scope.resetForm = () => {
            location.reload();
        };


        $scope.open = () => {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modalSubmittedCtrl.html',
                controller: 'modalSubmittedCtrl',
                size: 'sm',
                resolve: {
                    data: () => {
                        return {
                            'endpoint': 'viewusers'
                        };
                    }
                }
            });

            modalInstance.result.then(() => {
                // handing when close, you can get the parameter...
            }, () => {
                // handling when cancel, you can get the value... 
            });

        };


        if (!angular.isUndefined($routeParams.id) && !isNaN($routeParams.id) && $routeParams.id > -1) {
            //$scope.id = parseInt($routeParams.id);

            $scope.load = $dataService.getUser($routeParams.id)
                .then(data => {
                    $scope.uf = <modeltypings.UserViewModel>data;
                    $scope.processOptionIds($scope.uf);

                    $scope.ouf = angular.copy($scope.uf);
                });

        } else {
            alert("Error loading user");
        }


    };
    controller.$inject = ['$scope', '$window', 'dataService', '$routeParams', '$uibModal'];
    app.controller('userCtrl', controller);
})(angular.module("repoFormsApp"));

/* app.controller('viewUsersCtrl', controller); */
(app => {
    var controller = ($scope, $window, $dataService, $location) => {

        $scope.getUsers = () => {
            $scope.load = $dataService.getAllUsers()
                .then((data : modeltypings.UserViewModel[]) => {
                    $scope.fms = data;

                });
        };

        $scope.update = () => {
            $scope.getUsers();
        };

        $scope.createUser = () => {
            $location.path('/userform/' + 0);

        }

        $scope.edit = (row) => {
            var rowee = <modeltypings.UserViewModel>row;
            $location.path('/userform/' + rowee.id);

        };



        $scope.update();

    };
    controller.$inject = ['$scope', '$window', 'dataService', '$location'];
    app.controller('viewUsersCtrl', controller);
})(angular.module("repoFormsApp"));

/* app.controller('viewClientsCtrl', controller); */
(app => {
    var controller = ($scope, $window, $dataService, $location) => {


        var rowEdit = <modeltypings.ClientViewModel>{ 'id':0};

        $scope.getClients = () => {
            $scope.load = $dataService.getClients()
                .then((data : modeltypings.ClientViewModel[]) => {
                    $scope.fms = data;
                    updateCounts($scope.fms);
                });
        };

        // Helper method
        function updateCounts(data: modeltypings.ClientViewModel[]) {
            data.forEach(item => {
                if (item.isEditMode == null) {
                    item.isEditMode = false;
                }
            });
        }

        $scope.refresh = () => {
            $scope.getClients();
        };


        $scope.save = (client: modeltypings.ClientViewModel) => {

            if (!client.name) {
                alert("Name field cannot be empty");
                return;
            }

            $scope.load = $dataService.saveClient(client)
                .then((id: number) => {
                    client.id = id;
                    client.isEditMode = false;
                });
        };

        $scope.cancel = (data: modeltypings.ClientViewModel) => {


            $dataService.arrayDeleteMatchingObject($scope.fms, 0, 'id');

            data.isEditMode = false;
            data.name = rowEdit.name;
            data.isTieredPoints = rowEdit.isTieredPoints;
            rowEdit.id = 0;
        };

        $scope.edit = (data: modeltypings.ClientViewModel) => {

            $dataService.arrayDeleteMatchingObject($scope.fms, 0, 'id');

            $scope.fms.forEach(item => {

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


        $scope.addField = () => {

            $dataService.gotoPage(1);

            if ($dataService.arrayGetObject($scope.fms, 0, 'id') !== null) {
                return;
            }

            var item = <modeltypings.ClientViewModel>{};
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

//All our wonderful modals will stay at the bottom here... 
/* app.controller('modalSubmittedCtrl', controller); */
(app => {
    var controller = ($scope, $uibModalInstance, $timeout, $window, $location, data) => {


        var timer = $timeout(() => {
            $scope.close();
        },
            3000);


        $scope.close = () => {
            $timeout.cancel(timer);
            $uibModalInstance.dismiss();
            $location.path('/' + data.endpoint);
        };

    };
    controller.$inject = ['$scope', '$uibModalInstance', '$timeout', '$window', '$location', 'data'];
    app.controller('modalSubmittedCtrl', controller);
})(angular.module("repoFormsApp"));

/* app.controller('modalConfirmDeleteCtrl', controller); */
(app => {
    var controller = ($scope, $uibModalInstance, $timeout, $window, row) => {

        $scope
            .bodyString =
            "Are you sure you want to delete account# " + row.accountNumber + " for investigator: " + row.investigator + "?";

        $scope.buttonString = "Delete";

        $scope.row = row;

        $scope.confirm = () => {
            $uibModalInstance.close(row.id);
        };


        $scope.cancel = () => {
            $uibModalInstance.dismiss(row.id);
        };

    };
    controller.$inject = ['$scope', '$uibModalInstance', '$timeout', '$window', 'row'];
    app.controller('modalConfirmDeleteCtrl', controller);
})(angular.module("repoFormsApp"));

/* app.controller('modalConfirmFormButtonCtrl', controller); */
(app => {
    var controller = ($scope, $uibModalInstance, $timeout, $window, $input) => {


        $scope
            .bodyString =
            "Are you sure you want to " + $input +"?";
 
        $scope.buttonString = "Ok";


        $scope.confirm = () => {
            $uibModalInstance.close();
        };


        $scope.cancel = () => {
            $uibModalInstance.dismiss();
        };

    };
    controller.$inject = ['$scope', '$uibModalInstance', '$timeout', '$window', 'input'];
    app.controller('modalConfirmFormButtonCtrl', controller);
})(angular.module("repoFormsApp"));
