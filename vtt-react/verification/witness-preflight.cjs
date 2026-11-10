'use strict';

const fs = require('fs');
const net = require('net');
const path = require('path');

class PreflightError extends Error {
  constructor(check, detail, cause) {
    super(`[preflight:${check}] ${detail}`);
    this.name = 'PreflightError';
    this.check = check;
    this.detail = detail;
    this.cause = cause;
    this.code = cause && cause.code ? cause.code : 'PREFLIGHT_FAILED';
    this.exitCode = cause && Number.isInteger(cause.exitCode) ? cause.exitCode : 1;
  }
}

function fail(check, detail, cause) {
  throw new PreflightError(check, detail, cause);
}

function resolveConfiguredPath(config, kind) {
  const direct = config[kind];
  if (direct != null) return direct;
  const envName = config[`${kind}Env`];
  if (!envName) fail('configuration', `missing ${kind} or ${kind}Env in witness preflight configuration`);
  const value = process.env[envName];
  if (!value) fail('required-environment', `${envName} is not set`);
  return value;
}

function requireAbsolute(label, value) {
  if (!path.isAbsolute(value)) fail('required-environment', `${label} must be an absolute path`);
}

function assertReadableFile(label, file, check) {
  try {
    const stat = fs.statSync(file);
    if (!stat.isFile()) fail(check, `${label} is not a file: ${file}`);
    fs.accessSync(file, fs.constants.R_OK);
  } catch (error) {
    if (error instanceof PreflightError) throw error;
    fail(check, `${label} is not readable: ${file}`, error);
  }
}

function assertReadableDirectory(label, dir, check) {
  try {
    const stat = fs.statSync(dir);
    if (!stat.isDirectory()) fail(check, `${label} is not a directory: ${dir}`);
    fs.accessSync(dir, fs.constants.R_OK);
  } catch (error) {
    if (error instanceof PreflightError) throw error;
    fail(check, `${label} is not readable: ${dir}`, error);
  }
}

function assertReadableText(label, file, check) {
  assertReadableFile(label, file, check);
  try {
    fs.readFileSync(file, 'utf8');
  } catch (error) {
    fail(check, `${label} is not readable: ${file}`, error);
  }
}

function readJson(label, file, check) {
  assertReadableFile(label, file, check);
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (error) {
    fail(check, `${label} is not readable: ${file}`, error);
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(check, `${label} is not valid JSON: ${file}`, error);
  }
}

function checkBuild(config, build) {
  assertReadableDirectory('build directory', build, 'build-directory');
  const buildFiles = config.buildFiles || ['index.html', 'asset-manifest.json'];
  for (const file of buildFiles) {
    const check = file === 'asset-manifest.json' ? 'build-manifest' : 'build-index';
    if (file === 'asset-manifest.json') assertReadableFile(`build ${file}`, path.join(build, file), check);
    else assertReadableText(`build ${file}`, path.join(build, file), check);
  }

  const manifest = readJson('asset manifest', path.join(build, 'asset-manifest.json'), 'build-manifest');
  if (!manifest || typeof manifest.files !== 'object' || manifest.files === null) {
    fail('build-manifest', 'asset manifest has no files map');
  }

  const requiredEntries = config.requiredManifestEntries || ['main.js'];
  for (const entry of requiredEntries) {
    if (!manifest.files[entry]) fail('build-manifest', `asset manifest is missing required entry ${entry}`);
  }

  for (const [entry, value] of Object.entries(manifest.files)) {
    if (typeof value !== 'string' || !value) fail('build-assets', `asset manifest entry ${entry} is not a path`);
    if (/^[a-z]+:\/\//i.test(value)) fail('build-assets', `asset manifest entry ${entry} is not a local build path`);
    const assetPath = path.resolve(build, '.' + (value.startsWith('/') ? value : `/${value}`));
    if (assetPath !== build && !assetPath.startsWith(build + path.sep)) {
      fail('build-assets', `asset manifest entry ${entry} escapes the build directory: ${value}`);
    }
    assertReadableFile(`build asset ${entry}`, assetPath, 'build-assets');
  }

  return { path: build, assetCount: Object.keys(manifest.files).length };
}

function checkOutput(output) {
  try {
    fs.mkdirSync(output, { recursive: true });
    if (!fs.statSync(output).isDirectory()) fail('output-writable', `output path is not a directory: ${output}`);
  } catch (error) {
    if (error instanceof PreflightError) throw error;
    fail('output-writable', `output directory cannot be created: ${output}`, error);
  }

  const probe = path.join(output, `.preflight-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}.tmp`);
  try {
    fs.writeFileSync(probe, 'ok', { flag: 'wx' });
    fs.unlinkSync(probe);
  } catch (error) {
    try { fs.unlinkSync(probe); } catch (cleanupError) {}
    fail('output-writable', `output directory is not writable: ${output}`, error);
  }

  return { path: output };
}

function checkModules(config) {
  const specs = config.modules || [];
  const baseDir = config.baseDir || process.cwd();
  const loaded = [];
  for (const spec of specs) {
    let resolved;
    try {
      resolved = require.resolve(spec, { paths: [baseDir] });
    } catch (error) {
      fail('modules', `required module is not resolvable: ${spec}`, error);
    }
    try {
      require(resolved);
    } catch (error) {
      fail('modules', `required module failed to load: ${spec}`, error);
    }
    loaded.push(spec);
  }
  return loaded;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function checkServerContract(config) {
  const serverConfig = config.server;
  if (!serverConfig || !serverConfig.module) return null;
  const host = serverConfig.host || '127.0.0.1';
  const port = serverConfig.port;
  const baseDir = config.baseDir || process.cwd();
  let modulePath;
  try {
    modulePath = path.isAbsolute(serverConfig.module)
      ? serverConfig.module
      : require.resolve(serverConfig.module, { paths: [baseDir] });
  } catch (error) {
    fail('server-contract', `server helper is not resolvable: ${serverConfig.module}`, error);
  }
  assertReadableText('server helper', modulePath, 'server-contract');
  let source;
  try {
    source = fs.readFileSync(modulePath, 'utf8');
  } catch (error) {
    fail('server-contract', `server helper is not readable: ${modulePath}`, error);
  }
  const pattern = new RegExp(`listen\\(\\s*${port}\\s*,\\s*['"]${escapeRegExp(host)}['"]`);
  if (!pattern.test(source)) {
    fail('server-contract', `server helper does not declare the configured ${host}:${port} listener`);
  }
  return { host, port };
}

function checkPort(config) {
  const serverConfig = config.server;
  if (!serverConfig) return Promise.resolve(null);
  const host = serverConfig.host || '127.0.0.1';
  const port = serverConfig.port;
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    return Promise.reject(new PreflightError('server-port', `invalid witness server port: ${port}`));
  }

  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    let settled = false;
    const finish = (error, boundPort) => {
      if (settled) return;
      settled = true;
      probe.close(() => {});
      if (error) {
        reject(error instanceof PreflightError ? error : new PreflightError('server-port',
          `witness contract requires ${host}:${port}, but that endpoint is not available`, error));
        return;
      }
      resolve({ host, port: boundPort, available: true });
    };
    probe.once('error', error => finish(error));
    probe.listen({ host, port }, () => finish(null, probe.address().port));
    setTimeout(() => finish(new PreflightError('server-port',
      `timed out checking witness contract endpoint ${host}:${port}`)), 5000).unref();
  });
}

async function run(config = {}) {
  const witness = config.witness || '(unnamed witness)';
  const checks = [];
  try {
    const output = resolveConfiguredPath(config, 'output');
    const build = resolveConfiguredPath(config, 'build');
    if (config.requireAbsolutePaths !== false) {
      requireAbsolute('output', output);
      requireAbsolute('build', build);
    }
    checks.push({ id: 'required-environment', ok: true, detail: 'configured environment paths are present' });

    const fixtureFiles = config.fixtureFiles || [];
    for (const fixture of fixtureFiles) {
      assertReadableFile(fixture.label || 'fixture', fixture.path, 'environment-paths');
    }
    checks.push({ id: 'environment-paths', ok: true, detail: `${fixtureFiles.length} fixture path(s) readable` });

    const buildResult = checkBuild(config, build);
    checks.push({ id: 'build-index', ok: true, detail: 'build index readable' });
    checks.push({ id: 'build-manifest', ok: true, detail: 'asset manifest readable' });
    checks.push({ id: 'build-assets', ok: true, detail: `${buildResult.assetCount} referenced asset(s) present` });

    const outputResult = checkOutput(output);
    checks.push({ id: 'output-writable', ok: true, detail: 'output directory is writable' });

    if (config.appOutputEnv && config.appOutputSubdir && !process.env[config.appOutputEnv]) {
      process.env[config.appOutputEnv] = path.join(output, config.appOutputSubdir);
    }

    const modules = checkModules(config);
    checks.push({ id: 'modules', ok: true, detail: `${modules.length} required module(s) loaded` });

    const serverContract = checkServerContract(config);
    if (serverContract) checks.push({ id: 'server-contract', ok: true, detail: `${serverContract.host}:${serverContract.port} declared by the server helper` });
    const server = await checkPort(config);
    if (server) checks.push({ id: 'server-port', ok: true, detail: `${server.host}:${server.port} available` });

    return { ok: true, witness, build: buildResult.path, output: outputResult.path, server, modules, checks };
  } catch (error) {
    if (error instanceof PreflightError) {
      error.witness = witness;
      error.checks = checks;
      throw error;
    }
    throw error;
  }
}

function printFailure(error, stream = process.stderr) {
  if (!(error instanceof PreflightError)) {
    stream.write(`${error && error.stack ? error.stack : error}\n`);
    return;
  }
  stream.write(`PREFLIGHT FAILED: ${error.detail}\n`);
  stream.write(`  witness: ${error.witness || '(unknown)'}\n`);
  stream.write(`  prerequisite: ${error.check}\n`);
  stream.write(`  exit: ${error.exitCode}\n`);
  if (error.cause) {
    const code = error.cause.code && !error.cause.message.startsWith(error.cause.code) ? `${error.cause.code}: ` : '';
    stream.write(`  original: ${code}${error.cause.message}\n`);
  }
}

function printPass(result, stream = process.stdout) {
  stream.write(`PREFLIGHT PASS: ${result.witness}\n`);
  stream.write(`  build: ${result.build}\n`);
  stream.write(`  output: ${result.output}\n`);
  if (result.server) stream.write(`  server: ${result.server.host}:${result.server.port} available\n`);
  stream.write(`  modules: ${result.modules.length} loaded\n`);
  stream.write(`  checks: ${result.checks.map(check => check.id).join(', ')}\n`);
}

async function cli(argv) {
  const configPath = argv[2];
  if (!configPath) {
    process.stderr.write('Usage: node witness-preflight.cjs <config-module>\n');
    return 2;
  }
  let config;
  try {
    config = require(path.resolve(configPath));
  } catch (error) {
    process.stderr.write(`${error && error.stack ? error.stack : error}\n`);
    return 1;
  }
  try {
    const result = await run(config);
    printPass(result);
    return 0;
  } catch (error) {
    printFailure(error);
    if (error && error.cause) process.stderr.write(`${error.cause.stack || error.cause}\n`);
    return error && Number.isInteger(error.exitCode) ? error.exitCode : 1;
  }
}

module.exports = { PreflightError, run, printFailure, printPass };
if (require.main === module) cli(process.argv).then(code => process.exit(code), error => {
  process.stderr.write(`${error && error.stack ? error.stack : error}\n`);
  process.exit(1);
});
