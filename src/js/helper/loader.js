//LoaderQueue
define(['sfdc/retrieveTabMetadata'],
	function(retrieveTabMetadata){
		var queue = [
			retrieveTabMetadata
		];
		return queue;
});