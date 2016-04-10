/*
	File Name : Import.js
	Author : Vaibhaw Raj
	Created On : 10th Dec 2015
	Description : Import.js is entry point. RequireJS loads import.js. It configures require js and describe name for paths and dependencies.
	Finally, Loads the main.js module.

	Details :
		require.config have following three key :
				baseUrl : All the location of other module is defined relative to this path and this path is relative to location of this file

				paths : paths defines short name for location of module and also helps in updating new js versions. For example, version of jquery is defined once in this file and it will be propagated to whole project. Note : It only defines short name, it doesnot load module/js file

				shim : it defines the dependency of one module on another. It ensure that all dependencies are met
*/
require.config({
    baseUrl : "js",
    paths: {
        
        //Library
        "text" : "../lib/requirejs/text",
        "json" : "../lib/requirejs/json",
        "jquery" : "../lib/jquery/jquery-1.12.3",
        "jquerymobile" : "../lib/jquery-mobile/jquery.mobile-1.4.5",
        "angular" : [ "../lib/angularjs/angular.min",
        			"https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0-beta.2/angular"],
        "angular-route" : "../lib/angularjs/angular-route.min",
        "jquerycookie" : "helper/j.cookie.mod",
        "jquerypopupwindow" : "../lib/jquery-popup/jquery.popupWindow",
        "underscore" : ["../lib/underscore/underscore",
        				"../lib/underscore/underscore-min"],
        "xml2json" : "../lib/xml2json/xml2json",
        "forcetkextn" : "../lib/forcetk/forcetkextn",

        //Custom Library
        "localDB" : "localDB/localDB",

        //Salesforce Library
        "sfDataManager" : "sfdc/sfDataManager",
        //Angular Controller
        "loginController" : "controller/loginController",
        "homeController" : "controller/homeController",
        "menuController" : "controller/menuController",

        //Route Provider - Depreciated
        "routeProvider" : "routeprovider/routeprovider",

        //JSON CONFIG Files
        "appScope" : "../config/appScope.json",
        "appconfig" : "../config/appconfig.json",
        "mapping" : "../config/sfObjectMapping.json",
        //Helper
        "logger" : "helper/logger"
    },
    shim:{
    	"main":{
    		deps:["jquery"]
    	},
    	"angularapp" :{
    		deps:["angular"]
    	},
    	"angular-route" : {
    		deps:["angular"]
    	},
    	"loginHelper" : {
    		deps:["jquery","jquerycookie","jquerypopupwindow"],
    		exports:"loginHandler"
    	},
    	"loginController" : {
    		deps:["jquery","jquerycookie","jquerypopupwindow"]
    	},
    	"jquery" : {
    		exports:"jQuery"
    	},
    	"jquerypopupwindow" : {
    		deps:["jquery"]
    	},
    	"jquerymobile" : {
    		deps:["jquery"]
    	},
    	"forcetkextn" : {
    		deps:["xml2json"]
    	},
        "localDB" : {
            deps:["underscore"]  
        }
    }
});

//requirejs loads js file in global aspects. Dev Note: Include only those files which are required in global space
requirejs(["xml2json","forcetkextn","underscore","jquerymobile","logger","localDB","sfDataManager"]);
//require loads a module and execute callback method once module is load
require(["main"],function(){log.info("All Script Loaded");});
