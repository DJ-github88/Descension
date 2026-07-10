export const BACKGROUND_ABILITIES = {
  emberspirePilgrim: [
    {
      name: "Dawn's Favor",
      type: 'Passive',
      usage: '1/Long Rest',
      description: "The Solbrand's warmth lingers in the faithful long after the pilgrimage ends. Gain resistance to radiant damage and advantage on one roll per long rest.",
      details: "You have resistance to radiant damage. Once per long rest, you can choose to have advantage on any d20 roll you make."
    },
    {
      name: 'Smite the Unfaithful',
      type: 'Active',
      usage: '1/Short Rest',
      description: 'The Dawn Vigil brands its weapons with captured Solbrand-light. Imbue your weapon with sacred energy for bonus radiant damage on your next attack.',
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
      description: "The Synod-Hold's crystal-lattice archives taught you to read resonance the way a scribe reads ink. Cast Detect Magic at will and gain advantage on checks to identify spells.",
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
      description: "You read Neth contracts the way an Inquisitor reads guilt. Gain advantage on Insight checks to detect lies and hidden motives, and one additional language.",
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
      description: "The Wyrd-trails left by the dead are still visible to those who survived the hush. See invisible creatures and into the Ethereal Plane for 1 minute.",
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
      description: "The cold iron stakes you carry can bind the Wyrd. Create a 15-foot-radius ward that suppresses Wyrd effects and damages Wyrd-creatures.",
      details: "As an action, drive a cold iron stake into the ground to create a 15-foot-radius ward centered on it that lasts 1 minute. Wyrd-creatures in the ward take 1d6 force damage when they start their turn there, and all Wyrd-related magical effects within the ward have their save DC reduced by 2."
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
      description: "The Briaran carry Viridane's thorns in their blood. Transform part of your body to gain bestial benefits for 10 minutes, leaving thorn-scars on anything you strike.",
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
      description: "A Drall dropout or Kethrin scholar, you can jury-rig anything. Modify a spell or device by changing one aspect of its function for a single use.",
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
      name: 'Constellation-Lore',
      type: 'Passive',
      usage: 'Always Active',
      description: "The Sky-Songs still map the stars that went dark. Gain resistance to radiant damage and advantage on Arcana or Religion checks involving celestial or constellation-spirit phenomena.",
      details: "You have resistance to radiant damage. You have advantage on Intelligence (Arcana) or Intelligence (Religion) checks related to celestial phenomena, constellation-spirits, or the Luminarchy's rites."
    },
    {
      name: 'Celestial Surge',
      type: 'Active',
      usage: '1/Long Rest',
      description: "The constellation-spirit in every Astril host remembers the sun. Enter a surge state for 1 minute, reducing spell costs and casting one spell for free.",
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
      description: "The Frostwood's living fog is not weather, it is a geography you learned to read. You are immune to the disorientation effect of magical or natural fog, and you can sense Wyrd-trails in mist.",
      details: "You are immune to being lost or disoriented by natural or magical fog, mist, or haze. You have advantage on Wisdom (Perception) and Wisdom (Survival) checks in foggy conditions."
    },
    {
      name: 'Memory-Trace',
      type: 'Active',
      usage: '1/Long Rest',
      description: "The fog eats memory, but it cannot eat the trace of what it has already swallowed. Trace the recent passage of any creature through fog or mist for up to 1 mile.",
      details: "As an action, choose a creature whose trail you can see in fog or mist. You can follow their path for up to 1 mile, learning how long ago they passed and whether they were moving in haste, stealth, or combat."
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
