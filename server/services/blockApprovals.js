/** P12B thin slice (frozen contract revision 4 §3): creature hit → owner block roll → one atomic
 * room HP + equipment-wear consequence. Approved creator decision C1/D-E: the item's current
 * authored die is its blocking die and wear track. Every other unresolved branch is a GM ruling.
 * No mitigation engine, prose parsing, reaction, deep storage, id migration or GM override here.
 */
const actors = require('./actorConsequences');
const spellPayments = require('./spellPayments');

const { fail, keys, own, hash } = actors;
const CAPABILITY = 'p12b-block:v1';
const ATTACK_CAPABILITY = 'p12b-attack:v1';
const DEFINITION_ID = 'creature-attack-block';
const DEFINITION_HASH = `${CAPABILITY}/${DEFINITION_ID}`;
const HOME = 'equipmentBlocking';
/** Die ladder shared with the item tools; one wear step moves one place left. */
const LADDER = Object.freeze(['broken', 'd4', 'd6', 'd8', 'd10', 'd12', 'd20']);
const SIZES = Object.freeze({ d4: 4, d6: 6, d8: 8, d10: 10, d12: 12, d20: 20 });
// Technical list bound: one entry per shared equipment slot key (roomAccessService B13), never a player rule.
const SLOTS = Object.freeze(['head', 'neck', 'shoulders', 'back', 'chest', 'shirt', 'tabard', 'wrists', 'mainHand', 'offHand', 'ranged',
  'trinket1', 'trinket2', 'ring1', 'ring2', 'feet', 'legs', 'waist', 'gloves']);
const DAMAGE_TYPES = Object.freeze(['smashing', 'slicing', 'stabbing', 'ember', 'rime', 'storm', 'blight', 'sacred', 'wyrd', 'arcane', 'primal']);
const PHYSICAL = Object.freeze(['smashing', 'slicing', 'stabbing']);
/** GM ruling categories; the first two are required by the recorded facts (D-C, D-D open). */
const MANUAL = Object.freeze(['non-physical', 'critical-shield', 'evasion', 'flat-dr', 'resistance', 'conversion', 'other']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CLOSED_LIMIT = 4096;
const OFFER_LIMIT = 32;
const approvals = new WeakMap();
const closedApprovals = new WeakMap();
const offers = new WeakMap();
const int = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(value) && value >= min && value <= max;
const text = (value, max, min = 1) => typeof value === 'string' && value.length >= min && value.length <= max;
const exact = (value, allowed, code) => {
  try {keys(value, allowed);} catch (_) {fail(code);}
  if (allowed.some(key => !own(value, key))) {fail(code);}
};
const refOk = (ref, kind, code) => { try {actors.validateRef(ref);} catch (_) {fail(code);} if (ref.kind !== kind) {fail(code);} };

// ── Equipment facts ────────────────────────────────────────────────────────
function kindOf(item) {
  if (!item || typeof item !== 'object') {return null;}
  if (String(item.subtype || '').toUpperCase() === 'SHIELD' || item.type === 'shield') {return 'shield';}
  return item.type === 'armor' ? 'armor' : null;
}
function stepDown(die) { const index = LADDER.indexOf(die); return index > 0 ? LADDER[index - 1] : null; }
function holdsDefending(token) {
  return (Array.isArray(token?.state?.conditions) ? token.state.conditions : []).some(record => record?.version === 1 && record.conditionKey === 'defending');
}
/** The shared equipment record (character_updated projection) must still show this piece. */
function sharedMatch(token, piece) {
  const item = token?.character?.equipment?.[piece.slot];
  return !!item && item.id === piece.itemId && kindOf(item) === piece.kind;
}
/** Technical availability (contract §3.4): first entry that is not broken and still in its slot. */
function firstAvailable(token) {
  const declaration = token?.state?.[HOME];
  if (!declaration || declaration.version !== 1 || declaration.mode !== 'block') {fail('no_blocking_piece');}
  const index = declaration.pieces.findIndex(piece => !piece.broken && sharedMatch(token, piece));
  if (index === -1) {fail('no_blocking_piece');}
  return { declaration, piece: declaration.pieces[index], index };
}
/** Pure wear rule (published Laws + approved Defend): armor 1–2, shield 1, never while Defending. */
function deriveWear(kind, beforeDie, face, defending) {
  const wears = !defending && (kind === 'armor' ? face <= 2 : face === 1);
  const afterDie = wears ? stepDown(beforeDie) : beforeDie;
  return { afterDie, broken: afterDie === 'broken' };
}

// ── Owner declaration (own turn) ───────────────────────────────────────────
function validateDeclarationEntry(entry) {
  exact(entry, ['beforeRevision', 'mode', 'pieces'], 'invalid_blocking_declaration');
  if (!int(entry.beforeRevision) || !['block', 'none'].includes(entry.mode) || !Array.isArray(entry.pieces) || entry.pieces.length > SLOTS.length ||
    (entry.mode === 'none') !== (entry.pieces.length === 0)) {fail('invalid_blocking_declaration');}
  const slots = new Set();
  for (const piece of entry.pieces) {
    exact(piece, ['slot', 'itemId', 'name', 'kind', 'currentDie'], 'invalid_blocking_declaration');
    if (!SLOTS.includes(piece.slot) || slots.has(piece.slot) || !text(piece.itemId, 120) || !text(piece.name, 80) ||
      !['armor', 'shield'].includes(piece.kind) || !own(SIZES, piece.currentDie)) {fail('invalid_blocking_declaration');}
    slots.add(piece.slot);
  }
  return entry;
}
/** Server-enforced selection window (contract §3.2). Reads whose turn it is; never changes who
 * may advance turns (combatAuthority / COMBAT_AUTHORITY_ENFORCEMENT are untouched). */
function selectionWindow(room, ref) {
  const combat = room.gameState.combat;
  if (!combat || combat.isActive !== true) {return { outOfCombat: true };}
  const order = Array.isArray(combat.turnOrder) ? combat.turnOrder : [];
  if (order.some(entry => !entry?.actorRef && entry?.tokenId === ref.tokenId)) {fail('combat_binding_required');}
  const mine = order.map((entry, index) => ({ entry, index })).filter(({ entry }) => entry?.actorRef && hash(entry.actorRef) === hash(ref));
  if (!mine.length) {return { outOfCombat: true };}
  if (mine.length > 1) {fail('combat_turn_ambiguous');}
  if (combat.currentTurnIndex !== mine[0].index) {fail('not_your_turn');}
  return { round: int(combat.round) ? combat.round : 0, turnIndex: mine[0].index, turnStartTime: Number.isFinite(combat.currentTurnStartTime) ? combat.currentTurnStartTime : 0 };
}
function applyDeclaration(room, token, ref, entry) {
  const prior = token.state[HOME] || null;
  if ((prior?.revision || 0) !== entry.beforeRevision) {fail('stale_blocking_state');}
  if (pendingFor(room, ref.ownerUid, ref.characterId)) {fail('blocking_pending');}
  for (const piece of entry.pieces) {
    const item = token.character?.equipment?.[piece.slot];
    if (!sharedMatch(token, piece) || (typeof item.name === 'string' && item.name !== piece.name)) {fail('equipment_projection_mismatch');}
  }
  const declaredDuring = selectionWindow(room, ref);
  if (!Number.isSafeInteger(entry.beforeRevision + 1)) {fail('revision_exhausted');}
  // Owner-declared dice are visible to the GM when they rise (for example after mending).
  const raised = entry.pieces.filter(piece => {
    const before = prior?.pieces?.find(old => old.slot === piece.slot && old.itemId === piece.itemId);
    return before && LADDER.indexOf(piece.currentDie) > LADDER.indexOf(before.currentDie);
  }).map(piece => piece.slot);
  token.state[HOME] = { version: 1, revision: entry.beforeRevision + 1, mode: entry.mode,
    pieces: entry.pieces.map(piece => ({ ...actors.clone(piece), broken: false })), declaredDuring, raised };
  return { revision: token.state[HOME].revision };
}

// ── GM attack offer and owner block approval ───────────────────────────────
function validateAttack(attack, code = 'invalid_block_offer') {
  exact(attack, ['capability', 'source', 'target', 'sourceRevision', 'ability', 'roll', 'outcome', 'damageType', 'proposedDamage', 'apCost'], code);
  if (attack.capability !== ATTACK_CAPABILITY || !int(attack.sourceRevision)) {fail(code);}
  refOk(attack.source, 'creature', code); refOk(attack.target, 'character', code);
  if (attack.source.roomId !== attack.target.roomId || attack.source.mapId !== attack.target.mapId) {fail(code);}
  exact(attack.ability, ['id', 'name'], code);
  if (!(attack.ability.id === null || text(attack.ability.id, 120)) || !text(attack.ability.name, 80)) {fail(code);}
  exact(attack.roll, ['mode', 'dice', 'faces'], code);
  if (!['digital', 'physical'].includes(attack.roll.mode) || !text(attack.roll.dice, 40) || !/^[0-9dD+\- ]+$/.test(attack.roll.dice) ||
    !Array.isArray(attack.roll.faces) || !attack.roll.faces.length || attack.roll.faces.length > 20 || attack.roll.faces.some(face => !int(face, 1, 1000))) {fail(code);}
  if (!['hit', 'critical'].includes(attack.outcome) || !DAMAGE_TYPES.includes(attack.damageType) || !int(attack.proposedDamage, 0, 100000) || !int(attack.apCost, 0, 20)) {fail(code);}
  if (actors.bytes(attack) > 4096) {fail(code);}
  return attack;
}
function offerRegistry(room) {
  let entries = offers.get(room);
  if (!entries) {entries = new Map(); offers.set(room, entries);}
  return entries;
}
/** Offers only make sense when a block roll can apply (critical vs armor: no roll, approved rule). */
function checkOfferTarget(room, attack) {
  const target = actors.locate(room, attack.target);
  const { piece } = firstAvailable(target.token);
  if (attack.outcome === 'critical' && piece.kind === 'armor') {fail('critical_bypasses_armor');}
  return piece;
}
function addOffer(room, commandId, attack) {
  if (typeof commandId !== 'string' || !UUID.test(commandId)) {fail('invalid_block_offer');}
  const attackHash = hash(attack), entries = offerRegistry(room), existing = entries.get(commandId);
  if (existing) {
    if (existing.attackHash !== attackHash) {fail('command_id_conflict');}
    return existing;
  }
  if (entries.size >= OFFER_LIMIT) {fail('offer_capacity');}
  const offer = { commandId, attack: actors.clone(attack), attackHash };
  entries.set(commandId, offer);
  return offer;
}
const getOffer = (room, commandId) => offers.get(room)?.get(commandId) || null;
const removeOffer = (room, commandId) => offers.get(room)?.delete(commandId) || false;
const listOffers = room => Array.from(offers.get(room)?.values() || []);
function validateApproval(approval) {
  const code = 'invalid_block_approval';
  exact(approval, ['version', 'roomId', 'approvalId', 'actionEpoch', 'baseCommitSequence', 'source', 'target', 'attack', 'blocking', 'roll'], code);
  if (approval.version !== 1 || !text(approval.roomId, 200) || typeof approval.approvalId !== 'string' || !UUID.test(approval.approvalId) ||
    !text(approval.actionEpoch, 200) || !int(approval.baseCommitSequence) || actors.bytes(approval) > 4096) {fail(code);}
  refOk(approval.source, 'creature', code); refOk(approval.target, 'character', code);
  if (approval.source.roomId !== approval.roomId || approval.target.roomId !== approval.roomId || approval.source.mapId !== approval.target.mapId) {fail(code);}
  exact(approval.attack, ['commandId', 'attackHash'], code);
  if (typeof approval.attack.commandId !== 'string' || !UUID.test(approval.attack.commandId) || !/^[0-9a-f]{64}$/.test(approval.attack.attackHash || '')) {fail(code);}
  exact(approval.blocking, ['revision', 'slot', 'itemId', 'die'], code);
  if (!int(approval.blocking.revision, 1) || !SLOTS.includes(approval.blocking.slot) || !text(approval.blocking.itemId, 120) || !own(SIZES, approval.blocking.die)) {fail(code);}
  exact(approval.roll, ['mode', 'faces'], code);
  if (!['digital', 'physical'].includes(approval.roll.mode) || !Array.isArray(approval.roll.faces) || approval.roll.faces.length !== 1 ||
    !int(approval.roll.faces[0], 1, SIZES[approval.blocking.die])) {fail(code);}
  return approval;
}
/** The approval names the current first available piece at the current declaration revision. */
function checkPiece(token, blocking) {
  const { declaration, piece } = firstAvailable(token);
  if (declaration.revision !== blocking.revision) {fail('stale_blocking_state');}
  if (piece.slot !== blocking.slot || piece.itemId !== blocking.itemId || piece.currentDie !== blocking.die) {fail('stale_blocking_state');}
  return { declaration, piece };
}
function checkAgainstRoom(room, approval) {
  const source = actors.locate(room, approval.source);
  const target = actors.locate(room, approval.target);
  const offer = getOffer(room, approval.attack.commandId);
  if (!offer || offer.attackHash !== approval.attack.attackHash) {fail('offer_not_found');}
  if (hash(offer.attack.source) !== hash(approval.source) || hash(offer.attack.target) !== hash(approval.target)) {fail('approval_mismatch');}
  const { piece } = checkPiece(target.token, approval.blocking);
  if (offer.attack.outcome === 'critical' && piece.kind === 'armor') {fail('critical_bypasses_armor');}
  return { source, target, offer };
}
function checkWindow(room, approval) {
  const state = actors.ledger(room);
  if (approval.baseCommitSequence < state.replayFloor) {fail('retry_window_expired');}
  if (approval.baseCommitSequence > state.commitSequence) {fail('invalid_block_approval');}
}
function registry(room) {
  let entries = approvals.get(room);
  if (!entries) {entries = new Map(); approvals.set(room, entries);}
  return entries;
}
function get(room, approvalId) { return approvals.get(room)?.get(approvalId) || null; }
function pendingFor(room, ownerUid, characterId) {
  if (!room || !ownerUid) {return null;}
  return Array.from(approvals.get(room)?.values() || []).find(entry => entry.approval.target.ownerUid === ownerUid &&
    (characterId === undefined || entry.approval.target.characterId === characterId)) || null;
}
function add(room, entry) {
  const entries = registry(room);
  if (pendingFor(room, entry.approval.target.ownerUid, entry.approval.target.characterId)) {fail('approval_pending');}
  if ((closedApprovals.get(room)?.size || 0) + entries.size >= CLOSED_LIMIT) {fail('approval_capacity');}
  if (entries.size >= 32 || actors.bytes(Array.from(entries.values()).map(value => value.approval).concat(entry.approval)) > 512 * 1024) {fail('approval_capacity');}
  entries.set(entry.approval.approvalId, entry);
  return entry;
}
function listAll(room) { return Array.from(approvals.get(room)?.values() || []); }
function close(room, approvalId, code) {
  let closed = closedApprovals.get(room);
  if (!closed) {closed = new Map(); closedApprovals.set(room, closed);}
  closed.set(approvalId, code);
  return approvals.get(room)?.delete(approvalId) || false;
}
function closedCode(room, approvalId) { return closedApprovals.get(room)?.get(approvalId) || null; }
const isBlockReceipt = receipt => receipt?.authorization?.kind === 'owner-approval-gm' && typeof receipt.adjudication?.definitionVersionOrHash === 'string' &&
  receipt.adjudication.definitionVersionOrHash.startsWith(`${CAPABILITY}/`);
function consumedReceipt(room, approvalId) {
  return actors.ledger(room).receipts.find(receipt => isBlockReceipt(receipt) && receipt.authorization.proposalId === approvalId) || null;
}
/** Approval IDs share one space with P9 and P12A: refuse any reuse. */
function foreignId(room, approvalId) {
  const strikes = require('./strikeApprovals');
  return !!spellPayments.get(room, approvalId) || !!spellPayments.closedCode(room, approvalId) || !!strikes.get(room, approvalId) ||
    !!strikes.closedCode(room, approvalId) || actors.ledger(room).receipts.some(receipt => !isBlockReceipt(receipt) && receipt.authorization?.proposalId === approvalId);
}

// ── GM consequence ─────────────────────────────────────────────────────────
function validateChosen(chosenText, approval, target) {
  const bad = 'invalid_block_adjudication';
  if (typeof chosenText !== 'string' || Buffer.byteLength(chosenText, 'utf8') > 8192) {fail(bad);}
  let chosen;
  try {chosen = JSON.parse(chosenText);} catch (_) {fail(bad);}
  exact(chosen, ['capability', 'approvalId', 'gmConfirmed', 'names', 'attack', 'block', 'afterBlock', 'manual'], bad);
  if (chosen.capability !== CAPABILITY || chosen.approvalId !== approval.approvalId || chosen.gmConfirmed !== true) {fail('approval_mismatch');}
  exact(chosen.names, ['source', 'target'], bad);
  if (!text(chosen.names.source, 60) || !text(chosen.names.target, 60)) {fail(bad);}
  validateAttack(chosen.attack, bad);
  // Exactly the attack the owner approved a roll for (contract §3.4).
  if (hash(chosen.attack) !== approval.attack.attackHash || hash(chosen.attack.source) !== hash(approval.source) || hash(chosen.attack.target) !== hash(approval.target)) {fail('approval_mismatch');}
  const { piece } = checkPiece(target.token, approval.blocking);
  const block = chosen.block, face = approval.roll.faces[0], defending = holdsDefending(target.token);
  exact(block, ['slot', 'name', 'kind', 'die', 'face', 'defending', 'reduction'], bad);
  if (block.slot !== piece.slot || block.name !== piece.name || block.kind !== piece.kind || block.die !== piece.currentDie || block.face !== face ||
    block.defending !== defending || block.reduction !== face * (defending ? 2 : 1)) {fail('approval_mismatch');}
  // Approved: criticals go around armor (no roll, no wear). Shields on a critical are D-D: GM ruling.
  if (chosen.attack.outcome === 'critical' && piece.kind === 'armor') {fail('critical_bypasses_armor');}
  if (!Array.isArray(chosen.manual) || chosen.manual.length > MANUAL.length) {fail(bad);}
  const seen = new Set();
  for (const entry of chosen.manual) {
    exact(entry, ['category', 'note'], bad);
    if (!MANUAL.includes(entry.category) || seen.has(entry.category) || !text(entry.note, 300, 0)) {fail(bad);}
    seen.add(entry.category);
  }
  if ((!PHYSICAL.includes(chosen.attack.damageType) && !seen.has('non-physical')) || (chosen.attack.outcome === 'critical' && !seen.has('critical-shield'))) {fail('block_ruling_required');}
  const afterBlock = Math.max(0, chosen.attack.proposedDamage - block.reduction);
  if (chosen.afterBlock !== afterBlock) {fail('approval_mismatch');}
  return { chosen, piece, face, defending, afterBlock };
}
function expectedWear(token, approval) {
  const { declaration, piece } = checkPiece(token, approval.blocking);
  const face = approval.roll.faces[0], defending = holdsDefending(token);
  const { afterDie, broken } = deriveWear(piece.kind, piece.currentDie, face, defending);
  return { declaration, piece, face, defending, entry: { slot: piece.slot, itemId: piece.itemId, blockingRevision: declaration.revision, beforeDie: piece.currentDie, afterDie, broken } };
}
function validateWearEntry(entry) {
  exact(entry, ['slot', 'itemId', 'blockingRevision', 'beforeDie', 'afterDie', 'broken'], 'invalid_equipment_wear');
  if (!SLOTS.includes(entry.slot) || !text(entry.itemId, 120) || !int(entry.blockingRevision, 1) || !own(SIZES, entry.beforeDie) ||
    !LADDER.includes(entry.afterDie) || typeof entry.broken !== 'boolean') {fail('invalid_equipment_wear');}
  return entry;
}
/** Binds a GM command to one pending block approval (contract §3.4 consumption checks). */
function bindCommand(room, player, command, authorization) {
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
  if (!spellPayments.ownerMember(room, approval.target.ownerUid)) {fail('owner_unavailable');}
  if (hash(command.source) !== hash(approval.source) || hash(command.target) !== hash(approval.target)) {fail('approval_mismatch');}
  if (command.commandId !== approval.attack.commandId) {fail('approval_mismatch');}
  const adjudication = command.adjudication || {};
  if (adjudication.definitionId !== DEFINITION_ID || adjudication.definitionVersionOrHash !== DEFINITION_HASH) {fail('approval_mismatch');}
  const source = actors.locate(room, approval.source), target = actors.locate(room, approval.target);
  const { chosen, afterBlock } = validateChosen(adjudication.chosenResult, approval, target);
  const amount = adjudication.finalAmount;
  if (!int(amount, 0, 100000)) {fail('invalid_final_amount');}
  if (typeof adjudication.adjustmentReason !== 'string' || adjudication.adjustmentReason.length > 2000 ||
    (amount !== afterBlock && !adjudication.adjustmentReason.trim())) {fail('adjustment_reason_required');}
  if (command.actors.length !== 2) {fail('approval_mismatch');}
  // The creature changed since the offer: this attack can never be consumed; the owner must roll again.
  // Checked before per-actor revisions, because a GM plan carries the offer's creature revision.
  if (source.contract.revision !== chosen.attack.sourceRevision) {fail('stale_attack');}
  for (const actor of command.actors) {
    if (actors.locate(room, actor.ref).contract.revision !== actor.expectedRevision) {fail('stale_actor_revision');}
  }
  if (command.actors[0].expectedRevision !== chosen.attack.sourceRevision) {fail('approval_mismatch');}
  const sourcePools = actors.resources(source.token, 'creature').ap;
  const ap = spellPayments.tempFirst(sourcePools.current, sourcePools.temp, chosen.attack.apCost);
  const hpPool = actors.resources(target.token, 'character').hp;
  const fromTemp = Math.min(hpPool.temp, amount);
  const hp = { current: Math.max(0, hpPool.current - (amount - fromTemp)), temp: hpPool.temp - fromTemp };
  const wear = expectedWear(target.token, approval).entry;
  const [first, second] = command.actors;
  if (hash(first.ref) !== hash(approval.source) || Object.keys(first).some(key => !['ref', 'expectedRevision', 'finalResources'].includes(key)) ||
    hash(first.finalResources || {}) !== hash({ ap })) {fail('approval_mismatch');}
  if (hash(second.ref) !== hash(approval.target) || Object.keys(second).some(key => !['ref', 'expectedRevision', 'finalResources', 'equipmentWear'].includes(key)) ||
    hash(second.finalResources || {}) !== hash({ hp })) {fail('approval_mismatch');}
  if (hash(second.equipmentWear) !== hash(wear)) {fail('invalid_equipment_wear');}
  return entry;
}
/** Applies the wear entry to the staged clone; recomputed, never trusted (contract §3.5). */
function applyWear(token, ref, entry, approved) {
  if (!approved?.approval || hash(approved.approval.target) !== hash(ref)) {fail('approval_mismatch');}
  const expected = expectedWear(token, approved.approval);
  if (hash(expected.entry) !== hash(entry)) {fail('invalid_equipment_wear');}
  if (!Number.isSafeInteger(expected.declaration.revision + 1)) {fail('revision_exhausted');}
  expected.piece.currentDie = entry.afterDie;
  expected.piece.broken = entry.broken;
  expected.declaration.revision += 1;
  return { slot: entry.slot, itemId: entry.itemId, blockingRevision: entry.blockingRevision, beforeDie: entry.beforeDie, afterDie: entry.afterDie, broken: entry.broken,
    name: expected.piece.name, kind: expected.piece.kind, naturalFace: expected.face, defending: expected.defending };
}
/** Minimal public receipt lines (contract §3.3); no item id, backups or undeclared dice. */
function publicWear(record) {
  if (!record || typeof record !== 'object') {return null;}
  const out = {};
  for (const key of ['slot', 'name', 'kind', 'beforeDie', 'afterDie']) {if (typeof record[key] === 'string') {out[key] = record[key];}}
  for (const key of ['blockingRevision', 'naturalFace']) {if (Number.isSafeInteger(record[key])) {out[key] = record[key];}}
  for (const key of ['broken', 'defending']) {if (typeof record[key] === 'boolean') {out[key] = record[key];}}
  return out;
}
/** Owner/GM-scoped view; never part of the general token projection. */
function scopedView(token) {
  const declaration = token?.state?.[HOME];
  return declaration && declaration.version === 1 ? actors.clone(declaration) : null;
}
const isBlockCommand = command => typeof command?.adjudication?.definitionVersionOrHash === 'string' &&
  command.adjudication.definitionVersionOrHash.startsWith(`${CAPABILITY}/`);
module.exports = { CAPABILITY, ATTACK_CAPABILITY, DEFINITION_ID, DEFINITION_HASH, HOME, LADDER, SIZES, SLOTS, DAMAGE_TYPES, PHYSICAL, MANUAL,
  kindOf, stepDown, holdsDefending, firstAvailable, deriveWear, selectionWindow, validateDeclarationEntry, applyDeclaration, validateAttack,
  checkOfferTarget, addOffer, getOffer, removeOffer, listOffers, validateApproval, checkAgainstRoom, checkWindow, get, add, listAll, close, closedCode, pendingFor,
  consumedReceipt, foreignId, validateChosen, expectedWear, validateWearEntry, bindCommand, applyWear, publicWear, scopedView, isBlockCommand };
