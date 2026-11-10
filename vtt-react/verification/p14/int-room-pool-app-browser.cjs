/* global S */
// INT-only integration acceptance. Real inventory Equip / Character Sheet Unequip controls;
// no updateEquipment evaluation. Reuse reviewed Wizard/bootstrap helpers read-only.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), crypto = require('crypto'), Module = require('module');
const { chromium } = require('playwright');
const out = process.env.POOL_APP_OUTPUT;
assert(out && path.isAbsolute(out) && process.env.APP_BUILD_DIR);
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture'); process.env.ATTR_OUTPUT = path.join(out, 'producer');
const fixtures = require('./m4b-fixture-characters.cjs');
const stats = { strength: 10, agility: 10, constitution: 12, intelligence: 14, spirit: 10, charisma: 10 };
fixtures.characters['app-target'] = { ...JSON.parse(JSON.stringify(fixtures.characters['app-target'])), race: 'human', subrace: 'skald_human', ancestry: null, background: '',
  stats: { ...stats }, baseStats: { ...stats }, levelUpHistory: {}, buffs: [], debuffs: [],
  health: { current: 45, max: 85 }, mana: { current: 45, max: 64 }, actionPoints: { current: 2, max: 4 }, tempHealth: 0, tempMana: 0, tempActionPoints: 0,
  classResource: { type: 'elementalSpheres', spheres: [], current: 0, max: 12 }, class_spells: { known_spells: [] } };
const helperPath = path.join(__dirname, 'attribute-modifier-app-browser.cjs');
let source = fs.readFileSync(helperPath, 'utf8').replace(/\r\n/g, '\n');
assert(source.endsWith('main();\n'));
source = source.slice(0, -'main();\n'.length).replace("selectOption('agility')", "selectOption('intelligence')")
  .replace("attribute: 'agility', amount, label", "attribute: 'intelligence', amount, label")
  .replace('store.getState().loadCharacter(fixtureCharacter.id);', "S('gameStore').setState({ isInMultiplayer: false }); await store.getState().loadCharacter(fixtureCharacter.id); S('gameStore').setState({ isInMultiplayer: true });")
  .replace('if (fixtureCharacter) { const again = await __actors.refreshActorSnapshot(); if (!again.success) throw Error(JSON.stringify(again)); }', '// No corrective snapshot after character load.');
const helper = new Module(helperPath, module); helper.filename = helperPath; helper.paths = module.paths;
helper._compile(source + '\nmodule.exports = { setup, authorAttribute, authorFormula, reopenAndAdmit, gmConfirm };', helperPath);
const { setup, authorAttribute, authorFormula, reopenAndAdmit, gmConfirm } = helper.exports;
const actors = require('../../../server/services/actorConsequences');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { passed: false, steps: [], checks: {}, errors: [], qualifications: [
  'Production optimized App and registered backend. Identity/auth/provider/ownership/lease/cloud are fixtures; temporary accepted-live room, no live Firebase or physical-table claim.',
  'Complete deterministic M4B characters through production loadCharacter. Explicit human/skald_human, no origin: stored INT14/CON12, effective INT12/CON13. Expected stored HP45/85 (floor((13*5+30)*0.9), Mortal Frailty), mana45/64 (12*5+4), AP2/4. Room target initialized to the same complete fixture before actions.',
  'Neutral accessory delivered once via production addItemFromLibrary (fixture delivery). Every recalculation is ordinary inventory Equip or Character Sheet Unequip to Inventory; evaluation afterwards is inspection only.',
  'Bootstrap and reload load the same complete target through production loadCharacter in personal mode, then re-enter the fixture room (the released formula-witness pattern), permitting normal resource initialization. No second snapshot, corrective sync, manual room-effect hydration or pool write is injected.',
  'Personal effects and INT equipment bonuses retain focused regression evidence; this App journey uses a stat-neutral accessory to isolate room INT from ordinary equipment recalculation.'
] };
const step = s => { report.steps.push(s); console.log(s); save('progress.json', report); };
const wait = async(fn, label) => { for (let i = 0; i < 100; i++) { if (await fn()) return; await new Promise(r => setTimeout(r, 200)); } throw Error('Timed out: ' + label); };
const view = p => p.evaluate(() => { const s = S('characterStore').getState(), c = S('conditionStore').getState(); return { health: s.health, mana: s.mana, actionPoints: s.actionPoints,
  effective: s.getTotalStatsWithEffects(c.getActiveEffects('buff'), c.getActiveEffects('debuff')).intelligence,
  stats: s.stats, baseStats: s.characters.find(r => r.id === s.currentCharacterId)?.baseStats,
  records: [...c.activeBuffs, ...c.activeDebuffs].filter(r => r.target?.tokenId === 'ally') }; });
const expected = { health: { current: 45, max: 85 }, mana: { current: 45, max: 64 }, actionPoints: { current: 2, max: 4 } };
function check(v, score) { assert.equal(v.effective, score); for (const [key, value] of Object.entries(expected)) assert.deepEqual(v[key], value, 'Stored ' + key + ' independent of room INT'); assert.deepEqual(v.stats, stats); assert.deepEqual(v.baseStats, stats); }
async function cast(p, name, target) {
  const summary = p.locator('summary').filter({ hasText: /^Admitted abilities$/ }); if (!await summary.evaluate(e => e.parentElement.open)) await summary.click();
  const r = p.getByRole('region', { name: 'Admitted abilities', exact: true }); await r.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click();
  await r.locator('.p9-admitted-row').filter({ hasText: name }).getByRole('button', { name: 'Use admitted ability', exact: true }).click();
  const d = p.getByRole('dialog', { name: 'Supported spell cast', exact: true }), select = d.getByRole('combobox', { name: 'Target', exact: true });
  const value = await select.locator('option').evaluateAll((options, id) => options.map(o => o.value).find(v => { try { return JSON.parse(v).tokenId === id; } catch (_) { return v.endsWith(':' + id); } }), target);
  assert(value); await select.selectOption(value); return d;
}
async function formula(p, score, tag) {
  const d = await cast(p, 'Pool INT Probe', 'B'); const text = await d.innerText(); assert(text.includes('intelligence ' + score), 'Actual formula panel reads effective INT');
  save(tag + '-formula.aria.yml', await d.ariaSnapshot()); await d.getByRole('button', { name: 'Close', exact: true }).click();
}
const ITEM = 'Pool Witness Ribbon';
async function equipmentCycle(p, score, tag) {
  await p.getByRole('button', { name: /^Character/ }).first().click(); await p.getByRole('button', { name: /^Inventory/ }).first().click();
  const inventory = p.locator('.inventory-window-content'); await inventory.waitFor();
  await inventory.locator('[draggable="true"]').first().click({ button: 'right' }); await p.getByText('Equip', { exact: true }).first().click();
  await p.waitForFunction(n => Object.values(S('characterStore').getState().equipment).some(i => i?.name === n), ITEM);
  const equipped = await view(p); report.checks[tag + '-equipped'] = equipped; save('progress.json', report); check(equipped, score);
  await p.getByRole('dialog', { name: 'Inventory', exact: true }).getByRole('button', { name: 'Close', exact: true }).click();
  await p.keyboard.press('c'); const sheet = p.getByRole('dialog', { name: 'Character Sheet', exact: true }); await sheet.waitFor();
  await sheet.getByRole('button', { name: 'Info', exact: true }).click();
  await p.locator('.gear-slot img[alt="' + ITEM + '"]').first().click({ button: 'right' }); await p.getByRole('button', { name: /Unequip to Inventory/ }).click();
  await p.waitForFunction(n => !Object.values(S('characterStore').getState().equipment).some(i => i?.name === n), ITEM);
  check(await view(p), score); save(tag + '-equipment.aria.yml', await sheet.ariaSnapshot());
  await sheet.getByRole('button', { name: 'Close', exact: true }).click();
}
async function main() {
  const host = await require('./m4b-catalogue-app-server.cjs').start();
  const token = () => host.room.gameState.maps['app-hall'].characterTokens.ally;
  token().character = JSON.parse(JSON.stringify(fixtures.characters['app-target']));
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_spell_approve', 'actor_spell_list', 'actor_bind', 'join_room']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const browser = await chromium.launch({ channel: 'chrome', headless: true }), pages = {};
  try {
    for (const role of ['gm', 'owner', 'target']) { pages[role] = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' }); pages[role].on('pageerror', e => report.errors.push({ role, message: e.message })); }
    const { gm, owner, target } = pages;
    await setup(gm, host, 'app-gm');
    step('Wizard author/save/reopen/admit INT −2 and formula probe');
    await authorAttribute(gm, 'Pool Dulling Mist', -2, 'Pool Dulled'); await reopenAndAdmit(gm, 'Pool Dulling Mist', 'martyr');
    await setup(gm, host, 'app-gm'); await authorFormula(gm, 'Pool INT Probe', '1d6 + intelligence'); await reopenAndAdmit(gm, 'Pool INT Probe');
    await setup(gm, host, 'app-gm'); await setup(owner, host, 'app-owner'); await setup(target, host, 'app-target');
    await target.evaluate(item => { S('inventoryStore').setState({ items: [] }); S('inventoryStore').getState().addItemFromLibrary(item); },
      { id: 'pool-neutral-ribbon', name: ITEM, type: 'accessory', quality: 'common', width: 1, height: 1, weight: 0, slots: ['trinket1'], iconId: 'inv_misc_ribbon_01' });
    step('Baseline formula and ordinary equipment controls, expected stored pools');
    report.checks.baseline = await view(target); save('progress.json', report); check(report.checks.baseline, 12); await formula(target, 12, 'baseline'); await equipmentCycle(target, 12, 'baseline');
    const before = actors.clone(host.room.gameState.maps), d = await cast(owner, 'Pool Dulling Mist', 'ally');
    await d.getByRole('button', { name: 'Approve exact price, target, effects and duration', exact: true }).click(); await d.getByText(/Awaiting GM/).first().waitFor();
    assert.deepEqual(host.room.gameState.maps, before, 'approval neither pays nor installs');
    const card = await gmConfirm(gm, 'Pool Dulling Mist'); await card.getByRole('button', { name: 'Confirm payment, result and effect together', exact: true }).click();
    await wait(() => token().state.conditions.length === 1, 'INT installed'); await d.getByText(/^Accepted/).first().waitFor(); await d.getByRole('button', { name: 'Close', exact: true }).click();
    await wait(async() => (await view(target)).effective === 10, 'effective INT10');
    step('INT −2 active: formula10; ordinary Equip/Unequip leaves stored mana45/64');
    await formula(target, 10, 'active'); await equipmentCycle(target, 10, 'active');
    const record = token().state.conditions[0]; report.checks.active = await view(target); check(report.checks.active, 10);
    step('Reload complete target, no corrective sync; formula and ordinary equipment again');
    await setup(target, host, 'app-target'); check(await view(target), 10); await formula(target, 10, 'reload'); await equipmentCycle(target, 10, 'reload');
    report.checks.reloaded = await view(target); assert.equal(report.checks.reloaded.records.filter(r => r.recordId === record.recordId).length, 1);
    step('GM exact removal; formula12 restored, ordinary equipment leaves stored pools unchanged');
    const controls = gm.getByRole('region', { name: 'Actor attachment and consequences', exact: true });
    await controls.getByRole('combobox', { name: 'Exact room attachment', exact: true }).selectOption('character:ally'); await controls.getByRole('button', { name: 'Edit selected shared conditions', exact: true }).click();
    const ed = gm.getByRole('dialog', { name: 'Edit selected shared conditions editor', exact: true }); await ed.getByRole('button', { name: `Remove Pool Dulled instance ${record.recordId}`, exact: true }).click();
    await ed.getByRole('button', { name: 'Close shared condition editor', exact: true }).click();
    await wait(async() => (await view(target)).effective === 12, 'restoration'); await formula(target, 12, 'removed'); await equipmentCycle(target, 12, 'removed');
    report.checks.restored = await view(target); check(report.checks.restored, 12);
    report.checks.receipts = actors.ledger(host.room).receipts.map(actors.publicReceipt); assert.deepEqual(report.errors, []); report.passed = true;
  } catch (e) { report.failure = e.stack; for (const [role, p] of Object.entries(pages)) save('failure-' + role + '.aria.yml', await p.locator('body').ariaSnapshot().catch(() => 'unavailable')); throw e; }
  finally { report.build = process.env.APP_BUILD_DIR; report.assetManifestSha256 = crypto.createHash('sha256').update(fs.readFileSync(path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json'))).digest('hex'); save('result.json', report); await browser.close(); await host.stop(); }
}
main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
