/*global angular */
(function () {
    'use strict';

    function BeerMatchController(CompareService, MusicService, $stateParams, $location) {

        var vm = this;
        console.log("Params: ", $stateParams);

        // Require trackId
        if (!$stateParams.trackId) {
            $location.path('/search-music');
        }

        // Get album's genre associated with track
        MusicService.getArtistByTrackId($stateParams.trackId).then(function (data) {
            console.log("Artist information: ", data);
            CompareService.getBeersForGenre(data.genres[0]).then(function (data) {
                console.log("Beer ID's: ", data);
                vm.beers = data;
            });
        });

        /*
        BeerService.getBeersByStyleId(21).then(function (result) {
            vm.beers = result.data;
            console.log("Beer:", result);
        });
        */
    }

    BeerMatchController.$inject = [
        'BeerService',
        'MusicService',
        '$stateParams',
        '$location'
    ];

    angular.module('singingbeer')
        .controller('BeerMatchController', BeerMatchController);
}());
