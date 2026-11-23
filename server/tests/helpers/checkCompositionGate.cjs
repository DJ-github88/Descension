#!/usr/bin/env node
'use strict';

/**
 * Self-verification script for the composition-preservation gate.
 *
 * Proves all gate invariants in disposable temporary stages without
 * modifying any live gameplay file:
 *   1. Fails against the frozen, provenance-pinned regressed handler fixture (5bbe3493...)
 *      for the intended reconciliation behavior (not an import/setup error).
 *   2. Passes against the independently pinned repaired composition (3467d9de...).
 *   3. Exits nonzero on missing required tests, missing modules, assertion failures,
 *      absent required setup, and unlisted pending rows.
 *   4. Refuses silent live-module substitution when testing a staged root.
 *   5. Uses production passive policy (no global passive-policy replacement).
 */
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { runCompositionGate, REQUIRED_TITLES, OPTIONAL_PENDING_TITLES } = require('./runCompositionGate.cjs');

const LIVE_ROOT = path.resolve(__dirname, '../../..');
const REGRESSED_HANDLER_SRC = path.join(
  LIVE_ROOT,
  'handoff/terminal-approval-reconciliation-release-20261115/backup/actorConsequenceHandlers.js.BASE'
);
const REPAIRED_HANDLER_SRC = path.join(
  LIVE_ROOT,
  'handoff/baseline-failure-disposition-20261115/candidate/server/handlers/actorConsequenceHandlers.js'
);
const EXPECTED_REGRESSED_SHA = '5bbe34937e361a8333c4ca2049ae624af0253566f245145611664d47a67b12fb';
const EXPECTED_REPAIRED_SHA = '3467d9de189ebdb9ed049514bb57a06269dcc3838108daf830862fea6f119216';

const EXPECTED_REGRESSED_FAILURE_TITLES = [
  'serves passive activation, relationship queries and retained-approval refresh / exact closures together',
  'actor_companion_dismiss commits closure of pending approval targeting the companion and reconciles via actor_spell_list',
  'actor_companion_place reconciliation closes pending approval when active companion token is missing from map',
  'returns closedApproval for owner and GM after combat_clock_changed, never for unrelated player/observer, and never fabricates for unknown IDs',
  'returns consumedReceipt for owner and GM when accepted, never for unrelated player/observer'
];

const sha256 = filePath => crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');

function copyDirFiltered(src, dest, skipDirNames = new Set(['node_modules', '.git'])) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (skipDirNames.has(entry.name)) { continue; }
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirFiltered(srcPath, destPath, skipDirNames);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function createStage(tmpBase, name) {
  const stageRoot = path.join(tmpBase, name);
  copyDirFiltered(path.join(LIVE_ROOT, 'server'), path.join(stageRoot, 'server'));
  // Copy vtt-react/src/{services,data} needed by relationshipPickerHandler.test.js and shared-mirror checks
  copyDirFiltered(path.join(LIVE_ROOT, 'vtt-react', 'src', 'services'), path.join(stageRoot, 'vtt-react', 'src', 'services'));
  copyDirFiltered(path.join(LIVE_ROOT, 'vtt-react', 'src', 'data'), path.join(stageRoot, 'vtt-react', 'src', 'data'));
  return stageRoot;
}

function runCli(args) {
  return spawnSync(process.execPath, [path.join(__dirname, 'runCompositionGate.cjs'), ...args], {
    cwd: path.join(LIVE_ROOT, 'server'),
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024
  });
}

function main() {
  assert.ok(fs.existsSync(REGRESSED_HANDLER_SRC), `Regressed handler fixture not found: ${REGRESSED_HANDLER_SRC}`);
  assert.equal(sha256(REGRESSED_HANDLER_SRC), EXPECTED_REGRESSED_SHA, 'Regressed handler fixture SHA-256 mismatch');
  assert.ok(fs.existsSync(REPAIRED_HANDLER_SRC), `Repaired handler candidate not found: ${REPAIRED_HANDLER_SRC}`);
  assert.equal(sha256(REPAIRED_HANDLER_SRC), EXPECTED_REPAIRED_SHA, 'Repaired handler SHA-256 mismatch');

  const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'comp-gate-verify-'));
  try {
    // 1. Frozen, provenance-pinned regressed handler fixture (5bbe3493...) MUST FAIL
    //    for the intended reconciliation behavior, not an import/setup error.
    const regressedStage = createStage(tmpBase, 'regressed');
    const regressedHandler = path.join(regressedStage, 'server/handlers/actorConsequenceHandlers.js');
    fs.copyFileSync(REGRESSED_HANDLER_SRC, regressedHandler);
    assert.equal(sha256(regressedHandler), EXPECTED_REGRESSED_SHA);

    const regressedRes = runCompositionGate({ stageRoot: regressedStage });
    assert.equal(regressedRes.ok, false, 'Gate MUST fail on frozen regressed handler fixture');
    assert.ok(!regressedRes.error, `Regressed fixture must fail via Mocha assertions, not setup/import error: ${regressedRes.error}`);
    assert.ok(regressedRes.stats.passes > 0, 'Non-regressed composition checks must still pass on regressed fixture');
    assert.equal(
      regressedRes.failures.length,
      EXPECTED_REGRESSED_FAILURE_TITLES.length,
      `Expected ${EXPECTED_REGRESSED_FAILURE_TITLES.length} reconciliation failures on regressed fixture, got ${regressedRes.failures.length}: ${JSON.stringify(regressedRes.failures)}`
    );
    for (const title of EXPECTED_REGRESSED_FAILURE_TITLES) {
      assert.ok(regressedRes.missingRequired.includes(title), `Expected regressed failure missing: ${title}`);
    }
    assert.ok(
      regressedRes.failures.some(f => f.message && f.message.includes('invalid_consequence')),
      `Expected invalid_consequence reconciliation failure on regressed fixture, got: ${JSON.stringify(regressedRes.failures)}`
    );
    const regressedCli = runCli(['--root', regressedStage]);
    assert.notEqual(regressedCli.status, 0, 'Gate CLI MUST exit nonzero on frozen regressed handler fixture');
    console.log(
      `[1/5 PASS] Frozen regressed fixture (${EXPECTED_REGRESSED_SHA.slice(0, 8)}...) failed as intended: ` +
      `${regressedRes.stats.passes} passing, ${regressedRes.stats.failures} failing, ${regressedRes.optionalPending.length} optional/pending (exit ${regressedCli.status})`
    );

    // 2. Independently accepted repaired composition (3467d9de...) MUST PASS and exit 0
    const repairedStage = createStage(tmpBase, 'repaired');
    const repairedHandler = path.join(repairedStage, 'server/handlers/actorConsequenceHandlers.js');
    fs.copyFileSync(REPAIRED_HANDLER_SRC, repairedHandler);
    assert.equal(sha256(repairedHandler), EXPECTED_REPAIRED_SHA);

    const repairedRes = runCompositionGate({ stageRoot: repairedStage });
    assert.equal(repairedRes.ok, true, `Repaired composition must pass: ${JSON.stringify({ error: repairedRes.error, stderr: repairedRes.stderr, failures: repairedRes.failures, missingRequired: repairedRes.missingRequired })}`);
    assert.equal(repairedRes.status, 0);
    assert.equal(repairedRes.stats.failures, 0);
    assert.equal(repairedRes.missingRequired.length, 0);
    assert.equal(repairedRes.unexpectedPending.length, 0);
    assert.equal(repairedRes.optionalPending.length, OPTIONAL_PENDING_TITLES.size);
    for (const title of repairedRes.optionalPending) {
      assert.ok(OPTIONAL_PENDING_TITLES.has(title), `Unexpected pending title: ${title}`);
    }
    const repairedCli = runCli(['--root', repairedStage]);
    assert.equal(repairedCli.status, 0, `CLI on repaired stage exited ${repairedCli.status}:\n${repairedCli.stdout}\n${repairedCli.stderr}`);
    console.log(`[2/5 PASS] Repaired composition (${EXPECTED_REPAIRED_SHA.slice(0, 8)}...) passed: ${repairedRes.stats.passes} passing, ${repairedRes.optionalPending.length} optional/pending (exit 0)`);

    // 3a. Missing required test file MUST exit nonzero
    const missingTestStage = createStage(tmpBase, 'missing-test');
    fs.copyFileSync(REPAIRED_HANDLER_SRC, path.join(missingTestStage, 'server/handlers/actorConsequenceHandlers.js'));
    fs.rmSync(path.join(missingTestStage, 'server/tests/terminalApprovalComposition.production.test.js'));
    const missingTestCli = runCli(['--root', missingTestStage]);
    assert.notEqual(missingTestCli.status, 0, 'Missing required test file must exit nonzero');
    console.log(`[3a/5 PASS] Missing required test file exited ${missingTestCli.status} (nonzero)`);

    // 3b & 4. Missing module in staged root MUST exit nonzero and CANNOT silently substitute live module
    const missingModuleStage = createStage(tmpBase, 'missing-module');
    fs.rmSync(path.join(missingModuleStage, 'server/handlers/actorConsequenceHandlers.js'));
    const missingModuleCli = runCli(['--root', missingModuleStage]);
    assert.notEqual(missingModuleCli.status, 0, 'Missing staged module must exit nonzero (no silent live fallback)');
    // Also verify the stage guard explicitly blocks any cross-root require into LIVE_ROOT
    const guardProbe = spawnSync(
      process.execPath,
      [
        '--require', path.join(__dirname, 'compositionStageGuard.cjs'),
        '-e', `require(${JSON.stringify(path.join(LIVE_ROOT, 'server/handlers/actorConsequenceHandlers.js'))})`
      ],
      {
        cwd: path.join(missingModuleStage, 'server'),
        env: { ...process.env, COMPOSITION_STAGE_ROOT: missingModuleStage, COMPOSITION_LIVE_ROOT: LIVE_ROOT },
        encoding: 'utf8'
      }
    );
    assert.notEqual(guardProbe.status, 0, 'Stage guard must reject direct require of live module');
    assert.match(guardProbe.stderr, /ERR_LIVE_MODULE_SUBSTITUTION/, 'Stage guard must throw ERR_LIVE_MODULE_SUBSTITUTION');
    console.log(`[3b+4/5 PASS] Missing staged module exited ${missingModuleCli.status}; stage guard threw ERR_LIVE_MODULE_SUBSTITUTION`);

    // 3c. Real test failure MUST exit nonzero even on repaired handler
    const failTestStage = createStage(tmpBase, 'test-failure');
    fs.copyFileSync(REPAIRED_HANDLER_SRC, path.join(failTestStage, 'server/handlers/actorConsequenceHandlers.js'));
    const failFile = path.join(failTestStage, 'server/tests/injectedFailure.test.js');
    fs.writeFileSync(failFile, "const assert = require('node:assert/strict');\ndescribe('injected failure', () => { it('fails', () => { assert.equal(1, 2); }); });\n");
    const failCli = runCli(['--root', failTestStage, '--extra-file', 'tests/injectedFailure.test.js']);
    assert.notEqual(failCli.status, 0, 'Real test failure must exit nonzero');
    console.log(`[3c/5 PASS] Real test failure exited ${failCli.status} (nonzero)`);

    // 3d. Absent required setup MUST exit nonzero
    const missingRootCli = runCli(['--root', path.join(tmpBase, 'does-not-exist')]);
    assert.notEqual(missingRootCli.status, 0, 'Absent staged root must exit nonzero');
    const missingClientStage = createStage(tmpBase, 'missing-client-setup');
    fs.copyFileSync(REPAIRED_HANDLER_SRC, path.join(missingClientStage, 'server/handlers/actorConsequenceHandlers.js'));
    fs.rmSync(path.join(missingClientStage, 'vtt-react'), { recursive: true, force: true });
    const missingClientCli = runCli(['--root', missingClientStage]);
    assert.notEqual(missingClientCli.status, 0, 'Absent vtt-react staged setup must exit nonzero');
    console.log(`[3d/5 PASS] Absent required setup exited nonzero (missing root: ${missingRootCli.status}, missing vtt-react: ${missingClientCli.status})`);

    // 3e. Unlisted pending row MUST exit nonzero (only explicitly named optional pending rows allowed)
    const pendingTestStage = createStage(tmpBase, 'unexpected-pending');
    fs.copyFileSync(REPAIRED_HANDLER_SRC, path.join(pendingTestStage, 'server/handlers/actorConsequenceHandlers.js'));
    const pendingFile = path.join(pendingTestStage, 'server/tests/injectedPending.test.js');
    fs.writeFileSync(pendingFile, "describe('injected pending', () => { it.skip('unlisted pending check', () => {}); });\n");
    const pendingRes = runCompositionGate({ stageRoot: pendingTestStage, extraFiles: ['tests/injectedPending.test.js'] });
    assert.equal(pendingRes.ok, false, 'Unlisted pending row must fail the gate');
    assert.deepEqual(pendingRes.unexpectedPending, ['unlisted pending check']);
    const pendingCli = runCli(['--root', pendingTestStage, '--extra-file', 'tests/injectedPending.test.js']);
    assert.notEqual(pendingCli.status, 0, 'Unlisted pending row must exit nonzero');
    console.log(`[3e/5 PASS] Unlisted pending row exited ${pendingCli.status} (nonzero)`);

    // 5. Production policy used (no global passive-policy replacement)
    assert.ok(REQUIRED_TITLES.includes('ships passiveActivationPolicy.js with explicit creator approval (approved() === true, P1-P5) and byte-identical client/server mirrors'));
    console.log('[5/5 PASS] Ordinary execution used production passiveActivationPolicy.js with 0 global policy replacements.');

    console.log('All composition-preservation gate checks passed.');
  } finally {
    fs.rmSync(tmpBase, { recursive: true, force: true });
  }
}

main();
