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
				fields.push('sync_status');
				localDB.createTable(mapping.table,fields);
				localDB.commit();
				log.info('Database Initialized');
			}
		},
		insert : function(rec){
			//Check for net connection
			//if(net is connected)
			var rec_uuid = localDB.insertRow(mapping.table,_.extend(rec,{sync_status:false,id:null}));
			localDB.commit();
			var that=this;
			G.client.create(
				mapping.sfObjectName,
				this.sfCreateRecord(rec),
				function(){
					that.insertSuccessHandler(arguments,rec_uuid);
				},
				function(){
					that.insertErrorHandler(arguments,rec_uuid);
				});

		},
		syncInsert : function(rec_uuid) {
			//Check for net connection
			//if(net is connected)
			G.client.create(
				mapping.sfObjectName,
				this.sfCreateRecord(rec),
				function(){
					that.insertSuccessHandler(arguments,rec_uuid);
				},
				function(){
					that.insertErrorHandler(arguments,rec_uuid);
				});
		},
		query : function(){},
		sfCreateRecord : function(rec){
			var sfobj = {lastname:rec.name};
			return sfobj;
		},
		insertSuccessHandler : function(arguments,rec_uuid){
			log.debug('Success Arguments',arguments);
			log.debug('Record ID',rec_uuid);
			log.debug(arguments[0]);
			if(localDB.updateRow(mapping.table,{uuid:rec_uuid,id:arguments[0].id}))
				localDB.commit();
		},
		insertErrorHandler : function(arguments,rec_uuid){

		}
	};
	window.sfDataManager = sfDataManager;
	return sfDataManager;
});
