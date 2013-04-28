
angular.module('chat', ['firebase']).
controller('Chat', ['$scope', '$timeout', 'angularFireCollection',
    function($scope, $timeout, angularFireCollection) {

        var url = $scope.firebase_url;
        var authToken = $scope.auth_token;

        // Log me in.
        // Each user logs in to /users/<username>/tasks.
        var dataRef = new Firebase(url);

        dataRef.auth(authToken, function(error, result) {
            if(error) {
                throw new Error("Login Failed! \n" + error);
            } else {

                var auth = result.auth;

                ploneUsername = auth.ploneUsername;
                if (ploneUsername == 'Anonymous') {
                    $scope.username = 'Anonymous' + Math.floor(Math.random()*101);
                } else {
                    $scope.username = ploneUsername;
                }

                var el = document.getElementById("chat-messages");
                $scope.messages = angularFireCollection(url + '/messages', function() {
                    $timeout(function () {
                        el.scrollTop = el.scrollHeight;
                    });
                });

                $scope.addMessage = function() {
                    $scope.messages.add({from: $scope.username, content: $scope.message}, function() {
                        el.scrollTop = el.scrollHeight;
                    });
                    $scope.message = "";

                    // prevent double click warning for this form
                    jQuery('.portlet-firebaseplonedemo input[value="Send"]')
                        .removeClass('submitting');

                };


            }
        });


    }
]);

