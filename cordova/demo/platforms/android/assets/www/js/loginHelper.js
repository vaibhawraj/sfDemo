//Desktop Salesforce Login Process
//Author : Vaibhaw Raj
//Creation Date : 7th Dec 2015
define(["json!appconfig","networkManager"],
	function(SFDC,nm){
	G.client = new forcetk.Client(SFDC.clientId,SFDC.loginUrl,SFDC.proxyUrl);
	//console.log($.cookie);
	var loginHandler = {
		login:function(){
			window.showPinScreen = false;
					var oauthPlugin = cordova.require("com.salesforce.plugin.oauth");
					// Call getAuthCredentials to get the initial session credentials
        			log.debug('getAuthCredential initiated. Waiting for response');
        			oauthPlugin.getAuthCredentials(
            		// Callback method when authentication succeeds.
	            	function (creds) {
		                // Create forcetk client instance for rest API calls
		                //var forceClient = new forcetk.Client(creds.clientId, creds.loginUrl);
		                //forceClient.setSessionToken(creds.accessToken, "v33.0", creds.instanceUrl);
		                //forceClient.setRefreshToken(creds.refreshToken);

		                // Call success handler and handover the forcetkClient
		                //successHandler(forceClient);
		                log.debug(creds);
		                var oauth = {
		                	access_token : creds.accessToken,
		                	instance_url : creds.instanceUrl,
		                	refresh_token : creds.refreshToken,
		                	userId : creds.userId,
		                	orgId : creds.orgId,
		                	id : creds.identityUrl
		                };
	                	G.sessionCallback(oauth);
	                	window.showPinScreen = false;
						window.setPinScreen = true;
	            	},
	            	function (error) {
	                	alert('Failed to authenticate user: ' + error);
	            	});
	            	return;
		},
		getAuthorizeUrl:function(loginUrl, clientId, redirectUri){
			return loginUrl+'services/oauth2/authorize?display=popup'+
			'&response_type=token&client_id='+escape(clientId)+
			'&redirect_uri='+escape(redirectUri);
		},
		sessionCallback:function(oauth){
					log.debug(oauth);
					G.oauth = oauth;
			    	$.cookie("access_token",oauth.access_token,1);
			    	$.cookie("instance_url",oauth.instance_url);
			    	log.debug('oauth.userId ',oauth.userId);
			    	if(typeof(oauth.userId)!=="undefined")
			    		$.cookie("userid",oauth.userId);
			    	else{	
						$.cookie("userid",oauth.id.split('/')[5]);
						log.debug('oauth.userId',oauth.id.split('/')[5]);
					}
					if(typeof(oauth.orgId)!=="undefined")
			    		$.cookie("orgid",oauth.orgId);
			    	else {
			    		$.cookie("orgid",oauth.id.split('/')[4]);
			    		log.debug('oauth.orgId',oauth.id.split('/')[4]);
			    	}
			    	$.cookie("refresh_token",oauth.refresh_token);
			    	$.cookie("identity_url",oauth.id);
			    	log.debug("AppScope.Identity value before resumeLoading " , appScope.identity);
			    	//TO-DO Check if appScope
			    	if(!_.isEmpty(appScope.identity)){ //If userid in app  is different from logged in user
			    		if(appScope.identity.user_id!=$.cookie('userid')) {
			    			appScope.identity = {};
			    		}
			    	}
			    	loginHandler.setForcetkAccessToken(oauth.access_token,oauth.instance_url,oauth.refresh_token);			    
		},
		setForcetkAccessToken:function(access_token,instance_url,refresh_token) {
			 //Sets access_token for forcetk client
			 G.client.setSessionToken(access_token, SFDC.api_version,
			            instance_url);
			 G.client.setRefreshToken(refresh_token);
			 //Since this process asynchronous therefore to resume and tell angular app to resume processing, scope.$apply() needs to call externally
		//	 angular.element('body')..resumeLoading();
			angular.element('body').scope().resumeLoading();
		},
		logout:function() {
			$.removeCookie('access_token');
			$.removeCookie('userid');
			$.removeCookie('orgid');
		}
	};
	window.loginHandler = loginHandler;
	G.sessionCallback = loginHandler.sessionCallback;
	return loginHandler;
});