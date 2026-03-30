// ============================================
// DREADNAUGHT TALENT TREES
// ============================================

export const DREADNAUGHT_SHADOW_CITADEL = [
  // Foundation: Central Keep (The heart of the fortress)
  {
    id: 'citadel_t0_fortress_heart',
    name: 'Fortress Heart',
    description: 'The dark citadel within you beats stronger. Gain +1 HP per rank. When you take damage, draw a card: spades grant +1 bonus to your next Shadow Shield.',
    icon: 'spell_shadow_twilight',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Outer Walls: Curved defensive barrier
  {
    id: 'citadel_t1_shadow_ramparts',
    name: 'Shadow Ramparts',
    description: 'Shadow Shield absorbs an additional 1d4 damage per rank. You can use Shadow Shield as a 1 action point, raising dark walls around you.',
    icon: 'spell_shadow_antishadow',
    maxRanks: 4,
    position: { x: 0, y: 1 },
    requires: 'citadel_t0_fortress_heart',
  },
  {
    id: 'citadel_t1_obsidian_armor',
    name: 'Obsidian Armor',
    description: 'When you have 20+ DRP, your armor increases by +1 per rank. Roll a d6 when hit: on 5+ per rank, the attacker takes 1d6 shadow damage from ricocheting obsidian shards.',
    icon: 'spell_shadow_shadowfiend',
    maxRanks: 3,
    position: { x: 4, y: 1 },
    requires: 'citadel_t0_fortress_heart',
  },

  // Corner Towers: Asymmetric positioning for castle-like structure
  {
    id: 'citadel_t2_northeast_bastion',
    name: 'Northeast Bastion',
    description: 'Allies within 10 feet gain +1 armor per rank when you have 25+ DRP. Shadow Shield creates a barrier that protects one ally within 5 feet.',
    icon: 'spell_shadow_darkritual',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'citadel_t1_shadow_ramparts',
  },
  {
    id: 'citadel_t2_central_dungeon',
    name: 'Central Dungeon',
    description: 'Your HP regeneration from DRP increases by 50%. When you regenerate HP, flip a coin: heads grants +1d6 temporary HP per rank from the citadel\'s dark reserves.',
    icon: 'spell_shadow_lifedrain02',
    maxRanks: 4,
    position: { x: 2, y: 2 },
    requires: 'citadel_t1_shadow_ramparts',
  },
  {
    id: 'citadel_t2_southwest_bastion',
    name: 'Southwest Bastion',
    description: 'You can resist two damage types instead of one. When both resistances trigger, draw a card: clubs deal 1d8 shadow damage to the attacker per rank from falling debris.',
    icon: 'spell_shadow_antimagicshell',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'citadel_t1_obsidian_armor',
  },

  // Inner Courtyard: Offset positioning creating castle courtyard feel
  {
    id: 'citadel_t3_void_portcullis',
    name: 'Void Portcullis',
    description: 'Shadow Shield can be cast as a reaction and absorbs 50% more damage. When Shadow Shield breaks, deal 2d6 shadow damage per rank to all enemies within 10 feet as the gates slam shut.',
    icon: 'spell_shadow_sealofkings',
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: 'citadel_t2_northeast_bastion',
  },
  {
    id: 'citadel_t3_eternal_keep',
    name: 'Eternal Keep',
    description: 'At 40+ DRP, you become immune to critical hits. Your regeneration creates a 10-foot aura that heals allies for 1d4 HP per rank at the start of their turn.',
    icon: 'spell_shadow_twilight',
    maxRanks: 4,
    position: { x: 2, y: 3 },
    requires: 'citadel_t2_central_dungeon',
  },
  {
    id: 'citadel_t3_reflective_towers',
    name: 'Reflective Towers',
    description: 'When you resist damage, the attacker must succeed on a DC 13 Agility save or take shadow damage equal to half the resisted damage per rank from tower reflections.',
    icon: 'spell_shadow_shadowworddominate',
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: 'citadel_t2_southwest_bastion',
  },

  // Upper Battlements: Irregular raised positions like castle walls
  {
    id: 'citadel_t4_abyssal_foundations',
    name: 'Abyssal Foundations',
    description: 'Your resistances become immunity to chosen damage types. When an immune damage type would affect you, gain 1d6 DRP per rank instead as the foundations absorb the energy.',
    icon: 'spell_shadow_shadesofdarkness',
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: 'citadel_t3_void_portcullis',
  },
  {
    id: 'citadel_t4_citadel_lord',
    name: 'Citadel Lord',
    description: 'Dark Rebirth revives you with full HP and maximum DRP. You gain +2 to all saves per rank for 1 minute after rebirth, as the citadel rebuilds itself around you.',
    icon: 'spell_shadow_demonicempathy',
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: 'citadel_t3_eternal_keep',
  },

  // Royal Palace: Grand central structure with flanking towers
  {
    id: 'citadel_t4_siege_engines',
    name: 'Siege Engines',
    description: 'Shadow Shield absorbs all damage from one source per rank. When used, all enemies within 15 feet have disadvantage on attack rolls against you for 1 round as siege weapons target them.',
    icon: 'spell_shadow_focusedpower',
    maxRanks: 2,
    position: { x: 0, y: 5 },
    requires: 'citadel_t3_reflective_towers',
  },
  {
    id: 'citadel_t5_impenetrable_palace',
    name: 'Impenetrable Palace',
    description: 'Create an impenetrable fortress around yourself. For 1 minute per rank, no damage can penetrate your defenses as the royal palace manifests. Costs all remaining DRP.',
    icon: 'spell_shadow_shadowfury',
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: 'citadel_t4_abyssal_foundations',
  },
  {
    id: 'citadel_t5_shadow_sovereign',
    name: 'Shadow Sovereign',
    description: 'Your presence warps reality within the citadel. Enemies within 20 feet have their damage reduced by 1d8 per rank. Allies gain +1d8 temporary HP per rank from the sovereign\'s blessing.',
    icon: 'spell_shadow_darkritual',
    maxRanks: 3,
    position: { x: 4, y: 5 },
    requires: 'citadel_t4_citadel_lord',
  },

  // Ultimate Siege: Cataclysmic weapons positioned like siege equipment
  {
    id: 'citadel_t5_cataclysmic_siege',
    name: 'Cataclysmic Siege',
    description: 'Ultimate ability: Spend all DRP to unleash the citadel\'s siege weapons. Deal 4d12 shadow damage per rank in 30-foot radius. You become immune to all damage for the next round.',
    icon: 'spell_shadow_shadowembrace',
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: 'citadel_t4_siege_engines',
  },

  // Eternal Fortress: The ultimate central citadel
  {
    id: 'citadel_t6_eternal_fortress',
    name: 'Eternal Fortress',
    description: 'You can no longer be reduced below 1 HP by single-target effects. When you would die, the citadel automatically triggers Dark Rebirth with maximum DRP, rebuilding itself around your immortal form.',
    icon: 'spell_shadow_twilight',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['citadel_t5_impenetrable_palace', 'citadel_t5_shadow_sovereign', 'citadel_t5_cataclysmic_siege'],
  }
];

export const DREADNAUGHT_SUFFERING_WEAVER = [
  // Central Nexus: The spider at the center of the web
  {
    id: 'weaver_t0_suffering_nexus',
    name: 'Suffering Nexus',
    description: 'The web of agony begins to form within you. Deal +1d4 necrotic damage per rank with weapon attacks. When you deal necrotic damage, draw a card: diamonds weave +1 bonus damage into your next strike.',
    icon: 'spell_shadow_soulleech_3',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // First Radiating Threads: Spreading outward like initial web strands
  {
    id: 'weaver_t1_agony_threads',
    name: 'Agony Threads',
    description: 'Wraith Strike heals you for an additional 1d4 HP per rank and creates threads that connect you to your victims. You can spend DRP to empower weapon attacks with necrotic damage.',
    icon: 'spell_shadow_lifedrain',
    maxRanks: 4,
    position: { x: 0, y: 1 },
    requires: 'weaver_t0_suffering_nexus',
  },
  {
    id: 'weaver_t1_pain_conversion',
    name: 'Pain Conversion',
    description: 'Convert HP to DRP more efficiently: 4 HP = 1 DRP per rank. When you convert HP, gain resistance to necrotic damage for 1 round as the web protects you.',
    icon: 'spell_shadow_bloodboil',
    maxRanks: 3,
    position: { x: 4, y: 1 },
    requires: 'weaver_t0_suffering_nexus',
  },

  // Diamond Formation: First interlocking web pattern
  {
    id: 'weaver_t2_soul_bindings',
    name: 'Soul Bindings',
    description: 'Enemies you damage with necrotic effects take 1d6 necrotic damage per rank at the start of their turn as the web tightens. Flip a coin when you heal: tails steal additional HP from nearby enemies through the bindings.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'weaver_t1_agony_threads',
  },
  {
    id: 'weaver_t2_weave_generator',
    name: 'Weave Generator',
    description: 'Gain 1 DRP per 3 necrotic damage dealt per rank. When you reach 30+ DRP, your Wraith Strike has advantage on attack rolls as the web guides your strikes.',
    icon: 'spell_shadow_siphonmana',
    maxRanks: 4,
    position: { x: 3, y: 2 },
    requires: 'weaver_t1_pain_conversion',
  },

  // Web Expansion: Threads connecting to form larger patterns
  {
    id: 'weaver_t2_torment_overflow',
    name: 'Torment Overflow',
    description: 'Your healing from Wraith Strike increases by 50%. When you heal above maximum HP, excess becomes temporary HP equal to the overflow per rank, woven into your form.',
    icon: 'spell_shadow_deathscream',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: ['weaver_t2_soul_bindings', 'weaver_t2_weave_generator'],
  },

  // Complex Web Patterns: Multiple interconnected diamonds
  {
    id: 'weaver_t3_death_harvester',
    name: 'Death Harvester',
    description: 'When enemies die within 30 feet, gain 1d6 DRP per rank as their essence flows through the web. You can spend 10 DRP to automatically kill enemies below 25% HP by severing their life threads.',
    icon: 'spell_shadow_deathcoil',
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: 'weaver_t2_soul_bindings',
  },
  {
    id: 'weaver_t3_necrotic_tapestry',
    name: 'Necrotic Tapestry',
    description: 'Wraith Strike can be used at range (30 feet) and deals maximum damage on critical hits. Draw a card when casting: hearts double the necrotic damage as the tapestry amplifies your power.',
    icon: 'spell_shadow_contagion',
    maxRanks: 4,
    position: { x: 4, y: 3 },
    requires: 'weaver_t2_weave_generator',
  },

  // Master Weaving: Interlocking patterns forming grand design
  {
    id: 'weaver_t3_blood_ritual',
    name: 'Blood Ritual',
    description: 'Spend HP instead of DRP for abilities: 5 HP = 1 DRP. When you do this, gain +1d8 bonus necrotic damage per rank for 1 round as blood weaves through the pattern.',
    icon: 'spell_shadow_ritualofsacrifice',
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: 'weaver_t3_death_harvester',
  },
  {
    id: 'weaver_t4_vitality_drain',
    name: 'Vitality Drain',
    description: 'Allies within 15 feet heal for 1d4 HP per rank when you deal necrotic damage through the web. You gain +1 to attack rolls per rank against enemies ensnared in your web.',
    icon: 'spell_shadow_vampiricaura',
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: 'weaver_t3_necrotic_tapestry',
  },

  // Grand Nexus: Central power source with radiating connections
  {
    id: 'weaver_t4_dark_pact',
    name: 'Dark Pact',
    description: 'Dark Rebirth costs 50% less DRP but you must sacrifice 2d10 HP from nearby allies to fuel the web. In return, you gain +2 to all abilities per rank for 1 minute as the web strengthens.',
    icon: 'spell_shadow_demonicpact',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'weaver_t2_torment_overflow',
  },

  // Outer Web Rings: Expanding the tapestry outward
  {
    id: 'weaver_t4_soul_consumer',
    name: 'Soul Consumer',
    description: 'When you reduce an enemy to 0 HP, consume their soul through the web. Gain maximum HP equal to their CR per rank, up to a maximum of 20 HP, woven into your immortal form.',
    icon: 'spell_shadow_soulgem',
    maxRanks: 3,
    position: { x: 0, y: 5 },
    requires: 'weaver_t3_blood_ritual',
  },
  {
    id: 'weaver_t5_endless_weaving',
    name: 'Endless Weaving',
    description: 'You no longer have a DRP maximum as the web expands infinitely. Every time you deal damage, roll a d20: on 15+ per rank, gain an additional action on your next turn to continue weaving.',
    icon: 'spell_shadow_darkritual',
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: 'weaver_t4_vitality_drain',
  },

  // Ultimate Tapestry: Grand weaving pattern culmination
  {
    id: 'weaver_t5_soul_shattering',
    name: 'Soul Shattering',
    description: 'Ultimate ability: Target one creature. Deal 3d12 necrotic damage per rank and heal for 50% of damage dealt as their soul unravels. Costs 25 DRP.',
    icon: 'spell_shadow_fingerofdeath',
    maxRanks: 3,
    position: { x: 1, y: 6 },
    requires: 'weaver_t4_soul_consumer',
  },
  {
    id: 'weaver_t5_living_tapestry',
    name: 'Living Tapestry',
    description: 'Enemies you kill become part of your living tapestry. You can control up to 2d6 woven constructs per rank, each with 1d10 HP and necrotic attacks that spread the web.',
    icon: 'spell_shadow_raisedead',
    maxRanks: 2,
    position: { x: 3, y: 6 },
    requires: 'weaver_t5_endless_weaving',
  },

  // Eternal Web: The infinite tapestry at the center
  {
    id: 'weaver_t6_immortal_weaver',
    name: 'Immortal Weaver',
    description: 'You cannot die from HP loss as the web sustains you. Instead, you enter a woven state and can only be destroyed by unraveling the entire tapestry with radiant damage or special means.',
    icon: 'spell_shadow_soulleech_3',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['weaver_t4_dark_pact', 'weaver_t5_soul_shattering', 'weaver_t5_living_tapestry'],
  }
];

export const DREADNAUGHT_DOOM_BRINGER = [
  // Epicenter: The point where doom begins to fracture reality
  {
    id: 'bringer_t0_doom_harbinger',
    name: 'Doom Harbinger',
    description: 'The first cracks of doom appear in reality around you. Deal +1d4 shadow damage per rank to attackers. When hit, roll a d6: on 4+ per rank, the cracks widen and grant +1 to your next attack roll.',
    icon: 'spell_shadow_demonicempathy',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Primary Fracture Lines: Initial jagged cracks spreading asymmetrically
  {
    id: 'bringer_t1_vengeance_fissures',
    name: 'Vengeance Fissures',
    description: 'Attackers take an additional 1d4 shadow damage per rank as cracks appear beneath them. Necrotic Aura costs 2 less DRP and lasts 1 additional round, widening the fractures.',
    icon: 'spell_shadow_shadowfiend',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'bringer_t0_doom_harbinger',
  },
  {
    id: 'bringer_t1_wrathful_resurrection',
    name: 'Wrathful Resurrection',
    description: 'Dark Rebirth grants +1 to attack and damage rolls per rank for 1 minute. You can choose to unleash shadow damage equal to your DRP when you rebirth, shattering the ground around you.',
    icon: 'spell_shadow_psychicscream',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'bringer_t0_doom_harbinger',
  },

  // Jagged Secondary Cracks: Irregular branching patterns
  {
    id: 'bringer_t2_retribution_strikes',
    name: 'Retribution Strikes',
    description: 'When you take damage, your next attack deals +1d6 shadow damage per rank as cracks channel your wrath. Draw a card after being hit: clubs cause the cracks to spread advantage on your next attack.',
    icon: 'spell_shadow_curse',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'bringer_t1_vengeance_fissures',
  },
  {
    id: 'bringer_t2_apocalyptic_echoes',
    name: 'Apocalyptic Echoes',
    description: 'When you use Wraith Strike, all enemies within 10 feet take 1d4 shadow damage per rank from echoing cracks. Flip a coin when you deal damage: heads double the echo damage as the fractures multiply.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'bringer_t1_wrathful_resurrection',
  },

  // Chaotic Fracture Network: Non-linear crack propagation
  {
    id: 'bringer_t2_doom_tempest',
    name: 'Doom Tempest',
    description: 'Necrotic Aura deals 1d4 shadow damage per rank per turn to affected enemies as cracks tear at them. Enemies in the aura have disadvantage on concentration saves as reality frays.',
    icon: 'spell_shadow_shadesofdarkness',
    maxRanks: 4,
    position: { x: 2, y: 2 },
    requires: ['bringer_t1_vengeance_fissures', 'bringer_t1_wrathful_resurrection'],
  },

  // Tertiary Fracture Branches: Cracks spreading in unexpected directions
  {
    id: 'bringer_t3_wrathful_rebuke',
    name: 'Wrathful Rebuke',
    description: 'When hit by an attack, you can use your reaction to attack the attacker through a fracture. Deal +1d8 shadow damage per rank and they have disadvantage on their attack as cracks impede them.',
    icon: 'spell_shadow_unholyfrenzy',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'bringer_t2_retribution_strikes',
  },
  {
    id: 'bringer_t3_vengeful_manifestations',
    name: 'Vengeful Manifestations',
    description: 'Dark Rebirth creates spectral warriors that emerge from fractures. Summon 1d4 warriors per rank with 2d6 HP each that attack your enemies for 1 round, dragging them toward the cracks.',
    icon: 'spell_shadow_raisedead',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'bringer_t2_apocalyptic_echoes',
  },

  // Major Fault Lines: Deep, irregular gashes in reality
  {
    id: 'bringer_t3_aura_of_ruin',
    name: 'Aura of Ruin',
    description: 'Enemies within 15 feet provoke opportunity attacks from you through fractures. When they move, roll a d20: on 10+ per rank, they take 1d8 shadow damage as cracks erupt beneath them.',
    icon: 'spell_shadow_auraofdarkness',
    maxRanks: 4,
    position: { x: 0, y: 4 },
    requires: 'bringer_t3_wrathful_rebuke',
  },
  {
    id: 'bringer_t4_eternal_curse',
    name: 'Eternal Curse',
    description: 'Enemies that kill you are marked with doom fractures. They take 2d10 shadow damage per rank at the start of each turn until they die or you are defeated, as the cracks pursue them eternally.',
    icon: 'spell_shadow_curseofachimonde',
    maxRanks: 3,
    position: { x: 4, y: 4 },
    requires: 'bringer_t3_vengeful_manifestations',
  },

  // Catastrophic Convergence: Where multiple fractures meet chaotically
  {
    id: 'bringer_t4_final_reckoning',
    name: 'Final Reckoning',
    description: 'Track damage taken from each enemy through fracture marks. Once per round per rank, you can unleash reckoning: deal shadow damage equal to damage they dealt you as cracks swallow them.',
    icon: 'spell_shadow_mindtwisting',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'bringer_t2_doom_tempest',
  },

  // World-Shattering Chasms: Massive reality tears in irregular patterns
  {
    id: 'bringer_t4_apocalypse_bringer',
    name: 'Apocalypse Bringer',
    description: 'Necrotic Aura causes enemies to take maximum damage from your attacks as cracks amplify your strikes. When they die in the aura, their bodies explode for 2d8 shadow damage per rank in 10-foot radius.',
    icon: 'spell_shadow_contagion',
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: 'bringer_t3_aura_of_ruin',
  },
  {
    id: 'bringer_t5_doom_shield',
    name: 'Doom Shield',
    description: 'You can redirect any attack made against an ally through a fracture to yourself. The attacker takes 1d12 shadow damage per rank as punishment and falls into a temporary fracture.',
    icon: 'spell_shadow_darkritual',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: 'bringer_t4_eternal_curse',
  },

  // Ultimate Fracture Nexus: The center of total reality collapse
  {
    id: 'bringer_t5_cataclysmic_wrath',
    name: 'Cataclysmic Wrath',
    description: 'When you take damage, all enemies within 20 feet take shadow damage equal to half the damage you took per rank through massive fractures. This damage cannot be reduced or resisted.',
    icon: 'spell_shadow_shadowfury',
    maxRanks: 2,
    position: { x: 0, y: 6 },
    requires: 'bringer_t4_apocalypse_bringer',
  },
  {
    id: 'bringer_t5_armageddon',
    name: 'Armageddon',
    description: 'Ultimate ability: Spend all DRP to trigger global apocalypse. All enemies that damaged you this combat take 3d12 shadow damage per rank as reality fractures around them completely.',
    icon: 'spell_shadow_focusedpower',
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: 'bringer_t4_final_reckoning',
  },

  // Final Reality Shatter: The ultimate chaotic convergence
  {
    id: 'bringer_t6_eternal_doom',
    name: 'Eternal Doom',
    description: 'No enemy can escape the fractures you create. Enemies that flee or teleport away from you take 4d12 shadow damage per rank and are pulled back within 5 feet by inescapable cracks in reality.',
    icon: 'spell_shadow_demonicempathy',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['bringer_t5_cataclysmic_wrath', 'bringer_t5_armageddon', 'bringer_t5_doom_shield'],
  }
];
