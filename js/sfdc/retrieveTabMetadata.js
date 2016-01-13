//loadTabs Module
//Description : Retrieve Tab information Metadata

define(['json!tabs'],function(tabs){
	return {
		name:'Retrieve Tab Metadata',
		status: 'Loading Tab Metadata',
		onlyFirstTime: true,
		method:function(client,callback,error){
			client.SOAP.describeTabs(function(response){
				var app = {};
				if(typeof(response.result.length)!=="number") {
					console.log(response.result);
					throw "Error: response.result is "+typeof(response.result)+".It is suppossed to be Array";
				}
				var app = _.find(response.result,function(app){return (app.selected=="true");});
				appScope.tabs = [];
				if(typeof(app)==="undefined") {
					throw "[retrieveTabMetadata.js] No App Founded";
				}
				if(typeof(app.tabs.length)!=="number") {
					appScope.tabs.push(app.tabs);
				}
				else {
					_.each(app.tabs,function(tab){
						if(tab.sobjectName == "") {
							return;
						}
						appScope.tabs.push(tab);
					});
				}
				localStorage.setItem("appScope",JSON.stringify(appScope));
				callback(client);
			},function(error){
				console.log(error.responseJSON[0]);
			});
			/*client.ajax('/v34.0' + '/tabs', function(response){
				for ( rt in response)
				{
					for ( t in tabs) {
						if(response[rt].sobjectName == tabs[t].objRef && tabs[t].sfobject == true) {
							appScope.tabs.push(response[rt]);
							console.log(response[rt].sobjectName);
						}
					}
				}
				localStorage.setItem("appScope",JSON.stringify(appScope));
				callback(client);
			},function(error){
				console.log(error.responseJSON[0]);
				//callback(client);
			});*/
		}
	};
});