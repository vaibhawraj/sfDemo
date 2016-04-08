/*
	Name : menuController.js
	Author : Vaibhaw Raj
	Description : Handles all the navigation and display for menu on side menu
	Created On : 23rd December 2015

*/

define(function(){
	return function($scope) {
		$scope.tabs = {};
		$scope.reRender = function(){
			$scope.tabs = appScope.tabs;
			$scope.$apply();
		}
	};
})