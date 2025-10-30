/**
 * Class-Based Spell Categories
 * 
 * Defines the specialization categories for each character class
 * and maps them to spell library organization
 */

// Class specialization categories mapping
export const CLASS_SPECIALIZATIONS = {
  // Infernal Path
  'Pyrofiend': {
    path: 'Infernal Path',
    specializations: [
      {
        id: 'inferno',
        name: 'Inferno',
        description: 'Pure destruction - aggressive burst damage and rapid ascension',
        color: '#FF4500',
        icon: 'spell_fire_fireball02'
      },
      {
        id: 'wildfire',
        name: 'Wildfire',
        description: 'Spreading chaos - area damage and damage-over-time effects',
        color: '#FF8C00',
        icon: 'spell_fire_flameshock'
      },
      {
        id: 'hellfire',
        name: 'Hellfire',
        description: 'Demonic resilience - self-sustain and dark powers',
        color: '#8B0000',
        icon: 'spell_shadow_shadowwordpain'
      }
    ]
  },

  'Minstrel': {
    path: 'Infernal Path',
    specializations: [
      {
        id: 'battlechoir',
        name: 'Battlechoir',
        description: 'Aggressive support, damage amplification, and war songs',
        color: '#DC143C',
        icon: 'spell_holy_crusaderstrike'
      },
      {
        id: 'soulsinger',
        name: 'Soulsinger',
        description: 'Healing focus, emotional manipulation, and protective melodies',
        color: '#4169E1',
        icon: 'spell_holy_divinehymn'
      },
      {
        id: 'dissonance',
        name: 'Dissonance',
        description: 'Debuffs and control, chaotic magic, and reality-warping sounds',
        color: '#9370DB',
        icon: 'spell_shadow_shadowwordpain'
      }
    ]
  },

  'Chronarch': {
    path: 'Temporal Path',
    specializations: [
      {
        id: 'stasis',
        name: 'Stasis',
        description: 'Control and freeze effects that halt time',
        color: '#4169E1',
        icon: 'spell_frost_frostshock'
      },
      {
        id: 'displacement',
        name: 'Displacement',
        description: 'Teleportation and mobility through time and space',
        color: '#6495ED',
        icon: 'spell_arcane_blink'
      },
      {
        id: 'rewinding',
        name: 'Rewinding',
        description: 'Healing and time reversal to undo damage',
        color: '#87CEEB',
        icon: 'spell_holy_borrowedtime'
      }
    ]
  },

  'Chaos Weaver': {
    path: 'Infernal Path',
    specializations: [
      {
        id: 'reality_bending',
        name: 'Reality Bending',
        description: 'Spells that alter the fundamental nature of reality',
        color: '#FF1493',
        icon: 'spell_arcane_polymorphchicken'
      },
      {
        id: 'entropy_control',
        name: 'Entropy Control',
        description: 'Manipulation of chaos and disorder as magical force',
        color: '#FF69B4',
        icon: 'spell_shadow_chilltouch'
      },
      {
        id: 'chaos_dice',
        name: 'Chaos Dice',
        description: 'Random magical effects determined by chaos dice',
        color: '#DA70D6',
        icon: 'spell_shadow_possession'
      }
    ]
  },

  'Gambler': {
    path: 'Infernal Path',
    specializations: [
      {
        id: 'luck_manipulation',
        name: 'Luck Manipulation',
        description: 'Spells that alter probability and fortune',
        color: '#FFD700',
        icon: 'spell_holy_blessedrecovery'
      },
      {
        id: 'risk_management',
        name: 'Risk Management',
        description: 'High-risk, high-reward magical abilities',
        color: '#FFA500',
        icon: 'spell_shadow_ritualofsacrifice'
      },
      {
        id: 'fate_control',
        name: 'Fate Control',
        description: 'Direct manipulation of destiny and outcomes',
        color: '#FF8C00',
        icon: 'spell_holy_spiritualguidence'
      }
    ]
  },

  // Celestial Path
  'Paladin': {
    path: 'Celestial Path',
    specializations: [
      {
        id: 'divine_protection',
        name: 'Divine Protection',
        description: 'Holy shields and protective divine magic',
        color: '#FFD700',
        icon: 'spell_holy_powerwordshield'
      },
      {
        id: 'holy_wrath',
        name: 'Holy Wrath',
        description: 'Righteous fury channeled into devastating attacks',
        color: '#FFF8DC',
        icon: 'spell_holy_holybolt'
      },
      {
        id: 'sacred_healing',
        name: 'Sacred Healing',
        description: 'Divine restoration and purification magic',
        color: '#F0E68C',
        icon: 'spell_holy_heal'
      }
    ]
  },

  'Cleric': {
    path: 'Celestial Path',
    specializations: [
      {
        id: 'divine_magic',
        name: 'Divine Magic',
        description: 'Pure divine energy channeled through faith',
        color: '#FFFACD',
        icon: 'spell_holy_divinespirit'
      },
      {
        id: 'healing_arts',
        name: 'Healing Arts',
        description: 'Advanced healing and restoration techniques',
        color: '#F5DEB3',
        icon: 'spell_holy_greaterheal'
      },
      {
        id: 'sacred_rituals',
        name: 'Sacred Rituals',
        description: 'Ceremonial magic and divine invocations',
        color: '#DDD8C7',
        icon: 'spell_holy_prayerofhealing'
      }
    ]
  },

  'Oracle': {
    path: 'Celestial Path',
    specializations: [
      {
        id: 'prophetic_vision',
        name: 'Prophetic Vision',
        description: 'Spells that reveal future events and hidden truths',
        color: '#E6E6FA',
        icon: 'spell_holy_spiritualguidence'
      },
      {
        id: 'divine_insight',
        name: 'Divine Insight',
        description: 'Enhanced perception and divine knowledge',
        color: '#D8BFD8',
        icon: 'spell_holy_mindvision'
      },
      {
        id: 'fate_reading',
        name: 'Fate Reading',
        description: 'Interpretation of destiny and probability threads',
        color: '#DDA0DD',
        icon: 'spell_holy_magicalsentry'
      }
    ]
  },

  'Inscriptor': {
    path: 'Celestial Path',
    specializations: [
      {
        id: 'runebinder',
        name: 'Runebinder',
        description: 'Master of runic zone manipulation and battlefield control',
        color: '#4169E1',
        icon: 'spell_arcane_arcaneorb'
      },
      {
        id: 'enchanter',
        name: 'Enchanter',
        description: 'Equipment enhancement specialist with powerful inscriptions',
        color: '#6495ED',
        icon: 'spell_arcane_arcanetorrent'
      },
      {
        id: 'glyphweaver',
        name: 'Glyphweaver',
        description: 'Explosive trap master focused on detonation mechanics',
        color: '#DC143C',
        icon: 'spell_fire_selfdestruct'
      }
    ]
  },

  'Arcanoneer': {
    path: 'Arcane Path',
    specializations: [
      {
        id: 'prism_mage',
        name: 'Prism Mage',
        description: 'Master of pure element combinations and elemental specialization',
        color: '#FF4500',
        icon: 'spell_fire_flamebolt'
      },
      {
        id: 'entropy_weaver',
        name: 'Entropy Weaver',
        description: 'Embraces randomness and chaos magic for explosive unpredictable power',
        color: '#9400D3',
        icon: 'spell_shadow_charm'
      },
      {
        id: 'sphere_architect',
        name: 'Sphere Architect',
        description: 'Precise sphere manipulation and tactical control specialist',
        color: '#4169E1',
        icon: 'inv_misc_rune_01'
      }
    ]
  },

  // Primal Path
  'Berserker': {
    path: 'Primal Path',
    specializations: [
      {
        id: 'primal_rage',
        name: 'Primal Rage',
        description: 'Raw fury channeled into devastating attacks',
        color: '#8B0000',
        icon: 'ability_warrior_rampage'
      },
      {
        id: 'blood_frenzy',
        name: 'Blood Frenzy',
        description: 'Combat abilities that grow stronger with damage taken',
        color: '#DC143C',
        icon: 'spell_shadow_bloodboil'
      },
      {
        id: 'savage_instincts',
        name: 'Savage Instincts',
        description: 'Instinctual combat techniques and survival skills',
        color: '#B22222',
        icon: 'ability_druid_ferociousbite'
      }
    ]
  },

  'Druid': {
    path: 'Primal Path',
    specializations: [
      {
        id: 'nature_magic',
        name: 'Nature Magic',
        description: 'Spells that harness the power of the natural world',
        color: '#228B22',
        icon: 'spell_nature_healingtouch'
      },
      {
        id: 'elemental_harmony',
        name: 'Elemental Harmony',
        description: 'Balance between earth, air, fire, and water',
        color: '#32CD32',
        icon: 'spell_nature_natureguardian'
      },
      {
        id: 'wild_growth',
        name: 'Wild Growth',
        description: 'Accelerated natural growth and plant manipulation',
        color: '#9ACD32',
        icon: 'spell_nature_regeneration'
      }
    ]
  },

  'Shaman': {
    path: 'Primal Path',
    specializations: [
      {
        id: 'spirit_calling',
        name: 'Spirit Calling',
        description: 'Communication with and summoning of spirits',
        color: '#4682B4',
        icon: 'spell_nature_spiritarmor'
      },
      {
        id: 'elemental_totems',
        name: 'Elemental Totems',
        description: 'Totem magic channeling elemental forces',
        color: '#5F9EA0',
        icon: 'spell_nature_earthbind'
      },
      {
        id: 'ancestral_wisdom',
        name: 'Ancestral Wisdom',
        description: 'Ancient knowledge passed down through generations',
        color: '#708090',
        icon: 'spell_nature_spiritarmor'
      }
    ]
  },

  'Titan': {
    path: 'Primal Path',
    specializations: [
      {
        id: 'colossal_strength',
        name: 'Colossal Strength',
        description: 'Immense physical power and earth-shaking abilities',
        color: '#8B4513',
        icon: 'spell_nature_earthquake'
      },
      {
        id: 'earth_dominion',
        name: 'Earth Dominion',
        description: 'Control over stone, metal, and geological forces',
        color: '#A0522D',
        icon: 'spell_nature_stoneclawtotem'
      },
      {
        id: 'strain_endurance',
        name: 'Strain Endurance',
        description: 'Abilities that push physical limits beyond normal capacity',
        color: '#CD853F',
        icon: 'spell_nature_stoneskintotem'
      }
    ]
  },

  'Ranger': {
    path: 'Primal Path',
    specializations: [
      {
        id: 'wilderness_mastery',
        name: 'Wilderness Mastery',
        description: 'Expert knowledge of natural environments and survival',
        color: '#556B2F',
        icon: 'ability_hunter_camouflage'
      },
      {
        id: 'beast_bonding',
        name: 'Beast Bonding',
        description: 'Deep connection with animal companions and wildlife',
        color: '#6B8E23',
        icon: 'ability_hunter_beastcall'
      },
      {
        id: 'tracking_arts',
        name: 'Tracking Arts',
        description: 'Advanced tracking, hunting, and pursuit techniques',
        color: '#808000',
        icon: 'ability_hunter_track'
      }
    ]
  },

  // Arcane Path
  'Wizard': {
    path: 'Arcane Path',
    specializations: [
      {
        id: 'arcane_mastery',
        name: 'Arcane Mastery',
        description: 'Pure magical theory and arcane manipulation',
        color: '#4169E1',
        icon: 'spell_arcane_arcanetorrent'
      },
      {
        id: 'spell_weaving',
        name: 'Spell Weaving',
        description: 'Complex magical patterns and spell combinations',
        color: '#6495ED',
        icon: 'spell_arcane_arcanepower'
      },
      {
        id: 'magical_research',
        name: 'Magical Research',
        description: 'Experimental magic and theoretical applications',
        color: '#87CEEB',
        icon: 'spell_arcane_arcaneorb'
      }
    ]
  },

  'Sorcerer': {
    path: 'Arcane Path',
    specializations: [
      {
        id: 'innate_power',
        name: 'Innate Power',
        description: 'Natural magical ability flowing from within',
        color: '#FF1493',
        icon: 'spell_arcane_arcanetorrent'
      },
      {
        id: 'wild_magic',
        name: 'Wild Magic',
        description: 'Unpredictable magical surges and chaotic energy',
        color: '#FF69B4',
        icon: 'spell_arcane_polymorphchicken'
      },
      {
        id: 'metamagic_arts',
        name: 'Metamagic Arts',
        description: 'Modification and enhancement of existing spells',
        color: '#DA70D6',
        icon: 'spell_arcane_arcanepower'
      }
    ]
  },

  'Warlock': {
    path: 'Arcane Path',
    specializations: [
      {
        id: 'eldritch_power',
        name: 'Eldritch Power',
        description: 'Otherworldly magic from beyond the veil',
        color: '#8B008B',
        icon: 'spell_shadow_shadowbolt'
      },
      {
        id: 'pact_magic',
        name: 'Pact Magic',
        description: 'Power granted through supernatural agreements',
        color: '#9932CC',
        icon: 'spell_shadow_ritualofsacrifice'
      },
      {
        id: 'forbidden_knowledge',
        name: 'Forbidden Knowledge',
        description: 'Dark secrets and dangerous magical lore',
        color: '#4B0082',
        icon: 'spell_shadow_possession'
      }
    ]
  },

  'Bard': {
    path: 'Arcane Path',
    specializations: [
      {
        id: 'inspiring_performance',
        name: 'Inspiring Performance',
        description: 'Magical performances that inspire and motivate allies',
        color: '#FF6347',
        icon: 'spell_holy_divinehymn'
      },
      {
        id: 'enchanting_melodies',
        name: 'Enchanting Melodies',
        description: 'Musical magic that charms and influences minds',
        color: '#FFA07A',
        icon: 'spell_holy_silence'
      },
      {
        id: 'lore_mastery',
        name: 'Lore Mastery',
        description: 'Vast knowledge and magical secrets from ancient tales',
        color: '#F4A460',
        icon: 'spell_arcane_arcaneorb'
      }
    ]
  },

  'Monk': {
    path: 'Arcane Path',
    specializations: [
      {
        id: 'inner_harmony',
        name: 'Inner Harmony',
        description: 'Balance of mind, body, and spirit through meditation',
        color: '#DDA0DD',
        icon: 'spell_holy_spiritualguidence'
      },
      {
        id: 'ki_manipulation',
        name: 'Ki Manipulation',
        description: 'Control over life energy and spiritual force',
        color: '#D8BFD8',
        icon: 'spell_nature_spiritarmor'
      },
      {
        id: 'martial_arts',
        name: 'Martial Arts',
        description: 'Combat techniques enhanced by spiritual discipline',
        color: '#E6E6FA',
        icon: 'ability_monk_palmstrike'
      }
    ]
  },

  // Mercenary Path
  'Lunarch': {
    path: 'Mercenary Path',
    specializations: [
      {
        id: 'lunar_phases',
        name: 'Lunar Phases',
        description: 'Magic that changes with the phases of the moon',
        color: '#C0C0C0',
        icon: 'spell_arcane_starfire'
      },
      {
        id: 'moonlight_magic',
        name: 'Moonlight Magic',
        description: 'Spells powered by lunar energy and celestial light',
        color: '#E6E6FA',
        icon: 'spell_arcane_blink'
      },
      {
        id: 'phase_energy',
        name: 'Phase Energy',
        description: 'Energy that shifts between different lunar states',
        color: '#F5F5F5',
        icon: 'spell_arcane_teleportundercity'
      }
    ]
  },

  'Huntress': {
    path: 'Mercenary Path',
    specializations: [
      {
        id: 'quarry_marking',
        name: 'Quarry Marking',
        description: 'Abilities that mark and track specific targets',
        color: '#8B4513',
        icon: 'ability_hunter_markedfordeath'
      },
      {
        id: 'precision_strikes',
        name: 'Precision Strikes',
        description: 'Highly accurate attacks with devastating effect',
        color: '#A0522D',
        icon: 'ability_hunter_aimedshot'
      },
      {
        id: 'hunter_instincts',
        name: 'Hunter Instincts',
        description: 'Natural hunting abilities and predatory senses',
        color: '#CD853F',
        icon: 'ability_hunter_aspectofthehawk'
      }
    ]
  },

  'Warden': {
    path: 'Mercenary Path',
    specializations: [
      {
        id: 'protective_barriers',
        name: 'Protective Barriers',
        description: 'Magical shields and defensive constructs',
        color: '#4682B4',
        icon: 'spell_holy_powerwordshield'
      },
      {
        id: 'guardian_bulwarks',
        name: 'Guardian Bulwarks',
        description: 'Massive defensive structures and fortifications',
        color: '#5F9EA0',
        icon: 'spell_holy_devotion'
      },
      {
        id: 'sentinel_watch',
        name: 'Sentinel Watch',
        description: 'Vigilant protection and area denial abilities',
        color: '#708090',
        icon: 'spell_holy_magicalsentry'
      }
    ]
  },

  'Oracle': {
    path: 'Divine Path',
    specializations: [
      {
        id: 'seer',
        name: 'Seer',
        description: 'Future sight and prediction mastery',
        color: '#9370DB',
        icon: 'spell_holy_farsight'
      },
      {
        id: 'truthseeker',
        name: 'Truthseeker',
        description: 'Past sight and hidden knowledge revelation',
        color: '#FFD700',
        icon: 'spell_holy_searinglightpriest'
      },
      {
        id: 'fateweaver',
        name: 'Fateweaver',
        description: 'Destiny manipulation and fate alteration',
        color: '#FF1493',
        icon: 'spell_arcane_prismaticcloak'
      }
    ]
  }
};

// Helper function to get specializations for a class
export const getClassSpecializations = (className) => {
  return CLASS_SPECIALIZATIONS[className]?.specializations || [];
};

// Helper function to get all class names
export const getAllClassNames = () => {
  return Object.keys(CLASS_SPECIALIZATIONS);
};

// Helper function to create spell library categories for a class
export const createSpellLibraryCategoriesForClass = (className) => {
  const specializations = getClassSpecializations(className);
  
  const categories = specializations.map(spec => ({
    id: `${className.toLowerCase()}_${spec.id}`,
    name: spec.name,
    description: spec.description,
    color: spec.color,
    icon: spec.icon,
    classRestricted: true,
    className: className,
    spellIds: [] // Will be populated with spell IDs
  }));

  // Add the custom spells category
  categories.push({
    id: 'custom_spells',
    name: 'Custom Spells',
    description: 'Spells created using the Spell Wizard',
    color: '#808080',
    icon: 'inv_misc_book_09',
    classRestricted: false,
    className: null,
    spellIds: [] // Will be populated with user-created spell IDs
  });

  return categories;
};

// Helper function to determine which category a spell belongs to
export const categorizeSpellByClass = (spell, className) => {
  // If it's a custom spell (created by wizard), put it in custom category
  if (spell.source === 'wizard' || spell.isCustom) {
    return 'custom_spells';
  }

  // If it has a specific class and specialization, use that
  if (spell.className === className && spell.specialization) {
    return `${className.toLowerCase()}_${spell.specialization}`;
  }

  // Default to first specialization for the class
  const specializations = getClassSpecializations(className);
  if (specializations.length > 0) {
    return `${className.toLowerCase()}_${specializations[0].id}`;
  }

  // Fallback to custom
  return 'custom_spells';
};
