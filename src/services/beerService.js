/*global angular, console */
(function () {
    'use strict';

    function BeerService(BeerApiUrl, BeerApiKey, BeerProxy, $http) {
        var beerService = {};

        beerService.getBeerById = function (id) {
            console.log(BeerApiUrl + 'beer/' + id + '?key=' + BeerApiKey);
            var url = BeerProxy + encodeURIComponent(BeerApiUrl + 'beer/' + id + '?key=' + BeerApiKey);
            console.log("Get beer: ", url);
            return $http.get(url).then(function (result) {
                return result.data;
            });
        };

        beerService.getStyleByStyleId = function (styleId) {
            return $http.get(BeerProxy + encodeURIComponent(BeerApiUrl + 'style/' + styleId + '?key=' + BeerApiKey)).then(function (result) {
                return result.data;
            });
        };

        beerService.getBeerStyles = function () {
            return $http.get(BeerProxy + encodeURIComponent(BeerApiUrl + 'styles/' + '?key=' + BeerApiKey)).then(function (result) {
                return result.data;
            });
        };

        beerService.getBeersByStyleId = function (styleId) {
            return $http.get(BeerProxy + encodeURIComponent(BeerApiUrl + 'beers/?styleId=' + styleId + '&key=' + BeerApiKey)).then(function (result) {
                var keep = [];
                console.log("Data:", result.data);
                for (var i in result.data.data) {
                    if (result.data.data[i].labels) {
                        keep.push(result.data.data[i]);
                    }
                }
                return {data: keep};
            });
        };

        beerService.searchBeers = function (query) {
            query = encodeURIComponent(query);
            return $http.get(BeerProxy + encodeURIComponent(BeerApiUrl + 'search?q=' + query + '&type=beer&key=' + BeerApiKey)).then(function (result) {
                return result.data;
            });
        };

        return beerService;
    }

    BeerService.$inject = [
        'BeerApiUrl',
        'BeerApiKey',
        'BeerProxy',
        '$http'
    ];

    angular.module('singingbeer')
        .factory('BeerService', BeerService)
        .constant('BeerApiKey', '9ee1afc5287af1ef31776b320af5fab9')
        .constant('BeerApiUrl', 'http://api.brewerydb.com/v2/')
        .constant('BeerProxy', 'http://developer.blackbaud.com/proxy/?mode=native&url=');
}());
