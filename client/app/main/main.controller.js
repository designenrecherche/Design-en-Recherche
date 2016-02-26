'use strict';

angular.module('designEnRechercheApp')
  .controller('MainCtrl', function ($scope, apiService) {

    var init = function(){

      $scope.$parent.routeId = "main";

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

    var mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    $scope.prettyDate = function(date){
      date = date && new Date(date);
      var ok = date.getMonth;
      if(!ok){
        return 'Date à définir';
      }else{
        var month = mois[date.getMonth()];
        var day = date.getDate();
        return day + ' ' + month + ' ' + date.getFullYear();
      }
    }

    init();
  });
