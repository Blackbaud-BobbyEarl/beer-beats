/*global angular */

(function () {
    'use strict';
    
    var genreStyleMapping = {};
    
    genreStyleMapping['Country'] = 95;
    genreStyleMapping['Rock'] = 42;
    genreStyleMapping['Rap'] = 100;
    genreStyleMapping['Pop'] = 119;
    genreStyleMapping['Jazz'] = 58;
    genreStyleMapping['Blues'] = 25;
    genreStyleMapping['Classical'] = 2;
    genreStyleMapping['Dance'] = 93;
    genreStyleMapping['Electronic'] = 77;
    genreStyleMapping['EasyListening'] = 105;
    

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    
    function getStyleIdFromGenre(genre) {
        genre = genre.trim();
        return genreStyleMapping[genre];
    }
    
    function CompareService(BeerService) {
        var compare = {};
        
        compare.getBeersForGenre = function(genre) {
            var styleId;
            
            if (genre && genre.length > 0) {
                styleId = getStyleIdFromGenre(genre[0]);
            } else {
                styleId = Math.floor(Math.random() * (170)) + 1;
            }
            
            return BeerService.getBeersByStyleId(styleId).then(function (result) {
                var beerList = result.data,
                    length = beerList.length;
                if (length > 5) {
                    beerList = shuffleArray(beerList);
                }
                beerList.splice(5, length - 5);
                return beerList;
            });
        };
        
        return compare;
    }
    
    CompareService.$inject = [
        'BeerService'
    ];
    
    angular.module('singingbeer')
        .factory('CompareService', CompareService);
    
}());