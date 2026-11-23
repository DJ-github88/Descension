'use strict';

/**
 * TEST-ONLY MODULE LOADER
 *
 * Preloaded by Mocha (`--require ./tests/helpers/passiveActivationTestLoader.cjs`)
 * to exercise the engineering slice while the shipped policy module remains
 * fail-closed (`creatorApproval: null`).
 *
 * Production never loads this file.
 */
const Module = require('module');
const path = require('path');

const testPolicyPath = path.resolve(__dirname, 'passiveActivationTestPolicy.js');
const originalLoad = Module._load;

process[Symbol.for('mythrill.passiveActivationTestLoader')] = true;

Module._load = function patchedLoad(request, parent, isMain) {
  if (typeof request === 'string' && request.endsWith('passiveActivationPolicy') && !request.endsWith('passiveActivationTestPolicy')) {
    return originalLoad.call(this, testPolicyPath, parent, isMain);
  }
  return originalLoad.call(this, request, parent, isMain);
};
