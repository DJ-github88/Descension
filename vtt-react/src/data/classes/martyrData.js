/**
 * Martyr Class Data
 * 
 * Complete class information for the Martyr - a selfless protector
 * who gains power through sacrifice and devotion to their allies.
 */

export const MARTYR_DATA = {
  id: 'martyr',
  name: 'Martyr',
  icon: 'fas fa-cross',
  role: 'Tank/Support',
  damageTypes: ['radiant', 'fire'],

  // Overview section
  overview: {
    title: 'The Martyr',
    subtitle: 'Selfless Protector and Sacred Sacrifice',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: The Martyr grows stronger through suffering, building Devotion Levels by taking damage and sacrificing their own vitality to protect and heal allies.

**Core Mechanic**: Take damage → Cross damage thresholds → Unlock Devotion Levels → Spend Devotion to amplify spells or gain passive power

**Resource**: Devotion Gauge (6 levels, thresholds at 10/20/40/60/80/100 damage taken)

**Playstyle**: Frontline tank who intercepts damage to build Devotion, then converts suffering into party-wide healing and buffs

**Best For**: Players who enjoy protective gameplay, martyrdom fantasy, and turning suffering into divine strength`,
    },

    description: `The Martyr is a devoted protector who draws strength from unwavering faith and willingness to endure suffering for their allies. Through the Devotion Gauge — a resource that fills as they take damage — Martyrs transform pain into power, unlocking increasingly potent abilities as they sacrifice their own vitality. Each wound they bear becomes a blessing for their companions.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Martyrs are driven by unshakeable conviction—whether religious faith, loyalty to a cause, or devotion to their companions. They have sworn oaths to protect others, even at the cost of their own lives. This dedication manifests as divine power that grows stronger the more they sacrifice.

Their devotion often shows physically: scars that glow with holy light, stigmata that bleed radiant energy, or an aura of serenity even in the midst of agony. At high Devotion Levels, they may appear transfigured—wreathed in golden light, bearing phantom wings, or surrounded by spectral guardians.

Common Martyr archetypes include:
- **The Penitent Knight**: Atoning for past sins through selfless service
- **The Faithful Shepherd**: Protecting their flock from all harm
- **The Oath-Bound Guardian**: Sworn to defend a person, place, or ideal
- **The Suffering Saint**: Believes pain brings them closer to the divine
- **The Living Shield**: Finds purpose in being the wall between danger and innocents

Martyrs understand that true strength comes not from avoiding pain, but from enduring it for others. They see each wound as a badge of honor, each sacrifice as a prayer made manifest.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Martyr is a hybrid support/tank class that excels at:

**Damage Mitigation**: Intercepting attacks meant for allies and redirecting harm to themselves
**Sustained Healing**: Converting their own suffering into healing power for the party
**Protective Buffs**: Granting resistance, temporary HP, and defensive bonuses
**Radiant Damage**: Channeling devotion into holy attacks against enemies

**Strengths**:
- Excellent at protecting vulnerable allies
- Scales in power as combat becomes more dangerous
- Strong sustained healing capabilities
- Can turn near-death situations into victory through high Devotion abilities
- Provides both defensive and offensive support

**Weaknesses**:
- Requires taking damage to reach full potential
- Can become overwhelmed if focused by too many enemies
- Less effective when allies are spread out
- Devotion spending requires careful resource management
- Vulnerable to burst damage before building Devotion

The Martyr shines in prolonged encounters where they can build Devotion Levels and unleash devastating amplified abilities at critical moments.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Martyr is about strategic sacrifice and resource management. Key considerations:

**Building Devotion**:
- Take damage naturally through combat (10/20/40/60/80/100 damage thresholds)
- Use Martyr's Intervene to protect allies and advance Devotion faster
- Some spells inflict self-damage to build Devotion while providing benefits
- Balance building Devotion with staying alive

**Devotion Level Strategy**:
- **Level 1-2 (Building Phase)**: Basic defensive benefits, focus on accumulating damage
- **Level 3-4 (Power Phase)**: Strong passive effects, moderate amplification power
- **Level 5-6 (Peak Phase)**: Powerful auras and devastating amplified abilities

**Spending Devotion**:
- Amplified spells cost 1-5 Devotion Levels for enhanced effects
- Save high Devotion for critical moments (boss fights, emergencies)
- Consider whether passive benefits outweigh active spending
- Some situations require immediate amplified healing over passive bonuses

**Specialization Synergies**:
- **Redemption**: Maximum healing and protection, defensive playstyle
- **Zealot**: Aggressive damage-dealing through suffering, offensive support
- **Ascetic**: Balanced endurance, maintains high Devotion efficiently

**Team Dynamics**:
- Position near vulnerable allies to use Intervene effectively
- Coordinate with tanks to share damage absorption duties
- Communicate Devotion Levels so team knows when big abilities are ready
- Synergizes with classes that benefit from resistance and temp HP buffs`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Sacred Sacrifice',
      content: `**The Setup**: You're a Martyr (Redemption specialization) and your party is fighting a demon lord and two lesser demons. Your mage is at 25 HP and a lesser demon is bearing down on her. Your tank holds the center. Starting HP: 100/100. Devotion Level: 0 (no damage taken yet). Starting Mana: 50/60. Spirit modifier: 4. Strength: 3.

**Starting State**: HP: 100/100 | Devotion: 0 (0 thresholds crossed, 0 spent) | Mana: 50/60 | Mage: 25/70 | Tank: 50/90

**DEVOTION LEVEL 0**

**Turn 1 — First Sacrifice**

*A lesser demon charges your mage. She's at 25 HP—one solid hit will drop her.*

**Your Reaction — Intervene** (4 mana, redirect attack to self):
**Demon's Attack**: Redirected to you → 2d8+5 → [7, 8]+5 = **20 damage**
**No passives active** (Devotion 0)
**Your HP**: 100 − 20 = **80/100**
**Total Damage Taken**: 20

**Devotion Check**: 20 ≥ 10 and 20 ≥ 20 → crossed 2 thresholds → **Devotion Level 2**
**Passive Gained (Level 1)**: Resistance to the first damage instance you receive each round (half damage, rounded down)
**Passive Gained (Level 2)**: Regain 1d6 HP at the start of your turn
**Redemptive Grace**: Intervene heals the protected ally for 2d6 → [4, 5] = 9 → Mage: 25 + 9 = **34/70**
**Suffering's Gift**: Requires Devotion 3+, not yet active

*Golden light flares from your wounds. Your first sacrifice awakens something divine.*

**Lesser Demon #1 attacks you**:
**Attack**: 1d10+3 → [7]+3 = 10 damage
**Level 1 Passive (first instance this round)**: Resistance → 10 ÷ 2 = **5 damage**
**Your HP**: 80 − 5 = **75/100**
**Total Damage Taken**: 20 + 5 = 25
**Devotion Check**: 25 ≥ 20 but < 40 → still 2 thresholds → Devotion **2**

**Your Party's Mage**: "You took that hit for me..."
**You**: "That's what I'm here for. My pain is your protection."

**Current State**: HP: 75/100 | Devotion: 2 (2 crossed, 0 spent) | Total Damage: 25 | Mana: 46/60

**Turn 2 — The Demon Lord Strikes**

*The demon lord turns its burning gaze to you, flames licking along its massive blade.*

**Start of Turn — Level 2 Passive**: Regain 1d6 HP → [4] = 4 → HP: 75 + 4 = **79**

**Demon Lord attacks you**:
**Attack**: 3d10+6 fire → [8, 9, 7]+6 = **30 fire damage**
**Level 1 Passive (first instance this round)**: Resistance → 30 ÷ 2 = **15 damage**
**Your HP**: 79 − 15 = **64/100**
**Total Damage Taken**: 25 + 15 = 40

**Devotion Check**: 40 ≥ 40 → crossed 3 thresholds → **Devotion Level 3!**
**Passive Gained (Level 3) — Suffering's Gift**: When you take damage, all allies within 10 ft gain temporary HP equal to your Devotion Level (3). Triggers once per damage instance. Self-inflicted damage does not trigger this effect.
**Suffering's Gift fires**: Allies gain 3 temp HP → Mage: **3 temp HP**, Tank: **3 temp HP**

*More wounds. More light. Your scars glow brighter.*

**Your Action — Divine Shield** (10 mana, AoE within 10 ft):
**Effect**: All allies within 10 ft gain 1d6 temporary HP → [5] = **5 temp HP**
**Temp HP comparison**: 5 (Divine Shield) > 3 (Suffering's Gift) → higher value applies
**Result**: Mage: **5 temp HP**, Tank: **5 temp HP**

**Lesser Demon #2 attacks Tank**:
**Attack**: 1d10+3 → [6]+3 = 9 damage
**No ally resistance passive** (Level 4 not yet reached)
**Tank's 5 temp HP** absorbs 5 → Tank takes 4 → Tank: 50 − 4 = **46/90** (0 temp HP remaining)

**Current State**: HP: 64/100 | Devotion: 3 (3 crossed, 0 spent) | Total Damage: 40 | Mana: 36/60
Mage: 34/70 + 5 temp HP | Tank: 46/90 + 0 temp HP

**Turn 3 — Push to Peak, Amplified Sacrifice**

*The demons surround you. You're bleeding from a dozen wounds, but golden light pulses from every scar.*

**Start of Turn — Level 2 Passive**: Regain 1d6 HP → [3] = 3 → HP: 64 + 3 = **67**

**Demon Lord attacks you**:
**Attack**: 2d10+6 fire → [7, 8]+6 = **21 fire damage**
**Level 1 Passive (first instance this round)**: Resistance → 21 ÷ 2 = **10 damage** (rounded down)
**Your HP**: 67 − 10 = **57/100**
**Total Damage Taken**: 40 + 10 = 50
**Devotion Check**: 50 ≥ 40 but < 60 → still 3 thresholds → Devotion **3**
**Suffering's Gift**: Allies gain 3 temp HP → Mage has 5 (3 < 5, no change) | Tank has 0 → Tank: **3 temp HP**

**Lesser Demon #1 attacks you**:
**Attack**: 1d10+3 → [9]+3 = 12 damage
**Second instance this round — no resistance**
**Your HP**: 57 − 12 = **45/100**
**Total Damage Taken**: 50 + 12 = 62

**Devotion Check**: 62 ≥ 60 → crossed 4 thresholds → **Devotion Level 4!**
**Passive Gained (Level 4)**: All allies within 10 ft resist the first damage type they receive each round (half damage, rounded down)
**Suffering's Gift**: Allies gain 4 temp HP → Mage has 5 (4 < 5, no change) | Tank has 3 (4 > 3) → Tank: **4 temp HP**

**Lesser Demon #2 attacks Mage**:
**Attack**: 1d10+3 → [5]+3 = 8 slashing damage
**Level 4 Passive**: Allies resist first damage type → 8 ÷ 2 = **4 damage** to Mage
**Mage's 5 temp HP** absorbs 4 → Mage takes 0 → Mage: **34/70** (1 temp HP remaining)

*Your wounds are radiant. Power surges through you. The mage is safe. Now—amplify.*

**Your Action — Restorative Prayer AMPLIFIED** on Mage (5 mana + spend 2 Devotion Levels):
**Devotion Spent**: 2 → Effective Devotion: 4 crossed − 2 spent = **Level 2**
**Rise Check**: Total damage (62) crosses a NEW threshold (80)? No → stays at Level 2
**Base Healing**: 1d4 + Spirit(4) → [3]+4 = 7 HP
**Amplification Bonus**: +2d8 per Devotion Level spent (2) = +4d8 → [6, 7, 4, 8] = +25 HP
**Total Healing**: 7 + 25 = **32 HP** → Mage: 34 + 32 = **66/70**

**Self-Damage (Amplified Spell Cost)**: 1d6 per Devotion Level spent (2) = 2d6 → [3, 2] = **5 damage**
**Self-inflicted → does NOT add to Total Damage Taken**
**Self-inflicted → does NOT trigger Suffering's Gift**
**Your HP**: 45 − 5 = **40/100**
**Total Damage Taken**: still **62**

**Mana**: 36 − 5 = **31/60**

**Your Party's Tank**: "You're glowing like a furnace! Are you holding up?"
**You**: "I've been better. But the mage just got healed for 32 HP. That's what matters."

**Current State**: HP: 40/100 | Devotion: 2 (4 crossed, 2 spent) | Total Damage: 62 | Mana: 31/60
Mage: 66/70 + 1 temp HP | Tank: 46/90 + 4 temp HP

**Turn 4 — Rebuild and Finish**

*You're at 40 HP. The demons are relentless. But your Devotion is rebuilding—each wound brings you closer to the next threshold.*

**Start of Turn — Level 2 Passive**: Regain 1d6 HP → [5] = 5 → HP: 40 + 5 = **45**

**Demon Lord attacks you**:
**Attack**: 2d10+6 fire → [9, 7]+6 = **22 fire damage**
**Level 1 Passive (first instance this round)**: Resistance → 22 ÷ 2 = **11 damage**
**Your HP**: 45 − 11 = **34/100**
**Total Damage Taken**: 62 + 11 = 73
**Devotion Check**: 73 < 80 → still 4 thresholds → Devotion **2**

**Lesser Demon #1 attacks you**:
**Attack**: 1d10+3 → [8]+3 = 11 damage
**Second instance this round — no resistance**
**Your HP**: 34 − 11 = **23/100**
**Total Damage Taken**: 73 + 11 = 84

**Devotion Check**: 84 ≥ 80 → NEW threshold crossed! 5 thresholds total → Effective Devotion: 5 − 2 = **Level 3!**
**Suffering's Gift**: Allies gain 3 temp HP → Mage has 1 (3 > 1) → Mage: **3 temp HP** | Tank has 4 (3 < 4, no change)

*New Devotion surges through you. Not full power, but enough.*

**Your Action — Devoted Strike** at Lesser Demon #2 (6 mana, melee):
**Attack Roll**: d20+5 → [18] = Hit!
**Damage**: 1d8 + Strength(3) → [7]+3 = **10 radiant damage**
**Self-Heal**: Strength(3) ÷ 2 = 1 HP → HP: 23 + 1 = **24/100**
**Result**: Lesser Demon #2 is wounded

*Your allies finish the fight—the tank crushes the wounded demon, and the mage's fire spell scorches the last one.*

**Combat Over**

*You stand among the demon corpses, bleeding but victorious. Your wounds glow with fading golden light.*

**Final State**: HP: 24/100 | Devotion: 3 (5 crossed, 2 spent) | Total Damage: 84 | Mana: 25/60
Mage: 66/70 + 3 temp HP | Tank: 46/90 + 4 temp HP

**The Lesson**: This fight demonstrates the core Martyr loop:

1. **Building Devotion Through Sacrifice**: You intercepted a killing blow on Turn 1 with Intervene (4 mana), immediately crossing two thresholds and reaching Devotion 2. Every hit you absorbed after that pushed you higher.

2. **Model A Devotion Spending**: On Turn 3, you spent 2 Devotion Levels to amplify Restorative Prayer. Your effective Devotion dropped from 4 to 2. Your total damage taken (62) did NOT decrease—only your available Devotion did. You could not rise back until your total damage crossed a NEW threshold (80).

3. **Self-Damage Exclusion**: The 2d6 self-damage from amplification (5 HP) did NOT contribute to your Devotion thresholds and did NOT trigger Suffering's Gift. Only damage from external sources counts.

4. **Recovering Devotion**: On Turn 4, when your total damage hit 84, you crossed the 80 threshold for the first time—earning a 5th Devotion level. With 2 spent, your effective Devotion rose from 2 back to 3. To fully recover to Level 5, you would need to spend no more Devotion.

5. **Layered Passive Protection**: Your passives provided constant value—Level 1 resistance halved the demon lord's 30-damage hit to 15, Level 2 regen restored 17 HP across four turns, Suffering's Gift buffered your allies with temp HP, and Level 4 resistance protected the Mage from an 8-damage hit entirely.

6. **Amplified Healing at the Right Moment**: Spending 2 Devotion on Turn 3 turned a modest 7 HP heal into 32 HP—saving the Mage when she needed it most. The cost was real: 5 self-damage and dropping from Devotion 4 to 2. But the Mage lived.

7. **Devotion Persistence**: Your Devotion (Level 3, with 84 total damage) persists until you complete a Short Rest or are healed above 80% of your maximum HP (80 HP). Even after combat ends, you carry that power into the next fight.

You're not a traditional healer. You're a LIVING SACRIFICE. You intercept attacks meant for allies. You endure suffering so they don't have to. And when your Devotion peaks, you convert that pain into amplified healing that can save a dying ally. The key is timing—spend Devotion when it matters most, and trust that more wounds will rebuild what you spent. Your wounds are your power. Your pain is their salvation.`
    }
  },

  resourceSystem: {
    title: 'Devotion Gauge',
    subtitle: 'Power Through Sacrifice',

    description: `The Martyr is a selfless guardian who transforms their own suffering into divine intervention. By absorbing damage meant for their allies, they build their Devotion Gauge, unlocking increasingly powerful passive auras and radiant smites. Each wound is a prayer, and each scar is a source of strength, culminating in a celestial transfiguration that can turn the tide of any losing battle.`,

    cards: [
      {
        title: 'Flickering Faith (Level 1–2)',
        stats: 'Resist 1st Hit | 1d6 HP Regen',
        details: 'The foundation of endurance. At these levels, your faith provides personal survival, ensuring you can stay on the frontline to take more hits.'
      },
      {
        title: 'Radiant Sacrifice (Level 3–4)',
        stats: '+1 Armor Aura | Resists for Allies',
        details: 'Your pain becomes their protection. Allies within 10ft gain armor and resistance to damage types as you bleed for them.'
      },
      {
        title: 'Celestial Protector (Level 5–6)',
        stats: '+10 Radiant DMG | Massive Resist',
        details: 'Transcendence. You gain phantom wings and a halo, granting your entire party resistance to ALL damage types within 15ft.'
      }
    ],

    generationTable: {
      headers: ['Action/Event', 'Devotion Gain', 'Thresholds'],
      rows: [
        ['Take Damage', '1:1 Progress', '10/20/40/60/80/100 Total'],
        ["Martyr's Intervene", 'Redirect + Bonus', '+1 Level (min) per interception'],
        ['Self-Sacrifice Spells', 'Self-DMG', 'Direct conversion of HP to Devotion'],
        ['Amplify Spell', 'Spend Levels', 'Costs 1-5 Levels. Your effective Level decreases by the amount spent. Total damage taken does NOT decrease. Your Level can rise again if total damage crosses the threshold for your current Level + 1.'],
        ['Short Rest', 'Persistence', 'Devotion persists until you complete a Short Rest or are healed above 80% of your max HP']
      ]
    },

    usage: {
      momentum: 'Use Intervene aggressively in the first three rounds. Your goal is to "spike" into Level 3 as fast as possible to grant your allies the +1 Armor aura.',
      flourish: '⚠️ The Spending Trap: Amplified spells are seductive, but they strip your passive auras. If you spend Level 6 to save one person, you might lose the resistance that was keeping the rest of the party alive.'
    },

    overheatRules: {
      title: 'Sacrificial Tiers',
      content: `Your **Devotion Level** determines the strength of your passive auras and the magnitude of your divine presence.

**✨ Transfigured (Level 5–6)**:
- **Effect**: God-Tier Protection.
- **Strategy**: This is your peak state. You provide resistance to all damage types for the entire team. Do not spend these levels on amplified spells unless it is for a game-ending Smite or a life-saving burst heal.

**🛡️ Ascendant (Level 3–4)**:
- **Effect**: Support Anchor.
- **Strategy**: The optimal state for most of the battle. You provide balanced armor buffs and have moderate amplification power ready for emergency interventions.

**🩸 Mortal (Level 0–2)**:
- **Effect**: Vulnerability.
- **Strategy**: You are just a man. Your priority is to Intercept attacks immediately and use self-sacrificial spells to reach higher tiers before the party takes significant damage.`
    },

    strategicConsiderations: {
      title: 'The Living Shield',
      content: `**The Intervene Priority**: Your best resource isn't your mana—it's your HP. If an ally is targeted by a multi-hit attack, use Intervene on the largest single hit to maximize your "Bonus Devotion" gain (Damage/10).

**Passive vs Active**: A Level 6 Martyr is practically a win-condition due to the group-wide resistance. Spending those levels should be your last resort, used only when the "Amplified" healing is the only way to prevent a death.

**The Self-Damage Loop**: Some spells, like Penance of Pain, hurt you to heal others. This is a "double-win": you provide necessary support while manually pushing your Devotion Gauge into the next tier. However, self-damage from amplified spells does NOT contribute to your total damage taken for Devotion threshold purposes. This prevents infinite loops where amplified spell self-damage immediately recovers spent Devotion Levels.

**Suffering's Gift**: At Devotion Level 3+, this triggers once per instance of damage received. Temporary HP does not stack — the higher value applies. Self-inflicted damage does NOT trigger this effect.

**Worked Example (The Threshold Jump)**:
- **Scenario**: You are at Level 2 (20 damage taken). A boss targets your Wizard with a 20-damage fireball.
- **The Play**: Intervene. You take 20 damage.
- **The Result**: Your total damage hits 40 (Level 3), AND Intervene grants a bonus level. You jump from Level 2 to Level 4 in a single reaction.
- **Outcome**: The Wizard is safe, and your entire team now has a Resistance Aura they didn't have 10 seconds ago.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Tracking the Blood Stacks',
      content: `Tracking six levels of devotion and cumulative damage can be messy. Use "Blood Stacks" for clarity.

**Required Materials**:
- **Devotion Track** — A strip of cardstock with 1-6 marked on it.
- **Red Glass Beads** — Use these for your current HP.
- **Gold Tokens** — Use these to mark unlocked Devotion Levels.

**The Physical Hack**:
- **The Altar**: Place your Devotion Track in the center of the table. As you take damage, move a marker up the track. When you "Amplify," physically hand the tokens to the GM. It makes the sacrifice feel heavy and significant.
- **Glow-Up**: Use a gold d6 to track your current level. When you hit Level 5, swap it for a d20 to show your "Ascendance."

**Quick Reference**:
\`\`\`
THRESHOLDS: 10, 20, 40, 60, 80, 100 (Total Damage)
INTERVENE: Redirect attack + 1 Bonus Level
AMPLIFY: Spend 1-5 Levels for Massive Spells
\`\`\`

**Tactile Tip**: Every time you take damage for an ally, tap your shield or the table. It reminds everyone that your power is bought with your own life force.`
    }
  },

  // Specializations
  specializations: {
    title: 'Martyr Specializations',
    subtitle: 'Three Paths of Sacred Sacrifice',
    
    description: `Every Martyr chooses one of three specializations that define their approach to devotion and sacrifice. Each specialization offers unique passive abilities and influences your spell selection and playstyle.`,
    
    specs: [
      {
        id: 'redemption',
        name: 'Redemption',
        icon: 'Radiant/Radiant Bolt',
        color: '#FFD700',
        theme: 'Healing Through Sacrifice',
        
        description: `Redemption Martyrs are the ultimate healers and protectors, converting their own suffering into powerful restorative magic. They excel at keeping allies alive through sustained healing and protective buffs, willingly bearing wounds so others may live.`,
        
        playstyle: 'Defensive support, maximum healing output, protective buffs',
        
        strengths: [
          'Highest healing output of all Martyr specs',
          'Enhanced protective abilities',
          'Excellent at keeping allies alive in prolonged fights',
          'Amplified healing spells are extremely potent'
        ],
        
        weaknesses: [
          'Lowest damage output',
          'Requires allies to protect to be effective',
          'Less useful when fighting alone',
          'Heavily reliant on positioning near allies'
        ],
        
        passiveAbilities: [
          {
            name: "Suffering's Gift",
            tier: 'Path Passive',
            description: "At Devotion Level 3 or higher, whenever you take damage from an external source, all allies within 10 feet gain temporary HP equal to your current Devotion Level. Triggers once per instance of damage received. Temporary HP does not stack — the higher value applies. Self-inflicted damage does not trigger this effect.",
            sharedBy: 'All Martyrs'
          },
          {
            name: 'Redemptive Grace',
            tier: 'Specialization Passive',
            description: 'Whenever you use Martyr\'s Intervene, you heal the protected ally for 2d6 HP. Additionally, all healing spells you cast have their range increased by 10 feet.',
            uniqueTo: 'Redemption'
          }
        ],
        
        recommendedFor: 'Players who enjoy pure support roles, keeping allies alive, and selfless protection'
      },
      
      {
        id: 'zealot',
        name: 'Zealot',
        icon: 'Radiant/Divine Downward Sword',
        color: '#DC143C',
        theme: 'Righteous Fury',
        
        description: `Zealot Martyrs channel their suffering into devastating radiant attacks. They believe that pain purifies and empowers, using their wounds as fuel for holy vengeance. The more they suffer, the more destructive their righteous fury becomes.`,
        
        playstyle: 'Aggressive support, radiant damage, offensive buffs',
        
        strengths: [
          'Highest damage output of all Martyr specs',
          'Converts self-damage into offensive power',
          'Strong radiant damage scaling with Devotion',
          'Excellent at eliminating priority targets'
        ],
        
        weaknesses: [
          'Lower healing output than Redemption',
          'More vulnerable due to aggressive playstyle',
          'Requires balancing offense with survival',
          'Less effective at pure protection'
        ],
        
        passiveAbilities: [
          {
            name: "Suffering's Gift",
            tier: 'Path Passive',
            description: "At Devotion Level 3 or higher, whenever you take damage from an external source, all allies within 10 feet gain temporary HP equal to your current Devotion Level. Triggers once per instance of damage received. Temporary HP does not stack — the higher value applies. Self-inflicted damage does not trigger this effect.",
            sharedBy: 'All Martyrs'
          },
          {
            name: 'Zealous Wrath',
            tier: 'Specialization Passive',
            description: 'Your radiant damage spells deal additional damage equal to your current Devotion Level × 2. When you damage an enemy with a radiant spell, you heal for 15% of the damage dealt.',
            uniqueTo: 'Zealot'
          }
        ],
        
        recommendedFor: 'Players who want aggressive support, dealing damage while healing, and offensive playstyles'
      },
      
      {
        id: 'ascetic',
        name: 'Ascetic',
        icon: 'Healing/Prayer',
        color: '#4169E1',
        theme: 'Enduring Faith',
        
        description: `Ascetic Martyrs are masters of endurance, maintaining high Devotion Levels through careful resource management and resilience. They embrace suffering as a path to enlightenment, gaining powerful defensive abilities that allow them to weather any storm.`,
        
        playstyle: 'Balanced support, sustained Devotion, defensive resilience',
        
        strengths: [
          'Best at maintaining high Devotion Levels',
          'Excellent survivability and damage resistance',
          'Reduced Devotion costs for amplified abilities',
          'Strong sustained performance in long fights'
        ],
        
        weaknesses: [
          'Moderate healing and damage (jack of all trades)',
          'Requires careful resource management',
          'Less impactful burst abilities',
          'Slower to reach peak power'
        ],
        
        passiveAbilities: [
          {
            name: "Suffering's Gift",
            tier: 'Path Passive',
            description: "At Devotion Level 3 or higher, whenever you take damage from an external source, all allies within 10 feet gain temporary HP equal to your current Devotion Level. Triggers once per instance of damage received. Temporary HP does not stack — the higher value applies. Self-inflicted damage does not trigger this effect.",
            sharedBy: 'All Martyrs'
          },
          {
            name: 'Ascetic Endurance',
            tier: 'Specialization Passive',
            description: 'All amplified spell costs are reduced by 1 Devotion Level (minimum 1). While at Devotion Level 4 or higher, you gain resistance to physical damage.',
            uniqueTo: 'Ascetic'
          }
        ],
        
        recommendedFor: 'Players who enjoy resource management, balanced gameplay, and sustained power'
      }
    ]
  },

  // Spell Pools - spells available at each level for level-up selection
  spellPools: {
    1: [
      // Level 1 spells: Basic healing and protection (5 options, pick 3)
      'martyr_restorative_prayer',
      'martyr_intervene',
      'martyr_penance_of_pain',
      'martyr_radiant_burst',
      'martyr_devoted_strike'
    ],
    2: [
      // Level 2 spells: Enhanced healing and utility (3 options, pick 1)
      'martyr_divine_shield',
      'martyr_sanctuary_aura',
      'martyr_blessed_resilience'
    ],
    4: [
      // Level 4 spells: Powerful amplified abilities (3 options, pick 1)
      'martyr_shield_of_faith',
      'martyr_life_transfer',
      'martyr_martyrs_mark'
    ],
    6: [
      // Level 6 spells: Advanced devotion abilities (2 options, pick 1)
      'martyr_sanctified_ground',
      'martyr_willing_vessel'
    ]
  },

  // Example Spells - showcasing the spell wizard system
  spells: [
    // ========================================
    // LEVEL 1 STARTING SPELLS (5 options, pick 3)
    // ========================================
    {
      id: 'martyr_restorative_prayer',
      name: 'Restorative Prayer',
      description: 'Channel divine energy through prayer to heal an ally. Scales with Spirit and can be amplified with Devotion.',
      level: 1,
      spellType: 'ACTION',
      icon: 'Healing/Golden Heart',

      typeConfig: {
        school: 'evocation',
        icon: 'Healing/Golden Heart',
        tags: ['healing', 'basic', 'devotion amplifiable', 'level 1'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 5 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Sanatio Divina',
        somaticText: 'Hands clasped in prayer, golden light emanating from your fingers as divine energy flows through you'
      },

      resolution: 'DICE',
      effectTypes: ['healing'],

      healingConfig: {
        formula: '1d4 + spirit',
        healingType: 'direct',
        hasHotEffect: false,
        description: 'The restorative prayer mends wounds with gentle divine energy. Cuts close, bruises fade, and the target feels their pain ease as vitality is restored. The healing is accompanied by a sense of peace and comfort, as if the divine itself is watching over them.'
      },

      devotionRequired: 0,
      devotionGain: 1,

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['healing', 'basic', 'devotion amplifiable', 'level 1']
    },

    {
      id: 'martyr_intervene',
      name: 'Intervene',
      description: 'Step in front of an ally to intercept an attack, taking the damage yourself. Grants bonus Devotion equal to damage taken divided by 10 (minimum 1).',
      level: 1,
      spellType: 'REACTION',
      icon: 'Utility/Shield',

      typeConfig: {
        school: 'abjuration',
        icon: 'Utility/Shield',
        tags: ['protection', 'reaction', 'devotion amplifiable', 'level 1'],
        castTime: 1,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 4 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'Protector!'
      },

      resolution: 'NONE',
      effectTypes: ['utility'],

      utilityConfig: {
        utilityType: 'protection',
        selectedEffects: [{
          id: 'intercept_attack',
          name: 'Intercept Attack',
          description: 'Take damage meant for ally this turn'
        }],
        duration: 1,
        durationUnit: 'turns',
        concentration: false,
        power: 'minor'
      },

      devotionRequired: 0,
      devotionGain: 2,

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['protection', 'reaction', 'devotion amplifiable', 'level 1']
    },

    {
      id: 'martyr_penance_of_pain',
      name: 'Penance of Pain',
      description: 'Press your hand to your own wounds, converting pain into healing for an ally. The more wounded you are, the stronger the healing. Builds Devotion.',
      level: 1,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Beam',

      typeConfig: {
        school: 'evocation',
        icon: 'Radiant/Radiant Beam',
        tags: ['healing', 'sacrificial', 'devotion amplifiable', 'level 1'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 6 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Dolor pro Beneficio!',
        somaticText: 'Press hand to your own wound, channeling your pain into healing energy that flows from your fingertips'
      },

      resolution: 'DICE',
      effectTypes: ['healing'],

      healingConfig: {
        formula: '(maxHealth - currentHealth) / 4',
        healingType: 'direct',
        hasHotEffect: false,
        description: 'Your pain becomes your ally\'s salvation. The healing energy flows from your wounds, carrying with it the power to mend their injuries. The more wounded you are, the more powerful the healing becomes—your suffering is the price of their recovery.'
      },

      devotionRequired: 1,
      devotionGain: 1,

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['healing', 'sacrificial', 'devotion amplifiable', 'level 1']
    },

    {
      id: 'martyr_radiant_burst',
      name: 'Radiant Burst',
      description: 'Release a burst of radiant energy that damages undead and heals the living.',
      level: 1,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Bolt',

      typeConfig: {
        school: 'evocation',
        icon: 'Radiant/Radiant Bolt',
        tags: ['damage', 'healing', 'radiant', 'devotion amplifiable', 'level 1'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingMode: 'effect',
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 20,
        aoeShape: 'circle',
        aoeParameters: { radius: 10 },
        targetRestrictions: []
      },

      effectTargeting: {
        damage: {
          targetingType: 'area',
          rangeType: 'ranged',
          rangeDistance: 20,
          aoeShape: 'circle',
          aoeParameters: { radius: 10 },
          targetRestrictions: ['enemy']
        },
        healing: {
          targetingType: 'area',
          rangeType: 'ranged',
          rangeDistance: 20,
          aoeShape: 'circle',
          aoeParameters: { radius: 10 },
          targetRestrictions: ['ally']
        }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 8 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Lux Divina!',
        somaticText: 'Release radiant energy'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'healing'],

      damageConfig: {
        formula: '1d6 + spirit/2',
        elementType: 'radiant',
        damageType: 'direct'
      },

      healingConfig: {
        formula: '1d6 + spirit/2',
        healingType: 'direct',
        hasHotEffect: false
      },

      devotionRequired: 0,
      devotionGain: 1,

      cooldownConfig: {
        type: 'turn_based',
        value: 1
      },

      tags: ['damage', 'healing', 'radiant', 'devotion amplifiable', 'level 1']
    },

    {
      id: 'martyr_devoted_strike',
      name: 'Devoted Strike',
      description: 'Strike an enemy with radiant power, dealing damage and healing yourself through devotion.',
      level: 1,
      spellType: 'ACTION',
      icon: 'Healing/Reaching Hand',

      typeConfig: {
        school: 'evocation',
        icon: 'Healing/Reaching Hand',
        tags: ['damage', 'melee', 'radiant', 'healing', 'devotion amplifiable', 'level 1'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingMode: 'effect',
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        targetRestrictions: ['enemy']
      },

      effectTargeting: {
        damage: { targetingType: 'single', rangeType: 'melee', rangeDistance: 5, targetRestrictions: ['enemy'] },
        healing: { targetingType: 'self' }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 4 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Strike with radiant energy'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'healing'],

      damageConfig: {
        formula: '1d8 + strength',
        elementType: 'radiant',
        damageType: 'direct'
      },

      healingConfig: {
        formula: 'strength',
        healingType: 'direct',
        hasHotEffect: false
      },

      devotionRequired: 0,
      devotionGain: 2,

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['damage', 'melee', 'radiant', 'healing', 'devotion amplifiable', 'level 1']
    },

    {
      id: 'martyr_divine_shield',
      name: 'Divine Shield',
      description: 'Grant protective divine energy to all allies within range, shielding them with temporary HP.',
      spellType: 'ACTION',
      icon: 'Force/Force Shield',
      school: 'Abjuration',
      level: 2,

      typeConfig: {
        tags: ['buff', 'temporary hp', 'aoe', 'devotion amplifiable', 'level 2'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 10
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Aegis Sanctus',
        somaticText: 'Raise hands skyward'
      },

      resolution: 'DICE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'temporary_hp',
          name: 'Temporary HP',
          description: 'Gain 1d6 temporary HP that absorbs incoming damage before your actual health.',
          statModifier: {
            stat: 'temporary_hp',
            magnitude: '1d6',
            magnitudeType: 'dice'
          }
        }],
        durationValue: 0,
        durationType: 'instant',
        durationUnit: 'instant',
        concentrationRequired: false,
        canBeDispelled: false
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 1,
          amplifiedEffect: 'Grants 2d6 temporary HP instead'
        }
      },

      tags: ['buff', 'temporary hp', 'aoe', 'devotion amplifiable', 'level 2']
    },
    {
      id: 'martyr_purifying_pain',
      name: 'Purifying Pain',
      description: 'Inflict radiant damage upon yourself to heal an ally. The self-damage builds Devotion.',
      spellType: 'ACTION',
      icon: 'Healing/Golden Heart',
      school: 'Restoration',
      level: 2,

      typeConfig: {
        tags: ['healing', 'self damage', 'sacrifice', 'devotion amplifiable', 'level 2'],
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
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Purificatio Doloris',
        somaticText: 'Touch your heart then extend hand to ally'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        elementType: 'radiant',
        damageType: 'direct',
        targetType: 'self'
      },

      healingConfig: {
        formula: '4d4 + spirit',
        healingType: 'single_target',
        targetRestrictions: ['ally']
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 2,
          amplifiedEffect: 'Heal for 6d4 + Spirit modifier HP instead'
        },
        selfDamage: {
          buildsDevotion: true
        }
      },

      tags: ['healing', 'self damage', 'sacrifice', 'devotion amplifiable', 'level 2']
    },


    // Buff and Protection Spells
    {
      id: 'martyr_sanctuary_aura',
      name: 'Sanctuary Aura',
      description: 'Surround an ally with a protective aura that grants resistance to all damage types for 1 minute.',
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Golden Shield',
      school: 'Abjuration',
      level: 2,

      typeConfig: {
        tags: ['buff', 'resistance', 'protection', 'devotion amplifiable', 'level 2'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 1,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Sanctuarium',
        somaticText: 'Draw protective circle in the air'
      },

      resolution: 'AUTOMATIC',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'sanctuary',
          name: 'Sanctuary',
          description: 'Gain 25% damage resistance for 1 minute',
          statModifier: {
            stat: 'damage_reduction',
            magnitude: 25,
            magnitudeType: 'percentage'
          }
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: true,
        canBeDispelled: true
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 1,
          amplifiedEffect: 'Grants resistance to all allies within 10 feet for 1 minute'
        }
      },

      tags: ['buff', 'resistance', 'protection', 'devotion amplifiable', 'level 2']
    },

    {
      id: 'martyr_blessed_resilience',
      name: 'Blessed Resilience',
      description: 'Bless allies with divine resilience, granting bonuses to saving throws and reducing damage taken.',
      level: 2,
      spellType: 'ACTION',
      icon: 'Radiant/Divine Blessing',

      typeConfig: {
        school: 'abjuration',
        icon: 'Radiant/Divine Blessing',
        tags: ['buff', 'saving throws', 'damage reduction', 'aoe', 'devotion amplifiable', 'level 2'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: { radius: 10 },
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 12 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Benedictio Fortis',
        somaticText: 'Make blessing gesture'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'blessed_resilience_saves',
          name: 'Blessed Resilience (Saves)',
          description: '+2 bonus to all saving throws',
          mechanicsText: '+2 to all Saving Throws',
          statModifier: {
            stat: 'savingThrows',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }, {
          id: 'blessed_resilience_damage',
          name: 'Blessed Resilience (Damage Reduction)',
          description: 'Reduces all incoming damage by 2',
          mechanicsText: '-2 Damage Taken (flat reduction)',
          statModifier: {
            stat: 'damage_reduction',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 1,
        durationType: 'turns',
        durationUnit: 'turns',
        concentrationRequired: false,
        canBeDispelled: true
      },

      devotionRequired: 0,
      devotionGain: 0,

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['buff', 'saving throws', 'damage reduction', 'aoe', 'devotion amplifiable', 'level 2']
    },

    // ========================================
    // LEVEL 3 SPELLS
    // ========================================
    {
      id: 'martyr_sacrificial_bond',
      name: 'Sacrificial Bond',
      description: 'Create a sacred bond with an ally. While active, you take half of the damage they would receive.',
      level: 3,
      spellType: 'ACTION',
      icon: 'Force/Force Shield',

      typeConfig: {
        school: 'abjuration',
        icon: 'Force/Force Shield',
        tags: ['buff', 'protection', 'sacrifice', 'level 3'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 15 },
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Vinculum Sacrificii',
        somaticText: 'Touch heart then extend hand'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'protection',
        effects: [{
          id: 'sacrificial_bond',
          name: 'Sacrificial Bond',
          description: 'You take 50% of damage dealt to bonded ally',
          mechanicsText: 'Take 50% of damage dealt to bonded ally'
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: true
      },

      devotionRequired: 0,
      devotionGain: 2,

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['buff', 'protection', 'sacrifice', 'level 3']
    },

    {
      id: 'martyr_burning_sacrifice',
      name: 'Burning Sacrifice',
      description: 'Sacrifice your own life force to deal radiant damage to enemies around you.',
      level: 3,
      spellType: 'ACTION',
      icon: 'Fire/Sun Symbol',

      typeConfig: {
        school: 'evocation',
        icon: 'Fire/Sun Symbol',
        tags: ['damage', 'self damage', 'radiant', 'aoe', 'level 3'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 15 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'hp'],
        resourceValues: { mana: 10, hp: 15 },
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'Ignis Sacrificii!'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '4d6 + spirit',
        elementType: 'radiant',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 14,
          saveOutcome: 'halves'
        }
      },

      devotionRequired: 0,
      devotionGain: 3,

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['damage', 'self damage', 'radiant', 'aoe', 'level 3']
    },

    {
      id: 'martyr_cleansing_touch',
      name: 'Cleansing Touch',
      description: 'Remove negative conditions from an ally by taking the affliction upon yourself briefly.',
      level: 3,
      spellType: 'ACTION',
      icon: 'Healing/Cure Within',

      typeConfig: {
        school: 'abjuration',
        icon: 'Healing/Cure Within',
        tags: ['purification', 'sacrifice', 'utility', 'level 3'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 12 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Lay hands on ally'
      },

      resolution: 'NONE',
      effectTypes: ['purification'],

      purificationConfig: {
        purificationType: 'cleanse',
        targetType: 'single',
        power: 'moderate',
        duration: 'instant',
        selfEffect: 'You suffer the removed condition for 1 round'
      },

      devotionRequired: 0,
      devotionGain: 1,

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['purification', 'sacrifice', 'utility', 'level 3']
    },

    // ========================================
    // LEVEL 4 SPELLS
    // ========================================
    {
      id: 'martyr_shield_of_faith',
      name: 'Shield of Faith',
      description: 'Create a divine shield around an ally that absorbs 3d8 + spirit×2 damage. Lasts up to 10 rounds or until the shield is depleted.',
      level: 4,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Golden Shield',

      typeConfig: {
        school: 'abjuration',
        icon: 'Radiant/Radiant Golden Shield',
        tags: ['buff', 'shield', 'protection', 'level 4'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 18 },
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Scutum Fidei',
        somaticText: 'Create shield gesture'
      },

      resolution: 'DICE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'shield',
        effects: [{
          id: 'faith_shield',
          name: 'Shield of Faith',
          description: 'Absorbs 3d8 + spirit×2 damage until depleted. Lasts up to 10 rounds.',
          shieldValue: {
            formula: '3d8 + spirit * 2',
            shieldType: 'absorption'
          }
        }],
        durationValue: 10,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      devotionRequired: 2,
      devotionGain: 0,

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['buff', 'shield', 'protection', 'level 4']
    },

    {
      id: 'martyr_life_transfer',
      name: 'Life Transfer',
      description: 'Transfer your own health to heal an ally for twice the amount sacrificed.',
      level: 4,
      spellType: 'ACTION',
      icon: 'Healing/Golden Heart',

      typeConfig: {
        school: 'necromancy',
        icon: 'Healing/Golden Heart',
        tags: ['healing', 'sacrifice', 'self damage', 'level 4'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana', 'hp'],
        resourceValues: { mana: 8, hp: 20 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Channel life force'
      },

      resolution: 'DICE',
      effectTypes: ['healing'],

      healingConfig: {
        formula: '40 + spirit',
        healingType: 'direct',
        hasHotEffect: false
      },

      devotionRequired: 0,
      devotionGain: 2,

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['healing', 'sacrifice', 'self damage', 'level 4']
    },

    {
      id: 'martyr_martyrs_mark',
      name: "Martyr's Mark",
      description: 'Mark an enemy. Allies attacking the marked target heal for a portion of damage dealt.',
      level: 4,
      spellType: 'ACTION',
      icon: 'Necrotic/Blood Scroll',

      typeConfig: {
        school: 'enchantment',
        icon: 'Necrotic/Blood Scroll',
        tags: ['debuff', 'utility', 'healing', 'mark', 'level 4'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 15 },
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'Signum Martyris!'
      },

      resolution: 'NONE',
      effectTypes: ['debuff'],

      debuffConfig: {
        debuffType: 'mark',
        effects: [{
          id: 'martyrs_mark',
          name: "Martyr's Mark",
          description: 'Allies heal for 25% of damage dealt to marked target',
          mechanicsText: 'Allies heal for 25% of damage dealt to marked target'
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      devotionRequired: 1,
      devotionGain: 1,

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['debuff', 'utility', 'healing', 'mark', 'level 4']
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    {
      id: 'martyr_righteous_suffering',
      name: 'Righteous Suffering',
      description: 'Embrace suffering to become immune to crowd control while slowly healing allies around you.',
      level: 5,
      spellType: 'ACTION',
      icon: 'Radiant/Divine Illumination',

      typeConfig: {
        school: 'abjuration',
        icon: 'Radiant/Divine Illumination',
        tags: ['buff', 'healing', 'immunity', 'aoe', 'level 5'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana', 'hp'],
        resourceValues: { mana: 20, hp: 10 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'Passio Justa!'
      },

      resolution: 'DICE',
      effectTypes: ['buff', 'healing'],

      buffConfig: {
        buffType: 'immunity',
        effects: [{
          id: 'righteous_immunity',
          name: 'Righteous Immunity',
          description: 'You become immune to stun, fear, and charm',
          mechanicsText: 'Immune to stun, fear, and charm',
          damageImmunity: ['stun', 'fear', 'charm']
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      healingConfig: {
        formula: '2d6',
        healingType: 'hot',
        hasHotEffect: true,
        hotFormula: '2d6',
        hotDuration: 3,
        hotTickType: 'round'
      },

      devotionRequired: 3,
      devotionGain: 0,

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['buff', 'healing', 'immunity', 'aoe', 'level 5']
    },

    {
      id: 'martyr_blood_pact',
      name: 'Covenant of Sacrifice',
      description: 'Forge a sacred covenant with allies. All party members share damage equally through divine bonds.',
      level: 5,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Golden Shield',

      typeConfig: {
        school: 'enchantment',
        icon: 'Radiant/Radiant Golden Shield',
        tags: ['buff', 'protection', 'sacrifice', 'party', 'level 5'],
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
        resourceTypes: ['mana', 'hp'],
        resourceValues: { mana: 25, hp: 15 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Pactum Sanguinis',
        somaticText: 'Cut palm and raise hand'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'link',
        effects: [{
          id: 'covenant_of_sacrifice',
          name: 'Covenant of Sacrifice',
          description: 'All damage is distributed evenly among linked allies',
          mechanicsText: 'All damage distributed evenly among linked allies'
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: true
      },

      devotionRequired: 2,
      devotionGain: 3,

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['buff', 'protection', 'sacrifice', 'party', 'level 5']
    },

    {
      id: 'martyr_divine_retribution',
      name: 'Divine Retribution',
      description: 'When you take damage, store it as holy energy. Release it all as a burst of radiant damage.',
      level: 5,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Golden Shield',

      typeConfig: {
        school: 'evocation',
        icon: 'Radiant/Radiant Golden Shield',
        tags: ['damage', 'radiant', 'aoe', 'stored damage', 'level 5'],
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
        resourceValues: { mana: 22 },
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'Vindicta Divina!'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '6d8 + stored_damage',
        elementType: 'radiant',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 15,
          saveOutcome: 'halves'
        }
      },

      specialMechanics: {
        storedDamage: {
          description: 'The spell channels all the pain and suffering you\'ve endured since your last rest, converting it into divine retribution. The more you\'ve suffered, the more devastating the strike becomes, though there is a limit to how much pain can be channeled.',
          cap: 50
        }
      },

      devotionRequired: 4,
      devotionGain: 0,

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['damage', 'radiant', 'aoe', 'stored damage', 'level 5']
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    {
      id: 'martyr_sanctified_ground',
      name: 'Sanctified Ground',
      description: 'Create a zone of holy ground that heals allies and burns undead and demons standing upon it. Persists for 5 rounds.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Radiant/Bright Explosion',

      typeConfig: {
        school: 'evocation',
        icon: 'Radiant/Bright Explosion',
        tags: ['healing', 'damage', 'zone', 'aoe', 'level 6'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingMode: 'effect',
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 }
      },

      effectTargeting: {
        healing: {
          targetingType: 'area',
          rangeType: 'ranged',
          rangeDistance: 60,
          aoeShape: 'circle',
          aoeParameters: { radius: 20 },
          targetRestrictions: ['ally'],
          description: 'All allies in the zone are healed each round'
        },
        damage: {
          targetingType: 'area',
          rangeType: 'ranged',
          rangeDistance: 60,
          aoeShape: 'circle',
          aoeParameters: { radius: 20 },
          targetRestrictions: ['undead', 'demon'],
          description: 'Undead and demons in the zone take radiant damage each round'
        }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 30 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Terra Sancta!',
        somaticText: 'Touch ground with staff'
      },

      resolution: 'DICE',
      effectTypes: ['healing', 'damage', 'utility'],

      healingConfig: {
        formula: '2d8 + spirit',
        healingType: 'hot',
        hasHotEffect: true,
        hotFormula: '2d8',
        hotDuration: 5,
        hotTickType: 'round',
        targetRestrictions: ['ally'],
        description: 'Heals all allies in the zone each round'
      },

      damageConfig: {
        formula: '3d8',
        elementType: 'radiant',
        damageType: 'persistent',
        targetRestrictions: ['undead', 'demon'],
        description: 'Damages undead and demons in the zone each round'
      },

      zoneConfig: {
        duration: 5,
        durationUnit: 'rounds',
        effects: ['healing', 'damage'],
        movable: false
      },

      devotionRequired: 3,
      devotionGain: 2,

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['healing', 'damage', 'zone', 'aoe', 'level 6']
    },

    {
      id: 'martyr_willing_vessel',
      name: 'Willing Vessel',
      description: 'Become a vessel for divine energy. Redirect all ally damage to yourself and gain massive damage reduction.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Force/Force Field',

      typeConfig: {
        school: 'abjuration',
        icon: 'Force/Force Field',
        tags: ['buff', 'protection', 'sacrifice', 'tank', 'level 6'],
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
        resourceValues: { mana: 35 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'Ego Sum Vas!'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'protection',
        effects: [{
          id: 'willing_vessel',
          name: 'Willing Vessel',
          description: 'All ally damage redirects to you. You take 50% reduced damage.',
          mechanicsText: 'All ally damage redirects to you. You take 50% reduced damage.',
          damageReduction: { value: 50, magnitudeType: 'percentage' }
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: false
      },

      devotionRequired: 5,
      devotionGain: 0,

      cooldownConfig: {
        type: 'turn_based',
        value: 6
      },

      tags: ['buff', 'protection', 'sacrifice', 'tank', 'level 6']
    },

    {
      id: 'martyr_redemption_strike',
      name: 'Redemption Strike',
      description: 'Strike an enemy with holy might. The lower your health, the more damage this deals.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Radiant/Divine Downward Sword',

      typeConfig: {
        school: 'evocation',
        icon: 'Radiant/Divine Downward Sword',
        tags: ['damage', 'radiant', 'single target', 'level 6'],
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
        resourceValues: { mana: 25 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Melee weapon strike'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '5d10 + spirit + missing_hp_percentage',
        elementType: 'radiant',
        damageType: 'direct'
      },

      specialMechanics: {
        scalingDamage: {
          description: 'Damage scales with missing health percentage',
          maxBonus: '5d8',
          formula: '+1d8 per 20% missing health'
        }
      },

      devotionRequired: 2,
      devotionGain: 2,

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['damage', 'radiant', 'single target', 'level 6']
    },

    // ========================================
    // LEVEL 7 SPELLS (Minor Ultimates - 5-6 Turn Cooldown)
    // ========================================
    {
      id: 'martyr_mass_resurrection',
      name: 'Mass Restoration',
      description: 'Channel divine energy to restore all fallen allies to consciousness with partial health.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Healing/Ressusitate',

      typeConfig: {
        school: 'necromancy',
        icon: 'Healing/Ressusitate',
        tags: ['healing', 'resurrection', 'aoe', 'ultimate', 'level 7'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: ['ally', 'unconscious']
      },

      resourceCost: {
        resourceTypes: ['mana', 'hp'],
        resourceValues: { mana: 40, hp: 20 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Resurge Omnes!',
        somaticText: 'Raise both arms to sky'
      },

      resolution: 'DICE',
      effectTypes: ['healing'],

      healingConfig: {
        formula: '4d10 + spirit',
        healingType: 'resurrection',
        hasHotEffect: false
      },

      devotionRequired: 5,
      devotionGain: 0,

      cooldownConfig: {
        type: 'turn_based',
        value: 6
      },

      tags: ['healing', 'resurrection', 'aoe', 'ultimate', 'level 7']
    },

    {
      id: 'martyr_guardian_spirit',
      name: 'Guardian Spirit',
      description: 'Place a guardian spirit on an ally. If they would die, the spirit sacrifices itself to restore them.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Radiant/Winged Angel',

      typeConfig: {
        school: 'conjuration',
        icon: 'Radiant/Winged Angel',
        tags: ['buff', 'protection', 'cheat death', 'level 7'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 45 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Spiritus Custos',
        somaticText: 'Draw angel sigil'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'cheat_death',
        effects: [{
          id: 'guardian_spirit',
          name: 'Guardian Spirit',
          description: 'If target would die, restore them to 50% health instead',
          mechanicsText: 'If target would die, restore to 50% HP instead'
        }],
        durationValue: 10,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      devotionRequired: 3,
      devotionGain: 0,

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['buff', 'protection', 'cheat death', 'level 7']
    },

    {
      id: 'martyr_holy_wrath',
      name: 'Holy Wrath',
      description: 'Unleash all accumulated Devotion as radiant damage to all enemies within range. The more Devotion spent, the more devastating the burst.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Sunburst',

      typeConfig: {
        school: 'evocation',
        icon: 'Radiant/Radiant Sunburst',
        tags: ['damage', 'radiant', 'aoe', 'devotion spend', 'level 7'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'devotion'],
        resourceValues: { mana: 35, devotion: 'all' },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'IRA SANCTA!'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '8d8 + devotion_spent * 2',
        elementType: 'radiant',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 17,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2.5,
          extraDice: '4d8',
          critEffects: ['radiant_burn']
        }
      },

      specialMechanics: {
        devotionSpend: {
          description: 'Consumes all accumulated Devotion, channeling every moment of suffering into devastating holy power. The more Devotion you\'ve built through sacrifice, the more devastating the strike becomes, though a minimum threshold must be reached.',
          minimum: 5
        }
      },

      devotionRequired: 5,
      devotionGain: 0,

      cooldownConfig: {
        type: 'turn_based',
        value: 6
      },

      tags: ['damage', 'radiant', 'aoe', 'devotion spend', 'level 7']
    },

    // ========================================
    // LEVEL 8 SPELLS (Minor Ultimates - 6 Turn Cooldown)
    // ========================================
    {
      id: 'martyr_divine_intervention',
      name: 'Divine Intervention',
      description: 'Call upon divine power to completely negate one incoming attack or spell against any ally.',
      level: 8,
      spellType: 'REACTION',
      icon: 'Radiant/Divine Radiance',

      typeConfig: {
        school: 'abjuration',
        icon: 'Radiant/Divine Radiance',
        tags: ['protection', 'reaction', 'negate', 'level 8'],
        castTime: 1,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 50 },
        actionPoints: 0,
        components: ['verbal'],
        verbalText: 'PROHIBERE!'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      specialMechanics: {
        negate: {
          description: 'Completely negates one attack or spell targeting the ally',
          trigger: 'on_ally_targeted'
        }
      },

      devotionRequired: 4,
      devotionGain: 0,

      cooldownConfig: {
        type: 'turn_based',
        value: 6
      },

      tags: ['protection', 'reaction', 'negate', 'level 8']
    },

    {
      id: 'martyr_shared_agony',
      name: 'Mirror of Martyrdom',
      description: 'Link an enemy to yourself through divine retribution. When you take damage, they take the same amount as radiant damage.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Beam',

      typeConfig: {
        school: 'enchantment',
        icon: 'Radiant/Radiant Beam',
        tags: ['debuff', 'damage', 'link', 'radiant', 'level 8'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 45 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Dolor Communis',
        somaticText: 'Create psychic link'
      },

      resolution: 'NONE',
      effectTypes: ['debuff'],

      debuffConfig: {
        debuffType: 'link',
        effects: [{
          id: 'mirror_of_martyrdom',
          name: 'Mirror of Martyrdom',
          description: 'Enemy takes radiant damage equal to damage you take',
          mechanicsText: 'Enemy takes radiant damage equal to damage you take'
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'spirit',
        saveOutcome: 'negates'
      },

      devotionRequired: 3,
      devotionGain: 3,

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['debuff', 'damage', 'link', 'psychic', 'level 8']
    },

    // ========================================
    // LEVEL 9 SPELLS (Major Ultimates - Long Rest)
    // ========================================
    {
      id: 'martyr_avatar_of_sacrifice',
      name: 'Avatar of Sacrifice',
      description: 'Transform into an Avatar of Sacrifice, gaining immense power and the ability to absorb all party damage.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Radiant/Divine Illumination',

      typeConfig: {
        school: 'transmutation',
        icon: 'Radiant/Divine Illumination',
        tags: ['transformation', 'buff', 'protection', 'ultimate', 'level 9'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 60 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'Ego Sum Sacrificium!'
      },

      resolution: 'NONE',
      effectTypes: ['transformation'],

      transformationConfig: {
        transformType: 'divine',
        formName: 'Avatar of Sacrifice',
        formDescription: 'A glowing divine form radiating protective light.',
        duration: 5,
        durationUnit: 'rounds',
        statModifiers: [
          { stat: 'armor', magnitude: 5, magnitudeType: 'flat' },
          { stat: 'maxHp', magnitude: 50, magnitudeType: 'temporary' },
          { stat: 'damageReduction', magnitude: 50, magnitudeType: 'percentage' }
        ],
        specialAbilities: [{
          name: 'Absolute Protection',
          description: 'All ally damage is redirected to you. You cannot be reduced below 1 HP while transformed.'
        }],
        concentrationRequired: false,
        canBeDispelled: false
      },

      devotionRequired: 6,
      devotionGain: 0,

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['transformation', 'buff', 'protection', 'ultimate', 'level 9']
    },

    {
      id: 'martyr_judgment_day',
      name: 'Judgment Day',
      description: 'Call down divine judgment. Heal all allies to full and deal massive damage to all enemies.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Warrior',

      typeConfig: {
        school: 'evocation',
        icon: 'Radiant/Radiant Warrior',
        tags: ['damage', 'healing', 'aoe', 'ultimate', 'level 9'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingMode: 'effect',
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: ['enemy', 'ally']
      },

      effectTargeting: {
        damage: {
          targetingType: 'area',
          rangeType: 'self_centered',
          aoeShape: 'circle',
          aoeParameters: { radius: 40 },
          targetRestrictions: ['enemy']
        },
        healing: {
          targetingType: 'area',
          rangeType: 'self_centered',
          aoeShape: 'circle',
          aoeParameters: { radius: 40 },
          targetRestrictions: ['ally']
        }
      },

      resourceCost: {
        resourceTypes: ['mana', 'hp'],
        resourceValues: { mana: 70, hp: 40 },
        actionPoints: 3,
        components: ['verbal'],
        verbalText: 'DIES IUDICII!'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'healing'],

      damageConfig: {
        formula: '12d10 + spirit * 2',
        elementType: 'radiant',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'spirit',
          difficultyClass: 20,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 3.0,
          extraDice: '6d10',
          critEffects: ['divine_judgment', 'stun']
        }
      },

      healingConfig: {
        formula: 'max_hp',
        healingType: 'full_heal',
        hasHotEffect: false
      },

      devotionRequired: 6,
      devotionGain: 0,

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['damage', 'healing', 'aoe', 'ultimate', 'level 9']
    },

    {
      id: 'martyr_eternal_bond',
      name: 'Eternal Bond',
      description: 'Create unbreakable bonds with all allies. When a linked ally would be reduced to 0 HP, the killing blow is redirected to the Martyr instead.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Force/Force Shield',

      typeConfig: {
        school: 'enchantment',
        icon: 'Force/Force Shield',
        tags: ['buff', 'protection', 'party', 'sacrifice', 'level 9'],
        castTime: 2,
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
        resourceValues: { mana: 80 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Vinculum Aeternum',
        somaticText: 'Connect all allies with light'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'cheat_death',
        effects: [{
          id: 'eternal_bond',
          name: 'Eternal Bond',
          description: 'When a linked ally would be reduced to 0 HP, redirect the killing blow to the Martyr, who takes the damage instead.',
          mechanicsText: 'When a linked ally would be reduced to 0 HP, redirect the killing blow to the Martyr instead'
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'combat',
        concentrationRequired: true,
        canBeDispelled: true
      },

      devotionRequired: 6,
      devotionGain: 0,

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['buff', 'protection', 'party', 'immortality', 'level 9']
    },

    // ========================================
    // LEVEL 10 SPELLS (True Ultimates - Long Rest + Max Devotion)
    // ========================================
    {
      id: 'martyr_ultimate_sacrifice',
      name: 'Ultimate Sacrifice',
      description: 'The ultimate act of martyrdom. Full Sacrifice: reduce yourself to 0 HP to fully resurrect and empower all fallen allies. Partial Sacrifice: sacrifice 50 HP to fully heal all living allies within range.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Healing/Ressusitate',

      typeConfig: {
        school: 'necromancy',
        icon: 'Healing/Ressusitate',
        tags: ['resurrection', 'sacrifice', 'ultimate', 'level 10'],
        castTime: 1,
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
        resourceTypes: ['hp'],
        resourceValues: { hp: 'all' },
        actionPoints: 3,
        components: ['verbal'],
        verbalText: 'SACRIFICIUM ULTIMUM!'
      },

      resolution: 'NONE',
      effectTypes: ['restoration', 'buff'],

      healingConfig: {
        formula: 'max_hp',
        healingType: 'resurrection',
        hasHotEffect: false
      },

      buffConfig: {
        buffType: 'empowerment',
        effects: [{
          id: 'martyrs_blessing',
          name: "Martyr's Blessing",
          description: 'Resurrected allies gain +5 to all stats for 10 rounds',
          statModifier: { stat: 'all_stats', magnitude: 5, magnitudeType: 'flat' },
          mechanicsText: 'Resurrected allies gain +5 to all stats for 10 rounds'
        }],
        durationValue: 10,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      specialMechanics: {
        selfSacrifice: {
          description: 'Full Sacrifice: You are reduced to 0 HP. All dead allies are resurrected at full health with +5 to all stats for 10 rounds.',
          resurrection: true
        },
        partialSacrifice: {
          description: 'Partial Sacrifice: Instead of sacrificing all HP, you may sacrifice 50 HP to fully heal all living allies within range. Does not resurrect fallen allies.',
          hpCost: 50,
          fullHeal: true
        }
      },

      devotionRequired: 6,
      devotionGain: 0,

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['resurrection', 'sacrifice', 'ultimate', 'level 10']
    },

    {
      id: 'martyr_final_blessing',
      name: 'Final Blessing',
      description: "Bestow your final blessing upon allies. They become immune to death for the rest of the encounter. The Martyr takes double damage while this blessing is active.",
      level: 10,
      spellType: 'ACTION',
      icon: 'Radiant/Golden Ring',

      typeConfig: {
        school: 'enchantment',
        icon: 'Radiant/Golden Ring',
        tags: ['buff', 'protection', 'ultimate', 'party', 'sacrifice', 'level 10'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana', 'hp'],
        resourceValues: { mana: 80, hp: 50 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Benedictio Finalis',
        somaticText: 'Grand blessing gesture'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'immortality',
        effects: [{
          id: 'final_blessing',
          name: 'Final Blessing',
          description: 'Allies cannot be reduced below 1 HP for the rest of the encounter. The Martyr takes double damage from all sources while this blessing is active.',
          mechanicsText: 'Allies cannot be reduced below 1 HP for the rest of the encounter. Martyr takes double damage while active',
          damageImmunity: ['lethal']
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'combat',
        concentrationRequired: true,
        canBeDispelled: true
      },

      devotionRequired: 6,
      devotionGain: 0,

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['buff', 'protection', 'ultimate', 'party', 'level 10']
    }

  ]
};
