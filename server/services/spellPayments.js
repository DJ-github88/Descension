/** Original P9: named source-owned class payment adapter and owner approvals.
 * Typed shape and price-conservation checks only; no spell rules, dice, targeting,
 * mitigation or class pricing. Prices are prepared by the owning class domain on
 * the owner's client and bound here to the exact approved typed result.
 */
const actors = require('./actorConsequences');

const { fail, keys, own, clone, hash } = actors;
const ELEMENTS = Object.freeze(['arcane', 'sacred', 'blight', 'ember', 'rime', 'primal', 'storm', 'wyrd']);
const PITCHES = Object.freeze(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']);
const THRESHOLDS = Object.freeze([0, 10, 20, 40, 60, 80, 100]);
const DOMAINS = Object.freeze(['elementalSpheres', 'musicalNotes', 'devotionGauge']);
const CAPABILITY = 'p9-spell:v1';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const approvals = new WeakMap();
// Closed (withdrawn/declined/re-approval) IDs are never silently re-registered.
const closedApprovals = new WeakMap();
const int = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(value) && value >= min && value <= max;
const text = (value, max = 200) => typeof value === 'string' && value.length > 0 && value.length <= max;
const martyrLevel = damage => THRESHOLDS.reduce((level, threshold, index) => damage >= threshold ? index : level, 0);

function validateValue(domain, value) {
  if (!DOMAINS.includes(domain)) {fail('unsupported_class_payment');}
  if (domain === 'elementalSpheres') {
    keys(value, ['type', 'spheres']);
    if (value.type !== domain || !Array.isArray(value.spheres) || value.spheres.length > 12 || value.spheres.some(item => !ELEMENTS.includes(item))) {fail('invalid_class_payment');}
  } else if (domain === 'musicalNotes') {
    keys(value, ['type', 'notes']);
    if (value.type !== domain || !Array.isArray(value.notes) || value.notes.length !== 7 || value.notes.some(item => !int(item, 0, 5))) {fail('invalid_class_payment');}
  } else {
    keys(value, ['type', 'current', 'max', 'damage', 'earnedLevels', 'spentLevels', 'bonusLevels']);
    const { current, max, damage, earnedLevels, spentLevels, bonusLevels } = value;
    if (value.type !== domain || max !== 6 || !int(current, 0, 6) || typeof damage !== 'number' || !Number.isFinite(damage) || damage < 0 || damage > 150 ||
      earnedLevels !== martyrLevel(damage) || !int(bonusLevels, 0, 6) || !int(spentLevels, 0, earnedLevels + bonusLevels) ||
      current !== earnedLevels + bonusLevels - spentLevels) {fail('invalid_class_payment');}
  }
  return value;
}
function validatePrice(domain, price) {
  if (domain === 'devotionGauge') {
    keys(price, ['cost', 'gain', 'required']);
    if (!int(price.cost, 0, 6) || !int(price.gain, 0, 6) || !int(price.required, 0, 6)) {fail('invalid_class_payment');}
  } else {
    keys(price, ['costs', 'gains']);
    const vocabulary = domain === 'elementalSpheres' ? ELEMENTS : PITCHES;
    for (const list of [price.costs, price.gains]) {
      if (!Array.isArray(list) || list.length > 35 || list.some(item => !vocabulary.includes(item))) {fail('invalid_class_payment');}
    }
  }
  return price;
}
/** Typed price conservation: the approved after-state is exactly the approved
 * price applied to the authoritative before-state (list arithmetic / ledger form). */
function conserve(domain, before, after, price) {
  validateValue(domain, before); validateValue(domain, after); validatePrice(domain, price);
  if (domain === 'devotionGauge') {
    if (before.current < Math.max(price.cost, price.required)) {fail('insufficient_class_resource');}
    // Spend records spent levels; a later gain first restores spent levels, and
    // the six-level cap bounds the gain (the existing ledger contract).
    const afterConsume = before.current - price.cost;
    const spent = before.spentLevels + price.cost;
    const delta = Math.min(6, afterConsume + price.gain) - afterConsume;
    const restored = Math.min(spent, delta);
    const expected = { damage: before.damage, earnedLevels: before.earnedLevels, spentLevels: spent - restored, current: afterConsume + delta };
    if (Object.entries(expected).some(([key, value]) => after[key] !== value)) {fail('class_payment_mismatch');}
    return true;
  }
  const items = domain === 'elementalSpheres' ? [...before.spheres] : before.notes.flatMap((count, index) => Array(count).fill(PITCHES[index]));
  for (const cost of price.costs) {
    const index = items.indexOf(cost);
    if (index < 0) {fail('insufficient_class_resource');}
    items.splice(index, 1);
  }
  const next = [...items, ...price.gains];
  const expected = domain === 'elementalSpheres' ? next.slice(0, 12) : PITCHES.map(pitch => Math.min(5, next.filter(item => item === pitch).length));
  if (hash(expected) !== hash(domain === 'elementalSpheres' ? after.spheres : after.notes)) {fail('class_payment_mismatch');}
  return true;
}
function publicValue(domain, value) {
  if (domain === 'elementalSpheres') {return { type: domain, spheres: [...value.spheres], current: value.spheres.length, max: 12 };}
  if (domain === 'musicalNotes') {return { type: domain, current: value.notes.reduce((sum, count) => sum + count, 0), max: 35 };}
  return { type: domain, current: value.current, max: 6 };
}
function home(token) {
  const stored = token?.state?.classPayment;
  if (stored === undefined || stored === null) {return null;}
  if (stored.version !== 1) {fail('unsupported_actor_contract');}
  validateValue(stored.domain, stored.value);
  return { domain: stored.domain, value: stored.value };
}
function validateHomeShape(value, allowNull) {
  if (value === null && allowNull) {return null;}
  keys(value, ['domain', 'value']);
  validateValue(value.domain, value.value);
  return value;
}
function validateEntry(payment) {
  keys(payment, ['mode', 'before', 'after', 'domain', 'approvalHash']);
  if (payment.mode === 'sync') {
    if (!own(payment, 'before') || !own(payment, 'after') || own(payment, 'domain') || own(payment, 'approvalHash')) {fail('invalid_class_payment');}
    validateHomeShape(payment.before, true); validateHomeShape(payment.after, false);
  } else if (payment.mode === 'spell') {
    if (own(payment, 'before') || own(payment, 'after') || !DOMAINS.includes(payment.domain) || !/^[0-9a-f]{64}$/.test(payment.approvalHash || '')) {fail('invalid_class_payment');}
  } else {fail('invalid_class_payment');}
  return payment;
}
function validateRoll(roll) {
  keys(roll, ['mode', 'dice', 'constant', 'total', 'reading']);
  if (!['digital', 'physical'].includes(roll.mode) || !Array.isArray(roll.dice) || !roll.dice.length || roll.dice.length > 8 ||
    !Number.isSafeInteger(roll.constant) || Math.abs(roll.constant) > 10000 || !text(roll.reading, 300)) {fail('invalid_spell_approval');}
  let total = roll.constant;
  for (const group of roll.dice) {
    keys(group, ['sides', 'faces']);
    if (!int(group.sides, 2, 100) || !Array.isArray(group.faces) || !group.faces.length || group.faces.length > 50 || group.faces.some(face => !int(face, 1, group.sides))) {fail('invalid_spell_approval');}
    total += group.faces.reduce((sum, face) => sum + face, 0);
  }
  if (roll.total !== total) {fail('invalid_spell_approval');}
  return roll;
}
function validateApprovalShape(approval, creature = false) {
  keys(approval, ['version', 'roomId', 'approvalId', 'actionEpoch', 'baseCommitSequence', 'source', 'target', 'spell', 'roll', 'price', 'classPayment', ...(creature ? ['sourceAuthority'] : [])]);
  if (approval.version !== 1 || !text(approval.roomId) || !UUID.test(approval.approvalId || '') || !text(approval.actionEpoch) || !int(approval.baseCommitSequence) ||
    actors.bytes(approval) > 32768) {fail('invalid_spell_approval');}
  actors.validateRef(approval.source); actors.validateRef(approval.target);
  if (approval.source.kind !== (creature ? 'creature' : 'character') || approval.source.roomId !== approval.roomId || approval.target.roomId !== approval.roomId ||
    approval.target.mapId !== approval.source.mapId) {fail('invalid_spell_approval');}
  keys(approval.spell, ['definitionId', 'definitionHash', 'name', 'kind', 'damageTypes']);
  if (!text(approval.spell.definitionId) || !/^(p9-spell:v1|authored-immediate:v1)\/[0-9a-f]{64}$/.test(approval.spell.definitionHash || '') || !text(approval.spell.name) ||
    !['damage', 'healing'].includes(approval.spell.kind) || !Array.isArray(approval.spell.damageTypes) || approval.spell.damageTypes.length > 8 ||
    approval.spell.damageTypes.some(type => !text(type, 40)) || (approval.spell.kind === 'damage' && !approval.spell.damageTypes.length)) {fail('invalid_spell_approval');}
  validateRoll(approval.roll);
  keys(approval.price, ['ap', 'mana']);
  if (!int(approval.price.ap, 0, 100) || !int(approval.price.mana, 0, 10000)) {fail('invalid_spell_approval');}
  if (approval.classPayment !== null) {
    keys(approval.classPayment, ['domain', 'before', 'after', 'price']);
    conserve(approval.classPayment.domain, approval.classPayment.before, approval.classPayment.after, approval.classPayment.price);
  }
  return approval;
}
function validateApproval(approval) { return validateApprovalShape(approval); }
function validateCreatureApproval(approval, primaryPc = false) {
  validateApprovalShape(approval, true);
  keys(approval.sourceAuthority, ['admissionId', 'associationHash', 'gmUid']);
  if (!UUID.test(approval.sourceAuthority.admissionId || '') || !/^[0-9a-f]{64}$/.test(approval.sourceAuthority.associationHash || '') || !text(approval.sourceAuthority.gmUid) ||
    approval.target.kind !== (primaryPc ? 'character' : 'creature') || (hash(approval.source) === hash(approval.target) && (primaryPc || approval.spell.kind !== 'healing')) || approval.classPayment !== null ||
    !approval.spell.definitionHash.startsWith('authored-immediate:v1/')) fail('unsupported_creature_target');
  return approval;
}
/** Temporary pools are counted and spent first (approved creator rule). */
function tempFirst(current, temp, amount) {
  if (![current, temp, amount].every(value => typeof value === 'number' && Number.isFinite(value) && value >= 0)) {fail('invalid_resources');}
  if (amount > current + temp) {fail('insufficient_resources');}
  const fromTemp = Math.min(temp, amount);
  return { current: current - (amount - fromTemp), temp: temp - fromTemp };
}
function sourcePools(token, kind = 'character') {
  const values = actors.resources(token, kind);
  return values;
}
function validPool(pool) {
  if (![pool.current, pool.temp, pool.max].every(v => typeof v === 'number' && Number.isFinite(v) && v >= 0) || pool.current > pool.max) fail('invalid_resources');
  return pool;
}
// A6 validation evidence belongs to the existing pending attempt, not a second actor/store.
function selfState(room, approval) {
  if (approval.source.kind !== 'creature' || hash(approval.source) !== hash(approval.target)) return null;
  const source = actors.locate(room, approval.source);
  return hash({ contract: source.contract, resources: actors.resources(source.token, 'creature'), conditions: source.token.state?.conditions || [] });
}
/** Checks an approval against current authoritative room state. */
function checkAgainstRoom(room, approval) {
  const authored = require('../../vtt-react/src/services/authoredAbility');
  if (authored.isAuthored(approval.spell) || approval.spell.definitionHash.startsWith(`${authored.CAPABILITY}/`)) {
    require('./installedAuthoredAbilities').checkApproval(room, approval);
  }
  actors.assertCanAct(room, approval.source);
  const source = actors.locate(room, approval.source);
  const target = actors.locate(room, approval.target);
  const pools = sourcePools(source.token, approval.source.kind);
  for (const [pool, key] of [['ap', 'ap'], ['mana', 'mana']]) {
    if (approval.price[key] > 0) {if (approval.source.kind === 'creature') validPool(pools[pool]); tempFirst(pools[pool].current, pools[pool].temp, approval.price[key]);}
  }
  if (approval.source.kind === 'creature') { validPool(pools.ap); validPool(actors.resources(target.token, 'creature').hp); }
  if (approval.classPayment) {
    if (hash(home(source.token)) !== hash({ domain: approval.classPayment.domain, value: approval.classPayment.before })) {fail('class_home_required');}
  }
  return { source, target };
}
function registry(room) {
  let entries = approvals.get(room);
  if (!entries) {entries = new Map(); approvals.set(room, entries);}
  return entries;
}
function get(room, approvalId) { return approvals.get(room)?.get(approvalId) || null; }
function pendingFor(room, ownerUid, characterId) {
  if (!room || !ownerUid) {return null;}
  return Array.from(approvals.get(room)?.values() || []).find(entry => entry.approval.source.ownerUid === ownerUid &&
    (characterId === undefined || entry.approval.source.characterId === characterId)) || null;
}
function add(room, entry) {
  const entries = registry(room);
  if (entry.approval.source.kind === 'creature' ? listAll(room).some(e => hash(e.approval.source) === hash(entry.approval.source)) : pendingFor(room, entry.approval.source.ownerUid, entry.approval.source.characterId)) {fail('approval_pending');}
  if ((closedApprovals.get(room)?.size || 0) + entries.size >= CLOSED_LIMIT) {fail('approval_capacity');}
  if (entries.size >= 32 || actors.bytes(Array.from(entries.values()).map(value => value.approval).concat(entry.approval)) > 512 * 1024) {fail('approval_capacity');}
  entries.set(entry.approval.approvalId, entry);
  return entry;
}
function remove(room, approvalId) { return approvals.get(room)?.delete(approvalId) || false; }
function listAll(room) { return Array.from(approvals.get(room)?.values() || []); }
// Closed and consumed IDs are remembered for the whole runtime (never evicted).
// A runtime change resets them, but a new runtime also has a new admission epoch,
// so an old approval is outcome_unknown there and can never be registered again.
const CLOSED_LIMIT = 4096;
function close(room, approvalId, code, evidence = get(room, approvalId)) {
  let closed = closedApprovals.get(room);
  if (!closed) {closed = new Map(); closedApprovals.set(room, closed);}
  if (!closed.has(approvalId) && closed.size + (approvals.get(room)?.size || 0) - (get(room, approvalId) ? 1 : 0) >= CLOSED_LIMIT) fail('approval_capacity');
  closed.set(approvalId, { code, contentHash: evidence?.contentHash, ownerUid: evidence?.ownerUid });
  return remove(room, approvalId);
}
function closedEntry(room, approvalId) { return closedApprovals.get(room)?.get(approvalId) || null; }
function closedCode(room, approvalId) { return closedEntry(room, approvalId)?.code || null; }
function consumedReceipt(room, approvalId) {
  return actors.ledger(room).receipts.find(receipt => ['owner-approval-gm', 'gm-creature-ability'].includes(receipt.authorization?.kind) && receipt.authorization.proposalId === approvalId) || null;
}
/** GM-visible privacy projection: class values are reduced to public fields. */
function gmProjection(entry) {
  const { approval } = entry;
  return { ...clone(approval), classPayment: approval.classPayment ? { domain: approval.classPayment.domain, price: clone(approval.classPayment.price),
    beforePublic: publicValue(approval.classPayment.domain, approval.classPayment.before), afterPublic: publicValue(approval.classPayment.domain, approval.classPayment.after) } : null };
}
function ownerMember(room, ownerUid) {
  return room.gmId === ownerUid || Array.from(room.players?.values?.() || []).some(player => player.userId === ownerUid);
}
/** Registration window (repair B2): an approval is bound to the commit sequence it
 * was prepared from. Once its receipt could have been pruned (floor above the base),
 * the server can no longer prove non-consumption, so the outcome is unknown. */
function checkWindow(room, approval) {
  const state = actors.ledger(room);
  if (approval.baseCommitSequence < state.replayFloor) {fail('retry_window_expired');}
  if (approval.baseCommitSequence > state.commitSequence) {fail('invalid_spell_approval');}
}
/** Binds a GM command to one pending owner approval (F9.3 step 4). */
function bindCommand(room, player, command, authorization) {
  if (!player.isGM) {fail('forbidden');}
  // Repair B1: only the GM's own direct consequence may consume an owner approval.
  if (authorization?.kind !== 'gm') {fail('approval_requires_gm');}
  keys(command.approval, ['approvalId', 'contentHash']);
  const entry = get(room, command.approval.approvalId);
  if (!entry) {
    const closed = closedCode(room, command.approval.approvalId);
    fail(consumedReceipt(room, command.approval.approvalId) ? 'approval_consumed' : closed ? `approval_${closed}` : 'outcome_unknown');
  }
  if (entry.contentHash !== command.approval.contentHash) {fail('command_id_conflict');}
  const { approval } = entry;
  const authored = require('../../vtt-react/src/services/authoredAbility');
  const capability = authored.isAuthored(approval.spell) ? authored.CAPABILITY : CAPABILITY;
  if (capability === authored.CAPABILITY) {
    checkAgainstRoom(room, approval);
    if (selfState(room, approval) !== (entry.selfState ?? null)) fail('creature_revalidation_required');
    if (approval.source.kind === 'character' && actors.locate(room, approval.source).token.ownerUserId !== approval.source.ownerUid) {fail('forbidden');}
  }
  if (approval.source.kind === 'creature') {
    validateCreatureApproval(approval);
    if (entry.ownerUid !== room.gmId || authorization.authorizerUid !== room.gmId) fail('forbidden');
  } else if (!ownerMember(room, approval.source.ownerUid)) {fail('owner_unavailable');}
  if (hash(command.source) !== hash(approval.source) || hash(command.target) !== hash(approval.target)) {fail('approval_mismatch');}
  const adjudication = command.adjudication || {};
  if (adjudication.definitionId !== approval.spell.definitionId || adjudication.definitionVersionOrHash !== approval.spell.definitionHash) {fail('approval_mismatch');}
  let chosen;
  try {chosen = JSON.parse(adjudication.chosenResult);} catch (_) {fail('approval_mismatch');}
  if (!chosen || chosen.capability !== capability || chosen.approvalId !== approval.approvalId || chosen.kind !== approval.spell.kind ||
    chosen.gmConfirmed !== true || hash(chosen.roll) !== hash(approval.roll)) {fail('approval_mismatch');}
  const amount = adjudication.finalAmount;
  if (!int(amount, 0, 100000)) {fail('invalid_final_amount');}
  if (typeof adjudication.adjustmentReason !== 'string' || adjudication.adjustmentReason.length > 2000 ||
    (amount !== approval.roll.total && !adjudication.adjustmentReason.trim())) {fail('adjustment_reason_required');}
  const { source, target } = { source: actors.locate(room, approval.source), target: actors.locate(room, approval.target) };
  // Revision bumps are CAS refusals (GM re-prepares explicitly), never owner re-approval.
  for (const actor of command.actors) {
    if (actors.locate(room, actor.ref).contract.revision !== actor.expectedRevision) {fail('stale_actor_revision');}
  }
  if (approval.classPayment && hash(home(source.token)) !== hash({ domain: approval.classPayment.domain, value: approval.classPayment.before })) {fail('owner_reapproval_required');}
  const self = hash(approval.source) === hash(approval.target);
  const pools = sourcePools(source.token, approval.source.kind);
  const expectedSource = {};
  for (const pool of ['ap', 'mana']) {
    if (approval.price[pool] > 0) {expectedSource[pool] = tempFirst(pools[pool].current, pools[pool].temp, approval.price[pool]);}
  }
  // P7 requires an explicit operation on every participating actor. For a free remote action,
  // compare-and-set the unchanged AP projection; this is not an inferred price or a debit.
  if (capability === authored.CAPABILITY && !self && !Object.keys(expectedSource).length) {expectedSource.ap = tempFirst(pools.ap.current, pools.ap.temp, 0);}
  const targetPools = actors.resources(target.token, approval.target.kind);
  const hp = approval.spell.kind === 'damage' ? (() => {
    const fromTemp = Math.min(targetPools.hp.temp, amount);
    return { current: Math.max(0, targetPools.hp.current - (amount - fromTemp)), temp: targetPools.hp.temp - fromTemp };
  })() : { current: Math.min(targetPools.hp.max, targetPools.hp.current + amount), temp: targetPools.hp.temp };
  if (self && approval.source.kind === 'creature' && chosen.actualHealing !== hp.current - targetPools.hp.current) fail('approval_mismatch');
  const expected = [{ ref: approval.source, finalResources: self ? { ...expectedSource, hp } : expectedSource,
    ...(approval.classPayment ? { classPayment: { mode: 'spell', domain: approval.classPayment.domain, approvalHash: entry.contentHash } } : {}) }];
  if (!self) {expected.push({ ref: approval.target, finalResources: { hp } });}
  if (command.actors.length !== expected.length) {fail('approval_mismatch');}
  expected.forEach((value, index) => {
    const actual = command.actors[index];
    if (capability === authored.CAPABILITY && (actual.equipmentWear !== undefined || actual.blockingDeclaration !== undefined)) {fail('approval_mismatch');}
    if (hash(actual.ref) !== hash(value.ref) || actual.conditions !== undefined ||
      hash(actual.finalResources || {}) !== hash(value.finalResources) || hash(actual.classPayment || null) !== hash(value.classPayment || null)) {fail('approval_mismatch');}
  });
  return entry;
}
module.exports = { CAPABILITY, DOMAINS, ELEMENTS, PITCHES, validateValue, validatePrice, conserve, publicValue, home, validateEntry, validateApproval, validateCreatureApproval,
  validateRoll, tempFirst, selfState, checkAgainstRoom, checkWindow, get, add, remove, listAll, close, closedCode, closedEntry, pendingFor, consumedReceipt, gmProjection, bindCommand, ownerMember };
