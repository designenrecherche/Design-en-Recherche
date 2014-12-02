'use strict';

/**
 * @ngdoc function
 * @name derCleanApp.controller:EvenementsMethodesCtrl
 * @description
 * # EvenementsMethodesCtrl
 * Controller of the derCleanApp
 */
angular.module('derCleanApp')
  .controller('EvenementsMethodesCtrl', function ($scope) {
    $scope.scrollTo = function(id){
        console.log($('#designLogo svg').height())
        $('.content-scrollable-container').animate({  
            scrollTop: $(id).offset().top - $('#designLogo svg').height()
        }, 'slow');  
    };

    $scope.pageClass = 'page-methodes';
  });
