window.JSBridge =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 10:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



module.exports = __webpack_require__(444);


/***/ }),

/***/ 444:
/***/ ((module) => {



var isWebView = window && window.hasOwnProperty('document');

var isIosWebView = false;
var userAgent = window.navigator.userAgent;
var isAndroidWebView = userAgent.indexOf('Android') !== -1;
isIosWebView = !isAndroidWebView;

// obj
var invokeCallbacks = {};
var handleRegisterCallbacks = {};
var invokeCallbackId = 0;

/**
 * 用于判断环境是否可用jsbridge
 */
function hasBridge() {
  try {
    if (!isWebView) {
      return false;
    }
    if (isIosWebView) {
      return window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers._invokeHandler ? true : false;
    }
    return window._invokeHandler ? true : false;
  } catch (e) {
    return false;
  }
}

/**
 * JS主动调用原生方法后的回调处理
 * @param {Number} callbackId 自增的callbackId
 * @param {Object} execResult 执行结果
 */
function handleInvokeCallbackFromNative(callbackId, execResult) {
  if (typeof invokeCallbacks[callbackId] === 'function') {
    try {
      execResult = JSON.parse(execResult);
    } catch (e) {
      execResult = {};
    }
    invokeCallbacks[callbackId](execResult);
  }
  // 无论如何都需要进行删除定义的回调
  delete invokeCallbacks[callbackId];
}


/**
 * 原生主动调用JS方法
 * @param {String} func unique name
 * @param {String} paramString 参数
 */
function handleMessageFromNative(func, paramString) {
  var param;
  try {
    param = JSON.parse(paramString);
  } catch (e) {
    param = paramString;
  }
  return handleRegisterCallbacks[func](param);
}

/**
 * real invoke
 * @param {String} func unique name
 * @param {String} paramsString 参数
 * @param {Number} callbackId 自增的callbackId
 */
function invokeHandler(func, paramsString, callbackId) {
  if (isIosWebView) {
    // iOS
    window.webkit.messageHandlers._invokeHandler.postMessage({
      invoke: func,
      paramsString: paramsString,
      callbackId: callbackId
    });
  } else {
    // Android
    window._invokeHandler.invoke(func, paramsString, callbackId);
  }
}

/**
 * JS主动调用原生方法
 * @param {String} func unique name
 * @param {Object} params object
 * @param {Function} callback 回调函数
 */
function invoke(func, params, callback) {
  if (!hasBridge()) {
    return;
  }
  if (!func || typeof func !== 'string') {
    return;
  }
  if (!params || typeof params !== 'object') {
    params = {};
  }
  var paramsString = JSON.stringify(params);
  var callbackId = ++invokeCallbackId;
  invokeCallbacks[callbackId] = callback;
  invokeHandler(func, paramsString, callbackId);
}

/**
 * real sync invoke
 * @param {String} func unique name
 * @param {String} paramsString 参数
 * @param {Number} callbackId 自增的callbackId
 */
function invokeSyncHandler(func, paramsString, callbackId) {
  if (isIosWebView) {
    // TODO
  } else {
    var syncResult = window._invokeHandler.invokeSync(func, paramsString, callbackId);
    try {
      return JSON.parse(syncResult)
    } catch(e) {
      return syncResult;
    }
  }
}

/**
 * JS主动调用原生方法，同步返回
 * @param {String} func unique name
 * @param {Object} params object
 * @param {Function} callback 回调函数
 */
function invokeSync(func, params, callback) {
  if (!hasBridge()) {
    return;
  }
  if (!func || typeof func !== 'string') {
    return;
  }
  if (!params || typeof params !== 'object') {
    params = {};
  }
  var paramsString = JSON.stringify(params);
  var callbackId = ++invokeCallbackId;
  invokeCallbacks[callbackId] = callback;
  invokeSyncHandler(func, paramsString, callbackId);
}

/**
 * 注册函数，等待原生主动调用
 * @param {String} func unique name
 * @param {Function} executor 执行函数
 */
function register(func, executor) {
  if (!hasBridge()) {
    return;
  }
  if (!func || typeof func !== 'string' || typeof executor !== 'function') {
    return;
  }
  handleRegisterCallbacks[func] = executor;
}

// 挂载给Native端进行执行
window._handleMessageFromNative = handleMessageFromNative;
window._handleInvokeCallbackFromNative = handleInvokeCallbackFromNative;

if (hasBridge()) {
  var readyEvent = new Event('JSBridgeReady');
  window.document.dispatchEvent(readyEvent);
}

module.exports = {
  invoke,
  invokeSync,
  register: register
};


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
//# sourceMappingURL=jsbridge.map