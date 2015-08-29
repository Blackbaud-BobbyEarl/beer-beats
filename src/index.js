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
            .state('check-in', {
                url: '/check-in',
                controller: 'CheckInController as checkin',
                templateUrl: 'pages/check-in/check-in.html'
            })
            .state('recommend', {
                url: '/recommend/:type/:id',
                controller: 'RecommendController as recommendCtrl',
                templateUrl: 'pages/recommend/recommend.html'
            });
        OAuth.initialize('fMP572zzDgGOOnxYEMMFKwRo5SI');
        Parse.initialize("CoNi5s1aee6KJlaNZ1YiP0oQKjSWid1czX2vYtUT", "rh46bhFYE9ht50Ld0tYfWzNsho5uPNXdVqzGGF6J");
    }

    function Run($state, UserService) {
        if (!UserService.getUser()) {
            $state.go('login');
        }
    }

    function MainController(UserService) {
        var vm = this;
        vm.user = UserService.getUser();
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

    MainController.$inject = [
        'UserService'
    ];

    angular.module('singingbeer', ['ui.bootstrap', 'ui.router', 'singingbeer.templates', 'LocalStorageModule', 'dibari.angular-ellipsis'])
        .config(Config)
        .controller('MainController', MainController)
        .run(Run);
}());
