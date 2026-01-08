/**
 * Lichborne Class Data
 * 
 * Complete class information for the Lichborne - a frost-wielding undead
 * master who balances life-draining aura with phylactery resurrection.
 */

export const LICHBORNE_DATA = {
  id: 'lichborne',
  name: 'Lichborne',
  icon: 'fas fa-skull',
  role: 'Damage/Control',

  // Overview section
  overview: {
    title: 'The Lichborne',
    subtitle: 'Eternal Frost and Undying Will',
    
    description: `The Lichborne harnesses the power of frost through their Eternal Frost Aura, a powerful but taxing ability that amplifies their frost magic at the cost of their own vitality. This mechanic is complemented by the Lichborne's Phylactery, an ancient artifact that anchors their soul and provides a lifeline in dire situations. Together, these systems create a dynamic, high-risk, high-reward playstyle that emphasizes strategic decision-making and careful management of resources.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Lichborne are individuals who have transcended death through forbidden rituals, binding their soul to a phylactery. They exist in a state between life and death, wielding frost magic that mirrors their cold, undying nature. The phylactery is both their greatest strength and their most vulnerable weakness.

**Philosophy**: Death is not the end, but a transformation. The Lichborne believes that true power comes from mastering the boundary between life and death, using their undead state to achieve immortality and unmatched magical prowess.

**Personality Archetypes**:
- **The Eternal Scholar**: Seeks knowledge across centuries, viewing death as merely an inconvenience
- **The Vengeful Revenant**: Returned from death to exact revenge, fueled by cold fury
- **The Reluctant Immortal**: Bound to phylactery against their will, struggling with their undead nature
- **The Power-Hungry Lich**: Embraces undeath fully, seeking ever-greater magical power

**Social Dynamics**: Lichborne are feared and reviled by most. Their undead nature is obvious to those who look closely - pale skin, cold touch, unnatural stillness. They must decide whether to hide their nature or embrace the terror they inspire.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Frost damage specialist with resurrection mechanics

**Damage Profile**:
- High sustained frost damage through Eternal Frost Aura
- Area control through freezing and chilling effects
- Burst damage through frozen target interactions

**Control Capabilities**:
- Freeze enemies in place, preventing actions
- Chill effects that reduce movement speed
- Terrain control through ice walls and barriers

**Survivability**: High - Phylactery provides resurrection, but maintaining Eternal Frost Aura drains health. Requires careful balance between offense and self-preservation.`
    },
    
    playstyle: {
      title: 'Playstyle',
      content: `**Core Mechanic**: Eternal Frost Aura. Activate to enhance frost spells (+1d6 damage, chilling effects) but lose 1d6 HP per turn. Phylactery stores HP and provides resurrection.

**Decision Points**:
- When to activate/deactivate Eternal Frost Aura
- How much HP to store in Phylactery vs. keep available
- Which targets to freeze vs. chill
- When to use Phylactery resurrection vs. save it

**Skill Expression**:
- Managing health drain from Eternal Frost Aura
- Timing aura activation for maximum damage windows
- Strategic Phylactery HP storage and usage
- Exploiting frozen targets with bonus damage spells

**Aura Management Strategy**:
- **Aggressive**: Keep aura active constantly, rely on Phylactery resurrection
- **Balanced**: Toggle aura on/off based on combat intensity
- **Conservative**: Only activate aura for burst windows, preserve HP

**Team Dynamics**:
- Benefits from healers who can offset aura drain
- Synergizes with classes that can group enemies for AoE freeze
- Can control battlefield with ice walls and frozen enemies
- Phylactery resurrection allows aggressive plays`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Undying Frost',
      content: `**The Setup**: You're a Lichborne facing a group of fire elementals (3 elementals + 1 fire elemental lord). Your party is with you. Starting HP: 80/80. Phylactery HP: 30 (stored from previous ritual). Eternal Frost Aura: Inactive. Starting Mana: 50/60. Your goal: Activate Eternal Frost Aura for enhanced frost damage, manage the health drain, and use your Phylactery strategically.

**Starting State**: HP: 80/80 | Phylactery HP: 30 | Aura: Inactive | Mana: 50/60

**Turn 1 - Activating the Aura (HP: 80 → 74, Aura: Active)**

*The fire elementals blaze before you, their heat oppressive. You close your eyes and reach for the cold within. Your phylactery—a frozen crystal hanging from your neck—pulses with dark energy.*

**Your Action**: Activate Eternal Frost Aura (1 AP, no mana cost)

*Frost spreads from your body in waves. The temperature DROPS. Ice crystals form in the air around you. Your skin turns pale blue, your breath visible. The aura is ACTIVE.*

**Eternal Frost Aura**: ACTIVE
**Effect**: All frost spells deal +1d6 frost damage, enemies hit must save DC 15 Con or -10 ft speed
**Health Drain**: Will lose 1d6 HP at start of each turn

**Your Action**: Cast "Ice Shard" at Fire Elemental #1 (6 mana)
**Attack Roll**: d20+6 → [16] = Hit!
**Base Damage**: 3d6 frost → [5, 6, 4] = 15 damage
**Aura Bonus**: +1d6 frost → [5] = +5 damage
**Total Damage**: 15 + 5 = **20 frost damage!**

*The ice shard strikes the fire elemental. It HISSES, steam rising from the impact. Fire and ice clash.*

**Chilling Effect**: Fire Elemental #1 must save DC 15 Constitution
**Save Roll**: [11] → FAIL!
**Effect**: Movement speed reduced by 10 ft until end of its next turn

*The elemental's flames dim slightly, slowed by the supernatural cold.*

**Mana**: 50 - 6 = 44/60

**Fire Elemental #1's Turn**: Attacks you → [17] → Hit! → 2d8+4 fire → [7, 6] + 4 = 17 fire damage
**Your HP**: 80 - 17 = 63/80

**Current State**: HP: 63/80 | Phylactery HP: 30 | Aura: Active | Mana: 44/60

**Turn 2 - The Drain Begins (HP: 63 → 57 → 50)**

*You feel the aura draining your life force. The cold is consuming you from within. But the power... the POWER is worth it.*

**Start of Turn**: Eternal Frost Aura health drain
**Drain Roll**: 1d6 → [6] = 6 HP lost
**Your HP**: 63 - 6 = 57/80

*You stagger, frost spreading across your skin. Your phylactery glows, sensing your weakening state.*

**Your Action**: Cast "Frozen Orb" at all 3 fire elementals (10 mana, AoE)
**Damage Roll**: 4d6 frost → [6, 5, 4, 6] = 21 damage
**Aura Bonus**: +1d6 frost → [4] = +4 damage
**Total Damage**: 21 + 4 = **25 frost damage to ALL 3 elementals!**

*A sphere of absolute zero explodes among the elementals. They shriek, their flames guttering.*

**Chilling Effect**: All 3 elementals must save DC 15 Constitution
**Elemental #1**: [9] → FAIL! → -10 ft speed
**Elemental #2**: [12] → FAIL! → -10 ft speed
**Elemental #3**: [14] → FAIL! → -10 ft speed

*All three elementals are CHILLED, their movement slowed.*

**Mana**: 44 - 10 = 34/60

**Fire Elemental Lord's Turn**: Casts "Flame Strike" at you → 4d6 fire → [5, 6, 4, 5] = 20 fire damage
**Your HP**: 57 - 20 = 37/80

*The fire lord's flames sear you. You're at 37/80 HP. The aura is draining you, and the enemies are hitting hard.*

**Current State**: HP: 37/80 | Phylactery HP: 30 | Aura: Active | Mana: 34/60

**Turn 3 - Critical Decision (HP: 37 → 32 → 0 → PHYLACTERY RESURRECTION)**

**Start of Turn**: Eternal Frost Aura health drain
**Drain Roll**: 1d6 → [5] = 5 HP lost
**Your HP**: 37 - 5 = 32/80

*You're at 32 HP. The aura is killing you. But you're so close to victory. You keep it active.*

**Your Action**: Cast "Ice Lance" at Fire Elemental Lord (8 mana)
**Attack Roll**: d20+6 → [18] = Hit!
**Base Damage**: 4d8 frost → [7, 8, 6, 7] = 28 damage
**Aura Bonus**: +1d6 frost → [6] = +6 damage
**Total Damage**: 28 + 6 = **34 frost damage!**

*The ice lance pierces the fire lord. It roars in pain, flames flickering.*

**Mana**: 34 - 8 = 26/60

**Fire Elemental #2's Turn**: Attacks you → [19] → Hit! → 2d8+4 → [8, 7] + 4 = 19 damage
**Your HP**: 32 - 19 = 13/80

**Fire Elemental #3's Turn**: Attacks you → [18] → Hit! → 2d8+4 → [6, 8] + 4 = 18 damage
**Your HP**: 13 - 18 = **-5 HP** → YOU DIE!

*The flames consume you. You fall, your body burning. But your phylactery PULSES.*

**PHYLACTERY RESURRECTION TRIGGERS!**

*Your phylactery shatters, releasing the stored life force. Your body REFORMS from ice and shadow.*

**Phylactery Effect**: Spend all stored HP (30 HP) to resurrect at that HP total
**Your HP**: 0 → **30 HP** (resurrected!)
**Phylactery HP**: 30 → **0** (depleted, must be recharged via ritual)

*You rise from the ashes, frost spreading from your reformed body. The fire elementals back away, terrified. You DIED and came back. That's what Lichborne do.*

**Your Party's Healer**: "You... you died. I saw you die."
**You**: "Death is temporary. My phylactery anchors my soul. I'll reform it later."

**Current State**: HP: 30/80 | Phylactery HP: 0 (depleted) | Aura: Still Active | Mana: 26/60

**Turn 4 - Deactivating the Aura (HP: 30 → 25 → 40)**

**Start of Turn**: Eternal Frost Aura health drain
**Drain Roll**: 1d6 → [5] = 5 HP lost
**Your HP**: 30 - 5 = 25/80

*You're at 25 HP. The aura is still draining you. Time to turn it OFF.*

**Your Action**: Deactivate Eternal Frost Aura (0 AP)

*You release the cold. The frost aura dissipates. The temperature rises. You can breathe again.*

**Eternal Frost Aura**: INACTIVE
**Effect**: No more +1d6 frost damage, no more health drain

**Your Party's Healer**: Heals you for 15 HP
**Your HP**: 25 + 15 = 40/80

**Your Action**: Cast "Ice Shard" at Fire Elemental #2 (6 mana, no aura bonus)
**Attack Roll**: d20+6 → [15] = Hit!
**Damage**: 3d6 frost → [6, 5, 4] = **15 damage** (no aura bonus)
**Result**: Fire Elemental #2 DEAD (was already wounded)

**Mana**: 26 - 6 = 20/60

**Your Party's Mage**: Casts Fireball → Kills Fire Elemental #3
**Your Party's Tank**: Attacks Fire Elemental Lord → 18 damage

**Fire Elemental Lord**: 34 + 18 = 52 damage taken, badly wounded

**Current State**: HP: 40/80 | Phylactery HP: 0 | Aura: Inactive | Mana: 20/60

**Turn 5 - Finishing the Fight**

**Your Action**: Cast "Frozen Tomb" on Fire Elemental Lord (12 mana)
**Effect**: Target must save DC 15 Constitution or be frozen solid (paralyzed) for 3 rounds

**Fire Lord's Save**: [8] → FAIL!

*The fire lord is encased in a tomb of ice. Frozen. Helpless.*

**Your Party's Tank**: Shatters the frozen lord with a hammer strike → DEAD

**Combat Over**

*You stand among the melted remains of the fire elementals, breathing heavily. Your phylactery is dark, depleted. You'll need to perform the ritual again to recharge it.*

**Your Party's Tank**: "You died. Actually died. And came back."
**You**: "The phylactery stores life force. I spent 30 HP worth to resurrect. Now it's empty. I'll need to perform a 1-hour ritual to recharge it—transfer 10 HP at a time."
**Your Party's Mage**: "And that aura? You were glowing with frost, but you were also... dying."
**You**: "Eternal Frost Aura. +1d6 frost damage to all my spells, enemies get chilled. But it drains 1d6 HP per turn. I lost 16 HP total from the drain (6 + 5 + 5). Worth it for the damage boost."
**Your Party's Healer**: "You're insane."
**You**: "I'm undead. Sanity is optional."

**Final State**: HP: 40/80 | Phylactery HP: 0 (needs recharge) | Aura: Inactive | Mana: 8/60

**The Lesson**: Lichborne gameplay is about:
1. **Aura Activation**: Activated Eternal Frost Aura Turn 1, gained +1d6 frost damage on all spells
2. **Health Drain**: Lost 1d6 HP per turn (6 + 5 + 5 = 16 HP total) while aura was active
3. **Damage Amplification**: Ice Shard: 15 → 20 damage (+5), Frozen Orb: 21 → 25 damage (+4), Ice Lance: 28 → 34 damage (+6)
4. **Chilling Effects**: All enemies hit by frost spells had to save or lose 10 ft movement speed
5. **Phylactery Resurrection**: Died at -5 HP, phylactery triggered, resurrected at 30 HP (spent all stored phylactery HP)
6. **Aura Management**: Deactivated aura Turn 4 when HP got too low (25 HP)
7. **Risk/Reward**: Aura gave +20 total damage but cost 16 HP from drain + death at -5 HP = worth it for the power

You're not a safe, sustainable caster. You're an UNDEAD FROST MAGE who sacrifices your own life force for power. The Eternal Frost Aura makes you stronger but KILLS you slowly. The Phylactery lets you die and come back. You're playing with death itself—draining your HP for damage, dying, resurrecting, then doing it again. The key is knowing when to activate the aura (for burst damage), when to deactivate it (when HP gets critical), and when to use your phylactery resurrection (when you actually die). Death isn't the end. It's just another resource.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Eternal Frost Aura & Phylactery',
    subtitle: 'Power Through Sacrifice, Resurrection Through Preparation',

    description: `The Lichborne's unique dual-mechanic system combines the Eternal Frost Aura (active power boost with health drain) and the Phylactery (HP storage and resurrection). Mastering both mechanics is essential to becoming an effective Lichborne.`,

    resourceBarExplanation: {
      title: 'Understanding Your Eternal Frost Aura & Phylactery Interface',
      content: `**What You See**: The Lichborne has a DUAL interface—one for the Eternal Frost Aura (toggle ability) and one for the Phylactery (HP storage and resurrection). Both are displayed prominently on your HUD.

**ETERNAL FROST AURA INTERFACE** (Top Section):

**Aura Status Display**:
- **Inactive State**: Gray frost icon with "Eternal Frost Aura: INACTIVE" text
- **Active State**: Glowing blue-white frost icon with "Eternal Frost Aura: ACTIVE" text, pulsing animation
- **Toggle Button**: Large button "ACTIVATE AURA (1 AP)" or "DEACTIVATE AURA (0 AP)"

**Aura Effect Indicators** (when active):
- **Damage Bonus**: "+1d6 Frost Damage" displayed in bright blue text
- **Chilling Effect**: "Enemies Chilled (DC 15 Con save or -10 ft speed)" in icy blue
- **Health Drain Warning**: "⚠️ DRAINING 1d6 HP PER TURN" in red, pulsing

**Visual Effects** (when aura is active):
- **Character Model**: Surrounded by swirling frost particles, icy blue glow
- **Frost Aura Radius**: 5 ft radius around you shown with icy mist effect
- **Breathing Effect**: Visible frozen breath, ice crystals forming in air
- **Skin Tone**: Character's skin turns pale blue-white
- **Eyes**: Glow with cold blue light

**Health Drain Tracker**:
- **Turn Counter**: "Aura Active: Turn 3" (tracks how long aura has been active)
- **Total HP Drained**: "Total Drained: 16 HP (6 + 5 + 5)" running total
- **Next Drain**: "Next Drain: 1d6 HP at start of your turn" countdown

**Aura Activation Animation**:
When you activate the aura:
- **Frost Explosion**: Frost spreads from your body in a wave
- **Temperature Drop**: Screen tints slightly blue, frost particles appear
- **Audio**: Deep, resonant ice cracking sound + wind howling
- **Status Update**: "ETERNAL FROST AURA ACTIVATED" text appears
- **Buff Icon**: Frost aura icon appears in your buff bar

**Aura Deactivation Animation**:
When you deactivate the aura:
- **Frost Dissipation**: Frost particles fade away, blue glow dims
- **Temperature Rise**: Screen tint returns to normal
- **Audio**: Fading wind sound, ice melting
- **Status Update**: "Eternal Frost Aura Deactivated" text
- **Buff Icon**: Frost aura icon removed from buff bar

**PHYLACTERY INTERFACE** (Bottom Section):

**Phylactery Display**:
- **Phylactery Icon**: Image of your phylactery (frozen crystal, skull amulet, etc.)
- **Stored HP Bar**: Shows HP stored in phylactery (0-50 HP max)
- **HP Counter**: "Phylactery HP: 30/50" in glowing text

**Phylactery HP Bar Visualization**:
- **0 HP (Empty)**: Dark, lifeless phylactery icon, "DEPLETED" in red
- **1-15 HP (Low)**: Dim glow, phylactery barely pulsing, red border
- **16-30 HP (Moderate)**: Moderate glow, phylactery pulsing steadily, orange border
- **31-45 HP (High)**: Bright glow, phylactery pulsing strongly, green border
- **46-50 HP (Maximum)**: Maximum glow, phylactery radiating power, gold border, "FULLY CHARGED"

**Resurrection Status**:
- **Available**: "Resurrection Available (10 HP cost)" in green
- **Used This Combat**: "Resurrection Used - Recharge Required" in red
- **Insufficient HP**: "Insufficient Phylactery HP (need 10 HP)" in orange

**Phylactery Storage Ritual Interface**:
When performing the 1-hour ritual:
- **Ritual Progress Bar**: "Storing HP in Phylactery... 45:00 remaining"
- **HP Transfer**: "Transferring 10 HP → Phylactery" with animation
- **Your HP**: Shows your current HP decreasing by 10
- **Phylactery HP**: Shows phylactery HP increasing by 10
- **Completion**: "Ritual Complete - 10 HP Stored" notification

**Resurrection Trigger Animation**:
When you die and phylactery resurrects you:
- **Death**: Screen goes dark, "YOU HAVE FALLEN" text appears
- **Phylactery Activation**: Phylactery icon PULSES with brilliant light
- **Resurrection**: Your body reforms from ice and shadow, frost spreading outward
- **HP Restoration**: "PHYLACTERY RESURRECTION! +30 HP" (or whatever was stored)
- **Phylactery Depletion**: Phylactery HP bar drains to 0, icon goes dark
- **Status Update**: "Resurrected by Phylactery - Recharge Required"
- **Audio**: Shattering ice sound, then deep resonant hum as you reform

**Combined Interface Display**:
- **Top Half**: Eternal Frost Aura status (active/inactive, damage bonus, health drain)
- **Bottom Half**: Phylactery status (stored HP, resurrection availability)
- **HP Bar**: Your current HP shown prominently with drain indicator when aura is active
- **Mana Bar**: Standard mana pool for casting spells

**Aura + Phylactery Synergy Indicators**:
When both systems are active:
- **Risk Assessment**: "⚠️ Aura Draining HP - Phylactery at 30 HP (3 resurrections available)"
- **Safety Net**: "Phylactery Resurrection Ready - Safe to Aggressive Play"
- **Warning**: "⚠️ LOW PHYLACTERY HP - Deactivate Aura or Recharge!"

**Health Drain Visual Feedback**:
At the start of each turn while aura is active:
- **Drain Animation**: Frost particles flow FROM your body, HP bar decreases
- **Damage Number**: "-6 HP (Aura Drain)" appears above your character in red
- **Audio**: Chilling wind sound, ice cracking
- **HP Bar Flash**: HP bar flashes red briefly
- **Phylactery Pulse**: Phylactery icon pulses, reminding you it's your safety net

**Spell Amplification Feedback**:
When you cast a frost spell with aura active:
- **Spell Cast**: Normal spell animation
- **Aura Amplification**: Frost aura SURGES, spell grows larger and brighter
- **Damage Display**: "Ice Shard: 15 damage + 5 (Aura) = 20 damage!"
- **Chilling Effect**: "Target Chilled (DC 15 save)" notification
- **Visual**: Enemy covered in frost, movement speed indicator shows -10 ft

**Chilling Effect Visualization**:
When enemy fails save against chilling:
- **Frost Coating**: Enemy model covered in ice crystals
- **Movement Debuff**: "-10 ft Speed" icon appears above enemy
- **Duration**: "Chilled (1 turn remaining)" countdown
- **Visual Trail**: Enemy leaves frost trail when moving (slower movement)

**Phylactery Recharge Reminder**:
When phylactery is depleted:
- **Notification**: "⚠️ Phylactery Depleted - Perform 1-hour ritual to recharge"
- **Ritual Availability**: "Ritual Available During Short/Long Rest"
- **HP Cost**: "Transfer 10 HP per ritual (max 50 HP total)"

**Why This Matters**: The Lichborne's dual interface makes you feel like you're PLAYING WITH DEATH. When you activate the Eternal Frost Aura, you see frost spread from your body, your skin turns pale blue, and the "DRAINING 1d6 HP PER TURN" warning pulses in red. Every turn, you watch your HP drain with the frost particle animation and damage number. But you also see the "+1d6 Frost Damage" bonus on every spell, and when you cast Ice Shard and it shows "15 + 5 (Aura) = 20 damage!", you KNOW the sacrifice is worth it. The Phylactery interface shows your safety net—when it's at 30 HP and glowing green, you can play aggressively because you have resurrection available. When you actually DIE and the phylactery triggers, the screen goes dark, then your body REFORMS from ice and shadow with the "PHYLACTERY RESURRECTION!" text—it's dramatic and powerful. The combined interface makes the risk/reward clear: drain your HP for power, but keep an eye on your phylactery because that's your lifeline.`
    },

    mechanics: {
      title: 'How It Works',
      content: `**Eternal Frost Aura**:
- **Activation**: 1 AP to activate, 0 AP to deactivate
- **Duration**: Up to 1 minute while active
- **Enhanced Frost Damage**: All frost spells deal +1d6 frost damage
- **Chilling Effects**: Enemies hit by frost spells must save (DC 15 Constitution) or have movement speed reduced by 10 ft until end of their next turn
- **Health Drain**: Lose 1d6 HP at the start of each turn while active (cannot be mitigated)
- **Sustaining**: Use healing spells/abilities to offset drain

**Phylactery Mechanics**:
- **HP Storage**: Ritual (1 hour) to transfer 10 HP into Phylactery
- **Maximum Storage**: 50 HP total
- **Resurrection**: When reduced to 0 HP, spend 10 HP from Phylactery to revive with 10 HP
- **Limit**: Once per combat
- **Recharging**: Sacrifice HP during short/long rest (max 10 HP per rest)

**Strategic Depth**:
- Balance aura damage boost against health drain
- Pre-store HP in Phylactery before dangerous encounters
- Time aura activation for burst damage windows
- Coordinate with healers to maintain aura longer`
    },

    keyAbilities: [
      {
        name: 'Eternal Frost Aura',
        type: 'Toggle Ability',
        description: 'Activate to enhance frost spells (+1d6 damage, chilling effects) but lose 1d6 HP per turn'
      },
      {
        name: 'Phylactery Storage',
        type: 'Ritual (1 hour)',
        description: 'Transfer 10 HP into Phylactery (max 50 HP stored)'
      },
      {
        name: 'Phylactery Resurrection',
        type: 'Passive',
        description: 'When reduced to 0 HP, spend 10 HP from Phylactery to revive with 10 HP (once per combat)'
      }
    ],

    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Phylactery 0-20 HP (Low Reserve)**:
- Avoid risky plays, conserve HP
- Deactivate aura unless necessary
- Focus on chilling/freezing for control
- Recharge Phylactery at next rest

**Phylactery 20-40 HP (Moderate Reserve)**:
- Can afford moderate aura usage
- Balance offense and defense
- Use resurrection as safety net
- Maintain some HP buffer

**Phylactery 40-50 HP (Full Reserve)**:
- Aggressive aura usage viable
- Can afford risky plays with resurrection backup
- Maximum damage output
- Coordinate burst windows with team

**Aura Management**:
- **Turn 1-2**: Activate aura for opening burst
- **Turn 3-5**: Toggle based on healing availability
- **Turn 6+**: Deactivate if low HP, reactivate for finishers

**Healing Coordination**:
- Communicate aura status to healers
- Time aura activation after receiving heals
- Use self-healing spells strategically
- Deactivate aura if no healing available`
    },

    playingInPerson: {
      title: 'Playing Lichborne In Person',
      content: `**Required Materials**:
- **Eternal Frost Aura Toggle** (card or token showing Active/Inactive)
- **HP Tracker** (d100 or paper for current HP)
- **Phylactery HP Tracker** (separate tracker for stored HP)
- **Aura Damage Die** (d6 for rolling aura drain each turn)
- **Frost Damage Bonus Tracker** (showing +1d6 when aura active)
- **Resurrection Tracker** (marking when Phylactery resurrection is available)

**Primary Tracking Method: Dual HP Tracking + Aura Toggle**

The Lichborne's resource system uses two separate HP pools (your HP and Phylactery HP) plus an Eternal Frost Aura toggle. The aura enhances frost spells but drains your HP each turn, creating a risk/reward balance. The Phylactery stores HP and provides resurrection when you die.

**Setup**:
\`\`\`
LICHBORNE RESOURCE TRACKING:

YOUR HP: [___] / 80
PHYLACTERY HP: [___] / 80 (stored HP)

ETERNAL FROST AURA: [INACTIVE] / [ACTIVE]
When Active:
• All frost spells: +1d6 frost damage
• Enemies hit: CON save DC 15 or -10 ft speed (chilled)
• You lose 1d6 HP at start of each turn

PHYLACTERY RESURRECTION:
• When you die: Resurrect at Phylactery location
• HP restored: Equal to Phylactery HP stored
• Phylactery HP: Resets to 0 after resurrection
• Cooldown: Once per long rest
\`\`\`

**How It Works**:

**Eternal Frost Aura (Toggle)**:
1. **Activate** (1 AP, no mana): Flip aura card to "ACTIVE"
2. **While Active**: All frost spells deal +1d6 damage, enemies chilled
3. **HP Drain**: At start of each turn, roll 1d6 and lose that much HP
4. **Deactivate** (1 AP, no mana): Flip aura card to "INACTIVE"

**Phylactery HP Storage**:
1. **Store HP** (ritual, 10 minutes): Transfer HP from yourself to Phylactery
2. **Maximum**: Phylactery can store up to your max HP (80)
3. **Resurrection**: When you die, resurrect at Phylactery with stored HP
4. **Reset**: Phylactery HP resets to 0 after resurrection

**Example Aura Management**:

*You have 80 HP, Phylactery has 30 HP stored, Aura is Inactive*

**Turn 1 - Activate Aura**:
1. "I activate Eternal Frost Aura!"
2. Flip aura card to "ACTIVE"
3. Aura is now active (no HP drain yet, happens at start of next turn)

**Turn 2 - Aura Drain Begins**:
1. Start of turn: Roll aura drain → 1d6 → [4] = 4 HP lost
2. Your HP: 80 - 4 = **76 HP**
3. "I cast Ice Shard at the orc!"
4. Spell damage: 3d6 (base) + 1d6 (aura bonus) = 4d6
5. Roll: [5,4,6,3] = 18 frost damage
6. Orc must save CON DC 15 or -10 ft speed (chilled)

**Turn 3 - More Aura Drain**:
1. Start of turn: Roll aura drain → 1d6 → [5] = 5 HP lost
2. Your HP: 76 - 5 = **71 HP**
3. Cast another frost spell with +1d6 bonus

**Turn 4 - Deactivate Aura**:
1. "I deactivate Eternal Frost Aura!"
2. Flip aura card to "INACTIVE"
3. No more HP drain
4. No more +1d6 frost damage bonus

**Example Phylactery Resurrection**:

*You have 15 HP, Phylactery has 40 HP stored, Aura is Active*

**Turn 1 - Aura Drain**:
1. Start of turn: Roll aura drain → 1d6 → [6] = 6 HP lost
2. Your HP: 15 - 6 = **9 HP** (low!)

**Turn 2 - Enemy Attack**:
1. Dragon breathes fire → 25 damage
2. Your HP: 9 - 25 = **-16 HP** (DEAD!)

**Turn 3 - Phylactery Resurrection**:
1. "My Phylactery activates! I resurrect!"
2. Your body crumbles to ice, then reforms at Phylactery location
3. **HP Restored**: 40 HP (equal to Phylactery HP)
4. **Phylactery HP**: Resets to 0
5. **Location**: Teleport to Phylactery (wherever you placed it)
6. **Cooldown**: Cannot resurrect again until long rest

**Phylactery HP Storage Ritual**:

*You have 80 HP, Phylactery has 10 HP stored*

**During Downtime (10-minute ritual)**:
1. "I perform the Phylactery Storage ritual"
2. Choose how much HP to transfer (e.g., 30 HP)
3. Your HP: 80 - 30 = **50 HP**
4. Phylactery HP: 10 + 30 = **40 HP**
5. Ritual complete

**Why Store HP?**:
- **Resurrection Insurance**: If you die, you resurrect with Phylactery HP
- **Strategic Reserve**: Keep HP in Phylactery for emergencies
- **Aura Aggression**: Can activate aura more aggressively if you have resurrection backup

**Aura Toggle Card Template**:
\`\`\`
═══════════════════════════════════
    ETERNAL FROST AURA
═══════════════════════════════════
STATUS: [INACTIVE] ← Flip to show Active/Inactive

WHEN ACTIVE:
✓ All frost spells: +1d6 frost damage
✓ Enemies hit: CON save DC 15 or -10 ft speed
✗ You lose 1d6 HP at start of each turn

ACTIVATION: 1 AP, no mana
DEACTIVATION: 1 AP, no mana

VISUAL: Frost spreads from your body, ice crystals
form in the air, temperature drops dramatically
═══════════════════════════════════
\`\`\`

**Phylactery Tracker Card Template**:
\`\`\`
═══════════════════════════════════
       PHYLACTERY
═══════════════════════════════════
STORED HP: [___] / 80

RESURRECTION:
☐ Available (once per long rest)
☐ Used (need long rest to recharge)

WHEN YOU DIE:
1. Resurrect at Phylactery location
2. HP restored = Phylactery HP
3. Phylactery HP resets to 0
4. Mark resurrection as "Used"

STORAGE RITUAL (10 minutes):
Transfer HP from yourself to Phylactery
Maximum: 80 HP stored
═══════════════════════════════════
\`\`\`

**Example In-Person Turn**:

*You have 60 HP, Phylactery has 35 HP, Aura is Inactive*

**Turn 1 - Activate Aura**:
1. "I activate Eternal Frost Aura!"
2. Flip aura card to "ACTIVE"
3. No drain yet (happens at start of next turn)

**Turn 2 - Aura Drain + Frost Spell**:
1. Start of turn: Roll 1d6 → [3] = 3 HP lost
2. Your HP: 60 - 3 = **57 HP**
3. "I cast Frozen Orb at the enemies!"
4. Spell damage: 5d6 (base) + 1d6 (aura) = 6d6
5. Roll: [6,5,4,6,3,5] = 29 frost damage to all enemies!
6. All enemies: CON save DC 15 or -10 ft speed

**Turn 3 - More Drain**:
1. Start of turn: Roll 1d6 → [5] = 5 HP lost
2. Your HP: 57 - 5 = **52 HP**
3. Cast another frost spell with aura bonus

**Turn 4 - Taking Damage**:
1. Start of turn: Roll 1d6 → [4] = 4 HP lost
2. Your HP: 52 - 4 = **48 HP**
3. Enemy attacks → 20 damage
4. Your HP: 48 - 20 = **28 HP** (getting low!)

**Turn 5 - Deactivate Aura**:
1. "I deactivate Eternal Frost Aura to preserve HP!"
2. Flip aura card to "INACTIVE"
3. No more drain, but no more +1d6 bonus

**Alternative Tracking Methods**:

**Method 1: Dual HP Dice**
- Use two d100s (one for your HP, one for Phylactery HP)
- Rotate dice as HP changes
- Visual and easy to see both pools

**Method 2: HP Tokens**
- Use tokens to represent HP (1 token = 10 HP)
- Separate piles for your HP and Phylactery HP
- Remove tokens as you lose HP

**Method 3: Paper Tracking**
- Write both HP values on paper
- Cross out and rewrite as they change
- Minimalist approach

**Method 4: Aura Die**
- Use a d6 placed on "Active" or "Inactive" side of card
- Roll the same die for aura drain each turn
- Dual-purpose die

**Quick Reference Card Template**:
\`\`\`
LICHBORNE QUICK REFERENCE

ETERNAL FROST AURA:
• Activate: 1 AP, no mana
• Deactivate: 1 AP, no mana
• Bonus: +1d6 frost damage to all frost spells
• Chill: Enemies hit save CON DC 15 or -10 ft speed
• Drain: Lose 1d6 HP at start of each turn

PHYLACTERY:
• Store HP: 10-minute ritual, transfer HP
• Maximum: 80 HP stored
• Resurrection: When you die, resurrect with Phylactery HP
• Cooldown: Once per long rest
• Location: Teleport to Phylactery when resurrecting

AURA STRATEGY:
• Aggressive: Keep active, rely on Phylactery resurrection
• Balanced: Toggle on/off based on combat intensity
• Conservative: Only activate for burst windows

HP MANAGEMENT:
• Monitor your HP closely when aura is active
• Store HP in Phylactery before dangerous fights
• Deactivate aura if HP gets too low
• Coordinate with healers
\`\`\`

**Thematic Enhancements**:

Many players enhance the Lichborne experience with:
- **Phylactery Prop**: Small crystal or gem representing the Phylactery
- **Frost Dice**: Blue/white dice for frost damage rolls
- **Aura Indicator**: LED tea light that glows when aura is active
- **HP Crystals**: Blue crystals or beads for tracking HP
- **Resurrection Token**: Special token marking resurrection availability
- **Temperature Drop**: Mention room getting colder when aura activates

**Aura Management Tips**:

**Activation Strategy**:
- **Early Combat**: Activate aura when combat starts for maximum damage
- **Burst Windows**: Activate for 2-3 turns, then deactivate
- **Boss Fights**: Keep active if you have Phylactery resurrection ready
- **Trash Mobs**: Toggle on/off to conserve HP

**HP Management**:
- **Monitor Drain**: Track total HP lost to aura each combat
- **Deactivate Early**: Don't wait until HP is critical
- **Healing Coordination**: Time aura activation after receiving heals
- **Phylactery Insurance**: Keep 30-40 HP in Phylactery for resurrection

**Phylactery Strategy**:
- **Pre-Combat Storage**: Store HP before dangerous fights
- **Resurrection Timing**: Use resurrection aggressively if available
- **Location Placement**: Place Phylactery in safe location before combat
- **Cooldown Awareness**: Track when resurrection is available

**Why This System Works**: The dual HP tracking (your HP and Phylactery HP) creates a unique resource management challenge. The Eternal Frost Aura toggle is simple (flip a card) but creates constant decisions about when to activate for damage versus when to deactivate to preserve HP. The Phylactery resurrection mechanic provides a safety net that encourages aggressive aura usage, knowing you can resurrect if you die. The physical act of rolling 1d6 for aura drain each turn creates tension—will you roll low (1-2) or high (5-6)? The system is easy to track but creates deep strategic gameplay.

**Pro Tips**:
- **Aura Timing**: Activate aura at start of combat, deactivate when enemies are low
- **Phylactery Placement**: Place Phylactery in safe location before combat
- **HP Banking**: Store 40-50 HP in Phylactery before boss fights
- **Drain Tracking**: Keep running total of HP lost to aura
- **Resurrection Awareness**: Know when resurrection is available
- **Specialization Synergy**: Frost Lord = aura focus, Undying = resurrection focus, Eternal = balanced approach

**Budget-Friendly Alternatives**:
- **No aura card?** Use a coin (heads = active, tails = inactive)
- **No HP trackers?** Write both HP values on paper
- **No Phylactery prop?** Just track Phylactery HP on paper
- **Minimalist**: Track your HP, Phylactery HP, and aura status on paper

**Specialization-Specific Tracking**:

**Frost Lord**:
- Aura drain reduced to 1d4 (instead of 1d6)
- Frost damage bonus increased to +2d6 (instead of +1d6)
- Track enhanced bonuses on aura card

**Undying**:
- Phylactery resurrection available twice per long rest
- Track two resurrection uses instead of one
- Mark both uses on Phylactery card

**Eternal**:
- Aura can be active permanently (no drain)
- But frost damage bonus reduced to +1d4
- No need to track aura drain

**Why Lichborne Is Perfect for In-Person Play**: The class is built around simple, tangible mechanics (HP tracking and aura toggle) that create deep strategic gameplay. The physical act of flipping the aura card to "ACTIVE" and then rolling 1d6 for drain each turn creates tension and excitement. The dual HP tracking (your HP and Phylactery HP) is easy to manage with two dice or trackers. The Phylactery resurrection mechanic provides dramatic moments when you die and resurrect at your Phylactery location. The risk/reward of keeping the aura active (more damage but HP drain) creates constant decision-making. Every turn with the aura active is a gamble—will you roll low drain or high drain? The system is simple enough to track mid-combat but creates meaningful strategic choices.`
    }
  },

  // Specializations
  specializations: {
    title: 'Lichborne Specializations',
    subtitle: 'Three Paths of Eternal Frost',

    description: 'Lichborne can specialize in three distinct paths, each emphasizing different aspects of frost magic and undead power.',

    sharedPassive: {
      name: 'Undying Frost',
      icon: 'spell_frost_frostarmor02',
      description: 'Your Eternal Frost Aura chilling effects have their save DC increased by 2 (DC 17 instead of 15). Additionally, you are immune to frost damage.'
    },

    specs: [
      {
        id: 'frostbound_tyrant',
        name: 'Frostbound Tyrant',
        icon: 'spell_frost_frostarmor',
        color: '#4A90E2',
        description: 'Masters of freezing enemies and controlling the battlefield',
        theme: 'Control and crowd control through freezing',

        passive: {
          name: 'Permafrost Mastery',
          description: 'Your freeze effects last 1d4 additional rounds. Frozen enemies take +1d6 damage from your frost spells.'
        },

        strengths: [
          'Exceptional crowd control through extended freezes',
          'High bonus damage to frozen targets',
          'Strong area denial with AoE freezes',
          'Can lock down multiple dangerous enemies'
        ],

        weaknesses: [
          'Lower damage against unfrozen targets',
          'Requires setup time to freeze enemies',
          'Less effective against freeze-immune enemies',
          'Relies on landing freeze saves'
        ],

        playstyle: 'Focus on freezing multiple enemies and exploiting frozen targets for bonus damage. Excels at locking down dangerous foes.',

        playstyleTips: [
          'Prioritize freezing high-threat targets first',
          'Use AoE freezes to control grouped enemies',
          'Follow up freezes with high-damage spells',
          'Coordinate with team to exploit frozen enemies'
        ],

        passiveAbilities: [
          {
            name: 'Undying Frost',
            tier: 'Path Passive',
            description: 'Your Eternal Frost Aura chilling effects have their save DC increased by 2 (DC 17 instead of 15). Additionally, you are immune to frost damage.',
            sharedBy: 'All Lichborne'
          },
          {
            name: 'Permafrost Mastery',
            tier: 'Specialization Passive',
            description: 'Your freeze effects last 1d4 additional rounds. Frozen enemies take +1d6 damage from your frost spells.',
            uniqueTo: 'Frostbound Tyrant'
          }
        ]
      },
      {
        id: 'spectral_reaper',
        name: 'Spectral Reaper',
        icon: 'spell_shadow_soulleech_3',
        color: '#9370DB',
        description: 'Combines frost and necrotic damage for devastating hybrid attacks',
        theme: 'Frost/necrotic hybrid damage',

        passive: {
          name: 'Deathly Chill',
          description: 'Your frost spells deal +1d6 necrotic damage. Enemies killed by your spells have a 1 in 1d6 chance (roll 6) to rise as spectral minions for 1d4 rounds.'
        },

        strengths: [
          'Hybrid damage bypasses single-type resistances',
          'Can summon minions for additional damage/tanking',
          'Strong sustained damage output',
          'Effective against both living and undead enemies'
        ],

        weaknesses: [
          'Minion summoning is RNG-dependent',
          'Lower crowd control than Frostbound Tyrant',
          'Minions are temporary and fragile',
          'Less survivability than Phylactery Guardian'
        ],

        playstyle: 'Hybrid damage dealer who combines frost and necrotic energy. Can summon temporary minions from slain enemies.',

        playstyleTips: [
          'Focus on killing low-HP enemies to trigger minion summons',
          'Use hybrid spells to bypass resistances',
          'Position minions to body-block or flank',
          'Maintain Eternal Frost Aura for maximum damage'
        ],

        passiveAbilities: [
          {
            name: 'Undying Frost',
            tier: 'Path Passive',
            description: 'Your Eternal Frost Aura chilling effects have their save DC increased by 2 (DC 17 instead of 15). Additionally, you are immune to frost damage.',
            sharedBy: 'All Lichborne'
          },
          {
            name: 'Deathly Chill',
            tier: 'Specialization Passive',
            description: 'Your frost spells deal +1d6 necrotic damage. Enemies killed by your spells have a 1 in 1d6 chance (roll 6) to rise as spectral minions for 1d4 rounds.',
            uniqueTo: 'Spectral Reaper'
          }
        ]
      },
      {
        id: 'phylactery_guardian',
        name: 'Phylactery Guardian',
        icon: 'spell_frost_frozencore',
        color: '#2D1B69',
        description: 'Enhanced phylactery mechanics and survivability',
        theme: 'Improved resurrection and HP management',

        passive: {
          name: 'Fortified Phylactery',
          description: 'Your Phylactery can store up to 75 HP (instead of 50). Phylactery resurrection costs 8 HP (instead of 10) and revives you with 15 HP (instead of 10).'
        },

        strengths: [
          'Highest survivability of all specs',
          'Can afford aggressive aura usage',
          'More frequent resurrections',
          'Better HP buffer for risky plays'
        ],

        weaknesses: [
          'Lower damage output than other specs',
          'No crowd control bonuses',
          'Still vulnerable to burst damage',
          'Resurrection limited to once per combat'
        ],

        playstyle: 'Tankier Lichborne with enhanced resurrection mechanics. Can afford more aggressive aura usage.',

        playstyleTips: [
          'Keep Phylactery at high HP before dangerous encounters',
          'Use aggressive aura uptime with resurrection backup',
          'Don\'t be afraid to take risks with full Phylactery',
          'Coordinate resurrections with team for maximum impact'
        ],

        passiveAbilities: [
          {
            name: 'Undying Frost',
            tier: 'Path Passive',
            description: 'Your Eternal Frost Aura chilling effects have their save DC increased by 2 (DC 17 instead of 15). Additionally, you are immune to frost damage.',
            sharedBy: 'All Lichborne'
          },
          {
            name: 'Fortified Phylactery',
            tier: 'Specialization Passive',
            description: 'Your Phylactery can store up to 75 HP (instead of 50). Phylactery resurrection costs 8 HP (instead of 10) and revives you with 15 HP (instead of 10).',
            uniqueTo: 'Phylactery Guardian'
          }
        ]
      }
    ]
  },

  // Example Spells - showcasing frost magic and phylactery mechanics
  exampleSpells: [
    // BASIC FROST SPELLS
    {
      id: 'lb_grave_chill',
      name: 'Grave Chill',
      description: 'A spectral chill that deals damage and chills the target. If target is Frozen, deals additional damage.',
      category: 'basic_frost',
      spellType: 'ACTION',
      icon: 'spell_frost_frostbolt',
      school: 'Necromancy',

      resourceCost: {
        actionPoints: 2,
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Frigus Mortis!',
        somaticText: 'Extend hand with frost emanating'
      },

      castTime: 'Action',
      range: 30,
      targetType: 'Single Enemy',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'negates_chill'
      },

      damageConfig: {
        baseDamage: '1d6',
        damageType: 'frost',
        bonusDamage: {
          condition: 'target_frozen',
          amount: '+1d6',
          description: 'Bonus damage if target is Frozen'
        }
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 1,
        durationType: 'turns',
        durationUnit: 'turns',
        effects: [{
          id: 'chilled',
          name: 'Chilled',
          description: 'Movement speed reduced by 10 feet',
          statusType: 'slow',
          level: 'minor'
        }]
      },

      effects: {
        damage: {
          base: '1d6',
          type: 'frost',
          conditional: {
            frozen: '+1d6'
          }
        },
        debuff: {
          type: 'chilled',
          duration: 1,
          movementReduction: 10
        }
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage (total 2d6 base, 3d6 if frozen)',
          description: 'Aura enhances all frost spell damage'
        },
        frozenInteraction: {
          condition: 'Target has Frozen condition',
          effect: 'Deals additional 1d6 frost damage'
        }
      },

      tags: ['frost', 'damage', 'chill', 'basic', 'lichborne']
    },

    // FREEZE & CONTROL SPELLS
    {
      id: 'lb_wraith_spear',
      name: 'Wraith Spear',
      description: 'Summon a spectral spear of ice that pierces through enemies, potentially freezing them.',
      category: 'freeze_control',
      spellType: 'ACTION',
      icon: 'spell_frost_frostblast',
      school: 'Evocation',

      resourceCost: {
        actionPoints: 2,
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Hasta Gelidus!',
        somaticText: 'Thrust hand forward, conjuring ice spear'
      },

      castTime: 'Action',
      range: 40,
      targetType: 'Single Enemy',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'agility',
        saveDC: 15,
        onSaveEffect: 'half_damage_no_freeze'
      },

      damageConfig: {
        baseDamage: '2d6',
        damageType: 'frost',
        bonusDamage: {
          condition: 'target_frozen',
          amount: '+1d6',
          description: 'Bonus damage if target is already Frozen'
        }
      },

      debuffConfig: {
        effects: [
          'Target is Frozen for 1 turn',
          'Immobilized, cannot take actions or reactions'
        ]
      },

      effects: {
        damage: {
          base: '2d6',
          type: 'frost',
          conditional: {
            frozen: '+1d6'
          }
        },
        debuff: {
          type: 'frozen',
          duration: 1,
          immobilized: true,
          noActions: true,
          noReactions: true
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d6 frost damage, not Frozen',
        onFailure: 'Takes 2d6 frost damage and is Frozen for 1 turn'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage (total 3d6 base, 4d6 if already frozen)',
          description: 'Aura enhances damage and applies chill on save'
        }
      },

      tags: ['frost', 'damage', 'freeze', 'control', 'lichborne']
    },

    {
      id: 'lb_deathly_frost',
      name: 'Deathly Frost',
      description: 'Emit a burst of cold energy, damaging and freezing nearby enemies.',
      category: 'freeze_control',
      spellType: 'ACTION',
      icon: 'spell_frost_frostnova',
      school: 'Evocation',

      resourceCost: {
        actionPoints: 2,
        mana: 15,
        components: ['verbal', 'somatic'],
        verbalText: 'Glacies Mortis!',
        somaticText: 'Slam hands together, releasing frost wave'
      },

      castTime: 'Action',
      range: 'Self',
      targetType: 'AoE - 10 ft radius',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half_damage_no_freeze'
      },

      damageConfig: {
        baseDamage: '1d8',
        damageType: 'frost',
        aoe: {
          shape: 'circle',
          radius: 10
        }
      },

      debuffConfig: {
        effects: [
          'Targets are Frozen for 1 turn',
          'Immobilized, cannot take actions or reactions'
        ]
      },

      effects: {
        damage: {
          base: '1d8',
          type: 'frost',
          aoe: {
            shape: 'circle',
            radius: 10
          }
        },
        debuff: {
          type: 'frozen',
          duration: 1,
          immobilized: true,
          noActions: true,
          noReactions: true
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d4 frost damage, not Frozen',
        onFailure: 'Takes 1d8 frost damage and is Frozen for 1 turn'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage per target (total 1d8+1d6 per target)',
          description: 'Aura enhances AoE damage'
        }
      },

      tags: ['frost', 'damage', 'freeze', 'aoe', 'control', 'lichborne']
    },

    // UTILITY & SUPPORT SPELLS
    {
      id: 'lb_glacial_shroud',
      name: 'Glacial Shroud',
      description: 'Encase yourself in ice, reducing damage taken and chilling attackers.',
      category: 'utility_support',
      spellType: 'ACTION',
      icon: 'spell_frost_frostarmor',
      school: 'Abjuration',

      resourceCost: {
        actionPoints: 2,
        mana: 8,
        components: ['verbal', 'somatic'],
        verbalText: 'Scutum Glaciei!',
        somaticText: 'Cross arms over chest, ice forms around body'
      },

      castTime: '1 Action Point',
      range: 'Self',
      targetType: 'Self',

      resolution: 'AUTOMATIC',

      buffConfig: {
        effects: [
          'Reduce damage taken by 3',
          'Enemies that hit you must save or be Chilled',
          'Lasts 1 minute'
        ]
      },

      effects: {
        buff: {
          damageReduction: 3,
          duration: '1 minute',
          counterAttack: {
            trigger: 'when_hit',
            effect: 'attacker_chilled',
            save: {
              type: 'constitution',
              dc: 15
            }
          }
        }
      },

      specialMechanics: {
        chillingTouch: {
          trigger: 'Enemy hits you in melee',
          effect: 'Enemy must save (DC 15 Constitution) or be Chilled',
          chillEffect: 'Movement speed reduced by 10 ft until end of their next turn'
        }
      },

      tags: ['frost', 'buff', 'defense', 'utility', 'lichborne']
    },

    {
      id: 'lb_frozen_bastion',
      name: 'Frozen Bastion',
      description: 'Create a wall of ice that blocks movement and projectiles.',
      category: 'utility_support',
      spellType: 'ACTION',
      icon: 'spell_frost_icewall',
      school: 'Conjuration',

      resourceCost: {
        actionPoints: 2,
        mana: 12,
        components: ['verbal', 'somatic'],
        verbalText: 'Murus Glacialis!',
        somaticText: 'Sweep hand horizontally, ice wall rises'
      },

      castTime: 'Action',
      range: 60,
      targetType: 'Terrain',

      resolution: 'AUTOMATIC',

      summonConfig: {
        type: 'ice_wall',
        dimensions: {
          length: 20,
          height: 10,
          thickness: 1
        },
        hp: 50,
        duration: '1 minute'
      },

      effects: {
        summon: {
          type: 'ice_wall',
          length: '20 ft',
          height: '10 ft',
          thickness: '1 ft',
          hp: 50,
          duration: '1 minute',
          blocksMovement: true,
          blocksProjectiles: true
        }
      },

      specialMechanics: {
        wallProperties: {
          hp: 50,
          immunities: ['frost'],
          vulnerabilities: ['fire'],
          description: 'Wall can be destroyed by dealing 50 damage. Takes double damage from fire.'
        }
      },

      tags: ['frost', 'summon', 'terrain', 'utility', 'control', 'lichborne']
    },

    // AOE DEVASTATION SPELLS
    {
      id: 'lb_spectral_orb',
      name: 'Spectral Orb',
      description: 'Summon a spinning orb of ice that damages and chills enemies in its path.',
      category: 'aoe_devastation',
      spellType: 'ACTION',
      icon: 'spell_frost_frostbolt02',
      school: 'Evocation',

      resourceCost: {
        actionPoints: 2,
        mana: 18,
        components: ['verbal', 'somatic'],
        verbalText: 'Orbis Gelidus!',
        somaticText: 'Spin hands in circle, orb forms and launches'
      },

      castTime: 'Action',
      range: 30,
      targetType: 'Line - 30 ft',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half_damage_no_chill'
      },

      damageConfig: {
        baseDamage: '2d8',
        damageType: 'frost',
        aoe: {
          shape: 'line',
          length: 30,
          width: 5
        },
        bonusDamage: {
          condition: 'target_frozen',
          amount: '+1d6',
          description: 'Bonus damage if target is Frozen'
        }
      },

      debuffConfig: {
        effects: [
          'Targets have movement speed halved',
          'Chilled effect lasts until end of next turn'
        ]
      },

      effects: {
        damage: {
          base: '2d8',
          type: 'frost',
          aoe: {
            shape: 'line',
            length: 30,
            width: 5
          },
          conditional: {
            frozen: '+1d6'
          }
        },
        debuff: {
          type: 'chilled',
          duration: 1,
          movementReduction: 'half'
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d8 frost damage, not Chilled',
        onFailure: 'Takes 2d8 frost damage and movement speed halved'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage per target hit',
          description: 'Aura enhances line AoE damage'
        }
      },

      tags: ['frost', 'damage', 'aoe', 'chill', 'lichborne']
    },

    // HYBRID FROST/NECROTIC SPELLS
    {
      id: 'lb_necrotic_blizzard',
      name: 'Necrotic Blizzard',
      description: 'Call forth a storm of necrotic ice shards that rains down in a designated area.',
      category: 'hybrid_necrotic',
      spellType: 'ACTION',
      icon: 'spell_frost_icestorm',
      school: 'Necromancy',

      resourceCost: {
        actionPoints: 3,
        mana: 20,
        components: ['verbal', 'somatic'],
        verbalText: 'Tempestas Mortis!',
        somaticText: 'Raise both hands skyward, storm forms above'
      },

      castTime: 'Action',
      range: 60,
      targetType: 'AoE - 20 ft radius',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half_damage_no_freeze'
      },

      damageConfig: {
        baseDamage: '3d6',
        damageTypes: ['necrotic', 'frost'],
        aoe: {
          shape: 'circle',
          radius: 20
        }
      },

      debuffConfig: {
        effects: [
          'Targets are Frozen for 1 turn',
          'Immobilized, cannot take actions or reactions'
        ]
      },

      effects: {
        damage: {
          base: '3d6',
          types: ['necrotic', 'frost'],
          split: '1d6 necrotic + 2d6 frost',
          aoe: {
            shape: 'circle',
            radius: 20
          }
        },
        debuff: {
          type: 'frozen',
          duration: 1,
          immobilized: true,
          noActions: true,
          noReactions: true
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d6 necrotic + 1d6 frost damage, not Frozen',
        onFailure: 'Takes 1d6 necrotic + 2d6 frost damage and is Frozen for 1 turn'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Frost portion deals +1d6 damage (total 1d6 necrotic + 3d6 frost)',
          description: 'Aura only enhances frost damage portion'
        },
        hybridDamage: {
          description: 'Deals both necrotic and frost damage',
          benefit: 'Bypasses single-type resistances'
        }
      },

      tags: ['frost', 'necrotic', 'damage', 'aoe', 'freeze', 'hybrid', 'lichborne']
    },

    {
      id: 'lb_frostbite_curse',
      name: 'Frostbite Curse',
      description: 'Inflict a painful frostbite on a target, causing damage and reducing their effectiveness in combat.',
      category: 'basic_frost',
      spellType: 'ACTION',
      icon: 'spell_frost_frostshock',
      school: 'Necromancy',

      resourceCost: {
        actionPoints: 2,
        mana: 6,
        components: ['verbal', 'somatic'],
        verbalText: 'Maledictio Frigoris!',
        somaticText: 'Point at target, frost spreads across their body'
      },

      castTime: 'Action',
      range: 40,
      targetType: 'Single Enemy',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half_damage_no_debuff'
      },

      damageConfig: {
        baseDamage: '1d6',
        damageType: 'frost',
        bonusDamage: {
          condition: 'target_frozen',
          amount: '+1d6',
          description: 'Bonus damage if target is Frozen'
        }
      },

      debuffConfig: {
        effects: [
          'Target is Slowed',
          'Movement speed reduced by 10 feet',
          'Can only spend half of maximum action points per turn (rounded down)',
          'Suffers Frostbite: takes 1d4 frost damage for every 5 feet moved',
          'Lasts 1 minute'
        ]
      },

      effects: {
        damage: {
          base: '1d6',
          type: 'frost',
          conditional: {
            frozen: '+1d6'
          }
        },
        debuff: {
          type: 'slowed',
          duration: '1 minute',
          movementReduction: 10,
          actionLimitation: 'one_action_or_bonus',
          frostbite: {
            damage: '1d4',
            trigger: 'per 5 ft moved'
          }
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d4 frost damage, no debuff',
        onFailure: 'Takes 1d6 frost damage, Slowed and Frostbite for 1 minute'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage (total 2d6 base, 3d6 if frozen)',
          description: 'Aura enhances damage'
        },
        frostbiteMechanic: {
          description: 'Enemy takes 1d4 frost damage per 5 ft moved',
          counterplay: 'Enemy can choose to stay still to avoid movement damage'
        }
      },

      tags: ['frost', 'damage', 'debuff', 'slow', 'dot', 'lichborne']
    },

    {
      id: 'lb_deathly_spikes',
      name: 'Deathly Spikes',
      description: 'Summon spikes of necrotic ice from the ground, impaling enemies and creating difficult terrain.',
      category: 'hybrid_necrotic',
      spellType: 'ACTION',
      icon: 'spell_deathknight_frostfever',
      school: 'Necromancy',

      resourceCost: {
        actionPoints: 2,
        mana: 14,
        components: ['verbal', 'somatic'],
        verbalText: 'Aculei Mortis!',
        somaticText: 'Slam fist into ground, spikes erupt'
      },

      castTime: 'Action',
      range: 40,
      targetType: 'AoE - 10 ft radius',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'agility',
        saveDC: 15,
        onSaveEffect: 'half_damage'
      },

      damageConfig: {
        baseDamage: '2d6',
        damageTypes: ['necrotic', 'frost'],
        aoe: {
          shape: 'circle',
          radius: 10
        },
        bonusDamage: {
          condition: 'target_frozen',
          amount: '+1d6',
          description: 'Bonus damage if target is Frozen'
        }
      },

      terrainConfig: {
        type: 'difficult_terrain',
        duration: '1 minute',
        area: '10 ft radius'
      },

      effects: {
        damage: {
          base: '2d6',
          types: ['necrotic', 'frost'],
          split: '1d6 necrotic + 1d6 frost',
          aoe: {
            shape: 'circle',
            radius: 10
          },
          conditional: {
            frozen: '+1d6'
          }
        },
        terrain: {
          type: 'difficult',
          duration: '1 minute',
          area: '10 ft radius',
          description: 'Ice spikes remain, creating difficult terrain'
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d6 total damage (split necrotic/frost)',
        onFailure: 'Takes 2d6 total damage (1d6 necrotic + 1d6 frost)'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Frost portion deals +1d6 damage (total 1d6 necrotic + 2d6 frost)',
          description: 'Aura only enhances frost damage portion'
        },
        terrainControl: {
          description: 'Creates difficult terrain that persists for 1 minute',
          effect: 'Enemies must spend 2 ft of movement for every 1 ft moved through area'
        }
      },

      tags: ['frost', 'necrotic', 'damage', 'aoe', 'terrain', 'hybrid', 'lichborne']
    },

    {
      id: 'lb_banshees_breath',
      name: "Banshee's Breath",
      description: 'Release a chilling wind that damages and pushes back enemies.',
      category: 'hybrid_necrotic',
      spellType: 'ACTION',
      icon: 'spell_shadow_soulleech_3',
      school: 'Necromancy',

      resourceCost: {
        actionPoints: 2,
        mana: 16,
        components: ['verbal', 'somatic'],
        verbalText: 'Spiritus Gelidus!',
        somaticText: 'Inhale deeply, exhale spectral wind'
      },

      castTime: 'Action',
      range: 'Self',
      targetType: 'Cone - 15 ft',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'strength',
        saveDC: 15,
        onSaveEffect: 'half_damage_no_push'
      },

      damageConfig: {
        baseDamage: '2d8',
        damageType: 'frost',
        aoe: {
          shape: 'cone',
          length: 15
        },
        bonusDamage: {
          condition: 'target_frozen',
          amount: '+1d6',
          description: 'Bonus damage if target is Frozen'
        }
      },

      pushConfig: {
        distance: 10,
        direction: 'away_from_caster'
      },

      effects: {
        damage: {
          base: '2d8',
          type: 'frost',
          aoe: {
            shape: 'cone',
            length: 15
          },
          conditional: {
            frozen: '+1d6'
          }
        },
        push: {
          distance: 10,
          direction: 'away',
          description: 'Targets pushed back 10 feet'
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d8 frost damage, not pushed',
        onFailure: 'Takes 2d8 frost damage and pushed back 10 feet'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage per target (total 3d8 base, 4d8 if frozen)',
          description: 'Aura enhances cone damage'
        },
        positioning: {
          description: 'Can push enemies off cliffs or into hazards',
          tactical: 'Use to create space or reposition enemies'
        }
      },

      tags: ['frost', 'damage', 'aoe', 'push', 'cone', 'lichborne']
    },

    {
      id: 'lb_cryostatic_tomb',
      name: 'Cryostatic Tomb',
      description: 'Place yourself or an ally in a protective ice block, healing and shielding them from harm.',
      category: 'utility_support',
      spellType: 'ACTION',
      icon: 'spell_frost_frozencore',
      school: 'Abjuration',

      resourceCost: {
        actionPoints: 3,
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Sepulcrum Glaciale!',
        somaticText: 'Encase target in ice cocoon'
      },

      castTime: 'Action',
      range: 10,
      targetType: 'Self or Ally',

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: '3d6',
        healingType: 'instant',
        description: 'Heals target immediately'
      },

      shieldConfig: {
        type: 'temporary_hp',
        amount: 'equal_to_healing',
        duration: '1 minute or until destroyed',
        hp: 50
      },

      effects: {
        healing: {
          instant: {
            formula: '3d6',
            target: 'single'
          }
        },
        shield: {
          temporaryHp: 'equal to healing rolled',
          iceBlock: {
            hp: 50,
            duration: '1 minute',
            immunities: ['all_damage_while_encased'],
            restriction: 'Cannot move or take actions while encased'
          }
        }
      },

      specialMechanics: {
        iceBlock: {
          hp: 50,
          duration: '1 minute',
          description: 'Target is encased in ice block with 50 HP',
          immunities: 'Immune to all damage while encased',
          restriction: 'Cannot move or take actions',
          breakable: 'Allies can break ice block early by dealing 50 damage to it'
        },
        tacticalUse: {
          description: 'Use on dying ally to stabilize and protect',
          alternative: 'Use on self when low HP to heal and reset'
        }
      },

      tags: ['frost', 'healing', 'shield', 'utility', 'support', 'lichborne']
    }
  ],

  // Comprehensive Spell List (Levels 1-10, 3 spells each)
  spells: [
    // ===== LEVEL 1 SPELLS =====
    {
      id: 'lichborne_frost_bolt',
      name: 'Frost Bolt',
      description: 'Launch a bolt of frost energy at your target, dealing cold damage and potentially slowing their movement.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_frostbolt02',
        tags: ['attack', 'damage', 'cold', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '2d6 + intelligence',
        elementType: 'frost',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 12,
          saveOutcome: 'negates',
          partialEffect: false
        }
      },
      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 12,
        saveType: 'constitution',
        saveOutcome: 'negates',
        effects: [{
          id: 'slow',
          name: 'Chilled',
          description: 'Movement speed reduced by 10 feet for 1 round'
        }]
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 6 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'cold', 'lichborne']
    },
    
    {
      id: 'lichborne_ice_armor',
      name: 'Ice Armor',
      description: 'Encase yourself in protective frost, gaining temporary armor and resistance.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_frostarmor02',
        tags: ['buff', 'defense', 'cold', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'armor_boost',
          name: 'Ice Armor',
          description: 'Gain +2 armor for 3 rounds',
          statModifier: {
            stat: 'armor',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 8 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },
      resolution: 'DICE',
      tags: ['buff', 'defense', 'cold', 'lichborne']
    },

    {
      id: 'lichborne_phylactery_store',
      name: 'Phylactery Store',
      description: 'Channel your life force into your phylactery, storing HP for emergency resurrection.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['utility'],
      typeConfig: {
        school: 'necrotic',
        icon: 'spell_shadow_lifedrain',
        tags: ['utility', 'phylactery', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      utilityConfig: {
        utilityType: 'special',
        selectedEffects: [{
          id: 'phylactery_store',
          name: 'Store Life Force',
          description: 'Store up to 20 HP in phylactery. Lose that HP now but can resurrect with it later.'
        }],
        duration: 0,
        durationUnit: 'permanent',
        concentration: false,
        power: 'minor'
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic']
      },
      cooldownConfig: {
        type: 'short_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['utility', 'phylactery', 'lichborne']
    },

    // ===== LEVEL 2 SPELLS =====
    {
      id: 'lichborne_ice_shard',
      name: 'Ice Shard',
      description: 'Hurl a razor-sharp shard of ice that pierces through your enemy.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_iceshard',
        tags: ['attack', 'damage', 'cold', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '3d6 + intelligence',
        elementType: 'frost',
        damageType: 'direct',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          explodingDice: false
        }
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 80,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 10 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'cold', 'lichborne']
    },

    {
      id: 'lichborne_freezing_touch',
      name: 'Freezing Touch',
      description: 'Touch your enemy with frost-laden hands, freezing them in place briefly.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['control'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_freezingbreath',
        tags: ['control', 'cold', 'stun', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      controlConfig: {
        controlType: 'incapacitation',
        strength: 'moderate',
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 13,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'paralyze',
          name: 'Frozen',
          description: 'Target is frozen solid and cannot move or take actions for 1 round',
          config: {
            durationType: 'temporary',
            recoveryMethod: 'automatic'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 12 },
        useFormulas: {},
        actionPoints: 2,
        components: ['somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },
      resolution: 'DICE',
      tags: ['control', 'cold', 'stun', 'lichborne']
    },

    {
      id: 'lichborne_frost_ward',
      name: 'Frost Ward',
      description: 'Create a protective ward of frost around yourself or an ally.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_frostward',
        tags: ['buff', 'defense', 'shield', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'damage_reduction',
          name: 'Frost Ward',
          description: 'Reduces incoming damage by 3 (flat reduction per hit) for 2 rounds',
          statModifier: {
            stat: 'damage_reduction',
            magnitude: 3,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally', 'self'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 10 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },
      resolution: 'DICE',
      tags: ['buff', 'defense', 'shield', 'lichborne']
    },

    // ===== LEVEL 3 SPELLS =====
    {
      id: 'lichborne_frozen_orb',
      name: 'Frozen Orb',
      description: 'Conjure a sphere of absolute zero that explodes in a burst of frost, damaging all enemies in the area.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_frozenorb',
        tags: ['attack', 'damage', 'aoe', 'cold', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '4d6 + intelligence',
        elementType: 'frost',
        damageType: 'direct'
      },
      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 14,
        saveType: 'constitution',
        saveOutcome: 'negates',
        effects: [{
          id: 'slow',
          name: 'Chilled',
          description: 'Movement speed reduced by 15 feet for 1 round'
        }]
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemy'],
        maxTargets: 10,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 15 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'aoe', 'cold', 'lichborne']
    },

    {
      id: 'lichborne_ice_lance',
      name: 'Ice Lance',
      description: 'Hurl a massive lance of ice that deals devastating damage to a single target.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_frostblast',
        tags: ['attack', 'damage', 'cold', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '5d8 + intelligence * 1.5',
        elementType: 'frost',
        damageType: 'direct',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          explodingDice: false,
          critEffects: ['knockback'],
          spellEffect: null
        }
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 100,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 18 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 1
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'cold', 'lichborne']
    },

    {
      id: 'lichborne_permafrost',
      name: 'Permafrost',
      description: 'Create an area of permanent ice that slows all enemies who enter.',
      level: 3,
      spellType: 'ZONE',
      effectTypes: ['control', 'utility'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_frost',
        tags: ['control', 'terrain', 'cold', 'zone', 'lichborne'],
        zoneDuration: 3,
        zoneDurationUnit: 'rounds',
        leaveTrail: false
      },
      controlConfig: {
        controlType: 'restraint',
        strength: 'moderate',
        duration: 3,
        durationUnit: 'rounds',
        saveDC: 14,
        saveType: 'agility',
        savingThrow: true,
        effects: [{
          id: 'slow',
          name: 'Slowed by Ice',
          description: 'Movement speed reduced by 50% while in zone',
          config: {
            restraintType: 'physical'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 40,
        aoeShape: 'circle',
        aoeParameters: { radius: 15 },
        targetRestrictions: ['enemy'],
        maxTargets: 10,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 16 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },
      resolution: 'DICE',
      tags: ['control', 'terrain', 'cold', 'zone', 'lichborne']
    },

    // ===== LEVEL 4 SPELLS =====
    {
      id: 'lichborne_glacial_spike',
      name: 'Glacial Spike',
      description: 'Summon a massive spike of ancient ice that impales your target.',
      level: 4,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_frostshock',
        tags: ['attack', 'damage', 'cold', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '6d8 + intelligence * 2',
        elementType: 'frost',
        damageType: 'direct',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          explodingDice: true,
          explodingDiceType: 'reroll_add',
          critEffects: ['stun'],
          spellEffect: null
        }
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 80,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 22 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'cold', 'lichborne']
    },

    {
      id: 'lichborne_frost_nova',
      name: 'Frost Nova',
      description: 'Release a burst of frost energy that freezes all enemies around you.',
      level: 4,
      spellType: 'ACTION',
      effectTypes: ['control', 'damage'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_frostnova',
        tags: ['control', 'damage', 'aoe', 'cold', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '3d6 + intelligence',
        elementType: 'frost',
        damageType: 'direct'
      },
      controlConfig: {
        controlType: 'restraint',
        strength: 'strong',
        duration: 2,
        durationUnit: 'rounds',
        saveDC: 15,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'bind',
          name: 'Frozen in Place',
          description: 'Target is rooted and cannot move for 2 rounds',
          config: {
            restraintType: 'physical'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemy'],
        maxTargets: 8,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 20 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },
      resolution: 'DICE',
      tags: ['control', 'damage', 'aoe', 'cold', 'lichborne']
    },

    {
      id: 'lichborne_phylactery_shield',
      name: 'Phylactery Shield',
      description: 'Channel power from your phylactery to create a protective barrier.',
      level: 4,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'necrotic',
        icon: 'spell_shadow_antimagicshell',
        tags: ['buff', 'defense', 'shield', 'phylactery', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'temporaryHP',
        effects: [{
          id: 'temp_hp',
          name: 'Phylactery Shield',
          description: 'Grants temporary shield equal to stored phylactery HP',
          tempHPFormula: 'phylactery_hp',
          tempHPType: 'barrier'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic']
      },
      cooldownConfig: {
        type: 'short_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['buff', 'defense', 'shield', 'phylactery', 'lichborne']
    },

    // ===== LEVEL 5 SPELLS =====
    {
      id: 'lichborne_blizzard',
      name: 'Blizzard',
      description: 'Summon a devastating blizzard that damages and slows all enemies in a large area.',
      level: 5,
      spellType: 'CHANNELED',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_icestorm',
        tags: ['channeled', 'damage', 'control', 'aoe', 'cold', 'lichborne'],
        maxChannelDuration: 3,
        durationUnit: 'ROUNDS',
        interruptible: true,
        movementAllowed: false,
        concentrationDC: 12,
        dcType: 'CONSTITUTION',
        tickFrequency: 'START_OF_TURN',
        breakEffect: 'none'
      },
      damageConfig: {
        formula: '4d6 + intelligence',
        elementType: 'frost',
        damageType: 'area',
        hasDotEffect: true,
        dotConfig: {
          duration: 3,
          tickFrequency: 'round',
          dotFormula: '4d6 + intelligence',
          isProgressiveDot: false
        }
      },
      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 15,
        saveType: 'constitution',
        saveOutcome: 'halves_effects',
        effects: [{
          id: 'slow',
          name: 'Chilled by Blizzard',
          description: 'Movement speed reduced by 20 feet while in blizzard'
        }]
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: ['enemy'],
        maxTargets: 15,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      channelingConfig: {
        type: 'persistent',
        baseFormula: '4d6 + intelligence',
        tickFrequency: 'round',
        maxDuration: 3
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 25 },
        useFormulas: {},
        actionPoints: 2,
        channelingFrequency: 'per_round',
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },
      resolution: 'DICE',
      tags: ['channeled', 'damage', 'control', 'aoe', 'cold', 'lichborne']
    },

    {
      id: 'lichborne_ice_wall',
      name: 'Ice Wall',
      description: 'Create a massive wall of solid ice that blocks movement and line of sight.',
      level: 5,
      spellType: 'ACTION',
      effectTypes: ['utility', 'control'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_icewall',
        tags: ['utility', 'control', 'terrain', 'cold', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      utilityConfig: {
        utilityType: 'environment',
        selectedEffects: [{
          id: 'barrier',
          name: 'Ice Wall',
          description: 'Creates a wall of ice 30 feet long, 10 feet high, 5 feet thick. HP: 100. Blocks movement and line of sight.'
        }],
        duration: 5,
        durationUnit: 'rounds',
        concentration: false,
        power: 'major'
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'wall',
        aoeParameters: { length: 30, height: 10, width: 5 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 22 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },
      resolution: 'DICE',
      tags: ['utility', 'control', 'terrain', 'cold', 'lichborne']
    },

    {
      id: 'lichborne_cryonic_preservation',
      name: 'Cryonic Preservation',
      description: 'Freeze yourself or an ally in ice, becoming invulnerable but unable to act.',
      level: 5,
      spellType: 'ACTION',
      effectTypes: ['utility', 'buff'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_iceshards',
        tags: ['utility', 'buff', 'defense', 'cold', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      utilityConfig: {
        utilityType: 'special',
        selectedEffects: [{
          id: 'ice_block',
          name: 'Cryonic Preservation',
          description: 'Target is frozen in unbreakable ice. Immune to all damage. Cannot move or act. Lasts 2 rounds.'
        }],
        duration: 2,
        durationUnit: 'rounds',
        concentration: false,
        power: 'major'
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally', 'self'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 20 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['utility', 'buff', 'defense', 'cold', 'lichborne']
    },

    // ===== LEVEL 6 SPELLS =====
    {
      id: 'lichborne_glacial_cascade',
      name: 'Glacial Cascade',
      description: 'Unleash a cascade of ice shards that strike multiple enemies in sequence.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_glacier',
        tags: ['attack', 'damage', 'chain', 'cold', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '5d8 + intelligence * 1.5',
        elementType: 'frost',
        damageType: 'direct'
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true,
        propagationMethod: 'chain',
        propagationBehavior: 'nearest'
      },
      propagation: {
        method: 'chain',
        behavior: 'nearest',
        parameters: {
          count: 3,
          range: 30,
          decay: 20
        }
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 28 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'chain', 'cold', 'lichborne']
    },

    {
      id: 'lichborne_absolute_zero',
      name: 'Absolute Zero',
      description: 'Create a zone of absolute zero temperature that instantly freezes everything within.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_frostshock',
        tags: ['attack', 'damage', 'control', 'aoe', 'cold', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '8d6 + intelligence * 2',
        elementType: 'frost',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 16,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      controlConfig: {
        controlType: 'incapacitation',
        strength: 'strong',
        duration: 2,
        durationUnit: 'rounds',
        saveDC: 16,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'paralyze',
          name: 'Frozen Solid',
          description: 'Target is frozen solid and cannot take actions or reactions for 2 rounds',
          config: {
            durationType: 'temporary',
            recoveryMethod: 'automatic'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: ['enemy'],
        maxTargets: 12,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 32 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'A crystal of pure ice'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'control', 'aoe', 'cold', 'lichborne']
    },

    {
      id: 'lichborne_phylactery_transfer',
      name: 'Phylactery Transfer',
      description: 'Transfer life force between your phylactery and your body.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['healing', 'utility'],
      typeConfig: {
        school: 'necrotic',
        icon: 'spell_shadow_darkritual',
        tags: ['healing', 'utility', 'phylactery', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      healingConfig: {
        formula: 'phylactery_hp',
        healingType: 'instant',
        hasHotEffect: false,
        hasShieldEffect: false
      },
      utilityConfig: {
        utilityType: 'special',
        selectedEffects: [{
          id: 'phylactery_transfer',
          name: 'Transfer Life Force',
          description: 'Transfer all HP from phylactery to yourself or vice versa'
        }],
        duration: 0,
        durationUnit: 'instant',
        concentration: false,
        power: 'major'
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic']
      },
      cooldownConfig: {
        type: 'short_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['healing', 'utility', 'phylactery', 'lichborne']
    },

    // ===== LEVEL 7 SPELLS =====
    {
      id: 'lichborne_eternal_winter',
      name: 'Eternal Winter',
      description: 'Summon an eternal winter storm that engulfs the battlefield.',
      level: 7,
      spellType: 'ZONE',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_icestorm',
        tags: ['damage', 'control', 'aoe', 'zone', 'cold', 'lichborne'],
        zoneDuration: 5,
        zoneDurationUnit: 'rounds',
        leaveTrail: false
      },
      damageConfig: {
        formula: '6d6 + intelligence',
        elementType: 'frost',
        damageType: 'area',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          extraDice: '3d6',
          critEffects: ['freeze'],
          freezeConfig: {
            duration: 1,
            durationUnit: 'round',
            saveDC: 17,
            saveType: 'constitution',
            speedReduction: 100
          }
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 17,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        description: 'All enemies in the zone take damage at the start of their turn'
      },
      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        effects: [{
          id: 'slow',
          name: 'Winter Storm',
          description: 'Movement speed reduced by 50% and visibility heavily obscured'
        }]
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 80,
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: ['enemy'],
        maxTargets: 20,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 38 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'Snow from a mountain peak'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['damage', 'control', 'aoe', 'zone', 'cold', 'lichborne']
    },

    {
      id: 'lichborne_frost_chains',
      name: 'Frost Chains',
      description: 'Bind multiple enemies with chains of magical ice.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['control'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_frostbolt',
        tags: ['control', 'multi-target', 'cold', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      controlConfig: {
        controlType: 'restraint',
        strength: 'strong',
        duration: 3,
        durationUnit: 'rounds',
        saveDC: 17,
        saveType: 'strength',
        savingThrow: true,
        effects: [{
          id: 'bind',
          name: 'Frost Chains',
          description: 'Target is bound by frost chains and cannot move or take actions for 3 rounds. Can attempt DC 17 Strength save at end of each turn to break free.',
          config: {
            restraintType: 'magical'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy'],
        maxTargets: 4,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 35 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },
      resolution: 'DICE',
      tags: ['control', 'multi-target', 'cold', 'lichborne']
    },

    {
      id: 'lichborne_phylactery_empowerment',
      name: 'Phylactery Empowerment',
      description: 'Channel all stored phylactery power into a devastating burst of energy.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'necrotic',
        secondaryElement: 'frost',
        icon: 'spell_shadow_deathanddecay',
        tags: ['attack', 'damage', 'necrotic', 'cold', 'phylactery', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '10d8 + intelligence * 2 + phylactery_hp',
        elementType: 'necrotic',
        secondaryElementType: 'frost',
        damageType: 'direct',
        description: 'Damage scales with stored phylactery HP. Empties phylactery after use.'
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 100,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'short_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'necrotic', 'cold', 'phylactery', 'lichborne']
    },

    // ===== LEVEL 8 SPELLS =====
    {
      id: 'lichborne_glacier_formation',
      name: 'Glacier Formation',
      description: 'Create a massive glacier that crushes and freezes all enemies in a huge area.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_frostbolt02',
        tags: ['attack', 'damage', 'control', 'aoe', 'cold', 'lichborne'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '12d8 + intelligence * 2',
        elementType: 'frost',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 18,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      controlConfig: {
        controlType: 'restraint',
        strength: 'extreme',
        duration: 3,
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'strength',
        savingThrow: true,
        effects: [{
          id: 'bind',
          name: 'Trapped in Glacier',
          description: 'Target is trapped within the glacier and restrained for 3 rounds. Requires DC 18 Strength check to break free.',
          config: {
            restraintType: 'physical'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 100,
        aoeShape: 'circle',
        aoeParameters: { radius: 35 },
        targetRestrictions: ['enemy'],
        maxTargets: 15,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 45 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'Ancient glacial ice'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'control', 'aoe', 'cold', 'lichborne']
    },

    {
      id: 'lichborne_frozen_tomb',
      name: 'Frozen Tomb',
      description: 'Encase a powerful enemy in an unbreakable tomb of ice.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['control'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_icewall',
        tags: ['control', 'single-target', 'cold', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      controlConfig: {
        controlType: 'incapacitation',
        strength: 'extreme',
        duration: 5,
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'paralyze',
          name: 'Frozen Tomb',
          description: 'Target is encased in magical ice and completely incapacitated for 5 rounds. Cannot take any actions. Ice has 150 HP. Target can attempt DC 18 Constitution save at end of each turn.',
          config: {
            durationType: 'temporary',
            recoveryMethod: 'save_or_break'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 40 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['control', 'single-target', 'cold', 'lichborne']
    },

    {
      id: 'lichborne_deathfrost_aura',
      name: 'Deathfrost Aura',
      description: 'Amplify your Eternal Frost Aura to lethal levels, dealing damage to nearby enemies.',
      level: 8,
      spellType: 'STATE',
      effectTypes: ['damage', 'buff'],
      typeConfig: {
        school: 'frost',
        secondaryElement: 'necrotic',
        icon: 'spell_frost_frostarmor',
        tags: ['buff', 'damage', 'aura', 'cold', 'necrotic', 'lichborne'],
        stateVisibility: 'visible',
        cooldownAfterTrigger: 0,
        cooldownUnit: 'seconds',
        maxTriggers: -1
      },
      damageConfig: {
        formula: '4d6 + intelligence',
        elementType: 'frost',
        secondaryElementType: 'necrotic',
        damageType: 'area',
        description: 'Enemies within 15 feet take damage at the start of their turn'
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'frost_amplification',
          name: 'Amplified Eternal Frost',
          description: 'Eternal Frost Aura bonus increased to +2d6 for 4 rounds',
          statModifier: {
            stat: 'frost_damage',
            magnitude: 2,
            magnitudeType: 'dice'
          }
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 15 },
        targetRestrictions: ['enemy'],
        maxTargets: 10,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 42 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['buff', 'damage', 'aura', 'cold', 'necrotic', 'lichborne']
    },

    // ===== LEVEL 9 SPELLS =====
    {
      id: 'lichborne_ice_age',
      name: 'Ice Age',
      description: 'Bring forth a new ice age, freezing the entire battlefield.',
      level: 9,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_arcticwinds',
        tags: ['attack', 'damage', 'control', 'aoe', 'cold', 'epic', 'lichborne'],
        castTime: 3,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '15d10 + intelligence * 3',
        elementType: 'frost',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 19,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      controlConfig: {
        controlType: 'incapacitation',
        strength: 'extreme',
        duration: 4,
        durationUnit: 'rounds',
        saveDC: 19,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'paralyze',
          name: 'Frozen by Ice Age',
          description: 'Target is completely frozen solid for 4 rounds. Cannot take any actions or reactions. Requires DC 19 Constitution save at end of each turn to break free.',
          config: {
            durationType: 'temporary',
            recoveryMethod: 'save'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 150,
        aoeShape: 'circle',
        aoeParameters: { radius: 60 },
        targetRestrictions: ['enemy'],
        maxTargets: 30,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 55 },
        useFormulas: {},
        actionPoints: 4,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'A crystal from the elemental plane of ice'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'control', 'aoe', 'cold', 'epic', 'lichborne']
    },

    {
      id: 'lichborne_lich_ascension',
      name: 'Lich Ascension',
      description: 'Temporarily ascend to true lichdom, gaining immense power and near invulnerability.',
      level: 9,
      spellType: 'STATE',
      effectTypes: ['buff', 'transformation'],
      typeConfig: {
        school: 'necrotic',
        secondaryElement: 'frost',
        icon: 'spell_shadow_shadesofdarkness',
        tags: ['buff', 'transformation', 'phylactery', 'epic', 'lichborne'],
        stateVisibility: 'visible',
        cooldownAfterTrigger: 0,
        cooldownUnit: 'seconds',
        maxTriggers: 1
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [
          {
            id: 'lich_power',
            name: 'Lich Power',
            description: 'All frost spells deal +3d6 damage, gain +5 armor, and 50% damage reduction for 5 rounds',
            statModifier: {
              stat: 'armor',
              magnitude: 5,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'lich_reduction',
            name: 'Undead Resilience',
            description: 'Reduce all incoming damage by 50% for 5 rounds',
            statModifier: {
              stat: 'damage_reduction',
              magnitude: 50,
              magnitudeType: 'percentage'
            }
          }
        ],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },
      transformationConfig: {
        transformationType: 'elemental',
        targetType: 'self',
        duration: 5,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Eternal Winter',
        description: 'Become one with the endless cold, transcending the limitations of undeath.',
        grantedAbilities: [
          { id: 'frost_control', name: 'Frost Aura Mastery', description: 'Eternal Frost Aura no longer drains your HP' },
          { id: 'phylactery_boost', name: 'Phylactery Surge', description: 'Phylactery can resurrect you once even if empty' },
          { id: 'cold_immunity', name: 'Cold Immunity', description: 'Immune to cold damage' }
        ]
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['buff', 'transformation', 'phylactery', 'epic', 'lichborne']
    },

    {
      id: 'lichborne_phylactery_nova',
      name: 'Phylactery Nova',
      description: 'Release all stored phylactery power in a devastating explosion.',
      level: 9,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'necrotic',
        secondaryElement: 'frost',
        icon: 'spell_shadow_shadowwordpain',
        tags: ['attack', 'damage', 'aoe', 'necrotic', 'cold', 'phylactery', 'epic', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '15d10 + intelligence * 3 + phylactery_hp * 2',
        elementType: 'necrotic',
        secondaryElementType: 'frost',
        damageType: 'direct',
        description: 'Damage scales with stored phylactery HP (multiplied by 2). Empties phylactery completely.'
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 50 },
        targetRestrictions: ['enemy'],
        maxTargets: 25,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 4,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'aoe', 'necrotic', 'cold', 'phylactery', 'epic', 'lichborne']
    },

    // ===== LEVEL 10 SPELLS =====
    {
      id: 'lichborne_apocalyptic_freeze',
      name: 'Apocalyptic Freeze',
      description: 'Freeze time itself, stopping all enemies in their tracks while you move freely.',
      level: 10,
      spellType: 'ACTION',
      effectTypes: ['control'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_freezing',
        tags: ['control', 'aoe', 'cold', 'time', 'legendary', 'lichborne'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },
      controlConfig: {
        controlType: 'incapacitation',
        strength: 'extreme',
        duration: 3,
        durationUnit: 'rounds',
        saveDC: 20,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'stun',
          name: 'Time Frozen',
          description: 'All enemies are frozen in time for 3 rounds. Cannot move, act, or react. You can act normally. Requires DC 20 Constitution save to negate.',
          config: {
            durationType: 'temporary',
            recoveryMethod: 'automatic'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 100 },
        targetRestrictions: ['enemy'],
        maxTargets: 50,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 65 },
        useFormulas: {},
        actionPoints: 4,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'The heart of a time elemental'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['control', 'aoe', 'cold', 'time', 'legendary', 'lichborne']
    },

    {
      id: 'lichborne_eternal_phylactery',
      name: 'Eternal Phylactery',
      description: 'Bind your soul permanently to your phylactery, ensuring infinite resurrections.',
      level: 10,
      spellType: 'PASSIVE',
      effectTypes: ['utility', 'buff'],
      typeConfig: {
        school: 'necrotic',
        icon: 'spell_shadow_antimagicshell',
        tags: ['utility', 'buff', 'passive', 'phylactery', 'legendary', 'lichborne'],
        toggleable: true
      },
      utilityConfig: {
        utilityType: 'special',
        selectedEffects: [{
          id: 'eternal_phylactery',
          name: 'Eternal Phylactery',
          description: 'Your phylactery auto-refills to 50 HP when depleted. Resurrection now costs no phylactery HP. Can only be destroyed by specific legendary ritual.'
        }],
        duration: 0,
        durationUnit: 'permanent',
        concentration: false,
        power: 'major'
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'phylactery_eternal',
          name: 'Eternal Phylactery',
          description: 'Phylactery automatically refills and provides unlimited resurrections',
          customDescription: 'Your phylactery has become eternal. When you die, you resurrect at 50 HP without consuming phylactery HP. Your phylactery HP automatically refills to 50 after each resurrection.'
        }],
        durationValue: 0,
        durationType: 'permanent',
        durationUnit: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 0,
        components: ['ritual'],
        materialComponents: 'The essence of immortality, 10,000 gold pieces worth of rare gems'
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'DICE',
      tags: ['utility', 'buff', 'passive', 'phylactery', 'legendary', 'lichborne', 'toggleable']
    },

    {
      id: 'lichborne_world_freeze',
      name: 'World Freeze',
      description: 'Freeze the entire world in ice, creating a permanent winter apocalypse.',
      level: 10,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control', 'utility'],
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_wizardmark',
        tags: ['attack', 'damage', 'control', 'terrain', 'cold', 'legendary', 'lichborne'],
        castTime: 5,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '20d12 + intelligence * 4',
        elementType: 'frost',
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
      controlConfig: {
        controlType: 'incapacitation',
        strength: 'extreme',
        duration: 10,
        durationUnit: 'rounds',
        saveDC: 20,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'paralyze',
          name: 'World Freeze',
          description: 'All enemies are frozen solid for 10 rounds. Cannot take any actions. The terrain becomes permanently frozen.',
          config: {
            durationType: 'extended',
            recoveryMethod: 'save'
          }
        }]
      },
      utilityConfig: {
        utilityType: 'environment',
        selectedEffects: [{
          id: 'permanent_winter',
          name: 'Permanent Winter',
          description: 'The entire battlefield becomes permanently frozen terrain. Difficult terrain for enemies, normal for you.'
        }],
        duration: 0,
        durationUnit: 'permanent',
        concentration: false,
        power: 'major'
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'sight',
        aoeShape: 'circle',
        aoeParameters: { radius: 200 },
        targetRestrictions: ['enemy'],
        maxTargets: 100,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 75 },
        useFormulas: {},
        actionPoints: 5,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'A shard of the primordial ice, worth 50,000 gold'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'control', 'terrain', 'cold', 'legendary', 'lichborne']
    }
  ],

  // Spell Pools by Level
  spellPools: {
    1: [
      'lichborne_frost_bolt',
      'lichborne_ice_armor',
      'lichborne_phylactery_store'
    ],
    2: [
      'lichborne_ice_shard',
      'lichborne_freezing_touch',
      'lichborne_frost_ward'
    ],
    3: [
      'lichborne_frozen_orb',
      'lichborne_ice_lance',
      'lichborne_permafrost'
    ],
    4: [
      'lichborne_glacial_spike',
      'lichborne_frost_nova',
      'lichborne_phylactery_shield'
    ],
    5: [
      'lichborne_blizzard',
      'lichborne_ice_wall',
      'lichborne_cryonic_preservation'
    ],
    6: [
      'lichborne_glacial_cascade',
      'lichborne_absolute_zero',
      'lichborne_phylactery_transfer'
    ],
    7: [
      'lichborne_eternal_winter',
      'lichborne_frost_chains',
      'lichborne_phylactery_empowerment'
    ],
    8: [
      'lichborne_glacier_formation',
      'lichborne_frozen_tomb',
      'lichborne_deathfrost_aura'
    ],
    9: [
      'lichborne_ice_age',
      'lichborne_lich_ascension',
      'lichborne_phylactery_nova'
    ],
    10: [
      'lichborne_apocalyptic_freeze',
      'lichborne_eternal_phylactery',
      'lichborne_world_freeze'
    ]
  }
};


