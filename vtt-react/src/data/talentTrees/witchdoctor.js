const identity = {
  classId: 'witch-doctor',
  rulesetVersion: 'cr-review-r1',
  authoredOnly: true,
  executionEnabled: false,
  applicationMode: 'manual-tabletop',
  automatedCapabilities: [],
  manualOnly: true,
  manualNotice: 'Manual tabletop only; no automatic tallow spending, poppet binding, miasma dispersion, or damage.'
};

export const WITCH_DOCTOR_TREE_META = [
  {
    id: 'hexbinder',
    name: 'Hexbinder',
    stem: 'hexbinder',
    short: 'hxb',
    signature: 'sympathetic_poppet',
    capstone: 'curse_of_the_black_mire',
    signatureNode: 'cr1_witch_doctor_hexbinder_signature',
    capstoneNode: 'cr1_witch_doctor_hexbinder_capstone',
    tagline: 'Withering curses, sympathetic wax poppets, soul drain, and channeling agonizing blight through effigies.'
  },
  {
    id: 'miasmist',
    name: 'Miasmist',
    stem: 'miasmist',
    short: 'msm',
    signature: 'cauldron_of_vapors',
    capstone: 'primordial_marsh_gale',
    signatureNode: 'cr1_witch_doctor_miasmist_signature',
    capstoneNode: 'cr1_witch_doctor_miasmist_capstone',
    tagline: 'Brewing noxious bog cauldrons, releasing choking pestilential fogs, and alchemical venom hazards.'
  },
  {
    id: 'fetish_crafter',
    name: 'Fetish Crafter',
    stem: 'fetish_crafter',
    short: 'ftc',
    signature: 'warding_effigy',
    capstone: 'great_bog_totem',
    signatureNode: 'cr1_witch_doctor_fetish_crafter_signature',
    capstoneNode: 'cr1_witch_doctor_fetish_crafter_capstone',
    tagline: 'Sculpting protective bone-and-peat effigies, soothing restorative salves, and sympathetic damage diversion.'
  }
];

const gates = [
  [1, 0, []], [1, 0, []], [1, 0, []], [2, 5, ['p01']],
  [3, 10, ['p03']], [3, 10, ['p04']], [4, 15, ['p05', 'signature']], [4, 15, ['p06']],
  [5, 20, ['p07']], [5, 20, ['p08']], [6, 25, ['p09']], [6, 25, ['p10']],
  [7, 30, ['p11']], [8, 35, ['p12']], [9, 40, ['p13']], [10, 45, ['p14']]
];

const rows = {
  hexbinder: [
    ['tallow_sculpting', 'Tallow Sculpting', [5, 10, 15], 'hexbinder.tallowCostReduction', 'Reduce Bog Tallow cost for sculpting sympathetic poppets by {v}%.'],
    ['soul_drain', 'Soul Drain', [1, 2, 3], 'hexbinder.drainBlight', 'Hexed targets take +{v}d6 necrotic/blight damage whenever you target them with an attack.'],
    ['withering_brand', 'Withering Brand', [1, 2, 3], 'hexbinder.disadvantageChecks', 'Curse imposes -{v} penalty on target Strength and Agility checks.'],
    ['hex_amplification', 'Hex Amplification', [1, 2, 3], 'hexbinder.curseSaveDc', 'Increase saving throw DC against your hexes and curses by +{v}.'],
    ['sympathetic_needle', 'Sympathetic Needle', [1, 2, 3], 'hexbinder.needleDamage', 'Piercing a bound effigy deals {v}d8 piercing damage directly to the linked creature.'],
    ['mire_rot', 'Mire Rot', [1, 2, 3], 'hexbinder.bleedDuration', 'Hexed targets bleed bog-rot, taking 1d{v} damage per turn for 3 turns.'],
    ['blood_curse', 'Blood Curse', [10, 20, 30], 'hexbinder.lifestealPercent', 'Heal for {v}% of necrotic damage dealt by your sympathetic curses.'],
    ['agony_echo', 'Agony Echo', [1, 2, 3], 'hexbinder.splashAgony', 'When a hexed target takes damage, adjacent enemies take {v}d4 psychic trauma.'],
    ['curse_endurance', 'Curse Endurance', [1, 2, 3], 'hexbinder.durationBonus', 'Increase the duration of all active hexes by +{v} rounds.'],
    ['tallow_harvest', 'Tallow Harvest', [5, 10, 15], 'hexbinder.tallowOnKill', 'Recover +{v}% Bog Tallow whenever a hexed or cursed target dies.'],
    ['fetish_shred', 'Fetish Shred', [1, 2, 3], 'hexbinder.armorShred', 'Hexes reduce target armor and physical resistances by {v}0%.'],
    ['malice_conduit', 'Malice Conduit', [5, 10, 15], 'hexbinder.rangeExtend', 'Increase range for binding sympathetic poppets and casting hexes by +{v} ft.'],
    ['necrotic_leech', 'Necrotic Leech', [1, 2, 3], 'hexbinder.drainStats', 'Bound targets suffer -{v} to all attack rolls while the sympathetic effigy is held.'],
    ['hex_cascade', 'Hex Cascade', [1, 2, 3], 'hexbinder.spreadOnDeath', 'When a hexed target dies, the hex spreads automatically to {v} nearby enemy.'],
    ['poppet_binding', 'Poppet Binding', [1, 2, 3], 'hexbinder.maxPoppets', 'You may maintain up to {v} active sympathetic poppets simultaneously.'],
    ['hexbinder_mastery', 'Hexbinder Mastery', [1, 2, 3], 'hexbinder.masteryHex', 'Curse damage increases by +{v}d8; gain +1 use of Sympathetic Poppet per encounter.']
  ],
  miasmist: [
    ['spore_puff', 'Spore Puff', [1, 2, 3], 'miasmist.sporeDamage', 'Releasing alchemical spore fumes deals {v}d6 poison/blight damage in a 10 ft cone.'],
    ['toxic_vent', 'Toxic Vent', [1, 2, 3], 'miasmist.poisonSaveDc', 'Add +{v} to save DC against your noxious clouds and alchemical vapours.'],
    ['blight_cloud_radius', 'Blight Cloud Radius', [5, 10, 15], 'miasmist.radiusBonus', 'Increase area radius of all deployed fog and cloud hazards by +{v} ft.'],
    ['choking_fog', 'Choking Fog', [1, 2, 3], 'miasmist.coughPenalty', 'Enemies inside your miasmas have their visibility reduced and suffer -{v} to hit.'],
    ['miasma_potency', 'Miasma Potency', [1, 2, 3], 'miasmist.tickDamage', 'Creatures starting their turn in your bog fog take +{v}d6 continuous blight damage.'],
    ['corrosive_fumes', 'Corrosive Fumes', [1, 2, 3], 'miasmist.acidSunder', 'Vapours corrode metal, reducing target armor by {v} for each round spent inside.'],
    ['swamp_gas_ignition', 'Swamp Gas Ignition', [1, 2, 3], 'miasmist.fireBurst', 'Igniting a miasma cloud with fire triggers an explosion dealing {v}d8 ember damage.'],
    ['stagnant_vapors', 'Stagnant Vapors', [1, 2, 3], 'miasmist.hazardDuration', 'Persistent hazard clouds remain active for +{v} additional round(s).'],
    ['bog_tallow_condenser', 'Bog Tallow Condenser', [5, 10, 15], 'miasmist.tallowRegen', 'Condensing fumes passively restores +{v}% Bog Tallow every 2 rounds in combat.'],
    ['pestilence_carrier', 'Pestilence Carrier', [1, 2, 3], 'miasmist.contagionRolls', 'Diseases and poisons inflicted by your vapours require {v} additional successful saves to cure.'],
    ['lingering_hazards', 'Lingering Hazards', [1, 2, 3], 'miasmist.difficultGround', 'Ground affected by your vapours becomes slick mud, slowing enemies by {v}0 ft.'],
    ['caustic_mist', 'Caustic Mist', [2, 4, 6], 'miasmist.acidResistIgnore', 'Blight and poison damage from clouds ignores {v} points of enemy elemental resistance.'],
    ['respiratory_arrest', 'Respiratory Arrest', [1, 2, 3], 'miasmist.stunChance', 'Failing a save against dense vapours stuns or nauseates the target for {v} round(s).'],
    ['alchemical_crucible', 'Alchemical Crucible', [1, 2, 3], 'miasmist.freeCrucible', 'Deploying a boiling cauldron costs -{v} AP once per combat encounter.'],
    ['dense_plume', 'Dense Plume', [1, 2, 3], 'miasmist.heavyObscure', 'Clouds provide heavy obscurement (+{v} AC and stealth bonus) to allies within.'],
    ['miasmist_mastery', 'Miasmist Mastery', [1, 2, 3], 'miasmist.masteryMiasma', 'Miasma damage dice increase by +{v}d6; Cauldron of Vapors area doubled.']
  ],
  fetish_crafter: [
    ['clay_talisman', 'Clay Talisman', [2, 4, 6], 'fetish_crafter.tempHpWard', 'Allies wearing your clay talismans gain {v} temporary HP at the start of combat.'],
    ['protective_wax', 'Protective Wax', [1, 2, 3], 'fetish_crafter.drAlly', 'Effigies placed near allies provide DR {v}/- against physical and blight damage.'],
    ['bone_needle_art', 'Bone Needle Art', [1, 2, 3], 'fetish_crafter.needleHeal', 'Piercing a restorative talisman heals an ally within 30 ft for {v}d6 HP.'],
    ['effigy_durability', 'Effigy Durability', [5, 10, 15], 'fetish_crafter.effigyHp', 'Increase the durability hit points of all crafted effigies and fetishes by +{v}.'],
    ['transfusion_poppet', 'Transfusion Poppet', [10, 20, 30], 'fetish_crafter.transfusePercent', 'Transfuse {v}% of incoming damage from an ally to a designated effigy.'],
    ['vitality_stitch', 'Vitality Stitch', [1, 2, 3], 'fetish_crafter.cleansePoison', 'Stitching a fetish cleanses {v} poison, disease, or bleed condition from an ally.'],
    ['curse_reflection', 'Curse Reflection', [1, 2, 3], 'fetish_crafter.reflectChance', 'Effigies have {v}0% chance to reflect a targeted hostile spell back at the caster.'],
    ['bog_herbalism', 'Bog Herbalism', [1, 2, 3], 'fetish_crafter.potionPotency', 'Restorative salves brewed with bog moss heal for an additional +{v}d4 HP.'],
    ['soothing_salve', 'Soothing Salve', [2, 4, 6], 'fetish_crafter.saveBonus', 'Allies treated with salves gain +{v} to all Constitution and Will saves.'],
    ['effigy_threshold', 'Effigy Threshold', [1, 2, 3], 'fetish_crafter.sanctuaryArea', 'Enemies cannot enter within 5 ft of a warding effigy without spending +{v} AP.'],
    ['cleansing_smoke', 'Cleansing Smoke', [1, 2, 3], 'fetish_crafter.smokeAura', 'Burning moss in an effigy cleanses harmful cloud and fog effects in a {v}0 ft radius.'],
    ['sympathetic_guard', 'Sympathetic Guard', [1, 2, 3], 'fetish_crafter.acAura', 'Allies within 10 ft of a warding effigy gain +{v} bonus to AC.'],
    ['peat_crucible', 'Peat Crucible', [5, 10, 15], 'fetish_crafter.tallowEfficiency', 'Crafting protective fetishes consumes {v}% less Bog Tallow.'],
    ['life_sharing_cord', 'Life Sharing Cord', [1, 2, 3], 'fetish_crafter.balanceHp', 'Link two allies; when one is damaged, distribute damage evenly and reduce by {v}0%.'],
    ['sacrificial_effigy', 'Sacrificial Effigy', [1, 2, 3], 'fetish_crafter.deathWard', 'When an ally suffers fatal damage, effigy shatters to keep them at {v} HP.'],
    ['fetish_crafter_mastery', 'Fetish Crafter Mastery', [1, 2, 3], 'fetish_crafter.masteryFetish', 'Warding effigy range increased by +{v} ft; Great Bog Totem grants double DR.']
  ]
};

const SIGNATURE_NAMES = {
  sympathetic_poppet: 'Sympathetic Poppet',
  curse_of_the_black_mire: 'Curse of the Black Mire',
  cauldron_of_vapors: 'Cauldron of Vapors',
  primordial_marsh_gale: 'Primordial Marsh Gale',
  warding_effigy: 'Warding Effigy',
  great_bog_totem: 'Great Bog Totem'
};

export const WITCH_DOCTOR_TREES = WITCH_DOCTOR_TREE_META.map(meta => {
  const short = meta.short;
  const nodeId = slot => `cr1_witch_doctor_${short}_${slot}`;

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
      passiveSpellId: `cr1_witch_doctor_${short}_pas_${slug}`,
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
    grantId: `wd_${slot === 'signature' ? 'sig' : 'cap'}_${spell}`,
    passiveSpellId: null,
    maxRanks: 1,
    minLevel,
    requiresPoints,
    requires: predecessors.map(nodeId),
    requiresAll: true,
    column: 1,
    row,
    effectText: `Grant wd_${slot === 'signature' ? 'sig' : 'cap'}_${spell}; manual ACTION, no optional pick consumed.`,
    rankValues: [{ rank: 1, text: `Grant wd_${slot === 'signature' ? 'sig' : 'cap'}_${spell}.`, values: {} }]
  })));

  return { ...identity, id: meta.id, meta, nodes };
});

export const WITCH_DOCTOR_TALENT_NODES = WITCH_DOCTOR_TREES.flatMap(tree => tree.nodes);

export const WITCH_DOCTOR_PASSIVE_RECORDS = WITCH_DOCTOR_TALENT_NODES
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
    sourceRefs: ['Witch Doctor Content Lock']
  }));

export const WITCH_DOCTOR_TALENT_CAPACITY = {
  trees: 3,
  nodes: 54,
  perTreeRanks: WITCH_DOCTOR_TREES.map(tree => ({
    treeId: tree.id,
    maxRanks: tree.nodes.reduce((total, node) => total + node.maxRanks, 0)
  })),
  totalRankCapacity: 150,
  characterPointCap: 50
};

export const WITCH_DOCTOR_HEXBINDER = WITCH_DOCTOR_TREES.find(t => t.id === 'hexbinder')?.nodes || [];
export const WITCH_DOCTOR_MIASMIST = WITCH_DOCTOR_TREES.find(t => t.id === 'miasmist')?.nodes || [];
export const WITCH_DOCTOR_FETISH_CRAFTER = WITCH_DOCTOR_TREES.find(t => t.id === 'fetish_crafter')?.nodes || [];
