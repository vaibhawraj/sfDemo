//loadTabs Module
//Description : Retrieve List View For Sobject

define(['json!tabs','logger'],function(tabs,log){
	return {
		name:'Retrieve List View For',
		status: 'Loading List View',
		sObject: '',
		api_name:'',
		onlyFirstTime: false,
		method:function(client,callback,error){
			if(typeof(appScope)=="undefined" || typeof(appScope.sObjects)=="undefined") {
				log("appScope or appScope.sObjects is not defined","Error");
				throw "Fatal Error";
			}
			log("Calling api_name")
			client.describeListViews(api_name,function(response){

			},function(error){

			});
			callback(client);
		}
	};
});