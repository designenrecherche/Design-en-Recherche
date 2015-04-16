'use strict';

/**
 * @ngdoc function
 * @name derCleanApp.controller:GlobalCtrl
 * @description
 * # GlobalCtrl
 * Controller of the derCleanApp
 */
angular.module('derCleanApp')
  .controller('GlobalCtrl', function ($scope, $rootScope, SpreadsheetRetrieve) {

  	//todo = automatically making nav visible when translate is ok
  	/*$scope.okNav = false;
  	$rootScope.$on('$translateChangeSuccess', function(){
    	console.log('loading the files');
    	$scope.okNav = true;
    });*/

  	$('nav').css('display', 'block');

  	var urlAnnuaire = 'https://docs.google.com/spreadsheets/d/1NovUo_thjsK3GqU3WuBx5Oghe0cEt-qoAtjVQFOez2U/pubhtml';
  	SpreadsheetRetrieve.getSpreadsheetTabletop(urlAnnuaire, function(data, nom){
  		$rootScope.annuaireData = data;
  	}, true, 'annuaire');



  });
