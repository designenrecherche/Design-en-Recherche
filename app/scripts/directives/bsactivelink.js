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
                var lis = angular.element(elem).find('li');
                var routeBase = $location.path().split('/')[1];
                angular.forEach(lis, function(li, key){
                  var href = $(li).find('a').attr('href').substring(1);
                  if(href === routeBase && !$(li).hasClass('active'))
                    $(li).addClass('active');
                  else if (href != routeBase && $(li).hasClass('active'))
                    $(li).removeClass('active');
                });
            });
        }
    };
  });
