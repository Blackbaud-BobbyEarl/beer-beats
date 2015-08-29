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
        vm.id = $stateParams.id;

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
                            id: result.data.id,
                            thumbnail: result.data.labels.large,
                            title: result.data.name,
                            subtitle: result.data.style.shortName,
                            description: result[0].style.description
                        };
                        CompareService.getGenresForBeer(result.data.style.id).then(function (result) {
                            var item = result.tracks.items[0];
                            vm.results = result;
                            vm.loading = false;
                            console.log(item);
                            vm.showcase = {
                                id: item.id,
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
                        id: $stateParams.id,
                        thumbnail: result.track.album.images[0].url,
                        title: result.track.name,
                        subtitle: result.artist.name
                    };

                    CompareService.getBeersForGenre(result.artist.genres).then(function (result) {
                        vm.results = result;
                        if (typeof result !== "undefined") {
                            vm.showcase = {
                                id: result[0].id,
                                thumbnail: result[0].labels.large,
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
        
        vm.recommendMain = function () {
            var beerTrans,
                beatTrans;
            
            if(vm.type === 'beer') {
                beerTrans = {
                    id: vm.chosenItem.id,
                    thumbnail: vm.chosenItem.thumbnail,
                    title: vm.chosenItem.title,
                    description: vm.chosenItem.description,
                    style: vm.chosenItem.subtitle
                };
                
                beatTrans = vm.showcase;
            } else {
                beatTrans = {
                    id: vm.chosenItem.id,
                    thumbnail: vm.chosenItem.thumbnail,
                    title: vm.chosenItem.title,
                    artist: vm.chosenItem.subtitle
                };
                beerTrans = vm.showcase;
            }
            
            UserService.insertTransaction(beatTrans, beerTrans).then(function () {
                $state.go('user');
            });
            
        };
        
        vm.recommendSongFromBeer = function (beat) {
            var beerTrans = {
                    id: vm.chosenItem.id,
                    thumbnail: vm.chosenItem.thumbnail,
                    title: vm.chosenItem.title,
                    description: vm.chosenItem.description,
                    style: vm.chosenItem.subtitle
                },
                beatTrans = {
                    id: beat.id,
                    thumbnail: beat.album.images[0].url,
                    title: beat.name,
                    artist: beat.artists[0].name
                };
            
            UserService.insertTransaction(beatTrans, beerTrans).then(function () {
                $state.go('user');
            });
        };
        
        vm.recommendBeerFromSong = function (beer) {
            var beatTrans = {
                    id: vm.chosenItem.id,
                    thumbnail: vm.chosenItem.thumbnail,
                    title: vm.chosenItem.title,
                    artist: vm.chosenItem.subtitle
                },
                beerTrans = {
                    id: beer.id,
                    thumbnail: beer.labels.large,
                    title: beer.name,
                    style: beer.style.name,
                    description: beer.style.description
                };
            
             UserService.insertTransaction(beatTrans, beerTrans).then(function () {
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
