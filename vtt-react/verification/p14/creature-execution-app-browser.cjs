// Actual optimized App, GM/observer, real Creature Wizard and registered shared-room handlers.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.A4_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External A4_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture');
const { setup } = require('../p9/integration/app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const profile = require('../../src/services/sharedConditionProfile');
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const report = { checks: {}, errors: [], limits: ['Optimized production App and registered backend; provider authentication/lease/cloud are fixtures. Actual store placement emits real token_created. Temporary room receipts live-only. No real cloud, deployment, physical tablet or second-device claim.'] };
const wizard = page => page.locator('.creature-wizard-layout');
async function openBestiary(page) { await page.getByRole('button', { name: 'Tools', exact: true }).click(); await page.getByRole('button', { name: 'Library L', exact: true }).click(); await page.getByRole('button', { name: 'Open Bestiary', exact: true }).click(); }
async function finish(page) { await wizard(page).getByRole('button', { name: '5 Shop Config', exact: true }).click(); await wizard(page).getByRole('button', { name: /^Save Creature/ }).click(); await wizard(page).waitFor({ state: 'detached' }); }
async function author(page, config) {
  await page.locator('.library-window').getByRole('button', { name: 'Create New', exact: true }).click(); await wizard(page).locator('#creature-name').fill(config.creature);
  await wizard(page).getByRole('button', { name: '3 Abilities', exact: true }).click(); await wizard(page).getByRole('button', { name: 'Add activated ability', exact: true }).click();
  await wizard(page).getByLabel('Ability name', { exact: true }).fill(config.name); await wizard(page).getByRole('combobox', { name: 'Effect', exact: true }).selectOption(config.kind); await wizard(page).getByLabel('Formula', { exact: true }).fill(config.formula);
  for (const [label, value] of [['AP price', config.ap], ['Mana price', config.mana], ['Range (ft)', config.range]]) await wizard(page).getByLabel(label, { exact: true }).fill(String(value));
  await wizard(page).getByRole('button', { name: 'Keep ability on creature', exact: true }).click(); await finish(page);
  const creature = await page.evaluate(name => S('creatureStore').getState().creatures.find(c => c.name === name), config.creature); assert.ok(creature?.authoredAbility);
  await page.locator('.creature-library').getByPlaceholder('Search...', { exact: true }).fill(config.creature); await page.locator('.creature-card-wrapper').filter({ hasText: config.creature }).first().click({ button: 'right' }); await page.getByText('Edit', { exact: true }).last().click();
  await wizard(page).getByRole('button', { name: '3 Abilities', exact: true }).click(); await wizard(page).getByRole('button', { name: 'Edit activated ability', exact: true }).click(); assert.equal(await wizard(page).getByLabel('Ability name', { exact: true }).inputValue(), config.name);
  await wizard(page).getByRole('button', { name: 'Cancel ability edit', exact: true }).click(); await finish(page); return creature;
}
async function closeLibrary(page) { while (await page.locator('.library-window').getByRole('button', { name: 'Close', exact: true }).count()) await page.locator('.library-window').getByRole('button', { name: 'Close', exact: true }).last().click(); }
async function tokenLocator(page, id) {
  await page.waitForFunction(id => Array.from(document.querySelectorAll('.creature-token')).some(el => { let f = el[Object.keys(el).find(k => k.startsWith('__reactFiber'))]; for (; f; f = f.return) if (f.memoizedProps?.tokenId === id) { el.dataset.a4Token = id; return true; } return false; }), id);
  return page.locator(`[data-a4-token="${id}"]`);
}
async function inspectPlaced(page, id) {
  const token = await tokenLocator(page, id); await token.click({ button: 'right' }); await page.getByRole('button', { name: /Token Actions/ }).hover(); await page.getByText('Inspect', { exact: true }).last().click();
  await page.getByRole('button', { name: 'Abilities & Spells', exact: true }).last().click(); return page.getByRole('region', { name: 'Creature activated ability', exact: true });
}
async function closeInspect(page) { await page.locator('.wow-window').filter({ has: page.locator('.creature-inspect-container') }).getByRole('button', { name: 'Close', exact: true }).click(); }
async function admitAndOpen(page, id) {
  const region = await inspectPlaced(page, id); await region.waitFor();
  const bind = region.getByRole('button', { name: 'Bind this placed creature', exact: true }); if (await bind.count()) await bind.click();
  await region.getByRole('button', { name: 'Admit for this creature', exact: true }).waitFor(); await region.getByRole('button', { name: 'Refresh room admission', exact: true }).click();
  await region.getByRole('button', { name: 'Admit for this creature', exact: true }).click(); await region.getByText(/Admitted for immediate damage\/healing/).waitFor(); save(`${id}-admitted.aria.yml`, await region.ariaSnapshot());
  await region.getByRole('button', { name: 'Use for this creature', exact: true }).click(); return page.getByRole('dialog', { name: 'Creature ability action', exact: true });
}
async function main() {
  report.sourceBefore = require('./record-creature-execution-evidence.cjs').snapshot();
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const event of ['actor_snapshot', 'actor_consequence', 'actor_spell_prepare_creature', 'actor_spell_withdraw', 'actor_spell_list', 'actor_authored_admit', 'actor_authored_list', 'actor_authored_revoke', 'token_created', 'actor_bind', 'join_room']) host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const browser = await chromium.launch({ channel: 'chrome', headless: true }), pages = [];
  try {
    const gm = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); pages.push(gm); gm.on('pageerror', e => report.errors.push({ role: 'gm', error: e.message })); await setup(gm, host.url, 'app-gm'); await openBestiary(gm);
    const damage = await author(gm, { creature: 'A4 Witness Finch', name: 'Witness Arc', kind: 'damage', formula: '1d6+2', ap: 1, mana: 3, range: 30 });
    const healing = await author(gm, { creature: 'A4 Witness Doe', name: 'Witness Mend', kind: 'healing', formula: '1d8+1', ap: 0, mana: 0, range: 30 });
    report.checks.actualWizardSaveReopen = { damage, healing }; await closeLibrary(gm);
    // Existing production store placement, with real server emission enabled (not a local-only A3 fixture).
    await gm.evaluate(({ damage, healing }) => { const store = S('creatureStore').getState(); store.addCreatureToken(damage, { x: -150, y: -100 }, true, 'a4-source', false, 'app-hall'); store.addCreatureToken(damage, { x: -50, y: -100 }, true, 'a4-sibling', false, 'app-hall'); store.addCreatureToken(healing, { x: 50, y: -100 }, true, 'a4-healer', false, 'app-hall'); }, { damage, healing });
    await gm.waitForFunction(() => __outbound.filter(e => e.event === 'token_created').length >= 3); await new Promise(r => setTimeout(r, 300));
    for (const id of ['a4-source', 'a4-sibling', 'a4-healer']) assert.ok(host.room.gameState.maps['app-hall'].tokens[id]?.authoredAbility, 'whole placement association reached server');
    // Reload the unbound source: its bind affordance must remain reachable without public raw drafts.
    await setup(gm, host.url, 'app-gm'); const observer = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); pages.push(observer); observer.on('pageerror', e => report.errors.push({ role: 'observer', error: e.message })); await setup(observer, host.url, 'app-observer');
    let dialog = await admitAndOpen(gm, 'a4-source'); await dialog.waitFor(); const sourceRef = actors.refFor(host.room.gameState.maps['app-hall'].tokens['a4-source'].state.actorContract);
    assert.equal(host.room.gameState.maps['app-hall'].tokens['a4-sibling'].state.actorContract?.authoredAdmission, undefined);
    await dialog.getByLabel('Creature target', { exact: true }).selectOption('creature:app-hall:B'); await dialog.getByLabel('d6 face 1', { exact: true }).fill('4'); await dialog.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    const sourceBefore = actors.clone(host.room.gameState.maps['app-hall'].tokens['a4-source'].state), hpBefore = host.room.gameState.maps['app-hall'].tokens.B.state.currentHp;
    await dialog.getByRole('button', { name: 'Validate source, target and retained roll', exact: true }).click(); await dialog.getByRole('button', { name: 'Confirm one creature consequence', exact: true }).waitFor(); assert.deepEqual(host.room.gameState.maps['app-hall'].tokens['a4-source'].state, sourceBefore);
    await dialog.getByRole('checkbox').check(); await dialog.getByLabel('Final damage', { exact: true }).fill('6');
    save('damage-before-confirm.aria.yml', await dialog.ariaSnapshot());
    // Drop both GM ACK and accepted broadcast, leaving the observer's real live delivery untouched.
    await gm.evaluate(() => { const listeners = __socket.listeners('actor_consequence_accepted'); __socket.removeAllListeners('actor_consequence_accepted'); __socket.on('actor_consequence_accepted', r => { if (r.receipt?.authorization?.kind === 'gm-creature-ability') return; listeners.forEach(fn => fn(r)); }); const emit = __socket.emit.bind(__socket); __socket.emit = (event, ...args) => { if (event === 'actor_consequence' && args[0]?.source?.kind === 'creature' && typeof args[1] === 'function') args[1] = () => {}; return emit(event, ...args); }; });
    await dialog.getByRole('button', { name: 'Confirm one creature consequence', exact: true }).click(); await dialog.getByRole('button', { name: 'Check same command', exact: true }).waitFor({ timeout: 15000 });
    const receipt = actors.ledger(host.room).receipts.at(-1), original = await gm.evaluate(() => __outbound.filter(x => x.event === 'actor_consequence').at(-1).payload); assert.equal(receipt.authorization.kind, 'gm-creature-ability'); assert.equal(host.room.gameState.maps['app-hall'].tokens.B.state.currentHp, hpBefore - 2);
    assert.equal(host.room.gameState.maps['app-hall'].tokens['a4-source'].state.currentActionPoints, sourceBefore.currentActionPoints - 1); assert.equal(host.room.gameState.maps['app-hall'].tokens['a4-source'].state.currentMana, sourceBefore.currentMana - 3); assert.equal(host.room.gameState.maps['app-hall'].tokens['a4-sibling'].state.currentActionPoints, sourceBefore.currentActionPoints);
    report.checks.damageOnceSeparateInstances = receipt; const floats = await observer.locator('.fct-chip').allTextContents(); assert.ok(floats.length, 'accepted visible target HP float'); save('observer-damage-live.aria.yml', await observer.getByRole('region', { name: 'Accepted combat results', exact: true }).ariaSnapshot()); report.checks.damageFloats = floats;
    const count = actors.ledger(host.room).receipts.length; await setup(gm, host.url, 'app-gm'); await gm.getByRole('button', { name: 'Open retained creature action', exact: true }).click(); dialog = gm.getByRole('dialog', { name: 'Creature ability action', exact: true }); await dialog.getByRole('button', { name: 'Check same command', exact: true }).click(); await dialog.getByText(/^Accepted ·/).waitFor();
    assert.deepEqual(await gm.evaluate(() => __outbound.filter(x => x.event === 'actor_consequence').at(-1).payload), original); assert.equal(actors.ledger(host.room).receipts.length, count); assert.equal(await observer.evaluate(id => S('chatStore').getState().notifications.combat.filter(n => n.receiptId?.endsWith(id)).length, receipt.commandId), 1); report.checks.lostAckReloadSameCommand = original;
    await dialog.getByRole('button', { name: 'Finish or explicitly cancel (keep evidence)', exact: true }).click();
    // Second actual source: zero-price digital healing. Canonical Stunned arrives after preparation.
    dialog = await admitAndOpen(gm, 'a4-healer'); await dialog.getByLabel('Creature target', { exact: true }).selectOption('creature:app-hall:B'); await dialog.getByRole('button', { name: 'Roll 1d8+1 once', exact: true }).click(); await dialog.getByRole('button', { name: 'Validate source, target and retained roll', exact: true }).click(); await dialog.getByRole('button', { name: 'Confirm one creature consequence', exact: true }).waitFor();
    const healerRef = actors.refFor(host.room.gameState.maps['app-hall'].tokens['a4-healer'].state.actorContract), healer = () => actors.locate(host.room, healerRef).token;
    const recorded = require('../../../server/services/spellPayments').listAll(host.room).find(e => e.approval.source.tokenId === 'a4-healer').approval.roll;
    const stunned = profile.makeStunnedRecord(healerRef, require('crypto').randomUUID(), { sourceOccurrence: 'a4-app-stunned', timing: 'manual' });
    // Real registered P7 named condition command (no local condition-array edit).
    const conditionCommand = { version: 1, roomId: host.room.id, commandId: require('crypto').randomUUID(), actionEpoch: actors.epoch(host.room), baseCommitSequence: actors.ledger(host.room).commitSequence,
      actors: [{ ref: healerRef, expectedRevision: healer().state.actorContract.revision, conditions: [{ op: 'add', recordId: stunned.recordId, record: stunned }] }], adjudication: { definitionId: profile.STUNNED.definitionId, definitionVersionOrHash: profile.STUNNED.origin, chosenResult: 'GM witness condition', finalAmount: 0, adjustmentReason: '' } };
    const conditionResult = await gm.evaluate(command => new Promise(resolve => __socket.emit('actor_consequence', command, resolve)), conditionCommand); assert.equal(conditionResult.success, true, JSON.stringify(conditionResult));
    const beforeStunned = actors.clone(host.room.gameState); await dialog.getByRole('checkbox').check(); await dialog.getByLabel('Final healing', { exact: true }).fill('1000'); await dialog.getByLabel(/^Reason/).fill('GM healing cap witness'); await dialog.getByRole('button', { name: 'Confirm one creature consequence', exact: true }).click(); await dialog.getByText(/Stunned: no actions/).waitFor(); assert.deepEqual(host.room.gameState, beforeStunned);
    const removal = { ...conditionCommand, commandId: require('crypto').randomUUID(), baseCommitSequence: actors.ledger(host.room).commitSequence, actors: [{ ref: healerRef, expectedRevision: healer().state.actorContract.revision, conditions: [{ op: 'remove', recordId: stunned.recordId }] }] };
    const removed = await gm.evaluate(command => new Promise(resolve => __socket.emit('actor_consequence', command, resolve)), removal); assert.equal(removed.success, true, JSON.stringify(removed));
    await dialog.getByRole('button', { name: 'Revalidate original attempt (same roll)', exact: true }).click(); await dialog.getByRole('button', { name: 'Confirm one creature consequence', exact: true }).click(); await dialog.getByText(/^Accepted ·/).waitFor();
    const healed = actors.ledger(host.room).receipts.at(-1); assert.deepEqual(JSON.parse(healed.adjudication.chosenResult).roll, recorded); assert.equal(host.room.gameState.maps['app-hall'].tokens.B.state.currentHp, 250); assert.equal(healer().state.currentActionPoints, 6); assert.equal(healer().state.currentMana, 50); report.checks.digitalZeroPriceStunnedRetainedRevalidation = healed;
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }]) { await gm.setViewportSize(viewport); const bounds = await dialog.locator('.p9-panel').evaluate(el => ({ width: el.clientWidth, scrollWidth: el.scrollWidth, rect: el.getBoundingClientRect().toJSON() })); assert.ok(bounds.scrollWidth <= bounds.width + 1); save(`layout-${viewport.width}.json`, bounds); save(`action-${viewport.width}.aria.yml`, await dialog.ariaSnapshot()); await gm.screenshot({ path: path.join(out, `action-${viewport.width}.png`) }); }
    await dialog.getByRole('button', { name: 'Finish or explicitly cancel (keep evidence)', exact: true }).click(); await closeInspect(gm);
    report.checks.observerPrivacy = await observer.evaluate(async () => new Promise(resolve => __socket.emit('actor_authored_list', { roomId: S('gameStore').getState().multiplayerRoom.id }, r => resolve({ hasCreatureSources: Object.hasOwn(r, 'creatureSources'), sourceDraftsInPublicTokens: S('creatureStore').getState().creatureTokens.some(t => t.authoredAbility) })))); assert.deepEqual(report.checks.observerPrivacy, { hasCreatureSources: false, sourceDraftsInPublicTokens: false });
    report.passed = true;
  } catch (e) { report.failure = e.stack; for (let i = 0; i < pages.length; i++) { save(`failure-${i}.aria.yml`, await pages[i].locator('body').ariaSnapshot().catch(() => 'unavailable')); await pages[i].screenshot({ path: path.join(out, `failure-${i}.png`) }).catch(() => {}); } throw e; }
  finally { report.sourceAfter = require('./record-creature-execution-evidence.cjs').snapshot(); save('result.json', report); await browser.close(); await host.stop(); }
}
if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
