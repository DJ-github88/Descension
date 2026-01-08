// ============================================
// MARTYR TALENT TREES
// ============================================

export const MARTYR_PROTECTOR = [
  // Tier 0 - Central shield core
  {
    id: 'prot_t0_divine_shield',
    name: 'Divine Shield',
    description: 'Create a divine shield that absorbs 2d6 damage per rank. Lasts 1 minute.',
    icon: 'spell_holy_divineshield',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Inner hexagon (6-sided shield formation)
  {
    id: 'prot_t1_sacred_barrier',
    name: 'Sacred Barrier',
    description: 'Create sacred barriers that block enemy movement. 10ft walls per rank, armor 18.',
    icon: 'spell_holy_devotionaura',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'prot_t0_divine_shield',
  },
  {
    id: 'prot_t1_protective_aura',
    name: 'Protective Aura',
    description: 'Emit a protective aura. Allies within 10ft gain +1 armor per rank.',
    icon: 'spell_holy_auraoflight',
    maxRanks: 4,
    position: { x: 3, y: 1 },
    requires: 'prot_t0_divine_shield',
  },
  {
    id: 'prot_t1_shield_wall',
    name: 'Shield Wall',
    description: 'Form a shield wall with allies. Adjacent allies gain +2 armor and can use your shield bonus.',
    icon: 'ability_warrior_shieldwall',
    maxRanks: 2,
    position: { x: 2, y: 1 },
    requires: 'prot_t0_divine_shield',
  },

  // Tier 2 - Middle hexagon (expanding defensive ring)
  {
    id: 'prot_t2_divine_protection',
    name: 'Divine Protection',
    description: 'Divine protection surrounds you. Resistance to all damage from one source per rank.',
    icon: 'spell_holy_sealofprotection',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'prot_t1_sacred_barrier',
  },
  {
    id: 'prot_t2_warding_circle',
    name: 'Warding Circle',
    description: 'Create a warding circle that prevents teleportation and planar travel within 20ft.',
    icon: 'spell_holy_circleofrenewal',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'prot_t1_shield_wall',
  },
  {
    id: 'prot_t2_impenetrable_barrier',
    name: 'Impenetrable Barrier',
    description: 'Your barriers become impenetrable. Creatures cannot pass through or attack through them.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'prot_t1_protective_aura',
  },

  // Tier 3 - Outer hexagon (fortified perimeter)
  {
    id: 'prot_t3_sanctuary',
    name: 'Sanctuary',
    description: 'Create a sanctuary area. Creatures cannot attack within 15ft of you.',
    icon: 'spell_holy_sanctuary',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'prot_t2_divine_protection',
  },
  {
    id: 'prot_t3_fortress_of_faith',
    name: 'Fortress of Faith',
    description: 'Create a fortress of faith. 30ft radius area where allies cannot be critically hit.',
    icon: 'spell_holy_prayerofmendingtga',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'prot_t2_impenetrable_barrier',
  },

  // Tier 4 - Bastion towers (corner fortifications)
  {
    id: 'prot_t4_divine_bulwark',
    name: 'Divine Bulwark',
    description: 'Become a divine bulwark. Redirect all damage from one ally to yourself per rank.',
    icon: 'spell_holy_devotionaura',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'prot_t3_sanctuary',
  },
  {
    id: 'prot_t4_eternal_guardian',
    name: 'Eternal Guardian',
    description: 'Become an eternal guardian. Immune to unconsciousness while protecting allies.',
    icon: 'spell_holy_heroism',
    maxRanks: 1,
    position: { x: 4, y: 4 },
    requires: 'prot_t3_fortress_of_faith',
  },

  // Tier 5 - Citadel center (ultimate fortress convergence)
  {
    id: 'prot_t5_invincible_fortress',
    name: 'Invincible Fortress',
    description: 'Create an invincible fortress. 50ft radius area is completely protected from all external effects.',
    icon: 'spell_holy_divineintervention',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: ['prot_t4_divine_bulwark', 'prot_t4_eternal_guardian', 'prot_t2_warding_circle'],
    requiresAll: true,
  }
];

// Redeemer Specialization - Concentric healing wave pattern
export const MARTYR_REDEEMER = [
  // Tier 0 - Central healing well
  {
    id: 'red_t0_lay_on_hands',
    name: 'Lay on Hands',
    description: 'Lay hands on a creature to heal 2d6 HP per rank. Can be used as an action.',
    icon: 'spell_holy_layonhands',
    maxRanks: 5,
    position: { x: 2, y: 1 },
    requires: null,
  },

  // Tier 1 - First ripple (immediate healing circle)
  {
    id: 'red_t1_healing_touch',
    name: 'Healing Touch',
    description: 'Your touch heals wounds. Spend a 1 action point to heal 1d8 + your level HP.',
    icon: 'spell_holy_healingtouch',
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: 'red_t0_lay_on_hands',
  },
  {
    id: 'red_t1_restoring_light',
    name: 'Restoring Light',
    description: 'Emit restoring light. Heal one condition from an ally within 30ft.',
    icon: 'spell_holy_restoration',
    maxRanks: 2,
    position: { x: 2, y: 0 },
    requires: 'red_t0_lay_on_hands',
  },
  {
    id: 'red_t1_purify',
    name: 'Purify',
    description: 'Purify toxins and diseases. Remove poison and disease effects from one creature.',
    icon: 'spell_holy_purifyingpower',
    maxRanks: 3,
    position: { x: 3, y: 0 },
    requires: 'red_t0_lay_on_hands',
  },

  // Tier 2 - Second ripple (expanding healing wave)
  {
    id: 'red_t2_cure_wounds',
    name: 'Cure Wounds',
    description: 'Cure wounds with divine energy. Heal 3d8 + your spellcasting modifier HP.',
    icon: 'spell_holy_renew',
    maxRanks: 3,
    position: { x: 0, y: 1 },
    requires: 'red_t1_healing_touch',
  },
  {
    id: 'red_t2_mass_healing',
    name: 'Mass Healing',
    description: 'Heal multiple targets. Heal up to 3 creatures within 30ft for 2d6 HP each.',
    icon: 'spell_holy_prayerofhealing',
    maxRanks: 4,
    position: { x: 4, y: 1 },
    requires: 'red_t1_purify',
  },

  // Tier 3 - Third ripple (powerful restoration waves)
  {
    id: 'red_t3_greater_restoration',
    name: 'Greater Restoration',
    description: 'Restore life force completely. Remove all curses, diseases, and poisons from one creature.',
    icon: 'spell_holy_greaterheal',
    maxRanks: 2,
    position: { x: 1, y: 2 },
    requires: 'red_t2_cure_wounds',
  },
  {
    id: 'red_t3_healing_aura',
    name: 'Healing Aura',
    description: 'Emit a healing aura. Allies within 20ft regain 2d6 HP at the start of their turns.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'red_t2_mass_healing',
  },

  // Tier 4 - Fourth ripple (divine intervention waves)
  {
    id: 'red_t4_miracle',
    name: 'Miracle',
    description: 'Perform a miracle. Duplicate any spell of 5th level or lower.',
    icon: 'spell_holy_holyguidance',
    maxRanks: 1,
    position: { x: 0, y: 3 },
    requires: 'red_t3_greater_restoration',
  },
  {
    id: 'red_t4_resurrection',
    name: 'Resurrection',
    description: 'Bring the dead back to life. Restore a creature that has been dead for no more than 10 days.',
    icon: 'spell_holy_resurrection',
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: 'red_t3_greater_restoration',
  },
  {
    id: 'red_t4_true_resurrection',
    name: 'True Resurrection',
    description: 'True resurrection. Restore a creature that has been dead for any amount of time.',
    icon: 'spell_holy_resurrection',
    maxRanks: 1,
    position: { x: 4, y: 3 },
    requires: 'red_t3_healing_aura',
  },

  // Tier 5 - Epicenter convergence (ultimate healing waves)
  {
    id: 'red_t5_divine_intervention',
    name: 'Divine Intervention',
    description: 'Call upon divine intervention. Automatically succeed on one roll or save.',
    icon: 'spell_holy_divineintervention',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['red_t4_miracle', 'red_t4_resurrection', 'red_t4_true_resurrection'],
    requiresAll: true,
  }
];

// Avenger Specialization - Diagonal sword strike pattern (blade of judgment)
export const MARTYR_AVENGER = [
  // Tier 0 - Blade tip (point of judgment)
  {
    id: 'aven_t0_divine_judgment',
    name: 'Divine Judgment',
    description: 'Pass divine judgment. Deal 2d6 radiant damage to one creature. Spirit modifier + rank.',
    icon: 'spell_holy_righteousfury',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Blade edges (diagonal strikes)
  {
    id: 'aven_t1_sacred_flame',
    name: 'Sacred Flame',
    description: 'Ignite enemies with sacred flame. Deal 2d8 radiant damage, no attack roll required.',
    icon: 'spell_holy_searinglight',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'aven_t0_divine_judgment',
  },
  {
    id: 'aven_t1_wrathful_smite',
    name: 'Wrathful Smite',
    description: 'Smite with divine wrath. Next attack deals +2d6 radiant damage and forces a Spirit save.',
    icon: 'spell_holy_crusaderstrike',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'aven_t0_divine_judgment',
  },

  // Tier 2 - Cross guard (blade reinforcement)
  {
    id: 'aven_t2_avenging_angel',
    name: 'Avenging Angel',
    description: 'Become an avenging angel. Gain flying speed and +2 to attack and damage rolls.',
    icon: 'ability_paladin_judgementofthepure',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'aven_t1_sacred_flame',
  },
  {
    id: 'aven_t2_holy_avenger',
    name: 'Holy Avenger',
    description: 'Wield a holy avenger weapon. Your weapon becomes magical and deals +1d6 radiant damage.',
    icon: 'spell_holy_auraoflight',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'aven_t1_wrathful_smite',
  },

  // Tier 3 - Blade spine (central striking power)
  {
    id: 'aven_t3_divine_retribution',
    name: 'Divine Retribution',
    description: 'Divine retribution strikes down attackers. Deal 2d6 radiant damage when hit in melee.',
    icon: 'spell_holy_blessingofstrength',
    maxRanks: 4,
    position: { x: 2, y: 2 },
    requires: 'aven_t1_sacred_flame',
  },
  {
    id: 'aven_t3_crusader_strike',
    name: 'Crusader Strike',
    description: 'Strike with crusader fury. Deal weapon damage + 2d6 radiant damage, heal for half the damage.',
    icon: 'spell_holy_crusaderstrike',
    maxRanks: 4,
    position: { x: 3, y: 2 },
    requires: 'aven_t1_wrathful_smite',
  },

  // Tier 4 - Blade wings (sweeping strikes)
  {
    id: 'aven_t4_wrath_of_heaven',
    name: 'Wrath of Heaven',
    description: 'Call down wrath of heaven. 20ft radius deals 4d6 radiant damage, half to allies.',
    icon: 'spell_holy_sealofwrath',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'aven_t3_divine_retribution',
  },
  {
    id: 'aven_t4_sword_of_justice',
    name: 'Sword of Justice',
    description: 'Wield the sword of justice. Attacks ignore resistance and deal maximum damage on critical hits.',
    icon: 'spell_holy_righteousnessaura',
    maxRanks: 2,
    position: { x: 2, y: 3 },
    requires: 'aven_t3_crusader_strike',
  },
  {
    id: 'aven_t4_final_judgment',
    name: 'Final Judgment',
    description: 'Execute final judgment. Instantly kill a creature with 50 HP or less per rank.',
    icon: 'spell_holy_divineintervention',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'aven_t3_crusader_strike',
  },

  // Tier 5 - Blade point (piercing judgment)
  {
    id: 'aven_t5_divine_vengeance',
    name: 'Divine Vengeance',
    description: 'Divine vengeance empowers you. Deal +2d6 radiant damage per rank when an ally is reduced to 0 HP.',
    icon: 'spell_holy_blessedlife',
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: 'aven_t4_sword_of_justice',
  },
  {
    id: 'aven_t5_apocalypse',
    name: 'Apocalypse',
    description: 'Unleash apocalypse. 60ft radius deals 8d6 radiant damage. Creatures reduced to 0 HP are destroyed.',
    icon: 'spell_holy_sealofwrath',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['aven_t4_wrath_of_heaven', 'aven_t4_sword_of_justice', 'aven_t4_final_judgment'],
    requiresAll: true,
  }
];
