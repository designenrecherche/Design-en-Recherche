'use strict';

/**
 * @ngdoc directive
 * @name derCleanApp.directive:designLogo
 * @description
 * # designLogo
 */
angular.module('derCleanApp')
  .directive('designLogo', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the designLogo directive');
      }
    };
  });
