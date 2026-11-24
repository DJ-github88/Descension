// Live Chromium end-to-end verification for authored passive turn-boundary ability (authored-passive-turn:v1).
// Uses real optimized CRACO build + real createProductionStackServer + real Socket.IO + real UI Wizard/Library/HUD/Combat.
require('../p7/preload.cjs');
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.PASSIVE_TURN_OUTPUT || 'D:\\AppData\\Temp\\opencode\\passive-turn-verify';
if (!path.isAbsolute(out)) throw Error('PASSIVE_TURN_OUTPUT must be absolute');
fs.mkdirSync(out, { recursive: true });
process.env.APP_OUTPUT = path.join(out, 'fixture');

const root = path.resolve(__dirname, '../../..');
const buildDir = path.resolve(process.env.APP_BUILD_DIR || path.join(root, 'vtt-react/build'));
const { createProductionStackServer } = require(path.join(root, 'server/tests/helpers/productionStackServer'));
const actors = require(path.join(root, 'server/services/actorConsequences'));
const relationships = require(path.join(root, 'server/services/actorRelationships'));
const passiveActivation = require(path.join(root, 'server/services/passiveActivation'));
const pure = require('../../src/services/authoredAbility');
const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');

const clone = v => JSON.parse(JSON.stringify(v));
const save = (name, val) => fs.writeFileSync(path.join(out, name), typeof val === 'string' ? val : JSON.stringify(val, null, 2));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ack = (s, event, payload) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(Error(`ACK timeout ${event}`)), 10000);
  s.emit(event, payload, r => { clearTimeout(t); resolve(r); });
});

const report = {
  kind: 'authored-passive-turn-boundary-browser-witness',
  startedAt: new Date().toISOString(),
  buildDir,
  passed: false,
  checks: {},
  errors: [],
  steps: []
};
const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); save('progress.json', report); };

function patchClick(page) {
  const L = Object.getPrototypeOf(page.locator('body'));
  if (L.__pt) return;
  L.__pt = true;
  const click = L.click;
  L.click = async function(options = {}) {
    try { return await click.call(this, { timeout: 20000, ...options }); }
    catch (e) {
      if (options.force || !/not stable|intercepts pointer/.test(String(e.message))) throw e;
      return click.call(this, { ...options, force: true });
    }
  };
}

async function setup(page, url, uid) {
  if (!page.__ptFonts) {
    page.__ptFonts = true;
    const goto = page.goto.bind(page);
    const fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    page.goto = async (...args) => {
      await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {});
      await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts);
      return goto(...args);
    };
  }
  const info = await baseSetup(page, url, uid);
  await page.evaluate(() => {
    S('gameStore').setState({ cameraX: 350, cameraY: 325, zoomLevel: 1, playerZoom: 1 });
    if (window.__req) {
      for (const id of Object.keys(window.__req.m)) {
        try {
          const mod = window.__req(id);
          for (const c of [mod, mod?.default, ...Object.values(mod || {})]) {
            if (typeof c === 'function' && typeof c.getState === 'function') {
              const state = c.getState();
              if (state && 'isInCombat' in state && 'turnOrder' in state && 'currentTurnIndex' in state) {
                const prevS = window.S;
                window.S = name => (name === 'combatStore' ? c : (prevS ? prevS(name) : null));
                return;
              }
            }
          }
        } catch (_) {}
      }
    }
  });
  return info;
}

const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
const finalizeBtn = p => book(p).locator('button.finalize-btn');
const loadBtn = p => book(p).locator('button[title="Open a saved spell for editing"]');
const clockUI = p => p.getByRole('region', { name: 'Authenticated turn expiry', exact: true });
const savedRecord = (p, name) => p.evaluate(n => {
  const k = Object.keys(localStorage).find(key => key.endsWith(':library.spellData'));
  return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells.find(s => s.name === n) : null;
}, name);

async function openBook(p, tabName = 'Spell Wizard') {
  if (!(await book(p).count() && await book(p).isVisible())) {
    const charBtn = p.getByRole('button', { name: /^Character(?: \(\d+\))?$/ });
    if (await charBtn.count()) await charBtn.first().click();
    else await p.locator('button', { hasText: /^\s*Character\s*$/ }).first().click();
    const sb = p.getByRole('button', { name: /^Spellbook(?: S)?$/ });
    if (await sb.count()) await sb.first().click();
    else await p.locator('button', { hasText: /Spellbook/ }).first().click();
    await book(p).waitFor({ timeout: 15000 });
  }
  const tab = book(p).locator('.spellbook-tab-button', { hasText: tabName });
  if (await tab.count() && await tab.isVisible()) {
    await tab.click();
    await p.waitForTimeout(250);
  }
}

async function closeBook(p) {
  if (!(await book(p).count())) return;
  const close = book(p).getByRole('button', { name: 'Close', exact: true });
  if (await close.count()) {
    await close.first().focus();
    await close.first().press('Enter');
  } else {
    await p.keyboard.press('Escape');
  }
  await book(p).waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
}

async function resetWizard(p) {
  const reset = book(p).getByTitle('Reset Wizard');
  if (await reset.count() && await reset.isVisible()) {
    await reset.click();
    const confirm = p.locator('.custom-dialog-btn-danger', { hasText: 'Reset Wizard' });
    await confirm.waitFor({ timeout: 10000 });
    await confirm.click();
    await p.waitForTimeout(250);
  }
}

async function editSpellFromLoadModal(p, name) {
  await openBook(p, 'Spell Wizard');
  await loadBtn(p).click();
  const modal = p.locator('.wow-window', { hasText: 'Open Saved Spell' });
  await modal.waitFor({ timeout: 10000 });
  const row = modal.locator('.spell-list-item', { hasText: name }).first();
  if (await row.count()) {
    await row.locator('.spell-list-load-btn', { hasText: 'Edit' }).first().click();
  } else {
    await modal.locator('.spell-list-load-btn', { hasText: 'Edit' }).first().click();
  }
  await modal.waitFor({ state: 'detached', timeout: 10000 });
  await book(p).locator('.edit-mode-indicator').waitFor({ timeout: 10000 });
}

async function startHost() {
  assert.ok(fs.existsSync(path.join(buildDir, 'asset-manifest.json')), `Missing production build in ${buildDir}`);
  const backend = createProductionStackServer({ debounceMs: 20, characterOwners: { ilse: 'app-owner' } });
  await backend.start();
  for (const e of [
    'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list',
    'actor_bind', 'actor_passive_list', 'actor_passive_activate', 'actor_passive_revoke',
    'actor_relationship_set', 'token_moved', 'character_moved', 'join_room',
    'combat_started', 'combat_ended', 'combat_turn_changed', 'actor_turn_boundary', 'reaction_window_list'
  ]) {
    backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  }
  for (const uid of ['app-gm', 'app-owner', 'app-observer']) backend.registerAuthToken(uid, uid);

  const seed = backend.connect({ token: 'app-gm' });
  await new Promise(r => seed.once('connect', r));
  const room = await backend.seedRoom(seed.id, { gmUserId: 'app-gm' });
  const mapId = 'app-hall';
  const baseCreature = JSON.parse(fs.readFileSync(path.join(root, 'vtt-react/public/data/creatures.json')))
    .find(c => c.id === 'grimmstalk');

  room.gameState.maps[mapId] = {
    ...clone(room.gameState.maps.default),
    id: mapId,
    name: 'Integration Hall',
    gridType: 'square',
    gridSize: 50,
    feetPerTile: 5,
    gridOffsetX: 0,
    gridOffsetY: 0,
    gridSettings: { gridType: 'square', gridSize: 50, feetPerTile: 5, gridOffsetX: 0, gridOffsetY: 0 },
    tokens: {},
    creatures: {},
    characterTokens: {}
  };
  room.gameState.defaultMapId = mapId;
  const hall = room.gameState.maps[mapId];

  const placements = [
    ['enemyA', 'Enemy A', 425, 325],
    ['allyA', 'Ally A', 425, 375]
  ];
  for (const [id, label, x, y] of placements) {
    hall.tokens[id] = {
      id,
      creatureId: 'grimmstalk',
      name: label,
      size: 'medium',
      mapId,
      stats: { ...clone(baseCreature.stats), speed: 30, maxHp: 50 },
      position: { x, y },
      state: {
        customName: label,
        currentHp: 50,
        tempHealth: 0,
        currentMana: 0,
        tempMana: 0,
        currentActionPoints: 2,
        tempActionPoints: 0,
        maxHp: 50,
        maxMana: 10,
        maxAP: 4,
        conditions: []
      }
    };
  }
  hall.characterTokens.pc = {
    id: 'pc',
    mapId,
    ownerUserId: 'app-owner',
    position: { x: 225, y: 325 },
    character: {
      id: 'ilse',
      name: 'Ilse',
      class: 'Arcanoneer',
      level: 3,
      health: { current: 25, max: 40 },
      mana: { current: 10, max: 30 },
      actionPoints: { current: 2, max: 5 },
      tempHealth: 0,
      tempMana: 0,
      tempActionPoints: 0
    },
    state: { conditions: [] }
  };

  const refs = {};
  for (const [kind, id] of [
    ['character', 'pc'],
    ['creature', 'enemyA'],
    ['creature', 'allyA']
  ]) {
    const tok = hall[kind === 'creature' ? 'tokens' : 'characterTokens'][id];
    const res = await ack(seed, 'actor_bind', {
      roomId: room.id,
      ref: {
        kind,
        roomId: room.id,
        mapId,
        tokenId: id,
        ...(kind === 'character' ? { ownerUid: 'app-owner', characterId: 'ilse' } : {})
      },
      snapshotHash: actors.hash(tok)
    });
    assert.equal(res.success, true, `actor_bind failed for ${id}: ${JSON.stringify(res)}`);
    refs[id] = res.ref;
  }

  for (const [targetRefs, value] of [
    [[refs.enemyA], 'enemy'],
    [[refs.allyA], 'ally']
  ]) {
    const relRes = await ack(seed, 'actor_relationship_set', {
      version: 1,
      roomId: room.id,
      commandId: crypto.randomUUID(),
      actionEpoch: actors.epoch(room),
      baseCommitSequence: actors.ledger(room).commitSequence,
      expectedRelationshipRevision: relationships.revision(room),
      pairs: targetRefs.map(b => ({ a: refs.pc, b })),
      value
    });
    assert.equal(relRes.success, true, `actor_relationship_set failed: ${JSON.stringify(relRes)}`);
  }

  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
  const server = http.createServer((req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/integration-fixture.json') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ backendUrl: backend.url(), roomId: room.id, mapId, refs }));
    }
    if (url.pathname === '/integration-io.js') {
      res.setHeader('Content-Type', 'text/javascript');
      return res.end(fs.readFileSync(path.join(root, 'vtt-react/node_modules/socket.io-client/dist/socket.io.js')));
    }
    if (url.pathname === '/integration-state.json') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(room.gameState));
    }
    let file = path.resolve(buildDir, '.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(buildDir + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      file = path.join(buildDir, 'index.html');
    }
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const actualPort = server.address().port;

  return {
    backend,
    seed,
    server,
    room,
    refs,
    mapId,
    url: `http://127.0.0.1:${actualPort}`,
    stop: async () => {
      seed.disconnect();
      if (server.closeAllConnections) server.closeAllConnections();
      await new Promise(r => server.close(r));
      await backend.stop();
    }
  };
}

async function waitPassivePanel(page, openDetails = true) {
  const section = page.locator('section.first-playable-trigger[aria-label="Passive ability activation"]');
  await section.waitFor({ timeout: 10000 });
  const det = section.locator('details').first();
  const isOpen = await det.evaluate(el => el.open);
  if (openDetails && !isOpen) await det.locator('summary').first().click();
  if (!openDetails && isOpen) await det.locator('summary').first().click();
  return section;
}

const passiveTurnReceipts = room => actors.ledger(room).receipts.filter(r =>
  String(r?.adjudication?.definitionVersionOrHash || '').startsWith(`${pure.PASSIVE_TURN_CAPABILITY}/`)
);

async function main() {
  const host = await startHost();
  const browser = await chromium.launch({ headless: true });
  const contexts = {};
  const pages = {};
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner']]) {
      const ctx = contexts[role] = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
        reducedMotion: 'reduce'
      });
      const page = pages[role] = await ctx.newPage();
      patchClick(page);
      page.on('pageerror', e => {
        if (!/Failed to fetch|blockedbyclient/i.test(e.message)) {
          report.errors.push({ role, message: e.message, stack: e.stack });
        }
      });
      await setup(page, host.url, uid);
    }
    const { gm, owner } = pages;

    // ── 1. Author "Dawnstride Stance" from scratch in Spell Wizard ─────────────────────────────────
    step('Step 1: Author passive "Dawnstride Stance" (turn_start, self) from scratch in Spell Wizard');
    await openBook(gm, 'Spell Wizard');
    await resetWizard(gm);

    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('Dawnstride Stance');
    await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('At the start of my turn, gain +10 ft movement speed until GM removes.');
    await book(gm).getByText('Arcane', { exact: true }).click();

    const nav = book(gm).getByRole('navigation', { name: 'Spell wizard steps' });
    await nav.getByRole('button', { name: /Spell Type$/ }).click();
    await book(gm).getByRole('heading', { name: 'PASSIVE', exact: true }).click();

    await nav.getByRole('button', { name: /^3 Effects$/ }).click();
    await book(gm).getByRole('heading', { name: 'Control', exact: true }).click();
    await book(gm).getByRole('button', { name: /^Use composed effect profile/ }).click();
    const fields = book(gm).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
    await fields.getByLabel(/^Canonical effect/).selectOption('movement');
    await fields.getByLabel(/^Effect name shown on the target/).fill('Dawnstride');
    await fields.getByLabel(/^Movement change/).fill('10');
    await fields.getByLabel(/^Expiry/).selectOption('gm-manual');
    await fields.getByLabel(/^Source-authored duration text/).fill('Until GM removes');
    await fields.getByLabel(/^Required GM adjudication note/).fill('GM removes Dawnstride manually.');

    await nav.getByRole('button', { name: /Triggers$/ }).click();
    await book(gm).locator('.wow-trigger-category-name', { hasText: 'Time & Turns' }).first().click();
    await book(gm).locator('.wow-trigger-option', { hasText: 'Turn Start' }).first().click();
    await book(gm).locator('.pf-selected-triggers .pf-selected-trigger-name').getByText('Turn Start', { exact: true }).waitFor({ timeout: 5000 });
    const whoseTurnVal = await book(gm).locator('.pf-selected-triggers .pf-select-wrapper select.pf-select').first().inputValue();
    assert.equal(whoseTurnVal, 'self', `Expected whose_turn default self, got ${whoseTurnVal}`);
    const triggerSummary = await book(gm).locator('.pf-trigger-summary').first().innerText();
    assert.match(triggerSummary, /When my turn starts/i);

    await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click();
    const targetingTypeSection = book(gm).locator('.targeting-section', {
      has: gm.locator('.targeting-section-title', { hasText: /^Targeting Type$/ })
    }).first();
    const selfCard = targetingTypeSection.locator('.targeting-option-card', {
      has: gm.locator('.targeting-option-name', { hasText: /^Self$/ })
    }).first();
    await selfCard.waitFor({ timeout: 5000 });
    const selfCenteredCard = targetingTypeSection.locator('.targeting-option-card', {
      has: gm.locator('.targeting-option-name', { hasText: /^Self-Centered$/ })
    }).first();
    await selfCenteredCard.waitFor({ timeout: 5000 });

    // Supported turn passive defaults to Self and can explicitly select Self
    assert.equal(await selfCard.evaluate(el => el.classList.contains('selected')), true, 'Self card should be selected by default for supported turn passive');
    await selfCard.click();
    assert.equal(await selfCard.evaluate(el => el.classList.contains('selected')), true, 'Self card should remain selected after explicit click');
    await book(gm).getByText(/Self-targeted effects always affect only the caster/).waitFor({ timeout: 5000 });
    assert.equal(await book(gm).locator('.targeting-section-title', { hasText: 'Target Restrictions' }).count(), 0);
    assert.equal(await book(gm).locator('.targeting-section-title', { hasText: 'Area of Effect Configuration' }).count(), 0);
    const targetingDesc = await book(gm).locator('.spell-wizard-targeting-description').innerText();
    assert.match(targetingDesc, /targets only the caster/i);
    await gm.screenshot({ path: path.join(out, '01-wizard-step4-self-targeting.png') });

    await nav.getByRole('button', { name: /Resources$/ }).click();
    await nav.getByRole('button', { name: /Cooldown$/ }).click();
    await nav.getByRole('button', { name: /Review$/ }).click();
    await book(gm).getByText(/Partially automated/i).first().waitFor({ timeout: 5000 });
    await book(gm).getByText(/self turn start/i).first().waitFor({ timeout: 5000 });
    await gm.screenshot({ path: path.join(out, '02-wizard-passive-turn-review.png') });

    await finalizeBtn(gm).click({ force: true });
    await gm.waitForFunction(n => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(n)), 'Dawnstride Stance');

    const savedV1 = await savedRecord(gm, 'Dawnstride Stance');
    assert.ok(savedV1, 'Saved record exists');
    assert.equal(savedV1.spellType, 'PASSIVE');
    assert.equal(savedV1.targetingConfig.targetingType, 'self');
    assert.equal(savedV1.targetingConfig.rangeType, 'self');
    assert.equal(savedV1.targetingConfig.rangeDistance, 0);
    assert.deepEqual(savedV1.targetingConfig.targetRestrictions, ['self']);
    assert.deepEqual(savedV1.targetingConfig.aoeParameters, {});
    assert.equal(savedV1.triggerConfig.global.compoundTriggers[0].id, 'turn_start');
    assert.equal(savedV1.triggerConfig.global.compoundTriggers[0].parameters.whose_turn, 'self');
    assert.equal(savedV1.controlConfig.authoredCondition.label, 'Dawnstride');
    assert.equal(savedV1.controlConfig.authoredCondition.movementFeet, 10);

    const compiledV1 = pure.definitionFromWizard(savedV1, { roomId: host.room.id, definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(compiledV1.ok, true, JSON.stringify(compiledV1));
    assert.equal(compiledV1.definition.capability, pure.PASSIVE_TURN_CAPABILITY);
    assert.deepEqual(compiledV1.definition.targeting, { kind: 'self', restriction: 'self' });
    assert.deepEqual(compiledV1.definition.trigger, { kind: 'turn_start', whoseTurn: 'self', contract: pure.PASSIVE_TURN_TRIGGER });
    save('01-saved-v1.json', savedV1);
    report.checks.createdV1 = compiledV1.definition;
    await closeBook(gm);

    // ── 2. Save & Reopen in Edit mode (+ Next: Resources + Update round-trip) ──────────────────────
    step('Step 2: Reopen saved passive in Edit mode, confirm Self preservation, and round-trip Update');
    await editSpellFromLoadModal(gm, 'Dawnstride Stance');
    await nav.getByRole('button', { name: /^3 Effects$/ }).click();
    const reopenedFields = book(gm).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
    assert.equal(await reopenedFields.getByLabel(/^Canonical effect/).inputValue(), 'movement');
    assert.equal(await reopenedFields.getByLabel(/^Effect name shown on the target/).inputValue(), 'Dawnstride');
    assert.equal(await reopenedFields.getByLabel(/^Movement change/).inputValue(), '10');
    assert.equal(await reopenedFields.getByLabel(/^Expiry/).inputValue(), 'gm-manual');

    await nav.getByRole('button', { name: /Triggers$/ }).click();
    await book(gm).locator('.pf-selected-triggers .pf-selected-trigger-name').getByText('Turn Start', { exact: true }).waitFor({ timeout: 5000 });
    assert.equal(await book(gm).locator('.pf-selected-triggers .pf-select-wrapper select.pf-select').first().inputValue(), 'self');

    await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click();
    const reopenedTypeSection = book(gm).locator('.targeting-section', {
      has: gm.locator('.targeting-section-title', { hasText: /^Targeting Type$/ })
    }).first();
    const reopenedSelfCard = reopenedTypeSection.locator('.targeting-option-card', {
      has: gm.locator('.targeting-option-name', { hasText: /^Self$/ })
    }).first();
    await reopenedSelfCard.waitFor({ timeout: 5000 });
    assert.equal(await reopenedSelfCard.evaluate(el => el.classList.contains('selected')), true, 'Reopened Step 4 must preserve Self selected');
    await book(gm).getByText(/Self-targeted effects always affect only the caster/).waitFor({ timeout: 5000 });
    assert.equal(await book(gm).locator('.targeting-section-title', { hasText: 'Target Restrictions' }).count(), 0);
    assert.equal(await book(gm).locator('.targeting-section-title', { hasText: 'Area of Effect Configuration' }).count(), 0);
    await gm.screenshot({ path: path.join(out, '03-reopen-step4-self-preserved.png') });

    const prevLastModified = savedV1.lastModified;
    await book(gm).getByRole('button', { name: /^Next: Resources/ }).click();
    await nav.getByRole('button', { name: /Review$/ }).click();
    await finalizeBtn(gm).click({ force: true });
    await gm.waitForFunction(({ n, prev }) => {
      const k = Object.keys(localStorage).find(key => key.endsWith(':library.spellData'));
      const rec = k && JSON.parse(localStorage.getItem(k)).payload.data.spells.find(s => s.name === n);
      return rec && rec.lastModified !== prev;
    }, { n: 'Dawnstride Stance', prev: prevLastModified }, { timeout: 10000 });

    const savedV2 = await savedRecord(gm, 'Dawnstride Stance');
    assert.equal(savedV2.targetingConfig.targetingType, 'self');
    assert.equal(savedV2.targetingConfig.rangeType, 'self');
    assert.equal(savedV2.targetingConfig.rangeDistance, 0);
    assert.deepEqual(savedV2.targetingConfig.targetRestrictions, ['self']);
    assert.deepEqual(savedV2.targetingConfig.aoeParameters, {});
    const compiledAfterReopen = pure.definitionFromWizard(savedV2, { roomId: host.room.id, definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(compiledAfterReopen.ok, true, JSON.stringify(compiledAfterReopen));
    assert.deepEqual(compiledAfterReopen.definition, compiledV1.definition);
    save('02-saved-after-reopen.json', savedV2);
    report.checks.reopenPreserved = true;
    await closeBook(gm);

    // ── 3. Admit in Library & Activate in HUD ──────────────────────────────────────────────────────
    step('Step 3: Admit Dawnstride Stance in Spell Library and activate on Ilse in HUD');
    await openBook(gm, 'Spell Library');
    await book(gm).getByText('Dawnstride Stance', { exact: true }).first().click();
    const detail = gm.locator('.spell-detail-overlay');
    await detail.waitFor({ timeout: 10000 });
    const admitSection = gm.getByRole('region', { name: 'Room admission for Dawnstride Stance', exact: true });
    await admitSection.waitFor({ timeout: 10000 });
    assert.equal(await admitSection.locator('[data-trigger-setup-action]').count(), 0, 'Turn passive must not offer Set up follow-up');
    const classBinding = admitSection.getByRole('combobox', { name: 'Existing class binding', exact: true });
    await classBinding.waitFor({ state: 'visible', timeout: 10000 });
    await classBinding.selectOption('arcanoneer');
    await admitSection.getByRole('button', { name: 'Admit this saved version', exact: true }).click();
    await admitSection.getByText(/^Admitted for /).first().waitFor({ timeout: 15000 });
    save('03-admitted-v1.aria.yml', await admitSection.ariaSnapshot());
    await detail.getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => gm.keyboard.press('Escape'));
    await closeBook(gm);

    const ownerAdmittedToggle = owner.locator('details.p9-admitted > summary').filter({ hasText: 'Admitted abilities' }).first();
    await ownerAdmittedToggle.waitFor({ timeout: 10000 });
    if (!(await owner.locator('details.p9-admitted').filter({ hasText: 'Admitted abilities' }).first().evaluate(el => el.open))) await ownerAdmittedToggle.click();
    const ownerLibRegion = owner.getByRole('region', { name: 'Admitted abilities', exact: true });
    await ownerLibRegion.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
    const ownerRow = ownerLibRegion.locator('.p9-admitted-row', { hasText: 'Dawnstride Stance' });
    await ownerRow.getByText(/While active · self turn start/i).waitFor({ timeout: 10000 });
    await ownerRow.getByText(/Admitted passive turn-boundary trigger/).waitFor({ timeout: 10000 });
    assert.equal(await ownerRow.getByRole('button', { name: 'Use admitted ability' }).count(), 0);

    const gmPassive = await waitPassivePanel(gm, true);
    const passiveSelect = gmPassive.getByLabel('Admitted passive ability', { exact: true });
    await passiveSelect.waitFor({ timeout: 10000 });
    await gm.waitForFunction(() => {
      const sel = document.querySelector('select[aria-label="Admitted passive ability"]');
      return sel && Array.from(sel.options).some(o => o.textContent.includes('Dawnstride Stance') && o.textContent.includes('Turn Start (self)'));
    });
    const optVal = await passiveSelect.locator('option', { hasText: 'Dawnstride Stance' }).first().getAttribute('value');
    await passiveSelect.selectOption(optVal);
    await gmPassive.getByRole('button', { name: 'Activate admitted passive', exact: true }).click();
    await gmPassive.locator('[data-passive-activation-row="active"]', { hasText: 'Dawnstride Stance' }).first().waitFor({ timeout: 10000 });
    const ownerPassive = await waitPassivePanel(owner, true);
    await ownerPassive.locator('[data-passive-status="active"]', { hasText: 'Dawnstride Stance' }).first().waitFor({ timeout: 10000 });
    await gm.screenshot({ path: path.join(out, '04-passive-activated-hud.png') });
    await waitPassivePanel(gm, false);
    await waitPassivePanel(owner, false);
    report.checks.activatedV1 = host.room.gameState[passiveActivation.LEDGER_KEY].activations[0];

    // ── 4. Real GM/Player Encounter (Combat Initiator + Authenticated Turn Advances) ────────────────
    step('Step 4a: Start encounter via Combat Initiator with enemyA (20), allyA (15), pc (10)');
    const combatNavBtn = gm.locator('button[title*="Combat Initiator"], .wow-nav-button[title*="Combat Initiator"]');
    if (await combatNavBtn.count() && await combatNavBtn.first().isVisible()) {
      await combatNavBtn.first().click();
    } else {
      await gm.locator('body').click({ position: { x: 700, y: 500 } }).catch(() => {});
      await gm.keyboard.press('x');
    }
    const overlay = gm.locator('.combat-selection-window');
    await overlay.waitFor({ timeout: 15000 });
    const discovery = overlay.locator('.combatants-discovery-section');
    for (const tokId of ['enemyA', 'allyA', 'pc']) {
      await discovery.locator('.discovery-item').filter({ hasText: `#${tokId}` }).first().click();
    }
    await overlay.locator('#init-enemyA').fill('20');
    await overlay.locator('#init-allyA').fill('15');
    await overlay.locator('#init-pc').fill('10');
    await overlay.getByRole('button', { name: /^Begin Combat \(3\)$/i }).click();
    await overlay.waitFor({ state: 'detached', timeout: 10000 });

    for (const p of [gm, owner]) {
      await p.waitForFunction(() => window.S('combatStore').getState().isInCombat === true, null, { timeout: 15000 });
    }
    const gmOrder = await gm.evaluate(() => window.S('combatStore').getState().turnOrder.map(c => c.tokenId));
    const ownerOrder = await owner.evaluate(() => window.S('combatStore').getState().turnOrder.map(c => c.tokenId));
    assert.deepEqual(gmOrder, ['enemyA', 'allyA', 'pc']);
    assert.deepEqual(ownerOrder, ['enemyA', 'allyA', 'pc']);
    report.checks.turnOrder = gmOrder;

    step('Step 4b: Enable authenticated turn expiry (adopt) -> MUST NOT FIRE');
    await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click();
    await clockUI(gm).waitFor({ timeout: 10000 });
    await clockUI(gm).getByRole('button', { name: 'Enable authenticated turn expiry', exact: true }).click();
    for (let i = 0; i < 40 && !host.room.gameState.combat?.effectLifecycle; i++) await sleep(150);
    assert.equal(host.room.gameState.combat.effectLifecycle.sequence, 0);
    assert.equal(host.room.gameState.maps[host.mapId].characterTokens.pc.state.conditions.length, 0);
    assert.equal(passiveTurnReceipts(host.room).length, 0);
    report.checks.adoptDidNotFire = { sequence: 0, pcConditions: 0, passiveReceipts: 0 };

    const seqNow = () => host.room.gameState.combat.effectLifecycle.sequence;
    const currentActorId = () => host.room.gameState.combat.turnOrder[host.room.gameState.combat.currentTurnIndex].tokenId;
    const advanceAuthenticatedTurn = async (expectedSeq, expectedActor) => {
      const before = seqNow();
      await clockUI(gm).getByRole('button', { name: 'Advance authenticated turn', exact: true }).click();
      for (let i = 0; i < 40 && seqNow() === before; i++) await sleep(150);
      assert.equal(seqNow(), expectedSeq, `Expected sequence ${expectedSeq}, got ${seqNow()}`);
      assert.equal(currentActorId(), expectedActor, `Expected current actor ${expectedActor}, got ${currentActorId()}`);
    };

    step('Step 4c: Advance 1 (enemyA -> allyA, wrong turn) -> MUST NOT FIRE');
    await advanceAuthenticatedTurn(1, 'allyA');
    await sleep(150);
    assert.equal(host.room.gameState.maps[host.mapId].characterTokens.pc.state.conditions.length, 0);
    assert.equal(passiveTurnReceipts(host.room).length, 0);
    report.checks.allyTurnDidNotFire = { sequence: 1, currentActor: 'allyA', pcConditions: 0, passiveReceipts: 0 };

    step('Step 4d: Advance 2 (allyA -> pc, declared self turn_start boundary) -> MUST FIRE ONCE with no 8s window');
    await advanceAuthenticatedTurn(2, 'pc');
    for (const p of [gm, owner]) {
      await p.waitForFunction(() => {
        const tok = S('characterTokenStore').getState().characterTokens.find(t => t.id === 'pc');
        return tok?.state?.conditions?.some(c => c.name === 'Dawnstride');
      }, null, { timeout: 10000 });
    }
    const pcAfterFire = host.room.gameState.maps[host.mapId].characterTokens.pc;
    const receiptsAfterFire = passiveTurnReceipts(host.room);
    assert.equal(pcAfterFire.state.conditions.length, 1);
    assert.equal(pcAfterFire.state.conditions[0].name, 'Dawnstride');
    assert.equal(pcAfterFire.state.conditions[0].effects.movementSpeed, 10);
    assert.equal(receiptsAfterFire.length, 1);
    assert.equal(receiptsAfterFire[0].adjudication.definitionId, pure.actionId(report.checks.activatedV1.definitionRef));
    assert.equal(JSON.parse(receiptsAfterFire[0].adjudication.chosenResult).trigger, 'turn_start');

    const windows = await gm.evaluate(
      roomId => new Promise(resolve => window.__socket.emit('reaction_window_list', { roomId }, resolve)),
      host.room.id
    );
    assert.ok(Array.isArray(windows?.windows), `Unexpected reaction_window_list response: ${JSON.stringify(windows)}`);
    assert.equal(windows.windows.length, 0, 'No 8s reaction window may open for passive turn boundary');

    for (const p of [gm, owner]) {
      const tracker = p.getByRole('region', { name: 'Combat tracker', exact: true });
      await tracker.getByRole('list', { name: 'Active effects', exact: true }).getByText('Dawnstride', { exact: true }).waitFor({ timeout: 10000 });
    }

    await gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).click();
    await gm.screenshot({ path: path.join(out, '05-encounter-fired-gm.png') });
    await owner.screenshot({ path: path.join(out, '06-encounter-fired-owner.png') });
    report.checks.selfTurnStartFiredOnce = {
      sequence: 2,
      currentActor: 'pc',
      condition: pcAfterFire.state.conditions[0],
      receipt: actors.publicReceipt(receiptsAfterFire[0]),
      reactionWindows: windows.windows.length
    };

    step('Step 4e: Advance 3-5 (pc -> enemyA -> allyA -> pc) -> MUST NOT FIRE ON WRONG TURNS OR STACK ON REPEAT');
    await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click();
    await clockUI(gm).waitFor({ timeout: 10000 });

    await advanceAuthenticatedTurn(3, 'enemyA');
    assert.equal(host.room.gameState.maps[host.mapId].characterTokens.pc.state.conditions.length, 1);
    assert.equal(passiveTurnReceipts(host.room).length, 1);

    await advanceAuthenticatedTurn(4, 'allyA');
    assert.equal(host.room.gameState.maps[host.mapId].characterTokens.pc.state.conditions.length, 1);
    assert.equal(passiveTurnReceipts(host.room).length, 1);

    await advanceAuthenticatedTurn(5, 'pc');
    await sleep(150);
    assert.equal(host.room.gameState.maps[host.mapId].characterTokens.pc.state.conditions.length, 1, 'Must not stack duplicate Dawnstride while active');
    assert.equal(passiveTurnReceipts(host.room).length, 1, 'Must not fire a second passive receipt while active');
    await gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).click();
    report.checks.wrongTurnsAndNoDuplicateStack = { finalSequence: 5, currentActor: 'pc', pcConditions: 1, passiveReceipts: 1 };

    assert.equal(report.errors.length, 0, `Unexpected browser pageerrors: ${JSON.stringify(report.errors)}`);
    report.passed = true;
    save('result.json', report);
    console.log('PASS: all passive turn-boundary browser verification checks succeeded ->', path.join(out, 'result.json'));
  } catch (err) {
    report.failure = err.stack || String(err);
    save('result.json', report);
    await Promise.all(Object.entries(pages).map(([role, p]) =>
      p.screenshot({ path: path.join(out, `failure-${role}.png`) }).catch(() => {})
    ));
    throw err;
  } finally {
    report.endedAt = new Date().toISOString();
    save('result.json', report);
    await Promise.all(Object.values(contexts).map(c => c.close().catch(() => {})));
    await browser.close().catch(() => {});
    await host.stop().catch(() => {});
  }
}

if (require.main === module) {
  main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
}
