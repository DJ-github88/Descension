/* global S */
// PREPARED, NOT RUN. Item ability authoring -> combat: identified-build ordinary-App witness.
// Journey: Spell Wizard authors + saves an immediate healing ability -> Item Wizard (real "Compatible Spell Library definition"
// picker + "Associate library snapshot") -> save item -> reopen via library Edit -> GM admits the saved version from the library
// item panel (template: NO Use control) -> item reaches an owner inventory -> reload -> backpack "Item abilities" entry (exactly one) ->
// owner EQUIPS the item through the normal controls (inventory right-click "Equip" -> "Equip to Trinket") -> the worn item's action is still
// listed exactly once -> owner uses the WORN item's action -> approval -> GM accepts -> payment once + healing -> reload/recovery ->
// refused cases (template Use absent, unsupported/manual item, nothing spent) ->
// SEPARATE check: Item Wizard "Remove activated ability" keeps unrelated item data; the owner's delivered copy is unchanged.
//
// SCOPE (contract A2, docs/MYTHRILL_PROJECT_14_A2_CONTRACT.md): the item association is an authoring/access association only. The item panel
// lists items from the LOCAL inventory/equipment store; that is a UI convenience, NOT server possession or equipment authorization. Authority is
// GM admission of the exact saved definition plus the shared route's primary-owner-PC checks; the GM adjudicates item prerequisites. This witness
// does NOT claim exact-item enforcement or foreign-item security. Equipping is witnessed only to show the worn item's action stays reachable; the
// contract does not require equipping to cast, and no step asserts that it does.
//
// Env: ITEMCOMBAT_OUTPUT (absolute, outside repo), APP_BUILD_DIR (identified production build). Optional ITEMCOMBAT_CHANNEL (default chrome, like item-app-browser.cjs).
//
// FIXTURE SETUP (not user interaction; disclosed in result.json "disclosure"): p9 integration host (registered production backend, fixture
//   auth/ownership/lease/cloud; PC 'pc', creature 'B'); owner delivery of the saved item uses the production library-copy method
//   S('inventoryStore').addItemFromLibrary (same as item-app-browser.cjs) because the owner's item library is a different user scope from the GM's;
//   the manual/unsupported refusal item (step 7) is also delivered that way. READS of store state (savedItem, equipment, inventory) are assertions,
//   never writes. ACTUAL CLICKS: spell authoring, Item Wizard association/save/reopen/remove, library admission and "Add to Inventory" (GM page),
//   inventory refresh/select-version/Use, equip menu, owner roll/approve, GM accept.
// Untested selector assumptions (check first on failure): the "Add to Inventory" menu entry, the Confirm remove button, owner approval texts
//   (copied from item-app-browser.cjs), the inventory-window right-click target `.inventory-window-content [draggable="true"]`, the "Equip" and
//   "Equip to Trinket ..." menu buttons. An accessory without ring/necklace subtype or name is offered trinket slots, hence the choice menu.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.ITEMCOMBAT_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External ITEMCOMBAT_OUTPUT and APP_BUILD_DIR required');
process.env.APP_BUILD_DIR = path.resolve(process.env.APP_BUILD_DIR);
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture');
const { setup } = require('../p9/integration/app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const pure = require('../../src/services/authoredAbility');
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { kind: 'item-ability-combat-app-witness', disclosure: { fixtures: ['p9 host (auth/ownership/lease/cloud, PC pc, creature B)', 'owner inventory delivery via production addItemFromLibrary', 'manual refusal item delivery via addItemFromLibrary'], clicked: ['spell authoring', 'Item Wizard associate/save/reopen/remove', 'library admission + Add to Inventory (GM)', 'inventory Refresh/select version/Use', 'inventory Equip menu', 'character sheet Unequip to Inventory', 'owner roll + approve', 'GM accept'], scope: 'A2: local item listing is not server possession authorization; no exact-item or foreign-item enforcement is claimed' }, checks: {}, errors: [], qualifications: [], limits: ['Optimized production App and registered backend; auth, ownership, lease, cloud are fixtures. Temporary-room live receipts only. No deployment, second physical device or human table.'] };
const SPELL = 'Ribbon Mending Spell', ITEM = 'Witness Ribbon';
const book = p => p.getByRole('dialog', { name: 'Spellbook', exact: true }), wizard = p => p.locator('.item-wizard-modal');
const itemRegion = (p, name) => p.getByRole('region', { name: `Item ability for ${name}`, exact: true });
async function openBook(p) { await p.getByRole('button', { name: /^Character/ }).click(); await p.getByRole('button', { name: /^Spellbook/ }).click(); await book(p).waitFor(); }
async function closeBook(p) { const b = book(p).getByRole('button', { name: 'Close', exact: true }); await b.focus(); await b.press('Enter'); }
const savedSpell = (p, name) => p.evaluate(name => { const k = Object.keys(localStorage).find(k => k.endsWith(':library.spellData')); return k ? JSON.parse(localStorage.getItem(k)).payload.data.spells.find(s => s.name === name) : null; }, name);
const savedItem = (p, name) => p.evaluate(name => S('itemStore').getState().items.find(i => i.name === name), name);
async function authorHealingSpell(p) { // copied from authored-app-browser.cjs (A1), without its Spell-Library admission
  await openBook(p); const b = book(p), nav = b.getByRole('navigation', { name: 'Spell wizard steps' });
  await b.getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(SPELL); await b.getByRole('textbox', { name: 'Description * *', exact: true }).fill('Item-association witness.');
  await b.getByText('Arcane', { exact: true }).click(); await nav.getByRole('button', { name: /Spell Type$/ }).click();
  await b.getByRole('heading', { name: 'ACTION', exact: true }).click(); await b.getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await b.getByRole('button', { name: /^3 Effects$/ }).click(); await b.getByRole('heading', { name: 'Healing', exact: true }).click();
  await b.getByText('Immediate Healing', { exact: true }).click(); await b.getByText('Dice', { exact: true }).first().click();
  await b.locator('.damage-effects-container').getByRole('textbox').first().fill('1d8+1');
  await nav.getByRole('button', { name: /Targeting & Propagation$/ }).click(); await b.getByText('Single Target', { exact: true }).click(); await b.getByText('Ranged', { exact: true }).click();
  const slider = b.getByRole('slider').first(); await slider.focus(); await slider.press('Home'); for (let i = 0; i < 6; i++) await slider.press('ArrowRight'); // 30 ft
  await b.getByText('Enemies', { exact: true }).click(); await b.getByText('Any Target', { exact: true }).click();
  await nav.getByRole('button', { name: /Resources$/ }).click(); await b.getByTitle('Standard magical energy', { exact: true }).click(); await b.getByTitle('Basic action economy', { exact: true }).click();
  const v = b.getByRole('spinbutton'); await v.nth(0).fill('1'); await v.nth(0).fill('2'); await v.nth(1).fill('1'); await v.nth(1).fill('1'); // 2 mana, 1 AP
  await p.getByRole('button', { name: '✓ Complete Spell', exact: true }).click();
  await p.waitForFunction(n => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(n)), SPELL);
  const r = await savedSpell(p, SPELL); assert.ok(r?.authoredDraft); assert.equal(pure.definitionFromWizard(r, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' }).ok, true);
  await closeBook(p); save('spell-saved.json', r); return r;
}
async function openArmory(p) { await p.getByRole('button', { name: /^Tools/ }).click(); await p.getByRole('button', { name: /^Library/ }).click(); const a = p.getByRole('button', { name: 'Open Armory', exact: true }); if (await a.count()) await a.click(); await p.getByRole('button', { name: 'Create Item', exact: true }).waitFor(); }
async function closeArmory(p) { await p.locator('.library-window').getByRole('button', { name: 'Close', exact: true }).click(); if (await p.locator('.library-window').count()) await p.locator('.library-window').getByRole('button', { name: 'Close', exact: true }).click(); }
async function associateThroughItemWizard(p, spell) {
  await openArmory(p); await p.getByRole('button', { name: 'Create Item', exact: true }).click();
  await wizard(p).getByText('Accessory', { exact: true }).first().click(); await wizard(p).getByRole('button', { name: 'Basic Info', exact: true }).click();
  await wizard(p).getByPlaceholder('Enter item name...', { exact: true }).fill(ITEM);
  const picker = wizard(p).getByRole('combobox', { name: 'Compatible Spell Library definition', exact: true }); await picker.waitFor();
  const options = await picker.locator('option').allTextContents(); report.checks.pickerOptions = options;
  if (!options.includes(SPELL)) throw Error('PICKER_DID_NOT_LIST_SAVED_ABILITY ' + JSON.stringify(options));
  await picker.selectOption({ label: SPELL }); await wizard(p).getByRole('button', { name: 'Associate library snapshot', exact: true }).click();
  await wizard(p).getByRole('button', { name: 'Appearance', exact: true }).click(); await wizard(p).getByRole('button', { name: /Create Item$/ }).click(); await wizard(p).waitFor({ state: 'detached' });
  const item = await savedItem(p, ITEM); assert.deepEqual(item.authoredAbility.record, spell, 'association = whole saved Wizard record'); assert.equal(item.authoredAbility.librarySpellId, spell.id);
  save('item-saved.json', item); return item;
}
async function reopenItem(p, name) { await p.getByPlaceholder('Search...', { exact: true }).fill(name); await p.getByRole('button', { name: `Inspect ${name}`, exact: true }).click({ button: 'right' }); await p.getByText('Edit Item', { exact: true }).click(); await wizard(p).getByRole('button', { name: 'Basic Info', exact: true }).click(); }
async function saveItemWizard(p) { await wizard(p).getByRole('button', { name: 'Appearance', exact: true }).click(); await wizard(p).getByRole('button', { name: /Create Item$/ }).click(); await wizard(p).waitFor({ state: 'detached' }); }
async function selectLibraryItem(p, name) { await p.getByPlaceholder('Search...', { exact: true }).fill(name); const i = p.getByRole('button', { name: `Inspect ${name}`, exact: true }); await i.focus(); await i.press('Enter'); await p.locator('summary').filter({ hasText: `${name} —` }).click(); const r = itemRegion(p, name); await r.waitFor(); return r; }
async function openInventory(p) { await p.getByRole('button', { name: /^Character/ }).click(); await p.getByRole('button', { name: /^Inventory/ }).click(); await p.getByRole('region', { name: 'Inventory item abilities', exact: true }).waitFor(); }
async function launch(p, name) {
  const region = itemRegion(p, name), s = p.locator('summary').filter({ hasText: `${name} —` }); if (!(await region.isVisible())) await s.click();
  await region.getByRole('button', { name: 'Refresh item ability admission', exact: true }).click();
  const sel = region.getByRole('combobox', { name: 'Saved ability version', exact: true }); await sel.waitFor();
  await sel.selectOption(await sel.locator('option:not([value=""]):not([disabled])').first().getAttribute('value'));
  await region.getByRole('button', { name: 'Use item ability', exact: true }).click();
  const d = p.getByRole('dialog', { name: 'Supported spell cast', exact: true }); await d.waitFor(); return d;
}
async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_spell_approve', 'actor_spell_list', 'actor_authored_admit', 'actor_authored_list', 'actor_authored_revoke', 'join_room']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const browser = await chromium.launch({ channel: process.env.ITEMCOMBAT_CHANNEL || 'chrome', headless: true }), pages = [];
  try {
    const gm = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); pages.push(gm); gm.on('pageerror', e => report.errors.push({ role: 'gm', error: e.message })); await setup(gm, host.url, 'app-gm');
    step('1 Spell Wizard: author + save immediate healing');
    const spell = await authorHealingSpell(gm);
    step('2 Item Wizard: associate through the real picker, save'); const item = await associateThroughItemWizard(gm, spell);
    step('3 Reopen the item through library Edit: association present; Cancel keeps it');
    await reopenItem(gm, ITEM); await wizard(gm).getByRole('button', { name: 'Edit activated ability', exact: true }).waitFor(); await saveItemWizard(gm);
    assert.deepEqual((await savedItem(gm, ITEM)).authoredAbility, item.authoredAbility); report.checks.reopenedUnchanged = true;
    step('4 GM admits the saved version from the library item panel; the template offers NO Use control');
    const lib = await selectLibraryItem(gm, ITEM); const adm = lib.getByRole('region', { name: `Room admission for ${item.authoredAbility.record.name}`, exact: true });
    await adm.getByRole('button', { name: 'Admit this saved version', exact: true }).click(); await adm.getByText(/Admitted for immediate damage\/healing/).waitFor();
    await lib.getByRole('button', { name: 'Refresh item ability admission', exact: true }).click();
    assert.equal(await lib.getByRole('button', { name: 'Use item ability', exact: true }).count(), 0, 'library template must not cast'); assert.equal(await lib.getByRole('combobox', { name: 'Saved ability version', exact: true }).count(), 0);
    await lib.getByText(/Library template/).waitFor(); save('template-panel.aria.yml', await lib.ariaSnapshot()); report.checks.templateNoUse = true;
    step('5 Normal control "Add to Inventory" on the GM page keeps the detached association');
    await gm.getByRole('button', { name: `Inspect ${ITEM}`, exact: true }).click({ button: 'right' }); await gm.getByText('Add to Inventory', { exact: true }).click();
    await gm.waitForFunction(n => S('inventoryStore').getState().items.some(i => i.name === n), ITEM);
    const gmCopy = await gm.evaluate(n => S('inventoryStore').getState().items.find(i => i.name === n), ITEM); assert.deepEqual(gmCopy.authoredAbility, item.authoredAbility); assert.notEqual(gmCopy.id, item.id); report.checks.addToInventoryControl = true;
    await closeArmory(gm);
    const owner = await browser.newPage({ viewport: { width: 1440, height: 1000 } }), observer = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); pages.push(owner, observer);
    owner.on('pageerror', e => report.errors.push({ role: 'owner', error: e.message })); await setup(owner, host.url, 'app-owner'); await setup(observer, host.url, 'app-observer');
    step('6 FIXTURE delivery of the saved item to the owner (production addItemFromLibrary), then reload and use');
    await owner.evaluate(i => { S('inventoryStore').setState({ items: [] }); S('inventoryStore').getState().addItemFromLibrary(i); }, item);
    await setup(owner, host.url, 'app-owner'); await openInventory(owner);
    const owned = await owner.evaluate(n => S('inventoryStore').getState().items.find(i => i.name === n), ITEM); assert.deepEqual(owned.authoredAbility, item.authoredAbility); report.checks.survivesReloadInOwnerInventory = true;
    const pc = () => actors.locate(host.room, host.refs.pc).token.character, receiptsBefore = actors.ledger(host.room).receipts.length;
    const before = JSON.stringify(pc());
    const cardCount = () => owner.locator('.item-ability').count();
    assert.equal(await cardCount(), 1, 'backpack item listed exactly once after reload'); report.checks.backpackEntryOnce = true;

    step('6a Backpack ability action is offered');
    const summaryBtn = owner.locator('summary').filter({ hasText: `${ITEM} —` });
    await summaryBtn.click();
    const bpRegion = itemRegion(owner, ITEM);
    await bpRegion.getByRole('button', { name: 'Refresh item ability admission', exact: true }).click();
    const bpSel = bpRegion.getByRole('combobox', { name: 'Saved ability version', exact: true });
    await bpSel.waitFor();
    assert.equal(await bpRegion.getByRole('button', { name: 'Use item ability', exact: true }).count(), 1, 'backpack item offers its action');
    report.checks.backpackActionOffered = true;
    await summaryBtn.click();

    step('6b Owner EQUIPS the item through the normal controls; the worn item action stays listed once');
    await owner.locator('.inventory-window-content [draggable="true"]').first().click({ button: 'right' });
    await owner.getByText('Equip', { exact: true }).first().click();
    await owner.waitForFunction(id => Object.values(S('characterStore').getState().equipment || {}).some(e => e && e.id === id), owned.id);
    const wornNow = await owner.evaluate(id => ({ worn: Object.entries(S('characterStore').getState().equipment).filter(([, e]) => e && e.id === id).map(([k]) => k), inBackpack: S('inventoryStore').getState().items.some(i => i.id === id) }), owned.id);
    assert.equal(wornNow.worn.length, 1); assert.equal(wornNow.inBackpack, false, 'equipped instance left the backpack'); assert.equal(await cardCount(), 1, 'worn item action listed once, no duplicate');
    report.checks.equipped = wornNow; save('worn-owner.aria.yml', await owner.getByRole('region', { name: 'Inventory item abilities', exact: true }).ariaSnapshot());

    step('6c Use the WORN item action while still equipped: select exact version, Use, owner roll + approval, GM accept');
    assert.equal(await owner.evaluate(id => Object.values(S('characterStore').getState().equipment || {}).some(e => e && e.id === id), owned.id), true, 'item is still equipped before cast');
    const beforeApproval = JSON.stringify(pc());
    const sourcePoolsBefore = actors.resources(actors.locate(host.room, host.refs.pc).token, 'character');
    const targetPoolsBefore = actors.resources(actors.locate(host.room, host.refs.B).token, 'creature');
    const d = await launch(owner, ITEM);
    const targetSelect = d.getByRole('combobox', { name: 'Target', exact: true });
    const targetVal = await targetSelect.locator('option').filter({ hasText: /creature.*B|B · creature/ }).first().getAttribute('value');
    await targetSelect.selectOption(targetVal);
    await d.getByRole('button', { name: 'Roll 1d8 once', exact: true }).click(); await d.getByRole('button', { name: 'Approve price and send to GM', exact: true }).click();
    const card = gm.locator('.p9-gm-card').filter({ hasText: item.authoredAbility.record.name }); await card.waitFor(); assert.equal(JSON.stringify(pc()), beforeApproval, 'approval spends nothing');
    await card.getByRole('checkbox').check(); await card.getByLabel(/^Final/).fill('100'); await card.getByLabel(/^Reason/).fill('GM healing cap witness');
    await card.getByRole('button', { name: 'Accept one consequence', exact: true }).click(); await d.getByText(/Accepted · /).first().waitFor();
    const receipt = actors.ledger(host.room).receipts.at(-1); assert.equal(actors.ledger(host.room).receipts.length, receiptsBefore + 1, 'exactly one receipt');
    const pay = require('../../../server/services/spellPayments').tempFirst;
    const sourcePoolsAfter = actors.resources(actors.locate(host.room, host.refs.pc).token, 'character');
    const targetPoolsAfter = actors.resources(actors.locate(host.room, host.refs.B).token, 'creature');
    assert.deepEqual({ current: sourcePoolsAfter.ap.current, temp: sourcePoolsAfter.ap.temp }, pay(sourcePoolsBefore.ap.current, sourcePoolsBefore.ap.temp, 1), 'exact temp-first AP payment once');
    assert.deepEqual({ current: sourcePoolsAfter.mana.current, temp: sourcePoolsAfter.mana.temp }, pay(sourcePoolsBefore.mana.current, sourcePoolsBefore.mana.temp, 2), 'exact temp-first mana payment once');
    assert.deepEqual(targetPoolsAfter.hp, { current: Math.min(targetPoolsBefore.hp.max, targetPoolsBefore.hp.current + 100), max: targetPoolsBefore.hp.max, temp: targetPoolsBefore.hp.temp }, 'one capped healing consequence; temporary HP unchanged');
    report.checks.cast = { receipt, pcAfter: pc(), pcBefore: JSON.parse(beforeApproval), sourcePoolsBefore, sourcePoolsAfter, targetPoolsBefore, targetPoolsAfter, castWhileWorn: true };

    step('6d Reload/recovery: item remains equipped, action remains available, HP/payment/receipt count unchanged');
    await d.getByRole('button', { name: 'Close', exact: true }).click();
    await setup(owner, host.url, 'app-owner');
    await openInventory(owner);
    assert.equal(actors.ledger(host.room).receipts.length, receiptsBefore + 1, 'reload creates no duplicate receipt');
    const sourcePoolsAfterReload = actors.resources(actors.locate(host.room, host.refs.pc).token, 'character');
    const targetPoolsAfterReload = actors.resources(actors.locate(host.room, host.refs.B).token, 'creature');
    assert.deepEqual(sourcePoolsAfterReload, sourcePoolsAfter, 'HP and payment have not changed after reload');
    assert.deepEqual(targetPoolsAfterReload, targetPoolsAfter, 'target HP has not changed after reload');
    await owner.waitForFunction(id => Object.values(S('characterStore').getState().equipment || {}).some(e => e && e.id === id), owned.id);
    const ownedAfterReload = await owner.evaluate(id => {
      const worn = Object.values(S('characterStore').getState().equipment || {}).filter(e => e && e.id === id);
      if (worn.length !== 1) throw Error('The cast item must persist in exactly one worn slot after reload, found: ' + worn.length);
      if (S('inventoryStore').getState().items.some(i => i.id === id)) throw Error('Worn item duplicated into backpack');
      return worn[0];
    }, owned.id);
    assert.deepEqual(ownedAfterReload.authoredAbility, item.authoredAbility, 'item association persists after reload');
    assert.equal(await cardCount(), 1, 'exactly one item action entry after reload');
    report.checks.afterReload = { survivesWorn: true, cardCount: 1, receiptCountUnchanged: true, poolsUnchanged: true };
    save('cast-owner.aria.yml', await owner.getByRole('region', { name: 'Inventory item abilities', exact: true }).ariaSnapshot().catch(() => 'unavailable'));

    step('6e After cast and reload, owner UNEQUIPS the item through normal controls; unequipped action stays listed once');
    await owner.keyboard.press('c');
    const sheet = owner.getByRole('dialog', { name: 'Character Sheet', exact: true });
    await sheet.waitFor();
    await sheet.getByRole('button', { name: 'Info', exact: true }).click();
    await owner.locator('.gear-slot img[alt="' + ITEM + '"]').first().click({ button: 'right' });
    await owner.getByRole('button', { name: /Unequip to Inventory/ }).click();
    await owner.waitForFunction(id => !Object.values(S('characterStore').getState().equipment || {}).some(e => e && e.id === id), owned.id);
    await owner.waitForFunction(id => S('inventoryStore').getState().items.some(i => i.id === id), owned.id);
    await sheet.getByRole('button', { name: 'Close', exact: true }).click();
    await sheet.waitFor({ state: 'detached' });
    assert.equal(await cardCount(), 1, 'unequipped item action listed once, no duplicate');
    report.checks.unequippedActionPreserved = true;
    step('7 Refused: unsupported/manual item spends nothing and shows no Use');
    const manual = JSON.parse(JSON.stringify(item)); manual.id = 'manual-fixture'; manual.name = 'Manual Ribbon'; const r = manual.authoredAbility.record; r.effectTypes.push('debuff'); r.authoredDraft.effectTypes.push('debuff'); r.debuffConfig = r.authoredDraft.debuffConfig = { custom: 'mixed' };
    await owner.evaluate(i => S('inventoryStore').getState().addItemFromLibrary(i), manual);
    const mp = itemRegion(owner, manual.name); await owner.locator('summary').filter({ hasText: `${manual.name} —` }).click(); await mp.getByText(/Unsupported\/manual/).waitFor();
    assert.equal(await mp.getByRole('button', { name: 'Use item ability', exact: true }).count(), 0); assert.equal(actors.ledger(host.room).receipts.length, receiptsBefore + 1); report.checks.unsupportedRefused = true;
    step('8 SEPARATE: remove the association in the Item Wizard; unrelated data kept; the owner copy is unchanged');
    await openArmory(gm); await reopenItem(gm, ITEM);
    await wizard(gm).getByRole('button', { name: 'Remove activated ability', exact: true }).click(); await wizard(gm).getByRole('button', { name: 'Confirm remove activated ability', exact: true }).click(); await saveItemWizard(gm);
    const stripped = await savedItem(gm, ITEM); assert.ok(!stripped.authoredAbility); assert.equal(stripped.name, ITEM);
    await setup(gm, host.url, 'app-gm'); await openArmory(gm); await reopenItem(gm, ITEM); await wizard(gm).getByRole('button', { name: 'Add activated ability', exact: true }).waitFor(); await saveItemWizard(gm); await closeArmory(gm);
    const ownerAfter = await owner.evaluate(n => S('inventoryStore').getState().items.find(i => i.name === n), ITEM); assert.deepEqual(ownerAfter.authoredAbility, item.authoredAbility); report.checks.removalLeavesOwnedCopy = true;
    report.passed = report.errors.length === 0;
  } catch (e) {
    report.failure = e.stack; for (let i = 0; i < pages.length; i++) { save(`failure-${i}.aria.yml`, await pages[i].locator('body').ariaSnapshot().catch(() => 'unavailable')); await pages[i].screenshot({ path: path.join(out, `failure-${i}.png`) }).catch(() => {}); } throw e;
  } finally { save('result.json', report); await browser.close(); await host.stop(); }
}
function step(s) { console.log('·', s); report.steps = (report.steps || []).concat(s); }
if (require.main === module) main().then(() => { console.log(JSON.stringify({ passed: report.passed, out })); process.exit(report.passed ? 0 : 1); }, e => { console.error(e); process.exit(1); });
module.exports = { main, report };
