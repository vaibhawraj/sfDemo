/*
	Name : sfDataManager.js
	Description : Manages connection between salesforce and localDB
	Author : Vaibhaw Raj (vaibhaw.raj@comprotechnologies.com)
	Created On : Apr 11, 2016
*/
define(['localDB','json!mapping','networkManager'],function(localDB,mapping,nm){
	var sfDataManager = {
		init : function(){
			//Initialize local database. It must be executed once after authentication
			localDB.openDatabase('sfData');

			//Creates Table, if not exist
			if(!localDB.isTableExist('outlet')) {
				var fields = [];
				//Pick mapped field
				_.each(mapping.fields,function(field,index,list){
					fields.push(field.table_api);
				});

				//Maintain sync information
				fields.push('sync_status'); //Not Synced,In Progress, Synced, Failed
				fields.push('sfdc_error'); //If sync_status failed then sfdc_error message
				
				localDB.createTable(mapping.table,fields);
				localDB.commit();

				log.info('Outlet Initialized');
			} else {
				//Workaround for Issue at Line 57:
				var RecordList = localDB.queryRow(mapping.table);
				var updateStatus = false;
				_.each(RecordList,function(record,index,list){
					if(record.sync_status == "In Progress") {
						updateStatus = true;
						localDB.updateRow(mapping.table,{uuid:record.uuid,sync_status:"Not Synced"});
					}
				});
				if(updateStatus) localDB.commit();
			}
			if(!localDB.isTableExist('attachments')) {
				var localfields = [];
				//Pick mapped field
				//log.debug('Attachment fields',fields);
				_.each(mapping.attachments,function(field,index,list){
					localfields.push(field.table_api);
				});
				//log.debug('Attachment fields',fields);
				//Maintain sync information
				localfields.push('sync_status'); //Not Synced,In Progress, Synced, Failed
				localfields.push('sfdc_error'); //If sync_status failed then sfdc_error message
				
				localDB.createTable('attachments',localfields);
				localDB.commit();

				log.info('Attachments Initialized');
			} else {
				//Workaround for Issue at Line 57:
				var RecordList = localDB.queryRow('attachments');
				var updateStatus = false;
				_.each(RecordList,function(record,index,list){
					if(record.sync_status == "In Progress") {
						updateStatus = true;
						localDB.updateRow(mapping.table,{uuid:record.uuid,sync_status:"Not Synced"});
					}
				});
				if(updateStatus) localDB.commit();
			}
		},
		insert : function(rec,attachments){
			//Insert record regardless of net connectivity in localDB
			var rec_uuid = localDB.insertRow(mapping.table,_.extend(rec,{sync_status:"Not Synced",id:null,sfdc_error:null}));
			log.debug('Look out for attachmemt',attachments);
			if(!_.isUndefined(attachments) & _.isArray(attachments)){
				_.each(attachments,function(attachment,index,attachments){
					localDB.insertRow('attachments',_.extend(attachment,{relateduuid:rec_uuid,sync_status:"Not Synced",id:null,sfdc_error:null}));					
					log.info('Attachment inserted');
				});
			}
			localDB.commit();

			//Fire asynchronous call to Server
			this.asyncInsert(rec_uuid);
			log.info('Record with uuid ',rec_uuid,'has been queued');
		},
		asyncInsert : function(rec_uuid) {
			//Check for net connection
			if(nm.getStatus()) {
				var recList = localDB.queryRow(mapping.table,{uuid:rec_uuid});
				if(_.isEmpty(recList)) {
					return;
				}
				var rec = recList[0];
				var that = this;

				if(rec.sync_status == "In Progress" ||  rec.sync_status == "Synced") {
					log.error('Cannot process sync request for record',rec,'Probably its either in Progress or already Synced');
					return;
				}

				//Update local copy's status to In Progress, but don't commit to database
				//Note there are chances that because of some other commit,
				//  Record with "In Progress", commits to database. Problem arises if because
				//  of some unknown reason app closes and callback method below doesnot fire.
				//  In that case, local copy for this record can not be synced again.
				//	Workaround is to change sync_status from In Progress to Not Synced at app startup
				localDB.updateRow(mapping.table,{uuid:rec_uuid,sync_status:"In Progress","sfdc_error":""});
				G.client.create(
					mapping.sfObjectName,
					this.sfCreateRecord(rec),
					function(){
						that.insertSuccessHandler(arguments,rec_uuid);
					},
					function(){
						that.insertErrorHandler(arguments,rec_uuid);
					});
			}else{
				log.info('No Network Connectivity');
			}
		},
		query : function(callback){	//callback should be function. and argument to callback will be array of records
			//query only field specified on sfObjectMapping
			if(nm.getStatus()) {
				var query = this.sfCreateQuery();
				//Fire and Forget : Query server and let it complete asynchronously
				var that = this;
				G.client.query(query,function(res){
					that.querySuccessHandler(res);
					if(!_.isUndefined(callback)) {
						log.debug(localDB.queryRow(mapping.table,{}));
						callback(localDB.queryRow(mapping.table,{}));
					}
				},this.queryErrorHandler);
				return localDB.queryRow(mapping.table,{});	//Return Local Copy
			} else {
				if(!_.isUndefined(callback)){
					callback(localDB.queryRow(mapping.table,{}));
				}
				return localDB.queryRow(mapping.table,{});
			}
		},
		sfCreateQuery : function(){
			//Creates query based on sfObjectMapping
			var query = "SELECT ";
			_.each(mapping.fields,function(field, index, list){
				var sf_api = field.sf_api;
				if(!_.isNull(sf_api) && !_.isEmpty(sf_api)) {
					if(index!=0) query = query + ',';
					query = query + sf_api;
				}
			});
			query = query + ' FROM ' + mapping.sfObjectName + ' ORDER BY LASTMODIFIEDDATE DESC LIMIT 10';
			log.debug('sfQuery : ',query);
			return query;
		},
		sfCreateRecord : function(rec){
			var sfobj = {};
			_.each(mapping.fields,function(field, index, list){
				var sf_api = field.sf_api;
				var table_api = field.table_api;
				if(_.has(rec,table_api) && !_.isNull(sf_api) && !_.isEmpty(sf_api)) {
					sfobj[sf_api] = rec[table_api];
				}
			});
			log.info('Salesforce Record : ',sfobj);
			return sfobj;
		},
		sfCreateAttachment : function(rec){
			var sfobj = {};
			_.each(mapping.attachments,function(field, index, list){
				var sf_api = field.sf_api;
				var table_api = field.table_api;
				if(_.has(rec,table_api) && !_.isNull(sf_api) && !_.isEmpty(sf_api)) {
					sfobj[sf_api] = rec[table_api];
				}
			});
			log.debug('Salesforce Attachment : ',sfobj);
			return sfobj;
		},
		insertSuccessHandler : function(arguments,rec_uuid){
			log.debug('Success Arguments',arguments);
			log.debug('Record ID',rec_uuid);
			log.debug('Record SFDC ID',arguments[0].id);
			var sfdc_id = arguments[0].id;
			log.debug(arguments[0]);
			if(localDB.updateRow(mapping.table,{uuid:rec_uuid,id:arguments[0].id,sync_status:"Synced"}))
				localDB.commit();
			var attachments = localDB.queryRow('attachments',{relateduuid:rec_uuid});
			if(!_.isEmpty(attachments)){
				log.info('Attaching attachments');		
				_.each(attachments,function(rec,index,list){
					localDB.updateRow('attachments',_.extend(rec,{parentid:sfdc_id,sync_status:'Not Synced'}));
				});
				localDB.commit();
				this.insertAttachment(rec_uuid);
			}
		},
		insertErrorHandler : function(arguments,rec_uuid){
			log.debug('Failure Arguments',arguments);
			log.debug('Record ID',rec_uuid);
			log.debug(arguments[0]);
			var errObj = arguments[0];
			var errMsg = '';
			if(_.has(errObj,"responseJSON")) {
				if(_.isArray(errObj.responseJSON)) {
					errMsg = errObj.responseJSON[0].message;
				} else {
					errMsg = 'Error is not captured';
					log.error('Error is not captured in responseJSON',arguments[0]);
				}
			} else if(_.has(errObj,"responseText")){
				errMsg = errObj.responseText;
			}
			
			if(localDB.updateRow(mapping.table,{uuid:rec_uuid,sync_status:"Failed",sfdc_error:errMsg}))
				localDB.commit();
		},
		insertAttachment : function(rec_uuid){
			var NumberOfAttachment = localDB.queryRow('attachments',{relateduuid:rec_uuid}).length;
			var records = localDB.queryRow('attachments',{relateduuid:rec_uuid,sync_status:"Not Synced"});
			log.info('Inserting attachment(relteduuid : '+rec_uuid+') : ' + (NumberOfAttachment-records.length)+'/'+NumberOfAttachment );
			if(records.length>0) {
				var record = records[0];
				var rec_id = record.uuid;
				log.info('Uploading '+record.name+' for '+record.parentid);
				var that=this;
				this.processAttachment(rec_uuid,rec_id,record);
				/*
				G.client.create(
					'attachment',
					this.sfCreateAttachment(record),
					function(){
						that.attachmentSuccessHandler(arguments,rec_uuid,rec_id);
					},
					function(){
						that.attachmentErrorHandler(arguments,rec_uuid,rec_id);
					});*/	
			}else {
				log.info('No more attachment to insert');
			}
		},
		processAttachment : function(rec_uuid,rec_id,record){
			var filename = record.body.substr(record.body.lastIndexOf('/')+1);
			var that=this;
			ImageHelper.listFiles(function(entries){
				var imgEntry = _.find(entries,function(entry){
					return (entry.name == filename);
				});
				ImageHelper.readImage(imgEntry,function(blob){
					log.debug('Creating record for ',record,' with blob ',blob);
					record.body = blob;
					G.client.create(
					'attachment',
					sfDataManager.sfCreateAttachment(record),
					function(){
						that.attachmentSuccessHandler(arguments,rec_uuid,rec_id);
					},
					function(){
						that.attachmentErrorHandler(arguments,rec_uuid,rec_id);
					});
				});
			});
		},
		attachmentSuccessHandler:function(arguments,rec_uuid,cur_uuid){
			log.debug('Success Arguments',arguments);
			log.debug('Record ID',rec_uuid);
			log.debug('Attachment ID',cur_uuid);
			log.debug('Record SFDC ID',arguments[0].id);
			log.debug(arguments[0]);
			if(localDB.updateRow('attachments',{uuid:cur_uuid,sync_status:"Synced"}))
				localDB.commit();
			this.insertAttachment(rec_uuid);
		},
		attachmentErrorHandler:function(arguments,rec_uuid,cur_uuid){
			log.debug('Failure Arguments',arguments);
			log.debug('Record ID',rec_uuid);
			log.debug('Attachment ID',cur_uuid);
			log.debug(arguments[0]);
			/*
				Special Handling :
				*/
				if(_.has(arguments[0],"responseText") && arguments[1]=="parsererror"){
					window.rT = arguments[0].responseText;
					//Split based on Line Feed
					var lines = arguments[0].responseText.split('\n');
					if(!_.isEmpty(lines)){
						var length = lines.length;
						var responseString = lines[length-1];
						try{
							log.debug(lines,responseString);
							var obj=JSON.parse(responseString);
							arguments[0].responseJSON = [obj];
							if(obj.success) {
								arguments[0] = obj;
								log.info('From Error Handler',obj);
								this.attachmentSuccessHandler(arguments,rec_uuid,cur_uuid);
								return;
							}
						}catch(e){
							log.error('Unable to  parse');
						}
					}
				}
				/*
			*/
			var errObj = arguments[0];
			var errMsg = '';
			if(_.has(errObj,"responseJSON")) {
				if(_.isArray(errObj.responseJSON)) {
					errMsg = errObj.responseJSON[0].message;
				} else {
					errMsg = 'Error is not captured';
					log.error('Error is not captured in responseJSON',arguments[0]);
				}
			} else if(_.has(errObj,"responseText")){
				errMsg = errObj.responseText;
			}
			if(localDB.updateRow('attachments',{uuid:cur_uuid,sync_status:"Failed",sfdc_error:errMsg}))
				localDB.commit();
		},
		querySuccessHandler:function(res){
			log.info('Query Succesful. Merging Data with localDB');
			log.log(res);
			if(_.isArray(res.records)) {
				_.each(res.records,function(record,index,list){
					var keys = _.keys(record);
					//Prepare record
					var rec={};
					_.each(mapping.fields,function(field,index,list){
						if(!_.isNull(field.sf_api) && !_.isEmpty(field.sf_api)){
							var sfdcApi = _.find(keys,function(key){
								return (key.toLowerCase()==field.sf_api.toLowerCase());
							});
							if(!_.isUndefined(sfdcApi)) {
								rec[field.table_api] = record[sfdcApi];
							}
						}
					});
					//log.debug('Mapped record',rec);
					//log.debug('Mapped from',record);

					//Check If Records Exist
					var recordListInTable = localDB.queryRow(mapping.table,{id:rec.id});
					if(_.isEmpty(recordListInTable)) {
						localDB.insertRow(mapping.table,$.extend(rec,{sync_status:"Synced"}));
					} else {
						var uuid = recordListInTable[0].uuid;
						localDB.updateRow(mapping.table,_.extend(rec,{uuid:uuid,sync_status:"Synced"}));
					}
				});
				//Post-Sync Operation
				localDB.commit();
			}
		},
		queryErrorHandler:function(error){
			log.error('Query Failed',error);
		}
	};
	window.sfDataManager = sfDataManager;
	return sfDataManager;
});
