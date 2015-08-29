/*global angular */
(function () {
    'use strict';

    function LoginPageController($state, UserService) {
        var vm = this;

        vm.go = function () {
            $state.go('check-in');
        };

        vm.login = function () {
            OAuth.popup('facebook').done(function (result) {
                result.me().done(function (data) {
                    UserService.setUser(data);
                    vm.go();
                });
            });
        };

        if (UserService.getUser()) {
            vm.go();
        }
    }

    LoginPageController.$inject = [
        '$state',
        'UserService'
    ];

    angular.module('singingbeer')
        .controller('LoginPageController', LoginPageController);

}());
