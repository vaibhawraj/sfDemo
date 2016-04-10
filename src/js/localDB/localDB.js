/*
	Name : localDB.js
	Author : Vaibhaw Raj(vaibhaw.raj@comprotechnologies.com)
	Description : localDB manages all interaction with local Database of app. It features offline data management
	              at its lowest level.
	Created On : 8th April 2016
*/
define(['underscore'],function(_){
	var storage = window.localStorage;

	var localDB = {
		_storage : null,
		_name : null,
		_dbLoaded : false,
		openDatabase : function(name){
			//Open or Create Database in localStorage
			if(_.has(localStorage,name)) {
				this._storage = JSON.parse(localStorage.getItem(name));
				this._name = name;

				log.info('localDB ' + name + ' loaded');
				this._dbLoaded = true;
			} else {
				this._storage = {};
				this._name = name;
				log.info('localDB ' + name + ' created');
				this._dbLoaded = true;
				this.commit();
			}
		},
		createTable : function(name,fields){
			if(!this._dbLoaded) {
				log.error('No database loaded');
				return;
			}
			if(_.has(this._storage,name)) {
				log.error('Cannot create table with name ' + name,'Table already exists');
				return;
			}
			if(!_.isArray(fields)) {
				log.error('Fields must be Array',typeof fields);
			}
			var fieldList = [];
			_.each(fields,function(key,index,list){fieldList.push(key.toLowerCase());});
			fieldList.push('timestamp');
			fieldList.push('uuid');
			var table = {
				fields : fieldList,
				name : name,
				count : 0,
				records : []
			};
			this._storage[name] = table;
			log.info('Table ' + name + ' created');
		},
		insertRow : function(table,rec){
			if(!this.isTableExist(table))
			{
				log.error('Table not exist ['+table+']');
				return null;
			} else if(!_.isObject(rec)){
				log.error('Record is not object : ['+rec+']');
			 	return null;
			}
			var record = {};
			//UUID should not be set while insertion
			if(_.has(rec,'uuid')) {
				log.error('UUID cannot be set in insertRow : ['+rec+']');
			 	return null;
			}
			var that = this;
			_.each(_.keys(rec),function(element,index,list){
				console.log(that._storage[table].fields,_.contains(that._storage[table].fields,element.toLowerCase()),element);
				if(_.contains(that._storage[table].fields,element.toLowerCase())){
					record[element.toLowerCase()] = rec[element];
				}
			});
			record.timeStamp = (new Date()).getTime();
			record.uuid = this._storage[table].count +1;
			this._storage[table].count += 1
			this._storage[table].records.push(record);
			return record.uuid;
		},
		updateRow : function(table,rec){
			if(!this.isTableExist(table))
			{
				log.error('Table not exist ['+table+']');
				return null;
			} else if(!_.isObject(rec)){
				log.error('Record is not object : ['+rec+']');
			 	return null;
			}
			
			var updateStatus = false;
			var errorMsg = '';
			if(_.has(rec,'uuid')) {
				var that = this;
				_.each(this._storage[table].records,function(element,index,list){
					if(element.uuid == rec.uuid) {
						var temp = element;
						_.each(_.keys(rec),function(key,ind,list){
							if(_.has(element,key.toLowerCase())){
								that._storage[table].records[index][key.toLowerCase()] = rec[key];
							}else{
								log.warn('Field not found ['+key+'] in ['+element+']');
							}
						});
						updateStatus=true;
					}
					if(updateStatus){
						return;
					}
				});
				if(!updateStatus) {
					log.error('Update failed for ['+rec+']. UUID not found ['+rec.uuid+']');
				}
				return updateStatus;
			} else {
				log.error('UUID is not specified for table "'+table + '" : Record ' + rec);
				return false;
			}
		},
		queryRow : function(table,rec){
			var queryStatus = false;
			var queryResult = [];
			if(!this.isTableExist(table))
			{
				log.error('Table not exist ['+table+']');
				return null;
			} else if(!_.isObject(rec)){
				log.error('Record is not object : ['+rec+']');
			 	return null;
			}
			_.each(this._storage[table].records,function(element,index,list){
					if(_.isMatch(element,rec)){
						queryResult.push(element);
						queryStatus = true;
					}
				});
				if(!queryStatus) {
					log.warn('Record not found ['+rec+']');
				}
			return queryResult;	//Always return either empty array or list of result
		},
		purgeTable : function(){},	//TO-DO
		deleteRow : function(){},  //TO-DO

		isTableExist : function(table){
			if(!this._dbLoaded) {
				log.error('No database loaded');
				return false;
			}
			return _.has(this._storage,table);
		},
		commit : function(){
			if(!this._dbLoaded) {
				log.error('No database loaded',this._name,this._storage);
			}
			localStorage.setItem(this._name,JSON.stringify(this._storage));
		},
		rollback : function(){
			if(!this._dbLoaded) {
				log.error('No database loaded',this._name,this._storage);
			}
			this._storage = JSON.parse(localStorage.getItem(this._name));
		},
	};
	if(typeof (window.localDB) === "undefined") {
		window.localDB = localDB;
	}
});


/*
localDB.openDatabase('sfData');
var fields = ["names","outlettype","message","pic","pic2"];
localDB.createTable('outlet',fields);
var rec = {naMes:"vaibhaw",message:"hello"}
localDB.insertRow('outlet',rec);
*/