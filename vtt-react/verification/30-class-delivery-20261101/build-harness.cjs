const webpack = require('webpack');
const path = require('path');
const config = require('./webpack.config.cjs');

webpack(config, (err, stats) => {
  if (err) {
    console.error('Fatal Webpack Error:', err);
    process.exit(1);
  }
  const info = stats.toJson();
  if (stats.hasErrors()) {
    console.error('Webpack Compilation Errors:', info.errors);
    process.exit(2);
  }
  console.log('Webpack compiled bundle successfully in ' + (stats.endTime - stats.startTime) + 'ms');
  console.log(stats.toString({ all: false, errors: true, assets: true }));
  process.exit(0);
});
