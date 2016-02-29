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
		log("Loading appScope from localStorage","Detail");
		appScope = (temp == null)?require("json!appScope"):JSON.parse(temp);
		log.debug(appScope.tabs);
	//Render
		var splashHtml = require("text!../template/splash.html");
		var homeHtml = require("text!../template/home.html");
		var menuHtml = require("text!../template/menu.html");
		$("#splash").html(splashHtml);
		$("#home").html(homeHtml);
		$("#menupanel").html(menuHtml);

	//Initialize Angular
		require(['angularapp'],function(app){
			angular.bootstrap(document,["sfapp"]);
		});

});

