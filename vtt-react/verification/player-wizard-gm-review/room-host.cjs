'use strict';

const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const Module = require('node:module');

const DEFAULT_STAGE_ROOT = 'D:\\VTT';
const DEFAULT_BUILD_DIR = 'D:\\VTT\\handoff\\arcane-beam-release-composition-20261121\\build-out';

const STAGE_ROOT = path.resolve(process.env.STAGE_ROOT || process.env.ISOLATED_STAGE_ROOT || DEFAULT_STAGE_ROOT);
const BUILD_DIR = path.resolve(process.env.APP_BUILD_DIR || DEFAULT_BUILD_DIR);

if (!fs.existsSync(path.join(STAGE_ROOT, 'server/services/installedAuthoredAbilities.js'))) {
  throw Error(`Stage root missing server/services/installedAuthoredAbilities.js at ${STAGE_ROOT}`);
}
if (!fs.existsSync(path.join(BUILD_DIR, 'asset-manifest.json')) || !fs.existsSync(path.join(BUILD_DIR, 'index.html'))) {
  throw Error(`App build missing asset-manifest.json or index.html at ${BUILD_DIR}`);
}

// Isolated stages copied without node_modules reuse the workspace dependencies read-only.
const extraNodePaths = [
  path.join(STAGE_ROOT, 'server/node_modules'),
  path.join(STAGE_ROOT, 'vtt-react/node_modules'),
  'D:\\VTT\\server\\node_modules',
  'D:\\VTT\\vtt-react\\node_modules'
].filter((dir) => fs.existsSync(dir));
const currentNodePaths = (process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean);
process.env.NODE_PATH = Array.from(new Set([...currentNodePaths, ...extraNodePaths])).join(path.delimiter);
Module._initPaths();

const resolveFirst = (candidates) => {
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  throw Error(`Missing required module or data file in any of: ${candidates.join(', ')}`);
};

require(resolveFirst([
  path.join(STAGE_ROOT, 'vtt-react/verification/p7/preload.cjs'),
  'D:\\VTT\\vtt-react\\verification\\p7\\preload.cjs'
]));

const { createProductionStackServer } = require(path.join(STAGE_ROOT, 'server/tests/helpers/productionStackServer'));
const { FirebaseBatchWriter } = require(path.join(STAGE_ROOT, 'server/services/syncService'));
const actors = require(path.join(STAGE_ROOT, 'server/services/actorConsequences'));
const relationships = require(path.join(STAGE_ROOT, 'server/services/actorRelationships'));
const payments = require(path.join(STAGE_ROOT, 'server/services/spellPayments'));
const roomCheckpoint = require(path.join(STAGE_ROOT, 'server/services/roomCheckpoint'));
const projection = require(path.join(STAGE_ROOT, 'server/services/actorProjection'));
const definitions = require(path.join(STAGE_ROOT, 'server/services/installedDefinitionRegistry'));

let reviews = null;
try {
  reviews = require(path.join(STAGE_ROOT, 'server/services/authoredReviewRequests'));
} catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') throw err;
}

const pure = require(resolveFirst([
  path.join(STAGE_ROOT, 'vtt-react/src/services/authoredAbility.js'),
  path.join(STAGE_ROOT, 'server/shared/services/authoredAbility.js')
]));
const authoredEffect = require(resolveFirst([
  path.join(STAGE_ROOT, 'vtt-react/src/services/authoredEffect.js'),
  path.join(STAGE_ROOT, 'server/shared/services/authoredEffect.js')
]));
const timing = require(resolveFirst([
  path.join(STAGE_ROOT, 'vtt-react/src/services/sharedEffectTiming.js'),
  path.join(STAGE_ROOT, 'server/shared/services/sharedEffectTiming.js')
]));
const profile = require(resolveFirst([
  path.join(STAGE_ROOT, 'vtt-react/src/services/sharedConditionProfile.js'),
  path.join(STAGE_ROOT, 'server/shared/services/sharedConditionProfile.js')
]));

const clone = (value) => JSON.parse(JSON.stringify(value));
const sha256File = (filePath) => (
  fs.existsSync(filePath)
    ? crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')
    : null
);
const ack = (socket, event, payload) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(Error(`ACK timeout: ${event}`)), 10000);
  socket.emit(event, payload, (res) => {
    clearTimeout(timer);
    resolve(res);
  });
});
const once = (socket, event) => new Promise((resolve) => socket.once(event, resolve));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg'
};

function buildIdentity() {
  const manifestPath = path.join(BUILD_DIR, 'asset-manifest.json');
  const indexPath = path.join(BUILD_DIR, 'index.html');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const mainJsRel = String(manifest.files?.['main.js'] || '').replace(/^\//, '');
  const mainCssRel = String(manifest.files?.['main.css'] || '').replace(/^\//, '');
  const mainJsPath = mainJsRel ? path.join(BUILD_DIR, mainJsRel) : '';
  const mainCssPath = mainCssRel ? path.join(BUILD_DIR, mainCssRel) : '';
  const trackedStageFiles = [
    'server/handlers/actorConsequenceHandlers.js',
    'server/services/authoredReviewRequests.js',
    'server/services/installedAuthoredAbilities.js',
    'server/services/actorConsequences.js',
    'vtt-react/src/components/windows/SpellbookWindow.jsx',
    'vtt-react/src/components/spellcrafting-wizard/components/library/SpellLibrary.jsx',
    'vtt-react/src/components/spellcrafting-wizard/components/library/AuthoredAdmission.jsx',
    'vtt-react/src/components/hud/AuthoredReviewRequests.jsx',
    'vtt-react/src/services/authoredReviewService.js'
  ];
  return {
    stageRoot: STAGE_ROOT,
    buildDir: BUILD_DIR,
    indexHtmlSha256: sha256File(indexPath),
    assetManifestSha256: sha256File(manifestPath),
    mainJsFile: mainJsRel ? path.basename(mainJsPath) : null,
    mainJsSha256: mainJsPath ? sha256File(mainJsPath) : null,
    mainCssFile: mainCssRel ? path.basename(mainCssPath) : null,
    mainCssSha256: mainCssPath ? sha256File(mainCssPath) : null,
    stageFilesSha256: Object.fromEntries(
      trackedStageFiles.map((rel) => [rel, sha256File(path.join(STAGE_ROOT, rel))])
    )
  };
}

function makePcCharacter(id, name, { manaCurrent = 10, tempMana = 3, apCurrent = 5, tempAp = 1 } = {}) {
  const stats = { strength: 10, agility: 12, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 };
  return {
    id,
    name,
    class: 'Arcanoneer',
    level: 3,
    stats: clone(stats),
    baseStats: clone(stats),
    buffs: [],
    debuffs: [],
    health: { current: 40, max: 40 },
    mana: { current: manaCurrent, max: 30 },
    actionPoints: { current: apCurrent, max: 5 },
    tempHealth: 0,
    tempMana,
    tempActionPoints: tempAp,
    equipment: {},
    classResource: { type: 'elementalSpheres', spheres: [], current: 0, max: 12 },
    class_spells: { known_spells: [] }
  };
}

async function start() {
  const firebaseBatchWriter = new FirebaseBatchWriter(60000, 50, {
    shouldPersist: () => true,
    persist: async () => ({ outcome: 'confirmed' })
  });
  const backend = createProductionStackServer({
    characterOwners: { vael: 'acct-player-a', ilse: 'acct-player-b' },
    firebaseBatchWriter
  });
  await backend.start();

  for (const event of [
    'actor_bind', 'actor_snapshot', 'actor_consequence',
    'actor_spell_approve', 'actor_spell_withdraw', 'actor_spell_decline', 'actor_spell_list',
    'actor_authored_admit', 'actor_authored_list', 'actor_authored_revoke',
    'actor_relationship_set', 'actor_relationship_get', 'actor_relationship_list',
    'authored_review_submit', 'authored_review_list', 'authored_review_decide',
    'actor_trigger_register', 'actor_turn_boundary', 'actor_recovery',
    'join_room', 'combat_started', 'combat_ended', 'combat_turn_changed',
    'character_updated', 'character_resource_updated', 'token_updated', 'token_moved', 'token_created'
  ]) {
    backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  }
  for (const uid of ['acct-gm', 'acct-player-a', 'acct-player-b']) {
    backend.registerAuthToken(uid, uid);
  }

  const seed = backend.connect({ token: 'acct-gm' });
  await once(seed, 'connect');
  const room = await backend.seedRoom(seed.id, {
    gmUserId: 'acct-gm',
    name: 'Opus 1 Acceptance Hall',
    gmName: 'GM'
  });

  const mapId = 'acceptance-hall';
  const baseMap = clone(room.gameState.maps.default || {
    gridSettings: { gridType: 'square', gridSize: 50, feetPerTile: 5, gridOffsetX: 0, gridOffsetY: 0 }
  });
  const creaturesPath = resolveFirst([
    path.join(STAGE_ROOT, 'vtt-react/public/data/creatures.json'),
    'D:\\VTT\\vtt-react\\public\\data\\creatures.json'
  ]);
  const creaturesList = JSON.parse(fs.readFileSync(creaturesPath, 'utf8'));
  const creatureTemplate = clone(creaturesList.find((c) => c.id === 'grimmstalk') || creaturesList[0]);

  room.gameState.maps[mapId] = {
    ...baseMap,
    id: mapId,
    name: 'Opus 1 Acceptance Hall',
    gridSettings: { gridType: 'square', gridSize: 50, feetPerTile: 5, gridOffsetX: 0, gridOffsetY: 0 },
    tokens: {},
    creatures: {},
    characterTokens: {}
  };
  room.gameState.defaultMapId = mapId;
  const hall = room.gameState.maps[mapId];

  const pcSpecs = [
    { id: 'pcA', charId: 'vael', name: 'Vael', ownerUid: 'acct-player-a', x: 700, y: 300 },
    { id: 'pcB', charId: 'ilse', name: 'Ilse', ownerUid: 'acct-player-b', x: 600, y: 300 }
  ];
  for (const spec of pcSpecs) {
    hall.characterTokens[spec.id] = {
      id: spec.id,
      mapId,
      ownerUserId: spec.ownerUid,
      playerId: spec.ownerUid,
      position: { x: spec.x, y: spec.y },
      character: makePcCharacter(spec.charId, spec.name),
      state: { conditions: [] }
    };
  }

  const creatureSpecs = [
    { id: 'A1', customName: 'Target Alpha', x: 400, y: 300, hp: 30, maxHp: 40, temp: 4 },
    { id: 'B1', customName: 'Target Beta', x: 500, y: 300, hp: 30, maxHp: 40, temp: 4 }
  ];
  for (const spec of creatureSpecs) {
    hall.tokens[spec.id] = {
      id: spec.id,
      creatureId: creatureTemplate.id,
      name: spec.customName,
      mapId,
      position: { x: spec.x, y: spec.y },
      hiddenFromPlayers: false,
      isHidden: false,
      stats: clone(creatureTemplate.stats || { maxHp: spec.maxHp }),
      state: {
        customName: spec.customName,
        currentHp: spec.hp,
        maxHp: spec.maxHp,
        tempHealth: spec.temp,
        currentMana: 0,
        tempMana: 0,
        currentActionPoints: 4,
        tempActionPoints: 0,
        maxMana: 20,
        maxAP: 4,
        hiddenFromPlayers: false,
        isHidden: false,
        conditions: []
      }
    };
  }

  const refs = {};
  for (const spec of pcSpecs) {
    const pcTok = hall.characterTokens[spec.id];
    const res = await ack(seed, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId, tokenId: spec.id, ownerUid: spec.ownerUid, characterId: spec.charId },
      snapshotHash: actors.hash(pcTok)
    });
    assert.equal(res.success, true, `Failed to bind ${spec.id}: ${JSON.stringify(res)}`);
    refs[spec.id] = res.ref;
  }
  for (const spec of creatureSpecs) {
    const tok = hall.tokens[spec.id];
    const res = await ack(seed, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'creature', roomId: room.id, mapId, tokenId: spec.id },
      snapshotHash: actors.hash(tok)
    });
    assert.equal(res.success, true, `Failed to bind ${spec.id}: ${JSON.stringify(res)}`);
    refs[spec.id] = res.ref;
  }

  const enemyPairs = [];
  for (const pcSpec of pcSpecs) {
    for (const cSpec of creatureSpecs) {
      enemyPairs.push({ a: refs[pcSpec.id], b: refs[cSpec.id] });
    }
  }
  const setEnemy = relationships.planSet(
    room,
    enemyPairs,
    'enemy',
    { gmUid: 'acct-gm', expectedRevision: relationships.revision(room) }
  );
  assert.equal(setEnemy.ok, true, `planSet enemy failed: ${JSON.stringify(setEnemy)}`);
  room.gameState = setEnemy.next;

  const mirrors = roomCheckpoint.deriveRootMirrors(room.gameState.maps);
  room.gameState.tokens = mirrors.tokens;
  room.gameState.characterTokens = mirrors.characterTokens;
  projection.advance(room, room.gameState);

  const socketIoPath = resolveFirst([
    path.join(STAGE_ROOT, 'vtt-react/node_modules/socket.io-client/dist/socket.io.js'),
    'D:\\VTT\\vtt-react\\node_modules\\socket.io-client\\dist\\socket.io.js'
  ]);

  const server = http.createServer((req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const urlObj = new URL(req.url, 'http://127.0.0.1');
    if (urlObj.pathname === '/integration-fixture.json') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        backendUrl: backend.url(),
        roomId: room.id,
        mapId,
        refs,
        stageRoot: STAGE_ROOT,
        buildDir: BUILD_DIR
      }));
    }
    if (urlObj.pathname === '/integration-io.js') {
      res.setHeader('Content-Type', 'text/javascript');
      return res.end(fs.readFileSync(socketIoPath));
    }
    if (urlObj.pathname === '/integration-state.json') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(room.gameState));
    }
    let file = path.resolve(BUILD_DIR, '.' + decodeURIComponent(urlObj.pathname));
    if (!file.startsWith(BUILD_DIR + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      file = path.join(BUILD_DIR, 'index.html');
    }
    res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;

  const poolSnapshot = (pcTok) => {
    const apCurrent = pcTok?.character?.actionPoints?.current ?? 0;
    const apTemp = pcTok?.character?.tempActionPoints ?? 0;
    const manaCurrent = pcTok?.character?.mana?.current ?? 0;
    const manaTemp = pcTok?.character?.tempMana ?? 0;
    const hp = pcTok?.character?.health?.current ?? 0;
    const tempHp = pcTok?.character?.tempHealth ?? 0;
    return {
      apCurrent,
      apTemp,
      apTotal: apCurrent + apTemp,
      manaCurrent,
      manaTemp,
      manaTotal: manaCurrent + manaTemp,
      hp,
      tempHp
    };
  };

  const snapshot = () => {
    const mapNow = room.gameState.maps[mapId];
    const rawReceipts = actors.ledger(room).receipts || [];
    const allReceipts = rawReceipts.map((r) => {
      let chosen = null;
      try { chosen = r.adjudication?.chosenResult ? JSON.parse(r.adjudication.chosenResult) : null; } catch (_) {}
      return {
        commandId: r.commandId,
        approvalId: r.authorization?.proposalId || null,
        authorizationKind: r.authorization?.kind || null,
        approvalHash: r.authorization?.approvalHash || null,
        commitSequence: r.commitSequence,
        source: clone(r.source || null),
        target: clone(r.target || null),
        finalAmount: r.adjudication?.finalAmount ?? null,
        adjustmentReason: r.adjudication?.adjustmentReason ?? '',
        definitionId: r.adjudication?.definitionId || null,
        definitionVersionOrHash: r.adjudication?.definitionVersionOrHash || null,
        actors: clone(r.actors || []),
        chosen
      };
    });
    const spellReceipts = allReceipts.filter((r) => r.authorizationKind === 'owner-approval-gm');
    const targets = Object.fromEntries(
      creatureSpecs.map((s) => {
        const tok = mapNow.tokens[s.id];
        return [s.id, {
          name: tok.state?.customName || tok.name,
          currentHp: tok.state?.currentHp,
          maxHp: tok.state?.maxHp,
          tempHealth: tok.state?.tempHealth || 0,
          conditions: clone(tok.state?.conditions || [])
        }];
      })
    );
    const reviewRequests = reviews
      ? reviews.list(room, { isGM: true }).map((r) => ({
          requestId: r.requestId,
          status: r.status,
          requesterUid: r.requesterUid,
          spellName: r.spellName,
          recordHash: r.recordHash,
          formula: r.record?.damageConfig?.formula || null,
          movementFeet: r.record?.controlConfig?.authoredCondition?.movementFeet ?? null,
          expiryPolicy: r.record?.controlConfig?.authoredCondition?.expiryPolicy || null,
          mana: r.record?.resourceCost?.resourceValues?.mana ?? null,
          ap: r.record?.resourceCost?.actionPoints ?? null,
          summary: r.summary,
          price: r.price,
          definitionRef: r.definitionRef
        }))
      : [];
    const combat = room.gameState.combat || null;
    return {
      totalReceipts: rawReceipts.length,
      receipts: spellReceipts.length,
      allReceipts,
      spellReceipts,
      lastSpellReceipt: spellReceipts.at(-1) || null,
      pending: payments.listAll(room).length,
      reviewRequests,
      registryRevision: room.gameState.authoredSpellRegistry?.revision ?? 0,
      admittedCount: (room.gameState.authoredSpellRegistry?.definitions || []).length,
      admittedVersions: (room.gameState.authoredSpellRegistry?.definitions || []).map((e) => ({
        definitionId: e.definitionRef?.definitionId,
        name: e.canonicalDefinition?.name,
        version: e.definitionRef?.definitionVersion,
        hash: e.definitionRef?.definitionHash,
        capabilityId: e.descriptor?.capabilityId,
        resourceCost: clone(e.canonicalDefinition?.resourceCost || null),
        targeting: clone(e.canonicalDefinition?.targeting || null),
        effect: clone(e.canonicalDefinition?.effect || null),
        effects: clone(e.canonicalDefinition?.effects || null),
        timing: clone(e.canonicalDefinition?.timing || null)
      })),
      pcA: poolSnapshot(mapNow.characterTokens.pcA),
      pcB: poolSnapshot(mapNow.characterTokens.pcB),
      targets,
      combat: {
        isActive: Boolean(combat?.isActive),
        currentTurnIndex: combat?.currentTurnIndex ?? null,
        turnOrderTokenIds: Array.isArray(combat?.turnOrder) ? combat.turnOrder.map((t) => t.tokenId) : [],
        effectLifecycleSequence: combat?.effectLifecycle?.sequence ?? null,
        activeScheduleCount: combat?.effectLifecycle?.schedules ? Object.keys(combat.effectLifecycle.schedules).length : 0
      }
    };
  };

  const compile = (record, version = 1, classId = 'arcanoneer') => {
    const mapped = pure.definitionFromWizard(clone(record), {
      roomId: room.id,
      definitionVersion: version,
      classId
    });
    if (!mapped.ok) {
      throw Error(`definitionFromWizard failed: ${mapped.code || ''} ${mapped.reason || ''}`.trim());
    }
    const compiled = definitions.compileDefinition(mapped.definition);
    if (!compiled.ok) {
      throw Error(`compileDefinition failed: ${compiled.code || ''} ${compiled.path || ''}`.trim());
    }
    return compiled;
  };

  // Schema-valid owner approval for either immediate or authored-effect:v1 spells.
  // Used to prove unapproved/edited revisions are rejected by the admission gate, never schema checks.
  const forgedApproval = (record, targetKey = 'A1', version = 1, classId = 'arcanoneer') => {
    const compiled = compile(record, version, classId);
    const ref = compiled.descriptor.definitionRef;
    const canon = compiled.canonicalDefinition;
    const isEffect = canon.capability === pure.EFFECT_CAPABILITY;
    const formulaStr = isEffect ? canon.effects.direct.formula : canon.effect.formula;
    const rollSpec = pure.readFormula(formulaStr);
    const die = rollSpec.dice[0];
    const faces = die.sides === 8 ? [5] : Array.from({ length: die.count }, () => 4);
    const diceSum = faces.reduce((sum, face) => sum + face, 0);
    const roll = {
      mode: 'physical',
      dice: [{ sides: die.sides, faces }],
      constant: rollSpec.constant,
      total: diceSum + rollSpec.constant,
      reading: rollSpec.reading
    };
    return {
      version: 1,
      roomId: room.id,
      approvalId: crypto.randomUUID(),
      actionEpoch: actors.epoch(room),
      baseCommitSequence: actors.ledger(room).commitSequence,
      source: refs.pcB,
      target: refs[targetKey],
      spell: {
        definitionId: pure.actionId(ref),
        definitionHash: `${isEffect ? pure.EFFECT_CAPABILITY : pure.CAPABILITY}/${ref.definitionHash}`,
        name: canon.name,
        kind: isEffect ? 'effect' : canon.effect.kind,
        damageTypes: isEffect
          ? clone(canon.effects?.direct?.damageTypes || [])
          : clone(canon.effect?.damageTypes || [])
      },
      roll,
      price: clone(compiled.descriptor.price),
      classPayment: null,
      ...(isEffect ? { effectTerms: authoredEffect.termsFor(canon) } : {})
    };
  };

  return {
    STAGE_ROOT,
    BUILD_DIR,
    backend,
    server,
    room,
    refs,
    seed,
    mapId,
    url,
    creatureSpecs,
    pure,
    timing,
    profile,
    actors,
    buildIdentity,
    makePcCharacter,
    compile,
    forgedApproval,
    snapshot,
    stop: async () => {
      firebaseBatchWriter.stop();
      seed.disconnect();
      if (server.closeAllConnections) server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
      await backend.stop();
    }
  };
}

module.exports = { start, STAGE_ROOT, BUILD_DIR, clone, resolveFirst };
