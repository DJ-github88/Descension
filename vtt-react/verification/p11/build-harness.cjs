// Builds the P11 browser witness bundle OUTSIDE Git (default: D:/AppData/Temp/opencode/p11-*).
// Usage: node verification/p11/build-harness.cjs [outputDir]
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const root = path.resolve(__dirname, '../..');
const output = path.resolve(process.argv[2] || process.env.P11_OUT || 'D:/AppData/Temp/opencode/p11-browser');
fs.mkdirSync(output, { recursive: true });

const compiler = webpack({
    mode: 'development',
    context: root,
    entry: path.join(__dirname, 'harness.jsx'),
    devtool: false,
    cache: false,
    target: 'web',
    output: { path: output, filename: 'harness.js' },
    resolve: { extensions: ['.js', '.jsx', '.mjs'], fallback: { fs: false, path: false, crypto: false } },
    module: { rules: [
        { test: /\.m?js$/, resolve: { fullySpecified: false } },
        { test: /\.(js|jsx|mjs)$/, exclude: /node_modules/, use: { loader: require.resolve('babel-loader'), options: {
            babelrc: false, configFile: false, cacheDirectory: false,
            presets: [[require.resolve('babel-preset-react-app'), { runtime: 'automatic' }]]
        } } },
        { test: /\.css$/, use: [require.resolve('style-loader'), { loader: require.resolve('css-loader'), options: { url: false, import: true } }] },
        { test: /\.(png|jpe?g|gif|svg|webp|mp3|wav|ogg|glb|gltf|woff2?)$/i, type: 'asset/resource' }
    ] },
    plugins: [
        new webpack.DefinePlugin({ 'process.env': JSON.stringify({ NODE_ENV: 'development', PUBLIC_URL: '' }), 'process.browser': 'true' }),
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
    ],
    optimization: { minimize: false, splitChunks: false },
    performance: { hints: false }
});

process.env.BABEL_ENV = process.env.BABEL_ENV || 'development';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const started = Date.now();
compiler.run((error, stats) => {
    compiler.close(() => {});
    if (error || stats.hasErrors()) {
        console.error(error || stats.toString({ all: false, errors: true, errorDetails: false }).slice(0, 6000));
        process.exitCode = 1;
        return;
    }
    const bundle = path.join(output, 'harness.js');
    fs.writeFileSync(path.join(output, 'index.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>P11 witness</title></head><body><div id="root"></div><script src="harness.js"></script></body></html>');
    console.log(JSON.stringify({ output, bytes: fs.statSync(bundle).size, seconds: (Date.now() - started) / 1000, warnings: stats.compilation.warnings.length }));
});
