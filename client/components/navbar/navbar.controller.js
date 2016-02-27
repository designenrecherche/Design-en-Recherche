'use strict';

angular.module('designEnRechercheApp')
  .controller('NavbarCtrl', function ($scope, $location, $timeout, $window) {
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
    }/*,
    {
      'title': '<span class="glyphicon glyphicon-search"></span>',
      'link': '/recherche',
      'id' : 'recherche'
    }*/
    ];

    $scope.brandPlaceHolder = "Design<br>En <br>recherche";


    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };


    $scope.formatQuickSearchResponse = function(data){
      var results = data.results;
      results = results.map(function(result){
        if(result.matchType === 'membre'){
          result.titre = result.context.Surname + '  '+result.context.Name;
        }else if(result.matchType === 'evenement'){
          result.titre = result.context.titre;
        }else{
          result.titre = result.context.title;
        }
        return result;
      });

      return results;
    }

    $scope.quickSearchChange = function(input){
      $scope.$parent.$parent.globalSearch = input;
      setTimeout(function(){
        $scope.$apply();
      })
    }

    $scope.newQuickSearch = function(input){
      if(!input){
        return;
      }
      var obj = input.originalObject;
      switch(obj.matchType){
        case 'evenement':
          $location.url('/evenements/' + obj.context.identifiant);
        break;

        case 'membre':
          $location.url('/membres/' + obj.context.identifiant);
        break;

        case 'page':
          $location.url('/' + obj.context.slug);
        break;
      }
      $scope.showSearch = false;
      $scope.$broadcast('angucomplete-alt:clearInput');
    }

    $scope.$watch('showSearch', function(s){
      if(s){
        $timeout(function(){
          var searchInput = document.getElementById('quick-search_value');
          searchInput.focus();
        });
      }
    });


    $scope.scrollAtTop = true;

    var evalScroll = function(){
      var top = windowEl.scrollTop();
      if(top < 100){
        $scope.scrollAtTop = true;
      }else{
        $scope.scrollAtTop = false;
      }
      setTimeout(function(){
        $scope.$apply();
      })
    }

    //I know, I should do that in a directive ...
    var windowEl = angular.element($window);
    windowEl.on('scroll', evalScroll);

    $scope.$on('$destroy', function(){
      windowEl.off('scroll', evalScroll);
    })
  });
