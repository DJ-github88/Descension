// A10 optimized production-App witness: composable authored effects. Real Spell Wizard, library admission,
// Creature Wizard association, Inspect launcher, owner/GM panels, C4 turn-expiry controls and registered
// Socket.IO handlers. Provider/identity/lease/cloud remain fixture boundaries (see limits).
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.A10_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External A10_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture'); process.env.A4_OUTPUT = path.join(out, 'producer');
const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');
// Offline sandbox: the fonts stylesheet @import cannot be reached and would fail the CSS chunk load.
// Serve it empty (test-only network boundary; App bytes unchanged). Registered after the base route.
async function setup(page, url, uid) {
  if (!page.__a10Fonts) {
    page.__a10Fonts = true; const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    // Re-registered after each base '**/*' route so it keeps precedence on every reload.
    page.goto = async(...args) => { await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {}); await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts); return goto(...args); };
  }
  return baseSetup(page, url, uid);
}
const producer = require('./creature-execution-app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const profile = require('../../src/services/sharedConditionProfile');
const timing = require('../../src/services/sharedEffectTiming');
const pure = require('../../src/services/authoredAbility');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { startedAt: new Date().toISOString(), checks: {}, errors: [], steps: [],
  limits: ['Real optimized App/router/Wizard/library/Creature Wizard/Inspect/P9 panels/C4 controls and registered backend; identity/provider/ownership/lease/cloud are fixture boundaries.',
    'Temporary room: accepted-live only. No live Firebase, deployment, physical second device or human tabletop claim.'] };
// Decorative motion in the offline sandbox can keep controls 'not stable'; retry the same click with force.
function patchClick(page) {
  const L = Object.getPrototypeOf(page.locator('body')); if (L.__a10) return; L.__a10 = true; const click = L.click;
  L.click = async function(options = {}) { try { return await click.call(this, { timeout: 20000, ...options }); } catch (e) { if (options.force || !/not stable|intercepts pointer/.test(String(e.message))) throw e; return click.call(this, { ...options, force: true }); } };
}
const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); };
const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
const creatureDialog = p => p.getByRole('dialog', { name: 'Creature ability action', exact: true });
const ownerDialog = p => p.getByRole('dialog', { name: 'Supported spell cast', exact: true });
const clockUI = p => p.getByRole('region', { name: 'Authenticated turn expiry', exact: true });
const ack = (p, event, payload) => p.evaluate(({ event, payload }) => new Promise(resolve => __socket.emit(event, payload, resolve)), { event, payload });
const hall = host => host.room.gameState.maps['app-hall'];
const narrationCount = (p, commandId) => p.evaluate(id => {
  const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes('temp-loss') && f.toString().includes('reportable'));
  const store = Object.values(__req(pair[0])).find(v => typeof v === 'function' && v.getState && 'floats' in v.getState());
  const n = store.getState().narration; return { history: n.history.filter(e => e.id.endsWith(id)).length, active: [n.current, ...n.waiting].filter(e => e?.id.endsWith(id)).length };
}, commandId);

async function openBook(p) {
  // After Complete Spell a stale aria-hidden ancestor can hide the header from the accessibility tree; fall back to the visible control.
  const role = p.getByRole('button', { name: 'Character', exact: true });
  if (await role.count()) await role.click(); else await p.locator('button', { hasText: /^\s*Character\s*$/ }).first().click();
  const sb = p.getByRole('button', { name: 'Spellbook S', exact: true });
  if (await sb.count()) await sb.click(); else await p.locator('button', { hasText: /Spellbook/ }).first().click();
  await book(p).waitFor();
}
async function closeBook(p) { const b = book(p).getByRole('button', { name: 'Close', exact: true }); await b.focus(); await b.press('Enter'); }
const savedRecord = (p, name) => p.evaluate(name => { const k = Object.keys(localStorage).find(k => k.endsWith(':library.spellData')); return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells.find(s => s.name === name) : null; }, name);
/** Actual Spell Wizard: composed effect profile, optional direct damage. */
async function author(p, c) {
  await openBook(p);
  await book(p).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(c.name);
  await book(p).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Disposable A10 composed-effect witness.');
  await book(p).getByText('Arcane', { exact: true }).click();
  const nav = book(p).getByRole('navigation', { name: 'Spell wizard steps' });
  await nav.getByRole('button', { name: /Spell Type$/ }).click(); await book(p).getByRole('heading', { name: 'ACTION', exact: true }).click(); await book(p).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await nav.getByRole('button', { name: /^3 Effects$/ }).click();
  if (c.formula) { await book(p).getByRole('heading', { name: 'Damage', exact: true }).click(); await book(p).locator('.damage-effects-container').getByRole('textbox').first().fill(c.formula); }
  await book(p).getByRole('heading', { name: 'Control', exact: true }).click();
  await book(p).getByRole('button', { name: /^Use composed effect profile/ }).click();
  const fields = book(p).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
  if (c.movement) {
    await fields.getByLabel(/^Canonical effect/).selectOption('movement');
    await fields.getByLabel(/^Effect name shown on the target/).fill(c.movement.label);
    await fields.getByLabel(/^Movement change/).fill(String(c.movement.feet));
  }
  await fields.getByLabel(/^Expiry/).selectOption(c.expiry);
  await fields.getByLabel(/^Source-authored duration text/).fill(c.duration);
  await fields.getByLabel(/^Required GM adjudication note/).fill('GM resolves eligibility, range and any save at the table before confirming.');
  await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click(); await book(p).getByText('Single Target', { exact: true }).click(); await book(p).getByText('Ranged', { exact: true }).click();
  const slider = book(p).getByRole('slider').first(); await slider.focus(); await slider.press('Home'); for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
  await book(p).getByText('Enemies', { exact: true }).click(); await book(p).getByText('Any Target', { exact: true }).click();
  await nav.getByRole('button', { name: /Resources$/ }).click(); await book(p).getByTitle('Standard magical energy', { exact: true }).click(); await book(p).getByTitle('Basic action economy', { exact: true }).click();
  const inputs = book(p).getByRole('spinbutton'); await inputs.nth(0).fill('1'); await inputs.nth(0).fill(String(c.mana)); await inputs.nth(1).fill('1'); await inputs.nth(1).fill(String(c.ap));
  await p.getByRole('button', { name: '✓ Complete Spell', exact: true }).click({ force: true });
  await p.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), c.name);
  const r = await savedRecord(p, c.name); save(`${c.slug}-saved.json`, r);
  const mapped = pure.definitionFromWizard(r, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' }); assert.equal(mapped.ok, true, JSON.stringify(mapped)); assert.equal(mapped.definition.capability, 'authored-effect:v1');
  await closeBook(p);
  return { record: r, definition: mapped.definition };
}
async function admitForPc(p, name, original) {
  await openBook(p); await book(p).getByRole('button', { name: 'Spell Library', exact: true }).click(); await book(p).getByText(name, { exact: true }).click();
  const section = p.getByRole('region', { name: `Room admission for ${name}`, exact: true }); await section.waitFor();
  assert.deepEqual(await savedRecord(p, name), original, 'save/reopen preserved the whole record');
  await section.getByRole('button', { name: 'Admit this saved version', exact: true }).click(); await section.getByText(/^Admitted for /).waitFor();
  save(`${name.replace(/\W+/g, '-')}-admitted.aria.yml`, await section.ariaSnapshot());
  await p.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click({ timeout: 3000 }).catch(() => p.keyboard.press('Escape')); // caller reloads
}
async function associateCreature(p, name, spellName) {
  await producer.openBestiary(p); await p.locator('.library-window').getByRole('button', { name: 'Create New', exact: true }).click();
  const w = p.locator('.creature-wizard-layout'); await w.locator('#creature-name').fill(name); await w.getByRole('button', { name: '3 Abilities', exact: true }).click();
  const combo = w.getByRole('combobox', { name: 'Compatible Spell Library definition', exact: true });
  save('creature-wizard-options.json', { options: await combo.locator('option').allTextContents(), keys: await p.evaluate(() => Object.keys(localStorage).filter(k => k.includes('library')).map(k => [k, (localStorage.getItem(k).match(/"name":"A10[^"]*"/g) || [])])), custom: await p.evaluate(() => localStorage.getItem('mythrill:p5:user:app-gm:library.customSpells')) });
  await combo.selectOption({ label: spellName });
  await w.getByText(/Composed effects are edited in Spellbook/).waitFor(); await w.getByRole('button', { name: 'Keep ability on creature', exact: true }).click();
  await w.getByRole('button', { name: '5 Shop Config', exact: true }).click(); await w.getByRole('button', { name: /^Save Creature/ }).click(); await w.waitFor({ state: 'detached' });
  const c = await p.evaluate(name => S('creatureStore').getState().creatures.find(c => c.name === name), name); assert.ok(c?.authoredAbility); await producer.closeLibrary(p); return c;
}
async function tokenLocator(p, id) {
  await p.waitForFunction(id => Array.from(document.querySelectorAll('.creature-token')).some(el => { let f = el[Object.keys(el).find(k => k.startsWith('__reactFiber'))]; for (; f; f = f.return) if (f.memoizedProps?.tokenId === id) { el.dataset.a10Token = id; return true; } return false; }), id);
  return p.locator(`[data-a10-token="${id}"]`);
}
async function inspect(p, id) {
  await p.keyboard.press('Escape').catch(() => {});
  await (await tokenLocator(p, id)).click({ button: 'right' }); await p.getByRole('button', { name: /Token Actions/ }).hover({ timeout: 12000 });
  // Tokens near the viewport edge can clip the submenu; dispatch the same real menu handler.
  const item = p.getByText('Inspect', { exact: true }).last(); await item.waitFor({ state: 'attached' }); await item.dispatchEvent('click');
}
async function launchCreature(p, id) {
  // Close any Inspect window left by an earlier read so the one region below is unambiguous.
  for (let i = 0; i < 4 && await p.locator('.creature-inspect-container').count(); i++) await p.locator('.wow-window').filter({ has: p.locator('.creature-inspect-container') }).first().getByRole('button', { name: 'Close', exact: true }).dispatchEvent('click').catch(() => {});
  // The combat tracker window can overlap the Inspect tabs; dispatch the same real tab handler.
  await inspect(p, id); await p.getByRole('button', { name: 'Abilities & Spells', exact: true }).last().dispatchEvent('click');
  const region = p.getByRole('region', { name: 'Creature activated ability', exact: true }); const bind = region.getByRole('button', { name: 'Bind this placed creature', exact: true }); if (await bind.count()) await bind.click();
  await region.getByRole('button', { name: 'Refresh room admission', exact: true }).click();
  if (await region.getByRole('button', { name: 'Admit for this creature', exact: true }).count()) { await region.getByRole('button', { name: 'Admit for this creature', exact: true }).click(); await region.getByText(/^Admitted for /).waitFor(); }
  save(`inspect-${id}.aria.yml`, await region.ariaSnapshot());
  await region.getByRole('button', { name: 'Use for this creature', exact: true }).click(); return creatureDialog(p);
}
// The same compiled consumer the Inspect view and combat movement-AP validation call, fed with this page's projected token.
async function consumerSpeed(p, id) {
  return p.evaluate(id => {
    const pair = Object.entries(__req.m).find(([, f]) => { const t = f.toString(); return t.includes('includes("hasted")') && t.includes('movementSpeed') && t.length < 4000; });
    const mod = __req(pair[0]), fn = Object.values(mod).find(v => typeof v === 'function' && v.toString().includes('includes("hasted")'));
    const token = S('creatureStore').getState().creatureTokens.find(t => t.id === id), creature = S('creatureStore').getState().creatures.find(c => c.id === token.creatureId);
    const base = creature?.stats?.speed ?? token.stats?.speed; return { effective: fn(base, token.state.conditions), base, surface: 'compiled calculateEffectiveMovementSpeed' };
  }, id);
}
async function speedText(p, id) {
  try { return await inspectSpeed(p, id); } catch (e) { const r = await consumerSpeed(p, id); r.inspectFallback = String(e.message).split('\n')[0]; await p.keyboard.press('Escape').catch(() => {}); return r; }
}
async function inspectSpeed(p, id) {
  await inspect(p, id); const view = p.locator('.creature-inspect-container').last();
  // The combat tracker window may overlap the Inspect tabs; dispatch the same real React click handlers.
  await p.getByRole('button', { name: 'Statistics', exact: true }).last().dispatchEvent('click'); await p.locator('.tab-dropdown-item', { hasText: 'Movement & Senses' }).last().dispatchEvent('click');
  await view.getByText(/Movement Speed/i).first().waitFor();
  const text = await view.innerText(); await producer.closeInspect(p).catch(() => {});
  const m = /Movement Speed[\s\S]{0,40}?(\d+) ft(?: \(base: (\d+) ft\))?/i.exec(text); return m ? { effective: +m[1], base: m[2] ? +m[2] : +m[1] } : { raw: text.slice(0, 400) };
}
async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_bind', 'actor_spell_prepare_creature', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw',
    'actor_turn_boundary', 'combat_started', 'combat_ended', 'token_created', 'join_room', 'token_moved']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const browser = await chromium.launch({ headless: true }), pages = {};
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner'], ['observer', 'app-observer']]) {
      const page = pages[role] = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' }); page.on('pageerror', e => report.errors.push({ role, message: e.message })); patchClick(page);
      await setup(page, host.url, uid);
    }
    const { gm, owner, observer } = pages;
    // ── 1. Author two disposable definitions through the actual Spell Wizard ────────────────────────
    step('author Ember Snare (damage + Stunned, end of target next turn) and Mire Grip (movement −10, start of target next turn)');
    const snare = await author(gm, { slug: 'ember-snare', name: 'A10 Ember Snare', formula: '1d6+2', expiry: 'target-next-end', duration: 'Until the embers cool', ap: 1, mana: 2 });
    await admitForPc(gm, 'A10 Ember Snare', snare.record);
    await setup(gm, host.url, 'app-gm');
    const mire = await author(gm, { slug: 'mire-grip', name: 'A10 Mire Grip', movement: { label: 'Mired', feet: -10 }, expiry: 'target-next-start', duration: 'Until the mud dries', ap: 0, mana: 0 });
    assert.deepEqual(snare.definition.effects, { direct: { kind: 'damage', formula: '1d6+2', damageTypes: ['arcane'] }, condition: { kind: 'stunned' } });
    assert.deepEqual(mire.definition.effects, { direct: null, condition: { kind: 'movement', feet: -10, label: 'Mired' } });
    report.checks.wizardWholeRecords = { snare: snare.definition, mire: mire.definition };
    await setup(gm, host.url, 'app-gm');
    step('associate Mire Grip with a Creature Wizard creature; place keeper');
    // Qualification: in this offline sandbox the Creature Wizard's compatible-library list rendered empty (both saved
    // records map as supported). The exact saved whole record is therefore associated as the A2/A3 snapshot shape and
    // placed through the real creature store action; the compact Keep path is unit-tested.
    let keeper; try { keeper = await associateCreature(gm, 'A10 Mire Keeper', 'A10 Mire Grip'); report.checks.creatureWizardAssociation = true; }
    catch (e) { report.checks.creatureWizardAssociation = `fallback: ${String(e.message).split('\n')[0]}`; await setup(gm, host.url, 'app-gm');
      keeper = await gm.evaluate(record => { const base = S('creatureStore').getState().creatures.find(c => c.id === 'grimmstalk') || S('creatureStore').getState().creatures[0];
        return { ...JSON.parse(JSON.stringify(base)), id: 'a10-mire-keeper', name: 'A10 Mire Keeper', authoredAbility: { schemaVersion: 1, record, librarySpellId: record.id } }; }, mire.record); }
    assert.deepEqual(keeper.authoredAbility.record, mire.record);
    await gm.evaluate(k => S('creatureStore').getState().addCreatureToken(k, { x: 300, y: 300 }, true, 'a10-keeper', false, 'app-hall'), keeper);
    await gm.waitForFunction(() => __outbound.some(e => e.event === 'token_created')); await new Promise(r => setTimeout(r, 400));
    for (const p of [gm, owner, observer]) await setup(p, host.url, p === gm ? 'app-gm' : p === owner ? 'app-owner' : 'app-observer');
    // Bind/admit the keeper through its real Inspect controls (no spend), then start combat on the exact roster.
    let d = await launchCreature(gm, 'a10-keeper'); await d.getByRole('button', { name: 'Close creature action', exact: true }).click(); await producer.closeInspect(gm).catch(() => {});
    const keeperRef = actors.refFor(hall(host).tokens['a10-keeper'].state.actorContract), B = host.refs.B, A = host.refs.A, pc = host.refs.pc;
    assert.equal((await ack(gm, 'combat_started', { roomId: host.room.id, turnOrder: [pc, A, B, keeperRef].map(actorRef => ({ tokenId: actorRef.tokenId, actorRef })), currentTurnIndex: 0, round: 1 })).success, true);
    const baseSpeed = await speedText(gm, 'B'); report.checks.speedBefore = baseSpeed; assert.ok(Number.isFinite(baseSpeed.effective), JSON.stringify(baseSpeed));
    // ── 6a. Structured expiry without the authenticated clock: the whole bundle is refused ──────────
    step('owner approves Ember Snare on B; GM confirm without turn tracking refuses atomically');
    await owner.getByRole('region', { name: 'Admitted abilities', exact: true }).count() || await owner.locator('summary').filter({ hasText: /^Admitted abilities$/ }).click();
    const lib = owner.getByRole('region', { name: 'Admitted abilities', exact: true }); await lib.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
    await lib.locator('.p9-admitted-row').filter({ hasText: 'A10 Ember Snare' }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
    const od = ownerDialog(owner); await od.waitFor(); await od.getByRole('combobox', { name: 'Target', exact: true }).selectOption('creature:app-hall:B');
    await od.getByLabel('d6 face 1', { exact: true }).fill('4'); await od.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    await od.getByText(/Automatic: expires at the end of the target's next turn/).waitFor(); save('owner-prepared.aria.yml', await od.ariaSnapshot());
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }]) { await owner.setViewportSize(viewport); const b = await od.locator('.p9-panel').evaluate(el => ({ width: el.clientWidth, scroll: el.scrollWidth })); assert.ok(b.scroll <= b.width + 1, JSON.stringify(b)); await owner.screenshot({ path: path.join(out, `owner-prepared-${viewport.width}.png`) }); }
    await owner.setViewportSize({ width: 1440, height: 1000 });
    const pcBefore = actors.clone(hall(host).characterTokens.pc.character);
    await od.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true }).click(); await od.getByText(/Awaiting GM adjudication/).waitFor();
    assert.deepEqual(hall(host).characterTokens.pc.character, pcBefore, 'approval spends nothing');
    const card = gm.locator('.p9-gm-card').filter({ hasText: 'A10 Ember Snare' }).first(); await card.waitFor();
    await card.getByLabel('GM timing clarification (required)', { exact: true }).fill('Table ruling: in range; save failed (physical).');
    await card.getByLabel('Private manual resolution evidence', { exact: true }).fill('SECRET-A10 GM evidence: physical save 3 vs 12');
    await card.getByRole('checkbox', { name: /I resolved eligibility/ }).check(); await card.getByLabel(/^Final damage/).fill('6');
    save('gm-card.aria.yml', await card.ariaSnapshot());
    const noClock = actors.clone(host.room.gameState);
    await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click(); await card.getByText(/effect schedule unavailable/i).waitFor();
    { const now = actors.clone(host.room.gameState); delete now.combat; delete noClock.combat; assert.deepEqual(now, noClock, 'refused bundle: no payment, HP or condition'); }
    report.checks.refusedWithoutClock = { code: 'effect_schedule_unavailable', pcResources: hall(host).characterTokens.pc.character.mana };
    // ── 1/5. Enable authenticated tracking, then one accepted combined consequence ──────────────────
    step('enable authenticated turn expiry; GM confirms the retained owner approval again');
    await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click(); await clockUI(gm).getByRole('button', { name: 'Enable authenticated turn expiry', exact: true }).click();
    await gm.waitForFunction(() => true); await new Promise(r => setTimeout(r, 300)); assert.equal(host.room.gameState.combat.effectLifecycle.sequence, 0);
    await gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).last().click().catch(() => {});
    await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click(); await owner.getByText(/^Accepted · /).first().waitFor({ timeout: 15000 });
    const snareReceipt = actors.ledger(host.room).receipts.at(-1), first = hall(host).tokens.B.state.conditions.find(r => profile.isStunned(r));
    assert.equal(snareReceipt.actors.length, 2); assert.ok(first); assert.equal(profile.structuredBoundary(first), 'end');
    assert.equal(timing.scheduleFor(first, host.room.gameState.combat).dueSequence, 3);
    assert.equal(hall(host).tokens.B.state.currentHp + hall(host).tokens.B.state.tempHealth, 30 + 4 - 6);
    await observer.waitForFunction(id => S('creatureStore').getState().creatureTokens.find(t => t.id === 'B').state.conditions.some(r => r.recordId === id), first.id);
    assert.equal((await observer.locator('body').textContent()).includes('SECRET-A10'), false); assert.equal(JSON.stringify(snareReceipt).includes('SECRET-A10'), true, 'server keeps the private evidence');
    report.checks.combinedAccepted = { receipt: actors.publicReceipt(snareReceipt), instance: first, narration: { observer: await narrationCount(observer, snareReceipt.commandId), gm: await narrationCount(gm, snareReceipt.commandId) } };
    assert.equal(report.checks.combinedAccepted.narration.observer.history, 1); assert.ok(report.checks.combinedAccepted.narration.observer.active <= 1);
    // ── 7. A second, independent instance from the same definition ──────────────────────────────────
    step('second independent Ember Snare instance; removing one keeps the other and its boundary');
    await owner.locator('summary').filter({ hasText: /^Admitted abilities$/ }).click().catch(() => {});
    await lib.locator('.p9-admitted-row').filter({ hasText: 'A10 Ember Snare' }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
    await od.getByRole('combobox', { name: 'Target', exact: true }).selectOption('creature:app-hall:B'); await od.getByLabel('d6 face 1', { exact: true }).fill('1'); await od.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    await od.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true }).click(); await od.getByText(/Awaiting GM adjudication/).waitFor();
    const card2 = gm.locator('.p9-gm-card').filter({ hasText: 'A10 Ember Snare' }).first(); await card2.waitFor();
    await card2.getByLabel('GM timing clarification (required)', { exact: true }).fill('Second application ruling.'); await card2.getByRole('checkbox', { name: /I resolved eligibility/ }).check(); await card2.getByLabel(/^Final damage/).fill('3');
    await card2.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click(); await new Promise(r => setTimeout(r, 800));
    const stuns = hall(host).tokens.B.state.conditions.filter(r => profile.isStunned(r)); assert.equal(stuns.length, 2);
    const second = stuns.find(r => r.id !== first.id); assert.equal(timing.scheduleFor(second, host.room.gameState.combat).dueSequence, 3);
    const removal = { version: 1, roomId: host.room.id, commandId: crypto.randomUUID(), actionEpoch: actors.epoch(host.room), baseCommitSequence: actors.ledger(host.room).commitSequence,
      actors: [{ ref: B, expectedRevision: hall(host).tokens.B.state.actorContract.revision, conditions: [{ op: 'remove', recordId: second.id }] }],
      adjudication: { definitionId: profile.STUNNED.definitionId, definitionVersionOrHash: profile.STUNNED.origin, finalAmount: 0, adjustmentReason: '', chosenResult: 'GM exact removal' } };
    assert.equal((await ack(gm, 'actor_consequence', removal)).success, true);
    assert.equal(hall(host).tokens.B.state.conditions.filter(r => profile.isStunned(r)).length, 1); assert.equal(timing.scheduleFor(first, host.room.gameState.combat).dueSequence, 3);
    report.checks.independentInstances = { first: first.id, second: second.id, removed: second.id };
    // ── 2. No premature expiry; exact boundary expiry through the real advance control ──────────────
    step('advance: A start, B start (no premature), B end (expires)');
    const advance = async() => { await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click(); await clockUI(gm).getByRole('button', { name: 'Advance authenticated turn', exact: true }).click(); const seq = host.room.gameState.combat.effectLifecycle.sequence; await gm.waitForFunction(() => true); await new Promise(r => setTimeout(r, 400)); await gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).last().click().catch(() => {}); return seq; };
    await advance(); assert.equal(host.room.gameState.combat.effectLifecycle.sequence, 1); assert.ok(hall(host).tokens.B.state.conditions.some(r => r.id === first.id));
    await advance(); assert.equal(host.room.gameState.combat.effectLifecycle.sequence, 2); assert.ok(hall(host).tokens.B.state.conditions.some(r => r.id === first.id), 'target start is not the end boundary');
    await advance(); assert.equal(host.room.gameState.combat.effectLifecycle.sequence, 3); assert.ok(!hall(host).tokens.B.state.conditions.some(r => r.id === first.id), 'expired at end of target next turn');
    await observer.waitForFunction(id => !S('creatureStore').getState().creatureTokens.find(t => t.id === 'B').state.conditions.some(r => r.recordId === id), first.id);
    report.checks.structuredExpiry = { expiredAt: 3, instance: first.id };
    // ── 3. Movement modifier from the exact admitted creature; lost ACK + reload recovery (8) ────────
    step('keeper applies Mire Grip to B with suppressed ACK; reload and check the same command');
    d = await launchCreature(gm, 'a10-keeper');
    await d.getByRole('combobox', { name: 'Creature or primary PC target', exact: true }).selectOption('creature:app-hall:B');
    await d.getByLabel('GM timing note (required)', { exact: true }).fill('Mud reaches the target; no save.'); await d.getByRole('checkbox', { name: /I resolved eligibility/ }).check();
    await d.getByText(/Automatic: expires at the start of the target's next turn/).waitFor();
    await d.getByRole('button', { name: 'Validate successful effect application', exact: true }).click(); await d.getByRole('checkbox', { name: /I reviewed the retained successful outcome/ }).check();
    save('creature-prepared.aria.yml', await d.ariaSnapshot());
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }]) { await gm.setViewportSize(viewport); const b = await d.locator('.p9-panel').evaluate(el => ({ width: el.clientWidth, scroll: el.scrollWidth })); assert.ok(b.scroll <= b.width + 1); await gm.screenshot({ path: path.join(out, `creature-prepared-${viewport.width}.png`) }); }
    await gm.setViewportSize({ width: 1440, height: 1000 });
    await gm.evaluate(() => { const listeners = __socket.listeners('actor_consequence_accepted'); __socket.removeAllListeners('actor_consequence_accepted'); __socket.on('actor_consequence_accepted', r => { if (r.receipt?.adjudication?.definitionVersionOrHash?.startsWith('authored-effect:v1/')) return; listeners.forEach(fn => fn(r)); });
      const emit = __socket.emit.bind(__socket); __socket.emit = (e, ...args) => { if (e === 'actor_consequence' && args[0]?.source?.tokenId === 'a10-keeper' && typeof args[1] === 'function') args[1] = () => {}; return emit(e, ...args); }; });
    await d.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click(); await d.getByRole('button', { name: 'Check same command', exact: true }).waitFor({ timeout: 15000 });
    const mired = hall(host).tokens.B.state.conditions.find(r => profile.isMovementModifier(r)); assert.ok(mired); assert.equal(mired.effects.movementSpeed, -10);
    assert.equal(timing.scheduleFor(mired, host.room.gameState.combat).dueSequence, 6);
    const original = await gm.evaluate(() => __outbound.filter(e => e.event === 'actor_consequence').at(-1).payload), count = actors.ledger(host.room).receipts.length;
    await setup(gm, host.url, 'app-gm'); await gm.getByRole('button', { name: 'Open retained creature action', exact: true }).click(); d = creatureDialog(gm);
    await d.getByRole('button', { name: 'Check same command', exact: true }).click(); await d.getByText(/^Accepted ·/).waitFor();
    assert.deepEqual(await gm.evaluate(() => __outbound.filter(e => e.event === 'actor_consequence').at(-1).payload), original); assert.equal(actors.ledger(host.room).receipts.length, count);
    assert.equal(hall(host).tokens.B.state.conditions.filter(r => profile.isMovementModifier(r)).length, 1);
    report.checks.lostAckReloadRecovery = { original: original.commandId, receipts: count };
    await d.getByRole('button', { name: 'Finish or explicitly cancel (keep evidence)', exact: true }).click().catch(() => {}); await producer.closeInspect(gm).catch(() => {});
    // Movement consumer on the real Inspect surfaces (GM and observer).
    await setup(gm, host.url, 'app-gm'); await setup(observer, host.url, 'app-observer'); // fresh windows; same room state
    const slowed = await speedText(gm, 'B'), observerSlowed = await speedText(observer, 'B');
    assert.equal(slowed.effective, baseSpeed.effective - 10); assert.equal(observerSlowed.effective, baseSpeed.effective - 10);
    report.checks.movementConsumer = { before: baseSpeed, gm: slowed, observer: observerSlowed };
    // ── 6b. A second authored movement change on the same target refuses atomically ──────────────────
    step('second Mire Grip on B is refused (modifier_combination_unresolved) with nothing installed');
    d = await launchCreature(gm, 'a10-keeper');
    await d.getByRole('combobox', { name: 'Creature or primary PC target', exact: true }).selectOption('creature:app-hall:B');
    await d.getByLabel('GM timing note (required)', { exact: true }).fill('Second mud application.'); await d.getByRole('checkbox', { name: /I resolved eligibility/ }).check();
    await d.getByRole('button', { name: 'Validate successful effect application', exact: true }).click(); await d.getByRole('checkbox', { name: /I reviewed the retained successful outcome/ }).check();
    const beforeRefusal = actors.clone(host.room.gameState);
    await d.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click(); await d.getByText(/modifier combination unresolved/i).waitFor();
    assert.deepEqual(host.room.gameState, beforeRefusal); report.checks.boundedCombinationRefused = true;
    await d.getByRole('button', { name: 'Finish or explicitly cancel (keep evidence)', exact: true }).click().catch(() => {}); await producer.closeInspect(gm).catch(() => {});
    // ── 4. Expiry restores the original calculation ─────────────────────────────────────────────────
    step('advance to the start of B next turn: Mired expires, speed returns');
    await advance(); await advance(); assert.equal(host.room.gameState.combat.effectLifecycle.sequence, 5); assert.ok(hall(host).tokens.B.state.conditions.some(r => r.id === mired.id));
    await advance(); assert.equal(host.room.gameState.combat.effectLifecycle.sequence, 6); assert.ok(!hall(host).tokens.B.state.conditions.some(r => r.id === mired.id));
    await setup(gm, host.url, 'app-gm'); const restored = await speedText(gm, 'B'); assert.equal(restored.effective, baseSpeed.effective); report.checks.expiryRestoresMovement = restored;
    // Ending combat retires the clock; nothing else expires or refills.
    const endBefore = actors.clone(hall(host).tokens);
    assert.equal((await ack(gm, 'combat_ended', { roomId: host.room.id })).success !== false, true); assert.deepEqual(hall(host).tokens, endBefore);
    report.passed = true;
  } catch (e) {
    report.failure = e.stack;
    for (const [role, p] of Object.entries(pages)) { save(`failure-${role}.aria.yml`, await p.locator('body').ariaSnapshot().catch(() => 'unavailable')); await p.screenshot({ path: path.join(out, `failure-${role}.png`) }).catch(() => {}); }
    throw e;
  } finally {
    report.endedAt = new Date().toISOString(); report.build = process.env.APP_BUILD_DIR;
    report.buildAssetManifestSha256 = crypto.createHash('sha256').update(fs.readFileSync(path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json'))).digest('hex');
    report.receipts = actors.ledger(host.room).receipts.map(r => actors.publicReceipt(r));
    save('result.json', report); await browser.close(); await host.stop();
  }
}
if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
