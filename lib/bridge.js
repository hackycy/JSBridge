'use strict';

var isWebView = window && window.hasOwnProperty('document');

if (!isWebView) {
  throw new Error('unsupport');
}

var isIosWebView = false;

var invokeCallbacks = {};
var handleRegisterCallbacks = {};
var invokeCallbackId = 0;

var userAgent = window.navigator.userAgent;
var isAndroidWebView = userAgent.indexOf('Android') !== -1;
isIosWebView = !isAndroidWebView;

function hasBridge() {
  if (isIosWebView) {
    return window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.invokeHandler ? true : false;
  }
  return window.invokeHandler ? true : false;
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
    throw new Error('bridge is not mount!');
  }
  if (!func || typeof func !== 'string') {
    return;
  }
  if (typeof params !== 'object') {
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
    throw new Error('bridge is not mount!');
  }
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
};
