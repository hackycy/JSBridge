var isWebView = window && window.hasOwnProperty('document');

if (!isWebView) return;

var isIosWebView = false;

var invokeCallbacks = {};
var invokeCallbackId = 0;

var userAgent = window.navigator.userAgent;
var isAndroidWebView = userAgent.indexOf('Android') != -1;
isIosWebView = !isAndroidWebView;

var _invokeHandler = function (func, paramsString, callbackId) {
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
  _invokeHandler(func, paramsString, callbackId);
}

var invokeCallbackHandler = function (callbackId, execResult) {
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

var readyEvent = new Event('JSBridgeReady');
window.document.dispatchEvent(readyEvent);

module.exports = {
  invoke: invoke,
  _invokeCallback: invokeCallbackHandler
}