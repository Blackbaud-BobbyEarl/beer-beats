/*global angular */
(function () {
    'use strict';

    function RecommendController($state, $stateParams, BeerService, MusicService, CompareService) {

        var vm = this;
        vm.type = $stateParams.type;
        vm.showcase = {};
        vm.chosenItem = {};

        // Require type && id
        if (!$stateParams.type || !$stateParams.id) {
            $state.go('checkin');
        }

        switch ($stateParams.type) {
            case 'beer':
                BeerService.getBeerById($stateParams.id).then(function (result) {
                    console.log("Beer: ", result);
                    if (result.data && result.data.style && result.data.style.id) {
                        CompareService.getGenresForBeer(result.data.style.id).then(function (result) {
                            vm.results = result;
                            var item = result.tracks.items[0];
                            vm.showcase = {
                                thumbnail: item.album.images[0].url,
                                title: item.name
                            };
                        }, onError);
                    }
                }, onError);
            break;
            case 'song':
                MusicService.getArtistByTrackId($stateParams.id).then(function (result) {
                    if (result.artist.genres && result.artist.genres.length && result.artist.genres.length > 0) {
                        console.log(result.artist);
                        vm.chosenItem = {
                            thumbnail: result.track.album.images[2].url,
                            title: result.track.name,
                            subtitle: result.artist.name
                        };

                        CompareService.getBeersForGenre(result.artist.genres[0]).then(function (result) {
                            console.log("Compare service: ", result);
                            vm.results = result;
                            if (typeof result !== "undefined") {
                                vm.showcase = {
                                    thumbnail: result[0].labels.large,
                                    title: result[0].name,
                                    style: result[0].style.name,
                                    description: result[0].style.description
                                };
                            }
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
