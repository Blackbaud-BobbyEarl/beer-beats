/*global angular */
(function () {
    'use strict';
    function BeerMatchController(BeerService) {
        var vm = this;
        
        BeerService.getBeerStyles().then(function (result) {
            vm.styles = result.data;
        });
    }
    
    BeerMatchController.$inject = [
        'BeerService'
    ];
    
    angular.module('singingbeer')
        .controller('BeerMatchController', BeerMatchController);
}());