/*global angular */

(function () {
    'use strict';

    function shuffleArray(array) {
        var i,
            j,
            temp;
        for (i = array.length - 1; i > 0; i = i - 1) {
            j = Math.floor(Math.random() * (i + 1));
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    
    function getRandomStyleId() {
        return Math.floor(Math.random() * (170)) + 1;
    }
    
    function getStyleIdFromGenre(genre) {
        genre = genre.trim();
        if (genre.indexOf('country') > -1) {
            return 95;
        } else if (genre.indexOf('rock') > -1) {
            return 42;
        } else if (genre.indexOf('rap') > -1) {
            return 100;
        } else if (genre.indexOf('pop') > -1) {
            return 119;
        } else if (genre.indexOf('jazz') > -1) {
            return 58;
        } else if (genre.indexOf('blues') > -1) {
            return 25;
        } else if (genre.indexOf('classical') > -1) {
            return 2;
        } else if (genre.indexOf('dance') > -1) {
            return 93;
        } else if (genre.indexOf('electronic') > -1) {
            return 77;
        } else if (genre.indexOf('easy') > -1) {
            return 105;
        } else {
            return getRandomStyleId();
        }
    }
    
    function CompareService(BeerService) {
        var compare = {};
        
        compare.getBeersForGenre = function (genre) {
            var styleId;
            
            if (genre && genre.length > 0) {
                styleId = getStyleIdFromGenre(genre[0]);
            } else {
                styleId = getRandomStyleId();
            }
            
            return BeerService.getBeersByStyleId(styleId).then(function (result) {
                var beerList = result.data,
                    length = beerList.length;
                if (beerList) {
                    if (length > 5) {
                        beerList = shuffleArray(beerList);
                    }
                    beerList.splice(5, length - 5);
                    return beerList;
                }
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