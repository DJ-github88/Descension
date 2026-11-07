// Ordinary App Intelligence/Spirit witness. Read-only reuse of released Wizard helpers, no corrective refresh.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), Module = require('module');
const { chromium } = require('playwright');
const out = process.env.ATTR_OUTPUT; assert(out && path.isAbsolute(out) && process.env.APP_BUILD_DIR);
fs.mkdirSync(out, { recursive: true });
const helperPath = path.join(__dirname, 'attribute-modifier-app-browser.cjs');
let text = fs.readFileSync(helperPath, 'utf8').replace(/\r\n/g, '\n');
assert(text.endsWith('main();\n'));
const correction = 'if (fixtureCharacter) { const again = await __actors.refreshActorSnapshot(); if (!again.success) throw Error(JSON.stringify(again)); }';
assert(text.includes(correction));
text = text.replace(correction, '// Deliberately no second snapshot: production load must retain the room record.');
text = text.replace('async function authorAttribute(p, name, amount, label)', 'async function authorAttribute(p, name, amount, label, attribute)')
  .replace("selectOption('agility')", 'selectOption(attribute)').replace("attribute: 'agility', amount, label", 'attribute, amount, label');
const helper = new Module(helperPath, module); helper.filename = helperPath; helper.paths = module.paths;
helper._compile(text.slice(0, -'main();\n'.length) + '\nmodule.exports = { setup, authorAttribute, authorFormula, reopenAndAdmit, gmConfirm };', helperPath);
const { setup, authorAttribute, authorFormula, reopenAndAdmit, gmConfirm } = helper.exports;
const actors = require('../../../server/services/actorConsequences');
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const report = { startedAt: new Date().toISOString(), checks: {}, steps: [], errors: [], qualifications: [
  'Optimized production App, registered production backend. Identity/provider, canonical ownership, room lease and cloud persistence are fixtures; temporary accepted-live only, no real Firebase.',
  'Complete deterministic M4B characters through production loadCharacter; default room actor fixtures. No fixture-assigned creature ability: both modifiers are ordinary PC-to-PC casts.',
  'Read-only Wizard helper reuse, generalized attribute selector. Original helper main/force-click patch never executed. Extra snapshot after load explicitly removed.',
  'Evaluation is bootstrap and inspection only; all authoring, admission, casts, approvals, target acceptance, GM confirmation and exact removal use ordinary controls.'
] };
const step = name => { report.steps.push(name); console.log(name); save('progress.json', report); };
const until = async(fn, label) => { for (let n = 0; n < 100; n++) { if (await fn()) return; await new Promise(r => setTimeout(r, 200)); } throw Error('Timed out: ' + label); };
const cast = p => p.getByRole('dialog', { name: 'Supported spell cast', exact: true });
async function admitted(p, name, id, kind) {
  const s = p.locator('summary').filter({ hasText: /^Admitted abilities$/ }); if (!await s.evaluate(e => e.parentElement.open)) await s.click();
  const r = p.getByRole('region', { name: 'Admitted abilities', exact: true }); await r.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
  await r.locator('.p9-admitted-row').filter({ hasText: name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
  const select = cast(p).getByRole('combobox', { name: 'Target', exact: true });
  const value = await select.locator('option').evaluateAll((opts, arg) => opts.map(e => e.value).find(v => { try { const r = JSON.parse(v); return r.tokenId === arg.id && r.kind === arg.kind; } catch (_) { return v === `${arg.kind}:app-hall:${arg.id}`; } }), { id, kind });
  assert(value, `Exact ${kind} target ${id}`); await select.selectOption(value); return cast(p);
}
const view = p => p.evaluate(() => {
  const sheet = S('characterStore').getState(), c = S('conditionStore').getState();
  return { effective: sheet.getTotalStatsWithEffects(c.getActiveEffects('buff'), c.getActiveEffects('debuff')), stats: sheet.stats, baseStats: sheet.baseStats,
    health: sheet.health, mana: sheet.mana, records: [...c.activeBuffs, ...c.activeDebuffs].filter(r => r.target?.tokenId === 'ally') };
});
async function remove(gm, id, name) {
  const r = gm.getByRole('region', { name: 'Actor attachment and consequences', exact: true });
  await r.getByRole('combobox', { name: 'Exact room attachment', exact: true }).selectOption('character:ally');
  await r.getByRole('button', { name: 'Edit selected shared conditions', exact: true }).click();
  const d = gm.getByRole('dialog', { name: 'Edit selected shared conditions editor', exact: true });
  await d.getByRole('button', { name: `Remove ${name} instance ${id}`, exact: true }).click();
  await d.getByRole('button', { name: 'Close shared condition editor', exact: true }).click();
}
async function formula(p, gm, name, attribute, score, execute) {
  const d = await admitted(p, name, 'B', 'creature');
  const discard = d.getByRole('button', { name: 'Discard recorded roll', exact: true });
  if (await discard.count()) await discard.click(); // explicitly end the prior spell's unsent preview; never transfer its roll
  const review = d.getByRole('button', { name: 'Review changed scores with retained faces', exact: true });
  if (await review.count()) await review.click();
  else if (await d.getByLabel('d6 face 1', { exact: true }).count()) {
    await d.getByLabel('d6 face 1', { exact: true }).fill('3'); await d.getByRole('button', { name: 'Record physical roll', exact: true }).click();
  }
  const snapshot = await d.ariaSnapshot(); save(`${name}-${score}.aria.yml`, snapshot);
  assert(snapshot.toLowerCase().includes(`${attribute} ${score}`) || snapshot.includes(`${attribute === 'intelligence' ? 'INT' : 'SPI'} score ${score}`), 'visible effective formula score');
  if (execute) {
    await d.getByRole('button', { name: 'Approve price and send to GM', exact: true }).click();
    const card = gm.locator('.p9-gm-card').filter({ hasText: name }).last(); await card.waitFor();
    await card.getByRole('checkbox').check(); await card.getByLabel(/^Final/).fill(String(3 + score));
    await card.getByRole('button', { name: 'Accept one consequence', exact: true }).click();
    await d.getByText(/Accepted · /).first().waitFor({ timeout: 35000 });
  }
  await d.getByRole('button', { name: 'Close', exact: true }).click();
}
async function main() {
  const host = await require('./m4b-catalogue-app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw', 'actor_spell_target_respond', 'actor_bind', 'join_room']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const browser = await chromium.launch({ channel: 'chrome', headless: true }), pages = {};
  const token = () => host.room.gameState.maps['app-hall'].characterTokens.ally;
  try {
    for (const role of ['gm', 'source', 'target']) { pages[role] = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' }); pages[role].on('pageerror', e => report.errors.push({ role, message: e.message })); }
    const { gm, source, target } = pages;
    await setup(gm, host, 'app-gm');
    for (const [attribute, amount, title, label] of [['intelligence', 2, 'Prism Clear Thought', 'Clear Thought'], ['spirit', -2, 'Prism Spirit Burden', 'Spirit Burden']]) {
      step('Wizard author/save/reopen/admit ' + title);
      await authorAttribute(gm, title, amount, label, attribute); await reopenAndAdmit(gm, title, 'martyr');
      await setup(gm, host, 'app-gm');
      await authorFormula(gm, 'Prism ' + attribute + ' Bolt', '1d6 + ' + attribute); await reopenAndAdmit(gm, 'Prism ' + attribute + ' Bolt');
      await setup(gm, host, 'app-gm');
    }
    await setup(source, host, 'app-owner'); await setup(target, host, 'app-target');
    const original = await view(target); report.checks.baseline = original;
    for (const [attribute, amount, title, label] of [['intelligence', 2, 'Prism Clear Thought', 'Clear Thought'], ['spirit', -2, 'Prism Spirit Burden', 'Spirit Burden']]) {
      const score = original.effective[attribute], name = 'Prism ' + attribute + ' Bolt';
      step('Baseline supported formula: ' + attribute); await formula(target, gm, name, attribute, score, false);
      const before = actors.clone(host.room.gameState.maps), targetBefore = await view(target);
      const d = await admitted(source, title, 'ally', 'character');
      await d.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true }).click(); await d.getByText(/Awaiting GM/).first().waitFor();
      assert.deepEqual(host.room.gameState.maps, before, 'approval never pays or installs');
      if (amount > 0) {
        const s = target.locator('summary').filter({ hasText: /notices and voluntary proposals/ }); if (!await s.evaluate(e => e.parentElement.open)) await s.click();
        const r = target.getByRole('region', { name: 'Target Stunned notices', exact: true }); await r.getByRole('button', { name: 'Refresh original target proposals', exact: true }).click();
        await r.getByRole('button', { name: 'Accept this exact effect bundle', exact: true }).click();
      }
      const card = await gmConfirm(gm, title); save(attribute + '-gm.aria.yml', await card.ariaSnapshot());
      await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
      await until(() => token().state.conditions.length === 1, attribute + ' install');
      await d.getByText(/^Accepted/).first().waitFor(); await d.getByRole('button', { name: 'Close', exact: true }).click();
      await until(async() => (await view(target)).effective[attribute] === score + amount, attribute + ' effective');
      const changed = await view(target); report.checks[attribute] = { before: score, after: changed.effective[attribute], changed };
      assert.deepEqual(changed.stats, original.stats); assert.deepEqual(changed.baseStats, original.baseStats);
      assert.deepEqual(changed.health, targetBefore.health); assert.deepEqual(changed.mana, targetBefore.mana);
      step('Changed supported cast: ' + attribute); await formula(target, gm, name, attribute, score + amount, true);
      const record = token().state.conditions[0];
      step('Reload target via normal fixture bootstrap; no second snapshot or hydration workaround');
      await setup(target, host, 'app-target');
      const reloaded = await view(target); report.checks[attribute].reloaded = reloaded;
      assert.equal(reloaded.effective[attribute], score + amount, 'reload retains effective modifier without corrective sync');
      assert.equal(reloaded.records.filter(r => r.recordId === record.recordId).length, 1);
      await remove(gm, record.recordId, label); await until(async() => (await view(target)).effective[attribute] === score, attribute + ' restoration');
      step('Exact removal restores original formula: ' + attribute); await formula(target, gm, name, attribute, score, false);
      report.checks[attribute].restored = await view(target);
    }
    report.checks.receipts = actors.clone(actors.ledger(host.room).receipts); assert.deepEqual(report.errors, []); report.passed = true;
  } catch (e) { report.failure = e.stack; for (const [role, p] of Object.entries(pages)) save('failure-' + role + '.aria.yml', await p.locator('body').ariaSnapshot().catch(() => 'unavailable')); throw e; }
  finally { save('result.json', report); await browser.close(); await host.stop(); }
}
main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
