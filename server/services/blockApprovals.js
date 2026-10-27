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
/** P12B-r1 (contract §3.9 R4): closed offers keep a tombstone so the same attack can never be re-rolled. */
const closedOffers = new WeakMap();
const CLOSED_OFFER_LIMIT = 4096;
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
  return require('../shared/services/sharedConditionProfile').holdsDefending(token);
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
  const wears = !require('../shared/services/sharedConditionProfile').preventsBlockingWear(defending) && (kind === 'armor' ? face <= 2 : face === 1);
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
  exact(attack, ['capability', 'source', 'target', 'sourceRevision', 'ability', 'roll', 'outcome', 'damageType', 'proposedDamage', 'apCost', ...(own(attack || {}, 'authored') ? ['authored'] : [])], code);
  if (attack.capability !== ATTACK_CAPABILITY || !int(attack.sourceRevision)) {fail(code);}
  refOk(attack.source, 'creature', code); refOk(attack.target, 'character', code);
  if (attack.source.roomId !== attack.target.roomId || attack.source.mapId !== attack.target.mapId) {fail(code);}
  exact(attack.ability, ['id', 'name'], code);
  if (!(attack.ability.id === null || text(attack.ability.id, 120)) || !text(attack.ability.name, 80)) {fail(code);}
  if (String(attack.ability.id || '').startsWith('authored:') && !attack.authored) fail('authored_reference_required');
  exact(attack.roll, ['mode', 'dice', 'faces'], code);
  if (!['digital', 'physical'].includes(attack.roll.mode) || !text(attack.roll.dice, 40) || !/^[0-9dD+\- ]+$/.test(attack.roll.dice) ||
    !Array.isArray(attack.roll.faces) || !attack.roll.faces.length || attack.roll.faces.length > (attack.authored ? 50 : 20) || attack.roll.faces.some(face => !int(face, 1, 1000))) {fail(code);}
  if (!['hit', 'critical'].includes(attack.outcome) || !(DAMAGE_TYPES.includes(attack.damageType) || attack.authored?.attempt?.spell?.kind === 'healing' && attack.damageType === 'healing') || !int(attack.proposedDamage, 0, 100000) || !int(attack.apCost, 0, attack.authored ? 100 : 20)) {fail(code);}
  if (attack.authored) {
    const a = attack.authored;
    exact(a, ['attempt', 'targetRevision', 'blockApplicable', 'ruling', 'targeting'], code);
    spellPayments.validateCreatureApproval(a.attempt, true);
    if (!int(a.targetRevision) || typeof a.blockApplicable !== 'boolean' || !text(a.ruling, 300) || !a.ruling.trim() ||
      hash(a.attempt.source) !== hash(attack.source) || hash(a.attempt.target) !== hash(attack.target) ||
      attack.ability.id !== a.attempt.spell.definitionId || attack.ability.name !== a.attempt.spell.name || attack.apCost !== a.attempt.price.ap ||
      hash(attack.roll) !== hash({ mode: a.attempt.roll.mode, dice: a.attempt.roll.reading, faces: a.attempt.roll.dice.flatMap(g => g.faces) }) ||
      (a.attempt.spell.kind === 'healing' ? a.blockApplicable || attack.damageType !== 'healing' : attack.damageType !== a.attempt.spell.damageTypes[0])) fail(code);
  }
  if (actors.bytes(attack) > (attack.authored ? 32768 : 4096)) {fail(code);}
  return attack;
}
/** A5 uses A4 proof without admitting a PC target to A4's direct, consent-free handler. */
function checkAuthored(room, attack) {
  if (!attack.authored) return;
  const a = attack.authored.attempt;
  if (a.actionEpoch !== actors.epoch(room)) fail('outcome_unknown');
  spellPayments.checkWindow(room, a);
  const entry = require('./installedAuthoredAbilities').checkApproval(room, a, true);
  if (hash(entry.canonicalDefinition.targeting) !== hash(attack.authored.targeting)) fail('authored_target_mismatch');
  actors.assertCanAct(room, a.source);
  const source = actors.locate(room, a.source), target = actors.locate(room, a.target);
  if (target.token.ownerUserId !== a.target.ownerUid || !spellPayments.ownerMember(room, a.target.ownerUid)) fail('owner_unavailable');
  const pools = actors.resources(source.token, 'creature');
  for (const p of ['ap', 'mana']) if (a.price[p] > 0 || p === 'ap') {
    const pool = pools[p];
    if (![pool.current, pool.temp, pool.max].every(v => Number.isFinite(v) && v >= 0) || pool.current > pool.max) fail('invalid_resources');
    spellPayments.tempFirst(pool.current, pool.temp, a.price[p]);
  }
  const hp = actors.resources(target.token, 'character').hp;
  if (![hp.current, hp.temp, hp.max].every(v => Number.isFinite(v) && v >= 0) || hp.current > hp.max) fail('invalid_resources');
}
function offerRegistry(room) {
  let entries = offers.get(room);
  if (!entries) {entries = new Map(); offers.set(room, entries);}
  return entries;
}
/** Offers only make sense when a block roll can apply (critical vs armor: no roll, approved rule). */
function checkOfferTarget(room, attack) {
  checkAuthored(room, attack);
  const target = actors.locate(room, attack.target);
  if (attack.authored) return null; // Owner may explicitly accept without blocking; no automatic choice.
  const { piece } = firstAvailable(target.token);
  if (attack.outcome === 'critical' && piece.kind === 'armor') {fail('critical_bypasses_armor');}
  return piece;
}
/** Server-only baseline of the source creature at offer time (contract §3.9): never hashed or sent to players. */
function sourceBaseline(room, ref) {
  const source = actors.locate(room, ref);
  const resources = actors.resources(source.token, 'creature');
  return { revision: source.contract.revision, commitSequence: actors.ledger(room).commitSequence,
    resources: actors.clone(resources), conditionsHash: hash(Array.isArray(source.token.state?.conditions) ? source.token.state.conditions : []) };
}
const closedOfferRegistry = room => {
  let entries = closedOffers.get(room);
  if (!entries) {entries = new Map(); closedOffers.set(room, entries);}
  return entries;
};
const closedOffer = (room, commandId) => closedOffers.get(room)?.get(commandId) || null;
function addOffer(room, commandId, attack, baseline = null) {
  if (typeof commandId !== 'string' || !UUID.test(commandId)) {fail('invalid_block_offer');}
  if (attack.authored && commandId !== attack.authored.attempt.approvalId) fail('approval_mismatch');
  const attackHash = hash(attack), entries = offerRegistry(room), existing = entries.get(commandId);
  if (existing) {
    if (existing.attackHash !== attackHash) {fail('command_id_conflict');}
    return existing;
  }
  if (closedOffer(room, commandId)) {fail('offer_closed');}
  if (entries.size >= OFFER_LIMIT || entries.size + closedOfferRegistry(room).size >= CLOSED_OFFER_LIMIT) {fail('offer_capacity');}
  const offer = { commandId, attack: actors.clone(attack), attackHash, baseline: baseline ? actors.clone(baseline) : null };
  entries.set(commandId, offer);
  return offer;
}
const getOffer = (room, commandId) => offers.get(room)?.get(commandId) || null;
const removeOffer = (room, commandId) => offers.get(room)?.delete(commandId) || false;
const listOffers = room => Array.from(offers.get(room)?.values() || []);
/** Closes an offer for good and keeps its recorded outcome (§3.9 R4). Idempotent; returns the tombstone. */
function closeOffer(room, commandId, code, approval = null) {
  const prior = closedOffer(room, commandId);
  if (prior) {return prior;}
  const offer = getOffer(room, commandId);
  if (!offer) {return null;}
  removeOffer(room, commandId);
  const { attack } = offer;
  const tombstone = { commandId, code, closedAt: Date.now(), source: actors.clone(attack.source), target: actors.clone(attack.target),
    ability: actors.clone(attack.ability), attackRoll: actors.clone(attack.roll), outcome: attack.outcome, damageType: attack.damageType, proposedDamage: attack.proposedDamage,
    block: approval?.blocking ? { approvalId: approval.approvalId, slot: approval.blocking.slot, die: approval.blocking.die, face: approval.roll.faces[0], mode: approval.roll.mode } : null };
  closedOfferRegistry(room).set(commandId, tombstone);
  return tombstone;
}
/** Scope first, then cap (review finding 2): voids/withdrawals are kept visible ahead of consumed attacks. */
function listClosedOffers(room, visible = () => true, limit = 32) {
  const scoped = Array.from(closedOffers.get(room)?.values() || []).filter(visible);
  const closedEarly = scoped.filter(value => value.code !== 'consumed').slice(-limit), consumed = scoped.filter(value => value.code === 'consumed').slice(-8);
  return [...closedEarly, ...consumed].sort((a, b) => a.closedAt - b.closedAt).map(value => actors.clone(value));
}
function validateApproval(approval) {
  const code = 'invalid_block_approval';
  exact(approval, ['version', 'roomId', 'approvalId', 'actionEpoch', 'baseCommitSequence', 'source', 'target', 'attack', 'blocking', 'roll'], code);
  if (approval.version !== 1 || !text(approval.roomId, 200) || typeof approval.approvalId !== 'string' || !UUID.test(approval.approvalId) ||
    !text(approval.actionEpoch, 200) || !int(approval.baseCommitSequence) || actors.bytes(approval) > 4096) {fail(code);}
  refOk(approval.source, 'creature', code); refOk(approval.target, 'character', code);
  if (approval.source.roomId !== approval.roomId || approval.target.roomId !== approval.roomId || approval.source.mapId !== approval.target.mapId) {fail(code);}
  exact(approval.attack, ['commandId', 'attackHash'], code);
  if (typeof approval.attack.commandId !== 'string' || !UUID.test(approval.attack.commandId) || !/^[0-9a-f]{64}$/.test(approval.attack.attackHash || '')) {fail(code);}
  if (approval.blocking === null && approval.roll === null) return approval; // Only an A5 offer may consume this shape.
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
  if (!offer && closedOffer(room, approval.attack.commandId)) {fail('offer_closed');}
  if (!offer || offer.attackHash !== approval.attack.attackHash) {fail('offer_not_found');}
  if (hash(offer.attack.source) !== hash(approval.source) || hash(offer.attack.target) !== hash(approval.target)) {fail('approval_mismatch');}
  checkAuthored(room, offer.attack);
  if (offer.attack.authored) {
    if (!approval.blocking) return { source, target, offer };
    if (!offer.attack.authored.blockApplicable || offer.attack.authored.attempt.spell.kind !== 'damage') fail('block_not_applicable');
  } else if (!approval.blocking) fail('invalid_block_approval');
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
  const required = ['capability', 'approvalId', 'gmConfirmed', 'names', 'attack', 'block', 'afterBlock', 'manual'];
  exact(chosen, [...required, ...(own(chosen || {}, 'revalidation') ? ['revalidation'] : []), ...(own(chosen || {}, 'targetRevalidation') ? ['targetRevalidation'] : [])], bad);
  if (own(chosen, 'targetRevalidation')) {
    exact(chosen.targetRevalidation, ['fromRevision', 'toRevision', 'reason'], bad);
    if (!int(chosen.targetRevalidation.fromRevision) || !int(chosen.targetRevalidation.toRevision) || !text(chosen.targetRevalidation.reason, 300) || !chosen.targetRevalidation.reason.trim()) fail(bad);
  }
  if (own(chosen, 'revalidation')) {
    exact(chosen.revalidation, ['fromRevision', 'toRevision', 'reason'], bad);
    if (!int(chosen.revalidation.fromRevision) || !int(chosen.revalidation.toRevision) || !text(chosen.revalidation.reason, 300) || !chosen.revalidation.reason.trim()) {fail(bad);}
  }
  if (chosen.capability !== CAPABILITY || chosen.approvalId !== approval.approvalId || chosen.gmConfirmed !== true) {fail('approval_mismatch');}
  exact(chosen.names, ['source', 'target'], bad);
  if (!text(chosen.names.source, 60) || !text(chosen.names.target, 60)) {fail(bad);}
  validateAttack(chosen.attack, bad);
  // Exactly the attack the owner approved a roll for (contract §3.4).
  if (hash(chosen.attack) !== approval.attack.attackHash || hash(chosen.attack.source) !== hash(approval.source) || hash(chosen.attack.target) !== hash(approval.target)) {fail('approval_mismatch');}
  if (!approval.blocking) {
    if (!chosen.attack.authored || chosen.block !== null || chosen.afterBlock !== chosen.attack.proposedDamage || !Array.isArray(chosen.manual) || chosen.manual.length) fail(bad);
    return { chosen, afterBlock: chosen.afterBlock };
  }
  const { piece } = checkPiece(target.token, approval.blocking);
  const block = chosen.block, face = approval.roll.faces[0], defending = holdsDefending(target.token);
  exact(block, ['slot', 'name', 'kind', 'die', 'face', 'defending', 'reduction'], bad);
  if (block.slot !== piece.slot || block.name !== piece.name || block.kind !== piece.kind || block.die !== piece.currentDie || block.face !== face ||
    block.defending !== defending || block.reduction !== require('../shared/services/sharedConditionProfile').blockingReduction(face, defending)) {fail('approval_mismatch');}
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
/** §3.9 R3: the recorded block (revision, piece, die) must still be the current first available piece. */
function checkRecordedPiece(token, approval) {
  if (!approval.blocking) return;
  const recorded = approval.blocking;
  const declaration = token?.state?.[HOME];
  const piece = declaration?.version === 1 && Array.isArray(declaration.pieces) ? declaration.pieces.find(entry => entry.slot === recorded.slot && entry.itemId === recorded.itemId) : null;
  const details = { recorded: { revision: recorded.revision, slot: recorded.slot, itemId: recorded.itemId, die: recorded.die, face: approval.roll.faces[0] }, current: null };
  const raise = code => { const error = new Error(code); error.code = code; error.details = details; throw error; };
  if (!piece || piece.broken || !sharedMatch(token, piece)) {raise('block_piece_unavailable');}
  details.current = { revision: declaration.revision, slot: piece.slot, itemId: piece.itemId, die: piece.currentDie };
  let first = null;
  try {first = firstAvailable(token).piece;} catch (_) {raise('block_piece_unavailable');}
  if (declaration.revision !== recorded.revision || piece.currentDie !== recorded.die || first !== piece) {raise('block_revalidation_required');}
}
const resourcesEqual = (a, b) => ['current', 'temp', 'max'].every(key => a?.[key] === b?.[key]);
/** §3.9 R1: proves every change to the creature since the offer is a sibling attack's AP payment. */
function explainSourceChange(room, offer, attack, source) {
  const currentResources = actors.resources(source.token, 'creature');
  const currentConditions = hash(Array.isArray(source.token.state?.conditions) ? source.token.state.conditions : []);
  const baseline = offer?.baseline;
  const changes = baseline ? {
    hp: { before: baseline.resources.hp, now: currentResources.hp }, mana: { before: baseline.resources.mana, now: currentResources.mana },
    ap: { before: baseline.resources.ap, now: currentResources.ap }, conditionsChanged: baseline.conditionsHash !== currentConditions } : null;
  const no = reason => ({ ok: false, reason, changes });
  if (!baseline || baseline.revision !== attack.sourceRevision) {return no('history_unavailable');}
  const state = actors.ledger(room);
  if (baseline.commitSequence < state.replayFloor) {return no('history_unavailable');}
  let revision = baseline.revision, pools = actors.clone(baseline.resources);
  const sourceKey = hash(attack.source);
  for (const receipt of state.receipts) {
    if (!(receipt.commitSequence > baseline.commitSequence)) {continue;}
    const entry = (receipt.actors || []).find(actor => hash(actor.ref) === sourceKey);
    if (!entry) {continue;}
    if (entry.beforeRevision !== revision) {return no('history_unavailable');}
    const adjudication = receipt.adjudication || {};
    if (adjudication.definitionId !== DEFINITION_ID || adjudication.definitionVersionOrHash !== DEFINITION_HASH || receipt.authorization?.kind !== 'owner-approval-gm' ||
      !receipt.source || hash(receipt.source) !== sourceKey) {return no('unexplained_change');}
    let sibling;
    try {sibling = JSON.parse(adjudication.chosenResult);} catch (_) {return no('unexplained_change');}
    if (!sibling?.attack || hash(sibling.attack.source) !== sourceKey || !int(sibling.attack.apCost, 0, 20)) {return no('unexplained_change');}
    if (entry.classPayment || entry.blocking || entry.equipmentWear || hash(entry.conditions || []) !== baseline.conditionsHash) {return no('unexplained_change');}
    const after = entry.finalResources || {};
    if (!resourcesEqual(after.hp, pools.hp) || !resourcesEqual(after.mana, pools.mana) || after.ap?.max !== pools.ap.max) {return no('unexplained_change');}
    let paid;
    try {paid = spellPayments.tempFirst(pools.ap.current, pools.ap.temp, sibling.attack.apCost);} catch (_) {return no('unexplained_change');}
    if (after.ap.current !== paid.current || after.ap.temp !== paid.temp) {return no('unexplained_change');}
    pools = actors.clone(after);
    revision = entry.afterRevision;
  }
  if (revision !== source.contract.revision || currentConditions !== baseline.conditionsHash ||
    !['hp', 'mana', 'ap'].every(pool => resourcesEqual(currentResources[pool], pools[pool]))) {return no('unexplained_change');}
  return { ok: true, changes };
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
  // §3.9 R3: the recorded face belongs to the recorded piece and die; a changed piece needs a GM ruling.
  checkRecordedPiece(target.token, approval);
  const { chosen, afterBlock } = validateChosen(adjudication.chosenResult, approval, target);
  checkAgainstRoom(room, approval);
  if (chosen.attack.authored) {
    const from = chosen.attack.authored.targetRevision, to = target.contract.revision;
    if (from !== to && !chosen.targetRevalidation) fail('target_revalidation_required');
    if (chosen.targetRevalidation && (from === to || chosen.targetRevalidation.fromRevision !== from || chosen.targetRevalidation.toRevision !== to)) fail('approval_mismatch');
  }
  const amount = adjudication.finalAmount;
  if (!int(amount, 0, 100000)) {fail('invalid_final_amount');}
  if (chosen.attack.authored?.attempt.spell.kind === 'healing' && amount !== chosen.attack.proposedDamage) fail('owner_reapproval_required');
  if (typeof adjudication.adjustmentReason !== 'string' || adjudication.adjustmentReason.length > 2000 ||
    (amount !== afterBlock && !adjudication.adjustmentReason.trim())) {fail('adjustment_reason_required');}
  if (command.actors.length !== 2) {fail('approval_mismatch');}
  // §3.9 R1/R2: a changed creature never discards the recorded rolls. Proven sibling AP payments carry
  // forward; anything else needs the GM's explicit revalidation. The approval stays pending either way.
  const current = source.contract.revision;
  if (current === chosen.attack.sourceRevision) {
    if (own(chosen, 'revalidation')) {fail('approval_mismatch');}
  } else {
    const explained = explainSourceChange(room, getOffer(room, approval.attack.commandId), chosen.attack, source);
    if (explained.ok) {
      if (own(chosen, 'revalidation') && (!chosen.attack.authored || chosen.revalidation.fromRevision !== chosen.attack.sourceRevision || chosen.revalidation.toRevision !== current)) {fail('approval_mismatch');}
    } else if (!own(chosen, 'revalidation')) {
      const error = new Error('attack_revalidation_required'); error.code = 'attack_revalidation_required';
      error.details = { fromRevision: chosen.attack.sourceRevision, toRevision: current, reason: explained.reason, changes: explained.changes };
      throw error;
    } else if (chosen.revalidation.fromRevision !== chosen.attack.sourceRevision || chosen.revalidation.toRevision !== current) {fail('approval_mismatch');}
  }
  for (const actor of command.actors) {
    if (actors.locate(room, actor.ref).contract.revision !== actor.expectedRevision) {fail('stale_actor_revision');}
  }
  if (command.actors[0].expectedRevision !== current) {fail('approval_mismatch');}
  const sourcePools = actors.resources(source.token, 'creature');
  const price = chosen.attack.authored?.attempt.price || { ap: chosen.attack.apCost, mana: 0 }, payment = {};
  for (const p of ['ap', 'mana']) if (price[p] > 0) payment[p] = spellPayments.tempFirst(sourcePools[p].current, sourcePools[p].temp, price[p]);
  if (!Object.keys(payment).length) payment.ap = spellPayments.tempFirst(sourcePools.ap.current, sourcePools.ap.temp, 0);
  const hpPool = actors.resources(target.token, 'character').hp;
  const fromTemp = Math.min(hpPool.temp, amount);
  const hp = chosen.attack.authored?.attempt.spell.kind === 'healing' ? { current: Math.min(hpPool.max, hpPool.current + amount), temp: hpPool.temp }
    : { current: Math.max(0, hpPool.current - (amount - fromTemp)), temp: hpPool.temp - fromTemp };
  const wear = approval.blocking ? expectedWear(target.token, approval).entry : undefined;
  const [first, second] = command.actors;
  if (hash(first.ref) !== hash(approval.source) || Object.keys(first).some(key => !['ref', 'expectedRevision', 'finalResources'].includes(key)) ||
    hash(first.finalResources || {}) !== hash(payment)) {fail('approval_mismatch');}
  if (hash(second.ref) !== hash(approval.target) || Object.keys(second).some(key => !['ref', 'expectedRevision', 'finalResources', 'equipmentWear'].includes(key)) ||
    hash(second.finalResources || {}) !== hash({ hp })) {fail('approval_mismatch');}
  if (hash(second.equipmentWear || null) !== hash(wear || null)) {fail('invalid_equipment_wear');}
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
  checkAuthored, checkOfferTarget, addOffer, getOffer, removeOffer, listOffers, sourceBaseline, closeOffer, closedOffer, listClosedOffers, checkRecordedPiece, explainSourceChange, validateApproval, checkAgainstRoom, checkWindow, get, add, listAll, close, closedCode, pendingFor,
  consumedReceipt, foreignId, validateChosen, expectedWear, validateWearEntry, bindCommand, applyWear, publicWear, scopedView, isBlockCommand };
