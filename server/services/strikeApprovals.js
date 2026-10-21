/** P12A (frozen contract revision 3a §2.6): owner-approved basic weapon strike, PC → one creature.
 * Strict approval and adjudication schemas plus server-recomputed AP/HP. The owner approves only
 * their own price and recorded rolls; only the GM's direct consequence can consume an approval.
 * No proficiency interpretation, prose parsing, mitigation engine or non-HP/AP effect lives here.
 */
const actors = require('./actorConsequences');
const spellPayments = require('./spellPayments');
const riposte = require('./riposteExecution');

const { fail, keys, own, hash } = actors;
const CAPABILITY = 'p12a-strike:v1';
const DEFINITION_ID = 'basic-weapon-strike';
const DEFINITION_HASH = `${CAPABILITY}/${DEFINITION_ID}`;
const STRIKE_AP = 2;
const RANK_DIE = Object.freeze({ UNTRAINED: 4, NOVICE: 6, TRAINED: 8, APPRENTICE: 10, ADEPT: 12, EXPERT: 20, MASTER: 20 });
const DAMAGE_TYPES = Object.freeze(['smashing', 'slicing', 'stabbing', 'ember', 'rime', 'storm', 'blight', 'sacred', 'wyrd', 'arcane', 'primal']);
const FIXED_TEXT = Object.freeze({
  'proficiency-deferred': 'Proficiency outcome deferred: resolve it at the table and note it in chat.',
  'weapon-critical': 'Critical hit: the weapon-specific condition from Laws › Attacks & Damage (for example Bleed or Stun).',
  'weapon-fumble': 'Natural 1: weapon durability damage and any critical-miss follow-up (Laws).',
  ammunition: 'Ammunition use is not tracked by the VTT.'
});
const NOT_APPLIED_ORDER = Object.freeze(['proficiency-face', 'proficiency-deferred', 'weapon-critical', 'weapon-fumble', 'ammunition']);
const MANUAL_SOURCES = Object.freeze(['library', 'ability', 'condition', 'custom']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CLOSED_LIMIT = 4096;
const approvals = new WeakMap();
const closedApprovals = new WeakMap();
const int = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(value) && value >= min && value <= max;
const text = (value, max, min = 1) => typeof value === 'string' && value.length >= min && value.length <= max;
const refuse = () => fail('invalid_strike_approval');
const bad = () => fail('invalid_strike_adjudication');
const exact = (value, allowed, onFail) => { try {keys(value, allowed);} catch (_) {onFail();} if (allowed.some(key => !own(value, key))) {onFail();} };

/** Weapon-roll outcome and proposed amount (Laws › Combat Basics; modifier on a critical is [Open]). */
function derive(weapon, roll) {
  const faces = roll.faces;
  if (faces[0] === 1) {return { rollOutcome: 'miss', proposed: 0 };}
  if (faces[0] === weapon.die) {return { rollOutcome: 'critical', proposed: faces.reduce((sum, face) => sum + face, 0) };}
  return { rollOutcome: 'hit', proposed: Math.max(0, faces[0] + weapon.modifier) };
}
function validChain(die, faces) {
  if (faces[0] === 1) {return faces.length === 1;}
  for (let i = 0; i < faces.length - 1; i++) {if (faces[i] !== die) {return false;}}
  return faces[faces.length - 1] < die || faces.length === 20;
}
function validRoll(roll, die, maxFaces) {
  exact(roll, ['mode', 'faces'], refuse);
  if (!['digital', 'physical'].includes(roll.mode) || !Array.isArray(roll.faces) || !roll.faces.length || roll.faces.length > maxFaces ||
    roll.faces.some(face => !int(face, 1, die))) {refuse();}
}
function validateApproval(approval) {
  if (riposte.isApproval(approval)) {return riposte.validateApproval(approval);}
  exact(approval, ['version', 'roomId', 'approvalId', 'actionEpoch', 'baseCommitSequence', 'source', 'target', 'weapon', 'roll', 'proficiency', 'price'], refuse);
  if (approval.version !== 1 || !text(approval.roomId, 200) || typeof approval.approvalId !== 'string' || !UUID.test(approval.approvalId) || !text(approval.actionEpoch, 200) ||
    !int(approval.baseCommitSequence) || actors.bytes(approval) > 8192) {refuse();}
  try {actors.validateRef(approval.source); actors.validateRef(approval.target);} catch (_) {refuse();}
  if (approval.source.kind !== 'character' || approval.target.kind !== 'creature' || approval.source.roomId !== approval.roomId ||
    approval.target.roomId !== approval.roomId || approval.target.mapId !== approval.source.mapId) {refuse();}
  const weapon = approval.weapon;
  exact(weapon, ['slot', 'itemId', 'name', 'weaponType', 'typeSource', 'die', 'damageType', 'attribute', 'score', 'modifier'], refuse);
  if (!['mainHand', 'ranged'].includes(weapon.slot) || !(weapon.itemId === null || text(weapon.itemId, 120)) || !text(weapon.name, 80) ||
    typeof weapon.weaponType !== 'string' || !/^[a-z][a-z ]{1,38}$/.test(weapon.weaponType) || !['item', 'owner'].includes(weapon.typeSource) ||
    !int(weapon.die, 2, 100) || typeof weapon.damageType !== 'string' || !/^[a-z]{2,20}$/.test(weapon.damageType) ||
    !['strength', 'agility'].includes(weapon.attribute) || !int(weapon.score, 0, 100) || weapon.modifier !== Math.floor((weapon.score - 10) / 2)) {refuse();}
  if (weapon.itemId === null && (weapon.weaponType !== 'unarmed' || weapon.slot !== 'mainHand' || weapon.die !== 4 || weapon.damageType !== 'smashing')) {refuse();}
  validRoll(approval.roll, weapon.die, 20);
  if (!validChain(weapon.die, approval.roll.faces)) {refuse();}
  const proficiency = approval.proficiency;
  exact(proficiency, ['weaponType', 'rank', 'rankSource', 'die', 'table', 'roll'], refuse);
  if (proficiency.weaponType !== weapon.weaponType || typeof proficiency.rank !== 'string' || !own(RANK_DIE, proficiency.rank) || !['stored', 'quests', 'default'].includes(proficiency.rankSource) ||
    proficiency.die !== RANK_DIE[proficiency.rank] || typeof proficiency.table !== 'string' || !/^[a-z]{2,20}$/.test(proficiency.table)) {refuse();}
  validRoll(proficiency.roll, proficiency.die, 4);
  exact(approval.price, ['ap'], refuse);
  if (approval.price.ap !== STRIKE_AP) {refuse();}
  return approval;
}
/** Current authoritative room state: bound source/target and a temp-first affordable price. */
function checkAgainstRoom(room, approval) {
  actors.assertCanAct(room, approval.source);
  if (riposte.isApproval(approval)) {riposte.approvalCheck(room, approval); return { source: actors.locate(room, approval.source), target: actors.locate(room, approval.target) };}
  const source = actors.locate(room, approval.source);
  const target = actors.locate(room, approval.target);
  if (target.contract.kind !== 'creature') {fail('invalid_strike_approval');}
  const pools = actors.resources(source.token, 'character');
  spellPayments.tempFirst(pools.ap.current, pools.ap.temp, STRIKE_AP);
  return { source, target };
}
function checkWindow(room, approval) {
  const state = actors.ledger(room);
  if (approval.baseCommitSequence < state.replayFloor) {fail('retry_window_expired');}
  if (approval.baseCommitSequence > state.commitSequence) {fail('invalid_strike_approval');}
}
function registry(room) {
  let entries = approvals.get(room);
  if (!entries) {entries = new Map(); approvals.set(room, entries);}
  return entries;
}
function get(room, approvalId) { return approvals.get(room)?.get(approvalId) || null; }
function pendingFor(room, ownerUid, characterId) {
  if (!room || !ownerUid) {return null;}
  return Array.from(approvals.get(room)?.values() || []).find(entry => !riposte.isApproval(entry.approval) && entry.approval.source.ownerUid === ownerUid &&
    (characterId === undefined || entry.approval.source.characterId === characterId)) || null;
}
function add(room, entry) {
  const entries = registry(room);
  if (!riposte.isApproval(entry.approval) && pendingFor(room, entry.approval.source.ownerUid, entry.approval.source.characterId)) {fail('approval_pending');}
  // Reserve one never-evicted tombstone for every pending approval.
  if ((closedApprovals.get(room)?.size || 0) + entries.size >= CLOSED_LIMIT) {fail('approval_capacity');}
  if (entries.size >= 32 || actors.bytes(Array.from(entries.values()).map(value => value.approval).concat(entry.approval)) > 512 * 1024) {fail('approval_capacity');}
  if (riposte.isApproval(entry.approval)) {riposte.attach(room, entry.approval);}
  entries.set(entry.approval.approvalId, entry);
  return entry;
}
function listAll(room) { return Array.from(approvals.get(room)?.values() || []); }
function close(room, approvalId, code) {
  const entry = get(room, approvalId);
  if (riposte.isApproval(entry?.approval)) {riposte.closed(room, entry.approval, code);}
  let closed = closedApprovals.get(room);
  if (!closed) {closed = new Map(); closedApprovals.set(room, closed);}
  closed.set(approvalId, code);
  return approvals.get(room)?.delete(approvalId) || false;
}
function closedCode(room, approvalId) { return closedApprovals.get(room)?.get(approvalId) || null; }
const isStrikeReceipt = receipt => receipt?.authorization?.kind === 'owner-approval-gm' && typeof receipt.adjudication?.definitionVersionOrHash === 'string' &&
  (receipt.adjudication.definitionVersionOrHash.startsWith(`${CAPABILITY}/`) || riposte.isReceipt(receipt));
function consumedReceipt(room, approvalId) {
  return actors.ledger(room).receipts.find(receipt => isStrikeReceipt(receipt) && receipt.authorization.proposalId === approvalId) || null;
}
/** Approval IDs are one space with P9 receipts (authorization.proposalId): refuse any reuse. */
function foreignId(room, approvalId) {
  return !!spellPayments.get(room, approvalId) || !!spellPayments.closedCode(room, approvalId) ||
    actors.ledger(room).receipts.some(receipt => !isStrikeReceipt(receipt) && receipt.authorization?.proposalId === approvalId);
}

// ── GM adjudication (chosenResult) ─────────────────────────────────────────
function afterTier(amount, kind, percent) {
  return kind === 'resistance' ? Math.floor(amount * (100 - percent) / 100) : Math.ceil(amount * (100 + percent) / 100);
}
function damageReductionConditions(token) {
  const records = Array.isArray(token.state?.conditions) ? token.state.conditions : [];
  return records.filter(record => typeof record?.effects?.damageReduction === 'number' && record.effects.damageReduction !== 0);
}
function validateChosen(chosenText, approval, target) {
  if (typeof chosenText !== 'string' || Buffer.byteLength(chosenText, 'utf8') > 8192) {bad();}
  let chosen;
  try {chosen = JSON.parse(chosenText);} catch (_) {bad();}
  exact(chosen, ['capability', 'approvalId', 'gmConfirmed', 'names', 'weapon', 'roll', 'proficiencyRecord', 'rollOutcome', 'proposed', 'proficiency', 'defense', 'notApplied'], bad);
  if (chosen.capability !== CAPABILITY || chosen.approvalId !== approval.approvalId || chosen.gmConfirmed !== true) {fail('approval_mismatch');}
  exact(chosen.names, ['source', 'target'], bad);
  if (!text(chosen.names.source, 60) || !text(chosen.names.target, 60)) {bad();}
  if (hash(chosen.weapon) !== hash(approval.weapon) || hash(chosen.roll) !== hash(approval.roll) || hash(chosen.proficiencyRecord) !== hash(approval.proficiency)) {fail('approval_mismatch');}
  const derived = derive(approval.weapon, approval.roll);
  if (chosen.rollOutcome !== derived.rollOutcome || chosen.proposed !== derived.proposed) {fail('approval_mismatch');}
  // Proficiency: exactly one GM choice; nothing inferred or added here.
  const choice = chosen.proficiency;
  if (!choice || typeof choice !== 'object') {bad();}
  if (choice.kind === 'face') {
    exact(choice, ['kind', 'face', 'text', 'tier'], bad);
    if (!int(choice.face, 1, 20) || !text(choice.text, 400) || !text(choice.tier, 60)) {bad();}
  } else if (choice.kind === 'none') {
    exact(choice, ['kind', 'reason'], bad);
    if (!text(choice.reason, 300) || !choice.reason.trim()) {bad();}
  } else if (choice.kind === 'deferred') {
    exact(choice, ['kind'], bad);
  } else {bad();}
  // Defense: at most one automated step, verified arithmetic; GM-ruled items as categories only.
  const defense = chosen.defense;
  exact(defense, ['damageType', 'automated', 'afterDefense', 'manual', 'ruling'], bad);
  if (defense.damageType !== approval.weapon.damageType || !Array.isArray(defense.manual) || defense.manual.length > 8 ||
    defense.manual.some(source => !MANUAL_SOURCES.includes(source)) || !int(defense.afterDefense, 0, 10000000)) {bad();}
  let expected = derived.proposed;
  const step = defense.automated;
  if (step !== null) {
    if (!step || typeof step !== 'object' || derived.rollOutcome === 'miss') {fail('approval_mismatch');}
    if (step.kind === 'resistance' || step.kind === 'vulnerability') {
      exact(step, ['kind', 'percent'], bad);
      if (![25, 50, 100].includes(step.percent) || !DAMAGE_TYPES.includes(approval.weapon.damageType)) {fail('approval_mismatch');}
      expected = afterTier(expected, step.kind, step.percent);
    } else if (step.kind === 'flatDr') {
      exact(step, ['kind', 'amount', 'recordId'], bad);
      if (!int(step.amount, 1, 1000) || !text(step.recordId, 200)) {bad();}
      const reductions = damageReductionConditions(target.token);
      if (derived.rollOutcome === 'critical' || reductions.length !== 1 || (reductions[0].recordId || reductions[0].id) !== step.recordId ||
        reductions[0].effects.damageReduction !== step.amount) {fail('approval_mismatch');}
      expected = Math.max(0, expected - step.amount);
    } else {bad();}
  }
  if (defense.afterDefense !== expected) {fail('approval_mismatch');}
  if (defense.ruling !== null) {
    exact(defense.ruling, ['verdict', 'note'], bad);
    if (!['not-applicable', 'applied-in-final'].includes(defense.ruling.verdict) || !text(defense.ruling.note, 300, 0)) {bad();}
  }
  if ((defense.ruling !== null) !== (defense.manual.length > 0)) {fail('defense_ruling_required');}
  if (derived.rollOutcome === 'miss' && (defense.manual.length || defense.ruling !== null)) {fail('approval_mismatch');}
  // Not applied by the VTT: exactly the entries the recorded data requires, canonical order.
  if (!Array.isArray(chosen.notApplied) || chosen.notApplied.length > 5) {bad();}
  const required = [];
  if (choice.kind === 'face') {required.push({ source: 'proficiency-face', text: `Face ${choice.face} (${approval.proficiency.table})` });}
  if (choice.kind === 'deferred') {required.push({ source: 'proficiency-deferred', text: FIXED_TEXT['proficiency-deferred'] });}
  if (derived.rollOutcome === 'critical') {required.push({ source: 'weapon-critical', text: FIXED_TEXT['weapon-critical'] });}
  if (derived.rollOutcome === 'miss') {required.push({ source: 'weapon-fumble', text: FIXED_TEXT['weapon-fumble'] });}
  if (approval.weapon.slot === 'ranged') {required.push({ source: 'ammunition', text: FIXED_TEXT.ammunition });}
  for (const entry of chosen.notApplied) {exact(entry, ['source', 'text'], bad); if (!text(entry.text, 160)) {bad();}}
  if (hash(chosen.notApplied) !== hash(required)) {fail('not_applied_mismatch');}
  return { chosen, derived, afterDefense: expected };
}
/** Binds a GM command to one pending strike approval (contract §2.6 GM command 1–12). */
function bindCommand(room, player, command, authorization) {
  if (riposte.isCommand(command)) {
    const entry = get(room, command.approval?.approvalId);
    if (!riposte.isApproval(entry?.approval)) {fail('approval_mismatch');}
    return riposte.bind(room, player, command, authorization, entry);
  }
  if (!player.isGM) {fail('forbidden');}
  if (authorization?.kind !== 'gm') {fail('approval_requires_gm');}
  keys(command.approval, ['approvalId', 'contentHash']);
  const entry = get(room, command.approval.approvalId);
  if (!entry) {
    const closed = closedCode(room, command.approval.approvalId);
    fail(consumedReceipt(room, command.approval.approvalId) ? 'approval_consumed' : closed ? `approval_${closed}` : 'outcome_unknown');
  }
  if (entry.contentHash !== command.approval.contentHash) {fail('command_id_conflict');}
  const { approval } = entry;
  if (!spellPayments.ownerMember(room, approval.source.ownerUid)) {fail('owner_unavailable');}
  if (hash(command.source) !== hash(approval.source) || hash(command.target) !== hash(approval.target)) {fail('approval_mismatch');}
  const adjudication = command.adjudication || {};
  if (adjudication.definitionId !== DEFINITION_ID || adjudication.definitionVersionOrHash !== DEFINITION_HASH) {fail('approval_mismatch');}
  const source = actors.locate(room, approval.source), target = actors.locate(room, approval.target);
  const { derived, afterDefense } = validateChosen(adjudication.chosenResult, approval, target);
  const amount = adjudication.finalAmount;
  if (!int(amount, 0, 100000)) {fail('invalid_final_amount');}
  if (derived.rollOutcome === 'miss' && amount !== 0) {fail('miss_requires_zero');}
  if (typeof adjudication.adjustmentReason !== 'string' || adjudication.adjustmentReason.length > 2000 ||
    (amount !== afterDefense && !adjudication.adjustmentReason.trim())) {fail('adjustment_reason_required');}
  for (const actor of command.actors) {
    if (actors.locate(room, actor.ref).contract.revision !== actor.expectedRevision) {fail('stale_actor_revision');}
  }
  const pools = actors.resources(source.token, 'character');
  const ap = spellPayments.tempFirst(pools.ap.current, pools.ap.temp, STRIKE_AP);
  const hpPool = actors.resources(target.token, 'creature').hp;
  const fromTemp = Math.min(hpPool.temp, amount);
  const hp = { current: Math.max(0, hpPool.current - (amount - fromTemp)), temp: hpPool.temp - fromTemp };
  const expected = [{ ref: approval.source, finalResources: { ap } }, { ref: approval.target, finalResources: { hp } }];
  if (command.actors.length !== 2) {fail('approval_mismatch');}
  expected.forEach((value, index) => {
    const actual = command.actors[index];
    if (hash(actual.ref) !== hash(value.ref) || actual.conditions !== undefined || actual.classPayment !== undefined ||
      hash(actual.finalResources || {}) !== hash(value.finalResources)) {fail('approval_mismatch');}
  });
  return entry;
}
const isStrikeCommand = command => riposte.isCommand(command) || (typeof command?.adjudication?.definitionVersionOrHash === 'string' &&
  command.adjudication.definitionVersionOrHash.startsWith(`${CAPABILITY}/`));
module.exports = { CAPABILITY, DEFINITION_ID, DEFINITION_HASH, STRIKE_AP, RANK_DIE, DAMAGE_TYPES, FIXED_TEXT, NOT_APPLIED_ORDER, MANUAL_SOURCES,
  derive, validChain, validateApproval, validateChosen, checkAgainstRoom, checkWindow, get, add, listAll, close, closedCode, pendingFor, consumedReceipt,
  foreignId, bindCommand, isStrikeCommand, afterTier, damageReductionConditions };
