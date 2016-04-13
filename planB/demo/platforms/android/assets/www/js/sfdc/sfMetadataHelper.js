define(['localDB','json!mapping','networkManager'],function(localDB,mapping,nm){
	var sfMetadataHelper = {
		init : function(){},
		getPicklistValues : function(field){
			log.debug(field);
			return ['Option 1','Option 2','Option 3','Option 4'];
		},
		getListOfDocument : function(section){
			var lod = [];
			var docApis = [];
			if(section=="Documents") {
				docApis = ["paytmsticker","qrcode"];
			} else if(section=='Attested Documents') {
				docApis = ["apoi","apoa","aform"];
			} else {
				docApis = ["napoi","napoa","naphoto","nashopphoto"];
			}
			_.each(docApis,function(doc,index,list){
				var temp = _.findWhere(mapping.fields,{table_api:doc});
				log.debug(temp);
				if(_.isEmpty(temp)) {
					log.error('Cannot Find Field Information for ',doc);
				} else {
					lod.push(temp);
				}
			});
			log.debug(lod);
			return lod;
		}
	};
	if(_.isUndefined(window.sfDataMetadataHelper)){
		window.sfMetadataHelper = sfMetadataHelper;
	}
	return sfMetadataHelper;
});