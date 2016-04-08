//Login Controller
define(['loginHelper','helper/loader'],
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
			var path = '/id/' + $.cookie("orgid") + '/' + $.cookie("userid") + '/';
			log.info('Identity Path :'+path,'Info');

			client.ajaxUrl(path,function(response){

				log.info("Identity Response Object : ",'Detail');
				log.info(response,'Detail');

				$scope.identity=response;
				log.info($scope.identity);
				$scope.firstTime = true;
				if(typeof(appScope.identity)!=="undefined")
				{
					if(typeof(appScope.identity.user_id) !== "undefined")
					{
						if(appScope.identity.user_id == $scope.identity.user_id) {
							$scope.firstTime = false;
						}
					}
				}
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