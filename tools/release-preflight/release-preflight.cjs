#!/usr/bin/env node
'use strict';

/**
 * Read-only release preflight for Mythrill VTT.
 *
 * Verifies three pillars separately without modifying any source, manifest,
 * build, or acceptance artifact:
 *   1. Source verification (FINAL.sha256, expected ABSENT deletions, DEPENDENCIES.sha256,
 *      BUILD_IDENTITY pinned dependencies, INSTALLED.json consistency, REVIEW.md ACCEPT,
 *      server/scripts/sync-shared.js --check, and server composition-preservation gate).
 *   2. Build verification (BUILD_IDENTITY.json link to source capture / final hashes,
 *      optional on-disk build directory integrity, and witness-to-build links).
 *   3. Gameplay evidence verification (classifying real App journeys vs startup/bundle-only
 *      checks and checking named gameplay requirements).
 */

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const DEFAULT_REPO_ROOT = path.resolve(__dirname, '../..');
const HEX64_RE = /^[a-f0-9]{64}$/i;
const SKIP_SOURCE_WALK_DIRS = new Set(['node_modules', '.git', 'build', 'coverage']);

class CliUsageError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CliUsageError';
  }
}

function toPosix(p) {
  return p.replace(/\\/g, '/');
}

function normalizeRelPath(rawRel, label) {
  let rel = toPosix(String(rawRel || '').trim());
  while (rel.startsWith('./')) rel = rel.slice(2);
  if (
    !rel ||
    path.posix.isAbsolute(rel) ||
    /^[a-zA-Z]:/.test(rel) ||
    rel === '..' ||
    rel.startsWith('../') ||
    rel.includes('/../') ||
    rel.endsWith('/..')
  ) {
    throw new Error(`Invalid relative path in ${label}: "${rawRel}"`);
  }
  return rel;
}

function displayPath(targetPath, repoRoot) {
  const absTarget = path.resolve(targetPath);
  const absRoot = path.resolve(repoRoot);
  const rel = path.relative(absRoot, absTarget);
  if (rel && !rel.startsWith('..') && !path.isAbsolute(rel)) {
    return toPosix(rel);
  }
  if (rel === '') return '.';
  return toPosix(absTarget);
}

function sha256Buffer(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function sha256File(filePath) {
  return sha256Buffer(fs.readFileSync(filePath));
}

function observeFile(rootDir, rel) {
  const fullPath = path.join(rootDir, ...rel.split('/'));
  let stat;
  try {
    stat = fs.lstatSync(fullPath);
  } catch (err) {
    if (err && err.code === 'ENOENT') return 'ABSENT';
    throw err;
  }
  if (stat.isDirectory()) return 'DIRECTORY';
  if (stat.isFile()) return sha256File(fullPath);
  if (stat.isSymbolicLink()) {
    try {
      const targetStat = fs.statSync(fullPath);
      if (targetStat.isDirectory()) return 'DIRECTORY';
      if (targetStat.isFile()) return sha256File(fullPath);
    } catch {
      return 'SYMLINK';
    }
  }
  return 'NON_FILE';
}

function readJsonStrict(filePath, label) {
  let text;
  try {
    text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  } catch (err) {
    throw new Error(`Unable to read ${label} (${filePath}): ${err.message}`);
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error(`Invalid JSON in ${label} (${filePath}): ${err.message}`);
  }
}

function parseSha256Manifest(filePath, label) {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const lines = raw.split(/\r?\n/);
  const rows = [];
  for (let idx = 0; idx < lines.length; idx += 1) {
    const trimmed = lines[idx].trim();
    if (!trimmed) continue;
    const match = /^([a-f0-9]{64}|ABSENT)\s+(.+)$/i.exec(trimmed);
    if (!match) {
      throw new Error(`Malformed manifest line ${idx + 1} in ${label}: "${lines[idx]}"`);
    }
    const rawHash = match[1];
    const hash = rawHash.toUpperCase() === 'ABSENT' ? 'ABSENT' : rawHash.toLowerCase();
    const rel = normalizeRelPath(match[2], `${label}:${idx + 1}`);
    rows.push({ rel, hash });
  }
  return rows;
}

function isArchivePath(filePath) {
  const lower = filePath.toLowerCase();
  return lower.endsWith('.tgz') || lower.endsWith('.tar.gz');
}

function extractArchiveToTemp(archivePath, prefix) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  try {
    execFileSync('tar', ['-xzf', archivePath, '-C', tmpDir], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    return tmpDir;
  } catch (err) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    const stderr = err && err.stderr ? String(err.stderr).trim() : err.message;
    throw new Error(`Failed to extract archive ${archivePath}: ${stderr}`);
  }
}

function walkRegularFiles(dir, baseDir, out, skipDirNames = new Set()) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (skipDirNames.has(entry.name)) continue;
      walkRegularFiles(full, baseDir, out, skipDirNames);
    } else if (entry.isFile()) {
      out.push(toPosix(path.relative(baseDir, full)));
    }
  }
}

function parseReviewMarkdown(reviewPath, packetLabel) {
  if (!fs.existsSync(reviewPath)) {
    return { packet: packetLabel, status: 'UNVERIFIED', detail: 'REVIEW.md missing' };
  }
  const text = fs.readFileSync(reviewPath, 'utf8').replace(/^\uFEFF/, '');
  const hasAccept = /(?:\*\*)?Verdict:\s*ACCEPT(?:\*\*)?/i.test(text);
  const hasBlocking = /(?:\*\*)?Verdict:\s*(?:BLOCK|REJECT|FAIL)(?:\*\*)?/i.test(text);
  if (hasBlocking || !hasAccept) {
    return {
      packet: packetLabel,
      status: 'FAIL',
      detail: hasBlocking ? 'REVIEW.md records blocking/failing verdict' : 'REVIEW.md does not record Verdict: ACCEPT'
    };
  }
  return { packet: packetLabel, status: 'PASS', detail: 'REVIEW.md records Verdict: ACCEPT' };
}

function checkInstalledJson(packetDir, packetLabel, finalRows) {
  const installedPath = path.join(packetDir, 'INSTALLED.json');
  if (!fs.existsSync(installedPath)) {
    return { packet: packetLabel, present: false, status: 'ABSENT', mismatches: [], postInstallCapture: null };
  }
  const installed = readJsonStrict(installedPath, `${packetLabel}/INSTALLED.json`);
  if (!Array.isArray(installed.files)) {
    return {
      packet: packetLabel,
      present: true,
      status: 'FAIL',
      mismatches: [{ rel: '(INSTALLED.json)', expected: 'files array', observed: typeof installed.files }],
      postInstallCapture: null
    };
  }

  const finalMap = new Map(finalRows.map(r => [r.rel, r.hash]));
  const installedMap = new Map();
  const mismatches = [];

  for (const rec of installed.files) {
    if (!rec || typeof rec.rel !== 'string' || typeof rec.hash !== 'string') {
      mismatches.push({ rel: '(entry)', expected: '{ rel, hash }', observed: JSON.stringify(rec) });
      continue;
    }
    const rel = normalizeRelPath(rec.rel, `${packetLabel}/INSTALLED.json`);
    const hash = rec.hash.toUpperCase() === 'ABSENT' ? 'ABSENT' : rec.hash.toLowerCase();
    if (installedMap.has(rel)) {
      mismatches.push({ rel, expected: 'unique entry', observed: 'duplicate entry in INSTALLED.json' });
    }
    installedMap.set(rel, hash);
  }

  for (const [rel, expected] of finalMap.entries()) {
    if (!installedMap.has(rel)) {
      mismatches.push({ rel, expected, observed: 'MISSING_IN_INSTALLED_JSON' });
    } else if (installedMap.get(rel) !== expected) {
      mismatches.push({ rel, expected, observed: installedMap.get(rel) });
    }
  }
  for (const [rel, observed] of installedMap.entries()) {
    if (!finalMap.has(rel)) {
      mismatches.push({ rel, expected: 'ABSENT_IN_FINAL_SHA256', observed });
    }
  }

  let postInstallCapture = null;
  if (installed.postInstallCapture && typeof installed.postInstallCapture === 'object') {
    const capSha = installed.postInstallCapture.sha256;
    postInstallCapture = {
      file: installed.postInstallCapture.file || null,
      sha256: typeof capSha === 'string' ? capSha.toLowerCase() : null,
      equalsReviewedComposedTree: installed.postInstallCapture.equalsReviewedComposedTree
    };
  }

  return {
    packet: packetLabel,
    present: true,
    status: mismatches.length === 0 ? 'PASS' : 'FAIL',
    mismatches,
    postInstallCapture
  };
}

function runSyncSharedCheck(sourceRoot) {
  const syncScript = path.join(sourceRoot, 'server/scripts/sync-shared.js');
  if (!fs.existsSync(syncScript)) {
    return { status: 'UNVERIFIED', detail: 'server/scripts/sync-shared.js missing in supplied source tree' };
  }
  const res = spawnSync(process.execPath, [syncScript, '--check'], {
    cwd: path.join(sourceRoot, 'server'),
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024
  });
  const output = `${res.stdout || ''}\n${res.stderr || ''}`.trim();
  if (res.status === 0) {
    return { status: 'PASS', detail: output || 'server/shared is up to date' };
  }
  return {
    status: 'FAIL',
    detail: output || `sync-shared.js --check exited with status ${res.status}`
  };
}

function copyDirFiltered(src, dest, skipDirNames = new Set(['node_modules', '.git', 'logs'])) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (skipDirNames.has(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirFiltered(srcPath, destPath, skipDirNames);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function createGateTempStage(sourceRoot) {
  const tmpStage = fs.mkdtempSync(path.join(os.tmpdir(), 'mythrill-gate-stage-'));
  try {
    const serverSrc = path.join(sourceRoot, 'server');
    if (fs.existsSync(serverSrc) && fs.statSync(serverSrc).isDirectory()) {
      copyDirFiltered(serverSrc, path.join(tmpStage, 'server'));
    }
    const clientDir = path.join(sourceRoot, 'vtt-react');
    if (fs.existsSync(clientDir) && fs.statSync(clientDir).isDirectory()) {
      fs.mkdirSync(path.join(tmpStage, 'vtt-react'), { recursive: true });
      for (const sub of ['services', 'data']) {
        const subSrc = path.join(clientDir, 'src', sub);
        if (fs.existsSync(subSrc) && fs.statSync(subSrc).isDirectory()) {
          copyDirFiltered(subSrc, path.join(tmpStage, 'vtt-react', 'src', sub));
        }
      }
    }
    return tmpStage;
  } catch (err) {
    fs.rmSync(tmpStage, { recursive: true, force: true });
    throw err;
  }
}

function runCompositionGateCheck(sourceRoot, repoRoot, skip, isolateDirectory) {
  if (skip) {
    return { status: 'UNVERIFIED', skipped: true, detail: 'Skipped via --skip-composition-gate' };
  }
  const gatePath = path.join(repoRoot, 'server/tests/helpers/runCompositionGate.cjs');
  if (!fs.existsSync(gatePath)) {
    return { status: 'UNVERIFIED', skipped: false, detail: `Composition gate helper not found at ${gatePath}` };
  }
  const { runCompositionGate } = require(gatePath);
  // Copy directory sources into a disposable temp stage so Mocha/logger.js never writes server/logs/ into --source.
  const tempGateStage = isolateDirectory ? createGateTempStage(sourceRoot) : null;
  let res;
  try {
    res = runCompositionGate({ stageRoot: tempGateStage || sourceRoot });
  } finally {
    if (tempGateStage) {
      fs.rmSync(tempGateStage, { recursive: true, force: true });
    }
  }
  if (res.ok) {
    return {
      status: 'PASS',
      skipped: false,
      passes: res.stats ? res.stats.passes : 0,
      failures: res.stats ? res.stats.failures : 0,
      optionalPending: Array.isArray(res.optionalPending) ? res.optionalPending.length : 0,
      detail: `${res.stats.passes} passing, ${res.stats.failures} failing, ${res.optionalPending.length} optional/pending`
    };
  }
  return {
    status: 'FAIL',
    skipped: false,
    error: res.error || null,
    failures: res.failures || [],
    missingRequired: res.missingRequired || [],
    unexpectedPending: res.unexpectedPending || [],
    detail: res.error || `${(res.failures || []).length} failing, ${(res.missingRequired || []).length} missing required`
  };
}

function verifySourcePillar(packetInfos, sourceRoot, repoRoot, options, isolateGateDirectory = false) {
  const expectations = [];
  const manifestErrors = [];
  const reviews = [];
  const installedChecks = [];

  for (const pkt of packetInfos) {
    const finalPath = path.join(pkt.dir, 'FINAL.sha256');
    if (!fs.existsSync(finalPath)) {
      manifestErrors.push({ packet: pkt.label, detail: 'Missing required FINAL.sha256' });
      continue;
    }
    const finalRows = parseSha256Manifest(finalPath, `${pkt.label}/FINAL.sha256`);
    for (const row of finalRows) {
      expectations.push({
        rel: row.rel,
        expected: row.hash,
        role: 'final',
        packet: pkt.label,
        manifest: 'FINAL.sha256'
      });
    }

    const depsPath = path.join(pkt.dir, 'DEPENDENCIES.sha256');
    if (fs.existsSync(depsPath)) {
      const depRows = parseSha256Manifest(depsPath, `${pkt.label}/DEPENDENCIES.sha256`);
      for (const row of depRows) {
        expectations.push({
          rel: row.rel,
          expected: row.hash,
          role: 'dependency',
          packet: pkt.label,
          manifest: 'DEPENDENCIES.sha256'
        });
      }
    }

    const pktBuildIdPath = path.join(pkt.dir, 'BUILD_IDENTITY.json');
    if (fs.existsSync(pktBuildIdPath)) {
      const rawId = readJsonStrict(pktBuildIdPath, `${pkt.label}/BUILD_IDENTITY.json`);
      if (rawId.triggerOfferServicePinnedReleased !== undefined) {
        if (
          typeof rawId.triggerOfferServicePinnedReleased !== 'string' ||
          !HEX64_RE.test(rawId.triggerOfferServicePinnedReleased)
        ) {
          manifestErrors.push({
            packet: pkt.label,
            detail: 'Malformed triggerOfferServicePinnedReleased in BUILD_IDENTITY.json'
          });
        } else {
          expectations.push({
            rel: 'vtt-react/src/services/triggerOfferService.js',
            expected: rawId.triggerOfferServicePinnedReleased.toLowerCase(),
            role: 'dependency',
            packet: pkt.label,
            manifest: 'BUILD_IDENTITY.json:triggerOfferServicePinnedReleased'
          });
        }
      }
    }

    reviews.push(parseReviewMarkdown(path.join(pkt.dir, 'REVIEW.md'), pkt.label));
    installedChecks.push(checkInstalledJson(pkt.dir, pkt.label, finalRows));
  }

  // Detect conflicting expectations for the same path across manifests/packets.
  const byRel = new Map();
  for (const exp of expectations) {
    if (!byRel.has(exp.rel)) byRel.set(exp.rel, []);
    byRel.get(exp.rel).push(exp);
  }
  const manifestConflicts = [];
  for (const [rel, list] of byRel.entries()) {
    const distinctHashes = new Set(list.map(item => item.expected));
    if (distinctHashes.size > 1) {
      manifestConflicts.push({
        rel,
        expectations: list.map(item => ({
          packet: item.packet,
          manifest: item.manifest,
          role: item.role,
          expected: item.expected
        }))
      });
    }
  }

  const mismatches = [];
  let finalTotal = 0;
  let finalMatched = 0;
  let expectedDeletionsTotal = 0;
  let expectedDeletionsMatched = 0;
  let dependencyTotal = 0;
  let dependencyMatched = 0;

  for (const exp of expectations) {
    const observed = observeFile(sourceRoot, exp.rel);
    if (exp.role === 'final') {
      finalTotal += 1;
      if (exp.expected === 'ABSENT') expectedDeletionsTotal += 1;
    } else {
      dependencyTotal += 1;
    }

    if (exp.expected === 'ABSENT') {
      if (observed === 'ABSENT') {
        finalMatched += 1;
        expectedDeletionsMatched += 1;
      } else {
        mismatches.push({
          kind: 'expected-deletion-present',
          rel: exp.rel,
          role: exp.role,
          expected: 'ABSENT',
          observed,
          packet: exp.packet,
          manifest: exp.manifest
        });
      }
    } else if (observed === exp.expected) {
      if (exp.role === 'final') finalMatched += 1;
      else dependencyMatched += 1;
    } else {
      mismatches.push({
        kind: observed === 'ABSENT' ? 'missing-file' : 'hash-mismatch',
        rel: exp.rel,
        role: exp.role,
        expected: exp.expected,
        observed,
        packet: exp.packet,
        manifest: exp.manifest
      });
    }
  }

  const syncShared = runSyncSharedCheck(sourceRoot);
  const compositionGate = runCompositionGateCheck(
    sourceRoot,
    repoRoot,
    Boolean(options.skipCompositionGate),
    isolateGateDirectory
  );

  const hasFail =
    manifestErrors.length > 0 ||
    manifestConflicts.length > 0 ||
    mismatches.length > 0 ||
    reviews.some(r => r.status === 'FAIL') ||
    installedChecks.some(c => c.status === 'FAIL') ||
    syncShared.status === 'FAIL' ||
    compositionGate.status === 'FAIL';

  const hasUnverified =
    reviews.some(r => r.status === 'UNVERIFIED') ||
    syncShared.status === 'UNVERIFIED' ||
    compositionGate.status === 'UNVERIFIED';

  const status = hasFail ? 'FAIL' : hasUnverified ? 'UNVERIFIED' : 'PASS';

  return {
    status,
    manifestErrors,
    manifestConflicts,
    counts: {
      finalMatched,
      finalTotal,
      expectedDeletionsMatched,
      expectedDeletionsTotal,
      dependencyMatched,
      dependencyTotal
    },
    mismatches,
    reviews,
    installedChecks,
    syncShared,
    compositionGate,
    combinedFinalMap: new Map(
      expectations.filter(e => e.role === 'final').map(e => [e.rel, e.expected])
    )
  };
}

function normalizeBuildIdentity(raw, filePath) {
  if (!raw || typeof raw !== 'object') {
    throw new Error(`BUILD_IDENTITY.json is not an object: ${filePath}`);
  }
  const normSha = (val, field) => {
    if (typeof val !== 'string' || !HEX64_RE.test(val)) {
      throw new Error(`BUILD_IDENTITY.json invalid or missing ${field} in ${filePath}`);
    }
    return val.toLowerCase();
  };

  if (raw.kind === 'direct-damage-save-combined-build-identity') {
    const b = raw.build || {};
    if (typeof b.mainJs !== 'string' || !b.mainJs) {
      throw new Error(`BUILD_IDENTITY.json missing build.mainJs in ${filePath}`);
    }
    let capture = null;
    if (raw.capture && typeof raw.capture === 'object') {
      capture = {
        file: raw.capture.file || null,
        sha256: typeof raw.capture.sha256 === 'string' && HEX64_RE.test(raw.capture.sha256)
          ? raw.capture.sha256.toLowerCase()
          : null,
        equalsReviewedComposedTree: raw.capture.equalsReviewedComposedTree
      };
    }
    let embeddedFinal = null;
    if (raw.final && typeof raw.final === 'object' && !Array.isArray(raw.final)) {
      embeddedFinal = new Map();
      for (const [k, v] of Object.entries(raw.final)) {
        const rel = normalizeRelPath(k, `${filePath}:final`);
        const hash = typeof v === 'string' && v.toUpperCase() === 'ABSENT'
          ? 'ABSENT'
          : normSha(v, `final["${k}"]`);
        embeddedFinal.set(rel, hash);
      }
    }
    return {
      kind: raw.kind,
      filePath,
      capture,
      embeddedFinal,
      isolatedBuildOutput: null,
      artifacts: {
        assetManifestSha256: normSha(b.assetManifestSha256, 'build.assetManifestSha256'),
        indexHtmlSha256: normSha(b.indexHtmlSha256, 'build.indexHtmlSha256'),
        mainJs: { path: b.mainJs.replace(/^\/+/, ''), sha256: normSha(b.mainJsSha256, 'build.mainJsSha256') },
        mainCss: b.mainCss
          ? { path: b.mainCss.replace(/^\/+/, ''), sha256: normSha(b.mainCssSha256, 'build.mainCssSha256') }
          : null
      }
    };
  }

  if (raw.kind === 'hunter-flow-slice-1-build-identity') {
    const a = raw.artifacts || {};
    if (!a.mainJs || typeof a.mainJs.path !== 'string' || !a.mainJs.path) {
      throw new Error(`BUILD_IDENTITY.json missing artifacts.mainJs.path in ${filePath}`);
    }
    return {
      kind: raw.kind,
      filePath,
      capture: null,
      embeddedFinal: null,
      isolatedBuildOutput: typeof raw.isolatedBuildOutput === 'string' ? raw.isolatedBuildOutput : null,
      artifacts: {
        assetManifestSha256: normSha(a.assetManifest, 'artifacts.assetManifest'),
        indexHtmlSha256: normSha(a.indexHtml, 'artifacts.indexHtml'),
        mainJs: { path: a.mainJs.path.replace(/^\/+/, ''), sha256: normSha(a.mainJs.sha256, 'artifacts.mainJs.sha256') },
        mainCss: a.mainCss && a.mainCss.path
          ? { path: a.mainCss.path.replace(/^\/+/, ''), sha256: normSha(a.mainCss.sha256, 'artifacts.mainCss.sha256') }
          : null
      }
    };
  }

  throw new Error(`Unsupported BUILD_IDENTITY.json kind "${raw.kind}" in ${filePath}`);
}

function compareExtractedCaptureToSource(captureArchivePath, sourceRoot) {
  const capTmp = extractArchiveToTemp(captureArchivePath, 'mythrill-capture-');
  try {
    const capFiles = [];
    walkRegularFiles(capTmp, capTmp, capFiles);
    const capSet = new Set(capFiles);
    const diffs = [];

    for (const rel of capFiles) {
      const capHash = sha256File(path.join(capTmp, ...rel.split('/')));
      const srcObserved = observeFile(sourceRoot, rel);
      if (srcObserved !== capHash) {
        diffs.push({
          rel,
          expected: capHash,
          observed: srcObserved,
          reason: srcObserved === 'ABSENT' ? 'missing-in-source-dir' : 'content-differs-from-capture'
        });
      }
    }

    const srcExtraCandidates = [];
    for (const sub of ['server', 'vtt-react/src']) {
      const subDir = path.join(sourceRoot, ...sub.split('/'));
      if (fs.existsSync(subDir)) {
        walkRegularFiles(subDir, sourceRoot, srcExtraCandidates, SKIP_SOURCE_WALK_DIRS);
      }
    }
    for (const rel of srcExtraCandidates) {
      if (!capSet.has(rel)) {
        diffs.push({
          rel,
          expected: 'ABSENT',
          observed: observeFile(sourceRoot, rel),
          reason: 'extra-file-in-source-dir-not-in-capture'
        });
      }
    }

    return { ok: diffs.length === 0, checkedCaptureFiles: capFiles.length, diffs };
  } finally {
    fs.rmSync(capTmp, { recursive: true, force: true });
  }
}

function checkSourceCaptureLink(identity, sourceInfo, installedChecks, captureArg) {
  if (!identity.capture || !identity.capture.sha256) {
    return {
      status: 'UNVERIFIED',
      detail: 'BUILD_IDENTITY.json has no source capture hash (capture.sha256 missing); cannot prove recorded build came from supplied source'
    };
  }
  if (identity.capture.equalsReviewedComposedTree === false) {
    return { status: 'FAIL', detail: 'BUILD_IDENTITY.json marks capture.equalsReviewedComposedTree = false' };
  }

  for (const inst of installedChecks) {
    if (inst.postInstallCapture && inst.postInstallCapture.sha256) {
      if (inst.postInstallCapture.sha256 !== identity.capture.sha256) {
        return {
          status: 'FAIL',
          detail: `${inst.packet}/INSTALLED.json postInstallCapture.sha256 differs from BUILD_IDENTITY.json capture.sha256`,
          expected: identity.capture.sha256,
          observed: inst.postInstallCapture.sha256
        };
      }
    }
  }

  if (sourceInfo.kind === 'archive') {
    if (sourceInfo.archiveSha256 === identity.capture.sha256) {
      return {
        status: 'PASS',
        expected: identity.capture.sha256,
        observed: sourceInfo.archiveSha256,
        detail: 'Supplied capture archive SHA-256 matches BUILD_IDENTITY.json capture.sha256'
      };
    }
    return {
      status: 'FAIL',
      expected: identity.capture.sha256,
      observed: sourceInfo.archiveSha256,
      detail: 'Supplied capture archive SHA-256 does not match BUILD_IDENTITY.json capture.sha256'
    };
  }

  if (captureArg) {
    const resolvedCap = path.resolve(captureArg);
    if (!fs.existsSync(resolvedCap) || !fs.statSync(resolvedCap).isFile()) {
      return { status: 'FAIL', detail: `Supplied --capture file not found: ${resolvedCap}` };
    }
    const capSha = sha256File(resolvedCap);
    if (capSha !== identity.capture.sha256) {
      return {
        status: 'FAIL',
        expected: identity.capture.sha256,
        observed: capSha,
        detail: 'Supplied --capture archive SHA-256 does not match BUILD_IDENTITY.json capture.sha256'
      };
    }
    const cmp = compareExtractedCaptureToSource(resolvedCap, sourceInfo.root);
    if (!cmp.ok) {
      return {
        status: 'FAIL',
        expected: identity.capture.sha256,
        observed: `${cmp.diffs.length} file difference(s) vs capture`,
        diffs: cmp.diffs,
        detail: `Supplied source directory diverges from verified capture archive (${cmp.diffs.length} file diff(s))`
      };
    }
    return {
      status: 'PASS',
      expected: identity.capture.sha256,
      observed: capSha,
      checkedCaptureFiles: cmp.checkedCaptureFiles,
      detail: `Supplied source directory matches --capture archive (${cmp.checkedCaptureFiles} files) and BUILD_IDENTITY.json capture.sha256`
    };
  }

  return {
    status: 'UNVERIFIED',
    expected: identity.capture.sha256,
    detail: `BUILD_IDENTITY.json pins capture.sha256 ${identity.capture.sha256}, but --source is a directory and no --capture archive was supplied to verify directory-to-capture equivalence`
  };
}

function checkEmbeddedFinalLink(identity, combinedFinalMap, sourceRoot) {
  if (!identity.embeddedFinal) {
    return {
      status: 'UNVERIFIED',
      detail: 'BUILD_IDENTITY.json omits per-file final hash map; boolean flags like equalsInstalledFinalComposition are not cryptographically verifiable'
    };
  }

  const mismatches = [];
  for (const [rel, buildExpected] of identity.embeddedFinal.entries()) {
    if (!combinedFinalMap.has(rel)) {
      mismatches.push({
        rel,
        expected: buildExpected,
        observed: 'MISSING_IN_PACKET_FINAL',
        source: 'packet FINAL.sha256 vs BUILD_IDENTITY.json final'
      });
    } else if (combinedFinalMap.get(rel) !== buildExpected) {
      mismatches.push({
        rel,
        expected: combinedFinalMap.get(rel),
        observed: buildExpected,
        source: 'packet FINAL.sha256 vs BUILD_IDENTITY.json final'
      });
    }
    const srcObserved = observeFile(sourceRoot, rel);
    if (srcObserved !== buildExpected) {
      mismatches.push({
        rel,
        expected: buildExpected,
        observed: srcObserved,
        source: 'BUILD_IDENTITY.json final vs supplied source'
      });
    }
  }
  for (const [rel, pktExpected] of combinedFinalMap.entries()) {
    if (!identity.embeddedFinal.has(rel)) {
      mismatches.push({
        rel,
        expected: pktExpected,
        observed: 'MISSING_IN_BUILD_IDENTITY_FINAL',
        source: 'packet FINAL.sha256 vs BUILD_IDENTITY.json final'
      });
    }
  }

  return {
    status: mismatches.length === 0 ? 'PASS' : 'FAIL',
    count: identity.embeddedFinal.size,
    mismatches,
    detail: mismatches.length === 0
      ? `All ${identity.embeddedFinal.size} embedded final entries match packet FINAL.sha256 and supplied source`
      : `${mismatches.length} mismatch(es) between BUILD_IDENTITY.json final, packet FINAL.sha256, and supplied source`
  };
}

function checkBuildArtifactsOnDisk(identity, buildDirArg, repoRoot) {
  const buildDirSource = buildDirArg ? 'cli' : (identity.isolatedBuildOutput ? 'isolatedBuildOutput' : null);
  const recordedArtifactList = [
    'index.html',
    'asset-manifest.json',
    identity.artifacts.mainJs.path,
    ...(identity.artifacts.mainCss ? [identity.artifacts.mainCss.path] : [])
  ];

  if (!buildDirSource) {
    return {
      status: 'NOT_SUPPLIED',
      checkedOnDisk: false,
      buildDir: null,
      buildDirSource: null,
      assetCount: 0,
      verifiedArtifacts: [],
      missingArtifacts: [],
      mismatchedArtifacts: [],
      uncheckedRecordedArtifacts: recordedArtifactList,
      mismatches: [],
      detail: 'NOT checked on disk (no --build-dir supplied and no isolatedBuildOutput); recorded BUILD_IDENTITY.json links verified only'
    };
  }

  const resolvedBuildDir = buildDirSource === 'cli'
    ? path.resolve(buildDirArg)
    : path.resolve(repoRoot, identity.isolatedBuildOutput);

  if (!fs.existsSync(resolvedBuildDir) || !fs.statSync(resolvedBuildDir).isDirectory()) {
    const missingDirEntry = {
      kind: 'missing-artifact',
      field: 'buildDir',
      expected: 'readable directory',
      observed: 'ABSENT'
    };
    return {
      status: buildDirSource === 'isolatedBuildOutput' ? 'UNVERIFIED' : 'FAIL',
      checkedOnDisk: false,
      buildDir: displayPath(resolvedBuildDir, repoRoot),
      buildDirSource,
      assetCount: 0,
      verifiedArtifacts: [],
      missingArtifacts: [missingDirEntry],
      mismatchedArtifacts: [],
      uncheckedRecordedArtifacts: recordedArtifactList,
      mismatches: [missingDirEntry],
      detail: `Build directory does not exist: ${resolvedBuildDir}`
    };
  }

  const verifiedArtifacts = [];
  const missingArtifacts = [];
  const mismatchedArtifacts = [];
  const indexPath = path.join(resolvedBuildDir, 'index.html');
  const manifestPath = path.join(resolvedBuildDir, 'asset-manifest.json');

  if (!fs.existsSync(indexPath) || !fs.statSync(indexPath).isFile()) {
    missingArtifacts.push({
      kind: 'missing-artifact',
      field: 'index.html',
      expected: identity.artifacts.indexHtmlSha256,
      observed: 'ABSENT'
    });
  } else {
    const idxHash = sha256File(indexPath);
    if (idxHash !== identity.artifacts.indexHtmlSha256) {
      mismatchedArtifacts.push({
        kind: 'hash-mismatch',
        field: 'index.html',
        expected: identity.artifacts.indexHtmlSha256,
        observed: idxHash
      });
    } else {
      verifiedArtifacts.push({ field: 'index.html', path: 'index.html', sha256: idxHash });
    }
  }

  let manifest = null;
  if (!fs.existsSync(manifestPath) || !fs.statSync(manifestPath).isFile()) {
    missingArtifacts.push({
      kind: 'missing-artifact',
      field: 'asset-manifest.json',
      expected: identity.artifacts.assetManifestSha256,
      observed: 'ABSENT'
    });
  } else {
    const manHash = sha256File(manifestPath);
    if (manHash !== identity.artifacts.assetManifestSha256) {
      mismatchedArtifacts.push({
        kind: 'hash-mismatch',
        field: 'asset-manifest.json',
        expected: identity.artifacts.assetManifestSha256,
        observed: manHash
      });
    } else {
      verifiedArtifacts.push({ field: 'asset-manifest.json', path: 'asset-manifest.json', sha256: manHash });
    }
    try {
      manifest = readJsonStrict(manifestPath, 'asset-manifest.json');
    } catch (err) {
      mismatchedArtifacts.push({
        kind: 'invalid-manifest',
        field: 'asset-manifest.json',
        expected: 'valid JSON',
        observed: err.message
      });
    }
  }

  let assetCount = 0;
  if (manifest) {
    if (!manifest.files || typeof manifest.files !== 'object' || Array.isArray(manifest.files)) {
      mismatchedArtifacts.push({
        kind: 'invalid-manifest',
        field: 'asset-manifest.json:files',
        expected: 'files map object',
        observed: typeof manifest.files
      });
    } else {
      if (!manifest.files['main.js']) {
        missingArtifacts.push({
          kind: 'missing-artifact',
          field: 'asset-manifest.json:files["main.js"]',
          expected: identity.artifacts.mainJs.path,
          observed: 'ABSENT'
        });
      } else {
        const manifestMainJs = String(manifest.files['main.js']).replace(/^\/+/, '');
        if (manifestMainJs !== identity.artifacts.mainJs.path) {
          mismatchedArtifacts.push({
            kind: 'path-mismatch',
            field: 'mainJs.path',
            expected: identity.artifacts.mainJs.path,
            observed: manifestMainJs
          });
        }
      }
      if (identity.artifacts.mainCss && manifest.files['main.css']) {
        const manifestMainCss = String(manifest.files['main.css']).replace(/^\/+/, '');
        if (manifestMainCss !== identity.artifacts.mainCss.path) {
          mismatchedArtifacts.push({
            kind: 'path-mismatch',
            field: 'mainCss.path',
            expected: identity.artifacts.mainCss.path,
            observed: manifestMainCss
          });
        }
      }

      for (const [entry, value] of Object.entries(manifest.files)) {
        assetCount += 1;
        if (typeof value !== 'string' || !value) {
          mismatchedArtifacts.push({
            kind: 'invalid-manifest',
            field: `asset[${entry}]`,
            expected: 'non-empty local path',
            observed: String(value)
          });
          continue;
        }
        if (/^[a-z]+:\/\//i.test(value)) {
          mismatchedArtifacts.push({
            kind: 'invalid-manifest',
            field: `asset[${entry}]`,
            expected: 'local build path',
            observed: value
          });
          continue;
        }
        const assetPath = path.resolve(resolvedBuildDir, '.' + (value.startsWith('/') ? value : `/${value}`));
        if (assetPath !== resolvedBuildDir && !assetPath.startsWith(resolvedBuildDir + path.sep)) {
          mismatchedArtifacts.push({
            kind: 'invalid-manifest',
            field: `asset[${entry}]`,
            expected: 'path inside build directory',
            observed: value
          });
          continue;
        }
        if (!fs.existsSync(assetPath) || !fs.statSync(assetPath).isFile()) {
          missingArtifacts.push({
            kind: 'missing-artifact',
            field: `asset[${entry}]`,
            expected: value,
            observed: 'ABSENT'
          });
        }
      }
    }
  }

  const mainJsField = `mainJs (${identity.artifacts.mainJs.path})`;
  const mainJsAbs = path.join(resolvedBuildDir, ...identity.artifacts.mainJs.path.split('/'));
  const mainJsObs = fs.existsSync(mainJsAbs) && fs.statSync(mainJsAbs).isFile() ? sha256File(mainJsAbs) : 'ABSENT';
  if (mainJsObs === 'ABSENT') {
    missingArtifacts.push({
      kind: 'missing-artifact',
      field: mainJsField,
      expected: identity.artifacts.mainJs.sha256,
      observed: 'ABSENT'
    });
  } else if (mainJsObs !== identity.artifacts.mainJs.sha256) {
    mismatchedArtifacts.push({
      kind: 'hash-mismatch',
      field: mainJsField,
      expected: identity.artifacts.mainJs.sha256,
      observed: mainJsObs
    });
  } else {
    verifiedArtifacts.push({
      field: mainJsField,
      path: identity.artifacts.mainJs.path,
      sha256: mainJsObs
    });
  }

  if (identity.artifacts.mainCss) {
    const mainCssField = `mainCss (${identity.artifacts.mainCss.path})`;
    const mainCssAbs = path.join(resolvedBuildDir, ...identity.artifacts.mainCss.path.split('/'));
    const mainCssObs = fs.existsSync(mainCssAbs) && fs.statSync(mainCssAbs).isFile() ? sha256File(mainCssAbs) : 'ABSENT';
    if (mainCssObs === 'ABSENT') {
      missingArtifacts.push({
        kind: 'missing-artifact',
        field: mainCssField,
        expected: identity.artifacts.mainCss.sha256,
        observed: 'ABSENT'
      });
    } else if (mainCssObs !== identity.artifacts.mainCss.sha256) {
      mismatchedArtifacts.push({
        kind: 'hash-mismatch',
        field: mainCssField,
        expected: identity.artifacts.mainCss.sha256,
        observed: mainCssObs
      });
    } else {
      verifiedArtifacts.push({
        field: mainCssField,
        path: identity.artifacts.mainCss.path,
        sha256: mainCssObs
      });
    }
  }

  const mismatches = [...missingArtifacts, ...mismatchedArtifacts];
  return {
    status: mismatches.length === 0 ? 'PASS' : 'FAIL',
    checkedOnDisk: true,
    buildDir: displayPath(resolvedBuildDir, repoRoot),
    buildDirSource,
    assetCount,
    verifiedArtifacts,
    missingArtifacts,
    mismatchedArtifacts,
    uncheckedRecordedArtifacts: [],
    mismatches,
    detail: mismatches.length === 0
      ? `Checked on disk: ${verifiedArtifacts.length} core artifact(s) + ${assetCount} manifest asset(s) verified (0 missing, 0 mismatched)`
      : `Checked on disk (${displayPath(resolvedBuildDir, repoRoot)}): ${verifiedArtifacts.length} core artifact(s) verified, ${missingArtifacts.length} missing on disk, ${mismatchedArtifacts.length} hash/path mismatch(es)`
  };
}

function extractWitnessBuildHashes(raw) {
  const out = {};
  if (typeof raw.buildAssetManifestSha256 === 'string') {
    out.assetManifestSha256 = raw.buildAssetManifestSha256.toLowerCase();
  }
  if (typeof raw.assetManifestSha256 === 'string') {
    out.assetManifestSha256 = raw.assetManifestSha256.toLowerCase();
  }
  if (typeof raw.indexHtmlSha256 === 'string') {
    out.indexHtmlSha256 = raw.indexHtmlSha256.toLowerCase();
  }
  if (raw.buildIdentity && typeof raw.buildIdentity === 'object') {
    const bi = raw.buildIdentity;
    if (typeof bi.assetManifest === 'string') out.assetManifestSha256 = bi.assetManifest.toLowerCase();
    if (typeof bi.indexHtml === 'string') out.indexHtmlSha256 = bi.indexHtml.toLowerCase();
    if (bi.mainJs && typeof bi.mainJs === 'object') {
      if (typeof bi.mainJs.path === 'string') out.mainJsPath = bi.mainJs.path.replace(/^\/+/, '');
      if (typeof bi.mainJs.sha256 === 'string') out.mainJsSha256 = bi.mainJs.sha256.toLowerCase();
    }
    if (bi.mainCss && typeof bi.mainCss === 'object') {
      if (typeof bi.mainCss.path === 'string') out.mainCssPath = bi.mainCss.path.replace(/^\/+/, '');
      if (typeof bi.mainCss.sha256 === 'string') out.mainCssSha256 = bi.mainCss.sha256.toLowerCase();
    }
  }
  return out;
}

function linkWitnessToBuild(witnessHashes, identity) {
  if (!identity) {
    return { status: 'UNVERIFIED', mismatches: [], detail: 'No BUILD_IDENTITY.json to compare witness against' };
  }
  const keys = Object.keys(witnessHashes);
  if (keys.length === 0) {
    return { status: 'UNVERIFIED', mismatches: [], detail: 'Witness records no build identity hashes' };
  }
  const expectedMap = {
    assetManifestSha256: identity.artifacts.assetManifestSha256,
    indexHtmlSha256: identity.artifacts.indexHtmlSha256,
    mainJsPath: identity.artifacts.mainJs.path,
    mainJsSha256: identity.artifacts.mainJs.sha256,
    mainCssPath: identity.artifacts.mainCss ? identity.artifacts.mainCss.path : undefined,
    mainCssSha256: identity.artifacts.mainCss ? identity.artifacts.mainCss.sha256 : undefined
  };
  const mismatches = [];
  for (const [k, observed] of Object.entries(witnessHashes)) {
    const expected = expectedMap[k];
    if (expected === undefined) continue;
    if (observed !== expected) {
      mismatches.push({ field: k, expected, observed });
    }
  }
  return {
    status: mismatches.length === 0 ? 'PASS' : 'FAIL',
    mismatches,
    detail: mismatches.length === 0
      ? `Matches BUILD_IDENTITY.json (${keys.join(', ')})`
      : `${mismatches.length} build hash mismatch(es) vs BUILD_IDENTITY.json`
  };
}

function discoverWitnessFiles(packetInfos, extraWitnessPaths, repoRoot) {
  const completed = [];
  const auxiliary = [];
  const seen = new Set();

  const walkAppVerified = (dir, depth) => {
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory() || depth > 2) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (depth < 2) walkAppVerified(full, depth + 1);
        continue;
      }
      if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.json')) continue;
      if (entry.name === 'progress.json' || entry.name === 'scenarios.json') {
        auxiliary.push({
          file: displayPath(full, repoRoot),
          role: entry.name === 'progress.json' ? 'intermediate-progress' : 'auxiliary-scenarios'
        });
        continue;
      }
      if (
        entry.name === 'result.json' ||
        entry.name === 'app-witness-result.json' ||
        entry.name.endsWith('-journey.json')
      ) {
        const resolved = path.resolve(full);
        if (!seen.has(resolved)) {
          seen.add(resolved);
          completed.push(resolved);
        }
      }
    }
  };

  for (const pkt of packetInfos) {
    walkAppVerified(path.join(pkt.dir, 'app-verified'), 0);
  }
  for (const extra of extraWitnessPaths) {
    const resolved = path.resolve(extra);
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
      throw new Error(`Supplied --witness file not found: ${resolved}`);
    }
    if (!seen.has(resolved)) {
      seen.add(resolved);
      completed.push(resolved);
    }
  }
  return { completed, auxiliary };
}

function identifyDeclaredMechanic(raw) {
  if (!raw || typeof raw !== 'object') return [];
  if (raw.witness === 'direct-damage-save-app:v1') {
    return ['direct-save', 'direct-damage-save'];
  }
  if (raw.kind === 'trigger-ui-release-app-witness') {
    return ['spellbook-registration', 'trigger-ui-registration'];
  }
  if (raw.kind === 'component-trigger-family-app-witness') {
    return ['component-trigger', 'component-trigger-family'];
  }
  return [];
}

function extractProvenMechanics(raw, classification, steps) {
  if (classification !== 'gameplay-cast' && classification !== 'gameplay-workflow') {
    return [];
  }
  const mechanics = [];

  if (raw.witness === 'direct-damage-save-app:v1' && classification === 'gameplay-cast') {
    const saveCasts = (Array.isArray(raw.casts) ? raw.casts : []).filter(
      c =>
        c &&
        typeof c.commandId === 'string' &&
        c.commandId &&
        c.before &&
        c.after &&
        (c.branch === 'saved' || c.branch === 'failed') &&
        typeof c.finalAmount === 'number'
    );
    if (
      saveCasts.length > 0 &&
      saveCasts.some(c => c.branch === 'saved') &&
      saveCasts.some(c => c.branch === 'failed')
    ) {
      mechanics.push({
        id: 'direct-save',
        aliases: ['direct-save', 'direct-damage-save'],
        hasCast: true
      });
    }
  }

  if (
    raw.kind === 'trigger-ui-release-app-witness' &&
    steps.includes('spellbook-followup-register') &&
    steps.includes('revoke-and-register-component-watch')
  ) {
    mechanics.push({
      id: 'spellbook-registration',
      aliases: ['spellbook-registration', 'trigger-ui-registration'],
      hasCast: false
    });
  }

  if (raw.kind === 'component-trigger-family-app-witness' && classification === 'gameplay-cast') {
    const sc = raw.scenarios && typeof raw.scenarios === 'object' ? raw.scenarios : {};
    const qfs = sc.qualifyingFailedSave;
    const pfu = sc.paidFollowUp;
    const hasOriginReceipt = typeof qfs?.parent?.receipt === 'string' && qfs.parent.receipt.length > 0;
    const hasOffer = typeof qfs?.offer?.obligationId === 'string' && qfs.offer.obligationId.length > 0;
    const hasPaidReceipt = typeof pfu?.receipt?.commandId === 'string' && pfu.receipt.commandId.length > 0;
    const isConsumed = pfu?.closed?.state === 'consumed';
    if (hasOriginReceipt && hasOffer && hasPaidReceipt && isConsumed) {
      mechanics.push({
        id: 'component-trigger',
        aliases: ['component-trigger', 'component-trigger-family'],
        hasCast: true
      });
    }
  }

  return mechanics;
}

function classifyWitness(filePath, repoRoot) {
  const raw = readJsonStrict(filePath, displayPath(filePath, repoRoot));
  const relFile = displayPath(filePath, repoRoot);

  const hasErrors =
    (Array.isArray(raw.errors) && raw.errors.length > 0) ||
    (Array.isArray(raw.pageErrors) && raw.pageErrors.length > 0) ||
    (Array.isArray(raw.helperPageErrors) && raw.helperPageErrors.length > 0);
  const failed = raw.passed === false || raw.blocked === true || hasErrors;

  const steps = Array.isArray(raw.steps)
    ? raw.steps
        .map(s => (typeof s === 'string' ? s : s && typeof s.step === 'string' ? s.step : ''))
        .map(s => s.trim())
        .filter(Boolean)
    : [];
  const substantiveSteps = steps.filter(s => s.toUpperCase() !== 'PASS').length;

  let castCount = 0;
  if (Array.isArray(raw.casts)) {
    for (const c of raw.casts) {
      if (c && typeof c.commandId === 'string' && c.commandId && c.before && c.after) {
        castCount += 1;
      }
    }
  }
  if (raw.scenarios && typeof raw.scenarios === 'object' && !Array.isArray(raw.scenarios)) {
    for (const sc of Object.values(raw.scenarios)) {
      if (!sc || typeof sc !== 'object') continue;
      const parentCast =
        sc.parent &&
        typeof sc.parent.receipt === 'string' &&
        sc.parent.receipt &&
        ((sc.parent.resources && sc.parent.resources.before && sc.parent.resources.after) ||
          (sc.parent.damage && sc.parent.damage.before && sc.parent.damage.after));
      const directCast =
        sc.receipt &&
        typeof sc.receipt.commandId === 'string' &&
        sc.receipt.commandId &&
        sc.resources &&
        sc.resources.before &&
        sc.resources.after;
      if (parentCast || directCast) castCount += 1;
    }
  }

  const nonGameplaySignals = [];
  if (raw.enteredApp !== undefined) nonGameplaySignals.push(`enteredApp=${Boolean(raw.enteredApp)}`);
  if (raw.rootHtmlLen !== undefined) nonGameplaySignals.push(`rootHtmlLen=${raw.rootHtmlLen}`);
  if (raw.bundleAssertions && typeof raw.bundleAssertions === 'object') {
    nonGameplaySignals.push(`bundleAssertions(${Object.keys(raw.bundleAssertions).join(',')})`);
  }
  if (raw.unitTests !== undefined) nonGameplaySignals.push('unitTests');

  let classification;
  if (failed) {
    classification = 'failed';
  } else if (raw.passed === true && substantiveSteps > 0 && castCount > 0) {
    classification = 'gameplay-cast';
  } else if (raw.passed === true && substantiveSteps > 0) {
    classification = 'gameplay-workflow';
  } else if (nonGameplaySignals.length > 0) {
    classification = 'startup-and-bundle-only';
  } else {
    classification = 'insufficient';
  }

  const provenMechanics = extractProvenMechanics(raw, classification, steps);
  const declaredMechanics = identifyDeclaredMechanic(raw);

  return {
    file: relFile,
    kind: raw.witness || raw.kind || null,
    passedFlag: raw.passed === true,
    passedRaw: raw.passed === undefined ? 'absent' : raw.passed,
    classification,
    substantiveSteps,
    castCount,
    nonGameplaySignals,
    buildHashes: extractWitnessBuildHashes(raw),
    provenMechanics,
    declaredMechanics
  };
}

function parseGameplayRequirement(spec) {
  const trimmed = String(spec || '').trim();
  if (!trimmed) throw new CliUsageError('--require-gameplay requires a non-empty requirement name');
  if (trimmed === 'cast' || trimmed === 'actual-cast') {
    return { spec: trimmed, needsCast: true, topic: null };
  }
  if (trimmed.endsWith(':cast') || trimmed.endsWith('-cast')) {
    return { spec: trimmed, needsCast: true, topic: trimmed.slice(0, -5) };
  }
  if (trimmed.endsWith(':workflow')) {
    return { spec: trimmed, needsCast: false, topic: trimmed.slice(0, -9) };
  }
  return { spec: trimmed, needsCast: false, topic: trimmed };
}

function evaluateGameplayRequirements(reqSpecs, witnesses) {
  const gameplayWitnesses = witnesses.filter(
    w => w.classification === 'gameplay-cast' || w.classification === 'gameplay-workflow'
  );
  const onlyNonGameplayPresent = witnesses.length > 0 && gameplayWitnesses.length === 0;
  const presentMechanics = [...new Set(gameplayWitnesses.flatMap(w => w.provenMechanics.map(m => m.id)))];
  const results = [];

  for (const spec of reqSpecs) {
    const req = parseGameplayRequirement(spec);
    const normalizedTopic = req.topic
      ? req.topic.toLowerCase().trim().replace(/[_\s]+/g, '-')
      : null;

    const provesRequirement = w => {
      if (normalizedTopic === null) {
        return w.classification === 'gameplay-cast' && w.provenMechanics.some(m => m.hasCast);
      }
      return w.provenMechanics.some(
        m => (m.id === normalizedTopic || m.aliases.includes(normalizedTopic)) && (!req.needsCast || m.hasCast)
      );
    };

    const satisfiedBy = witnesses.filter(w => provesRequirement(w) && w.buildLink.status === 'PASS');
    if (satisfiedBy.length > 0) {
      results.push({
        spec: req.spec,
        needsCast: req.needsCast,
        status: 'PASS',
        matchedWitnesses: satisfiedBy.map(w => ({ file: w.file, classification: w.classification })),
        reason: `Satisfied by ${satisfiedBy.map(w => `${w.file} (${w.classification}, mechanics=[${w.provenMechanics.map(m => m.id).join(', ')}])`).join(', ')} (build-linked)`
      });
      continue;
    }

    const wrongBuild = witnesses.filter(w => provesRequirement(w) && w.buildLink.status === 'FAIL');
    const failedForMechanic = witnesses.filter(
      w => w.classification === 'failed' && (!normalizedTopic || w.declaredMechanics.includes(normalizedTopic))
    );

    if (wrongBuild.length > 0) {
      results.push({
        spec: req.spec,
        needsCast: req.needsCast,
        status: 'FAIL',
        matchedWitnesses: [],
        reason: `Matching witness (${wrongBuild[0].file}) failed build link against proposed BUILD_IDENTITY.json`
      });
      continue;
    }

    if (failedForMechanic.length > 0) {
      results.push({
        spec: req.spec,
        needsCast: req.needsCast,
        status: 'FAIL',
        matchedWitnesses: [],
        reason: `Witness for "${req.spec}" failed (${failedForMechanic[0].file})`
      });
      continue;
    }

    if (onlyNonGameplayPresent) {
      results.push({
        spec: req.spec,
        needsCast: req.needsCast,
        status: 'FAIL',
        matchedWitnesses: [],
        reason: `No verified gameplay witness satisfies "${req.spec}"; only startup/bundle-only evidence found (${witnesses.map(w => w.file).join(', ')}) — startup, bundle strings, and unit tests cannot satisfy a named gameplay requirement`
      });
      continue;
    }

    const unverifiedBuild = witnesses.filter(w => provesRequirement(w) && w.buildLink.status === 'UNVERIFIED');
    if (unverifiedBuild.length > 0) {
      results.push({
        spec: req.spec,
        needsCast: req.needsCast,
        status: 'UNVERIFIED',
        matchedWitnesses: [],
        reason: `Matching witness (${unverifiedBuild[0].file}) has unverified build link (BUILD_IDENTITY.json missing or witness has no build hash)`
      });
      continue;
    }

    const coverageNote = presentMechanics.length
      ? ` (present witnesses only cover: ${presentMechanics.join(', ')})`
      : '';
    results.push({
      spec: req.spec,
      needsCast: req.needsCast,
      status: 'UNVERIFIED',
      matchedWitnesses: [],
      reason: `No build-linked ${req.needsCast ? 'gameplay-cast' : 'gameplay'} witness proves mechanic "${normalizedTopic || req.spec}"${coverageNote}; requirement stays unverified`
    });
  }
  return results;
}

function verifyBuildAndGameplay(packetInfos, sourceInfo, sourceResult, options, repoRoot) {
  let buildIdentityPath = null;
  if (options.buildIdentity) {
    buildIdentityPath = path.resolve(options.buildIdentity);
    if (!fs.existsSync(buildIdentityPath) || !fs.statSync(buildIdentityPath).isFile()) {
      throw new Error(`Supplied --build-identity file not found: ${buildIdentityPath}`);
    }
  } else {
    const discovered = packetInfos
      .map(p => path.join(p.dir, 'BUILD_IDENTITY.json'))
      .filter(p => fs.existsSync(p));
    if (discovered.length > 1) {
      throw new Error(
        `Multiple packets supply BUILD_IDENTITY.json (${discovered.map(p => displayPath(p, repoRoot)).join(', ')}); pass --build-identity explicitly`
      );
    }
    buildIdentityPath = discovered[0] || null;
  }

  let identity = null;
  let buildFormatError = null;
  if (buildIdentityPath) {
    try {
      const raw = readJsonStrict(buildIdentityPath, displayPath(buildIdentityPath, repoRoot));
      identity = normalizeBuildIdentity(raw, buildIdentityPath);
    } catch (err) {
      buildFormatError = err.message;
    }
  }

  const { completed, auxiliary } = discoverWitnessFiles(
    packetInfos,
    options.witnesses || [],
    repoRoot
  );
  const witnesses = completed.map(filePath => {
    const w = classifyWitness(filePath, repoRoot);
    const buildLink = linkWitnessToBuild(w.buildHashes, identity);
    return {
      file: w.file,
      kind: w.kind,
      passedFlag: w.passedFlag,
      passedRaw: w.passedRaw,
      classification: w.classification,
      substantiveSteps: w.substantiveSteps,
      castCount: w.castCount,
      nonGameplaySignals: w.nonGameplaySignals,
      buildHashes: w.buildHashes,
      buildLink,
      provenMechanics: w.provenMechanics,
      declaredMechanics: w.declaredMechanics
    };
  });

  // Build verification checks
  let buildReport;
  if (buildFormatError) {
    buildReport = {
      status: 'FAIL',
      buildIdentityFile: displayPath(buildIdentityPath, repoRoot),
      error: buildFormatError,
      sourceCaptureLink: { status: 'FAIL', detail: buildFormatError },
      embeddedFinalLink: { status: 'FAIL', detail: buildFormatError },
      buildArtifactsOnDisk: {
        status: 'NOT_SUPPLIED',
        checkedOnDisk: false,
        verifiedArtifacts: [],
        missingArtifacts: [],
        mismatchedArtifacts: [],
        uncheckedRecordedArtifacts: [],
        mismatches: []
      },
      witnessBuildLinks: { status: 'UNVERIFIED', detail: buildFormatError }
    };
  } else if (!identity) {
    buildReport = {
      status: 'UNVERIFIED',
      buildIdentityFile: null,
      kind: null,
      sourceCaptureLink: { status: 'UNVERIFIED', detail: 'BUILD_IDENTITY.json missing' },
      embeddedFinalLink: { status: 'UNVERIFIED', detail: 'BUILD_IDENTITY.json missing' },
      buildArtifactsOnDisk: options.buildDir
        ? {
            status: 'UNVERIFIED',
            checkedOnDisk: false,
            buildDir: displayPath(options.buildDir, repoRoot),
            verifiedArtifacts: [],
            missingArtifacts: [],
            mismatchedArtifacts: [],
            uncheckedRecordedArtifacts: [],
            mismatches: [],
            detail: 'Cannot verify --build-dir without BUILD_IDENTITY.json'
          }
        : {
            status: 'NOT_SUPPLIED',
            checkedOnDisk: false,
            buildDir: null,
            buildDirSource: null,
            assetCount: 0,
            verifiedArtifacts: [],
            missingArtifacts: [],
            mismatchedArtifacts: [],
            uncheckedRecordedArtifacts: [],
            mismatches: [],
            detail: 'NOT checked on disk (no BUILD_IDENTITY.json or --build-dir)'
          },
      witnessBuildLinks: { status: 'UNVERIFIED', detail: 'BUILD_IDENTITY.json missing' }
    };
  } else {
    const sourceCaptureLink = checkSourceCaptureLink(
      identity,
      sourceInfo,
      sourceResult.installedChecks,
      options.capture || null
    );
    const embeddedFinalLink = checkEmbeddedFinalLink(
      identity,
      sourceResult.combinedFinalMap,
      sourceInfo.root
    );
    const buildArtifactsOnDisk = checkBuildArtifactsOnDisk(
      identity,
      options.buildDir || null,
      repoRoot
    );

    const anyWitnessBuildFail = witnesses.some(w => w.buildLink.status === 'FAIL');
    const anyWitnessBuildUnverified = witnesses.some(w => w.buildLink.status === 'UNVERIFIED');
    const witnessBuildStatus =
      witnesses.length === 0
        ? 'UNVERIFIED'
        : anyWitnessBuildFail
          ? 'FAIL'
          : anyWitnessBuildUnverified
            ? 'UNVERIFIED'
            : 'PASS';

    const witnessBuildLinks = {
      status: witnessBuildStatus,
      totalWitnesses: witnesses.length,
      linkedWitnesses: witnesses.filter(w => w.buildLink.status === 'PASS').length,
      detail: witnesses.length === 0
        ? 'No completed witnesses found to verify build link'
        : `${witnesses.filter(w => w.buildLink.status === 'PASS').length}/${witnesses.length} completed witness(es) match BUILD_IDENTITY.json`
    };

    const subStatuses = [
      sourceCaptureLink.status,
      embeddedFinalLink.status,
      witnessBuildLinks.status
    ];
    if (buildArtifactsOnDisk.status !== 'NOT_SUPPLIED') {
      subStatuses.push(buildArtifactsOnDisk.status);
    }

    const buildStatus = subStatuses.includes('FAIL')
      ? 'FAIL'
      : subStatuses.includes('UNVERIFIED')
        ? 'UNVERIFIED'
        : 'PASS';

    buildReport = {
      status: buildStatus,
      buildIdentityFile: displayPath(identity.filePath, repoRoot),
      kind: identity.kind,
      artifacts: identity.artifacts,
      sourceCaptureLink,
      embeddedFinalLink,
      buildArtifactsOnDisk,
      witnessBuildLinks
    };
  }

  // Gameplay verification rollup
  const requirements = evaluateGameplayRequirements(options.requireGameplay || [], witnesses);
  const gameplayWitnesses = witnesses.filter(
    w => w.classification === 'gameplay-cast' || w.classification === 'gameplay-workflow'
  );
  const hasFailedWitness = witnesses.some(w => w.classification === 'failed');
  const hasFailedReq = requirements.some(r => r.status === 'FAIL');
  const hasUnverifiedReq = requirements.some(r => r.status === 'UNVERIFIED');
  const hasGameplayBuildFail = gameplayWitnesses.some(w => w.buildLink.status === 'FAIL');
  const hasGameplayBuildUnverified = gameplayWitnesses.some(w => w.buildLink.status === 'UNVERIFIED');
  const onlyNonGameplayPresent = witnesses.length > 0 && gameplayWitnesses.length === 0;

  let gameplayStatus;
  if (hasFailedWitness || hasFailedReq || hasGameplayBuildFail || onlyNonGameplayPresent) {
    gameplayStatus = 'FAIL';
  } else if (witnesses.length === 0 || hasUnverifiedReq || hasGameplayBuildUnverified) {
    gameplayStatus = 'UNVERIFIED';
  } else {
    gameplayStatus = 'PASS';
  }

  const publicWitnesses = witnesses.map(({ declaredMechanics, provenMechanics, ...rest }) => ({
    ...rest,
    provenMechanics: provenMechanics.map(m => m.id)
  }));

  return {
    build: buildReport,
    gameplay: {
      status: gameplayStatus,
      witnesses: publicWitnesses,
      auxiliaryFiles: auxiliary,
      requirements,
      summary: {
        totalWitnesses: publicWitnesses.length,
        gameplayCast: publicWitnesses.filter(w => w.classification === 'gameplay-cast').length,
        gameplayWorkflow: publicWitnesses.filter(w => w.classification === 'gameplay-workflow').length,
        startupOrBundleOnly: publicWitnesses.filter(w => w.classification === 'startup-and-bundle-only').length,
        insufficient: publicWitnesses.filter(w => w.classification === 'insufficient').length,
        failed: publicWitnesses.filter(w => w.classification === 'failed').length
      }
    }
  };
}

function collectLimits(sourceInfo, sourceResult, buildReport, gameplayReport, options) {
  const limits = [
    'Read-only preflight: performs no live edits, builds, Playwright runs, re-pinning, or deployment.'
  ];
  if (buildReport.buildArtifactsOnDisk && buildReport.buildArtifactsOnDisk.status === 'NOT_SUPPLIED') {
    limits.push(
      'No --build-dir was supplied and BUILD_IDENTITY.json has no isolatedBuildOutput; compiled bundle files on disk were not re-hashed.'
    );
  }
  if (sourceResult.compositionGate && sourceResult.compositionGate.skipped) {
    limits.push('Server composition-preservation gate was skipped (--skip-composition-gate).');
  }
  if (sourceInfo.kind === 'directory' && !options.capture) {
    limits.push('Supplied --source is a directory without --capture; capture tarball equivalence could not be checked.');
  }
  if (!buildReport.buildIdentityFile || (buildReport.sourceCaptureLink && buildReport.sourceCaptureLink.status === 'UNVERIFIED')) {
    limits.push('BUILD_IDENTITY.json lacks a verifiable source capture link to prove the build was compiled from the supplied source.');
  }
  if (gameplayReport.witnesses.some(w => w.classification === 'startup-and-bundle-only')) {
    limits.push('Startup/bundle-only checks do not prove gameplay casts or room-authority workflows.');
  }
  return limits;
}

function runPreflight(options = {}) {
  const repoRoot = path.resolve(options.repoRoot || DEFAULT_REPO_ROOT);
  const packetArgs = Array.isArray(options.packets) ? options.packets : [];
  if (packetArgs.length === 0) {
    throw new CliUsageError('At least one --packet <dir> is required');
  }
  if (!options.source) {
    throw new CliUsageError('--source <dir-or-tgz> is required');
  }

  const packetInfos = packetArgs.map(p => {
    const resolved = path.resolve(p);
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
      throw new Error(`Packet directory not found: ${resolved}`);
    }
    return { dir: resolved, label: displayPath(resolved, repoRoot) };
  });

  const resolvedSource = path.resolve(options.source);
  if (!fs.existsSync(resolvedSource)) {
    throw new Error(`Supplied --source does not exist: ${resolvedSource}`);
  }

  const sourceStat = fs.statSync(resolvedSource);
  let tempExtractRoot = null;
  let sourceInfo;

  try {
    if (sourceStat.isFile()) {
      if (!isArchivePath(resolvedSource)) {
        throw new Error(`Supplied --source file must be a directory or .tgz/.tar.gz archive: ${resolvedSource}`);
      }
      tempExtractRoot = extractArchiveToTemp(resolvedSource, 'mythrill-source-');
      sourceInfo = {
        kind: 'archive',
        input: displayPath(resolvedSource, repoRoot),
        archiveSha256: sha256File(resolvedSource),
        root: tempExtractRoot
      };
    } else if (sourceStat.isDirectory()) {
      sourceInfo = {
        kind: 'directory',
        input: displayPath(resolvedSource, repoRoot),
        archiveSha256: null,
        root: resolvedSource
      };
    } else {
      throw new Error(`Unsupported --source type: ${resolvedSource}`);
    }

    const sourceResult = verifySourcePillar(
      packetInfos,
      sourceInfo.root,
      repoRoot,
      options,
      sourceInfo.kind === 'directory'
    );
    const { build, gameplay } = verifyBuildAndGameplay(packetInfos, sourceInfo, sourceResult, options, repoRoot);

    const { combinedFinalMap, ...publicSource } = sourceResult;
    const pillarStatuses = [publicSource.status, build.status, gameplay.status];
    const overall = pillarStatuses.includes('FAIL')
      ? 'FAIL'
      : pillarStatuses.includes('UNVERIFIED')
        ? 'UNVERIFIED'
        : 'PASS';
    const exitCode = overall === 'PASS' ? 0 : overall === 'FAIL' ? 1 : 2;
    const limits = collectLimits(sourceInfo, publicSource, build, gameplay, options);

    return {
      overall,
      exitCode,
      packets: packetInfos.map(p => p.label),
      sourceInput: {
        kind: sourceInfo.kind,
        path: sourceInfo.input,
        archiveSha256: sourceInfo.archiveSha256
      },
      source: publicSource,
      build,
      gameplay,
      limits
    };
  } finally {
    if (tempExtractRoot) {
      fs.rmSync(tempExtractRoot, { recursive: true, force: true });
    }
  }
}

function formatReport(report) {
  const lines = [];
  lines.push('MYTHRILL RELEASE PREFLIGHT (READ-ONLY)');
  lines.push(`Overall : ${report.overall} (exit ${report.exitCode})`);
  lines.push(`Packets : ${report.packets.join(', ')}`);
  lines.push(
    `Source  : ${report.sourceInput.path} (${report.sourceInput.kind}` +
      `${report.sourceInput.archiveSha256 ? `, sha256=${report.sourceInput.archiveSha256}` : ''})`
  );
  lines.push('');

  // [1/3] SOURCE VERIFICATION
  const s = report.source;
  lines.push(`[1/3] SOURCE VERIFICATION: ${s.status}`);
  lines.push(
    `  Final hashes       : ${s.counts.finalMatched}/${s.counts.finalTotal} matched` +
      ` (expected deletions ABSENT: ${s.counts.expectedDeletionsMatched}/${s.counts.expectedDeletionsTotal})`
  );
  lines.push(`  Pinned dependencies: ${s.counts.dependencyMatched}/${s.counts.dependencyTotal} matched`);
  for (const r of s.reviews) {
    lines.push(`  Review             : [${r.status}] ${r.packet} — ${r.detail}`);
  }
  for (const inst of s.installedChecks) {
    if (!inst.present) continue;
    lines.push(
      `  INSTALLED.json     : ${inst.packet} [${inst.status}]` +
        (inst.mismatches.length ? ` (${inst.mismatches.length} mismatch(es))` : ' (matches FINAL.sha256)')
    );
  }
  lines.push(`  sync-shared --check: [${s.syncShared.status}] ${s.syncShared.detail}`);
  lines.push(`  Composition gate   : [${s.compositionGate.status}] ${s.compositionGate.detail}`);
  for (const err of s.manifestErrors) {
    lines.push(`  MANIFEST ERROR     : ${err.packet} — ${err.detail}`);
  }
  for (const c of s.manifestConflicts) {
    lines.push(`  MANIFEST CONFLICT  : ${c.rel}`);
    for (const e of c.expectations) {
      lines.push(`    - ${e.packet} (${e.manifest}): ${e.expected}`);
    }
  }
  if (s.mismatches.length > 0) {
    lines.push(`  Source mismatches (${s.mismatches.length}):`);
    for (const m of s.mismatches) {
      lines.push(`    - [${m.kind}] ${m.rel} (role: ${m.role}, packet: ${m.packet}, manifest: ${m.manifest})`);
      lines.push(`        expected: ${m.expected}`);
      lines.push(`        observed: ${m.observed}`);
    }
  }
  if (s.compositionGate.status === 'FAIL') {
    for (const f of s.compositionGate.failures || []) {
      lines.push(`    - gate failure: ${f.title}${f.message ? ` — ${f.message}` : ''}`);
    }
    for (const title of s.compositionGate.missingRequired || []) {
      lines.push(`    - missing required check: ${title}`);
    }
    for (const title of s.compositionGate.unexpectedPending || []) {
      lines.push(`    - unexpected pending check: ${title}`);
    }
  }
  lines.push('');

  // [2/3] BUILD VERIFICATION
  const b = report.build;
  lines.push(`[2/3] BUILD VERIFICATION: ${b.status}`);
  lines.push(`  BUILD_IDENTITY.json: ${b.buildIdentityFile || '(missing)'}${b.kind ? ` (kind=${b.kind})` : ''}`);
  if (b.error) {
    lines.push(`  Format error       : ${b.error}`);
  }
  if (b.sourceCaptureLink) {
    lines.push(`  Source capture link: [${b.sourceCaptureLink.status}] ${b.sourceCaptureLink.detail}`);
    if (b.sourceCaptureLink.status === 'FAIL' && b.sourceCaptureLink.expected) {
      lines.push(`      expected: ${b.sourceCaptureLink.expected}`);
      lines.push(`      observed: ${b.sourceCaptureLink.observed}`);
    }
    if (b.sourceCaptureLink.diffs && b.sourceCaptureLink.diffs.length > 0) {
      for (const d of b.sourceCaptureLink.diffs.slice(0, 10)) {
        lines.push(`      diff (${d.reason}): ${d.rel} (expected=${d.expected}, observed=${d.observed})`);
      }
      if (b.sourceCaptureLink.diffs.length > 10) {
        lines.push(`      ... and ${b.sourceCaptureLink.diffs.length - 10} more diff(s)`);
      }
    }
  }
  if (b.embeddedFinalLink) {
    lines.push(`  Embedded final map : [${b.embeddedFinalLink.status}] ${b.embeddedFinalLink.detail}`);
    for (const m of b.embeddedFinalLink.mismatches || []) {
      lines.push(`      - ${m.rel} (${m.source}): expected=${m.expected}, observed=${m.observed}`);
    }
  }
  if (b.buildArtifactsOnDisk) {
    const d = b.buildArtifactsOnDisk;
    if (d.status === 'NOT_SUPPLIED') {
      lines.push(`  Build dir on disk  : [NOT_CHECKED_ON_DISK] (none) — ${d.detail}`);
      if (Array.isArray(d.uncheckedRecordedArtifacts) && d.uncheckedRecordedArtifacts.length > 0) {
        lines.push(`      unchecked recorded artifacts: ${d.uncheckedRecordedArtifacts.join(', ')}`);
      }
    } else if (d.checkedOnDisk) {
      lines.push(`  Build dir on disk  : [${d.status}] ${d.buildDir} (via ${d.buildDirSource}) — ${d.detail}`);
      if (Array.isArray(d.verifiedArtifacts) && d.verifiedArtifacts.length > 0) {
        lines.push(`      verified on disk: ${d.verifiedArtifacts.map(a => a.field).join(', ')}`);
      }
      for (const m of d.missingArtifacts || []) {
        lines.push(`      - [missing-artifact] ${m.field}: expected=${m.expected}, observed=${m.observed}`);
      }
      for (const m of d.mismatchedArtifacts || []) {
        lines.push(`      - [${m.kind}] ${m.field}: expected=${m.expected}, observed=${m.observed}`);
      }
    } else {
      lines.push(`  Build dir on disk  : [${d.status}] ${d.buildDir || '(none)'} — ${d.detail || ''}`);
      if (Array.isArray(d.uncheckedRecordedArtifacts) && d.uncheckedRecordedArtifacts.length > 0) {
        lines.push(`      unchecked recorded artifacts: ${d.uncheckedRecordedArtifacts.join(', ')}`);
      }
    }
  }
  if (b.witnessBuildLinks) {
    lines.push(`  Witness build links: [${b.witnessBuildLinks.status}] ${b.witnessBuildLinks.detail}`);
  }
  lines.push('');

  // [3/3] GAMEPLAY EVIDENCE
  const g = report.gameplay;
  lines.push(`[3/3] GAMEPLAY EVIDENCE: ${g.status}`);
  lines.push(
    `  Summary: ${g.summary.totalWitnesses} witness(es) — ` +
      `gameplay-cast=${g.summary.gameplayCast}, gameplay-workflow=${g.summary.gameplayWorkflow}, ` +
      `startup-and-bundle-only=${g.summary.startupOrBundleOnly}, insufficient=${g.summary.insufficient}, failed=${g.summary.failed}`
  );
  for (const w of g.witnesses) {
    const signals = w.nonGameplaySignals.length ? `, nonGameplay=[${w.nonGameplaySignals.join(', ')}]` : '';
    const mechs = w.provenMechanics.length ? w.provenMechanics.join(',') : 'none';
    lines.push(
      `  - ${w.file}: class=${w.classification}, mechanics=[${mechs}], passed=${w.passedRaw}, steps=${w.substantiveSteps}, ` +
        `casts=${w.castCount}, buildLink=${w.buildLink.status}${signals}`
    );
    for (const m of w.buildLink.mismatches || []) {
      lines.push(`      build mismatch ${m.field}: expected=${m.expected}, observed=${m.observed}`);
    }
  }
  if (g.auxiliaryFiles.length > 0) {
    lines.push(
      `  Auxiliary non-final files (not counted as gameplay evidence): ` +
        g.auxiliaryFiles.map(a => `${a.file} (${a.role})`).join(', ')
    );
  }
  if (g.requirements.length > 0) {
    lines.push('  Named gameplay requirements:');
    for (const req of g.requirements) {
      lines.push(`    - [${req.status}] ${req.spec}: ${req.reason}`);
    }
  }
  lines.push('');

  lines.push('DISCLOSED LIMITS:');
  for (const lim of report.limits) {
    lines.push(`  - ${lim}`);
  }
  return lines.join('\n') + '\n';
}

function parseCliArgs(argv) {
  const opts = {
    packets: [],
    witnesses: [],
    requireGameplay: [],
    skipCompositionGate: false,
    json: false,
    help: false
  };

  const readVal = (idx, flag) => {
    const arg = argv[idx];
    const eq = arg.indexOf('=');
    if (eq !== -1) return { value: arg.slice(eq + 1), nextIdx: idx };
    if (idx + 1 >= argv.length) throw new CliUsageError(`${flag} requires a value`);
    return { value: argv[idx + 1], nextIdx: idx + 1 };
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const flag = arg.includes('=') ? arg.slice(0, arg.indexOf('=')) : arg;
    if (flag === '--help' || flag === '-h') {
      opts.help = true;
    } else if (flag === '--json') {
      opts.json = true;
    } else if (flag === '--skip-composition-gate') {
      opts.skipCompositionGate = true;
    } else if (flag === '--packet') {
      const r = readVal(i, flag);
      opts.packets.push(r.value);
      i = r.nextIdx;
    } else if (flag === '--source') {
      const r = readVal(i, flag);
      opts.source = r.value;
      i = r.nextIdx;
    } else if (flag === '--capture') {
      const r = readVal(i, flag);
      opts.capture = r.value;
      i = r.nextIdx;
    } else if (flag === '--build-identity') {
      const r = readVal(i, flag);
      opts.buildIdentity = r.value;
      i = r.nextIdx;
    } else if (flag === '--build-dir') {
      const r = readVal(i, flag);
      opts.buildDir = r.value;
      i = r.nextIdx;
    } else if (flag === '--witness') {
      const r = readVal(i, flag);
      opts.witnesses.push(r.value);
      i = r.nextIdx;
    } else if (flag === '--require-gameplay') {
      const r = readVal(i, flag);
      opts.requireGameplay.push(r.value);
      i = r.nextIdx;
    } else if (flag === '--repo-root') {
      const r = readVal(i, flag);
      opts.repoRoot = r.value;
      i = r.nextIdx;
    } else {
      throw new CliUsageError(`Unknown argument: ${arg}`);
    }
  }
  return opts;
}

function usageText() {
  return [
    'Usage: node tools/release-preflight/release-preflight.cjs [options]',
    '',
    'Options:',
    '  --packet <dir>              Reviewed packet directory (repeatable, required)',
    '  --source <dir-or-tgz>       Supplied source tree dir or .tgz capture (required)',
    '  --capture <tgz>             Optional capture .tgz to verify directory source equivalence',
    '  --build-identity <json>     Explicit BUILD_IDENTITY.json (auto-discovered if 1 packet supplies it)',
    '  --build-dir <dir>           Compiled build directory to verify on disk',
    '  --witness <json>            Additional witness JSON file (repeatable)',
    '  --require-gameplay <spec>   Named gameplay requirement (e.g. direct-save:cast)',
    '  --repo-root <dir>           Repo root for locating helpers (defaults to D:\\VTT)',
    '  --skip-composition-gate     Skip runCompositionGate.cjs (marks Source UNVERIFIED)',
    '  --json                      Emit JSON instead of text report',
    '  --help, -h                  Show this help',
    '',
    'Exit codes: 0 = PASS (all 3 pillars PASS), 1 = FAIL, 2 = UNVERIFIED'
  ].join('\n') + '\n';
}

function main(argv = process.argv.slice(2)) {
  let opts;
  try {
    opts = parseCliArgs(argv);
    if (opts.help) {
      process.stdout.write(usageText());
      return 0;
    }
    const report = runPreflight(opts);
    if (opts.json) {
      process.stdout.write(JSON.stringify(report, null, 2) + '\n');
    } else {
      process.stdout.write(formatReport(report));
    }
    return report.exitCode;
  } catch (err) {
    if (err instanceof CliUsageError) {
      process.stderr.write(`PREFLIGHT ERROR: ${err.message}\n\n${usageText()}`);
    } else {
      process.stderr.write(`PREFLIGHT ERROR: ${err && err.message ? err.message : String(err)}\n`);
    }
    return 1;
  }
}

if (require.main === module) {
  process.exit(main());
}

module.exports = {
  runPreflight,
  formatReport,
  parseCliArgs,
  CliUsageError
};
