// Ordinary optimized App controls; setup alone uses explicit deterministic fixtures and mocked services.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), cp = require('child_process');
const { chromium } = require('playwright');
const actors = require('../../../server/services/actorConsequences'), payments = require('../../../server/services/spellPayments');
const pure = require('../../src/services/authoredAbility'), fixtureCharacters = require('./m4b-fixture-characters.cjs');
const out = process.env.M4D_APP_OUTPUT; assert(out && path.isAbsolute(out) && process.env.APP_BUILD_DIR); fs.mkdirSync(out, { recursive: true });
process.env.APP_OUTPUT = path.join(out, 'fixture');
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const clone = v => JSON.parse(JSON.stringify(v));
const report = { checks: {}, errors: [], limits: ['Optimized ordinary App and production registered handlers. Firebase identity/provider, token verification, ownership, lease and cloud persistence mocked; temporary accepted-live room, no real Firebase or second physical device.', 'Complete deterministic fixtures loaded through production loadCharacter after boot; setup instrumentation only, casts use ordinary controls.', 'Wizard primitive only. No catalogue pin or stripped catalogue demonstration.'] };
const name = 'Prism Deterministic Measure', formula = 'caster_missing_health/4';
const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
async function setup(page, url, uid) {
  page.on('pageerror', e => report.errors.push({ uid, message: e.message }));
  await page.goto(url + '/game'); await page.locator('.action-slot').first().waitFor({ timeout: 60000 });
  const consent = page.getByRole('dialog', { name: /Analytics.*Privacy Consent/ }); await consent.waitFor({ timeout: 5000 }).catch(() => {}); if (await consent.count()) await consent.getByRole('button', { name: /Decline/i }).click();
  await page.addScriptTag({ url: url + '/integration-io.js' });
  const character = clone(fixtureCharacters.characters[uid]); character.class = 'Arcanoneer'; character.level = 3;
  character.classResource = { type: 'elementalSpheres', spheres: [], current: 0, max: 12 }; character.class_spells = { known_spells: [] }; character.buffs = []; character.debuffs = [];
  if (uid === 'app-owner') Object.assign(character, { health: { current: 23, max: 40 }, tempHealth: 9, mana: { current: 10, max: 30 }, tempMana: 3, actionPoints: { current: 4, max: 5 }, tempActionPoints: 1 });
  return page.evaluate(async ({ uid, character }) => {
    const fixture = await fetch('/integration-fixture.json').then(r => r.json());
    const key = Object.keys(window).find(k => k.startsWith('webpackChunk')); window[key].push([[99139], {}, r => window.__req = r]);
    const moduleWith = text => { const found = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); if (!found) throw Error('Missing module ' + text); return __req(found[0]); };
    const registry = moduleWith('registerStore:'); window.S = name => registry.getStore(name); window.__actors = moduleWith('acceptRecoveredActorSnapshot:');
    window.__spell = moduleWith('An unresolved spell approval is retained; check or withdraw it first.');
    const register = Object.values(__spell).find(f => typeof f === 'function' && f.toString().includes('actor_spell_pending') && f.toString().includes('socket:'));
    for (let i = 0; i < 100 && !S('authStore').getState().isAuthInitialized; i++) await new Promise(r => setTimeout(r, 100));
    S('authStore').getState().setUser({ uid, displayName: uid, getIdToken: async() => uid }); await new Promise(r => setTimeout(r, 1000));
    window.__socket = io(fixture.backendUrl, { transports: ['websocket'], forceNew: true, auth: { token: uid } }); await new Promise((r, j) => { __socket.once('connect', r); __socket.once('connect_error', j); });
    S('gameStore').setState({ isInMultiplayer: false, multiplayerRoom: null, multiplayerSocket: __socket }); register({ socket: __socket });
    const joined = new Promise((r, j) => { __socket.once('room_joined', r); __socket.once('room_error', e => j(Error(JSON.stringify(e)))); }); __socket.emit('join_room', { roomId: fixture.roomId, playerName: uid, password: '' }); await joined;
    window.__outbound = []; const emit = __socket.emit.bind(__socket); __socket.emit = (event, ...args) => { __outbound.push({ event, payload: args[0] }); return emit(event, ...args); };
    S('gameStore').setState({ isInMultiplayer: true, isGMMode: uid === 'app-gm', multiplayerRoom: { id: fixture.roomId }, multiplayerSocket: __socket, cameraX: 0, cameraY: 0, zoomLevel: 1, playerZoom: 1, dynamicFogEnabled: false, gridSize: 50, feetPerTile: 5 });
    S('mapStore').setState({ currentMapId: fixture.mapId }); __actors.registerActorHandlers({ socket: __socket }); if (!(await __actors.refreshActorSnapshot()).success) throw Error('Snapshot unavailable');
    const store = S('characterStore'), sleep = ms => new Promise(r => setTimeout(r, ms));
    for (let i = 0; i < 150 && !(store.getState().currentCharacterId && !store.getState().isLoading); i++) await sleep(100);
    for (let stable = 0, last = null; stable < 5;) { const s = store.getState(), key = `${s.currentCharacterId}|${s.characters.length}|${!!s.isLoading}`; stable = key === last ? stable + 1 : 0; last = key; await sleep(100); }
    store.setState({ characters: [character] }); S('gameStore').setState({ isInMultiplayer: false }); store.getState().loadCharacter(character.id); S('gameStore').setState({ isInMultiplayer: true });
    if (uid === 'app-owner') { const r = __actors.selectOwnerAttachment(fixture.refs.pc); if (!r.success) throw Error(JSON.stringify(r)); }
    const s = store.getState(); return { fixture, hydration: { characterId: s.currentCharacterId, race: s.race, subrace: s.subrace, equipment: Object.entries(s.equipment || {}).filter(([, item]) => item).map(([slot]) => slot), statsModel: s.statsModel, effective: s.getTotalStatsWithEffects() } };
  }, { uid, character });
}
async function openBook(p) { await p.getByRole('button', { name: /^Character(?: \(\d+\))?$/ }).first().click(); await p.getByRole('button', { name: /^Spellbook(?: S)?$/ }).click(); await book(p).waitFor(); }
async function closeBook(p) { const b = book(p).getByRole('button', { name: 'Close', exact: true }); await b.focus(); await b.press('Enter'); }
async function author(p) {
  await openBook(p); await book(p).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(name); await book(p).getByRole('textbox', { name: 'Description * *', exact: true }).fill('One immediate healing proposal from caster base missing HP, without dice.');
  await book(p).getByText('Arcane', { exact: true }).click();
  const steps = book(p).getByRole('navigation', { name: 'Spell wizard steps' }); await steps.getByRole('button', { name: /Spell Type$/ }).click(); await book(p).getByRole('heading', { name: 'ACTION', exact: true }).click(); await book(p).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await book(p).getByRole('button', { name: /^3 Effects$/ }).click(); await book(p).getByRole('heading', { name: 'Healing', exact: true }).click(); await book(p).getByText('Immediate Healing', { exact: true }).click(); await book(p).getByText('Dice', { exact: true }).first().click();
  await book(p).getByLabel('Healing formula', { exact: true }).fill(formula); await book(p).getByText('Prism formula execution: supported syntax', { exact: true }).click(); save('wizard-formula.aria.yml', await book(p).ariaSnapshot());
  await steps.getByRole('button', { name: /Targeting & Propagation$/ }).click(); await book(p).getByText('Single Target', { exact: true }).click(); await book(p).getByText('Ranged', { exact: true }).click();
  const slider = book(p).getByRole('slider').first(); await slider.focus(); await slider.press('Home'); for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
  await book(p).getByText('Enemies', { exact: true }).click(); await book(p).getByText('Any Target', { exact: true }).click(); await steps.getByRole('button', { name: /Resources$/ }).click();
  await book(p).getByTitle('Standard magical energy', { exact: true }).click(); await book(p).getByTitle('Basic action economy', { exact: true }).click(); const values = book(p).getByRole('spinbutton'); await values.nth(0).fill('3'); await values.nth(1).fill('1');
  await p.getByRole('button', { name: '✓ Complete Spell', exact: true }).click(); await p.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), name);
  const saved = await p.evaluate(name => { const key = Object.keys(localStorage).find(k => k.endsWith(':library.spellData')); return JSON.parse(localStorage.getItem(key)).payload.data.spells.find(s => s.name === name); }, name);
  assert.equal(saved.authoredDraft.healingConfig.formula, formula); assert.equal(pure.definitionFromWizard(saved, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' }).definition.capability, pure.DETERMINISTIC_CAPABILITY); save('wizard-saved.json', saved);
  await closeBook(p); await openBook(p); await book(p).getByRole('button', { name: 'Spell Library', exact: true }).click(); await book(p).getByText(name, { exact: true }).click();
  const section = p.getByRole('region', { name: `Room admission for ${name}`, exact: true }); await section.waitFor(); await section.getByRole('button', { name: 'Admit this saved version', exact: true }).click(); await section.getByText(/Admitted for immediate damage\/healing/).waitFor(); save('wizard-reopened-admitted.aria.yml', await section.ariaSnapshot());
  await p.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click(); await closeBook(p); return saved;
}
async function main() {
  const host = await require('./m4b-catalogue-app-server.cjs').start();
  Object.assign(actors.locate(host.room, host.refs.pc).token.character, { class: 'Arcanoneer', health: { current: 23, max: 40 }, tempHealth: 9, actionPoints: { current: 4, max: 5 }, classResource: { type: 'elementalSpheres', spheres: [], current: 0, max: 12 } });
  Object.assign(actors.locate(host.room, host.refs.B).token.state, { currentHp: 98, maxHp: 100, tempHealth: 2 });
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_spell_approve', 'actor_spell_list', 'actor_authored_admit', 'actor_authored_list', 'join_room']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const privateDir = path.join(out, 'private'); fs.mkdirSync(privateDir, { recursive: true }); if (process.platform === 'win32') cp.execFileSync('icacls.exe', [privateDir, '/inheritance:r', '/grant:r', `${process.env.USERDOMAIN}\\${process.env.USERNAME}:(OI)(CI)F`, 'SYSTEM:(OI)(CI)F']);
  const contexts = [], pages = [];
  try {
    async function page(uid) { const c = await chromium.launchPersistentContext(path.join(privateDir, uid), { channel: 'chrome', headless: true, viewport: { width: 1440, height: 1000 } }); contexts.push(c); const p = c.pages()[0]; pages.push(p); report.checks[uid] = await setup(p, host.url, uid); return p; }
    const gm = await page('app-gm'); report.checks.wizard = await author(gm); const owner = await page('app-owner'); assert.deepEqual(report.checks['app-owner'].hydration.equipment, []); assert.equal(report.checks['app-owner'].hydration.effective.spirit, 18);
    await owner.locator('summary').filter({ hasText: /^Admitted abilities$/ }).click(); const region = owner.getByRole('region', { name: 'Admitted abilities', exact: true }); await region.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click(); await region.locator('.p9-admitted-row').filter({ hasText: name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
    const dialog = owner.getByRole('dialog', { name: 'Supported spell cast', exact: true }); await dialog.waitFor(); await dialog.getByText(/Authoritative caster base HP 23\/40/).waitFor();
    const select = dialog.getByRole('combobox', { name: 'Target', exact: true }); const value = await select.locator('option').filter({ hasText: /creature.*B$/ }).getAttribute('value'); assert(value); await select.selectOption(value);
    assert.equal(await dialog.getByRole('button', { name: /^(Roll .* once|Record physical roll)$/ }).count(), 0); await dialog.getByText(/Calculated proposal: 4/).waitFor();
    const before = actors.clone(host.room.gameState.maps); await dialog.getByRole('button', { name: 'Approve price and send to GM', exact: true }).click(); const card = gm.locator('.p9-gm-card').filter({ hasText: name }); await card.waitFor(); assert.deepEqual(host.room.gameState.maps, before);
    const entry = payments.listAll(host.room).find(e => e.approval.spell.name === name); assert.deepEqual(entry.approval.rollHealth, { current: 23, max: 40 }); assert.deepEqual(entry.approval.roll.dice, []); assert.equal(entry.approval.roll.mode, 'deterministic'); assert.equal(entry.approval.roll.total, 4); assert.deepEqual(entry.approval.price, { ap: 1, mana: 3 }); report.checks.approval = clone(entry.approval);
    save('owner-inputs.aria.yml', await dialog.ariaSnapshot()); save('gm-inputs.aria.yml', await card.ariaSnapshot()); await card.getByRole('checkbox').check(); await card.getByLabel(/^Final/).fill('5'); await card.getByLabel(/^Reason/).fill('GM adjusts healing proposal to five.'); save('gm-adjustment.aria.yml', await card.ariaSnapshot());
    await gm.evaluate(() => { const listeners = __socket.listeners('actor_consequence_accepted'); __socket.removeAllListeners('actor_consequence_accepted'); __socket.on('actor_consequence_accepted', r => { if (String(r.receipt?.adjudication?.definitionVersionOrHash).startsWith('authored-immediate:v4/')) return; listeners.forEach(fn => fn(r)); }); const emit = __socket.emit.bind(__socket); let drop = true; __socket.emit = (event, ...args) => { if (drop && event === 'actor_consequence' && String(args[0]?.adjudication?.definitionVersionOrHash).startsWith('authored-immediate:v4/')) { drop = false; if (typeof args[1] === 'function') args[1] = () => {}; } return emit(event, ...args); }; });
    await card.getByRole('button', { name: 'Accept one consequence', exact: true }).click(); await dialog.getByText(/Accepted · /).first().waitFor({ timeout: 35000 }); await card.getByRole('button', { name: 'Check same command', exact: true }).waitFor({ timeout: 35000 });
    const original = await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload), after = actors.clone(host.room.gameState), receipt = clone(actors.ledger(host.room).receipts.at(-1));
    assert.equal(actors.locate(host.room, host.refs.B).token.state.currentHp, 100); assert.equal(actors.locate(host.room, host.refs.B).token.state.tempHealth, 2);
    const paid = actors.locate(host.room, host.refs.pc).token.character; assert.deepEqual([paid.actionPoints.current, paid.tempActionPoints, paid.mana.current, paid.tempMana, paid.health.current, paid.tempHealth], [4, 0, 10, 0, 23, 9]); assert.equal(JSON.parse(receipt.adjudication.chosenResult).actualHealing, 2); assert.equal(receipt.adjudication.finalAmount, 5); report.checks.receipt = receipt; report.checks.finalPools = clone(paid);
    await setup(gm, host.url, 'app-gm'); await gm.getByRole('button', { name: 'Check same command', exact: true }).first().click(); await gm.getByText(/Accepted · /).first().waitFor({ timeout: 35000 });
    assert.deepEqual(await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload), original); assert.deepEqual(host.room.gameState.maps, after.maps); assert.equal(actors.ledger(host.room).receipts.length, 1); report.checks.originalCommandReloadRecovery = original; save('recovered.aria.yml', await gm.locator('body').ariaSnapshot()); assert.deepEqual(report.errors, []); report.passed = true;
  } catch (e) { report.failure = e.stack; for (let i = 0; i < pages.length; i++) save(`failure-${i}.aria.yml`, await pages[i].locator('body').ariaSnapshot().catch(() => 'unavailable')); throw e; }
  finally { save('result.json', report); for (const c of contexts) await c.close(); await host.stop(); }
}
if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
