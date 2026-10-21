// C3 only: optimized real App + registered backend; provider/lease/cloud are fixture boundaries.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), crypto = require('crypto');
const { chromium } = require('playwright');
const out = process.env.C3_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External C3_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture');
const { setup } = require('../p9/integration/app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const profile = require('../../src/services/sharedConditionProfile');
const bash = require('../../src/services/shieldBashResult');
const save = (name, data) => fs.writeFileSync(path.join(out, name), typeof data === 'string' ? data : JSON.stringify(data, null, 2));
const result = { checks: {}, errors: [], limits: ['Real optimized App/router/components and registered production socket stack. Provider/identity/lease/cloud are fixtures.',
  'GM-attested manual result only. Costs/save/eligibility/order/expiry/advantage remain manual. No live Firebase, second physical device or deployment claim.'] };
const form = p => p.getByRole('region', { name: 'Shield Bash manual result', exact: true });
const stun = p => p.getByRole('region', { name: 'Shared Stunned', exact: true });
async function ack(page, event, payload) { return page.evaluate(({event, payload}) => new Promise(resolve => __socket.emit(event, payload, resolve)), {event, payload}); }
async function init(page) {
  await page.evaluate(() => {
    const moduleWith = text => { const entry = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); if (!entry) throw Error(text); return __req(entry[0]); };
    Object.values(moduleWith('[roomRejoin] subscriber failed')).find(fn => typeof fn === 'function' && fn.toString().includes('room_joined'))(__socket);
    window.__conditions = Object.values(moduleWith('Condition preparation already pending. No duplicate command created.')).find(v => typeof v?.getState === 'function' && 'saved' in v.getState());
    const uid = S('authStore').getState().user.uid;
    S('gameStore').setState({ currentPlayer: { id: uid, userId: uid }, cameraX: 1100, cameraY: 300, gridType: 'square', gridSize: 50 });
  });
}
async function open(page) { await page.getByRole('button', { name: 'Record Shield Bash result', exact: true }).click(); await form(page).waitFor(); }
async function prepare(page, source, target) {
  await form(page).getByRole('button', { name: /Prepare (separate later )?Shield Bash result/, exact: true }).click();
  assert.equal(await form(page).getByLabel('Exact Shield Bash source').inputValue(), ''); assert.equal(await form(page).getByLabel('Exact Shield Bash target').inputValue(), '');
  await form(page).getByLabel('Exact Shield Bash source').selectOption(JSON.stringify(source));
  await form(page).getByLabel('Exact Shield Bash target').selectOption(JSON.stringify(target));
  await form(page).getByRole('checkbox').check();
}
async function record(page) {
  await form(page).getByRole('button', { name: 'Record confirmed Shield Bash Stunned', exact: true }).focus();
  await form(page).getByRole('button', { name: 'Record confirmed Shield Bash Stunned', exact: true }).press('Enter');
}
async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const event of ['actor_snapshot', 'actor_consequence', 'actor_strike_approve', 'actor_strike_withdraw', 'join_room']) host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  host.room.gameState.maps['app-hall'].characterTokens.pc.playerId = 'app-owner';
  const browser = await chromium.launch({ channel: 'chrome', headless: true }), pages = {};
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['observer', 'app-observer'], ['owner', 'app-owner']]) {
      const page = pages[role] = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
      page.on('pageerror', e => result.errors.push({ role, message: e.message })); await setup(page, host.url, uid); await init(page);
    }
    const { gm, owner, observer } = pages, target = host.refs.pc, source = host.refs.A;
    const current = () => actors.locate(host.room, target).token;
    const before = JSON.stringify([current().character, actors.locate(host.room, source).token]);
    const base = commandId => ({ version: 1, roomId: host.room.id, commandId: commandId || crypto.randomUUID(), actionEpoch: actors.epoch(host.room), baseCommitSequence: actors.ledger(host.room).commitSequence });
    assert.equal(await owner.getByRole('button', { name: 'Record Shield Bash result', exact: true }).count(), 0);
    assert.equal(await observer.getByRole('button', { name: 'Record Shield Bash result', exact: true }).count(), 0);
    await open(gm); await form(gm).getByText(bash.BOUNDARY, { exact: true }).waitFor(); await prepare(gm, source, target); await record(gm);
    await form(gm).getByText('Outcome: accepted', { exact: true }).waitFor();
    const first = current().state.conditions[0].recordId;
    assert.equal(current().state.conditions[0].sourceEntityId, bash.PREFIX + first); assert.equal(current().state.conditions[0].clockBoundary, bash.TIMING);
    assert.equal(JSON.stringify([current().character, actors.locate(host.room, source).token]), before);
    for (const page of [owner, observer]) await page.waitForFunction(id => S('characterTokenStore').getState().characterTokens.find(t => t.id === 'pc').state.conditions.some(r => r.recordId === id), first);
    result.checks.manualOnlyExactIdentityNoOtherMutation = first;
    assert.equal((await ack(owner, 'actor_strike_approve', approval())).code, 'actor_stunned');
    const initialMove = await owner.evaluate(async ref => { const next = new Promise(r => __socket.once('room_error', r)); __socket.emit('character_moved', { roomId: ref.roomId, mapId: ref.mapId, tokenId: ref.tokenId, position: { x: 950, y: 300 } }); return next; }, target);
    assert.equal(initialMove.code, 'actor_stunned'); result.checks.adapterAloneRefusesActionAndMovement = true;
    await form(gm).getByRole('button', { name: 'Edit Shield Bash target conditions' }).click();
    await stun(gm).getByText(`Stunned instance: ${first}`, { exact: true }).waitFor();
    const gmDialogs = gm.getByRole('button', { name: 'Close shared condition editor', exact: true }); await gmDialogs.last().click();
    await owner.locator('.character-token').first().click({ button: 'right' }); await owner.getByText('Status', { exact: true }).hover(); await owner.getByText('Conditions', { exact: true }).last().click();
    await stun(owner).getByText(`Stunned instance: ${first}`, { exact: true }).waitFor(); save('token.aria.yml', await stun(owner).ariaSnapshot());
    await owner.locator('.conditions-window .close-button').click();
    // Independent critical source goes through existing P7; this fixture is not a second adapter.
    const criticalId = crypto.randomUUID(), critical = profile.makeStunnedRecord(target, criticalId, { sourceActor: source, sourceOccurrence: 'C3 independent critical', timing: 'critical-one-round' });
    assert.equal((await ack(gm, 'actor_consequence', { ...base(), target, actors: [{ ref: target, expectedRevision: current().state.actorContract.revision, conditions: [{ op: 'add', recordId: criticalId, record: critical }] }],
      adjudication: { definitionId: profile.STUNNED.definitionId, definitionVersionOrHash: profile.STUNNED.origin, chosenResult: 'Manual independent critical' } })).success, true);
    await owner.keyboard.press('c'); await owner.getByRole('dialog', { name: 'Character Sheet', exact: true }).getByRole('button', { name: 'Stats', exact: true }).click(); await owner.mouse.move(1300, 850);
    await owner.getByRole('button', { name: 'Sheet shared PC Defending', exact: true }).focus(); await owner.getByRole('button', { name: 'Sheet shared PC Defending', exact: true }).press('Enter');
    await stun(owner).getByText(`Stunned instance: ${first}`, { exact: true }).waitFor();
    await stun(owner).getByRole('button', { name: `Remove Stunned instance ${first}`, exact: true }).click();
    await owner.waitForFunction(id => !S('characterTokenStore').getState().characterTokens.find(t => t.id === 'pc').state.conditions.some(r => r.recordId === id), first);
    assert.equal(current().state.conditions[0].recordId, criticalId); assert.equal(profile.holdsStunned(current()), true);
    const move = await owner.evaluate(async ref => { const next = new Promise(r => __socket.once('room_error', r)); __socket.emit('character_moved', { roomId: ref.roomId, mapId: ref.mapId, tokenId: ref.tokenId, position: { x: 950, y: 300 } }); return next; }, target);
    assert.equal(move.code, 'actor_stunned');
    function approval() { return ({ version: 1, roomId: host.room.id, approvalId: crypto.randomUUID(), actionEpoch: actors.epoch(host.room), baseCommitSequence: actors.ledger(host.room).commitSequence,
      source: target, target: source, weapon: { slot: 'mainHand', itemId: 'c3-sword', name: 'Witness Sword', weaponType: 'sword', typeSource: 'item', die: 8, damageType: 'slicing', attribute: 'strength', score: 14, modifier: 2 },
      roll: { mode: 'physical', faces: [6] }, proficiency: { weaponType: 'sword', rank: 'TRAINED', rankSource: 'stored', die: 8, table: 'sword', roll: { mode: 'physical', faces: [5] } }, price: { ap: 2 } }); }
    assert.equal((await ack(owner, 'actor_strike_approve', approval())).code, 'actor_stunned');
    await stun(owner).getByRole('button', { name: `Remove Stunned instance ${criticalId}`, exact: true }).click(); await stun(owner).getByText('Stunned inactive.', { exact: true }).waitFor();
    const available = approval(), registered = await ack(owner, 'actor_strike_approve', available); assert.equal(registered.code, 'awaiting_gm');
    assert.equal((await ack(owner, 'actor_strike_withdraw', { roomId: host.room.id, approvalId: available.approvalId })).success, true);
    assert.equal(JSON.stringify([current().character, actors.locate(host.room, source).token]), before);
    await owner.getByRole('button', { name: 'Close shared condition editor', exact: true }).click(); await owner.keyboard.press('c');
    result.checks.crossSurfaceExactRemovalIndependentSourceAndAvailability = true;
    // Accepted historical result remains history after target editing/removal, even on reopen.
    await gm.getByRole('button', { name: 'Close shared condition editor', exact: true }).click(); await open(gm);
    await form(gm).getByText(`Result / condition / command ID: ${first}`, { exact: true }).waitFor();
    await form(gm).getByText('Current room instance absent. A historical result is not reapplied.', { exact: true }).waitFor();
    const seq = actors.ledger(host.room).commitSequence; await form(gm).getByRole('button', { name: 'Check original Shield Bash result' }).click(); assert.equal(actors.ledger(host.room).commitSequence, seq);
    // An explicitly separate later result uses the same source/target but a distinct retained ID.
    await prepare(gm, source, target);
    await gm.evaluate(() => {
      const isBash = c => { try { return JSON.parse(c?.adjudication?.chosenResult).manualResult?.definitionId === 'universal_shield_bash'; } catch (_) { return false; } };
      const handlers = __socket.listeners('actor_consequence_accepted'); __socket.removeAllListeners('actor_consequence_accepted');
      __socket.on('actor_consequence_accepted', r => { if (isBash(r.receipt)) return; for (const h of handlers) h(r); });
      const emit = __socket.emit.bind(__socket); __socket.emit = (event, ...args) => { if (event === 'actor_consequence' && isBash(args[0]) && typeof args[1] === 'function') args[1] = () => {}; return emit(event, ...args); };
    });
    await record(gm); await form(gm).getByText(/Outcome: unknown/).waitFor();
    const second = current().state.conditions[0].recordId; assert.notEqual(first, second); assert.equal(actors.ledger(host.room).commitSequence, seq + 1);
    assert.equal(await form(gm).getByRole('button', { name: 'Prepare separate later Shield Bash result' }).isDisabled(), true);
    const retained = await gm.evaluate(id => Object.values(__conditions.getState().saved.entries).find(e => e.command.commandId === id).command, second);
    assert.equal(retained.commandId, second); assert.equal(retained.actors[0].conditions[0].recordId, second);
    save('unknown.aria.yml', await form(gm).ariaSnapshot());
    await gm.reload(); await setup(gm, host.url, 'app-gm'); await init(gm); await open(gm);
    await form(gm).getByText(`Result / condition / command ID: ${second}`, { exact: true }).waitFor(); await form(gm).getByText(/Outcome: unknown/).waitFor();
    assert.deepEqual(await gm.evaluate(id => Object.values(__conditions.getState().saved.entries).find(e => e.command.commandId === id).command, second), retained);
    await form(gm).getByRole('button', { name: 'Check original Shield Bash result' }).click(); await form(gm).getByText('Outcome: accepted', { exact: true }).waitFor();
    assert.equal(current().state.conditions.length, 1); assert.equal(actors.ledger(host.room).commitSequence, seq + 1);
    const connected = await gm.evaluate(async() => { __socket.disconnect(); __socket.connect(); await new Promise(r => __socket.once('connect', r)); const joined = new Promise(r => __socket.once('room_joined', r)); __socket.emit('join_room', { roomId: S('gameStore').getState().multiplayerRoom.id, playerName: 'app-gm', password: '', isReconnect: true }); await joined; return __socket.listeners('room_joined').length; });
    assert.equal(connected, 1); await form(gm).getByText(`Result / condition / command ID: ${second}`, { exact: true }).waitFor();
    assert.equal(current().state.conditions[0].clockBoundary, bash.TIMING); assert.deepEqual(current().state.conditions[0].sourceActor, source);
    assert.equal(JSON.stringify([current().character, actors.locate(host.room, source).token]), before);
    result.checks.laterResultLostAckReloadReopenReconnectNoDuplicate = { first, second, commandId: retained.commandId, clockBoundary: bash.TIMING };
    assert.equal((await ack(owner, 'actor_consequence', retained)).code, 'shield_bash_gm_required'); result.checks.unauthorizedNamedSubmissionRefused = true;
    save('desktop.aria.yml', await form(gm).ariaSnapshot()); await gm.screenshot({ path: path.join(out, 'desktop.png') });
    await gm.setViewportSize({ width: 1024, height: 768 });
    const bounds = await form(gm).evaluate(el => ({ width: el.scrollWidth, client: el.clientWidth, right: el.getBoundingClientRect().right })); assert.equal(bounds.width, bounds.client); assert.ok(bounds.right <= 1024);
    save('tablet.aria.yml', await form(gm).ariaSnapshot()); await gm.screenshot({ path: path.join(out, 'tablet.png') }); result.checks.tablet = bounds; result.passed = true;
  } catch (error) { result.failure = error.stack; for (const [role, page] of Object.entries(pages)) save(`${role}-failure.aria.yml`, await page.locator('body').ariaSnapshot().catch(() => 'unavailable')); throw error;
  } finally { save('result.json', result); await browser.close(); host.server.closeAllConnections(); await Promise.race([host.stop(), new Promise(r => setTimeout(r, 3000))]); }
}
main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
