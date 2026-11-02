// M4B normal-App witness: class card prepare/save/admit, class-card cast, owner roll,
// target-owner healing acceptance, GM confirmation. Auth/provider/lease/cloud are fixtures.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.M4B_APP_OUTPUT;
assert.ok(out && path.isAbsolute(out) && process.env.APP_BUILD_DIR);
fs.mkdirSync(out, { recursive: true });
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const report = { checks: {}, errors: [], limits: [
  'Normal production App and registered handlers; auth/provider/ownership/lease/cloud and player identity are fixtures.',
  'The source/target PCs and class resources are fixture state; no live Firebase or second physical device.'
] };

async function setup(page, url, uid) {
  page.on('pageerror', e => report.errors.push({ uid, message: e.message }));
  await page.goto(url + '/');
  const consent = page.getByRole('dialog', { name: /Analytics.*Privacy Consent/ });
  if (await consent.count()) await consent.getByRole('button', { name: /Decline/i }).click();
  await page.waitForFunction(() => Object.keys(window).some(k => k.startsWith('webpackChunk')), null, { timeout: 60000 });
  await page.addScriptTag({ url: url + '/integration-io.js' });
  return page.evaluate(async ({ uid }) => {
    const fixture = await fetch('/integration-fixture.json').then(r => r.json());
    const key = Object.keys(window).find(k => k.startsWith('webpackChunk')); window[key].push([[99119], {}, r => window.__req = r]);
    const moduleWith = text => { const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); if (!pair) throw Error('Missing compiled module ' + text); return __req(pair[0]); };
    window.__registry = moduleWith('registerStore:'); window.S = name => __registry.getStore(name);
    window.__actors = moduleWith('acceptRecoveredActorSnapshot:');
    window.__spell = moduleWith('An unresolved spell approval is retained; check or withdraw it first.');
    window.__registerSpells = Object.values(__spell).find(f => typeof f === 'function' && f.toString().includes('actor_spell_pending') && f.toString().includes('socket:'));
    if (!__registerSpells) throw Error('Missing compiled spell registration');
    for (let i = 0; i < 100 && !S('authStore').getState().isAuthInitialized; i++) await new Promise(r => setTimeout(r, 100));
    S('authStore').getState().setUser({ uid, displayName: uid, getIdToken: async() => uid });
    await new Promise(r => setTimeout(r, 1000));
    window.__socket = io(fixture.backendUrl, { transports: ['websocket'], forceNew: true, auth: { token: uid } });
    await new Promise((resolve, reject) => { __socket.once('connect', resolve); __socket.once('connect_error', reject); });
    S('gameStore').setState({ isInMultiplayer: false, multiplayerRoom: null, multiplayerSocket: __socket });
    __registerSpells({ socket: __socket });
    const joined = new Promise((resolve, reject) => { __socket.once('room_joined', resolve); __socket.once('room_error', e => reject(Error(JSON.stringify(e)))); });
    __socket.emit('join_room', { roomId: fixture.roomId, playerName: uid, password: '' }); await joined;
    window.__outbound = []; const emit = __socket.emit.bind(__socket); __socket.emit = (event, ...args) => { window.__outbound.push({ event, payload: args[0] }); return emit(event, ...args); };
    S('gameStore').setState({ isInMultiplayer: true, isGMMode: uid === 'app-gm', multiplayerRoom: { id: fixture.roomId }, multiplayerSocket: __socket,
      cameraX: 0, cameraY: 0, zoomLevel: 1, playerZoom: 1, dynamicFogEnabled: false, gridSize: 50, feetPerTile: 5 });
    S('mapStore').setState({ currentMapId: fixture.mapId });
    __actors.registerActorHandlers({ socket: __socket });
    const result = await __actors.refreshActorSnapshot(); if (!result.success) throw Error(JSON.stringify(result));
    const known = { class_spells: { known_spells: ['martyr_restorative_prayer'] } };
    if (uid === 'app-gm') S('characterStore').setState({ characters: [{ id: 'gm', name: 'GM', class: 'Martyr', level: 1, class_spells: { known_spells: ['martyr_restorative_prayer'] } }], currentCharacterId: 'gm', id: 'gm', name: 'GM', class: 'Martyr', level: 1, stats: { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 18, charisma: 10 }, classResource: { type: 'devotion', current: 0, max: 6, damage: 0, earnedLevels: 0, spentLevels: 0, bonusLevels: 0 }, ...known });
    if (uid === 'app-owner') {
      S('characterStore').setState({ characters: [{ id: 'ilse', name: 'Ilse', class: 'Martyr', level: 1, class_spells: { known_spells: ['martyr_restorative_prayer'] } }], currentCharacterId: 'ilse', id: 'ilse', name: 'Ilse', class: 'Martyr', level: 1, stats: { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 18, charisma: 10 }, classResource: { type: 'devotion', current: 0, max: 6, damage: 0, earnedLevels: 0, spentLevels: 0, bonusLevels: 0 }, ...known });
      const selected = __actors.selectOwnerAttachment(fixture.refs.pc); if (!selected.success) throw Error(JSON.stringify(selected));
    }
    if (uid === 'app-target') {
      S('characterStore').setState({ characters: [{ id: 'ally', name: 'Ally', class: 'Arcanoneer', level: 3 }], currentCharacterId: 'ally', id: 'ally', name: 'Ally', class: 'Arcanoneer', level: 3, stats: { strength: 10, agility: 10, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 }, health: { current: 20, max: 30 }, tempHealth: 3 });
      const selected = __actors.selectOwnerAttachment(fixture.refs.ally); if (!selected.success) throw Error(JSON.stringify(selected));
    }
    return { fixture, classes: Object.keys(window.S('characterStore').getState()) };
  }, { uid }).then(async result => {
    await page.evaluate(() => { history.pushState({}, '', '/game'); window.dispatchEvent(new PopStateEvent('popstate')); });
    await page.locator('.action-slot').first().waitFor({ timeout: 30000 });
    return result;
  });
}

const book = page => page.getByRole('dialog', { name: 'Spellbook', exact: true });
async function openBook(page) {
  await page.getByRole('button', { name: /^Character(?: \(\d+\))?$/ }).click();
  await page.getByRole('button', { name: /^Spellbook(?: S)?$/ }).click();
  await book(page).waitFor();
  await book(page).getByRole('button', { name: 'Spell Library', exact: true }).click();
  await page.waitForTimeout(1500);
}
async function closeBook(page) {
  const close = book(page).getByRole('button', { name: 'Close', exact: true });
  if (await close.count()) await close.first().click();
  else await page.keyboard.press('Escape');
}
async function clickClassSpell(page, name) {
  for (let i = 0; i < 4; i++) {
    const card = book(page).getByRole('button', { name: `${name} details`, exact: true });
    if (await card.count()) { const first = card.first(); await first.focus(); await first.press('Enter'); return; }
    const text = book(page).getByText(name, { exact: true });
    if (await text.count()) return text.first().click();
    const next = book(page).getByRole('button', { name: 'Next Page', exact: true });
    if (!(await next.count()) || await next.isDisabled()) break;
    await next.click();
  }
  throw Error(`Catalogue class card not found: ${name}`);
}
async function clickSavedSpell(page, name) {
  for (let i = 0; i < 4; i++) {
    const card = book(page).getByRole('button', { name: `${name} details`, exact: true });
    if (await card.count()) return card.last().click();
    const text = book(page).getByText(name, { exact: true });
    if (await text.count()) return text.last().click();
    const next = book(page).getByRole('button', { name: 'Next Page', exact: true });
    if (!(await next.count()) || await next.isDisabled()) break;
    await next.click();
  }
  throw Error(`Saved catalogue spell not found: ${name}`);
}

async function main() {
  const host = await require('./m4b-catalogue-app-server.cjs').start();
  for (const event of ['actor_snapshot', 'actor_consequence', 'actor_spell_approve', 'actor_spell_list', 'actor_authored_admit', 'actor_authored_list', 'actor_spell_target_respond', 'join_room']) host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const pages = [];
  try {
    const gm = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); pages.push(gm);
    report.setup = await setup(gm, host.url, 'app-gm'); host.setPlayerCharacter('app-gm', { id: 'gm', class: 'Martyr' });
    await openBook(gm);
    await clickClassSpell(gm, 'Restorative Prayer');
    await gm.getByRole('button', { name: 'Prepare this catalogue ability in the Wizard', exact: true }).click();
    await gm.getByRole('button', { name: 'Finalize', exact: true }).click();
    await gm.waitForTimeout(750);
    await closeBook(gm);
    await openBook(gm);
    await book(gm).getByRole('button', { name: 'Spell Library', exact: true }).click();
    await clickSavedSpell(gm, 'Restorative Prayer');
    const admission = gm.getByRole('region', { name: 'Room admission for Restorative Prayer', exact: true });
    await admission.waitFor();
    await admission.getByRole('button', { name: 'Admit this saved version', exact: true }).click();
    await admission.getByText(/Admitted for immediate damage\/healing/).waitFor({ timeout: 10000 });
    report.checks.catalogueAdmitted = true;
    save('catalogue-admission.aria.yml', await admission.ariaSnapshot());
    await closeBook(gm);

    const owner = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); pages.push(owner);
    await setup(owner, host.url, 'app-owner'); host.setPlayerCharacter('app-owner', { id: 'ilse', class: 'Martyr' });
    await openBook(owner);
    await clickClassSpell(owner, 'Restorative Prayer');
    await owner.getByRole('button', { name: 'Place on Action Bar', exact: true }).click();
    await closeBook(owner);
    const slot = owner.locator('.action-bar-assembly .action-slot.has-spell').first(); await slot.click();
    await owner.getByRole('button', { name: 'Cast Spell', exact: true }).click();
    const dialog = owner.getByRole('dialog', { name: 'Supported spell cast', exact: true }); await dialog.waitFor();
    await dialog.getByRole('combobox').selectOption('character:app-hall:ally');
    await dialog.getByLabel('d4 face 1', { exact: true }).fill('4');
    await dialog.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    report.checks.ownerReading = await dialog.getByText(/Recorded physical roll/).textContent();
    await dialog.getByRole('button', { name: 'Approve price and send to GM', exact: true }).click();
    await dialog.getByText(/Awaiting GM adjudication/).waitFor();

    const tgt = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); pages.push(tgt);
    await setup(tgt, host.url, 'app-target'); host.setPlayerCharacter('app-target', { id: 'ally', class: 'Arcanoneer' });
    await tgt.getByText(/Stunned notices and voluntary proposals/).click();
    const acceptHealing = tgt.getByRole('button', { name: 'Accept this exact healing proposal', exact: true });
    await acceptHealing.waitFor({ timeout: 10000 }); await acceptHealing.click();
    report.checks.targetAccepted = true; save('target-acceptance.aria.yml', await tgt.locator('body').ariaSnapshot());

    const card = gm.locator('.p9-gm-card').filter({ hasText: 'Restorative Prayer' }); await card.waitFor({ timeout: 10000 });
    await card.getByRole('checkbox').check();
    await card.getByLabel('Final healing', { exact: true }).fill('22');
    save('gm-catalogue.aria.yml', await card.ariaSnapshot());
    await card.getByRole('button', { name: 'Accept one consequence', exact: true }).click();
    await card.getByText(/Accepted/).waitFor({ timeout: 10000 });
    const receipt = JSON.parse(JSON.stringify(host.room.gameState.actorConsequences.receipts.at(-1)));
    const source = host.room.gameState.maps['app-hall'].characterTokens.pc, target = host.room.gameState.maps['app-hall'].characterTokens.ally;
    assert.equal(source.character.actionPoints.current, 2); assert.equal(source.character.actionPoints.tempActionPoints, 0);
    assert.equal(source.character.mana.current, 8); assert.equal(source.character.tempMana, 0);
    assert.equal(source.state.classPayment.value.current, 1); assert.equal(source.state.classPayment.value.bonusLevels, 1);
    assert.equal(target.character.health.current, 30); assert.equal(target.character.tempHealth, 3);
    report.checks.receipt = receipt; report.passed = true;
    save('result.json', report);
  } catch (error) {
    report.failure = error.stack;
    for (let i = 0; i < pages.length; i++) save(`failure-${i}.aria.yml`, await pages[i].locator('body').ariaSnapshot().catch(() => 'unavailable'));
    save('result.json', report); throw error;
  } finally { await browser.close(); await host.stop(); }
}
if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });











