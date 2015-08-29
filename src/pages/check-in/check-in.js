/*global angular */
(function () {
    'use strict';

    function CheckInController($scope, $state, $stateParams, BeerService, MusicService) {
        var vm = this;

        vm.searching = false;
        vm.enjoying = $stateParams.type || 'song';
        vm.query = $stateParams.query;
        vm.error = '';
        vm.results = '';
        vm.params = $stateParams;

        vm.search = function () {
            $state.go('check-in', {
                type: vm.enjoying,
                query: vm.query
            });
        };

        vm.recommend = function (id) {
            $state.go('recommend', {
                type: vm.enjoying,
                id: id
            });
        };

        $scope.$watch(
            function enjoyingWatch() {
                return vm.enjoying;
            },
            function enjoyingChange(newValue, oldValue) {
                if (angular.isDefined(newValue) && newValue !== oldValue) {
                    vm.query = '';
                    vm.search();
                }
            }
        );

        function success(results) {
            vm.searching = false;
            vm.error = '';
            vm.results = results;
        }

        function error(err) {
            vm.searching = false;
            vm.results = '';
            vm.error = err;
        }

        function beerSuccess(results) {
            success(results.data);
        }

        function songSuccess(results) {
            success(results.tracks.items);
        }

        function beerError(err) {
            error(err);
        }

        function songError(err) {
            error(err);
        }

        if (vm.enjoying && vm.query) {
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
        }

    }


    CheckInController.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        'BeerService',
        'MusicService'
    ];

    angular.module('singingbeer')
        .controller('CheckInController', CheckInController);

}());
