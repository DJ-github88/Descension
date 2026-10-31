const identity = {
  classId: 'inscriptor',
  rulesetVersion: 'cr-review-r1',
  authoredOnly: true,
  executionEnabled: false,
  applicationMode: 'manual-tabletop',
  automatedCapabilities: [],
  manualOnly: true,
  manualNotice: 'Manual tabletop only; no automatic rune placement, resonance generation, triggering, or damage.'
};

export const INSCRIPTOR_TREE_META = [
  {
    id: 'runebinder',
    name: 'Runebinder',
    stem: 'runebinder',
    short: 'rnb',
    signature: 'sigil_matrix',
    capstone: 'prime_monolith',
    signatureNode: 'cr1_inscriptor_runebinder_signature',
    capstoneNode: 'cr1_inscriptor_runebinder_capstone',
    tagline: 'Carving persistent ground runes, spatial zone denial, trigger traps, and geometric lattice explosions.'
  },
  {
    id: 'enchanter',
    name: 'Enchanter',
    stem: 'enchanter',
    short: 'enc',
    signature: 'glyph_of_aegis',
    capstone: 'living_runic_chassis',
    signatureNode: 'cr1_inscriptor_enchanter_signature',
    capstoneNode: 'cr1_inscriptor_enchanter_capstone',
    tagline: 'Engraving equipment with living syntax, reinforcing armor plates, and creating reactive barrier enchantments.'
  },
  {
    id: 'glyphweaver',
    name: 'Glyphweaver',
    stem: 'glyphweaver',
    short: 'glw',
    signature: 'tethering_script',
    capstone: 'grand_lexicon_unbound',
    signatureNode: 'cr1_inscriptor_glyphweaver_signature',
    capstoneNode: 'cr1_inscriptor_glyphweaver_capstone',
    tagline: 'Floating runic scripts, projectile redirection, spell interception lattices, and rapid syntax discharges.'
  }
];

const gates = [
  [1, 0, []], [1, 0, []], [1, 0, []], [2, 5, ['p01']],
  [3, 10, ['p03']], [3, 10, ['p04']], [4, 15, ['p05', 'signature']], [4, 15, ['p06']],
  [5, 20, ['p07']], [5, 20, ['p08']], [6, 25, ['p09']], [6, 25, ['p10']],
  [7, 30, ['p11']], [8, 35, ['p12']], [9, 40, ['p13']], [10, 45, ['p14']]
];

const rows = {
  runebinder: [
    ['resonance_surge', 'Resonance Surge', [1, 2, 3], 'runebinder.resonanceOnTrigger', 'Gain +{v} Runic Resonance whenever an etched rune is triggered by an enemy.'],
    ['etched_ground', 'Etched Ground', [5, 10, 15], 'runebinder.trapRadius', 'Increase trigger radius of etched ground runes by +{v} ft.'],
    ['shackling_syntax', 'Shackling Syntax', [1, 2, 3], 'runebinder.slowPenalty', 'Enemies triggering a ground rune have their movement speed reduced by {v}0 ft for 1 round.'],
    ['glyph_extension', 'Glyph Extension', [1, 2, 3], 'runebinder.activeCapBonus', 'Increase maximum active ground runes you can sustain simultaneously by +{v}.'],
    ['lithic_pressure', 'Lithic Pressure', [1, 2, 3], 'runebinder.forceDamage', 'Ground rune detonations deal +{v}d6 bonus force damage.'],
    ['trigger_amplification', 'Trigger Amplification', [1, 2, 3], 'runebinder.saveDc', 'Add +{v} to the saving throw DC to resist your etched runes.'],
    ['planar_inscription', 'Planar Inscription', [1, 2, 3], 'runebinder.rangeBonus', 'Increase casting and etching range for ground runes by +{v}0 ft.'],
    ['stone_anchoring', 'Stone Anchoring', [2, 4, 6], 'runebinder.dispelResist', 'Add +{v} to checks made to resist having your runes dispelled or suppressed.'],
    ['detonation_radius', 'Detonation Radius', [5, 10, 15], 'runebinder.burstRadius', 'Detonating an active rune increases its blast radius by +{v} ft.'],
    ['shatter_script', 'Shatter Script', [1, 2, 3], 'runebinder.armorBreak', 'Rune detonations reduce target armor value by {v} for 2 rounds.'],
    ['runic_snare', 'Runic Snare', [1, 2, 3], 'runebinder.rootDuration', 'Targets failing saves against trapping runes are immobilized for {v} round(s).'],
    ['reactive_etching', 'Reactive Etching', [1, 2, 3], 'runebinder.reactionEtch', 'When an enemy charges within 10 ft, reaction etch a defensive rune with +{v} DC.'],
    ['gravity_rune', 'Gravity Rune', [5, 10, 15], 'runebinder.pullDistance', 'Enemies triggering gravitational runes are pulled {v} ft toward the rune center.'],
    ['resonance_overflow', 'Resonance Overflow', [1, 2, 3], 'runebinder.refundOnThree', 'Triggering 3 runes in one encounter refunds {v} AP immediately.'],
    ['chained_glyphs', 'Chained Glyphs', [1, 2, 3], 'runebinder.cascadeDamage', 'When one rune detonates, adjacent runes within 15 ft deal +{v}d8 cascade damage.'],
    ['runebinder_mastery', 'Runebinder Mastery', [1, 2, 3], 'runebinder.masteryAll', 'Add +{v} to all rune damage dice and +1 to maximum Runic Resonance capacity.']
  ],
  enchanter: [
    ['blade_etching', 'Blade Etching', [1, 2, 3], 'enchanter.weaponBonus', 'Weapon inscribed with runic syntax gains +{v} to attack rolls and deals force damage.'],
    ['armor_carving', 'Armor Carving', [1, 2, 3], 'enchanter.armorBonus', 'Armor inscribed with runic glyphs grants +{v} bonus to AC.'],
    ['resonance_shield', 'Resonance Shield', [5, 10, 15], 'enchanter.tempHpOnEtch', 'Inscribing an ally equipment piece grants them {v} temporary HP.'],
    ['warding_lattice', 'Warding Lattice', [2, 4, 6], 'enchanter.elementalMitigation', 'Inscribed armor reduces incoming fire, cold, and lightning damage by {v}.'],
    ['keen_edge_rune', 'Keen Edge Rune', [1, 2, 3], 'enchanter.critBonus', 'Inscribed weapons have critical hit threshold reduced by {v}.'],
    ['reinforcement_script', 'Reinforcement Script', [1, 2, 3], 'enchanter.saveBonus', 'Allies wearing inscribed gear gain +{v} to all physical saving throws.'],
    ['runic_infusion', 'Runic Infusion', [1, 2, 3], 'enchanter.energyDamage', 'Inscribed weapon strikes deal an extra {v}d6 force or arcane damage.'],
    ['deflecting_sigil', 'Deflecting Sigil', [1, 2, 3], 'enchanter.deflectMisses', 'When an attack misses an inscribed ally, attacker suffers {v}d4 backlash damage.'],
    ['elemental_etching', 'Elemental Etching', [1, 2, 3], 'enchanter.elementChoice', 'Choose fire, cold, or storm; inscribed weapons convert {v}0% physical damage to that type.'],
    ['enduring_inscriptions', 'Enduring Inscriptions', [1, 2, 3], 'enchanter.durationMultiplier', 'Equipment enchantments last {v} additional encounters or hours.'],
    ['reactive_ward', 'Reactive Ward', [5, 10, 15], 'enchanter.reactiveShield', 'When struck by a critical hit, inscribed armor absorbs {v} damage automatically.'],
    ['sunder_resistance', 'Sunder Resistance', [1, 2, 3], 'enchanter.durabilityBonus', 'Inscribed weapons and armor cannot be sundered or corroded; wearer gains +{v} Will.'],
    ['sympathetic_engraving', 'Sympathetic Engraving', [1, 2, 3], 'enchanter.allyShare', 'When you spend Resonance, inscribed allies within 30 ft gain +{v} to next roll.'],
    ['harmonic_armor', 'Harmonic Armor', [2, 4, 6], 'enchanter.drFlat', 'Inscribed armor provides DR {v}/- against physical slashing and piercing.'],
    ['transmutation_carving', 'Transmutation Carving', [1, 2, 3], 'enchanter.weightReduction', 'Inscribed heavy armor reduces speed penalty by {v}0 ft and weighs 50% less.'],
    ['enchanter_mastery', 'Enchanter Mastery', [1, 2, 3], 'enchanter.masteryEnchant', 'You may maintain {v} additional active equipment enchantments simultaneously.']
  ],
  glyphweaver: [
    ['aerial_script', 'Aerial Script', [1, 2, 3], 'glyphweaver.flyRange', 'Floating glyphs can be cast at a distance of up to +{v}0 ft.'],
    ['projectile_deflection', 'Projectile Deflection', [1, 2, 3], 'glyphweaver.missRanged', 'Floating glyph lattice imposes disadvantage and -{v} on incoming ranged attacks.'],
    ['resonance_siphon', 'Resonance Siphon', [1, 2, 3], 'glyphweaver.drainMana', 'Spending Runic Resonance burns {v} mana from enemy spellcasters within 20 ft.'],
    ['spell_interception', 'Spell Interception', [2, 4, 6], 'glyphweaver.spellAbsorb', 'Floating glyph intercepts a targeted spell, reducing its damage by {v}d6.'],
    ['floating_lexicon', 'Floating Lexicon', [1, 2, 3], 'glyphweaver.orbitGlyphs', 'Maintain up to {v} orbiting protective glyphs around yourself.'],
    ['glyph_chaining', 'Glyph Chaining', [1, 2, 3], 'glyphweaver.multiTarget', 'Ranged glyph attacks can chain to {v} additional enemy within 15 ft.'],
    ['echoing_cadence', 'Echoing Cadence', [1, 2, 3], 'glyphweaver.doubleCast', 'When casting a 1 AP glyph, {v}0% chance to repeat its effect at no AP cost.'],
    ['runic_counterflow', 'Runic Counterflow', [1, 2, 3], 'glyphweaver.counterBonus', 'Add +{v} to checks made to counter or unravel enemy spells.'],
    ['dispersal_script', 'Dispersal Script', [5, 10, 15], 'glyphweaver.teleportDisperse', 'Disperse into glowing runic fragments, teleporting {v} ft when struck.'],
    ['leyline_channel', 'Leyline Channel', [1, 2, 3], 'glyphweaver.regenResonance', 'Generate +{v} Runic Resonance at the start of each round if standing still.'],
    ['overload_discharge', 'Overload Discharge', [1, 2, 3], 'glyphweaver.overloadDice', 'Detonate all floating glyphs simultaneously; each deals {v}d6 force damage.'],
    ['linguistic_barrier', 'Linguistic Barrier', [2, 4, 6], 'glyphweaver.psychicMitigation', 'Immune to verbal charms and confusion; reduce psychic damage by {v}.'],
    ['kinetic_redirection', 'Kinetic Redirection', [1, 2, 3], 'glyphweaver.redirectDamage', 'Redirect {v}0% of a deflected spell back at the original caster.'],
    ['harmonic_lexicon', 'Harmonic Lexicon', [1, 2, 3], 'glyphweaver.apDiscount', 'High-tier glyph spells cost -{v} AP (minimum 1 AP).'],
    ['pure_syntax', 'Pure Syntax', [1, 2, 3], 'glyphweaver.ignoreResist', 'Force damage from your glyphs ignores {v}0% of all magical resistances.'],
    ['glyphweaver_mastery', 'Glyphweaver Mastery', [1, 2, 3], 'glyphweaver.masteryGlyph', 'Gain +{v} to Spell Attack rolls and +1 use of Tethering Script per encounter.']
  ]
};

const SIGNATURE_NAMES = {
  sigil_matrix: 'Sigil Matrix',
  prime_monolith: 'Prime Monolith',
  glyph_of_aegis: 'Glyph of Aegis',
  living_runic_chassis: 'Living Runic Chassis',
  tethering_script: 'Tethering Script',
  grand_lexicon_unbound: 'Grand Lexicon Unbound'
};

export const INSCRIPTOR_TREES = INSCRIPTOR_TREE_META.map(meta => {
  const short = meta.short;
  const nodeId = slot => `cr1_inscriptor_${short}_${slot}`;

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
      passiveSpellId: `cr1_inscriptor_${short}_pas_${slug}`,
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
    grantId: `insc_${slot === 'signature' ? 'sig' : 'cap'}_${spell}`,
    passiveSpellId: null,
    maxRanks: 1,
    minLevel,
    requiresPoints,
    requires: predecessors.map(nodeId),
    requiresAll: true,
    column: 1,
    row,
    effectText: `Grant insc_${slot === 'signature' ? 'sig' : 'cap'}_${spell}; manual ACTION, no optional pick consumed.`,
    rankValues: [{ rank: 1, text: `Grant insc_${slot === 'signature' ? 'sig' : 'cap'}_${spell}.`, values: {} }]
  })));

  return { ...identity, id: meta.id, meta, nodes };
});

export const INSCRIPTOR_TALENT_NODES = INSCRIPTOR_TREES.flatMap(tree => tree.nodes);

export const INSCRIPTOR_PASSIVE_RECORDS = INSCRIPTOR_TALENT_NODES
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
    sourceRefs: ['Inscriptor Content Lock']
  }));

export const INSCRIPTOR_TALENT_CAPACITY = {
  trees: 3,
  nodes: 54,
  perTreeRanks: INSCRIPTOR_TREES.map(tree => ({
    treeId: tree.id,
    maxRanks: tree.nodes.reduce((total, node) => total + node.maxRanks, 0)
  })),
  totalRankCapacity: 150,
  characterPointCap: 50
};

export const INSCRIPTOR_RUNEBINDER = INSCRIPTOR_TREES.find(t => t.id === 'runebinder')?.nodes || [];
export const INSCRIPTOR_ENCHANTER = INSCRIPTOR_TREES.find(t => t.id === 'enchanter')?.nodes || [];
export const INSCRIPTOR_GLYPHWEAVER = INSCRIPTOR_TREES.find(t => t.id === 'glyphweaver')?.nodes || [];
