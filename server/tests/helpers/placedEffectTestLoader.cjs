'use strict';

/**
 * TEST-ONLY MODULE LOADER
 *
 * Preloaded by Mocha (`--require ./tests/helpers/placedEffectTestLoader.cjs`)
 * to test armed placed-effect trigger rules in isolation while the shipped
 * policy module remains fail-closed (`creatorApproval: null`).
 *
 * Production never loads this file.
 */
const Module = require('module');
const path = require('path');

const testPolicyPath = path.resolve(__dirname, 'placedEffectTestPolicy.js');
const originalLoad = Module._load;

process[Symbol.for('mythrill.placedEffectTestLoader')] = true;

Module._load = function patchedLoad(request, parent, isMain) {
  if (typeof request === 'string' && request.endsWith('placedEffectPolicy') && !request.endsWith('placedEffectTestPolicy')) {
    return originalLoad.call(this, testPolicyPath, parent, isMain);
  }
  return originalLoad.call(this, request, parent, isMain);
};
