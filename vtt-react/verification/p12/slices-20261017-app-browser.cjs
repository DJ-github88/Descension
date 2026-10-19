// P12B-r1, P13A and P12C-B1 (2026-10-17) in the actual optimized App with registered Socket.IO handlers.
// GM, owner and observer pages; no component replacement. Provider identity, canonical owner documents,
// lease storage and cloud transport are the P9/P12 fixtures. Output stays outside Git.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), crypto = require('crypto');
const { chromium } = require('playwright');
const out = process.env.SLICES_OUTPUT;
if (!out || !process.env.APP_BUILD_DIR) throw Error('SLICES_OUTPUT and APP_BUILD_DIR must point outside Git.');
fs.mkdirSync(out, { recursive: true });
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
const evidence = { build: process.env.APP_BUILD_DIR, startedAt: new Date().toISOString(), witnesses: {}, errors: [],
  limits: ['Full optimized App/router/components/CSS; production stores/services and real registered Socket.IO handlers (actor, blocking, spell).',
    'Test-only webpack access seeds fixture users, the owner sheet and the room socket; external Firebase identity, lease storage and cloud writes are simulated.',
    'Hiding a creature for the observer is applied to that client’s projection (the GM hide control is outside these slices). No live Firebase/rules, second physical device, human session or deployment claim.'] };
const legacySetup = require('../p9/integration/app-browser.cjs').setup;
const HIDE = { id: 'weathered-hide', name: 'Weathered Hide', type: 'armor', subtype: 'LEATHER', durability: 'd8', maxDurability: 'd8', width: 2, height: 3, slots: ['chest'] };
const ack = (s, e, p) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error('ACK timeout ' + e)), 10000); s.emit(e, p, r => { clearTimeout(t); resolve(r); }); });

async function setup(page, host, uid) {
  await legacySetup(page, host.url, uid);
  await page.evaluate(async({ uid, HIDE }) => {
    const moduleWith = text => { const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); if (!pair) throw Error('Missing compiled ' + text); return __req(pair[0]); };
    const blocking = moduleWith('Submitting one HP + wear consequence');
    const fn = text => Object.values(blocking).find(f => typeof f === 'function' && f.toString().includes(text));
    window.__blocking = { register: fn('actor_block_offered'), lists: fn('actor_block_list') };
    // Comments do not survive minification: identify the feed by literals only it combines.
    const feedPair = Object.entries(__req.m).find(([, f]) => { const t = f.toString(); return ['absorbed', 'p9-spell:v1/', 'p12a-strike:v1/basic-weapon-strike', 'feather-slash:v1/abilities:1.4.0'].every(x => t.includes(x)); });
    if (!feedPair) throw Error('Missing compiled accepted-result feed');
    window.__feed = __req(feedPair[0]);
    window.__feedStore = Object.values(__feed).find(v => typeof v === 'function' && typeof v.getState === 'function' && 'narration' in v.getState());
    if (!__blocking.register || !__feedStore) throw Error('Missing compiled exports');
    __blocking.register({ socket: __socket }); // the actor handler (P13A path) stays registered as in production
    // Production rejoin wiring: the socket's one room_joined listener is registered by the same production function the
    // App's room lifecycle calls (registerRoomJoinedListener, services/roomRejoinBus.js). The harness does not mount
    // MultiplayerApp, so it passes no UI join handler; registration, rejoin decision and relay are production code.
    const busPair = Object.entries(__req.m).find(([, f]) => f.toString().includes('[roomRejoin] subscriber failed'));
    const busExports = busPair ? Object.values(__req(busPair[0])).filter(fn => typeof fn === 'function') : [];
    const registerRoomJoined = busExports.find(fn => fn.toString().includes('room_joined'));
    if (!registerRoomJoined) throw Error('Missing compiled rejoin registration');
    registerRoomJoined(__socket);
    // Production account-handoff retirement (retireSocketPrincipal: marks retired, detaches listeners, disconnects).
    const retirement = Object.entries(__req.m).find(([, f]) => { const t = f.toString(); return t.includes('public:none') && t.includes('removeAllListeners'); });
    window.__retireSocket = retirement && Object.values(__req(retirement[0])).find(fn => typeof fn === 'function' && fn.toString().includes('removeAllListeners'));
    if (!window.__retireSocket) throw Error('Missing compiled retireSocketPrincipal');
    // Floats live 1.8 s: record each one as it mounts instead of sampling the screen once.
    window.__floatLog = [];
    new MutationObserver(records => records.forEach(r => r.addedNodes.forEach(n => {
      if (n.nodeType !== 1) return;
      [...(n.matches?.('.fct-chip') ? [n] : []), ...n.querySelectorAll?.('.fct-chip') || []].forEach(chip =>
        __floatLog.push({ text: chip.textContent, token: chip.closest('.creature-token, .character-token')?.className.split(' ')[0] || null, at: Date.now() }));
    }))).observe(document.body, { childList: true, subtree: true });
    if (uid === 'app-owner') {
      S('characterStore').setState({ characters: [{ id: 'ilse', name: 'Ilse' }], equipment: { ...S('characterStore').getState().equipment, chest: HIDE, offHand: null }, roomEquipmentCustody: null });
      S('inventoryStore').setState({ items: [] });
      S('characterStore').getState().syncWithMultiplayer();
    }
    await __blocking.lists();
  }, { uid, HIDE });
}
const chip = page => page.locator('button.p12b-chip');
const blockDialog = page => page.getByRole('dialog', { name: 'Blocking and wear', exact: true });
async function offer(gm, { name, faces, damage, apCost = '1' }) {
  const form = gm.getByRole('group', { name: 'Creature attack → owner block roll' });
  await form.getByRole('combobox', { name: 'Attacking creature' }).selectOption('creature:app-hall:A');
  await form.getByRole('combobox', { name: 'Target character' }).selectOption('character:app-hall:pc');
  await form.getByLabel('Attack name').fill(name); await form.getByLabel('Attack dice').fill('1d10'); await form.getByLabel('Attack faces').fill(faces);
  await form.getByRole('combobox', { name: 'GM-declared result' }).selectOption('hit'); await form.getByRole('combobox', { name: 'Damage type' }).selectOption('slicing');
  await form.getByLabel('Proposed damage (before the block)').fill(String(damage)); await form.getByLabel('Creature AP cost (authored card)').fill(apCost);
  await form.getByRole('button', { name: 'Offer block roll to owner', exact: true }).click();
  await gm.getByText(`Waiting for the owner’s block roll: ${name}`).waitFor();
}
async function roll(owner, name, face) {
  const card = blockDialog(owner).getByRole('article', { name: `Block roll for ${name}` });
  await card.waitFor();
  await card.getByLabel(/Natural face/).fill(String(face));
  await card.getByRole('button', { name: 'Approve block roll', exact: true }).click();
  await blockDialog(owner).getByText(/Awaiting the GM\.$/).waitFor();
}
const blockReceipts = host => host.room.gameState.actorConsequences.receipts.filter(r => r.adjudication?.definitionId === 'creature-attack-block');
async function waitCount(fnCount, target) { for (let i = 0; i < 120 && fnCount() < target; i++) await new Promise(r => setTimeout(r, 100)); assert.equal(fnCount(), target); }
const floats = page => page.evaluate(() => [...document.querySelectorAll('.fct-chip')].map(n => ({ text: n.textContent, token: n.closest('.creature-token, .character-token')?.className.split(' ')[0] })));
const floatLog = page => page.evaluate(() => window.__floatLog || []);
const narration = page => page.evaluate(() => ({ banner: document.querySelector('.arn-text')?.textContent || null, live: document.querySelector('.arn-sr')?.textContent || '',
  history: __feedStore.getState().narration.history.map(h => ({ id: h.id, text: h.text, historical: !!h.historical })) }));

async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  for (const event of ['actor_consequence', 'actor_snapshot', 'actor_blocking_view', 'actor_block_offer', 'actor_block_approve', 'actor_block_list', 'actor_block_withdraw',
    'actor_block_decline', 'actor_recovery', 'join_room', 'character_updated', 'actor_spell_approve', 'actor_spell_list', 'actor_spell_withdraw']) {
    host.backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  }
  const launch = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, headless: true } : { channel: 'chrome', headless: true };
  const browser = await chromium.launch(launch);
  const pages = {};
  const hall = () => host.room.gameState.maps['app-hall'];
  try {
    for (const [name, uid, width] of [['gm', 'app-gm', 1440], ['owner', 'app-owner', 1440], ['observer', 'app-observer', 1280]]) {
      pages[name] = await browser.newPage({ viewport: { width, height: 1000 } });
      pages[name].on('pageerror', e => evidence.errors.push({ page: name, message: e.message }));
      await setup(pages[name], host, uid);
    }
    const { gm, owner, observer } = pages;
    for (let i = 0; i < 50 && !hall().characterTokens.pc.character.equipment?.chest; i++) await new Promise(r => setTimeout(r, 100));
    await chip(owner).click(); await blockDialog(owner).waitFor();
    await blockDialog(owner).getByRole('button', { name: 'Add Weathered Hide (armor d8)', exact: true }).click();
    await blockDialog(owner).getByRole('button', { name: 'Save blocking declaration', exact: true }).click();
    await blockDialog(owner).getByText('Declared: Weathered Hide d8').waitFor();

    // ── P12B-r1 B15 in the App: two attacks offered before any roll; both recorded faces apply (carry-forward).
    await offer(gm, { name: 'Raking Claw', faces: '7', damage: 7 });
    await offer(gm, { name: 'Gore', faces: '5', damage: 5 });
    const apBefore = hall().tokens.A.state.currentActionPoints + (hall().tokens.A.state.tempActionPoints || 0);
    const revisionAtOffer = hall().tokens.A.state.actorContract.revision;
    await roll(owner, 'Raking Claw', 3);
    let card = gm.getByRole('article', { name: 'Pending block roll' }).last();
    await card.getByRole('button', { name: 'Review block', exact: true }).click(); await card.getByText(/after block/).first().waitFor();
    await card.getByRole('button', { name: 'Confirm and apply', exact: true }).click();
    await waitCount(() => blockReceipts(host).length, 1);
    await roll(owner, 'Gore', 4);
    card = gm.getByRole('article', { name: 'Pending block roll' }).last();
    await card.getByRole('button', { name: 'Review block', exact: true }).click(); await card.getByText(/after block/).first().waitFor();
    await card.getByRole('button', { name: 'Confirm and apply', exact: true }).click();
    await waitCount(() => blockReceipts(host).length, 2);
    const second = blockReceipts(host)[1], secondChosen = JSON.parse(second.adjudication.chosenResult);
    assert.equal(secondChosen.attack.sourceRevision, revisionAtOffer, 'the second attack keeps its offer-time record');
    assert.equal(secondChosen.block.face, 4); assert.equal('revalidation' in secondChosen, false);
    assert.equal(hall().tokens.A.state.currentActionPoints + (hall().tokens.A.state.tempActionPoints || 0), apBefore - 2, 'AP spent twice');
    evidence.witnesses.carryForward = { receipts: 2, secondSourceRevisionAtOffer: revisionAtOffer, secondFace: 4, hp: hall().characterTokens.pc.character.health.current };

    // ── P13A on three viewers for the carried-forward receipt (Gore: 5 − 4 = 1 HP).
    for (const page of Object.values(pages)) await page.waitForFunction(() => (window.__floatLog || []).some(f => f.text === '−1 HP'), null, { timeout: 5000 }).catch(() => {});
    const seen = {};
    for (const [name, page] of Object.entries(pages)) seen[name] = { floats: await floatLog(page), narration: await narration(page) };
    save('p13a-after-gore.json', seen);
    for (const name of ['gm', 'owner', 'observer']) {
      assert.ok(seen[name].narration.history.some(h => h.id === `p13a:${host.room.id}:${second.commandId}` && /Gore hits Ilse; Weathered Hide blocks 4/.test(h.text) && /Ilse −1 HP/.test(h.text)), `${name} narration names the accepted result`);
      assert.equal(seen[name].narration.history.filter(h => h.id === `p13a:${host.room.id}:${second.commandId}`).length, 1, `${name}: one entry (ack + broadcast deduplicated)`);
    }
    assert.ok(seen.observer.floats.some(f => f.text === '−1 HP' && f.token === 'character-token'), 'observer sees the HP float on Ilse');
    assert.ok(seen.owner.floats.every(f => !/AP|mana|d8|d6/.test(f.text)), 'only HP floats in this slice');
    evidence.witnesses.p13aLive = seen;
    save('observer-banner.aria.yml', await observer.locator('.arn').ariaSnapshot());
    await observer.screenshot({ path: path.join(out, 'observer-float-banner.png') });

    // ── P12B-r1 B17 in the App: an unrelated change to the creature needs the GM's explicit revalidation.
    await offer(gm, { name: 'Tail Lash', faces: '6', damage: 6, apCost: '0' });
    await roll(owner, 'Tail Lash', 5);
    const foe = hall().tokens.A;
    // The unrelated change is an ordinary GM P7 consequence sent over the GM page's own room socket.
    const { snap, bump, bumpCommand } = await gm.evaluate(async({ roomId, ref, revision, hp, temp, commandId }) => {
      const call = (event, payload) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error('ACK timeout ' + event)), 10000); __socket.emit(event, payload, r => { clearTimeout(t); resolve(r); }); });
      const snap = await call('actor_snapshot', { roomId });
      const bumpCommand = { version: 1, roomId, commandId, actionEpoch: snap.actionEpoch, baseCommitSequence: snap.commitSequence, actors: [{ ref, expectedRevision: revision, finalResources: { hp: { current: hp, temp } } }] };
      return { snap: { success: snap.success, code: snap.code }, bumpCommand, bump: await call('actor_consequence', bumpCommand) };
    }, { roomId: host.room.id, ref: host.refs.A, revision: foe.state.actorContract.revision, hp: foe.state.currentHp - 1, temp: foe.state.tempHealth || 0, commandId: crypto.randomUUID() });
    assert.equal(bump.success, true, JSON.stringify({ bump, snapshot: { success: snap.success, code: snap.code, actionEpoch: snap.actionEpoch, commitSequence: snap.commitSequence }, command: bumpCommand }));
    card = gm.getByRole('article', { name: 'Pending block roll' }).last();
    await card.getByRole('button', { name: 'Review block', exact: true }).click(); await card.getByText(/after block/).first().waitFor();
    await card.getByRole('button', { name: 'Confirm and apply', exact: true }).click();
    await card.getByRole('region', { name: 'Attack revalidation' }).waitFor();
    save('gm-revalidation.aria.yml', await card.ariaSnapshot());
    assert.equal(blockReceipts(host).length, 2, 'nothing applied before the ruling');
    await card.getByLabel(/Why the recorded rolls still stand/).fill('The lash was already in motion.');
    await card.getByRole('button', { name: 'Recorded rolls still stand — apply', exact: true }).click();
    await waitCount(() => blockReceipts(host).length, 3);
    const third = JSON.parse(blockReceipts(host)[2].adjudication.chosenResult);
    assert.equal(third.revalidation.reason, 'The lash was already in motion.'); assert.equal(third.block.face, 5);
    await owner.getByText(/GM confirmed the recorded rolls after the attacker changed: The lash was already in motion\./).first().waitFor();
    evidence.witnesses.revalidation = third.revalidation;

    // ── P12B-r1 B18 in the App: void closes the attack; the owner cannot roll it again.
    await offer(gm, { name: 'Bite', faces: '8', damage: 8, apCost: '0' });
    await roll(owner, 'Bite', 1);
    card = gm.getByRole('article', { name: 'Pending block roll' }).last();
    await card.getByRole('button', { name: 'Void attack (nothing applied)', exact: true }).click();
    await blockDialog(owner).getByText(/Block roll 1 voided by the GM; nothing was applied\. This attack is closed and cannot be rolled again\./).waitFor();
    assert.equal(await blockDialog(owner).getByRole('article', { name: 'Block roll for Bite' }).count(), 0, 'no roll control for the closed attack');
    await blockDialog(owner).locator('summary', { hasText: 'Closed attacks' }).click();
    await blockDialog(owner).getByText(/Bite: attack \[8\] · hit · block face 1 on chest d[0-9]+ — voided by the GM\. Cannot be rolled again\./).waitFor();
    assert.equal(blockReceipts(host).length, 3);
    evidence.witnesses.void = { closed: true, receipts: 3 };
    await blockDialog(owner).getByRole('button', { name: 'Close', exact: true }).click();

    // ── P13A privacy: the observer cannot see creature A; a result naming it is published neutrally.
    await observer.evaluate(() => { const s = S('creatureStore'); const tokens = s.getState().tokens.map(t => t.id === 'A' ? { ...t, state: { ...t.state, hiddenFromPlayers: true } } : t); s.setState({ tokens, creatureTokens: tokens }); });
    await observer.waitForFunction(() => !document.querySelector('.creature-token img[alt="A"]') && !Object.keys(__feedStore.getState().rendered).some(k => k.includes('|A|')));
    await offer(gm, { name: 'Shadow Claw', faces: '6', damage: 6, apCost: '0' });
    await roll(owner, 'Shadow Claw', 4);
    card = gm.getByRole('article', { name: 'Pending block roll' }).last();
    await card.getByRole('button', { name: 'Review block', exact: true }).click(); await card.getByText(/after block/).first().waitFor();
    await card.getByRole('button', { name: 'Confirm and apply', exact: true }).click();
    await waitCount(() => blockReceipts(host).length, 4);
    const hidden = blockReceipts(host)[3];
    await observer.waitForFunction(id => __feedStore.getState().narration.history.some(h => h.id === id), `p13a:${host.room.id}:${hidden.commandId}`);
    const obs = await narration(observer), entry = obs.history.find(h => h.id === `p13a:${host.room.id}:${hidden.commandId}`);
    const observerChat = await observer.evaluate(() => JSON.stringify(S('chatStore').getState().notifications.combat));
    assert.equal(/Shadow Claw|hits|blocks/.test(entry.text), false, 'no capability, ability or source for a hidden actor');
    assert.match(entry.text, /^Ilse −2 HP/);
    assert.equal(/Shadow Claw/.test(observerChat), false, 'combat log line neutral too');
    assert.equal(/Shadow Claw/.test(obs.live), false, 'announcement neutral too');
    await gm.waitForFunction(id => __feedStore.getState().narration.history.some(h => h.id === id), entry.id, { timeout: 10000 }).catch(() => {}); // delivery order across pages is not fixed
    const gmSeen = await narration(gm);
    assert.ok(gmSeen.history.some(h => h.id === entry.id && /Shadow Claw/.test(h.text)), 'the GM sees the full result');
    evidence.witnesses.hiddenActor = { observerText: entry.text, observerChatMentionsAbility: false, gmFull: true };

    // ── P13A no replay: reload the observer; nothing floats or announces on hydration.
    await observer.reload(); await setup(observer, host, 'app-observer');
    await observer.waitForTimeout(1500);
    const afterReload = { floats: [...await floats(observer), ...await floatLog(observer)], narration: await narration(observer) };
    assert.deepEqual(afterReload.floats, []); assert.equal(afterReload.narration.banner, null); assert.equal(afterReload.narration.live, '');
    evidence.witnesses.reload = afterReload;

    // ── P12C-B1 P8 (GM): Esc and right-click while picking return to the dialog; the recorded roll survives close/reopen;
    // discard is explicit and listed; nothing is spent.
    const apA = () => hall().tokens.A.state.currentActionPoints + (hall().tokens.A.state.tempActionPoints || 0);
    const apBeforeP8 = apA();
    // Integration closure: a real hover and click at 1440 px — the bounded adjudication column no longer covers the fan.
    const openFeather = async() => { await gm.locator('.creature-token').first().hover(); await gm.getByAltText('Feather Slash', { exact: true }).first().click({ timeout: 10000 }); };
    const feather = gm.getByRole('dialog', { name: 'Feather Slash adjudication' });
    await openFeather(); await feather.waitFor();
    await feather.getByRole('combobox', { name: 'Feather Slash target' }).selectOption('creature:B');
    await feather.getByLabel('Physical d8 face 1').fill('2'); await feather.getByLabel('Physical d8 face 2').fill('4');
    await feather.getByRole('button', { name: 'Record physical faces', exact: true }).click();
    await feather.getByText(/recorded faces \[2, 4\]/).waitFor();
    await feather.getByRole('button', { name: 'Pick on map', exact: true }).click(); await gm.locator('.tpo-catcher').waitFor();
    assert.equal(await feather.count(), 0, 'the Feather Slash dialog steps aside while picking');
    await gm.keyboard.press('Escape'); await feather.waitFor();
    assert.equal(await gm.locator('.tpo-catcher').count(), 0, 'Esc ends the pick session');
    await feather.getByText(/recorded faces \[2, 4\]/).waitFor();
    await feather.getByRole('button', { name: 'Pick on map', exact: true }).click(); await gm.locator('.tpo-catcher').waitFor();
    await gm.locator('.tpo-catcher').click({ button: 'right', position: { x: 720, y: 640 } }); await feather.waitFor();
    assert.equal(await gm.locator('.tpo-catcher').count(), 0, 'right-click ends the pick session');
    await feather.getByRole('button', { name: 'Close Feather Slash', exact: true }).click();
    await openFeather(); await feather.waitFor();
    await feather.getByText(/recorded faces \[2, 4\]/).waitFor();
    assert.equal(await feather.getByRole('button', { name: 'Roll two d8 once', exact: true }).count(), 0, 'no second roll control after close/reopen');
    await feather.getByRole('button', { name: 'Discard recorded roll', exact: true }).click();
    await feather.getByRole('button', { name: 'Roll two d8 once', exact: true }).waitFor();
    await feather.locator('summary', { hasText: 'Discarded unsent rolls on this device (1)' }).click();
    await feather.getByText(/\[2, 4\]/).waitFor();
    await feather.getByRole('button', { name: 'Close Feather Slash', exact: true }).click();
    assert.equal(apA(), apBeforeP8, 'picking, closing and discarding spent nothing');
    evidence.witnesses.p8 = { escReturnsToDialog: true, rightClickCancels: true, rollKeptThroughCloseReopen: [2, 4], discardListed: true, apUnchanged: apA() };

    // ── P12C-B1: P9 spell, pick on map, roll retention through target change, close/reopen and reload.
    const dropSpell = async(page, id, name) => {
      await page.locator('.action-bar-assembly .action-slot').first().evaluate((el, payload) => { const data = new DataTransfer(); data.setData('application/json', JSON.stringify(payload));
        const event = new Event('drop', { bubbles: true, cancelable: true }); Object.defineProperty(event, 'dataTransfer', { value: data }); el.dispatchEvent(event); }, { id, name, icon: 'Arcane/Ebon Blaze', spellType: 'ACTION' });
      await page.locator('.action-bar-assembly .action-slot').first().getByAltText(name, { exact: true }).waitFor();
    };
    await owner.waitForTimeout(1000);
    await dropSpell(owner, 'arc_spark_bolt', 'Marrow-Piercing Slug');
    await owner.locator('.action-bar-assembly .action-slot').first().click();
    const spellDialog = owner.getByRole('dialog', { name: 'Supported spell cast' }); await spellDialog.waitFor();
    await spellDialog.getByRole('button', { name: 'Pick on map', exact: true }).click();
    await owner.locator('.tpo-catcher').waitFor();
    assert.equal(await spellDialog.count(), 0, 'the panel steps aside while picking');
    const geometry = await owner.evaluate(() => ({ ring: document.querySelectorAll('.tpo-range').length, source: document.querySelectorAll('.tpo-source').length, candidates: document.querySelectorAll('.tpo-candidate').length,
      cursor: getComputedStyle(document.querySelector('.tpo-catcher')).cursor, bar: document.querySelector('.tpo-bar').textContent }));
    assert.equal(geometry.cursor, 'crosshair'); assert.equal(geometry.ring, 1); assert.equal(geometry.source, 1); assert.match(geometry.bar, /card range 60 ft \(ranged\) — advisory/);
    // Esc cancels with the panel unchanged.
    await owner.keyboard.press('Escape'); await spellDialog.waitFor();
    assert.equal(await spellDialog.getByRole('combobox', { name: 'Target', exact: true }).inputValue(), '');
    await spellDialog.getByRole('button', { name: 'Pick on map', exact: true }).click(); await owner.locator('.tpo-catcher').waitFor();
    await owner.locator('.tpo-catcher').click({ button: 'right', position: { x: 720, y: 640 } }); await spellDialog.waitFor();
    assert.equal(await owner.locator('.tpo-catcher').count(), 0, 'right-click cancels too');
    // Hover and pick creature B by its rendered position.
    await spellDialog.getByRole('button', { name: 'Pick on map', exact: true }).click(); await owner.locator('.tpo-catcher').waitFor();
    const bBox = await owner.locator('.creature-token').filter({ has: owner.getByAltText('B', { exact: true }) }).first().boundingBox().catch(() => null)
      || await owner.evaluate(() => { const t = [...document.querySelectorAll('.creature-token')].find(n => n.textContent.includes('B')); const r = t.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
    await owner.mouse.move(bBox.x + bBox.width / 2, bBox.y + bBox.height / 2);
    await owner.waitForFunction(() => /Planar centre distance [0-9.]+ ft — within card range 60 ft/.test(document.querySelector('.tpo-bar')?.textContent || ''));
    const hoverState = await owner.evaluate(() => ({ aim: document.querySelectorAll('.tpo-aim').length, target: document.querySelectorAll('.tpo-target').length, label: document.querySelector('.tpo-label')?.textContent, bar: document.querySelector('.tpo-bar').textContent }));
    await owner.screenshot({ path: path.join(out, 'pick-hover.png') });
    await owner.mouse.click(bBox.x + bBox.width / 2, bBox.y + bBox.height / 2);
    await spellDialog.waitFor();
    assert.equal(await spellDialog.getByRole('combobox', { name: 'Target', exact: true }).inputValue(), 'creature:app-hall:B', 'the pick fills the exact ref');
    evidence.witnesses.pick = { geometry, hoverState };
    await owner.getByLabel('d8 face 1', { exact: true }).fill('6'); await owner.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    await spellDialog.getByText(/Recorded physical roll: \[6\]/).waitFor();
    await spellDialog.getByRole('combobox', { name: 'Target', exact: true }).selectOption('creature:app-hall:A');
    await spellDialog.getByText(/Recorded physical roll: \[6\]/).waitFor();
    assert.equal(await spellDialog.getByRole('button', { name: /^Roll / }).count(), 0, 'no second roll control after a target change');
    await spellDialog.getByRole('button', { name: 'Close', exact: true }).click();
    await owner.locator('.action-bar-assembly .action-slot').first().click(); await spellDialog.waitFor();
    await spellDialog.getByText(/Recorded physical roll: \[6\]/).waitFor();
    assert.equal(await spellDialog.getByRole('combobox', { name: 'Target', exact: true }).inputValue(), 'creature:app-hall:A', 'the draft restores the target');
    await owner.reload(); await setup(owner, host, 'app-owner'); await owner.waitForTimeout(1000);
    await owner.locator('.action-bar-assembly .action-slot').first().getByAltText('Marrow-Piercing Slug', { exact: true }).waitFor({ timeout: 15000 }).catch(async() => dropSpell(owner, 'arc_spark_bolt', 'Marrow-Piercing Slug'));
    await owner.locator('.action-bar-assembly .action-slot').first().click(); await spellDialog.waitFor();
    await spellDialog.getByText(/Recorded physical roll: \[6\]/).waitFor();
    evidence.witnesses.rollRetention = { afterTargetChange: true, afterReopen: true, afterReload: true };
    await spellDialog.getByRole('combobox', { name: 'Target', exact: true }).selectOption('creature:app-hall:B');
    await spellDialog.getByRole('button', { name: 'Approve price and send to GM' }).click();
    const spellCard = gm.locator('.p9-gm-card').first(); await spellCard.waitFor();
    const approved = host.room.gameState && null; void approved;
    await gm.getByRole('combobox', { name: 'Exact room attachment' }).selectOption('character:pc');
    await spellCard.getByRole('checkbox').check(); await spellCard.getByLabel(/^Final/).fill('7'); await spellCard.getByLabel(/^Reason/).fill('GM mitigation');
    const hpBefore = hall().tokens.B.state.currentHp, tempBefore = hall().tokens.B.state.tempHealth || 0;
    await spellCard.getByRole('button', { name: 'Accept one consequence' }).click();
    for (let i = 0; i < 100 && hall().tokens.B.state.currentHp === hpBefore; i++) await new Promise(r => setTimeout(r, 100));
    const p9 = host.room.gameState.actorConsequences.receipts.at(-1);
    assert.deepEqual(JSON.parse(p9.adjudication.chosenResult).roll.dice[0].faces, [6], 'the recorded face was sent, not a new roll');
    // The float shows exactly the applied after-values: temporary HP first, then HP (7 = temp part + HP part).
    const hpLoss = hpBefore - hall().tokens.B.state.currentHp, tempLoss = tempBefore - (hall().tokens.B.state.tempHealth || 0);
    assert.equal(hpLoss + tempLoss, 7, 'GM final 7 applied across temporary HP and HP');
    await gm.waitForFunction(expected => (window.__floatLog || []).some(f => f.token === 'creature-token' && f.text === expected), hpLoss > 0 ? `−${hpLoss} HP` : `−${tempLoss} temp HP`, { timeout: 5000 });
    const gmFloats = (await floatLog(gm)).filter(f => f.token === 'creature-token').map(f => f.text);
    evidence.witnesses.p9AfterPick = { face: 6, hp: [hpBefore, hall().tokens.B.state.currentHp], temp: [tempBefore, tempBefore - tempLoss], gmFloats };

    // ── P12C-B1 T9: an unsupported (area) spell in a shared room posts a notice and spends nothing.
    if (await spellDialog.count()) await spellDialog.getByRole('button', { name: 'Close', exact: true }).click();
    await dropSpell(owner, 'arc_steam_burst', 'Superheated Steam Vent');
    const pools = () => JSON.stringify(['health', 'tempHealth', 'mana', 'tempMana', 'actionPoints', 'tempActionPoints'].map(k => hall().characterTokens.pc.character[k]));
    const poolsBefore = pools();
    await owner.locator('.action-bar-assembly .action-slot').first().click();
    await owner.getByText(/Manual — the VTT applies nothing in this room/).first().waitFor();
    await owner.getByRole('button', { name: 'Post manual notice', exact: true }).click();
    await owner.waitForTimeout(1500);
    assert.equal(pools(), poolsBefore, 'manual action spent nothing in the room');
    assert.ok((await owner.evaluate(() => JSON.stringify(S('chatStore').getState().notifications.combat))).includes('manual: resolved at the table; nothing applied by the VTT'));
    evidence.witnesses.manualAction = { spent: false };

    // ── Integration closure (2026-10-18): repeated authorized rejoins recover pending block work through the single
    // room_joined listener; listeners and rejoin subscribers do not accumulate; no reroll, duplicate payment or receipt.
    // Accumulation shows as more than one list read per rejoin (one per subscribed service) or extra room_joined listeners.
    const listenerState = page => page.evaluate(() => ({ roomJoined: __socket.listeners('room_joined').length, roomId: S('gameStore').getState().multiplayerRoom?.id,
      blockLists: __outbound.filter(v => v.event === 'actor_block_list').length }));
    const rejoinPage = (page, playerName) => page.evaluate(async playerName => {
      __socket.disconnect(); __socket.connect(); await new Promise(r => __socket.once('connect', r));
      const joined = new Promise(r => __socket.once('room_joined', r));
      __socket.emit('join_room', { roomId: S('gameStore').getState().multiplayerRoom.id, playerName, password: '' }); await joined;
    }, playerName);
    const listReads = (page, from) => page.evaluate(n => __outbound.filter(v => v.event === 'actor_block_list').length - n, from);
    const baseline = { gm: await listenerState(gm), owner: await listenerState(owner) };
    assert.equal(baseline.gm.roomJoined, 1, 'one room_joined listener'); assert.equal(baseline.owner.roomJoined, 1);
    const cycles = [];
    if (await owner.locator('dialog[open]').count()) await owner.keyboard.press('Escape');
    for (let i = 0; i < 3; i++) {
      const name = `Rejoin Swipe ${i + 1}`, face = [2, 3, 4][i];
      // Owner away: the offer is made while the owner's socket is down; it must reappear after the owner rejoins.
      await owner.evaluate(() => __socket.disconnect());
      await offer(gm, { name, faces: '5', damage: 5, apCost: '0' });
      const ownerLists = (await listenerState(owner)).blockLists;
      await rejoinPage(owner, 'app-owner');
      if (!(await blockDialog(owner).isVisible())) await chip(owner).click();
      await blockDialog(owner).getByRole('article', { name: `Block roll for ${name}` }).waitFor({ timeout: 10000 });
      await owner.waitForTimeout(500);
      const ownerReads = await listReads(owner, ownerLists);
      assert.equal(ownerReads, 1, 'one list read per rejoin for the owner (no accumulated subscriber)');
      // GM away: the owner's block roll arrives while the GM's socket is down; it must reappear after the GM rejoins.
      await gm.evaluate(() => __socket.disconnect());
      const card = blockDialog(owner).getByRole('article', { name: `Block roll for ${name}` });
      await card.getByLabel(/Natural face/).fill(String(face));
      await card.getByRole('button', { name: 'Approve block roll', exact: true }).click();
      await blockDialog(owner).getByText(/Awaiting the GM\.$|could not reach|unresolved|Check/).first().waitFor({ timeout: 10000 }).catch(() => {});
      const receiptsBefore = blockReceipts(host).length;
      const gmLists = (await listenerState(gm)).blockLists;
      await rejoinPage(gm, 'app-gm');
      const pendingCard = gm.getByRole('article', { name: 'Pending block roll' }).last();
      await pendingCard.waitFor({ timeout: 10000 });
      await gm.waitForTimeout(500);
      const gmReads = await listReads(gm, gmLists);
      assert.equal(gmReads, 1, 'one list read per rejoin for the GM (no accumulated subscriber)');
      await pendingCard.getByRole('button', { name: 'Review block', exact: true }).click(); await pendingCard.getByText(/after block/).first().waitFor();
      await pendingCard.getByRole('button', { name: 'Confirm and apply', exact: true }).click();
      await waitCount(() => blockReceipts(host).length, receiptsBefore + 1);
      await new Promise(r => setTimeout(r, 800));
      assert.equal(blockReceipts(host).length, receiptsBefore + 1, 'exactly one receipt per offer');
      const chosen = JSON.parse(blockReceipts(host).at(-1).adjudication.chosenResult);
      assert.equal(chosen.block.face, face, 'the face rolled before the rejoin is the one applied');
      const state = { gm: await listenerState(gm), owner: await listenerState(owner) };
      assert.equal(state.gm.roomJoined, 1); assert.equal(state.owner.roomJoined, 1);
      assert.equal(state.gm.roomId, baseline.gm.roomId); assert.equal(state.owner.roomId, baseline.owner.roomId);
      cycles.push({ name, face, ownerReads, gmReads, receipts: blockReceipts(host).length, listeners: state });
    }
    evidence.witnesses.repeatedRejoin = { baseline, cycles };

    // ── Integration closure: the adjudication column is bounded at 1440 and at a narrow viewport, and collapses to a chip.
    const layerBox = () => gm.locator('.party-hud-frames > .actor-consequence-layer').boundingBox();
    const layout = {};
    for (const [w, h] of [[1440, 1000], [820, 700]]) {
      await gm.setViewportSize({ width: w, height: h }); await gm.waitForTimeout(300);
      const box = await layerBox();
      assert.ok(box.height <= Math.ceil(h * (w > 1100 ? 0.46 : 0.40)) + 1, `layer height bounded at ${w}px: ${box.height}`);
      assert.ok(box.width <= (w > 1100 ? 420 : 340) + 1, `layer width bounded at ${w}px: ${box.width}`);
      await gm.getByRole('button', { name: 'Hide combat adjudication', exact: true }).click();
      const collapsed = await layerBox();
      assert.ok(collapsed.height <= 60 && collapsed.width < 220, `collapsed to a chip at ${w}px`);
      await gm.screenshot({ path: path.join(out, `layer-collapsed-${w}.png`) });
      await gm.getByRole('button', { name: 'Show combat adjudication', exact: true }).click();
      layout[w] = { expanded: box, collapsed };
    }
    await gm.setViewportSize({ width: 1440, height: 1000 });
    evidence.witnesses.layerLayout = layout;

    // ── Stale delivery: a retired socket (account handoff) or a replaced room context delivers nothing on rejoin.
    // Owner: the socket is retired by the production handoff path (runtime kept, so it is still the room socket);
    // a late rejoin on it delivers nothing (asserted below by zero list reads).
    const retiredRelay = await owner.evaluate(() => { const r = __retireSocket({ socket: __socket, clearRuntime: false, clearPendingJoin: false });
      return { socketRetired: r.socketRetired, listenersDetached: r.listenersDetached, stillRoomSocket: S('gameStore').getState().multiplayerSocket === __socket }; });
    assert.deepEqual(retiredRelay, { socketRetired: true, listenersDetached: true, stillRoomSocket: true }, 'production retirement applied');
    const ownerBefore = await owner.evaluate(() => __outbound.filter(v => v.event === 'actor_block_list').length);
    await rejoinPage(owner, 'app-owner');
    await owner.waitForTimeout(800);
    const retiredReads = await owner.evaluate(n => __outbound.filter(v => v.event === 'actor_block_list').length - n, ownerBefore);
    assert.equal(retiredReads, 0, 'a retired socket relays nothing');
    // GM: room retirement. The client has left the room (its current room is now another id) when a late room_joined for
    // the old room arrives on the same socket: nothing is refreshed for the room it left. (A same-account, same-socket
    // rejoin of the same room id is a legitimate rejoin by design, so it is not used as a stale case.)
    const oldRoomId = await gm.evaluate(() => { const room = S('gameStore').getState().multiplayerRoom; S('gameStore').setState({ multiplayerRoom: { id: 'room-left-' + room.id } }); return room.id; });
    const gmBefore = await gm.evaluate(() => __outbound.filter(v => v.event === 'actor_block_list').length);
    await gm.evaluate(async roomId => {
      __socket.disconnect(); __socket.connect(); await new Promise(r => __socket.once('connect', r));
      const joined = new Promise(r => __socket.once('room_joined', r));
      __socket.emit('join_room', { roomId, playerName: 'app-gm', password: '' }); await joined;
    }, oldRoomId);
    await gm.waitForTimeout(800);
    const leftRoomReads = await gm.evaluate(n => __outbound.filter(v => v.event === 'actor_block_list').length - n, gmBefore);
    assert.equal(leftRoomReads, 0, 'a late room_joined for a room the client left refreshes nothing');
    assert.equal(await gm.evaluate(() => __socket.listeners('room_joined').length), 1, 'still one room_joined listener');
    await gm.evaluate(roomId => S('gameStore').setState({ multiplayerRoom: { id: roomId } }), oldRoomId);
    evidence.witnesses.staleDelivery = { retiredRelay, retiredSocketReads: retiredReads, leftRoomReads, receipts: blockReceipts(host).length };
    evidence.pass = true;
  } catch (e) {
    evidence.failure = e.stack;
    for (const [name, page] of Object.entries(pages)) { save(`failure-${name}.aria.yml`, await page.locator('body').ariaSnapshot().catch(() => 'unavailable')); await page.screenshot({ path: path.join(out, `failure-${name}.png`) }).catch(() => {}); }
    throw e;
  } finally {
    evidence.endedAt = new Date().toISOString();
    evidence.receipts = host.room.gameState.actorConsequences.receipts.map(r => ({ commandId: r.commandId, definition: r.adjudication?.definitionVersionOrHash || null }));
    save('result.json', evidence);
    await browser.close(); await host.stop();
  }
}
main().then(() => { console.log(JSON.stringify({ pass: evidence.pass === true, errors: evidence.errors.length, out })); process.exit(0); }, e => { console.error(e); process.exit(1); });
