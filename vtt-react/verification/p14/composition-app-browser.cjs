// M5 composition optimized production-App witness: ONE Wizard-authored ability = immediate damage (rolled at cast) + periodic
// damage ticks on ONE creature, through the shared combat engine. Real Spell Wizard (Damage + composed periodic effect, explicit
// start boundary + tick count) → library save/reopen → GM admission → owner cast with a physical immediate roll + GM confirmation
// (payment once, immediate HP and the periodic instance in one receipt) → authenticated turn advance → visible due tick → GM
// resolution with its own physical roll → lost-ACK + reload → retained "Check same tick command" → last tick ends the effect.
// ONE persistent browser profile per role (GM, owner, observer). Provider/identity/lease/cloud are fixture boundaries.
// Anything done outside ordinary App controls is recorded under `qualifications` and never counted as an App-path pass.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.M5C_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External M5C_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture'); process.env.A4_OUTPUT = path.join(out, 'producer');
const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');
async function setup(page, url, uid) {
  if (!page.__m5Fonts) {
    page.__m5Fonts = true; const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    page.goto = async(...args) => { await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {}); await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts); return goto(...args); };
  }
  return baseSetup(page, url, uid);
}
const actors = require('../../../server/services/actorConsequences');
const profile = require('../../src/services/sharedConditionProfile');
const timing = require('../../src/services/sharedEffectTiming');
const pure = require('../../src/services/authoredAbility');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { startedAt: new Date().toISOString(), checks: {}, qualifications: [], errors: [], steps: [], stages: {},
  limits: ['Real optimized App and registered backend; identity/provider/ownership/lease/cloud are fixture boundaries.',
    'Temporary room: accepted-live only. No live Firebase, deployment, physical second device or human tabletop claim.',
    'public/assets (images) were not part of this build input: icons may 404; recorded fetch errors are expected from that.'] };
function patchClick(page) {
  const L = Object.getPrototypeOf(page.locator('body')); if (L.__m5) return; L.__m5 = true; const click = L.click;
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
const hpOf = host => ({ current: B(host).state.currentHp, temp: B(host).state.tempHealth });
const ticking = host => B(host).state.conditions.filter(profile.isPeriodicTick);
const due = host => timing.dueTicks(host.room.gameState.combat);
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
/** Actual Spell Wizard: Damage (immediate, rolled at cast) + composed effect profile → periodic damage, explicit start boundary and tick count. */
async function author(p, c) {
  await openBook(p);
  await book(p).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(c.name);
  await book(p).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Disposable M5 composition witness: immediate damage now, then periodic damage ticks.');
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
  report.checks.wizardText = await fields.locator('p').allInnerTexts();
  await fields.getByLabel(/^Source-authored duration text/).fill(c.duration);
  await fields.getByLabel(/^Required GM adjudication note/).fill('GM resolves eligibility and range at the table before confirming.');
  await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click(); await book(p).getByText('Single Target', { exact: true }).click(); await book(p).getByText('Ranged', { exact: true }).click();
  const slider = book(p).getByRole('slider').first(); await slider.focus(); await slider.press('Home'); for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
  await book(p).getByText('Enemies', { exact: true }).click(); await book(p).getByText('Any Target', { exact: true }).click();
  await nav.getByRole('button', { name: /Resources$/ }).click(); await book(p).getByTitle('Standard magical energy', { exact: true }).click(); await book(p).getByTitle('Basic action economy', { exact: true }).click();
  const inputs = book(p).getByRole('spinbutton'); await inputs.nth(0).fill('1'); await inputs.nth(0).fill(String(c.mana)); await inputs.nth(1).fill('1'); await inputs.nth(1).fill(String(c.ap));
  await p.getByRole('button', { name: '✓ Complete Spell', exact: true }).click({ force: true });
  await p.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), c.name);
  const r = await savedRecord(p, c.name); save('wizard-saved.json', r);
  const mapped = pure.definitionFromWizard(r, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' }); assert.equal(mapped.ok, true, JSON.stringify(mapped));
  assert.deepEqual(mapped.definition.effects, { direct: { kind: 'damage', formula: c.now, damageTypes: [c.damageType] }, condition: { kind: 'periodic', tick: { kind: 'damage', formula: c.formula, damageTypes: [c.damageType] }, label: c.label, tickRoll: 'each-tick' } });
  report.checks.definitionSummary = pure.definitionSummary(mapped.definition);
  assert.deepEqual([mapped.definition.timing.expiryPolicy, mapped.definition.timing.occurrences], [c.policy, c.ticks]);
  await closeBook(p);
  return r;
}
async function admitForPc(p, name, original) {
  await openBook(p); await book(p).getByRole('button', { name: 'Spell Library', exact: true }).click(); await book(p).getByText(name, { exact: true }).click();
  const section = p.getByRole('region', { name: `Room admission for ${name}`, exact: true }); await section.waitFor();
  assert.deepEqual(await savedRecord(p, name), original, 'save/reopen preserved the whole record');
  await section.getByRole('button', { name: 'Admit this saved version', exact: true }).click(); await section.getByText(/^Admitted for /).waitFor();
  await p.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click({ timeout: 3000 }).catch(() => p.keyboard.press('Escape'));
}
async function tokenLocator(p, id) {
  await p.waitForFunction(id => Array.from(document.querySelectorAll('.creature-token')).some(el => { let f = el[Object.keys(el).find(k => k.startsWith('__reactFiber'))]; for (; f; f = f.return) if (f.memoizedProps?.tokenId === id) { el.dataset.m5Token = id; return true; } return false; }), id);
  return p.locator(`[data-m5-token="${id}"]`);
}
/** Periodic lines as a viewer reads them in the shared condition editor (Party HUD → exact attachment → editor). */
async function periodicView(p, id = 'B') {
  const controls = p.getByRole('region', { name: 'Actor attachment and consequences', exact: true });
  await controls.getByRole('combobox', { name: 'Exact room attachment', exact: true }).selectOption(`creature:${id}`);
  await controls.getByRole('button', { name: 'Edit selected shared conditions', exact: true }).click();
  const dialog = p.getByRole('dialog', { name: 'Edit selected shared conditions editor', exact: true }); await dialog.waitFor();
  await dialog.getByText(/^Stunned (inactive\.|active:)/).first().waitFor({ timeout: 15000 });
  const section = dialog.getByRole('region', { name: 'Active periodic effects', exact: true });
  const lines = await section.count() ? await section.locator('p').allInnerTexts() : [];
  await dialog.getByRole('button', { name: 'Close shared condition editor', exact: true }).click(); await dialog.waitFor({ state: 'detached' });
  return lines;
}

async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_bind', 'actor_spell_prepare_creature', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw',
    'actor_turn_boundary', 'actor_periodic_resolve', 'combat_started', 'combat_ended', 'token_created', 'join_room', 'token_moved']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const pages = {}, contexts = {};
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner'], ['observer', 'app-observer']]) {
      const dir = path.join(out, 'profiles', role); fs.mkdirSync(dir, { recursive: true });
      const ctx = contexts[role] = await chromium.launchPersistentContext(dir, { headless: true, viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const page = pages[role] = ctx.pages()[0] || await ctx.newPage(); page.on('pageerror', e => report.errors.push({ role, message: e.message })); patchClick(page);
      await setup(page, host.url, uid);
    }
    const { gm, owner, observer } = pages;

    step('Wizard author/save/reopen/admit: immediate arcane damage 1d6+2 + periodic arcane damage 1d4 (school Arcane: both types must match), three ticks at the start of the target\'s turns');
    const spec = { name: 'M5C Searing Gloom', label: 'Gloomrot', now: '1d6+2', formula: '1d4', damageType: 'arcane', policy: 'target-start-count', ticks: 3, duration: 'While the gloomrot festers', ap: 1, mana: 2 };
    const record = await author(gm, spec); await admitForPc(gm, spec.name, record); await setup(gm, host.url, 'app-gm');
    for (const p of [owner, observer]) await setup(p, host.url, p === owner ? 'app-owner' : 'app-observer');
    assert.doesNotMatch(report.checks.wizardText.join(' ').replace(/“One round”, seconds or other prose are not converted\./g, ''), /\bround\b/i, 'the Wizard never says "round" for the tick schedule (the generic prose disclaimer aside)');
    stage('author/save/reopen/admit', 'App controls (Spell Wizard, Spell Library, room admission)');

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
    const combat = () => host.room.gameState.combat, current = () => combat().turnOrder[combat().currentTurnIndex].tokenId, seqNow = () => combat().effectLifecycle.sequence;
    const openClock = async() => { if (!await clockUI(gm).count()) await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click(); await clockUI(gm).waitFor(); };
    const advance = async() => { const before = seqNow(); await openClock(); await clockUI(gm).getByRole('button', { name: 'Advance authenticated turn', exact: true }).click();
      assert.ok(await wait(() => seqNow() === before + 1), 'advance accepted'); await closeEditor(); return before + 1; };
    if (current() !== 'A') await advance();
    const s0 = seqNow(); report.checks.sequenceAtCast = s0;

    step('owner casts on B; GM confirms; payment once');
    const lib = owner.getByRole('region', { name: 'Admitted abilities', exact: true });
    if (!await lib.count()) await owner.locator('summary').filter({ hasText: /^Admitted abilities$/ }).click();
    await lib.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
    await lib.locator('.p9-admitted-row').filter({ hasText: spec.name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
    const od = ownerDialog(owner); await od.waitFor(); await od.getByRole('heading', { name: spec.name, exact: true }).waitFor(); await od.getByRole('combobox', { name: 'Target', exact: true }).selectOption({ label: 'B · creature · B' });
    assert.match(await od.innerText(), /periodic effect applies to one creature only/, 'PC refusal names the periodic route');
    await od.getByLabel('d6 face 1', { exact: true }).fill('4'); await od.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    report.checks.ownerText = await od.innerText(); save('owner-prepared.aria.yml', await od.ariaSnapshot());
    assert.match(report.checks.ownerText, /tick/i); assert.match(report.checks.ownerText, /paid once/i);
    assert.match(report.checks.ownerText, /immediate damage is rolled now and applied at cast/, 'the owner sees that the cast roll is the immediate part only');
    await od.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true }).click(); await od.getByText(/Awaiting GM adjudication/).waitFor();
    const card = gm.locator('.p9-gm-card').filter({ hasText: spec.name }).first(); await card.waitFor();
    await card.getByLabel('GM timing clarification (required)', { exact: true }).fill('Table ruling: in range, no save.');
    await card.getByLabel('Private manual resolution evidence', { exact: true }).fill('SECRET-M5C GM evidence: range 25 ft');
    await card.getByRole('checkbox', { name: /I resolved eligibility/ }).check();
    report.checks.finalDamageFieldBefore = await card.getByLabel(/^Final damage/).inputValue(); await card.getByLabel(/^Final damage/).fill('6'); // GM enters the rolled total (no adjustment)
    report.checks.gmCardText = await card.innerText(); save('gm-card.aria.yml', await card.ariaSnapshot());
    const hpBeforeCast = hpOf(host);
    const pcBefore = actors.clone(actors.resources(hall(host).characterTokens.pc, 'character'));
    const n = actors.ledger(host.room).receipts.length;
    await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    assert.ok(await wait(() => actors.ledger(host.room).receipts.length === n + 1), 'cast accepted');
    const pcPaid = actors.clone(actors.resources(hall(host).characterTokens.pc, 'character'));
    report.checks.payment = { before: pcBefore, after: pcPaid };
    assert.equal(pcPaid.mana.current + pcPaid.mana.temp, pcBefore.mana.current + pcBefore.mana.temp - spec.mana);
    const castReceipt = actors.ledger(host.room).receipts.at(-1), castChosen = JSON.parse(castReceipt.adjudication.chosenResult);
    report.checks.castReceipt = { commandId: castReceipt.commandId, finalAmount: castReceipt.adjudication.finalAmount, roll: castChosen.roll, direct: castChosen.direct, condition: castChosen.condition.kind };
    assert.equal(castChosen.roll.total, 6, 'immediate physical roll 4 + 2'); assert.equal(castReceipt.adjudication.finalAmount, 6);
    assert.deepEqual(hpOf(host), { current: hpBeforeCast.current - (6 - Math.min(6, hpBeforeCast.temp)), temp: Math.max(0, hpBeforeCast.temp - 6) }, 'immediate damage applied at cast, temp first');
    assert.equal(due(host).length, 0, 'the cast records no tick');
    stage('immediate result', 'server-authoritative HP change in the cast receipt (App controls: owner roll + GM confirm)');
    const rec = ticking(host)[0]; assert.ok(rec, 'one periodic instance on B'); assert.equal(rec.hasOverTimeEffect, false);
    assert.equal(rec.overTimeFormula, '1d4'); assert.ok(!JSON.stringify(rec).includes('1d6+2'), 'the installed instance carries only the tick terms');
    assert.deepEqual([timing.scheduleFor(rec, combat()).dueSequence, timing.scheduleFor(rec, combat()).occurrences], [s0 + 5, 3], 'roster [A,B], A to act: ticks at s0+1, s0+3, s0+5');
    stage('cast', 'App controls (owner spell panel + GM card)');
    report.checks.viewAfterCast = { gm: await periodicView(gm), observer: await periodicView(observer) };
    assert.ok(report.checks.viewAfterCast.observer.some(t => /0 of 3 recorded/.test(t)), JSON.stringify(report.checks.viewAfterCast));
    const startHp = hpOf(host);

    step('authenticated advance → B starts: tick 1 of 3 is recorded and visible; HP unchanged');
    await advance(); assert.equal(seqNow(), s0 + 1); assert.deepEqual(hpOf(host), startHp, 'a boundary never changes HP');
    assert.equal(due(host).length, 1);
    await openClock(); const row1 = ticksUI(gm).getByRole('group', { name: 'Due tick 1 of 3 — Gloomrot', exact: true }); await row1.waitFor();
    report.checks.dueRow1 = await row1.innerText();
    stage('turn advance', 'App control (Advance authenticated turn)'); stage('visible due tick', 'App view (Due periodic ticks)');

    step('GM resolves tick 1 with its own physical d4 face 3 (the cast roll is not reused)');
    await row1.getByLabel('d4 #1', { exact: true }).fill('3');
    await row1.getByRole('button', { name: 'Apply tick 1 of 3', exact: true }).click();
    assert.ok(await wait(() => due(host).length === 0), 'tick consumed');
    assert.deepEqual(hpOf(host), { current: startHp.current - (3 - Math.min(3, startHp.temp)), temp: Math.max(0, startHp.temp - 3) });
    const afterTick1 = hpOf(host); stage('GM resolution', 'App control (Apply tick, physical roll)'); stage('HP', 'server-authoritative, read from the room');
    await closeEditor();

    step('advance twice → tick 2 of 3 recorded; GM applies it while BOTH the ACK and the accepted broadcast are lost; GM reloads; the retained entry (row gone) recovers the original receipt with "Check same tick command"');
    await advance(); await advance(); assert.equal(seqNow(), s0 + 3); assert.equal(due(host).length, 1); assert.deepEqual(hpOf(host), afterTick1);
    const ledgerBefore = actors.ledger(host.room).receipts.length;
    // Lost delivery (test boundary, recorded): drop this GM's ACK callback and the room broadcasts of the result to this GM only.
    await gm.evaluate(() => { const emit = __socket.emit.bind(__socket); let drop = true; window.__m5Drop = true;
      __socket.emit = (e, ...args) => { if (drop && e === 'actor_periodic_resolve' && typeof args[args.length - 1] === 'function') { drop = false; args[args.length - 1] = () => {}; } return emit(e, ...args); };
      const onevent = __socket.onevent.bind(__socket); __socket.onevent = packet => { if (window.__m5Drop && ['actor_consequence_accepted', 'combat_state_sync'].includes(packet?.data?.[0])) return; return onevent(packet); }; });
    report.qualifications.push('Lost delivery is simulated in the GM page (ACK callback and that GM\'s result broadcasts dropped once); the server, writer and recovery path are unmodified.');
    await openClock(); const row2 = ticksUI(gm).getByRole('group', { name: 'Due tick 2 of 3 — Gloomrot', exact: true }); await row2.waitFor();
    await row2.getByLabel('d4 #1', { exact: true }).fill('2');
    await row2.getByRole('button', { name: 'Apply tick 2 of 3', exact: true }).click();
    assert.ok(await wait(() => due(host).length === 0), 'server accepted once while the ACK and broadcast were lost');
    const afterTick2 = hpOf(host); assert.equal(afterTick2.current, afterTick1.current - 2);
    assert.equal(actors.ledger(host.room).receipts.length, ledgerBefore + 1);
    const retainedName = 'Retained tick command — tick 2 of 3 — Gloomrot';
    const preReload = clockUI(gm).getByRole('group', { name: retainedName, exact: true }); await preReload.waitFor({ timeout: 15000 });
    report.checks.retainedBeforeReload = await preReload.innerText(); assert.match(report.checks.retainedBeforeReload, /Pending or unknown/);
    const sentId = (report.checks.retainedBeforeReload.match(/Command ([0-9a-f-]{36})/) || [])[1]; assert.ok(sentId, 'retained commandId shown');
    await closeEditor();
    await gm.reload(); await setup(gm, host.url, 'app-gm');
    await openClock();
    assert.equal(await ticksUI(gm).getByRole('group', { name: 'Due tick 2 of 3 — Gloomrot', exact: true }).count(), 0, 'the due-tick row is gone after reload');
    const retained = clockUI(gm).getByRole('group', { name: retainedName, exact: true }); await retained.waitFor({ timeout: 20000 });
    report.checks.retainedAfterReload = await retained.innerText();
    assert.match(report.checks.retainedAfterReload, /Pending or unknown/); assert.ok(report.checks.retainedAfterReload.includes(sentId), 'same commandId after reload');
    await retained.getByRole('button', { name: 'Check same tick command', exact: true }).click();
    await retained.getByText(/^Accepted: the tick was applied once by this command/).waitFor({ timeout: 20000 });
    report.checks.retainedAfterCheck = await retained.innerText(); assert.ok(report.checks.retainedAfterCheck.includes(sentId));
    stage('lost-ACK recovery', 'App control after GM reload (Retained tick commands → Check same tick command), row already gone');
    assert.deepEqual(hpOf(host), afterTick2, 'recovery applied nothing twice');
    assert.equal(actors.ledger(host.room).receipts.length, ledgerBefore + 1, 'one original receipt, no new receipt');
    report.checks.resolveCommands = actors.ledger(host.room).receipts.filter(r => r.adjudication?.definitionId === timing.PERIODIC_DEFINITION_ID).map(r => r.commandId);
    assert.equal(new Set(report.checks.resolveCommands).size, report.checks.resolveCommands.length); assert.ok(report.checks.resolveCommands.includes(sentId));
    assert.deepEqual(actors.resources(hall(host).characterTokens.pc, 'character').mana, pcPaid.mana, 'no payment during recovery');
    await closeEditor();

    step('advance → final boundary: tick 3 of 3 recorded and the instance ends; GM reloads with the tick unresolved');
    await advance(); await advance(); assert.equal(seqNow(), s0 + 5);
    assert.equal(ticking(host).length, 0, 'the last tick ends the instance'); assert.equal(due(host).length, 1); assert.equal(due(host)[0].final, true);
    assert.deepEqual(hpOf(host), afterTick2);
    await gm.reload(); await setup(gm, host.url, 'app-gm'); stage('reload/recovery', 'App reload (GM page) — the open tick is restored from the server');
    await openClock(); const row3 = ticksUI(gm).getByRole('group', { name: 'Due tick 3 of 3 — Gloomrot', exact: true }); await row3.waitFor();
    report.checks.dueRow3AfterReload = await row3.innerText(); assert.match(report.checks.dueRow3AfterReload, /last tick/);
    await row3.getByLabel('d4 #1', { exact: true }).fill('4');
    await row3.getByRole('button', { name: 'Apply tick 3 of 3', exact: true }).click();
    assert.ok(await wait(() => due(host).length === 0));
    assert.equal(hpOf(host).current, afterTick2.current - 4); stage('expiry', 'automatic at the authenticated boundary (instance removed with its last tick)');
    await closeEditor();
    report.checks.finalViews = { gm: await periodicView(gm), observer: await periodicView(observer) };
    assert.equal(report.checks.finalViews.observer.length, 0, 'no periodic effect remains');
    for (let k = 0; k < 2; k++) { await advance(); assert.equal(due(host).length, 0, 'no tick after expiry'); }
    assert.deepEqual(actors.resources(hall(host).characterTokens.pc, 'character').mana, pcPaid.mana, 'no per-tick payment');
    report.checks.hp = { beforeCast: hpBeforeCast, afterCast: startHp, afterTick1, afterTick2, final: hpOf(host) };
    report.checks.tickRolls = actors.ledger(host.room).receipts.filter(r => r.adjudication?.definitionId === timing.PERIODIC_DEFINITION_ID).map(r => JSON.parse(r.adjudication.chosenResult).roll);
    // Observer privacy: the open-tick facts every client receives carry no source identity.
    const observerCombat = await observer.evaluate(roomId => new Promise(res => __socket.emit('actor_snapshot', { roomId }, r => res(JSON.stringify(r?.combat || null)))), host.room.id);
    report.checks.observerSeesPrivate = observerCombat.includes('SECRET-M5C'); assert.equal(report.checks.observerSeesPrivate, false);
    report.checks.observerSeesOwnerUid = observerCombat.includes('app-owner'); assert.equal(report.checks.observerSeesOwnerUid, false, 'no owner identity in the combat observers receive');
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }]) { await gm.setViewportSize(viewport); await gm.screenshot({ path: path.join(out, `gm-final-${viewport.width}.png`) }); }
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
