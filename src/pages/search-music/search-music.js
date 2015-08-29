/*global angular */
(function () {
    'use strict';

    function SearchMusicController($location, MusicService) {
        var vm = this;
        vm.query = "";
        vm.search = function () {
            MusicService.search(vm.query).then(function (data) {
                console.log("Music retrieved: ", data);
                vm.tracks = data.tracks;
            });
        };
        vm.choose = function (trackId) {
            console.log("Track ID: ", trackId);
            $location.path('/beermatch');
        };
    }

    SearchMusicController.$inject = [
        '$location',
        'MusicService'
    ];

    angular.module('singingbeer')
        .controller('SearchMusicController', SearchMusicController);

}());
