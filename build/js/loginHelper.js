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
			if($.cookie('access_token')){
				//USER already logged in

				//Initialize forceTkClient library
				G.client.setSessionToken($.cookie('access_token'),SFDC.api_version,$.cookie('instance_url'));
				G.client.setRefreshToken($.cookie('refresh_token'));

				window.showPinScreen = true;
				window.setPinScreen = false;
				window.resumeLoading = false;
				//Check for network connectivity

				if(nm.getStatus())
				{
					G.client.refreshAccessToken(function (oauthResponse) {
							$.cookie('access_token',oauthResponse.access_token,1)
							$.cookie('refresh_token',oauthResponse.refresh_token,1)
							loginHandler.setForcetkAccessToken(oauthResponse.access_token,oauthResponse.instance_url,$.cookie('refresh_token'));
	                },function(){
	                	console.log("Login Failure");
	                	$.removeCookie('access_token');
	                	loginHandler.login();	//Re-Try to Login
	                });
				} else {
					window.resumeLoading = true;
					if(!_.isUndefined(angular)){
						angular.element('body').scope().resumeLoading();
					}
				}
				
			}
			else{
				$('<div></div>').popupWindow({
					windowURL: loginHandler.getAuthorizeUrl(SFDC.loginUrl, SFDC.clientId, SFDC.redirectUri),
					windowName: 'Connect',
					centerBrowser: 1,
					height:524,
					width:675
				}).click();
				window.showPinScreen = false;
				window.setPinScreen = true;
				}
		},
		getAuthorizeUrl:function(loginUrl, clientId, redirectUri){
			return loginUrl+'/services/oauth2/authorize?display=popup'+
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
