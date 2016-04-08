//Desktop Salesforce Login Process
//Author : Vaibhaw Raj
//Creation Date : 7th Dec 2015
define(["json!appconfig"],
	function(SFDC){
	G.client = new forcetk.Client(SFDC.clientId,SFDC.loginUrl,SFDC.proxyUrl);
	//console.log($.cookie);
	var loginHandler = {
		login:function(){
			if($.cookie('access_token')){
				G.client.setSessionToken($.cookie('access_token'),SFDC.api_version,$.cookie('instance_url'));
				G.client.setRefreshToken($.cookie('refresh_token'));
				G.client.refreshAccessToken(function (oauthResponse) {
						$.cookie('access_token',oauthResponse.access_token,1)
						loginHandler.setForcetkAccessToken(oauthResponse.access_token,oauthResponse.instance_url,$.cookie('refresh_token'));
                },function(){
                	console.log("Login Failure");
                	//$.removeCookie('access_token');
                	loginHandler.login();
                });
			}
			else{
				
				$('<div></div>').popupWindow({
					windowURL: loginHandler.getAuthorizeUrl(SFDC.loginUrl, SFDC.clientId, SFDC.redirectUri),
					windowName: 'Connect',
					centerBrowser: 1,
					height:524,
					width:675
				}).click();
			}
		},
		getAuthorizeUrl:function(loginUrl, clientId, redirectUri){
			return loginUrl+'services/oauth2/authorize?display=popup'+
			'&response_type=token&client_id='+escape(clientId)+
			'&redirect_uri='+escape(redirectUri);
		},
		sessionCallback:function(oauth){
					console.log(oauth);
					G.oauth = oauth;
			    	$.cookie("access_token",oauth.access_token,1);
			    	$.cookie("instance_url",oauth.instance_url);
			    	$.cookie("userid",oauth.id.split('/')[5]);
			    	$.cookie("orgid",oauth.id.split('/')[4]);
			    	$.cookie("refresh_token",oauth.refresh_token);
			    	loginHandler.setForcetkAccessToken(oauth.access_token,oauth.instance_url,oauth.refresh_token);
			    
		},
		setForcetkAccessToken:function(access_token,instance_url,refresh_token) {
			 //Sets access_token for forcetk client
			 G.client.setSessionToken(access_token, SFDC.api_version,
			            instance_url);
			 G.client.setRefreshToken(refresh_token);
			 //Since this process asynchronous therefore to resume and tell angular app to resume processing, scope.$apply() needs to call externally
			 var scope = angular.element($("#load")).scope();
			 scope.resume(G.client);
		}
	};
	G.sessionCallback = loginHandler.sessionCallback;
	return loginHandler;
});
