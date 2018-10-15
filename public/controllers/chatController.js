var chatapp = angular.module('chatapp');

var chatController = function ($scope, socket, $rootScope, $window) {
    $scope.showchatbody = false;
    $scope.connected = false;
    $scope.showSignin = true;
    $scope.time = new Date().toLocaleTimeString();
    $scope.userCount = 0;
    $scope.showTyMessage = false;
    $scope.typingUser = "";
    $scope.messages =[];
    $scope.myMessages=[];

    //Variables declaration
    var TYPING_TIMER_LENGTH = 400;
    var typing = false;
    //End

    $scope.number = 15;
    $scope.getNumber = function (num) {
        return new Array(num);
    }

    $scope.onUserIdentityClick = function () {
        socket.emit('add user', $scope.username);
        $scope.showchatbody = true;
        $scope.showSignin = false;
    }

    $scope.ontyping = function () {
        if ($scope.connected) {
            socket.emit('typing');
        }
        if(!typing){
            typing = true;
        }

        lastTypingTime = (new Date()).getTime();

        setTimeout(() => {
            var typingTimer = (new Date()).getTime();
            var timeDiff = typingTimer - lastTypingTime;
            if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
                socket.emit('stop typing');
                typing = false;
            }
        }, TYPING_TIMER_LENGTH);
    }

    $scope.sendMessage = function () {
        if($scope.connected){
            socket.emit('new message', $scope.message);
        }
        $scope.messages.push({"message":$scope.message,"time":$scope.time})
        $scope.message ="";
    }

    //Socket Event Functions


    // Socket events

    // Whenever the server emits 'login', log the login message
    socket.on('login', (data) => {
        $scope.connected = true;
        $scope.userCount = data.numUsers;
    });

    // Whenever the server emits 'new message', update the chat body
    socket.on('new message', (data) => {
        $scope.messages.push(data);
    });

    // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', (data) => {
        //log(data.username + ' joined');
        $scope.userCount = data.numUsers;
    });

    // Whenever the server emits 'user left', log it in the chat body
    socket.on('user left', (data) => {
        //log(data.username + ' left');
        $scope.userCount = data.numUsers;
    });

    // Whenever the server emits 'typing', show the typing message
    socket.on('typing', (data) => {
        $scope.typingUser = data.username;
        $scope.showTyMessage = true;
    });

    // Whenever the server emits 'stop typing', kill the typing message
    socket.on('stop typing', (data) => {
        $scope.showTyMessage = false;
    });

    socket.on('disconnect', () => {
        //log('you have been disconnected');
    });

    socket.on('reconnect', () => {
        //log('you have been reconnected');
        if ($scope.username) {
            socket.emit('add user', username);
        }
    });

    socket.on('reconnect_error', () => {
        //log('attempt to reconnect has failed');
    });
}


chatapp.controller("chatController", chatController);