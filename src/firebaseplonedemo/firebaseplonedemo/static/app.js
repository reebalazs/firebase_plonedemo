console.log('Lotetu', angular.module('chat', ['firebase']));
angular.module('chat', ['firebase']).
controller('Chat', ['$scope', '$timeout', 'angularFireCollection',
  function($scope, $timeout, angularFireCollection) {
    console.log('START');
    var el = document.getElementById("messagesDiv");
    //var url = 'https://green-test-firebase.firebaseio-demo.com/chat';
    var url = 'https://green-test-firebase.firebaseio.com/chat';
    $scope.messages = angularFireCollection(url, function() {
      console.log('URL', url);
      $timeout(function() { el.scrollTop = el.scrollHeight; });
    });
    $scope.username = 'Anonymous' + Math.floor(Math.random()*101);
    $scope.addMessage = function() {
      $scope.messages.add({from: $scope.username, content: $scope.message}, function() {
        el.scrollTop = el.scrollHeight;
      });
      $scope.message = "";
    };
  }
]);
