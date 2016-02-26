'use strict';

angular.module('designEnRechercheApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/recherche', {
        templateUrl: 'app/recherche/recherche.html',
        controller: 'RechercheCtrl',
        reloadOnSearch: false
      });
  });
