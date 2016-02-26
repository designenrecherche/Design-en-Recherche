'use strict';

angular.module('designEnRechercheApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/a-propos', {
        templateUrl: 'app/a-propos/a-propos.html',
        controller: 'AProposCtrl'
      });
  });
