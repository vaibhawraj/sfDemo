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
		$scope.resumeLoading = function(){
			log.debug(appScope.identity);
			//Check User First-Time
			if(_.isEmpty(appScope.identity)) {
				$scope.firstTime = true;
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
			$( "#outlet_forms" ).listview( "refresh" );
		}
		$scope.reRenderList = function(recList) {
			$scope.recordList = recList;
			if(_.isNull($scope.$$phase))
				$scope.$apply();
			$( "#outlet_forms" ).listview( "refresh" );		
		}
		$scope.toggle =function(){
			
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
		$scope.gotoPicklistScreen = function(field){
				if($scope.picklistHelper.init(field))
				{
					$('body').pagecontainer("change","#picklist",{changeHash:false,transition:"slide"});
				}
			
		}

		//Detail View Part
		$scope.record = {};
		$scope.getFormLabel = function(table_api){
			var field = _.find(mapping.fields,function(field){
				return (field.table_api.toLowerCase() == table_api.toLowerCase())
			});
			if(_.isUndefined(field)) return 'NaN';
			return field.form_label;
		}
		//New Page
		$scope.newRecord = {};
		$scope.reset = function(){
			$scope.newRecord = {};
		}

		//Picklist Helper
		$scope.picklistHelper = {
			selectedValue : null,
			field : null,
			picklistValues : [],
			select : function(value){
				this.selectedValue = value;
				if(!_.isNull(this.field)) {
					$scope.newRecord[field] = selectedValue;
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
	}
});