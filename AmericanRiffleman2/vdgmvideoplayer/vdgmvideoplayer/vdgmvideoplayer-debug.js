YUI.add('vdgm', function (Y, NAME) {

function VDGM(){
   VDGM.superclass.constructor.apply(this, arguments);
}

VDGM.NAME  = 'vdgm';

VDGM.ATTRS = {
    
};


Y.namespace('external').VDGM = Y.Base.create("vdgm", Y.Widget, [Y.WidgetChild], {
   
   initializer: function(cfg){
       this.isLocal = cfg.isLocal;
   },
   players: [],
   newVideoPlayer: function( cfg ){
        var modal   = new Y.Vdgm.VideoModal({ host: cfg.host }),
        videoplayer = new Y.Vdgm.VideoPlayer( cfg.videoConfig ),
        node        = Y.one( cfg.targetNode ),
        self        = this,
        localPath   = '/yui/build/videoplayer/assets/',
        productionPath = cfg.host + '/vdgmvideoplayer/videoplayer/assets/',
        assetPath      = self.isLocal ? localPath : productionPath;
        
        videoplayer._assetPath = assetPath; 
       
        videoplayer.add(modal);
        videoplayer.render( node.one('.main-video'));
        modal.render( node.one('.main-video'));
        
        Y.after('interact', function(e){
           
        });
        
        self.players.push( videoplayer );
        return videoplayer;        
    }
});YUI.add('swfobject', function(Y){
    
/*!	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/

var swfobject = function() {
	
	var UNDEF = "undefined",
		OBJECT = "object",
		SHOCKWAVE_FLASH = "Shockwave Flash",
		SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
		FLASH_MIME_TYPE = "application/x-shockwave-flash",
		EXPRESS_INSTALL_ID = "SWFObjectExprInst",
		ON_READY_STATE_CHANGE = "onreadystatechange",
		
		win = window,
		doc = document,
		nav = navigator,
		
		plugin = false,
		domLoadFnArr = [main],
		regObjArr = [],
		objIdArr = [],
		listenersArr = [],
		storedAltContent,
		storedAltContentId,
		storedCallbackFn,
		storedCallbackObj,
		isDomLoaded = false,
		isExpressInstallActive = false,
		dynamicStylesheet,
		dynamicStylesheetMedia,
		autoHideShow = true,
	
	/* Centralized function for browser feature detection
		- User agent string detection is only used when no good alternative is possible
		- Is executed directly for optimal performance
	*/	
	ua = function() {
		var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF,
			u = nav.userAgent.toLowerCase(),
			p = nav.platform.toLowerCase(),
			windows = p ? /win/.test(p) : /win/.test(u),
			mac = p ? /mac/.test(p) : /mac/.test(u),
			webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
			ie = !+"\v1", // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
			playerVersion = [0,0,0],
			d = null;
		if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
			d = nav.plugins[SHOCKWAVE_FLASH].description;
			if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
				plugin = true;
				ie = false; // cascaded feature detection for Internet Explorer
				d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
				playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
				playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
				playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
			}
		}
		else if (typeof win.ActiveXObject != UNDEF) {
			try {
				var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
				if (a) { // a will return null when ActiveX is disabled
					d = a.GetVariable("$version");
					if (d) {
						ie = true; // cascaded feature detection for Internet Explorer
						d = d.split(" ")[1].split(",");
						playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
					}
				}
			}
			catch(e) {}
		}
		return { w3:w3cdom, pv:playerVersion, wk:webkit, ie:ie, win:windows, mac:mac };
	}(),
	
	/* Cross-browser onDomLoad
		- Will fire an event as soon as the DOM of a web page is loaded
		- Internet Explorer workaround based on Diego Perini's solution: http://javascript.nwbox.com/IEContentLoaded/
		- Regular onload serves as fallback
	*/ 
	onDomLoad = function() {
		if (!ua.w3) { return; }
		if ((typeof doc.readyState != UNDEF && doc.readyState == "complete") || (typeof doc.readyState == UNDEF && (doc.getElementsByTagName("body")[0] || doc.body))) { // function is fired after onload, e.g. when script is inserted dynamically 
			callDomLoadFunctions();
		}
		if (!isDomLoaded) {
			if (typeof doc.addEventListener != UNDEF) {
				doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, false);
			}		
			if (ua.ie && ua.win) {
				doc.attachEvent(ON_READY_STATE_CHANGE, function() {
					if (doc.readyState == "complete") {
						doc.detachEvent(ON_READY_STATE_CHANGE, arguments.callee);
						callDomLoadFunctions();
					}
				});
				if (win == top) { // if not inside an iframe
					(function(){
						if (isDomLoaded) { return; }
						try {
							doc.documentElement.doScroll("left");
						}
						catch(e) {
							setTimeout(arguments.callee, 0);
							return;
						}
						callDomLoadFunctions();
					})();
				}
			}
			if (ua.wk) {
				(function(){
					if (isDomLoaded) { return; }
					if (!/loaded|complete/.test(doc.readyState)) {
						setTimeout(arguments.callee, 0);
						return;
					}
					callDomLoadFunctions();
				})();
			}
			addLoadEvent(callDomLoadFunctions);
		}
	}();
	
	function callDomLoadFunctions() {
		if (isDomLoaded) { return; }
		try { // test if we can really add/remove elements to/from the DOM; we don't want to fire it too early
			var t = doc.getElementsByTagName("body")[0].appendChild(createElement("span"));
			t.parentNode.removeChild(t);
		}
		catch (e) { return; }
		isDomLoaded = true;
		var dl = domLoadFnArr.length;
		for (var i = 0; i < dl; i++) {
			domLoadFnArr[i]();
		}
	}
	
	function addDomLoadEvent(fn) {
		if (isDomLoaded) {
			fn();
		}
		else { 
			domLoadFnArr[domLoadFnArr.length] = fn; // Array.push() is only available in IE5.5+
		}
	}
	
	/* Cross-browser onload
		- Based on James Edwards' solution: http://brothercake.com/site/resources/scripts/onload/
		- Will fire an event as soon as a web page including all of its assets are loaded 
	 */
	function addLoadEvent(fn) {
		if (typeof win.addEventListener != UNDEF) {
			win.addEventListener("load", fn, false);
		}
		else if (typeof doc.addEventListener != UNDEF) {
			doc.addEventListener("load", fn, false);
		}
		else if (typeof win.attachEvent != UNDEF) {
			addListener(win, "onload", fn);
		}
		else if (typeof win.onload == "function") {
			var fnOld = win.onload;
			win.onload = function() {
				fnOld();
				fn();
			};
		}
		else {
			win.onload = fn;
		}
	}
	
	/* Main function
		- Will preferably execute onDomLoad, otherwise onload (as a fallback)
	*/
	function main() { 
		if (plugin) {
			testPlayerVersion();
		}
		else {
			matchVersions();
		}
	}
	
	/* Detect the Flash Player version for non-Internet Explorer browsers
		- Detecting the plug-in version via the object element is more precise than using the plugins collection item's description:
		  a. Both release and build numbers can be detected
		  b. Avoid wrong descriptions by corrupt installers provided by Adobe
		  c. Avoid wrong descriptions by multiple Flash Player entries in the plugin Array, caused by incorrect browser imports
		- Disadvantage of this method is that it depends on the availability of the DOM, while the plugins collection is immediately available
	*/
	function testPlayerVersion() {
		var b = doc.getElementsByTagName("body")[0];
		var o = createElement(OBJECT);
		o.setAttribute("type", FLASH_MIME_TYPE);
		var t = b.appendChild(o);
		if (t) {
			var counter = 0;
			(function(){
				if (typeof t.GetVariable != UNDEF) {
					var d = t.GetVariable("$version");
					if (d) {
						d = d.split(" ")[1].split(",");
						ua.pv = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
					}
				}
				else if (counter < 10) {
					counter++;
					setTimeout(arguments.callee, 10);
					return;
				}
				b.removeChild(o);
				t = null;
				matchVersions();
			})();
		}
		else {
			matchVersions();
		}
	}
	
	/* Perform Flash Player and SWF version matching; static publishing only
	*/
	function matchVersions() {
		var rl = regObjArr.length;
		if (rl > 0) {
			for (var i = 0; i < rl; i++) { // for each registered object element
				var id = regObjArr[i].id;
				var cb = regObjArr[i].callbackFn;
				var cbObj = {success:false, id:id};
				if (ua.pv[0] > 0) {
					var obj = getElementById(id);
					if (obj) {
						if (hasPlayerVersion(regObjArr[i].swfVersion) && !(ua.wk && ua.wk < 312)) { // Flash Player version >= published SWF version: Houston, we have a match!
							setVisibility(id, true);
							if (cb) {
								cbObj.success = true;
								cbObj.ref = getObjectById(id);
								cb(cbObj);
							}
						}
						else if (regObjArr[i].expressInstall && canExpressInstall()) { // show the Adobe Express Install dialog if set by the web page author and if supported
							var att = {};
							att.data = regObjArr[i].expressInstall;
							att.width = obj.getAttribute("width") || "0";
							att.height = obj.getAttribute("height") || "0";
							if (obj.getAttribute("class")) { att.styleclass = obj.getAttribute("class"); }
							if (obj.getAttribute("align")) { att.align = obj.getAttribute("align"); }
							// parse HTML object param element's name-value pairs
							var par = {};
							var p = obj.getElementsByTagName("param");
							var pl = p.length;
							for (var j = 0; j < pl; j++) {
								if (p[j].getAttribute("name").toLowerCase() != "movie") {
									par[p[j].getAttribute("name")] = p[j].getAttribute("value");
								}
							}
							showExpressInstall(att, par, id, cb);
						}
						else { // Flash Player and SWF version mismatch or an older Webkit engine that ignores the HTML object element's nested param elements: display alternative content instead of SWF
							displayAltContent(obj);
							if (cb) { cb(cbObj); }
						}
					}
				}
				else {	// if no Flash Player is installed or the fp version cannot be detected we let the HTML object element do its job (either show a SWF or alternative content)
					setVisibility(id, true);
					if (cb) {
						var o = getObjectById(id); // test whether there is an HTML object element or not
						if (o && typeof o.SetVariable != UNDEF) { 
							cbObj.success = true;
							cbObj.ref = o;
						}
						cb(cbObj);
					}
				}
			}
		}
	}
	
	function getObjectById(objectIdStr) {
		var r = null;
		var o = getElementById(objectIdStr);
		if (o && o.nodeName == "OBJECT") {
			if (typeof o.SetVariable != UNDEF) {
				r = o;
			}
			else {
				var n = o.getElementsByTagName(OBJECT)[0];
				if (n) {
					r = n;
				}
			}
		}
		return r;
	}
	
	/* Requirements for Adobe Express Install
		- only one instance can be active at a time
		- fp 6.0.65 or higher
		- Win/Mac OS only
		- no Webkit engines older than version 312
	*/
	function canExpressInstall() {
		return !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac) && !(ua.wk && ua.wk < 312);
	}
	
	/* Show the Adobe Express Install dialog
		- Reference: http://www.adobe.com/cfusion/knowledgebase/index.cfm?id=6a253b75
	*/
	function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {
		isExpressInstallActive = true;
		storedCallbackFn = callbackFn || null;
		storedCallbackObj = {success:false, id:replaceElemIdStr};
		var obj = getElementById(replaceElemIdStr);
		if (obj) {
			if (obj.nodeName == "OBJECT") { // static publishing
				storedAltContent = abstractAltContent(obj);
				storedAltContentId = null;
			}
			else { // dynamic publishing
				storedAltContent = obj;
				storedAltContentId = replaceElemIdStr;
			}
			att.id = EXPRESS_INSTALL_ID;
			if (typeof att.width == UNDEF || (!/%$/.test(att.width) && parseInt(att.width, 10) < 310)) { att.width = "310"; }
			if (typeof att.height == UNDEF || (!/%$/.test(att.height) && parseInt(att.height, 10) < 137)) { att.height = "137"; }
			doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
			var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn",
				fv = "MMredirectURL=" + win.location.toString().replace(/&/g,"%26") + "&MMplayerType=" + pt + "&MMdoctitle=" + doc.title;
			if (typeof par.flashvars != UNDEF) {
				par.flashvars += "&" + fv;
			}
			else {
				par.flashvars = fv;
			}
			// IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
			// because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
			if (ua.ie && ua.win && obj.readyState != 4) {
				var newObj = createElement("div");
				replaceElemIdStr += "SWFObjectNew";
				newObj.setAttribute("id", replaceElemIdStr);
				obj.parentNode.insertBefore(newObj, obj); // insert placeholder div that will be replaced by the object element that loads expressinstall.swf
				obj.style.display = "none";
				(function(){
					if (obj.readyState == 4) {
						obj.parentNode.removeChild(obj);
					}
					else {
						setTimeout(arguments.callee, 10);
					}
				})();
			}
			createSWF(att, par, replaceElemIdStr);
		}
	}
	
	/* Functions to abstract and display alternative content
	*/
	function displayAltContent(obj) {
		if (ua.ie && ua.win && obj.readyState != 4) {
			// IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
			// because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
			var el = createElement("div");
			obj.parentNode.insertBefore(el, obj); // insert placeholder div that will be replaced by the alternative content
			el.parentNode.replaceChild(abstractAltContent(obj), el);
			obj.style.display = "none";
			(function(){
				if (obj.readyState == 4) {
					obj.parentNode.removeChild(obj);
				}
				else {
					setTimeout(arguments.callee, 10);
				}
			})();
		}
		else {
			obj.parentNode.replaceChild(abstractAltContent(obj), obj);
		}
	} 

	function abstractAltContent(obj) {
		var ac = createElement("div");
		if (ua.win && ua.ie) {
			ac.innerHTML = obj.innerHTML;
		}
		else {
			var nestedObj = obj.getElementsByTagName(OBJECT)[0];
			if (nestedObj) {
				var c = nestedObj.childNodes;
				if (c) {
					var cl = c.length;
					for (var i = 0; i < cl; i++) {
						if (!(c[i].nodeType == 1 && c[i].nodeName == "PARAM") && !(c[i].nodeType == 8)) {
							ac.appendChild(c[i].cloneNode(true));
						}
					}
				}
			}
		}
		return ac;
	}
	
	/* Cross-browser dynamic SWF creation
	*/
	function createSWF(attObj, parObj, id) {
		var r, el = getElementById(id);
		if (ua.wk && ua.wk < 312) { return r; }
		if (el) {
			if (typeof attObj.id == UNDEF) { // if no 'id' is defined for the object element, it will inherit the 'id' from the alternative content
				attObj.id = id;
			}
			if (ua.ie && ua.win) { // Internet Explorer + the HTML object element + W3C DOM methods do not combine: fall back to outerHTML
				var att = "";
				for (var i in attObj) {
					if (attObj[i] != Object.prototype[i]) { // filter out prototype additions from other potential libraries
						if (i.toLowerCase() == "data") {
							parObj.movie = attObj[i];
						}
						else if (i.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
							att += ' class="' + attObj[i] + '"';
						}
						else if (i.toLowerCase() != "classid") {
							att += ' ' + i + '="' + attObj[i] + '"';
						}
					}
				}
				var par = "";
				for (var j in parObj) {
					if (parObj[j] != Object.prototype[j]) { // filter out prototype additions from other potential libraries
						par += '<param name="' + j + '" value="' + parObj[j] + '" />';
					}
				}
				el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + att + '>' + par + '</object>';
				objIdArr[objIdArr.length] = attObj.id; // stored to fix object 'leaks' on unload (dynamic publishing only)
				r = getElementById(attObj.id);	
			}
			else { // well-behaving browsers
				var o = createElement(OBJECT);
				o.setAttribute("type", FLASH_MIME_TYPE);
				for (var m in attObj) {
					if (attObj[m] != Object.prototype[m]) { // filter out prototype additions from other potential libraries
						if (m.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
							o.setAttribute("class", attObj[m]);
						}
						else if (m.toLowerCase() != "classid") { // filter out IE specific attribute
							o.setAttribute(m, attObj[m]);
						}
					}
				}
				for (var n in parObj) {
					if (parObj[n] != Object.prototype[n] && n.toLowerCase() != "movie") { // filter out prototype additions from other potential libraries and IE specific param element
						createObjParam(o, n, parObj[n]);
					}
				}
				el.parentNode.replaceChild(o, el);
				r = o;
			}
		}
		return r;
	}
	
	function createObjParam(el, pName, pValue) {
		var p = createElement("param");
		p.setAttribute("name", pName);	
		p.setAttribute("value", pValue);
		el.appendChild(p);
	}
	
	/* Cross-browser SWF removal
		- Especially needed to safely and completely remove a SWF in Internet Explorer
	*/
	function removeSWF(id) {
		var obj = getElementById(id);
		if (obj && obj.nodeName == "OBJECT") {
			if (ua.ie && ua.win) {
				obj.style.display = "none";
				(function(){
					if (obj.readyState == 4) {
						removeObjectInIE(id);
					}
					else {
						setTimeout(arguments.callee, 10);
					}
				})();
			}
			else {
				obj.parentNode.removeChild(obj);
			}
		}
	}
	
	function removeObjectInIE(id) {
		var obj = getElementById(id);
		if (obj) {
			for (var i in obj) {
				if (typeof obj[i] == "function") {
					obj[i] = null;
				}
			}
			obj.parentNode.removeChild(obj);
		}
	}
	
	/* Functions to optimize JavaScript compression
	*/
	function getElementById(id) {
		var el = null;
		try {
			el = doc.getElementById(id);
		}
		catch (e) {}
		return el;
	}
	
	function createElement(el) {
		return doc.createElement(el);
	}
	
	/* Updated attachEvent function for Internet Explorer
		- Stores attachEvent information in an Array, so on unload the detachEvent functions can be called to avoid memory leaks
	*/	
	function addListener(target, eventType, fn) {
		target.attachEvent(eventType, fn);
		listenersArr[listenersArr.length] = [target, eventType, fn];
	}
	
	/* Flash Player and SWF content version matching
	*/
	function hasPlayerVersion(rv) {
		var pv = ua.pv, v = rv.split(".");
		v[0] = parseInt(v[0], 10);
		v[1] = parseInt(v[1], 10) || 0; // supports short notation, e.g. "9" instead of "9.0.0"
		v[2] = parseInt(v[2], 10) || 0;
		return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2]));
	}
	
	/* Cross-browser dynamic CSS creation
		- Based on Bobby van der Sluis' solution: http://www.bobbyvandersluis.com/articles/dynamicCSS.php
	*/	
	function createCSS(sel, decl, media, newStyle) {
		if (ua.ie && ua.mac) { return; }
		var h = doc.getElementsByTagName("head")[0];
		if (!h) { return; } // to also support badly authored HTML pages that lack a head element
		var m = (media && typeof media == "string") ? media : "screen";
		if (newStyle) {
			dynamicStylesheet = null;
			dynamicStylesheetMedia = null;
		}
		if (!dynamicStylesheet || dynamicStylesheetMedia != m) { 
			// create dynamic stylesheet + get a global reference to it
			var s = createElement("style");
			s.setAttribute("type", "text/css");
			s.setAttribute("media", m);
			dynamicStylesheet = h.appendChild(s);
			if (ua.ie && ua.win && typeof doc.styleSheets != UNDEF && doc.styleSheets.length > 0) {
				dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
			}
			dynamicStylesheetMedia = m;
		}
		// add style rule
		if (ua.ie && ua.win) {
			if (dynamicStylesheet && typeof dynamicStylesheet.addRule == OBJECT) {
				dynamicStylesheet.addRule(sel, decl);
			}
		}
		else {
			if (dynamicStylesheet && typeof doc.createTextNode != UNDEF) {
				dynamicStylesheet.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
			}
		}
	}
	
	function setVisibility(id, isVisible) {
		if (!autoHideShow) { return; }
		var v = isVisible ? "visible" : "hidden";
		if (isDomLoaded && getElementById(id)) {
			getElementById(id).style.visibility = v;
		}
		else {
			createCSS("#" + id, "visibility:" + v);
		}
	}

	/* Filter to avoid XSS attacks
	*/
	function urlEncodeIfNecessary(s) {
		var regex = /[\\\"<>\.;]/;
		var hasBadChars = regex.exec(s) != null;
		return hasBadChars && typeof encodeURIComponent != UNDEF ? encodeURIComponent(s) : s;
	}
	
	/* Release memory to avoid memory leaks caused by closures, fix hanging audio/video threads and force open sockets/NetConnections to disconnect (Internet Explorer only)
	*/
	var cleanup = function() {
		if (ua.ie && ua.win) {
			window.attachEvent("onunload", function() {
				// remove listeners to avoid memory leaks
				var ll = listenersArr.length;
				for (var i = 0; i < ll; i++) {
					listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
				}
				// cleanup dynamically embedded objects to fix audio/video threads and force open sockets and NetConnections to disconnect
				var il = objIdArr.length;
				for (var j = 0; j < il; j++) {
					removeSWF(objIdArr[j]);
				}
				// cleanup library's main closures to avoid memory leaks
				for (var k in ua) {
					ua[k] = null;
				}
				ua = null;
				for (var l in swfobject) {
					swfobject[l] = null;
				}
				swfobject = null;
			});
		}
	}();
	
	return {
		/* Public API
			- Reference: http://code.google.com/p/swfobject/wiki/documentation
		*/ 
		registerObject: function(objectIdStr, swfVersionStr, xiSwfUrlStr, callbackFn) {
			if (ua.w3 && objectIdStr && swfVersionStr) {
				var regObj = {};
				regObj.id = objectIdStr;
				regObj.swfVersion = swfVersionStr;
				regObj.expressInstall = xiSwfUrlStr;
				regObj.callbackFn = callbackFn;
				regObjArr[regObjArr.length] = regObj;
				setVisibility(objectIdStr, false);
			}
			else if (callbackFn) {
				callbackFn({success:false, id:objectIdStr});
			}
		},
		
		getObjectById: function(objectIdStr) {
			if (ua.w3) {
				return getObjectById(objectIdStr);
			}
		},
		
		embedSWF: function(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn) {
			var callbackObj = {success:false, id:replaceElemIdStr};
			if (ua.w3 && !(ua.wk && ua.wk < 312) && swfUrlStr && replaceElemIdStr && widthStr && heightStr && swfVersionStr) {
				setVisibility(replaceElemIdStr, false);
				addDomLoadEvent(function() {
					widthStr += ""; // auto-convert to string
					heightStr += "";
					var att = {};
					if (attObj && typeof attObj === OBJECT) {
						for (var i in attObj) { // copy object to avoid the use of references, because web authors often reuse attObj for multiple SWFs
							att[i] = attObj[i];
						}
					}
					att.data = swfUrlStr;
					att.width = widthStr;
					att.height = heightStr;
					var par = {}; 
					if (parObj && typeof parObj === OBJECT) {
						for (var j in parObj) { // copy object to avoid the use of references, because web authors often reuse parObj for multiple SWFs
							par[j] = parObj[j];
						}
					}
					if (flashvarsObj && typeof flashvarsObj === OBJECT) {
						for (var k in flashvarsObj) { // copy object to avoid the use of references, because web authors often reuse flashvarsObj for multiple SWFs
							if (typeof par.flashvars != UNDEF) {
								par.flashvars += "&" + k + "=" + flashvarsObj[k];
							}
							else {
								par.flashvars = k + "=" + flashvarsObj[k];
							}
						}
					}
					if (hasPlayerVersion(swfVersionStr)) { // create SWF
						var obj = createSWF(att, par, replaceElemIdStr);
						if (att.id == replaceElemIdStr) {
							setVisibility(replaceElemIdStr, true);
						}
						callbackObj.success = true;
						callbackObj.ref = obj;
					}
					else if (xiSwfUrlStr && canExpressInstall()) { // show Adobe Express Install
						att.data = xiSwfUrlStr;
						showExpressInstall(att, par, replaceElemIdStr, callbackFn);
						return;
					}
					else { // show alternative content
						setVisibility(replaceElemIdStr, true);
					}
					if (callbackFn) { callbackFn(callbackObj); }
				});
			}
			else if (callbackFn) { callbackFn(callbackObj);	}
		},
		
		switchOffAutoHideShow: function() {
			autoHideShow = false;
		},
		
		ua: ua,
		
		getFlashPlayerVersion: function() {
			return { major:ua.pv[0], minor:ua.pv[1], release:ua.pv[2] };
		},
		
		hasFlashPlayerVersion: hasPlayerVersion,
		
		createSWF: function(attObj, parObj, replaceElemIdStr) {
			if (ua.w3) {
				return createSWF(attObj, parObj, replaceElemIdStr);
			}
			else {
				return undefined;
			}
		},
		
		showExpressInstall: function(att, par, replaceElemIdStr, callbackFn) {
			if (ua.w3 && canExpressInstall()) {
				showExpressInstall(att, par, replaceElemIdStr, callbackFn);
			}
		},
		
		removeSWF: function(objElemIdStr) {
			if (ua.w3) {
				removeSWF(objElemIdStr);
			}
		},
		
		createCSS: function(selStr, declStr, mediaStr, newStyleBoolean) {
			if (ua.w3) {
				createCSS(selStr, declStr, mediaStr, newStyleBoolean);
			}
		},
		
		addDomLoadEvent: addDomLoadEvent,
		
		addLoadEvent: addLoadEvent,
		
		getQueryParamValue: function(param) {
			var q = doc.location.search || doc.location.hash;
			if (q) {
				if (/\?/.test(q)) { q = q.split("?")[1]; } // strip question mark
				if (param == null) {
					return urlEncodeIfNecessary(q);
				}
				var pairs = q.split("&");
				for (var i = 0; i < pairs.length; i++) {
					if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
						return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=") + 1)));
					}
				}
			}
			return "";
		},
		
		// For internal usage only
		expressInstallCallback: function() {
			if (isExpressInstallActive) {
				var obj = getElementById(EXPRESS_INSTALL_ID);
				if (obj && storedAltContent) {
					obj.parentNode.replaceChild(storedAltContent, obj);
					if (storedAltContentId) {
						setVisibility(storedAltContentId, true);
						if (ua.ie && ua.win) { storedAltContent.style.display = "block"; }
					}
					if (storedCallbackFn) { storedCallbackFn(storedCallbackObj); }
				}
				isExpressInstallActive = false;
			} 
		}
	};
}();

Y.swfobject = swfobject;



/**
 * Hack to get SWF's authored using YUIBridge.as to work. 
 * 
 * YUIBridge does all communication through YUI.applyTo() which has a whitelist
 * of allowed targets - Y.SWF.eventHandler being one of them.
 * 
 * See:
 * http://yuilibrary.com/yui/docs/swf/#working-with-the-yuibridge-actionscript-library
 * 
 * To have swf callback communcation w/ YUIBridge SWF's through Y.swfobject:
 *
 *     //element id 
 *     var swfID = ....
 *     
 *     //use to embed swf
 *     Y.swfobject.embedSWF(url, swfID, ....
 *     
 *     //register callback using same id
 *     Y.swfobject.registerCallback(swfID, function(){...});
 *     
 */

Y.swfobject.registerCallback = function(id, func){
    Y.SWF._instances[id] = func;
};

Y.SWF = {
    _instances: [],
    eventHandler: function(id, args){
        var cb = Y.SWF._instances[id];
        if(cb && (typeof cb === 'function')){
            cb(args);
        }
    }
};

}, '0.0.1', {
    requires: []
});


}, '0.0.1', {
    "use": [
        "swfobject",
        "node-event-simulate"
    ],
    "requires": [
        "node",
        "widget",
        "videoplayer",
        "videomodal",
        "json",
        "json-stringify",
        "io",
        "array-extras",
        "share"
    ],
    "skinnable": true
});
YUI.add('videomodal', function (Y, NAME) {

function VideoModal(){
   VideoModal.superclass.constructor.apply(this, arguments);
}

VideoModal.NAME  = 'videomodal';

VideoModal.ATTRS = {

};



Y.namespace('Vdgm').VideoModal = Y.Base.create("videomodal", Y.Widget, [Y.WidgetChild], {
    MODAL_DURATION: 8,
    VIDEO_PAUSED_EVENT: 'video_paused',
    VIDEO_ENDED_EVENT: 'video_ended',
    TRIGGER_VIDEO_STOP: 'video_player_stop',
    TRIGGER_VIDEO_PLAY: 'video_player_play',
    BOUNDING_TEMPLATE: '<div id="video-modal"/>',
    CONTENT_TEMPLATE: ""+
    '<div class="video-headline now-playing">NOW PLAYING</div>'+
    '<div class="video-headline related-videos-headline">RELATED VIDEOS</div>'+
    '<div class="video-paused play-video"><p class="video-headline vdgm-icon-pause icon-pause"></p></div>' +
    '<div id="video-timer-message">'+
    	'<p>NEXT VIDEO WILL BEGIN IN:'+
    		' <span id="video-timer"></span>'+
    	 '</p>'+
    '</div>'+
    '<div id="video-modal-control">'+
        '<div id="control-buttons">'+
            '<div class="control">'+
                '<div id="play-video-control" class="video-control-button play-video">'+
                '</div>'+
            '</div>'+
            '<div class="control">'+
                '<div id="close-video-control" class="video-control-button stop-video">'+
                    '<span class="vdgm-icon-stop icon-stop" >'+
                    '</span>'+
                '</div>'+
            '</div>'+
            '<div class="control">'+
                '<div id="next-video-control" class="video-control-button next-video">'+
                    'Play Next Video' +
                '</div>'+
            '</div>'+
        '</div>'+
            '<div id="share-items">'+
            '<p>SHARE</p>'+
            '<div id="facebook-video-control" class="vdgm-shareable">'+
                '<span class="vdgm-icon-facebook icon-facebook" ></span>'+
            '</div>'+
            '<div id="twitter-video-control" class="vdgm-shareable">'+
                '<span class="vdgm-icon-twitter icon-twitter" ></span>'+
            '</div>'+
            '<div id="email-video-control" class="vdgm-shareable">'+
                '<span class="vdgm-icon-share icon-share"></span>'+
            '</div>'+
        '</div>'+
    '</div>',
    
    templates: {
          LIST:'<ul class="related-videos"></ul>',
          LINK: '://{host}/home/video/{slug}',
          RELATED_ITEM:'' +
          '<li data-itemslug="{slug}" class="related-video related-video-{index}">'+
                  '<a href="{link}" target="{target}">'+
                          '<div class ="list-item-image">'+
                                  '<img  src="{imageURL}"/>'+
                                  '<p>{title}</p>'+
                          '</div>'+
                  '</a>'+
          '</li>',

          REPLAY_BUTTON: '<span class="vdgm-icon-spinner icon-spinner"></span>',
          PLAY_BUTTON: '<span class="vdgm-icon-play icon-play"></span>' 
     },
     relatedGroups:[],
     selectors: {
         relatedVideoItem: '.related-video',
         lastRelatedItem: '.lastRelatedItem',
         prev: '.video-prev',
         next: '.video-next',
         modal: '#video-modal',
         playButton: '#play-video-control',
         playClass: 'play-video',
         stopClass: 'stop-video',
         closeButton: '#close-video-control',
         pausedHeadline: '.video-paused',
         relatedVideos: '.related-videos',
         relatedVideoContainer: '#related-video-container',
         timer: '#video-timer',
         embed: '#embed-player'
     },
     events:{
        '.play-video':{
            click : 'handleControlClick'
         },
         '.stop-video':{
             click : 'handleControlClick'
         },
         '.next-video':{
             click : 'playNextVideo'
         }
     },
    _closeAfterEnded: true,
    _hasShareItems : true,
    initializer: function(cfg){
        var self = this,
          container   = self.get('boundingBox');


        if(!cfg.closeAfterEnded)
            this.get('boundingBox').addClass('no-close');
        else
            self._closeAfterEnded = cfg._closeAfterEnded;

        if(!cfg.hasShareItems){
            this.get('boundingBox').addClass('no-share')
        }
            
        if(!cfg.hasStopButton)
            this.get('boundingBox').addClass('no-stop')

        this.on('parentChange', function(e){
            console.log(e + " " +e.parent)
            self._parent = e.newVal;
            self.initEvents(cfg);
        });

        //Event delegation wireup
        for(var eventContext in this.events){
            for(var eventType in self.events[eventContext])
            {
                container.delegate(eventType, self[self.events[eventContext][eventType]], eventContext, this);
            }
        }
    },

    initEvents: function( cfg ){
        var self = this
            container   = self.get('boundingBox');

        self._parent.after('pause', function(e){
            self._handleModal(cfg, self.VIDEO_PAUSED_EVENT);
            self._initRelated(cfg, self.VIDEO_PAUSED_EVENT);
        });
        self._parent.after('stop', function(e){
            self.get('boundingBox').remove();
            self._parent.remove(this);
        });
        self._parent.after('ended', function(e){
            self._handleModal(cfg, self.VIDEO_ENDED_EVENT);
            self._initRelated(cfg, self.VIDEO_ENDED_EVENT);
        });
       self._parent.after('play', function(e){
            self.get('boundingBox').removeClass('active');
            self.get('boundingBox').ancestor().removeClass('modal-control-active');
        }); 
    },
    setZero: function( currentGroup ){
        return currentGroup < 0 ? 0 : currentGroup;
    },
    cycleItems:function(direction){
        if( (direction == 'fwd' &&  this.currentGroup+1 == this.relatedGroups.length ) || (direction == 'back' &&  this.currentGroup-1 == -1)){
            return
        }

        var self    = this;
        itemIndex   = 0,
        container   =  Y.one(self.selectors.modal),
        relatedVideoList = container.one(self.selectors.relatedVideos),
        nextGroup = self.relatedGroups[ direction === 'fwd' 
                                        ? self.currentGroup + 1 
                                        : self.setZero( self.currentGroup - 1) ],

        nextIndex = direction === "fwd" 
                    ? self.currentGroup+1 
                    : self.setZero( self.currentGroup - 1);
        if( nextIndex >= 0 && !self.transitioning ){
            self._repetition    =  8;
            self.transitioning  = true;

            self.relatedGroups[ self.currentGroup ].hide( 'fadeOut', {}, function(){

                nextGroup.show('fadeIn', {}, function(){
                    self.currentGroup = nextIndex;
                    self.transitioning = false;
                });
            });
        }
     },

     _initRelated: function ( cfg, state )
     {
        var related              = this._parent.model.related_videos,
        self                     = this,
        //playstate                = state,
        container                = this.get('boundingBox').ancestor(),
        modal                    = this.get('boundingBox'),
        index                    = 0,
        relatedGroupIndex        = 0,
        relatedVideoList         = Y.Node.create( this.templates.LIST ),
        link                     = '',
        item                     = {},
        list                     = {};
        
        self.transitioning       = false;
        self.totalGroups         = 0;
        self.maxRelated          = Math.floor(modal.get('offsetWidth') / 210);

       this.embed = this._parent.model.embed;

       if(!related){
            container.one( '.related-videos-headline').addClass('hide');
            container.one( '#next-video-control').addClass('hide');
            container.one( '#video-timer-message').addClass('hide');
         return 
       }
       for( var i=0; i < Number( related.length ); i++ ){
            index      = i,
            link       = related[index].link
                            ? related[index].link 
                            : Y.Lang.sub(self.templates.LINK, { host:cfg.host, slug: related[index].slug}),
            subcfg=   {
                slug: related[ index ].slug,
                index: index,
                link: link,
                imageURL: self._getThumbImage(related[index]),
                target: self.embed ? '_blank' : '_self',
                title: related[index].title
            };
            
            //populate template
            var  item = Y.Lang.sub( self.templates.RELATED_ITEM, subcfg),
                //create related item result of Lang.sub
                 relatedItem = Y.Node.create( item );


            if(!i)
            {
                self.firstRelated = relatedItem;
            }
            
            
            
            //add related video to dom
            relatedVideoList.appendChild( relatedItem );
            
        }

        if(!self.get('boundingBox').one( self.selectors.relatedVideos)){
            self.get('boundingBox').appendChild( relatedVideoList );
                
            var listNode = self.get('boundingBox').one( self.selectors.relatedVideos ).getDOMNode();
            var scrollTarget = jQuery(  listNode );
                scrollTarget.perfectScrollbar({
                    wheelPropagation: true
                });
        }
    },

    _getThumbImage:function( relatedItem ){
        var thumbImage,
        self = this;

        if(relatedItem.images && relatedItem.images[ 285 ]){
           thumbImage = relatedItem.images[285].imageUrl;
        }
        else{
              thumbImage = relatedItem.images[ 263 ] ? relatedItem.images[263].imageUrl : "";
        }
        return thumbImage;
    },

    _handleModal: function ( cfg, type ){
        if( this.get('boundingBox').hasClass('active'))
            return

        var container = this.get('boundingBox').ancestor(),
        self        = this,
        model       = this._parent.model,
        modal       = this.get('boundingBox'),
        modalPlay   = this.get('boundingBox').one( self.selectors.playButton ),
        modalClose  = this.get('boundingBox').one( self.selectors.closeButton ),
        embed       = {};
        self.type   = type;

            //MAIN-VIDEO
            this.get('boundingBox').ancestor().addClass('modal-control-active');

            if(self.type){
                this.get('boundingBox').removeClass('video_paused');
                this.get('boundingBox').removeClass('video_ended');
                this.get('boundingBox').addClass(self.type);
            }

            self._repetition = self.MODAL_DURATION;

        if( self.type === self.VIDEO_PAUSED_EVENT )
        {
           modalPlay.setHTML( self.templates.PLAY_BUTTON );
           self.isPaused = true;
        }

        else if( self.type === self.VIDEO_ENDED_EVENT ){
            modalPlay.setHTML( self.templates.REPLAY_BUTTON ); 
            if( model.related_videos )
                self._setTimer();//
        }
        self.fbShare = modal.one('#facebook-video-control');
        self.fbShare.setAttribute( 'data-shareid', 'facebook:video:' + model.id);
        self.twitterShare = modal.one('#twitter-video-control');
        self.twitterShare.setAttribute( 'data-shareid', 'twitter:video:' + model.id);
        self.emailShare = modal.one('#email-video-control');
        self.emailShare.setAttribute( 'data-shareid', 'email:video:' + model.id);
        this.get('boundingBox').addClass('active');

        //bear in mind the model property is related *_* videos vs the ul id which is related *-* videos]
    },

   handleControlClick: function( e )
   {
       var self = this,
       container = self.get('boundingBox');
       control = e.currentTarget;
       
       if( control.hasClass( self.selectors.playClass ) )
        {
           if( self.type === self.VIDEO_ENDED_EVENT )
           {
               self._repetition = self.MODAL_DURATION;
               window.clearInterval( self.interval ); 
           };
           self._parent.play();
           //this.fire( self.TRIGGER_VIDEO_PLAY );
        }
        else if( control.hasClass( self.selectors.stopClass ) )
        {
            self._parent.stop();
            window.clearInterval( self.interval );
            return;
        }
        container.removeClass('active');
    },

    playNextVideo: function( e )
    {
        this.firstRelated.one('a').simulate("click");
    },

    closeModal: function(  ){
        var self = this;

        self.get('boundingBox').removeClass('active');
    },

    related : {

    },
    _setCurrentTime: function (time){
        var el = this._swf.getDOMNode();
        el.setCurrentTime(time);
    },
    _handleTimer: function(  )
    {
        var self = this,
            container = this.get('boundingBox');
               
        var counter = container.one(self.selectors.timer);
        if( self._repetition > 0  ){
            self._repetition = self._repetition - 1;
            counter.setHTML( self._repetition );
        }
        else{
            window.clearInterval( self.interval );
            self.playNextVideo();
            //this.fire( self.TRIGGER_VIDEO_STOP );
            self._repetition = self.MODAL_DURATION;
        }
    },
    _repetition: 0,

    _setTimer: function( ){
        var self = this;
        self.interval = window.setInterval( function(){ self._handleTimer() }, 1000 );
    }
});


if(Y.Vdgm.app)
Y.augment(VideoModal, Y.Vdgm.Logger);




}, '0.0.1', {
    "requires": [
        "node-event-html5",
        "widget",
        "vdgm-logr",
        "event-synthetic",
        "widget-child"
    ],
    "skinnable": true
});
YUI.add('videoplayer', function (Y, NAME) {

function VideoPlayer(){
    VideoPlayer.superclass.constructor.apply(this, arguments);
}

VideoPlayer.ATTRS 				= {};
VideoPlayer.NAME 				= 'videoPlayer';

VideoPlayer.POSTER_TEMPLATE =  '' +
    '<div id="poster">' +
        '<div id="poster-container">' + 
           '<div id="html-poster-stop" class="vdgm-icon-stop icon-stop"></div>' +
           '<div id="html-poster-play" class="vdgm-icon-play icon-play"></div>'+
        '</div>'+
         '<img src="{poster_url}">'+
    '</div>';

VideoPlayer.HTML_VIDEO_TEMPLATE = '' +
    '<video controls preload="auto">' +
        '<source src="{videoUrl}" type="video/mp4">' +
    '</video>';

VideoPlayer.ANDROID_VIDEO_TEMPLATE = '' +
    '<video controls preload="auto">' +
        '<source src="{videoUrl}" type="video/mp4">' +
    '</video>';


VideoPlayer.GET_FLASH_TEMPLATE = '' +
'<div class="no-flash">' + 
    '<p>' + 
        '<a href="http://get.adobe.com/flashplayer/">Please install ' +
        '<strong>Adobe Flash Player</strong> to view this content.</a>' +
    '</p>' + 
'</div>';




Y.namespace('Vdgm').VideoPlayer = Y.Base.create("videoPlayer", Y.Widget, [Y.WidgetParent, Y.WidgetChild], {
  	_assetPath: '@ASSETPATH@',
    
    _techs: {
        flash: {
            renderUI: '_renderFlashVideo',
            bindUI: '_bindFlashVideo',
            play: '_playFlashVideo',
            //syncUI: '_syncFlashVideo'
            pause: '_pauseFlashVideo',
            stop: '_stopFlashVideo',
            destructor: '_destroyFlashVideo',
            remove: '_removeFlashVideo'
        },
        html: {
            renderUI: '_renderHtmlVideo',
            bindUI: '_bindHtmlVideo',
            play: '_playHtmlVideo',
            //syncUI: '_syncHtmlVideo'
            pause: '_pauseHtmlVideo',
            stop: '_stopHtmlVideo',
            destructor: '_destroyHtmlVideo',
            remove: '_removeHtmlVideo'
        }
    },
    _percentPlayed: 0,
    
    toggleLarge: function(){
        this.fire('togglelargeview');
    },
    
    initializer: function(config){
        var self = this;
		this.model = config.model;
        this.host = config.host;
        this.f4mhost =  config.f4mhost ? config.f4mhost : null;
        this.flashLiveStream = config.settings.flash;
        this.htmlLiveStream = config.settings.html;
        this.tintColor  = config.settings.tintColor;
        this.tech = config.tech || this.getTech(Y.UA);
        this.type = this.model.type;
        this.embed = this.model.embed;
        this.duration = this.model.duration ? this.model.duration : 0;
        this.meta = this.model.meta ? this.model.meta  : [];
        self.isPaused = false,
        self.started = false;
        this.mapTech(  );  
        this.on('destroy', this.destructor, this);
        
        if(!config.autoplay){
            self._autoplay = false;
        };
    },
	
	getTech: function(ua){
        //console.log(Y.SWFDetect.getFlashVersion());
        var hasFlash = function() {
            if(typeof ActiveXObject != "undefined")
                return (typeof navigator.plugins == "undefined" || navigator.plugins.length == 0) ? !!(new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) : navigator.plugins["Shockwave Flash"];
            else
                return (typeof navigator.plugins == "undefined" || navigator.plugins.length == 0) ? false : navigator.plugins["Shockwave Flash"];
        };
		return (Y.UA.flashMajor != null) || hasFlash() ? 'flash' : 'html';
    },
    
    getVideo: function(type){
        return Y.Array.filter(this.model.videos, function(vid){
            return vid.type === type;
        })[0];
    },
    
    mapTech: function(){
        this._mapToTech('renderUI');
        this._mapToTech('bindUI');
        this._mapToTech('play');
        this._mapToTech('pause');
        this._mapToTech('stop');     
        this._mapToTech('destructor');  
        this._mapToTech('remove');   
       
    },
        
    _mapToTech: function(method){
        var self = this;
        self[method] = function(){
           	self[self._techs[self.tech][method]].call(self, arguments);
        };
    },
    
    //=============================================================
    // html
    //=============================================================
    
    _video: null,
    _renderHtmlVideo: function(){
        var source,
            template = VideoPlayer.HTML_VIDEO_TEMPLATE,
            cb = this.get('contentBox');
            
			this.contentBox = 'contentBox';
            this.timeIterator = 0;
            
            //This hard coded value really needs to come from config, but for now... SURPRISE
            if(this.model.type == "live")
                source = {videoUrls:{html:""}};
            else if(this.model.type == "archive")
            {
                source = {videoUrls:{html:Y.Lang.sub(VideoPlayer.ARCHIVE_HTML_VIDEO_TEMPLATE, {videoPath:this.model.slug} )}};
            }
            else
                source = this.getVideo('hd') ? this.getVideo('hd') : this.getVideo('ios').videoUrls.ios;
            
            if(!source)
                source = this.getVideo('mobhigh');
            
            if(!source)
                source = this.getVideo('high');
            
        this._poster = cb.appendChild(Y.Lang.sub(VideoPlayer.POSTER_TEMPLATE, {
            poster_url: this._getPosterImage()
        }));       
        this._video = cb.appendChild(Y.Lang.sub(template, {
            videoUrl: source
        }));
                
       
        
        
        this._poster.one('#html-poster-stop').once('click', function(){
           this.stop(); 
        }, this);
        
        this._poster.one('#html-poster-play').once('click', function(){
           //Y.one('video')._node.play();
           this._video.invoke( 'play' );
           this._poster.remove(true);
        },this);
    },
	
	_addDescriptionCloseButton: function(){
  		var self = this,
	    embed    = Y.one('#embed-player'),
        controls = embed.one('#control-buttons');
		
		var closeInfoBtn = Y.Node.create('<div class="vdgm-icon-cancel-circle"></div>');
		embed.one('.vdgm-sharebar').prepend( closeInfoBtn );
		
		closeInfoBtn.detach('click');
		closeInfoBtn.on('click', function ( ){
            self._track('VideoDescriptionClosed' );
            if( self.isPaused == true && self.started){
                   self.play(  );
            }
			embed.replaceClass('info-active', 'info-inactive');
			embed.one('.vdgm-sharebar').one('.vdgm-icon-cancel-circle').remove();
			self._addDescriptionButton();
		});
	},

  	_addDescriptionButton: function(){
  		var self = this,
		container = Y.one('#embed-player');
		var info = Y.Node.create('<div class="vdgm-icon-info"></div>');
  		container.one('.vdgm-sharebar').prepend( info );
  		info.detach('click');
		info.on('click', function(e){
            self._track('VideoDescriptionOpened' );
            container.one('.vdgm-icon-info').remove();
            self._addDescriptionCloseButton();
            container.replaceClass('info-inactive' , 'info-active');    
 
            if( self.isPaused == false && self.started){
                  self.pause(  );
            }
        })
  	},
    
    _bindHtmlVideo: function(){
        this._video.on('play', this._htmlEventHandler, this);
        this._video.on('pause', this._htmlEventHandler, this);
        this._video.on('ended', this._htmlEventHandler, this);
        this._video.on('timeupdate', this._htmlEventHandler, this);
        this._video.on('seeked', this._htmlEventHandler, this);
       // this._video.on('webkitendfullscreen', this._htmlEventHandler, this);
    },
    
    _htmlEventHandler: function(e){
        var eh = this['_html_' + e.type];
        
        if(typeof eh === 'function'){
            eh.call(this, e);
        }
    },
    
    _html_timeupdate: function(e){
        var el = this._video.getDOMNode(),
        currentTime = el.currentTime;
          
        if(this.meta && this.meta.length > 0 && this.meta.length > this.timeIterator)
        {  
            var metaTime = Number(this.meta[this.timeIterator].offset);
            if(currentTime > metaTime)
            {
                this.fire('updateMeta', {currentTime:currentTime, meta:this.meta});
                this.timeIterator++;
            }
        }
        
        if(this._percentPlayed < 25)
        {
            if(currentTime / this.duration >= .25)
            {
                this._track('PercentPlayed25' );
                this._percentPlayed = 25;
            }
        }
        else if(this._percentPlayed < 50)
        {
            if(currentTime / this.duration >= .5)
            {
                this._track('PercentPlayed50' );
                this._percentPlayed = 50;
            }
        }
        else if(this._percentPlayed < 75)
        {
            if(currentTime / this.duration >= .75)
            {
                this._track('PercentPlayed75' );
                this._percentPlayed = 75;
            }
        }
        else if(this._percentPlayed < 90)
        {
            if(currentTime / this.duration >= .90)
            {
                this._track('PercentPlayed90' );
                this._percentPlayed = 90;
            }
        }
        
        if(!this._loadStarted)
        {
            if( this.model.timeoffset )
            {
                this._video.getDOMNode().currentTime = Number(this.model.timeoffset);
                this.fire('updateMeta', {currentTime:Number(this.model.timeoffset), meta:this.meta});
            }
            this._loadStarted = true;
        }
    },
    
    _html_seeked: function(e){
         var el = this._video.getDOMNode(),
         currentTime = el.currentTime;
         
         this.fire('updateMeta', {currentTime:currentTime, meta:this.meta});
         this.timeIterator = 0;
        
    },
    
    _html_play: function(e){
        this._track('Start');
		this.fire('play');
		this.get('contentBox').addClass('html-active');
    	this.isPaused = false;
        this.started = true;
    	this._video.setAttribute('controls', 'true');
        
        this._html_play = function(e){
             this.get('contentBox').addClass('html-active');
        	 this._video.setAttribute('controls', 'true');
             this.fire('play');
            // at least 2nd play                  

            // osmf/strobe player will give a couple of "play" events right off
            // the bat... not sure how to filter to the one we actually want??
            //this._track('Play');
		};
    },
    
    _html_pause: function(e){
        //html <video> sends 'pause' event when it completes
        this._video.removeAttribute('controls');
        var self = this,
             ended = this._video.get('ended'),
             cb = this.get('contentBox');
        
        if(!ended){
            this._track('Pause');
            
			this.fire('pause');
             
        };
        
        cb.removeClass('html-active');

    },
    
    _html_ended: function(e){
        this._track('Complete');
        this.fire('ended');
        this._percentPlayed = 0;
    },
    
    _playHtmlVideo: function(){
        var self = this;
		self.isPaused = false;   
		self.started = true;
        this._video.setAttribute('controls', 'true');
		this._video.invoke( 'play' ); 
	},

    _pauseHtmlVideo: function(){ 
        
        var args = arguments[0];
        var clicked = arguments[0] ? arguments[0][0] : false;
		var self = this;
	    this.isPaused = true;
		 
		this._video.invoke('pause');   
    },
   //webkitendfullscreen: function(){this._pauseHtmlVideo},
   
   _stopHtmlVideo: function(){
		var self = this;
	
		this._video.invoke('pause');
        	//console.log( 'invoking pause prior to closing video' );
            
    	if(this.type == "live")
        {
            this.model.set("userstopped", true);
        }
		this._percentPlayed = 0;
        this.fire('stop');      
        this._track('Stop'); 
    },
    
    _destroyHtmlVideo: function(){
        //TODO: gtfo
		this.model.clear(); 
    },
    
    _removeHtmlVideo: function(){
        //TODO: gtfo
		//this.model.clear(); 
    },
    
    /**
     * @param type
     * Play
     */
    _track: function(type, data){
        var self = this;
            slug = self.model.slug;
            videoCategory = "VODVideo";
            
        data = data || {};
        
        if(this.embed == true)
        {
            videoCategory = "EmbedVideo";
            if(this.type === 'live')
            {
                videoCategory = "EmbedLiveVideo";
            }
            else if(this.type === 'archive')
            {
                videoCategory = "EmbedArchiveVideo";
            }
        }
        else
        {
            if(this.type === 'live')
            {
                videoCategory = "LiveVideo";
            }
            else if(this.type === 'archive')
            {
                videoCategory = "ArchiveVideo";
            }
        }
        
        Y.fire('interact', Y.merge(data, {
            category: videoCategory,
            action: type,
            label: slug
        }));
    },
    
    //=============================================================
    // flash
    //=============================================================
    
    _swf: null,
    
    /**
     * Defines callback function for Strobe.swf.
     * @param id {string} A string unique to this instance.
     * @return {string} Path to globally available function that the strobe swf
     * can use as callback.
     */
    _getGlobalCallback: function(id){
        // create a namespace for ourselves in YUI.Env, which is globally
        // available on window, and create callback functions there    
	    var self = this,
            path = 'Env.Vdgm.VideoPlayer',
            ns = Y.namespace.call(YUI, path);
         
            
        ns[id] = function(id, eventName, e){
           if( eventName == 'onJavaScriptBridgeCreated' ){
			   //self.player = Y.one('#'+id).getDOMNode();
				self.player = document.getElementById(id); 
				self.playerNode =Y.one('#'+id);
		   }
				
		   if(self['_flash_' + eventName]){   
		    	self['_flash_' + eventName].call(self, e);
           }
		   if(self['_flash_' + id]){
	    		self['_flash_' + id].call(self, e);
		   }

        };
        return 'YUI.' + path + '.' + id;
    },
    
    _flash_progress : function( e ) {
       this.fire('progress');  
    },
    _flash_onJavaScriptBridgeCreated: function(e){
		
	},
    _flash_timeChange: function(e){
        
        var currentTime = e.currentTime;
        
        if(this.model.timeoffset)
            currentTime += this.model.timeoffset;
        
        if(this.meta && this.meta.length > 0 && this.meta.length > this.timeIterator)
        {
            var metaTime = Number(this.meta[this.timeIterator].offset);
            if(currentTime > metaTime)
            {
                this.fire('updateMeta', {currentTime:currentTime, meta:this.meta});
                this.timeIterator++;
            }
        }
        
        if(this._percentPlayed < 25)
        {
            if(currentTime / this.duration >= .25)
            {
                this._track('PercentPlayed25' );
                this._percentPlayed = 25;
            }
        }
        else if(this._percentPlayed < 50)
        {
            if(currentTime / this.duration >= .5)
            {
                this._track('PercentPlayed50' );
                this._percentPlayed = 50;
            }
        }
        else if(this._percentPlayed < 75)
        {
            if(currentTime / this.duration >= .75)
            {
                this._track('PercentPlayed75' );
                this._percentPlayed = 75;
            }
        }
        else if(this._percentPlayed < 90)
        {
            if(currentTime / this.duration >= .90)
            {
                this._track('PercentPlayed90' );
                this._percentPlayed = 90;
            }
        }
        
        if(!this._loadStarted)
        {
            var el = this._swf.getDOMNode(),
                startTime = this.model.get('timeoffset') ? Number( this.model.get('timeoffset') ) : 0;
            
            if(startTime != 0)
            {
                //For some reason doing a seek right away just straight won't work.  Investigate later.
                //Y.later(300, this, this._setCurrentTime, startTime );
                this._setCurrentTime(startTime);
            }
            this._loadStarted = true;
        }
    },
    
    _flash_seeked: function(e){
         var el = this._swf.getDOMNode(),
         currentTime = el.getCurrentTime();
         
         if(this.model.timeoffset)
             currentTime += this.model.timeoffset;
        
         
         this.fire('updateMeta', {currentTime:currentTime, meta:this.meta});
         this.timeIterator = 0;
    },
	
	_playPreroll: function(){
		var self = this;
		
        this._preroll.shown = true;
        
		this.player.displayAd({
		                    id: "preroll"
		                    , url: this._preroll.src
		                    , hideScrubBarWhilePlayingAd: true
							, pauseMainMediaWhilePlayingAd : true
							, resumePlaybackAfterAd : true
							, onComplete: self._getGlobalCallback(this.player._yuid)
		                });
	},
    
    _flash_playing: function(e){
        this._track('Start');  
        this.fire('play');
	    var self = this;
		self.isPaused = false; 
        self.started = true;
		
		if (this._preroll && !this._preroll.shown) {
		        this._playPreroll();
		 }
		
		
		this._flash_playing = function(e){
            // at least 2nd play                  
            // osmf/strobe player will give a couple of "play" events right off
            // the bat... not sure how to filter to the one we actually want??
            //this._track('Play');
		        
            var self = this;    
            self.isPaused = false;     
            self.started = true;
            this.fire('play');
			if (this._preroll && !this._preroll.shown) {
			        this._playPreroll();
			 }
			
		};
    },
	
    _flash_paused: function(e){
		
		if(this._preroll)
		{
			if(this._preroll.shown && !this._preroll.complete)
				return;
		}
		
		if(this._postroll)
		{
			if(this._postroll.shown && !this._postroll.complete)
				return;
		}
		
        //Y.fire('interact', {action: 'video.pause'}); 
        //console.log( 'video player paused = ' + VideoPlayer.PAUSED );
 	   	
		
		
        this.fire('pause');
        
        this._track('Pause'); 
	 },
    
    _flash_stopVideo: function(e){
        this._track('Stop');
        this.fire('stop');
        this._percentPlayed = 0;
        //Y.fire('interact', {action: 'video)()'});
        //console.log( 'stopped flash vid');
		if(this.type == "live")
        {
            this.model.set("userstopped", true);
        }
        this.stop();
    },  
	
	_flash_mediaSize: function(e){
		//console.log('flash size changed');
	},
    
    _flash_error: function(e){
        this._percentPlayed = 0;
        this.stop();
    },
	
    _flash_complete: function(e){
		var self = this;
		
		if(this._postroll)
		{
			if(this._postroll.shown && this._postroll.complete)
	    	{	
                this._percentPlayed = 0;
                this._track('Complete');
                this.fire('ended');
				return;
			}
			
			else
			{
				this._postroll.shown = true;
				this.player.displayAd({
				                    id: "postroll"
				                    , url: this._postroll.src
		                    		, hideScrubBarWhilePlayingAd: true
									, pauseMainMediaWhilePlayingAd : true
									, onComplete: self._getGlobalCallback(this.player._yuid)
				                });
							
			}	
		}
		else
        {    
		//if(e.ended){
            this._percentPlayed = 0;
            this._track('Complete');
            this.fire('ended');
            //Y.fire('interact', {action: 'video.end'});
        //}
        }
    },
	
	_flash_preroll: function(e){
		this._preroll.complete = true;
	},
	
	_flash_postroll: function(e){
		this._postroll.complete = true;
    },
    
    _flash_toggleLargeVideo: function(e){
        this.toggleLarge();
    },

       
    _loadStarted: false,
    _getPosterImage: function() {
        var posterImage,
            self = this,
            where = (self.f4mhost ? self.f4mhost: self.host  );
        
        if(Y.Vdgm.app)
            posterImage = self.model.images ? self.model.images[285].imageUrl : "";
        else
            posterImage =  where  +  (self.model.images[1140] ? self.model.images[1140].imageUrl : "");
        return posterImage;
    },
    _autoplay: self.embed != true,
    _renderFlashVideo: function(){
        
 		var self = this,
            source = this.type + "-f4m/" + self.model.slug,
            swfUrl = self._assetPath + 'GrindPlayer.swf',
            expressInstallUrl = self._assetPath + 'expressInstall.swf',
            cb = this.get('contentBox'),
            fb = cb.appendChild('<div></div>'),
			preroll = self.model.preroll,
			postroll = self.model.postrolls,
            poster_image = self._getPosterImage(),
		    swfId = fb.generateID(),
            flashvars = {
                autoPlay: self._autoplay,
                javascriptCallbackFunction: self._getGlobalCallback(swfId),
				bufferingOverlay: false,
                initialBufferTime: 3,
                expandedBufferTime: 10,
				tintColor: self.tintColor,
				poster: poster_image,
				embed: self.embed == true,
                showIntermediateButton: Y.Vdgm.app ? !(self.embed == true) : false
				},
            attrs = {
                wmode: 'opaque'
            },
            params = {
                allowFullScreen: true,
                allowScriptAccess: 'always',
                wmode: 'opaque',
                name: swfId
			};
            
            if(this.type == 'live')
            {
                    flashvars.src = self.flashLiveStream;
                    self.model.set("userstopped", false);
            }
            
            else
            {
                if(self.f4mhost)
                    flashvars.src = 'http://' +   self.f4mhost + '/api/' + source + '.f4m';
                else if( self.host & Y.Vdgm.app )
                    flashvars.src = 'http://' +   self.host + '/api/' + source + '.f4m';
                else
                    flashvars.src = this.getVideo('ios').videoUrls.ios;
            }
            
            
			if( preroll  != null && preroll != undefined )
			{
				var prerollSrc = "";
                
                if(self.host){
				    if(preroll.promo_type == "channel")
				    	prerollSrc = 'http://' +  self.host + '/api/promo-f4m/channel/preroll/' + preroll.channelSlug + '.f4m';
				    else
				        prerollSrc = 'http://' +  self.host + '/api/promo-f4m/video/preroll/' + self.model.slug + '.f4m';
                }
                else
                    prerollSrc = this.getVideo('ios').videoUrls.ios;
				this._preroll = {
								 src: prerollSrc,
								 shown: false,
								 complete: false
								};
			}
			
			if( postroll != null && postroll != undefined )
			{
				var postrollSrc = "";
				if(self.host){
				    if(postroll.promo_type == "channel")
				    	postrollSrc = 'http://' +  self.host + '/api/promo-f4m/channel/postroll/' + postroll.channelSlug + '.f4m';
				    else
				    	postrollSrc = 'http://' +  self.host + '/api/promo-f4m/video/postroll/' + self.model.slug + '.f4m';
					}
                    else
                        postrollSrc = this.getVideo('ios').videoUrls.ios;
				this._postroll = {
								 src: postrollSrc,
								 shown: false,
								 complete: false
								};
			}
            
            this.timeIterator = 0;
            
        Y.swfobject.embedSWF(
            swfUrl,
            swfId,
            '100%', '100%',
            '10.1.0',
            expressInstallUrl,
            flashvars,
            attrs,
            params,
            function(e){
                if(e.success){
                    self._swf = Y.Node(e.ref);
                    
                    if(self.type == "live")
                    {
                        self._flash_playing(null);
                    }    
                }
                else{
                    fb.remove();
                    self._renderGetFlashMessage();
                }
            }
        );        
        
      if(!self._autoplay){
        var videocontent = self.get('boundingBox').one('.yui3-videoplayer-content');
        videocontent.addClass('icon-play vdgm-icon-play');
        if(self.model.images )
            if(self.model.images[1140]){
                videocontent.setStyle('background-image', "url(" + self._getPosterImage() + ")");
                console.log( self._getPosterImage( ));
               }
        
           self.once( 'play' ,function(e){
                videocontent.setStyle('background-image', "none");
                videocontent.removeClass('icon-play vdgm-icon-play');
                Y.later(  1000, self, self._playFlashVideo );
                
           });
       }
    },
    
    _bindFlashVideo: function(){
    },

    _playFlashVideo: function(){
        // Duping pause method, since it is a safe way to invoke methods
        var el = this._swf.getDOMNode(),
        self = this;
        
        try{
            if( self.player && el.getCanPlay() )
                el.play2();
            else
            {
                Y.later(
                    200,
                    this,
                    self._playFlashVideo
                );
            }
        }
        catch(e){
            Y.later(
               200,
               this,
               self._playFlashVideo
            );
        };             
    },
    
    _pauseFlashVideo: function(  ){
        //call pause directly on DOM node instead of using _swf.invoke('pause').
        //the latter was causing "Error calling method on NPObject" errors. ??
        var args = arguments[0];
        
		var self = this;
		
		if(this.type != "live" && self.player && self.player.getPlaying() )
        {
            var el = self.player;
            if(el.pause )
            el.pause(  );
            self.isPaused = true;
        }
    },
    
    _stopFlashVideo: function(){
        this._pauseFlashVideo();
        
        this._track('Stop');
        this._percentPlayed = 0;
        //Y.fire('interact', {action: 'video.stop'});
        //console.log( 'stopped flash vid');
		if(this.type == "live")
        {
            this.model.set("userstopped", true);
        }
        
        this.fire('stop');
    },
    
    _removeFlashVideo: function(){
        if(this.player){
             this._swf.remove(true);
         } 
    },
    
    _destroyFlashVideo: function(){
       if(this.player){
            this._swf.remove(true);
        }
        
		this.model.clear();
    },

    _renderGetFlashMessage: function(){
        var cb = this.get('contentBox');
        cb.appendChild(Y.Node.create(VideoPlayer.GET_FLASH_TEMPLATE));
    }
});

if(Y.Vdgm.app)
Y.augment(VideoPlayer, Y.Vdgm.Logger);



}, '0.0.1', {
    "requires": [
        "node-event-html5",
        "widget",
        "vdgm-logr",
        "swfobject",
        "swf",
        "widget-parent",
        "widget-child"
    ],
    "skinnable": true
});
YUI.add('vdgmvideoplayer', function (Y, NAME) {}, '0.0.1', {"use": ["vdgm", "videomodal", "videoplayer"]});
