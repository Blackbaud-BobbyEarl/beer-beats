/*global angular */
(function () {
    'use strict';

    function CheckInController($state, BeerService, MusicService) {
        var vm = this;

        vm.searching = false;
        vm.searchingNoResults = false;
        vm.enjoying = 'beer';
        vm.error = '';
        vm.query = '';
        vm.results = '';

        vm.search = function () {
            vm.error = '';
            vm.results = '';
            vm.searching = true;
            vm.searchingNoResults = false;
            switch (vm.enjoying) {
                case 'beer':
                    BeerService.searchBeers(vm.query).then(beerSuccess, beerError);
                break;
                case 'song':
                    MusicService.search(vm.query).then(songSuccess, songError);
                break;
            }
        };

        vm.recommend = function (id) {
            $state.go('recommend', {
                type: vm.enjoying,
                id: id
            });
        };

        function success(results) {
            vm.searching = false;
            vm.searchingNoResults = !angular.isArray(results) || results.length === 0;
            vm.error = '';
            vm.results = results;
        }

        function error(err) {
            vm.searching = false;
            vm.searchingNoResults = false;
            vm.results = '';
            vm.error = err;
        }

        function beerSuccess(results) {
            success(results.data);
        }

        function songSuccess(results) {
            success(results);
        }

        function beerError(err) {
            error(err);
        }

        function songError(err) {
            error(err);
        }

    }


    CheckInController.$inject = [
        '$state',
        'BeerService',
        'MusicService'
    ];

    angular.module('singingbeer')
        .controller('CheckInController', CheckInController);

}());
