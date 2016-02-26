'use strict';

angular.module('designEnRechercheApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/membres/:id?', {
        templateUrl: 'app/membres/membres.html',
        controller: 'MembresCtrl'
      });
  });
