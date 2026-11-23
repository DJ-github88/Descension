'use strict';

// Live Chromium end-to-end verification for placed-effect foundation (`placed-effect:v1`).
// Exercises real production CRACO build + real createProductionStackServer + real Socket.IO + Playwright.
require('../p7/preload.cjs');
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.PLACED_EFFECT_OUTPUT || 'D:\\AppData\\Temp\\opencode\\placed-effect-verify';
if (!path.isAbsolute(out)) throw Error('PLACED_EFFECT_OUTPUT must be absolute');
fs.mkdirSync(out, { recursive: true });
process.env.APP_OUTPUT = path.join(out, 'fixture');

const root = path.resolve(__dirname, '../../..');
const buildDir = path.resolve(process.env.APP_BUILD_DIR || path.join(root, 'vtt-react/build'));
const { createProductionStackServer } = require(path.join(root, 'server/tests/helpers/productionStackServer'));
const actors = require(path.join(root, 'server/services/actorConsequences'));
const installed = require(path.join(root, 'server/services/installedAuthoredAbilities'));
const placed = require(path.join(root, 'server/services/placedEffect'));
const pure = require('../../src/services/authoredAbility');
const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');

const clone = v => JSON.parse(JSON.stringify(v));
const save = (name, val) => fs.writeFileSync(path.join(out, name), typeof val === 'string' ? val : JSON.stringify(val, null, 2));
const ack = (s, event, payload) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(Error(`ACK timeout ${event}`)), 10000);
  s.emit(event, payload, r => { clearTimeout(t); resolve(r); });
});

const report = {
  kind: 'placed-effect-foundation-browser-witness',
  startedAt: new Date().toISOString(),
  buildDir,
  passed: false,
  checks: {},
  errors: [],
  steps: []
};
const step = s => {
  report.steps.push({ at: new Date().toISOString(), step: s });
  console.log('·', s);
  save('progress.json', report);
};

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
    window.S('gameStore').setState({ cameraX: 350, cameraY: 325, zoomLevel: 1, playerZoom: 1 });
  });
  return info;
}

const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
const finalizeBtn = p => book(p).locator('button.finalize-btn');
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

async function startHost() {
  assert.ok(fs.existsSync(path.join(buildDir, 'asset-manifest.json')), `Missing production build in ${buildDir}`);
  const backend = createProductionStackServer({ debounceMs: 20, characterOwners: { ilse: 'app-owner' } });
  await backend.start();
  for (const e of [
    'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list',
    'actor_bind', 'actor_placed_effect_list', 'actor_placed_effect_place', 'actor_placed_effect_remove',
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
    name: 'Placed Test Hall',
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

  hall.tokens.enemyA = {
    id: 'enemyA',
    creatureId: 'grimmstalk',
    name: 'Enemy A',
    size: 'medium',
    mapId,
    stats: { ...clone(baseCreature.stats), speed: 30, maxHp: 50 },
    position: { x: 225, y: 325 },
    state: {
      customName: 'Enemy A',
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
  hall.characterTokens.pc = {
    id: 'pc',
    mapId,
    ownerUserId: 'app-owner',
    position: { x: 175, y: 325 },
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
  for (const [kind, id] of [['character', 'pc'], ['creature', 'enemyA']]) {
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

async function main() {
  const host = await startHost();
  const browser = await chromium.launch({ headless: true });
  const contexts = {};
  const pages = {};
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner'], ['observer', 'app-observer']]) {
      const ctx = contexts[role] = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
        reducedMotion: 'reduce'
      });
      const page = pages[role] = await ctx.newPage();
      page.on('pageerror', e => {
        if (!/Failed to fetch|blockedbyclient/i.test(e.message)) {
          report.errors.push({ role, message: e.message, stack: e.stack });
        }
      });
      await setup(page, host.url, uid);
    }
    const { gm, owner, observer } = pages;

    // 1. Verify existing manual Wizard TRAP authoring remains manual-only
    step('Step 1: Verify manual Wizard TRAP draft saves and stays manual');
    await openBook(gm, 'Spell Wizard');
    await resetWizard(gm);
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('Manual Snare Draft');
    await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('GM-managed manual trap draft.');
    await book(gm).getByText('Arcane', { exact: true }).click();
    const nav = book(gm).getByRole('navigation', { name: 'Spell wizard steps' });
    await nav.getByRole('button', { name: /Spell Type$/ }).click();
    await book(gm).getByRole('heading', { name: 'TRAP', exact: true }).click();
    await nav.getByRole('button', { name: /Review$/ }).click();
    await finalizeBtn(gm).click({ force: true });
    await gm.waitForFunction(n => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(n)), 'Manual Snare Draft');
    const savedTrap = await savedRecord(gm, 'Manual Snare Draft');
    assert.equal(savedTrap.spellType, 'TRAP');
    assert.equal(pure.definitionFromWizard(savedTrap, { roomId: host.room.id, classId: 'arcanoneer', definitionVersion: 1 }).ok, false);
    report.checks.manualTrapIntact = true;
    await closeBook(gm);

    // 2. Admit an immediate PC ability for placement custody
    step('Step 2: Author & admit Frost Snare for placed-effect map custody');
    await openBook(gm, 'Spell Wizard');
    await resetWizard(gm);
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('Frost Snare');
    await book(gm).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Reusable snare condition placed via GM map custody.');
    await book(gm).getByText('Arcane', { exact: true }).click();
    await nav.getByRole('button', { name: /Spell Type$/ }).click();
    await book(gm).getByRole('heading', { name: 'ACTION', exact: true }).click();
    await book(gm).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
    await nav.getByRole('button', { name: /^3 Effects$/ }).click();
    await book(gm).getByRole('heading', { name: 'Control', exact: true }).click();
    await book(gm).getByRole('button', { name: /^Use composed effect profile/ }).click();
    const fields = book(gm).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
    await fields.getByLabel(/^Canonical effect/).selectOption('movement');
    await fields.getByLabel(/^Effect name shown on the target/).fill('Snared');
    await fields.getByLabel(/^Movement change/).fill('-10');
    await fields.getByLabel(/^Expiry/).selectOption('gm-manual');
    await fields.getByLabel(/^Source-authored duration text/).fill('Until GM clears');
    await fields.getByLabel(/^Required GM adjudication note/).fill('Manual placement timing.');
    await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click();
    await book(gm).getByText('Single Target', { exact: true }).click();
    await book(gm).getByText('Ranged', { exact: true }).click();
    const slider = book(gm).getByRole('slider').first();
    await slider.focus();
    await slider.press('Home');
    for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
    await book(gm).getByText('Enemies', { exact: true }).click();
    await book(gm).getByText('Any Target', { exact: true }).click();
    await nav.getByRole('button', { name: /Resources$/ }).click();
    await book(gm).getByTitle('Standard magical energy', { exact: true }).click();
    await book(gm).getByTitle('Basic action economy', { exact: true }).click();
    const inputs = book(gm).getByRole('spinbutton');
    await inputs.nth(0).fill('2');
    await inputs.nth(1).fill('1');
    await nav.getByRole('button', { name: /Review$/ }).click();
    await finalizeBtn(gm).click({ force: true });
    await gm.waitForFunction(n => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(n)), 'Frost Snare');
    const savedSnare = await savedRecord(gm, 'Frost Snare');
    assert.ok(savedSnare);

    const compiledSnare = pure.definitionFromWizard(savedSnare, { roomId: host.room.id, classId: 'arcanoneer', definitionVersion: 1 });
    assert.equal(compiledSnare.ok, true, JSON.stringify(compiledSnare));

    await book(gm).getByRole('button', { name: 'Spell Library', exact: true }).click();
    await book(gm).getByText('Frost Snare', { exact: true }).click();
    const admitRegion = gm.getByRole('region', { name: 'Room admission for Frost Snare', exact: true });
    await admitRegion.waitFor({ timeout: 10000 });
    await admitRegion.getByRole('button', { name: 'Admit this saved version', exact: true }).click();
    await admitRegion.getByText(/^Admitted for /).waitFor({ timeout: 10000 });
    await gm.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click({ timeout: 3000 }).catch(() => gm.keyboard.press('Escape'));
    await closeBook(gm);
    await gm.getByRole('button', { name: 'Refresh placed effects' }).click();

    // 3. GM places on map interactively via PlacedEffectPanel + PlacedEffectOverlay
    step('Step 3: GM places unarmed Trap via HUD and map overlay click');
    const gmPanel = gm.getByTestId('placed-effect-panel');
    await gmPanel.waitFor({ timeout: 10000 });
    await gm.waitForFunction(() => {
      const sel = document.querySelector('select[aria-label="Placed effect ability"]');
      return sel && Array.from(sel.options).some(o => o.textContent.includes('Frost Snare'));
    });
    await gmPanel.getByLabel('Placed effect domain').selectOption('trap');
    await gmPanel.getByLabel('Placed effect radius').selectOption('10');
    await gmPanel.getByRole('button', { name: 'Place on map' }).click();

    const catcher = gm.getByTestId('placed-effect-map-catcher');
    await catcher.waitFor({ timeout: 5000 });
    await catcher.click({ position: { x: 720, y: 500 } });

    const marker = gm.locator('[data-testid^="placed-marker-"]').first();
    await marker.waitFor({ timeout: 10000 });
    const markerTestId = await marker.getAttribute('data-testid');
    const placementId = markerTestId.replace('placed-marker-', '');
    await gm.screenshot({ path: path.join(out, '01-gm-placed-on-map.png') });

    // Owner sees placement; observer does NOT
    await owner.getByTestId(`placed-marker-${placementId}`).waitFor({ timeout: 10000 });
    await owner.getByTestId(`placed-hud-item-${placementId}`).waitFor({ timeout: 10000 });
    assert.equal(await observer.locator('[data-testid^="placed-marker-"]').count(), 0);
    assert.equal(await observer.getByTestId('placed-effect-panel').count(), 0);
    report.checks.visibilityScoped = true;

    // 4. Reload / reconnect recovery preserves exact marker and HUD entry
    step('Step 4: Reload GM & owner pages and verify placed marker recovery');
    await setup(gm, host.url, 'app-gm');
    await setup(owner, host.url, 'app-owner');
    await gm.getByTestId(`placed-marker-${placementId}`).waitFor({ timeout: 10000 });
    await gm.getByTestId(`placed-hud-item-${placementId}`).waitFor({ timeout: 10000 });
    await owner.getByTestId(`placed-marker-${placementId}`).waitFor({ timeout: 10000 });
    report.checks.recoveredAfterReconnect = true;

    // 5. GM removes placement from map overlay and verifies cleanup across reconnect
    step('Step 5: GM removes placed effect via map overlay control');
    await gm.getByTestId(`placed-remove-map-${placementId}`).click();
    await gm.getByTestId(`placed-marker-${placementId}`).waitFor({ state: 'detached', timeout: 10000 });
    await owner.getByTestId(`placed-marker-${placementId}`).waitFor({ state: 'detached', timeout: 10000 });
    assert.equal(host.room.gameState[placed.LEDGER_KEY].placements.length, 0);

    await setup(gm, host.url, 'app-gm');
    await gm.waitForTimeout(500);
    assert.equal(await gm.locator('[data-testid^="placed-marker-"]').count(), 0);

    assert.equal(report.errors.length, 0, JSON.stringify(report.errors));
    report.passed = true;
    save('report.json', report);
    console.log('Placed-effect browser witness passed cleanly.');
  } finally {
    await Promise.all(Object.values(contexts).map(c => c.close().catch(() => {})));
    await browser.close().catch(() => {});
    await host.stop();
  }
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    report.passed = false;
    report.failure = err.stack || err.message;
    save('report.json', report);
    console.error(err);
    process.exit(1);
  });
