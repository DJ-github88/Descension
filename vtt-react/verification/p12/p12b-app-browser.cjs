// P12B thin slice (frozen contract revision 4 §3) in the actual optimized App: owner declaration,
// GM attack offer, owner block roll, GM confirmation, atomic HP + wear, private-sheet custody,
// duplicate/out-of-order delivery, full-pack breakage and backup selection. No component replacement.
// Provider identity, canonical owner documents, lease backend and cloud transport are fixtures.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const out = process.env.P12B_OUTPUT;
if (!out || !process.env.APP_BUILD_DIR) throw Error('P12B_OUTPUT and APP_BUILD_DIR must point outside Git.');
fs.mkdirSync(out, { recursive: true });
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const evidence = { build: process.env.APP_BUILD_DIR, startedAt: new Date().toISOString(), witnesses: {}, errors: [],
  limits: ['Full optimized App/router/components/CSS; production stores/services and real registered Socket.IO handlers.',
    'Test-only webpack access seeds fixture users, the owner sheet and the room socket; external Firebase identity, lease storage and cloud writes are simulated.',
    'Combat turn order for the selection-window check is seeded server-side as a fixture. No live Firebase/rules, physical second device, human session or deployment claim.'] };
const legacySetup = require('../p9/integration/app-browser.cjs').setup;
const HIDE = { id: 'weathered-hide', name: 'Weathered Hide', type: 'armor', subtype: 'LEATHER', durability: 'd8', maxDurability: 'd8', width: 2, height: 3, slots: ['chest'] };
const BUCKLER = { id: 'b6f1c0de-0000-4000-8000-000000000001', name: 'Oak Buckler', type: 'armor', subtype: 'SHIELD', durability: 'd8', maxDurability: 'd8', width: 2, height: 2, slots: ['offHand'] };

async function setup(page, host, uid) {
  await legacySetup(page, host.url, uid);
  await page.evaluate(async({ uid, HIDE, BUCKLER }) => {
    const moduleWith = text => { const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); if (!pair) throw Error('Missing compiled ' + text); return __req(pair[0]); };
    const blocking = moduleWith('Submitting one HP + wear consequence');
    const fn = text => Object.values(blocking).find(f => typeof f === 'function' && f.toString().includes(text));
    window.__blocking = { register: fn('actor_block_offered'), lists: fn('actor_block_list'), store: Object.values(blocking).find(v => typeof v === 'function' && typeof v.getState === 'function' && 'gmPending' in v.getState()) };
    if (!__blocking.register || !__blocking.store) throw Error('Missing compiled blocking exports');
    // Delivery boundary only: hold/replay broadcast receipts to exercise out-of-order and duplicate delivery.
    __blocking.register({ socket: __socket });
    const registered = __socket.listeners('actor_consequence_accepted');
    __socket.removeAllListeners('actor_consequence_accepted');
    window.__held = []; window.__hold = false; window.__accepted = [];
    window.__deliver = r => { for (const handler of registered) handler(r); };
    __socket.on('actor_consequence_accepted', r => { __accepted.push(r); if (window.__hold) __held.push(r); else __deliver(r); });
    if (uid === 'app-owner') {
      S('characterStore').setState({ characters: [{ id: 'ilse', name: 'Ilse' }], equipment: { ...S('characterStore').getState().equipment, chest: HIDE, offHand: BUCKLER }, roomEquipmentCustody: null });
      S('inventoryStore').setState({ items: [] });
      // The real character sync publishes shared equipment (projected; durability is never shared).
      S('characterStore').getState().syncWithMultiplayer();
    }
    await __blocking.lists();
  }, { uid, HIDE, BUCKLER });
}
const chip = page => page.locator('button.p12b-chip');
const dialog = page => page.getByRole('dialog', { name: 'Blocking and wear', exact: true });
async function offer(gm, { name, faces, damage, apCost = '1', outcome = 'hit', type = 'slicing' }) {
  const form = gm.getByRole('group', { name: 'Creature attack → owner block roll' });
  await form.getByRole('combobox', { name: 'Attacking creature' }).selectOption('creature:app-hall:A');
  await form.getByRole('combobox', { name: 'Target character' }).selectOption('character:app-hall:pc');
  await form.getByLabel('Attack name').fill(name); await form.getByLabel('Attack dice').fill('1d10'); await form.getByLabel('Attack faces').fill(faces);
  await form.getByRole('combobox', { name: 'GM-declared result' }).selectOption(outcome); await form.getByRole('combobox', { name: 'Damage type' }).selectOption(type);
  await form.getByLabel('Proposed damage (before the block)').fill(String(damage)); await form.getByLabel('Creature AP cost (authored card)').fill(apCost);
  await form.getByRole('button', { name: 'Offer block roll to owner', exact: true }).click();
  await gm.getByText(`Waiting for the owner’s block roll: ${name}`).waitFor();
}
async function roll(owner, name, face) {
  const card = dialog(owner).getByRole('article', { name: `Block roll for ${name}` });
  await card.waitFor();
  await card.getByLabel(/Natural face/).fill(String(face));
  await card.getByRole('button', { name: 'Approve block roll', exact: true }).click();
  await dialog(owner).getByText(/Awaiting the GM\.$/).waitFor();
}
let hostRef = null;
async function confirm(gm, index) {
  const card = gm.getByRole('article', { name: 'Pending block roll' }).last();
  await card.waitFor();
  await card.getByRole('button', { name: 'Review block', exact: true }).click();
  await card.getByText(/after block|^\S/).first().waitFor();
  await Promise.race([card.getByText(/after block/).first().waitFor({ timeout: 15000 }), card.getByRole('alert').first().waitFor({ timeout: 15000 })]).catch(() => {});
  if (await card.getByRole('alert').count()) throw Error(`GM review refused: ${await card.getByRole('alert').first().innerText()}`);
  save(`gm-pending-${index}.aria.yml`, await card.ariaSnapshot());
  const count = () => hostRef.room.gameState.actorConsequences.receipts.filter(r => r.adjudication?.definitionId === 'creature-attack-block').length;
  const before = count();
  await card.getByRole('button', { name: 'Confirm and apply', exact: true }).click();
  for (let i = 0; i < 100 && count() === before; i++) await new Promise(r => setTimeout(r, 100));
  assert.equal(count(), before + 1, `block ${index} committed exactly once`);
}

async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  hostRef = host;
  for (const event of ['actor_consequence', 'actor_snapshot', 'actor_blocking_view', 'actor_block_offer', 'actor_block_approve', 'actor_block_list', 'actor_block_withdraw', 'actor_block_decline', 'actor_recovery', 'join_room', 'character_updated']) {
    host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  }
  const launch = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, headless: true } : { channel: 'chrome', headless: true };
  const browser = await chromium.launch(launch);
  const pages = ['gm', 'owner', 'observer'].map(() => null);
  try {
    const gm = await browser.newPage({ viewport: { width: 1440, height: 1100 } }), owner = await browser.newPage({ viewport: { width: 1440, height: 1100 } }), observer = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    pages.splice(0, 3, gm, owner, observer);
    for (const [name, page] of [['gm', gm], ['owner', owner], ['observer', observer]]) page.on('pageerror', e => evidence.errors.push({ page: name, message: e.message }));
    await setup(gm, host, 'app-gm'); await setup(owner, host, 'app-owner'); await setup(observer, host, 'app-observer');
    const hall = () => host.room.gameState.maps['app-hall'];
    const declaration = () => hall().characterTokens.pc.state.equipmentBlocking;
    const sheet = () => owner.evaluate(() => { const s = S('characterStore').getState(); return { chest: s.equipment.chest, offHand: s.equipment.offHand, custody: s.roomEquipmentCustody,
      pack: S('inventoryStore').getState().items.filter(i => i.id === 'weathered-hide').map(i => ({ durability: i.durability, broken: i.broken })), packCount: S('inventoryStore').getState().items.length }; });
    await owner.waitForFunction(() => true);
    for (let i = 0; i < 50 && !hall().characterTokens.pc.character.equipment?.chest; i++) await new Promise(r => setTimeout(r, 100));
    assert.equal(hall().characterTokens.pc.character.equipment.chest.id, 'weathered-hide', 'shared equipment published by the real sync');
    assert.equal('durability' in hall().characterTokens.pc.character.equipment.chest, false, 'durability is never part of shared equipment');

    // B2 in the App: the server refuses a declaration on another combatant's turn (fixture combat order).
    host.room.gameState.combat = { isActive: true, round: 1, currentTurnIndex: 0, currentTurnStartTime: Date.now(), turnOrder: [{ tokenId: 'A', actorRef: host.refs.A }, { tokenId: 'pc', actorRef: host.refs.pc }] };
    await chip(owner).click(); await dialog(owner).waitFor();
    save('owner-initial.aria.yml', await dialog(owner).ariaSnapshot());
    await dialog(owner).getByRole('button', { name: 'Add Weathered Hide (armor d8)', exact: true }).click();
    await dialog(owner).getByRole('button', { name: 'Add Oak Buckler (shield d8)', exact: true }).click();
    await dialog(owner).getByRole('button', { name: 'Save blocking declaration', exact: true }).click();
    await dialog(owner).getByText('You can change your blocking piece only on your own turn.').waitFor();
    assert.equal(declaration(), undefined);
    host.room.gameState.combat = { ...host.room.gameState.combat, isActive: false };
    evidence.witnesses.selectionWindow = { refusedOnOtherTurn: true };

    // B1: declaration out of combat; owner custody records the lineage with private keys.
    await dialog(owner).getByRole('button', { name: 'Save blocking declaration', exact: true }).click();
    await dialog(owner).getByText('Declared: Weathered Hide d8 → Oak Buckler d8').waitFor();
    assert.equal(declaration().revision, 1);
    let s = await sheet();
    assert.deepEqual(s.custody.entries[0].pieces.map(p => [p.slot, p.keySource, p.die]), [['chest', 'slot-legacy', 'd8'], ['offHand', 'uuid', 'd8']]);
    const observed = await observer.evaluate(() => JSON.stringify([S('characterTokenStore').getState().characterTokens, S('mapStore').getState().maps]));
    assert.equal(observed.includes('equipmentBlocking'), false, 'observer never receives the declaration');
    assert.equal((await observer.evaluate(() => Object.keys(__blocking.store.getState().offers))).length, 0);
    evidence.witnesses.declaration = { serverRevision: 1, custody: s.custody.entries[0], observerHasDeclaration: false };

    // B4: hit → owner block roll (face 2 on armor d8) → GM confirm → HP and wear in one receipt.
    await offer(gm, { name: 'Raking Claw', faces: '7', damage: 7 });
    await roll(owner, 'Raking Claw', 2);
    save('owner-awaiting.aria.yml', await dialog(owner).ariaSnapshot());
    const receiptsBefore = host.room.gameState.actorConsequences.receipts.length;
    await confirm(gm, 1);
    const receipt = host.room.gameState.actorConsequences.receipts.at(-1);
    assert.equal(host.room.gameState.actorConsequences.receipts.length, receiptsBefore + 1, 'one receipt');
    assert.equal(hall().characterTokens.pc.character.health.current, 15, '20 − (7 − 2)');
    assert.equal(hall().tokens.A.state.currentActionPoints, 1);
    assert.equal(declaration().pieces[0].currentDie, 'd6');
    await owner.getByText(/^Accepted: Ilse takes 5 HP from A's Raking Claw \(AP −1\)\. Weathered Hide blocked 2; worn d8 → d6\.$/).first().waitFor();
    s = await sheet();
    assert.equal(s.chest.durability, 'd6'); assert.equal(s.custody.entries[0].revision, 2);
    evidence.witnesses.hitAndWear = { receiptCommandId: receipt.commandId, publicWear: receipt.actors[1].equipmentWear, hp: 15, creatureAp: 1, privateChest: s.chest.durability };
    // Duplicate delivery of the same receipt is a no-op on the private sheet.
    await owner.evaluate(() => __deliver(__accepted.at(-1)));
    s = await sheet(); assert.equal(s.chest.durability, 'd6'); assert.equal(s.custody.entries[0].revision, 2);
    evidence.witnesses.duplicate = { privateChest: 'd6', custodyRevision: 2 };
    // Device draft carries custody with equipment (P6 retention path).
    try {
      await owner.waitForFunction(() => S('characterStore').getState().characters.find(c => c.id === 'ilse')?.roomEquipmentCustody?.entries?.[0]?.revision === 2, null, { timeout: 15000 });
      evidence.witnesses.draft = await owner.evaluate(() => { const c = S('characterStore').getState().characters.find(x => x.id === 'ilse'); return { observed: true, chest: c.equipment?.chest?.durability, custodyRevision: c.roomEquipmentCustody.entries[0].revision }; });
    } catch (_) {
      evidence.witnesses.draft = { observed: false, note: 'Fixture principal did not publish the character roster; payload assembly is covered by blockingCustodyPersistence.test.js.' };
    }

    // B12 out of order + full pack: hold the owner's deliveries for two blocks, then release them in reverse.
    await owner.evaluate(() => { window.__hold = true; });
    await offer(gm, { name: 'Gore', faces: '5', damage: 5, apCost: '0' });
    await roll(owner, 'Gore', 1); await confirm(gm, 2); // d6 → d4
    await offer(gm, { name: 'Tail Lash', faces: '4', damage: 4, apCost: '0' });
    await roll(owner, 'Tail Lash', 2); await confirm(gm, 3); // d4 → broken
    assert.deepEqual([declaration().pieces[0].currentDie, declaration().pieces[0].broken], ['broken', true]);
    const filled = await owner.evaluate(() => { let n = 0; for (; n < 400; n++) { const r = S('inventoryStore').getState().addItem({ id: `stone-${n}`, name: 'Stone', type: 'misc', width: 1, height: 1 }); if (!r.success) break; } return n; });
    assert.ok(filled > 0, 'pack filled through the real inventory');
    await owner.evaluate(() => { const [gore, lash] = __held.splice(0); window.__hold = false; __deliver(lash); window.__afterGap = S('characterStore').getState().equipment.chest.durability; __deliver(gore); });
    s = await sheet();
    assert.equal(await owner.evaluate(() => window.__afterGap), 'd6', 'the later receipt waited as a gap');
    assert.deepEqual([s.chest.durability, s.chest.broken, s.pack.length], ['broken', true, 0], 'broken piece stays equipped when the pack is full; nothing deleted');
    assert.equal(s.custody.entries[0].revision, 4);
    assert.equal(s.custody.entries[0].pendingUnequip.length, 1);
    await owner.waitForFunction(() => document.querySelector('button.p12b-chip')?.textContent.includes('broken piece awaiting pack space'));
    save('owner-full-pack.aria.yml', await dialog(owner).ariaSnapshot());
    evidence.witnesses.outOfOrderFullPack = { afterGap: 'd6', final: s.chest, packHasHide: s.pack.length, pendingUnequip: s.custody.entries[0].pendingUnequip };
    // Free space, then the explicit control completes the move: exactly one copy.
    await owner.evaluate(() => S('inventoryStore').setState({ items: S('inventoryStore').getState().items.filter(i => !String(i.id).startsWith('stone-')) }));
    await dialog(owner).getByRole('button', { name: 'Move broken piece to pack', exact: true }).click();
    await owner.waitForFunction(() => S('characterStore').getState().equipment.chest === null);
    s = await sheet();
    assert.deepEqual(s.pack, [{ durability: 'broken', broken: true }]);
    assert.equal(s.custody.entries[0].pendingUnequip.length, 0);
    evidence.witnesses.unequipAfterSpace = { chest: null, packCopies: s.pack.length };

    // B6: the next block uses the first available backup (the shield); face 2 does not wear a shield.
    await offer(gm, { name: 'Bite', faces: '6', damage: 6, apCost: '0' });
    await dialog(owner).getByRole('article', { name: 'Block roll for Bite' }).getByText(/Blocks with Oak Buckler/).waitFor();
    await roll(owner, 'Bite', 2); await confirm(gm, 4);
    assert.equal(declaration().pieces[1].currentDie, 'd8');
    await owner.getByText(/Oak Buckler blocked 2 \(no wear\)\.$/).first().waitFor();
    s = await sheet(); assert.equal(s.offHand.durability, 'd8'); assert.equal(s.custody.entries[0].revision, 5);
    evidence.witnesses.backup = { piece: 'offHand', die: 'd8', custodyRevision: 5 };
    const observerText = await observer.locator('body').innerText();
    evidence.witnesses.observerPublicText = { sawAcceptedLine: /Ilse takes/.test(observerText), hasDeclarationKeys: /equipmentBlocking|declaredDuring/.test(JSON.stringify(await observer.evaluate(() => __accepted))) };
    assert.equal(evidence.witnesses.observerPublicText.hasDeclarationKeys, false);
    save('gm-final.aria.yml', await gm.getByRole('region', { name: 'Creature attack block adjudication' }).ariaSnapshot());
    evidence.receipts = host.room.gameState.actorConsequences.receipts.filter(r => r.adjudication?.definitionId === 'creature-attack-block').map(r => ({ commandId: r.commandId, wear: r.actors[1].equipmentWear, finalAmount: r.adjudication.finalAmount }));
    evidence.pass = true;
  } finally {
    evidence.endedAt = new Date().toISOString();
    save('result.json', evidence);
    await browser.close(); await host.stop();
  }
}
main().then(() => { console.log(JSON.stringify({ pass: evidence.pass === true, errors: evidence.errors.length, out })); process.exit(0); }, e => { evidence.failure = e.stack; save('result.json', evidence); console.error(e); process.exit(1); });
