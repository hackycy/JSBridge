var isWebView = window && window.hasOwnProperty('document');

if (!isWebView) return;

var isIosWebView = false;

var invokeCallbacks = {};
var handleRegisterCallbacks = {};
var invokeCallbackId = 0;

var userAgent = window.navigator.userAgent;
var isAndroidWebView = userAgent.indexOf('Android') != -1;
isIosWebView = !isAndroidWebView;

var hasBridge = function() {
  if (isIosWebView) {
    return window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.invokeHandler ? true : false;
  } else {
    return window.invokeHandler ? true : false;
  }
}

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
  if (!hasBridge()) {
    throw new Error('bridge is not mount!');
  }
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