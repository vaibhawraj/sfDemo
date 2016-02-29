/*
	Name : Logger
	LogLevels : All	--> Info, Detail, Debug, Error
*/
function log(message,level){
		var show=false;
		var logLevel = {
			All:["Info","Detail","Debug","Error"],
			Info:["Info"],
			Detail:["Info","Detail"],
			Debug:["Info","Detail","Debug"],
			Error:["Info","Error"]
		};
		try{
			if(typeof(loglevel)!='undefined') {
					_.each(logLevel,function(value,key,list){
						if(loglevel.toUpperCase() == key.toUpperCase()){
							_.each(value,function(val){
								if(val.toUpperCase() == level.toUpperCase()) {
									show=true;
								}
							})
						} 
					});
			}
			else {
				console.log('[logger.js] Log Level not defined');
			}
			if(show) {
				if(typeof(message)=="string")
				{
					console.log("["+level+"] "+message);
				}
				else {
					console.log("["+level+"] ");
					console.log(message);
				}
			}
		}
		catch(e){
			console.log(e);
		}
	};