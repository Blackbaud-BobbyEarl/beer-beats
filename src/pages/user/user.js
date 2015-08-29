/*global angular */
(function () {
    'use strict';

    function UserPageController(UserService) {
        var vm = this;
        vm.user = UserService.getUser();
        vm.transactions = UserService.getTransactionsByUser();
    }

    UserPageController.$inject = [
        'UserService'
    ];

    angular.module('singingbeer')
        .controller('UserPageController', UserPageController);

}());
