//Angular App Defined
//Author : Vaibhaw Raj
//Creation Date : 8th Dec 2015

define(["loginController",
	"homeController","listviewRender"],
	function(loginController,
		homeController,listviewRender){

		/*load all html pages*/
	var app = angular.module("sfapp",[]);
	//app.config(['$routeProvider',routeProvider]);
	app.controller("logincontroller",loginController);
	app.controller("homecontroller",homeController);
	app.directive("listviewRender",listviewRender);
	return app;
})