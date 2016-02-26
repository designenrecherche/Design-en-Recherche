'use strict';

angular.module('designEnRechercheApp')
  .controller('MembresCtrl', function ($scope, $routeParams, apiService) {
    var init = function(){
      $scope.$parent.routeId = 'membres';
      $scope.membreId = $routeParams.id;
      if($scope.membreId){
        $scope.searchMembre = '';
        updateMembre($scope.membreId);
      }else{
        updateMembres();
      }
      setTimeout(function(){
        $scope.$apply();
      });
    }

    var updateMembre = function(id){
      $scope.loadingStatus = 'loading';
      apiService.getMembres(id, function(err, data){
        if(err){
          $scope.loadingStatus = 'error';
        }else{
          $scope.loadingStatus = 'ok';
          for(var i in data){
            var val = data[i];
            delete data[i];
            data[i.toLowerCase()] = val;
          }
          $scope.data = data;
        }
      });
    }

    var updateMembres = function(){
      $scope.loadingStatus = 'loading';
      console.log('getting membres');
      apiService.getMembres(undefined, function(err, data){
        if(err){
          $scope.loadingStatus = 'error';
        }else{
          $scope.loadingStatus = 'ok';
          $scope.data = data;
        }
      });
    }

    init();
  });
