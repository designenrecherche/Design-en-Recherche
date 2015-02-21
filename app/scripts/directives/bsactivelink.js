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
                var routeBase = $location.path();
                angular.forEach(lis, function(li, key){
                  var href = $(li).find('a').attr('href');
                  console.log(href, routeBase);
                })
                //cleaning links
                /* $('navbar li').removeClass('active');
                 //select active links
                var selectors = ['navbar li > [href="/#' + $location.path() + '"]',
                'navbar li > [href="#' + $location.path().substring(1) + '"]',
                    'navbar li > [href="#' + $location.path() + '"]', //html5: false
                'navbar li > [href="' + $location.path() + '"]']; //html5: true

                $(elem).find(selectors.join(',')) //find the matching link
                .parent('li').addClass('active') //add active class to the matching element
                .siblings('li').removeClass('active'); //remove it from the sibling elements*/
            });
        }
    };
  });
