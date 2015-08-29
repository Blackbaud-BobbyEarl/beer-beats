/*global angular */
(function () {
    'use strict';


    function Config($locationProvider, $stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('login', {
                url: '/login',
                controller: 'LoginPageController as loginCtrl',
                templateUrl: 'pages/login/login.html'
            })
            .state('search-music', {
                url: '/search-music',
                controller: 'SearchMusicController as music',
                templateUrl: 'pages/search-music/search-music.html'
            })
            .state('beermatch', {
                url: '/beer',
                controller: 'BeerMatchController as beerMatchCtrl',
                templateUrl: 'pages/beer/beermatch.html'
            });
        OAuth.initialize('fMP572zzDgGOOnxYEMMFKwRo5SI');
        //Parse.initialize()
    }

    Config.$inject = [
        '$locationProvider',
        '$stateProvider',
        '$urlRouterProvider'
    ];

    angular.module('singingbeer', ['ui.bootstrap', 'ui.router', 'singingbeer.templates', 'LocalStorageModule'])
        .config(Config)
        .controller('MainController', angular.noop);
}());
