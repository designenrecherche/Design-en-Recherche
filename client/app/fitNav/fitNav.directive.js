'use strict';

angular.module('designEnRechercheApp')
  .directive('fitNav', function ($document, $window) {
    return {
      restrict: 'C',
      link: function (scope, element) {
        var selector = '.nav', nav, navHeight;

        var update = function(){
          nav = $document.find(selector);
          navHeight = nav.outerHeight();
          element.css('marginTop' , navHeight);
        };

        update();

        angular.element($window).on('resize', update);

        scope.$on('$destroy', function(){
          angular.element($window).off('resize', update);
        });

        scope.$watch(function(){
          if(nav){
            return nav.outerHeight();
          }
        }, update);


      }
    };
  });
