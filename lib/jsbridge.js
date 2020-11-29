var isWebView = window.hasOwnProperty('document');

if (!isWebView) return;

var isIosWebView = false;

var invokeCallbacks = {};
var invokeCallbackId = 0;

var userAgent = window.navigator.userAgent;
var isAndroidWebView = userAgent.indexOf('Android') != -1;
isIosWebView = !isAndroidWebView;

var _invokeHandler = function (command, paramsString, callbackId) {
  if (!command || typeof command !== 'string') {
    return;
  }
  if (isIosWebView) {
    // iOS
    window.webkit.messageHandlers.invokeHandler.postMessage({
      invoke: command,
      paramsString: paramsString,
      callbackId: callbackId,
    });
  } else {
    // Android
    var execResult = window.invokeHandler.invoke(command, paramsString, callbackId);
    if (typeof execResult !== 'undefined' && typeof invokeCallbacks[callbackId] === 'function' && execResult !== '') {
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

var invoke = function (command, params, callback) {
  var paramsString = JSON.stringify(params || {});
  var callbackId = ++invokeCallbackId
  invokeCallbacks[callbackId] = callback;
  _invokeHandler(command, paramsString, callbackId);
}

var invokeCallbackHandler = function (callbackId, execResult) {
  if (typeof execResult !== 'undefined' && typeof invokeCallbacks[callbackId] === 'function' && execResult !== '') {
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
  invokeCallback: invokeCallbackHandler
}