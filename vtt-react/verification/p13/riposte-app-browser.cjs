// Optimized real App E1a witness. Provider/room setup and manual prior Parry payment are fixture inputs;
// structured parent registration, fresh choice, owner consent, command custody, P7 installation and feed are production.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), crypto = require('crypto');
const { chromium } = require('playwright');
const out = process.env.E1A_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR || out.startsWith(path.resolve(__dirname, '../..'))) throw Error('External E1A_OUTPUT and APP_BUILD_DIR required.');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture');
const setup = require('../p9/integration/app-browser.cjs').setup;
const actors = require('../../../server/services/actorConsequences');
const save = (name, data) => fs.writeFileSync(path.join(out, name), typeof data === 'string' ? data : JSON.stringify(data, null, 2));
const result = { startedAt: new Date().toISOString(), checks: {}, errors: [], limits: [
  'Real optimized App/components/stores and registered backend; provider ownership/lease/cloud persistence remain fixture boundaries.',
  'Manual generic P7 AP setup/payment and weapon loadout are fixture inputs. Parry success/payment remains explicitly GM-attested, not automatically verified.',
  'No live Firebase/rules, physical-device, human urgency/fairness or deployment claim.'
] };
const once = (socket, event) => new Promise(resolve => socket.once(event, resolve));
const dialog = page => page.getByRole('dialog', { name: 'Universal Riposte execution' });
async function ack(page, event, data) { return page.evaluate(({ event, data }) => new Promise(resolve => __socket.emit(event, data, resolve)), { event, data }); }
async function openPanel(page) {
  if (!await dialog(page).count()) await page.getByRole('button', { name: 'Riposte execution — structured opportunity' }).click();
  await dialog(page).waitFor();
}
async function closePanel(page) { if (await dialog(page).count()) await dialog(page).getByRole('button', { name: 'Close Riposte panel' }).click(); }
async function clearNarration(page) {
  for (let i = 0; i < 8 && await page.locator('.arn-dismiss').count(); i++) { await page.locator('.arn-dismiss').focus(); await page.locator('.arn-dismiss').press('Enter'); }
}
async function init(page) {
  await page.evaluate(() => {
    const moduleWith = text => { const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes(text)); if (!pair) throw Error(text); return __req(pair[0]); };
    const register = Object.values(moduleWith('[roomRejoin] subscriber failed')).find(fn => typeof fn === 'function' && fn.toString().includes('room_joined')); register(__socket);
    window.__rp = Object.values(moduleWith('Original-epoch parent registration retained')).find(v => typeof v?.getState === 'function' && 'opportunities' in v.getState());
    if (!__rp) {
      const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes('actor_riposte_parent') && f.toString().includes('actor_riposte_offer'));
      window.__rp = Object.values(__req(pair[0])).find(v => typeof v?.getState === 'function' && 'opportunities' in v.getState());
    }
    window.__wf = Object.values(moduleWith('Collection acknowledgement unknown/unavailable.')).find(v => typeof v?.getState === 'function' && 'windows' in v.getState());
    window.__feed = Object.values(moduleWith('feather-slash:v1/abilities:1.4.0')).find(v => typeof v?.getState === 'function' && 'floats' in v.getState());
    window.__e1Wire = []; __socket.onAny((event, data) => { if (event.startsWith('actor_riposte_') || event === 'actor_consequence_accepted') __e1Wire.push({ event, data }); });
    S('gameStore').setState({ cameraX: 1100, cameraY: 300, gridType: 'square', gridSize: 50, feetPerTile: 5 });
  });
}
async function main() {
  const host = await require('../p9/integration/app-server.cjs').start();
  const hall = host.room.gameState.maps['app-hall'];
  hall.characterTokens.pc.position = { x: 625, y: 325 }; hall.tokens.A.position = { x: 675, y: 325 };
  const mirrors = require('../../../server/services/roomCheckpoint').deriveRootMirrors(host.room.gameState.maps);
  host.room.gameState.tokens = mirrors.tokens; host.room.gameState.characterTokens = mirrors.characterTokens;
  for (const e of ['actor_riposte_parent', 'actor_riposte_offer', 'actor_riposte_list', 'actor_strike_list', 'reaction_window_list']) host.backend.setEventLimits(e, { maxPerMinute: 3000, maxPerSecond: 100 });
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, headless: true } : { channel: 'chrome', headless: true });
  const pages = {};
  try {
    for (const [role, uid] of [['gm', 'app-gm'], ['observer', 'app-observer'], ['owner', 'app-owner']]) {
      pages[role] = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
      pages[role].on('pageerror', e => result.errors.push({ role, message: e.message }));
      await setup(pages[role], host.url, uid); await init(pages[role]);
    }
    const { gm, owner, observer } = pages, ref = host.refs.pc;
    await owner.evaluate(() => S('characterStore').setState({ stats: { ...S('characterStore').getState().stats, strength: 14 },
      equipment: { ...S('characterStore').getState().equipment, mainHand: { id: 'e1-sword', name: 'Witness Sword', subtype: 'SWORD', weaponStats: { baseDamage: { diceCount: 1, diceType: 'd8', damageType: 'slicing' } } } } }));
    async function manualAP(current, temp) {
      const pc = actors.locate(host.room, ref), command = { version: 1, roomId: host.room.id, commandId: crypto.randomUUID(), actionEpoch: actors.epoch(host.room), baseCommitSequence: actors.ledger(host.room).commitSequence,
        source: ref, actors: [{ ref, expectedRevision: pc.contract.revision, finalResources: { ap: { current, temp } } }] };
      const r = await ack(gm, 'actor_consequence', command); assert.equal(r.success, true, JSON.stringify(r)); return r.receipt.commandId;
    }
    const pc = () => host.room.gameState.maps['app-hall'].characterTokens.pc.character;
    const foe = () => host.room.gameState.maps['app-hall'].tokens.A.state;
    await manualAP(pc().actionPoints.current, pc().tempActionPoints + 2); // Fixture replenishment, before prior-payment/child assertions.
    const pay1 = await manualAP(pc().actionPoints.current, pc().tempActionPoints - 1);
    const before1 = { current: pc().actionPoints.current, temp: pc().tempActionPoints, hp: foe().currentHp, tempHP: foe().tempHealth, sequence: actors.ledger(host.room).commitSequence };
    for (const page of Object.values(pages)) await clearNarration(page);
    await openPanel(gm);
    const g = dialog(gm);
    async function attest({ attack, parry, receipt, closedWindow = null, freshForm = false }) {
      if (freshForm) await g.getByRole('button', { name: 'Prepare another parent attestation' }).click();
      await g.getByLabel('Triggering attack occurrence').fill(attack);
      if (closedWindow) await g.getByLabel('Closed fresh Riposte follow-up').selectOption(closedWindow);
      else await g.getByLabel('Parry occurrence', { exact: true }).fill(parry);
      await g.getByLabel('Exact parrying PC').selectOption({ label: 'Ilse' });
      await g.getByLabel('Particular attacking creature').selectOption({ label: 'A' });
      await g.getByRole('checkbox', { name: 'I attest this PC successfully parried this particular attack.' }).check();
      await g.getByRole('checkbox', { name: /I attest Parry was already fully paid/ }).check();
      await g.getByRole('checkbox', { name: /I attest timing\/5ft\/enemy eligibility/ }).check();
      await g.getByLabel('Private payment/Parry attestation note').fill(`GM_PARENT_PRIVATE_${attack}`);
      await g.getByLabel('Optional existing payment receipt ID').fill(receipt);
      await g.getByRole('button', { name: 'Attest Parry and offer Riposte', exact: true }).click();
    }
    await attest({ attack: 'attack-B', parry: 'parry-B', receipt: pay1 });
    await owner.getByRole('region', { name: 'Private declaration collection' }).waitFor();
    const wOwner = owner.getByRole('region', { name: 'Private declaration collection' });
    await wOwner.getByLabel('Card ID or GM-agreed reference').fill('universal_riposte');
    await wOwner.getByRole('button', { name: 'Declare privately' }).click();
    await owner.waitForFunction(() => __rp.getState().opportunities.some(p => p.status === 'ready'), null, { timeout: 15000 });
    const p1 = await owner.evaluate(() => __rp.getState().opportunities.find(p => p.status === 'ready'));
    assert.equal(p1.parry, undefined); assert.equal(p1.parentKeys, undefined);
    assert.equal(actors.ledger(host.room).commitSequence, before1.sequence, 'attestation/choice spends nothing');
    assert.equal(await observer.getByRole('button', { name: /Riposte execution/ }).count(), 0);
    await openPanel(owner); const o = dialog(owner);
    await o.getByLabel('Physical weapon faces').fill('3'); await o.getByRole('button', { name: 'Record physical Riposte faces' }).click();
    await o.getByRole('button', { name: 'Approve exact target and1 AP Riposte' }).click();
    await gm.waitForFunction(id => __rp.getState().pending.some(e => e.approval.opportunityId === id), p1.id);
    const gmCard1 = g.getByRole('article', { name: `Riposte opportunity ${p1.id.slice(0, 8)}` });
    await gmCard1.getByLabel('Riposte hit or miss').selectOption('hit'); await gmCard1.getByLabel('GM final Riposte damage').fill('7');
    await gmCard1.getByRole('checkbox', { name: /I adjudicate current eligibility/ }).check();
    await gm.evaluate(() => {
      window.__dropRP = true;
      const handlers = __socket.listeners('actor_consequence_accepted'); __socket.removeAllListeners('actor_consequence_accepted');
      __socket.on('actor_consequence_accepted', r => { if (__dropRP && r.receipt?.adjudication?.definitionId === 'universal_riposte') return; for (const fn of handlers) fn(r); });
      const emit = __socket.emit.bind(__socket); __socket.emit = (event, ...args) => {
        if (__dropRP && event === 'actor_consequence' && args[0]?.adjudication?.definitionId === 'universal_riposte' && typeof args[1] === 'function') args[1] = () => {};
        return emit(event, ...args);
      };
    });
    await gmCard1.getByRole('button', { name: 'Execute approved Riposte —1 AP and HP once' }).click();
    await o.getByRole('article', { name: `Riposte opportunity ${p1.id.slice(0, 8)}` }).getByText(/Accepted Riposte: AP −1/).waitFor();
    await owner.locator('.fct-group').filter({ hasText: '−3 HP' }).waitFor();
    assert.equal(pc().actionPoints.current, before1.current); assert.equal(pc().tempActionPoints, before1.temp - 1);
    assert.equal(foe().currentHp, 27); assert.equal(foe().tempHealth, 0);
    const accepted1 = actors.ledger(host.room).receipts.at(-1), commandId1 = accepted1.commandId;
    assert.equal(accepted1.adjudication.definitionId, 'universal_riposte');
    save('accepted-hit-owner.aria.yml', await o.ariaSnapshot()); await owner.screenshot({ path: path.join(out, 'accepted-hit-owner.png') });
    result.checks.hit = { commandId: commandId1, before: before1, after: { current: pc().actionPoints.current, temp: pc().tempActionPoints, hp: foe().currentHp, tempHP: foe().tempHealth },
      float: await owner.locator('.fct-layer').allTextContents(), narration: await owner.evaluate(id => __feed.getState().narration.history.filter(e => e.id.endsWith(id)), commandId1) };
    assert.equal(result.checks.hit.narration.length, 1); assert.match(result.checks.hit.narration[0].text, /Riposte/);
    await gm.waitForFunction(id => __rp.getState().saved?.gm?.[id]?.phase === 'unknown', p1.id);
    const retainedBefore = await gm.evaluate(id => JSON.stringify(__rp.getState().saved.gm[id].command), p1.id);
    await gm.evaluate(() => { __dropRP = false; __socket.disconnect(); });
    await gm.evaluate(async() => {
      const connected = new Promise(resolve => __socket.once('connect', resolve)); __socket.connect(); await connected;
      const joined = new Promise(resolve => __socket.once('room_joined', resolve));
      __socket.emit('join_room', { roomId: S('gameStore').getState().multiplayerRoom.id, playerName: 'app-gm', password: '', isReconnect: true }); await joined;
    });
    await gm.waitForFunction(id => __rp.getState().opportunities.some(p => p.id === id && p.status === 'consumed'), p1.id);
    assert.equal(await gm.evaluate(id => JSON.stringify(__rp.getState().saved.gm[id].command), p1.id), retainedBefore);
    await openPanel(gm); await g.getByRole('button', { name: 'Check same Riposte command', exact: true }).click();
    await gm.waitForFunction(id => __rp.getState().saved.gm[id].phase === 'accepted', p1.id);
    assert.equal(actors.ledger(host.room).commitSequence, before1.sequence + 1, 'lost ACK/rejoin/retry installs no second payment');
    assert.equal(await gm.evaluate(() => __socket.listeners('room_joined').length), 1);
    result.checks.recovery = { exactBytesRetained: true, sameCommandId: commandId1, commitSequence: actors.ledger(host.room).commitSequence };

    // A: GM paid/succeeded manually, opens ordinary fresh collector first, then adopts its closed intent.
    await closePanel(gm); await closePanel(owner);
    const pay2 = await manualAP(pc().actionPoints.current, pc().tempActionPoints - 1);
    const prep = gm.getByRole('region', { name: 'GM declaration preparation' });
    await prep.locator('summary', { hasText: 'Prepare private declaration window' }).click();
    await prep.getByLabel('Causal action reference').fill('parry-A'); await prep.getByLabel('Occurrence').fill('1');
    await prep.getByLabel('Moment').selectOption('follow_up'); await prep.getByLabel('Trigger source').selectOption({ label: 'Ilse' });
    await prep.getByRole('checkbox', { name: 'Ilse', exact: true }).check();
    await prep.getByRole('button', { name: 'Seal GM choices and open 8 seconds' }).click();
    await wOwner.getByLabel('Card ID or GM-agreed reference').fill('universal_riposte'); await wOwner.getByRole('button', { name: 'Declare privately' }).click();
    await owner.waitForFunction(() => __wf.getState().windows.some(w => w.status === 'closed' && !__rp.getState().opportunities.some(p => p.windowId === w.windowId)), null, { timeout: 15000 });
    const windowA = await owner.evaluate(() => __wf.getState().windows.find(w => !__rp.getState().opportunities.some(p => p.windowId === w.windowId)).windowId);
    const windowCountBefore = (await ack(gm, 'reaction_window_list', { roomId: host.room.id })).windows.length;
    await openPanel(gm); await attest({ attack: 'attack-A', parry: 'parry-A', receipt: pay2, closedWindow: windowA, freshForm: true });
    await owner.waitForFunction(w => __rp.getState().opportunities.some(p => p.windowId === w && p.status === 'ready'), windowA);
    const p2 = await owner.evaluate(w => __rp.getState().opportunities.find(p => p.windowId === w), windowA);
    assert.notEqual(p2.id, p1.id); assert.equal((await ack(gm, 'reaction_window_list', { roomId: host.room.id })).windows.length, windowCountBefore);
    await openPanel(owner); await o.getByRole('button', { name: 'Roll digital Riposte once' }).click();
    const faces2 = await owner.evaluate(id => JSON.stringify(__rp.getState().saved.owner[id].roll), p2.id);
    await o.getByRole('button', { name: 'Approve exact target and1 AP Riposte' }).click();
    await gm.waitForFunction(id => __rp.getState().pending.some(e => e.approval.opportunityId === id), p2.id);
    // Competing spend invalidates affordability; no reservation was promised. Restore then explicitly revalidate.
    await manualAP(0, 0);
    const gmCard2 = g.getByRole('article', { name: `Riposte opportunity ${p2.id.slice(0, 8)}` });
    await gmCard2.getByLabel('Riposte hit or miss').selectOption('miss'); await gmCard2.getByLabel('GM final Riposte damage').fill('0');
    await gmCard2.getByRole('checkbox', { name: /I adjudicate current eligibility/ }).check();
    const receiptCountBeforeRefusal = actors.ledger(host.room).receipts.length;
    await gmCard2.getByRole('button', { name: 'Execute approved Riposte —1 AP and HP once' }).click();
    await g.getByRole('alert').waitFor(); assert.equal(actors.ledger(host.room).receipts.length, receiptCountBeforeRefusal);
    await manualAP(2, 0); await gmCard2.getByRole('button', { name: 'Revalidate for retained roll / new consent' }).click();
    await owner.waitForFunction(id => __rp.getState().saved.owner[id].phase === 'revalidated', p2.id);
    assert.equal(await owner.evaluate(id => JSON.stringify(__rp.getState().saved.owner[id].roll), p2.id), faces2);
    await o.getByRole('button', { name: 'Approve exact target and1 AP Riposte' }).click();
    await gm.waitForFunction(id => __rp.getState().pending.some(e => e.approval.opportunityId === id), p2.id);
    await gmCard2.getByRole('button', { name: 'Execute approved Riposte —1 AP and HP once' }).click();
    await owner.waitForFunction(id => __rp.getState().saved.owner[id].phase === 'accepted', p2.id);
    assert.equal(pc().actionPoints.current, 1); assert.equal(pc().tempActionPoints, 0); assert.equal(foe().currentHp, 27); assert.equal(foe().tempHealth, 0);
    result.checks.closedEntryPaidMiss = { opportunityId: p2.id, windowId: windowA, noNewWindow: true, exactDigitalFacesAfterReapproval: faces2, ap: pc().actionPoints, hp: foe().currentHp };
    await owner.setViewportSize({ width: 820, height: 700 });
    const bounds = await o.evaluate(el => ({ rect: el.getBoundingClientRect().toJSON(), width: el.scrollWidth, client: el.clientWidth }));
    assert.ok(bounds.rect.left >= 0 && bounds.rect.right <= 820); assert.equal(bounds.width, bounds.client);
    save('paid-miss-owner.aria.yml', await o.ariaSnapshot()); await owner.screenshot({ path: path.join(out, 'paid-miss-narrow-owner.png') });
    for (const role of ['owner', 'observer']) {
      const wire = await pages[role].evaluate(() => JSON.stringify(__e1Wire));
      assert.equal(/GM_PARENT_PRIVATE_|parentKeys|offerHash|e1a-parry:|e1a-attack:|e1a-parent:/.test(wire), false, `${role} wire hides parent evidence`);
    }
    assert.equal(await observer.getByRole('button', { name: /Riposte execution/ }).count(), 0);
    result.passed = true;
  } catch (e) {
    result.failure = e.stack;
    for (const [role, page] of Object.entries(pages)) { save(`${role}-failure.aria.yml`, await page.locator('body').ariaSnapshot().catch(() => 'unavailable')); await page.screenshot({ path: path.join(out, `${role}-failure.png`) }).catch(() => {}); }
    throw e;
  } finally {
    result.endedAt = new Date().toISOString(); result.assetManifestSha256 = crypto.createHash('sha256').update(fs.readFileSync(path.join(process.env.APP_BUILD_DIR, 'asset-manifest.json'))).digest('hex');
    save('result.json', result); await browser.close(); await host.stop();
  }
}
main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
