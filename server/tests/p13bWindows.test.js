const assert = require('assert/strict');
const crypto = require('crypto');
const { createCollector } = require('../services/reactionWindows');

describe('P13B-W private declaration collector (deterministic server clock)', () => {
  let time, collector, room, source, reactor, gm, owner, observer;
  const uuid = () => crypto.randomUUID();
  beforeEach(() => {
    time = 1000; collector = createCollector({ now: () => time, elapsed: () => time });
    source = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'hidden-source', instanceId: 's1' };
    reactor = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'p1', ownerUid: 'owner', characterId: 'c' };
    room = { id: 'r', gmId: 'gm', authorityToken: { authorityInstanceId: 'a', authorityGeneration: 1 }, gameState: { maps: { m: {
      tokens: { 'hidden-source': { state: { actorContract: { version: 1, ...source }, hiddenFromPlayers: true } } },
      characterTokens: { pc: { ownerUserId: 'owner', character: { id: 'c' }, state: { actorContract: { version: 1, primary: true, ...reactor } } } }
    } } } };
    gm = { uid: 'gm', gm: true }; owner = { uid: 'owner', gm: false }; observer = { uid: 'observer', gm: false };
  });
  const config = () => ({ roomId: 'r', requestId: uuid(), epoch: collector.snapshot(room, gm).epoch,
    trigger: { causeId: 'cast-original', moment: 'after_roll', occurrence: '1', basis: 'gm-manual' }, source, invited: [reactor],
    gmCommit: { refs: [source], note: 'GM_SECRET counterspell plan' } });
  const open = () => collector.open(room, gm, config()).window;
  const change = (w, extra = {}) => ({ roomId: 'r', requestId: uuid(), epoch: collector.snapshot(room, owner).epoch,
    windowId: w.id, reactor, cardKey: 'manual:parry', expectedRevision: 0, withdrawn: false, label: 'PLAYER_SECRET', note: 'private face plan', ...extra });
  it('precommit precedes collection; no choices/counts/hidden actor data leak to other viewers', () => {
    const w = open(), before = collector.snapshot(room, gm).windows[0];
    collector.change(room, owner, change(w));
    const gmOpen = collector.snapshot(room, gm).windows[0], own = collector.snapshot(room, owner).windows[0];
    assert.equal(gmOpen.review, undefined); assert.equal(gmOpen.viewRevision, before.viewRevision);
    assert.equal(JSON.stringify(gmOpen).includes('PLAYER_SECRET'), false);
    assert.equal(/GM_SECRET|hidden-source|cast-original|gmCommit|invited/.test(JSON.stringify(own)), false);
    assert.equal(own.intents.length, 1); assert.deepEqual(collector.snapshot(room, observer).windows, []);
    assert.equal(w.deadlineAt - w.openedAt, 8000);
  });
  it('strict cutoff, late timer and unchanged exact retry have deterministic results', () => {
    const w = open(), payload = change(w); time = 8999;
    collector.change(room, owner, payload); time = 9000;
    assert.throws(() => collector.change(room, owner, change(w, { expectedRevision: 1 })), /window_closed_manual/);
    const retry = collector.change(room, owner, payload).windows[0];
    assert.equal(retry.status, 'closed'); assert.equal(retry.intents[0].history.length, 1);
    assert.throws(() => collector.change(room, owner, { ...payload, note: 'changed bytes' }), /window_request_conflict/);
    assert.equal(collector.snapshot(room, gm).windows[0].review.length, 1);
  });
  it('correction, withdrawal and re-declaration retain revisions without a second current intent', () => {
    const w = open(), first = change(w); collector.change(room, owner, first);
    assert.throws(() => collector.change(room, owner, change(w)), /intent_revision_conflict/);
    collector.change(room, owner, change(w, { expectedRevision: 1, note: 'corrected' }));
    collector.change(room, owner, change(w, { expectedRevision: 2, withdrawn: true }));
    const intent = collector.snapshot(room, owner).windows[0].intents[0];
    assert.equal(intent.revision, 3); assert.equal(intent.withdrawn, true); assert.equal(intent.history.length, 3);
    assert.equal(collector.snapshot(room, owner).windows[0].intents.length, 1);
  });
  it('duplicate opens, changed GM bytes, trigger alias and old-epoch retry cannot create a new timer', () => {
    const payload = config(), opened = collector.open(room, gm, payload);
    const duplicate = collector.open(room, gm, payload);
    assert.equal(duplicate.window.id, opened.window.id); assert.equal(duplicate.fresh, false);
    assert.throws(() => collector.open(room, gm, { ...payload, gmCommit: { refs: [], note: '' } }), /window_request_conflict/);
    assert.throws(() => collector.open(room, gm, { ...payload, requestId: uuid(), trigger: { ...payload.trigger, basis: 'authored-attested' } }), /trigger_occurrence_exists/);
    room.authorityToken.authorityGeneration += 1;
    assert.throws(() => collector.open(room, gm, payload), /window_unavailable/);
    assert.deepEqual(collector.snapshot(room, owner).windows, []);
  });
  it('interruption and binding loss never reopen/reveal incomplete choices or mutate room state', () => {
    const before = JSON.stringify(room.gameState), w = open(); collector.change(room, owner, change(w));
    const deadline = w.deadlineAt;
    collector.interrupt(room, gm, { roomId: 'r', requestId: uuid(), epoch: collector.snapshot(room, gm).epoch, windowId: w.id });
    assert.equal(w.deadlineAt, deadline); assert.equal(collector.snapshot(room, gm).windows[0].review, undefined);
    assert.throws(() => collector.change(room, owner, change(w, { expectedRevision: 1 })), /window_interrupted_manual/);
    assert.equal(JSON.stringify(room.gameState), before);
  });
  it('same-player follow-ups use distinct linked windows, not an automatic success/chain rule', () => {
    const parent = open(); time += 8000;
    const next = config(); next.trigger.causeId = 'gm-attested-parry-success'; next.trigger.moment = 'follow_up'; next.parentWindowId = parent.id;
    const child = collector.open(room, gm, next).window;
    assert.notEqual(child.id, parent.id); assert.equal(child.parentWindowId, parent.id);
    assert.equal(child.deadlineAt, time + 8000); assert.deepEqual(child.invited, [reactor]);
  });
  it('forged owner/ref and hostile schema are rejected before storing any revision', () => {
    const w = open();
    assert.throws(() => collector.change(room, observer, change(w)), /window_unavailable/);
    assert.throws(() => collector.change(room, owner, change(w, { resourceCost: { ap: 1 } })), /invalid_window_request/);
    assert.throws(() => collector.change(room, owner, change(w, { reactor: source })), /forbidden/);
    assert.equal(collector.snapshot(room, owner).windows[0].intents.length, 0);
  });
});
