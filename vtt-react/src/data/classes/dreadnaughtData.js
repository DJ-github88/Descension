/**
 * Dreadnaught Class Data
 * 
 * Complete class information for the Dreadnaught - a dark resilient tank
 * that converts damage taken into Dark Resilience Points (DRP) for powerful abilities.
 */

export const DREADNAUGHT_DATA = {
  id: 'dreadnaught',
  name: 'Dreadnaught',
  icon: 'fas fa-shield',
  role: 'Tank',

  // Overview section
  overview: {
    title: 'The Dreadnaught',
    subtitle: 'Dark Resilient Tank',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: The Dreadnaught is a tank who converts damage taken into Dark Resilience Points (DRP). Gain 1 DRP for every 5 damage taken (max 50 DRP). Spend DRP on powerful abilities: Shadow Shield (2:1 damage absorption), Wraith Strike (+1d6 necrotic per 5 DRP), Unholy Fortitude (+1 AC per 5 DRP), Necrotic Aura (15 DRP debuff). Passive benefits at 10+ DRP: resistance to one damage type + HP regeneration (1 HP per 10 DRP). Dark Rebirth auto-triggers at 0 HP: spend all DRP to regain HP equal to 2x DRP.

**Core Mechanic**: Take damage → Generate DRP → Spend on abilities OR save for passive benefits + emergency Dark Rebirth

**Resource**: Dark Resilience Points (0-50, generated from damage taken)

**Playstyle**: Frontline tank, damage-to-power conversion, adaptive defense, last stand specialist

**Best For**: Players who enjoy tanking, converting pain into power, and managing a damage-based resource`
    },

    description: `The Dreadnaught taps into their dark connection to fuel their resilience and power. As they take damage, they build up Dark Resilience Points (DRP), which can be used to enhance their defensive and offensive capabilities. This system emphasizes the Dreadnaught's ability to absorb and utilize damage taken, turning it into a powerful resource for both offense and defense.`,
    
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
**Adaptive Defense**: Can spend DRP on shields, AC boosts, or damage resistance
**Sustained Presence**: Passive regeneration and resistance keep them in the fight
**Offensive Pressure**: Wraith Strike and Necrotic Aura provide damage output
**Last Stand Capability**: Dark Rebirth allows recovery from lethal damage

The Dreadnaught's power scales with the danger they face. The more damage they take, the more resources they have to work with. This creates exciting gameplay where taking hits is actually beneficial, as long as they manage their DRP wisely.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Dreadnaught is about converting pain into power. Key strategic considerations:

**DRP Generation**: 
- Gain 1 DRP for every 5 damage taken
- Maximum capacity: 50 DRP
- Position yourself to take hits and build resources

**DRP Spending Priorities**: 
- **Shadow Shield** (2:1 ratio): Spend DRP to absorb twice the damage
- **Wraith Strike** (1d6 per 5 DRP): Add necrotic damage to attacks
- **Unholy Fortitude** (+1 AC per 5 DRP): Boost defense for sustained combat
- **Necrotic Aura** (15 DRP): Debuff enemies with disadvantage on attacks

**Passive Benefits**: 
- At 10+ DRP: Gain resistance to one damage type
- At 10+ DRP: Regenerate 1 HP per 10 DRP at turn start
- At 20+ DRP: Regenerate 2 HP per turn
- At 30+ DRP: Regenerate 3 HP per turn

**Dark Rebirth**: 
- Automatically triggers when reaching 0 HP
- Spend all remaining DRP to regain HP equal to twice the DRP
- Your ultimate survival tool—always keep some DRP in reserve

**Resource Management**:
- Don't spend all DRP immediately—save some for emergencies
- Balance between offensive (Wraith Strike) and defensive (Shadow Shield) spending
- Time Necrotic Aura for maximum impact when surrounded
- Always keep 10+ DRP for passive benefits`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Undying Wall',
      content: `**The Setup**: Your party is ambushed by a pack of dire wolves (5 wolves, 1 alpha). You're the Dreadnaught tank with 120/120 HP and 0 DRP. Your job: protect the party while they deal damage. Time to embrace the pain.

**Starting State**: HP: 120/120 | DRP: 0/50 | AC: 18

**Turn 1 - Taking the Hits (HP: 120 → 85, DRP: 0 → 7)**

*The wolves surround you. The alpha snarls. You plant your feet and raise your shield. "Come on, then."*

**Wolves' Turn**: 3 wolves attack you (2 hit, 1 miss)
- Wolf 1: Attack roll [18] → Hit! → 2d6+3 → [5, 4] + 3 = 12 damage
- Wolf 2: Attack roll [16] → Hit! → 2d6+3 → [6, 5] + 3 = 14 damage
- Wolf 3: Attack roll [11] → Miss!

**Damage Taken**: 12 + 14 = 26 damage
**HP**: 120 - 26 = 94 HP
**DRP Generated**: 26 ÷ 5 = 5.2 → **5 DRP** (round down)

*You feel the wolves' teeth sink into your armor. Pain flares—but with it comes POWER. Dark energy swirls around you.*

**Alpha Wolf's Turn**: Attacks you → [19] → Hit! → 3d6+4 → [6, 5, 4] + 4 = 19 damage
**HP**: 94 - 19 = 75 HP
**DRP Generated**: 19 ÷ 5 = 3.8 → **3 DRP**
**Total DRP**: 5 + 3 = **8 DRP**

*The alpha's jaws clamp down on your shoulder. You don't scream. You SMILE. The darkness feeds on your pain.*

**Your Turn**: Attack alpha wolf with Wraith Strike (spend 5 DRP for +1d6 necrotic)
**DRP**: 8 - 5 = 3 DRP remaining
**Attack Roll**: d20+6 → [15] → Hit!
**Damage**: 2d8 (weapon) + 1d6 (Wraith Strike) → [7, 6] + [5] = 18 damage

*Your blade strikes, wreathed in dark energy. The alpha yelps.*

**Current State**: HP: 75/120 | DRP: 3/50

**Turn 2 - Building Power (HP: 75 → 50, DRP: 3 → 8)**

*More wolves attack. You're bleeding, but the darkness is growing stronger.*

**Wolves' Turn**: 4 wolves attack you (3 hit, 1 miss)
- Total Damage: 13 + 11 + 14 = 38 damage
**HP**: 75 - 38 = 37 HP
**DRP Generated**: 38 ÷ 5 = 7.6 → **7 DRP**
**Total DRP**: 3 + 7 = **10 DRP**

*You're at 37/120 HP (31%), but you've hit 10 DRP—the threshold for passive benefits.*

**Passive Benefits Activate**:
- **Dark Resistance**: Choose slashing damage (wolves deal slashing)
- **Health Regeneration**: 1 HP per 10 DRP = 1 HP/turn

*A shadowy aura envelops you. The next wolf bite feels... distant. Muted. Your wounds begin to close with dark energy.*

**Regeneration**: +1 HP (10 DRP ÷ 10 = 1 HP)
**HP**: 37 + 1 = 38 HP

**Your Turn**: Use Shadow Shield (spend 10 DRP for 20 damage absorption)
**DRP**: 10 - 10 = 0 DRP
**Effect**: Next 20 damage absorbed by shadow shield

*You raise your hand, and a barrier of pure darkness materializes. "You'll have to do better than that."*

**Current State**: HP: 38/120 | DRP: 0/50 | Shadow Shield: 20

**Turn 3 - The Shield Holds (HP: 38 → 38, DRP: 0 → 4)**

*The wolves attack again, but your shadow shield absorbs the blows.*

**Wolves' Turn**: 3 wolves attack (2 hit, 1 miss)
- Total Damage: 12 + 15 = 27 damage
**Shadow Shield**: Absorbs 20 damage
**Remaining Damage**: 27 - 20 = 7 damage
**HP**: 38 - 7 = 31 HP
**DRP Generated**: 27 ÷ 5 = 5.4 → **5 DRP** (you generate DRP from total damage, not just what gets through!)

*The shadow shield shatters, but it saved you. You're still standing.*

**Alpha Wolf's Turn**: Attacks → [17] → Hit! → 18 damage
**Resistance**: Slashing damage (you have Dark Resistance active!)
**Damage Taken**: 18 ÷ 2 = 9 damage (halved!)
**HP**: 31 - 9 = 22 HP
**DRP Generated**: 18 ÷ 5 = 3.6 → **3 DRP** (calculated from full damage before resistance!)
**Total DRP**: 5 + 3 = **8 DRP**

*The alpha's bite is weakened by your dark aura. You're at 22/120 HP (18%), but you're not done yet.*

**Your Turn**: Attack alpha wolf
**Attack Roll**: d20+6 → [16] → Hit!
**Damage**: 2d8 → [8, 7] = 15 damage
**Alpha Wolf**: DEAD

*The alpha falls. The pack hesitates.*

**Current State**: HP: 22/120 | DRP: 8/50

**Turn 4 - The Comeback (HP: 22 → 0 → 16, DRP: 8 → 0)**

*The remaining wolves attack in desperation.*

**Wolves' Turn**: 4 wolves attack (all hit in frenzy)
- Total Damage: 14 + 13 + 12 + 15 = 54 damage!
**HP**: 22 - 54 = **-32 HP** (YOU DIE!)

**DARK REBIRTH TRIGGERS!**

*You fall. The world goes dark. But the darkness is your ally. It will not let you die.*

**Dark Rebirth Effect**: Spend all remaining DRP (8 DRP) to regain HP equal to 2x DRP
**HP Regained**: 8 × 2 = 16 HP
**HP**: 0 → 16 HP (YOU LIVE!)
**DRP**: 8 - 8 = 0 DRP

*You rise from the ground, dark energy pouring from your wounds. The wolves back away, terrified.*

**Your Party's Mage**: Casts Fireball → Kills 2 wolves
**Your Party's Rogue**: Sneak attack → Kills 1 wolf
**Remaining**: 1 wolf (fleeing)

**Your Turn**: Let it run. You've made your point.

*You stand among the corpses, bleeding but alive. Your party stares at you.*

**Your Healer**: "You... you died. I saw you die."
**You**: "Death is just another resource. I spent it wisely."

**The Lesson**: Dreadnaught gameplay is about:
1. **Damage-to-Power**: Took 145 damage total, generated 23 DRP (145 ÷ 5 = 29, but capped at 50 max)
2. **Passive Benefits**: At 10+ DRP, gained resistance (halved damage) + regeneration (1 HP/turn)
3. **Shadow Shield**: Spent 10 DRP for 20 damage absorption (2:1 ratio = efficient!)
4. **Dark Rebirth**: Auto-triggered at 0 HP, spent 8 DRP to regain 16 HP (saved your life!)
5. **Resistance Math**: Alpha's 18 damage → 9 after resistance, but DRP calculated from full 18 (you still gain resources!)
6. **Strategic Spending**: Spent 15 DRP total (5 on Wraith Strike, 10 on Shadow Shield), saved 8 for Dark Rebirth

You're not a tank who avoids damage—you're a tank who CONVERTS damage into power. The more you suffer, the stronger you become. Death itself is just another tool in your arsenal.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Dark Resilience Points (DRP)',
    subtitle: 'Convert Pain into Power',

    description: `Dark Resilience Points represent the Dreadnaught's ability to absorb damage and convert it into dark energy. Every hit they take fuels their power, allowing them to unleash devastating abilities or create impenetrable defenses. Unlike other tanks who avoid damage, Dreadnaughts EMBRACE it—pain is their resource, suffering is their strength.`,

    resourceBarExplanation: {
      title: 'Understanding Your DRP Bar',
      content: `**What You See**: Your DRP bar displays as a dark purple-black bar with 50 segments, each representing 1 DRP. As you take damage, segments fill with shadowy energy, pulsing with dark power.

**Visual Representation by DRP Level**:
- **0-9 DRP**: Few segments filled, dim glow, building phase
- **10-19 DRP**: Moderate fill, purple glow, passive benefits activate (resistance + 1 HP regen)
- **20-29 DRP**: Half filled, bright purple, 2 HP regen/turn
- **30-39 DRP**: Mostly filled, intense glow, 3 HP regen/turn
- **40-49 DRP**: Nearly full, violent pulsing, 4 HP regen/turn
- **50 DRP**: MAXIMUM - Bar glows white-hot with dark energy, 5 HP regen/turn

**How It Changes**:
- **When You Take Damage**: Segments fill based on damage ÷ 5 (smooth fill animation)
  - Example: Take 23 damage → +4 DRP (23 ÷ 5 = 4.6, round down)
- **When You Spend DRP**: Segments drain into your ability (energy flows from bar to spell effect)
- **When Dark Rebirth Triggers**: Entire bar EXPLODES into healing energy, resets to 0

**The DRP Counter**: Below the bar is a numerical display showing "X/50 DRP" with color coding:
- **0-9 DRP**: White text (building phase)
- **10-19 DRP**: Yellow text (passive benefits active)
- **20-29 DRP**: Orange text (strong regeneration)
- **30-50 DRP**: Red text (maximum power)

**Passive Benefit Indicators**: When you hit 10+ DRP, icons appear showing:
- **Shield Icon**: Dark Resistance active (shows chosen damage type)
- **Heart Icon**: HP Regeneration active (shows amount: 1-5 HP/turn)

**Dark Rebirth Indicator**: A skull icon appears when you have 10+ DRP, showing "Emergency HP: X" (where X = 2× your current DRP). This shows how much HP you'd regain if you died right now.

**Why This Matters**:

DRP is a **reactive resource**—you don't generate it by casting spells or attacking. You generate it by TAKING DAMAGE. This creates a unique tanking dynamic:
- Other tanks: Avoid damage → Stay alive
- Dreadnaught: Take damage → Gain power → Spend power to survive

**The Dreadnaught's Paradox**:
- High HP, Low DRP = Safe but weak (no resources to spend)
- Low HP, High DRP = Dangerous but powerful (lots of resources, but close to death)
- Low HP, Low DRP = Critical danger (no resources, close to death)

**Strategic Depth**:

Unlike mana (which regenerates over time), DRP only generates from damage. This means:
1. **You WANT to get hit** (within reason)
2. **Positioning matters** (stand where enemies will attack you)
3. **Damage resistance affects DRP generation** (you still generate DRP from full damage before resistance!)

**The Resistance Trick**: When you have Dark Resistance active (10+ DRP), you take HALF damage from one type, but you still generate DRP from the FULL damage amount!
- Example: Take 20 slashing damage with slashing resistance
- Actual damage: 20 ÷ 2 = 10 HP lost
- DRP generated: 20 ÷ 5 = 4 DRP (calculated from full 20!)
- Result: You take less damage but generate MORE resources!

**The Regeneration Scaling**: HP regeneration scales with DRP:
- 10 DRP: +1 HP/turn
- 20 DRP: +2 HP/turn
- 30 DRP: +3 HP/turn
- 40 DRP: +4 HP/turn
- 50 DRP: +5 HP/turn

At 50 DRP, you're regenerating 5 HP every turn. In a 10-turn fight, that's 50 HP healed passively!

**Master Dreadnaughts Know**:
- Keep DRP between 15-30 (enough for abilities + Dark Rebirth safety net)
- Spend DRP on Shadow Shield when facing burst damage (2:1 ratio is efficient!)
- Save 10+ DRP for Dark Rebirth (insurance against death)
- Choose Dark Resistance based on enemy damage types (change it as needed)
- Don't cap at 50 DRP (you waste generation if you're already full)`
    },

    mechanics: {
      title: 'Detailed Mechanics',
      content: `**DRP Generation (Damage-to-Power Conversion)**

**Formula**: 1 DRP per 5 damage taken (round down)

**Examples**:
- Take 7 damage → 7 ÷ 5 = 1.4 → **1 DRP**
- Take 23 damage → 23 ÷ 5 = 4.6 → **4 DRP**
- Take 50 damage → 50 ÷ 5 = 10 → **10 DRP**

**Maximum Capacity**: 50 DRP (any excess is wasted)

**Persistence**: DRP persists between combats until spent or until you complete a long rest

**Important**: DRP is calculated from damage BEFORE resistance/reduction
- Example: Take 20 damage with resistance (10 actual damage) → Still generate 4 DRP (20 ÷ 5)

**Spending DRP (Active Abilities)**

**Shadow Shield** (Variable Cost):
- **Effect**: Absorb damage equal to 2× DRP spent
- **Cost**: Any amount of DRP
- **Ratio**: 2:1 (spend 10 DRP → absorb 20 damage)
- **Example**: Spend 15 DRP → Create shield that absorbs 30 damage
- **Usage**: Best used before taking burst damage

**Wraith Strike** (5/10/15/20 DRP):
- **Effect**: Add necrotic damage to next attack
- **Scaling**:
  - 5 DRP: +1d6 necrotic
  - 10 DRP: +2d6 necrotic
  - 15 DRP: +3d6 necrotic
  - 20 DRP: +4d6 necrotic
- **Example**: Spend 15 DRP → Next attack deals +3d6 necrotic (~10 bonus damage)

**Unholy Fortitude** (5/10/15/20 DRP):
- **Effect**: Increase AC for 1 minute
- **Scaling**:
  - 5 DRP: +1 AC
  - 10 DRP: +2 AC
  - 15 DRP: +3 AC
  - 20 DRP: +4 AC
- **Example**: Spend 10 DRP → +2 AC for 1 minute (10 turns)

**Necrotic Aura** (15 DRP):
- **Effect**: Enemies within 10 feet have disadvantage on attacks for 1 minute
- **Cost**: Fixed 15 DRP
- **Usage**: Best when surrounded by multiple enemies

**Dark Rebirth** (All Remaining DRP):
- **Trigger**: Automatically activates when you reach 0 HP
- **Effect**: Regain HP equal to 2× DRP spent
- **Cost**: ALL remaining DRP (resets to 0)
- **Example**: Die with 20 DRP → Spend all 20 → Regain 40 HP → Back at 40 HP with 0 DRP

**Passive Benefits (Always Active)**

**Dark Resistance** (Requires 10+ DRP):
- **Effect**: Gain resistance to one damage type of your choice
- **Activation**: Choose damage type when you first reach 10 DRP
- **Change**: Can change damage type for 1 AP
- **Types**: Slashing, piercing, bludgeoning, fire, cold, lightning, necrotic, radiant, etc.

**Health Regeneration** (Requires 10+ DRP):
- **Effect**: Regenerate HP at the start of each turn
- **Scaling**:
  - 10-19 DRP: +1 HP/turn
  - 20-29 DRP: +2 HP/turn
  - 30-39 DRP: +3 HP/turn
  - 40-49 DRP: +4 HP/turn
  - 50 DRP: +5 HP/turn
- **Example**: At 25 DRP, regenerate 2 HP every turn

**Strategic Balance**:
The key to mastering the Dreadnaught is knowing when to spend DRP versus saving it for passive benefits and Dark Rebirth. At 30 DRP, you're regenerating 3 HP/turn—but you could also spend 20 DRP on Wraith Strike for +4d6 damage. Choose wisely.`
    },
    
    drpAbilitiesTable: {
      title: 'DRP Abilities & Costs',
      headers: ['Ability', 'DRP Cost', 'Effect', 'Usage'],
      rows: [
        ['Shadow Shield', 'Variable', 'Absorb damage equal to 2× DRP spent', 'Any time'],
        ['Wraith Strike', '5/10/15/20', 'Deal +1d6/2d6/3d6/4d6 necrotic damage on next attack', 'On next attack'],
        ['Unholy Fortitude', '5/10/15/20', 'Increase AC by +1/+2/+3/+4 for 1 minute', 'Any time'],
        ['Necrotic Aura', '15', 'Enemies within 10 feet have disadvantage on attacks for 1 minute', 'Any time'],
        ['Dark Rebirth', 'All remaining', 'Regain HP equal to 2× DRP when reaching 0 HP', 'Automatic']
      ]
    },

    passiveEffectsTable: {
      title: 'Passive DRP Benefits',
      headers: ['DRP Threshold', 'Passive Effect', 'Notes'],
      rows: [
        ['10+', 'Dark Resistance: Resistance to one damage type', 'Choose type when reaching 10 DRP'],
        ['10+', 'Regenerate 1 HP at start of turn', 'Scales with DRP amount'],
        ['20+', 'Regenerate 2 HP at start of turn', 'Increased regeneration'],
        ['30+', 'Regenerate 3 HP at start of turn', 'Maximum regeneration'],
        ['40+', 'Regenerate 4 HP at start of turn', 'Elite survivability'],
        ['50', 'Regenerate 5 HP at start of turn', 'Maximum DRP capacity']
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Early Combat (0-15 DRP)**: Focus on building DRP by positioning yourself to take hits. Use basic attacks and save DRP for critical moments.

**Mid Combat (16-30 DRP)**: Your sweet spot. You have enough DRP for meaningful abilities while maintaining passive benefits. Use Shadow Shield to mitigate burst damage and Wraith Strike for offensive pressure.

**High DRP (31-50 DRP)**: Maximum power. You're regenerating significant HP each turn and have resources for multiple abilities. Consider using Necrotic Aura to control the battlefield.

**Emergency Reserve**: Always keep at least 10-15 DRP in reserve for Dark Rebirth. This ensures you can survive a lethal blow and continue fighting.

**Damage Type Selection**: When choosing your Dark Resistance damage type at 10 DRP, consider the enemies you're facing. Change it strategically as combat evolves.`
    },

    practicalExample: {
      title: 'Practical Decision-Making Example',
      content: `**Scenario**: Boss fight, Turn 6. You're at 45/120 HP with 28 DRP. The boss just used a powerful ability and will attack you next turn for an estimated 40 damage. Your party's healer is out of mana. You're the only thing standing between the boss and your party.

**Current State**:
- HP: 45/120 (38%, dangerous)
- DRP: 28/50
- Boss's Next Attack: ~40 damage (will kill you: 45 - 40 = 5 HP)
- Healer: Out of mana (can't heal you)
- Dark Resistance: Currently set to fire (boss deals slashing damage)

**Passive Benefits (28 DRP)**:
- Dark Resistance: Fire (WRONG TYPE for this boss!)
- HP Regeneration: +2 HP/turn (20-29 DRP range)

**Option A - Shadow Shield (Spend 20 DRP)**:
Use Shadow Shield to absorb 40 damage (spend 20 DRP for 40 absorption)
- Cost: 20 DRP (28 → 8 remaining)
- Result: Boss's 40 damage absorbed completely, you take 0 damage
- Pros: You survive the hit, stay at 45 HP
- Cons: Drop to 8 DRP (lose regeneration tier: 2 HP/turn → 0 HP/turn), only 8 DRP left for Dark Rebirth (16 HP if you die)
- Risk: If boss hits you again after shield breaks, you only have 8 DRP for Dark Rebirth (16 HP recovery)

**Option B - Change Dark Resistance + Take the Hit**:
Change Dark Resistance to slashing (boss's damage type), take reduced damage
- Cost: 0 DRP (1 AP to change resistance)
- Damage: 40 ÷ 2 = 20 damage (halved by resistance)
- HP: 45 - 20 = 25 HP
- DRP: 28 + 8 = 36 DRP (gain 8 DRP from 40 damage: 40 ÷ 5 = 8)
- Pros: Gain DRP, increase regeneration (28 → 36 DRP = 3 HP/turn), keep resources
- Cons: Drop to 25 HP (21%, very dangerous)
- Risk: One more hit might kill you

**Option C - Shadow Shield (Spend 10 DRP) + Change Resistance**:
Use smaller Shadow Shield (20 absorption) + change resistance to slashing
- Cost: 10 DRP (28 → 18 remaining)
- Shield: Absorbs 20 damage
- Remaining Damage: 40 - 20 = 20 damage with slashing resistance
- Actual Damage: 20 ÷ 2 = 10 damage
- HP: 45 - 10 = 35 HP
- DRP: 18 + 8 = 26 DRP (gain 8 from full 40 damage before shield/resistance)
- Pros: Moderate damage taken, keep decent DRP, maintain regeneration
- Cons: Complex, requires two actions
- Risk: Moderate

**Option D - Unholy Fortitude (Spend 15 DRP) + Change Resistance**:
Boost AC by +3 (spend 15 DRP), change resistance, hope boss misses
- Cost: 15 DRP (28 → 13 remaining)
- AC: 18 → 21 (boss needs to roll higher to hit)
- Pros: If boss misses, you take 0 damage and keep HP
- Cons: If boss hits anyway, you wasted 15 DRP and still take damage
- Risk: Gambling on boss missing (depends on boss's attack bonus)

**Best Choice**: Option B (Change Dark Resistance + Take the Hit)

**Why**:
1. **DRP Generation**: Taking 40 damage generates 8 DRP (40 ÷ 5), bringing you to 36 DRP
2. **Regeneration Tier**: 36 DRP = 3 HP/turn (up from 2 HP/turn at 28 DRP)
3. **Dark Rebirth Safety**: 36 DRP = 72 HP recovery if you die (much better than 16 HP from Option A)
4. **Resource Efficiency**: You don't spend DRP, you GAIN it
5. **Resistance Math**: 40 damage → 20 actual damage (halved), but still generate 8 DRP from full 40

**Execution**:
- **Action (1 AP)**: Change Dark Resistance from fire → slashing
- **Boss's Turn**: Attacks for 40 damage
- **Resistance Applied**: 40 ÷ 2 = 20 damage taken
- **HP**: 45 - 20 = 25 HP
- **DRP Generated**: 40 ÷ 5 = 8 DRP
- **DRP**: 28 + 8 = 36 DRP
- **Regeneration**: Now at 3 HP/turn (36 DRP is in 30-39 range)

**Next Turn**:
- **Regeneration**: +3 HP (25 → 28 HP)
- **Your Action**: Attack boss with Wraith Strike (spend 15 DRP for +3d6 necrotic)
- **DRP**: 36 - 15 = 21 DRP remaining
- **Dark Rebirth Safety**: 21 DRP = 42 HP recovery if you die

**Result**: You're at 28 HP with 21 DRP, regenerating 2 HP/turn, with 42 HP emergency recovery available. You survived, gained resources, and can continue fighting.

**Alternative if Boss Attack Was 60+ Damage**: Option A (Shadow Shield 30 DRP)
- Why: If boss deals 60 damage, resistance only reduces it to 30 (still might kill you at 45 HP)
- Better: Spend 30 DRP for 60 absorption shield (full block)

**Alternative if You Had 50 DRP**: Option B still (Take the Hit)
- Why: At 50 DRP (max), you can't generate more DRP (wasted)
- Better: Take damage to "spend" some DRP capacity, then regenerate it

**The Lesson**: Dreadnaught decision-making involves:
1. **Resistance Optimization**: Change Dark Resistance to match incoming damage type
2. **DRP Generation Math**: Taking damage generates DRP (sometimes better than avoiding it!)
3. **Regeneration Tiers**: Higher DRP = more HP/turn (36 DRP = 3 HP/turn)
4. **Dark Rebirth Planning**: Always keep 15-20 DRP for emergency resurrection (30-40 HP recovery)
5. **The Resistance Trick**: Resistance halves damage taken, but DRP calculated from FULL damage
6. **Resource Efficiency**: Sometimes taking damage is better than spending DRP to avoid it

You're not a tank who hides behind shields—you're a tank who FEEDS on pain. Every hit makes you stronger. Every wound is an investment. Master the balance between suffering and power, and you become truly unkillable.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `The Dreadnaught's Dark Resilience Points system (0-50 DRP, generated from damage taken) creates a unique pain-to-power in-person experience. Here's how to track your dark resilience at the table:

**Required Materials**:
- **50 tokens or beads** (dark purple/black for DRP)
- **DRP reference card** with spending options
- **Damage calculator** (for converting damage to DRP)
- **Resistance tracker** (for current damage type resistance)

**Dark Resilience Points Tracking**:

**The Token Method** (Recommended):

Use physical tokens to represent DRP (0-50):
- **Starting State**: Begin with 0 DRP
- **Generating DRP**: Add tokens when you take damage
  - Formula: Damage ÷ 5 = DRP gained (round down)
  - Example: Take 23 damage → 23 ÷ 5 = 4.6 → +4 DRP (add 4 tokens)
  - Example: Take 47 damage → 47 ÷ 5 = 9.4 → +9 DRP (add 9 tokens)
- **Spending DRP**: Remove tokens when using abilities
  - Shadow Shield (variable) → Remove tokens equal to half the damage absorbed
  - Wraith Strike (5 DRP per 1d6) → Remove 5 tokens per 1d6 damage
  - Unholy Fortitude (5 DRP per +1 AC) → Remove 5 tokens per +1 AC
  - Necrotic Aura (15 DRP) → Remove 15 tokens

**Alternative Tracking**: Use 5d10 dice to track DRP (tens place + ones place).

**DRP Spending Reference**:
\`\`\`
DARK RESILIENCE POINT ABILITIES

SHADOW SHIELD (Variable DRP)
Spend X DRP to absorb 2X damage
Example: Spend 10 DRP → Absorb 20 damage
Ratio: 2:1 (very efficient!)

WRAITH STRIKE (5 DRP per 1d6)
Add necrotic damage to your next attack
5 DRP = +1d6 | 10 DRP = +2d6 | 15 DRP = +3d6

UNHOLY FORTITUDE (5 DRP per +1 AC)
Boost AC for 3 rounds
5 DRP = +1 AC | 10 DRP = +2 AC | 15 DRP = +3 AC

NECROTIC AURA (15 DRP)
Enemies within 10 ft have disadvantage on attacks
Duration: 2 rounds

DARK REBIRTH (All DRP, automatic)
When you reach 0 HP, spend all DRP
Regain HP = 2× DRP spent
Example: 25 DRP → Regain 50 HP
\`\`\`

**Passive Benefits Tracking**:

At 10+ DRP, you gain passive benefits:
- **Dark Resistance**: Choose one damage type, gain resistance
- **HP Regeneration**: Regen HP at start of turn based on DRP

**Regeneration Table**:
\`\`\`
10-19 DRP: +1 HP/turn
20-29 DRP: +2 HP/turn
30-39 DRP: +3 HP/turn
40-49 DRP: +4 HP/turn
50 DRP: +5 HP/turn
\`\`\`

**Resistance Tracker**: Use a token or die to show current resistance type (fire, cold, slashing, etc.).

**Example In-Person Turn**:

*You have 12 DRP, 60/120 HP, Dark Resistance: Fire*

**Turn 1 - Take Damage (Generate DRP)**:
1. Orc attacks you for 28 damage
2. Calculate DRP: 28 ÷ 5 = 5.6 → +5 DRP
3. Add 5 tokens: 12 + 5 = 17 DRP
4. HP: 60 - 28 = 32 HP
5. Regeneration: +1 HP (10-19 DRP range) → 33 HP

**Turn 2 - Spend DRP (Shadow Shield)**:
1. Boss winds up massive attack (estimated 40 damage)
2. "I use Shadow Shield! Spending 20 DRP to absorb 40 damage!"
3. Remove 20 tokens: 17 - 20 = Can't afford it!
4. "I spend 15 DRP to absorb 30 damage instead!"
5. Remove 15 tokens: 17 - 15 = 2 DRP
6. Boss attacks for 42 damage → 30 absorbed, 12 taken
7. HP: 33 - 12 = 21 HP
8. Generate DRP: 42 ÷ 5 = 8.4 → +8 DRP
9. Add 8 tokens: 2 + 8 = 10 DRP

**Turn 3 - Change Resistance**:
1. "Boss uses fire breath next turn! I change Dark Resistance to fire!"
2. Update resistance tracker: Fire → Fire (already set!)
3. Regeneration: +1 HP (10 DRP) → 22 HP
4. Attack with Wraith Strike: Spend 10 DRP for +2d6 necrotic
5. Remove 10 tokens: 10 - 10 = 0 DRP

**Turn 4 - Dark Rebirth**:
1. Boss attacks for 30 damage
2. HP: 22 - 30 = -8 HP → **YOU DIE!**
3. **Dark Rebirth triggers automatically!**
4. Current DRP: 0 → Can't use Dark Rebirth (need DRP!)
5. **YOU ARE DEAD** (no DRP to spend)

**Lesson**: Always keep 10-15 DRP in reserve for Dark Rebirth!

**Damage-to-DRP Conversion Chart**:
\`\`\`
5 dmg = 1 DRP    |  30 dmg = 6 DRP
10 dmg = 2 DRP   |  35 dmg = 7 DRP
15 dmg = 3 DRP   |  40 dmg = 8 DRP
20 dmg = 4 DRP   |  45 dmg = 9 DRP
25 dmg = 5 DRP   |  50 dmg = 10 DRP
\`\`\`

**Quick Reference Card**:
\`\`\`
DREADNAUGHT QUICK REFERENCE

DARK RESILIENCE POINTS:
• Maximum: 50 DRP
• Generate: Damage ÷ 5 (round down)
• Persist: DRP carry over between combats

SPENDING:
Shadow Shield: X DRP → Absorb 2X damage (2:1 ratio)
Wraith Strike: 5 DRP per +1d6 necrotic damage
Unholy Fortitude: 5 DRP per +1 AC (3 rounds)
Necrotic Aura: 15 DRP (disadvantage on attacks, 2 rounds)

PASSIVE BENEFITS (10+ DRP):
• Dark Resistance: Choose damage type, gain resistance
• HP Regeneration: 1-5 HP/turn (based on DRP)

DARK REBIRTH (Automatic at 0 HP):
• Spend all DRP → Regain 2× DRP as HP
• Example: 20 DRP → Regain 40 HP
• ALWAYS keep 10-15 DRP in reserve!
\`\`\`

**Thematic Enhancements**:

Many players enhance the dreadnaught experience with:
- **Dark Tokens**: Use black/purple beads for DRP
- **Resistance Die**: Use a d8 to track current resistance type
- **Regeneration Tracker**: Use a token to show HP regen amount
- **Dark Rebirth Marker**: Special token to remind you of emergency HP
- **Damage Calculator**: Keep a calculator handy for damage ÷ 5

**Why This System Works**: The physical act of adding DRP tokens after taking damage creates a satisfying PAIN-TO-POWER feedback loop. You can SEE your dark resilience building with each hit, FEEL the decision of when to spend it, and EXPERIENCE the dramatic moment of Dark Rebirth when you spend all tokens to cheat death. The conversion formula (damage ÷ 5) is simple enough to calculate quickly, and the 2:1 Shadow Shield ratio makes spending DRP feel powerful and efficient.

**Pro Tips**:
- **DRP Banking**: Always keep 15-20 DRP for Dark Rebirth (30-40 HP recovery)
- **Resistance Optimization**: Change Dark Resistance to match incoming damage
- **Shadow Shield Math**: 2:1 ratio means 25 DRP absorbs 50 damage!
- **Regeneration Tiers**: Push for 20+ DRP for 2 HP/turn regen
- **The Resistance Trick**: Resistance halves damage taken, but DRP calculated from FULL damage

**Budget-Friendly Alternatives**:
- **No tokens?** Use 5d10 dice to track DRP (tens + ones)
- **No calculator?** Use the conversion chart
- **Minimalist**: Track DRP on paper with tally marks

**Why Dreadnaught Is Perfect for In-Person Play**: The class is built around converting damage into power—a simple, visceral concept that translates perfectly to tabletop. Every time you take damage, you calculate damage ÷ 5 and add tokens, creating a satisfying feedback loop. The physical pile of DRP tokens grows with each hit, making your increasing power tangible. The 2:1 Shadow Shield ratio is easy to calculate (spend 10 DRP, absorb 20 damage), and Dark Rebirth creates dramatic moments when you spend all your tokens to cheat death. You're not avoiding damage—you're EMBRACING it, and the tokens prove it.`
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
        icon: 'spell_shadow_twilight',
        color: '#4B0082',
        theme: 'Shadow Defense',
        
        description: `The Voidwarden specialization focuses on pure defensive power. Voidwarden Dreadnaughts maximize their damage absorption and regeneration, becoming nearly unkillable walls of shadow.`,
        
        playstyle: 'Maximum defense, high regeneration, damage absorption',
        
        strengths: [
          'Shadow Shield absorbs 2.5× DRP instead of 2×',
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
          description: 'Shadow Shield absorbs 2.5× DRP spent instead of 2×. Regeneration from DRP increased by 50%. Dark Resistance applies to two damage types.'
        }
      },
      {
        id: 'soulreaver',
        name: 'Soulreaver',
        icon: 'spell_shadow_soulleech_3',
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
          name: 'Soul Harvest',
          description: 'Wraith Strike heals for 50% of necrotic damage dealt. Generate 1 DRP when dealing necrotic damage. Gain 1 DRP per 4 damage taken instead of per 5.'
        }
      },
      {
        id: 'doomguard',
        name: 'Doomguard',
        icon: 'spell_shadow_demonicempathy',
        color: '#2F4F4F',
        theme: 'Retribution',
        
        description: `The Doomguard specialization focuses on turning damage taken into devastating counterattacks. Doomguard Dreadnaughts punish enemies for attacking them, creating a dangerous aura of retribution.`,
        
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
  
  // Example Spells - organized by level, showcasing DRP system
  exampleSpells: [
    // ========================================
    // LEVEL 1 SPELLS
    // ========================================
    {
      id: 'dread_shadow_shield',
      name: 'Shadow Shield',
      description: 'Create a shield of dark energy that absorbs damage equal to twice the DRP spent.',
      level: 1,
      spellType: 'REACTION',
      icon: 'spell_shadow_antishadow',
      school: 'Abjuration',

      typeConfig: {
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
        somaticText: 'Raise hand to summon shadow barrier'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'temporaryHP',
        effects: [{
          id: 'shadow_shield_absorption',
          name: 'Shadow Shield',
          description: 'Absorbs damage equal to 2× DRP spent',
          tempHPFormula: '2 * drpSpent',
          tempHPType: 'absorption'
        }],
        durationValue: 1,
        durationType: 'turns',
        durationUnit: 'turns',
        concentrationRequired: false,
        canBeDispelled: false
      },

      tags: ['defense', 'shield', 'absorption', 'drp', 'level-1', 'dreadnaught']
    },

    {
      id: 'dread_dark_resistance',
      name: 'Dark Resistance',
      description: 'While you have at least 10 DRP, gain resistance to one damage type of your choice.',
      level: 1,
      spellType: 'PASSIVE',
      icon: 'spell_shadow_antishadow',
      school: 'Abjuration',

      typeConfig: {
        castTime: 0,
        castTimeType: 'PASSIVE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 0,
        components: []
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'dark_resistance_passive',
          name: 'Dark Resistance',
          description: 'Gain resistance to one damage type of your choice (requires 10+ DRP)',
          statModifier: {
            stat: 'damageResistance',
            magnitude: 1,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 0,
        durationType: 'permanent',
        durationUnit: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      },

      tags: ['passive', 'resistance', 'defense', 'drp', 'level-1', 'dreadnaught']
    },

    {
      id: 'dread_dark_regeneration',
      name: 'Dark Regeneration',
      description: 'Regenerate hit points based on your DRP at the start of each turn.',
      level: 1,
      spellType: 'PASSIVE',
      icon: 'spell_shadow_lifedrain02',
      school: 'Necromancy',

      typeConfig: {
        castTime: 0,
        castTimeType: 'PASSIVE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 0,
        components: []
      },

      resolution: 'NONE',
      effectTypes: ['healing'],

      healingConfig: {
        formula: 'DRP / 10',
        healingType: 'hot',
        hasHotEffect: true,
        hotFormula: 'DRP / 10',
        hotDuration: 999,
        hotTickType: 'turn'
      },

      tags: ['passive', 'healing', 'regeneration', 'drp', 'level-1', 'dreadnaught']
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
      icon: 'spell_shadow_shadowwordpain',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5
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
        formula: '1d6 * (drpSpent / 5)',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2
      },

      tags: ['damage', 'necrotic', 'melee', 'drp', 'level-2', 'dreadnaught']
    },

    {
      id: 'dread_necrotic_touch',
      name: 'Necrotic Touch',
      description: 'Touch an enemy to drain their life force, dealing necrotic damage and healing yourself.',
      level: 2,
      spellType: 'ACTION',
      icon: 'spell_shadow_siphonmana',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
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
        formula: 'damageDealt / 2',
        healingType: 'direct',
        hasHotEffect: false
      },

      tags: ['damage', 'healing', 'necrotic', 'touch', 'drp', 'level-2', 'dreadnaught']
    },

    {
      id: 'dread_unholy_fortitude',
      name: 'Unholy Fortitude',
      description: 'Enhance your resilience with dark power for 1 minute, increasing armor by 1 for every 5 DRP spent. Spend variable DRP to scale the armor bonus.',
      level: 2,
      spellType: 'ACTION',
      icon: 'spell_shadow_unholyfrenzy',
      school: 'Abjuration',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
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
            magnitude: 'drpSpent / 5',
            magnitudeType: 'flat'
          }
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: false,
        canBeDispelled: false
      },

      tags: ['buff', 'ac', 'defense', 'drp', 'level-2', 'dreadnaught']
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
      icon: 'spell_shadow_deathcoil',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 10,
        aoeShape: 'sphere',
        aoeSize: 10
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 10 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Mortem Aura!',
        somaticText: 'Dark energy radiates outward'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d6 + spirit',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: false
      },

      tags: ['damage', 'necrotic', 'aoe', 'drp', 'level-3', 'dreadnaught']
    },

    {
      id: 'dread_blood_to_shadow',
      name: 'Blood to Shadow',
      description: 'Convert your own hit points into Dark Resilience Points. You channel your life force into shadowy energy, transforming physical vitality into dark power. The conversion is painful but necessary, trading immediate health for lasting resilience.',
      level: 3,
      spellType: 'ACTION',
      icon: 'spell_shadow_bloodboil',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['health'],
        resourceValues: { health: 'variable' },
        useFormulas: { health: true },
        resourceFormulas: { health: '5 * drp_gain' },
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Sangui Umbra!',
        somaticText: 'Blood turns to shadow'
      },

      resolution: 'NONE',
      effectTypes: ['resourceGain'],

      resourceGainConfig: {
        resources: [{
          type: 'drp',
          formula: 'health_spent / 5',
          description: 'Gain 1 DRP per 5 HP sacrificed'
        }]
      },

      tags: ['resource-gain', 'drp', 'health', 'level-3', 'dreadnaught']
    },

    {
      id: 'dread_dark_armor',
      name: 'Dark Armor',
      description: 'Surround yourself with protective shadows that grant damage resistance and temporary hit points.',
      level: 3,
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowform',
      school: 'Abjuration',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 15 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Arma Tenebra!',
        somaticText: 'Shadows coalesce into armor'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'combined',
        effects: [
          {
            id: 'dark_armor_resistance',
            name: 'Dark Armor Resistance',
            description: 'Resistance to necrotic and shadow damage',
            statModifier: {
              stat: 'damageResistance',
              magnitude: 1,
              magnitudeType: 'flat',
              damageTypes: ['necrotic']
            }
          },
          {
            id: 'dark_armor_temp_hp',
            name: 'Dark Armor Protection',
            description: 'Temporary hit points equal to DRP spent',
            tempHPFormula: 'drpSpent',
            tempHPType: 'temporary'
          }
        ],
        durationValue: 1,
        durationType: 'hours',
        durationUnit: 'hours',
        concentrationRequired: false,
        canBeDispelled: false
      },

      tags: ['buff', 'resistance', 'protection', 'drp', 'level-3', 'dreadnaught']
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
      icon: 'spell_shadow_vampiricaura',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5
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
        formula: '3d8 + spirit',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2
      },

      healingConfig: {
        formula: 'damageDealt / 2',
        healingType: 'direct',
        hasHotEffect: false
      },

      tags: ['damage', 'healing', 'necrotic', 'melee', 'drp', 'level-4', 'dreadnaught']
    },

    {
      id: 'dread_soul_drain',
      name: 'Soul Drain',
      description: 'Drain the soul essence from an enemy, dealing massive necrotic damage and gaining DRP.',
      level: 4,
      spellType: 'ACTION',
      icon: 'spell_shadow_soulleech_2',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60
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
      effectTypes: ['damage', 'resourceGain'],

      damageConfig: {
        formula: '4d6 + spirit',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: false
      },

      resourceGainConfig: {
        resources: [{
          type: 'drp',
          formula: '5',
          description: 'Gain 5 DRP from soul drain'
        }]
      },

      tags: ['damage', 'resource-gain', 'necrotic', 'ranged', 'drp', 'level-4', 'dreadnaught']
    },

    {
      id: 'dread_dark_empowerment',
      name: 'Dark Empowerment',
      description: 'Empower yourself with dark energy, gaining increased strength and necrotic damage on attacks.',
      level: 4,
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowembrace',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
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
            }
          }
        ],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: true,
        canBeDispelled: false
      },

      tags: ['buff', 'strength', 'damage', 'necrotic', 'drp', 'level-4', 'dreadnaught']
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
      icon: 'spell_shadow_deathsembrace',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
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
              damageTypes: ['all']
            }
          },
          {
            id: 'death_embrace_healing',
            name: 'Necrotic Healing',
            description: 'Heal from necrotic damage instead of taking it for 1 minute (requires concentration)',
            healingModifier: {
              elementType: 'necrotic',
              formula: 'damage_taken',
              healingType: 'conversion'
            }
          }
        ],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: true,
        canBeDispelled: false
      },

      tags: ['buff', 'resistance', 'healing', 'necrotic', 'drp', 'level-5', 'dreadnaught']
    },

    {
      id: 'dread_necrotic_wave',
      name: 'Necrotic Wave',
      description: 'Send out a wave of necrotic energy that damages and weakens enemies. The dark energy flows in a line, corrupting everything it touches. Those struck find their resistance to necrotic magic compromised, making them vulnerable to further dark effects.',
      level: 5,
      spellType: 'ACTION',
      icon: 'spell_shadow_unholyfrenzy',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
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
        formula: '4d6 + spirit',
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

      tags: ['damage', 'debuff', 'necrotic', 'aoe', 'line', 'drp', 'level-5', 'dreadnaught']
    },

    {
      id: 'dread_abyssal_shield',
      name: 'Abyssal Shield',
      description: 'Create a powerful shield for 1 turn that blocks all damage and reflects 50% back at attackers as necrotic damage. Spend variable DRP to activate.',
      level: 5,
      spellType: 'REACTION',
      icon: 'spell_shadow_sealofkings',
      school: 'Abjuration',

      typeConfig: {
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
        somaticText: 'Abyssal shield forms'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'damageReflection',
        effects: [{
          id: 'abyssal_shield_reflection',
          name: 'Abyssal Shield',
          description: 'Block all damage for 1 turn and reflect 50% back at attacker as necrotic damage',
          damageReflection: {
            percentage: 50,
            elementType: 'necrotic'
          }
        }],
        durationValue: 1,
        durationType: 'turns',
        durationUnit: 'turns',
        concentrationRequired: false,
        canBeDispelled: false
      },

      tags: ['defense', 'reflection', 'damage', 'necrotic', 'drp', 'level-5', 'dreadnaught']
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    {
      id: 'dread_shadow_step',
      name: 'Shadow Step',
      description: 'Dissolve into shadows and teleport up to 30 feet to an unoccupied space. Shadows linger at your departure and arrival points, creating areas of darkness that obscure vision and slow movement.',
      level: 6,
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowstep',
      school: 'Conjuration',

      typeConfig: {
        school: 'shadow',
        icon: 'spell_shadow_shadowstep',
        tags: ['movement', 'teleport', 'shadow', 'utility', 'debuff', 'area'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'location',
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

      tags: ['movement', 'teleport', 'shadow', 'drp', 'level-6', 'dreadnaught']
    },

    {
      id: 'dread_soul_rend',
      name: 'Soul Rend',
      description: 'Tear at an enemy\'s soul, dealing massive damage and potentially preventing healing.',
      level: 6,
      spellType: 'ACTION',
      icon: 'spell_shadow_soulleech_3',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60
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
        formula: '5d8 + spirit',
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
          }
        }],
        durationValue: 1,
        durationType: 'hours',
        durationUnit: 'hours',
        concentrationRequired: false,
        canBeDispelled: true
      },

      tags: ['damage', 'debuff', 'necrotic', 'healing-prevention', 'ranged', 'drp', 'level-6', 'dreadnaught']
    },

    {
      id: 'dread_apocalypse_aura',
      name: 'Apocalypse Aura',
      description: 'Surround yourself with apocalyptic energy that damages enemies and empowers undead allies.',
      level: 6,
      spellType: 'ACTION',
      icon: 'spell_shadow_shadesofdarkness',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
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
        formula: '3d6 + spirit',
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

      tags: ['damage', 'buff', 'necrotic', 'aoe', 'undead', 'drp', 'level-6', 'dreadnaught']
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
      icon: 'spell_shadow_twilight',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 120,
        aoeShape: 'sphere',
        aoeSize: 30
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 60 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Tenebra Aeterna!',
        somaticText: 'Darkness consumes the area',
        materialText: 'Obsidian orb worth 1000 gp'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff', 'terrain'],

      damageConfig: {
        formula: '4d6 + spirit',
        elementType: 'necrotic',
        damageType: 'hot',
        hasHotEffect: true,
        hotFormula: '2d6 + spirit',
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

      tags: ['damage', 'debuff', 'terrain', 'darkness', 'necrotic', 'aoe', 'drp', 'level-7', 'dreadnaught']
    },

    {
      id: 'dread_soul_harvest',
      name: 'Soul Harvest',
      description: 'Harvest souls from defeated enemies, gaining massive DRP and temporary undead minions.',
      level: 7,
      spellType: 'ACTION',
      icon: 'spell_shadow_shadetruesight',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeShape: 'sphere',
        aoeSize: 30
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 70 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Anima Messis!',
        somaticText: 'Souls are harvested'
      },

      resolution: 'NONE',
      effectTypes: ['resourceGain', 'summon'],

      resourceGainConfig: {
        resources: [{
          type: 'drp',
          formula: '10 * defeated_creatures',
          description: 'Gain 10 DRP per defeated enemy'
        }]
      },

      summonConfig: {
        creatureType: 'shadow_minion',
        number: 'min(defeated_creatures, 4)',
        durationValue: 1,
        durationType: 'hours',
        durationUnit: 'hours',
        stats: {
          hitPoints: '20 + spirit',
          attackBonus: 'proficiency + spirit_mod',
          damage: '1d8 + spirit_mod necrotic'
        }
      },

      tags: ['resource-gain', 'summon', 'undead', 'aoe', 'drp', 'level-7', 'dreadnaught']
    },

    {
      id: 'dread_void_eruption',
      name: 'Void Eruption',
      description: 'Cause a violent eruption of void energy that consumes everything in its path.',
      level: 7,
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowfury',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 120,
        aoeShape: 'cone',
        aoeSize: 60
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 80 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Vacuum Eruptio!',
        somaticText: 'Void energy explodes outward'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '6d8 + spirit',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: false,
        saveType: 'agility',
        saveDC: '8 + proficiency + spirit_mod',
        halfDamage: true
      },

      tags: ['damage', 'necrotic', 'aoe', 'cone', 'save', 'drp', 'level-7', 'dreadnaught']
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
      icon: 'spell_shadow_twilight',
      school: 'Abjuration',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 100 },
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
              damageTypes: ['poison', 'disease', 'necrotic', 'psychic']
            }
          },
          {
            id: 'immortal_fortress_resistance',
            name: 'Fortress Resistance',
            description: 'Resistance to all other damage types',
            statModifier: {
              stat: 'damageResistance',
              magnitude: 1,
              magnitudeType: 'flat',
              damageTypes: ['all']
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

      tags: ['buff', 'transformation', 'immunity', 'resistance', 'drp', 'level-8', 'dreadnaught']
    },

    {
      id: 'dread_soul_storm',
      name: 'Soul Storm',
      description: 'Unleash a storm of tormented souls that ravage enemies and heal you with their essence.',
      level: 8,
      spellType: 'ACTION',
      icon: 'spell_shadow_painspike',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'sphere',
        aoeSize: 30
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 90 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Anima Tempestas!',
        somaticText: 'Souls swirl in a deadly storm'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'healing'],

      damageConfig: {
        formula: '5d8 + spirit',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: false,
        saveType: 'constitution',
        saveDC: '8 + proficiency + spirit_mod',
        halfDamage: true
      },

      healingConfig: {
        formula: 'total_damage / 4',
        healingType: 'direct',
        hasHotEffect: false
      },

      tags: ['damage', 'healing', 'necrotic', 'aoe', 'save', 'drp', 'level-8', 'dreadnaught']
    },

    {
      id: 'dread_abyssal_apocalypse',
      name: 'Abyssal Apocalypse',
      description: 'Bring forth the end of days, devastating all enemies in the area with apocalyptic power.',
      level: 8,
      spellType: 'ACTION',
      icon: 'spell_shadow_mindtwisting',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 120,
        aoeShape: 'sphere',
        aoeSize: 40
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 120 },
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
        formula: '8d6 + spirit',
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
            description: 'Maximum hit points reduced by damage taken',
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

      tags: ['damage', 'debuff', 'necrotic', 'aoe', 'fear', 'save', 'drp', 'level-8', 'dreadnaught']
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    {
      id: 'dread_eternal_night',
      name: 'Eternal Night',
      description: 'Plunge the world into eternal darkness, draining life from all creatures in the area.',
      level: 9,
      spellType: 'ACTION',
      icon: 'spell_shadow_twilight',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 300,
        aoeShape: 'sphere',
        aoeSize: 300
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 150 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Nox Aeterna!',
        somaticText: 'Night falls eternally',
        materialText: 'Black diamond worth 10000 gp'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'terrain', 'debuff'],

      damageConfig: {
        formula: '10d6 + spirit',
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
          dotFormula: '2d6',
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
            description: 'Ongoing necrotic damage drains life from creatures in the area'
          }
        ],
        durationValue: 24,
        durationType: 'hours',
        durationUnit: 'hours',
        concentrationRequired: false,
        canBeDispelled: false
      },

      tags: ['damage', 'debuff', 'terrain', 'darkness', 'necrotic', 'aoe', 'save', 'drp', 'level-9', 'dreadnaught']
    },

    {
      id: 'dread_cosmic_devourer',
      name: 'Cosmic Devourer',
      description: 'Transform into a cosmic entity that devours everything in its path.',
      level: 9,
      spellType: 'ACTION',
      icon: 'spell_shadow_mindflay',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 200 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Devorans Cosmicus!',
        somaticText: 'Cosmic hunger awakens'
      },

      resolution: 'NONE',
      effectTypes: ['transformation', 'damage'],

      transformationConfig: {
        transformationType: 'shadow',
        targetType: 'self',
        duration: 3,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Cosmic Devourer',
        description: 'Transform into a massive entity of cosmic hunger.',
        grantedAbilities: [
          { id: 'huge_size', name: 'Huge Size', description: 'Size becomes Huge, gain +100 temporary HP' },
          { id: 'flying', name: 'Flight', description: 'Gain 60ft flying speed' },
          { id: 'devour', name: 'Devour', description: 'Melee attacks heal you for damage dealt' },
          { id: 'cosmic_exhaustion', name: 'Exhaustion (On End)', description: 'Gain 2 levels of exhaustion when transformation ends' }
        ]
      },

      damageConfig: {
        formula: '12d6 + spirit',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: false,
        trigger: 'devour_attack'
      },

      tags: ['transformation', 'damage', 'necrotic', 'devour', 'drp', 'level-9', 'dreadnaught']
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    {
      id: 'dread_dark_rebirth',
      name: 'Dark Rebirth',
      description: 'When reduced to 0 hit points, automatically revive with full health by spending all DRP.',
      level: 10,
      spellType: 'PASSIVE',
      icon: 'spell_shadow_rebirth',
      school: 'Necromancy',

      typeConfig: {
        castTime: 0,
        castTimeType: 'PASSIVE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 0,
        components: []
      },

      resolution: 'NONE',
      effectTypes: ['revival'],

      revivalConfig: {
        trigger: 'death',
        healingAmount: '2 * drpSpent',
        resourceCost: 'all_drp',
        description: 'Revive at 0 HP, healing for 2× total DRP spent'
      },

      tags: ['revival', 'healing', 'drp', 'passive', 'level-10', 'dreadnaught']
    },

    {
      id: 'dread_retribution_aura',
      name: 'Retribution Aura',
      description: 'Surround yourself with vengeful spirits that retaliate against anyone who damages you.',
      level: 10,
      spellType: 'ACTION',
      icon: 'spell_shadow_unholystrength',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 100 },
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
          description: 'Spirits deal necrotic damage equal to damage taken back at attacker',
          retaliationDamage: {
            formula: 'damage_taken',
            elementType: 'necrotic',
            damageType: 'direct'
          }
        }],
        durationValue: 1,
        durationType: 'hours',
        durationUnit: 'hours',
        concentrationRequired: false,
        canBeDispelled: false
      },

      tags: ['buff', 'retaliation', 'damage', 'necrotic', 'drp', 'level-10', 'dreadnaught']
    },

    {
      id: 'dread_cosmic_annihilation',
      name: 'Cosmic Annihilation',
      description: 'Unleash the ultimate power of darkness, annihilating everything within range.',
      level: 10,
      spellType: 'ACTION',
      icon: 'spell_shadow_mindbomb',
      school: 'Necromancy',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 500,
        aoeShape: 'sphere',
        aoeSize: 100
      },

      resourceCost: {
        resourceTypes: ['drp'],
        resourceValues: { drp: 500 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Annihilatio Cosmica!',
        somaticText: 'Cosmic annihilation begins',
        materialText: 'Void crystal worth 50000 gp'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'destruction'],

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

      tags: ['damage', 'destruction', 'necrotic', 'aoe', 'ultimate', 'save', 'drp', 'level-10', 'dreadnaught']
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
        icon: 'spell_shadow_demonicpact',
        tags: ['damage', 'necrotic', 'execute', 'ultimate', 'dreadnaught'],
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
