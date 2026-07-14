// ============================================
// MARTYR TALENT TREES
// ============================================

export const MARTYR_REDEMPTION = [
  // Tier 0 - Central healing well
  {
    id: 'redmp_t0_lay_on_hands',
    name: 'Lay on Hands',
    description: 'Sundale\'s touch channels Solbrand\'s radiant mercy. Lay hands on a creature to heal 2d6 HP per rank. Can be used as an action.',
    icon: 'spell_holy_layonhands',
    maxRanks: 5,
    position: { x: 2, y: 1 },
    requires: null,
  },

  // Tier 1 - First light
  {
    id: 'redmp_t1_healing_touch',
    name: 'Healing Touch',
    description: 'The sacred light of Solbrand flows through Sundale\'s hands. Your touch heals wounds. Spend a 1 action point to heal 1d8 + your level HP.',
    icon: 'spell_holy_healingtouch',
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: 'redmp_t0_lay_on_hands',
  },
  {
    id: 'redmp_t1_restoring_light',
    name: 'Restoring Light',
    description: 'Solbrand\'s purifying radiance shines through Sundale\'s sacrifice. Emit restoring light. Heal one condition from an ally within 30ft.',
    icon: 'spell_holy_restoration',
    maxRanks: 2,
    position: { x: 2, y: 0 },
    requires: 'redmp_t0_lay_on_hands',
  },
  {
    id: 'redmp_t1_purify',
    name: 'Purify',
    description: 'Sundale offers his suffering to Solbrand to cleanse the impure. Purify toxins and diseases. Remove poison and disease effects from one creature.',
    icon: 'spell_holy_purifyingpower',
    maxRanks: 3,
    position: { x: 3, y: 0 },
    requires: 'redmp_t0_lay_on_hands',
  },

  // Tier 2 - Spreading restoration
  {
    id: 'redmp_t2_cure_wounds',
    name: 'Cure Wounds',
    description: 'Solbrand\'s sacred light knits flesh and spirit alike. Cure wounds with sacred energy. Heal 3d8 + your spellcasting modifier HP.',
    icon: 'spell_holy_renew',
    maxRanks: 3,
    position: { x: 0, y: 1 },
    requires: 'redmp_t1_healing_touch',
  },
  {
    id: 'redmp_t2_mass_healing',
    name: 'Mass Healing',
    description: 'Sundale\'s martyred spirit spreads Solbrand\'s blessing to all nearby. Heal multiple targets. Heal up to 3 creatures within 30ft for 2d6 HP each.',
    icon: 'spell_holy_prayerofhealing',
    maxRanks: 4,
    position: { x: 4, y: 1 },
    requires: 'redmp_t1_purify',
  },

  // Tier 3 - Radiant restoration
  {
    id: 'redmp_t3_greater_restoration',
    name: 'Greater Restoration',
    description: 'Through Sundale\'s sacrifice, Solbrand\'s full glory restores the broken. Restore life force completely. Remove all curses, diseases, and poisons from one creature.',
    icon: 'spell_holy_greaterheal',
    maxRanks: 2,
    position: { x: 1, y: 2 },
    requires: 'redmp_t2_cure_wounds',
  },
  {
    id: 'redmp_t3_healing_aura',
    name: 'Healing Aura',
    description: 'Solbrand\'s unwavering light emanates from Sundale\'s selfless form. Emit a healing aura. Allies within 20ft regain 2d6 HP at the start of their turns.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'redmp_t2_mass_healing',
  },

  // Tier 4 - Sacred miracles
  {
    id: 'redmp_t4_miracle',
    name: 'Miracle',
    description: 'Sundale\'s ultimate offering channels Solbrand\'s impossible grace. Perform a miracle. Duplicate any spell of 5th level or lower.',
    icon: 'spell_holy_holyguidance',
    maxRanks: 1,
    position: { x: 0, y: 3 },
    requires: 'redmp_t3_greater_restoration',
  },
  {
    id: 'redmp_t4_resurrection',
    name: 'Resurrection',
    description: 'Solbrand\'s sacred light pierces the veil of death itself. Bring the dead back to life. Restore a creature that has been dead for no more than 10 days.',
    icon: 'spell_holy_resurrection',
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: 'redmp_t3_greater_restoration',
  },
  {
    id: 'redmp_t4_true_resurrection',
    name: 'True Resurrection',
    description: 'Even the oldest graves yield to Solbrand\'s eternal radiance. True resurrection. Restore a creature that has been dead for any amount of time.',
    icon: 'spell_holy_resurrection',
    maxRanks: 1,
    position: { x: 4, y: 3 },
    requires: 'redmp_t3_healing_aura',
  },

  // Tier 5 - Convergence
  {
    id: 'redmp_t5_divine_intervention',
    name: 'Warden\'s Hand',
    description: 'Solbrand answers Sundale\'s sacrifice with undeniable power. Call upon sacred intervention. Automatically succeed on one roll or save.',
    icon: 'spell_holy_divineintervention',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['redmp_t4_miracle', 'redmp_t4_resurrection', 'redmp_t4_true_resurrection'],
    requiresAll: true,
  }
];

export const MARTYR_ZEALOT = [
  // Tier 0 - Blade tip (point of judgment)
  {
    id: 'zeal_t0_divine_judgment',
    name: 'Sol\'s Judgment',
    description: 'Solbrand\'s righteous fire burns through Sundale\'s sworn enemies. Pass sacred judgment. Deal 2d6 radiant damage to one creature. Spirit modifier + rank.',
    icon: 'spell_holy_righteousfury',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Blade edges (diagonal strikes)
  {
    id: 'zeal_t1_sacred_flame',
    name: 'Sacred Flame',
    description: 'Sundale channels Solbrand\'s purifying flame to consume the wicked. Ignite enemies with sacred flame. Deal 2d8 radiant damage, no attack roll required.',
    icon: 'spell_holy_searinglight',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'zeal_t0_divine_judgment',
  },
  {
    id: 'zeal_t1_wrathful_smite',
    name: 'Wrathful Smite',
    description: 'Solbrand\'s wrath descends through Sundale\'s righteous strike. Smite with sacred wrath. Next attack deals +2d6 radiant damage and forces a Spirit save.',
    icon: 'spell_holy_crusaderstrike',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'zeal_t0_divine_judgment',
  },

  // Tier 2 - Cross guard (blade reinforcement)
  {
    id: 'zeal_t2_avenging_angel',
    name: 'Avenging Angel',
    description: 'Sundale\'s sacrifice wings him on Solbrand\'s sacred fury. Become an avenging messenger. Gain flying speed and +2 to attack and damage rolls.',
    icon: 'ability_paladin_judgementofthepure',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'zeal_t1_sacred_flame',
  },
  {
    id: 'zeal_t2_holy_avenger',
    name: 'Dawnsworn Avenger',
    description: 'Solbrand\'s light sanctifies Sundale\'s weapon to smite the unholy. Wield a sacred avenger weapon. Your weapon becomes magical and deals +1d6 radiant damage.',
    icon: 'spell_holy_auraoflight',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'zeal_t1_wrathful_smite',
  },

  // Tier 3 - Blade spine (central striking power)
  {
    id: 'zeal_t3_divine_retribution',
    name: 'Dawn\'s Reckoning',
    description: 'Those who strike Sundale feel Solbrand\'s searing judgment returned. Dawn\'s Reckoning strikes down attackers. Deal 2d6 radiant damage when hit in melee.',
    icon: 'spell_holy_blessingofstrength',
    maxRanks: 4,
    position: { x: 2, y: 2 },
    requires: 'zeal_t1_sacred_flame',
  },
  {
    id: 'zeal_t3_crusader_strike',
    name: 'Crusader Strike',
    description: 'Each blow Sundale lands channels Solbrand\'s healing radiance. Strike with crusader fury. Deal weapon damage + 2d6 radiant damage, heal for half the damage.',
    icon: 'spell_holy_crusaderstrike',
    maxRanks: 4,
    position: { x: 3, y: 2 },
    requires: 'zeal_t1_wrathful_smite',
  },

  // Tier 4 - Blade wings (sweeping strikes)
  {
    id: 'zeal_t4_wrath_of_heaven',
    name: 'Wrath of Heaven',
    description: 'Solbrand\'s celestial fury rains down through Sundale\'s call. Call down wrath of the upper dark. 20ft radius deals 4d6 radiant damage, half to allies.',
    icon: 'spell_holy_sealofwrath',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'zeal_t3_divine_retribution',
  },
  {
    id: 'zeal_t4_sword_of_justice',
    name: 'Sword of Justice',
    description: 'Sundale wields Solbrand\'s perfect judgment as an unyielding blade. Wield the sword of justice. Attacks ignore resistance and deal maximum damage on critical hits.',
    icon: 'spell_holy_righteousnessaura',
    maxRanks: 2,
    position: { x: 2, y: 3 },
    requires: 'zeal_t3_crusader_strike',
  },
  {
    id: 'zeal_t4_final_judgment',
    name: 'Final Judgment',
    description: 'Solbrand\'s final verdict extinguishes the unworthy through Sundale. Execute final judgment. Instantly kill a creature with 50 HP or less per rank.',
    icon: 'spell_holy_divineintervention',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'zeal_t3_crusader_strike',
  },

  // Tier 5 - Blade point (piercing judgment)
  {
    id: 'zeal_t5_divine_vengeance',
    name: 'Solbrand Vengeance',
    description: 'When allies fall, Sundale\'s grief ignites Solbrand\'s vengeful flame. Solbrand vengeance empowers you. Deal +2d6 radiant damage per rank when an ally is reduced to 0 HP.',
    icon: 'spell_holy_blessedlife',
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: 'zeal_t4_sword_of_justice',
  },
  {
    id: 'zeal_t5_apocalypse',
    name: 'Apocalypse',
    description: 'Sundale\'s ultimate sacrifice calls forth Solbrand\'s consuming sacred fire. Unleash apocalypse. 60ft radius deals 8d6 radiant damage. Creatures reduced to 0 HP are destroyed.',
    icon: 'spell_holy_sealofwrath',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['zeal_t4_wrath_of_heaven', 'zeal_t4_sword_of_justice', 'zeal_t4_final_judgment'],
    requiresAll: true,
  }
];

export const MARTYR_ASCETIC = [
  // Tier 0 - Central endurance foundation
  {
    id: 'asct_t0_divine_shield',
    name: 'Solbrand Aegis',
    description: 'Solbrand\'s light forms an unbreakable bastion around Sundale. Create a sacred shield that absorbs 2d6 damage per rank. Lasts 1 minute.',
    icon: 'spell_holy_divineshield',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Inner fortification
  {
    id: 'asct_t1_sacred_barrier',
    name: 'Sacred Barrier',
    description: 'Sundale\'s devotion raises walls of Solbrand\'s hallowed light. Create sacred barriers that block enemy movement. 10ft walls per rank, armor 18.',
    icon: 'spell_holy_devotionaura',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'asct_t0_divine_shield',
  },
  {
    id: 'asct_t1_protective_aura',
    name: 'Protective Aura',
    description: 'Solbrand\'s protective radiance wraps around Sundale\'s allies. Emit a protective aura. Allies within 10ft gain +1 armor per rank.',
    icon: 'spell_holy_auraoflight',
    maxRanks: 4,
    position: { x: 3, y: 1 },
    requires: 'asct_t0_divine_shield',
  },
  {
    id: 'asct_t1_shield_wall',
    name: 'Shield Wall',
    description: 'Sundale\'s martyrdom inspires all who stand beside him. Form a shield wall with allies. Adjacent allies gain +2 armor and can use your shield bonus.',
    icon: 'ability_warrior_shieldwall',
    maxRanks: 2,
    position: { x: 2, y: 1 },
    requires: 'asct_t0_divine_shield',
  },

  // Tier 2 - Expanding defensive ring
  {
    id: 'asct_t2_divine_protection',
    name: 'Solbrand Protection',
    description: 'Solbrand shelters Sundale from the deadliest of blows. Solbrand protection surrounds you. Resistance to all damage from one source per rank.',
    icon: 'spell_holy_sealofprotection',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'asct_t1_sacred_barrier',
  },
  {
    id: 'asct_t2_warding_circle',
    name: 'Warding Circle',
    description: 'Solbrand\'s light seals the realm against all otherworldly intrusion. Create a warding circle that prevents teleportation and planar travel within 20ft.',
    icon: 'spell_holy_circleofrenewal',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'asct_t1_shield_wall',
  },
  {
    id: 'asct_t2_impenetrable_barrier',
    name: 'Impenetrable Barrier',
    description: 'Sundale\'s faith makes Solbrand\'s barriers utterly impassable. Your barriers become impenetrable. Creatures cannot pass through or attack through them.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'asct_t1_protective_aura',
  },

  // Tier 3 - Fortified perimeter
  {
    id: 'asct_t3_sanctuary',
    name: 'Sanctuary',
    description: 'Solbrand\'s presence creates sacred ground where violence cannot stand. Create a sanctuary area. Creatures cannot attack within 15ft of you.',
    icon: 'spell_holy_sanctuary',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'asct_t2_divine_protection',
  },
  {
    id: 'asct_t3_fortress_of_faith',
    name: 'Fortress of Faith',
    description: 'Sundale\'s unwavering belief builds a fortress of Solbrand\'s grace. Create a fortress of faith. 30ft radius area where allies cannot be critically hit.',
    icon: 'spell_holy_prayerofmendingtga',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'asct_t2_impenetrable_barrier',
  },

  // Tier 4 - Bastion towers
  {
    id: 'asct_t4_divine_bulwark',
    name: 'Solbrand Bulwark',
    description: 'Sundale\'s selfless sacrifice shields his allies from harm. Become a sacred bulwark. Redirect all damage from one ally to yourself per rank.',
    icon: 'spell_holy_devotionaura',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'asct_t3_sanctuary',
  },
  {
    id: 'asct_t4_eternal_guardian',
    name: 'Eternal Guardian',
    description: 'Solbrand grants Sundale eternal vigilance to protect the faithful. Become an eternal guardian. Immune to unconsciousness while protecting allies.',
    icon: 'spell_holy_heroism',
    maxRanks: 1,
    position: { x: 4, y: 4 },
    requires: 'asct_t3_fortress_of_faith',
  },

  // Tier 5 - Citadel center
  {
    id: 'asct_t5_invincible_fortress',
    name: 'Invincible Fortress',
    description: 'Sundale\'s ultimate sacrifice creates Solbrand\'s impenetrable sanctuary on earth. Create an invincible fortress. 50ft radius area is completely protected from all external effects. Allies within the fortress can still be targeted by melee attacks from creatures inside the area.',
    icon: 'spell_holy_divineintervention',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: ['asct_t4_divine_bulwark', 'asct_t4_eternal_guardian', 'asct_t2_warding_circle'],
    requiresAll: true,
  }
];
