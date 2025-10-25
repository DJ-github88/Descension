/**
 * Deathcaller Class Data
 * 
 * Complete class information for the Deathcaller - a dark necromancer
 * who harnesses forbidden blood magic and necrotic ascension paths.
 */

export const DEATHCALLER_DATA = {
  id: 'deathcaller',
  name: 'Deathcaller',
  icon: 'fas fa-skull',
  role: 'Damage/Support',

  // Overview section
  overview: {
    title: 'The Deathcaller',
    subtitle: 'Master of Forbidden Blood Magic',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: The Deathcaller uses health as a resource, sacrificing HP to cast powerful necrotic spells. You progress through 7 sequential Necrotic Ascension Paths (Shrouded Veil → Crimson Pact → Spectral Command → Frostwalker → Silent Shroud → Life Leech → Deep Void), each granting powerful boons but inflicting permanent curses. Spells cost both mana AND health (using dice formulas like 1d6 HP, 2d8 HP). Blood Tokens generated from health sacrificed enhance necrotic damage (+1d6 per token) but burst for 1d10 damage each if unused within 10 minutes.

**Core Mechanic**: Sacrifice health → Cast spells → Generate Blood Tokens → Spend tokens for bonus damage OR let them burst

**Resources**: Health (primary resource), Mana (secondary), Blood Tokens (0-20, temporary), Necrotic Ascension Paths (7 sequential, permanent)

**Playstyle**: High-risk damage dealer, health sacrifice, blood magic, spectral summons, permanent power-for-curse trades

**Best For**: Players who enjoy risk-reward mechanics, managing health as a resource, and making permanent character-altering decisions`
    },

    description: `The Deathcaller harnesses the dark and forbidden power of Necrotic Ascension. Through blood sacrifice and spectral manipulation, they wield devastating necrotic magic at a terrible cost. Each Ascension Path unlocks immense power but inflicts severe consequences, representing the ultimate price of necromantic mastery. These paths are a last resort, reflecting the dire and desperate measures taken by those who dare to command death itself.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Deathcallers are individuals who have crossed the threshold between life and death, embracing forbidden knowledge that most would flee from. They are not merely necromancers—they are blood mages who understand that true power requires sacrifice. Every spell they cast is a transaction with death itself.

**Philosophy**: Power demands sacrifice. The Deathcaller believes that strength comes from willingness to pay the ultimate price—their own vitality. They see death not as an end, but as a resource to be harvested and wielded.

**Personality Archetypes**:
- **The Desperate Survivor**: Turned to dark magic out of necessity, haunted by what they've become
- **The Ambitious Scholar**: Seeks forbidden knowledge regardless of cost, driven by curiosity
- **The Vengeful Wraith**: Uses blood magic to exact revenge, consumed by hatred
- **The Pragmatic Realist**: Views necromancy as a tool, no different from any other magic

**Social Dynamics**: Deathcallers are often feared and shunned. Their very presence reminds others of mortality. They must decide whether to hide their nature or embrace the terror they inspire.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Damage dealer with support capabilities through spectral summons

**Damage Profile**:
- Sustained necrotic damage through health sacrifice
- Burst damage via Blood Token consumption
- Area denial through auras and spectral allies

**Support Capabilities**:
- Spectral summons that tank damage
- Life Link to protect allies
- Debuffs that cripple enemy effectiveness

**Survivability**: Paradoxically fragile yet resilient—Deathcallers sacrifice their own health but can drain it back from enemies. They walk a razor's edge between power and death.`
    },
    
    playstyle: {
      title: 'Playstyle',
      content: `**Core Mechanic**: Health as a resource. Every powerful spell requires blood sacrifice, creating a high-risk, high-reward playstyle.

**Decision Points**:
- When to activate Ascension Paths (permanent consequences)
- How much health to sacrifice for power
- When to drain life back vs. dealing maximum damage
- Which spectral allies to summon and when

**Skill Expression**:
- Managing health pool as a resource
- Timing Blood Token usage before they burst
- Positioning to maximize aura effects
- Balancing aggression with self-preservation

**Team Dynamics**:
- Requires healers to offset self-damage
- Benefits from tanks who can protect while vulnerable
- Synergizes with crowd control to safely drain life
- Can protect allies through Life Link and spectral summons`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Price of Power',
      content: `**The Setup**: Your party faces a powerful undead knight and three skeletal archers. You're a Deathcaller with 3 Ascension Paths active (Shrouded Veil, Crimson Pact, Spectral Command). You have 60/80 HP, 40/50 mana, and 0 Blood Tokens.

**Active Ascension Paths**:
- **Shrouded Veil**: +2d6 necrotic damage, -10 max HP (max HP is 70, not 80)
- **Crimson Pact**: Blood Tokens last 15 min (not 10), -5ft movement speed
- **Spectral Command**: Summon 2 specters (not 1), specters drain 1d4 HP/turn from you

**Starting State**: HP: 60/70 | Mana: 40/50 | Blood Tokens: 0 | Specters: 0

**Turn 1 - Blood Sacrifice (HP: 60 → 52, Tokens: 0 → 8)**

*The undead knight charges. You raise your hand, and dark energy crackles around your fingers. This will hurt.*

**Action**: Cast "Necrotic Bolt" (8 mana, costs 1d6 HP)
**Health Cost Roll**: 1d6 → [4] = 4 HP sacrificed
**Blood Tokens**: +4 (now at 4 tokens)
**HP**: 60 - 4 = 56 HP

*You feel your life force drain into the spell. Four Blood Tokens materialize around you, pulsing with crimson energy.*

**Spell Damage**: 3d8 (base) + 2d6 (Shrouded Veil) → [7, 6, 5] + [5, 4] = 27 necrotic damage

*The bolt strikes the undead knight, necrotic energy searing its armor.*

**Action (1 AP)**: Summon Spectral Allies (10 mana, costs 1d4 HP)
**Health Cost Roll**: 1d4 → [3] = 3 HP sacrificed
**Blood Tokens**: +3 (now at 7 tokens)
**HP**: 56 - 3 = 53 HP
**Mana**: 40 - 8 - 10 = 22 mana

*Two ghostly specters rise from the ground (Spectral Command boon). They hover beside you, cold and hungry.*

**Specters Summoned**: 2 (they will drain 1d4 HP from you each turn)

**End of Turn Drain**: Specters drain life
**Drain Roll**: 1d4 + 1d4 → [2] + [3] = 5 HP drained
**HP**: 53 - 5 = 48 HP

*The specters feed on your life force. You feel weaker, but they grow stronger.*

**Current State**: HP: 48/70 | Mana: 22/50 | Blood Tokens: 7 | Specters: 2

**Turn 2 - Blood Token Burst Damage (HP: 48 → 42, Tokens: 7 → 0)**

*The undead knight is wounded but still dangerous. The skeletal archers are firing at your tank. You have 7 Blood Tokens—time to unleash them.*

**Action**: Cast "Death's Embrace" (12 mana, costs 2d8 HP, AoE necrotic damage)
**Health Cost Roll**: 2d8 → [6, 5] = 11 HP sacrificed
**Blood Tokens**: +11 (now at 18 tokens)
**HP**: 48 - 11 = 37 HP
**Mana**: 22 - 12 = 10 mana

*You scream, and blood pours from your hands. Eighteen Blood Tokens swirl around you, a crimson storm.*

**Decision**: Spend ALL 18 Blood Tokens to enhance the spell (+18d6 necrotic damage!)

**Spell Damage**: 4d10 (base) + 2d6 (Shrouded Veil) + **18d6 (Blood Tokens)** → [8, 9, 7, 6] + [5, 4] + [6, 5, 4, 6, 5, 3, 4, 5, 6, 4, 3, 5, 6, 4, 5, 3, 4, 5] = 30 + 9 + 81 = **120 necrotic damage to ALL enemies!**

*The explosion of necrotic energy obliterates the skeletal archers instantly. The undead knight staggers, its armor cracking.*

**Results**:
- Skeletal Archers: DEAD (overkilled)
- Undead Knight: 150 HP - 120 = 30 HP remaining

**Blood Tokens**: 18 - 18 = 0 (all spent)

**End of Turn Drain**: Specters drain life
**Drain Roll**: 1d4 + 1d4 → [3] + [2] = 5 HP drained
**HP**: 37 - 5 = 32 HP

*You're at 32/70 HP. You've sacrificed nearly half your health, but the battlefield is yours.*

**Current State**: HP: 32/70 | Mana: 10/50 | Blood Tokens: 0 | Specters: 2

**Turn 3 - Life Drain Recovery (HP: 32 → 45)**

*You're dangerously low on health. The undead knight is nearly dead. Time to drain life back.*

**Action**: Cast "Life Leech" (8 mana, costs 1d4 HP, drains HP from enemy)
**Health Cost Roll**: 1d4 → [2] = 2 HP sacrificed
**Blood Tokens**: +2 (now at 2 tokens)
**HP**: 32 - 2 = 30 HP
**Mana**: 10 - 8 = 2 mana

**Spell Effect**: Drain 3d8 HP from undead knight
**Drain Roll**: 3d8 → [7, 6, 8] = 21 HP drained
**Undead Knight**: 30 - 21 = 9 HP remaining
**Your HP**: 30 + 21 = 51 HP (healed!)

*The undead knight's life force flows into you. You feel strength returning.*

**End of Turn Drain**: Specters drain life
**Drain Roll**: 1d4 + 1d4 → [4] + [1] = 5 HP drained
**HP**: 51 - 5 = 46 HP

**Current State**: HP: 46/70 | Mana: 2/50 | Blood Tokens: 2 | Specters: 2

**Turn 4 - Finishing Blow (HP: 46 → 41)**

*The undead knight is at 9 HP. Your specters can finish it.*

**Specters' Turn**: Both attack undead knight
**Damage**: 2d6 + 2d6 → [5, 4] + [6, 3] = 18 damage
**Undead Knight**: 9 - 18 = DEAD

*The undead knight falls. The battle is over. Your specters fade, their hunger sated.*

**Blood Token Burst**: You have 2 Blood Tokens unused. They've been active for 3 turns (not 10 minutes yet), so they don't burst.

**End of Combat Drain**: Specters dissipate (no more drain)

**Final State**: HP: 46/70 | Mana: 2/50 | Blood Tokens: 2 (will burst in 7 minutes if not used)

**Post-Combat**:
*You stand among the corpses, blood dripping from your hands. You sacrificed 20 HP total (4 + 3 + 11 + 2), drained 15 HP from specters (5 + 5 + 5), and healed 21 HP from Life Leech. Net HP change: -14 HP (60 → 46).*

**Your Healer**: "You're bleeding. Again."
**You**: "It's fine. The dead don't feel pain."
**Your Healer**: "You're not dead yet."
**You**: "Give it time."

*The 2 Blood Tokens pulse around you. In 7 minutes, they'll burst for 2d10 damage if you don't use them. You'll need to cast another spell soon, or suffer the consequences.*

**The Lesson**: Deathcaller gameplay is about:
1. **Health as Resource**: You sacrificed 20 HP across 4 spells—health is your primary resource
2. **Blood Token Management**: Generated 18 tokens, spent all 18 for MASSIVE damage (120 total)
3. **Burst Timing**: Blood Tokens burst after 10 minutes (15 with Crimson Pact)—use them or lose HP
4. **Life Drain Recovery**: Life Leech healed 21 HP, offsetting self-damage
5. **Ascension Costs**: Specters drained 15 HP total (Spectral Command curse)
6. **Risk-Reward**: You dealt 147 damage total (27 + 120) but sacrificed significant health

You're not a mage who casts spells with mana—you're a BLOOD MAGE who pays in life itself. Every spell is a gamble. Every Blood Token is a ticking time bomb. Master the balance, or die trying.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Necrotic Ascension',
    subtitle: 'Seven Paths of Dark Power',

    description: `The Necrotic Ascension system represents the Deathcaller's descent into forbidden power. Seven distinct paths can be unlocked in sequence, each granting significant boons but inflicting permanent curses. These are not temporary buffs—they are irreversible transformations that fundamentally alter the Deathcaller's nature. Unlike other classes where resources regenerate, Ascension Paths are PERMANENT character changes—once activated, you can never go back.`,

    resourceBarExplanation: {
      title: 'Understanding Your Resource Systems',
      content: `**Health Bar (Primary Resource - Red)**:

Unlike other classes where health is just survivability, Deathcallers use health as FUEL for spells. Your health bar is both your life AND your power source.

**What You See**: A red health bar that depletes when you cast spells (not just when you take damage). Each spell shows its health cost (e.g., "Costs 1d6 HP" or "Costs 2d8 HP").

**How It Changes**:
- **When You Cast Spells**: Health drains based on dice roll (1d6 HP, 2d8 HP, etc.)
- **When You Take Damage**: Normal damage from enemies
- **When You Life Drain**: Health restores from draining enemies
- **Visual Feedback**: Health bar flashes dark purple when sacrificed for spells (different from red damage flash)

**Blood Token Counter (Secondary Resource - Crimson Orbs)**:

**What You See**: Floating crimson orbs around your character, each representing 1 Blood Token. They pulse with dark energy and have a timer showing how long until they burst.

**Visual Representation**:
- **0-5 Tokens**: Few orbs, dim glow, safe
- **6-10 Tokens**: Moderate orbs, brighter glow, building power
- **11-15 Tokens**: Many orbs, intense glow, dangerous
- **16-20 Tokens**: Maximum orbs, violent pulsing, critical danger (burst imminent)

**Burst Timer**: Each orb has a countdown (10 minutes, or 15 with Crimson Pact). When timer hits 0, orbs EXPLODE for 1d10 damage each.

**How It Changes**:
- **When You Sacrifice Health**: New orbs materialize (1 HP = 1 Token)
- **When You Spend Tokens**: Orbs flow into your spell, adding +1d6 necrotic damage each
- **When They Burst**: Orbs explode in a violent flash, dealing 1d10 damage per token to YOU

**Necrotic Ascension Path Tracker (Permanent Progression - Dark Purple)**:

**What You See**: A vertical progression bar showing 7 paths in sequence. Unlocked paths glow purple, locked paths are dark, activated paths pulse with necrotic energy.

**The Seven Paths** (in order):
1. **Shrouded Veil** (Level 1) - Purple shadow icon
2. **Crimson Pact** (Level 3) - Blood drop icon
3. **Spectral Command** (Level 5) - Ghost icon
4. **Frostwalker** (Level 7) - Ice crystal icon
5. **Silent Shroud** (Level 9) - Silence icon
6. **Life Leech** (Level 11) - Vampire fang icon
7. **Deep Void** (Level 13) - Black hole icon

**Visual States**:
- **Locked**: Dark, grayed out (not yet unlocked)
- **Unlocked**: Glowing purple (can be activated)
- **Activated**: Pulsing necrotic energy (permanent, active)

**Boon/Curse Display**: When you hover over an activated path, it shows:
- **Boon** (green text): The power you gained
- **Curse** (red text): The permanent penalty you suffer

**Why This Matters**:

You're managing THREE resources simultaneously:
1. **Health**: Your life AND your spell fuel (spend it to cast, drain it back from enemies)
2. **Blood Tokens**: Temporary power (use them for +damage or they explode and hurt you)
3. **Ascension Paths**: Permanent power-for-curse trades (irreversible character changes)

**The Deathcaller's Trilemma**:
- **High HP**: Safe, but less power (haven't sacrificed much)
- **Low HP, High Tokens**: Dangerous, but massive burst potential (tokens ready to spend)
- **Low HP, Low Tokens**: Critical danger (sacrificed health, tokens already burst)

**Strategic Depth**:

Unlike a Mage who just watches mana, you're watching:
- Health (am I low enough to die?)
- Blood Tokens (how many do I have? when do they burst?)
- Ascension Paths (which curses am I suffering from?)

**The Burst Mechanic**: Blood Tokens are a TICKING TIME BOMB. You have 10 minutes (15 with Crimson Pact) to use them or they explode. This creates urgency—you can't just hoard tokens forever.

**Example Scenario**:
- You sacrifice 15 HP → Generate 15 Blood Tokens
- Timer starts: 10 minutes until burst
- Option A: Spend all 15 tokens on next spell (+15d6 damage = ~52 bonus damage!)
- Option B: Wait, let them burst (take 15d10 damage = ~82 damage to yourself!)
- Option C: Spend some, let some burst (partial damage, partial self-harm)

**Master Deathcallers Know**:
- Keep health above 30% (below that, you're in death range)
- Spend Blood Tokens before 2 minutes remaining (don't risk burst)
- Activate Ascension Paths strategically (early paths are safe, late paths are deadly)
- Life Leech and life drain spells offset self-damage (you can recover HP)

You're not a mage—you're a BLOOD SACRIFICE ENGINE. Every spell is paid in life. Every token is a gamble. Every Ascension Path is a permanent scar. Embrace the darkness, or be consumed by it.`
    },

    mechanics: {
      title: 'Detailed Mechanics',
      content: `**Health as Resource (Primary Mechanic)**

**How Spells Cost Health**:
Every Deathcaller spell costs BOTH mana AND health. The health cost is rolled using dice:
- **Minor Spells**: 1d4 HP or 1d6 HP
- **Moderate Spells**: 1d8 HP or 2d6 HP
- **Major Spells**: 2d8 HP or 3d8 HP
- **Ultimate Spells**: 4d10 HP or 5d10 HP

**Example Spell Costs**:
- "Necrotic Bolt" (8 mana, 1d6 HP): Roll 1d6 → [4] = Sacrifice 4 HP
- "Death's Embrace" (12 mana, 2d8 HP): Roll 2d8 → [6, 5] = Sacrifice 11 HP
- "Soul Rend" (15 mana, 3d8 HP): Roll 3d8 → [7, 8, 6] = Sacrifice 21 HP

**Why Dice?**: The randomness creates tension. You never know EXACTLY how much HP you'll sacrifice. Sometimes you roll low (lucky!), sometimes you roll high (ouch!).

**Blood Tokens (Secondary Mechanic)**

**Requires**: Crimson Pact Ascension Path (unlocked at level 3)

**Generation**: 1 HP sacrificed = 1 Blood Token
- Example: Sacrifice 11 HP → Generate 11 Blood Tokens

**Maximum**: No hard limit, but risk increases exponentially
- 20+ tokens = 20d10 burst damage (~110 damage if they explode!)

**Usage**: Spend tokens to enhance necrotic damage spells
- **Cost**: 1 token = +1d6 necrotic damage
- **Example**: Spend 10 tokens on "Necrotic Bolt" = +10d6 damage (~35 bonus damage!)

**Burst Mechanic**:
- **Timer**: 10 minutes (15 minutes with Crimson Pact active)
- **Trigger**: Timer expires, tokens haven't been spent
- **Effect**: 1d10 necrotic damage per token (cannot be prevented or reduced)
- **Example**: 8 tokens burst → 8d10 → [7, 9, 6, 8, 5, 9, 7, 8] = 59 damage to yourself!

**Strategic Timing**:
- **Immediate Spend**: Use tokens on next spell (safe, but less flexibility)
- **Bank Tokens**: Save for big spell (risky, might burst)
- **Partial Spend**: Use some, save some (balanced approach)

**Necrotic Ascension Paths (Permanent Progression)**

**Unlocking**: Paths unlock at specific levels (1, 3, 5, 7, 9, 11, 13)

**Activation**: Once unlocked, you can activate a path for 1 AP
- **Permanent**: Cannot be deactivated or removed
- **Irreversible**: Once activated, you're changed forever
- **Sequential**: Must activate in order (can't skip paths)

**The Seven Paths**:

1. **Shrouded Veil** (Level 1):
   - Boon: +2d6 necrotic damage to all spells, advantage on Stealth
   - Curse: -10 max HP (perpetual shadow drain)

2. **Crimson Pact** (Level 3):
   - Boon: Generate Blood Tokens (1 HP = 1 Token), tokens last 15 min (not 10)
   - Curse: Tokens burst for 1d10 damage each if unused

3. **Spectral Command** (Level 5):
   - Boon: Summon 2 specters (not 1), specters deal +1d6 necrotic damage
   - Curse: Specters drain 1d4 HP from you per turn

4. **Frostwalker** (Level 7):
   - Boon: 15ft aura (enemies -10ft speed, 1d4 cold damage/turn)
   - Curse: +50% fire damage taken (vulnerability)

5. **Silent Shroud** (Level 9):
   - Boon: Advantage on Stealth, silent movement
   - Curse: -2 Perception (muffled senses)

6. **Life Leech** (Level 11):
   - Boon: Melee attacks restore 1d6 HP
   - Curse: -5% max HP (unquenchable thirst)

7. **Deep Void** (Level 13):
   - Boon: 1/long rest - Negate any spell targeting you
   - Curse: 2d6 psychic damage when used (void consumption)

**Stacking Curses**:
- Paths 1 + 6: -10% max HP + -5% max HP = -15% total max HP
- Example: Base 100 HP → 85 HP with both paths active

**Strategic Activation**:
- **Early Game**: Activate paths 1-2 (foundation, manageable curses)
- **Mid Game**: Activate paths 3-5 (power spike, moderate risk)
- **Late Game**: Activate paths 6-7 (maximum power, extreme fragility)

**The Point of No Return**: Each path is a PERMANENT decision. Once activated, you can never go back. Choose carefully—your character will be forever changed.`
    },
    
    ascensionPathsTable: {
      title: 'Necrotic Ascension Paths',
      headers: ['Path', 'Boon', 'Curse', 'Unlock Level'],
      rows: [
        ['Shrouded Veil', 'Resistance to necrotic damage + advantage on Stealth', '-10% max HP (perpetual shadow drain)', '1'],
        ['Crimson Pact', 'Generate Blood Tokens from health sacrifice (1 HP = 1 Token)', 'Unused tokens burst after 10 min (1d10 per token)', '3'],
        ['Spectral Command', 'Spectral allies deal +1d6 necrotic damage', '-25 ft speed per spectral ally summoned', '5'],
        ['Frostwalker', 'Aura: 15ft radius, -10ft enemy speed, 1d4 cold/turn', '+50% fire damage taken (vulnerability)', '7'],
        ['Silent Shroud', 'Advantage on Stealth and silent movement', '-2 Perception (muffled senses)', '9'],
        ['Life Leech', 'Melee attacks restore 1d6 HP', '-5% max HP (unquenchable thirst)', '11'],
        ['Deep Void', '1/long rest: Negate any spell targeting you', '2d6 psychic damage when used (void consumption)', '13']
      ]
    },

    bloodTokenTable: {
      title: 'Blood Token Mechanics',
      headers: ['Mechanic', 'Effect', 'Notes'],
      rows: [
        ['Generation', '1 HP sacrificed = 1 Blood Token', 'Requires Crimson Pact path active'],
        ['Enhancement', 'Spend tokens to add 1d6 necrotic damage per token', 'Can spend multiple tokens on one spell'],
        ['Burst Timer', 'Tokens expire after 10 minutes', 'Timer resets when new tokens are generated'],
        ['Burst Damage', '1d10 necrotic damage per unused token', 'Cannot be prevented or reduced'],
        ['Maximum Tokens', 'No hard limit, but risk increases', 'Strategic decision: power vs. safety']
      ]
    },

    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Paths 1-2 (Foundation Phase)**: Shrouded Veil and Crimson Pact establish your core mechanics. Learn to manage health as a resource and generate Blood Tokens. The -10% max HP is manageable with life drain spells.

**Paths 3-4 (Power Phase)**: Spectral Command and Frostwalker dramatically increase your combat effectiveness. The speed penalty from summons requires careful positioning. Fire vulnerability makes you fragile against certain enemies.

**Paths 5-7 (Ascension Phase)**: Silent Shroud, Life Leech, and Deep Void push you to maximum power. Multiple HP penalties stack (-10%, -5% = -15% total max HP). You're a glass cannon requiring team coordination.

**Path Activation Strategy**:
- **Conservative**: Activate only paths 1-3, maintain survivability
- **Balanced**: Activate paths 1-5, strong power with manageable risk
- **All-In**: Activate all 7 paths, maximum power but extreme fragility

**Path Synergies**:
- Shrouded Veil + Silent Shroud = Stealth specialist (double stealth advantage)
- Crimson Pact + Life Leech = Aggressive drain tank (generate tokens, restore HP)
- Spectral Command + Frostwalker = Area control specialist (summons + aura)
- All paths active = Maximum power, maximum risk (glass cannon build)`
    },

    practicalExample: {
      title: 'Practical Decision-Making Example',
      content: `**Scenario**: Boss fight, Turn 8. You have 3 Ascension Paths active (Shrouded Veil, Crimson Pact, Spectral Command). You're at 35/70 HP with 12 Blood Tokens that will burst in 2 minutes. The boss has 40% HP. Your tank is at 20% HP (critical). You have 2 specters active (draining 1d4 HP/turn from you).

**Current State**:
- HP: 35/70 (50%, moderate danger)
- Mana: 25/50
- Blood Tokens: 12 (burst in 2 minutes!)
- Specters: 2 (draining 1d4 HP/turn each)
- Boss HP: ~40%
- Tank HP: ~20% (critical)

**Active Curses**:
- Shrouded Veil: -10 max HP (max is 70, not 80)
- Crimson Pact: Tokens burst for 1d10 each if unused (12d10 = ~66 damage!)
- Spectral Command: Specters drain 1d4 HP/turn each (~5 HP/turn total)

**Option A - Spend All Blood Tokens (Burst Damage)**:
Cast "Death's Embrace" (12 mana, 2d8 HP cost, AoE), spend all 12 tokens
- Health Cost: 2d8 → Average 9 HP (35 → 26 HP)
- Damage: 4d10 (base) + 2d6 (Shrouded Veil) + **12d6 (tokens)** = ~65 total damage
- Pros: Massive damage to boss, tokens don't burst
- Cons: You drop to 26 HP (dangerous), specters still draining
- Risk: Boss might kill you before you can life drain back

**Option B - Dismiss Specters, Save Tokens**:
Dismiss both specters (stop HP drain), save tokens for later
- Health Cost: 0 HP
- Pros: Stop losing 5 HP/turn, stay at 35 HP
- Cons: Lose specter damage, tokens still burst in 2 minutes
- Risk: Tokens burst for 12d10 (~66 damage) = YOU DIE

**Option C - Life Drain, Then Spend Tokens**:
Cast "Life Leech" (8 mana, 1d4 HP cost) to heal, then spend tokens next turn
- Health Cost: 1d4 → Average 2 HP (35 → 33 HP)
- Heal: 3d8 → Average 13 HP (33 → 46 HP)
- Pros: Restore health first, safer position
- Cons: Tokens might burst before next turn (only 2 minutes left!), boss gets another turn
- Risk: Tokens burst while you're healing

**Option D - Partial Token Spend (Balanced)**:
Cast "Necrotic Bolt" (8 mana, 1d6 HP cost), spend 6 tokens (save 6 for later)
- Health Cost: 1d6 → Average 3 HP (35 → 32 HP)
- Damage: 3d8 (base) + 2d6 (Shrouded Veil) + **6d6 (tokens)** = ~37 damage
- Pros: Moderate damage, 6 tokens left for next spell, timer resets
- Cons: Still have 6 tokens (6d10 burst = ~33 damage if they expire)
- Risk: Moderate, but tokens still dangerous

**Best Choice**: Option A (Spend All Blood Tokens)

**Why**:
1. **Burst Timer**: Tokens burst in 2 minutes—you MUST use them or take ~66 damage
2. **Boss HP**: Boss at 40% HP, 65 damage could bring it to ~15% (nearly dead)
3. **Token Math**: 12 tokens = +12d6 damage (~42 bonus damage) vs. 12d10 burst (~66 self-damage)
4. **Risk Assessment**: Dropping to 26 HP is dangerous, but dying to token burst is GUARANTEED death
5. **Recovery Plan**: Next turn, cast Life Leech to heal back up

**Execution**:
- Cast "Death's Embrace" (12 mana, 2d8 HP cost)
- Health Cost Roll: 2d8 → [7, 5] = 12 HP sacrificed
- HP: 35 - 12 = 23 HP (lower than expected!)
- Spend all 12 Blood Tokens (+12d6 damage)
- Damage: 4d10 + 2d6 + 12d6 → [8, 9, 7, 6] + [5, 4] + [6, 5, 4, 6, 5, 3, 4, 5, 6, 4, 3, 5] = 30 + 9 + 56 = **95 damage!**
- Boss HP: 40% → 15% (nearly dead!)
- Blood Tokens: 12 - 12 = 0 (all spent, no burst!)

**End of Turn**:
- Specters drain: 1d4 + 1d4 → [3] + [2] = 5 HP
- HP: 23 - 5 = 18 HP (CRITICAL!)

**Result**: Boss nearly dead, you're at 18/70 HP (critical danger), but tokens are gone (no burst).

**Next Turn Strategy**:
- **Immediate**: Cast "Life Leech" to drain HP from boss (heal ~13 HP, go to 31 HP)
- **If Boss Dies**: Dismiss specters, heal up with party healer
- **If Boss Survives**: Party finishes boss (it's at 15% HP)

**Alternative if Tank Was Healthy**: Option C (Life Drain First)
- Why: If tank wasn't critical, you could afford to heal yourself first, then spend tokens next turn
- Risk: Tokens might burst, but if you have time, healing first is safer

**Alternative if Tokens Had 10 Minutes Left**: Option D (Partial Spend)
- Why: If tokens weren't about to burst, you could spend half now, half later
- Flexibility: Spread damage across multiple turns

**The Lesson**: Deathcaller decision-making involves:
1. **Burst Awareness**: Blood Tokens are a TICKING TIME BOMB—use them or die
2. **Health Math**: Calculate total HP loss (spell cost + specter drain + potential burst)
3. **Damage Efficiency**: 12 tokens = +42 damage (worth it!) vs. 66 self-damage (death!)
4. **Recovery Planning**: Always have a life drain spell ready for next turn
5. **Curse Management**: Specters drain HP every turn—dismiss them when not needed
6. **Ascension Trade-offs**:
   - Shrouded Veil: -10 max HP (you're at 70, not 80)
   - Crimson Pact: Tokens burst (forced you to spend them)
   - Spectral Command: Specters drain HP (5/turn is significant)

You're not a mage who casts spells safely—you're a BLOOD MAGE who gambles with death itself. Every spell costs life. Every token is a countdown. Every Ascension Path is a permanent scar. Master the balance, or be consumed by your own power.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `The Deathcaller's unique resource system—using health as fuel, managing Blood Tokens, and tracking permanent Ascension Paths—creates a dramatic in-person experience. Here's how to track your dark power at the table:

**Required Materials**:
- **Character sheet** with health tracking
- **20 red tokens or beads** (for Blood Tokens - crimson/dark red recommended)
- **Timer or stopwatch** (for Blood Token burst countdown)
- **7-path tracker card** (for Ascension Paths)
- **Dice for health costs** (d4, d6, d8, d10 as needed)

**Health as Resource Tracking**:

**The Dual Health System**:

Unlike other classes, your health bar serves TWO purposes:
1. **Survivability**: How much damage you can take before dying
2. **Spell Fuel**: The cost you pay to cast spells

**Tracking Method**:
- Use your normal health tracking (HP counter, erasable marker, etc.)
- When you cast a spell, roll the health cost dice FIRST, then subtract from HP
- Example: Cast "Necrotic Bolt" (costs 1d6 HP) → Roll 1d6 → [4] → Subtract 4 HP

**Visual Distinction**:
Many players use different colored markers to distinguish:
- **Red damage**: Damage from enemies (normal combat damage)
- **Purple/black damage**: Self-inflicted spell costs (blood sacrifice)

This helps you track how much HP you've sacrificed vs. how much you've lost to enemies.

**Blood Token Tracking**:

**The Token Method** (Recommended):

Use physical red tokens to represent Blood Tokens:
- **Starting State**: 0 tokens (requires Crimson Pact Ascension Path to generate)
- **Generating Tokens**: When you sacrifice HP for a spell, add tokens equal to HP lost
  - Example: Cast spell, roll 2d8 HP cost → [6, 5] = 11 HP → Add 11 red tokens
- **Spending Tokens**: When you spend tokens for bonus damage, remove them
  - Example: Spend 8 tokens on next spell → Remove 8 red tokens → +8d6 damage
- **Burst Timer**: Set a timer for 10 minutes (15 with Crimson Pact upgrade) when you generate tokens

**Timer Management**:
- **Phone Timer**: Set a countdown timer when you generate tokens
- **Stopwatch**: Track elapsed time, note when 10 minutes pass
- **Alarm**: Set an alarm for 10 minutes from now
- **GM Tracking**: Ask your GM to track the timer for you

**Burst Mechanic**:
When the timer reaches 0:
- Roll 1d10 for EACH token you still have
- Take that much damage to yourself
- Example: 12 tokens burst → Roll 12d10 → [8, 9, 7, 6, 5, 4, 8, 7, 6, 5, 9, 8] = 82 damage to YOU!

**Visual Organization**:
Create two zones:
- **Active Tokens** (red tokens in front of you - these are ticking down)
- **Token Bank** (unused red tokens - up to 20 total available)

**Ascension Path Tracking**:

**The Seven-Path Card Method**:

Create a reference card with the 7 Ascension Paths:
\`\`\`
NECROTIC ASCENSION PATHS

☐ 1. SHROUDED VEIL (Lvl 1)
   Boon: +2d6 necrotic damage to all spells
   Curse: -10 max HP (permanent)

☐ 2. CRIMSON PACT (Lvl 3)
   Boon: Generate Blood Tokens (1 HP = 1 token)
   Curse: Tokens burst for 1d10 each after 10 min

☐ 3. SPECTRAL COMMAND (Lvl 5)
   Boon: Summon specters (drain enemies)
   Curse: Specters drain 1d4 HP/turn from YOU

☐ 4. FROSTWALKER (Lvl 7)
   Boon: 10ft frost aura (1d6 cold/turn)
   Curse: Vulnerable to fire (+50% fire damage)

☐ 5. SILENT SHROUD (Lvl 9)
   Boon: Advantage on stealth, silence aura
   Curse: Cannot speak (verbal components harder)

☐ 6. LIFE LEECH (Lvl 11)
   Boon: Life drain heals +50% more
   Curse: Natural healing halved (rest = half HP)

☐ 7. DEEP VOID (Lvl 13)
   Boon: +3d8 necrotic damage, fear aura
   Curse: -2 to all saves (permanent)
\`\`\`

**Tracking Activated Paths**:
- **Checkbox Method**: Check the box when you activate a path (PERMANENT!)
- **Token Method**: Place a black token on activated paths
- **Marker Method**: Cross out or highlight activated paths

**IMPORTANT**: Ascension Paths are PERMANENT. Once activated, you can NEVER deactivate them. The curses are permanent character changes.

**Example In-Person Turn**:

*You have Crimson Pact active, 45/70 HP, 8 Blood Tokens (timer: 3 minutes left)*

**Turn 1 - Casting a Spell**:
1. "I cast Death's Embrace" (costs 12 mana, 2d8 HP)
2. Roll health cost: 2d8 → [7, 5] = 12 HP
3. Subtract from HP: 45 - 12 = 33 HP
4. Generate Blood Tokens: Add 12 red tokens to your pool
5. Now have: 33 HP, 20 Blood Tokens total (8 old + 12 new)
6. Set timer: 10 minutes from now (reset the countdown)

**Turn 2 - Spending Blood Tokens**:
1. "I cast Necrotic Bolt and spend 10 Blood Tokens for bonus damage!"
2. Roll health cost: 1d6 → [3] = 3 HP
3. Subtract from HP: 33 - 3 = 30 HP
4. Remove 10 tokens from pool
5. Roll damage: 3d8 (base) + 2d6 (Shrouded Veil) + 10d6 (tokens)
6. Damage: [6, 7, 5] + [4, 5] + [6, 5, 4, 6, 5, 3, 4, 5, 6, 4] = 18 + 9 + 48 = **75 damage!**
7. Now have: 30 HP, 10 Blood Tokens remaining

**Turn 3 - Token Burst**:
*Timer reaches 0, tokens burst!*
1. "My Blood Tokens burst!"
2. Roll burst damage: 10d10 → [8, 9, 7, 6, 5, 4, 8, 7, 6, 5] = 65 damage to YOU!
3. Subtract from HP: 30 - 65 = -35 HP → **YOU DIE!**

**Lesson**: Don't let tokens burst! Spend them before the timer runs out!

**Quick Reference Card Template**:
\`\`\`
DEATHCALLER QUICK REFERENCE

HEALTH AS RESOURCE:
• All spells cost BOTH mana AND health
• Roll health cost dice when casting
• Track HP sacrificed vs. damage taken

BLOOD TOKENS (Requires Crimson Pact):
• 1 HP sacrificed = 1 Blood Token
• Spend tokens: +1d6 damage per token
• Burst timer: 10 min (15 with upgrade)
• Burst damage: 1d10 per token to YOU

ASCENSION PATHS:
• Unlock in sequence (1→2→3→4→5→6→7)
• Each grants BOON + CURSE
• PERMANENT once activated
• Cannot be deactivated

SURVIVAL TIPS:
• Keep HP above 30%
• Spend tokens before 2 min remaining
• Life drain to recover HP
• Activate paths strategically
\`\`\`

**Thematic Enhancements**:

Many players enhance the blood magic experience with:
- **Red/Black Tokens**: Use crimson or black beads for Blood Tokens
- **Hourglass Timer**: Use a 10-minute sand timer for dramatic effect
- **Blood Marker**: Use red marker for HP sacrificed, black for damage taken
- **Ascension Card**: Laminated card with checkboxes for permanent paths
- **Dramatic Announcements**: "I sacrifice my blood for power!" when generating tokens

**Alternative Tracking Methods**:

**No Tokens?**
- **Dice Method**: Use a d20 die set to your current Blood Token count (0-20)
- **Tally Method**: Write token count on paper, update as needed
- **Counter App**: Use a phone app to track tokens and timer

**No Timer?**
- **GM Tracking**: Ask your GM to track the 10-minute countdown
- **Turn Counting**: Estimate ~10 combat turns = 10 minutes
- **Honor System**: Track mentally and announce when tokens should burst

**Ascension Path Management**:

**When to Activate Paths**:
- **Early Paths (1-3)**: Relatively safe, activate early for power boost
- **Mid Paths (4-5)**: Moderate risk, activate when you need the power
- **Late Paths (6-7)**: High risk, only activate if you're committed to the build

**Tracking Active Curses**:
Keep a note of which curses are affecting you:
- Shrouded Veil: Remember your max HP is reduced (e.g., 70 instead of 80)
- Crimson Pact: Remember to set timers for Blood Tokens
- Spectral Command: Remember to roll specter drain at end of turn
- Frostwalker: Remember you take +50% fire damage
- Silent Shroud: Remember verbal components are harder
- Life Leech: Remember rests only heal half HP
- Deep Void: Remember -2 to all saves

**Example Full Combat Sequence**:

*Starting: 70/70 HP, Crimson Pact active, 0 Blood Tokens*

**Turn 1**: Cast Necrotic Bolt (1d6 HP) → Roll [4] → 66 HP, 4 tokens, timer set
**Turn 2**: Cast Shadow Step (1d6 HP) → Roll [5] → 61 HP, 9 tokens, timer reset
**Turn 3**: Cast Death's Embrace (2d8 HP), spend 9 tokens → Roll [7, 5] = 12 HP → 49 HP, 12 new tokens (21 total), timer reset
**Turn 4**: Spend 15 tokens on Necrotic Bolt → Roll [3] HP → 46 HP, 6 tokens remain
**Turn 5**: Spend 6 tokens on Shadow Bolt → Roll [2] HP → 44 HP, 0 tokens
**End of Combat**: 44/70 HP, 0 tokens, no burst

**Why This System Works**: The physical act of rolling health costs, adding/removing Blood Tokens, and watching a timer count down creates TENSION. You're not just tracking abstract numbers—you're watching your life drain away, accumulating dangerous power (tokens), and racing against time to spend them before they explode. The permanent Ascension Paths add weight to your decisions: once you check that box, there's no going back. This creates a visceral, high-stakes experience that perfectly captures the Deathcaller's theme of sacrificing everything for dark power.

**Pro Tips**:
- **Health Buffer**: Keep HP above 30% to survive burst damage
- **Token Discipline**: Spend tokens before 2 minutes remaining on timer
- **Life Drain Ready**: Always have a life drain spell prepared for recovery
- **Path Planning**: Decide which paths to activate BEFORE leveling up
- **Curse Awareness**: Keep a written list of active curses visible
- **Burst Math**: Calculate potential burst damage (tokens × 5.5 average) before generating more

**Budget-Friendly Alternatives**:
- **No red tokens?** Use coins, buttons, or paper clips
- **No timer?** Use turn counting (1 turn ≈ 1 minute)
- **No fancy markers?** Use pencil and eraser for HP tracking
- **Minimalist**: Just track HP and token count on paper

**Why Deathcaller Is Perfect for In-Person Play**: The class is built around dramatic, high-stakes resource management. Rolling dice to see how much health you sacrifice, watching tokens accumulate as a timer counts down, and making permanent character-altering decisions (Ascension Paths) creates an intense, memorable experience. The physical components (tokens, timer, path card) make the abstract concept of "blood magic" tangible and thrilling. Every spell is a gamble, every token is a ticking time bomb, and every path is a permanent scar—perfect for dramatic tabletop storytelling.`
    }
  },

  // Specializations
  specializations: {
    title: 'Specializations',
    subtitle: 'Three Paths of Necromantic Mastery',

    specs: [
      {
        id: 'blood-reaver',
        name: 'Blood Reaver',
        icon: 'spell_shadow_lifedrain',
        color: '#8B0000',
        theme: 'Aggressive Life Drain',

        description: `Blood Reavers are aggressive necromancers who wade into battle, draining life from their enemies to fuel their dark magic. They embrace the Crimson Pact and Life Leech paths, becoming vampiric warriors who grow stronger as they consume their foes.`,

        playstyle: 'Melee-range life drain, aggressive health sacrifice, high sustain through draining',

        strengths: [
          'Excellent sustain through life drain',
          'Can function as off-tank with proper support',
          'High burst damage through Blood Token consumption',
          'Strong in prolonged fights'
        ],

        weaknesses: [
          'Vulnerable to burst damage',
          'Requires melee range for optimal play',
          'Dependent on having enemies to drain',
          'Struggles against undead/constructs'
        ],

        passiveAbility: {
          name: 'Sanguine Hunger',
          icon: 'spell_shadow_lifedrain02',
          description: 'Your life drain effects are 25% more effective. Additionally, when you drop below 25% health, your next life drain spell is cast instantly and costs no mana.'
        },

        keyAbilities: [
          "Blood Leech - Drain health from a target, restoring 25% per HP sacrificed (8 mana, 1d4 HP cost)",
          "Crimson Shield - Absorb 10x damage sacrificed, converting damage taken into healing (5 mana, 1d10 HP cost)",
          "Eternal Agony - Inflict escalating psychic pain based on health sacrificed (15 mana, 1d10 HP cost)"
        ]
      },

      {
        id: 'spectral-master',
        name: 'Spectral Master',
        icon: 'spell_shadow_raisedead',
        color: '#4B0082',
        theme: 'Summoning and Control',

        description: `Spectral Masters command legions of undead servants, using corpses as resources to create powerful spectral allies. They excel at area control and sustained damage through their minions, though the energy required to maintain multiple summons severely limits their mobility.`,

        playstyle: 'Summoner playstyle, area control, sustained damage through minions',

        strengths: [
          'Excellent area control with multiple summons',
          'Can tank damage through spectral allies',
          'Strong sustained damage output',
          'Effective in battles with corpses available'
        ],

        weaknesses: [
          'Severely reduced mobility with multiple summons',
          'Vulnerable without corpses to raise',
          'Summons require health sacrifice',
          'Weak in clean environments (no corpses)'
        ],

        passiveAbility: {
          name: 'Spectral Dominion',
          icon: 'spell_shadow_raisedead',
          description: 'Your spectral allies have +25% health and deal an additional 1d4 necrotic damage. The speed penalty from Spectral Command is reduced by 10 feet per summon.'
        },

        keyAbilities: [
          "Soul Chain - Summon spectral ally with HP equal to health sacrificed (0 mana, 2d8 HP cost)",
          "Dance of the Damned - Summon two skeletal archers dealing 2d6 each (0 mana, 3d6 HP cost)",
          "Spectral Vanguard - Summon a powerful spectral knight to protect allies (10 mana, 4d8 HP cost)"
        ]
      },

      {
        id: 'void-caller',
        name: 'Void Caller',
        icon: 'spell_shadow_shadowwordpain',
        color: '#1C1C1C',
        theme: 'Psychic Devastation',

        description: `Void Callers peer into the abyss and channel its maddening power. They specialize in psychic damage and debuffs, breaking the minds of their enemies while embracing the Deep Void path. Their magic is the most destructive but also the most dangerous to wield.`,

        playstyle: 'Ranged psychic damage, debuffs, high-risk ultimate abilities',

        strengths: [
          'Highest burst damage potential',
          'Powerful crowd control through fear/despair',
          'Can negate incoming spells with Deep Void',
          'Excellent against high-armor targets (psychic damage)'
        ],

        weaknesses: [
          'Extremely fragile',
          'Ultimate abilities have permanent HP costs',
          'Limited sustain options',
          'Psychic damage can be resisted by some enemies'
        ],

        passiveAbility: {
          name: 'Void Touched',
          icon: 'spell_shadow_shadowwordpain',
          description: 'Your psychic damage spells ignore resistance. Additionally, when you activate Deep Void to negate a spell, you gain a stack of Void Power (max 3), increasing your next psychic spell damage by 2d6 per stack.'
        },

        keyAbilities: [
          "Mind Shatter - Psychic damage scaling with health sacrificed, rounded up (25 mana, 2d6 HP cost)",
          "Despair's Grasp - Mass debuff causing disadvantage and halved movement (15 mana, DC 15 Wisdom)",
          "Void Rift - Ultimate ability pulling enemies and dealing massive damage (45 mana, 4d10 HP + 1d6 permanent HP)"
        ]
      }
    ]
  },

  // Example Spells - showcasing blood sacrifice and necrotic ascension mechanics
  exampleSpells: [
    // BLOOD SACRIFICE SPELLS - Health as Resource
    {
      id: 'dc_shadow_step',
      name: 'Shadow Step',
      description: 'Teleport through shadows to a nearby location. If you teleport into shadows, your next attack deals bonus necrotic damage.',
      spellType: 'ACTION',
      icon: 'ability_rogue_shadowstep',
      school: 'Conjuration',
      level: 1,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'location',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 10,
        health: 0, // Will use formula
        components: ['verbal', 'somatic'],
        verbalText: 'Umbra Saltus!',
        somaticText: 'Step into shadow',
        useFormulas: {
          health: true
        },
        resourceFormulas: {
          health: '1d6'
        }
      },

      resolution: 'AUTOMATIC',

      effects: {
        teleport: {
          range: 30,
          condition: 'Must see target location'
        },
        buff: {
          conditional: {
            type: 'in_shadows',
            success: '+1d6 necrotic damage on next attack',
            duration: '1 turn'
          }
        }
      },

      specialMechanics: {
        bloodCost: {
          formula: '1d6',
          description: 'Sacrifice health to fuel the teleport'
        },
        shadowBonus: {
          condition: 'Teleport into dim light or darkness',
          effect: 'Next attack within 1 turn deals +1d6 necrotic damage'
        }
      },

      tags: ['teleport', 'mobility', 'necrotic', 'blood-magic', 'deathcaller']
    },

    {
      id: 'dc_blood_leech',
      name: 'Blood Leech',
      description: 'Drain health from a target within 30 feet. The health restored is 25% for each 1 HP sacrificed (1 HP = 25%, 2 HP = 50%, 3 HP = 75%, 4 HP = 100%).',
      spellType: 'ACTION',
      icon: 'spell_shadow_lifedrain',
      school: 'Necromancy',
      level: 2,

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
        durationType: 'instant'
      },

      resourceCost: {
        mana: 8,
        health: 0,
        components: ['verbal', 'somatic'],
        verbalText: 'Sanguis Haurio!',
        somaticText: 'Grasping motion toward target',
        useFormulas: {
          health: true
        },
        resourceFormulas: {
          health: '1d4'
        }
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'necrotic',
        scalingType: 'none'
      },

      healingConfig: {
        formula: 'variable',
        healingType: 'life_drain',
        scalingType: 'health_sacrifice'
      },

      effects: {
        damage: {
          instant: {
            formula: '2d6',
            type: 'necrotic',
            primaryTarget: true
          }
        },
        healing: {
          self: {
            formula: 'damage_dealt * (health_sacrificed * 0.25)',
            description: '25% of damage per HP sacrificed'
          }
        }
      },

      specialMechanics: {
        bloodCost: {
          formula: '1d4',
          description: 'Sacrifice health to empower the drain'
        },
        lifeDrain: {
          scaling: '25% of damage dealt per HP sacrificed',
          example: '1 HP = 25%, 2 HP = 50%, 3 HP = 75%, 4 HP = 100%',
          maximum: '100% at 4 HP sacrificed'
        },
        bloodTokens: {
          generation: 'If Crimson Pact is active, gain 1 Blood Token per HP sacrificed',
          usage: 'Can spend tokens to increase damage by 1d6 per token'
        }
      },

      tags: ['damage', 'healing', 'life-drain', 'blood-magic', 'deathcaller', 'blood-reaver']
    },

    // BLOOD TOKEN SPELLS - Crimson Pact Path Required
    {
      id: 'dc_crimson_shield',
      name: 'Crimson Shield',
      description: 'Sacrifice your blood to create a protective barrier. Absorbs up to 10x the damage sacrificed over 1 minute, converting every 2 damage taken into 1 hit point restored.',
      spellType: 'ACTION',
      icon: 'spell_shadow_antishadow',
      school: 'Abjuration',
      level: 2,

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
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 5,
        health: 0,
        components: ['verbal', 'somatic'],
        verbalText: 'Scutum Sanguinis!',
        somaticText: 'Draw blood and form barrier',
        useFormulas: {
          health: true
        },
        resourceFormulas: {
          health: '1d10'
        }
      },

      resolution: 'AUTOMATIC',

      effects: {
        shield: {
          formula: 'health_sacrificed * 10',
          duration: 60,
          conversion: 'Every 2 damage absorbed = 1 HP restored',
          type: 'absorption_with_healing'
        }
      },

      specialMechanics: {
        bloodCost: {
          formula: '1d10',
          description: 'Sacrifice health to create the shield'
        },
        absorption: {
          formula: 'HP_sacrificed * 10',
          example: 'Sacrifice 8 HP = 80 damage absorbed',
          duration: '1 minute'
        },
        conversion: {
          rate: '2:1',
          description: 'Every 2 damage absorbed restores 1 HP',
          example: '80 damage absorbed = 40 HP restored'
        },
        bloodTokens: {
          generation: 'If Crimson Pact is active, gain 1 Blood Token per HP sacrificed'
        }
      },

      tags: ['shield', 'absorption', 'healing', 'blood-magic', 'deathcaller', 'blood-reaver']
    },

    // CORPSE SUMMONING SPELLS - Spectral Command Path Synergy
    {
      id: 'dc_soul_chain',
      name: 'Soul Chain',
      description: 'Summon a spectral ally from a corpse to fight for you for 1 minute. The ally has a health pool equal to the health cost paid.',
      spellType: 'ACTION',
      icon: 'spell_shadow_soulleech_3',
      school: 'Necromancy',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'location',
        rangeType: 'ranged',
        rangeDistance: 30,
        requiresCorpse: true
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 0,
        health: 0,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Anima Catena!',
        somaticText: 'Pull spectral chain from corpse',
        materialText: 'A corpse',
        useFormulas: {
          health: true
        },
        resourceFormulas: {
          health: '2d8'
        }
      },

      resolution: 'AUTOMATIC',

      summonConfig: {
        summonType: 'spectral_warrior',
        count: 1,
        duration: 60,
        healthFormula: 'health_sacrificed',
        damageFormula: '1d8 + spectral_command_bonus',
        attackType: 'melee'
      },

      effects: {
        summon: {
          type: 'spectral_ally',
          health: 'equal to health sacrificed',
          damage: '1d8 necrotic',
          duration: 60,
          bonuses: 'If Spectral Command active: +1d6 necrotic damage'
        }
      },

      specialMechanics: {
        bloodCost: {
          formula: '2d8',
          description: 'Sacrifice health to empower the summon'
        },
        summonHealth: {
          formula: 'HP_sacrificed',
          example: 'Sacrifice 12 HP = summon has 12 HP',
          scaling: 'More health = stronger summon'
        },
        spectralCommand: {
          bonus: 'If Spectral Command path is active, summon deals +1d6 necrotic damage',
          penalty: 'Your speed is reduced by 25 feet while summon is active'
        },
        corpseRequirement: {
          description: 'Requires a corpse within 30 feet to summon from'
        }
      },

      tags: ['summon', 'spectral', 'blood-magic', 'deathcaller', 'spectral-master']
    },

    {
      id: 'dc_dance_of_the_damned',
      name: 'Dance of the Damned',
      description: 'Summon two skeletal archers from corpses. Each archer deals 2d6 necrotic damage per turn for 1 minute.',
      spellType: 'ACTION',
      icon: 'ability_hunter_pet_bat',
      school: 'Necromancy',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'location',
        rangeType: 'ranged',
        rangeDistance: 40,
        requiresCorpse: true,
        corpseCount: 2
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 0,
        health: 0,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Saltatio Damnatorum!',
        somaticText: 'Conduct the dance of death',
        materialText: 'Two corpses',
        useFormulas: {
          health: true
        },
        resourceFormulas: {
          health: '3d6'
        }
      },

      resolution: 'AUTOMATIC',

      summonConfig: {
        summonType: 'skeletal_archer',
        count: 2,
        duration: 60,
        damageFormula: '2d6 + spectral_command_bonus',
        attackType: 'ranged',
        range: 60
      },

      effects: {
        summon: {
          type: 'skeletal_archers',
          count: 2,
          damage: '2d6 necrotic each',
          range: 60,
          duration: 60,
          bonuses: 'If Spectral Command active: +1d6 necrotic damage each'
        }
      },

      specialMechanics: {
        bloodCost: {
          formula: '3d6',
          description: 'Sacrifice health to animate the archers'
        },
        multiSummon: {
          count: 2,
          penalty: 'If Spectral Command active: -50 feet speed total (-25 per summon)'
        },
        rangedAttack: {
          range: 60,
          damage: '2d6 necrotic per archer',
          frequency: 'Once per turn each'
        },
        corpseRequirement: {
          description: 'Requires two corpses within 40 feet'
        }
      },

      tags: ['summon', 'spectral', 'ranged', 'blood-magic', 'deathcaller', 'spectral-master']
    },

    // PSYCHIC DEVASTATION SPELLS - Void Caller Specialization
    {
      id: 'dc_mind_shatter',
      name: 'Mind Shatter',
      description: 'Unleash psychic devastation on a target. Damage equals health sacrificed rounded up, dealing pure psychic damage that ignores armor.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowwordpain',
      school: 'Enchantment',
      level: 4,

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
        mana: 25,
        health: 0,
        components: ['verbal', 'somatic'],
        verbalText: 'Mens Fracta!',
        somaticText: 'Clutch head and scream',
        useFormulas: {
          health: true
        },
        resourceFormulas: {
          health: '2d6'
        }
      },

      resolution: 'DICE',

      damageConfig: {
        formula: 'health_sacrificed_rounded_up',
        damageType: 'psychic',
        ignoresArmor: true,
        savingThrow: 'intelligence',
        difficultyClass: 16,
        saveOutcome: 'halves'
      },

      effects: {
        damage: {
          formula: 'health_sacrificed (rounded up)',
          type: 'psychic',
          ignoresArmor: true,
          savingThrow: 'DC 16 Intelligence',
          saveEffect: 'Half damage on success'
        }
      },

      specialMechanics: {
        bloodCost: {
          formula: '2d6',
          description: 'Sacrifice health to fuel psychic devastation'
        },
        damageScaling: {
          formula: 'HP_sacrificed (rounded up)',
          example: 'Sacrifice 7 HP = 7 psychic damage, Sacrifice 11 HP = 11 psychic damage',
          ignoresArmor: true
        },
        voidTouched: {
          bonus: 'If Void Caller spec: Ignores psychic resistance',
          voidPower: 'If Deep Void was used recently: +2d6 per Void Power stack'
        }
      },

      tags: ['damage', 'psychic', 'blood-magic', 'deathcaller', 'void-caller']
    },

    {
      id: 'dc_despairs_grasp',
      name: "Despair's Grasp",
      description: 'Inflict overwhelming despair on all enemies within 30 feet. Targets must make a DC 15 Wisdom save or suffer disadvantage on all rolls and have their movement speed halved for 1 minute.',
      spellType: 'ACTION',
      icon: 'spell_shadow_charm',
      school: 'Enchantment',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 30
        }
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'minutes',
        concentration: true
      },

      resourceCost: {
        mana: 15,
        health: 0,
        components: ['verbal', 'somatic'],
        verbalText: 'Desperatio Omnia!',
        somaticText: 'Spread arms wide, emanating despair'
      },

      resolution: 'SAVING_THROW',

      savingThrowConfig: {
        ability: 'wisdom',
        difficultyClass: 15,
        onSuccess: 'No effect',
        onFailure: 'Disadvantage on all rolls + half movement speed'
      },

      effects: {
        debuff: {
          savingThrow: 'DC 15 Wisdom',
          onFailure: {
            disadvantage: 'All attack rolls, ability checks, and saving throws',
            movementPenalty: '-50% movement speed',
            duration: '1 minute (concentration)'
          },
          onSuccess: 'No effect'
        }
      },

      specialMechanics: {
        areaEffect: {
          radius: 30,
          targets: 'All enemies',
          friendly: 'Allies are unaffected'
        },
        concentration: {
          required: true,
          duration: '1 minute',
          breakCondition: 'Taking damage requires Constitution save to maintain'
        }
      },

      tags: ['debuff', 'crowd-control', 'psychic', 'area', 'deathcaller', 'void-caller']
    },

    {
      id: 'dc_eternal_agony',
      name: 'Eternal Agony',
      description: 'Inflict escalating psychic pain on a target. Each turn, the target takes 1d6 psychic damage per HP you sacrificed, increasing by 1d6 each turn (max 5 turns).',
      spellType: 'ACTION',
      icon: 'spell_shadow_curseofsargeras',
      school: 'Enchantment',
      level: 4,

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
        duration: 5,
        concentration: true
      },

      resourceCost: {
        mana: 15,
        health: 0,
        components: ['verbal', 'somatic'],
        verbalText: 'Dolor Aeternus!',
        somaticText: 'Point at target with trembling hand',
        useFormulas: {
          health: true
        },
        resourceFormulas: {
          health: '1d10'
        }
      },

      resolution: 'DICE',

      damageConfig: {
        formula: 'escalating',
        damageType: 'psychic',
        escalation: {
          turn1: '1d6 per HP sacrificed',
          turn2: '2d6 per HP sacrificed',
          turn3: '3d6 per HP sacrificed',
          turn4: '4d6 per HP sacrificed',
          turn5: '5d6 per HP sacrificed'
        }
      },

      effects: {
        damage: {
          type: 'psychic',
          escalating: true,
          formula: 'Turn_number * 1d6 * HP_sacrificed',
          duration: '5 turns',
          concentration: true
        }
      },

      specialMechanics: {
        bloodCost: {
          formula: '1d10',
          description: 'Sacrifice health to fuel the agony'
        },
        escalation: {
          turn1: '1d6 per HP sacrificed',
          turn2: '2d6 per HP sacrificed',
          turn3: '3d6 per HP sacrificed',
          turn4: '4d6 per HP sacrificed',
          turn5: '5d6 per HP sacrificed',
          example: 'Sacrifice 6 HP: Turn 1 = 6d6, Turn 2 = 12d6, Turn 3 = 18d6, Turn 4 = 24d6, Turn 5 = 30d6'
        },
        concentration: {
          required: true,
          duration: '5 turns',
          breakCondition: 'If concentration breaks, effect ends immediately'
        }
      },

      tags: ['damage', 'psychic', 'dot', 'escalating', 'blood-magic', 'deathcaller', 'blood-reaver']
    },

    // ASCENSION PATH SYNERGY SPELLS - Multiple Paths Working Together
    {
      id: 'dc_void_rift',
      name: 'Void Rift',
      description: 'Tear open a rift to the void, pulling all enemies within 60 feet toward the center and dealing 12d10 necrotic damage. Costs 4d10 HP each turn active and 1d6 permanent HP upon casting.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadesofdarkness',
      school: 'Conjuration',
      level: 7,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 60
        }
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'minutes',
        concentration: true
      },

      resourceCost: {
        mana: 45,
        health: 0,
        permanentHealth: 0,
        components: ['verbal', 'somatic'],
        verbalText: 'VACUUM INFINITUM!',
        somaticText: 'Tear reality with both hands',
        useFormulas: {
          health: true,
          permanentHealth: true
        },
        resourceFormulas: {
          health: '4d10',
          permanentHealth: '1d6'
        }
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '12d10',
        damageType: 'necrotic',
        savingThrow: 'strength',
        difficultyClass: 18,
        saveOutcome: 'halves'
      },

      effects: {
        pull: {
          range: 60,
          strength: 'DC 18 Strength save or be pulled 30 feet toward center',
          frequency: 'Start of each turn'
        },
        damage: {
          formula: '12d10',
          type: 'necrotic',
          savingThrow: 'DC 18 Strength',
          saveEffect: 'Half damage',
          frequency: 'When pulled into rift'
        },
        upkeep: {
          cost: '4d10 HP per turn',
          permanentCost: '1d6 permanent HP (cast only)',
          duration: 'Concentration, up to 1 minute'
        }
      },

      specialMechanics: {
        initialCost: {
          mana: 45,
          permanentHealth: '1d6',
          description: 'Permanent HP loss upon casting - cannot be healed'
        },
        upkeepCost: {
          health: '4d10 per turn',
          description: 'Must pay health each turn or rift collapses',
          failure: 'If unable to pay, rift ends and you take 6d10 necrotic damage'
        },
        pullEffect: {
          range: 60,
          save: 'DC 18 Strength',
          onFailure: 'Pulled 30 feet toward rift center',
          frequency: 'Start of each creature\'s turn'
        },
        damage: {
          trigger: 'When pulled into rift center',
          formula: '12d10 necrotic',
          save: 'DC 18 Strength for half'
        },
        concentration: {
          required: true,
          duration: 'Up to 1 minute',
          breakCondition: 'Taking damage or unable to pay upkeep cost'
        }
      },

      tags: ['ultimate', 'area', 'necrotic', 'pull', 'blood-magic', 'permanent-cost', 'deathcaller', 'void-caller']
    },

    {
      id: 'dc_life_link',
      name: 'Life Link',
      description: 'Link your life force with an ally for 1 minute. All damage either of you takes is split evenly between both targets.',
      spellType: 'ACTION',
      icon: 'spell_holy_prayerofhealing',
      school: 'Abjuration',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetType: 'ally'
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 12,
        health: 0,
        components: ['verbal', 'somatic'],
        verbalText: 'Vinculum Vitae!',
        somaticText: 'Extend hand toward ally, forming ethereal chain'
      },

      resolution: 'AUTOMATIC',

      effects: {
        link: {
          duration: 60,
          effect: 'All damage split evenly between linked targets',
          range: 'No range limit once linked',
          breakCondition: 'Either target drops to 0 HP or duration ends'
        }
      },

      specialMechanics: {
        damageSharing: {
          formula: 'damage / 2',
          description: 'All damage taken by either target is split evenly',
          example: 'Ally takes 40 damage → both take 20 damage',
          rounding: 'Round down (odd damage favors the original target)'
        },
        noRangeLimit: {
          description: 'Once linked, no range limit - works across entire battlefield'
        },
        breakConditions: {
          death: 'Link breaks if either target reaches 0 HP',
          duration: 'Link ends after 1 minute',
          dispel: 'Can be dispelled as a 5th level spell'
        },
        tacticalUse: {
          tank: 'Link with tank to share incoming damage',
          protection: 'Protect squishy ally by sharing their damage',
          sacrifice: 'Take damage for ally who is low on HP'
        }
      },

      tags: ['support', 'protection', 'link', 'damage-sharing', 'deathcaller', 'blood-reaver']
    },

    {
      id: 'dc_aura_of_decay',
      name: 'Aura of Decay',
      description: 'Emanate an aura of death in a 20-foot radius. All enemies take 2d6 necrotic damage at the start of their turn and have disadvantage on Constitution saves.',
      spellType: 'ACTION',
      icon: 'spell_shadow_demonicempathy',
      school: 'Necromancy',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 20
        }
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'minutes',
        concentration: true
      },

      resourceCost: {
        mana: 20,
        health: 0,
        components: ['verbal', 'somatic'],
        verbalText: 'Aura Mortis!',
        somaticText: 'Spread arms, releasing death energy',
        useFormulas: {
          health: true
        },
        resourceFormulas: {
          health: '2d8'
        }
      },

      resolution: 'AUTOMATIC',

      damageConfig: {
        formula: '2d6',
        damageType: 'necrotic',
        frequency: 'start_of_turn'
      },

      effects: {
        aura: {
          radius: 20,
          damage: '2d6 necrotic at start of turn',
          debuff: 'Disadvantage on Constitution saves',
          duration: '1 minute (concentration)',
          movesWithCaster: true
        }
      },

      specialMechanics: {
        bloodCost: {
          formula: '2d8',
          description: 'Sacrifice health to fuel the aura'
        },
        auraDamage: {
          formula: '2d6 necrotic',
          frequency: 'Start of each enemy turn',
          noSave: 'Automatic damage, no saving throw'
        },
        debuff: {
          effect: 'Disadvantage on Constitution saves',
          duration: 'While in aura',
          synergy: 'Combos with poison, disease, and exhaustion effects'
        },
        frostwalkerSynergy: {
          description: 'If Frostwalker path is active, enemies also take 1d4 cold damage and have -10ft speed',
          combined: 'Total: 2d6 necrotic + 1d4 cold + -10ft speed + disadvantage on Con saves'
        },
        concentration: {
          required: true,
          duration: '1 minute',
          movesWithCaster: 'Aura follows you as you move'
        }
      },

      tags: ['aura', 'necrotic', 'debuff', 'area', 'blood-magic', 'deathcaller', 'spectral-master']
    },

    {
      id: 'dc_binding_pain',
      name: 'Binding Pain',
      description: 'Paralyze all enemies within 30 feet with excruciating pain. Targets must make a DC 16 Constitution save or be paralyzed and take 3d10 necrotic damage. Immobilization lasts 1 turn.',
      spellType: 'ACTION',
      icon: 'spell_shadow_painandsuffering',
      school: 'Necromancy',
      level: 6,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 30
        }
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 1
      },

      resourceCost: {
        mana: 25,
        health: 0,
        components: ['verbal', 'somatic'],
        verbalText: 'Dolor Vinculum!',
        somaticText: 'Clench fist, binding enemies in pain'
      },

      resolution: 'SAVING_THROW',

      savingThrowConfig: {
        ability: 'constitution',
        difficultyClass: 16,
        onSuccess: 'Half damage, no paralysis',
        onFailure: 'Full damage + paralyzed for 1 turn'
      },

      damageConfig: {
        formula: '3d10',
        damageType: 'necrotic'
      },

      effects: {
        damage: {
          formula: '3d10',
          type: 'necrotic',
          savingThrow: 'DC 16 Constitution',
          saveEffect: 'Half damage'
        },
        paralysis: {
          duration: '1 turn',
          savingThrow: 'DC 16 Constitution',
          onFailure: 'Paralyzed - cannot move or take actions',
          onSuccess: 'No paralysis'
        }
      },

      specialMechanics: {
        areaControl: {
          radius: 30,
          targets: 'All enemies',
          friendly: 'Allies are unaffected'
        },
        paralysis: {
          duration: '1 turn',
          effect: 'Cannot move, take actions, or reactions',
          autoHit: 'Attacks against paralyzed targets have advantage',
          autoCrit: 'Melee attacks against paralyzed targets auto-crit'
        },
        tacticalUse: {
          setup: 'Paralyze enemies for allies to capitalize',
          escape: 'Lock down pursuers to flee',
          burst: 'Combo with area damage for massive burst'
        }
      },

      tags: ['crowd-control', 'paralysis', 'necrotic', 'area', 'deathcaller', 'void-caller']
    }
  ]
};

export default DEATHCALLER_DATA;

