'use strict';
angular.module('designEnRechercheApp')
  .directive('loadWithMembre', function ($compile, $timeout) {
    return {
      restrict: 'A',
      scope : {
        membres : '=',
        membreId : '@loadWithMembre'
      },
      link: function (scope, element, attrs) {
        scope.hasMembre = false;

        var update = function(membres){
          membres.some(function(m){
            if(m.identifiant === scope.membreId){
              return scope.membre = m;
            }
          });
          $timeout(function(){
            if(scope.hasMembre == false){
              scope.hasMembre = true;
              $compile(element.find('div[ng-include]'))(scope);
              scope.$apply();
            }
          }, 500);
        }

        scope.$watch('membres', update);
      }
    };
  });
