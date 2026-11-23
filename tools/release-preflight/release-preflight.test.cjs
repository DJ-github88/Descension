'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const { runPreflight, formatReport } = require('./release-preflight.cjs');

const REPO_ROOT = path.resolve(__dirname, '../..');
const CLI_PATH = path.join(__dirname, 'release-preflight.cjs');
const DDS_PACKET = path.join(REPO_ROOT, 'handoff/direct-damage-save-combined-20261117');
const HUNTER_PACKET = path.join(REPO_ROOT, 'handoff/hunter-flow-isolated-20261117');
const DDS_CAPTURE_TGZ = path.join(REPO_ROOT, 'scratch/direct-save-capture-20261116/postinstall.tgz');
const HUNTER_CAPTURE_TGZ = path.join(REPO_ROOT, 'scratch/direct-save-capture-20261116/live-r2.tgz');

const EXPECTED_TRIGGER_OFFER_RELEASED = '0ecef08082d50b769f9d3efdc5edf7950eda1408a48ec9806282913824c5519e';
const DRIFTED_TRIGGER_OFFER_SHA = 'a9aa658791f40f23c3e3c711492ebcd085d4b0176bdba4b9e75b2a97dd396b7f';

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function runCli(args) {
  return spawnSync(process.execPath, [CLI_PATH, ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024
  });
}

function extractArchive(archivePath, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  execFileSync('tar', ['-xzf', archivePath, '-C', destDir], { stdio: ['ignore', 'pipe', 'pipe'] });
}

function snapshotTree(dir, opts = {}) {
  const skipDirs = new Set(opts.skipDirs || []);
  const out = [];
  const walk = current => {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      const rel = path.relative(dir, full).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        if (skipDirs.has(entry.name) || skipDirs.has(rel)) continue;
        walk(full);
      } else if (entry.isFile()) {
        out.push(`${rel}:${sha256File(full)}`);
      }
    }
  };
  walk(dir);
  return out;
}

test('1. Valid case: direct-damage-save-combined-20261117 + postinstall.tgz passes all 3 pillars (exit 0)', () => {
  const res = runCli([
    '--packet', DDS_PACKET,
    '--source', DDS_CAPTURE_TGZ,
    '--require-gameplay', 'direct-save:cast',
    '--require-gameplay', 'spellbook-registration',
    '--require-gameplay', 'component-trigger:cast'
  ]);
  assert.equal(res.status, 0, `Expected exit 0, got ${res.status}:\n${res.stdout}\n${res.stderr}`);
  assert.match(res.stdout, /Overall : PASS \(exit 0\)/);
  assert.match(res.stdout, /\[1\/3\] SOURCE VERIFICATION: PASS/);
  assert.match(res.stdout, /Final hashes\s+: 31\/31 matched \(expected deletions ABSENT: 1\/1\)/);
  assert.match(res.stdout, /Pinned dependencies: 10\/10 matched/);
  assert.match(res.stdout, /Composition gate\s+: \[PASS\] 20 passing, 0 failing, 2 optional\/pending/);
  assert.match(res.stdout, /\[2\/3\] BUILD VERIFICATION: PASS/);
  assert.match(res.stdout, /Source capture link: \[PASS\]/);
  assert.match(res.stdout, /\[3\/3\] GAMEPLAY EVIDENCE: PASS/);
  assert.match(res.stdout, /Auxiliary non-final files/);

  const report = runPreflight({
    packets: [DDS_PACKET],
    source: DDS_CAPTURE_TGZ,
    requireGameplay: ['direct-save:cast', 'spellbook-registration', 'component-trigger:cast'],
    repoRoot: REPO_ROOT
  });
  assert.equal(report.overall, 'PASS');
  assert.equal(report.source.status, 'PASS');
  assert.equal(report.build.status, 'PASS');
  assert.equal(report.build.buildArtifactsOnDisk.status, 'NOT_SUPPLIED');
  assert.equal(report.build.buildArtifactsOnDisk.checkedOnDisk, false);
  assert.equal(report.build.buildArtifactsOnDisk.uncheckedRecordedArtifacts.length, 4);
  assert.equal(report.gameplay.status, 'PASS');
  assert.equal(report.gameplay.witnesses.length, 3);
  assert.equal(report.gameplay.auxiliaryFiles.length, 3);

  const reqMap = new Map(report.gameplay.requirements.map(r => [r.spec, r]));
  const dsReq = reqMap.get('direct-save:cast');
  assert.equal(dsReq.status, 'PASS');
  assert.equal(dsReq.matchedWitnesses.length, 1);
  assert.ok(dsReq.matchedWitnesses[0].file.endsWith('app-verified/direct-save/result.json'));

  const ctReq = reqMap.get('component-trigger:cast');
  assert.equal(ctReq.status, 'PASS');
  assert.equal(ctReq.matchedWitnesses.length, 1);
  assert.ok(ctReq.matchedWitnesses[0].file.endsWith('app-verified/component-trigger/result.json'));

  const srReq = reqMap.get('spellbook-registration');
  assert.equal(srReq.status, 'PASS');
  assert.equal(srReq.matchedWitnesses.length, 1);
  assert.ok(srReq.matchedWitnesses[0].file.endsWith('app-verified/spellbook-registration/app-witness-result.json'));
});

test('1b. Removed direct-save witness with component-trigger remaining keeps direct-save:cast UNVERIFIED (exit 2)', () => {
  const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-no-direct-save-'));
  try {
    const pktCopy = path.join(tmpBase, 'dds-packet-copy');
    fs.mkdirSync(pktCopy, { recursive: true });
    for (const entry of fs.readdirSync(DDS_PACKET, { withFileTypes: true })) {
      if (['backup', 'base', 'candidate', 'isolated'].includes(entry.name)) continue;
      const src = path.join(DDS_PACKET, entry.name);
      const dst = path.join(pktCopy, entry.name);
      fs.cpSync(src, dst, { recursive: true });
    }
    fs.rmSync(path.join(pktCopy, 'app-verified/direct-save/result.json'));

    const res = runCli([
      '--packet', pktCopy,
      '--source', DDS_CAPTURE_TGZ,
      '--require-gameplay', 'direct-save:cast',
      '--require-gameplay', 'component-trigger:cast',
      '--require-gameplay', 'spellbook-registration'
    ]);
    assert.equal(res.status, 2, `Expected exit 2 (UNVERIFIED), got ${res.status}:\n${res.stdout}\n${res.stderr}`);
    assert.match(res.stdout, /Overall : UNVERIFIED \(exit 2\)/);
    assert.match(res.stdout, /\[1\/3\] SOURCE VERIFICATION: PASS/);
    assert.match(res.stdout, /\[2\/3\] BUILD VERIFICATION: PASS/);
    assert.match(res.stdout, /\[3\/3\] GAMEPLAY EVIDENCE: UNVERIFIED/);
    assert.match(res.stdout, /\[UNVERIFIED\] direct-save:cast:.*present witnesses only cover: component-trigger, spellbook-registration/);

    const report = runPreflight({
      packets: [pktCopy],
      source: DDS_CAPTURE_TGZ,
      requireGameplay: ['direct-save:cast', 'component-trigger:cast', 'spellbook-registration'],
      skipCompositionGate: true,
      repoRoot: REPO_ROOT
    });
    assert.equal(report.build.status, 'PASS');
    assert.equal(report.gameplay.status, 'UNVERIFIED');
    const bySpec = new Map(report.gameplay.requirements.map(r => [r.spec, r]));
    assert.equal(bySpec.get('direct-save:cast').status, 'UNVERIFIED');
    assert.match(bySpec.get('direct-save:cast').reason, /present witnesses only cover: component-trigger, spellbook-registration/);
    assert.equal(bySpec.get('component-trigger:cast').status, 'PASS');
    assert.equal(bySpec.get('spellbook-registration').status, 'PASS');
  } finally {
    fs.rmSync(tmpBase, { recursive: true, force: true });
  }
});

test('2. Changed dependency: modified triggerOfferService.js fails Source + Build capture link while reporting Gameplay separately (exit 1)', () => {
  const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-changed-dep-'));
  try {
    const srcDir = path.join(tmpBase, 'source');
    extractArchive(DDS_CAPTURE_TGZ, srcDir);
    const depRel = 'vtt-react/src/services/triggerOfferService.js';
    const depPath = path.join(srcDir, ...depRel.split('/'));
    const driftedSrc = path.join(
      REPO_ROOT,
      'handoff/trigger-offer-service-actorsnapshot-roomid-isolated-20261117/reapplied-2026-11-17T18-36-25Z/vtt-react/src/services/triggerOfferService.js'
    );
    if (fs.existsSync(driftedSrc)) {
      fs.copyFileSync(driftedSrc, depPath);
      assert.equal(sha256File(depPath), DRIFTED_TRIGGER_OFFER_SHA);
    } else {
      fs.appendFileSync(depPath, '\n// drifted dependency\n');
    }
    const observedSha = sha256File(depPath);

    const res = runCli([
      '--packet', DDS_PACKET,
      '--source', srcDir,
      '--capture', DDS_CAPTURE_TGZ,
      '--require-gameplay', 'direct-save:cast'
    ]);
    assert.equal(res.status, 1, `Expected exit 1:\n${res.stdout}\n${res.stderr}`);
    const parsed = runPreflight({
      packets: [DDS_PACKET],
      source: srcDir,
      capture: DDS_CAPTURE_TGZ,
      requireGameplay: ['direct-save:cast'],
      skipCompositionGate: true,
      repoRoot: REPO_ROOT
    });

    assert.equal(parsed.source.status, 'FAIL');
    assert.equal(parsed.source.mismatches.length, 1);
    assert.deepEqual(parsed.source.mismatches[0], {
      kind: 'hash-mismatch',
      rel: depRel,
      role: 'dependency',
      expected: EXPECTED_TRIGGER_OFFER_RELEASED,
      observed: observedSha,
      packet: 'handoff/direct-damage-save-combined-20261117',
      manifest: 'DEPENDENCIES.sha256'
    });
    assert.equal(parsed.build.status, 'FAIL');
    assert.equal(parsed.build.sourceCaptureLink.status, 'FAIL');
    assert.equal(parsed.gameplay.status, 'PASS');
  } finally {
    fs.rmSync(tmpBase, { recursive: true, force: true });
  }
});

test('3. Expected deletion present: recreating Step7TriggerUsability.test.jsx fails Source with expected=ABSENT and observed sha256', () => {
  const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-expected-del-'));
  try {
    const srcDir = path.join(tmpBase, 'source');
    extractArchive(DDS_CAPTURE_TGZ, srcDir);
    const delRel = 'vtt-react/src/components/spellcrafting-wizard/components/common/__tests__/Step7TriggerUsability.test.jsx';
    const isolatedCopy = path.join(DDS_PACKET, 'isolated', ...delRel.split('/'));
    const targetPath = path.join(srcDir, ...delRel.split('/'));
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.copyFileSync(isolatedCopy, targetPath);
    const expectedObserved = sha256File(targetPath);

    const report = runPreflight({
      packets: [DDS_PACKET],
      source: srcDir,
      skipCompositionGate: true,
      repoRoot: REPO_ROOT
    });
    assert.equal(report.source.status, 'FAIL');
    const delMismatch = report.source.mismatches.find(m => m.rel === delRel);
    assert.ok(delMismatch, 'Expected deletion mismatch must be reported');
    assert.deepEqual(delMismatch, {
      kind: 'expected-deletion-present',
      rel: delRel,
      role: 'final',
      expected: 'ABSENT',
      observed: expectedObserved,
      packet: 'handoff/direct-damage-save-combined-20261117',
      manifest: 'FINAL.sha256'
    });
  } finally {
    fs.rmSync(tmpBase, { recursive: true, force: true });
  }
});

test('4. Wrong build (--build-dir): Hunter build-out against DDS packet fails Build while Source & Gameplay PASS (exit 1)', () => {
  const hunterBuildDir = path.join(HUNTER_PACKET, 'build-out');
  const res = runCli([
    '--packet', DDS_PACKET,
    '--source', DDS_CAPTURE_TGZ,
    '--build-dir', hunterBuildDir,
    '--require-gameplay', 'direct-save:cast'
  ]);
  assert.equal(res.status, 1);
  assert.match(res.stdout, /\[1\/3\] SOURCE VERIFICATION: PASS/);
  assert.match(res.stdout, /\[2\/3\] BUILD VERIFICATION: FAIL/);
  assert.match(res.stdout, /\[3\/3\] GAMEPLAY EVIDENCE: PASS/);

  const report = runPreflight({
    packets: [DDS_PACKET],
    source: DDS_CAPTURE_TGZ,
    buildDir: hunterBuildDir,
    requireGameplay: ['direct-save:cast'],
    skipCompositionGate: true,
    repoRoot: REPO_ROOT
  });
  assert.equal(report.build.status, 'FAIL');
  const disk = report.build.buildArtifactsOnDisk;
  assert.equal(disk.checkedOnDisk, true);
  assert.deepEqual(
    disk.missingArtifacts.filter(m => m.kind === 'missing-artifact' && m.observed === 'ABSENT').map(m => m.field),
    ['mainJs (static/js/main.b9217462.js)', 'mainCss (static/css/main.8293f898.css)']
  );
  const mismatchKinds = new Map(disk.mismatchedArtifacts.map(m => [m.field, m.kind]));
  assert.equal(mismatchKinds.get('index.html'), 'hash-mismatch');
  assert.equal(mismatchKinds.get('asset-manifest.json'), 'hash-mismatch');
  assert.equal(mismatchKinds.get('mainJs.path'), 'path-mismatch');
  assert.equal(mismatchKinds.get('mainCss.path'), 'path-mismatch');

  // Partially checked-on-disk vs missing build artifact check (delete only main.89fcbdf3.js in temp Hunter build-out copy)
  const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-partial-build-'));
  try {
    const partialBuildDir = path.join(tmpBase, 'build-out');
    fs.cpSync(hunterBuildDir, partialBuildDir, { recursive: true });
    fs.rmSync(path.join(partialBuildDir, 'static/js/main.89fcbdf3.js'));
    const partialReport = runPreflight({
      packets: [HUNTER_PACKET],
      source: HUNTER_CAPTURE_TGZ,
      buildDir: partialBuildDir,
      skipCompositionGate: true,
      repoRoot: REPO_ROOT
    });
    const partialDisk = partialReport.build.buildArtifactsOnDisk;
    assert.equal(partialDisk.checkedOnDisk, true);
    assert.equal(partialDisk.status, 'FAIL');
    assert.deepEqual(
      partialDisk.verifiedArtifacts.map(a => a.field),
      ['index.html', 'asset-manifest.json', 'mainCss (static/css/main.431c6a86.css)']
    );
    assert.ok(partialDisk.missingArtifacts.some(m => m.field === 'mainJs (static/js/main.89fcbdf3.js)' && m.observed === 'ABSENT'));
  } finally {
    fs.rmSync(tmpBase, { recursive: true, force: true });
  }
});

test('5. Wrong build (--build-identity): Hunter BUILD_IDENTITY.json against DDS packet fails Build & Gameplay while Source PASSES', () => {
  const report = runPreflight({
    packets: [DDS_PACKET],
    source: DDS_CAPTURE_TGZ,
    buildIdentity: path.join(HUNTER_PACKET, 'BUILD_IDENTITY.json'),
    requireGameplay: ['direct-save:cast'],
    repoRoot: REPO_ROOT
  });
  assert.equal(report.overall, 'FAIL');
  assert.equal(report.exitCode, 1);
  assert.equal(report.source.status, 'PASS');
  assert.equal(report.build.status, 'FAIL');
  assert.equal(report.build.sourceCaptureLink.status, 'UNVERIFIED');
  assert.equal(report.build.embeddedFinalLink.status, 'UNVERIFIED');
  assert.equal(report.build.witnessBuildLinks.status, 'FAIL');
  assert.equal(report.gameplay.status, 'FAIL');
  assert.equal(report.gameplay.requirements[0].status, 'FAIL');
});

test('6a. Hunter r2 clean staged source: Source PASS, Build UNVERIFIED, Gameplay FAIL on startup-only evidence (with and without --require-gameplay)', () => {
  const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-hunter-clean-'));
  try {
    const cleanHunter = path.join(tmpBase, 'hunter-clean');
    const ddsExtracted = path.join(tmpBase, 'dds');
    extractArchive(HUNTER_CAPTURE_TGZ, cleanHunter);
    extractArchive(DDS_CAPTURE_TGZ, ddsExtracted);

    const depRel = 'vtt-react/src/services/triggerOfferService.js';
    fs.copyFileSync(path.join(ddsExtracted, ...depRel.split('/')), path.join(cleanHunter, ...depRel.split('/')));
    assert.equal(sha256File(path.join(cleanHunter, ...depRel.split('/'))), EXPECTED_TRIGGER_OFFER_RELEASED);

    const withReq = runPreflight({
      packets: [HUNTER_PACKET],
      source: cleanHunter,
      requireGameplay: ['quick-draw:cast'],
      repoRoot: REPO_ROOT
    });
    assert.equal(withReq.overall, 'FAIL');
    assert.equal(withReq.exitCode, 1);
    assert.equal(withReq.source.status, 'PASS');
    assert.equal(withReq.source.counts.finalMatched, 22);
    assert.equal(withReq.source.counts.dependencyMatched, 1);
    assert.equal(withReq.build.status, 'UNVERIFIED');
    assert.equal(withReq.build.buildArtifactsOnDisk.status, 'PASS');
    assert.equal(withReq.build.buildArtifactsOnDisk.checkedOnDisk, true);
    assert.equal(withReq.build.buildArtifactsOnDisk.verifiedArtifacts.length, 4);
    assert.equal(withReq.build.buildArtifactsOnDisk.missingArtifacts.length, 0);
    assert.equal(withReq.build.buildArtifactsOnDisk.mismatchedArtifacts.length, 0);
    assert.equal(withReq.build.sourceCaptureLink.status, 'UNVERIFIED');
    assert.equal(withReq.build.embeddedFinalLink.status, 'UNVERIFIED');
    assert.equal(withReq.gameplay.status, 'FAIL');
    assert.equal(withReq.gameplay.witnesses[0].classification, 'startup-and-bundle-only');
    assert.equal(withReq.gameplay.requirements[0].status, 'FAIL');
    assert.match(withReq.gameplay.requirements[0].reason, /startup, bundle strings, and unit tests cannot satisfy/i);

    // Even without --require-gameplay, startup-only evidence cannot pass Gameplay.
    const withoutReq = runPreflight({
      packets: [HUNTER_PACKET],
      source: cleanHunter,
      skipCompositionGate: true,
      repoRoot: REPO_ROOT
    });
    assert.equal(withoutReq.gameplay.status, 'FAIL');
    assert.equal(withoutReq.gameplay.witnesses[0].classification, 'startup-and-bundle-only');
  } finally {
    fs.rmSync(tmpBase, { recursive: true, force: true });
  }
});

test('6b. Hunter r2 raw live-r2.tgz catches triggerOfferService.js dependency drift + missing capture link + startup-only evidence', () => {
  const res = runCli([
    '--packet', HUNTER_PACKET,
    '--source', HUNTER_CAPTURE_TGZ,
    '--require-gameplay', 'quick-draw:cast'
  ]);
  assert.equal(res.status, 1);
  assert.match(res.stdout, /\[1\/3\] SOURCE VERIFICATION: FAIL/);
  assert.match(res.stdout, /vtt-react\/src\/services\/triggerOfferService\.js/);
  assert.match(res.stdout, new RegExp(`expected: ${EXPECTED_TRIGGER_OFFER_RELEASED}`));
  assert.match(res.stdout, new RegExp(`observed: ${DRIFTED_TRIGGER_OFFER_SHA}`));
  assert.match(res.stdout, /BUILD_IDENTITY\.json:triggerOfferServicePinnedReleased/);
  assert.match(res.stdout, /\[2\/3\] BUILD VERIFICATION: UNVERIFIED/);
  assert.match(res.stdout, /\[3\/3\] GAMEPLAY EVIDENCE: FAIL/);
  assert.match(res.stdout, /class=startup-and-bundle-only/);
});

test('7. Unrelated cast cannot satisfy a named gameplay requirement (DDS + quick-draw:cast)', () => {
  const report = runPreflight({
    packets: [DDS_PACKET],
    source: DDS_CAPTURE_TGZ,
    requireGameplay: ['quick-draw:cast'],
    skipCompositionGate: true,
    repoRoot: REPO_ROOT
  });
  assert.equal(report.build.status, 'PASS');
  assert.equal(report.gameplay.status, 'UNVERIFIED');
  assert.equal(report.gameplay.requirements[0].status, 'UNVERIFIED');
  assert.match(report.gameplay.requirements[0].reason, /present witnesses only cover: component-trigger, direct-save, spellbook-registration/);
  assert.equal(report.overall, 'UNVERIFIED');
  assert.equal(report.exitCode, 2);
});

test('8. Multi-packet manifest conflict detection & --skip-composition-gate returns UNVERIFIED (exit 2)', () => {
  const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-conflict-'));
  try {
    const customBuildId = path.join(DDS_PACKET, 'BUILD_IDENTITY.json');
    const conflictReport = runPreflight({
      packets: [DDS_PACKET, HUNTER_PACKET],
      source: DDS_CAPTURE_TGZ,
      buildIdentity: customBuildId,
      skipCompositionGate: true,
      repoRoot: REPO_ROOT
    });
    assert.equal(conflictReport.source.status, 'FAIL');
    assert.ok(conflictReport.source.manifestConflicts.length > 0, 'Expected conflicts between DDS and Hunter manifests');
    const sharedConflict = conflictReport.source.manifestConflicts.find(
      c => c.rel === 'server/shared/services/authoredAbility.js'
    );
    assert.ok(sharedConflict, 'Expected conflict on shared authoredAbility.js');
    assert.equal(sharedConflict.expectations.length, 2);
    const conflictText = formatReport(conflictReport);
    assert.match(conflictText, /MANIFEST CONFLICT\s+: server\/shared\/services\/authoredAbility\.js/);
    assert.match(conflictText, /handoff\/direct-damage-save-combined-20261117/);
    assert.match(conflictText, /handoff\/hunter-flow-isolated-20261117/);
  } finally {
    fs.rmSync(tmpBase, { recursive: true, force: true });
  }

  const skippedRes = runCli([
    '--packet', DDS_PACKET,
    '--source', DDS_CAPTURE_TGZ,
    '--skip-composition-gate',
    '--require-gameplay', 'direct-save:cast'
  ]);
  assert.equal(skippedRes.status, 2, `Skipped gate must exit 2 (UNVERIFIED), got ${skippedRes.status}`);
  assert.match(skippedRes.stdout, /Overall : UNVERIFIED \(exit 2\)/);
  assert.match(skippedRes.stdout, /\[1\/3\] SOURCE VERIFICATION: UNVERIFIED/);
});

test('9. Read-only immutability: running preflight across all 4 demo cases leaves packets and staged source unchanged', () => {
  const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-readonly-'));
  try {
    const stagedSource = path.join(tmpBase, 'staged-dds');
    extractArchive(DDS_CAPTURE_TGZ, stagedSource);

    const beforeDds = snapshotTree(DDS_PACKET, { skipDirs: ['backup', 'base', 'candidate', 'isolated'] });
    const beforeHunter = snapshotTree(HUNTER_PACKET, { skipDirs: ['backup', 'build-stage'] });
    const beforeStaged = snapshotTree(stagedSource);

    // Run 1: valid archive
    assert.equal(
      runCli(['--packet', DDS_PACKET, '--source', DDS_CAPTURE_TGZ, '--require-gameplay', 'direct-save:cast']).status,
      0
    );
    // Run 2: staged directory + capture (with full composition gate enabled to prove zero writes into --source)
    assert.equal(
      runCli(['--packet', DDS_PACKET, '--source', stagedSource, '--capture', DDS_CAPTURE_TGZ]).status,
      0
    );
    // Run 3: wrong build
    assert.equal(
      runCli([
        '--packet', DDS_PACKET,
        '--source', DDS_CAPTURE_TGZ,
        '--build-dir', path.join(HUNTER_PACKET, 'build-out'),
        '--skip-composition-gate'
      ]).status,
      1
    );
    // Run 4: Hunter r2 startup-only
    assert.equal(
      runCli([
        '--packet', HUNTER_PACKET,
        '--source', HUNTER_CAPTURE_TGZ,
        '--require-gameplay', 'quick-draw:cast',
        '--skip-composition-gate'
      ]).status,
      1
    );

    const afterDds = snapshotTree(DDS_PACKET, { skipDirs: ['backup', 'base', 'candidate', 'isolated'] });
    const afterHunter = snapshotTree(HUNTER_PACKET, { skipDirs: ['backup', 'build-stage'] });
    const afterStaged = snapshotTree(stagedSource);

    assert.deepEqual(afterDds, beforeDds, 'DDS packet files must remain byte-identical');
    assert.deepEqual(afterHunter, beforeHunter, 'Hunter packet files must remain byte-identical');
    assert.deepEqual(afterStaged, beforeStaged, 'Supplied source directory must remain byte-identical');
  } finally {
    fs.rmSync(tmpBase, { recursive: true, force: true });
  }
});
