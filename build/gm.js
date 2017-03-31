"use strict";function newError(e,r){var t=new Error(r);return t.name=e,t}function init(e){return __awaiter(this,void 0,void 0,function(){return __generator(this,function(r){switch(r.label){case 0:return web.init(e),[4,web.get("/")];case 1:return r.sent(),[2]}})})}function login(e){return __awaiter(this,void 0,void 0,function(){var r,t,n;return __generator(this,function(o){switch(o.label){case 0:if(r={user:e.username,password:e.password,remember:"on",captchaId:"",captchaAnswer:"",formName:"AccountLoginForm",userAction:"validateUserCredentials"},!(t=web.getCookie("JSESSIONID")))throw newError("MissingCookie","Session cookie does not exist");return[4,web.postFormJsonP("/web/portal/home;jsessionid="+t,r,{qs:query.validateLogin})];case 1:if(n=o.sent(),"invalid"===n.result)throw newError("InvalidCredentials","Invalid credentials");if("showCaptcha"===n.result)throw newError("Captcha","Captcha presented...you must log into the website in a browser on this device first");return delete r.formName,r.userAction="login",[4,web.postForm("/web/portal/home;jsessionid="+t,r,{qs:query.login})];case 2:return o.sent(),[2]}})})}function getChargeStatus(){return __awaiter(this,void 0,void 0,function(){var e,r,t,n,o,a,i;return __generator(this,function(s){switch(s.label){case 0:if(!(e=web.getCookie("JSESSIONID")))throw newError("MissingCookie","Session cookie does not exist");return r={initiate:"true"},[4,web.postForm("/web/portal/home",r,{qs:query.polling})];case 1:if(t=s.sent(),!(n=cheerio.load(t)))throw newError("StatusError","Charging status could not be retrieved");if(o=n("status").attr("error"))throw newError("OnStarError","OnStar returned error: "+o);a=!0,i=null,s.label=2;case 2:return a?[4,pollChargeStatus(e,null===i)]:[3,7];case 3:return i=s.sent(),i!==!1?[3,5]:[4,delay(1e3)];case 4:return s.sent(),[3,6];case 5:a=!1,s.label=6;case 6:return[3,2];case 7:return[2,i]}})})}function pollChargeStatus(e,r){return __awaiter(this,void 0,void 0,function(){var t,n,o,a,i;return __generator(this,function(s){switch(s.label){case 0:return t=r?{initiate:"true",chargingSessionId:e}:{checkstatus:"chargingdata",chargingSessionId:e},[4,web.postForm("/web/portal/home",t,{qs:query.charging})];case 1:if(n=s.sent(),o=cheerio.load(n),!(a=o("status")))throw newError("StatusError","Unable to poll charging status");if(2===(i=parseInt(a.attr("value")))||0===i&&"true"===a.attr("connect"))return[2,!1];if(0===i)return[2,{pluggedIn:"plugged"===o("pluggedIn").attr("value"),evRange:parseInt(o("estEVRange").attr("value")),totalRange:parseInt(o("estTotRange").attr("value")),chargePercent:parseInt(o("currCharge").attr("value")),estDoneBy:o("estFullCharge").attr("value")}];throw newError("StatusError","Unexpected status code: "+i)}})})}var __awaiter=this&&this.__awaiter||function(e,r,t,n){return new(t||(t=Promise))(function(o,a){function i(e){try{u(n.next(e))}catch(e){a(e)}}function s(e){try{u(n.throw(e))}catch(e){a(e)}}function u(e){e.done?o(e.value):new t(function(r){r(e.value)}).then(i,s)}u((n=n.apply(e,r||[])).next())})},__generator=this&&this.__generator||function(e,r){function t(e){return function(r){return n([e,r])}}function n(t){if(o)throw new TypeError("Generator is already executing.");for(;u;)try{if(o=1,a&&(i=a[2&t[0]?"return":t[0]?"throw":"next"])&&!(i=i.call(a,t[1])).done)return i;switch(a=0,i&&(t=[0,i.value]),t[0]){case 0:case 1:i=t;break;case 4:return u.label++,{value:t[1],done:!1};case 5:u.label++,a=t[1],t=[0];continue;case 7:t=u.ops.pop(),u.trys.pop();continue;default:if(i=u.trys,!(i=i.length>0&&i[i.length-1])&&(6===t[0]||2===t[0])){u=0;continue}if(3===t[0]&&(!i||t[1]>i[0]&&t[1]<i[3])){u.label=t[1];break}if(6===t[0]&&u.label<i[1]){u.label=i[1],i=t;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(t);break}i[2]&&u.ops.pop(),u.trys.pop();continue}t=r.call(e,u)}catch(e){t=[6,e],a=0}finally{o=i=0}if(5&t[0])throw t[1];return{value:t[0]?t[1]:void 0,done:!0}}var o,a,i,s,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return s={next:t(0),throw:t(1),return:t(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s};exports.__esModule=!0;var cheerio=require("cheerio"),delay=require("promise-delay"),query=require("./myvolt/query"),web=require("./web");exports.init=init,exports.login=login,exports.getChargeStatus=getChargeStatus;