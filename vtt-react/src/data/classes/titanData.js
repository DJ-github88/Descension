/**
 * Titan Class Data
 * 
 * Complete class information for the Titan - a celestial warrior
 * who attunes to divine beings to gain their powers and restrictions.
 */

import { DEVOTIONS, SPECIALIZATIONS, TITAN_MANA } from './titan/titanConstants';
import { TITAN_SPELLS } from './titan/titanSpells';

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
      title: 'Combat Example: Radiant Devotion',
      content: `**The Lesson — Read This First**:
1. **Devotion Choice**: Solara grants +1d6 radiant damage on every melee attack — no resource cost, always active.
2. **Ultimate Timing**: Solar Flare (3d8 radiant, 10 ft radius, blind 1 turn) is once per long rest. Save it for when enemies cluster.
3. **Restriction Management**: You glow (30 ft bright light). Enemies have advantage on attacks against you. Accept the trade — your damage output is worth it.

---

**The Setup**: You're a Level 4 Titan attuned to **Solara, the Radiant Sun**. Four shadow demons and a shadow lord emerge from the darkness. Your devotion is ideal here — shadow creatures are vulnerable to radiant damage.

**Starting State**: Devotion: Solara | HP: 75/75 | Mana: 50/60 | Solar Flare: **Available**

**Solara Devotion**:
- **Passive**: Melee attacks deal **+1d6 radiant damage** (always active, no resource cost)
- **Ultimate**: **Solar Flare** — 3d8 radiant to all enemies within 10 ft, blind 1 turn (1/long rest)
- **Restriction**: You emit bright light (30 ft radius). Enemies have **advantage on attacks against you** in bright light.

---

**Turn 1 — Engage with Passive Bonus**

*You step forward, wreathed in solar light. The demons recoil.*

**Action**: Melee attack Shadow Demon #1
**Attack Roll**: d20+6 → [15] = Hit!
**Base Damage**: 2d8+4 → [5, 6] + 4 = 13 damage
**Solara Passive**: +1d6 radiant → [4] = **+4 radiant damage**
**Total**: 13 + 4 = **17 damage**

*Your blade burns with solar fire. The shadow demon shrieks as radiant light sears its flesh.*

**Shadow Demon #1**: 17 damage → **Heavily Damaged**

**Shadow Demon #2's Turn**: Attacks you with **advantage** (you're glowing)
**Attack Roll**: d20+5 (advantage) → [16, 12] → 16 = Hit!
**Damage**: 2d6+3 → [5, 4] + 3 = **12 damage**

**HP**: 75 − 12 = 63/75

> **Rules Note**: Solara's restriction gave the demon advantage — you took a hit you might have avoided. The trade: you deal bonus radiant damage on every swing.

---

**Turn 2 — Celestial Strike (Spending Mana)**

*Two demons down, three remain. You channel Solara's power into a devastating strike.*

**Action**: Cast **Celestial Strike** (15 mana, 1 AP) on Shadow Demon #2
**Attack Roll**: d20+6 → [18] = Hit!
**Base Damage**: 4d8+4 → [7, 5, 8, 6] + 4 = 30 damage
**Solara Variant Bonus**: +2d6 fire → [5, 4] = **+9 fire damage**
**Solara Passive**: +1d6 radiant → [5] = **+5 radiant damage**
**Total**: 30 + 9 + 5 = **44 damage**

*Your weapon ERUPTS with solar fire and celestial energy. The demon disintegrates.*

**Shadow Demon #2**: 44 damage → **Dead**

**Mana**: 50 − 15 = 35/60

> **Rules Note**: Celestial Strike (Level 4) has a devotion-specific bonus. With Solara, it gains +2d6 fire damage. Each devotion changes the bonus — Lunara adds healing, Terranox adds knockback, etc.

---

**Turn 3 — Solar Flare (Ultimate)**

*Shadow Demons #3, #4 and the Shadow Lord close in. Three enemies within 10 feet. This is the moment.*

**Action**: **Solar Flare** (0 mana, once per long rest)
**Damage**: 3d8 radiant → [8, 7, 6] = **21 radiant damage to all enemies within 10 ft**
**Debuff**: All hit enemies are **blinded** for 1 turn

*A miniature sun detonates outward from your body. The demons SCREAM.*

**Shadow Demon #3**: 21 radiant → **Dead**
**Shadow Demon #4**: 21 radiant → **Dead**
**Shadow Lord**: 21 radiant → Heavily Damaged, **Blinded** (disadvantage on attacks, advantage against him)

> **Rules Note**: Solar Flare costs no mana but can only be used once per long rest. It's gone until tomorrow — use it when it matters.

---

**Turn 4 — Finish the Shadow Lord**

*The shadow lord stands alone, blinded, wounded. You advance.*

**Action**: Melee attack Shadow Lord (he has disadvantage on attacks due to blindness)
**Attack Roll**: d20+6 → [17] = Hit!
**Base Damage**: 2d8+4 → [6, 8] + 4 = 18 damage
**Solara Passive**: +1d6 radiant → [3] = **+3 radiant damage**
**Total**: 18 + 3 = **21 damage**

*Your blade bites deep. The shadow lord collapses.*

**Shadow Lord**: 21 damage → **Dead**

**Combat Over**

---

**Final State**: Devotion: Solara | HP: 63/75 | Mana: 35/60 | Solar Flare: **Spent**

**Damage Breakdown**:
- Turn 1: 17 (melee + passive)
- Turn 2: 44 (Celestial Strike + variant + passive)
- Turn 3: 63 (Solar Flare: 21 × 3 targets)
- Turn 4: 21 (melee + passive)
- **Grand Total**: 145 damage dealt, 12 damage taken (from advantage drawback)

**Key Takeaways**:
1. **Passive is always on** — +1d6 radiant on every melee attack, no mana, no action. This is your bread and butter.
2. **Ultimate timing matters** — Solar Flare hit 3 targets because you waited for them to cluster. Using it on Turn 1 against one demon would have wasted it.
3. **Restrictions are real** — You took 12 damage from a demon that had advantage because of your glow. Against non-shadow enemies, this drawback hurts even more.
4. **Devotion choice is daily** — Tomorrow, you could attune to Lunara for tanking, Terranox for immovable defense, Astraeus for mobility, or Zephyra for attack speed. Each devotion completely changes your combat role.`
    }
  },
  
  characterCreation: {
    title: 'Character Creation',
    content: `**Step 1: Assign Stats**
Prioritize **Strength** (improves melee damage and most Titan spell scaling) and **Vitality** (increases HP — you are a frontline warrior). **Spirit** is secondary — it improves your spell save DCs for devotion abilities. **Agility** helps if you plan to play Astraeus or Zephyra devotions.

**Step 2: Choose Your First Devotion**
Read all five celestial devotions below. Choose based on what your party needs most:
- **Solara**: You want to deal damage. Good against undead, shadows, and enemies vulnerable to radiant.
- **Lunara**: You want to tank and self-sustain. Good when your party lacks a healer.
- **Astraeus**: You want speed and mobility. Good for flanking and hit-and-run tactics.
- **Terranox**: You want to be an immovable wall. Good for holding chokepoints and tanking bosses.
- **Zephyra**: You want fast, sustained attacks. Good for maximizing DPR with lightning damage.

**Step 3: Choose a Specialization**
- **Celestial Champion**: You want maximum devotion power. Accept bigger restrictions for bigger benefits.
- **Divine Conduit**: You want a smoother, safer playstyle. Reduced restrictions, dual attunement.
- **Astral Warrior**: You want to switch devotions mid-combat based on what the fight demands.

**Step 4: Select Starting Spells**
You begin with your devotion's **passive ability** (automatic) and **ultimate ability** (once per long rest), plus:
- **Celestial Strike** (Level 4 universal spell) — your first active-cost ability.
- If your devotion is Solara, also learn **Radiant Strike** (passive, always active).

**Step 5: Equip Starting Gear**
- **Celestial Greataxe** (two-handed melee): 2d8 slashing. Your conduit for channeling divine power into strikes.
- **Acolyte's Chainmail** (medium armor): 4 Armor. Functional but not flashy — you rely on devotion for defense.
- **Devotion Medallion** (trinket): Displays your current celestial attunement. +1 Spirit.
- **Celestial Prayer Book** (tome): Contains the morning ritual for each devotion. +1 Intelligence.
- **Potion of Clarity** (consumable, ×2): Restore 20 mana. Use when you need one more spell in a fight.

**Step 6: Understand Your First Turn**
Your first combat is straightforward: walk into melee range and swing. Your devotion passive triggers automatically — Solara adds radiant damage, Lunara adds armor and regen, etc. Don't use your ultimate on Turn 1. Save it for when it can hit multiple enemies or turn the tide. You are not a burst class on Turn 1 — you are a sustained powerhouse who gets scarier as the fight goes on.`
    },

  // Resource System
  resourceSystem: {
    title: 'Celestial Devotion System',
    subtitle: 'Attune to Divine Beings',
    
    description: `Each long rest, choose one of five celestial beings to attune to. Gain their divine passive bonuses and a powerful once-per-long-rest ultimate — but also inherit their restriction. Your role changes daily based on your choice.

**Mana Economy**: Titans have a base mana pool of 60 (increases by 5 per level). You regenerate 5 mana at the start of each turn. A short rest restores 50% of your mana pool. Devotion passives and ultimates (Levels 1–3) cost **no mana** — they are always active or free to trigger. Level 4+ active spells cost mana as listed in their resource costs. This means your devotion abilities are always available regardless of mana state, while your learned spells require resource management.`,
    
    cards: [
      {
        title: 'Devotion Attunement',
        stats: '1/Long Rest',
        details: 'Choose one of five celestial beings at the end of each long rest. Gain their passive, their ultimate, and their restriction for the entire day.'
      },
      {
        title: 'Ultimate Ability',
        stats: '1/Long Rest',
        details: 'Each devotion grants a devastating once-per-rest ultimate. Using it is irreversible until your next long rest. Timing is everything. Celestial Champions can use their ultimate twice per long rest.'
      },
      {
        title: 'Mana',
        stats: `${TITAN_MANA.basePool} Base | +${TITAN_MANA.regenPerTurn}/Turn`,
        details: `Mana pool: ${TITAN_MANA.basePool} + 5 per level. Regen ${TITAN_MANA.regenPerTurn} mana per turn. Short rest restores 50%. Devotion abilities (L1-3) are free. Learned spells (L4+) cost mana.`
      },
      {
        title: 'Devotion Swap',
        stats: 'Special Action (Spec-Dependent)',
        details: 'Astral Warriors can switch devotions mid-combat for 1 AP (3 uses per long rest). Divine Conduits can switch during one short rest per day. Celestial Champions cannot switch mid-combat.'
      }
    ],

    celestialDevotionsTable: {
      title: 'Celestial Devotions',
      headers: ['Devotion', 'Passive Benefits', 'Ultimate Ability (1/Long Rest)', 'Restriction'],
      rows: Object.values(DEVOTIONS).map(d => [
        `${d.name} (${d.title.replace('The ', '')})`,
        d.benefit,
        `${d.ultimateName}: ${d.ultimateShort}`,
        d.restriction
      ])
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
          'Can use ultimate ability twice per long rest',
          'Allies within 10 feet gain 25% of your devotion benefits',
          'Higher risk, higher reward playstyle'
        ],
        
        weaknesses: [
          'Devotion restrictions are enhanced (see each devotion for specifics)',
          'Cannot switch devotions mid-combat',
          'More committed to chosen devotion',
          'Enhanced restrictions can be punishing against wrong enemy types'
        ],
        
        keyAbilities: [
          'Divine Amplification: Devotion benefits increased by 50%',
          'Shared Blessing: Allies within 10 feet gain 25% of devotion benefits',
          'Celestial Surge: Use ultimate ability twice per long rest'
        ],
        
        specPassive: {
          name: 'Champion\'s Devotion',
          description: 'Devotion passive benefits increased by 50%. Ultimate abilities can be used twice per long rest. Allies within 10 feet gain 25% of your devotion benefits. Devotion restrictions are enhanced — each devotion specifies its Champion-tier restriction increase (e.g., Solara\'s bright light expands to 60 ft, Astraeus takes +2d6 from non-magical instead of +1d6). Cannot switch devotions mid-combat.'
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
          'Limited switches per day (3 per long rest)',
          'Each switch costs 1 AP — a significant action cost',
          'Requires tactical knowledge of devotion matchups',
          'Ultimate abilities do not carry over between devotion switches'
        ],
        
        keyAbilities: [
          'Combat Attunement: Switch devotions for 1 AP (3 uses per long rest)',
          'Devotion Burst: Switching triggers an effect based on new devotion',
          'Astral Mastery: Gain expertise in all devotion mechanics'
        ],
        
        specPassive: {
          name: 'Warrior\'s Versatility',
          description: 'Can switch devotions for 1 AP (3 uses per long rest). Switching devotions triggers a burst effect based on the new devotion. When you switch, your ultimate availability does not reset — if you haven\'t used it yet, it transfers to the new devotion. Gain tactical insight into enemy weaknesses.'
        }
      }
    ]
  },
  
  exampleSpells: TITAN_SPELLS
};
