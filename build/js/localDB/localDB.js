/*
	Name : localDB.js
*/
define([underscore],function(_){
	var storage = window.localStorage;
	var localDB = {
		_storage : null,
		_name : null,
		openDatabase : function(name){
			//Open or Create Database in localStorage
			if(_.has(localStorage,name)) {
				this._storage = JSON.parse(localStorage.getItem(name));
				this._name = name;
				log.info('localDB ' + name + ' loaded');
			} else {
				this._storage = {};
				this._name = name;
				this.commit();
			}
		},
		createTable : function(){},
		insertRow : function(){},
		updateRow : function(){},
		queryRow : function(){},
		purgeTable : function(){},
		deleteRow : function(){},
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