// Composed cooldowns witness: ONE Wizard-authored ability = immediate damage 1d6+2 (rolled at cast) + periodic damage 1d4 ticks
// (3 ticks, start of the target's turns) WITH the installed authenticated caster-start cooldown (N = 1). The explicit authoring
// values are chosen so the two lifetimes visibly differ: the cooldown releases at the caster's next turn start while two ticks
// remain. Ordinary App journey: Spell Wizard author/save/reopen/admit → owner cast + GM confirm (payment, immediate HP, periodic
// instance and cooldown in one receipt; dropped GM ACK → GM reload → "Check same command") → cooldown active → blocked reuse with
// no spending → owner reload keeps the cooldown → authenticated advance → tick 1 resolved (cooldown unchanged) → authenticated
// release at the caster's next start while the instance and its schedule stay → remaining ticks → legal reuse after the
// instance ended. Provider/identity/ownership/lease/cloud are fixture boundaries; anything outside App controls is a qualification.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.CC_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External CC_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture'); process.env.A4_OUTPUT = path.join(out, 'producer');
const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const profile = require('../../src/services/sharedConditionProfile');
const timing = require('../../src/services/sharedEffectTiming');
const cooldown = require('../../src/services/authoredCooldown');
const pure = require('../../src/services/authoredAbility'), fixtureCharacters = require('./m4b-fixture-characters.cjs');
/** One complete explicit owner record through production loadCharacter (same approach as the repaired M5F witness; no placeholder fields). */
function ownerFixture() {
  const record = JSON.parse(JSON.stringify(fixtureCharacters.characters['app-owner']));
  const stats = { strength: 10, agility: 10, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 };
  return Object.assign(record, { class: 'Arcanoneer', level: 3, stats: { ...stats }, baseStats: { ...stats }, buffs: [], debuffs: [],
    classResource: { type: 'elementalSpheres', spheres: [], current: 0, max: 12 }, class_spells: { known_spells: [] },
    health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 }, tempHealth: 0, tempMana: 3, tempActionPoints: 1 });
}
async function loadOwnerFixture(page) {
  return page.evaluate(async character => {
    const fixture = await fetch('/integration-fixture.json').then(r => r.json());
    const store = S('characterStore'), sleep = ms => new Promise(r => setTimeout(r, ms));
    for (let i = 0; i < 150 && !(store.getState().currentCharacterId && !store.getState().isLoading); i++) await sleep(100);
    for (let stable = 0, last = null; stable < 5;) { const st = store.getState(), key = `${st.currentCharacterId}|${st.characters.length}|${!!st.isLoading}`; stable = key === last ? stable + 1 : 0; last = key; await sleep(100); }
    store.setState({ characters: [character] }); S('gameStore').setState({ isInMultiplayer: false }); store.getState().loadCharacter(character.id); S('gameStore').setState({ isInMultiplayer: true });
    const selected = __actors.selectOwnerAttachment(fixture.refs.pc); if (!selected.success) throw Error(JSON.stringify(selected));
    const st = store.getState(); return { characterId: st.currentCharacterId, race: st.race, subrace: st.subrace, statsModel: st.statsModel };
  }, ownerFixture());
}
async function setup(page, url, uid) {
  if (!page.__ccFonts) {
    page.__ccFonts = true; const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    page.goto = async(...args) => { await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {}); await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts); return goto(...args); };
  }
  const result = await baseSetup(page, url, uid);
  if (uid === 'app-owner') result.hydration = await loadOwnerFixture(page);
  return result;
}
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { startedAt: new Date().toISOString(), checks: {}, qualifications: [], errors: [], steps: [], stages: {},
  limits: ['Real optimized App and registered backend; identity/provider/ownership/lease/cloud are fixture boundaries (mocked services).',
    'Temporary room: accepted-live only. No live Firebase, deployment, physical second device or human tabletop claim.',
    'Complete deterministic owner record loaded through production loadCharacter after boot (setup instrumentation only).',
    'public image assets were not part of this build input: icons may 404.',
    'Wizard primitive only. No catalogue record, pin or stripped catalogue demonstration.'] };
function patchClick(page) {
  const L = Object.getPrototypeOf(page.locator('body')); if (L.__cc) return; L.__cc = true; const click = L.click;
  L.click = async function(options = {}) { try { return await click.call(this, { timeout: 20000, ...options }); } catch (e) { if (options.force || !/not stable|intercepts pointer/.test(String(e.message))) throw e; return click.call(this, { ...options, force: true }); } };
}
const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); };
const stage = (name, how, detail) => { report.stages[name] = { how, ...(detail ? { detail } : {}) }; };
const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
const ownerDialog = p => p.getByRole('dialog', { name: 'Supported spell cast', exact: true });
const clockUI = p => p.getByRole('region', { name: 'Authenticated turn expiry', exact: true });
const ticksUI = p => clockUI(p).getByRole('region', { name: 'Due periodic ticks', exact: true });
const hall = host => host.room.gameState.maps['app-hall'];
const B = host => hall(host).tokens.B;
const PC = host => hall(host).characterTokens.pc;
const hpOf = host => ({ current: B(host).state.currentHp, temp: B(host).state.tempHealth });
const ticking = host => B(host).state.conditions.filter(profile.isPeriodicTick);
const due = host => timing.dueTicks(host.room.gameState.combat);
const cds = host => actors.clone(PC(host).state.authoredCooldowns || {});
const pool = host => actors.clone(actors.resources(PC(host), 'character'));
const wait = async(fn, n = 80) => { for (let i = 0; i < n && !fn(); i++) await new Promise(r => setTimeout(r, 150)); return fn(); };

async function openBook(p) {
  const role = p.getByRole('button', { name: 'Character', exact: true });
  if (await role.count()) await role.click(); else await p.locator('button', { hasText: /^\s*Character\s*$/ }).first().click();
  const sb = p.getByRole('button', { name: 'Spellbook S', exact: true });
  if (await sb.count()) await sb.click(); else await p.locator('button', { hasText: /Spellbook/ }).first().click();
  await book(p).waitFor();
}
async function closeBook(p) { const b = book(p).getByRole('button', { name: 'Close', exact: true }); await b.focus(); await b.press('Enter'); }
const savedRecord = (p, name) => p.evaluate(name => { const k = Object.keys(localStorage).find(k => k.endsWith(':library.spellData')); return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells.find(s => s.name === name) : null; }, name);
/** Actual Spell Wizard: Damage (immediate) + composed periodic damage profile + explicit authenticated caster-start cooldown. */
async function author(p, c) {
  await openBook(p);
  await book(p).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(c.name);
  await book(p).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Disposable composed-cooldown witness: 1d6+2 now, three 1d4 ticks, one caster-start cooldown.');
  await book(p).getByText('Arcane', { exact: true }).click();
  const nav = book(p).getByRole('navigation', { name: 'Spell wizard steps' });
  await nav.getByRole('button', { name: /Spell Type$/ }).click(); await book(p).getByRole('heading', { name: 'ACTION', exact: true }).click(); await book(p).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await nav.getByRole('button', { name: /^3 Effects$/ }).click();
  await book(p).getByRole('heading', { name: 'Damage', exact: true }).click(); await book(p).locator('.damage-effects-container').getByRole('textbox').first().fill(c.now);
  await book(p).getByRole('heading', { name: 'Control', exact: true }).click();
  await book(p).getByRole('button', { name: /^Use composed effect profile/ }).click();
  const fields = book(p).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
  await fields.getByLabel(/^Canonical effect/).selectOption('periodic');
  await fields.getByLabel(/^Effect name shown on the target/).fill(c.label);
  await fields.getByLabel(/^Each tick/).selectOption('damage');
  await fields.getByLabel(/^Tick amount/).fill(c.formula);
  await fields.getByLabel(/^Damage type/).selectOption(c.damageType);
  await fields.getByLabel(/^Tick roll/).selectOption('each-tick');
  await fields.getByLabel(/^Ticks/).selectOption(c.policy);
  const count = fields.getByLabel(/^Number of ticks/); await count.waitFor(); await count.fill(String(c.ticks));
  await fields.getByLabel(/^Source-authored duration text/).fill(c.duration);
  await fields.getByLabel(/^Required GM adjudication note/).fill('GM resolves eligibility and range at the table before confirming.');
  await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click(); await book(p).getByText('Single Target', { exact: true }).click(); await book(p).getByText('Ranged', { exact: true }).click();
  const slider = book(p).getByRole('slider').first(); await slider.focus(); await slider.press('Home'); for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
  await book(p).getByText('Enemies', { exact: true }).click(); await book(p).getByText('Any Target', { exact: true }).click();
  await nav.getByRole('button', { name: /Resources$/ }).click(); await book(p).getByTitle('Standard magical energy', { exact: true }).click(); await book(p).getByTitle('Basic action economy', { exact: true }).click();
  const inputs = book(p).getByRole('spinbutton'); await inputs.nth(0).fill('1'); await inputs.nth(0).fill(String(c.mana)); await inputs.nth(1).fill('1'); await inputs.nth(1).fill(String(c.ap));
  await nav.getByRole('button', { name: /Cooldown$/ }).click(); await book(p).getByRole('button', { name: 'Authenticated Caster Starts', exact: true }).click();
  await book(p).getByLabel('Caster-turn starts to count (1–10)', { exact: true }).fill(String(c.cooldown));
  await book(p).getByText(/1 strictly upcoming caster-turn start\b/).waitFor();
  report.checks.wizardCooldownText = await book(p).getByText(/optionally with one periodic effect of the same kind/).innerText();
  save('wizard-cooldown.aria.yml', await book(p).ariaSnapshot());
  await p.getByRole('button', { name: '✓ Complete Spell', exact: true }).click({ force: true });
  await p.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), c.name);
  const r = await savedRecord(p, c.name); save('wizard-saved.json', r);
  assert.deepEqual(r.authoredDraft.cooldownConfig, { cooldownType: cooldown.TYPE, cooldownValue: c.cooldown });
  const mapped = pure.definitionFromWizard(r, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' }); assert.equal(mapped.ok, true, JSON.stringify(mapped));
  assert.deepEqual(mapped.definition.cooldown, { cooldownType: cooldown.TYPE, cooldownValue: c.cooldown });
  assert.deepEqual([mapped.definition.timing.expiryPolicy, mapped.definition.timing.occurrences], [c.policy, c.ticks], 'the tick count is authored separately from the cooldown');
  report.checks.definitionSummary = pure.definitionSummary(mapped.definition);
  await closeBook(p);
  return r;
}
async function admitForPc(p, name, original) {
  await openBook(p); await book(p).getByRole('button', { name: 'Spell Library', exact: true }).click(); await book(p).getByText(name, { exact: true }).click();
  const section = p.getByRole('region', { name: `Room admission for ${name}`, exact: true }); await section.waitFor();
  assert.deepEqual(await savedRecord(p, name), original, 'save/reopen preserved the whole record');
  report.checks.admissionText = await section.innerText();
  await section.getByRole('button', { name: 'Admit this saved version', exact: true }).click(); await section.getByText(/^Admitted for /).waitFor();
  save('admitted.aria.yml', await section.ariaSnapshot());
  await p.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click({ timeout: 3000 }).catch(() => p.keyboard.press('Escape'));
}
async function tokenLocator(p, id) {
  await p.waitForFunction(id => Array.from(document.querySelectorAll('.creature-token')).some(el => { let f = el[Object.keys(el).find(k => k.startsWith('__reactFiber'))]; for (; f; f = f.return) if (f.memoizedProps?.tokenId === id) { el.dataset.ccToken = id; return true; } return false; }), id);
  return p.locator(`[data-cc-token="${id}"]`);
}

async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_bind', 'actor_spell_prepare_creature', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw',
    'actor_turn_boundary', 'actor_periodic_resolve', 'combat_started', 'combat_ended', 'token_created', 'join_room', 'token_moved']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const pages = {}, contexts = {};
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner']]) {
      const dir = path.join(out, 'profiles', role); fs.mkdirSync(dir, { recursive: true });
      const ctx = contexts[role] = await chromium.launchPersistentContext(dir, { headless: true, viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const page = pages[role] = ctx.pages()[0] || await ctx.newPage(); page.on('pageerror', e => report.errors.push({ role, message: e.message })); patchClick(page);
      await setup(page, host.url, uid);
    }
    const { gm, owner } = pages;

    step('Wizard author/save/reopen/admit: immediate arcane 1d6+2 + periodic arcane 1d4 × 3 target-start ticks + authenticated caster-start cooldown N = 1');
    const spec = { name: 'CC Ember Scourge', label: 'Scourge', now: '1d6+2', formula: '1d4', damageType: 'arcane', policy: 'target-start-count', ticks: 3, cooldown: 1, duration: 'While the scourge smoulders', ap: 1, mana: 2 };
    const record = await author(gm, spec); await admitForPc(gm, spec.name, record); await setup(gm, host.url, 'app-gm');
    report.checks.ownerHydration = (await setup(owner, host.url, 'app-owner')).hydration;
    stage('author/save/reopen/admit', 'App controls (Spell Wizard incl. Cooldown step, Spell Library, room admission)');

    step('start combat with A and B; enable authenticated turn expiry');
    try {
      const nav = gm.locator('[title^="Combat Initiator"]').first();
      if (await nav.count() && await nav.isVisible()) await nav.click(); else { await gm.locator('body').click({ position: { x: 700, y: 500 } }).catch(() => {}); await gm.keyboard.press('x'); }
      await gm.getByRole('button', { name: /^Begin Combat \(0\)$/ }).waitFor({ timeout: 8000 });
      for (const id of ['A', 'B']) { const t = await tokenLocator(gm, id); const box = await t.boundingBox(); await gm.mouse.click(box.x + box.width / 2, box.y + box.height / 2); }
      await gm.getByRole('button', { name: /^Begin Combat \(2\)$/ }).click();
      assert.equal(await wait(() => host.room.gameState.combat?.isActive), true);
      stage('combat start', 'App control (Combat Initiator)');
    } catch (e) {
      report.qualifications.push(`Combat start through the Combat Initiator failed (${String(e.message).split('\n')[0]}); started by the same combat_started socket event the App emits. Not counted as an App-control pass.`);
      const r = await gm.evaluate(p => new Promise(res => __socket.emit('combat_started', p, res)), { roomId: host.room.id, turnOrder: [host.refs.A, host.refs.B].map(actorRef => ({ tokenId: actorRef.tokenId, actorRef })), currentTurnIndex: 0, round: 1 });
      assert.equal(r.success, true, JSON.stringify(r)); stage('combat start', 'socket event (qualified)');
    }
    await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click(); await clockUI(gm).getByRole('button', { name: 'Enable authenticated turn expiry', exact: true }).click();
    assert.ok(await wait(() => host.room.gameState.combat?.effectLifecycle));
    const closeEditor = () => gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).last().click().catch(() => {});
    await closeEditor();
    const combat = () => host.room.gameState.combat, seqNow = () => combat().effectLifecycle.sequence;
    report.checks.roster = combat().turnOrder.map(e => e.tokenId);
    const openClock = async() => { if (!await clockUI(gm).count()) await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click(); await clockUI(gm).waitFor(); };
    const advance = async() => { const before = seqNow(); await openClock(); await clockUI(gm).getByRole('button', { name: 'Advance authenticated turn', exact: true }).click();
      assert.ok(await wait(() => seqNow() === before + 1), 'advance accepted'); await closeEditor(); return before + 1; };
    // The cooldown counts the CASTER's (PC) turn starts. A combat with only A and B has no PC entry, so the cooldown would refuse
    // (cooldown_source_not_in_roster). The PC therefore joins the roster: the fixture roster is [A, B] + pc when the App start used A/B.
    if (!combat().turnOrder.some(e => e.tokenId === 'pc')) {
      report.qualifications.push('The ordinary Combat Initiator selection here picks creature tokens A and B only; the caster PC must be in the authenticated roster for a caster-start cooldown, so combat is restarted with roster [pc, A, B] through the same registered combat_started event, then the clock is re-enabled with the ordinary GM control.');
      assert.equal((await gm.evaluate(roomId => new Promise(res => __socket.emit('combat_ended', { roomId }, res)), host.room.id)).success, true);
      const r = await gm.evaluate(p => new Promise(res => __socket.emit('combat_started', p, res)), { roomId: host.room.id, turnOrder: [host.refs.pc, host.refs.A, host.refs.B].map(actorRef => ({ tokenId: actorRef.tokenId, actorRef })), currentTurnIndex: 0, round: 1 });
      assert.equal(r.success, true, JSON.stringify(r));
      await openClock(); await clockUI(gm).getByRole('button', { name: 'Enable authenticated turn expiry', exact: true }).click(); assert.ok(await wait(() => combat().effectLifecycle?.id && seqNow() === 0)); await closeEditor();
      report.checks.roster = combat().turnOrder.map(e => e.tokenId);
    }
    assert.equal(combat().turnOrder[combat().currentTurnIndex].tokenId, 'pc', 'the PC acts first'); const s0 = seqNow(); report.checks.sequenceAtCast = s0;
    stage('authenticated clock', 'App control (Enable authenticated turn expiry)');

    const lib = owner.getByRole('region', { name: 'Admitted abilities', exact: true });
    const openCast = async() => {
      if (await ownerDialog(owner).count()) await ownerDialog(owner).getByRole('button', { name: 'Close', exact: true }).click().catch(() => {});
      if (!await lib.count()) await owner.locator('summary').filter({ hasText: /^Admitted abilities$/ }).click();
      await lib.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
      await lib.locator('.p9-admitted-row').filter({ hasText: spec.name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
      const od = ownerDialog(owner); await od.waitFor(); await od.getByRole('heading', { name: spec.name, exact: true }).waitFor();
      await od.getByRole('combobox', { name: 'Target', exact: true }).selectOption({ label: 'B · creature · B' }); return od;
    };
    const recordRoll = async(od, face) => {
      const field = od.getByLabel('d6 face 1', { exact: true });
      if (await field.count()) { await field.fill(String(face)); await od.getByRole('button', { name: 'Record physical roll', exact: true }).click(); }
    };
    const approveButton = od => od.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true });

    step('owner opens the cast: cooldown ready, procedure and periodic separation stated; records d6 face 5; approves (nothing spent)');
    let od = await openCast(); await od.getByText(/Cooldown ready\./).waitFor();
    report.checks.ownerReadyText = await od.innerText(); assert.match(report.checks.ownerReadyText, /1 strictly upcoming caster-turn start\./); assert.match(report.checks.ownerReadyText, /Separate from the periodic effect/);
    save('owner-ready.aria.yml', await od.ariaSnapshot());
    await recordRoll(od, 5); const beforeApprove = actors.clone(host.room.gameState.maps);
    await approveButton(od).click(); await od.getByText(/Awaiting GM adjudication/).waitFor(); assert.deepEqual(host.room.gameState.maps, beforeApprove, 'approval spends nothing');

    step('GM confirms with the ACK and accepted broadcast dropped once; GM reloads; "Check same command" recovers the original receipt');
    const card = gm.locator('.p9-gm-card').filter({ hasText: spec.name }).first(); await card.waitFor();
    await card.getByLabel('GM timing clarification (required)', { exact: true }).fill('Table ruling: in range, no save.');
    await card.getByLabel('Private manual resolution evidence', { exact: true }).fill('SECRET-CC GM evidence: range 25 ft');
    await card.getByRole('checkbox', { name: /I resolved eligibility/ }).check(); await card.getByLabel(/^Final damage/).fill('7');
    report.checks.gmCardText = await card.innerText(); save('gm-card.aria.yml', await card.ariaSnapshot());
    await gm.evaluate(() => { const emit = __socket.emit.bind(__socket); let drop = true; window.__ccDrop = true;
      __socket.emit = (e, ...args) => { if (drop && e === 'actor_consequence' && String(args[0]?.adjudication?.definitionVersionOrHash).startsWith('authored-effect:v1/') && typeof args[args.length - 1] === 'function') { drop = false; args[args.length - 1] = () => {}; } return emit(e, ...args); };
      const onevent = __socket.onevent.bind(__socket); __socket.onevent = packet => { if (window.__ccDrop && ['actor_consequence_accepted'].includes(packet?.data?.[0]) && String(packet?.data?.[1]?.receipt?.adjudication?.definitionVersionOrHash).startsWith('authored-effect:v1/')) { window.__ccDrop = false; return; } return onevent(packet); }; });
    report.qualifications.push('Lost delivery of the cast is simulated in the GM page (ACK callback and that GM\'s accepted broadcast dropped once); server, writer and recovery path unmodified.');
    const hpBefore = hpOf(host), poolBefore = pool(host), n = actors.ledger(host.room).receipts.length;
    await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    assert.ok(await wait(() => actors.ledger(host.room).receipts.length === n + 1), 'cast accepted once by the server');
    const castReceipt = actors.ledger(host.room).receipts.at(-1), paid = pool(host);
    const items = Object.values(cds(host)); assert.equal(items.length, 1, 'one cooldown');
    report.checks.cast = { commandId: castReceipt.commandId, cooldown: items[0], hpBefore, hpAfter: hpOf(host), poolBefore, poolAfter: paid };
    assert.equal(items[0].commandId, castReceipt.commandId, 'the cooldown starts in the same receipt');
    assert.deepEqual([items[0].startSequence, items[0].dueSequence, items[0].occurrences, items[0].period], [s0, s0 + 3, 1, 3], 'N=1 at the PC\'s ongoing turn → its next start');
    assert.equal(paid.mana.current + paid.mana.temp, poolBefore.mana.current + poolBefore.mana.temp - spec.mana); assert.equal(paid.ap.current + paid.ap.temp, poolBefore.ap.current + poolBefore.ap.temp - spec.ap);
    assert.deepEqual(hpOf(host), { current: hpBefore.current - (7 - Math.min(7, hpBefore.temp)), temp: Math.max(0, hpBefore.temp - 7) });
    const inst = ticking(host); assert.equal(inst.length, 1, 'one periodic instance');
    const sched = timing.scheduleFor(inst[0], combat()); assert.deepEqual([sched.occurrences, sched.boundary], [3, 'start']);
    assert.equal(due(host).length, 0);
    const original = await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload);
    const afterCast = actors.clone(host.room.gameState);
    await gm.reload(); await setup(gm, host.url, 'app-gm');
    const check = gm.getByRole('button', { name: 'Check same command', exact: true }).first(); await check.waitFor({ timeout: 35000 }); await check.click();
    await gm.getByText(/Accepted · /).first().waitFor({ timeout: 35000 });
    assert.deepEqual(await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload), original, 'the exact original command was re-sent');
    assert.equal(actors.ledger(host.room).receipts.filter(r => r.commandId === original.commandId).length, 1, 'one receipt');
    assert.deepEqual(host.room.gameState.maps, afterCast.maps, 'recovery applied nothing twice (cooldown included)');
    stage('cast', 'App controls (owner panel + GM card); payment, immediate HP, periodic install and cooldown start server-authoritative in one receipt');
    stage('lost-ACK recovery', 'App control after GM reload (Check same command)');

    step('cooldown active; blocked reuse spends nothing; owner reload keeps it');
    od = ownerDialog(owner); await od.getByText(/Cooldown active: 1 of 1 caster-turn starts remaining; releases at authenticated boundary 3/).waitFor({ timeout: 35000 });
    save('owner-cooldown-active.aria.yml', await od.ariaSnapshot());
    od = await openCast(); await recordRoll(od, 3);
    const blockedBefore = actors.clone(host.room.gameState);
    await approveButton(od).click(); await od.getByText(/Not registered \(ability on cooldown\) — no payment was recorded\./).waitFor({ timeout: 20000 });
    assert.deepEqual(host.room.gameState, blockedBefore, 'blocked reuse changed nothing'); stage('blocked reuse', 'App control (owner approve → server refusal, no spend)');
    await owner.reload(); await setup(owner, host.url, 'app-owner'); od = await openCast();
    await od.getByText(/1 of 1 caster-turn starts remaining; releases at authenticated boundary 3/).waitFor({ timeout: 20000 }); stage('owner reload', 'App reload; cooldown read from the authoritative room');

    step('advance (A) → advance (B starts): tick 1 of 3 recorded; GM resolves it with its own d4; cooldown unchanged');
    await advance(); const cdMid = cds(host); await advance(); assert.equal(seqNow(), s0 + 2); assert.equal(due(host).length, 1);
    await openClock(); const row1 = ticksUI(gm).getByRole('group', { name: 'Due tick 1 of 3 — Scourge', exact: true }); await row1.waitFor();
    await row1.getByLabel('d4 #1', { exact: true }).fill('3'); await row1.getByRole('button', { name: 'Apply tick 1 of 3', exact: true }).click();
    assert.ok(await wait(() => due(host).length === 0), 'tick consumed'); await closeEditor();
    assert.deepEqual(cds(host), cdMid, 'tick resolution neither restarts nor extends the cooldown'); assert.deepEqual(cds(host), Object.fromEntries(Object.entries(afterCast.maps['app-hall'].characterTokens.pc.state.authoredCooldowns)));
    await od.getByText(/1 of 1 caster-turn starts remaining/).waitFor(); stage('periodic resolution', 'App control (Apply tick, own physical roll)');

    step('advance → the PC\'s next turn start (3): the cooldown releases; the periodic instance and its schedule stay (2 ticks left)');
    const instBefore = actors.clone(ticking(host)), schedBefore = actors.clone(combat().effectLifecycle.schedules);
    await advance(); assert.equal(seqNow(), s0 + 3); assert.deepEqual(cds(host), {}, 'released by the authenticated boundary');
    assert.deepEqual(ticking(host), instBefore, 'release did not cancel the periodic effect'); assert.deepEqual(combat().effectLifecycle.schedules, schedBefore);
    await od.getByText(/Cooldown ready\./).waitFor({ timeout: 20000 }); save('owner-cooldown-released.aria.yml', await od.ariaSnapshot());
    report.checks.separation = { cooldownReleasedAt: s0 + 3, ticksRemainingAtRelease: 2, authored: { cooldownValue: spec.cooldown, ticks: spec.ticks } };
    stage('cooldown release', 'App control (Advance authenticated turn)');

    step('remaining ticks 2 and 3 arrive and are resolved; the last tick ends the instance');
    await advance(); await advance(); assert.equal(seqNow(), s0 + 5); assert.equal(due(host).length, 1);
    await openClock(); const row2 = ticksUI(gm).getByRole('group', { name: 'Due tick 2 of 3 — Scourge', exact: true }); await row2.waitFor();
    await row2.getByLabel('d4 #1', { exact: true }).fill('2'); await row2.getByRole('button', { name: 'Apply tick 2 of 3', exact: true }).click(); assert.ok(await wait(() => due(host).length === 0)); await closeEditor();
    await advance(); await advance(); await advance(); assert.equal(seqNow(), s0 + 8); assert.equal(due(host).length, 1); assert.equal(due(host)[0].final, true); assert.equal(ticking(host).length, 0);
    await openClock(); const row3 = ticksUI(gm).getByRole('group', { name: 'Due tick 3 of 3 — Scourge', exact: true }); await row3.waitFor();
    await row3.getByLabel('d4 #1', { exact: true }).fill('4'); await row3.getByRole('button', { name: 'Apply tick 3 of 3', exact: true }).click(); assert.ok(await wait(() => due(host).length === 0)); await closeEditor();
    assert.deepEqual(pool(host), paid, 'no per-tick payment');

    step('advance to the PC\'s turn (9); legal reuse: one new payment, receipt and cooldown');
    await advance(); assert.equal(combat().turnOrder[combat().currentTurnIndex].tokenId, 'pc');
    // Existing rule (unchanged): the recorded roll from the refused attempt stays with this spell (face 3 → 5) and is reused, never rerolled.
    od = await openCast(); await od.getByText(/Cooldown ready\./).waitFor(); report.checks.retainedRollReused = !(await od.getByLabel('d6 face 1', { exact: true }).count()); await recordRoll(od, 4); await approveButton(od).click(); await od.getByText(/Awaiting GM adjudication/).waitFor();
    const card2 = gm.locator('.p9-gm-card').filter({ hasText: spec.name }).first(); await card2.waitFor();
    await card2.getByLabel('GM timing clarification (required)', { exact: true }).fill('Table ruling: in range.'); await card2.getByLabel('Private manual resolution evidence', { exact: true }).fill('SECRET-CC second');
    const recorded = Number((await card2.innerText()).match(/physical \[[\d, ]+\] \+ 2 =\s*(\d+)/)[1]); report.checks.reuseRecordedTotal = recorded;
    await card2.getByRole('checkbox', { name: /I resolved eligibility/ }).check(); await card2.getByLabel(/^Final damage/).fill(String(recorded));
    const n2 = actors.ledger(host.room).receipts.length; await card2.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    assert.ok(await wait(() => actors.ledger(host.room).receipts.length === n2 + 1)); const second = Object.values(cds(host));
    assert.equal(second.length, 1); assert.equal(second[0].startSequence, seqNow()); assert.equal(second[0].dueSequence, seqNow() + 3); assert.equal(ticking(host).length, 1);
    await ownerDialog(owner).getByText(new RegExp(`releases at authenticated boundary ${seqNow() + 3}`)).waitFor({ timeout: 35000 });
    stage('legal reuse', 'App controls (owner panel + GM card)');
    report.checks.ownerCasts = actors.ledger(host.room).receipts.filter(r => r.authorization?.kind === 'owner-approval-gm').length; assert.equal(report.checks.ownerCasts, 2);
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }]) { await owner.setViewportSize(viewport); await owner.screenshot({ path: path.join(out, `owner-final-${viewport.width}.png`) }); }
    report.passed = true;
  } catch (e) {
    report.failure = e.stack;
    for (const [role, p] of Object.entries(pages)) { save(`failure-${role}.aria.yml`, await p.locator('body').ariaSnapshot().catch(() => 'unavailable')); await p.screenshot({ path: path.join(out, `failure-${role}.png`) }).catch(() => {}); }
    throw e;
  } finally {
    report.endedAt = new Date().toISOString(); report.build = process.env.APP_BUILD_DIR;
    report.buildAssetManifestSha256 = crypto.createHash('sha256').update(fs.readFileSync(path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json'))).digest('hex');
    report.receipts = actors.ledger(host.room).receipts.map(r => actors.publicReceipt(r));
    save('result.json', report); for (const c of Object.values(contexts)) await c.close().catch(() => {}); await host.stop();
  }
}
if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
module.exports = { main };
