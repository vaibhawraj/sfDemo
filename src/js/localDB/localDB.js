/*
	Name : localDB.js
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
				this.commit();
				this._dbLoaded = true;
			}
		},
		createTable : function(name,fields){
			if(!this._dbLoaded) {
				log.error('No database loaded');
				return;
			}
			if(_.has(this._storage,name)) {
				this._storage[name] = null;
			}
			fields.push('timeStamp');
			fields.push('uuid');
			var table = {
				fields : fields,
				name : name,
				count : 0,
				records : []
			};
			this._storage[name] = table;
			log.info('Table ' + name + ' created');
		},
		insertRow : function(table,rec){
			if(!this.isTableExist(table) && _.isObject(rec))
				return;
			var record = {};
			_.each(this._storage[table].fields,function(element,index,list){
				if(_.has(rec,element)){
					record[element] = rec[element];
				}
			})
			record.timeStamp = (new Date()).getTime();
			record.uuid = this._storage[table].count +1;
			this._storage[table].count += 1
			this._storage[table].records.push(record);
		},
		updateRow : function(table,rec){
			if(!this.isTableExist(table) && _.isObject(rec)) return false;
			var updateStatus = false;
			var errorMsg = '';
			if(_.has(rec,'uuid')) {
				_.each(this._storage[table].records,function(element,index,list){
					if(element.uuid == rec.uuid) {
						var temp = element;
						//For each key in rec, assign new value to temprory record
						//Replace previous entry with new entry
						this._storage[table].records[index] = temp;
						updateStatus=true;
					}
				});
				return updateStatus;
			} else {
				log.error('UUID is not specified for table "'+table + '" : Record ' + rec);
				return false;
			}
		},
		queryRow : function(){},
		purgeTable : function(){},
		deleteRow : function(){},

		isTableExist : function(table){
			if(!this._dbLoaded) {
				log.error('No database loaded');
				return false;
			}
			return _.has(this._storage,table);
		},
		commit : function(){
			if(this._storage == null || this._name == null) {
				log.error('No database loaded',this._name,this._storage);
				return new error('No database is loaded');
			}
			localStorage.setItem(this._name,JSON.stringify(this._storage));
		},
		rollback : function(){},
	};
	if(typeof (window.localDB) === "undefined") {
		window.localDB = localDB;
	}
});