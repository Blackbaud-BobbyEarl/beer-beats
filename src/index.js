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
            .state('user', {
                url: '/user',
                controller: 'UserPageController as userCtrl',
                templateUrl: 'pages/user/user.html'
            })
            .state('search-music', {
                url: '/search-music',
                controller: 'SearchMusicController as music',
                templateUrl: 'pages/search-music/search-music.html'
            })
            .state('beermatch', {
                url: '/beer/:trackId',
                controller: 'BeerMatchController as beerMatchCtrl',
                templateUrl: 'pages/beer/beermatch.html'
            });
        OAuth.initialize('fMP572zzDgGOOnxYEMMFKwRo5SI');
        Parse.initialize("CoNi5s1aee6KJlaNZ1YiP0oQKjSWid1czX2vYtUT", "rh46bhFYE9ht50Ld0tYfWzNsho5uPNXdVqzGGF6J");
    }

    function Run($state, UserService) {
        if (!UserService.getUser()) {
            $state.go('login');
        }
    }

    Config.$inject = [
        '$locationProvider',
        '$stateProvider',
        '$urlRouterProvider'
    ];

    Run.$inject = [
        '$state',
        'UserService'
    ];

    angular.module('singingbeer', ['ui.bootstrap', 'ui.router', 'singingbeer.templates', 'LocalStorageModule'])
        .config(Config)
        .controller('MainController', angular.noop)
        .run(Run);
}());
