export const TOKEN_TEMPLATES = {

  // =========================================================================
  // ANIMIST (6 tokens — one per real summon spell in animistData.js)
  // Class resource: Ancestral Resonance. Totems are stationary (speed 0) and
  // radiate an aura (auraRadius). Specters/guardians are mobile + mentally
  // controlled. spellId values match animist_* spellbook entries exactly.
  // =========================================================================
  animist: [
    {
      id: 'animist_healing_totem',
      name: 'Bone Sprout Totem',
      description: 'The root-veins of Bryngloom answer the Animist\'s chant as bone tears free of living flesh. A healing totem erupts from the soil, its verdant light mending allies in a 15ft radius at the start of each turn.',
      level: 1,
      spellId: 'animist_healing_totem',
      category: 'totem',
      auraRadius: 15,
      creature: {
        name: 'Bone Sprout Totem',
        type: 'CONSTRUCT',
        size: 'SMALL',
        stats: { maxHp: 15, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_nature_healingtouch',
        abilities: ['Heals allies in 15ft radius for 1d6 + Spirit HP at start of your turn'],
      },
      quantity: 1,
      duration: { value: 3, unit: 'rounds' },
      controlType: 'autonomous',
      resourceCost: { mana: 4, resonance: -3, actionPoints: 1 },
    },
    {
      id: 'animist_gale_totem',
      name: 'Storm-Howl Totem',
      description: 'A lightning totem wrenches free of the Animist\'s wrist, crackling with the storm-spirits of the open steppe. It shocks and repels any enemy that draws near its 15ft radius.',
      level: 2,
      spellId: 'animist_gale_totem',
      category: 'totem',
      auraRadius: 15,
      creature: {
        name: 'Storm-Howl Totem',
        type: 'CONSTRUCT',
        size: 'SMALL',
        stats: { maxHp: 20, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_lightning_thunderstorm',
        abilities: ['Deals 2d6 + Spirit storm damage to enemies in 15ft radius', 'Pushes targets 10ft away (Storm Gust)'],
      },
      quantity: 1,
      duration: { value: 3, unit: 'rounds' },
      controlType: 'autonomous',
      resourceCost: { mana: 6, resonance: -3, actionPoints: 1 },
    },
    {
      id: 'animist_threshold_ward',
      name: 'Threshold Ward Totem',
      description: 'A warding totem of bone and script anchors a safe circle of 30ft, shielding those who rest within from the Wyrd and the wild. A totem of refuge, not of war.',
      level: 2,
      spellId: 'animist_threshold_ward',
      category: 'totem',
      auraRadius: 30,
      creature: {
        name: 'Threshold Ward Totem',
        type: 'CONSTRUCT',
        size: 'SMALL',
        stats: { maxHp: 10, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_holy_devotion',
        abilities: ['Grants allies in 30ft radius refuge from Wyrd intrusion', 'Safe rest site (exploration/rest)'],
      },
      quantity: 1,
      duration: { value: 10, unit: 'minutes' },
      controlType: 'autonomous',
      resourceCost: { mana: 4, resonance: -2, actionPoints: 1 },
    },
    {
      id: 'animist_spirit_wolves',
      name: 'Wendigo Specters',
      description: 'Two spectral wolves leap from the Animist\'s shadow at the whispered true-name of the dead. Made of blight and hunger, they harry enemies under the summoner\'s mental command.',
      level: 3,
      spellId: 'animist_spirit_wolves',
      category: 'beast',
      creature: {
        name: 'Wendigo Specter',
        type: 'BEAST',
        size: 'MEDIUM',
        stats: { maxHp: 30, maxMana: 0, speed: 40 },
        tokenIcon: 'ability_hunter_pet_wolf',
        abilities: ['Mental control within 60ft', '1d8+3 blight bite attack'],
      },
      quantity: 2,
      duration: { value: 5, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { mana: 8, resonance: -3, actionPoints: 1 },
    },
    {
      id: 'animist_primeval_totem',
      name: 'Primal Beast Totem',
      description: 'A colossal totem of bone and root erupts, channelling the beast-totem rage of Bryngloom\'s first dawn. Allies within 30ft are emboldened by the primeval spirit\'s fury.',
      level: 8,
      spellId: 'animist_primeval_totem',
      category: 'totem',
      auraRadius: 30,
      creature: {
        name: 'Primal Beast Totem',
        type: 'CONSTRUCT',
        size: 'LARGE',
        stats: { maxHp: 80, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_nature_elementalshields',
        abilities: ['Allies in 30ft radius gain Beast Totem Rage: +2 attack rolls, +2 DR'],
      },
      quantity: 1,
      duration: { value: 5, unit: 'rounds' },
      controlType: 'autonomous',
      resourceCost: { mana: 16, resonance: 8, actionPoints: 1 },
    },
    {
      id: 'animist_spectral_guardian',
      name: 'Ancestral Colossus',
      description: 'The oldest name is spoken, and the first guardian returns — an ancestral colossus of bone and storm, clad in primal fury. It protects the Animist and crushes their foes under mental command.',
      level: 10,
      spellId: 'animist_spectral_guardian',
      category: 'beast',
      creature: {
        name: 'Ancestral Colossus',
        type: 'BEAST',
        size: 'HUGE',
        stats: { maxHp: 150, maxMana: 0, speed: 30 },
        tokenIcon: 'ability_hunter_pet_bear',
        abilities: ['Concentration', 'Mental control within 60ft', 'Multiattack (2 actions/turn)', 'Knockdown (Tremor Slam, DC 18 STR)'],
      },
      quantity: 1,
      duration: { value: 4, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { mana: 30, resonance: 15, actionPoints: 3 },
    },
  ],

  // =========================================================================
  // EXORCIST (10 tokens)
  // =========================================================================
  // 'Exorcist' tokens now used by 'Inquisitor' (Phase 1.9 consolidation)
  inquisitor: [
    {
      id: 'exorcist_imp',
      name: 'Imp',
      description: 'Cold-iron wards ring as the binding-rite drags the imp forth. From the smoldering depths of Emberspire, this tiny fiend cackles with malevolent cunning. A small, cunning horror with fire bolt, flight, and invisibility.',
      level: 2,
      spellId: null,
      creature: {
        name: 'Imp',
        type: 'FIEND',
        size: 'TINY',
        stats: { maxHp: 13, maxMana: 0, speed: 30 },
        tokenIcon: 'spell_shadow_summonimp',
        abilities: ['Fire Bolt', 'Flight', 'Invisibility'],
      },
      quantity: 1,
      duration: { value: 0, unit: 'permanent' },
      controlType: 'mental',
      resourceCost: { mana: 10, actionPoints: 1 },
    },
    {
      id: 'exorcist_shadow_hound',
      name: 'Shadow Hound',
      description: 'The Inquisitor\'s seal flares, and the shadow-pack bounds through. Emberspire\'s shadow-bred pack hunts through the veil between worlds. A shadowy Wyrd-touched hound with shadow step and pack tactics.',
      level: 3,
      spellId: null,
      creature: {
        name: 'Shadow Hound',
        type: 'FIEND',
        size: 'MEDIUM',
        stats: { maxHp: 20, maxMana: 0, speed: 40 },
        tokenIcon: 'ability_hunter_pet_wolf',
        abilities: ['Shadow Bite', 'Shadow Step', 'Pack Tactics'],
      },
      quantity: 1,
      duration: { value: 0, unit: 'permanent' },
      controlType: 'mental',
      resourceCost: { mana: 14, actionPoints: 1 },
    },
    {
      id: 'exorcist_abyssal_brute',
      name: 'Abyssal Brute',
      description: 'Chains of binding authority haul the brute from its forge. Forged in Emberspire\'s deepest forges, this brute knows only destruction. A hulking horror with crushing blow and Wyrd-touched resilience.',
      level: 4,
      spellId: null,
      creature: {
        name: 'Abyssal Brute',
        type: 'FIEND',
        size: 'LARGE',
        stats: { maxHp: 47, maxMana: 0, speed: 30 },
        tokenIcon: 'spell_shadow_summonvoidwalker',
        abilities: ['Crushing Blow', 'Ember Resilience', 'Intimidating Presence'],
      },
      quantity: 1,
      duration: { value: 0, unit: 'permanent' },
      controlType: 'mental',
      resourceCost: { mana: 18, actionPoints: 1 },
    },
    {
      id: 'exorcist_banshee',
      name: 'Banshee',
      description: 'An anti-magic sigil gags the damned wail long enough to bind it. The first wail of Emberspire\'s damned souls echoes through this tormented spirit. A wailing spirit with fear aura and incorporeal form.',
      level: 4,
      spellId: null,
      creature: {
        name: 'Banshee',
        type: 'FIEND',
        size: 'MEDIUM',
        stats: { maxHp: 30, maxMana: 0, speed: 30 },
        tokenIcon: 'spell_shadow_cursed',
        abilities: ['Wail of Sorrow', 'Incorporeal', 'Fear Aura'],
      },
      quantity: 1,
      duration: { value: 0, unit: 'permanent' },
      controlType: 'mental',
      resourceCost: { mana: 18, actionPoints: 1 },
    },
    {
      id: 'exorcist_wraith',
      name: 'Wraith',
      description: 'The horror-jailer\'s chain collars the hungering dead. A hunger from the Emberspire Abyss, forever reaching for the warmth of the living. A spectral terror with life drain and ethereal jaunt.',
      level: 4,
      spellId: null,
      creature: {
        name: 'Wraith',
        type: 'FIEND',
        size: 'MEDIUM',
        stats: { maxHp: 25, maxMana: 0, speed: 30 },
        tokenIcon: 'spell_shadow_twistedfaith',
        abilities: ['Life Drain', 'Ethereal Jaunt', 'Spectral Touch'],
      },
      quantity: 1,
      duration: { value: 0, unit: 'permanent' },
      controlType: 'mental',
      resourceCost: { mana: 18, actionPoints: 1 },
    },
    {
      id: 'exorcist_pit_fiend',
      name: 'Pit Fiend',
      description: 'Only the weight of the binding-seal bends a lord of the seventh circle. A lord of Emberspire\'s seventh circle, commanding legions with a flick of its claw. A powerful devil lord with 2 actions per turn.',
      level: 6,
      spellId: null,
      creature: {
        name: 'Pit Fiend',
        type: 'FIEND',
        size: 'LARGE',
        stats: { maxHp: 84, maxMana: 0, speed: 30 },
        tokenIcon: 'spell_fire_felrainoffire',
        abilities: ['Multiattack (2 actions/turn)', 'Infernal Command', 'Fire Breath'],
      },
      quantity: 1,
      duration: { value: 0, unit: 'permanent' },
      controlType: 'mental',
      resourceCost: { mana: 30, actionPoints: 2 },
    },
    {
      id: 'exorcist_balor',
      name: 'Balor',
      description: 'Cold-iron authority alone makes a general of the host kneel. The generals of Emberspire\'s host stride forth, wreathed in dying starlight and ash. A towering horror general with 3 actions per turn.',
      level: 7,
      spellId: null,
      creature: {
        name: 'Balor',
        type: 'FIEND',
        size: 'HUGE',
        stats: { maxHp: 125, maxMana: 0, speed: 30 },
        tokenIcon: 'spell_shadow_summoninfernal',
        abilities: ['Multiattack (3 actions/turn)', 'Vorpal Sword', 'Death Throes'],
      },
      quantity: 1,
      duration: { value: 0, unit: 'permanent' },
      controlType: 'mental',
      resourceCost: { mana: 36, actionPoints: 2 },
    },
    {
      id: 'exorcist_lesser_demon',
      name: 'Lesser Demon',
      description: 'The binding-circle ruptures, and the lower pits bleed through. The teeming legions of Emberspire\'s lower pits spill through the rupture. A squad of lesser demons from the infernal legion.',
      level: 8,
      spellId: null,
      creature: {
        name: 'Lesser Demon',
        type: 'FIEND',
        size: 'MEDIUM',
        stats: { maxHp: 23, maxMana: 0, speed: 30 },
        tokenIcon: 'spell_shadow_summonimp',
        abilities: ['Claw attack'],
      },
      quantity: 3,
      duration: { value: 5, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { mana: 32, actionPoints: 2 },
    },
    {
      id: 'exorcist_apocalypse_demon',
      name: 'Apocalypse Demon',
      description: 'Even heralds of ash must obey the seal that names them. Emberspire\'s most devastating heralds descend, heralding an age of ash. Devastating apocalyptic demons with 2 actions per turn.',
      level: 9,
      spellId: null,
      creature: {
        name: 'Apocalypse Demon',
        type: 'FIEND',
        size: 'LARGE',
        stats: { maxHp: 94, maxMana: 0, speed: 30 },
        tokenIcon: 'spell_shadow_antishadow',
        abilities: ['Multiattack (2 actions/turn)', 'Apocalyptic Strike'],
      },
      quantity: 3,
      duration: { value: 6, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { mana: 40, actionPoints: 3 },
    },
    {
      id: 'exorcist_demon_prince',
      name: 'Demon Prince',
      description: 'No sovereign of Emberspire defies the cold-iron ward that binds it. The throne itself of Emberspire manifests, a sovereign of absolute ruin. A horror lord of immense power with 4 actions per turn.',
      level: 10,
      spellId: null,
      creature: {
        name: 'Demon Prince',
        type: 'FIEND',
        size: 'HUGE',
        stats: { maxHp: 197, maxMana: 0, speed: 40 },
        tokenIcon: 'spell_shadow_shadowwordpain',
        abilities: ['Multiattack (4 actions/turn)', 'Wyrd Sovereignty', 'Reality Warp'],
      },
      quantity: 1,
      duration: { value: 0, unit: 'permanent' },
      controlType: 'mental',
      resourceCost: { mana: 50, actionPoints: 3 },
    },
  ],



  // =========================================================================
  // TOXICOLOGIST (9 tokens: 3 constructs + 6 contraptions)
  // =========================================================================
  toxicologist: [
    {
      id: 'toxicologist_poison_gas_trap',
      name: 'Poison Gas Trap',
      description: 'Fester-sweet vapors of the Blooming Plague pool within the device. Releases poison gas when enemies approach, damaging and slowing.',
      level: 1,
      spellId: 'tox_poison_trap',
      creature: {
        name: 'Poison Gas Trap',
        type: 'CONSTRUCT',
        size: 'TINY',
        stats: { maxHp: 5, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_nature_corrosivebreath',
        abilities: ['2d6 poison damage', '-10ft movement for 2 rounds', '5ft trigger radius'],
      },
      quantity: 1,
      duration: { value: 10, unit: 'minutes' },
      controlType: 'autonomous',
      resourceCost: { contraption_parts: 1, actionPoints: 1 },
    },
    {
      id: 'toxicologist_spike_trap',
      name: 'Spike Trap',
      description: 'Concealed beneath the contagion\'s bloom, the trap waits patient. A concealed spike trap that immobilizes enemies.',
      level: 1,
      spellId: null,
      creature: {
        name: 'Spike Trap',
        type: 'CONSTRUCT',
        size: 'TINY',
        stats: { maxHp: 5, maxMana: 0, speed: 0 },
        tokenIcon: 'ability_rogue_trip',
        abilities: ['3d6 piercing damage', 'Immobilized 1 round (DC 14 DEX save)', '5ft trigger radius'],
      },
      quantity: 1,
      duration: { value: 10, unit: 'minutes' },
      controlType: 'autonomous',
      resourceCost: { contraption_parts: 1, actionPoints: 1 },
    },
    {
      id: 'toxicologist_healing_mist',
      name: 'Healing Mist Dispenser',
      description: 'Distilled from herbs that grew where the Blooming Plague first took root. Dispenses healing mist when allies approach.',
      level: 1,
      spellId: null,
      creature: {
        name: 'Healing Mist Dispenser',
        type: 'CONSTRUCT',
        size: 'TINY',
        stats: { maxHp: 5, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_nature_healingtouch',
        abilities: ['Heal 1d8 HP', 'Remove 1 poison/disease', '5ft trigger radius'],
      },
      quantity: 1,
      duration: { value: 10, unit: 'minutes' },
      controlType: 'autonomous',
      resourceCost: { contraption_parts: 2, actionPoints: 1 },
    },
    {
      id: 'toxicologist_smoke_launcher',
      name: 'Smoke Grenade Launcher',
      description: 'Choking fumes culled from the deepest fester-marshes billow forth. Creates a smoke cloud that obscures vision.',
      level: 1,
      spellId: null,
      creature: {
        name: 'Smoke Grenade Launcher',
        type: 'CONSTRUCT',
        size: 'TINY',
        stats: { maxHp: 5, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_fire_smoke',
        abilities: ['15ft smoke cloud', 'Obscures vision for 3 rounds', '10ft trigger radius'],
      },
      quantity: 1,
      duration: { value: 10, unit: 'minutes' },
      controlType: 'autonomous',
      resourceCost: { contraption_parts: 1, actionPoints: 1 },
    },
    {
      id: 'toxicologist_acid_sprayer',
      name: 'Acid Sprayer',
      description: 'Caustic brew refined from the Plague\'s own corrosive ichors. Sprays acid in a cone when enemies approach.',
      level: 1,
      spellId: null,
      creature: {
        name: 'Acid Sprayer',
        type: 'CONSTRUCT',
        size: 'TINY',
        stats: { maxHp: 5, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_shadow_acid',
        abilities: ['2d8 poison damage', '-3 DR for 3 rounds', '5ft cone trigger'],
      },
      quantity: 1,
      duration: { value: 10, unit: 'minutes' },
      controlType: 'autonomous',
      resourceCost: { contraption_parts: 2, actionPoints: 1 },
    },
    {
      id: 'toxicologist_alarm_bell',
      name: 'Alarm Bell',
      description: 'Forged to ring out the moment the contagion\'s carriers draw near. Alerts allies and grants +2 initiative when enemies approach.',
      level: 1,
      spellId: null,
      creature: {
        name: 'Alarm Bell',
        type: 'CONSTRUCT',
        size: 'TINY',
        stats: { maxHp: 5, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_holy_silence',
        abilities: ['Alert allies', '+2 initiative for allies within 30ft', '10ft trigger radius'],
      },
      quantity: 1,
      duration: { value: 60, unit: 'minutes' },
      controlType: 'autonomous',
      resourceCost: { contraption_parts: 1, actionPoints: 1 },
    },
    {
      id: 'toxicologist_mechanical_monstrosity',
      name: 'Mechanical Monstrosity',
      description: 'A hulking contraption animated by the plague-fumes of the fester-bogs. A large mechanical construct armed with weapons.',
      level: 8,
      spellId: 'tox_mechanical_monstrosity',
      creature: {
        name: 'Mechanical Monstrosity',
        type: 'CONSTRUCT',
        size: 'LARGE',
        stats: { maxHp: 80, maxMana: 0, speed: 30 },
        tokenIcon: 'spell_fire_selfdestruct',
        abilities: ['4d10 melee or 3d8 missiles (15ft)', 'Mechanical resilience'],
      },
      quantity: 1,
      duration: { value: 5, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { mana: 32, actionPoints: 2 },
    },
    {
      id: 'toxicologist_war_machine',
      name: 'War Machine',
      description: 'Iron and contagion married into an engine of absolute ruin. A massive war machine bristling with weapons.',
      level: 9,
      spellId: 'tox_war_machine',
      creature: {
        name: 'War Machine',
        type: 'CONSTRUCT',
        size: 'HUGE',
        stats: { maxHp: 150, maxMana: 0, speed: 20 },
        tokenIcon: 'spell_fire_selfdestruct',
        abilities: ['6d10 melee', '8d8 artillery (30ft)', 'Shields +5'],
      },
      quantity: 1,
      duration: { value: 5, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { mana: 36, actionPoints: 3 },
    },
    {
      id: 'toxicologist_mechanical_army',
      name: 'Mechanical Army',
      description: 'The Plaguebringer\'s host, rendered in brass and rusting sinew. 8 combat-ready mechanical soldiers.',
      level: 10,
      spellId: 'tox_mechanical_army',
      creature: {
        name: 'Mechanical Soldier',
        type: 'CONSTRUCT',
        size: 'MEDIUM',
        stats: { maxHp: 40, maxMana: 0, speed: 30 },
        tokenIcon: 'spell_fire_selfdestruct',
        abilities: ['2d10 attack', 'Mechanical precision'],
      },
      quantity: 8,
      duration: { value: 5, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { mana: 40, actionPoints: 3 },
    },
  ],

  // =========================================================================
  // FALSE PROPHET (2 tokens)
  // =========================================================================
  falseprophet: [
    {
      id: 'falseprophet_congregation',
      name: 'Abyssal Servants',
        description: 'Silence whispers coalesce into shapes the waking mind refuses to hold. Silence entities summoned from the congregation. 1d4 appear.',
      level: 6,
      spellId: 'fp_summon_congregation',
      creature: {
        name: 'Abyssal Servant',
        type: 'FIEND',
        size: 'MEDIUM',
        stats: { maxHp: 30, maxMana: 0, speed: 30 },
        tokenIcon: 'spell_shadow_summonvoidwalker',
        abilities: ['Silence touch', 'Verbal control within 30ft'],
      },
      quantity: '1d4',
      duration: { value: 4, unit: 'rounds' },
      controlType: 'verbal',
      resourceCost: { mana: 22, actionPoints: 2 },
    },
    {
      id: 'falseprophet_devouring_omen',
      name: 'Devouring Omen',
        description: 'The Lie takes form, and where it passes sanity wilts. A silence apparition that frightens enemies in 15ft.',
      level: 6,
      spellId: 'fp_devouring_omen',
      creature: {
        name: 'Devouring Omen',
        type: 'FIEND',
        size: 'MEDIUM',
        stats: { maxHp: 40, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_shadow_twistedfaith',
        abilities: ['Frightens enemies in 15ft', 'Generates 1d8 Madness Points'],
      },
      quantity: 1,
      duration: { value: 3, unit: 'rounds' },
      controlType: 'verbal',
      resourceCost: { mana: 24, actionPoints: 2 },
    },
  ],

  // =========================================================================
  // HARBINGER (1 token - inherited Chaos Gate)
  // =========================================================================
  harbinger: [
    {
      id: 'harbinger_chaos_gate',
      name: 'Chaos Gate Entities',
      description: 'The Bleeding Eye of Keth-Amar weeps, and chaos bleeds through the rift. 5 chaos entities from a random rollable table.',
      level: 7,
      spellId: 'harbinger-fate_rift-ultimate_chaos',
      creature: {
        name: 'Chaos Entity',
        type: 'ELEMENTAL',
        size: 'MEDIUM',
        stats: { maxHp: 50, maxMana: 0, speed: 30 },
        tokenIcon: 'spell_arcane_arcane03',
        abilities: ['Roll on chaos entity table for type'],
      },
      quantity: 5,
      duration: { value: 10, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { mana: 30, mayhem: 7, actionPoints: 2 },
      variants: [
        'Fire Elemental', 'Silence Wraith', 'Chaos Slime', 'Lightning Sprite',
        'Shadow Mimic', 'Frost Wisp', 'Gravity Elemental', 'Entropy Sprite',
        'Probability Wisp', 'Cosmic Flatulence Elemental', 'Chaos God Minion',
      ],
    },
  ],

  // =========================================================================
  // CHRONARCH (1 token)
  // =========================================================================
  chronarch: [
    {
      id: 'chronarch_temporal_vortex',
      name: 'Temporal Anomaly',
      description: 'Spun loose from the Frozen Hours, a paradox given visible form. A swirling time anomaly - damages enemies, heals allies, speeds allies within 15ft.',
      level: 4,
      spellId: 'temporal_vortex',
      creature: {
        name: 'Temporal Anomaly',
        type: 'ELEMENTAL',
        size: 'MEDIUM',
        stats: { maxHp: 50, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_arcane_portaldarkmoon',
        abilities: [
          '2d6 force damage to enemies in 15ft per round',
          '1d8 healing to allies in 15ft per round',
          '+50% movement speed to allies in 15ft',
          'Concentration',
        ],
      },
      quantity: 1,
      duration: { value: 5, unit: 'rounds' },
      controlType: 'autonomous',
      resourceCost: { mana: 10, time_shards: 3, actionPoints: 1 },
    },
  ],

  // =========================================================================
  // MINSTREL (1 token)
  // =========================================================================
  minstrel: [
    {
      id: 'minstrel_avatar_of_music',
      name: 'Avatar of Music',
      description: 'Spun from the final chord of the Old Revel, harmony given body. A being of pure musical energy that fights alongside you. Also grants allies +1 all stats.',
      level: 10,
      spellId: 'minstrel_song_of_creation',
      creature: {
        name: 'Avatar of Music',
        type: 'CONSTRUCT',
        size: 'LARGE',
        stats: { maxHp: 100, maxMana: 0, speed: 30 },
        tokenIcon: 'spell_holy_innerfire',
        abilities: ['Musical attacks', 'Mental control within 120ft', 'Allies gain +1 all ability scores'],
      },
      quantity: 1,
      duration: { value: 10, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { mana: 40, actionPoints: 3 },
    },
  ],

  // =========================================================================
  // LICHBORNE (1 token)
  // =========================================================================
  revenant: [
    {
      id: 'revenant_ice_wall',
      name: 'Ice Wall',
      description: 'Hewn from the Deep Ice of the Frozen Archive, the wall remembers its death. A 20ft x 10ft x 1ft ice wall. Blocks movement and projectiles. Vulnerable to fire, immune to frost.',
      level: 2,
      spellId: null,
      creature: {
        name: 'Ice Wall',
        type: 'CONSTRUCT',
        size: 'LARGE',
        stats: { maxHp: 50, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_frost_iceblast',
        abilities: ['Blocks movement', 'Blocks projectiles', 'Vulnerable to fire', 'Immune to frost'],
      },
      quantity: 1,
      duration: { value: 10, unit: 'rounds' },
      controlType: 'autonomous',
      resourceCost: { mana: 12, actionPoints: 2 },
    },
    {
      id: 'revenant_soul_chain',
      name: 'Spectral Ally (Soul Chain)',
      description: 'A soul torn free of the Deep Ice and bound in chains of frozen blood. A spectral ally bound through health sacrifice.',
      level: 4,
      spellId: null,
      creature: {
        name: 'Spectral Ally',
        type: 'UNDEAD',
        size: 'MEDIUM',
        stats: { maxHp: 20, maxMana: 0, speed: 30 },
        tokenIcon: 'spell_shadow_twistedfaith',
        abilities: ['Spectral attacks', 'HP = Health sacrificed (2d8)'],
      },
      quantity: 1,
      duration: { value: 5, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { health: '2d8', actionPoints: 1 },
    },
    {
      id: 'revenant_skeletal_archers',
      name: 'Skeletal Archers',
      description: 'Raised in the name of blight-ascension, their bones rime with the Archive\'s frost. 2 skeletal archers raised from the dead.',
      level: 6,
      spellId: null,
      creature: {
        name: 'Skeletal Archer',
        type: 'UNDEAD',
        size: 'MEDIUM',
        stats: { maxHp: 15, maxMana: 0, speed: 25 },
        tokenIcon: 'inv_weapon_crossbow_01',
        abilities: ['Ranged attack (2d6 damage)'],
      },
      quantity: 2,
      duration: { value: 5, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { health: '3d6', actionPoints: 2 },
    },
    {
      id: 'revenant_spectral_vanguard',
      name: 'Spectral Vanguard',
      description: 'Sworn to the blight-ascension, the vanguard\'s oath outlasts even death. A powerful spectral knight that protects allies.',
      level: 8,
      spellId: null,
      creature: {
        name: 'Spectral Vanguard',
        type: 'UNDEAD',
        size: 'LARGE',
        stats: { maxHp: 60, maxMana: 0, speed: 30 },
        tokenIcon: 'spell_shadow_summonvoidwalker',
        abilities: ['Protects allies', 'Spectral greatsword', 'Undying loyalty'],
      },
      quantity: 1,
      duration: { value: 5, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { mana: 10, health: '4d8', actionPoints: 2 },
    },
  ],
  // REMOVED: deathcaller merged into Revenant as Phase 1.10 consolidation

  // =========================================================================
  // APEX (2 tokens)
  apex: [
    {
      id: 'apex_beast_companion',
      name: 'Beast Companion',
      description: 'Bonded at the first hunt, beast and hunter share one savage heart. A loyal beast that fights alongside the Apex for the whole expedition.',
      level: 1,
      spellId: null,
      category: 'companion',
      image: '/assets/images/tokens/apex_beast_companion.png',
      tier: 'basic',
      maxSummons: 1,
      creature: {
        name: 'Beast Companion',
        type: 'BEAST',
        size: 'MEDIUM',
        stats: { maxHp: 30, maxMana: 0, speed: 40 },
        tokenIcon: 'ability_hunter_pet_bear',
        abilities: ['Pack Attack', 'Protective Instinct'],
      },
      quantity: 1,
      duration: { value: 0, unit: 'permanent' },
      controlType: 'mental',
      resourceCost: { quarry_marks: 0, actionPoints: 0 },
    },
    {
      id: 'apex_primal_beast_spirits',
      name: 'Primal Beast Spirits',
      description: 'Old spirits of the hunt given claw and fury, three times over. Three primal spirits that attack under the Apex\'s mental command.',
      level: 10,
      spellId: 'apex_primal_apocalypse',
      category: 'beast',
      image: '/assets/images/tokens/apex_primal_beast_spirits.png',
      tier: 'ultimate',
      maxSummons: 3,
      creature: {
        name: 'Primal Beast Spirit',
        type: 'BEAST',
        size: 'LARGE',
        stats: { maxHp: 50, maxMana: 0, speed: 40 },
        tokenIcon: 'ability_hunter_pet_wolf',
        abilities: ['Primal Fury', 'Savage Assault'],
      },
      quantity: 3,
      duration: { value: 3, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { actionPoints: 3, quarry_marks: 5 },
    },
  ],

  // =========================================================================
  // PYROFIEND (1 token)
  // =========================================================================
  pyrofiend: [
    {
      id: 'pyrofiend_infernal_minion',
      name: 'Infernal Minion',
      description: 'Torn howling from the Sundered Caldera, the minion pays its infernal pact in fire. An infernal minion summoned through hellfire.',
      level: 6,
      spellId: null,
      creature: {
        name: 'Infernal Minion',
        type: 'FIEND',
        size: 'MEDIUM',
        stats: { maxHp: 35, maxMana: 0, speed: 30 },
        tokenIcon: 'spell_fire_summoninfernal',
        abilities: ['Fire attacks', 'Infernal resilience'],
      },
      quantity: 1,
      duration: { value: 5, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { mana: 20, inferno: 5, actionPoints: 2 },
    },
  ],

  // =========================================================================
  // WARDEN (1 token)
  // =========================================================================
  warden: [
    {
      id: 'warden_cage_trap',
      name: 'Cage Trap',
      description: 'Woven from cold-iron wards, the spectral cage hungers for the lawless. A hidden spectral cage that restrains enemies for 2 rounds. DC 14 STR save.',
      level: 3,
      spellId: 'warden_cage_trap',
      creature: {
        name: 'Cage Trap',
        type: 'CONSTRUCT',
        size: 'SMALL',
        stats: { maxHp: 10, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_holy_silence',
        abilities: ['Hidden placement', '5ft radius', 'Restrains for 2 rounds', 'DC 14 STR save'],
      },
      quantity: 1,
      duration: { value: 5, unit: 'rounds' },
      controlType: 'autonomous',
      resourceCost: { mana: 8, actionPoints: 1 },
    },
  ],

  // =========================================================================
  // RACE ABILITIES
  // =========================================================================
  race: [
    {
      id: 'groven_spirit_beast_wolf',
      name: 'Spirit Wolf',
      description: 'The spirit-speaker\'s first ally answers from the Old Spirits\' glade. A spirit wolf companion. 1d8 piercing melee attack.',
      level: 1,
      spellId: 'spirit_call',
      race: 'groven',
      subrace: 'spirit-speaker',
      creature: {
        name: 'Spirit Wolf',
        type: 'BEAST',
        size: 'SMALL',
        stats: { maxHp: 15, maxMana: 0, speed: 40 },
        tokenIcon: 'ability_hunter_pet_wolf',
        abilities: ['1d8 piercing melee'],
      },
      quantity: 1,
      duration: { value: 10, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { actionPoints: 2 },
    },
    {
      id: 'groven_spirit_beast_bear',
      name: 'Spirit Bear',
      description: 'Root-veins tremble as the spirit-bear lumbers forth from the mist. A spirit bear companion. 1d10 bludgeoning melee attack.',
      level: 1,
      spellId: 'spirit_call',
      race: 'groven',
      subrace: 'spirit-speaker',
      creature: {
        name: 'Spirit Bear',
        type: 'BEAST',
        size: 'MEDIUM',
        stats: { maxHp: 15, maxMana: 0, speed: 30 },
        tokenIcon: 'ability_hunter_pet_bear',
        abilities: ['1d10 bludgeoning melee'],
      },
      quantity: 1,
      duration: { value: 10, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { actionPoints: 2 },
    },
    {
      id: 'groven_spirit_beast_eagle',
      name: 'Spirit Eagle',
      description: 'A watching spirit of the bog-mists takes to the upper air. A spirit eagle companion. 1d6 piercing ranged attack (60ft).',
      level: 1,
      spellId: 'spirit_call',
      race: 'groven',
      subrace: 'spirit-speaker',
      creature: {
        name: 'Spirit Eagle',
        type: 'BEAST',
        size: 'TINY',
        stats: { maxHp: 15, maxMana: 0, speed: 60 },
        tokenIcon: 'ability_hunter_pet_eagle',
        abilities: ['1d6 piercing ranged (60ft)'],
      },
      quantity: 1,
      duration: { value: 10, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { actionPoints: 2 },
    },
    {
      id: 'neth_raven_scout',
      name: 'Phantom Raven',
      description: 'A scrap of the Frozen Archive\'s silence rides upon black wings. A phantom raven scout. See and hear through it up to 1 mile. Invisible.',
      level: 1,
      spellId: 'raven_scout',
      race: 'neth',
      subrace: 'wraith',
      creature: {
        name: 'Phantom Raven',
        type: 'BEAST',
        size: 'TINY',
        stats: { maxHp: 5, maxMana: 0, speed: 60 },
        tokenIcon: 'inv_raven',
        abilities: ['Remote sight (1 mile)', 'Invisible', 'No combat stats'],
      },
      quantity: 1,
      duration: { value: 10, unit: 'minutes' },
      controlType: 'mental',
      resourceCost: { actionPoints: 1 },
    },
  ],
};

// =========================================================================
// HELPER FUNCTIONS
// =========================================================================

const CLASS_ID_MAP = {
  'arcanoneer': 'arcanoneer',
  'augur': 'augur',
  'berserker': 'berserker',
  'shaper': 'shaper',
  'harbinger': 'harbinger',
  'harbinger': 'harbinger',
  'chronarch': 'chronarch',
  // 'covenbane' merged into inquisitor as Phase 1.9 consolidation
  'inquisitor': 'inquisitor',
  'revenant': 'revenant',

  // 'dreadnaught' removed (absorbed into Martyr as Ironclad specialization)
  // 'exorcist' merged into inquisitor as Phase 1.9 consolidation
  'false prophet': 'falseprophet',
  'falseprophet': 'falseprophet',

  'apex': 'apex',
  'animist': 'animist',
  // REMOVED: lichborne merged into Revenant as Phase 1.10 consolidation
  // 'lichborne': 'lichborne',
  'lunarch': 'lunarch',
  'martyr': 'martyr',
  'minstrel': 'minstrel',
  'plaguebringer': 'plaguebringer',
  'animist': 'animist',
  'pyrofiend': 'pyrofiend',
  'spellguard': 'spellguard',
  // 'titan' removed from CLASS_ID_MAP (absorbed into Warden as Monolith specialization)
  'toxicologist': 'toxicologist',
  'warden': 'warden',
};

export const resolveClassId = (className) => {
  if (!className) return null;
  const normalized = className.toLowerCase().trim();
  return CLASS_ID_MAP[normalized] || normalized.replace(/\s+/g, '');
};

export const getTokensForClass = (classId) => {
  const resolved = resolveClassId(classId);
  return TOKEN_TEMPLATES[resolved] || [];
};

export const getTokensForRace = (raceId, subraceId) => {
  const raceTokens = TOKEN_TEMPLATES.race || [];
  return raceTokens.filter(t => {
    if (!t.race) return false;
    const raceMatch = t.race.toLowerCase() === (raceId || '').toLowerCase();
    if (subraceId && t.subrace) {
      return raceMatch && t.subrace.toLowerCase() === subraceId.toLowerCase();
    }
    return raceMatch;
  });
};

// --- Custom template merging ---
// Custom templates are registered at runtime from customSummonStore.
// This allows getTokensForCharacter and getTokenTemplateById to include them.

let _registeredCustomTemplates = [];

export const registerCustomSummonTemplates = (templates) => {
  _registeredCustomTemplates = Array.isArray(templates) ? templates : [];
};

export const getTokensForCharacter = (character) => {
  const tokens = [];
  if (character?.characterClass) {
    const classTokens = getTokensForClass(character.characterClass);
    tokens.push(...classTokens);
  }
  if (character?.race) {
    const raceTokens = getTokensForRace(character.race, character.subrace);
    tokens.push(...raceTokens);
  }
  // Merge custom templates scoped to this character/class
  const classId = resolveClassId(character?.characterClass);
  const charId = character?.id || character?.characterId;
  tokens.push(..._registeredCustomTemplates.filter((t) => {
    if (t.characterId && t.characterId !== charId) return false;
    if (t.classId && t.classId !== classId) return false;
    return true;
  }));
  return tokens;
};

export const getUnlockedTokens = (character) => {
  const allTokens = getTokensForCharacter(character);
  const level = character?.level || 1;
  return allTokens.filter(t => t.level <= level);
};

export const isTokenUnlocked = (template, character) => {
  const level = character?.level || 1;
  return template.level <= level;
};

export const getTokenTemplateById = (templateId) => {
  for (const group of Object.values(TOKEN_TEMPLATES)) {
    const found = group.find(t => t.id === templateId);
    if (found) return found;
  }
  const custom = _registeredCustomTemplates.find(t => t.id === templateId);
  if (custom) return custom;
  return null;
};

export const getTotalTemplateCount = () => {
  let count = 0;
  for (const group of Object.values(TOKEN_TEMPLATES)) {
    count += group.length;
  }
  return count;
};
