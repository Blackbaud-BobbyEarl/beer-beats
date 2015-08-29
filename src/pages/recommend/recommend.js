/*global angular */
(function () {
    'use strict';

    function RecommendController($state, $stateParams, BeerService, MusicService, CompareService) {

        var vm = this;
        vm.type = $stateParams.type;

        // Require type && id
        if (!$stateParams.type || !$stateParams.id) {
            $state.go('checkin');
        }

        switch ($stateParams.type) {
            case 'beer':
                BeerService.getBeerById($stateParams.id).then(function (result) {
                    console.log(result);
                    if (result.data && result.data.style && result.data.style.id) {
                        CompareService.getGenresForBeer(result.data.style.id).then(function (result) {
                            vm.results = result;
                        }, onError);
                    }
                }, onError);
            break;
            case 'song':
                MusicService.getArtistByTrackId($stateParams.id).then(function (result) {
                    if (result.genres && result.genres.length && result.genres.length > 0) {
                        CompareService.getBeersForGenre(result.genres[0]).then(function (result) {
                            vm.results = result;
                        }, onError);
                    } else {
                        vm.error = 'No genres available.';
                    }
                }, onError);
            break;
        }
    }

    function onError(err) {
        vm.error = err;
    }

    RecommendController.$inject = [
        '$state',
        '$stateParams',
        'BeerService',
        'MusicService',
        'CompareService'
    ];

    angular.module('singingbeer')
        .controller('RecommendController', RecommendController);
}());
