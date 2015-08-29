/*global angular */
(function () {
    'use strict';

    function SearchMusicController($location, MusicService) {
        var vm = this;
        vm.search = function () {
            console.log("Connecting...");
            var query = "bob marley";
            MusicService.search(query).then(function (data) {
                console.log("Successfully connected!", data);
                //$location.path('/beer');
            });
        };
    }

    SearchMusicController.$inject = [
        '$location',
        'MusicService'
    ];

    angular.module('singingbeer')
        .controller('SearchMusicController', SearchMusicController);

}());
