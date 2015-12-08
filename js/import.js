//requireconfig.js
require.config({
    baseUrl : "js",
    paths: {
        "sfdc" : "../js/sfdcproperty",
        "text" : "../lib/requirejs/text",
        "json" : "../lib/requirejs/json",
        "jquery" : "../lib/jquery/jquery",
        "angular" : "https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0-beta.2/angular",
        "jquerycookie" : "../lib/jquery-cookie/jquery.cookie",
        "jquerypopupwindow" : "../lib/jquery-popup/jquery.popupwindow",
        "appconfig" : "../config/appconfig.json",
        "tabs" : "../config/tabs.json",
    },
    shim:{
    	"angularapp" :{
    		deps:["angular"]
    	},
    	"browser-login" : {
    		deps:["jquery","jquerycookie","jquerypopupwindow"]
    	}
    }
});

require(["main"],function(){console.log("All Script Loaded");});