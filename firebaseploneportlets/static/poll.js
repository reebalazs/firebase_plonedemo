
var app = angular.module('poll', ['firebase']);

app.controller('PollController', ['$scope', 'angularFire',
    function($scope, angularFire) {

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

                var $root = angular.element('#' + $scope.root_id);
                var el = $root.find('.poll-choices')[0];
                $scope.username = $scope.plone_username;
                $scope.editMode = false;

                $scope.setEditMode = function(mode) {
                    $scope.editMode = mode;
                };

                $scope.addChoice = function () {
                    $scope.choices.push({
                        label: '',
                        count: 0
                    });

                    // prevent double click warning for this form
                    $root.find('input[value="Add"]')
                        .removeClass('submitting');
                };

                $scope.removeChoice = function (choice) {
                    $scope.choices.splice($scope.choices.indexOf(choice), 1);
                };

                $scope.hasLabel = function (item){
                    return item.label;
                };

            }
        );
    }

]);

app.directive('contenteditable', function () {
    var placeholder_pre =  '<span class="contenteditable-placeholder">';
    var placeholder_txt = 'Enter text here...';
    var placeholder_post = '</span>';
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            // entering edit mode
            elm.bind('click', function () {
                if (elm.data('isPlaceholder')) {
                    elm.html('');
                }
            });

            // model -> view
            ctrl.$render = function () {
                var input = ctrl.$viewValue;
                var placeholder = false;
                if (!input) {
                    input = placeholder_pre +
                        (elm.attr('placeholder') || placeholder_txt) +
                        placeholder_post;
                    placeholder = true;
                }
                elm.html(input);
                elm.data('isPlaceholder', placeholder);
            };

            // view -> model
            elm.bind('blur', function () {
                scope.$apply(function () {
                    ctrl.$setViewValue(elm.text());
                    // put back the placeholder if necessary
                    ctrl.$render();
                });
            });

        }
    };
});
