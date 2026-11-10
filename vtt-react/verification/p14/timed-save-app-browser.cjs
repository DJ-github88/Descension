// Timed save-dependent effects — production-App acceptance witness (PREPARED; a pass is claimed only by a recorded run).
// ONE Wizard-authored ability: arcane 1d8+3 + movement rider "Rime Shackle" −10 ft whose authored Constitution DC 12 save negates the
// rider only, with the structured expiry "end of the target's next turn". Ordinary App controls throughout:
//   Spell Wizard author → library save/reopen → GM room admission →
//   owner cast + physical roll + approval of BOTH outcomes →
//   GM records "Target saves", then "Target fails" BEFORE combat: both refused alike, nothing charged (timed-save symmetry) →
//   Combat Initiator (PC + A + B, "Begin Combat (3)") → GM enables authenticated turn expiry →
//   the SAME approval, "Target saves": payment + damage, no rider, no schedule →
//   cast 2, "Target fails" with the ACK and accepted broadcast lost → GM reload → "Check same command": one receipt, timed rider →
//   cast 3, "Target saves" while the rider is active: rider and its schedule byte-equal →
//   owner/observer reload: same rider and expiry line →
//   authenticated advances: the rider survives the start of B's turn; the end of B's turn (ACK lost → "Check original turn command")
//   expires exactly it once, base speed restored.
// The branch is selected only through the GM card's radio control. Expected boundaries are computed here from the roster (independent
// of the code under test). Anything done outside ordinary controls is pushed to `qualifications` and never counted as an App-path pass.
// Run (from vtt-react/verification/p14): TIMED_SAVE_OUTPUT=<abs dir outside repo> APP_BUILD_DIR=<abs identified build>
//   [TIMED_SAVE_MANIFEST=<abs path to handoff/timed-save-effects/INSTALLED.sha256, or the merged install manifest>] [TIMED_SAVE_CHANNEL=chrome]
//   node timed-save-app-browser.cjs
/* global S, __socket, __actors */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.TIMED_SAVE_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR || !path.isAbsolute(process.env.APP_BUILD_DIR)) throw Error('Absolute external TIMED_SAVE_OUTPUT and APP_BUILD_DIR required');
const repo = path.resolve(__dirname, '../../..');
if (path.resolve(out).startsWith(repo + path.sep)) throw Error('TIMED_SAVE_OUTPUT must be outside the repository');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture'); process.env.A4_OUTPUT = path.join(out, 'producer');
const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');
async function setup(page, url, uid) {
  if (!page.__timedFonts) {
    page.__timedFonts = true; const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    page.goto = async(...args) => { await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {}); await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts); return goto(...args); };
  }
  const result = await baseSetup(page, url, uid);
  if (uid === 'app-owner') { result.hydration = await loadOwnerFixture(page); page.__hydration = result.hydration; }
  return result;
}
/** One complete explicit owner record through production characterStore.loadCharacter (the M4B/composed-cooldown approach; no placeholder fields). */
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
    const st = store.getState(); return { characterId: st.currentCharacterId, name: st.name, class: st.class, race: st.race, subrace: st.subrace, statsModel: st.statsModel };
  }, ownerFixture());
}
const actors = require('../../../server/services/actorConsequences');
const profile = require('../../src/services/sharedConditionProfile');
const pure = require('../../src/services/authoredAbility'), fixtureCharacters = require('./m4b-fixture-characters.cjs');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { kind: 'timed-save-app-witness', startedAt: new Date().toISOString(), passed: false, checks: {}, qualifications: [], errors: [], steps: [], stages: {},
  limits: ['Real optimized App and registered backend; identity/provider/ownership/lease/cloud are fixture boundaries (p9 integration host).',
    'Complete deterministic owner record (m4b-fixture-characters app-owner, Arcanoneer 3) loaded through production characterStore.loadCharacter after boot (setup instrumentation only).',
    'Temporary room: accepted-live only. No live Firebase, deployment, physical second device or human tabletop claim.',
    'The save is rolled at the table, not by the VTT; the GM records the outcome. A recorded outcome is not proof that the VTT rolled or validated a save.',
    'Lost delivery is simulated in the GM page (one ACK callback and that GM\'s accepted broadcast dropped); server, writer and recovery path unmodified.'] };
function patchClick(page) {
  const L = Object.getPrototypeOf(page.locator('body')); if (L.__timed) return; L.__timed = true; const click = L.click;
  L.click = async function(options = {}) { try { return await click.call(this, { timeout: 20000, ...options }); } catch (e) { if (options.force || !/not stable|intercepts pointer/.test(String(e.message))) throw e; return click.call(this, { ...options, force: true }); } };
}
const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); };
const stage = (name, how, detail) => { report.stages[name] = { how, ...(detail ? { detail } : {}) }; };
const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
const ownerDialog = p => p.getByRole('dialog', { name: 'Supported spell cast', exact: true });
const clockUI = p => p.getByRole('region', { name: 'Authenticated turn expiry', exact: true });
const hall = host => host.room.gameState.maps['app-hall'];
const B = host => hall(host).tokens.B;
const hpOf = host => ({ current: B(host).state.currentHp, temp: B(host).state.tempHealth });
const moves = host => B(host).state.conditions.filter(profile.isMovementModifier);
const receipts = host => actors.ledger(host.room).receipts;
const pcPools = host => { const r = actors.resources(hall(host).characterTokens.pc, 'character'); return { ap: r.ap.current + r.ap.temp, mana: r.mana.current + r.mana.temp }; };
const combat = host => host.room.gameState.combat;
const seqNow = host => combat(host).effectLifecycle.sequence;
const current = host => combat(host).turnOrder[combat(host).currentTurnIndex].tokenId;
const schedulesFor = (host, recordId) => Object.values(combat(host)?.effectLifecycle?.schedules || {}).filter(i => i.recordId === recordId);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const wait = async(fn, n = 100) => { for (let i = 0; i < n && !fn(); i++) await sleep(150); return fn(); };

async function openBook(p) {
  const role = p.getByRole('button', { name: 'Character', exact: true });
  if (await role.count()) await role.click(); else await p.locator('button', { hasText: /^\s*Character\s*$/ }).first().click();
  const sb = p.getByRole('button', { name: 'Spellbook S', exact: true });
  if (await sb.count()) await sb.click(); else await p.locator('button', { hasText: /Spellbook/ }).first().click();
  await book(p).waitFor();
}
async function closeBook(p) { const b = book(p).getByRole('button', { name: 'Close', exact: true }); await b.focus(); await b.press('Enter'); }
const savedRecord = (p, name) => p.evaluate(name => { const k = Object.keys(localStorage).find(k => k.endsWith(':library.spellData')); return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells.find(s => s.name === name) : null; }, name);
/** Actual Spell Wizard: Damage + composed movement effect, structured expiry, then the rider-local "negates" save (expiry is kept). */
async function author(p, c) {
  await openBook(p);
  await book(p).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(c.name);
  await book(p).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Disposable timed-save witness: arcane damage; the target is shackled until the end of its next turn unless it makes a Constitution save.');
  await book(p).getByText('Arcane', { exact: true }).click();
  const nav = book(p).getByRole('navigation', { name: 'Spell wizard steps' });
  await nav.getByRole('button', { name: /Spell Type$/ }).click(); await book(p).getByRole('heading', { name: 'ACTION', exact: true }).click(); await book(p).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await nav.getByRole('button', { name: /^3 Effects$/ }).click();
  await book(p).getByRole('heading', { name: 'Damage', exact: true }).click(); await book(p).locator('.damage-effects-container').getByRole('textbox').first().fill(c.formula);
  await book(p).getByRole('heading', { name: 'Control', exact: true }).click();
  await book(p).getByRole('button', { name: /^Use composed effect profile/ }).click();
  const fields = book(p).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
  await fields.getByLabel(/^Canonical effect/).selectOption('movement');
  await fields.getByLabel(/^Effect name shown on the target/).fill(c.label);
  await fields.getByLabel(/^Movement change/).fill(String(c.feet));
  await fields.getByLabel(/^Expiry/).selectOption(c.expiry);
  await fields.getByLabel(/The target may save to negate this effect/).check();
  assert.equal(await fields.getByLabel(/^Expiry/).inputValue(), c.expiry, 'ticking the save keeps the structured expiry');
  await fields.getByLabel(/^Saving ability/).selectOption(c.save.ability);
  await fields.getByLabel(/^Difficulty \(DC/).fill(String(c.save.dc));
  report.checks.wizardSaveText = await fields.getByRole('group', { name: 'Saving throw (optional)', exact: true }).innerText();
  await fields.getByLabel(/^Source-authored duration text/).fill(c.duration);
  await fields.getByLabel(/^Required GM adjudication note/).fill('The table rolls the Constitution save; the GM records saved or failed. A failed save shackles the target until the end of its next turn.');
  await book(p).screenshot({ path: path.join(out, 'wizard-timed-save-fields.png') });
  await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click(); await book(p).getByText('Single Target', { exact: true }).click(); await book(p).getByText('Ranged', { exact: true }).click();
  const slider = book(p).getByRole('slider').first(); await slider.focus(); await slider.press('Home'); for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
  await book(p).getByText('Enemies', { exact: true }).click(); await book(p).getByText('Any Target', { exact: true }).click();
  await nav.getByRole('button', { name: /Resources$/ }).click(); await book(p).getByTitle('Standard magical energy', { exact: true }).click(); await book(p).getByTitle('Basic action economy', { exact: true }).click();
  const inputs = book(p).getByRole('spinbutton'); await inputs.nth(0).fill('1'); await inputs.nth(0).fill(String(c.mana)); await inputs.nth(1).fill('1'); await inputs.nth(1).fill(String(c.ap));
  await p.getByRole('button', { name: '✓ Complete Spell', exact: true }).click({ force: true });
  await p.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), c.name);
  const r = await savedRecord(p, c.name); save('wizard-saved.json', r);
  const mapped = pure.definitionFromWizard(r, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' }); assert.equal(mapped.ok, true, JSON.stringify(mapped));
  assert.deepEqual(mapped.definition.effects, { direct: { kind: 'damage', formula: c.formula, damageTypes: ['arcane'] }, condition: { kind: 'movement', feet: c.feet, label: c.label },
    save: { scope: 'condition', ability: c.save.ability, dc: c.save.dc, outcome: 'negates' } });
  assert.equal(mapped.definition.timing.expiryPolicy, c.expiry, 'the saved record keeps the structured expiry with the save');
  report.checks.definitionSummary = pure.definitionSummary(mapped.definition);
  await closeBook(p);
  return r;
}
async function admitForPc(p, name, original) {
  await openBook(p); await book(p).getByRole('button', { name: 'Spell Library', exact: true }).click(); await book(p).getByText(name, { exact: true }).click();
  const section = p.getByRole('region', { name: `Room admission for ${name}`, exact: true }); await section.waitFor();
  assert.deepEqual(await savedRecord(p, name), original, 'save/reopen preserved the whole record');
  report.checks.compatibilityText = await p.locator('.spell-detail-overlay').innerText().catch(() => null);
  await section.getByRole('button', { name: 'Admit this saved version', exact: true }).click(); await section.getByText(/^Admitted for /).waitFor();
  await p.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click({ timeout: 3000 }).catch(() => p.keyboard.press('Escape'));
}
/** Shared condition editor (Party HUD → exact room attachment → Edit selected shared conditions): speed line and expiry lines. */
async function editor(p, id = 'B') {
  const controls = p.getByRole('region', { name: 'Actor attachment and consequences', exact: true });
  await controls.getByRole('combobox', { name: 'Exact room attachment', exact: true }).selectOption(`creature:${id}`);
  await controls.getByRole('button', { name: 'Edit selected shared conditions', exact: true }).click();
  const dialog = p.getByRole('dialog', { name: 'Edit selected shared conditions editor', exact: true }); await dialog.waitFor();
  await dialog.getByText(/^Stunned (inactive\.|active:)/).first().waitFor({ timeout: 15000 });
  const section = dialog.getByRole('region', { name: 'Active movement effects', exact: true });
  const speed = await section.count() ? (await section.getByRole('status').first().innerText()).trim() : 'no active movement effects';
  const expiry = await dialog.locator('.sc-expiry').allInnerTexts();
  return { speed, expiry, dialog, close: async() => { await dialog.getByRole('button', { name: 'Close shared condition editor', exact: true }).click(); await dialog.waitFor({ state: 'detached' }); } };
}
async function readEditor(p) { const r = await editor(p); await r.close(); return { speed: r.speed, expiry: r.expiry }; }
/** B's conditions as each client renders them, once they equal the authoritative room. */
const synced = (p, host) => p.waitForFunction(ids => { const t = S('creatureStore').getState().creatureTokens.find(t => t.id === 'B');
  return !!t && JSON.stringify((t.state.conditions || []).map(r => r.recordId).sort()) === JSON.stringify(ids); }, B(host).state.conditions.map(r => r.recordId).sort(), { timeout: 15000 });

async function ownerCast(owner, spec, face) {
  if (await ownerDialog(owner).count()) { await ownerDialog(owner).getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => {}); await ownerDialog(owner).waitFor({ state: 'detached' }).catch(() => {}); }
  const lib = owner.getByRole('region', { name: 'Admitted abilities', exact: true });
  if (!await lib.count()) await owner.locator('summary').filter({ hasText: /^Admitted abilities$/ }).click();
  await lib.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
  await lib.locator('.p9-admitted-row').filter({ hasText: spec.name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
  const od = ownerDialog(owner); await od.waitFor(); await od.getByRole('heading', { name: spec.name, exact: true }).waitFor();
  const targets = await od.getByRole('combobox', { name: 'Target', exact: true }).locator('option').allInnerTexts();
  await od.getByRole('combobox', { name: 'Target', exact: true }).selectOption({ label: 'B · creature · B' });
  await od.getByLabel('d8 face 1', { exact: true }).fill(String(face)); await od.getByRole('button', { name: 'Record physical roll', exact: true }).click();
  const text = await od.innerText();
  await od.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true }).click(); await od.getByText(/Awaiting GM adjudication/).waitFor();
  return { od, text, targets };
}
/** GM card for the pending approval: record the table's outcome with the card's own radio, confirm, final damage. */
async function gmCard(gm, spec, { outcome, final, note, evidence }) {
  const card = gm.locator('.p9-gm-card').filter({ hasText: spec.name }).first(); await card.waitFor();
  const timingNote = card.getByLabel('GM timing clarification (required)', { exact: true });
  if (!(await timingNote.inputValue())) await timingNote.fill(note);
  await card.getByRole('textbox', { name: /^Private manual resolution evidence/ }).fill(evidence); // the textarea's saved text joins its label after a remount
  const confirm = card.getByRole('button', { name: 'Confirm recorded outcome', exact: true });
  const disabledBefore = await confirm.isDisabled();
  await card.getByRole('radio', { name: outcome }).check(); // the ONLY branch selection: the GM card's own control
  const check = card.getByRole('checkbox', { name: /I resolved eligibility, range and immunity, and recorded the table’s save result above/ });
  if (!(await check.isChecked())) await check.check();
  await card.getByLabel(/^Final damage/).fill(String(final));
  return { card, text: await card.innerText(), confirm, disabledBefore };
}
/** Confirm through the card; returns { receipt } when the room accepted one new receipt, else { refusal } with the card's status text. */
async function confirmOnce(host, g) {
  const n = receipts(host).length; await g.confirm.click();
  const accepted = await wait(() => receipts(host).length === n + 1, 40);
  if (accepted) return { receipt: receipts(host).at(-1) };
  await sleep(500); return { refusal: await g.card.getByRole('status').allInnerTexts().catch(() => []), alerts: await g.card.getByRole('alert').allInnerTexts().catch(() => []) };
}
/** Expected final boundary for "end of the target's next turn", from the roster only (truth table, not the code under test). */
function expectedEndDue(host) {
  const c = combat(host), R = c.turnOrder.length, t = c.turnOrder.findIndex(e => e.tokenId === 'B'), d = ((t - c.currentTurnIndex + R) % R) || R;
  return seqNow(host) + d + 1;
}

async function main() {
  const manifest = process.env.TIMED_SAVE_MANIFEST;
  if (manifest) {
    const lines = fs.readFileSync(manifest, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.replace(/^﻿/, '').split(/\s+\*?/));
    report.sourceIdentity = lines.map(([hash, file]) => { const p = path.join(repo, file); const now = fs.existsSync(p) ? sha(fs.readFileSync(p)) : null; return { file, expected: hash, live: now, match: now === hash }; });
    if (report.sourceIdentity.some(e => !e.match)) report.qualifications.push('Live source differs from TIMED_SAVE_MANIFEST for: ' + report.sourceIdentity.filter(e => !e.match).map(e => e.file).join(', ') + '. Record which bytes the identified build captured.');
  } else report.qualifications.push('No TIMED_SAVE_MANIFEST given: candidate source identity was not checked by this run.');
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_bind', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw', 'actor_recovery',
    'actor_turn_boundary', 'combat_started', 'combat_turn_changed', 'combat_ended', 'join_room', 'token_moved']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const pages = {}, contexts = {}, channel = process.env.TIMED_SAVE_CHANNEL;
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner'], ['observer', 'app-observer']]) {
      const dir = path.join(out, 'profiles', role); fs.mkdirSync(dir, { recursive: true });
      const ctx = contexts[role] = await chromium.launchPersistentContext(dir, { ...(channel ? { channel } : {}), headless: true, viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const page = pages[role] = ctx.pages()[0] || await ctx.newPage(); patchClick(page);
      page.on('pageerror', e => { if (!/Failed to fetch|blockedbyclient|Loading chunk/i.test(e.message)) report.errors.push({ role, message: e.message }); });
      await setup(page, host.url, uid);
    }
    const { gm, owner, observer } = pages;

    step('Wizard author/save/reopen/admit: arcane 1d8+3 + Rime Shackle −10 ft until the end of the target\'s next turn; Constitution DC 12 negates Rime Shackle only');
    const spec = { name: 'TS Rime Shackle', formula: '1d8+3', label: 'Rime Shackle', feet: -10, expiry: 'target-next-end', save: { ability: 'constitution', dc: 12 }, duration: 'until the end of the target\'s next turn', ap: 1, mana: 2 };
    const record = await author(gm, spec); await admitForPc(gm, spec.name, record); await setup(gm, host.url, 'app-gm');
    for (const p of [owner, observer]) await setup(p, host.url, p === owner ? 'app-owner' : 'app-observer');
    assert.match(report.checks.wizardSaveText, /both outcomes need active authenticated turn tracking/);
    stage('author/save/reopen/admit', 'App controls (Spell Wizard expiry + save fields, Spell Library, room admission)');
    const before = await readEditor(observer); report.checks.speedBefore = before.speed;

    step('cast 1 (no combat yet): owner sees both outcomes and the automatic expiry, rolls d8 = 5, approves; nothing spent');
    const snap = () => JSON.stringify([pcPools(host), hpOf(host), B(host).state.conditions, combat(host)?.effectLifecycle?.schedules || null]);
    let s0 = snap(), cast = await ownerCast(owner, spec, 5);
    report.checks.ownerText1 = cast.text; report.checks.ownerTargets = cast.targets; save('owner-cast1.aria.yml', await cast.od.ariaSnapshot());
    assert.ok(!cast.targets.some(t => /character/.test(t)), 'no PC target is offered for a save-branch bundle');
    for (const text of ['Target saves (Constitution DC 12, GM records): arcane damage 1d8+3; no Rime Shackle', 'Target fails (Constitution DC 12, GM records): arcane damage 1d8+3 + Rime Shackle (movement −10 ft)',
      'You approve both outcomes now']) assert.ok(cast.text.includes(text), `owner sees: ${text}`);
    assert.match(cast.text, /Automatic: expires at the end of the target's next turn/);
    assert.equal(snap(), s0, 'approval spends nothing and installs nothing');
    stage('owner approval', 'App controls (owner spell panel, physical roll)');

    step('no turn tracking: GM records "Target saves", then "Target fails" — both refused alike, nothing charged');
    const refusedBoth = {};
    for (const [branch, outcome] of [['saved', /^Target saves/], ['failed', /^Target fails/]]) {
      const g = await gmCard(gm, spec, { outcome, final: 8, note: 'Touch range confirmed; CON save rolled at the table.', evidence: `SECRET-TS GM evidence (${branch})` });
      if (branch === 'saved') { report.checks.gmCardText1 = g.text; assert.equal(g.disabledBefore, true, 'Confirm is disabled until a branch is recorded'); assert.match(g.text, /either recorded outcome needs active authenticated turn tracking/); await g.card.screenshot({ path: path.join(out, 'gm-card-no-tracking.png') }); }
      const r = await confirmOnce(host, g); assert.ok(r.refusal, `${branch} must be refused without turn tracking`);
      refusedBoth[branch] = [...r.refusal, ...r.alerts];
      assert.ok(refusedBoth[branch].some(t => /effect schedule unavailable|turn tracking/i.test(t)), `${branch} refusal names the missing schedule: ${JSON.stringify(refusedBoth[branch])}`);
      assert.equal(snap(), s0, `${branch} refusal changed nothing (payment, HP, conditions, schedules)`);
    }
    report.checks.refusedWithoutTracking = refusedBoth;
    stage('symmetric refusal without tracking', 'App controls (GM card radio + confirm), server refusal for both outcomes');

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
    report.checks.ownerHydration = owner.__hydration || null;
    report.checks.roster = combat(host).turnOrder.map(e => e.tokenId);
    for (const id of ['pc', 'A', 'B']) assert.ok(report.checks.roster.includes(id), `${id} is in the authoritative roster`);
    const closeEditor = () => gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).last().click().catch(() => {});
    await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click(); await clockUI(gm).getByRole('button', { name: 'Enable authenticated turn expiry', exact: true }).click();
    assert.ok(await wait(() => !!combat(host)?.effectLifecycle, 40)); assert.equal(seqNow(host), 0); await closeEditor();
    stage('clock adoption', 'App control (Shared turn expiry → Enable authenticated turn expiry)');
    const advance = async() => { const was = seqNow(host); await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click(); await clockUI(gm).getByRole('button', { name: 'Advance authenticated turn', exact: true }).click();
      assert.ok(await wait(() => seqNow(host) === was + 1, 40), 'one authenticated boundary'); await closeEditor(); return seqNow(host); };
    if (current(host) === 'B') await advance(); // cast while another actor holds the turn, so the start AND end of B's next turn are both witnessed
    report.checks.turnAtCasts = { sequence: seqNow(host), current: current(host) };

    step('the SAME approval, "Target saves", now with tracking: payment + 8 damage, no rider, no schedule');
    let g = await gmCard(gm, spec, { outcome: /^Target saves/, final: 8, note: 'Touch range confirmed; CON save rolled at the table.', evidence: 'SECRET-TS GM evidence: player rolled 15 vs DC 12' });
    let pc0 = pcPools(host), hp0 = hpOf(host), schedBefore = JSON.stringify(combat(host).effectLifecycle.schedules);
    let r = await confirmOnce(host, g);
    if (!r.receipt) {
      report.qualifications.push(`The pre-combat approval could not be confirmed after combat started (${JSON.stringify(r.refusal)}); it was withdrawn through the owner panel and a fresh approval (d8 = 5) was used for the saved branch.`);
      await ownerDialog(owner).getByRole('button', { name: 'Withdraw before acceptance', exact: true }).click().catch(() => {});
      cast = await ownerCast(owner, spec, 5); g = await gmCard(gm, spec, { outcome: /^Target saves/, final: 8, note: 'Touch range confirmed.', evidence: 'SECRET-TS GM evidence: player rolled 15 vs DC 12' });
      pc0 = pcPools(host); hp0 = hpOf(host); r = await confirmOnce(host, g); assert.ok(r.receipt, JSON.stringify(r));
    }
    let chosen = JSON.parse(r.receipt.adjudication.chosenResult);
    assert.deepEqual([chosen.branch, chosen.conditionApplied, chosen.conditionInstanceId, chosen.expiryPolicy], ['saved', false, null, 'target-next-end']);
    assert.equal(moves(host).length, 0, 'saved: no rider'); assert.equal(JSON.stringify(combat(host).effectLifecycle.schedules), schedBefore, 'saved: no schedule');
    assert.deepEqual(hpOf(host), { current: hp0.current - (8 - Math.min(8, hp0.temp)), temp: Math.max(0, hp0.temp - 8) }, 'direct damage on the saved branch (temporary HP first)');
    assert.deepEqual(pcPools(host), { ap: pc0.ap - spec.ap, mana: pc0.mana - spec.mana }, 'paid once on the saved branch');
    report.checks.saved1 = { commandId: r.receipt.commandId, hpBefore: hp0, hpAfter: hpOf(host), publicReceipt: actors.publicReceipt(r.receipt) };
    await owner.getByText(/Accepted · /).first().waitFor({ timeout: 20000 }); report.checks.ownerStatusSaved = await owner.getByText(/Accepted · /).first().innerText();
    assert.match(report.checks.ownerStatusSaved, /target saved \(Constitution DC 12, GM recorded\): no Rime Shackle/);
    stage('saved branch with tracking', 'App controls (GM card radio + confirm); server-authoritative payment and HP');

    step('cast 2: owner rolls d8 = 3; GM records "Target fails" while the ACK and accepted broadcast are lost; GM reloads; "Check same command"');
    cast = await ownerCast(owner, spec, 3);
    g = await gmCard(gm, spec, { outcome: /^Target fails/, final: 6, note: 'Touch range confirmed; CON save failed at the table.', evidence: 'SECRET-TS GM evidence: player rolled 7 vs DC 12' });
    await g.card.screenshot({ path: path.join(out, 'gm-card-failed.png') });
    await gm.evaluate(() => { const listeners = __socket.listeners('actor_consequence_accepted'); __socket.removeAllListeners('actor_consequence_accepted'); let once = true;
      __socket.on('actor_consequence_accepted', r => { if (once && r.receipt?.adjudication?.definitionVersionOrHash?.startsWith('authored-effect:v1/')) { once = false; return; } listeners.forEach(fn => fn(r)); });
      const emit = __socket.emit.bind(__socket); let drop = true; __socket.emit = (e, ...args) => { if (drop && e === 'actor_consequence' && args[0]?.adjudication?.definitionVersionOrHash?.startsWith('authored-effect:v1/') && typeof args[1] === 'function') { drop = false; args[1] = () => {}; } return emit(e, ...args); }; });
    const due = expectedEndDue(host); report.checks.expectedDue = { sequence: seqNow(host), current: current(host), roster: report.checks.roster, due };
    const hp1 = hpOf(host), pc1 = pcPools(host), n1 = receipts(host).length;
    await g.confirm.click();
    assert.ok(await wait(() => receipts(host).length === n1 + 1), 'server accepted once while the ACK and broadcast were lost');
    const failedId = receipts(host).at(-1).commandId; await gm.waitForTimeout(1500);
    await gm.reload(); await setup(gm, host.url, 'app-gm');
    const checkCmd = gm.getByRole('button', { name: 'Check same command', exact: true }).first(); await checkCmd.waitFor({ timeout: 30000 });
    await checkCmd.click(); await gm.waitForTimeout(1500);
    assert.equal(receipts(host).length, n1 + 1, 'Check same command never applies twice'); assert.equal(receipts(host).filter(x => x.commandId === failedId).length, 1);
    chosen = JSON.parse(receipts(host).find(x => x.commandId === failedId).adjudication.chosenResult);
    assert.deepEqual([chosen.branch, chosen.conditionApplied], ['failed', true]); assert.deepEqual(chosen.roll.dice[0].faces, [3], 'retained owner face, no reroll');
    const rider = moves(host)[0]; assert.equal(moves(host).length, 1); assert.equal(rider.name, spec.label); assert.equal(rider.clockBoundary, 'authored-target-next-end');
    const sched = schedulesFor(host, rider.recordId); assert.equal(sched.length, 1); assert.deepEqual([sched[0].dueSequence, sched[0].boundary], [due, 'end'], 'schedule = end of B\'s next turn');
    assert.deepEqual(hpOf(host), { current: hp1.current - (6 - Math.min(6, hp1.temp)), temp: Math.max(0, hp1.temp - 6) });
    assert.deepEqual(pcPools(host), { ap: pc1.ap - spec.ap, mana: pc1.mana - spec.mana }, 'paid once (no re-payment on recovery)');
    await synced(gm, host); await synced(observer, host);
    const afterFailed = { gm: await readEditor(gm), observer: await readEditor(observer) }; report.checks.afterFailed = afterFailed;
    assert.match(afterFailed.observer.speed, /Rime Shackle −10 ft/); assert.equal(afterFailed.gm.speed, afterFailed.observer.speed);
    assert.ok(afterFailed.gm.expiry.some(t => /Automatic at end of the target's next turn/.test(t) && t.includes(`boundary ${due}`)), JSON.stringify(afterFailed.gm.expiry));
    report.checks.failed = { commandId: failedId, rider, schedule: sched[0], hpBefore: hp1, hpAfter: hpOf(host), publicReceipt: actors.publicReceipt(receipts(host).find(x => x.commandId === failedId)) };
    stage('failed branch + lost-ACK cast recovery', 'App controls (GM card radio + confirm; GM reload; Check same command), one receipt, timed rider');

    step('cast 3: "Target saves" while Rime Shackle is active — payment + damage only; the rider and its schedule stay byte-equal');
    cast = await ownerCast(owner, spec, 4);
    g = await gmCard(gm, spec, { outcome: /^Target saves/, final: 7, note: 'Touch range confirmed; CON save made at the table.', evidence: 'SECRET-TS GM evidence: player rolled 13 vs DC 12' });
    const held = { conditions: JSON.stringify(B(host).state.conditions), schedules: JSON.stringify(combat(host).effectLifecycle.schedules) }, hp2 = hpOf(host), pc2 = pcPools(host);
    r = await confirmOnce(host, g); assert.ok(r.receipt, JSON.stringify(r));
    chosen = JSON.parse(r.receipt.adjudication.chosenResult); assert.deepEqual([chosen.branch, chosen.conditionApplied, chosen.combination], ['saved', false, undefined], 'no hidden refresh on the saved branch');
    assert.equal(JSON.stringify(B(host).state.conditions), held.conditions, 'earlier rider untouched'); assert.equal(JSON.stringify(combat(host).effectLifecycle.schedules), held.schedules, 'its schedule untouched');
    assert.deepEqual(hpOf(host), { current: hp2.current - (7 - Math.min(7, hp2.temp)), temp: Math.max(0, hp2.temp - 7) }); assert.deepEqual(pcPools(host), { ap: pc2.ap - spec.ap, mana: pc2.mana - spec.mana });
    stage('saved branch leaves prior effects untouched', 'App controls (GM card radio + confirm)');

    step('owner and observer reload: the same rider and expiry line come back from the authoritative room');
    for (const [p, uid] of [[owner, 'app-owner'], [observer, 'app-observer']]) { await p.reload(); await setup(p, host.url, uid); }
    await synced(observer, host); const reloaded = await readEditor(observer); report.checks.observerAfterReload = reloaded;
    assert.equal(reloaded.speed, afterFailed.observer.speed); assert.deepEqual(reloaded.expiry, afterFailed.observer.expiry);
    stage('reload', 'App reload (owner, observer); state read from the authoritative room');

    step(`authenticated advances to boundary ${due - 1} (start of B's turn): Rime Shackle stays`);
    while (seqNow(host) < due - 1) { await advance(); assert.equal(moves(host).length, 1, `still active at boundary ${seqNow(host)}`); }
    assert.equal(current(host), 'B', 'B holds the turn at the boundary before expiry'); await synced(observer, host);
    report.checks.beforeExpiry = { sequence: seqNow(host), observer: await readEditor(observer) };

    step(`boundary ${due} (end of B's turn) with the ACK lost: "Check original turn command"; Rime Shackle expires exactly once`);
    await gm.evaluate(() => { const emit = __socket.emit.bind(__socket); let drop = true; __socket.emit = (e, ...args) => { if (drop && e === 'actor_turn_boundary' && typeof args[args.length - 1] === 'function') { drop = false; args[args.length - 1] = () => {}; } return emit(e, ...args); }; });
    const nb = receipts(host).length;
    await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click(); await clockUI(gm).getByRole('button', { name: 'Advance authenticated turn', exact: true }).click();
    assert.ok(await wait(() => seqNow(host) === due, 40), 'server accepted the boundary once while its ACK was lost');
    const check = clockUI(gm).getByRole('button', { name: 'Check original turn command', exact: true });
    // Required App path (no fallback): the original turn command is re-checked through the GM clock control.
    await check.waitFor({ timeout: 15000 }); for (let i = 0; i < 80 && await check.isDisabled(); i++) await sleep(250); await check.click(); await sleep(1000); stage('lost-ACK boundary recovery', 'App control (Check original turn command)');
    await closeEditor();
    assert.equal(seqNow(host), due, 'recovery did not advance again'); assert.equal(receipts(host).length, nb + 1, 'one boundary receipt');
    const boundaryReceipt = receipts(host).at(-1), expired = JSON.parse(boundaryReceipt.adjudication.chosenResult).expired;
    assert.deepEqual(expired, [rider.recordId], 'exactly Rime Shackle expired at the end of B\'s turn');
    assert.equal(moves(host).length, 0); assert.equal(schedulesFor(host, rider.recordId).length, 0);
    await synced(gm, host); await synced(observer, host);
    report.checks.afterExpiry = { gm: await readEditor(gm), observer: await readEditor(observer), boundary: actors.publicReceipt(boundaryReceipt) };
    assert.equal(report.checks.afterExpiry.observer.speed, report.checks.speedBefore, 'base speed restored');
    assert.equal(receipts(host).filter(x => x.commandId === failedId).length, 1, 'the failed cast still has one receipt');
    stage('authenticated expiry + restoration', 'App controls (Advance authenticated turn); server-authoritative expiry');

    step('privacy: observer snapshot and public receipts carry no private GM evidence');
    const observerView = await observer.evaluate(roomId => new Promise(res => __socket.emit('actor_snapshot', { roomId }, r => res(JSON.stringify(r)))), host.room.id);
    assert.equal(observerView.includes('SECRET-TS'), false); assert.ok(!JSON.stringify(receipts(host).map(x => actors.publicReceipt(x))).includes('SECRET-TS'));
    assert.deepEqual(report.errors, [], `page errors: ${JSON.stringify(report.errors)}`);
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }]) { await gm.setViewportSize(viewport); await gm.screenshot({ path: path.join(out, `gm-final-${viewport.width}.png`) }); }
    report.passed = true;
  } catch (e) {
    report.failure = e.stack;
    for (const [role, p] of Object.entries(pages)) { save(`failure-${role}.aria.yml`, await p.locator('body').ariaSnapshot().catch(() => 'unavailable')); await p.screenshot({ path: path.join(out, `failure-${role}.png`) }).catch(() => {}); }
    throw e;
  } finally {
    report.endedAt = new Date().toISOString(); report.build = process.env.APP_BUILD_DIR;
    const am = path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json'); report.buildAssetManifestSha256 = fs.existsSync(am) ? sha(fs.readFileSync(am)) : null;
    report.witnessSha256 = sha(fs.readFileSync(__filename));
    report.receipts = actors.ledger(host.room).receipts.map(x => actors.publicReceipt(x));
    save('result.json', report); for (const c of Object.values(contexts)) await c.close().catch(() => {}); await host.stop();
  }
}
if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
module.exports = { main };
