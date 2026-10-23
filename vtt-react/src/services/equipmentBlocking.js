/** P12B thin slice — pure rules, identity and command planning (frozen contract revision 4 §3).
 * Approved C1/D-E: the item's current authored die is its blocking die and wear track.
 * Hit/Evasion, non-physical damage, criticals against shields, flat DR, resistances and conversion
 * stay GM rulings; nothing here interprets them.
 */
export const CAPABILITY = 'p12b-block:v1';
export const ATTACK_CAPABILITY = 'p12b-attack:v1';
export const DEFINITION_ID = 'creature-attack-block';
export const DEFINITION_HASH = `${CAPABILITY}/${DEFINITION_ID}`;
export const LADDER = Object.freeze(['broken', 'd4', 'd6', 'd8', 'd10', 'd12', 'd20']);
export const SIZES = Object.freeze({ d4: 4, d6: 6, d8: 8, d10: 10, d12: 12, d20: 20 });
export const SLOTS = Object.freeze(['head', 'neck', 'shoulders', 'back', 'chest', 'shirt', 'tabard', 'wrists', 'mainHand', 'offHand', 'ranged',
  'trinket1', 'trinket2', 'ring1', 'ring2', 'feet', 'legs', 'waist', 'gloves']);
export const DAMAGE_TYPES = Object.freeze(['smashing', 'slicing', 'stabbing', 'ember', 'rime', 'storm', 'blight', 'sacred', 'wyrd', 'arcane', 'primal']);
export const PHYSICAL = Object.freeze(['smashing', 'slicing', 'stabbing']);
export const MANUAL = Object.freeze(['non-physical', 'critical-shield', 'evasion', 'flat-dr', 'resistance', 'conversion', 'other']);
export const MANUAL_LABELS = Object.freeze({
  'non-physical': 'Non-physical damage: the GM rules that the blocking die applies (D-C open)',
  'critical-shield': 'Critical against a shield: the GM rules that the shield rolls (D-D open)',
  evasion: 'Evasion / hit ruled by the GM', 'flat-dr': 'Flat DR ruled in the final amount', resistance: 'Resistance or vulnerability ruled in the final amount',
  conversion: 'Conversion / healing applied separately by the GM', other: 'Other GM ruling'
});
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const ladderIndex = die => LADDER.indexOf(die);
export const stepDown = die => { const index = LADDER.indexOf(die); return index > 0 ? LADDER[index - 1] : null; };
export function kindOf(item) {
  if (!item || typeof item !== 'object') return null;
  if (String(item.subtype || '').toUpperCase() === 'SHIELD' || item.type === 'shield') return 'shield';
  return item.type === 'armor' ? 'armor' : null;
}
/** Private die of an item: its current authored die (C1). Non-ladder values are never converted. */
export function privateDie(item) {
  if (!item || typeof item !== 'object') return null;
  if (item.broken === true) return 'broken';
  const raw = item.durability ?? item.maxDurability;
  if (typeof raw !== 'string') return null;
  const die = raw.toLowerCase();
  return LADDER.includes(die) ? die : null;
}
/** Instance key without minting or migrating ids (contract §3.6). */
export function itemKeyFor(item, slot) {
  if (typeof item?.instanceId === 'string' && item.instanceId) return { itemKey: item.instanceId, keySource: 'instance' };
  if (typeof item?.id === 'string' && UUID.test(item.id)) return { itemKey: item.id, keySource: 'uuid' };
  return { itemKey: `${slot}:${item?.id}`, keySource: 'slot-legacy' };
}
/** Declarable pieces: equipped armor or shield with a ladder die and a shareable id. */
export function eligiblePieces(equipment = {}) {
  return SLOTS.flatMap(slot => {
    const item = equipment?.[slot], kind = kindOf(item), die = privateDie(item);
    if (!kind || !die || die === 'broken' || typeof item.id !== 'string' || !item.id || item.id.length > 120) return [];
    const name = typeof item.name === 'string' && item.name ? item.name.slice(0, 80) : item.id.slice(0, 80);
    return [{ slot, itemId: item.id, name, kind, currentDie: die, ...itemKeyFor(item, slot) }];
  });
}
export function declarationEntry(beforeRevision, mode, pieces) {
  if (!['block', 'none'].includes(mode)) throw Error('Choose blocking pieces or “Don’t block”.');
  if (mode === 'block' && !pieces.length) throw Error('Choose at least one blocking piece, or “Don’t block”.');
  return { beforeRevision, mode, pieces: mode === 'none' ? [] : pieces.map(({ slot, itemId, name, kind, currentDie }) => ({ slot, itemId, name, kind, currentDie })) };
}
/** First available piece as the server sees it: not broken and still in its shared slot. */
export function firstAvailable(declaration, sharedEquipment) {
  if (!declaration || declaration.version !== 1 || declaration.mode !== 'block') return null;
  return declaration.pieces.find(piece => !piece.broken && sharedEquipment?.[piece.slot]?.id === piece.itemId && kindOf(sharedEquipment[piece.slot]) === piece.kind) || null;
}
export function holdsDefending(token) {
  return require('./sharedConditionProfile').holdsDefending(token);
}
export function deriveWear(kind, beforeDie, face, defending) {
  const wears = !require('./sharedConditionProfile').preventsBlockingWear(defending) && (kind === 'armor' ? face <= 2 : face === 1);
  const afterDie = wears ? stepDown(beforeDie) : beforeDie;
  return { afterDie, broken: afterDie === 'broken' };
}
export function recordBlockFace(mode, die, face, random = Math.random) {
  const size = SIZES[die];
  if (!size) throw Error('Unsupported blocking die.');
  const value = mode === 'digital' ? Math.floor(random() * size) + 1 : Number(face);
  if (!Number.isSafeInteger(value) || value < 1 || value > size) throw Error(`Enter one face from 1 to ${size}.`);
  return { mode, faces: [value] };
}
/** GM attack facts; the hit is declared by the GM (Evasion is GM-adjudicated). */
export function buildAttack({ source, target, sourceRevision, ability, roll, outcome, damageType, proposedDamage, apCost }) {
  const faces = String(roll?.faces ?? '').split(/[\s,]+/).filter(Boolean).map(Number);
  const attack = { capability: ATTACK_CAPABILITY, source, target, sourceRevision, ability: { id: ability?.id || null, name: String(ability?.name || '').trim().slice(0, 80) },
    roll: { mode: roll?.mode === 'digital' ? 'digital' : 'physical', dice: String(roll?.dice || '').trim(), faces }, outcome, damageType, proposedDamage: Number(proposedDamage), apCost: Number(apCost) };
  if (!attack.ability.name) throw Error('Name the creature attack.');
  if (!/^[0-9dD+\- ]{1,40}$/.test(attack.roll.dice)) throw Error('Record the attack dice, for example 2d8+5.');
  if (!faces.length || faces.length > 20 || faces.some(face => !Number.isSafeInteger(face) || face < 1 || face > 1000)) throw Error('Record the attack faces.');
  if (!['hit', 'critical'].includes(outcome)) throw Error('The GM declares a hit or a critical.');
  if (!DAMAGE_TYPES.includes(damageType)) throw Error('Choose the damage type.');
  if (!Number.isSafeInteger(attack.proposedDamage) || attack.proposedDamage < 0 || attack.proposedDamage > 100000) throw Error('Proposed damage must be a whole number.');
  if (!Number.isSafeInteger(attack.apCost) || attack.apCost < 0 || attack.apCost > 20) throw Error('AP cost must be 0–20 (authored card cost).');
  return attack;
}
export const requiredManual = attack => [...(!PHYSICAL.includes(attack.damageType) ? ['non-physical'] : []), ...(attack.outcome === 'critical' ? ['critical-shield'] : [])];
const tempFirst = (current, temp, amount) => {
  if (amount > current + temp) throw Error('Insufficient resources for this commit.');
  const fromTemp = Math.min(temp, amount);
  return { current: current - (amount - fromTemp), temp: temp - fromTemp };
};
/** Server-checked consumption plan: [creature {ap}, character {hp, equipmentWear}] under the offer's command ID. */
export function planBlockCommand({ offer, entry, sourceToken, targetToken, declaration, names, manual = [], finalAmount, reason = '', revalidation = null, targetRevalidation = null }) {
  const { approval, contentHash } = entry;
  if (approval.attack.commandId !== offer.commandId || approval.attack.attackHash !== offer.attackHash) throw Error('The approval names a different attack.');
  const piece = approval.blocking ? firstAvailable(declaration, targetToken.character?.equipment) : null;
  if (approval.blocking && (!piece || declaration.revision !== approval.blocking.revision || piece.slot !== approval.blocking.slot || piece.itemId !== approval.blocking.itemId || piece.currentDie !== approval.blocking.die)) {
    // P12B-r1 (§3.9 R3): the recorded face is never re-read on another die and never re-rolled.
    const error = Error(`The recorded block (face ${approval.roll.faces[0]} on ${approval.blocking.slot} ${approval.blocking.die}) no longer matches the current piece${piece ? ` (${piece.slot} ${piece.currentDie})` : ' (unavailable)'}. The recorded face is kept: void the block roll and resolve HP by hand.`);
    error.code = piece ? 'block_revalidation_required' : 'block_piece_unavailable';
    throw error;
  }
  if (offer.attack.outcome === 'critical' && piece?.kind === 'armor') throw Error('Criticals go around armor: no block roll. Resolve HP without a block.');
  const required = piece ? requiredManual(offer.attack) : [];
  const categories = manual.map(item => item.category);
  if (required.some(category => !categories.includes(category))) throw Error('A GM ruling is required for this branch.');
  const face = approval.roll?.faces[0] ?? null, defending = holdsDefending(targetToken), reduction = piece ? require('./sharedConditionProfile').blockingReduction(face, defending) : 0;
  const afterBlock = Math.max(0, offer.attack.proposedDamage - reduction);
  const amount = finalAmount === undefined || finalAmount === '' ? afterBlock : Number(finalAmount);
  const healing = offer.attack.authored?.attempt.spell.kind === 'healing';
  if (healing && amount !== offer.attack.proposedDamage) throw Error('Healing amount changed: close this offer and request owner acceptance again with the retained source roll.');
  if (!Number.isSafeInteger(amount) || amount < 0 || amount > 100000) throw Error('Final HP damage must be a whole number.');
  if (amount !== afterBlock && !String(reason).trim()) throw Error(`Explain the change from ${afterBlock}.`);
  const sourceAp = { current: sourceToken.state.currentActionPoints, temp: sourceToken.state.tempActionPoints || 0 };
  const hpPool = { current: targetToken.character.health.current, temp: targetToken.character.tempHealth || 0 };
  const fromTemp = Math.min(hpPool.temp, amount);
  const hp = healing ? { current: Math.min(targetToken.character.health.max, hpPool.current + amount), temp: hpPool.temp }
    : { current: Math.max(0, hpPool.current - (amount - fromTemp)), temp: hpPool.temp - fromTemp };
  const { afterDie, broken } = piece ? deriveWear(piece.kind, piece.currentDie, face, defending) : {};
  const price = offer.attack.authored?.attempt.price || { ap: offer.attack.apCost, mana: 0 }, payment = {};
  if (price.ap > 0) payment.ap = tempFirst(sourceAp.current, sourceAp.temp, price.ap);
  if (price.mana > 0) payment.mana = tempFirst(sourceToken.state.currentMana, sourceToken.state.tempMana || 0, price.mana);
  if (!Object.keys(payment).length) payment.ap = tempFirst(sourceAp.current, sourceAp.temp, 0);
  const currentRevision = sourceToken.state.actorContract.revision;
  const targetRevision = targetToken.state.actorContract.revision;
  if (offer.attack.authored && targetRevision !== offer.attack.authored.targetRevision && !targetRevalidation) {
    const error = Error('The target changed. Explicitly revalidate this target context with the retained original faces.'); error.code = 'target_revalidation_required'; throw error;
  }
  const chosen = { capability: CAPABILITY, approvalId: approval.approvalId, gmConfirmed: true, names: { source: String(names.source).slice(0, 60), target: String(names.target).slice(0, 60) },
    attack: offer.attack, block: piece ? { slot: piece.slot, name: piece.name, kind: piece.kind, die: piece.currentDie, face, defending, reduction } : null, afterBlock,
    manual: piece ? manual.map(item => ({ category: item.category, note: String(item.note || '').slice(0, 300) })) : [] };
  if (revalidation && (!offer.attack.authored || currentRevision !== offer.attack.sourceRevision)) {
    // §3.9 R2: the GM states why the recorded rolls still stand after the creature changed.
    const why = String(revalidation.reason || '').trim();
    if (!why) throw Error('Say why the recorded rolls still stand.');
    if (currentRevision === offer.attack.sourceRevision) throw Error('The creature has not changed since the offer; no revalidation is needed.');
    chosen.revalidation = { fromRevision: offer.attack.sourceRevision, toRevision: currentRevision, reason: why.slice(0, 300) };
  }
  if (targetRevalidation && offer.attack.authored && targetRevision !== offer.attack.authored.targetRevision) {
    const why = String(targetRevalidation.reason || '').trim();
    if (!why) throw Error('Explain why the target context still permits this retained proposal.');
    chosen.targetRevalidation = { fromRevision: offer.attack.authored.targetRevision, toRevision: targetRevision, reason: why.slice(0, 300) };
  }
  return {
    commandId: offer.commandId,
    entries: [
      // §3.9 R1: the creature's current revision; AP from its current pools (temp first).
      { ref: approval.source, expectedRevision: currentRevision, finalResources: payment },
      { ref: approval.target, expectedRevision: targetToken.state.actorContract.revision, finalResources: { hp },
        ...(piece ? { equipmentWear: { slot: piece.slot, itemId: piece.itemId, blockingRevision: declaration.revision, beforeDie: piece.currentDie, afterDie, broken } } : {}) }],
    extra: { source: approval.source, target: approval.target, approval: { approvalId: approval.approvalId, contentHash },
      adjudication: { definitionId: DEFINITION_ID, definitionVersionOrHash: DEFINITION_HASH, chosenResult: JSON.stringify(chosen), finalAmount: amount, adjustmentReason: String(reason).trim() } },
    preview: { face, defending, reduction, afterBlock, amount, afterDie, broken, piece }
  };
}
/** Receipt view for a committed block (public data only). */
export function blockReceipt(result) {
  const receipt = result?.receipt, adjudication = receipt?.adjudication;
  if (!result?.success || receipt?.version !== 1 || adjudication?.definitionId !== DEFINITION_ID || adjudication.definitionVersionOrHash !== DEFINITION_HASH) return null;
  try {
    const chosen = JSON.parse(adjudication.chosenResult);
    const target = receipt.actors.find(actor => actor.ref?.kind === 'character');
    if (!target || chosen.capability !== CAPABILITY) return null;
    return { receipt, chosen, wear: target.equipmentWear, target: target.ref, approvalId: chosen.approvalId };
  } catch (_) { return null; }
}
/** Minimal public result text: only committed values; manual rulings are named, never implied. */
export function acceptedBlockText(result) {
  const view = blockReceipt(result);
  if (!view) return null;
  const { chosen, wear, receipt } = view;
  const source = receipt.actors.find(actor => actor.ref.kind === 'creature');
   const wearText = !wear ? 'No equipment block or wear' : wear.afterDie === wear.beforeDie ? `${wear.name} blocked ${chosen.block.reduction} (no wear${wear.defending ? ', Defending' : ''})`
    : `${wear.name} blocked ${chosen.block.reduction}; worn ${wear.beforeDie} → ${wear.broken ? 'broken' : wear.afterDie}`;
  const rulings = chosen.manual.length ? ` GM rulings: ${chosen.manual.map(item => item.category).join(', ')}.` : '';
  // P12B-r1 (§3.9 R2, review finding 3): the GM's revalidation is part of the public result.
  const revalidated = chosen.revalidation ? ` GM confirmed the recorded rolls after the attacker changed: ${chosen.revalidation.reason}.` : '';
   const healing = (chosen.attack.authored?.kind || chosen.attack.authored?.attempt?.spell.kind) === 'healing';
   return `Accepted: ${chosen.names.target} ${healing ? 'receives' : 'takes'} ${receipt.adjudication.finalAmount} ${healing ? 'healing' : 'HP'} from ${chosen.names.source}'s ${chosen.attack.ability.name}${source && chosen.attack.apCost ? ` (AP −${chosen.attack.apCost})` : ''}. ${wearText}.${rulings}${revalidated}`;
}
