/** Entitled server lookup cache, scoped to the exact current connection by its caller. */
import { actionId, CAPABILITY, readFormula } from './authoredAbility';
let roomId = null, entries = [];
export function replaceAuthoredRegistry(room, values) { roomId = room; entries = JSON.parse(JSON.stringify(values || [])); }
export const installedEntries = room => roomId === room ? entries : [];
export function authoredSupport(id, room, className) {
  const entry = installedEntries(room).find(e => actionId(e.definitionRef) === id);
  if (!entry || entry.revoked) return { supported: false, reason: entry?.revoked ? 'This installed version was revoked. Manual play only.' : 'Refresh admitted abilities in this room before using this version.' };
  const raw = entry.canonicalDefinition, descriptor = entry.descriptor;
  if (String(className || '').toLowerCase().replace(/ /g, '_') !== raw.binding.classId) return { supported: false, reason: 'This installed ability has a different class binding.' };
  return { supported: true, raw: { targetingConfig: { rangeDistance: raw.targeting.rangeFeet, rangeType: raw.targeting.restriction } },
    kind: raw.effect.kind, formula: raw.effect.formula, damageTypes: descriptor.effect.damageTypes, price: descriptor.price,
    cooldown: { type: 'none', value: 0 }, payment: { affordable: true, classPayment: null }, reading: readFormula(raw.effect.formula),
    name: raw.name, definitionId: id, definitionHash: `${CAPABILITY}/${entry.definitionRef.definitionHash}` };
}
