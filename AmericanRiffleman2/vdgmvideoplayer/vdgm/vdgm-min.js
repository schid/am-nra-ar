YUI.add("vdgm",function(e,t){function n(){n.superclass.constructor.apply(this,arguments)}n.NAME="vdgm",n.ATTRS={},e.namespace("external").VDGM=e.Base.create("vdgm",e.Widget,[e.WidgetChild],{initializer:function(e){this.isLocal=e.isLocal},players:[],newVideoPlayer:function(t){var n=new e.Vdgm.VideoModal({host:t.host}),r=new e.Vdgm.VideoPlayer(t.videoConfig),i=e.one(t.targetNode),s=this,o="/yui/build/videoplayer/assets/",u=t.host+"/vdgmvideoplayer/videoplayer/assets/",a=s.isLocal?o:u;return r._assetPath=a,r.add(n),r.render(i.one(".main-video")),n.render(i.one(".main-video")),e.after("interact",function(e){}),s.players.push(r),r}}),YUI.add("swfobject",function(e){
/*!	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
;var t=function(){function k(){if(w)return;try{var e=f.getElementsByTagName("body")[0].appendChild(z("span"));e.parentNode.removeChild(e)}catch(t){return}w=!0;var n=h.length;for(var r=0;r<n;r++)h[r]()}function L(e){w?e():h[h.length]=e}function A(t){if(typeof a.addEventListener!=e)a.addEventListener("load",t,!1);else if(typeof f.addEventListener!=e)f.addEventListener("load",t,!1);else if(typeof a.attachEvent!=e)W(a,"onload",t);else if(typeof a.onload=="function"){var n=a.onload;a.onload=function(){n(),t()}}else a.onload=t}function O(){c?M():_()}function M(){var t=f.getElementsByTagName("body")[0],r=z(n);r.setAttribute("type",s);var i=t.appendChild(r);if(i){var o=0;(function(){if(typeof i.GetVariable!=e){var n=i.GetVariable("$version");n&&(n=n.split(" ")[1].split(","),N.pv=[parseInt(n[0],10),parseInt(n[1],10),parseInt(n[2],10)])}else if(o<10){o++,setTimeout(arguments.callee,10);return}t.removeChild(r),i=null,_()})()}else _()}function _(){var t=p.length;if(t>0)for(var n=0;n<t;n++){var r=p[n].id,i=p[n].callbackFn,s={success:!1,id:r};if(N.pv[0]>0){var o=U(r);if(o)if(X(p[n].swfVersion)&&!(N.wk&&N.wk<312))$(r,!0),i&&(s.success=!0,s.ref=D(r),i(s));else if(p[n].expressInstall&&P()){var u={};u.data=p[n].expressInstall,u.width=o.getAttribute("width")||"0",u.height=o.getAttribute("height")||"0",o.getAttribute("class")&&(u.styleclass=o.getAttribute("class")),o.getAttribute("align")&&(u.align=o.getAttribute("align"));var a={},f=o.getElementsByTagName("param"),l=f.length;for(var c=0;c<l;c++)f[c].getAttribute("name").toLowerCase()!="movie"&&(a[f[c].getAttribute("name")]=f[c].getAttribute("value"));H(u,a,r,i)}else B(o),i&&i(s)}else{$(r,!0);if(i){var h=D(r);h&&typeof h.SetVariable!=e&&(s.success=!0,s.ref=h),i(s)}}}}function D(t){var r=null,i=U(t);if(i&&i.nodeName=="OBJECT")if(typeof i.SetVariable!=e)r=i;else{var s=i.getElementsByTagName(n)[0];s&&(r=s)}return r}function P(){return!E&&X("6.0.65")&&(N.win||N.mac)&&!(N.wk&&N.wk<312)}function H(t,n,r,i){E=!0,y=i||null,b={success:!1,id:r};var s=U(r);if(s){s.nodeName=="OBJECT"?(m=j(s),g=null):(m=s,g=r),t.id=o;if(typeof t.width==e||!/%$/.test(t.width)&&parseInt(t.width,10)<310)t.width="310";if(typeof t.height==e||!/%$/.test(t.height)&&parseInt(t.height,10)<137)t.height="137";f.title=f.title.slice(0,47)+" - Flash Player Installation";var u=N.ie&&N.win?"ActiveX":"PlugIn",l="MMredirectURL="+a.location.toString().replace(/&/g,"%26")+"&MMplayerType="+u+"&MMdoctitle="+f.title;typeof n.flashvars!=e?n.flashvars+="&"+l:n.flashvars=l;if(N.ie&&N.win&&s.readyState!=4){var c=z("div");r+="SWFObjectNew",c.setAttribute("id",r),s.parentNode.insertBefore(c,s),s.style.display="none",function(){s.readyState==4?s.parentNode.removeChild(s):setTimeout(arguments.callee,10)}()}F(t,n,r)}}function B(e){if(N.ie&&N.win&&e.readyState!=4){var t=z("div");e.parentNode.insertBefore(t,e),t.parentNode.replaceChild(j(e),t),e.style.display="none",function(){e.readyState==4?e.parentNode.removeChild(e):setTimeout(arguments.callee,10)}()}else e.parentNode.replaceChild(j(e),e)}function j(e){var t=z("div");if(N.win&&N.ie)t.innerHTML=e.innerHTML;else{var r=e.getElementsByTagName(n)[0];if(r){var i=r.childNodes;if(i){var s=i.length;for(var o=0;o<s;o++)(i[o].nodeType!=1||i[o].nodeName!="PARAM")&&i[o].nodeType!=8&&t.appendChild(i[o].cloneNode(!0))}}}return t}function F(t,r,i){var o,u=U(i);if(N.wk&&N.wk<312)return o;if(u){typeof t.id==e&&(t.id=i);if(N.ie&&N.win){var a="";for(var f in t)t[f]!=Object.prototype[f]&&(f.toLowerCase()=="data"?r.movie=t[f]:f.toLowerCase()=="styleclass"?a+=' class="'+t[f]+'"':f.toLowerCase()!="classid"&&(a+=" "+f+'="'+t[f]+'"'));var l="";for(var c in r)r[c]!=Object.prototype[c]&&(l+='<param name="'+c+'" value="'+r[c]+'" />');u.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+a+">"+l+"</object>",d[d.length]=t.id,o=U(t.id)}else{var h=z(n);h.setAttribute("type",s);for(var p in t)t[p]!=Object.prototype[p]&&(p.toLowerCase()=="styleclass"?h.setAttribute("class",t[p]):p.toLowerCase()!="classid"&&h.setAttribute(p,t[p]));for(var v in r)r[v]!=Object.prototype[v]&&v.toLowerCase()!="movie"&&I(h,v,r[v]);u.parentNode.replaceChild(h,u),o=h}}return o}function I(e,t,n){var r=z("param");r.setAttribute("name",t),r.setAttribute("value",n),e.appendChild(r)}function q(e){var t=U(e);t&&t.nodeName=="OBJECT"&&(N.ie&&N.win?(t.style.display="none",function(){t.readyState==4?R(e):setTimeout(arguments.callee,10)}()):t.parentNode.removeChild(t))}function R(e){var t=U(e);if(t){for(var n in t)typeof t[n]=="function"&&(t[n]=null);t.parentNode.removeChild(t)}}function U(e){var t=null;try{t=f.getElementById(e)}catch(n){}return t}function z(e){return f.createElement(e)}function W(e,t,n){e.attachEvent(t,n),v[v.length]=[e,t,n]}function X(e){var t=N.pv,n=e.split(".");return n[0]=parseInt(n[0],10),n[1]=parseInt(n[1],10)||0,n[2]=parseInt(n[2],10)||0,t[0]>n[0]||t[0]==n[0]&&t[1]>n[1]||t[0]==n[0]&&t[1]==n[1]&&t[2]>=n[2]}function V(t,r,i,s){if(N.ie&&N.mac)return;var o=f.getElementsByTagName("head")[0];if(!o)return;var u=i&&typeof i=="string"?i:"screen";s&&(S=null,x=null);if(!S||x!=u){var a=z("style");a.setAttribute("type","text/css"),a.setAttribute("media",u),S=o.appendChild(a),N.ie&&N.win&&typeof f.styleSheets!=e&&f.styleSheets.length>0&&(S=f.styleSheets[f.styleSheets.length-1]),x=u}N.ie&&N.win?S&&typeof S.addRule==n&&
S.addRule(t,r):S&&typeof f.createTextNode!=e&&S.appendChild(f.createTextNode(t+" {"+r+"}"))}function $(e,t){if(!T)return;var n=t?"visible":"hidden";w&&U(e)?U(e).style.visibility=n:V("#"+e,"visibility:"+n)}function J(t){var n=/[\\\"<>\.;]/,r=n.exec(t)!=null;return r&&typeof encodeURIComponent!=e?encodeURIComponent(t):t}var e="undefined",n="object",r="Shockwave Flash",i="ShockwaveFlash.ShockwaveFlash",s="application/x-shockwave-flash",o="SWFObjectExprInst",u="onreadystatechange",a=window,f=document,l=navigator,c=!1,h=[O],p=[],d=[],v=[],m,g,y,b,w=!1,E=!1,S,x,T=!0,N=function(){var t=typeof f.getElementById!=e&&typeof f.getElementsByTagName!=e&&typeof f.createElement!=e,o=l.userAgent.toLowerCase(),u=l.platform.toLowerCase(),h=u?/win/.test(u):/win/.test(o),p=u?/mac/.test(u):/mac/.test(o),d=/webkit/.test(o)?parseFloat(o.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):!1,v=!1,m=[0,0,0],g=null;if(typeof l.plugins!=e&&typeof l.plugins[r]==n)g=l.plugins[r].description,g&&(typeof l.mimeTypes==e||!l.mimeTypes[s]||!!l.mimeTypes[s].enabledPlugin)&&(c=!0,v=!1,g=g.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),m[0]=parseInt(g.replace(/^(.*)\..*$/,"$1"),10),m[1]=parseInt(g.replace(/^.*\.(.*)\s.*$/,"$1"),10),m[2]=/[a-zA-Z]/.test(g)?parseInt(g.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0);else if(typeof a.ActiveXObject!=e)try{var y=new ActiveXObject(i);y&&(g=y.GetVariable("$version"),g&&(v=!0,g=g.split(" ")[1].split(","),m=[parseInt(g[0],10),parseInt(g[1],10),parseInt(g[2],10)]))}catch(b){}return{w3:t,pv:m,wk:d,ie:v,win:h,mac:p}}(),C=function(){if(!N.w3)return;(typeof f.readyState!=e&&f.readyState=="complete"||typeof f.readyState==e&&(f.getElementsByTagName("body")[0]||f.body))&&k(),w||(typeof f.addEventListener!=e&&f.addEventListener("DOMContentLoaded",k,!1),N.ie&&N.win&&(f.attachEvent(u,function(){f.readyState=="complete"&&(f.detachEvent(u,arguments.callee),k())}),a==top&&function(){if(w)return;try{f.documentElement.doScroll("left")}catch(e){setTimeout(arguments.callee,0);return}k()}()),N.wk&&function(){if(w)return;if(!/loaded|complete/.test(f.readyState)){setTimeout(arguments.callee,0);return}k()}(),A(k))}(),K=function(){N.ie&&N.win&&window.attachEvent("onunload",function(){var e=v.length;for(var n=0;n<e;n++)v[n][0].detachEvent(v[n][1],v[n][2]);var r=d.length;for(var i=0;i<r;i++)q(d[i]);for(var s in N)N[s]=null;N=null;for(var o in t)t[o]=null;t=null})}();return{registerObject:function(e,t,n,r){if(N.w3&&e&&t){var i={};i.id=e,i.swfVersion=t,i.expressInstall=n,i.callbackFn=r,p[p.length]=i,$(e,!1)}else r&&r({success:!1,id:e})},getObjectById:function(e){if(N.w3)return D(e)},embedSWF:function(t,r,i,s,o,u,a,f,l,c){var h={success:!1,id:r};N.w3&&!(N.wk&&N.wk<312)&&t&&r&&i&&s&&o?($(r,!1),L(function(){i+="",s+="";var p={};if(l&&typeof l===n)for(var d in l)p[d]=l[d];p.data=t,p.width=i,p.height=s;var v={};if(f&&typeof f===n)for(var m in f)v[m]=f[m];if(a&&typeof a===n)for(var g in a)typeof v.flashvars!=e?v.flashvars+="&"+g+"="+a[g]:v.flashvars=g+"="+a[g];if(X(o)){var y=F(p,v,r);p.id==r&&$(r,!0),h.success=!0,h.ref=y}else{if(u&&P()){p.data=u,H(p,v,r,c);return}$(r,!0)}c&&c(h)})):c&&c(h)},switchOffAutoHideShow:function(){T=!1},ua:N,getFlashPlayerVersion:function(){return{major:N.pv[0],minor:N.pv[1],release:N.pv[2]}},hasFlashPlayerVersion:X,createSWF:function(e,t,n){return N.w3?F(e,t,n):undefined},showExpressInstall:function(e,t,n,r){N.w3&&P()&&H(e,t,n,r)},removeSWF:function(e){N.w3&&q(e)},createCSS:function(e,t,n,r){N.w3&&V(e,t,n,r)},addDomLoadEvent:L,addLoadEvent:A,getQueryParamValue:function(e){var t=f.location.search||f.location.hash;if(t){/\?/.test(t)&&(t=t.split("?")[1]);if(e==null)return J(t);var n=t.split("&");for(var r=0;r<n.length;r++)if(n[r].substring(0,n[r].indexOf("="))==e)return J(n[r].substring(n[r].indexOf("=")+1))}return""},expressInstallCallback:function(){if(E){var e=U(o);e&&m&&(e.parentNode.replaceChild(m,e),g&&($(g,!0),N.ie&&N.win&&(m.style.display="block")),y&&y(b)),E=!1}}}}();e.swfobject=t,e.swfobject.registerCallback=function(t,n){e.SWF._instances[t]=n},e.SWF={_instances:[],eventHandler:function(t,n){var r=e.SWF._instances[t];r&&typeof r=="function"&&r(n)}}},"0.0.1",{requires:[]})},"0.0.1",{use:["swfobject","node-event-simulate"],requires:["node","widget","videoplayer","videomodal","json","json-stringify","io","array-extras","share"],skinnable:!0});
