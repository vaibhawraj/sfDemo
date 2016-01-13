//homecontroller.js

define(function(){
	return function($scope){
		$scope.tabs = appScope.tabs;
		$scope.userInfo = appScope.userInfo;
		$scope.resume = function(){
			$scope.tabs = appScope.tabs;
			$scope.userInfo = appScope.userInfo;
			console.log($scope.tabs);
			console.log($scope.userInfo);
			$scope.$apply();
		}
		$scope.toggle =function(){
			console.log(event);
			
		}
	}
});