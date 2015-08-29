/*global angular, console */
(function () {
    'use strict';

    function UserService($q, $state, localStorageService) {
        var service = {},
            Transaction = Parse.Object.extend('Transaction');

        service.logout = function () {
            console.log('Logging out!');
            service.setUser('');
            $state.go('login');
        };

        service.setUser = function (user) {
            localStorageService.set('user', user);
        };

        service.getUser = function () {
            return localStorageService.get('user');
        };

        service.insertTransaction = function (song, beer) {
            var deferred = $q.defer(),
                transaction = new Transaction();

            transaction.save({
                userId: service.getUser().id,
                song: song,
                beer: beer
            }).then(function success(result) {
                deferred.resolve(result);
            }, function error(e) {
                deferred.error(e);
            });

            return deferred.promise;
        };

        service.getTransactionsByUser = function (userId) {
            return service.getTransactions({
                userId: userId || service.getUser().id
            });
        };

        service.getTransactionsByBeer = function (beerId) {
            return service.getTransactions({
                beerId: beerId
            });
        };

        service.getTransactionsBySong = function (songId) {
            return service.getTransactions({
                songId: songId
            });
        };

        service.getTransactions = function (options) {
            var deferred = $q.defer(),
                query = new Parse.Query(Transaction),
                supportedOptions = [
                    'userId',
                    'beerId',
                    'songId'
                ];

            if (angular.isDefined(options.userId)) {
                query.equalTo('userId', options.userId);
            }
            if (angular.isDefined(options.beerId)) {
                query.equalTo('beer.id', options.beerId);
            }
            if (angular.isDefined(options.songId)) {
                query.equalTo('song.id');
            }

            query.find().then(function success(result) {
                deferred.resolve(result);
            }, function error(e) {
                deferred.error(e);
            });
            
            return deferred.promise;
        };

        return service;
    }

    UserService.$inject = [
        '$q',
        '$state',
        'localStorageService'
    ];

    angular.module('singingbeer')
        .factory('UserService', UserService);

}());
