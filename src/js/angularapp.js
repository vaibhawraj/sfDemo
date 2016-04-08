//Angular App Defined
//Author : Vaibhaw Raj
//Creation Date : 8th Dec 2015

define(["loginController",
	"homeController",
	"menuController"],
	function(loginController,
		homeController,menuController){

		/*load all html pages*/
	var app = angular.module("sfapp",[]);
	//app.config(['$routeProvider',routeProvider]);
	app.controller("logincontroller",loginController);
	app.controller("homecontroller",homeController);
	app.controller("menucontroller",menuController);
	app.controller("listcontroller",menuController);
	app.controller("detailcontroller",menuController);
	app.controller("editcontroller",menuController);
	return app;
})