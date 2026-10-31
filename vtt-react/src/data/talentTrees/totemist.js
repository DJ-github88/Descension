const identity = {
  classId: 'totemist',
  rulesetVersion: 'cr-review-r1',
  authoredOnly: true,
  executionEnabled: false,
  applicationMode: 'manual-tabletop',
  automatedCapabilities: [],
  manualOnly: true,
  manualNotice: 'Manual tabletop only; no automatic totem placement, attunement building, aura pulse, or damage.'
};

export const TOTEMIST_TREE_META = [
  {
    id: 'hearthkeeper',
    name: 'Hearthkeeper',
    stem: 'hearthkeeper',
    short: 'hrk',
    signature: 'sovereign_hearth',
    capstone: 'eternal_hearthstone',
    signatureNode: 'cr1_totemist_hearthkeeper_signature',
    capstoneNode: 'cr1_totemist_hearthkeeper_capstone',
    tagline: 'Defensive anchoring, restorative hearth auras, ally damage redirection, and threshold sanctuaries.'
  },
  {
    id: 'earthshaper',
    name: 'Earthshaper',
    stem: 'earthshaper',
    short: 'esh',
    signature: 'faultline_conduit',
    capstone: 'pillar_of_the_world_root',
    signatureNode: 'cr1_totemist_earthshaper_signature',
    capstoneNode: 'cr1_totemist_earthshaper_capstone',
    tagline: 'Lithic disruption, seismic faultlines between pylons, terrain deformation, and crushing stone shrapnel.'
  },
  {
    id: 'skybinder',
    name: 'Skybinder',
    stem: 'skybinder',
    short: 'sky',
    signature: 'arcing_needle',
    capstone: 'tempest_beacon',
    signatureNode: 'cr1_totemist_skybinder_signature',
    capstoneNode: 'cr1_totemist_skybinder_capstone',
    tagline: 'Storm conduction, arcing static discharges between conduits, gale vortices, and orbital lightning strikes.'
  }
];

const gates = [
  [1, 0, []], [1, 0, []], [1, 0, []], [2, 5, ['p01']],
  [3, 10, ['p03']], [3, 10, ['p04']], [4, 15, ['p05', 'signature']], [4, 15, ['p06']],
  [5, 20, ['p07']], [5, 20, ['p08']], [6, 25, ['p09']], [6, 25, ['p10']],
  [7, 30, ['p11']], [8, 35, ['p12']], [9, 40, ['p13']], [10, 45, ['p14']]
];

const rows = {
  hearthkeeper: [
    ['hearth_warmth', 'Hearth Warmth', [2, 4, 6], 'hearthkeeper.tempHpAura', 'Allies starting their turn within 15 ft of a hearth conduit gain {v} temporary HP.'],
    ['pylon_durability', 'Pylon Durability', [5, 10, 15], 'hearthkeeper.conduitHp', 'Increase maximum HP of all deployed totems and conduit pylons by +{v}.'],
    ['soothing_cedar', 'Soothing Cedar', [1, 2, 3], 'hearthkeeper.cleanseChance', 'Resting near an active conduit grants +{v} bonus to recovery and saves vs disease.'],
    ['protective_aura', 'Protective Aura', [1, 2, 3], 'hearthkeeper.drNearby', 'Allies within 15 ft of an active totem take -{v} less physical damage from attacks.'],
    ['ward_resonance', 'Ward Resonance', [1, 2, 3], 'hearthkeeper.attunementOnHit', 'When a nearby ally is struck, gain +{v} Conduit Attunement (max once per turn).'],
    ['vitality_dispersion', 'Vitality Dispersion', [2, 4, 6], 'hearthkeeper.healingPulse', 'Deconstructing a conduit heals the nearest wounded ally for {v}d4 HP.'],
    ['sympathetic_pylon', 'Sympathetic Pylon', [10, 20, 30], 'hearthkeeper.damageRedirect', 'Redirect {v}% of damage taken by an ally within 10 ft to the nearest conduit.'],
    ['sheltering_stone', 'Sheltering Stone', [1, 2, 3], 'hearthkeeper.coverBonus', 'Active conduits provide half-cover (+{v} AC and saves) to adjacent allies.'],
    ['restorative_pulse', 'Restorative Pulse', [1, 2, 3], 'hearthkeeper.statusCleanse', 'Spend 2 Attunement to remove {v} minor debuff from all allies in a conduit aura.'],
    ['sanctuary_line', 'Sanctuary Line', [1, 2, 3], 'hearthkeeper.enemyEntryAp', 'Enemies crossing between two linked hearth pylons must spend +{v} additional AP.'],
    ['condition_grounding', 'Condition Grounding', [1, 2, 3], 'hearthkeeper.saveAura', 'Allies inside a hearth aura gain +{v} to saving throws against mental and magical effects.'],
    ['enduring_effigy', 'Enduring Effigy', [1, 2, 3], 'hearthkeeper.pylonArmored', 'Conduits possess resistance to all non-magical physical damage and +{v} AC.'],
    ['ancestral_hearth', 'Ancestral Hearth', [2, 4, 6], 'hearthkeeper.spiritMitigation', 'Reduce necrotic and wyrd damage taken by allies within 20 ft of a pylon by {v}.'],
    ['threshold_barrier', 'Threshold Barrier', [5, 10, 15], 'hearthkeeper.knockbackDist', 'Enemies attempting to charge through a pylon threshold are knocked back {v} ft.'],
    ['life_link_matrix', 'Life Link Matrix', [1, 2, 3], 'hearthkeeper.emergencyShield', 'When an ally suffers lethal damage near a conduit, sacrifice the conduit to absorb {v}0 damage.'],
    ['hearthkeeper_mastery', 'Hearthkeeper Mastery', [1, 2, 3], 'hearthkeeper.masteryHearth', 'Aura radius of all hearth conduits increases by +{v} ft, and gain +1 Attunement capacity.']
  ],
  earthshaper: [
    ['granite_weight', 'Granite Weight', [1, 2, 3], 'earthshaper.slowAura', 'Enemies entering an earth conduit aura have movement speed reduced by {v}0 ft.'],
    ['micro_tremor', 'Micro Tremor', [1, 2, 3], 'earthshaper.stumbleDc', 'Placing a conduit forces adjacent enemies to make a balance check (DC 10 + {v}) or stumble.'],
    ['lithic_density', 'Lithic Density', [1, 2, 3], 'earthshaper.crushDamage', 'Earth conduit spells deal +{v}d6 bonus crushing/smashing damage.'],
    ['seismic_resonance', 'Seismic Resonance', [1, 2, 3], 'earthshaper.attuneOnSlam', 'Gain +{v} Attunement whenever a creature is knocked prone within 30 ft of a totem.'],
    ['tectonic_anchor', 'Tectonic Anchor', [1, 2, 3], 'earthshaper.difficultTerrain', 'Ground within {v}0 ft of an earth conduit becomes difficult terrain for hostile foes.'],
    ['earthen_cleats', 'Earthen Cleats', [2, 4, 6], 'earthshaper.proneResistance', 'Totemist and adjacent allies gain +{v} to resist being knocked prone or displaced.'],
    ['spire_shatter', 'Spire Shatter', [1, 2, 3], 'earthshaper.detonateCone', 'Shattering an earth conduit deals {v}d8 smashing damage in a 15 ft cone.'],
    ['crushing_wave', 'Crushing Wave', [1, 2, 3], 'earthshaper.armorSunder', 'Seismic pulses between linked conduits reduce enemy armor by {v} for 2 rounds.'],
    ['bedrock_binding', 'Bedrock Binding', [1, 2, 3], 'earthshaper.rootDuration', 'Targets damaged by seismic conduits are rooted in rock for {v} round(s).'],
    ['difficult_footing', 'Difficult Footing', [1, 2, 3], 'earthshaper.enemyDodgePenalty', 'Enemies on difficult terrain created by conduits suffer -{v} to Agility saves.'],
    ['stone_shrapnel', 'Stone Shrapnel', [2, 4, 6], 'earthshaper.piercingSplash', 'Conduit impacts project stone shrapnel dealing {v} piercing damage to adjacent foes.'],
    ['monolith_reach', 'Monolith Reach', [5, 10, 15], 'earthshaper.deployRange', 'Increase placement range for earth conduits and stone pylons by +{v} ft.'],
    ['faultline_pulse', 'Faultline Pulse', [1, 2, 3], 'earthshaper.turnStartDamage', 'Enemies standing along an active faultline take {v}d6 crushing damage at turn start.'],
    ['quaking_ground', 'Quaking Ground', [1, 2, 3], 'earthshaper.disruptConcentration', 'Seismic tremors force an immediate concentration check with -{v} penalty on casters.'],
    ['seismic_cascade', 'Seismic Cascade', [1, 2, 3], 'earthshaper.cascadeMultiplier', 'Detonating one pylon causes linked pylons to echo the burst dealing +{v}d6 damage.'],
    ['earthshaper_mastery', 'Earthshaper Mastery', [1, 2, 3], 'earthshaper.masteryEarth', 'Smashing damage ignores {v}0% physical resistance; gain +1 max active conduit slot.']
  ],
  skybinder: [
    ['lightning_rod', 'Lightning Rod', [1, 2, 3], 'skybinder.absorbStorm', 'Active sky conduits attract lightning and storm spells, absorbing {v}d8 damage.'],
    ['static_field', 'Static Field', [1, 2, 3], 'skybinder.shockAura', 'Enemies ending their turn adjacent to a sky conduit take {v}d4 storm damage.'],
    ['gale_funnel', 'Gale Funnel', [5, 10, 15], 'skybinder.pushDistance', 'Wind vortices channeled through conduits push enemies back {v} ft.'],
    ['storm_conduction', 'Storm Conduction', [1, 2, 3], 'skybinder.attuneOnShock', 'Gain +{v} Attunement whenever you or a conduit deals storm damage.'],
    ['arcing_discharge', 'Arcing Discharge', [1, 2, 3], 'skybinder.chainTargets', 'Casting a storm spell causes conduits to arc static to {v} additional nearby target(s).'],
    ['wind_deflection', 'Wind Deflection', [1, 2, 3], 'skybinder.missRanged', 'Conduit gale shields deflect arrows and missiles, imposing -{v} on ranged attacks.'],
    ['faraday_matrix', 'Faraday Matrix', [2, 4, 6], 'skybinder.triangulationDamage', 'Area between 3 linked sky conduits deals {v}d6 continuous storm damage each round.'],
    ['vortex_drag', 'Vortex Drag', [5, 10, 15], 'skybinder.pullCenter', 'Spend 1 Attunement to pull all creatures within 20 ft {v} ft toward a conduit apex.'],
    ['thunderous_pulse', 'Thunderous Pulse', [1, 2, 3], 'skybinder.deafenRounds', 'Shockwaves from sky conduits deafen and disorient enemies for {v} round(s).'],
    ['galvanic_overload', 'Galvanic Overload', [1, 2, 3], 'skybinder.critStatic', 'Critical storm strikes trigger a chain lightning burst dealing {v}d8 to adjacent foes.'],
    ['tempest_reach', 'Tempest Reach', [5, 10, 15], 'skybinder.arcRange', 'Increase maximum distance over which conduits can arc static between each other by +{v} ft.'],
    ['air_cushion', 'Air Cushion', [2, 4, 6], 'skybinder.fallDamageMitigation', 'Allies near a conduit take no falling damage and gain +{v} to jump distance.'],
    ['lightning_tether', 'Lightning Tether', [1, 2, 3], 'skybinder.tetherDamage', 'Tether an enemy to a conduit with crackling lightning; moving away deals {v}d8 damage.'],
    ['convective_surge', 'Convective Surge', [1, 2, 3], 'skybinder.apRefundOnShock', 'Killing an enemy with a conduit shock refund {v} AP once per combat encounter.'],
    ['storm_pylon_capacity', 'Storm Pylon Capacity', [1, 2, 3], 'skybinder.extraAttunement', 'Conduit Attunement pool maximum capacity increases by +{v}.'],
    ['skybinder_mastery', 'Skybinder Mastery', [1, 2, 3], 'skybinder.masterySky', 'Storm spells gain +{v} to spell attack rolls; Arcing Needle can chain to 2 targets.']
  ]
};

const SIGNATURE_NAMES = {
  sovereign_hearth: 'Sovereign Hearth',
  eternal_hearthstone: 'The Eternal Hearthstone',
  faultline_conduit: 'Faultline Conduit',
  pillar_of_the_world_root: 'Pillar of the World-Root',
  arcing_needle: 'Arcing Needle',
  tempest_beacon: 'Tempest Beacon'
};

export const TOTEMIST_TREES = TOTEMIST_TREE_META.map(meta => {
  const short = meta.short;
  const nodeId = slot => `cr1_totemist_${short}_${slot}`;

  const nodes = rows[meta.stem].map(([slug, name, rankArr, modKey, textTpl], idx) => {
    const [minLevel, requiresPoints, predecessors] = gates[idx];
    const maxRanks = 3;
    const rankValues = rankArr.map((v, rIdx) => ({
      rank: rIdx + 1,
      text: textTpl.replace('{v}', String(v)),
      values: { [modKey]: v }
    }));

    return {
      ...identity,
      id: nodeId(`p${String(idx + 1).padStart(2, '0')}`),
      treeId: meta.id,
      name,
      grantId: null,
      passiveSpellId: `cr1_totemist_${short}_pas_${slug}`,
      maxRanks,
      minLevel,
      requiresPoints,
      requires: predecessors.map(nodeId),
      requiresAll: true,
      column: (idx % 3),
      row: Math.floor(idx / 3) + 1,
      effectText: rankValues[0].text,
      rankValues
    };
  });

  nodes.push(...[
    ['signature', meta.signature, 3, 10, ['p01', 'p02'], 2],
    ['capstone', meta.capstone, 10, 45, ['p15', 'signature'], 10]
  ].map(([slot, spell, minLevel, requiresPoints, predecessors, row]) => ({
    ...identity,
    id: nodeId(slot),
    treeId: meta.id,
    name: SIGNATURE_NAMES[spell],
    grantId: `tot_${slot === 'signature' ? 'sig' : 'cap'}_${spell}`,
    passiveSpellId: null,
    maxRanks: 1,
    minLevel,
    requiresPoints,
    requires: predecessors.map(nodeId),
    requiresAll: true,
    column: 1,
    row,
    effectText: `Grant tot_${slot === 'signature' ? 'sig' : 'cap'}_${spell}; manual ACTION, no optional pick consumed.`,
    rankValues: [{ rank: 1, text: `Grant tot_${slot === 'signature' ? 'sig' : 'cap'}_${spell}.`, values: {} }]
  })));

  return { ...identity, id: meta.id, meta, nodes };
});

export const TOTEMIST_TALENT_NODES = TOTEMIST_TREES.flatMap(tree => tree.nodes);

export const TOTEMIST_PASSIVE_RECORDS = TOTEMIST_TALENT_NODES
  .filter(node => node.passiveSpellId)
  .map(node => ({
    ...identity,
    id: node.passiveSpellId,
    name: node.name,
    level: node.minLevel,
    treeId: node.treeId,
    source: 'talent-passive',
    spellType: 'PASSIVE',
    description: `${node.effectText} Highest learned rank only; an unlearned optional spell stays unlearned. ${identity.manualNotice}`,
    resourceCost: { actionPoints: 0, mana: 0 },
    targetingConfig: { targetingType: 'self', rangeType: 'self', rangeDistance: 0, targetRestrictions: ['self'], maxTargets: 1 },
    damageConfig: null,
    effectTypes: ['buff'],
    durationConfig: null,
    cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
    reactionTiming: null,
    savingThrow: null,
    area: null,
    conditions: [],
    rankValues: node.rankValues,
    requires: {
      nodeId: node.id,
      requiresPoints: node.requiresPoints,
      predecessorNodeIds: node.requires,
      requiresAll: true,
      minLevel: node.minLevel
    },
    manualMechanics: { kind: 'ranked-modifier', rankValues: node.rankValues, executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  }));

export const TOTEMIST_TALENT_CAPACITY = {
  trees: 3,
  nodes: 54,
  perTreeRanks: TOTEMIST_TREES.map(tree => ({
    treeId: tree.id,
    maxRanks: tree.nodes.reduce((total, node) => total + node.maxRanks, 0)
  })),
  totalRankCapacity: 150,
  characterPointCap: 50
};

export const TOTEMIST_HEARTHKEEPER = TOTEMIST_TREES.find(t => t.id === 'hearthkeeper')?.nodes || [];
export const TOTEMIST_EARTHSHAPER = TOTEMIST_TREES.find(t => t.id === 'earthshaper')?.nodes || [];
export const TOTEMIST_SKYBINDER = TOTEMIST_TREES.find(t => t.id === 'skybinder')?.nodes || [];
