//homecontroller.js

define(function(){
	return function($scope){
		$scope.tabs = appScope.tabs;
		$scope.identity = appScope.identity;
		$scope.date = new Date();
		$scope.resume = function(){
			$scope.tabs = appScope.tabs;
			$scope.identity = appScope.identity;
			log.info($scope.identity);
			console.log($scope.identity);
			$scope.$apply();
		}
		$scope.toggle =function(){
			console.log(event);
			
		}
	}
});