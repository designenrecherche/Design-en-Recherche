'use strict';

angular.module('designEnRechercheApp')
  .controller('EvtCartel', function ($scope, $location) {
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

  });
