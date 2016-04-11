//main.js
//Author : Vaibhaw Raj
//Creation Date : 7th Dec 2015
//Description : Beginning of Javascript execution

define(function(require){
	//Import Depedencies
		//var loginHandler = require('browser-login');

		require(['jquerymobile'],function(mobile){
    		$.mobile.linkBindingEnabled = false;
    		$.mobile.hashListeningEnabled = false;
    		$.mobile.ajaxLinksEnabled = false;
            $.mobile.ajaxFormsEnabled = false;
		});
	//Load Configuration
		var temp = localStorage.getItem("appScope");
		log.debug("Loading appScope from localStorage");
		appScope = (temp == null)?require("json!appScope"):JSON.parse(temp);

	//Initialize database
	require("sfDataManager").init();
	
	//Load Login Screen //TO-DO
	require("loginHelper").login();

	//Initialize Angular
		require(['angularapp'],function(app){
			angular.bootstrap(document,["sfapp"]);
		});

});

