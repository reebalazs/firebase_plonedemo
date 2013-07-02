
var app = angular.module('presence', ['firebase']);

app.controller('PresenceController', ['$scope', '$timeout', 'angularFireCollection',
    function($scope, $timeout, angularFireCollection, $q) {

        var url = $scope.firebase_url;
        var authToken = $scope.auth_token;
        var $root = angular.element('#' + $scope.root_id);
        $scope.username = $scope.plone_username;

        // Log me in.
        var dataRef = new Firebase(url);
        dataRef.auth(authToken, function(error, result) {
            if (error) {
                throw new Error("Login Failed! \n" + error);
            }
        });

        var onlineRef = new Firebase('https://green-test-firebase.firebaseio.com/users/');
        var connectedRef = new Firebase('https://green-test-firebase.firebaseio.com/.info/connected');

        connectedRef.on('value', function(snap) {
            console.log('CONN', snap.val());
            if (snap.val() === true) {
                // We're connected (or reconnected)!  Set up our presence state and
                // tell the server to set a timestamp when we leave.
                var userRef = onlineRef.child($scope.plone_username);
                var connRef = userRef.child('online').push(1);
                connRef.onDisconnect().remove();
                userRef.child('logout').onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
            }
        });

/*
        $scope.mess = angularFireCollection(url + '/messages', function() {
            $timeout(function () {
                el.scrollTop = el.scrollHeight;
            });
        });
*/

    }

]);