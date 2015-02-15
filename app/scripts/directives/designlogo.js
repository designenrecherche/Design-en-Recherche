'use strict';

/**
 * @ngdoc directive
 * @name derCleanApp.directive:designLogo
 * @description
 * # designLogo
 */
angular.module('derCleanApp')
  .directive('designLogo', function ($rootScope) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        
      	if(!der.loaded)
        	der.init();

        $rootScope.$watch('annuaireData', function(){
        	if($rootScope.annuaireData)
        		der.feedMeWithYourBigData($rootScope.annuaireData);
        })

      }
    };
  });

