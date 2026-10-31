/** Entitled server lookup cache, scoped to the exact current connection by its caller. */
import { actionId, CAPABILITY, CONDITION_CAPABILITY, EFFECT_CAPABILITY, readFormula } from './authoredAbility';
import { termsFor } from './authoredEffect';
let roomId = null, entries = [];
export function replaceAuthoredRegistry(room, values) { roomId = room; entries = JSON.parse(JSON.stringify(values || [])); }
export const installedEntries = room => roomId === room ? entries : [];
export function authoredSupport(id, room, className) {
  const entry = installedEntries(room).find(e => actionId(e.definitionRef) === id);
  if (!entry || entry.revoked) return { supported: false, reason: entry?.revoked ? 'This installed version was revoked. Manual play only.' : 'Refresh admitted abilities in this room before using this version.' };
  if (entry.creatureOnly) return { supported: false, reason: 'This version was admitted only for an exact creature source. Use the placed creature Inspect workflow; PC execution needs its own explicit admission.' };
  const raw = entry.canonicalDefinition, descriptor = entry.descriptor;
  if (String(className || '').toLowerCase().replace(/ /g, '_') !== raw.binding.classId) return { supported: false, reason: 'This installed ability has a different class binding.' };
  if (descriptor.capabilityId === EFFECT_CAPABILITY) {
    // A10 bundle: exact terms the owner approves (direct part, canonical effect and duration).
    const direct = raw.effects.direct;
    return { supported: true, raw: { targetingConfig: { rangeDistance: raw.targeting.rangeFeet, rangeType: raw.targeting.restriction } },
      kind: 'effect', effectTerms: termsFor(raw), formula: direct?.formula || null, damageTypes: direct?.damageTypes || [], price: descriptor.price, timing: raw.timing,
      cooldown: { type: 'none', value: 0 }, payment: { affordable: true, classPayment: null }, reading: direct ? readFormula(direct.formula) : null,
      name: raw.name, definitionId: id, definitionHash: `${EFFECT_CAPABILITY}/${entry.definitionRef.definitionHash}` };
  }
  return { supported: true, raw: { targetingConfig: { rangeDistance: raw.targeting.rangeFeet, rangeType: raw.targeting.restriction } },
    kind: raw.effect.kind, formula: raw.effect.formula, damageTypes: descriptor.effect.damageTypes || [], price: descriptor.price, timing: raw.timing,
    cooldown: { type: 'none', value: 0 }, payment: { affordable: true, classPayment: null }, reading: raw.effect.kind === 'condition' ? null : readFormula(raw.effect.formula),
    name: raw.name, definitionId: id, definitionHash: `${raw.effect.kind === 'condition' ? CONDITION_CAPABILITY : CAPABILITY}/${entry.definitionRef.definitionHash}` };
}
