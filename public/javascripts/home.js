/**
 * Created by saxenar96 on 4/21/16.
 */
var app = angular.module('MyApp', ['ngMaterial']);

app.controller('AppCtrl',['$scope', '$mdBottomSheet', '$mdSidenav', '$mdDialog', function($scope, $mdBottomSheet, $mdSidenav, $mdDialog) {
    console.log('here');
    $scope.showLogin = function (ev) {
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '../Templates/login.html',
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function (answer) {
                console.log(answer);
                window.location.href = "/dashboard";
            }, function () {
                //Dialog was cancelled
            });
    };
    $scope.showSignUp = function (ev) {
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '../Templates/signup.html',
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function (answer) {
                console.log(answer);
            }, function () {
                //Dialog was cancelled
            });
    };
    $scope.showAbout = function (ev) {
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '../Templates/about.html',
                targetEvent: ev,
                clickOutsideToClose: true
            });
    };
}]);

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}