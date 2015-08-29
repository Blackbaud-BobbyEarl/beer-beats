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

    function getRandomGenre() {
        return 'blues';
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

    function getGenreFromStyleId(styleId) {
        var genre;
        if (typeof styleId === "string") {
            styleId = styleId.trim();
        }

        switch (styleId) {

            case 95:
            genre = 'country';
            break;

            case 42:
            genre = 'rock';
            break;

            case 100:
            genre = 'rap';
            break;

            case 119:
            genre = 'pop';
            break;

            case 58:
            genre = 'jazz';
            break;

            case 25:
            genre = 'blues';
            break;

            case 2:
            genre = 'classical';
            break;

            case 93:
            genre = 'dance';
            break;

            case 77:
            genre = 'electronic';
            break;

            case 105:
            genre = 'easy';
            break;

            default:
            genre = getRandomGenre();
            break;
        }
        return genre;
    }

    function CompareService(BeerService, MusicService, $q) {
        var compare = {};

        compare.getGenresForBeer = function (styleId) {
            // Get a list of songs based on a beer ID.
            // First, get the beer.
            /*
            var deferred = $q.defer();
            BeerService.getBeerById(beer).then(function (data) {
                console.log("Beer! ", data);
                deferred.resolve(data);
            });
            return deferred.promise;
            */
            var deferred = $q.defer();
            //BeerService.getBeerById(beer).then(function (data) {
                //console.log("Beer! ", data);
                var genre = getGenreFromStyleId(styleId);
                MusicService.getTracksByGenre(genre).then(function (data) {
                    console.log("Tracks! ", data);
                    deferred.resolve(data);
                });
            //});
            return deferred.promise;
        };

        compare.getBeersForGenre = function (genre) {
            var styleId;

            if (genre && genre.length > 0) {
                styleId = getStyleIdFromGenre(genre[0]);
            } else {
                styleId = getRandomStyleId();
            }

            return BeerService.getBeersByStyleId(styleId).then(function (result) {
                console.log("getBeersForGenre:", result);
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
        'BeerService',
        'MusicService',
        '$q'
    ];

    angular.module('singingbeer')
        .factory('CompareService', CompareService);

}());
