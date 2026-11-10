'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const net = require('net');
const os = require('os');
const path = require('path');
const { run, PreflightError } = require('./witness-preflight.cjs');

function tempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'witness-preflight-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function write(file, body = 'ok') {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body);
}

function validBuild(t) {
  const dir = tempDir(t);
  write(path.join(dir, 'index.html'), '<html></html>');
  write(path.join(dir, 'static/js/main.js'), 'console.log(1)');
  write(path.join(dir, 'static/css/main.css'), 'body{}');
  write(path.join(dir, 'asset-manifest.json'), JSON.stringify({
    files: { 'main.js': '/static/js/main.js', 'main.css': '/static/css/main.css' }
  }));
  return dir;
}

function baseConfig(t, overrides = {}) {
  const dir = tempDir(t);
  const build = validBuild(t);
  write(path.join(dir, 'fixture-module.cjs'), 'module.exports = {};');
  return {
    witness: 'witness-preflight.test.cjs',
    baseDir: dir,
    output: path.join(dir, 'out'),
    build,
    requireAbsolutePaths: true,
    buildFiles: ['index.html', 'asset-manifest.json'],
    requiredManifestEntries: ['main.js'],
    modules: ['./fixture-module.cjs'],
    ...overrides
  };
}

async function expectFailure(promise, check) {
  try {
    await promise;
  } catch (error) {
    assert.ok(error instanceof PreflightError, `expected PreflightError, got ${error}`);
    assert.equal(error.check, check);
    return error;
  }
  assert.fail(`expected preflight failure at ${check}`);
}

test('fails when a required environment variable is missing', async t => {
  const dir = tempDir(t);
  const name = 'WITNESS_PREFLIGHT_TEST_MISSING_OUTPUT';
  const previous = process.env[name];
  delete process.env[name];
  t.after(() => {
    if (previous === undefined) delete process.env[name];
    else process.env[name] = previous;
  });
  const error = await expectFailure(run({
    witness: 'witness-preflight.test.cjs',
    baseDir: dir,
    outputEnv: name,
    build: dir,
    modules: []
  }), 'required-environment');
  assert.match(error.message, new RegExp(name));
  assert.equal(error.cause, undefined);
});

test('fails when the build index is missing', async t => {
  const config = baseConfig(t);
  fs.rmSync(path.join(config.build, 'index.html'));
  const error = await expectFailure(run(config), 'build-index');
  assert.equal(error.cause.code, 'ENOENT');
});

test('fails when the asset manifest is missing', async t => {
  const config = baseConfig(t);
  fs.rmSync(path.join(config.build, 'asset-manifest.json'));
  const error = await expectFailure(run(config), 'build-manifest');
  assert.equal(error.cause.code, 'ENOENT');
});

test('fails when the asset manifest is malformed and preserves the original parse error', async t => {
  const config = baseConfig(t);
  write(path.join(config.build, 'asset-manifest.json'), '{');
  const error = await expectFailure(run(config), 'build-manifest');
  assert.equal(error.cause.name, 'SyntaxError');
});

test('fails when a referenced build asset is missing', async t => {
  const config = baseConfig(t);
  fs.rmSync(path.join(config.build, 'static/js/main.js'));
  const error = await expectFailure(run(config), 'build-assets');
  assert.equal(error.cause.code, 'ENOENT');
  assert.match(error.message, /main\.js/);
});

test('fails when the output path cannot be used as a writable directory', async t => {
  const config = baseConfig(t);
  write(config.output, 'not a directory');
  const error = await expectFailure(run(config), 'output-writable');
  assert.ok(['EEXIST', 'ENOTDIR'].includes(error.cause.code), error.cause.code);
});

test('fails without killing a process that already owns the contract port', async t => {
  const config = baseConfig(t);
  const server = net.createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  t.after(() => new Promise(resolve => server.close(resolve)));
  config.server = { host: '127.0.0.1', port: server.address().port };
  const error = await expectFailure(run(config), 'server-port');
  assert.equal(error.cause.code, 'EADDRINUSE');
});

test('fails when a required module cannot be resolved', async t => {
  const config = baseConfig(t, { modules: ['./missing-fixture-module.cjs'] });
  const error = await expectFailure(run(config), 'modules');
  assert.equal(error.cause.code, 'MODULE_NOT_FOUND');
});

test('fails when the server helper does not declare the contracted endpoint', async t => {
  const config = baseConfig(t);
  write(path.join(config.baseDir, 'server-helper.cjs'), "server.listen(9999, '127.0.0.1');");
  config.server = { host: '127.0.0.1', port: 4180, module: './server-helper.cjs' };
  const error = await expectFailure(run(config), 'server-contract');
  assert.match(error.message, /does not declare/);
});

test('fails when a required fixture path is missing', async t => {
  const config = baseConfig(t, {
    fixtureFiles: [{ label: 'missing fixture', path: path.join(os.tmpdir(), 'witness-preflight-missing-fixture.json') }]
  });
  const error = await expectFailure(run(config), 'environment-paths');
  assert.equal(error.cause.code, 'ENOENT');
});

test('passes all prerequisites and removes its write probe', async t => {
  const config = baseConfig(t);
  write(path.join(config.baseDir, 'server-helper.cjs'), "server.listen(0, '127.0.0.1');");
  config.server = { host: '127.0.0.1', port: 0, module: './server-helper.cjs' };
  const result = await run(config);
  assert.equal(result.ok, true);
  assert.equal(result.build, config.build);
  assert.equal(result.output, config.output);
  assert.equal(result.server.available, true);
  assert.ok(result.server.port > 0);
  assert.deepEqual(result.checks.map(check => check.id), [
    'required-environment',
    'environment-paths',
    'build-index',
    'build-manifest',
    'build-assets',
    'output-writable',
    'modules',
    'server-contract',
    'server-port'
  ]);
  assert.deepEqual(fs.readdirSync(config.output).filter(name => name.startsWith('.preflight-')), []);
});
