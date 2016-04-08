var conn = {
	accessToken : G.client.sessionId,
	endpoint : 'https://ap2.salesforce.com/services/Soap/u/v34.0'
}

function toXML(name, value) {
  if (_.isObject(name)) {
    value = name;
    name = null;
  }
  if (_.isArray(value)) {
    return _.map(value, function(v) { return toXML(name, v); }).join('');
  } else {
    var attrs = [];
    var elems = [];
    if (_.isObject(value)) {
      for (var k in value) {
        var v = value[k];
        if (k[0] === '@') {
          k = k.substring(1);
          attrs.push(k + '="' + v + '"');
        } else {
          elems.push(toXML(k, v));
        }
      }
      value = elems.join('');
    } else {
      value = String(value);
    }
    var startTag = name ? '<' + name + (attrs.length > 0 ? ' ' + attrs.join(' ') : '') + '>' : '';
    var endTag = name ? '</' + name + '>' : '';
    return  startTag + value + endTag;
  }
}

createEnvelope = function(message) {
  var header = {};
  if (conn.accessToken) {
    header.SessionHeader = { sessionId: conn.accessToken };
  }
  if (conn.callOptions) {
    header.CallOptions = conn.callOptions;
  }
  xmlns = "urn:partner.soap.sforce.com";
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"',
    ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"',
    ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
    '<soapenv:Header xmlns="' + xmlns + '">',
    toXML(header),
    '</soapenv:Header>',
    '<soapenv:Body xmlns="' + xmlns + '">',
    toXML(message),
    '</soapenv:Body>',
    '</soapenv:Envelope>'
  ].join('');
};

message = {
	describeTabs : ""
}
url = "https://ap2.salesforce.com/services/soap/u/35.0";
res = "";
function ajax(){
$.ajax({
            type: "post",
            async: true,
            url: "http://localhost:8080/sfapp/proxy.php?mode=native",
            contentType: 'text/xml',
            cache: false,
            processData: false,
            soapAction: '',
            data: createEnvelope(message),
            success: function(m){describeAllTabs=m;console.log("Done");},
            error: (!this.refreshToken || retry) ? function(e){res=e;console.log('done')} : function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                    that.refreshAccessToken(function (oauthResponse) {
                        that.setSessionToken(oauthResponse.access_token, null,
                            oauthResponse.instance_url);
                        that.ajax(path, callback, error, method, payload, true);
                    },
                        error);
                } else {
                    error(jqXHR, textStatus, errorThrown);
                }
            },
            dataType: "json",
            beforeSend: function (xhr) {
				xhr.setRequestHeader('Content-Type',"text/xml");
            	xhr.setRequestHeader('SoapAction','""');
                xhr.setRequestHeader('SalesforceProxy-Endpoint', "https://ap2.salesforce.com/services/Soap/u/35.0");
                xhr.setRequestHeader('X-User-Agent', 'salesforce-toolkit-rest-javascript/' + 'v35.0');
            }
        });
    }

    /*SCHEMA*/
Schemas = {};
  Schemas.DescribeTabSetResult = {
  label: 'string',
  logoUrl: 'string',
  namespace: 'string',
  selected: 'boolean',
  tabs: [{
    colors: [{
      theme: 'string',
      color: 'string',
      context: 'string'
    }],
    iconUrl: 'string',
    icons: [{
      theme: 'string',
      height: 'number',
      width: 'number',
      url: 'string',
      contentType: 'string'
    }],
    label: 'string',
    custom: 'boolean',
    miniIconUrl: 'string',
    name: 'string',
    sobjectName: 'string',
    url: 'string'
  }]
};

function convertType(value, schema) {
  if (_.isArray(value)) {
    return value.map(function(v) {
      return convertType(v, schema && schema[0])
    });
  } else if (_.isObject(value)) {
    if (value.$ && value.$['xsi:nil'] === 'true') {
      return null;
    } else if (_.isArray(schema)) {
      return [ convertType(value, schema[0]) ];
    } else {
      var o = {};
      for (var key in value) {
        o[key] = convertType(value[key], schema && schema[key]);
      }
      return o;
    }
  } else {
    if (_.isArray(schema)) {
      return [ convertType(value, schema[0]) ];
    } else if (_.isObject(schema)) {
      return {};
    } else {
      switch(schema) {
        case 'string':
          return String(value);
        case 'number':
          return Number(value);
        case 'boolean':
          return value === 'true';
        default:
          return value;
      }
    }
  }
}


function parseXML(xml)
{
	d =$(xml);

}