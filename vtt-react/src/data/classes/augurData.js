/**
 * Augur Class Data
 *
 * Complete class information for the Augur - an Omen Reader who interprets
 * signs and portents, reading even/odd dice results to fuel Benediction
 * and Malediction, reshaping battlefield conditions through divine omen.
 */

export const AUGUR_DATA = {
  id: 'augur',
  name: 'Augur',
  icon: 'fas fa-dove',
  role: 'Control/Debuffer (Omen Reading & Battlefield Alteration)',
  damageTypes: ['psychic', 'radiant'],

  overview: {
    title: 'The Augur',
    subtitle: 'Reader of Signs, Voice of Portent',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: Augurs read the signs woven into every die roll. Every time a d20 hits the table—yours, an ally's, or an enemy's—the result speaks: even numbers fill your **Benediction** bar (boons, buffs, terrain blessings) while odd numbers fill your **Malediction** bar (curses, debuffs, battlefield hazards). You spend these twin resources to reshape the battlefield itself.

**Core Mechanic**: d20 Roll → Even = +1 Benediction, Odd = +1 Malediction → Spend Benediction on boons/terrain blessings, Malediction on curses/hazards/debuffs

**Resource**: Benediction & Malediction (dual bar, spec-dependent maxes: 10/10, 15/5, or 5/15)

**Playstyle**: Tactical control/debuffer who reads omens from every roll and weaponizes them

**Best For**: Players who love reading the battlefield, manipulating terrain and conditions, and turning every die roll into a strategic opportunity`
    },

    description: `Augurs are sacred interpreters who perceive the hidden language of fate woven into every moment. Where others see random chance, Augurs read divine messages in the fall of dice, the flight of birds, and the patterns of wind and flame. They do not predict the future—they read the present, interpreting signs that already exist but only they can perceive, then reshaping reality through those interpretations.`,

    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Augurs are intermediaries between the mortal world and the language of signs. They believe that fate is not a river to be dammed but a text to be read—and rewritten. Every event carries meaning; every coincidence is a message. Some are temple-trained scholars of omen, others are wild-born seers who fell into their gift through near-death experiences. They might be:

**The Temple Augur**: Trained in ancient rites, reading entrails, lots, and sacred dice in formal ceremony
**The Storm Reader**: Interpreting the patterns of weather, bird flight, and natural phenomena
**The Bone Caster**: Throwing bones, stones, or runes and reading the patterns they form
**The Sign Bearer**: One who IS the sign—their mere presence causes omens to manifest
**The War Herald**: Military diviner who reads battlefield conditions as living omens

Augurs speak with weight, knowing that their words carry the power of interpretation. They tend to be observant, methodical, and slightly unnerving—always watching, always interpreting. They see meaning in coincidence and coincidence in meaning, which makes them both invaluable advisors and occasionally exhausting companions.`
    },

    combatRole: {
      title: 'Combat Role',
      content: `In combat, Augurs are control specialists and debuffers who excel at:

**Battlefield Manipulation**: Altering terrain, creating zones of blessing or curse, changing the conditions of engagement
**Omen-Based Debuffs**: Cursing enemies with ill omens that sap their strength, cloud their minds, or turn luck against them
**Benediction Support**: Blessing allies and terrain with favorable omens that enhance abilities and provide protection
**Sign Reading**: Gaining tactical information from interpreting dice rolls, enabling adaptive strategies
**Condition Warfare**: Stacking beneficial and detrimental conditions that reshape the flow of combat

Augurs are not primary damage dealers. They are battlefield architects who read the signs in every roll and convert them into strategic advantages. Where an Oracle predicts and a Gambler manipulates probability, the Augur interprets what IS and reshapes conditions accordingly.`
    },

    playstyle: {
      title: 'Playstyle',
      content: `Augurs reward players who:

**Watch Every Roll**: Every d20 result feeds your resources—even rolls generate Benediction, odd rolls generate Malediction
**Manage Dual Resources**: Balance between spending Benediction (positive effects) and Malediction (negative effects) based on what the dice give you
**Control the Battlefield**: Use terrain alteration, zone creation, and condition effects to shape the fight
**Adapt to Omens**: Your strategy shifts based on what signs appear—sometimes you're blessing-heavy, sometimes curse-heavy
**Think Spatially**: Many Augur abilities affect areas and terrain, rewarding positional awareness

The class creates a unique rhythm where you're constantly generating resources from the natural flow of dice rolls, then spending them to reshape the battlefield. Some turns you'll be a buffer, others a debuffer—the signs decide, and you interpret.`
    },

    immersiveCombatExample: {
      title: 'Combat Example: Reading the Signs',
      content: `**The Setup**: You're an Augur (Harbinger specialization, Benediction max: 5, Malediction max: 15) facing a warband of hobgoblin soldiers and their warchief. Your party is with you. Starting Benediction: 2, Malediction: 3. Starting Mana: 45/55. Your goal: Read the omens in every roll, generate Benediction/Malediction, and use Malediction to crush the enemy with ill portents.

**Starting State**: Benediction: 2/5 | Malediction: 3/15 | Mana: 45/55 | HP: 50/50

**Turn 1 - The First Omen (Benediction: 2→2, Malediction: 3→5)**

*The hobgoblins advance in formation. You pull your sacred dice from their pouch and observe the battlefield. The signs are already speaking.*

**Your Party's Fighter**: Attacks Hobgoblin #1 → d20+6 → [17] → Hit!
**Omen Reading**: 17 is odd → +1 Malediction
**Malediction**: 3 + 1 = **4/15**

**Hobgoblin #1's Attack**: Strikes back at Fighter → d20+5 → [12] → Hit!
**Omen Reading**: 12 is even → +1 Benediction
**Benediction**: 2 + 1 = **3/5**

*You watch the clash. The numbers speak. Odd, even, odd, even—the battlefield is a living text.*

**Your Action**: Cast "Portent of Weakness" on Warchief (8 mana + 3 Malediction)
**Effect**: Target has disadvantage on all attacks for 3 rounds and -2 to Armor

*You point your staff at the warchief. "The signs declare your weakness. Your blade will falter. Your armor will fail." A shimmering dark sigil appears above his head—an omen of ill fortune.*

**Mana**: 45 - 8 = 37/55
**Malediction**: 4 - 3 = **1/15**

**Current State**: Benediction: 3/5 | Malediction: 1/15 | Mana: 37/55 | Warchief: Disadvantage, -2 Armor (3 rounds)

**Turn 2 - The Signs Multiply (Benediction: 3→4, Malediction: 1→4)**

**Your Party's Ranger**: Attacks Hobgoblin #2 → d20+7 → [9] → Miss!
**Omen Reading**: 9 is odd → +1 Malediction
**Malediction**: 1 + 1 = **2/15**

**Your Party's Mage**: Casts Fireball → d20+5 → [14] → Hit on Hobgoblins #2, #3!
**Omen Reading**: 14 is even → +1 Benediction
**Benediction**: 3 + 1 = **4/5**

**Warchief's Turn**: Attacks Fighter (has disadvantage from Portent of Weakness) → d20+8 with DISADVANTAGE → [11, 7] → Take 11 → 11 + 8 = 19 → Hit (Fighter's Armor is 17)

**Omen Reading**: Both 11 and 7 are odd → +2 Malediction
**Malediction**: 2 + 2 = **4/15**

*The warchief's attack still lands, but the portent is working—he had to roll twice and take the worse result. The signs are building.*

**Your Action**: Cast "Terrain of Ruin" centered on the hobgoblin cluster (10 mana + 4 Malediction)
**Effect**: 20ft radius zone becomes cursed terrain—enemies inside take 1d6 psychic damage at the start of each turn and have -10ft movement

*You sweep your staff across the ground. "The earth rejects you. Every step is a curse. Every breath, a burden." The ground darkens, shimmering with maledictory energy.*

**Mana**: 37 - 10 = 27/55
**Malediction**: 4 - 4 = **0/15**

**Current State**: Benediction: 4/5 | Malediction: 0/15 | Mana: 27/55

**Turn 3 - Turning the Tide (Benediction: 4→5→2, Malediction: 0→2)**

*Your party's Fighter and Ranger are taking hits. The hobgoblins are tough. But the signs keep coming.*

**Your Party's Fighter**: Attacks Warchief → d20+6 → [18] → Hit! (even → +1 Benediction, now 5/5)
**Warchief's Armor**: 17 - 2 (Portent of Weakness) = 15. Fighter hits!
**Damage**: 2d8+4 → [7, 6] + 4 = 17 damage

**Your Action**: Spend 3 Benediction to cast "Sign of Protection" on Fighter
**Effect**: Fighter gains +3 Armor and resistance to the next physical damage source

*You trace a radiant sigil in the air over your Fighter. "The omens favor you. Stand firm." A golden shimmer wraps around their armor.*

**Benediction**: 5 - 3 = **2/5**
**Mana**: 27 - 6 = 21/55

**Hobgoblin #3**: Enters Terrain of Ruin → takes 1d6 psychic → [4] damage
**Hobgoblin #3**: Attacks Ranger → d20+5 → [13] → odd → +1 Malediction
**Malediction**: 0 + 1 = **1/15**

**Hobgoblin #2**: Enters Terrain of Ruin → takes 1d6 psychic → [3] damage
**Hobgoblin #2**: Attacks Mage → d20+5 → [5] → odd → +1 Malediction
**Malediction**: 1 + 1 = **2/15**

*The cursed terrain bites at the hobgoblins. They stagger, their movements sluggish. The signs are turning.*

**Current State**: Benediction: 2/5 | Malediction: 2/15 | Mana: 21/55

**Turn 4 - The Final Portent (Benediction: 2→3, Malediction: 2→4→1)**

**Your Party's Mage**: Casts Lightning Bolt at Warchief → d20+5 → [11] → odd → +1 Malediction (now 3/15)
**Damage**: 6d6 → [5, 4, 6, 3, 5, 4] = 27 lightning damage

**Warchief**: Barely alive. Attacks Fighter again (still has disadvantage) → d20+8 DISADV → [8, 15] → Take 8 → 8+8 = 16 → Miss! (Fighter's Armor is 17+3 from Sign of Protection = 20)

**Omen Reading**: 8 is even → +1 Benediction, 15 is odd → +1 Malediction
**Benediction**: 2 + 1 = **3/5**
**Malediction**: 3 + 1 = **4/15**

*The warchief's blade slides off the blessed armor. Your Sign of Protection held. The portent of weakness made him roll poorly. The omens are overwhelming.*

**Your Action**: You want Grand Malediction (20 mana, 6 Malediction) but you only have 4 Malediction. **This is the core tension**—you spent your Malediction on earlier debuffs. Instead, recast "Portent of Weakness" (8 mana + 3 Malediction) to keep the warchief suppressed.

**Mana**: 21 - 8 = 13/55
**Malediction**: 4 - 3 = **1/15**

*You renew the portent. The dark sigil intensifies. He won't land another clean hit.*

**Warchief's Save**: d20+3 → [14] → 14+3 = 17 vs DC 16 → FAIL (barely)!
**Effect**: Disadvantage on attacks and -2 Armor for 3 more rounds.

**Your Party's Fighter**: Finishing blow on the weakened Warchief → d20+6 → [16] → Hit!
**Damage**: 2d8+4 → [8, 7] + 4 = 19 damage → Warchief FALLS

**Omen Reading**: 16 is even → +1 Benediction
**Benediction**: 3 + 1 = **4/5**

**Combat Effectively Over**

*The remaining hobgoblins, seeing their warchief struck down by divine portent, break and flee through the cursed terrain, taking damage with every step.*

**Your Party's Ranger**: "You... you read every roll. You knew when to curse and when to bless."
**You**: "I didn't know. I interpreted. The 17 on your hit—odd—I read it as a sign of weakness in our enemies, so I fueled my Malediction. The 12 on the warchief's attack—even—I read it as a sign of fortune for our side, fueling my Benediction. Every number is a message. I simply listened."

**Final State**: Benediction: 4/5 | Malediction: 1/15 | Mana: 13/55 | HP: 50/50

**The Lesson**: Augur gameplay is about:
1. **Omen Generation**: Every d20 roll feeds your bars. 17 (odd) → +1 Malediction. 12 (even) → +1 Benediction. Combat generates resources constantly.
2. **Resource Interpretation**: The dice decide what you have more of. Adapt your strategy—if Malediction is full, debuff; if Benediction is full, buff.
3. **Battlefield Control**: Terrain of Ruin turned a 20ft area into a hazard zone. Portent of Weakness made the warchief roll with disadvantage.
4. **Resource Budgeting**: You spent 10 Malediction total (Turn 1: 3 on Portent of Weakness, Turn 2: 4 on Terrain of Ruin, Turn 4: 3 on renewed Portent of Weakness) and 3 Benediction (on Sign of Protection). You couldn't afford Grand Malediction (6 Mal) because you'd spent your Malediction on earlier debuffs. **This is the core tension**—spend resources as they come, or save for a big finish?
5. **Omen Debt**: At the end of the day, if you have unused Benediction/Malediction, you'll suffer Omen Debt—stacking -1 to all rolls per unused point the next day (cap -10). The signs demand to be used. In this fight you ended with 1 Malediction and 4 Benediction unused—if the day ended now, you'd face -5 to all rolls tomorrow. Better find another fight or spend those resources on Omen Rituals.`
    }
  },

  resourceSystem: {
    title: 'Benediction & Malediction',
    subtitle: 'The Omen Interpreter\'s Dual Resource',

    description: `The Augur's power flows from interpreting the signs embedded in every die roll. When any d20 is rolled by a creature within 60 feet that you can see and are aware of, the result carries an omen: **even numbers generate Benediction** (positive, blessing energy) while **odd numbers generate Malediction** (negative, cursing energy). These twin resources power every Augur ability—Benediction fuels boons, terrain blessings, and protective signs, while Malediction fuels curses, debuffs, battlefield hazards, and ill portents.

**Overflow**: When a resource is at its maximum, further generation of that resource is lost—only the unfilled resource benefits from future rolls.

**Advantage/Disadvantage**: When a creature rolls with advantage or disadvantage, both d20 rolls generate resources independently (two rolls = two potential resource gains).`,

    cards: [
      {
        title: 'Benediction (Even Omens)',
        stats: 'Max: 10/10 | 15/5 | 5/15',
        details: 'Generated from even d20 results. Powers boons, terrain blessings, protective signs, and ally enhancements. The light side of interpretation.'
      },
      {
        title: 'Malediction (Odd Omens)',
        stats: 'Max: 10/10 | 5/15 | 15/5',
        details: 'Generated from odd d20 results. Powers curses, debuffs, battlefield hazards, ill portents, and enemy weakening. The dark side of interpretation.'
      },
      {
        title: 'Omen Debt',
        stats: 'End-of-Day Penalty',
        details: 'Unused Benediction or Malediction at day\'s end incurs Omen Debt: -1 to all rolls per unused point, carried to the next day. The signs demand to be used.'
      }
    ],

    generationTable: {
      headers: ['Source', 'Gain', 'Notes'],
      rows: [
        ['Any d20 Roll (Even Result)', '+1 Benediction', 'Any d20 rolled by a creature within 60ft that you can see and are aware of—yours, allies, enemies'],
        ['Any d20 Roll (Odd Result)', '+1 Malediction', 'Includes attacks, saves, ability checks, death saves'],
        ['Advantage/Disadvantage', '+1 per die', 'Both d20 rolls from advantage/disadvantage generate resources independently'],
        ['Combat Start Passive', '1d4 Benediction + 1d4 Malediction', 'Roll at start of each combat encounter'],
        ['Omen Ritual (Out of Combat)', '+2 to either', 'Spend 10 minutes reading signs (once per short rest)'],
        ['Critical Hit (natural 20)', '+2 Benediction', 'Natural 20 is the ultimate good omen'],
        ['Critical Fail (natural 1)', '+2 Malediction', 'Natural 1 is the ultimate ill omen'],
        ['Short Rest', 'Reset to 0', 'Resources reset to 0. No Omen Debt is incurred.'],
        ['Long Rest (End of Day)', 'Omen Debt check', 'Unused resources incur Omen Debt (see below)']
      ]
    },

    usage: {
      momentum: 'Early combat generates resources rapidly as multiple d20s are rolled. Watch the flow—if Malediction is building faster, focus on debuffing enemies. If Benediction leads, bless your allies.',
      flourish: 'The Augur thrives in large combats with many participants. More d20 rolls = more omens = more resources. Position yourself where you can observe the most rolls.'
    },

    overheatRules: {
      title: 'Omen Debt',
      content: `At the end of each day (long rest), any unused Benediction or Malediction incurs **Omen Debt**:

**The Penalty**: For each point of combined unused Benediction + Malediction, you suffer **-1 to all d20 rolls** the following day. This penalty stacks and applies to attacks, saves, ability checks, and death saves.

**Example**: If you end the day with 3 Benediction and 2 Malediction unused, you start the next day with **-5 to all d20 rolls** until your next long rest.

**The Philosophy**: The signs spoke and you ignored them. The fates do not forgive wasted omens—every unread sign becomes a burden.

**Omen Debt Cap**: Maximum penalty is -10. Any excess unused points beyond 10 are simply lost.

**Clearing Debt**: Omen Debt persists until the NEXT long rest. During that day, you generate resources normally but suffer the penalty on all rolls.`
    },

    strategicConsiderations: {
      title: 'Reading the Battlefield',
      content: `**Resource Imbalance Is Intentional**: You will almost never have equal Benediction and Malediction. The dice decide. Adapt your strategy to what the signs give you.

**High Benediction, Low Malediction**: Focus on buffing allies, creating blessed terrain, and protective signs. Play support.

**High Malediction, Low Benediction**: Focus on cursing enemies, creating hazardous terrain, and ill portents. Play control.

**Balanced Resources**: Use abilities that spend both (some spells cost both Benediction and Malediction for powerful combined effects).

**The "Omen Economy"**: In a typical round of combat with 4 participants, expect 4-8 d20 rolls. That's 4-8 resource points generated per round. Plan your spending around this rate.

**End-of-Day Management**: As the day winds down, be aggressive with your remaining resources. Better to spend them on minor effects than suffer Omen Debt tomorrow.

**Specialization Impact**: Auspex (10/10 balanced) adapts easily. Harbinger (5/15) will almost always have more Malediction—embrace the dark omens. Hierophant (15/5) will overflow with Benediction—become a beacon of good fortune.

**Concentration Management**: Many of the Augur's most powerful effects (Terrain of Ruin, Portent of Weakness, Sacred Ground, Field of Misfortune, Hierophant's Domain) require concentration. You can only maintain ONE concentration spell at a time. This means you cannot stack terrain effects with sustained debuffs. Choose wisely: a persistent zone effect that damages and slows enemies, or a focused debuff that shuts down a single target. Non-concentration spells (Sign of Protection, Grand Malediction, Omen Bolt) can be cast freely while concentrating.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'The Omen Board',
      content: `The Augur is one of the most tactile classes when played in person.

**Required Materials**:
- **Two stacks of tokens**: Gold/white for Benediction, dark/purple for Malediction
- **An Omen Board**: A small cloth or card divided into two halves (Benediction side, Malediction side)
- **A "Debt" marker**: A red token or cloth for tracking Omen Debt

**The Physical Hack**:
- **The Omen Board**: Place your board in front of you. When a d20 is rolled and lands even, add a gold token to the Benediction side. Odd? Purple token to the Malediction side.
- **The "Sign Flash"**: When spending Benediction, physically move a gold token to the center of the table (the "Sign"). When spending Malediction, move a purple token. The pile of spent tokens becomes a visual record of how the battle's omens have been interpreted.
- **The Debt Counter**: At day's end, count unused tokens. Move that many red markers to your character sheet. The physical weight of those markers reminds you of the penalty every time you roll.

**Pro Tip**: Use different-sized tokens for Benediction (small gold beads) and Malediction (small dark stones). The visual and textural contrast makes resource management intuitive without constant counting.`
    }
  },

  specializations: {
    title: 'Augur Specializations',
    subtitle: 'Three Paths of Omen Interpretation',

    description: `Every Augur chooses one of three paths that define how they interpret and apply omens. Auspices read balanced signs and adapt to any situation. Harbingers specialize in dark portents, weaponizing ill omens into devastating debuffs. Hierophants channel cosmic signs into terrain-altering battlefield control and powerful blessings.`,

    passiveAbility: {
      name: 'Omen Sight',
      description: 'All Augurs can see the omen value of any d20 roll within 60 feet. You intuitively know whether a roll was even or odd and gain the corresponding resource. You also start each combat with a passive omen roll: roll 1d4 Benediction and 1d4 Malediction. Finally, you can sense when a supernatural effect is altering probability within 30 feet (though not what the effect is).'
    },

    specs: [
      {
        id: 'auspex',
        name: 'Auspex',
        icon: 'Radiant/Radiant Beam',
        color: '#F0E68C',
        theme: 'Balanced Omen Interpretation & Adaptive Strategy',

        description: `Auspices are balanced interpreters who read both good and ill omens with equal facility. Their dual resource bars are equally sized (10/10), allowing them to adapt to any situation the signs present. They are the most versatile Augurs, capable of shifting between blessing and cursing as the omens demand.`,

        playstyle: 'Balanced resource management, adaptive strategy, versatile support/control, responsive omen interpretation',

        strengths: [
          'Equal Benediction and Malediction caps (10/10) provide maximum flexibility',
          'Can efficiently use ANY spell regardless of resource cost',
          'Passive: When a d20 roll generates one resource type, gain +1 of the opposite type as well (even roll → 1 Benediction + 1 Malediction; odd roll → 1 Malediction + 1 Benediction)',
          'Access to unique "Balanced Sign" abilities that spend equal amounts of both resources',
          'Best at adapting strategy mid-combat based on omen flow'
        ],

        weaknesses: [
          'Neither bar is large enough for the most expensive single-resource spells',
          'Must be adaptable—cannot specialize in one approach',
          'Less efficient when combat heavily favors one omen type',
          'Jack-of-all-trades means less power in any single direction'
        ],

        specPassive: {
          name: 'Harmonic Interpretation',
          description: 'When a d20 roll generates Benediction or Malediction, you also gain +1 of the opposite resource type (even roll → 1 Benediction + 1 Malediction; odd roll → 1 Malediction + 1 Benediction). This means every d20 roll generates both resources equally. Additionally, when you spend both Benediction and Malediction on the same spell, the spell\'s effects are enhanced by 50% (rounded up for dice, +50% for flat values).'
        },

        keyAbilities: [
          'Balanced Sign: Spend 3 Benediction + 3 Malediction to create a zone that buffs allies AND debuffs enemies simultaneously (15ft radius)',
          'Omen Synthesis: Convert 2 points of one resource into 1 point of the other (once per round)',
          'Harmonic Strike: Attack dealing 2d8 radiant + 2d8 psychic damage, cost 2 Benediction + 2 Malediction'
        ],

        recommendedFor: 'Players who enjoy adaptive gameplay and want to use both sides of the omen system equally'
      },

      {
        id: 'harbinger',
        name: 'Harbinger',
        icon: 'Necrotic/Necrotic Skull',
        color: '#8B008B',
        theme: 'Dark Portents & Ill Omen Warfare',

        description: `Harbingers specialize in reading and weaponizing dark omens. Their Malediction bar is massive (15) while Benediction is limited (5), reflecting their focus on cursing, debuffing, and bringing ill fortune to their enemies. They are the most aggressive Augurs, turning every odd roll into a weapon of misfortune.`,

        playstyle: 'Debuff-focused, curse stacking, enemy weakening, dark omen warfare, aggressive control',

        strengths: [
          'Massive Malediction cap (15) enables the most powerful curses and debuffs',
          'Passive: Odd d20 rolls generate +1 bonus Malediction (double generation on odds)',
          'Access to unique "Dark Portent" abilities that stack multiple debuffs',
          'Malediction-powered abilities are stronger than equivalent Benediction ones',
          'Excels at single-target enemy shutdown through layered curses'
        ],

        weaknesses: [
          'Very limited Benediction (5) restricts buffing and healing options',
          'Nearly all abilities focus on harming enemies rather than helping allies',
          'Omen Debt is especially punishing since Malediction overflow is common',
          'Less effective against enemies immune to debuffs or conditions'
        ],

        specPassive: {
          name: 'Dark Portent',
          description: 'Every odd d20 roll generates +1 bonus Malediction (2 total per odd roll instead of 1). Additionally, your Malediction-powered spells impose a stacking "Ill Omen" debuff: -1 to all rolls per stack (max 3 stacks). These stacks last until the target takes a short rest or is targeted by a Benediction effect.'
        },

        keyAbilities: [
          'Grand Malediction: Spend 5+ Malediction to place a devastating curse (scale effects with cost)',
          'Field of Misfortune: Spend 6 Malediction to create 30ft zone where enemies have -2 to all rolls',
          'Omen of Death: Spend 8 Malediction to mark a target—next time they roll a natural 1, they take critical damage'
        ],

        recommendedFor: 'Players who love debuffing enemies and weaponizing bad luck'
      },

      {
        id: 'hierophant',
        name: 'Hierophant',
        icon: 'Radiant/Radiant Golden Shield',
        color: '#FFD700',
        theme: 'Cosmic Signs & Battlefield Transformation',

        description: `Hierophants channel cosmic signs into reality-altering blessings and terrain manipulation. Their Benediction bar is massive (15) while Malediction is limited (5), reflecting their focus on blessing allies, creating sacred terrain, and reshaping battlefield conditions. They are the most supportive Augurs, turning every even roll into a miracle.`,

        playstyle: 'Terrain manipulation, battlefield control through blessings, ally enhancement, sacred zone creation',

        strengths: [
          'Massive Benediction cap (15) enables the most powerful blessings and terrain effects',
          'Passive: Even d20 rolls generate +1 bonus Benediction (double generation on evens)',
          'Access to unique "Sacred Terrain" abilities that reshape the battlefield',
          'Benediction-powered abilities create lasting zone effects that benefit the whole party',
          'Excels at pre-combat preparation and battlefield setup'
        ],

        weaknesses: [
          'Very limited Malediction (5) restricts cursing and debuffing options',
          'Less direct enemy interaction—focuses on enabling allies rather than hindering foes',
          'Benediction abilities are proactive and require planning to maximize',
          'Less effective in reactive situations where enemies dictate the flow'
        ],

        specPassive: {
          name: 'Cosmic Channel',
          description: 'Every even d20 roll generates +1 bonus Benediction (2 total per even roll instead of 1). Additionally, your Benediction-powered terrain/zones last 2 additional rounds and their radius increases by 5ft. Allies within your blessed terrain gain +1 to all saves.'
        },

        keyAbilities: [
          'Sacred Ground: Spend 5+ Benediction to create blessed terrain that heals and buffs allies (scale with cost)',
          'Sign of Warding: Spend 4 Benediction to grant all allies within 20ft +2 Armor for 3 rounds',
          'Hierophant\'s Domain: Spend 8 Benediction to create a 40ft sacred zone that provides immunity to fear, advantage on saves, and 1d4 radiant healing per round'
        ],

        recommendedFor: 'Players who love battlefield control through terrain manipulation and party-wide buffs'
      }
    ]
  },

  exampleSpells: [
    {
      id: 'augur_read_the_signs',
      name: 'Read the Signs',
      description: 'Observe the immediate omens around a target, learning their vulnerabilities.',
      spellType: 'ACTION',
      icon: 'Utility/Watchful Eye',
      school: 'divination',
      level: 1,
      specialization: 'universal',
      effectTypes: ['utility'],
      typeConfig: { school: 'divination', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'single', rangeDistance: 60, targetRestrictions: ['any'] },
      resourceCost: { actionPoints: 1, mana: 4 },
      resolution: 'AUTOMATIC',
      utilityConfig: {
        utilityType: 'divination',
        utilitySubtype: 'identification',
        effects: [
          { id: 'vulnerability_read', name: 'Reveal Vulnerability', description: 'Learn one vulnerability, resistance, or immunity', mechanicsText: '' }
        ]
      },
      tags: ['divination', 'information', 'universal', 'omen']
    },
    {
      id: 'augur_omen_shield',
      name: 'Omen Shield',
      description: 'Intercept an incoming attack with a flash of omen energy.',
      spellType: 'REACTION',
      icon: 'Radiant/Radiant Golden Shield',
      school: 'radiant',
      level: 1,
      specialization: 'universal',
      effectTypes: ['buff'],
      typeConfig: { school: 'radiant', castTime: '1 reaction', castTimeType: 'reaction' },
      targetingConfig: { targetingType: 'single', rangeDistance: 30, targetRestrictions: ['allies'] },
      resourceCost: {
        actionPoints: 0,
        mana: 3,
        classResource: { type: 'benediction', cost: 1 }
      },
      resolution: 'AUTOMATIC',
      buffConfig: {
        buffType: 'damageMitigation',
        effects: [
          { id: 'omen_shield_mitigation', name: 'Omen Shield', description: 'Reduce damage by 1d8 + Spirit', mechanicsText: '' }
        ],
        durationType: 'instant'
      },
      tags: ['reaction', 'protection', 'universal', 'omen']
    },
    {
      id: 'augur_minor_portent',
      name: 'Minor Portent',
      description: 'Whisper a minor omen that clouds a target\'s judgment.',
      spellType: 'ACTION',
      icon: 'Void/All Seeing Eye',
      school: 'psychic',
      level: 1,
      specialization: 'harbinger',
      effectTypes: ['debuff'],
      typeConfig: { school: 'psychic', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'single', rangeDistance: 30, targetRestrictions: ['enemies'] },
      resourceCost: {
        actionPoints: 1,
        mana: 3,
        classResource: { type: 'malediction', cost: 2 }
      },
      resolution: 'SAVING_THROW',
      savingThrow: { ability: 'spirit', difficultyClass: 'SPELL_DC', saveOutcome: 'negates' },
      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'minor_portent_effect',
          name: 'Minor Portent',
          description: '-1 to attack rolls',
          mechanicsText: ''
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },
      tags: ['debuff', 'curse', 'harbinger', 'omen']
    },
    {
      id: 'augur_sign_of_clarity',
      name: 'Sign of Clarity',
      description: 'Trace a radiant sigil that blesses an ally with clarity of purpose.',
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Beam',
      school: 'radiant',
      level: 1,
      specialization: 'hierophant',
      effectTypes: ['buff'],
      typeConfig: { school: 'radiant', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'single', rangeDistance: 30, targetRestrictions: ['allies'] },
      resourceCost: {
        actionPoints: 1,
        mana: 3,
        classResource: { type: 'benediction', cost: 2 }
      },
      resolution: 'AUTOMATIC',
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [
          { id: 'clarity_buff', name: 'Clarity', description: '+1 to next attack or check', mechanicsText: '' }
        ],
        durationType: 'rounds', durationValue: 2, durationUnit: 'rounds'
      },
      tags: ['buff', 'blessing', 'hierophant', 'omen']
    },

    // ===== LEVEL 2 SPELLS =====
    {
      id: 'augur_portent_of_weakness',
      name: 'Portent of Weakness',
      description: 'Declare a portent of weakness over a target, sapping their strength and clouding their combat instincts.',
      spellType: 'ACTION',
      icon: 'Necrotic/Necrotic Decay 1',
      school: 'Enchantment',
      level: 2,
      specialization: 'harbinger',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 40,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false,
        allowSelf: false
      },

      resourceCost: {
        actionPoints: 2,
        mana: 8,
        malediction: 3,
        components: ['verbal', 'somatic'],
        description: 'Spend 3 Malediction to declare weakness'
      },

      duration: {
        value: 3,
        unit: 'rounds',
        concentration: true
      },

      resolution: 'SAVING_THROW',

      savingThrow: {
        ability: 'SPIRIT',
        dc: 'SPELL_DC',
        onSave: 'Target resists the portent',
        onFail: 'Target has disadvantage on all attacks and -2 to Armor for duration'
      },

      effectTypes: ['debuff'],

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'portent_of_weakness',
          name: 'Portent of Weakness',
          description: 'Weakened by ill portent — disadvantage on attacks, -2 Armor',
          statusType: 'cursed',
          level: 'major'
        }],
        durationValue: 3,
        durationType: 'rounds',
        saveType: 'spirit',
        saveOutcome: 'negates'
      },

      tags: ['debuff', 'curse', 'harbinger', 'omen', 'concentration']
    },

    {
      id: 'augur_terrain_of_ruin',
      name: 'Terrain of Ruin',
      description: 'Consecrate a zone with dark omen energy, causing the ground itself to reject your enemies.',
      spellType: 'ACTION',
      icon: 'Nature/Thorny Entanglement',
      school: 'Transmutation',
      level: 2,
      specialization: 'harbinger',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'AREA',
        range: 40,
        rangeUnit: 'feet',
        areaType: 'radius',
        areaSize: 20,
        requiresLineOfSight: true
      },

      resourceCost: {
        actionPoints: 2,
        mana: 10,
        malediction: 4,
        components: ['verbal', 'somatic', 'material'],
        description: 'Spend 4 Malediction to curse terrain'
      },

      duration: {
        value: 5,
        unit: 'rounds',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Enemies in zone take 1d6 psychic damage at start of each turn and have -10ft movement',
        secondary: 'Enemies entering the zone must make a Spirit save or be frightened for 1 round'
      },

      tags: ['terrain', 'curse', 'harbinger', 'area', 'omen', 'concentration']
    },

    {
      id: 'augur_sign_of_protection',
      name: 'Sign of Protection',
      description: 'Trace a protective sigil around an ally, using Benediction to shield them from harm.',
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Golden Shield',
      school: 'Abjuration',
      level: 2,
      specialization: 'hierophant',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 30,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: true,
        allowSelf: true
      },

      resourceCost: {
        actionPoints: 2,
        mana: 6,
        benediction: 3,
        components: ['verbal', 'somatic'],
        description: 'Spend 3 Benediction to grant protection'
      },

      duration: {
        value: 4,
        unit: 'rounds',
        concentration: false
      },

      resolution: 'AUTOMATIC',

      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'sign_of_protection',
          name: 'Sign of Protection',
          description: 'Blessed with protective omen — +3 Armor',
          statModifier: {
            stat: 'armor',
            magnitude: 3,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 4,
        durationType: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      tags: ['buff', 'blessing', 'hierophant', 'omen', 'protection']
    },

    // ===== LEVEL 3 SPELLS =====
    {
      id: 'augur_omen_bolt',
      name: 'Omen Bolt',
      description: 'Channel raw omen energy into a bolt of psychic and radiant force that strikes a target.',
      spellType: 'ACTION',
      icon: 'Psychic/Psionic Strike',
      school: 'Evocation',
      level: 3,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 60,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false,
        allowSelf: false
      },

      resourceCost: {
        actionPoints: 2,
        mana: 15,
        components: ['verbal', 'somatic'],
        description: 'Channel omen energy into a damaging bolt'
      },

      damageConfig: {
        formula: '3d8',
        elementType: 'psychic',
        damageType: 'direct',
        secondaryDamage: {
          formula: '1d8',
          elementType: 'radiant',
          condition: 'If the damage roll total is even, deal additional radiant damage'
        }
      },

      duration: {
        value: 0,
        unit: 'instant',
        concentration: false
      },

      resolution: 'DICE',

      tags: ['damage', 'psychic', 'radiant', 'universal', 'omen']
    },

    {
      id: 'augur_harbinger_gaze',
      name: 'Harbinger\'s Gaze',
      description: 'Fix your gaze upon a target, filling their mind with dark portents that sap their will to fight.',
      spellType: 'ACTION',
      icon: 'Psychic/Hypnotic Eye',
      school: 'Enchantment',
      level: 3,
      specialization: 'harbinger',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 30,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false,
        allowSelf: false
      },

      resourceCost: {
        actionPoints: 2,
        mana: 14,
        malediction: 5,
        components: ['verbal', 'somatic'],
        description: 'Spend 5 Malediction to overwhelm with dark portent'
      },

      duration: {
        value: 4,
        unit: 'rounds',
        concentration: true
      },

      resolution: 'SAVING_THROW',

      savingThrow: {
        ability: 'SPIRIT',
        dc: 'SPELL_DC',
        onSave: 'Target is rattled but resists full effect',
        onFail: 'Target is frightened and has -2 to all rolls for duration'
      },

      effectTypes: ['debuff', 'damage'],

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'harbinger_gaze',
          name: 'Harbinger\'s Gaze',
          description: 'Consumed by dark portent — frightened, -2 to all rolls',
          statusType: 'frightened',
          level: 'major'
        }],
        durationValue: 4,
        durationType: 'rounds',
        saveType: 'spirit',
        saveOutcome: 'partial'
      },

      damageConfig: {
        formula: '2d6',
        elementType: 'psychic',
        damageType: 'direct'
      },

      tags: ['debuff', 'frightened', 'harbinger', 'omen', 'concentration']
    },

    {
      id: 'augur_sacred_ground',
      name: 'Sacred Ground',
      description: 'Consecrate an area with pure omen energy, creating a zone of divine blessing.',
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Blessing 1',
      school: 'Transmutation',
      level: 3,
      specialization: 'hierophant',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'AREA',
        range: 30,
        rangeUnit: 'feet',
        areaType: 'radius',
        areaSize: 15,
        requiresLineOfSight: true
      },

      resourceCost: {
        actionPoints: 2,
        mana: 16,
        benediction: 5,
        components: ['verbal', 'somatic', 'material'],
        description: 'Spend 5 Benediction to consecrate terrain'
      },

      duration: {
        value: 5,
        unit: 'rounds',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'zone',
        effects: [{
          id: 'sacred_ground',
          name: 'Sacred Ground',
          description: 'Allies in zone gain +1 to all saves and heal 1d4 at start of turn',
          statModifier: {
            stat: 'all_saves',
            magnitude: 1,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 5,
        durationType: 'rounds',
        concentrationRequired: true
      },

      tags: ['terrain', 'buff', 'hierophant', 'area', 'omen', 'concentration', 'healing']
    },

    // ===== LEVEL 4 SPELLS =====
    {
      id: 'augur_grand_malediction',
      name: 'Grand Malediction',
      description: 'Unleash a devastating malediction that overwhelms a target with accumulated ill omens.',
      spellType: 'ACTION',
      icon: 'Necrotic/Necrotic Skull',
      school: 'Necromancy',
      level: 4,
      specialization: 'harbinger',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 50,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false,
        allowSelf: false
      },

      resourceCost: {
        actionPoints: 2,
        mana: 20,
        malediction: 6,
        components: ['verbal', 'somatic'],
        description: 'Spend 6 Malediction to unleash grand malediction'
      },

      duration: {
        value: 0,
        unit: 'instant',
        concentration: false
      },

      resolution: 'SAVING_THROW',

      savingThrow: {
        ability: 'SPIRIT',
        dc: 'SPELL_DC',
        onSave: 'Half damage, not paralyzed',
        onFail: 'Full damage and paralyzed for 1 round'
      },

      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '5d8',
        elementType: 'psychic',
        damageType: 'direct'
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'grand_malediction',
          name: 'Grand Malediction',
          description: 'Overwhelmed by ill omens — paralyzed for 1 round',
          statusType: 'paralyzed',
          level: 'major'
        }],
        durationValue: 1,
        durationType: 'rounds',
        saveType: 'spirit',
        saveOutcome: 'negates_debuff'
      },

      tags: ['damage', 'psychic', 'harbinger', 'omen', 'paralyze']
    },

    {
      id: 'augur_balanced_sign',
      name: 'Balanced Sign',
      description: 'Channel both Benediction and Malediction into a single powerful effect that simultaneously blesses allies and curses enemies.',
      spellType: 'ACTION',
      icon: 'Arcane/Magical Staff',
      school: 'Transmutation',
      level: 4,
      specialization: 'auspex',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'AREA',
        range: 40,
        rangeUnit: 'feet',
        areaType: 'radius',
        areaSize: 20,
        requiresLineOfSight: true
      },

      resourceCost: {
        actionPoints: 2,
        mana: 18,
        benediction: 3,
        malediction: 3,
        components: ['verbal', 'somatic'],
        description: 'Spend 3 Benediction + 3 Malediction for balanced effect'
      },

      duration: {
        value: 3,
        unit: 'rounds',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Allies in zone gain +2 to attack rolls. Enemies in zone suffer -2 to attack rolls.',
        secondary: 'Harmonic Interpretation bonus: values become +3/-3 instead of +2/-2'
      },

      tags: ['buff', 'debuff', 'auspex', 'area', 'omen', 'concentration']
    },

    {
      id: 'augur_hierophants_ward',
      name: 'Hierophant\'s Ward',
      description: 'Create a powerful ward around all nearby allies, shielding them with concentrated Benediction energy.',
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Golden Shield',
      school: 'Abjuration',
      level: 4,
      specialization: 'hierophant',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SELF_CENTERED',
        range: 0,
        rangeUnit: 'self',
        areaType: 'radius',
        areaSize: 20
      },

      resourceCost: {
        actionPoints: 2,
        mana: 20,
        benediction: 5,
        components: ['verbal', 'somatic'],
        description: 'Spend 5 Benediction to ward all nearby allies'
      },

      duration: {
        value: 3,
        unit: 'rounds',
        concentration: false
      },

      resolution: 'AUTOMATIC',

      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'hierophants_ward',
          name: 'Hierophant\'s Ward',
          description: 'Warded by sacred omen — +2 Armor, advantage on saves against fear',
          statModifier: {
            stat: 'armor',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 3,
        durationType: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      tags: ['buff', 'blessing', 'hierophant', 'area', 'omen', 'protection']
    },

    // ===== LEVEL 5 SPELLS =====
    {
      id: 'augur_omen_storm',
      name: 'Omen Storm',
      description: 'Unleash a storm of conflicting omens across the battlefield, dealing damage and creating chaos.',
      spellType: 'ACTION',
      icon: 'Nature/Nature Wild 2',
      school: 'Evocation',
      level: 5,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'AREA',
        range: 50,
        rangeUnit: 'feet',
        areaType: 'radius',
        areaSize: 25,
        requiresLineOfSight: true
      },

      resourceCost: {
        actionPoints: 2,
        mana: 25,
        benediction: 3,
        malediction: 3,
        components: ['verbal', 'somatic', 'material'],
        description: 'Spend 3 Benediction + 3 Malediction to summon omen storm'
      },

      duration: {
        value: 0,
        unit: 'instant',
        concentration: false
      },

      resolution: 'SAVING_THROW',

      savingThrow: {
        ability: 'AGILITY',
        dc: 'SPELL_DC',
        onSave: 'Half damage',
        onFail: 'Full damage and rattled for 1 round'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '6d8',
        elementType: 'psychic',
        damageType: 'direct',
        secondaryDamage: {
          formula: '3d8',
          elementType: 'radiant',
          condition: 'Against undead or fiends'
        }
      },

      tags: ['damage', 'area', 'universal', 'omen', 'storm']
    },

    {
      id: 'augur_field_of_misfortune',
      name: 'Field of Misfortune',
      description: 'Create a wide zone of concentrated ill omen that saps the strength and will of all enemies within.',
      spellType: 'ACTION',
      icon: 'Void/Black Hole',
      school: 'Transmutation',
      level: 5,
      specialization: 'harbinger',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'AREA',
        range: 50,
        rangeUnit: 'feet',
        areaType: 'radius',
        areaSize: 30,
        requiresLineOfSight: true
      },

      resourceCost: {
        actionPoints: 2,
        mana: 24,
        malediction: 8,
        components: ['verbal', 'somatic'],
        description: 'Spend 8 Malediction to create field of misfortune'
      },

      duration: {
        value: 5,
        unit: 'rounds',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Enemies in zone have -2 to all d20 rolls',
        secondary: 'Enemies who start their turn in the zone take 2d6 psychic damage'
      },

      tags: ['debuff', 'terrain', 'harbinger', 'area', 'omen', 'concentration']
    },

    {
      id: 'augur_hierophants_domain',
      name: 'Hierophant\'s Domain',
      description: 'Transform a massive area into sacred ground, providing powerful blessings to all allies within.',
      spellType: 'ACTION',
      icon: 'Radiant/Divine Halo',
      school: 'Transmutation',
      level: 5,
      specialization: 'hierophant',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'AREA',
        range: 40,
        rangeUnit: 'feet',
        areaType: 'radius',
        areaSize: 40,
        requiresLineOfSight: true
      },

      resourceCost: {
        actionPoints: 2,
        mana: 28,
        benediction: 8,
        components: ['verbal', 'somatic', 'material'],
        description: 'Spend 8 Benediction to create hierophant\'s domain'
      },

      duration: {
        value: 5,
        unit: 'rounds',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Allies in zone: immunity to fear, advantage on all saves, +1d4 radiant healing at start of turn',
        secondary: 'Cosmic Channel bonus: zone lasts 7 rounds and radius is 45ft instead of 40ft'
      },

      tags: ['buff', 'terrain', 'hierophant', 'area', 'omen', 'concentration', 'healing']
    },

    // ===== LEVEL 6 SPELLS =====
    {
      id: 'augur_omen_shatter',
      name: 'Omen Shatter',
      description: 'Shatter the omens surrounding a target, detonating them as a burst of pure psychic and radiant energy.',
      spellType: 'ACTION',
      icon: 'Arcane/Swirling Vortex',
      school: 'Evocation',
      level: 6,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 60,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false,
        allowSelf: false
      },

      resourceCost: {
        actionPoints: 2,
        mana: 30,
        benediction: 4,
        malediction: 4,
        components: ['verbal', 'somatic'],
        description: 'Spend 4 Benediction + 4 Malediction to shatter omens'
      },

      damageConfig: {
        formula: '8d8',
        elementType: 'psychic',
        damageType: 'direct'
      },

      duration: {
        value: 0,
        unit: 'instant',
        concentration: false
      },

      resolution: 'DICE',

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['damage', 'psychic', 'radiant', 'universal', 'omen']
    },

    {
      id: 'augur_curse_of_the_unlucky',
      name: 'Curse of the Unlucky',
      description: 'Place a devastating curse that turns all fortune against a target, making even their successes sour.',
      spellType: 'ACTION',
      icon: 'Necrotic/Necrotic Decay 1',
      school: 'Enchantment',
      level: 6,
      specialization: 'harbinger',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 40,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false,
        allowSelf: false
      },

      resourceCost: {
        actionPoints: 2,
        mana: 28,
        malediction: 10,
        components: ['verbal', 'somatic', 'material'],
        description: 'Spend 10 Malediction to curse with misfortune'
      },

      duration: {
        value: 1,
        unit: 'minute',
        concentration: true
      },

      resolution: 'SAVING_THROW',

      savingThrow: {
        ability: 'SPIRIT',
        dc: 'SPELL_DC',
        onSave: 'Curse is resisted',
        onFail: 'Target is cursed—all d20 rolls that are odd count as natural 1s for critical failure purposes'
      },

      effectTypes: ['debuff'],

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'curse_of_the_unlucky',
          name: 'Curse of the Unlucky',
          description: 'Fortune has abandoned you—odd rolls become critical failures',
          statusType: 'cursed',
          level: 'severe'
        }],
        durationValue: 10,
        durationType: 'rounds',
        saveType: 'spirit',
        saveOutcome: 'negates'
      },

      tags: ['debuff', 'curse', 'harbinger', 'omen', 'concentration', 'severe']
    },

    {
      id: 'augur_crown_of_radiance',
      name: 'Crown of Radiance',
      description: 'Place a crown of pure Benediction energy on an ally, making them a beacon of fortune.',
      spellType: 'ACTION',
      icon: 'Radiant/Sacred Symbol',
      school: 'Abjuration',
      level: 6,
      specialization: 'hierophant',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 30,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: true,
        allowSelf: false
      },

      resourceCost: {
        actionPoints: 2,
        mana: 26,
        benediction: 10,
        components: ['verbal', 'somatic'],
        description: 'Spend 10 Benediction to crown with radiance'
      },

      duration: {
        value: 5,
        unit: 'rounds',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'crown_of_radiance',
          name: 'Crown of Radiance',
          description: 'Blessed with radiant fortune — +3 to all rolls, immunity to frightened/charmed',
          statModifier: {
            stat: 'all_rolls',
            magnitude: 3,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 5,
        durationType: 'rounds',
        concentrationRequired: true,
        canBeDispelled: true
      },

      tags: ['buff', 'blessing', 'hierophant', 'omen', 'concentration']
    },

    // ===== LEVEL 7 SPELLS =====
    {
      id: 'augur_reality_of_omens',
      name: 'Reality of Omens',
      description: 'Impose your omen reading on reality itself, forcing the battlefield to conform to your interpretation of the signs.',
      spellType: 'ACTION',
      icon: 'Arcane/Open Portal',
      school: 'Transmutation',
      level: 7,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'SELF_CENTERED',
        range: 0,
        rangeUnit: 'self',
        areaType: 'radius',
        areaSize: 60
      },

      resourceCost: {
        actionPoints: 3,
        mana: 35,
        benediction: 5,
        malediction: 5,
        components: ['verbal', 'somatic', 'material'],
        description: 'Spend 5 Benediction + 5 Malediction to reshape reality'
      },

      duration: {
        value: 3,
        unit: 'rounds',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Allies within range gain +2 to all rolls. Enemies within range suffer -2 to all rolls.',
        secondary: 'All even d20 results within range generate double Benediction for you. All odd results generate double Malediction.'
      },

      tags: ['buff', 'debuff', 'universal', 'area', 'omen', 'concentration']
    },

    {
      id: 'augur_apocalypse_portent',
      name: 'Apocalypse Portent',
      description: 'Deliver the ultimate dark omen—a prophecy of destruction that damages and debilitates all who hear it.',
      spellType: 'ACTION',
      icon: 'Void/Black Hole',
      school: 'Evocation',
      level: 7,
      specialization: 'harbinger',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'AREA',
        range: 60,
        rangeUnit: 'feet',
        areaType: 'radius',
        areaSize: 30,
        requiresLineOfSight: true
      },

      resourceCost: {
        actionPoints: 3,
        mana: 35,
        malediction: 12,
        components: ['verbal', 'somatic'],
        description: 'Spend 12 Malediction to deliver apocalypse portent'
      },

      damageConfig: {
        formula: '8d10',
        elementType: 'psychic',
        damageType: 'direct'
      },

      duration: {
        value: 0,
        unit: 'instant',
        concentration: false
      },

      resolution: 'SAVING_THROW',

      savingThrow: {
        ability: 'SPIRIT',
        dc: 'SPELL_DC',
        onSave: 'Half damage',
        onFail: 'Full damage and -3 to all rolls for 3 rounds'
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['damage', 'debuff', 'harbinger', 'area', 'omen']
    },

    {
      id: 'augur_divine_sanctuary',
      name: 'Divine Sanctuary',
      description: 'Transform the battlefield into a divine sanctuary, making allies nearly invulnerable within its bounds.',
      spellType: 'ACTION',
      icon: 'Radiant/Divine Halo',
      school: 'Abjuration',
      level: 7,
      specialization: 'hierophant',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'AREA',
        range: 40,
        rangeUnit: 'feet',
        areaType: 'radius',
        areaSize: 30,
        requiresLineOfSight: true
      },

      resourceCost: {
        actionPoints: 3,
        mana: 35,
        benediction: 12,
        components: ['verbal', 'somatic', 'material'],
        description: 'Spend 12 Benediction to create divine sanctuary'
      },

      duration: {
        value: 3,
        unit: 'rounds',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Allies in zone: +4 Armor, resistance to all damage, advantage on all saves',
        secondary: 'Enemies cannot enter the sanctuary zone (repelled by divine force)'
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['buff', 'terrain', 'hierophant', 'area', 'omen', 'concentration']
    },

    // ===== LEVEL 8 SPELLS =====
    {
      id: 'augur_twist_of_fate',
      name: 'Twist of Fate',
      description: 'Grab the threads of omen and twist them, retroactively changing a d20 result that just occurred.',
      spellType: 'REACTION',
      icon: 'Arcane/Magical Staff',
      school: 'Divination',
      level: 8,
      specialization: 'universal',

      typeConfig: {
        castTime: 0,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        type: 'SPECIAL',
        range: 60,
        rangeUnit: 'feet',
        requiresLineOfSight: true
      },

      resourceCost: {
        actionPoints: 0,
        mana: 20,
        benediction: 5,
        malediction: 5,
        components: ['verbal'],
        description: 'Reaction: Spend 5 Benediction + 5 Malediction to twist a fate'
      },

      duration: {
        value: 0,
        unit: 'instant',
        concentration: false
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Change a d20 result that just occurred by up to ±5. Must be used within 3 seconds of the roll.',
        secondary: 'If you make the result even, gain +2 Benediction. If odd, gain +2 Malediction.'
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['reaction', 'fate', 'universal', 'omen']
    },

    {
      id: 'augur_omen_of_death',
      name: 'Omen of Death',
      description: 'Mark a target with the ultimate ill omen. If the conditions are met, death follows inevitably.',
      spellType: 'ACTION',
      icon: 'Necrotic/Necrotic Skull',
      school: 'Necromancy',
      level: 8,
      specialization: 'harbinger',

      typeConfig: {
        castTime: 1,
        castTimeType: 'RITUAL'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 30,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false,
        allowSelf: false
      },

      resourceCost: {
        actionPoints: 3,
        mana: 40,
        malediction: 15,
        components: ['verbal', 'somatic', 'material'],
        description: 'Spend 15 Malediction to mark with omen of death'
      },

      duration: {
        value: 1,
        unit: 'minute',
        concentration: true
      },

      resolution: 'SAVING_THROW',

      savingThrow: {
        ability: 'SPIRIT',
        dc: 'SPELL_DC',
        onSave: 'Target takes 8d8 psychic damage instead',
        onFail: 'Target is marked—next time they roll a natural 1 on any d20, they are reduced to 0 HP'
      },

      effectTypes: ['debuff'],

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'omen_of_death',
          name: 'Omen of Death',
          description: 'Marked for death by dark omen—a natural 1 means instant death',
          statusType: 'doomed',
          level: 'severe'
        }],
        durationValue: 10,
        durationType: 'rounds',
        saveType: 'spirit',
        saveOutcome: 'partial'
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['debuff', 'death', 'harbinger', 'omen', 'concentration', 'severe']
    },

    {
      id: 'augur_cosmic_aurora',
      name: 'Cosmic Aurora',
      description: 'Unleash a wave of pure cosmic Benediction that transforms the entire battlefield into sacred ground.',
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Sunburst',
      school: 'Transmutation',
      level: 8,
      specialization: 'hierophant',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'SELF_CENTERED',
        range: 0,
        rangeUnit: 'self',
        areaType: 'radius',
        areaSize: 60
      },

      resourceCost: {
        actionPoints: 3,
        mana: 40,
        benediction: 15,
        components: ['verbal', 'somatic', 'material'],
        description: 'Spend 15 Benediction to create cosmic aurora'
      },

      duration: {
        value: 5,
        unit: 'rounds',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'All allies within 60ft gain +3 to all rolls, resistance to all damage, and heal 2d8 at the start of each turn',
        secondary: 'Undead and fiends within the zone take 4d8 radiant damage each turn'
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['buff', 'terrain', 'hierophant', 'area', 'omen', 'concentration', 'healing']
    },

    // ===== LEVEL 9 SPELLS =====
    {
      id: 'augur_the_signs_speak',
      name: 'The Signs Speak',
      description: 'Channel every omen you have ever read into a single devastating revelation that reshapes reality.',
      spellType: 'ACTION',
      icon: 'Arcane/Open Portal',
      school: 'Divination',
      level: 9,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'SPECIAL',
        range: 100,
        rangeUnit: 'feet'
      },

      resourceCost: {
        actionPoints: 3,
        mana: 50,
        benediction: 8,
        malediction: 8,
        components: ['verbal', 'somatic', 'material'],
        description: 'Spend 8 Benediction + 8 Malediction to reshape reality through omen'
      },

      duration: {
        value: 0,
        unit: 'instant',
        concentration: false
      },

      resolution: 'DICE',

      effects: {
        primary: 'Choose one: (1) Force all enemies in range to reroll their last d20 and take the worse result, OR (2) Force all allies in range to reroll their last d20 and take the better result',
        secondary: 'Additionally, all d20 rolls for the next round generate double resources for you'
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['fate', 'reroll', 'universal', 'omen', 'powerful']
    },

    {
      id: 'augur_cataclysm_portent',
      name: 'Cataclysm Portent',
      description: 'Read the ultimate dark omen in the stars and bring it to pass—a localized cataclysm that devastates all enemies.',
      spellType: 'ACTION',
      icon: 'Void/Black Hole',
      school: 'Evocation',
      level: 9,
      specialization: 'harbinger',

      typeConfig: {
        castTime: 1,
        castTimeType: 'RITUAL'
      },

      targetingConfig: {
        type: 'AREA',
        range: 60,
        rangeUnit: 'feet',
        areaType: 'radius',
        areaSize: 40,
        requiresLineOfSight: true
      },

      resourceCost: {
        actionPoints: 3,
        mana: 50,
        malediction: 15,
        components: ['verbal', 'somatic', 'material'],
        description: 'Spend 15 Malediction to bring cataclysm'
      },

      damageConfig: {
        formula: '12d10',
        elementType: 'psychic',
        damageType: 'direct'
      },

      duration: {
        value: 0,
        unit: 'instant',
        concentration: false
      },

      resolution: 'SAVING_THROW',

      savingThrow: {
        ability: 'SPIRIT',
        dc: 'SPELL_DC',
        onSave: 'Half damage',
        onFail: 'Full damage and Stunned for 2 rounds (CON DC 18 negates)'
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['damage', 'harbinger', 'area', 'omen', 'stun', 'powerful']
    },

    {
      id: 'augur_eternal_benediction',
      name: 'Eternal Benediction',
      description: 'Channel the purest cosmic omen into an eternal blessing that makes your allies nearly unstoppable.',
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Sunburst',
      school: 'Abjuration',
      level: 9,
      specialization: 'hierophant',

      typeConfig: {
        castTime: 1,
        castTimeType: 'RITUAL'
      },

      targetingConfig: {
        type: 'SELF_CENTERED',
        range: 0,
        rangeUnit: 'self',
        areaType: 'radius',
        areaSize: 60
      },

      resourceCost: {
        actionPoints: 3,
        mana: 50,
        benediction: 15,
        components: ['verbal', 'somatic', 'material'],
        description: 'Spend 15 Benediction for eternal blessing'
      },

      duration: {
        value: 1,
        unit: 'minute',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'All allies within range gain +5 to all rolls, immunity to frightened/charmed/stunned, and heal 3d8 at the start of each turn',
        secondary: 'The zone radiates divine light—undead and fiends take 6d8 radiant damage per turn and have disadvantage on all rolls'
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['buff', 'hierophant', 'area', 'omen', 'healing', 'powerful']
    },

    // ===== LEVEL 10 SPELLS =====
    {
      id: 'augur_master_of_omens',
      name: 'Master of Omens',
      description: 'Achieve mastery over all signs and portents. For one glorious minute, you are the omen—the battlefield bends to your interpretation.',
      spellType: 'ACTION',
      icon: 'Arcane/Magical Staff',
      school: 'Divination',
      level: 10,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'RITUAL'
      },

      targetingConfig: {
        type: 'SELF_CENTERED',
        range: 0,
        rangeUnit: 'self',
        areaType: 'radius',
        areaSize: 120
      },

      resourceCost: {
        actionPoints: 3,
        mana: 60,
        benediction: 10,
        malediction: 10,
        components: ['verbal', 'somatic', 'material'],
        description: 'Spend 10 Benediction + 10 Malediction to become the omen'
      },

      duration: {
        value: 1,
        unit: 'minute',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'For the duration, you control the omens: (1) Every d20 roll within range, you declare if it is even or odd before the roll. If your declaration matches, gain +3 of the matching resource. (2) You may spend Benediction or Malediction to change any d20 result by ±1 per point spent. (3) All Benediction and Malediction caps are doubled.',
        secondary: 'Allies in range gain +2 to all rolls. Enemies suffer -2 to all rolls.'
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['ultimate', 'fate', 'universal', 'omen', 'powerful', 'transformation']
    },

    {
      id: 'augur_harbinger_supreme',
      name: 'Harbinger Supreme',
      description: 'Become the ultimate harbinger of doom. All who see you are struck with prophetic terror as every omen becomes a weapon.',
      spellType: 'ACTION',
      icon: 'Void/Black Hole',
      school: 'Necromancy',
      level: 10,
      specialization: 'harbinger',

      typeConfig: {
        castTime: 1,
        castTimeType: 'RITUAL'
      },

      targetingConfig: {
        type: 'SELF_CENTERED',
        range: 0,
        rangeUnit: 'self',
        areaType: 'radius',
        areaSize: 90
      },

      resourceCost: {
        actionPoints: 3,
        mana: 60,
        malediction: 15,
        components: ['verbal', 'somatic'],
        description: 'Spend 15 Malediction to become harbinger supreme'
      },

      duration: {
        value: 1,
        unit: 'minute',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'For the duration: (1) Every odd d20 roll within range generates triple Malediction for you. (2) Enemies within range have -3 to all rolls. (3) Once per round, you may force an enemy to reroll a successful save or attack—take the new result.',
        secondary: 'You radiate an aura of ill omen. Enemies that start their turn within 30ft take 3d8 psychic damage.'
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['ultimate', 'harbinger', 'omen', 'debuff', 'aura', 'powerful']
    },

    {
      id: 'augur_hierophant_supreme',
      name: 'Hierophant Supreme',
      description: 'Ascend as the ultimate hierophant. The entire battlefield becomes a cathedral of omens, blessing allies with divine fortune.',
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Sunburst',
      school: 'Abjuration',
      level: 10,
      specialization: 'hierophant',

      typeConfig: {
        castTime: 1,
        castTimeType: 'RITUAL'
      },

      targetingConfig: {
        type: 'SELF_CENTERED',
        range: 0,
        rangeUnit: 'self',
        areaType: 'radius',
        areaSize: 120
      },

      resourceCost: {
        actionPoints: 3,
        mana: 60,
        benediction: 15,
        components: ['verbal', 'somatic'],
        description: 'Spend 15 Benediction to become hierophant supreme'
      },

      duration: {
        value: 1,
        unit: 'minute',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'For the duration: (1) Every even d20 roll within range generates triple Benediction for you. (2) All allies within range gain +3 to all rolls, resistance to all damage, and immunity to frightened/charmed. (3) Once per round, you may grant an ally a free reroll on any failed d20—take the better result.',
        secondary: 'The entire zone is sacred ground. Undead and fiends take 4d8 radiant damage per turn and cannot enter.'
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['ultimate', 'hierophant', 'omen', 'buff', 'aura', 'healing', 'powerful']
    }
  ],

  spellPools: {
    1: ['augur_read_the_signs', 'augur_omen_shield', 'augur_minor_portent', 'augur_sign_of_clarity', 'augur_omen_bolt'],
    2: ['augur_portent_of_weakness', 'augur_terrain_of_ruin', 'augur_sign_of_protection'],
    3: ['augur_omen_bolt', 'augur_harbinger_gaze', 'augur_sacred_ground'],
    4: ['augur_grand_malediction', 'augur_balanced_sign', 'augur_hierophants_ward'],
    5: ['augur_omen_storm', 'augur_field_of_misfortune', 'augur_hierophants_domain'],
    6: ['augur_omen_shatter', 'augur_curse_of_the_unlucky', 'augur_crown_of_radiance'],
    7: ['augur_reality_of_omens', 'augur_apocalypse_portent', 'augur_divine_sanctuary'],
    8: ['augur_twist_of_fate', 'augur_omen_of_death', 'augur_cosmic_aurora'],
    9: ['augur_the_signs_speak', 'augur_cataclysm_portent', 'augur_eternal_benediction'],
    10: ['augur_master_of_omens', 'augur_harbinger_supreme', 'augur_hierophant_supreme']
  }
};
