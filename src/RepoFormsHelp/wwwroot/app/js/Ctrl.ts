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

        $dataService.getUser()
            .then(data => {
                $window.userdata = data;
                $scope.masterWelcome = "Welcome master " + data;
            });

        //$rootScope.testroot = 'pinky';
        $scope.baseWebApiUrl = $envService.read('apiUrl');
    };
    controller.$inject = ['$scope', '$window', 'dataService', 'envService', '$rootScope'];
    app.controller('masterCtrl', controller);
})(angular.module("repoFormsApp"));

(app => {

    var controller = ($scope, $location, $dataService, $window) => {


        $scope.GotoRepoForm = () => {
            $location.path('/repoform');
        };

        $scope.ViewRepos = () => {
            $location.path('/viewReports');
        };


        // watch to see if global variable has been set from master control before using it in the current controller.
        $scope.$watch(() => $window.userdata, (n) => {
            if (n !== undefined) {
                $scope.welcome = "Pick something sir, " + $window.userdata;
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

    controller.$inject = ['$scope', '$location', 'dataService', '$window'];
    app.controller('homeCtrl', controller);
})(angular.module("repoFormsApp"));

(app => {
    var controller = ($scope, $dataService, $window, $routeParams, $uibModal) => {



        // Input constrain variables..
        $scope.ng_maxLength = 50;
        $scope.maxLength = 50;

        $dataService.getTypeAheadData()
            .then(data => {
                $scope.typeAheadModel = <modeltypings.RepoFormTypeAheadModel>data;
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
        $scope.favColorOptions = $dataService.favColorOptions;
        $scope.favoriteIceCreamOptions = $dataService.favoriteIceCreamOptions;

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
                });
        } else {
            $scope.rf = <modeltypings.RepoFormViewModel>{};
            $scope.orf = angular.copy($scope.rf); // original repo form, shouldn't be changed...
            $scope.rf.repoDate = new Date("06/17/2016");
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


    controller.$inject = ['$scope', 'dataService', '$window', '$routeParams', '$uibModal'];
    app.controller('repoCtrl', controller);
})(angular.module("repoFormsApp"));


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
    var controller = ($scope, $dataService, $location) => {


        //$scope.delay = 0;
        //$scope.minDuration = 0;
        //$scope.message = 'Please Wait...';
        //$scope.backdrop = true;

        var hub = $.connection.repoHub;

        $scope.addAdminVerified = data => {
            data.forEach(item => {
                item.dummy = item.initializedDate == null;
            });
        };

        //$scope.username = $window.userdata;
        $scope.update = () => {
            $scope.load = $dataService.getForms()
                .then(data => {
                    $scope.fms = <modeltypings.RepoFormViewModel[]>data;
                    $scope.addAdminVerified($scope.fms);
                    $scope.totalItems = $scope.fms.length;
                });
        };

        $scope.edit = (row) => {
            var rowee = <modeltypings.RepoFormViewModel>row;
            $location.path('/repoform/' + rowee.id);

        };

        // Paging variables.
        $scope.itemsPerPage = 6;
        $scope.currentPage = 1;
        $scope.maxSize = 5;


        hub.client.UpdateList = (updatedForm: modeltypings.RepoFormViewModel) => {

            var index = $dataService.arrayObjectIndexOf($scope.fms, updatedForm.id, "id");

            if (index === -1) {
                $scope.$apply(() => {
                    $scope.fms.push(updatedForm);
                });
            } else {
                $scope.$apply(() => {
                    $scope.fms.splice(index, 1);
                });
                $scope.$apply(() => {
                    $scope.fms.splice(index, 0, updatedForm);
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

    controller.$inject = ['$scope', 'dataService', '$location'];
    app.controller('viewCtrl', controller);
})(angular.module("repoFormsApp"));