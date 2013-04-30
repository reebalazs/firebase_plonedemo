
var app = angular.module('chat', ['firebase']);

app.controller('ChatController', ['$scope', '$timeout', 'angularFireCollection',
    function($scope, $timeout, angularFireCollection) {

        var url = $scope.firebase_url;
        var authToken = $scope.auth_token;

        var $root = angular.element('#' + $scope.root_id);

        // Log me in.
        var dataRef = new Firebase(url);

        dataRef.auth(authToken, function(error, result) {
            if(error) {
                throw new Error("Login Failed! \n" + error);
            } else {

                var auth = result.auth;

                $scope.username = auth.ploneUsername;

                var el = $root.find('.chat-messages')[0];

                $scope.messages = angularFireCollection(url + '/messages', function() {
                    $timeout(function () {
                        el.scrollTop = el.scrollHeight;
                    });
                });

                $scope.addMessage = function () {
                    $scope.messages.add({from: $scope.username, content: $scope.message}, function() {
                        el.scrollTop = el.scrollHeight;
                    });
                    $scope.message = "";

                    // prevent double click warning for this form
                    $root.find('input[value="Send"]')
                        .removeClass('submitting');

                };

                $scope.updateUsername = function () {
                    // save this to a cookie
                    document.cookie = $scope.USERNAME_COOKIE +
                        "=" + escape($scope.username) + "; path=/";
                };


            }
        });


    }
]);
