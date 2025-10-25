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
  
  // Example Spells - organized by specialization, showcasing DRP system
  exampleSpells: [
    // DEFENSIVE ABILITIES - Shadow Shield & Protection
    {
      id: 'dread_shadow_shield',
      name: 'Shadow Shield',
      description: 'Create a shield of dark energy that absorbs damage equal to twice the DRP spent.',
      spellType: 'REACTION',
      icon: 'spell_shadow_antishadow',
      school: 'Abjuration',
      level: 1,
      specialization: 'voidwarden',

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION'
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
        classResource: {
          type: 'drp',
          cost: 'variable',
          description: 'Spend any amount of DRP'
        },
        components: ['somatic'],
        somaticText: 'Raise hand to summon shadow barrier'
      },

      resolution: 'NONE',

      buffConfig: {
        effects: [
          'Absorb damage equal to 2× DRP spent',
          'Voidwarden: Absorbs 2.5× DRP spent',
          'Can be used as a reaction to incoming damage'
        ]
      },

      effects: {
        shield: {
          instant: {
            formula: '2 × DRP_SPENT',
            type: 'absorption',
            voidwardenBonus: '2.5 × DRP_SPENT'
          }
        }
      },

      specialMechanics: {
        drp: {
          cost: 'variable',
          effect: 'Absorb 2× DRP spent (2.5× for Voidwarden)',
          timing: 'Reaction to taking damage'
        }
      },

      tags: ['defense', 'shield', 'absorption', 'drp', 'dreadnaught']
    },

    {
      id: 'dread_unholy_fortitude',
      name: 'Unholy Fortitude',
      description: 'Enhance your resilience with dark power, increasing AC by 1 for every 5 DRP spent for one minute.',
      spellType: 'ACTION',
      icon: 'spell_shadow_unholyfrenzy',
      school: 'Abjuration',
      level: 2,
      specialization: 'voidwarden',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'drp',
          cost: 'variable',
          description: 'Spend 5/10/15/20 DRP'
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Umbra Fortis!',
        somaticText: 'Dark energy swirls around you'
      },

      resolution: 'NONE',

      buffConfig: {
        stats: {
          armorClass: '+1 per 5 DRP spent'
        },
        effects: [
          '5 DRP: +1 AC for 1 minute',
          '10 DRP: +2 AC for 1 minute',
          '15 DRP: +3 AC for 1 minute',
          '20 DRP: +4 AC for 1 minute'
        ]
      },

      effects: {
        buff: {
          duration: 60,
          stats: {
            ac: 'DRP_SPENT / 5'
          }
        }
      },

      specialMechanics: {
        drp: {
          cost: '5/10/15/20',
          effect: '+1 AC per 5 DRP spent',
          duration: '1 minute'
        }
      },

      tags: ['buff', 'ac', 'defense', 'drp', 'dreadnaught']
    },

    // OFFENSIVE ABILITIES - Wraith Strike & Damage
    {
      id: 'dread_wraith_strike',
      name: 'Wraith Strike',
      description: 'Empower your weapon with necrotic energy for a devastating strike, dealing additional necrotic damage.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowwordpain',
      school: 'Necromancy',
      level: 2,
      specialization: 'soulreaver',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'drp',
          cost: 'variable',
          description: 'Spend 5/10/15/20 DRP'
        },
        components: ['somatic'],
        somaticText: 'Channel dark energy into weapon'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d6 per 5 DRP',
        damageType: 'necrotic',
        scalingType: 'drp_based'
      },

      healingConfig: {
        formula: '50% of necrotic damage dealt',
        healingType: 'self',
        condition: 'Soulreaver specialization only'
      },

      effects: {
        damage: {
          instant: {
            formula: '1d6 per 5 DRP spent',
            type: 'necrotic'
          }
        },
        healing: {
          conditional: {
            spec: 'soulreaver',
            formula: '50% of necrotic damage dealt',
            target: 'self'
          }
        }
      },

      specialMechanics: {
        drp: {
          cost: '5/10/15/20',
          effect: '+1d6/2d6/3d6/4d6 necrotic damage',
          soulreaverBonus: 'Heal for 50% of necrotic damage dealt'
        }
      },

      tags: ['damage', 'necrotic', 'melee', 'drp', 'life-drain', 'dreadnaught']
    },

    {
      id: 'dread_necrotic_aura',
      name: 'Necrotic Aura',
      description: 'Emit an aura of dark energy that weakens enemies within 10 feet, giving them disadvantage on attack rolls.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadesofdarkness',
      school: 'Necromancy',
      level: 3,
      specialization: 'doomguard',

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
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'drp',
          cost: 15,
          description: '15 DRP (10 DRP for Doomguard)'
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Aura Mortis!',
        somaticText: 'Spread arms to release dark aura'
      },

      resolution: 'NONE',

      debuffConfig: {
        effects: [
          'All enemies within 10 feet have disadvantage on attack rolls',
          'Doomguard: Also deals 1d6 shadow damage per turn',
          'Duration: 1 minute',
          'Aura moves with you'
        ]
      },

      damageConfig: {
        formula: '1d6',
        damageType: 'shadow',
        frequency: 'per turn',
        condition: 'Doomguard specialization only'
      },

      effects: {
        debuff: {
          duration: 60,
          aoe: true,
          radius: 10,
          effect: 'disadvantage on attack rolls'
        },
        damage: {
          conditional: {
            spec: 'doomguard',
            formula: '1d6',
            type: 'shadow',
            frequency: 'per_turn'
          }
        }
      },

      specialMechanics: {
        drp: {
          cost: '15 (10 for Doomguard)',
          effect: 'Enemies have disadvantage on attacks',
          doomguardBonus: 'Also deals 1d6 shadow damage per turn'
        }
      },

      tags: ['debuff', 'aoe', 'disadvantage', 'drp', 'dreadnaught']
    },

    // ULTIMATE ABILITY - Dark Rebirth
    {
      id: 'dread_dark_rebirth',
      name: 'Dark Rebirth',
      description: 'Upon reaching 0 hit points, automatically spend all remaining DRP to revive with health equal to twice the DRP.',
      spellType: 'PASSIVE',
      icon: 'spell_shadow_demonicempathy',
      school: 'Necromancy',
      level: 5,
      specialization: 'all',

      typeConfig: {
        castTime: 0,
        castTimeType: 'AUTOMATIC'
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
        classResource: {
          type: 'drp',
          cost: 'all_remaining',
          description: 'Automatically spend all DRP'
        },
        components: [],
        trigger: 'Reaching 0 hit points'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: '2 × all remaining DRP',
        healingType: 'self',
        trigger: 'Reaching 0 HP'
      },

      buffConfig: {
        effects: [
          'Automatically triggers when reaching 0 HP',
          'Regain HP equal to 2× all remaining DRP',
          'DRP resets to 0 after revival',
          'Doomguard: Gain +2 to attack and damage for 1 minute after revival'
        ]
      },

      effects: {
        healing: {
          instant: {
            formula: '2 × ALL_DRP',
            target: 'self',
            trigger: 'death'
          }
        },
        buff: {
          conditional: {
            spec: 'doomguard',
            duration: 60,
            stats: {
              attackBonus: 2,
              damageBonus: 2
            }
          }
        }
      },

      specialMechanics: {
        drp: {
          cost: 'All remaining DRP',
          effect: 'Revive with 2× DRP as HP',
          trigger: 'Automatic when reaching 0 HP',
          doomguardBonus: '+2 attack and damage for 1 minute after revival'
        }
      },

      tags: ['healing', 'revival', 'ultimate', 'drp', 'dreadnaught']
    },

    // UTILITY ABILITIES
    {
      id: 'dread_dark_resistance',
      name: 'Dark Resistance',
      description: 'While you have at least 10 DRP, gain resistance to one damage type of your choice.',
      spellType: 'PASSIVE',
      icon: 'spell_shadow_antishadow',
      school: 'Abjuration',
      level: 1,
      specialization: 'all',

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
        classResource: {
          type: 'drp',
          cost: 0,
          description: 'Requires 10+ DRP'
        },
        components: []
      },

      resolution: 'PASSIVE',

      buffConfig: {
        effects: [
          'Requires 10+ DRP to activate',
          'Choose one damage type to resist',
          'Can change damage type when DRP drops below 10 and rises again',
          'Voidwarden: Resist two damage types instead of one'
        ]
      },

      effects: {
        buff: {
          condition: 'DRP >= 10',
          resistances: ['chosen_type'],
          voidwardenBonus: 'Two damage types'
        }
      },

      specialMechanics: {
        drp: {
          threshold: 10,
          effect: 'Resistance to one damage type',
          voidwardenBonus: 'Resistance to two damage types'
        }
      },

      tags: ['passive', 'resistance', 'defense', 'drp', 'dreadnaught']
    },

    {
      id: 'dread_health_regen',
      name: 'Dark Regeneration',
      description: 'For each 10 DRP you have, regenerate 1 hit point at the start of each turn.',
      spellType: 'PASSIVE',
      icon: 'spell_shadow_lifedrain02',
      school: 'Necromancy',
      level: 1,
      specialization: 'all',

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
        classResource: {
          type: 'drp',
          cost: 0,
          description: 'Requires 10+ DRP'
        },
        components: []
      },

      resolution: 'PASSIVE',

      healingConfig: {
        formula: '1 HP per 10 DRP',
        healingType: 'self',
        frequency: 'start_of_turn'
      },

      buffConfig: {
        effects: [
          '10 DRP: Regenerate 1 HP per turn',
          '20 DRP: Regenerate 2 HP per turn',
          '30 DRP: Regenerate 3 HP per turn',
          '40 DRP: Regenerate 4 HP per turn',
          '50 DRP: Regenerate 5 HP per turn',
          'Voidwarden: Regeneration increased by 50%'
        ]
      },

      effects: {
        healing: {
          ongoing: {
            formula: 'DRP / 10',
            target: 'self',
            frequency: 'start_of_turn',
            voidwardenBonus: '× 1.5'
          }
        }
      },

      specialMechanics: {
        drp: {
          scaling: '1 HP per 10 DRP',
          frequency: 'Start of each turn',
          voidwardenBonus: '+50% regeneration'
        }
      },

      tags: ['passive', 'healing', 'regeneration', 'drp', 'dreadnaught']
    },

    // SOULREAVER SPECIFIC
    {
      id: 'dread_blood_to_shadow',
      name: 'Blood to Shadow',
      description: 'Convert your own hit points into Dark Resilience Points. Sacrifice 5 HP to gain 1 DRP.',
      spellType: 'ACTION',
      icon: 'spell_shadow_bloodboil',
      school: 'Necromancy',
      level: 2,
      specialization: 'soulreaver',

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
        health: 'variable',
        components: ['somatic'],
        somaticText: 'Cut yourself to release dark energy',
        description: 'Sacrifice 5/10/15/20 HP'
      },

      resolution: 'NONE',

      effects: {
        cost: {
          health: 'variable (5/10/15/20)'
        },
        gain: {
          drp: 'HP_SPENT / 5'
        }
      },

      specialMechanics: {
        conversion: {
          ratio: '5 HP = 1 DRP',
          maxConversion: '20 HP = 4 DRP per use',
          restriction: 'Soulreaver specialization only'
        }
      },

      tags: ['utility', 'conversion', 'self-damage', 'drp', 'soulreaver', 'dreadnaught']
    },

    // DOOMGUARD SPECIFIC
    {
      id: 'dread_retribution_aura',
      name: 'Aura of Retribution',
      description: 'Attackers automatically take 1d6 shadow damage when they hit you. Always active for Doomguard.',
      spellType: 'PASSIVE',
      icon: 'spell_shadow_shadowfiend',
      school: 'Necromancy',
      level: 1,
      specialization: 'doomguard',

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
        components: []
      },

      resolution: 'AUTOMATIC',

      damageConfig: {
        formula: '1d6',
        damageType: 'shadow',
        trigger: 'When hit by an attack'
      },

      effects: {
        counterattack: {
          automatic: {
            formula: '1d6',
            type: 'shadow',
            trigger: 'being_hit'
          }
        }
      },

      specialMechanics: {
        counterattack: {
          damage: '1d6 shadow',
          trigger: 'Whenever an enemy hits you',
          restriction: 'Doomguard specialization only'
        }
      },

      tags: ['passive', 'counterattack', 'damage', 'doomguard', 'dreadnaught']
    }
  ]
};

