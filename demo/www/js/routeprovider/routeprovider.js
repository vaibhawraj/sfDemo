//Script Name : Route Provider (routeprovider.js)
//Author : Vaibhaw Raj
//Created Date : 14th December 2015
//Description : Configures navigational mapping with template.
//		To Map path with templates for AngularApp

define(function(){
	return function($routeprovider){
		$routeprovider
		.when('/',
			{
				templateUrl : "template/splash.html",
				controller: 'menucontroller'
			})
		.when('/home',
			{
				templateUrl : "template/home.html",
				controller: 'homecontroller'
			}
		);
	}
});
