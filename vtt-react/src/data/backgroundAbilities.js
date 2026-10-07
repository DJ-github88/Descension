export const BACKGROUND_ABILITIES = {
  emberspirePilgrim: [
    {
      name: "Dawn's Favor",
      type: 'Passive',
      usage: '1/Long Rest',
      description: "Sol's Breath's warmth lingers in the faithful long after the pilgrimage ends. Gain resistance to radiant damage and advantage on one roll per long rest.",
      details: "You have resistance to radiant damage. Once per long rest, you can choose to have advantage on any d20 roll you make."
    },
    {
      name: 'Smite the Unfaithful',
      type: 'Active',
      usage: '1/Short Rest',
      description: "The Dawn Vigil brands its weapons with captured Sol's Breath-light. Imbue your weapon with sacred energy for bonus radiant damage on your next attack.",
      details: "For 1 AP, your next weapon attack deals an additional 1d8 radiant damage. If the target is undead or a fiend, the damage increases to 2d8."
    }
  ],

  shyrRunner: [
    {
      name: "Fortune's Favor",
      type: 'Active',
      usage: '3/Long Rest',
      description: "The Sulfur Cartel's ledgers have your name, but you are still running. Force a reroll on any d20 roll made by you or an ally within 30 feet.",
      details: "When you or an ally within 30 feet makes a d20 roll, you can use your reaction to force a reroll. The new result must be used. You can use this ability 3 times per long rest."
    },
    {
      name: 'Lucky Break',
      type: 'Passive',
      usage: '1/Long Rest',
      description: "The Shyr taught you how to fall and get back up. Once per long rest, remain at 1 hit point instead of being reduced to 0.",
      details: "When you would be reduced to 0 hit points, you can choose to drop to 1 hit point instead. This ability recharges on a long rest."
    }
  ],

  ledgerKeeper: [
    {
      name: 'Arcane Insight',
      type: 'Passive',
      usage: 'Always Active',
      description: 'The Sovereign Ledger taught you to read truth the way a scribe reads ink. Cast Detect Magic at will and gain advantage on checks to identify spells and magical effects.',
      details: "You can cast Detect Magic at will without expending a spell slot. You have advantage on Intelligence (Arcana) checks to identify spells, magical items, and magical phenomena."
    },
    {
      name: 'Ledger Adaptation',
      type: 'Active',
      usage: '1/Short Rest',
      description: "A Keeper of the Ledger rewrites clauses; you rewrite reality around recorded facts. Modify a spell by changing its damage type, range, targets, or duration.",
      details: "When you cast a spell, you can change one aspect: damage type (to any other type), double or halve the range, add or remove one target, or double or halve the duration."
    }
  ],

  bloodlineHeir: [
    {
      name: 'Bloodline Authority',
      type: 'Passive',
      usage: 'Always Active',
      description: 'Seven houses remain, and your name opens doors that stay locked for the nameless. Gain advantage on Persuasion checks when invoking your house name and one additional language.',
      details: "You have advantage on Charisma (Persuasion) checks when dealing with nobility, officials, or anyone who would recognize a house name. You learn one additional language of your choice."
    },
    {
      name: 'Veteran of the Halls',
      type: 'Active',
      usage: '1/Short Rest',
      description: "You were raised in the politics of survival. Assess a creature to learn its Armor, approximate hit point percentage, and one damage vulnerability, resistance, or immunity.",
      details: "As an action, choose a creature you can see. Learn its Armor, approximate hit point percentage (full, bloodied, near death), and one damage vulnerability, resistance, or immunity of your choice."
    }
  ],

  synodAcademic: [
    {
      name: 'Arcane Insight',
      type: 'Passive',
      usage: 'Always Active',
      description: "The Synod Hold's crystal-lattice archives taught you to read resonance the way a scribe reads ink. Cast Detect Magic at will and gain advantage on checks to identify spells.",
      details: "You can cast Detect Magic at will without expending a spell slot. You have advantage on Intelligence (Arcana) checks to identify spells, magical items, and magical phenomena."
    },
    {
      name: 'Spell Adaptation',
      type: 'Active',
      usage: '1/Short Rest',
      description: "The forbidden Sky-Songs taught you that resonance can be rewritten. Modify a spell by changing its damage type, range, targets, or duration.",
      details: "When you cast a spell, you can change one aspect: damage type (to any other type), double or halve the range, add or remove one target, or double or halve the duration."
    }
  ],

  sumpsVeteran: [
    {
      name: 'Adrenaline Rush',
      type: 'Active',
      usage: '1/Short Rest',
      description: "The Hunger Pact turns ancestral starvation into combat fury. Enter an adrenaline-fueled state for 1 minute, gaining temporary hit points and increased speed.",
      details: "For 1 AP, gain temporary hit points equal to your level and increase your movement speed by 10 feet for 1 minute. While active, you have advantage on Strength checks and saves."
    },
    {
      name: 'Devastating Strike',
      type: 'Active',
      usage: '1/Short Rest',
      description: "A Sumps veteran hits like the glacier that raised them. Add your Strength modifier to damage again and potentially knock the target prone.",
      details: "When you hit with a melee weapon attack, you can add your Strength modifier to the damage roll again. If the target is Large or smaller, it must make a Strength save or be knocked prone."
    }
  ],

  debtNegotiator: [
    {
      name: 'Contractual Eye',
      type: 'Passive',
      usage: 'Always Active',
      description: "You read Athien contracts the way an Inquisitor reads guilt. Gain advantage on Insight checks to detect lies and hidden motives, and one additional language.",
      details: "You have advantage on Wisdom (Insight) checks to detect deception or hidden intent. You learn one additional language of your choice."
    },
    {
      name: 'Fine Print',
      type: 'Active',
      usage: '1/Short Rest',
      description: "Every clause hides a loophole if you know where to look. When you or an ally within 30 feet makes a d20 roll, force a reroll.",
      details: "When you or an ally within 30 feet makes a d20 roll, you can use your reaction to force a reroll. The new result must be used."
    }
  ],

  frostChanter: [
    {
      name: 'Voice-Archive',
      type: 'Passive',
      usage: 'Always Active',
      description: "Your throat carries songs the Academies burned. Recite a verse to gain advantage on Performance checks and grant allies within 30 feet advantage on their next History or Religion check.",
      details: "You have advantage on Charisma (Performance) checks. Once per short rest, you can recite a verse of the old songs to grant allies within 30 feet advantage on their next Intelligence (History) or Intelligence (Religion) check."
    },
    {
      name: 'Protective Verse',
      type: 'Active',
      usage: '1/Long Rest',
      description: "The old chants were never just songs, they were wards. Sing a protective verse that grants allies within 15 feet resistance to cold or psychic damage for 10 minutes.",
      details: "As an action, choose cold or psychic. Allies within 15 feet gain resistance to that damage type for 10 minutes. The verse is subtle enough to pass as a drinking-song to the unwary."
    }
  ],

  forgeWright: [
    {
      name: 'Forge-Sense',
      type: 'Passive',
      usage: 'Always Active',
      description: "Metal remembers, and you remember metal. Gain proficiency with smith's tools. You can identify the origin and age of any forged metal object by touch.",
      details: "You gain proficiency with smith's tools. By handling a metal object for 1 minute, you can determine its approximate age, region of forging, and any structural weaknesses or hidden compartments."
    },
    {
      name: 'Reinforcing Heat',
      type: 'Active',
      usage: '1/Short Rest',
      description: "The forge-heat is still in your hands. Touch a worn weapon, shield, or armor to grant it +1 to damage, Armor, or saving throws for 10 minutes.",
      details: "As an action, touch a weapon, shield, or suit of armor. The item gains a +1 bonus to damage rolls (weapon), Armor (shield/armor), or saving throws (any) for 10 minutes. Cannot affect magical items."
    }
  ],

  hushSurvivor: [
    {
      name: 'Touch of Death',
      type: 'Passive',
      usage: 'Always Active',
      description: "The Hush-Bogs teach that everything feeds something. Gain temporary hit points when you reduce a creature to 0 hit points.",
      details: "When you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Constitution modifier + half your level (minimum 1)."
    },
    {
      name: 'Spectral Sight',
      type: 'Active',
      usage: 'At Will',
      description: "The residue-trails left by the dead are still visible to those who survived the hush. See invisible creatures and into the Ethereal Plane for 1 minute.",
      details: "As an action, you can see invisible creatures and objects, as well as see into the Ethereal Plane, for 1 minute. Once used, you must finish a short rest before using this ability again."
    }
  ],

  peakTracker: [
    {
      name: 'Primal Connection',
      type: 'Passive',
      usage: 'Always Active',
      description: "The Cragjaw Peaks taught you to read the mountain's language. Communicate with beasts and plants, and gain advantage on Survival checks.",
      details: "You can communicate simple concepts with beasts and plants. You have advantage on Wisdom (Survival) checks and can sense the general health and mood of natural environments."
    },
    {
      name: 'Wild Adaptation',
      type: 'Active',
      usage: '1/Long Rest',
      description: "The bone-bridges and blizzards forge hardier bodies. Transform part of your body to gain bestial benefits for 10 minutes.",
      details: "Choose one: claws (+1d4 damage to unarmed strikes), enhanced senses (advantage on Perception), or natural armor (+1 Armor). The transformation lasts 10 minutes."
    }
  ],

  merrowSailor: [
    {
      name: "Sailor's Fortune",
      type: 'Active',
      usage: '3/Long Rest',
      description: "The Luck-Ledger coin you carry has never failed you. Force a reroll on any d20 roll made by you or an ally within 30 feet.",
      details: "When you or an ally within 30 feet makes a d20 roll, you can use your reaction to force a reroll. The new result must be used. You can use this ability 3 times per long rest."
    },
    {
      name: 'Lucky Break',
      type: 'Passive',
      usage: '1/Long Rest',
      description: "A Merryn sailor knows when to let the wave carry them. Once per long rest, remain at 1 hit point instead of being reduced to 0.",
      details: "When you would be reduced to 0 hit points, you can choose to drop to 1 hit point instead. This ability recharges on a long rest."
    }
  ],

  gloomwayTrader: [
    {
      name: 'Market Sense',
      type: 'Passive',
      usage: 'Always Active',
      description: "The Bryngloom trades in three currencies and you know the weight of all three. Gain proficiency with two tools of your choice and advantage on Persuasion checks when haggling.",
      details: "You gain proficiency with two tools of your choice. You have advantage on Charisma (Persuasion) checks made to negotiate prices, contracts, or trade agreements."
    },
    {
      name: 'Bypass Route',
      type: 'Active',
      usage: 'At Will',
      description: "The Toll-Dikes tax every road, but you know the bypasses. Assess a trade route, contract, or negotiation to learn its vulnerabilities.",
      details: "As an action, choose a creature, document, or route you can see. Learn its value (approximate), one hidden clause or risk, and the most efficient way to bypass or renegotiate it."
    }
  ],

  shantyRat: [
    {
      name: 'Shadow Step',
      type: 'Active',
      usage: '1/Short Rest',
      description: "The Over-Shanty taught you to move where no one watches. Teleport up to 30 feet to an unoccupied space you can see that is in dim light or darkness.",
      details: "As a bonus action, you can teleport up to 30 feet to an unoccupied space you can see that is in dim light or darkness. You have advantage on the first attack you make before the end of your turn."
    },
    {
      name: 'Cheap Shot',
      type: 'Active',
      usage: '1/Short Rest',
      description: "The rope-bridges do not teach clean fighting. When you hit with a weapon attack, force the target to make a Constitution save or be blinded or immobilized until the end of your next turn.",
      details: "When you hit with a weapon attack, you can force the target to make a Constitution save. On a failure, choose to blind or immobilize them until the end of your next turn."
    }
  ],

  monolithHunter: [
    {
      name: 'Planar Sense',
      type: 'Passive',
      usage: 'Always Active',
      description: "The Sundered Monoliths fractured the boundaries between worlds. Sense portals or weak points between planes and resist planar displacement effects.",
      details: "You can sense portals, dimensional rifts, and planar boundaries within 60 feet. You have advantage on saves against teleportation, banishment, and other planar displacement effects."
    },
    {
      name: 'Ward of Grounding',
      type: 'Active',
      usage: '1/Long Rest',
      description: "The cold iron stakes you carry can bind the Wyrd. Create a 15-foot-radius ward that suppresses Wyrd effects and damages Wyrd entities (Wyrd-touched natives and Wyrdspawn).",
      details: "As an action, drive a cold iron stake into the ground to create a 15-foot-radius ward centered on it that lasts 1 minute. Wyrd entities in the ward take 1d6 force damage when they start their turn there, and all Wyrd-related magical effects within the ward have their save DC reduced by 2."
    }
  ],

  groveWarden: [
    {
      name: 'Old-Law Witness',
      type: 'Passive',
      usage: 'Always Active',
      description: "The moonlit groves taught you the fae's silent language. Communicate with beasts and plants, and you can sense when a spoken oath is broken within 1 mile.",
      details: "You can communicate simple concepts with beasts and plants. You have advantage on Wisdom (Survival) checks. Once per week, you can sense the direction and approximate distance of an oath-breaker within 1 mile."
    },
    {
      name: 'Thorn-Bind',
      type: 'Active',
      usage: '1/Long Rest',
      description: "The Florae carry Viridane's thorns in their blood. Transform part of your body to gain bestial benefits for 10 minutes, leaving thorn-scars on anything you strike.",
      details: "Choose one: thorned claws (+1d6 damage to unarmed strikes, leaves bleeding wounds), enhanced senses (advantage on Perception), or ironwood bark (+2 Armor). The transformation lasts 10 minutes."
    }
  ],

  maskWarden: [
    {
      name: "Hunter's Reversal",
      type: 'Passive',
      usage: 'Always Active',
      description: "You know how the Hunters track Mimir because you have buried the ones who got careless. Gain advantage on Stealth checks in fog and on Perception checks to detect tracking.",
      details: "You have advantage on Dexterity (Stealth) checks while in fog, mist, or dim light. You have advantage on Wisdom (Perception) checks to detect creatures tracking you or your allies."
    },
    {
      name: 'Fog-Step',
      type: 'Active',
      usage: '1/Short Rest',
      description: "The mist Woven taught you that fog is not an obstacle, it is a door. Teleport up to 30 feet between two areas of fog, mist, or shadow.",
      details: "As a bonus action, if you are in an area of fog, mist, or dim light, you can teleport to another area of fog, mist, or dim light within 30 feet. You leave a brief afterimage that distracts the next attack against you."
    }
  ],

  vaultScholar: [
    {
      name: 'Blueprint Memory',
      type: 'Passive',
      usage: 'Always Active',
      description: "The gear-craft codices of the guild-vaults are etched into your mind. Cast Detect Magic at will and gain advantage on checks to identify mechanical or magical devices.",
      details: "You can cast Detect Magic at will without expending a spell slot. You have advantage on Intelligence checks to identify the function, origin, and vulnerabilities of mechanical or magical devices."
    },
    {
      name: 'Field Improvisation',
      type: 'Active',
      usage: '1/Short Rest',
      description: "A Alchemite dropout or Brasskin scholar, you can jury-rig anything. Modify a spell or device by changing one aspect of its function for a single use.",
      details: "When you cast a spell or use a device, you can change one aspect: damage type (to any other type), double or halve the range, or reduce its resource cost by 1 (minimum 0)."
    }
  ],

  herdGuardian: [
    {
      name: 'Herd-Sense',
      type: 'Passive',
      usage: 'Always Active',
      description: "The migration herds taught you to read the land through its animals. Communicate with beasts, and gain advantage on Animal Handling and Survival checks.",
      details: "You can communicate simple concepts with beasts. You have advantage on Wisdom (Animal Handling) and Wisdom (Survival) checks. You can sense the presence of predators within 300 feet by the reaction of nearby animals."
    },
    {
      name: 'Stampede',
      type: 'Active',
      usage: '1/Long Rest',
      description: "When the frost comes early and the grass-line shrinks, you move the herd by any means. Enter a state of relentless motion for 1 minute, gaining temp HP and speed.",
      details: "For 1 AP, gain temporary hit points equal to your level and increase your movement speed by 15 feet for 1 minute. While active, you can Dash as a bonus action and do not provoke opportunity attacks."
    }
  ],

  starboundScholar: [
    {
      name: 'Echo-Lore',
      type: 'Passive',
      usage: 'Always Active',
      description: "The Echo-Songs still map the signatures that went dark. Gain resistance to radiant damage and advantage on Arcana or Religion checks involving celestial or Astril-echo phenomena.",
      details: "You have resistance to radiant damage. You have advantage on Intelligence (Arcana) or Intelligence (Religion) checks related to celestial phenomena, Lumia's echo, or the Synod's rites."
    },
    {
      name: 'Lumian Surge',
      type: 'Active',
      usage: '1/Long Rest',
      description: "Lumia's echo in every Astril host remembers the lost sun. Enter a surge state for 1 minute, reducing spell costs and casting one spell for free.",
      details: "For 1 minute, all spell costs are reduced by 1 (minimum 1), and you can cast one spell of 3rd level or lower without expending a spell slot."
    }
  ],

  deepCurrentGuide: [
    {
      name: 'Pressure-Reading',
      type: 'Passive',
      usage: 'Always Active',
      description: "The deep taught you to read by temperature and pressure. You can breathe underwater and have advantage on Perception checks in aquatic environments.",
      details: "You can breathe water as easily as air. You have advantage on Wisdom (Perception) checks while underwater or in aquatic environments. You can sense temperature gradients in water within 60 feet."
    },
    {
      name: 'Abyssal Resilience',
      type: 'Active',
      usage: '1/Short Rest',
      description: "The pressure-dark forges bodies that do not break. For 1 minute, gain resistance to cold and bludgeoning damage, and your movement is unaffected by difficult terrain.",
      details: "For 1 AP, gain resistance to cold and bludgeoning damage for 1 minute. While active, you ignore difficult terrain and can hold your breath for up to 1 hour."
    }
  ],

  chasmDelver: [
    {
      name: "Deep-Heat Resilience",
      type: 'Passive',
      usage: 'Always Active',
      description: "The pressure and heat of the deep geothermal tunnels conditioned your body to extremes. You have resistance to fire damage and advantage on saving throws against exhaustion from extreme heat.",
      details: "You have resistance to fire damage. You have advantage on Constitution saving throws against exhaustion caused by extreme heat or environmental pressure."
    },
    {
      name: 'Pressure-Reading',
      type: 'Active',
      usage: '1/Short Rest',
      description: "You can read the vibrations in stone and steam to predict danger. For 1 minute, you can sense imminent tunnel collapses, pipe bursts, and hidden creatures moving through stone within 60 feet.",
      details: "For 1 AP, gain tremorsense out to 60 feet for 1 minute. While active, you automatically detect any creature moving on stone or earth within range and can predict environmental hazards (collapses, bursts) 1 round before they occur."
    }
  ],

  brineTrader: [
    {
      name: "Tariff Intuition",
      type: 'Passive',
      usage: 'Always Active',
      description: "Years of navigating Syndicate trade law taught you to spot the exact pressure point in any negotiation. You have advantage on Charisma (Persuasion) checks when negotiating prices, tariffs, or contracts.",
      details: "You have advantage on Charisma (Persuasion) checks made to negotiate prices, tariffs, bribes, or contractual terms. You can instantly identify the legal jurisdiction of any Iceheart port and whose authority applies."
    },
    {
      name: 'Brine-Bond Evasion',
      type: 'Active',
      usage: '1/Long Rest',
      description: "When the Syndicate closes in, you know every bolt-hole and back-channel. You and up to 3 allies within 30 feet can instantly blend into a crowd or find a hidden route to evade pursuit.",
      details: "As a bonus action, you and up to 3 allies within 30 feet can make a Stealth check with advantage to evade pursuit in any urban coastal environment. If successful, you find a hidden route, alley, or bolthole that provides total concealment for 1 minute."
    }
  ],

  fogReader: [
    {
      name: 'Fog-Sense',
      type: 'Passive',
      usage: 'Always Active',
      description: "The Frostwood's living fog is not weather, it is a geography you learned to read. You are immune to the disorientation effect of magical or natural fog, and you can sense residue-trails in mist.",
      details: "You are immune to being lost or disoriented by natural or magical fog, mist, or haze. You have advantage on Wisdom (Perception) and Wisdom (Survival) checks in foggy conditions."
    },
    {
      name: 'Memory-Trace',
      type: 'Active',
      usage: '1/Long Rest',
      description: "The fog eats memory, but it cannot eat the trace of what it has already swallowed. Trace the recent passage of any creature through fog or mist for up to 1 mile.",
      details: "As an action, choose a creature whose trail you can see in fog or mist. You can follow their path for up to 1 mile, learning how long ago they passed and whether they were moving in haste, stealth, or combat."
    }
  ],

  zenithCartographer: [
  {
    "name": "Stellar Orientation",
    "type": "Passive",
    "usage": "Always Active",
    "description": "You always know true celestial north, time of day or night, and the phase of Selunis even while deep underground or beneath thick fog.",
    "details": "You cannot become disoriented by non-magical fog or subterranean depth, and gain advantage on Arcana and Survival checks involving astronomical or dimensional phenomena."
  },
  {
    "name": "Zenith Flare",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Concentrated starlight flares from your brass astrolabe, blinding a foe or illuminating the unseen.",
    "details": "For 1 AP, channel starlight to blind one target within 30 ft on a failed Spirit save until the end of their next turn, or illuminate all hidden and invisible creatures within a 20 ft radius."
  }
],

  craterVanguard: [
  {
    "name": "Meteorite Density",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Your dense bone structure and kinetic shock-tolerance anchor you against violent impacts.",
    "details": "You gain advantage on saving throws and checks against being knocked prone or moved against your will, and falling damage is reduced by an amount equal to twice your character level."
  },
  {
    "name": "Ground-Breaker Stomp",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Strike the earth with immense kinetic force, sending a shockwave through nearby foes.",
    "details": "For 1 AP, stomp the ground to force all enemies within 10 ft to succeed on an Agility save or be knocked prone and suffer 1d6 bludgeoning damage."
  }
],

  clockworkHorologist: [
  {
    "name": "Escapement Precision",
    "type": "Passive",
    "usage": "Always Active",
    "description": "You intuitively detect mechanical stress, clockwork timing, trap triggers, and lock tumblers by sound and touch.",
    "details": "You gain advantage on checks to disarm mechanical devices, pick clockwork locks, or repair complex mechanisms and automata."
  },
  {
    "name": "Overclock Mechanism",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Temporarily fine-tune an engineered apparatus for extraordinary output or jam an enemy gear.",
    "details": "For 1 AP, grant an engineered or mechanical device advantage on its next check, or force an enemy mechanical apparatus or automaton to make an Intelligence save or become jammed for 1 turn."
  }
],

  vitriolProspector: [
  {
    "name": "Acid-Tempered Flesh",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Long exposure to chemical runoff has hardened your skin and respiratory system against caustic hazards.",
    "details": "You gain resistance to acid damage and toxic environmental fumes, and can identify chemical compounds and alchemical reagents by scent alone."
  },
  {
    "name": "Caustic Flask Splash",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Hurl a flask of refined vitriol at a nearby foe, dissolving armor and flesh.",
    "details": "For 1 AP, throw a vitriol flask at a target within 20 ft. The target takes 1d6 acid damage and suffers a -1 penalty to Armor Class from corroded armor for 2 turns."
  }
],

  peatTender: [
  {
    "name": "Mycelial Sense",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Pressing your hands to wet soil, moss, or peat reveals the decomposition cycles beneath.",
    "details": "You can sense buried corpses, decomposing organic matter, and subterranean water flows within 60 ft, and gain advantage on Medicine checks using natural fungal poultices."
  },
  {
    "name": "Spore Poultice",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Release soothing medicinal spores to heal and cleanse wounds.",
    "details": "For 1 AP, release medicinal spores on an adjacent creature, restoring 1d8 + Spirit hit points and cleansing one non-magical poison or disease condition."
  }
],

  petrifiedMason: [
  {
    "name": "Lithic Grain",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Centuries of absorbing mineral springs have given your heartwood the grain and resilience of stone.",
    "details": "You gain natural DR 1 against non-magical bludgeoning and crushing damage, and identify structural faults and load-bearing weak points on sight."
  },
  {
    "name": "Bedrock Anchor",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Anchor your petrified roots deep into stone or soil, becoming an immovable pillar.",
    "details": "For 1 AP, anchor yourself to the ground. Until the end of your next turn, you cannot be moved, shoved, knocked prone, or repositioned by any force."
  }
],

  scriptureHerald: [
  {
    "name": "Highborne Decorum",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Your formal heraldic training commands instant deference among highborn houses and religious hierarchies.",
    "details": "You gain advantage on Persuasion and Insight checks when dealing with nobility, diplomats, high priests, or planar entities."
  },
  {
    "name": "Heraldic Decree",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Proclaim an ancestral decree with the ringing authority of the high wind-aeries.",
    "details": "For 1 AP, utter an authoritative decree. One humanoid or planar creature within 30 ft must succeed on a Spirit save or be charmed or frightened (your choice) for 1 turn."
  }
],

  quietTraded: [
  {
    "name": "Echo of the Quiet",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Having traded a sense to the Quiet, your remaining perception expands into the surrounding silence.",
    "details": "You cannot be surprised by hidden or invisible creatures within 30 ft while you remain motionless in darkness or fog, and gain advantage on non-visual Perception checks."
  },
  {
    "name": "Quiet Slip",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Disappear into sensory blind spots even while under observation.",
    "details": "For 1 AP, take the Hide action as a free action, even while observed, provided you are in dim light, fog, or shadow."
  }
],

  trenchListener: [
  {
    "name": "Pressure Reverberation",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Tuned to the subsonic hum of the Treakous Rift, you feel vibrations through water and stone.",
    "details": "You can detect low-frequency vibrations, seismic shifts, and aquatic currents up to 120 ft away, and are immune to being deafened by acoustic shocks."
  },
  {
    "name": "Subsonic Drone",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Vocalize a disorienting low-frequency drone that rattles the equilibrium of nearby foes.",
    "details": "For 1 AP, emit a subsonic wave. Enemies within 15 ft must succeed on a Constitution save or suffer -2 to all attack rolls and physical checks for 1 turn."
  }
],

  saltHingeEnvoy: [
  {
    "name": "Maritime Accords",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Diplomatic credentials recognized across civilized coastal harbors and trade posts.",
    "details": "You and your companions receive free lodging and docking rights in coastal ports, and you gain advantage on checks to evaluate cargo manifests and spot maritime fraud."
  },
  {
    "name": "Spindrift Parley",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Invoke ancient maritime neutrality to stall violence and open negotiations.",
    "details": "For 1 AP, invoke formal maritime parley. A hostile humanoid within 30 ft must succeed on a Spirit save or pause hostile actions for 1 round to hear your terms."
  }
],

  cataractScout: [
  {
    "name": "Current Rider",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Freshwater river currents and marsh muck present no obstacle to your aquatic momentum.",
    "details": "Moving against rapid currents, river rapids, or marsh muck costs no extra movement, and watercraft travel speed is doubled along freshwater rivers."
  },
  {
    "name": "River Surge",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Harness the momentum of flowing water to surge forward in a burst of speed.",
    "details": "For 1 AP, take the Dash action as a free action or grant yourself +20 ft movement speed and water-walking until the end of your turn."
  }
],

  vaultTender: [
  {
    "name": "Vault Thermal Sight",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Centuries in the obsidian shafts under Emberspire trained your eyes to perceive thermal radiation.",
    "details": "In subterranean darkness, you clearly perceive heat signatures and magma veins up to 60 ft away, and you are immune to being blinded by bright flashes of flame or light."
  },
  {
    "name": "Vault Hearth Focus",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Tap into geothermal memory to warm the blood and shield against biting freeze.",
    "details": "For 1 AP, channel latent earth-heat, granting yourself and all allies within 15 ft resistance to cold damage and immunity to freezing penalties for 1 hour."
  }
],

  ashDuneSkimmer: [
  {
    "name": "Ash-Lung Resilience",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Your lungs and respiratory passages are conditioned against toxic volcanic dust.",
    "details": "You cannot suffocate from non-magical volcanic ash, heavy dust, or sulfur fumes, and have advantage on Constitution checks against caldera and arid heat exhaustion."
  },
  {
    "name": "Ash-Cloud Escape",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Kick up a blinding curtain of volcanic sand and ash to disengage safely.",
    "details": "For 1 AP, create a 10 ft radius cloud of dense ash that heavily obscures the area for 1 turn and allow yourself to Disengage immediately as a free action."
  }
],

  sanctuarySeneschal: [
  {
    "name": "Quarantine Vigil",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Rigorous sanitary training lets you spot the earliest signs of blight or infection.",
    "details": "With 1 minute of inspection, you can determine if a creature or food item is infected with non-magical disease or necrotic taint, and gain advantage on saves against contagion."
  },
  {
    "name": "Cleansing Fumigation",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Burn consecrated camphor resin to cleanse the surrounding air of biological corruption.",
    "details": "For 1 AP, burn camphor salts in a 15 ft radius. Cleanses airborne toxins and grants all allies in range advantage on saving throws against disease and poison for 1 hour."
  }
],

  nullSaltHunter: [
  {
    "name": "Blight-Scarred Tenacity",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Deadened nerve-endings in your necrotic scars flare with numbness under mortal peril.",
    "details": "When your hit points fall below one-third of maximum, gain +2 to Armor Class and immunity to pain stun and movement reduction effects until healed."
  },
  {
    "name": "Null-Salt Brand",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Lash a foe with caustic null-salt to sever their connection to magical or necrotic regeneration.",
    "details": "For 1 AP, strike an adjacent target with null-salt. If the target has magical or undead traits, their spellcasting, magical abilities, or regeneration are disrupted for 1 turn."
  }
],

  steppeSinger: [
  {
    "name": "Wind-Pace & Herd-Song",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Throat-singing rhythms that carry across the endless grasslands to guide beasts and clans.",
    "details": "You gain advantage on Animal Handling checks to calm agitated beasts, and mounted or marching overland travel pace for your party is increased by 20% across plains."
  },
  {
    "name": "Ancestral Herd Call",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Sound an ancestral resonant drone that inspires mounts and allies alike.",
    "details": "For 1 AP, sound an ancestral song. All allies within 30 ft gain +10 ft movement speed and advantage on saving throws against fear for 2 turns."
  }
],

  glacierHarpooner: [
  {
    "name": "Ice-Footed Stride",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Crampon conditioning that makes slick glacier crevasses as safe as solid ground.",
    "details": "You ignore difficult terrain caused by ice, snow, or frozen slopes without slipping, and extreme sub-zero cold conditions impose no exhaustion or penalties on physical checks."
  },
  {
    "name": "Harpoon Takedown",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Drive a barbed line-harpoon into a target, anchoring them in place.",
    "details": "For 1 AP, make a harpoon strike or throw (range 30 ft). On hit, deal normal weapon damage and anchor the target; they cannot move away from you until they spend an action to dislodge the hook."
  }
],

  canopyWeaver: [
  {
    "name": "Pheromone Distillation",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Subtle botanical essences that ease social tension and allow rapid reagent gathering.",
    "details": "You gain advantage on Persuasion checks against non-hostile humanoids and beasts, and can harvest fresh botanical and herbal components during any short rest in wild vegetation."
  },
  {
    "name": "Soothing Pollen Cloud",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Disperse a sweet-scented puff of soothing pollen that dampens violent impulses.",
    "details": "For 1 AP, release a 10 ft puff of soothing pollen. Humanoids in range must make a Spirit save or have their aggressive actions suppressed for 1 turn, preventing attack rolls."
  }
],

  briarSentinel: [
  {
    "name": "Thorn-Barbed Bark",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Rigid bark covered in needle-sharp briar thorns that punish close-quarters aggressors.",
    "details": "Any creature that grapples you or hits you with an unarmed strike or natural weapon takes 1d4 piercing damage, and you have advantage on saves against plant-based toxins and thorns."
  },
  {
    "name": "Briar Entangle",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Call forth grasping thorny roots to snare the feet of nearby trespassers.",
    "details": "For 1 AP, cause thorny briars to erupt in a 10 ft radius around you. Enemies in the area must succeed on an Agility save or have their speed reduced to 0 and take 1d4 piercing damage."
  }
],

  keepWarden: [
  {
    "name": "Watch-Bell Recall",
    "type": "Passive",
    "usage": "Always Active",
    "description": "You know the warning signs of structural failure: frost-thick, pipe-groan, or shifting stone. You gain advantage on checks to detect structural collapse, failing seals, or breached walls, and instinctively know the safest exit of any enclosed space.",
    "details": "You gain advantage on checks to detect structural or environmental failure (collapsing floors, failing seals, breached walls) and can name the safest exit of any enclosed settlement you have spent an hour in."
  },
  {
    "name": "Brace the Threshold",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Brace a doorway, portcullis, or defensive choke point against rushing intruders.",
    "details": "For 1 AP, brace a doorway or narrow passage (up to 10 ft wide). Hostile creatures cannot move through the passage until the start of your next turn unless they succeed on a Strength save against your save DC."
  }
],

  spanBuilder: [
  {
    "name": "Load-Bearer",
    "type": "Passive",
    "usage": "Always Active",
    "description": "You intuitively read the safe load and structural flaws of bridges, catwalks, and scaffoldings. You and nearby allies gain advantage on checks to navigate crumbling spans or unstable terrain.",
    "details": "You can read the structural integrity of any span, floor, or bridge at a glance and know its safe load. You gain advantage on checks to cross or reinforce failing structures."
  },
  {
    "name": "Anchor Span",
    "type": "Active",
    "usage": "1/Long Rest",
    "description": "Reinforce or brace a failing structure long enough for companions to cross safely.",
    "details": "Once per long rest, for 1 AP you may brace a collapsing structure, ladder, or bridge long enough for up to 4 allies to cross safely (they pass unharmed; you take the strain)."
  }
],

  contractClerk: [
  {
    "name": "Subclause Scrutiny",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Trained in Athien contractual scripture, you immediately spot deceptive wording, hidden stipulations, or forgery in written documents.",
    "details": "You gain advantage on Investigation and Insight checks to inspect contracts, warrants, ledgers, and treaties for omissions or bad-faith stipulations."
  },
  {
    "name": "Filed Witness",
    "type": "Active",
    "usage": "1/Long Rest",
    "description": "Invoke the First Contract to compel a moment of unvarnished truth.",
    "details": "Once per long rest, for 1 AP when a creature speaks a falsehood in your presence, invoke the Contract aloud; the creature must make a Spirit save (DC 13) or be unable to repeat that specific lie for one day."
  }
],

  obligationBroker: [
  {
    "name": "Debt Scent",
    "type": "Passive",
    "usage": "Always Active",
    "description": "You sense the unspoken pressure of debts, pledges, and leverage. You have advantage on Insight checks to determine what a creature desires or owes.",
    "details": "You gain advantage on Insight and Persuasion checks when dealing with financial transactions, debt collection, or collateral negotiation."
  },
  {
    "name": "Web-Read",
    "type": "Active",
    "usage": "1/Long Rest",
    "description": "Sense a binding obligation and its strain upon a creature.",
    "details": "Once per long rest, for 1 AP after interacting with a creature for at least a minute, learn one true obligation they carry (debt, oath, promised favor) and whether it is close to breaking."
  }
],

  greymarkArchivist: [
  {
    "name": "Living Index",
    "type": "Passive",
    "usage": "Always Active",
    "description": "You have committed thousands of lineages to memory, granting advantage on History and Arcana checks relating to erased lineage, heraldry, or regional treaties.",
    "details": "You can recite the recorded ancestry of any Frostwood family you have studied, and Tallyn recognize your authority."
  },
  {
    "name": "Recall the Forgotten",
    "type": "Active",
    "usage": "1/Long Rest",
    "description": "Recall a specific detail erased by the fog or soothe an ally lost in memory-loss.",
    "details": "Once per long rest, for 1 AP speak aloud an exact truth or forgotten identity erased by the Frostwood mist, or clear the bewildered or memory-fogged condition from one ally within 30 ft."
  }
],

  privateer: [
  {
    "name": "Letter of Marque",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Your commissioned status grants safe harbor and preferential market tariffs in maritime ports, plus advantage on Intimidation checks against maritime authorities.",
    "details": "In coastal settlements you can claim safe harbor, sell prize goods at a reduced tariff, and legally refuse a Press-Warrant once per port."
  },
  {
    "name": "Boarding Repartee",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Issue a commanding nautical maneuver or threat to rally a squadmate.",
    "details": "For 1 AP, grant one ally within 30 ft +10 ft movement speed and advantage on their next attack roll before the end of the round."
  }
],

  nameless: [
  {
    "name": "Unperson",
    "type": "Passive",
    "usage": "Always Active",
    "description": "Having no entry in any registry, you cannot be located or tracked by name-keyed divination, contract magic, or bureaucratic scrying.",
    "details": "Registry- and Ledger-keyed magic and bureaucracy cannot target or track you by name (this includes First Contract-keyed detection)."
  },
  {
    "name": "Slip the Ledger",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Vanish from sight or evade identification when pursued.",
    "details": "For 1 AP, when targeted by an attack or investigation check, use a reaction to blend into shadows or a crowd, imposing disadvantage on the attack or check."
  }
],

  cryptKeeper: [
  {
    "name": "Ancestral Light",
    "type": "Passive",
    "usage": "Always Active",
    "description": "You can read fungal ancestral lights of a crypt: which are at rest, which are failing, and which are corrupted.",
    "details": "You have advantage on checks to detect undead, fungal corruption, or a light that has been tampered with, and you can safely seal (or release) one such light per long rest."
  },
  {
    "name": "Lantern Hallowing",
    "type": "Active",
    "usage": "1/Short Rest",
    "description": "Ignite or channel ancestral spirit lantern light to ward off restless dead.",
    "details": "For 1 AP, channel your ancestral light in a 20 ft radius. Undead within the area must succeed on a Spirit save or suffer 1d8 radiant damage and be turned for 1 turn."
  }
]
};

export const getBackgroundAbilities = (backgroundId) => {
  return BACKGROUND_ABILITIES[backgroundId] || [];
};

export const getAllBackgroundAbilities = () => {
  return BACKGROUND_ABILITIES;
};

export const getBackgroundAbilityByName = (backgroundId, abilityName) => {
  const abilities = getBackgroundAbilities(backgroundId);
  return abilities.find(ability => ability.name === abilityName) || null;
};

export const getPassiveAbilities = (backgroundId) => {
  const abilities = getBackgroundAbilities(backgroundId);
  return abilities.filter(ability => ability.type === 'Passive');
};

export const getActiveAbilities = (backgroundId) => {
  const abilities = getBackgroundAbilities(backgroundId);
  return abilities.filter(ability => ability.type === 'Active');
};
