(function(window) {
   
  if (window.JSBridge) return;

  var isWebView = window.hasOwnProperty('document');
  var isIosWebView = false;

  var invokeCallbacks = {};
  var invokeCallbackId = 0;

  if (isWebView) {
    var userAgent = global.navigator.userAgent;
    var isAndroidWebView = userAgent.indexOf('Android') != -1;
    isIosWebView = !isAndroidWebView;
  }

  var _invodeHandler = function(namespace, method, paramsString, callbackId) {
    if (isIosWebView) {
      
    }
  }

})(this);