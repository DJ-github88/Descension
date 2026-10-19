const assert = require('assert/strict');
const crypto = require('crypto');
const actors = require('../services/actorConsequences');
const { createCollector } = require('../services/reactionWindows');
const rp = require('../services/riposteExecution');
const uuid = () => crypto.randomUUID();

describe('E1a named Riposte gate (deterministic collection clock)', () => {
  let room, source, target, windows, gate, time;
  beforeEach(() => {
    time = 1000; windows = createCollector({ now: () => time, elapsed: () => time }); gate = rp.createGate({ windows });
    source = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'p1', ownerUid: 'owner', characterId: 'c' };
    target = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'foe', instanceId: 'f1' };
    room = { id: 'r', gmId: 'gm', authorityToken: { authorityInstanceId: 'a', authorityGeneration: 1 },
      players: new Map([['owner', { id: 'owner', userId: 'owner', roomId: 'r' }]]), gameState: { maps: { m: {
        characterTokens: { pc: { ownerUserId: 'owner', position: { x: 25, y: 25 }, character: { id: 'c', name: 'PC', health: { current: 30, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 2, max: 4 }, tempActionPoints: 1 },
          state: { conditions: [], actorContract: { version: 1, revision: 0, primary: true, ...source } } } },
        tokens: { foe: { position: { x: 75, y: 25 }, state: { currentHp: 20, maxHp: 30, tempHealth: 3, currentMana: 0, maxMana: 0,
          currentActionPoints: 2, maxAP: 2, conditions: [], actorContract: { version: 1, revision: 0, ...target } } } }
      } } } };
  });
  const fields = () => ({ roomId: 'r', requestId: uuid(), actionEpoch: actors.epoch(room), windowEpoch: windows.snapshot(room, { uid: 'gm', gm: true }).epoch,
    windowId: null, attack: { id: uuid(), attacker: target, defender: source },
    parry: { id: uuid(), success: true, paid: true, timingConfirmed: true, note: 'PARENT_PRIVATE_NOTE' }, source, target, receiptRef: null });
  function declare(p, cardKey = 'universal_riposte', withdrawn = false) {
    windows.change(room, { uid: 'owner', gm: false }, { roomId: 'r', requestId: uuid(), epoch: p.windowEpoch, windowId: p.windowId,
      reactor: source, cardKey, expectedRevision: 0, label: cardKey, note: '', withdrawn });
  }
  function ready() { const d = fields(), p = gate.offer(room, 'gm', d).opportunity; declare(p); time += 8000; return { d, p }; }
  const approval = p => ({ version: 1, capability: rp.CAPABILITY, roomId: 'r', approvalId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: 0,
    source, target, opportunityId: p.id, proof: p.proof, weapon: { slot: 'mainHand', itemId: null, name: 'Unarmed', weaponType: 'unarmed', typeSource: 'item',
      die: 4, damageType: 'smashing', attribute: 'strength', score: 10, modifier: 0 }, roll: { mode: 'physical', faces: [3] }, price: { ap: 1 } });
  function command(a, p, amount = 7, outcome = 'hit') {
    const chosen = { capability: rp.CAPABILITY, approvalId: a.approvalId, opportunityId: p.id, gmConfirmed: true, names: { source: 'PC', target: 'foe' },
      weapon: a.weapon, roll: a.roll, rollOutcome: outcome, positions: [{ x: 25, y: 25 }, { x: 75, y: 25 }], parentKeys: p.parentKeys, offerHash: p.offerHash, notApplied: rp.UNAPPLIED };
    return { version: 1, roomId: 'r', commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: 0, source, target,
      approval: { approvalId: a.approvalId, contentHash: actors.hash(a) },
      actors: [{ ref: source, expectedRevision: 0, finalResources: { ap: { current: 2, temp: 0 } } },
        { ref: target, expectedRevision: 0, finalResources: { hp: { current: 20 - Math.max(0, amount - 3), temp: Math.max(0, 3 - amount) } } }],
      adjudication: { definitionId: rp.DEFINITION_ID, definitionVersionOrHash: rp.DEFINITION_HASH, chosenResult: JSON.stringify(chosen), finalAmount: amount, adjustmentReason: rp.RULING } };
  }
  it('one parent converges across duplicate attestations/entry paths and never renews the deadline', () => {
    const { d, p } = ready();
    const duplicate = gate.offer(room, 'gm', { ...d, requestId: uuid(), windowId: p.windowId });
    assert.equal(duplicate.opportunity.id, p.id); assert.equal(duplicate.fresh, false);
    assert.equal(windows.snapshot(room, { uid: 'gm', gm: true }).windows.length, 1);
    const alias = { ...d, requestId: uuid() }; gate.offer(room, 'gm', alias);
    assert.throws(() => gate.offer(room, 'gm', { ...alias, parry: { ...d.parry, note: 'changed bytes' } }), /command_id_conflict/);
    assert.throws(() => gate.offer(room, 'gm', { ...d, requestId: uuid(), attack: { ...d.attack, id: uuid() } }), /riposte_parent_conflict/);
    assert.throws(() => gate.offer(room, 'gm', { ...d, requestId: uuid(), parry: { ...d.parry, id: uuid() } }), /riposte_parent_conflict/);
  });
  it('existing closed fresh collector intent joins the same execution gate without a new8s window', () => {
    const d = fields();
    const w = windows.open(room, { uid: 'gm', gm: true }, { roomId: 'r', requestId: uuid(), epoch: d.windowEpoch,
      trigger: { causeId: d.parry.id, moment: 'follow_up', occurrence: '1', basis: 'gm-manual' }, source, invited: [source], gmCommit: { refs: [], note: '' } }).window;
    declare({ windowEpoch: d.windowEpoch, windowId: w.id }); time += 8000;
    const p = gate.offer(room, 'gm', { ...d, windowId: w.id }).opportunity;
    assert.equal(p.windowId, w.id); assert.equal(gate.project(room, p, false).status, 'ready');
    assert.equal(gate.offer(room, 'gm', { ...d, requestId: uuid() }).opportunity.id, p.id);
  });
  it('free-text alias, wrong parent/actor, non-GM and bogus supplied receipt cannot authorize', () => {
    const d = fields(), p = gate.offer(room, 'gm', d).opportunity; declare(p, 'Riposte'); time += 8000;
    assert.throws(() => gate.approvalCheck(room, approval(p)), /riposte_closed_intent_required/);
    assert.throws(() => gate.offer(room, 'owner', d), /forbidden/);
    assert.throws(() => gate.offer(room, 'gm', { ...fields(), attack: { ...d.attack, attacker: source } }), /riposte_wrong_parent/);
    assert.throws(() => gate.offer(room, 'gm', { ...fields(), receiptRef: uuid() }), /invalid_parry_receipt/);
    assert.throws(() => gate.offer(room, 'gm', { ...fields(), parry: { ...d.parry, paid: false } }), /invalid_riposte_attestation/);
  });
  it('strict named binder validates exactly1AP, GM HP and paid miss without basic-strike derivation', () => {
    const { p } = ready(), a = approval(p), entry = { approval: a, contentHash: actors.hash(a) }; gate.attach(room, a);
    assert.throws(() => rp.validateApproval({ ...a, price: { ap: 2 } }), /invalid_riposte_price/);
    const c = command(a, p); gate.bind(room, { isGM: true }, c, { kind: 'gm' }, entry);
    assert.equal(room.gameState.maps.m.characterTokens.pc.character.tempActionPoints, 1, 'staging proof is not payment');
    assert.equal(JSON.stringify(c).includes('PARENT_PRIVATE_NOTE'), false);
    gate.refused(room, c); gate.revalidate(room, p.id); const next = { ...a, approvalId: uuid() }; gate.attach(room, next);
    const miss = command(next, p, 0, 'miss'); assert.doesNotThrow(() => gate.bind(room, { isGM: true }, miss, { kind: 'gm' }, { approval: next, contentHash: actors.hash(next) }));
    assert.equal(miss.actors[1].finalResources.hp.current, 20); assert.equal(miss.actors[1].finalResources.hp.temp, 3);
  });
  it('stale reapproval retains faces and blocks another ID until the previous attempt is known refused', () => {
    const { p } = ready(), a = approval(p); gate.attach(room, a);
    const c = command(a, p); gate.bind(room, { isGM: true }, c, { kind: 'gm' }, { approval: a, contentHash: actors.hash(a) });
    assert.throws(() => gate.revalidate(room, p.id), /riposte_attempt_unknown/);
    assert.throws(() => gate.bind(room, { isGM: true }, { ...c, commandId: uuid() }, { kind: 'gm' }, { approval: a, contentHash: actors.hash(a) }), /riposte_attempt_unknown/);
    gate.refused(room, c); gate.revalidate(room, p.id);
    assert.throws(() => gate.attach(room, { ...a, approvalId: uuid(), roll: { mode: 'digital', faces: [2] } }), /riposte_recorded_roll_changed/);
    assert.doesNotThrow(() => gate.attach(room, { ...a, approvalId: uuid() }));
  });
  it('cancellation/consumption is terminal; positions and current owner membership are revalidated', () => {
    const { p } = ready(), a = approval(p); gate.attach(room, a);
    const c = command(a, p); room.gameState.maps.m.tokens.foe.position.x += 1;
    assert.throws(() => gate.bind(room, { isGM: true }, c, { kind: 'gm' }, { approval: a, contentHash: actors.hash(a) }), /riposte_ruling_stale/);
    room.gameState.maps.m.tokens.foe.position.x -= 1; room.players.clear();
    assert.throws(() => gate.bind(room, { isGM: true }, c, { kind: 'gm' }, { approval: a, contentHash: actors.hash(a) }), /owner_unavailable/);
    gate.cancel(room, p.id); assert.throws(() => gate.approvalCheck(room, a), /riposte_consumed_or_cancelled/);
  });
  it('private canonical parent keys recover consumed parents after context restore; public receipts remove all proof', () => {
    const { d, p } = ready(), a = approval(p), c = command(a, p);
    const r = { version: 1, roomId: 'r', commandId: c.commandId, source, target, contentHash: actors.hash(c),
      authorization: { kind: 'owner-approval-gm', proposalId: a.approvalId, approvalHash: actors.hash(a) }, adjudication: c.adjudication, actors: [] };
    room.gameState.actorConsequences = { version: 1, admissionEpoch: actors.epoch(room), commitSequence: 1, replayFloor: 0, receipts: [r] };
    const publicR = actors.publicReceipt(r), raw = JSON.stringify(publicR);
    assert.equal(/parentKeys|offerHash|PARENT_PRIVATE_NOTE|proof/.test(raw), false);
    assert.equal(publicR.contentHash, undefined); assert.equal(publicR.authorization.approvalHash, undefined);
    room = { ...room, gameState: actors.clone(room.gameState) };
    const recovered = gate.offer(room, 'gm', d); assert.equal(recovered.receipt.commandId, c.commandId);
    assert.equal(windows.snapshot(room, { uid: 'gm', gm: true }).windows.length, 0, 'no reopened window after restart');
    const unexecuted = { ...d, requestId: uuid(), attack: { ...d.attack, id: uuid() }, parry: { ...d.parry, id: uuid() } };
    assert.throws(() => gate.offer(room, 'gm', unexecuted), /riposte_opportunity_unavailable/);
  });
});
