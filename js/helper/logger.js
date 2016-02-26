/*
 *	Name : logger.js
 *	Description : Log Levels	Description
 					OFF			No Display
 					Error		Only Errors will be display
 					Warn		Warnings will be displayed
 					Debug		Debug
 					Info		Information Will be displayed
 					Log 		Log will be displayed
 					All

 */

var log = new function(){
	this.Level={
 		OFF:0,
 		ERROR:1,
 		WARN:2,
 		DEBUG:3,
 		INFO:4,
 		LOG:5,
 		ALL:6
 	};
 	this.LogLevel=this.Level.OFF;
 	var that = this;
 	this.parseError = function(){
 		var err = Error();
 		var stack = err.stack;
 		var fname = stack.split('\n')[4];
 		return fname.substr(fname.lastIndexOf('/')+1);
 	};
 	this.debug=function(message){
 		if(that.LogLevel >= that.Level.DEBUG) {
 			console.debug('[Debug ' + that.parseError() + ']',message);
 		}
 	}
 	this.error=function(message){
 		if(that.LogLevel >= that.Level.ERROR) {
 			console.error('[Error ' + that.parseError() + ']',message);
 		}	
 	}
 	this.warn=function(message){
 		if(that.LogLevel >= that.Level.WARN) {
 			console.warn('[Warn ' + that.parseError() + ']',message);
 		}	
 	}
 	this.info=function(message){
 		if(that.LogLevel >= that.Level.INFO) {
 			console.info('[Info ' + that.parseError() + ']',message);
 		}	
 	}
 	this.log=function(message){
 		if(that.LogLevel >= that.Level.LOG) {
 			console.log('[UserLog ' + that.parseError() + ']',message);
 		}	
 	}
 	return this;
 }