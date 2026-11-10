// HEADQ readable active-effect acceptance: the refreshed released finals of SharedDefendingEditor
// (jsx dccd32c5, css 2525ce63, test ae9b82d7) are exercised in the optimized App.
// GM and observer read one PC's seeded authoritative attribute/movement records and one creature's
// periodic effect that is authored, admitted, cast, advanced and left at its final authenticated boundary
// through ordinary App controls. No product file is patched, re-mounted or replaced here.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.AE_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External AE_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture');
const helpers = require('./active-effects-integration-helpers.cjs');
const profile = require('../../src/services/sharedConditionProfile');
const timing = require('../../src/services/sharedEffectTiming');
const pure = require('../../src/services/authoredAbility');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { startedAt: new Date().toISOString(), checks: {}, qualifications: [], errors: [], steps: [], stages: {},
  limits: ['Real optimized App and registered backend; identity/provider/ownership/lease/cloud are fixture boundaries (mocked services).',
    'Temporary room: accepted-live only. No live Firebase, deployment, physical second device or human tabletop claim.',
    'public image assets were not part of this build input: icons may 404.',
    'Authoritative attribute/movement display records are fixture-installed through the same canonical make*Record shapes and actor projection; their application routes are separately witnessed by the released attribute-modifier and movement App witnesses.'] };
const step = s => { report.steps.push({ at: new Date().toISOString(), step: s }); console.log('·', s); };
const stage = (name, how, detail) => { report.stages[name] = { how, ...(detail ? { detail } : {}) }; };
const hall = host => host.room.gameState.maps['app-hall'];
const B = host => hall(host).tokens.B;
const due = host => timing.dueTicks(host.room.gameState.combat);
const ticking = host => B(host).state.conditions.filter(profile.isPeriodicTick);
const clockUI = p => p.getByRole('region', { name: 'Authenticated turn expiry', exact: true });
const ownerDialog = p => p.getByRole('dialog', { name: 'Supported spell cast', exact: true });

async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_bind', 'actor_spell_prepare_creature', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw',
    'actor_turn_boundary', 'actor_periodic_resolve', 'combat_started', 'combat_ended', 'token_created', 'join_room', 'token_moved']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const seeded = helpers.seedReadableConditions(host);
  report.checks.seeded = { attribute: seeded.attribute.recordId, movement: seeded.movement.recordId, target: seeded.attribute.target };
  const pages = {}, contexts = [];
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const role of ['gm', 'owner', 'observer']) { const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' }); contexts.push(context);
      const p = pages[role] = await context.newPage(); p.on('pageerror', e => report.errors.push({ role, message: e.message })); helpers.patchClick(p); }
    const { gm, owner, observer } = pages;
    await helpers.setup(gm, host.url, 'app-gm');
    const spec = { name: 'AE Gloomrot Brand', label: 'Gloomrot', kind: 'periodic', formula: '1d6', damageType: 'arcane', policy: 'target-start-count', ticks: 3, duration: 'While the gloomrot festers', ap: 1, mana: 2 };
    const record = await helpers.author(gm, spec); save('wizard-saved.json', record);
    const mapped = pure.definitionFromWizard(record, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' }); assert.equal(mapped.ok, true, JSON.stringify(mapped));
    assert.deepEqual(mapped.definition.effects, { direct: null, condition: { kind: 'periodic', tick: { kind: 'damage', formula: spec.formula, damageTypes: [spec.damageType] }, label: spec.label, tickRoll: 'each-tick' } });
    await helpers.admitForPc(gm, spec.name, record);
    // No second GM boot: the admitted wizard/library state is closed in place so the fixture socket is not re-created under the App's own auth bootstrap.
    await helpers.closeBook(gm);
    await helpers.setup(owner, host.url, 'app-owner', { owner: true }); await helpers.setup(observer, host.url, 'app-observer');
    stage('author/save/reopen/admit', 'App controls (Spell Wizard, Spell Library room admission)');

    step('start [pc, A, B] through the Combat Initiator and enable authenticated turn expiry');
    const nav = gm.locator('[title^="Combat Initiator"]').first();
    if (await nav.count() && await nav.isVisible()) await nav.click(); else { await gm.locator('body').click({ position: { x: 700, y: 500 } }).catch(() => {}); await gm.keyboard.press('x'); }
    const overlay = gm.locator('.combat-selection-window'); await overlay.waitFor({ timeout: 20000 });
    const discovery = overlay.locator('.combatants-discovery-section');
    for (const [id, initiative] of [['pc', 30], ['A', 20], ['B', 10]]) {
      await discovery.locator('.discovery-item').filter({ hasText: '#' + id }).first().click();
      await overlay.locator('#init-' + id).fill(String(initiative));
    }
    await overlay.getByRole('button', { name: /^Begin Combat \(3\)$/ }).click();
    assert.ok(await helpers.wait(() => host.room.gameState.combat?.isActive, 'combat active'));
    assert.deepEqual(host.room.gameState.combat.turnOrder.map(e => e.tokenId), ['pc', 'A', 'B']);
    const closeEditor = async() => { const close = gm.getByRole('button', { name: 'Close shared condition editor', exact: true }); if (await close.count()) await close.last().click().catch(() => {}); };
    const openClock = async() => { if (!await clockUI(gm).count()) await gm.getByRole('button', { name: 'Shared turn expiry', exact: true }).click(); await clockUI(gm).waitFor(); };
    await openClock(); await clockUI(gm).getByRole('button', { name: 'Enable authenticated turn expiry', exact: true }).click();
    assert.ok(await helpers.wait(() => host.room.gameState.combat?.effectLifecycle?.id, 'authenticated clock'));
    await closeEditor();
    const seq = () => host.room.gameState.combat.effectLifecycle.sequence;
    const advance = async() => { const before = seq(); await openClock(); await clockUI(gm).getByRole('button', { name: 'Advance authenticated turn', exact: true }).click();
      assert.ok(await helpers.wait(() => seq() === before + 1, 'advance accepted')); await closeEditor(); return before + 1; };
    stage('combat start + authenticated clock', 'App controls (Combat Initiator, Enable/Advance authenticated turn)');
    assert.equal(host.room.gameState.combat.turnOrder[host.room.gameState.combat.currentTurnIndex].tokenId, 'pc');

    step('owner casts the authored periodic effect on creature B through the ordinary spell panel; GM confirms payment/effect together');
    const lib = owner.getByRole('region', { name: 'Admitted abilities', exact: true });
    if (!await lib.count()) await owner.locator('summary').filter({ hasText: /^Admitted abilities$/ }).click();
    await lib.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
    await lib.locator('.p9-admitted-row').filter({ hasText: spec.name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
    const od = ownerDialog(owner); await od.waitFor(); await od.getByRole('heading', { name: spec.name, exact: true }).waitFor();
    await od.getByRole('combobox', { name: 'Target', exact: true }).selectOption({ label: 'B · creature · B' });
    report.checks.ownerText = await od.innerText(); assert.match(report.checks.ownerText, /periodic effect applies to one creature only/);
    await od.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true }).click(); await od.getByText(/Awaiting GM adjudication/).waitFor();
    const card = gm.locator('.p9-gm-card').filter({ hasText: spec.name }).first(); await card.waitFor();
    await card.getByLabel('GM timing clarification (required)', { exact: true }).fill('Table ruling: in range, no save.');
    await card.getByRole('checkbox', { name: /I resolved eligibility/ }).check();
    await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    assert.ok(await helpers.wait(() => ticking(host).length === 1, 'one periodic instance on B'));
    assert.equal(due(host).length, 0);
    stage('cast', 'App controls (owner admitted ability panel + GM confirmation card)');

    step('advance to the first authenticated B start: one due tick is visible with GM resolution controls');
    for (let i = 0; i < 6 && due(host).length === 0; i++) await advance();
    assert.equal(due(host).length, 1); assert.equal(due(host)[0].final, false);
    const gmB = await helpers.editorFor(gm, 'creature:B');
    assert.equal(await gmB.getByRole('region', { name: 'Shared creature conditions', exact: true }).count(), 1, 'creature container label');
    const periodicGm = gmB.getByRole('region', { name: 'Active periodic effects', exact: true }); await periodicGm.waitFor();
    report.checks.gmPeriodicLive = await periodicGm.innerText();
    assert.match(report.checks.gmPeriodicLive, /Gloomrot · arcane damage 1d6 per tick/);
    assert.match(report.checks.gmPeriodicLive, /Periodic tick awaiting GM resolution\./);
    const row1 = periodicGm.getByRole('group', { name: 'Due tick 1 of 3 — Gloomrot', exact: true }); await row1.waitFor();
    assert.equal(await row1.getByRole('button', { name: 'Apply tick 1 of 3', exact: true }).count(), 1);
    assert.equal(await row1.getByRole('button', { name: 'Dismiss tick (resolved by hand, no HP change)', exact: true }).count(), 1);
    save('gm-periodic-live.aria.yml', await gmB.ariaSnapshot());
    await helpers.closeEditor(gm);
    const obsB = await helpers.editorFor(observer, 'creature:B');
    const periodicObs = obsB.getByRole('region', { name: 'Active periodic effects', exact: true }); await periodicObs.waitFor();
    report.checks.observerPeriodicLive = await periodicObs.innerText();
    assert.match(report.checks.observerPeriodicLive, /Awaiting GM resolution/);
    assert.equal(await periodicObs.getByRole('button', { name: /Apply tick/ }).count(), 0, 'observer has no apply control');
    assert.equal(await periodicObs.getByRole('button', { name: /Dismiss tick/ }).count(), 0, 'observer has no dismiss control');
    save('observer-periodic-live.aria.yml', await obsB.ariaSnapshot());
    await helpers.closeEditor(observer);
    stage('visible due tick', 'App controls (GM editor row; observer read-only status)');
    await openClock();
    const liveRow = clockUI(gm).getByRole('group', { name: 'Due tick 1 of 3 — Gloomrot', exact: true }); await liveRow.waitFor();
    await liveRow.getByRole('button', { name: 'Dismiss tick (resolved by hand, no HP change)', exact: true }).click();
    assert.ok(await helpers.wait(() => due(host).length === 0, 'tick 1 dismissed by the GM control'));
    await closeEditor();

    step('advance to the final authenticated boundary: the instance ends and the final due tick remains visible as natural expiry');
    for (let i = 0; i < 6 && due(host).length === 0; i++) await advance();
    assert.equal(due(host).length, 1); assert.equal(due(host)[0].final, false);
    await openClock();
    const row2 = clockUI(gm).getByRole('group', { name: 'Due tick 2 of 3 — Gloomrot', exact: true }); await row2.waitFor();
    await row2.getByRole('button', { name: 'Dismiss tick (resolved by hand, no HP change)', exact: true }).click();
    assert.ok(await helpers.wait(() => due(host).length === 0, 'tick 2 dismissed by the GM control')); await closeEditor();
    for (let i = 0; i < 12 && !(due(host).length && due(host)[0].final); i++) await advance();
    assert.ok(due(host).some(t => t.final), 'final tick recorded');
    assert.equal(ticking(host).length, 0, 'the last tick ended the instance');
    const gmFinal = await helpers.editorFor(gm, 'creature:B');
    const periodicFinal = gmFinal.getByRole('region', { name: 'Active periodic effects', exact: true }); await periodicFinal.waitFor();
    report.checks.gmPeriodicFinal = await periodicFinal.innerText();
    assert.match(report.checks.gmPeriodicFinal, /Periodic effect naturally expired\. Final due tick awaiting GM resolution:/);
    assert.equal(await periodicFinal.getByRole('button', { name: /^Apply tick 3 of 3/ }).count(), 1, 'the final due tick remains resolvable');
    assert.equal(await periodicFinal.getByRole('button', { name: 'Dismiss tick (resolved by hand, no HP change)', exact: true }).count(), 1);
    save('gm-periodic-final.aria.yml', await gmFinal.ariaSnapshot());
    await helpers.closeEditor(gm);
    const obsFinal = await helpers.editorFor(observer, 'creature:B');
    const periodicObsFinal = obsFinal.getByRole('region', { name: 'Active periodic effects', exact: true }); await periodicObsFinal.waitFor();
    report.checks.observerPeriodicFinal = await periodicObsFinal.innerText();
    assert.match(report.checks.observerPeriodicFinal, /Effect naturally expired — awaiting GM resolution/);
    assert.equal(await periodicObsFinal.getByRole('button', { name: /Apply tick|Dismiss tick/ }).count(), 0);
    save('observer-periodic-final.aria.yml', await obsFinal.ariaSnapshot());
    await helpers.closeEditor(observer);
    stage('Natural expiry state', 'App view (GM Dismiss-only final tick; observer read-only)');

    step('GM reads the PC active attribute and movement sections outside Stunned, with timing, totals and base-stats protection');
    const gmPc = await helpers.editorFor(gm, 'character:pc');
    assert.equal(await gmPc.getByRole('region', { name: 'Shared PC Defending', exact: true }).count(), 1, 'PC container label');
    const attrs = gmPc.getByRole('region', { name: 'Active attribute changes', exact: true }); await attrs.waitFor();
    report.checks.gmAttributes = await attrs.innerText();
    assert.match(report.checks.gmAttributes, /Iron Will · Spirit \+2/);
    assert.match(report.checks.gmAttributes, /Total authored change: Spirit \+2/);
    assert.match(report.checks.gmAttributes, /Until morning — GM removes\./);
    assert.match(report.checks.gmAttributes, /base, level-up, heritage, origin and equipment values are not edited/);
    assert.equal(await attrs.evaluate(el => Boolean(el.closest('[aria-label="Shared Stunned"]'))), false, 'attribute section is a sibling of Stunned');
    assert.equal(await attrs.getByRole('button', { name: /Remove Iron Will instance/ }).count(), 1);
    const moves = gmPc.getByRole('region', { name: 'Active movement effects', exact: true }); await moves.waitFor();
    report.checks.gmMovement = await moves.innerText();
    assert.match(report.checks.gmMovement, /Hobbled · movement −10 ft/);
    assert.match(report.checks.gmMovement, /Resulting speed:/);
    assert.match(report.checks.gmMovement, /Until dusk — GM removes\./);
    save('gm-pc-readable.aria.yml', await gmPc.ariaSnapshot());
    await helpers.closeEditor(gm);
    stage('PC readable sections', 'App view (GM shared condition editor, ordinary attachment selection)');

    step('observer reads the same PC sections with no mutation controls and no private source identity');
    const obsPc = await helpers.editorFor(observer, 'character:pc');
    const obsAttrs = obsPc.getByRole('region', { name: 'Active attribute changes', exact: true }); await obsAttrs.waitFor();
    const obsMoves = obsPc.getByRole('region', { name: 'Active movement effects', exact: true }); await obsMoves.waitFor();
    report.checks.observerPc = await obsPc.innerText();
    assert.match(report.checks.observerPc, /Iron Will · Spirit \+2/); assert.match(report.checks.observerPc, /Hobbled · movement −10 ft/);
    assert.equal(await obsPc.getByRole('button', { name: /Remove .* instance/ }).count(), 0, 'no removal control for observer');
    assert.equal(await obsPc.getByText(/Source actor:/).count(), 0, 'no private source actor for observer');
    save('observer-pc-readable.aria.yml', await obsPc.ariaSnapshot());
    await helpers.closeEditor(observer);
    stage('observer privacy', 'App view (observer shared condition editor)');

    report.checks.hpUntouched = { current: B(host).state.currentHp, temp: B(host).state.tempHealth };
    assert.equal(report.errors.length, 0, JSON.stringify(report.errors));
    report.passed = true;
  } catch (e) {
    report.failure = e.stack;
    for (const [role, p] of Object.entries(pages)) { save(`failure-${role}.aria.yml`, await p.locator('body').ariaSnapshot().catch(() => 'unavailable')); await p.screenshot({ path: path.join(out, `failure-${role}.png`) }).catch(() => {}); }
    throw e;
  } finally {
    report.endedAt = new Date().toISOString(); report.build = process.env.APP_BUILD_DIR;
    report.buildAssetManifestSha256 = crypto.createHash('sha256').update(fs.readFileSync(path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json'))).digest('hex');
    report.receipts = require('../../../server/services/actorConsequences').ledger(host.room).receipts.map(r => require('../../../server/services/actorConsequences').publicReceipt(r));
    save('result.json', report); await browser.close().catch(() => {});
    await Promise.race([host.stop().catch(() => {}), new Promise(resolve => setTimeout(resolve, 10000))]);
  }
}
main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
