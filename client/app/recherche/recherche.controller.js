'use strict';

angular.module('designEnRechercheApp')
  .controller('RechercheCtrl', function ($scope, apiService, $location) {
    var init = function(){
      $scope.$parent.routeId = 'recherche';

      var search = $location.search();
      var existing = search.q && $scope.$parent.globalSearch === search.q && $scope.$parent.searchStatus == 'ok' && $scope.$parent.searchResults;
      if(existing){
        $scope.searchResults = $scope.$parent.searchResults;
      }
      setTimeout(function(){
        $scope.$apply();
      })
    }

    var updateSearchResults = function(query){
      $scope.$parent.globalSearch = query;
      setTimeout(function(){
        $scope.$apply();
      });
    }

    $scope.updateLocalSearch = function(query){
      $location.search('q', query);
    }

    $scope.$watch(function(){
      return $location.search().q;
    }, updateSearchResults);

    init();
  });
