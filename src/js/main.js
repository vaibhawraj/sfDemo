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
            $(window).resize(function(){
            	//To-Adjust height for ul element on newPage and detailView page
            	s=angular.element('body').scope();
            	if(_.isNull(s.$$phase))
            		s.$apply();
            });
            $("body").css('display','block');
		});
	//Load Configuration
		var temp = localStorage.getItem("appScope");
		log.debug("Loading appScope from localStorage");
		if(_.isEmpty(temp)) {
			appScope = require("json!appScope");
		} else {
			appScope = JSON.parse(temp);
		}

	//Initialize database
	require("sfDataManager").init();
	window.resumeLoading = false;
	require("ImageHelper");

	//Initialize
	window.deviceready = false;
	document.addEventListener("deviceready", function(){
		window.deviceready = true;
		window.ImageHelper.init();
		window.addEventListener("online",function(){
			log.info("App is now online");
			if(typeof angular != "undefined") {
				var scope = angular.element("body").scope();
				if(scope.$$phase==null) {
					scope.$apply();
				}
			}
		});
		window.addEventListener("offline",function(){
			log.info("App is now offline");
			if(typeof angular != "undefined") {
				var scope = angular.element("body").scope();
				if(scope.$$phase==null) {
					scope.$apply();
				}
			}
		});
		document.addEventListener("backbutton", function(){
			log.info("Exiting");
			if(confirm("Press ok to exit!")) {
				navigator.app.exitApp();
			}
		}, false);
		window.addEventListener("commit",function(){
			if(typeof angular != "undefined") {
				var scope = angular.element("body").scope();
				if(scope.$$phase==null) {
					scope.$apply();
				}
			}
			log.debug("Commit Event");
		});
	}, false);
	
	/* @if NODE_ENV='development' */
	cordova = {};
	document.dispatchEvent(new Event("deviceready"));
	window.deviceready = false;
	/* @endif */
	/**/
	//Initialize Angular
		require(['angularapp'],function(app){
			angular.bootstrap(document,["sfapp"]);
			if(window.resumeLoading) {
				angular.element('body').scope().resumeLoading();
			}
			//Load Login Screen //TO-DO
			require("loginHelper").login();
		});

});

