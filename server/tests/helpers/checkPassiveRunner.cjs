#!/usr/bin/env node
'use strict';

/**
 * Verifies passive test-runner behavior across 4 required invariants:
 *   1. Ordinary mode (no loader) has 0 setup-caused failures;
 *   2. Required acceptance mode executes all expected rows (including loader-dependent);
 *   3. Missing required setup (PASSIVE_REQUIRE_TEST_LOADER=1 without loader) exits nonzero;
 *   4. A real assertion failure still exits nonzero.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { runPassiveSuite, REQUIRED_LOADER_TITLES } = require('./runPassiveAcceptance.cjs');

const SERVER_DIR = path.resolve(__dirname, '../..');
const MOCHA_BIN = path.join(SERVER_DIR, 'node_modules', 'mocha', 'bin', 'mocha.js');

function main() {
  // 1. Ordinary mode: no loader, no PASSIVE_REQUIRE_TEST_LOADER -> 0 failures
  const ordinary = runPassiveSuite({ withLoader: false, requireLoader: false, approved: null });
  assert.equal(ordinary.status, 0, `Ordinary mode exited ${ordinary.status}`);
  assert.ok(ordinary.parsed, 'Ordinary mode produced Mocha JSON');
  assert.equal(ordinary.parsed.stats.failures, 0, 'Ordinary mode must have 0 failures');
  assert.ok(ordinary.parsed.stats.passes >= 29, `Expected >=29 ordinary passes, got ${ordinary.parsed.stats.passes}`);
  console.log(`[1/4 PASS] Ordinary mode: ${ordinary.parsed.stats.passes} passing, ${ordinary.parsed.stats.failures} failing, ${ordinary.parsed.stats.pending} pending (exit 0)`);

  // 2. Required mode: loader + PASSIVE_REQUIRE_TEST_LOADER=1 -> all required rows execute and pass
  const required = runPassiveSuite({ withLoader: true, requireLoader: true, approved: '1' });
  assert.equal(required.status, 0, `Required mode exited ${required.status}`);
  assert.ok(required.parsed, 'Required mode produced Mocha JSON');
  assert.equal(required.parsed.stats.failures, 0, 'Required mode must have 0 failures');
  const requiredPasses = new Set(required.parsed.passes.map(t => t.title));
  for (const title of REQUIRED_LOADER_TITLES) {
    assert.ok(requiredPasses.has(title), `Required row did not pass: ${title}`);
  }
  assert.ok(required.parsed.stats.passes >= 33, `Expected >=33 required passes, got ${required.parsed.stats.passes}`);
  console.log(`[2/4 PASS] Required mode: ${required.parsed.stats.passes} passing, ${required.parsed.stats.failures} failing, ${required.parsed.stats.pending} pending (exit 0)`);

  // 3. Missing required setup: PASSIVE_REQUIRE_TEST_LOADER=1 without loader -> nonzero exit
  const missingSetup = runPassiveSuite({ withLoader: false, requireLoader: true, approved: '1' });
  assert.notEqual(missingSetup.status, 0, 'Missing required setup must exit nonzero');
  assert.ok(missingSetup.parsed, 'Missing setup run produced Mocha JSON');
  assert.equal(missingSetup.parsed.stats.failures, REQUIRED_LOADER_TITLES.length, 'All 4 loader-dependent rows must fail when required setup is missing');
  console.log(`[3/4 PASS] Missing required setup: ${missingSetup.parsed.stats.failures} failing, exited ${missingSetup.status} (nonzero)`);

  // 4. Real assertion failure still exits nonzero
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'passive-assert-fail-'));
  const failTestFile = path.join(tmpDir, 'realFailure.test.js');
  fs.writeFileSync(
    failTestFile,
    "const assert = require('node:assert/strict');\ndescribe('runner failure check', () => { it('fails on real assertion', () => { assert.equal(1, 2); }); });\n"
  );
  try {
    const failRun = spawnSync(
      process.execPath,
      [MOCHA_BIN, failTestFile, '--require', 'tests/helpers/passiveActivationTestLoader.cjs', '--timeout', '5000', '--exit'],
      { cwd: SERVER_DIR, env: { ...process.env, PASSIVE_REQUIRE_TEST_LOADER: '1' }, encoding: 'utf8' }
    );
    assert.notEqual(failRun.status, 0, 'Real assertion failure must exit nonzero');
    console.log(`[4/4 PASS] Real assertion failure: exited ${failRun.status} (nonzero)`);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  console.log('All 4 passive runner checks passed.');
}

main();
