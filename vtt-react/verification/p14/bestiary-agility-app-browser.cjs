// PREPARED, NOT RUN. Bestiary ability authoring → combat, identified-build ordinary-App witness.
//
// Journey (ordinary controls only):
//   Spell Wizard authors + saves an Agility (attribute) ability  →  Bestiary "Create New" → 3 Abilities → the
//   "Compatible Spell Library definition" picker (real provider, no injected list)  →  Keep ability on creature  →
//   Save Creature  →  reopen the template  →  drag the library card onto the grid (real HTML5 drag, not a store write)  →
//   placed Inspect → Abilities & Spells → Bind → Admit for this creature (GM admission) → Use for this creature →
//   GM confirm → the −2 Agility condition is on the target.
//   Then a SEPARATE template-removal check: remove the ability from the template, save, reopen, and confirm the
//   already-placed token keeps its detached copy (in the client store, in the room, and in placed Inspect).
//
// If the picker is empty the run FAILS with diagnostics (option text, localStorage library keys, provider markers).
// There is deliberately NO fallback that writes the association onto a token or into the store.
//
// Required environment: BESTIARY_OUTPUT (absolute, outside the repo), APP_BUILD_DIR (absolute, an identified production build).
// Optional: BESTIARY_CHANNEL (e.g. "chrome"; default is Playwright's bundled chromium, like attribute-modifier-app-browser.cjs).
//
// Fixture boundaries (must be disclosed in any result): m4b catalogue fixture host (room 'app-hall', registered production
// backend, fixture auth tokens/ownership/lease/cloud); fixture character Ally as the target; the placed creature's mana pool
// is topped up on the room token ONLY IF the Bestiary-default pool cannot pay the authored price (recorded in
// checks.manaFixture) because the Creature Wizard exposes no pool control used here. Nothing else is written outside controls.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.BESTIARY_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External BESTIARY_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture');
const actors = require('../../../server/services/actorConsequences');
const profile = require('../../src/services/sharedConditionProfile'), pure = require('../../src/services/authoredAbility');
process.env.A4_OUTPUT = process.env.A4_OUTPUT || path.join(out, 'producer-helper'); // the shared producer helper module demands its own external output dir at load
const producer = require('./creature-execution-app-browser.cjs');
const fixtureCharacters = require('./m4b-fixture-characters.cjs');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { kind: 'bestiary-agility-app-witness', startedAt: new Date().toISOString(), checks: {}, qualifications: [], errors: [], steps: [],
  limits: ['Identified optimized production App and the registered production backend; provider identity, canonical ownership, room lease and cloud persistence are fixture boundaries.',
    'Temporary room, accepted-live only. No live Firebase, deployment, physical second device or human tabletop session.'] };
const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); save('progress.json', report); };
const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(fn, label, tries = 100) { for (let i = 0; i < tries; i++) { if (await fn()) return; await sleep(200); } throw Error(`Timed out: ${label}`); }
const hall = host => host.room.gameState.maps['app-hall'];
const targetToken = host => hall(host).characterTokens.ally;
const wizard = p => p.locator('.creature-wizard-layout');
const NAME = 'Bestiary Leaden Hex', CREATURE = 'Bestiary Hexkeeper', AMOUNT = -2;

// ── Spell Wizard authoring (copied from attribute-modifier-app-browser.cjs; ordinary controls only) ──────────────────────────
async function openBook(p) {
  await p.locator('.wow-nav-category-header').filter({ hasText: /^Character/ }).first().click();
  await p.locator('.wow-nav-flyout').getByRole('button', { name: /^Spellbook/ }).click(); await book(p).waitFor();
}
async function closeBook(p) { const c = book(p).getByRole('button', { name: 'Close', exact: true }); await c.focus(); await c.press('Enter'); }
async function savedRecord(p, name) {
  await p.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), name);
  return p.evaluate(name => { const k = Object.keys(localStorage).find(k => k.endsWith(':library.spellData')); return JSON.parse(localStorage.getItem(k)).payload.data.spells.find(s => s.name === name); }, name);
}
async function authorAgility(p, name, amount, label) {
  await openBook(p);
  await book(p).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(name); await book(p).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Disposable Bestiary-association witness.');
  await book(p).getByText('Arcane', { exact: true }).click();
  const nav = book(p).getByRole('navigation', { name: 'Spell wizard steps' }); await nav.getByRole('button', { name: /Spell Type$/ }).click();
  await book(p).getByRole('heading', { name: 'ACTION', exact: true }).click(); await book(p).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await nav.getByRole('button', { name: /^3 Effects$/ }).click();
  await book(p).getByRole('heading', { name: 'Control', exact: true }).click();
  await book(p).getByRole('button', { name: /^Use composed effect profile/ }).click();
  await book(p).getByRole('combobox', { name: 'Canonical effect', exact: true }).selectOption('attribute');
  await book(p).getByLabel('Effect name shown on the target', { exact: true }).fill(label);
  await book(p).getByRole('combobox', { name: 'Attribute', exact: true }).selectOption('agility');
  await book(p).getByLabel(/^Change to the score/).fill(String(amount));
  await book(p).getByRole('combobox', { name: 'Expiry', exact: true }).selectOption('gm-manual');
  await book(p).getByLabel('Source-authored duration text', { exact: true }).fill('While the charm holds');
  await book(p).getByLabel('Required GM adjudication note', { exact: true }).fill('Resolve eligibility, range and any save at the table before confirming.');
  await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click(); await book(p).getByText('Single Target', { exact: true }).click(); await book(p).getByText('Ranged', { exact: true }).click();
  const slider = book(p).getByRole('slider').first(); await slider.focus(); await slider.press('Home'); for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
  await book(p).getByText('Enemies', { exact: true }).click(); await book(p).getByText('Any Target', { exact: true }).click();
  await nav.getByRole('button', { name: /Resources$/ }).click(); await book(p).getByTitle('Standard magical energy', { exact: true }).click(); await book(p).getByTitle('Basic action economy', { exact: true }).click();
  const inputs = book(p).getByRole('spinbutton'); await inputs.nth(0).fill('1'); await inputs.nth(0).fill('2'); await inputs.nth(1).fill('1'); await inputs.nth(1).fill('1');
  await p.getByRole('button', { name: '✓ Complete Spell', exact: true }).click();
  const r = await savedRecord(p, name); save(`${name}-saved.json`, r);
  const mapped = pure.definitionFromWizard(r, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' }); assert.equal(mapped.ok, true, JSON.stringify(mapped));
  assert.deepEqual(mapped.definition.effects.condition, { kind: 'attribute', attribute: 'agility', amount, label });
  await closeBook(p); return r;
}

// ── Bestiary (real controls) ─────────────────────────────────────────────────────────────────────────────────────────────────
async function findTemplate(p, name) { return p.evaluate(name => S('creatureStore').getState().creatures.find(c => c.name === name) || null, name); }
async function openTemplateForEdit(p, name) {
  await producer.openBestiary(p);
  await p.locator('.creature-library').getByPlaceholder('Search...', { exact: true }).fill(name);
  await p.locator('.creature-card-wrapper').filter({ hasText: name }).first().click({ button: 'right' }); await p.getByText('Edit', { exact: true }).last().click();
  await wizard(p).getByRole('button', { name: '3 Abilities', exact: true }).click();
}
async function saveWizard(p) { await wizard(p).getByRole('button', { name: '5 Shop Config', exact: true }).click(); await wizard(p).getByRole('button', { name: /^Save Creature/ }).click(); await wizard(p).waitFor({ state: 'detached' }); }
/** The real provider list. Empty ⇒ FAIL with diagnostics; never a fallback. */
async function pickAbility(p, creatureName, spellName) {
  await producer.openBestiary(p); await p.locator('.library-window').getByRole('button', { name: 'Create New', exact: true }).click();
  await wizard(p).locator('#creature-name').fill(creatureName); await wizard(p).getByRole('button', { name: '3 Abilities', exact: true }).click();
  const combo = wizard(p).getByRole('combobox', { name: 'Compatible Spell Library definition', exact: true }); await combo.waitFor({ timeout: 15000 });
  await sleep(1500); // the library provider hydrates after mount
  const options = await combo.locator('option').allTextContents();
  const diagnostics = { options, libraryKeys: await p.evaluate(() => Object.keys(localStorage).filter(k => k.includes('library')).map(k => [k, localStorage.getItem(k).length])),
    savedNameInStorage: await p.evaluate(n => Object.values(localStorage).filter(v => v.includes(n)).length, spellName),
    ambiguousNotice: await wizard(p).getByText(/missing or duplicate IDs/).count() };
  save('creature-wizard-picker-options.json', diagnostics); report.checks.pickerOptions = options;
  if (!options.includes(spellName)) { await p.screenshot({ path: path.join(out, 'picker-empty.png') }).catch(() => {}); throw Error(`PICKER_DID_NOT_LIST_SAVED_ABILITY (investigate this actual failure; no fallback): ${JSON.stringify(diagnostics)}`); }
  await combo.selectOption({ label: spellName });
  await wizard(p).getByText(/Composed effects are edited in Spellbook/).waitFor();
  save('picker-selected.aria.yml', await wizard(p).getByRole('region', { name: 'Creature ability authoring', exact: true }).ariaSnapshot());
  await wizard(p).getByRole('button', { name: 'Keep ability on creature', exact: true }).click();
  await saveWizard(p); await producer.closeLibrary(p);
  const c = await findTemplate(p, creatureName); assert.ok(c?.authoredAbility, 'template must carry the association after Save'); return c;
}
/** Real HTML5 drag from the library card's drag handle to the grid overlay. */
async function dragToGrid(p, creatureName, at) {
  await producer.openBestiary(p);
  await p.locator('.creature-library').getByPlaceholder('Search...', { exact: true }).fill(creatureName);
  const handle = p.locator('.creature-card-wrapper, .creature-card').filter({ hasText: creatureName }).first().locator('.drag-handle-overlay').first();
  await handle.waitFor({ timeout: 15000 });
  await handle.dragTo(p.locator('#grid-overlay'), { targetPosition: at });
}
async function placedTokenFor(p, templateId) {
  return p.evaluate(id => { const t = (S('creatureStore').getState().creatureTokens || []).find(t => t.creatureId === id); return t ? JSON.parse(JSON.stringify(t)) : null; }, templateId);
}

// ── Fixture App setup (copied from attribute-modifier-app-browser.cjs setup; GM role) ───────────────────────────────────────────
async function setup(page, host, uid) {
  if (!page.__init) {
    page.__init = true; page.on('pageerror', e => report.errors.push({ uid, message: e.message }));
    await page.route(/(fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com|googleapis\.com|firebaseio\.com|firebaseapp\.com)/, r => r.fulfill({ status: 200, contentType: r.request().resourceType() === 'stylesheet' ? 'text/css' : 'application/octet-stream', body: '' }));
  }
  await page.goto(host.url + '/game');
  const consent = page.getByRole('dialog', { name: /Analytics.*Privacy Consent/ });
  await consent.waitFor({ timeout: 8000 }).catch(() => {}); if (await consent.count()) await consent.getByRole('button', { name: /Decline/i }).click({ timeout: 20000, force: true }).catch(() => {});
  await page.locator('.action-slot').first().waitFor({ timeout: 60000 });
  await page.waitForFunction(() => Object.keys(window).some(k => k.startsWith('webpackChunk')), null, { timeout: 60000 });
  await page.addScriptTag({ url: host.url + '/integration-io.js' });
  const fixtureCharacter = fixtureCharacters.characters[uid] || null;
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
    const joined = new Promise((resolve, reject) => { __socket.once('room_joined', resolve); __socket.once('room_error', e => reject(Error(JSON.stringify(e)))); });
    __socket.emit('join_room', { roomId: fixture.roomId, playerName: uid, password: '' }); await joined;
    window.__outbound = []; const emit = __socket.emit.bind(__socket); __socket.emit = (event, ...args) => { window.__outbound.push({ event, payload: args[0] }); return emit(event, ...args); };
    S('gameStore').setState({ isInMultiplayer: true, isGMMode: uid === 'app-gm', multiplayerRoom: { id: fixture.roomId }, multiplayerSocket: __socket,
      cameraX: 0, cameraY: 0, zoomLevel: 1, playerZoom: 1, dynamicFogEnabled: false, gridSize: 50, feetPerTile: 5 });
    S('mapStore').setState({ currentMapId: fixture.mapId });
    __actors.registerActorHandlers({ socket: __socket });
    const result = await __actors.refreshActorSnapshot(); if (!result.success) throw Error(JSON.stringify(result));
    return { ok: true, fixtureCharacter: !!fixtureCharacter };
  }, { uid, fixtureCharacter });
}
function patchClick(page) { // animated controls report "not stable" under software rendering; retry the same click with force
  const L = Object.getPrototypeOf(page.locator('body')); if (L.__bestiary) return; L.__bestiary = true; const click = L.click;
  L.click = async function(options = {}) { try { return await click.call(this, { timeout: 15000, ...options }); } catch (e) { if (options.force || !/not stable|intercepts pointer/.test(String(e.message))) throw e; return click.call(this, { ...options, force: true }); } };
}

async function main() {
  const host = await require('./m4b-catalogue-app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_bind', 'token_created', 'token_moved', 'join_room'])
    host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  report.qualifications.push('Fixture target: the room character Ally (m4b fixture). Identity, ownership, lease and cloud are fixtures.');
  const browser = await chromium.launch({ headless: true, ...(process.env.BESTIARY_CHANNEL ? { channel: process.env.BESTIARY_CHANNEL } : {}) });
  const gm = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' }); patchClick(gm);
  try {
    await setup(gm, host, 'app-gm');
    step('Spell Wizard: author and save a −2 Agility ability');
    const record = await authorAgility(gm, NAME, AMOUNT, 'Leaden');
    report.checks.wizard = record.authoredDraft.controlConfig.authoredCondition;

    step('Bestiary: Create New → 3 Abilities → real picker → Keep → Save');
    await setup(gm, host, 'app-gm');
    const template = await pickAbility(gm, CREATURE, NAME);
    assert.deepEqual(template.authoredAbility.record, record, 'the association is the whole saved Spell Wizard record (detached snapshot)');
    assert.equal(template.authoredAbility.librarySpellId, record.id);
    report.checks.association = { templateId: template.id, librarySpellId: template.authoredAbility.librarySpellId, wholeRecordEqual: true };

    step('Reload and reopen the saved template');
    await setup(gm, host, 'app-gm'); await openTemplateForEdit(gm, CREATURE);
    await wizard(gm).getByRole('button', { name: 'Remove activated ability', exact: true }).waitFor(); // association present after reload
    save('reopened-abilities.aria.yml', await wizard(gm).getByRole('region', { name: 'Creature ability authoring', exact: true }).ariaSnapshot());
    await saveWizard(gm); await producer.closeLibrary(gm);
    const reopened = await findTemplate(gm, CREATURE); assert.deepEqual(reopened.authoredAbility.record, record); report.checks.reopened = true;

    step('Place the creature with a real drag from the library card to the grid');
    await dragToGrid(gm, CREATURE, { x: 900, y: 500 });
    await until(async() => !!(await placedTokenFor(gm, template.id)), 'client token created by the drop');
    let token = await placedTokenFor(gm, template.id); assert.deepEqual(token.authoredAbility.record, record, 'placed token deep-copied the association');
    await until(() => Object.values(hall(host).tokens || {}).some(t => t.id === token.id || t.tokenId === token.id) || !!hall(host).tokens?.[token.id], 'token reached the room');
    await producer.closeLibrary(gm);
    const roomToken = hall(host).tokens[token.id];
    const mana = roomToken?.state?.currentMana; report.checks.manaFixture = { before: mana, topped: false };
    if (!(mana >= 2)) { roomToken.state.currentMana = 10; report.checks.manaFixture.topped = true; report.qualifications.push(`Placed creature mana pool (${mana}) could not pay the authored 2 mana; set to 10 on the room token (fixture).`); }
    report.checks.placed = { tokenId: token.id, roomHasAssociation: !!roomToken?.authoredAbility };

    step('Placed Inspect → bind → admit for this creature → Use → GM confirms → Agility −2 on the target');
    await setup(gm, host, 'app-gm');
    const region = await producer.inspectPlaced(gm, token.id); await region.waitFor();
    const bind = region.getByRole('button', { name: 'Bind this placed creature', exact: true }); if (await bind.count()) await bind.click();
    await region.getByRole('button', { name: 'Refresh room admission', exact: true }).click(); await region.getByRole('button', { name: 'Admit for this creature', exact: true }).click();
    await region.getByText(/^Admitted for /).waitFor(); save('placed-admitted.aria.yml', await region.ariaSnapshot());
    await region.getByRole('button', { name: 'Use for this creature', exact: true }).click();
    const d = gm.getByRole('dialog', { name: 'Creature ability action', exact: true }); await d.waitFor();
    await d.getByRole('combobox', { name: 'Creature or primary PC target', exact: true }).selectOption('character:app-hall:ally');
    await d.getByLabel('GM timing note (required)', { exact: true }).fill('GM removes this exact instance by hand');
    await d.getByLabel('Manual resolution evidence (optional)', { exact: true }).fill('PRIVATE bestiary witness ruling');
    await d.getByRole('checkbox', { name: /I resolved eligibility/ }).check();
    save('creature-dialog.txt', await d.innerText());
    await d.getByRole('button', { name: 'Validate successful effect application', exact: true }).click();
    await d.getByRole('checkbox', { name: /I reviewed the retained successful outcome/ }).check();
    const before = actors.clone(hall(host).tokens[token.id].state);
    await d.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    await until(() => targetToken(host).state.conditions.length === 1, 'Leaden installed on the target');
    const cond = targetToken(host).state.conditions[0]; assert.ok(profile.isAttributeModifier(cond)); assert.deepEqual(cond.effects, { agility: AMOUNT });
    const after = hall(host).tokens[token.id].state;
    report.checks.cast = { effects: cond.effects, name: cond.name, paid: { apBefore: before.currentActionPoints, apAfter: after.currentActionPoints, tempApBefore: before.tempActionPoints, tempApAfter: after.tempActionPoints, manaBefore: before.currentMana, manaAfter: after.currentMana } };
    assert.equal(before.currentMana - after.currentMana, 2, 'authored 2 mana paid'); assert.equal((before.currentActionPoints + (before.tempActionPoints || 0)) - (after.currentActionPoints + (after.tempActionPoints || 0)), 1, 'authored 1 AP paid');
    await gm.keyboard.press('Escape').catch(() => {}); await producer.closeInspect(gm).catch(() => {});

    step('SEPARATE CHECK — remove the ability from the template; the placed token keeps its detached copy');
    await setup(gm, host, 'app-gm'); await openTemplateForEdit(gm, CREATURE);
    await wizard(gm).getByRole('button', { name: 'Remove activated ability', exact: true }).click();
    await wizard(gm).getByText(/Creatures already placed keep their own copy/).waitFor();
    await wizard(gm).getByRole('button', { name: 'Confirm removal', exact: true }).click();
    await saveWizard(gm); await producer.closeLibrary(gm);
    const stripped = await findTemplate(gm, CREATURE); assert.equal(stripped.authoredAbility, undefined, 'template has no association after save');
    await setup(gm, host, 'app-gm'); await openTemplateForEdit(gm, CREATURE);
    await wizard(gm).getByRole('button', { name: 'Add activated ability', exact: true }).waitFor(); // reopened: none
    await wizard(gm).getByRole('combobox', { name: 'Compatible Spell Library definition', exact: true }).waitFor();
    await saveWizard(gm); await producer.closeLibrary(gm);
    const afterReload = await findTemplate(gm, CREATURE); assert.equal(afterReload.authoredAbility, undefined, 'removal survives reload');
    token = await placedTokenFor(gm, template.id); assert.deepEqual(token.authoredAbility.record, record, 'placed token (client) keeps its detached copy');
    assert.deepEqual(hall(host).tokens[token.id].authoredAbility.record, record, 'placed token (room) keeps its detached copy');
    const region2 = await producer.inspectPlaced(gm, token.id); await region2.waitFor();
    await region2.getByText(/Detached Spell Library snapshot/).waitFor(); save('placed-after-template-removal.aria.yml', await region2.ariaSnapshot());
    report.checks.templateRemoval = { templateHasAssociation: false, placedClientKeeps: true, placedRoomKeeps: true, placedInspectKeeps: true };
    await producer.closeInspect(gm).catch(() => {});

    for (const [k, p] of Object.entries({ gm })) await p.screenshot({ path: path.join(out, `final-${k}.png`) }).catch(() => {});
    report.passed = report.errors.length === 0;
    if (!report.passed) report.qualifications.push(`Page errors recorded: ${report.errors.length}`);
  } catch (e) {
    report.error = String(e.stack || e); console.error(e);
    save('fail-gm.aria.yml', await gm.locator('body').ariaSnapshot().catch(() => '')); await gm.screenshot({ path: path.join(out, 'fail-gm.png') }).catch(() => {});
  } finally {
    save('result.json', report);
    setTimeout(() => { report.teardown = 'forced-exit-after-20s'; save('result.json', report); process.exit(report.passed ? 0 : 1); }, 20000).unref();
    await browser.close().catch(() => {}); await host.stop().catch(() => {});
  }
  if (!report.passed) process.exit(1);
}
if (require.main === module) main();
