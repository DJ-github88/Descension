// P14-A2: actual optimized App Item Wizard/save/reopen/inventory producer → existing A1/P9/P7.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.A2_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External A2_OUTPUT and APP_BUILD_DIR required');
process.env.APP_BUILD_DIR = path.resolve(process.env.APP_BUILD_DIR);
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture');
const { setup } = require('../p9/integration/app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const pure = require('../../src/services/authoredAbility');
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const report = { checks: {}, errors: [], limits: ['Optimized production App and registered backend; provider authentication, canonical ownership, lease/cloud are fixtures. Temporary-room live-only receipts. No deployment/physical-tablet/second-device claim.'] };
const wizard = page => page.locator('.item-wizard-modal');
const itemRegion = (page, item) => page.getByRole('region', { name: `Item ability for ${item.name}`, exact: true });
async function openArmory(page) {
  await page.getByRole('button', { name: 'Tools', exact: true }).click();
  await page.getByRole('button', { name: 'Library L', exact: true }).click();
  const armory = page.getByRole('button', { name: 'Open Armory', exact: true });
  if (await armory.count()) await armory.click();
  await page.getByRole('button', { name: 'Create Item', exact: true }).waitFor();
}
async function closeArmory(page) {
  // The section header's Close first goes back to the bookshelf; close the library next.
  await page.locator('.library-window').getByRole('button', { name: 'Close', exact: true }).click();
  if (await page.locator('.library-window').count()) await page.locator('.library-window').getByRole('button', { name: 'Close', exact: true }).click();
}
async function savedItem(page, name) { return page.evaluate(name => S('itemStore').getState().items.find(i => i.name === name), name); }
async function selectItem(page, name) {
  await page.getByPlaceholder('Search...', { exact: true }).fill(name);
  const item = page.getByRole('button', { name: `Inspect ${name}`, exact: true }); await item.focus(); await item.press('Enter');
  const region = itemRegion(page, { name });
  const summary = page.locator('summary').filter({ hasText: `${name} —` }); await summary.click(); await region.waitFor(); return region;
}
async function author(page, config) {
  await page.getByRole('button', { name: 'Create Item', exact: true }).click();
  await wizard(page).getByText('Accessory', { exact: true }).first().click();
  await wizard(page).getByRole('button', { name: 'Basic Info', exact: true }).click();
  await wizard(page).getByPlaceholder('Enter item name...', { exact: true }).fill(config.item);
  await wizard(page).getByRole('button', { name: 'Add activated ability', exact: true }).click();
  await wizard(page).getByLabel('Ability name', { exact: true }).fill(config.name);
  await wizard(page).getByLabel('Description', { exact: true }).fill('Verification-only separate activated definition; item requirements GM-managed.');
  await wizard(page).getByRole('combobox', { name: 'Effect', exact: true }).selectOption(config.kind);
  await wizard(page).getByLabel('Formula', { exact: true }).fill(config.formula);
  for (const [label, value] of [['AP price', config.ap], ['Mana price', config.mana], ['Range (ft)', config.range]]) await wizard(page).getByLabel(label, { exact: true }).fill(String(value));
  assert.equal(await wizard(page).getByRole('button', { name: /^Next/ }).isDisabled(), true);
  await wizard(page).getByRole('button', { name: 'Keep ability on item', exact: true }).click();
  save(`${config.kind}-editor.aria.yml`, await wizard(page).ariaSnapshot());
  if (config.kind === 'healing') for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }]) {
    await page.setViewportSize(viewport); const box = await wizard(page).boundingBox(); assert.ok(box.x >= 0 && box.x + box.width <= viewport.width);
    await page.screenshot({ path: path.join(out, `editor-${viewport.width}.png`) });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await wizard(page).getByRole('button', { name: 'Appearance', exact: true }).click();
  await wizard(page).getByRole('button', { name: /Create Item$/ }).click(); await wizard(page).waitFor({ state: 'detached' });
  const item = await savedItem(page, config.item); assert.ok(item?.authoredAbility?.record);
  const record = item.authoredAbility.record, mapped = pure.definitionFromWizard(record, { roomId: 'preview', classId: 'arcanoneer', definitionVersion: 1 });
  assert.equal(mapped.ok, true, JSON.stringify(mapped)); assert.equal(record.resourceCost.actionPoints, config.ap); assert.equal(record.targetingConfig.rangeDistance, config.range);
  save(`${config.kind}-saved.json`, item);
  // Actual library Edit → actual Item Wizard reopen → unchanged save.
  await page.getByPlaceholder('Search...', { exact: true }).fill(config.item);
  await page.getByRole('button', { name: `Inspect ${config.item}`, exact: true }).click({ button: 'right' });
  await page.getByText('Edit Item', { exact: true }).click();
  await wizard(page).getByRole('button', { name: 'Basic Info', exact: true }).click();
  await wizard(page).getByRole('button', { name: 'Edit activated ability', exact: true }).click();
  assert.equal(await wizard(page).getByLabel('Ability name', { exact: true }).inputValue(), config.name);
  assert.equal(await wizard(page).getByLabel('AP price', { exact: true }).inputValue(), String(config.ap));
  assert.equal(await wizard(page).getByLabel('Range (ft)', { exact: true }).inputValue(), String(config.range));
  await wizard(page).getByRole('button', { name: 'Cancel ability edit', exact: true }).click();
  await wizard(page).getByRole('button', { name: 'Appearance', exact: true }).click(); await wizard(page).getByRole('button', { name: /Create Item$/ }).click();
  assert.deepEqual((await savedItem(page, config.item)).authoredAbility, item.authoredAbility);
  const region = await selectItem(page, config.item);
  const admission = region.getByRole('region', { name: `Room admission for ${config.name}`, exact: true });
  await admission.getByRole('button', { name: 'Admit this saved version', exact: true }).click();
  await admission.getByText(/Admitted for immediate damage\/healing/).waitFor();
  save(`${config.kind}-admission.aria.yml`, await region.ariaSnapshot());
  return item;
}
async function openInventory(page) {
  await page.getByRole('button', { name: 'Character', exact: true }).click(); await page.getByRole('button', { name: 'Inventory B', exact: true }).click();
  await page.getByRole('region', { name: 'Inventory item abilities', exact: true }).waitFor();
}
async function launchItem(page, item) {
  const region = itemRegion(page, item);
  const summary = page.locator('summary').filter({ hasText: `${item.name} —` });
  if (!(await region.isVisible())) await summary.click();
  await region.getByRole('button', { name: 'Refresh item ability admission', exact: true }).click();
  const selector = region.getByRole('combobox', { name: 'Saved ability version', exact: true }); await selector.waitFor();
  const value = await selector.locator('option:not([value=""]):not([disabled])').first().getAttribute('value'); await selector.selectOption(value);
  await region.getByRole('button', { name: 'Use item ability', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Supported spell cast', exact: true }); await dialog.waitFor(); return dialog;
}
async function reconnect(page) {
  await page.evaluate(async () => {
    const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes('[roomRejoin] subscriber failed'));
    Object.values(__req(pair[0])).find(fn => typeof fn === 'function' && fn.toString().includes('room_joined'))(__socket);
    __socket.disconnect(); const connected = new Promise(r => __socket.once('connect', r)); __socket.connect(); await connected;
    const fixture = await fetch('/integration-fixture.json').then(r => r.json()); const joined = new Promise(r => __socket.once('room_joined', r));
    __socket.emit('join_room', { roomId: fixture.roomId, playerName: 'app-owner', password: '' }); await joined; await __actors.refreshActorSnapshot();
  });
}
async function main() {
  report.sourceBefore = require('./record-item-evidence.cjs').snapshot();
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_spell_approve', 'actor_spell_list', 'actor_authored_admit', 'actor_authored_list', 'actor_authored_revoke', 'join_room']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const browser = await chromium.launch({ channel: 'chrome', headless: true }), pages = [];
  try {
    const gm = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); pages.push(gm); gm.on('pageerror', e => report.errors.push({ role: 'gm', error: e.message })); await setup(gm, host.url, 'app-gm');
    await openArmory(gm);
    const damage = await author(gm, { item: 'Witness Quill', name: 'Quill Spark', kind: 'damage', formula: '1d6+2', ap: 1, mana: 3, range: 30 });
    const healing = await author(gm, { item: 'Witness Ribbon', name: 'Ribbon Mending', kind: 'healing', formula: '1d8+1', ap: 0, mana: 0, range: 0 });
    assert.notEqual(damage.authoredAbility.record.authoredDefinitionId, healing.authoredAbility.record.authoredDefinitionId);
    report.checks.realEditorSaveReopen = { damage, healing }; await closeArmory(gm);
    const owner = await browser.newPage({ viewport: { width: 1440, height: 1000 } }), observer = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); pages.push(owner, observer);
    owner.on('pageerror', e => report.errors.push({ role: 'owner', error: e.message })); await setup(owner, host.url, 'app-owner'); await setup(observer, host.url, 'app-observer');
    await owner.evaluate(() => { const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes('[roomRejoin] subscriber failed')); if (!pair) throw Error('Missing production rejoin registration'); Object.values(__req(pair[0])).find(fn => typeof fn === 'function' && fn.toString().includes('room_joined'))(__socket); });
    // Delivery is fixture setup, using the production standard library-copy method, never a separate UI mount.
    await owner.evaluate(items => { S('inventoryStore').setState({ items: [] }); for (const item of items) S('inventoryStore').getState().addItemFromLibrary(item); }, [damage, healing]);
    await openInventory(owner);
    const pc = () => actors.locate(host.room, host.refs.pc).token.character;
    for (const [item, target, mode, sides] of [[damage, 'creature:app-hall:B', 'physical', 6], [healing, 'character:app-hall:pc', 'digital', 8]]) {
      let dialog = await launchItem(owner, item); await dialog.getByRole('combobox', { name: 'Target', exact: true }).selectOption(target);
      if (mode === 'physical') { await dialog.getByLabel(`d${sides} face 1`, { exact: true }).fill('4'); await dialog.getByRole('button', { name: 'Record physical roll', exact: true }).click(); }
      else await dialog.getByRole('button', { name: `Roll 1d${sides} once`, exact: true }).click();
      save(`${mode}-owner.aria.yml`, await dialog.ariaSnapshot());
      if (mode === 'physical') await owner.evaluate(() => {
        const emit = __socket.emit.bind(__socket); let dropped = false;
        __socket.emit = (event, ...args) => { if (!dropped && event === 'actor_spell_approve' && typeof args[1] === 'function') { dropped = true; args[1] = () => {}; } return emit(event, ...args); };
      });
      const before = JSON.stringify(pc()); await dialog.getByRole('button', { name: 'Approve price and send to GM', exact: true }).click();
      const name = item.authoredAbility.record.name, card = gm.locator('.p9-gm-card').filter({ hasText: name }); await card.waitFor(); assert.equal(JSON.stringify(pc()), before, 'approval spends nothing');
      const pending = require('../../../server/services/spellPayments').listAll(host.room).find(e => e.approval.spell.name === name), original = JSON.parse(JSON.stringify(pending.approval));
      if (mode === 'physical') await dialog.getByText('Outcome unknown. Check this same approval; it will not reroll or pay twice.', { exact: true }).waitFor();
      await dialog.getByRole('button', { name: 'Close', exact: true }).click();
      await owner.locator('summary').filter({ hasText: `${item.name} —` }).click();
      dialog = await launchItem(owner, item);
      assert.equal(await dialog.getByRole('button', { name: 'Approve price and send to GM', exact: true }).count(), 0);
      assert.equal(await dialog.getByRole('button', { name: `Roll 1d${sides} once`, exact: true }).count(), 0);
      assert.deepEqual(require('../../../server/services/spellPayments').listAll(host.room).find(e => e.approval.spell.name === name).approval, original);
      if (mode === 'physical') {
        await dialog.getByRole('button', { name: 'Close', exact: true }).click(); await setup(owner, host.url, 'app-owner'); await openInventory(owner); dialog = await launchItem(owner, item);
        await reconnect(owner); await dialog.getByRole('button', { name: 'Check this same approval', exact: true }).click();
        assert.deepEqual(await owner.evaluate(() => __outbound.filter(x => x.event === 'actor_spell_approve').at(-1).payload), original);
        assert.equal(JSON.stringify(pc()), before, 'unknown/reopen/reload/rejoin/original check spend nothing');
        report.checks.lostOwnerAckPendingReloadReconnectExactApproval = original;
      }
      await card.getByRole('checkbox').check(); await card.getByLabel(/^Final/).fill(mode === 'physical' ? '6' : '100');
      if (mode === 'digital') await card.getByLabel(/^Reason/).fill('GM healing cap witness');
      if (mode === 'physical') await gm.evaluate(() => {
        const listeners = __socket.listeners('actor_consequence_accepted'); __socket.removeAllListeners('actor_consequence_accepted');
        __socket.on('actor_consequence_accepted', r => { if (String(r.receipt?.adjudication?.definitionVersionOrHash).startsWith('authored-immediate:v1/')) return; listeners.forEach(fn => fn(r)); });
        const emit = __socket.emit.bind(__socket); __socket.emit = (e, ...args) => { if (e === 'actor_consequence' && typeof args[1] === 'function') args[1] = () => {}; return emit(e, ...args); };
      });
      await card.getByRole('button', { name: 'Accept one consequence', exact: true }).click(); await dialog.getByText(/Accepted · /).first().waitFor();
      const receipt = actors.ledger(host.room).receipts.at(-1); assert.deepEqual(JSON.parse(receipt.adjudication.chosenResult).roll, original.roll);
      assert.ok((await observer.locator('.fct-chip').allTextContents()).length); save(`${mode}-observer.aria.yml`, await observer.getByRole('region', { name: 'Accepted combat results', exact: true }).ariaSnapshot());
      if (mode === 'physical') {
        await gm.getByText('Outcome unknown. Check this same command; it will not be rebuilt or resubmitted with new values.', { exact: true }).waitFor();
        const emitted = await gm.evaluate(() => __outbound.filter(x => x.event === 'actor_consequence').at(-1).payload), count = actors.ledger(host.room).receipts.length;
        assert.equal(await card.getByRole('button', { name: 'Accept one consequence', exact: true }).isDisabled(), true);
        await setup(gm, host.url, 'app-gm'); await gm.getByRole('button', { name: 'Check same command', exact: true }).first().click(); await gm.getByText(/Accepted · /).first().waitFor();
        assert.deepEqual(await gm.evaluate(() => __outbound.filter(x => x.event === 'actor_consequence').at(-1).payload), emitted); assert.equal(actors.ledger(host.room).receipts.length, count);
        assert.equal(await observer.evaluate(id => S('chatStore').getState().notifications.combat.filter(n => n.receiptId?.endsWith(id)).length, receipt.commandId), 1);
        report.checks.lostAckUnknownReloadSameCommand = emitted;
      }
      report.checks[name] = receipt; await dialog.getByRole('button', { name: 'Close', exact: true }).click();
      if (mode === 'physical') { assert.equal(pc().tempActionPoints, 0); assert.equal(pc().actionPoints.current, 2); assert.equal(pc().tempMana, 0); assert.equal(pc().mana.current, 10); }
      else assert.equal(pc().health.current, pc().health.max);
    }
    const count = actors.ledger(host.room).receipts.length;
    await setup(owner, host.url, 'app-owner'); await openInventory(owner); const historical = await launchItem(owner, damage);
    assert.equal(actors.ledger(host.room).receipts.length, count); await historical.getByRole('button', { name: 'Close', exact: true }).click();
    await reconnect(owner);
    assert.equal(actors.ledger(host.room).receipts.length, count); report.checks.itemReopenReloadReconnectNoReplacement = true;
    // Real edit/re-admission cannot mutate installed v1 or the owner's older inventory snapshot.
    await openArmory(gm); await gm.getByPlaceholder('Search...', { exact: true }).fill(healing.name);
    await gm.getByRole('button', { name: `Inspect ${healing.name}`, exact: true }).click({ button: 'right' }); await gm.getByText('Edit Item', { exact: true }).click();
    await wizard(gm).getByRole('button', { name: 'Basic Info', exact: true }).click(); await wizard(gm).getByRole('button', { name: 'Edit activated ability', exact: true }).click();
    await wizard(gm).getByLabel('Ability name', { exact: true }).fill('Ribbon Mending Revised'); await wizard(gm).getByLabel('Formula', { exact: true }).fill('1d8+2');
    await wizard(gm).getByRole('button', { name: 'Keep ability on item', exact: true }).click(); await wizard(gm).getByRole('button', { name: 'Appearance', exact: true }).click(); await wizard(gm).getByRole('button', { name: /Create Item$/ }).click();
    const revised = await savedItem(gm, healing.name); assert.equal(revised.authoredAbility.record.authoredDefinitionId, healing.authoredAbility.record.authoredDefinitionId);
    const installedBefore = JSON.parse(JSON.stringify(host.room.gameState.authoredSpellRegistry.definitions));
    const revisedRegion = await selectItem(gm, healing.name); await revisedRegion.getByRole('button', { name: 'Refresh item ability admission', exact: true }).click();
    assert.equal(await revisedRegion.getByRole('button', { name: 'Use item ability', exact: true }).count(), 0);
    await revisedRegion.getByRole('button', { name: 'Admit this saved version', exact: true }).click(); await revisedRegion.getByText(/Admitted for immediate damage\/healing · version 2/).waitFor();
    assert.deepEqual(host.room.gameState.authoredSpellRegistry.definitions.slice(0, 2), installedBefore);
    const retainedOwnerCopy = await owner.evaluate(id => S('inventoryStore').getState().items.find(i => i.originalItemId === id).authoredAbility, healing.id); assert.deepEqual(retainedOwnerCopy, healing.authoredAbility);
    report.checks.exactEditVersionAndInstanceIsolation = { revised, retainedOwnerCopy };
    // Existing complex/manual source is fixture data, then actual normal Edit/save/reopen must keep it whole.
    const manual = JSON.parse(JSON.stringify(damage)); manual.id = 'manual-item-fixture'; manual.name = 'Manual Witness'; manual.customStorage = { preserve: ['unknown', 0] };
    manual.combatStats.onHitEffects = { enabled: true, customEffects: [{ effectType: 'control', effectConfig: { controlType: 'stun', saveDC: 14, customMetadata: 'preserved' } }] };
    const r = manual.authoredAbility.record; r.effectTypes.push('debuff'); r.authoredDraft.effectTypes.push('debuff'); r.debuffConfig = { custom: 'mixed original' }; r.authoredDraft.debuffConfig = { custom: 'mixed original' };
    await gm.evaluate(item => S('itemStore').getState().addItem(item), manual);
    await gm.getByPlaceholder('Search...', { exact: true }).fill(manual.name); await gm.getByRole('button', { name: `Inspect ${manual.name}`, exact: true }).click({ button: 'right' }); await gm.getByText('Edit Item', { exact: true }).click();
    await wizard(gm).getByRole('button', { name: 'Basic Info', exact: true }).click(); await wizard(gm).getByText(/Unsupported\/manual/).waitFor(); assert.equal(await wizard(gm).getByRole('button', { name: 'Edit activated ability', exact: true }).count(), 0);
    await wizard(gm).getByRole('button', { name: 'Appearance', exact: true }).click(); await wizard(gm).getByRole('button', { name: /Create Item$/ }).click();
    const savedManual = await savedItem(gm, manual.name); assert.deepEqual(savedManual.authoredAbility, manual.authoredAbility); assert.deepEqual(savedManual.combatStats.onHitEffects, manual.combatStats.onHitEffects); assert.deepEqual(savedManual.customStorage, manual.customStorage);
    const manualRegion = await selectItem(gm, manual.name); await manualRegion.getByText(/Unsupported\/manual/).waitFor(); assert.equal(await manualRegion.getByRole('button', { name: 'Use item ability', exact: true }).count(), 0); assert.equal(actors.ledger(host.room).receipts.length, count);
    report.checks.wholeComplexManualSaveReopenNoSpend = savedManual; await closeArmory(gm);
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }]) {
      await owner.setViewportSize(viewport); const r = itemRegion(owner, healing); await owner.locator('summary').filter({ hasText: `${healing.name} —` }).click(); await r.scrollIntoViewIfNeeded();
      save(`inventory-${viewport.width}.aria.yml`, await r.ariaSnapshot()); const box = await r.boundingBox(); assert.ok(box.x >= 0 && box.x + box.width <= viewport.width);
      await owner.screenshot({ path: path.join(out, `inventory-${viewport.width}.png`) }); await owner.locator('summary').filter({ hasText: `${healing.name} —` }).click();
    }
    report.passed = true;
  } catch (error) {
    report.failure = error.stack;
    for (let i = 0; i < pages.length; i++) { save(`failure-${i}.aria.yml`, await pages[i].locator('body').ariaSnapshot().catch(() => 'unavailable')); await pages[i].screenshot({ path: path.join(out, `failure-${i}.png`) }).catch(() => {}); }
    throw error;
  } finally {
    report.sourceAfter = require('./record-item-evidence.cjs').snapshot(); if (JSON.stringify(report.sourceBefore) !== JSON.stringify(report.sourceAfter)) { report.passed = false; report.sourceDrift = true; }
    save('result.json', report); await browser.close(); await host.stop();
  }
}
if (require.main === module) main().then(() => { console.log(JSON.stringify({ passed: true, out })); process.exit(0); }, e => { console.error(e); process.exit(1); });
