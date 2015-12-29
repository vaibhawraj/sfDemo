//loadTabs Module
//Description : Retrieve Tab information Metadata

define(['json!tabs'],function(tabs){
	return {
		name:'Retrieve Tab Metadata',
		status: 'Loading Tab Metadata',
		firstTime: true,
		method:function(client,callback,error){
			client.ajax('/v34.0' + '/tabs', function(response){
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
			});
		}
	};
});