define(['localDB','json!mapping','networkManager'],function(localDB,mapping,nm){
	var sfMetadataHelper = {
		init : function(){},
		getPicklistValues : function(field){
			log.debug(field);
			return ['Option 1','Option 2','Option 3','Option 4'];
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