#!/usr/bin/env node
'use strict';

const assert = require('assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const DEFAULT_ROOT = path.resolve(__dirname, '..', '..');

function parseArgs(argv) {
  const opts = {
    mode: 'strict',
    root: DEFAULT_ROOT,
    mapPath: null,
    backupDir: null,
    json: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--strict') {
      opts.mode = 'strict';
    } else if (arg === '--diagnostic') {
      opts.mode = 'diagnostic';
    } else if (arg === '--propose-pin-update') {
      opts.mode = 'propose-pin-update';
    } else if (arg === '--apply-pin-update') {
      opts.mode = 'apply-pin-update';
    } else if (arg === '--json') {
      opts.json = true;
    } else if (arg === '--root') {
      i += 1;
      if (!argv[i]) throw new Error('--root requires a directory path');
      opts.root = path.resolve(argv[i]);
    } else if (arg === '--map') {
      i += 1;
      if (!argv[i]) throw new Error('--map requires a file path');
      opts.mapPath = path.resolve(argv[i]);
    } else if (arg === '--backup-dir') {
      i += 1;
      if (!argv[i]) throw new Error('--backup-dir requires a directory path');
      opts.backupDir = path.resolve(argv[i]);
    } else if (arg === '--help' || arg === '-h') {
      opts.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!opts.mapPath) {
    opts.mapPath = path.join(opts.root, 'server', 'tests', 'fixtures', 'capabilityMap.json');
  }
  if (!opts.backupDir) {
    opts.backupDir = path.join(path.dirname(opts.mapPath), 'backups');
  }

  return opts;
}

function validateRootAndMap(root, mapPath) {
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    throw new Error(`Invalid root directory (refusing fallback): ${root}`);
  }
  const serverDir = path.join(root, 'server');
  const clientDir = path.join(root, 'vtt-react');
  if (!fs.existsSync(serverDir) || !fs.existsSync(clientDir)) {
    throw new Error(`Wrong root directory (missing server/ or vtt-react/, refusing fallback): ${root}`);
  }
  if (!fs.existsSync(mapPath) || !fs.statSync(mapPath).isFile()) {
    throw new Error(`Missing capability map fixture: ${mapPath}`);
  }
  const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  for (const key of ['sourceIdentities', 'stagedCandidatesNotInstalled', 'families', 'checks']) {
    if (!map || typeof map !== 'object' || !(key in map)) {
      throw new Error(`Invalid capability map fixture (${mapPath}): missing "${key}"`);
    }
  }
  return map;
}

function requireFromRoot(root, relPath) {
  const fullPath = path.join(root, relPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing required module in root (${root}): ${relPath}`);
  }
  return require(fullPath);
}

function sha256File(root, relPath) {
  const fullPath = path.join(root, relPath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const bytes = fs.readFileSync(fullPath);
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function loadJson(root, relPath) {
  const fullPath = path.join(root, relPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing fixture file in root (${root}): ${relPath}`);
  }
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

function checkSourceIdentities(root, map) {
  const matched = [];
  const drifted = [];
  const missing = [];

  for (const [relPath, expectedPrefix] of Object.entries(map.sourceIdentities)) {
    const actual = sha256File(root, relPath);
    if (actual === null) {
      missing.push({ relPath, expectedPrefix, actual: null, status: 'missing' });
    } else if (!actual.startsWith(expectedPrefix)) {
      drifted.push({ relPath, expectedPrefix, actual, status: 'drifted' });
    } else {
      matched.push({ relPath, expectedPrefix, actual, status: 'matched' });
    }
  }

  return { matched, drifted, missing };
}

function checkCandidatesAndGovernance(root, map) {
  const failures = [];

  if (!map.rules || map.rules.keepCandidateInstalledAppVerifiedSeparate !== true) {
    failures.push('map.rules.keepCandidateInstalledAppVerifiedSeparate must be true');
  }
  if (!map.rules || map.rules.unsupportedRowsAreNotPassingGameplayTests !== true) {
    failures.push('map.rules.unsupportedRowsAreNotPassingGameplayTests must be true');
  }

  for (const cand of map.stagedCandidatesNotInstalled) {
    if (cand.status !== 'candidate-only' || cand.installed !== false) {
      failures.push(`Staged candidate ${cand.id} must remain status=candidate-only and installed=false`);
    }
    if (cand.targetFile && cand.liveHashPrefix) {
      const actual = sha256File(root, cand.targetFile);
      if (actual === null) {
        failures.push(`Staged candidate ${cand.id} target file missing: ${cand.targetFile}`);
      } else {
        if (cand.stagedFinalHashPrefix && actual.startsWith(cand.stagedFinalHashPrefix)) {
          failures.push(`Staged candidate ${cand.id} appears installed at ${cand.targetFile} (${actual.slice(0, 16)}...)`);
        } else if (!actual.startsWith(cand.liveHashPrefix)) {
          failures.push(`Staged candidate ${cand.id} target ${cand.targetFile} drifted from live hash ${cand.liveHashPrefix} (got ${actual.slice(0, 16)}...)`);
        }
      }
    }
  }

  const allowedStatuses = new Set(['candidate-only', 'installed', 'app-verified', 'unsupported']);
  for (const fam of map.families) {
    if (!allowedStatuses.has(fam.status)) {
      failures.push(`Family ${fam.id} has invalid status: ${fam.status}`);
      continue;
    }
    if (fam.status === 'app-verified') {
      if (fam.evidenceLevel !== 'ordinary-app' || !fam.evidenceProvenance) {
        failures.push(`Family ${fam.id} cannot claim app-verified without evidenceLevel=ordinary-app and evidenceProvenance`);
      }
    }
    if (fam.status === 'installed') {
      if (!['real-handler', 'ordinary-app'].includes(fam.evidenceLevel) || !fam.evidenceProvenance) {
        failures.push(`Family ${fam.id} cannot claim installed without real-handler or ordinary-app provenance`);
      }
    }
  }

  return failures;
}

function parseSha256Sums(filePath) {
  if (!fs.existsSync(filePath)) return new Map();
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  const out = new Map();
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = /^([a-f0-9]{64})\s+(.+)$/i.exec(trimmed);
    if (match) {
      out.set(match[2].replace(/\\/g, '/').trim(), match[1].toLowerCase());
    }
  }
  return out;
}

function discoverAcceptedProvenance(root, relPath, expectedPrefix, actualHash) {
  const handoffDir = path.join(root, 'handoff');
  if (!fs.existsSync(handoffDir) || !fs.statSync(handoffDir).isDirectory()) {
    return { attested: false, reason: 'No handoff/ directory found' };
  }

  const normRel = relPath.replace(/\\/g, '/');
  const entries = fs.readdirSync(handoffDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const packetDir = path.join(handoffDir, entry.name);
    const installedPath = path.join(packetDir, 'INSTALLED.json');
    if (!fs.existsSync(installedPath)) continue;

    let installed;
    try {
      installed = JSON.parse(fs.readFileSync(installedPath, 'utf8'));
    } catch {
      continue;
    }
    const files = Array.isArray(installed.files) ? installed.files : [];
    const fileRec = files.find(f => (f.rel || '').replace(/\\/g, '/') === normRel && f.hash === actualHash);
    if (!fileRec) continue;

    const reviewPath = path.join(packetDir, 'REVIEW.md');
    if (!fs.existsSync(reviewPath)) {
      return { attested: false, reason: `Matched INSTALLED.json in handoff/${entry.name}/ but missing REVIEW.md` };
    }
    const reviewText = fs.readFileSync(reviewPath, 'utf8');
    if (!/(?:\*\*)?Verdict:\s*ACCEPT(?:\*\*)?/i.test(reviewText)) {
      return { attested: false, reason: `Matched INSTALLED.json in handoff/${entry.name}/ but REVIEW.md does not record Verdict: ACCEPT` };
    }

    const finalSums = parseSha256Sums(path.join(packetDir, 'FINAL.sha256'));
    if (finalSums.size > 0 && finalSums.get(normRel) !== actualHash) {
      return { attested: false, reason: `FINAL.sha256 mismatch in handoff/${entry.name}/ for ${normRel}` };
    }

    const baseSums = parseSha256Sums(path.join(packetDir, 'BASE.sha256'));
    const baseHash = baseSums.get(normRel) || null;
    if (baseHash && !baseHash.startsWith(expectedPrefix)) {
      return {
        attested: false,
        reason: `BASE.sha256 in handoff/${entry.name}/ (${baseHash.slice(0, 16)}...) does not match pinned prefix ${expectedPrefix}`
      };
    }

    return {
      attested: true,
      packet: `handoff/${entry.name}/`,
      installedAt: installed.installedAt || null,
      reviewVerdict: 'ACCEPT',
      baseHash,
      finalHash: actualHash
    };
  }

  return {
    attested: false,
    reason: 'No accepted release provenance (INSTALLED.json + REVIEW.md ACCEPT + matching hashes) found'
  };
}

function buildPinUpdateProposals(root, map, identityReport) {
  return identityReport.drifted.map(item => ({
    relPath: item.relPath,
    oldPin: item.expectedPrefix,
    newPin: item.actual,
    provenance: discoverAcceptedProvenance(root, item.relPath, item.expectedPrefix, item.actual)
  }));
}

function applyPinUpdate(root, mapPath, map, backupDir, proposals) {
  if (proposals.length === 0) {
    return { applied: false, reason: 'No drifted source identities to reconcile', backupPath: null, changes: [] };
  }

  const unattested = proposals.filter(p => !p.provenance.attested);
  if (unattested.length > 0) {
    const details = unattested.map(u => `${u.relPath}: ${u.provenance.reason}`).join('; ');
    throw new Error(`Refusing to update unattested pins: ${details}`);
  }

  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `${path.basename(mapPath, '.json')}.backup.${stamp}.json`);
  fs.copyFileSync(mapPath, backupPath);

  const updated = JSON.parse(JSON.stringify(map));
  if (!Array.isArray(updated.reconciledReleases)) {
    updated.reconciledReleases = [];
  }

  const byPacket = new Map();
  const changes = [];
  for (const p of proposals) {
    updated.sourceIdentities[p.relPath] = p.newPin;
    const change = { file: p.relPath, from: p.oldPin, to: p.newPin };
    changes.push(change);
    const key = p.provenance.packet;
    if (!byPacket.has(key)) {
      byPacket.set(key, {
        reconciledAt: new Date().toISOString(),
        packet: p.provenance.packet,
        installedAt: p.provenance.installedAt,
        reviewVerdict: p.provenance.reviewVerdict,
        changes: []
      });
    }
    byPacket.get(key).changes.push(change);
  }

  for (const rec of byPacket.values()) {
    updated.reconciledReleases.push(rec);
  }

  fs.writeFileSync(mapPath, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');
  return { applied: true, backupPath, changes };
}

function classifyCheck(check) {
  if (check.kind === 'real-handler') {
    if (check.expectOutcome === 'executable') return 'executable';
    if (
      check.expectOutcome === 'structurally-valid-route-unsupported' ||
      check.expectOutcome === 'authority-forbidden'
    ) {
      return 'refusal';
    }
  } else if (check.kind === 'compiler-and-plan') {
    if (check.expectCompiled === true && (check.expectExecutableClaim === true || check.expectWholeExecutable === true)) return 'executable';
    if (check.expectCompiled === false) return 'refusal';
  } else if (check.kind === 'passive-descriptor') {
    if (check.expectCompilerRefused === true) return 'refusal';
  }
  throw new Error(`Ambiguous or unsupported check classification for ${check.id}`);
}

function wrapRecord(draft) {
  const copy = JSON.parse(JSON.stringify(draft));
  delete copy.authoredDraft;
  delete copy.serializedData;
  return {
    ...copy,
    authoredDefinitionId: copy.authoredDefinitionId || crypto.randomUUID(),
    authoredDraft: copy
  };
}

function createFixtureLoaders(root) {
  const { recordFor } = requireFromRoot(root, 'server/tests/fixtures/componentCompatibilityRecords.cjs');
  const compatFixtures = loadJson(root, 'server/tests/fixtures/componentCompatibility.json');

  function boundaryRecord(kind) {
    const base = JSON.parse(JSON.stringify(recordFor({ kind: 'damage', formula: '1d8+2' }).authoredDraft));
    if (kind === 'boundary:area-cone') {
      base.targetingConfig = {
        targetingType: 'area',
        aoeShape: 'cone',
        aoeType: 'cone',
        aoeParameters: { angle: 60, range: 30 },
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemy'],
        selectionMethod: 'manual',
        targetSelectionMethod: 'manual',
        movementBehavior: 'static'
      };
      return wrapRecord(base);
    }
    if (kind === 'boundary:area-component-watch') {
      base.targetingConfig = {
        targetingType: 'area',
        aoeShape: 'circle',
        aoeType: 'circle',
        aoeParameters: { radius: 15 },
        rangeType: 'ranged',
        rangeDistance: 60,
        maxTargets: 4,
        targetRestrictions: ['enemy'],
        selectionMethod: 'manual',
        targetSelectionMethod: 'manual',
        movementBehavior: 'static'
      };
      base.triggerConfig = {
        global: { logicType: 'AND', compoundTriggers: [] },
        effectTriggers: {
          damage_direct: {
            logicType: 'AND',
            targetingOverride: null,
            compoundTriggers: [{ id: 'follow_up_after_damage', category: 'combat', name: 'Follow-up After My Damage', parameters: {} }]
          }
        },
        conditionalEffects: {},
        buffDebuffTriggers: {},
        requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
        triggerRole: { mode: 'CONDITIONAL' }
      };
      return wrapRecord(base);
    }
    if (kind === 'boundary:crit-damage') {
      base.damageConfig.canCrit = true;
      return wrapRecord(base);
    }
    if (kind === 'boundary:shield-healing') {
      const heal = JSON.parse(JSON.stringify(recordFor({ kind: 'healing', formula: '1d8+2' }).authoredDraft));
      heal.healingConfig.hasShieldEffect = true;
      return wrapRecord(heal);
    }
    if (kind === 'boundary:generic-buff') {
      base.effectTypes = ['buff'];
      base.effectsMap = { buff: true };
      delete base.damageConfig;
      base.buffConfig = { buffType: 'statEnhancement', effects: [{ stat: 'strength', magnitude: 2 }] };
      return wrapRecord(base);
    }
    if (kind === 'boundary:partial-save') {
      return recordFor({ kind: 'damage', formula: '1d8+2', rider: 'movement', save: 'halves' });
    }
    if (kind === 'boundary:direct-save') {
      base.damageConfig.savingThrow = true;
      return wrapRecord(base);
    }
    if (kind === 'boundary:duration-rounds') {
      base.durationConfig = { durationType: 'rounds', durationValue: 3 };
      return wrapRecord(base);
    }
    if (kind === 'boundary:legacy-turn-cooldown') {
      base.cooldownConfig = { cooldownType: 'turn_based', cooldownValue: 3 };
      return wrapRecord(base);
    }
    if (kind === 'boundary:spell-summoning') {
      base.effectTypes = ['summoning'];
      base.effectsMap = { summoning: true };
      delete base.damageConfig;
      base.summoningConfig = { creatureId: 'wolf_1', count: 1 };
      return wrapRecord(base);
    }
    if (kind === 'boundary:resource-formula') {
      base.resourceCost.useFormulas = { mana: true };
      base.resourceCost.resourceFormulas = { mana: 'level * 2' };
      return wrapRecord(base);
    }
    throw new Error(`Unknown boundary fixture: ${kind}`);
  }

  function m6aAreaRecord() {
    const base = JSON.parse(JSON.stringify(recordFor({ kind: 'damage', formula: '2d6+4' }).authoredDraft));
    base.name = 'Capability Map Arc Blast';
    base.targetingConfig = {
      targetingType: 'area',
      aoeShape: 'circle',
      aoeType: 'circle',
      aoeParameters: { radius: 15 },
      rangeType: 'ranged',
      rangeDistance: 60,
      maxTargets: 4,
      targetRestrictions: ['enemy'],
      selectionMethod: 'manual',
      targetSelectionMethod: 'manual',
      movementBehavior: 'static'
    };
    return wrapRecord(base);
  }

  function loadCompilerFixture(source) {
    if (source === 'supported.json+follow_up_after_damage') {
      const raw = loadJson(root, 'vtt-react/src/components/spellcrafting-wizard/__tests__/fixtures/supported.json');
      const tc = {
        global: { logicType: 'AND', compoundTriggers: [{ id: 'follow_up_after_damage', category: 'combat', name: 'Follow-up After My Damage', parameters: {} }] },
        effectTriggers: {},
        conditionalEffects: {},
        buffDebuffTriggers: {},
        requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
        triggerRole: { mode: 'CONDITIONAL' }
      };
      raw.triggerConfig = tc;
      raw.authoredDraft.triggerConfig = JSON.parse(JSON.stringify(tc));
      delete raw.serializedData;
      return raw;
    }
    if (source === 'supported.json+component_watch') {
      const raw = loadJson(root, 'vtt-react/src/components/spellcrafting-wizard/__tests__/fixtures/supported.json');
      const tc = {
        global: { logicType: 'AND', compoundTriggers: [] },
        effectTriggers: {
          damage_direct: {
            logicType: 'AND',
            targetingOverride: null,
            compoundTriggers: [{ id: 'follow_up_after_damage', category: 'combat', name: 'Follow-up After My Damage', parameters: {} }]
          }
        },
        conditionalEffects: {},
        buffDebuffTriggers: {},
        requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
        triggerRole: { mode: 'CONDITIONAL' }
      };
      raw.triggerConfig = tc;
      raw.authoredDraft.triggerConfig = JSON.parse(JSON.stringify(tc));
      delete raw.serializedData;
      return raw;
    }
    if (source.startsWith('directDamageSaveFixtures.json:')) {
      const key = source.slice('directDamageSaveFixtures.json:'.length);
      const raw = loadJson(root, 'vtt-react/src/components/spellcrafting-wizard/__tests__/fixtures/directDamageSaveFixtures.json');
      if (!raw[key] || !raw[key].savedOuterRecord) {
        throw new Error(`Missing directDamageSaveFixtures.json entry: ${key}`);
      }
      return JSON.parse(JSON.stringify(raw[key].savedOuterRecord));
    }
    if (source.startsWith('boundary:')) {
      return boundaryRecord(source);
    }
    const raw = loadJson(root, source);
    if (raw.authoredDraft) {
      return raw;
    }
    return wrapRecord(raw);
  }

  function resolveCompatibilityRecord(fixtureSource) {
    const id = fixtureSource.split(':')[1];
    const item = compatFixtures.fixtures.find(f => f.id === id);
    if (!item) {
      throw new Error(`Missing compatibility fixture: ${id}`);
    }
    return recordFor(item);
  }

  return { m6aAreaRecord, loadCompilerFixture, resolveCompatibilityRecord };
}

async function runBehaviorChecks(root, map, log) {
  const pure = requireFromRoot(root, 'vtt-react/src/services/authoredAbility.js');
  const plans = requireFromRoot(root, 'vtt-react/src/services/executionPlan.js');
  const registry = requireFromRoot(root, 'server/services/installedDefinitionRegistry.js');
  const passivePolicy = requireFromRoot(root, 'server/shared/services/passiveActivationPolicy.js');
  const { createHarness, approvalFor, commandFor, ack } = requireFromRoot(root, 'server/tests/helpers/componentCompatibilityFixtures.js');
  const { m6aAreaRecord, loadCompilerFixture, resolveCompatibilityRecord } = createFixtureLoaders(root);

  const h = await createHarness();
  const results = [];
  const behaviorFailures = [];
  let executablePassed = 0;
  let executableTotal = 0;
  let refusalPassed = 0;
  let refusalTotal = 0;

  try {
    for (const check of map.checks) {
      const category = classifyCheck(check);
      if (category === 'executable') executableTotal += 1;
      else refusalTotal += 1;

      try {
        if (check.kind === 'compiler-and-plan') {
          const record = loadCompilerFixture(check.fixtureSource);
          const compiled = pure.definitionFromWizard(record, { roomId: h.room.id, classId: 'arcanoneer', definitionVersion: 1 });
          assert.equal(compiled.ok, check.expectCompiled, `${check.id}: expected compiled.ok=${check.expectCompiled}, got ${compiled.ok} (${compiled.reason || ''})`);
          if (check.expectCompiled) {
            const regCompiled = registry.compileDefinition(compiled.definition);
            assert.equal(regCompiled.ok, true, `${check.id}: registry.compileDefinition failed: ${regCompiled.code}`);
            const explained = plans.explain(record, compiled);
            if (typeof check.expectWholeExecutable === 'boolean') {
              assert.equal(explained.wholeExecutable, check.expectWholeExecutable, `${check.id}: wholeExecutable mismatch`);
            }
            if (typeof check.expectExecutableClaim === 'boolean') {
              assert.equal(explained.executableClaim, check.expectExecutableClaim, `${check.id}: executableClaim mismatch`);
            }
            const plan = plans.planFromDefinition(compiled.definition);
            if (check.expectSubscriptionId) {
              assert.equal(plans.subscriptionOf(plan)?.subscriptionId, check.expectSubscriptionId, `${check.id}: subscriptionId mismatch`);
            }
            if (check.expectWatchComponentId) {
              assert.equal(plans.watchOf(plan)?.componentId, check.expectWatchComponentId, `${check.id}: watch componentId mismatch`);
            }
            if (check.expectSave) {
              assert.deepEqual(compiled.definition.save, check.expectSave, `${check.id}: compiled.definition.save mismatch`);
            }
          } else {
            if (check.expectReasonIncludes) {
              assert((compiled.reason || '').includes(check.expectReasonIncludes), `${check.id}: reason "${compiled.reason}" missing "${check.expectReasonIncludes}"`);
            }
            if (check.expectPlanRefusalCode) {
              const explained = plans.explain(record, compiled);
              assert(explained.manual.some(m => m.code === check.expectPlanRefusalCode), `${check.id}: expected manual code ${check.expectPlanRefusalCode}`);
            }
          }
        } else if (check.kind === 'passive-descriptor') {
          const hs = loadJson(root, check.fixtureSource);
          assert.equal(passivePolicy.approved(), check.expectPolicyApproved, `${check.id}: passive policy approval mismatch`);
          const compiled = pure.definitionFromWizard(wrapRecord(hs), { roomId: h.room.id, classId: 'arcanoneer', definitionVersion: 1 });
          assert.equal(compiled.ok, !check.expectCompilerRefused, `${check.id}: Heightened Senses must not compile through authoredAbility`);
        } else if (check.kind === 'real-handler') {
          if (check.fixtureSource === 'm6a-ranged-circle-damage') {
            const record = m6aAreaRecord();
            const adm = await h.admit(record);
            assert.equal(adm.success, true, `${check.id}: area admit failed: ${JSON.stringify(adm)}`);
            const entry = h.entry(adm.definitionRef);
            assert.equal(entry.canonicalDefinition.capability, check.expectCapability);
          } else {
            const record = resolveCompatibilityRecord(check.fixtureSource);
            if (!check.route) {
              const adm = await h.admit(record);
              assert.equal(adm.success, true, `${check.id}: admit failed: ${JSON.stringify(adm)}`);
              const entry = h.entry(adm.definitionRef);
              assert.equal(entry.canonicalDefinition.capability || pure.CAPABILITY, check.expectCapability);
              const target = check.id === 'supported-self-healing' ? h.pc : h.foe;
              if ((entry.canonicalDefinition.timing && entry.canonicalDefinition.timing.expiryPolicy !== 'gm-manual') || entry.canonicalDefinition.cooldown) {
                if (!h.live().gameState.combat?.active) { await h.combat(); }
              }
              const approval = approvalFor(h, entry, target);
              const appRes = await ack(h.owner, 'actor_spell_approve', approval);
              assert.equal(appRes.code, 'awaiting_gm', `${check.id}: approve failed: ${JSON.stringify(appRes)}`);
              const cmd = commandFor(h, approval);
              const conRes = await ack(h.gm, 'actor_consequence', cmd);
              assert.equal(conRes.success, true, `${check.id}: consequence failed: ${JSON.stringify(conRes)}`);
            } else if (check.route === 'gm-creature-to-creature') {
              h.token(h.source).authoredAbility = { schemaVersion: 1, record };
              const adm = await h.admit(record, h.source);
              assert.equal(adm.success, false, `${check.id}: expected creature admission refusal`);
              assert.equal(adm.code, check.expectCode, `${check.id}: expected ${check.expectCode}, got ${adm.code}`);
            } else if (check.route === 'owner-pc-to-other-pc') {
              const adm = await h.admit(record);
              assert.equal(adm.success, true, `${check.id}: admit failed`);
              const entry = h.entry(adm.definitionRef);
              if (!h.live().gameState.combat?.active) { await h.combat(); }
              const approval = approvalFor(h, entry, h.ally);
              const appRes = await ack(h.owner, 'actor_spell_approve', approval);
              assert.equal(appRes.success, false, `${check.id}: expected PC target refusal`);
              assert.equal(appRes.code, check.expectCode, `${check.id}: expected ${check.expectCode}, got ${appRes.code}`);
            } else if (check.route === 'owner-pc-to-creature-unpinned') {
              const forged = JSON.parse(JSON.stringify(record));
              forged.authoredDraft.resourceCost.classResource = { type: 'elementalSpheres', spheres: ['rime'] };
              forged.resourceCost = JSON.parse(JSON.stringify(forged.authoredDraft.resourceCost));
              const adm = await h.admit(forged);
              assert.equal(adm.success, false, `${check.id}: unpinned class payment must be refused`);
              assert.ok(
                adm.code === check.expectCode || adm.code === 'unsupported_wizard_record',
                `${check.id}: expected ${check.expectCode} or unsupported_wizard_record, got ${adm.code}`
              );
            }
          }
        } else {
          throw new Error(`Unknown check kind: ${check.kind}`);
        }

        if (category === 'executable') executablePassed += 1;
        else refusalPassed += 1;
        results.push({ id: check.id, category, passed: true });
        log(`   [PASS] (${category}) ${check.id}`);
      } catch (err) {
        behaviorFailures.push({ id: check.id, category, error: err.message });
        results.push({ id: check.id, category, passed: false, error: err.message });
        log(`   [FAIL] (${category}) ${check.id}: ${err.message}`);
      }
    }
  } finally {
    await h.close();
  }

  return {
    total: map.checks.length,
    passed: executablePassed + refusalPassed,
    executable: { passed: executablePassed, total: executableTotal },
    refusal: { passed: refusalPassed, total: refusalTotal },
    behaviorFailures,
    results
  };
}

async function runCapabilityMap(options = {}) {
  const root = path.resolve(options.root || DEFAULT_ROOT);
  const mapPath = path.resolve(options.mapPath || path.join(root, 'server', 'tests', 'fixtures', 'capabilityMap.json'));
  const backupDir = path.resolve(options.backupDir || path.join(path.dirname(mapPath), 'backups'));
  const mode = options.mode || 'strict';
  const quiet = Boolean(options.quiet || options.json);
  const log = msg => { if (!quiet) console.log(msg); };

  const map = validateRootAndMap(root, mapPath);
  const identityReport = checkSourceIdentities(root, map);
  const governanceFailures = checkCandidatesAndGovernance(root, map);
  const identityIssueCount = identityReport.drifted.length + identityReport.missing.length + governanceFailures.length;

  if (mode === 'propose-pin-update') {
    const proposals = buildPinUpdateProposals(root, map, identityReport);
    log('Proposed Pin-Update Diff (NO FILES WRITTEN):');
    if (proposals.length === 0) {
      log('  No drifted source identities.');
    } else {
      for (const p of proposals) {
        log(`--- ${p.relPath}`);
        log(`- "${p.relPath}": "${p.oldPin}"`);
        log(`+ "${p.relPath}": "${p.newPin}"`);
        if (p.provenance.attested) {
          log(`  Provenance: ${p.provenance.packet} (INSTALLED.json @ ${p.provenance.installedAt}, REVIEW.md: ${p.provenance.reviewVerdict})`);
        } else {
          log(`  Provenance: UNATTESTED (${p.provenance.reason})`);
        }
      }
    }
    return {
      mode,
      certified: false,
      written: false,
      identityReport,
      governanceFailures,
      proposals,
      exitCode: identityReport.missing.length > 0 ? 1 : 0
    };
  }

  if (mode === 'apply-pin-update') {
    const proposals = buildPinUpdateProposals(root, map, identityReport);
    const applied = applyPinUpdate(root, mapPath, map, backupDir, proposals);
    if (applied.applied) {
      log(`Applied ${applied.changes.length} attested pin update(s) to ${mapPath}`);
      log(`Backup created: ${applied.backupPath}`);
    } else {
      log(applied.reason);
    }
    return {
      mode,
      certified: false,
      written: applied.applied,
      backupPath: applied.backupPath,
      changes: applied.changes,
      proposals,
      exitCode: 0
    };
  }

  if (mode === 'diagnostic') {
    log('====================================================================');
    log('MODE: CURRENT-TREE DIAGNOSTIC (UNPINNED / NOT A RELEASE CERTIFICATION)');
    log('====================================================================');
  } else {
    log('1. Verifying live source SHA-256 identities (STRICT PINNED MODE)...');
  }

  for (const item of identityReport.drifted) {
    log(`   [IDENTITY DRIFT] ${item.relPath}: expected ${item.expectedPrefix}..., got ${item.actual}`);
  }
  for (const item of identityReport.missing) {
    log(`   [IDENTITY MISSING] ${item.relPath}: expected ${item.expectedPrefix}..., file missing`);
  }
  for (const fail of governanceFailures) {
    log(`   [GOVERNANCE FAILURE] ${fail}`);
  }

  if (mode === 'strict' && identityIssueCount > 0) {
    return {
      mode,
      certified: false,
      identityReport,
      governanceFailures,
      behavior: null,
      exitCode: 1
    };
  }

  if (mode === 'strict') {
    log(`   OK: ${identityReport.matched.length} live source identities verified.`);
    log(`   OK: ${map.stagedCandidatesNotInstalled.length} staged candidates confirmed NOT installed.`);
  } else {
    log(`Identity summary: ${identityReport.matched.length} matched, ${identityReport.drifted.length} drifted, ${identityReport.missing.length} missing, ${governanceFailures.length} governance failures.`);
  }

  log('3. Running compiler, plan, passive-descriptor, and real-handler checks...');
  const behavior = await runBehaviorChecks(root, map, log);

  const certified = mode === 'strict' && identityIssueCount === 0 && behavior.behaviorFailures.length === 0;
  const exitCode = (
    behavior.behaviorFailures.length > 0 ||
    identityReport.missing.length > 0 ||
    (mode === 'strict' && identityIssueCount > 0)
  ) ? 1 : 0;

  if (mode === 'diagnostic') {
    log('');
    log('--- DIAGNOSTIC SUMMARY (UNPINNED / NOT A RELEASE CERTIFICATION) ---');
    log(`Identity drift/failures : ${identityIssueCount} (drifted=${identityReport.drifted.length}, missing=${identityReport.missing.length}, governance=${governanceFailures.length})`);
    log(`Behavior failures       : ${behavior.behaviorFailures.length}`);
    log(`Executable gameplay     : ${behavior.executable.passed}/${behavior.executable.total} passed`);
    log(`Boundary/refusal checks : ${behavior.refusal.passed}/${behavior.refusal.total} passed (NOT counted as gameplay)`);
    log(`Total checks            : ${behavior.passed}/${behavior.total} passed`);
  } else {
    const label = certified ? 'STRICT CERTIFIED' : 'STRICT FAILED';
    log(`\nCapability Map Runner (${label}): ${behavior.passed}/${behavior.total} checks passed (executable=${behavior.executable.passed}/${behavior.executable.total}, boundary-refusal=${behavior.refusal.passed}/${behavior.refusal.total}, failures=${behavior.behaviorFailures.length}).`);
  }

  return {
    mode,
    certified,
    identityReport,
    governanceFailures,
    behavior,
    exitCode
  };
}

if (require.main === module) {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`Capability Map Runner argument error: ${err.message}`);
    process.exit(1);
  }

  if (opts.help) {
    console.log([
      'Usage: node tests/capabilityMap.runner.cjs [options]',
      '  --strict               Pinned release mode (default). Fails nonzero on any hash drift.',
      '  --diagnostic           Current-tree diagnostic mode (UNPINNED / NOT A RELEASE CERTIFICATION).',
      '  --propose-pin-update   Show proposed pin-update diff with accepted release provenance (no writes).',
      '  --apply-pin-update     Apply attested pin updates with backup (separate deliberate operation).',
      '  --root <dir>           Override workspace root (never falls back if invalid).',
      '  --map <file>           Override capabilityMap.json path.',
      '  --backup-dir <dir>     Override backup directory for --apply-pin-update.',
      '  --json                 Print structured JSON summary.'
    ].join('\n'));
    process.exit(0);
  }

  runCapabilityMap(opts)
    .then(res => {
      if (opts.json) {
        console.log(JSON.stringify(res, null, 2));
      }
      process.exit(res.exitCode);
    })
    .catch(err => {
      console.error('Capability Map Runner FAILED:', err.message || err);
      process.exit(1);
    });
}

module.exports = {
  parseArgs,
  validateRootAndMap,
  checkSourceIdentities,
  checkCandidatesAndGovernance,
  discoverAcceptedProvenance,
  buildPinUpdateProposals,
  applyPinUpdate,
  classifyCheck,
  runCapabilityMap
};
