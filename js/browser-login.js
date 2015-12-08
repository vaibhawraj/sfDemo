//Desktop Salesforce Login Process
//Author : Vaibhaw Raj
//Creation Date : 7th Dec 2015

var browserLogin = true;
var loginHandler = {
	login:function(){
		if($.cookie('access_token')){
			loginHandler.setForcetkAccessToken($.cookie('access_token'),$.cookie('instance_url'));
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
		
		    	$.cookie("access_token",oauth.access_token);
		    	$.cookie("instance_url",oauth.instance_url);
		    	loginHandler.setForcetkAccessToken(oauth.access_token,oauth.instance_url);
		    
	},
	setForcetkAccessToken:function(access_token,instance_url) {
		 client.setSessionToken(access_token, null,
		            instance_url);
	}
};