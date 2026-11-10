// Effect cooldowns witness: the installed authenticated caster-start cooldown reused on (1) a STANDALONE periodic effect and (2) a
// movement rider with its existing immediate damage part. Ordinary App journey for both: Spell Wizard author (incl. Cooldown step) /
// save / reopen / admit → owner cast + GM confirm (payment, effect install and cooldown start in one receipt) → blocked reuse with no
// spending → owner reload → separate tick rolls / rider expiry never touch the cooldown → authenticated boundary release that leaves
// the effect in place → lost GM ACK + GM reload + "Check same command" recovers the original command once → legal reuse.
// Provider/identity/ownership/lease/cloud are fixture boundaries; anything outside App controls is a qualification.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.EC_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External EC_OUTPUT and APP_BUILD_DIR required');
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
    'Wizard primitives only. No catalogue record, pin or stripped catalogue demonstration.'] };
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

/** Shared Spell Wizard path; `c.kind` = 'periodic' (no immediate part) or 'movement' (immediate damage + movement rider). */
async function author(p, c) {
  await openBook(p);
  await book(p).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(c.name);
  await book(p).getByRole('textbox', { name: 'Description * *', exact: true }).fill(`Disposable effect-cooldown witness (${c.kind}).`);
  await book(p).getByText('Arcane', { exact: true }).click();
  const nav = book(p).getByRole('navigation', { name: 'Spell wizard steps' });
  await nav.getByRole('button', { name: /Spell Type$/ }).click(); await book(p).getByRole('heading', { name: 'ACTION', exact: true }).click(); await book(p).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await nav.getByRole('button', { name: /^3 Effects$/ }).click();
  if (c.now) { await book(p).getByRole('heading', { name: 'Damage', exact: true }).click(); await book(p).locator('.damage-effects-container').getByRole('textbox').first().fill(c.now); }
  await book(p).getByRole('heading', { name: 'Control', exact: true }).click();
  await book(p).getByRole('button', { name: /^Use composed effect profile/ }).click();
  const fields = book(p).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
  await fields.getByLabel(/^Canonical effect/).selectOption(c.kind);
  await fields.getByLabel(/^Effect name shown on the target/).fill(c.label);
  if (c.kind === 'periodic') {
    await fields.getByLabel(/^Each tick/).selectOption('damage'); await fields.getByLabel(/^Tick amount/).fill(c.formula);
    await fields.getByLabel(/^Damage type/).selectOption(c.damageType); await fields.getByLabel(/^Tick roll/).selectOption('each-tick');
    await fields.getByLabel(/^Ticks/).selectOption(c.policy); const count = fields.getByLabel(/^Number of ticks/); await count.waitFor(); await count.fill(String(c.ticks));
  } else {
    await fields.getByLabel(/^Movement change/).fill(String(c.feet)); await fields.getByLabel(/^Expiry/).selectOption(c.policy);
  }
  await fields.getByLabel(/^Source-authored duration text/).fill(c.duration);
  await fields.getByLabel(/^Required GM adjudication note/).fill('GM resolves eligibility and range at the table before confirming.');
  await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click(); await book(p).getByText('Single Target', { exact: true }).click(); await book(p).getByText('Ranged', { exact: true }).click();
  const slider = book(p).getByRole('slider').first(); await slider.focus(); await slider.press('Home'); for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
  await book(p).getByText('Enemies', { exact: true }).click(); await book(p).getByText('Any Target', { exact: true }).click();
  await nav.getByRole('button', { name: /Resources$/ }).click(); await book(p).getByTitle('Standard magical energy', { exact: true }).click(); await book(p).getByTitle('Basic action economy', { exact: true }).click();
  const inputs = book(p).getByRole('spinbutton'); await inputs.nth(0).fill('1'); await inputs.nth(0).fill(String(c.mana)); await inputs.nth(1).fill('1'); await inputs.nth(1).fill(String(c.ap));
  await nav.getByRole('button', { name: /Cooldown$/ }).click(); await book(p).getByRole('button', { name: 'Authenticated Caster Starts', exact: true }).click();
  await book(p).getByLabel('Caster-turn starts to count (1–10)', { exact: true }).fill(String(c.cooldown));
  await book(p).getByText(new RegExp(`${c.cooldown} strictly upcoming caster-turn start`)).first().waitFor();
  (report.checks.wizardCooldownText ||= {})[c.name] = await book(p).getByText(/a periodic effect on its own; or a movement or Stunned effect/).innerText();
  save(`wizard-cooldown-${c.kind}.aria.yml`, await book(p).ariaSnapshot());
  await p.getByRole('button', { name: '✓ Complete Spell', exact: true }).click({ force: true });
  await p.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), c.name);
  const r = await savedRecord(p, c.name); save(`wizard-saved-${c.kind}.json`, r);
  assert.deepEqual(r.authoredDraft.cooldownConfig, { cooldownType: cooldown.TYPE, cooldownValue: c.cooldown });
  const mapped = pure.definitionFromWizard(r, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' }); assert.equal(mapped.ok, true, JSON.stringify(mapped));
  assert.deepEqual(mapped.definition.cooldown, { cooldownType: cooldown.TYPE, cooldownValue: c.cooldown });
  if (c.kind === 'periodic') assert.equal(mapped.definition.effects.direct, null, 'a standalone periodic effect has no immediate part');
  else assert.deepEqual(mapped.definition.effects.condition, { kind: 'movement', feet: c.feet, label: c.label });
  (report.checks.definitionSummary ||= {})[c.name] = pure.definitionSummary(mapped.definition);
  await closeBook(p);
  return r;
}
async function admitForPc(p, name, original) {
  await openBook(p); await book(p).getByRole('button', { name: 'Spell Library', exact: true }).click(); await book(p).getByText(name, { exact: true }).click();
  const section = p.getByRole('region', { name: `Room admission for ${name}`, exact: true }); await section.waitFor();
  assert.deepEqual(await savedRecord(p, name), original, 'save/reopen preserved the whole record');
  (report.checks.admissionText ||= {})[name] = await section.innerText();
  await section.getByRole('button', { name: 'Admit this saved version', exact: true }).click(); await section.getByText(/^Admitted for /).waitFor();
  save(`admitted-${name.replace(/\W+/g, '-')}.aria.yml`, await section.ariaSnapshot());
  await p.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click({ timeout: 3000 }).catch(() => p.keyboard.press('Escape'));
}
async function tokenLocator(p, id) {
  await p.waitForFunction(id => Array.from(document.querySelectorAll('.creature-token')).some(el => { let f = el[Object.keys(el).find(k => k.startsWith('__reactFiber'))]; for (; f; f = f.return) if (f.memoizedProps?.tokenId === id) { el.dataset.ccToken = id; return true; } return false; }), id);
  return p.locator(`[data-cc-token="${id}"]`);
}

const moves = host => B(host).state.conditions.filter(profile.isMovementModifier);
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
    // Explicit authoring values chosen so each lifetime visibly differs from its cooldown.
    const P = { kind: 'periodic', name: 'EC Wasting Brand', label: 'Wasting', formula: '1d4', damageType: 'arcane', policy: 'target-start-count', ticks: 3, cooldown: 1, duration: 'While the brand smoulders', ap: 1, mana: 2 };
    const M = { kind: 'movement', name: 'EC Mire Lash', label: 'Mired', now: '1d6+2', feet: -10, policy: 'target-next-end', cooldown: 2, duration: 'Until the mire dries', ap: 1, mana: 2 };

    step('Wizard author/save/reopen/admit: (1) periodic-only arcane 1d4 × 3 target-start ticks, cooldown N=1; (2) 1d6+2 now + Mired −10 ft until the end of the target\'s next turn, cooldown N=2');
    const recP = await author(gm, P); const recM = await author(gm, M);
    await admitForPc(gm, P.name, recP); await setup(gm, host.url, 'app-gm'); await admitForPc(gm, M.name, recM); await setup(gm, host.url, 'app-gm');
    report.checks.ownerHydration = (await setup(owner, host.url, 'app-owner')).hydration;
    stage('author/save/reopen/admit', 'App controls (Spell Wizard incl. Cooldown step, Spell Library, room admission) — both abilities');

    step('combat [pc, A, B] + authenticated turn expiry');
    const combat = () => host.room.gameState.combat, seqNow = () => combat().effectLifecycle.sequence;
    const closeEditor = () => gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).last().click().catch(() => {});
    const openClock = async() => { if (!await clockUI(gm).count()) await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click(); await clockUI(gm).waitFor(); };
    report.qualifications.push('A caster-start cooldown needs the PC in the authenticated roster; the roster [pc, A, B] is started through the registered combat_started event the App emits (same qualification as the composed-cooldown witness); the clock is enabled and advanced with ordinary GM controls.');
    const started = await gm.evaluate(p => new Promise(res => __socket.emit('combat_started', p, res)), { roomId: host.room.id, turnOrder: [host.refs.pc, host.refs.A, host.refs.B].map(actorRef => ({ tokenId: actorRef.tokenId, actorRef })), currentTurnIndex: 0, round: 1 });
    assert.equal(started.success, true, JSON.stringify(started));
    await openClock(); await clockUI(gm).getByRole('button', { name: 'Enable authenticated turn expiry', exact: true }).click(); assert.ok(await wait(() => combat().effectLifecycle?.id && seqNow() === 0)); await closeEditor();
    report.checks.roster = combat().turnOrder.map(e => e.tokenId); assert.equal(combat().turnOrder[combat().currentTurnIndex].tokenId, 'pc');
    const advance = async() => { const before = seqNow(); await openClock(); await clockUI(gm).getByRole('button', { name: 'Advance authenticated turn', exact: true }).click();
      assert.ok(await wait(() => seqNow() === before + 1), 'advance accepted'); await closeEditor(); return before + 1; };
    const advanceTo = async n => { while (seqNow() < n) await advance(); };
    stage('authenticated clock', 'App control (Enable / Advance authenticated turn)');

    const lib = owner.getByRole('region', { name: 'Admitted abilities', exact: true });
    const openCast = async name => {
      if (await ownerDialog(owner).count()) await ownerDialog(owner).getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => {});
      if (!await lib.count()) await owner.locator('summary').filter({ hasText: /^Admitted abilities$/ }).click();
      await lib.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
      await lib.locator('.p9-admitted-row').filter({ hasText: name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
      const od = ownerDialog(owner); await od.waitFor(); await od.getByRole('heading', { name, exact: true }).waitFor();
      await od.getByRole('combobox', { name: 'Target', exact: true }).selectOption({ label: 'B · creature · B' }); return od;
    };
    const recordRoll = async(od, face) => { const field = od.getByLabel('d6 face 1', { exact: true }); if (await field.count()) { await field.fill(String(face)); await od.getByRole('button', { name: 'Record physical roll', exact: true }).click(); } };
    const approveButton = od => od.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true });
    const gmCard = name => gm.locator('.p9-gm-card').filter({ hasText: name }).first();
    async function fillCard(name, finalDamage) {
      const card = gmCard(name); await card.waitFor();
      await card.getByLabel('GM timing clarification (required)', { exact: true }).fill('Table ruling: in range, no save.');
      const evidence = card.getByLabel('Private manual resolution evidence', { exact: true }); if (await evidence.count()) await evidence.fill('SECRET-EC GM evidence: range 25 ft');
      await card.getByRole('checkbox', { name: /I resolved eligibility/ }).check();
      if (finalDamage !== undefined) await card.getByLabel(/^Final damage/).fill(String(finalDamage));
      return card;
    }
    const dropOnce = () => gm.evaluate(() => { const emit = __socket.emit.bind(__socket); let drop = true; window.__ecDrop = true;
      __socket.emit = (e, ...args) => { if (drop && e === 'actor_consequence' && String(args[0]?.adjudication?.definitionVersionOrHash).startsWith('authored-effect:v1/') && typeof args[args.length - 1] === 'function') { drop = false; args[args.length - 1] = () => {}; } return emit(e, ...args); };
      const onevent = __socket.onevent.bind(__socket); __socket.onevent = packet => { if (window.__ecDrop && packet?.data?.[0] === 'actor_consequence_accepted' && String(packet?.data?.[1]?.receipt?.adjudication?.definitionVersionOrHash).startsWith('authored-effect:v1/')) { window.__ecDrop = false; return; } return onevent(packet); }; });
    report.qualifications.push('Lost delivery is simulated in the GM page (ACK callback and that GM\'s accepted broadcast dropped once per recovery check); server, writer and recovery path unmodified.');
    /** Confirm once with a dropped ACK, reload the GM, recover with "Check same command"; returns the single receipt. */
    async function confirmWithRecovery(name, card, label) {
      await dropOnce(); const n = actors.ledger(host.room).receipts.length;
      await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
      assert.ok(await wait(() => actors.ledger(host.room).receipts.length === n + 1), 'cast accepted once by the server');
      const receipt = actors.ledger(host.room).receipts.at(-1), after = actors.clone(host.room.gameState.maps);
      const original = await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload);
      await gm.reload(); await setup(gm, host.url, 'app-gm');
      const scoped = gmCard(name).getByRole('button', { name: 'Check same command', exact: true });
      const check = await scoped.count().catch(() => 0) ? scoped : gm.getByRole('button', { name: 'Check same command', exact: true }).first();
      await check.waitFor({ timeout: 35000 }); await check.click(); await gm.getByText(/Accepted · /).first().waitFor({ timeout: 35000 });
      assert.deepEqual(await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload), original, 'the exact original command was re-sent');
      assert.equal(actors.ledger(host.room).receipts.filter(r => r.commandId === original.commandId).length, 1, 'one receipt');
      assert.deepEqual(host.room.gameState.maps, after, 'recovery applied nothing twice (cooldown included)');
      stage(`${label} lost-ACK recovery`, 'App control after GM reload (Check same command)');
      return receipt;
    }
    async function blockedReuse(name, face, label) {
      const od = await openCast(name); await recordRoll(od, face);
      const before = actors.clone(host.room.gameState);
      await approveButton(od).click(); await od.getByText(/Not registered \(ability on cooldown\) — no payment was recorded\./).waitFor({ timeout: 20000 });
      assert.deepEqual(host.room.gameState, before, 'blocked reuse changed nothing'); stage(`${label} blocked reuse`, 'App control (owner approve → server refusal, no spend)');
    }
    const resolveTick = async(n, face) => { await openClock(); const row = ticksUI(gm).getByRole('group', { name: `Due tick ${n} of 3 — Wasting`, exact: true }); await row.waitFor();
      await row.getByLabel('d4 #1', { exact: true }).fill(String(face)); await row.getByRole('button', { name: `Apply tick ${n} of 3`, exact: true }).click(); assert.ok(await wait(() => due(host).length === 0)); await closeEditor(); };

    // ── Deliverable 1: standalone periodic + cooldown ────────────────────────────────────────────────────────────────
    step('D1 owner opens the periodic-only cast: cooldown ready and separation stated; no roll at cast; approves (nothing spent)');
    let od = await openCast(P.name); await od.getByText(/Cooldown ready\./).waitFor();
    report.checks.periodicOwnerText = await od.innerText(); assert.match(report.checks.periodicOwnerText, /1 strictly upcoming caster-turn start\./); assert.match(report.checks.periodicOwnerText, /Separate from the periodic effect/);
    assert.equal(await od.getByLabel('d6 face 1', { exact: true }).count(), 0, 'no immediate roll for a standalone periodic effect');
    save('d1-owner-ready.aria.yml', await od.ariaSnapshot());
    let beforeApprove = actors.clone(host.room.gameState.maps); await approveButton(od).click(); await od.getByText(/Awaiting GM adjudication/).waitFor(); assert.deepEqual(host.room.gameState.maps, beforeApprove, 'approval spends nothing');
    step('D1 GM confirms with dropped ACK → GM reload → Check same command; one receipt: payment, ONE periodic instance, cooldown start, no HP change');
    let hpBefore = hpOf(host), poolBefore = pool(host);
    let card = await fillCard(P.name); report.checks.d1GmCard = await card.innerText(); save('d1-gm-card.aria.yml', await card.ariaSnapshot());
    const r1 = await confirmWithRecovery(P.name, card, 'D1');
    let paid = pool(host), item = cds(host)[cooldown.key(host.refs.pc, recP.authoredDefinitionId)];
    assert.ok(item, 'cooldown recorded'); assert.equal(item.commandId, r1.commandId, 'cooldown starts in the cast receipt');
    assert.deepEqual([item.startSequence, item.dueSequence, item.occurrences, item.period], [0, 3, 1, 3]);
    assert.equal(paid.mana.current + paid.mana.temp, poolBefore.mana.current + poolBefore.mana.temp - P.mana); assert.equal(paid.ap.current + paid.ap.temp, poolBefore.ap.current + poolBefore.ap.temp - P.ap);
    assert.deepEqual(hpOf(host), hpBefore, 'no HP change at cast'); assert.equal(ticking(host).length, 1); assert.equal(due(host).length, 0);
    report.checks.d1Cast = { commandId: r1.commandId, cooldown: item, poolBefore, poolAfter: paid };
    stage('D1 cast', 'App controls (owner panel + GM card); payment, periodic install and cooldown start in one receipt');
    od = ownerDialog(owner); await od.getByText(/Cooldown active: 1 of 1 caster-turn starts remaining; releases at authenticated boundary 3/).waitFor({ timeout: 35000 });
    await blockedReuse(P.name, 3, 'D1');
    await owner.reload(); await setup(owner, host.url, 'app-owner'); od = await openCast(P.name);
    await od.getByText(/1 of 1 caster-turn starts remaining; releases at authenticated boundary 3/).waitFor({ timeout: 20000 }); stage('D1 owner reload', 'App reload; cooldown read from the authoritative room');
    step('D1 advance to B\'s start (2): tick 1 resolved with its own d4 at GM resolution; cooldown and pools unchanged');
    const cdHeld = cds(host); await advanceTo(2); assert.equal(due(host).length, 1); await resolveTick(1, 3);
    assert.deepEqual(cds(host), cdHeld, 'tick resolution never touches the cooldown'); assert.deepEqual(pool(host), paid, 'no per-tick payment');
    stage('D1 tick resolution', 'App control (Apply tick, own physical roll)');
    step('D1 advance → PC start (3): cooldown released; the instance and its schedule stay (2 ticks left)');
    const inst = actors.clone(ticking(host)), sched = actors.clone(combat().effectLifecycle.schedules);
    await advance(); assert.equal(seqNow(), 3); assert.equal(cds(host)[cooldown.key(host.refs.pc, recP.authoredDefinitionId)], undefined, 'released by the authenticated boundary');
    assert.deepEqual(ticking(host), inst); assert.deepEqual(combat().effectLifecycle.schedules, sched);
    await ownerDialog(owner).getByText(/Cooldown ready\./).waitFor({ timeout: 20000 }); save('d1-owner-released.aria.yml', await ownerDialog(owner).ariaSnapshot());
    report.checks.d1Separation = { cooldownReleasedAt: 3, ticksRemainingAtRelease: 2 };
    stage('D1 boundary release', 'App control (Advance authenticated turn)');

    // ── Deliverable 2: movement rider (+ immediate damage) + cooldown ──────────────────────────────────────────────────
    step('D2 owner opens the rider cast at the PC turn (3): cooldown ready and rider separation stated; records d6 face 5; approves (nothing spent)');
    od = await openCast(M.name); await od.getByText(/Cooldown ready\./).waitFor();
    report.checks.riderOwnerText = await od.innerText(); assert.match(report.checks.riderOwnerText, /2 strictly upcoming caster-turn starts\./); assert.match(report.checks.riderOwnerText, /Separate from the Mired effect/);
    report.checks.riderPcOptions = await od.getByRole('combobox', { name: 'Target', exact: true }).locator('option').allInnerTexts();
    assert.ok(!report.checks.riderPcOptions.some(t => /· character ·/.test(t)), 'no PC target offered on the cooldown route');
    save('d2-owner-ready.aria.yml', await od.ariaSnapshot());
    await recordRoll(od, 5); beforeApprove = actors.clone(host.room.gameState.maps);
    await approveButton(od).click(); await od.getByText(/Awaiting GM adjudication/).waitFor(); assert.deepEqual(host.room.gameState.maps, beforeApprove, 'approval spends nothing');
    step('D2 GM confirms (final 7) with dropped ACK → GM reload → Check same command; one receipt: payment, HP, rider and cooldown');
    hpBefore = hpOf(host); poolBefore = pool(host);
    card = await fillCard(M.name, 7); report.checks.d2GmCard = await card.innerText(); save('d2-gm-card.aria.yml', await card.ariaSnapshot());
    const r2 = await confirmWithRecovery(M.name, card, 'D2');
    paid = pool(host); const kM = cooldown.key(host.refs.pc, recM.authoredDefinitionId); item = cds(host)[kM];
    assert.ok(item); assert.equal(item.commandId, r2.commandId); assert.deepEqual([item.startSequence, item.dueSequence, item.occurrences, item.period], [3, 9, 2, 3], 'N=2 from the ongoing PC turn at 3: starts 6, 9');
    assert.equal(paid.mana.current + paid.mana.temp, poolBefore.mana.current + poolBefore.mana.temp - M.mana);
    assert.deepEqual(hpOf(host), { current: hpBefore.current - (7 - Math.min(7, hpBefore.temp)), temp: Math.max(0, hpBefore.temp - 7) });
    assert.equal(moves(host).length, 1, 'one Mired rider'); assert.equal(timing.scheduleFor(moves(host)[0], combat()).dueSequence, 6, 'rider ends at the end of B\'s next turn (6)');
    report.checks.d2Cast = { commandId: r2.commandId, cooldown: item, hpBefore, hpAfter: hpOf(host), poolBefore, poolAfter: paid };
    stage('D2 cast', 'App controls (owner panel + GM card); payment, immediate HP, rider install and cooldown start in one receipt');
    await blockedReuse(M.name, 4, 'D2');
    step('D2 advance to 5 (D1 tick 2 resolved), then 6: the rider expires; the D2 cooldown stays (1 of 2) and still blocks reuse');
    await advanceTo(5); await resolveTick(2, 2); const cdM = actors.clone(cds(host)[kM]);
    await advance(); assert.equal(seqNow(), 6); assert.equal(moves(host).length, 0, 'rider expired at its own boundary');
    assert.deepEqual(cds(host)[kM], cdM, 'rider expiry does not release the cooldown');
    await ownerDialog(owner).getByText(/Cooldown active: 1 of 2 caster-turn starts remaining; releases at authenticated boundary 9/).waitFor({ timeout: 20000 }).catch(async() => {
      od = await openCast(M.name); await od.getByText(/1 of 2 caster-turn starts remaining; releases at authenticated boundary 9/).waitFor({ timeout: 20000 }); });
    await blockedReuse(M.name, 4, 'D2 after rider expiry');
    step('D2 advance to 8 (final D1 tick resolved, instance ends), then 9: the D2 cooldown releases; legal reuse adds a new rider and a new cooldown once');
    await advanceTo(8); assert.equal(due(host)[0].final, true); await resolveTick(3, 1); assert.equal(ticking(host).length, 0);
    await advance(); assert.equal(seqNow(), 9); assert.equal(cds(host)[kM], undefined, 'released at 9');
    od = await openCast(M.name); await od.getByText(/Cooldown ready\./).waitFor(); await recordRoll(od, 4); await approveButton(od).click(); await od.getByText(/Awaiting GM adjudication/).waitFor();
    const card2 = gmCard(M.name); await card2.waitFor();
    const recorded = Number((await card2.innerText()).match(/physical \[[\d, ]+\] \+ 2 =\s*(\d+)/)[1]); report.checks.reuseRecordedTotal = recorded;
    await fillCard(M.name, recorded);
    const n2 = actors.ledger(host.room).receipts.length; await card2.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    assert.ok(await wait(() => actors.ledger(host.room).receipts.length === n2 + 1)); const again = cds(host)[kM];
    assert.deepEqual([again.startSequence, again.dueSequence], [9, 15]); assert.equal(moves(host).length, 1);
    stage('D2 boundary release + legal reuse', 'App controls (Advance authenticated turn, owner panel + GM card)');
    report.checks.ownerCasts = actors.ledger(host.room).receipts.filter(r => r.authorization?.kind === 'owner-approval-gm').length; assert.equal(report.checks.ownerCasts, 3);
    assert.equal(report.errors.length, 0, JSON.stringify(report.errors));
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
