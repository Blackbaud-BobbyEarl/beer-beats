/*global angular */
(function () {
    'use strict';

    function LoginPageController($location, UserService) {
        var vm = this;
        vm.login = function () {
            OAuth.popup('facebook').done(function (result) {
                result.me().done(function (data) {
                    UserService.setUser(data);
                });
            });
        };
    }

    LoginPageController.$inject = [
        '$location',
        'UserService'
    ];

    angular.module('singingbeer')
        .controller('LoginPageController', LoginPageController);

}());
