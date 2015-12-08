//Utility.js
//Author : Vaibhaw Raj
//Creation Date : 7th Dec 2015
//Description : Contains basic methods or extensions or shorthand for some commonly used javascript steps

var util = (function(){
	return {
		isDef : function(elem){
			if(typeof(elem)!=="undefined")
			{
				return true;
			}
			return false;
		},
		message : function() { return "message";}
	}
})();