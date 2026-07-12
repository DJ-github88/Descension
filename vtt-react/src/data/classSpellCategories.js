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

        description: 'The Caldera\'s roaring heart given form. Pure destruction - aggressive burst damage and rapid ascension',

        color: '#FF4500',

        icon: 'spell_fire_fireball02'

      },

      {

        id: 'wildfire',

        name: 'Wildfire',

        description: 'Emberspire spreads its plague of hellfire. Spreading chaos - area damage and damage-over-time effects',

        color: '#FF8C00',

        icon: 'spell_fire_flameshock'

      },

      {

        id: 'apostate',

        name: 'Apostate',

        description: 'A pact made with the Wyrd-touched, slowly devoured. Controlled corruption - mana-intensive sustained damage with slower ascension',

        color: '#6B2020',

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

        description: 'A cadence forged in the Old Revel\'s wars. Aggressive support, damage amplification, and war songs',

        color: '#DC143C',

        icon: 'spell_holy_crusaderstrike'

      },

      {

        id: 'soulsinger',

        name: 'Soulsinger',

        description: 'Melodies woven from fey harmony. Healing focus, emotional manipulation, and protective melodies',

        color: '#4169E1',

        icon: 'spell_holy_divinehymn'

      },

      {

        id: 'dissonance',

        name: 'Dissonance',

        description: 'The Revel\'s darker chord, where harmony fractures. Debuffs and control, chaotic magic, and reality-warping sounds',

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

        description: 'A shard of the Frozen Hours, locked in place. Control and freeze effects that halt time',

        color: '#4169E1',

        icon: 'spell_frost_frostshock'

      },

      {

        id: 'displacement',

        name: 'Displacement',

        description: 'Time folds at Sundrift\'s command. Teleportation and mobility through time and space',

        color: '#6495ED',

        icon: 'spell_arcane_blink'

      },

      {

        id: 'rewinding',

        name: 'Rewinding',

        description: 'The temporal thread rewoven before it frays. Healing and time reversal to undo damage',

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

        description: 'The Bleeding Eye sees every possible doom. Channel entropic friction and prophetic visions into chaotic battlefield transformations',

        color: '#9b59b6',

        icon: 'spell_arcane_arcane04'

      },

      {

        id: 'deaths_seer',

        name: "Death's Seer",

        description: 'Wyrd whispers what must come to pass. Prophesy doom and decay, amplifying blight energy through prophetic foresight',

        color: '#4B0082',

        icon: 'spell_shadow_curseofsargeras'

      },

      {

        id: 'fate_rift',

        name: 'Fate Rift',

        description: 'A wound torn in destiny itself. Tear open fate-altering rifts that release chaotic probability storms',

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
        description: 'Every roll is a clause in the contract-deck. Mathematical foresight and incremental roll manipulation, treating fate as a ledger',
        color: '#2980b9',
        icon: 'inv_misc_tarot_01'
      },
      {
        id: 'high_roller',
        name: 'High Roller',
        description: 'Fortune\'s wheel spun to the breaking point. Extreme-risk gambling for devastating reality-warping payloads',
        color: '#c0392b',
        icon: 'inv_misc_platnumdisks'
      },
      {
        id: 'karmic_weaver',
        name: 'Karmic Weaver',
        description: 'Fate-threads pulled from the cosmic loom. Thread manipulation, deck siphoning, and damage redirection through fate-binding',
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

        description: 'The combination matrix hums with raw potential. Master of pure element combinations and elemental specialization',

        color: '#FF4500',

        icon: 'spell_fire_flamebolt'

      },

      {

        id: 'entropy_weaver',

        name: 'Entropy Weaver',

        description: 'Formula synthesis collapses into chaos. Embraces randomness and chaos magic for explosive unpredictable power',

        color: '#9400D3',

        icon: 'spell_shadow_charm'

      },

      {

        id: 'sphere_architect',

        name: 'Sphere Architect',

        description: 'Every sphere placed with formula precision. Precise sphere manipulation and tactical control specialist',

        color: '#4169E1',

        icon: 'inv_misc_rune_01'

      }

    ]

  },



  'Martyr': {

    path: 'Solbrand Path',

    specializations: [

      {

        id: 'redemption',

        name: 'Redemption',

        description: 'The Sun-That-Was shed its light for the faithful. Healing through sacrifice, converting suffering into powerful restorative magic',

        color: '#FFD700',

        icon: 'spell_holy_devotionaura'

      },

      {

        id: 'zealot',

        name: 'Zealot',

        description: 'Sundale\'s zeal kindles radiant blood. Righteous fury, channeling pain into devastating radiant attacks',

        color: '#DC143C',

        icon: 'spell_holy_crusaderstrike'

      },

      {

        id: 'ascetic',

        name: 'Ascetic',

        description: 'Devotion tested in the fires of trial. Enduring faith, sustaining high Devotion through resilience and resource management',

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

        id: 'savage',

        name: 'Savage',

        description: 'Primal rage loosed from its cage. Raw fury channeled into devastating attacks and hemorrhagic ruin',

        color: '#8B0000',

        icon: 'ability_warrior_rampage'

      },

      {

        id: 'juggernaut',

        name: 'Juggernaut',

        description: 'Rage hardens into living armor. Unbreakable resilience fueled by rage, absorbing damage to retaliate',

        color: '#DC143C',

        icon: 'spell_shadow_bloodboil'

      },

      {

        id: 'warlord',

        name: 'Warlord',

        description: 'The war-horn calls all to the slaughter. Battlefield commander whose rage empowers allies and demoralizes enemies',

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

        description: 'The Blooming Plague spreads its perfumed rot. Masters of contagion who excel at spreading afflictions across multiple targets',

        color: '#556B2F',

        icon: 'ability_creature_disease_05'

      },

      {

        id: 'torment_weaver',

        name: 'Torment Weaver',

        description: 'Wyrd-fester blooms in the victim\'s mind. Specialists in wyrd afflictions who break minds as easily as bodies',

        color: '#4B0082',

        icon: 'spell_shadow_mindtwisting'

      },

      {

        id: 'decay_harbinger',

        name: 'Decay Harbinger',

        description: 'Blight ascension in its purest expression. Masters of blight decay who accelerate decomposition and prevent healing',

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

        description: 'Every toxin a signed death-warrant. Masters of deadly poisons and toxins, focusing on maximizing poison damage and duration',

        color: '#32CD32',

        icon: 'ability_rogue_deadlybrew'

      },

      {

        id: 'gadgeteer',

        name: 'Gadgeteer',

        description: 'Contraptions born of cunning artifice. Masters of contraptions and mechanical devices, excelling at deploying multiple battlefield machines',

        color: '#FF6347',

        icon: 'inv_misc_wrench_01'

      },

      {

        id: 'saboteur',

        name: 'Saboteur',

        description: 'Disruption sown like poisoned seed. Masters of debuffs and battlefield disruption, weakening enemies and creating chaos',

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

        description: 'The Deep Ice answers the Archive\'s call. Masters of freezing enemies and controlling the battlefield through ice',

        color: '#4A90E2',

        icon: 'spell_frost_frostarmor'

      },

      {

        id: 'spectral_reaper',

        name: 'Spectral Reaper',

        description: 'Rime and blight wedded in blight ascension. Combines rime and blight damage for devastating hybrid attacks and minions',

        color: '#9370DB',

        icon: 'spell_shadow_soulleech_3'

      },

      {

        id: 'phylactery_guardian',

        name: 'Phylactery Guardian',

        description: 'The Frozen Archive preserves what death would claim. Enhanced phylactery mechanics and survivability with resurrection',

        color: '#2D1B69',

        icon: 'spell_frost_frozencore'

      },

      {

        id: 'blood_reaver',

        name: 'Blood Reaver',

        description: 'Blood tokens paid in crimson tribute. Aggressive life drain specialist who uses health as a resource for devastating attacks',

        color: '#8B0000',

        icon: 'spell_shadow_lifedrain'

      },

      {

        id: 'spectral_master',

        name: 'Spectral Master',

        description: 'The Frozen Archive\'s legions rise at a word. Master of undead legions who commands spectral armies and controls the battlefield',

        color: '#4B0082',

        icon: 'spell_shadow_raisedead'

      },

      {

        id: 'silence_speaker',
        name: 'Silence-Speaker',
        description: 'The Silence between the stars hungers back. Psychic devastation specialist who channels cosmic horror and manipulates Blood Tokens',

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

        description: 'Signs read in the casting of bones and stars. Balanced omen interpreter who adapts between blessings and curses based on the signs',

        color: '#F0E68C',

        icon: 'spell_holy_mindvision'

      },

      {

        id: 'harbinger',

        name: 'Harbinger',

        description: 'Dark omens are not merely seen but enacted. Dark portent specialist who weaponizes ill omens into devastating debuffs and curses',

        color: '#8B008B',

        icon: 'spell_shadow_curseofsargeras'

      },

      {

        id: 'hierophant',

        name: 'Hierophant',

        description: 'Cosmic will descends through mortal vessel. Cosmic channeler who transforms even omens into terrain-altering blessings and sacred protection',

        color: '#FFD700',

        icon: 'spell_holy_farsight'

      }

    ]

  },



  'False Prophet': {

    path: 'Dark Path',

    specializations: [

      {

        id: 'silence_speaker',
        name: 'Silence-Speaker',
        description: 'Whispers from beyond the Silence take shape. Summoners of silence entities and emptiness magic',

        color: '#2F1B14',

        icon: 'spell_shadow_summonvoidwalker'

      },

      {

        id: 'deceiver',

        name: 'Deceiver',

        description: 'The Lie wears a familiar face. Masters of illusion, deception, and false prophecy',

        color: '#4B0082',

        icon: 'spell_shadow_mindsteal'

      },

      {

        id: 'cultist',

        name: 'Cultist',

        description: 'Eldritch truth bends the kneeling mind. Leaders of dark cults and forbidden rituals',

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
    description: 'Cold-iron authority and the horror-jailer\'s art. Occult arbiters who combine anti-magic negation with Wyrd-touched binding and purification rituals.',
    specializations: [
      {
        id: 'witch_hammer',
        name: 'Witch Hammer',
        description: 'Righteous chains bind the unholy. Shadow swarm assassin — stealth + horror horde',
        color: '#2F1B14',
        icon: 'ability_stealth'
      },
      {
        id: 'iron_verdict',
        name: 'Iron Verdict',
        description: 'Anti-magic authority rendered as verdict. Anti-magic bulwark — dead zones + single powerful horror',
        color: '#4B0082',
        icon: 'spell_holy_dispelmagic'
      },
      {
        id: 'hollow_saint',
        name: 'Hollow Saint',
        description: 'A horror caged within the righteous soul. Relentless channeler — pursuit + internal horror power',
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

        description: 'AEP reserves hardened into a living wall. Defensive tank, maximum absorption, ally protection, sustained shielding',

        color: '#4169E1',

        icon: 'spell_holy_powerwordshield'

      },

      {

        id: 'spell_breaker',

        name: 'Spell Breaker',

        description: 'Counter-spell woven into every parry. Disruption specialist, spell reflection, caster punishment, high-risk high-reward',

        color: '#9370DB',

        icon: 'spell_holy_dispelmagic'

      },

      {

        id: 'mana_reaver',

        name: 'Mana Reaver',

        description: 'The shielded will turns offensive. Offensive drain, mana vampirism, burst damage, caster elimination',

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

        description: 'Root-veins coil with ancient intent. Defensive spirit guardian who channels nature spirits through protective thorn barriers',

        color: '#228B22',

        icon: 'spell_nature_stoneclawtotem'

      },

      {

        id: 'spirit_binder',

        name: 'Spirit Binder',

        description: 'The Old Spirits bound into flesh and bone. Master of binding ancestral spirits into physical vessels for sustained combat empowerment',

        color: '#9370DB',

        icon: 'spell_shadow_soulleech_3'

      },

      {

        id: 'stormscribe',

        name: 'Stormscribe',

        description: 'Bog-mists part for the scribed storm. Elemental calligrapher who scribes living storms through ritual totem inscription',

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

        description: 'Form is fluid, mastered through endless practice. Masters of rapid form transitions and combo chains, flowing seamlessly between shaping forms to overwhelm opponents',

        color: '#00CED1',

        icon: 'spell_nature_riptide'

      },

      {

        id: 'iron-dancer',

        name: 'Iron Dancer',

        description: 'Precision honed against a thousand slain. Masters of extreme precision, counter-attacks, and stolen biological traits from slain enemies',

        color: '#27AE60',

        icon: 'ability_duelist'

      },

      {

        id: 'primal-shadow',

        name: 'Primal Shadow',

        description: 'Shadow and flesh woven into one strike. Masters of stealth burst damage and shadow-infused transformations, striking from the Silence',

        color: '#2C3E50',

        icon: 'ability_stealth'

      }

    ]

  },



  'Lunarch': {

    path: 'Lunar Phase Path',

    specializations: [

      {

        id: 'hollow-sentinel',

        name: 'Hollow Sentinel',

        description: 'The parasite\'s geometry laid bare to the chosen. Precision killers who see through the parasite\'s alien geometry, bypassing defenses with surgical ranged attacks',

        color: '#A0A0A0',

        icon: 'ability_hunter_focusedaim'

      },

      {

        id: 'sanguine-warden',

        name: 'Sanguine Warden',

        description: 'Blood-tinged moonlight pools in mortal wounds. Healers who tear open their own seams to spill blood-tinged moonlight, sacrificing their body to heal allies',

        color: '#FFD700',

        icon: 'spell_nature_starfall'

      },

      {

        id: 'silence-speaker',
        name: 'Silence-Speaker',
        description: 'The parasite\'s hunger given lunar shape. Shadow mages who channel the parasite\'s hunger, mastering area damage through silence-infused lunar magic',

        color: '#2C3E50',

        icon: 'spell_holy_circleofrenewal'

      }

    ]

  },



  'Apex': {

    path: 'Companion Bond Path',

    specializations: [

      {

        id: 'bladestorm',

        name: 'Bladestorm',

        description: 'Frostwood Reach forged the glaive\'s first whirlwind. Glaive masters who chain attacks through multiple enemies, creating whirlwinds of multi-target devastation',

        color: '#DC143C',

        icon: 'ability_stealth'

      },

      {

        id: 'beastmaster',

        name: 'Beastmaster',

        description: 'Pack-tactics honed on the Frostwood hunt. Primal hunters whose deep bond with their companion creates devastating coordinated attacks and pack tactics',

        color: '#8B4513',

        icon: 'ability_hunter_beastcall'

      },

      {

        id: 'shadowblade',

        name: 'Shadowblade',

        description: 'The quarry never sees the blade. Stealthy glaive masters who strike from darkness with devastating precision, enhanced by shadowy tactics and burst damage',

        color: '#2F1B14',

        icon: 'ability_stealth'

      }

    ]

  },



  'Warden': {

    path: 'Vengeance Incarnate Path',

    specializations: [

      {

        id: 'shadowblade',

        name: 'Shadowblade',

        description: 'Vengeance wears a hood of shadow. Stealthy hunters who mark targets for death, striking from shadows with lethal precision and execution strikes',

        color: '#191970',

        icon: 'ability_stealth'

      },

      {

        id: 'vengeance-seeker',

        name: 'Vengeance Seeker',

        description: 'No quarry escapes the relentless. Relentless tormentors who drag enemies across the battlefield, crushing them with inexorable pursuit and displacement',

        color: '#2F4F4F',

        icon: 'spell_shadow_shackleundead'

      },

      {

        id: 'monolith',

        name: 'Monolith',

        description: 'Iron and gravity, anchored in hate. Immovable anchors who calcify their bodies with volcanic iron, becoming unbreakable battlefield sentinels through gravitational control',

        color: '#533C33',

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

      description: 'Apprentice ink upon the contract page. Basic spells available at character level 1',

      color: '#32CD32',

      icon: 'spell_nature_lightning',

      classRestricted: true,

      className: className,

      spellIds: []

    },

    {

      id: `${className.toLowerCase()}_level_2`,

      name: 'Level 2',

      description: 'The ledger grows heavier with each clause. Advanced spells available at character level 2',

      color: '#FFD700',

      icon: 'spell_fire_fireball02',

      classRestricted: true,

      className: className,

      spellIds: []

    },

    {

      id: `${className.toLowerCase()}_level_4`,

      name: 'Level 4',

      description: 'A pact of deeper binding. Powerful spells available at character level 4',

      color: '#FF4500',

      icon: 'spell_shadow_shadowbolt',

      classRestricted: true,

      className: className,

      spellIds: []

    },

    {

      id: `${className.toLowerCase()}_level_6`,

      name: 'Level 6',

      description: 'Mastery inscribed in the First Contract\'s own hand. Master spells available at character level 6',

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

    description: 'Unsanctioned clauses, penned by mortal hand. Spells created using the Spell Wizard',

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
