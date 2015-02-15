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
        
        if(!der.initiated)
          der.init();

        $rootScope.$watch('annuaireData', function(){
        	if($rootScope.annuaireData && !der.dataUpdated)
        		der.updateData($rootScope.annuaireData);
        });

        $rootScope.$watch('activeMemberId', function(){
          console.log($rootScope.activeMemberId);
          if($rootScope.activeMemberId)
            der.showNodeById($rootScope.activeMemberId);
          else der.hideAll();
        });
      }
    };
  });

