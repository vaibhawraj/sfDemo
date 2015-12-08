//main.js
//Author : Vaibhaw Raj
//Creation Date : 7th Dec 2015
//Description : Beginning of Javascript execution


define(function(require){
	//Import Depedencies
		var loginHandler = require('browser-login');
	//Login
		loginHandler.login();
	//Load Configuration
	//Render
		require(['angularapp'],function(app){
			angular.bootstrap(document,["sfapp"]);
		});
	//Initialize Angular

	//Add Controller and Other Functionality
});

