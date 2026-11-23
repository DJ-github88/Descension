'use strict';

/**
 * Stage-isolation guard for the composition-preservation gate.
 *
 * When COMPOSITION_STAGE_ROOT differs from COMPOSITION_LIVE_ROOT, any attempt
 * to resolve a product or test module inside the live repository (outside
 * node_modules) throws ERR_LIVE_MODULE_SUBSTITUTION so a staged run can never
 * silently fall back to live modules.
 */
const Module = require('node:module');
const path = require('node:path');

const stageRootRaw = process.env.COMPOSITION_STAGE_ROOT;
const liveRootRaw = process.env.COMPOSITION_LIVE_ROOT;

if (stageRootRaw && liveRootRaw) {
  const stageRoot = path.resolve(stageRootRaw);
  const liveRoot = path.resolve(liveRootRaw);

  if (stageRoot.toLowerCase() !== liveRoot.toLowerCase()) {
    const liveServerDir = path.join(liveRoot, 'server');
    const liveServerNodeModules = path.join(liveServerDir, 'node_modules');
    const liveClientDir = path.join(liveRoot, 'vtt-react');

    const isUnder = (target, dir) => {
      const rel = path.relative(dir, target);
      return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
    };

    const originalResolveFilename = Module._resolveFilename;
    Module._resolveFilename = function guardedResolveFilename(request, parent, isMain, options) {
      const resolved = originalResolveFilename.call(this, request, parent, isMain, options);
      if (typeof resolved === 'string' && path.isAbsolute(resolved)) {
        const normalized = path.resolve(resolved);
        const inLiveServer = isUnder(normalized, liveServerDir) && !isUnder(normalized, liveServerNodeModules);
        const inLiveClient = isUnder(normalized, liveClientDir);
        if (inLiveServer || inLiveClient) {
          const err = new Error(
            `ERR_LIVE_MODULE_SUBSTITUTION: Refusing to load live module "${normalized}" ` +
            `(requested "${request}") while testing staged root "${stageRoot}".`
          );
          err.code = 'ERR_LIVE_MODULE_SUBSTITUTION';
          throw err;
        }
      }
      return resolved;
    };
  }
}
