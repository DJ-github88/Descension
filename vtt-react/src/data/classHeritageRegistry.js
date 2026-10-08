import { normalizeRaceDisplayName } from '../utils/raceDisplayNames';

// Approved blueprint §7. One authored relationship map; the class-to-heritage
// view is derived from it. These are normal trained traditions, not free powers.
// Tight native roster: each class belongs to the cultures that invented it or
// whose body/culture it could only have come from. Every subrace owns at least
// one native class. Everything else is a rare acquired qualification (E).
export const HERITAGE_TRADITIONS = {
  thalren_human: { name: 'Tallyn', raceId: 'human', classes: ["Inquisitor","Toxicologist","Warden","Spellguard"] },
  skald_human: { name: 'Skald', raceId: 'human', classes: ["Augur","Berserker","Harbinger","Martyr","Warden"] },
  tessen_human: { name: 'Tessic', raceId: 'human', classes: ["Revenant","Chronarch","Spellguard","Warden","Harbinger"] },
  merryn_human: { name: 'Merryn', raceId: 'human', classes: ["Gambit","Minstrel","Revenant"] },
  ordan_human: { name: 'Ordu', raceId: 'human', classes: ["Animist","False Prophet","Apex"] },
  vashir_astril: { name: 'Lumian', raceId: 'astril', classes: ["Arcanoneer","Animist","Augur","Harbinger","False Prophet"] },
  silath_astril: { name: 'Kordak', raceId: 'astril', classes: ["Harbinger","Animist","Augur","Crusader","False Prophet"] },
  kethrin_fexric: { name: 'Brasskin', raceId: 'fexrick', classes: ["Arcanoneer","Chronarch","Pyrofiend","Spellguard","Warden"], aliases: ["Guild-Bound"] },
  drall_fexric: { name: 'Alchemite', raceId: 'fexrick', classes: ["Arcanoneer","Gambit","Spellguard","Warden"], aliases: ["Clan-Free"] },
  viridian_florae: { name: 'Briaren Florae', raceId: 'florae', classes: ["Lunarch","Toxicologist","Animist","Apex"] },
  florae_unified: { name: 'Oaken Florae', raceId: 'florae', classes: ["Toxicologist","Animist","Apex","Lunarch"], aliases: ["oken_florae","oken"] },
  morgh_groven: { name: 'Morgh Groven', raceId: 'groven', classes: ["Martyr","Shaper","Warden","Berserker"] },
  ithran_groven: { name: 'Amordjin Groven', raceId: 'groven', classes: ["Martyr","Shaper","Warden","Chronarch"] },
  veiled_mimir: { name: 'Arch Mimir', raceId: 'mimir', classes: ["Apex","Shaper","Warden","Animist","Lunarch"], aliases: ["veiled","Highborne Mimir"] },
  tethered_mimir: { name: 'Broken Mimir', raceId: 'mimir', classes: ["Apex","Shaper","Minstrel","Inquisitor","Toxicologist","Animist"], aliases: ["tethered","True Mimir"] },
  velun_neth: { name: 'Nethien', raceId: 'neth', classes: ["Animist","Arcanoneer","Revenant","Chronarch","Spellguard"] },
  kessen_neth: { name: 'Weft', raceId: 'neth', classes: ["Augur","Gambit","Revenant"] },
  drun_neth: { name: 'Riven', raceId: 'neth', classes: ["Plaguebringer","False Prophet","Revenant","Toxicologist"] },
  clean_vreken: { name: 'Bedel', raceId: 'vreken', classes: ["Animist","Plaguebringer","Revenant"] },
  marked_vreken: { name: 'Cromyx', raceId: 'vreken', classes: ["Inquisitor","Plaguebringer","Apex","Augur"] },
  korr_solari: { name: 'Korr', raceId: 'solari', classes: ["Augur","Martyr","Pyrofiend","Spellguard"] },
  thrask_solari: { name: 'Anhur', raceId: 'solari', classes: ["Crusader","Martyr","Pyrofiend","Spellguard"] },
  deepling_myrathil: { name: 'Nereid Myrathil', raceId: 'myrathil', classes: ["Animist","Apex","Augur","Minstrel"] },
  shoreling_myrathil: { name: 'Corali Myrathil', raceId: 'myrathil', classes: ["Minstrel","Augur","Revenant"] },
  riverling_myrathil: { name: 'Ondine Myrathil', raceId: 'myrathil', classes: ["Minstrel","Animist","Augur","Revenant"] },
};

const provenance = (powerSource, acquisition, institution, requirements, incompatibleStates = [], heritageEffectsImplemented = false) => ({
  powerSource, acquisition, institution, requirements, incompatibleStates,
  heritageEffectsImplemented
});

// Source/acquisition/institution are separate from membership and combat specs.
// Numeric heritage edges/costs must be implemented before being advertised.
export const CLASS_PROVENANCE = {
  Animist: provenance('Preserved spirits and memory traces in real substrates', 'A memorial/spirit anchor and guided communion apprenticeship', 'The Silent Throat; Bayar Wind-Throat', ['spirit_anchor', 'communion_apprenticeship'], [], true),
  Apex: provenance('The native Quiet, sensory adaptation and companion training', 'An actual sensory Trade, adaptation and a bonded trained companion', 'The Silent Hunt; Sylas', ['sensory_trade', 'sensory_training', 'bonded_companion'], [], true),
  Arcanoneer: provenance('Real elemental interactions through learned interfaces', 'Elemental grammar training with a compatible contract, engineered or stellar interface', 'The Canopy-Ledger; Vel-Otharen, alongside Fex workshops and carried charts', ['elemental_training', 'compatible_interface'], [], true),
  Augur: provenance('Temporal/causal patterns in stressed, preserved or resonant matter', 'Divination training and an appropriate material/focus', 'The Frozen Order of the Elk; Skadi Glass-Eye', ['divination_training', 'divination_focus'], [], true),
  Berserker: provenance('Conditioned physiology with thermal/alchemical mechanisms', 'Compatible metabolic induction and conditioning', 'The Bloodhammer Line; Hark Ash-Hammer', ['metabolic_induction', 'conditioning'], [], true),
  Chronarch: provenance('Temporal friction through engineered or archival anchors', 'Actual anchor installation and sustained calibration', 'The Frostmaw Conclave; Fex-Vestara', ['temporal_anchor', 'calibration_training'], [], true),
  Crusader: provenance('Genuine Aex shard/radiant resonance in consecrated equipment', 'Relic access, consecration and trained interface tolerance', 'The Solvan Vigil; politically commanded by the Dawn Vigil', ['consecrated_relic', 'interface_training'], [], true),
  'False Prophet': provenance('A pre-existing psychic Wyrd channel amplified through linked minds', 'A real channel encounter and learned link discipline', 'The Congregation of the Silence; Mor-Vereth', ['channel_encounter', 'link_training'], [], true),
  Gambit: provenance("Mael-Zhul's native probability-credit through contemporary channels", 'An accepted House wager, survival of initiation and class discipline', 'The Merrowport House; Merr-Cael, distinct from the cosmic House', ['house_wager', 'initiation_survival', 'wager_discipline'], [], true),
  Harbinger: provenance('Causal/entropic coupling through actual breaches and gradients', 'Technical study and survived field induction', 'The Doom-Choir; Malakor', ['entropy_study', 'field_induction'], [], true),
  Inquisitor: provenance('Cold-iron/null-salt behavior, severance rites and risky containment', 'The actual Vow and containment/severance apprenticeship', 'The Barbed Vow; Vrael the Forty-Seventh', ['barbed_vow', 'containment_training'], [], true),
  Lunarch: provenance("Moon-adapted organisms sustained by dormant Selunis's resonance", 'An actual compatible host bond, containment and identity discipline', 'The Lunar Communion; acting Regent Bri-Vessela', ['organism_bond', 'host_compatibility', 'identity_training'], ['active_pact_identity_preservation'], true),
  Martyr: provenance("Aex's protective resonance through scars or a qualified furnace interface", 'Actual Witness training or a compatible trained furnace method', 'The Covenant of the Scar; Sol-Kaessen', ['protective_interface', 'witness_or_furnace_training'], [], true),
  Minstrel: provenance('Native acoustic/resonant relationships in real media', 'Resonance/voice discipline and a usable medium', 'The Tide-Choir; Mer-Lyrisa', ['cadence_training', 'resonant_medium'], [], true),
  Plaguebringer: provenance('Introduced balanced microbial/fungal symbiosis', 'Compatible introduced culture, survival and sustained cultivation training', 'The Cultivar; Blight-Mother Vespera', ['introduced_culture', 'host_compatibility', 'cultivation_training'], [], true),
  Pyrofiend: provenance('Celestial starfire fused with hostile contamination at Emberspire', 'Real compatible breach-fire exposure, survival and containment training', 'The Ashen Communion; Sol-Vareths', ['breach_fire_exposure', 'exposure_survival', 'containment_training'], [], true),
  Revenant: provenance('Native threshold/preservation rites with finite anchor media', 'A real threshold transition and compatible maintained soul anchor', 'The Twice-Born; Kor-Vasseth', ['threshold_transition', 'finite_soul_anchor'], [], true),
  Shaper: provenance('Mimir plasticity, Groven alchemical interfaces or compatible co-sculpting', 'Successful body-interface transformation and subsequent training', 'The Form-Convergence; living Veyra', ['shaping_interface', 'transformation_training'], ['fixed_body_without_shaping_interface'], true),
  Spellguard: provenance('Induced interception/containment interfaces and finite captured energy', 'Actual induction, compatible apparatus/tissue adaptation and taught venting', 'The Aegis; Thrak-Damos', ['containment_induction', 'compatible_interface', 'venting_training'], [], true),
  Toxicologist: provenance('Actual chemistry, prepared compounds and induced tolerance', 'Tolerance induction and distillation/preparation apprenticeship', 'The Distillery; Varis', ['tolerance_induction', 'distillation_training'], [], true),
  Warden: provenance('Surgical grafts, biomechanics and containment equipment', 'Actual graft surgery, compatible anatomy and load training', 'The Bound; Alaric', ['graft_surgery', 'anatomy_compatibility', 'load_training'], ['surgery_incompatible_body'], true)
};

export const CLASS_COMPATIBILITY_ALIASES = {
  'Nereid Myrathil Apex': { className: 'Apex', heritageId: 'deepling_myrathil' },
  'Nereid Myrathil Animist': { className: 'Animist', heritageId: 'deepling_myrathil' },
  'Nereid Myrathil Augur': { className: 'Augur', heritageId: 'deepling_myrathil' }
};

const CLASS_HISTORY = {
  Animist: ['Older Ordu ancestor navigation', 'Kael codifies; Theron and Nyssa transmit adaptations', 'Transmitters of an older practice, not three identical accidental discoveries'],
  Apex: ["Older perceptual Trades with the Quiet", "Sylas establishes the modern Silent Hunt after Greythorn", 'Sylas is living, Broken Mimir and personally deaf through his Trade'],
  Arcanoneer: ['Elemental interactions and the pre-Star-Fall First Contract', "Valerius formalizes the Grand Nomenclature; later Proving Grounds collaboration", 'Valerius has an exceptional Contract/Heart-Vault state; Vaelis is a distinct historical female negotiator'],
  Augur: ['Older native, stellar and marine pattern-reading', "Cassia establishes the Archive's modern elk-reading institution", 'Cassia is temporally suspended, not an ordinarily immortal Skald'],
  Berserker: ['Hunger Winter physiology and inherited survival response', "Grum weaponizes the response through Torra's migration and Bloodhammer transmission", 'Grum / the Iron-Smith is one historical dead founder'],
  Chronarch: ["Older temporal anomalies including Vurath's ecology", "Nesta's chest-engine emergency establishes the modern method; postwar calibration transmits it", 'Nesta is an exceptional fading temporal anchor'],
  Crusader: ['Aex resonance; genuine shard relics after the Strike', 'Vane Solvan organizes the post-shard martial method', 'Vane is a historical fallen Solari/Solvan knight'],
  'False Prophet': ['A pre-existing psychic channel, not belief-created life', "Li Wei survives the encounter; Mor-Vereth organizes the modern cells", 'Li Wei is living and impaired; the current network is not automatically ancient'],
  Gambit: ["Older native probability craft of Mael-Zhul", 'Jax and Lyra consolidate modern institutions; Jix connects Alchemite hazard work', 'Modern consolidators, not creators of every primordial wager'],
  Harbinger: ['Real causal and entropic phenomena', 'Malakor develops the model; Xyris proves practical rift use; the Doom-Choir joins them', 'Malakor is contemporary; Xyris is a dead practical pioneer'],
  Inquisitor: ['Native cold-iron/null-salt behavior and actual containment', "Orven's Cromyx kin-hunting and Elias's Tallyn methods converge in the Vow", 'Orven remains Cromyx and missing; Elias is erased from the civil Ledger'],
  Lunarch: ['Real moon-adapted organisms, distinct from the moon itself', "Selene's grove encounter establishes the modern host discipline", 'Selene is an exceptional long-lived impaired host; Bri-Vessela acts as Regent'],
  Martyr: ["Aex's older protective sacrifice and resonance", "Sera's post-Purge memorial act establishes the modern Witness discipline", 'Sera is historical and dead; devotion is not already the same class'],
  Minstrel: ['Older native singing, acoustic and resonant craft', 'Lyris learns the sea-cadence; Ysenil transmits bog adaptation', 'Lyris is a missing modern Merryn founder, not an ordinary ancient immortal'],
  Plaguebringer: ['Actual microbial/fungal ecology', "Vespera's hush-treatment attempt establishes the founder culture and Cultivar", 'Vespera has exceptional strain-supported longevity, not species-wide immortality'],
  Pyrofiend: ['Starfire and hostile contamination fuse after the Strike', "The First Cabal intercepts breach-fire; Scathrach emerges from the first crucibles", 'Scathrach opposes Keth but remains predatory; opposition is not benevolence'],
  Revenant: ['Older native threshold and preservation rites', "Kora's covenant and Vesper's frost-stasis converge in the Twice-Born", "Kora is dead with preserved voice; Vesper is a female Athien in frost-stasis"],
  Shaper: ['Native plasticity and alchemical body interfaces', 'Torin pioneers reclamation; living Veyra synthesizes; Sylvanus later masters kinetic art', 'Veyra is living and Broken Mimir, not a second deceased founder'],
  Spellguard: ['Engineering and celestial-era containment knowledge', "Damon's shield at entombment begins the refined interception method", "Damon rejects uncontrolled/unventable intake, not every absorption"],
  Toxicologist: ['Older ordinary chemistry and chemical defense', 'Varis establishes the modern Distillery after the Third Harvest', 'Varis has toxin-arrested aging and neurological damage; Nerath is an active schismatic'],
  Warden: ['Actual surgery, equipment and biomechanics', "Alaric's Vat-Breaker rescue establishes the graft school; allies refine it", 'Alaric has exceptional regenerative/graft-supported endurance; later masters can train initiates']
};
Object.entries(CLASS_HISTORY).forEach(([name, [firstDiscovery, institutionalFounding, founderState]]) => {
  Object.assign(CLASS_PROVENANCE[name], { firstDiscovery, institutionalFounding, founderState });
});

CLASS_PROVENANCE.Martyr.nativeMethods = {
  skald_human: 'ironclad', korr_solari: 'witness', thrask_solari: 'witness',
  morgh_groven: 'witness', ithran_groven: 'witness'
};
CLASS_PROVENANCE.Martyr.methodRequirements = {
  witness: ['protective_interface', 'witness_training'],
  ironclad: ['protective_interface', 'furnace_training']
};
CLASS_PROVENANCE.Arcanoneer.nativeMethods = {
  velun_neth: 'first_contract', kethrin_fexric: 'engineered',
  drall_fexric: 'engineered', vashir_astril: 'stellar'
};

export const getBaseClassNames = () => Object.keys(CLASS_PROVENANCE);

const classKey = name => typeof name === 'string'
  ? name.replace(/(?:\s*\([^)]*\))+\s*$/, '').trim() : '';
const compatibilityAlias = name => Object.entries(CLASS_COMPATIBILITY_ALIASES)
  .find(([key]) => key.toLowerCase() === classKey(name).toLowerCase())?.[1];

export function resolveClassHeritageName(name) {
  if (typeof name !== 'string') return null;
  const base = classKey(name);
  const alias = compatibilityAlias(name);
  if (alias) return alias.className;
  return getBaseClassNames().find(key => key.toLowerCase() === base.toLowerCase()) || null;
}

const normalizeRaceId = raceId => {
  const key = String(raceId || '').toLowerCase().trim();
  return key === 'fexric' ? 'fexrick' : key === 'nethien' ? 'neth' : key;
};

export function resolveClassHeritageId(raceId, subraceId) {
  const race = normalizeRaceId(raceId);
  if (!subraceId) return null;
  const raw = String(subraceId).trim().replace(/\s*\([^)]*\)\s*$/, '');
  const normalized = String(normalizeRaceDisplayName(raw)).toLowerCase();
  return Object.keys(HERITAGE_TRADITIONS).find(id => {
    const row = HERITAGE_TRADITIONS[id];
    if (row.raceId !== race) return false;
    const shortId = id.replace(/_[^_]+$/, '');
    const shortName = row.name.replace(/\s+(Astril|Fex|Florae|Groven|Mimir|Myrathil)$/, '');
    return [id, shortId, row.name, shortName, ...(row.aliases || [])]
      .some(alias => alias.toLowerCase() === normalized || alias.toLowerCase() === raw.toLowerCase());
  }) || null;
}

export function getClassNativeHeritageIds(className) {
  const base = resolveClassHeritageName(className);
  const alias = compatibilityAlias(className);
  if (alias) return [alias.heritageId];
  return base ? Object.keys(HERITAGE_TRADITIONS).filter(id => HERITAGE_TRADITIONS[id].classes.includes(base)) : [];
}

// Native/adopted access describes the normal trained path. E access requires a
// recorded acquisition; approval or personality alone does not satisfy it.
// Current incompatible states trump both paths; they are not race stereotypes.
export function getClassHeritageAccess(className, raceId, subraceId, options = {}) {
  const base = resolveClassHeritageName(className);
  if (!base) return { status: 'unknown-class', selectable: true };
  const profile = CLASS_PROVENANCE[base];
  const heritageId = resolveClassHeritageId(raceId, subraceId);
  const nativeMethod = profile.nativeMethods?.[heritageId];
  const requestedMethod = options.method === 'furnace' ? 'ironclad' : options.method;
  const method = requestedMethod || nativeMethod;
  const requirements = profile.methodRequirements?.[method] || profile.requirements;
  const methods = [...new Set([...Object.values(profile.nativeMethods || {}), ...Object.keys(profile.methodRequirements || {})])];
  if (requestedMethod && methods.length && !methods.includes(requestedMethod)) return {
    status: 'invalid-method', selectable: false, className: base, heritageId, requirements,
    reason: `Unsupported ${base} method: ${requestedMethod}.`
  };
  const bodyStates = Array.isArray(options.bodyStates) ? options.bodyStates : [];
  const incompatible = profile.incompatibleStates.find(state => bodyStates.includes(state));
  const contractRemoved = base === 'Arcanoneer' && method === 'first_contract' && bodyStates.includes('severed_first_contract');
  if (incompatible || contractRemoved) return {
    status: 'incompatible-state', selectable: false, className: base, heritageId, requirements, method,
    reason: `The current body/interface state is incompatible: ${incompatible || 'severed_first_contract'}.`
  };
  const nativeIds = getClassNativeHeritageIds(className);
  const race = normalizeRaceId(raceId);
  if (!raceId) return { status: 'heritage-selection-required', selectable: true, className: base };
  if (!subraceId) return {
    status: 'heritage-selection-required', className: base,
    selectable: nativeIds.some(id => HERITAGE_TRADITIONS[id].raceId === race),
    requirements, reason: profile.acquisition
  };
  const knownId = HERITAGE_TRADITIONS[subraceId];
  if (knownId && knownId.raceId !== race) return { status: 'heritage-race-mismatch', selectable: false, className: base };
  if (heritageId && nativeIds.includes(heritageId) && (!method || !nativeMethod || method === nativeMethod)) return {
    status: 'normal-tradition', selectable: true, className: base, heritageId,
    requirements, reason: profile.acquisition,
    method: nativeMethod || method
  };
  // Legacy Nereid-specific keys stay narrow aliases, not new outsider schools.
  if (compatibilityAlias(className)) return { status: 'heritage-alias-mismatch', selectable: false, className: base };
  const qualification = options.qualification;
  const qualified = qualification?.verified === true && typeof qualification.source === 'string' && qualification.source.trim() &&
    Array.isArray(qualification.fulfilledRequirements) &&
    requirements.every(requirement => qualification.fulfilledRequirements.includes(requirement));
  return {
    status: qualified ? 'qualified-exception' : 'requires-qualification', selectable: Boolean(qualified),
    className: base, heritageId, requirements, method, reason: profile.acquisition
  };
}

export function withClassHeritageMetadata(className, data) {
  const base = resolveClassHeritageName(className);
  if (!base || data.isCustom) return data;
  return {
    ...data,
    heritageProfile: CLASS_PROVENANCE[base],
    isCompatibilityAlias: Boolean(compatibilityAlias(className)),
    restrictions: {
      ...(data.restrictions || {}),
      allowedSubraces: getClassNativeHeritageIds(className),
      hardBlocks: [],
      narrativeUnlock: true,
      justification: CLASS_PROVENANCE[base].acquisition
    }
  };
}
