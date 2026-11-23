// Minstrel P9 normal-App witness: empty note bank -> Opening Chord (+I×2, +V×1) ->
// Resolving Strike (-I×1, -V×1) -> Reconnect preserves I×1, plus Wizard & Saved Card checks
// (exact terms without duplicate labels, edited copy stays manual).
const fs = require('fs');
const path = require('path');
const http = require('http');
const assert = require('assert/strict');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '../../..');
require('../p7/preload.cjs');
const { createProductionStackServer } = require(path.join(root, 'server/tests/helpers/productionStackServer'));
const actors = require(path.join(root, 'server/services/actorConsequences'));

const out = process.env.MINSTREL_APP_OUTPUT;
const build = process.env.APP_BUILD_DIR;
assert.ok(out && path.isAbsolute(out), 'Absolute MINSTREL_APP_OUTPUT required');
assert.ok(build && path.isAbsolute(build), 'Absolute APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true });

const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const clone = v => JSON.parse(JSON.stringify(v));
const ack = (s, e, p) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(Error('ACK timeout ' + e)), 10000);
  s.emit(e, p, r => { clearTimeout(t); resolve(r); });
});

const report = {
  checks: {},
  errors: [],
  limits: [
    'Normal production App and registered handlers; auth/provider/ownership/lease/cloud and player identity are fixtures.',
    'The Minstrel PC and class resources are fixture state; no live Firebase or second physical device.'
  ]
};

const MINSTREL_CHAR = {
  id: 'wren',
  name: 'Wren',
  class: 'Minstrel',
  level: 3,
  race: 'Human',
  subrace: 'Skald',
  background: 'Entertainer',
  stats: { strength: 10, agility: 12, constitution: 10, intelligence: 10, spirit: 14, charisma: 14 },
  health: { current: 24, max: 24 },
  mana: { current: 20, max: 20 },
  actionPoints: { current: 4, max: 4 },
  tempHealth: 0,
  tempMana: 0,
  tempActionPoints: 0,
  equipment: {},
  equippedItems: {},
  inventory: [],
  class_spells: { known_spells: ['minstrel_opening_chord', 'minstrel_resolving_strike'] },
  classResource: { type: 'musicalNotes', notes: [0, 0, 0, 0, 0, 0, 0], current: 0, max: 35, maxPerNote: 5, totalNotes: 7 }
};

async function startHost() {
  const backend = createProductionStackServer({ characterOwners: { wren: 'app-owner' } });
  await backend.start();
  for (const uid of ['app-gm', 'app-owner']) backend.registerAuthToken(uid, uid);
  for (const event of ['actor_snapshot', 'actor_consequence', 'actor_spell_approve', 'actor_spell_list', 'actor_recovery', 'join_room']) {
    backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  }
  const seed = backend.connect({ token: 'app-gm' });
  await new Promise(r => seed.once('connect', r));
  const room = await backend.seedRoom(seed.id, { gmUserId: 'app-gm' });
  const mapId = 'app-hall';
  const creature = JSON.parse(fs.readFileSync(path.join(root, 'vtt-react/public/data/creatures.json'))).find(c => c.id === 'grimmstalk');
  room.gameState.maps[mapId] = { ...clone(room.gameState.maps.default), id: mapId, name: 'Integration Hall', tokens: {}, creatures: {}, characterTokens: {} };
  room.gameState.defaultMapId = mapId;
  const hall = room.gameState.maps[mapId];
  hall.tokens.B = {
    id: 'B',
    creatureId: 'grimmstalk',
    name: 'B',
    mapId,
    stats: clone(creature.stats),
    position: { x: 500, y: 300 },
    state: { customName: 'B', currentHp: 40, tempHealth: 0, currentMana: 0, tempMana: 0, currentActionPoints: 2, tempActionPoints: 0, maxHp: 250, maxMana: 30, maxAP: 5, conditions: [] }
  };
  hall.characterTokens.pc = {
    id: 'pc',
    mapId,
    ownerUserId: 'app-owner',
    position: { x: 600, y: 300 },
    character: clone(MINSTREL_CHAR),
    state: { conditions: [] }
  };

  const refs = {};
  for (const [kind, id] of [['creature', 'B'], ['character', 'pc']]) {
    const token = hall[kind === 'creature' ? 'tokens' : 'characterTokens'][id];
    const result = await ack(seed, 'actor_bind', {
      roomId: room.id,
      ref: { kind, roomId: room.id, mapId, tokenId: id, ...(kind === 'character' ? { ownerUid: 'app-owner', characterId: 'wren' } : {}) },
      snapshotHash: actors.hash(token)
    });
    assert.equal(result.success, true, JSON.stringify(result));
    refs[id] = result.ref;
  }

  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
  const server = http.createServer((req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/integration-fixture.json') { res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ backendUrl: backend.url(), roomId: room.id, mapId, refs })); }
    if (url.pathname === '/integration-io.js') { res.setHeader('Content-Type', 'text/javascript'); return res.end(fs.readFileSync(path.join(root, 'vtt-react/node_modules/socket.io-client/dist/socket.io.js'))); }
    let file = path.resolve(build, '.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(build + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(build, 'index.html');
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  });
  const port = Number(process.env.MINSTREL_APP_PORT || 4185);
  await new Promise(r => server.listen(port, '127.0.0.1', r));
  return {
    backend,
    server,
    room,
    refs,
    url: `http://127.0.0.1:${port}`,
    stop: async () => { seed.disconnect(); await new Promise(r => server.close(r)); await backend.stop(); }
  };
}

async function setup(page, url, uid) {
  page.on('pageerror', e => report.errors.push({ uid, message: e.message, stack: e.stack }));
  page.on('console', message => { if (message.type() === 'error') report.errors.push({ uid, console: message.text() }); });
  await page.goto(url + '/game');
  await page.locator('.action-slot').first().waitFor({ timeout: 60000 });
  const consent = page.getByRole('dialog', { name: /Analytics.*Privacy Consent/ });
  await consent.waitFor({ timeout: 5000 }).catch(() => {});
  if (await consent.count()) await consent.getByRole('button', { name: /Decline/i }).click();
  await page.waitForFunction(() => Object.keys(window).some(k => k.startsWith('webpackChunk')), null, { timeout: 60000 });
  await page.addScriptTag({ url: url + '/integration-io.js' });
  return page.evaluate(async ({ uid, fixtureChar }) => {
    const fixture = await fetch('/integration-fixture.json').then(r => r.json());
    const key = Object.keys(window).find(k => k.startsWith('webpackChunk'));
    window[key].push([[99120], {}, r => window.__req = r]);
    const moduleWith = text => { const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); if (!pair) throw Error('Missing compiled module ' + text); return __req(pair[0]); };
    window.__registry = moduleWith('registerStore:');
    window.S = name => __registry.getStore(name);
    window.__actors = moduleWith('acceptRecoveredActorSnapshot:');
    window.__spell = moduleWith('An unresolved spell approval is retained; check or withdraw it first.');
    window.__registerSpells = Object.values(__spell).find(f => typeof f === 'function' && f.toString().includes('actor_spell_pending') && f.toString().includes('socket:'));
    for (let i = 0; i < 100 && !S('authStore').getState().isAuthInitialized; i++) await new Promise(r => setTimeout(r, 100));
    S('authStore').getState().setUser({ uid, displayName: uid, getIdToken: async () => uid });
    await new Promise(r => setTimeout(r, 800));
    window.__socket = io(fixture.backendUrl, { transports: ['websocket'], forceNew: true, auth: { token: uid } });
    await new Promise((resolve, reject) => { __socket.once('connect', resolve); __socket.once('connect_error', reject); });
    S('gameStore').setState({ isInMultiplayer: false, multiplayerRoom: null, multiplayerSocket: __socket });
    __registerSpells({ socket: __socket });
    const joined = new Promise((resolve, reject) => { __socket.once('room_joined', resolve); __socket.once('room_error', e => reject(Error(JSON.stringify(e)))); });
    __socket.emit('join_room', { roomId: fixture.roomId, playerName: uid, password: '' });
    await joined;
    S('gameStore').setState({ isInMultiplayer: true, isGMMode: uid === 'app-gm', multiplayerRoom: { id: fixture.roomId }, multiplayerSocket: __socket,
      cameraX: 0, cameraY: 0, zoomLevel: 1, playerZoom: 1, dynamicFogEnabled: false, gridSize: 50, feetPerTile: 5 });
    S('mapStore').setState({ currentMapId: fixture.mapId });
    __actors.registerActorHandlers({ socket: __socket });
    const result = await __actors.refreshActorSnapshot();
    assertOk(result.success, 'refreshActorSnapshot failed');
    function assertOk(ok, msg) { if (!ok) throw Error(msg); }

    const store = S('characterStore');
    for (let w = 0; w < 15000 && !(store.getState().currentCharacterId && !store.getState().isLoading); w += 100) await new Promise(r => setTimeout(r, 100));
    store.setState({ characters: [JSON.parse(JSON.stringify(fixtureChar))] });
    S('gameStore').setState({ isInMultiplayer: false });
    store.getState().loadCharacter(fixtureChar.id);
    S('gameStore').setState({ isInMultiplayer: true });
    store.getState().syncWithMultiplayer();
    if (uid === 'app-owner') {
      const selected = __actors.selectOwnerAttachment(fixture.refs.pc);
      if (!selected.success) throw Error(JSON.stringify(selected));
    }
    return { fixture, notes: store.getState().classResource?.notes };
  }, { uid, fixtureChar: MINSTREL_CHAR });
}

const book = page => page.getByRole('dialog', { name: 'Spellbook', exact: true });
async function openBook(page) {
  await page.locator('.wow-nav-category-header').filter({ hasText: /^Character/ }).first().click();
  await page.locator('.wow-nav-flyout').getByRole('button', { name: /^Spellbook/ }).click();
  await book(page).waitFor();
  await book(page).getByRole('button', { name: 'Spell Library', exact: true }).click();
  await page.waitForTimeout(1000);
}
async function closeBook(page) {
  const close = book(page).getByRole('button', { name: 'Close', exact: true });
  if (await close.count()) await close.first().click();
  else await page.keyboard.press('Escape');
}

async function main() {
  const host = await startHost();
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const pages = [];
  try {
    const gm = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    pages.push(gm);
    await setup(gm, host.url, 'app-gm');

    const owner = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    pages.push(owner);
    const ownerSetup = await setup(owner, host.url, 'app-owner');
    assert.deepEqual(ownerSetup.notes, [0, 0, 0, 0, 0, 0, 0]);
    report.checks.initialEmptyBank = ownerSetup.notes;

    // 1. Saved cards + Wizard checks (exact terms, no duplicate labels, edited copy stays manual)
    await openBook(owner);
    const openCard = book(owner).getByRole('button', { name: 'Opening Chord details', exact: true }).first();
    await openCard.waitFor({ timeout: 10000 });
    await openCard.click();
    const openOverlay = owner.locator('.spell-detail-overlay').last();
    await openOverlay.waitFor({ timeout: 10000 });
    const openText = await openOverlay.textContent();
    assert.match(openText, /Prism-supported/);
    assert.match(openText, /\+3 Musical Notes \(I×2, V×1\)/);
    assert.doesNotMatch(openText, /\+3 Musical Notes(?! \(I×2, V×1\))/);
    report.checks.savedCardOpeningChord = true;
    await openOverlay.getByRole('button', { name: 'Close', exact: true }).last().click();

    // Drag Opening Chord to slot 1 and Resolving Strike to slot 2
    await openCard.dragTo(owner.locator('.action-bar-assembly .action-slot').nth(0));
    const resCard = book(owner).getByRole('button', { name: 'Resolving Strike details', exact: true }).first();
    await resCard.waitFor({ timeout: 10000 });
    await resCard.click();
    const resOverlay = owner.locator('.spell-detail-overlay').last();
    await resOverlay.waitFor({ timeout: 10000 });
    const resText = await resOverlay.textContent();
    assert.match(resText, /Prism-supported/);
    assert.match(resText, /2 Musical Notes \(I×1, V×1\)/);
    assert.doesNotMatch(resText, /3 Musical Notes/);
    report.checks.savedCardResolvingStrike = true;
    await resOverlay.getByRole('button', { name: 'Close', exact: true }).last().click();
    await resCard.dragTo(owner.locator('.action-bar-assembly .action-slot').nth(1));

    // Check edited copy in Wizard stays manual (UNSUPPORTED)
    const editedCheck = await owner.evaluate(() => {
      const m = Object.entries(__req.m).find(([, f]) => f.toString().includes('This reviewed Minstrel pair runs through Prism P9'));
      const mod = __req(m[0]);
      const explain = Object.values(mod).find(v => typeof v === 'function' && v.toString().includes('This reviewed Minstrel pair runs through Prism P9'));
      const dataMod = Object.entries(__req.m).find(([, f]) => f.toString().includes('minstrel_opening_chord') && f.toString().includes('minstrel_resolving_strike') && f.toString().includes('Opening Chord'));
      const minstrel = Object.values(__req(dataMod[0])).find(v => v && Array.isArray(v.spells) && v.spells.some(s => s.id === 'minstrel_resolving_strike'));
      const res = minstrel.spells.find(s => s.id === 'minstrel_resolving_strike');
      const edited = { ...res, musicalCombo: { ...res.musicalCombo, requires: [{ note: 'I', count: 2 }] } };
      return {
        shipped: explain(res, { classId: 'minstrel', shared: true, gm: false }).state,
        edited: explain(edited, { classId: 'minstrel', shared: true, gm: false }).state
      };
    });
    assert.equal(editedCheck.shipped, 'executable');
    assert.equal(editedCheck.edited, 'unsupported');
    report.checks.wizardEditedCopyManual = editedCheck;
    await closeBook(owner);

    // 2. Refused Resolving Strike on empty bank
    await owner.locator('.action-bar-assembly .action-slot.filled').nth(1).click();
    const resDialogEmpty = owner.getByRole('dialog', { name: 'Supported spell cast', exact: true });
    await resDialogEmpty.waitFor();
    await resDialogEmpty.getByText(/Requires Musical Notes \(I, V\)/).first().waitFor({ timeout: 5000 });
    assert.equal(await resDialogEmpty.getByRole('button', { name: 'Approve price and send to GM', exact: true }).isDisabled(), true);
    await resDialogEmpty.getByRole('button', { name: 'Close', exact: true }).click();
    report.checks.refusedWhenEmpty = true;

    // 3. Cast Opening Chord -> adds I×2, V×1
    await owner.locator('.action-bar-assembly .action-slot.filled').nth(0).click();
    const openDialog = owner.getByRole('dialog', { name: 'Supported spell cast', exact: true });
    await openDialog.waitFor();
    const selectTarget = async (dialog) => {
      const combo = dialog.getByRole('combobox');
      const val = await combo.locator('option').evaluateAll(opts => {
        const match = opts.find(o => o.value && (o.value.includes('"tokenId":"B"') || o.value.includes(':B') || o.textContent.includes('B')));
        return match ? match.value : '';
      });
      if (!val) throw Error('Target B option not found');
      await combo.selectOption(val);
    };
    await selectTarget(openDialog);
    await openDialog.getByLabel('d6 face 1', { exact: true }).fill('4');
    await openDialog.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    await openDialog.getByRole('button', { name: 'Approve price and send to GM', exact: true }).click();
    await openDialog.getByText(/Awaiting GM adjudication/).waitFor();

    const gmOpenCard = gm.locator('.p9-gm-card').filter({ hasText: 'Opening Chord' });
    await gmOpenCard.waitFor({ timeout: 10000 });
    await gmOpenCard.getByRole('checkbox').check();
    await gmOpenCard.getByLabel('Final damage', { exact: true }).fill('4');
    await gmOpenCard.getByRole('button', { name: 'Accept one consequence', exact: true }).click();
    await openDialog.getByText(/Accepted and paid/).waitFor({ timeout: 10000 });
    await openDialog.getByRole('button', { name: 'Close', exact: true }).click();

    const afterOpenNotes = await owner.evaluate(() => window.S('characterStore').getState().classResource?.notes);
    assert.deepEqual(afterOpenNotes, [2, 0, 0, 0, 1, 0, 0]);
    report.checks.afterOpeningChordNotes = afterOpenNotes;

    // 4. Cast Resolving Strike -> consumes I×1, V×1 -> leaves I×1
    await owner.locator('.action-bar-assembly .action-slot.filled').nth(1).click();
    const resDialog = owner.getByRole('dialog', { name: 'Supported spell cast', exact: true });
    await resDialog.waitFor();
    await selectTarget(resDialog);
    await resDialog.getByLabel('d8 face 1', { exact: true }).fill('5');
    await resDialog.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    await resDialog.getByRole('button', { name: 'Approve price and send to GM', exact: true }).click();
    await resDialog.getByText(/Awaiting GM adjudication/).waitFor();

    const gmResCard = gm.locator('.p9-gm-card').filter({ hasText: 'Resolving Strike' });
    await gmResCard.waitFor({ timeout: 10000 });
    await gmResCard.getByRole('checkbox').check();
    await gmResCard.getByLabel('Final damage', { exact: true }).fill('19');
    await gmResCard.getByRole('button', { name: 'Accept one consequence', exact: true }).click();
    await resDialog.getByText(/Accepted and paid/).waitFor({ timeout: 10000 });
    await resDialog.getByRole('button', { name: 'Close', exact: true }).click();

    const afterResolveNotes = await owner.evaluate(() => window.S('characterStore').getState().classResource?.notes);
    assert.deepEqual(afterResolveNotes, [1, 0, 0, 0, 0, 0, 0]);
    report.checks.afterResolvingStrikeNotes = afterResolveNotes;

    // 5. Reconnect leaves I×1 ([1, 0, 0, 0, 0, 0, 0])
    const reconnectedNotes = await owner.evaluate(async () => {
      const fixture = await fetch('/integration-fixture.json').then(r => r.json());
      window.__socket.disconnect();
      window.__socket.connect();
      await new Promise((resolve, reject) => { __socket.once('connect', resolve); __socket.once('connect_error', reject); });
      const rejoined = new Promise((resolve, reject) => { __socket.once('room_joined', resolve); __socket.once('room_error', e => reject(Error(JSON.stringify(e)))); });
      __socket.emit('join_room', { roomId: fixture.roomId, playerName: 'app-owner', password: '' });
      await rejoined;
      const rec = await new Promise(resolve => __socket.emit('actor_recovery', { roomId: fixture.roomId, ref: fixture.refs.pc }, resolve));
      return rec?.recovery?.rawToken?.state?.classPayment?.value?.notes || null;
    });
    assert.deepEqual(reconnectedNotes, [1, 0, 0, 0, 0, 0, 0]);
    report.checks.reconnectedNotes = reconnectedNotes;
    report.passed = true;
  } finally {
    save('result.json', report);
    await Promise.allSettled(pages.map(p => p.close()));
    await browser.close();
    await host.stop();
  }
}

main().catch(e => {
  report.passed = false;
  report.fatal = e.stack || e.message;
  save('result.json', report);
  console.error(e);
  process.exit(1);
});
