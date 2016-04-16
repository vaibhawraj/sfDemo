define(['localDB','json!mapping','networkManager'],function(localDB,mapping,nm){
	var sfMetadataHelper = {
		init : function(){},
		getPicklistValues : function(field){
			log.debug(field);
			if(field=='task_stage__c') {
				return ['Stage 1','Stage 2','Stage 3','Stage 4'];	
			}
			if(field=='Reason_for_Denied__c') {
				return ['Reason 1','Reason 2','Reason 3'];	
			}
			if(field=='City__c') {
				return ['Delhi','Mumbai','Calcutta'];		
			}
			if(field=='State__c') {
				return ['Delhi','Maharastra','West Bengal'];		
			}
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