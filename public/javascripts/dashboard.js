var app = angular.module('StorkStalker', ['ngMaterial', 'ngMdIcons', 'ngCookies']);

app.controller('AppCtrl', ['$scope', '$mdBottomSheet', '$mdSidenav', '$mdDialog', '$http', '$mdToast', '$cookies', '$window', function($scope, $mdBottomSheet, $mdSidenav, $mdDialog, $http, $mdToast, $cookies, $window) {
    var uid = $cookies.get('uid');
    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };
    $scope.user = {
        first: '',
        last: '',
        email: '',
        password: '',
        uid: uid,
        theme:$scope.theme
    };
    $scope.menu = [
        { link: '',
            title: 'Dashboard',
            icon: 'dashboard' }
    ];
    $scope.admin = [
        {title: 'Settings',
            icon: 'settings'},
        {title: 'Sign Out',
            icon: 'exit_to_app'
        }
    ];
    var socketConnected = false;
    var dataLoaded = false;
    var userLoaded = false;
    $scope.doneLoading = function() {
        return socketConnected && dataLoaded && userLoaded;
    };
    $scope.updatePackages = function() {
        $http({
            url: '/tracking',
            method: 'GET',
            params: {
                'uid': $scope.user.uid
            }
        }).then(function (response) {
            $scope.packages = response.data;
            dataLoaded = true;
            console.log('loaded data');
            $(window).trigger('resize');
        });
    };

    $scope.gotoDashboard = function() {
        window.location.href = "/dashboard";

    };
    $scope.updatePackages();
    $scope.updateUser = function() {
        $http({
            url: '/user_info',
            method: 'GET',
            params: {
                'uid': $scope.user.uid
            }
        }).then(function (response) {
            if (response.data == 'fail') {
                $scope.logOut();
            } else {
                $scope.user.email = response.data.email;
                $scope.user.first = response.data.first;
                $scope.user.last = response.data.last;
                $scope.user.password = response.data.password;
                $scope.user.theme = response.data.theme;
                $scope.theme = response.data.theme;
                userLoaded = true;
                console.log('loaded user');
                $(window).trigger('resize');
            }
        });
    };
    $scope.updateUser();
    $scope.showToast = function(msg) {
        $mdToast.show(
            $mdToast.simple()
                .content(msg)
                .position("bottom left")
                .hideDelay(4000)
        );
    };

    $scope.alert = '';

    $scope.showPackage = function(ev, package) {
        $mdDialog.show({
            targetEvent: ev,
            controller: function () {this.package = package;},
            controllerAs: 'ctrl',
            template: '<md-dialog> <h1> {{ctrl.package.status}} </h1> </md-dialog>'
        });
    };

    $scope.showAdd = function(ev) {
        $mdDialog.show({
                controller: DialogController,
                template:
                '<md-dialog aria-label="Mango (Fruit)">' +
                '<md-content class="md-padding">' +
                '   <form name="addForm">' +
                '       <div layout layout-sm="column">' +
                '           <md-input-container flex>' +
                '               <label>Tracking Number</label>' +
                '               <input ng-model="package.number">' +
                '           </md-input-container>' +
                '       </div>' +
                '       <div layout layout-sm="column">' +
                '           <md-input-container flex>' +
                '               <label>Description</label>' +
                '               <input ng-model="package.description">' +
                '           </md-input-container>' +
                '       </div>' +
                '   </form>' +
                '</md-content>' +
                '<div class="md-actions" layout="row">' +
                '   <span flex>' +
                '   </span>' +
                '   <md-button ng-click="answer()"> Cancel </md-button>' +
                '   <md-button ng-click="answer(package)" class="md-primary">' +
                '       Add ' +
                '   </md-button>' +
                '</div>' +
                '</md-dialog>',
                targetEvent: ev
            })
            .then(function(answer) {
                $http({
                    url: '/tracking',
                    method: 'POST',
                    data: {
                        'tracking_code': answer.number,
                        'uid': $scope.user.uid,
                        'description': answer.description
                    }
                });
            }, function() {
                //user cancelled
            });
    };

    $scope.showSettings = function(ev) {
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '../Templates/settings.html',
                targetEvent: ev
            })
            .then(function(answer) {
                var failed = false;
                if (answer == 'purpleTheme' || answer == 'blueTheme' || answer == 'tealTheme' || answer == 'orangeTheme'
                || answer == 'redTheme' || answer == 'pinkTheme' || answer == 'greyTheme') {
                    $http({
                        url: '/user_info',
                        method: 'POST',
                        data: {
                            'uid': $scope.user.uid,
                            'theme': answer
                        }
                    });
                    $scope.changeThemes(answer);
                } else {
                    if (answer.first == undefined || answer.first == null || answer.first.length <= 0) {
                        answer.first = $scope.user.first;
                    }
                    if (answer.last == undefined || answer.last == null || answer.last.length <= 0) {
                        answer.last = $scope.user.last;
                    }
                    if (answer.email == undefined || answer.email == null || answer.email.length <= 0) {
                        answer.email = $scope.user.email;
                    } else if (!$scope.validateEmail(answer.email)) {
                        $mdToast.show(
                            $mdToast.simple()
                                .content('Please enter a valid email address')
                                .position("top right")
                                .hideDelay(4000)
                        );
                        failed = true;
                    }
                    if (answer.password == undefined || answer.password == null || answer.password.length <= 0) {
                        answer.password = $scope.user.password;
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
                            url: '/user_info',
                            method: 'POST',
                            data: {
                                'first': answer.first,
                                'last': answer.last,
                                'email': answer.email,
                                'password': answer.password,
                                'uid': $scope.user.uid
                            }
                        });
                        $mdToast.show(
                            $mdToast.simple()
                                .content('Information Updated')
                                .position("top right")
                                .hideDelay(4000)
                        );
                    }
                }
            }, function() {
                //user cancelled
            });
    };

    $scope.validateEmail = function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    $scope.logOut = function() {
        $cookies.remove('uid');
        window.location.href = "/";
    };

    $scope.showLogin = function() {
        $mdDialog.show({
                controller: DialogController,
                template: '<md-dialog aria-label="Mango (Fruit)"> <md-content class="md-padding"> <form name="userForm"> <div layout layout-sm="column"> <md-input-container flex> <label>Tracking Number</label> <input ng-model="package.number"> </md-input-container> <md-input-container flex> <label>Carrier</label> <input ng-model="package.carrier"> </md-input-container> </div> <md-input-container flex> <label>Name</label> <input ng-model="package.name"> </md-input-container> <md-input-container flex> <label>Description</label> <textarea ng-model="package.details" columns="1" md-maxlength="150"></textarea> </md-input-container> </form> </md-content> <div class="md-actions" layout="row"> <span flex></span> <md-button ng-click="answer()"> Cancel </md-button> <md-button ng-click="answer(package)" class="md-primary"> Add </md-button> </div></md-dialog>',
            })
            .then(function(answer) {
                console.log(answer);
            }, function() {
                //user cancelled
            });
    };
    $scope.socket = io();
    $scope.socket.emit('uid', $scope.user.uid);

    $scope.socket.on('connect', function() {
        console.log('connected to socket');
        socketConnected = true;
        $(window).trigger('resize');
    });

    $scope.socket.on('update', function() {
        $scope.updatePackages();
        $scope.updateUser();
    });

    $scope.socket.on('msg', function(msg) {
        console.log('msg: ' + msg);
        $scope.showToast(msg);
    });

    $scope.theme = 'blueTheme';
    $scope.changeThemes = function(theme) {
        $scope.theme = theme;
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
app.directive('userAvatar', function() {
    return {
        replace: true,
        template: '<svg class="user-avatar" viewBox="0 0 128 128" height="64" width="64" pointer-events="none" display="block" > <path fill="#FF8A80" d="M0 0h128v128H0z"/> <path fill="#FFE0B2" d="M36.3 94.8c6.4 7.3 16.2 12.1 27.3 12.4 10.7-.3 20.3-4.7 26.7-11.6l.2.1c-17-13.3-12.9-23.4-8.5-28.6 1.3-1.2 2.8-2.5 4.4-3.9l13.1-11c1.5-1.2 2.6-3 2.9-5.1.6-4.4-2.5-8.4-6.9-9.1-1.5-.2-3 0-4.3.6-.3-1.3-.4-2.7-1.6-3.5-1.4-.9-2.8-1.7-4.2-2.5-7.1-3.9-14.9-6.6-23-7.9-5.4-.9-11-1.2-16.1.7-3.3 1.2-6.1 3.2-8.7 5.6-1.3 1.2-2.5 2.4-3.7 3.7l-1.8 1.9c-.3.3-.5.6-.8.8-.1.1-.2 0-.4.2.1.2.1.5.1.6-1-.3-2.1-.4-3.2-.2-4.4.6-7.5 4.7-6.9 9.1.3 2.1 1.3 3.8 2.8 5.1l11 9.3c1.8 1.5 3.3 3.8 4.6 5.7 1.5 2.3 2.8 4.9 3.5 7.6 1.7 6.8-.8 13.4-5.4 18.4-.5.6-1.1 1-1.4 1.7-.2.6-.4 1.3-.6 2-.4 1.5-.5 3.1-.3 4.6.4 3.1 1.8 6.1 4.1 8.2 3.3 3 8 4 12.4 4.5 5.2.6 10.5.7 15.7.2 4.5-.4 9.1-1.2 13-3.4 5.6-3.1 9.6-8.9 10.5-15.2M76.4 46c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6zm-25.7 0c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6z"/> <path fill="#E0F7FA" d="M105.3 106.1c-.9-1.3-1.3-1.9-1.3-1.9l-.2-.3c-.6-.9-1.2-1.7-1.9-2.4-3.2-3.5-7.3-5.4-11.4-5.7 0 0 .1 0 .1.1l-.2-.1c-6.4 6.9-16 11.3-26.7 11.6-11.2-.3-21.1-5.1-27.5-12.6-.1.2-.2.4-.2.5-3.1.9-6 2.7-8.4 5.4l-.2.2s-.5.6-1.5 1.7c-.9 1.1-2.2 2.6-3.7 4.5-3.1 3.9-7.2 9.5-11.7 16.6-.9 1.4-1.7 2.8-2.6 4.3h109.6c-3.4-7.1-6.5-12.8-8.9-16.9-1.5-2.2-2.6-3.8-3.3-5z"/> <circle fill="#444" cx="76.3" cy="47.5" r="2"/> <circle fill="#444" cx="50.7" cy="47.6" r="2"/> <path fill="#444" d="M48.1 27.4c4.5 5.9 15.5 12.1 42.4 8.4-2.2-6.9-6.8-12.6-12.6-16.4C95.1 20.9 92 10 92 10c-1.4 5.5-11.1 4.4-11.1 4.4H62.1c-1.7-.1-3.4 0-5.2.3-12.8 1.8-22.6 11.1-25.7 22.9 10.6-1.9 15.3-7.6 16.9-10.2z"/> </svg>'
    };
});

app.config(function($mdThemingProvider) {
    var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff'
    });
    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.theme('default')
        .primaryPalette('customBlue', {
            'default': '500',
            'hue-1': '50'
        })
        .accentPalette('red');
    $mdThemingProvider.theme('purpleTheme')
        .primaryPalette('purple')
        .accentPalette('yellow');
    $mdThemingProvider.theme('blueTheme', 'default');
    $mdThemingProvider.theme('tealTheme')
        .primaryPalette('teal')
        .accentPalette('yellow');
    $mdThemingProvider.theme('orangeTheme')
        .primaryPalette('orange')
        .accentPalette('blue');
    $mdThemingProvider.theme('redTheme')
        .primaryPalette('red')
        .accentPalette('blue');
    $mdThemingProvider.theme('pinkTheme')
        .primaryPalette('pink')
        .accentPalette('teal');
    $mdThemingProvider.theme('greyTheme')
        .primaryPalette('blue-grey')
        .accentPalette('green');

    $mdThemingProvider.alwaysWatchTheme(true);

});
