//Angular App Defined
//Author : Vaibhaw Raj
//Creation Date : 8th Dec 2015

define(["loginController",
	"homeController"],
	function(loginController,
		homeController){

		/*load all html pages*/
	var app = angular.module("sfapp",[]);
	//app.config(['$routeProvider',routeProvider]);
	app.controller("logincontroller",loginController);
	app.controller("homecontroller",homeController);
	return app;
})