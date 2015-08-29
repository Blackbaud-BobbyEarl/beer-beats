/*global angular */
(function () {
    'use strict';

    function UserService(localStorageService) {
        var service = {};
        service.setUser = function (user) {
            localStorageService.set('user', user);
        };
        service.getUser = function () {
            return localStorageService.get('user')
        };
        return service;
    }

    UserService.$inject = [
        'localStorageService'
    ];

    angular.module('singingbeer')
        .factory('UserService', UserService);

}());
