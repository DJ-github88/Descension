// Live Chromium end-to-end verification for authored passive movement-entry ability.
// Uses real optimized CRACO build + real createProductionStackServer + real Socket.IO + real UI Wizard/HUD/Drag.
require('../p7/preload.cjs');
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.PASSIVE_ENTRY_OUTPUT || 'D:\\AppData\\Temp\\opencode\\passive-entry-verify';
if (!path.isAbsolute(out)) throw Error('PASSIVE_ENTRY_OUTPUT must be absolute');
fs.mkdirSync(out, { recursive: true });
process.env.APP_OUTPUT = path.join(out, 'fixture');

const root = path.resolve(__dirname, '../../..');
const buildDir = path.resolve(process.env.APP_BUILD_DIR || path.join(root, 'vtt-react/build'));
const { createProductionStackServer } = require(path.join(root, 'server/tests/helpers/productionStackServer'));
const actors = require(path.join(root, 'server/services/actorConsequences'));
const relationships = require(path.join(root, 'server/services/actorRelationships'));
const passiveActivation = require(path.join(root, 'server/services/passiveActivation'));
const profile = require(path.join(root, 'server/shared/services/sharedConditionProfile'));
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
  kind: 'authored-passive-movement-entry-browser-witness',
  startedAt: new Date().toISOString(),
  passed: false,
  checks: {},
  errors: [],
  steps: []
};
const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); save('progress.json', report); };

function patchClick(page) {
  const L = Object.getPrototypeOf(page.locator('body'));
  if (L.__pe) return;
  L.__pe = true;
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
  if (!page.__peFonts) {
    page.__peFonts = true;
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
  });
  return info;
}

const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
const finalizeBtn = p => book(p).locator('button.finalize-btn');
const loadBtn = p => book(p).locator('button[title="Open a saved spell for editing"]');
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
    'actor_relationship_set', 'token_moved', 'character_moved', 'join_room'
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
    ['enemyB', 'Enemy B', 475, 325],
    ['enemyC', 'Enemy C', 475, 375],
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
    ['creature', 'enemyB'],
    ['creature', 'enemyC'],
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
    [[refs.enemyA, refs.enemyB, refs.enemyC], 'enemy'],
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

async function tokenLocator(p, id) {
  await p.waitForFunction(tokId => {
    return Array.from(document.querySelectorAll('.creature-token')).some(el => {
      let f = el[Object.keys(el).find(k => k.startsWith('__reactFiber'))];
      for (; f; f = f.return) {
        if (f.memoizedProps?.tokenId === tokId) {
          el.dataset.verifyToken = tokId;
          return true;
        }
      }
      return false;
    });
  }, id, { timeout: 15000 });
  return p.locator(`[data-verify-token="${id}"]`);
}

async function dragCreatureToken(page, host, tokenId, targetWorldPos) {
  await page.evaluate(() => {
    S('gameStore').setState({ cameraX: 350, cameraY: 325, zoomLevel: 1, playerZoom: 1 });
  });
  await page.waitForTimeout(100);
  const loc = await tokenLocator(page, tokenId);
  const box = await loc.boundingBox();
  assert.ok(box && box.width > 0, `Bounding box missing for ${tokenId}`);

  const dest = await page.evaluate(({ x, y }) => {
    const gs = window.gridSystem;
    if (!gs) throw Error('window.gridSystem missing');
    return gs.worldToScreen(x, y, window.innerWidth, window.innerHeight);
  }, targetWorldPos);

  const outboundBefore = await page.evaluate(() => window.__outbound.length);
  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(dest.x, dest.y, { steps: 10 });
  await page.mouse.up();
  await page.mouse.move(120, 450);

  await page.waitForFunction(({ tokId, startIdx }) => {
    return window.__outbound.slice(startIdx).some(
      ev => ev.event === 'token_moved' && ev.payload?.tokenId === tokId
    );
  }, { tokId: tokenId, startIdx: outboundBefore }, { timeout: 10000 });

  await sleep(160);
  const emitted = await page.evaluate(({ tokId, startIdx }) => {
    const entries = window.__outbound.slice(startIdx).filter(
      ev => ev.event === 'token_moved' && ev.payload?.tokenId === tokId
    );
    return entries[entries.length - 1]?.payload || null;
  }, { tokId: tokenId, startIdx: outboundBefore });

  const serverTok = host.room.gameState.maps[host.mapId].tokens[tokenId];
  assert.deepEqual(serverTok.position, targetWorldPos, `Server token ${tokenId} expected at ${JSON.stringify(targetWorldPos)}, got ${JSON.stringify(serverTok.position)}`);
  return emitted;
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

    // ── 1. Create Passive from scratch in Spell Wizard ─────────────────────────────────────────────
    step('Step 1: Author passive "Frost Ward Aura" from scratch in Spell Wizard');
    await openBook(gm, 'Spell Wizard');
    await resetWizard(gm);

    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('Frost Ward Aura');
    await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('While active, enemies moving into its radius suffer Frost Slow.');
    await book(gm).getByText('Arcane', { exact: true }).click();

    const nav = book(gm).getByRole('navigation', { name: 'Spell wizard steps' });
    await nav.getByRole('button', { name: /Spell Type$/ }).click();
    await book(gm).getByRole('heading', { name: 'PASSIVE', exact: true }).click();
    await book(gm).getByText(/Moves Into Passive Radius/).waitFor({ timeout: 5000 });

    await nav.getByRole('button', { name: /^3 Effects$/ }).click();
    await book(gm).getByRole('heading', { name: 'Control', exact: true }).click();
    await book(gm).getByRole('button', { name: /^Use composed effect profile/ }).click();
    const fields = book(gm).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
    await fields.getByLabel(/^Canonical effect/).selectOption('movement');
    await fields.getByLabel(/^Effect name shown on the target/).fill('Frost Slow');
    await fields.getByLabel(/^Movement change/).fill('-10');
    await fields.getByLabel(/^Expiry/).selectOption('gm-manual');
    await fields.getByLabel(/^Source-authored duration text/).fill('Until GM removes');
    await fields.getByLabel(/^Required GM adjudication note/).fill('GM removes Frost Slow manually.');

    await nav.getByRole('button', { name: /Triggers$/ }).click();
    await book(gm).locator('.wow-trigger-category-name', { hasText: 'Movement' }).first().click();
    await book(gm).locator('.wow-trigger-option', { hasText: 'Moves Into Passive Radius' }).first().click();
    await book(gm).locator('.pf-selected-triggers .pf-selected-trigger-name').getByText('Moves Into Passive Radius', { exact: true }).waitFor({ timeout: 5000 });

    await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click();
    await book(gm).getByText('Self-Centered', { exact: true }).click();
    await book(gm).getByText('Circle', { exact: true }).click();
    const radiusGroup = book(gm).locator('.param-group', { hasText: 'Radius (feet)' });
    await radiusGroup.locator('.range-value').getByText('10 ft', { exact: true }).waitFor({ timeout: 5000 });
    const summaryText = await book(gm).locator('.targeting-selected-summary').innerText();
    assert.ok(summaryText.includes('Enemies'), `Expected Enemies default restriction, got: ${summaryText}`);

    await nav.getByRole('button', { name: /Resources$/ }).click();
    await nav.getByRole('button', { name: /Cooldown$/ }).click();
    await nav.getByRole('button', { name: /Review$/ }).click();
    await gm.screenshot({ path: path.join(out, '01-wizard-passive-review.png') });

    await finalizeBtn(gm).click({ force: true });
    await gm.waitForFunction(n => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(n)), 'Frost Ward Aura');

    const savedV1 = await savedRecord(gm, 'Frost Ward Aura');
    assert.ok(savedV1, 'Saved record exists');
    assert.equal(savedV1.spellType, 'PASSIVE');
    assert.equal(savedV1.targetingConfig.rangeType, 'self_centered');
    assert.equal(savedV1.targetingConfig.aoeShape, 'circle');
    assert.equal(savedV1.targetingConfig.aoeParameters.radius, 10);
    assert.deepEqual(savedV1.targetingConfig.targetRestrictions, ['enemy']);
    assert.equal(savedV1.triggerConfig.global.compoundTriggers[0].id, 'moves_into_radius');
    assert.equal(savedV1.controlConfig.authoredCondition.label, 'Frost Slow');
    assert.equal(savedV1.controlConfig.authoredCondition.movementFeet, -10);
    const compiledV1 = pure.definitionFromWizard(savedV1, { roomId: host.room.id, definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(compiledV1.ok, true, JSON.stringify(compiledV1));
    assert.equal(compiledV1.definition.capability, pure.PASSIVE_ENTRY_CAPABILITY);
    assert.equal(compiledV1.definition.targeting.radiusFeet, 10);
    assert.equal(compiledV1.definition.targeting.restriction, 'enemy');
    save('01-saved-v1.json', savedV1);
    report.checks.createdV1 = compiledV1.definition;
    await closeBook(gm);

    // ── 2. Save & Reopen in Edit mode ──────────────────────────────────────────────────────────────
    step('Step 2: Reopen saved passive in Edit mode and confirm full preservation');
    await editSpellFromLoadModal(gm, 'Frost Ward Aura');
    await nav.getByRole('button', { name: /^3 Effects$/ }).click();
    const reopenedFields = book(gm).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
    assert.equal(await reopenedFields.getByLabel(/^Canonical effect/).inputValue(), 'movement');
    assert.equal(await reopenedFields.getByLabel(/^Effect name shown on the target/).inputValue(), 'Frost Slow');
    assert.equal(await reopenedFields.getByLabel(/^Movement change/).inputValue(), '-10');
    assert.equal(await reopenedFields.getByLabel(/^Expiry/).inputValue(), 'gm-manual');

    await nav.getByRole('button', { name: /Triggers$/ }).click();
    await book(gm).locator('.pf-selected-triggers .pf-selected-trigger-name').getByText('Moves Into Passive Radius', { exact: true }).waitFor({ timeout: 5000 });

    await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click();
    await book(gm).locator('.param-group', { hasText: 'Radius (feet)' }).locator('.range-value').getByText('10 ft', { exact: true }).waitFor();
    assert.ok((await book(gm).locator('.targeting-selected-summary').innerText()).includes('Enemies'));
    report.checks.reopenPreserved = true;
    await closeBook(gm);

    // ── 3. Admit in Library & Activate in HUD ──────────────────────────────────────────────────────
    step('Step 3: Admit v1 in Spell Library and activate on Ilse in HUD');
    await openBook(gm, 'Spell Library');
    await book(gm).getByText('Frost Ward Aura', { exact: true }).first().click();
    const detail = gm.locator('.spell-detail-overlay');
    await detail.waitFor({ timeout: 10000 });
    const admitSection = gm.getByRole('region', { name: 'Room admission for Frost Ward Aura', exact: true });
    await admitSection.waitFor({ timeout: 10000 });
    const behaviorDetails = admitSection.locator('details.spell-behavior-details-disclosure').first();
    if (await behaviorDetails.count() && !(await behaviorDetails.evaluate(el => el.open))) {
      await admitSection.locator('details.spell-behavior-details-disclosure > summary').first().click();
    }
    const techDetails = admitSection.locator('details.p9-tech-disclosure').first();
    if (await techDetails.count() && !(await techDetails.evaluate(el => el.open))) {
      await admitSection.locator('details.p9-tech-disclosure > summary').first().click();
    }
    await admitSection.getByText(/Teleport, forced movement, and re-entry remain unsettled\/open/).first().waitFor({ state: 'visible', timeout: 5000 });
    assert.equal(await admitSection.locator('[data-trigger-setup-action]').count(), 0, 'Passive must not offer Set up follow-up');
    const classBinding = admitSection.getByRole('combobox', { name: 'Existing class binding', exact: true });
    await classBinding.waitFor({ state: 'visible', timeout: 10000 });
    await classBinding.selectOption('arcanoneer');
    await admitSection.getByRole('button', { name: 'Admit this saved version', exact: true }).click();
    await admitSection.getByText(/^Admitted for /).first().waitFor({ timeout: 15000 });
    save('02-admitted-v1.aria.yml', await admitSection.ariaSnapshot());
    await detail.getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => gm.keyboard.press('Escape'));
    await closeBook(gm);

    // Verify Owner Admitted abilities section renders passive entry without crashing
    const ownerAdmittedToggle = owner.locator('details.p9-admitted > summary').filter({ hasText: 'Admitted abilities' }).first();
    await ownerAdmittedToggle.waitFor({ timeout: 10000 });
    if (!(await owner.locator('details.p9-admitted').filter({ hasText: 'Admitted abilities' }).first().evaluate(el => el.open))) await ownerAdmittedToggle.click();
    const ownerLibRegion = owner.getByRole('region', { name: 'Admitted abilities', exact: true });
    await ownerLibRegion.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
    await ownerLibRegion.locator('.p9-admitted-row', { hasText: 'Frost Ward Aura' }).getByText(/While active · enemy enters 10 ft radius/i).waitFor({ timeout: 10000 });
    assert.equal(await ownerLibRegion.locator('.p9-admitted-row', { hasText: 'Frost Ward Aura' }).getByRole('button', { name: 'Use admitted ability' }).count(), 0);

    // GM activates Frost Ward Aura on Ilse in HUD PassiveActivationPanel
    const gmPassive = await waitPassivePanel(gm, true);
    const passiveSelect = gmPassive.getByLabel('Admitted passive ability', { exact: true });
    await passiveSelect.waitFor({ timeout: 10000 });
    await gm.waitForFunction(() => {
      const sel = document.querySelector('select[aria-label="Admitted passive ability"]');
      return sel && Array.from(sel.options).some(o => o.textContent.includes('Frost Ward Aura') && o.textContent.includes('10 ft'));
    });
    const optVal = await passiveSelect.locator('option', { hasText: 'Frost Ward Aura' }).first().getAttribute('value');
    await passiveSelect.selectOption(optVal);
    await gmPassive.getByRole('button', { name: 'Activate admitted passive', exact: true }).click();
    await gmPassive.locator('[data-passive-activation-row="active"]', { hasText: 'Frost Ward Aura' }).first().waitFor({ timeout: 10000 });
    const ownerPassive = await waitPassivePanel(owner, true);
    await ownerPassive.locator('[data-passive-status="active"]', { hasText: 'Frost Ward Aura' }).first().waitFor({ timeout: 10000 });
    await gm.screenshot({ path: path.join(out, '02-passive-activated-hud.png') });
    await waitPassivePanel(gm, false);
    report.checks.activatedV1 = host.room.gameState[passiveActivation.LEDGER_KEY].activations[0];

    // ── 4. Live Movement Tests (Drag in Browser) ───────────────────────────────────────────────────
    const receiptsBeforeStep4 = actors.ledger(host.room).receipts.length;
    step('Step 4a: Move enemyA from outside (425,325 = 20 ft) to inside (325,325 = 10 ft) -> MUST FIRE');
    const firstMovePayload = await dragCreatureToken(gm, host, 'enemyA', { x: 325, y: 325 });
    await gm.waitForFunction(() => {
      const tok = S('creatureStore').getState().creatureTokens.find(t => t.id === 'enemyA');
      return tok?.state?.conditions?.some(c => c.name === 'Frost Slow');
    }, null, { timeout: 10000 });
    await owner.waitForFunction(() => {
      const tok = S('creatureStore').getState().creatureTokens.find(t => t.id === 'enemyA');
      return tok?.state?.conditions?.some(c => c.name === 'Frost Slow');
    }, null, { timeout: 10000 });
    const receiptsAfterFirst = actors.ledger(host.room).receipts.length;
    assert.equal(receiptsAfterFirst, receiptsBeforeStep4 + 1);
    assert.equal(actors.ledger(host.room).receipts.at(-1)?.adjudication?.definitionId, pure.actionId(report.checks.activatedV1.definitionRef));
    const enemyAAfter = host.room.gameState.maps[host.mapId].tokens.enemyA;
    assert.equal(enemyAAfter.state.conditions.length, 1);
    assert.equal(enemyAAfter.state.conditions[0].name, 'Frost Slow');
    assert.equal(enemyAAfter.state.conditions[0].effects.movementSpeed, -10);
    await gm.screenshot({ path: path.join(out, '03-enemyA-triggered.png') });
    report.checks.enemyOutsideToInside = { receipts: receiptsAfterFirst, condition: enemyAAfter.state.conditions[0], firstActionId: firstMovePayload.actionId };

    step('Step 4b: Move enemyA entirely inside (325,325 -> 275,325) -> MUST NOT FIRE');
    await dragCreatureToken(gm, host, 'enemyA', { x: 275, y: 325 });
    await sleep(250);
    assert.equal(host.room.gameState.maps[host.mapId].tokens.enemyA.state.conditions.length, 1);
    assert.equal(actors.ledger(host.room).receipts.length, receiptsAfterFirst);
    report.checks.enemyInsideToInsideSkipped = true;

    step('Step 4c: Move allyA across exact same boundary (425,375 -> 325,325) -> MUST NOT FIRE');
    await dragCreatureToken(gm, host, 'allyA', { x: 325, y: 325 });
    await sleep(250);
    assert.equal(host.room.gameState.maps[host.mapId].tokens.allyA.state.conditions.length, 0);
    assert.equal(actors.ledger(host.room).receipts.length, receiptsAfterFirst);
    // Clear (325,325) so replay & enemyA exit never share a cell
    await dragCreatureToken(gm, host, 'allyA', { x: 425, y: 375 });
    await sleep(150);
    report.checks.allyBoundarySkipped = true;

    step('Step 4d: Replay exact same movement actionId (both at destination and after stepping outside) -> MUST NOT APPLY TWICE');
    await gm.evaluate(p => window.__socket.emit('token_moved', p), firstMovePayload);
    await sleep(250);
    assert.equal(host.room.gameState.maps[host.mapId].tokens.enemyA.state.conditions.length, 1);
    assert.equal(actors.ledger(host.room).receipts.length, receiptsAfterFirst);
    // Also step outside (425,325) then replay exact same actionId back inside (325,325)
    await dragCreatureToken(gm, host, 'enemyA', { x: 425, y: 325 });
    await gm.evaluate(p => window.__socket.emit('token_moved', p), firstMovePayload);
    await sleep(250);
    assert.equal(host.room.gameState.maps[host.mapId].tokens.enemyA.state.conditions.length, 1);
    assert.equal(actors.ledger(host.room).receipts.length, receiptsAfterFirst);
    report.checks.replayDeduplicated = true;

    step('Step 4e: Move enemyB (475,325 = 25 ft -> 375,325 = 15 ft) under 10 ft radius -> MUST NOT FIRE');
    await dragCreatureToken(gm, host, 'enemyB', { x: 375, y: 325 });
    await sleep(250);
    assert.equal(host.room.gameState.maps[host.mapId].tokens.enemyB.state.conditions.length, 0);
    assert.equal(actors.ledger(host.room).receipts.length, receiptsAfterFirst);
    // Return enemyB to 25 ft (475,325) before radius edit
    await dragCreatureToken(gm, host, 'enemyB', { x: 475, y: 325 });
    report.checks.enemyBOutside10Ft = true;

    // ── 5. Edit Radius in Wizard (10 ft -> 20 ft), Re-Admit v2, Re-Activate v2, Re-test enemyB ───
    step('Step 5: Edit radius 10 ft -> 20 ft in Wizard, admit v2, activate v2, repeat enemyB move -> MUST NOW FIRE');
    await editSpellFromLoadModal(gm, 'Frost Ward Aura');
    await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click();
    const editRadiusGroup = book(gm).locator('.param-group', { hasText: 'Radius (feet)' });
    const slider = editRadiusGroup.locator('input[type="range"]');
    await slider.focus();
    await slider.press('ArrowRight');
    await slider.press('ArrowRight');
    await editRadiusGroup.locator('.range-value').getByText('20 ft', { exact: true }).waitFor({ timeout: 5000 });

    await nav.getByRole('button', { name: /Review$/ }).click();
    await finalizeBtn(gm).click({ force: true });
    await gm.waitForFunction(() => {
      const k = Object.keys(localStorage).find(key => key.endsWith(':library.spellData'));
      const rec = k && JSON.parse(localStorage.getItem(k)).payload.data.spells.find(s => s.name === 'Frost Ward Aura');
      return rec?.targetingConfig?.aoeParameters?.radius === 20;
    }, null, { timeout: 10000 });
    await closeBook(gm);

    // Admit v2
    await openBook(gm, 'Spell Library');
    await book(gm).getByText('Frost Ward Aura', { exact: true }).first().click();
    const admitV2Section = gm.getByRole('region', { name: 'Room admission for Frost Ward Aura', exact: true });
    await admitV2Section.waitFor({ timeout: 10000 });
    const classBindingV2 = admitV2Section.getByRole('combobox', { name: 'Existing class binding', exact: true });
    if (await classBindingV2.count() && !(await classBindingV2.inputValue())) {
      await classBindingV2.selectOption('arcanoneer');
    }
    await admitV2Section.getByRole('button', { name: 'Admit this saved version', exact: true }).click();
    await admitV2Section.getByText(/^Admitted for .*version 2/).first().waitFor({ timeout: 15000 });
    await detail.getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => gm.keyboard.press('Escape'));
    await closeBook(gm);

    // Revoke v1 activation and activate v2 (20 ft)
    await waitPassivePanel(gm, true);
    await gmPassive.getByRole('button', { name: 'Revoke passive', exact: true }).first().click();
    await gm.waitForFunction(() => {
      const sel = document.querySelector('select[aria-label="Admitted passive ability"]');
      return sel && Array.from(sel.options).some(o => o.textContent.includes('20 ft'));
    }, null, { timeout: 10000 });
    const optV2 = await passiveSelect.locator('option', { hasText: '20 ft' }).first().getAttribute('value');
    await passiveSelect.selectOption(optV2);
    await gmPassive.getByRole('button', { name: 'Activate admitted passive', exact: true }).click();
    await gmPassive.locator('[data-passive-activation-row="active"]', { hasText: 'Frost Ward Aura' }).first().waitFor({ timeout: 10000 });
    await waitPassivePanel(gm, false);

    // Move enemyB 25 ft -> 15 ft again: MUST NOW FIRE under 20 ft radius!
    await dragCreatureToken(gm, host, 'enemyB', { x: 375, y: 325 });
    await gm.waitForFunction(() => {
      const tok = S('creatureStore').getState().creatureTokens.find(t => t.id === 'enemyB');
      return tok?.state?.conditions?.some(c => c.name === 'Frost Slow');
    }, null, { timeout: 10000 });
    assert.equal(actors.ledger(host.room).receipts.length, receiptsAfterFirst + 1);
    const enemyBAfter = host.room.gameState.maps[host.mapId].tokens.enemyB;
    assert.equal(enemyBAfter.state.conditions.length, 1);
    assert.equal(enemyBAfter.state.conditions[0].name, 'Frost Slow');
    assert.equal(enemyBAfter.state.conditions[0].effects.movementSpeed, -10);
    await gm.screenshot({ path: path.join(out, '04-radius-20ft-enemyB-triggered.png') });
    report.checks.radiusEdit20FtTriggeredEnemyB = { receipts: actors.ledger(host.room).receipts.length, condition: enemyBAfter.state.conditions[0] };

    // ── 6. Leave teleport, forced movement, and re-entry open/unsettled ───────────────────────────
    step('Step 6: Verify teleport, forced movement, and active re-entry remain open/unsettled');
    const receiptsBeforeOpen = actors.ledger(host.room).receipts.length;
    await gm.evaluate(({ roomId, mapId }) => {
      __socket.emit('token_moved', { roomId, mapId, tokenId: 'enemyC', position: { x: 325, y: 375 }, actionId: 'tp-' + Math.random(), isTeleport: true, movementKind: 'teleport' });
    }, { roomId: host.room.id, mapId: host.mapId });
    await sleep(200);
    assert.equal(host.room.gameState.maps[host.mapId].tokens.enemyC.state.conditions.length, 0);

    await gm.evaluate(({ roomId, mapId }) => {
      __socket.emit('token_moved', { roomId, mapId, tokenId: 'enemyC', position: { x: 475, y: 375 }, actionId: 'tp-out-' + Math.random(), isTeleport: true, movementKind: 'teleport' });
    }, { roomId: host.room.id, mapId: host.mapId });
    await sleep(200);

    await gm.evaluate(({ roomId, mapId }) => {
      __socket.emit('token_moved', { roomId, mapId, tokenId: 'enemyC', position: { x: 325, y: 375 }, actionId: 'forced-' + Math.random(), forcedMovement: true, movementKind: 'forced' });
    }, { roomId: host.room.id, mapId: host.mapId });
    await sleep(200);
    assert.equal(host.room.gameState.maps[host.mapId].tokens.enemyC.state.conditions.length, 0);

    // Re-entry while active: move enemyB outside (475,325) then back inside (375,325) -> no duplicate stacking
    await dragCreatureToken(gm, host, 'enemyB', { x: 475, y: 325 });
    await dragCreatureToken(gm, host, 'enemyB', { x: 375, y: 325 });
    await sleep(200);
    assert.equal(host.room.gameState.maps[host.mapId].tokens.enemyB.state.conditions.length, 1);
    assert.equal(actors.ledger(host.room).receipts.length, receiptsBeforeOpen);
    report.checks.openRulesUnsettled = { teleportSkipped: true, forcedMovementSkipped: true, reentryNotDuplicated: true };

    assert.equal(report.errors.length, 0, `Unexpected browser pageerrors: ${JSON.stringify(report.errors)}`);
    report.passed = true;
    save('result.json', report);
    console.log('PASS: all browser verification checks succeeded ->', path.join(out, 'result.json'));
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
