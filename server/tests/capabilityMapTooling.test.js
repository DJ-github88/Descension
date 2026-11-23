'use strict';

const assert = require('assert/strict');
const { execFileSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  classifyCheck,
  runCapabilityMap
} = require('./capabilityMap.runner.cjs');

const ROOT = path.resolve(__dirname, '..', '..');
const RUNNER_PATH = path.join(__dirname, 'capabilityMap.runner.cjs');
const OLD_SNAPSHOT_PATH = path.join(__dirname, 'fixtures', 'snapshots', 'capabilityMap.20261115-pre-secondary-refresh.json');
const CURRENT_MAP_PATH = path.join(__dirname, 'fixtures', 'capabilityMap.json');

function makeTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function sha256Rel(relPath) {
  return crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, relPath))).digest('hex');
}

describe('Capability Map Tooling', function () {
  this.timeout(20000);

  const tempDirs = [];
  afterEach(() => {
    while (tempDirs.length > 0) {
      fs.rmSync(tempDirs.pop(), { recursive: true, force: true });
    }
  });

  it('fails nonzero in strict mode on source identity mismatch', async () => {
    const res = await runCapabilityMap({
      mode: 'strict',
      root: ROOT,
      mapPath: OLD_SNAPSHOT_PATH,
      quiet: true
    });
    assert.equal(res.exitCode, 1);
    assert.equal(res.certified, false);
    assert.ok(res.identityReport.drifted.length >= 1);
    assert.ok(res.identityReport.drifted.some(d => d.relPath === 'server/services/actorConsequences.js'));
    assert.equal(res.behavior, null);
  });

  it('runs all 33 checks in diagnostic mode with drift and labels output UNPINNED / NOT A RELEASE CERTIFICATION', () => {
    const tmp = makeTempDir('capmap-diag-drift-');
    tempDirs.push(tmp);
    const diagMap = JSON.parse(fs.readFileSync(CURRENT_MAP_PATH, 'utf8'));
    diagMap.sourceIdentities['vtt-react/src/services/executionPlan.js'] = '2ce35561bba2ef1b22b4d8654e8886501085a32535f6250209ba22dfdb030e8e';
    const diagMapPath = path.join(tmp, 'diagMap.json');
    fs.writeFileSync(diagMapPath, JSON.stringify(diagMap, null, 2), 'utf8');

    const stdout = execFileSync(process.execPath, [
      RUNNER_PATH,
      '--diagnostic',
      '--map',
      diagMapPath
    ], { cwd: path.join(ROOT, 'server'), encoding: 'utf8' });

    assert.match(stdout, /UNPINNED \/ NOT A RELEASE CERTIFICATION/);
    assert.match(stdout, /\[IDENTITY DRIFT\] vtt-react\/src\/services\/executionPlan\.js/);
    assert.match(stdout, /Identity drift\/failures\s*:\s*[1-9]\d*/);
    assert.match(stdout, /Behavior failures\s*:\s*0/);
    assert.match(stdout, /Executable gameplay\s*:\s*12\/12 passed/);
    assert.match(stdout, /Boundary\/refusal checks\s*:\s*21\/21 passed \(NOT counted as gameplay\)/);
  });

  it('reports real behavior failures separately from identity drift and exits nonzero', async () => {
    const tmp = makeTempDir('capmap-behavior-fail-');
    tempDirs.push(tmp);
    const badMap = JSON.parse(fs.readFileSync(CURRENT_MAP_PATH, 'utf8'));
    badMap.sourceIdentities['vtt-react/src/services/executionPlan.js'] = '2ce35561bba2ef1b22b4d8654e8886501085a32535f6250209ba22dfdb030e8e';
    badMap.checks = badMap.checks.filter(c => c.id === 'refused-area-cone');
    badMap.checks[0].expectCompiled = true;
    badMap.checks[0].expectExecutableClaim = true;
    const badMapPath = path.join(tmp, 'badMap.json');
    fs.writeFileSync(badMapPath, JSON.stringify(badMap, null, 2), 'utf8');

    const res = await runCapabilityMap({
      mode: 'diagnostic',
      root: ROOT,
      mapPath: badMapPath,
      quiet: true
    });
    assert.equal(res.exitCode, 1);
    assert.ok(res.identityReport.drifted.length >= 1);
    assert.equal(res.behavior.behaviorFailures.length, 1);
    assert.equal(res.behavior.behaviorFailures[0].id, 'refused-area-cone');
  });

  it('fails nonzero on missing fixture or missing map file', async () => {
    await assert.rejects(
      () => runCapabilityMap({
        mode: 'strict',
        root: ROOT,
        mapPath: path.join(ROOT, 'server', 'tests', 'fixtures', 'does-not-exist.json'),
        quiet: true
      }),
      /Missing capability map fixture/
    );

    const tmp = makeTempDir('capmap-missing-fixture-');
    tempDirs.push(tmp);
    const mapWithMissingFixture = JSON.parse(fs.readFileSync(CURRENT_MAP_PATH, 'utf8'));
    for (const rel of Object.keys(mapWithMissingFixture.sourceIdentities)) {
      mapWithMissingFixture.sourceIdentities[rel] = sha256Rel(rel);
    }
    mapWithMissingFixture.checks = [{
      id: 'missing-fixture-check',
      kind: 'compiler-and-plan',
      fixtureSource: 'server/tests/helpers/fixtures/nonexistent-fixture.json',
      expectCompiled: false
    }];
    const mapPath = path.join(tmp, 'missingFixtureMap.json');
    fs.writeFileSync(mapPath, JSON.stringify(mapWithMissingFixture, null, 2), 'utf8');

    const res = await runCapabilityMap({
      mode: 'strict',
      root: ROOT,
      mapPath,
      quiet: true
    });
    assert.equal(res.exitCode, 1);
    assert.equal(res.behavior.behaviorFailures.length, 1);
    assert.match(res.behavior.behaviorFailures[0].error, /Missing fixture file/);
  });

  it('refuses wrong root without falling back to D:\\VTT', async () => {
    const emptyRoot = makeTempDir('capmap-wrong-root-');
    tempDirs.push(emptyRoot);

    await assert.rejects(
      () => runCapabilityMap({
        mode: 'strict',
        root: emptyRoot,
        mapPath: CURRENT_MAP_PATH,
        quiet: true
      }),
      /Wrong root directory.*refusing fallback/
    );

    fs.mkdirSync(path.join(emptyRoot, 'server'));
    fs.mkdirSync(path.join(emptyRoot, 'vtt-react'));
    const minimalMap = JSON.parse(fs.readFileSync(CURRENT_MAP_PATH, 'utf8'));
    minimalMap.sourceIdentities = {};
    minimalMap.stagedCandidatesNotInstalled = [];
    const mapPath = path.join(emptyRoot, 'map.json');
    fs.writeFileSync(mapPath, JSON.stringify(minimalMap, null, 2), 'utf8');

    await assert.rejects(
      () => runCapabilityMap({
        mode: 'strict',
        root: emptyRoot,
        mapPath,
        quiet: true
      }),
      /Missing required module in root/
    );
  });

  it('proposes pin updates with accepted release provenance without writing files', async () => {
    const tmp = makeTempDir('capmap-propose-');
    tempDirs.push(tmp);
    const mapCopy = JSON.parse(fs.readFileSync(CURRENT_MAP_PATH, 'utf8'));
    for (const rel of Object.keys(mapCopy.sourceIdentities)) {
      mapCopy.sourceIdentities[rel] = sha256Rel(rel);
    }
    mapCopy.sourceIdentities['vtt-react/src/services/executionPlan.js'] = '2ce35561bba2ef1b22b4d8654e8886501085a32535f6250209ba22dfdb030e8e';
    const mapCopyPath = path.join(tmp, 'capabilityMap.json');
    fs.writeFileSync(mapCopyPath, JSON.stringify(mapCopy, null, 2), 'utf8');
    const beforeBytes = fs.readFileSync(mapCopyPath, 'utf8');

    const res = await runCapabilityMap({
      mode: 'propose-pin-update',
      root: ROOT,
      mapPath: mapCopyPath,
      quiet: true
    });
    const afterBytes = fs.readFileSync(mapCopyPath, 'utf8');

    assert.equal(res.written, false);
    assert.equal(afterBytes, beforeBytes);
    assert.equal(res.proposals.length, 1);
    assert.equal(res.proposals[0].relPath, 'vtt-react/src/services/executionPlan.js');
    assert.equal(res.proposals[0].provenance.attested, true);
    assert.equal(res.proposals[0].provenance.packet, 'handoff/direct-damage-save-combined-20261117/');
    assert.equal(res.proposals[0].provenance.reviewVerdict, 'ACCEPT');
  });

  it('applies explicit reconciliation with backup and passes strict mode afterward, while refusing unattested updates', async () => {
    const tmp = makeTempDir('capmap-reconcile-');
    tempDirs.push(tmp);
    const mapCopy = JSON.parse(fs.readFileSync(CURRENT_MAP_PATH, 'utf8'));
    for (const rel of Object.keys(mapCopy.sourceIdentities)) {
      mapCopy.sourceIdentities[rel] = sha256Rel(rel);
    }
    mapCopy.sourceIdentities['vtt-react/src/services/executionPlan.js'] = '2ce35561bba2ef1b22b4d8654e8886501085a32535f6250209ba22dfdb030e8e';
    const mapCopyPath = path.join(tmp, 'capabilityMap.json');
    const backupDir = path.join(tmp, 'backups');
    fs.writeFileSync(mapCopyPath, JSON.stringify(mapCopy, null, 2), 'utf8');

    const applied = await runCapabilityMap({
      mode: 'apply-pin-update',
      root: ROOT,
      mapPath: mapCopyPath,
      backupDir,
      quiet: true
    });
    assert.equal(applied.written, true);
    assert.ok(fs.existsSync(applied.backupPath));
    assert.equal(applied.changes.length, 1);

    const strictAfter = await runCapabilityMap({
      mode: 'strict',
      root: ROOT,
      mapPath: mapCopyPath,
      quiet: true
    });
    assert.equal(strictAfter.exitCode, 0);
    assert.equal(strictAfter.certified, true);
    assert.equal(strictAfter.behavior.passed, 33);

    const unattestedMap = JSON.parse(fs.readFileSync(mapCopyPath, 'utf8'));
    unattestedMap.sourceIdentities['server/services/committedTriggers.js'] = '0000000000000000';
    const unattestedPath = path.join(tmp, 'unattested.json');
    fs.writeFileSync(unattestedPath, JSON.stringify(unattestedMap, null, 2), 'utf8');

    await assert.rejects(
      () => runCapabilityMap({
        mode: 'apply-pin-update',
        root: ROOT,
        mapPath: unattestedPath,
        backupDir,
        quiet: true
      }),
      /Refusing to update unattested pins/
    );
  });

  it('never promotes candidate-only or compiler-only statuses and keeps unsupported refusals out of executable gameplay count', async () => {
    const currentMap = JSON.parse(fs.readFileSync(CURRENT_MAP_PATH, 'utf8'));
    const refusalChecks = currentMap.checks.filter(c => classifyCheck(c) === 'refusal');
    const executableChecks = currentMap.checks.filter(c => classifyCheck(c) === 'executable');
    assert.equal(executableChecks.length, 12);
    assert.equal(refusalChecks.length, 21);

    const tmp = makeTempDir('capmap-governance-');
    tempDirs.push(tmp);
    const badGovMap = JSON.parse(fs.readFileSync(CURRENT_MAP_PATH, 'utf8'));
    badGovMap.families[0].status = 'app-verified';
    badGovMap.families[0].evidenceLevel = 'compiler-and-plan';
    const badGovPath = path.join(tmp, 'badGov.json');
    fs.writeFileSync(badGovPath, JSON.stringify(badGovMap, null, 2), 'utf8');

    const res = await runCapabilityMap({
      mode: 'strict',
      root: ROOT,
      mapPath: badGovPath,
      quiet: true
    });
    assert.equal(res.exitCode, 1);
    assert.ok(res.governanceFailures.some(f => f.includes('cannot claim app-verified')));
  });
});
