'use strict';

/**
 * @ngdoc directive
 * @name derCleanApp.directive:person
 * @description
 * # person
 */
 angular.module('derCleanApp')
 .directive('person', function ($rootScope, $document) {
  	//slugify function, identical to the gspreadsheet script's one
  	function slugify(value) {

  		value = value.toLowerCase();
  		value = value.replace(/[^\w\s-]/g, '');
  		value = value.replace(/\s+/g, '-');

  		return value;
  	}
  	//find someone annuaire's id basing on her naturally spelled name and surname
  	function findInAnnuaire(text, annuaire){
  		for(var i in annuaire){
  			var name = annuaire[i].name;
  			if(slugify(text).indexOf(slugify(name)) > -1){
  				return annuaire[i].identifiant;
  			}
  		}
  	}
  	return {
      restrict: 'AE',//tagname or attribute
      link: function postLink(scope, element, attrs) {

      	//search the name of the person and try to make a link to it in the annuaire
      	$rootScope.$watch('annuaireData', function(){
      		if($rootScope.annuaireData){
      			var id = findInAnnuaire(element.text(), $rootScope.annuaireData);

      			if(id){
      				element.attr('id', id);
      				var html = element.html();
      				var a = angular.element('<a href="#membres/'+id+'">'+html+'</a>');
      				element.html('');
      				element.append(a);
      			}
      		}
      	})

      	element.on('mouseover', mouseover);
      	function mouseover(){
          var id = angular.element(element).attr('id');
      		//updating the active member id
      		if(id)
      			$rootScope.$broadcast('activeMemberId', id);
      		else $rootScope.$broadcast('activeMemberId', "");
      	}
      	element.on('mouseout', function(){
      		$document.off('mouseover', mouseover);
      		$rootScope.$broadcast('activeMemberId', "");
      	})
      }
  };
});
