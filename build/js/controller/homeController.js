//homecontroller.js

define(['networkManager','sfMetadataHelper','json!mapping'],function(nm,sfMetadataHelper,mapping){
	return function($scope){
		$scope.identity;
		$scope.date = new Date();
		$scope.detailViewUUID = 1;
		$scope.recordList = [];
		$scope.greetings = '';
		$scope.setLoadingStatus = function(msg){
			$('#splash_status').html(msg);
		}
		$scope.refreshFlag = false;
		$scope.showRefresh = function(){
			if(nm.getStatus()){
				if(!$scope.refreshFlag)
					return true;
				else
					return false;
			}
			return false;
		}
		$scope.refreshClicked = function(){
			if(nm.getStatus())
				$scope.refreshFlag = true;
			else
				$scope.refreshFlag = false;
			$scope.reRenderHome();
		}
		$scope.resumeLoading = function(){
			log.debug(appScope.identity);
			//Check User First-Time
			if(_.isEmpty(appScope.identity)) {
				$scope.firstTime = true;
				log.info('Configuring APP for first time');
				$scope.setLoadingStatus("Loading");
				if(!nm.getStatus) {
					alert('No network connection');
					return;
				} else {
					var path = '/id/' + $.cookie("orgid") + '/' + $.cookie("userid") + '/';
					log.info('Identity Path :'+path,'Info');

					G.client.ajaxUrl(path,function(response){
						log.info("Identity Response Object : ",'Detail');
						log.info(response,'Detail');

						$scope.identity=response;
						log.info($scope.identity);
						appScope.identity = response;
						localStorage.setItem("appScope",JSON.stringify(appScope));

						$scope.greetings = $scope.identity.display_name;
						var status = "Hi " + $scope.greetings + "!";
						status += "Let me configure your app for first time";
						$scope.setLoadingStatus(status);

						//Initialize Data
						sfDataManager.query($scope.reRenderList);
						sfMetadataHelper.init();
						$scope.loadMain();
					},function(error){alert('Error');});
				}
			} else {
				$scope.loadMain();
			}
		};
		$scope.loadMain = function(){
			$("#splash").remove();
			$('body').pagecontainer("change","#home",{changeHash:false});
			$scope.reRenderHome();
		};
		$scope.reRenderHome = function(){
			$scope.date = new Date();
			$scope.recordList = sfDataManager.query($scope.reRenderList);
			$scope.identity = appScope.identity;
			log.info($scope.identity);
			if(_.isNull($scope.$$phase))
				$scope.$apply();
		}
		$scope.reRenderList = function(recList) {
			//Update List
			$scope.recordList = recList;
			//Reset Refresh button
			$scope.refreshFlag = false;

			if(_.isNull($scope.$$phase))
				$scope.$apply();
			//$( "#outlet_forms" ).listview( "refresh" );		
		}
		$scope.logout = function(){
			var oauthPlugin = cordova.require("com.salesforce.plugin.oauth");
			oauthPlugin.logout();
		}
		$scope.onlineStatus =function(){
			return nm.getStatus();
		}

		//Navigation
		$scope.gotoRecord = function(index) {
			log.debug('Clicked List record',$scope.recordList[index]);
			$scope.detailViewUUID = $scope.recordList[index].uuid;
			$scope.record = $scope.recordList[index];
			$('body').pagecontainer("change","#detailView",{changeHash:false,transition:"slide"});
			if(_.isNull($scope.$$phase)) {
				$scope.$apply();
			}
		}
		$scope.gotoHome = function() {
			$scope.reRenderHome();
			$('body').pagecontainer("change","#home",{changeHash:false,transition:"slide",reverse:true});
		}
		$scope.gotoNewPage = function(reset) {
			if(!_.isUndefined(reset))
			{
				if(reset) $scope.reset();
			}
			$('body').pagecontainer("change","#newPage",{changeHash:false,transition:"slide"});
		}
		$scope.returnNewPage = function() {
			$('body').pagecontainer("change","#newPage",{changeHash:false,transition:"slide",reverse:true});
		}
		$scope.gotoPicklistScreen = function(field){
				if($scope.picklistHelper.init(field))
				{
					$('body').pagecontainer("change","#picklist",{changeHash:false,transition:"slide"});
				}
			
		}
		$scope.gotoFileList = function(section) {
			if($scope.fileHelper.init(section)) {
				$('body').pagecontainer("change","#filelist",{changeHash:false,transition:"slide"});
			}
		}
		//Detail View Part
		$scope.record = {};
		$scope.getFormLabel = function(table_api){
			if(_.isEmpty(table_api)) return 'NaN'; //As $scope.$digest run at beginning. And at that time table_api is not defined in layout
			var field = _.find(mapping.fields,function(field){
				return (field.table_api.toLowerCase() == table_api.toLowerCase())
			});
			if(_.isUndefined(field)) return 'NaN';
			return field.form_label;
		}
		$scope.sync = function(rec_uuid){
			if(nm.getStatus()){
				$('#reqQueued').popup("open");
				sfDataManager.asyncInsert(rec_uuid);
				log.info(rec_uuid,' has been put in queue');
			} else {
				$('#noNet').popup("open");
			}
		}
		$scope.showSyncButton = function() {
			if(nm.getStatus()) {
				if($scope.record.sync_status == "Not Synced" || $scope.record.sync_status == "Failed") return true;
				else return false;
			} else return false;
		}
		//New Page
		$scope.newRecord = {};
		$scope.newAttachment = [];
		$scope.reset = function(){
			$scope.newRecord = {};
			$scope.newAttachment = [];
		}
		$scope.getTitleForNewRecord = function(){
			if(_.isEmpty($scope.newRecord.name))
				return 'New Outlet Form';
			else
				return $scope.newRecord.name;
		}
		$scope.getHeight = function(elem){
			var e = $(elem);
			var li = $($(elem).children()[0]);
			var liHeight = li.height();
			var liCount = $(elem).children().length;
			var liFloat = li.css('float');
			var col = 1;
			if(liFloat == 'left') {
				col = 2;
			}
			return ((liCount/col)*liHeight)+'px';
		}
		$scope.saveNewRecord = function(){
			log.info('Saving Record',$scope.newRecord);
			if(_.isEmpty($scope.newRecord.name)) {
				log.info('Ignoring Blank Record');
				$("#newFormAlert").popup('open');
				return;
			}
			sfDataManager.insert($scope.newRecord,$scope.newAttachment);
			$scope.recordList = sfDataManager.query($scope.reRenderList);
			$scope.reRenderList($scope.recordList);
			$('body').pagecontainer("change","#home",{changeHash:false,transition:"slide",reverse:true});
		}

		//Picklist Helper
		$scope.picklistHelper = {
			selectedValue : null,
			field : null,
			form_label : null,
			picklistValues : [],
			select : function(value){
				this.selectedValue = value;
				if(!_.isNull(this.field)) {
					$scope.newRecord[this.field] = this.selectedValue;
				}
				//Return to page
				$('body').pagecontainer("change","#newPage",{changeHash:false,transition:"slide",reverse:true});
				if(_.isNull($scope.$$phase)) $scope.$apply();
			},
			init:function(field){
				var sfField = _.find(mapping.fields,function(f){return f.table_api == field;});
				if(!_.isUndefined(sfField)){
					this.picklistValues = sfMetadataHelper.getPicklistValues(sfField.sf_api);
					this.selectedValue = null;
					this.field = field;
					if(_.isNull($scope.$$phase)){
						$scope.$apply();
					}
					$("#picklistview").listview();
					$("#picklistview").listview("refresh");
					return true;
				} else return false;
			}
		};

		//Document Helper
		$scope.fileHelper = {
			listOfDocuments : null,	//map : name,table_api
			label : null,
			curDoc : null,
			init : function(section) {
				this.listOfDocuments = sfMetadataHelper.getListOfDocument(section);
				this.label = section;
				return true;
			},
			isAttached : function(table_api){
				if(_.isNull(table_api)) return false;
				if(_.isUndefined($scope.newRecord[table_api])) return false;
					else return $scope.newRecord[table_api];
			},
			gotoUploadFile:function(doc){
				$scope.fileHelper.curDoc = doc;
				if($scope.newRecord[doc.table_api]==true) return;
				var dummyPayTMFile = "iVBORw0KGgoAAAANSUhEUgAAAJcAAABLCAMAAABKveUfAAAAk1BMVEX///8FLnABuvIAuPIAtvIAKm4ALG+l3/hDSn0AJGwvQHnz9Pc+wPOO1PdRx/Tx8fRuzvW85PpkcpkAAF3q+P0AG2gmN3WWnbX2/P7o6/AADmRue54AAGEWMXIAGGcAE2XCxdO4uss4ToEAH2nZ8fwACGPP0dykp73N7PuwssXg4ulJWokAAFYAsPE4RnyCi6paZY9hl7YXAAAC2ElEQVRoge2Y25KiMBBAgxA0yig6oIgXQNQBHMH//7rtpAMi4+xFV9itynmwOk3QUw3pgIQoFAqFQqFQKBQKxf/LvmuB+9hGv2uFe9iG/ta1wx2mRu9f9AKtV3lNKkZeMzkqxyMxvB7iBzxnaoMWeHkeP9PhQOAk/QS/aT/t7z3yGJfP95L1ZpVhcvW+FvibWSgSOT/+GUEU8fmfAyjV2eBW4KUbZ90TY+Pcc8YGx4aExYPeg6tiQLUKM96ixqlMUrZe8XLNTRi4Cwg/XD5xOCJ9tEJ0h/R1GcrPN3ncGD/txT2WN15AUHz1otxLb3jVPSs/HtjPe2lu0fTS4qzutfhdrytG8rwXzb94BemTXg8VDL3Y4eCLwNzwC1ngYlhjvYr7XuV939Ph9q68YFAKG+UE61Evdjkewx2tvCSTDddhs7v3F0mSxBI/aycJ7JHoBU3DsVHMcshUf9KLL7p02/QiQ/oTL2CMKiKWXhA5WK0phKj497wm0aIoihnT/tTL4F76q7wK348ZoD3m9ap6nbb1JVp5iVkr1qbXbJllFya9ihst7uXNcdXmeS5q2JaXZlIaM9knJqbZ9CI7bGgwTWvVSzOlDB2SY4A6221sll6ia9W6b2teJfGMRD7apOmCyv5FRq7ZqZcZZCQS9Yr5I89O9i9CjgfWoRfzU4JeZsOLZPk2cF0XL21rXswHAnYKyXdeULJ0AYgtoLU+AfsjgE+r33kh7ffVEry/3JBc90cgCwXRrtV61b1CHxvZYDCkWuXlHnxxrUUKn9Ja9spi2cpkE0WvuN4oykvbqhfJb1ua9KqnDmEXXuH7L7zcC3m5V85gC4pvvEgauPTKOuU5l5oIZX6p9Uqv2WY+n9OP2+SyyIcVC5HamRuBNj9F1Tzb0OGtFr0S3bIsoeChLn8L6vd48qEXtesb/g1eSTleSkb1SXtO/QyMxF8CjaRCoVAoFAqFQqFQdMIPfNlNr1T+oNcAAAAASUVORK5CYII=";
				if(deviceready) {
					//Reference : https://github.com/apache/cordova-plugin-camera#module_camera.getPicture
					if(!_.isUndefined(navigator.camera)) {
						log.info('Camera Plugin Ddetected');
						var options = {
							quality:30,
							destinationType:navigator.camera.DestinationType.FILE_URI,
							sourceType:navigator.camera.PictureSourceType.CAMERA,
							cameraDirection:navigator.camera.Direction.BACK,
							encodingType:navigator.camera.EncodingType.JPEG,
							targetWidth:400,targetHeight:600
						};
						log.info('Setting Option for Camera. Opening Camera');
						navigator.camera.getPicture($scope.fileHelper.successCallback,
								$scope.fileHelper.errorCallback,
								options
							);
					} else {
						log.warn('Navigator is not defined');
						log.info('Adding dummy image');
						$scope.fileHelper.successCallback(dummyPayTMFile);
					}
				}else {
						log.warn('deviceready is not defined');
						$scope.fileHelper.successCallback(dummyPayTMFile);
					}
			},
			successCallback:function(imageData){	//Base64 data
				log.info('Success Call back for pic');
				log.info('Image Data',imageData);
				var doc = $scope.fileHelper.curDoc;
				$scope.newRecord[doc.table_api]=true;
				var attachmentRec = {body:imageData,contenttype:'image/jpeg;base64',name:doc.form_label+'.jpeg'};
				$scope.newAttachment.push(attachmentRec);
				if(_.isNull($scope.$$phase)){
						$scope.$apply();
				}
			},
			errorCallback:function(message){log.error(message);
				$scope.newRecord[doc.table_api]=false;
				if(_.isNull($scope.$$phase)){
						$scope.$apply();
				}
			}
		}
		$scope.updatePicklistView = function(id,last){
			if(!last) return;
			try{
				$(id).listview("refresh");
			} catch(e){}
			return;
		}
		window.rootScope = $scope;
	}
});