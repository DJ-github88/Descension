// One optimized production-App C2 witness. All generated artifacts must remain outside Git.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), crypto = require('crypto');
const { chromium } = require('playwright');
const out = process.env.C2_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External C2_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture');
const { setup } = require('../p9/integration/app-browser.cjs');
const actors = require('../../../server/services/actorConsequences');
const save = (name, data) => fs.writeFileSync(path.join(out, name), typeof data === 'string' ? data : JSON.stringify(data, null, 2));
const result = { checks: {}, errors: [], limits: ['Real optimized App + registered backend. Provider, ownership, lease and cloud are fixtures.',
  'Source outcomes/payment/saves and advantage/expiry remain manual. No live Firebase, second-device or deployment claim.'] };
const editor = page => page.getByRole('region', { name: 'Shared PC Defending', exact: true });
const stun = page => page.getByRole('region', { name: 'Shared Stunned', exact: true });
const rpDialog = page => page.getByRole('dialog', { name: 'Universal Riposte execution' });
async function ack(page, event, payload) { return page.evaluate(({event, payload}) => new Promise(resolve => __socket.emit(event, payload, resolve)), {event, payload}); }
async function init(page) {
  await page.evaluate(() => {
    const moduleWith = text => { const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); if (!pair) throw Error(text); return __req(pair[0]); };
    Object.values(moduleWith('[roomRejoin] subscriber failed')).find(fn => typeof fn === 'function' && fn.toString().includes('room_joined'))(__socket);
    window.__conditionStore = Object.values(moduleWith('Condition preparation already pending. No duplicate command created.')).find(v => typeof v?.getState === 'function' && 'saved' in v.getState());
    window.__rp = Object.values(moduleWith('Original-epoch parent registration retained')).find(v => typeof v?.getState === 'function' && 'opportunities' in v.getState());
    if (!__rp) {
      const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes('actor_riposte_parent') && f.toString().includes('actor_riposte_offer'));
      window.__rp = Object.values(__req(pair[0])).find(v => typeof v?.getState === 'function' && 'opportunities' in v.getState());
    }
    const uid = S('authStore').getState().user.uid;
    S('gameStore').setState({ currentPlayer: { id: uid, userId: uid }, cameraX: 1100, cameraY: 300, gridType: 'square', gridSize: 50 });
  });
}
async function tokenEditor(page) {
  await page.locator('.character-token').first().click({ button: 'right' });
  await page.getByText('Status', { exact: true }).hover(); await page.getByText('Conditions', { exact: true }).last().click();
  await stun(page).getByText('Stunned inactive.', { exact: true }).waitFor();
}
async function apply(page, source, timing) {
  await stun(page).getByLabel('Source occurrence reference').fill(source);
  await stun(page).getByLabel('Source-specific duration').selectOption(timing);
  await stun(page).getByRole('button', { name: 'Apply Stunned source', exact: true }).click();
  await stun(page).getByText('Stunned active: supported actions/reactions and player voluntary movement refused.', { exact: true }).waitFor();
}
async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const event of ['actor_snapshot', 'actor_consequence', 'actor_riposte_parent', 'actor_riposte_offer', 'actor_riposte_list', 'actor_strike_list', 'actor_strike_approve', 'reaction_window_list', 'token_updated']) host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  host.room.gameState.maps['app-hall'].characterTokens.pc.playerId = 'app-owner';
  const browser = await chromium.launch({ channel: 'chrome', headless: true }), pages = {};
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['observer', 'app-observer'], ['owner', 'app-owner']]) {
      const page = pages[role] = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
      page.on('pageerror', e => result.errors.push({ role, message: e.message })); await setup(page, host.url, uid); await init(page);
    }
    const { gm, owner, observer } = pages, ref = host.refs.pc, current = () => actors.locate(host.room, ref).token;
    await owner.evaluate(() => S('characterStore').setState({ equipment: { ...S('characterStore').getState().equipment, mainHand: {
      id: 'c2-sword', name: 'Witness Sword', subtype: 'SWORD', weaponStats: { baseDamage: { diceCount: 1, diceType: 'd8', damageType: 'slicing' } } } } }));
    // Actual E1a controls establish a fresh choice and retain an owner-approved roll before Stunned.
    await gm.getByRole('button', { name: 'Riposte execution — structured opportunity' }).click(); const g = rpDialog(gm);
    await g.getByLabel('Triggering attack occurrence').fill('C2 attack'); await g.getByLabel('Parry occurrence', { exact: true }).fill('C2 paid parry');
    await g.getByLabel('Exact parrying PC').selectOption({ label: 'Ilse' }); await g.getByLabel('Particular attacking creature').selectOption({ label: 'A' });
    await g.getByRole('checkbox', { name: 'I attest this PC successfully parried this particular attack.' }).check();
    await g.getByRole('checkbox', { name: /I attest Parry was already fully paid/ }).check();
    await g.getByRole('checkbox', { name: /I attest timing\/5ft\/enemy eligibility/ }).check();
    await g.getByLabel('Private payment/Parry attestation note').fill('Fixture table-resolved prior payment; no E1a Parry debit.');
    await g.getByRole('button', { name: 'Attest Parry and offer Riposte', exact: true }).click();
    const w = owner.getByRole('region', { name: 'Private declaration collection' });
    await w.getByLabel('Card ID or GM-agreed reference').fill('universal_riposte'); await w.getByRole('button', { name: 'Declare privately' }).click();
    await owner.waitForFunction(() => __rp.getState().opportunities.some(p => p.status === 'ready'), null, { timeout: 15000 });
    const p = await owner.evaluate(() => __rp.getState().opportunities.find(p => p.status === 'ready'));
    await owner.getByRole('button', { name: 'Riposte execution — structured opportunity' }).click(); const o = rpDialog(owner);
    await o.getByLabel('Physical weapon faces').fill('3'); await o.getByRole('button', { name: 'Record physical Riposte faces' }).click();
    await o.getByRole('button', { name: 'Approve exact target and1 AP Riposte' }).click();
    await gm.waitForFunction(id => __rp.getState().pending.some(e => e.approval.opportunityId === id), p.id);
    const roll = await owner.evaluate(id => JSON.stringify(__rp.getState().saved.owner[id].roll), p.id);
    await o.getByRole('button', { name: 'Close Riposte panel' }).click();
    await tokenEditor(owner); await apply(owner, 'hammer-critical-1', 'critical-one-round');
    const first = current().state.conditions.find(r => r.conditionKey === 'stunned').recordId;
    const before = JSON.stringify([current().character, actors.locate(host.room, host.refs.A).token.state]);
    const card = g.getByRole('article', { name: `Riposte opportunity ${p.id.slice(0, 8)}` });
    await card.getByLabel('Riposte hit or miss').selectOption('hit'); await card.getByLabel('GM final Riposte damage').fill('7');
    await card.getByRole('checkbox', { name: /I adjudicate current eligibility/ }).check();
    const seq = actors.ledger(host.room).commitSequence;
    await card.getByRole('button', { name: 'Execute approved Riposte —1 AP and HP once' }).click();
    await g.getByText(/Prepared command: refused actor_stunned/).waitFor();
    assert.equal(actors.ledger(host.room).commitSequence, seq); assert.equal(JSON.stringify([current().character, actors.locate(host.room, host.refs.A).token.state]), before);
    assert.equal(await owner.evaluate(id => JSON.stringify(__rp.getState().saved.owner[id].roll), p.id), roll);
    result.checks.e1aRefusedNoPartialChangeRetainedRoll = true;
    // Stale/alternate supported owner action consent also refuses at the server.
    const basic = { version: 1, roomId: host.room.id, approvalId: crypto.randomUUID(), actionEpoch: actors.epoch(host.room), baseCommitSequence: seq,
      source: ref, target: host.refs.A, weapon: { slot: 'mainHand', itemId: 'c2-sword', name: 'Witness Sword', weaponType: 'sword', typeSource: 'item', die: 8, damageType: 'slicing', attribute: 'strength', score: 14, modifier: 2 },
      roll: { mode: 'physical', faces: [6] }, proficiency: { weaponType: 'sword', rank: 'TRAINED', rankSource: 'stored', die: 8, table: 'sword', roll: { mode: 'physical', faces: [5] } }, price: { ap: 2 } };
    assert.equal((await ack(owner, 'actor_strike_approve', basic)).code, 'actor_stunned'); result.checks.basicStrikeRefused = true;
    assert.equal((await ack(owner, 'token_updated', { roomId: host.room.id, mapId: ref.mapId, tokenId: ref.tokenId, updates: { position: { x: 950, y: 300 } } })).code, 'actor_stunned');
    const position = JSON.stringify(current().position);
    const moveRefused = await owner.evaluate(async ref => { const next = new Promise(resolve => __socket.once('room_error', resolve)); __socket.emit('character_moved', { roomId: ref.roomId, mapId: ref.mapId, tokenId: ref.tokenId, position: { x: 950, y: 300 } }); return next; }, ref);
    assert.equal(moveRefused.code, 'actor_stunned'); assert.equal(JSON.stringify(current().position), position); result.checks.voluntaryMovementRefused = true;
    for (const page of [gm, observer]) await page.waitForFunction(id => S('characterTokenStore').getState().characterTokens.find(t => t.id === 'pc').state.conditions.some(r => r.recordId === id), first);
    await apply(owner, 'shield-bash-2', 'shield-bash-target-end');
    const second = current().state.conditions.find(r => r.recordId !== first).recordId;
    assert.equal(current().state.conditions.length, 2); save('token-stunned.aria.yml', await editor(owner).ariaSnapshot()); await owner.screenshot({ path: path.join(out, 'token-stunned.png') });
    await owner.locator('.conditions-window .close-button').click(); await owner.keyboard.press('c');
    await owner.getByRole('dialog', { name: 'Character Sheet', exact: true }).getByRole('button', { name: 'Stats', exact: true }).click();
    await owner.mouse.move(1300, 850); await owner.getByRole('button', { name: 'Sheet shared PC Defending', exact: true }).click();
    await stun(owner).getByText(`Stunned instance: ${first}`, { exact: true }).waitFor();
    await stun(owner).getByRole('button', { name: `Remove Stunned instance ${first}`, exact: true }).click();
    await owner.waitForFunction(id => !S('characterTokenStore').getState().characterTokens.find(t => t.id === 'pc').state.conditions.some(r => r.recordId === id), first);
    assert.equal(current().state.conditions[0].recordId, second); assert.equal(current().state.conditions[0].clockBoundary, 'shield-bash-target-end');
    await stun(owner).getByRole('button', { name: `Remove Stunned instance ${second}`, exact: true }).click(); await stun(owner).getByText('Stunned inactive.', { exact: true }).waitFor();
    assert.equal(current().state.conditions.length, 0); result.checks.tokenToSheetIndependentRemoval = { first, second };
    // Removal restores original opportunity using the retained faces and explicit fresh consent.
    await card.getByRole('button', { name: 'Revalidate for retained roll / new consent' }).click();
    await owner.waitForFunction(id => __rp.getState().saved.owner[id].phase === 'revalidated', p.id);
    await owner.getByRole('button', { name: 'Close shared condition editor' }).click(); await owner.keyboard.press('c');
    await owner.getByRole('button', { name: 'Riposte execution — structured opportunity' }).click();
    assert.equal(await owner.evaluate(id => JSON.stringify(__rp.getState().saved.owner[id].roll), p.id), roll);
    await o.getByRole('button', { name: 'Approve exact target and1 AP Riposte' }).click();
    await gm.waitForFunction(id => __rp.getState().pending.some(e => e.approval.opportunityId === id), p.id);
    await card.getByLabel('Riposte hit or miss').selectOption('miss'); await card.getByLabel('GM final Riposte damage').fill('0');
    await card.getByRole('button', { name: 'Execute approved Riposte —1 AP and HP once' }).click();
    await owner.waitForFunction(id => __rp.getState().saved.owner[id].phase === 'accepted', p.id); result.checks.removalRestoresRetainedRiposte = true;
    await o.getByRole('button', { name: 'Close Riposte panel' }).click(); await g.getByRole('button', { name: 'Close Riposte panel' }).click();
    await owner.keyboard.press('c'); await owner.getByRole('dialog', { name: 'Character Sheet', exact: true }).getByRole('button', { name: 'Stats', exact: true }).click();
    await owner.getByRole('button', { name: 'Sheet shared PC Defending', exact: true }).click();
    // Lost ACK + withheld receipt broadcast: same custody command survives reload, no optimistic replacement.
    await owner.evaluate(() => {
      const handlers = __socket.listeners('actor_consequence_accepted'); __socket.removeAllListeners('actor_consequence_accepted');
      __socket.on('actor_consequence_accepted', r => { if (r.receipt?.adjudication?.definitionId === 'manual-shared-stunned') return; for (const h of handlers) h(r); });
      const emit = __socket.emit.bind(__socket); __socket.emit = (event, ...args) => { if (event === 'actor_consequence' && args[0]?.adjudication?.definitionId === 'manual-shared-stunned' && typeof args[1] === 'function') args[1] = () => {}; return emit(event, ...args); };
    });
    await apply(owner, 'sheet-recovery-3', 'manual'); const third = current().state.conditions[0].recordId;
    assert.equal(await stun(owner).getByRole('button', { name: 'Apply Stunned source', exact: true }).isDisabled(), true);
    await owner.reload(); await setup(owner, host.url, 'app-owner'); await init(owner);
    await owner.getByRole('combobox', { name: 'Exact room attachment' }).selectOption('character:pc');
    await owner.getByRole('button', { name: 'Edit selected shared conditions', exact: true }).click();
    const saved = await owner.evaluate(() => __conditionStore.getState().saved), retained = Object.values(saved.entries).find(e => e.recordId === third);
    assert.equal(retained.phase, 'unknown');
    await editor(owner).getByRole('button', { name: 'Check same condition command', exact: true }).click();
    await owner.waitForFunction(id => Object.values(__conditionStore.getState().saved.entries).some(e => e.command.commandId === id && e.phase === 'accepted'), retained.command.commandId);
    assert.equal(current().state.conditions.length, 1); result.checks.lostAckReloadSameCommand = retained.command.commandId;
    await owner.evaluate(async() => { __socket.disconnect(); __socket.connect(); await new Promise(r => __socket.once('connect', r)); const joined = new Promise(r => __socket.once('room_joined', r)); __socket.emit('join_room', { roomId: S('gameStore').getState().multiplayerRoom.id, playerName: 'app-owner', password: '', isReconnect: true }); await joined; });
    await stun(owner).getByText(`Stunned instance: ${third}`, { exact: true }).waitFor(); result.checks.reconnectSameInstance = third;
    await owner.setViewportSize({ width: 1024, height: 768 });
    const bounds = await editor(owner).evaluate(el => ({ rect: el.getBoundingClientRect().toJSON(), scroll: el.scrollWidth, client: el.clientWidth }));
    assert.equal(bounds.scroll, bounds.client); assert.ok(bounds.rect.right <= 1024); save('tablet.aria.yml', await editor(owner).ariaSnapshot()); await owner.screenshot({ path: path.join(out, 'tablet.png') }); result.checks.tablet = bounds;
    const foreign = await ack(observer, 'actor_consequence', { version: 1, roomId: host.room.id, commandId: crypto.randomUUID(), actionEpoch: actors.epoch(host.room), baseCommitSequence: actors.ledger(host.room).commitSequence,
      actors: [{ ref, expectedRevision: current().state.actorContract.revision, conditions: [{ op: 'remove', recordId: third }] }] }); assert.equal(foreign.code, 'authorization_required');
    await stun(owner).getByRole('button', { name: `Remove Stunned instance ${third}`, exact: true }).click(); await stun(owner).getByText('Stunned inactive.', { exact: true }).waitFor();
    for (const page of [gm, observer]) await page.waitForFunction(() => S('characterTokenStore').getState().characterTokens.find(t => t.id === 'pc').state.conditions.length === 0);
    result.checks.reverseSheetToTokenAndForeignRefusal = true; result.passed = true;
  } catch (error) { result.failure = error.stack; for (const [role, page] of Object.entries(pages)) { save(`${role}-failure.aria.yml`, await page.locator('body').ariaSnapshot().catch(() => 'unavailable')); } throw error;
  } finally { save('result.json', result); await browser.close(); host.server.closeAllConnections(); await Promise.race([host.stop(), new Promise(r => setTimeout(r, 3000))]); }
}
main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
