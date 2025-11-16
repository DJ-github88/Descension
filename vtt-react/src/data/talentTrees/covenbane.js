// ============================================
// COVENBANE TALENT TREES
// ============================================

export const COVENBANE_SHADOWBANE = [
  // Foundation: The Hunter's Shadow (Central stalker's position)
  {
    id: 'shadowbane_t0_hexbreaker_focus',
    name: 'Hexbreaker Focus',
    description: 'Your Hexbreaker charges build 50% faster against evil magic users. Shadow Step costs no charges when you have 0 charges. Roll 1d4 when entering stealth - on 4, gain +1 Hexbreaker charge.',
    icon: 'ability_stealth',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Left Branch: Stealth Mastery (Shadowy infiltration)
  {
    id: 'shadowbane_t1_shadow_mastery',
    name: 'Shadow Mastery',
    description: 'Gain expertise in Stealth and gain advantage on attacks from stealth. At 3+ Hexbreaker charges, stealth attacks automatically crit. Roll 1d6 when entering stealth - on 5+ per rank, become invisible to evil creatures.',
    icon: 'spell_shadow_shadowform',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'shadowbane_t0_hexbreaker_focus',
  },
  {
    id: 'shadowbane_t2_umbral_blade',
    name: 'Umbral Blade',
    description: 'Your weapon becomes infused with shadow energy. Weapon attacks from stealth deal +2d6 necrotic damage per rank and reduce enemy movement speed by 10ft for 1 round.',
    icon: 'ability_rogue_shadowstrike',
    maxRanks: 4,
    position: { x: 0, y: 2 },
    requires: 'shadowbane_t1_shadow_mastery',
  },
  {
    id: 'shadowbane_t3_silent_execution',
    name: 'Silent Execution',
    description: 'Stealth attacks against evil magic users deal maximum damage and cannot be reduced. If target is below 50% HP, deal +4d6 bonus necrotic damage per rank.',
    icon: 'ability_rogue_ambush',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'shadowbane_t2_umbral_blade',
  },

  // Right Branch: Charge Acceleration (Rapid power building)
  {
    id: 'shadowbane_t1_charge_hunter',
    name: 'Charge Hunter',
    description: 'Gain +1 Hexbreaker charge when you kill an evil magic user. Your Witch Hunter\'s Precision procs on every attack against evil magic users instead of every third.',
    icon: 'ability_hunter_markedfordeath',
    maxRanks: 4,
    position: { x: 3, y: 1 },
    requires: 'shadowbane_t0_hexbreaker_focus',
  },
  {
    id: 'shadowbane_t2_dark_burst',
    name: 'Dark Burst',
    description: 'When you reach 3+ Hexbreaker charges, your next attack releases a burst of shadow energy dealing 3d6 necrotic damage per rank to enemies within 10ft.',
    icon: 'spell_shadow_shadowbolt',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'shadowbane_t1_charge_hunter',
  },
  {
    id: 'shadowbane_t3_shadow_eruption',
    name: 'Shadow Eruption',
    description: 'When you kill an enemy with a stealth attack, all enemies within 15ft take 4d6 necrotic damage per rank and have disadvantage on saves for 1 round.',
    icon: 'spell_shadow_shadowfury',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'shadowbane_t2_dark_burst',
  },

  // Central Convergence: Ultimate Shadow Assassin
  {
    id: 'shadowbane_t4_hexbreaker_storm',
    name: 'Hexbreaker Storm',
    description: 'Spend 4 Hexbreaker charges to teleport to any evil magic user within 60ft and attack with advantage. Deal +6d6 bonus necrotic damage and silence target for 2 rounds.',
    icon: 'spell_shadow_demonicempathy',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: ['shadowbane_t1_shadow_mastery', 'shadowbane_t1_charge_hunter'],
  },
  {
    id: 'shadowbane_t5_apex_predator',
    name: 'Apex Predator',
    description: 'While you have 4+ Hexbreaker charges, you are invisible to non-evil creatures and gain +2 to all rolls against evil magic users. Your movement speed doubles.',
    icon: 'ability_druid_predatoryinstincts',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['shadowbane_t3_silent_execution', 'shadowbane_t3_shadow_eruption'],
  },
  {
    id: 'shadowbane_t6_shadow_ascendant',
    name: 'Shadow Ascendant',
    description: 'Ultimate ability: Become a shadow entity for 1 minute. Gain 50% damage reduction, teleport 60ft as 1 action point, and attacks deal maximum damage. Costs all Hexbreaker charges.',
    icon: 'spell_shadow_twilight',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'shadowbane_t5_apex_predator',
  }
];

export const COVENBANE_SPELLBREAKER = [
  // Foundation: The Anti-Magic Ward (Central protective core)
  {
    id: 'spellbreaker_t0_anti_magic_sentinel',
    name: 'Anti-Magic Sentinel',
    description: 'You gain advantage on saves against spells and magical effects. When you successfully save against a spell, gain +1 Hexbreaker charge and reflect 2d8 force damage back to the caster.',
    icon: 'spell_holy_dispelmagic',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Left Branch: Reactive Counter-Magic (Instant spell disruption)
  {
    id: 'spellbreaker_t1_spell_intercept',
    name: 'Spell Intercept',
    description: 'As a reaction when an enemy casts a spell within 60ft, make a ranged spell attack. If it hits, the spell is countered and you gain +2 Hexbreaker charges.',
    icon: 'spell_holy_counterspell',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'spellbreaker_t0_anti_magic_sentinel',
  },
  {
    id: 'spellbreaker_t2_mana_vortex',
    name: 'Mana Vortex',
    description: 'When you counter a spell, create a vortex that drains 2d6 mana per rank from the caster. If they have no mana remaining, they take psychic damage instead.',
    icon: 'spell_shadow_manafeed',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'spellbreaker_t1_spell_intercept',
  },
  {
    id: 'spellbreaker_t3_spell_nullification',
    name: 'Spell Nullification',
    description: 'Countered spells cannot be cast again by that creature for 1 minute per rank. Additionally, dispel any one magical effect on yourself when you counter a spell.',
    icon: 'spell_shadow_antimagicshell',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'spellbreaker_t2_mana_vortex',
  },

  // Right Branch: Protective Barriers (Shielding allies)
  {
    id: 'spellbreaker_t1_ward_weaver',
    name: 'Ward Weaver',
    description: 'Create protective wards that reduce spell damage to allies within 30ft by 1d8 per rank. Wards last 1 minute and can be maintained as a 1 action point.',
    icon: 'spell_holy_powerwordshield',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'spellbreaker_t0_anti_magic_sentinel',
  },
  {
    id: 'spellbreaker_t2_dispel_field',
    name: 'Dispel Field',
    description: 'Create a 15ft radius anti-magic field for 1 minute per rank. Spells cast into the field automatically fail, and magical effects are suppressed.',
    icon: 'spell_holy_dispelmagic',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'spellbreaker_t1_ward_weaver',
  },
  {
    id: 'spellbreaker_t3_hexbreaker_barrier',
    name: 'Hexbreaker Barrier',
    description: 'Your anti-magic field now deals 3d6 force damage per rank to evil magic users who enter it, and prevents them from casting spells while inside.',
    icon: 'spell_shadow_sealofkings',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'spellbreaker_t2_dispel_field',
  },

  // Central Fusion: Anti-Magic Mastery
  {
    id: 'spellbreaker_t4_spell_siphon',
    name: 'Spell Siphon',
    description: 'When you counter a spell, you can choose to redirect it to a new target within range. The spell uses your spellcasting ability for attack rolls and saves.',
    icon: 'spell_shadow_contagion',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: ['spellbreaker_t1_spell_intercept', 'spellbreaker_t1_ward_weaver'],
  },
  {
    id: 'spellbreaker_t5_arcane_dominator',
    name: 'Arcane Dominator',
    description: 'You can maintain concentration on two anti-magic effects simultaneously. Spells cast at you or your allies within 30ft have disadvantage.',
    icon: 'spell_shadow_antishadow',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['spellbreaker_t3_spell_nullification', 'spellbreaker_t3_hexbreaker_barrier'],
  },
  {
    id: 'spellbreaker_t6_anti_magic_storm',
    name: 'Anti-Magic Storm',
    description: 'Ultimate ability: Create a massive anti-magic storm in 40ft radius for 1 minute. All spells fail, magical effects end, and evil magic users take 8d6 force damage per round. Costs all Hexbreaker charges.',
    icon: 'spell_shadow_focusedpower',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'spellbreaker_t5_arcane_dominator',
  }
];

export const COVENBANE_DEMONHUNTER = [
  // Foundation: The Relentless Hunter (Central pursuit core)
  {
    id: 'demonhunter_t0_hunters_instinct',
    name: 'Hunter\'s Instinct',
    description: 'You can track evil magic users by scent alone and have advantage on Perception checks to detect them. Your movement speed increases by +5ft per Hexbreaker charge.',
    icon: 'ability_hunter_markedfordeath',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Left Branch: Pursuit Mastery (Unstoppable chasing)
  {
    id: 'demonhunter_t1_pursuit_mastery',
    name: 'Pursuit Mastery',
    description: 'You cannot be slowed or rooted while you have 3+ Hexbreaker charges. When an evil magic user moves away from you, you can use your reaction to move up to your speed toward them.',
    icon: 'ability_rogue_sprint',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'demonhunter_t0_hunters_instinct',
  },
  {
    id: 'demonhunter_t2_hunters_mark',
    name: 'Hunter\'s Mark',
    description: 'Mark an evil magic user for 10 minutes. You can see them through walls, they cannot become invisible to you, and your attacks against them deal +2d6 radiant damage per rank.',
    icon: 'ability_hunter_snipershot',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'demonhunter_t1_pursuit_mastery',
  },
  {
    id: 'demonhunter_t3_marked_for_death',
    name: 'Marked for Death',
    description: 'Marked targets take an additional 3d6 radiant damage per rank whenever you deal Witch Hunter\'s Precision true damage to any evil magic user.',
    icon: 'ability_hunter_assassinate',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'demonhunter_t2_hunters_mark',
  },

  // Right Branch: Combat Mobility (Aggressive positioning)
  {
    id: 'demonhunter_t1_charge_surge',
    name: 'Charge Surge',
    description: 'When you gain a Hexbreaker charge, you can move 10ft per rank as a reaction. At 5+ charges, this movement ignores difficult terrain and enemy spaces.',
    icon: 'ability_warrior_charge',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'demonhunter_t0_hunters_instinct',
  },
  {
    id: 'demonhunter_t2_condemn',
    name: 'Condemn',
    description: 'Spend 3 Hexbreaker charges to knock a target back 20ft and pin them to a surface. They take 4d8 radiant damage per rank and are stunned for 1 round.',
    icon: 'ability_paladin_judgementsofthejust',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'demonhunter_t1_charge_surge',
  },
  {
    id: 'demonhunter_t3_immovable_object',
    name: 'Immovable Object',
    description: 'When you are hit by an attack from an evil magic user, you can spend 1 Hexbreaker charge as a reaction to become immune to that attack and pull the attacker 10ft closer to you.',
    icon: 'ability_warrior_shieldwall',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'demonhunter_t2_condemn',
  },

  // Central Nexus: Hunting Perfection
  {
    id: 'demonhunter_t4_hexbreaker_pursuit',
    name: 'Hexbreaker Pursuit',
    description: 'When you damage an evil magic user, mark them automatically. You can have up to 3 marks active simultaneously, and switching between marked targets costs no movement.',
    icon: 'spell_holy_heroism',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: ['demonhunter_t1_pursuit_mastery', 'demonhunter_t1_charge_surge'],
  },
  {
    id: 'demonhunter_t5_final_hour',
    name: 'Final Hour',
    description: 'Enter a state of ultimate focus for 1 minute. Gain +5 armor, +30ft movement, advantage on all attacks, and Witch Hunter\'s Precision triggers on every attack. Cannot be stopped.',
    icon: 'spell_holy_avenginewrath',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['demonhunter_t3_marked_for_death', 'demonhunter_t3_immovable_object'],
  },
  {
    id: 'demonhunter_t6_judgment_day',
    name: 'Judgment Day',
    description: 'Ultimate ability: All marked targets within 60ft take 10d6 radiant damage per mark and are stunned for 1 minute. You teleport between them, attacking each once. Costs all Hexbreaker charges.',
    icon: 'spell_holy_divineintervention',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'demonhunter_t5_final_hour',
  }
];
