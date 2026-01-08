// ============================================
// TITAN TALENT TREES
// ============================================

export const TITAN_COLOSSAL_STRENGTH = [
  // Mantle Core: The superheated center of the earth
  {
    id: 'strength_t0_tectonic_core',
    name: 'Tectonic Core',
    description: 'The earth\'s fury burns within you. Deal +1d6 damage per rank with Strength-based attacks. When you hit with a melee attack, roll a d6: on 6, cause a minor earthquake in 10-foot radius.',
    icon: 'spell_nature_earthquake',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Convergent Boundaries: Where plates collide and create mountains
  {
    id: 'strength_t1_seismic_force',
    name: 'Seismic Force',
    description: 'Your attacks create shockwaves. Deal an additional 1d4 thunder damage per rank to all enemies within 5 feet of your target. You can spend 1 ki point to make a Strength attack as a 1 action point.',
    icon: 'spell_nature_earthshock',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'strength_t0_tectonic_core',
  },
  {
    id: 'strength_t1_tremor_strike',
    name: 'Tremor Strike',
    description: 'Once per turn when you hit with a weapon attack, you can cause a tremor. The target and all creatures within 5 feet must succeed on a DC 13 Strength save or be knocked prone.',
    icon: 'spell_nature_earthbind',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'strength_t0_tectonic_core',
  },

  // Subduction Zones: Where one plate dives under another
  {
    id: 'strength_t2_continental_force',
    name: 'Continental Force',
    description: 'Your carrying capacity doubles per rank. You have advantage on Strength checks and saving throws. Large or smaller creatures have disadvantage on attacks against you.',
    icon: 'spell_nature_earthquake',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'strength_t1_seismic_force',
  },
  {
    id: 'strength_t2_mountain_fist',
    name: 'Mountain Fist',
    description: 'Your unarmed strikes deal 1d8 bludgeoning damage per rank and count as magical. You can make unarmed strikes as a 1 action point.',
    icon: 'ability_warrior_colossussmash',
    maxRanks: 4,
    position: { x: 2, y: 2 },
    requires: ['strength_t1_seismic_force', 'strength_t1_tremor_strike'],
  },

  // Oceanic Ridges: Underwater mountain chains
  {
    id: 'strength_t2_earthshatter',
    name: 'Earthshatter',
    description: 'Once per short rest, you can slam the ground, dealing 2d8 thunder damage per rank in a 20-foot radius. Creatures must succeed on a Strength save or be stunned until the start of your next turn.',
    icon: 'spell_nature_earthquake',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'strength_t1_tremor_strike',
  },

  // Transform Boundaries: Where plates slide past each other
  {
    id: 'strength_t3_abyssal_might',
    name: 'Abyssal Might',
    description: 'You gain resistance to non-magical bludgeoning, piercing, and slashing damage. Your movement speed increases by 10 feet per rank, and you can move through difficult terrain without penalty.',
    icon: 'spell_nature_stoneskintotem',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'strength_t2_continental_force',
  },

  // Divergent Boundaries: Where plates pull apart
  {
    id: 'strength_t3_titanic_fury',
    name: 'Titanic Fury',
    description: 'When you reduce a creature to 0 HP with a melee attack, you can move up to your speed as a reaction and make one melee attack against another target within range.',
    icon: 'ability_warrior_bloodbath',
    maxRanks: 4,
    position: { x: 0, y: 4 },
    requires: 'strength_t2_mountain_fist',
  },
  {
    id: 'strength_t3_geological_rage',
    name: 'Geological Rage',
    description: 'While raging, your Strength attacks deal an additional 1d6 thunder damage per rank, and you can use Strength instead of Constitution for your rage saves.',
    icon: 'spell_nature_earthquake',
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: 'strength_t2_earthshatter',
  },

  // Hotspots: Volcanic activity from mantle plumes
  {
    id: 'strength_t4_summit_dominance',
    name: 'Summit Dominance',
    description: 'You can jump triple your normal distance, and you have advantage on Athletics checks. Creatures have disadvantage on opportunity attacks against you.',
    icon: 'spell_nature_earthbindtotem',
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: 'strength_t3_abyssal_might',
  },

  // Continental Collisions: Massive mountain-building events
  {
    id: 'strength_t4_colossus_strike',
    name: 'Colossus Strike',
    description: 'Once per turn when you critically hit, you can make an additional attack as a 1 action point. This attack deals maximum damage.',
    icon: 'ability_warrior_colossussmash',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'strength_t3_titanic_fury',
  },

  // Supercontinent Formation: Ultimate geological convergence
  {
    id: 'strength_t5_everest_fury',
    name: 'Everest Fury',
    description: 'Your Strength score increases by 2 per rank (maximum 24). You can use your action to enter a state of titanic rage for 1 minute, during which you deal double damage with Strength attacks.',
    icon: 'spell_nature_earthquake',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: 'strength_t4_summit_dominance',
  },
  {
    id: 'strength_t5_continental_cataclysm',
    name: 'Continental Cataclysm',
    description: 'Ultimate ability: Spend all ki points to unleash a cataclysm. All creatures in a 30-foot radius take 4d12 thunder damage per rank and must succeed on a Strength save or be stunned for 1 minute.',
    icon: 'spell_nature_earthquake',
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: 'strength_t4_colossus_strike',
  },

  // Pangaea: The ultimate supercontinent
  {
    id: 'strength_t6_tectonic_supremacy',
    name: 'Tectonic Supremacy',
    description: 'You become a living embodiment of earth\'s power. You are immune to being moved against your will, and your attacks can shatter magical barriers. Your presence causes minor earthquakes in a 100-foot radius.',
    icon: 'spell_nature_earthquake',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['strength_t5_everest_fury', 'strength_t5_continental_cataclysm', 'strength_t3_geological_rage'],
  }
];

export const TITAN_EARTH_DOMINION = [
  // Geode Center: The hollow crystal core
  {
    id: 'dominion_t0_mineral_core',
    name: 'Mineral Core',
    description: 'The earth\'s minerals flow through your veins. You can speak Terran, and you have darkvision out to 120 feet. You gain proficiency in Nature and Survival checks related to stone and metal.',
    icon: 'spell_nature_stoneclawtotem',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Primary Crystal Faces: Main crystal formations
  {
    id: 'dominion_t1_ore_sense',
    name: 'Ore Sense',
    description: 'You can detect metal and stone deposits within 60 feet per rank. You can cast Identify on metal or stone objects at will, and you gain advantage on checks to find hidden ore deposits.',
    icon: 'spell_nature_earthbindtotem',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'dominion_t0_mineral_core',
  },
  {
    id: 'dominion_t1_stone_shaping',
    name: 'Stone Shaping',
    description: 'You can shape stone and metal as if using a mold earth spell, but with a range of 30 feet and affecting up to 10 cubic feet per rank. This ability recharges after a short rest.',
    icon: 'spell_nature_earthquake',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'dominion_t0_mineral_core',
  },

  // Crystal Matrix: Interlocking crystal structures
  {
    id: 'dominion_t2_metal_skin',
    name: 'Metal Skin',
    description: 'Your skin becomes reinforced with living metal. You gain +1 armor per rank, and you have resistance to poison damage. You are immune to disease.',
    icon: 'spell_nature_skinofearth',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'dominion_t1_ore_sense',
  },
  {
    id: 'dominion_t2_crystal_armor',
    name: 'Crystal Armor',
    description: 'You can grow crystal spikes from your body. Once per turn when a creature hits you with a melee attack, it takes 1d6 piercing damage per rank. You can retract the spikes as a 1 action point.',
    icon: 'spell_nature_crystalball',
    maxRanks: 4,
    position: { x: 2, y: 2 },
    requires: ['dominion_t1_ore_sense', 'dominion_t1_stone_shaping'],
  },
  {
    id: 'dominion_t2_geode_eruption',
    name: 'Geode Eruption',
    description: 'You can cause crystals to erupt from the ground. Choose a point within 60 feet; creatures within 10 feet take 2d6 piercing damage per rank and must succeed on an Agility save or be restrained.',
    icon: 'spell_nature_earthquake',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'dominion_t1_stone_shaping',
  },

  // Mineral Veins: Branching crystal growth patterns
  {
    id: 'dominion_t3_earthbind_totem',
    name: 'Earthbind Totem',
    description: 'You can cast Earthbind at will, and flying creatures within 30 feet have their flying speed reduced by 20 feet per rank. You can burrow through stone and metal at half your normal speed.',
    icon: 'spell_nature_earthbind',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'dominion_t2_metal_skin',
  },
  {
    id: 'dominion_t3_quake_lance',
    name: 'Quake Lance',
    description: 'You can launch a lance of stone and metal. Make a ranged spell attack; on hit, the target takes 3d6 piercing damage per rank and must succeed on a Strength save or be knocked back 10 feet.',
    icon: 'spell_nature_earthquake',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'dominion_t2_geode_eruption',
  },

  // Crystal Lattice: Complex interconnected formations
  {
    id: 'dominion_t3_mineral_mastery',
    name: 'Mineral Mastery',
    description: 'You gain immunity to being petrified and resistance to acid damage. You can cast Stoneskin on yourself at will, and the spell lasts until you dismiss it.',
    icon: 'spell_nature_stoneskintotem',
    maxRanks: 4,
    position: { x: 2, y: 4 },
    requires: 'dominion_t2_crystal_armor',
  },

  // Gem Facets: Multi-faceted crystal formations
  {
    id: 'dominion_t4_diamond_hardness',
    name: 'Diamond Hardness',
    description: 'You become immune to critical hits and have advantage on saving throws against being petrified or turned to stone. Your unarmed strikes deal an additional 1d8 force damage per rank.',
    icon: 'inv_misc_gem_diamond_01',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'dominion_t3_earthbind_totem',
  },
  {
    id: 'dominion_t4_terraform',
    name: 'Terraform',
    description: 'You can reshape the battlefield. Choose a 30-foot radius area; you can raise or lower the ground by up to 10 feet per rank, creating difficult terrain or barriers as you wish.',
    icon: 'spell_nature_earthquake',
    maxRanks: 3,
    position: { x: 4, y: 4 },
    requires: 'dominion_t3_quake_lance',
  },

  // Precious Crystal Clusters: Gemstone formations
  {
    id: 'dominion_t5_gemstone_fury',
    name: 'Gemstone Fury',
    description: 'Your attacks cause gems to erupt from wounds. When you hit with a melee attack, the target takes an additional 2d6 piercing damage per rank from embedded gem shards.',
    icon: 'inv_misc_gem_ruby_01',
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: 'dominion_t4_diamond_hardness',
  },
  {
    id: 'dominion_t5_earthen_apotheosis',
    name: 'Earthen Apotheosis',
    description: 'Ultimate ability: Transform into a being of living earth and metal for 1 minute. You gain 50 temporary hit points per rank, immunity to all damage except psychic, and can cast Wall of Stone at will.',
    icon: 'spell_nature_earthquake',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: 'dominion_t4_terraform',
  },

  // Grand Geode: The ultimate crystal chamber
  {
    id: 'dominion_t6_mineral_supremacy',
    name: 'Mineral Supremacy',
    description: 'You become the living embodiment of earth\'s mineral wealth. You can control all stone and metal within 1 mile, and creatures of earth and stone obey your commands. You are immune to all earth-based magic.',
    icon: 'spell_nature_stoneclawtotem',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['dominion_t3_mineral_mastery', 'dominion_t5_gemstone_fury', 'dominion_t5_earthen_apotheosis'],
  }
];

export const TITAN_STRAIN_ENDURANCE = [
  // Central Nervous System: The control center for muscle coordination
  {
    id: 'endurance_t0_muscle_core',
    name: 'Muscle Core',
    description: 'Your body is forged for endurance. You gain +1 Constitution per rank (maximum 24). You have advantage on Constitution saving throws and can hold your breath for 1 hour.',
    icon: 'spell_nature_stoneskintotem',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Primary Muscle Groups: Major muscle bundles
  {
    id: 'endurance_t1_adrenaline_rush',
    name: 'Adrenaline Rush',
    description: 'When you take damage, you gain 1d6 temporary hit points per rank. Additionally, your movement speed increases by 10 feet until the end of your next turn.',
    icon: 'ability_rogue_sprint',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'endurance_t0_muscle_core',
  },
  {
    id: 'endurance_t1_pain_threshold',
    name: 'Pain Threshold',
    description: 'You can ignore the effects of exhaustion for 1 hour per rank. During this time, you have resistance to poison and psychic damage.',
    icon: 'spell_holy_painsupression',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'endurance_t0_muscle_core',
  },

  // Muscle Fiber Network: Interconnected muscle fibers
  {
    id: 'endurance_t2_endurance_training',
    name: 'Endurance Training',
    description: 'You can carry 50 pounds more per rank without penalty. You have advantage on Athletics checks made to climb, swim, or lift heavy objects.',
    icon: 'ability_warrior_endurance',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'endurance_t1_adrenaline_rush',
  },
  {
    id: 'endurance_t2_strain_recovery',
    name: 'Strain Recovery',
    description: 'At the start of each turn, you regain hit points equal to your Constitution modifier per rank. This healing increases to 2x your modifier when you have half or fewer hit points.',
    icon: 'spell_holy_renew',
    maxRanks: 4,
    position: { x: 2, y: 2 },
    requires: ['endurance_t1_adrenaline_rush', 'endurance_t1_pain_threshold'],
  },
  {
    id: 'endurance_t2_overexertion',
    name: 'Overexertion',
    description: 'Once per short rest, you can push beyond your limits. For 1 minute, your Strength and Constitution scores increase by 2 per rank, but you take 1d6 necrotic damage at the end of each turn.',
    icon: 'ability_warrior_bloodnova',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'endurance_t1_pain_threshold',
  },

  // Tendon Connections: Linking muscle groups
  {
    id: 'endurance_t3_stress_fracture',
    name: 'Stress Fracture',
    description: 'When you take bludgeoning, piercing, or slashing damage, you can use your reaction to reduce the damage by 1d8 per rank. If you reduce the damage to 0, you gain advantage on your next attack.',
    icon: 'ability_warrior_shieldbreak',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'endurance_t2_endurance_training',
  },
  {
    id: 'endurance_t3_breaking_point',
    name: 'Breaking Point',
    description: 'When you reach 0 hit points, you can continue fighting. You have 1 hit point per rank remaining and can take actions normally, but you die if you take any damage before the end of your next turn.',
    icon: 'ability_warrior_cleave',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'endurance_t2_overexertion',
  },

  // Metabolic Pathways: Energy distribution networks
  {
    id: 'endurance_t3_adaptive_metabolism',
    name: 'Adaptive Metabolism',
    description: 'You can survive without food or water for 1 week per rank. You gain resistance to cold and fire damage, and you have advantage on saving throws against environmental hazards.',
    icon: 'spell_nature_nullifydisease',
    maxRanks: 4,
    position: { x: 2, y: 4 },
    requires: 'endurance_t2_strain_recovery',
  },

  // Cardiovascular System: Blood flow and oxygen distribution
  {
    id: 'endurance_t4_peak_conditioning',
    name: 'Peak Conditioning',
    description: 'You can take the Dash action as a 1 action point, and you don\'t suffer penalties from difficult terrain. Your hit point maximum increases by 10 per rank.',
    icon: 'ability_warrior_endurance',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'endurance_t3_stress_fracture',
  },
  {
    id: 'endurance_t4_unbreakable',
    name: 'Unbreakable',
    description: 'You are immune to the frightened and charmed conditions. You have advantage on saving throws against being stunned or paralyzed.',
    icon: 'spell_holy_painsupression',
    maxRanks: 3,
    position: { x: 4, y: 4 },
    requires: 'endurance_t3_breaking_point',
  },

  // Neural Network: Nerve connections throughout the body
  {
    id: 'endurance_t5_titanic_endurance',
    name: 'Titanic Endurance',
    description: 'Your Constitution score increases by 2 per rank (maximum 24). You can use your action to enter a state of unbreakable endurance for 1 minute, during which you are immune to all conditions and damage is reduced by 5.',
    icon: 'ability_warrior_endurance',
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: 'endurance_t4_peak_conditioning',
  },
  {
    id: 'endurance_t5_berserker_rage',
    name: 'Berserker Rage',
    description: 'Ultimate ability: Enter a berserker rage for 1 minute. You deal maximum damage with all attacks, have advantage on all attacks, and can move through creatures\' spaces, but take 2d6 damage at the start of each turn.',
    icon: 'ability_warrior_bloodbath',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: 'endurance_t4_unbreakable',
  },

  // Complete Physiological Integration: The ultimate body harmony
  {
    id: 'endurance_t6_infinite_endurance',
    name: 'Infinite Endurance',
    description: 'You transcend the limits of mortal flesh. You no longer age, you are immune to all conditions and environmental damage, and you can survive indefinitely without food, water, or air.',
    icon: 'spell_nature_stoneskintotem',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['endurance_t3_adaptive_metabolism', 'endurance_t5_titanic_endurance', 'endurance_t5_berserker_rage'],
  }
];
