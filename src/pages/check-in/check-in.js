/*global angular */
(function () {
    'use strict';

    function CheckInController($state, MusicService, BeerService) {
        var vm = this;
        // vm.query = "";
        // vm.search = function () {
        //     MusicService.search(vm.query).then(function (data) {
        //         console.log("Music retrieved: ", data);
        //         vm.tracks = data.tracks;
        //     });
        // };
        // vm.compare = function (trackId) {
        //     console.log("Track ID: ", trackId);
        //     $location.path('/beer/' + trackId);
        // };

        vm.searching = false;
        vm.enjoying = 'beer';
        vm.error = '';
        vm.query = '';
        vm.results = '';

        vm.search = function () {
            vm.error = '';
            vm.results = '';
            vm.searching = true;
            switch (vm.enjoying) {
                case 'beer':
                    BeerService.search(vm.query).then(success, error);
                break;
                case 'song':
                    MusicService.search(vm.query).then(success, error);
                break;
            }
        };

        vm.recommend = function (id) {
            $state.go('recommend', {
                type: vm.enjoying,
                id: id
            });
        }

        function success(results) {
            vm.searching = false;
            vm.results = results;
            console.log(results);
            vm.error = '';
        }

        function error(err) {
            vm.searching = false;
            vm.results = '';
            vm.error = err;
        }

    }


    CheckInController.$inject = [
        '$state',
        'MusicService'
    ];

    angular.module('singingbeer')
        .controller('CheckInController', CheckInController);

}());
