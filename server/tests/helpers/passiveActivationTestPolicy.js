'use strict';

/**
 * TEST-ONLY POLICY MODULE
 *
 * Wraps the shipped `server/shared/services/passiveActivationPolicy.js` module
 * and overrides `approved()`, `stackingMode()`, and `describePassiveStatus()`
 * ONLY when Mocha preloads `passiveActivationTestLoader.cjs`.
 *
 * Production code never requires this file and never reads an environment
 * variable or global to unlock passive activation.
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const shippedPath = path.resolve(__dirname, '../../shared/services/passiveActivationPolicy.js');
const shippedSource = fs.readFileSync(shippedPath, 'utf8');
const sandbox = { module: { exports: {} }, exports: {}, Object };
vm.runInNewContext(shippedSource, sandbox, { filename: shippedPath });
const shipped = sandbox.module.exports;

let testApproved = true;
let testStackingMode = null;

function approved() {
  return testApproved === true;
}

function stackingMode() {
  if (testStackingMode) {return testStackingMode;}
  if (process.env.PASSIVE_STACKING && shipped.STACKING_MODES.includes(process.env.PASSIVE_STACKING)) {
    return process.env.PASSIVE_STACKING;
  }
  return shipped.stackingMode();
}

function setApprovedForTest(value) {
  testApproved = Boolean(value);
}

function setStackingModeForTest(mode) {
  if (mode !== null && !shipped.STACKING_MODES.includes(mode)) {
    throw new Error(`Invalid test stacking mode: ${mode}`);
  }
  testStackingMode = mode;
}

function resetPolicyForTest() {
  testApproved = true;
  testStackingMode = null;
}

function describePassiveStatus(optionsOrActivation, maybeEligibility) {
  const isPlain = v => !!v && typeof v === 'object' && !Array.isArray(v);
  const isOptionsObj = isPlain(optionsOrActivation) && (
    Object.prototype.hasOwnProperty.call(optionsOrActivation, 'activation') ||
    Object.prototype.hasOwnProperty.call(optionsOrActivation, 'eligibility') ||
    Object.prototype.hasOwnProperty.call(optionsOrActivation, 'policyApproved')
  );
  const opts = isOptionsObj
    ? { ...optionsOrActivation }
    : { activation: optionsOrActivation || null, eligibility: maybeEligibility || null };
  if (opts.policyApproved === undefined) {
    opts.policyApproved = approved();
  }
  return shipped.describePassiveStatus(opts);
}

const POLICY = Object.freeze({
  ...shipped.POLICY,
  creatorApproval: Object.freeze({
    reference: 'TEST-ONLY-INJECTION:first-playable-passive-implementation',
    testOnly: true
  })
});

module.exports = Object.freeze({
  ...shipped,
  POLICY,
  approved,
  stackingMode,
  describePassiveStatus,
  setApprovedForTest,
  setStackingModeForTest,
  resetPolicyForTest
});
