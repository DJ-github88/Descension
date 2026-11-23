#!/usr/bin/env node
'use strict';

/**
 * Dedicated passive acceptance & policy-swap runner.
 *
 * Executes all passive production, control, and acceptance suites with the
 * test-only policy-swap loader (`passiveActivationTestLoader.cjs`) and
 * `PASSIVE_REQUIRE_TEST_LOADER=1`, verifying that every required row
 * actually executed and passed (a missing loader must exit nonzero).
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const SERVER_DIR = path.resolve(__dirname, '../..');
const MOCHA_BIN = path.join(SERVER_DIR, 'node_modules', 'mocha', 'bin', 'mocha.js');
const TEST_FILES = [
  'tests/firstPlayablePassive.production.test.js',
  'tests/helpers/heightenedSenses.control.test.js',
  'tests/helpers/heightenedSenses.acceptance.test.js'
];

const REQUIRED_LOADER_TITLES = [
  'refuses actor_passive_activate with passive_activation_unapproved and applies +0 initiative when policy is unapproved',
  'supports all three P4 stacking modes in isolated test policy',
  'CONTROL: the real Heightened Senses record can be stored on the sheet, yet storage alone changes no initiative',
  'CONTROL: combat start does not read an active passive because no activation exists; the server has no passive reader'
];

function runPassiveSuite(options = {}) {
  const {
    withLoader = true,
    requireLoader = true,
    approved = '1',
    extraFiles = []
  } = options;

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'passive-runner-'));
  const jsonOut = path.join(tmpDir, 'mocha-results.json');
  const args = [MOCHA_BIN, ...TEST_FILES, ...extraFiles];
  if (withLoader) {
    args.push('--require', 'tests/helpers/passiveActivationTestLoader.cjs');
  }
  args.push('--timeout', '10000', '--exit', '--reporter', 'json', '--reporter-option', `output=${jsonOut}`);

  const env = { ...process.env };
  if (approved !== undefined && approved !== null) {
    env.PASSIVE_APPROVED = String(approved);
  } else {
    delete env.PASSIVE_APPROVED;
  }
  if (requireLoader) {
    env.PASSIVE_REQUIRE_TEST_LOADER = '1';
  } else {
    delete env.PASSIVE_REQUIRE_TEST_LOADER;
  }

  const res = spawnSync(process.execPath, args, {
    cwd: SERVER_DIR,
    env,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024
  });

  let parsed = null;
  try {
    parsed = JSON.parse(fs.readFileSync(jsonOut, 'utf8'));
  } catch (_) {
    parsed = null;
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  return { status: res.status, stdout: res.stdout, stderr: res.stderr, parsed };
}

function main() {
  const withoutLoader = process.argv.includes('--without-loader');
  const result = runPassiveSuite({
    withLoader: !withoutLoader,
    requireLoader: true,
    approved: '1'
  });

  if (!result.parsed) {
    console.error('Passive acceptance runner failed: unreadable Mocha JSON output.');
    if (result.stderr) console.error(result.stderr);
    process.exit(result.status || 1);
  }

  const { stats, passes, failures, pending } = result.parsed;
  const passedTitles = new Set((passes || []).map(t => t.title));
  const missingRequired = REQUIRED_LOADER_TITLES.filter(title => !passedTitles.has(title));

  console.log(`Passive acceptance run: ${stats.passes} passing, ${stats.failures} failing, ${stats.pending} pending.`);
  if (failures && failures.length > 0) {
    for (const f of failures) {
      console.error(`FAIL: ${f.fullTitle}\n  ${f.err && f.err.message}`);
    }
  }
  if (missingRequired.length > 0) {
    console.error('Missing required loader-dependent passes:');
    for (const title of missingRequired) {
      console.error(`  - ${title}`);
    }
  }

  if (result.status !== 0 || stats.failures > 0 || missingRequired.length > 0) {
    process.exit(result.status || 1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runPassiveSuite, REQUIRED_LOADER_TITLES, TEST_FILES };
