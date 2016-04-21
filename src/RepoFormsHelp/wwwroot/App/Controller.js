app.controller('homeCtrl', function ($scope, $location) {
    $scope.GotoRepoForm = function () {
        $location.path('/repoform');
    };

    $scope.ViewRepos = function () {
        alert('If you build it, they will come');
    };
});


app.controller('repoCtrl', function ($scope) {

});

app.controller('viewCtrl', function ($scope) {

});