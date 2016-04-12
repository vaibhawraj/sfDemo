define(['localDB','json!mapping','networkManager'],function(localDB,mapping,nm){
	var sfMetadataHelper = {
		init : function(){},
		getPicklistValues : function(field){
			log.debug(field);
			return ['Option 1','My Name is Khan','You are my hero','FOO'];
		},
		getListOfDocument : function(section){
			if(section=='Documents') {
				return ["Paytm Sticker","QR Code Sticker"];
			} else if(section=='Attested Documents') {
				return ["POI","POA","Photo","Shop Photo"];
			} else {
				return ["POI","POA","FORM"];
			}
		}
	};
	if(_.isUndefined(window.sfDataMetadataHelper)){
		window.sfMetadataHelper = sfMetadataHelper;
	}
	return sfMetadataHelper;
});