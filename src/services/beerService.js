/*global angular */
(function () {
    'use strict';
    
    function BeerService(BeerApiUrl, BeerApiKey, $http) {
        var beerService = {};
        
        beerService.getBeerById = function (id) {
            return $http.get(BeerApiUrl + 'beer/' + id + '?key=' + BeerApiKey);
        };
        
        beerService.getBeerByStyleId = function (styleId) {
            return $http.get(BeerApiUrl + 'style/' + styleId + '?key=' + BeerApiKey);
        };
        
        beerService.getBeerStyles = function () {
            return $http.get(BeerApiUrl + 'styles/' + '?key=' + BeerApiKey);
        };
        
        return beerService;
    }
    
     BeerService.$inject = [
        'BeerApiUrl',
        'BeerApiKey',
        '$http'
    ];
    
    angular.module('singingbeer')
        .factory('BeerService', BeerService)
        .constant('BeerApiKey', '597579363abf32fc0726a6478cc30067')
        .constant('BeerApiUrl', 'http://api.brewerydb.com/v2/')
}());