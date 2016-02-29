//Login Controller
define(['browser-login','helper/loader'],
	function(loginHandler,queue){
	return function($scope){
		$scope.status = "Login Done";
		$scope.greetings = "";
		$scope.status = "";
		$scope.identity = {};
		$scope.userLocation = "";
		$scope.queue = queue;
		console.log($scope.queue);
		$scope.cur = 0;
		$scope.firstTime = true;
		$scope.resume = function(client) {
			//Dev Note : scope.$$phase ensure that $apply is not already in progress as
			/*
				Load User Info
				Load Organisation Info
				Load Tabs
				Load SObject Metadata
			*/
<<<<<<< HEAD // TO-DO
			var userInfoQuery = "SELECT Id, FirstName,LastName, State, Country FROM USER WHERE ID = '"+ $.cookie("userid") +"'";
			console.log("[loginController.js] User Info Query : " + userInfoQuery);
			client.query(userInfoQuery,function(response){
				$scope.userInfo=response.records[0];
				if(typeof(appScope.userInfo.Id) !== "undefine" && appScope.userInfo.Id == $scope.userInfo.Id) {
=======
			var path = '/id/' + $.cookie("orgid") + '/' + $.cookie("userid") + '/';
			log('Identity Path :'+path,'Info');

			client.ajaxUrl(path,function(response){

				log("Identity Response Object : ",'Detail');
				log(response,'Detail');

				$scope.identity=response;
				if(typeof(appScope.identity.user_id) !== "undefine" && appScope.identity.user_id == $scope.identity.user_id) {
>>>>>>> loadMetadata
					$scope.firstTime = false;
				}
				else $scope.firstTime = true;
				appScope.identity = response;
				localStorage.setItem("appScope",JSON.stringify(appScope));

				$scope.greetings = $scope.identity.display_name;
				$scope.status = "Hi " + $scope.greetings + "!";
				$scope.status += ($scope.firstTime)?"Let me configure your app for first time":"Loading";

			 	if(!$scope.$$phase) {
			 		$scope.$apply();
			 	}
			 	$scope.cur = 0;
			 	$scope.beginLoading(client);
			},function(error){console.log(error);
				console.log(error.responseJSON[0].errorCode);
				if(error.responseJSON[0].errorCode == "INVALID_SESSION_ID") {
					$.removeCookie('access_token');
					loginHandler.login();
				}});
		}
		$scope.beginLoading = function(client) {
			if($scope.cur < $scope.queue.length)
			{
				if($scope.firstTime) {
						console.log($scope.queue[$scope.cur].status);
						$scope.queue[$scope.cur].method(client,$scope.callback,$scope.errorfn);
				}
				else {
					if(!$scope.queue[$scope.cur].onlyFirstTime) { //Only Those who is not for onlyFirstTime
						console.log($scope.queue[$scope.cur].status);
						$scope.queue[$scope.cur].method(client,$scope.callback,$scope.errorfn);
					}
					else $scope.callback(client);
				}
			}
			else {
				console.log("redirecting to actual page");
				angular.element("#home").scope().resume();
				angular.element("#menupanel").scope().reRender();
				location.href = "#home";
				
			}
		}
		$scope.callback = function(client) {
				$scope.cur = $scope.cur + 1;
				$scope.beginLoading(client);
		}
		$scope.error = function(client) {
				//Error Handling Code
				console.log("Develop Error Handling Code");
		}
		loginHandler.login();
	}
});