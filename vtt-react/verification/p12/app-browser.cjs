// Frozen P12A A1–A9 + P11 closure in the actual optimized App. No component replacement.
// Setup corrected 2026-10-18 (integration closure): rejoin recovery now runs through the App's single room_joined
// listener, registered by `registerRoomJoinedListener` (services/roomRejoinBus.js), not a per-service socket listener.
// This harness calls that same production registration on its socket (it does not mount MultiplayerApp); see
// docs/MYTHRILL_SLICES_20261017_IMPLEMENTATION.md. The byte-identical earlier witness is app-browser.20261016-original.cjs.
// Provider identity, canonical owner documents, lease backend and cloud transport are fixtures.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.P12_OUTPUT;
if (!out || !process.env.APP_BUILD_DIR) throw Error('P12_OUTPUT and APP_BUILD_DIR must point outside Git.');
fs.mkdirSync(out, { recursive: true });
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const evidence = { build: process.env.APP_BUILD_DIR, witnesses: {}, errors: [], limits: ['Full optimized App/router/components/CSS; production stores/services and real registered Socket.IO handlers.', 'Test-only webpack/fiber access seeds fixture users and wizard data. External Firebase identity/ownership, lease storage and cloud writes are simulated.', 'No live Firebase/rules, physical second device, human session or deployed restart claim.'] };
const legacySetup = require('../p9/integration/app-browser.cjs').setup;
async function setup(page, host, uid) {
  await legacySetup(page, host.url, uid);
  await page.evaluate(async uid => {
    const moduleWith = text => { const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); if (!pair) throw Error('Missing compiled ' + text); return __req(pair[0]); };
    const strike = moduleWith('Submitting one AP/HP consequence');
    // Webpack mangles new harmony export names; aliases identify this manifested build's exports.
    const aliases = { registerWeaponStrikeHandlers: 'tZ', refreshStrikeApprovals: 'oK', loadStrikeData: 'tn', useWeaponStrikeStore: 'D6', strikeDefenses: 'A2',
      sendStrikeApproval: 'Sj', gmAcceptStrike: 'Jx', consumeStrikeReceipt: null };
    window.__strike = Object.fromEntries(Object.entries(aliases).map(([name, key]) => [name, strike[name] || strike[key]]));
    const custody = moduleWith('Strike device custody unavailable');
    window.__strikeCustody = { loadStrikeCustody: custody.loadStrikeCustody || custody.gY };
    __strike.registerWeaponStrikeHandlers({ socket: __socket }); await __strike.refreshStrikeApprovals(); await __strike.loadStrikeData();
    // Production rejoin wiring: the socket's one room_joined listener is registered by the same production function
    // the App's room lifecycle calls (registerRoomJoinedListener, services/roomRejoinBus.js). The harness does not
    // mount MultiplayerApp, so it passes no UI join handler; registration, rejoin decision and relay are production code.
    const registerRoomJoined = Object.values(moduleWith('[roomRejoin] subscriber failed')).find(fn => typeof fn === 'function' && fn.toString().includes('room_joined'));
    if (!registerRoomJoined) throw Error('Missing compiled registerRoomJoinedListener');
    registerRoomJoined(__socket);
    const on = __socket.on.bind(__socket);
    // Replace only transport delivery boundaries, never acceptance/price/recovery behavior.
    const registeredAccepted = __socket.listeners('actor_consequence_accepted');
    __socket.removeAllListeners('actor_consequence_accepted');
    // use the actual registered handler closure (consumeStrikeReceipt is internal in optimized output)
    on('actor_consequence_accepted', r => { if (!window.__dropDelivery) for (const handler of registeredAccepted) handler(r); });
    const emit = __socket.emit.bind(__socket);
    __socket.emit = (event, ...args) => { if (['actor_strike_approve', 'actor_consequence'].includes(event) && typeof args[1] === 'function') { const cb = args[1]; args[1] = r => { if (__dropAck === event) return; cb(r); }; } return emit(event, ...args); };
    window.__dropAck = null; window.__dropDelivery = false;
    if (uid === 'app-owner') S('characterStore').setState({ stats: { ...S('characterStore').getState().stats, strength: 14, agility: 16 },
      skillRanks: { weaponMastery: 'ADEPT', weaponMastery_sword: 'TRAINED', weaponMastery_bow: 'NOVICE' },
      equipment: { ...S('characterStore').getState().equipment, mainHand: { id: 'p12-sword', name: 'Witness Sword', subtype: 'SWORD', weaponStats: { baseDamage: { diceCount: 1, diceType: 'd8', damageType: 'slicing' } } },
        ranged: { id: 'p12-bow', name: 'Witness Bow', subtype: 'BOW', slots: ['ranged'], weaponStats: { baseDamage: { diceCount: 1, diceType: 'd6', damageType: 'stabbing' } } } } });
  }, uid);
}
async function dropAction(page, id) {
  if (['mh_standard_attack', 'ranged_standard_attack'].includes(id)) {
    const slot = id === 'mh_standard_attack' ? 'mainHand' : 'ranged';
    const wing = page.locator(`.action-bar-assembly:not(.spell-action-bar-assembly) .equipment-action-slot-wrapper.slot-${slot}`);
    await wing.locator('.equipment-action-slot').click();
    await wing.getByAltText(slot === 'mainHand' ? 'Attack (Witness Sword)' : 'Ranged Attack (Witness Bow)', { exact: true }).click();
    await page.getByRole('dialog', { name: 'Basic weapon strike', exact: true }).waitFor();
    return;
  }
  await page.locator('.action-bar-assembly .action-slot').first().evaluate((el, id) => {
    const data = new DataTransfer(); data.setData('application/json', JSON.stringify({ id, name: 'Attack (Melee or Ranged)', icon: 'Slashing/Sword Strike', spellType: 'ACTION' }));
    const event = new Event('drop', { bubbles: true, cancelable: true }); Object.defineProperty(event, 'dataTransfer', { value: data }); el.dispatchEvent(event);
  }, id);
  await page.locator('.action-bar-assembly .action-slot').first().click();
  await page.getByRole('dialog', { name: 'Basic weapon strike', exact: true }).waitFor();
}
async function physical(page, faces, proficiency = '5') {
  await page.getByRole('combobox', { name: 'Strike target', exact: true }).selectOption('creature:app-hall:B');
  await page.getByLabel('Physical weapon faces', { exact: true }).fill(faces); await page.getByRole('button', { name: 'Record weapon faces', exact: true }).click();
  await page.getByLabel('Physical proficiency faces', { exact: true }).fill(proficiency); await page.getByRole('button', { name: 'Record proficiency faces', exact: true }).click();
}
async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const event of ['actor_consequence', 'actor_snapshot', 'actor_strike_approve', 'actor_strike_list', 'actor_strike_withdraw', 'actor_strike_decline', 'join_room']) host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const gm = await browser.newPage({ viewport: { width: 1440, height: 1000 } }), owner = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const pages = [gm, owner]; for (const page of pages) page.on('pageerror', e => evidence.errors.push(e.message));
  try {
    await setup(gm, host, 'app-gm'); await setup(owner, host, 'app-owner');
    const state = () => host.room.gameState.maps['app-hall'];
    const recharge = async() => {
      await gm.evaluate(async() => { await __actors.refreshActorSnapshot(); const r = await __actors.adjustSharedResource('pc', 'actionPoints', 4); if (!r.success) throw Error(JSON.stringify(r)); });
      await owner.evaluate(() => __actors.refreshActorSnapshot());
    };
    const approve = async() => { await owner.getByRole('button', { name: 'Approve 2 AP and send to GM', exact: true }).click(); await owner.getByText('Awaiting GM adjudication. Approval spends nothing.', { exact: true }).waitFor(); };
    const card = () => gm.locator('.p12-gm-card').filter({ has: gm.getByRole('button', { name: 'Confirm and apply', exact: true }) }).last();
    const accept = async(choice = 'deferred') => {
      const c = card(); await c.waitFor(); assert.equal(await c.getByRole('combobox', { name: 'Proficiency outcome', exact: true }).inputValue(), '', 'no automatic table face');
      await c.getByRole('combobox', { name: 'Proficiency outcome', exact: true }).selectOption(choice);
      if (choice === 'none') await c.getByLabel('No-outcome reason').fill('Explicit table ruling');
      const verdict = c.getByRole('combobox', { name: 'Listed defense verdict', exact: true }); if (await verdict.count()) await verdict.selectOption('not-applicable');
      save(`gm-${Object.keys(evidence.witnesses).length}.aria.yml`, await c.ariaSnapshot());
      await c.getByRole('button', { name: 'Confirm and apply', exact: true }).click();
      await owner.getByText(/^Accepted: AP/).first().waitFor();
      return host.room.gameState.actorConsequences.receipts.at(-1);
    };
    if (!process.env.P11_ONLY) {
    // A9 actual HUD action slot → owner → GM → receipt. A2, A4, A5 and A7.
    await dropAction(owner, 'universal_attack'); await physical(owner, '6');
    const before = JSON.stringify(state().characterTokens.pc.character); await approve();
    assert.equal(JSON.stringify(state().characterTokens.pc.character), before, 'approval never spends');
    let receipt = await accept('18');
    assert.equal(receipt.adjudication.finalAmount, 8, 'face18 +7 not added');
    assert.deepEqual([state().characterTokens.pc.character.actionPoints.current, state().characterTokens.pc.character.tempActionPoints], [1, 0]);
    assert.deepEqual([state().tokens.B.state.currentHp, state().tokens.B.state.tempHealth], [26, 0]);
    assert.match(await owner.getByRole('dialog', { name: 'Basic weapon strike' }).innerText(), /Not applied by the VTT: Face 18.*Dazing Hilt Impact/s);
    evidence.witnesses.productionHit = receipt;
    await owner.getByRole('button', { name: 'Close strike' }).click(); await recharge();
    // A1 natural miss, still proficiency-rolled and charged once.
    await dropAction(owner, 'mh_standard_attack'); await physical(owner, '1'); await approve(); const hp = state().tokens.B.state.currentHp;
    receipt = await accept('none'); assert.equal(state().tokens.B.state.currentHp, hp); assert.equal(receipt.adjudication.finalAmount, 0);
    evidence.witnesses.miss = receipt; await owner.getByRole('button', { name: 'Close strike' }).click(); await recharge();
    // A3 critical chain: physical/digital parity already asserted in pure production-module test.
    await dropAction(owner, 'universal_attack'); await physical(owner, '8,8,3'); await approve(); receipt = await accept('deferred');
    assert.equal(receipt.adjudication.finalAmount, 19); evidence.witnesses.critical = receipt;
    await owner.getByRole('button', { name: 'Close strike' }).click(); await recharge();
    // Real digital controls and per-bow NOVICE rank, distinct from sword TRAINED.
    await dropAction(owner, 'ranged_standard_attack'); await owner.getByRole('combobox', { name: 'Strike target', exact: true }).selectOption('creature:app-hall:B');
    assert.match(await owner.getByRole('dialog', { name: 'Basic weapon strike' }).innerText(), /bow · NOVICE \(stored\) · d6/);
    await owner.evaluate(() => { window.__originalRandom = Math.random; Math.random = () => .5; });
    await owner.getByRole('button', { name: 'Roll weapon digitally' }).click(); await owner.getByRole('button', { name: 'Roll proficiency digitally' }).click();
    await owner.evaluate(() => { Math.random = __originalRandom; }); await approve(); receipt = await accept();
    assert.equal(JSON.parse(receipt.adjudication.chosenResult).roll.mode, 'digital'); evidence.witnesses.rangedDigital = receipt;
    await owner.getByRole('button', { name: 'Close strike' }).click(); await recharge();
    // Owner approval ACK loss: exact retained approval survives reload, no reroll.
    await dropAction(owner, 'universal_attack'); await physical(owner, '4');
    await owner.evaluate(() => { __dropAck = 'actor_strike_approve'; });
    await owner.getByRole('button', { name: 'Approve 2 AP and send to GM' }).click();
    await owner.getByText(/Outcome unresolved \(outcome_unknown\)/).first().waitFor();
    const approvalBytes = await owner.evaluate(() => JSON.stringify(__strikeCustody.loadStrikeCustody().owner.approval));
    await setup(owner, host, 'app-owner');
    assert.equal(await owner.evaluate(() => JSON.stringify(__strikeCustody.loadStrikeCustody().owner.approval)), approvalBytes);
    await owner.getByRole('button', { name: 'Open retained strike' }).click(); await owner.getByRole('button', { name: 'Check this same strike' }).click();
    await owner.getByText('Awaiting GM adjudication. Approval spends nothing.', { exact: true }).waitFor();
    // GM reload re-lists pending approval. Lost command ACK + broadcast preserves prepared bytes.
    await setup(gm, host, 'app-gm'); const c = card(); await c.waitFor(); await c.getByRole('combobox', { name: 'Proficiency outcome', exact: true }).selectOption('deferred');
    const verdict = c.getByRole('combobox', { name: 'Listed defense verdict', exact: true }); if (await verdict.count()) await verdict.selectOption('not-applicable');
    await gm.evaluate(() => { __dropAck = 'actor_consequence'; __dropDelivery = true; });
    await c.getByRole('button', { name: 'Confirm and apply' }).click(); await c.getByText(/Command outcome unresolved/).waitFor();
    const prepared = await gm.evaluate(() => Object.values(__strikeCustody.loadStrikeCustody().gm).find(v => v.phase === 'unknown').command);
    const count = host.room.gameState.actorConsequences.receipts.length;
    await setup(gm, host, 'app-gm'); await gm.getByRole('button', { name: 'Check same command', exact: true }).last().click();
    await gm.getByText(/^Accepted: AP/).first().waitFor();
    assert.equal(host.room.gameState.actorConsequences.receipts.length, count);
    assert.ok((await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_consequence').map(v => v.payload))).some(v => JSON.stringify(v) === JSON.stringify(prepared)));
    evidence.witnesses.ackLossReloadExactRecovery = { approvalBytes, prepared, receipts: count };
    // Same-socket successful rejoin must recover missed pending/closed projection without replay.
    await owner.getByRole('button', { name: 'Close strike' }).click(); await recharge();
    await gm.evaluate(() => { __socket.disconnect(); });
    await dropAction(owner, 'universal_attack'); await physical(owner, '3'); await approve();
    const missedId = await owner.evaluate(() => __strikeCustody.loadStrikeCustody().owner.approval.approvalId);
    const ownerBytes = await owner.evaluate(() => JSON.stringify(__strikeCustody.loadStrikeCustody().owner.approval));
    const listReads = () => gm.evaluate(() => __outbound.filter(v => v.event === 'actor_strike_list').length);
    const readsBefore = await listReads(), receiptsBefore = host.room.gameState.actorConsequences.receipts.length;
    const gmCustodyBefore = await gm.evaluate(() => JSON.stringify(__strikeCustody.loadStrikeCustody()?.gm || {}));
    await gm.evaluate(async() => {
      __socket.connect(); await new Promise(r => __socket.once('connect', r));
      const joined = new Promise(r => __socket.once('room_joined', r));
      __socket.emit('join_room', { roomId: S('gameStore').getState().multiplayerRoom.id, playerName: 'app-gm', password: '' }); await joined;
    });
    await card().waitFor();
    assert.ok(await gm.evaluate(id => !!__strike.useWeaponStrikeStore.getState().gmPending[id], missedId));
    // Corrected-harness checks: one listener, one read per rejoin, recorded roll and custody unchanged, nothing applied.
    assert.equal(await gm.evaluate(() => __socket.listeners('room_joined').length), 1, 'one room_joined listener');
    assert.equal(await listReads() - readsBefore, 1, 'exactly one pending-list read for the rejoin');
    assert.equal(await gm.evaluate(id => JSON.stringify(__strike.useWeaponStrikeStore.getState().gmPending[id].approval), missedId), ownerBytes, 'the GM sees the original recorded approval bytes');
    assert.equal(await owner.evaluate(() => JSON.stringify(__strikeCustody.loadStrikeCustody().owner.approval)), ownerBytes, 'owner custody unchanged');
    assert.equal(host.room.gameState.actorConsequences.receipts.length, receiptsBefore, 'a rejoin applies nothing');
    assert.equal(await gm.evaluate(() => JSON.stringify(__strikeCustody.loadStrikeCustody()?.gm || {})), gmCustodyBefore, 'GM command custody unchanged by the rejoin');
    const readsSecond = await listReads();
    await gm.evaluate(() => { __socket.disconnect(); }); await owner.getByRole('button', { name: 'Withdraw before acceptance' }).click();
    await gm.evaluate(async() => { __socket.connect(); await new Promise(r => __socket.once('connect', r)); const joined = new Promise(r => __socket.once('room_joined', r)); __socket.emit('join_room', { roomId: S('gameStore').getState().multiplayerRoom.id, playerName: 'app-gm', password: '' }); await joined; });
    await gm.waitForFunction(id => !__strike.useWeaponStrikeStore.getState().gmPending[id], missedId);
    assert.equal(await gm.evaluate(() => __socket.listeners('room_joined').length), 1, 'still one listener after a second rejoin');
    assert.equal(await listReads() - readsSecond, 1, 'one read for the second rejoin: no accumulated subscription');
    assert.equal(host.room.gameState.actorConsequences.receipts.length, receiptsBefore, 'withdraw and rejoin apply nothing');
    evidence.witnesses.sameSocketRejoin = true;
    await owner.getByRole('button', { name: 'Close strike' }).click();
    // >32 completed commands: real services + registered handlers, preserving active custody.
    for (let i = 0; i < 33; i++) {
      await recharge();
      await owner.evaluate(async targetRef => { await __strike.sendStrikeApproval({ action: { id: 'universal_attack' }, targetRef, roll: { mode: 'physical', faces: [3] }, proficiencyRoll: { mode: 'physical', faces: [5] } }); }, host.refs.B);
      const id = await owner.evaluate(() => __strikeCustody.loadStrikeCustody().owner.approval.approvalId);
      await gm.waitForFunction(id => !!__strike.useWeaponStrikeStore.getState().gmPending[id], id);
      await gm.evaluate(async id => { const entry = __strike.useWeaponStrikeStore.getState().gmPending[id], defense = __strike.strikeDefenses(entry.approval); await __strike.gmAcceptStrike(id, { defense, choice: { kind: 'deferred' }, verdict: 'not-applicable', finalAmount: defense.afterDefense, reason: '' }); }, id);
      await owner.waitForFunction(() => __strikeCustody.loadStrikeCustody().owner.phase === 'accepted');
    }
    const gmCustodyCount = await gm.evaluate(() => Object.keys(__strikeCustody.loadStrikeCustody().gm).length);
    assert.ok(gmCustodyCount <= 8); evidence.witnesses.thirtyThreeCompletedStrikes = { completed: 33, gmCustodyCount };
    await recharge(); await dropAction(owner, 'universal_attack'); await physical(owner, '3'); await approve();
    const runtimeApproval = await owner.evaluate(() => JSON.stringify(__strikeCustody.loadStrikeCustody().owner.approval));
    host.backend.rooms.set(host.room.id, { ...host.room, gameState: JSON.parse(JSON.stringify(host.room.gameState)) });
    await owner.getByRole('button', { name: 'Check this same strike' }).click();
    await owner.getByText(/Outcome unresolved \(outcome_unknown\)/).first().waitFor();
    assert.equal(await owner.evaluate(() => JSON.stringify(__strikeCustody.loadStrikeCustody().owner.approval)), runtimeApproval);
    assert.doesNotMatch(await owner.getByRole('dialog', { name: 'Basic weapon strike' }).innerText(), /nothing happened|no payment was recorded/i);
    evidence.witnesses.runtimeChangeUnknown = true;
    await owner.getByRole('button', { name: 'Reconciled with GM — clear strike' }).click();
    save('owner-final.aria.yml', await owner.locator('body').ariaSnapshot()); save('gm-final.aria.yml', await gm.locator('.actor-consequence-layer').ariaSnapshot());
    for (const width of [1440, 1024]) { await gm.setViewportSize({ width, height: 900 }); save(`layout-${width}.json`, await gm.locator('.actor-consequence-layer').evaluate(el => ({ rect: el.getBoundingClientRect().toJSON(), scrollHeight: el.scrollHeight, clientHeight: el.clientHeight }))); }
    }
    // P11 full-App sheet and canonical working-data save/reload witness.
    if (await owner.getByRole('button', { name: 'Close strike' }).count()) await owner.getByRole('button', { name: 'Close strike' }).click();
    await owner.evaluate(() => window.dispatchEvent(new CustomEvent('mythrill_open_character_sheet')));
    await owner.getByRole('button', { name: 'Skills', exact: true }).first().click();
    await owner.getByText('Weapon Mastery', { exact: true }).first().click();
    await owner.locator('.weapon-mastery-card').first().waitFor();
    const weapon = label => owner.locator('.weapon-mastery-card').filter({ has: owner.locator('.weapon-card-name', { hasText: new RegExp(`^${label}$`) }) });
    await weapon('Sword').click(); await owner.locator('.skill-rank-dropdown').selectOption('EXPERT');
    await weapon('Axe').click(); await owner.locator('.skill-rank-dropdown').selectOption('NOVICE');
    await weapon('Dagger').click(); await owner.getByRole('button', { name: /Use Adept for Dagger/ }).click();
    const ranks = await owner.evaluate(() => S('characterStore').getState().skillRanks);
    assert.equal(ranks.weaponMastery_sword, 'EXPERT'); assert.equal(ranks.weaponMastery_axe, 'NOVICE'); assert.equal(ranks.weaponMastery_dagger, 'ADEPT'); assert.equal(ranks.weaponMastery, 'ADEPT');
    save('p11-sheet.aria.yml', await owner.locator('.skills-container').ariaSnapshot()); evidence.witnesses.P11ranksAndLegacy = ranks;
    // Save through the actual canonical working-data assembler, reload through actual loadCharacter.
    const savedCharacter = await owner.evaluate(() => {
      const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes('Could not get inventory data:'));
      const helpers = __req(pair[0]), state = S('characterStore').getState();
      const assemble = helpers.assembleCharacterWorkingData || Object.values(helpers).find(f => typeof f === 'function' && f.toString().includes('.skillRanks') && f.toString().includes('.levelUpHistory'));
      return { ...assemble(state, { items: [], currency: {}, encumbranceState: 'normal' }), id: 'p11-save', name: 'P11 Save' };
    });
    await setup(owner, host, 'app-owner');
    await owner.evaluate(saved => { S('characterStore').setState({ characters: [saved] }); S('characterStore').getState().loadCharacter(saved.id); }, savedCharacter);
    assert.deepEqual(await owner.evaluate(() => S('characterStore').getState().skillRanks), ranks); evidence.witnesses.P11canonicalReload = true;
    await require('./p11-app-wizard.cjs').check(owner, save, evidence);
    evidence.passed = true;
  } catch (error) {
    evidence.failure = error.stack;
    for (let i = 0; i < pages.length; i++) { save(`failure-${i}.aria.yml`, await pages[i].locator('body').ariaSnapshot().catch(() => 'unavailable')); }
    throw error;
  } finally { save('result.json', evidence); await browser.close(); await host.stop(); }
}
exports.setup = setup;
if (require.main === module) main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
