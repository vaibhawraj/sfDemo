//Angular App Defined
//Author : Vaibhaw Raj
//Creation Date : 8th Dec 2015

define(function(){
	var app = angular.module("sfapp",[]);
	app.controller("menucontroller",function($scope){
		$scope.Name = "Vaibhaw Raj";
	});
	return app;
})