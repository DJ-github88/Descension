// C4 optimized production-App witness; cloud/identity/lease are fixtures, not live acceptance.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.C4_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External C4_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture');
const { setup } = require('../p9/integration/app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const profile = require('../../src/services/sharedConditionProfile');
const timing = require('../../src/services/sharedEffectTiming');
const save = (name, data) => fs.writeFileSync(path.join(out, name), typeof data === 'string' ? data : JSON.stringify(data, null, 2));
const result = { checks: {}, errors: [], limits: ['Optimized real App and registered backend; identity/provider, lease and cloud fixture boundaries.',
  'Only new canonical own-turn PC Defending and named C3 Shield Bash in an explicitly adopted roster. No price/regen/recurring/one-round/ancestry execution or live Firebase claim.'] };
const editor = p => p.getByRole('region', { name: 'Shared PC Defending', exact: true });
const stun = p => p.getByRole('region', { name: 'Shared Stunned', exact: true });
const clockUI = p => p.getByRole('region', { name: 'Authenticated turn expiry', exact: true });
const bashUI = p => p.getByRole('region', { name: 'Shield Bash manual result', exact: true });
async function ack(page, event, payload) { return page.evaluate(({event, payload}) => new Promise(resolve => __socket.emit(event, payload, resolve)), {event, payload}); }
async function init(page) {
  await page.evaluate(() => {
    const moduleWith = text => { const entry = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); if (!entry) throw Error(text); return __req(entry[0]); };
    Object.values(moduleWith('[roomRejoin] subscriber failed')).find(fn => typeof fn === 'function' && fn.toString().includes('room_joined'))(__socket);
    window.__conditionModule = moduleWith('Condition preparation already pending. No duplicate command created.');
    window.__conditions = Object.values(__conditionModule).find(v => typeof v?.getState === 'function' && 'saved' in v.getState());
    window.__blockPlan = Object.values(moduleWith('The approval names a different attack.')).find(v => typeof v === 'function' && v.toString().includes('The approval names a different attack.'));
    window.__combat = Object.values(moduleWith('forceResetCombat:')).find(v => typeof v?.getState === 'function' && 'nextTurn' in v.getState());
    // The real mounted SharedConditionHost consumes combat retirement and uses silent hydration.
    // Legacy receiver callbacks are independently exercised by the focused production-module tests.
    const uid = S('authStore').getState().user.uid;
    S('gameStore').setState({ currentPlayer: { id: uid, userId: uid }, cameraX: 1100, cameraY: 300, gridType: 'square', gridSize: 50 });
  });
}
async function openClock(page) { await page.getByRole('button', { name: 'Shared turn expiry', exact: true }).click(); await clockUI(page).waitFor(); }
async function closeShared(page) { await page.getByRole('button', { name: 'Close shared condition editor', exact: true }).last().click(); }
async function tokenEditor(page) { await page.locator('.character-token').first().click({ button: 'right' }); await page.getByText('Status', { exact: true }).hover(); await page.getByText('Conditions', { exact: true }).last().click(); await editor(page).waitFor(); }
async function sheetEditor(page) { await page.keyboard.press('c'); const stats = page.getByRole('dialog', { name: 'Character Sheet', exact: true }).getByRole('button', { name: 'Stats', exact: true }); await stats.focus(); await stats.press('Enter'); await page.mouse.move(1300, 850); const entry = page.getByRole('button', { name: 'Sheet shared PC Defending', exact: true }); await entry.focus(); await entry.press('Enter'); await editor(page).waitFor(); }
async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const event of ['actor_snapshot', 'actor_consequence', 'actor_turn_boundary', 'actor_blocking_view', 'actor_block_offer', 'actor_block_approve', 'combat_started', 'combat_ended', 'join_room']) host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const pc = host.room.gameState.maps['app-hall'].characterTokens.pc;
  pc.playerId = 'app-owner'; pc.character.equipment = { chest: { id: 'c4-hide', name: 'C4 Hide', type: 'armor', subtype: 'LEATHER' } };
  const browser = await chromium.launch({ channel: 'chrome', headless: true }), pages = {};
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner'], ['observer', 'app-observer']]) {
      const page = pages[role] = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); page.on('pageerror', e => result.errors.push({ role, message: e.message }));
      await setup(page, host.url, uid); await init(page);
    }
    const { gm, owner, observer } = pages, ref = host.refs.pc, source = host.refs.A;
    const current = () => actors.locate(host.room, ref).token;
    const base = () => ({ version: 1, roomId: host.room.id, commandId: crypto.randomUUID(), actionEpoch: actors.epoch(host.room), baseCommitSequence: actors.ledger(host.room).commitSequence });
    const start = () => ack(gm, 'combat_started', { roomId: host.room.id, turnOrder: [ref, source].map(actorRef => ({ tokenId: actorRef.tokenId, actorRef })), currentTurnIndex: 0, round: 1 });
    assert.equal((await ack(owner, 'actor_consequence', { ...base(), actors: [{ ref, expectedRevision: current().state.actorContract.revision,
      blockingDeclaration: { beforeRevision: 0, mode: 'block', pieces: [{ slot: 'chest', itemId: 'c4-hide', name: 'C4 Hide', kind: 'armor', currentDie: 'd8' }] } }] })).success, true);
    assert.equal((await start()).success, true); await openClock(gm);
    await clockUI(gm).getByRole('button', { name: 'Enable authenticated turn expiry', exact: true }).click();
    await gm.waitForFunction(() => __conditions.getState().combat?.effectLifecycle?.sequence === 0);
    const combatId = host.room.gameState.combat.effectLifecycle.id;
    assert.equal(await owner.getByRole('button', { name: 'Shared turn expiry', exact: true }).count(), 0);
    await tokenEditor(owner); await editor(owner).getByRole('button', { name: 'Apply PC Defending', exact: true }).click();
    await editor(owner).getByText(/Automatic at start of your next turn/).waitFor(); const defending = current().state.conditions.find(r => r.conditionKey === 'defending').recordId;
    assert.equal(timing.scheduleFor(current().state.conditions[0], host.room.gameState.combat).dueSequence, 2);
    await owner.locator('.conditions-window .close-button').click(); await sheetEditor(owner); await editor(owner).getByText(/Automatic at start of your next turn/).waitFor();
    await closeShared(owner); await owner.keyboard.press('c');
    async function preparedHit() {
      const commandId = crypto.randomUUID(), sourceToken = actors.locate(host.room, source).token;
      const attack = { capability: 'p12b-attack:v1', source, target: ref, sourceRevision: sourceToken.state.actorContract.revision,
        ability: { id: null, name: 'C4 manual witness hit' }, roll: { mode: 'physical', dice: '1d10', faces: [7] }, outcome: 'hit', damageType: 'slicing', proposedDamage: 7, apCost: 0 };
      const offered = await ack(gm, 'actor_block_offer', { roomId: host.room.id, commandId, attack }); assert.equal(offered.success, true, JSON.stringify(offered));
      const view = await ack(owner, 'actor_blocking_view', { roomId: host.room.id, ref });
      const approval = { version: 1, roomId: host.room.id, approvalId: crypto.randomUUID(), actionEpoch: actors.epoch(host.room), baseCommitSequence: actors.ledger(host.room).commitSequence,
        source, target: ref, attack: { commandId, attackHash: offered.attackHash }, blocking: { revision: view.declaration.revision, slot: 'chest', itemId: 'c4-hide', die: 'd8' }, roll: { mode: 'physical', faces: [2] } };
      const registered = await ack(owner, 'actor_block_approve', approval); assert.equal(registered.code, 'awaiting_gm');
      return { offered: { commandId, attack, attackHash: offered.attackHash }, entry: { approval, contentHash: registered.contentHash }, declaration: view.declaration };
    }
    async function planHit(hit) {
      await gm.evaluate(() => __actors.refreshActorSnapshot());
      const plan = await gm.evaluate(hit => __blockPlan({ offer: hit.offered, entry: hit.entry, sourceToken: S('creatureStore').getState().creatureTokens.find(t => t.id === 'A'),
        targetToken: S('characterTokenStore').getState().characterTokens.find(t => t.id === 'pc'), declaration: hit.declaration, names: { source: 'A', target: 'Ilse' } }), hit);
      return { ...base(), commandId: plan.commandId, actors: plan.entries, ...plan.extra };
    }
    const activeHit = await preparedHit(), active = await ack(gm, 'actor_consequence', await planHit(activeHit)); assert.equal(active.success, true, JSON.stringify(active));
    assert.equal(JSON.parse(active.receipt.adjudication.chosenResult).block.reduction, 4); assert.equal(current().state.equipmentBlocking.pieces[0].currentDie, 'd8');
    const pendingHit = await preparedHit(), stalePlan = await planHit(pendingHit), beforeTurn = JSON.stringify(current().character);
    async function advance(expected) { await clockUI(gm).getByRole('button', { name: 'Advance authenticated turn', exact: true }).click(); await gm.waitForFunction(seq => __conditions.getState().combat?.effectLifecycle?.sequence === seq, expected); }
    await gm.evaluate(() => { const before = __combat.getState().currentTurnIndex; __combat.getState().nextTurn(); if (__combat.getState().currentTurnIndex !== before) throw Error('Optimistic authenticated turn mutation'); });
    await gm.waitForFunction(() => __conditions.getState().combat?.effectLifecycle?.sequence === 1); assert.equal(profile.holdsDefending(current()), true);
    // Lose the due transition ACK and actor broadcast. Its retained identity must not be replaced.
    await gm.evaluate(() => {
      const handlers = __socket.listeners('actor_consequence_accepted'); __socket.removeAllListeners('actor_consequence_accepted');
      __socket.on('actor_consequence_accepted', r => { if (r.receipt?.adjudication?.definitionId === 'shared-turn-boundary:v1') return; handlers.forEach(fn => fn(r)); });
      const emit = __socket.emit.bind(__socket); __socket.emit = (event, ...args) => { if (event === 'actor_turn_boundary' && typeof args[1] === 'function') args[1] = () => {}; return emit(event, ...args); };
    });
    await clockUI(gm).getByRole('button', { name: 'Advance authenticated turn', exact: true }).click();
    await owner.waitForFunction(id => !S('characterTokenStore').getState().characterTokens.find(t => t.id === 'pc').state.conditions.some(r => r.recordId === id), defending);
    assert.equal(profile.holdsDefending(current()), false); assert.equal(JSON.stringify(current().character), beforeTurn);
    const retained = await gm.evaluate(() => Object.values(__conditions.getState().saved.entries).find(e => e.kind === 'turn-boundary').command);
    assert.equal(retained.expectedClock.sequence, 1); assert.equal(host.room.gameState.combat.effectLifecycle.sequence, 2);
    await gm.reload(); await setup(gm, host.url, 'app-gm'); await init(gm); await openClock(gm);
    await clockUI(gm).getByText(/Turn command: unknown/).waitFor(); assert.equal(await clockUI(gm).getByRole('button', { name: 'Advance authenticated turn', exact: true }).isDisabled(), true);
    assert.deepEqual(await gm.evaluate(() => Object.values(__conditions.getState().saved.entries).find(e => e.kind === 'turn-boundary').command), retained);
    const cut = actors.ledger(host.room).commitSequence;
    await clockUI(gm).getByRole('button', { name: 'Check original turn command' }).click(); await clockUI(gm).getByText(/Turn command: accepted/).waitFor(); assert.equal(actors.ledger(host.room).commitSequence, cut);
    assert.equal((await ack(gm, 'actor_consequence', stalePlan)).success, false);
    const normal = await ack(gm, 'actor_consequence', await planHit(pendingHit)); assert.equal(normal.success, true, JSON.stringify(normal));
    const block = JSON.parse(normal.receipt.adjudication.chosenResult).block; assert.deepEqual([block.face, block.reduction, block.defending], [2, 2, false]); assert.equal(current().state.equipmentBlocking.pieces[0].currentDie, 'd6');
    result.checks.defendingExpiryActualBlockAndLostAck = { defending, combatId, originalTurnCommand: retained.commandId, before: { face: 2, reduction: 4, die: 'd8' }, after: { face: 2, reduction: 2, die: 'd6' } };
    await closeShared(gm); await gm.getByRole('button', { name: 'Record Shield Bash result', exact: true }).click();
    await bashUI(gm).getByRole('button', { name: 'Prepare Shield Bash result', exact: true }).click(); await bashUI(gm).getByLabel('Exact Shield Bash source').selectOption(JSON.stringify(source)); await bashUI(gm).getByLabel('Exact Shield Bash target').selectOption(JSON.stringify(ref));
    await bashUI(gm).getByRole('checkbox').check(); await bashUI(gm).getByRole('button', { name: 'Record confirmed Shield Bash Stunned', exact: true }).click(); await bashUI(gm).getByText(/Automatic at end of target's next turn/).waitFor();
    const bashRecord = current().state.conditions.find(r => r.conditionKey === 'stunned'), bashId = bashRecord.recordId; assert.equal(timing.scheduleFor(bashRecord, host.room.gameState.combat).dueSequence, 5);
    const criticalId = crypto.randomUUID(), critical = profile.makeStunnedRecord(ref, criticalId, { sourceActor: source, sourceOccurrence: 'C4 critical manual', timing: 'critical-one-round' });
    assert.equal((await ack(gm, 'actor_consequence', { ...base(), target: ref, actors: [{ ref, expectedRevision: current().state.actorContract.revision, conditions: [{ op: 'add', recordId: criticalId, record: critical }] }],
      adjudication: { definitionId: profile.STUNNED.definitionId, definitionVersionOrHash: profile.STUNNED.origin, chosenResult: 'Manual independent critical' } })).success, true);
    await closeShared(gm); await openClock(gm);
    await gm.evaluate(async() => { __socket.disconnect(); __socket.connect(); await new Promise(r => __socket.once('connect', r)); const joined = new Promise(r => __socket.once('room_joined', r)); __socket.emit('join_room', { roomId: S('gameStore').getState().multiplayerRoom.id, playerName: 'app-gm', password: '', isReconnect: true }); await joined; });
    await gm.waitForFunction(() => __conditions.getState().clockPhase === 'ready'); assert.equal(timing.scheduleFor(bashRecord, host.room.gameState.combat).dueSequence, 5);
    await advance(3); assert.equal(current().state.conditions.length, 2); await advance(4); assert.equal(current().state.conditions.length, 2);
    const refused = await owner.evaluate(async ref => { const p = new Promise(r => __socket.once('room_error', r)); __socket.emit('character_moved', { roomId: ref.roomId, mapId: ref.mapId, tokenId: ref.tokenId, position: { x: 950, y: 300 } }); return p; }, ref); assert.equal(refused.code, 'actor_stunned');
    await advance(5); assert.deepEqual(current().state.conditions.map(r => r.recordId), [criticalId]);
    await owner.evaluate(() => { S('conditionStore').getState().updateConditionTimers('debuff'); S('creatureStore').getState().cleanupExpiredConditions(); S('characterTokenStore').getState().cleanupExpiredConditions(); }); assert.deepEqual(current().state.conditions.map(r => r.recordId), [criticalId]);
    await sheetEditor(owner); await stun(owner).getByText(`Stunned instance: ${criticalId}`, { exact: true }).waitFor(); assert.equal(await stun(owner).getByText(`Stunned instance: ${bashId}`, { exact: true }).count(), 0);
    await stun(owner).getByRole('button', { name: `Remove Stunned instance ${criticalId}`, exact: true }).click(); await stun(owner).getByText('Stunned inactive.', { exact: true }).waitFor(); await closeShared(owner); await owner.keyboard.press('c');
    result.checks.shieldBashStrictNextEndIndependentCriticalReconnect = { bashId, criticalId, dueSequence: 5 };
    // Ending/restarting retires the clock, never conditions; receivers must not echo a reset.
    await tokenEditor(owner); await editor(owner).getByRole('button', { name: 'Apply PC Defending', exact: true }).click(); await editor(owner).getByText(/Until your next turn — GM removes/).waitFor(); const manualId = current().state.conditions[0].recordId; await owner.locator('.conditions-window .close-button').click();
    assert.equal((await ack(gm, 'combat_ended', { roomId: host.room.id })).success, true); await gm.waitForFunction(() => __combat.getState().effectLifecycle === null);
    assert.equal((await start()).success, true); await gm.waitForFunction(() => __combat.getState().isInCombat && !__combat.getState().effectLifecycle && __conditions.getState().clockPhase === 'ready');
    assert.equal(host.room.gameState.combat.isActive, true); assert.equal(current().state.conditions[0].recordId, manualId); assert.equal(host.room.gameState.combat.effectLifecycle, undefined);
    result.checks.payloadlessEndRestartRetiresWithoutCleanupOrResetEcho = manualId;
    save('desktop.aria.yml', await clockUI(gm).ariaSnapshot()); await gm.screenshot({ path: path.join(out, 'desktop.png') }); await gm.setViewportSize({ width: 1024, height: 768 });
    const bounds = await clockUI(gm).evaluate(el => ({ width: el.scrollWidth, client: el.clientWidth, right: el.getBoundingClientRect().right })); assert.equal(bounds.width, bounds.client); assert.ok(bounds.right <= 1024);
    save('tablet.aria.yml', await clockUI(gm).ariaSnapshot()); await gm.screenshot({ path: path.join(out, 'tablet.png') }); result.checks.tablet = bounds; result.passed = true;
  } catch (error) { result.failure = error.stack; for (const [role, page] of Object.entries(pages)) save(`${role}-failure.aria.yml`, await page.locator('body').ariaSnapshot().catch(() => 'unavailable')); throw error;
  } finally { save('result.json', result); await browser.close(); host.server.closeAllConnections(); await Promise.race([host.stop(), new Promise(r => setTimeout(r, 3000))]); }
}
main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
