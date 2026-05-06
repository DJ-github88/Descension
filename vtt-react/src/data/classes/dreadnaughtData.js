/**
 * Dreadnaught Class Data
 * 
 * Complete class information for the Dreadnaught - a dark resilient tank
 * that converts Damage Taken into Dark Resilience Points (DRP) for powerful abilities.
 */

export const DREADNAUGHT_DATA = {
  id: 'dreadnaught',
  name: 'Dreadnaught',
  icon: 'fas fa-shield',
  role: 'Tank',
  damageTypes: ['necrotic', 'poison', 'psychic'],

  // Overview section
  overview: {
    title: 'The Dreadnaught',
    subtitle: 'Dark Resilient Tank',

    quickOverview: {
      title: 'Quick Overview',
      content: `You are a Dreadnaught. Pain is your fuel. Every hit you take charges your Dark Resilience Points (DRP). Spend them on shields and strikes â€” or save them to cheat death.

**Core Mechanic**: Take damage â†’ Generate DRP â†’ Spend on abilities OR save for passive benefits + emergency Dark Rebirth

**Resource**: Dark Resilience Points (0-50). Gain **1 DRP per 4 damage taken** (round down). *Passive benefits snapshot at the start of your turn â€” spend freely during your turn, effects update next turn.*

**Snapshot Rule**: Your passive tier (regen, resistance) locks in at the start of each turn based on current DRP. Spend DRP during your turn without immediately losing benefits â€” the cost catches up next turn.

**Playstyle**: Frontline tank, damage-to-power conversion, adaptive defense, last stand specialist

**Best For**: Players who enjoy tanking, converting pain into power, and managing a damage-based resource

**Note**: Some talent tree nodes reference card draws and coin flips â€” these are universal game mechanics. See Core Rules for details.`
    },

    description: `The Dreadnaught taps into their dark connection to fuel their resilience and power. As they take damage, they build up Dark Resilience Points (DRP), which can be used to enhance their defensive and offensive capabilities. This system emphasizes the Dreadnaught's ability to absorb and utilize Damage Taken, turning it into a powerful resource for both offense and defense.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Dreadnaughts are warriors who have embraced the darkness to become nearly indestructible. They have made pacts with shadow entities or undergone dark rituals that allow them to convert pain and suffering into power. In roleplay, Dreadnaughts often carry the weight of their dark bargains, appearing as grim, unyielding figures on the battlefield.

Their connection to darkness manifests physically: shadowy auras surround them, wounds close with dark energy, and their presence exudes an ominous chill. The more damage they take, the more their dark power grows, creating an intimidating feedback loop.

Common Dreadnaught archetypes include:
- **The Cursed Knight**: Once noble, now bound to darkness for power
- **The Undying Sentinel**: Refuses to fall, sustained by dark forces
- **The Pain Harvester**: Feeds on suffering to fuel their abilities
- **The Shadow Pact Warrior**: Made a deal with dark entities for immortality`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Dreadnaught is a frontline tank who thrives on taking damage. They excel at:

**Damage Absorption**: Converting incoming damage into DRP creates a unique tanking dynamic
**Adaptive Defense**: Can spend DRP on shields, Armor boosts, or damage resistance
**Sustained Presence**: Passive regeneration and resistance keep them in the fight
**Offensive Pressure**: Wraith Strike and Necrotic Aura provide damage output
**Last Stand Capability**: Dark Rebirth allows recovery from lethal damage

The Dreadnaught's power scales with the danger they face. The more damage they take, the more resources they have to work with. This creates exciting gameplay where taking hits is actually beneficial, as long as they manage their DRP wisely.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Dreadnaught is about converting pain into power. Key strategic considerations:

**DRP Generation**: 
- Gain 1 DRP for every 4 Damage Taken (round down)
- Maximum capacity: 50 DRP
- Position yourself to take hits and build resources
- **Snapshot Rule**: Passives lock at turn start â€” spend freely during your turn

**DRP Spending Priorities**: 
- **Shadow Shield** (2:1 ratio): Spend DRP to absorb twice the damage
- **Wraith Strike** (1d6 per 5 DRP): Add necrotic damage to attacks
- **Unholy Fortitude** (+1 Armor per 5 DRP): Boost defense for sustained combat
- **Necrotic Aura** (15 DRP): Debuff enemies with disadvantage on attacks

**Passive Benefits**: 
- At 10+ DRP: Gain resistance to one damage type
- At 10+ DRP: Regenerate 1 HP per 10 DRP at turn start
- At 20+ DRP: Regenerate 2 HP per turn
- At 30+ DRP: Regenerate 3 HP per turn

**Dark Rebirth**: 
- Automatically triggers when reaching 0 HP
- Spend all remaining DRP to regain HP equal to twice the DRP
- Your ultimate survival tool â€” see "The Dreadnaught's Gambit" for when to spend vs save

**Resource Management**:
- Balance between offensive (Wraith Strike) and defensive (Shadow Shield) spending
- Time Necrotic Aura for maximum impact when surrounded
- At 10+ DRP your passive benefits activate â€” weigh spending against losing them
- For high-cost spells, see "The Dreadnaught's Gambit" â€” sometimes going all-in is the right play`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Undying Wall',
      content: `**The Setup**: Your party is ambushed by a pack of dire wolves (5 wolves, 1 alpha). You're the Dreadnaught tank with 120/120 HP and 0 DRP. Your job: protect the party while they deal damage. Time to embrace the pain.

**Starting State**: HP: 120/120 | DRP: 0/50 | Armor: 18

**Turn 1 - Taking the Hits (HP: 120 â†’ 85, DRP: 0 â†’ 9)**

*The wolves surround you. The alpha snarls. You plant your feet and raise your shield. "Come on, then."*

**Wolves' Turn**: 3 wolves attack you (2 hit, 1 miss)
- Wolf 1: Attack roll [18] â†’ Hit! â†’ 2d6+3 â†’ [5, 4] + 3 = 12 damage
- Wolf 2: Attack roll [16] â†’ Hit! â†’ 2d6+3 â†’ [6, 5] + 3 = 14 damage
- Wolf 3: Attack roll [11] â†’ Miss!

**Damage Taken**: 12 + 14 = 26 damage
**HP**: 120 - 26 = 94 HP
**DRP Generated**: 26 Ã· 4 = 6.5 â†’ **6 DRP** (round down)

*You feel the wolves' teeth sink into your armor. Pain flaresâ€”but with it comes POWER. Dark energy swirls around you.*

**Alpha Wolf's Turn**: Attacks you â†’ [19] â†’ Hit! â†’ 3d6+4 â†’ [6, 5, 4] + 4 = 19 damage
**HP**: 94 - 19 = 75 HP
**DRP Generated**: 19 Ã· 4 = 4.75 â†’ **4 DRP**
**Total DRP**: 6 + 4 = **10 DRP**

*The alpha's jaws clamp down on your shoulder. You don't scream. You SMILE. The darkness feeds on your pain. You've hit 10 DRP â€” passive benefits activate next turn.*

**Your Turn**: Attack alpha wolf with Wraith Strike (spend 5 DRP for +1d6 necrotic)
**DRP**: 10 - 5 = 5 DRP remaining
**Attack Roll**: d20+6 â†’ [15] â†’ Hit!
**Damage**: 2d8 (weapon) + 1d6 (Wraith Strike) â†’ [7, 6] + [5] = 18 damage

*Your blade strikes, wreathed in dark energy. The alpha yelps.*

**Current State**: HP: 75/120 | DRP: 5/50

**Turn 2 - Building Power (HP: 75 â†’ 37, DRP: 5 â†’ 15)**

*More wolves attack. You're bleeding, but the darkness is growing stronger.*

**Snapshot**: 5 DRP at turn start â€” no passive tier yet. Keep building.

**Wolves' Turn**: 4 wolves attack you (3 hit, 1 miss)
- Total Damage: 13 + 11 + 14 = 38 damage
**HP**: 75 - 38 = 37 HP
**DRP Generated**: 38 Ã· 4 = 9.5 â†’ **9 DRP**
**Total DRP**: 5 + 9 = **14 DRP**

*You're at 37/120 HP (31%), but you've hit 14 DRP â€” past the threshold for passive benefits next turn.*

**Passive Benefits Activate Next Turn**:
- **Dark Resistance**: Choose slashing damage (wolves deal slashing)
- **Health Regeneration**: 1 HP/turn (10-19 DRP tier)

*A shadowy aura envelops you. The next wolf bite feels... distant. Muted. Your wounds begin to close with dark energy.*

**Your Turn**: Use Shadow Shield (spend 10 DRP for 20 damage absorption)
**DRP**: 14 - 10 = 4 DRP
**Effect**: Next 20 damage absorbed by shadow shield

*You raise your hand, and a barrier of pure darkness materializes. "You'll have to do better than that."*

**Current State**: HP: 37/120 | DRP: 4/50 | Shadow Shield: 20

**Turn 3 - The Shield Holds (HP: 37 â†’ 30, DRP: 4 â†’ 11)**

*Snapshot at turn start: 4 DRP â€” no passive tier this turn (spent too much last turn).*

*The wolves attack again, but your shadow shield absorbs the blows.*

**Wolves' Turn**: 3 wolves attack (2 hit, 1 miss)
- Total Damage: 12 + 15 = 27 damage
**Shadow Shield**: Absorbs 20 damage
**Remaining Damage**: 27 - 20 = 7 damage
**HP**: 37 - 7 = 30 HP
**DRP Generated**: 27 Ã· 4 = 6.75 â†’ **6 DRP** (you generate DRP from total damage, not just what gets through!)

*The shadow shield shatters, but it saved you. You're still standing.*

**Alpha Wolf's Turn**: Attacks â†’ [17] â†’ Hit! â†’ 18 damage
**Resistance**: Slashing damage (Dark Resistance active from last turn's snapshot!)
**Damage Taken**: 18 Ã· 2 = 9 damage (halved!)
**HP**: 30 - 9 = 21 HP
**DRP Generated**: 18 Ã· 4 = 4.5 â†’ **4 DRP** (calculated from full damage before resistance!)
**Total DRP**: 4 + 6 + 4 = **14 DRP**

*Wait â€” the snapshot rule means your passive from last turn (Dark Resistance: Slashing) is still active THIS turn. The alpha's bite is weakened by your dark aura.*

*Next turn, at 14 DRP, your passives snapshot again: Dark Resistance + 1 HP regen.*

**Your Turn**: Attack alpha wolf
**Attack Roll**: d20+6 â†’ [16] â†’ Hit!
**Damage**: 2d8 â†’ [8, 7] = 15 damage
**Alpha Wolf**: DEAD

*The alpha falls. The pack hesitates.*

**Current State**: HP: 21/120 | DRP: 14/50

**Turn 4 - The Comeback (HP: 21 â†’ 0 â†’ 28, DRP: 14 â†’ 0)**

*Snapshot at turn start: 14 DRP â€” Dark Resistance active, 1 HP regen.*

*The remaining wolves attack in desperation.*

**Wolves' Turn**: 4 wolves attack (all hit in frenzy)
- Total Damage: 14 + 13 + 12 + 15 = 54 damage!
**HP**: 21 - 54 = **-33 HP** (YOU DIE!)

**DARK REBIRTH TRIGGERS!**

*You fall. The world goes dark. But the darkness is your ally. It will not let you die.*

**Dark Rebirth Effect**: Spend all remaining DRP (14 DRP) to regain HP equal to 2Ã— DRP
**HP Regained**: 14 Ã— 2 = 28 HP
**HP**: 0 â†’ 28 HP (YOU LIVE!)
**DRP**: 14 - 14 = 0 DRP

*You rise from the ground, dark energy pouring from your wounds. The wolves back away, terrified.*

**Your Party's Mage**: Casts Fireball â†’ Kills 2 wolves
**Your Party's Rogue**: Sneak attack â†’ Kills 1 wolf
**Remaining**: 1 wolf (fleeing)

**Your Turn**: Let it run. You've made your point.

*You stand among the corpses, bleeding but alive. Your party stares at you.*

**Your Healer**: "You... you died. I saw you die."
**You**: "Death is just another resource. I spent it wisely."

**The Lesson**: Dreadnaught gameplay is about:
1. **Damage-to-Power**: Took 145 damage total, generated ~36 DRP from combat (145 Ã· 4 â‰ˆ 36)
2. **Snapshot Rule**: Passives lock at turn start â€” spend freely during your turn, feel the cost next turn
3. **Shadow Shield**: Spent 10 DRP for 20 damage absorption (2:1 ratio = efficient!)
4. **Dark Rebirth**: Auto-triggered at 0 HP, spent 14 DRP to regain 28 HP (saved your life!)
5. **Resistance Math**: Alpha's 18 damage â†’ 9 after resistance, but DRP calculated from full 18
6. **Strategic Spending**: Spent 15 DRP total (5 on Wraith Strike, 10 on Shadow Shield), saved 14 for Dark Rebirth

You're not a tank who avoids damage—you're a tank who CONVERTS damage into power. The more you suffer, the stronger you become. Death itself is just another tool in your arsenal.`
    }
  },

  // Resource System
  resourceSystem: {
    title: 'Dark Resilience Points (DRP)',
    subtitle: 'Convert Pain into Power',

    description: `The Dreadnaught is a kinetic battery for suffering. You do not regenerate power over time; you earn it by standing in the line of fire. Every hit you take fills your Dark Resilience pool, which you can then manifest as impenetrable shields, necrotic strikes, or a final defiance against death itself.`,

    cards: [
      {
        title: 'Dark Resilience (DRP)',
        stats: '1 per 4 Damage Taken',
        details: 'Max 50. Every 4 HP you lose (before resistance) generates 1 DRP. Your power scales directly with the danger you face.'
      },
      {
        title: 'The Snapshot Rule',
        stats: 'Turn-Start Lock',
        details: 'Passive benefits (Regen/Resistance) lock at turn start. You can spend all your DRP during your turn and still keep your passive tiers until next round.'
      },
      {
        title: 'Dark Rebirth',
        stats: 'Emergency Revival',
        details: 'At 0 HP, automatically spend all DRP to heal for 2x the amount. Your DRP pool is your "extra life" insurance.'
      }
    ],

    generationTable: {
      headers: ['Trigger', 'Change', 'Notes'],
      rows: [
        ['Take Damage', '+1 DRP per 4 HP', 'Calculated from full damage before resistance'],
        ['Shadow Shield', '-Variable DRP', 'Absorbs 2x the DRP spent as damage'],
        ['Wraith Strike', '-5 to -20 DRP', 'Adds 1d6 to 4d6 necrotic damage to an attack'],
        ['Dark Rebirth', '-All DRP', 'Triggers at 0 HP; restores 2x DRP as health']
      ]
    },

    usage: {
      momentum: 'Passive benefits (Resistance + HP Regen) activate at 10 DRP and scale every 10 points. Holding 50 DRP grants +5 HP/turn and massive resilience.',
      flourish: 'The Snapshot Rule is your greatest weapon. You can snapshot at Tier 5 (+5 HP/turn), then spend all 50 DRP on a massive ultimate without losing the +5 HP heal this turn.'
    },

    overheatRules: {
      title: 'The Dreadnaught\'s Gambit',
      content: `The Dreadnaught doesn't "Overheat"—they **Empty the Tank**. 

**Tier Scaling**:
- **10-19 DRP**: Resistance + 1 HP/turn
- **20-29 DRP**: 2 HP/turn
- **30-39 DRP**: 3 HP/turn
- **40-49 DRP**: 4 HP/turn
- **50 DRP**: 5 HP/turn (God-like sustain)

**The Trade-off**:
Spending DRP for offense (Wraith Strike) or utility (Necrotic Aura) drops your passive tiers for the *next* turn. Mastery of the Dreadnaught requires knowing when to hold your 50 DRP to act as an unkillable raid boss, and when to "Gambit" it all for a decisive strike.`
    },

    drpAbilitiesTable: {
      title: 'DRP Abilities & Costs',
      headers: ['Ability', 'DRP Cost', 'Effect', 'Usage'],
      rows: [
        ['Shadow Shield', 'Variable', 'Absorb damage equal to 2x DRP spent', 'Reaction'],
        ['Wraith Strike', '5/10/15/20', '+1d6/2d6/3d6/4d6 necrotic damage', 'On attack'],
        ['Unholy Fortitude', '5/10/15/20', '+1/+2/+3/+4 Armor for 1 minute', 'Any time'],
        ['Necrotic Aura', '15', 'Disadvantage on attacks in 10ft (1 min)', 'Any time'],
        ['Dark Regeneration', '5', 'Double passive regen for 1 minute', 'Any time'],
        ['Dark Rebirth', 'All remaining', 'Regain 2x DRP as HP at 0 HP', 'Automatic']
      ]
    },

    passiveEffectsTable: {
      title: 'Passive DRP Benefits',
      headers: ['DRP Level', 'Regen', 'Other Benefits'],
      rows: [
        ['0-9', 'None', 'Build DRP through suffering'],
        ['10-19', '+1 HP/turn', 'Dark Resistance (1 damage type)'],
        ['20-29', '+2 HP/turn', 'Enhanced sustain'],
        ['30-39', '+3 HP/turn', 'Raid boss territory'],
        ['40-49', '+4 HP/turn', 'Nearly unkillable'],
        ['50', '+5 HP/turn', 'Maximum dark presence']
      ]
    },

    strategicConsiderations: {
      title: 'Pain is Progress',
      content: `**Early Combat**: You are at your weakest when you are at full health with 0 DRP. Position yourself aggressively. You *want* to be hit to turn your engine on.

**The Efficiency Trick**: Dark Resistance halves incoming damage, but DRP is generated from the **full** amount. Having resistance to Slashing means you take 10 damage but gain DRP as if you took 20. This is how you outscale the encounter.

**The Insurance Policy**: Never drop below 15 DRP if you think the boss can down you. 15 DRP is a 30 HP "Dark Rebirth" buffer that can save the run.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'The Kinetic Tank',
      content: `Tracking the Dreadnaught at the table requires managing the delay between spending resources and losing benefits.

**Required Materials**:
- **50 Dark Tokens**: Purple or black glass beads.
- **The Snapshot Coin**: A large, heavy metal coin or distinct marker.
- **Calculator/Reference Card**: For quick 4:1 math.

**The Physical Hack (Friction Points)**:
- **The Snapshot Coin**: At the start of your turn, place the Snapshot Coin on top of your current DRP pile. This marks your passive tier. Even if you spend all the beads under the coin, you don't remove the coin until the start of your *next* turn.
- **Damage Conversion**: Keep a small "Incoming Pain" tray. Put a white bead in it for every 4 damage taken. At the end of the enemy's turn, dump the white beads and replace them with DRP tokens in your main pool.
- **Resistance Math**: Create a cheat sheet for the 4:1 conversion (4=1, 8=2, 12=3...) to keep combat moving fast.

**Pro Tip**: Use a specialized d50 (or two d10s) to track DRP if you hate beads. Just remember the Snapshot Coin rule—it is the only way to play accurately at the table!`
    }
  },

  // Specializations
  specializations: {
    title: 'Dreadnaught Specializations',
    subtitle: 'Three Paths of Dark Power',
    
    description: `Every Dreadnaught chooses one of three specializations that define their approach to dark resilience. Each specialization offers unique passive abilities and influences your DRP management strategy.`,
    
    specs: [
      {
        id: 'voidwarden',
        name: 'Voidwarden',
        icon: 'Necrotic/Protective Aura',
        color: '#4B0082',
        theme: 'Shadow Defense',
        
        description: `The Voidwarden specialization focuses on pure defensive power. Voidwarden Dreadnaughts maximize their damage absorption and regeneration, becoming nearly unkillable walls of shadow.`,
        
        playstyle: 'Maximum defense, high regeneration, damage absorption',
        
        strengths: [
          'Shadow Shield absorbs 2.5Ã— DRP instead of 2Ã—',
          'Regeneration increased by 50%',
          'Dark Resistance applies to two damage types instead of one',
          'Can use Shadow Shield as a reaction'
        ],
        
        weaknesses: [
          'Lower offensive capabilities',
          'DRP generation unchanged',
          'Requires consistent damage intake',
          'Less burst potential'
        ],
        
        keyAbilities: [
          'Void Barrier: Enhanced Shadow Shield with reaction timing',
          'Shadow Regeneration: Increased healing from passive effects',
          'Dual Resistance: Resist two damage types simultaneously'
        ],
        
        specPassive: {
          name: 'Void Embrace',
          description: 'Shadow Shield absorbs 2.5Ã— DRP spent instead of 2Ã—. Regeneration from DRP increased by 50%. Dark Resistance applies to two damage types.'
        }
      },
      {
        id: 'soulreaver',
        name: 'Soulreaver',
        icon: 'Necrotic/Drain Soul',
        color: '#8B0000',
        theme: 'Life Drain',
        
        description: `The Soulreaver specialization combines defense with life-stealing offense. Soulreaver Dreadnaughts drain life from enemies to fuel their dark power, creating a self-sustaining cycle of damage and healing.`,
        
        playstyle: 'Balanced offense/defense, life drain, self-sustain',
        
        strengths: [
          'Wraith Strike heals for 50% of necrotic damage dealt',
          'Generate 1 DRP when dealing necrotic damage',
          'Attacks against you generate +1 DRP (total 1 per 4 damage)',
          'Can convert HP into DRP (5 HP = 1 DRP)'
        ],
        
        weaknesses: [
          'Requires offensive actions to maximize benefits',
          'Less pure defense than Voidwarden',
          'HP conversion can be risky',
          'Dependent on hitting enemies'
        ],
        
        keyAbilities: [
          'Soul Siphon: Wraith Strike heals for damage dealt',
          'Blood to Shadow: Convert HP into DRP',
          'Reaping Strike: Generate DRP from necrotic damage'
        ],
        
        specPassive: {
          name: 'Death Mark',
          description: 'Wraith Strike heals for 50% of necrotic damage dealt. Generate 1 DRP when dealing necrotic damage. Gain 1 DRP per 3 Damage Taken instead of per 4.'
        }
      },
      {
        id: 'doomguard',
        name: 'Doomguard',
        icon: 'Necrotic/Demonic Empowerment',
        color: '#2F4F4F',
        theme: 'Retribution',
        
        description: `The Doomguard specialization focuses on turning Damage Taken into devastating counterattacks. Doomguard Dreadnaughts punish enemies for attacking them, creating a dangerous aura of retribution.`,
        
        playstyle: 'Counterattack focus, area damage, punishment mechanics',
        
        strengths: [
          'Automatically deal 1d6 shadow damage to attackers',
          'Necrotic Aura costs 10 DRP instead of 15',
          'Necrotic Aura also deals 1d6 shadow damage per turn',
          'Dark Rebirth grants temporary rage on revival'
        ],
        
        weaknesses: [
          'Lower direct defense than Voidwarden',
          'Requires being attacked to maximize damage',
          'Less self-healing than Soulreaver',
          'Counterattack damage is modest'
        ],
        
        keyAbilities: [
          'Retribution Aura: Damage attackers automatically',
          'Enhanced Necrotic Aura: Reduced cost and added damage',
          'Vengeful Rebirth: Dark Rebirth grants combat bonuses'
        ],
        
        specPassive: {
          name: 'Aura of Doom',
          description: 'Attackers take 1d6 shadow damage when they hit you. Necrotic Aura costs 10 DRP and deals 1d6 shadow damage per turn. Dark Rebirth grants +2 to attack and damage for 1 minute.'
        }
      }
    ]
  },
  
  // Spells - organized by level, showcasing DRP system
  spells: [
    // ========================================
    // LEVEL 1 SPELLS â€” Core Survivability
    // The bedrock of what makes a Dreadnaught: take damage, grow stronger, refuse to die.
    // ========================================

    {
      id: 'dread_dark_rebirth',
      name: 'Dark Rebirth',
      description: 'At 0 HP, automatically spend all remaining DRP to return from oblivion, regaining HP equal to twice the DRP consumed. Requires at least 1 DRP. Once per long rest.',
      level: 1,
      spellType: 'PASSIVE',
      icon: 'Necrotic/Resurrect',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Resurrect',
        tags: ['passive', 'revival', 'core mechanic', 'drp', 'starter'],
        castTime: 0,
        castTimeType: 'PASSIVE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 'all' },
        useFormulas: {},
        actionPoints: 0,
        components: []
      },

      resolution: 'AUTOMATIC',
      effectTypes: ['restoration'],

      restorationConfig: {
        resourceType: 'health',
        restorationType: 'resurrection',
        formula: 'DRP Spent * 2',
        restoredHealth: 'DRP Spent * 2',
        trigger: 'on_zero_hp',
        minimumDRP: 1,
        resourceSpent: 'all_drp',
        oncePer: 'long_rest',
        description: 'Triggers automatically at 0 HP. Spends all remaining DRP and restores HP equal to 2Ã— DRP consumed. Requires at least 1 DRP.'
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['passive', 'revival', 'core mechanic', 'drp', 'starter', 'level 1', 'dreadnaught']
    },

    {
      id: 'dread_shadow_shield',
      name: 'Shadow Shield',
      description: 'Shape solidified shadow into a barrier. Spend DRP freely to determine its strength. Absorbs damage equal to twice the DRP invested, then shatters into dissipating darkness.',
      level: 1,
      spellType: 'REACTION',
      icon: 'Necrotic/Protective Aura',
      school: 'Abjuration',

      typeConfig: {
        school: 'abjuration',
        icon: 'Necrotic/Protective Aura',

        tags: ['defense', 'shield', 'absorption', 'drp', 'reaction', 'starter'],
        castTime: 1,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 'variable' },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Raise hand, shadows coalesce into a protective barrier'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'temporaryHP',
        effects: [{
          id: 'shadow_shield_absorption',
          name: 'Shadow Shield',
          description: 'Absorbs damage equal to 2Ã— DRP spent. DRP generation still occurs from absorbed damage.',
          tempHPFormula: '2 * DRP Spent',
          tempHPType: 'absorption'
        }],
        durationValue: 1,
        durationType: 'turns',
        durationUnit: 'turns',
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['defense', 'shield', 'absorption', 'drp', 'reaction', 'starter', 'level 1', 'dreadnaught']
    },

    {
      id: 'dread_dark_resistance',
      name: 'Dark Resistance',
      description: 'The darkness within you hardens against the world\'s pain. Spend 10 Dark Resilience Points to weave a protective shadow-cloak, granting you resistance to a damage type of your choice for 1 minute. Pain cannot break what pain has forged.',
      level: 1,
      spellType: 'ACTION',
      icon: 'Necrotic/Protective Aura',
      school: 'Abjuration',

      typeConfig: {
        school: 'abjuration',
        icon: 'Necrotic/Protective Aura',

        tags: ['buff', 'resistance', 'defense', 'drp', 'starter'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 10 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Resistentia Obscura!',
        somaticText: 'Shadows harden over your skin'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'dark_resistance_buff',
          name: 'Hardened Shadows',
          description: 'Resistance to the chosen damage type for 1 minute.',
          statModifier: {
            stat: 'damageResistance',
            magnitude: 1,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['buff', 'resistance', 'defense', 'drp', 'starter', 'level 1', 'dreadnaught']
    },

    {
      id: 'dread_dark_regeneration',
      name: 'Dark Regeneration',
      description: 'Amplify your passive regeneration. Spend 5 DRP to DOUBLE your current passive HP regeneration rate for 1 minute. Stacks with your baseline passive â€” does not replace it.',
      level: 1,
      spellType: 'ACTION',
      icon: 'Necrotic/Blood Skull',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Blood Skull',

        tags: ['buff', 'healing', 'regeneration', 'amplifier', 'drp', 'starter'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 5 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Sanguis Renovare!',
        somaticText: 'Dark mist surrounds your wounds'
      },

      resolution: 'NONE',
      effectTypes: ['healing'],

      healingConfig: {
        formula: 'floor(drp / 10) * 2',
        healingType: 'hot',
        hasHotEffect: true,
        hotFormula: 'floor(drp / 10) * 2',
        hotDuration: 10,
        hotTickType: 'round',
        notes: 'DOUBLES passive regen rate. At 30 DRP: passive 3 HP/turn + spell 3 HP/turn = 6 HP/turn total'
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['buff', 'healing', 'regeneration', 'drp', 'starter', 'level 1', 'dreadnaught']
    },

    // ========================================
    // LEVEL 2 SPELLS
    // ========================================
    {
      id: 'dread_wraith_strike',
      name: 'Wraith Strike',
      description: 'Empower your weapon with necrotic energy for a devastating strike, dealing additional necrotic damage.',
      level: 2,
      spellType: 'ACTION',
      icon: 'Necrotic/Necrotic Strike',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Necrotic Strike',

        tags: ['damage', 'necrotic', 'melee', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 'variable' },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Channel dark energy into weapon'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d6 * (DRP Spent / 5)',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2
      },

      tags: ['damage', 'necrotic', 'melee', 'drp', 'level 2', 'dreadnaught']
    },

    {
      id: 'dread_necrotic_touch',
      name: 'Necrotic Touch',
      description: 'Touch an enemy to drain their life force, dealing necrotic damage and healing yourself.',
      level: 2,
      spellType: 'ACTION',
      icon: 'Necrotic/Drain Soul',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Drain Soul',

        tags: ['damage', 'healing', 'necrotic', 'touch', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingMode: 'effect',
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch'
      },

      effectTargeting: {
        damage: {
          targetingType: 'single',
          rangeType: 'touch',
          targetRestrictions: ['enemy'],
          maxTargets: 1,
          targetSelectionMethod: 'manual',
          requiresLineOfSight: true
        },
        healing: {
          targetingType: 'self'
        }
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 5 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Touch target with necrotic energy'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'healing'],

      damageConfig: {
        formula: '2d8 + spirit',
        elementType: 'necrotic',
        damageType: 'direct'
      },

      healingConfig: {
        formula: 'damage_dealt / 2',
        healingType: 'direct',
        hasHotEffect: false
      },

      tags: ['damage', 'healing', 'necrotic', 'touch', 'drp', 'level 2', 'dreadnaught']
    },

    {
      id: 'dread_unholy_fortitude',
      name: 'Unholy Fortitude',
      description: 'Enhance your resilience with dark power for 1 minute, increasing armor by 1 for every 5 DRP spent. Spend variable DRP to scale the armor bonus.',
      level: 2,
      spellType: 'ACTION',
      icon: 'Necrotic/Protective Aura',
      school: 'Abjuration',

      typeConfig: {
        school: 'abjuration',
        icon: 'Necrotic/Protective Aura',

        tags: ['buff', 'armor', 'defense', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 'variable' },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Umbra Fortis!',
        somaticText: 'Dark energy swirls around you'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'unholy_fortitude_buff',
          name: 'Unholy Fortitude',
          description: 'Increase armor by 1 for every 5 DRP spent for 1 minute',
          statModifier: {
            stat: 'armor',
            magnitude: 'DRP Spent / 5',
            magnitudeType: 'flat'
          }
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: false,
        canBeDispelled: false
      },

      tags: ['buff', 'ac', 'defense', 'drp', 'level 2', 'dreadnaught']
    },

    // ========================================
    // LEVEL 3 SPELLS
    // ========================================
    {
      id: 'dread_necrotic_aura',
      name: 'Necrotic Aura',
      description: 'Surround yourself with necrotic energy, dealing damage to nearby enemies.',
      level: 3,
      spellType: 'ACTION',
      icon: 'Necrotic/Death Mark',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Death Mark',

        tags: ['damage', 'necrotic', 'aoe', 'aura', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 10,
        aoeShape: 'sphere',
        aoeSize: 10
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 15 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Mortem Aura!',
        somaticText: 'Dark energy radiates outward'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d6 + spirit',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: false
      },

      tags: ['damage', 'necrotic', 'aoe', 'drp', 'level 3', 'dreadnaught']
    },

    {
      id: 'dread_blood_to_shadow',
      name: 'Blood to Shadow',
      description: 'Convert your own hit points into Dark Resilience Points at a 4:1 ratio.',
      level: 3,
      spellType: 'ACTION',
      icon: 'Necrotic/Blood Skull',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Blood Skull',

        tags: ['resource gain', 'drp', 'health conversion'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['health'],
        resourceValues: { health: 'variable' },
        useFormulas: { health: true },
        resourceFormulas: { health: '4 * drp_gain' },
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Sangui Umbra!',
        somaticText: 'Blood turns to shadow'
      },

      resolution: 'NONE',
      effectTypes: ['restoration'],

      restorationConfig: {
        resourceType: 'drp',
        restorationType: 'restoration',
        formula: 'health_spent / 4',
        description: 'Gain 1 DRP per 4 HP sacrificed'
      },

      tags: ['resource gain', 'drp', 'health', 'level 3', 'dreadnaught']
    },

    // ========================================
    // LEVEL 4 SPELLS
    // ========================================
    {
      id: 'dread_vampiric_strike',
      name: 'Vampiric Strike',
      description: 'Drain life from an enemy with a powerful melee attack, healing yourself for half the damage dealt.',
      level: 4,
      spellType: 'ACTION',
      icon: 'Necrotic/Vampiric Touch',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Vampiric Touch',

        tags: ['damage', 'healing', 'necrotic', 'melee', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingMode: 'effect',
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
      },

      effectTargeting: {
        damage: {
          targetingType: 'single',
          rangeType: 'melee',
          rangeDistance: 5,
          targetRestrictions: ['enemy'],
          maxTargets: 1
        },
        healing: {
          targetingType: 'self'
        }
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 20 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Weapon glows with vampiric energy'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'healing'],

      damageConfig: {
        formula: '5d6 + spirit',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2
      },

      healingConfig: {
        formula: 'damage_dealt / 2',
        healingType: 'direct',
        hasHotEffect: false
      },

      tags: ['damage', 'healing', 'necrotic', 'melee', 'drp', 'level 4', 'dreadnaught']
    },

    {
      id: 'dread_soul_drain',
      name: 'Soul Drain',
      description: 'Drain the soul essence from an enemy, dealing massive necrotic damage and gaining DRP.',
      level: 4,
      spellType: 'ACTION',
      icon: 'Necrotic/Drain Soul',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Drain Soul',

        tags: ['damage', 'resource gain', 'necrotic', 'ranged', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 25 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Anima Drain!',
        somaticText: 'Soul energy flows toward you'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'restoration'],

      damageConfig: {
        formula: '6d6 + spirit',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: false
      },

      restorationConfig: {
        resourceType: 'drp',
        restorationType: 'restoration',
        formula: '5',
        description: 'Gain 5 DRP from soul drain'
      },

      tags: ['damage', 'resource gain', 'necrotic', 'ranged', 'drp', 'level 4', 'dreadnaught']
    },

    {
      id: 'dread_dark_empowerment',
      name: 'Dark Empowerment',
      description: 'Empower yourself with dark energy, gaining increased strength and necrotic damage on attacks.',
      level: 4,
      spellType: 'ACTION',
      icon: 'Necrotic/Necrotic Wither 2',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Necrotic Wither 2',

        tags: ['buff', 'strength', 'necrotic', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 30 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Potentia Tenebra!',
        somaticText: 'Dark power surges through you'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [
          {
            id: 'dark_empowerment_strength',
            name: 'Dark Strength',
            description: '+4 to Strength modifier on attacks and damage',
            statModifier: {
              stat: 'strength',
              magnitude: 4,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'dark_empowerment_necrotic',
            name: 'Necrotic Touch',
            description: 'All attacks deal +2d6 necrotic damage',
            damageModifier: {
              elementType: 'necrotic',
              formula: '2d6',
              damageType: 'additional'
            },
            mechanicsText: '+2d6 necrotic damage on all attacks'
          }
        ],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: true,
        canBeDispelled: false
      },

      tags: ['buff', 'strength', 'damage', 'necrotic', 'drp', 'level 4', 'dreadnaught']
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    {
      id: 'dread_death_embrace',
      name: 'Death Embrace',
      description: 'Embrace the power of death for 1 minute (concentration), becoming resistant to all damage types while healing from necrotic damage instead of taking it.',
      level: 5,
      spellType: 'ACTION',
      icon: 'Necrotic/Necrotic Wither 2',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Necrotic Wither 2',

        tags: ['buff', 'resistance', 'healing', 'necrotic', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 35 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Mortem Amplecti!',
        somaticText: 'Death embraces you'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'combined',
        effects: [
          {
            id: 'death_embrace_resistance',
            name: 'Death Resistance',
            description: 'Resistance to all damage types for 1 minute (requires concentration)',
            statModifier: {
              stat: 'damageResistance',
              magnitude: 1,
              magnitudeType: 'flat',
              damageTypes: ['slashing','piercing','bludgeoning','fire','frost','lightning','poison','necrotic','radiant','psychic','force']
            }
          },
          {
            id: 'death_embrace_healing',
            name: 'Necrotic Healing',
            description: 'Heal from necrotic damage instead of taking it for 1 minute (requires concentration)',
            healingModifier: {
              elementType: 'necrotic',
              formula: 'Damage Taken',
              healingType: 'conversion'
            },
            mechanicsText: 'Heal from necrotic damage instead of taking it for 1 minute'
          }
        ],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: true,
        canBeDispelled: false
      },

      tags: ['buff', 'resistance', 'healing', 'necrotic', 'drp', 'level 5', 'dreadnaught']
    },

    {
      id: 'dread_necrotic_wave',
      name: 'Necrotic Wave',
      description: 'Send a line of necrotic energy that damages enemies and inflicts necrotic weakness.',
      level: 5,
      spellType: 'ACTION',
      icon: 'Necrotic/Necrotic Wave',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Necrotic Wave',

        tags: ['damage', 'debuff', 'necrotic', 'aoe', 'line', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'line',
        aoeSize: 60
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 40 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Unda Mortem!',
        somaticText: 'Wave of death surges forward'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '6d8 + spirit',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: false
      },

      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{
          id: 'necrotic_wave_weakness',
          name: 'Necrotic Weakness',
          description: 'Disadvantage on saving throws against necrotic effects for 1 minute',
          statModifier: {
            stat: 'savingThrows',
            magnitude: -1,
            magnitudeType: 'flat',
            savingThrowTypes: ['necrotic']
          }
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: false,
        canBeDispelled: true
      },

      tags: ['damage', 'debuff', 'necrotic', 'aoe', 'line', 'drp', 'level 5', 'dreadnaught']
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    {
      id: 'dread_shadow_step',
      name: 'Shadow Step',
      description: 'Dissolve into shadows and teleport up to 30 feet. Shadows linger at departure and arrival points, obscuring vision.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Utility/Phantom Dash',
      school: 'Conjuration',

      typeConfig: {
        school: 'conjuration',
        icon: 'Utility/Phantom Dash',
        tags: ['movement', 'teleport', 'shadow', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['location'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: false,
        propagationMethod: 'none'
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 20 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Dissolve into shadows'
      },

      resolution: 'NONE',
      effectTypes: ['utility', 'debuff'],

      utilityConfig: {
        utilityType: 'Teleport',
        selectedEffects: [{
          id: 'teleport',
          name: 'Teleport',
          description: 'Teleport through shadows up to 30 feet',
          distance: 30,
          needsLineOfSight: false,
          requiresUnoccupied: true
        }],
        duration: 0,
        durationUnit: 'instant',
        concentration: false,
        power: 'moderate'
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'shadow_obscurement',
          name: 'Shadow Obscurement',
          description: 'Heavily obscured area - creatures have disadvantage on Perception checks and movement speed reduced by 10 feet',
          statusType: 'obscured',
          level: 'moderate',
          statModifier: {
            stat: 'speed',
            magnitude: 10,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        areaShape: 'circle',
        areaParameters: { radius: 10 },
        triggerCondition: 'area_entry',
        triggerDescription: 'Creatures that enter or start their turn in the shadow areas are affected',
        canBeDispelled: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['movement', 'teleport', 'shadow', 'drp', 'level 6', 'dreadnaught']
    },

    {
      id: 'dread_soul_rend',
      name: 'Soul Rend',
      description: 'Tear at an enemy\'s soul, dealing massive damage and potentially preventing healing.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Necrotic/Drain Soul',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Drain Soul',

        tags: ['damage', 'debuff', 'necrotic', 'healing prevention', 'ranged', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 45 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Anima Lacerare!',
        somaticText: 'Soul is torn asunder'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '8d6 + spirit',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2
      },

      debuffConfig: {
        debuffType: 'healingPrevention',
        effects: [{
          id: 'soul_rend_prevention',
          name: 'Soul Wounded',
          description: 'Cannot regain hit points from healing magic',
          healingPrevention: {
            types: ['magical'],
            percentage: 100
          },
          mechanicsText: 'Cannot regain HP from healing magic',
          healingReduction: 100
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: false,
        canBeDispelled: true
      },

      tags: ['damage', 'debuff', 'necrotic', 'healing prevention', 'ranged', 'drp', 'level 6', 'dreadnaught']
    },

    {
      id: 'dread_apocalypse_aura',
      name: 'Apocalypse Aura',
      description: 'Surround yourself with apocalyptic energy that damages enemies and empowers undead allies.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Necrotic/Protective Aura',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Protective Aura',

        tags: ['damage', 'debuff', 'necrotic', 'aoe', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 20,
        aoeShape: 'sphere',
        aoeSize: 20
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 50 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Apocalypsis Aura!',
        somaticText: 'Apocalyptic energy radiates'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'buff'],

      damageConfig: {
        formula: '8d6 + spirit',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: false,
        targetRestrictions: ['enemy', 'living']
      },

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'apocalypse_aura_empowerment',
          name: 'Apocalyptic Empowerment',
          description: 'Undead allies gain +2 to attack and damage rolls',
          statModifier: {
            stat: 'attackDamageBonus',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: true,
        canBeDispelled: false,
        targetRestrictions: ['undead', 'ally']
      },

      tags: ['damage', 'buff', 'necrotic', 'aoe', 'undead', 'drp', 'level 6', 'dreadnaught']
    },

    // ========================================
    // LEVEL 7 SPELLS
    // ========================================
    {
      id: 'dread_eternal_darkness',
      name: 'Eternal Darkness',
      description: 'Create a zone of absolute darkness that drains life from creatures within it.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Void/Black Hole',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Protective Aura',

        tags: ['damage', 'debuff', 'terrain', 'darkness', 'necrotic', 'aoe', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 120,
        aoeShape: 'sphere',
        aoeSize: 30
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 40 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Tenebra Aeterna!',
        somaticText: 'Darkness consumes the area',
        materialText: 'Obsidian orb worth 1000 gp'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '10d6 + spirit',
        elementType: 'necrotic',
        damageType: 'hot',
        hasHotEffect: true,
        hotFormula: '5d6 + spirit',
        hotDuration: 1,
        hotTickType: 'turn',
        canCrit: false,
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 18,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },

      debuffConfig: {
        debuffType: 'combined',
        effects: [
          {
            id: 'eternal_darkness_blind',
            name: 'Absolute Darkness',
            description: 'Creatures are blinded in the area',
            statModifier: {
              stat: 'blinded',
              magnitude: 1,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'eternal_darkness_weakness',
            name: 'Dark Weakness',
            description: 'Vulnerable to necrotic damage',
            statModifier: {
              stat: 'damageVulnerability',
              magnitude: 1,
              magnitudeType: 'flat',
              damageTypes: ['necrotic']
            }
          }
        ],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: true,
        canBeDispelled: false
      },

      terrainConfig: {
        terrainType: 'darkness',
        description: 'Area of magical darkness that drains life',
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes'
      },

      tags: ['damage', 'debuff', 'terrain', 'darkness', 'necrotic', 'aoe', 'drp', 'level 7', 'dreadnaught']
    },

    {
      id: 'dread_soul_harvest',
      name: 'Death Mark',
      description: 'Brand an enemy with a shadow mark. Each time the marked target damages you, gain DRP equal to half damage dealt (rounded down). Persists for 1 minute or until the target is slain.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Necrotic/Death Mark',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Death Mark',
        tags: ['debuff', 'drp', 'resource gain', 'necrotic', 'mark', 'single target'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy'],
        maxTargets: 1
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 30 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Signa Mortis!',
        somaticText: 'Brand the shadow mark onto the enemy with a pointing gesture'
      },

      resolution: 'NONE',
      effectTypes: ['debuff'],

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'death_mark',
          name: 'Death Mark',
          description: 'Each time this target deals damage to the Dreadnaught, the Dreadnaught gains DRP equal to half the damage dealt (rounded down). The mark cannot be removed by the target.',
          statusType: 'marked',
          mechanicsText: 'Dreadnaught gains DRP equal to half damage dealt by marked target',
          statPenalty: { stat: 'death_mark', value: 50, magnitudeType: 'percentage' },
          config: {
            triggerOn: 'damage_dealt_to_caster',
            drpGainFormula: 'Math.floor(damageTaken / 2)',
            maxDrpPerHit: 20,
            canStack: false
          }
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: false,
        canBeDispelled: true,
        endsOnTargetDeath: true
      },

      tags: ['debuff', 'drp', 'resource gain', 'necrotic', 'mark', 'level 7', 'dreadnaught']
    },

    {
      id: 'dread_void_eruption',
      name: 'Void Eruption',
      description: 'Cause a violent eruption of void energy that consumes everything in its path.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Void/Black Hole',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Protective Aura',

        tags: ['damage', 'necrotic', 'aoe', 'cone', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 120,
        aoeShape: 'cone',
        aoeSize: 60
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 50 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Tenebra Eruptio!',
        somaticText: 'Void energy explodes outward'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '12d6 + spirit',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: false,
        saveType: 'agility',
        saveDC: '8 + proficiency + spirit_mod',
        halfDamage: true
      },

      tags: ['damage', 'necrotic', 'aoe', 'cone', 'save', 'drp', 'level 7', 'dreadnaught']
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    {
      id: 'dread_immortal_fortress',
      name: 'Immortal Fortress',
      description: 'Transform into an immortal fortress of darkness, immune to most damage and effects.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Necrotic/Protective Aura',
      school: 'Abjuration',

      typeConfig: {
        school: 'abjuration',
        icon: 'Necrotic/Protective Aura',

        tags: ['buff', 'transformation', 'immunity', 'resistance', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 45 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Fortis Immortalis!',
        somaticText: 'Body becomes living darkness'
      },

      resolution: 'NONE',
      effectTypes: ['buff', 'transformation'],

      buffConfig: {
        buffType: 'combined',
        effects: [
          {
            id: 'immortal_fortress_immunity',
            name: 'Immortal Immunity',
            description: 'Immune to poison, disease, necrotic, and psychic damage',
            statModifier: {
              stat: 'damageImmunity',
              magnitude: 1,
              magnitudeType: 'flat',
              damageTypes: ['poison', 'necrotic', 'psychic']
            }
          },
          {
            id: 'immortal_fortress_resistance',
            name: 'Fortress Resistance',
            description: 'Resistance to all damage types not already immune (slashing, piercing, bludgeoning, fire, frost, lightning, poison, radiant, force)',
            statModifier: {
              stat: 'damageResistance',
              magnitude: 1,
              magnitudeType: 'flat',
              damageTypes: ['slashing','piercing','bludgeoning','fire','frost','lightning','poison','radiant','force']
            }
          }
        ],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: true,
        canBeDispelled: false
      },

      transformationConfig: {
        transformationType: 'shadow',
        targetType: 'self',
        duration: 1,
        durationUnit: 'minutes',
        power: 'major',
        newForm: 'Immortal Fortress',
        description: 'Your body becomes living darkness, an indestructible bastion.',
        concentration: true,
        grantedAbilities: [
          { id: 'fortress_immunity', name: 'Damage Immunity', description: 'Immune to poison, disease, necrotic, and psychic damage' },
          { id: 'fortress_resistance', name: 'Damage Resistance', description: 'Resistance to all other damage types' },
          { id: 'incorporeal', name: 'Incorporeal Passage', description: 'Can move through solid objects' }
        ]
      },

      tags: ['buff', 'transformation', 'immunity', 'resistance', 'drp', 'level 8', 'dreadnaught']
    },

    {
      id: 'dread_soul_storm',
      name: 'Soul Storm',
      description: 'Unleash a storm of tormented souls that ravage enemies and heal you with their essence.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Necrotic/Psionic Strike',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Psionic Strike',

        tags: ['damage', 'healing', 'necrotic', 'aoe', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingMode: 'effect',
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'sphere',
        aoeSize: 30
      },

      effectTargeting: {
        damage: {
          targetingType: 'area',
          rangeType: 'ranged',
          rangeDistance: 60,
          aoeShape: 'sphere',
          aoeParameters: { radius: 30 },
          targetRestrictions: ['enemy']
        },
        healing: {
          targetingType: 'self'
        }
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 40 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Anima Tempestas!',
        somaticText: 'Souls swirl in a deadly storm'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'healing'],

      damageConfig: {
        formula: '13d6 + spirit',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: false,
        saveType: 'constitution',
        saveDC: '8 + proficiency + spirit_mod',
        halfDamage: true
      },

      healingConfig: {
        formula: 'damage_dealt / 4',
        healingType: 'direct',
        hasHotEffect: false
      },

      tags: ['damage', 'healing', 'necrotic', 'aoe', 'save', 'drp', 'level 8', 'dreadnaught']
    },

    {
      id: 'dread_abyssal_apocalypse',
      name: 'Abyssal Apocalypse',
      description: 'Bring forth the end of days, devastating all enemies in the area with apocalyptic power.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Necrotic/Protective Aura',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Protective Aura',

        tags: ['damage', 'debuff', 'necrotic', 'aoe', 'fear', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 120,
        aoeShape: 'sphere',
        aoeSize: 40
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 50 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Apocalypsis Abyssus!',
        somaticText: 'Reality tears asunder',
        materialText: 'Ancient tome worth 5000 gp'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '15d6 + spirit',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: false,
        saveType: 'constitution',
        saveDC: '8 + proficiency + spirit_mod',
        halfDamage: false
      },

      debuffConfig: {
        debuffType: 'combined',
        effects: [
          {
            id: 'abyssal_apocalypse_fear',
            name: 'Apocalyptic Fear',
            description: 'Creatures are frightened for 1 minute',
            statModifier: {
              stat: 'frightened',
              magnitude: 1,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'abyssal_apocalypse_weakness',
            name: 'Abyssal Weakness',
            description: 'Maximum hit points reduced by Damage Taken',
            statModifier: {
              stat: 'maxHitPoints',
              magnitude: 'damage_taken',
              magnitudeType: 'reduction'
            }
          }
        ],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: false,
        canBeDispelled: false
      },

      tags: ['damage', 'debuff', 'necrotic', 'aoe', 'fear', 'save', 'drp', 'level 8', 'dreadnaught']
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    {
      id: 'dread_eternal_night',
      name: 'Eternal Night',
      description: 'Plunge a 300ft area into eternal darkness for 24 hours. All creatures are blinded and take 16d6+Spirit necrotic damage (4d6 ongoing).',
      level: 9,
      spellType: 'ACTION',
      icon: 'Void/Black Hole',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Protective Aura',

        tags: ['damage', 'debuff', 'terrain', 'darkness', 'necrotic', 'aoe', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 300,
        aoeShape: 'sphere',
        aoeSize: 300
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 50 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Nox Aeterna!',
        somaticText: 'Night falls eternally',
        materialText: 'Black diamond worth 10000 gp'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '16d6 + spirit',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: false,
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 18,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '4d6',
          duration: 24,
          tickFrequency: 'turn',
          isProgressiveDot: false,
          triggerCondition: 'start_of_turn',
          triggerDescription: 'Creatures take 2d6 necrotic damage at the start of each turn while in the area'
        }
      },

      terrainConfig: {
        terrainType: 'eternal_darkness',
        description: 'Area of eternal darkness that drains life',
        durationValue: 24,
        durationType: 'hours',
        durationUnit: 'hours'
      },

      debuffConfig: {
        debuffType: 'combined',
        effects: [
          {
            id: 'eternal_night_blindness',
            name: 'Eternal Blindness',
            description: 'Creatures are permanently blinded in the area',
            statModifier: {
              stat: 'blinded',
              magnitude: 1,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'eternal_night_drain',
            name: 'Life Drain',
            description: 'Ongoing necrotic damage drains life from creatures in the area',
            dotFormula: '2d8',
            dotDamageType: 'necrotic',
            damagePerTurn: '2d8'
          }
        ],
        durationValue: 24,
        durationType: 'hours',
        durationUnit: 'hours',
        concentrationRequired: false,
        canBeDispelled: false
      },

      tags: ['damage', 'debuff', 'terrain', 'darkness', 'necrotic', 'aoe', 'save', 'drp', 'level 9', 'dreadnaught']
    },

    {
      id: 'dread_void_incarnate',
      name: 'Void Incarnate',
      description: 'Transform into a living shadow for 3 rounds. Become Huge, gain +100 Temporary HP, 60ft Flying speed, and heal for 100% of damage dealt.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Void/Black Hole',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Protective Aura',

        tags: ['transformation', 'damage', 'necrotic', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 50 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Devorans Abyssalis!',
        somaticText: 'Shadows consume your mortal coil'
      },

      resolution: 'NONE',
      effectTypes: ['transformation', 'damage'],

      transformationConfig: {
        transformationType: 'shadow',
        targetType: 'self',
        duration: 3,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Void Incarnate',
        description: 'Transform into a massive entity of ravenous shadow.',
        grantedAbilities: [
          { id: 'huge_size', name: 'Huge Size', description: 'Size becomes Huge, gain +100 temporary HP' },
          { id: 'flying', name: 'Flight', description: 'Gain 60ft flying speed' },
          { id: 'devour', name: 'Devour', description: 'Melee attacks heal you for damage dealt' },
          { id: 'abyssal_exhaustion', name: 'Exhaustion (On End)', description: 'Gain 2 levels of exhaustion when transformation ends' }
        ]
      },

      damageConfig: {
        formula: '18d6 + spirit',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: false,
        trigger: 'devour_attack'
      },

      tags: ['transformation', 'damage', 'necrotic', 'devour', 'drp', 'level 9', 'dreadnaught']
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    {
      id: 'dread_retribution_aura',
      name: 'Retribution Aura',
      description: 'Surround yourself with vengeful spirits that retaliate against anyone who damages you.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Necrotic/Necrotic Wither 2',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Necrotic Wither 2',

        tags: ['buff', 'retaliation', 'necrotic', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 50 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Retributio Aura!',
        somaticText: 'Vengeful spirits surround you'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'retaliation',
        effects: [{
          id: 'retribution_aura_retaliation',
          name: 'Spirit Retribution',
          description: 'Spirits deal necrotic damage equal to Damage Taken back at attacker',
          retaliationDamage: {
            formula: 'Math.floor(Damage Taken * 0.5)',
            elementType: 'necrotic',
            damageType: 'direct'
          },
          mechanicsText: 'Spirits deal 50% of damage taken back at attacker as necrotic'
        }],
        durationValue: 1,
        durationType: 'hours',
        durationUnit: 'hours',
        concentrationRequired: false,
        canBeDispelled: false
      },

      tags: ['buff', 'retaliation', 'damage', 'necrotic', 'drp', 'level 10', 'dreadnaught']
    },

    {
      id: 'dread_void_annihilation',
      name: 'Void Annihilation',
      description: 'Become the void itself â€” a yawning darkness that swallows all in range. Targets that fail their save are unmade, their essence dissolving into the darkness that feeds you.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Void/Black Hole',
      school: 'Necromancy',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Protective Aura',

        tags: ['damage', 'necrotic', 'aoe', 'ultimate', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      cooldownConfig: {
        type: 'none'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 500,
        targetRestrictions: ['location'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: false,
        aoeShape: 'sphere',
        aoeSize: 100
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 50 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Annihilatio Abyssalis!',
        somaticText: 'The void expands and consumes everything',
        materialText: 'Void crystal worth 50,000 gp'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '20d6 + spirit',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: false,
        saveType: 'constitution',
        saveDC: '8 + proficiency + spirit_mod',
        halfDamage: false
      },

      destructionConfig: {
        destructionType: 'annihilation',
        description: 'Everything in the area is annihilated, leaving only void',
        radius: 100,
        saveType: 'constitution',
        saveDC: '8 + proficiency + spirit_mod'
      },

      tags: ['damage', 'necrotic', 'aoe', 'ultimate', 'save', 'drp', 'level 10', 'dreadnaught']
    },

    // ADDITIONAL LEVEL 9 SPELL
    {
      id: 'dread_oblivion_strike',
      name: 'Oblivion Strike',
      description: 'Strike an enemy with the power of oblivion, erasing them from existence if they drop below 0 HP.',
      level: 9,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Necrotic Wither 2',
        tags: ['damage', 'necrotic', 'execute', 'ultimate', 'drp'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 10,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        requiresLineOfSight: true
      },

      damageConfig: {
        formula: '12d10',
        elementType: 'necrotic',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 20,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: {
          drp: 50
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 10
      },

      resolution: 'DICE',
      tags: ['damage', 'necrotic', 'execute', 'ultimate', 'dreadnaught']
    }
  ]
};
