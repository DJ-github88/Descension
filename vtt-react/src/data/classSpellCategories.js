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

  'Fate Weaver': {
    path: 'Arcane Path',
    specializations: [
      {
        id: 'fortune_teller',
        name: 'Fortune Teller',
        description: 'Divination & prediction through cards; ally support and foresight',
        color: '#9370DB',
        icon: 'inv_misc_tarot_01'
      },
      {
        id: 'card_master',
        name: 'Card Master',
        description: 'Deck manipulation, combo assembly, and hand control',
        color: '#FFD700',
        icon: 'inv_misc_platnumdisks'
      },
      {
        id: 'thread_weaver',
        name: 'Thread Weaver',
        description: 'Thread generation & manipulation from failures and negatives',
        color: '#FF1493',
        icon: 'spell_arcane_prismaticcloak'
      }
    ]
  },

  'Gambler': {
    path: 'Mercenary Path',
    specializations: [
      {
        id: 'luck_manipulation',
        name: 'Luck Manipulation',
        description: 'Probability bending, lucky charms, and serendipitous fortune',
        color: '#32CD32',
        icon: 'inv_jewelry_necklace_07'
      },
      {
        id: 'risk_management',
        name: 'Risk Management',
        description: 'Calculated risks, hedging bets, and contingency planning',
        color: '#FFD700',
        icon: 'inv_misc_scalesofjustice'
      },
      {
        id: 'fate_control',
        name: 'Fate Control',
        description: 'Destiny manipulation and wheel of fortune control',
        color: '#8B0000',
        icon: 'inv_misc_gear_01'
      }
    ]
  },

  // Celestial Path




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
        id: 'protector',
        name: 'Protector',
        description: 'Defensive and shielding spells that guard allies from harm',
        color: '#FFD700',
        icon: 'spell_holy_devotionaura'
      },
      {
        id: 'redeemer',
        name: 'Redeemer',
        description: 'Healing and restoration spells that mend wounds and restore vitality',
        color: '#32CD32',
        icon: 'spell_holy_holybolt'
      },
      {
        id: 'avenger',
        name: 'Avenger',
        description: 'Damage and retribution spells that punish those who harm the innocent',
        color: '#FF4500',
        icon: 'spell_holy_crusaderstrike'
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
        id: 'ancestral_spirit',
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
        id: 'destiny_weaver',
        name: 'Destiny Weaver',
        description: 'Destiny manipulation and fate alteration',
        color: '#FF1493',
        icon: 'spell_arcane_prismaticcloak'
      }
    ]
  },

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

  'Lichborne': {
    path: 'Frost Path',
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
      }
    ]
  },

  'Deathcaller': {
    path: 'Necrotic Path',
    specializations: [
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

  'Dreadnaught': {
    path: 'Dark Path',
    specializations: [
      {
        id: 'shadow_citadel',
        name: 'Shadow Citadel',
        description: 'Unbreakable fortress of darkness, masters of defensive resilience who turn suffering into impenetrable barriers',
        color: '#2F1B14',
        icon: 'spell_shadow_twilight'
      },
      {
        id: 'suffering_weaver',
        name: 'Suffering Weaver',
        description: 'Dark artisans who weave pain into power, harvesting life essence and converting agony into devastating strength',
        color: '#8B0000',
        icon: 'spell_shadow_soulleech_3'
      },
      {
        id: 'doom_bringer',
        name: 'Doom Bringer',
        description: 'Harbingers of inevitable ruin, channeling dark wrath to bring apocalyptic vengeance upon their tormentors',
        color: '#4B0082',
        icon: 'spell_shadow_demonicempathy'
      }
    ]
  },

  'Exorcist': {
    path: 'Divine Path',
    specializations: [
      {
        id: 'demonologist',
        name: 'Demonologist',
        description: 'Scholars of demonic lore and infernal binding',
        color: '#8B0000',
        icon: 'spell_shadow_summonfelguard'
      },
      {
        id: 'demon_lord',
        name: 'Demon Lord',
        description: 'Warriors who bind with demon lords for unholy power',
        color: '#DC143C',
        icon: 'ability_warlock_demonicpower'
      },
      {
        id: 'possessed',
        name: 'Possessed',
        description: 'Those who embrace demonic possession for transcendent power',
        color: '#4B0082',
        icon: 'spell_shadow_possession'
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

  'Inscriptor': {
    path: 'Arcane Path',
    specializations: [
      {
        id: 'runebinder',
        name: 'Runebinder',
        description: 'Master of runic zones, enhanced rune effects, and zone manipulation',
        color: '#FF6347',
        icon: 'inv_misc_rune_01'
      },
      {
        id: 'enchanter',
        name: 'Enchanter',
        description: 'Equipment enhancement specialist, permanent inscriptions, and item empowerment',
        color: '#9370DB',
        icon: 'spell_holy_greaterblessingofkings'
      },
      {
        id: 'glyphweaver',
        name: 'Glyphweaver',
        description: 'Detonation expert, chain reactions, and explosive glyph effects',
        color: '#00CED1',
        icon: 'spell_holy_sealofwisdom'
      }
    ]
  },

  'Witch Doctor': {
    path: 'Voodoo Path',
    specializations: [
      {
        id: 'shadow-priest',
        name: 'Shadow Priest',
        description: 'Baron Samedi focus - necromancy, curses, necrotic damage, and resurrection',
        color: '#800080',
        icon: 'spell_shadow_curseofsargeras'
      },
      {
        id: 'spirit-healer',
        name: 'Spirit Healer',
        description: 'Erzulie and Simbi focus - healing, totems, protection, and cleansing',
        color: '#FFD700',
        icon: 'spell_holy_healingaura'
      },
      {
        id: 'war-priest',
        name: 'War Priest',
        description: 'Ogoun and Papa Legba focus - poisons, combat buffs, and battlefield control',
        color: '#FF4500',
        icon: 'ability_warrior_battleshout'
      }
    ]
  },

  'Covenbane': {
    path: 'Hexbreaker Path',
    specializations: [
      {
        id: 'shadowbane',
        name: 'Shadowbane',
        description: 'Stealthy assassins who excel at infiltrating enemy lines and delivering devastating burst damage from the shadows',
        color: '#2F1B14',
        icon: 'ability_stealth'
      },
      {
        id: 'spellbreaker',
        name: 'Spellbreaker',
        description: 'Anti-magic specialists who neutralize magical threats and protect allies from harmful spells',
        color: '#4B0082',
        icon: 'spell_holy_dispelmagic'
      },
      {
        id: 'demonhunter',
        name: 'Demonhunter',
        description: 'Relentless pursuers who track and eliminate evil entities through sustained damage and mobility',
        color: '#8B0000',
        icon: 'ability_hunter_markedfordeath'
      }
    ]
  },

  'Bladedancer': {
    path: 'Stance Mastery Path',
    specializations: [
      {
        id: 'flow-master',
        name: 'Flow Master',
        description: 'Masters of rapid stance transitions and combo chains, flowing seamlessly between forms to overwhelm opponents',
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

  'Huntress': {
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

  'Formbender': {
    path: 'Primal Path',
    specializations: [
      {
        id: 'metamorph',
        name: 'Metamorph',
        description: 'Chimeric hybrid forms - combine traits from multiple creatures for adaptive versatility',
        color: '#9932CC',
        icon: 'ability_hunter_pet_chimera'
      },
      {
        id: 'form-thief',
        name: 'Form Thief',
        description: 'Form theft and mimicry - steal forms from defeated enemies and use their abilities',
        color: '#8B0000',
        icon: 'spell_shadow_possession'
      },
      {
        id: 'primordial',
        name: 'Primordial',
        description: 'Ancient elemental transformations - channel primal elemental forces and terrain manipulation',
        color: '#FF4500',
        icon: 'spell_fire_elementaldevastation'
      }
    ]
  },

  'Primalist': {
    path: 'Elemental Path',
    specializations: [
      {
        id: 'earthwarden',
        name: 'Earthwarden',
        description: 'Master of healing and protection through earthen totems and sanctuary circles',
        color: '#8B4513',
        icon: 'spell_nature_stoneclawtotem'
      },
      {
        id: 'stormbringer',
        name: 'Stormbringer',
        description: 'Wielder of elemental fury through flame, storm, frost, and wind totems',
        color: '#4169E1',
        icon: 'spell_nature_callstorm'
      },
      {
        id: 'spiritcaller',
        name: 'Spiritcaller',
        description: 'Communer with nature spirits, manipulating totems for crowd control and utility',
        color: '#9370DB',
        icon: 'spell_nature_invisibilitytotem'
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
