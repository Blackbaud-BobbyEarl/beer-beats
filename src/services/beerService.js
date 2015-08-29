/*global angular */
(function () {
    'use strict';

    function BeerService(BeerApiUrl, BeerApiKey, BeerProxy, $http) {
        var beerService = {};

        beerService.getBeerById = function (id) {
            return $http.get(BeerProxy + encodeURIComponent(BeerApiUrl + 'beer/' + id + '?key=' + BeerApiKey)).then(function (result) {
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
                console.log("Data:",result.data);
                for (var i in result.data.data) {
                    if (result.data.data[i].labels) {
                        keep.push(result.data.data[i]);
                    }
                }
                return {data: keep};
            });
        };

        beerService.searchBeers = function (query) {
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
        .constant('BeerApiKey', '597579363abf32fc0726a6478cc30067')
        .constant('BeerApiUrl', 'http://api.brewerydb.com/v2/')
        .constant('BeerProxy', 'http://developer.blackbaud.com/proxy/?mode=native&url=');
}());
