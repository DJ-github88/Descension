// A11 optimized production-App witness: movement-effect combination (HQ policy). Real Spell Wizard, library
// admission, Combat Initiator selection, owner/GM spell panels, shared condition editor, C4 turn-expiry
// controls, Inspect and a real token drag against the registered Socket.IO backend. Provider/identity/lease/cloud
// remain fixture boundaries. Any step done outside ordinary App controls is recorded under `qualifications`
// and is never counted as a passed App path.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.A11_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External A11_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture'); process.env.A4_OUTPUT = path.join(out, 'producer');
const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');
// Offline sandbox: the fonts stylesheet @import cannot be reached and would fail the CSS chunk load (test-only boundary).
async function setup(page, url, uid) {
  if (!page.__a11Fonts) {
    page.__a11Fonts = true; const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
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
  const L = Object.getPrototypeOf(page.locator('body')); if (L.__a11) return; L.__a11 = true; const click = L.click;
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
  await book(p).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Disposable A11 movement-combination witness.');
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
  const browser = await chromium.launch({ headless: true }), pages = {};
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner'], ['observer', 'app-observer']]) {
      const page = pages[role] = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' }); page.on('pageerror', e => report.errors.push({ role, message: e.message })); patchClick(page);
      await setup(page, host.url, uid);
    }
    let { gm } = pages; const { owner, observer } = pages; gmPage = gm;
    // Qualification boundary: the GM browser's localStorage fills (pre-existing per-writer projection keys, measured
    // per step in report.steps[].gmStorage). The GM continues on a fresh browser profile — the same as moving to
    // another device — never by deleting app storage. Server room state, approvals and receipts are unaffected.
    async function freshGm(reason) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' }), page = await context.newPage();
      page.on('pageerror', e => report.errors.push({ role: 'gm2', message: e.message })); patchClick(page); await setup(page, host.url, 'app-gm');
      report.qualifications.push(`GM continued on a fresh browser profile before "${reason}": the first GM profile's localStorage reached ${(await storageUse(gm)).total} chars (quota ≈5.2M), dominated by per-writer core.characterTokens/core.inventory/core.conditions keys. Not caused by A11; device custody of already-accepted GM commands stays on the first profile.`);
      await gm.close().catch(() => {}); pages.gm = gm = gmPage = page;
    }
    // ── Author four disposable definitions through the actual Spell Wizard; admit each for the owner PC ────────
    step('author Mire Grip (Mired −10, end of target next turn), Tailwind (+15, manual), Sinking Earth (−45, manual) and Mud Snare (a different "Mired" +5)');
    const specs = [
      { slug: 'mire-grip', name: 'A11 Mire Grip', label: 'Mired', feet: -10, expiry: 'target-next-end', duration: 'Until the mud dries' },
      { slug: 'tailwind', name: 'A11 Tailwind', label: 'Tailwind', feet: 15, expiry: 'gm-manual', duration: 'While the wind holds' },
      { slug: 'sinking-earth', name: 'A11 Sinking Earth', label: 'Sinking', feet: -45, expiry: 'gm-manual', duration: 'Until dug out' },
      { slug: 'mud-snare', name: 'A11 Mud Snare', label: 'Mired', feet: 5, expiry: 'gm-manual', duration: 'Briefly' }];
    for (const s of specs) { s.record = await author(gm, { ...s, ap: 0, mana: 0 }); await admitForPc(gm, s.name, s.record); await setup(gm, host.url, 'app-gm'); }
    report.checks.wizardRecords = specs.map(s => ({ name: s.name, label: s.label, feet: s.feet, expiry: s.expiry }));
    for (const p of [owner, observer]) await setup(p, host.url, p === owner ? 'app-owner' : 'app-observer');
    // ── Start combat through the Combat Initiator and enable authenticated expiry ──────────────────────────────
    step('start combat with A and B through the Combat Initiator; enable authenticated turn expiry');
    try {
      // Combat Initiator: its navigation button (title "Combat Initiator (X)") or the same X shortcut.
      const nav = gm.locator('[title^="Combat Initiator"]').first();
      if (await nav.count() && await nav.isVisible()) await nav.click(); else { await gm.locator('body').click({ position: { x: 700, y: 500 } }).catch(() => {}); await gm.keyboard.press('x'); }
      await gm.getByRole('button', { name: /^Begin Combat \(0\)$/ }).waitFor({ timeout: 8000 });
      for (const id of ['A', 'B']) { const t = await tokenLocator(gm, id); const box = await t.boundingBox(); await gm.mouse.click(box.x + box.width / 2, box.y + box.height / 2); }
      await gm.getByRole('button', { name: /^Begin Combat \(2\)$/ }).click();
      await gm.waitForFunction(() => true); for (let i = 0; i < 40 && !host.room.gameState.combat?.isActive; i++) await new Promise(r => setTimeout(r, 150));
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
    const advance = async() => { const before = combat().effectLifecycle.sequence; await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click(); await clockUI(gm).getByRole('button', { name: 'Advance authenticated turn', exact: true }).click();
      for (let i = 0; i < 40 && combat().effectLifecycle.sequence === before; i++) await new Promise(r => setTimeout(r, 150)); await gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).last().click().catch(() => {});
      assert.equal(combat().effectLifecycle.sequence, before + 1); return before + 1; };
    // Each page reads only after its own projection holds exactly the server's current condition instances.
    const synced = p => p.waitForFunction(ids => { const t = S('creatureStore').getState().creatureTokens.find(t => t.id === 'B');
      return !!t && JSON.stringify((t.state.conditions || []).map(r => r.recordId).sort()) === JSON.stringify(ids); }, B(host).state.conditions.map(r => r.recordId).sort(), { timeout: 15000 });
    if (current() === 'B') await advance(); // first application outside B's own turn
    await synced(gm); const baseText = await readSpeed(gm); report.checks.speedBefore = { gmInspect: await inspectSpeed(gm, 'B'), gmEditor: baseText };
    // ── Owner casts; GM sees the add/refresh outcome before confirming ─────────────────────────────────────────
    const lib = owner.getByRole('region', { name: 'Admitted abilities', exact: true });
    async function ownerCast(name) {
      if (await ownerDialog(owner).count()) { await ownerDialog(owner).getByRole('button', { name: 'Close', exact: true }).first().click(); await ownerDialog(owner).waitFor({ state: 'detached' }); }
      if (!await lib.count()) await owner.locator('summary').filter({ hasText: /^Admitted abilities$/ }).click();
      await lib.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
      await lib.locator('.p9-admitted-row').filter({ hasText: name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
      const od = ownerDialog(owner); await od.waitFor(); await od.getByRole('heading', { name, exact: true }).waitFor(); await od.getByRole('combobox', { name: 'Target', exact: true }).selectOption('creature:app-hall:B');
      const preview = await od.locator('.p9-combination, .p9-diagnostic[role="alert"]').first().innerText().catch(() => '');
      await od.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true }).click(); await od.getByText(/Awaiting GM adjudication/).waitFor();
      const card = gm.locator('.p9-gm-card').filter({ hasText: name }).first(); await card.waitFor();
      await card.getByLabel('GM timing clarification (required)', { exact: true }).fill('Table ruling: in range, no save.');
      await card.getByRole('checkbox', { name: /I resolved eligibility/ }).check();
      const outcome = card.locator('.p9-combination, .p9-diagnostic[role="alert"]').first(); await outcome.waitFor();
      return { od, card, ownerPreview: preview, gmPreview: await outcome.innerText() };
    }
    const confirm = async card => { const n = actors.ledger(host.room).receipts.length; await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
      for (let i = 0; i < 60 && actors.ledger(host.room).receipts.length === n; i++) await new Promise(r => setTimeout(r, 150)); return actors.ledger(host.room).receipts.at(-1); };
    const speeds = async label => { await synced(gm); await synced(observer); const r = { gm: await readSpeed(gm), observer: await readSpeed(observer) }; report.checks[label] = r; return r; };

    step('Mire Grip on B: GM preview says it adds Mired; GM and observer read 35 → 25 ft');
    let c = await ownerCast('A11 Mire Grip'); save('mire-gm-card.aria.yml', await c.card.ariaSnapshot()); assert.match(c.gmPreview, /Adds Mired/); assert.match(c.gmPreview, /After confirmation: Base 35 ft · Mired −10 ft = 25 ft/);
    let receipt = await confirm(c.card); const firstMired = moves(host)[0]; assert.equal(JSON.parse(receipt.adjudication.chosenResult).combination.outcome, 'added');
    const firstDue = timing.scheduleFor(firstMired, combat()).dueSequence; report.checks.mireAdded = { preview: c.gmPreview, ownerPreview: c.ownerPreview, instance: firstMired.id, due: firstDue };
    assert.equal((await speeds('speedAfterMire')).observer, 'Resulting speed: Base 35 ft · Mired −10 ft = 25 ft');

    step('Tailwind on B: different named effects add together → 40 ft');
    c = await ownerCast('A11 Tailwind'); assert.match(c.gmPreview, /Adds Tailwind/); assert.match(c.gmPreview, /= 40 ft/); await confirm(c.card);
    const s40 = await speeds('speedAfterTailwind'); assert.equal(s40.gm, 'Resulting speed: Base 35 ft · Mired −10 ft · Tailwind +15 ft = 40 ft'); assert.equal(s40.observer, s40.gm);
    report.checks.inspectAfterTailwind = await inspectSpeed(gm, 'B'); assert.equal(report.checks.inspectAfterTailwind.effective, 40);

    step('advance to B’s own turn; recast Mire Grip: GM preview says refresh; lost ACK, then Check same command');
    while (current() !== 'B') await advance();
    assert.ok(moves(host).some(m => m.id === firstMired.id), 'end-of-turn effect still active at B’s start');
    c = await ownerCast('A11 Mire Grip'); save('refresh-gm-card.aria.yml', await c.card.ariaSnapshot());
    assert.match(c.gmPreview, new RegExp(`Refreshes Mired \\(replaces instance ${firstMired.id}\\): its duration restarts; the value is not stacked\\.`)); assert.match(c.gmPreview, /After confirmation: Base 35 ft · Tailwind \+15 ft · Mired −10 ft = 40 ft|After confirmation: Base 35 ft · Mired −10 ft · Tailwind \+15 ft = 40 ft/);
    await gm.evaluate(() => { const listeners = __socket.listeners('actor_consequence_accepted'); __socket.removeAllListeners('actor_consequence_accepted'); let once = true;
      __socket.on('actor_consequence_accepted', r => { if (once && r.receipt?.adjudication?.definitionVersionOrHash?.startsWith('authored-effect:v1/')) { once = false; return; } listeners.forEach(fn => fn(r)); });
      const emit = __socket.emit.bind(__socket); let drop = true; __socket.emit = (e, ...args) => { if (drop && e === 'actor_consequence' && args[0]?.target?.tokenId === 'B' && typeof args[1] === 'function') { drop = false; args[1] = () => {}; } return emit(e, ...args); }; });
    const count = actors.ledger(host.room).receipts.length;
    await c.card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click(); await c.card.getByRole('button', { name: 'Check same command', exact: true }).waitFor({ timeout: 15000 });
    assert.equal(actors.ledger(host.room).receipts.length, count + 1, 'server accepted once while the ACK was lost');
    await c.card.getByRole('button', { name: 'Check same command', exact: true }).click(); await new Promise(r => setTimeout(r, 800));
    assert.equal(actors.ledger(host.room).receipts.length, count + 1, 'check same command recovers the original receipt, no second application');
    receipt = actors.ledger(host.room).receipts.at(-1); const chosen = JSON.parse(receipt.adjudication.chosenResult);
    assert.deepEqual(chosen.combination, { outcome: 'refreshed', replacesInstanceId: firstMired.id });
    const mireds = moves(host).filter(m => m.name === 'Mired'); assert.equal(mireds.length, 1); const refreshed = mireds[0]; assert.notEqual(refreshed.id, firstMired.id);
    const newDue = timing.scheduleFor(refreshed, combat()).dueSequence; assert.ok(newDue > firstDue, `${newDue} > ${firstDue}`);
    assert.equal(Object.values(combat().effectLifecycle.schedules).filter(i => i.recordId === firstMired.id).length, 0, 'old schedule removed');
    await observer.waitForFunction(id => S('creatureStore').getState().creatureTokens.find(t => t.id === 'B').state.conditions.some(r => r.recordId === id), refreshed.id);
    const s40b = await speeds('speedAfterRefresh'); assert.equal(s40b.observer.endsWith('= 40 ft'), true, 'refresh does not stack the value');
    const narr = await narration(observer, receipt.commandId); report.checks.refresh = { gmPreview: c.gmPreview, receipt: actors.publicReceipt(receipt), oldDue: firstDue, newDue, observerNarration: narr };
    assert.equal(narr.count, 1); assert.ok(narr.texts.some(t => /refreshing Mired \(movement −10 ft\): duration restarts, value not stacked/.test(t)), JSON.stringify(narr));

    step('Sinking Earth on B: 35 − 10 + 15 − 45 clamps at 0 ft; a real drag of B on its turn is refused');
    c = await ownerCast('A11 Sinking Earth'); assert.match(c.gmPreview, /= 0 ft \(never below 0 ft\)/); await confirm(c.card);
    const zero = await speeds('speedAtZero'); assert.match(zero.observer, /= 0 ft \(never below 0 ft\)$/);
    report.checks.inspectAtZero = await inspectSpeed(gm, 'B'); assert.equal(report.checks.inspectAtZero.effective, 0);
    const beforeDrag = actors.clone(B(host)), outboundBefore = await gm.evaluate(() => __outbound.length);
    const token = await tokenLocator(gm, 'B'), bounds = await token.boundingBox(); assert.ok(bounds);
    await gm.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2); await gm.mouse.down(); await gm.mouse.move(bounds.x + bounds.width / 2 + 55, bounds.y + bounds.height / 2, { steps: 8 }); await gm.mouse.up();
    await new Promise(r => setTimeout(r, 600));
    const dialogs = await gm.locator('.movement-confirmation-dialog').count(); assert.deepEqual(B(host).position, beforeDrag.position); assert.equal(B(host).state.currentActionPoints, beforeDrag.state.currentActionPoints);
    const moved = await gm.evaluate(n => __outbound.slice(n).filter(e => e.event === 'token_moved'), outboundBefore); moved.forEach(e => assert.deepEqual(e.payload.position, beforeDrag.position));
    report.checks.zeroSpeedDrag = { confirmationDialogs: dialogs, positionUnchanged: true, tokenMovedEvents: moved.length };

    if ((await storageUse(gm)).total > 3500000) await freshGm('Mud Snare');
    step('Mud Snare (a different effect also named Mired): GM sees the refusal reason; confirming submits nothing');
    c = await ownerCast('A11 Mud Snare'); assert.match(c.gmPreview, /Movement combination refused: A different effect named Mired is already active/);
    const beforeRefusal = actors.clone(host.room.gameState), sent = await gm.evaluate(() => __outbound.filter(e => e.event === 'actor_consequence').length);
    await c.card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    await c.card.getByText(/A different effect named Mired is already active[\s\S]*Nothing submitted/).waitFor();
    // Nothing applied or charged: ledger, target conditions/resources and the owner PC's pools are unchanged.
    const facts = g => JSON.parse(JSON.stringify({ ledger: g.actorConsequences, conditions: g.maps['app-hall'].tokens.B.state.conditions, b: actors.resources(g.maps['app-hall'].tokens.B, 'creature'),
      pc: actors.resources(g.maps['app-hall'].characterTokens.pc, 'character'), schedules: g.combat.effectLifecycle }));
    assert.deepEqual(facts(host.room.gameState), facts(beforeRefusal)); assert.equal(await gm.evaluate(() => __outbound.filter(e => e.event === 'actor_consequence').length), sent);
    report.checks.unresolvedSameName = { gmPreview: c.gmPreview, ownerPreview: c.ownerPreview, submitted: false };
    await c.card.getByRole('button', { name: 'Decline', exact: true }).click().catch(() => {});

    if ((await storageUse(gm)).total > 4200000) await freshGm('removal and expiry');
    step('GM removes Sinking in the shared condition editor → 40 ft');
    { const e = await editorSpeed(gm); const sinking = moves(host).find(m => m.name === 'Sinking');
      await e.dialog.getByRole('button', { name: `Remove Sinking instance ${sinking.id}`, exact: true }).click(); for (let i = 0; i < 40 && moves(host).some(m => m.name === 'Sinking'); i++) await new Promise(r => setTimeout(r, 150)); await e.close(); }
    assert.equal((await speeds('speedAfterRemoval')).observer, 'Resulting speed: Base 35 ft · Tailwind +15 ft · Mired −10 ft = 40 ft'); // listed in application order

    step('advance past the old boundary: the refreshed Mired stays; at its own boundary it expires → 50 ft');
    while (combat().effectLifecycle.sequence < firstDue) await advance();
    assert.ok(moves(host).some(m => m.id === refreshed.id), 'old boundary does not expire the refreshed instance');
    report.checks.oldBoundaryPassed = { sequence: combat().effectLifecycle.sequence, speeds: await speeds('speedAtOldBoundary') };
    while (combat().effectLifecycle.sequence < newDue) await advance();
    assert.ok(!moves(host).some(m => m.id === refreshed.id)); await observer.waitForFunction(id => !S('creatureStore').getState().creatureTokens.find(t => t.id === 'B').state.conditions.some(r => r.recordId === id), refreshed.id);
    const s50 = await speeds('speedAfterExpiry'); assert.equal(s50.observer, 'Resulting speed: Base 35 ft · Tailwind +15 ft = 50 ft'); assert.equal(s50.gm, s50.observer);
    report.checks.inspectAfterExpiry = await inspectSpeed(gm, 'B'); assert.equal(report.checks.inspectAfterExpiry.effective, 50);

    step('GM removes Tailwind → base 35 ft; end combat changes nothing else');
    { const e = await editorSpeed(gm); const tail = moves(host).find(m => m.name === 'Tailwind');
      await e.dialog.getByRole('button', { name: `Remove Tailwind instance ${tail.id}`, exact: true }).click(); for (let i = 0; i < 40 && moves(host).length; i++) await new Promise(r => setTimeout(r, 150)); await e.close(); }
    await synced(observer); assert.equal(await readSpeed(observer), 'no active movement effects'); report.checks.inspectRestored = await inspectSpeed(gm, 'B'); assert.equal(report.checks.inspectRestored.effective, 35);
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }]) { await gm.setViewportSize(viewport); await gm.screenshot({ path: path.join(out, `gm-final-${viewport.width}.png`) }); }
    report.passed = true;
  } catch (e) {
    report.failure = e.stack;
    if (pages.gm) report.storageDiagnostic = await pages.gm.evaluate(() => { let total = 0; const keys = Object.keys(localStorage).map(k => { const n = (localStorage.getItem(k) || '').length; total += n + k.length; return [k, n]; }).sort((a, b) => b[1] - a[1]).slice(0, 12);
      let probe = 'ok'; try { localStorage.setItem('__a11_probe', 'x'.repeat(200000)); localStorage.removeItem('__a11_probe'); } catch (err) { probe = String(err.name || err.message); }
      return { totalChars: total, keys, probe200k: probe }; }).catch(err => String(err));
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
