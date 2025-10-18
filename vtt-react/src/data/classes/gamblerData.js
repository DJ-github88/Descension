/**
 * Gambler Class Data
 * 
 * Complete class information for the Gambler - a daring risk-taker
 * who manipulates luck and probability for high-stakes rewards.
 */

export const GAMBLER_DATA = {
  id: 'gambler',
  name: 'Gambler',
  icon: 'fas fa-dice',
  role: 'Damage/Utility',

  // Overview section
  overview: {
    title: 'The Gambler',
    subtitle: 'Master of Fortune and Fate',
    
    description: `The Gambler is a daring risk-taker who manipulates luck and probability to gain an edge in combat. Embracing high-risk, high-reward strategies, Gamblers are known for their bold moves and their ability to turn the tide of battle with a well-placed bet. They thrive on chance and the thrill of unpredictability, using Fortune Points to influence outcomes and transform random chance into calculated advantage.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Gamblers are individuals who have learned to see patterns in chaos and opportunity in uncertainty. They believe that fate is not fixed but fluid—something that can be nudged, influenced, and occasionally cheated. Whether through supernatural luck, divine favor, or simply uncanny intuition, Gamblers have an almost preternatural ability to beat the odds.

**The Gambler's Philosophy**: True power comes not from controlling every variable, but from knowing when to take risks and when to play it safe. Every moment is a gamble, and the universe rewards the bold.

**Common Archetypes**:
- **The Card Sharp**: A cunning strategist who treats life like a game of cards, always counting odds and reading tells
- **The Lucky Fool**: Blessed (or cursed) with supernatural fortune, stumbling into success through sheer chance
- **The Fate Weaver**: Believes they can see and manipulate the threads of destiny itself
- **The Debt Collector**: Made a deal with a powerful entity and now wields borrowed luck at a price
- **The Thrill Seeker**: Addicted to the rush of risk, constantly pushing their luck to feel alive
- **The Statistical Savant**: Uses probability and mathematics to turn randomness into advantage

**Personality Traits**: Gamblers tend to be confident, charismatic, and comfortable with uncertainty. They often have a flair for the dramatic, turning every action into a performance. Some are superstitious, carrying lucky charms and following elaborate rituals, while others are coldly analytical, treating every situation as a probability calculation.

**Physical Manifestations**: A Gambler's connection to fortune often manifests subtly—dice that always seem to roll in their favor, coins that land on the desired side, or an aura that makes others feel either lucky or unlucky in their presence. Some carry enchanted gambling implements that glow when fortune favors them.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Versatile Damage Dealer with Utility

The Gambler occupies a unique niche as a damage dealer whose output varies wildly based on luck and Fortune Point management. They can swing from devastating burst damage to complete whiffs, making them exciting but unpredictable.

**Damage Output**: Highly variable—can match top-tier damage dealers on lucky streaks or fall behind on unlucky ones. Fortune Points allow skilled players to smooth out variance.

**Utility**: Exceptional utility through probability manipulation, rerolls, and fate-altering abilities that can turn failures into successes for themselves and allies.

**Battlefield Control**: Creates uncertainty for enemies through unpredictable effects, forced gambles, and luck-based debuffs.

**Support Capabilities**: Can grant rerolls, manipulate enemy rolls, and provide luck-based buffs to allies.

**Strengths**:
- Extreme burst damage potential when luck aligns
- Fortune Points provide strategic control over randomness
- Versatile toolkit for various situations
- Excellent at turning bad situations around with lucky rolls
- Strong utility and support options
- Thrives in high-stakes moments

**Weaknesses**:
- Inconsistent damage output without Fortune Point investment
- Some abilities can backfire spectacularly
- Requires good Fortune Point management to be effective
- Less reliable than consistent damage dealers
- Can accidentally harm allies with chaotic effects
- Vulnerable when Fortune Points are depleted

**Team Dynamics**:
- Works well with adaptable teams who can capitalize on random opportunities
- Synergizes with support classes who can mitigate bad luck
- Benefits from tanks who can protect during unlucky streaks
- Provides valuable reroll support for critical ally actions`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Gambler is about managing risk versus reward and knowing when to trust in luck versus when to spend Fortune Points for guaranteed results.

**Core Gameplay Loop**:
1. **Build Fortune Points** through successful attacks and spell casts
2. **Take calculated risks** with luck-based abilities
3. **Spend Fortune Points** to adjust critical rolls
4. **Capitalize on lucky streaks** while they last

**Fortune Point Management**:
- **Low Fortune (0-3)**: Play conservatively, focus on building points, avoid high-risk abilities
- **Medium Fortune (4-8)**: Moderate risk-taking, can afford to adjust important rolls
- **High Fortune (9-15)**: Take big risks, use ultimate abilities, adjust multiple rolls
- **Maximum Fortune (16-20)**: Near-complete control, use highest-risk highest-reward abilities

**Risk Assessment**:
- **Low-Risk Abilities**: Consistent effects with minor random elements (Coin Toss, Gambler's Insight)
- **Medium-Risk Abilities**: Significant random variance but manageable consequences (Lucky Strike, Twist of Fate)
- **High-Risk Abilities**: Extreme variance with potential for disaster or triumph (Double or Nothing, Jackpot)
- **Ultimate Risk**: Life-or-death gambles with game-changing results (All-In, Death Roll)

**When to Spend Fortune Points**:
- To avoid catastrophic failures (preventing self-damage, ensuring critical hits land)
- To guarantee success on crucial rolls (boss damage, saving ally lives)
- To maximize already-good rolls into exceptional ones
- To turn near-misses into successes

**When to Save Fortune Points**:
- During trash encounters where variance is acceptable
- When Fortune Point count is low (below 5)
- Before boss fights or critical moments
- When abilities have acceptable failure states

**Specialization Strategies**:
- **Fortune's Favor**: Maximize coin flip manipulation, focus on rerolls and probability control
- **High Roller**: Embrace extreme risk/reward, bet resources for massive payoffs
- **Card Sharp**: Strategic gambling with calculated risks, deck manipulation

**Perfect For**: Players who enjoy randomness, dramatic moments, risk/reward decisions, and don't mind occasional spectacular failures in pursuit of legendary successes.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Fortune Points',
    subtitle: 'Manipulating Luck and Probability',
    
    description: `Fortune Points represent the Gambler's accumulated luck and their ability to influence fate. As they succeed in combat, they build Fortune Points, which they can then spend to adjust the outcomes of their gambles. This system allows Gamblers to embrace luck-based abilities while maintaining strategic control over critical moments.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**Starting State**: Gamblers begin each combat encounter with 0 Fortune Points

**Generating Fortune Points**:

Fortune Points are generated through successful actions in combat:
- **Successful Attack**: Landing an attack generates 1 Fortune Point
- **Successful Spell Cast**: Successfully casting a spell generates 1 Fortune Point
- **Winning a Gamble**: When a gambling ability produces a positive result, gain 1 Fortune Point
- **Critical Success**: Rolling a natural 20 generates 2 Fortune Points instead of 1

**Maximum Capacity**: You can hold up to 20 Fortune Points at once. Any excess is lost.

**Persistence**: Fortune Points persist between combats until spent or until you complete a long rest.

**Using Fortune Points**:

Fortune Points can be spent to adjust the results of any roll you make. Each Fortune Point spent allows you to increase or decrease the result by 1.

- **Spend 1 Point**: Adjust any roll by ±1
- **Spend Multiple Points**: Each additional point adjusts by another ±1
- **No Limit Per Roll**: You can spend as many Fortune Points as you want on a single roll (up to your current total)
- **Declare Before Outcome**: You must decide how many points to spend and in which direction before the GM reveals the outcome

**Example**: You roll a 14 on a d20 attack roll. You have 8 Fortune Points. You could:
- Spend 0 points and accept the 14
- Spend 3 points to increase it to 17
- Spend 6 points to increase it to 20 (guaranteed critical hit)
- Spend points to decrease it if you wanted a specific number for a triggered effect

**Special Interactions**:

Some Gambler abilities specifically interact with Fortune Points:
- **Loaded Dice** (Passive): Choose a number (2-19). When you roll that number, you may spend 1 Fortune Point to reroll
- **Cheat Fate** (Reaction): Spend 3 Fortune Points to adjust any visible roll within 30 feet by ±2
- **Fortune's Favor**: Spend Fortune Points to grant allies rerolls or force enemy rerolls`
    },
    
    fortunePointTable: {
      title: 'Fortune Point Strategic Values',
      headers: ['Point Count', 'Strategic Value', 'Recommended Usage'],
      rows: [
        ['0-2', 'Minimal Control', 'Focus on building points, avoid high-risk abilities'],
        ['3-5', 'Low Control', 'Can adjust minor rolls, save for important moments'],
        ['6-10', 'Moderate Control', 'Comfortable using medium-risk abilities, can guarantee some successes'],
        ['11-15', 'High Control', 'Can afford multiple adjustments, safe to use high-risk abilities'],
        ['16-20', 'Maximum Control', 'Near-complete control over outcomes, use ultimate abilities freely']
      ]
    },
    
    riskLevelTable: {
      title: 'Ability Risk Levels',
      headers: ['Risk Level', 'Description', 'Fortune Point Reserve Recommended'],
      rows: [
        ['Low Risk', 'Minor random elements, acceptable failure states', '0-3 points sufficient'],
        ['Medium Risk', 'Significant variance, some negative consequences possible', '4-6 points recommended'],
        ['High Risk', 'Extreme variance, potential for serious backfire', '7-10 points recommended'],
        ['Extreme Risk', 'Life-threatening consequences on failure', '11+ points strongly recommended'],
        ['Ultimate Risk', 'Potentially game-ending results either way', 'Maximum points (15-20) advised']
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Building Fortune Points Efficiently**:
- Focus on consistent, reliable attacks early in combat
- Use low-mana spells to generate points without depleting resources
- Avoid high-risk abilities until you have a comfortable Fortune Point reserve
- Critical hit builds can generate points faster (2 per crit)

**Spending Fortune Points Wisely**:
- Save points for boss encounters and critical moments
- Don't waste points on trash encounters unless necessary
- Consider the cost-benefit: is spending 5 points to turn a 15 into a 20 worth it?
- Remember that unspent points persist between combats

**Fortune Point Breakpoints**:
- **5 Points**: Can turn most near-misses into hits
- **10 Points**: Can guarantee critical hits (turn 10+ into 20)
- **15 Points**: Can adjust multiple important rolls in one encounter
- **20 Points**: Maximum control, can manipulate entire combat sequences

**Risk Management**:
- Always maintain a 3-5 point reserve for emergencies
- Don't gamble with abilities you can't afford to fail
- Use Fortune Points to prevent catastrophic failures before chasing perfect successes
- Consider party composition: do you have healers to recover from bad gambles?

**Synergy with Abilities**:
- Some abilities become much stronger with Fortune Point investment
- Loaded Dice passive works best with high Fortune Point reserves
- Death Roll and other competitive abilities benefit greatly from point spending
- All-In and extreme gambles should only be used with maximum points available`
    }
  },

  // Specializations
  specializations: {
    title: 'Gambler Specializations',
    subtitle: 'Three Paths of Fortune',

    description: `Every Gambler chooses one of three specializations that define their approach to luck manipulation and risk-taking. Each specialization offers unique passive abilities and influences your gambling style and spell selection.`,

    // Shared passive for all Gambler specializations
    sharedPassive: {
      name: 'Loaded Dice',
      icon: 'inv_misc_dice_01',
      description: 'Choose a number between 2 and 19 at the start of each day. Whenever you roll that exact number on any die (for any purpose), you may spend 1 Fortune Point to reroll that die and use the new result. This effect applies to attack rolls, damage rolls, saving throws, and ability checks.',
      mechanicsNote: 'This passive gives Gamblers a way to turn unlucky rolls into second chances. Choose your number based on common roll targets (e.g., 10 for average rolls, 15 for important hits, 7 for lucky number superstition).'
    },

    specs: [
      {
        id: 'fortunes-favor',
        name: "Fortune's Favor",
        icon: 'inv_misc_coin_17',
        color: '#FFD700',
        theme: 'Luck Manipulation',

        description: `Fortune's Favor Gamblers are masters of coin flips and probability manipulation. They specialize in bending luck to their will, granting rerolls, and influencing the outcomes of chance-based events. These Gamblers believe that fortune favors the bold—and they've learned to make fortune favor them specifically.`,

        playstyle: 'Probability control, reroll manipulation, consistent luck-based advantages',

        strengths: [
          'Most consistent Gambler specialization',
          'Excellent support through reroll granting',
          'Strong defensive options via luck manipulation',
          'Can influence both ally and enemy rolls',
          'Lower risk than other specializations'
        ],

        weaknesses: [
          'Lower maximum damage potential than High Roller',
          'Requires Fortune Points to be truly effective',
          'Less spectacular results than other specs',
          'Coin flip mechanics still have 50/50 variance'
        ],

        uniquePassive: {
          name: "Lucky Streak",
          icon: 'spell_holy_blessedrecovery',
          description: 'After successfully landing 3 attacks or spells in a row, your next coin flip ability automatically succeeds on the favorable outcome without needing to flip. This effect resets after use or after missing an attack/spell.',
          mechanicsNote: 'Rewards consistent play and reduces variance during hot streaks. Pairs well with low-risk attacks to build up guaranteed coin flip successes.'
        },

        keyAbilities: [
          "Fate's Coin - Flip a magical coin and choose one of six effects. Heads grants a powerful benefit, tails gives a lesser benefit or minor drawback. (5 mana, spend 1 Fortune Point to flip the result)",
          "Fortune's Favor - Grant an ally advantage on their next roll or force an enemy to reroll a successful attack/save. (2 mana, spend additional Fortune Points for multiple rerolls)",
          "Cheat Fate - As a reaction, adjust any visible roll within 30 feet by ±2 before the outcome is determined. (3 mana, costs 3 Fortune Points to activate)"
        ],

        recommendedFor: 'Players who want more control over randomness, enjoy supporting allies, and prefer consistent results over extreme variance.'
      },

      {
        id: 'high-roller',
        name: 'High Roller',
        icon: 'inv_misc_gem_diamond_01',
        color: '#DC143C',
        theme: 'High Stakes Betting',

        description: `High Roller Gamblers embrace extreme risk for extreme reward. They bet their own health, mana, and resources on the outcomes of their gambles, capable of achieving devastating results—or catastrophic failures. These Gamblers live for the thrill of putting everything on the line and coming out on top.`,

        playstyle: 'Extreme risk/reward, resource betting, all-or-nothing plays',

        strengths: [
          'Highest damage potential of all Gambler specs',
          'Can turn near-death situations into victories',
          'Spectacular comeback potential',
          'Resource betting allows for massive burst damage',
          'Thrilling, dramatic gameplay moments'
        ],

        weaknesses: [
          'Extremely high risk of self-damage or death',
          'Can deplete resources quickly on bad luck',
          'Requires excellent Fortune Point management',
          'Vulnerable when bets fail',
          'Can accidentally kill themselves'
        ],

        uniquePassive: {
          name: "Double Down",
          icon: 'ability_rogue_rollthebones',
          description: 'Whenever you successfully land a damaging ability, you may immediately spend 2 Fortune Points to "double down" and repeat the ability at half mana cost. If the second cast also succeeds, gain 3 Fortune Points. If it fails, lose 2 Fortune Points.',
          mechanicsNote: 'High-risk passive that can chain successes into devastating combos or turn wins into losses. Best used when you have Fortune Points to spare and can afford the mana cost.'
        },

        keyAbilities: [
          "All-In - Bet your current hit points. Roll a d100. 1-50: Double your current HP. 51-90: Heal to full health. 91-100: Drop to 0 HP. (10 mana, spend 10+ Fortune Points to guarantee heal to full)",
          "Double or Nothing - Make an attack roll. If it hits, it automatically becomes a critical hit dealing double damage. If it misses, you take the damage you would have dealt. (5 mana, spend Fortune Points to ensure hit)",
          "Betting Blitz - Bet up to half your max HP. If your next attack deals damage equal to or greater than double the bet amount, regain the health. Otherwise, lose the health bet. (5 mana, spend Fortune Points to increase damage)"
        ],

        recommendedFor: 'Players who love extreme risk/reward, enjoy dramatic moments, and don\'t mind occasional spectacular failures in pursuit of legendary victories.'
      },

      {
        id: 'card-sharp',
        name: 'Card Sharp',
        icon: 'inv_misc_platnumdisks',
        color: '#4B0082',
        theme: 'Strategic Gambling',

        description: `Card Sharp Gamblers are strategic masterminds who treat combat like a high-stakes card game. They specialize in prediction, pattern recognition, and calculated risks. These Gamblers use their keen analytical minds to turn randomness into advantage through careful observation and strategic play.`,

        playstyle: 'Calculated risks, prediction mechanics, strategic gambling',

        strengths: [
          'Most strategic Gambler specialization',
          'Rewards skill and game knowledge',
          'Strong competitive abilities (Death Roll, Taunt the Odds)',
          'Excellent against intelligent enemies',
          'Prediction mechanics can provide huge advantages'
        ],

        weaknesses: [
          'Requires good game knowledge to maximize',
          'Prediction abilities can fail completely',
          'Less effective against mindless enemies',
          'Competitive abilities require willing or forced participation',
          'Moderate damage compared to High Roller'
        ],

        uniquePassive: {
          name: "Card Counting",
          icon: 'inv_misc_book_11',
          description: 'You mentally track the "deck" of d20 results. After seeing 5 d20 rolls in combat (from any source), you gain advantage on predicting the next d20 result. This gives you advantage on abilities that require guessing or predicting rolls (Taunt the Odds, Evens and Odds, etc.).',
          mechanicsNote: 'Represents the Card Sharp\'s ability to read patterns and predict outcomes. Resets after each prediction or at the end of combat.'
        },

        keyAbilities: [
          "Jackpot - Roll 3d20 and compare to an extensive table of results. Triple numbers grant powerful rewards, while mismatched numbers give lesser effects. (8 mana, spend Fortune Points to adjust individual dice)",
          "Death Roll - Challenge a creature to a game of Death Roll. Both participants roll decreasing dice until someone loses. The loser takes 1-10d10 psychic damage and is stunned. (8 mana, spend Fortune Points to adjust rolls during game)",
          "Taunt the Odds - Choose a target and guess the result of a d20 roll. If you guess within 3, the target takes 3d10 damage. If you're off by more than 3, you take 1d10 damage. (4 mana, Card Counting passive gives advantage)"
        ],

        recommendedFor: 'Players who enjoy strategic gameplay, prediction mechanics, and using game knowledge to gain advantages.'
      }
    ]
  },

  // Example Spells - showcasing the gambling mechanics
  exampleSpells: [
      {
        id: 'lucky-strike',
        name: 'Lucky Strike',
        icon: 'spell_holy_blessedrecovery',
        spellType: 'ACTION',
        school: 'Luck Manipulation',
        level: 2,

        description: 'Roll 4d12 before making an attack. The matching dice determine your damage multiplier. Four matching dice deal quadruple damage, three matching deal triple, two matching deal double. All different numbers causes you to take damage equal to the lowest die.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE'
        },

        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 50
        },

        durationConfig: {
          durationType: 'instant'
        },

        resourceCost: {
          mana: 3,
          components: ['verbal', 'somatic'],
          verbalText: 'Fortuna!',
          somaticText: 'Roll dice in hand'
        },

        resolution: 'DICE',

        damageConfig: {
          formula: '1d8',
          damageType: 'variable',
          scalingType: 'multiplier'
        },

        effects: {
          damage: {
            instant: {
              formula: '1d8',
              type: 'variable',
              multiplier: 'based_on_4d12_match'
            }
          }
        },

        specialMechanics: {
          fortunePoints: {
            generates: 'variable',
            description: '4 match: +3, 3 match: +2, 2 match: +1, all different: +0'
          },
          diceMatching: {
            dice: '4d12',
            matchingRules: 'Compare dice for matching numbers'
          }
        },

        rollableTable: {
          enabled: true,
          name: 'Lucky Strike Results',
          description: 'Roll 4d12 and check for matching numbers',
          resolutionType: 'DICE',
          resolutionConfig: { diceType: '4d12' },
          entries: [
            {
              range: 'All 4 match',
              result: 'Quadruple damage + 3 Fortune Points + Guaranteed critical hit',
              description: 'Example: 12-12-12-12'
            },
            {
              range: '3 match',
              result: 'Triple damage + 2 Fortune Points',
              description: 'Example: 8-8-8-3'
            },
            {
              range: '2 match',
              result: 'Double damage + 1 Fortune Point',
              description: 'Example: 5-5-9-2'
            },
            {
              range: 'All different',
              result: 'Normal damage + Take damage equal to lowest die',
              description: 'Example: 1-4-7-11 (take 1 damage)'
            }
          ]
        },

        tags: ['damage', 'fortune-generation', 'variable', 'gambler']
      },

      {
        id: 'fates-coin',
        name: "Fate's Coin",
        icon: 'inv_misc_coin_17',
        spellType: 'ACTION',
        school: 'Luck Manipulation',
        level: 3,

        description: 'Flip a magical coin and choose one of six effects. Heads grants a powerful benefit, tails gives a lesser benefit or minor drawback. Spend 1 Fortune Point to flip the result.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE'
        },

        targetingConfig: {
          targetingType: 'self_or_ally',
          rangeType: 'ranged',
          rangeDistance: 30
        },

        durationConfig: {
          durationType: 'varies',
          duration: 1,
          durationUnit: 'minute'
        },

        resourceCost: {
          mana: 5,
          components: ['verbal', 'material'],
          verbalText: 'Fatum Nummus!',
          materialText: 'A golden coin'
        },

        resolution: 'COIN_FLIP',

        effects: {
          buff: {
            conditional: {
              type: 'coin_flip_result',
              options: ['advantage', 'damage_double', 'heal', 'mana_restore', 'teleport', 'speed_boost']
            }
          }
        },

        specialMechanics: {
          fortunePoints: {
            cost: 1,
            effect: 'Flip the coin result (Heads to Tails or vice versa)'
          },
          coinFlip: {
            type: 'choice_based',
            choices: 6,
            description: 'Choose one of six coin effects before flipping'
          }
        },

        rollableTable: {
          enabled: true,
          name: "Fate's Coin Effects",
          description: 'Choose one effect, then flip a coin',
          resolutionType: 'COIN_FLIP',
          resolutionConfig: { diceType: 'coin' },
          entries: [
            {
              range: 'Coin of Fortune',
              result: 'Heads: Advantage on next roll | Tails: Disadvantage on next roll',
              description: 'Affects your next attack roll or saving throw'
            },
            {
              range: 'Coin of Double or Nothing',
              result: 'Heads: Double next attack damage | Tails: Halve next attack damage',
              description: 'Affects your next damaging attack'
            },
            {
              range: 'Coin of Heal or Harm',
              result: 'Heads: Heal 2d6 HP | Tails: Take 1d6 damage',
              description: 'Immediate healing or self-damage'
            },
            {
              range: 'Coin of Mana Surge',
              result: 'Heads: Regain one spell use | Tails: Lose one spell use',
              description: 'Affects your available spell slots'
            },
            {
              range: 'Coin of Teleport or Trap',
              result: 'Heads: Teleport 30 feet | Tails: Restrained for 1 round',
              description: 'Movement manipulation'
            },
            {
              range: 'Coin of Speed',
              result: 'Heads: Double movement for 1 min | Tails: Halve movement for 1 min',
              description: 'Speed modification'
            }
          ]
        },

        tags: ['utility', 'buff', 'debuff', 'coin-flip', 'gambler', 'fortunes-favor']
      },

      {
        id: 'jackpot',
        name: 'Jackpot',
        icon: 'inv_misc_platnumdisks',
        spellType: 'ACTION',
        school: 'Strategic Gambling',
        level: 8,

        description: 'Roll 3d20 slot machine. Triple numbers grant powerful rewards. Each combination can only occur once per long rest. Spend Fortune Points to adjust individual dice.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE'
        },

        targetingConfig: {
          targetingType: 'self',
          rangeType: 'self'
        },

        durationConfig: {
          durationType: 'varies',
          duration: 1,
          durationUnit: 'hour'
        },

        resourceCost: {
          mana: 8,
          components: ['verbal', 'somatic', 'material'],
          verbalText: 'Fortuna Maxima!',
          somaticText: 'Pull imaginary slot machine lever',
          materialText: 'Three golden dice'
        },

        resolution: 'DICE',

        effects: {
          variable: {
            type: 'slot_machine',
            outcomes: 21
          }
        },

        specialMechanics: {
          fortunePoints: {
            usage: 'Adjust individual dice by ±1 per point spent',
            example: 'Roll 19-19-18, spend 1 point to make it 19-19-19'
          },
          usageLimit: {
            type: 'long_rest',
            restriction: 'Each specific triple combination can only occur once per long rest'
          },
          slotMachine: {
            dice: '3d20',
            matchingRequired: true
          }
        },

        rollableTable: {
          enabled: true,
          name: 'Jackpot Slot Machine',
          description: 'Roll 3d20 and match the results',
          resolutionType: 'DICE',
          resolutionConfig: { diceType: '3d20' },
          entries: [
            { range: '20-20-20', result: 'Rare magical item + max damage on all attacks (1 hour)', description: 'Ultimate jackpot' },
            { range: '19-19-19', result: '5d10 radiant damage to all enemies in 30ft + 10 temp HP', description: 'Instant' },
            { range: '18-18-18', result: 'Advantage on all saving throws (1 hour)', description: 'Defensive boost' },
            { range: '17-17-17', result: 'Summon ethereal dragon ally (1 minute)', description: 'Combat summon' },
            { range: '16-16-16', result: 'Heal 40 HP + resistance to all damage (1 hour)', description: 'Survival boost' },
            { range: '15-15-15', result: '+5 to attack rolls and AC (10 minutes)', description: 'Combat enhancement' },
            { range: '14-14-14', result: 'Become ethereal - phase through objects (1 minute)', description: 'Utility/escape' },
            { range: '13-13-13', result: '4d10 lightning to 3 enemies in 30ft', description: 'Instant damage' },
            { range: '12-12-12', result: 'Storm: 4d10 lightning + 4d10 thunder to all enemies in 40ft', description: 'AOE devastation' },
            { range: '11-11-11', result: 'Resistance to all damage + 2d10 radiant on next attack (1 hour)', description: 'Sustained power' },
            { range: '10-10-10', result: 'Advantage on attacks + heal 30 HP (1 hour)', description: 'Offensive boost' },
            { range: '9-9-9', result: 'Double spell damage but take 2d10 per spell (1 minute)', description: 'High risk/reward' },
            { range: '8-8-8', result: 'Gain extra turn immediately', description: 'Action economy' },
            { range: '7-7-7', result: 'Regain all spell uses + heal 50 HP', description: 'Full restore' },
            { range: '6-6-6', result: 'Celestial guardian: +5 AC and saves (1 minute)', description: 'Divine protection' },
            { range: '5-5-5', result: 'Shield absorbs next 50 damage', description: 'Damage absorption' },
            { range: '4-4-4', result: '6d6 fire to all in 20ft radius (including self)', description: 'Dangerous AOE' },
            { range: '3-3-3', result: 'Heal 20 HP + resistance to all damage (1 hour)', description: 'Moderate boost' },
            { range: '2-2-2', result: '3d10 necrotic to target + heal same amount', description: 'Life drain' },
            { range: '1-1-1', result: 'Take 5d10 damage + lose all spell uses for day', description: 'Critical failure' },
            { range: 'No Match', result: 'Gain 1d6 temp HP + 1 Fortune Point', description: 'Consolation prize' }
          ]
        },

        tags: ['ultimate', 'random', 'high-risk', 'high-reward', 'gambler', 'card-sharp']
      },

      {
        id: 'high-roller',
        name: 'High Roller',
        icon: 'inv_misc_gem_diamond_01',
        spellType: 'ACTION',
        school: 'High Stakes Betting',
        level: 6,

        description: 'Choose one of three high-stakes bets and roll d20. Arcane Auction (bet mana), Twist of Fate (bet action), or Fortune\'s Favor (bet health). Spend Fortune Points to adjust the roll.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE'
        },

        targetingConfig: {
          targetingType: 'self',
          rangeType: 'self'
        },

        durationConfig: {
          durationType: 'varies',
          duration: 1,
          durationUnit: 'turn'
        },

        resourceCost: {
          mana: 7,
          components: ['verbal', 'somatic'],
          verbalText: 'Alea Iacta Est!',
          somaticText: 'Throw dice dramatically'
        },

        resolution: 'DICE',

        effects: {
          variable: {
            type: 'choice_based_bet',
            options: ['mana', 'action', 'health']
          }
        },

        specialMechanics: {
          fortunePoints: {
            usage: 'Adjust d20 roll to guarantee desired outcome',
            recommendation: '5-10 points for safety'
          },
          betting: {
            type: 'resource_wager',
            choices: 3,
            description: 'Choose which resource to bet before rolling'
          }
        },

        rollableTable: {
          enabled: true,
          name: 'High Roller Bets',
          description: 'Choose one bet type and roll 1d20',
          resolutionType: 'DICE',
          resolutionConfig: { diceType: '1d20' },
          entries: [
            { range: 'Arcane Auction', result: '1-10: Lose bet | 11-13: Gain bet | 14-16: x2 | 17-19: x3 | 20: x4', description: 'Bet mana for mana returns' },
            { range: 'Twist of Fate', result: '1-10: Lose action | 11-13: Advantage | 14-16: x2 dmg | 17-18: +1 action | 19: +2 | 20: +3', description: 'Bet action for future actions' },
            { range: 'Fortune\'s Favor', result: '1-10: Take bet dmg | 11-13: Heal bet | 14-16: x2 heal | 17-18: x3+temp | 19: x2 temp | 20: Full+temp', description: 'Bet health (max half) for healing' }
          ]
        },

        tags: ['betting', 'resource-manipulation', 'high-risk', 'gambler', 'high-roller']
      },

      {
        id: 'all-in',
        name: 'All-In',
        icon: 'ability_rogue_rollthebones',
        spellType: 'ACTION',
        school: 'High Stakes Betting',
        level: 10,

        description: 'Bet your current HP on d100 roll. 1-50: Double HP. 51-90: Full heal. 91-100: Drop to 0 HP. WARNING: Can instantly kill you. Requires 10+ Fortune Points for safety.',

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
          mana: 10,
          components: ['verbal', 'somatic'],
          verbalText: 'Omnia Aut Nihil!',
          somaticText: 'Push all chips forward'
        },

        resolution: 'DICE',

        effects: {
          variable: {
            type: 'life_or_death_gamble',
            outcomes: 3
          }
        },

        specialMechanics: {
          fortunePoints: {
            critical: true,
            recommendation: '10-15 points minimum',
            usage: 'With 10 points, turn any 41+ into safe zone (51-90). With 40 points, can manipulate any result.'
          },
          lifeOrDeath: {
            warning: 'Can instantly kill you',
            safeZone: '51-90',
            deathZone: '91-100'
          }
        },

        rollableTable: {
          enabled: true,
          name: 'All-In Results',
          description: 'Roll 1d100 - your life is on the line',
          resolutionType: 'DICE',
          resolutionConfig: { diceType: '1d100' },
          entries: [
            { range: { min: 1, max: 50 }, result: 'Double your current hit points', description: 'Moderate success' },
            { range: { min: 51, max: 90 }, result: 'Heal to full health', description: 'Optimal result - aim for this' },
            { range: { min: 91, max: 100 }, result: 'Drop to 0 hit points', description: 'DEATH - avoid at all costs' }
          ]
        },

        tags: ['ultimate', 'life-or-death', 'extreme-risk', 'healing', 'gambler', 'high-roller']
      },

      {
        id: 'death-roll',
        name: 'Death Roll',
        icon: 'spell_shadow_demonicempathy',
        spellType: 'ACTION',
        school: 'Strategic Gambling',
        level: 7,

        description: 'Challenge creature to Death Roll minigame. Both roll d20s with decreasing maximums until someone loses. Loser takes 1-10d10 psychic damage (winner chooses) and is stunned. Unwilling targets make Wisdom save.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE'
        },

        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 15
        },

        durationConfig: {
          durationType: 'special',
          description: 'Until game concludes'
        },

        resourceCost: {
          mana: 8,
          components: ['verbal', 'somatic'],
          verbalText: 'Ludus Mortis!',
          somaticText: 'Challenge opponent with dice'
        },

        resolution: 'MINIGAME',

        damageConfig: {
          formula: '1-10d10',
          damageType: 'psychic',
          scalingType: 'winner_choice'
        },

        effects: {
          damage: {
            instant: {
              formula: 'variable_d10',
              type: 'psychic'
            }
          },
          control: {
            duration: 1,
            type: 'stunned'
          }
        },

        specialMechanics: {
          fortunePoints: {
            usage: 'Adjust rolls during game - increase to set low max, decrease to stay under max'
          },
          minigame: {
            type: 'death_roll',
            rules: 'Both roll d20, lower becomes new max, repeat until someone rolls over current max',
            example: 'R1: You 15, Enemy 12 (max:12). R2: You 8, Enemy 11 (Enemy loses)'
          },
          savingThrow: {
            type: 'Wisdom',
            dc: '8 + proficiency + Charisma',
            onFail: 'Compelled to play'
          }
        },

        tags: ['competitive', 'minigame', 'psychic', 'control', 'gambler', 'card-sharp']
      },

      {
        id: 'double-or-nothing',
        name: 'Double or Nothing',
        icon: 'ability_warrior_intensifyrage',
        spellType: 'ACTION',
        school: 'High Stakes Betting',
        level: 4,

        description: 'Make an attack roll. On hit: automatic critical hit with double damage. On miss: you take the damage instead. Spend 5-10 Fortune Points to guarantee hit.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE'
        },

        targetingConfig: {
          targetingType: 'single',
          rangeType: 'weapon_or_spell_range'
        },

        durationConfig: {
          durationType: 'instant'
        },

        resourceCost: {
          mana: 5,
          components: ['verbal'],
          verbalText: 'Duplica Aut Nihil!'
        },

        resolution: 'ATTACK_ROLL',

        damageConfig: {
          formula: 'weapon_or_spell',
          damageType: 'variable',
          scalingType: 'critical_on_hit'
        },

        effects: {
          damage: {
            conditional: {
              onHit: 'automatic_critical_double_damage',
              onMiss: 'self_damage_equal_to_would_be_hit'
            }
          }
        },

        specialMechanics: {
          fortunePoints: {
            recommendation: '5-10 points to guarantee hit',
            usage: 'Adjust attack roll to ensure success',
            transforms: 'From suicidal gamble to guaranteed crit'
          },
          criticalHit: {
            automatic: true,
            condition: 'on_hit'
          },
          selfDamage: {
            condition: 'on_miss',
            amount: 'equal_to_would_be_damage'
          }
        },

        tags: ['damage', 'critical-hit', 'self-damage-risk', 'gambler', 'high-roller']
      },

      {
        id: 'taunt-the-odds',
        name: 'Taunt the Odds',
        icon: 'spell_holy_righteousfury',
        spellType: 'ACTION',
        school: 'Strategic Gambling',
        level: 3,

        description: 'Guess a number 1-20, then roll d20. Guess within 3: target takes 3d10 damage. Off by 4+: you take 1d10 damage. Spend Fortune Points to adjust roll toward guess.',

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
          durationType: 'instant'
        },

        resourceCost: {
          mana: 4,
          components: ['verbal', 'somatic'],
          verbalText: 'Provoco Fortunam!',
          somaticText: 'Point at target and call out number'
        },

        resolution: 'DICE',

        damageConfig: {
          formula: '3d10',
          damageType: 'force',
          scalingType: 'accuracy_based'
        },

        effects: {
          damage: {
            conditional: {
              onAccurate: '3d10_to_target',
              onInaccurate: '1d10_to_self'
            }
          }
        },

        specialMechanics: {
          fortunePoints: {
            usage: 'After seeing roll, adjust toward your guess',
            example: 'Guess 15, roll 11, spend 4 points to make it 15'
          },
          prediction: {
            type: 'number_guess',
            range: '1-20',
            successMargin: 3,
            failureMargin: 4
          },
          synergy: {
            cardCounting: 'Card Sharp passive gives advantage on guess'
          }
        },

        tags: ['damage', 'prediction', 'skill-based', 'gambler', 'card-sharp']
      },

      {
        id: 'coin-toss',
        name: 'Coin Toss',
        icon: 'inv_misc_coin_01',
        spellType: 'ACTION',
        school: 'Luck Manipulation',
        level: 2,

        description: 'Flip a coin (1d2). Heads: +2 to all rolls for 1 hour. Tails: -2 to all rolls for 1 hour. Spend 1 Fortune Point to flip the result.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE'
        },

        targetingConfig: {
          targetingType: 'self',
          rangeType: 'self'
        },

        durationConfig: {
          durationType: 'timed',
          duration: 1,
          durationUnit: 'hour'
        },

        resourceCost: {
          mana: 3,
          components: ['verbal', 'material'],
          verbalText: 'Nummus Fortunae!',
          materialText: 'A coin'
        },

        resolution: 'COIN_FLIP',

        effects: {
          buff: {
            conditional: {
              onHeads: '+2_to_all_rolls',
              onTails: '-2_to_all_rolls'
            },
            duration: '1 hour'
          }
        },

        specialMechanics: {
          fortunePoints: {
            cost: 1,
            effect: 'Flip the result (Heads to Tails or vice versa)',
            guarantee: 'With 1 point, always get +2 bonus'
          },
          coinFlip: {
            type: '1d2',
            heads: 2,
            tails: 1
          }
        },

        rollableTable: {
          enabled: true,
          name: 'Coin Toss Results',
          description: 'Flip a coin',
          resolutionType: 'COIN_FLIP',
          resolutionConfig: { diceType: 'coin' },
          entries: [
            { range: 'Heads', result: '+2 bonus to all rolls for 1 hour', description: 'Positive outcome' },
            { range: 'Tails', result: '-2 penalty to all rolls for 1 hour', description: 'Negative outcome' }
          ]
        },

        tags: ['buff', 'debuff', 'coin-flip', 'duration', 'gambler']
      },

      {
        id: 'gamblers-insight',
        name: "Gambler's Insight",
        icon: 'spell_holy_sealofwisdom',
        spellType: 'ACTION',
        school: 'Utility',
        level: 2,

        description: 'Gain advantage on Insight and Perception checks against one creature for 10 minutes. Detect lies, read intentions, notice body language, predict moves.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE'
        },

        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 30
        },

        durationConfig: {
          durationType: 'timed',
          duration: 10,
          durationUnit: 'minute'
        },

        resourceCost: {
          mana: 3,
          components: ['verbal', 'somatic'],
          verbalText: 'Perspicio Verum!',
          somaticText: 'Touch temple and point at target'
        },

        resolution: 'AUTOMATIC',

        effects: {
          buff: {
            type: 'advantage',
            checks: ['Insight', 'Perception'],
            target: 'single_creature',
            duration: '10 minutes'
          }
        },

        specialMechanics: {
          utility: {
            uses: ['Detect lies', 'Read intentions', 'Notice body language', 'Predict moves'],
            synergy: 'Pairs with Gambler charisma and deception skills'
          },
          social: {
            applications: ['Negotiations', 'Detecting ambushes', 'Social encounters']
          }
        },

        tags: ['utility', 'social', 'detection', 'gambler']
      },

      {
        id: 'fools-gold',
        name: "Fool's Gold",
        icon: 'inv_misc_coin_02',
        spellType: 'ACTION',
        school: 'Illusion',
        level: 2,

        description: 'Create illusory gold/treasure (up to 100gp value) that looks real but vanishes when touched. Lasts 1 hour. Perfect for bribes, distractions, escapes, cons, and traps.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE'
        },

        targetingConfig: {
          targetingType: 'point',
          rangeType: 'touch'
        },

        durationConfig: {
          durationType: 'timed_or_until_touched',
          duration: 1,
          durationUnit: 'hour'
        },

        resourceCost: {
          mana: 3,
          components: ['verbal', 'somatic', 'material'],
          verbalText: 'Aurum Falsum!',
          somaticText: 'Conjure illusory treasure',
          materialText: 'A copper piece'
        },

        resolution: 'AUTOMATIC',

        effects: {
          illusion: {
            type: 'visual_perfect',
            value: 'up to 100gp',
            duration: '1 hour or until touched',
            detection: 'vanishes_on_touch'
          }
        },

        specialMechanics: {
          illusion: {
            quality: 'Perfect to visual inspection',
            substance: 'No physical substance',
            detection: 'Touch immediately reveals fake'
          },
          utility: {
            uses: ['Bribes', 'Distractions', 'Escape tactics', 'Deception', 'Cons', 'Baiting traps']
          }
        },

        tags: ['utility', 'illusion', 'deception', 'gambler']
      }
  ]
};
