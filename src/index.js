/*global angular */
(function () {
    'use strict';
    angular.module('singingbeer', ['ui.bootstrap', 'ui.router', 'singingbeer.templates'])
        .config(['$locationProvider', '$stateProvider', function ($locationProvider, $stateProvider) {
            $locationProvider.html5Mode(false);
            $stateProvider
                .state('login', {
                    url: '',
                    controller: 'LoginPageController as loginCtrl',
                    templateUrl: 'pages/login/login.html'
                })
                .state('beermatch', {
                    url: '/beer',
                    controller: 'BeerMatchController as beerMatchCtrl',
                    templateUrl: 'pages/beer/beermatch.html'
                });
        }])
        .controller('MainController', angular.noop);
}());