import { UTILITY_SPELLS } from '../spells/utilitySpells';
/**
 * Crusader Class Data
 *
 * Complete class information for the Crusader - The Sol-Bound Zealot.
 * A heavy starlight-forged juggernaut who channels Aex's Willing Sacrifice
 * to re-enforce the binding frequency and execute Wyrd corruption.
 */

export const CRUSADER_DATA = {
  id: "crusader",
  name: "Crusader",
  title: "The Sol-Bound Zealot",
  icon: "fas fa-cross",
  role: "Damage / Tank",
  damageTypes: ["sacred", "ember", "physical", "storm"],

  restrictions: {
    allowedSubraces: [
      "solvarn_human",
      "skald_human",
      "thrask_emberth",
      "silath_astril"
    ],
    hardBlocks: [
      "mimir",
      "neth",
      "groven",
      "fexric"
    ],
    narrativeUnlock: true,
    justification: "Requires proximity to Solvan starlight relics or Emberspire's radiant calderas. Mimir are too identity-fragile to sustain Aex's song. Neth cannot reconcile starlight zeal with Morvane's legal contracts. Groven are vat-born creatures whose biology rejects sacred harmonics."
  },

  livingOrder: {
    orderName: 'The Solvan Vigil',
    founder: {
      name: '<LoreLink termId="lord-captain-vane-solvan">Lord-Captain Vane Solvan</LoreLink>',
      status: 'Fallen at the Wyrd-Breach. His shattered starlight blade is mounted above the Great Forge in Sundale.',
      note: 'The first to forge starlight steel into heavy battle-plates. He bound Aex\'s Willing Sacrifice to physical armor.'
    },
    currentLeader: {
      name: '<LoreLink termId="hierophant-aethelgard">Hierophant Aethelgard</LoreLink>',
      title: 'High Purger of the Dawn Vigil',
      characterization: 'An unyielding Solvarn zealot who treats starlight as a non-negotiable martial law.'
    },
    headquarters: { name: 'The Obsidian Citadel', locationId: 'sundale' },
    crisisConnection: 'Aethelgard demands Crusaders reforge the 7 Sundered Monoliths, unaware that the 7th Monolith is tainted by Keth-Amar.'
  },

  worldFriction: [
    { region: 'sundale', location: 'harath_vault', status: 'reverend', consequence: 'Crusaders lead the frontline against Wyrd incursions from the caldera.', workaround: 'None needed; honored by forge-masters.' },
    { region: 'bryngloom-forest', location: 'atropolis', status: 'distrusted', consequence: 'Atropolis archivists view Crusader zeal as fanatical extremism that threatens fragile contracts.', workaround: 'Sheathe starlight greatswords and register as heavy guards.' }
  ],

  overview: {
    title: "The Crusader",
    subtitle: "The Sol-Bound Zealot",
    illustration: "/assets/images/classes/crusader_illustration.png",
    illustrationCaption: "A Solvarn Crusader channeling Aex's starlight song through a shattered greatsword.",
    originStory: `Born in Year 11 of the Dimming post-Great Breach, the Crusader path was forged when House Solvan knights recognized that faith alone could not hold back Keth-Amar's Wyrd-spawns. They embedded shattered starlight relics directly into their heavy plate and weapons, converting Aex's Willing Sacrifice into a martial frequency of destruction.`,
    quickOverview: {
      title: "Quick Overview",
      content: `**Who they are**: Frontline starlight purgers who convert physical combat and sacred conviction into Radiant Fervor.

**The hook**: Generate Radiant Fervor by swinging greatswords and absorbing hits. At 50+ Fervor, enter Harmonic Stance to deal bonus sacred damage on all strikes. At 100 Fervor, unleash Solvan Judgment to shatter enemy defenses.

**The cost**: Maintaining starlight zeal strains body and mind; failing to vent Fervor causes starlight burnout.

**Bring one for**: Unstoppable frontline defense, sacred AoE smites, and anti-Wyrd purging.`
    },
    description: `The Crusader is a heavy starlight-forged juggernaut who channels Aex's Willing Sacrifice to re-enforce the binding frequency and execute Wyrd corruption.`,
    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE GENESIS**
Forged during the Dimming when Solvan knights bound Aex's starlight song to heavy armor to hold the Wyrd-breach.

**CITIES & CIVIL RECEPTION**
Highly revered in Sundale and Emberspire; viewed with caution by Atropolis archivists who fear religious zeal.

**RACES & CULTURAL AFFILIATION**
Solvarn humans carry the ancestral starlight lineage; Skald humans fuse it with the Hunger Pact; Waste-Solari draw geothermal magma-fire; Stellar Astril refract it through crystal skin.

**NOTABLE FIGURES**
* **Lord-Captain Vane Solvan**: The first to forge starlight steel into heavy battle-plates.
* **Hierophant Aethelgard**: Leader of the Dawn Vigil.`
    },
    signatureQuote: {
      text: '"My ancestor held the knife that flayed the star\'s child. I hold the blade that will cut down anything that tries to finish the meal."',
      speaker: 'Lord-Captain Vane Solvan',
      context: 'To a Dawn Vigil initiate before the charge into the Wyrd-breach'
    },
    philosophy: {
      coreTenet: 'Starlight is not a passive blessing. It is a sword forged in sacrifice, bought with Aex\'s blood, and sustained by those who stand in the dark.',
      relationship: 'Crusaders see themselves as living seals holding back Keth-Amar.',
      paradox: 'To protect life, they must burn their own mortality in starlight zeal.'
    },
    currentCrisis: `The Dawn Vigil is divided: Hierophant Aethelgard commands all Crusaders to reforge the 7 Monoliths, while veteran Crusaders suspect the 7th Monolith is corrupted by Keth-Amar.`,
    meaningfulTradeoffs: `High armor and holy smites come at the cost of mobility and heavy dependence on Radiant Fervor management.`,
    classSpecificLocations: [
      {
        name: 'The Obsidian Citadel',
        locationId: 'sundale',
        description: 'The bastion of the Dawn Vigil guarding the Ashen Escarpment.',
        purpose: 'Training and holy vows',
        status: 'Active'
      }
    ],
    combatRole: {
      title: "The Frontline Starlight Purger",
      content: `Generates Radiant Fervor through physical strikes and soak rolls, unleashing sacred smites and starlight barriers.`
    },
    playstyle: {
      title: "Fervor-Driven Smite Engine",
      content: `Balance physical weapon swings with Radiant Fervor spending. Build Fervor to 50 for Harmonic Stance, or dump 100 for Solvan Judgment.`
    },
    immersiveCombatExample: {
      title: "Combat Example: Solvan Judgment",
      content: `**Turn 1**: Strike with Starlight Cleave, building +15 Radiant Fervor. Absorbing hits builds +20 Fervor. At 100 Fervor, call down Solvan Judgment to obliterate Wyrd abominations.`
    }
  },

  subraceVariants: {
    solvarn_human: {
      subraceName: 'Solvarn',
      title: 'The Starlight-Blade',
      reframe: `Descendants of the original <LoreLink termId="house_solvan">Solvarn</LoreLink> knights who wielded the starlight blade at the Binding. To a Solvarn Crusader, every strike is an act of penance for the knife that flayed <LoreLink termId="aex">Aex</LoreLink>. They carry shattered fragments of starlight-forged steel embedded in their greatswords, converting ancestral guilt into blinding solar zeal.`,
      signatureAbility: {
        name: 'Starlight Resonance',
        description: `Radiant Fervor builds 50% faster near Solvan relics or active sun-beacons. Standing on consecrated ground causes your Greatsword strikes to deal +1d4 bonus sacred damage.`
      },
      currentCrisisAngle: `The Dawn Vigil's schism cuts deepest among Solvarn Crusaders: the High Hierophants demand Crusaders reforge the Sundered Monoliths, while veteran Crusaders who have seen the Wyrd-taint in the 7th Monolith suspect the ritual is a trap engineered by Keth-Amar.`,
      signatureQuote: {
        text: '"My ancestor held the knife that flayed the star\'s child. I hold the blade that will cut down anything that tries to finish the meal."',
        speaker: 'Lord-Captain Vane Solvan',
        context: 'To a Dawn Vigil initiate before the charge into the Wyrd-breach'
      }
    },

    skald_human: {
      subraceName: 'Skald',
      title: 'The Frost-Hearth Zealot',
      reframe: `The <LoreLink termId="skald">Skald</LoreLink> Crusaders merged the Hunger Pact with Solvan starlight doctrine during the Bloodhammer migration into <LoreLink termId="sundale">Sundale</LoreLink>. They treat their greatswords as mobile hearths in Nordhalla’s blizzards. When a Skald Crusader ignites their Fervor, the blade emits intense thermal warmth, keeping their party alive in whiteout blizzards.`,
      signatureAbility: {
        name: 'Hearth-Blade Ignition',
        description: `Venting Radiant Fervor creates a 20 ft thermal aura. Allies standing within the aura take half damage from rime freezing hazards and gain Advantage on CON Saves.`
      },
      currentCrisisAngle: `The Skald Crusaders reject the Skald Council's execution order against the Unbound. They view the Unbound Berserkers as lost kin needing starlight guidance rather than heretics to be executed.`,
      signatureQuote: {
        text: '"The ice wants your toes. The dark wants your soul. My blade says neither one gets a turn today."',
        speaker: 'Haldor Iron-Hearth',
        context: 'Spoken while holding the Ancestor-Span bridge during a three-day blizzard'
      }
    },

    thrask_emberth: {
      subraceName: 'Waste-Solari - Thyrm',
      title: 'The Magma Crusader',
      reframe: `The <LoreLink termId="emberth">Waste-Solari</LoreLink> Crusaders channel <LoreLink termId="scathrach">Scathrach's</LoreLink> uncorrupted ember to infuse heavy plate armor with geothermal heat. They view Aex's song as the magma-hum of <LoreLink termId="emberspire">Emberspire</LoreLink>. Their zeal is tectonic, welding heavy iron plate directly to their shoulders.`,
      signatureAbility: {
        name: 'Caldera-Cleave',
        description: `Spending Radiant Fervor converts 50% of your sacred damage into ember damage, setting the ground on fire and dealing continuous ember ticks to enemies.`
      },
      currentCrisisAngle: `As Emberspire's calderas cool, Waste-Solari Crusaders are forced deeper into Scathrach's subterranean vents, risking exposure to Wyrd-taint to keep their armor heated.`,
      signatureQuote: {
        text: '"You pray to a sun you never saw. I pray to the boiling mud under my boots. Let us see whose god hits harder."',
        speaker: 'Korr Vulcan-Shield',
        context: 'Addressing a Solvarn priest in the Harath-Vault'
      }
    },

    silath_astril: {
      subraceName: 'Stellar Astril - Astril',
      title: 'The Crystal Judgment',
      reframe: `The <LoreLink termId="astril">Stellar Astril</LoreLink> Crusaders resonate with Aex's willing sacrifice, using their crystalline skin lattice to act as a tuning fork for starlight. When they absorb damage, the energy refracts through their skin, charging their blade with golden harmonic frequency.`,
      signatureAbility: {
        name: 'Refractive Armor',
        description: `Rolling your Active Soak die against spell strikes generates +5 Radiant Fervor. Absorbing spell damage empowers your next strike with +1d6 bonus sacred damage.`
      },
      currentCrisisAngle: `The accuracy collapse in Astril star-arithmetic has driven Stellar Crusaders to abandon passive observation entirely: they now enforce starlight justice through physical combat.`,
      signatureQuote: {
        text: '"My skin broke in the shape of a star eight hundred years ago. I am merely passing the light forward."',
        speaker: 'Valen Prism-Blade',
        context: 'Before executing a Wyrd-Channel in the Frostwood'
      }
    }
  },

  combatRole: {
    title: "The Frontline Starlight Purger",
    content: `The Crusader is a heavy offensive juggernaut that generates **Radiant Fervor** (0–100) through physical combat and starlight invocation. 
    
    When Fervor reaches 50+, the Crusader enters **Aex's Harmonic Stance**, causing all melee strikes to deal bonus **sacred** damage. Spending 100 Fervor unleashes **Solvan Judgment**, a 3 AP catastrophic AoE smite that shatters enemy Passive DR and leaves sanctified ground.`
  },

  resourceEngine: {
    name: "Radiant Fervor",
    max: 100,
    color: "#f59e0b",
    icon: "faCross",
    description: "Generated by dealing melee strikes, taking physical hits, or standing on sanctified ground. Used to empower holy flurries and unleash Solvan Judgment."
  },

  resourceSystem: {
    title: "Radiant Fervor & Harmonic Stance",
    subtitle: "Aex's Willing Sacrifice",
    description: "Radiant Fervor (0-100) measures your starlight frequency and holy zeal. Generated by swinging greatswords, absorbing blows with your Active Soak die, and standing on consecrated ground. At 50+ Fervor, enter Harmonic Stance to empower all strikes with sacred damage. At 100 Fervor, unleash Solvan Judgment.",
    cards: [
      {
        title: "Radiant Fervor (0-100)",
        stats: "Holy Frequency Scale",
        details: "Starlight zeal built through melee strikes and defensive soak. Used to fuel holy flurries and unleash Solvan Judgment."
      }
    ],
    generationTable: {
      headers: ["Action", "Fervor Gain", "Effect"],
      rows: [
        ["Melee Strike (Starlight Cleave)", "+15 Fervor", "Deals physical + sacred damage"],
        ["Taking Hit / Active Soak Roll", "+10 Fervor", "Converts damage taken into starlight resonance"],
        ["Standing on Consecrated Ground", "+5 Fervor per turn", "Holy ambient recharge"],
        ["Harmonic Stance (50+ Fervor)", "Passive buff", "All melee strikes deal +1d6 bonus sacred damage"],
        ["Solvan Judgment (100 Fervor)", "Consumes 100 Fervor", "Catastrophic 3 AP 20 ft AoE smite"]
      ]
    }
  },

  spells: []
};

export const CRUSADER_ABILITIES = [
  // ━━━ LEVEL 1 ━━━
  {
    id: 'starlight_cleave',
    name: 'Starlight Cleave',
    description: 'Sweep a heavy 2H weapon in a wide arc infused with Aex\'s song, cutting through enemy ranks.',
    level: 1,
    spellType: 'ACTION',
    icon: 'Radiant/Radiant Divinity',
    effectTypes: ['damage'],
    typeConfig: {
      school: 'sacred',
      icon: 'Radiant/Radiant Divinity',
      tags: ['sacred', 'physical', 'melee'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'cone',
      rangeType: 'melee',
      rangeDistance: 5,
      areaSize: 10,
      targetRestrictions: ['enemies']
    },
    resourceCost: {
      actionPoints: 2,
      mana: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 0
    },
    damageConfig: {
      formula: '1d10 + strength + 1d6',
      damageTypes: ['physical', 'sacred'],
      resolution: 'DICE'
    },
    customMechanic: 'Generates +15 Radiant Fervor on hit.'
  },

  // ━━━ LEVEL 2 ━━━
  {
    id: 'radiant_guard',
    name: 'Radiant Guard',
    description: 'Channel Fervor into your heavy plate, surrounding yourself or an ally with a barrier of starlight.',
    level: 2,
    spellType: 'ACTION',
    icon: 'Shield/Prismatic Shield',
    effectTypes: ['buff'],
    typeConfig: {
      school: 'sacred',
      icon: 'Shield/Prismatic Shield',
      tags: ['sacred', 'buff', 'defense'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['ally', 'self']
    },
    resourceCost: {
      actionPoints: 1,
      mana: 0,
      classResource: { type: 'fervor', amount: 20 }
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 1
    },
    buffConfig: {
      buffType: 'damageMitigation',
      effects: [
        { id: 'radiant_soak', name: 'Radiant Guard', description: '+2 bonus to Active Soak Die rolls for 1 round.', mechanicsText: '' }
      ]
    }
  },

  // ━━━ LEVEL 3 ━━━
  {
    id: 'zealots_eye',
    name: 'Zealot\'s Inquisitive Eye',
    description: 'Channel Aex\'s pure light through your eyes to detect Wyrd-taint in food, soil, or civilian bloodlines.',
    level: 3,
    spellType: 'UTILITY',
    icon: 'Psychic/Psychic Telepathy',
    effectTypes: ['buff'],
    typeConfig: {
      school: 'sacred',
      icon: 'Psychic/Psychic Telepathy',
      tags: ['utility', 'rp', 'detection'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    resourceCost: {
      actionPoints: 1,
      mana: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 0
    },
    buffConfig: {
      buffType: 'custom',
      effects: [
        { id: 'wyrd_sense', name: 'Starlight Vision', description: 'Gain Advantage on Perception and Investigation checks to detect Wyrd corruption for 10 minutes.', mechanicsText: '' }
      ]
    }
  },

  // ━━━ LEVEL 4 ━━━
  {
    id: 'righteous_upheaval',
    name: 'Righteous Upheaval',
    description: 'Slam your greatsword into the volcanic earth, erupting a wave of starlight and stone in a 15 ft cone.',
    level: 4,
    spellType: 'ACTION',
    icon: 'Evocation/Ground Slam',
    effectTypes: ['damage', 'debuff'],
    typeConfig: {
      school: 'sacred',
      icon: 'Evocation/Ground Slam',
      tags: ['sacred', 'physical', 'aoe', 'control'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'cone',
      rangeType: 'melee',
      rangeDistance: 15,
      areaSize: 15,
      targetRestrictions: ['enemies']
    },
    resourceCost: {
      actionPoints: 2,
      mana: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 2
    },
    damageConfig: {
      formula: '2d8 + strength',
      damageTypes: ['physical', 'sacred'],
      resolution: 'DICE',
      savingThrow: {
        ability: 'strength',
        difficultyClass: 14,
        saveOutcome: 'half_damage'
      }
    },
    debuffConfig: {
      debuffType: 'statusEffect',
      effects: [
        { id: 'prone', name: 'Prone', description: 'Knocked Prone on a failed STR Save.', mechanicsText: '' }
      ]
    }
  },

  // ━━━ LEVEL 5 ━━━
  {
    id: 'chakram_of_aex',
    name: 'Chakram of Aex',
    description: 'Hurl a spinning disc of crystallized starlight 30 ft down a line, slicing foes before returning to hand.',
    level: 5,
    spellType: 'ACTION',
    icon: 'Holy/Holy Disc',
    effectTypes: ['damage'],
    typeConfig: {
      school: 'sacred',
      icon: 'Holy/Holy Disc',
      tags: ['sacred', 'line', 'ranged'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'line',
      rangeType: 'ranged',
      rangeDistance: 30,
      areaSize: 5,
      targetRestrictions: ['enemies']
    },
    resourceCost: {
      actionPoints: 2,
      mana: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 2
    },
    damageConfig: {
      formula: '2d8 + strength/2',
      damageTypes: ['sacred'],
      resolution: 'DICE'
    }
  },

  // ━━━ LEVEL 6 ━━━
  {
    id: 'sanctified_hearth',
    name: 'Sanctified Hearth',
    description: 'Plant your greatsword into the snow for 10 minutes, creating a 20 ft warm holy zone that melts ice barriers.',
    level: 6,
    spellType: 'UTILITY',
    icon: 'Fire/Hearth Flame',
    effectTypes: ['buff'],
    typeConfig: {
      school: 'ember',
      icon: 'Fire/Hearth Flame',
      tags: ['utility', 'rp', 'hearth'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'self_centered',
      areaSize: 20,
      targetRestrictions: ['ally', 'self']
    },
    resourceCost: {
      actionPoints: 1,
      mana: 0
    },
    cooldownConfig: {
      cooldownType: 'short_rest',
      cooldownValue: 1
    },
    buffConfig: {
      buffType: 'auraEffect',
      effects: [
        { id: 'hearth_warmth', name: 'Sanctified Hearth', description: 'Allies in 20 ft ignore sub-zero rime freezing hazards and melt ice obstacles.', mechanicsText: '' }
      ]
    }
  },

  // ━━━ LEVEL 7 ━━━
  {
    id: 'reprimand_of_the_zealot',
    name: 'Reprimand of the Zealot',
    description: 'Interrupt an enemy casting a spell within 30 ft with a bolt of starlight lightning.',
    level: 7,
    spellType: 'REACTION',
    icon: 'Lightning/Starlight Strike',
    effectTypes: ['damage', 'debuff'],
    typeConfig: {
      school: 'sacred',
      icon: 'Lightning/Starlight Strike',
      tags: ['sacred', 'storm', 'reaction', 'interrupt'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['enemies']
    },
    resourceCost: {
      actionPoints: 1,
      mana: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 2
    },
    damageConfig: {
      formula: '2d6 + spirit',
      damageTypes: ['sacred', 'storm'],
      resolution: 'DICE',
      savingThrow: {
        ability: 'constitution',
        difficultyClass: 15,
        saveOutcome: 'damage_on_fail'
      }
    },
    debuffConfig: {
      debuffType: 'statusEffect',
      effects: [
        { id: 'stunned', name: 'Stunned', description: 'Spell interrupted and target Stunned for 1 round on failed CON Save.', mechanicsText: '' }
      ]
    }
  },

  // ━━━ LEVEL 8 ━━━
  {
    id: 'solar_flameblade',
    name: 'Solar Flameblade',
    description: 'Infuse your weapon with holy volcanic flame for 1 minute, causing strikes to deal bonus ember/sacred damage.',
    level: 8,
    spellType: 'ACTION',
    icon: 'Fire/Flame Sword',
    effectTypes: ['buff'],
    typeConfig: {
      school: 'ember',
      icon: 'Fire/Flame Sword',
      tags: ['ember', 'sacred', 'buff', 'weapon'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    resourceCost: {
      actionPoints: 1,
      mana: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 3
    },
    buffConfig: {
      buffType: 'damageIncrease',
      effects: [
        { id: 'flameblade_buff', name: 'Solar Flameblade', description: 'Melee strikes deal +1d6 ember/sacred damage and ignore physical DR for 1 minute.', mechanicsText: '' }
      ]
    }
  },

  // ━━━ LEVEL 9 ━━━
  {
    id: 'shield_of_light_and_steel',
    name: 'Shield of Light & Steel',
    description: 'Raise a massive radiant barrier granting +3 Passive DR and reflecting sacred retaliation at attackers.',
    level: 9,
    spellType: 'ACTION',
    icon: 'Shield/Radiant Aegis',
    effectTypes: ['buff'],
    typeConfig: {
      school: 'sacred',
      icon: 'Shield/Radiant Aegis',
      tags: ['sacred', 'buff', 'defense'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    resourceCost: {
      actionPoints: 2,
      mana: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 3
    },
    buffConfig: {
      buffType: 'damageMitigation',
      effects: [
        { id: 'light_shield', name: 'Light & Steel', description: '+3 Passive DR; melee attackers take 1d8 sacred retaliation damage for 2 rounds.', mechanicsText: '' }
      ]
    }
  },

  // ━━━ LEVEL 10 ━━━
  {
    id: 'solvan_judgment_titanfall',
    name: 'Solvan Judgment / Titanfall',
    description: 'Consume 100 Radiant Fervor to call down a titanic starlight hammer smash in a 20 ft radius.',
    level: 10,
    spellType: 'ACTION',
    icon: 'Evocation/Titanfall Hammer',
    effectTypes: ['damage'],
    typeConfig: {
      school: 'sacred',
      icon: 'Evocation/Titanfall Hammer',
      tags: ['sacred', 'storm', 'aoe', 'capstone'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 60,
      areaShape: 'circle',
      areaSize: 20,
      targetRestrictions: ['enemies']
    },
    resourceCost: {
      actionPoints: 3,
      mana: 0,
      classResource: { type: 'fervor', amount: 100 }
    },
    cooldownConfig: {
      cooldownType: 'long_rest',
      cooldownValue: 1
    },
    damageConfig: {
      formula: '5d10 + strength + spirit',
      damageTypes: ['sacred', 'storm'],
      resolution: 'DICE',
      savingThrow: {
        ability: 'agility',
        difficultyClass: 16,
        saveOutcome: 'half_damage'
      }
    }
  }
];

CRUSADER_DATA.spells = CRUSADER_ABILITIES;
