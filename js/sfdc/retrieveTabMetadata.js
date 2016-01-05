//loadTabs Module
//Description : Retrieve Tab information Metadata

define(['json!tabs'],function(tabs){
	return {
		name:'Retrieve Tab Metadata',
		status: 'Loading Tab Metadata',
		onlyFirstTime: false,
		method:function(client,callback,error){
			client.SOAP.describeTabs(function(response){
				for (app in response.result)
				{
					if(response.result[app].selected == "true") {
						break;
					}
				}
				appScope.tabs = [];
				console.log(response.result[app]);
				for ( rt in response.result[app].tabs)
				{
					appScope.tabs.push(response.result[app].tabs[rt]);
					console.log(response.result[app].tabs[rt].label);
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