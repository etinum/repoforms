app.controller('homeCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.GotoRepoForm = function () {
        $location.path('/repoform');
    };

    $scope.ViewRepos = function () {
        alert('If you build it, they will come');
    };
}]);


app.controller('repoCtrl', ['$scope', function ($scope) {

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
    };
    $scope.today();

    $scope.openCreateDatePopup = function () {
        $scope.createdDatePopup.opened = true;
    };

    $scope.createdDatePopup = {
        opened: false
    };

}]);

app.controller('viewCtrl', function ($scope) {

});