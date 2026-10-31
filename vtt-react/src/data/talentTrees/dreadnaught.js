const identity = {
  classId: 'dreadnaught',
  rulesetVersion: 'cr-review-r1',
  authoredOnly: true,
  executionEnabled: false,
  applicationMode: 'manual-tabletop',
  automatedCapabilities: [],
  manualOnly: true,
  manualNotice: 'Manual tabletop only; no automatic pressure generation, heat vent calculation, damage reduction, or expiry.'
};

export const DREADNAUGHT_TREE_META = [
  {
    id: 'siegebastion',
    name: 'Siege Bastion',
    stem: 'siegebastion',
    short: 'sb',
    signature: 'bedrock_lock',
    capstone: 'unbreakable_colossus',
    signatureNode: 'cr1_dreadnaught_siegebastion_signature',
    capstoneNode: 'cr1_dreadnaught_siegebastion_capstone',
    tagline: 'Wall defense, hydraulic bedrock cleats, locking positions, and absorbing punishment for allies.'
  },
  {
    id: 'furnaceengine',
    name: 'Furnace Engine',
    stem: 'furnaceengine',
    short: 'fe',
    signature: 'boiler_burst',
    capstone: 'superheated_engine',
    signatureNode: 'cr1_dreadnaught_furnaceengine_signature',
    capstoneNode: 'cr1_dreadnaught_furnaceengine_capstone',
    tagline: 'Boiler combustion, steam venting, superheated thermal exhausts, and high-temperature area denial.'
  },
  {
    id: 'juggernaut',
    name: 'Juggernaut Momentum',
    stem: 'juggernaut',
    short: 'jg',
    signature: 'piston_trample',
    capstone: 'avalanche_of_iron',
    signatureNode: 'cr1_dreadnaught_juggernaut_signature',
    capstoneNode: 'cr1_dreadnaught_juggernaut_capstone',
    tagline: 'Hydraulic piston charges, concussive trampling lines, and crushing through terrain and defensive barriers.'
  }
];

const gates = [
  [1, 0, []], [1, 0, []], [1, 0, []], [2, 5, ['p01']],
  [3, 10, ['p03']], [3, 10, ['p04']], [4, 15, ['p05', 'signature']], [4, 15, ['p06']],
  [5, 20, ['p07']], [5, 20, ['p08']], [6, 25, ['p09']], [6, 25, ['p10']],
  [7, 30, ['p11']], [8, 35, ['p12']], [9, 40, ['p13']], [10, 45, ['p14']]
];

const rows = {
  siegebastion: [
    ['bedrock_anchor', 'Bedrock Anchor', [1, 2, 3], 'siegebastion.anchorDr', 'While braced or stationary, gain +{v} Damage Reduction against physical attacks.'],
    ['riveted_carapace', 'Riveted Carapace', [1, 2, 3], 'siegebastion.armorBonus', 'Increase your Armor Class by +{v} while wearing heavy plate armor.'],
    ['heavy_counterbalance', 'Heavy Counterbalance', [5, 10, 15], 'siegebastion.knockbackResist', 'Increase resistance distance against forced movement or knockback by +{v} ft.'],
    ['grounding_cleats', 'Grounding Cleats', [1, 2, 3], 'siegebastion.cleatBonus', 'Bedrock Cleats grant +{v} on checks to resist being knocked prone or moved.'],
    ['kinetic_bulkhead', 'Kinetic Bulkhead', [2, 4, 6], 'siegebastion.critMitigation', 'Reduce incoming critical hit damage by {v} points.'],
    ['iron_rampart', 'Iron Rampart', [1, 2, 3], 'siegebastion.allyCover', 'Allies adjacent to you gain +{v} AC and partial cover from physical attacks.'],
    ['interception_strut', 'Interception Strut', [5, 10, 15], 'siegebastion.interceptRange', 'Increase the interception range for Iron Citadel Brace by +{v} ft.'],
    ['shield_wall_locking', 'Shield-Wall Locking', [1, 2, 3], 'siegebastion.shieldBonus', 'Tower shields and heavy bulwarks grant +{v} additional shield block value.'],
    ['fortress_heart', 'Fortress Heart', [10, 20, 30], 'siegebastion.maxHp', 'Your maximum Health increases by +{v} points.'],
    ['hardened_joints', 'Hardened Joints', [1, 2, 3], 'siegebastion.jointStrength', 'Gain advantage and +{v} on saves against limb crippling, disarm, or sundering.'],
    ['structural_reinforcement', 'Structural Reinforcement', [2, 4, 6], 'siegebastion.armorRepair', 'Armor Recalibration repairs an additional +{v} armor hit points.'],
    ['immovable_mass', 'Immovable Mass', [1, 2, 3], 'siegebastion.sizeStability', 'Count as {v} size category larger for grapple, shove, and trampling resistance.'],
    ['reactive_plate', 'Reactive Plate', [1, 2, 3], 'siegebastion.pressureOnHit', 'Whenever you suffer physical damage, gain +{v} additional Furnace Pressure.'],
    ['bastion_aegis', 'Bastion Aegis', [2, 4, 6], 'siegebastion.allDamageDr', 'When below 50% HP, gain +{v} DR against all non-radiant damage.'],
    ['titan_brace', 'Titan Brace', [1, 2, 3], 'siegebastion.braceApRefund', 'Once per encounter, activating Brace Impact refunds {v} AP.'],
    ['siegebastion_mastery', 'Siege Bastion Mastery', [1, 2, 3], 'siegebastion.masteryDr', 'Maximum Furnace Pressure increases by +{v}0 PSI, and Bedrock Lock grants an additional +{v} DR.']
  ],
  furnaceengine: [
    ['efficient_combustion', 'Efficient Combustion', [1, 2, 3], 'furnaceengine.psiGain', 'Stoking the furnace generates +{v} additional Furnace Pressure.'],
    ['scalding_vent', 'Scalding Vent', [1, 2, 3], 'furnaceengine.ventFireBonus', 'Steam vents and boiler exhaust deal +{v}d6 additional fire damage.'],
    ['superheated_pipes', 'Superheated Pipes', [1, 2, 3], 'furnaceengine.meleeHeat', 'While in Supercharged tier (61+ PSI), melee attacks deal +{v}d4 fire damage.'],
    ['thermal_retaliation', 'Thermal Retaliation', [2, 4, 6], 'furnaceengine.retaliationFire', 'Melee attackers suffer {v} fire damage when striking you while at 31+ PSI.'],
    ['high_pressure_relief', 'High Pressure Relief', [5, 10, 15], 'furnaceengine.ventRadius', 'Increase the radius of Steam Vent and exhaust blasts by +{v} ft.'],
    ['soot_cloud', 'Soot Cloud', [1, 2, 3], 'furnaceengine.obscurityRounds', 'Vented steam obscures the area for +{v} additional rounds.'],
    ['slag_coating', 'Slag Coating', [1, 2, 3], 'furnaceengine.slagBurn', 'Targets struck by slag or steam burns suffer {v}d4 ongoing burn damage at turn start.'],
    ['insulated_firebox', 'Insulated Firebox', [2, 4, 6], 'furnaceengine.selfBurnMitigation', 'Reduce self-inflicted fire damage from Overheat or superheated abilities by {v}.'],
    ['overclocked_valves', 'Overclocked Valves', [1, 2, 3], 'furnaceengine.apDiscount', 'Venting steam costs -{v} AP once per combat (down to minimum 0 AP).'],
    ['searing_convection', 'Searing Convection', [5, 10, 15], 'furnaceengine.burnSpread', 'Superheated steam blast spreads burning flames to foes within +{v} ft.'],
    ['molten_slag_burst', 'Molten Slag Burst', [1, 2, 3], 'furnaceengine.slagArmorShred', 'Slag Spray reduces enemy Armor Class by an additional -{v}.'],
    ['pressurized_surge', 'Pressurized Surge', [1, 2, 3], 'furnaceengine.speedBonus', 'While at 61+ PSI, your movement speed increases by an additional +{v}0 ft.'],
    ['furnace_roars', 'Furnace Roar', [1, 2, 3], 'furnaceengine.demoralizeDc', 'Firebox Roar DC to frighten or demoralize enemies increases by +{v}.'],
    ['pyroclastic_exhaust', 'Pyroclastic Exhaust', [2, 4, 6], 'furnaceengine.critFire', 'Critical hits with boiler and fire abilities deal +{v}d8 additional fire damage.'],
    ['steam_turbine', 'Steam Turbine', [1, 2, 3], 'furnaceengine.actionRegen', 'Reaching 90+ PSI grants +{v} temporary AP on the following turn.'],
    ['furnaceengine_mastery', 'Furnace Engine Mastery', [10, 20, 30], 'furnaceengine.masteryScaling', 'All fire and steam ability damage increases by +{v}%, and Overheat threshold rises to 95 PSI.']
  ],
  juggernaut: [
    ['crushing_momentum', 'Crushing Momentum', [1, 2, 3], 'juggernaut.chargeDamage', 'Trample and charge abilities deal +{v}d8 additional bludgeoning damage.'],
    ['hydraulic_assist', 'Hydraulic Assist', [5, 10, 15], 'juggernaut.chargeDistance', 'Increase the distance of charges, tramples, and leaps by +{v} ft.'],
    ['piston_torque', 'Piston Torque', [1, 2, 3], 'juggernaut.knockdownDc', 'Increase DC to resist being knocked prone by your charges by +{v}.'],
    ['heavy_stride', 'Heavy Stride', [1, 2, 3], 'juggernaut.terrainCrush', 'Moving through difficult terrain costs -{v} ft of movement penalty.'],
    ['concussive_impact', 'Concussive Impact', [2, 4, 6], 'juggernaut.dazeDuration', 'Targets hit by Piston Punch or Hydraulic Slam are dazed, reducing their AP by {v}.'],
    ['shatter_defenses', 'Shatter Defenses', [1, 2, 3], 'juggernaut.shieldBreak', 'Melee strikes ignore {v} points of enemy shield absorption or barrier HP.'],
    ['reckless_velocity', 'Reckless Velocity', [1, 2, 3], 'juggernaut.psiPerMove', 'Gain +{v} Furnace Pressure whenever you move at least 20 ft on your turn.'],
    ['unstoppable_bulk', 'Unstoppable Bulk', [1, 2, 3], 'juggernaut.ccImmunity', 'Gain +{v} on saves against slow, immobilize, paralysis, and entangle.'],
    ['devastating_slam', 'Devastating Slam', [2, 4, 6], 'juggernaut.slamBonus', 'Hydraulic Slam and Seismic Pile Driver deal +{v}d8 bonus damage against prone targets.'],
    ['shockwave_resonance', 'Shockwave Resonance', [5, 10, 15], 'juggernaut.shockwaveCone', 'Groven Shockwave cone length increases by +{v} ft.'],
    ['demolition_piston', 'Demolition Piston', [10, 20, 30], 'juggernaut.structureDamage', 'Deal +{v}% damage against structures, walls, barriers, and massive foes.'],
    ['trample_cleave', 'Trample Cleave', [1, 2, 3], 'juggernaut.trampleTargets', 'Iron Trample can strike up to {v} additional enemies in its path.'],
    ['iron_stride', 'Iron Stride', [1, 2, 3], 'juggernaut.baseSpeed', 'Your base walking speed increases by +{v} ft.'],
    ['rebounding_shock', 'Rebounding Shock', [2, 4, 6], 'juggernaut.slamStun', 'Targets knocked into walls or obstacles suffer {v}d6 collision damage.'],
    ['engine_overdrive', 'Engine Overdrive', [1, 2, 3], 'juggernaut.freeCharge', 'Once per combat, executing a charge ability costs -{v} AP (minimum 1 AP).'],
    ['juggernaut_mastery', 'Juggernaut Mastery', [1, 2, 3], 'juggernaut.masteryEffect', 'Charge and trample abilities cost -{v}0 PSI, and Avalanche of Iron hits up to +{v} additional foes.']
  ]
};

const SIGNATURE_NAMES = {
  bedrock_lock: 'Bedrock Lock',
  unbreakable_colossus: 'Unbreakable Colossus',
  boiler_burst: 'Boiler Burst',
  superheated_engine: 'Superheated Engine',
  piston_trample: 'Piston Trample',
  avalanche_of_iron: 'Avalanche of Iron'
};

export const DREADNAUGHT_TREES = DREADNAUGHT_TREE_META.map(meta => {
  const nodeId = slot => slot === 'signature' ? meta.signatureNode
    : slot === 'capstone' ? meta.capstoneNode
      : `cr1_dreadnaught_${meta.stem}_${slot}`;

  const nodes = rows[meta.id].map(([suffix, name, values, mechanic, text], index) => {
    const [minLevel, requiresPoints, predecessors] = gates[index];
    const slot = `p${String(index + 1).padStart(2, '0')}`;
    return {
      ...identity,
      id: nodeId(slot),
      treeId: meta.id,
      name,
      passiveSpellId: `cr1_dreadnaught_${meta.short}_${suffix}`,
      grantId: null,
      maxRanks: 3,
      minLevel,
      requiresPoints,
      requires: predecessors.map(nodeId),
      requiresAll: true,
      column: index < 3 ? index : index === 3 ? 0 : index % 2 === 0 ? 0 : 2,
      row: minLevel - 1,
      effectText: text.replaceAll('{v}', values.join(' / ')),
      parameterKeys: [mechanic],
      rankValues: values.map((value, i) => ({
        rank: i + 1,
        text: text.replaceAll('{v}', String(value)),
        values: { [mechanic]: value }
      })),
      description: text.replace('{v}', values.join('/')),
      rankDescriptions: values.map(v => text.replace('{v}', String(v))),
      mechanics: {
        path: mechanic,
        values
      }
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
    grantId: `dread_${slot === 'signature' ? 'sig' : 'cap'}_${spell}`,
    passiveSpellId: null,
    maxRanks: 1,
    minLevel,
    requiresPoints,
    requires: predecessors.map(nodeId),
    requiresAll: true,
    column: 1,
    row,
    effectText: `Grant dread_${slot === 'signature' ? 'sig' : 'cap'}_${spell}; manual ACTION, no optional pick consumed.`,
    rankValues: [{ rank: 1, text: `Grant dread_${slot === 'signature' ? 'sig' : 'cap'}_${spell}.`, values: {} }],
    description: `${slot === 'signature' ? 'Signature' : 'Capstone'} talent active: grants ${SIGNATURE_NAMES[spell]}.`,
    rankDescriptions: [`Grants the ${SIGNATURE_NAMES[spell]} action.`]
  })));

  return {
    ...identity,
    id: meta.id,
    name: meta.name,
    tagline: meta.tagline,
    meta,
    nodes
  };
});

export const DREADNAUGHT_TALENT_NODES = DREADNAUGHT_TREES.flatMap(t => t.nodes);

export const DREADNAUGHT_PASSIVE_RECORDS = DREADNAUGHT_TALENT_NODES
  .filter(node => node.passiveSpellId)
  .map(node => ({
    ...identity,
    id: node.passiveSpellId,
    name: node.name,
    specialization: node.treeId,
    level: node.minLevel,
    tier: node.minLevel,
    school: 'Martial Engineering',
    spellType: 'PASSIVE',
    cost: { actionPoints: 0, mana: 0, furnacePressure: 0 },
    resourceCost: { actionPoints: 0, mana: 0, furnacePressure: 0 },
    actionPoints: 0,
    targeting: { targetingType: 'self', rangeType: 'self', rangeDistance: 0, targetRestrictions: ['self'], maxTargets: 1 },
    duration: { durationType: 'permanent', durationValue: 0, durationUnit: 'permanent' },
    cooldown: { type: 'none', value: 0 },
    effectTypes: ['passive'],
    damageConfig: null,
    description: node.effectText,
    rankDescriptions: node.rankValues.map(r => r.text),
    mechanics: {
      nodeId: node.id,
      treeId: node.treeId,
      path: node.parameterKeys?.[0],
      values: node.rankValues.map(r => Object.values(r.values)[0])
    }
  }));

export const DREADNAUGHT_TALENT_CAPACITY = {
  treesCount: DREADNAUGHT_TREES.length,
  nodesPerTree: 18,
  totalNodes: DREADNAUGHT_TALENT_NODES.length,
  rankCapacityPerTree: 50,
  totalRankCapacity: 150,
  characterPointCap: 50
};
