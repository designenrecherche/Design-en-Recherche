'use strict';

angular.module('designEnRechercheApp')
  .controller('MasterCtrl', function ($scope, apiService, $location) {
    var init = function(){
      $scope.globalSearch = "";
      setTimeout(function(){
        $scope.$apply();
      });
    }

    var updateSearch = function(query){
      if(!query){
        return;
      }
      if(!$scope.searchWorking && query.length > 2){
        $scope.searchStatus = "loading";
        $scope.searchWorking = true;
        apiService.search(query, function(err, results){
          $scope.searchWorking = false;
          if(err){
            $scope.searchStatus = "error";
          }else{
            $scope.searchStatus = "ok";
            $scope.searchResults = results;
            setTimeout(function(){
              $scope.$apply();
            })
          }
        })
      }
    }

    $scope.$watch("globalSearch", updateSearch);

    $scope.goToSearchPage = function(){
      console.log('go to search');
      $location.path('/recherche').search('q', $scope.globalSearch);
    }

    init();
  });
