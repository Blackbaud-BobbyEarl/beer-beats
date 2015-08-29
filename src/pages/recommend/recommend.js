/*global angular, console */
(function () {
    'use strict';

    function RecommendController($state, $stateParams, $timeout, BeerService, MusicService, CompareService, UserService) {

        var vm = this,
            beer,
            beat;
        vm.type = $stateParams.type;
        vm.showcase = {};
        vm.chosenItem = {};
        vm.loading = false;

        // Require type && id
        if (!$stateParams.type || !$stateParams.id) {
            $state.go('check-in');
        }

        switch ($stateParams.type) {
            case 'beer':
                BeerService.getBeerById($stateParams.id).then(function (result) {
                    if (result.data && result.data.style && result.data.style.id) {
                        console.log("getBeer:", result);
                        vm.chosenItem = {
                            thumbnail:result.data.labels.large,
                            title:result.data.name,
                            subtitle:result.data.style.shortName
                        };
                        CompareService.getGenresForBeer(result.data.style.id).then(function (result) {
                            var item = result.tracks.items[0];
                            vm.results = result;
                            vm.loading = false;
                            console.log(item);
                            vm.showcase = {
                                thumbnail: item.album.images[0].url,
                                title: item.name,
                                artist: item.artists[0].name
                            };
                            console.log(vm.showcase);
                        }, onError);
                    }
                }, onError);
            break;
            case 'song':
                MusicService.getArtistByTrackId($stateParams.id).then(function (result) {
                    
                        vm.chosenItem = {
                            thumbnail: result.track.album.images[0].url,
                            title: result.track.name,
                            subtitle: result.artist.name
                        };
                        
                        beat = {
                            id: $stateParams.id,
                            artist: result.artist.name,
                            thumbnail: result.track.album.images[2].url,
                            title: result.track.name
                        };

                        CompareService.getBeersForGenre(result.artist.genres).then(function (result) {
                            vm.results = result;
                            if (typeof result !== "undefined") {
                                vm.showcase = {
                                    thumbnail: result[0].labels.large,
                                    title: result[0].name,
                                    style: result[0].style.name,
                                    description: result[0].style.description
                                };
                                
                                beer = {
                                    id: result[0].id,
                                    thumbnail: result[0].labels.small,
                                    title: result[0].name,
                                    style: result[0].style.name,
                                    description: result[0].style.description
                                };

                                $timeout(function () {
                                    vm.loading = false;
                                });
                            }
                        }, onError);
    
                }, onError);
            break;
        }
        
        function onError(err) {
            vm.error = err;
        }
        
        vm.insertMainRecommendation = function () {
            UserService.insertTransaction(beat, beer).then(function () {
                $state.go('user');
            });
            
        };
    }



    RecommendController.$inject = [
        '$state',
        '$stateParams',
        '$timeout',
        'BeerService',
        'MusicService',
        'CompareService',
        'UserService'
    ];

    angular.module('singingbeer')
        .controller('RecommendController', RecommendController);
}());
