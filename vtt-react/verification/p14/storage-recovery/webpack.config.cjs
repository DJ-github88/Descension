// Bundles the real persistence modules for the real-Chromium quota witness (run.cjs).
const path = require('path');
module.exports = {
  mode: 'development', devtool: false, target: 'web',
  context: __dirname, entry: path.resolve(__dirname, 'entry.js'),
  output: { path: path.resolve(process.env.WITNESS_OUT || path.join(__dirname, '.out')), filename: 'bundle.js' },
  resolve: { extensions: ['.js', '.jsx', '.json'] },
  module: { rules: [{ test: /\.jsx?$/, exclude: /node_modules/, use: { loader: 'babel-loader', options: { presets: [['@babel/preset-env', { targets: 'chrome 110' }], ['@babel/preset-react', { runtime: 'automatic' }]] } } }] },
  performance: { hints: false }, stats: 'errors-only'
};
