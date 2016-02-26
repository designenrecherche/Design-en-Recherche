'use strict';

angular.module('designEnRechercheApp')
  .controller('ContactCtrl', function ($scope, apiService) {
    var init = function(){
      $scope.$parent.routeId = 'contact';

      //load intro text
      $scope.reseauxStatus = 'loading';
      apiService.getReseaux(function(err, reseaux){
        if(err){
          $scope.reseauxStatus = 'error';
        }else{
          $scope.reseauxStatus = 'ok';
          $scope.reseaux = reseaux;
        }
      });

      //load next event
      $scope.contactStatus = 'loading';
      apiService.getContact(function(err, contact){
        if(err){
          $scope.contactStatus = 'error';
        }else{
          $scope.contactStatus = 'ok';
          $scope.contact = contact;
          console.info('contact', contact);
        }
      });


      setTimeout(function(){
        $scope.$apply();
      })
    }

    init();
  });
