const identity = {
  classId: 'bladedancer',
  rulesetVersion: 'cr-review-r1',
  authoredOnly: true,
  executionEnabled: false,
  applicationMode: 'manual-tabletop',
  automatedCapabilities: [],
  manualOnly: true,
  manualNotice: 'Manual tabletop only; no automatic momentum generation, tempo shifting, parry deflection, or damage.'
};

export const BLADEDANCER_TREE_META = [
  {
    id: 'flowmaster',
    name: 'Flow Master',
    stem: 'flowmaster',
    short: 'flm',
    signature: 'cyclone_pivot',
    capstone: 'infinite_cadence',
    signatureNode: 'cr1_bladedancer_flowmaster_signature',
    capstoneNode: 'cr1_bladedancer_flowmaster_capstone',
    tagline: 'Continuous momentum chaining, conserving kinetic energy, and flowing seamlessly through combative tempos.'
  },
  {
    id: 'duelist',
    name: 'Duelist',
    stem: 'duelist',
    short: 'due',
    signature: 'riposte_flourish',
    capstone: 'severing_tempo',
    signatureNode: 'cr1_bladedancer_duelist_signature',
    capstoneNode: 'cr1_bladedancer_duelist_capstone',
    tagline: 'Single-target parry-ripostes, posture breaking, blade-locking, and lethal arterial precision.'
  },
  {
    id: 'shadowdancer',
    name: 'Shadow Dancer',
    stem: 'shadowdancer',
    short: 'shd',
    signature: 'phantom_step',
    capstone: 'dance_of_a_thousand_edges',
    signatureNode: 'cr1_bladedancer_shadowdancer_signature',
    capstoneNode: 'cr1_bladedancer_shadowdancer_capstone',
    tagline: 'Acrobatic repositioning, blurred footwork, striking from blind spots, and elusive evasive maneuvers.'
  }
];

const gates = [
  [1, 0, []], [1, 0, []], [1, 0, []], [2, 5, ['p01']],
  [3, 10, ['p03']], [3, 10, ['p04']], [4, 15, ['p05', 'signature']], [4, 15, ['p06']],
  [5, 20, ['p07']], [5, 20, ['p08']], [6, 25, ['p09']], [6, 25, ['p10']],
  [7, 30, ['p11']], [8, 35, ['p12']], [9, 40, ['p13']], [10, 45, ['p14']]
];

const rows = {
  flowmaster: [
    ['kinetic_surge', 'Kinetic Surge', [1, 2, 3], 'flowmaster.momentumOnHit', 'Gain +{v} additional Kinetic Momentum upon landing a critical melee strike.'],
    ['fleet_stride', 'Fleet Stride', [5, 10, 15], 'flowmaster.movementBonus', 'Add +{v} ft to movement speed while in Allegro (6+ Momentum) or higher.'],
    ['momentum_recovery', 'Momentum Recovery', [1, 2, 3], 'flowmaster.decayDelay', 'Increase the delay before Momentum begins out-of-combat decay by +{v} rounds.'],
    ['blade_accelerando', 'Blade Accelerando', [1, 2, 3], 'flowmaster.attackSpeed', 'When spending Momentum on a flourish, gain +{v} to next weapon attack roll.'],
    ['whirling_deflection', 'Whirling Deflection', [1, 2, 3], 'flowmaster.rangedAc', 'Add +{v} to AC against ranged projectile attacks while moving at least 15 ft.'],
    ['tempo_retention', 'Tempo Retention', [1, 2, 3], 'flowmaster.momentumRefund', 'When a melee strike misses, {v}0% chance to retain 1 spent Momentum.'],
    ['unbroken_flow', 'Unbroken Flow', [2, 4, 6], 'flowmaster.comboDamage', 'Each consecutive hit against the same target in one turn deals +{v} bonus slashing damage.'],
    ['frictionless_step', 'Frictionless Step', [1, 2, 3], 'flowmaster.difficultTerrain', 'Ignore difficult terrain up to {v}0 ft per turn while maintaining active momentum.'],
    ['cadence_strike', 'Cadence Strike', [1, 2, 3], 'flowmaster.critThreshold', 'In Allegro or Presto tempo, reduce critical hit threshold by {v}.'],
    ['rapid_flurry', 'Rapid Flurry', [1, 2, 3], 'flowmaster.offhandDamage', 'Add +{v} to off-hand weapon damage rolls during dual-wielding attacks.'],
    ['harmonic_parry', 'Harmonic Parry', [1, 2, 3], 'flowmaster.parryRefund', 'Parrying a strike generates +{v} Momentum immediately once per round.'],
    ['overdrive_reflexes', 'Overdrive Reflexes', [1, 2, 3], 'flowmaster.agilitySave', 'Gain +{v} to Agility saving throws while at 6 or more Momentum.'],
    ['acrobatic_evasion', 'Acrobatic Evasion', [2, 4, 6], 'flowmaster.aoeMitigation', 'Reduce damage taken from area-of-effect spells and explosions by {v}.'],
    ['whirlwind_posture', 'Whirlwind Posture', [1, 2, 3], 'flowmaster.cleaveBonus', 'Melee attacks that hit deal {v}d4 slashing damage to one adjacent enemy.'],
    ['kinetic_burst', 'Kinetic Burst', [1, 2, 3], 'flowmaster.burstDice', 'Spending 5 or more Momentum releases a kinetic shockwave dealing {v}d6 force damage.'],
    ['flow_mastery', 'Flow Mastery', [1, 2, 3], 'flowmaster.tempoMastery', 'Maximum Momentum capacity increases by +{v}, and Presto tier gains +{v} to all physical damage.']
  ],
  duelist: [
    ['parry_mastery', 'Parry Mastery', [1, 2, 3], 'duelist.parryBonus', 'Add +{v} to defensive parry checks with light melee blades.'],
    ['vital_strike', 'Vital Strike', [1, 2, 3], 'duelist.precisionDamage', 'Single-target melee strikes deal +{v}d6 piercing damage against unarmored or light targets.'],
    ['blade_lock', 'Blade Lock', [1, 2, 3], 'duelist.disarmDc', 'Increase DC to resist your blade-binds, disarms, and weapon pins by +{v}.'],
    ['counter_thrust', 'Counter Thrust', [2, 4, 6], 'duelist.riposteDamage', 'Successful parry ripostes deal +{v} bonus piercing damage.'],
    ['posture_break', 'Posture Break', [1, 2, 3], 'duelist.staggerPenalty', 'Striking an enemy twice in one turn inflicts -{v} penalty to their next attack roll.'],
    ['precision_edge', 'Precision Edge', [10, 20, 30], 'duelist.armorPenetration', 'Melee attacks ignore {v}% of target physical damage resistance.'],
    ['honed_reflexes', 'Honed Reflexes', [1, 2, 3], 'duelist.initiativeBonus', 'Gain +{v} to Initiative rolls when wielding light finesse weapons.'],
    ['arterial_slice', 'Arterial Slice', [1, 2, 3], 'duelist.bleedRounds', 'Critical hits inflict arterial bleeding dealing 1d6 damage for {v} rounds.'],
    ['steel_resolve', 'Steel Resolve', [1, 2, 3], 'duelist.willBonus', 'Add +{v} to Will and Spirit saves against fear and charm effects during duels.'],
    ['punishing_riposte', 'Punishing Riposte', [1, 2, 3], 'duelist.freeRiposte', 'When an enemy misses you with a melee attack by 5 or more, riposte costs -{v} AP.'],
    ['feint_exploitation', 'Feint Exploitation', [1, 2, 3], 'duelist.feintBonus', 'Gain +{v} to attack rolls against targets you successfully feinted against this turn.'],
    ['cross_guard', 'Cross Guard', [1, 2, 3], 'duelist.shieldlessAc', 'When dual-wielding without a shield, gain +{v} shield bonus to AC.'],
    ['dueling_poise', 'Dueling Poise', [1, 2, 3], 'duelist.knockdownResist', 'Add +{v} to checks against being knocked prone, shoved, or displaced.'],
    ['fencing_stride', 'Fencing Stride', [5, 10, 15], 'duelist.lungeReach', 'Increase lunge reach by +{v} ft on your first melee attack each turn.'],
    ['lethal_crescendo', 'Lethal Crescendo', [1, 2, 3], 'duelist.executeBonus', 'Melee attacks against targets below 30% HP deal +{v}d8 extra damage.'],
    ['duelist_mastery', 'Duelist Mastery', [1, 2, 3], 'duelist.critMultiplier', 'Critical strikes with finesse blades gain +{v} damage multiplier step and generate +1 Momentum.']
  ],
  shadowdancer: [
    ['blurred_motion', 'Blurred Motion', [1, 2, 3], 'shadowdancer.missChance', 'Moving at least 20 ft grants {v}0% concealment miss chance against ranged attacks for 1 round.'],
    ['shadow_feint', 'Shadow Feint', [1, 2, 3], 'shadowdancer.feintDc', 'Add +{v} to Deception and Stealth checks made to feint or create openings.'],
    ['silent_steel', 'Silent Steel', [33, 66, 100], 'shadowdancer.stealthNoise', 'Drawing, sheathing, and striking with blades produces {v}% less sound.'],
    ['blind_spot_strike', 'Blind Spot Strike', [1, 2, 3], 'shadowdancer.flankingDamage', 'Melee strikes against flanked or flanked-adjacent targets deal +{v}d6 damage.'],
    ['evasive_twist', 'Evasive Twist', [1, 2, 3], 'shadowdancer.opportunityDisadvantage', 'Opportunity attacks made against you have disadvantage and suffer -{v} to hit.'],
    ['smoke_drift', 'Smoke Drift', [5, 10, 15], 'shadowdancer.stealthSpeed', 'Add +{v} ft to movement while remaining concealed or lightly obscured.'],
    ['phantom_reach', 'Phantom Reach', [1, 2, 3], 'shadowdancer.reachBonus', 'Acrobatic leaps and dashes increase attack reach by +{v} ft during that action.'],
    ['ambush_flow', 'Ambush Flow', [1, 2, 3], 'shadowdancer.startMomentum', 'Starting combat from concealment immediately grants +{v} Momentum.'],
    ['fleeting_presence', 'Fleeting Presence', [1, 2, 3], 'shadowdancer.hideBonus', 'Gain +{v} bonus to Stealth checks immediately after performing a melee strike.'],
    ['flicker_dash', 'Flicker Dash', [5, 10, 15], 'shadowdancer.teleportStep', 'Spend 2 Momentum to perform a short blurred dash of {v} ft without touching ground.'],
    ['deceptive_footwork', 'Deceptive Footwork', [1, 2, 3], 'shadowdancer.acVsTarget', 'Designate one foe; gain +{v} AC against attacks from that target for 1 round.'],
    ['mirage_strike', 'Mirage Strike', [1, 2, 3], 'shadowdancer.decoyBonus', 'Leave an afterimage that absorbs {v}d6 damage before dissipating.'],
    ['shadow_riposte', 'Shadow Riposte', [1, 2, 3], 'shadowdancer.blindDuration', 'Riposting an attack from behind blinds the attacker for {v} round(s).'],
    ['unseen_momentum', 'Unseen Momentum', [1, 2, 3], 'shadowdancer.saveBonus', 'Add +{v} to all saving throws while unseen or heavily obscured.'],
    ['elusive_grace', 'Elusive Grace', [1, 2, 3], 'shadowdancer.apRefund', 'Dodge or evade all attacks in a single round to refund {v} AP on your next turn.'],
    ['shadowdancer_mastery', 'Shadowdancer Mastery', [1, 2, 3], 'shadowdancer.allShadow', 'Gain +{v} to Stealth and Acrobatics, and +1 use of Phantom Step per encounter.']
  ]
};

const SIGNATURE_NAMES = {
  cyclone_pivot: 'Cyclone Pivot',
  infinite_cadence: 'Infinite Cadence',
  riposte_flourish: 'Riposte Flourish',
  severing_tempo: 'Severing Tempo',
  phantom_step: 'Phantom Step',
  dance_of_a_thousand_edges: 'Dance of a Thousand Edges'
};

export const BLADEDANCER_TREES = BLADEDANCER_TREE_META.map(meta => {
  const short = meta.short;
  const nodeId = slot => `cr1_bladedancer_${short}_${slot}`;

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
      passiveSpellId: `cr1_bladedancer_${short}_pas_${slug}`,
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
    grantId: `bd_${slot === 'signature' ? 'sig' : 'cap'}_${spell}`,
    passiveSpellId: null,
    maxRanks: 1,
    minLevel,
    requiresPoints,
    requires: predecessors.map(nodeId),
    requiresAll: true,
    column: 1,
    row,
    effectText: `Grant bd_${slot === 'signature' ? 'sig' : 'cap'}_${spell}; manual ACTION, no optional pick consumed.`,
    rankValues: [{ rank: 1, text: `Grant bd_${slot === 'signature' ? 'sig' : 'cap'}_${spell}.`, values: {} }]
  })));

  return { ...identity, id: meta.id, meta, nodes };
});

export const BLADEDANCER_TALENT_NODES = BLADEDANCER_TREES.flatMap(tree => tree.nodes);

export const BLADEDANCER_PASSIVE_RECORDS = BLADEDANCER_TALENT_NODES
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
    sourceRefs: ['Bladedancer Content Lock']
  }));

export const BLADEDANCER_TALENT_CAPACITY = {
  trees: 3,
  nodes: 54,
  perTreeRanks: BLADEDANCER_TREES.map(tree => ({
    treeId: tree.id,
    maxRanks: tree.nodes.reduce((total, node) => total + node.maxRanks, 0)
  })),
  totalRankCapacity: 150,
  characterPointCap: 50
};

export const BLADEDANCER_FLOW_MASTER = BLADEDANCER_TREES.find(t => t.id === 'flowmaster')?.nodes || [];
export const BLADEDANCER_DUELIST = BLADEDANCER_TREES.find(t => t.id === 'duelist')?.nodes || [];
export const BLADEDANCER_SHADOW_DANCER = BLADEDANCER_TREES.find(t => t.id === 'shadowdancer')?.nodes || [];
