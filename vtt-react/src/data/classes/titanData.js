/**
 * Titan Class Data
 * 
 * Complete class information for the Titan - a celestial warrior
 * who attunes to divine beings to gain their powers and restrictions.
 */

export const TITAN_DATA = {
  id: 'titan',
  name: 'Titan',
  icon: 'fas fa-sun',
  role: 'Melee/Tank',

  // Overview section
  overview: {
    title: 'The Titan',
    subtitle: 'Celestial Warrior',
    
    description: `The Titan class draws its power from attuning to celestial beings, harnessing their divine attributes and abilities. Each day, the Titan can choose to attune to a different celestial deity, gaining their powers and unique abilities while also adhering to their restrictions. This system brings a high level of flavor and depth, making the Titan a versatile and thematic melee warrior.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Titans are divine warriors who have forged connections with celestial beings, channeling their power through devotion and attunement. Unlike clerics who worship from afar, Titans embody the essence of their chosen deity, taking on both their strengths and weaknesses. In roleplay, Titans often reflect the personality and values of their current devotion.

Their celestial connection manifests physically based on their chosen devotion: radiant auras for Solara, silvery moonlight for Lunara, starlit patterns for Astraeus, earthen resilience for Terranox, or crackling winds for Zephyra. Each morning, a Titan must meditate and choose which celestial being to attune to for the day.

Common Titan archetypes include:
- **The Devoted Champion**: Loyal to one celestial being, rarely changing devotion
- **The Adaptive Warrior**: Switches devotions strategically based on challenges ahead
- **The Celestial Seeker**: Explores each devotion to understand the divine
- **The Balanced Guardian**: Rotates through devotions to maintain cosmic balance`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Titan is a versatile melee warrior whose role changes based on their chosen devotion. They excel at:

**Adaptability**: Can switch between offensive, defensive, and mobile playstyles daily
**Melee Combat**: All devotions enhance melee effectiveness in different ways
**Tactical Flexibility**: Choose devotions based on anticipated challenges
**Powerful Once-Per-Day Abilities**: Each devotion grants a devastating ability

However, Titans must carefully manage their devotion restrictions. Each celestial being's power comes with meaningful drawbacks that require strategic play. The key is choosing the right devotion for the situation and playing around its restriction.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Titan is about strategic devotion selection and managing restrictions. Key considerations:

**Devotion Selection**: 
- **Solara** (Radiant Sun): Offensive damage dealer, high visibility
- **Lunara** (Moon Guardian): Defensive tank, self-reliant healing
- **Astraeus** (Star Sage): Mobile striker, vulnerable to physical damage
- **Terranox** (Earth Titan): Immovable tank, reduced mobility
- **Zephyra** (Wind Spirit): Fast attacker, knockback risk

**Daily Planning**: 
- Consider the day's challenges when choosing devotion
- Coordinate with party composition
- Plan around your once-per-day ultimate ability

**Managing Restrictions**: 
- **Solara**: Position carefully in bright light to minimize advantage against you
- **Lunara**: Don't rely on party healers, use self-sustain
- **Astraeus**: Avoid prolonged melee against non-magical attackers
- **Terranox**: Position early, don't expect to chase enemies
- **Zephyra**: Manage positioning to avoid knockback into hazards

**Specialization Synergies**:
- **Celestial Champion**: Enhances devotion benefits
- **Divine Conduit**: Reduces devotion restrictions
- **Astral Warrior**: Allows mid-combat devotion switching`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Celestial Champion',
      content: `**The Setup**: You're a Titan (Celestial Champion specialization) attuned to Solara, the Radiant Sun. You're facing a group of shadow demons (4 shadow demons + 1 shadow lord). Your party is with you. Current Devotion: Solara (offensive radiant damage). Starting Mana: 50/60. Your goal: Use Solara's radiant damage bonuses to destroy the shadow demons, but manage the visibility drawback.

**Starting State**: Devotion: Solara | Mana: 50/60 | HP: 75/75 | Radiant Aura: Active

**Solara Devotion Benefits**:
- +2d6 radiant damage to all melee attacks
- Radiant Aura: Enemies within 10 ft take 1d6 radiant damage per turn
- Once-per-day: "Solar Flare" (massive radiant AoE)

**Solara Devotion Drawback**:
- You glow with bright light (30 ft radius)
- Enemies have advantage on attacks against you in bright light

**Turn 1 - Radiant Strike (Radiant Damage: 0 → 19)**

*Four shadow demons and their lord emerge from darkness. You BLAZE with Solara's light, a beacon in the shadows.*

**Your Action**: Melee attack Shadow Demon #1
**Attack Roll**: d20+6 → [15] = Hit!
**Base Damage**: 2d8+4 → [7, 6] + 4 = 17 damage
**Solara Bonus**: +2d6 radiant → [5, 6] = **+11 radiant damage**
**Total Damage**: 17 + 11 = **28 damage**

*Your weapon BLAZES with solar fire. The shadow demon SCREAMS as radiant light burns it.*

**Shadow Demon #1**: Takes 28 damage → HEAVILY DAMAGED

**Radiant Aura** (passive, start of your turn):
**Effect**: All enemies within 10 ft take 1d6 radiant damage
**Demons in Range**: Shadow Demons #1, #2, #3 (all within 10 ft)
**Damage**: 1d6 → [4] = 4 radiant damage each

*Your radiant aura PULSES. The demons within 10 feet BURN from proximity to your light.*

**Shadow Demons #1, #2, #3**: Each take 4 radiant damage

**Your Party's Mage**: "You're GLOWING! The demons are burning just from being near you!"
**You**: "Solara's Radiant Aura. Enemies within 10 feet take 1d6 radiant damage per turn. And my melee attacks deal +2d6 radiant damage."

**Shadow Demon #2's Turn**: Attacks you
**Attack Roll**: d20+5 with ADVANTAGE (you're glowing in bright light) → [16, 12] → Take 16 = Hit!
**Damage**: 2d6+3 → [5, 4] + 3 = **12 damage**

**HP**: 75 - 12 = 63/75

**Your Party's Tank**: "They have advantage against you because you're glowing!"
**You**: "Solara's drawback. I emit bright light in 30 ft. Enemies have advantage on attacks against me in bright light. But the damage I deal makes it worth it."

**Current State**: Devotion: Solara | Mana: 50/60 | HP: 63/75

**Turn 2 - Solar Fury (Radiant Damage: 19 → 42)**

*The shadow demons swarm you. Perfect. More targets for your radiant aura.*

**Radiant Aura** (start of turn):
**Demons in Range**: Shadow Demons #1, #2, #3, #4 (all within 10 ft now)
**Damage**: 1d6 → [5] = 5 radiant damage each

**Shadow Demon #1**: Takes 5 radiant damage → **DEAD** (was already heavily damaged)

*The demon DISSOLVES in your radiant light.*

**Your Action**: Melee attack Shadow Demon #2
**Attack Roll**: d20+6 → [18] = Hit!
**Base Damage**: 2d8+4 → [8, 7] + 4 = 19 damage
**Solara Bonus**: +2d6 radiant → [6, 5] = **+11 radiant damage**
**Total Damage**: 19 + 11 = **30 damage**

**Shadow Demon #2**: Takes 30 damage → **DEAD**

**Your Action (Bonus Action)**: "Radiant Smite" (8 mana, Solara-enhanced ability)
**Effect**: Next attack deals additional 3d8 radiant damage

**Mana**: 50 - 8 = 42/60

*You channel Solara's power. Your weapon ERUPTS with solar fire.*

**Your Party's Healer**: "Two demons dead already! Your radiant damage is devastating them!"
**You**: "Shadow creatures are vulnerable to radiant damage. Solara is the perfect devotion for this fight."

**Current State**: Devotion: Solara | Mana: 42/60 | HP: 63/75

**Turn 3 - Solar Flare (Ultimate Ability)**

*Two shadow demons and the shadow lord remain. Time to use Solara's ultimate ability.*

**Radiant Aura** (start of turn):
**Demons in Range**: Shadow Demons #3, #4, Shadow Lord
**Damage**: 1d6 → [6] = 6 radiant damage each

**Shadow Demons #3, #4**: Each take 6 radiant damage
**Shadow Lord**: Takes 6 radiant damage

**Your Action**: "SOLAR FLARE" (Solara's once-per-long-rest ultimate ability, no mana cost)
**Effect**: Massive radiant explosion, 30 ft radius, 8d10 radiant damage, enemies blinded for 1 round

*You raise your weapon to the sky. You CHANNEL SOLARA DIRECTLY. The sun itself seems to descend.*

**Damage Roll**: 8d10 radiant → [9, 10, 8, 7, 9, 8, 10, 7] = **68 radiant damage!**

*A MINIATURE SUN appears above you, then EXPLODES in a devastating wave of radiant fire.*

**Shadow Demon #3**: Takes 68 radiant damage → **DISINTEGRATED**
**Shadow Demon #4**: Takes 68 radiant damage → **DISINTEGRATED**
**Shadow Lord**: Takes 68 radiant damage → HEAVILY DAMAGED (50% HP remaining)
**Blinded**: Shadow Lord is blinded for 1 round

**Your Party (shielding eyes)**: "WHAT WAS THAT?!"
**You**: "Solar Flare. Solara's ultimate ability. Once per long rest. 68 radiant damage in 30 feet. The shadow demons couldn't withstand the sun's fury."

**Current State**: Devotion: Solara | Mana: 42/60 | HP: 63/75

**Turn 4 - Finishing the Shadow Lord**

*Only the shadow lord remains, blinded and heavily damaged.*

**Radiant Aura** (start of turn):
**Shadow Lord in Range**: Yes
**Damage**: 1d6 → [5] = 5 radiant damage

**Shadow Lord**: Takes 5 radiant damage

**Your Action**: Melee attack Shadow Lord (has disadvantage on attacks due to blindness)
**Attack Roll**: d20+6 → [17] = Hit!
**Base Damage**: 2d8+4 → [8, 6] + 4 = 18 damage
**Solara Bonus**: +2d6 radiant → [6, 5] = **+11 radiant damage**
**Radiant Smite** (from Turn 2): +3d8 radiant → [7, 8, 6] = **+21 radiant damage**
**Total Damage**: 18 + 11 + 21 = **50 damage!**

*Your weapon, still charged with Radiant Smite, EXPLODES with solar fire as it strikes the shadow lord.*

**Shadow Lord**: Takes 50 damage → **DEAD**

**Combat Over**

*You stand victorious, still glowing with Solara's radiant light. The shadow demons are gone, burned away by the sun.*

**Your Party's Mage**: "You dealt... incredible radiant damage. That Solar Flare alone did 68 damage to all of them."
**You**: "Solara, the Radiant Sun. My devotion grants +2d6 radiant damage to all melee attacks. My Radiant Aura deals 1d6 radiant damage per turn to all enemies within 10 feet. And Solar Flare is my once-per-long-rest ultimate—8d10 radiant damage in 30 feet."
**Your Party's Tank**: "But you were taking more hits because you're glowing."
**You**: "Solara's drawback. I emit bright light in 30 feet, so enemies have advantage on attacks against me in bright light. I took 12 damage from a shadow demon that had advantage. But the offensive power is worth it."
**Your Party's Healer**: "Could you have chosen a different devotion?"
**You**: "Yes. Each morning during a long rest, I can attune to a different celestial being. I could choose Lunara for defense and healing, Terranox for maximum tankiness, Astraeus for speed and mobility, or Zephyra for attack speed. Each has different benefits and drawbacks. I chose Solara because we were fighting shadow demons, and radiant damage is devastating against them."

**Final State**: Devotion: Solara | Mana: 42/60 | HP: 63/75

**Damage Breakdown**:
- Turn 1: 28 damage (melee) + 12 damage (aura to 3 demons) = 40 total
- Turn 2: 30 damage (melee) + 20 damage (aura to 4 demons) = 50 total
- Turn 3: 68 damage (Solar Flare to 3 enemies) + 18 damage (aura) = 204 total (68×3)
- Turn 4: 50 damage (melee with Radiant Smite) + 5 damage (aura) = 55 total
- **Grand Total**: ~350+ radiant damage dealt

**The Lesson**: Titan gameplay is about:
1. **Devotion Selection**: Chose Solara for offensive radiant damage against shadow demons
2. **Radiant Aura**: Dealt 1d6 radiant damage per turn to all enemies within 10 ft (passive)
3. **Melee Bonus**: +2d6 radiant damage on every melee attack (11 damage per hit)
4. **Solar Flare**: Ultimate ability dealt 68 radiant damage in 30 ft radius, once per long rest
5. **Radiant Smite**: Enhanced ability added 21 radiant damage to finishing blow
6. **Drawback Management**: Accepted advantage for enemies in exchange for massive radiant damage
7. **Daily Flexibility**: Can switch to different devotion (Lunara, Terranox, Astraeus, Zephyra) each long rest

You're a CELESTIAL WARRIOR who channels divine power through devotion. Each morning, you choose which celestial being to attune to, gaining their powers and restrictions. Solara makes you a radiant damage powerhouse—+2d6 on every melee attack, 1d6 aura damage per turn, and a devastating 8d10 Solar Flare ultimate. But you GLOW, giving enemies advantage. Lunara would make you a defensive tank with self-healing. Terranox would make you immovable with maximum defense. Each devotion changes your playstyle completely. You're not locked into one role—you ADAPT daily to the challenges ahead.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Celestial Devotion System',
    subtitle: 'Attune to Divine Beings',
    
    description: `The Celestial Devotion system allows the Titan to attune to one of five celestial beings each day. Each devotion provides powerful benefits and unique abilities, but also imposes meaningful restrictions. The Titan can switch their devotion during a long rest, allowing them to adapt to different challenges and playstyles.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**Choosing a Devotion**: During a long rest, meditate and choose one celestial being to attune to
**Duration**: The devotion lasts until your next long rest
**Switching**: You can change devotions during any long rest
**Benefits**: Gain passive bonuses and a powerful once-per-long-rest ability
**Restrictions**: Accept meaningful drawbacks that require strategic play

**The Five Celestial Beings**:
- **Solara, the Radiant Sun**: Offensive radiant damage, visibility drawback
- **Lunara, the Moon Guardian**: Defense and regeneration, reduced external healing
- **Astraeus, the Star Sage**: Speed and mobility, vulnerability to non-magical damage
- **Terranox, the Earth Titan**: Maximum tankiness, reduced movement speed
- **Zephyra, the Wind Spirit**: Attack speed and lightning, knockback risk`
    },
    
    celestialDevotionsTable: {
      title: 'Celestial Devotions',
      headers: ['Devotion', 'Passive Benefits', 'Ultimate Ability (1/Long Rest)', 'Restriction'],
      rows: [
        [
          'Solara (Radiant Sun)',
          'Melee attacks deal +1d6 radiant damage',
          'Solar Flare: 3d8 radiant damage to all enemies within 10 feet, blind for 1 turn',
          'Enemies have advantage on attacks against you in bright light'
        ],
        [
          'Lunara (Moon Guardian)',
          '+2 AC, regenerate 5 HP at start of each turn',
          'Lunar Shield: Absorb 50 damage for all allies within 15 feet',
          'Healing received from external sources is halved'
        ],
        [
          'Astraeus (Star Sage)',
          '+10 ft movement, advantage on Dexterity saves',
          'Starfall: 4d6 force damage to target, stun for 1 turn',
          'Take +1d6 damage from non-magical attacks'
        ],
        [
          'Terranox (Earth Titan)',
          '+20 HP, resistance to bludgeoning/piercing/slashing',
          'Earthquake: 3d6 bludgeoning to all enemies within 20 feet, knock prone',
          'Movement speed reduced by 10 feet'
        ],
        [
          'Zephyra (Wind Spirit)',
          '+2 attack speed, melee attacks deal +1d4 lightning',
          'Wind Dash: Teleport 30 feet, 3d6 lightning to all at destination',
          '10% chance to be knocked back 5 feet when taking damage'
        ]
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Solara (Offensive)**: Best for damage-focused days. Position to minimize bright light exposure or embrace the aggro and tank with support.

**Lunara (Defensive)**: Ideal for tanking without a dedicated healer. The regeneration is powerful but you must be self-sufficient.

**Astraeus (Mobile)**: Perfect for hit-and-run tactics or when facing magical enemies. Avoid prolonged melee against mundane weapons.

**Terranox (Immovable Tank)**: Ultimate frontline presence. Position early and hold the line. The movement penalty is severe but the tankiness is unmatched.

**Zephyra (Fast Striker)**: High attack speed for multiple hits. Manage positioning carefully to avoid knockback into hazards or away from enemies.

**Devotion Rotation**: Consider rotating devotions based on known challenges. Scout ahead when possible to inform your choice.`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Titan Specializations',
    subtitle: 'Three Paths of Divine Power',
    
    description: `Every Titan chooses one of three specializations that define their approach to celestial devotion. Each specialization offers unique ways to enhance or modify the devotion system.`,
    
    specs: [
      {
        id: 'celestial-champion',
        name: 'Celestial Champion',
        icon: 'spell_holy_holybolt',
        color: '#FFD700',
        theme: 'Enhanced Devotion Benefits',
        
        description: `The Celestial Champion specialization focuses on maximizing the benefits of each devotion. Champions embrace their chosen deity fully, gaining enhanced passive bonuses and more powerful ultimate abilities.`,
        
        playstyle: 'Maximize devotion benefits, powerful abilities, accept restrictions',
        
        strengths: [
          'Devotion passive benefits increased by 50%',
          'Ultimate abilities recharge on short rest instead of long rest',
          'Can use ultimate ability twice per long rest',
          'Devotion benefits apply to nearby allies (10 feet)'
        ],
        
        weaknesses: [
          'Devotion restrictions also increased by 50%',
          'Cannot switch devotions mid-combat',
          'More committed to chosen devotion',
          'Higher risk, higher reward'
        ],
        
        keyAbilities: [
          'Divine Amplification: Devotion benefits increased by 50%',
          'Shared Blessing: Allies within 10 feet gain minor devotion benefits',
          'Celestial Surge: Use ultimate ability twice per long rest'
        ],
        
        specPassive: {
          name: 'Champion\'s Devotion',
          description: 'Devotion passive benefits increased by 50%. Ultimate abilities can be used twice per long rest. Allies within 10 feet gain 25% of your devotion benefits. Devotion restrictions also increased by 50%.'
        }
      },
      {
        id: 'divine-conduit',
        name: 'Divine Conduit',
        icon: 'spell_holy_divineprovidence',
        color: '#87CEEB',
        theme: 'Reduced Restrictions',
        
        description: `The Divine Conduit specialization focuses on minimizing the drawbacks of celestial devotion. Conduits have learned to channel divine power more efficiently, reducing the burden of restrictions while maintaining most benefits.`,
        
        playstyle: 'Balanced approach, reduced drawbacks, consistent performance',
        
        strengths: [
          'Devotion restrictions reduced by 50%',
          'Can partially benefit from two devotions simultaneously',
          'Switching devotions during short rest (once per day)',
          'More forgiving playstyle'
        ],
        
        weaknesses: [
          'Devotion benefits reduced by 25%',
          'Ultimate abilities slightly weaker',
          'Less specialized than other specs',
          'Lower peak power'
        ],
        
        keyAbilities: [
          'Efficient Channeling: Devotion restrictions reduced by 50%',
          'Dual Attunement: Gain minor benefits from a second devotion',
          'Flexible Devotion: Switch devotions during short rest (once per day)'
        ],
        
        specPassive: {
          name: 'Conduit\'s Balance',
          description: 'Devotion restrictions reduced by 50%. Devotion benefits reduced by 25%. Can attune to a second devotion at 50% effectiveness. Can switch devotions during one short rest per day.'
        }
      },
      {
        id: 'astral-warrior',
        name: 'Astral Warrior',
        icon: 'spell_arcane_starfire',
        color: '#9370DB',
        theme: 'Combat Flexibility',
        
        description: `The Astral Warrior specialization focuses on tactical devotion switching and combat adaptability. Warriors can change devotions mid-combat, allowing them to respond dynamically to changing battlefield conditions.`,
        
        playstyle: 'Tactical switching, adaptability, resource management',
        
        strengths: [
          'Can switch devotions as a bonus action (costs 1 use)',
          'Start combat with 3 devotion switches available',
          'Switching devotions triggers a burst effect',
          'Ultimate tactical flexibility'
        ],
        
        weaknesses: [
          'Limited switches per combat (3 per long rest)',
          'Devotion benefits reduced by 15%',
          'Ultimate abilities weaker',
          'Requires tactical knowledge'
        ],
        
        keyAbilities: [
          'Combat Attunement: Switch devotions as bonus action (3 uses per long rest)',
          'Devotion Burst: Switching triggers an effect based on new devotion',
          'Astral Mastery: Gain expertise in all devotion mechanics'
        ],
        
        specPassive: {
          name: 'Warrior\'s Versatility',
          description: 'Can switch devotions as a bonus action (3 uses per long rest). Switching devotions triggers a burst effect. Devotion benefits reduced by 15%. Gain tactical insight into enemy weaknesses.'
        }
      }
    ]
  },
  
  // Example Spells - organized by celestial devotion
  exampleSpells: [
    // SOLARA - RADIANT SUN
    {
      id: 'titan_radiant_strike',
      name: 'Radiant Strike',
      description: 'Your melee attacks are infused with the radiant power of the sun, dealing additional radiant damage.',
      spellType: 'PASSIVE',
      icon: 'spell_holy_searinglight',
      school: 'Evocation',
      level: 1,
      specialization: 'solara',

      typeConfig: {
        castTime: 0,
        castTimeType: 'PASSIVE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'permanent'
      },

      resourceCost: {
        mana: 0,
        components: [],
        requirement: 'Devotion to Solara'
      },

      resolution: 'PASSIVE',

      damageConfig: {
        formula: '1d6',
        damageType: 'radiant',
        trigger: 'On melee attack',
        championBonus: '1d6 + 3 (50% increase)'
      },

      effects: {
        damage: {
          ongoing: {
            formula: '1d6',
            type: 'radiant',
            trigger: 'melee_attack',
            championBonus: '+3 damage'
          }
        }
      },

      specialMechanics: {
        devotion: {
          required: 'Solara',
          passive: true,
          championBonus: 'Damage increased by 50%'
        }
      },

      tags: ['passive', 'radiant', 'melee', 'solara', 'titan']
    },

    {
      id: 'titan_solar_flare',
      name: 'Solar Flare',
      description: 'Unleash a burst of solar energy, dealing radiant damage to all enemies within 10 feet and blinding them.',
      spellType: 'ACTION',
      icon: 'spell_fire_twilightflamebreath',
      school: 'Evocation',
      level: 3,
      specialization: 'solara',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet'
        }
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 1
      },

      resourceCost: {
        mana: 0,
        uses: '1 per long rest (2 for Celestial Champion)',
        components: ['verbal', 'somatic'],
        verbalText: 'Solara\'s Radiance!',
        somaticText: 'Raise arms to release solar burst'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d8',
        damageType: 'radiant',
        championBonus: '4d8 + 6'
      },

      debuffConfig: {
        effects: [
          'All enemies within 10 feet are blinded for 1 turn',
          'Blinded creatures have disadvantage on attack rolls',
          'Attack rolls against blinded creatures have advantage'
        ]
      },

      effects: {
        damage: {
          instant: {
            formula: '3d8',
            type: 'radiant',
            aoe: true,
            radius: 10
          }
        },
        debuff: {
          duration: 1,
          effect: 'blinded',
          aoe: true,
          radius: 10
        }
      },

      specialMechanics: {
        devotion: {
          required: 'Solara',
          usesPerLongRest: 1,
          championBonus: '2 uses per long rest, increased damage'
        }
      },

      tags: ['ultimate', 'radiant', 'aoe', 'blind', 'solara', 'titan']
    },

    // LUNARA - MOON GUARDIAN
    {
      id: 'titan_moonlit_resilience',
      name: 'Moonlit Resilience',
      description: 'The moon\'s protective power grants you enhanced armor and regeneration.',
      spellType: 'PASSIVE',
      icon: 'spell_holy_elunesgrace',
      school: 'Abjuration',
      level: 1,
      specialization: 'lunara',

      typeConfig: {
        castTime: 0,
        castTimeType: 'PASSIVE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'permanent'
      },

      resourceCost: {
        mana: 0,
        components: [],
        requirement: 'Devotion to Lunara'
      },

      resolution: 'PASSIVE',

      buffConfig: {
        stats: {
          armorClass: '+2 (+3 for Celestial Champion)'
        },
        effects: [
          'Regenerate 5 HP at start of each turn',
          'Celestial Champion: Regenerate 7 HP at start of each turn',
          'Divine Conduit: Regenerate 4 HP at start of each turn'
        ]
      },

      healingConfig: {
        formula: '5',
        healingType: 'self',
        frequency: 'start_of_turn',
        championBonus: '7 HP per turn'
      },

      effects: {
        buff: {
          permanent: {
            stats: {
              ac: 2,
              championBonus: 3
            }
          }
        },
        healing: {
          ongoing: {
            formula: '5',
            target: 'self',
            frequency: 'start_of_turn',
            championBonus: '7'
          }
        }
      },

      specialMechanics: {
        devotion: {
          required: 'Lunara',
          passive: true,
          championBonus: '+1 AC, +2 HP regen'
        }
      },

      tags: ['passive', 'defense', 'regeneration', 'lunara', 'titan']
    },

    {
      id: 'titan_lunar_shield',
      name: 'Lunar Shield',
      description: 'Create a barrier of moonlight that absorbs damage for all allies within 15 feet.',
      spellType: 'ACTION',
      icon: 'spell_holy_powerwordbarrier',
      school: 'Abjuration',
      level: 3,
      specialization: 'lunara',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 15,
          unit: 'feet'
        }
      },

      durationConfig: {
        durationType: 'until_depleted'
      },

      resourceCost: {
        mana: 0,
        uses: '1 per long rest (2 for Celestial Champion)',
        components: ['verbal', 'somatic'],
        verbalText: 'Lunara\'s Embrace!',
        somaticText: 'Spread arms to create moonlit barrier'
      },

      resolution: 'NONE',

      buffConfig: {
        effects: [
          'All allies within 15 feet gain a shield that absorbs 50 damage',
          'Celestial Champion: Shield absorbs 75 damage',
          'Shield lasts until depleted',
          'Allies can move freely while maintaining shield'
        ]
      },

      effects: {
        shield: {
          instant: {
            formula: '50',
            type: 'absorption',
            aoe: true,
            radius: 15,
            targets: 'allies',
            championBonus: '75'
          }
        }
      },

      specialMechanics: {
        devotion: {
          required: 'Lunara',
          usesPerLongRest: 1,
          championBonus: '2 uses per long rest, 75 damage absorption'
        }
      },

      tags: ['ultimate', 'shield', 'aoe', 'support', 'lunara', 'titan']
    },

    // ASTRAEUS - STAR SAGE
    {
      id: 'titan_celestial_speed',
      name: 'Celestial Speed',
      description: 'The swiftness of the stars enhances your movement and reflexes.',
      spellType: 'PASSIVE',
      icon: 'spell_arcane_blink',
      school: 'Transmutation',
      level: 1,
      specialization: 'astraeus',

      typeConfig: {
        castTime: 0,
        castTimeType: 'PASSIVE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'permanent'
      },

      resourceCost: {
        mana: 0,
        components: [],
        requirement: 'Devotion to Astraeus'
      },

      resolution: 'PASSIVE',

      buffConfig: {
        stats: {
          movementSpeed: '+10 feet (+15 for Celestial Champion)'
        },
        effects: [
          'Advantage on Dexterity saving throws',
          'Increased mobility and evasion',
          'Enhanced positioning capabilities'
        ]
      },

      effects: {
        buff: {
          permanent: {
            stats: {
              movementSpeed: 10,
              championBonus: 15
            },
            savingThrows: {
              dexterity: 'advantage'
            }
          }
        }
      },

      specialMechanics: {
        devotion: {
          required: 'Astraeus',
          passive: true,
          championBonus: '+5 additional movement speed'
        }
      },

      tags: ['passive', 'mobility', 'dexterity', 'astraeus', 'titan']
    },

    {
      id: 'titan_starfall',
      name: 'Starfall',
      description: 'Call down a star to strike a target, dealing massive force damage and stunning them.',
      spellType: 'ACTION',
      icon: 'spell_arcane_starfire',
      school: 'Evocation',
      level: 3,
      specialization: 'astraeus',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 1
      },

      resourceCost: {
        mana: 0,
        uses: '1 per long rest (2 for Celestial Champion)',
        components: ['verbal', 'somatic'],
        verbalText: 'Astraeus, strike from above!',
        somaticText: 'Point to sky then target'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '4d6',
        damageType: 'force',
        championBonus: '6d6'
      },

      debuffConfig: {
        effects: [
          'Target is stunned for 1 turn',
          'Stunned creatures cannot move or take actions',
          'Attacks against stunned creatures have advantage'
        ]
      },

      effects: {
        damage: {
          instant: {
            formula: '4d6',
            type: 'force',
            championBonus: '6d6'
          }
        },
        debuff: {
          duration: 1,
          effect: 'stunned'
        }
      },

      specialMechanics: {
        devotion: {
          required: 'Astraeus',
          usesPerLongRest: 1,
          championBonus: '2 uses per long rest, increased damage'
        }
      },

      tags: ['ultimate', 'force', 'stun', 'single-target', 'astraeus', 'titan']
    },

    // TERRANOX - EARTH TITAN
    {
      id: 'titan_grounded_might',
      name: 'Grounded Might',
      description: 'The strength of the earth flows through you, granting immense durability and resistance.',
      spellType: 'PASSIVE',
      icon: 'spell_nature_stoneskintotem',
      school: 'Abjuration',
      level: 1,
      specialization: 'terranox',

      typeConfig: {
        castTime: 0,
        castTimeType: 'PASSIVE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'permanent'
      },

      resourceCost: {
        mana: 0,
        components: [],
        requirement: 'Devotion to Terranox'
      },

      resolution: 'PASSIVE',

      buffConfig: {
        stats: {
          maxHitPoints: '+20 (+30 for Celestial Champion)'
        },
        effects: [
          'Resistance to bludgeoning damage',
          'Resistance to piercing damage',
          'Resistance to slashing damage',
          'Immovable presence on the battlefield'
        ]
      },

      effects: {
        buff: {
          permanent: {
            stats: {
              maxHp: 20,
              championBonus: 30
            },
            resistances: ['bludgeoning', 'piercing', 'slashing']
          }
        }
      },

      specialMechanics: {
        devotion: {
          required: 'Terranox',
          passive: true,
          championBonus: '+10 additional HP'
        }
      },

      tags: ['passive', 'tank', 'resistance', 'terranox', 'titan']
    },

    {
      id: 'titan_earthquake',
      name: 'Earthquake',
      description: 'Cause the ground to tremble with earth-shaking force, damaging and knocking down all nearby enemies.',
      spellType: 'ACTION',
      icon: 'spell_nature_earthquake',
      school: 'Evocation',
      level: 3,
      specialization: 'terranox',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 20,
          unit: 'feet'
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 0,
        uses: '1 per long rest (2 for Celestial Champion)',
        components: ['somatic'],
        somaticText: 'Slam fist or weapon into ground'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d6',
        damageType: 'bludgeoning',
        championBonus: '5d6'
      },

      debuffConfig: {
        effects: [
          'All enemies within 20 feet are knocked prone',
          'Prone creatures have disadvantage on attack rolls',
          'Melee attacks against prone creatures have advantage',
          'Standing up costs half movement'
        ]
      },

      effects: {
        damage: {
          instant: {
            formula: '3d6',
            type: 'bludgeoning',
            aoe: true,
            radius: 20,
            championBonus: '5d6'
          }
        },
        debuff: {
          instant: {
            effect: 'prone',
            aoe: true,
            radius: 20
          }
        }
      },

      specialMechanics: {
        devotion: {
          required: 'Terranox',
          usesPerLongRest: 1,
          championBonus: '2 uses per long rest, increased damage'
        }
      },

      tags: ['ultimate', 'bludgeoning', 'aoe', 'prone', 'terranox', 'titan']
    },

    // ZEPHYRA - WIND SPIRIT
    {
      id: 'titan_tempest_fury',
      name: 'Tempest Fury',
      description: 'The fury of the wind enhances your attack speed and infuses your strikes with lightning.',
      spellType: 'PASSIVE',
      icon: 'spell_nature_cyclone',
      school: 'Evocation',
      level: 1,
      specialization: 'zephyra',

      typeConfig: {
        castTime: 0,
        castTimeType: 'PASSIVE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'permanent'
      },

      resourceCost: {
        mana: 0,
        components: [],
        requirement: 'Devotion to Zephyra'
      },

      resolution: 'PASSIVE',

      buffConfig: {
        stats: {
          attackSpeed: '+2 (+3 for Celestial Champion)'
        },
        effects: [
          'Melee attacks deal +1d4 lightning damage',
          'Celestial Champion: +1d4 + 2 lightning damage',
          'Increased number of attacks per turn'
        ]
      },

      damageConfig: {
        formula: '1d4',
        damageType: 'lightning',
        trigger: 'On melee attack',
        championBonus: '1d4 + 2'
      },

      effects: {
        buff: {
          permanent: {
            stats: {
              attackSpeed: 2,
              championBonus: 3
            }
          }
        },
        damage: {
          ongoing: {
            formula: '1d4',
            type: 'lightning',
            trigger: 'melee_attack',
            championBonus: '+2 damage'
          }
        }
      },

      specialMechanics: {
        devotion: {
          required: 'Zephyra',
          passive: true,
          championBonus: '+1 attack speed, +2 lightning damage'
        }
      },

      tags: ['passive', 'lightning', 'attack-speed', 'zephyra', 'titan']
    },

    {
      id: 'titan_wind_dash',
      name: 'Wind Dash',
      description: 'Become one with the wind, teleporting across the battlefield and striking with lightning.',
      spellType: 'ACTION',
      icon: 'spell_nature_wispsplode',
      school: 'Conjuration',
      level: 3,
      specialization: 'zephyra',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'teleport',
        rangeDistance: 30,
        areaOfEffect: {
          type: 'RADIUS',
          size: 5,
          unit: 'feet',
          note: 'At destination'
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 0,
        uses: '1 per long rest (2 for Celestial Champion)',
        components: ['somatic'],
        somaticText: 'Dissolve into wind and reform at destination'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d6',
        damageType: 'lightning',
        championBonus: '5d6'
      },

      effects: {
        teleport: {
          instant: {
            distance: 30,
            unit: 'feet'
          }
        },
        damage: {
          instant: {
            formula: '3d6',
            type: 'lightning',
            aoe: true,
            radius: 5,
            location: 'destination',
            championBonus: '5d6'
          }
        }
      },

      specialMechanics: {
        devotion: {
          required: 'Zephyra',
          usesPerLongRest: 1,
          championBonus: '2 uses per long rest, increased damage'
        },
        teleport: {
          distance: 30,
          damageOnArrival: true,
          ignoresOpportunityAttacks: true
        }
      },

      tags: ['ultimate', 'lightning', 'teleport', 'aoe', 'zephyra', 'titan']
    },

    // SPECIALIZATION-SPECIFIC ABILITIES
    {
      id: 'titan_devotion_switch',
      name: 'Combat Attunement',
      description: 'Switch your celestial devotion mid-combat as a bonus action. Only available to Astral Warriors.',
      spellType: 'ACTION',
      icon: 'spell_arcane_prismaticcloak',
      school: 'Transmutation',
      level: 2,
      specialization: 'astral-warrior',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 0,
        uses: '3 per long rest',
        components: ['concentration'],
        requirement: 'Astral Warrior specialization'
      },

      resolution: 'NONE',

      buffConfig: {
        effects: [
          'Switch to a different celestial devotion',
          'Gain new devotion benefits immediately',
          'Lose previous devotion benefits',
          'Triggers a burst effect based on new devotion'
        ]
      },

      effects: {
        devotionSwitch: {
          instant: {
            action: '1 AP (quick action)',
            usesPerLongRest: 3,
            burstEffects: {
              solara: '2d6 radiant damage to nearest enemy',
              lunara: 'Gain 15 temporary HP',
              astraeus: 'Gain +10 feet movement this turn',
              terranox: 'Gain +2 AC until end of turn',
              zephyra: 'Gain advantage on next attack'
            }
          }
        }
      },

      specialMechanics: {
        astralWarrior: {
          exclusive: true,
          usesPerLongRest: 3,
          burstEffect: 'Triggers effect based on new devotion'
        }
      },

      tags: ['utility', 'devotion', 'switching', 'astral-warrior', 'titan']
    }
  ]
};

