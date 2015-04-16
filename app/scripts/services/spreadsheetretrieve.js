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
    	var callTabletop = function(callback, k, tabMode, tab, name){
    		Tabletop.init({
			        key: k,
			        callback: function(data, tabletop) {
			          if(callback && typeof(callback) === "function") {
			            $rootScope.$apply(function() {
			            	if(tab)
			            		return callback(data[tab], name);
			              	else 
			              		return callback(data, name);
			            })
			          }
			        },
			        simpleSheet: tabMode,
			        parseNumbers: true
		      	});
    	};
    	var tabMode = (typeof tab === 'boolean')? tab:false;
    	var tab = (typeof tab === 'string')? tab:undefined;
    	callTabletop(callback, k, tabMode, tab, name);
    };

    


    return factory;

});