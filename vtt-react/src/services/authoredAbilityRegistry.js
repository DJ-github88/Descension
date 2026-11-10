/** Entitled server lookup cache, scoped to the exact current connection by its caller. */
import { actionId, CAPABILITY, FORMULA_CAPABILITY, AREA_CAPABILITY, CONDITION_CAPABILITY, EFFECT_CAPABILITY, AREA_ROLL_UNAPPROVED_REASON, isAreaRollProcedureApproved, readFormula, readScaledFormula, formulaAttributes, ownerSelfHealing } from './authoredAbility';
import { termsFor } from './authoredEffect';
import { HEALTH_CAPABILITY, readHealthFormula, DETERMINISTIC_CAPABILITY, readDeterministicFormula } from './authoredAbility';
let roomId = null, entries = [];
export function replaceAuthoredRegistry(room, values) { roomId = room; entries = JSON.parse(JSON.stringify(values || [])); }
export const installedEntries = room => roomId === room ? entries : [];
export function catalogueEntry(room, spellId, classId, recordHash) {
  return installedEntries(room).find(e => {
    const source = e.canonicalDefinition?.catalogueSource;
    return source?.spellId === spellId && source.classId === classId && source.recordHash === recordHash;
  }) || null;
}
export function authoredSupport(id, room, className, stats = {}, health) {
  const entry = installedEntries(room).find(e => actionId(e.definitionRef) === id);
  if (!entry || entry.revoked) return { supported: false, reason: entry?.revoked ? 'This installed version was revoked. Manual play only.' : 'Refresh admitted abilities in this room before using this version.' };
  if (entry.creatureOnly) return { supported: false, reason: 'This version was admitted only for an exact creature source. Use the placed creature Inspect workflow; PC execution needs its own explicit admission.' };
  const raw = entry.canonicalDefinition, descriptor = entry.descriptor;
  if (String(className || '').toLowerCase().replace(/ /g, '_') !== raw.binding.classId) return { supported: false, reason: 'This installed ability has a different class binding.' };
  if (descriptor.capabilityId === AREA_CAPABILITY) {
    if (!isAreaRollProcedureApproved()) return { supported: false, reason: AREA_ROLL_UNAPPROVED_REASON };
    if (entry.catalogueEligibility?.eligible === false) return { supported: false, reason: entry.catalogueEligibility.reason || 'This catalogue profile is no longer eligible; manual play only.' };
    if (raw.classPayment && !raw.catalogueSource) return { supported: false, reason: 'A typed class payment requires a pinned catalogue source.' };
    const reading = readScaledFormula(raw.effect.formula, stats);
    if (!reading.supported) return reading;
    const names = formulaAttributes(raw.effect.formula);
    return { supported: true, isArea: true, areaTerms: JSON.parse(JSON.stringify(raw.targeting)),
      raw: { targetingConfig: { targetingType: 'area', aoeShape: 'circle', aoeParameters: { radius: raw.targeting.radiusFeet }, rangeDistance: raw.targeting.rangeFeet, rangeType: 'ranged', targetRestrictions: [raw.targeting.restriction], maxTargets: raw.targeting.maxTargets } },
      kind: raw.effect.kind, formula: raw.effect.formula, damageTypes: raw.effect.damageTypes || [], price: descriptor.price,
       cooldown: { type: 'none', value: 0 }, payment: { affordable: true, classPayment: null }, reading,
      ...(names.length ? { rollAttributes: Object.fromEntries(names.map(name => [name, stats[name]])) } : {}),
      classPaymentSpec: raw.classPayment || null, targetRoute: 'creature',
      catalogueSource: raw.catalogueSource || null,
      name: raw.name, definitionId: id, definitionHash: `${AREA_CAPABILITY}/${entry.definitionRef.definitionHash}` };
  }
  if ([FORMULA_CAPABILITY, HEALTH_CAPABILITY, DETERMINISTIC_CAPABILITY].includes(descriptor.capabilityId)) {
    const deterministic = descriptor.capabilityId === DETERMINISTIC_CAPABILITY;
    const reading = deterministic ? readDeterministicFormula(raw.effect.formula, stats, health) : descriptor.capabilityId === HEALTH_CAPABILITY ? readHealthFormula(raw.effect.formula, stats, health) : readScaledFormula(raw.effect.formula, stats);
    if (!reading.supported) return reading;
    const dynamic = reading.readsHealth === true;
    return { supported: true, raw: { targetingConfig: { rangeDistance: raw.targeting.rangeFeet, rangeType: raw.targeting.restriction } },
      kind: raw.effect.kind, formula: raw.effect.formula, damageTypes: raw.effect.damageTypes || [], price: descriptor.price,
      cooldown: raw.cooldown ? { type: raw.cooldown.cooldownType, value: raw.cooldown.cooldownValue, definitionId: raw.definitionId } : { type: 'none', value: 0 }, payment: { affordable: true, classPayment: null }, reading,
      rollAttributes: Object.fromEntries(formulaAttributes(raw.effect.formula).map(name => [name, stats[name]])),
      ...(dynamic ? { rollHealth: { current: health.current, max: health.max } } : {}),
      classPaymentSpec: raw.classPayment || null, targetRoute: raw.targetRoute || 'creature',
      selfHealing: ownerSelfHealing(raw),
      catalogueSource: raw.catalogueSource || null,
      name: raw.name, definitionId: id, definitionHash: `${descriptor.capabilityId}/${entry.definitionRef.definitionHash}` };
  }
  if (descriptor.capabilityId === EFFECT_CAPABILITY) {
    if (entry.catalogueEligibility?.eligible === false) return { supported: false, reason: entry.catalogueEligibility.reason || 'This catalogue profile is no longer eligible; manual play only.' };
    if ((raw.classPayment || raw.catalogueSource) && !(raw.classPayment && raw.catalogueSource)) return { supported: false, reason: 'A typed class payment requires a pinned catalogue source.' };
    // Reconciliation gate: class-paid compositions never combine with the save or caster-start cooldown routes.
    if (raw.classPayment && (raw.cooldown || raw.effects?.save)) return { supported: false, reason: 'Class payments with a save branch or cooldown are not a reviewed combination; manual play only.' };
    // A10 bundle: exact terms the owner approves (direct part, canonical effect and duration).
    const direct = raw.effects.direct;
    // M5 composition + M4A: an attribute-reading immediate part uses the shared scaled reader with this owner's effective (sheet) scores.
    const names = direct ? formulaAttributes(direct.formula) : [];
    const reading = !direct ? null : names.length ? readScaledFormula(direct.formula, stats) : readFormula(direct.formula);
    if (reading && reading.supported === false) return reading;
    return { supported: true, raw: { targetingConfig: { rangeDistance: raw.targeting.rangeFeet, rangeType: raw.targeting.restriction } },
      kind: 'effect', effectTerms: termsFor(raw), formula: direct?.formula || null, damageTypes: direct?.damageTypes || [], price: descriptor.price, timing: raw.timing,
      classPaymentSpec: raw.classPayment || null, catalogueSource: raw.catalogueSource || null,
      // Composed cooldowns: an immediate + periodic bundle may carry the installed authenticated caster-start cooldown (server-authoritative).
      cooldown: raw.cooldown ? { type: raw.cooldown.cooldownType, value: raw.cooldown.cooldownValue, definitionId: raw.definitionId } : { type: 'none', value: 0 }, payment: { affordable: true, classPayment: null }, reading,
      ...(names.length ? { rollAttributes: Object.fromEntries(names.map(name => [name, stats[name]])) } : {}),
      name: raw.name, definitionId: id, definitionHash: `${EFFECT_CAPABILITY}/${entry.definitionRef.definitionHash}` };
  }
  return { supported: true, raw: { targetingConfig: { rangeDistance: raw.targeting.rangeFeet, rangeType: raw.targeting.restriction } },
    kind: raw.effect.kind, formula: raw.effect.formula, damageTypes: descriptor.effect.damageTypes || [], price: descriptor.price, timing: raw.timing,
    cooldown: { type: 'none', value: 0 }, payment: { affordable: true, classPayment: null }, reading: raw.effect.kind === 'condition' ? null : readFormula(raw.effect.formula),
    selfHealing: ownerSelfHealing(raw),
    name: raw.name, definitionId: id, definitionHash: `${raw.effect.kind === 'condition' ? CONDITION_CAPABILITY : CAPABILITY}/${entry.definitionRef.definitionHash}` };
}
