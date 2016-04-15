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
					window.NetConnectivity = true;
				}
				log.info('Net connectivity using window.NetConnectivity : ',window.NetConnectivity);
				return window.NetConnectivity;
			/* @endif */
			/* @if NODE_ENV='apk' */
				/*Using navigator.connection plugin [Reference : https://github.com/apache/cordova-plugin-network-information]*/
				/*https://cordova.apache.org/docs/en/3.0.0/cordova/connection/connection.html*/
				if(typeof(window.NetConnectivity) == "undefined") {
					window.NetConnectivity = true;
				}
				if(typeof(navigator)!="undefined") {
					if(typeof(navigator.connection)!="undefined") {
						if(navigator.connection.type == Connection.NONE || navigator.connection.type == Connection.UNKNOWN) {
							window.NetConnectivity = false;
						}
						else {
							window.NetConnectivity = true;
						}
					}
					else {
						log.error('connection plugin is not defined');
					}
				} else { 
					log.error('navigator is not defined');
				}
				log.info('Net connectivity using window.NetConnectivity : ',window.NetConnectivity);
				return window.NetConnectivity;
			/* @endif */
			/* @if NODE_ENV='apk2' */
				if(typeof(window.NetConnectivity) == "undefined") {
					window.NetConnectivity = true;
				}
				log.info('Net connectivity using window.NetConnectivity : ',window.NetConnectivity);
				return window.NetConnectivity;
			/* @endif */
		}
	};
});