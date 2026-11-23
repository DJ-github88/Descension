'use strict';

/**
 * TEST-ONLY POLICY MODULE
 *
 * Wraps shipped `server/shared/services/placedEffectPolicy.js` and overrides
 * `armedApproved()` and `activeRules()` ONLY when Mocha preloads
 * `placedEffectTestLoader.cjs`.
 *
 * Production code never requires this file.
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const shippedPath = path.resolve(__dirname, '../../shared/services/placedEffectPolicy.js');
const shippedSource = fs.readFileSync(shippedPath, 'utf8');
const sandbox = { module: { exports: {} }, exports: {}, Object };
vm.runInNewContext(shippedSource, sandbox, { filename: shippedPath });
const shipped = sandbox.module.exports;
const LOADER_SYMBOL = Symbol.for('mythrill.placedEffectTestLoader');

let testArmedApproved = true;
let testRules = null;

function armedApproved() {
  return testArmedApproved === true;
}

function setArmedApprovedForTest(value) {
  testArmedApproved = Boolean(value);
}

function setTestRulesForTest(overrides) {
  if (overrides === null || overrides === undefined) {
    testRules = null;
    return;
  }
  if (typeof overrides !== 'object' || Array.isArray(overrides)) {
    throw new Error('Test rules overrides must be a plain object or null.');
  }
  const base = shipped.POLICY.proposedTrapRules;
  const vis = overrides.visibility ?? base.visibility;
  const exp = overrides.expiry ?? base.expiry;
  const pay = overrides.payment ?? base.payment;
  if (!shipped.VISIBILITY_MODES.includes(vis)) throw new Error(`Invalid test visibility mode: ${vis}`);
  if (!shipped.EXPIRY_MODES.includes(exp)) throw new Error(`Invalid test expiry mode: ${exp}`);
  if (!shipped.PAYMENT_MODES.includes(pay)) throw new Error(`Invalid test payment mode: ${pay}`);

  const eligIn = overrides.triggerEligibility || {};
  const actorKind = eligIn.actorKind ?? base.triggerEligibility.actorKind;
  const relationship = eligIn.relationship ?? base.triggerEligibility.relationship;
  const voluntaryMoveOnly = eligIn.voluntaryMoveOnly ?? base.triggerEligibility.voluntaryMoveOnly;
  if (!shipped.ACTOR_KINDS.includes(actorKind)) throw new Error(`Invalid test actorKind: ${actorKind}`);
  if (!shipped.RELATIONSHIPS.includes(relationship)) throw new Error(`Invalid test relationship: ${relationship}`);
  if (typeof voluntaryMoveOnly !== 'boolean') throw new Error('voluntaryMoveOnly must be boolean');

  testRules = Object.freeze({
    triggerEligibility: Object.freeze({ actorKind, relationship, voluntaryMoveOnly }),
    payment: pay,
    visibility: vis,
    expiry: exp
  });
}

function resetPolicyForTest() {
  testArmedApproved = true;
  testRules = null;
}

function activeRules() {
  if (!armedApproved()) {
    return shipped.POLICY.unapprovedRules;
  }
  const chosen = testRules || shipped.POLICY.proposedTrapRules;
  return Object.freeze({
    armedAllowed: true,
    triggerEligibility: chosen.triggerEligibility,
    payment: chosen.payment,
    visibility: chosen.visibility,
    expiry: chosen.expiry
  });
}

const POLICY = Object.freeze({
  ...shipped.POLICY,
  creatorApproval: Object.freeze({
    reference: 'TEST-ONLY-INJECTION:placed-effect-isolated-verification',
    testOnly: true
  })
});

const exportedPolicy = Object.freeze({
  ...shipped,
  POLICY,
  armedApproved,
  activeRules,
  setArmedApprovedForTest,
  setTestRulesForTest,
  resetPolicyForTest,
  isPolicySwapLoaderActive,
  requirePolicySwapLoader
});

function isPolicySwapLoaderActive() {
  if (process[LOADER_SYMBOL] !== true) {
    return false;
  }
  const resolved = require('../../shared/services/placedEffectPolicy');
  return resolved === exportedPolicy;
}

function requirePolicySwapLoader(ctx, reason) {
  if (isPolicySwapLoaderActive()) {
    return true;
  }
  const message = reason || 'Requires test-only policy-swap loader (--require tests/helpers/placedEffectTestLoader.cjs)';
  if (process.env.PLACED_REQUIRE_TEST_LOADER === '1') {
    throw new Error(`Required test-only loader is not active: ${message}`);
  }
  if (ctx && typeof ctx.skip === 'function') {
    ctx.skip(message);
  }
  return false;
}

module.exports = exportedPolicy;
