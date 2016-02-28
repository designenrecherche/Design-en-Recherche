'use strict';

angular.module('designEnRechercheApp')
  .controller('MainCtrl', function ($scope, apiService) {

    var init = function(){

      $scope.$parent.routeId = "main";

      $scope.twitterLoaded = false;

      //load intro text
      $scope.introStatus = 'loading';
      apiService.getIntroduction(function(err, intro){
        if(err){
          $scope.introStatus = 'error';
        }else{
          $scope.introStatus = 'ok';
          $scope.introContent = intro;
        }
      });

      //load next event
      $scope.evtsStatus = 'loading';
      apiService.getProchainsEvts(function(err, evts){
        if(err){
          $scope.evtsStatus = 'error';
        }else{
          $scope.evtsStatus = 'ok';
          $scope.prochainsEvts = evts;
        }
      });

      setTimeout(function(){
        $scope.$apply();
      })
    }

    init();
  });
