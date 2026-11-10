// Shared GM-recorded save outcomes — optimized production-App witness. ONE Wizard-authored ability = direct damage + one
// movement rider whose authored save (Constitution DC 12) negates the rider only. Real Spell Wizard (Damage + composed effect
// + "The target may save to negate this effect") → library save/reopen → GM admission → owner cast with a physical roll and
// approval of BOTH outcomes → GM records "Target saves" (payment + damage, no rider) → second cast, GM records "Target fails"
// (payment + damage + rider) while the ACK and accepted broadcast are lost → GM reload → "Check same command" returns the
// original receipt once → GM exact removal. The branch is selected only through the GM card's own radio control.
// ONE persistent browser profile per role (GM, owner, observer). Provider/identity/lease/cloud are fixture boundaries.
// Anything done outside ordinary App controls is recorded under `qualifications` and never counted as an App-path pass.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.SAVE_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External SAVE_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture'); process.env.A4_OUTPUT = path.join(out, 'producer');
const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');
async function setup(page, url, uid) {
  if (!page.__saveFonts) {
    page.__saveFonts = true; const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    page.goto = async(...args) => { await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {}); await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts); return goto(...args); };
  }
  return baseSetup(page, url, uid);
}
const actors = require('../../../server/services/actorConsequences');
const profile = require('../../src/services/sharedConditionProfile');
const pure = require('../../src/services/authoredAbility');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { startedAt: new Date().toISOString(), checks: {}, qualifications: [], errors: [], steps: [], stages: {},
  limits: ['Real optimized App and registered backend; identity/provider/ownership/lease/cloud are fixture boundaries.',
    'Temporary room: accepted-live only. No live Firebase, deployment, physical second device or human tabletop claim.',
    'The save itself is rolled at the table (not by the VTT); the GM records the result in the App. A recorded outcome is not proof that the VTT rolled or validated a save.',
    'public/assets (images) were not part of this build input: icons may 404; recorded fetch errors are expected from that.'] };
function patchClick(page) {
  const L = Object.getPrototypeOf(page.locator('body')); if (L.__save) return; L.__save = true; const click = L.click;
  L.click = async function(options = {}) { try { return await click.call(this, { timeout: 20000, ...options }); } catch (e) { if (options.force || !/not stable|intercepts pointer/.test(String(e.message))) throw e; return click.call(this, { ...options, force: true }); } };
}
const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); };
const stage = (name, how, detail) => { report.stages[name] = { how, ...(detail ? { detail } : {}) }; };
const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true });
const ownerDialog = p => p.getByRole('dialog', { name: 'Supported spell cast', exact: true });
const hall = host => host.room.gameState.maps['app-hall'];
const B = host => hall(host).tokens.B;
const hpOf = host => ({ current: B(host).state.currentHp, temp: B(host).state.tempHealth });
const moves = host => B(host).state.conditions.filter(profile.isMovementModifier);
const receipts = host => actors.ledger(host.room).receipts;
const pcPools = host => { const r = actors.resources(hall(host).characterTokens.pc, 'character'); return { ap: r.ap, mana: r.mana }; };
const wait = async(fn, n = 100) => { for (let i = 0; i < n && !fn(); i++) await new Promise(r => setTimeout(r, 150)); return fn(); };

async function openBook(p) {
  const role = p.getByRole('button', { name: 'Character', exact: true });
  if (await role.count()) await role.click(); else await p.locator('button', { hasText: /^\s*Character\s*$/ }).first().click();
  const sb = p.getByRole('button', { name: 'Spellbook S', exact: true });
  if (await sb.count()) await sb.click(); else await p.locator('button', { hasText: /Spellbook/ }).first().click();
  await book(p).waitFor();
}
async function closeBook(p) { const b = book(p).getByRole('button', { name: 'Close', exact: true }); await b.focus(); await b.press('Enter'); }
const savedRecord = (p, name) => p.evaluate(name => { const k = Object.keys(localStorage).find(k => k.endsWith(':library.spellData')); return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells.find(s => s.name === name) : null; }, name);
/** Actual Spell Wizard: Damage + composed movement effect with a rider-local "negates" save, manual expiry. */
async function author(p, c) {
  await openBook(p);
  await book(p).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(c.name);
  await book(p).getByRole('textbox', { name: 'Description * *', exact: true }).fill('Disposable save-branch witness: arcane damage, and the target is slowed unless it makes a Constitution save.');
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
  await fields.getByLabel(/^Expiry/).selectOption('gm-manual');
  await fields.getByLabel(/The target may save to negate this effect/).check();
  await fields.getByLabel(/^Saving ability/).selectOption(c.save.ability);
  await fields.getByLabel(/^Difficulty \(DC/).fill(String(c.save.dc));
  report.checks.wizardSaveText = await fields.getByRole('group', { name: 'Saving throw (optional)', exact: true }).innerText();
  await fields.getByLabel(/^Source-authored duration text/).fill(c.duration);
  await fields.getByLabel(/^Required GM adjudication note/).fill('The table rolls the Constitution save; the GM records saved or failed and removes the effect.');
  await book(p).screenshot({ path: path.join(out, 'wizard-save-fields.png') });
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
async function editorSpeed(p, id = 'B') {
  const controls = p.getByRole('region', { name: 'Actor attachment and consequences', exact: true });
  await controls.getByRole('combobox', { name: 'Exact room attachment', exact: true }).selectOption(`creature:${id}`);
  await controls.getByRole('button', { name: 'Edit selected shared conditions', exact: true }).click();
  const dialog = p.getByRole('dialog', { name: 'Edit selected shared conditions editor', exact: true }); await dialog.waitFor();
  await dialog.getByText(/^Stunned (inactive\.|active:)/).first().waitFor({ timeout: 15000 });
  const section = dialog.getByRole('region', { name: 'Active movement effects', exact: true });
  const result = await section.count() ? (await section.getByRole('status').first().innerText()).trim() : 'no active movement effects';
  return { result, dialog, close: async() => { await dialog.getByRole('button', { name: 'Close shared condition editor', exact: true }).click(); await dialog.waitFor({ state: 'detached' }); } };
}
async function readSpeed(p) { const r = await editorSpeed(p); await r.close(); return r.result; }
const narration = (p, commandId) => p.evaluate(id => {
  const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes('temp-loss') && f.toString().includes('reportable'));
  const store = Object.values(__req(pair[0])).find(v => typeof v === 'function' && v.getState && 'floats' in v.getState());
  const n = store.getState().narration, all = [...n.history, n.current, ...n.waiting].filter(e => e?.id.endsWith(id));
  return { count: n.history.filter(e => e.id.endsWith(id)).length, texts: [...new Set(all.map(e => e.text))] };
}, commandId);
const chatLines = p => p.evaluate(() => S('chatStore').getState().notifications.combat.map(n => n.content));

async function ownerCast(owner, spec, face) {
  const lib = owner.getByRole('region', { name: 'Admitted abilities', exact: true });
  if (!await lib.count()) await owner.locator('summary').filter({ hasText: /^Admitted abilities$/ }).click();
  await lib.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
  await lib.locator('.p9-admitted-row').filter({ hasText: spec.name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
  const od = ownerDialog(owner); await od.waitFor(); await od.getByRole('heading', { name: spec.name, exact: true }).waitFor();
  const targets = await od.getByRole('combobox', { name: 'Target', exact: true }).locator('option').allInnerTexts();
  await od.getByRole('combobox', { name: 'Target', exact: true }).selectOption({ label: 'B · creature · B' });
  await od.getByLabel('d8 face 1', { exact: true }).fill(String(face)); await od.getByRole('button', { name: 'Record physical roll', exact: true }).click();
  return { od, text: await od.innerText(), targets };
}
async function gmCard(gm, spec, { outcome, final, note, evidence }) {
  const card = gm.locator('.p9-gm-card').filter({ hasText: spec.name }).first(); await card.waitFor();
  await card.getByLabel('GM timing clarification (required)', { exact: true }).fill(note);
  await card.getByLabel('Private manual resolution evidence', { exact: true }).fill(evidence);
  const text = await card.innerText();
  const confirm = card.getByRole('button', { name: 'Confirm recorded outcome', exact: true });
  const disabledBefore = await confirm.isDisabled();
  await card.getByRole('radio', { name: outcome }).check(); // the ONLY branch selection: the GM card's own control
  await card.getByRole('checkbox', { name: /I resolved eligibility, range and immunity, and recorded the table’s save result above/ }).check();
  await card.getByLabel(/^Final damage/).fill(String(final));
  return { card, text, confirm, disabledBefore };
}

async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_bind', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw', 'actor_recovery', 'join_room', 'token_moved'])
    host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const pages = {}, contexts = {};
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner'], ['observer', 'app-observer']]) {
      const dir = path.join(out, 'profiles', role); fs.mkdirSync(dir, { recursive: true });
      const ctx = contexts[role] = await chromium.launchPersistentContext(dir, { headless: true, viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const page = pages[role] = ctx.pages()[0] || await ctx.newPage(); page.on('pageerror', e => report.errors.push({ role, message: e.message })); patchClick(page);
      await setup(page, host.url, uid);
    }
    const { gm, owner, observer } = pages;

    step('Wizard author/save/reopen/admit: arcane 1d8+3 + Frozen Limbs −10 ft, Constitution DC 12 negates Frozen Limbs only, manual expiry');
    const spec = { name: 'SV Frost Grip', formula: '1d8+3', label: 'Frozen Limbs', feet: -10, save: { ability: 'constitution', dc: 12 }, duration: 'for 1 round', ap: 1, mana: 2 };
    const record = await author(gm, spec); await admitForPc(gm, spec.name, record); await setup(gm, host.url, 'app-gm');
    for (const p of [owner, observer]) await setup(p, host.url, p === owner ? 'app-owner' : 'app-observer');
    assert.match(report.checks.wizardSaveText, /does not roll, calculate or check it/);
    stage('author/save/reopen/admit', 'App controls (Spell Wizard incl. the new save fields, Spell Library, room admission)');
    const speedBefore = { gm: await readSpeed(gm), observer: await readSpeed(observer) }; report.checks.speedBefore = speedBefore;

    step('cast 1: the owner sees both outcomes and the manual save responsibility, records a physical d8 = 5, approves (nothing spent)');
    let cast = await ownerCast(owner, spec, 5); report.checks.ownerText1 = cast.text; save('owner-cast1.aria.yml', await cast.od.ariaSnapshot());
    report.checks.ownerTargets = cast.targets;
    assert.ok(!cast.targets.some(t => /character/.test(t)), 'no PC target is offered for a save-branch bundle');
    for (const text of ['Target saves (Constitution DC 12, GM records): arcane damage 1d8+3; no Frozen Limbs', 'Target fails (Constitution DC 12, GM records): arcane damage 1d8+3 + Frozen Limbs (movement −10 ft)',
      'does not roll, calculate or validate the save', 'You approve both outcomes now']) assert.ok(cast.text.includes(text), `owner sees: ${text}`);
    const snapshot = () => JSON.stringify([pcPools(host), hpOf(host), B(host).state.conditions]);
    const before1 = snapshot();
    await cast.od.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true }).click(); await cast.od.getByText(/Awaiting GM adjudication/).waitFor();
    assert.equal(snapshot(), before1, 'approval spends nothing and installs nothing');
    stage('owner approval', 'App controls (owner spell panel, physical roll)');

    step('GM records "Target saves": payment + 8 damage, no rider');
    let g = await gmCard(gm, spec, { outcome: /^Target saves/, final: 8, note: 'Touch range confirmed; CON save rolled at the table.', evidence: 'SECRET-SV GM evidence: player rolled 15 vs DC 12' });
    report.checks.gmCardText1 = g.text; report.checks.confirmDisabledBeforeBranch = g.disabledBefore;
    assert.equal(g.disabledBefore, true, 'the GM cannot confirm before recording saved or failed');
    assert.match(g.text, /The table rolls the Constitution DC 12 save/); save('gm-card-saved.aria.yml', await g.card.ariaSnapshot());
    await g.card.screenshot({ path: path.join(out, 'gm-card-saved.png') });
    const pc0 = pcPools(host), hp0 = hpOf(host); let n = receipts(host).length;
    await g.confirm.click();
    assert.ok(await wait(() => receipts(host).length === n + 1), 'cast 1 accepted');
    let receipt = receipts(host).at(-1), chosen = JSON.parse(receipt.adjudication.chosenResult);
    assert.equal(chosen.branch, 'saved'); assert.equal(chosen.conditionApplied, false); assert.equal(chosen.conditionInstanceId, null);
    assert.equal(moves(host).length, 0, 'saved: no rider');
    assert.deepEqual(hpOf(host), { current: hp0.current - (8 - Math.min(8, hp0.temp)), temp: Math.max(0, hp0.temp - 8) }, 'direct damage applies on the saved branch (temporary HP first)');
    const pc1 = pcPools(host); assert.equal(pc1.mana.current + pc1.mana.temp, pc0.mana.current + pc0.mana.temp - spec.mana); assert.equal(pc1.ap.current + pc1.ap.temp, pc0.ap.current + pc0.ap.temp - spec.ap);
    report.checks.cast1 = { branch: chosen.branch, hpBefore: hp0, hpAfter: hpOf(host), paymentBefore: pc0, paymentAfter: pc1, roll: chosen.roll, publicReceipt: actors.publicReceipt(receipt) };
    report.checks.speedAfterSaved = { gm: await readSpeed(gm), observer: await readSpeed(observer) };
    assert.equal(report.checks.speedAfterSaved.observer, speedBefore.observer, 'a successful save leaves movement unchanged');
    await owner.getByText(/Accepted · /).first().waitFor({ timeout: 20000 });
    report.checks.ownerStatus1 = (await owner.getByText(/Accepted · /).first().innerText());
    assert.match(report.checks.ownerStatus1, /target saved \(Constitution DC 12, GM recorded\): no Frozen Limbs/);
    await gm.waitForTimeout(800);
    report.checks.narration1 = { observer: await narration(observer, receipt.commandId), observerChat: (await chatLines(observer)).filter(l => l.includes(spec.name)) };
    assert.ok([...report.checks.narration1.observer.texts, ...report.checks.narration1.observerChat].some(t => /saves \(Constitution DC 12, GM recorded\)/.test(t)), 'observer reads the recorded saved branch');
    assert.equal(report.checks.narration1.observer.count <= 1, true, 'narration once');
    await owner.getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => {});
    stage('saved branch', 'App controls (GM card radio + confirm); server-authoritative payment and HP');

    step('cast 2: owner rolls d8 = 3 and approves; GM records "Target fails" while the ACK and accepted broadcast are lost');
    cast = await ownerCast(owner, spec, 3);
    await cast.od.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true }).click(); await cast.od.getByText(/Awaiting GM adjudication/).waitFor();
    g = await gmCard(gm, spec, { outcome: /^Target fails/, final: 6, note: 'Touch range confirmed; CON save failed at the table.', evidence: 'SECRET-SV GM evidence: player rolled 7 vs DC 12' });
    report.checks.gmCardText2 = g.text; await g.card.screenshot({ path: path.join(out, 'gm-card-failed.png') });
    await gm.evaluate(() => { const listeners = __socket.listeners('actor_consequence_accepted'); __socket.removeAllListeners('actor_consequence_accepted'); let once = true;
      __socket.on('actor_consequence_accepted', r => { if (once && r.receipt?.adjudication?.definitionVersionOrHash?.startsWith('authored-effect:v1/')) { once = false; return; } listeners.forEach(fn => fn(r)); });
      const emit = __socket.emit.bind(__socket); let drop = true; __socket.emit = (e, ...args) => { if (drop && e === 'actor_consequence' && args[0]?.adjudication?.definitionVersionOrHash?.startsWith('authored-effect:v1/') && typeof args[1] === 'function') { drop = false; args[1] = () => {}; } return emit(e, ...args); }; });
    report.qualifications.push('Lost delivery is simulated in the GM page (the ACK callback and that GM\'s accepted broadcast are dropped once); the server, writer and recovery path are unmodified.');
    const hp1 = hpOf(host), pcBefore2 = pcPools(host); n = receipts(host).length;
    await g.confirm.click();
    assert.ok(await wait(() => receipts(host).length === n + 1), 'server accepted once while the ACK and broadcast were lost');
    receipt = receipts(host).at(-1); const sentId = receipt.commandId;
    await gm.waitForTimeout(1500);
    step('GM reloads; the retained original command is restored; "Check same command" returns the original receipt once');
    await gm.reload(); await setup(gm, host.url, 'app-gm');
    const check = gm.getByRole('button', { name: 'Check same command', exact: true }).first(); await check.waitFor({ timeout: 30000 });
    report.checks.retainedAfterReload = await gm.locator('.p9-gm').innerText().catch(() => null);
    await check.click(); await gm.waitForTimeout(1500);
    assert.equal(receipts(host).length, n + 1, 'Check same command never applies twice');
    assert.equal(receipts(host).filter(r => r.commandId === sentId).length, 1);
    chosen = JSON.parse(receipts(host).at(-1).adjudication.chosenResult);
    assert.equal(chosen.branch, 'failed'); assert.equal(chosen.conditionApplied, true); assert.equal(moves(host).length, 1); assert.equal(moves(host)[0].name, spec.label);
    assert.deepEqual(hpOf(host), { current: hp1.current - (6 - Math.min(6, hp1.temp)), temp: Math.max(0, hp1.temp - 6) });
    const pc2 = pcPools(host); assert.equal(pc2.mana.current + pc2.mana.temp, pcBefore2.mana.current + pcBefore2.mana.temp - spec.mana, 'paid once (no re-payment on recovery)');
    report.checks.recoveredStatus = await gm.locator('.p9-gm').innerText().catch(() => null);
    report.checks.cast2 = { branch: chosen.branch, commandId: sentId, receiptsForCommand: receipts(host).filter(r => r.commandId === sentId).length, rider: moves(host)[0], hpBefore: hp1, hpAfter: hpOf(host), roll: chosen.roll, publicReceipt: actors.publicReceipt(receipts(host).at(-1)) };
    assert.deepEqual(chosen.roll.dice[0].faces, [3], 'the retained owner face is the recorded face (no reroll on recovery)');
    const speedFailed = { gm: await readSpeed(gm), observer: await readSpeed(observer) }; report.checks.speedAfterFailed = speedFailed;
    assert.match(speedFailed.observer, /Frozen Limbs −10 ft/); assert.equal(speedFailed.gm, speedFailed.observer);
    await gm.waitForTimeout(800);
    report.checks.narration2 = { observer: await narration(observer, sentId), observerChat: (await chatLines(observer)).filter(l => l.includes(spec.name)), ownerChat: (await chatLines(owner)).filter(l => l.includes(spec.name)) };
    assert.ok([...report.checks.narration2.observer.texts, ...report.checks.narration2.observerChat].some(t => /fails the save \(Constitution DC 12, GM recorded\)/.test(t)), 'observer reads the recorded failed branch');
    stage('failed branch', 'App controls (GM card radio + confirm); server-authoritative payment, HP and rider');
    stage('lost-ACK/reload recovery', 'App control after GM reload (Check same command), original receipt once');

    step('privacy: observer sees no private GM evidence or owner identity');
    const observerView = await observer.evaluate(roomId => new Promise(res => __socket.emit('actor_snapshot', { roomId }, r => res(JSON.stringify(r)))), host.room.id);
    report.checks.observerSeesPrivate = observerView.includes('SECRET-SV'); assert.equal(report.checks.observerSeesPrivate, false);
    const publicText = JSON.stringify(receipts(host).map(r => actors.publicReceipt(r)));
    assert.ok(!publicText.includes('SECRET-SV'), 'public receipts carry no GM evidence');

    step('GM removes the exact Frozen Limbs instance; speed restored');
    { const e = await editorSpeed(gm); const rider = moves(host)[0];
      await e.dialog.getByRole('button', { name: `Remove Frozen Limbs instance ${rider.id}`, exact: true }).click();
      for (let i = 0; i < 40 && moves(host).length; i++) await new Promise(r => setTimeout(r, 150)); await e.close(); }
    assert.equal(moves(host).length, 0);
    report.checks.speedAfterRemoval = { gm: await readSpeed(gm), observer: await readSpeed(observer) };
    assert.equal(report.checks.speedAfterRemoval.observer, speedBefore.observer);
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
