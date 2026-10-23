// A5 real optimized App, normal ability/target/block panels. Disposable content only.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), crypto = require('crypto');
const { chromium } = require('playwright');
const out = process.env.A5_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External A5_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture'); process.env.A4_OUTPUT = path.join(out, 'producer');
const legacy = require('../p9/integration/app-browser.cjs').setup;
const producer = require('./creature-execution-app-browser.cjs');
const actors = require('../../../server/services/actorConsequences'), profile = require('../../src/services/sharedConditionProfile');
const save = (name, v) => fs.writeFileSync(path.join(out, name), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { checks: {}, errors: [], limits: ['Actual optimized App and registered Socket.IO handlers. Auth/canonical ownership/lease/cloud fixtures. Temporary room/live-only. No deployment or physical second-device claim.'] };
const hide = { id: 'a5-hide', name: 'Disposable Hide', type: 'armor', subtype: 'LEATHER', durability: 'd8', maxDurability: 'd8', width: 2, height: 2, slots: ['chest'] };
async function setup(page, host, uid, seed = false) {
  await legacy(page, host.url, uid);
  await page.evaluate(async({ uid, hide, seed }) => {
    const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes('Submitting one HP + wear consequence'));
    const m = __req(pair[0]), fn = text => Object.values(m).find(f => typeof f === 'function' && f.toString().includes(text));
    window.__blocking = { register: fn('actor_block_offered'), lists: Object.values(m).find(f => typeof f === 'function' && f.toString().includes('actor_block_list') && !f.toString().includes('Original offer unavailable')), store: Object.values(m).find(v => typeof v === 'function' && v.getState && 'gmPending' in v.getState()) };
    __blocking.register({ socket: __socket });
    const relay = Object.entries(__req.m).find(([, f]) => f.toString().includes('[roomRejoin] subscriber failed'));
    Object.values(__req(relay[0])).find(f => typeof f === 'function' && f.toString().includes('room_joined'))(__socket);
    if (uid === 'app-owner' && seed) { S('characterStore').setState({ characters: [{ id: 'ilse', name: 'Ilse' }], equipment: { ...S('characterStore').getState().equipment, chest: hide }, roomEquipmentCustody: null }); S('inventoryStore').setState({ items: [] }); S('characterStore').getState().syncWithMultiplayer(); }
    await __blocking.lists();
  }, { uid, hide, seed });
}
const ownerDialog = p => p.getByRole('dialog', { name: 'Blocking and wear', exact: true });
const gmCard = p => p.getByRole('article', { name: 'Pending block roll', exact: true }).last();
async function condition(gm, host, record, op) {
  const ref = host.refs.pc, t = actors.locate(host.room, ref).token;
  const command = { version: 1, roomId: host.room.id, commandId: crypto.randomUUID(), actionEpoch: actors.epoch(host.room), baseCommitSequence: actors.ledger(host.room).commitSequence,
    actors: [{ ref, expectedRevision: t.state.actorContract.revision, conditions: [{ op, recordId: record.recordId, ...(op === 'add' ? { record } : {}) }] }],
    adjudication: { definitionId: profile.DEFENDING.definitionId, definitionVersionOrHash: profile.DEFENDING.origin, chosenResult: 'Disposable App condition witness', adjustmentReason: '' } };
  const r = await gm.evaluate(command => new Promise(resolve => __socket.emit('actor_consequence', command, resolve)), command); assert.equal(r.success, true, JSON.stringify(r));
}
async function proposal(gm, id, kind, amount) {
  const d = await producer.admitAndOpen(gm, id); await d.getByRole('combobox', { name: 'Creature or primary PC target', exact: true }).selectOption('character:app-hall:pc');
  if (kind === 'damage') { await d.getByLabel('d6 face 1', { exact: true }).fill('4'); await d.getByRole('button', { name: 'Record physical roll', exact: true }).click(); }
  else await d.getByRole('button', { name: 'Roll 1d8+1 once', exact: true }).click();
  await d.getByLabel(kind === 'damage' ? 'Proposed damage before equipment block' : 'Proposed healing', { exact: true }).fill(String(amount));
  if (kind === 'damage') await d.getByLabel('I rule that equipment blocking applies to this ability', { exact: true }).check();
  await d.getByLabel(kind === 'damage' ? 'Targeting and blocking applicability ruling (required)' : 'Targeting and healing ruling (required)', { exact: true }).fill('GM confirms authored targeting; this direct arcane damage permits the declared equipment block, healing has no equipment.');
  save(`${id}-proposal-${Date.now()}.aria.yml`, await d.ariaSnapshot());
  await d.getByRole('button', { name: 'Offer exact proposal to PC owner', exact: true }).click(); await d.waitFor({ state: 'detached' });
}
async function finish(gm) {
  await gm.getByRole('button', { name: 'Open retained creature action', exact: true }).click();
  await gm.getByRole('button', { name: 'Finish or explicitly cancel (keep evidence)', exact: true }).click(); if (await gm.locator('.creature-inspect-container').count()) await producer.closeInspect(gm);
}
async function main() {
  report.sourceBefore = require('./record-creature-pc-evidence.cjs').snapshot();
  const host = await require('../p9/integration/app-server.cjs').start();
  host.room.gameState.maps['app-hall'].characterTokens.pc.character.tempHealth = 3; // Disposable initial condition, before clients/attempts.
  for (const event of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_bind', 'actor_block_offer', 'actor_block_approve', 'actor_block_list', 'actor_blocking_view', 'actor_block_decline', 'actor_block_withdraw', 'character_updated', 'token_created', 'join_room']) host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const browser = await chromium.launch({ channel: 'chrome', headless: true }), pages = [];
  try {
    const gm = await browser.newPage({ viewport: { width: 1440, height: 1000 } }), owner = await browser.newPage({ viewport: { width: 1440, height: 1000 } }), observer = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); pages.push(gm, owner, observer);
    pages.forEach((p, i) => p.on('pageerror', e => report.errors.push({ role: ['gm', 'owner', 'observer'][i], error: e.message })));
    await setup(gm, host, 'app-gm'); await setup(owner, host, 'app-owner', true); await setup(observer, host, 'app-observer');
    await owner.locator('button.p12b-chip').click(); const od = ownerDialog(owner);
    await od.getByRole('button', { name: 'Add Disposable Hide (armor d8)', exact: true }).click(); await od.getByRole('button', { name: 'Save blocking declaration', exact: true }).click(); await od.getByText('Declared: Disposable Hide d8', { exact: true }).waitFor();
    await gm.evaluate(() => { S('gameStore').getState().setIsGMMode?.(true); });
    await producer.openBestiary(gm);
    const damage = await producer.author(gm, { creature: 'A5 Disposable Finch', name: 'A5 Ink Thorn', kind: 'damage', formula: '1d6+2', ap: 1, mana: 3, range: 30 });
    const healing = await producer.author(gm, { creature: 'A5 Disposable Doe', name: 'A5 Quiet Mend', kind: 'healing', formula: '1d8+1', ap: 0, mana: 0, range: 30 });
    await producer.closeLibrary(gm);
    await gm.evaluate(({ damage, healing }) => { const s = S('creatureStore').getState(); s.addCreatureToken(damage, { x: -150, y: -100 }, true, 'a5-source', false, 'app-hall'); s.addCreatureToken(healing, { x: 50, y: -100 }, true, 'a5-healer', false, 'app-hall'); }, { damage, healing });
    await gm.waitForFunction(() => __outbound.filter(x => x.event === 'token_created').length >= 2); await new Promise(r => setTimeout(r, 300)); report.checks.authorSaveReopenPlace = true;
    await proposal(gm, 'a5-source', 'damage', 6);
    assert.equal(await observer.evaluate(() => Object.keys(__blocking.store.getState().offers).length), 0, 'pending offer is owner/GM-private');
    const ownerCard = od.getByRole('article', { name: 'Block roll for A5 Ink Thorn', exact: true }); await ownerCard.waitFor();
    await owner.evaluate(() => { const emit = __socket.emit.bind(__socket); let drop = true; __socket.emit = (e, ...args) => { if (e === 'actor_block_approve' && drop) { drop = false; args[1] = () => {}; } return emit(e, ...args); }; });
    await ownerCard.getByLabel(/Natural face/).fill('2'); await ownerCard.getByRole('button', { name: 'Approve block roll', exact: true }).click();
    await od.getByText(/outcome unresolved/).waitFor({ timeout: 15000 });
    const rejoin = await owner.evaluate(async() => { const id = S('gameStore').getState().multiplayerRoom.id, ref = S('characterStore').getState().roomActorProjection?.ref;
      __socket.disconnect(); __socket.connect(); await new Promise(r => __socket.once('connect', r)); const joined = new Promise(r => __socket.once('room_joined', r)); __socket.emit('join_room', { roomId: id, playerName: 'app-owner', password: '', isReconnect: true }); await joined;
      return { listeners: __socket.listeners('room_joined').length, ref }; });
    assert.equal(rejoin.listeners, 1); report.checks.ownerRejoinOriginalIdentity = rejoin;
    await od.getByRole('button', { name: 'Check same block roll', exact: true }).click(); await od.getByText(/Awaiting the GM\.$/).waitFor();
    report.checks.lostOwnerAckSameApproval = true;
    const card = gmCard(gm); await card.getByLabel(/Non-physical damage: the GM rules/).check(); await card.getByRole('button', { name: 'Review block', exact: true }).click(); await card.getByText(/face 2/).first().waitFor();
    save('damage-pending.aria.yml', await card.ariaSnapshot());
    await gm.evaluate(() => { const handlers = __socket.listeners('actor_consequence_accepted'); __socket.removeAllListeners('actor_consequence_accepted'); __socket.on('actor_consequence_accepted', r => { if (r.receipt?.adjudication?.definitionId !== 'creature-attack-block') handlers.forEach(f => f(r)); }); const emit = __socket.emit.bind(__socket); __socket.emit = (e, ...args) => { if (e === 'actor_consequence' && args[0]?.approval) args[1] = () => {}; return emit(e, ...args); }; });
    const before = actors.clone(host.room.gameState.maps['app-hall'].tokens['a5-source'].state);
    await card.getByRole('button', { name: 'Confirm and apply', exact: true }).click();
    await observer.locator('.fct-chip').filter({ hasText: '−1 HP' }).waitFor({ timeout: 5000 }); report.checks.damageFloat = await observer.locator('.fct-chip').allTextContents(); assert.ok(report.checks.damageFloat.includes('3 absorbed'));
    await card.getByRole('button', { name: 'Check same command', exact: true }).waitFor({ timeout: 15000 });
    const receipt = actors.ledger(host.room).receipts.at(-1), count = actors.ledger(host.room).receipts.length, original = await gm.evaluate(() => __outbound.filter(x => x.event === 'actor_consequence' && x.payload.approval).at(-1).payload);
    assert.equal(host.room.gameState.maps['app-hall'].tokens['a5-source'].state.currentActionPoints, before.currentActionPoints - 1); assert.equal(host.room.gameState.maps['app-hall'].tokens['a5-source'].state.currentMana, before.currentMana - 3);
    await setup(gm, host, 'app-gm'); await gm.getByRole('button', { name: 'Check same command', exact: true }).last().click(); await gm.getByText(/Accepted: Ilse takes/).first().waitFor();
    assert.deepEqual(await gm.evaluate(() => __outbound.filter(x => x.event === 'actor_consequence' && x.payload.approval).at(-1).payload), original); assert.equal(actors.ledger(host.room).receipts.length, count);
    await owner.waitForFunction(() => S('characterStore').getState().equipment.chest.durability === 'd6'); report.checks.atomicDamageOwnerSheetReloadRecovery = { receipt, original };
    assert.equal(await gm.locator('.fct-chip').count(), 0); await finish(gm);
    // Actual Defending and subsequent pending removal, each using the same original block face.
    const defending = profile.makeDefendingRecord(host.refs.pc, crypto.randomUUID(), 'manual'); await condition(gm, host, defending, 'add');
    for (const expire of [false, true]) {
      await proposal(gm, 'a5-source', 'damage', 6); const oc = od.getByRole('article', { name: 'Block roll for A5 Ink Thorn', exact: true }); await oc.getByLabel(/Natural face/).fill('2'); await oc.getByRole('button', { name: 'Approve block roll', exact: true }).click();
      const c = gmCard(gm); await c.waitFor(); if (expire) await condition(gm, host, defending, 'remove');
      await c.getByLabel(/Non-physical damage: the GM rules/).check(); await c.getByRole('button', { name: 'Confirm and apply', exact: true }).click();
      if (expire) { await c.getByLabel('Why the recorded rolls still stand (public, required)', { exact: true }).fill('Defending removed while pending; original face2 applies normally.'); await c.getByRole('button', { name: 'Recorded rolls still stand — apply', exact: true }).click(); }
      await c.waitFor({ state: 'detached' }); const r = actors.ledger(host.room).receipts.at(-1), b = JSON.parse(r.adjudication.chosenResult).block;
      assert.deepEqual([b.face, b.reduction, b.defending], [2, expire ? 2 : 4, !expire]); report.checks[expire ? 'pendingExpiryRetainedRevalidation' : 'defendingDoublesNoWear'] = r; await finish(gm);
    }
    await proposal(gm, 'a5-healer', 'healing', 100); const healCard = od.getByRole('article', { name: 'Block roll for A5 Quiet Mend', exact: true }); await healCard.waitFor();
    const offeredHealing = require('../../../server/services/blockApprovals').listOffers(host.room).find(o => o.attack.ability.name === 'A5 Quiet Mend');
    const beforeRefusal = actors.clone(host.room.gameState);
    const foreign = { version: 1, roomId: host.room.id, approvalId: crypto.randomUUID(), actionEpoch: actors.epoch(host.room), baseCommitSequence: actors.ledger(host.room).commitSequence,
      source: offeredHealing.attack.source, target: offeredHealing.attack.target, attack: { commandId: offeredHealing.commandId, attackHash: offeredHealing.attackHash }, blocking: null, roll: null };
    const foreignResult = await observer.evaluate(a => new Promise(resolve => __socket.emit('actor_block_approve', a, resolve)), foreign); assert.equal(foreignResult.code, 'forbidden'); assert.deepEqual(host.room.gameState, beforeRefusal);
    const secondary = actors.clone(host.room.gameState.maps['app-hall'].characterTokens.pc); secondary.id = 'secondary'; secondary.state.actorContract = { ...secondary.state.actorContract, tokenId: 'secondary', instanceId: crypto.randomUUID(), primary: false }; host.room.gameState.maps['app-hall'].characterTokens.secondary = secondary;
    const secondAttack = actors.clone(offeredHealing.attack), secondaryRef = actors.refFor(secondary.state.actorContract); secondAttack.target = secondaryRef; secondAttack.authored.attempt.target = secondaryRef; secondAttack.authored.attempt.approvalId = crypto.randomUUID(); secondAttack.authored.targetRevision = secondary.state.actorContract.revision;
    const beforeSecondary = actors.clone(host.room.gameState); const secondaryResult = await gm.evaluate(({ attack, roomId }) => new Promise(resolve => __socket.emit('actor_block_offer', { roomId, commandId: attack.authored.attempt.approvalId, attack }, resolve)), { attack: secondAttack, roomId: host.room.id }); assert.equal(secondaryResult.code, 'secondary_attachment'); assert.deepEqual(host.room.gameState, beforeSecondary); delete host.room.gameState.maps['app-hall'].characterTokens.secondary;
    report.checks.foreignOwnerAndSecondaryRefused = { foreignResult, secondaryResult };
    await healCard.getByRole('button', { name: 'Accept this healing proposal', exact: true }).click();
    let hc = gmCard(gm); await hc.getByText('Exact owner explicitly accepted this proposal without equipment. No block roll or wear.', { exact: true }).waitFor();
    const beforeMaterial = actors.clone(host.room.gameState); await hc.getByLabel(/^Final HP healing/).fill('99'); await hc.getByRole('button', { name: 'Confirm and apply', exact: true }).click(); await hc.getByRole('alert').filter({ hasText: /Healing amount changed/ }).waitFor(); assert.deepEqual(host.room.gameState, beforeMaterial);
    // Actual explicit source readmission while the old owner acceptance is pending.
    const healerRegion = gm.getByRole('region', { name: 'Creature activated ability', exact: true }); await healerRegion.getByRole('button', { name: 'Admit for this creature', exact: true }).click();
    await healerRegion.getByRole('button', { name: 'Use for this creature', exact: true }).click(); const refreshed = gm.getByRole('dialog', { name: 'Creature ability action', exact: true });
    await refreshed.getByRole('button', { name: 'Refresh admission or change target (keep faces)', exact: true }).click();
    await refreshed.getByLabel('Proposed healing', { exact: true }).fill('99'); await refreshed.getByLabel('Targeting and healing ruling (required)', { exact: true }).fill('Explicitly refreshed source admission and revised healing99; original digital faces stand.');
    assert.equal(await refreshed.getByRole('button', { name: 'Roll 1d8+1 once', exact: true }).count(), 0);
    await refreshed.getByRole('button', { name: 'Offer exact proposal to PC owner', exact: true }).click(); await refreshed.waitFor({ state: 'detached' });
    const revisedOffer = require('../../../server/services/blockApprovals').listOffers(host.room).find(o => o.attack.ability.name === 'A5 Quiet Mend');
    assert.notEqual(revisedOffer.commandId, offeredHealing.commandId); assert.notEqual(revisedOffer.attack.authored.attempt.sourceAuthority.admissionId, offeredHealing.attack.authored.attempt.sourceAuthority.admissionId); assert.deepEqual(revisedOffer.attack.authored.attempt.roll, offeredHealing.attack.authored.attempt.roll);
    await healCard.getByRole('button', { name: 'Accept this healing proposal', exact: true }).click(); hc = gmCard(gm); await hc.waitFor(); await hc.getByRole('button', { name: 'Confirm and apply', exact: true }).click(); await hc.waitFor({ state: 'detached' });
    report.checks.materialHealingReapprovalAndAdmissionRefreshKeepFaces = { oldAttempt: offeredHealing.commandId, newAttempt: revisedOffer.commandId, roll: revisedOffer.attack.authored.attempt.roll };
    const hr = actors.ledger(host.room).receipts.at(-1); assert.equal(host.room.gameState.maps['app-hall'].characterTokens.pc.character.health.current, 40); assert.equal(hr.actors[1].equipmentWear, undefined); report.checks.explicitHealingCappedNoEquipment = hr;
    assert.equal(await observer.evaluate(() => Object.keys(__blocking.store.getState().offers).length), 0); report.checks.privatePending = true;
    const narrativeCount = await observer.evaluate(id => S('chatStore').getState().notifications.combat.filter(n => n.id.endsWith(id)).length, receipt.commandId); assert.equal(narrativeCount, 1); report.checks.onceOnlyNarration = narrativeCount;
    for (const p of pages) save(`final-${pages.indexOf(p)}.aria.yml`, await p.locator('body').ariaSnapshot());
    for (const width of [1440, 1024]) { await owner.setViewportSize({ width, height: 900 });
      const fit = await od.evaluate(el => { const r = el.getBoundingClientRect(), b = el.querySelector('header button').getBoundingClientRect(); return { panel: r.toJSON(), close: b.toJSON(), width: el.clientWidth, scrollWidth: el.scrollWidth, viewport: innerWidth }; });
      assert.ok(fit.panel.right <= width && fit.close.right <= width && fit.scrollWidth <= fit.width + 1, 'blocking panel and Close fit the actual column'); report.checks[`ownerFit${width}`] = fit;
      save(`owner-${width}.aria.yml`, await od.ariaSnapshot()); await owner.screenshot({ path: path.join(out, `owner-${width}.png`) }); }
    report.passed = true;
  } catch (e) { report.failure = e.stack; for (let i = 0; i < pages.length; i++) save(`failure-${i}.aria.yml`, await pages[i].locator('body').ariaSnapshot().catch(() => 'unavailable')); throw e; }
  finally { report.sourceAfter = require('./record-creature-pc-evidence.cjs').snapshot(); save('result.json', report); await browser.close(); await host.stop(); }
}
if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
