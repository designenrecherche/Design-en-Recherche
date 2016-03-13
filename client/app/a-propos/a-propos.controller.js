'use strict';

angular.module('designEnRechercheApp')
  .controller('AProposCtrl', function ($scope, apiService) {
    var init = function(){
      $scope.$parent.routeId = 'a-propos';

      //load intro text
      $scope.aProposStatus = 'loading';
      apiService.getAPropos(function(err, aPropos){
        if(err){
          $scope.aProposStatus = 'error';
        }else{
          $scope.aProposStatus = 'ok';
          $scope.aPropos = aPropos;
        }
      });



      setTimeout(function(){
        $scope.$apply();
      });
    };

    init();
  });
