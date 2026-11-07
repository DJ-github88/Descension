// F7-inclusive player→PC attribute witness (Opus, 2026-11-05).
// Scope retained from the player→PC witness: exact PC targeting, beneficial owner acceptance (decline + accept) and hostile
// GM adjudication. Added: the character-load / room-snapshot ordering case WITHOUT any corrective sync.
// Read-only reuse: the attribute helper is compiled from its released bytes with exactly two load-time transforms
//   (1) the corrective post-load snapshot refresh is removed;
//   (2) an `order` argument selects 'sync-first' (room snapshot, then character load) or 'load-first' (character load, then
//       the one and only room snapshot). The owner attachment is selected after both, as in the App.
// Neither released file (attribute-modifier-app-browser.cjs, player-pc-effect-app-browser.cjs) is edited.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), Module = require('module');
const { chromium } = require('playwright');
const out = process.env.ATTR_OUTPUT;
assert(out && path.isAbsolute(out) && process.env.APP_BUILD_DIR);
fs.mkdirSync(out, { recursive: true });
const helperPath = path.join(__dirname, 'attribute-modifier-app-browser.cjs');
let helperSource = fs.readFileSync(helperPath, 'utf8').replace(/\r\n/g, '\n');
assert(helperSource.endsWith('main();\n'), 'Read-only helper entrypoint changed; reconcile before reuse');
const swap = (from, to) => { assert.equal(helperSource.split(from).length, 2, 'Helper anchor missing or repeated: ' + from.slice(0, 60)); helperSource = helperSource.replace(from, to); };
swap('return page.evaluate(async({ uid, fixtureCharacter }) => {', 'return page.evaluate(async({ uid, fixtureCharacter, order }) => {');
swap('}, { uid, fixtureCharacter });', '}, { uid, fixtureCharacter: page.__fixtureOverride || fixtureCharacter, order: page.__order || \'sync-first\' });');
swap('    const result = await __actors.refreshActorSnapshot(); if (!result.success) throw Error(JSON.stringify(result));\n',
  '    window.__f7Order = order; window.__wSnaps = 0; if (order !== \'load-first\') { window.__wSnaps++; window.__wSnapNow = true; const pending = __actors.refreshActorSnapshot(); window.__wSnapNow = false; const result = await pending; if (!result.success) throw Error(JSON.stringify(result)); }\n');
swap('    if (uid === \'app-owner\') { const r = __actors.selectOwnerAttachment(fixture.refs.pc);',
  '    if (order === \'load-first\') { window.__wSnaps++; window.__wSnapNow = true; const pendingFirst = __actors.refreshActorSnapshot(); window.__wSnapNow = false; const first = await pendingFirst; if (!first.success) throw Error(JSON.stringify(first)); }\n    if (uid === \'app-owner\') { const r = __actors.selectOwnerAttachment(fixture.refs.pc);');
swap('window.__outbound.push({ event, payload: args[0] });', 'window.__outbound.push({ event, payload: args[0], at: Date.now(), witness: !!window.__wSnapNow, stack: event === \'actor_snapshot\' ? String(new Error().stack) : undefined });');
swap('    if (fixtureCharacter) { const again = await __actors.refreshActorSnapshot(); if (!again.success) throw Error(JSON.stringify(again)); }\n', '');
// (3) load-first loads the fixture character before the room goes live, so even the App's own mount-time snapshot
//     (SharedDefendingEditor → refreshEffectLifecycle) follows the character load; sync-first keeps the helper's order.
{
  const start = '    if (fixtureCharacter) {\n      const store = S(\'characterStore\')';
  const end = "if (store.getState().currentCharacterId !== fixtureCharacter.id) throw Error('Fixture character did not load');\n    }\n";
  const i = helperSource.indexOf(start), j = helperSource.indexOf(end, i);
  assert(i > 0 && j > i && helperSource.indexOf(start, i + 1) < 0, 'Helper fixture-load block changed; reconcile before reuse');
  const block = helperSource.slice(i, j + end.length);
  helperSource = helperSource.slice(0, i) + "    if (order !== 'load-first') await window.__loadFixture();\n" + helperSource.slice(j + end.length);
  swap("    S('gameStore').setState({ isInMultiplayer: true, isGMMode: uid === 'app-gm',",
    "    window.__loadFixture = async() => {\n" + block.replace("store.getState().loadCharacter(fixtureCharacter.id);", "window.__loadAt = Date.now(); store.getState().loadCharacter(fixtureCharacter.id);") + "    };\n" +
    "    if (order === 'load-first') await window.__loadFixture();\n" +
    "    S('gameStore').setState({ isInMultiplayer: true, isGMMode: uid === 'app-gm',");
}
// (4) observation only: a timeline of every conditionStore / snapshot write on this page, to show which writer ran last.
swap("    window.__actors = moduleWith('acceptRecoveredActorSnapshot:');",
  "    window.__actors = moduleWith('acceptRecoveredActorSnapshot:');\n" +
  "    window.__timeline = []; window.__t0 = Date.now(); const mark = (kind, extra) => window.__timeline.push({ ms: Date.now() - window.__t0, kind, character: S('characterStore').getState().currentCharacterId, ...extra });\n" +
  "    const roomAgility = () => { const c = S('conditionStore').getState(); return [...c.activeBuffs, ...c.activeDebuffs].filter(r => r.target?.roomId && r.effects?.agility).map(r => r.effects.agility); };\n" +
  "    S('conditionStore').subscribe(() => mark('conditions', { roomAgility: roomAgility() }));\n" +
  "    S('characterTokenStore').subscribe((a, b) => { if (a.characterTokens !== b.characterTokens) mark('room tokens', { tokenAgility: (a.characterTokens.find(t => t.id === 'ally')?.state?.conditions || []).map(r => r.effects?.agility) }); });\n" +
  "    S('characterStore').subscribe((a, b) => { if (a.currentCharacterId !== b.currentCharacterId) mark('character', { from: b.currentCharacterId }); });\n");
const helper = new Module(helperPath, module); helper.filename = helperPath; helper.paths = module.paths;
helper._compile(helperSource.slice(0, -'main();\n'.length) + '\nmodule.exports = { setup, authorAttribute, authorFormula, reopenAndAdmit, ownerView, gmConfirm, patchClick, report };', helperPath);
const { patchClick, setup, authorAttribute, authorFormula, reopenAndAdmit, ownerView, gmConfirm } = helper.exports;
const actors = require('../../../server/services/actorConsequences');
const fixtureCharacters = require('./m4b-fixture-characters.cjs');
const save = (name, value) => fs.writeFileSync(path.join(out, name), JSON.stringify(value, null, 2));
const report = { startedAt: new Date().toISOString(), steps: [], checks: { ordering: [] }, qualifications: [
  'Production optimized App and registered production handlers; fixture identity, Firebase owner lookup, cloud persistence and room lease. No live Firebase.',
  'Fixture characters load through production loadCharacter (which triggers the production useCharacterPersistence runtime load); socket/bootstrap identity and attachment selection are fixtures.',
  'NO corrective sync: every page performs exactly one room snapshot per load, either before (sync-first) or after (load-first) the character load. The helper\'s post-load refresh is removed at load time.',
  'Only bootstrap/inspection, the character-switch fixture and one dropped ACK use evaluation. Gameplay approvals are exclusively ordinary controls; no direct handler calls or injected approvals.',
  'Character switch uses a second fixture character of the same owner (Ally Alt, Agility 12, no attachment selected).',
  'Cloud software rendering: the helper\'s click retry (same control, force only after a "not stable"/"intercepts pointer" timeout) is applied, as in attribute witness run 6.',
  'The ordering check observes a 4 s stability window after load to catch a late runtime write; this is observation, not a fix (the App has no delay).'
], errors: [] };
const step = name => { report.steps.push({ name, at: new Date().toISOString() }); save('progress.json', report); console.log(name); };
const until = async(fn, name, tries = 100) => { for (let i = 0; i < tries; i++) { if (await fn()) return; await new Promise(r => setTimeout(r, 200)); } throw Error('Timed out: ' + name); };
const cast = p => p.getByRole('dialog', { name: 'Supported spell cast', exact: true });
async function strikeText(p) {
  const closeTable = p.getByRole('button', { name: 'Close weapon table', exact: true });
  if (await closeTable.isVisible()) await closeTable.click();
  await p.mouse.move(10, 10);
  const wing = p.locator('.action-bar-assembly:not(.spell-action-bar-assembly) .equipment-action-slot-wrapper.slot-ranged');
  const attack = wing.getByRole('button', { name: /^Ranged Attack \(Witness Bow\)/ });
  if (!await attack.isVisible()) await wing.locator('.equipment-action-slot').click();
  await attack.focus(); await attack.press('Enter');
  const dialog = p.getByRole('dialog', { name: 'Basic weapon strike', exact: true }); await dialog.waitFor();
  await dialog.getByRole('combobox', { name: 'Strike target', exact: true }).selectOption('creature:app-hall:B');
  const text = await dialog.innerText(); await dialog.getByRole('button', { name: 'Close strike', exact: true }).click();
  return (text.match(/agility -?\d+ \([+-]?\d+\)/) || [null])[0];
}
async function admitted(p, name, targetId, kind = 'character') {
  const summary = p.locator('summary').filter({ hasText: /^Admitted abilities$/ });
  if (!await summary.evaluate(e => e.parentElement.open)) await summary.click();
  const region = p.getByRole('region', { name: 'Admitted abilities', exact: true });
  await region.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
  await region.locator('.p9-admitted-row').filter({ hasText: name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
  const select = cast(p).getByRole('combobox', { name: 'Target', exact: true });
  const value = await select.locator('option').evaluateAll((items, args) => items.map(e => e.value).find(v => {
    try { const r = JSON.parse(v); return r.tokenId === args.targetId && r.kind === args.kind; } catch (_) { return false; }
  }), { targetId, kind });
  assert(value, 'Exact ordinary PC option unavailable'); await select.selectOption(value);
  report.checks.lastSelected = JSON.parse(value); return cast(p);
}
async function proposals(p) {
  const summary = p.locator('summary').filter({ hasText: /notices and voluntary proposals/ });
  if (!await summary.evaluate(e => e.parentElement.open)) await summary.click();
  const region = p.getByRole('region', { name: 'Target Stunned notices', exact: true });
  await region.getByRole('button', { name: 'Refresh original target proposals', exact: true }).click(); return region;
}
async function remove(gm, id, name) {
  const controls = gm.getByRole('region', { name: 'Actor attachment and consequences', exact: true });
  await controls.getByRole('combobox', { name: 'Exact room attachment', exact: true }).selectOption('character:ally');
  await controls.getByRole('button', { name: 'Edit selected shared conditions', exact: true }).click();
  const editor = gm.getByRole('dialog', { name: 'Edit selected shared conditions editor', exact: true });
  await editor.getByRole('button', { name: `Remove ${name} instance ${id}`, exact: true }).click();
  await editor.getByRole('button', { name: 'Close shared condition editor', exact: true }).click();
}
/** Reload the target owner's App in the given order (one snapshot, no corrective sync) and require the exact expected
 *  effective Agility, with exactly `count` room Agility records applied, stable across a 4 s observation window. */
async function reloadAndCheck(target, host, order, expected, count, label) {
  target.__order = order; target.__fixtureOverride = null;
  const startedAt = Date.now(); await setup(target, host, 'app-target');
  const order0 = await target.evaluate(() => window.__f7Order); assert.equal(order0, order);
  await until(async() => (await ownerView(target)).agility === expected, `${label}: ${order} reaches Agility ${expected}`, 75);
  const samples = [];
  for (let i = 0; i < 20; i++) { samples.push(await ownerView(target)); await new Promise(r => setTimeout(r, 200)); }
  const snaps = await target.evaluate(() => ({ t0: window.__t0, loadAt: window.__loadAt, timeline: window.__timeline, witness: window.__wSnaps, emits: (window.__outbound || []).filter(v => v.event === 'actor_snapshot').map(v => ({ at: v.at, witness: v.witness, stack: v.stack })) }));
  const outbound = snaps.witness;
  const entry = { label, order, expected, count, characterLoadMs: snaps.loadAt - snaps.t0, timeline: snaps.timeline, snapshotEmitMs: snaps.emits.map(e => e.at - snaps.t0), msToFirst: Date.now() - startedAt, witnessSnapshots: snaps.witness, snapshotEmits: snaps.emits.map(e => ({ msAfterStart: e.at - startedAt, witness: e.witness, stack: e.witness ? undefined : e.stack })),
    agilitySamples: [...new Set(samples.map(s => s.agility))], appliedSamples: [...new Set(samples.map(s => s.sheetBuffs + s.sheetDebuffs))], final: samples.at(-1) };
  report.checks.ordering.push(entry); save('progress.json', report);
  assert.deepEqual(entry.agilitySamples, [expected], `${label} ${order}: Agility flapped ${JSON.stringify(entry.agilitySamples)}`);
  assert.deepEqual(entry.appliedSamples, [count], `${label} ${order}: applied records ${JSON.stringify(entry.appliedSamples)}`);
  assert.equal(outbound, 1, 'The witness issues exactly one room snapshot per load (no corrective sync)');
  return entry;
}
async function main() {
  const host = await require('./m4b-catalogue-app-server.cjs').start();
  host.backend.registerAuthToken('app-observer', 'app-observer');
  for (const event of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw', 'actor_spell_target_respond', 'actor_bind', 'join_room']) host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const browser = await chromium.launch({ headless: true }), pages = {};
  const hall = () => host.room.gameState.maps['app-hall'], targetToken = () => hall().characterTokens.ally;
  const maps = () => actors.clone(host.room.gameState.maps);
  try {
    for (const role of ['gm', 'source', 'target', 'observer']) {
      pages[role] = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      pages[role].on('pageerror', e => report.errors.push({ role, message: e.message })); patchClick(pages[role]);
    }
    const { gm, source, target, observer } = pages;
    await setup(gm, host, 'app-gm');
    step('Wizard author/save/reopen/admit exact +2 and −2 rider-only Agility examples and an Agility-scaled bolt');
    await authorAttribute(gm, 'PC Quickening', 2, 'Quickened'); await reopenAndAdmit(gm, 'PC Quickening', 'martyr');
    await setup(gm, host, 'app-gm'); await authorAttribute(gm, 'PC Leaden Hex', -2, 'Leaden'); await reopenAndAdmit(gm, 'PC Leaden Hex', 'martyr');
    await setup(gm, host, 'app-gm'); await authorFormula(gm, 'PC Agility Bolt', '1d6 + agility'); await reopenAndAdmit(gm, 'PC Agility Bolt');
    for (const [p, uid] of [[gm, 'app-gm'], [source, 'app-owner'], [target, 'app-target'], [observer, 'app-observer']]) await setup(p, host, uid);
    const baseline = await ownerView(target), A = baseline.agility;
    report.checks.baseline = baseline; report.checks.strikeBefore = await strikeText(target);

    step('Beneficial decline: exact PC selected; source approves; only the target owner can decline; GM cannot install');
    let d = await admitted(source, 'PC Quickening', 'ally');
    report.checks.beneficialSource = await d.innerText(); const before = maps();
    await d.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true }).click();
    await d.getByText(/Awaiting GM/).first().waitFor(); assert.deepEqual(maps(), before);
    assert.equal(await source.getByRole('button', { name: 'Accept this exact effect bundle', exact: true }).count(), 0);
    assert.equal(await observer.getByRole('button', { name: 'Accept this exact effect bundle', exact: true }).count(), 0);
    let region = await proposals(target); report.checks.declinedProposal = await region.innerText();
    await region.getByRole('button', { name: 'Withdraw target acceptance before installation', exact: true }).click();
    let card = await gmConfirm(gm, 'PC Quickening');
    await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    await card.getByText(/target acceptance required/i).waitFor(); assert.deepEqual(maps(), before);
    report.checks.declineNoMutation = true;
    await card.getByRole('button', { name: 'Decline', exact: true }).click();
    await d.getByRole('button', { name: 'Close', exact: true }).click();

    step('Hostile −2: player casts on PC; GM confirms without target acceptance; consumers change once');
    d = await admitted(source, 'PC Leaden Hex', 'ally'); const priceBefore = actors.clone(hall().characterTokens.pc.character);
    await d.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true }).click();
    await d.getByText(/Awaiting GM/).first().waitFor(); assert.deepEqual(hall().characterTokens.pc.character, priceBefore);
    card = await gmConfirm(gm, 'PC Leaden Hex'); report.checks.hostileGm = await card.innerText();
    await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    await until(() => targetToken().state.conditions.length === 1, 'hostile install');
    await until(async() => (await ownerView(target)).agility === A - 2, 'Agility −2 consumer');
    report.checks.afterHostile = await ownerView(target); report.checks.strikeHostile = await strikeText(target);
    assert.match(report.checks.strikeHostile, new RegExp(`agility ${A - 2} `));
    report.checks.paymentHostile = { before: priceBefore, after: actors.clone(hall().characterTokens.pc.character) };
    for (const [role, p] of Object.entries(pages)) {
      await until(async() => (await p.evaluate(() => S('characterTokenStore').getState().characterTokens.find(t => t.id === 'ally')?.state?.conditions || [])).length === 1, role + ' sees effect');
      const records = await p.evaluate(() => S('characterTokenStore').getState().characterTokens.find(t => t.id === 'ally').state.conditions);
      assert.match(records[0].description, /Agility.*2/); assert.equal(records[0].sourceActor, undefined);
      report.checks[role + 'HostileDescription'] = records[0].description;
    }
    await d.getByRole('button', { name: 'Close', exact: true }).click();

    step('F7 ordering with live −2: target App reloads sync-first and load-first; no corrective sync; applied exactly once');
    await reloadAndCheck(target, host, 'sync-first', A - 2, 1, 'hostile live');
    await reloadAndCheck(target, host, 'load-first', A - 2, 1, 'hostile live');
    report.checks.strikeAfterReload = await strikeText(target); assert.match(report.checks.strikeAfterReload, new RegExp(`agility ${A - 2} `));
    const bolt = await admitted(target, 'PC Agility Bolt', 'B', 'creature');
    report.checks.formulaAfterReload = await bolt.innerText(); assert.match(report.checks.formulaAfterReload, new RegExp(`agility ${A - 2}`));
    await bolt.getByRole('button', { name: 'Close', exact: true }).click();

    step('F7 character switch: the same owner loads another character; the −2 is not carried; switching back reapplies it once');
    const alt = { ...JSON.parse(JSON.stringify(fixtureCharacters.characters['app-target'])), id: 'ally-alt', name: 'Ally Alt' };
    alt.stats = { ...alt.stats, agility: 12 }; alt.baseStats = { ...alt.baseStats, agility: 12 };
    await target.evaluate(async alt => {
      const store = S('characterStore'); store.setState({ characters: [...store.getState().characters.filter(c => c.id !== alt.id), alt] });
      store.getState().loadCharacter(alt.id); if (store.getState().currentCharacterId !== alt.id) throw Error('Alt did not load');
    }, alt);
    const switchSamples = [];
    for (let i = 0; i < 20; i++) { switchSamples.push(await ownerView(target)); await new Promise(r => setTimeout(r, 200)); }
    report.checks.switched = { agility: [...new Set(switchSamples.map(s => s.agility))], storedAgility: switchSamples.at(-1).storedAgility,
      tokenRecords: switchSamples.at(-1).records.length };
    const offset = baseline.agility - baseline.storedAgility; report.checks.switched.equipmentOffset = offset;  // same fixture equipment on both characters
    assert.deepEqual(report.checks.switched.agility, [12 + offset], 'Switched character must show its own Agility (12 plus its equipment offset) with no carried room effect');
    assert.equal(targetToken().state.conditions.length, 1, 'The room record itself is untouched by the switch');
    assert.equal(targetToken().state.conditions[0].effects.agility, -2);
    await reloadAndCheck(target, host, 'sync-first', A - 2, 1, 'after switch back');

    step('Removal: GM removes the −2; reloads in both orders keep it removed (no stale draft resurrection)');
    await remove(gm, targetToken().state.conditions[0].recordId, 'Leaden');
    await until(async() => (await ownerView(target)).agility === A, 'removal restores baseline');
    await reloadAndCheck(target, host, 'load-first', A, 0, 'removed');
    await reloadAndCheck(target, host, 'sync-first', A, 0, 'removed');

    step('Beneficial +2: fresh player offer, target owner accepts exact bundle, GM confirms with one dropped ACK');
    d = await admitted(source, 'PC Quickening', 'ally');
    const beneficialPriceBefore = actors.clone(hall().characterTokens.pc.character);
    await d.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true }).click(); await d.getByText(/Awaiting GM/).first().waitFor();
    region = await proposals(target); await region.getByRole('button', { name: 'Accept this exact effect bundle', exact: true }).click();
    card = await gmConfirm(gm, 'PC Quickening');
    const receiptCount = actors.ledger(host.room).receipts.length;
    await gm.evaluate(() => { const emit = __socket.emit.bind(__socket); let drop = true; __socket.emit = (event, ...args) => {
      if (drop && event === 'actor_consequence' && String(args[0]?.adjudication?.definitionVersionOrHash).startsWith('authored-effect:v1/')) { drop = false; if (typeof args[1] === 'function') args[1] = () => {}; }
      return emit(event, ...args);
    }; });
    await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    await until(() => targetToken().state.conditions.length === 1, 'beneficial install');
    await d.getByText(/^Accepted/).first().waitFor();
    const beneficialPriceAfter = actors.clone(hall().characterTokens.pc.character);
    for (const [pool, temp, cost] of [['actionPoints', 'tempActionPoints', 1], ['mana', 'tempMana', 2]]) {
      assert.equal(beneficialPriceBefore[pool].current + (beneficialPriceBefore[temp] || 0) - beneficialPriceAfter[pool].current - (beneficialPriceAfter[temp] || 0), cost);
    }
    report.checks.paymentBeneficial = { before: beneficialPriceBefore, after: beneficialPriceAfter };
    const original = await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload);
    assert.equal(actors.ledger(host.room).receipts.length, receiptCount + 1);
    await setup(gm, host, 'app-gm');
    await gm.getByRole('button', { name: 'Check same command', exact: true }).first().click();
    await gm.getByText(/Accepted · /).first().waitFor({ timeout: 35000 });
    assert.equal(actors.ledger(host.room).receipts.length, receiptCount + 1);
    assert.deepEqual(await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').at(-1).payload), original);
    report.checks.recovery = { commandId: original.commandId, receiptDelta: 1, exactCommandReplayed: true };
    await until(async() => (await ownerView(target)).agility === A + 2, 'Agility +2 consumer');
    report.checks.afterBeneficial = await ownerView(target); report.checks.strikeBeneficial = await strikeText(target);
    assert.match(report.checks.strikeBeneficial, new RegExp(`agility ${A + 2} `));
    for (const [role, p] of Object.entries(pages)) {
      await until(async() => (await p.evaluate(() => S('characterTokenStore').getState().characterTokens.find(t => t.id === 'ally')?.state?.conditions || [])).some(r => r.effects?.agility === 2), role + ' sees beneficial effect');
      const record = await p.evaluate(() => S('characterTokenStore').getState().characterTokens.find(t => t.id === 'ally').state.conditions[0]);
      assert.match(record.description, /Agility \+2/); assert.equal(record.sourceActor, undefined); assert.equal(record.effectDefinition, undefined);
      report.checks[role + 'BeneficialDescription'] = record.description;
    }
    await d.getByRole('button', { name: 'Close', exact: true }).click();

    step('F7 ordering with live +2: both orders, applied exactly once; formula and strike consume it');
    await reloadAndCheck(target, host, 'load-first', A + 2, 1, 'beneficial live');
    await reloadAndCheck(target, host, 'sync-first', A + 2, 1, 'beneficial live');
    const beneficialBolt = await admitted(target, 'PC Agility Bolt', 'B', 'creature');
    report.checks.formulaBeneficial = await beneficialBolt.innerText(); assert.match(report.checks.formulaBeneficial, new RegExp(`agility ${A + 2}`));
    await beneficialBolt.getByRole('button', { name: 'Close', exact: true }).click();

    step('Beneficial removal, reload stays removed; caster custody released');
    await remove(gm, targetToken().state.conditions[0].recordId, 'Quickened');
    await until(async() => (await ownerView(target)).agility === A, 'beneficial removal restores');
    await reloadAndCheck(target, host, 'sync-first', A, 0, 'beneficial removed');
    report.checks.restored = await ownerView(target);
    report.checks.strikeRestored = await strikeText(target); assert.match(report.checks.strikeRestored, new RegExp(`agility ${A} `));
    const nextCast = await admitted(source, 'PC Quickening', 'ally');
    assert.equal(await nextCast.getByRole('combobox', { name: 'Target', exact: true }).isEnabled(), true);
    report.checks.casterCustodyReleased = true;
    await nextCast.getByRole('button', { name: 'Close', exact: true }).click();
    for (const [role, p] of Object.entries(pages)) {
      fs.writeFileSync(path.join(out, role + '.aria.yml'), await p.locator('body').ariaSnapshot());
      await p.screenshot({ path: path.join(out, role + '.png') });
    }
    report.passed = report.errors.length === 0;
  } catch (error) {
    report.error = error.stack; console.error(error);
    for (const [role, p] of Object.entries(pages)) fs.writeFileSync(path.join(out, 'fail-' + role + '.aria.yml'), await p.locator('body').ariaSnapshot().catch(() => ''));
  } finally {
    report.helperErrors = helper.exports.report.errors; report.finishedAt = new Date().toISOString(); save('result.json', report);
    setTimeout(() => process.exit(report.passed ? 0 : 1), 20000).unref();
    await browser.close().catch(() => {}); await host.stop().catch(() => {});
  }
  if (!report.passed) process.exitCode = 1;
}
main().then(() => process.exit(process.exitCode || 0), error => { console.error(error); process.exit(1); });
