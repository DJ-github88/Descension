const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add process polyfill
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "process": require.resolve("process/browser"),
    "buffer": require.resolve("buffer"),
    "stream": require.resolve("stream-browserify"),
    "util": require.resolve("util"),
    "crypto": require.resolve("crypto-browserify"),
    "vm": require.resolve("vm-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "path": require.resolve("path-browserify"),
    "fs": false,
    "net": false,
    "tls": false
  };

  // Add plugins to provide process and Buffer globally
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  return config;
};
