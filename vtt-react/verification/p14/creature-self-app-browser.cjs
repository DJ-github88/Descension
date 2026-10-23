// A6 normal optimized App + GM/observer, real Wizard/placement/launcher and registered backend.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), crypto = require('crypto');
const { chromium } = require('playwright');
const out = process.env.A6_OUTPUT;
if (!out || !path.isAbsolute(out) || !process.env.APP_BUILD_DIR) throw Error('External A6_OUTPUT and APP_BUILD_DIR required');
fs.mkdirSync(out, { recursive: true }); process.env.APP_OUTPUT = path.join(out, 'fixture'); process.env.A4_OUTPUT = path.join(out, 'producer');
const { setup } = require('../p9/integration/app-browser.cjs');
const producer = require('./creature-execution-app-browser.cjs');
const actors = require('../../../server/services/actorConsequences'), profile = require('../../src/services/sharedConditionProfile');
const snapshot = require('./record-creature-self-evidence.cjs').snapshot;
const save = (n, v) => fs.writeFileSync(path.join(out, n), typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const report = { checks: {}, errors: [], limits: ['Normal optimized production App, real browser Socket.IO and registered handlers. Authentication/provider/ownership/lease/cloud fixtures. Disposable initial placed HP/bounds fixture. Temporary-room live-only. No cloud restart, deployment, physical tablet or second-device proof.'] };
const dialogOf = p => p.getByRole('dialog', { name: 'Creature ability action', exact: true });
const narration = (page, commandId) => page.evaluate(id => {
  const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes('temp-loss') && f.toString().includes('reportable'));
  if (!pair) throw Error('Accepted feed module unavailable');
  const store = Object.values(__req(pair[0])).find(v => typeof v === 'function' && v.getState && 'floats' in v.getState());
  if (!store) throw Error('Accepted feed store unavailable');
  const n = store.getState().narration;
  return { history: n.history.filter(e => e.id.endsWith(id)).length, active: [n.current, ...n.waiting].filter(e => e?.id.endsWith(id)).length };
}, commandId);
const useSelf = async(d, id) => { await d.getByRole('combobox', { name: 'Creature or primary PC target', exact: true }).selectOption(`creature:app-hall:${id}`); assert.match(await d.getByRole('combobox').textContent(), /Self —/); };
async function condition(gm, host, ref, record, op) {
  const t = actors.locate(host.room, ref).token;
  const c = { version: 1, roomId: host.room.id, commandId: crypto.randomUUID(), actionEpoch: actors.epoch(host.room), baseCommitSequence: actors.ledger(host.room).commitSequence,
    actors: [{ ref, expectedRevision: t.state.actorContract.revision, conditions: [{ op, recordId: record.recordId, ...(op === 'add' ? { record } : {}) }] }],
    adjudication: { definitionId: profile.STUNNED.definitionId, definitionVersionOrHash: profile.STUNNED.origin, chosenResult: 'A6 disposable condition witness', finalAmount: 0, adjustmentReason: '' } };
  const r = await gm.evaluate(c => new Promise(resolve => __socket.emit('actor_consequence', c, resolve)), c); assert.equal(r.success, true, JSON.stringify(r));
}
async function main() {
  report.sourceBefore = snapshot(); const host = await require('../p9/integration/app-server.cjs').start();
  for (const e of ['actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_list', 'actor_bind', 'actor_spell_prepare_creature', 'actor_spell_list', 'actor_spell_withdraw', 'token_created', 'join_room']) host.backend.setEventLimits(e, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const browser = await chromium.launch({ channel: 'chrome', headless: true }), pages = [];
  try {
    const gm = await browser.newPage({ viewport: { width: 1440, height: 1000 } }), observer = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); pages.push(gm, observer);
    pages.forEach((p, i) => p.on('pageerror', e => report.errors.push({ role: i ? 'observer' : 'gm', error: e.message })));
    await setup(gm, host.url, 'app-gm'); await producer.openBestiary(gm);
    const paid = await producer.author(gm, { creature: 'A6 Disposable Mender', name: 'A6 Own Mend', kind: 'healing', formula: '1d8+1', ap: 1, mana: 3, range: 0, restriction: 'self' });
    const free = await producer.author(gm, { creature: 'A6 Disposable Free Mender', name: 'A6 Free Mend', kind: 'healing', formula: '1d8+1', ap: 0, mana: 0, range: 0, restriction: 'any' });
    await producer.closeLibrary(gm);
    await gm.evaluate(({ paid, free }) => { const s = S('creatureStore').getState(); s.addCreatureToken(paid, { x: -150, y: -100 }, true, 'a6-self', false, 'app-hall'); s.addCreatureToken(paid, { x: -50, y: -100 }, true, 'a6-sibling', false, 'app-hall'); s.addCreatureToken(free, { x: 50, y: -100 }, true, 'a6-free', false, 'app-hall'); }, { paid, free });
    await gm.waitForFunction(() => __outbound.filter(e => e.event === 'token_created').length >= 3); await new Promise(r => setTimeout(r, 300));
    for (const id of ['a6-self', 'a6-free']) { const t = host.room.gameState.maps['app-hall'].tokens[id]; assert.ok(t.authoredAbility); t.state.currentHp = 8; t.state.maxHp = 10; t.stats.maxHp = 10; }
    await setup(gm, host.url, 'app-gm'); await setup(observer, host.url, 'app-observer');
    let d = await producer.admitAndOpen(gm, 'a6-self'); await useSelf(d, 'a6-self');
    await d.getByLabel('d8 face 1', { exact: true }).fill('4'); await d.getByRole('button', { name: 'Record physical roll', exact: true }).click();
    const sibling = actors.clone(host.room.gameState.maps['app-hall'].tokens['a6-sibling']), before = actors.clone(host.room.gameState.maps['app-hall'].tokens['a6-self'].state);
    await d.getByRole('button', { name: 'Close creature action', exact: true }).click(); await gm.getByRole('button', { name: 'Open retained creature action', exact: true }).click();
    await d.getByText(/Retained physical faces \[4\]/).waitFor(); await d.getByRole('button', { name: 'Validate source, target and retained roll', exact: true }).click();
    await d.getByRole('button', { name: 'Confirm one creature consequence', exact: true }).waitFor(); assert.deepEqual(host.room.gameState.maps['app-hall'].tokens['a6-self'].state, before);
    await d.getByRole('checkbox').check(); await d.getByLabel('Final healing', { exact: true }).fill('5'); await d.getByText(/Actual HP to restore after cap: 2/).waitFor();
    save('paid-before.aria.yml', await d.ariaSnapshot()); report.checks.authorSavePlaceAdmitExplicitSelfPhysicalNoPreSpend = true;
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }]) { await gm.setViewportSize(viewport); const b = await d.locator('.p9-panel').evaluate(el => ({ width: el.clientWidth, scroll: el.scrollWidth, rect: el.getBoundingClientRect().toJSON() })); assert.ok(b.scroll <= b.width + 1); save(`layout-${viewport.width}.json`, b); await gm.screenshot({ path: path.join(out, `paid-${viewport.width}.png`) }); }
    await gm.setViewportSize({ width: 1440, height: 1000 });
    await gm.evaluate(() => { const listeners = __socket.listeners('actor_consequence_accepted'); __socket.removeAllListeners('actor_consequence_accepted'); __socket.on('actor_consequence_accepted', r => { if (r.receipt?.authorization?.kind === 'gm-creature-ability') return; listeners.forEach(fn => fn(r)); }); const emit = __socket.emit.bind(__socket); __socket.emit = (e, ...args) => { if (e === 'actor_consequence' && args[0]?.source?.tokenId === 'a6-self' && typeof args[1] === 'function') args[1] = () => {}; return emit(e, ...args); }; });
    await d.getByRole('button', { name: 'Confirm one creature consequence', exact: true }).click();
    await observer.locator('.fct-chip').filter({ hasText: '+2 HP' }).waitFor({ timeout: 5000 }); assert.deepEqual(await observer.locator('.fct-chip').allTextContents(), ['+2 HP']);
    const receipt = actors.ledger(host.room).receipts.at(-1), t = host.room.gameState.maps['app-hall'].tokens['a6-self']; assert.equal(receipt.actors.length, 1); assert.equal(t.state.currentHp, 10); assert.equal(t.state.currentActionPoints, before.currentActionPoints - 1); assert.equal(t.state.currentMana, before.currentMana - 3); assert.equal(t.state.actorContract.revision, before.actorContract.revision + 1); assert.deepEqual(host.room.gameState.maps['app-hall'].tokens['a6-sibling'], sibling);
    report.checks.paidCapCombinedOneRevisionSiblingOneFloat = receipt;
    assert.deepEqual(await narration(observer, receipt.commandId), { history: 1, active: 1 });
    await d.getByRole('button', { name: 'Check same command', exact: true }).waitFor({ timeout: 15000 }); const original = await gm.evaluate(() => __outbound.filter(x => x.event === 'actor_consequence').at(-1).payload), count = actors.ledger(host.room).receipts.length;
    await setup(gm, host.url, 'app-gm'); await gm.getByRole('button', { name: 'Open retained creature action', exact: true }).click(); d = dialogOf(gm);
    await d.getByRole('button', { name: 'Check same command', exact: true }).click(); await d.getByText(/^Accepted ·/).waitFor(); await d.getByText('GM-approved healing: 5. Actual HP restored: 2.', { exact: true }).waitFor();
    assert.deepEqual(await gm.evaluate(() => __outbound.filter(x => x.event === 'actor_consequence').at(-1).payload), original); assert.equal(actors.ledger(host.room).receipts.length, count); assert.equal(await gm.locator('.fct-chip').count(), 0); assert.equal(await gm.evaluate(id => S('chatStore').getState().notifications.combat.filter(n => n.receiptId?.endsWith(id)).length, receipt.commandId), 0);
    assert.equal(await observer.evaluate(id => S('chatStore').getState().notifications.combat.filter(n => n.receiptId?.endsWith(id)).length, receipt.commandId), 1);
    assert.deepEqual(await narration(gm, receipt.commandId), { history: 1, active: 0 }); const observerNarration = await narration(observer, receipt.commandId); assert.equal(observerNarration.history, 1); assert.ok(observerNarration.active <= 1);
    report.checks.oneNarrationHistoryAndSilentRecovery = { observer: await narration(observer, receipt.commandId), recoveredGm: await narration(gm, receipt.commandId) };
    save('paid-recovered.aria.yml', await d.ariaSnapshot()); report.checks.lostAckDeliveryReloadOriginalReceiptNoReplay = original;
    await d.getByRole('button', { name: 'Finish or explicitly cancel (keep evidence)', exact: true }).click(); await producer.closeInspect(gm).catch(() => {});
    d = await producer.admitAndOpen(gm, 'a6-free'); await useSelf(d, 'a6-free'); await d.getByRole('button', { name: 'Roll 1d8+1 once', exact: true }).click(); await d.getByRole('button', { name: 'Validate source, target and retained roll', exact: true }).click(); await d.getByRole('button', { name: 'Confirm one creature consequence', exact: true }).waitFor();
    const freeRef = actors.refFor(host.room.gameState.maps['app-hall'].tokens['a6-free'].state.actorContract), freeBefore = actors.clone(actors.locate(host.room, freeRef).token.state), a = require('../../../server/services/spellPayments').listAll(host.room).find(e => e.approval.source.tokenId === 'a6-free').approval;
    const stunned = profile.makeStunnedRecord(freeRef, crypto.randomUUID(), { sourceOccurrence: 'a6-app', timing: 'manual' }); await condition(gm, host, freeRef, stunned, 'add');
    const stateBeforeRefusal = actors.clone(host.room.gameState); await d.getByRole('checkbox').check(); await d.getByLabel('Final healing', { exact: true }).fill('5'); if (a.roll.total !== 5) await d.getByLabel(/^Reason/).fill('GM confirms five healing');
    await d.getByRole('button', { name: 'Confirm one creature consequence', exact: true }).click(); await d.getByText(/Stunned: no actions/).waitFor(); assert.deepEqual(host.room.gameState, stateBeforeRefusal);
    await condition(gm, host, freeRef, stunned, 'remove'); await d.getByRole('button', { name: 'Revalidate original attempt (same roll)', exact: true }).click();
    await d.getByRole('button', { name: 'Confirm one creature consequence', exact: true }).click(); await d.getByText(/^Accepted ·/).waitFor();
    const healed = actors.ledger(host.room).receipts.at(-1); assert.deepEqual(JSON.parse(healed.adjudication.chosenResult).roll, a.roll); assert.equal(healed.actors.length, 1); assert.equal(actors.locate(host.room, freeRef).token.state.currentActionPoints, freeBefore.currentActionPoints); assert.equal(actors.locate(host.room, freeRef).token.state.currentMana, freeBefore.currentMana); assert.equal(actors.locate(host.room, freeRef).token.state.currentHp, 10);
    report.checks.zeroDigitalStunnedRefusalRemovalRetainedRevalidation = healed;
    const rejoin = await gm.evaluate(async() => { const pair = Object.entries(__req.m).find(([, f]) => f.toString().includes('[roomRejoin] subscriber failed')); Object.values(__req(pair[0])).find(f => typeof f === 'function' && f.toString().includes('room_joined'))(__socket);
      const n = __outbound.filter(x => x.event === 'actor_consequence').length, id = S('gameStore').getState().multiplayerRoom.id;
      __socket.disconnect(); __socket.connect(); await new Promise(r => __socket.once('connect', r)); const joined = new Promise(r => __socket.once('room_joined', r)); __socket.emit('join_room', { roomId: id, playerName: 'app-gm', password: '', isReconnect: true }); await joined; await new Promise(r => setTimeout(r, 300));
      return { before: n, after: __outbound.filter(x => x.event === 'actor_consequence').length, listeners: __socket.listeners('room_joined').length }; });
    assert.equal(rejoin.before, rejoin.after); assert.equal(rejoin.listeners, 1); report.checks.rejoinStatusNoAutoSubmission = rejoin;
    await new Promise(r => setTimeout(r, 2100)); assert.equal(await gm.locator('.fct-chip').count(), 0);
    assert.equal(await observer.evaluate(id => S('chatStore').getState().notifications.combat.filter(n => n.receiptId?.endsWith(id)).length, healed.commandId), 1);
    assert.equal(await observer.evaluate(() => S('creatureStore').getState().creatureTokens.some(t => t.authoredAbility)), false); report.checks.privateDraftsAndOnceOnlyFeedback = true;
    save('free-accepted.aria.yml', await d.ariaSnapshot()); report.passed = true;
  } catch (e) { report.failure = e.stack; for (let i = 0; i < pages.length; i++) { save(`failure-${i}.aria.yml`, await pages[i].locator('body').ariaSnapshot().catch(() => 'unavailable')); await pages[i].screenshot({ path: path.join(out, `failure-${i}.png`) }).catch(() => {}); } throw e; }
  finally { report.sourceAfter = snapshot(); save('result.json', report); await browser.close(); await host.stop(); }
}
main().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
