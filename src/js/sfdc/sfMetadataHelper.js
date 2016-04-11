define(['localDB','json!mapping','networkManager'],function(localDB,mapping,nm){
	var sfMetadataHelper = {
		init : function(){}
	};
	if(_.isUndefined(window.sfDataMetadataHelper)){
		window.sfMetadataHelper = sfMetadataHelper;
	}
	return sfMetadataHelper;
});