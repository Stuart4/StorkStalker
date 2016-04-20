app.factory('socket', function($scope) {
    // register for updates
    var socket = io();
    socket.emit('uid', $scope.user.uid);
});
