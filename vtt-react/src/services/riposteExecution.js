/** Original E1a only. Reuses roll/weapon/payment primitives, never the basic-strike formula. */
import { supportStrike, recordFaces, digitalRoll } from './weaponStrike';
import { depleteTempFirst, exactActor } from './featherSlash';
export const CAPABILITY = 'p13b-riposte:v1';
export const DEFINITION_ID = 'universal_riposte';
export const DEFINITION_HASH = `${CAPABILITY}/${DEFINITION_ID}@89bebadaa3b079de5c22ad2bebc823ab3f1bad87a0e35b1d6b245ee6c2802fab`;
export const RULING = 'Eligibility, hit/miss and final damage GM-adjudicated; prior Parry payment GM-attested and not charged here.';
export const UNAPPLIED = 'Conditions, buffs/debuffs, critical/fumble follow-ons, wear, movement, ammunition, class gains and extra effects are not applied.';
export const weaponForRiposte = (character, slot = 'mainHand', ownerType) => supportStrike({ id: slot === 'ranged' ? 'ranged_standard_attack' : 'mh_standard_attack' }, character, ownerType);
export function recordRiposteRoll(mode, die, faces) {
  if (!['physical', 'digital'].includes(mode) || !Number.isInteger(die) || die < 2 || die > 100 || !Array.isArray(faces) || !faces.length || faces.length > 20 ||
    faces.some(face => !Number.isInteger(face) || face < 1 || face > die)) throw Error('Record valid retained physical/digital weapon faces. No formula is inferred.');
  return recordFaces(mode, die, faces);
}
export function digitalRiposteRoll(die, rng = Math.random) { return digitalRoll(die, false, rng); }
const nameOf = token => String(token?.character?.name || token?.state?.customName || token?.name || token?.id || 'Actor').slice(0, 60);
export function ripostePlan({ approval: a, contentHash, tokens, outcome, amount, confirmed }) {
  if (!confirmed || !['hit', 'miss'].includes(outcome) || !Number.isSafeInteger(amount) || amount < 0 || amount > 100000 || outcome === 'miss' && amount !== 0) throw Error('GM confirms eligibility, outcome and final damage; a miss must remain zero.');
  const source = exactActor(tokens, a.source, a.roomId, a.source.mapId), target = exactActor(tokens, a.target, a.roomId, a.source.mapId);
  if (!source || !target) throw Error('Exact source/attacker incarnation unavailable.');
  const ap = depleteTempFirst(source.character.actionPoints.current, source.character.tempActionPoints || 0, 1, true);
  const fromTemp = Math.min(target.state.tempHealth || 0, amount);
  const chosen = { capability: CAPABILITY, approvalId: a.approvalId, opportunityId: a.opportunityId, gmConfirmed: true,
    names: { source: nameOf(source), target: nameOf(target) }, weapon: a.weapon, roll: a.roll, rollOutcome: outcome,
    positions: [source.position || null, target.position || null], notApplied: UNAPPLIED };
  return { entries: [{ ref: a.source, expectedRevision: source.state.actorContract.revision, finalResources: { ap } },
    { ref: a.target, expectedRevision: target.state.actorContract.revision, finalResources: { hp: {
      current: Math.max(0, target.state.currentHp - (amount - fromTemp)), temp: (target.state.tempHealth || 0) - fromTemp } } }],
  extra: { source: a.source, target: a.target, approval: { approvalId: a.approvalId, contentHash },
    adjudication: { definitionId: DEFINITION_ID, definitionVersionOrHash: DEFINITION_HASH, chosenResult: JSON.stringify(chosen), finalAmount: amount, adjustmentReason: RULING } } };
}
export function riposteReceipt(result) {
  const r = result?.receipt;
  if (r?.authorization?.kind !== 'owner-approval-gm' || r.adjudication?.definitionVersionOrHash !== DEFINITION_HASH) return null;
  try { const chosen = JSON.parse(r.adjudication.chosenResult); return chosen.capability === CAPABILITY ? { receipt: r, chosen } : null; } catch (_) { return null; }
}
export function riposteAcceptedText(result) {
  const v = riposteReceipt(result); if (!v) return '';
  return `Accepted Riposte: AP −1; ${v.chosen.rollOutcome === 'miss' ? 'paid miss — HP unchanged' : `HP damage ${v.receipt.adjudication.finalAmount}`}. Parry prior payment was GM-attested, not charged here. ${UNAPPLIED}`;
}
