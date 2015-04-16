'use strict';

/**
 * @ngdoc service
 * @name derCleanApp.ngTranslate
 * @description
 * # ngTranslate
 * Service in the derCleanApp.
 */
angular.module("ngTranslate",["ng","ngCookies"])
.run(["$translate","$COOKIE_KEY","$cookieStore",function(n,t,r){
	n.rememberLanguage()&&(r.get(t)?n.uses(r.get(t)):r.put(t,n.uses()))}]),angular.module("ngTranslate").directive("translate",["$filter","$interpolate",function(n,t){var r=n("translate");return{restrict:"A",scope:!0,link:function(n,a,e){e.$observe("translate",function(r){n.translationId=angular.equals(r,"")?t(a.text())(n.$parent):r}),e.$observe("values",function(t){n.interpolateParams=t}),n.$watch("translationId + interpolateParams",function(){a.html(r(n.translationId,n.interpolateParams))})}}}]),angular.module("ngTranslate").filter("translate",["$parse","$translate",function(n,t){return function(r,a){return angular.isObject(a)||(a=n(a)()),t(r,a)}}]),angular.module("ngTranslate").constant("$COOKIE_KEY","NG_TRANSLATE_LANG_KEY"),angular.module("ngTranslate").provider("$translate",function(){var n,t={},r=!1;this.translations=function(n,r){if(!n&&!r)return t;if(n&&!r){if(angular.isString(n))return t[n];t=n}else t[n]=r},this.uses=function(r){if(!r)return n;if(!t[r])throw Error("$translateProvider couldn't find translationTable for langKey: '"+r+"'");n=r},this.rememberLanguage=function(n){return angular.isUndefined(n)?r:(r=n,void 0)},this.$get=["$interpolate","$log","$cookieStore","$COOKIE_KEY",function(a,e,i,o){return $translate=function(r,i){var o=n?t[n][r]:t[r];return o?a(o)(i):(e.warn("Translation for "+r+" doesn't exist"),r)},
	$translate.uses=function(t){return t?(n=t,r&&i.put(o,n),void 0):n},
	$translate.rememberLanguage=function(){return r},
	$translate
}
]
});
