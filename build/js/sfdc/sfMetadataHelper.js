define(['localDB','json!mapping','networkManager'],function(localDB,mapping,nm){
	var sfMetadataHelper = {
		init : function(){},
		getPicklistValues : function(field){
			log.debug(field);
			return ['Option 1','My Name is Khan','You are my hero','FOO'];
		}
	};
	if(_.isUndefined(window.sfDataMetadataHelper)){
		window.sfMetadataHelper = sfMetadataHelper;
	}
	return sfMetadataHelper;
});