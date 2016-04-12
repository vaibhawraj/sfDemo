/*
Description : It defines angularjs directive that will call jquery list view refresh method. By default, both library runs in
their own scope. And hence, jquery dont know when angularjs updates its content. Therefore it is explicitly required to 
call list view refresh for jquery
Reference : https://docs.angularjs.org/guide/directive
https://github.com/aztack/AngularJS-translation/issues/6
*/
define([],function(){
	return function(){
		return {
			restrict:'AECM',		//Only Matches to attribute name. e.g <ul my-directive>
								//Other options are E - Matches element name .e. <my-directive>
								//					C - Matches class name
								//					M - matches comment
			link: function(scope,element,attrs){
				if(scope.$last){
					//In single digest, scope is called upto max 10 times or until changes has been incorporated in scope model
					//for reference : https://docs.angularjs.org/guide/directive & 
					log.info('Testing',element);
					if($(element[0].parentElement).hasClass('ui-listview')) { //Check if listView is initialized or not
						$(element[0].parentElement).listview("refresh");
     				} 
					else {
						$(element[0].parentElement).listview();
     				}
					
				}
			}
		};
	};
});
