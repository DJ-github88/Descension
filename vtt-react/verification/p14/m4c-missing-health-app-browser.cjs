// Ordinary-App Wizard author/save/reopen/admit/cast/recover, with explicit fixture boundaries.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), cp = require('child_process');
const { chromium } = require('playwright');
const actors = require('../../../server/services/actorConsequences');
const payments = require('../../../server/services/spellPayments');
const pure = require('../../src/services/authoredAbility');
const fixtureCharacters = require('./m4b-fixture-characters.cjs');
const out = process.env.M4C_APP_OUTPUT;
assert(out && path.isAbsolute(out) && process.env.APP_BUILD_DIR);
fs.mkdirSync(out, { recursive: true });
process.env.APP_OUTPUT = path.join(out, 'fixture');
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const report = { checks: {}, errors: [], limits: ['Production optimized App and registered production handlers; Firebase identity/token verification, ownership/provider/lease/cloud are fixtures, not real services.',
  'Complete explicit deterministic character records loaded through production loadCharacter after boot; no partial hydration over random placeholders.',
  'Wizard-authored primitive only; neither Penance of Pain nor Redemption Strike admitted. No physical second device.'] };
const clone = v => JSON.parse(JSON.stringify(v));
const name = 'Prism Wound Measure', formula = '1d8 + caster_missing_health/4';
const book = page => page.getByRole('dialog', { name: 'Spellbook', exact: true });
async function setup(page, url, uid) {
  page.on('pageerror', e => report.errors.push({ uid, message: e.message }));
  await page.goto(url + '/game'); await page.locator('.action-slot').first().waitFor({ timeout: 60000 });
  const consent = page.getByRole('dialog', { name: /Analytics.*Privacy Consent/ });
  await consent.waitFor({ timeout: 5000 }).catch(() => {}); if (await consent.count()) await consent.getByRole('button', { name: /Decline/i }).click();
  await page.addScriptTag({ url: url + '/integration-io.js' });
  const character = clone(fixtureCharacters.characters[uid]);
  character.class = 'Arcanoneer'; character.level = 3; character.classResource = { type: 'elementalSpheres', spheres: [], current: 0, max: 12 };
  character.class_spells = { known_spells: [] }; character.buffs = []; character.debuffs = [];
  if (uid === 'app-owner') Object.assign(character, { health: { current: 23, max: 40 }, tempHealth: 9, mana: { current: 10, max: 30 }, tempMana: 3, actionPoints: { current: 4, max: 5 }, tempActionPoints: 1 });
  return page.evaluate(async ({ uid, character }) => {
    const fixture = await fetch('/integration-fixture.json').then(r => r.json());
    const key = Object.keys(window).find(k => k.startsWith('webpackChunk')); window[key].push([[99129], {}, r => window.__req = r]);
    const moduleWith = text => { const found = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); if (!found) throw Error('Missing module ' + text); return __req(found[0]); };
    const registry = moduleWith('registerStore:'); window.S = name => registry.getStore(name);
    window.__actors = moduleWith('acceptRecoveredActorSnapshot:');
    window.__spell = moduleWith('An unresolved spell approval is retained; check or withdraw it first.');
    const register = Object.values(__spell).find(f => typeof f === 'function' && f.toString().includes('actor_spell_pending') && f.toString().includes('socket:'));
    for (let i = 0; i < 100 && !S('authStore').getState().isAuthInitialized; i++) await new Promise(r => setTimeout(r, 100));
    S('authStore').getState().setUser({ uid, displayName: uid, getIdToken: async() => uid });
    await new Promise(r => setTimeout(r, 1000));
    window.__socket = io(fixture.backendUrl, { transports: ['websocket'], forceNew: true, auth: { token: uid } });
    await new Promise((resolve, reject) => { __socket.once('connect', resolve); __socket.once('connect_error', reject); });
    S('gameStore').setState({ isInMultiplayer: false, multiplayerRoom: null, multiplayerSocket: __socket }); register({ socket: __socket });
    const joined = new Promise((resolve, reject) => { __socket.once('room_joined', resolve); __socket.once('room_error', e => reject(Error(JSON.stringify(e)))); });
    __socket.emit('join_room', { roomId: fixture.roomId, playerName: uid, password: '' }); await joined;
    window.__outbound = []; const emit = __socket.emit.bind(__socket); __socket.emit = (event, ...args) => { __outbound.push({ event, payload: args[0] }); return emit(event, ...args); };
    S('gameStore').setState({ isInMultiplayer: true, isGMMode: uid === 'app-gm', multiplayerRoom: { id: fixture.roomId }, multiplayerSocket: __socket,
      cameraX: 0, cameraY: 0, zoomLevel: 1, playerZoom: 1, dynamicFogEnabled: false, gridSize: 50, feetPerTile: 5 });
    S('mapStore').setState({ currentMapId: fixture.mapId }); __actors.registerActorHandlers({ socket: __socket });
    if (!(await __actors.refreshActorSnapshot()).success) throw Error('Actor snapshot unavailable');
    const store = S('characterStore'), sleep = ms => new Promise(r => setTimeout(r, ms));
    for (let i = 0; i < 150 && !(store.getState().currentCharacterId && !store.getState().isLoading); i++) await sleep(100);
    for (let stable = 0, last = null; stable < 5;) { const s = store.getState(), key = `${s.currentCharacterId}|${s.characters.length}|${!!s.isLoading}`; stable = key === last ? stable + 1 : 0; last = key; await sleep(100); }
    store.setState({ characters: [character] }); S('gameStore').setState({ isInMultiplayer: false });
    store.getState().loadCharacter(character.id); S('gameStore').setState({ isInMultiplayer: true });
    if (uid === 'app-owner') { const result = __actors.selectOwnerAttachment(fixture.refs.pc); if (!result.success) throw Error(JSON.stringify(result)); }
    const s = store.getState();
    return { fixture, hydration: { characterId: s.currentCharacterId, race: s.race, subrace: s.subrace, equipment: Object.entries(s.equipment || {}).filter(([, item]) => item).map(([slot]) => slot),
      statsModel: s.statsModel, effective: s.getTotalStatsWithEffects() } };
  }, { uid, character });
}
async function openBook(page) {
  await page.getByRole('button', { name: /^Character(?: \(\d+\))?$/ }).first().click();
  await page.getByRole('button', { name: /^Spellbook(?: S)?$/ }).click(); await book(page).waitFor();
}
async function closeBook(page) { const close = book(page).getByRole('button', { name: 'Close', exact: true }); await close.focus(); await close.press('Enter'); }
async function author(page) {
  await openBook(page);
  await book(page).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(name);
  await book(page).getByRole('textbox', { name: 'Description * *', exact: true }).fill('One direct healing effect using the caster base missing health. No other mechanics.');
  await book(page).getByText('Arcane', { exact: true }).click();
  await book(page).getByRole('navigation', { name: 'Spell wizard steps' }).getByRole('button', { name: /Spell Type$/ }).click();
  await book(page).getByRole('heading', { name: 'ACTION', exact: true }).click(); await book(page).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await book(page).getByRole('button', { name: /^3 Effects$/ }).click(); await book(page).getByRole('heading', { name: 'Healing', exact: true }).click();
  await book(page).getByText('Immediate Healing', { exact: true }).click(); await book(page).getByText('Dice', { exact: true }).first().click();
  const input = book(page).getByLabel('Healing formula', { exact: true }); await input.fill('caster_missing_health/4');
  await book(page).getByText('Prism formula execution: manual for now', { exact: true }).click();
  await book(page).getByRole('button', { name: 'Use caster missing-health formula', exact: true }).click(); assert.equal(await input.inputValue(), formula);
  save('wizard-formula.aria.yml', await book(page).ariaSnapshot());
  await book(page).getByRole('navigation', { name: 'Spell wizard steps' }).getByRole('button', { name: /Targeting & Propagation$/ }).click();
  await book(page).getByText('Single Target', { exact: true }).click(); await book(page).getByText('Ranged', { exact: true }).click();
  const slider = book(page).getByRole('slider').first(); await slider.focus(); await slider.press('Home'); for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
  await book(page).getByText('Enemies', { exact: true }).click(); await book(page).getByText('Any Target', { exact: true }).click();
  await book(page).getByRole('navigation', { name: 'Spell wizard steps' }).getByRole('button', { name: /Resources$/ }).click();
  await book(page).getByTitle('Standard magical energy', { exact: true }).click(); await book(page).getByTitle('Basic action economy', { exact: true }).click();
  const values = book(page).getByRole('spinbutton'); await values.nth(0).fill('3'); await values.nth(1).fill('1');
  await page.getByRole('button', { name: '✓ Complete Spell', exact: true }).click();
  await page.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), name);
  const saved = await page.evaluate(name => { const key = Object.keys(localStorage).find(k => k.endsWith(':library.spellData')); return JSON.parse(localStorage.getItem(key)).payload.data.spells.find(s => s.name === name); }, name);
  assert.equal(saved.authoredDraft.healingConfig.formula, formula); assert.equal(pure.definitionFromWizard(saved, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' }).definition.capability, pure.HEALTH_CAPABILITY);
  save('wizard-saved.json', saved); await closeBook(page); await openBook(page);
  await book(page).getByRole('button', { name: 'Spell Library', exact: true }).click(); await book(page).getByText(name, { exact: true }).click();
  const section = page.getByRole('region', { name: `Room admission for ${name}`, exact: true }); await section.waitFor();
  await section.getByRole('button', { name: 'Admit this saved version', exact: true }).click(); await section.getByText(/Admitted for immediate damage\/healing/).waitFor();
  save('wizard-reopened-admitted.aria.yml', await section.ariaSnapshot());
  await page.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click(); await closeBook(page);
  return saved;
}
async function main() {
  const host = await require('./m4b-catalogue-app-server.cjs').start();
  const pc = actors.locate(host.room, host.refs.pc).token.character;
  Object.assign(pc, { class: 'Arcanoneer', health: { current: 23, max: 40 }, tempHealth: 9, actionPoints: { current: 4, max: 5 }, classResource: { type: 'elementalSpheres', spheres: [], current: 0, max: 12 } });
  const target = actors.locate(host.room, host.refs.B).token.state; Object.assign(target, { currentHp: 98, maxHp: 100, tempHealth: 2 });
  for (const event of ['actor_snapshot', 'actor_consequence', 'actor_spell_approve', 'actor_spell_list', 'actor_authored_admit', 'actor_authored_list', 'join_room']) host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const privateDir = path.join(out, 'private'); fs.mkdirSync(privateDir, { recursive: true });
  if (process.platform === 'win32') cp.execFileSync('icacls.exe', [privateDir, '/inheritance:r', '/grant:r', `${process.env.USERDOMAIN}\\${process.env.USERNAME}:(OI)(CI)F`, 'SYSTEM:(OI)(CI)F']);
  const contexts = [], pages = [];
  try {
    async function page(uid) { const context = await chromium.launchPersistentContext(path.join(privateDir, uid), { channel: 'chrome', headless: true, viewport: { width: 1440, height: 1000 } }); contexts.push(context); const p = context.pages()[0]; pages.push(p); report.checks[uid] = await setup(p, host.url, uid); return p; }
    const gm = await page('app-gm'); report.checks.wizard = await author(gm);
    const owner = await page('app-owner'); assert.deepEqual(report.checks['app-owner'].hydration.equipment, []); assert.equal(report.checks['app-owner'].hydration.effective.spirit, 18);
    await owner.locator('summary').filter({ hasText: /^Admitted abilities$/ }).click();
    const region = owner.getByRole('region', { name: 'Admitted abilities', exact: true }); await region.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
    await region.locator('.p9-admitted-row').filter({ hasText: name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
    const dialog = owner.getByRole('dialog', { name: 'Supported spell cast', exact: true }); await dialog.waitFor();
    await dialog.getByText(/Authoritative caster base HP 23\/40/).waitFor(); await dialog.getByRole('combobox', { name: 'Target', exact: true }).selectOption('creature:app-hall:B');
    await dialog.getByLabel('d8 face 1', { exact: true }).fill('4'); await dialog.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    const before = actors.clone(host.room.gameState.maps); await dialog.getByRole('button', { name: 'Approve price and send to GM', exact: true }).click();
    const card = gm.locator('.p9-gm-card').filter({ hasText: name }); await card.waitFor(); assert.deepEqual(host.room.gameState.maps, before);
    const entry = payments.listAll(host.room).find(e => e.approval.spell.name === name); assert.deepEqual(entry.approval.rollHealth, { current: 23, max: 40 }); assert.equal(entry.approval.roll.total, 8); assert.deepEqual(entry.approval.price, { ap: 1, mana: 3 });
    await card.getByText(/Bound caster base HP 23\/40/).waitFor(); report.checks.approval = clone(entry.approval);
    save('owner-inputs.aria.yml', await dialog.ariaSnapshot()); save('gm-inputs.aria.yml', await card.ariaSnapshot());
    await card.getByRole('checkbox').check(); await card.getByLabel(/^Final/).fill('8');
    await gm.evaluate(() => {
      const listeners = __socket.listeners('actor_consequence_accepted'); __socket.removeAllListeners('actor_consequence_accepted');
      __socket.on('actor_consequence_accepted', r => { if (String(r.receipt?.adjudication?.definitionVersionOrHash).startsWith('authored-immediate:v3/')) return; listeners.forEach(fn => fn(r)); });
      const emit = __socket.emit.bind(__socket); let drop = true;
      __socket.emit = (event, ...args) => { if (drop && event === 'actor_consequence' && String(args[0]?.adjudication?.definitionVersionOrHash).startsWith('authored-immediate:v3/')) { drop = false; if (typeof args[1] === 'function') args[1] = () => {}; } return emit(event, ...args); };
    });
    await card.getByRole('button', { name: 'Accept one consequence', exact: true }).click(); await dialog.getByText(/Accepted · /).first().waitFor({ timeout: 35000 });
    await card.getByRole('button', { name: 'Check same command', exact: true }).waitFor({ timeout: 35000 });
    const original = await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload);
    const after = actors.clone(host.room.gameState), receipt = clone(actors.ledger(host.room).receipts.at(-1));
    assert.equal(actors.locate(host.room, host.refs.B).token.state.currentHp, 100); assert.equal(actors.locate(host.room, host.refs.B).token.state.tempHealth, 2);
    const paid = actors.locate(host.room, host.refs.pc).token.character;
    assert.deepEqual([paid.actionPoints.current, paid.tempActionPoints, paid.mana.current, paid.tempMana, paid.health.current, paid.tempHealth], [4, 0, 10, 0, 23, 9]);
    assert.equal(JSON.parse(receipt.adjudication.chosenResult).actualHealing, 2);
    report.checks.receipt = receipt; report.checks.finalPools = clone(paid);
    await setup(gm, host.url, 'app-gm'); await gm.getByRole('button', { name: 'Check same command', exact: true }).first().click();
    await gm.getByText(/Accepted · /).first().waitFor({ timeout: 35000 });
    assert.deepEqual(await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload), original);
    assert.deepEqual(host.room.gameState.maps, after.maps); assert.equal(actors.ledger(host.room).receipts.length, 1);
    report.checks.originalCommandReloadRecovery = original; save('recovered.aria.yml', await gm.locator('body').ariaSnapshot()); report.passed = true;
  } catch (e) { report.failure = e.stack; for (let i = 0; i < pages.length; i++) save(`failure-${i}.aria.yml`, await pages[i].locator('body').ariaSnapshot().catch(() => 'unavailable')); throw e; }
  finally { save('result.json', report); for (const context of contexts) await context.close(); await host.stop(); }
}
if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
