/**
 * Class Resource Key Aliases
 *
 * Spells encode `resourceCost.classResource.type` with friendly snake_case keys
 * (`rage`, `marks`, `time_shards`, …), while `classResources.js` defines each
 * class's canonical engine id in camelCase / kebab form (`bloodHeat`,
 * `quarryMarksCompanion`, `timeShardsStrain`, …).
 *
 * This module is the single alias layer between the two vocabularies. Engine
 * code that consumes spell-level resource keys should resolve them through
 * `resolveClassResourceEngineId()` instead of comparing raw strings, so both
 * spell data and engine ids can evolve independently.
 *
 * Source of truth for engine ids: `classResources.js` (CLASS_RESOURCE_TYPES).
 * Source of truth for spell keys: the class data files (`*Data.js`), audited
 * 2026-09-16 via scripts/../resource-key-survey.
 */

export const SPELL_RESOURCE_KEY_TO_ENGINE_ID = {
  // Berserker
  rage: 'bloodHeat',
  blood_heat: 'bloodHeat',
  // Apex
  marks: 'quarryMarksCompanion',
  quarry_marks: 'quarryMarksCompanion',
  // Arcanoneer
  elemental_spheres: 'elementalSpheres',
  // Augur
  omens: 'benediction-malediction',
  benediction: 'benediction-malediction',
  malediction: 'benediction-malediction',
  // Chronarch
  time_shards: 'timeShardsStrain',
  time_shard: 'timeShardsStrain',
  time_shard_generate: 'timeShardsStrain',
  temporal_strain: 'timeShardsStrain',
  // Crusader
  fervor: 'radiantFervor',
  radiant_fervor: 'radiantFervor',
  // False Prophet
  madness: 'madnessPoints',
  // Gambit
  fortune: 'fortunePoints',
  karmic_debt: 'fortunePoints',
  // Harbinger
  mayhem: 'mayhemGauge',
  // Inquisitor
  authority: 'authority',
  righteousAuthority: 'authority',
  // Lunarch
  lunar_phase: 'lunarPhases',
  lunar_phases: 'lunarPhases',
  // Martyr
  devotion: 'devotionGauge',
  // Minstrel
  musical_notes: 'musicalNotes',
  musical_note: 'musicalNotes',
  // Plaguebringer
  virulence: 'virulenceCultivation',
  // Pyrofiend
  inferno_veil: 'infernoVeil',
  inferno_ascend: 'infernoVeil',
  inferno_required: 'infernoVeil',
  // Revenant
  toll: 'revenant-toll',
  deathToll: 'revenant-toll',
  death_toll: 'revenant-toll',
  phylactery: 'revenant-toll',
  // Shaper
  flux: 'kineticFluxBodyToll',
  body_toll: 'kineticFluxBodyToll',
  // Spellguard
  aep: 'arcaneEnergyPoints',
  arcane_energy_points: 'arcaneEnergyPoints',
  // Toxicologist
  vials: 'toxinVialsContraptions',
  toxin_vials: 'toxinVialsContraptions',
  contraption_parts: 'toxinVialsContraptions',
  // Warden
  tension: 'vengeance-points',
  // Animist
  resonance: 'ancestralResonance',
};

/** Reverse view: engine id -> the friendly key spells use most. */
export const ENGINE_ID_TO_SPELL_RESOURCE_KEY = Object.entries(SPELL_RESOURCE_KEY_TO_ENGINE_ID).reduce(
  (acc, [spellKey, engineId]) => {
    if (!acc[engineId]) acc[engineId] = spellKey;
    return acc;
  },
  {}
);

/**
 * Resolve a spell-level resource key to its canonical engine id.
 * Unknown keys pass through unchanged.
 */
export function resolveClassResourceEngineId(spellKey) {
  if (!spellKey) return spellKey;
  return SPELL_RESOURCE_KEY_TO_ENGINE_ID[spellKey] || spellKey;
}

/**
 * True when two spell-level / engine-level resource keys refer to the same
 * canonical resource (e.g. 'rage' vs 'bloodHeat').
 */
export function isSameClassResource(a, b) {
  return resolveClassResourceEngineId(a) === resolveClassResourceEngineId(b);
}

export default SPELL_RESOURCE_KEY_TO_ENGINE_ID;
