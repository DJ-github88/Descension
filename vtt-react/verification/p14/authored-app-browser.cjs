// P14-A1 actual optimized App Wizard → normal library → admission → shared P9/P7 execution.
// Auth/provider/lease/cloud are fixture boundaries; ability authoring uses real controls only.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.A1_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External A1_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture');
const { setup } = require('../p9/integration/app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const pure = require('../../src/services/authoredAbility');
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const report = { checks: {}, errors: [], limits: ['Real optimized App/router/Wizard/library/P9/P7 and registered backend; identity/provider/ownership/lease/cloud fixture boundaries. No live backend, second-device or deployment claim.'] };
const book = page => page.getByRole('dialog', { name: 'Spellbook', exact: true });
async function openBook(page) {
  await page.getByRole('button', { name: 'Character', exact: true }).click();
  await page.getByRole('button', { name: 'Spellbook S', exact: true }).click(); await book(page).waitFor();
}
async function closeBook(page) { const button = book(page).getByRole('button', { name: 'Close', exact: true }); await button.focus(); await button.press('Enter'); }
async function savedRecord(page, name) {
  return page.evaluate(name => {
    const key = Object.keys(localStorage).find(k => k.endsWith(':library.spellData'));
    return key ? JSON.parse(localStorage.getItem(key)).payload.data.spells.find(s => s.name === name) : null;
  }, name);
}
async function author(page, config) {
  await openBook(page);
  await book(page).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill(config.name);
  await book(page).getByRole('textbox', { name: 'Description * *', exact: true }).fill('One immediate single-target ability, authored through the Spell Wizard.');
  await book(page).getByText('Arcane', { exact: true }).click();
  await book(page).getByRole('navigation', { name: 'Spell wizard steps' }).getByRole('button', { name: /Spell Type$/ }).click();
  await book(page).getByRole('heading', { name: 'ACTION', exact: true }).click();
  await book(page).getByLabel('Action timing', { exact: true }).selectOption('IMMEDIATE');
  await book(page).getByRole('button', { name: /^3 Effects$/ }).click();
  await book(page).getByRole('heading', { name: config.kind === 'damage' ? 'Damage' : 'Healing', exact: true }).click();
  if (config.kind === 'healing') {
    await book(page).getByText('Immediate Healing', { exact: true }).click();
    // Explicitly choose the existing DICE editor, rather than relying on its display fallback.
    await book(page).getByText('Dice', { exact: true }).first().click();
  }
  await book(page).locator('.damage-effects-container').getByRole('textbox').first().fill(config.formula);
  await book(page).getByRole('navigation', { name: 'Spell wizard steps' }).getByRole('button', { name: /Targeting & Propagation$/ }).click();
  await book(page).getByText('Single Target', { exact: true }).click();
  await book(page).getByText('Ranged', { exact: true }).click();
  const slider = book(page).getByRole('slider').first(); await slider.focus(); await slider.press('Home');
  for (let i = 0; i < config.range / 5; i++) await slider.press('ArrowRight');
  // Materialize the displayed restriction through its normal control.
  await book(page).getByText('Enemies', { exact: true }).click(); await book(page).getByText('Any Target', { exact: true }).click();
  await book(page).getByRole('navigation', { name: 'Spell wizard steps' }).getByRole('button', { name: /Resources$/ }).click();
  await book(page).getByTitle('Standard magical energy', { exact: true }).click();
  await book(page).getByTitle('Basic action economy', { exact: true }).click();
  const values = book(page).getByRole('spinbutton');
  // The accepted resource editor can display a zero fallback before a fixed value exists.
  // Explicitly author each value through a changed input, including zero (no server default).
  await values.nth(0).fill('1'); await values.nth(0).fill(String(config.mana)); await values.nth(1).fill('1'); await values.nth(1).fill(String(config.ap));
  await page.getByRole('button', { name: '✓ Complete Spell', exact: true }).click();
  await page.waitForFunction(name => Object.values(localStorage).some(v => v.includes('"authoredDefinitionId"') && v.includes(name)), config.name);
  const original = await savedRecord(page, config.name); assert.ok(original?.authoredDraft, 'normal Complete Spell retained whole draft');
  save(`${config.kind}-saved-record.json`, original);
  assert.equal(original.resourceCost.actionPoints, config.ap); assert.equal(original.resourceCost.resourceValues.mana, config.mana); assert.equal(original.targetingConfig.rangeDistance, config.range);
  const mapped = pure.definitionFromWizard(original, { roomId: 'diagnostic', definitionVersion: 1, classId: 'arcanoneer' }); assert.equal(mapped.ok, true, JSON.stringify(mapped));
  await closeBook(page); await openBook(page); await book(page).getByRole('button', { name: 'Spell Library', exact: true }).click();
  await book(page).getByText(config.name, { exact: true }).click();
  const section = page.getByRole('region', { name: `Room admission for ${config.name}`, exact: true }); await section.waitFor();
  assert.deepEqual(await savedRecord(page, config.name), original, 'close/reopen preserved the saved record');
  await section.getByRole('button', { name: 'Admit this saved version', exact: true }).click();
  await section.getByText(/Admitted for immediate damage\/healing/).waitFor();
  save(`${config.kind}-admitted.aria.yml`, await section.ariaSnapshot()); await page.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click(); await closeBook(page);
  return original;
}
async function openActions(page) { const summary = page.locator('summary').filter({ hasText: /^Admitted abilities$/ }); await summary.click(); const region = page.getByRole('region', { name: 'Admitted abilities', exact: true }); await region.getByRole('button', { name: 'Refresh admitted abilities', exact: true }).click(); return region; }
async function main() {
  report.sourceBefore = require('./record-authored-evidence.cjs').snapshot();
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const event of ['actor_snapshot', 'actor_consequence', 'actor_spell_approve', 'actor_spell_list', 'actor_authored_admit', 'actor_authored_list', 'actor_authored_revoke', 'join_room']) host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const browser = await chromium.launch({ channel: 'chrome', headless: true }), pages = [];
  try {
    const gm = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); pages.push(gm); gm.on('pageerror', e => report.errors.push({ role: 'gm', error: e.message })); await setup(gm, host.url, 'app-gm');
    const damage = await author(gm, { name: 'Ink Lance', kind: 'damage', formula: '1d6+2', ap: 1, mana: 3, range: 30 });
    await setup(gm, host.url, 'app-gm'); // actual reload: fresh Wizard context, retained library and admission history
    const healing = await author(gm, { name: 'Quiet Mending', kind: 'healing', formula: '1d8+1', ap: 0, mana: 0, range: 0 });
    assert.notEqual(damage.authoredDefinitionId, healing.authoredDefinitionId); report.checks.twoRealWizardDefinitions = { damage, healing };
    const owner = await browser.newPage({ viewport: { width: 1440, height: 1000 } }), observer = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); pages.push(owner, observer);
    await setup(owner, host.url, 'app-owner'); await setup(observer, host.url, 'app-observer');
    const ownerActions = await openActions(owner); await openActions(observer);
    const pc = () => actors.locate(host.room, host.refs.pc).token.character;
    for (const [name, mode, target, sides] of [['Ink Lance', 'physical', 'creature:app-hall:B', 6], ['Quiet Mending', 'digital', 'character:app-hall:pc', 8]]) {
      const row = ownerActions.locator('.p9-admitted-row').filter({ hasText: name }); await row.getByRole('button', { name: 'Use admitted ability', exact: true }).click();
      const dialog = owner.getByRole('dialog', { name: 'Supported spell cast', exact: true }); await dialog.waitFor();
      await dialog.getByRole('combobox', { name: 'Target', exact: true }).selectOption(target);
      if (mode === 'physical') { await dialog.getByLabel(`d${sides} face 1`, { exact: true }).fill('4'); await dialog.getByRole('button', { name: 'Record physical roll', exact: true }).click(); }
      else await dialog.getByRole('button', { name: `Roll 1d${sides} once`, exact: true }).click();
      save(`${mode}-recorded.aria.yml`, await dialog.ariaSnapshot());
      const before = JSON.stringify(pc()); await dialog.getByRole('button', { name: 'Approve price and send to GM', exact: true }).click();
      const card = gm.locator('.p9-gm-card').filter({ hasText: name }); await card.waitFor(); assert.equal(JSON.stringify(pc()), before, 'exact owner consent spends nothing');
      assert.equal(await observer.locator('.p9-gm-card').count(), 0);
      const pending = require('../../../server/services/spellPayments').listAll(host.room).find(e => e.approval.spell.name === name), roll = pending.approval.roll;
      assert.equal(roll.mode, mode); if (mode === 'physical') assert.deepEqual(roll.dice[0].faces, [4]);
      await card.getByRole('checkbox').check(); await card.getByLabel(/^Final/).fill(name === 'Ink Lance' ? '6' : '100');
      if (name === 'Quiet Mending') await card.getByLabel(/^Reason/).fill('GM adjudicated healing cap witness');
      if (name === 'Ink Lance') await gm.evaluate(() => {
        const listeners = __socket.listeners('actor_consequence_accepted'); __socket.removeAllListeners('actor_consequence_accepted');
        __socket.on('actor_consequence_accepted', r => { if (String(r.receipt?.adjudication?.definitionVersionOrHash).startsWith('authored-immediate:v1/')) return; listeners.forEach(fn => fn(r)); });
        const emit = __socket.emit.bind(__socket);
        __socket.emit = (event, ...args) => { if (event === 'actor_consequence' && String(args[0]?.adjudication?.definitionVersionOrHash).startsWith('authored-immediate:v1/') && typeof args[1] === 'function') args[1] = () => {}; return emit(event, ...args); };
      });
      await card.getByRole('button', { name: 'Accept one consequence', exact: true }).click();
      await dialog.getByText(/Accepted · /).first().waitFor();
      const receipt = actors.ledger(host.room).receipts.at(-1); assert.deepEqual(JSON.parse(receipt.adjudication.chosenResult).roll, roll);
      const floatText = await observer.locator('.fct-chip').allTextContents();
      assert.ok(floatText.length, 'observer sees accepted HP feedback for rendered actors');
      save(`${mode}-observer-live.aria.yml`, await observer.getByRole('region', { name: 'Accepted combat results', exact: true }).ariaSnapshot());
      report.checks[`${mode}-float`] = floatText;
      if (name === 'Ink Lance') {
        const emitted = await gm.evaluate(() => __outbound.filter(x => x.event === 'actor_consequence').at(-1).payload);
        const count = actors.ledger(host.room).receipts.length;
        await gm.getByText('Outcome unknown. Check this same command; it will not be rebuilt or resubmitted with new values.', { exact: true }).waitFor();
        assert.equal(await card.getByRole('button', { name: 'Accept one consequence', exact: true }).isDisabled(), true);
        await setup(gm, host.url, 'app-gm');
        const check = gm.getByRole('button', { name: 'Check same command', exact: true }); await check.first().waitFor();
        await check.first().click(); await gm.getByText(/Accepted · /).first().waitFor();
        assert.deepEqual(await gm.evaluate(() => __outbound.filter(x => x.event === 'actor_consequence').at(-1).payload), emitted);
        assert.equal(actors.ledger(host.room).receipts.length, count, 'lost ACK/reload original check cannot create another receipt');
        assert.equal(await observer.evaluate(id => S('chatStore').getState().notifications.combat.filter(n => n.receiptId?.endsWith(id)).length, receipt.commandId), 1, 'accepted chat line appears once despite retry');
        report.checks.lostAckReloadOriginalCommand = emitted;
      }
      report.checks[name] = receipt; if (name === 'Ink Lance') { assert.equal(pc().tempActionPoints, 0); assert.equal(pc().actionPoints.current, 2); assert.equal(pc().tempMana, 0); assert.equal(pc().mana.current, 10); }
      else assert.equal(pc().health.current, pc().health.max);
      await dialog.getByRole('button', { name: 'Close', exact: true }).click();
    }
    assert.equal(await owner.evaluate(() => S('characterStore').getState().health.current), pc().health.current);
    const receiptsBefore = actors.ledger(host.room).receipts.length;
    await setup(owner, host.url, 'app-owner'); assert.equal(actors.ledger(host.room).receipts.length, receiptsBefore, 'reload emits no new action');
    await openActions(owner); await owner.locator('.p9-admitted-row').nth(1).waitFor(); assert.equal(await owner.locator('.p9-admitted-row').count(), 2);
    // Real compact-library context menu → mounted Wizard edit, preserving identity and explicit zeros.
    await openBook(gm); await book(gm).getByRole('button', { name: 'Spell Library', exact: true }).click();
    await book(gm).getByText('Quiet Mending', { exact: true }).click({ button: 'right' });
    await gm.getByText('Edit in Spell Wizard', { exact: true }).click();
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).waitFor();
    assert.equal(await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).inputValue(), 'Quiet Mending');
    await book(gm).getByRole('navigation', { name: 'Spell wizard steps' }).getByRole('button', { name: /Resources$/ }).click();
    assert.equal(await book(gm).getByRole('spinbutton').nth(0).inputValue(), '0'); assert.equal(await book(gm).getByRole('spinbutton').nth(1).inputValue(), '0');
    await book(gm).getByRole('navigation', { name: 'Spell wizard steps' }).getByRole('button', { name: /Basic Info$/ }).click();
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('Quiet Mending Revised');
    await gm.getByRole('button', { name: '✓ Complete Spell', exact: true }).click();
    await gm.waitForFunction(() => Object.values(localStorage).some(v => v.includes('Quiet Mending Revised')));
    const revised = await savedRecord(gm, 'Quiet Mending Revised'); assert.equal(revised.authoredDefinitionId, healing.authoredDefinitionId); assert.equal(revised.targetingConfig.rangeDistance, 0);
    assert.deepEqual(await savedRecord(gm, 'Quiet Mending'), healing, 'editing a copy never mutates its original record');
    assert.equal(host.room.gameState.authoredSpellRegistry.definitions.length, 2, 'local edit alone cannot mutate installed definitions');
    await book(gm).getByRole('button', { name: 'Spell Library', exact: true }).click(); await book(gm).getByText('Quiet Mending Revised', { exact: true }).click();
    const revisedSection = gm.getByRole('region', { name: 'Room admission for Quiet Mending Revised', exact: true });
    await revisedSection.getByRole('button', { name: 'Refresh room admission', exact: true }).click(); await revisedSection.getByText(/Changed since admitted version 1/).waitFor();
    await revisedSection.getByRole('button', { name: 'Admit this saved version', exact: true }).click(); await revisedSection.getByText(/Admitted for immediate damage\/healing · version 2/).waitFor();
    const versions = host.room.gameState.authoredSpellRegistry.definitions.filter(e => e.definitionRef.definitionId === healing.authoredDefinitionId); assert.equal(versions.length, 2); assert.notEqual(versions[0].definitionRef.definitionHash, versions[1].definitionRef.definitionHash);
    report.checks.editAndExplicitVersion2 = { revised, versions: versions.map(e => e.definitionRef) };
    await gm.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click();
    await book(gm).getByText('Quiet Mending Revised', { exact: true }).click({ button: 'right' }); await gm.getByText('Edit in Spell Wizard', { exact: true }).click();
    await book(gm).getByRole('textbox', { name: 'Spell Name * *', exact: true }).fill('Manual Mixed');
    await book(gm).getByRole('navigation', { name: 'Spell wizard steps' }).getByRole('button', { name: /Effects$/ }).click(); await book(gm).getByRole('heading', { name: 'Debuff', exact: true }).click();
    await gm.getByRole('button', { name: '✓ Complete Spell', exact: true }).click(); await gm.waitForFunction(() => Object.values(localStorage).some(v => v.includes('Manual Mixed')));
    const mixed = await savedRecord(gm, 'Manual Mixed'); assert.deepEqual(mixed.effectTypes.sort(), ['debuff', 'healing']);
    await book(gm).getByRole('button', { name: 'Spell Library', exact: true }).click(); await book(gm).getByText('Manual Mixed', { exact: true }).click();
    const manualSection = gm.getByRole('region', { name: 'Room admission for Manual Mixed', exact: true }); await manualSection.getByText(/Unsupported\/manual/).waitFor();
    assert.equal(await manualSection.getByRole('button', { name: 'Admit this saved version', exact: true }).isDisabled(), true); assert.equal(actors.ledger(host.room).receipts.length, receiptsBefore);
    assert.equal(host.room.gameState.authoredSpellRegistry.definitions.length, 3); report.checks.unsupportedWholeRecordPreserved = mixed;
    await gm.locator('.spell-detail-overlay').getByRole('button', { name: 'Close', exact: true }).click(); await closeBook(gm);
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }]) {
      await owner.setViewportSize(viewport); save(`accepted-${viewport.width}.aria.yml`, await owner.locator('.actor-consequence-layer').ariaSnapshot());
      const box = await owner.locator('.actor-consequence-layer').boundingBox(); assert.ok(box.x >= 0 && box.x + box.width <= viewport.width);
      await owner.screenshot({ path: path.join(out, `accepted-${viewport.width}.png`) });
    }
    report.checks.reconnectNoReplay = true; report.passed = true;
  } catch (error) {
    report.failure = error.stack;
    for (let i = 0; i < pages.length; i++) { save(`failure-${i}.aria.yml`, await pages[i].locator('body').ariaSnapshot().catch(() => 'unavailable')); await pages[i].screenshot({ path: path.join(out, `failure-${i}.png`) }).catch(() => {}); }
    throw error;
  } finally {
    report.sourceAfter = require('./record-authored-evidence.cjs').snapshot();
    if (JSON.stringify(report.sourceBefore) !== JSON.stringify(report.sourceAfter)) { report.passed = false; report.sourceDrift = true; }
    save('result.json', report); await browser.close(); await host.stop();
  }
}
if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
