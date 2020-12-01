(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["JSBridge"] = factory();
	else
		root["JSBridge"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 10:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(469);


/***/ }),

/***/ 469:
/***/ ((module) => {

var isWebView = window && window.hasOwnProperty('document');

if (!isWebView) return;

var isIosWebView = false;

var invokeCallbacks = {};
var handleRegisterCallbacks = {};
var invokeCallbackId = 0;

var userAgent = window.navigator.userAgent;
var isAndroidWebView = userAgent.indexOf('Android') != -1;
isIosWebView = !isAndroidWebView;

var invokeHandler = function (func, paramsString, callbackId) {
  if (isIosWebView) {
    // iOS
    window.webkit.messageHandlers.invokeHandler.postMessage({
      invoke: func,
      paramsString: paramsString,
      callbackId: callbackId,
    });
  } else {
    // Android
    var execResult = window.invokeHandler.invoke(func, paramsString, callbackId);
    if (typeof invokeCallbacks[callbackId] === 'function') {
      try {
        execResult = JSON.parse(execResult);
      } catch (e) {
        execResult = {};
      }
      invokeCallbacks[callbackId](execResult);
      delete invokeCallbacks[callbackId];
    }
  }
}

var invoke = function (func, params, callback) {
  if (!func || typeof func !== 'string') {
    return;
  }
  if (typeof params !== 'object') {
    params = {};
  };
  var paramsString = JSON.stringify(params);
  var callbackId = ++invokeCallbackId
  invokeCallbacks[callbackId] = callback;
  invokeHandler(func, paramsString, callbackId);
}

// invoke callback exec
var handleInvokeCallbackFromNative = function (callbackId, execResult) {
  if (typeof invokeCallbacks[callbackId] === 'function') {
    try {
      execResult = JSON.parse(execResult);
    } catch (e) {
      execResult = {};
    }
    invokeCallbacks[callbackId](execResult);
    delete invokeCallbacks[callbackId];
  }
}

// native call h5
var handleMessageFromNative = function (func, paramString) {
  try {
    paramString = JSON.parse(paramString);
  } catch (e) {
    paramString = {};
  }
  return handleRegisterCallbacks[func](paramString)
}

// register func
var register = function (func, executor) {
  if (!func || typeof func !== 'string' || typeof executor !== 'function') {
    return;
  }
  handleRegisterCallbacks[func] = executor;
}

// mount attr
window._handleMessageFromNative = handleMessageFromNative;
window._handleInvokeCallbackFromNative = handleInvokeCallbackFromNative;

var readyEvent = new Event('JSBridgeReady');
window.document.dispatchEvent(readyEvent);

module.exports = {
  invoke: invoke,
  register: register
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(10);
/******/ })()
;
});
//# sourceMappingURL=jsbridge.map