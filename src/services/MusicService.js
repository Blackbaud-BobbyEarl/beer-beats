/*global angular */
(function () {
    'use strict';

    function MusicService($http, $q) {
        var service = {};
        service.connect = function () {
            var deferred = $q.defer();
            $http.get('api/music.json').success(function (res) {
                deferred.resolve(res);
            });
            return deferred.promise;
        };
        return service;
    }

    MusicService.$inject = [
        '$http',
        '$q'
    ];

    angular.module('singingbeer')
        .factory('MusicService', MusicService);

}());
