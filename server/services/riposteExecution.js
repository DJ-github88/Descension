/** E1a: one strict original Riposte gate/binder, not a reaction scheduler or payment engine. */
const crypto = require('crypto');
const actors = require('./actorConsequences');
const payments = require('./spellPayments');
const { collector } = require('./reactionWindows');
const CAPABILITY = 'p13b-riposte:v1', DEFINITION_ID = 'universal_riposte';
const SOURCE_HASH = '89bebadaa3b079de5c22ad2bebc823ab3f1bad87a0e35b1d6b245ee6c2802fab';
const DEFINITION_HASH = `${CAPABILITY}/${DEFINITION_ID}@${SOURCE_HASH}`;
const RULING = 'Eligibility, hit/miss and final damage GM-adjudicated; prior Parry payment GM-attested and not charged here.';
const UNAPPLIED = 'Conditions, buffs/debuffs, critical/fumble follow-ons, wear, movement, ammunition, class gains and extra effects are not applied.';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const fail = actors.fail, hash = actors.hash, clone = actors.clone;
const int = (n, max = 100000) => Number.isSafeInteger(n) && n >= 0 && n <= max;
const text = (s, max = 120) => typeof s === 'string' && s.trim().length > 0 && s.length <= max;
function exact(o, fields) {
  try { actors.keys(o, fields); } catch (_) { fail('invalid_riposte'); }
  if (fields.some(k => !actors.own(o, k))) { fail('invalid_riposte'); }
}
const isApproval = a => a?.capability === CAPABILITY;
const isCommand = c => c?.adjudication?.definitionId === DEFINITION_ID || (typeof c?.adjudication?.definitionVersionOrHash === 'string' && c.adjudication.definitionVersionOrHash.startsWith(`${CAPABILITY}/`));
const isReceipt = r => r?.adjudication?.definitionVersionOrHash === DEFINITION_HASH;
function validateApproval(a) {
  exact(a, ['version', 'capability', 'roomId', 'approvalId', 'actionEpoch', 'baseCommitSequence', 'source', 'target',
    'opportunityId', 'proof', 'weapon', 'roll', 'price']);
  if (a.version !== 1 || a.capability !== CAPABILITY || !UUID.test(a.approvalId) || !UUID.test(a.opportunityId) ||
      !text(a.actionEpoch, 200) || !int(a.baseCommitSequence, Number.MAX_SAFE_INTEGER) || !text(a.proof, 200) || actors.bytes(a) > 8192) { fail('invalid_riposte'); }
  actors.validateRef(a.source); actors.validateRef(a.target);
  if (a.source.kind !== 'character' || a.target.kind !== 'creature' || a.source.roomId !== a.roomId || a.target.roomId !== a.roomId || a.source.mapId !== a.target.mapId) { fail('invalid_riposte'); }
  exact(a.price, ['ap']); if (a.price.ap !== 1) { fail('invalid_riposte_price'); }
  exact(a.weapon, ['slot', 'itemId', 'name', 'weaponType', 'typeSource', 'die', 'damageType', 'attribute', 'score', 'modifier']);
  const w = a.weapon;
  if (!['mainHand', 'ranged'].includes(w.slot) || !(w.itemId === null || text(w.itemId)) || !text(w.name, 80) ||
      !/^[a-z][a-z ]{1,38}$/.test(w.weaponType) || !['item', 'owner'].includes(w.typeSource) || !int(w.die, 100) || w.die < 2 ||
      !/^[a-z]{2,20}$/.test(w.damageType) || !['strength', 'agility'].includes(w.attribute) || !int(w.score, 100) ||
      w.modifier !== Math.floor((w.score - 10) / 2)) { fail('invalid_riposte'); }
  if (w.itemId === null && (w.weaponType !== 'unarmed' || w.slot !== 'mainHand' || w.die !== 4 || w.damageType !== 'smashing')) { fail('invalid_riposte'); }
  exact(a.roll, ['mode', 'faces']);
  if (!['digital', 'physical'].includes(a.roll.mode) || !Array.isArray(a.roll.faces) || !a.roll.faces.length || a.roll.faces.length > 20 ||
      a.roll.faces.some(f => !Number.isSafeInteger(f) || f < 1 || f > w.die)) { fail('invalid_riposte'); }
  if (!require('./strikeApprovals').validChain(w.die, a.roll.faces)) { fail('invalid_riposte'); }
  return a;
}
function createGate({ windows = collector } = {}) {
  const states = new WeakMap();
  function state(room) {
    const epoch = actors.epoch(room), identity = `${epoch}:${room.gmId}`;
    let s = states.get(room);
    if (!s || s.identity !== identity) {
      s = { identity, epoch, byId: new Map(), byAttack: new Map(), byParry: new Map(), byWindow: new Map(), requests: new Map() }; states.set(room, s);
    }
    return s;
  }
  function get(room, id) { return state(room).byId.get(id); }
  function receipt(room, id) { return actors.ledger(room).receipts.find(r => isReceipt(r) && (() => { try { return JSON.parse(r.adjudication.chosenResult).opportunityId === id; } catch (_) { return false; } })()); }
  function windowFor(room, p) { return windows.followup(room, { epoch: p.windowEpoch, windowId: p.windowId, parryId: p.parry.id, source: p.source }); }
  function check(room, p) {
    if (!p || p.epoch !== actors.epoch(room)) { fail('riposte_opportunity_unavailable'); }
    actors.locate(room, p.source); actors.locate(room, p.target);
    const done = receipt(room, p.id);
    if (done) { p.status = 'consumed'; p.commandId = done.commandId; }
    return p;
  }
  function project(room, p, gm) {
    try { check(room, p); } catch (_) { return null; }
    const w = windowFor(room, p);
    const ready = w?.status === 'closed' && w.intent && !w.intent.withdrawn;
    const status = p.status === 'offered' ? (w?.status === 'open' ? 'collecting' : ready ? 'ready' : 'manual') : p.status;
    return { id: p.id, actionEpoch: p.epoch, source: clone(p.source), target: clone(p.target), definitionId: DEFINITION_ID,
      definitionHash: DEFINITION_HASH, proof: p.proof, windowId: p.windowId, deadlineAt: w?.deadlineAt, status,
      approvalId: p.approvalId, intentRevision: w?.intent?.revision || null, parryPayment: 'GM-attested-paid; not charged by Riposte',
      ...(gm ? { attack: clone(p.attack), parry: clone(p.parry), paymentReference: p.receiptRef || null } : {}) };
  }
  function list(room, viewer) {
    return [...state(room).byId.values()].filter(p => viewer.gm || p.source.ownerUid === viewer.uid).map(p => project(room, p, viewer.gm)).filter(Boolean);
  }
  function offer(room, uid, data) {
    exact(data, ['roomId', 'requestId', 'actionEpoch', 'windowEpoch', 'windowId', 'attack', 'parry', 'source', 'target', 'receiptRef']);
    if (uid !== room.gmId || data.roomId !== room.id) { fail('forbidden'); }
    if (!UUID.test(data.requestId) || data.actionEpoch !== actors.epoch(room) || actors.bytes(data) > 8192) { fail('riposte_opportunity_unavailable'); }
    const s = state(room), requestHash = hash(data), priorRequest = s.requests.get(data.requestId);
    if (priorRequest) { if (priorRequest.hash !== requestHash) { fail('command_id_conflict'); } return { opportunity: get(room, priorRequest.id), fresh: false }; }
    if (s.requests.size >= 1024) { fail('riposte_capacity_manual'); }
    exact(data.attack, ['id', 'attacker', 'defender']); exact(data.parry, ['id', 'success', 'paid', 'timingConfirmed', 'note']);
    if (!text(data.attack.id) || !text(data.parry.id) || data.parry.success !== true || data.parry.paid !== true ||
        data.parry.timingConfirmed !== true || !text(data.parry.note, 500)) { fail('invalid_riposte_attestation'); }
    const source = actors.locate(room, data.source), target = actors.locate(room, data.target);
    if (data.source.kind !== 'character' || data.target.kind !== 'creature' || data.source.mapId !== data.target.mapId ||
        hash(data.attack.attacker) !== hash(data.target) || hash(data.attack.defender) !== hash(data.source)) { fail('riposte_wrong_parent'); }
    if (data.receiptRef !== null) {
      if (!UUID.test(data.receiptRef)) { fail('invalid_parry_receipt'); }
      const r = actors.ledger(room).receipts.find(r => r.commandId === data.receiptRef);
      if (!r || r.roomId !== room.id || isReceipt(r) || !r.actors.some(a => hash(a.ref) === hash(data.source))) { fail('invalid_parry_receipt'); }
    }
    // Receipt existence/actor linkage is validated, NEVER advertised as mechanically verified Parry payment.
    const oldIds = [s.byAttack.get(data.attack.id), s.byParry.get(data.parry.id), data.windowId && s.byWindow.get(data.windowId)].filter(Boolean);
    if (oldIds.length) {
      const old = get(room, oldIds[0]);
      if (oldIds.some(id => id !== old.id) || hash(old.attack) !== hash(data.attack) || hash(old.source) !== hash(data.source) || hash(old.target) !== hash(data.target) ||
          old.parry.id !== data.parry.id || data.windowId && old.windowId !== data.windowId) { fail('riposte_parent_conflict'); }
      s.requests.set(data.requestId, { hash: requestHash, id: old.id });
      return { opportunity: old, fresh: false };
    }
    if (s.byId.size >= 64) { fail('riposte_capacity_manual'); }
    let w = windows.followup(room, { epoch: data.windowEpoch, windowId: data.windowId, parryId: data.parry.id, source: data.source });
    if (data.windowId && (!w || w.status !== 'closed' || !w.intent || w.intent.withdrawn)) { fail('riposte_closed_intent_required'); }
    let fresh = false;
    if (!w) {
      const opened = windows.open(room, { uid, gm: true }, { roomId: room.id, requestId: data.requestId, epoch: data.windowEpoch,
        trigger: { causeId: data.parry.id, moment: 'follow_up', occurrence: '1', basis: 'gm-manual' }, source: data.source, invited: [data.source],
        gmCommit: { refs: [], note: '' } });
      w = { windowId: opened.window.id, epoch: data.windowEpoch }; fresh = opened.fresh;
    }
    const p = { id: crypto.randomUUID(), epoch: s.epoch, gmUid: uid, source: clone(data.source), target: clone(data.target),
      attack: clone(data.attack), parry: clone(data.parry), receiptRef: data.receiptRef, attestedAt: Date.now(),
      proof: crypto.randomBytes(32).toString('hex'), windowEpoch: w.epoch, windowId: w.windowId, status: 'offered', approvalId: null,
      evidenceHash: null, attempt: null };
    s.byId.set(p.id, p); s.byAttack.set(data.attack.id, p.id); s.byParry.set(data.parry.id, p.id); s.byWindow.set(p.windowId, p.id);
    s.requests.set(data.requestId, { hash: requestHash, id: p.id });
    return { opportunity: p, fresh };
  }
  function approvalCheck(room, a) {
    validateApproval(a);
    const p = check(room, get(room, a.opportunityId)), w = windowFor(room, p);
    if (p.proof !== a.proof || hash(p.source) !== hash(a.source) || hash(p.target) !== hash(a.target)) { fail('riposte_approval_mismatch'); }
    if (p.status === 'consumed' || p.status === 'cancelled') { fail('riposte_consumed_or_cancelled'); }
    if (p.status === 'manual-review') { fail('riposte_revalidation_required'); }
    if (!w || w.status !== 'closed' || !w.intent || w.intent.withdrawn) { fail('riposte_closed_intent_required'); }
    const evidence = hash([a.weapon, a.roll]);
    if (p.evidenceHash && p.evidenceHash !== evidence) { fail('riposte_recorded_roll_changed'); }
    payments.tempFirst(actors.resources(actors.locate(room, a.source).token, 'character').ap.current,
      actors.resources(actors.locate(room, a.source).token, 'character').ap.temp, 1);
    return p;
  }
  function attach(room, a) {
    const p = approvalCheck(room, a);
    if (p.approvalId && p.approvalId !== a.approvalId) { fail('approval_pending'); }
    p.approvalId = a.approvalId; p.evidenceHash = hash([a.weapon, a.roll]);
  }
  function closed(room, a, code) {
    const p = get(room, a.opportunityId); if (!p) { return; }
    if (code === 'consumed') { p.status = 'consumed'; }
    else { p.status = 'manual-review'; }
  }
  function revalidate(room, id) {
    const p = check(room, get(room, id));
    if (p.status === 'consumed' || p.status === 'cancelled') { fail('riposte_consumed_or_cancelled'); }
    if (p.attempt && p.attempt.status !== 'refused') { fail('riposte_attempt_unknown'); }
    p.approvalId = null; p.attempt = null; p.status = 'offered'; return p;
  }
  function cancel(room, id) {
    const p = check(room, get(room, id));
    if (p.status === 'consumed') { return p; }
    p.status = 'cancelled'; return p;
  }
  function bind(room, player, command, authorization, entry) {
    if (!player.isGM || authorization?.kind !== 'gm' || !entry) { fail('approval_requires_gm'); }
    const a = entry.approval, p = approvalCheck(room, a);
    if (p.approvalId !== a.approvalId || command.approval.contentHash !== entry.contentHash || hash(command.source) !== hash(a.source) || hash(command.target) !== hash(a.target)) { fail('riposte_approval_mismatch'); }
    if (command.adjudication?.definitionId !== DEFINITION_ID || command.adjudication?.definitionVersionOrHash !== DEFINITION_HASH) { fail('riposte_approval_mismatch'); }
    let chosen; try { chosen = JSON.parse(command.adjudication.chosenResult); } catch (_) { fail('invalid_riposte'); }
    exact(chosen, ['capability', 'approvalId', 'opportunityId', 'gmConfirmed', 'names', 'weapon', 'roll', 'rollOutcome', 'positions', 'notApplied']);
    exact(chosen.names, ['source', 'target']);
    if (chosen.capability !== CAPABILITY || chosen.approvalId !== a.approvalId || chosen.opportunityId !== p.id || chosen.gmConfirmed !== true ||
        !text(chosen.names.source, 60) || !text(chosen.names.target, 60) || hash(chosen.weapon) !== hash(a.weapon) || hash(chosen.roll) !== hash(a.roll) ||
        !['hit', 'miss'].includes(chosen.rollOutcome) || chosen.notApplied !== UNAPPLIED || command.adjudication.adjustmentReason !== RULING) { fail('riposte_approval_mismatch'); }
    const amount = command.adjudication.finalAmount;
    if (!int(amount) || chosen.rollOutcome === 'miss' && amount !== 0) { fail('invalid_final_amount'); }
    const source = actors.locate(room, a.source), target = actors.locate(room, a.target);
    if (hash(chosen.positions) !== hash([source.token.position || null, target.token.position || null])) { fail('riposte_ruling_stale'); }
    const pools = actors.resources(source.token, 'character'), hp = actors.resources(target.token, 'creature').hp;
    const ap = payments.tempFirst(pools.ap.current, pools.ap.temp, 1), fromTemp = Math.min(hp.temp, amount);
    const expected = [{ ref: a.source, finalResources: { ap } }, { ref: a.target, finalResources: { hp: { current: Math.max(0, hp.current - (amount - fromTemp)), temp: hp.temp - fromTemp } } }];
    if (command.actors.length !== 2) { fail('riposte_approval_mismatch'); }
    command.actors.forEach((actor, i) => {
      if (hash(actor.ref) !== hash(expected[i].ref) || actor.conditions !== undefined || actor.classPayment !== undefined || actor.equipmentWear !== undefined ||
          actor.blockingDeclaration !== undefined || hash(actor.finalResources) !== hash(expected[i].finalResources)) { fail('riposte_approval_mismatch'); }
      if (actors.locate(room, actor.ref).contract.revision !== actor.expectedRevision) { fail('stale_actor_revision'); }
    });
    if (p.attempt && (p.attempt.id !== command.commandId || p.attempt.hash !== hash(command))) { fail('riposte_attempt_unknown'); }
    p.attempt = { id: command.commandId, hash: hash(command), status: 'pending' };
    return entry;
  }
  function refused(room, command) {
    const a = command?.approval; if (!a) { return; }
    for (const p of state(room).byId.values()) {
      if (!['consumed', 'cancelled'].includes(p.status) && p.approvalId === a.approvalId && (!p.attempt || p.attempt.id === command.commandId && p.attempt.hash === hash(command))) {
        p.status = 'manual-review'; if (p.attempt) { p.attempt.status = 'refused'; }
      }
    }
  }
  return { offer, get, list, project, receipt, approvalCheck, attach, closed, revalidate, cancel, bind, refused };
}
const gate = createGate();
module.exports = { CAPABILITY, DEFINITION_ID, DEFINITION_HASH, SOURCE_HASH, RULING, UNAPPLIED, isApproval, isCommand, isReceipt, validateApproval, createGate, ...gate };
