// Attribute buff/debuff (flat Agility) — optimized production-App witness with GM, source owner, target owner and observer.
// Ordinary controls: Spell Wizard authoring/save, Spell Library reopen + room admission, Admitted abilities cast, GM card,
// target-owner acceptance panel, shared condition editor, the target owner's real formula cast dialog and strike dialog.
// The target owner's consumers read the score through the App's own sheet aggregation (combatAttributes).
// Provider identity/ownership/lease/cloud are fixtures; anything done outside ordinary controls is listed under `qualifications`.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.ATTR_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External ATTR_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture');
const actors = require('../../../server/services/actorConsequences'), payments = require('../../../server/services/spellPayments');
const profile = require('../../src/services/sharedConditionProfile'), pure = require('../../src/services/authoredAbility');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { startedAt: new Date().toISOString(), checks: {}, qualifications: [], errors: [], steps: [],
  limits: ['Optimized production App and the registered production backend; provider identity, canonical ownership, room lease and cloud persistence are fixture boundaries.',
    'Temporary room, accepted-live only. No live Firebase, deployment, physical second device or human tabletop session.'] };
const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); save('progress.json', report); };
const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true }), cast = p => p.getByRole('dialog', { name: 'Supported spell cast', exact: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(fn, label, tries = 75) { for (let i = 0; i < tries; i++) { if (await fn()) return; await sleep(200); } throw Error(`Timed out: ${label}`); }
const hall = host => host.room.gameState.maps['app-hall'];
const targetToken = host => hall(host).characterTokens.ally;

async function openBook(p) {
  await p.locator('.wow-nav-category-header').filter({ hasText: /^Character/ }).first().click();
  await p.locator('.wow-nav-flyout').getByRole('button', { name: /^Spellbook/ }).click(); await book(p).waitFor();
}
async function closeBook(p) { const c = book(p).getByRole('button', { name: 'Close', exact: true }); await c.focus(); await c.press('Enter'); }
async function savedRecord(p, name) {
  await p.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), name);
  return p.evaluate(name => { const k = Object.keys(localStorage).find(k => k.endsWith(':library.spellData')); return JSON.parse(localStorage.getItem(k)).payload.data.spells.find(s => s.name === name); }, name);
}
async function common(p, name, description) {
  await book(p).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(name); await book(p).getByRole('textbox', { name: 'Description * *', exact: true }).fill(description);
  await book(p).getByText('Arcane', { exact: true }).click();
  const nav = book(p).getByRole('navigation', { name: 'Spell wizard steps' }); await nav.getByRole('button', { name: /Spell Type$/ }).click();
  await book(p).getByRole('heading', { name: 'ACTION', exact: true }).click(); await book(p).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await nav.getByRole('button', { name: /^3 Effects$/ }).click(); return nav;
}
async function targetingAndPrice(p, nav, ap, mana) {
  await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click(); await book(p).getByText('Single Target', { exact: true }).click(); await book(p).getByText('Ranged', { exact: true }).click();
  const slider = book(p).getByRole('slider').first(); await slider.focus(); await slider.press('Home'); for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
  await book(p).getByText('Enemies', { exact: true }).click(); await book(p).getByText('Any Target', { exact: true }).click();
  await nav.getByRole('button', { name: /Resources$/ }).click(); await book(p).getByTitle('Standard magical energy', { exact: true }).click(); await book(p).getByTitle('Basic action economy', { exact: true }).click();
  const inputs = book(p).getByRole('spinbutton'); await inputs.nth(0).fill('1'); await inputs.nth(0).fill(String(mana)); await inputs.nth(1).fill('1'); await inputs.nth(1).fill(String(ap));
}
/** Spell Wizard: one Agility change through the composed-effect profile (ordinary controls only). */
async function authorAttribute(p, name, amount, label) {
  await openBook(p); const nav = await common(p, name, 'Disposable attribute-family witness.');
  await book(p).getByRole('heading', { name: 'Control', exact: true }).click();
  await book(p).getByRole('button', { name: /^Use composed effect profile/ }).click();
  await book(p).getByRole('combobox', { name: 'Canonical effect', exact: true }).selectOption('attribute');
  await book(p).getByLabel('Effect name shown on the target', { exact: true }).fill(label);
  await book(p).getByRole('combobox', { name: 'Attribute', exact: true }).selectOption('agility');
  await book(p).getByLabel(/^Change to the score/).fill(String(amount));
  save(`${name}-wizard-fields.aria.yml`, await book(p).getByRole('group', { name: /Composed effect/ }).ariaSnapshot());
  await book(p).getByRole('combobox', { name: 'Expiry', exact: true }).selectOption('gm-manual');
  await book(p).getByLabel('Source-authored duration text', { exact: true }).fill('While the charm holds');
  await book(p).getByLabel('Required GM adjudication note', { exact: true }).fill('Resolve eligibility, range and any save at the table before confirming.');
  await targetingAndPrice(p, nav, 1, 2);
  await p.getByRole('button', { name: '✓ Complete Spell', exact: true }).click();
  const r = await savedRecord(p, name); save(`${name}-saved.json`, r);
  const mapped = pure.definitionFromWizard(r, { roomId: 'diagnostic', definitionVersion: 1, classId: 'martyr' }); assert.equal(mapped.ok, true, JSON.stringify(mapped));
  assert.deepEqual(mapped.definition.effects.condition, { kind: 'attribute', attribute: 'agility', amount, label });
  await closeBook(p); return r;
}
async function authorFormula(p, name, formula) {
  await openBook(p); const nav = await common(p, name, 'Disposable Agility-scaled direct damage.');
  await book(p).getByRole('heading', { name: 'Damage', exact: true }).click();
  const input = book(p).getByLabel('Damage formula', { exact: true }); await input.fill(formula); await book(p).getByText('Prism formula execution: supported syntax', { exact: true }).waitFor();
  await targetingAndPrice(p, nav, 1, 1);
  await p.getByRole('button', { name: '✓ Complete Spell', exact: true }).click();
  const r = await savedRecord(p, name); assert.equal(pure.definitionFromWizard(r, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' }).definition.capability, pure.FORMULA_CAPABILITY);
  save(`${name}-saved.json`, r); await closeBook(p); return r;
}
/** Reopen the saved record from the Spell Library and admit that exact saved version for the room. */
async function reopenAndAdmit(p, name, classId = 'arcanoneer') {
  await openBook(p); await book(p).getByRole('button', { name: 'Spell Library', exact: true }).click(); await p.waitForTimeout(1500);
  for (let i = 0; ; i++) { // the library is paged; walk the ordinary Next Page control
    const card = book(p).getByRole('button', { name: `${name} details`, exact: true });
    if (await card.count()) { const first = card.first(); await first.focus(); await first.press('Enter'); break; }
    const next = book(p).getByRole('button', { name: 'Next Page', exact: true });
    if (i > 6 || !(await next.count()) || await next.isDisabled()) throw Error(`Saved spell not found in library: ${name}`); await next.click();
  }
  const r = p.getByRole('region', { name: `Room admission for ${name}`, exact: true }); await r.waitFor();
  const binding = r.getByRole('combobox', { name: 'Existing class binding', exact: true }); if (await binding.count()) await binding.selectOption(classId);
  save(`${name}-reopened.aria.yml`, await r.ariaSnapshot());
  await r.getByRole('button', { name: 'Admit this saved version', exact: true }).click(); await r.getByText(/^Admitted for /).waitFor();
  save(`${name}-admitted.aria.yml`, await r.ariaSnapshot());
  const overlayClose = p.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true });
  if (await overlayClose.count()) await overlayClose.click({ timeout: 10000 }).catch(() => p.keyboard.press('Escape')); else await p.keyboard.press('Escape');
  await closeBook(p).catch(() => {});
}
async function admitted(p, name, target) {
  const s = p.locator('summary').filter({ hasText: /^Admitted abilities$/ }); if (!await s.evaluate(e => e.parentElement.open)) await s.click();
  const r = p.getByRole('region', { name: 'Admitted abilities', exact: true }); await r.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
  await r.locator('.p9-admitted-row').filter({ hasText: name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
  const select = cast(p).getByRole('combobox', { name: 'Target', exact: true }); await select.waitFor();
  if (await select.isEnabled()) await select.selectOption(target); // a retained approval keeps its exact target locked
  return cast(p);
}
/** What the target owner's own App computes: the sheet aggregation consumers use (combatAttributes) + its stored records. */
const ownerView = p => p.evaluate(() => {
  const mod = (() => { for (const [id, f] of Object.entries(__req.m)) { const t = f.toString(); if (!t.includes('getTotalStatsWithEffects') || !t.includes('getActiveEffects')) continue; const m = __req(id); const fn = Object.values(m).find(v => typeof v === 'function' && v.toString().includes('getTotalStatsWithEffects')); if (fn) return fn; } return null; })();
  if (!mod) throw Error('combatAttributes not found');
  const sheet = S('characterStore').getState(), token = S('characterTokenStore').getState().characterTokens.find(t => t.id === 'ally');
  return { agility: mod(sheet).agility, storedAgility: sheet.stats.agility, records: (token?.state?.conditions || []).map(r => ({ id: r.id, name: r.name, effects: r.effects, type: r.type })),
    sheetBuffs: S('conditionStore').getState().activeBuffs.filter(r => r.effects?.agility).length, sheetDebuffs: S('conditionStore').getState().activeDebuffs.filter(r => r.effects?.agility).length };
});
async function strikeText(p) {
  const wing = p.locator('.action-bar-assembly:not(.spell-action-bar-assembly) .equipment-action-slot-wrapper.slot-ranged');
  await wing.locator('.equipment-action-slot').click(); await wing.getByAltText('Ranged Attack (Witness Bow)', { exact: true }).click();
  const d = p.getByRole('dialog', { name: 'Basic weapon strike', exact: true }); await d.waitFor(); await d.getByRole('combobox', { name: 'Strike target', exact: true }).selectOption('creature:app-hall:B');
  const text = await d.innerText(); await d.getByRole('button', { name: 'Close strike', exact: true }).click(); return (text.match(/agility -?\d+ \([+-]?\d+\)/) || [null])[0];
}
const fixtureCharacters = require('./m4b-fixture-characters.cjs');
const witnessBow = { id: 'attr-bow', name: 'Witness Bow', subtype: 'BOW', slots: ['ranged'], weaponStats: { baseDamage: { diceCount: 1, diceType: 'd6', damageType: 'stabbing' } } };
/** Same normal-App fixture setup as the M4B witness: explicit fixture character through production loadCharacter after boot settles. */
async function setup(page, host, uid) {
  if (!page.__attrInit) {
    page.__attrInit = true; page.on('pageerror', e => report.errors.push({ uid, message: e.message }));
    // Offline container: third-party font/icon stylesheets are answered empty (same treatment as the M3A witness), never fetched.
    await page.route(/(fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com|googleapis\.com|firebaseio\.com|firebaseapp\.com)/, r => r.fulfill({ status: 200, contentType: r.request().resourceType() === 'stylesheet' ? 'text/css' : 'application/octet-stream', body: '' }));
  }
  await page.goto(host.url + '/game');
  const consent = page.getByRole('dialog', { name: /Analytics.*Privacy Consent/ });
  await consent.waitFor({ timeout: 8000 }).catch(() => {}); if (await consent.count()) await consent.getByRole('button', { name: /Decline/i }).click({ timeout: 20000, force: true }).catch(() => {});
  await page.locator('.action-slot').first().waitFor({ timeout: 60000 });
  await page.waitForFunction(() => Object.keys(window).some(k => k.startsWith('webpackChunk')), null, { timeout: 60000 });
  await page.addScriptTag({ url: host.url + '/integration-io.js' });
  const base = fixtureCharacters.characters[uid];
  const fixtureCharacter = uid === 'app-target' ? { ...JSON.parse(JSON.stringify(base)), stats: { ...base.stats, agility: 10 }, baseStats: { ...base.baseStats, agility: 10 },
    equipment: { ...base.equipment, ranged: witnessBow }, skillRanks: { weaponMastery: 'ADEPT', weaponMastery_bow: 'NOVICE' } } : base || null;
  return page.evaluate(async({ uid, fixtureCharacter }) => {
    const fixture = await fetch('/integration-fixture.json').then(r => r.json());
    const key = Object.keys(window).find(k => k.startsWith('webpackChunk')); window[key].push([[99119], {}, r => window.__req = r]);
    const moduleWith = text => { const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); if (!pair) throw Error('Missing compiled module ' + text); return __req(pair[0]); };
    window.__registry = moduleWith('registerStore:'); window.S = name => __registry.getStore(name);
    window.__actors = moduleWith('acceptRecoveredActorSnapshot:');
    const spell = moduleWith('An unresolved spell approval is retained; check or withdraw it first.');
    const registerSpells = Object.values(spell).find(f => typeof f === 'function' && f.toString().includes('actor_spell_pending') && f.toString().includes('socket:'));
    for (let i = 0; i < 100 && !S('authStore').getState().isAuthInitialized; i++) await new Promise(r => setTimeout(r, 100));
    S('authStore').getState().setUser({ uid, displayName: uid, getIdToken: async() => uid });
    await new Promise(r => setTimeout(r, 1000));
    window.__socket = io(fixture.backendUrl, { transports: ['websocket'], forceNew: true, auth: { token: uid } });
    await new Promise((resolve, reject) => { __socket.once('connect', resolve); __socket.once('connect_error', reject); });
    S('gameStore').setState({ isInMultiplayer: false, multiplayerRoom: null, multiplayerSocket: __socket });
    registerSpells({ socket: __socket });
    const strike = moduleWith('Submitting one AP/HP consequence');
    const registerStrikes = Object.values(strike).find(f => typeof f === 'function' && f.toString().includes('actor_strike_closed'));
    if (registerStrikes) registerStrikes({ socket: __socket });
    const joined = new Promise((resolve, reject) => { __socket.once('room_joined', resolve); __socket.once('room_error', e => reject(Error(JSON.stringify(e)))); });
    __socket.emit('join_room', { roomId: fixture.roomId, playerName: uid, password: '' }); await joined;
    window.__outbound = []; const emit = __socket.emit.bind(__socket); __socket.emit = (event, ...args) => { window.__outbound.push({ event, payload: args[0] }); return emit(event, ...args); };
    S('gameStore').setState({ isInMultiplayer: true, isGMMode: uid === 'app-gm', multiplayerRoom: { id: fixture.roomId }, multiplayerSocket: __socket,
      cameraX: 0, cameraY: 0, zoomLevel: 1, playerZoom: 1, dynamicFogEnabled: false, gridSize: 50, feetPerTile: 5 });
    S('mapStore').setState({ currentMapId: fixture.mapId });
    __actors.registerActorHandlers({ socket: __socket });
    const result = await __actors.refreshActorSnapshot(); if (!result.success) throw Error(JSON.stringify(result));
    if (fixtureCharacter) {
      const store = S('characterStore'), sleep = ms => new Promise(r => setTimeout(r, ms));
      for (let w = 0; w < 15000 && !(store.getState().currentCharacterId && !store.getState().isLoading); w += 100) await sleep(100);
      for (let stable = 0, last = null; stable < 5; ) { const st = store.getState(), k = `${st.currentCharacterId}|${st.characters.length}|${!!st.isLoading}`; stable = k === last ? stable + 1 : 0; last = k; await sleep(100); }
      store.setState({ characters: [JSON.parse(JSON.stringify(fixtureCharacter))] }); store.getState().loadCharacter(fixtureCharacter.id);
      if (store.getState().currentCharacterId !== fixtureCharacter.id) throw Error('Fixture character did not load');
    }
    if (uid === 'app-owner') { const r = __actors.selectOwnerAttachment(fixture.refs.pc); if (!r.success) throw Error(JSON.stringify(r)); }
    if (uid === 'app-target') { const r = __actors.selectOwnerAttachment(fixture.refs.ally); if (!r.success) throw Error(JSON.stringify(r)); }
    // App order: the character is active before the room snapshot hydrates room conditions. The fixture loads the character after
    // the first snapshot (M4B harness order), and loadCharacter replaces the condition store, so the room snapshot is refreshed once more.
    if (fixtureCharacter) { const again = await __actors.refreshActorSnapshot(); if (!again.success) throw Error(JSON.stringify(again)); }
    return { ok: true };
  }, { uid, fixtureCharacter });
}
async function gmConfirm(gm, name) {
  const c = gm.locator('.p9-gm-card').filter({ hasText: name }).last(); await c.waitFor();
  await c.getByLabel('GM timing clarification (required)', { exact: true }).fill('GM removes this exact instance by hand');
  await c.getByLabel('Private manual resolution evidence', { exact: true }).fill('PRIVATE attribute witness ruling');
  await c.getByRole('checkbox', { name: /I resolved eligibility/ }).check(); return c;
}
function patchClick(page) { // animated controls report "not stable" under software rendering; retry the same click with force
  const L = Object.getPrototypeOf(page.locator('body')); if (L.__attr) return; L.__attr = true; const click = L.click;
  L.click = async function(options = {}) { try { return await click.call(this, { timeout: 15000, ...options }); } catch (e) { if (options.force || !/not stable|intercepts pointer/.test(String(e.message))) throw e; return click.call(this, { ...options, force: true }); } };
}

async function main() {
  const host = await require('./m4b-catalogue-app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw', 'actor_spell_target_respond',
    'actor_spell_target_designate', 'actor_strike_list', 'actor_bind', 'join_room']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  host.backend.registerAuthToken('app-observer', 'app-observer');
  host.refs.target = host.refs.ally;
  report.qualifications.push('Setup refreshes the room snapshot again after the fixture character loads (the App activates the character before joining). Run witness4 showed that loading a character AFTER the room snapshot leaves the room Agility record out of the sheet aggregation until the next hydration (finding F7, recorded for the owners of loadCharacter/hydration).');
  report.qualifications.push('Fixture characters (source Ilse, target Ally with Agility 10 and a Witness Bow) load through production loadCharacter, as in the M4B witness; the room PCs, ownership and identities are fixtures.');
  const browser = await chromium.launch({ headless: true }), pages = {};
  try {
    for (const role of ['gm', 'source', 'target', 'observer']) { const p = pages[role] = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' }); p.on('pageerror', e => report.errors.push({ role, message: e.message })); patchClick(p); }
    const { gm, source, target, observer } = pages;
    await setup(gm, host, 'app-gm');
    step('GM authors +2 and −2 Agility changes and an Agility-scaled bolt in the Spell Wizard; each saved record is reopened and admitted');
    const quick = await authorAttribute(gm, 'Attr Quickening', 2, 'Quickened'); await reopenAndAdmit(gm, 'Attr Quickening', 'martyr');
    await setup(gm, host, 'app-gm'); const leaden = await authorAttribute(gm, 'Attr Leaden Hex', -2, 'Leaden'); await reopenAndAdmit(gm, 'Attr Leaden Hex', 'martyr');
    await setup(gm, host, 'app-gm'); await authorFormula(gm, 'Attr Quick Bolt', '1d6 + agility'); await reopenAndAdmit(gm, 'Attr Quick Bolt');
    report.checks.wizard = { quick: quick.authoredDraft.controlConfig.authoredCondition, leaden: leaden.authoredDraft.controlConfig.authoredCondition };
    await setup(gm, host, 'app-gm'); await setup(source, host, 'app-owner'); await setup(target, host, 'app-target'); await setup(observer, host, 'app-observer');

    step('baseline on the target owner\'s App: sheet Agility A, bolt +A, bow modifier from A');
    const before = await ownerView(target); report.checks.before = before; const A = before.agility; assert.ok(Number.isInteger(A));
    const strikeOf = n => `agility ${n} (${Math.floor((n - 10) / 2) >= 0 ? '+' : ''}${Math.floor((n - 10) / 2)})`;
    let card; let d = await admitted(target, 'Attr Quick Bolt', 'creature:app-hall:B');
    await d.getByLabel('d6 face 1', { exact: true }).fill('3'); await d.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    report.checks.boltBefore = (await d.innerText()).match(/1d6 \+ agility[^\n]*/g); save('bolt-before.txt', await d.innerText());
    await d.getByRole('button', { name: /^Approve price and send to GM$/ }).click(); await d.getByText(/Awaiting GM/).first().waitFor();
    const staleBolt = payments.listAll(host.room).find(e => e.approval.spell.name === 'Attr Quick Bolt'); assert.equal(staleBolt.approval.rollAttributes.agility, A); assert.equal(staleBolt.approval.roll.total, 3 + A);
    await d.getByRole('button', { name: 'Close', exact: true }).click();
    report.checks.strikeBefore = await strikeText(target); assert.equal(report.checks.strikeBefore, strikeOf(A));

    step('GM-controlled creature A applies Leaden Hex (−2) to the target PC; hostile, the GM confirms (ACK dropped once); one exact record installs');
    // The owner-PC cast builder only offers creature targets for composed bundles; the supported App route onto a PC is the placed creature (A9/M3A).
    hall(host).tokens.A.authoredAbility = { schemaVersion: 1, record: actors.clone(leaden), librarySpellId: null };
    hall(host).tokens.A.state.currentMana = 10; // the shared M4B fixture creature has 0 mana; the authored price is 1 AP + 2 mana
    report.qualifications.push('Creature A\'s mana pool was set to 10 on the room token (fixture), because the shared fixture creature starts with 0 mana and the first run refused with insufficient_resources.');
    report.qualifications.push('Creature A carries the saved Leaden Hex record as its authoredAbility through a fixture write on the room token (instead of the Bestiary association UI); admission, targeting, resolution and confirmation below use ordinary controls.');
    await setup(gm, host, 'app-gm');
    const tokenEl = await (async() => { await gm.waitForFunction(() => Array.from(document.querySelectorAll('.creature-token')).some(el => { let f = el[Object.keys(el).find(k => k.startsWith('__reactFiber'))]; for (; f; f = f.return) if (f.memoizedProps?.tokenId === 'A') { el.dataset.attrToken = 'A'; return true; } return false; })); return gm.locator('[data-attr-token="A"]'); })();
    await tokenEl.click({ button: 'right' }); await gm.getByRole('button', { name: /Token Actions/ }).hover(); await gm.getByText('Inspect', { exact: true }).last().click();
    const abilities = gm.getByRole('button', { name: 'Abilities & Spells', exact: true }).last(); await abilities.focus(); await abilities.press('Enter');
    const region = gm.getByRole('region', { name: 'Creature activated ability', exact: true }); await region.waitFor();
    const bindBtn = region.getByRole('button', { name: 'Bind this placed creature', exact: true }); if (await bindBtn.count()) await bindBtn.click();
    await region.getByRole('button', { name: 'Refresh room admission', exact: true }).click(); await region.getByRole('button', { name: 'Admit for this creature', exact: true }).click();
    await region.getByText(/^Admitted for /).waitFor(); save('creature-admitted.aria.yml', await region.ariaSnapshot());
    await region.getByRole('button', { name: 'Use for this creature', exact: true }).click();
    d = gm.getByRole('dialog', { name: 'Creature ability action', exact: true }); await d.waitFor();
    await d.getByRole('combobox', { name: 'Creature or primary PC target', exact: true }).selectOption('character:app-hall:ally');
    await d.getByLabel('GM timing note (required)', { exact: true }).fill('GM removes this exact instance by hand');
    await d.getByLabel('Manual resolution evidence (optional)', { exact: true }).fill('PRIVATE attribute witness ruling');
    await d.getByRole('checkbox', { name: /I resolved eligibility/ }).check();
    save('creature-dialog.txt', await d.innerText()); report.checks.gmPreview = (await d.innerText()).match(/Now on this target[^\n]*\n?[^\n]*/)?.[0] || null;
    await d.getByRole('button', { name: 'Validate successful effect application', exact: true }).click();
    await d.getByRole('checkbox', { name: /I reviewed the retained successful outcome/ }).check();
    const sourceBefore = actors.clone(hall(host).tokens.A.state);
    await gm.evaluate(() => { const emit = __socket.emit.bind(__socket); let drop = true;
      __socket.emit = (event, ...args) => { if (drop && event === 'actor_consequence' && String(args[0]?.adjudication?.definitionVersionOrHash).startsWith('authored-effect:v1/')) { drop = false; if (typeof args[1] === 'function') args[1] = () => {}; } return emit(event, ...args); }; });
    await d.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    await until(() => targetToken(host).state.conditions.length === 1, 'Leaden installed');
    const leadenRecord = targetToken(host).state.conditions[0]; assert.ok(profile.isAttributeModifier(leadenRecord)); assert.deepEqual(leadenRecord.effects, { agility: -2 });
    report.checks.creaturePaid = { before: { ap: sourceBefore.currentActionPoints, temp: sourceBefore.tempActionPoints, mana: sourceBefore.currentMana }, after: { ap: hall(host).tokens.A.state.currentActionPoints, temp: hall(host).tokens.A.state.tempActionPoints, mana: hall(host).tokens.A.state.currentMana } };
    const receipts = actors.ledger(host.room).receipts.length, original = await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload);
    await setup(gm, host, 'app-gm');
    const reopen = gm.getByRole('button', { name: /Open retained creature action|Check same command/ }).first(); await reopen.waitFor({ timeout: 20000 }); await reopen.click();
    const check = gm.getByRole('button', { name: 'Check same command', exact: true }).first(); if (await check.count()) await check.click();
    await sleep(2000);
    assert.equal(actors.ledger(host.room).receipts.length, receipts, 'lost ACK recovers one original outcome'); assert.equal(targetToken(host).state.conditions.length, 1);
    report.checks.lostAckRecovery = { commandId: original.commandId, receipts, resent: (await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').map(v => v.payload.commandId))) };
    await gm.keyboard.press('Escape').catch(() => {});
    await until(async() => (await ownerView(target)).agility === A - 2, 'target owner sees Agility A-2');
    const after = await ownerView(target); report.checks.afterLeaden = after; assert.equal(after.storedAgility, before.storedAgility, 'base/stats untouched'); assert.equal(after.sheetDebuffs, 1);
    report.checks.observer = await observer.evaluate(() => (S('characterTokenStore').getState().characterTokens.find(t => t.id === 'ally')?.state?.conditions || []).map(r => ({ name: r.name, effects: r.effects, hasSource: !!r.sourceActor })));
    assert.equal(report.checks.observer.length, 1);

    step('stale proposal: the bolt approved at Agility 10 needs the target owner\'s explicit reapproval; the same face is revalued');
    card = gm.locator('.p9-gm-card').filter({ hasText: 'Attr Quick Bolt' }).last(); await card.waitFor();
    await card.getByRole('checkbox').first().check(); await card.getByLabel(/^Final/).fill(String(3 + A));
    const stateBefore = actors.clone(host.room.gameState.maps);
    await card.getByRole('button', { name: 'Accept one consequence', exact: true }).click();
    await until(async() => !!payments.closedCode(host.room, staleBolt.approval.approvalId), 'stale approval closed');
    assert.equal(payments.closedCode(host.room, staleBolt.approval.approvalId), 'owner_reapproval_required'); assert.deepEqual(host.room.gameState.maps, stateBefore, 'nothing applied');
    d = await admitted(target, 'Attr Quick Bolt', 'creature:app-hall:B');
    const review = d.getByRole('button', { name: /Approve displayed scores again \(retained faces\)|Review changed scores with retained faces/ }).first(); await review.waitFor(); await review.click();
    await until(async() => payments.listAll(host.room).some(e => e.approval.spell.name === 'Attr Quick Bolt' && e.approval.approvalId !== staleBolt.approval.approvalId), 'fresh bolt approval');
    const fresh = payments.listAll(host.room).find(e => e.approval.spell.name === 'Attr Quick Bolt' && e.approval.approvalId !== staleBolt.approval.approvalId);
    report.checks.reapproval = { faces: fresh.approval.roll.dice[0].faces, agility: fresh.approval.rollAttributes.agility, total: fresh.approval.roll.total };
    assert.deepEqual(fresh.approval.roll.dice[0].faces, [3]); assert.equal(fresh.approval.rollAttributes.agility, A - 2); assert.equal(fresh.approval.roll.total, 3 + A - 2);
    card = gm.locator('.p9-gm-card').filter({ hasText: 'Attr Quick Bolt' }).last(); await card.getByRole('checkbox').first().check(); await card.getByLabel(/^Final/).fill(String(1 + A));
    const bHp = hall(host).tokens.B.state.currentHp + hall(host).tokens.B.state.tempHealth;
    await card.getByRole('button', { name: 'Accept one consequence', exact: true }).click();
    await until(() => hall(host).tokens.B.state.currentHp + hall(host).tokens.B.state.tempHealth === bHp - (1 + A), 'bolt applied');
    await d.getByRole('button', { name: 'Close', exact: true }).click().catch(() => {});
    report.checks.strikeAfterLeaden = await strikeText(target); assert.equal(report.checks.strikeAfterLeaden, strikeOf(A - 2));

    step('reload: the target owner\'s App rehydrates one record and the same value; no second application');
    await setup(target, host, 'app-target'); const reloaded = await ownerView(target); report.checks.reloaded = reloaded;
    assert.equal(reloaded.agility, A - 2); assert.equal(reloaded.records.length, 1); assert.equal(reloaded.sheetDebuffs, 1);

    step('GM removes the exact instance in the shared condition editor; the target value is restored');
    const controls = gm.getByRole('region', { name: 'Actor attachment and consequences', exact: true });
    await controls.getByRole('combobox', { name: 'Exact room attachment', exact: true }).selectOption('character:ally');
    await controls.getByRole('button', { name: 'Edit selected shared conditions', exact: true }).click();
    const editor = gm.getByRole('dialog', { name: 'Edit selected shared conditions editor', exact: true }); await editor.waitFor();
    const attrRegion = editor.getByRole('region', { name: 'Active attribute changes', exact: true }); await attrRegion.waitFor(); save('gm-editor-attributes.aria.yml', await attrRegion.ariaSnapshot());
    report.checks.gmEditor = await attrRegion.innerText();
    await attrRegion.getByRole('button', { name: `Remove Leaden instance ${leadenRecord.recordId}`, exact: true }).click();
    await until(() => targetToken(host).state.conditions.length === 0, 'removed');
    await editor.getByRole('button', { name: 'Close shared condition editor', exact: true }).click();
    await until(async() => (await ownerView(target)).agility === A, 'restored'); report.checks.restored = await ownerView(target);
    report.checks.observerCannotRemove = await observer.getByRole('button', { name: /^Remove Leaden instance/ }).count(); assert.equal(report.checks.observerCannotRemove, 0);

    report.qualifications.push('The +2 (beneficial, target-owner acceptance) route is not App-witnessed: the owner-PC cast builder offers creature targets only for composed bundles, and the creature route for a beneficial rider-only change was not exercised here. It is covered by the registered-handler suite (target acceptance, silence/GM/observer refusal, lost ACK).');
    for (const [k, p] of Object.entries(pages)) save(`final-${k}.png`, ''), await p.screenshot({ path: path.join(out, `final-${k}.png`) }).catch(() => {});
    report.passed = report.errors.length === 0;
    if (!report.passed) report.qualifications.push(`Page errors recorded: ${report.errors.length}`);
  } catch (e) {
    report.error = String(e.stack || e); console.error(e);
    for (const [k, pg] of Object.entries(pages)) { save(`fail-${k}.aria.yml`, await pg.locator('body').ariaSnapshot().catch(() => '')); await pg.screenshot({ path: path.join(out, `fail-${k}.png`) }).catch(() => {}); }
  } finally {
    save('result.json', report);
    // Teardown must not change the recorded verdict: a hung browser/backend close exits with the verdict after 20 s.
    setTimeout(() => { report.teardown = 'forced-exit-after-20s'; save('result.json', report); process.exit(report.passed ? 0 : 1); }, 20000).unref();
    await browser.close().catch(() => {}); await host.stop().catch(() => {});
  }
  if (!report.passed) process.exit(1);
}
main();
