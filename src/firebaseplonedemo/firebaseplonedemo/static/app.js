
angular.module('chat', ['firebase']).
controller('Chat', ['$scope', '$timeout', 'angularFireCollection',
    function($scope, $timeout, angularFireCollection) {
        var el = document.getElementById("messagesDiv");
        //var url = 'https://green-test-firebase.firebaseio-demo.com/chat';
        var url = 'https://green-test-firebase.firebaseio.com/chat';
        $scope.messages = angularFireCollection(url, function() {
            $timeout(function() { el.scrollTop = el.scrollHeight; });
        });

        var ploneUsername = jQuery('meta[name="firebaseplonedemo-username"]').attr('content');


        if (ploneUsername == 'Anonymous User') {
            $scope.username = 'Anonymous' + Math.floor(Math.random()*101);
        } else {
            $scope.username = ploneUsername;
        }
        $scope.addMessage = function() {
            $scope.messages.add({from: $scope.username, content: $scope.message}, function() {
                el.scrollTop = el.scrollHeight;
            });
            $scope.message = "";
            
            // prevent double click warning for this form
            jQuery('input[value="Send"]').removeClass('submitting');

        };
    }
]);
