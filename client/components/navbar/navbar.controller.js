'use strict';

angular.module('designEnRechercheApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [
    {
      'title': 'Accueil',
      'link': '/',
      'id' : 'main'
    },{
      'title': 'Évènements',
      'link': '/evenements/',
      'id' : 'evenements'
    },
    {
      'title': 'Annuaire',
      'link': '/membres/',
      'id' : 'membres'
    },
    {
      'title': 'Contact',
      'link': '/contact/',
      'id' : 'contact'
    },
    {
      'title': 'À propos',
      'link': '/a-propos/',
      'id' : 'a-propos'
    },
    {
      'title': '<span class="glyphicon glyphicon-search"></span>',
      'link': '/recherche',
      'id' : 'recherche'
    }];


    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
