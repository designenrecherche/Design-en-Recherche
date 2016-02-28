'use strict';

angular.module('designEnRechercheApp')
  .controller('MembreCartel', function ($scope, $location) {

    var reload = function(){
      if($scope.membre){
        for(var i in $scope.membre){
          var val = $scope.membre[i];
          delete $scope.membre[i];
          $scope.membre[i.toLowerCase()] = val;
        }
      }
    }

    $scope.$watch('membre', reload);
  });
