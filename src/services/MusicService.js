/*global angular */
(function () {
    'use strict';

    function MusicService($http, $q) {
        var service = {};
        service.search = function (query) {
            var deferred = $q.defer();
            $http.get('//api.spotify.com/v1/search?q=' + encodeURIComponent(query) + '&type=track').success(function (res) {
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
