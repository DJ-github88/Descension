// Formula-rider saves — production-App acceptance witness (PREPARED; a pass is claimed only by a recorded run).
// ONE Wizard-authored ability: arcane `2d6 + intelligence/3` (owner-attested effective INT, M4A) + the movement rider "Rime Hobble" −10 ft for
// two target-turn ends, whose authored Constitution DC 12 save negates the rider only. No cooldown (separate interaction). Ordinary App controls:
//   Spell Wizard author (formula + composed effect + save fields) → library save/reopen → GM room admission → Combat Initiator (PC + A + B) →
//   authenticated turn expiry → owner cast 1 (both outcomes, attested INT, creature-only targets; approval spends nothing) → the caster's INT
//   changes (creature A applies an existing −2 Intelligence effect through Creature Inspect) → GM records "Target saves" on the stale cast:
//   refused (owner_reapproval_required), nothing changed → owner reapproval with the SAME retained faces (revalued) → GM records "Target fails"
//   with the ACK and accepted broadcast lost → GM reload → "Check same command": ONE receipt with payment, scaled damage, rider + schedule →
//   owner/observer reload → owner cast 2 while the rider is active, GM records "Target saves": payment + scaled damage only, rider and schedule
//   byte-equal → advance: the rider expires exactly at its own final boundary; HP and payment unchanged.
// The branch is selected only through the GM card's radio control. Expected values are computed here from the roster, the attested score and
// the faces (truth tables, independent of the code under test). Anything outside ordinary controls goes to `qualifications`.
// Run (from vtt-react/verification/p14): FRS_OUTPUT=<abs dir outside repo> APP_BUILD_DIR=<abs identified build>
//   [FRS_MANIFEST=<abs path to the installed manifest>] [FRS_CHANNEL=chrome] node formula-rider-save-app-browser.cjs
/* global S, __socket, __actors, __outbound */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');
const preflight = require('../witness-preflight.cjs');
const PREFLIGHT = require('./formula-rider-save-preflight.cjs');

const out = process.env.FRS_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR || !path.isAbsolute(process.env.APP_BUILD_DIR)) throw Error('Absolute external FRS_OUTPUT and APP_BUILD_DIR required');
const repo = path.resolve(__dirname, '../../..');
if (path.resolve(out).startsWith(repo + path.sep)) throw Error('FRS_OUTPUT must be outside the repository');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture'); process.env.A4_OUTPUT = path.join(out, 'producer');
const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const payments = require('../../../server/services/spellPayments');
const profile = require('../../src/services/sharedConditionProfile');
const pure = require('../../src/services/authoredAbility'), fixtureCharacters = require('./m4b-fixture-characters.cjs');

/** One complete explicit owner record through production characterStore.loadCharacter (the M4B/timed-save approach; no placeholder fields). */
function ownerFixture() {
  const record = JSON.parse(JSON.stringify(fixtureCharacters.characters['app-owner']));
  const stats = { strength: 10, agility: 10, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 };
  return Object.assign(record, { class: 'Arcanoneer', level: 3, stats: { ...stats }, baseStats: { ...stats }, buffs: [], debuffs: [],
    classResource: { type: 'elementalSpheres', spheres: [], current: 0, max: 12 }, class_spells: { known_spells: [] },
    health: { current: 30, max: 40 }, mana: { current: 20, max: 30 }, actionPoints: { current: 5, max: 5 }, tempHealth: 0, tempMana: 0, tempActionPoints: 0 });
}
async function loadOwnerFixture(page) {
  return page.evaluate(async character => {
    const fixture = await fetch('/integration-fixture.json').then(r => r.json());
    const store = S('characterStore'), sleep = ms => new Promise(r => setTimeout(r, ms));
    for (let i = 0; i < 150 && !(store.getState().currentCharacterId && !store.getState().isLoading); i++) await sleep(100);
    for (let stable = 0, last = null; stable < 5;) { const st = store.getState(), key = `${st.currentCharacterId}|${st.characters.length}|${!!st.isLoading}`; stable = key === last ? stable + 1 : 0; last = key; await sleep(100); }
    store.setState({ characters: [character] }); S('gameStore').setState({ isInMultiplayer: false }); store.getState().loadCharacter(character.id); S('gameStore').setState({ isInMultiplayer: true });
    const selected = __actors.selectOwnerAttachment(fixture.refs.pc); if (!selected.success) throw Error(JSON.stringify(selected));
    const st = store.getState(); return { characterId: st.currentCharacterId, name: st.name, class: st.class };
  }, ownerFixture());
}
async function setup(page, url, uid) {
  if (!page.__frsFonts) {
    page.__frsFonts = true; const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    page.goto = async(...args) => { await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {}); await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts); return goto(...args); };
  }
  const result = await baseSetup(page, url, uid);
  if (uid === 'app-owner') { result.hydration = await loadOwnerFixture(page); page.__hydration = result.hydration; }
  return result;
}
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { kind: 'formula-rider-save-app-witness', startedAt: new Date().toISOString(), passed: false, checks: {}, qualifications: [], errors: [], steps: [], stages: {},
  limits: ['Real optimized App and registered backend; identity/provider/ownership/lease/cloud are fixture boundaries (p9 integration host).',
    'Complete deterministic owner record (m4b-fixture-characters app-owner, Arcanoneer 3) loaded through production characterStore.loadCharacter after boot (setup instrumentation only).',
    'Temporary room: accepted-live only. No live Firebase, deployment, physical second device or human tabletop claim.',
    'The save is rolled at the table, not by the VTT; the GM records the outcome. A recorded outcome is not proof that the VTT rolled or validated a save.',
    'Lost delivery is simulated in the GM page (one ACK callback and that GM\'s accepted broadcast dropped); server, writer and recovery path unmodified.',
    'Effective caster scores are owner-attested (sheet aggregation); the server verifies the arithmetic against them, not the sheet derivation (M4A contract).',
    'Public icon/model assets were not part of the build input: some icons may 404.'] };
function patchClick(page) {
  const L = Object.getPrototypeOf(page.locator('body')); if (L.__frs) return; L.__frs = true; const click = L.click;
  L.click = async function(options = {}) { try { return await click.call(this, { timeout: 20000, ...options }); } catch (e) { if (options.force || !/not stable|intercepts pointer/.test(String(e.message))) throw e; return click.call(this, { ...options, force: true }); } };
}
const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); save('progress.json', report); };
const stage = (name, how, detail) => { report.stages[name] = { how, ...(detail ? { detail } : {}) }; };
const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
const ownerDialog = p => p.getByRole('dialog', { name: 'Supported spell cast', exact: true });
const clockUI = p => p.getByRole('region', { name: 'Authenticated turn expiry', exact: true });
const hall = host => host.room.gameState.maps['app-hall'];
const B = host => hall(host).tokens.B;
const PC = host => hall(host).characterTokens.pc;
const hpOf = host => ({ current: B(host).state.currentHp, temp: B(host).state.tempHealth });
const moves = host => B(host).state.conditions.filter(profile.isMovementModifier);
const receipts = host => actors.ledger(host.room).receipts;
const pcPools = host => { const r = actors.resources(PC(host), 'character'); return { ap: r.ap.current + r.ap.temp, mana: r.mana.current + r.mana.temp }; };
const combat = host => host.room.gameState.combat;
const seqNow = host => combat(host).effectLifecycle.sequence;
const current = host => combat(host).turnOrder[combat(host).currentTurnIndex].tokenId;
const schedulesFor = (host, recordId) => Object.values(combat(host)?.effectLifecycle?.schedules || {}).filter(i => i.recordId === recordId);
const cds = host => actors.clone(PC(host).state.authoredCooldowns || {});
const attestedINT = text => { const m = text.match(/Caster effective scores are owner-attested: intelligence (\d+)/); return m ? Number(m[1]) : null; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const wait = async(fn, n = 100) => { for (let i = 0; i < n && !fn(); i++) await sleep(150); return fn(); };
const pendingFor = (host, name) => payments.listAll(host.room).filter(e => e.approval.spell.name === name);
/** Distance in boundaries to the next strictly upcoming turn start of `id` (an ongoing turn is not counted). */
function distance(host, id) { const c = combat(host), R = c.turnOrder.length, i = c.turnOrder.findIndex(e => e.tokenId === id); return ((i - c.currentTurnIndex + R) % R) || R; }
/** Expected final boundary for "end of B's turn, counted `n` times" from the roster only: the end of a turn is the next boundary after its start. */
const expectedCountedEndDue = (host, n) => seqNow(host) + distance(host, 'B') + 1 + (n - 1) * combat(host).turnOrder.length;

async function openBook(p) {
  const role = p.getByRole('button', { name: 'Character', exact: true });
  if (await role.count()) await role.click(); else await p.locator('button', { hasText: /^\s*Character\s*$/ }).first().click();
  const sb = p.getByRole('button', { name: 'Spellbook S', exact: true });
  if (await sb.count()) await sb.click(); else await p.locator('button', { hasText: /Spellbook/ }).first().click();
  await book(p).waitFor();
}
async function closeBook(p) { const b = book(p).getByRole('button', { name: 'Close', exact: true }); await b.focus(); await b.press('Enter'); }
const savedRecord = (p, name) => p.evaluate(name => { const k = Object.keys(localStorage).find(k => k.endsWith(':library.spellData')); return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells.find(s => s.name === name) : null; }, name);
async function common(p, c, description) {
  await openBook(p);
  await book(p).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(c.name);
  await book(p).getByRole('textbox', { name: 'Description * *', exact: true }).fill(description);
  await book(p).getByText('Arcane', { exact: true }).click();
  const nav = book(p).getByRole('navigation', { name: 'Spell wizard steps' });
  await nav.getByRole('button', { name: /Spell Type$/ }).click(); await book(p).getByRole('heading', { name: 'ACTION', exact: true }).click(); await book(p).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await nav.getByRole('button', { name: /^3 Effects$/ }).click();
  return nav;
}
async function targetingAndPrice(p, nav, c) {
  await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click(); await book(p).getByText('Single Target', { exact: true }).click(); await book(p).getByText('Ranged', { exact: true }).click();
  const slider = book(p).getByRole('slider').first(); await slider.focus(); await slider.press('Home'); for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
  await book(p).getByText('Enemies', { exact: true }).click(); await book(p).getByText('Any Target', { exact: true }).click();
  await nav.getByRole('button', { name: /Resources$/ }).click(); await book(p).getByTitle('Standard magical energy', { exact: true }).click(); await book(p).getByTitle('Basic action economy', { exact: true }).click();
  const inputs = book(p).getByRole('spinbutton'); await inputs.nth(0).fill('1'); await inputs.nth(0).fill(String(c.mana)); await inputs.nth(1).fill('1'); await inputs.nth(1).fill(String(c.ap));
}
async function complete(p, c, tag) {
  await p.getByRole('button', { name: '✓ Complete Spell', exact: true }).click({ force: true });
  await p.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), c.name);
  const r = await savedRecord(p, c.name); save(`wizard-saved-${tag}.json`, r); return r;
}
/** Actual Spell Wizard: Damage (M4A attribute formula) + composed movement effect with a counted structured expiry and the rider-local "negates" save. */
async function authorRider(p, c) {
  const nav = await common(p, c, 'Disposable formula-rider save witness: arcane damage scaled by the caster\'s Intelligence; the target is hobbled for two of its turns unless it makes a Constitution save.');
  await book(p).getByRole('heading', { name: 'Damage', exact: true }).click(); await book(p).locator('.damage-effects-container').getByRole('textbox').first().fill(c.formula);
  await book(p).getByRole('heading', { name: 'Control', exact: true }).click();
  await book(p).getByRole('button', { name: /^Use composed effect profile/ }).click();
  const fields = book(p).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
  await fields.getByLabel(/^Canonical effect/).selectOption('movement');
  await fields.getByLabel(/^Effect name shown on the target/).fill(c.label);
  await fields.getByLabel(/^Movement change/).fill(String(c.feet));
  await fields.getByLabel(/^Expiry/).selectOption(c.expiry);
  const count = fields.getByLabel(/^Target-turn (starts|ends) to count/); await count.waitFor(); await count.fill(String(c.occurrences));
  await fields.getByLabel(/The target may save to negate this effect/).check();
  assert.equal(await fields.getByLabel(/^Expiry/).inputValue(), c.expiry, 'ticking the save keeps the structured expiry');
  await fields.getByLabel(/^Saving ability/).selectOption(c.save.ability);
  await fields.getByLabel(/^Difficulty \(DC/).fill(String(c.save.dc));
  report.checks.wizardSaveText = await fields.getByRole('group', { name: 'Saving throw (optional)', exact: true }).innerText();
  await fields.getByLabel(/^Source-authored duration text/).fill(c.duration);
  await fields.getByLabel(/^Required GM adjudication note/).fill('The table rolls the Constitution save; the GM records saved or failed. A failed save hobbles the target for two of its turn ends.');
  await targetingAndPrice(p, nav, c);
  save('wizard-before-complete.aria.yml', await book(p).ariaSnapshot());
  const r = await complete(p, c, 'rider');
  assert.ok(!r.authoredDraft.cooldownConfig || !r.authoredDraft.cooldownConfig.cooldownType || r.authoredDraft.cooldownConfig.cooldownType === 'none', 'no cooldown authored on this route');
  const mapped = pure.definitionFromWizard(r, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' }); assert.equal(mapped.ok, true, JSON.stringify(mapped));
  assert.deepEqual(mapped.definition.effects, { direct: { kind: 'damage', formula: c.formula, damageTypes: ['arcane'] }, condition: { kind: 'movement', feet: c.feet, label: c.label },
    save: { scope: 'condition', ability: c.save.ability, dc: c.save.dc, outcome: 'negates' } });
  assert.equal(mapped.definition.timing.expiryPolicy, c.expiry); assert.equal(mapped.definition.timing.occurrences, c.occurrences); assert.equal(mapped.definition.cooldown, undefined);
  report.checks.definitionSummary = pure.definitionSummary(mapped.definition);
  await closeBook(p); return r;
}
/** Actual Spell Wizard: one existing Intelligence change through the composed-effect profile (the creature's ability that changes the caster's input). */
async function authorAttribute(p, c) {
  const nav = await common(p, c, 'Disposable input-change helper: dulls the target\'s Intelligence until the GM removes it.');
  await book(p).getByRole('heading', { name: 'Control', exact: true }).click();
  await book(p).getByRole('button', { name: /^Use composed effect profile/ }).click();
  await book(p).getByRole('combobox', { name: 'Canonical effect', exact: true }).selectOption('attribute');
  await book(p).getByLabel('Effect name shown on the target', { exact: true }).fill(c.label);
  await book(p).getByRole('combobox', { name: 'Attribute', exact: true }).selectOption('intelligence');
  await book(p).getByLabel(/^Change to the score/).fill(String(c.amount));
  await book(p).getByRole('combobox', { name: 'Expiry', exact: true }).selectOption('gm-manual');
  await book(p).getByLabel('Source-authored duration text', { exact: true }).fill('While the fog lingers');
  await book(p).getByLabel('Required GM adjudication note', { exact: true }).fill('Resolve eligibility, range and any save at the table before confirming.');
  await targetingAndPrice(p, nav, c);
  const r = await complete(p, c, 'attribute');
  const mapped = pure.definitionFromWizard(r, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' }); assert.equal(mapped.ok, true, JSON.stringify(mapped));
  assert.deepEqual(mapped.definition.effects.condition, { kind: 'attribute', attribute: 'intelligence', amount: c.amount, label: c.label });
  await closeBook(p); return r;
}
async function admitForPc(p, name, original) {
  await openBook(p); await book(p).getByRole('button', { name: 'Spell Library', exact: true }).click(); await book(p).getByText(name, { exact: true }).first().click();
  const section = p.getByRole('region', { name: `Room admission for ${name}`, exact: true }); await section.waitFor();
  assert.deepEqual(await savedRecord(p, name), original, 'save/reopen preserved the whole record');
  report.checks.compatibilityText = await p.locator('.spell-detail-overlay').innerText().catch(() => null);
  save('library-reopened.aria.yml', await p.locator('.spell-detail-overlay').ariaSnapshot().catch(() => 'unavailable'));
  await section.getByRole('button', { name: 'Admit this saved version', exact: true }).click(); await section.getByText(/^Admitted for /).waitFor();
  save('admitted.aria.yml', await section.ariaSnapshot());
  await p.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click({ timeout: 3000 }).catch(() => p.keyboard.press('Escape'));
}
async function openCast(owner, name) {
  if (await ownerDialog(owner).count()) { await ownerDialog(owner).getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => {}); await ownerDialog(owner).waitFor({ state: 'detached' }).catch(() => {}); }
  const lib = owner.getByRole('region', { name: 'Admitted abilities', exact: true });
  if (!await lib.count()) await owner.locator('summary').filter({ hasText: /^Admitted abilities$/ }).click();
  await lib.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
  await lib.locator('.p9-admitted-row').filter({ hasText: name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
  const od = ownerDialog(owner); await od.waitFor(); await od.getByRole('heading', { name, exact: true }).waitFor();
  const select = od.getByRole('combobox', { name: 'Target', exact: true });
  const targets = await select.locator('option').allInnerTexts();
  if (await select.isEnabled()) await select.selectOption({ label: 'B · creature · B' });
  return { od, targets };
}
async function recordFaces(od, faces) {
  for (let i = 0; i < faces.length; i++) await od.getByLabel(`d6 face ${i + 1}`, { exact: true }).fill(String(faces[i]));
  await od.getByRole('button', { name: 'Record physical roll', exact: true }).click();
}
const approveButton = od => od.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true });
/** GM card for the pending approval: record the table's outcome with the card's own radio, required note, private evidence, final damage. */
async function gmCard(gm, name, { outcome, final, note, evidence }) {
  const card = gm.locator('.p9-gm-card').filter({ hasText: name }).last(); await card.waitFor();
  const timingNote = card.getByLabel('GM timing clarification (required)', { exact: true }); if (!(await timingNote.inputValue())) await timingNote.fill(note);
  await card.getByRole('textbox', { name: /^Private manual resolution evidence/ }).fill(evidence);
  const confirm = card.getByRole('button', { name: 'Confirm recorded outcome', exact: true });
  const check = card.getByRole('checkbox', { name: /I resolved eligibility, range and immunity, and recorded the table’s save result above/ });
  if (!(await check.isChecked())) await check.check();
  await card.getByLabel(/^Final damage/).fill(String(final));
  // Review F5: every other required input is filled first, so a disabled Confirm here proves it waits for the recorded outcome itself.
  const disabledBefore = await confirm.isDisabled();
  await card.getByRole('radio', { name: outcome }).check(); // the ONLY branch selection: the GM card's own control
  return { card, text: await card.innerText(), confirm, disabledBefore };
}
async function confirmOnce(host, g) {
  const n = receipts(host).length; await g.confirm.click();
  if (await wait(() => receipts(host).length === n + 1, 40)) return { receipt: receipts(host).at(-1) };
  await sleep(500); return { refusal: [...await g.card.getByRole('status').allInnerTexts().catch(() => []), ...await g.card.getByRole('alert').allInnerTexts().catch(() => [])] };
}

async function creatureToken(p, id) {
  await p.waitForFunction(id => Array.from(document.querySelectorAll('.creature-token')).some(el => { let f = el[Object.keys(el).find(k => k.startsWith('__reactFiber'))]; for (; f; f = f.return) if (f.memoizedProps?.tokenId === id) { el.dataset.rfToken = id; return true; } return false; }), id);
  return p.locator(`[data-rf-token="${id}"]`);
}

async function main() {
  const preflightResult = await preflight.run(PREFLIGHT);
  report.preflight = { checks: preflightResult.checks, build: preflightResult.build, server: preflightResult.server };
  const manifest = process.env.FRS_MANIFEST;
  if (manifest) {
    const lines = fs.readFileSync(manifest, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.replace(/^﻿/, '').split(/\s+\*?/));
    report.sourceIdentity = lines.map(([hash, file]) => { const p = path.join(repo, file); const now = fs.existsSync(p) ? sha(fs.readFileSync(p)) : null; return { file, expected: hash, live: now, match: now === hash }; });
    if (report.sourceIdentity.some(e => !e.match)) report.qualifications.push('Live source differs from FRS_MANIFEST for: ' + report.sourceIdentity.filter(e => !e.match).map(e => e.file).join(', ') + '. Record which bytes the identified build captured.');
  } else report.qualifications.push('No FRS_MANIFEST given: candidate source identity was not checked by this run.');
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_bind', 'actor_spell_prepare_creature', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw',
    'actor_recovery', 'actor_turn_boundary', 'combat_started', 'combat_turn_changed', 'combat_ended', 'join_room', 'token_moved']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const pages = {}, contexts = {}, channel = process.env.FRS_CHANNEL;
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner'], ['observer', 'app-observer']]) {
      const dir = path.join(out, 'profiles', role); fs.mkdirSync(dir, { recursive: true });
      const ctx = contexts[role] = await chromium.launchPersistentContext(dir, { ...(channel ? { channel } : {}), headless: true, viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const page = pages[role] = ctx.pages()[0] || await ctx.newPage(); patchClick(page);
      page.on('pageerror', e => { if (!/Failed to fetch|blockedbyclient|Loading chunk/i.test(e.message)) report.errors.push({ role, message: e.message }); });
      await setup(page, host.url, uid);
    }
    const { gm, owner, observer } = pages;
    const spec = { name: 'FRS Mind Hobble', formula: '2d6 + intelligence/3', label: 'Rime Hobble', feet: -10, expiry: 'target-end-count', occurrences: 2, save: { ability: 'constitution', dc: 12 },
      duration: 'until the end of the target\'s second turn', ap: 1, mana: 2 };
    const dull = { name: 'FRS Dulling Fog', label: 'Dulled', amount: -2, ap: 1, mana: 0 };

    step('Wizard author/save/reopen/admit: arcane 2d6 + intelligence/3 + Rime Hobble −10 ft for two target-turn ends; Constitution DC 12 negates Rime Hobble only; no cooldown');
    const record = await authorRider(gm, spec); await admitForPc(gm, spec.name, record); await setup(gm, host.url, 'app-gm');
    const dullRecord = await authorAttribute(gm, dull);
    for (const p of [owner, observer]) await setup(p, host.url, p === owner ? 'app-owner' : 'app-observer');
    report.checks.ownerHydration = owner.__hydration || null;
    stage('author/save/reopen/admit', 'App controls (Spell Wizard damage formula + composed movement effect with counted expiry + save fields, Spell Library, room admission)');

    step('Combat Initiator: select PC, A and B, Begin Combat (3); GM enables authenticated turn expiry');
    // The ordinary Combat Initiator is required; there is deliberately no combat_started fallback (a failure fails the run).
    const nav = gm.locator('[title^="Combat Initiator"]').first();
    if (await nav.count() && await nav.isVisible()) await nav.click(); else { await gm.locator('body').click({ position: { x: 700, y: 500 } }).catch(() => {}); await gm.keyboard.press('x'); }
    const overlay = gm.locator('.combat-selection-window'); await overlay.waitFor({ timeout: 15000 });
    const discovery = overlay.locator('.combatants-discovery-section'); await discovery.waitFor({ timeout: 10000 });
    for (const id of ['#pc', '#A', '#B']) { await discovery.locator('.discovery-item').filter({ hasText: id }).first().click(); await gm.waitForTimeout(200); }
    save('combat-initiator-ready.aria.yml', await overlay.ariaSnapshot());
    await overlay.getByRole('button', { name: /^Begin Combat \(3\)$/ }).click();
    assert.ok(await wait(() => combat(host)?.isActive === true, 60)); stage('combat start', 'App controls (Combat Initiator discovery list + Begin Combat)');
    report.checks.roster = combat(host).turnOrder.map(e => e.tokenId);
    for (const id of ['pc', 'A', 'B']) assert.ok(report.checks.roster.includes(id), `${id} is in the authoritative roster`);
    const closeEditor = () => gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).last().click().catch(() => {});
    await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click(); await clockUI(gm).getByRole('button', { name: 'Enable authenticated turn expiry', exact: true }).click();
    assert.ok(await wait(() => !!combat(host)?.effectLifecycle, 40)); assert.equal(seqNow(host), 0); await closeEditor();
    stage('clock adoption', 'App control (Shared turn expiry → Enable authenticated turn expiry)');
    const advance = async() => { const was = seqNow(host); await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click(); await clockUI(gm).getByRole('button', { name: 'Advance authenticated turn', exact: true }).click();
      assert.ok(await wait(() => seqNow(host) === was + 1, 40), 'one authenticated boundary'); await closeEditor(); return { sequence: seqNow(host), receipt: receipts(host).at(-1) }; };
    if (current(host) === 'B') await advance(); // cast while another actor holds the turn, so B's counted ends are unambiguous
    report.checks.turnAtCast1 = { sequence: seqNow(host), current: current(host) };

    step('owner cast 1: both outcomes, attested INT, creature-only targets; physical 2d6 = 5, 2; approval spends nothing');
    const faces = [5, 2];
    let { od, targets } = await openCast(owner, spec.name);
    report.checks.ownerTargets = targets; assert.ok(!targets.some(t => /· character ·/.test(t)), 'no PC target offered');
    let text = await od.innerText(); report.checks.ownerText1 = text;
    assert.match(text, /Target saves \(Constitution DC 12, GM records\): arcane damage 2d6 \+ intelligence\/3; no Rime Hobble/);
    assert.match(text, /Target fails \(Constitution DC 12, GM records\): arcane damage 2d6 \+ intelligence\/3 \+ Rime Hobble \(movement −10 ft\)/);
    assert.ok(text.includes('You approve both outcomes now'), 'owner approves both outcomes');
    assert.match(text, /PC targets unavailable: /); assert.doesNotMatch(text, /Cooldown ready/, 'no cooldown on this route');
    const INT1 = attestedINT(text); assert.ok(Number.isInteger(INT1), 'the owner sees the attested INT before rolling'); report.checks.attestedINT1 = INT1;
    await recordFaces(od, faces);
    const total1 = faces[0] + faces[1] + Math.floor(INT1 / 3);
    text = await od.innerText(); assert.match(text, new RegExp(`= ${total1}\\b`), 'recorded total = faces + floor(INT/3)');
    save('owner-cast1.aria.yml', await od.ariaSnapshot());
    let mapsBefore = actors.clone(host.room.gameState.maps);
    await approveButton(od).click(); await od.getByText(/Awaiting GM adjudication/).waitFor(); assert.deepEqual(host.room.gameState.maps, mapsBefore, 'approval spends nothing');
    const first = pendingFor(host, spec.name)[0]; assert.ok(first);
    assert.deepEqual(first.approval.rollAttributes, { intelligence: INT1 }); assert.equal(first.approval.roll.total, total1); assert.deepEqual(first.approval.roll.dice, [{ sides: 6, faces }]);
    assert.deepEqual(first.approval.effectTerms.save, { scope: 'condition', ability: 'constitution', dc: 12, outcome: 'negates' });
    stage('owner approval', 'App controls (owner spell panel, physical roll)');

    step('the caster\'s Intelligence changes: GM-controlled creature A applies Dulling Fog (−2 Intelligence, manual expiry) to the PC through Creature Inspect');
    hall(host).tokens.A.authoredAbility = { schemaVersion: 1, record: actors.clone(dullRecord), librarySpellId: null };
    report.qualifications.push('Creature A carries the saved Dulling Fog Wizard record as its authoredAbility through a fixture write on the room token (instead of the Bestiary association UI), as in the formula-rider witnesses; admission, targeting, resolution and confirmation use ordinary Creature Inspect controls.');
    await setup(gm, host.url, 'app-gm');
    const tokenEl = await creatureToken(gm, 'A');
    await tokenEl.click({ button: 'right' }); await gm.getByRole('button', { name: /Token Actions/ }).hover(); await gm.getByText('Inspect', { exact: true }).last().click();
    const abilities = gm.getByRole('button', { name: 'Abilities & Spells', exact: true }).last(); await abilities.focus(); await abilities.press('Enter');
    const region = gm.getByRole('region', { name: 'Creature activated ability', exact: true }); await region.waitFor();
    const bindBtn = region.getByRole('button', { name: 'Bind this placed creature', exact: true }); if (await bindBtn.count()) await bindBtn.click();
    await region.getByRole('button', { name: 'Refresh room admission', exact: true }).click(); await region.getByRole('button', { name: 'Admit for this creature', exact: true }).click();
    await region.getByText(/^Admitted for /).waitFor();
    await region.getByRole('button', { name: 'Use for this creature', exact: true }).click();
    const cdlg = gm.getByRole('dialog', { name: 'Creature ability action', exact: true }); await cdlg.waitFor();
    await cdlg.getByRole('combobox', { name: 'Creature or primary PC target', exact: true }).selectOption('character:app-hall:pc');
    await cdlg.getByLabel('GM timing note (required)', { exact: true }).fill('GM removes this exact instance by hand');
    await cdlg.getByLabel('Manual resolution evidence (optional)', { exact: true }).fill('SECRET-FRS input-change ruling');
    await cdlg.getByRole('checkbox', { name: /I resolved eligibility/ }).check();
    await cdlg.getByRole('button', { name: 'Validate successful effect application', exact: true }).click();
    await cdlg.getByRole('checkbox', { name: /I reviewed the retained successful outcome/ }).check();
    await cdlg.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    assert.ok(await wait(() => PC(host).state.conditions.some(profile.isAttributeModifier), 80), 'Dulled installed on the PC');
    await cdlg.getByRole('button', { name: 'Close creature action', exact: true }).click(); await cdlg.waitFor({ state: 'detached' }).catch(() => {});
    stage('caster input change', 'App controls (Creature Inspect → admit → use → GM confirm) of an existing attribute effect');
    ({ od } = await openCast(owner, spec.name));
    await owner.waitForFunction(n => (document.querySelector('[role="dialog"][aria-label="Supported spell cast"]')?.innerText || '').includes(`owner-attested: intelligence ${n}`), INT1 - 2, { timeout: 30000 });
    const INT2 = INT1 - 2; report.checks.attestedINT2 = INT2;

    step('GM records "Target saves" on the stale cast: refused (owner_reapproval_required); payment, HP, rider and schedules unchanged');
    let g = await gmCard(gm, spec.name, { outcome: /^Target saves/, final: total1, note: 'Range confirmed; CON save made at the table.', evidence: 'SECRET-FRS GM evidence: player rolled 14 vs DC 12' });
    report.checks.gmCardStale = g.text; assert.equal(g.disabledBefore, true, 'Confirm is disabled until a branch is recorded');
    assert.match(g.text, /Owner-attested caster scores: intelligence/);
    mapsBefore = actors.clone(host.room.gameState.maps); const r0 = await confirmOnce(host, g);
    assert.ok(r0.refusal, 'stale cast must not commit on the saved branch'); report.checks.staleRefusal = r0.refusal;
    assert.equal(payments.closedCode(host.room, first.approval.approvalId), 'owner_reapproval_required');
    assert.deepEqual(host.room.gameState.maps, mapsBefore, 'nothing applied or charged');
    stage('changed-input refusal (saved branch)', 'App control (GM card radio + confirm) → server refusal, nothing applied');

    step('owner explicit reapproval with the SAME retained faces; revalued with the fresh attested score; same save terms');
    ({ od } = await openCast(owner, spec.name));
    const review = od.getByRole('button', { name: /Review changed terms before fresh approval|Review changed scores with retained faces/ }).first();
    await review.waitFor({ timeout: 30000 }); report.checks.reviewControl = await review.innerText(); await review.click();
    if (!pendingFor(host, spec.name).some(e => e.approval.approvalId !== first.approval.approvalId)) { const again = approveButton(od); if (await again.count()) await again.click(); }
    assert.ok(await wait(() => pendingFor(host, spec.name).some(e => e.approval.approvalId !== first.approval.approvalId), 80), 'fresh approval registered');
    const fresh = pendingFor(host, spec.name).find(e => e.approval.approvalId !== first.approval.approvalId);
    const total2 = faces[0] + faces[1] + Math.floor(INT2 / 3);
    assert.deepEqual(fresh.approval.roll.dice, [{ sides: 6, faces }], 'retained faces'); assert.deepEqual(fresh.approval.rollAttributes, { intelligence: INT2 });
    assert.equal(fresh.approval.roll.total, total2); assert.deepEqual(fresh.approval.effectTerms, first.approval.effectTerms, 'same save terms and outcomes');
    report.checks.reapproval = { approvalId: fresh.approval.approvalId, faces: fresh.approval.roll.dice[0].faces, rollAttributes: fresh.approval.rollAttributes, total: fresh.approval.roll.total };
    save('owner-reapproved.aria.yml', await od.ariaSnapshot());
    stage('explicit reapproval', 'App control (owner review/approve with retained faces)');

    step('GM records "Target fails" with the ACK and accepted broadcast lost → GM reload → Check same command: ONE receipt with payment, scaled damage, rider + schedule');
    g = await gmCard(gm, spec.name, { outcome: /^Target fails/, final: total2, note: 'Range confirmed; CON save failed at the table.', evidence: 'SECRET-FRS GM evidence: player rolled 7 vs DC 12' });
    report.checks.gmCardFailed = g.text;
    const pc0 = pcPools(host), hp0 = hpOf(host), riderDue = expectedCountedEndDue(host, spec.occurrences);
    await gm.evaluate(() => { const emit = __socket.emit.bind(__socket); let drop = true; window.__frsDrop = true;
      __socket.emit = (e, ...args) => { if (drop && e === 'actor_consequence' && String(args[0]?.adjudication?.definitionVersionOrHash).startsWith('authored-effect:v1/') && typeof args[args.length - 1] === 'function') { drop = false; args[args.length - 1] = () => {}; } return emit(e, ...args); };
      const onevent = __socket.onevent.bind(__socket); __socket.onevent = packet => { if (window.__frsDrop && packet?.data?.[0] === 'actor_consequence_accepted' && String(packet?.data?.[1]?.receipt?.adjudication?.definitionVersionOrHash).startsWith('authored-effect:v1/')) { window.__frsDrop = false; return; } return onevent(packet); }; });
    const n = receipts(host).length; await g.confirm.click(); assert.ok(await wait(() => receipts(host).length === n + 1), 'accepted once by the server');
    const receipt1 = receipts(host).at(-1), after1 = actors.clone(host.room.gameState.maps);
    const original = await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload);
    await gm.reload(); await setup(gm, host.url, 'app-gm');
    const scoped = gm.locator('.p9-gm-card').filter({ hasText: spec.name }).getByRole('button', { name: 'Check same command', exact: true });
    const check = await scoped.count().catch(() => 0) ? scoped.first() : gm.getByRole('button', { name: 'Check same command', exact: true }).first();
    await check.waitFor({ timeout: 35000 }); await check.click(); await gm.getByText(/Accepted · /).first().waitFor({ timeout: 35000 });
    assert.deepEqual(await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload), original, 'the exact original command was re-sent');
    assert.equal(receipts(host).filter(r => r.commandId === original.commandId).length, 1, 'one receipt'); assert.deepEqual(host.room.gameState.maps, after1, 'recovery applied nothing twice');
    let chosen = JSON.parse(receipt1.adjudication.chosenResult);
    assert.deepEqual([chosen.branch, chosen.conditionApplied], ['failed', true]); assert.deepEqual(chosen.roll.dice, [{ sides: 6, faces }]);
    assert.deepEqual(pcPools(host), { ap: pc0.ap - spec.ap, mana: pc0.mana - spec.mana }, 'paid once');
    assert.deepEqual(hpOf(host), { current: hp0.current - (total2 - Math.min(total2, hp0.temp)), temp: Math.max(0, hp0.temp - total2) }, 'scaled damage temp-first');
    assert.equal(moves(host).length, 1, 'one Rime Hobble rider'); const rider = moves(host)[0];
    const sched = schedulesFor(host, rider.recordId); assert.equal(sched.length, 1); assert.equal(sched[0].dueSequence, riderDue, 'schedule = B\'s second turn end');
    assert.deepEqual(cds(host), {}, 'no cooldown on this route');
    report.checks.failed = { commandId: receipt1.commandId, total: total2, hpBefore: hp0, hpAfter: hpOf(host), poolsBefore: pc0, poolsAfter: pcPools(host), riderDue, publicReceipt: actors.publicReceipt(receipt1) };
    stage('failed outcome + lost-ACK recovery', 'App controls (GM card radio + confirm; GM reload; Check same command); payment, scaled HP, rider and schedule in one receipt');

    step('owner and observer reload: the rider is read from the authoritative room; no private evidence reaches the observer');
    await owner.reload(); await setup(owner, host.url, 'app-owner'); await observer.reload(); await setup(observer, host.url, 'app-observer');
    const obs = await observer.evaluate(() => (S('creatureStore').getState().creatureTokens.find(t => t.id === 'B')?.state?.conditions || []).map(r => r.recordId));
    assert.deepEqual(obs, B(host).state.conditions.map(r => r.recordId)); assert.ok(!JSON.stringify(await observer.evaluate(() => S('creatureStore').getState().creatureTokens)).includes('SECRET-FRS'));
    stage('reload', 'App reload (owner, observer)');

    step('owner cast 2 while Rime Hobble is active; GM records "Target saves": payment + scaled damage only; rider and schedule byte-equal');
    ({ od } = await openCast(owner, spec.name)); text = await od.innerText();
    assert.equal(attestedINT(text), INT2, 'the owner sees the current attested INT');
    await recordFaces(od, [3, 4]);
    await approveButton(od).click(); await od.getByText(/Awaiting GM adjudication/).waitFor();
    const second = pendingFor(host, spec.name).at(-1), total3 = second.approval.roll.total;
    report.checks.secondRoll = second.approval.roll;
    assert.equal(total3, second.approval.roll.dice[0].faces.reduce((a, b) => a + b, 0) + Math.floor(INT2 / 3), 'total = faces + floor(INT/3)');
    if (JSON.stringify(second.approval.roll.dice[0].faces) !== JSON.stringify([3, 4])) report.qualifications.push(`The second cast used retained faces ${JSON.stringify(second.approval.roll.dice[0].faces)} (existing rule), not the newly entered [3, 4].`);
    g = await gmCard(gm, spec.name, { outcome: /^Target saves/, final: total3, note: 'Range confirmed; CON save made at the table.', evidence: 'SECRET-FRS GM evidence: player rolled 15 vs DC 12' });
    const held = { conditions: JSON.stringify(B(host).state.conditions), schedules: JSON.stringify(combat(host).effectLifecycle.schedules) }, hp2 = hpOf(host), pc2 = pcPools(host);
    const r2 = await confirmOnce(host, g); assert.ok(r2.receipt, JSON.stringify(r2));
    chosen = JSON.parse(r2.receipt.adjudication.chosenResult); assert.deepEqual([chosen.branch, chosen.conditionApplied, chosen.combination], ['saved', false, undefined], 'no hidden refresh on the saved branch');
    assert.equal(JSON.stringify(B(host).state.conditions), held.conditions, 'earlier rider untouched'); assert.equal(JSON.stringify(combat(host).effectLifecycle.schedules), held.schedules, 'its schedule untouched');
    assert.deepEqual(hpOf(host), { current: hp2.current - (total3 - Math.min(total3, hp2.temp)), temp: Math.max(0, hp2.temp - total3) }); assert.deepEqual(pcPools(host), { ap: pc2.ap - spec.ap, mana: pc2.mana - spec.mana });
    await owner.getByText(/Accepted · /).first().waitFor({ timeout: 20000 }); report.checks.ownerStatusSaved = await owner.getByText(/Accepted · /).first().innerText();
    report.checks.saved = { commandId: r2.receipt.commandId, total: total3, publicReceipt: actors.publicReceipt(r2.receipt) };
    stage('saved outcome with an earlier rider', 'App controls (owner panel + GM card radio + confirm); payment and scaled HP; rider/schedule byte-equal');

    step(`advance: Rime Hobble expires exactly at ${riderDue}; HP and payment unchanged`);
    const kept = { hp: hpOf(host), pools: pcPools(host) };
    while (seqNow(host) < riderDue) {
      const s = await advance(), expired = JSON.parse(s.receipt.adjudication.chosenResult).expired || [];
      if (s.sequence < riderDue) assert.equal(moves(host).length, 1, `rider survives ${s.sequence}`);
      else { assert.deepEqual(expired, [rider.recordId], 'exactly Rime Hobble expires at its own boundary'); assert.equal(moves(host).length, 0); report.checks.expiry = actors.publicReceipt(s.receipt); }
    }
    assert.equal(schedulesFor(host, rider.recordId).length, 0); assert.deepEqual({ hp: hpOf(host), pools: pcPools(host) }, kept, 'expiry undoes neither HP nor payment');
    stage('exact expiry', 'App control (Advance authenticated turn)', { riderDue });

    step('privacy: observer snapshot and public receipts carry no private GM evidence');
    const observerView = await observer.evaluate(roomId => new Promise(res => __socket.emit('actor_snapshot', { roomId }, r => res(JSON.stringify(r)))), host.room.id);
    assert.equal(observerView.includes('SECRET-FRS'), false); assert.ok(!JSON.stringify(receipts(host).map(x => actors.publicReceipt(x))).includes('SECRET-FRS'));
    assert.deepEqual(report.errors, [], `page errors: ${JSON.stringify(report.errors)}`);
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }]) { await owner.setViewportSize(viewport); await owner.screenshot({ path: path.join(out, `owner-final-${viewport.width}.png`) }); }
    report.passed = true;
  } catch (e) {
    report.failure = e.stack;
    for (const [role, p] of Object.entries(pages)) { save(`failure-${role}.aria.yml`, await p.locator('body').ariaSnapshot().catch(() => 'unavailable')); await p.screenshot({ path: path.join(out, `failure-${role}.png`) }).catch(() => {}); }
    throw e;
  } finally {
    report.endedAt = new Date().toISOString(); report.build = process.env.APP_BUILD_DIR;
    const am = path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json'); report.buildAssetManifestSha256 = fs.existsSync(am) ? sha(fs.readFileSync(am)) : null;
    report.witnessSha256 = sha(fs.readFileSync(__filename));
    report.receipts = actors.ledger(host.room).receipts.map(r => actors.publicReceipt(r));
    save('result.json', report); for (const c of Object.values(contexts)) await c.close().catch(() => {}); await host.stop();
  }
}
if (require.main === module) main().then(() => process.exit(0), e => {
  if (e && e.name === 'PreflightError') preflight.printFailure(e); else console.error(e);
  process.exit(e && Number.isInteger(e.exitCode) ? e.exitCode : 1);
});
module.exports = { main };
