/** Frozen P12A: basic single-die PC strike. Proficiency interpretation and undecided defenses stay manual. */
import { getWeaponAttackAttribute } from '../utils/weaponIntegration';
import { isKnownWeaponType, resolveWeaponRank } from '../utils/weaponProficiency';
import { getWeaponArchetype, getWeaponSimpleTable, WEAPON_TYPE_TIERS } from '../constants/weaponTypeSimpleTables';
import { canonical, depleteTempFirst, exactActor } from './featherSlash';

export const CAPABILITY = 'p12a-strike:v1';
export const STRIKE_AP = 2;
export const RANK_DIE = Object.freeze({ UNTRAINED: 4, NOVICE: 6, TRAINED: 8, APPRENTICE: 10, ADEPT: 12, EXPERT: 20, MASTER: 20 });
export const DAMAGE_TYPES = Object.freeze(['smashing', 'slicing', 'stabbing', 'ember', 'rime', 'storm', 'blight', 'sacred', 'wyrd', 'arcane', 'primal']);
export const FIXED_TEXT = Object.freeze({
  'proficiency-deferred': 'Proficiency outcome deferred: resolve it at the table and note it in chat.',
  'weapon-critical': 'Critical hit: the weapon-specific condition from Laws › Attacks & Damage (for example Bleed or Stun).',
  'weapon-fumble': 'Natural 1: weapon durability damage and any critical-miss follow-up (Laws).',
  ammunition: 'Ammunition use is not tracked by the VTT.'
});
export const OPEN_PROFICIENCY = '[Open: whether a modifier is added, whether the die explodes, and how the result maps onto faces 1–20. The GM picks the outcome.]';
export const producerSlot = action => ({ mh_standard_attack: 'mainHand', ranged_standard_attack: 'ranged', universal_attack: 'mainHand' })[action?.id] || null;
const manual = reason => ({ supported: false, reason: `Manual action — ${reason}` });
const normalizeType = value => typeof value === 'string' ? value.toLowerCase().replace(/[_-]+/g, ' ').trim() : '';
export function strictWeaponType(item) {
  if (!item) return 'unarmed';
  return [item.discipline, item.weaponType, item.subtype].map(normalizeType).find(isKnownWeaponType) || null;
}
export function supportStrike(action, character, ownerType) {
  const slot = producerSlot(action);
  if (!slot) return manual('only basic main-hand, ranged and universal Attack are supported.');
  const item = character.equipment?.[slot] || null;
  if (!item && slot === 'ranged') return manual('no ranged weapon equipped.');
  const damage = item?.weaponStats?.baseDamage;
  if (item && (!damage || Number(damage.diceCount ?? 1) !== 1 || !/^d?\d+$/i.test(String(damage.diceType)))) return manual('this weapon does not have exactly one damage die.');
  const die = item ? Number(String(damage.diceType).replace(/^d/i, '')) : 4;
  if (!Number.isInteger(die) || die < 2 || die > 100) return manual('unsupported damage die.');
  const itemType = strictWeaponType(item), weaponType = itemType || (isKnownWeaponType(ownerType) ? ownerType : null);
  if (['thrown', 'boomerang', 'chakram', 'shuriken', 'dart'].includes(weaponType) || normalizeType(item?.subtype) === 'thrown' || item?.properties?.thrown === true) return manual('thrown weapons require table resolution.');
  const attribute = slot === 'ranged' ? 'agility' : getWeaponAttackAttribute(item);
  const score = character.stats?.[attribute];
  const damageType = item ? damage.damageType : 'smashing';
  if (!Number.isInteger(score) || score < 0 || score > 100 || !/^[a-z]{2,20}$/.test(damageType || '')) return manual('weapon damage type or sheet attribute needs reconciliation.');
  if (item && (typeof item.id !== 'string' || !item.id || item.id.length > 120)) return manual('weapon needs an exact item ID.');
  const rank = resolveWeaponRank({ ...character, weaponType });
  return { supported: true, needsType: !weaponType, weapon: { slot, itemId: item?.id || null, name: String(item?.name || 'Unarmed').slice(0, 80),
    weaponType, typeSource: itemType ? 'item' : 'owner', die, damageType, attribute, score, modifier: Math.floor((score - 10) / 2) },
    proficiency: weaponType ? { weaponType, rank: rank.key, rankSource: rank.source, die: RANK_DIE[rank.key], table: getWeaponArchetype(weaponType) } : null };
}
export function recordFaces(mode, die, faces, proficiency = false) {
  if (!['physical', 'digital'].includes(mode) || !Array.isArray(faces) || !faces.length || faces.length > (proficiency ? 4 : 20) || faces.some(f => !Number.isInteger(f) || f < 1 || f > die)) throw Error('Enter valid raw die faces.');
  if (!proficiency && (faces[0] === 1 ? faces.length !== 1 : faces.slice(0, -1).some(f => f !== die) || (faces.at(-1) === die && faces.length < 20))) throw Error('Record each top-face continuation, ending below the top (maximum 20 faces). Natural 1 records one face.');
  return { mode, faces: [...faces] };
}
export function digitalRoll(die, proficiency = false, rng = Math.random) {
  const faces = [];
  do { faces.push(1 + Math.floor(rng() * die)); } while (!proficiency && faces.at(-1) === die && faces.length < 20);
  return recordFaces('digital', die, faces, proficiency);
}
export function derive(weapon, roll) {
  if (roll.faces[0] === 1) return { rollOutcome: 'miss', proposed: 0 };
  if (roll.faces[0] === weapon.die) return { rollOutcome: 'critical', proposed: roll.faces.reduce((sum, face) => sum + face, 0) };
  return { rollOutcome: 'hit', proposed: Math.max(0, roll.faces[0] + weapon.modifier) };
}
export function buildApproval({ support, source, target, actionEpoch, baseCommitSequence, approvalId, roll, proficiencyRoll }) {
  if (!support?.supported || support.needsType) throw Error('Choose the actual weapon type before approving.');
  if (!source || !target || source.kind !== 'character' || target.kind !== 'creature' || source.roomId !== target.roomId || source.mapId !== target.mapId) throw Error('Select one exact bound creature on your source map.');
  return { version: 1, roomId: source.roomId, approvalId, actionEpoch, baseCommitSequence, source, target, weapon: support.weapon,
    roll: recordFaces(roll.mode, support.weapon.die, roll.faces), proficiency: { ...support.proficiency, roll: recordFaces(proficiencyRoll.mode, support.proficiency.die, proficiencyRoll.faces, true) }, price: { ap: STRIKE_AP } };
}
export const afterTier = (amount, kind, percent) => kind === 'resistance' ? Math.floor(amount * (100 - percent) / 100) : Math.ceil(amount * (100 + percent) / 100);
const defensive = /(resist|immune|immunity|reduced|reduces? (all )?damage|vulnerab|damage reduction|\bDR\b|absorb|evasion|evade|miss chance|pass through|deflect)/i;
/** Only bundled, unedited published tiers and one lone numeric flat DR are automated. No prose is executed. */
export function classifyDefenses({ approval, target, loaded, bundled, abilities = [] }) {
  const { proposed, rollOutcome } = derive(approval.weapon, approval.roll), type = approval.weapon.damageType;
  const manual = [], obsolete = [];
  let automated = null;
  const add = (source, name, text) => manual.push({ source, name, text });
  if (rollOutcome === 'miss') return { automated: null, afterDefense: 0, manual, obsolete };
  const sameLibrary = bundled && loaded && canonical(loaded.resistances || {}) === canonical(bundled.resistances || {}) && canonical(loaded.vulnerabilities || {}) === canonical(bundled.vulnerabilities || {});
  if (!bundled) add('custom', 'Custom creature: defenses not known to the VTT', 'Homebrew encoding, campaign prose, Defend and conversion require a GM ruling.');
  const entry = loaded || bundled || target?.creature || target || {};
  const entries = ['resistances', 'vulnerabilities'].flatMap(field => Object.entries(entry[field] || {}).map(([key, value]) => ({ key, value, kind: field === 'resistances' ? 'resistance' : 'vulnerability' })));
  const relevant = entries.filter(e => [type, 'all', 'iron', 'copper'].includes(e.key));
  const typed = entries.filter(e => e.key === type);
  if (sameLibrary && DAMAGE_TYPES.includes(type) && typed.length === 1 && [25, 50, 100].includes(typed[0].value) && !entries.some(e => e.key === 'all')) automated = { kind: typed[0].kind, percent: typed[0].value };
  relevant.forEach(e => { if (!(automated && e === typed[0])) add(bundled ? 'library' : 'custom', `${e.key} ${e.kind}${sameLibrary ? '' : ' (custom or edited)'}`, `${e.value} — GM ruling; encoding/order not inferred.`); });
  if (bundled) abilities.forEach(a => {
    const text = `${a.description || ''} ${(a.buffConfig?.effects || []).map(e => e.description || '').join(' ')}`.trim();
    if (defensive.test(text)) add('ability', a.name || a.id, text);
  });
  const conditions = Array.isArray(target?.state?.conditions) ? target.state.conditions : [];
  const dr = conditions.filter(c => typeof c?.effects?.damageReduction === 'number' && c.effects.damageReduction !== 0);
  const lone = dr.length === 1 && Number.isInteger(dr[0].effects.damageReduction) && dr[0].effects.damageReduction >= 1 && dr[0].effects.damageReduction <= 1000 && typeof (dr[0].recordId || dr[0].id) === 'string';
  if (!automated && lone && rollOutcome !== 'critical') automated = { kind: 'flatDr', amount: dr[0].effects.damageReduction, recordId: dr[0].recordId || dr[0].id };
  conditions.forEach(c => {
    if (c.effects?.damageReduction != null && c.effects.damageReduction !== 0 && !(automated?.kind === 'flatDr' && (c.recordId || c.id) === automated.recordId)) add('condition', c.name || 'Flat DR', `${c.effects.damageReduction} flat DR. ${rollOutcome === 'critical' ? 'Critical interaction is GM-adjudicated; armor bypass is not a flat-DR rule.' : 'Combined or ambiguous DR needs a GM ruling.'}`);
    if (c.effects?.armor != null) obsolete.push(`${c.name || 'Condition'}: armor ${c.effects.armor} — obsolete information, not applied.`);
  });
  const afterDefense = automated?.kind === 'flatDr' ? Math.max(0, proposed - automated.amount) : automated ? afterTier(proposed, automated.kind, automated.percent) : proposed;
  return { automated, afterDefense, manual, obsolete };
}
export function proficiencyChoice(weaponType, choice, reason = '') {
  if (choice === 'deferred') return { kind: 'deferred' };
  if (choice === 'none' && reason.trim()) return { kind: 'none', reason: reason.trim().slice(0, 300) };
  const face = Number(choice), table = getWeaponSimpleTable(weaponType), tier = WEAPON_TYPE_TIERS[face];
  if (!Number.isInteger(face) || !tier || !table[face]) throw Error('Choose a proficiency face, no outcome with a reason, or deferred.');
  return { kind: 'face', face, text: table[face], tier: `${tier.name} (${tier.delta})` };
}
export function notApplied(approval, choice) {
  const result = [], { rollOutcome } = derive(approval.weapon, approval.roll);
  if (choice.kind === 'face') result.push({ source: 'proficiency-face', text: `Face ${choice.face} (${approval.proficiency.table})` });
  if (choice.kind === 'deferred') result.push({ source: 'proficiency-deferred', text: FIXED_TEXT['proficiency-deferred'] });
  if (rollOutcome === 'critical') result.push({ source: 'weapon-critical', text: FIXED_TEXT['weapon-critical'] });
  if (rollOutcome === 'miss') result.push({ source: 'weapon-fumble', text: FIXED_TEXT['weapon-fumble'] });
  if (approval.weapon.slot === 'ranged') result.push({ source: 'ammunition', text: FIXED_TEXT.ammunition });
  return result;
}
export const nameOf = token => String(token?.character?.name || token?.state?.customName || token?.name || token?.id || 'Unknown').slice(0, 60);
export function planStrikeCommand({ approval, contentHash, tokens, defense, choice, verdict, note = '', finalAmount, reason = '' }) {
  const source = exactActor(tokens, approval.source, approval.roomId, approval.source.mapId), target = exactActor(tokens, approval.target, approval.roomId, approval.source.mapId);
  if (!source || !target) throw Error('Exact source or target is stale or missing.');
  const derived = derive(approval.weapon, approval.roll);
  if (!Number.isInteger(finalAmount) || finalAmount < 0 || finalAmount > 100000 || (derived.rollOutcome === 'miss' && finalAmount !== 0)) throw Error('Final damage must be 0–100000; a miss must remain zero.');
  if (finalAmount !== defense.afterDefense && !reason.trim()) throw Error('A changed final amount requires a reason.');
  if (reason.length > 2000 || note.length > 300) throw Error('Ruling text exceeds its bound.');
  if (defense.manual.length && !['not-applicable', 'applied-in-final'].includes(verdict)) throw Error('Choose one verdict for the listed defenses.');
  if (!choice) throw Error('A manual proficiency ruling is required.');
  const categories = [...new Set(defense.manual.map(item => item.source))];
  const chosen = { capability: CAPABILITY, approvalId: approval.approvalId, gmConfirmed: true, names: { source: nameOf(source), target: nameOf(target) },
    weapon: approval.weapon, roll: approval.roll, proficiencyRecord: approval.proficiency, ...derived, proficiency: choice,
    defense: { damageType: approval.weapon.damageType, automated: defense.automated, afterDefense: defense.afterDefense, manual: categories,
      ruling: categories.length ? { verdict, note } : null }, notApplied: notApplied(approval, choice) };
  const ap = depleteTempFirst(source.character.actionPoints.current, source.character.tempActionPoints || 0, STRIKE_AP, true);
  const fromTemp = Math.min(target.state.tempHealth || 0, finalAmount);
  const hp = { current: Math.max(0, target.state.currentHp - (finalAmount - fromTemp)), temp: (target.state.tempHealth || 0) - fromTemp };
  return { entries: [{ ref: approval.source, expectedRevision: source.state.actorContract.revision, finalResources: { ap } },
    { ref: approval.target, expectedRevision: target.state.actorContract.revision, finalResources: { hp } }],
    extra: { source: approval.source, target: approval.target, approval: { approvalId: approval.approvalId, contentHash },
      adjudication: { definitionId: 'basic-weapon-strike', definitionVersionOrHash: `${CAPABILITY}/basic-weapon-strike`, chosenResult: JSON.stringify(chosen), finalAmount, adjustmentReason: reason } } };
}
export function strikeReceipt(result) {
  const receipt = result?.receipt;
  if (receipt?.authorization?.kind !== 'owner-approval-gm' || receipt.adjudication?.definitionVersionOrHash !== `${CAPABILITY}/basic-weapon-strike`) return null;
  try { const recorded = JSON.parse(receipt.adjudication.chosenResult); return recorded.capability === CAPABILITY ? { receipt, recorded } : null; } catch (_) { return null; }
}
export function acceptedText(result) {
  const view = strikeReceipt(result);
  if (!view) return '';
  const { recorded: r, receipt } = view;
  const effects = r.notApplied.map(e => e.source === 'proficiency-face' ? `${e.text}: ${r.proficiency.tier} — ${r.proficiency.text}` : e.text);
  return `Accepted: AP −2 (${r.names.source}), ${r.rollOutcome === 'miss' ? 'Miss — HP unchanged' : `HP damage ${receipt.adjudication.finalAmount} (${r.names.target})`}. Only AP/HP committed.${effects.length ? ` Not applied by the VTT: ${effects.join('; ')}` : ''}`;
}
