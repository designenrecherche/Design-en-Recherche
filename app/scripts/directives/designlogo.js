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

        $rootScope.$on('activeMemberId', function(evt, activeMemberId){
          if(activeMemberId.length > 0)
            der.showNodeById(activeMemberId);
          else der.hideAll();
        });

        //hiding all nodes when changing route
        $rootScope.$on('$routeChangeStart', function(){
          console.log("route change start");
          der.hideAll();
          //$rootScope.activeMemberId = "";
        });
      }
    };
  });

