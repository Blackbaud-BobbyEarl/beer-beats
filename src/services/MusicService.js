/*global angular */
(function () {
    'use strict';

    function MusicService($http, $q, MusicProxy) {

        var service = {};

        service.search = function (query) {
            var deferred = $q.defer();
            
            query = encodeURIComponent(query);
            $http.get(MusicProxy + encodeURIComponent('https://api.spotify.com/v1/search?q=' + query + '&type=track')).success(function (res) {
                deferred.resolve(res);
            });
            return deferred.promise;
        };

        service.getArtistByTrackId = function (trackId) {
            var deferred = $q.defer();
            var data = {};
            $http.get(MusicProxy + encodeURIComponent('https://api.spotify.com/v1/tracks/' + trackId)).success(function (res) {
                data.track = res;
                $http.get(MusicProxy + encodeURIComponent('https://api.spotify.com/v1/artists/' + res.artists[0].id)).success(function (res) {
                    data.artist = res;
                    deferred.resolve(data);
                });
            });
            return deferred.promise;
        };

        service.getTracksByGenre = function (genre) {
            var deferred = $q.defer();
            console.log("Requesting tracks for genre ", genre);
            $http.get('//api.spotify.com/v1/search?q=genre:' + encodeURIComponent(genre) + '&type=track').success(function (res) {
                deferred.resolve(res);
            });
            return deferred.promise;
        };

        return service;

    }

    MusicService.$inject = [
        '$http',
        '$q',
        'MusicProxy'
    ];

    angular.module('singingbeer')
        .factory('MusicService', MusicService)
        .constant('MusicProxy', 'http://developer.blackbaud.com/proxy/?mode=native&url=');

}());
