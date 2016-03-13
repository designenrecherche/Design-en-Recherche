'use strict';

angular.module('designEnRechercheApp')
  .controller('MasterCtrl', function ($scope, apiService, $location) {

    var init = function(){

      $scope.globalSearch = '';

      setTimeout(function(){
        $scope.$apply();
      });

      apiService.getMembres(undefined, function(err, data){
        if(data){
          $scope.membres = data;
          setTimeout(function(){
            $scope.$apply();
          });
        }
      });

      apiService.getReseaux(function(err, data){
        if(data){
          $scope.reseaux = data;
          setTimeout(function(){
            $scope.$apply();
          });
        }
      });
    };

    var updateSearch = function(query){
      if(!angular.isDefined(query)){
        return;
      }else if(!$scope.searchWorking && query.length > 2){
        $scope.searchStatus = 'loading';
        $scope.searchWorking = true;
        apiService.search(query, function(err, results){
          $scope.searchWorking = false;
          if(err){
            $scope.searchStatus = 'error';
          }else{
            $scope.searchStatus = 'ok';
            $scope.searchResults = results;
            setTimeout(function(){
              $scope.$apply();
            });
          }
        });
      }
    }

    $scope.goToSearchPage = function(){
      console.log('go to search');
      $location.path('/recherche').search('q', $scope.globalSearch);
    }

    $scope.$watch('globalSearch', updateSearch);



    init();
  });
