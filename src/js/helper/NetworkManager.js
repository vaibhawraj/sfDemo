/*
*	name : NetworkManager.js
*	description : To Get Network information
*	author : Vaibhaw Raj(vaibhaw.raj@comprotechnologies.com)
*   created on : 11 April 2016
*/
define([],function(){
	return {
		getStatus : function() {
			/* @if NODE_ENV='development' */
				if(typeof(window.NetConnectivity) == "undefined") {
					window.NetConnectivity = false;
				}
				log.info('Net connectivity using window.NetConnectivity : ',window.NetConnectivity);
				return window.NetConnectivity;
			/* @endif
		}
	};
});