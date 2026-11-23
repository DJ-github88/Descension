#!/usr/bin/env node
'use strict';

/**
 * Runnable composition-preservation gate.
 *
 * Executes a bounded set of real-handler Mocha checks against a supplied
 * staged root (or the live repo root if --root is omitted), using the
 * production passive policy (no global passive-policy replacement) and
 * enforcing strict stage isolation so missing staged modules cannot silently
 * fall back to live modules.
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const LIVE_ROOT = path.resolve(__dirname, '../../..');
const LIVE_SERVER_DIR = path.join(LIVE_ROOT, 'server');
const STAGE_GUARD_PATH = path.join(__dirname, 'compositionStageGuard.cjs');

const BOUNDED_TEST_FILES = [
  'tests/terminalApprovalComposition.production.test.js',
  'tests/companionReconciliationComposition.production.test.js',
  'tests/spellApprovalListReconciliation.production.test.js',
  'tests/relationshipPickerHandler.test.js',
  'tests/firstPlayablePassive.production.test.js'
];

const REQUIRED_TITLES = [
  'serves passive activation, relationship queries and retained-approval refresh / exact closures together',
  'actor_companion_dismiss commits closure of pending approval targeting the companion and reconciles via actor_spell_list',
  'actor_companion_place reconciliation closes pending approval when active companion token is missing from map',
  'returns closedApproval for owner and GM after combat_clock_changed, never for unrelated player/observer, and never fabricates for unknown IDs',
  'returns consumedReceipt for owner and GM when accepted, never for unrelated player/observer',
  'scopes actor_relationship_list to authorized source and visible target without hidden-token discovery or private fields',
  'forged client actor_spell_approve still fails at the server binder on relationship mismatch',
  'ships passiveActivationPolicy.js with explicit creator approval (approved() === true, P1-P5) and byte-identical client/server mirrors',
  'represents Heightened Senses with exact identity, Perception NOVICE eligibility, and provenance while refusing unrelated passives',
  'refuses non-GM activation/revocation, creatures, and secondary attachments'
];

const OPTIONAL_PENDING_TITLES = new Set([
  'refuses actor_passive_activate with passive_activation_unapproved and applies +0 initiative when policy is unapproved',
  'supports all three P4 stacking modes in isolated test policy'
]);

function parseArgs(argv) {
  let root = process.env.COMPOSITION_STAGE_ROOT || null;
  let extraFiles = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--root' || arg.startsWith('--root=')) {
      const val = arg === '--root' ? argv[++i] : arg.slice('--root='.length);
      if (!val || val.startsWith('--')) {
        console.error('COMPOSITION GATE FAILED: --root requires a non-empty directory path.');
        process.exit(1);
      }
      root = val;
    } else if (arg === '--extra-file' || arg.startsWith('--extra-file=')) {
      const val = arg === '--extra-file' ? argv[++i] : arg.slice('--extra-file='.length);
      if (!val || val.startsWith('--')) {
        console.error('COMPOSITION GATE FAILED: --extra-file requires a non-empty path.');
        process.exit(1);
      }
      extraFiles.push(val);
    }
  }
  return {
    stageRoot: path.resolve(root || LIVE_ROOT),
    extraFiles
  };
}

function runCompositionGate(options = {}) {
  const stageRoot = path.resolve(options.stageRoot || LIVE_ROOT);
  const stageServerDir = path.join(stageRoot, 'server');
  const testFiles = options.testFiles || [...BOUNDED_TEST_FILES, ...(options.extraFiles || [])];
  const requiredTitles = options.requiredTitles || REQUIRED_TITLES;

  if (!fs.existsSync(stageRoot) || !fs.statSync(stageRoot).isDirectory()) {
    return { ok: false, status: 1, error: `Staged root does not exist or is not a directory: ${stageRoot}` };
  }
  if (!fs.existsSync(stageServerDir) || !fs.statSync(stageServerDir).isDirectory()) {
    return { ok: false, status: 1, error: `Staged server directory missing: ${stageServerDir}` };
  }

  const missingFiles = [];
  for (const rel of testFiles) {
    const full = path.join(stageServerDir, rel);
    if (!fs.existsSync(full)) {
      missingFiles.push(rel);
    }
  }
  if (missingFiles.length > 0) {
    return {
      ok: false,
      status: 1,
      error: `Missing required test file(s) in staged root (${stageServerDir}): ${missingFiles.join(', ')}`,
      missingFiles
    };
  }

  const stageMocha = path.join(stageServerDir, 'node_modules', 'mocha', 'bin', 'mocha.js');
  const liveMocha = path.join(LIVE_SERVER_DIR, 'node_modules', 'mocha', 'bin', 'mocha.js');
  const mochaBin = fs.existsSync(stageMocha) ? stageMocha : liveMocha;
  if (!fs.existsSync(mochaBin)) {
    return { ok: false, status: 1, error: `Mocha binary not found at ${mochaBin}` };
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'composition-gate-'));
  const jsonOut = path.join(tmpDir, 'mocha-results.json');
  const isStaged = stageRoot.toLowerCase() !== LIVE_ROOT.toLowerCase();

  const args = [mochaBin, ...testFiles];
  if (isStaged) {
    args.push('--require', STAGE_GUARD_PATH);
  }
  args.push('--timeout', '10000', '--exit', '--reporter', 'json', '--reporter-option', `output=${jsonOut}`);

  const env = { ...process.env };
  // Ordinary execution uses production policy; never preload passiveActivationTestLoader.
  delete env.PASSIVE_APPROVED;
  delete env.PASSIVE_REQUIRE_TEST_LOADER;

  if (isStaged) {
    env.COMPOSITION_STAGE_ROOT = stageRoot;
    env.COMPOSITION_LIVE_ROOT = LIVE_ROOT;
    const stageNodeModules = path.join(stageServerDir, 'node_modules');
    const liveNodeModules = path.join(LIVE_SERVER_DIR, 'node_modules');
    if (!fs.existsSync(stageNodeModules) && fs.existsSync(liveNodeModules)) {
      env.NODE_PATH = env.NODE_PATH ? `${liveNodeModules}${path.delimiter}${env.NODE_PATH}` : liveNodeModules;
    }
  } else {
    delete env.COMPOSITION_STAGE_ROOT;
    delete env.COMPOSITION_LIVE_ROOT;
  }

  const res = spawnSync(process.execPath, args, {
    cwd: stageServerDir,
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
    return {
      ok: false,
      status: res.status || 1,
      stageRoot,
      isStaged,
      error: 'Composition gate failed before producing Mocha JSON output.',
      stdout: res.stdout,
      stderr: res.stderr
    };
  }

  const passes = parsed.passes || [];
  const failures = parsed.failures || [];
  const pending = parsed.pending || [];
  const passedTitles = new Set(passes.map(t => t.title));

  const missingRequired = requiredTitles.filter(title => !passedTitles.has(title));
  const unexpectedPending = pending.filter(t => !OPTIONAL_PENDING_TITLES.has(t.title)).map(t => t.title);
  const optionalPending = pending.filter(t => OPTIONAL_PENDING_TITLES.has(t.title)).map(t => t.title);

  const ok = (
    res.status === 0 &&
    parsed.stats.failures === 0 &&
    parsed.stats.passes > 0 &&
    missingRequired.length === 0 &&
    unexpectedPending.length === 0
  );

  return {
    ok,
    status: ok ? 0 : (res.status || 1),
    stageRoot,
    isStaged,
    stats: parsed.stats,
    failures: failures.map(f => ({ title: f.fullTitle || f.title, message: f.err && f.err.message })),
    missingRequired,
    optionalPending,
    unexpectedPending,
    stdout: res.stdout,
    stderr: res.stderr
  };
}

function main() {
  const { stageRoot, extraFiles } = parseArgs(process.argv.slice(2));
  const result = runCompositionGate({ stageRoot, extraFiles });

  if (result.error) {
    console.error(`COMPOSITION GATE FAILED (${stageRoot}): ${result.error}`);
    if (result.stderr) console.error(result.stderr.trim());
    process.exit(result.status || 1);
  }

  const { stats, isStaged, failures, missingRequired, optionalPending, unexpectedPending } = result;
  console.log(
    `Composition preservation gate (${isStaged ? `staged: ${result.stageRoot}` : `live: ${result.stageRoot}`}): ` +
    `${stats.passes} passing, ${stats.failures} failing, ${stats.pending} optional/pending.`
  );
  if (optionalPending.length > 0) {
    console.log(`Optional/pending (loader-dependent, ordinary production-policy mode): ${optionalPending.length}`);
    for (const title of optionalPending) {
      console.log(`  [pending] ${title}`);
    }
  }
  if (failures.length > 0) {
    console.error('Failing checks:');
    for (const f of failures) {
      console.error(`  FAIL: ${f.title}\n    ${f.message}`);
    }
  }
  if (missingRequired.length > 0) {
    console.error('Missing required passing checks:');
    for (const title of missingRequired) {
      console.error(`  - ${title}`);
    }
  }
  if (unexpectedPending.length > 0) {
    console.error('Unexpected pending checks (not in optional/pending allowlist):');
    for (const title of unexpectedPending) {
      console.error(`  - ${title}`);
    }
  }

  if (!result.ok) {
    process.exit(result.status || 1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  runCompositionGate,
  BOUNDED_TEST_FILES,
  REQUIRED_TITLES,
  OPTIONAL_PENDING_TITLES
};
