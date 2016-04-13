/*
<<<<<<< HEAD
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
 		INFO:-1,
 		LOG:5,
 		ALL:6
 	};
 	this.LogLevel=this.Level.ALL;
 	var that = this;
 	this.parseError = function(){
 		var err = Error();
 		var stack = err.stack;
 		var fname = stack.split('\n')[4];
 		return fname.substr(fname.lastIndexOf('/')+1);
 	};
 	this.debug=function(){
 		if(that.LogLevel >= that.Level.DEBUG) {
 			var message = '';
 			for(i=0;i<arguments.length;i++){
 				if(i!=0)
 					message = message + ',';
 				message = message + 'arguments['+i+']';
 			}
 			eval('console.debug(\'[Debug ' + that.parseError() + ']\','+message+');');
 		}
 	}
 	this.error=function(){
 		if(that.LogLevel >= that.Level.ERROR) {
 			var message = '';
 			for(i=0;i<arguments.length;i++){
 				if(i!=0)
 					message = message + ',';
 				message = message + 'arguments['+i+']';
 			}
 			eval('console.error(\'[Error ' + that.parseError() + ']\','+message+');');
 		}	
 	}
 	this.warn=function(){
 		if(that.LogLevel >= that.Level.WARN) {
 			var message = '';
 			for(i=0;i<arguments.length;i++){
 				if(i!=0)
 					message = message + ',';
 				message = message + 'arguments['+i+']';
 			}
 			eval('console.warn(\'[Warn ' + that.parseError() + ']\','+message+');');
 		}	
 	}
 	this.info=function(){
 		if(that.LogLevel == that.Level.INFO || that.LogLevel == that.Level.ALL) {
 			var message = '';
 			for(i=0;i<arguments.length;i++){
 				if(i!=0)
 					message = message + ',';
 				message = message + 'arguments['+i+']';
 			}
 			eval('console.info(\'[Info ' + that.parseError() + ']\','+message+');');
 		}	
 	}
 	this.log=function(){
 			var message = '';
 			for(i=0;i<arguments.length;i++){
 				if(i!=0)
 					message = message + ',';
 				message = message + 'arguments['+i+']';
 			}
 			eval('console.log(\'[Log ' + that.parseError() + ']\','+message+');');
 	}
 	return this;
 }
