This project is created with Cordova using manual methods.
Steps are : 
Step I : Cordova Version
	$ cordova -v
	4.3.0

Step II : Create Project
	Syntax:
		cordova create <appName> <packageName> <appName>
	Example:
	$ cordova create appone com.custom.appone appone


Step III : Change Directory to appDir
	$ cd appone

Step IV : Add android platform
	Syntax:
		cordova platform add android@<cordovaPlatformVersion>
	Example:
	$ cordova platform add android@3.6.4

Step V : Add Salesforce plugin
	Syntax:
		cordova plugin add <plugin_name>
	Example:
	$ cordova plugin add https://github.com/forcedotcom/SalesforceMobileSDK-CordovaPlugin

	Alternate Way: In customApp folder
	$ git clone https://github.com/forcedotcom/SalesforceMobileSDK-CordovaPlugin
	$ git clone https://github.com/forcedotcom/PushPlugin
	$ cordova plugin add PushPlugin
	$ cordova plugin add SalesforceMobileSDK-CordovaPlugin
Step VI: Remove www folder
	$ rm -rf www/*

Step VII: Copy www folder from userList
	$ cp -R /usr/local/lib/node_modules/forcedroid/external/shared/samples/userList/* www/

Step VIII: Overwrite bootconfig file in www folder with
	$ vim www/bootconfig.json
	{
  "remoteAccessConsumerKey": "3MVG9ZL0ppGP5UrATwJpA7dkv1t5KUC_IO49hwGCrLifucumGq.mmxZPOjbg59RUsQXtqrM8Xi_uOfsW_zUYj",
  "oauthRedirectURI": "trailheadapp://auth/success",
  "oauthScopes": [
    "web",
    "api"
  ],
  "isLocal": true,
  "startPage": "index.html",
  "errorPage": "error.html",
  "shouldAuthenticate": true,
  "attemptOfflineLoad": false,
  "androidPushNotificationClientId": ""
}


Step IX : Prepare Project
	$ cordova prepare android

Step X : 
To use your new application in Eclipse, do the following:' + outputColors.reset,
         '   - Go to File -> Import... ',
         '   - Choose Android -> Existing Android Code into Workspace, and click Next >',
         '   - For the root directory, browse to the customApp folder',
         '   - Pick the following projects:
		appone/platforms/android,
		appone/platforms/android/CordovaLib,
		appone/plugins/com.salesforce/android/libs/SmartSync,
		appone/plugins/com.salesforce/android/libs/SmartStore,
		appone/plugins/com.salesforce/android/libs/SalesforceSDK',
         '   - Click Finish',
         '   - Run your application by right-clicking the appone project in Project Explorer, and choosing Run As -> Android Application',
