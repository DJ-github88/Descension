// Formula riders — production-App acceptance witness (a pass is claimed only by a recorded run).
// ONE Wizard-authored ability: immediate arcane damage `2d6 + intelligence/3` (owner-attested effective INT) + the existing movement
// rider "Mired" −10 ft until the end of the target's next turn. Ordinary App controls throughout:
//   Spell Wizard author → library save/reopen → GM room admission → Combat Initiator (PC + A + B) → authenticated turn expiry →
//   owner cast (physical 2d6, attested INT shown, creature-only targets) + approval (nothing spent) →
//   the caster's INT changes (GM-controlled creature A applies an existing −2 Intelligence effect to the PC through Creature Inspect) →
//   GM confirm refused (owner_reapproval_required, nothing changed) → owner explicit reapproval with the SAME retained faces (revalued) →
//   GM confirm with the ACK and accepted broadcast lost → GM reload → "Check same command": one receipt with payment, HP and rider →
//   owner/observer reload → authenticated advances: the rider expires exactly at its boundary; HP and payment unchanged →
//   second cast → GM removes the rider in the shared condition editor; HP and payment unchanged.
// Expected values are computed here from the roster, the attested score and the faces (independent of the code under test).
// Anything done outside ordinary controls is pushed to `qualifications` and never counted as an App-path pass.
// Run (from vtt-react/verification/p14): RF_OUTPUT=<abs dir outside repo> APP_BUILD_DIR=<abs identified build> node rider-formula-app-browser.cjs
/* global S, __socket, __actors, __outbound */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.RF_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR || !path.isAbsolute(process.env.APP_BUILD_DIR)) throw Error('Absolute external RF_OUTPUT and APP_BUILD_DIR required');
const repo = path.resolve(__dirname, '../../..');
if (path.resolve(out).startsWith(repo + path.sep)) throw Error('RF_OUTPUT must be outside the repository');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture'); process.env.A4_OUTPUT = path.join(out, 'producer');
const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const payments = require('../../../server/services/spellPayments');
const profile = require('../../src/services/sharedConditionProfile');
const timing = require('../../src/services/sharedEffectTiming');
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
    const st = store.getState(); return { characterId: st.currentCharacterId, name: st.name, class: st.class, race: st.race, subrace: st.subrace, statsModel: st.statsModel, storedINT: st.stats?.intelligence };
  }, ownerFixture());
}
async function setup(page, url, uid) {
  if (!page.__rfFonts) {
    page.__rfFonts = true; const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    page.goto = async(...args) => { await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {}); await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts); return goto(...args); };
  }
  const result = await baseSetup(page, url, uid);
  if (uid === 'app-owner') { result.hydration = await loadOwnerFixture(page); page.__hydration = result.hydration; }
  return result;
}
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { kind: 'rider-formula-app-witness', startedAt: new Date().toISOString(), passed: false, checks: {}, qualifications: [], errors: [], steps: [], stages: {},
  limits: ['Real optimized App and registered backend; identity/provider/ownership/lease/cloud are fixture boundaries (p9 integration host).',
    'Complete deterministic owner record (m4b-fixture-characters app-owner, Arcanoneer 3, stored INT 16) loaded through production characterStore.loadCharacter after boot (setup instrumentation only).',
    'Temporary room: accepted-live only. No live Firebase, deployment, physical second device or human tabletop claim.',
    'Effective caster scores are owner-attested (sheet aggregation); the server verifies the arithmetic against them, not the sheet derivation (M4A contract).',
    'Lost delivery is simulated in the GM page (one ACK callback and that GM\'s accepted broadcast dropped); server, writer and recovery path unmodified.',
    'Public icon/model assets were not part of the build input: some icons may 404.'] };
function patchClick(page) {
  const L = Object.getPrototypeOf(page.locator('body')); if (L.__rf) return; L.__rf = true; const click = L.click;
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
const sleep = ms => new Promise(r => setTimeout(r, ms));
const wait = async(fn, n = 100) => { for (let i = 0; i < n && !fn(); i++) await sleep(150); return fn(); };
const pendingFor = (host, name) => payments.listAll(host.room).filter(e => e.approval.spell.name === name);
/** Expected final boundary for "end of the target's next turn", from the roster only (truth table, not the code under test). */
function expectedEndDue(host) {
  const c = combat(host), R = c.turnOrder.length, t = c.turnOrder.findIndex(e => e.tokenId === 'B'), d = ((t - c.currentTurnIndex + R) % R) || R;
  return seqNow(host) + d + 1;
}

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
/** Actual Spell Wizard: Damage (M4A attribute formula) + composed movement effect with a structured expiry. */
async function authorRider(p, c) {
  const nav = await common(p, c, 'Disposable formula-rider witness: arcane damage scaled by the caster\'s Intelligence; the target is mired until the end of its next turn.');
  await book(p).getByRole('heading', { name: 'Damage', exact: true }).click();
  const field = book(p).locator('.damage-effects-container').getByRole('textbox').first(); await field.fill(c.formula);
  report.checks.wizardFormulaHelp = await book(p).getByText(/Prism formula execution/).first().innerText().catch(() => null);
  await book(p).getByRole('heading', { name: 'Control', exact: true }).click();
  await book(p).getByRole('button', { name: /^Use composed effect profile/ }).click();
  const fields = book(p).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
  await fields.getByLabel(/^Canonical effect/).selectOption('movement');
  await fields.getByLabel(/^Effect name shown on the target/).fill(c.label);
  await fields.getByLabel(/^Movement change/).fill(String(c.feet));
  await fields.getByLabel(/^Expiry/).selectOption(c.expiry);
  await fields.getByLabel(/^Source-authored duration text/).fill(c.duration);
  await fields.getByLabel(/^Required GM adjudication note/).fill('GM resolves eligibility and range at the table before confirming.');
  await targetingAndPrice(p, nav, c);
  save('wizard-before-complete.aria.yml', await book(p).ariaSnapshot());
  const r = await complete(p, c, 'rider');
  const mapped = pure.definitionFromWizard(r, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' }); assert.equal(mapped.ok, true, JSON.stringify(mapped));
  assert.deepEqual(mapped.definition.effects, { direct: { kind: 'damage', formula: c.formula, damageTypes: ['arcane'] }, condition: { kind: 'movement', feet: c.feet, label: c.label } });
  assert.equal(mapped.definition.timing.expiryPolicy, c.expiry); assert.equal(Object.hasOwn(mapped.definition, 'cooldown'), false);
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
  await openBook(p); await book(p).getByRole('button', { name: 'Spell Library', exact: true }).click(); await book(p).getByText(name, { exact: true }).click();
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
const attestedINT = text => { const m = text.match(/Caster effective scores are owner-attested: intelligence (\d+)/); return m ? Number(m[1]) : null; };
/** GM card for the pending approval: required timing note, private evidence, eligibility check and the final damage. */
async function gmCard(gm, name, final) {
  const card = gm.locator('.p9-gm-card').filter({ hasText: name }).last(); await card.waitFor();
  const note = card.getByLabel('GM timing clarification (required)', { exact: true }); if (!(await note.inputValue())) await note.fill('Table ruling: in range, no save.');
  const evidence = card.getByLabel('Private manual resolution evidence', { exact: true }); if (await evidence.count()) await evidence.fill('SECRET-RF GM evidence: range 25 ft');
  const check = card.getByRole('checkbox', { name: /I resolved eligibility/ }); if (!(await check.isChecked())) await check.check();
  if (final !== undefined) await card.getByLabel(/^Final damage/).fill(String(final));
  return { card, text: await card.innerText(), confirm: card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }) };
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
/** Shared condition editor for B (Party HUD → exact room attachment → Edit selected shared conditions). */
async function editor(p, id = 'B') {
  const controls = p.getByRole('region', { name: 'Actor attachment and consequences', exact: true });
  await controls.getByRole('combobox', { name: 'Exact room attachment', exact: true }).selectOption(`creature:${id}`);
  await controls.getByRole('button', { name: 'Edit selected shared conditions', exact: true }).click();
  const dialog = p.getByRole('dialog', { name: 'Edit selected shared conditions editor', exact: true }); await dialog.waitFor();
  return { dialog, close: async() => { await dialog.getByRole('button', { name: 'Close shared condition editor', exact: true }).click(); await dialog.waitFor({ state: 'detached' }).catch(() => {}); } };
}

async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_bind', 'actor_spell_prepare_creature', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw',
    'actor_recovery', 'actor_turn_boundary', 'combat_started', 'combat_turn_changed', 'combat_ended', 'join_room', 'token_moved']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const pages = {}, contexts = {}, channel = process.env.RF_CHANNEL;
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner'], ['observer', 'app-observer']]) {
      const dir = path.join(out, 'profiles', role); fs.mkdirSync(dir, { recursive: true });
      const ctx = contexts[role] = await chromium.launchPersistentContext(dir, { ...(channel ? { channel } : {}), headless: true, viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const page = pages[role] = ctx.pages()[0] || await ctx.newPage(); patchClick(page);
      page.on('pageerror', e => { if (!/Failed to fetch|blockedbyclient|Loading chunk/i.test(e.message)) report.errors.push({ role, message: e.message }); });
      await setup(page, host.url, uid);
    }
    const { gm, owner, observer } = pages;
    const spec = { name: 'FR Mind Lash', formula: '2d6 + intelligence/3', label: 'Mired', feet: -10, expiry: 'target-next-end', duration: 'until the end of the target\'s next turn', ap: 1, mana: 2 };
    const dull = { name: 'FR Dulling Fog', label: 'Dulled', amount: -2, ap: 1, mana: 0 };

    step('Wizard author/save/reopen/admit: arcane 2d6 + intelligence/3 + Mired −10 ft until the end of the target\'s next turn (no cooldown, no save)');
    const record = await authorRider(gm, spec); await admitForPc(gm, spec.name, record); await setup(gm, host.url, 'app-gm');
    const dullRecord = await authorAttribute(gm, dull);
    for (const p of [owner, observer]) await setup(p, host.url, p === owner ? 'app-owner' : 'app-observer');
    report.checks.ownerHydration = owner.__hydration || null;
    stage('author/save/reopen/admit', 'App controls (Spell Wizard damage formula + composed movement effect, Spell Library, room admission)');

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
      assert.ok(await wait(() => seqNow(host) === was + 1, 40), 'one authenticated boundary'); await closeEditor(); return seqNow(host); };
    if (current(host) === 'B') await advance(); // cast while another actor holds the turn, so the end of B's NEXT turn is unambiguous
    report.checks.turnAtCast = { sequence: seqNow(host), current: current(host) };

    step('owner cast 1: attested INT shown, creature-only targets with the reason, physical 2d6 = 5, 2; approval spends nothing');
    const faces = [5, 2];
    let { od, targets } = await openCast(owner, spec.name);
    report.checks.ownerTargets = targets; assert.ok(!targets.some(t => /· character ·/.test(t)), 'no PC target offered for a formula rider');
    let text = await od.innerText(); report.checks.ownerTextBefore = text;
    assert.match(text, /PC targets unavailable: an attribute-scaled immediate part with an effect applies to one placed creature only/);
    const INT1 = attestedINT(text); assert.ok(Number.isInteger(INT1), 'the owner sees the attested INT before rolling'); report.checks.attestedINT1 = INT1;
    await recordFaces(od, faces);
    const total1 = faces[0] + faces[1] + Math.floor(INT1 / 3);
    text = await od.innerText(); assert.match(text, new RegExp(`= ${total1}\\b`), 'recorded total = faces + floor(INT/3)');
    save('owner-cast1.aria.yml', await od.ariaSnapshot());
    let mapsBefore = actors.clone(host.room.gameState.maps);
    await approveButton(od).click(); await od.getByText(/Awaiting GM adjudication/).waitFor(); assert.deepEqual(host.room.gameState.maps, mapsBefore, 'approval spends nothing');
    const first = pendingFor(host, spec.name)[0]; assert.ok(first);
    assert.deepEqual(first.approval.rollAttributes, { intelligence: INT1 }); assert.equal(first.approval.roll.constant, Math.floor(INT1 / 3)); assert.equal(first.approval.roll.total, total1);
    assert.deepEqual(first.approval.roll.dice, [{ sides: 6, faces }]);
    report.checks.firstApproval = { approvalId: first.approval.approvalId, rollAttributes: first.approval.rollAttributes, roll: first.approval.roll, formulaSourceRevision: first.approval.formulaSourceRevision };
    stage('owner approval', 'App controls (owner spell panel, physical roll)');

    step('the caster\'s Intelligence changes: GM-controlled creature A applies Dulling Fog (−2 Intelligence, hostile, manual expiry) to the PC through Creature Inspect');
    hall(host).tokens.A.authoredAbility = { schemaVersion: 1, record: actors.clone(dullRecord), librarySpellId: null };
    report.qualifications.push('Creature A carries the saved Dulling Fog Wizard record as its authoredAbility through a fixture write on the room token (instead of the Bestiary association UI), as in the attribute-family witnesses; admission, targeting, resolution and confirmation use ordinary Creature Inspect controls.');
    await setup(gm, host.url, 'app-gm');
    const tokenEl = await creatureToken(gm, 'A');
    await tokenEl.click({ button: 'right' }); await gm.getByRole('button', { name: /Token Actions/ }).hover(); await gm.getByText('Inspect', { exact: true }).last().click();
    const abilities = gm.getByRole('button', { name: 'Abilities & Spells', exact: true }).last(); await abilities.focus(); await abilities.press('Enter');
    const region = gm.getByRole('region', { name: 'Creature activated ability', exact: true }); await region.waitFor();
    const bindBtn = region.getByRole('button', { name: 'Bind this placed creature', exact: true }); if (await bindBtn.count()) await bindBtn.click();
    await region.getByRole('button', { name: 'Refresh room admission', exact: true }).click(); await region.getByRole('button', { name: 'Admit for this creature', exact: true }).click();
    await region.getByText(/^Admitted for /).waitFor();
    await region.getByRole('button', { name: 'Use for this creature', exact: true }).click();
    const cd = gm.getByRole('dialog', { name: 'Creature ability action', exact: true }); await cd.waitFor();
    await cd.getByRole('combobox', { name: 'Creature or primary PC target', exact: true }).selectOption('character:app-hall:pc');
    await cd.getByLabel('GM timing note (required)', { exact: true }).fill('GM removes this exact instance by hand');
    await cd.getByLabel('Manual resolution evidence (optional)', { exact: true }).fill('PRIVATE input-change ruling');
    await cd.getByRole('checkbox', { name: /I resolved eligibility/ }).check();
    await cd.getByRole('button', { name: 'Validate successful effect application', exact: true }).click();
    await cd.getByRole('checkbox', { name: /I reviewed the retained successful outcome/ }).check();
    await cd.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    assert.ok(await wait(() => PC(host).state.conditions.some(profile.isAttributeModifier), 80), 'Dulled installed on the PC');
    await cd.getByRole('button', { name: 'Close creature action', exact: true }).click(); await cd.waitFor({ state: 'detached' }).catch(() => {});
    stage('caster input change', 'App controls (Creature Inspect → admit → use → GM confirm) of an existing attribute effect');
    ({ od } = await openCast(owner, spec.name));
    await owner.waitForFunction(n => (document.querySelector('[role="dialog"][aria-label="Supported spell cast"]')?.innerText || '').includes(`owner-attested: intelligence ${n}`), INT1 - 2, { timeout: 30000 });
    report.checks.attestedINT2 = INT1 - 2;

    step('GM confirms the stale cast: refused (owner_reapproval_required); payment, HP, rider and schedule unchanged');
    let g = await gmCard(gm, spec.name, total1); report.checks.gmCardStale = g.text;
    assert.match(g.text, /Owner-attested caster scores: intelligence/);
    mapsBefore = actors.clone(host.room.gameState.maps); const r0 = await confirmOnce(host, g);
    assert.ok(r0.refusal, 'stale cast must not commit'); report.checks.staleRefusal = r0.refusal;
    assert.equal(payments.closedCode(host.room, first.approval.approvalId), 'owner_reapproval_required');
    assert.deepEqual(host.room.gameState.maps, mapsBefore, 'nothing applied or charged');
    stage('changed-input refusal', 'App control (GM confirm) → server refusal, nothing applied');

    step('owner explicit reapproval with the SAME retained faces; the immediate part is revalued with the fresh attested score');
    ({ od } = await openCast(owner, spec.name));
    const review = od.getByRole('button', { name: /Review changed terms before fresh approval|Review changed scores with retained faces/ }).first();
    await review.waitFor({ timeout: 30000 }); report.checks.reviewControl = await review.innerText(); await review.click();
    if (!pendingFor(host, spec.name).some(e => e.approval.approvalId !== first.approval.approvalId)) {
      const again = approveButton(od); if (await again.count()) await again.click();
    }
    assert.ok(await wait(() => pendingFor(host, spec.name).some(e => e.approval.approvalId !== first.approval.approvalId), 80), 'fresh approval registered');
    const fresh = pendingFor(host, spec.name).find(e => e.approval.approvalId !== first.approval.approvalId);
    const total2 = faces[0] + faces[1] + Math.floor((INT1 - 2) / 3);
    assert.deepEqual(fresh.approval.roll.dice, [{ sides: 6, faces }], 'retained faces'); assert.deepEqual(fresh.approval.rollAttributes, { intelligence: INT1 - 2 });
    assert.equal(fresh.approval.roll.total, total2);
    report.checks.reapproval = { approvalId: fresh.approval.approvalId, faces: fresh.approval.roll.dice[0].faces, rollAttributes: fresh.approval.rollAttributes, total: fresh.approval.roll.total };
    save('owner-reapproved.aria.yml', await od.ariaSnapshot());
    stage('explicit reapproval', 'App control (owner review/approve with retained faces)');

    step('GM confirms the reapproved cast with the ACK and accepted broadcast lost → GM reload → Check same command: one receipt');
    g = await gmCard(gm, spec.name, total2); report.checks.gmCard = g.text;
    const pc0 = pcPools(host), hp0 = hpOf(host), dueEnd = expectedEndDue(host);
    await gm.evaluate(() => { const emit = __socket.emit.bind(__socket); let drop = true; window.__rfDrop = true;
      __socket.emit = (e, ...args) => { if (drop && e === 'actor_consequence' && String(args[0]?.adjudication?.definitionVersionOrHash).startsWith('authored-effect:v1/') && typeof args[args.length - 1] === 'function') { drop = false; args[args.length - 1] = () => {}; } return emit(e, ...args); };
      const onevent = __socket.onevent.bind(__socket); __socket.onevent = packet => { if (window.__rfDrop && packet?.data?.[0] === 'actor_consequence_accepted' && String(packet?.data?.[1]?.receipt?.adjudication?.definitionVersionOrHash).startsWith('authored-effect:v1/')) { window.__rfDrop = false; return; } return onevent(packet); }; });
    const n = receipts(host).length; await g.confirm.click(); assert.ok(await wait(() => receipts(host).length === n + 1), 'accepted once by the server');
    const receipt = receipts(host).at(-1), after = actors.clone(host.room.gameState.maps);
    const original = await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload);
    await gm.reload(); await setup(gm, host.url, 'app-gm');
    const scoped = gm.locator('.p9-gm-card').filter({ hasText: spec.name }).getByRole('button', { name: 'Check same command', exact: true });
    const check = await scoped.count().catch(() => 0) ? scoped.first() : gm.getByRole('button', { name: 'Check same command', exact: true }).first();
    await check.waitFor({ timeout: 35000 }); await check.click(); await gm.getByText(/Accepted · /).first().waitFor({ timeout: 35000 });
    assert.deepEqual(await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload), original, 'the exact original command was re-sent');
    assert.equal(receipts(host).filter(r => r.commandId === original.commandId).length, 1, 'one receipt'); assert.deepEqual(host.room.gameState.maps, after, 'recovery applied nothing twice');
    const chosen = JSON.parse(receipt.adjudication.chosenResult);
    assert.deepEqual(pcPools(host), { ap: pc0.ap - spec.ap, mana: pc0.mana - spec.mana }, 'paid once');
    assert.deepEqual(hpOf(host), { current: hp0.current - (total2 - Math.min(total2, hp0.temp)), temp: Math.max(0, hp0.temp - total2) }, 'immediate damage temp-first');
    assert.equal(moves(host).length, 1, 'one Mired rider'); assert.equal(chosen.combination.outcome, 'added');
    const rider = moves(host)[0]; assert.equal(timing.scheduleFor(rider, combat(host)).dueSequence, dueEnd, 'rider ends at the end of B\'s next turn');
    report.checks.cast = { commandId: receipt.commandId, total: total2, hpBefore: hp0, hpAfter: hpOf(host), poolsBefore: pc0, poolsAfter: pcPools(host), riderDue: dueEnd, publicReceipt: actors.publicReceipt(receipt) };
    stage('cast + lost-ACK recovery', 'App controls (GM card confirm; GM reload; Check same command); payment, HP and rider in one receipt');

    step('owner and observer reload: the accepted outcome and the rider are visible; no private evidence reaches the observer');
    await owner.reload(); await setup(owner, host.url, 'app-owner'); await observer.reload(); await setup(observer, host.url, 'app-observer');
    const obs = await observer.evaluate(() => (S('creatureStore').getState().creatureTokens.find(t => t.id === 'B')?.state?.conditions || []).map(r => r.recordId));
    assert.deepEqual(obs, B(host).state.conditions.map(r => r.recordId)); assert.ok(!JSON.stringify(await observer.evaluate(() => S('creatureStore').getState().creatureTokens)).includes('SECRET-RF'));
    stage('reload', 'App reload (owner, observer)');

    step('authenticated advances: Mired expires exactly at its boundary; HP and payment unchanged by expiry');
    const kept = { hp: hpOf(host), pools: pcPools(host) };
    while (seqNow(host) < dueEnd - 1) { await advance(); assert.equal(moves(host).length, 1, `rider survives boundary ${seqNow(host)}`); }
    await advance(); assert.equal(seqNow(host), dueEnd); assert.equal(moves(host).length, 0, 'expired at its own boundary');
    assert.deepEqual({ hp: hpOf(host), pools: pcPools(host) }, kept, 'expiry does not undo the immediate consequence');
    stage('exact expiry', 'App control (Advance authenticated turn)', { dueEnd });

    step('cast 2 (fresh physical 2d6 = 3, 3) → GM confirm → GM removes the rider in the shared condition editor; HP and payment unchanged by removal');
    ({ od } = await openCast(owner, spec.name)); await recordFaces(od, [3, 3]); await approveButton(od).click(); await od.getByText(/Awaiting GM adjudication/).waitFor();
    const total3 = 6 + Math.floor((INT1 - 2) / 3);
    g = await gmCard(gm, spec.name, total3); const r2 = await confirmOnce(host, g); assert.ok(r2.receipt, JSON.stringify(r2)); assert.equal(moves(host).length, 1);
    const kept2 = { hp: hpOf(host), pools: pcPools(host) }, riderId = moves(host)[0].recordId;
    const ed = await editor(gm); await ed.dialog.getByRole('button', { name: `Remove ${spec.label} instance ${riderId}`, exact: true }).click();
    assert.ok(await wait(() => moves(host).length === 0, 60), 'GM removal'); await ed.close();
    assert.deepEqual({ hp: hpOf(host), pools: pcPools(host) }, kept2, 'removal does not undo the immediate consequence');
    stage('GM removal', 'App control (shared condition editor → Remove Mired instance)');

    report.checks.ownerCasts = receipts(host).filter(r => r.authorization?.kind === 'owner-approval-gm').length;
    assert.equal(report.errors.length, 0, JSON.stringify(report.errors));
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }]) { await owner.setViewportSize(viewport); await owner.screenshot({ path: path.join(out, `owner-final-${viewport.width}.png`) }); }
    report.passed = true;
  } catch (e) {
    report.failure = e.stack;
    for (const [role, p] of Object.entries(pages)) { save(`failure-${role}.aria.yml`, await p.locator('body').ariaSnapshot().catch(() => 'unavailable')); await p.screenshot({ path: path.join(out, `failure-${role}.png`) }).catch(() => {}); }
    throw e;
  } finally {
    report.endedAt = new Date().toISOString(); report.build = process.env.APP_BUILD_DIR;
    report.buildAssetManifestSha256 = sha(fs.readFileSync(path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json')));
    report.receipts = actors.ledger(host.room).receipts.map(r => actors.publicReceipt(r));
    save('result.json', report); for (const c of Object.values(contexts)) await c.close().catch(() => {}); await host.stop();
  }
}
if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
module.exports = { main };
