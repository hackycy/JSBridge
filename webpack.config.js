'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    jsbridge: './index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].min.js',
    library: 'JSBridge',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: false,
  stats: {
    colors: true
  }
};
