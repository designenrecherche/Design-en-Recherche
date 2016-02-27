'use strict';

angular.module('designEnRechercheApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'angucomplete-alt',
  'angularytics'
])
  .config(function ($routeProvider, $locationProvider, AngularyticsProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);

    AngularyticsProvider.setEventHandlers([/*'Console',*/ 'GoogleUniversal']);
  }).run(function(Angularytics) {
    Angularytics.init();
  });
