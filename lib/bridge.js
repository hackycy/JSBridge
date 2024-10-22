'use strict';

var isWebView = window && window.hasOwnProperty('document');

var isIosWebView = false;
var userAgent = window.navigator.userAgent;
var isAndroidWebView = userAgent.indexOf('Android') !== -1 || u.indexOf('Adr') > -1;
isIosWebView = !isAndroidWebView;

// obj
var invokeCallbacks = {};
var handleRegisterCallbacks = {};
var invokeCallbackId = 0;

// sync invoke use url scheme
var urlScheme = 'jsbridge://';

/**
 * 用于判断环境是否可用jsbridge
 */
function hasBridge() {
  try {
    if (!isWebView) {
      return false;
    }
    if (isIosWebView) {
      return window.webkit &&
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers._invokeHandler
        ? true
        : false;
    }
    return window._invokeHandler ? true : false;
  } catch (e) {
    return false;
  }
}

/**
 * 检查param格式是否正确
 * @param {*} paramString param
 */
function checkParam(param) {
  if (typeof param === 'object') {
    // Array.isArray(param) don' t need
    return param;
  }
  return {};
}

/**
 * 检查func参数是否正确
 * @param {*} paramString param
 */
function checkFuncName(func) {
  return func && typeof func === 'string';
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
  if (!checkFuncName(func)) {
    return;
  }
  var paramsString = JSON.stringify(checkParam(params));
  var callbackId = ++invokeCallbackId;
  invokeCallbacks[callbackId] = callback;
  invokeHandler(func, paramsString, callbackId);
}

/**
 * real sync invoke
 * @param {String} func unique name
 * @param {String} paramsString 参数
 * @return {String}
 */
function invokeSyncHandler(func, paramsString) {
  var syncResult = window.prompt(urlScheme + func, paramsString);
  try {
    return JSON.parse(syncResult);
  } catch (e) {
    return syncResult;
  }
}

/**
 * JS主动调用原生方法，同步返回
 * @param {String} func unique name
 * @param {Object} params object
 */
function invokeSync(func, params) {
  if (!hasBridge()) {
    return undefined;
  }
  if (!checkFuncName(func)) {
    return undefined;
  }
  var paramsString = JSON.stringify(checkParam(params));
  return invokeSyncHandler(func, paramsString);
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

/**
 * create instance
 */
function create() {
  if (!hasBridge()) {
    throw new Error('bridge init error, please check native');
  }

  // 挂载给Native端进行执行
  window._handleMessageFromNative = handleMessageFromNative;
  window._handleInvokeCallbackFromNative = handleInvokeCallbackFromNative;

  // already pub event
  var readyEvent = new Event('JSBridgeReady');
  window.document.dispatchEvent(readyEvent);

  return {
    invoke: invoke,
    invokeSync: invokeSync,
    register: register
  };
}

// create instance
var bridge = create();

module.exports = bridge;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;
