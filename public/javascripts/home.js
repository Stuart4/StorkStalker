/**
 * Created by saxenar96 on 4/21/16.
 */
var app = angular.module('MyApp', ['ngMaterial', 'ngCookies']);

app.controller('AppCtrl',['$scope', '$mdBottomSheet', '$mdSidenav', '$mdDialog', '$http', '$cookies', '$mdToast', function($scope, $mdBottomSheet, $mdSidenav, $mdDialog, $http, $cookies, $mdToast) {
    if ($cookies.get('uid')) {
        window.location.href = "/dashboard";
    }
    $scope.showLogin = function (ev) {
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '../Templates/login.html',
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function (answer) {
                console.log(answer);
                $http({
                    url: '/users',
                    method: 'GET',
                    params: answer
                }).then(function (response) {
                    if (response.data == 'fail') {
                        $mdToast.show(
                            $mdToast.simple()
                                .content('Log in failed, try again.')
                                .position("top right")
                                .hideDelay(4000)
                        );
                    } else {
                        $cookies.put('uid', response.data);
                        window.location.href = "/dashboard";
                    }
                });
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
                $http({
                    url: '/users',
                    method: 'POST',
                    data: answer
                }).then(function (response) {
                    if (response.data == 'fail') {
                        $mdToast.show(
                            $mdToast.simple()
                                .content('Sign up failed, try again.')
                                .position("top right")
                                .hideDelay(4000)
                        );
                    } else {
                        $cookies.put('uid', response.data);
                        window.location.href = "/dashboard";
                    }
                });
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
    var iOS = /iPad|iPhone|iPod/.test(navigator.platform);
    if( iOS ) {
        $('.fade-in-video').remove();
    }
    $('#card')
        .one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
        function(e) {
            var video = $('video');
            video.get(0).play();
            video.addClass('is-playing');
        });
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

