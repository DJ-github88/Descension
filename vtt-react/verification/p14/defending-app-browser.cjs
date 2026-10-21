// Real optimized App + registered backend. Provider/lease/cloud are fixture boundaries.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), crypto = require('crypto');
const { chromium } = require('playwright');
const out = process.env.C1_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External C1_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture');
const { setup } = require('../p9/integration/app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const save = (name, data) => fs.writeFileSync(path.join(out, name), typeof data === 'string' ? data : JSON.stringify(data, null, 2));
const result = { checks: {}, errors: [], limits: ['Optimized production App and registered backend; identity/provider, lease and cloud persistence are fixtures.',
  'Condition editing is manual state correction; prior Defend payment and expiry remain manual. No deployment/live Firebase claim.'] };
const editor = page => page.getByRole('region', { name: 'Shared PC Defending' });
async function ack(page, event, payload) { return page.evaluate(({event, payload}) => new Promise(resolve => __socket.emit(event, payload, resolve)), {event, payload}); }
async function init(page) {
  await page.evaluate(() => {
    const moduleWith = text => { const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); if (!pair) throw Error(text); return __req(pair[0]); };
    const relay = Object.values(moduleWith('[roomRejoin] subscriber failed')).find(fn => typeof fn === 'function' && fn.toString().includes('room_joined')); relay(__socket);
    window.__condition = moduleWith('Condition preparation already pending. No duplicate command created.');
    window.__conditionStore = Object.values(__condition).find(v => typeof v?.getState === 'function' && 'saved' in v.getState());
    window.__blockPlan = Object.values(moduleWith('The approval names a different attack.')).find(v => typeof v === 'function' && v.toString().includes('The approval names a different attack.'));
    const uid = S('authStore').getState().user.uid;
    S('gameStore').setState({ currentPlayer: { id: uid, userId: uid }, cameraX: 1100, cameraY: 300, gridType: 'square', gridSize: 50 });
  });
}
async function gmEditor(page) {
  await page.getByRole('combobox', { name: 'Exact room attachment' }).selectOption('character:pc');
  await page.getByRole('button', { name: 'Edit selected PC Defending', exact: true }).click();
  await editor(page).getByText('Current room state: Inactive.', { exact: true }).waitFor();
}
async function tokenEditor(page) {
  await page.locator('.character-token').first().click({ button: 'right' });
  await page.getByText('Status', { exact: true }).hover();
  await page.getByText('Conditions', { exact: true }).last().click();
}
async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const event of ['actor_snapshot', 'actor_consequence', 'actor_blocking_view', 'actor_block_offer', 'actor_block_approve'])
    host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 }); // Bounded accelerated witness, as in production-stack tests.
  host.room.gameState.maps['app-hall'].characterTokens.pc.playerId = 'app-owner'; // Normal presentation identity fixture; exact P7 ref remains unchanged.
  host.room.gameState.maps['app-hall'].characterTokens.pc.character.equipment = { chest: { id: 'witness-hide', name: 'Witness Hide', type: 'armor', subtype: 'LEATHER' } };
  const browser = await chromium.launch({ channel: 'chrome', headless: true }); const pages = {};
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['owner', 'app-owner'], ['observer', 'app-observer']]) {
      const page = pages[role] = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
      page.on('pageerror', e => result.errors.push({ role, message: e.message })); await setup(page, host.url, uid); await init(page);
    }
    const { gm, owner, observer } = pages, ref = host.refs.pc;
    const current = () => actors.locate(host.room, ref).token;
    const base = () => ({ version: 1, roomId: host.room.id, commandId: crypto.randomUUID(), actionEpoch: actors.epoch(host.room), baseCommitSequence: actors.ledger(host.room).commitSequence });
    const declared = await ack(owner, 'actor_consequence', { ...base(), actors: [{ ref, expectedRevision: current().state.actorContract.revision,
      blockingDeclaration: { beforeRevision: 0, mode: 'block', pieces: [{ slot: 'chest', itemId: 'witness-hide', name: 'Witness Hide', kind: 'armor', currentDie: 'd8' }] } }] });
    assert.equal(declared.success, true, JSON.stringify(declared));
    async function preparedHit() {
      const commandId = crypto.randomUUID(), source = host.refs.A, sourceToken = actors.locate(host.room, source).token;
      const attack = { capability: 'p12b-attack:v1', source, target: ref, sourceRevision: sourceToken.state.actorContract.revision,
        ability: { id: null, name: 'Manual witness hit' }, roll: { mode: 'physical', dice: '1d10', faces: [7] }, outcome: 'hit', damageType: 'slicing', proposedDamage: 7, apCost: 0 };
      const offered = await ack(gm, 'actor_block_offer', { roomId: host.room.id, commandId, attack }); assert.equal(offered.success, true, JSON.stringify(offered));
      const view = await ack(owner, 'actor_blocking_view', { roomId: host.room.id, ref });
      const approval = { version: 1, roomId: host.room.id, approvalId: crypto.randomUUID(), actionEpoch: actors.epoch(host.room), baseCommitSequence: actors.ledger(host.room).commitSequence,
        source, target: ref, attack: { commandId, attackHash: offered.attackHash }, blocking: { revision: view.declaration.revision, slot: 'chest', itemId: 'witness-hide', die: 'd8' }, roll: { mode: 'physical', faces: [2] } };
      const registered = await ack(owner, 'actor_block_approve', approval); assert.equal(registered.code, 'awaiting_gm', JSON.stringify(registered));
      return { offered: { commandId, attack, attackHash: offered.attackHash }, entry: { approval, contentHash: registered.contentHash }, declaration: view.declaration };
    }
    async function planHit(hit) {
      await gm.evaluate(() => __actors.refreshActorSnapshot());
      const plan = await gm.evaluate(hit => __blockPlan({ offer: hit.offered, entry: hit.entry,
        sourceToken: S('creatureStore').getState().creatureTokens.find(t => t.id === 'A'), targetToken: S('characterTokenStore').getState().characterTokens.find(t => t.id === 'pc'),
        declaration: hit.declaration, names: { source: 'A', target: 'Ilse' } }), hit);
      return { ...base(), commandId: plan.commandId, actors: plan.entries, ...plan.extra };
    }
    const unchanged = JSON.stringify(current().character);
    await gmEditor(gm); await tokenEditor(owner);
    await editor(owner).getByText('Current room state: Inactive.', { exact: true }).waitFor();
    await editor(owner).getByRole('button', { name: 'Apply PC Defending', exact: true }).click();
    await editor(gm).getByText('Current room state: Active — accepted Defending.', { exact: true }).waitFor();
    await owner.locator('.conditions-window .close-button').click();
    const id = current().state.conditions[0].recordId; assert.ok(id);
    for (const page of [owner, observer]) await page.waitForFunction(id => S('characterTokenStore').getState().characterTokens.find(t => t.id === 'pc')?.state.conditions.some(r => r.recordId === id), id);
    assert.equal(JSON.stringify(current().character), unchanged); result.checks.acceptedSameRecord = id;
    await editor(gm).getByRole('button', { name: 'Apply PC Defending', exact: true }).click();
    await editor(gm).getByText(/Already active in accepted room state/).waitFor(); assert.equal(current().state.conditions.length, 1);
    result.checks.activeBlocks = [];
    for (let i = 0; i < 2; i++) {
      const hit = await preparedHit(), accepted = await ack(gm, 'actor_consequence', await planHit(hit)); assert.equal(accepted.success, true, JSON.stringify(accepted));
      const chosen = JSON.parse(accepted.receipt.adjudication.chosenResult); assert.equal(chosen.block.reduction, 4); assert.equal(current().state.equipmentBlocking.pieces[0].currentDie, 'd8');
      result.checks.activeBlocks.push({ commandId: accepted.receipt.commandId, face: chosen.block.face, reduction: chosen.block.reduction, die: 'd8' });
    }
    const pending = await preparedHit(), oldPlan = await planHit(pending);
    save('gm-active.aria.yml', await editor(gm).ariaSnapshot());
    // Token entry: real context menu and existing ConditionsWindow, no test component mount.
    await gm.getByRole('button', { name: 'Close shared condition editor' }).click();
    await tokenEditor(owner);
    await editor(owner).getByText('Current room state: Active — accepted Defending.', { exact: true }).waitFor();
    assert.equal(await owner.locator('.current-conditions .remove-condition').count(), 0, 'old named-record X bypass is absent');
    save('owner-token-active.aria.yml', await editor(owner).ariaSnapshot());
    result.checks.tokenSameRecord = await editor(owner).getByText(`Condition instance: ${id}`, { exact: true }).count();
    await owner.locator('.conditions-window .close-button').click();
    await owner.keyboard.press('c');
    await owner.getByRole('dialog', { name: 'Character Sheet', exact: true }).getByRole('button', { name: 'Stats', exact: true }).click();
    await owner.mouse.move(1300, 850);
    save('owner-sheet-open.aria.yml', await owner.locator('body').ariaSnapshot());
    await owner.getByRole('button', { name: 'Sheet shared PC Defending', exact: true }).click();
    await editor(owner).getByText(`Condition instance: ${id}`, { exact: true }).waitFor();
    result.checks.sheetSameRecord = id;
    await editor(owner).getByRole('button', { name: `Remove Defending instance ${id}`, exact: true }).click();
    await editor(owner).getByText('Current room state: Inactive.', { exact: true }).waitFor(); assert.equal(current().state.conditions.length, 0);
    result.checks.sheetRemoval = true;
    const stale = await ack(gm, 'actor_consequence', oldPlan); assert.equal(stale.success, false);
    const corrected = await ack(gm, 'actor_consequence', await planHit(pending)); assert.equal(corrected.success, true, JSON.stringify(corrected));
    const chosen = JSON.parse(corrected.receipt.adjudication.chosenResult);
    assert.deepEqual([chosen.block.face, chosen.block.reduction, chosen.block.defending], [2, 2, false]); assert.equal(current().state.equipmentBlocking.pieces[0].currentDie, 'd6');
    result.checks.retainedBlockAfterRemoval = { staleCode: stale.code, face: 2, reduction: 2, afterDie: 'd6' };
    // Browser refresh reuses device custody and reads canonical state; manual timing never runs a local expiry.
    await owner.evaluate(() => {
      const handlers = __socket.listeners('actor_consequence_accepted'); __socket.removeAllListeners('actor_consequence_accepted');
      __socket.on('actor_consequence_accepted', result => { if (result.receipt?.adjudication?.definitionId === 'manual-pc-defending') return; for (const handler of handlers) handler(result); });
      const emit = __socket.emit.bind(__socket); __socket.emit = (event, ...args) => {
        if (event === 'actor_consequence' && args[0]?.adjudication?.definitionId === 'manual-pc-defending' && typeof args[1] === 'function') args[1] = () => {};
        return emit(event, ...args);
      };
    });
    await editor(owner).getByRole('button', { name: 'Apply PC Defending', exact: true }).click();
    await editor(owner).getByText('Current room state: Active — accepted Defending.', { exact: true }).waitFor();
    const second = current().state.conditions[0].recordId;
    assert.equal(await editor(owner).getByRole('button', { name: 'Apply PC Defending', exact: true }).isDisabled(), true, 'unknown custody prevents a replacement');
    save('lost-ack.aria.yml', await editor(owner).ariaSnapshot());
    await owner.reload(); await setup(owner, host.url, 'app-owner'); await init(owner);
    await owner.waitForFunction(id => S('characterTokenStore').getState().characterTokens.find(t => t.id === 'pc')?.state.conditions.some(r => r.recordId === id), second);
    const retained = await owner.evaluate(() => __conditionStore.getState().saved);
    const unknown = Object.values(retained.entries).find(e => e.recordId === second);
    assert.equal(unknown.phase, 'unknown'); result.checks.lostAckCommand = unknown.command.commandId;
    await owner.getByRole('combobox', { name: 'Exact room attachment' }).selectOption('character:pc');
    await owner.getByRole('button', { name: 'Edit selected PC Defending', exact: true }).click();
    await editor(owner).getByRole('button', { name: 'Check same condition command', exact: true }).click();
    await owner.waitForFunction(commandId => Object.values(__conditionStore.getState().saved.entries).some(e => e.command.commandId === commandId && e.phase === 'accepted'), unknown.command.commandId);
    assert.equal(current().state.conditions.length, 1); result.checks.sameCommandRecovered = true;
    result.checks.reloadSameRecord = second;
    const reconnect = await owner.evaluate(async () => {
      __socket.disconnect(); __socket.connect(); await new Promise(r => __socket.once('connect', r));
      const roomId = S('gameStore').getState().multiplayerRoom.id;
      const joined = new Promise(r => __socket.once('room_joined', r)); __socket.emit('join_room', { roomId, playerName: 'app-owner', password: '' }); await joined;
      return __actors.refreshActorSnapshot();
    }); assert.equal(reconnect.success, true);
    assert.equal(current().state.conditions[0].recordId, second); result.checks.reconnectSameRecord = second;
    const codec = require('../../../server/services/roomCheckpoint');
    const built = codec.buildCheckpointDocuments({ roomId: host.room.id, gameState: host.room.gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(d => [d.mapId, d.data])) });
    assert.equal(decoded.ok, true); assert.equal(decoded.maps['app-hall'].characterTokens.pc.state.conditions[0].recordId, second);
    result.checks.checkpointSameRecord = second;
    await gm.getByRole('button', { name: 'Edit selected PC Defending', exact: true }).click();
    await editor(gm).getByText('Current room state: Active — accepted Defending.', { exact: true }).waitFor();
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }]) {
      await gm.setViewportSize(viewport); save(`layout-${viewport.width}.json`, await gm.locator('.sc-dialog').evaluate(el => ({ rect: el.getBoundingClientRect().toJSON(), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth })));
    }
    await owner.getByRole('button', { name: 'Close shared condition editor', exact: true }).click();
    await tokenEditor(owner);
    await editor(owner).getByRole('button', { name: 'Refresh accepted condition state', exact: true }).click();
    save('post-rejoin-state.json', await owner.evaluate(() => ({ view: __conditionStore.getState(), status: S('gameStore').getState().actorConsequenceStatus, token: S('characterTokenStore').getState().characterTokens.find(t => t.id === 'pc') })));
    await editor(owner).getByRole('button', { name: `Remove Defending instance ${second}`, exact: true }).click();
    await editor(gm).getByText('Current room state: Inactive.', { exact: true }).waitFor();
    assert.equal(current().state.conditions.length, 0); result.checks.tokenExactRemoval = true;
    save('final.aria.yml', await gm.locator('.sc-dialog').ariaSnapshot()); result.passed = true;
  } catch (e) {
    result.failure = e.stack;
    for (const [role, page] of Object.entries(pages)) save(`${role}-failure.aria.yml`, await page.locator('body').ariaSnapshot().catch(() => 'unavailable'));
    throw e;
  } finally { save('result.json', result); await browser.close(); await host.stop(); }
}
main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
