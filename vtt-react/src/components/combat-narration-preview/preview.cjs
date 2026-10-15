// Standalone, loopback-only preview. Uses installed project Webpack/Babel/React.
// No app entry point, game services, sockets, cloud SDK or production imports.
const fs = require('fs');
const path = require('path');
const http = require('http');
const webpack = require('webpack');

const parent = process.env.TEMP && process.env.TEMP.includes('opencode')
  ? process.env.TEMP : 'D:/AppData/Temp/opencode';
if (!fs.existsSync(parent)) throw new Error(`Preview output parent does not exist: ${parent}`);
const output = fs.mkdtempSync(path.join(parent, 'combat-narration-'));
const port = Number(process.env.NARRATION_PORT || 4318);
const compiler = webpack({
  mode: 'development',
  context: __dirname,
  entry: './Preview.jsx',
  devtool: false,
  cache: false,
  output: { path: output, filename: 'preview.js' },
  resolve: { extensions: ['.js', '.jsx'] },
  module: { rules: [
    { test: /\.jsx?$/, exclude: /node_modules/, use: {
      loader: require.resolve('babel-loader'), options: {
        babelrc: false, configFile: false,
        presets: [[require.resolve('@babel/preset-react'), { runtime: 'automatic' }]]
      }
    } },
    { test: /\.css$/, use: [require.resolve('style-loader'), require.resolve('css-loader')] }
  ] },
  optimization: { minimize: false },
  performance: { hints: false }
});

const html = '<!doctype html><html lang="en"><head><meta charset="utf-8">'
  + '<meta name="viewport" content="width=device-width,initial-scale=1">'
  + '<link rel="icon" href="data:,"><title>Mythrill · Combat narration preview</title>'
  + '<style>body{margin:0}</style></head><body><div id="root"></div><script src="/preview.js"></script></body></html>';

compiler.run((error, stats) => {
  compiler.close(() => {});
  if (error || stats.hasErrors()) {
    console.error(error || stats.toString({ all: false, errors: true }));
    process.exitCode = 1;
    return;
  }
  const bundle = fs.readFileSync(path.join(output, 'preview.js'));
  const server = http.createServer((req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.url === '/preview.js') { res.setHeader('Content-Type', 'text/javascript; charset=utf-8'); res.end(bundle); }
    else if (req.url === '/') { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html); }
    else { res.writeHead(404); res.end('Not found'); }
  });
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Narration preview: http://127.0.0.1:${port}\nCompiled only the isolated preview. Output: ${output}`));
  const stop = () => server.close(() => process.exit());
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
});
