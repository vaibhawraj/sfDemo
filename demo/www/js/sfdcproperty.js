//Salesforce Login Details
//Author : Vaibhaw Raj
//Created Date : 7th Dec 2015
console.log('Before of define');
define(function(){
	console.log('with in define');
	return {
		loginUrl : 'https://login.salesforce.com/',
		clientId : '3MVG9ZL0ppGP5UrATwJpA7dkv1tjJDE1.rh.ni1igPMGrnn6TZHCeSfRzpg8LEJRe9QiOCJKCQfcthn4ojD2S',
		redirectUri : 'http://localhost:8080/sfapp/oauthcallback.html',
		proxyUrl    : 'http://localhost:8080/sfapp/proxy.php?mode=native'
	};
});
console.log('Out of define');
/*var SFDC = {
		loginUrl : 'https://login.salesforce.com/',
		clientId : '3MVG9ZL0ppGP5UrATwJpA7dkv1tjJDE1.rh.ni1igPMGrnn6TZHCeSfRzpg8LEJRe9QiOCJKCQfcthn4ojD2S',
		redirectUri : 'http://localhost:8080/sfapp/oauthcallback.html',
		proxyUrl    : 'http://localhost:8080/sfapp/proxy.php?mode=native'
};*/