// Actual optimized production App: A3 producer only, normal A1 admission, never creature casting.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.A3_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External A3_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture');
const { setup } = require('../p9/integration/app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const pure = require('../../src/services/authoredAbility');
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const report = { checks: {}, errors: [], limits: ['Actual optimized App and registered backend; provider authentication/ownership/lease/cloud fixture boundaries. No creature execution, live Firebase, deployment, physical tablet or second-device certification.'] };
const wizard = page => page.locator('.creature-wizard-layout');
async function openBestiary(page) {
  await page.getByRole('button', { name: 'Tools', exact: true }).click();
  await page.getByRole('button', { name: 'Library L', exact: true }).click();
  await page.getByRole('button', { name: 'Open Bestiary', exact: true }).click();
}
async function tab(page, name) { await page.locator('.library-window').getByRole('button', { name, exact: true }).click(); }
async function cardAction(page, name, action) {
  await page.locator('.creature-library').getByPlaceholder('Search...', { exact: true }).fill(name);
  await page.locator('.creature-card-wrapper').filter({ hasText: name }).first().click({ button: 'right' });
  await page.getByText(action, { exact: true }).last().click();
}
async function saved(page, name) { return page.evaluate(name => S('creatureStore').getState().creatures.find(c => c.name === name), name); }
async function finish(page) { await wizard(page).getByRole('button', { name: '5 Shop Config', exact: true }).click(); await wizard(page).getByRole('button', { name: /^Save Creature/ }).click(); await wizard(page).waitFor({ state: 'detached' }); }
async function inspect(page, name) {
  await cardAction(page, name, 'Inspect');
  const view = page.locator('.creature-inspect-container'); await view.waitFor();
  await page.getByRole('button', { name: 'Abilities & Spells', exact: true }).last().click();
  const region = page.getByRole('region', { name: 'Creature activated ability', exact: true }); await region.waitFor();
  assert.equal(await region.getByRole('button', { name: /Cast|Use .*ability/ }).count(), 0);
  return region;
}
async function closeInspect(page) { await page.locator('.wow-window').filter({ has: page.locator('.creature-inspect-container') }).getByRole('button', { name: 'Close', exact: true }).click(); }
async function author(page, config) {
  await tab(page, 'Create New'); await wizard(page).locator('#creature-name').fill(config.creature);
  await wizard(page).getByRole('button', { name: '3 Abilities', exact: true }).click();
  const add = wizard(page).getByRole('button', { name: 'Add activated ability', exact: true }); await add.focus(); await add.press('Enter');
  await wizard(page).getByLabel('Ability name', { exact: true }).fill(config.name);
  await wizard(page).getByRole('combobox', { name: 'Effect', exact: true }).selectOption(config.kind);
  await wizard(page).getByLabel('Formula', { exact: true }).fill(config.formula);
  for (const [label, value] of [['AP price', config.ap], ['Mana price', config.mana], ['Range (ft)', config.range]]) await wizard(page).getByLabel(label, { exact: true }).fill(String(value));
  assert.equal(await wizard(page).getByRole('button', { name: /^Next:/ }).isDisabled(), true);
  if (config.kind === 'healing') {
    // Actual section unmount/reopen must retain this exact unfinished definition/values.
    await tab(page, 'Library'); await tab(page, 'Create New');
    assert.equal(await wizard(page).getByLabel('Ability name', { exact: true }).inputValue(), config.name);
    report.checks.unfinishedReopen = true;
  }
  const keep = wizard(page).getByRole('button', { name: 'Keep ability on creature', exact: true }); await keep.focus(); await keep.press('Enter');
  assert.equal(await wizard(page).getByRole('button', { name: 'Edit activated ability', exact: true }).evaluate(el => el === document.activeElement), true);
  save(`${config.kind}-editor.aria.yml`, await wizard(page).ariaSnapshot());
  if (config.kind === 'healing') for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }]) {
    await page.setViewportSize(viewport);
    const region = page.getByRole('region', { name: 'Creature ability authoring', exact: true }); const bounds = await region.evaluate(el => ({ scroll: el.scrollWidth, width: el.clientWidth, rect: el.getBoundingClientRect().toJSON() }));
    assert.ok(bounds.scroll <= bounds.width + 1); assert.ok(bounds.rect.x >= 0 && bounds.rect.right <= viewport.width);
    save(`layout-${viewport.width}.json`, bounds); await page.screenshot({ path: path.join(out, `editor-${viewport.width}.png`) });
  }
  await page.setViewportSize({ width: 1440, height: 1000 }); await finish(page);
  const creature = await saved(page, config.creature); assert.ok(creature?.authoredAbility);
  const mapped = pure.definitionFromWizard(creature.authoredAbility.record, { roomId: 'preview', classId: 'arcanoneer', definitionVersion: 1 }); assert.equal(mapped.ok, true);
  assert.deepEqual(mapped.definition.resourceCost, { actionPoints: config.ap, mana: config.mana }); assert.equal(mapped.definition.targeting.rangeFeet, config.range);
  await cardAction(page, config.creature, 'Edit'); await wizard(page).getByRole('button', { name: '3 Abilities', exact: true }).click();
  await wizard(page).getByRole('button', { name: 'Edit activated ability', exact: true }).click();
  assert.equal(await wizard(page).getByLabel('Ability name', { exact: true }).inputValue(), config.name);
  assert.equal(await wizard(page).getByLabel('Range (ft)', { exact: true }).inputValue(), String(config.range));
  await wizard(page).getByRole('button', { name: 'Cancel ability edit', exact: true }).click(); await finish(page);
  assert.deepEqual((await saved(page, config.creature)).authoredAbility, creature.authoredAbility);
  const region = await inspect(page, config.creature);
  await region.getByRole('button', { name: 'Admit this saved version', exact: true }).click(); await region.getByText(/Admitted for immediate damage\/healing/).waitFor();
  save(`${config.kind}-admitted.aria.yml`, await region.ariaSnapshot()); await closeInspect(page);
  return creature;
}
async function main() {
  report.sourceBefore = require('./record-creature-evidence.cjs').snapshot();
  const host = await require('../p9/integration/app-server.cjs').start();
  const browser = await chromium.launch({ channel: 'chrome', headless: true }); let gm;
  try {
    gm = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); gm.on('pageerror', e => report.errors.push(e.message)); await setup(gm, host.url, 'app-gm');
    const before = JSON.stringify({ tokens: host.room.gameState.maps['app-hall'].tokens, pcs: host.room.gameState.maps['app-hall'].characterTokens });
    const receipts = actors.ledger(host.room).receipts.length;
    await openBestiary(gm);
    const damage = await author(gm, { creature: 'Witness Finch', name: 'Finch Spark', kind: 'damage', formula: '1d6+2', ap: 1, mana: 3, range: 30 });
    const healing = await author(gm, { creature: 'Witness Doe', name: 'Doe Mending', kind: 'healing', formula: '1d8+1', ap: 0, mana: 0, range: 0 });
    report.checks.actualDamageHealingSaveReopenAdmission = { damage, healing };
    // Use the actual production placement method; library saves must leave this snapshot intact.
    await gm.evaluate(creature => S('creatureStore').getState().addCreatureToken(creature, { x: 650, y: 450 }, false, 'a3-placed', false, 'app-hall'), healing);
    const instanceBefore = await gm.evaluate(() => S('creatureStore').getState().tokens.find(t => t.id === 'a3-placed').authoredAbility);
    const registryBefore = JSON.parse(JSON.stringify(host.room.gameState.authoredSpellRegistry));
    await cardAction(gm, healing.name, 'Edit'); await wizard(gm).getByRole('button', { name: '3 Abilities', exact: true }).click();
    await wizard(gm).getByRole('button', { name: 'Edit activated ability', exact: true }).click();
    await wizard(gm).getByLabel('Ability name', { exact: true }).fill('Doe Mending revised'); await wizard(gm).getByLabel('Formula', { exact: true }).fill('1d8+2');
    await wizard(gm).getByRole('button', { name: 'Keep ability on creature', exact: true }).click(); await finish(gm);
    const revised = await saved(gm, healing.name); assert.equal(revised.authoredAbility.record.authoredDefinitionId, healing.authoredAbility.record.authoredDefinitionId);
    assert.deepEqual(await gm.evaluate(() => S('creatureStore').getState().tokens.find(t => t.id === 'a3-placed').authoredAbility), instanceBefore);
    assert.deepEqual(host.room.gameState.authoredSpellRegistry, registryBefore);
    const region = await inspect(gm, healing.name); await region.getByText(/Changed since admitted/).waitFor();
    await region.getByRole('button', { name: 'Admit this saved version', exact: true }).click(); await region.getByText(/version 2/).waitFor();
    save('v2-admission.aria.yml', await region.ariaSnapshot()); await closeInspect(gm);
    report.checks.explicitV2PlacedV1Isolated = { instanceBefore, revised, registry: host.room.gameState.authoredSpellRegistry };
    assert.equal(JSON.stringify({ tokens: host.room.gameState.maps['app-hall'].tokens, pcs: host.room.gameState.maps['app-hall'].characterTokens }), before);
    assert.equal(actors.ledger(host.room).receipts.length, receipts);
    assert.equal(await gm.evaluate(() => __outbound.filter(e => ['actor_consequence', 'actor_spell_approve'].includes(e.event)).length), 0);
    report.checks.noPaymentHpReceiptOrCreatureExecution = true;
    report.passed = true;
  } catch (e) { report.failure = e.stack; if (gm) { save('failure.aria.yml', await gm.locator('body').ariaSnapshot()); await gm.screenshot({ path: path.join(out, 'failure.png') }); } throw e; }
  finally { report.sourceAfter = require('./record-creature-evidence.cjs').snapshot(); save('result.json', report); await browser.close(); await host.stop(); }
}
main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
