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
