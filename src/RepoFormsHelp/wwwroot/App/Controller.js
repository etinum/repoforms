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
    $scope.orf = angular.copy($scope.repoForm); // original repo form

    $scope.submitForm = function () {

        $scope.submitted = true;

        $scope.$broadcast('show-errors-event');
        if ($scope.repoForm.$invalid)
            return;
    };
    $scope.cancelForm = function() {};
    $scope.resetForm = function() {};

}]);

app.controller('viewCtrl', function ($scope) {

});