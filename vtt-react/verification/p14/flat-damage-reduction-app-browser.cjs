// Shared flat damage-reduction (Aegis Ward +3 flat DR) — optimized production-App witness.
// Ordinary controls: Spell Wizard authoring/save, Spell Library reopen + room admission, Admitted abilities cast (owner PC → creature B),
// GM adjudication card, shared condition editor (exact removal), owner basic weapon strike dialog, GM strike card (P12A).
// Provider identity/ownership/lease/cloud are fixtures; GM-ruled manual steps and any non-ordinary step are listed under `qualifications`.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.DR_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External DR_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture'); process.env.A4_OUTPUT = path.join(out, 'producer');
const legacySetup = require('../p9/integration/app-browser.cjs').setup;
const actors = require('../../../server/services/actorConsequences');
const profile = require('../../src/services/sharedConditionProfile');
const pure = require('../../src/services/authoredAbility');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { startedAt: new Date().toISOString(), checks: {}, qualifications: [], errors: [], steps: [],
  limits: ['Optimized production App and the registered production backend; provider identity, canonical ownership, room lease and cloud persistence are fixture boundaries.',
    'Temporary room, accepted-live only. No live Firebase, deployment, physical second device or human tabletop session.'] };
const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); save('progress.json', report); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(fn, label, tries = 75) { for (let i = 0; i < tries; i++) { if (await fn()) return; await sleep(200); } throw Error(`Timed out: ${label}`); }
const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true }), ownerDialog = p => p.getByRole('dialog', { name: 'Supported spell cast', exact: true });
const hall = host => host.room.gameState.maps['app-hall'], B = host => hall(host).tokens.B;
const hpTotal = host => B(host).state.currentHp + (B(host).state.tempHealth || 0);

function patchClick(page) {
  const L = Object.getPrototypeOf(page.locator('body')); if (L.__dr) return; L.__dr = true; const click = L.click;
  L.click = async function(options = {}) { try { return await click.call(this, { timeout: 20000, ...options }); } catch (e) { if (options.force || !/not stable|intercepts pointer/.test(String(e.message))) throw e; return click.call(this, { ...options, force: true }); } };
}
/** Same normal-App setup as the P12 witness; strike handlers are resolved by behaviour, not by build-specific mangled names. */
async function setup(page, host, uid) {
  if (!page.__drInit) {
    page.__drInit = true;
    const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    page.goto = async(...args) => { await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {}); await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts); return goto(...args); };
  }
  await legacySetup(page, host.url, uid);
  await page.evaluate(async uid => {
    const moduleWith = text => { const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); if (!pair) throw Error('Missing compiled ' + text); return __req(pair[0]); };
    const strike = moduleWith('Submitting one AP/HP consequence');
    const fns = Object.values(strike).filter(f => typeof f === 'function');
    const register = fns.find(f => f.toString().includes('actor_strike_pending') && f.toString().includes('socket'));
    const refresh = fns.find(f => f.toString().includes('actor_strike_list') && !f.toString().includes('actor_strike_pending') && !f.toString().includes('actor_strike_approve'));
    const loadData = fns.find(f => f.toString().includes('creatures.json'));
    if (!register || !refresh || !loadData) throw Error('Strike handlers not resolved');
    register({ socket: __socket }); await refresh(); await loadData();
    const registerRoomJoined = Object.values(moduleWith('[roomRejoin] subscriber failed')).find(fn => typeof fn === 'function' && fn.toString().includes('room_joined'));
    if (registerRoomJoined) registerRoomJoined(__socket);
    if (uid === 'app-owner') S('characterStore').setState({ stats: { ...S('characterStore').getState().stats, strength: 14, agility: 16 },
      skillRanks: { weaponMastery: 'ADEPT', weaponMastery_sword: 'TRAINED', weaponMastery_bow: 'NOVICE' },
      equipment: { ...S('characterStore').getState().equipment, ranged: { id: 'dr-bow', name: 'Witness Bow', subtype: 'BOW', slots: ['ranged'], weaponStats: { baseDamage: { diceCount: 1, diceType: 'd6', damageType: 'stabbing' } } } } });
  }, uid);
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
/** Actual Spell Wizard: composed effect profile with one flat damage-reduction change. */
async function author(p, c) {
  await openBook(p);
  await book(p).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(c.name);
  await book(p).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Disposable flat damage-reduction witness.');
  await book(p).getByText('Arcane', { exact: true }).click();
  const nav = book(p).getByRole('navigation', { name: 'Spell wizard steps' });
  await nav.getByRole('button', { name: /Spell Type$/ }).click(); await book(p).getByRole('heading', { name: 'ACTION', exact: true }).click(); await book(p).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await nav.getByRole('button', { name: /^3 Effects$/ }).click();
  await book(p).getByRole('heading', { name: 'Control', exact: true }).click();
  await book(p).getByRole('button', { name: /^Use composed effect profile/ }).click();
  const fields = book(p).getByRole('group', { name: /^Composed effect/ });
  await fields.getByLabel(/^Canonical effect/).selectOption('damageReduction');
  await fields.getByLabel(/^Effect name shown on the target/).fill(c.label);
  await fields.getByLabel(/^Flat damage reduction \(whole number/).fill(String(c.amount));
  await fields.getByLabel(/^Expiry/).selectOption('gm-manual');
  await fields.getByLabel(/^Source-authored duration text/).fill('Until the ward fades');
  await fields.getByLabel(/^Required GM adjudication note/).fill('GM resolves eligibility, range and any save at the table before confirming.');
  report.checks.wizardFields = await fields.innerText(); save('wizard-fields.aria.yml', await fields.ariaSnapshot());
  report.checks.wizardSaveSectionHidden = (await fields.getByText('Saving throw (optional)').count()) === 0; assert.equal(report.checks.wizardSaveSectionHidden, true);
  await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click(); await book(p).getByText('Single Target', { exact: true }).click(); await book(p).getByText('Ranged', { exact: true }).click();
  const slider = book(p).getByRole('slider').first(); await slider.focus(); await slider.press('Home'); for (let i = 0; i < 6; i++) await slider.press('ArrowRight');
  await book(p).getByText('Enemies', { exact: true }).click(); await book(p).getByText('Any Target', { exact: true }).click();
  await nav.getByRole('button', { name: /Resources$/ }).click(); await book(p).getByTitle('Standard magical energy', { exact: true }).click(); await book(p).getByTitle('Basic action economy', { exact: true }).click();
  const inputs = book(p).getByRole('spinbutton'); await inputs.nth(0).fill('1'); await inputs.nth(0).fill('0'); await inputs.nth(1).fill('1'); await inputs.nth(1).fill('0');
  await p.getByRole('button', { name: '✓ Complete Spell', exact: true }).click({ force: true });
  await p.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), c.name);
  const r = await savedRecord(p, c.name); save('aegis-saved.json', r);
  const mapped = pure.definitionFromWizard(r, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' }); assert.equal(mapped.ok, true, JSON.stringify(mapped));
  assert.deepEqual(mapped.definition.effects.condition, { kind: 'damageReduction', amount: c.amount, label: c.label });
  await closeBook(p); return r;
}
async function admitForPc(p, name, original) {
  await openBook(p); await book(p).getByRole('button', { name: 'Spell Library', exact: true }).click(); await book(p).getByText(name, { exact: true }).click();
  const section = p.getByRole('region', { name: `Room admission for ${name}`, exact: true }); await section.waitFor();
  assert.deepEqual(await savedRecord(p, name), original, 'save/reopen preserved the whole record');
  save('aegis-reopened.aria.yml', await section.ariaSnapshot());
  await section.getByRole('button', { name: 'Admit this saved version', exact: true }).click(); await section.getByText(/^Admitted for /).waitFor();
  save('aegis-admitted.aria.yml', await section.ariaSnapshot());
  await p.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click({ timeout: 3000 }).catch(() => p.keyboard.press('Escape'));
}
async function ownerStrike(owner, gm, host, faces) {
  // GM recharges the owner PC's AP through the shared resource control (fixture convenience, disclosed).
  await gm.evaluate(async() => { await __actors.refreshActorSnapshot(); const r = await __actors.adjustSharedResource('pc', 'actionPoints', 4); if (!r.success) throw Error(JSON.stringify(r)); });
  await owner.evaluate(() => __actors.refreshActorSnapshot());
  const wing = owner.locator('.action-bar-assembly:not(.spell-action-bar-assembly) .equipment-action-slot-wrapper.slot-ranged');
  await wing.locator('.equipment-action-slot').click(); await wing.getByAltText('Ranged Attack (Witness Bow)', { exact: true }).click();
  const d = owner.getByRole('dialog', { name: 'Basic weapon strike', exact: true }); await d.waitFor();
  await d.getByRole('combobox', { name: 'Strike target', exact: true }).selectOption('creature:app-hall:B');
  await d.getByLabel('Physical weapon faces', { exact: true }).fill(String(faces)); await d.getByRole('button', { name: 'Record weapon faces', exact: true }).click();
  await d.getByLabel('Physical proficiency faces', { exact: true }).fill('5'); await d.getByRole('button', { name: 'Record proficiency faces', exact: true }).click();
  await d.getByRole('button', { name: 'Approve 2 AP and send to GM', exact: true }).click(); await d.getByText('Awaiting GM adjudication. Approval spends nothing.', { exact: true }).waitFor();
  const card = gm.locator('.p12-gm-card').filter({ has: gm.getByRole('button', { name: 'Confirm and apply', exact: true }) }).last(); await card.waitFor();
  return { d, card };
}
async function gmAcceptStrike(owner, gm, host, { d, card }, label) {
  const text = await card.innerText(); save(`gm-strike-${label}.txt`, text); save(`gm-strike-${label}.aria.yml`, await card.ariaSnapshot());
  await card.getByRole('combobox', { name: 'Proficiency outcome', exact: true }).selectOption('deferred');
  const verdict = card.getByRole('combobox', { name: 'Listed defense verdict', exact: true });
  const manualListed = await verdict.count(); if (manualListed) await verdict.selectOption('not-applicable');
  const before = hpTotal(host);
  await card.getByRole('button', { name: 'Confirm and apply', exact: true }).click();
  await owner.getByText(/^Accepted: AP/).first().waitFor({ timeout: 20000 });
  await d.getByRole('button', { name: 'Close strike', exact: true }).click().catch(() => {});
  return { text, manualListed, damage: before - hpTotal(host) };
}
const ownerCastAegis = async(owner, gm, name) => {
  const lib = owner.getByRole('region', { name: 'Admitted abilities', exact: true });
  if (!await lib.count()) await owner.locator('summary').filter({ hasText: /^Admitted abilities$/ }).click();
  await lib.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
  await lib.locator('.p9-admitted-row').filter({ hasText: name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
  const od = ownerDialog(owner); await od.waitFor(); await od.getByRole('heading', { name, exact: true }).waitFor();
  const select = od.getByRole('combobox', { name: 'Target', exact: true });
  const val = await select.locator('option').evaluateAll(opts => opts.map(e => e.value).find(v => {
    try { const r = JSON.parse(v); return (r.tokenId === 'B' || r.id === 'B') && r.kind === 'creature'; } catch (_) { return v.includes('creature') && v.includes('B'); }
  }) || opts.find(e => /creature.*B/i.test(e.textContent || e.innerText))?.value);
  assert(val, 'creature B option exists'); await select.selectOption(val);
  const ownerPreview = await od.locator('.p9-combination, .p9-diagnostic[role="alert"]').first().innerText().catch(() => '');
  await od.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true }).click(); await od.getByText(/Awaiting GM adjudication/).waitFor();
  const card = gm.locator('.p9-gm-card').filter({ hasText: name }).first(); await card.waitFor();
  await card.getByLabel('GM timing clarification (required)', { exact: true }).fill('Table ruling: in range, no save.');
  await card.getByRole('checkbox', { name: /I resolved eligibility/ }).check();
  const outcome = card.locator('.p9-combination, .p9-diagnostic[role="alert"]').first(); await outcome.waitFor();
  return { od, card, ownerPreview, gmPreview: await outcome.innerText() };
};
async function openEditor(gm) {
  const controls = gm.getByRole('region', { name: 'Actor attachment and consequences', exact: true });
  const select = controls.getByRole('combobox', { name: 'Exact room attachment', exact: true });
  const val = await select.locator('option').evaluateAll(opts => opts.map(e => e.value).find(v => {
    return v === 'creature:B' || v === 'creature:app-hall:B' || (v.includes('creature') && v.includes('B'));
  }) || opts.find(e => /B.*B/i.test(e.textContent || e.innerText))?.value);
  if (val) await select.selectOption(val);
  else await select.selectOption('creature:B');
  await controls.getByRole('button', { name: 'Edit selected shared conditions', exact: true }).click();
  const dialog = gm.getByRole('dialog', { name: 'Edit selected shared conditions editor', exact: true }); await dialog.waitFor();
  await dialog.getByText(/^Stunned (inactive\.|active:)/).first().waitFor({ timeout: 15000 });
  return { dialog, close: async() => { await dialog.getByRole('button', { name: 'Close shared condition editor', exact: true }).click(); await dialog.waitFor({ state: 'detached' }); } };
}

async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_bind', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw', 'actor_strike_approve', 'actor_strike_list',
    'actor_strike_withdraw', 'actor_strike_decline', 'join_room']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const browser = await chromium.launch({ channel: 'chrome', headless: true }), pages = {};
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner']]) {
      const page = pages[role] = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' }); page.on('pageerror', e => report.errors.push({ role, message: e.message })); patchClick(page);
      await setup(page, host, uid);
    }
    const { gm, owner } = pages;
    const statsBefore = actors.clone(B(host).stats), pcBefore = actors.clone(hall(host).characterTokens.pc.character.stats || {});

    step('GM authors Aegis Ward (+3 flat DR) in the Spell Wizard; the saved record is reopened from the Spell Library and admitted for the owner PC');
    const record = await author(gm, { name: 'DR Aegis Ward', label: 'Aegis Ward', amount: 3 }); await admitForPc(gm, 'DR Aegis Ward', record);
    report.checks.wizardRecord = record.authoredDraft?.controlConfig?.authoredCondition;
    await setup(gm, host, 'app-gm'); await setup(owner, host, 'app-owner');

    step('baseline strike (no flat DR): Witness Bow d6 face 5 + Agility modifier → full proposed damage reaches B; GM card shows no automated defense step');
    let s = await ownerStrike(owner, gm, host, 5); const baseline = await gmAcceptStrike(owner, gm, host, s, 'baseline');
    report.checks.baseline = baseline; assert.match(baseline.text, /No automated defense step: (\d+) .+ \1/);
    const full = baseline.damage; assert.ok(full >= 5, 'baseline damage is the full proposed amount'); report.checks.fullDamage = full;

    step('owner casts Aegis Ward on creature B; GM preview names the flat DR once; GM confirms; one exact record installs');
    const c = await ownerCastAegis(owner, gm, 'DR Aegis Ward'); save('aegis-gm-card.aria.yml', await c.card.ariaSnapshot());
    assert.match(c.gmPreview, /Flat DR \+3/); report.checks.castPreview = { owner: c.ownerPreview, gm: c.gmPreview };
    const receipts = actors.ledger(host.room).receipts.length;
    await c.card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    await until(() => actors.ledger(host.room).receipts.length > receipts, 'Aegis Ward accepted');
    assert.equal(B(host).state.conditions.filter(profile.isDamageReductionModifier).length, 1); const rec = B(host).state.conditions.find(profile.isDamageReductionModifier);
    assert.deepEqual(rec.effects, { damageReduction: 3 }); assert.deepEqual(B(host).stats, statsBefore, 'creature base stats unchanged');
    report.checks.installed = { recordId: rec.recordId, effects: rec.effects, durationType: rec.durationType };
    const closeBtn = c.od.getByRole('button', { name: 'Close', exact: true });
    if (await closeBtn.count()) await closeBtn.click();
    await owner.keyboard.press('Escape').catch(() => {});
    await c.od.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});

    step('supported damage calculation: the same strike now shows Flat DR 3 once; GM accepts; B loses exactly proposed − 3');
    s = await ownerStrike(owner, gm, host, 5); const withDr = await gmAcceptStrike(owner, gm, host, s, 'with-dr');
    report.checks.withDr = withDr; assert.match(withDr.text, /Flat DR 3: (\d+) .+ (\d+) \(Laws rounding\)/);
    assert.equal(withDr.damage, full - 3, 'flat DR subtracted exactly once'); assert.equal(B(host).state.conditions.filter(profile.isDamageReductionModifier).length, 1, 'strike never consumes or edits the effect');

    step('reload: GM App rehydrates one instance, the editor shows the exact instance, and the next strike still shows Flat DR 3 once');
    await setup(gm, host, 'app-gm'); await setup(owner, host, 'app-owner');
    s = await ownerStrike(owner, gm, host, 5); const withDrReload = await gmAcceptStrike(owner, gm, host, s, 'with-dr-reload');
    report.checks.withDrReload = withDrReload; assert.match(withDrReload.text, /Flat DR 3: (\d+) .+ (\d+) \(Laws rounding\)/);
    assert.equal(withDrReload.damage, full - 3, 'flat DR subtracted exactly once after reload');

    const e1 = await openEditor(gm); const region = e1.dialog.getByRole('region', { name: 'Active flat damage reduction', exact: true }); await region.waitFor();
    report.checks.gmEditor = await region.innerText(); save('gm-editor-dr.aria.yml', await region.ariaSnapshot());
    assert.equal(await region.getByRole('button', { name: /^Remove .* instance / }).count(), 1);

    step('GM removes the exact instance in the shared condition editor; the original (no flat DR) calculation is restored');
    await region.getByRole('button', { name: `Remove Aegis Ward instance ${rec.recordId}`, exact: true }).click();
    await until(() => !B(host).state.conditions.some(profile.isDamageReductionModifier), 'removed'); await e1.close();
    s = await ownerStrike(owner, gm, host, 5); const restored = await gmAcceptStrike(owner, gm, host, s, 'restored');
    report.checks.restored = restored; assert.match(restored.text, /No automated defense step/); assert.equal(restored.damage, full, 'original unreduced damage restored');
    assert.deepEqual(B(host).stats, statsBefore, 'creature base stats unchanged after removal');

    report.qualifications.push('Fixtures: temporary room, creature "B" (grimmstalk, smashing resistance only; the Witness Bow strike is stabbing so no tier applies), owner PC "Ilse" with a Witness Bow and Agility 16 set on the character store, provider identity/ownership/lease/cloud.');
    report.qualifications.push('GM recharged the owner PC\'s AP through the shared resource control before each strike (fixture convenience; the strike costs 2 AP each time).');
    report.qualifications.push('Aegis Ward was authored as a single-mechanic +3 flat DR spell at 0 AP / 0 mana so the witness keeps AP for strikes. The legacy catalogue Aegis Ward (spg_aegis_ward, armor statModifier plus an absorb-next-hit rider) is NOT admitted or rewritten.');
    report.qualifications.push('Target is a creature: a beneficial rider on a PC target needs target-owner acceptance, which is covered in the registered-handler suite, not App-witnessed here. Counted turn-boundary expiry is likewise server-suite only; removal was the App-witnessed end.');
    report.qualifications.push('Critical hits, resistance-tier coexistence, equipment blocking and Defending are refused/manual by design and covered by the server and client suites, not by this witness.');
    for (const [k, p] of Object.entries(pages)) await p.screenshot({ path: path.join(out, `final-${k}.png`) }).catch(() => {});
    report.passed = report.errors.length === 0;
    if (!report.passed) report.qualifications.push(`Page errors recorded: ${report.errors.length}`);
  } catch (e) {
    report.error = String(e.stack || e); console.error(e);
    for (const [k, pg] of Object.entries(pages)) { save(`fail-${k}.aria.yml`, await pg.locator('body').ariaSnapshot().catch(() => '')); await pg.screenshot({ path: path.join(out, `fail-${k}.png`) }).catch(() => {}); }
  } finally {
    save('result.json', report);
    setTimeout(() => { report.teardown = 'forced-exit-after-20s'; save('result.json', report); process.exit(report.passed ? 0 : 1); }, 20000).unref();
    await browser.close().catch(() => {}); await host.stop().catch(() => {});
  }
  if (!report.passed) process.exit(1);
}
main();
