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
  damageTypes: ['bludgeoning', 'radiant', 'force'],

  // Overview section
  overview: {
    title: 'The Titan',
    subtitle: 'Celestial Warrior',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: Titans attune each day to one of five celestial beings—Solara, Lunara, Astraeus, Terranox, or Zephyra—gaining their divine powers and a devastating once-per-day ability, but also inheriting their sacred restrictions that demand strategic adaptation.

**Core Mechanic**: Choose Daily Celestial Devotion → Gain Divine Benefits + Once-Per-Day Ultimate → Play Around Meaningful Restrictions

**Resource**: Celestial Devotion (5 beings, chosen at long rest, lasts until next rest)

**Playstyle**: Adaptive devotion-based melee combat

**Best For**: Players who enjoy daily strategic planning, thematic roleplaying, and reshaping their combat role to meet each day's challenges`
    },

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

**Your Action (1 AP)**: "Radiant Smite" (8 mana, Solara-enhanced ability)
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
    
    description: `Each long rest, choose one of five celestial beings to attune to. Gain their divine passive bonuses and a powerful once-per-long-rest ultimate — but also inherit their restriction. Your role changes daily based on your choice.`,
    
    cards: [
      {
        title: 'Devotion Attunement',
        stats: '1/Long Rest',
        details: 'Choose one of five celestial beings at the end of each long rest. Gain their passive, their ultimate, and their restriction for the entire day.'
      },
      {
        title: 'Devotion Swap',
        stats: 'Special Action (Spec-Dependent)',
        details: 'Certain specializations allow switching devotions mid-combat at a cost — usually sacrificing your stored ultimate charge or spending Action Points.'
      },
      {
        title: 'Ultimate Ability',
        stats: '1/Long Rest',
        details: 'Each devotion grants a devastating once-per-rest ultimate. Using it is irreversible until your next long rest. Timing is everything.'
      }
    ],

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
          '+2 Armor, regenerate 5 HP at start of each turn',
          'Lunar Shield: Absorb 50 damage for all allies within 15 feet',
          'Healing received from external sources is halved'
        ],
        [
          'Astraeus (Star Sage)',
          '+10 ft movement, advantage on Agility saves',
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

    usage: {
      momentum: 'Your devotion choice determines your entire combat identity. Solara players are aggressive damage dealers; Lunara players are self-sufficient tanks. Lean into your devotion\'s strength and build your turn economy around it.',
      flourish: 'Save your ultimate for the moment it matters most. A Solar Flare on three clustered enemies is worth far more than a single-target kill. Coordinate with your party — let them set up the positioning before you detonate.'
    },

    overheatRules: {
      title: 'Devotion Fatigue',
      content: `The celestial bond is powerful but finite. Each devotion comes with a built-in tension between power and restriction.

**The Restriction Cost**:
Every devotion carries a drawback that is always active. These are not optional — they are the price of divine favor. Understanding and playing around your restriction is what separates a good Titan from a great one.

**Restriction Counters**:
- **Solara**: Fight in dim light or darkness when possible. Use abilities that extinguish light sources.
- **Lunara**: Don't rely on the healer. Position yourself where you can regenerate safely without external healing dependence.
- **Astraeus**: Prioritize magical enemies. Mundane weapon users exploit your weakness — take them out quickly or avoid prolonged engagements.
- **Terranox**: Accept that you cannot chase. Position at chokepoints and let enemies come to you.
- **Zephyra**: Avoid edges, cliffs, and hazardous terrain. The 10% knockback risk compounds with environmental dangers.

**Ultimate Exhaustion**:
Once your ultimate is spent, you lose your biggest momentum swing for the rest of the day. This creates an interesting strategic arc: early fights have your ultimate available (play aggressively), later fights require you to win through passive bonuses and basic attacks alone (play conservatively).`
    },

    strategicConsiderations: {
      title: 'Choosing & Playing Your Devotion',
      content: `**Before Combat — The Morning Choice**:
Study your anticipated enemies and choose the devotion that best counters them. Fighting undead? Solara's radiant damage is devastating. Facing a boss with big AoE? Lunara's regen and shield keep you alive. Speed-run a dungeon? Astraeus's movement advantage shaves turns off every fight.

**Solara (Offensive Devotion)**:
Radiant damage powerhouse. Accept the advantage-on-you drawback in exchange for melting enemies. Best against undead, shadow creatures, and enemies in well-lit areas (where you'd have disadvantage anyway — might as well deal +1d6). Solar Flare is a clutch AoE finisher — save it for when 3+ enemies are clustered within 10 feet.

**Lunara (Defensive Devotion)**:
Self-sufficient tank. Don't rely on the healer — you regen 5 HP per turn and have +2 Armor. Take aggro and hold the line. Lunar Shield is a massive team-save — 50 damage absorption for all nearby allies can prevent a party wipe from a boss AoE. Use it reactively, not proactively.

**Astraeus (Mobile Devotion)**:
Hit-and-run striker. The +10 ft movement and Agility advantage make you elusive. Starfall's stun is single-target lockdown — use it on the biggest threat to remove them from the fight for a turn. Avoid sustained melee against mundane weapon users (your restriction makes you take +1d6 from non-magical attacks).

**Terranox (Immovable Devotion)**:
The wall. +20 HP and physical resistance make you nearly unkillable by martial enemies. Earthquake's 20-foot knockdown is incredible crowd control. Position at doorways and chokepoints where enemies must approach you. Your speed reduction means you cannot chase — let them come.

**Zephyra (Fast Striker Devotion)**:
The highest sustained DPR devotion. +2 attack speed and +1d4 lightning on every melee hit adds up fast. Wind Dash's teleport + AoE makes you a living blitz. The 10% knockback restriction is manageable — just stay away from edges and hazards. In dangerous terrain, consider swapping to Terranox instead.

**Worked Example — Boss Fight with Unknown Threat Type**:
You chose Solara for the +1d6 radiant. The boss turns out to be a martial fighter with mundane weapons.
- **Your radiant bonus is neutral** (not strong, not weak).
- **Your restriction (advantage on you in bright light) is active** — but the boss uses mundane attacks, not light-dependent ones.
- **Adapt**: Play around your restriction by fighting in shadows when possible. Save Solar Flare for when adds spawn — it shines against groups, not single targets.
- **Lesson**: If you knew it was a martial boss, Astraeus or Terranox would have been the better pick. Information is your most valuable resource.`
    },

    playingInPerson: {
      title: 'Playing Titan In Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `A set of devotion cards transforms each morning into a meaningful ritual. The physical act of choosing your celestial patron grounds the roleplay and keeps your mechanics visible to the whole table.

**Required Materials**:
- **5 Devotion Cards** — Index cards or printed cards, one per celestial being (Solara, Lunara, Astraeus, Terranox, Zephyra). Each card shows: passive benefits, ultimate ability, and restriction.
- **Ultimate Token** — A coin or token (heads = available, tails = spent).
- **Restriction Sticky Note** — A small note with your current restriction written on it, placed visibly on the table.

**The Morning Ritual**:
1. Announce your devotion choice to the table.
2. Place the chosen devotion card face-up in front of you.
3. Set the ultimate token to heads (available).
4. Write your restriction on the sticky note and place it where allies can see it.

**Quick Reference**:
\`\`\`
CELESTIAL DEVOTIONS:
  Solara   | +1d6 radiant melee | Solar Flare (AoE blind) | Adv. on you in bright light
  Lunara   | +2 Armor, 5 HP/turn | Lunar Shield (50 absorb) | Healing halved
  Astraeus | +10ft move, Agi adv | Starfall (stun target)  | +1d6 from non-magic
  Terranox | +20 HP, phys resist | Earthquake (20ft prone) | -10ft speed
  Zephyra  | +2 atk speed, +1d4 | Wind Dash (teleport AoE) | 10% knockback risk

ULTIMATE: 1/Long Rest (irreversible until next rest)
\`\`\`

**The Physical Hacks**:
- **The Devotion Deck**: Keep all 5 cards in a small deck box. Each morning, dramatically draw your choice. Other players will start anticipating which devotion you'll pick based on the encounter.
- **Restriction Token on Mini**: Place a small colored token on your miniature to remind everyone (including yourself) of your active restriction. Red for Solara, blue for Lunara, purple for Astraeus, brown for Terranox, white for Zephyra.
- **Ultimate Countdown**: When you use your ultimate, flip the token and place it on the devotion card. It serves as a visual reminder that your biggest swing is gone for the day.

**Pro Tips**:
- Discuss devotion choices with your party during rests. "I'm thinking Solara for the undead — anyone need me to go Lunara instead for the tanking?"
- If your DM allows, keep a "Notes" section on each devotion card to track which encounters you've used that devotion for and how it performed.
- The restriction sticky note isn't just for you — it lets the healer know not to waste heals on Lunara you, or lets the rogue know you can't chase with Terranox.`
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
        icon: 'Radiant/Radiant Bolt',
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
        icon: 'Radiant/Divine Radiance',
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
        icon: 'Arcane/Missile',
        color: '#9370DB',
        theme: 'Combat Flexibility',
        
        description: `The Astral Warrior specialization focuses on tactical devotion switching and combat adaptability. Warriors can change devotions mid-combat, allowing them to respond dynamically to changing battlefield conditions.`,
        
        playstyle: 'Tactical switching, adaptability, resource management',
        
        strengths: [
          'Can switch devotions for 1 AP (costs 1 use)',
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
          'Combat Attunement: Switch devotions for 1 AP (3 uses per long rest)',
          'Devotion Burst: Switching triggers an effect based on new devotion',
          'Astral Mastery: Gain expertise in all devotion mechanics'
        ],
        
        specPassive: {
          name: 'Warrior\'s Versatility',
          description: 'Can switch devotions for 1 AP (3 uses per long rest). Switching devotions triggers a burst effect. Devotion benefits reduced by 15%. Gain tactical insight into enemy weaknesses.'
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
      icon: 'Radiant/Radiant Beam',
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
        elementType: 'radiant',
        damageType: 'bonus',
        trigger: 'On melee attack',
        championBonus: '1d6 + 3 (50% increase)'
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
      icon: 'Fire/Dragon Breath',
      school: 'Evocation',
      level: 3,
      specialization: 'solara',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
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
        elementType: 'radiant',
        damageType: 'area',
        championBonus: '4d8 + 6'
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        effects: [{
          id: 'blinded',
          name: 'Blinded',
          description: 'Blinded creatures have disadvantage on attack rolls and attacks against them have advantage - cannot see, automatically fails sight-based checks',
          statusType: 'blinded',
          level: 'moderate',
          statPenalty: [{ stat: 'attack', value: -99, magnitudeType: 'disadvantage' }],
          mechanicsText: 'Disadvantage on attack rolls, auto-fail sight checks'
        }]
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
      icon: 'Nature/Ethereal Bird',
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
          armor: '+2 (+3 for Celestial Champion)'
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
          championBonus: '+1 Armor, +2 HP regen'
        }
      },

      tags: ['passive', 'defense', 'regeneration', 'lunara', 'titan']
    },

    {
      id: 'titan_lunar_shield',
      name: 'Lunar Shield',
      description: 'Create a barrier of moonlight that absorbs damage for all allies within 15 feet.',
      spellType: 'ACTION',
      icon: 'Force/Force Field',
      school: 'Abjuration',
      level: 3,
      specialization: 'lunara',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 15,
          unit: 'feet'
        }
      },

      durationConfig: {
        durationType: 'concentration'
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
        effects: [{
          id: 'lunar_shield_absorption',
          name: 'Lunar Shield',
          description: 'All allies within 15 feet gain a shield that absorbs damage.',
          shieldValue: {
            formula: '50',
            shieldType: 'absorption',
            championBonus: '75'
          },
          mechanicsText: 'Shield absorbs up to 50 damage (75 for Celestial Champion). Lasts until depleted.'
        }]
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
      icon: 'Arcane/Quick Step',
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
          'Advantage on Agility saving throws',
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
              agility: 'advantage'
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

      tags: ['passive', 'mobility', 'agility', 'astraeus', 'titan']
    },

    {
      id: 'titan_starfall',
      name: 'Starfall',
      description: 'Call down a star to strike a target, dealing massive force damage and stunning them.',
      spellType: 'ACTION',
      icon: 'Arcane/Missile',
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
        debuffType: 'statusEffect',
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        effects: [{
          id: 'stunned',
          name: 'Stunned',
          description: 'Stunned creatures cannot move or take actions - cannot act or move for the duration',
          statusType: 'stunned',
          level: 'moderate',
          mechanicsText: 'Cannot move or take actions for the duration'
        }]
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

      tags: ['ultimate', 'force', 'stun', 'single target', 'astraeus', 'titan']
    },

    // TERRANOX - EARTH TITAN
    {
      id: 'titan_grounded_might',
      name: 'Grounded Might',
      description: 'The strength of the earth flows through you, granting immense durability and resistance.',
      spellType: 'PASSIVE',
      icon: 'Nature/Earth Shield',
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
      icon: 'Nature/Earth Shatter',
      school: 'Evocation',
      level: 3,
      specialization: 'terranox',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
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
        debuffType: 'statusEffect',
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        effects: [{
          id: 'prone',
          name: 'Prone',
          description: 'Knocked to the ground - disadvantage on attacks, advantage against melee, half movement to stand',
          statusType: 'prone',
          level: 'moderate',
          statPenalty: [{ stat: 'attack', value: -99, magnitudeType: 'disadvantage' }, { stat: 'movement_speed', value: -50, magnitudeType: 'percentage' }],
          mechanicsText: 'Disadvantage on attacks, advantage vs melee, half movement to stand'
        }]
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
      icon: 'Nature/Tornado Vortex',
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

      tags: ['passive', 'lightning', 'attack speed', 'zephyra', 'titan']
    },

    {
      id: 'titan_wind_dash',
      name: 'Wind Dash',
      description: 'Become one with the wind, teleporting across the battlefield and striking with lightning.',
      spellType: 'ACTION',
      icon: 'Nature/Nature Wild 1',
      school: 'Conjuration',
      level: 3,
      specialization: 'zephyra',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
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
      description: 'Switch your celestial devotion mid-combat for 1 AP. Only available to Astral Warriors.',
      spellType: 'ACTION',
      icon: 'Arcane/Ebon Blaze',
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
              terranox: 'Gain +2 Armor until end of turn',
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

      tags: ['utility', 'devotion', 'switching', 'astral warrior', 'titan']
    },

    // ========================================
    // LEVEL 4 SPELLS
    // ========================================
    {
      id: 'titan_celestial_strike',
      name: 'Celestial Strike',
      description: 'Channel celestial energy into a devastating melee strike that deals damage based on your devotion.',
      level: 4,
      spellType: 'ACTION',
      icon: 'Radiant/Divine Downward Sword',

      typeConfig: {
        school: 'evocation',
        icon: 'Radiant/Divine Downward Sword',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 15 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Weapon strike infused with celestial power'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '4d8 + strength + devotion_bonus',
        elementType: 'varies_by_devotion',
        damageType: 'direct'
      },

      specialMechanics: {
        devotionVariants: {
          solara: { element: 'radiant', bonus: '+2d6 fire' },
          lunara: { element: 'frost', bonus: '+2d6 healing to self' },
          astraeus: { element: 'force', bonus: 'Extra attack if target dies' },
          terranox: { element: 'bludgeoning', bonus: 'Knockback 10 feet' },
          zephyra: { element: 'lightning', bonus: 'Chain to nearby enemy' }
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['damage', 'melee', 'devotion', 'level 4', 'titan']
    },

    {
      id: 'titan_celestial_armor',
      name: 'Celestial Armor',
      description: 'Summon celestial armor around yourself, gaining significant damage reduction and resistances.',
      level: 4,
      spellType: 'ACTION',
      icon: 'Force/Force Field',

      typeConfig: {
        school: 'abjuration',
        icon: 'Force/Force Field',
        castTime: 1,
        castTimeType: 'BONUS'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 16 },
        actionPoints: 0,
        components: ['verbal'],
        verbalText: 'Armor of the stars!'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'armor',
        effects: [{
          id: 'celestial_armor',
          name: 'Celestial Armor',
          description: '+4 Armor and resistance to your devotion\'s damage type',
          statModifier: { stat: 'armor', magnitude: 4, magnitudeType: 'flat' },
          mechanicsText: '+4 Armor and resistance to devotion damage type'
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['buff', 'armor', 'protection', 'level 4', 'titan']
    },

    {
      id: 'titan_divine_challenge',
      name: 'Divine Challenge',
      description: 'Issue a divine challenge to an enemy. They must attack you or suffer radiant damage.',
      level: 4,
      spellType: 'ACTION',
      icon: 'Necrotic/Blood Scroll',

      typeConfig: {
        school: 'enchantment',
        icon: 'Necrotic/Blood Scroll',
        castTime: 1,
        castTimeType: 'BONUS'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 12 },
        actionPoints: 0,
        components: ['verbal'],
        verbalText: 'Face me, coward!'
      },

      resolution: 'NONE',
      effectTypes: ['debuff', 'control'],

      debuffConfig: {
        debuffType: 'taunt',
        effects: [{
          id: 'divine_challenge',
          name: 'Divine Challenge',
          description: 'Target must attack you. If they attack someone else, they take radiant damage.',
          damageFormula: '3d6',
          mechanicsText: 'Must attack caster or take 3d6 radiant damage',
          dotFormula: '3d6',
          dotDamageType: 'radiant'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 15,
        saveType: 'spirit',
        saveOutcome: 'negates'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['debuff', 'taunt', 'control', 'level 4', 'titan']
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    {
      id: 'titan_solar_inferno',
      name: 'Solar Flare',
      description: 'Release a burst of solar energy, dealing fire and radiant damage to all nearby enemies.',
      level: 5,
      spellType: 'ACTION',
      icon: 'Fire/Fiery Symbol',

      typeConfig: {
        school: 'evocation',
        icon: 'Fire/Fiery Symbol',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 18 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'Solara, ignite!'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '6d8 + strength',
        elementType: 'radiant',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 15,
          saveOutcome: 'halves'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['damage', 'aoe', 'radiant', 'solara', 'level 5', 'titan']
    },

    {
      id: 'titan_lunar_sanctuary',
      name: 'Lunar Shield',
      description: 'Create a shield of moonlight that protects allies and heals them over time.',
      level: 5,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Bolt',

      typeConfig: {
        school: 'abjuration',
        icon: 'Radiant/Radiant Bolt',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 15 },
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 20 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Lunara, protect us!',
        somaticText: 'Raise hand to moon'
      },

      resolution: 'DICE',
      effectTypes: ['buff', 'healing'],

      buffConfig: {
        buffType: 'shield',
        effects: [{
          id: 'lunar_shield',
          name: 'Lunar Shield',
          description: '+3 Armor and regeneration',
          statModifier: {
            stat: 'armor',
            magnitude: 3,
            magnitudeType: 'flat'
          },
          mechanicsText: '+3 Armor and 2d6 HP regeneration per round'
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: true
      },

      healingConfig: {
        formula: '2d6',
        healingType: 'hot',
        hasHotEffect: true,
        hotFormula: '2d6',
        hotDuration: 4,
        hotTickType: 'round'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['buff', 'healing', 'protection', 'lunara', 'level 5', 'titan']
    },

    {
      id: 'titan_meteor_strike',
      name: 'Starfall',
      description: 'Call down a meteor of starlight on an area, dealing massive force damage.',
      level: 5,
      spellType: 'ACTION',
      icon: 'Arcane/Magical Sword',

      typeConfig: {
        school: 'evocation',
        icon: 'Arcane/Magical Sword',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 90,
        aoeShape: 'circle',
        aoeParameters: { radius: 15 }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 20 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Stars, fall!',
        somaticText: 'Point at sky then ground'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '8d6 + strength',
        elementType: 'force',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 16,
          saveOutcome: 'halves'
        }
      },

      controlConfig: {
        controlType: 'knockdown',
        strength: 'moderate',
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 16,
        saveType: 'strength',
        savingThrow: true,
        effects: [{
          id: 'knocked_prone',
          name: 'Prone',
          description: 'Knocked prone by meteor impact'
        }]
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['damage', 'aoe', 'force', 'astraeus', 'level 5', 'titan']
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    {
      id: 'titan_tectonic_upheaval',
      name: 'Earthquake',
      description: 'Cause the ground to shake violently, knocking enemies prone and creating difficult terrain.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Nature/Earth Shatter',

      typeConfig: {
        school: 'evocation',
        icon: 'Nature/Earth Shatter',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 22 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Terranox, shake the earth!',
        somaticText: 'Stomp ground'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '8d6 + strength',
        elementType: 'bludgeoning',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 16,
          saveOutcome: 'halves'
        }
      },

      controlConfig: {
        controlType: 'knockdown',
        strength: 'strong',
        duration: 0,
        durationUnit: 'instant',
        saveDC: 16,
        saveType: 'strength',
        savingThrow: true,
        effects: [{
          id: 'prone',
          name: 'Prone',
          description: 'Enemies are knocked prone'
        }]
      },

      zoneConfig: {
        duration: 3,
        durationUnit: 'rounds',
        effects: ['difficult_terrain'],
        movable: false
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['damage', 'control', 'zone', 'terranox', 'level 6', 'titan']
    },

    {
      id: 'titan_lightning_storm',
      name: 'Lightning Storm',
      description: 'Summon a storm of lightning that strikes multiple enemies and increases your attack speed.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Lightning/Lightning Bolt',

      typeConfig: {
        school: 'evocation',
        icon: 'Lightning/Lightning Bolt',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 24 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'Zephyra, storm!'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'buff'],

      damageConfig: {
        formula: '8d6 + strength',
        elementType: 'lightning',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 17,
          saveOutcome: 'halves'
        }
      },

      buffConfig: {
        buffType: 'haste',
        effects: [{
          id: 'storm_speed',
          name: 'Storm Speed',
          description: 'Gain an extra attack this turn',
          mechanicsText: 'Gain an extra attack this turn'
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['damage', 'aoe', 'lightning', 'zephyra', 'level 6', 'titan']
    },

    {
      id: 'titan_celestial_convergence',
      name: 'Celestial Convergence',
      description: 'Combine the power of two devotions temporarily, gaining benefits from both.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Arcane/Ebon Blaze',

      typeConfig: {
        school: 'transmutation',
        icon: 'Arcane/Ebon Blaze',
        castTime: 1,
        castTimeType: 'BONUS'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 22 },
        actionPoints: 0,
        components: ['verbal'],
        verbalText: 'Celestials, converge!'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'dual_devotion',
        effects: [{
          id: 'celestial_convergence',
          name: 'Celestial Convergence',
          description: 'Gain benefits from your current devotion AND one other of your choice',
          mechanicsText: 'Gain benefits from current devotion AND one other of your choice'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['buff', 'devotion', 'dual', 'level 6', 'titan']
    },

    // ========================================
    // LEVEL 7 SPELLS
    // ========================================
    {
      id: 'titan_avatar_of_solara',
      name: 'Avatar of Solara',
      description: 'Transform into an avatar of the radiant sun, gaining immense fire and radiant powers.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Fire/Enveloping Fire',

      typeConfig: {
        school: 'transmutation',
        icon: 'Fire/Enveloping Fire',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 28 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'SOLARA, EMBODY ME!'
      },

      resolution: 'NONE',
      effectTypes: ['transformation'],

      transformationConfig: {
        transformType: 'celestial',
        formName: 'Avatar of Solara',
        formDescription: 'You become wreathed in solar flames.',
        duration: 5,
        durationUnit: 'rounds',
        statModifiers: [
          { stat: 'damage', magnitude: '2d6 fire', magnitudeType: 'dice' },
          { stat: 'armor', magnitude: 2, magnitudeType: 'flat' }
        ],
        resistances: [
          { type: 'fire', resistanceAmount: 'immunity' }
        ],
        specialAbilities: [{
          name: 'Burning Aura',
          description: 'Enemies within 10 feet take fire damage at start of their turn',
          damageFormula: '2d6'
        }],
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 6
      },

      tags: ['transformation', 'solara', 'fire', 'level 7', 'titan']
    },

    {
      id: 'titan_lunara_blessing',
      name: "Lunara's Blessing",
      description: 'Receive the full blessing of the moon, gaining massive regeneration and protective powers.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Healing/Renewal',

      typeConfig: {
        school: 'evocation',
        icon: 'Healing/Renewal',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 28 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Lunara, bless us!',
        somaticText: 'Arms raised to moon'
      },

      resolution: 'DICE',
      effectTypes: ['healing', 'buff'],

      healingConfig: {
        formula: '4d10 + strength',
        healingType: 'direct',
        hasHotEffect: true,
        hotFormula: '3d6',
        hotDuration: 5,
        hotTickType: 'round'
      },

      buffConfig: {
        buffType: 'regeneration',
        effects: [{
          id: 'lunara_blessing',
          name: "Lunara's Blessing",
          description: 'All allies gain +3 Armor and regenerate HP each turn',
          statModifier: { stat: 'armor', magnitude: 3, magnitudeType: 'flat' },
          mechanicsText: '+3 Armor and HP regen each turn for all allies'
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['healing', 'buff', 'lunara', 'level 7', 'titan']
    },

    {
      id: 'titan_meteor_swarm',
      name: 'Meteor Swarm',
      description: 'Call down a barrage of meteors from the stars, devastating a massive area.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Fire/Fiery Comet',

      typeConfig: {
        school: 'evocation',
        icon: 'Fire/Fiery Comet',
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'ranged',
        rangeDistance: 120,
        maxTargets: 4,
        aoeShape: 'circle',
        aoeParameters: { radius: 15 }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 28 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Astraeus, meteors!',
        somaticText: 'Pull stars from sky'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '12d6 + strength',
        elementType: 'force',
        damageType: 'area',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 17,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        specialRules: 'Each point can be targeted separately. Areas can overlap for stacking damage.',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2.5,
          extraDice: '4d6',
          critEffects: ['stun']
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['damage', 'aoe', 'astraeus', 'level 7', 'titan']
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    {
      id: 'titan_mountain_fortress',
      name: 'Mountain Fortress',
      description: 'Transform into an immovable mountain fortress, becoming nearly invulnerable.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Nature/Roots',

      typeConfig: {
        school: 'transmutation',
        icon: 'Nature/Roots',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 30 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'TERRANOX, FORTRESS!'
      },

      resolution: 'NONE',
      effectTypes: ['transformation'],

      transformationConfig: {
        transformType: 'elemental',
        formName: 'Mountain Fortress',
        formDescription: 'You become a living mountain of stone.',
        duration: 3,
        durationUnit: 'rounds',
        statModifiers: [
          { stat: 'armor', magnitude: 10, magnitudeType: 'flat' },
          { stat: 'damage_reduction', magnitude: 10, magnitudeType: 'flat' }
        ],
        resistances: [
          { type: 'physical', resistanceAmount: 'resistance' },
          { type: 'fire', resistanceAmount: 'resistance' },
          { type: 'frost', resistanceAmount: 'resistance' }
        ],
        specialAbilities: [{
          name: 'Immovable',
          description: 'Cannot be moved, knocked prone, or teleported against your will'
        }],
        restrictions: ['Cannot move', 'Disadvantage on Agility checks'],
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 6
      },

      tags: ['transformation', 'terranox', 'defense', 'level 8', 'titan']
    },

    {
      id: 'titan_storm_lord',
      name: 'Storm Lord',
      description: 'Become the lord of storms, commanding lightning and wind to devastate enemies.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Lightning/Thunder',

      typeConfig: {
        school: 'evocation',
        icon: 'Lightning/Thunder',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 32 },
        actionPoints: 3,
        components: ['verbal'],
        verbalText: 'ZEPHYRA, STORM LORD!'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '10d8 + strength',
        elementType: 'lightning',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 18,
          saveOutcome: 'halves'
        }
      },

      controlConfig: {
        controlType: 'stun',
        strength: 'strong',
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'constitution',
        savingThrow: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['damage', 'control', 'lightning', 'zephyra', 'level 8', 'titan']
    },

    {
      id: 'titan_celestial_judgment',
      name: 'Celestial Judgment',
      description: 'Call upon all celestials to pass judgment on an enemy, dealing massive damage.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Warrior',

      typeConfig: {
        school: 'evocation',
        icon: 'Radiant/Radiant Warrior',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 90,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 30 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'CELESTIALS, JUDGE THIS ONE!'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '14d6 + strength',
        elementType: 'radiant',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'spirit',
          difficultyClass: 19,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        bonusEffects: 'Deals double damage to undead and fiends',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 3.0,
          extraDice: '6d10',
          critEffects: ['divine_smite', 'stun']
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['damage', 'radiant', 'single target', 'level 8', 'titan']
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    {
      id: 'titan_celestial_avatar',
      name: 'Celestial Avatar',
      description: 'Transform into a full celestial avatar, gaining the ultimate power of your devotion.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Radiant/Divine Illumination',

      typeConfig: {
        school: 'transmutation',
        icon: 'Radiant/Divine Illumination',
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 35 },
        actionPoints: 3,
        components: ['verbal'],
        verbalText: 'I BECOME THE CELESTIAL!'
      },

      resolution: 'NONE',
      effectTypes: ['transformation'],

      transformationConfig: {
        transformType: 'celestial',
        formName: 'Celestial Avatar',
        formDescription: 'You become one with your chosen celestial, gaining godlike power.',
        duration: 5,
        durationUnit: 'rounds',
        statModifiers: [
          { stat: 'all', magnitude: 5, magnitudeType: 'flat' },
          { stat: 'armor', magnitude: 5, magnitudeType: 'flat' },
          { stat: 'damage', magnitude: 50, magnitudeType: 'percentage' }
        ],
        resistances: [
          { type: 'all', resistanceAmount: 'resistance' }
        ],
        specialAbilities: [{
          name: 'Avatar Power',
          description: 'All devotion abilities are enhanced. Can fly. Immune to fear and charm.'
        }],
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['transformation', 'ultimate', 'devotion', 'level 9', 'titan']
    },

    {
      id: 'titan_celestial_bombardment',
      name: 'Celestial Bombardment',
      description: 'Call down a devastating bombardment from all celestials simultaneously.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Glow',

      typeConfig: {
        school: 'evocation',
        icon: 'Radiant/Radiant Glow',
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 120,
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 36 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'ALL CELESTIALS, STRIKE!',
        somaticText: 'Raise weapon to sky'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d6 radiant + 3d6 fire + 3d6 lightning + 3d6 cold + 3d6 force + strength',
        elementType: 'mixed',
        damageType: 'area',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 20,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 3.5,
          extraDice: '3d10 per element',
          critEffects: ['elemental_overload', 'stun']
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['damage', 'aoe', 'ultimate', 'level 9', 'titan']
    },

    {
      id: 'titan_divine_protection',
      name: 'Divine Protection',
      description: 'Grant divine protection to all allies, making them immune to damage for a brief time.',
      level: 9,
      spellType: 'REACTION',
      icon: 'Force/Force Field',

      typeConfig: {
        school: 'abjuration',
        icon: 'Force/Force Field',
        castTime: 1,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 35 },
        actionPoints: 0,
        components: ['verbal'],
        verbalText: 'CELESTIALS, PROTECT US!'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'invulnerability',
        effects: [{
          id: 'divine_protection',
          name: 'Divine Protection',
          description: 'All allies are immune to damage until start of your next turn',
          mechanicsText: 'All allies immune to damage until start of your next turn',
          damageImmunity: ['all']
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['buff', 'protection', 'reaction', 'level 9', 'titan']
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    {
      id: 'titan_celestial_fusion',
      name: 'Celestial Fusion',
      description: 'Fuse with all celestials at once, becoming an avatar of cosmic power.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Radiant/Divine Radiance',

      typeConfig: {
        school: 'transmutation',
        icon: 'Radiant/Divine Radiance',
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 40 },
        actionPoints: 3,
        components: ['verbal'],
        verbalText: 'ALL CELESTIALS, FUSE WITH ME!'
      },

      resolution: 'NONE',
      effectTypes: ['transformation'],

      transformationConfig: {
        transformType: 'divine',
        formName: 'Celestial Fusion',
        formDescription: 'You become one with all five celestials - the ultimate form of cosmic power.',
        duration: 3,
        durationUnit: 'rounds',
        statModifiers: [
          { stat: 'all', magnitude: 10, magnitudeType: 'flat' },
          { stat: 'armor', magnitude: 10, magnitudeType: 'flat' },
          { stat: 'maxHp', magnitude: 100, magnitudeType: 'temporary' }
        ],
        resistances: [
          { type: 'all', resistanceAmount: 'immunity' }
        ],
        specialAbilities: [
          { name: 'Solara\'s Wrath', description: 'All attacks deal bonus fire damage', damageFormula: '+4d6' },
          { name: 'Lunara\'s Grace', description: 'Regenerate 20 HP per turn' },
          { name: 'Astraeus\'s Speed', description: 'Gain an extra action each turn' },
          { name: 'Terranox\'s Might', description: 'Cannot be moved or knocked prone' },
          { name: 'Zephyra\'s Fury', description: 'Lightning strikes nearby enemies each turn' }
        ],
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['transformation', 'ultimate', 'all celestials', 'level 10', 'titan']
    },

    {
      id: 'titan_apocalypse',
      name: 'Apocalypse',
      description: 'Unleash the full destructive power of the celestials, devastating everything in a massive area.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Fire/Rising Inferno',

      typeConfig: {
        school: 'evocation',
        icon: 'Fire/Rising Inferno',
        castTime: 3,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 100 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 40 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'APOCALYPSE!',
        somaticText: 'Release all power'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '22d6 + strength',
        elementType: 'mixed',
        damageType: 'area',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 22,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 4.0,
          extraDice: '10d10',
          critEffects: ['apocalyptic_devastation', 'stun', 'terrain_destruction']
        }
      },

      specialMechanics: {
        apocalypse: {
          description: 'The battlefield is devastated. All enemies take 22d6 + strength mixed damage. Terrain is transformed into difficult terrain.',
          aftermath: 'Creates difficult terrain in the entire area for 1 hour'
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['damage', 'aoe', 'ultimate', 'level 10', 'titan']
    },

    {
      id: 'titan_celestial_rebirth',
      name: 'Celestial Rebirth',
      description: 'Call upon the celestials to revive all fallen allies and fully restore the party.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Healing/Ressusitate',

      typeConfig: {
        school: 'necromancy',
        icon: 'Healing/Ressusitate',
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 60 },
        targetRestrictions: ['ally', 'dead']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 40 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'CELESTIALS, GRANT REBIRTH!',
        somaticText: 'Arms raised in prayer'
      },

      resolution: 'NONE',
      effectTypes: ['healing', 'restoration'],

      healingConfig: {
        formula: 'max_hp',
        healingType: 'resurrection',
        hasHotEffect: false
      },

      specialMechanics: {
        rebirth: {
          description: 'All fallen allies within range are resurrected at full HP. All living allies are fully healed and cleansed of all negative conditions.',
          additionalEffect: 'All allies gain +5 to all stats for 10 minutes'
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['healing', 'resurrection', 'ultimate', 'level 10', 'titan']
    }
  ]
};

