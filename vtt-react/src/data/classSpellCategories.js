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



  'Harbinger': {

    path: 'Entropy Path',

    specializations: [

      {

        id: 'wild_prophet',

        name: 'Wild Prophet',

        description: 'Channel entropic friction and prophetic visions into chaotic battlefield transformations',

        color: '#9b59b6',

        icon: 'spell_arcane_arcane04'

      },

      {

        id: 'deaths_seer',

        name: "Death's Seer",

        description: 'Prophesy doom and decay, amplifying necrotic energy through prophetic foresight',

        color: '#4B0082',

        icon: 'spell_shadow_curseofsargeras'

      },

      {

        id: 'fate_rift',

        name: 'Fate Rift',

        description: 'Tear open fate-altering rifts that release chaotic probability storms',

        color: '#e67e22',

        icon: 'spell_fire_fireball'

      }
    ]
  },

  'Gambit': {
    path: 'Arcane Path',
    specializations: [
      {
        id: 'probability_savant',
        name: 'Probability Savant',
        description: 'Mathematical foresight and incremental roll manipulation, treating fate as a ledger',
        color: '#2980b9',
        icon: 'inv_misc_tarot_01'
      },
      {
        id: 'high_roller',
        name: 'High Roller',
        description: 'Extreme-risk gambling for devastating reality-warping payloads',
        color: '#c0392b',
        icon: 'inv_misc_platnumdisks'
      },
      {
        id: 'karmic_weaver',
        name: 'Karmic Weaver',
        description: 'Thread manipulation, deck siphoning, and damage redirection through fate-binding',
        color: '#8e44ad',
        icon: 'spell_arcane_prismaticcloak'
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



  'Martyr': {

    path: 'Divine Path',

    specializations: [

      {

        id: 'redemption',

        name: 'Redemption',

        description: 'Healing through sacrifice — converting suffering into powerful restorative magic',

        color: '#FFD700',

        icon: 'spell_holy_devotionaura'

      },

      {

        id: 'zealot',

        name: 'Zealot',

        description: 'Righteous fury — channeling pain into devastating radiant attacks',

        color: '#DC143C',

        icon: 'spell_holy_crusaderstrike'

      },

      {

        id: 'ascetic',

        name: 'Ascetic',

        description: 'Enduring faith — sustaining high Devotion through resilience and resource management',

        color: '#4169E1',

        icon: 'spell_holy_prayerofmendingtga'

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



  // 'Titan' removed (absorbed into Warden as Monolith specialization)





  'Plaguebringer': {

    path: 'Pestilence Path',

    specializations: [

      {

        id: 'virulent_spreader',

        name: 'Virulent Spreader',

        description: 'Masters of contagion who excel at spreading afflictions across multiple targets',

        color: '#556B2F',

        icon: 'ability_creature_disease_05'

      },

      {

        id: 'torment_weaver',

        name: 'Torment Weaver',

        description: 'Specialists in psychic afflictions who break minds as easily as bodies',

        color: '#4B0082',

        icon: 'spell_shadow_mindtwisting'

      },

      {

        id: 'decay_harbinger',

        name: 'Decay Harbinger',

        description: 'Masters of necrotic decay who accelerate decomposition and prevent healing',

        color: '#2F4F2F',

        icon: 'spell_shadow_deathanddecay'

      }

    ]

  },



  'Toxicologist': {

    path: 'Pestilence Path',

    specializations: [

      {

        id: 'venomancer',

        name: 'Venomancer',

        description: 'Masters of deadly poisons and toxins, focusing on maximizing poison damage and duration',

        color: '#32CD32',

        icon: 'ability_rogue_deadlybrew'

      },

      {

        id: 'gadgeteer',

        name: 'Gadgeteer',

        description: 'Masters of contraptions and mechanical devices, excelling at deploying multiple battlefield machines',

        color: '#FF6347',

        icon: 'inv_misc_wrench_01'

      },

      {

        id: 'saboteur',

        name: 'Saboteur',

        description: 'Masters of debuffs and battlefield disruption, weakening enemies and creating chaos',

        color: '#8A2BE2',

        icon: 'ability_rogue_wrongfullyaccused'

      }

    ]

  },



  // 'Deathcaller' and 'Lichborne' merged into Revenant as Phase 1.10 consolidation
  'Revenant': {

    path: 'Necrotic & Frost Path',

    specializations: [

      {

        id: 'frostbound_tyrant',

        name: 'Frostbound Tyrant',

        description: 'Masters of freezing enemies and controlling the battlefield through ice',

        color: '#4A90E2',

        icon: 'spell_frost_frostarmor'

      },

      {

        id: 'spectral_reaper',

        name: 'Spectral Reaper',

        description: 'Combines frost and necrotic damage for devastating hybrid attacks and minions',

        color: '#9370DB',

        icon: 'spell_shadow_soulleech_3'

      },

      {

        id: 'phylactery_guardian',

        name: 'Phylactery Guardian',

        description: 'Enhanced phylactery mechanics and survivability with resurrection',

        color: '#2D1B69',

        icon: 'spell_frost_frozencore'

      },

      {

        id: 'blood_reaver',

        name: 'Blood Reaver',

        description: 'Aggressive life drain specialist who uses health as a resource for devastating attacks',

        color: '#8B0000',

        icon: 'spell_shadow_lifedrain'

      },

      {

        id: 'spectral_master',

        name: 'Spectral Master',

        description: 'Master of undead legions who commands spectral armies and controls the battlefield',

        color: '#4B0082',

        icon: 'spell_shadow_raisedead'

      },

      {

        id: 'void_caller',

        name: 'Void Caller',

        description: 'Psychic devastation specialist who channels cosmic horror and manipulates Blood Tokens',

        color: '#1C1C1C',

        icon: 'spell_shadow_shadowwordpain'

      }

    ]

  },



  'Augur': {

    path: 'Omen Path',

    specializations: [

      {

        id: 'auspex',

        name: 'Auspex',

        description: 'Balanced omen interpreter who adapts between blessings and curses based on the signs',

        color: '#F0E68C',

        icon: 'spell_holy_mindvision'

      },

      {

        id: 'harbinger',

        name: 'Harbinger',

        description: 'Dark portent specialist who weaponizes ill omens into devastating debuffs and curses',

        color: '#8B008B',

        icon: 'spell_shadow_curseofsargeras'

      },

      {

        id: 'hierophant',

        name: 'Hierophant',

        description: 'Cosmic channeler who transforms even omens into terrain-altering blessings and divine protection',

        color: '#FFD700',

        icon: 'spell_holy_farsight'

      }

    ]

  },



  'False Prophet': {

    path: 'Dark Path',

    specializations: [

      {

        id: 'voidcaller',

        name: 'Voidcaller',

        description: 'Summoners of void entities and emptiness magic',

        color: '#2F1B14',

        icon: 'spell_shadow_summonvoidwalker'

      },

      {

        id: 'deceiver',

        name: 'Deceiver',

        description: 'Masters of illusion, deception, and false prophecy',

        color: '#4B0082',

        icon: 'spell_shadow_mindsteal'

      },

      {

        id: 'cultist',

        name: 'Cultist',

        description: 'Leaders of dark cults and forbidden rituals',

        color: '#8B0000',

        icon: 'spell_shadow_summonimp'

      }

    ]

  },



  // 'Dreadnaught' removed (absorbed into Martyr as Ironclad specialization)



  // 'Exorcist' merged into Inquisitor as Phase 1.9 consolidation

  'Inquisitor': {
    id: 'inquisitor',
    name: 'Inquisitor',
    path: 'Righteous Authority Path',
    description: 'Occult arbiters who combine anti-magic negation with demonic binding and purification rituals.',
    specializations: [
      {
        id: 'witch_hammer',
        name: 'Witch Hammer',
        description: 'Shadow swarm assassin -- stealth + demon horde',
        color: '#2F1B14',
        icon: 'ability_stealth'
      },
      {
        id: 'iron_verdict',
        name: 'Iron Verdict',
        description: 'Anti-magic bulwark -- dead zones + single powerful demon',
        color: '#4B0082',
        icon: 'spell_holy_dispelmagic'
      },
      {
        id: 'hollow_saint',
        name: 'Hollow Saint',
        description: 'Relentless channeler -- pursuit + internal demon power',
        color: '#8B0000',
        icon: 'ability_hunter_markedfordeath'
      }
    ]
  },


  'Spellguard': {

    path: 'Arcane Path',

    specializations: [

      {

        id: 'arcane_warden',

        name: 'Arcane Warden',

        description: 'Defensive tank, maximum absorption, ally protection, sustained shielding',

        color: '#4169E1',

        icon: 'spell_holy_powerwordshield'

      },

      {

        id: 'spell_breaker',

        name: 'Spell Breaker',

        description: 'Disruption specialist, spell reflection, caster punishment, high-risk high-reward',

        color: '#9370DB',

        icon: 'spell_holy_dispelmagic'

      },

      {

        id: 'mana_reaver',

        name: 'Mana Reaver',

        description: 'Offensive drain, mana vampirism, burst damage, caster elimination',

        color: '#8B008B',

        icon: 'spell_shadow_manafeed'

      }

    ]

  },



  'Animist': {

    path: 'Spirit Path',

    specializations: [

      {

        id: 'thornwarden',

        name: 'Thornwarden',

        description: 'Defensive spirit guardian who channels nature spirits through protective thorn barriers',

        color: '#228B22',

        icon: 'spell_nature_stoneclawtotem'

      },

      {

        id: 'spirit_binder',

        name: 'Spirit Binder',

        description: 'Master of binding ancestral spirits into physical vessels for sustained combat empowerment',

        color: '#9370DB',

        icon: 'spell_shadow_soulleech_3'

      },

      {

        id: 'stormscribe',

        name: 'Stormscribe',

        description: 'Elemental calligrapher who scribes living storms through ritual totem inscription',

        color: '#4169E1',

        icon: 'spell_nature_callstorm'

      }

    ]

  },



  // 'Covenbane' merged into Inquisitor as Phase 1.9 consolidation


  'Shaper': {

    path: 'Shaping Form Mastery Path',

    specializations: [

      {

        id: 'flow-master',

        name: 'Flow Master',

        description: 'Masters of rapid form transitions and combo chains, flowing seamlessly between shaping forms to overwhelm opponents',

        color: '#00CED1',

        icon: 'spell_nature_riptide'

      },

      {

        id: 'duelist',

        name: 'Duelist',

        description: 'Masters of precision strikes and defensive counters, excelling in one-on-one combat with perfect timing',

        color: '#FFD700',

        icon: 'ability_duelist'

      },

      {

        id: 'shadow-dancer',

        name: 'Shadow Dancer',

        description: 'Masters of stealth and burst damage, striking from darkness with devastating ambushes and supernatural mobility',

        color: '#4B0082',

        icon: 'ability_stealth'

      }

    ]

  },



  'Lunarch': {

    path: 'Lunar Phase Path',

    specializations: [

      {

        id: 'moonlight-sentinel',

        name: 'Moonlight Sentinel',

        description: 'Celestial archers who channel moonlight through precise ranged attacks, excelling at single-target elimination and critical damage',

        color: '#E6E6FA',

        icon: 'ability_hunter_focusedaim'

      },

      {

        id: 'starfall-invoker',

        name: 'Starfall Invoker',

        description: 'Cosmic mages who summon falling stars and celestial energy, mastering area damage and battlefield control',

        color: '#FFD700',

        icon: 'spell_nature_starfall'

      },

      {

        id: 'moonwell-guardian',

        name: 'Moonwell Guardian',

        description: 'Lunar healers who create sacred moonwells and protective barriers, focusing on group healing and ally protection',

        color: '#87CEEB',

        icon: 'spell_holy_circleofrenewal'

      }

    ]

  },



  'Apex': {

    path: 'Companion Bond Path',

    specializations: [

      {

        id: 'shadowblade',

        name: 'Shadowblade',

        description: 'Stealthy glaive masters who strike from darkness with devastating precision, enhanced by shadowy tactics and burst damage',

        color: '#2F1B14',

        icon: 'ability_stealth'

      },

      {

        id: 'sentinel',

        name: 'Sentinel',

        description: 'Protective guardians who defend allies with wards and barriers, coordinating with their companion for group safety',

        color: '#4169E1',

        icon: 'spell_holy_devotionaura'

      },

      {

        id: 'beastmaster',

        name: 'Beastmaster',

        description: 'Primal hunters whose deep bond with their companion creates devastating coordinated attacks and pack tactics',

        color: '#8B4513',

        icon: 'ability_hunter_beastcall'

      }

    ]

  },



  'Warden': {

    path: 'Vengeance Incarnate Path',

    specializations: [

      {

        id: 'shadowblade',

        name: 'Shadowblade',

        description: 'Stealthy hunters who mark targets for death, striking from shadows with lethal precision and execution strikes',

        color: '#191970',

        icon: 'ability_stealth'

      },

      {

        id: 'jailer',

        name: 'Jailer',

        description: 'Masters of imprisonment who trap enemies in spectral cages, controlling the battlefield through containment and torment',

        color: '#2F4F4F',

        icon: 'spell_shadow_shackleundead'

      },

      {

        id: 'avenger',

        name: 'Avenger',

        description: 'Embodiments of vengeance who channel fury into overwhelming damage, burning enemies with relentless retribution',

        color: '#B22222',

        icon: 'spell_fire_elemental_totem'

      }

    ]

  },





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

  // Create level-based categories instead of specialization-based

  const categories = [

    {

      id: `${className.toLowerCase()}_level_1`,

      name: 'Level 1',

      description: 'Basic spells available at character level 1',

      color: '#32CD32',

      icon: 'spell_nature_lightning',

      classRestricted: true,

      className: className,

      spellIds: []

    },

    {

      id: `${className.toLowerCase()}_level_2`,

      name: 'Level 2',

      description: 'Advanced spells available at character level 2',

      color: '#FFD700',

      icon: 'spell_fire_fireball02',

      classRestricted: true,

      className: className,

      spellIds: []

    },

    {

      id: `${className.toLowerCase()}_level_4`,

      name: 'Level 4',

      description: 'Powerful spells available at character level 4',

      color: '#FF4500',

      icon: 'spell_shadow_shadowbolt',

      classRestricted: true,

      className: className,

      spellIds: []

    },

    {

      id: `${className.toLowerCase()}_level_6`,

      name: 'Level 6',

      description: 'Master spells available at character level 6',

      color: '#8A2BE2',

      icon: 'spell_arcane_starfire',

      classRestricted: true,

      className: className,

      spellIds: []

    }

  ];



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
