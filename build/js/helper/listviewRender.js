/*
Description : It defines angularjs directive that will call jquery list view refresh method. By default, both library runs in
their own scope. And hence, jquery dont know when angularjs updates its content. Therefore it is explicitly required to 
call list view refresh for jquery
Reference : https://docs.angularjs.org/guide/directive
https://github.com/aztack/AngularJS-translation/issues/6
*/
define([],function(){
	return ['$interval',function($interval){
		return {
			restrict:'AE',		//Only Matches to attribute name. e.g <ul my-directive>
								//Other options are E - Matches element name .e. <my-directive>
								//					C - Matches class name
								//					M - matches comment
								
								//template:"Helloworld",
			scope:{
				no:0
			},
			link: function(scope,element,attrs){
				if(element[0].nodeName=="UL"){
					//In single digest, scope is called upto max 10 times or until changes has been incorporated in scope model
					//for reference : https://docs.angularjs.org/guide/directive & 
					//log.info('Testing',element);
					//log.info('No Of elem ',element,element[0].nodeName);
					element.on('$destroy', function() {
      					$interval.cancel(timeoutId);
    				});

					timeoutId = $interval(function() {
							if($(element[0]).hasClass('ui-listview')) { //Check if listView is initialized or not
								try{
									$(element[0]).listview("refresh");
								} catch(e){}
		     				} 
							else {
								$(element[0]).listview();
		     				}
    				}, 0);
				}
			}
		};
	}];
});
