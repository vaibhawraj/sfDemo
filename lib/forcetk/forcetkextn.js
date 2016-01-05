/*

	ForceTk Extension JS file add feature in existing forcetk to use SOAP 
	communication and hence can access metadata and other information using SOAP
	API

*/


if (forcetk.Client !== undefined) {
		console.log("Processing");
		forcetk.Client.prototype.SOAP = {
			x2js : new X2JS(),
			xmlns : "urn:enterprise.soap.sforce.com",
			endpointUrl : "",
			parent : function(){return this;}
		};
		forcetk.Client.prototype.SOAP._createEnvelope = function(message) {
			var header = {};
  			if (this.sessionId) {
    			header.SessionHeader = { sessionId: this.sessionId };
  			}
  			else {
  				header = {};
  			}
			return [
			    '<?xml version="1.0" encoding="UTF-8"?>',
			    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"',
			    ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"',
			    ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
			    '<soapenv:Header xmlns="' + this.xmlns + '">',
			    this.x2js.json2xml_str(header),
			    '</soapenv:Header>',
			    '<soapenv:Body xmlns="' + this.xmlns + '">',
			    this.x2js.json2xml_str(message),
			    '</soapenv:Body>',
			    '</soapenv:Envelope>'
			  ].join('');
			};

		forcetk.Client.prototype.SOAP.ajax = function(callback, error, payload, retry){
			 	'use strict';
		        var that = this.parent,
		            url = this.endpointUrl;

		        return $.ajax({
		            type: "POST",
		            async: this.asyncAjax,
		            url: (this.proxyUrl !== null) ? this.proxyUrl : url,
		            contentType: 'text/xml',
		            cache: false,
		            processData: false,
		            data: payload,
		            success: callback,
		            error: (!that.refreshToken || retry) ? error : function (jqXHR, textStatus, errorThrown) {
		                if (jqXHR.status === 401) {
		                    that.refreshAccessToken(function (oauthResponse) {
		                        that.setSessionToken(oauthResponse.access_token, null,
		                            oauthResponse.instance_url);
		                        that.SOAP.ajax(callback, error, payload, true);
		                    },
		                        error);
		                } else {
		                    error(jqXHR, textStatus, errorThrown);
		                }
		            },
		            dataType: "xml",
		            beforeSend: function (xhr) {
		                if (that.proxyUrl !== null && !that.visualforce) {
		                    xhr.setRequestHeader('SalesforceProxy-Endpoint', url);
		                }
		                xhr.setRequestHeader(that.authzHeader, "Bearer " + that.sessionId);
		                xhr.setRequestHeader('SOAPAction', '""');
		                xhr.setRequestHeader('X-User-Agent', 'salesforce-toolkit-rest-javascript/' + that.apiVersion);
		            }
		        });
		}
		forcetk.Client.prototype.SOAP.describeTabs = function(callback,error){
			var message = {describeTabs : ""};
			var payload = this._createEnvelope(message);
			var that = this;
			this.ajax(function(response){
				var obj = that.x2js.xml2json(response);
				callback(obj.Envelope.Body.describeTabsResponse);
			},
				function(response){
					console.log(response.responseText);},
				payload);
		}
		//@Override
		forcetk.Client.prototype.setSessionToken = function (sessionId, apiVersion, instanceUrl) {
	        'use strict';
	        this.sessionId = sessionId;
	        this.apiVersion = (apiVersion === undefined || apiVersion === null)
	            ? 'v29.0' : apiVersion;
	        if (instanceUrl === undefined || instanceUrl === null) {
	            this.visualforce = true;

	            // location.hostname can be of the form 'abc.na1.visual.force.com',
	            // 'na1.salesforce.com' or 'abc.my.salesforce.com' (custom domains). 
	            // Split on '.', and take the [1] or [0] element as appropriate
	            var elements = location.hostname.split("."),
	                instance = null;
	            if (elements.length === 4 && elements[1] === 'my') {
	                instance = elements[0] + '.' + elements[1];
	            } else if (elements.length === 3) {
	                instance = elements[0];
	            } else {
	                instance = elements[1];
	            }

	            this.instanceUrl = "https://" + instance + ".salesforce.com";
	        } else {
	            this.instanceUrl = instanceUrl;
	        }
	        this.SOAP.endpointUrl = this.instanceUrl + "/services/Soap/c/" + this.apiVersion.substring(1);
	        this.SOAP.sessionId = this.sessionId;
	        this.SOAP.proxyUrl = this.proxyUrl;
	        this.SOAP.parent = this;
    	};
    	//

	}