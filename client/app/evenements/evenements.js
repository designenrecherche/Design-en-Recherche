'use strict';

angular.module('designEnRechercheApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/evenements/:id?', {
        templateUrl: 'app/evenements/evenements.html',
        controller: 'EvenementsCtrl'
      });
  });
