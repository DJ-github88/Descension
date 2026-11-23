'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');

const {
  PairPreflightError,
  normalizeCapabilities,
  verifyPairPreflight
} = require('./preflight-pair.cjs');
const { extractWitnessOutcome } = require('./witness-launcher.cjs');
const { main: runCli } = require('./verify-release.cjs');

function makeTempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'release-verify-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function write(filePath, content = 'ok') {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function sha256(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function createFakeAppBuild(rootDir, {
  review = true,
  channeledFeed = false,
  diceRecast = true,
  sameTurn = false
} = {}) {
  const buildDir = path.join(rootDir, 'build-out');
  const mainJsBody = [
    'console.log("app");',
    review ? 'const x = "authored_review_submit GM review requests GM review for ";' : '',
    channeledFeed ? 'const y = "shared-periodic-tick:v1 all scheduled ticks completed";' : '',
    diceRecast ? 'const z = "Approve displayed scores again (retained faces) lastCoinFlip";' : 'const z = "Start new cast";',
    sameTurn ? 'const p = "authored-target-current-end expires at the end of that same turn";' : '',
    'const passive = "data-passive-activation-panel actor_passive_list";'
  ].join('\n');
  const mainCssBody = 'body { color: #000; }';
  const indexHtmlBody = '<html><body><div id="root"></div></body></html>';

  write(path.join(buildDir, 'index.html'), indexHtmlBody);
  write(path.join(buildDir, 'static/js/main.test.js'), mainJsBody);
  write(path.join(buildDir, 'static/css/main.test.css'), mainCssBody);
  write(path.join(buildDir, 'data/creatures.json'), '[{"id":"grimmstalk","stats":{"maxHp":40}}]');
  const manifestBody = JSON.stringify({
    files: {
      'main.js': '/static/js/main.test.js',
      'main.css': '/static/css/main.test.css'
    }
  });
  write(path.join(buildDir, 'asset-manifest.json'), manifestBody);

  return {
    buildDir,
    hashes: {
      indexHtml: sha256(indexHtmlBody),
      assetManifest: sha256(manifestBody),
      mainJs: sha256(mainJsBody),
      mainCss: sha256(mainCssBody)
    }
  };
}

function createFakeServerStage(rootDir, {
  review = true,
  channeled = true,
  sameTurn = false,
  withClientSrc = false,
  clientFeedCompleted = false,
  clientReapprove = true,
  clientSameTurn = false,
  driftShared = false
} = {}) {
  const stageRoot = path.join(rootDir, 'stage');
  const required = [
    'services/installedAuthoredAbilities.js',
    'services/actorConsequences.js',
    'services/actorRelationships.js',
    'services/spellPayments.js',
    'services/roomCheckpoint.js',
    'services/actorProjection.js',
    'services/passiveActivation.js',
    'services/passiveTurnTrigger.js',
    'services/passiveMovementTrigger.js',
    'tests/helpers/productionStackServer.js',
    'shared/services/authoredEffect.js',
    'shared/services/sharedConditionProfile.js'
  ];
  for (const rel of required) {
    write(path.join(stageRoot, 'server', rel), `// ${rel}`);
  }
  write(
    path.join(stageRoot, 'server/shared/services/sharedEffectTiming.js'),
    sameTurn ? '// authored-target-current-end' : '// standard timing'
  );
  write(
    path.join(stageRoot, 'server/shared/services/authoredAbility.js'),
    '// shared authoredAbility\n'
  );
  write(
    path.join(stageRoot, 'server/services/installedDefinitionRegistry.js'),
    channeled ? '// authored-channeled:v1' : '// immediate-only'
  );
  write(
    path.join(stageRoot, 'server/services/sharedEffectLifecycle.js'),
    [
      channeled ? "// authored-caster-start-count 'completed'" : '// no-channel',
      sameTurn ? '// authored-target-current-end' : ''
    ].join('\n')
  );
  write(
    path.join(stageRoot, 'server/handlers/actorConsequenceHandlers.js'),
    review ? '// authored_review_submit authored_review_decide' : '// no-review-handlers'
  );
  if (review) {
    write(path.join(stageRoot, 'server/services/authoredReviewRequests.js'), '// review service');
  }

  if (withClientSrc) {
    write(
      path.join(stageRoot, 'vtt-react/src/services/authoredAbility.js'),
      driftShared ? '// DRIFTED authoredAbility\n' : '// shared authoredAbility\n'
    );
    if (review) {
      write(path.join(stageRoot, 'vtt-react/src/services/authoredReviewService.js'), '// client review service');
    }
    write(
      path.join(stageRoot, 'vtt-react/src/services/acceptedResultFeed.js'),
      clientFeedCompleted ? "// 'all scheduled ticks completed'" : '// basic feed'
    );
    write(
      path.join(stageRoot, 'vtt-react/src/services/sharedEffectTiming.js'),
      clientSameTurn ? '// authored-target-current-end' : '// standard timing'
    );
    write(
      path.join(stageRoot, 'vtt-react/src/components/hud/SpellConsequencePanel.jsx'),
      clientReapprove ? '// Approve displayed scores again (retained faces)' : '// Start new cast'
    );
  }

  return stageRoot;
}

test('normalizes capability aliases and expands all', () => {
  assert.deepEqual(normalizeCapabilities([]), ['player-journey']);
  assert.deepEqual(normalizeCapabilities(['dice/recast,channels']), ['dice-recast', 'channels']);
  assert.deepEqual(normalizeCapabilities(['all']), ['player-journey', 'dice-recast', 'channels', 'passives']);
  assert.throws(() => normalizeCapabilities(['unknown-cap']), PairPreflightError);
});

test('stops at preflight when required files are missing and preserves ENOENT', async (t) => {
  const tmp = makeTempDir(t);
  const { buildDir } = createFakeAppBuild(tmp);
  const stageRoot = createFakeServerStage(tmp);
  fs.rmSync(path.join(buildDir, 'index.html'));

  await assert.rejects(
    verifyPairPreflight({
      app: buildDir,
      server: stageRoot,
      output: path.join(tmp, 'out'),
      capabilities: ['player-journey']
    }),
    (err) => {
      assert.ok(err instanceof PairPreflightError);
      assert.equal(err.check, 'build-index');
      assert.equal(err.category, 'ENVIRONMENT_FAILURE');
      assert.equal(err.cause.code, 'ENOENT');
      return true;
    }
  );
});

test('stops at preflight when server stage is missing required files', async (t) => {
  const tmp = makeTempDir(t);
  const { buildDir } = createFakeAppBuild(tmp);
  const stageRoot = createFakeServerStage(tmp);
  fs.rmSync(path.join(stageRoot, 'server/services/installedAuthoredAbilities.js'));

  await assert.rejects(
    verifyPairPreflight({
      app: buildDir,
      server: stageRoot,
      output: path.join(tmp, 'out'),
      capabilities: ['player-journey']
    }),
    (err) => {
      assert.ok(err instanceof PairPreflightError);
      assert.equal(err.check, 'server-stage-files');
      assert.equal(err.category, 'ENVIRONMENT_FAILURE');
      return true;
    }
  );
});

test('stops before testing when app and server review protocols mismatch', async (t) => {
  const tmp = makeTempDir(t);
  const { buildDir } = createFakeAppBuild(tmp, { review: true });
  const stageRoot = createFakeServerStage(tmp, { review: false });

  await assert.rejects(
    verifyPairPreflight({
      app: buildDir,
      server: stageRoot,
      output: path.join(tmp, 'out'),
      capabilities: ['player-journey']
    }),
    (err) => {
      assert.ok(err instanceof PairPreflightError);
      assert.equal(err.check, 'pair-identity-mismatch');
      assert.equal(err.category, 'ENVIRONMENT_FAILURE');
      assert.match(err.detail, /player-review protocol mismatch/i);
      return true;
    }
  );
});

test('stops before testing when stage client source or shared sync mismatches app build', async (t) => {
  const tmp = makeTempDir(t);
  const { buildDir } = createFakeAppBuild(tmp, { review: true, channeledFeed: true });
  const stageRoot = createFakeServerStage(tmp, {
    review: true,
    withClientSrc: true,
    clientFeedCompleted: false
  });

  await assert.rejects(
    verifyPairPreflight({
      app: buildDir,
      server: stageRoot,
      output: path.join(tmp, 'out'),
      capabilities: ['channels']
    }),
    (err) => {
      assert.ok(err instanceof PairPreflightError);
      assert.equal(err.check, 'pair-identity-mismatch');
      assert.match(err.detail, /acceptedResultFeed\.js/);
      return true;
    }
  );

  const tmp2 = makeTempDir(t);
  const app2 = createFakeAppBuild(tmp2, { review: true, channeledFeed: true });
  const stage2 = createFakeServerStage(tmp2, {
    review: true,
    withClientSrc: true,
    clientFeedCompleted: true,
    driftShared: true
  });

  await assert.rejects(
    verifyPairPreflight({
      app: app2.buildDir,
      server: stage2,
      output: path.join(tmp2, 'out'),
      capabilities: ['channels']
    }),
    (err) => {
      assert.ok(err instanceof PairPreflightError);
      assert.equal(err.check, 'shared-modules-sync');
      return true;
    }
  );
});

test('stops before testing when packet FINAL.sha256 server hash differs from server stage', async (t) => {
  const tmp = makeTempDir(t);
  const { buildDir } = createFakeAppBuild(tmp, { review: true, channeledFeed: true });
  const stageRoot = createFakeServerStage(tmp, { review: true, channeled: true });

  write(
    path.join(tmp, 'FINAL.sha256'),
    `${'0'.repeat(64)}  server/handlers/actorConsequenceHandlers.js\n`
  );

  await assert.rejects(
    verifyPairPreflight({
      app: buildDir,
      server: stageRoot,
      output: path.join(tmp, 'out'),
      capabilities: ['channels']
    }),
    (err) => {
      assert.ok(err instanceof PairPreflightError);
      assert.equal(err.check, 'pair-identity-mismatch');
      assert.match(err.detail, /FINAL\.sha256/);
      return true;
    }
  );
});

test('distinguishes GAMEPLAY_FAILURE from ENVIRONMENT_FAILURE in witness outcomes', (t) => {
  const tmp = makeTempDir(t);
  const gameplayResultPath = path.join(tmp, 'gameplay-result.json');
  write(gameplayResultPath, JSON.stringify({
    passed: false,
    firstBrokenStep: {
      id: 'step_01_player_a_open_wizard',
      index: 1,
      actor: 'Player A',
      description: 'Open Spell Wizard',
      error: 'Spell Wizard tab is hidden'
    },
    steps: [
      { id: 'step_01_player_a_open_wizard', index: 1, actor: 'Player A', description: 'Open Spell Wizard', passed: false, error: 'Spell Wizard tab is hidden' }
    ]
  }));

  const gameplayOutcome = extractWitnessOutcome(
    { id: 'player-journey-17step', capability: 'player-journey', title: '17-step', scriptPath: 'x', evidenceDir: tmp, resultPath: gameplayResultPath },
    { exitCode: 1, timedOut: false, durationMs: 1200, stdout: '', stderr: 'AssertionError', stdoutLogPath: 'out.log', stderrLogPath: 'err.log' }
  );
  assert.equal(gameplayOutcome.passed, false);
  assert.equal(gameplayOutcome.failureCategory, 'GAMEPLAY_FAILURE');
  assert.equal(gameplayOutcome.firstPlayerVisibleFailure.stepId, 'step_01_player_a_open_wizard');
  assert.equal(gameplayOutcome.firstPlayerVisibleFailure.actor, 'Player A');
  assert.equal(gameplayOutcome.environmentError, null);

  const envOutcome = extractWitnessOutcome(
    { id: 'dice-recast-parity', capability: 'dice-recast', title: 'Dice', scriptPath: 'x', evidenceDir: tmp, resultPath: path.join(tmp, 'missing-result.json') },
    { exitCode: 1, timedOut: false, durationMs: 50, stdout: '', stderr: "Error: Cannot find module 'playwright'", stdoutLogPath: 'out.log', stderrLogPath: 'err.log' }
  );
  assert.equal(envOutcome.passed, false);
  assert.equal(envOutcome.failureCategory, 'ENVIRONMENT_FAILURE');
  assert.equal(envOutcome.firstPlayerVisibleFailure, null);
  assert.match(envOutcome.environmentError, /Cannot find module/);

  const progressPath = path.join(tmp, 'progress.json');
  write(progressPath, JSON.stringify({
    steps: [
      { id: 'step_01_a', index: 1, passed: true },
      { id: 'step_02_b', index: 2, passed: true }
    ]
  }));
  const timeoutOutcome = extractWitnessOutcome(
    { id: 'player-journey-17step', capability: 'player-journey', title: '17-step', scriptPath: 'x', evidenceDir: tmp, resultPath: path.join(tmp, 'missing-result.json'), progressPath },
    { exitCode: 1, timedOut: true, timeoutMs: 1500000, durationMs: 1500010, stdout: '', stderr: '[console.error] acct-gm Socket connection error: I: xhr poll error\n', stdoutLogPath: 'out.log', stderrLogPath: 'err.log' }
  );
  assert.equal(timeoutOutcome.passed, false);
  assert.equal(timeoutOutcome.failureCategory, 'ENVIRONMENT_FAILURE');
  assert.equal(timeoutOutcome.firstPlayerVisibleFailure, null);
  assert.match(timeoutOutcome.environmentError, /^Witness timed out after 1500000ms \(2\/2 checks\/steps completed before timeout\)$/);

  const objStepsResult = path.join(tmp, 'channels-result.json');
  write(objStepsResult, JSON.stringify({
    passed: true,
    steps: {
      authorAndAdmit: { summaryText: 'closed' },
      reconnectBetweenTicks: { receiptsUnchanged: true }
    }
  }));
  const objOutcome = extractWitnessOutcome(
    { id: 'channels-ally-healing', capability: 'channels', title: 'Channels', scriptPath: 'x', evidenceDir: tmp, resultPath: objStepsResult },
    { exitCode: 0, timedOut: false, durationMs: 500, stdout: '', stderr: '', stdoutLogPath: 'out.log', stderrLogPath: 'err.log' }
  );
  assert.equal(objOutcome.passed, true);
  assert.equal(objOutcome.checks.length, 2);
  assert.deepEqual(objOutcome.checks.map((c) => c.id), ['authorAndAdmit', 'reconnectBetweenTicks']);
});

test('isolation-preload redirects extensionless workspace server requires to staged serverDir', (t) => {
  const { execFileSync } = require('node:child_process');
  const tmp = makeTempDir(t);
  const stageRoot = path.join(tmp, 'stage');
  const stagedMod = path.join(stageRoot, 'server', 'tests', 'helpers', 'productionStackServer.js');
  write(stagedMod, 'module.exports = { marker: "FROM_STAGED_SERVER" };\n');

  const preloadPath = path.join(__dirname, 'isolation-preload.cjs');
  const wsTarget = path.resolve(__dirname, '../../..', 'server', 'tests', 'helpers', 'productionStackServer');
  const stdout = execFileSync(
    process.execPath,
    ['--require', preloadPath, '-e', `process.stdout.write(require(${JSON.stringify(wsTarget)}).marker)`],
    {
      env: {
        ...process.env,
        RELEASE_VERIFY_STAGE_ROOT: stageRoot,
        RELEASE_VERIFY_SERVER_DIR: path.join(stageRoot, 'server'),
        RELEASE_VERIFY_REDIRECT_WORKSPACE_SRC: '1',
        RELEASE_VERIFY_FORCE_EPHEMERAL_PORTS: '0'
      },
      encoding: 'utf8'
    }
  );
  assert.equal(stdout, 'FROM_STAGED_SERVER');
});

test('CLI writes report.json, REPORT.md, and preserves preflight.log on both mismatch and preflight-only pass', async (t) => {
  const tmp = makeTempDir(t);
  const { buildDir } = createFakeAppBuild(tmp, { review: true, channeledFeed: true });
  const goodStage = createFakeServerStage(path.join(tmp, 'good'), {
    review: true,
    channeled: true,
    withClientSrc: true,
    clientFeedCompleted: true,
    clientReapprove: true
  });
  const badStage = createFakeServerStage(path.join(tmp, 'bad'), { review: false });

  const passOut = path.join(tmp, 'pass-out');
  const passCode = await runCli([
    '--app', buildDir,
    '--server', goodStage,
    '--capability', 'player-journey,dice-recast,channels',
    '--output', passOut,
    '--label', 'unit-pass',
    '--preflight-only'
  ]);
  assert.equal(passCode, 0);
  const passReport = JSON.parse(fs.readFileSync(path.join(passOut, 'report.json'), 'utf8'));
  assert.equal(passReport.verdict, 'PASS');
  assert.equal(passReport.failureCategory, 'NONE');
  assert.equal(passReport.pairedBuildIdentity.matched, true);
  assert.ok(fs.existsSync(path.join(passOut, 'REPORT.md')));
  assert.ok(fs.existsSync(path.join(passOut, 'logs/preflight.log')));

  const failOut = path.join(tmp, 'fail-out');
  const failCode = await runCli([
    '--app', buildDir,
    '--server', badStage,
    '--capability', 'player-journey',
    '--output', failOut,
    '--label', 'unit-mismatch'
  ]);
  assert.equal(failCode, 1);
  const failReport = JSON.parse(fs.readFileSync(path.join(failOut, 'report.json'), 'utf8'));
  assert.equal(failReport.verdict, 'FAIL');
  assert.equal(failReport.failureCategory, 'ENVIRONMENT_FAILURE');
  assert.equal(failReport.pairedBuildIdentity.matched, false);
  assert.equal(failReport.firstPlayerVisibleFailure, null);
  assert.equal(failReport.checksRan.witnesses.length, 0);
  assert.match(fs.readFileSync(path.join(failOut, 'logs/preflight.log'), 'utf8'), /PREFLIGHT FAIL/);
});

test('live workspace sanity: passes preflight on channeled candidate pair and rejects mismatched live server', async (t) => {
  const candidateApp = 'D:\\VTT\\handoff\\channeled-ally-healing-isolated-20261122\\build-out';
  const candidateStage = 'D:\\AppData\\Temp\\opencode\\channeled-ally-healing-isolated-20261122\\stage';
  const liveRoot = 'D:\\VTT';
  if (!fs.existsSync(candidateApp) || !fs.existsSync(candidateStage)) {
    t.skip('Isolated candidate build/stage not present on disk');
    return;
  }

  const tmp = makeTempDir(t);
  const okRes = await verifyPairPreflight({
    app: candidateApp,
    server: candidateStage,
    output: path.join(tmp, 'ok'),
    capabilities: ['player-journey', 'dice-recast', 'channels']
  });
  assert.equal(okRes.ok, true);
  assert.equal(okRes.appInfo.mainJs.file, 'main.a1a481cf.js');

  await assert.rejects(
    verifyPairPreflight({
      app: candidateApp,
      server: liveRoot,
      output: path.join(tmp, 'mismatch'),
      capabilities: ['player-journey']
    }),
    (err) => {
      assert.ok(err instanceof PairPreflightError);
      assert.equal(err.category, 'ENVIRONMENT_FAILURE');
      return true;
    }
  );
});
