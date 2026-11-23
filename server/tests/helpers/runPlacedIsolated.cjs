#!/usr/bin/env node
'use strict';

/**
 * Isolated placed-effect verification runner.
 *
 * Preloads `placedEffectTestLoader.cjs` with `PLACED_REQUIRE_TEST_LOADER=1` so
 * shipped production code stays fail-closed while the test configuration exercises
 * explicit armed trigger, payment, visibility, and expiry rules.
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const SERVER_DIR = path.resolve(__dirname, '../..');
const MOCHA_BIN = path.join(SERVER_DIR, 'node_modules', 'mocha', 'bin', 'mocha.js');
const TEST_FILES = [
  'tests/placedEffectFoundation.production.test.js',
  'tests/placedEffectArmed.isolated.test.js'
];

const REQUIRED_TITLES = [
  'fires once when an enemy creature moves from outside to inside and consumes the placement atomically',
  'does not fire on room checkpoint load, already-inside moves, exits, zero displacement, drag frames, teleport, or forced movement',
  'does not trigger again when the same actionId movement is replayed',
  'does not trigger after removal, on other maps, after map deletion, or after grid scale changes',
  'allows Inscription and Totem families to reuse placement with public non-consuming ally rules without inheriting single-use trap semantics'
];

function main() {
  const withoutLoader = process.argv.includes('--without-loader');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'placed-runner-'));
  const jsonOut = path.join(tmpDir, 'mocha-results.json');
  const args = [MOCHA_BIN, ...TEST_FILES];
  if (!withoutLoader) {
    args.push('--require', 'tests/helpers/placedEffectTestLoader.cjs');
  }
  args.push('--timeout', '15000', '--exit', '--reporter', 'json', '--reporter-option', `output=${jsonOut}`);

  const env = { ...process.env, PLACED_REQUIRE_TEST_LOADER: '1' };
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

  if (!parsed) {
    console.error('Placed-effect isolated runner failed: unreadable Mocha JSON output.');
    if (res.stderr) console.error(res.stderr);
    process.exit(res.status || 1);
  }

  const { stats, passes, failures } = parsed;
  const passedTitles = new Set((passes || []).map(t => t.title));
  const missingRequired = REQUIRED_TITLES.filter(title => !passedTitles.has(title));

  console.log(`Placed-effect isolated run: ${stats.passes} passing, ${stats.failures} failing, ${stats.pending} pending.`);
  if (failures && failures.length > 0) {
    for (const f of failures) {
      console.error(`FAIL: ${f.fullTitle}\n  ${f.err && f.err.message}`);
    }
  }
  if (missingRequired.length > 0) {
    console.error('Missing required isolated test passes:');
    for (const title of missingRequired) {
      console.error(`  - ${title}`);
    }
  }

  if (res.status !== 0 || stats.failures > 0 || stats.pending > 0 || missingRequired.length > 0) {
    process.exit(res.status || 1);
  }
}

if (require.main === module) {
  main();
}
