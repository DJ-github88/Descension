const webpack = require('webpack');
webpack(require('./webpack.config.cjs'), (err, stats) => {
  if (err) { console.error(err); process.exit(1); }
  console.log(stats.toString({ all: false, errors: true, assets: true }));
  process.exit(stats.hasErrors() ? 2 : 0);
});
