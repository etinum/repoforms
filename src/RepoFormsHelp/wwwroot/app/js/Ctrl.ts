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

(app => {
    var controller = ($scope, $window, $dataService, $envService, $rootScope) => {

        $scope.load = $dataService.getUser()
            .then(data => {
                $window.userdata = data;
            });

        //$rootScope.testroot = 'pinky';
        //$scope.baseWebApiUrl = $envService.read('apiUrl');
    };
    controller.$inject = ['$scope', '$window', 'dataService', 'envService', '$rootScope'];
    app.controller('masterCtrl', controller);
})(angular.module("repoFormsApp"));

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

        $scope.Tbd = () => {
            alert("If you build it, they will come");
        };

    // watch to see if global variable has been set from master control before using it in the current controller.
        $scope.$watch(() => $window.userdata, (n) => {
            if (n !== undefined) {
                $scope.welcome = "Welcome " + $window.userdata.toLowerCase().split("\\")[1];

                // Set permissions: 
                $scope.isSuperAdmin = $dataService.isSuperAdmin();
                $scope.isAuditor = $dataService.isAuditor();
                $scope.isManagement = $dataService.isManagement();

            }
        });

        // TODO: Delete after you don't need this anymore. 
        $scope.TestClick = () => {
            $dataService.getPersons()
                .then(data => {
                    var testlist = <modeltypings.IPersonTest[]>data;
                    $scope.tempPerson = testlist[0];
                    alert($scope.tempPerson.age);
                });
        }

        $scope.SendClick = () => {
            $dataService.addPerson($scope.tempPerson);
        }
    };

    controller.$inject = ['$scope', '$location', 'dataService', '$window', 'envService'];
    app.controller('homeCtrl', controller);
})(angular.module("repoFormsApp"));

(app => {
    var controller = ($scope, $dataService, $window, $routeParams, $uibModal, $location, $anchorScroll) => {



        // Input constrain variables..
        $scope.ng_maxLength = 50;
        $scope.maxLength = 50;

        $dataService.getTypeAheadData()
            .then(data => {
                $scope.typeAheadModel = <modeltypings.RepoFormTypeAheadModel>data;
                if (!$scope.typeAheadModel) {
                    $scope.investigatorOptions = $dataService.investigatorOptions;
                } else {
                    $scope.investigatorOptions = $dataService.investigatorOptions.concat($scope.typeAheadModel.investigator);
                }
            });


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

        $scope.submitted = false;

        // Dropdown configuration
        $scope.closeTypeOptions = $dataService.closeTypeOptions;

        // Type ahead configuration
        $scope.clientOptions = $dataService.clientOptions;

        // DATE configurations

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.enumPopupType = {
            CREATED: 1,
            REPO: 2,
            SIGNED: 3
        }

        $scope.today = () => {
            var today = new Date().toString();
            $scope.rf.createdDate = new Date(today);
            $scope.rf.repoDate = new Date(today);
            $scope.rf.initializedDate = null;
        };

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
        $scope.submitForm = () => {

            $scope.submitted = true;

            $scope.$broadcast('show-errors-event');
            if ($scope.myForm.$invalid)
                return;

            $scope.load = $dataService.saveForm($scope.rf).then(() => {
                $scope.open();
            });

        };
        $scope.cancelForm = () => {
            $window.history.back();
        };
        $scope.resetForm = () => {
            location.reload();

        };


        var setRfDate = (data: modeltypings.RepoFormViewModel) => {
            $scope.rf.repoDate = data.repoDate ? new Date(data.repoDate.toString()) : null;
            $scope.rf.createdDate = data.createdDate ? new Date(data.createdDate.toString()) : null;
            $scope.rf.initializedDate = data.initializedDate ? new Date(data.initializedDate.toString()) : null;
        }; 


        if (!angular.isUndefined($routeParams.id) && !isNaN($routeParams.id)) {
            //$scope.id = parseInt($routeParams.id);
            $scope.load = $dataService.getForm($routeParams.id)
                .then(data => {
                    $scope.rf = <modeltypings.RepoFormViewModel>data;
                    setRfDate(data);
                    $scope.orf = angular.copy($scope.rf); // original repo form, shouldn't be changed...
                    $scope.isAdmin = true;
                    //$location.hash('adminPanel');
                    //$anchorScroll();

                });
        } else {
            $scope.rf = <modeltypings.RepoFormViewModel>{};
            $scope.orf = angular.copy($scope.rf); // original repo form, shouldn't be changed...
            $scope.isAdmin = false;
            $scope.today();
        }


        $scope.open = () => {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modalSubmittedCtrl.html',
                controller: 'modalSubmittedCtrl',
                size: 'sm'
                //resolve: {
                //    items() {
                //        return $scope.items;
                //    }
                //}
            });

            modalInstance.result.then(() => {
                // handing when close, you can get the parameter...
            }, () => {
                // handling when cancel, you can get the value... 
            });

        };

    };
    controller.$inject = ['$scope', 'dataService', '$window', '$routeParams', '$uibModal', '$location', '$anchorScroll'];
    app.controller('repoCtrl', controller);
})(angular.module("repoFormsApp"));

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

        // watch to see if global variable has been set from master control before using it in the current controller.
        $scope.$watch(() => $window.userdata, (n) => {
            if (n !== undefined) {
                // Set permissions: 
                $scope.isSuperAdmin = $dataService.isSuperAdmin();
                $scope.isAuditor = $dataService.isAuditor();
                $scope.isManagement = $dataService.isManagement();
            }
        });

        var hub = $.connection.repoHub;


        $scope.processData = () => {

            $scope.addAdminVerified($scope.allItems);
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
                    $scope.allItems = <modeltypings.RepoFormViewModel[]>data;
                    $scope.processData();
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

        //$scope.username = $window.userdata;
        $scope.update = () => {
            $scope.getForms();
        };

        $scope.requestDelete = (row) => {

                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'modalConfirmDeleteCtrl.html',
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
                'label':'All',
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
            //{
            //    'label': 'LPR',
            //    'id': $scope.enumFilterType.LPR
            //}

        ];

        // default value
        $scope.filterSelected = $scope.filterOptions.filter(item => item.id === $scope.enumFilterType.ATT)[0];

        $scope.filter = () => {

            switch ($scope.filterSelected.id) {
                case $scope.enumFilterType.ALL:
                    $scope.fms = $scope.allItems.filter(item => item.closeType !== 'LPR');
                    break;
                case $scope.enumFilterType.ATT:
                    $scope.fms = $scope.allItems.filter(item => !item.administered && item.closeType !== 'LPR');
                    break;
                case $scope.enumFilterType.AUDIT:
                    $scope.fms = $scope.allItems.filter(item => item.initializedDate == null && item.closeType !== 'LPR');
                    break;
                case $scope.enumFilterType.SCORE:
                    $scope.fms = $scope.allItems.filter(item => !item.verified && item.closeType !== 'LPR');
                    break;
                case $scope.enumFilterType.LPR:
                    $scope.fms = $scope.allItems.filter(item => item.closeType === 'LPR');
                    break;
                default:
            }

            $scope.totalItems = $scope.fms.length;

        };

        // Paging variables.
        $scope.itemsPerPage = 12;
        $scope.currentPage = 1;
        $scope.maxSize = 5;


        hub.client.UpdateList = (updatedForm: modeltypings.RepoFormViewModel) => {

            var index = $dataService.arrayObjectIndexOf($scope.allItems, updatedForm.id, "id");

            if (index === -1) {
                $scope.$evalAsync(() => {
                    $scope.allItems.push(updatedForm);
                    $scope.addAdminVerified($scope.allItems);
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

        // Testing signalR
        hub.client.SendAlert = (value) => {
            alert('hello value: ' + value);
        };

        hub.client.test2 = () => {;
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
    app.controller('viewCtrl', controller);
})(angular.module("repoFormsApp"));

(app => {
    var controller = ($scope, $dataService, $location, $window) => {


        var hub = $.connection.repoHub;

        $scope.processData = () => {

            $scope.addAdminVerified($scope.allItems);
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
                    $scope.allItems = <modeltypings.RepoFormViewModel[]>data;
                    $scope.processData();
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

        //$scope.username = $window.userdata;
        $scope.update = () => {
            $scope.getForms();
        };

        $scope.edit = (row) => {
            var rowee = <modeltypings.RepoFormViewModel>row;
            $location.path('/repoform/' + rowee.id);

        };


        $scope.filter = () => {

            $scope.fms = $scope.allItems;
            $scope.totalItems = $scope.fms.length;

        };

        // Paging variables.
        $scope.itemsPerPage = 12;
        $scope.currentPage = 1;
        $scope.maxSize = 5;


        hub.client.UpdateList = (updatedForm: modeltypings.RepoFormViewModel) => {

            var index = $dataService.arrayObjectIndexOf($scope.allItems, updatedForm.id, "id");

            if (index === -1) {
                $scope.$evalAsync(() => {
                    $scope.allItems.push(updatedForm);
                    $scope.addAdminVerified($scope.allItems);
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

    controller.$inject = ['$scope', 'dataService', '$location', '$window'];
    app.controller('submissionsCtrl', controller);
})(angular.module("repoFormsApp"));

//All our wonderful modals will stay at the bottom here... 
(app => {
    var controller = ($scope, $uibModalInstance, $timeout, $window) => {

        var timer = $timeout(() => {
            $scope.close();
        },
            3000);


        $scope.close = () => {
            $timeout.cancel(timer);
            $uibModalInstance.dismiss();
            $window.history.back();
        };

    };
    controller.$inject = ['$scope', '$uibModalInstance', '$timeout', '$window'];
    app.controller('modalSubmittedCtrl', controller);
})(angular.module("repoFormsApp"));

(app => {
    var controller = ($scope, $uibModalInstance, $timeout, $window, row) => {


        $scope.row = row;

        $scope.delete = () => {
            $uibModalInstance.close(row.id);
        };


        $scope.cancel = () => {
            $uibModalInstance.dismiss(row.id);
        };

    };
    controller.$inject = ['$scope', '$uibModalInstance', '$timeout', '$window', 'row'];
    app.controller('modalConfirmDeleteCtrl', controller);
})(angular.module("repoFormsApp"));
