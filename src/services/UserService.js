/*global angular */
(function () {
    'use strict';

    function UserService($http, $q) {
        var service = {},
            internalUser;
        service.setUser = function (user) {
            internalUser = user;
        };
        service.getUser = function () {
            return internalUser;
        };
        return service;
    }

    UserService.$inject = [
        '$http',
        '$q'
    ];

    angular.module('singingbeer')
        .factory('UserService', UserService);

}());
