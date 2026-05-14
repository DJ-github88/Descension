/**
 * Bladedancer Class Data
 *
 * Complete class information for the Bladedancer - a martial artist who flows
 * between combat stances, building Momentum and earning Flourish through mastery.
 */

export const BLADEDANCER_DATA = {
  id: "bladedancer",
  name: "Bladedancer",
  icon: "fas fa-wind",
  role: "Damage",
  damageTypes: ["slashing", "piercing"],

  // Overview section
  overview: {
    title: "The Bladedancer",
    subtitle: "Master of Combat Stances",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Bladedancer flows between 6 interconnected combat stances (Flowing Water, Striking Serpent, Whirling Wind, Rooted Stone, Dancing Blade, Shadow Step), each offering unique abilities and passive effects. You build Momentum through attacks and spend it to transition between stances and activate abilities. Performing signature moves in each stance earns Flourish tokens for ultimate abilities.

**Core Mechanic**: Attack → Build Momentum → Transition between stances → Adapt to combat → Earn Flourish → Unleash ultimates

**Resources**: Momentum (0-20, builds/decays during combat) & Flourish (persistent mastery tokens)

**Playstyle**: Adaptive melee combatant, stance-based tactics, high mobility, rewards skillful transitions

**Best For**: Players who enjoy tactical positioning, adaptive combat, and mastering complex interconnected systems`,
    },

    description: `The Bladedancer is a martial artist who flows seamlessly between combat stances, adapting to any situation with grace and precision. Through the Momentum & Flourish system, they build combat rhythm and earn mastery tokens, unlocking devastating abilities as they dance through battle.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `Bladedancers are martial artists who have dedicated their lives to perfecting the art of combat through fluid movement and stance mastery. They view fighting as a dance—a flowing sequence of movements where each stance leads naturally into the next. Their philosophy emphasizes adaptability, grace under pressure, and the pursuit of martial perfection.

Unlike rigid martial traditions that focus on a single style, Bladedancers study multiple fighting forms and learn to transition seamlessly between them. They understand that true mastery comes not from perfecting one stance, but from knowing when and how to flow between many.

In roleplay, Bladedancers often embody:
- **The Wandering Duelist**: Traveling the world to test their skills against worthy opponents
- **The Monastery Exile**: Cast out for refusing to limit themselves to a single fighting style
- **The Dance Warrior**: Trained in both combat and performance arts, blending the two seamlessly
- **The Adaptive Survivor**: Learned to flow between styles out of necessity in brutal conflicts
- **The Style Collector**: Seeks out masters of different fighting forms to add to their repertoire

Bladedancers carry themselves with fluid grace even outside of combat. They move with purpose and economy of motion, and many practice their stance transitions as meditation. Some mark their mastery of each stance with tattoos, scars, or ritual symbols.

**Philosophy**: "Combat is a dance. Every stance is a step. Every strike is a note. Master the rhythm, and victory flows like water."`,
    },

    combatRole: {
      title: "Combat Role",
      content: `The Bladedancer is a versatile melee damage dealer who excels at:

**Adaptive Combat**: Switch between offensive, defensive, and utility stances to match the situation
**High Mobility**: Natural speed bonuses and stance-based movement abilities
**Sustained Damage**: Build Momentum through consistent attacks and spend it on powerful abilities
**Tactical Flexibility**: Each stance offers different passive effects and active abilities
**Mastery Rewards**: Earn Flourish tokens through signature moves for ultimate abilities

**Strengths**:
- Exceptional adaptability through 6 different combat stances
- High sustained damage output with Momentum scaling
- Strong mobility and repositioning capabilities
- Versatile toolkit covering offense, defense, and utility
- Rewards skillful play and stance management

**Weaknesses**:
- Requires understanding of stance network and transition paths
- Must build Momentum from 0 at start of each combat
- Stance transitions cost Momentum, limiting ability usage
- Less effective when unable to attack and build Momentum
- Complexity requires planning and tactical awareness

The Bladedancer shines in dynamic combats where they can build Momentum through consistent attacks and adapt their stance to counter enemy tactics.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing a Bladedancer is about reading the flow of combat and adapting your stance to match the situation. Key strategic considerations:

**Stance Network Navigation**:
- **Flowing Water** (Start): Defensive/evasive, transitions to Striking Serpent, Shadow Step, or Dancing Blade
- **Striking Serpent**: Offensive/precision, transitions to Whirling Wind, Rooted Stone, or Flowing Water
- **Whirling Wind**: AoE/multi-target, transitions to Dancing Blade or Rooted Stone
- **Rooted Stone**: Defensive/counter, transitions to Striking Serpent or Flowing Water
- **Dancing Blade** (Hub): Balanced/versatile, can transition to ANY stance (costs 4 Momentum)
- **Shadow Step**: Stealth/burst, transitions to Striking Serpent or Dancing Blade

**Momentum Management**:
- Build: +1 per hit, +2 per crit, +1 per dodge/parry
- Decay: -1 per miss or taking damage
- Spend: 2-4 for stance changes, 3-6 for abilities
- Strategy: Maintain 6+ Momentum for tactical flexibility

**Flourish Economy**:
- Earn 1 token per stance signature move
- Persist between combats (no decay)
- Spend 2-5 on ultimate abilities
- Strategy: Master all stances to maximize Flourish generation

**Specialization Synergies**:
- **Flow Master**: Rapid transitions (-1 Momentum cost), combo chains, flow-focused
- **Duelist**: Precision strikes, counter-attacks, defensive mastery
- **Shadow Dancer**: Stealth, burst damage, Shadow Step specialization

**Combat Flow**:
- **Opening**: Start in Flowing Water, build Momentum with safe attacks
- **Mid-Combat**: Transition to offensive stances (Striking Serpent, Whirling Wind) when Momentum is high
- **Defensive**: Fall back to Rooted Stone or Flowing Water when under pressure
- **Finishing**: Use Dancing Blade as hub to reach any stance, spend Flourish on ultimates

**Team Dynamics**:
- Works well with tanks who can protect while building Momentum
- Synergizes with supports who provide attack speed or damage buffs
- Benefits from crowd control that allows safe Momentum building
- Can adapt stance to fill gaps in team composition (tank, DPS, or utility)`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Duel at Crimson Bridge",
      content: `**The Setup**: You face a rival duelist on a narrow bridge. He's a brute—all power, no finesse. You'll show him what true mastery looks like.

**Starting State**: Stance: Flowing Water | Momentum: 0 | Flourish: 2 tokens

**Turn 1 - Reading the Opponent (Momentum: 0 → 3)**

*You settle into Flowing Water stance—feet shoulder-width apart, blade held loosely, body relaxed. Your opponent charges.*

Enemy attacks → You dodge (Flowing Water passive: +2 Dodge) → You follow up with Momentum Strike!
**Momentum**: +1 (now at 1)

Second attack → Hit with Momentum Strike!
**Momentum**: +1 (now at 2)

Use Rippling Defense (Flowing Water ability, costs 3 Momentum)
**Momentum**: 2 - 3 = ... NOT ENOUGH!
*You need one more hit first.*

Attack → Hit! **Momentum**: +1 (now at 3)
→ NOW use Rippling Defense. Dodge next incoming attack, gain +2 Momentum on success.
**Momentum**: 3 - 3 = 0, then +2 on successful dodge = 2

*You flow around his attacks like water around stone. The rhythm builds.*

**Turn 2 - Shifting to Offense (Stance: Flowing Water → Striking Serpent)**

*Time to punish his recklessness.*

**Transition**: Flowing Water → Striking Serpent (costs 2 Momentum)
**Momentum**: 2 - 2 = 0

*Your stance narrows, blade extending like a serpent's fang.*

Attack → Hit!
**Momentum**: +1 (now at 1)

Attack → CRITICAL HIT!
**Momentum**: +2 (now at 3)

Striking Serpent signature - "Serpent's Fang" (costs 6 Momentum)
**Momentum**: 3 - 6 = ... NOT ENOUGH! Need to build more.
*This is the resource lesson — signature moves are expensive.*

Attack → Hit! **Momentum**: +1 (now at 4)
Attack → Hit! **Momentum**: +1 (now at 5)
Attack → CRITICAL HIT! **Momentum**: +2 (now at 7)
→ NOW use Serpent's Fang. **Momentum**: 7 - 6 = 1
**Flourish**: +1 (now at 3) - earned for signature move!
**Effect**: Guaranteed critical hit — 2d8 + AGI doubled. Target is poisoned (1d6 poison/round for 3 rounds).

*Your blade finds the gap in his armor. Venom courses through the wound. He roars in pain.*

Enemy power attack → Hits you!
**Momentum**: -1 for taking damage (now at 0)

**Turn 3 - Defensive Adaptation (Stance: Striking Serpent → Rooted Stone)**

*He's wounded but dangerous. Weather his fury.*

Attack → Hit!
**Momentum**: +1 (now at 1)

Attack → Hit!
**Momentum**: +1 (now at 2)

**Transition**: Striking Serpent → Rooted Stone (costs 2 Momentum)
**Momentum**: 2 - 2 = 0

*You plant your feet. Like a mountain, unmovable.*

Enemy combo (3 strikes) → First hits (reduced by Rooted Stone +4 armor), second you parry!
**Momentum**: +1 for parry (now at 1)
Iron Parry riposte → Hit!
**Momentum**: +1 (now at 2)

Rooted Stone signature - "Mountain's Rebuke" (costs 5 Momentum)
**Momentum**: 2 - 5 = ... NOT ENOUGH!

Attack → Hit! **Momentum**: +1 (now at 3)
Attack → CRITICAL HIT! **Momentum**: +2 (now at 5)
→ NOW use Mountain's Rebuke. **Momentum**: 5 - 5 = 0
**Flourish**: +1 (now at 4)
**Effect**: Parry all attacks this round. Riposte each attacker for 1d8 damage.

Enemy's third strike → Parried! Riposte for 1d8 damage.
**Momentum**: +1 (now at 1)

*His own strength turned against him.*

**Turn 4 - Building for the Finale**

*You have 4 Flourish tokens — almost at maximum! Time to push for the ultimate.*

Attack → Hit! **Momentum**: +1 (now at 2)
Attack → CRITICAL HIT! **Momentum**: +2 (now at 4)

**Transition**: Rooted Stone → Dancing Blade (costs 4 Momentum)
**Momentum**: 4 - 4 = 0

*Your stance shifts—fluid, balanced, the heart of the dance.*

Attack → Hit! **Momentum**: +1 (now at 1)
Attack → Hit! **Momentum**: +1 (now at 2)
Attack → Hit! **Momentum**: +1 (now at 3)

**Turn 5 - The Finishing Flourish**

*He's bleeding from poison, exhausted. Time to end this with style.*

**Ultimate**: "Thousand Cuts Flourish" (costs 5 Flourish)
**Flourish**: 4 - 5 = ... NOT ENOUGH!

*You need one more Flourish token. Transition to Whirling Wind and use Tempest Dance.*

**Transition**: Dancing Blade → Whirling Wind (costs 4 Momentum)
**Momentum**: 3 - 4 = ... NOT ENOUGH!

Attack → Hit! **Momentum**: +1 (now at 4)
**Transition**: Dancing Blade → Whirling Wind (costs 4 Momentum)
**Momentum**: 4 - 4 = 0

Attack → Hit! **Momentum**: +1 (now at 1)
Attack → Hit! **Momentum**: +1 (now at 2)

Whirling Wind signature - "Tempest Dance" (costs 6 Momentum)
**Momentum**: 2 - 6 = ... NOT ENOUGH!

Attack → CRITICAL HIT! **Momentum**: +2 (now at 4)
Attack → Hit! **Momentum**: +1 (now at 5)
Attack → Hit! **Momentum**: +1 (now at 6)
→ NOW use Tempest Dance. **Momentum**: 6 - 6 = 0
**Flourish**: +1 (now at 5, max!)
**Effect**: AoE 15ft, 2d8 + AGI to all enemies, knock back 10ft.

**Ultimate**: "Thousand Cuts Flourish" (costs 5 Flourish)
**Flourish**: 5 - 5 = 0 remaining

*You move like lightning through all 6 stances in rapid succession:*
*Flowing Water dodge → Striking Serpent thrust → Whirling Wind spin → Rooted Stone counter → Shadow Step vanish → Dancing Blade finale*

**Damage**: 6d10 + agility × 2
**Result**: Rival duelist falls, defeated

*You return to Flowing Water, blade clean, breathing steady. The duel is over.*

**The Lesson**: Bladedancer requires resource awareness (Momentum for transitions and abilities, Flourish for ultimates), stance knowledge (which connects to which), and patience (you will often find yourself 1-2 Momentum short of the ability you want). Signature moves are powerful but expensive — you must build Momentum through consistent attacks before you can afford them. You can't spam abilities; you must earn your power through mastery.`,
    },
  },

  // Resource System
  resourceSystem: {
    title: "Momentum & Flourish System",
    description:
      "A dual-resource system tracking kinetic rhythm (Momentum) and martial mastery (Flourish).",

    cards: [
      {
        title: "Momentum (Primary)",
        stats: "0-20 Capacity",
        details:
          "Tracks your immediate combat rhythm. Generated by successful hits/defenses, lost via misses/damage/idle turns, and spent on stances/abilities. Resets to 0 at the start of each combat.",
      },
      {
        title: "Flourish (Secondary)",
        stats: "0-5 Tokens",
        details:
          "Represents permanent mastery. Earned by performing Stance Signature Moves (★). Persists between combats but resets to 0 after an extended rest.",
      },
    ],

    generationTable: {
      headers: ["Action", "Momentum Change", "Flourish Change"],
      rows: [
        ["Successful Attack", "+1", "0"],
        ["Critical Hit", "+2", "0"],
        ["Dodge/Parry", "+1", "0"],
        ["Miss Attack", "-1", "0"],
        ["Take Damage", "-1", "0"],
        ["Idle Turn (no attack/defense)", "-1", "0"],
        ["Signature Move (★)", "-Cost", "+1"],
        ["Extended Rest", "Reset to 0", "Reset to 0"],
      ],
    },

    usage: {
      momentum:
        "Used for stance transitions (2-4 cost) and active ability costs (3-6 cost).",
      flourish:
        "Used exclusively for Ultimate Abilities (2-5 cost) to unleash peak mastery.",
    },

    // Stance Network Table
    stanceNetworkTable: {
      title: "Combat Stance Network",
      description:
        "The Bladedancer can transition between stances following this network. Each stance has unique abilities and passives.",
      headers: [
        "Stance",
        "Type",
        "Passive Effects",
        "Can Transition To",
        "Transition Cost",
      ],
      rows: [
        [
          "Flowing Water",
          "Defensive/Evasive",
          "+2 armor, +10 ft movement, advantage on Disengage",
          "Striking Serpent, Shadow Step, Dancing Blade",
          "2 Momentum",
        ],
        [
          "Striking Serpent",
          "Offensive/Precision",
          "+2 to attack rolls, increased crit chance",
          "Whirling Wind, Rooted Stone, Flowing Water",
          "2 Momentum",
        ],
        [
          "Whirling Wind",
          "AoE/Multi-target",
          "Attacks can cleave to adjacent enemies",
          "Dancing Blade, Rooted Stone",
          "3 Momentum",
        ],
        [
          "Rooted Stone",
          "Defensive/Counter",
          "Can use reaction to parry, riposte on successful parry",
          "Striking Serpent, Flowing Water",
          "2 Momentum",
        ],
        [
          "Dancing Blade",
          "Balanced/Versatile",
          "+1 to all rolls, can chain abilities",
          "ANY stance (universal hub)",
          "4 Momentum",
        ],
        [
          "Shadow Step",
          "Stealth/Burst",
          "Advantage on first attack, +2d6 damage on ambush",
          "Striking Serpent, Dancing Blade",
          "3 Momentum",
        ],
      ],
    },

    // Stance Abilities Table
    stanceAbilitiesTable: {
      title: "Stance-Locked Abilities (Quick Reference)",
      description:
        "Each stance grants access to unique abilities that can ONLY be used while in that stance. These are part of your spell list but require the matching stance. Signature moves (★) generate 1 Flourish token when used.",
      headers: ["Stance", "Ability Name", "Cost", "Effect", "Signature"],
      rows: [
        [
          "Flowing Water",
          "Rippling Defense",
          "3 Momentum",
          "Dodge next attack automatically, gain +2 Momentum",
          "",
        ],
        [
          "Flowing Water",
          "Water's Embrace ★",
          "5 Momentum",
          "Become untargetable for 1 round, reposition anywhere within 30 ft",
          "★",
        ],
        [
          "Striking Serpent",
          "Viper Strike",
          "4 Momentum",
          "Attack with advantage, +1d8 bonus damage",
          "",
        ],
        [
          "Striking Serpent",
          "Serpent's Fang ★",
          "6 Momentum",
          "Guaranteed critical hit, apply poison (1d6 damage/round for 3 rounds)",
          "★",
        ],
        [
          "Whirling Wind",
          "Cyclone Slash",
          "4 Momentum",
          "Attack all enemies within 10 ft for 1d8 + AGI each",
          "",
        ],
        [
          "Whirling Wind",
          "Tempest Dance ★",
          "6 Momentum",
          "Attack all enemies within 15 ft for 2d8 + AGI, knock back 10 ft",
          "★",
        ],
        [
          "Rooted Stone",
          "Iron Parry",
          "3 Momentum",
          "Parry next attack, riposte for 2d6 + AGI damage",
          "",
        ],
        [
          "Rooted Stone",
          "Mountain's Rebuke ★",
          "5 Momentum",
          "Parry all attacks this round, riposte each for 1d8 damage",
          "★",
        ],
        [
          "Dancing Blade",
          "Double Flourish",
          "4 Momentum",
          "Attack twice in one action (1d8 + AGI each)",
          "",
        ],
        [
          "Dancing Blade",
          "Dance of Blades ★",
          "6 Momentum",
          "Chain 3 different stance abilities in one turn (3d8 + AGI, up to 3 targets)",
          "★",
        ],
        [
          "Shadow Step",
          "Ambush Strike",
          "4 Momentum",
          "Teleport to target within 30 ft, attack with 1d8 + AGI + 3d6 bonus damage",
          "",
        ],
        [
          "Shadow Step",
          "Shadow Fade ★",
          "6 Momentum",
          "Become invisible for 1 round, next attack is automatic critical hit",
          "★",
        ],
      ],
    },

    // Flourish Abilities Table
    flourishAbilitiesTable: {
      title: "Flourish Ultimate Abilities",
      description:
        "Powerful abilities that consume Flourish tokens. These represent the pinnacle of Bladedancer mastery.",
      headers: ["Ability Name", "Flourish Cost", "Effect", "Requirements"],
      rows: [
        [
          "Perfect Form",
          "2 Flourish",
          "Gain +5 to all rolls for 3 rounds, Momentum cannot decay",
          "None",
        ],
        [
          "Stance Mastery",
          "3 Flourish",
          "All stance transitions cost 0 Momentum for 5 rounds",
          "None",
        ],
        [
          "Blade Storm",
          "3 Flourish",
          "Attack all enemies within 20 ft for 4d8 damage, knock prone",
          "Must be in Whirling Wind",
        ],
        [
          "Thousand Cuts",
          "5 Flourish",
          "Attack single target 6 times, each hit deals 1d10 damage",
          "Must be in Striking Serpent",
        ],
        [
          "Phantom Dance",
          "5 Flourish",
          "Create 3 illusory copies, each can attack independently for 1 minute",
          "Must be in Shadow Step",
        ],
      ],
    },

    strategicConsiderations: {
      title: "Decision-Making: A Worked Example",
      content: `**Setup**: Striking Serpent stance, 5 Momentum, 2 Flourish. Three clustered goblins + one ogre. Your tank is down.

**Your Options at a Glance**:
- **Stay Offensive** — Use Viper's Fang (3 Momentum): Hurts the ogre, earns Flourish, but leaves you at 2 Momentum — not enough to flee.
- **AoE Sweep** — Transition to Whirling Wind (2 Momentum), cleave all 3 goblins: Clears the swarm AND rebuilds Momentum from each hit.
- **Defensive Pivot** — Transition to Rooted Stone (2 Momentum), parry the ogre: Buys time, but no kills.
- **Hub Jump** — Transition to Dancing Blade (4 Momentum) → Whirling Wind: Works, but leaves you at 1 Momentum.
- **Burn Flourish** — Use Perfect Form (2 Flourish): +5 to all rolls for 3 rounds, but doesn't remove any threats.

**Best Play → Option B (AoE Sweep)**
- Goblins represent more total incoming damage than the ogre over time.
- Cleave can wipe all 3 in 1-2 attacks, and each hit refills Momentum.
- You retain both Flourish tokens for an emergency ultimate.

**The Decision Framework**:
1. **Resource Math** — Can I afford the transition cost AND still act?
2. **Stance Pathing** — Which stances can I even reach from here?
3. **Threat Priority** — Which enemy does the most damage if left alive?
4. **Momentum Forecast** — Will this play build or drain my rhythm?
5. **Flourish Timing** — Is this the right moment for an ultimate?`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "Physical Tracking for Tabletop Play",
      content: `Track the dance at the table with two sets of tokens and a stance card.

**Required Materials**:
- **20 blue/silver tokens** — Momentum (use a d20 as an alternative)
- **5 gold tokens** — Flourish (keep these distinct; they persist between combats)
- **6 stance cards** — One per stance, showing passives, abilities, and transition paths

**Momentum** (add/remove blue tokens each action):
- Hit → +1 | Crit → +2 | Dodge/Parry → +1
- Miss → -1 | Take Damage → -1
- Transition → -2 to -4 | Ability → -3 to -6

**Flourish** (add a gold token when you use a ★ Signature Move):
- Tokens do NOT reset between combats
- Spend 2–5 tokens to activate Ultimate Abilities

**Quick Reference**:
\`\`\`
MOMENTUM:  Start 0 | Max 20
  Build: Attack +1, Crit +2, Dodge/Parry +1
  Lose:  Miss -1, Take Damage -1
  Spend: Transitions 2-4, Abilities 3-6

FLOURISH:  Max 5 tokens (persist between fights)
  Earn:  Signature Move ★ → +1 token
  Spend: Ultimates cost 2-5 tokens

STANCES (starting stance: 💧 Flowing Water):
  💧 Flowing Water  — Defensive, evasive
  🐍 Striking Serpent — Offensive, precision
  🌪️ Whirling Wind  — AoE, multi-target
  🗿 Rooted Stone   — Defensive, counter
  ⚔️ Dancing Blade  — Balanced hub (→ ANY stance)
  👤 Shadow Step    — Stealth, burst
\`\`\`

**Pro Tips**:
- Keep 6+ Momentum for tactical flexibility
- Use Dancing Blade as a hub when you need a stance you can't reach directly
- Use ★ Signature Moves to stockpile Flourish during easy fights — spend it on Ultimates when it matters`,
    },
  },

  characterCreation: {
    title: "Character Creation",
    subtitle: "Beginning Your Dance",

    description: `Every Bladedancer begins their journey the same way — in Flowing Water stance, blade in hand, ready to learn the rhythm of combat. Your starting equipment reflects the mobility and adaptability that define the class.`,

    steps: [
      {
        title: "Choose Your Starting Stance",
        content:
          "All Bladedancers begin combat in **Flowing Water** — the defensive foundation from which all other stances flow. Your first real choice happens once you build Momentum in combat and transition to a new form.",
      },
      {
        title: "Understand Your Resources",
        content:
          "**Momentum** (blue tokens) builds during combat and resets each fight. **Flourish** (gold tokens) persists between fights but resets after an extended rest. You earn Flourish by performing Signature Moves (★) in each stance.",
      },
      {
        title: "Pick Your Equipment",
        content:
          "Bladedancers favor light, agile weapons and minimal armor. Your speed IS your defense.",
      },
    ],

    equipment: {
      weapons: [
        {
          name: "Twin Dancing Blades",
          damage: "1d8 slashing (each)",
          description: "Paired agile blades designed for flowing combo attacks",
        },
        {
          name: "Curved Saber",
          damage: "1d8 slashing",
          description: "A single graceful blade for precise, powerful cuts",
        },
      ],
      armor: {
        name: "Leather Armor",
        description:
          "Light armor — Bladedancers prefer mobility over protection. Your stances provide defensive bonuses that scale better than heavy armor.",
      },
      gear: [
        "Stance Manual — a pocket guide describing all 6 combat stances",
        "20 Momentum Tokens (blue) — for tracking combat rhythm",
        "5 Flourish Tokens (gold) — for tracking mastery tokens",
      ],
      startingGold: 15,
    },
  },

  specializations: {
    title: "Bladedancer Specializations",
    subtitle: "Three Paths of Martial Mastery",

    description: `Bladedancers can specialize in different aspects of stance-based combat, each offering unique approaches to the Momentum & Flourish system. These specializations focus on rapid transitions (Flow Master), precision counters (Duelist), or stealth burst (Shadow Dancer).`,

    passiveAbility: {
      name: "Stance Mastery",
      description:
        "All Bladedancers can flow between 6 combat stances, building Momentum through successful combat actions and earning Flourish tokens through signature moves. Begin combat in Flowing Water stance.",
    },

    specs: [
      {
        name: "Flow Master",
        icon: "fas fa-wind",
        color: "#3498DB",
        theme: "Fluid Combat",
        playstyle:
          "Chain rapid stance transitions for devastating combo attacks. You are never locked into one form — you ARE the flow between them.",
        description:
          "Masters of rapid stance transitions and combo chains. Flow Masters flow between stances with minimal cost, chaining abilities together for devastating combinations.",
        strengths: [
          "Fastest stance transitions (-1 cost to all)",
          "Highest Flourish generation via frequent stance changes",
          "Strongest sustained damage through combo chains",
          "Most forgiving Momentum economy",
        ],
        weaknesses: [
          "Reliant on Momentum economy — struggles when drained",
          "Vulnerable during transition turns",
          "No burst without Momentum buildup",
          "Capstone is defensive, not offensive",
        ],
        keyAbilities: [
          {
            name: "Flowing Transitions",
            type: "Passive",
            cost: "None",
            description:
              "All stance transitions cost 1 less Momentum (minimum 1). Next attack after transition gains +1d6 damage.",
          },
          {
            name: "Flow Combo",
            type: "Action",
            cost: "2 AP, 6 Momentum",
            description: "4d6 + AGI×1.5, 3× crit multiplier",
          },
          {
            name: "Water Ascendant",
            type: "Capstone",
            cost: "All Momentum",
            description:
              "Become flowing water elemental for 1 minute — half damage, 30ft teleport, attacks pass through you",
          },
        ],

        passiveAbility: {
          name: "Flowing Transitions",
          description:
            "All stance transitions cost 1 less Momentum (minimum 1). When you change stances, your next attack gains +1d6 damage.",
        },

        talentTreeSummary: [
          {
            name: "Momentum Flow",
            description:
              "Foundation: Reduces stance transition costs, slows Momentum decay, and boosts Flourish effectiveness.",
          },
          {
            name: "Rapid Current / Combo Weaving",
            description:
              "Branch: Swift transitions with bonus Momentum, or combo chains that let you use abilities at reduced cost after stance changes.",
          },
          {
            name: "Water Ascendant",
            description:
              "Capstone: Become a flowing water elemental for 1 minute — all attacks pass through you, half damage from all sources, 30ft teleport. Costs all Momentum.",
          },
        ],
      },

      {
        name: "Duelist",
        icon: "fas fa-sword",
        color: "#27AE60",
        theme: "Precision Combat",
        playstyle:
          "Dominate single targets through expanded critical ranges and devastating counter-attacks. You punish every mistake.",
        description:
          "Masters of precision strikes and counter-attacks. Duelists excel in single combat, using perfect timing and technique to dominate opponents.",
        strengths: [
          "Expanded critical hit range in 2 stances",
          "Devastating counter-attacks via parry/riposte",
          "Strongest single-target burst in Serpent stance",
          "Capstone forces enemies to focus you, protecting allies",
        ],
        weaknesses: [
          "Only buffs 2 of 6 stances (Serpent and Stone)",
          "Weak against multiple enemies",
          "No mobility bonuses outside of stances",
          "Requires enemy to attack you for full effectiveness",
        ],
        keyAbilities: [
          {
            name: "Perfect Precision",
            type: "Passive",
            cost: "None",
            description:
              "+2 attack rolls in Serpent/Stone stance. Crit on highest 3 damage die results. Reroll damage dice of 1.",
          },
          {
            name: "Perfect Riposte",
            type: "Reaction",
            cost: "4 Momentum",
            description:
              "3d8 + AGI counter-attack, enemy saves or takes full damage",
          },
          {
            name: "Perfect Duelist",
            type: "Capstone",
            cost: "All Flourish",
            description:
              "Challenge all enemies within 30ft — you gain advantage on attacks, enemies have disadvantage attacking anyone but you",
          },
        ],

        passiveAbility: {
          name: "Perfect Precision",
          description:
            "While in Striking Serpent or Rooted Stone stance, gain +2 to attack rolls and increased critical hit chance (crit on highest 3 damage die results). Reroll damage dice showing 1.",
        },

        talentTreeSummary: [
          {
            name: "Precision Edge",
            description:
              "Foundation: Expands critical hit range, boosts initiative in Striking Serpent, and increases Rooted Stone riposte damage.",
          },
          {
            name: "Perfect Timing / Defensive Stance",
            description:
              "Branch: Reaction attacks triggered by enemy actions, or enhanced Rooted Stone with saving throw bonuses and damage reduction.",
          },
          {
            name: "Perfect Duelist",
            description:
              "Capstone: Challenge all enemies within 30ft — you gain advantage on all attacks, and challenged enemies have disadvantage attacking anyone but you. Costs all Flourish tokens.",
          },
        ],
      },

      {
        name: "Shadow Dancer",
        icon: "fas fa-user-ninja",
        color: "#2C3E50",
        theme: "Stealth & Burst",
        playstyle:
          "Strike from invisibility with devastating ambush damage, then vanish before retribution arrives. You are the nightmare in every shadow.",
        description:
          "Masters of stealth and burst damage. Shadow Dancers strike from the shadows with devastating ambushes and can vanish mid-combat.",
        strengths: [
          "Can enter Shadow Step from ANY stance (3 Momentum)",
          "Highest single-strike burst damage",
          "Invisibility and teleportation for positioning",
          "Best Flourish generation from stealth kills",
        ],
        weaknesses: [
          "Relies on stealth — bright light penalizes (-3 armor)",
          "Only 2 stances connect FROM Shadow Step",
          "Vulnerable when stealth is broken",
          "Capstone requires massive resource investment",
        ],
        keyAbilities: [
          {
            name: "Shadow Affinity",
            type: "Passive",
            cost: "None",
            description:
              "Enter Shadow Step from any stance for 3 Momentum. In Shadow Step, lightly obscured, advantage on Stealth, +1d6 damage from stealth.",
          },
          {
            name: "Ambush Strike",
            type: "Action",
            cost: "4 Momentum",
            description:
              "Teleport to target within 30ft, attack with 1d8 + AGI + 3d6 damage",
          },
          {
            name: "Shadow Ascendant",
            type: "Capstone",
            cost: "All Momentum + 3 Flourish",
            description:
              "Become a living shadow for 3 rounds — resistant to all damage (half), 60ft teleport, attacks deal +2d6 shadow damage",
          },
        ],

        passiveAbility: {
          name: "Shadow Affinity",
          description:
            "You can enter Shadow Step stance from any stance (ignoring network restrictions) for 3 Momentum. While in Shadow Step, you are lightly obscured, have advantage on Stealth checks, and deal +1d6 damage from stealth.",
        },

        talentTreeSummary: [
          {
            name: "Shadow Essence",
            description:
              "Foundation: Enter stealth in combat via Shadow Step, generate bonus Flourish from stealth attacks, reduced Shadow Step transition costs.",
          },
          {
            name: "Shadow Cloak / Ambush Mastery",
            description:
              "Branch: Enhanced stealth with attack/damage bonuses, or devastating ambush strikes with massive burst damage on unaware targets.",
          },
          {
            name: "Shadow Ascendant",
            description:
              "Capstone: Become a living shadow for 3 rounds — resistant to all damage (half damage from all sources), 60ft teleport, all attacks deal +2d6 shadow damage. Costs all Momentum and 3 Flourish.",
          },
        ],
      },
    ],
  },

  // Spells - organized by level
  spells: [
    // ===== BLADE DANCER SPECIALIZATION =====
    // ========================================
    // LEVEL 1 SPELLS - Basic Abilities
    // ========================================

    {
      id: "bladedancer_momentum_strike",
      name: "Momentum Strike",
      description:
        "Every master begins with a single stroke — a decisive cut that feeds the rhythm, each landing blow a promise of the devastation to come.",
      level: 1,
      spellType: "ACTION",
      icon: "Slashing/Sword Pierce",

      typeConfig: {
        school: "slashing",
        icon: "Slashing/Sword Pierce",
        tags: ["melee", "damage", "momentum_generation", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Swift momentum-building strike",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "1d8 + agility",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2,
        },
        description: "Precise strike that builds combat rhythm and Momentum",
        resolution: "DICE",
      },

      cooldownConfig: {
        cooldownType: "none",
        cooldownValue: 0,
      },

      momentumGain: 1,

      rollableTable: {
        enabled: true,
        tableName: "Flourish of Steel",
        description: "Your blade finds its own rhythm — each strike a surprise even to you.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Stumble", effect: "Clumsy stroke. No Momentum generated this hit." },
          { range: { min: 2, max: 4 }, customName: "Flat of the Blade", effect: "Strike with the flat. Half damage." },
          { range: { min: 5, max: 8 }, customName: "Clean Cut", effect: "Standard strike. Normal damage + 1 Momentum." },
          { range: { min: 9, max: 11 }, customName: "Rising Tempo", effect: "The rhythm builds. Normal damage + 2 Momentum." },
          { range: { min: 12, max: 14 }, customName: "Wind-Up Slash", effect: "1d6 bonus slashing damage." },
          { range: { min: 15, max: 16 }, customName: "Flowing Arc", effect: "1d8 bonus slashing + 1 Momentum to adjacent ally." },
          { range: { min: 17, max: 18 }, customName: "Blade Song", effect: "1d10 bonus slashing + next attack gains advantage." },
          { range: { min: 19, max: 19 }, customName: "Perfect Rhythm", effect: "2d8 bonus slashing + 3 Momentum." },
          { range: { min: 20, max: 20 }, customName: "Master's Stroke", effect: "Automatic critical hit + 1 Flourish token." },
        ],
      },

      tags: [
        "melee",
        "damage",
        "momentum_generation",
        "starter",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_stance_shift",
      name: "Stance Shift",
      description:
        "Flow between combat stances like water between stones — each transition reshapes your fighting style to match the moment.",
      level: 1,
      spellType: "ACTION",
      icon: "Nature/Cat Face",

      typeConfig: {
        school: "physical",
        icon: "Nature/Cat Face",
        tags: ["utility", "stance", "transition", "starter"],
        castTime: 0,
        castTimeType: "FREE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 2 },
        actionPoints: 0,
        components: [],
      },

      resolution: "NONE",
      effectTypes: ["utility"],

      utilityConfig: {
        utilityType: "stance_change",
        selectedEffects: [
          {
            id: "stance_transition",
            name: "Stance Transition",
            description:
              "Change to a connected stance in the stance network, gaining its passive effects",
          },
        ],
        duration: 0,
        durationUnit: "permanent",
        concentration: false,
        power: "minor",
      },

      cooldownConfig: {
        cooldownType: "none",
        cooldownValue: 0,
      },

      tags: ["utility", "stance", "transition", "starter", "bladedancer"],
    },

    {
      id: "bladedancer_defensive_flow",
      name: "Defensive Flow",
      description:
        "Still waters run deep — your body learns to read attacks before they land, flowing around danger and converting every near-miss into renewed purpose.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Utility/Deflecting Shield",

      typeConfig: {
        school: "bludgeoning",
        icon: "Utility/Deflecting Shield",
        tags: ["passive", "defense", "counter", "toggleable", "starter"],
        toggleable: true,
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        actionPoints: 0,
        components: [],
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "defensive_flow_dodge",
            name: "Flowing Defense",
            description:
              "+2 Dodge permanently. Generates +1 Momentum on successful dodges.",
            statModifier: {
              stat: "dodge",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 0,
        durationType: "permanent",
        durationUnit: "permanent",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: {
        cooldownType: "none",
        cooldownValue: 0,
      },

      tags: [
        "passive",
        "defense",
        "counter",
        "toggleable",
        "starter",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_quick_step",
      name: "Quick Step",
      description:
        "Close the distance before your enemy finishes drawing breath — a single step, and your blade is already where they least expect it.",
      level: 1,
      spellType: "ACTION",
      icon: "Utility/Speed Boot",

      typeConfig: {
        school: "slashing",
        icon: "Utility/Speed Boot",
        tags: ["movement", "damage", "mobility", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Swift repositioning strike",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "1d6 + agility",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description: "Quick strike with enhanced mobility",
        resolution: "DICE",
      },

      cooldownConfig: {
        cooldownType: "none",
        cooldownValue: 0,
      },

      momentumGain: 1,

      tags: ["movement", "damage", "mobility", "starter", "bladedancer"],
    },

    // ========================================
    // LEVEL 2 SPELLS - Enhanced Abilities
    // ========================================

    {
      id: "bladedancer_flowing_strike",
      name: "Flowing Strike",
      description:
        "Channel every ounce of built rhythm into a single devastating arc — the harder you have been fighting, the harder this strikes home.",
      level: 2,
      spellType: "ACTION",
      icon: "Slashing/Quick Slash",

      typeConfig: {
        school: "slashing",
        icon: "Slashing/Quick Slash",
        tags: ["melee", "damage", "stance-transition", "momentum_scaling"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 3 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Fluid strike while shifting stance",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "2d6 + agility + floor(CurrentMomentum / 2)",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2,
        },
        chanceOnHitConfig: {
          enabled: true,
          procType: "dice",
          diceThreshold: 18,
          procChance: 15,
          customEffects: ["knockback"],
          knockbackConfig: {
            distance: 10,
          },
        },
        description:
          "Fluid strike that scales with Momentum and may knock foes back on critical hits",
        resolution: "DICE",
      },

      cooldownConfig: {
        cooldownType: "none",
        cooldownValue: 0,
      },

      tags: [
        "melee",
        "damage",
        "stance-transition",
        "momentum_scaling",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_blade_waltz",
      name: "Blade Waltz",
      description:
        "Steel sings as you weave between attack patterns — each motion feeds the next, a relentless waltz building toward a crescendo.",
      level: 2,
      spellType: "ACTION",
      icon: "Slashing/Whirl",

      typeConfig: {
        school: "slashing",
        icon: "Slashing/Whirl",
        tags: ["melee", "damage", "multi-attack", "momentum_generation"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 2 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Flowing blade dance",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "2d6 + agility",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description: "Multiple flowing strikes that build combat rhythm",
        resolution: "DICE",
      },

      cooldownConfig: {
        cooldownType: "none",
      },

      momentumGain: 2,

      rollableTable: {
        enabled: true,
        tableName: "Waltz Patterns",
        description: "The dance takes on a life of its own — no two waltzes are ever the same.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Stepped On Toes", effect: "Clumsy waltz. Lose 1 Momentum." },
          { range: { min: 2, max: 4 }, customName: "Off-Balance", effect: "Stumbling rhythm. Only 1 hit lands instead of full waltz." },
          { range: { min: 5, max: 8 }, customName: "Standard Waltz", effect: "Clean flowing strikes. Normal damage." },
          { range: { min: 9, max: 11 }, customName: "Crescendo", effect: "+1d6 slashing damage." },
          { range: { min: 12, max: 14 }, customName: "Whirling Partner", effect: "Strike two targets instead of one for half damage each." },
          { range: { min: 15, max: 16 }, customName: "Accelerando", effect: "+2d6 slashing + 2 bonus Momentum." },
          { range: { min: 17, max: 18 }, customName: "Grand Jete", effect: "+3d6 slashing + reposition 10ft free." },
          { range: { min: 19, max: 19 }, customName: "Perfect Waltz", effect: "+4d6 slashing + 3 Momentum + next action has advantage." },
          { range: { min: 20, max: 20 }, customName: "Eternal Dance", effect: "Double damage + 1 Flourish token." },
        ],
      },

      tags: [
        "melee",
        "damage",
        "multi-attack",
        "momentum_generation",
        "bladedancer",
      ],
    },

    // ========================================
    // STANCE-LOCKED ABILITIES (Merged from Stance System)
    // Each ability requires being in the named stance to use.
    // Signature moves (★) generate 1 Flourish token when used.
    // ========================================

    // --- Flowing Water Stance Abilities ---
    {
      id: "bladedancer_stance_flowing_water_rippling_defense",
      name: "Rippling Defense",
      description:
        "Flow around an incoming attack like water around stone, automatically dodging it and converting the defensive motion into renewed Momentum.",
      level: 2,
      spellType: "ACTION",
      icon: "Utility/Deflecting Shield",

      typeConfig: {
        school: "physical",
        icon: "Utility/Deflecting Shield",
        tags: [
          "melee",
          "defense",
          "dodge",
          "momentum_generation",
          "stance_flowing_water",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 3 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Flow around the attack",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id: "rippling_defense_dodge",
            name: "Rippling Dodge",
            description:
              "Automatically dodge the next attack targeting you. On successful dodge, gain +2 Momentum.",
            statusType: "dodge",
            level: "moderate",
            mechanicsText:
              "Dodge next attack. Gain +2 Momentum on successful dodge.",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      stanceRequirement: "flowing_water",

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      tags: [
        "melee",
        "defense",
        "dodge",
        "momentum_generation",
        "stance_flowing_water",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_stance_flowing_water_embrace",
      name: "Water's Embrace",
      description:
        "Become as untouchable as a river — dissolve into flowing motion, becoming completely untargetable while repositioning anywhere on the battlefield.",
      level: 3,
      spellType: "ACTION",
      icon: "Nature/Water",

      typeConfig: {
        school: "physical",
        icon: "Nature/Water",
        tags: [
          "utility",
          "dodge",
          "reposition",
          "untargetable",
          "signature",
          "stance_flowing_water",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 5 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Become the river",
      },

      resolution: "NONE",
      effectTypes: ["utility"],

      utilityConfig: {
        utilityType: "reposition",
        selectedEffects: [
          {
            id: "waters_embrace_untargetable",
            name: "Water's Embrace",
            description:
              "Become untargetable for 1 round. Reposition to any space within 30ft. Signature move: earns 1 Flourish token.",
          },
        ],
        duration: 1,
        durationUnit: "rounds",
        concentration: false,
        power: "major",
      },

      isSignatureMove: true,
      flourishGenerated: 1,
      stanceRequirement: "flowing_water",

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: [
        "utility",
        "dodge",
        "reposition",
        "untargetable",
        "signature",
        "stance_flowing_water",
        "flourish_generation",
        "bladedancer",
      ],
    },

    // --- Striking Serpent Stance Abilities ---
    {
      id: "bladedancer_stance_striking_serpent_viper_strike",
      name: "Viper Strike",
      description:
        "Strike with the speed of a serpent, finding the gap in armor with unerring precision.",
      level: 2,
      spellType: "ACTION",
      icon: "Piercing/Spear Thrust",

      typeConfig: {
        school: "piercing",
        icon: "Piercing/Spear Thrust",
        tags: ["melee", "damage", "precision", "stance_striking_serpent"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 4 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Strike like a viper",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "1d8 + agility + 1d8",
        elementType: "piercing",
        damageTypes: ["piercing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2,
          critRange: [19, 20],
          critBonusDamage: "1d8",
        },
        description:
          "Precise strike with advantage, enhanced by serpent-like speed",
        resolution: "DICE",
      },

      stanceRequirement: "striking_serpent",

      cooldownConfig: {
        cooldownType: "none",
        cooldownValue: 0,
      },

      tags: [
        "melee",
        "damage",
        "precision",
        "stance_striking_serpent",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_stance_striking_serpent_fang",
      name: "Serpent's Fang",
      description:
        "Drive your blade into a vital point with lethal precision, unleashing venom that courses through the wound.",
      level: 4,
      spellType: "ACTION",
      icon: "Piercing/Poison Dagger",

      typeConfig: {
        school: "piercing",
        icon: "Piercing/Poison Dagger",
        tags: [
          "melee",
          "damage",
          "bleed",
          "poison",
          "critical",
          "signature",
          "stance_striking_serpent",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 6 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Fangs of the serpent",
      },

      resolution: "DICE",
      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "2d8 + agility",
        elementType: "piercing",
        damageTypes: ["piercing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        isGuaranteedCrit: true,
        description: "Guaranteed critical strike to a vital point",
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "serpent_venom",
            name: "Serpent's Venom",
            description:
              "Poison courses through the wound, dealing ongoing damage and weakening the target.",
            statusType: "poisoned",
            level: "moderate",
            dotFormula: "1d6",
            dotDamageType: "poison",
            damagePerTurn: "1d6",
            duration: 3,
            durationUnit: "rounds",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        difficultyClass: 14,
        savingThrow: {
          ability: "constitution",
          difficultyClass: 14,
          saveOutcome: "reduced_duration",
        },
      },

      isSignatureMove: true,
      flourishGenerated: 1,
      stanceRequirement: "striking_serpent",

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: [
        "melee",
        "damage",
        "bleed",
        "poison",
        "critical",
        "signature",
        "stance_striking_serpent",
        "flourish_generation",
        "bladedancer",
      ],
    },

    // --- Whirling Wind Stance Abilities ---
    {
      id: "bladedancer_stance_whirling_wind_cyclone_slash",
      name: "Cyclone Slash",
      description:
        "Spin with devastating speed, your blade carving through every enemy within reach.",
      level: 2,
      spellType: "ACTION",
      icon: "Slashing/Cleave",

      typeConfig: {
        school: "slashing",
        icon: "Slashing/Cleave",
        tags: ["melee", "damage", "aoe", "stance_whirling_wind"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 10 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 4 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Spin through enemies",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "1d8 + agility",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description: "Whirling blade strike hitting all nearby enemies",
        resolution: "DICE",
      },

      stanceRequirement: "whirling_wind",

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      rollableTable: {
        enabled: true,
        tableName: "Cyclone Patterns",
        description: "The wind is unpredictable — your cyclone follows no rules but its own.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 2 }, customName: "Dizzy Spin", effect: "You lose your bearings. -2 to next attack roll." },
          { range: { min: 3, max: 5 }, customName: "Gentle Breeze", effect: "Weak cyclone. Half damage to all targets." },
          { range: { min: 6, max: 9 }, customName: "Steady Whirl", effect: "Standard cyclone. Normal damage to all enemies." },
          { range: { min: 10, max: 12 }, customName: "Dust Devil", effect: "+1d6 slashing + enemies are blinded for 1 round." },
          { range: { min: 13, max: 14 }, customName: "Gale Force", effect: "+2d6 slashing + knockback 5ft." },
          { range: { min: 15, max: 16 }, customName: "Tornado", effect: "+2d8 slashing + knockback 10ft + 2 Momentum." },
          { range: { min: 17, max: 18 }, customName: "Hurricane", effect: "+3d8 slashing + knockback 15ft + enemies knocked prone." },
          { range: { min: 19, max: 19 }, customName: "Cyclone King", effect: "+4d8 slashing + enemies disarmed for 1 round." },
          { range: { min: 20, max: 20 }, customName: "Eye of the Storm", effect: "Double damage + enemies pulled 5ft toward you + 1 Flourish." },
        ],
      },

      tags: ["melee", "damage", "aoe", "stance_whirling_wind", "bladedancer"],
    },

    {
      id: "bladedancer_stance_whirling_wind_tempest_dance",
      name: "Tempest Dance",
      description:
        "Become a living storm of steel, slashing everything nearby with such force that enemies are hurled away.",
      level: 4,
      spellType: "ACTION",
      icon: "Slashing/Whirl",

      typeConfig: {
        school: "slashing",
        icon: "Slashing/Whirl",
        tags: [
          "melee",
          "damage",
          "aoe",
          "knockback",
          "signature",
          "stance_whirling_wind",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 6 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Unleash the tempest",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "2d8 + agility",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        chanceOnHitConfig: {
          enabled: true,
          procType: "always",
          customEffects: ["knockback"],
          knockbackConfig: {
            distance: 10,
          },
        },
        description: "Devastating AoE whirlwind that sends enemies flying",
        resolution: "DICE",
      },

      isSignatureMove: true,
      flourishGenerated: 1,
      stanceRequirement: "whirling_wind",

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      rollableTable: {
        enabled: true,
        tableName: "Tempest Chaos",
        description: "The tempest obeys no master — its fury is a wild, beautiful disaster.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Still Air", effect: "The tempest dies. Half damage, no knockback." },
          { range: { min: 2, max: 4 }, customName: "Light Breeze", effect: "Weak tempest. Normal damage but no knockback." },
          { range: { min: 5, max: 8 }, customName: "Steady Gale", effect: "Standard tempest. 2d8 + AGI damage, 10ft knockback." },
          { range: { min: 9, max: 11 }, customName: "Squall", effect: "+1d8 bonus + enemies deafened for 1 round." },
          { range: { min: 12, max: 14 }, customName: "Windstorm", effect: "+2d8 bonus + knockback 15ft + 2 Momentum." },
          { range: { min: 15, max: 16 }, customName: "Micro-Tornado", effect: "+2d8 + one enemy launched 20ft up (falls for 2d6)." },
          { range: { min: 17, max: 18 }, customName: "Derecho", effect: "+3d8 + enemies knocked prone + dragged 10ft toward you." },
          { range: { min: 19, max: 19 }, customName: "Supercell", effect: "+4d8 + all enemies stunned 1 round + 2 Flourish." },
          { range: { min: 20, max: 20 }, customName: "Category Five", effect: "Double damage + enemies hurled to edge of range + 1 Flourish." },
        ],
      },

      tags: [
        "melee",
        "damage",
        "aoe",
        "knockback",
        "signature",
        "stance_whirling_wind",
        "flourish_generation",
        "bladedancer",
      ],
    },

    // --- Rooted Stone Stance Abilities ---
    {
      id: "bladedancer_stance_rooted_stone_iron_parry",
      name: "Iron Parry",
      description:
        "Stand firm as a mountain, deflecting the incoming blow and converting its force into a devastating riposte.",
      level: 2,
      spellType: "REACTION",
      icon: "Utility/Parry",

      typeConfig: {
        school: "slashing",
        icon: "Utility/Parry",
        tags: ["reaction", "parry", "counter", "stance_rooted_stone"],
        castTime: 0,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 3 },
        actionPoints: 0,
        components: ["somatic"],
        somaticText: "Deflect and strike",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "2d6 + agility",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description: "Counter-attack after a successful parry",
        resolution: "DICE",
      },

      stanceRequirement: "rooted_stone",

      cooldownConfig: {
        cooldownType: "none",
        cooldownValue: 0,
      },

      tags: [
        "reaction",
        "parry",
        "counter",
        "stance_rooted_stone",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_stance_rooted_stone_mountains_rebuke",
      name: "Mountain's Rebuke",
      description:
        "Channel the immovable fury of the earth itself — deflect every attack this round and return each with the force of an avalanche.",
      level: 3,
      spellType: "ACTION",
      icon: "Utility/Shield Bash",

      typeConfig: {
        school: "physical",
        icon: "Utility/Shield Bash",
        tags: [
          "defense",
          "parry",
          "counter",
          "signature",
          "stance_rooted_stone",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 5 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "The mountain does not move",
      },

      resolution: "DICE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id: "mountain_rebuke_parry",
            name: "Mountain's Rebuke",
            description:
              "Parry all attacks this round. Riposte each attacker for 1d8 damage. Signature move: earns 1 Flourish token.",
            statusType: "parry_all",
            level: "major",
            mechanicsText:
              "Parry all attacks this round. Counter each for 1d8 physical damage.",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      isSignatureMove: true,
      flourishGenerated: 1,
      stanceRequirement: "rooted_stone",

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: [
        "defense",
        "parry",
        "counter",
        "signature",
        "stance_rooted_stone",
        "flourish_generation",
        "bladedancer",
      ],
    },

    // --- Dancing Blade Stance Abilities ---
    {
      id: "bladedancer_stance_dancing_blade_double_flourish",
      name: "Double Flourish",
      description:
        "Execute two rapid strikes in the time most warriors manage one, each blade finding its mark with practiced precision.",
      level: 3,
      spellType: "ACTION",
      icon: "Slashing/Crossed Swords",

      typeConfig: {
        school: "slashing",
        icon: "Slashing/Crossed Swords",
        tags: ["melee", "damage", "multi-attack", "stance_dancing_blade"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 4 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Strike twice",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "1d8 + agility",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        hits: 2,
        description: "Two rapid strikes in a single action",
        resolution: "DICE",
      },

      stanceRequirement: "dancing_blade",

      cooldownConfig: {
        cooldownType: "none",
        cooldownValue: 0,
      },

      tags: [
        "melee",
        "damage",
        "multi-attack",
        "stance_dancing_blade",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_stance_dancing_blade_dance_of_blades",
      name: "Dance of Blades",
      description:
        "The pinnacle of versatility — chain three different stance techniques into a single devastating combination, flowing between forms in the blink of an eye.",
      level: 5,
      spellType: "ACTION",
      icon: "Slashing/Whirl",

      typeConfig: {
        school: "slashing",
        icon: "Slashing/Whirl",
        tags: [
          "melee",
          "damage",
          "combo",
          "stance-transition",
          "signature",
          "stance_dancing_blade",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "multi",
        rangeType: "melee",
        rangeDistance: 5,
        maxTargets: 3,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 6 },
        actionPoints: 2,
        components: ["somatic"],
        somaticText: "Chain three forms in one breath",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "3d8 + agility",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description:
          "Three chained attacks, each from a different stance tradition",
        resolution: "DICE",
      },

      isSignatureMove: true,
      flourishGenerated: 1,
      stanceRequirement: "dancing_blade",

      propagation: { method: "chain", behavior: "bounce", count: 3, range: 5, decay: 0.9 },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      rollableTable: {
        enabled: true,
        tableName: "Blade Improvisation",
        description: "Even you do not know what comes next — the blade decides.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Fumbled Routine", effect: "All three strikes miss. Lose 2 Momentum." },
          { range: { min: 2, max: 4 }, customName: "Rehearsed Sequence", effect: "Going through the motions. 2d8 instead of 3d8." },
          { range: { min: 5, max: 8 }, customName: "Standard Improv", effect: "Three solid strikes from different traditions. 3d8 + AGI." },
          { range: { min: 9, max: 11 }, customName: "Crowd Pleaser", effect: "+1d8 bonus + 1 Momentum per enemy hit." },
          { range: { min: 12, max: 14 }, customName: "Off-Script Flourish", effect: "+2d8 + one target is disarmed for 1 round." },
          { range: { min: 15, max: 16 }, customName: "Standing Ovation", effect: "+2d8 + all hits are critical strikes." },
          { range: { min: 17, max: 18 }, customName: "Master Improv", effect: "+3d8 + teleport 15ft after each strike + 2 Flourish." },
          { range: { min: 19, max: 19 }, customName: "Legendary Performance", effect: "+4d8 + each strike ignores armor." },
          { range: { min: 20, max: 20 }, customName: "The Dance That Kills", effect: "Triple damage. Each target saves or drops to 1 HP." },
        ],
      },

      tags: [
        "melee",
        "damage",
        "combo",
        "stance-transition",
        "signature",
        "stance_dancing_blade",
        "flourish_generation",
        "bladedancer",
      ],
    },

    // --- Shadow Step Stance Abilities ---
    {
      id: "bladedancer_stance_shadow_step_ambush_strike",
      name: "Ambush Strike",
      description:
        "Melt into shadow and reappear behind your target, blade already in motion before they register your presence.",
      level: 3,
      spellType: "ACTION",
      icon: "Piercing/Night Dagger",

      typeConfig: {
        school: "piercing",
        icon: "Piercing/Night Dagger",
        tags: ["melee", "damage", "teleport", "burst", "stance_shadow_step"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 4 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Step through shadow",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "1d8 + agility + 3d6",
        elementType: "piercing",
        damageTypes: ["piercing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description: "Teleport-ambush strike enhanced by Shadow Step stance",
        resolution: "DICE",
      },

      stanceRequirement: "shadow_step",

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      tags: [
        "melee",
        "damage",
        "teleport",
        "burst",
        "stance_shadow_step",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_stance_shadow_step_shadow_fade",
      name: "Shadow Fade",
      description:
        "Dissolve into darkness itself, becoming invisible to all sight. When you re-emerge, your blade finds its mark with lethal certainty.",
      level: 4,
      spellType: "ACTION",
      icon: "Utility/Hide",

      typeConfig: {
        school: "physical",
        icon: "Utility/Hide",
        tags: [
          "melee",
          "damage",
          "invisibility",
          "critical",
          "signature",
          "stance_shadow_step",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 6 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Become the shadow",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id: "shadow_fade_invisibility",
            name: "Shadow Veil",
            description:
              "Become invisible for 1 round. Your next attack is an automatic critical hit. Signature move: earns 1 Flourish token.",
            statusType: "invisibility",
            level: "major",
            mechanicsText:
              "Invisible for 1 round. Next attack is an automatic critical hit.",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      isSignatureMove: true,
      flourishGenerated: 1,
      stanceRequirement: "shadow_step",

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: [
        "melee",
        "damage",
        "invisibility",
        "critical",
        "signature",
        "stance_shadow_step",
        "flourish_generation",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_stance_dance",
      name: "Stance Dance",
      description:
        "Touch the edge of every form in the span of a heartbeat — a rapid-fire tour through your repertoire that leaves you faster, sharper, and impossible to predict.",
      level: 2,
      spellType: "ACTION",
      icon: "Nature/Roar",

      typeConfig: {
        school: "physical",
        icon: "Nature/Roar",
        tags: ["utility", "stance", "transition", "buff"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 4 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Dance through stances",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "stance_dance_speed",
            name: "Dancing Speed",
            description: "+10 Movement Speed for 1 round.",
            statModifier: {
              stat: "movementSpeed",
              magnitude: 10,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["utility", "stance", "transition", "buff", "bladedancer"],
    },

    {
      id: "bladedancer_blade_flurry",
      name: "Blade Flurry",
      description:
        "Steel becomes a blur — strike after strike cascading in a torrent, each cut riding the force of the one before it.",
      level: 2,
      spellType: "ACTION",
      icon: "Slashing/Crossed Swords",

      typeConfig: {
        school: "slashing",
        icon: "Slashing/Crossed Swords",
        tags: ["melee", "damage", "multi-attack", "momentum_scaling"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 2 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Rapid blade flurry",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "2d6 + agility + floor(CurrentMomentum / 2)",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description: "Multiple rapid strikes that scale with current Momentum",
        resolution: "DICE",
      },

      cooldownConfig: {
        cooldownType: "none",
        cooldownValue: 0,
      },

      rollableTable: {
        enabled: true,
        tableName: "Flurry Patterns",
        description: "Each flurry is a torrent — where each blade lands is chaos incarnate.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Tangled Blades", effect: "Blades catch each other. -1 Momentum and half damage." },
          { range: { min: 2, max: 4 }, customName: "Wild Swings", effect: "More enthusiasm than precision. 1d4 bonus damage." },
          { range: { min: 5, max: 8 }, customName: "Controlled Flurry", effect: "Standard flurry strikes. Normal damage." },
          { range: { min: 9, max: 11 }, customName: "Rising Storm", effect: "+1d6 slashing per 3 Momentum you currently have." },
          { range: { min: 12, max: 14 }, customName: "Thousand Paper Cuts", effect: "+2d6 slashing + target takes 1 bleed/round for 2 rounds." },
          { range: { min: 15, max: 16 }, customName: "Flurry of Fury", effect: "+3d6 slashing + 2 Momentum." },
          { range: { min: 17, max: 18 }, customName: "Blademaster Rain", effect: "+3d8 slashing + target stunned 1 round." },
          { range: { min: 19, max: 19 }, customName: "Unstoppable Onslaught", effect: "+4d8 slashing + hit target and 1 adjacent enemy." },
          { range: { min: 20, max: 20 }, customName: "Flurry of Legends", effect: "Double damage + guaranteed crit on highest die + 1 Flourish." },
        ],
      },

      tags: [
        "melee",
        "damage",
        "multi-attack",
        "momentum_scaling",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_chain_dance",
      name: "Chain Dance",
      description:
        "The dance becomes a chain — three forms, three strikes, one unbroken flow of violence that leaves no room for response.",
      level: 4,
      spellType: "ACTION",
      icon: "Slashing/Whirl",

      typeConfig: {
        school: "slashing",
        icon: "Slashing/Whirl",
        tags: [
          "melee",
          "damage",
          "multi-attack",
          "stance-transition",
          "flourish_generation",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "multi",
        rangeType: "melee",
        rangeDistance: 5,
        maxTargets: 3,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum", "flourish"],
        resourceValues: { momentum: 8, flourish: 2 },
        actionPoints: 2,
        components: ["somatic"],
        somaticText: "Flow through multiple combat forms",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "3d8 + agility",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2,
        },
        description:
          "Three devastating attacks, each enhanced by a different stance's power",
        resolution: "DICE",
      },

      propagation: { method: "chain", behavior: "bounce", count: 3, range: 5, decay: 0.85 },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      rollableTable: {
        enabled: true,
        tableName: "Chain Dance Variations",
        description: "Three forms collide — the chain warps and bends with each iteration.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Broken Chain", effect: "The chain snaps. Only 1 strike lands for half damage." },
          { range: { min: 2, max: 4 }, customName: "Tangled Steps", effect: "Two clumsy strikes. 2d8 instead of 3d8." },
          { range: { min: 5, max: 8 }, customName: "Flowing Chain", effect: "Standard three-form chain. 3d8 + AGI damage." },
          { range: { min: 9, max: 11 }, customName: "Water-Serpent Link", effect: "+1d8 bonus + first target is slowed." },
          { range: { min: 12, max: 14 }, customName: "Wind-Stone Link", effect: "+1d8 bonus + you gain +2 armor until next turn." },
          { range: { min: 15, max: 16 }, customName: "Shadow-Blade Link", effect: "+2d8 bonus + 2 bonus Momentum." },
          { range: { min: 17, max: 18 }, customName: "Perfect Chain", effect: "+3d8 bonus + all three hits target different enemies freely." },
          { range: { min: 19, max: 19 }, customName: "Forbidden Combo", effect: "+4d8 bonus + all targets stunned for 1 round." },
          { range: { min: 20, max: 20 }, customName: "Legendary Chain", effect: "Double damage + 1 Flourish + recover 4 Momentum." },
        ],
      },

      tags: [
        "melee",
        "damage",
        "multi-attack",
        "stance-transition",
        "flourish_generation",
        "bladedancer",
      ],
    },

    // ========================================
    // LEVEL 3 SPELLS - Advanced Abilities
    // ========================================

    {
      id: "bladedancer_perfect_riposte",
      name: "Perfect Riposte",
      description:
        "Read the blade before it arrives. Deflect. Counter. In the space between one heartbeat and the next, turn their aggression into your fuel.",
      level: 3,
      spellType: "REACTION",
      icon: "Utility/Parry",

      typeConfig: {
        school: "piercing",
        icon: "Utility/Parry",
        tags: ["reaction", "parry", "counter", "momentum_generation"],
        castTime: 0,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 4 },
        actionPoints: 0,
        components: ["somatic"],
        somaticText: "Deflect and counter in one motion",
      },

      resolution: "SAVE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "3d8 + agility",
        elementType: "piercing",
        damageTypes: ["piercing"],
        savingThrow: {
          ability: "agility",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2,
          critRange: [19, 20],
          critBonusDamage: "2d8",
        },
        description:
          "Devastating counter-attack that may be avoided with an agility save",
        resolution: "DICE",
      },

      cooldownConfig: {
        cooldownType: "none",
        cooldownValue: 0,
      },

      tags: [
        "reaction",
        "parry",
        "counter",
        "momentum_generation",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_whirling_defense",
      name: "Whirling Defense",
      description:
        "Become a storm of steel — your spinning blades form a wall of edges that shreds anything foolish enough to stand close.",
      level: 3,
      spellType: "ACTION",
      icon: "Slashing/Cleave",

      typeConfig: {
        school: "slashing",
        icon: "Slashing/Cleave",
        tags: ["defense", "damage", "aoe", "mobility"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 5 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 3 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Spinning defensive vortex",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "2d8 + agility",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description: "Whirling strikes that damage nearby enemies",
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      tags: ["defense", "damage", "aoe", "mobility", "bladedancer"],
    },

    {
      id: "bladedancer_flowing_dodge",
      name: "Flowing Dodge",
      description:
        "The attack arrives and you are simply not there — a fluid sidestep that leaves the enemy blade cutting air and your Momentum climbing.",
      level: 3,
      spellType: "REACTION",
      icon: "Utility/Phantom Dash",

      typeConfig: {
        school: "physical",
        icon: "Utility/Phantom Dash",
        tags: ["reaction", "defense", "mobility", "counter"],
        castTime: 0,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 1 },
        actionPoints: 0,
        components: ["somatic"],
        somaticText: "Flow around the attack",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "flowing_dodge_evasion",
            name: "Flowing Evasion",
            description:
              "+4 Dodge for 1 round. Adds to your base Dodge (e.g., 5 base + 4 = 9 Dodge = 9% dodge chance).",
            statModifier: {
              stat: "dodge",
              magnitude: 4,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: {
        cooldownType: "none",
        cooldownValue: 0,
      },

      momentumGain: 2,

      tags: ["reaction", "defense", "mobility", "counter", "bladedancer"],
    },

    {
      id: "bladedancer_stance_mastery",
      name: "Stance Mastery",
      description:
        "Push your current form past its breaking point — a surge of martial clarity that amplifies every passive and every edge your stance provides.",
      level: 3,
      spellType: "ACTION",
      icon: "General/Rage",

      typeConfig: {
        school: "physical",
        icon: "General/Rage",
        tags: ["buff", "stance", "mastery", "enhancement"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 6 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Master this form!",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "stance_mastery_power",
            name: "Stance Mastery",
            description:
              "+2 Stance Power for 2 rounds. Amplifies all active stance effects.",
            statModifier: {
              stat: "stancePower",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: ["buff", "stance", "mastery", "enhancement", "bladedancer"],
    },

    {
      id: "bladedancer_precision_strike",
      name: "Precision Strike",
      description:
        "One blade. One opening. One wound that will not close — a surgical cut that finds the gap in armor and refuses to stop bleeding.",
      level: 4,
      spellType: "ACTION",
      icon: "Piercing/Backstab",

      typeConfig: {
        school: "piercing",
        icon: "Piercing/Backstab",
        tags: ["melee", "damage", "bleed", "critical", "flourish_generation"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 6 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Precise thrust to vital point",
      },

      resolution: "DICE",
      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "4d10 + agility",
        elementType: "piercing",
        damageTypes: ["piercing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2,
          critRange: [18, 19, 20],
          critBonusDamage: "2d10",
        },
        description: "Massive piercing damage to vital organs",
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "bleeding",
            name: "Bleeding Wound",
            description:
              "The target bleeds from a deep wound, taking physical damage over time as blood continues to flow. The wound is severe and continues to cause harm.",
            statusType: "bleeding",
            level: "moderate",
            dotFormula: "1d6",
            dotDamageType: "physical",
            damagePerTurn: "1d6",
            duration: 3,
            durationUnit: "rounds",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        difficultyClass: 15,
        savingThrow: {
          ability: "constitution",
          difficultyClass: 15,
          saveOutcome: "reduced_duration",
        },
      },

      cooldownConfig: {
        cooldownType: "none",
      },

      tags: [
        "melee",
        "damage",
        "bleed",
        "critical",
        "flourish_generation",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_dancing_death",
      name: "Dancing Death",
      description:
        "Waltz through the battlefield like death itself — each enemy you pass receives a gift of steel, and each gift feeds the rhythm of the next.",
      level: 4,
      spellType: "ACTION",
      icon: "Utility/Speed Boot",

      typeConfig: {
        school: "slashing",
        icon: "Utility/Speed Boot",
        tags: [
          "melee",
          "damage",
          "multi-target",
          "momentum_generation",
          "mobility",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "multi",
        rangeType: "melee",
        rangeDistance: 5,
        maxTargets: 3,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 5 },
        actionPoints: 2,
        components: ["somatic"],
        somaticText: "Dance of death through enemies",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "2d6 + agility",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description: "Graceful strikes that flow between multiple targets",
        resolution: "DICE",
      },

      propagation: { method: "chain", behavior: "bounce", count: 3, range: 5, decay: 0.8 },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      rollableTable: {
        enabled: true,
        tableName: "Death Waltz Variations",
        description: "Death dance has many forms — each one a different kind of ending.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Wrong Partner", effect: "Stumble into an enemy blade. Take 1d8 damage to yourself." },
          { range: { min: 2, max: 4 }, customName: "Slow Dance", effect: "Only 1 target is hit for half damage." },
          { range: { min: 5, max: 8 }, customName: "Deaths Waltz", effect: "Standard waltz. 2d6 + AGI to up to 3 targets." },
          { range: { min: 9, max: 11 }, customName: "Accelerating Doom", effect: "+1d6 per target hit. Each kill refunds 2 Momentum." },
          { range: { min: 12, max: 14 }, customName: "Final Curtain", effect: "+2d6 + targets marked (take +2d6 from your next attack)." },
          { range: { min: 15, max: 16 }, customName: "Dance of Shadows", effect: "+2d8 + become invisible for 1 round after the dance." },
          { range: { min: 17, max: 18 }, customName: "Grim Waltz", effect: "+3d8 + targets cannot be healed for 2 rounds." },
          { range: { min: 19, max: 19 }, customName: "Danse Macabre", effect: "+4d8 + all targets lose 1 action point." },
          { range: { min: 20, max: 20 }, customName: "Last Dance", effect: "Triple damage + 1 Flourish + all targets flee 15ft in terror." },
        ],
      },

      tags: [
        "melee",
        "damage",
        "multi-target",
        "momentum_generation",
        "mobility",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_shadow_strike",
      name: "Shadow Strike",
      description:
        "One moment you are thirty feet away. The next your blade is at their spine — a strike from nothing, honed by the Shadow Step tradition.",
      level: 5,
      spellType: "ACTION",
      icon: "Piercing/Night Dagger",

      typeConfig: {
        school: "piercing",
        icon: "Piercing/Night Dagger",
        tags: ["melee", "damage", "teleport", "advantage", "stance-transition"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 5 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Step through shadows",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "3d8 + agility + (stance_shadow_step ? 3d6 : 0)",
        elementType: "piercing",
        damageTypes: ["piercing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2.5,
          critDiceOnly: false,
          extraDice: "2d8",
          critEffects: ["teleport", "advantage"],
          teleportEffect: {
            distance: 10,
            behindTarget: true,
            description: "Teleport behind target on critical hit",
          },
        },
        triggerConfig: {
          effectTriggers: {
            damage: {
              logicType: "OR",
              compoundTriggers: [
                {
                  id: "stance_check",
                  category: "stance",
                  name: "Shadow Step Stance",
                  parameters: {
                    stance: "shadow_step",
                    perspective: "self",
                  },
                },
              ],
            },
          },
          conditionalEffects: {
            damage: {
              isConditional: true,
              defaultEnabled: true,
              baseFormula: "3d8 + agility",
              conditionalFormulas: {
                stance_shadow_step: "3d8 + agility + 3d6",
              },
            },
          },
        },
        description:
          "Devastating strike from the shadows, enhanced when in Shadow Step stance",
        resolution: "DICE",
      },

      cooldownConfig: {
        cooldownType: "none",
        cooldownValue: 0,
      },

      tags: [
        "melee",
        "damage",
        "teleport",
        "advantage",
        "stance-transition",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_blade_barrier",
      name: "Blade Barrier",
      description:
        "Your blades orbit you like moons of sharpened steel — a whirling constellation that shreds the reckless and shields the dancer within.",
      level: 5,
      spellType: "ACTION",
      icon: "Slashing/Whirl",

      typeConfig: {
        school: "slashing",
        icon: "Slashing/Whirl",
        tags: ["defense", "damage", "aoe", "concentration"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingMode: "effect",
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 10 },
        targetRestrictions: ["enemy"],
      },

      effectTargeting: {
        damage: {
          targetingType: "area",
          rangeType: "self_centered",
          aoeShape: "circle",
          aoeParameters: { radius: 10 },
          targetRestrictions: ["enemy"],
        },
        buff: {
          targetingType: "self",
        },
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 4 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Create whirling blade barrier",
      },

      resolution: "DICE",
      effectTypes: ["damage", "buff"],

      damageConfig: {
        formula: "1d6 + agility",
        elementType: "slashing",
        damageTypes: ["slashing"],
        description: "Whirling blades damage enemies that enter the barrier",
        resolution: "DICE",
      },

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "blade_barrier_defense",
            name: "Blade Defense",
            description: "+3 Armor for 3 rounds. Requires concentration.",
            statModifier: {
              stat: "armor",
              magnitude: 3,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["defense", "damage", "aoe", "concentration", "bladedancer"],
    },

    {
      id: "bladedancer_momentum_burst",
      name: "Momentum Burst",
      description:
        "Every drop of rhythm, every built beat, every ounce of accumulated fury — released in a single catastrophic shockwave that empties you completely and levels everything nearby.",
      level: 5,
      spellType: "ACTION",
      icon: "Bludgeoning/Blood Punch",

      typeConfig: {
        school: "force",
        icon: "Bludgeoning/Blood Punch",
        tags: ["damage", "aoe", "momentum_spend", "burst"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: "all" },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "BURST!",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "min(momentum_spent, 10) * 1d8 + agility",
        elementType: "force",
        damageTypes: ["force"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description:
          "Explosive release of stored Momentum as raw damage (capped at 10 Momentum for damage calculation)",
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      rollableTable: {
        enabled: true,
        tableName: "Shockwave Patterns",
        description: "When all that rhythm explodes outward, even the Bladedancer cannot predict the blast.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Fizzle", effect: "The burst collapses inward. Take 2d6 force to yourself." },
          { range: { min: 2, max: 4 }, customName: "Dud", effect: "Weak explosion. Half damage, no knockback." },
          { range: { min: 5, max: 8 }, customName: "Clean Burst", effect: "Standard shockwave. Normal damage to all enemies." },
          { range: { min: 9, max: 11 }, customName: "Concussive Wave", effect: "+2d6 force + enemies deafened for 2 rounds." },
          { range: { min: 12, max: 14 }, customName: "Shockwave", effect: "+3d6 force + knockback 15ft + 2 Momentum refund." },
          { range: { min: 15, max: 16 }, customName: "Resonance Blast", effect: "+3d8 force + allies in range gain +2 Momentum." },
          { range: { min: 17, max: 18 }, customName: "Seismic Burst", effect: "+4d8 force + all enemies knocked prone." },
          { range: { min: 19, max: 19 }, customName: "Momentum Supernova", effect: "Double damage + stagger all enemies 1 round." },
          { range: { min: 20, max: 20 }, customName: "Total Release", effect: "Triple damage + 15ft radius becomes 30ft + 1 Flourish." },
        ],
      },

      tags: ["damage", "aoe", "momentum_spend", "burst", "bladedancer"],
    },

    // ========================================
    // LEVEL 6 SPELLS - Master Abilities
    // ========================================

    {
      id: "bladedancer_vanishing_blade",
      name: "Vanishing Blade",
      description:
        "Slip between the seams of perception — invisible, untouchable, inevitable. When you re-emerge, your blade has already found its mark.",
      level: 6,
      spellType: "ACTION",
      icon: "Utility/Hide",

      typeConfig: {
        school: "slashing",
        icon: "Utility/Hide",
        tags: [
          "melee",
          "damage",
          "critical",
          "invisibility",
          "flourish_generation",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingMode: "effect",
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      effectTargeting: {
        damage: {
          targetingType: "single",
          rangeType: "melee",
          rangeDistance: 5,
          targetRestrictions: ["enemy"],
        },
        buff: {
          targetingType: "self",
        },
      },

      resourceCost: {
        resourceTypes: ["momentum", "flourish"],
        resourceValues: { momentum: 8, flourish: 2 },
        actionPoints: 2,
        components: ["somatic"],
        somaticText: "Fade into shadows, strike unseen",
      },

      resolution: "DICE",
      effectTypes: ["damage", "buff"],

      damageConfig: {
        formula: "6d10 + agility",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2,
          critEffects: ["surprise"],
        },
        description: "Devastating strike with advantage from invisibility",
        resolution: "DICE",
      },

      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id: "vanishing_invisibility",
            name: "Shadow Veil",
            description:
              "Become invisible for 1 round, gaining advantage on attacks",
            statusType: "invisibility",
            level: "major",
            mechanicsText: "Invisible for 1 round. Next attack has advantage.",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      tags: [
        "melee",
        "damage",
        "critical",
        "invisibility",
        "flourish_generation",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_stance_harmony",
      name: "Stance Harmony",
      description:
        "Two forms become one — hold the passive essence of your current stance AND one other stance you have used this combat, a perfect harmony of martial traditions.",
      level: 6,
      spellType: "ACTION",
      icon: "Nature/Tree",

      typeConfig: {
        school: "physical",
        icon: "Nature/Tree",
        tags: ["buff", "stance", "harmony", "concentration"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 10 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Harmony of forms!",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "stance_harmony_dual",
            name: "Dual Stance Harmony",
            description:
              "Gain the passive bonuses of your current stance PLUS one other stance you have used during this combat. Choose the second stance when activating. Both passives stack at full power. Requires concentration.",
            statModifier: {
              stat: "dualStanceActive",
              magnitude: 1,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["buff", "stance", "harmony", "concentration", "bladedancer"],
    },

    {
      id: "bladedancer_reflecting_blades",
      name: "Reflecting Blades",
      description:
        "Steel meets sorcery — your blades move fast enough to catch light, spells, and arrows, hurling them back at their source.",
      level: 6,
      spellType: "REACTION",
      icon: "Utility/Parry",

      typeConfig: {
        school: "physical",
        icon: "Utility/Parry",
        tags: ["reaction", "defense", "reflection", "counter"],
        castTime: 0,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 3 },
        actionPoints: 0,
        components: ["somatic"],
        somaticText: "Deflect with blade precision",
      },

      resolution: "NONE",
      effectTypes: ["utility"],

      utilityConfig: {
        utilityType: "reflection",
        selectedEffects: [
          {
            id: "spell_reflection",
            name: "Spell Reflection",
            description: "Reflect spells and projectiles back at attackers",
          },
        ],
        duration: 1,
        durationUnit: "rounds",
        concentration: false,
        power: "major",
      },

      cooldownConfig: {
        cooldownType: "none",
        cooldownValue: 0,
      },

      tags: ["reaction", "defense", "reflection", "counter", "bladedancer"],
    },

    // ========================================
    // LEVEL 7 SPELLS - Ultimate Abilities
    // ========================================

    {
      id: "bladedancer_flow_master_rapid_transitions",
      name: "Flow Master - Rapid Transitions",
      description:
        "Your transitions become effortless — each stance change costs less, flows faster, and generates Momentum instead of consuming it.",
      level: 7,
      spellType: "PASSIVE",
      icon: "Arcane/Star Trail Path",

      typeConfig: {
        school: "physical",
        icon: "Arcane/Star Trail Path",
        tags: ["passive", "stance", "momentum_generation", "flow_master"],
        toggleable: false,
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        actionPoints: 0,
        components: [],
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "rapid_transitions",
            name: "Rapid Flow",
            description:
              "+1 stance transition cost reduction (minimum 1) for more efficient stance changes. Each transition generates +1 Momentum, rewarding your fluid combat style.",
            statModifier: {
              stat: "transitionCostReduction",
              magnitude: 1,
              magnitudeType: "flat",
            },
          },
          {
            id: "flow_momentum_bonus",
            name: "Flow Momentum",
            description:
              "Gain +1 momentum generation, causing successful attacks to generate +1 additional Momentum. Your flowing combat style builds power with each strike.",
            statModifier: {
              stat: "momentumGeneration",
              magnitude: 1,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 0,
        durationType: "permanent",
        durationUnit: "permanent",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: {
        cooldownType: "none",
        cooldownValue: 0,
      },

      tags: [
        "passive",
        "stance",
        "momentum_generation",
        "flow_master",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_flow_combo",
      name: "Flow Combo",
      description:
        "The perfect combination — a sequence of strikes so fluid that stance boundaries cease to exist, each hit amplified by the memory of the last.",
      level: 7,
      spellType: "ACTION",
      icon: "Slashing/Crossed Swords",

      typeConfig: {
        school: "slashing",
        icon: "Slashing/Crossed Swords",
        tags: ["melee", "damage", "multi-attack", "combo", "flow_master"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 6 },
        actionPoints: 2,
        components: ["somatic"],
        somaticText: "Flow through deadly combinations",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "4d6 + agility * 1.5",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 3,
        critDiceOnly: false,
        description: "Flawless combo strikes that flow like water",
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      rollableTable: {
        enabled: true,
        tableName: "Combo Outcomes",
        description: "The perfect combination — or a beautiful disaster. The flow decides.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Combo Breaker", effect: "The flow stops dead. Half damage, lose 3 Momentum." },
          { range: { min: 2, max: 4 }, customName: "Hesitant Flow", effect: "Choppy combination. 2d6 instead of 4d6." },
          { range: { min: 5, max: 8 }, customName: "Solid Combo", effect: "Standard flowing combination. 4d6 + AGI*1.5." },
          { range: { min: 9, max: 11 }, customName: "Rising Combo", effect: "+1d6 per previous stance used this combat." },
          { range: { min: 12, max: 14 }, customName: "Stance Crossover", effect: "+2d6 + next stance transition is free (0 Momentum)." },
          { range: { min: 15, max: 16 }, customName: "Flow State", effect: "+3d6 + 4 Momentum generated + advantage on next attack." },
          { range: { min: 17, max: 18 }, customName: "Perfect Flow", effect: "+4d6 + x4 crit multiplier instead of x3 + 1 Flourish." },
          { range: { min: 19, max: 19 }, customName: "Transcendent Combo", effect: "Double damage + immediately take a free stance transition." },
          { range: { min: 20, max: 20 }, customName: "The Infinite Flow", effect: "Triple damage + refund all Momentum spent + 2 Flourish." },
        ],
      },

      tags: [
        "melee",
        "damage",
        "multi-attack",
        "combo",
        "flow_master",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_momentum_wave",
      name: "Momentum Wave",
      description:
        "Expend fifteen units of hard-won rhythm in a single outward burst — a shockwave of force that crushes enemies and carries allies forward on the current.",
      level: 7,
      spellType: "ACTION",
      icon: "Force/Sonic Boom",

      typeConfig: {
        school: "force",
        icon: "Force/Sonic Boom",
        tags: ["damage", "buff", "aoe", "momentum_spend"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["all"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 15 },
        actionPoints: 2,
        components: ["verbal"],
        verbalText: "WAVE OF POWER!",
      },

      resolution: "DICE",
      effectTypes: ["damage", "buff"],

      damageConfig: {
        formula: "momentum_spent / 2 + agility",
        elementType: "force",
        damageTypes: ["force"],
        description: "Wave of momentum energy that damages enemies",
        resolution: "DICE",
      },

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "momentum_wave_boost",
            name: "Momentum Surge",
            description: "+5 Momentum Generation for 2 rounds.",
            statModifier: {
              stat: "momentumGeneration",
              magnitude: 5,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      rollableTable: {
        enabled: true,
        tableName: "Wave Resonance",
        description: "The wave carries more than force — it carries intent, and intent is chaos.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Wave Collapse", effect: "The wave implodes. You take 3d6 force damage." },
          { range: { min: 2, max: 4 }, customName: "Ripple", effect: "Weak wave. Half damage, no buff." },
          { range: { min: 5, max: 8 }, customName: "Clean Wave", effect: "Standard wave. Damage to enemies, buff to you." },
          { range: { min: 9, max: 11 }, customName: "Resonant Wave", effect: "+2d6 force + allies in range gain 3 Momentum." },
          { range: { min: 12, max: 14 }, customName: "Tidal Surge", effect: "+3d6 force + knockback 20ft instead of buff." },
          { range: { min: 15, max: 16 }, customName: "Empowering Wave", effect: "Buff increased to +10 Momentum Generation for 2 rounds." },
          { range: { min: 17, max: 18 }, customName: "Tsunami", effect: "+4d8 force + enemies stunned 1 round + allies gain 5 Momentum." },
          { range: { min: 19, max: 19 }, customName: "Perfect Wave", effect: "Double damage + all allies gain advantage for 1 round." },
          { range: { min: 20, max: 20 }, customName: "The Wave That Remembers", effect: "Triple damage + 1 Flourish + all cooldowns reduced by 1." },
        ],
      },

      tags: ["damage", "buff", "aoe", "momentum_spend", "bladedancer"],
    },

    // ========================================
    // LEVEL 8 SPELLS - Legendary Abilities
    // ========================================

    {
      id: "bladedancer_stance_mastery_dancing_blade",
      name: "Stance Mastery - Dancing Blade",
      description:
        "The Dancing Blade form unlocks its full potential — every stance is now reachable from the hub, and every ability costs less to perform.",
      level: 8,
      spellType: "PASSIVE",
      icon: "Slashing/Whirl",

      typeConfig: {
        school: "physical",
        icon: "Slashing/Whirl",
        tags: ["passive", "stance", "mastery", "universal"],
        toggleable: false,
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        actionPoints: 0,
        components: [],
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "universal_transitions",
            name: "Universal Flow",
            description:
              "Can transition to any stance from Dancing Blade hub for 4 Momentum",
            statModifier: {
              stat: "universalTransitions",
              magnitude: 1,
              magnitudeType: "flat",
            },
          },
          {
            id: "stance_mastery",
            name: "Stance Mastery",
            description:
              "All stance abilities are enhanced and cost 1 less Momentum (minimum 1)",
            statModifier: {
              stat: "stanceAbilityCostReduction",
              magnitude: 1,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 0,
        durationType: "permanent",
        durationUnit: "permanent",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: {
        cooldownType: "none",
        cooldownValue: 0,
      },

      tags: ["passive", "stance", "mastery", "universal", "bladedancer"],
    },

    {
      id: "bladedancer_blade_dance",
      name: "Blade Dance",
      description:
        "Blink between four targets in the span of a breath — a teleporting massacre that leaves each enemy nursing a wound they never saw coming.",
      level: 8,
      spellType: "ACTION",
      icon: "Utility/Speed Boot",

      typeConfig: {
        school: "slashing",
        icon: "Utility/Speed Boot",
        tags: ["damage", "teleport", "multi-target", "mobility"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "multi",
        rangeType: "ranged",
        rangeDistance: 30,
        maxTargets: 4,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["momentum"],
        resourceValues: { momentum: 6 },
        actionPoints: 2,
        components: ["somatic"],
        somaticText: "Dance through enemies like the wind",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "4d8 + agility",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description: "Graceful strikes that teleport between targets",
        resolution: "DICE",
      },

      propagation: { method: "chain", behavior: "bounce", count: 4, range: 30, decay: 0.75 },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      rollableTable: {
        enabled: true,
        tableName: "Teleport Massacre Patterns",
        description: "Each blink carries a different kind of death — the blade is everywhere at once.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Spatial Confusion", effect: "You reappear in the wrong spot. Hit yourself for 2d8 slashing." },
          { range: { min: 2, max: 4 }, customName: "Incomplete Blinks", effect: "Only 2 of 4 strikes land for half damage each." },
          { range: { min: 5, max: 8 }, customName: "Clean Dance", effect: "Four teleport-strikes. 4d8 + AGI across up to 4 targets." },
          { range: { min: 9, max: 11 }, customName: "Afterimage Strikes", effect: "+1d8 per target. Afterimages persist for 1 round." },
          { range: { min: 12, max: 14 }, customName: "Dimensional Shear", effect: "+2d8 + targets take 1d8 force from spatial tear." },
          { range: { min: 15, max: 16 }, customName: "Blink Storm", effect: "+3d8 + targets marked (advantage on attacks vs them 1 round)." },
          { range: { min: 17, max: 18 }, customName: "Shadow Quadruple", effect: "+4d8 + become invisible after the dance for 1 round." },
          { range: { min: 19, max: 19 }, customName: "Reality Blade", effect: "Double damage + all attacks bypass armor." },
          { range: { min: 20, max: 20 }, customName: "Omnipresent Death", effect: "Triple damage + hit up to 8 targets instead of 4 + 2 Flourish." },
        ],
      },

      tags: ["damage", "teleport", "multi-target", "mobility", "bladedancer"],
    },

    {
      id: "bladedancer_stance_echo",
      name: "Stance Echo",
      description:
        "Your movements leave afterimages in martial memory — the last two stances you used linger as echoes, their passive bonuses ghosting alongside your current form.",
      level: 8,
      spellType: "PASSIVE",
      icon: "Healing/Renewal",

      typeConfig: {
        school: "physical",
        icon: "Healing/Renewal",
        tags: ["passive", "stance", "echo", "mastery"],
        toggleable: false,
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        actionPoints: 0,
        components: [],
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "stance_echo_benefits",
            name: "Echo Benefits",
            description:
              "Gain +2 multi-stance echo, retaining partial benefits from your last 2 used stances. A lingering connection to recently used forms creates seamless flow between combat styles.",
            statModifier: {
              stat: "multiStanceEcho",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 0,
        durationType: "permanent",
        durationUnit: "permanent",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: {
        cooldownType: "none",
        cooldownValue: 0,
      },

      tags: ["passive", "stance", "echo", "mastery", "bladedancer"],
    },

    // ========================================
    // LEVEL 9 SPELLS - Mythic Abilities
    // ========================================

    {
      id: "bladedancer_flourish_ultimate_thousand_cuts",
      name: "Flourish Ultimate - Thousand Cuts",
      description:
        "The culmination of every form mastered — burn through all six stances in a single impossible instant, each one landing its most devastating technique before flowing into the next. Five Flourish. One storm.",
      level: 9,
      spellType: "ACTION",
      icon: "Slashing/Cross Slash",

      typeConfig: {
        school: "slashing",
        icon: "Slashing/Cross Slash",
        tags: ["aoe", "damage", "multi-attack", "flourish_spend", "ultimate"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["flourish"],
        resourceValues: { flourish: 5 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "BY THE SIX WINDS!",
        somaticText: "Dance through all forms",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "6d10 + agility * 2",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2,
        },
        description:
          "Six devastating attacks, one from each stance, enhanced by your mastery",
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      rollableTable: {
        enabled: true,
        tableName: "Six Stance Apocalypse",
        description: "All six stances unleashed in one impossible instant — even the Bladedancer cannot predict the result.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Form Collapse", effect: "The stances reject unity. 3d10 damage only + lose 2 Flourish." },
          { range: { min: 2, max: 4 }, customName: "Incomplete Mastery", effect: "Only 4 of 6 stances land. 4d10 + AGI." },
          { range: { min: 5, max: 8 }, customName: "Full Thousand Cuts", effect: "All six stances. 6d10 + AGI*2 damage." },
          { range: { min: 9, max: 11 }, customName: "Flowing Onslaught", effect: "+2d10 bonus + enemies knocked prone." },
          { range: { min: 12, max: 14 }, customName: "Storm of Steel", effect: "+3d10 bonus + AoE expands to 20ft radius." },
          { range: { min: 15, max: 16 }, customName: "Dance of Annihilation", effect: "+4d10 bonus + all enemies stunned for 2 rounds." },
          { range: { min: 17, max: 18 }, customName: "Sixfold Perfection", effect: "+5d10 bonus + refund 2 Flourish tokens." },
          { range: { min: 19, max: 19 }, customName: "Thousand Cuts Ascendant", effect: "Double damage + all hits are guaranteed crits." },
          { range: { min: 20, max: 20 }, customName: "Dance Beyond Death", effect: "Triple damage + enemies below half HP are instantly slain." },
        ],
      },

      tags: [
        "aoe",
        "damage",
        "multi-attack",
        "flourish_spend",
        "ultimate",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_flourish_sixfold_strike",
      name: "Flourish - Sixfold Strike",
      description:
        "Channel the essence of every stance into one blow — a single strike carrying the weight of Water's grace, Serpent's precision, Wind's fury, Stone's resolve, Blade's versatility, and Shadow's lethality.",
      level: 9,
      spellType: "ACTION",
      icon: "General/Rage",

      typeConfig: {
        school: "force",
        icon: "General/Rage",
        tags: ["damage", "critical", "flourish_spend", "stance_power"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["flourish"],
        resourceValues: { flourish: 3 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "SIX WINDS UNITE!",
        somaticText: "Channel all stances into one strike",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "6d8 + agility * 2",
        elementType: "force",
        damageTypes: ["force"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description:
          "A devastating strike channeling the essence of all six stances",
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      rollableTable: {
        enabled: true,
        tableName: "Six Essence Strike",
        description: "Six essences collide in your blade — the resulting strike is beyond prediction.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Essence Rejection", effect: "The stances rebel. Only 3d8 damage + lose 1 Flourish." },
          { range: { min: 2, max: 4 }, customName: "Partial Unity", effect: "Four essences align. 4d8 + AGI instead of 6d8." },
          { range: { min: 5, max: 8 }, customName: "Harmonious Strike", effect: "All six essences. 6d8 + AGI*2 force damage." },
          { range: { min: 9, max: 11 }, customName: "Essence Surge", effect: "+2d8 bonus + target loses 1 action point." },
          { range: { min: 12, max: 14 }, customName: "Shattering Blow", effect: "+3d8 bonus + target armor reduced by half for 3 rounds." },
          { range: { min: 15, max: 16 }, customName: "Sixfold Critical", effect: "Automatic critical hit with x3 multiplier." },
          { range: { min: 17, max: 18 }, customName: "Essence Explosion", effect: "+4d8 + explodes dealing 2d8 force to enemies within 10ft." },
          { range: { min: 19, max: 19 }, customName: "Perfect Sixfold", effect: "Double damage + refund 1 Flourish + 5 Momentum." },
          { range: { min: 20, max: 20 }, customName: "Transcendent Strike", effect: "Triple damage + target saves CON DC 20 or paralyzed 3 rounds." },
        ],
      },

      tags: [
        "damage",
        "critical",
        "flourish_spend",
        "stance_power",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_perfect_harmony",
      name: "Perfect Harmony",
      description:
        "Stance transitions cost nothing but intent. Every ability hits harder. The dance is no longer something you perform — it is what you are.",
      level: 9,
      spellType: "PASSIVE",
      icon: "General/Rage",

      typeConfig: {
        school: "physical",
        icon: "General/Rage",
        tags: ["passive", "stance", "harmony", "mastery"],
        toggleable: false,
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        actionPoints: 0,
        components: [],
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "perfect_harmony_mastery",
            name: "Harmonic Mastery",
            description:
              "Stance transitions cost 1 Momentum (instead of 2-4), all stance abilities deal +1d6 damage",
            statModifier: {
              stat: "perfectStanceMastery",
              magnitude: 1,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 0,
        durationType: "permanent",
        durationUnit: "permanent",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: {
        cooldownType: "none",
        cooldownValue: 0,
      },

      tags: ["passive", "stance", "harmony", "mastery", "bladedancer"],
    },

    // ========================================
    // LEVEL 10 SPELLS - Transcendent Abilities
    // ========================================

    {
      id: "bladedancer_dance_of_the_six_winds",
      name: "Dance of the Six Winds",
      description:
        "For one transcendent minute, you become the dance itself — all six stances active at once, transitions instant and free, Momentum generation doubled. The battlefield is your stage.",
      level: 10,
      spellType: "ACTION",
      icon: "Nature/Nature Primal",

      typeConfig: {
        school: "physical",
        icon: "Nature/Nature Primal",
        tags: ["transformation", "ultimate", "stance", "transcendent"],
        castTime: 3,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["momentum", "flourish"],
        resourceValues: { momentum: 20, flourish: 5 },
        actionPoints: 4,
        components: ["verbal", "somatic", "material"],
        verbalText: "I BECOME THE STORM!",
        somaticText: "Unleash the dance of all forms",
        materialText: "A blade infused with the essence of all six stances",
      },

      resolution: "NONE",
      effectTypes: ["transformation"],

      transformationConfig: {
        transformationType: "physical",
        targetType: "self",
        duration: 1,
        durationUnit: "minutes",
        power: "major",
        newForm: "Dance of the Six Winds",
        description:
          "Enter a state of perfect martial focus, embodying all six stances simultaneously.",
        concentration: true,
        grantedAbilities: [
          {
            id: "six_winds_passives",
            name: "Six Winds Embodiment",
            description:
              "Gain all passive effects from all six stances simultaneously",
          },
          {
            id: "instant_transitions",
            name: "Instant Transitions",
            description:
              "Switch between any stance instantly without Momentum cost",
          },
          {
            id: "doubled_momentum",
            name: "Endless Flow",
            description:
              "Momentum generation is doubled for the duration, allowing you to build combat momentum twice as fast with each successful action.",
          },
        ],
      },

      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 0,
      },

      rollableTable: {
        enabled: true,
        tableName: "Transcendent Winds",
        description: "When you become the dance itself, reality bends. No two ascensions are alike.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Wind Collapse", effect: "The forms cannot sustain. Duration reduced to 1 round." },
          { range: { min: 2, max: 4 }, customName: "Struggling Wind", effect: "Only 4 of 6 stances activate. Partial passives only." },
          { range: { min: 5, max: 8 }, customName: "Six Winds Ascendant", effect: "Full transformation. All passives, free transitions, 2x Momentum." },
          { range: { min: 9, max: 11 }, customName: "Accelerated Wind", effect: "+1 round duration + all attacks deal +2d6 bonus." },
          { range: { min: 12, max: 14 }, customName: "Tireless Wind", effect: "Momentum generation tripled instead of doubled." },
          { range: { min: 15, max: 16 }, customName: "Unstoppable Wind", effect: "Immune to all CC for the duration + flight speed 30ft." },
          { range: { min: 17, max: 18 }, customName: "Eternal Wind", effect: "Duration doubled (2 min) + all stance abilities cost 0 Momentum." },
          { range: { min: 19, max: 19 }, customName: "Six Winds Perfection", effect: "All attacks auto-crit + damage ignores all resistances." },
          { range: { min: 20, max: 20 }, customName: "The Unending Dance", effect: "Duration 10 min + refund 3 Flourish + all allies gain 5 Momentum." },
        ],
      },

      tags: [
        "transformation",
        "ultimate",
        "stance",
        "transcendent",
        "bladedancer",
      ],
    },

    {
      id: "bladedancer_zenith_blade_mastery",
      name: "Zenith Blade Mastery",
      description:
        "Every cut carries the weight of total mastery — attacks hit harder, stance abilities deal devastating bonus damage, and every action generates twice the Momentum. Nothing left to learn.",
      level: 10,
      spellType: "PASSIVE",
      icon: "Slashing/Whirl",

      typeConfig: {
        school: "physical",
        icon: "Slashing/Whirl",
        tags: ["passive", "mastery", "ultimate", "stance"],
        toggleable: false,
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        actionPoints: 0,
        components: [],
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "zenith_mastery",
            name: "Zenith Mastery",
            description:
              "+2 to all attack rolls, +1d8 damage to all stance abilities, +2 Momentum generated per action",
            statModifier: {
              stat: "ultimateBladeMastery",
              magnitude: 1,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 0,
        durationType: "permanent",
        durationUnit: "permanent",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: {
        cooldownType: "none",
        cooldownValue: 0,
      },

      tags: ["passive", "mastery", "ultimate", "stance", "bladedancer"],
    },
  ],

  // Spell Pools by Level
  spellPools: {
    1: [
      "bladedancer_momentum_strike",
      "bladedancer_stance_shift",
      "bladedancer_defensive_flow",
      "bladedancer_quick_step",
    ],
    2: [
      "bladedancer_flowing_strike",
      "bladedancer_blade_waltz",
      "bladedancer_stance_dance",
      "bladedancer_blade_flurry",
      "bladedancer_stance_flowing_water_rippling_defense",
      "bladedancer_stance_striking_serpent_viper_strike",
      "bladedancer_stance_whirling_wind_cyclone_slash",
      "bladedancer_stance_rooted_stone_iron_parry",
    ],
    3: [
      "bladedancer_perfect_riposte",
      "bladedancer_whirling_defense",
      "bladedancer_flowing_dodge",
      "bladedancer_stance_mastery",
      "bladedancer_stance_flowing_water_embrace",
      "bladedancer_stance_rooted_stone_mountains_rebuke",
      "bladedancer_stance_dancing_blade_double_flourish",
      "bladedancer_stance_shadow_step_ambush_strike",
    ],
    4: [
      "bladedancer_chain_dance",
      "bladedancer_precision_strike",
      "bladedancer_dancing_death",
      "bladedancer_stance_striking_serpent_fang",
      "bladedancer_stance_whirling_wind_tempest_dance",
      "bladedancer_stance_shadow_step_shadow_fade",
    ],
    5: [
      "bladedancer_shadow_strike",
      "bladedancer_blade_barrier",
      "bladedancer_momentum_burst",
      "bladedancer_stance_dancing_blade_dance_of_blades",
    ],
    6: [
      "bladedancer_vanishing_blade",
      "bladedancer_stance_harmony",
      "bladedancer_reflecting_blades",
    ],
    7: [
      "bladedancer_flow_master_rapid_transitions",
      "bladedancer_flow_combo",
      "bladedancer_momentum_wave",
    ],
    8: [
      "bladedancer_stance_mastery_dancing_blade",
      "bladedancer_blade_dance",
      "bladedancer_stance_echo",
    ],
    9: [
      "bladedancer_flourish_ultimate_thousand_cuts",
      "bladedancer_flourish_sixfold_strike",
      "bladedancer_perfect_harmony",
    ],
    10: [
      "bladedancer_dance_of_the_six_winds",
      "bladedancer_zenith_blade_mastery",
    ],
  },
};

export default BLADEDANCER_DATA;
