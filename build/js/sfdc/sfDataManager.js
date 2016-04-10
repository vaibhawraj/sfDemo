/*
	Name : sfDataManager.js
	Description : Manages connection between salesforce and localDB
	Author : Vaibhaw Raj (vaibhaw.raj@comprotechnologies.com)
	Created On : Apr 11, 2016
*/
define(['localDB','json!mapping'],function(localDB,mapping){
	var sfDataManager = {
		init : function(){
			localDB.openDatabase('sfData');
			if(!localDB.isTableExist('outlet')) {
				var fields = [];
				_.each(mapping.fields,function(field,index,list){
					fields.push(field.table_api);
				});
				localDB.createTable('outlet',fields);
				localDB.commit();
				log.info('Database Initialized');
			}
		},
		insert : function(){},
		query : function(){}
	};
	window.sfDataManager = sfDataManager;
	return sfDataManager;
});
