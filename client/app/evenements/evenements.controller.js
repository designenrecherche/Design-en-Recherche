'use strict';

angular.module('designEnRechercheApp')
  .controller('EvenementsCtrl', function ($scope, $routeParams, apiService, $sce) {
    var init = function(){
      $scope.$parent.routeId = 'evenements';
      $scope.evenementId = $routeParams.id;
      if($scope.evenementId){
        $scope.searchEvenement = '';
        updateEvenement($scope.evenementId);
      }else{
        updateEvenements();
      }
      setTimeout(function(){
        $scope.$apply();
      });
    }

    var updateEvenement = function(id){
      $scope.loadingStatus = 'loading';
      apiService.getEvenements(id, function(err, data){
        if(err){
          $scope.loadingStatus = 'error';
        }else{
          $scope.loadingStatus = 'ok';
          data.contenu = $sce.trustAsHtml(data.gContent_contenu);
          $scope.data = data;
        }
      });
    }

    var updateEvenements = function(){
      $scope.loadingStatus = 'loading';
      apiService.getEvenements(undefined, function(err, data){
        if(err){
          $scope.loadingStatus = 'error';
        }else{
          $scope.loadingStatus = 'ok';
          $scope.data = data;
        }
      });
    }

    init();
  });
