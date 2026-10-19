// Frozen B2 §8.1 in the optimized production App. Only provider/room transport and fixture actors
// are seeded; production HUD drop, confirmation, AoE mount, token gates and helpers execute intact.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), crypto = require('crypto');
const { chromium } = require('playwright');
const out = process.env.B2_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR || out.startsWith(path.resolve(__dirname, '../..')))
  throw Error('B2_OUTPUT and APP_BUILD_DIR must identify external evidence/build directories.');
fs.mkdirSync(out, { recursive: true });
process.env.APP_OUTPUT = path.join(out, 'fixture'); // The retained fixture module must not default to Git.
const setup = require('../p9/integration/app-browser.cjs').setup;
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const result = { startedAt: new Date().toISOString(), checks: {}, errors: [], limits: [
  'Actual optimized App, production stores/components/helpers, real registered Socket.IO fixture.',
  'Provider login, canonical ownership, lease and cloud persistence simulated; no deployment/live Firebase/physical-device/human-table claim.',
  'External drag carries the actual compiled authored Radiant Burst; actor positions/visibility are fixture inputs.',
  'Hidden flag is seeded in each player projection, as in the retained P13A witness; this does not certify GM hide-control transport.',
  'The incumbent App disables the tactical grid at phone widths; narrow App verification uses the supported820px tablet layout.'
] };
const ack = (socket, event, payload) => new Promise(resolve => socket.emit(event, payload, resolve));
async function drop(page, index, malformed = false) {
  await page.locator('.action-bar-assembly .action-slot').nth(index).evaluate((el, malformed) => {
    const action = JSON.parse(JSON.stringify(__radiant));
    if (malformed) delete action.effectTargeting.damage.aoeParameters.radius;
    const data = new DataTransfer(); data.setData('application/json', JSON.stringify(action));
    const event = new Event('drop', { bubbles: true, cancelable: true }); Object.defineProperty(event, 'dataTransfer', { value: data }); el.dispatchEvent(event);
  }, malformed);
}
async function aim(page, x, y) {
  const screen = await page.evaluate(({ x, y }) => gridSystem.worldToScreen(x, y, innerWidth, innerHeight), { x, y });
  await page.mouse.move(screen.x, screen.y);
}
const panel = page => page.getByRole('region', { name: 'Radiant Burst area preview' });
const forbidden = events => events.filter(e => /actor_(?:consequence|propose|adjudicate|.*approve)|spell_cast|resource|cooldown|chat|notification/.test(e.event));
async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  const hall = host.room.gameState.maps['app-hall'];
  hall.tokens.A.position = { x: 425, y: 325 }; hall.tokens.B.position = { x: 525, y: 325 };
  hall.characterTokens.pc.position = { x: 625, y: 325 };
  const hidden = JSON.parse(JSON.stringify(hall.tokens.B));
  hidden.id = 'H'; hidden.position = { x: 575, y: 325 }; hidden.state.customName = 'B2_SECRET'; hidden.state.hiddenFromPlayers = true;
  delete hidden.state.actorContract; delete hidden.state.actorLifecycle;
  hall.tokens.H = hidden;
  const binding = await ack(host.seed, 'actor_bind', { roomId: host.room.id,
    ref: { kind: 'creature', roomId: host.room.id, mapId: 'app-hall', tokenId: 'H' },
    snapshotHash: require('../../../server/services/actorConsequences').hash(hidden) });
  assert.equal(binding.success, true, JSON.stringify(binding));
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, headless: true } : { channel: 'chrome', headless: true });
  const pages = {};
  try {
    for (const [role, uid] of [['owner', 'app-owner'], ['gm', 'app-gm'], ['observer', 'app-observer']]) {
      const page = pages[role] = await browser.newPage({ viewport: { width: 1440, height: 1000 }, hasTouch: role === 'owner' });
      page.on('pageerror', error => result.errors.push({ role, message: error.message }));
      await setup(page, host.url, uid);
    }
    // Same visibility-fixture boundary as the accepted P13A witness: seed the viewer projection.
    // General room actor snapshots do not certify GM hide-control transport in these fixtures.
    for (const role of ['owner', 'observer']) await pages[role].evaluate(() => S('creatureStore').setState(state => {
      const tokens = state.creatureTokens.map(t => t.id === 'H' ? { ...t, state: { ...t.state, hiddenFromPlayers: true } } : t);
      return { creatureTokens: tokens, tokens };
    }));
    const owner = pages.owner;
    await owner.evaluate(() => {
      const modules = Object.entries(__req.m).filter(([, fn]) => fn.toString().includes('martyr_radiant_burst'));
      const data = modules.flatMap(([id]) => Object.values(__req(id))).find(value => value?.spells?.some?.(s => s.id === 'martyr_radiant_burst'));
      if (!data) throw Error('Missing compiled original Martyr record');
      window.__radiant = data.spells.find(s => s.id === 'martyr_radiant_burst');
      const pair = Object.entries(__req.m).find(([, fn]) => fn.toString().includes('startActionPreview:'));
      window.__aoe = Object.values(__req(pair[0])).find(v => typeof v?.getState === 'function' && 'actionPreview' in v.getState());
      const feed = Object.entries(__req.m).find(([, fn]) => { const t = fn.toString(); return t.includes('absorbed') && t.includes('p12a-strike:v1/basic-weapon-strike'); });
      window.__feed = Object.values(__req(feed[0])).find(v => typeof v?.getState === 'function' && 'rendered' in v.getState());
      S('gameStore').setState({ gridType: 'square', gridSize: 50, feetPerTile: 5, gridOffsetX: 0, gridOffsetY: 0, cameraX: 600, cameraY: 300 });
      window.__b2Before = { character: JSON.stringify(S('characterStore').getState().health) + JSON.stringify(S('characterStore').getState().mana) + JSON.stringify(S('characterStore').getState().actionPoints),
        slots: JSON.stringify(S('gameStore').getState().activeCooldowns), authored: JSON.stringify(__radiant) };
    });
    await drop(owner, 0);
    await owner.locator('.action-bar-assembly .action-slot').first().getByAltText('Radiant Burst', { exact: true }).waitFor();
    await owner.locator('.action-bar-assembly .action-slot').first().click();
    await owner.getByRole('button', { name: 'Preview area', exact: true }).waitFor();
    await owner.evaluate(() => { window.__b2OutboundStart = __outbound.length; });
    const receiptsBefore = host.room.gameState.actorConsequences.receipts.length;
    await owner.getByRole('button', { name: 'Preview area', exact: true }).click();
    await owner.locator('.b2-catcher').waitFor();
    assert.equal(await owner.locator('.b2-catcher').evaluate(el => getComputedStyle(el).cursor), 'crosshair');
    await aim(owner, 531, 333);
    await panel(owner).getByText(/within 20-ft placement range/).waitFor();
    await owner.getByRole('note', { name: /^B: Geometric overlap only/ }).waitFor();
    assert.equal(await owner.getByRole('note', { name: /B2_SECRET/ }).count(), 0);
    assert.equal(await owner.locator('.b2-preview').evaluate(el => el.outerHTML.includes('B2_SECRET')), false);
    result.checks.geometry = await owner.evaluate(() => ({ origin: __aoe.getState().actionPreview.origin,
      shape: __aoe.getState().actionPreview.profile, range: document.querySelector('.b2-range').getAttribute('points'),
      area: document.querySelector('.b2-area').getAttribute('points'), markers: [...document.querySelectorAll('.b2-token-marker')].map(el => el.getAttribute('aria-label')) }));
    assert.deepEqual({ x: result.checks.geometry.origin.x, y: result.checks.geometry.origin.y }, { x: 531, y: 333 }, 'free point is not snapped');
    await panel(owner).locator('summary').click();
    await panel(owner).getByText(/damages undead and heals the living/).waitFor();
    save('preview-desktop.aria.yml', await panel(owner).ariaSnapshot());
    await owner.screenshot({ path: path.join(out, 'preview-desktop.png') });
    await aim(owner, 825.5, 325);
    await panel(owner).getByText(/outside 20-ft placement range/).waitFor();
    assert.equal(await owner.getByRole('button', { name: /Keep preview/ }).isDisabled(), true);
    await aim(owner, 531, 333);
    await owner.getByRole('button', { name: /Keep preview/ }).click();
    assert.equal(await owner.locator('.b2-catcher').count(), 0);
    assert.equal(await owner.getByRole('button', { name: 'Preview area', exact: true }).evaluate(el => el === document.activeElement), true, 'focus returns to entry');
    assert.equal(await owner.evaluate(() => {
      const { context, entry, onReturn, ...record } = __aoe.getState().actionPreview;
      return JSON.stringify(record).includes('B2_SECRET');
    }), false);
    // Exact original source/definition remain, but no captured member names are retained in the session.
    assert.equal(await owner.evaluate(() => 'keptEvidence' in __aoe.getState().actionPreview), false);
    await owner.evaluate(() => S('characterTokenStore').setState(state => ({ characterTokens: state.characterTokens.map(t =>
      t.id === 'pc' ? { ...t, position: { x: 630, y: 325 } } : t) })));
    await panel(owner).getByText(/Changed since confirmation/).waitFor();
    await owner.evaluate(() => S('characterTokenStore').setState(state => ({ characterTokens: state.characterTokens.map(t =>
      t.id === 'pc' ? { ...t, position: { x: 625, y: 325 } } : t) })));
    assert.equal(await owner.evaluate(() => __aoe.getState().actionPreview.confirmed), false, 'movement round-trip does not revive confirmation');
    await owner.getByRole('combobox', { name: 'Preview effect channel' }).selectOption('healing');
    assert.equal(await owner.evaluate(() => __aoe.getState().actionPreview), null);
    await owner.getByRole('button', { name: 'Preview area', exact: true }).click();
    await owner.locator('.b2-catcher').waitFor(); await aim(owner, 525, 325);
    await panel(owner).getByText(/^Radiant Burst · healing channel/).waitFor();
    // Hide through the current client projection: the production token gate removes all marker/ARIA output.
    await owner.evaluate(() => S('creatureStore').setState(state => {
      const tokens = state.creatureTokens.map(t => t.id === 'B' ? { ...t, state: { ...t.state, hiddenFromPlayers: true } } : t);
      return { creatureTokens: tokens, tokens };
    }));
    await owner.getByRole('note', { name: /^B: / }).waitFor({ state: 'detached' });
    result.checks.hidden = { noMarker: true, noOverlayName: !(await owner.locator('.b2-preview').evaluate(el => /B2_SECRET/.test(el.outerHTML))) };
    for (const role of ['gm', 'observer']) assert.equal(await pages[role].locator('.b2-preview, .b2-token-marker').count(), 0, 'preview is local only');
    await owner.keyboard.press('Escape');
    assert.equal(await owner.locator('.b2-catcher').count(), 0);
    assert.equal(await owner.getByText('Return to the realm gate', { exact: false }).count(), 0);
    result.checks.cancel = true;
    await owner.getByRole('button', { name: 'Preview area', exact: true }).click();
    await owner.locator('.b2-catcher').waitFor();
    await owner.locator('.b2-catcher').click({ button: 'right', position: { x: 700, y: 500 } });
    assert.equal(await owner.locator('.b2-catcher').count(), 0);
    // Keyboard placement and narrow production CSS are exercised together.
    await owner.setViewportSize({ width: 820, height: 700 });
    await owner.getByRole('button', { name: 'Preview area', exact: true }).click();
    await owner.getByRole('application').press('ArrowLeft');
    const touchPoint = await owner.evaluate(() => gridSystem.worldToScreen(700, 450, innerWidth, innerHeight));
    await owner.touchscreen.tap(touchPoint.x, touchPoint.y);
    const touchOrigin = await owner.evaluate(() => __aoe.getState().actionPreview.origin);
    assert.deepEqual({ x: touchOrigin.x, y: touchOrigin.y }, { x: 700, y: 450 });
    result.checks.touch = { x: touchOrigin.x, y: touchOrigin.y };
    result.checks.narrow = await panel(owner).evaluate(el => ({ rect: el.getBoundingClientRect().toJSON(), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth }));
    assert.ok(result.checks.narrow.rect.x >= 0 && result.checks.narrow.rect.right <= 820);
    assert.equal(result.checks.narrow.scrollWidth, result.checks.narrow.clientWidth);
    save('narrow.aria.yml', await panel(owner).ariaSnapshot());
    await owner.screenshot({ path: path.join(out, 'narrow.png') });
    await owner.getByRole('button', { name: 'Cancel area preview' }).click();
    await owner.setViewportSize({ width: 1440, height: 1000 });
    await owner.getByRole('button', { name: 'Cancel', exact: true }).click();
    await drop(owner, 1, true);
    await owner.locator('.action-bar-assembly .action-slot').nth(1).click();
    await owner.getByRole('button', { name: 'Preview area', exact: true }).click();
    await owner.getByRole('alert').getByText(/missing or malformed/).waitFor();
    assert.equal(await owner.locator('.b2-preview').count(), 0);
    result.checks.manualFallback = true;
    const after = await owner.evaluate(() => ({ outbound: __outbound.slice(__b2OutboundStart),
      unchangedResources: __b2Before.character === JSON.stringify(S('characterStore').getState().health) + JSON.stringify(S('characterStore').getState().mana) + JSON.stringify(S('characterStore').getState().actionPoints),
      unchangedAuthored: __b2Before.authored === JSON.stringify(__radiant) }));
    assert.deepEqual(forbidden(after.outbound), []); assert.equal(after.unchangedResources, true); assert.equal(after.unchangedAuthored, true);
    assert.equal(host.room.gameState.actorConsequences.receipts.length, receiptsBefore);
    result.checks.noSideEffects = after;
    save('desktop.aria.yml', await owner.locator('body').ariaSnapshot());
    await owner.screenshot({ path: path.join(out, 'desktop.png') });
    result.passed = true;
  } catch (error) {
    result.failure = error.stack;
    for (const [role, page] of Object.entries(pages)) { save(`${role}-failure.aria.yml`, await page.locator('body').ariaSnapshot().catch(() => 'unavailable')); }
    throw error;
  } finally {
    result.endedAt = new Date().toISOString();
    result.assetManifestSha256 = crypto.createHash('sha256').update(fs.readFileSync(path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json'))).digest('hex');
    save('result.json', result); await browser.close(); await host.stop();
  }
}
main().then(() => process.exit(0), error => { console.error(error); process.exit(1); });
