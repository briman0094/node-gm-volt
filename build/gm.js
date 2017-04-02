"use strict";function newError(e,t,r){var n=new Error(t);return n.name=e,Object.assign(n,r),n}function init(e){return __awaiter(this,void 0,void 0,function(){return __generator(this,function(t){switch(t.label){case 0:return web.init(e),[4,web.get("/")];case 1:return t.sent(),[2]}})})}function login(e){return __awaiter(this,void 0,void 0,function(){var t,r,n;return __generator(this,function(a){switch(a.label){case 0:if(t={user:e.username,password:e.password,remember:"on",captchaId:e.captchaId||"",captchaAnswer:e.captchaAnswer||"",formName:"AccountLoginForm",userAction:"validateUserCredentials"},!(r=web.getCookie("JSESSIONID")))throw newError("MissingCookie","Session cookie does not exist");return[4,web.postFormJsonP("/web/portal/home;jsessionid="+r,t,{qs:query.validateLogin})];case 1:if(n=a.sent(),"invalid"===n.result)throw newError("InvalidCredentials","Invalid credentials");if("showCaptcha"===n.result)throw newError("Captcha","Captcha presented...you must log into the website in a browser on this device first",__assign({},n));return delete t.formName,t.userAction="login",[4,web.postForm("/web/portal/home;jsessionid="+r,t,{qs:query.login})];case 2:return a.sent(),[2]}})})}function getChargeStatus(){return __awaiter(this,void 0,void 0,function(){var e,t,r,n,a,o,i;return __generator(this,function(s){switch(s.label){case 0:if(!(e=web.getCookie("JSESSIONID")))throw newError("MissingCookie","Session cookie does not exist");return t={initiate:"true"},[4,web.postForm("/web/portal/home",t,{qs:query.polling})];case 1:if(r=s.sent(),!(n=cheerio.load(r)))throw newError("StatusError","Charging status could not be retrieved");if(a=n("status").attr("error"))throw newError("OnStarError","OnStar returned error: "+a);o=!0,i=null,s.label=2;case 2:return o?[4,pollChargeStatus(e,null===i)]:[3,7];case 3:return i=s.sent(),i!==!1?[3,5]:[4,delay(1e3)];case 4:return s.sent(),[3,6];case 5:o=!1,s.label=6;case 6:return[3,2];case 7:return[2,i]}})})}function pollChargeStatus(e,t){return __awaiter(this,void 0,void 0,function(){var r,n,a,o,i;return __generator(this,function(s){switch(s.label){case 0:return r=t?{initiate:"true",chargingSessionId:e}:{checkstatus:"chargingdata",chargingSessionId:e},[4,web.postForm("/web/portal/home",r,{qs:query.charging})];case 1:if(n=s.sent(),console.log(n),a=cheerio.load(n),!(o=a("status")))throw newError("StatusError","Unable to poll charging status");if(2===(i=parseInt(o.attr("value")))||0===i&&"true"===o.attr("connect"))return[2,!1];if(0===i)return[2,{pluggedIn:"plugged"===a("pluggedIn").attr("value"),evRange:parseInt(a("estEVRange").attr("value")),evUnit:a("estEVRange").attr("unit"),totalRange:parseInt(a("estTotRange").attr("value")),totalUnit:a("estTotRange").attr("unit"),chargePercent:parseInt(a("currCharge").attr("value")),estDoneBy:a("estFullCharge").attr("value")}];throw 3===i?newError("RateLimit","Your account is being rate-limited. Try again in a while."):newError("StatusError","Unexpected status code: "+i)}})})}var __assign=this&&this.__assign||Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++){t=arguments[r];for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a])}return e},__awaiter=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))(function(a,o){function i(e){try{u(n.next(e))}catch(e){o(e)}}function s(e){try{u(n.throw(e))}catch(e){o(e)}}function u(e){e.done?a(e.value):new r(function(t){t(e.value)}).then(i,s)}u((n=n.apply(e,t||[])).next())})},__generator=this&&this.__generator||function(e,t){function r(e){return function(t){return n([e,t])}}function n(r){if(a)throw new TypeError("Generator is already executing.");for(;u;)try{if(a=1,o&&(i=o[2&r[0]?"return":r[0]?"throw":"next"])&&!(i=i.call(o,r[1])).done)return i;switch(o=0,i&&(r=[0,i.value]),r[0]){case 0:case 1:i=r;break;case 4:return u.label++,{value:r[1],done:!1};case 5:u.label++,o=r[1],r=[0];continue;case 7:r=u.ops.pop(),u.trys.pop();continue;default:if(i=u.trys,!(i=i.length>0&&i[i.length-1])&&(6===r[0]||2===r[0])){u=0;continue}if(3===r[0]&&(!i||r[1]>i[0]&&r[1]<i[3])){u.label=r[1];break}if(6===r[0]&&u.label<i[1]){u.label=i[1],i=r;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(r);break}i[2]&&u.ops.pop(),u.trys.pop();continue}r=t.call(e,u)}catch(e){r=[6,e],o=0}finally{a=i=0}if(5&r[0])throw r[1];return{value:r[0]?r[1]:void 0,done:!0}}var a,o,i,s,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return s={next:r(0),throw:r(1),return:r(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s};exports.__esModule=!0;var cheerio=require("cheerio"),delay=require("promise-delay"),query=require("./myvolt/query"),web=require("./web");exports.init=init,exports.login=login,exports.getChargeStatus=getChargeStatus;