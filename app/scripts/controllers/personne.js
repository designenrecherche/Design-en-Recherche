'use strict';

/**
 * @ngdoc function
 * @name derCleanApp.controller:PersonneNameCtrl
 * @description
 * # PersonneNameCtrl
 * Controller of the derCleanApp
 */
angular.module('derCleanApp')
  .controller('PersonneNameCtrl', function ($scope, $routeParams, $rootScope) {

  	var slugActive = $routeParams.name;


  	$rootScope.$watch('annuaireData', function(){
    	if($rootScope.annuaireData)
    		$scope.membre = findMember(slugActive);

    	console.log($scope.membre);
    });

    function findMember(slug){
    	var d = $rootScope.annuaireData;
    	for(var i in d){
    		if(d[i].identifiant === slugActive)
    			return d[i];
    	}
    }

    $scope.pageClass = 'page-personne';
  });
