### JSBridge

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/@hackycy/jsbridge.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@hackycy/jsbridge
[download-image]: https://img.shields.io/npm/dm/@hackycy/jsbridge.svg?style=flat-square
[download-url]: https://npmjs.org/package/@hackycy/jsbridge

**JSBridge For Android / iOS，统一易用的Javascript bridge。**

### 安装

**npm**

``` javascript
$ npm i --save @hackycy/jsbridge
```

**cdn**

``` html
<!-- production -->
<script src="https://unpkg.com/@hackycy/jsbridge@${version}/dist/jsbridge.min.js"></script>

<!-- developer -->
<script src="https://unpkg.com/@hackycy/jsbridge@${version}/dist/jsbridge.js"></script>
```

> 将`${version}`改为最新版本号或自行指定

### 使用

在Javascript中调用原生Api

``` javascript
/**
*	第一个参数为函数名称，第二个参数为需要传递的参数，必须为Object对象类型，第三个参数为回调
*/
window.JSBridge.invoke('log', null, callback);

// 会将原生端返回的参数在该回调中参数传入
function callback(obj) {
  alert(obj);
}
```

### License

[MIT](LICENSE)