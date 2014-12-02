'use strict';

/**
 * @ngdoc function
 * @name derCleanApp.controller:AnnuaireCtrl
 * @description
 * # AnnuaireCtrl
 * Controller of the derCleanApp
 */
angular.module('derCleanApp')
  .controller('AnnuaireCtrl', function ($scope, $rootScope) {
    $rootScope.$watch('annuaireData', function(){
    	if($rootScope.annuaireData)
    		$scope.membres = $rootScope.annuaireData;
    });
  });
