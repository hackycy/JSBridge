const webpack = require("webpack");
const path = require("path");

const config = [];

function generateConfig(name) {
  var uglify = name.indexOf("min") > -1;
  var config = {
    entry: "./index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: name + ".js",
      sourceMapFilename: name + ".map",
      library: "jsbridge",
      libraryTarget: "umd",
    },
    optimization: {
      minimize: uglify,
    },
    devtool: "source-map",
  };

  return config;
}

["jsbridge", "jsbridge.min"].forEach(function (key) {
  config.push(generateConfig(key));
});