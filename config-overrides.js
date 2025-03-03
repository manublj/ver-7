// config-overrides.js
const webpack = require('webpack');

module.exports = function override(config) {
  const fallback = {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify"),
    "url": require.resolve("url"),
    "path": require.resolve("path-browserify"),
    "process": require.resolve("process/browser.js")
  };

  config.resolve.fallback = {
    ...config.resolve.fallback,
    ...fallback
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: ["process/browser.js", "process"],
      Buffer: ["buffer", "Buffer"]
    })
  ]);

  return config;
};