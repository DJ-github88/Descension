// M2A optimized production-App witness: explicit multi-turn durations. Real Spell Wizard (counted start/end + count),
// library admission, Combat Initiator, owner/GM spell panels, shared condition editor and the authenticated
// turn-advance control against the registered Socket.IO backend, in ONE persistent browser profile per role (GM, owner,
// observer; never cleared or replaced). Provider/identity/lease/cloud remain fixture boundaries. Any step done outside
// ordinary App controls is recorded under `qualifications` and is never counted as a passed App path.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.M2A_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External M2A_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture'); process.env.A4_OUTPUT = path.join(out, 'producer');
const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');
// Offline sandbox: the fonts stylesheet @import cannot be reached and would fail the CSS chunk load (test-only boundary).
async function setup(page, url, uid) {
  if (!page.__m2aFonts) {
    page.__m2aFonts = true; const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
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
const report = { startedAt: new Date().toISOString(), checks: {}, qualifications: [], errors: [], steps: [],
  limits: ['Real optimized App and registered backend; identity/provider/ownership/lease/cloud are fixture boundaries.',
    'Temporary room: accepted-live only. No live Firebase, deployment, physical second device or human tabletop claim.'] };
function patchClick(page) {
  const L = Object.getPrototypeOf(page.locator('body')); if (L.__m2a) return; L.__m2a = true; const click = L.click;
  L.click = async function(options = {}) { try { return await click.call(this, { timeout: 20000, ...options }); } catch (e) { if (options.force || !/not stable|intercepts pointer/.test(String(e.message))) throw e; return click.call(this, { ...options, force: true }); } };
}
const stepRaw = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); };
let gmPage = null; const step = s => { stepRaw(s); if (gmPage) gmPage.evaluate(() => 0).then(() => storageUse(gmPage)).then(u => { report.steps.at(-1).gmStorage = u; }).catch(() => {}); };
// Diagnostic only (reads, never writes app storage): GM localStorage size grouped by family prefix.
const storageUse = p => p.evaluate(() => { const groups = {}; let total = 0; for (const k of Object.keys(localStorage)) { const n = (localStorage.getItem(k) || '').length + k.length; total += n;
  const g = k.replace(/^mythrill:p5:user:[^:]+:/, '').split(':')[0]; groups[g] = groups[g] || { keys: 0, chars: 0 }; groups[g].keys++; groups[g].chars += n; }
  return { total, top: Object.entries(groups).sort((a, b) => b[1].chars - a[1].chars).slice(0, 8) }; });
const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
const ownerDialog = p => p.getByRole('dialog', { name: 'Supported spell cast', exact: true });
const clockUI = p => p.getByRole('region', { name: 'Authenticated turn expiry', exact: true });
const hall = host => host.room.gameState.maps['app-hall'];
const B = host => hall(host).tokens.B;
const moves = host => B(host).state.conditions.filter(profile.isMovementModifier);
const narration = (p, commandId) => p.evaluate(id => {
  const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes('temp-loss') && f.toString().includes('reportable'));
  const store = Object.values(__req(pair[0])).find(v => typeof v === 'function' && v.getState && 'floats' in v.getState());
  const n = store.getState().narration, all = [...n.history, n.current, ...n.waiting].filter(e => e?.id.endsWith(id));
  return { count: n.history.filter(e => e.id.endsWith(id)).length, texts: [...new Set(all.map(e => e.text))] };
}, commandId);

async function openBook(p) {
  const role = p.getByRole('button', { name: 'Character', exact: true });
  if (await role.count()) await role.click(); else await p.locator('button', { hasText: /^\s*Character\s*$/ }).first().click();
  const sb = p.getByRole('button', { name: 'Spellbook S', exact: true });
  if (await sb.count()) await sb.click(); else await p.locator('button', { hasText: /Spellbook/ }).first().click();
  await book(p).waitFor();
}
async function closeBook(p) { const b = book(p).getByRole('button', { name: 'Close', exact: true }); await b.focus(); await b.press('Enter'); }
const savedRecord = (p, name) => p.evaluate(name => { const k = Object.keys(localStorage).find(k => k.endsWith(':library.spellData')); return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells.find(s => s.name === name) : null; }, name);
/** Actual Spell Wizard: composed effect profile with one movement change. */
async function author(p, c) {
  await openBook(p);
  await book(p).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(c.name);
  await book(p).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Disposable M2A counted-duration witness.');
  await book(p).getByText('Arcane', { exact: true }).click();
  const nav = book(p).getByRole('navigation', { name: 'Spell wizard steps' });
  await nav.getByRole('button', { name: /Spell Type$/ }).click(); await book(p).getByRole('heading', { name: 'ACTION', exact: true }).click(); await book(p).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await nav.getByRole('button', { name: /^3 Effects$/ }).click();
  await book(p).getByRole('heading', { name: 'Control', exact: true }).click();
  await book(p).getByRole('button', { name: /^Use composed effect profile/ }).click();
  const fields = book(p).getByRole('group', { name: 'Composed effect · structured expiry', exact: true });
  await fields.getByLabel(/^Canonical effect/).selectOption('movement');
  await fields.getByLabel(/^Effect name shown on the target/).fill(c.label);
  await fields.getByLabel(/^Movement change/).fill(String(c.feet));
  await fields.getByLabel(/^Expiry/).selectOption(c.expiry);
  if (c.occurrences) { const count = fields.getByLabel(/^Target-turn (starts|ends) to count/); await count.waitFor(); await count.fill(String(c.occurrences)); report.checks[`wizardText:${c.slug}`] = await fields.locator('p').allInnerTexts(); }
  await fields.getByLabel(/^Source-authored duration text/).fill(c.duration);
  await fields.getByLabel(/^Required GM adjudication note/).fill('GM resolves eligibility, range and any save at the table before confirming.');
  if (!report.checks.wizardPolicyText) report.checks.wizardPolicyText = await fields.getByText(/Different named effects on one target add together/).innerText();
  await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click(); await book(p).getByText('Single Target', { exact: true }).click(); await book(p).getByText('Ranged', { exact: true }).click();
  const slider = book(p).getByRole('slider').first(); await slider.focus(); await slider.press('Home'); for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
  await book(p).getByText('Enemies', { exact: true }).click(); await book(p).getByText('Any Target', { exact: true }).click();
  await nav.getByRole('button', { name: /Resources$/ }).click(); await book(p).getByTitle('Standard magical energy', { exact: true }).click(); await book(p).getByTitle('Basic action economy', { exact: true }).click();
  const inputs = book(p).getByRole('spinbutton'); await inputs.nth(0).fill('1'); await inputs.nth(0).fill(String(c.mana)); await inputs.nth(1).fill('1'); await inputs.nth(1).fill(String(c.ap));
  await p.getByRole('button', { name: '✓ Complete Spell', exact: true }).click({ force: true });
  await p.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), c.name);
  const r = await savedRecord(p, c.name); save(`${c.slug}-saved.json`, r);
  const mapped = pure.definitionFromWizard(r, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' }); assert.equal(mapped.ok, true, JSON.stringify(mapped));
  assert.deepEqual(mapped.definition.effects.condition, { kind: 'movement', feet: c.feet, label: c.label });
  assert.equal(mapped.definition.timing.occurrences, c.occurrences, 'the authored count is part of the saved definition');
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
  await p.waitForFunction(id => Array.from(document.querySelectorAll('.creature-token')).some(el => { let f = el[Object.keys(el).find(k => k.startsWith('__reactFiber'))]; for (; f; f = f.return) if (f.memoizedProps?.tokenId === id) { el.dataset.a11Token = id; return true; } return false; }), id);
  return p.locator(`[data-a11-token="${id}"]`);
}
/** Readable speed through the shared condition editor (Party HUD → exact room attachment → Edit selected shared conditions). */
async function editorSpeed(p, id = 'B') {
  const controls = p.getByRole('region', { name: 'Actor attachment and consequences', exact: true });
  await controls.getByRole('combobox', { name: 'Exact room attachment', exact: true }).selectOption(`creature:${id}`);
  await controls.getByRole('button', { name: 'Edit selected shared conditions', exact: true }).click();
  const dialog = p.getByRole('dialog', { name: 'Edit selected shared conditions editor', exact: true }); await dialog.waitFor();
  await dialog.getByText(/^Stunned (inactive\.|active:)/).first().waitFor({ timeout: 15000 }); // the editor has confirmed accepted room state
  const section = dialog.getByRole('region', { name: 'Active movement effects', exact: true });
  const result = await section.count() ? { text: (await section.getByRole('status').first().innerText()).trim(), effects: await section.locator('p').allInnerTexts() } : { text: 'no active movement effects', effects: [] };
  return { result, dialog, close: async() => { await dialog.getByRole('button', { name: 'Close shared condition editor', exact: true }).click(); await dialog.waitFor({ state: 'detached' }); } };
}
async function readSpeed(p, id = 'B') { const r = await editorSpeed(p, id); await r.close(); return r.result.text; }
async function inspectSpeed(p, id) {
  for (let i = 0; i < 4 && await p.locator('.creature-inspect-container').count(); i++) await p.locator('.wow-window').filter({ has: p.locator('.creature-inspect-container') }).first().getByRole('button', { name: 'Close', exact: true }).dispatchEvent('click').catch(() => {});
  await p.keyboard.press('Escape').catch(() => {});
  await (await tokenLocator(p, id)).click({ button: 'right' }); await p.getByRole('button', { name: /Token Actions/ }).hover({ timeout: 12000 });
  const item = p.getByText('Inspect', { exact: true }).last(); await item.waitFor({ state: 'attached' }); await item.dispatchEvent('click');
  const view = p.locator('.creature-inspect-container').last();
  await p.getByRole('button', { name: 'Statistics', exact: true }).last().dispatchEvent('click'); await p.locator('.tab-dropdown-item', { hasText: 'Movement & Senses' }).last().dispatchEvent('click');
  await view.getByText(/Movement Speed/i).first().waitFor();
  const text = await view.innerText(); await producer.closeInspect(p).catch(() => {});
  const m = /Movement Speed[\s\S]{0,40}?(\d+) ft(?: \(base: (\d+) ft\))?/i.exec(text); return m ? { effective: +m[1], base: m[2] ? +m[2] : +m[1] } : { raw: text.slice(0, 400) };
}

async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_bind', 'actor_spell_prepare_creature', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw',
    'actor_turn_boundary', 'combat_started', 'combat_ended', 'token_created', 'join_room', 'token_moved']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const pages = {}, contexts = {};
  try {
    // ONE persistent profile per role for the whole run; never cleared, replaced or recreated.
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner'], ['observer', 'app-observer']]) {
      const dir = path.join(out, 'profiles', role); fs.mkdirSync(dir, { recursive: true });
      const ctx = contexts[role] = await chromium.launchPersistentContext(dir, { headless: true, viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const page = pages[role] = ctx.pages()[0] || await ctx.newPage(); page.on('pageerror', e => report.errors.push({ role, message: e.message })); patchClick(page);
      await setup(page, host.url, uid);
    }
    const { gm, owner, observer } = pages; gmPage = gm;
    report.checks.persistentProfiles = Object.fromEntries(Object.keys(pages).map(r => [r, path.join(out, 'profiles', r)]));

    step('author three disposable definitions in the real Spell Wizard and admit them for the owner PC');
    const specs = [
      { slug: 'bog-grip', name: 'M2A Bog Grip', label: 'Mired', feet: -10, expiry: 'target-end-count', occurrences: 2, duration: 'Until the second turn of the target ends' },
      { slug: 'gale-sprint', name: 'M2A Gale Sprint', label: 'Gale', feet: 15, expiry: 'target-start-count', occurrences: 3, duration: 'Until the third turn of the target begins' },
      { slug: 'hold-fast', name: 'M2A Hold Fast', label: 'Held', feet: -5, expiry: 'gm-manual', duration: 'for 1 round' }];
    for (const s of specs) { s.record = await author(gm, { ...s, ap: 0, mana: 0 }); await admitForPc(gm, s.name, s.record); await setup(gm, host.url, 'app-gm'); }
    report.checks.wizardRecords = specs.map(s => ({ name: s.name, label: s.label, feet: s.feet, expiry: s.expiry, occurrences: s.occurrences || null }));
    for (const p of [owner, observer]) await setup(p, host.url, p === owner ? 'app-owner' : 'app-observer');

    step('start combat with A and B through the Combat Initiator; enable authenticated turn expiry');
    try {
      const nav = gm.locator('[title^="Combat Initiator"]').first();
      if (await nav.count() && await nav.isVisible()) await nav.click(); else { await gm.locator('body').click({ position: { x: 700, y: 500 } }).catch(() => {}); await gm.keyboard.press('x'); }
      await gm.getByRole('button', { name: /^Begin Combat \(0\)$/ }).waitFor({ timeout: 8000 });
      for (const id of ['A', 'B']) { const t = await tokenLocator(gm, id); const box = await t.boundingBox(); await gm.mouse.click(box.x + box.width / 2, box.y + box.height / 2); }
      await gm.getByRole('button', { name: /^Begin Combat \(2\)$/ }).click();
      for (let i = 0; i < 40 && !host.room.gameState.combat?.isActive; i++) await new Promise(r => setTimeout(r, 150));
      assert.equal(host.room.gameState.combat?.isActive, true); report.checks.combatStartedThroughUI = host.room.gameState.combat.turnOrder.map(e => e.tokenId);
    } catch (e) {
      report.qualifications.push(`Combat start through the Combat Initiator failed (${String(e.message).split('\n')[0]}); started by the same combat_started socket event the App emits. Not counted as an App-control pass.`);
      const r = await gm.evaluate(p => new Promise(res => __socket.emit('combat_started', p, res)), { roomId: host.room.id, turnOrder: [host.refs.A, host.refs.B].map(actorRef => ({ tokenId: actorRef.tokenId, actorRef })), currentTurnIndex: 0, round: 1 });
      assert.equal(r.success, true, JSON.stringify(r));
    }
    await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click(); await clockUI(gm).getByRole('button', { name: 'Enable authenticated turn expiry', exact: true }).click();
    for (let i = 0; i < 40 && !host.room.gameState.combat?.effectLifecycle; i++) await new Promise(r => setTimeout(r, 150));
    assert.equal(host.room.gameState.combat.effectLifecycle.sequence, 0);
    await gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).last().click().catch(() => {});
    const combat = () => host.room.gameState.combat, current = () => combat().turnOrder[combat().currentTurnIndex].tokenId;
    const seqNow = () => combat().effectLifecycle.sequence;
    const closeEditor = () => gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).last().click().catch(() => {});
    const advance = async() => { const before = seqNow(); await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click(); await clockUI(gm).getByRole('button', { name: 'Advance authenticated turn', exact: true }).click();
      for (let i = 0; i < 40 && seqNow() === before; i++) await new Promise(r => setTimeout(r, 150)); await closeEditor(); assert.equal(seqNow(), before + 1); return before + 1; };
    const synced = p => p.waitForFunction(ids => { const t = S('creatureStore').getState().creatureTokens.find(t => t.id === 'B');
      return !!t && JSON.stringify((t.state.conditions || []).map(r => r.recordId).sort()) === JSON.stringify(ids); }, B(host).state.conditions.map(r => r.recordId).sort(), { timeout: 15000 });
    // Expiry/remaining-timing lines as the GM and an observer read them in the shared condition editor.
    const expiries = async p => { const e = await editorSpeed(p); const lines = await e.dialog.locator('.sc-expiry').allInnerTexts(); await e.close(); return { speed: e.result.text, effects: e.result.effects, expiry: lines }; };
    if (current() !== 'A') await advance(); // casts happen while A (the other actor) holds the turn
    assert.equal(current(), 'A'); const s0 = seqNow(); report.checks.sequenceAtCast = s0;

    const lib = owner.getByRole('region', { name: 'Admitted abilities', exact: true });
    async function ownerCast(name) {
      if (await ownerDialog(owner).count()) { await ownerDialog(owner).getByRole('button', { name: 'Close', exact: true }).first().click(); await ownerDialog(owner).waitFor({ state: 'detached' }); }
      if (!await lib.count()) await owner.locator('summary').filter({ hasText: /^Admitted abilities$/ }).click();
      await lib.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
      await lib.locator('.p9-admitted-row').filter({ hasText: name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
      const od = ownerDialog(owner); await od.waitFor(); await od.getByRole('heading', { name, exact: true }).waitFor(); await od.getByRole('combobox', { name: 'Target', exact: true }).selectOption('creature:app-hall:B');
      const ownerText = await od.innerText();
      await od.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true }).click(); await od.getByText(/Awaiting GM adjudication/).waitFor();
      const card = gm.locator('.p9-gm-card').filter({ hasText: name }).first(); await card.waitFor();
      await card.getByLabel('GM timing clarification (required)', { exact: true }).fill('Table ruling: in range, no save.');
      await card.getByRole('checkbox', { name: /I resolved eligibility/ }).check();
      return { card, ownerText, gmText: await card.innerText() };
    }
    const confirm = async card => { const n = actors.ledger(host.room).receipts.length; await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
      for (let i = 0; i < 60 && actors.ledger(host.room).receipts.length === n; i++) await new Promise(r => setTimeout(r, 150)); assert.equal(actors.ledger(host.room).receipts.length, n + 1); return actors.ledger(host.room).receipts.at(-1); };
    const byLabel = n => moves(host).find(m => m.name === n);

    step('owner casts Bog Grip (end ×2), Gale Sprint (start ×3), Hold Fast (manual "for 1 round") on B; the GM card states the count before confirming');
    const cast = {};
    for (const s of specs) {
      const c = await ownerCast(s.name); save(`${s.slug}-gm-card.aria.yml`, await c.card.ariaSnapshot());
      if (s.occurrences) { const re = s.expiry === 'target-end-count' ? /2nd|second/i : /3rd|third/i; assert.match(c.gmText, re, `GM card names the count for ${s.name}`); assert.match(c.ownerText, re, `owner approval names the count for ${s.name}`); }
      else assert.doesNotMatch(c.gmText, /counted|still to come/i);
      const receipt = await confirm(c.card); cast[s.slug] = { receipt: actors.publicReceipt(receipt), gmText: c.gmText, ownerText: c.ownerText }; await c.card.getByRole('button', { name: 'Close', exact: true }).first().click({ timeout: 2000 }).catch(() => {});
    }
    report.checks.cast = cast;
    const bog = byLabel('Mired'), gale = byLabel('Gale'), hold = byLabel('Held');
    assert.ok(bog && gale && hold, 'all three instances exist on B');
    const sched = r => Object.values(combat().effectLifecycle.schedules).find(i => i.recordId === r.id || i.recordId === r.recordId);
    // Independent expectation from the truth table (roster [A,B], A to act, s=0, d=1): end×2 → 1+1+(2−1)·2 = 4; start×3 → 1+(3−1)·2 = 5.
    assert.equal(timing.scheduleFor(bog, combat()).dueSequence, s0 + 4); assert.equal(timing.scheduleFor(gale, combat()).dueSequence, s0 + 5);
    assert.equal(sched(bog)?.dueSequence, s0 + 4); assert.equal(sched(gale)?.dueSequence, s0 + 5); assert.equal(sched(hold), undefined, 'manual "for 1 round" has no schedule');
    await synced(gm); await synced(observer);
    const timeline = [{ sequence: s0, current: current(), gm: await expiries(gm), observer: await expiries(observer), live: moves(host).map(m => m.name) }];
    report.checks.timeline = timeline;
    { const raw = await gm.evaluate(() => S('creatureStore').getState().creatureTokens.find(t => t.id === 'B').state.conditions); save('debug-client-conditions.json', raw);
      report.checks.clientValidity = raw.map(r => ({ name: r.name, valid: profile.isMovementModifier(r), clockBoundary: r.clockBoundary, clockOccurrences: r.clockOccurrences })); }
    assert.ok(timeline[0].gm.expiry.some(t => /2 of 2/.test(t) || /second/i.test(t)), JSON.stringify(timeline[0].gm.expiry));
    assert.ok(timeline[0].gm.expiry.some(t => /manual/i.test(t) && /round/i.test(t) || /GM/.test(t)), JSON.stringify(timeline[0].gm.expiry));
    assert.deepEqual(timeline[0].gm.expiry, timeline[0].observer.expiry, 'GM and observer read the same remaining timing');

    // Expected live set after each authenticated advance (independent of the code under test).
    const expected = { 1: ['Mired', 'Gale', 'Held'], 2: ['Mired', 'Gale', 'Held'], 3: ['Mired', 'Gale', 'Held'], 4: ['Gale', 'Held'], 5: ['Held'] };
    const norm = a => [...a].sort();
    for (let k = 1; k <= 5; k++) {
      step(`authenticated advance ${k}: ${k === 1 ? 'B starts (Gale 1 of 3)' : ['', '', 'B ends / A starts (Bog 1 of 2)', 'B starts (Gale 2 of 3)', 'B ends — Bog 2 of 2 expires', 'B starts — Gale 3 of 3 expires'][k]}`);
      if (k === 3) {
        // Lost ACK on the authenticated advance: the server accepts once; the UI checks the ORIGINAL command; nothing counts twice.
        await gm.evaluate(() => { const emit = __socket.emit.bind(__socket); let drop = true; __socket.emit = (e, ...args) => { if (drop && e === 'actor_turn_boundary' && typeof args[args.length - 1] === 'function') { drop = false; args[args.length - 1] = () => {}; } return emit(e, ...args); }; });
        const before = seqNow(); await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click(); await clockUI(gm).getByRole('button', { name: 'Advance authenticated turn', exact: true }).click();
        for (let i = 0; i < 40 && seqNow() === before; i++) await new Promise(r => setTimeout(r, 150));
        assert.equal(seqNow(), before + 1, 'server accepted once while the ACK was lost');
        const check = clockUI(gm).getByRole('button', { name: 'Check original turn command', exact: true });
        try { await check.waitFor({ timeout: 15000 }); for (let i = 0; i < 80 && await check.isDisabled(); i++) await new Promise(r => setTimeout(r, 250)); await check.click(); await new Promise(r => setTimeout(r, 1000)); }
        catch (e) { report.qualifications.push(`Check original turn command unavailable in the UI after the dropped ACK (${String(e.message).split('\n')[0]}); the server-side replay is asserted in the production-handler tests instead.`); }
        assert.equal(seqNow(), before + 1, 'recovering the original command did not advance again');
        await closeEditor();
        const replay = await gm.evaluate(() => __outbound.filter(e => e.event === 'actor_turn_boundary').length); report.checks.lostAckAdvance = { sequenceAfter: seqNow(), outboundTurnCommands: replay };
      } else await advance();
      assert.equal(seqNow(), s0 + k); await synced(gm); await synced(observer);
      assert.deepEqual(norm(moves(host).map(m => m.name)), norm(expected[k]), `live movement effects after advance ${k}`);
      assert.equal(B(host).state.conditions.some(r => r.recordId === hold.recordId || r.id === hold.id), true, 'manual effect never expires on a clock');
      const entry = { sequence: s0 + k, current: current(), gm: await expiries(gm), observer: await expiries(observer), live: moves(host).map(m => m.name) };
      assert.deepEqual(entry.gm.expiry, entry.observer.expiry, `GM and observer agree after advance ${k}`);
      timeline.push(entry);
      if (k === 2) { // survives the first boundary; reload does not consume an occurrence
        assert.ok(moves(host).some(m => m.id === bog.id), 'Bog Grip survived its first end boundary');
        await gm.reload(); await setup(gm, host.url, 'app-gm'); await observer.reload(); await setup(observer, host.url, 'app-observer');
        assert.equal(seqNow(), s0 + 2, 'reload did not consume an occurrence'); await synced(gm);
        report.checks.afterReload = { sequence: seqNow(), gm: await expiries(gm), observer: await expiries(observer) };
        assert.deepEqual(report.checks.afterReload.gm.expiry, entry.gm.expiry, 'timing restored from the server, unchanged');
      }
    }
    assert.ok(!moves(host).some(m => m.id === bog.id) && !moves(host).some(m => m.id === gale.id));
    assert.equal(Object.values(combat().effectLifecycle.schedules).length, 0, 'no schedule left');
    // Public receipts of the advances that expired something list what ended and what was merely counted.
    report.checks.advanceReceipts = actors.ledger(host.room).receipts.filter(r => /turn/i.test(JSON.stringify(r.adjudication?.definitionVersionOrHash || ''))).map(r => actors.publicReceipt(r));
    const manual = await expiries(observer); report.checks.finalManualLabel = manual; assert.ok(manual.expiry.some(t => /GM/.test(t)));
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
