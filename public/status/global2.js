/*
	http://www.JSON.org/json2.js
	2008-11-19
	Public Domain.
	NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	See http://www.JSON.org/js.html
*/

if (!this.JSON) {
	JSON = {};
}
(function () {
	function f(n) {
		return n < 10 ? '0' + n : n;
	}
	if (typeof Date.prototype.toJSON !== 'function') {
		Date.prototype.toJSON = function (key) {
			return this.getUTCFullYear()   + '-' +
				f(this.getUTCMonth() + 1) + '-' +
				f(this.getUTCDate())      + 'T' +
				f(this.getUTCHours())     + ':' +
				f(this.getUTCMinutes())   + ':' +
				f(this.getUTCSeconds())   + 'Z';
		};

		String.prototype.toJSON =
		Number.prototype.toJSON =
		Boolean.prototype.toJSON = function (key) {
			return this.valueOf();
		};
	}

	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		gap,
		indent,
		meta = {	// table of character substitutions
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		},
		rep;

	function quote(string) {
		escapable.lastIndex = 0;
		return escapable.test(string) ?
			'"' + string.replace(escapable, function (a) {
				var c = meta[a];
				return typeof c === 'string' ? c :
					'\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				}) + '"' :
			'"' + string + '"';
	}

	function str(key, holder) {
		var i,	// The loop counter.
			k,	// The member key.
			v,	// The member value.
			length,
			mind = gap,
			partial,
			value = holder[key];

		if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
			value = value.toJSON(key);
		}

		if (typeof rep === 'function') {
			value = rep.call(holder, key, value);
		}

		switch (typeof value) {
			case 'string':
				return quote(value);
			case 'number':
				return isFinite(value) ? String(value) : 'null';
			case 'boolean':
			case 'null':
				return String(value);
			case 'object':
				if (!value) {
					return 'null';
				}

				gap += indent;
				partial = [];

				if (Object.prototype.toString.apply(value) === '[object Array]') {
					length = value.length;
					for (i = 0; i < length; i += 1) {
						partial[i] = str(i, value) || 'null';
					}

					v = partial.length === 0 ? '[]' :
						gap ? '[\n' + gap +
						partial.join(',\n' + gap) + '\n' +
						mind + ']' :
					  '[' + partial.join(',') + ']';
					gap = mind;
					return v;
				}

				if (rep && typeof rep === 'object') {
					length = rep.length;
					for (i = 0; i < length; i += 1) {
						k = rep[i];
						if (typeof k === 'string') {
							v = str(k, value);
							if (v) {
								partial.push(quote(k) + (gap ? ': ' : ':') + v);
							}
						}
					}
				} else {
					for (var k in value) {
						if (Object.hasOwnProperty.call(value, k)) {
							v = str(k, value);
							if (v) {
								partial.push(quote(k) + (gap ? ': ' : ':') + v);
							}
						}
					}
				}

				v = partial.length === 0 ? '{}' :
					gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
					mind + '}' : '{' + partial.join(',') + '}';
					gap = mind;
				return v;
		}
	}

	if (typeof JSON.stringify !== 'function') {
		JSON.stringify = function (value, replacer, space) {
			var i;
			gap = '';
			indent = '';
	
			if (typeof space === 'number') {
				for (i = 0; i < space; i += 1) {
					indent += ' ';
				}
			} else if (typeof space === 'string') {
				indent = space;
			}
	
			rep = replacer;
			if (replacer && typeof replacer !== 'function' &&
				(typeof replacer !== 'object' ||
				typeof replacer.length !== 'number')) {
				throw new Error('JSON.stringify');
			}
	
			return str('', {'': value});
		};
	}

	if (typeof JSON.parse !== 'function') {
		JSON.parse = function (text, reviver) {
			var j;

			function walk(holder, key) {
				var k, v, value = holder[key];
				if (value && typeof value === 'object') {
					for (var k in value) {
						if (Object.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v;
							} else {
								delete value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}

			cx.lastIndex = 0;
			if (cx.test(text)) {
				text = text.replace(cx, function (a) {
					return '\\u' +
						('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				});
			}

			if (/^[\],:{}\s]*$/.
				test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
				replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
				replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
				j = eval('(' + text + ')');

				return typeof reviver === 'function' ?
					walk({'': j}, '') : j;
			}

			throw new SyntaxError('JSON.parse');
		};
	}
})();

// 110510 - w168.11.3
var Util = {
	pageName : null
	
	,setPageName : function(name) {
		name = name ? name : '';

		var trackable = false;
		if (name.indexOf(':') > -1) {
			trackable = true;
		} else if (document.location.pathname.indexOf('SignupServlet') > -1 || document.location.pathname.indexOf('LeadCaptureServlet') > -1) {
			trackable = true;
		} else if (typeof(com.salesforce.www.App) == 'object') {
			try {
				var ambiguousUrls = com.salesforce.www.App.cfg('tracking.ambiguous-urls');
				if (jQuery.isArray(ambiguousUrls)) {
					jQuery(ambiguousUrls).each(function() {
						if (document.location.pathname.indexOf(this) > -1) {
							trackable = true;
							return false;
						}
					});
				}
			} catch (ex) {}
		}

		if (trackable) {
			Page.setName(name);
		}
	}

	,getPageName : function() {
		return Page.getName();
	}
	
	// client-side redirect w/ cookies
	,redirect : function (destination) {
		var cookiejar = new CookieHandler();
		var referrer = document.referrer ? document.referrer : '';
		cookiejar.setCookie('referrer',escape(referrer),60); // 60 seconds
		top.location.href = destination;
	}

	,isValidJson : function (jsonString) {
		return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(jsonString.replace(/"(\\.|[^"\\])*"/g, ''))) && eval('(' + jsonString + ')');
	}

	,parseJSON : function(str) {
		if (!str) {
			return {};
		}
		try {
			return jQuery.evalJSON(str);
		} catch (ex) {
			return JSON.parse(str);
		}
	}

	,toJSON : function(obj) {
		if (!obj) {
			return '';
		}
		try {
			return jQuery.toJSON(obj);
		} catch (ex) {
			return JSON.stringify(obj);
		}
	}
	
	,getCookie : function() {
		var cookieVal = Url.decodeComponent((new CookieHandler()).getCookie(cookieName));
		if (this.isValidJson(cookieVal)) {
			return this.parseJSON(cookieVal);
		}
		return cookieVal;
	}
	
	,setCookie : function(val, cookieName, expiration) {
		var cookieVal = '';
		if (typeof(val) == 'object') {
			cookieVal = this.toJSON(val);
		} else if (typeof(val) == 'string' || typeof(val) == 'number') {
			cookieVal = val;
		} else {
			return false;	
		}
		(new CookieHandler()).setCookie(
			cookieName,
			Url.encodeComponent(cookieVal),
			expiration
		);
	}

	,getJSONCookie: function(cookieName){
		var cookieVal = Url.decodeComponent((new CookieHandler()).getCookie(cookieName));
		if (!this.isValidJson(cookieVal)) {
			return {};
		}
		return this.parseJSON(cookieVal);
	}

	,setJSONCookie: function(vals, cookieName, expiration){
		var cookieVal = this.toJSON(vals);
		(new CookieHandler()).setCookie(
			cookieName,
			Url.encodeComponent(cookieVal),
			expiration
		);
	}

	// convert case-sensitve to insensitive ids
	,convert15To18 : function (id) {
		if (id == null || id.length == 18) {
			return id;
		} else if (id.length != 15) {
			return null;
		} else {
			var suffix = "";
			for (var i = 0; i < 3; i++) {
				var flags = 0;
				for (var j = 0; j < 5; j++) {
					var c = id.charAt(i * 5 + j);
					if (c >= 'A' && c <= 'Z') {
						flags += 1 << j;
					}
				}
				if (flags <= 25) {
					suffix += "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(flags);
				} else {
					suffix += "012345".charAt(flags-26);
				}
			}
			return id + suffix;
		}
	}

	,getParam : function (name, targetURL) {
		if (!targetURL) {
			targetURL = window.location.href;
		} else if (targetURL.indexOf('?') == -1) {
			targetURL = '?' + targetURL;
		}
		var regexS = "[\\?&]+"+name+"=([^&#]*)";
		var regex = new RegExp( regexS, "i" );
		var results = regex.exec( targetURL );
		if( results == null )
			return "";
		else
			return results[1];
	}

	,cleanUrlData : function(val) {
		if (!val) {
			return '';  
		}
		val = val.replace(/\+/g, " ");
		val = val.replace(/[',"]/g,"");
		val = val.replace(/\t/g, "");
		val = val.replace(/\n/g, "");
		val = val.toLowerCase();
		return val;
	}

	,deDupe : function(list) {
		// accepts only array
		if (!list || typeof(list) == 'string') {
			return '';
		}

		var lastValue = '', i = 0;
		list.sort();
		while (i < list.length) {
			if (list[i] == lastValue) {
				list.splice(i, 1);
			} else {
				lastValue = list[i];
				i++;
			}
		}
		return list;
	}

	,getMeta : function (name) {
		var content = '';
		if (typeof(jQuery) != 'undefined') {
			jQuery('meta').each(function(){
				if (jQuery(this).attr('name') == name) {
					content = jQuery(this).attr('content');
					return false;
				}
			});
		}
		return content;
	}

	,getHref : function (linkObj) {
		try {
			if (linkObj.href && !(linkObj.href == document.location.href || linkObj.href == '#' || linkObj.href.indexOf(document.location.href + '#') > -1)) {
				return linkObj.href;
			} else if (!(linkObj.getAttribute('sfdc:href') == '' || linkObj.getAttribute('sfdc:href') == null)) {
				return linkObj.getAttribute('sfdc:href');
			} else {
				return '';	
			}
		} catch (ex) {
			return '';	
		}
	}
	
	,getDriver : function (clickedUrl) {
		if (!clickedUrl) {
			return '';
		} else if (Util.getParam('d', clickedUrl) && Util.getParam('d', clickedUrl).length != 15) {
			clickedUrl = clickedUrl.replace('?d=' + Util.getParam('d', clickedUrl), '?');
			clickedUrl = clickedUrl.replace('&d=' + Util.getParam('d', clickedUrl), '&');
		}
		if (!document.location.search) {
			return clickedUrl;
		}
		
		var qParams = document.location.search.substring(1).split('&');
		if (clickedUrl.indexOf('?') + 1 == clickedUrl.length) {
			clickedUrl = clickedUrl.substring(0, clickedUrl.length - 1);
		}
		for (var i=0; i<qParams.length; i++) {
			var param = qParams[i].substring(0, qParams[i].indexOf('='));
			if (Util.getParam(param)) {
				// if clickedUrl has this param, replace
				// else append
				var from = param + '=' + this.getParam(param, clickedUrl), to = param + '=' + this.getParam(param);
				if (this.getParam(param, clickedUrl)) {
					clickedUrl = clickedUrl.replace('?' + from, '?' + to);
					clickedUrl = clickedUrl.replace('&' + from, '&' + to);
				} else {
					clickedUrl += (clickedUrl.indexOf('?') > -1 ? '&' : '?') + to;
				}
			}
		}
		if (Util.getParam('d', clickedUrl) && Util.getParam('d', clickedUrl).length != 15) {
			clickedUrl = clickedUrl.replace('?d=' + Util.getParam('d', clickedUrl), '?');
			clickedUrl = clickedUrl.replace('&d=' + Util.getParam('d', clickedUrl), '&');
		}
		return clickedUrl;	
	}
}

/**
*
*  URL encode / decode
*
**/
var Url = {
	encode : function (string) {
		if (!string && string != null) {
			return '';
		}
		try {
			string = encodeURI(string);
		} catch(ex) {
			string = escape(string);
		}
		return string;
	}

	,decode : function (string) {
		if (!string && string != null) {
			return '';
		}
		try {
			string = decodeURI(string);
		} catch(ex) {
			string = unescape(string);
		}
		return string;
	}

	,encodeComponent : function (string) {
		if (!string && string != null) {
			return '';
		}
		try {
			string = encodeURIComponent(string);
		} catch(ex) {
			string = escape(string);
		}
		return string;
	}

	,decodeComponent : function (string) {
		if (!string && string != null) {
			return '';
		}
		try {
			string = decodeURIComponent(string);
		} catch(ex) {
			string = unescape(string);
		}
		return string;
	}
}

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
var Base64 = {
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		
		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
			
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			
			output = output + String.fromCharCode(chr1);
			
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}

		output = Base64._utf8_decode(output);

		return output;
	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {
			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}

		return string;
	}
}

var Server = {
	network : 'salesforce.com'
	,account : 'salesforcemarketing'
	,stagingDomains : ['internal.salesforce.com','soma.salesforce.com','sfdc.net','localhost']

	,getNetwork : function() {
		for (var i in this.stagingDomains) {
			if (self.location.href.indexOf(this.stagingDomains[i]) > 0) {
				this.network = this.stagingDomains[i];
				break;
			}
		}
		return this.network;
	}

	,getAccount : function() {
		if (!this.isProduction()) {
			this.account = 'salesforcedev2';
		}
		return this.account;
	}

	,isProduction : function() {
		return (this.getNetwork()=='salesforce.com');
	}

	,isStage : function() {
		return !this.isProduction();
	}
}

var Targeter = {
	xhr			: null
	,vendor		: ''
	,keys: {
		bizo	: '1df634db858d4db6bedd51db738acaf6'
		,db		: '09dd7a8bed725339af3ce985f86800730b42b5cf'
	}
	,urls: {
		bizo 	: 'api.bizographics.com/v1/profile.json?api_key='
		,db 		: 'api.demandbase.com/api/v2/ip.json?token='
	}
	,buildXhr : function(vendor) {
		if (vendor == this.vendor && this.xhr != null) {
			return this.xhr;
		} else {
			this.xhr = null;
			this.vendor = vendor;
		}
		if (window.XMLHttpRequest && !(window.ActiveXObject)) {
			try {
				this.xhr = new XMLHttpRequest();
			} catch(ex) {}
		} else if (window.XDomainRequest) {
			try {
				this.xhr = new XDomainRequest();
				this.method = 'xdomain';
			} catch(ex) {}
		} else if (window.ActiveXObject) {
			try {
				this.xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(ex) {
				try {
					this.xhr = new ActiveXObject("Microsoft.XMLHTTP");
				} catch(ex) {}
			}
		}
		return this.xhr;
	}
	,getUrl : function(vendor) {
		var url = document.location.protocol + '//' + this.urls[vendor] + this.keys[vendor];
		if (vendor == 'db' && url.indexOf('https:') > -1) {
			url = url.replace('api.', 'ssl.');
		}
		return url;
	}
	,getData : function(vendor) {
		try {
			var targ = this;
			var url = this.getUrl(vendor);
			this.xhr = this.buildXhr(vendor);
			if (this.method == 'xdomain') {
				this.xhr.open('GET', url);
				this.xhr.onload = function() {
					return targ.processData(vendor, this.responseText);	
				}
			} else {
				this.xhr.open('GET', url, true);
				this.xhr.onreadystatechange = function() {
					if (this.readyState == 4) {
						if (this.status == 200) {
							return targ.processData(vendor, this.responseText);
						}
					}
				};

			}
			this.xhr.send();
		} catch(ex) { }
	}
	,processData : function(vendor, data) {
		if (!Util.isValidJson(data)) {
			return false;
		}
		data = Util.parseJSON(data);
		try {
			if (vendor == 'db') {
				vp.activityData.db = { 'name' : data.company_name.toLowerCase(), 'size' : data.company_size.toLowerCase(), 'ind' : (data.industry + (data.sub_industry ? ':' + data.sub_industry : '')).toLowerCase() };
			} else if (vendor == 'bizo') {
				vp.activityData.bizo = { 'size' : data.bizographics.company_size.name.toLowerCase(), 'ind' : (data.bizographics.industry[0].name + (data.bizographics.industry[1] ? ':' + data.bizographics.industry[1].name : '')).toLowerCase() };
			}
			vp.saveActivityData();
			return true;
		} catch(ex) {
			return false;	
		}
	}
};

/**
*
*  Javascript cookies
*  http://www.webtoolkit.info/
*
**/
function CookieHandler() {
	this.setCookie = function (name, value, seconds) {

		var expires = "";
		var expiresNow = "";
		var date = new Date();
		date.setTime(date.getTime() + (-1*1000));
		expiresNow = "; expires=" + date.toGMTString();

		if (typeof(seconds) != 'undefined') {
			date.setTime(date.getTime() + (seconds*1000));
			expires = "; expires=" + date.toGMTString();
		}

		// fix production scoping issues
		// keep writing the old cookie, but make it expire
		document.cookie = name + "=" + value + expiresNow + "; path=/";
		// now just set the right one
		document.cookie = name + "=" + value + expires + "; path=/; domain=.salesforce.com";
	}

	this.getCookie = function (name) {
		name = name + "=";
		var carray = document.cookie.split(';');

		for(var i=0;i < carray.length;i++) {
			var c = carray[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
			}

			return null;
		}

		this.deleteCookie = function (name) {
		this.setCookie(name, "", -1);
	}
}

/**
* Visitor Profile 
* @author jburbridge
* @since w156.3
* ***********************************************/
function VisitorProfile() {
	this.version = 'w168.11.3';

	// get all the profile and activity data from cookies
	this.profileData = Util.getJSONCookie('appxud');
	this.activityData = Util.getJSONCookie('webact');
	
	// get the oinfo cookie values
	var orgStatus = this.OrgInfo.getStatus();
	var orgType = this.OrgInfo.getType();

	// prepare timestamp
	var now = new Date();
	this.timestamp = now.getTime();

	// check if the activity cookie for known free trial
	// or set a new one if the oinfo cookie says they do
	if (!this.isTrialUser()) {
		if (orgStatus=='TRIAL') {
			this.activityData['trial'] = this.timestamp;
		}
	}

	// now check whether they have a valid customer cookie
	if (!this.isCustomer()) {
		if ((orgStatus == 'ACTIVE' || orgStatus == 'DEMO' || orgStatus == 'FREE')
			&& (orgType != 'ME' && orgType != 'DE')) {
			this.activityData['customer'] = this.timestamp;
		}
	}

	// are they a developer?
	if (!this.isDeveloper()) {
		if (orgType == 'DE') {
			this.activityData['developer'] = this.timestamp;
		}
	}
	
	// get demographics
	this.bizo = Targeter.getData('bizo');
	this.db = Targeter.getData('db');
	
	// update session details
	if (this.isNewSession()) {
		this.activityData['l_vdays'] = this.isNewVisitor() ? -1 : Math.round((this.timestamp - this.lastVisit()) / (1000*60*60*24));
		this.activityData['l_visit'] = this.getSession();
		this.activityData['session'] = this.timestamp;
		this.activityData['l_search'] = '';
		this.activityData['l_dtype'] = '';
		this.activityData['l_page'] = '';
		if (this.lastVisit() >= this.firstVisit()) {
			this.activityData['counter']++;
			this.activityData['pv'] = 0;
		}
	}
	this.idle = this.sessionTimer();
	this.activityData['session'] = this.timestamp;
	
	// set new visitor details
	if (this.isNewVisitor()) {
		this.activityData['counter'] = 0;
		if (this.firstVisit() == 0) {
			this.activityData['f_visit'] = this.timestamp;
			this.activityData['version'] = this.version;
		}
	}

	/* TODO:
	* create an entry to pick-up demo center vistors
	* and form completes from contact me pages
	*/

	this.saveActivityData();
}

/**
* Cookie / JSON Utils
**************************************************/
VisitorProfile.prototype.getCookieData = function(cookieName) {
	this.cookiejar = new CookieHandler();
	return this.cookiejar.getCookie(cookieName);
}

VisitorProfile.prototype.getBase64Cookie = function(cookieName) {
	return Base64.decode(unescape(this.getCookieData(cookieName)));
}

/**
* Methods for handling activities
**************************************************/
VisitorProfile.prototype.saveActivityData = function() {
	Util.setJSONCookie(this.activityData, 'webact', 60*60*24*365); // exp 1 year
	return true;
}

VisitorProfile.prototype.getActivity = function(propertyName) {
	// always return an empty string instead of a null
	// so we can safely print back to form values easily
	if (this.activityData != null) {
		return (this.activityData[propertyName] != null ? this.activityData[propertyName] : '');
	} else {
		return '';
	}
}

VisitorProfile.prototype.getScore = function(scoreName) {
	var scores = this.getActivity('scores');
	if (scores && typeof(scores) == 'object') {
		return scores[scoreName];
	}
}

VisitorProfile.prototype.saveScores = function(scores) {
	if (!this.getActivity('scores')) {
		this.activityData.scores = { 'sa':0, 'se':0, 'cu':0, 'co':0, 'sm':0, 'to':0 };
	}

	if (typeof(scores) == 'object') {
		// save all
		var clouds = new Array('sa', 'se', 'cu', 'co', 'sm', 'to');
		for (var i=0; i<clouds.length; i++) {
			if (this.activityData.scores[clouds[i]] == null) {
				this.activityData.scores[clouds[i]] = 0;  
			}
			if (scores[clouds[i]] == null) {
				scores[clouds[i]] = 0;
			}
			this.activityData.scores[clouds[i]] = Math.round((parseFloat(this.activityData.scores[clouds[i]]) + parseFloat(scores[clouds[i]])) * 100) / 100;
		}

		this.saveActivityData();
	}
}

VisitorProfile.prototype.getTargeting = function(vendor, attr) {
	if (vendor && attr) {
		var obj = this.getActivity(vendor);
	
		if (this.getActivity(vendor)) {
			return this.getActivity(vendor)[attr] ? this.getActivity(vendor)[attr] : '';
		}
	}
	return '';
}

// TODO: work in progress
VisitorProfile.prototype.profileObj={
	type:"",
	level:0
};

VisitorProfile.prototype.getProfileLevel = function() {
	//customer profiling
	if (this.isCustomer()) {
		// set type
		this.profileObj.type="c";
		this.profileObj.level=0;
		// set level - default is 0
		if (this.isDeveloper()) {
			this.profileObj.level=1;
		}
	} else {
		//prospect profiling
		// set type
		this.profileObj.type="p";
		if (this.isNewVisitor()) {	// new visitor
			if ((!this.isTrialUser()) && (!this.lastDemoCenter())) {
				this.profileObj.level=0;
			}
		} else {	//repeat visitors
			if ((!this.isTrialUser()) && (!this.lastDemoCenter())) {
				this.profileObj.level=1;
			}
			if ((!this.isTrialUser()) && (this.lastDemoCenter())) {
				this.profileObj.level=2;
			}
			if ((this.isTrialUser()) && (!this.lastDemoCenter())) {
				this.profileObj.level=3;
			}
			if ((this.isTrialUser()) && (this.lastDemoCenter())) {
				this.profileObj.level=4;
			}
			if (this.isDeveloper()) {
				this.profileObj.level=5;
			}
		}
	}
}

// precedence is important here!
VisitorProfile.prototype.getType = function() {
	if (this.isEmployee()) {
		return 'employee';
	} else if (this.isCustomer()) {
		return 'customer';
	} else if (this.isDeveloper()) {
		return 'developer';
	} else if (this.getUserEmail()) {
		return 'known prospect';
	} else {
		return 'anonymous';
	}
}

VisitorProfile.prototype.getTypeDetailed = function() {
	return this.getType() + ':' + (this.isTrialUser() ? 'has-trial' : 'no-trial');
}

VisitorProfile.prototype.isEmployee = function() {
	var login = this.getCookieData('login');
	var domains = ['@salesforce.com','@supportforce.com','@dreamforce.com'];
	if (login) {
		for (var d in domains) {
			if (login.indexOf(domains[d]) > 0) {
				return true;
				break;
			}
		}
	}
	return false;
}

VisitorProfile.prototype.isCustomer = function() {
	return (this.getActivity('customer') > 0);
}

VisitorProfile.prototype.isDeveloper = function() {
	return (this.getActivity('developer') > 0);
}

VisitorProfile.prototype.isTrialUser = function() {
	return (this.getActivity('trial') > 0);
}

VisitorProfile.prototype.hasCurrentTrial = function() {
	// if trial login within 30 days
	// or if trial form within 30 days
	var converter = 1000 * 60 * 60 * 24;
	if (((this.timestamp - this.getActivity('trial')) / converter) <= 30) {
		return true;
	} else if (((this.timestamp - this.getActivity('signup')) / converter) <= 30) {
		return true;
	} else {
		return false;
	}
}

VisitorProfile.prototype.getVisitNumber = function() {
	return (this.getActivity('counter') > 0 ? this.getActivity('counter') : 0) + 1; // starts from 1
}

VisitorProfile.prototype.isNewVisitor = function() {
	return (this.lastVisit()==0);
}

VisitorProfile.prototype.lastFreeTrial = function() {
	return (this.getActivity('trial') > 0 ? this.getActivity('trial') : 0);
}

VisitorProfile.prototype.lastContactMe = function() {
	return (this.getActivity('contact') > 0 ? this.getActivity('contact') : 0);
}

VisitorProfile.prototype.lastDemoCenter = function() {
	return (this.getActivity('demo') > 0 ? this.getActivity('demo') : 0);
}

VisitorProfile.prototype.lastVisit = function() {
	return (this.getActivity('l_visit') > 0 ? this.getActivity('l_visit') : 0);
}

VisitorProfile.prototype.getDaysSinceLastVisit = function() {
	if (this.getActivity('l_vdays') == -1) {
		return 'First Visit';
	} else if (this.getActivity('l_vdays') > -1 && this.getActivity('l_vdays') <= 1) {
		return 'Less than 1 day';
	} else if (this.getActivity('l_vdays') > 1 && this.getActivity('l_vdays') <= 7) {
		return 'Less than 7 days';
	} else if (this.getActivity('l_vdays') > 7 && this.getActivity('l_vdays') <= 30) {
		return 'More than 7 days';
	} else if (this.getActivity('l_vdays') > 30) {
		return 'More than 30 days';
	} else {
		return 'Cookies Not Supported';	
	}
}

VisitorProfile.prototype.firstVisit = function() {
	return (this.getActivity('f_visit') > 0 ? this.getActivity('f_visit') : 0);
}

VisitorProfile.prototype.getSession = function() {
	return (this.getActivity('session') > 0 ? this.getActivity('session') : 0);
}

VisitorProfile.prototype.isNewSession = function() {
	var sessionLength = 30*60;	// 30 mins
	if (this.sessionTimer() > sessionLength || this.newSession) {
		this.newSession = true;
	} else {
		this.newSession = false;   
	}
	return this.newSession;
}

// returns number of seconds since this session started
VisitorProfile.prototype.sessionTimer = function() {
	return (this.timestamp - this.getSession()) / 1000;
}

VisitorProfile.prototype.getIdleTime = function() {
	var i = vp.idle;
	if (0 == i) {
		return 'No Previous SFDC Page';
	} else if (0 < i && i <= 2) {
		return '< 2 Seconds';
	} else if (2 < i && i <= 5) {
		return '2-5 Seconds';
	} else if (5 < i && i <= 10) {
		return '6-10 Seconds';
	} else if (10 < i && i <= 15) {
		return '11-15 Seconds';
	} else if (15 < i && i <= 20) {
		return '16-20 Seconds';
	} else if (20 < i && i <= 30) {
		return '21-30 Seconds';
	} else if (30 < i && i <= 60) {
		return '31-60 Seconds';
	} else if (60 < i && i <= 120) {
		return '1-2 Minutes';
	} else if (120 < i && i <= 180) {
		return '2-3 Minutes';
	} else if (180 < i && i <= 300) {
		return '3-5 Minutes';
	} else {
		return '> 5 Minutes';
	}
}

VisitorProfile.prototype.getFirstFormCompleteTime = function() {
	if(this.getActivity('f_form')) {
		return  '';
	}
	// save timestamp
	this.activityData['f_form'] = this.timestamp;
	this.saveActivityData();
	
	var i = (this.getActivity('f_form') - this.getActivity('f_visit')) / 1000;
	var h = 60, m = 60, d = 24;
	if (i <= 0) {
		return 'No Time Available';	
	} else if (i < (5 * m)) {
		return '< 5 minutes';
	} else if (i < (10 * m)) {
		return '5-10 minutes';
	} else if (i < (30 * m)) {
		return '10-30 minutes';
	} else if (i < (2 * m * h)) {
		return '30 minutes to 2 hours';
	} else if (i < (5 * m * h)) {
		return '2-5 hours';
	} else if (i < (1 * m * h * d)) {
		return '5 hours to 1 day';
	} else if (i < (2 * m * h * d)) {
		return '1-2 days';
	} else if (i < (7 * m * h * d)) {
		return '2-7 days';
	} else if (i < (14 * m * h * d)) {
		return '1-2 weeks';
	} else {
		return '> 2 weeks';
	}
}

VisitorProfile.prototype.getVersion = function() {
	return this.getActivity('version');
}

/**
* OrgInfo provides org status and type
**************************************************/
VisitorProfile.prototype.OrgInfo = {
	// read the oinfo cookie
	cookieData : VisitorProfile.prototype.getBase64Cookie('oinfo')

	,getStatus : function() {
		return Util.getParam('status',this.cookieData).toUpperCase();
	}

	,getType : function() {
		var values = ['TE','PE','EE','DE','ME','UE'];
		var orgType = Util.getParam('type',this.cookieData);
		return values[orgType] ? values[orgType] : '';
	}
}

/**
* WebCmp provides driver and campaign member id
**************************************************/
VisitorProfile.prototype.WebCmp = {
	driver : ''
	,campaignMemberId: ''
	,formCampaignId : ''
	,formCampaignMemberId : ''
	
	// read the webcmp cookie
	,cookieData : VisitorProfile.prototype.getBase64Cookie('webcmp')

	,getDriver : function() {
		if (!this.driver) {
			this.driver = Util.getParam('d',this.cookieData);
			this.nuke('d');
		}
		return (this.driver != null ? this.driver : '');
	}
	
	,getCampaignMemberId : function() {
		if (!this.campaignMemberId) {
			this.campaignMemberId = Util.getParam('cm',this.cookieData);
			this.nuke('cm');
		}
		return (this.campaignMemberId != null ? this.campaignMemberId : '');
	}
	
	,getFormCampaignMemberId : function() {
		if (!this.formCampaignMemberId) {
			this.formCampaignMemberId = Util.getParam('fcm',this.cookieData);
			this.nuke('fcm');
		}
		return (this.formCampaignMemberId != null ? this.formCampaignMemberId : '');
	}
	
	,getFormCampaignId : function() {
		if (!this.formCampaignId) {
			this.formCampaignId = Util.getParam('fc',this.cookieData);
			this.nuke('fc');
		}
		return (this.formCampaignId != null ? this.formCampaignId : '');
	}
	
	,nuke : function(params) {
		// nuke only passed params if available
		if (params) {
			params = params.split(',');
			for (var i in params) {
				var arg = params[i]+'='+Util.getParam(params[i], this.cookieData);
				this.cookieData = this.cookieData.replace('&'+arg, '');
				this.cookieData = this.cookieData.indexOf(arg) == 0 ? this.cookieData.replace(arg, '') : this.cookieData;
			}
			VisitorProfile.prototype.cookiejar.setCookie('webcmp', Base64.encode(this.cookieData), 60*60*24*365); // exp 1 year
		}

		// else nuke whole cookie
		if (!params || !this.cookieData) {
			this.driver = this.driver ? this.driver : Util.getParam('d',this.cookieData);
			this.campaignMemberId = this.campaignMemberId ? this.campaignMemberId : Util.getParam('cm',this.cookieData);
			this.formCampaignId = this.formCampaignId ? this.formCampaignId : Util.getParam('fc',this.cookieData);
			this.formCampaignMemberId = this.formCampaignMemberId ? this.formCampaignMemberId : Util.getParam('fcm',this.cookieData);
			VisitorProfile.prototype.cookiejar.deleteCookie('webcmp');
		}
	}
}

/**
* Methods for handling profile details
**************************************************/
VisitorProfile.prototype.getProperty = function(propertyName) {
	// always return an empty string instead of a null
	// so we can safely print back to form values easily
	if (this.profileData != null) {
		return (this.profileData[propertyName] != null ? this.profileData[propertyName] : '');
	} else {
		return '';
	}
}

// this is typically an array
VisitorProfile.prototype.getProductInterests = function() {
	return this.getProperty('pi');
}

VisitorProfile.prototype.getProductInterestsString = function() {
	var interests = this.getProperty('pi');
	if (typeof(interests) == 'string') {
		// check for a string that looks like an array
		if (interests.indexOf('[') == 0 && interests.indexOf(']') == interests.length -1) {
			interests = interests.replace(/['"\[\]]/g, "");
		}
		return interests;
	} else if (typeof(interests) == 'object' && interests.constructor.toString().indexOf('Array') > -1) {
		return interests.join(',');
	}
}

// and this is a string
VisitorProfile.prototype.getPrimaryProductInterest = function() {
	return this.getProperty('ppi');
}

VisitorProfile.prototype.getCompanyEmployees = function() {
	return this.getProperty('emp');
}

VisitorProfile.prototype.getJobTitle = function() {
	return this.getProperty('t');
}

VisitorProfile.prototype.getCompanyName = function() {
	return this.getProperty('c');
}

VisitorProfile.prototype.getCompanyState = function() {
	return this.getProperty('st');
}

VisitorProfile.prototype.getCompanyCountry = function() {
	return this.getProperty('cn');
}

VisitorProfile.prototype.getUserEmail = function() {
	return this.getProperty('e');
}

// now instantiate it
var vp = new VisitorProfile();

/**
* Page Properties
* @author: jburbridge
* @since: w162.1
************************************************/
var Page = {
	name			: null
	,server			: null
	,type			: null
	,driver			: null
	,nameCaptureId	: null
	,leadCaptureForm	: null
	,previous		: null
	,locale			: 'us'
	,ctas			: null
	,errorName		: 'SFDC:error_404'
	
	,setName : function(name) {
		var isError = false;
		if (name == this.errorName) {
			name = '';
			isError = true;
		}
		name = name ? name : document.location.pathname;
		// run our logic if name looks like a URL path
		if (name.indexOf('/') > -1 && name.indexOf(':') < 0) {
			name = name.replace(/\//g,":");
			name = name.replace(/\:index\.jsp/,"");
			name = name.replace(/\.jsp|\.htm(l?)/,"");
			name = this.getServer() + ( name.match(/^\:\w{2}\:/) ? '' : ':us' ) + name;
			name = name.charAt(name.length - 1) == ':' ? name.substring(0, name.length-1) : name;
		}
		this.name = name;
		
		// validate locale and server
		if (!this.isValidServer(this.getPathNode(0))) {
			this.setServer();
			this.name = this.getServer() + (this.name.charAt(0) == ':' ? '' : ':');
		}
		if (!this.isValidLocale(this.getPathNode(1))) {
			var nameNodes = this.name.split(':');
			nameNodes.splice(1, 0, this.locale);
			this.name = nameNodes.join(':');
		}
		if (isError) {
			this.name = this.errorName.replace(this.getServer() + ':', this.getServer() + ':' + this.getLocale() + ':');
		}
		
		// fix misplaced demos
		if (this.name.indexOf(':assets:swf:youtube_players') > -1) {
			this.name = this.name.replace(':assets:swf:youtube_players', ':form:conf');
			this.isDemoDirectory = true;
		}
		
		// identify confs
		if (this.isConfirmation() && !this.isError()) {
			this.name = this.name + ':[conf]';
		
			// detect free trial confirmations
			if (document.location.pathname.indexOf('/SignupServlet') != -1) {
				vp.activityData['signup'] = vp.timestamp; // will be saved by this.setPrevious()
			}
		}
	
		// manipulate login pagename
		this.name = vp.hasCurrentTrial() && !vp.isCustomer() && !vp.isEmployee() ? this.name.replace(/login/, 'login:freetrial') : this.name;
		this.name = vp.getType() == 'developer' && this.name.indexOf('login:freetrial') == -1 ? this.name.replace(/login/, 'login:developer') : this.name;

		// set previous page
		this.setPrevious();

		return this.name;
	}

	,getName : function() {
		if (this.name == null) {
			this.setName(typeof(omni_path) != 'undefined' ? omni_path : null);
		}
		return this.name;
	}

	,setPrevious : function() {
		this.previous = vp.getActivity('l_page');
		vp.activityData['l_page'] = this.name;
		if (vp.activityData['pv'] == null) {
			vp.activityData['pv'] = 0;
		}
		vp.activityData['pv']++;
		vp.saveActivityData();
		return this.previous;
	}

	,getPrevious : function() {
		if (this.previous == null) {
			this.setPrevious();
		}
		return this.previous;
	}

	,getNameNoLocale : function() {
		// replace only first occurrence  
		return this.getName().replace(':' + this.getLocale() + ':', ':');  
	}

	,isConfirmation : function() {
		return ((this.getName().indexOf(':conf:') != -1) ||
			(this.getName().indexOf('[conf]') != -1) ||
			(this.endsWith(this.getName(), 'conf')) ||
			(document.location.pathname.indexOf('_conf.jsp') != -1) ||
			(document.location.pathname.indexOf('SignupServlet') != -1) ||
			(document.location.pathname.indexOf('LeadCaptureServlet') != -1));
	}
	
	,isCareersConfirmation : function() {
		return this.getName().indexOf(':careers:career-apply-confirm') > -1;
	}

	,isLogin : function() {
		return (this.getName().match(/SFDC\:\w{2}\:login/) != null);
	}

	,is404 : function() {
		return this.getName().indexOf('error_404') > -1;  
	}

	,isError : function() {
		return (this.getName().indexOf('error') != -1 && this.isConfirmation());
	}
	
	,isSearchResults : function() {
		return (this.getName().indexOf('site-search') > -1);
	}
	
	,isAjax : function() {
		// should we delay tracking? (right now only on search results
		return this.isSearchResults();
	}

	,getSearchTerm : function() {
		if (this.isSearchResults()) {
			var searchTerm = document.getElementById('searchOnText') ? document.getElementById('searchOnText').value : Util.getParam('q');
			searchTerm = Util.cleanUrlData(searchTerm);
			vp.activityData['l_search'] = searchTerm;
			vp.saveActivityData();
			return searchTerm != null && searchTerm != 'null' ? searchTerm : '';
		} else {
			return '';
		}
	}
	
	,getSearchLocale : function() {
		var locale = '';
		if (this.isSearchResults()) {
			locale = document.getElementById('langCode') ? document.getElementById('langCode').value.toLowerCase() : '';
			if (locale.indexOf('_') > -1) {
				locale = locale.substring(locale.indexOf('_') + 1);
			} else if (!locale) {
				locale = '[NO LOCALE USED]';
			}
		}
		return locale;
	}

	,getNumSearchResults : function() {
		if (this.isSearchResults()) {
			var results = '', count = 0;
			try {
				results = jQuery('.gsc-cursor-page:last').html();
				results = results == null ? '0' : results;
				results = results.indexOf('(') == 0 ? results.substring(1) : results;
				results = results.lastIndexOf(')') == results.length - 1 ? results.substring(0, results.length - 1) : results;
				if ((/^\d+$/).test(results)) {
					results = parseInt(results);
					return results == 0 ? 'zero search results' : (results * 8 - 7).toString() + " - " + (results * 8).toString();
				} else {
					return '[NUMBER OF RESULTS NOT AVAILABLE]';
				}
			} catch (ex) { }
		}
		return '';
	}

	,isHome : function() {
		return this.getName().indexOf('homepage') > -1;
	}
	
	,isDemoConfirmation : function() {
		return this.isDemo() && this.isConfirmation();
	}
	
	,isDemo : function() {
		return (this.getName().indexOf('demo:') > -1 || this.getName().indexOf('demo-') > -1 || this.getName().indexOf('demos') > -1 || this.getName().indexOf('demo_') > -1 || this.isDemoDirectory) ||
			(this.isConfirmation() && this.getPrevious().indexOf('demo') > -1);
	}
	
	,isSignup : function() {
		return this.getName().indexOf('signup') > -1 || this.getName().indexOf('trial') > -1;  
	}
	
	,isPricing : function() {
		return this.getName().indexOf('editions-pricing') > -1 || this.getName().indexOf('pricing-editions') > -1 || this.getName().indexOf('platform-edition') > -1;
	}

	,isProductCategory : function() {
		var ew = [ ':crm:sales-force-automation', ':crm:customer-service-support', ':platform', ':chatter' ];
		for (var i=0; i<ew.length; i++) {
			if (this.endsWith(this.getName(), ':' + this.getLocale() + ew[i])) {
				return true;
			}
		}
		return false;
	}

	,isProduct : function() {
		return !this.isProductCategory() && (this.getName().indexOf(':crm') > -1 || this.getName().indexOf(':products') > -1 || this.getName().indexOf(':industries') > -1 || this.getName().indexOf(':platform') > -1 || this.getName().indexOf(':chatter') > -1 || this.getName().indexOf(':smallbusinesscenter') > -1);
	}
	
	,isEvents : function() {
		var ew = ':events';
		return this.getName().indexOf(ew + ':') > -1 || this.endsWith(this.getName(), ew);
	}
	
	,endsWith : function(val1, val2) {
		if (!(val1 || val2) || val1.indexOf(val2) == -1) {
			return false;
		} else {
			if (val1.indexOf(val2) + val2.length == val1.length) {
				return true;
			}
		}
		return false;
	}

	,isValidLocale : function(locale) {
		var validLocales = ['ap','au','br','cn','de','dk','es','eu','fi','fr','in','it','jp','kr','mx','ne','nl','no','se','th','tw','uk','us'];
		for (var i=0; i<validLocales.length; i++) {
			if (locale == validLocales[i]) {
				return true;  
			}
		}
		return false;
	}
	
	,isValidServer : function(server) {
		var validServers = ['SFDC', 'APPX', 'STOR', 'LMS', 'TRUST'];
		for (var i=0; i<validServers.length; i++) {
			if (server == validServers[i]) {
				return true;
			}
		}
		return false;
	}

	,getLeadCaptureForm : function() {
		if (this.leadCaptureForm==null) {
			for (var i in document.forms) {
				f = document.forms[i];
				if (null != f.name && ("reg_form" == f.name || "signup_form" == f.name)) {
					this.leadCaptureForm = f;
					break;
				}
			}
		}
		return this.leadCaptureForm;
	}

	,hasLeadCaptureForm : function() {
		return (this.getLeadCaptureForm() != null);
	}

	,isFormBuilderForm : function() {
		return this.hasLeadCaptureForm() ? (this.leadCaptureForm.className.indexOf('form-builder-form') > -1 ? true : false) : false;
	}

	,getNameCaptureId : function() {
		var nc = 'FormCampaignId', ncAlt = 'radio1'; // aka namecapture campaign id; ncAlt is only for old event reg forms
		if (this.hasLeadCaptureForm() && this.leadCaptureForm.elements[nc] != null && !this.nameCaptureId) {
			this.nameCaptureId = Util.convert15To18(this.leadCaptureForm.elements[nc].value);
			if (!this.nameCaptureId && this.leadCaptureForm.elements[ncAlt] != null) {
				this.nameCaptureId = Util.convert15To18(this.leadCaptureForm.elements[ncAlt][0].value);
			}
		}
		return this.nameCaptureId == null ? '' : this.nameCaptureId;
	}
	
	,setNameCaptureId : function(formId) {
		this.nameCaptureId = Util.convert15To18(formId);
	}
	
	,getTestName : function() {
		var fn = 'tntName';
		if (this.hasLeadCaptureForm() && this.leadCaptureForm.elements[fn] != null && !this.testName) {
			this.testName = this.leadCaptureForm.elements[fn].value;
			this.leadCaptureForm.elements[fn].value = '';
		}
		return this.testName == null ? '' : this.testName;
	}

	,getType : function() {
		var pageTypes = [
			{ name:'Form Page', cb:'hasLeadCaptureForm' }
			,{ name:'Form Error Page', cb:'isError' }
			,{ name:'Login Page', cb:'isLogin' }
			,{ name:'404 Error Page', cb:'is404' }
			,{ name:'Search Results Page', cb:'isSearchResults' }
			,{ name:'Home Page', cb:'isHome' }
			,{ name:'Confirmation Page', cb:'isConfirmation' }
			,{ name:'Demo Page', cb:'isDemo' }
			,{ name:'Pricing and Editions Page', cb:'isPricing' }
			,{ name:'Customer Testimonial Page', pm:'customers,success_stories' }
			,{ name:'Events Page', cb:'isEvents' }
			,{ name:'Video Page', pm:'video' }
			,{ name:'Careers Page', pm:'company:careers' }
			,{ name:'Press Release Page', pm:'news-press:press-releases' }
			,{ name:'Company Page', pm:'company' }
			,{ name:'Dreamforce Page', pm:'dreamforce' }
			,{ name:'Services: Training Page', pm:'services-training:training_certification' }
			,{ name:'Services: Support Page', pm:'services-training:customer-support' }
			,{ name:'Services: Consulting Page', pm:'services-training:professional-services' }
			,{ name:'Support: Partners Page', pm:'services-training:partner-support' }
			,{ name:'Services Page', pm:'services-training' }
			,{ name:'Resource Center Page', pm:'resource_center' }
			,{ name:'Product Category Page', cb:'isProductCategory' }
			,{ name:'Product Page', cb:'isProduct' }
			,{ name:'Country Selector Page', pm:'country_selector' }
			,{ name:'Other Page' }
		];

		for (var i=0; i<pageTypes.length; i++) {
			if (i == pageTypes.length - 1) {
				break;
			} else if (pageTypes[i].cb) {
				if (this[pageTypes[i].cb]()) {
					return pageTypes[i].name;
				}
			} else if (pageTypes[i].pm) {
				var matches = pageTypes[i].pm.split(',');
				for (var j=0; j<matches.length; j++) {
					if (this.getName().indexOf(':' + matches[j] +':') > -1 || this.endsWith(this.getName(), ':' + matches[j])) {
						return pageTypes[i].name;
					}
				}
			}
		}
		return pageTypes[pageTypes.length - 1].name;
	}

	,getCloud : function() {
		var meta = Util.getMeta('pageMetrics'), metrics = '';
		if (!this.cloud) {
			this.cloud = 'No Cloud';
	
			if (meta && Util.isValidJson(meta)) {
				metrics = Util.parseJSON(meta);
				if (metrics.cloud) {
					// upper-case first letter
					this.cloud = (metrics.cloud == 'smb' ? metrics.cloud.toUpperCase() : (metrics.cloud.substring(0, 1).toUpperCase() + metrics.cloud.substring(1))) + ' Cloud';
				}
			}
		}
	
		return this.cloud;
	}

	,getScore: function(name) {
		name = name ? name : 'to';
		if (!this.scores) {
			this.scores = { 'sa':0, 'se':0, 'cu':0, 'co':0, 'sm':0, 'to':0 };
			var meta = Util.getMeta('pageMetrics'), metrics = '';
			var clouds = new Array('sa', 'se', 'cu', 'co', 'sm', 'to');
			if (meta && Util.isValidJson(meta)) {
				metrics = Util.parseJSON(meta);
				if (metrics.scores && typeof(metrics.scores) == 'object') {
					for (var i=0; i<clouds.length; i++) {
						if (metrics.scores[clouds[i]]) {
							this.scores[clouds[i]] = (parseFloat(metrics.scores[clouds[i]])).toFixed(2);
						} else {
							this.scores[clouds[i]] = 0.00;
						}
					}
	
					// only update the score if not a refresh
					if (this.getName() != this.getPrevious()) {
						vp.saveScores(this.scores);
					}
				}
			}
		}
	
		return (this.getName() != this.getPrevious() && this.scores[name]) ? this.scores[name] : '';
	}

	,getPathNode : function(nodeNumber) {
		var nodes = this.getName().split(':');
		var part = (nodeNumber <= nodes.length ? nodes[nodeNumber] : '');
		if (null != part && "" != part) {
			return part.toString();
		} else {
			return "";
		}
	}
	
	,isValidLink : function(linkObj) {
		// nothing that's not a valid link
		// nothing without d=
		// nothing with class 'submit'
		// nothing that's being hidden
		// nothing whose parent(s) are hidden
		// nothing that has id='free-trial-trigger' and vp.getType == 'customer'
		// nothing that has parent with id='nav' or class='sf-menu'
		
		var href = Util.getHref(linkObj), isTracked = true;
		if (!href) {
			return false;
		} else if (!Util.getParam('d', href)) {
			return false;
		} else if ($(linkObj).hasClass('submit')) {
			return false;
		} else if ($(linkObj).attr('id') == 'free-trial-trigger' && vp.isCustomer()) {
			return false;
		} else {
			$(linkObj).parents().each(function(){
				if ($(this).css('display') == 'none' || $(this).css('visibility') == 'hidden') {
					isTracked = false;
					return false;
				} else if ($(this).attr('id') == 'nav' || $(this).hasClass('sf-menu')) {
					isTracked = false;
					return false;
				}
			});
			if (isTracked == false) {
				return false;
			}
		}
		return true;
	}

	,setCTAs : function(ctas, selector) {
		ctas = ctas ? ctas : '';
		selector = selector ? selector : 'a';
		if (this.ctas == null || selector) {
			// if null, find all valid <a> tags with 'd' and load them into the array
			this.ctas = [];
			try {
				(function($, page) {
					$(selector).each(function(){
						if(page.isValidLink(this)) {
							page.ctas[page.ctas.length] = Util.getParam('d', Util.getHref(this)).length == 15 ? Util.convert15To18(Util.getParam('d', Util.getHref(this))) : Util.getParam('d', Util.getHref(this));
						}
					});
				})(jQuery, this);
			} catch(ex) {
				// login page fallback
				var linkObj = document.getElementsByTagName('a');
				for (var i=0; i<linkObj.length; i++) {
					var href = Util.getHref(linkObj[i]);
					if (href && Util.getParam('d', href)) {
						this.ctas[this.ctas.length] = Util.getParam('d', href).length == 15 ? Util.convert15To18(Util.getParam('d', href)) : Util.getParam('d', href);
					}
				}
				return false;
			}
		}
		if (ctas) {
			if (typeof(ctas) == 'string') {
				// if a string is passed in, load it into the array
				this.ctas[this.ctas.length] = ctas;
				
				// if comma-delimited, parse into array and then add to this.ctas
			} else {
				// if an array is passed in, add it to the array
				this.ctas.concat(ctas);
			}
		}
	
		if (this.ctas.length > 0) {
			// remove duplicates
			this.ctas = Util.deDupe(this.ctas);
			return this.ctas.splice(0, (this.ctas.length > 20 ? this.ctas.length - 20 : 0));
		} else {
			return '';  
		}
	}

	,getCTAs : function() {
		if (this.ctas == null) {
			this.setCTAs();
		}
		return this.ctas.length > 0 ? this.ctas : '';
	}

	,getDriver : function() {
		if (this.driver) {
			vp.activityData['l_dtype'] = this.driver.type;
			vp.saveActivityData();
			return this.driver;
		} else if (this.hasInternalReferrer()) {
			if (Util.getParam('d')) {
				return { id:(Util.getParam('d').length == 15 ? Util.convert15To18(Util.getParam('d')) : Util.getParam('d')), type:'internal' };
			} else {
				return false;  
			}
		} else if (this.getReferrer() || Util.getParam('d')) {
			for (var i=0; i<this.driverLookup.types.length; i++) {
				var dt = this.driverLookup.types[i], isType = true;
				if (dt.qp) {
					var params = dt.qp.split(',');
					for (var j=0; j<params.length; j++) {
						if (!Util.getParam(params[j])) {
							isType = false;
							break;
						}
					}
		
					if (isType && Util.getParam('internal') != 'true') {
						var driverID = params[0] == 'd' ? Util.convert15To18(Util.getParam(params[0])) : Util.getParam(params[0]);
						var driver = { id:driverID, type:dt.name };
						if (dt.cb) {
							this.driver = this.driverLookup[dt.cb](driver);
							return this.driver;
						} else {
							this.driver = driver;
							return this.driver;
						}
					}
				} else if (dt.pm) {
					for (var j=0; j<dt.pm.length; j++) {
						var pml = dt.pm[j].ms.split(',');
						for (var z=0; z<pml.length; z++) {
							if (this.getReferrer().indexOf(pml[z]) > -1) {
								this.driver = { id:dt.name + '|' + dt.pm[j].name, type:dt.name };
								return this.driver;
							}
						}
					}
				} else if (dt.cb) {
					// make callback
					this.driver = this.driverLookup[dt.cb](dt);
					if (this.driver) {
						return this.driver;
					}
				}
			}
		} else {
			this.driver = { id:this.driverLookup.types[this.driverLookup.types.length-1].name, type:this.driverLookup.types[this.driverLookup.types.length-1].name };
			return this.driver;
		}
	}

	,getLocale : function() {
		// default to 'us' if node 1 is not exactly 2 chars 
		var matches = this.getPathNode(1).match(/^(\w{2})$/), locale = 'us';
		if (matches != null) {
			locale = this.isValidLocale(matches[0]) ? matches[0] : locale;
		}
		return locale.toLowerCase();
	}
	
	,getChannel : function() {
		var channel = this.getLocale() + ':' + (this.getPathNode(2) ? this.getPathNode(2) : 'other');
		if (this.getPathNode(3) == 'news-press' && this.getPathNode(4) == 'press-releases') {
			channel += ':' + this.getPathNode(3) + ':' + this.getPathNode(4);
		} else if (this.getPathNode(3) == 'careers') {
			channel += ':' + this.getPathNode(3);
		}
		return channel;
	}
	
	,setServer : function() {
		var host = document.location.hostname;
		if (host == 'trust.salesforce.com') {
			this.server = 'TRUST';
		} else {
			this.server = 'SFDC';
		}
		return this.server;
	}
	
	,getServer : function() {
		if (this.server == null) {
			this.setServer();
		}
		return this.server;
	}
	
	,getSegment : function() {
		if (vp.getType()=='employee' || vp.getType()=='customer') {
			return vp.getType()  + ':' + this.getLocale();
		} else {
			return 'non-customer' + ':' + this.getLocale();
		}
	}

	,getFormType : function() {
		if (this.hasLeadCaptureForm()) {
			var n = this.getName();			
			var formFolders = ['form','events','test'];

			for (var i in formFolders) {
				if (n.indexOf(':' + formFolders[i] + ':') != -1) {
					var regex = new RegExp(':' + formFolders[i] + ':(\\w+)\\:');
					var matches = n.match(regex);
					if (matches != null) {
						this.formType = matches[1];
						break;
					}
				}
			}

			// or in the consulting partners directory
			if (n.indexOf(':consulting-partners:') != -1) {
				this.formType = 'consulting-partners';
			} else if (this.formType == '') {
				// if none of the above
				this.formType = 'other: ' + n;
			}
		}
		return (this.formType != null ? this.formType : '');
	}

	,getReferrer : function() {
		if (this.referrer) {
			return this.referrer;	
		} else {
			this.referrer = '';
			if (Util.getParam('r')) {
				this.referrer = Util.getParam('r');
			} else {
				var cookiejar = new CookieHandler();
				var cookieValue = unescape(cookiejar.getCookie('referrer'));
				if (cookieValue != null && cookieValue != 'null') {
					cookiejar.deleteCookie('referrer');
					this.referrer = cookieValue;
				} else if (document.referrer) {
					if (document.referrer.indexOf('google.com/cse') >-1 || Util.getParam('rurl', document.referrer).indexOf('salesforce.com') > -1) {
						this.referrer = 'http://www.salesforce.com/site-search.jsp';
					} else {
						this.referrer = document.referrer;
					}
				}
				// overwrite referrer for search results page
				if (this.getName().indexOf('site-search') > -1) {
					cookiejar.setCookie('referrer',escape(document.location.href),60*60); // 60 minutes
				}
			}
	
			if (this.isLogin() && this.referrer.indexOf('https://login.salesforce.com') == 0) {
				this.referrer = '';
			}
	
			this.referrer = this.referrer.indexOf('://') == -1 ? Url.decodeComponent(this.referrer) : this.referrer;
		}
		return this.referrer;
	}
	
	,hasInternalReferrer : function() {
		var r = this.getReferrer() ? this.getReferrer() : '', internals = [ 'salesforce.com', 'jointheconversations.com', 'opinionlab.com' ];
		r = r.indexOf('?') == -1 ? r : r.substring(0, r.indexOf('?'));
		for (var i=0; i<internals.length; i++) {
			if (r.indexOf(internals[i]) > -1) {
				return true;  
			}
		}
		return false;
	}
}

/**
* Test & Target Integration
* @author: jburbridge
* @since: w160.7
************************************************/
var TnT = {
	globalMbox : 'SFDC:Global'
	,mboxCount : 0
	
	,getMboxName : function(mboxParam) {
		// verify if the mboxParam looks like a complete mbox name
		if (null != mboxParam && mboxParam.indexOf('SFDC:')==0) { 
			return mboxParam;
		} else {
			return (mboxParam != null ? Page.getName() + ':' + mboxParam : this.globalMbox);
		}
	}
	
	,getDefaultParameters : function(mboxParam) {
		var pageCloud = '', pageScore = '', salScore = '', serScore = '', cusScore = '', chaScore = '', smbScore = '', totScore = '';
		this.mboxCount++;
		if (this.mboxCount == 1) {
			pageCloud = Page.getCloud() != 'No Cloud' ? Page.getCloud() : '';
			pageScore = Page.getScore('to');
			salScore = Page.getScore('sa') ? vp.getScore('sa') : '';
			serScore = Page.getScore('se') ? vp.getScore('se') : '';
			cusScore = Page.getScore('cu') ? vp.getScore('cu') : '';
			chaScore = Page.getScore('co') ? vp.getScore('co') : '';
			smbScore = Page.getScore('sm') ? vp.getScore('sm') : '';
			totScore = Page.getScore('to') ? vp.getScore('to') : '';
		}

		var defaultParams = new Array(
			this.getMboxName(mboxParam)
			,'pageName=' + Page.getName()
			,'pageType=' + Page.getType()
			,'user.categoryId=' + pageCloud
			,'mboxPageValue=' + pageScore
			,'profile.dbSize=' + vp.getTargeting('db', 'size')
			,'profile.dbIndustry=' + vp.getTargeting('db', 'ind')
			,'profile.bizoSize=' + vp.getTargeting('bizo', 'size')
			,'profile.bizoIndustry=' + vp.getTargeting('bizo', 'ind')
			,'profile.visitorType=' + vp.getType()
			,'profile.isTrialUser=' + vp.hasCurrentTrial()
			,'profile.visitNumber=' + vp.getVisitNumber()
			,'profile.newVisit=' + vp.isNewSession().toString()
			,'profile.primaryProductInterest=' + vp.getPrimaryProductInterest()
			,'profile.companyEmployeeNumber=' + vp.getCompanyEmployees()
			,'profile.jobTitle=' + vp.getJobTitle()
			,'profile.offerId=' + Page.getNameCaptureId()
			,'profile.searchTerm=' + vp.getActivity('l_search')
			,'profile.totScore=' + totScore
			,'profile.salScore=' + salScore
			,'profile.serScore=' + serScore
			,'profile.cusScore=' + cusScore
			,'profile.chaScore=' + chaScore
			,'profile.smbScore=' + smbScore
			,'profile.driverType=' + vp.getActivity('l_dtype')
		);

		if (Page.isConfirmation()) {
			defaultParams[defaultParams.length] = 'productPurchasedId=' + Page.getName();
			defaultParams[defaultParams.length] = 'orderTotal=' + "1";
			defaultParams[defaultParams.length] = 'orderId=' + vp.WebCmp.getCampaignMemberId();
			defaultParams[defaultParams.length] = 'mbox3rdPartyId=' + vp.WebCmp.getCampaignMemberId();
			defaultParams[defaultParams.length] = 'driverId=' + vp.WebCmp.getDriver();
		}

		for (var i=0; i<defaultParams.length; i++) {
			if (defaultParams[i].indexOf('=') == defaultParams[i].length - 1) {
				defaultParams.splice(i, 1);
				i = i-1;	// reset
			}
		}

		return defaultParams;
	}

	// note: createMbox is ours, but mboxCreate is a T&T function
	,createMbox : function(mboxParam) {
		try {
			var mboxParameters = arguments;
		
			if (arguments.length <= 1) {
				mboxParameters = this.getDefaultParameters(mboxParam);
			} else {
				mboxParameters[0] = this.getMboxName(mboxParam);
			}
	
			return !Util.getParam('qa') ? mboxCreate.apply(this, mboxParameters) : this.disableMboxes();
	
		} catch (exception) {
			if (Server.isStage() && typeof(mboxCreate)!='undefined') {
				alert('T&T integration error while creating an mbox on this page:\n' +
					'Exception: ' + exception.description);
			}
		}
	}

	// note: updateMbox is ours, but mboxUpdate is a T&T function
	,updateMbox : function(mboxParam) {
		try {
			var mboxParameters = arguments;

			if (arguments.length <= 1) {
				mboxParameters = this.getDefaultParameters(mboxParam);
			} else {
				mboxParameters[0] = this.getMboxName(mboxParam);
			}

			return !Util.getParam('qa') ? mboxUpdate.apply(this, mboxParameters) : this.disableMboxes();

		} catch (exception) {
			if (Server.isStage() && typeof(mboxCreate)!='undefined') {
				alert('T&T integration error while creating an mbox on this page:\n' +
					'Exception: ' + exception.description);
			}
		}
	}

	// for QA only
	,disableMboxes : function() {
		try {
			(function($){
				$('.mboxDefault').removeClass('mboxDefault');
			})(jQuery);
		} catch(exception) {
			return false;	
		}
	}
}

/*
* qp: query param, searched for in current URL
* pm: pattern match
* ms: matchstring, searched for in referrer
*/
Page.driverLookup = {
	types: [
		{ name:'SEM', qp:'d,dcmp', cb:'getSearchData' }
		,{ name:'Email', qp:'d,eid' }
		,{ name:'Display', qp:'d' }
		,{ name:'SEO', cb:'getSearchData' }
		,{ name:'Social Media', pm:[
			{ name:'YouTube', ms:'youtube.com' }
			,{ name:'Twitter', ms:'twitter.com'}
			,{ name:'LinkedIn', ms:'linkedin.com' }
			,{ name:'Facebook', ms:'facebook.com' }
			,{ name:'Flickr', ms:'flickr.com' }
			,{ name:'Slideshare', ms:'slideshare.com' }
		]}
		,{ name:'Force.com', pm:[
			{ name:'[AppExchange]', ms:'sites.force.com/appexchange' }
			,{ name:'[Community Site]', ms:'sites.force.com,secure.sites.force.com' }
			,{ name:'[DeveloperForce]', ms:'developer.force.com,developerforce.com' }
			,{ name:'[Foundation]', ms:'foundation.force.com' }
			,{ name:'[VMForce]', ms:'vmforce.com' }
			,{ name:'[Force.com Sites]', ms:'.force.com' }
		]}
		,{ name:'External Websites', cb:'getReferringDomain' }
		,{ name:'Typed/Bookmarked' }
	]
	,searchEngines: [
		{ se:'All The Web', ms:'alltheweb.com', kw:'q,query', dc:'US' }
		,{ se:'AllSearchEngines', ms:'allsearchengines.co.uk', kw:'query', dc:'United Kingdom' }
		,{ se:'AltaVista', ms:'altavista.com', kw:'q,r', dc:'US', cl:[
			{ cn:'Canada', pre:'ca.' }, { cn:'Denmark', pre:'dk.' }, { cn:'France', pre:'fr.' }, { cn:'Germany', pre:'de.' }, { cn:'Italy', pre:'it.' }
			,{ cn:'Netherlands', pre:'nl.' }, { cn:'Norway', pre:'no.' }, { cn:'Spain', pre:'es.' }, { cn:'Sweden', pre:'se.' }, { cn:'Switzerland', pre:'ch.' }, { cn:'United Kingdom', pre:'uk.' }
		]}
		,{ se:'AOL', ms:'.aol.', kw:'q,query', dc:'US', cl:[
			{ cn:'Canada', post:'ca' }, { cn:'France', post:'fr' }, { cn:'Germany', post:'de' }, { cn:'United Kingdom', post:'co.uk' }
		]}
		,{ se:'Ask', ms:'ask.com', kw:'q', dc:'US', cl:[
			{ cn:'Japan', pre:'jp' }, { cn:'United Kingdom', pre:'uk' }
		]}
		,{ se:'Baidu', ms:'baidu.com', kw:'wd,s', dc:'China' }
		,{ se:'BeGuide.com', ms:'beguide.com', kw:'q,search', dc:'US' }
		,{ se:'Biglobe', ms:'biglobe.ne.jp', kw:'q', dc:'Japan' }
		,{ se:'Microsoft Bing', ms:'bing.com', kw:'q', dc:'US' }
		,{ se:'Blue Window', ms:'search.bluewin.ch', kw:'q,qry', dc:'Switzerland' }
		,{ se:'Business.com', ms:'business.com', kw:'query', dc:'US' }
		,{ se:'BuyersIndex', ms:'buyersindex.com', kw:'query', dc:'US' }
		,{ se:'Chubba', ms:'whatuseek.com', kw:'arg', dc:'US' }
		,{ se:'CNET', ms:'cnet.com', kw:'query,q', dc:'US' }
		,{ se:'Debriefing.com', ms:'debriefing.com', kw:'tsearch', dc:'US' }
		,{ se:'Dmoz', ms:'dmoz.org', kw:'search', dc:'US' }
		,{ se:'Excite', ms:'excite.com', kw:'q,search', dc:'US', cl:[
			{ cn:'Netherlands', post:'.nl' }, { cn:'France', post:'.fr' }, { cn:'Germany', post:'.de' }, { cn:'Japan', post:'.co.jp' }, { cn:'Switzerland', post:'.ch' }
		]}
		,{ se:'Fireball', ms:'fireball.de', kw:'q,query', dc:'Germany' }
		,{ se:'FreshEye', ms:'fresheye.com', kw:'kw,ord', dc:'Japan' }
		,{ se:'Godado', ms:'godado.it', kw:'key', dc:'Italy' }
		,{ se:'Goo (Jp.)', ms:'goo.ne.jp', kw:'MT', dc:'Japan' }
		,{ se:'Google', ms:'.google.,googlesyndication.com', kw:'q', types:[{ tn:'Images', pre:'images' }, { tn:'Video', pre:'video' }], dc:'US', cl:[
			{ cn:'Afghanistan', post:'com.af' }, { cn:'American Samoa', post:'as' }, { cn:'Anguilla', post:'com.ai' }, { cn:'Antigua and Barbuda', post:'com.ag' }, { cn:'Argentina', post:'com.ar' }
			,{ cn:'Armenia', post:'am' }, { cn:'Australia', post:'com.au' }, { cn:'Austria', post:'at' }, { cn:'Azerbaijan', post:'az' }, { cn:'Bahrain', post:'com.bh' }
			,{ cn:'Bangladesh', post:'com.bd' }, { cn:'Belarus', post:'com.by' }, { cn:'Belgium', post:'be' }, { cn:'Belize', post:'com.bz' }, { cn:'Bolivia', post:'com.bo' }
			,{ cn:'Bosnia-Hercegovina', post:'ba' }, { cn:'Botswana', post:'co.bw' }, { cn:'Brasil', post:'com.br' }, { cn:'British Virgin Islands', post:'vg' }, { cn:'Brunei', post:'com.bn' }
			,{ cn:'Bulgaria', post:'bg' }, { cn:'Burundi', post:'bi' }, { cn:'Cambodia', post:'com.kh' }, { cn:'Canada', post:'ca' }, { cn:'Chile', post:'cl' }
			,{ cn:'China', post:'cn' }, { cn:'Colombia', post:'com.co' }, { cn:'Cook Islands', post:'co.ck' }, { cn:'Costa Rica', post:'co.cr' }, { cn:'Cote D\'Ivoire', post:'ci' }
			,{ cn:'Croatia', post:'hr' }, { cn:'Cuba', post:'com.cu' }, { cn:'Czech Republic', post:'cz' }, { cn:'Denmark', post:'dk' }, { cn:'Djibouti', post:'dj' }
			,{ cn:'Dominica', post:'dm' }, { cn:'Dominican Republic', post:'com.do' }, { cn:'Ecuador', post:'com.ec' }, { cn:'Egypt', post:'com.eg' }, { cn:'El Salvador', post:'com.sv' }
			,{ cn:'Estonia', post:'ee' }, { cn:'Ethiopia', post:'com.et' }, { cn:'Fiji', post:'com.fj' }, { cn:'Finland', post:'fi' }, { cn:'France', post:'fr' }
			,{ cn:'Germany', post:'de' }, { cn:'Greece', post:'gr' }, { cn:'Greenland', post:'gl' }, { cn:'Guadeloupe', post:'gp' }, { cn:'Guatemala', post:'com.gt' }
			,{ cn:'Guernsey', post:'gg' }, { cn:'Guyana', post:'gy' }, { cn:'Haiti', post:'ht' }, { cn:'Honduras', post:'hn' }, { cn:'Hong Kong', post:'com.hk' }
			,{ cn:'Hungary', post:'hu' }, { cn:'India', post:'co.in' }, { cn:'Indonesia', post:'co.id' }, { cn:'Ireland', post:'ie' }, { cn:'Island', post:'is' }
			,{ cn:'Isle of Gibraltar', post:'com.gi' }, { cn:'Isle of Man', post:'im' }, { cn:'Israel', post:'co.il' }, { cn:'Italy', post:'it' }, { cn:'Jamaica', post:'com.jm' }
			,{ cn:'Japan', post:'co.jp' }, { cn:'Jersey', post:'je' }, { cn:'Jordan', post:'jo' }, { cn:'Kazakhstan', post:'kz' }, { cn:'Kenya', post:'co.ke' }
			,{ cn:'Kiribati', post:'ki' }, { cn:'Korea', post:'co.kr' }, { cn:'Kyrgyzstan', post:'kg' }, { cn:'Laos', post:'la' }, { cn:'Latvia', post:'lv' }
			,{ cn:'Lesotho', post:'co.ls' }, { cn:'Libya', post:'com.ly' }, { cn:'Liechtenstein', post:'li' }, { cn:'Lithuania', post:'lt' }, { cn:'Luxembourg', post:'lu' }
			,{ cn:'Malawi', post:'mw' }, { cn:'Malaysia', post:'com.my' }, { cn:'Maldives', post:'mv' }, { cn:'Malta', post:'com.mt' }, { cn:'Mauritius', post:'mu' }
			,{ cn:'Mexico', post:'com.mx' }, { cn:'Micronesia', post:'fm' }, { cn:'Moldova', post:'md' }, { cn:'Mongolia', post:'mn' }, { cn:'Montserrat', post:'ms' }
			,{ cn:'Morocco', post:'co.ma' }, { cn:'Namibia', post:'com.na' }, { cn:'Nauru', post:'nr' }, { cn:'Nepal', post:'com.np' }, { cn:'Netherlands', post:'nl' }
			,{ cn:'New Zealand', post:'co.nz' }, { cn:'Nicaragua', post:'com.ni' }, { cn:'Nigeria', post:'com.ng' }, { cn:'Niue', post:'nu' }, { cn:'Norfolk Island', post:'com.nf' }
			,{ cn:'Norway', post:'no' }, { cn:'Oman', post:'com.om' }, { cn:'Pakistan', post:'com.pk' }, { cn:'Panama', post:'com.pa' }, { cn:'Paraguay', post:'com.py' }
			,{ cn:'Peru', post:'com.pe' }, { cn:'Philippines', post:'com.ph' }, { cn:'Pitcairn Islands', post:'pn' }, { cn:'Poland', post:'pl' }, { cn:'Portugal', post:'pt' }
			,{ cn:'Puerto Rico', post:'com.pr' }, { cn:'Qatar', post:'com.qa' }, { cn:'Rep. Dem. du Congo', post:'cd' }, { cn:'Rep. du Congo', post:'cg' }, { cn:'Repulic of Georgia', post:'ge' }
			,{ cn:'Romania', post:'ro' }, { cn:'Russia', post:'ru' }, { cn:'Rwanda', post:'rw' }, { cn:'Saint Helena', post:'sh' }, { cn:'Saint Vincent and the Grenadine', post:'com.vc' }
			,{ cn:'Samoa', post:'ws' }, { cn:'San Marino', post:'sm' }, { cn:'Sao Tome and Principe', post:'st' }, { cn:'Saudi Arabia', post:'com.sa' }, { cn:'Senegal', post:'sn' }
			,{ cn:'Seychelles', post:'sc' }, { cn:'Singapore', post:'com.sg' }, { cn:'Slovakia', post:'sk' }, { cn:'Slovenia', post:'si' }, { cn:'Solomon Islands', post:'com.sb' }
			,{ cn:'South Africa', post:'co.za' }, { cn:'Spain', post:'es' }, { cn:'Sri Lanka', post:'lk' }, { cn:'Sweden', post:'se' }, { cn:'Switzerland', post:'ch' }
			,{ cn:'Taiwan', post:'com.tw' }, { cn:'Tajikistan', post:'com.tj' }, { cn:'Thailand', post:'co.th' }, { cn:'The Bahamas', post:'bs' }, { cn:'The Gambia', post:'gm' }
			,{ cn:'Timor-Leste', post:'tp' }, { cn:'Tokelau', post:'tk' }, { cn:'Tonga', post:'to' }, { cn:'Trinidad and Tobago', post:'tt' }, { cn:'Turkey', post:'com.tr' }
			,{ cn:'Turkmenistan', post:'tm' }, { cn:'Uganda', post:'co.ug' }, { cn:'Ukraine', post:'com.ua' }, { cn:'United Arab Emirates', post:'ae' }, { cn:'United Kingdom', post:'co.uk' }
			,{ cn:'Uruguay', post:'com.uy' }, { cn:'Uzbekiston', post:'co.uz' }, { cn:'Vanuatu', post:'vu' }, { cn:'Venezuela', post:'co.ve' }, { cn:'Viet Nam', post:'com.vn' }
			,{ cn:'Virgin Islands', post:'co.vi' }, { cn:'Yugoslavia', post:'co.yu' }, { cn:'Zambia', post:'co.zm' }, { cn:'Zimbabwe', post:'co.zw' }
		]}
		,{ se:'Hotbot', ms:'hotbot.com', kw:'query', dc:'US' }
		,{ se:'ilse.nl', ms:'ilse.nl', kw:'search_for', dc:'Netherlands' }
		,{ se:'Indeed', ms:'www.indeed.', kw:'q', dc:'US', cl:[
			{ cn:'Canada', post:'ca' }, { cn:'India', post:'co.in' }
		]}
		,{ se:'InfoSpace', ms:'infospace.com', kw:'', dc:'US' }
		,{ se:'InfoTiger', ms:'infotiger.com', kw:'qs', dc:'US' }
		,{ se:'Livedoor', ms:'livedoor.com', kw:'q', dc:'Japan' }
		,{ se:'Lycos', ms:'.lycos', kw:'query', dc:'US', cl: [
			{ cn:'France', post:'.fr' }, { cn:'Germany', post:'.de' }, { cn:'Italy', post:'.it' }, { cn:'Netherlands', post:'.nl' }, { cn:'Spain', post:'.es' }, { cn:'United Kingdom', post:'.co.uk' }
		]}
		,{ se:'Metacrawler', ms:'metacrawler.com', kw:'', dc:'US' }
		,{ se:'Monster Crawler', ms:'monstercrawler.com', kw:'', dc:'US' }
		,{ se:'myGO', ms:'mygo.com', kw:'', dc:'Taiwan' }
		,{ se:'Nate.com', ms:'nate.com', kw:'q', dc:'Korea' }
		,{ se:'Naver', ms:'naver.com', kw:'query', dc:'Korea' }
		,{ se:'Netscape Search', ms:'', kw:'q', dc:'US' }
		,{ se:'NetSearch', ms:'netscape.com', kw:'qry_str', dc:'US' }
		,{ se:'Nifty', ms:'nifty.com,search.nifty.com', kw:'q', dc:'Japan' }
		,{ se:'Oh! New? Mobile', ms:'ohnew.co.jp', kw:'k', dc:'Japan' }
		,{ se:'OptusZoo', ms:'optuszoo.com.au', kw:'q', dc:'Australia' }
		,{ se:'Reference.com', ms:'reference.com', kw:'q', dc:'US' }
		,{ se:'Search.ch', ms:'search.ch', kw:'q', dc:'Switzerland' }
		,{ se:'Searchalot', ms:'searchalot.com', kw:'q,query', dc:'US' }
		,{ se:'Tiscali', ms:'tiscali.it', kw:'key', dc:'Italy' }
		,{ se:'track.nl', ms:'track.nl', kw:'qr', dc:'Netherlands' }
		,{ se:'Virgilio', ms:'ricerca.virgilio.it,virgilio.it', kw:'qs', dc:'Italy' }
		,{ se:'Web Wombat', ms:'webwombat.com.au', kw:'ix,I', dc:'Australia' }
		,{ se:'Web.de', ms:'web.de', kw:'su', dc:'Germany' }
		,{ se:'Webalta', ms:'webalta.ru', kw:'q', dc:'Russia' }
		,{ se:'WebCrawler', ms:'webcrawler.com', kw:'', dc:'US' }
		,{ se:'Yahoo!', ms:'search.yahoo.', kw:'p', dc:'US', cl:[
			{ cn:'Argentina', pre:'ar.' }, { cn:'Asia', pre:'asia.' }, { cn:'Australia', pre:'au.' }, { cn:'Austria', pre:'at.' }, { cn:'Brazil', pre:'br.' }
			,{ cn:'Canada', pre:'ca.' }, { cn:'Canada (French)', pre:'qc.' }, { cn:'Catalan', pre:'ct.' }, { cn:'China', pre:'cn.' }, { cn:'Denmark', pre:'dk.' }
			,{ cn:'Finland', pre:'fi.' }, { cn:'France', pre:'fr.' }, { cn:'Germany', pre:'de.' }, { cn:'Hong Kong', pre:'hk.' }, { cn:'India', pre:'in.' }
			,{ cn:'Indonesia', pre:'id.' }, { cn:'Italy', pre:'it.' }, { cn:'Japan', post:'co.jp' }, { cn:'Korea', pre:'kr.' }, { cn:'Malaysia', pre:'malaysia.' }
			,{ cn:'Mexico', pre:'mx.' }, { cn:'Netherlands', pre:'nl.' }, { cn:'New Zealand', pre:'nz.' }, { cn:'Norway', pre:'no.' }, { cn:'Philippines', pre:'ph.' }
			,{ cn:'Russia', pre:'ru.' }, { cn:'Singapore', pre:'sg.' }, { cn:'Spain', pre:'es.' }, { cn:'Sweden', pre:'se.' }, { cn:'Switzerland', pre:'ch.' }
			,{ cn:'Taiwan', pre:'tw.' }, { cn:'Thailand', pre:'th.' }, { cn:'UK and Ireland', pre:'uk.' }, { cn:'Viet Nam', pre:'vn.' }
		]}
		,{ se:'Yandex.ru', ms:'yandex.ru', kw:'text', dc:'Russia' }
		,{ se:'zoeken.nl', ms:'zoeken.nl', kw:'q', dc:'Netherlands' }
	]
	
	,getReferringDomain : function(args) {
		var ref = Page.getReferrer(), prefix = '://';
		if (!ref || ref.indexOf('http') != 0) {
			return null;
		}
		ref = ref.indexOf(prefix) > -1 ? ref.substring(ref.indexOf(prefix) + prefix.length) : ref;
		ref = ref.indexOf('/') > -1 ? ref.substring(0, ref.indexOf('/')) : ref;
		ref = ref.indexOf('?') > -1 ? ref.substring(0, ref.indexOf('?')) : ref;
		ref = ref.indexOf('#') > -1 ? ref.substring(0, ref.indexOf('#')) : ref;
		return { id:args.name + '|' + ref, type:args.name };
	}

	,getSearchData : function(args) {
		// check for referrer match
		// then check for keyword match
		var ref = Page.getReferrer(), engine='', country='', keyword='';
		for (var i=0; i<this.searchEngines.length; i++) {
			var ce = this.searchEngines[i], cms = this.searchEngines[i].ms.split(','); // current engine & matchstrings
			for (var j=0; j<cms.length; j++) {
				if (cms[j] && (ref.indexOf(cms[j]) > -1)) {
					// we have a search engine; check for sub-engine (ie Google Images)
					engine = ce.se;
					if (ce.types) {
						for (var t=0; t<ce.types.length; t++) {
							if (ce.types[t].pre && ref.indexOf(ce.types[t].pre + cms[j]) > -1) {
								engine = engine + ' ' + ce.types[t].tn;
								break;
							}
							if (ce.types[t].post && ref.indexOf(cms[j] + ce.types[t].post) > -1) {
								engine = engine + ' ' + ce.types[t].tn;
								break;
							}
						}
					}
					// check for keyword
					var kwp = ce.kw.split(',');
					for (var k=0; k<kwp.length; k++) {
						keyword = Url.decodeComponent(Util.getParam(kwp[k], ref));
						if (keyword) {
							break;
						}
					}
					if (!keyword) {
						// no search
						break;
					}
					// check for country
					if (ce.cl) {
						for (var l=0; l<ce.cl.length; l++) {
							if (ce.cl[l].pre && ref.indexOf(ce.cl[l].pre + cms[j]) > -1) {
								country = ce.cl[l].cn;
							}
							if (ce.cl[l].post && ref.indexOf(cms[j] + ce.cl[l].post) > -1) {
								country = ce.cl[l].cn;
							}
						}
					}
					if (!country) {
						country = ce.dc;
					}
				}
			}
		}
		if (args.id || (engine && keyword)) {
			keyword = keyword ? Util.cleanUrlData(keyword) : 'no keyword';
			engine = engine ? (country != 'US' ? engine + ' - ' + country : engine) : 'no search engine';
			return { 'id':(args.id ? args.id : (args.name + '|' + engine + '|' + keyword)), 'type':(args.type ? args.type : args.name), 'keyword':keyword, 'engine':engine };
		} else {
			return null;
		}
	}
};

function OmnitureSetup() { return ''; }
OmnitureSetup.prototype.getSegment = function() { return ''; }

function goThere(countrySel,rememberMe) {
	var targCountry = countrySel.options[countrySel.selectedIndex].value
	if (null != targCountry) {
		if (null != rememberMe && rememberMe.checked) {
			var cookiehandler = new CookieHandler();
			if (null != cookiehandler) {  
				cookiehandler.setCookie("com.salesforce.LocaleInfo",targCountry,365*24*60*60); //1 year
			}
		}
		Util.redirect("/" + targCountry + "/");
	}
}

function getParam(name, targetURL) {
	return Util.getParam(name, targetURL);
}

function getURLParam(strParamName){
	return getParam(strParamName);
}

function getArgs(arg_name, str) {
	if (!str) str = location.search.substring(1);
	return Util.getParam(arg_name, str);
}

// convert case-sensitve to insensitive ids
function convert15To18(id) {
	return Util.convert15To18(id);
}

function getJSONCookie(cookieName) {
	return Util.getJSONCookie(cookieName);
}

function encode64(input) {
	return Base64.encode(input);
}

function decode64(input) {
	return Base64.decode(input);
}

// replace link 'd' with page URL 'd'
// copy all URL params from page URL to clicked URL, overwriting whatever is there
// old problems: messy code, if the param wasn't in the URL bar but it was in the link, it wouldn't be passed.
function getDriver(clickedUrl) {
	return Util.getDriver(clickedUrl);
}

function isValidPhoneNumber(num, requiredDigits) {
	var digits = 0;
	if (num == null) return false;
	for( i=0; i<num.length; i++ ){
		var c = num.charCodeAt(i);
		//convert the i-th character to ascii code value
		if( (c>=48) && (c<=57) ) digits++;
	}
	return (digits >= requiredDigits);
}

/********
* Verify that an email addres is valid
* Written by Paolo Wales (paolo@taize.fr)
********/
function isValidEmail(emailad) {
	var exclude=/[^@\-\.\w\']|^[_@\.\-]|[\._\-]{2}|[@\.]{2}|(@)[^@]*\1/;
	var check=/@[\w\-]+\./;
	var checkend=/\.[a-zA-Z]{2,4}$/;
	if (((emailad.search(exclude) != -1) ||
		(emailad.search(check)) == -1) ||
		(emailad.search(checkend) == -1)){
		return false;
	} else {
		return true;
	}
}

/********
* Ensures valid emails are present and that the sender email doesn't contain
* an 'salesforce.com' in the sender's domain.
*
* use: for "email a friend" security
* created by: Scott Yancey
********/
function isValidEmails() {
	var recipientEmail = document.forms[0].recipientEmail.value;
	var senderEmail = document.forms[0].senderEmail.value;
	var error = false;
	var errorMessage = "The following errors are present:\n\n";

	if (recipientEmail.indexOf(',') < 0) {
		if (!isValidEmail(recipientEmail)) {
			error = true;
			errorMessage += "The recipient's Email address is not valid\n"
		}
	} else {
		var addresses = new Array();
		addresses = recipientEmail.split(',');
		var currentAddress;
		var i;
		for (var i=0; i < addresses.length; i++) {
			if (!isValidEmail(trim(addresses[i]))){
				error = true;
			}
		}
		if (i > 10) {
			error = true;
			errorMessage += "Only 10 addresses are allowed\n"
		}
		if (error) {
			errorMessage += "A recipient's Email address is not valid\n"
		}
	}

	if (!isValidEmail(senderEmail)) {
		error = true;
		errorMessage += "The sender's Email address is not valid"
	}
	if (senderEmail.indexOf("salesforce.com") >= 0) {
		error = true;
		errorMessage += "The sender's Email address can not contain 'salesforce.com'."
	}

	if (error) {
		alert(errorMessage);
		return false;
	} else {
		return true;
	}
}

//added by K Guckian moved over from existing site js this is for the interactive screenshot
function launchDemo(url) {
	var winwidth=screen.width;
	var	winheight=screen.height;
	var scroll="";

	if (winwidth>1000) {
		winwidth=1020;
		winheight=700;
		scroll="no";
	} else if (winwidth<1000) {
		winwidth=790;
		winheight=530;
		scroll="yes";
	}
	url=url+"&scroll="+scroll;
	newWindow=window.open(url,"Demo","toolbar=no,scrollbars=no,resizable=no,width="+winwidth+",height="+winheight+",left=0,top=0");
}

function referFriend(url){
	var referurl=document.location.href;
	url=url+"?referurl=" + referurl+"&title="+document.title;
	newWindow=window.open(url,"","toolbar=no,scrollbars=no,resizable=no,width=350,height=500,left=0,top=0");
}

/********
* Opens a new window
********/
var curPopupWindow = null;
function openWindow(url, winName, width, height, center, winType) {
	var xposition = 50; // Postions the window vertically in px
	var yposition = 50; // Postions the window horizontally in px
	var location, menubar, resizable, scrollbars, status, titlebar;
	
	if ((parseInt(navigator.appVersion) >= 4 ) && (center)) {
		xposition = (screen.width - 800) / 2;
		yposition = (screen.height - 600) / 2;
	}

	if (winType == "1") {	// winType 1 is for regular popup windows
		location=1;
		menubar=1;
		resizable=1;
		scrollbars=1;
		status=1;
		titlebar=1;
	} else if (winType == "2") {	// winType 2 is for Quick Tour like popups
		location=0;
		menubar=0;
		resizable=0;
		scrollbars=0;
		status=0;
		titlebar=1;
	} else if (winType == "3") {	// winType 3 is for footer like popups
		location=0;
		menubar=0;
		resizable=1;
		scrollbars=1;
		status=0;
		titlebar=1;
	} else if (winType == "4") {	// winType 4 sforce footer - no resizing
		location=0;
		menubar=0;
		resizable=0;
		scrollbars=1;
		status=0;
		titlebar=0;
	} else if (winType == "5") {
		location=0;
		menubar=1;
		resizable=0;
		scrollbars=1;
		status=0;
		titlebar=0;
	} else {	// if no arg is passed for winType
		location=1;
		menubar=1;
		resizable=1;
		scrollbars=1;
		status=1;
		titlebar=1;
	}

	// Features to specify for a new window
	args = "width=" + width + ","
		+ "height=" + height + ","
		+ "location=" + location + ","
		+ "menubar=" + menubar + ","
		+ "resizable=" + resizable + ","
		+ "scrollbars=" + scrollbars + ","
		+ "status=" + status + ","
		+ "titlebar=" + titlebar + ","
		+ "toolbar=0,"
		+ "hotkeys=0,"
		+ "screenx=" + xposition + "," 	// NN Only
		+ "screeny=" + yposition + "," 	// NN Only
		+ "left=" + xposition + ","		// IE Only
		+ "top=" + yposition;			// IE Only

	// Performs the opening of the window (and closing of a window already opened for that page).
	if (curPopupWindow != null) {
		curPopupWindow.close();
	}
	curPopupWindow = window.open(url, winName, args, false);
	curPopupWindow.focus();
}

function readCookie(name) {
	var c = new CookieHandler();
	return c.getCookie(name);
}

function toggleElementDisplay( elementId ) {
	var element = document.getElementById( elementId );
	var currentState = element.style.display;
	
	if (!currentState || currentState == 'none') {
		element.style.display = "block";
	} else {
		element.style.display = "none";
	}
}