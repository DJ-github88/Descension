import { resolveClassResourceEngineId } from './classResourceAliases';
import { getBankResourceId, normalizeBankResource, getBankSpellResourcePlan, changeBankResource, MINSTREL_PITCHES, toCanonicalSphere } from './classResourceBanks';
import { normalizeApexResource } from './apexResourceContract';
import { normalizePyroResource, updatePyroResource, getPyroSpellResourcePlan } from './pyrofiendResourceContract';
import { normalizeShaperResource, updateShaperResource, getShaperSpellResourcePlan, isShaperTollKey } from './shaperResourceContract';
import { normalizeSpellguardResource, updateSpellguardResource, getSpellguardSpellResourcePlan } from './spellguardResourceContract';
import { normalizeInquisitorResource, updateInquisitorResource, getInquisitorSpellResourcePlan } from './inquisitorResourceContract';
import { normalizeBerserkerResource, updateBerserkerResource, getBerserkerSpellResourcePlan } from './berserkerResourceContract';
import { normalizeHarbingerResource, updateHarbingerResource, getHarbingerSpellResourcePlan } from './harbingerResourceContract';
import { normalizeCrusaderResource, updateCrusaderResource, getCrusaderSpellResourcePlan } from './crusaderResourceContract';
import { normalizeAugurResource, updateAugurResource, getAugurSpellResourcePlan, getAugurPoolValue } from './augurResourceContract';
import { normalizeRevenantResource, updateRevenantResource, getRevenantSpellResourcePlan, getRevenantPoolValue } from './revenantResourceContract';
import { normalizeAnimistResource, updateAnimistResource, getAnimistSpellResourcePlan } from './animistResourceContract';
import { normalizeFalseProphetResource, updateFalseProphetResource, getFalseProphetSpellResourcePlan } from './falseProphetResourceContract';
import { normalizePlaguebringerResource, updatePlaguebringerResource, getPlaguebringerSpellResourcePlan } from './plaguebringerResourceContract';
import { normalizeChronarchResource, updateChronarchResource, getChronarchSpellResourcePlan, getChronarchPoolValue } from './chronarchResourceContract';
import { normalizeLunarchResource, updateLunarchResource, getLunarchSpellResourcePlan, getLunarchPhaseIndex, advanceLunarchPhase } from './lunarchResourceContract';
import { normalizeToxicologistResource, updateToxicologistResource, getToxicologistSpellResourcePlan, getToxicologistPoolValue } from './toxicologistResourceContract';
import { normalizeWardenResource, updateWardenResource, getWardenSpellResourcePlan } from './wardenResourceContract';
import { validateRehearsalState } from './classes/chaosWeaverRules';
import { validateGamblerState } from './classes/gamblerData';
import { validateFateWeaverState } from './classes/fateWeaverData';
import { validateDeathcallerState } from './classes/deathcallerData';
import { validateLichborneState } from './classes/lichborneData';

export const CHAOS_WEAVER_TILE_RESOURCE_ID = 'chaos-weaver-tiles';

export const GAMBIT_FORTUNE_MAX = 7;
export const GAMBIT_DEBT_MAX = 13;
export const MARTYR_DEVOTION_MAX = 6;
export const MARTYR_DAMAGE_THRESHOLDS = Object.freeze([0, 10, 20, 40, 60, 80, 100]);
// Preserve the existing bank's overflow capacity; it is not 150 Devotion levels.
export const MARTYR_DAMAGE_BANK_MAX = 150;

const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const clamp = (value, max) => Math.max(0, Math.min(max, finite(value)));
const level = value => Math.trunc(clamp(value, MARTYR_DEVOTION_MAX));

export function getManagedResourceId(resource, className) {
  if (className) {
    const name = String(className).replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase();
    if (name === 'gambit') return 'fortunePoints';
    if (name === 'gambler') return 'gambler-hand';
    if (name === 'fate weaver') return 'fate-links';
    if (name === 'deathcaller') return 'dead-muster';
    if (name === 'lichborne') return 'lich-anchor';
    if (name === 'martyr') return 'devotionGauge';
    if (name === 'apex') return 'quarryMarksCompanion';
    if (name === 'pyrofiend') return 'infernoVeil';
    if (name === 'shaper') return 'kineticFluxBodyToll';
    if (name === 'spellguard') return 'arcaneEnergyPoints';
    if (name === 'inquisitor') return 'authority';
    if (name === 'berserker') return 'bloodHeat';
    if (name === 'harbinger') return 'mayhemGauge';
    if (name === 'crusader') return 'radiantFervor';
    if (name === 'augur') return 'benediction-malediction';
    if (name === 'revenant') return 'revenant-toll';
    if (name === 'animist') return 'ancestralResonance';
    if (name === 'false prophet') return 'madnessPoints';
    if (name === 'plaguebringer') return 'virulenceCultivation';
    if (name === 'chronarch') return 'timeShardsStrain';
    if (name === 'lunarch') return 'lunarPhases';
    if (name === 'toxicologist') return 'toxinVialsContraptions';
    if (name === 'warden') return 'vengeance-points';
    if (name === 'chaos weaver') return CHAOS_WEAVER_TILE_RESOURCE_ID;
    return getBankResourceId(resource, className);
  }
  if (resource?.type === 'gambler-hand') return 'gambler-hand';
  if (resource?.type === 'fate-links') return 'fate-links';
  if (resource?.type === 'dead-muster' || resource?.type === 'dead_muster') return 'dead-muster';
  if (resource?.type === 'lich-anchor' || resource?.type === 'lich_anchor') return 'lich-anchor';
  const id = resolveClassResourceEngineId(resource?.type);
  return ['fortunePoints', 'devotionGauge', 'quarryMarksCompanion', 'infernoVeil', 'kineticFluxBodyToll', 'arcaneEnergyPoints', 'authority', 'bloodHeat', 'mayhemGauge', 'radiantFervor', 'benediction-malediction', 'revenant-toll', 'ancestralResonance', 'madnessPoints', 'virulenceCultivation', 'timeShardsStrain', 'lunarPhases', 'toxinVialsContraptions', 'vengeance-points', 'fate-links', 'dead-muster', 'lich-anchor', CHAOS_WEAVER_TILE_RESOURCE_ID].includes(id) ? id : getBankResourceId(resource);
}

export function getMartyrLevelForDamage(damage) {
  const bank = clamp(damage, MARTYR_DAMAGE_BANK_MAX);
  for (let tier = MARTYR_DEVOTION_MAX; tier >= 0; tier--) {
    if (bank >= MARTYR_DAMAGE_THRESHOLDS[tier]) return tier;
  }
  return 0;
}

// Chaos Weaver six-tile record: detection only. The stored rehearsal session is
// never repaired, sanitized or refilled here; an invalid draft stays exactly as
// written and is reported through validationErrors.
const normalizeChaosWeaverResource = (resource) => {
  const base = { ...resource, type: CHAOS_WEAVER_TILE_RESOURCE_ID };
  const rehearsal = resource.rehearsal ?? null;
  if (!rehearsal) {
    return {
      ...base,
      initialized: resource.initialized === true,
      rehearsal: null,
      tiles: null,
      pending: null,
      anomaly: null,
      current: 0,
      max: 0,
      rehearsalValid: true,
      validationErrors: []
    };
  }
  const check = validateRehearsalState(rehearsal);
  const tiles = rehearsal?.tiles ?? null;
  return {
    ...base,
    initialized: true,
    rehearsal,
    tiles,
    pending: rehearsal.pending ?? null,
    anomaly: rehearsal.anomaly ?? null,
    current: tiles && Array.isArray(tiles.available) ? tiles.available.length : 0,
    max: 6,
    rehearsalValid: check.ok,
    validationErrors: [...check.errors]
  };
};

export function normalizeManagedClassResource(resource, className) {
  if (!resource) return resource;
  const id = getManagedResourceId(resource, className);
  if (id === 'gambler-hand') {
    // A legacy/foreign envelope stays byte-for-byte intact even if a saved
    // display name says Gambler. Class selection, not hydration, initializes
    // a new hand; never relabel or zero a legacy Fortune/debt record.
    if (resource.type && resource.type !== 'gambler-hand') return resource;
    // Detection only: keep invalid bytes and unknown pending outcomes; never
    // reinterpret legacy Fortune/cards as a new hand or create a reset.
    const state = resource.state ?? null;
    const check = state ? validateGamblerState(state) : { ok: true, errors: [] };
    return { ...resource, type: id, state, initialized: state !== null,
      current: check.ok && state ? state.fortune : 0, max: 7,
      stateValid: check.ok, validationErrors: check.errors };
  }
  if (id === 'fate-links') {
    if (resource.type && resource.type !== 'fate-links') return resource;
    const state = resource.state ?? null;
    const check = state ? validateFateWeaverState(state) : { valid: true, errors: [] };
    return { ...resource, type: id, state, initialized: state !== null,
      current: check.valid && Array.isArray(state?.tokens) ? state.tokens.filter(token => token?.state === 'free').length : 0,
      max: 3, stateValid: check.valid, validationErrors: check.errors };
  }
  if (id === 'dead-muster') {
    // Legacy or foreign envelopes stay intact; only the CR-1 marker belongs here.
    if (resource.type && !['dead-muster', 'dead_muster'].includes(resource.type)) return resource;
    const state = resource.state ?? null;
    const check = state ? validateDeathcallerState(state) : { valid: true, errors: [] };
    return { ...resource, type: id, state, initialized: state !== null,
      current: check.valid && Array.isArray(state?.manifestations) ? state.manifestations.length : 0,
      max: 2, stateValid: check.valid, validationErrors: check.errors };
  }
  if (id === 'lich-anchor') {
    // The removed legacy phylactery bar is not this CR-1 anchor.
    if (resource.type && !['lich-anchor', 'lich_anchor'].includes(resource.type)) return resource;
    const state = resource.state ?? null;
    const check = state ? validateLichborneState(state) : { valid: true, errors: [] };
    return { ...resource, type: id, state, initialized: state !== null,
      current: check.valid && state ? finite(state.integrity) : 0,
      max: 12, stateValid: check.valid, validationErrors: check.errors };
  }
  if (id === CHAOS_WEAVER_TILE_RESOURCE_ID) return normalizeChaosWeaverResource(resource);
  if (id === 'quarryMarksCompanion') return normalizeApexResource(resource);
  if (id === 'infernoVeil') return normalizePyroResource(resource);
  if (id === 'kineticFluxBodyToll') return normalizeShaperResource(resource);
  if (id === 'arcaneEnergyPoints') return normalizeSpellguardResource(resource);
  if (id === 'authority') return normalizeInquisitorResource(resource);
  if (id === 'bloodHeat') return normalizeBerserkerResource(resource);
  if (id === 'mayhemGauge') return normalizeHarbingerResource(resource);
  if (id === 'radiantFervor') return normalizeCrusaderResource(resource);
  if (id === 'benediction-malediction') return normalizeAugurResource(resource);
  if (id === 'revenant-toll') return normalizeRevenantResource(resource);
  if (id === 'ancestralResonance') return normalizeAnimistResource(resource);
  if (id === 'madnessPoints') return normalizeFalseProphetResource(resource);
  if (id === 'virulenceCultivation') return normalizePlaguebringerResource(resource);
  if (id === 'timeShardsStrain') return normalizeChronarchResource(resource);
  if (id === 'lunarPhases') return normalizeLunarchResource(resource);
  if (id === 'toxinVialsContraptions') return normalizeToxicologistResource(resource);
  if (id === 'vengeance-points') return normalizeWardenResource(resource);
  if (getBankResourceId(resource, className)) return normalizeBankResource(resource, className);
  if (id === 'fortunePoints') {
    const current = Math.trunc(clamp(resource.current ?? resource.fortunePoints ?? 0, GAMBIT_FORTUNE_MAX));
    const debt = Math.trunc(clamp(resource.debt ?? resource.risk ?? resource.karmicDebt ?? 0, GAMBIT_DEBT_MAX));
    return {
      ...resource, type: id, current, max: GAMBIT_FORTUNE_MAX,
      debt, risk: debt, maxDebt: GAMBIT_DEBT_MAX,
      ...(resource.fortunePoints !== undefined ? { fortunePoints: current } : {}),
      ...(resource.karmicDebt !== undefined ? { karmicDebt: debt } : {})
    };
  }
  if (id !== 'devotionGauge') return resource;
  const explicitDamage = resource.damage ?? resource.devotionDamage;
  const rawLevel = resource.current ?? resource.level;
  // A confirmed legacy gauge has no separate level/bank and a >6 scale.
  const legacyGauge = explicitDamage === undefined && resource.level === undefined && finite(resource.max) > MARTYR_DEVOTION_MAX;
  let requestedLevel = legacyGauge || rawLevel === undefined
    ? getMartyrLevelForDamage(legacyGauge ? rawLevel : explicitDamage) : level(rawLevel);
  let damage = clamp(explicitDamage ?? (legacyGauge ? rawLevel : MARTYR_DAMAGE_THRESHOLDS[requestedLevel]), MARTYR_DAMAGE_BANK_MAX);
  const tracked = resource.spentLevels !== undefined || resource.bonusLevels !== undefined;
  if (!tracked && requestedLevel > getMartyrLevelForDamage(damage)) damage = MARTYR_DAMAGE_THRESHOLDS[requestedLevel];
  const earnedLevels = getMartyrLevelForDamage(damage);
  let bonusLevels = Math.trunc(clamp(resource.bonusLevels ?? 0, MARTYR_DEVOTION_MAX));
  let spentLevels = tracked ? Math.trunc(clamp(resource.spentLevels ?? 0, earnedLevels + bonusLevels))
    : Math.max(0, earnedLevels - requestedLevel);
  // Explicit gains may restore spent levels or grant bounded bonus levels;
  // newly earned charge at the cap must not create a hidden over-cap reserve.
  bonusLevels = Math.min(bonusLevels, Math.max(0, MARTYR_DEVOTION_MAX - earnedLevels + spentLevels));
  const current = level(earnedLevels + bonusLevels - spentLevels);
  return {
    ...resource, type: id, current, max: MARTYR_DEVOTION_MAX, damage, earnedLevels, spentLevels, bonusLevels,
    ...(resource.level !== undefined ? { level: current } : {}),
    ...(resource.devotionDamage !== undefined ? { devotionDamage: damage } : {})
  };
}

export function updateManagedClassResource(resource, className, field, value) {
  const normalized = normalizeManagedClassResource(resource, className);
  const id = getManagedResourceId(normalized, className);
  if (id === 'gambler-hand') return normalized; // Read-only: no generic scalar mutation or partial-state repair.
  if (id === 'fate-links') return normalized; // Read-only: links change only through authored manual operations.
  if (id === 'dead-muster' || id === 'lich-anchor') return normalized; // Manual records change only through authored table events.
  if (id === 'infernoVeil') return updatePyroResource(normalized, field, value);
  if (id === 'kineticFluxBodyToll') return updateShaperResource(normalized, field, value);
  if (id === 'arcaneEnergyPoints') return updateSpellguardResource(normalized, field, value);
  if (id === 'authority') return updateInquisitorResource(normalized, field, value);
  if (id === 'bloodHeat') return updateBerserkerResource(normalized, field, value);
  if (id === 'mayhemGauge') return updateHarbingerResource(normalized, field, value);
  if (id === 'radiantFervor') return updateCrusaderResource(normalized, field, value);
  if (id === 'benediction-malediction') return updateAugurResource(normalized, field, value);
  if (id === 'revenant-toll') return updateRevenantResource(normalized, field, value);
  if (id === 'ancestralResonance') return updateAnimistResource(normalized, field, value);
  if (id === 'madnessPoints') return updateFalseProphetResource(normalized, field, value);
  if (id === 'virulenceCultivation') return updatePlaguebringerResource(normalized, field, value);
  if (id === 'timeShardsStrain') return updateChronarchResource(normalized, field, value);
  if (id === 'lunarPhases') return updateLunarchResource(normalized, field, value);
  if (id === 'toxinVialsContraptions') return updateToxicologistResource(normalized, field, value);
  if (id === 'vengeance-points') return updateWardenResource(normalized, field, value);
  if (id === CHAOS_WEAVER_TILE_RESOURCE_ID) return normalizeChaosWeaverResource({ ...normalized, [field]: value });
  if (id === 'quarryMarksCompanion' && ['current', 'marks', 'quarry_marks', 'quarryMarks'].includes(field)) {
    return normalizeApexResource({ ...normalized, current: value?.current ?? value });
  }
  if (id === 'fortunePoints') {
    const debtField = ['debt', 'risk', 'karmicDebt', 'karmic_debt'].includes(field);
    const currentField = ['current', 'fortunePoints', 'fortune'].includes(field);
    return normalizeManagedClassResource({
      ...normalized,
      ...(debtField ? { debt: value, risk: value } : currentField ? { current: value } : { [field]: value })
    }, className);
  }
  if (id === 'devotionGauge') {
    if (['current', 'level', 'devotion'].includes(field)) {
      const current = level(value);
      if (current === normalized.current) return normalized;
      // Explicit manual tier controls establish a fresh ledger at that tier.
      return normalizeManagedClassResource({ ...normalized, current, damage: MARTYR_DAMAGE_THRESHOLDS[current], spentLevels: 0, bonusLevels: 0 }, className);
    }
    if (['damage', 'devotionDamage'].includes(field)) {
      const damage = clamp(value, MARTYR_DAMAGE_BANK_MAX);
      return normalizeManagedClassResource({ ...normalized, damage }, className);
    }
  }
  return normalizeManagedClassResource({ ...normalized, [field]: value }, className);
}

export function getClassResourceValue(resource, className, resourceKey) {
  const normalized = normalizeManagedClassResource(resource, className);
  if (getManagedResourceId(normalized, className) === 'fate-links') return finite(normalized?.current);
  if (getManagedResourceId(normalized, className) === 'dead-muster') return finite(normalized?.current);
  if (getManagedResourceId(normalized, className) === 'lich-anchor') {
    if (['stage', 'undeathStage', 'undeath_stage'].includes(resourceKey)) return finite(normalized?.state?.undeathStage);
    return finite(normalized?.current);
  }
  if (getManagedResourceId(normalized, className) === 'benediction-malediction') return getAugurPoolValue(normalized, resourceKey);
  if (getManagedResourceId(normalized, className) === 'revenant-toll') return getRevenantPoolValue(normalized, resourceKey);
  if (getManagedResourceId(normalized, className) === 'virulenceCultivation' &&
    ['afflictions', 'activeAfflictions'].includes(resourceKey)) return finite(normalized?.afflictions);
  if (getManagedResourceId(normalized, className) === 'timeShardsStrain') return getChronarchPoolValue(normalized, resourceKey);
  if (getManagedResourceId(normalized, className) === 'toxinVialsContraptions') return getToxicologistPoolValue(normalized, resourceKey);
  if (getManagedResourceId(normalized, className) === 'lunarPhases') return getLunarchPhaseIndex(normalized?.currentPhase);
  if (getManagedResourceId(normalized, className) === 'kineticFluxBodyToll' && isShaperTollKey(resourceKey)) return finite(normalized?.bodyToll);
  const bankId = getBankResourceId(normalized, className);
  if (bankId === 'musicalNotes') {
    const index = MINSTREL_PITCHES.indexOf(String(resourceKey || '').replace(/^note_/i, '').toUpperCase());
    return index >= 0 ? normalized.notes[index] : normalized.current;
  }
  if (bankId === 'elementalSpheres' && toCanonicalSphere(resourceKey)) return normalized.spheres.filter(value => value === toCanonicalSphere(resourceKey)).length;
  const field = getManagedResourceId(normalized, className) === 'fortunePoints' &&
    ['debt', 'risk', 'karmicDebt', 'karmic_debt'].includes(resourceKey) ? 'debt' : 'current';
  return finite(normalized?.[field]);
}

export function changeManagedClassResource(resource, className, amount, resourceKey) {
  const normalized = normalizeManagedClassResource(resource, className);
  // Tile moves are deliberate zone transitions in the class rules; a bare
  // +/- amount never mutates the six-ID record.
  if (getManagedResourceId(normalized, className) === CHAOS_WEAVER_TILE_RESOURCE_ID) return normalized;
  if (getManagedResourceId(normalized, className) === 'fate-links') return normalized;
  if (['dead-muster', 'lich-anchor'].includes(getManagedResourceId(normalized, className))) return normalized;
  if (getManagedResourceId(normalized, className) === 'benediction-malediction') {
    const pool = resourceKey === 'malediction' ? 'malediction' : 'benediction';
    return updateAugurResource(normalized, pool, getAugurPoolValue(normalized, pool) + amount);
  }
  if (getManagedResourceId(normalized, className) === 'revenant-toll') {
    const key = String(resourceKey || '').toLowerCase();
    const phylactery = ['phylactery', 'phylacteryhp', 'phylactery_integrity', 'souls'].includes(key);
    return updateRevenantResource(normalized, phylactery ? 'phylacteryHP' : 'toll',
      getRevenantPoolValue(normalized, resourceKey) + amount);
  }
  if (getManagedResourceId(normalized, className) === 'virulenceCultivation') {
    const key = String(resourceKey || '').toLowerCase();
    const afflictions = ['afflictions', 'activeAfflictions', 'active_afflictions'].includes(key);
    return updatePlaguebringerResource(normalized, afflictions ? 'afflictions' : 'virulence',
      getClassResourceValue(normalized, className, resourceKey) + amount);
  }
  if (getManagedResourceId(normalized, className) === 'timeShardsStrain') {
    const key = String(resourceKey || '').toLowerCase();
    const strain = ['temporalstrain', 'temporal_strain', 'strain'].includes(key);
    return updateChronarchResource(normalized, strain ? 'temporalStrain' : 'timeShards',
      getClassResourceValue(normalized, className, resourceKey) + amount);
  }
  if (getManagedResourceId(normalized, className) === 'toxinVialsContraptions') {
    const key = String(resourceKey || '').toLowerCase();
    const parts = ['contraption_parts', 'contraptionparts', 'parts'].includes(key);
    return updateToxicologistResource(normalized, parts ? 'contraptionParts' : 'toxinVials',
      getClassResourceValue(normalized, className, resourceKey) + amount);
  }
  if (getManagedResourceId(normalized, className) === 'lunarPhases') {
    return updateLunarchResource(normalized, 'currentLunarPhase', advanceLunarchPhase(normalized.currentPhase, amount));
  }
  if (getManagedResourceId(normalized, className) === 'kineticFluxBodyToll') {
    const field = isShaperTollKey(resourceKey) ? 'bodyToll' : 'current';
    return updateShaperResource(normalized, field, getClassResourceValue(normalized, className, resourceKey) + amount);
  }
  // Positive Apex generation requires a resolved pack event, not an amount
  // printed on a cast or inferred from a solo attack.
  if (getManagedResourceId(normalized, className) === 'quarryMarksCompanion' && amount > 0) return normalized;
  if (getBankResourceId(normalized, className)) return changeBankResource(normalized, className, amount, resourceKey);
  const field = getManagedResourceId(normalized, className) === 'fortunePoints' &&
    ['debt', 'risk', 'karmicDebt', 'karmic_debt'].includes(resourceKey) ? 'debt' : 'current';
  if (getManagedResourceId(normalized, className) === 'devotionGauge') {
    const target = level(normalized.current + amount);
    const delta = target - normalized.current;
    if (!delta) return normalized;
    if (delta < 0) return normalizeManagedClassResource({ ...normalized, spentLevels: normalized.spentLevels - delta }, className);
    const restored = Math.min(normalized.spentLevels, delta);
    return normalizeManagedClassResource({ ...normalized,
      spentLevels: normalized.spentLevels - restored,
      bonusLevels: normalized.bonusLevels + delta - restored
    }, className);
  }
  return updateManagedClassResource(normalized, className, field, getClassResourceValue(normalized, className, resourceKey) + amount);
}

// Resolve duplicate generic/dedicated spell encodings once. Dedicated Devotion
// fields take precedence, including an explicit zero-cost mode.
export function getManagedSpellResourcePlan(spell, resource, className) {
  const inquisitorPlan = getInquisitorSpellResourcePlan(spell, resource, getManagedResourceId(resource, className));
  if (inquisitorPlan.handled) return inquisitorPlan;
  const spellguardPlan = getSpellguardSpellResourcePlan(spell, resource, getManagedResourceId(resource, className));
  if (spellguardPlan.handled) return spellguardPlan;
  const shaperPlan = getShaperSpellResourcePlan(spell, resource, getManagedResourceId(resource, className));
  if (shaperPlan.handled) return shaperPlan;
  const pyroPlan = getPyroSpellResourcePlan(spell, resource, getManagedResourceId(resource, className));
  if (pyroPlan.handled) return pyroPlan;
  const berserkerPlan = getBerserkerSpellResourcePlan(spell, resource, getManagedResourceId(resource, className));
  if (berserkerPlan.handled) return berserkerPlan;
  const harbingerPlan = getHarbingerSpellResourcePlan(spell, resource, getManagedResourceId(resource, className));
  if (harbingerPlan.handled) return harbingerPlan;
  const crusaderPlan = getCrusaderSpellResourcePlan(spell, resource, getManagedResourceId(resource, className));
  if (crusaderPlan.handled) return crusaderPlan;
  const augurPlan = getAugurSpellResourcePlan(spell, resource, getManagedResourceId(resource, className));
  if (augurPlan.handled) return augurPlan;
  const revenantPlan = getRevenantSpellResourcePlan(spell, resource, getManagedResourceId(resource, className));
  if (revenantPlan.handled) return revenantPlan;
  const animistPlan = getAnimistSpellResourcePlan(spell, resource, getManagedResourceId(resource, className));
  if (animistPlan.handled) return animistPlan;
  const falseProphetPlan = getFalseProphetSpellResourcePlan(spell, resource, getManagedResourceId(resource, className));
  if (falseProphetPlan.handled) return falseProphetPlan;
  const plaguebringerPlan = getPlaguebringerSpellResourcePlan(spell, resource, getManagedResourceId(resource, className));
  if (plaguebringerPlan.handled) return plaguebringerPlan;
  const chronarchPlan = getChronarchSpellResourcePlan(spell, resource, getManagedResourceId(resource, className));
  if (chronarchPlan.handled) return chronarchPlan;
  const lunarchPlan = getLunarchSpellResourcePlan(spell, resource, getManagedResourceId(resource, className));
  if (lunarchPlan.handled) return lunarchPlan;
  const toxicologistPlan = getToxicologistSpellResourcePlan(spell, resource, getManagedResourceId(resource, className));
  if (toxicologistPlan.handled) return toxicologistPlan;
  const wardenPlan = getWardenSpellResourcePlan(spell, resource, getManagedResourceId(resource, className));
  if (wardenPlan.handled) return wardenPlan;
  const bankPlan = getBankSpellResourcePlan(spell, resource, className);
  if (bankPlan.handled) return bankPlan;
  const values = spell.resourceCost?.resourceValues || {};
  const generic = spell.resourceCost?.classResource || values.classResource || {};
  const devotion = spell.specialMechanics?.devotionLevel || {};
  const devCost = spell.devotionCost ?? values.devotion_cost ?? devotion.cost ?? devotion.amplifiedCost;
  const devRequired = spell.devotionRequired ?? values.devotion_required ?? devotion.required;
  const devGain = spell.devotionGain ?? values.devotion_gain ?? devotion.gain;
  const genericId = resolveClassResourceEngineId(generic.type);
  const hasDevotion = devCost !== undefined || devRequired !== undefined || devGain !== undefined || values.devotion === 'all';
  const id = hasDevotion ? 'devotionGauge' : genericId;
  const handled = hasDevotion || (['fortunePoints', 'devotionGauge', 'quarryMarksCompanion'].includes(id) && (generic.cost !== undefined || generic.gain !== undefined));
  if (!handled) return { handled: false };
  const resourceKey = id === 'devotionGauge' ? 'devotion' : generic.type;
  const current = getClassResourceValue(resource, className, resourceKey);
  const genericCost = generic.cost === 'all' ? current : generic.cost !== undefined ? finite(generic.cost) : -finite(generic.gain);
  const rawCost = id === 'devotionGauge' && devCost !== undefined ? devCost : generic.cost;
  const spendAll = rawCost === 'all' || (id === 'devotionGauge' && values.devotion === 'all');
  const cost = spendAll ? current : Math.max(0, finite(id === 'devotionGauge' && devCost !== undefined ? devCost : genericCost));
  const advertisedGain = Math.max(0, finite(id === 'devotionGauge' && devGain !== undefined ? devGain : generic.gain ?? -genericCost));
  const gain = id === 'quarryMarksCompanion' ? 0 : advertisedGain;
  const required = Math.max(0, finite(id === 'devotionGauge' ? devRequired : 0));
  const ownerMatches = getManagedResourceId(resource, className) === id;
  return {
    handled: true, id, resourceKey, cost, gain, required, current,
    ...(id === 'quarryMarksCompanion' && (advertisedGain > 0 || generic.generationTiming === 'resolved_pack_outcome') ? { deferredGeneration: true } : {}),
    affordable: ownerMatches && (rawCost === undefined || rawCost === 'all' || Number.isFinite(Number(rawCost))) &&
      (!spendAll || current > 0) && [cost, gain, required].every(Number.isInteger) && current >= Math.max(cost, required),
    label: id === 'quarryMarksCompanion' ? 'Quarry Marks' : id === 'devotionGauge' ? 'Devotion levels' : ['karmic_debt', 'karmicDebt', 'debt', 'risk'].includes(resourceKey) ? 'Karmic Debt' : 'Fortune'
  };
}
