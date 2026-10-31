const identity = {
  classId: 'exorcist',
  rulesetVersion: 'cr-review-r1',
  authoredOnly: true,
  executionEnabled: false,
  applicationMode: 'manual-tabletop',
  automatedCapabilities: [],
  manualOnly: true,
  manualNotice: 'Manual tabletop only; no automatic sanctity generation, debuff transfer, condition clearing, damage, or expiry.'
};

export const EXORCIST_TREE_META = [
  {
    id: 'liturgist',
    name: 'Liturgist',
    stem: 'liturgist',
    short: 'lit',
    signature: 'salt_sanctuary',
    capstone: 'immovable_bastion',
    signatureNode: 'cr1_exorcist_liturgist_signature',
    capstoneNode: 'cr1_exorcist_liturgist_capstone',
    tagline: 'Consecrated salt boundaries, protective rites of sanctuary, and denying ground to hostile entities.'
  },
  {
    id: 'sineater',
    name: 'Sin-Eater',
    stem: 'sineater',
    short: 'se',
    signature: 'sympathetic_transference',
    capstone: 'vessel_of_pure_cleansing',
    signatureNode: 'cr1_exorcist_sineater_signature',
    capstoneNode: 'cr1_exorcist_sineater_capstone',
    tagline: 'Bearing the spiritual afflictions of allies, cleansing cursed vessels, and converting suffering into sacred power.'
  },
  {
    id: 'purger',
    name: 'Purger',
    stem: 'purger',
    short: 'pu',
    signature: 'lead_seal_rite',
    capstone: 'total_anathema',
    signatureNode: 'cr1_exorcist_purger_signature',
    capstoneNode: 'cr1_exorcist_purger_capstone',
    tagline: 'Ruthless expulsion of invading fiends, consecrated lead seals, and wielding the weighted scourge of judgment.'
  }
];

const gates = [
  [1, 0, []], [1, 0, []], [1, 0, []], [2, 5, ['p01']],
  [3, 10, ['p03']], [3, 10, ['p04']], [4, 15, ['p05', 'signature']], [4, 15, ['p06']],
  [5, 20, ['p07']], [5, 20, ['p08']], [6, 25, ['p09']], [6, 25, ['p10']],
  [7, 30, ['p11']], [8, 35, ['p12']], [9, 40, ['p13']], [10, 45, ['p14']]
];

const rows = {
  liturgist: [
    ['wide_threshold', 'Wide Threshold', [5, 10, 15], 'liturgist.thresholdRadius', 'Add +{v} ft to the radius of Consecrate Threshold and salt circles.'],
    ['consecrated_salts', 'Consecrated Salts', [1, 2, 3], 'liturgist.saltWardPoints', 'Wards and boundaries created with salt absorb +{v} additional damage.'],
    ['hallowed_cadence', 'Hallowed Cadence', [1, 2, 3], 'liturgist.chantBonus', 'Allies inside your consecrated threshold gain +{v} to all saving throws.'],
    ['sacred_repose', 'Sacred Repose', [2, 4, 6], 'liturgist.shortRestHeal', 'Allies completing a short rest within your sanctuary regain +{v} extra HP per hit die.'],
    ['ringing_bells', 'Ringing Bells', [1, 2, 3], 'liturgist.stealthDetection', 'Hostile spirits and fiends cannot enter your threshold without ringing warning bells ({v}0 ft radius).'],
    ['lead_lining', 'Lead Lining', [2, 4, 6], 'liturgist.psychicMitigation', 'Allies inside your consecrated ground reduce incoming psychic and necrotic damage by {v}.'],
    ['solemn_litany', 'Solemn Litany', [5, 10, 15], 'liturgist.litanyRange', 'Increase the range of Litany of Purging and all holy litanies by +{v} ft.'],
    ['unbroken_circle', 'Unbroken Circle', [1, 2, 3], 'liturgist.sanctityRetention', 'Gain +{v} additional Sanctity each round maintained inside an undisturbed threshold.'],
    ['radiant_brazier', 'Radiant Brazier', [1, 2, 3], 'liturgist.brazierDamage', 'Consecrated thresholds deal {v}d6 radiant damage to hostile entities crossing the boundary.'],
    ['spiritual_anchor', 'Spiritual Anchor', [1, 2, 3], 'liturgist.banishResistance', 'Allies inside your threshold gain +{v} to saves against forced movement, teleport, or plane shift.'],
    ['pure_censer', 'Pure Censer', [1, 2, 3], 'liturgist.smokeBlindness', 'Smoke from ritual censers increases concealment against aberrations and fiends by +{v}.'],
    ['firm_boundary', 'Firm Boundary', [2, 4, 6], 'liturgist.circleDuration', 'Consecrated ground and salt perimeter durations increase by +{v} rounds.'],
    ['wardens_creed', 'Warden\'s Creed', [1, 2, 3], 'liturgist.acBonus', 'While standing inside a consecrated threshold, gain +{v} to Armor Class.'],
    ['blessed_earth', 'Blessed Earth', [10, 20, 30], 'liturgist.difficultTerrain', 'Enemies moving through your consecrated ground suffer a {v}% movement speed penalty.'],
    ['sacred_geometry', 'Sacred Geometry', [1, 2, 3], 'liturgist.freeSaltAction', 'Once per encounter, casting a threshold or salt circle costs -{v} AP (minimum 1 AP).'],
    ['liturgist_mastery', 'Liturgist Mastery', [1, 2, 3], 'liturgist.masterySanctity', 'Maximum Purification Sanctity increases by +{v}, and starting Sanctity increases by +1.']
  ],
  sineater: [
    ['vessel_of_burdens', 'Vessel of Burdens', [1, 2, 3], 'sineater.sanctityOnTransfer', 'When you transfer an ally\'s condition onto yourself, gain +{v} additional Sanctity.'],
    ['iron_endurance', 'Iron Endurance', [2, 4, 6], 'sineater.conditionMitigation', 'Reduce direct damage from absorbed conditions or curses by {v}.'],
    ['sympathetic_bond', 'Sympathetic Bond', [5, 10, 15], 'sineater.transferRange', 'Increase the range of Sin-Eater transference abilities by +{v} ft.'],
    ['chastened_flesh', 'Chastened Flesh', [1, 2, 3], 'sineater.drBoost', 'While suffering from one or more active debuffs, gain +{v} Damage Reduction.'],
    ['martyrs_bread', 'Martyr\'s Bread', [2, 4, 6], 'sineater.allyHealBoost', 'When taking a debuff from an ally, heal that ally for +{v} additional HP.'],
    ['spiritual_filter', 'Spiritual Filter', [1, 2, 3], 'sineater.poisonResist', 'Gain advantage and +{v} on Constitution saves against ingested toxins, venoms, and plagues.'],
    ['transference_speed', 'Transference Speed', [1, 2, 3], 'sineater.apDiscount', 'Using Sin-Eater Burden or Litany of Purging costs -{v} AP once per encounter.'],
    ['purifying_sweat', 'Purifying Sweat', [1, 2, 3], 'sineater.earlyRecovery', 'Roll saving throws to shake off absorbed conditions at the start of your turn with +{v}.'],
    ['bearing_the_scar', 'Bearing the Scar', [2, 4, 6], 'sineater.tempHpOnAbsorb', 'Gain {v} temporary HP whenever you absorb a debuff or affliction from an ally.'],
    ['cleansing_pulse', 'Cleansing Pulse', [1, 2, 3], 'sineater.pulseDamage', 'When an absorbed condition expires or is cleansed, deal {v}d6 radiant damage to adjacent enemies.'],
    ['consecrated_blood', 'Consecrated Blood', [10, 20, 30], 'sineater.bleedResist', 'Damage from bleeding and necrotic damage is reduced by {v}%.'],
    ['host_sanctuary', 'Host Sanctuary', [1, 2, 3], 'sineater.hostAcBonus', 'An ally you recently cleansed gains +{v} AC and +{v} saves for 1 round.'],
    ['sin_communion', 'Sin Communion', [1, 2, 3], 'sineater.multiTransfer', 'You can transfer conditions from up to {v} additional allies per encounter.'],
    ['vow_of_atonement', 'Vow of Atonement', [2, 4, 6], 'sineater.willSaveBonus', 'Gain +{v} to Will saving throws when protecting a conscious ally.'],
    ['resilient_vessel', 'Resilient Vessel', [10, 20, 30], 'sineater.maxHpBoost', 'Your maximum Health increases by +{v} points.'],
    ['sineater_mastery', 'Sin-Eater Mastery', [1, 2, 3], 'sineater.masteryEffect', 'Absorbed conditions have their duration halved (minimum 1 round); gain +{v} Sanctity on completion.']
  ],
  purger: [
    ['scourge_technique', 'Scourge Technique', [1, 2, 3], 'purger.scourgeDamage', 'Lead-weighted scourges and consecrated whips deal +{v}d6 physical/radiant damage.'],
    ['lead_weight', 'Lead Weight', [5, 10, 15], 'purger.slowSpeed', 'Scourge attacks reduce enemy movement speed by -{v} ft on hit.'],
    ['brand_of_submission', 'Brand of Submission', [1, 2, 3], 'purger.brandDamage', 'Attacks against branded or possessed entities deal +{v}d8 bonus radiant damage.'],
    ['expulsion_rite', 'Expulsion Rite', [1, 2, 3], 'purger.extractionDc', 'DC for extracting possessing entities or mental parasites increases by +{v}.'],
    ['righteous_wrath', 'Righteous Wrath', [1, 2, 3], 'purger.critReduction', 'Critical strike threshold against aberrations, fiends, and undead reduced by {v}.'],
    ['anathema_strike', 'Anathema Strike', [2, 4, 6], 'purger.radiantPenetration', 'Your radiant and force damage ignores {v} points of enemy damage reduction.'],
    ['lead_shackles', 'Lead Shackles', [1, 2, 3], 'purger.chainDuration', 'Chains of Chastisement and binding rites last +{v} additional round.'],
    ['hallowed_zeal', 'Hallowed Zeal', [1, 2, 3], 'purger.initiative', 'Add +{v} to Initiative rolls when engaging supernatural or unholy threats.'],
    ['severing_lead', 'Severing Lead', [10, 20, 30], 'purger.spellDrain', 'Scourge attacks burn {v}% of the target\'s current casting resources or mana.'],
    ['scourge_cleave', 'Scourge Cleave', [1, 2, 3], 'purger.multiTargetScourge', 'Scourge of Submission strikes can target up to {v} additional adjacent enemies.'],
    ['lead_reliquary_craft', 'Lead Reliquary Craft', [1, 2, 3], 'purger.reliquaryCapacity', 'Your lead reliquaries can trap and neutralize up to {v} additional entity taints.'],
    ['radiant_condemnation', 'Radiant Condemnation', [2, 4, 6], 'purger.radiantBonus', 'All radiant damage dealt by your spells increases by +{v}.'],
    ['unyielding_will', 'Unyielding Will', [1, 2, 3], 'purger.mentalSave', 'Gain advantage and +{v} on saves against charm, possession, and mental domination.'],
    ['banishing_force', 'Banishing Force', [1, 2, 3], 'purger.banishHpThreshold', 'Smite the Unclean and banishing abilities increase HP execution threshold by +{v}0 HP.'],
    ['relentless_scourge', 'Relentless Scourge', [1, 2, 3], 'purger.apRefund', 'Slaying an unholy foe or extracting a spirit refunds {v} AP once per combat.'],
    ['purger_mastery', 'Purger Mastery', [10, 20, 30], 'purger.masteryScaling', 'All radiant and banishing damage against fiends and undead increases by +{v}%.']
  ]
};

const SIGNATURE_NAMES = {
  salt_sanctuary: 'Salt Sanctuary',
  immovable_bastion: 'Immovable Bastion',
  sympathetic_transference: 'Sympathetic Transference',
  vessel_of_pure_cleansing: 'Vessel of Pure Cleansing',
  lead_seal_rite: 'Lead Seal Rite',
  total_anathema: 'Total Anathema'
};

export const EXORCIST_TREES = EXORCIST_TREE_META.map(meta => {
  const nodeId = slot => slot === 'signature' ? meta.signatureNode
    : slot === 'capstone' ? meta.capstoneNode
      : `cr1_exorcist_${meta.stem}_${slot}`;

  const nodes = rows[meta.id].map(([suffix, name, values, mechanic, text], index) => {
    const [minLevel, requiresPoints, predecessors] = gates[index];
    const slot = `p${String(index + 1).padStart(2, '0')}`;
    return {
      ...identity,
      id: nodeId(slot),
      treeId: meta.id,
      name,
      passiveSpellId: `cr1_exorcist_${meta.short}_${suffix}`,
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
      }))
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
    grantId: `exo_${slot === 'signature' ? 'sig' : 'cap'}_${spell}`,
    passiveSpellId: null,
    maxRanks: 1,
    minLevel,
    requiresPoints,
    requires: predecessors.map(nodeId),
    requiresAll: true,
    column: 1,
    row,
    effectText: `Grant exo_${slot === 'signature' ? 'sig' : 'cap'}_${spell}; manual ACTION, no optional pick consumed.`,
    rankValues: [{ rank: 1, text: `Grant exo_${slot === 'signature' ? 'sig' : 'cap'}_${spell}.`, values: {} }]
  })));

  return { ...identity, id: meta.id, meta, nodes };
});

export const EXORCIST_TALENT_NODES = EXORCIST_TREES.flatMap(tree => tree.nodes);

export const EXORCIST_PASSIVE_RECORDS = EXORCIST_TALENT_NODES
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
    sourceRefs: ['Exorcist content lock']
  }));

export const EXORCIST_TALENT_CAPACITY = {
  trees: 3,
  nodes: 54,
  perTreeRanks: EXORCIST_TREES.map(tree => ({
    treeId: tree.id,
    maxRanks: tree.nodes.reduce((total, node) => total + node.maxRanks, 0)
  })),
  totalRankCapacity: 150,
  characterPointCap: 50
};

export const EXORCIST_LITURGIST = EXORCIST_TREES.find(t => t.id === 'liturgist')?.nodes || [];
export const EXORCIST_SINEATER = EXORCIST_TREES.find(t => t.id === 'sineater')?.nodes || [];
export const EXORCIST_PURGER = EXORCIST_TREES.find(t => t.id === 'purger')?.nodes || [];
