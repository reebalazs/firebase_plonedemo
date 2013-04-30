
var app = angular.module('poll', ['firebase']);

app.controller('PollController', ['$scope', '$timeout', 'angularFireCollection',
    function($scope, $timeout, angularFireCollection) {

        var url = $scope.firebase_url;
        var authToken = $scope.auth_token;
        var $root = angular.element('#' + $scope.root_id);
        var el = $root.find('.poll-choices')[0];
        $scope.username = $scope.plone_username;

        // Log me in.
        var dataRef = new Firebase(url);
        dataRef.auth(authToken, function(error, result) {
            if (error) {
                throw new Error("Login Failed! \n" + error);
            }
        });

        $scope.choices = angularFireCollection(url + '/choices', function() {
        });

        $scope.addChoice = function () {
            $scope.choices.add({
                label: 'Customize choice text...',
                count: 0
            });

            // prevent double click warning for this form
            $root.find('input[value="Add"]')
                .removeClass('submitting');

        };

    }

]);


app.directive('contenteditable', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            // view -> model
            elm.bind('blur', function () {
                scope.$apply(function () {
                    ctrl.$setViewValue(elm.html());
                    // Need explicit apply. XXX This should be done differently.
                    scope.choices.update(scope.choice);
                });
            });

            // model -> view
            ctrl.$render = function () {
                elm.html(ctrl.$viewValue);
            };
        }
    };
});