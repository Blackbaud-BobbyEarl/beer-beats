/*global angular */
(function () {
    'use strict';

    function LoginPageController($location, MusicService) {
        var vm = this;
        vm.connect = function () {
            console.log("Connecting...");
            MusicService.connect().then(function (data) {
                console.log("Successfully connected!", data);
                $location.path('/beer');
            });
        };
    }

    LoginPageController.$inject = [
        '$location',
        'MusicService'
    ];

    angular.module('singingbeer')
        .controller('LoginPageController', LoginPageController);

}());
