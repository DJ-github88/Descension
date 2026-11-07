// Bounded PC→PC witness. Reuse the attribute owner's read-only Wizard/fixture helpers;
// every cast, approval, decision, confirmation and removal below is an ordinary App control.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), Module = require('module');
const { chromium } = require('playwright');
const out = process.env.ATTR_OUTPUT;
assert(out && path.isAbsolute(out) && process.env.APP_BUILD_DIR);
fs.mkdirSync(out, { recursive: true });
const helperPath = path.join(__dirname, 'attribute-modifier-app-browser.cjs');
const helperSource = fs.readFileSync(helperPath, 'utf8').replace(/\r\n/g, '\n');
assert(helperSource.endsWith('main();\n'), 'Read-only helper entrypoint changed; reconcile before reuse');
const helper = new Module(helperPath, module); helper.filename = helperPath; helper.paths = module.paths;
helper._compile(helperSource.slice(0, -'main();\n'.length) + '\nmodule.exports = { setup, authorAttribute, authorFormula, reopenAndAdmit, ownerView, strikeText, gmConfirm, report };', helperPath);
const { setup, authorAttribute, authorFormula, reopenAndAdmit, ownerView, gmConfirm } = helper.exports;
const actors = require('../../../server/services/actorConsequences');
const save = (name, value) => fs.writeFileSync(path.join(out, name), JSON.stringify(value, null, 2));
const report = { startedAt: new Date().toISOString(), steps: [], checks: {}, qualifications: [
  'Production optimized App and registered production handlers; fixture identity, Firebase owner lookup, cloud persistence and room lease. No live Firebase.',
  'Complete deterministic saved character fixtures load through production loadCharacter; socket/bootstrap identity and initial attachment selection are fixtures.',
  'Only bootstrap/inspection and one dropped ACK use evaluation. Gameplay approvals are exclusively ordinary controls; no direct handler calls or injected approvals.',
  'Read-only reuse of attribute witness helper functions; its main witness and force-click patch are never run. Temporary room: accepted-live only.'
], errors: [] };
const step = name => { report.steps.push({ name, at: new Date().toISOString() }); save('progress.json', report); console.log(name); };
const until = async(fn, name) => { for (let i = 0; i < 100; i++) { if (await fn()) return; await new Promise(r => setTimeout(r, 200)); } throw Error('Timed out: ' + name); };
const cast = p => p.getByRole('dialog', { name: 'Supported spell cast', exact: true });
async function strikeText(p) {
  // Leave any prior hover/table via its own control (global Escape opens the game's exit dialog).
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
async function main() {
  const host = await require('./m4b-catalogue-app-server.cjs').start();
  host.backend.registerAuthToken('app-observer', 'app-observer');
  for (const event of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw', 'actor_spell_target_respond', 'actor_bind', 'join_room']) host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const browser = await chromium.launch({ channel: 'chrome', headless: true }), pages = {};
  const hall = () => host.room.gameState.maps['app-hall'], targetToken = () => hall().characterTokens.ally;
  const maps = () => actors.clone(host.room.gameState.maps);
  try {
    for (const role of ['gm', 'source', 'target', 'observer']) {
      pages[role] = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      pages[role].on('pageerror', e => report.errors.push({ role, message: e.message }));
    }
    const { gm, source, target, observer } = pages;
    await setup(gm, host, 'app-gm');
    step('Wizard author/save/reopen/admit exact +2 and −2 rider-only Agility examples (1 AP / 2 mana each)');
    await authorAttribute(gm, 'PC Quickening', 2, 'Quickened'); await reopenAndAdmit(gm, 'PC Quickening', 'martyr');
    await setup(gm, host, 'app-gm'); await authorAttribute(gm, 'PC Leaden Hex', -2, 'Leaden'); await reopenAndAdmit(gm, 'PC Leaden Hex', 'martyr');
    await setup(gm, host, 'app-gm'); await authorFormula(gm, 'PC Agility Bolt', '1d6 + agility'); await reopenAndAdmit(gm, 'PC Agility Bolt');
    for (const [p, uid] of [[gm, 'app-gm'], [source, 'app-owner'], [target, 'app-target'], [observer, 'app-observer']]) await setup(p, host, uid);
    const baseline = await ownerView(target), A = baseline.agility;
    report.checks.baseline = baseline; report.checks.strikeBefore = await strikeText(target);
    step('Beneficial decline: exact PC selected; source approves without payment; only target owner declines; GM cannot install');
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
    step('Hostile −2: player casts on PC; GM confirms without target acceptance; public record and consumers change once');
    d = await admitted(source, 'PC Leaden Hex', 'ally'); const priceBefore = actors.clone(hall().characterTokens.pc.character);
    await d.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true }).click();
    await d.getByText(/Awaiting GM/).first().waitFor(); assert.deepEqual(hall().characterTokens.pc.character, priceBefore);
    card = await gmConfirm(gm, 'PC Leaden Hex'); report.checks.hostileGm = await card.innerText();
    await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    await until(() => targetToken().state.conditions.length === 1, 'hostile install');
    await until(async() => (await ownerView(target)).agility === A - 2, 'Agility −2 consumer');
    report.checks.afterHostile = await ownerView(target); report.checks.strikeHostile = await strikeText(target);
    assert.match(report.checks.strikeHostile, new RegExp(`agility ${A - 2} `));
    const bolt = await admitted(target, 'PC Agility Bolt', 'B', 'creature');
    report.checks.formulaHostile = await bolt.innerText(); assert.match(report.checks.formulaHostile, new RegExp(`agility ${A - 2}`));
    await bolt.getByRole('button', { name: 'Close', exact: true }).click();
    report.checks.paymentHostile = { before: priceBefore, after: actors.clone(hall().characterTokens.pc.character) };
    for (const [role, p] of Object.entries(pages)) {
      await until(async() => (await p.evaluate(() => S('characterTokenStore').getState().characterTokens.find(t => t.id === 'ally')?.state?.conditions || [])).length === 1, role + ' sees effect');
      const records = await p.evaluate(() => S('characterTokenStore').getState().characterTokens.find(t => t.id === 'ally').state.conditions);
      assert.match(records[0].description, /Agility.*2/); assert.equal(records[0].sourceActor, undefined);
      report.checks[role + 'HostileDescription'] = records[0].description;
    }
    await remove(gm, targetToken().state.conditions[0].recordId, 'Leaden');
    await until(async() => (await ownerView(target)).agility === A, 'removal restores baseline');
    await d.getByRole('button', { name: 'Close', exact: true }).click();
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
    const beneficialBolt = await admitted(target, 'PC Agility Bolt', 'B', 'creature');
    report.checks.formulaBeneficial = await beneficialBolt.innerText(); assert.match(report.checks.formulaBeneficial, new RegExp(`agility ${A + 2}`));
    await beneficialBolt.getByRole('button', { name: 'Close', exact: true }).click();
    for (const [role, p] of Object.entries(pages)) {
      await until(async() => (await p.evaluate(() => S('characterTokenStore').getState().characterTokens.find(t => t.id === 'ally')?.state?.conditions || [])).some(r => r.effects?.agility === 2), role + ' sees beneficial effect');
      const record = await p.evaluate(() => S('characterTokenStore').getState().characterTokens.find(t => t.id === 'ally').state.conditions[0]);
      assert.match(record.description, /Agility \+2/); assert.equal(record.sourceActor, undefined); assert.equal(record.effectDefinition, undefined);
      report.checks[role + 'BeneficialDescription'] = record.description;
    }
    await remove(gm, targetToken().state.conditions[0].recordId, 'Quickened');
    await until(async() => (await ownerView(target)).agility === A, 'beneficial removal restores');
    report.checks.restored = await ownerView(target);
    report.checks.strikeRestored = await strikeText(target); assert.match(report.checks.strikeRestored, new RegExp(`agility ${A} `));
    await d.getByRole('button', { name: 'Close', exact: true }).click();
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
  } finally { report.helperErrors = helper.exports.report.errors; save('result.json', report); await browser.close(); await host.stop(); }
  if (!report.passed) process.exitCode = 1;
}
main().then(() => process.exit(process.exitCode || 0), error => { console.error(error); process.exit(1); });
