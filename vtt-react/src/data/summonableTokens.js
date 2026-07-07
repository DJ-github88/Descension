export const TOKEN_TEMPLATES = {

  // =========================================================================
  // ANIMIST (12 tokens)
  // =========================================================================
  animist: [
    {
      id: 'primalist_healing_totem',
      name: 'Healing Totem',
      description: 'The root-veins of Bryngloom answer the Animist\'s chant. From the deep glades of Bryngloom, the spirit-touched wood awakens with verdant light. A wooden totem carved with healing runes, glowing with green energy.',
      level: 1,
      spellId: 'primalist_basic_healing_totem',
      creature: {
        name: 'Healing Totem',
        type: 'CONSTRUCT',
        size: 'SMALL',
        stats: { maxHp: 15, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_nature_healingtouch',
        abilities: ['Heals allies in 10ft radius 1d6 HP per turn'],
      },
      quantity: 1,
      duration: { value: 3, unit: 'rounds' },
      controlType: 'autonomous',
      resourceCost: { mana: 6, totemic_synergy: -2, actionPoints: 1 },
    },
    {
      id: 'primalist_guardian_totem',
      name: 'Guardian Totem',
      description: 'Old Spirits are called up from the deep bog to take up the ward. Bryngloom\'s ancient stones hum with the protective whispers of forgotten guardians. A stone totem etched with protective symbols, radiating defensive energy.',
      level: 1,
      spellId: null,
      creature: {
        name: 'Guardian Totem',
        type: 'CONSTRUCT',
        size: 'SMALL',
        stats: { maxHp: 15, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_holy_devotion',
        abilities: ['Grants allies in 10ft radius a 5-damage shield per attack'],
      },
      quantity: 1,
      duration: { value: 3, unit: 'rounds' },
      controlType: 'autonomous',
      resourceCost: { mana: 3, totemic_synergy: -1, actionPoints: 1 },
    },
    {
      id: 'primalist_earth_totem',
      name: 'Earth Totem',
      description: 'With a stamp upon sacred soil, the grove\'s bones are raised. The earth itself answers the call, heaving up rune-carved stone from Bryngloom\'s sacred soil. A massive stone totem covered in earth runes.',
      level: 1,
      spellId: null,
      creature: {
        name: 'Earth Totem',
        type: 'CONSTRUCT',
        size: 'SMALL',
        stats: { maxHp: 20, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_nature_stoneclawtotem',
        abilities: ['Grants allies in 10ft radius +2 Armor and resistance to non-magical damage'],
      },
      quantity: 1,
      duration: { value: 3, unit: 'rounds' },
      controlType: 'autonomous',
      resourceCost: { mana: 3, totemic_synergy: -1, actionPoints: 1 },
    },
    {
      id: 'primalist_rejuvenation_totem',
      name: 'Rejuvenation Totem',
      description: 'The Animist breathes life back into the wound the world forgot. Living vines twist and pulse with the sap of Bryngloom\'s oldest groves. A living wood totem with vines, pulsing with life energy.',
      level: 1,
      spellId: null,
      creature: {
        name: 'Rejuvenation Totem',
        type: 'CONSTRUCT',
        size: 'SMALL',
        stats: { maxHp: 15, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_nature_rejuvenation',
        abilities: ['Heals allies in 10ft radius 1d4 HP at start of their turn'],
      },
      quantity: 1,
      duration: { value: 3, unit: 'rounds' },
      controlType: 'autonomous',
      resourceCost: { mana: 3, totemic_synergy: -1, actionPoints: 1 },
    },
    {
      id: 'primalist_venomous_totem',
      name: 'Venomous Totem',
      description: 'Brewed in secret spite, the Old Spirits grant this ward their venom. The Briarqueen\'s venom drips from this totem, brewed in Bryngloom\'s deepest, darkest hollows. A totem seeping with natural toxins.',
      level: 3,
      spellId: 'primalist_venomous_totem',
      creature: {
        name: 'Venomous Totem',
        type: 'CONSTRUCT',
        size: 'SMALL',
        stats: { maxHp: 10, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_nature_corrosivebreath',
        abilities: ['Deals poison/nature damage to enemies in 10ft radius each turn'],
      },
      quantity: 1,
      duration: { value: 4, unit: 'rounds' },
      controlType: 'autonomous',
      resourceCost: { mana: 10, totemic_synergy: -2, actionPoints: 1 },
    },
    {
      id: 'primalist_spirit_wolves',
      name: 'Spirit Wolves',
      description: 'At the summoner\'s howl, the spectral pack leaps the mist. Spectral forms of Bryngloom\'s ancient pack leaders flicker at the edge of vision. Two spectral wolves made of primal energy.',
      level: 4,
      spellId: 'primalist_spirit_wolves',
      creature: {
        name: 'Spirit Wolf',
        type: 'BEAST',
        size: 'MEDIUM',
        stats: { maxHp: 30, maxMana: 0, speed: 40 },
        tokenIcon: 'ability_hunter_pet_wolf',
        abilities: ['Mental control within 60ft', '1d6+3 bite attack'],
      },
      quantity: 2,
      duration: { value: 5, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { mana: 20, totemic_synergy: 5, actionPoints: 2 },
    },
    {
      id: 'primalist_ancestral_guardian',
      name: 'Ancestral Guardian',
      description: 'The oldest name is spoken, and the first guardian returns. An elder spirit from Bryngloom\'s first dawn answers the summons, clad in primal fury. A powerful ancestral spirit to protect and fight.',
      level: 5,
      spellId: 'primalist_ancestral_guardian',
      creature: {
        name: 'Ancestral Guardian',
        type: 'BEAST',
        size: 'LARGE',
        stats: { maxHp: 50, maxMana: 0, speed: 30 },
        tokenIcon: 'spell_nature_elementalshields',
        abilities: ['Concentration', 'Mental control within 60ft', 'Protects allies'],
      },
      quantity: 1,
      duration: { value: 4, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { mana: 20, totemic_synergy: 6, actionPoints: 2 },
    },
    {
      id: 'primalist_elemental_fury_totem',
      name: 'Elemental Fury Totem',
      description: 'Storm and ember are chained together at the Animist\'s word. The volatile heart of Bryngloom\'s storm-scarred peaks channels through this crackling spire. A totem channeling raw fire and lightning.',
      level: 6,
      spellId: 'primalist_elemental_fury_totem',
      creature: {
        name: 'Elemental Fury Totem',
        type: 'CONSTRUCT',
        size: 'SMALL',
        stats: { maxHp: 40, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_fire_selfdestruct',
        abilities: ['Deals 8d6+spirit fire/lightning damage to enemies in range each turn'],
      },
      quantity: 1,
      duration: { value: 4, unit: 'rounds' },
      controlType: 'autonomous',
      resourceCost: { mana: 25, totemic_synergy: 6, actionPoints: 2 },
    },
    {
      id: 'primalist_grand_totem_circle_healing',
      name: 'Grand Healing Totem',
      description: 'The full circle is opened, and the grove\'s heart laid bare. A fragment of Bryngloom\'s great circle, channeling the grove\'s restorative heartbeat. Part of the Grand Totem Circle - powerful healing.',
      level: 8,
      spellId: 'primalist_grand_totem_circle',
      creature: {
        name: 'Grand Healing Totem',
        type: 'CONSTRUCT',
        size: 'MEDIUM',
        stats: { maxHp: 60, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_nature_healingtouch',
        abilities: ['Grand healing aura'],
      },
      quantity: 1,
      duration: { value: 5, unit: 'rounds' },
      controlType: 'autonomous',
      resourceCost: { mana: 30, totemic_synergy: 10, actionPoints: 2 },
    },
    {
      id: 'primalist_grand_totem_circle_damage',
      name: 'Grand Damage Totem',
      description: 'The circle\'s wrathful half is loosed upon the foe. The destructive half of Bryngloom\'s balanced circle, unleashing the forest\'s wrath. Part of the Grand Totem Circle - destructive force.',
      level: 8,
      spellId: 'primalist_grand_totem_circle',
      creature: {
        name: 'Grand Damage Totem',
        type: 'CONSTRUCT',
        size: 'MEDIUM',
        stats: { maxHp: 60, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_fire_fire',
        abilities: ['Grand damage aura'],
      },
      quantity: 1,
      duration: { value: 5, unit: 'rounds' },
      controlType: 'autonomous',
      resourceCost: { mana: 30, totemic_synergy: 10, actionPoints: 2 },
    },
    {
      id: 'primalist_eternal_totem',
      name: 'Eternal Totem',
      description: 'Bedrock itself is sworn into service, unbreakable and old. Forged from Bryngloom\'s unyielding bedrock, this totem stands eternal against all foes. An indestructible totem of immense power.',
      level: 9,
      spellId: 'primalist_eternal_totem',
      creature: {
        name: 'Eternal Totem',
        type: 'CONSTRUCT',
        size: 'LARGE',
        stats: { maxHp: 500, maxMana: 0, speed: 0 },
        tokenIcon: 'spell_nature_naturetouch',
        abilities: ['Indestructible', 'Powerful ongoing effects'],
      },
      quantity: 1,
      duration: { value: 10, unit: 'rounds' },
      controlType: 'autonomous',
      resourceCost: { mana: 40, totemic_synergy: 15, actionPoints: 3 },
    },
    {
      id: 'primalist_genesis',
      name: 'Genesis',
      description: 'Bryngloom answers with everything it has left. The full fury of Bryngloom\'s wild heart spills forth in a tide of tooth and claw. An army of nature spirits and creatures.',
      level: 10,
      spellId: 'primalist_genesis',
      creature: {
        name: 'Primal Beast',
        type: 'BEAST',
        size: 'MEDIUM',
        stats: { maxHp: 60, maxMana: 0, speed: 40 },
        tokenIcon: 'ability_hunter_pet_bear',
        abilities: ['Nature spirit creature'],
      },
      quantity: 7,
      duration: { value: 10, unit: 'rounds' },
      controlType: 'mental',
      resourceCost: { mana: 50, totemic_synergy: 18, actionPoints: 3 },
      subTypes: [
        { name: 'Treant', stats: { maxHp: 100 }, size: 'LARGE', quantity: 1 },
        { name: 'Earth Elemental', stats: { maxHp: 80 }, size: 'LARGE', quantity: 2 },
        { name: 'Primal Beast', stats: { maxHp: 60 }, size: 'MEDIUM', quantity: 4 },
      ],
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
      spellId: 'exo_bind_imp',
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
      spellId: 'exo_bind_shadow_hound',
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
      spellId: 'exo_bind_abyssal_brute',
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
      spellId: 'exo_bind_banshee',
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
      spellId: 'exo_bind_wraith',
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
      spellId: 'exo_bind_pit_fiend',
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
      spellId: 'exo_bind_balor',
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
      spellId: 'exo_infernal_legion',
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
      spellId: 'exo_apocalyptic_summoning',
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
      spellId: 'exo_bind_demon_prince',
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
      spellId: null,
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
      spellId: null,
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
      spellId: null,
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
      description: 'Void whispers coalesce into shapes the waking mind refuses to hold. Void entities summoned from the congregation. 1d4 appear.',
      level: 6,
      spellId: 'fp_summon_congregation',
      creature: {
        name: 'Abyssal Servant',
        type: 'FIEND',
        size: 'MEDIUM',
        stats: { maxHp: 30, maxMana: 0, speed: 30 },
        tokenIcon: 'spell_shadow_summonvoidwalker',
        abilities: ['Void touch', 'Verbal control within 30ft'],
      },
      quantity: '1d4',
      duration: { value: 4, unit: 'rounds' },
      controlType: 'verbal',
      resourceCost: { mana: 22, actionPoints: 2 },
    },
    {
      id: 'falseprophet_devouring_omen',
      name: 'Devouring Omen',
      description: 'The Lie takes form, and where it passes sanity wilts. A void apparition that frightens enemies in 15ft.',
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
      spellId: 'harbinger-fate_rift-chaos_gate',
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
        'Fire Elemental', 'Void Wraith', 'Chaos Slime', 'Lightning Sprite',
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
      spellId: 'lb_frozen_bastion',
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
      description: 'Bonded at the first hunt, beast and hunter share one savage heart. A loyal beast that fights alongside the Apex.',
      image: '/assets/images/tokens/apex_beast_companion.png',
      type: 'ally',
      tier: 'basic',
      class: 'apex',
      stats: { hp: 30, armor: 12, damage: '1d8+2' },
      abilities: ['Pack Attack', 'Protective Instinct'],
      apCost: 0,
      summonTime: 'instant',
      duration: 'permanent',
      maxSummons: 1
    },
    {
      id: 'apex_primal_beast_spirits',
      name: 'Primal Beast Spirits',
      description: 'Old spirits of the hunt given claw and fury, three times over. Three primal spirits that attack autonomously.',
      image: '/assets/images/tokens/apex_primal_beast_spirits.png',
      type: 'ally',
      tier: 'ultimate',
      class: 'apex',
      stats: { hp: 50, armor: 15, damage: '2d6+4' },
      abilities: ['Primal Fury', 'Savage Assault'],
      apCost: 3,
      summonTime: 'action',
      duration: 3,
      maxSummons: 3
    }
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
  'inquisitor': 'exorcist',
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
  return null;
};

export const getTotalTemplateCount = () => {
  let count = 0;
  for (const group of Object.values(TOKEN_TEMPLATES)) {
    count += group.length;
  }
  return count;
};
