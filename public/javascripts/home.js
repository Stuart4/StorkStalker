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
        var failed = false;
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '../Templates/signup.html',
                targetEvent: ev,
                clickOutsideToClose: true
            })
            .then(function (answer) {
                // Validation checks
                if (answer.first == undefined || answer.first == null || answer.first.length <= 0) {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('First name cannot be empty')
                            .position("top right")
                            .hideDelay(4000)
                    );
                    failed = true;
                }
                if (answer.middle == undefined || answer.middle == null || answer.middle.length <= 0) {
                    answer.middle = ' ';
                } else {
                    answer.middle = ' ' + answer.middle + ' ';
                }
                if (answer.last == undefined || answer.last == null || answer.last.length == 0) {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Last name cannot be empty')
                            .position("top right")
                            .hideDelay(4000)
                    );
                    failed = true;
                }
                if (!$scope.validateEmail(answer.email)) {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Please enter a valid email address')
                            .position("top right")
                            .hideDelay(4000)
                    );
                    failed = true;
                }
                if (answer.password == undefined || answer.password == null || answer.password.length <= 0) {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Password cannot be empty')
                            .position("top right")
                            .hideDelay(4000)
                    );
                    failed = true;
                } else if (answer.confirmpassword == undefined || answer.confirmpassword == null || answer.confirmpassword.length <= 0) {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Please confirm password')
                            .position("top right")
                            .hideDelay(4000)
                    );
                    failed = true;
                } else if (answer.password != answer.confirmpassword) {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Passwords must match')
                            .position("top right")
                            .hideDelay(4000)
                    );
                    failed = true;
                }

                if (!failed) {
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
                }
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
    $scope.validateEmail = function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(navigator.platform);
    if(mobile) {
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

