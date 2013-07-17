
var app = angular.module('presence', ['firebase']);

app.filter('isOnline', function() {
    return function(users) {
        // XXX quite disturbingly and inconsistently, the filter
        // will receive the entire collection.
        var filtered = {};
        if (users !== undefined) {
            $.each(users, function (key, user) {
                if (user.online && user.online != {}) {
                    filtered[key] = user;
                }
            });
        }
        return filtered;
    };
});

app.controller('PresenceController', ['$scope', '$timeout', 'angularFire', '$q',
    function($scope, $timeout, angularFire, $q) {

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

        // Parse the url to find its root
        // A neat trick: we use the DOM to parse our url.
        // After setting parser.href, you can use:
        // 
        // parser.protocol
        // parser.hostname
        // parser.port
        // parser.pathname
        // parser.search
        // parser.hash
        // parser.host
        // 
        var parser = document.createElement('a');
        parser.href = url;
        var rootUrl = parser.protocol + '//' + parser.hostname + '/';

        var onlineRef = new Firebase(url);
        var connectedRef = new Firebase(rootUrl + '.info/connected');

        connectedRef.on('value', function(snap) {
            if (snap.val() === true) {
                // We're connected (or reconnected)!  Set up our presence state and
                // tell the server to set a timestamp when we leave.
                var userRef = onlineRef.child($scope.plone_username);
                var connRef = userRef.child('online').push(1);
                connRef.onDisconnect().remove();
                userRef.child('lastSeen').onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
            }
        });

        // bind the data so we can display it
        var promise = angularFire(onlineRef, $scope, 'users', {});

    }

]);
