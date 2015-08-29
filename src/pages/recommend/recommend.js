/*global angular, console */
(function () {
    'use strict';

    function RecommendController($state, $stateParams, BeerService, MusicService, CompareService, UserService) {

        var vm = this,
            beer,
            beat;
        vm.type = $stateParams.type;
        vm.showcase = {};
        vm.chosenItem = {};

        // Require type && id
        if (!$stateParams.type || !$stateParams.id) {
            $state.go('check-in');
        }

        switch ($stateParams.type) {
            case 'beer':
                BeerService.getBeerById($stateParams.id).then(function (result) {
                    console.log("Beer: ", result);
                    if (result.data && result.data.style && result.data.style.id) {
                        CompareService.getGenresForBeer(result.data.style.id).then(function (result) {
                            vm.results = result;
                        }, onError);
                    }
                }, onError);
            break;
            case 'song':
                MusicService.getArtistByTrackId($stateParams.id).then(function (result) {
                    if (result.artist.genres && result.artist.genres.length && result.artist.genres.length > 0) {
                        console.log(result.artist);
                        vm.chosenItem = beat = {
                            id: $stateParams.id,
                            thumbnail: result.track.album.images[2].url,
                            title: result.track.name,
                            subtitle: result.artist.name
                        };

                        beat.thumbnail = result.track.album.images[1].url;
                        
                        CompareService.getBeersForGenre(result.artist.genres[0]).then(function (result) {
                            console.log("Compare service: ", result);
                            vm.results = result;
                            if (typeof result !== "undefined") {
                                vm.showcase = beer = {
                                    id: result[0].id,
                                    thumbnail: result[0].labels.large,
                                    title: result[0].name,
                                    style: result[0].style,
                                    description: result[0].style.description
                                };
                                beer.thumbnail = result[0].labels.medium;
                            }
                        }, onError);
                    } else {
                        vm.error = 'No genres available.';
                    }
                }, onError);
            break;
        }
        
        vm.createTransaction = function () {
            UserService.insertTransaction(beat, beer).then(function () {
                $state.go('check-in');
            });
        };
        
        function onError(err) {
            vm.error = err;
        }
    }

    

    RecommendController.$inject = [
        '$state',
        '$stateParams',
        'BeerService',
        'MusicService',
        'CompareService',
        'UserService'
    ];

    angular.module('singingbeer')
        .controller('RecommendController', RecommendController);
}());
