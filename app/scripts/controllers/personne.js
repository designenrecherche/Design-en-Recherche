'use strict';

/**
 * @ngdoc function
 * @name derCleanApp.controller:PersonneNameCtrl
 * @description
 * # PersonneNameCtrl
 * Controller of the derCleanApp
 */
angular.module('derCleanApp')
  .controller('PersonneNameCtrl', function ($scope, $routeParams, $rootScope) {

  	var slugActive = $routeParams.name;


  	$rootScope.$watch('annuaireData', function(){
    	if($rootScope.annuaireData){
    		$scope.membre = findMember(slugActive);
    		formatMembre();
    		console.log($scope.membre);
    	}
    		
    });

    function findMember(slug){
    	var d = $rootScope.annuaireData;
    	for(var i in d){
    		if(d[i].identifiant === slugActive)
    			return d[i];
    	}
    }

    function formatMembre(){
    	$scope.membre.site = $scope.membre['urlpersonalwebsiteaboutyourresearch'];
    	if($scope.membre.phonepublic){
    		if(($scope.membre.phonepublic+"").charAt(0) == '6')
    			$scope.membre.phonepublic = '+33' + $scope.membre.phonepublic;
    		else if(($scope.membre.phonepublic+"").charAt(0) == '0')
    			$scope.membre.phonepublic = '+33' + $scope.membre.phonepublic.substring(1, $scope.membre.phonepublic.length);
    	}

    	//sites
    	var sites= $scope.membre['urlotherwebsitesseparatedbycomasacademiatwitteretc.'].split(',');
    	var outputSites = [];
    	for(var i in sites){
    		var site = sites[i],out = {};
    		out.url = site.trim();
    		if(site.indexOf('facebook')> -1)
    			out.text = "Facebook";
    		else if(site.indexOf('twitter')> -1)
    			out.text = "Twitter";
    		else if(site.indexOf('linkedin')> -1)
    			out.text = "LinkedIn";
    		else if(site.indexOf('academia')> -1)
    			out.text = "Academia";
    		else out.text = site.trim();
    		outputSites.push(out);
    	}
    	$scope.membre.sites = outputSites;
    }

    $scope.pageClass = 'page-personne';


    $scope.contactVisible = function(){
    	if($scope.membre)
    	return $scope.membre["e-mailpublic"] != "" || $scope.membre.phonepublic != ""
    	|| $scope.membre.urlpersonalwebsiteaboutyourresearch != "";
    	else return false;
    }
  });
