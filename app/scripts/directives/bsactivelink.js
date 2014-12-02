'use strict';

/**
 * @ngdoc directive
 * @name derCleanApp.directive:bsActiveLink
 * @description
 * # bsActiveLink
 */
angular.module('derCleanApp')
  .directive('bsActiveLink', function ($location) {
     return {
        restrict: 'A', //use as attribute 
        replace: false,
        link: function (scope, elem) {
            //after the route has changed
            scope.$on("$routeChangeSuccess", function () {
                //cleaning links
                 $('li').removeClass('active');
                 //select active links
                var selectors = ['li > [href="/#' + $location.path() + '"]',
                'li > [href="#' + $location.path().substring(1) + '"]',
                    'li > [href="#' + $location.path() + '"]', //html5: false
                'li > [href="' + $location.path() + '"]']; //html5: true

                $(elem).find(selectors.join(',')) //find the matching link
                .parent('li').addClass('active') //add active class to the matching element
                .siblings('li').removeClass('active'); //remove it from the sibling elements
            });
        }
    };
  });
