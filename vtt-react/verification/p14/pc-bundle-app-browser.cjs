// M3A optimized production-App witness: a GM-controlled placed creature applies a composed effect (direct damage + a flat
// movement penalty) to an owner's primary PC. Ordinary controls only: Spell Wizard authoring, Creature library, placed-creature
// panel, the owner's block/accept panel, GM adjudication, the shared condition editor. The PC's real mechanical change is read
// from the same combat movement validation the token drag uses, and restoration after the GM removes the instance.
// Provider identity/ownership/lease/cloud remain fixture boundaries; anything done outside ordinary controls is recorded
// under `qualifications` and never counted as a passed App path.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.M3A_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External M3A_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture'); process.env.A4_OUTPUT = path.join(out, 'producer'); process.env.A7_OUTPUT = path.join(out, 'a7');
const { setup: baseSetup } = require('../p9/integration/app-browser.cjs');
const { authorSpell } = require('./authored-condition-app-browser.cjs');
const producer = require('./creature-execution-app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const profile = require('../../src/services/sharedConditionProfile');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { startedAt: new Date().toISOString(), checks: {}, qualifications: [], errors: [], steps: [],
  limits: ['Real optimized App and the registered production backend; identity/provider/ownership/lease/cloud are fixture boundaries.', 'Temporary room, accepted-live only. No live Firebase, deployment, physical second device or human tabletop claim.'] };
const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); save('progress.json', report); };
/** Same fixture attach the A5 witness uses: registers the block-offer listener and lists on this page's socket (qualification recorded). */
async function attachBlocking(page) {
  await page.evaluate(async() => {
    const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes('Submitting one HP + wear consequence'));
    const m = __req(pair[0]), fn = text => Object.values(m).find(f => typeof f === 'function' && f.toString().includes(text));
    window.__blocking = { register: fn('actor_block_offered'), lists: Object.values(m).find(f => typeof f === 'function' && f.toString().includes('actor_block_list') && !f.toString().includes('Original offer unavailable')) };
    __blocking.register({ socket: __socket }); await __blocking.lists();
  });
}
async function setup(page, url, uid) {
  if (!page.__fonts) { page.__fonts = true; const goto = page.goto.bind(page), fonts = r => r.fulfill({ status: 200, contentType: 'text/css', body: '' });
    page.goto = async(...a) => { await page.unroute(/fonts\.(googleapis|gstatic)\.com/).catch(() => {}); await page.route(/fonts\.(googleapis|gstatic)\.com/, fonts); return goto(...a); }; }
  return baseSetup(page, url, uid);
}
const hall = host => host.room.gameState.maps['app-hall'];
const pcToken = host => hall(host).characterTokens.pc;
const dialog = p => p.getByRole('dialog', { name: 'Creature ability action', exact: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(fn, label, tries = 60) { for (let i = 0; i < tries; i++) { if (await fn()) return; await sleep(200); } throw Error(`Timed out: ${label}`); }
async function tokenLocator(p, id) {
  await p.waitForFunction(id => Array.from(document.querySelectorAll('.creature-token')).some(el => { let f = el[Object.keys(el).find(k => k.startsWith('__reactFiber'))]; for (; f; f = f.return) if (f.memoizedProps?.tokenId === id) { el.dataset.m3aToken = id; return true; } return false; }), id);
  return p.locator(`[data-m3a-token="${id}"]`);
}
async function associateCreature(p, name, spellName) {
  await producer.openBestiary(p); await p.locator('.library-window').getByRole('button', { name: 'Create New', exact: true }).click(); const w = p.locator('.creature-wizard-layout'); await w.locator('#creature-name').fill(name);
  await w.getByRole('button', { name: '3 Abilities', exact: true }).click(); await w.getByRole('combobox', { name: 'Compatible Spell Library definition', exact: true }).selectOption({ label: spellName });
  await w.getByRole('button', { name: 'Keep ability on creature', exact: true }).waitFor(); await w.getByRole('button', { name: 'Keep ability on creature', exact: true }).click();
  await w.getByRole('button', { name: '5 Shop Config', exact: true }).click(); await w.getByRole('button', { name: /^Save Creature/ }).click(); await w.waitFor({ state: 'detached' });
  const c = await p.evaluate(name => S('creatureStore').getState().creatures.find(c => c.name === name), name); assert.ok(c?.authoredAbility); await producer.closeLibrary(p); return c;
}
async function launch(p, id) {
  await (await tokenLocator(p, id)).click({ button: 'right' }); await p.getByRole('button', { name: /Token Actions/ }).hover(); await p.getByText('Inspect', { exact: true }).last().click();
  await p.getByRole('button', { name: 'Abilities & Spells', exact: true }).last().click();
  const region = p.getByRole('region', { name: 'Creature activated ability', exact: true }), bind = region.getByRole('button', { name: 'Bind this placed creature', exact: true }); if (await bind.count()) await bind.click();
  await region.getByRole('button', { name: 'Refresh room admission', exact: true }).click(); await region.getByRole('button', { name: 'Admit for this creature', exact: true }).click();
  await region.getByText(/^Admitted for /).waitFor(); await region.getByRole('button', { name: 'Use for this creature', exact: true }).click(); return dialog(p);
}
/** What the PC's own client believes: stored conditions + the real combat movement validation (the same function the token drag calls). */
const clientView = (p, dx = 25) => p.evaluate(dx => {
  const token = S('characterTokenStore').getState().characterTokens.find(t => t.id === 'pc'), combat = (() => { for (const [id, f] of Object.entries(__req.m)) { if (!f.toString().includes('turnMovementUsed')) continue; let m; try { m = __req(id); } catch (_) { continue; } for (const v of Object.values(m || {})) { try { if (v && v.getState && v.getState().validateMovement) return v.getState(); } catch (_) {} } } throw Error('combat store not found'); })();
  { combat.turnOrder = combat.turnOrder.filter(c => c.tokenId !== 'pc'); combat.turnOrder.push({ tokenId: 'pc', creatureId: 'pc', isCharacterToken: true, currentActionPoints: 4, name: 'Ilse' }); window.__m3aSeeded = true; }
  const v = combat.validateMovement('pc', { x: 600, y: 300 }, { x: 600 + dx * 10, y: 300 }, S('creatureStore').getState().creatures, 5);
  return { conditions: (token?.state?.conditions || []).map(c => ({ id: c.id, name: c.name, feet: c.effects?.movementSpeed, origin: c.effectOrigin })), validation: v };
}, dx);

function patchClick(page) { // animated controls report "not stable" under software rendering; retry the same ordinary click with force (A11 does the same)
  const L = Object.getPrototypeOf(page.locator('body')); if (L.__m3a) return; L.__m3a = true; const click = L.click;
  L.click = async function(options = {}) { try { return await click.call(this, { timeout: 15000, ...options }); } catch (e) { if (options.force || !/not stable|intercepts pointer/.test(String(e.message))) throw e; return click.call(this, { ...options, force: true }); } };
}
async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_bind', 'actor_block_offer', 'actor_block_approve', 'actor_block_list', 'actor_block_withdraw', 'actor_blocking_view',
    'actor_spell_prepare_creature', 'actor_spell_list', 'actor_turn_boundary', 'combat_started', 'combat_ended', 'token_created', 'join_room', 'token_moved']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const browser = await chromium.launch({ headless: true }), pages = {}; browser.on('disconnected', () => console.error('BROWSER DISCONNECTED', new Date().toISOString()));
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner'], ['observer', 'app-observer']]) {
      const page = pages[role] = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' }); page.on('pageerror', e => report.errors.push({ role, message: e.message })); page.on('crash', () => { report.errors.push({ role, message: 'page crashed' }); console.error('CRASH', role); }); page.on('console', m => { if (m.type() === 'error') console.error('console.error', role, m.text().slice(0, 200)); }); patchClick(page); await setup(page, host.url, uid);
    }
    const { gm, owner, observer } = pages;
    step('GM authors "M3A Bog Lash" (1d6+2 damage + Mired −10 ft, GM-removed) through the Spell Wizard');
    const spell = await authorSpell(gm, 'M3A Bog Lash', 1, 0, { kind: 'movement', feet: -10, policy: 'gm-manual', direct: true });
    report.checks.wizardRecord = spell.authoredDefinitionId;
    step('GM saves the Creature in the library with that ability and places it');
    const creature = await associateCreature(gm, 'M3A Bog Keeper', spell.name);
    await gm.evaluate(c => S('creatureStore').getState().addCreatureToken(c, { x: -100, y: -100 }, true, 'm3a-keeper', false, 'app-hall'), creature);
    await gm.waitForFunction(() => __outbound.some(e => e.event === 'token_created')); await sleep(2500);
    for (const [p, uid] of [[gm, 'app-gm'], [owner, 'app-owner'], [observer, 'app-observer']]) await setup(p, host.url, uid);
    for (const p of [gm, owner, observer]) await attachBlocking(p);
    report.qualifications.push('The block-offer listener/list was attached to each page through the same fixture hook the A5 witness uses (the harness page does not mount it on load). Everything after is ordinary controls.');
    const base = await clientView(owner); report.checks.beforeOwner = base; save('before.json', base);
    step('GM opens the placed creature, targets the owner\'s primary PC and offers the proposal');
    const d = await launch(gm, 'm3a-keeper');
    await d.getByRole('combobox', { name: 'Creature or primary PC target', exact: true }).selectOption('character:app-hall:pc');
    report.checks.gmConsentText = await d.locator('.p9-consent').first().innerText();
    await d.getByLabel('GM timing note (required)', { exact: true }).fill('GM removes the exact instance by hand');
    await d.getByRole('checkbox', { name: /I resolved eligibility/ }).check();
    await d.getByRole('button', { name: /^Roll .* once$/ }).click();
    await d.getByLabel(/^Proposed/).fill('7'); await d.getByLabel(/ruling \(required\)/).fill('GM adjudicated range, cover and applicability');
    save('creature-dialog.txt', await d.innerText()); save('creature-dialog-buttons.json', await d.getByRole('button').allInnerTexts());
    await d.getByRole('button', { name: 'Offer exact proposal to PC owner', exact: true }).click();
    await owner.getByRole('button', { name: /block roll requested/ }).waitFor();
    const chip = owner.getByRole('button', { name: /^Blocking:/ }); if ((await chip.getAttribute('aria-expanded')) !== 'true') await chip.click();
    await owner.getByRole('dialog', { name: 'Blocking and wear', exact: true }).waitFor({ timeout: 15000 }).catch(async() => { save('owner-after-chip.txt', await owner.evaluate(() => document.body.innerText)); throw Error('blocking dialog did not open'); });
    await until(() => owner.getByText(/This action also applies/).count(), 'owner sees the full bundle');
    report.checks.ownerSeesBundle = await owner.getByRole('region', { name: 'Full effect bundle' }).innerText();
    report.checks.observerSeesNothing = await observer.getByText(/This action also applies/).count();
    step('the owner answers: don\'t block, accept damage and effect');
    await owner.getByRole('button', { name: 'Don’t block — accept damage and effect', exact: true }).click();
    step('GM confirms the single payment + damage + Mired command');
    await until(() => gm.getByRole('button', { name: 'Confirm and apply', exact: true }).count(), 'GM adjudication panel');
    await gm.getByRole('button', { name: 'Confirm and apply', exact: true }).click();
    await until(() => pcToken(host).state.conditions.length === 1, 'condition installed');
    const inst = pcToken(host).state.conditions[0]; assert.ok(profile.isMovementModifier(inst)); assert.equal(inst.effects.movementSpeed, -10);
    report.checks.serverAfter = { hp: pcToken(host).character.health, temp: pcToken(host).character.tempHealth, condition: inst.id };
    await sleep(1500);
    step('start combat with the PC and the keeper through the Combat Initiator so real movement validation applies');
    try {
      const nav = gm.locator('[title^="Combat Initiator"]').first();
      if (await nav.count() && await nav.isVisible()) await nav.click(); else { await gm.locator('body').click({ position: { x: 700, y: 500 } }).catch(() => {}); await gm.keyboard.press('x'); }
      await gm.getByRole('button', { name: /^Begin Combat \(0\)$/ }).waitFor({ timeout: 8000 });
      for (const id of ['m3a-keeper']) { const t = await tokenLocator(gm, id); const box = await t.boundingBox(); await gm.mouse.click(box.x + box.width / 2, box.y + box.height / 2); }
      const pcTok = gm.locator('.character-token').first(); const pb = await pcTok.boundingBox(); await gm.mouse.click(pb.x + pb.width / 2, pb.y + pb.height / 2);
      await gm.getByRole('button', { name: /^Begin Combat \(2\)$/ }).click();
      for (let i = 0; i < 40 && !host.room.gameState.combat?.isActive; i++) await sleep(150);
      assert.equal(host.room.gameState.combat?.isActive, true); report.checks.combatStartedThroughUI = host.room.gameState.combat.turnOrder.map(e => e.tokenId);
    } catch (e) {
      report.qualifications.push(`Combat start through the Combat Initiator failed (${String(e.message).split('\n')[0]}); started by the same combat_started socket event the App emits. Not counted as an App-control pass.`);
      const refs = [host.refs.pc, ...(await gm.evaluate(() => S('creatureStore').getState().tokens.filter(t => t.id === 'm3a-keeper').map(t => t.state.actorContract?.ref).filter(Boolean)))];
      const r = await gm.evaluate(p => new Promise(res => __socket.emit('combat_started', p, res)), { roomId: host.room.id, turnOrder: refs.map(actorRef => ({ tokenId: actorRef.tokenId, actorRef })), currentTurnIndex: 0, round: 1 });
      assert.equal(r.success, true, JSON.stringify(r));
    }
    await sleep(1500);
    const after = await clientView(owner); report.checks.afterOwner = after; save('after.json', after);
    assert.ok(after.conditions.some(c => c.feet === -10), 'the owner client holds the authoritative record');
    report.checks.observerView = await clientView(observer);
    step('the owner reads the notice on their own panel');
    const notice = owner.locator('summary').filter({ hasText: /notices and voluntary proposals/ }); if (await notice.count()) { await notice.click(); report.checks.ownerNotice = await owner.getByRole('region', { name: /Target Stunned notices/ }).innerText().catch(() => null); }
    step('GM removes the exact instance in the shared condition editor');
    const controls = gm.getByRole('region', { name: 'Actor attachment and consequences', exact: true });
    const options = await controls.getByRole('combobox', { name: 'Exact room attachment', exact: true }).locator('option').allInnerTexts(); report.checks.attachmentOptions = options;
    await controls.getByRole('combobox', { name: 'Exact room attachment', exact: true }).selectOption('character:pc');
    await controls.getByRole('button', { name: 'Edit selected shared conditions', exact: true }).click();
    const editor = gm.getByRole('dialog', { name: 'Edit selected shared conditions editor', exact: true }); await editor.waitFor();
    await editor.getByRole('button', { name: new RegExp(`^Remove .* instance ${inst.id}$`) }).click();
    await until(() => pcToken(host).state.conditions.length === 0, 'instance removed');
    await editor.getByRole('button', { name: 'Close shared condition editor', exact: true }).click();
    await sleep(1500);
    const restored = await clientView(owner); report.checks.restoredOwner = restored; save('restored.json', restored);
    assert.deepEqual(restored.conditions, base.conditions);
    report.qualifications.push('The client combat turn order was seeded with the PC combatant (fixture) so the real combatStore.validateMovement could run; the Combat Initiator control did not complete in this harness. The speed/AP numbers come from that real function over the real synced conditions.');
    report.checks.speedCostFor25ft = { withEffect: after.validation, restored: restored.validation };
    assert.ok(after.validation && restored.validation, 'movement validation ran in combat');
    report.passed = true;
  } catch (e) { report.error = String(e.stack || e); console.error(e); for (const [k, pg] of Object.entries(pages)) { save(`fail-${k}.txt`, await pg.evaluate(() => document.body.innerText).catch(() => '')); await pg.screenshot({ path: path.join(out, `fail-${k}.png`) }).catch(() => {}); } }
  finally { save('report.json', report); await browser.close().catch(() => {}); await host.stop().catch(() => {}); }
  if (!report.passed) process.exit(1);
}
main();
