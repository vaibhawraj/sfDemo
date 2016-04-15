define([],function(){
	var ImageHelper = {
		cacheDir : null,
		init:function(){
			log.info('Initializing ImageHelper');
			if(typeof(cordova.file)=="undefined") {
				log.error("cordova file not found");
				return;
			}
			log.info('Initializing for ',cordova.file.externalCacheDirectory);
			var that = this;
			window.resolveLocalFileSystemURL(cordova.file.externalCacheDirectory,function(DirEntry)
				{
					that.cacheDir=DirEntry;
					log.info('Directory Initialized');

				},function(err){log.error(err)});
		},
		listFiles : function(callback){
			//Creating Directory Reader
			dirReader = this.cacheDir.createReader();
			//Reading File
			dirReader.readEntries(
				function(entry){
					fileEnt = entry;
					log.info('File Entries ',fileEnt);
					callback(fileEnt);
				},function(e){console.log(e);});
		},
		readImage : function(fileEnt,callback){
			//Reading From File Entry
				//Get File 
				fileEnt.file(function(fileObj){
					//Creating File Reader
					var fileR = new FileReader();
					//Setting callback method
					fileR.onloadend = function(evt){
						log.info('File Loaded : ',fileObj.name,this);
						callback(this.result.split(',')[1]);
					}
					fileR.readAsDataURL(fileObj);
				},function(err){
					log.error(_.find(_.keys(FileError),function(e){return FileError[e]==err.code;}),e);
				});
		}
	};
	if(typeof(window.ImageHelper)=="undefined")
		window.ImageHelper = ImageHelper;
	else return window.ImageHelper;
});