'use strict';

/**
 * @ngdoc directive
 * @name derCleanApp.directive:errSrc
 * @description
 * # errSrc
 */
angular.module('derCleanApp')
  .directive('errSrc', function () {
    return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  	}
  });
