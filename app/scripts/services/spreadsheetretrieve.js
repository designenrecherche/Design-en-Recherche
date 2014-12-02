'use strict';

/**
 * @ngdoc service
 * @name derCleanApp.SpreadsheetRetrieve
 * @description
 * # SpreadsheetRetrieve
 * Service in the derCleanApp.
 */
angular.module('derCleanApp')
.value('version', '0.1')
.factory('SpreadsheetRetrieve', function($resource, $http, $rootScope) {

    var factory = {};
    /*
    	k = key (url of the spreadsheet)
    	callback = callback function
		tab = either boolean or val to get all the tabs of a spreadsheet
		name = name to return along with the data in order to identify it
    */
    factory.getSpreadsheetTabletop = function(k, callback, tab, name) {


    	//tab argument handles the type of request to spreadsheet
    	//true = returns all the tabs
    	//String = returns the "tab" tab in the spreadsheet
    	//false/undefined = returns the first tab
    	if(tab){
    		//complex spreadsheet, you take everything
    		if(typeof tab === "boolean"){

    			Tabletop.init({
			        key: k,
			        callback: function(data, tabletop) {
			          if(callback && typeof(callback) === "function") {
			            $rootScope.$apply(function() {
			              return callback(data, name);
			            })
			          }
			        },
			        simpleSheet: tab,
			        parseNumbers: true
		      	});


    		//complex spreadsheet, you take just the tab name given as argument
    		}else{


    			Tabletop.init({
			        key: k,
			        callback: function(data, tabletop) {
			          if(callback && typeof(callback) === "function") {
			            $rootScope.$apply(function() {
			              return callback(data[tab+""], name);
			            })
			          }
			        },
			        simpleSheet: false,
			        parseNumbers: true
		      	});

    		}

    	//simple spreadsheet, you just take the first tab and let it go baby
    	}else{

    		Tabletop.init({
			        key: k,
			        callback: function(data, tabletop) {
			          if(callback && typeof(callback) === "function") {
			            $rootScope.$apply(function() {
			              return callback(data, name);
			            })
			          }
			        },
			        simpleSheet: false,
			        parseNumbers: true
		      	});

    	}
    }

    


    return factory;

});