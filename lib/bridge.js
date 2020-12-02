'use strict';

var isWebView = window && window.hasOwnProperty('document');

var isIosWebView = false;
var userAgent = window.navigator.userAgent;
var isAndroidWebView = userAgent.indexOf('Android') !== -1;
isIosWebView = !isAndroidWebView;

// obj
var invokeCallbacks = {};
var handleRegisterCallbacks = {};
var invokeCallbackId = 0;

function hasBridge() {
  try {
    if (!isWebView) {
      return false;
    }
    if (isIosWebView) {
      return window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.invokeHandler ? true : false;
    }
    return window.invokeHandler ? true : false;
  } catch (e) {
    return false;
  }
}

function invokeHandler(func, paramsString, callbackId) {
  if (isIosWebView) {
    // iOS
    window.webkit.messageHandlers.invokeHandler.postMessage({
      invoke: func,
      paramsString: paramsString,
      callbackId: callbackId
    });
  } else {
    // Android
    window.invokeHandler.invoke(func, paramsString, callbackId);
  }
}

// invoke callback exec from native
function handleInvokeCallbackFromNative(callbackId, execResult) {
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
function handleMessageFromNative(func, paramString) {
  var param;
  try {
    param = JSON.parse(paramString);
  } catch (e) {
    param = paramString;
  }
  return handleRegisterCallbacks[func](param);
}

// call native func
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

// register func, wait native call
function register(func, executor) {
  if (!hasBridge()) {
    return;
  }
  if (!func || typeof func !== 'string' || typeof executor !== 'function') {
    return;
  }
  handleRegisterCallbacks[func] = executor;
}

// mount attr
window._handleMessageFromNative = handleMessageFromNative;
window._handleInvokeCallbackFromNative = handleInvokeCallbackFromNative;

if (hasBridge()) {
  var readyEvent = new Event('JSBridgeReady');
  window.document.dispatchEvent(readyEvent);
}

module.exports = {
  invoke: invoke,
  register: register
};
