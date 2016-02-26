'use strict';

angular.module('designEnRechercheApp')
  .factory('apiService', function ($http) {
    var baseUrl = '/api/',
        evenements = 'evenements/',
        membres = 'membres/',
        aPropos = 'a-propos/',
        contact = 'contact/',
        prochainsEvts = 'prochains-evenements/',
        search = 'search'
        factory = {};

    factory.getEvenements = function(id, callback){
      id = (id)?id:'';
      $http
        .get(baseUrl + evenements + id)
        .success(function(d){
          callback(undefined, d);
        })
        .error(function(e){
          callback(e, undefined);
        })
    };

    factory.getMembres = function(id, callback){
      id = (id)?id:'';
      $http
        .get(baseUrl + membres + id)
        .success(function(d){
          callback(undefined, d);
        })
        .error(function(e){
          callback(e, undefined);
        })
    };

    factory.getAPropos = function(callback){
      $http
        .get(baseUrl + aPropos)
        .success(function(d){
          callback(undefined, d);
        })
        .error(function(e){
          callback(e, undefined);
        })
    };

    factory.getContact = function(callback){
      $http
        .get(baseUrl + contact)
        .success(function(d){
          callback(undefined, d);
        })
        .error(function(e){
          callback(e, undefined);
        })
    };

    factory.getProchainsEvts = function(callback){
      $http
        .get(baseUrl + prochainsEvts)
        .success(function(d){
          callback(undefined, d);
        })
        .error(function(e){
          callback(e, undefined);
        })
    };

    factory.search = function(expression, callback){
      expression = encodeURIComponent(expression);
      $http
        .get(baseUrl + search + '?q=' + expression)
        .success(function(d){
          callback(undefined, d);
        })
        .error(function(e){
          callback(e, undefined);
        })
    };



    return factory;

  });
