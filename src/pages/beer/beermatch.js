/*global angular */
(function () {
    'use strict';
    function BeerMatchController(BeerService) {
        var vm = this;
        
        BeerService.getBeersByStyleId(21).then(function (result) {
            vm.beers = result.data;
        });
    }
    
    BeerMatchController.$inject = [
        'BeerService'
    ];
    
    angular.module('singingbeer')
        .controller('BeerMatchController', BeerMatchController);
}());