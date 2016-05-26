/// <reference path="../typings/persontest.cs.d.ts" />
/// <reference path="../typings/repoformviewmodel.cs.d.ts" />

/* Template for controllers
(app => {
        var controller = () => {

        };
    controller.$inject = [];
    app.controller('nameOfCtrl', controller);
})(angular.module("repoFormsApp"));
*/

(app => {

    var controller = ($scope, $location, $dataService, $window) => {
        $scope.GotoRepoForm = () => {
            $location.path('/repoform');
        };

        $scope.ViewRepos = () => {
            alert('Build and they will come');
        };

        $dataService.getUser()
            .then(data => {
                $window.userdata = data;
                $scope.welcome = "Welcome master " + data;
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
    var controller = ($scope, dataService, $window) => {
        // Input constrain variables.. 
        $scope.ng_maxLength = 50;
        $scope.maxLength = 50;

        //alert("hi there " + $window.userdata);

        dataService.getTypeAheadData()
            .then(data => {
                $scope.typeAheadModel = <modeltypings.RepoFormTypeAheadModel>data;
            });


        $scope.states = dataService.states;

        $scope.getLocation = dataService.getLocation;

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


        $scope.rf = <modeltypings.RepoFormViewModel>{};

        $scope.orf = angular.copy($scope.rf); // original repo form, shouldn't be changed... 


        // Dropdown configuration
        $scope.favColorOptions = dataService.favColorOptions;
        $scope.favoriteIceCreamOptions = dataService.favoriteIceCreamOptions;

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
            $scope.rf.createdDate = new Date();
            $scope.rf.repoDate = new Date();
        };
        $scope.today();

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

            dataService.saveForm($scope.rf).then(() => location.reload());

        };
        $scope.cancelForm = () => { };
        $scope.resetForm = () => {
            $scope.today();

        };
    };


    controller.$inject = ['$scope', 'dataService', '$window'];
    app.controller('repoCtrl', controller);
})(angular.module("repoFormsApp"));

(app => {
    var controller = () => {

    };
    controller.$inject = [];
    app.controller('viewCtrl', controller);
})(angular.module("repoFormsApp"));