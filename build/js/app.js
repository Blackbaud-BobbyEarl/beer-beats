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
                url: '/check-in/:type/:query',
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

    function MainController($scope, UserService) {
        var vm = this;
        vm.user = UserService.getUser();
        vm.logout = UserService.logout;
        $scope.$on('user:updated', function (event, data) {
            vm.user = UserService.getUser();
        });
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
        '$scope',
        'UserService'
    ];

    angular.module('singingbeer', ['ui.bootstrap', 'ui.router', 'singingbeer.templates', 'LocalStorageModule', 'dibari.angular-ellipsis'])
        .config(Config)
        .controller('MainController', MainController)
        .run(Run)
        .directive('ngEnter', function () {
            return function (scope, element, attrs) {
                element.bind('keydown keypress', function (event) {
                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEnter || attrs.ngClick, {$event: event});
                        });
                        event.preventDefault();
                    }
                });
            };
        });
}());

/*global angular */
(function () {
    'use strict';

    function CheckInController($scope, $state, $stateParams, BeerService, MusicService) {
        var vm = this;

        vm.searching = false;
        vm.enjoying = $stateParams.type || 'song';
        vm.query = $stateParams.query;
        vm.error = '';
        vm.results = '';
        vm.params = $stateParams;

        vm.search = function () {
            $state.go('check-in', {
                type: vm.enjoying,
                query: vm.query
            });
        };

        vm.recommend = function (id) {
            $state.go('recommend', {
                type: vm.enjoying,
                id: id
            });
        };

        $scope.$watch(
            function enjoyingWatch() {
                return vm.enjoying;
            },
            function enjoyingChange(newValue, oldValue) {
                if (angular.isDefined(newValue) && newValue !== oldValue) {
                    vm.query = '';
                    vm.search();
                }
            }
        );

        function success(results) {
            vm.searching = false;
            vm.error = '';
            vm.results = results;
        }

        function error(err) {
            vm.searching = false;
            vm.results = '';
            vm.error = err;
        }

        function beerSuccess(results) {
            success(results.data);
        }

        function songSuccess(results) {
            success(results.tracks.items);
        }

        function beerError(err) {
            error(err);
        }

        function songError(err) {
            error(err);
        }

        if (vm.enjoying && vm.query) {
            vm.error = '';
            vm.results = '';
            vm.searching = true;
            vm.searchingNoResults = false;
            switch (vm.enjoying) {
                case 'beer':
                    BeerService.searchBeers(vm.query).then(beerSuccess, beerError);
                break;
                case 'song':
                    MusicService.search(vm.query).then(songSuccess, songError);
                break;
            }
        }

    }


    CheckInController.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        'BeerService',
        'MusicService'
    ];

    angular.module('singingbeer')
        .controller('CheckInController', CheckInController);

}());

/*global angular */
(function () {
    'use strict';

    function LoginPageController($state, UserService) {
        var vm = this;

        vm.go = function () {
            $state.go('check-in');
        };

        vm.login = function () {
            OAuth.popup('facebook').done(function (result) {
                result.me().done(function (data) {
                    console.log(data);
                    UserService.setUser(data);
                    vm.go();
                });
            });
        };

        vm.anonymous = function () {
            UserService.setUser({
                id: '1337',
                name: 'Anonymous',
                avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAACXBIWXMAAAsTAAALEwEAmpwYAAA4KGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwMTQgNzkuMTU2Nzk3LCAyMDE0LzA4LzIwLTA5OjUzOjAyICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoTWFjaW50b3NoKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNS0wOC0zMFQyMjozNjozMy0wNDowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE1LTA4LTMwVDIyOjM3OjA1LTA0OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxNS0wOC0zMFQyMjozNzowNS0wNDowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MjwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDo3NTVjZmMwYy0xMDc4LTQ4OWYtYTk4OC02NmM5NTNjZmM2MmE8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6NzU1Y2ZjMGMtMTA3OC00ODlmLWE5ODgtNjZjOTUzY2ZjNjJhPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6NzU1Y2ZjMGMtMTA3OC00ODlmLWE5ODgtNjZjOTUzY2ZjNjJhPC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjc1NWNmYzBjLTEwNzgtNDg5Zi1hOTg4LTY2Yzk1M2NmYzYyYTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNS0wOC0zMFQyMjozNjozMy0wNDowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjUwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjUwPC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz7uU1O1AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAMAUExURcXFxfX19f7+/vHx8e7u7unp6eXl5eHh4dzc3NnZ2dXV1dHR0c3NzcnJyfn5+cbGxhAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOTk5SUlJWVlZaWlpeXl5iYmJmZmZqampubm5ycnJ2dnZ6enp+fn6CgoKGhoaKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t/f3+Dg4OHh4eLi4uPj4+Tk5OXl5ebm5ufn5+jo6Onp6erq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v///wXkk64AAACcSURBVHja7NTBDoIwEITh5RcVirTv/7beDJYSZgweJM79y063hYh/Tp0bANxlUHilaIK3CGCiymTOUObkNenkk6s7oJmfJOVEZ/mEzP7tt8bk419ypFqkb3yVEZel6AUwusWm1pLTsVfJVmbz6QM83CGb3cA1YBuf5D2y+mkO7GY0azWq+aT4JCuks3tVY3wyaGS55l4j14iIeA4AXHcJKyEvi5UAAAAASUVORK5CYII='
            });
            vm.go();
        };

        if (UserService.getUser()) {
            vm.go();
        }
    }

    LoginPageController.$inject = [
        '$state',
        'UserService'
    ];

    angular.module('singingbeer')
        .controller('LoginPageController', LoginPageController);

}());

/*global angular, console */
(function () {
    'use strict';

    function RecommendController($state, $stateParams, $timeout, BeerService, MusicService, CompareService, UserService) {

        var vm = this,
            beer,
            beat;
        vm.type = $stateParams.type;
        vm.showcase = {};
        vm.chosenItem = {};
        vm.loading = false;
        vm.id = $stateParams.id;

        // Require type && id
        if (!$stateParams.type || !$stateParams.id) {
            $state.go('check-in');
        }

        switch ($stateParams.type) {
            case 'beer':
                BeerService.getBeerById($stateParams.id).then(function (result) {
                    if (result.data && result.data.style && result.data.style.id) {
                        console.log("getBeer:", result);
                        vm.chosenItem = {
                            id: result.data.id,
                            thumbnail: result.data.labels.large,
                            title: result.data.name,
                            subtitle: result.data.style.shortName,
                            description: result.data.style.description
                        };
                        CompareService.getGenresForBeer(result.data.style.id).then(function (result) {
                            var item = result.tracks.items[0];
                            vm.results = result;
                            vm.loading = false;
                            console.log(item);
                            vm.showcase = {
                                id: item.id,
                                thumbnail: item.album.images[0].url,
                                title: item.name,
                                artist: item.artists[0].name
                            };
                            console.log(vm.showcase);
                        }, onError);
                    }
                }, onError);
            break;
            case 'song':
                MusicService.getArtistByTrackId($stateParams.id).then(function (result) {
                    
                    vm.chosenItem = {
                        id: $stateParams.id,
                        thumbnail: result.track.album.images[0].url,
                        title: result.track.name,
                        subtitle: result.artist.name
                    };

                    CompareService.getBeersForGenre(result.artist.genres).then(function (result) {
                        vm.results = result;
                        if (typeof result !== "undefined") {
                            vm.showcase = {
                                id: result[0].id,
                                thumbnail: result[0].labels.large,
                                title: result[0].name,
                                style: result[0].style.name,
                                description: result[0].style.description
                            };

                            $timeout(function () {
                                vm.loading = false;
                            });
                        }
                    }, onError);
    
                }, onError);
            break;
        }
        
        function onError(err) {
            vm.error = err;
        }
        
        vm.recommendMain = function () {
            var beerTrans,
                beatTrans;
            
            if(vm.type === 'beer') {
                beerTrans = {
                    id: vm.chosenItem.id,
                    thumbnail: vm.chosenItem.thumbnail,
                    title: vm.chosenItem.title,
                    description: vm.chosenItem.description,
                    style: vm.chosenItem.subtitle
                };
                
                beatTrans = vm.showcase;
            } else {
                beatTrans = {
                    id: vm.chosenItem.id,
                    thumbnail: vm.chosenItem.thumbnail,
                    title: vm.chosenItem.title,
                    artist: vm.chosenItem.subtitle
                };
                beerTrans = vm.showcase;
            }
            
            UserService.insertTransaction(beatTrans, beerTrans).then(function () {
                $state.go('user');
            });
            
        };
        
        vm.recommendSongFromBeer = function (beat) {
            var beerTrans = {
                    id: vm.chosenItem.id,
                    thumbnail: vm.chosenItem.thumbnail,
                    title: vm.chosenItem.title,
                    description: vm.chosenItem.description,
                    style: vm.chosenItem.subtitle
                },
                beatTrans = {
                    id: beat.id,
                    thumbnail: beat.album.images[0].url,
                    title: beat.name,
                    artist: beat.artists[0].name
                };
            
            UserService.insertTransaction(beatTrans, beerTrans).then(function () {
                $state.go('user');
            });
        };
        
        vm.recommendBeerFromSong = function (beer) {
            var beatTrans = {
                    id: vm.chosenItem.id,
                    thumbnail: vm.chosenItem.thumbnail,
                    title: vm.chosenItem.title,
                    artist: vm.chosenItem.subtitle
                },
                beerTrans = {
                    id: beer.id,
                    thumbnail: beer.labels.large,
                    title: beer.name,
                    style: beer.style.name,
                    description: beer.style.description
                };
            
             UserService.insertTransaction(beatTrans, beerTrans).then(function () {
                $state.go('user');
            });
        };
        
        
    }



    RecommendController.$inject = [
        '$state',
        '$stateParams',
        '$timeout',
        'BeerService',
        'MusicService',
        'CompareService',
        'UserService'
    ];

    angular.module('singingbeer')
        .controller('RecommendController', RecommendController);
}());

/*global angular */
(function () {
    'use strict';

    function UserPageController(UserService) {
        var vm = this;
        vm.user = UserService.getUser();
        UserService.getTransactionsByUser().then(function (result) {
            vm.transactions = result;
        });
        vm.logout = UserService.logout;
    }

    UserPageController.$inject = [
        'UserService'
    ];

    angular.module('singingbeer')
        .controller('UserPageController', UserPageController);

}());

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
        var arr = ['blues', 'country', 'rock', 'rap', 'pop', 'jazz', 'blues', 'classical', 'dance-pop', 'electronic', 'easy+listening'];
        var length = arr.length - 1;
        var i = Math.floor(Math.random() * length) + 1;
        return arr[i];
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

    function getTracks (data, deferred) {
        var length = data.tracks.items.length;
        if (data.tracks.items) {
            if (length > 5) {
                    data.tracks.items = shuffleArray(data.tracks.items);
                    data.tracks.items.splice(5, length - 5);
                }
            } 
        deferred.resolve(data);
    }
    
    function CompareService(BeerService, MusicService, $q) {
        var compare = {};

        compare.getGenresForBeer = function (styleId) {
            var deferred = $q.defer(),
                genre = getGenreFromStyleId(styleId);
            MusicService.getTracksByGenre(genre).then(function (data) {
                var length;
                if (!data || !data.tracks || data.tracks.length === 0) {
                    MusicService.search(genre).then(function (dataSearch) {
                        getTracks(dataSearch, deferred);
                    });
                } else {
                    getTracks(data, deferred);
                }
            });
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

/*global angular */
(function () {
    'use strict';

    function MusicService($http, $q, MusicProxy) {

        var service = {};

        service.search = function (query) {
            var deferred = $q.defer();
            
            query = encodeURIComponent(query);
            $http.get(MusicProxy + encodeURIComponent('https://api.spotify.com/v1/search?q=' + query + '&type=track')).success(function (res) {
                deferred.resolve(res);
            });
            return deferred.promise;
        };

        service.getArtistByTrackId = function (trackId) {
            var deferred = $q.defer();
            var data = {};
            $http.get(MusicProxy + encodeURIComponent('https://api.spotify.com/v1/tracks/' + trackId)).success(function (res) {
                data.track = res;
                $http.get(MusicProxy + encodeURIComponent('https://api.spotify.com/v1/artists/' + res.artists[0].id)).success(function (res) {
                    data.artist = res;
                    deferred.resolve(data);
                });
            });
            return deferred.promise;
        };

        service.getTracksByGenre = function (genre) {
            var deferred = $q.defer(),
                genreEncode = encodeURIComponent(genre);
            console.log("Requesting tracks for genre ", genre);
            $http.get(MusicProxy + encodeURIComponent('https://api.spotify.com/v1/search?q=genre:' + genreEncode + '&type=track')).then(function (res) {
                deferred.resolve(res);
            });
            return deferred.promise;
        };

        return service;

    }

    MusicService.$inject = [
        '$http',
        '$q',
        'MusicProxy'
    ];

    angular.module('singingbeer')
        .factory('MusicService', MusicService)
        .constant('MusicProxy', 'http://developer.blackbaud.com/proxy/?mode=native&url=');

}());

/*global angular, console */
(function () {
    'use strict';

    function UserService($q, $state, $rootScope, localStorageService) {
        var service = {},
            Transaction = Parse.Object.extend('Transaction');

        service.logout = function () {
            service.setUser('');
            $state.go('login');
        };

        service.setUser = function (user) {
            localStorageService.set('user', user);
            $rootScope.$broadcast('user:updated', user);
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

            query.descending('createdAt');

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
        '$rootScope',
        'localStorageService'
    ];

    angular.module('singingbeer')
        .factory('UserService', UserService);

}());

/*global angular, console */
(function () {
    'use strict';

    function BeerService(BeerApiUrl, BeerApiKey, BeerProxy, $http) {
        var beerService = {};

        beerService.getBeerById = function (id) {
            console.log(BeerApiUrl + 'beer/' + id + '?key=' + BeerApiKey);
            var url = BeerProxy + encodeURIComponent(BeerApiUrl + 'beer/' + id + '?key=' + BeerApiKey);
            console.log("Get beer: ", url);
            return $http.get(url).then(function (result) {
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
                for (var i in result.data.data) {
                    if (result.data.data[i].labels) {
                        keep.push(result.data.data[i]);
                    }
                }
                return {data: keep};
            });
        };

        beerService.searchBeers = function (query) {
            query = encodeURIComponent(query);
            return $http.get(BeerProxy + encodeURIComponent(BeerApiUrl + 'search?q=' + query + '&type=beer&key=' + BeerApiKey)).then(function (result) {
                var keep = [];
                for (var i in result.data.data) {
                    if (result.data.data[i].labels) {
                        keep.push(result.data.data[i]);
                    }
                }
                return {data: keep};
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
        .constant('BeerApiKey', '9ee1afc5287af1ef31776b320af5fab9')
        .constant('BeerApiUrl', 'http://api.brewerydb.com/v2/')
        .constant('BeerProxy', 'http://developer.blackbaud.com/proxy/?mode=native&url=');
}());

angular.module('singingbeer.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('pages/check-in/check-in.html',
        '<div id="check-in">\n' +
        '\n' +
        '    <h2>I am enjoying a...</h2>\n' +
        '\n' +
        '    <div id="check-in-form">\n' +
        '        <div class="btn-group input-group-lg btn-group-justified">\n' +
        '            <label class="btn btn-warning btn-lg" ng-model="checkin.enjoying" btn-radio="\'song\'"><i class="fa fa-music"></i><span class="hidden-xs"> Song</span></label>\n' +
        '            <label class="btn btn-warning btn-lg" ng-model="checkin.enjoying" btn-radio="\'beer\'"><i class="fa fa-beer"></i><span class="hidden-xs">  Beer</span></label>\n' +
        '        </div>\n' +
        '        <div class="input-group input-group-lg" style="margin-bottom: 15px;">\n' +
        '            <input type="text" class="form-control" placeholder="What {{ checkin.enjoying }}?" ng-model="checkin.query" ng-enter="checkin.search()">\n' +
        '            <span class="input-group-btn">\n' +
        '                <button class="btn btn-default btn-lg" type="button" ng-click="checkin.search()"><i class="fa fa-search"></i></button>\n' +
        '            </span>\n' +
        '        </div>\n' +
        '        <p ng-show="checkin.searching">\n' +
        '            <i class="fa fa-2x fa-spin fa-spinner"></i>\n' +
        '        </p>\n' +
        '        <p ng-if="checkin.error" class="alert alert-danger">\n' +
        '            {{ checkin.error }}\n' +
        '        </p>\n' +
        '        <p class="alert alert-info" ng-show="!checkin.searching && checkin.params.query && (!checkin.results || checkin.results.length === 0)">\n' +
        '            Unable to locate any results for {{ checkin.params.query }}.\n' +
        '        </p>\n' +
        '        <div ng-switch="checkin.enjoying" class="checkin-results">\n' +
        '            <div ng-switch-when="beer" class="list-group">\n' +
        '                <a ng-repeat="beer in checkin.results" href="" class="list-group-item" ng-click="checkin.recommend(beer.id)">\n' +
        '                    <div class="media">\n' +
        '                        <div class="media-left">\n' +
        '                            <img class="media-object" alt="" ng-src="{{ beer.labels.icon }}">\n' +
        '                        </div>\n' +
        '                        <div class="media-body">\n' +
        '                            <h4 class="media-heading">{{ beer.nameDisplay }}</h4>\n' +
        '                            <div data-ng-bind="beer.description" class="media-description" data-ellipsis></div>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </a>\n' +
        '            </div>\n' +
        '            <div ng-switch-when="song" class="list-group">\n' +
        '                <a ng-repeat="track in checkin.results" href="" class="list-group-item" ng-click="checkin.recommend(track.id)">\n' +
        '                    <div class="media">\n' +
        '                        <div class="media-left">\n' +
        '                            <img class="media-object" alt="" ng-src="{{ track.album.images[2].url }}">\n' +
        '                        </div>\n' +
        '                        <div class="media-body">\n' +
        '                            <h4 class="media-heading">{{ track.name }}</h4>\n' +
        '                            <small class="text-muted">{{ track.artists[0].name }}</small>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </a>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '');
    $templateCache.put('pages/login/login.html',
        '<h2>Welcome to Beer Beats</h2>\n' +
        '\n' +
        '<div class="text-left">\n' +
        '  <button class="btn btn-lg btn-primary" ng-click="loginCtrl.login()">\n' +
        '    <i class="fa fa-facebook"></i> Login with Facebook\n' +
        '  </button>\n' +
        '  <button class="btn btn-lg btn-default" ng-click="loginCtrl.anonymous()">\n' +
        '    <i class="fa fa-user-secret"></i> Browse Anonymously\n' +
        '  </button>\n' +
        '</div>\n' +
        '');
    $templateCache.put('pages/recommend/recommend.html',
        '<div id="recommend-pane">\n' +
        '  <p ng-show="recommendCtrl.error" class="alert alert-danger">\n' +
        '    {{ recommendCtrl.error }}\n' +
        '  </p>\n' +
        '\n' +
        '  <p>&nbsp;</p>\n' +
        '\n' +
        '  <div class="row">\n' +
        '    <div class="col-sm-6">\n' +
        '      <div class="card text-center">\n' +
        '        <h3 ng-switch="recommendCtrl.type">\n' +
        '            <span ng-switch-when="song"><i class="fa fa-fw fa-music"></i> Listening to...</span>\n' +
        '            <span ng-switch-when="beer"><i class="fa fa-fw fa-beer"></i> Drinking a...</span>\n' +
        '        </h3>\n' +
        '        <div ng-show="recommendCtrl.loading">\n' +
        '          <i class="fa fa-3x fa-spin fa-spinner text-primary"></i>\n' +
        '        </div>\n' +
        '        <div ng-show="!recommendCtrl.loading && recommendCtrl.chosenItem">\n' +
        '          <div class="center-block">\n' +
        '            <img class="img-circle img-thumbnail" ng-src="{{ recommendCtrl.chosenItem.thumbnail }}">\n' +
        '            <h4 class="text-center">{{ recommendCtrl.chosenItem.title }}</h4>\n' +
        '            <h5 class="text-center">{{ recommendCtrl.chosenItem.subtitle }}</h5>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '    <div class="col-sm-6">\n' +
        '      <div class="card text-center">\n' +
        '          <h3 ng-switch="recommendCtrl.type">\n' +
        '            <span ng-switch-when="song"><i class="fa fa-fw fa-beer"></i> We recommend...</span>\n' +
        '            <span ng-switch-when="beer"><i class="fa fa-fw fa-music"></i> We recommend...</span>\n' +
        '        </h3>\n' +
        '        <div ng-show="recommendCtrl.loading">\n' +
        '          <i class="fa fa-3x fa-spin fa-spinner text-primary"></i>\n' +
        '        </div>\n' +
        '        <div ng-show="!recommendCtrl.loading && recommendCtrl.showcase">\n' +
        '          <div class="center-block">\n' +
        '            <img class="img-circle img-thumbnail" ng-src="{{ recommendCtrl.showcase.thumbnail }}">\n' +
        '            <h4>\n' +
        '              {{ recommendCtrl.showcase.title }}\n' +
        '              <a href="" data-toggle="collapse" data-target="#more-info" ng-hide="recommendCtrl.type === \'beer\'">\n' +
        '                <i class="fa fa-info-circle"></i>\n' +
        '              </a>\n' +
        '            </h4>\n' +
        '            <h5>\n' +
        '              <span ng-switch="recommendCtrl.type">\n' +
        '                <span ng-switch-when="beer">{{ recommendCtrl.showcase.artist }}</span>\n' +
        '                <span ng-switch-when="song">{{ recommendCtrl.showcase.style }}</span>\n' +
        '              </span>\n' +
        '            </h5>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '\n' +
        '  <div class="card collapse" id="more-info">\n' +
        '    <h3>More about {{ recommendCtrl.showcase.title }}</h3>\n' +
        '    <p class="text-muted">{{ recommendCtrl.showcase.description }}</p>\n' +
        '  </div>\n' +
        '\n' +
        '  <p class="text-center">\n' +
        '    <button class="btn btn-warning btn-lg btn-excellent" ng-click="recommendCtrl.recommendMain(recommendCtrl.chosenItem, recommendCtrl.showcase)">\n' +
        '      <i class="fa fa-thumbs-up"></i> Excellent Recommendation!\n' +
        '    </button>\n' +
        '  </p>\n' +
        '\n' +
        '  <h3>Not your cup of <s class="text-muted">tea</s> beer?</h3>\n' +
        '  <p class="text-muted">Try these other recommendations!</p>\n' +
        '  <div ng-switch="recommendCtrl.type">\n' +
        '    <div ng-switch-when="song" class="list-group">\n' +
        '      <a ng-repeat="beer in recommendCtrl.results" href="" class="list-group-item" ng-click="recommendCtrl.recommendBeerFromSong(beer)">\n' +
        '        <div class="media">\n' +
        '          <div class="media-left">\n' +
        '            <img class="media-object" alt="" ng-src="{{ beer.labels.icon }}">\n' +
        '          </div>\n' +
        '          <div class="media-body">\n' +
        '            <h4 class="media-heading">{{ beer.nameDisplay }}</h4>\n' +
        '            {{ beer.description }}\n' +
        '          </div>\n' +
        '        </div>\n' +
        '      </a>\n' +
        '    </div>\n' +
        '    <div ng-switch-when="beer" class="list-group">\n' +
        '      <a ng-repeat="track in recommendCtrl.results.tracks.items" href="" class="list-group-item" ng-click="recommendCtrl.recommendSongFromBeer(track)">\n' +
        '        <div class="media">\n' +
        '          <div class="media-left">\n' +
        '            <img class="media-object" alt="" ng-src="{{ track.album.images[2].url }}">\n' +
        '          </div>\n' +
        '          <div class="media-body">\n' +
        '            <h4 class="media-heading">{{ track.name }}</h4>\n' +
        '            {{ track.artists[0].name }}\n' +
        '          </div>\n' +
        '        </div>\n' +
        '      </a>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>\n' +
        '');
    $templateCache.put('pages/user/user.html',
        '<div class="clearfix">\n' +
        '  <button type="button" ng-click="userCtrl.logout()" class="btn btn-primary btn-logout pull-right">\n' +
        '    Logout\n' +
        '  </button>\n' +
        '  <h3>{{ userCtrl.user.name }}</h3>\n' +
        '</div>\n' +
        '\n' +
        '<div ng-show="userCtrl.loading">\n' +
        '    <i class="fa fa-3x fa-spin fa-spinner text-primary"></i>\n' +
        '</div>\n' +
        '\n' +
        '<p ng-hide="userCtrl.loading || userCtrl.transactions.length > 0" class="alert alert-info">\n' +
        '  You haven\'t matched any beers and beats...yet.\n' +
        '</p>\n' +
        '\n' +
        '<div ng-show="!userCtrl.loading && userCtrl.transactions.length > 0">\n' +
        '    <h4>Recent Beer and Beat matches</h4>\n' +
        '\n' +
        '    <div class="row" ng-repeat="transaction in userCtrl.transactions">\n' +
        '        <div class="col-sm-5">\n' +
        '            <div class="card text-center">\n' +
        '                <h3>\n' +
        '                    <span><i class="fa fa-fw fa-music"></i></span>\n' +
        '                </h3>\n' +
        '                <div class="center-block">\n' +
        '                    <img class="img-circle img-thumbnail" ng-src="{{ transaction.attributes.song.thumbnail }}">\n' +
        '                    <h4 class="text-center">{{  transaction.attributes.song.title }}</h4>\n' +
        '                    <h5 class="text-center">{{  transaction.attributes.song.artist }}</h5>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="col-sm-2" style="text-align: center;">\n' +
        '            <h3>\n' +
        '                <span class="hidden-xs"><i class="fa fa-arrows-h fa-3x"></i></span>\n' +
        '                <span class="hidden-sm hidden-md hidden-lg"><i class="fa fa-arrows-v fa-3x"></i></span>\n' +
        '            </h3>\n' +
        '        </div>\n' +
        '        <div class="col-sm-5">\n' +
        '            <div class="card text-center">\n' +
        '                <h3>\n' +
        '                    <span><i class="fa fa-fw fa-beer"></i></span>\n' +
        '                </h3>\n' +
        '                <div class="center-block">\n' +
        '                    <img class="img-circle img-thumbnail" ng-src="{{  transaction.attributes.beer.thumbnail }}">\n' +
        '                    <h4>\n' +
        '                        {{ transaction.attributes.beer.title }}\n' +
        '                    </h4>\n' +
        '                    <h5>\n' +
        '                        <span>\n' +
        '                            <span>{{ transaction.attributes.beer.style }}</span>\n' +
        '                        </span>\n' +
        '                    </h5>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '');
}]);

//# sourceMappingURL=app.js.map