// Full production App + CSS (no component re-mount or replacement bundle).
// Test setup uses the existing webpack exports to seed principals/stores and connect
// the registered backend fixture. Actual token/HUD/drop/cast/adjudication controls execute.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), crypto = require('crypto');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '../../../..'), base = path.join(__dirname, '../evidence/integration-20261015/sol');
const out = process.env.APP_OUTPUT || path.join(base, process.env.APP_RUN || 'app-replay'); fs.mkdirSync(out, { recursive: true });
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const save = (f, v) => fs.writeFileSync(path.join(out, f), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const evidence = { startedAt: new Date().toISOString(), command: process.argv, kind: 'production-App / optimized CRACO build',
  limits: ['Production App/router/components/styles and compiled library bodies execute intact. Test-only webpack runtime access seeds users, exact actors and room socket; identity/provider login is simulated.',
    'Real browser Socket.IO and registered backend stack execute; provider verification/canonical ownership/lease/cloud persistence are in-memory fixture boundaries.',
    'Third-party network requests are refused deliberately by this witness; no live Firebase/rules, human players, physical second device or deployment claim.'], errors: [], networkRefusals: [], witnesses: {} };
async function setup(page, url, uid, prejoinSpellHandlers = false) {
  page.on('pageerror', e => evidence.errors.push({ uid, message: e.message, stack: e.stack }));
  await page.route('**/*', route => { const u = new URL(route.request().url()); if (!/(googleapis\.com|firebaseio\.com|firebaseapp\.com)$/.test(u.hostname) || u.hostname === 'fonts.googleapis.com') return route.continue(); evidence.networkRefusals.push({ uid, origin: u.origin, resourceType: route.request().resourceType() }); return route.abort('blockedbyclient'); });
  await page.goto(url + '/game');
  await page.locator('.action-slot').first().waitFor({ timeout: 60000 });
  const consent = page.getByRole('dialog', { name: /Analytics.*Privacy Consent/ });
  if (await consent.count()) await consent.getByRole('button', { name: /Decline/i }).click();
  await page.addScriptTag({ url: url + '/integration-io.js' });
  return page.evaluate(async ({ uid, prejoinSpellHandlers }) => {
    const fixture = await fetch('/integration-fixture.json').then(r => r.json());
    const key = Object.keys(window).find(k => k.startsWith('webpackChunk')); window[key].push([[99119], {}, r => window.__req = r]);
    const moduleWith = text => { const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); if (!pair) throw Error('Missing compiled module ' + text); return __req(pair[0]); };
    window.__registry = moduleWith('registerStore:');
    window.S = name => __registry.getStore(name);
    window.__actors = moduleWith('acceptRecoveredActorSnapshot:');
    window.__spell = moduleWith('An unresolved spell approval is retained; check or withdraw it first.');
    window.__registerSpells = Object.values(__spell).find(f => typeof f === 'function' && f.toString().includes('actor_spell_pending') && f.toString().includes('socket:'));
    if (!__registerSpells) throw Error('Missing compiled spell registration');
    S('authStore').getState().setUser({ uid, displayName: uid, getIdToken: async() => uid });
    await new Promise(r => setTimeout(r, 1000));
    window.__socket = io(fixture.backendUrl, { transports: ['websocket'], forceNew: true, auth: { token: uid } });
    await new Promise((resolve, reject) => { __socket.once('connect', resolve); __socket.once('connect_error', reject); });
    if (prejoinSpellHandlers) {
      S('gameStore').setState({ isInMultiplayer: false, multiplayerRoom: null, multiplayerSocket: __socket });
      __registerSpells({ socket: __socket });
    }
    const joined = new Promise((resolve, reject) => { __socket.once('room_joined', resolve); __socket.once('room_error', e => reject(Error(JSON.stringify(e)))); });
    __socket.emit('join_room', { roomId: fixture.roomId, playerName: uid, password: '' }); await joined;
    window.__outbound = []; const emit = __socket.emit.bind(__socket); __socket.emit = (event, ...args) => { __outbound.push({ event, payload: args[0] }); return emit(event, ...args); };
    S('gameStore').setState({ isInMultiplayer: true, isGMMode: uid === 'app-gm', multiplayerRoom: { id: fixture.roomId }, multiplayerSocket: __socket,
      cameraX: 0, cameraY: 0, zoomLevel: 1, playerZoom: 1, dynamicFogEnabled: false, gridSize: 50, feetPerTile: 5 });
    S('mapStore').setState({ currentMapId: fixture.mapId });
    __actors.registerActorHandlers({ socket: __socket }); if (!prejoinSpellHandlers) __registerSpells({ socket: __socket });
    const result = await __actors.refreshActorSnapshot(); if (!result.success) throw Error(JSON.stringify(result));
    S('mapStore').setState({ currentMapId: fixture.mapId });
    if (uid === 'app-owner') {
      S('characterStore').setState({ currentCharacterId: 'ilse', id: 'ilse', name: 'Ilse', class: 'Arcanoneer', level: 3,
        stats: { strength: 10, agility: 10, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 },
        classResource: { type: 'elementalSpheres', spheres: ['arcane', 'arcane', 'ember'], current: 3, max: 12 } });
      const selected = __actors.selectOwnerAttachment(fixture.refs.pc); if (!selected.success) throw Error(JSON.stringify(selected));
    }
    return { fixture, modules: { actors: Object.keys(__actors), spell: Object.keys(__spell) }, creatureCount: S('creatureStore').getState().creatures.length };
  }, { uid, prejoinSpellHandlers });
}
async function main() {
  const host = await require('./app-server.cjs').start();
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const pages = [];
  try {
    const gm = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); pages.push(gm);
    evidence.setup = await setup(gm, host.url, 'app-gm');
    save('gm-setup.aria.yml', await gm.locator('body').ariaSnapshot());
    save('token-dom.json', await gm.locator('.creature-token').evaluateAll(nodes => nodes.map(n => ({ html: n.outerHTML.slice(0, 700), rect: n.getBoundingClientRect().toJSON() }))));
    // Full-App P8: actual fan -> raw controller -> one P7 receipt.
    await gm.locator('.creature-token').first().hover();
    await gm.getByAltText('Feather Slash', { exact: true }).first().click();
    const dialog = gm.getByRole('dialog', { name: 'Feather Slash adjudication' }); await dialog.waitFor();
    await gm.getByRole('combobox', { name: 'Feather Slash target' }).selectOption('creature:B');
    await gm.getByLabel('Physical d8 face 1').fill('3'); await gm.getByLabel('Physical d8 face 2').fill('5');
    await gm.getByRole('button', { name: 'Record physical faces', exact: true }).click();
    await gm.getByRole('checkbox', { name: /I adjudicate/ }).check();
    await gm.getByLabel('GM final damage', { exact: true }).fill('10'); await gm.getByLabel('Adjustment / ruling reason').fill('GM defense ruling');
    save('p8-prepared.aria.yml', await dialog.ariaSnapshot());
    await gm.getByRole('button', { name: 'Confirm adjudicated Feather Slash', exact: true }).click();
    await gm.getByRole('region', { name: 'Accepted Feather Slash result' }).first().waitFor();
    const hall = host.room.gameState.maps['app-hall'];
    assert.equal(hall.tokens.A.state.currentActionPoints, 1); assert.equal(hall.tokens.B.state.currentHp, 24); assert.equal(hall.tokens.B.state.tempHealth, 0);
    evidence.witnesses.P8 = { receipt: host.room.gameState.actorConsequences.receipts.at(-1), sourceAP: 1, targetHP: 24, targetTempHP: 0 };
    save('p8-accepted.aria.yml', await gm.locator('body').ariaSnapshot());
    await gm.getByRole('button', { name: 'Close Feather Slash', exact: true }).click();
    // Full-App P9 producer: synthesize only the external drag payload; the real HUD drop/click routes it.
    const owner = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); pages.push(owner); await setup(owner, host.url, 'app-owner');
    await owner.waitForTimeout(1500); // Let the character/room action-bar hydration settle before the external drop.
    save('slots-before.json', await owner.locator('.action-slot').evaluateAll(nodes => nodes.map(n => ({ html: n.outerHTML.slice(0, 500), parent: n.parentElement.className, props: Object.keys(n).filter(k => k.startsWith('__reactProps')).map(k => Object.keys(n[k])) }))));
    await owner.locator('.action-bar-assembly .action-slot').first().evaluate(el => { const data = new DataTransfer(); data.setData('application/json', JSON.stringify({ id: 'arc_spark_bolt', name: 'Marrow-Piercing Slug', icon: 'Arcane/Ebon Blaze', spellType: 'ACTION' }));
      // The incumbent app aliases DragEvent to MouseEvent; define the external payload explicitly.
      const event = new Event('drop', { bubbles: true, cancelable: true }); Object.defineProperty(event, 'dataTransfer', { value: data }); el.dispatchEvent(event); });
    await owner.locator('.action-bar-assembly .action-slot').first().getByAltText('Marrow-Piercing Slug', { exact: true }).waitFor();
    await owner.locator('.action-bar-assembly .action-slot').first().click();
    const ownerDialog = owner.getByRole('dialog', { name: 'Supported spell cast' }); await ownerDialog.waitFor();
    await owner.getByRole('combobox', { name: 'Target', exact: true }).selectOption('creature:app-hall:B');
    await owner.getByLabel('d8 face 1', { exact: true }).fill('6'); await owner.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    save('p9-owner-prepared.aria.yml', await ownerDialog.ariaSnapshot());
    const pools = c => [c.health, c.tempHealth, c.mana, c.tempMana, c.actionPoints, c.tempActionPoints];
    const before = JSON.stringify(pools(host.room.gameState.maps['app-hall'].characterTokens.pc.character));
    await owner.getByRole('button', { name: 'Approve price and send to GM' }).click();
    const card = gm.locator('.p9-gm-card').first(); await card.waitFor();
    assert.equal(JSON.stringify(pools(host.room.gameState.maps['app-hall'].characterTokens.pc.character)), before, 'approval never spends source pools');
    await gm.getByRole('combobox', { name: 'Exact room attachment' }).selectOption('character:pc');
    await card.getByRole('checkbox').check(); await card.getByLabel(/^Final/).fill('7'); await card.getByLabel(/^Reason/).fill('GM mitigation');
    const hit = await card.getByRole('button', { name: 'Accept one consequence' }).evaluate(el => { const r = el.getBoundingClientRect(), top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return { rect: r.toJSON(), hit: top === el || el.contains(top) }; });
    assert.equal(hit.hit, true, 'GM control must be pointer reachable in production CSS');
    save('p9-gm-prepared.aria.yml', await gm.locator('.actor-consequence-layer').ariaSnapshot());
    await card.getByRole('button', { name: 'Accept one consequence' }).click();
    await owner.getByText(/Accepted · /).first().waitFor();
    const installedHall = host.room.gameState.maps['app-hall'];
    assert.deepEqual([installedHall.characterTokens.pc.character.mana.current, installedHall.characterTokens.pc.character.tempMana, installedHall.characterTokens.pc.character.actionPoints.current, installedHall.characterTokens.pc.character.tempActionPoints], [9, 0, 2, 0]);
    assert.deepEqual(installedHall.characterTokens.pc.state.classPayment.value.spheres, ['ember']); assert.equal(installedHall.tokens.B.state.currentHp, 17);
    evidence.witnesses.P9 = { receipt: host.room.gameState.actorConsequences.receipts.at(-1), acceptHitTest: hit, source: installedHall.characterTokens.pc, target: installedHall.tokens.B };
    save('p9-gm-accepted.aria.yml', await gm.locator('.actor-consequence-layer').ariaSnapshot()); save('p9-owner-accepted.aria.yml', await ownerDialog.ariaSnapshot());
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }]) {
      await gm.setViewportSize(viewport);
      save(`layout-${viewport.width}.json`, await gm.locator('.actor-consequence-layer').evaluate(el => { const r = el.getBoundingClientRect(); return { rect: r.toJSON(), scrollHeight: el.scrollHeight, clientHeight: el.clientHeight, position: getComputedStyle(el).position, viewport: { width: innerWidth, height: innerHeight } }; }));
    }
    evidence.passed = true;
  } catch (e) {
    evidence.failure = e.stack;
    for (let i = 0; i < pages.length; i++) { save(`failure-page-${i}.aria.yml`, await pages[i].locator('body').ariaSnapshot().catch(() => 'unavailable')); await pages[i].screenshot({ path: path.join(out, `failure-page-${i}.png`) }).catch(() => {}); }
    throw e;
  } finally {
    evidence.endedAt = new Date().toISOString();
    const buildName = process.env.APP_BUILD || 'build-final';
    const buildDir = process.env.APP_BUILD_DIR || path.join(base, buildName, 'app');
    const manifest = fs.readFileSync(path.join(buildDir, 'asset-manifest.json')); evidence.build = buildDir; evidence.buildAssetManifestSha256 = sha(manifest);
    save('result.json', evidence); await browser.close(); await host.stop();
  }
}
exports.setup = setup;
if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
