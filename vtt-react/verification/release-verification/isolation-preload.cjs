'use strict';

const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');
const Module = require('node:module');

const WORKSPACE_ROOT = path.resolve(__dirname, '../../..');
const WORKSPACE_LOWER = WORKSPACE_ROOT.replace(/\//g, '\\').toLowerCase();

function toWinLower(p) {
  return path.resolve(p).replace(/\//g, '\\').toLowerCase();
}

const stageRoot = process.env.RELEASE_VERIFY_STAGE_ROOT
  ? path.resolve(process.env.RELEASE_VERIFY_STAGE_ROOT)
  : null;
const serverDir = process.env.RELEASE_VERIFY_SERVER_DIR
  ? path.resolve(process.env.RELEASE_VERIFY_SERVER_DIR)
  : null;
const redirectWorkspaceSrc = process.env.RELEASE_VERIFY_REDIRECT_WORKSPACE_SRC === '1';
const redirectEvidenceFrom = process.env.RELEASE_VERIFY_REDIRECT_EVIDENCE_FROM
  ? path.resolve(process.env.RELEASE_VERIFY_REDIRECT_EVIDENCE_FROM)
  : null;
const redirectEvidenceTo = process.env.RELEASE_VERIFY_EVIDENCE_DIR
  ? path.resolve(process.env.RELEASE_VERIFY_EVIDENCE_DIR)
  : null;
const isolatedTempDir = process.env.RELEASE_VERIFY_ISOLATED_TMP
  ? path.resolve(process.env.RELEASE_VERIFY_ISOLATED_TMP)
  : null;
const forceEphemeralPorts = process.env.RELEASE_VERIFY_FORCE_EPHEMERAL_PORTS !== '0';

// 1. Preserve Playwright browser lookup before isolating TEMP/TMP for browser profile data.
if (!process.env.PLAYWRIGHT_BROWSERS_PATH) {
  const defaultPlaywrightCache = path.join(
    process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE || 'C:\\Users\\Daniel', 'AppData', 'Local'),
    'ms-playwright'
  );
  if (fs.existsSync(defaultPlaywrightCache)) {
    process.env.PLAYWRIGHT_BROWSERS_PATH = defaultPlaywrightCache;
  }
}

if (isolatedTempDir) {
  fs.mkdirSync(isolatedTempDir, { recursive: true });
  process.env.TEMP = isolatedTempDir;
  process.env.TMP = isolatedTempDir;
  process.env.TMPDIR = isolatedTempDir;
}

// 2. Ensure isolated stages copied without node_modules resolve dependencies cleanly.
const extraNodePaths = [
  stageRoot ? path.join(stageRoot, 'server', 'node_modules') : null,
  stageRoot ? path.join(stageRoot, 'vtt-react', 'node_modules') : null,
  serverDir ? path.join(serverDir, 'node_modules') : null,
  path.join(WORKSPACE_ROOT, 'server', 'node_modules'),
  path.join(WORKSPACE_ROOT, 'vtt-react', 'node_modules')
].filter((dir) => dir && fs.existsSync(dir));
const existingNodePath = (process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean);
process.env.NODE_PATH = Array.from(new Set([...existingNodePath, ...extraNodePaths])).join(path.delimiter);
Module._initPaths();

// 3. Rewrite fixed ports (e.g. 4180, 3000, 3001) to ephemeral port 0 on 127.0.0.1.
if (forceEphemeralPorts) {
  const origListen = net.Server.prototype.listen;
  net.Server.prototype.listen = function patchedListen(...args) {
    if (args.length > 0 && typeof args[0] === 'number' && args[0] > 0) {
      const nextArgs = [...args];
      nextArgs[0] = 0;
      return origListen.apply(this, nextArgs);
    }
    if (args.length > 0 && args[0] && typeof args[0] === 'object' && typeof args[0].port === 'number' && args[0].port > 0) {
      const nextArgs = [...args];
      nextArgs[0] = { ...args[0], port: 0 };
      return origListen.apply(this, nextArgs);
    }
    return origListen.apply(this, args);
  };
}

function findExistingTarget(candidate, allowModuleExts) {
  if (fs.existsSync(candidate)) {
    try {
      if (fs.statSync(candidate).isFile()) return candidate;
    } catch (_) {}
  }
  if (allowModuleExts) {
    for (const ext of ['.js', '.cjs', '.mjs', '.json', '.jsx']) {
      const withExt = candidate + ext;
      if (fs.existsSync(withExt)) return withExt;
    }
    for (const idx of ['index.js', 'index.cjs', 'index.mjs', 'index.json']) {
      const withIdx = path.join(candidate, idx);
      if (fs.existsSync(withIdx)) return withIdx;
    }
  }
  if (fs.existsSync(candidate)) return candidate;
  return null;
}

function rewritePath(targetPath, allowModuleExts = false) {
  if (typeof targetPath !== 'string' || !targetPath) return targetPath;
  if (!path.isAbsolute(targetPath) && !/^[a-zA-Z]:[\\/]/.test(targetPath)) return targetPath;

  const resolved = path.resolve(targetPath);
  const lower = toWinLower(resolved);

  if (redirectEvidenceFrom && redirectEvidenceTo) {
    const fromLower = toWinLower(redirectEvidenceFrom);
    if (lower === fromLower || lower.startsWith(fromLower + '\\')) {
      const rel = resolved.slice(redirectEvidenceFrom.length).replace(/^[\\/]+/, '');
      return rel ? path.join(redirectEvidenceTo, rel) : redirectEvidenceTo;
    }
  }

  if (redirectWorkspaceSrc && stageRoot && toWinLower(stageRoot) !== WORKSPACE_LOWER) {
    const prefixes = [
      path.join(WORKSPACE_ROOT, 'server'),
      path.join(WORKSPACE_ROOT, 'vtt-react', 'src'),
      path.join(WORKSPACE_ROOT, 'vtt-react', 'public', 'data')
    ];
    for (const prefix of prefixes) {
      const prefixLower = toWinLower(prefix);
      if (lower === prefixLower || lower.startsWith(prefixLower + '\\')) {
        if (lower.includes('\\node_modules\\')) return targetPath;
        const rel = resolved.slice(WORKSPACE_ROOT.length).replace(/^[\\/]+/, '');
        const candidate = serverDir && rel.toLowerCase().startsWith('server\\')
          ? path.join(serverDir, rel.slice('server\\'.length))
          : path.join(stageRoot, rel);
        const resolvedCandidate = findExistingTarget(candidate, allowModuleExts);
        if (resolvedCandidate) {
          return resolvedCandidate;
        }
      }
    }
  }

  return targetPath;
}

// 4. Redirect hardcoded evidence writes and workspace source requires inside child witness.
if (redirectEvidenceFrom || (redirectWorkspaceSrc && stageRoot)) {
  const origResolveFilename = Module._resolveFilename;
  Module._resolveFilename = function patchedResolveFilename(request, parent, isMain, options) {
    if (typeof request === 'string') {
      const rewrittenReq = rewritePath(request, true);
      if (rewrittenReq !== request) {
        return origResolveFilename.call(this, rewrittenReq, parent, isMain, options);
      }
      if (redirectWorkspaceSrc && parent && parent.filename && (request.startsWith('./') || request.startsWith('../'))) {
        const candidateAbs = path.resolve(path.dirname(parent.filename), request);
        const rewrittenAbs = rewritePath(candidateAbs, true);
        if (rewrittenAbs !== candidateAbs) {
          return origResolveFilename.call(this, rewrittenAbs, parent, isMain, options);
        }
      }
    }
    return origResolveFilename.call(this, request, parent, isMain, options);
  };

  const wrapFsFirstArg = (obj, methodName) => {
    const orig = obj[methodName];
    if (typeof orig !== 'function') return;
    obj[methodName] = function patchedFs(filePath, ...rest) {
      return orig.call(this, rewritePath(filePath), ...rest);
    };
  };

  for (const name of [
    'existsSync',
    'statSync',
    'lstatSync',
    'readFileSync',
    'writeFileSync',
    'appendFileSync',
    'mkdirSync',
    'readdirSync',
    'createWriteStream',
    'createReadStream'
  ]) {
    wrapFsFirstArg(fs, name);
  }
  if (fs.promises) {
    for (const name of ['mkdir', 'writeFile', 'readFile', 'stat']) {
      wrapFsFirstArg(fs.promises, name);
    }
  }
}

// 5. Wrap Playwright launch/contexts so screenshots redirect to isolated evidence dir cleanly.
function wrapPlaywrightModule(pw) {
  if (!pw || !pw.chromium || pw.chromium.__releaseVerifyWrapped) return pw;
  pw.chromium.__releaseVerifyWrapped = true;
  const origLaunch = pw.chromium.launch.bind(pw.chromium);

  const wrapPage = (page) => {
    if (!page || page.__releaseVerifyPageWrapped) return page;
    page.__releaseVerifyPageWrapped = true;
    const origScreenshot = page.screenshot.bind(page);
    page.screenshot = async function patchedScreenshot(options = {}) {
      if (options && typeof options.path === 'string') {
        const nextPath = rewritePath(options.path);
        fs.mkdirSync(path.dirname(nextPath), { recursive: true });
        return origScreenshot({ ...options, path: nextPath });
      }
      return origScreenshot(options);
    };
    return page;
  };

  const wrapContext = (ctx) => {
    if (!ctx || ctx.__releaseVerifyCtxWrapped) return ctx;
    ctx.__releaseVerifyCtxWrapped = true;
    const origNewPage = ctx.newPage.bind(ctx);
    ctx.newPage = async function patchedNewPage(...args) {
      const page = await origNewPage(...args);
      return wrapPage(page);
    };
    return ctx;
  };

  pw.chromium.launch = async function patchedLaunch(options = {}) {
    const browser = await origLaunch(options);
    const origNewContext = browser.newContext.bind(browser);
    const origNewPage = browser.newPage.bind(browser);
    browser.newContext = async function patchedNewContext(...args) {
      const ctx = await origNewContext(...args);
      return wrapContext(ctx);
    };
    browser.newPage = async function patchedBrowserNewPage(...args) {
      const page = await origNewPage(...args);
      return wrapPage(page);
    };
    return browser;
  };

  return pw;
}

const origLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  const exported = origLoad.apply(this, arguments);
  if (
    typeof request === 'string' &&
    (request === 'playwright' || /[\\/]playwright(?:[\\/]index\.js)?$/i.test(request))
  ) {
    return wrapPlaywrightModule(exported);
  }
  return exported;
};
