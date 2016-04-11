//homecontroller.js

define(function(){
	return function($scope){
		$scope.identity = appScope.identity;
		$scope.date = new Date();
		$scope.recordList = [];
		$scope.resume = function(){
			$scope.date = new Date();
			$scope.recordList = sfDataManager.query();
			$( "#outlet_forms" ).listview( "refresh" );
			$scope.identity = appScope.identity;
			log.info($scope.identity);
			$scope.$apply();
		}
		$scope.reRender = function(){
			$scope.$apply();
		}
		$scope.toggle =function(){
			
		}
	}
});