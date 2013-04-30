
var app = angular.module('poll', ['firebase']);

app.controller('PollController', ['$scope', 'angularFire',
    function($scope, angularFire) {

        var $root = angular.element('#' + $scope.root_id);
        var el = $root.find('.poll-choices')[0];
        $scope.username = $scope.plone_username;

        // Log me in.
        var dataRef = new Firebase($scope.firebase_url);
        dataRef.auth($scope.auth_token, function(error, result) {
            if (error) {
                throw new Error("Login Failed! \n" + error);
            }
        });

        //
        angularFire($scope.firebase_url + '/choices', $scope, 'choices', [])
            .then(function () {

                $scope.addChoice = function () {
                    $scope.choices.push({
                        label: 'Customize choice text...',
                        count: 0
                    });

                    // prevent double click warning for this form
                    $root.find('input[value="Add"]')
                        .removeClass('submitting');
                };

                $scope.removeChoice = function (choice) {
                    $scope.choices.splice($scope.choices.indexOf(choice), 1);
                };

            }
        );
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
                });
            });

            // model -> view
            ctrl.$render = function () {
                elm.html(ctrl.$viewValue);
            };
        }
    };
});