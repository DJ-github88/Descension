// M1 optimized production-App witness: class-paid composed effect (Rime-Iron Clasp). Real HUD slot, owner
// cast dialog, GM adjudication card, shared condition editor and registered Socket.IO handlers, in ONE
// persistent browser profile per role (never cleared or replaced). Provider/identity/lease/cloud remain the
// existing fixture boundaries. The shipped profile has no Class HQ confirmation, so this witness marks it with an
// explicit TEST FIXTURE confirmation in the backend process and in each page's compiled data module — the build
// bytes are unchanged and the marking is reported as a qualification, never as a Class HQ confirmation.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');

const out = process.env.M1_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External M1_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture');
const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const profile = require('../../../server/shared/services/sharedConditionProfile');
const serverProfiles = require('../../../server/shared/data/classEffectProfiles.json');
const HASH = 'ff1b91e10d21655d5dcbf16660b66a81330c8d1fc3f8570d9b62856b1d7e1649';
const FIXTURE = { reference: 'TEST FIXTURE ONLY (M1 App witness) — not a Class HQ confirmation' };
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { startedAt: new Date().toISOString(), checks: {}, errors: [], steps: [], storage: [], qualifications: [
  'The shipped classEffectProfiles entry has review.classHq = null (no Class HQ confirmation has been recorded). This run marks it with an explicit TEST FIXTURE reference in memory (backend process + compiled page data module) so the pilot can execute; build bytes unchanged.',
  `Base: ${process.env.M1_BASE || 'set M1_BASE to the verified base identity'} + the M1 patch.`],
limits: ['Real optimized App/router/HUD/owner and GM panels/shared condition editor and registered backend; identity/provider/ownership/lease/cloud are fixture boundaries.',
  'Temporary room: accepted-live only. No live Firebase, deployment, physical second device or human tabletop claim.'] };
const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); };
const hall = host => host.room.gameState.maps['app-hall'];
const B = host => hall(host).tokens.B;
const pcState = host => hall(host).characterTokens.pc;
const moves = host => B(host).state.conditions.filter(profile.isMovementModifier);
const receipts = host => actors.ledger(host.room).receipts;
// Read-only: storage size by family; never writes, clears or compacts the profile.
const storageUse = p => p.evaluate(() => { const groups = {}; let total = 0; for (const k of Object.keys(localStorage)) { const n = (localStorage.getItem(k) || '').length + k.length; total += n;
  const g = k.replace(/^mythrill:p5:user:[^:]+:/, '').split(':')[0]; groups[g] = groups[g] || { keys: 0, chars: 0 }; groups[g].keys++; groups[g].chars += n; }
  return { keys: Object.keys(localStorage).length, total, top: Object.entries(groups).sort((a, b) => b[1].chars - a[1].chars).slice(0, 6) }; });
async function measure(pages, phase) { const row = { phase }; for (const [role, p] of Object.entries(pages)) row[role] = await storageUse(p); report.storage.push(row); }
async function setup(page, url, uid) {
  if (!page.__m1Fonts) { page.__m1Fonts = true; const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    page.goto = async(...args) => { await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {}); await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts); return goto(...args); }; }
  const result = await baseSetup(page, url, uid);
  // Declared fixture: mark the compiled profile data module with the TEST FIXTURE reference (see qualifications).
  const marked = await page.evaluate(({ hash, fixture }) => {
    const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes(hash) && f.toString().includes('class-effect-1'));
    if (!pair) return false; const data = __req(pair[0]); const entry = (data.profiles || data.default?.profiles || []).find(e => e.recordHash === hash);
    if (!entry) return false; entry.review.classHq = fixture; return true; }, { hash: HASH, fixture: FIXTURE });
  assert.equal(marked, true, 'compiled class-effect profile module present');
  return result;
}
const ownerDialog = p => p.getByRole('dialog', { name: 'Supported spell cast', exact: true });
async function setSpheres(owner, list) {
  await owner.evaluate(list => S('characterStore').setState({ classResource: { type: 'elementalSpheres', spheres: list, current: list.length, max: 12 } }), list);
}
async function placeSpell(owner) {
  const slot = owner.locator('.action-bar-assembly .action-slot').nth(1);
  await slot.evaluate(el => { const data = new DataTransfer(); data.setData('application/json', JSON.stringify({ id: 'arc_frost_touch', name: 'Rime-Iron Clasp', icon: 'Frost/Frost Touch', spellType: 'ACTION' }));
    const event = new Event('drop', { bubbles: true, cancelable: true }); Object.defineProperty(event, 'dataTransfer', { value: data }); el.dispatchEvent(event); });
  await slot.getByAltText('Rime-Iron Clasp', { exact: true }).waitFor();
  return slot;
}
async function ownerCast(owner, slot, face) {
  await slot.click(); const d = ownerDialog(owner); await d.waitFor();
  await owner.getByRole('combobox', { name: 'Target', exact: true }).selectOption('creature:app-hall:B');
  await owner.getByLabel('d8 face 1', { exact: true }).fill(String(face)); await owner.getByRole('button', { name: 'Record physical roll', exact: true }).click();
  const summary = d.getByText(/^Preserved authored fields/); if (await summary.count()) await summary.click(); // open the disclosure as a user would
  const text = await d.innerText();
  return { dialog: d, text };
}
async function gmConfirm(gm, outcome, final) {
  const card = gm.locator('.p9-gm-card').filter({ hasText: 'Rime-Iron Clasp' }).first(); await card.waitFor();
  const summary = card.getByText(/^Preserved authored fields/); if (await summary.count()) await summary.click();
  const text = await card.innerText();
  await card.getByRole('radio', { name: outcome }).check();
  await card.getByRole('checkbox', { name: /I adjudicated legality, range and mitigation/ }).check();
  await card.getByLabel(/^Final damage/).fill(String(final));
  return { card, text };
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

async function main() {
  const entry = serverProfiles.profiles.find(e => e.recordHash === HASH); entry.review.classHq = FIXTURE; // backend process: same declared fixture
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_bind', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw', 'join_room']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const contexts = {}, pages = {};
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner'], ['observer', 'app-observer']]) {
      const dir = path.join(out, 'profiles', role); fs.mkdirSync(dir, { recursive: true });
      contexts[role] = await chromium.launchPersistentContext(dir, { headless: true, viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const page = pages[role] = contexts[role].pages()[0] || await contexts[role].newPage();
      page.on('pageerror', e => report.errors.push({ role, message: e.message }));
      await setup(page, host.url, uid);
    }
    const { gm, owner, observer } = pages;
    await owner.evaluate(() => S('characterStore').setState({ stats: { strength: 10, agility: 10, constitution: 10, intelligence: 12, spirit: 10, charisma: 10 } }));
    await setSpheres(owner, ['rime', 'rime', 'ember']); await owner.waitForTimeout(1200);
    await measure(pages, 'after setup');
    const baseSpeed = await readSpeed(gm); report.checks.speedBefore = { gm: baseSpeed, observer: await readSpeed(observer) };

    step('cast 1: owner places Rime-Iron Clasp on the HUD, sees outcomes and the partial-automation disclosure, records a physical 5, approves');
    const slot = await placeSpell(owner);
    let cast = await ownerCast(owner, slot, 5);
    save('owner-cast1.aria.yml', await cast.dialog.ariaSnapshot());
    for (const text of ['Partially automated', 'Target saves (Constitution DC 12, GM records)', 'Target fails (Constitution DC 12, GM records)', '+1d4 bonus damage from the next physical attack',
      'Movement speed reduced by 10 feet for 1 round', 'enhancesCombo']) assert.ok(cast.text.includes(text), `owner sees: ${text}`);
    report.checks.ownerDisclosure = cast.text.split('\n').filter(l => /automat|Not automated|GM-managed|Target (saves|fails)|enhancesCombo|1 round/.test(l));
    // P9's existing flow first publishes the owner's current class resource (unspent) to the room; nothing else may change.
    const pools = () => { const c = pcState(host).character; return JSON.stringify([c.health, c.tempHealth, c.mana, c.tempMana, c.actionPoints, c.tempActionPoints, B(host).state.currentHp, B(host).state.tempHealth, B(host).state.conditions]); };
    const before1 = pools();
    await owner.getByRole('button', { name: 'Approve price, target, roll and listed outcomes', exact: true }).click();
    let gmCard = await gmConfirm(gm, /^Target saves/, 8);
    assert.equal(pools(), before1, 'approval spends no AP, mana or HP and installs nothing');
    assert.deepEqual(pcState(host).state.classPayment.value.spheres, ['rime', 'rime', 'ember'], 'published class resource is unspent before GM confirmation');
    report.checks.approvalSpendsNothing = { pools: JSON.parse(before1), publishedSpheres: pcState(host).state.classPayment.value.spheres };
    for (const text of ['Not automated', '+1d4', 'Partially automated']) assert.ok(gmCard.text.includes(text), `GM sees: ${text}`);
    save('gm-card-saved.aria.yml', await gmCard.card.ariaSnapshot());
    let count = receipts(host).length;
    await gmCard.card.getByRole('button', { name: 'Confirm recorded outcome', exact: true }).click();
    await owner.getByText(/Accepted · /).first().waitFor({ timeout: 20000 });
    assert.equal(receipts(host).length, count + 1);
    let receipt = receipts(host).at(-1), chosen = JSON.parse(receipt.adjudication.chosenResult);
    assert.equal(chosen.branch, 'saved'); assert.equal(moves(host).length, 0, 'saved: no rider');
    assert.deepEqual(pcState(host).state.classPayment.value.spheres, ['ember']);
    report.checks.cast1 = { branch: chosen.branch, hpB: B(host).state.currentHp, tempB: B(host).state.tempHealth, spheres: pcState(host).state.classPayment.value.spheres, publicReceipt: actors.publicReceipt(receipt) };
    report.checks.speedAfterSaved = { gm: await readSpeed(gm), observer: await readSpeed(observer) };
    assert.equal(report.checks.speedAfterSaved.observer, report.checks.speedBefore.observer, 'a successful save leaves movement unchanged');
    await owner.getByRole('button', { name: 'Close', exact: true }).first().click().catch(() => {});
    await measure(pages, 'after cast 1 (saved)');

    step('cast 2: refilled spheres; the target fails; the GM ACK is lost and recovered with Check same command');
    await setSpheres(owner, ['rime', 'rime']); await owner.waitForTimeout(800);
    cast = await ownerCast(owner, slot, 3);
    assert.ok(cast.text.includes('If the target fails: adds Frozen Limbs'), 'owner sees the movement outcome');
    await owner.getByRole('button', { name: 'Approve price, target, roll and listed outcomes', exact: true }).click();
    gmCard = await gmConfirm(gm, /^Target fails/, 6);
    assert.match(gmCard.text, /After that outcome: .*Frozen Limbs −10 ft/);
    await gm.evaluate(() => { const listeners = __socket.listeners('actor_consequence_accepted'); __socket.removeAllListeners('actor_consequence_accepted'); let once = true;
      __socket.on('actor_consequence_accepted', r => { if (once && r.receipt?.adjudication?.definitionVersionOrHash?.startsWith('class-effect:v1/')) { once = false; return; } listeners.forEach(fn => fn(r)); });
      const emit = __socket.emit.bind(__socket); let drop = true; __socket.emit = (e, ...args) => { if (drop && e === 'actor_consequence' && args[0]?.adjudication?.definitionVersionOrHash?.startsWith('class-effect:v1/') && typeof args[1] === 'function') { drop = false; args[1] = () => {}; } return emit(e, ...args); }; });
    count = receipts(host).length;
    await gmCard.card.getByRole('button', { name: 'Confirm recorded outcome', exact: true }).click();
    await gmCard.card.getByRole('button', { name: 'Check same command', exact: true }).waitFor({ timeout: 30000 });
    assert.equal(receipts(host).length, count + 1, 'server accepted once while the ACK was lost');
    save('gm-card-unknown.aria.yml', await gmCard.card.ariaSnapshot());
    await gmCard.card.getByRole('button', { name: 'Check same command', exact: true }).click(); await gm.waitForTimeout(1000);
    assert.equal(receipts(host).length, count + 1, 'Check same command never applies twice');
    receipt = receipts(host).at(-1); chosen = JSON.parse(receipt.adjudication.chosenResult);
    assert.equal(chosen.branch, 'failed'); assert.equal(moves(host).length, 1); assert.equal(moves(host)[0].name, 'Frozen Limbs');
    assert.deepEqual(pcState(host).state.classPayment.value.spheres, []);
    report.checks.cast2 = { branch: chosen.branch, rider: moves(host)[0], hpB: B(host).state.currentHp, publicReceipt: actors.publicReceipt(receipt), receiptsForCommand: receipts(host).filter(r => r.commandId === receipt.commandId).length };
    const speedFailed = { gm: await readSpeed(gm), observer: await readSpeed(observer) }; report.checks.speedAfterFailed = speedFailed;
    assert.match(speedFailed.observer, /Frozen Limbs −10 ft/); assert.equal(speedFailed.gm, speedFailed.observer);
    await gm.waitForTimeout(800);
    report.checks.observerNarration = await narration(observer, receipt.commandId);
    report.checks.observerChat = (await chatLines(observer)).filter(l => /Rime-Iron Clasp/.test(l));
    report.checks.ownerChat = (await chatLines(owner)).filter(l => /Rime-Iron Clasp/.test(l));
    assert.ok([...report.checks.observerNarration.texts, ...report.checks.observerChat].some(t => /Partially automated/.test(t)), 'observer sees that it is partially automated');
    assert.ok(report.checks.ownerChat.some(t => /not automated \(GM applies\): .*\+1d4/.test(t)), 'owner chat names the not-automated +1d4');
    await measure(pages, 'after cast 2 (failed, recovered)');

    step('GM removes the exact Frozen Limbs instance in the shared condition editor; speed is restored');
    { const e = await editorSpeed(gm); const rider = moves(host)[0];
      await e.dialog.getByRole('button', { name: `Remove Frozen Limbs instance ${rider.id}`, exact: true }).click();
      for (let i = 0; i < 40 && moves(host).length; i++) await new Promise(r => setTimeout(r, 150)); await e.close(); }
    assert.equal(moves(host).length, 0);
    report.checks.speedAfterRemoval = { gm: await readSpeed(gm), observer: await readSpeed(observer) };
    assert.equal(report.checks.speedAfterRemoval.observer, report.checks.speedBefore.observer);
    for (let i = 0; i < 3; i++) { await gm.reload(); await setup(gm, host.url, 'app-gm'); }
    await measure(pages, 'after removal and 3 GM reloads');
    report.passed = true;
  } catch (e) {
    report.failure = e.stack;
    for (const [role, p] of Object.entries(pages)) { save(`failure-${role}.aria.yml`, await p.locator('body').ariaSnapshot().catch(() => 'unavailable')); await p.screenshot({ path: path.join(out, `failure-${role}.png`) }).catch(() => {}); }
    throw e;
  } finally {
    report.endedAt = new Date().toISOString();
    const manifest = fs.readFileSync(path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json'));
    report.build = process.env.APP_BUILD_DIR; report.buildAssetManifestSha256 = crypto.createHash('sha256').update(manifest).digest('hex');
    save('result.json', report);
    for (const c of Object.values(contexts)) await c.close().catch(() => {});
    await host.stop();
  }
}
if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
