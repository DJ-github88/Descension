/**

 * Class-Based Spell Categories

 * 

 * Defines the specialization categories for each character class

 * and maps them to spell library organization

 */



// Class specialization categories mapping

export const CLASS_SPECIALIZATIONS = {
  'Crusader': {
    path: 'Radiant Dawn Path',
    specializations: [
      {
        id: 'vanguard',
        name: 'Vanguard',
        description: 'Immovable frontline defender clad in starlight armor.',
        color: '#f59e0b',
        icon: 'Bludgeoning/Warrior Hammer Shield'
      },
      {
        id: 'holy_defender',
        name: 'Holy Defender',
        description: 'Channel celestial grace to protect and bolster allies.',
        color: '#3b82f6',
        icon: 'Golden Winged Entity'
      },
      {
        id: 'solar_executioner',
        name: 'Solar Executioner',
        description: 'Unleash blinding solar wrath upon the aberrant and unholy.',
        color: '#ef4444',
        icon: 'Radiant/Holy Cross'
      }
    ]
  },


  // Infernal Path

  'Pyrofiend': {

    path: 'Infernal Path',

    specializations: [

      {

        id: 'inferno',

        name: 'Inferno',

        description: 'The Caldera\'s roaring heart given form. Pure destruction - aggressive burst damage and rapid ascension',

        color: '#FF4500',

        icon: 'Fire/Rising Inferno'

      },

      {

        id: 'wildfire',

        name: 'Wildfire',

        description: 'Emberspire spreads its plague of hellfire. Spreading chaos - area damage and damage-over-time effects',

        color: '#FF8C00',

        icon: 'Fire/Flame Wave'

      },

      {

        id: 'apostate',

        name: 'Apostate',

        description: 'A pact made with the Wyrd-touched, slowly devoured. Controlled corruption - mana-intensive sustained damage with slower ascension',

        color: '#6B2020',

        icon: 'Fire/Volcanic Corruption'

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

        icon: 'Dark Rally'

      },

      {

        id: 'soulsinger',

        name: 'Soulsinger',

        description: 'Melodies woven from fey harmony. Healing focus, emotional manipulation, and protective melodies',

        color: '#4169E1',

        icon: 'Ethereal Spirit'

      },

      {

        id: 'dissonance',

        name: 'Dissonance',

        description: 'The Revel\'s darker chord, where harmony fractures. Debuffs and control, chaotic magic, and reality-warping sounds',

        color: '#9370DB',

        icon: 'Chaos/Chaotic Rupture'

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

        icon: 'Frost/Frost Freeze 1'

      },

      {

        id: 'displacement',

        name: 'Displacement',

        description: 'Time folds at Sundrift\'s command. Teleportation and mobility through time and space',

        color: '#6495ED',

        icon: 'Arcane/Portal Archway'

      },

      {

        id: 'rewinding',

        name: 'Rewinding',

        description: 'The temporal thread rewoven before it frays. Healing and time reversal to undo damage',

        color: '#87CEEB',

        icon: 'Arcane/Rewind Time'

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

        icon: 'Dark Sun Eclipse'

      },

      {

        id: 'deaths_seer',

        name: "Death's Seer",

        description: 'Wyrd whispers what must come to pass. Prophesy doom and decay, amplifying blight energy through prophetic foresight',

        color: '#4B0082',

        icon: 'Dead Speak'

      },

      {

        id: 'fate_rift',

        name: 'Fate Rift',

        description: 'A wound torn in destiny itself. Tear open fate-altering rifts that release chaotic probability storms',

        color: '#e67e22',

        icon: 'Void Rift Tear'

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
        icon: 'Lucky Charm'
      },
      {
        id: 'high_roller',
        name: 'High Roller',
        description: 'Fortune\'s wheel spun to the breaking point. Extreme-risk gambling for devastating reality-warping payloads',
        color: '#c0392b',
        icon: 'Social/Dice Roll'
      },
      {
        id: 'karmic_weaver',
        name: 'Karmic Weaver',
        description: 'Fate-threads pulled from the cosmic loom. Thread manipulation, deck siphoning, and damage redirection through fate-binding',
        color: '#8e44ad',
        icon: 'Threads of the Void'
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

        icon: 'Arcane/Conjure Elements'

      },

      {

        id: 'entropy_weaver',

        name: 'Entropy Weaver',

        description: 'Formula synthesis collapses into chaos. Embraces randomness and chaos magic for explosive unpredictable power',

        color: '#9400D3',

        icon: 'Arcane/Spiral Vortex'

      },

      {

        id: 'sphere_architect',

        name: 'Sphere Architect',

        description: 'Every sphere placed with formula precision. Precise sphere manipulation and tactical control specialist',

        color: '#4169E1',

        icon: 'Arcane/Orb Manipulation'

      }

    ]

  },



  'Martyr': {

    path: 'Sol\'s Path',

    specializations: [

      {

        id: 'redemption',

        name: 'Redemption',

        description: 'The Sun-That-Was shed its light for the faithful. Healing through sacrifice, converting suffering into powerful restorative magic',

        color: '#FFD700',

        icon: 'Radiant/Holy Blessing'

      },

      {

        id: 'zealot',

        name: 'Zealot',

        description: 'Sundale\'s zeal kindles radiant blood. Righteous fury, channeling pain into devastating radiant attacks',

        color: '#DC143C',

        icon: 'Fire/Burning Touch'

      },

      {

        id: 'ascetic',

        name: 'Ascetic',

        description: 'Devotion tested in the fires of trial. Enduring faith, sustaining high Devotion through resilience and resource management',

        color: '#4169E1',

        icon: 'Radiant/Holy Cross'

      },

      {

        id: 'ironclad',

        name: 'Ironclad',

        description: 'The furnace-armor Martyr. Sealed in superheated iron plating that converts absorbed suffering into combustion, an immovable frontline tank and area denial through furnace heat',

        color: '#d35400',

        icon: 'Bludgeoning/Warrior Hammer Shield'

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

        icon: 'General/Rage'

      },

      {

        id: 'juggernaut',

        name: 'Juggernaut',

        description: 'Rage hardens into living armor. Unbreakable resilience fueled by rage, absorbing damage to retaliate',

        color: '#DC143C',

        icon: 'Bludgeoning/Blood Punch'

      },

      {

        id: 'warlord',

        name: 'Warlord',

        description: 'The war-horn calls all to the slaughter. Battlefield commander whose rage empowers allies and demoralizes enemies',

        color: '#B22222',

        icon: 'General/Fiery Rage'

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

        icon: 'Gloomy Blight'

      },

      {

        id: 'torment_weaver',

        name: 'Torment Weaver',

        description: 'Wyrd-fester blooms in the victim\'s mind. Specialists in wyrd afflictions who break minds as easily as bodies',

        color: '#4B0082',

        icon: 'Decapitated Spirit'

      },

      {

        id: 'decay_harbinger',

        name: 'Decay Harbinger',

        description: 'Blight ascension in its purest expression. Masters of blight decay who accelerate decomposition and prevent healing',

        color: '#2F4F2F',

        icon: 'Erode Entity'

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

        icon: 'Projectile Acid'

      },

      {

        id: 'gadgeteer',

        name: 'Gadgeteer',

        description: 'Contraptions born of cunning artifice. Masters of contraptions and mechanical devices, excelling at deploying multiple battlefield machines',

        color: '#FF6347',

        icon: 'Fire/Explosive Concoction'

      },

      {

        id: 'saboteur',

        name: 'Saboteur',

        description: 'Disruption sown like poisoned seed. Masters of debuffs and battlefield disruption, weakening enemies and creating chaos',

        color: '#8A2BE2',

        icon: 'Dual Knife Goblin'

      }

    ]

  },



  // 'Deathcaller' and 'Lichborne' merged into Revenant as Phase 1.10 consolidation
  'Revenant': {

    path: 'Necrotic & Frost Path',

    specializations: [

      {

        id: 'frost_sovereign',

        name: 'Frost Sovereign',

        description: 'The Deep Ice answers the Archive\'s call. Masters of freezing enemies and controlling the battlefield through ice',

        color: '#4A90E2',

        icon: 'Icy Cursed Roots'

      },

      {

        id: 'sanguine_harvest',

        name: 'Sanguine Harvest',

        description: 'Blood tokens paid in crimson tribute. Aggressive life drain specialist who uses health as a resource for devastating attacks',

        color: '#8B0000',

        icon: 'Drain Life'

      },

      {

        id: 'phylactery_anchor',

        name: 'Phylactery Anchor',

        description: 'The Frozen Archive preserves what death would claim. Enhanced phylactery mechanics and survivability with resurrection',

        color: '#2D1B69',

        icon: 'Void Crystal Shard'

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

        icon: 'Meditating Spirits'

      },

      {

        id: 'harbinger',

        name: 'Harbinger',

        description: 'Dark omens are not merely seen but enacted. Dark portent specialist who weaponizes ill omens into devastating debuffs and curses',

        color: '#8B008B',

        icon: 'Dark Sun Eclipse'

      },

      {

        id: 'hierophant',

        name: 'Hierophant',

        description: 'Cosmic will descends through mortal vessel. Cosmic channeler who transforms even omens into terrain-altering blessings and sacred protection',

        color: '#FFD700',

        icon: 'Light Path'

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

        icon: 'Void Tendrils Lies'

      },

      {

        id: 'deceiver',

        name: 'Deceiver',

        description: 'The Lie wears a familiar face. Masters of illusion, deception, and false prophecy',

        color: '#4B0082',

        icon: 'Dark Shadow'

      },

      {

        id: 'cultist',

        name: 'Cultist',

        description: 'Eldritch truth bends the kneeling mind. Leaders of dark cults and forbidden rituals',

        color: '#8B0000',

        icon: 'Demonic Bargain'

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
        icon: 'Bludgeoning/Ceremonial Hammer'
      },
      {
        id: 'iron_verdict',
        name: 'Iron Verdict',
        description: 'Anti-magic authority rendered as verdict. Anti-magic bulwark — dead zones + single powerful horror',
        color: '#4B0082',
        icon: 'Judge'
      },
      {
        id: 'hollow_saint',
        name: 'Hollow Saint',
        description: 'A horror caged within the righteous soul. Relentless channeler — pursuit + internal horror power',
        color: '#8B0000',
        icon: 'Golden Winged Entity'
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

        icon: 'Arcane/Enchanted Blade'

      },

      {

        id: 'spell_breaker',

        name: 'Spell Breaker',

        description: 'Counter-spell woven into every parry. Disruption specialist, spell reflection, caster punishment, high-risk high-reward',

        color: '#9370DB',

        icon: 'Arcane/Magical Cross Emblem 2'

      },

      {

        id: 'mana_reaver',

        name: 'Mana Reaver',

        description: 'The shielded will turns offensive. Offensive drain, mana vampirism, burst damage, caster elimination',

        color: '#8B008B',

        icon: 'Arcane/Desperate Channelling'

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

        icon: 'Icy Cursed Roots'

      },

      {

        id: 'spirit_binder',

        name: 'Spirit Binder',

        description: 'The Old Spirits bound into flesh and bone. Master of binding ancestral spirits into physical vessels for sustained combat empowerment',

        color: '#9370DB',

        icon: 'Spirit With Wisps'

      },

      {

        id: 'stormscribe',

        name: 'Stormscribe',

        description: 'Bog-mists part for the scribed storm. Elemental calligrapher who scribes living storms through ritual totem inscription',

        color: '#4169E1',

        icon: 'Arcane/Spellcasting Aura'

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

        icon: 'Arcane/Zen'

      },

      {

        id: 'iron-dancer',

        name: 'Iron Dancer',

        description: 'Precision honed against a thousand slain. Masters of extreme precision, counter-attacks, and stolen biological traits from slain enemies',

        color: '#27AE60',

        icon: 'Twin Crescents'

      },

      {

        id: 'primal-shadow',

        name: 'Primal Shadow',

        description: 'Shadow and flesh woven into one strike. Masters of stealth burst damage and shadow-infused transformations, striking from the Silence',

        color: '#2C3E50',

        icon: 'Shadow Assassin Strike'

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

        icon: 'Arcane/Crescent Moon'

      },

      {

        id: 'sanguine-warden',

        name: 'Sanguine Warden',

        description: 'Blood-tinged moonlight pools in mortal wounds. Healers who tear open their own seams to spill blood-tinged moonlight, sacrificing their body to heal allies',

        color: '#FFD700',

        icon: 'Arcane/Star Trail Path'

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

        icon: 'Drop Axe'

      },

      {

        id: 'beastmaster',

        name: 'Beastmaster',

        description: 'Pack-tactics honed on the Frostwood hunt. Primal hunters whose deep bond with their companion creates devastating coordinated attacks and pack tactics',

        color: '#8B4513',

        icon: 'Shadow Beast'

      },

      {

        id: 'shadowblade',

        name: 'Shadowblade',

        description: 'The quarry never sees the blade. Stealthy glaive masters who strike from darkness with devastating precision, enhanced by shadowy tactics and burst damage',

        color: '#2F1B14',

        icon: 'Voidwing Blade Strike'

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

        icon: 'Voidwing Blade Strike'

      },

      {

        id: 'vengeance-seeker',

        name: 'Vengeance Seeker',

        description: 'No quarry escapes the relentless. Relentless tormentors who drag enemies across the battlefield, crushing them with inexorable pursuit and displacement',

        color: '#2F4F4F',

        icon: 'Void Scythe Chain'

      },

      {

        id: 'monolith',

        name: 'Monolith',

        description: 'Iron and gravity, anchored in hate. Immovable anchors who calcify their bodies with volcanic iron, becoming unbreakable battlefield sentinels through gravitational control',

        color: '#533C33',

        icon: 'Stern Dwarf Warrior'

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
