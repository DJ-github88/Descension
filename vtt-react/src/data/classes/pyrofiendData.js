/**
 * Pyrofiend Class Data
 * 
 * Complete class information for the Pyrofiend - a demonic fire wielder
 * with ascending corruption stages and massive damage potential.
 */

export const PYROFIEND_DATA = {
  id: 'pyrofiend',
  name: 'Pyrofiend',
  icon: 'fas fa-fire',
  role: 'Damage',

  // Overview section
  overview: {
    title: 'The Pyrofiend',
    subtitle: 'Demonic Fire Wielder',
    
    description: `The Pyrofiend is a master of demonic fire magic, channeling infernal power through the dangerous Inferno Veil mechanic. As they cast fire spells, they ascend through increasingly powerful—and perilous—stages of demonic corruption. Each stage amplifies their fire damage but inflicts severe drawbacks inspired by the circles of Dante's Inferno and the seven deadly sins.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Pyrofiends walk a razor's edge between mortal and demon. They have made pacts with infernal entities, trading their humanity for devastating power. In roleplay, Pyrofiends often struggle with their demonic nature—some embrace it fully, reveling in destruction, while others fight to maintain control over the corruption that threatens to consume them.
      
Their connection to hellfire manifests physically: eyes that glow with inner flame, skin that radiates heat, and an aura of sulfur and ash. At higher Inferno Levels, their appearance becomes increasingly demonic—horns may sprout, skin may crack to reveal molten veins, and their voice may echo with infernal resonance.

Common Pyrofiend archetypes include:
- **The Damned Scholar**: Sought forbidden knowledge and paid the price
- **The Vengeful Burned**: Survived a terrible fire and emerged changed
- **The Willing Vessel**: Deliberately sought demonic power for a greater purpose
- **The Cursed Bloodline**: Born with infernal heritage they cannot escape`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Pyrofiend is one of the highest damage dealers in the game, second only to the intentionally unbalanced Chaos Weaver. They excel at:

**Burst Damage**: Ascending to high Inferno Levels unleashes devastating fire damage
**Sustained Pressure**: Burn effects and damage-over-time keep enemies under constant threat  
**Risk-Reward Gameplay**: Managing Inferno Levels creates exciting tactical decisions
**Area Control**: Fire-based AOE spells can control the battlefield

However, this power comes at a cost. The Pyrofiend's drawbacks at high Inferno Levels can be crippling, requiring careful resource management and strategic timing. A Pyrofiend who ascends too quickly may find themselves unable to survive their own power.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Pyrofiend is about managing risk versus reward. Key strategic considerations:

**Inferno Level Management**: 
- Low levels (0-3): Safe, consistent damage
- Mid levels (4-6): High damage with manageable drawbacks
- High levels (7-9): Devastating power but extreme vulnerability

**Timing Your Ascension**: 
- Ascend rapidly for burst damage when you need to eliminate priority targets
- Maintain mid-levels for sustained combat effectiveness
- Use Cooling Ember strategically to descend when drawbacks become too severe

**Specialization Synergies**:
- **Inferno**: Pure damage, aggressive ascension
- **Wildfire**: Spread and area control
- **Hellfire**: Demonic utility and self-sustain

**Team Dynamics**:
- Requires protection from tanks when at high Inferno Levels
- Benefits from healers who can offset self-damage
- Synergizes with crowd control to safely ascend`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Infernal Ascension',
      content: `**The Setup**: You're a Pyrofiend (Inferno specialization) facing a powerful ice elemental and its minions (1 ice elemental + 4 frost wraiths). Your party is with you. Starting Inferno Level: 0. Starting Mana: 60/60. Your goal: Ascend through Inferno Levels to maximize fire damage, but manage the increasingly severe drawbacks.

**Starting State**: Inferno Level: 0/9 | Fire Damage Bonus: +0 | Mana: 60/60 | HP: 45/45

**Turn 1 - First Flames (Inferno: 0 → 2)**

*The ice elemental looms before you, frost radiating from its crystalline form. You feel the demonic fire stirring within. Time to let it OUT.*

**Your Action**: Cast "Hellfire Bolt" at Ice Elemental (8 mana, ascends +2 Inferno)
**Attack Roll**: d20+7 → [16] = Hit!
**Base Damage**: 3d10 fire → [8, 9, 7] = 24 fire damage
**Inferno Bonus**: +0 (currently at Level 0)
**Total Damage**: **24 fire damage**

*The bolt of hellfire SLAMS into the elemental. It recoils, ice cracking.*

**Inferno Ascension**: 0 → **2** (Hellfire Bolt ascends +2)
**Fire Damage Bonus**: +0 → **+2**
**Drawback (Level 2 - Greed)**: "You must collect 50% of all treasure found"

**Mana**: 60 - 8 = 52/60

*You feel the inferno rising within you. Your eyes begin to GLOW with inner fire. Heat radiates from your skin.*

**Your Party's Tank**: "Your eyes... they're glowing!"
**You**: "The fire is waking up. Inferno Level 2. I'm just getting started."

**Current State**: Inferno: 2/9 | Fire Bonus: +2 | Mana: 52/60 | HP: 45/45

**Turn 2 - Rising Heat (Inferno: 2 → 5)**

*The frost wraiths attack, but your tank intercepts. The ice elemental prepares a frost nova. You need MORE POWER.*

**Your Action**: Cast "Infernal Immolation" at Frost Wraith group (12 mana, ascends +3 Inferno, AoE)
**Effect**: 4d8 fire damage to all enemies in 15 ft radius
**Damage Roll**: 4d8 → [7, 8, 6, 7] = 28 fire damage
**Inferno Bonus**: +2 (currently at Level 2)
**Total Damage**: 28 + 2 = **30 fire damage to 4 frost wraiths**

*You raise your hands. INFERNAL FIRE explodes outward in a massive sphere. The wraiths SCREAM as they burn.*

**Frost Wraiths**: 2 wraiths DEAD (30 damage each), 2 wraiths heavily damaged

**Inferno Ascension**: 2 → **5** (Infernal Immolation ascends +3)
**Fire Damage Bonus**: +2 → **+5**
**Drawback (Level 5 - Wrath)**: "You must attack the creature that last damaged you"

**Mana**: 52 - 12 = 40/60

*The fire SURGES through you. Your skin begins to crack, revealing MOLTEN VEINS beneath. Small horns sprout from your forehead. The air around you SHIMMERS with heat.*

**Your Party's Healer**: "You're... changing. Your skin is cracking!"
**You**: "Inferno Level 5. The demon is emerging. +5 fire damage to all my spells now."
**Your Party's Mage**: "But what's the cost?"
**You**: "Wrath. I must attack whoever last hurt me. And greed—I need half the treasure. Small prices for THIS POWER."

*You take 3 damage from a frost wraith's attack*

**Wrath Drawback Triggered**: You MUST attack that frost wraith next turn

**Current State**: Inferno: 5/9 | Fire Bonus: +5 | Mana: 40/60 | HP: 42/45

**Turn 3 - Demonic Fury (Inferno: 5 → 7)**

*The wrath consumes you. You MUST burn the wraith that dared strike you.*

**Your Action (Compelled by Wrath)**: Cast "Hellfire Bolt" at Frost Wraith that damaged you (8 mana, ascends +2)
**Attack Roll**: d20+7 → [18] = Hit!
**Base Damage**: 3d10 fire → [9, 10, 8] = 27 fire damage
**Inferno Bonus**: +5 (currently at Level 5)
**Total Damage**: 27 + 5 = **32 fire damage**

*The wraith EXPLODES in flames, utterly annihilated.*

**Frost Wraith**: DEAD

**Inferno Ascension**: 5 → **7** (Hellfire Bolt ascends +2)
**Fire Damage Bonus**: +5 → **+7**
**Drawback (Level 7 - Gluttony)**: "You must consume 2x normal food/water, take 1d6 damage per turn if you don't"

**Mana**: 40 - 8 = 32/60

*The transformation accelerates. Your horns GROW LARGER. Your eyes are PITS OF FLAME. Sulfurous smoke pours from your mouth. Your voice echoes with INFERNAL RESONANCE.*

**You (voice echoing)**: "INFERNO LEVEL SEVEN. THE DEMON HUNGERS."

**Gluttony Damage**: You haven't eaten recently → Take 1d6 → [4] = 4 damage

**HP**: 42 - 4 = 38/45

**Your Party's Tank**: "You're hurting yourself!"
**You**: "The gluttony... the demon HUNGERS. But look at my damage—+7 fire damage to EVERY spell. That last Hellfire Bolt did 32 damage!"

**Current State**: Inferno: 7/9 | Fire Bonus: +7 | Mana: 32/60 | HP: 38/45

**Turn 4 - Maximum Inferno (Inferno: 7 → 9)**

*Only the ice elemental and one frost wraith remain. The elemental is at 60% HP. You need MAXIMUM POWER.*

**Your Action**: Cast "Demonic Conflagration" at Ice Elemental (15 mana, ascends +2, ultimate fire spell)
**Attack Roll**: d20+7 → [19] = Hit!
**Base Damage**: 6d12 fire → [11, 10, 12, 9, 11, 10] = 63 fire damage
**Inferno Bonus**: +7 (currently at Level 7)
**Total Damage**: 63 + 7 = **70 fire damage!**

*You unleash DEMONIC HELLFIRE. The flames are BLACK and RED, wreathed in sulfur. The ice elemental MELTS, screaming.*

**Ice Elemental**: Takes 70 fire damage → HEAVILY DAMAGED (near death)

**Inferno Ascension**: 7 → **9** (MAXIMUM INFERNO)
**Fire Damage Bonus**: +7 → **+10** (maximum)
**Drawback (Level 9 - Pride)**: "You cannot accept help from allies, must fight alone"

**Mana**: 32 - 15 = 17/60

*You have reached MAXIMUM INFERNO. You are MORE DEMON THAN MORTAL. Massive horns curl from your head. Your skin is CRACKED OBSIDIAN revealing LAVA beneath. Wings of SHADOW and FLAME spread from your back. Your voice is PURELY DEMONIC.*

**You (demonic voice)**: "I AM BECOME INFERNO. WITNESS TRUE POWER."

**Your Party's Healer**: "I need to heal you—you're at 38 HP!"
**You**: "NO. Pride forbids it. I fight ALONE now. But I have +10 fire damage. MAXIMUM POWER."

**Gluttony Damage**: 1d6 → [5] = 5 damage
**HP**: 38 - 5 = 33/45

**Current State**: Inferno: 9/9 (MAX) | Fire Bonus: +10 | Mana: 17/60 | HP: 33/45

**Turn 5 - The Price of Power**

*You are at maximum inferno. +10 fire damage. But you're taking 5 damage per turn from gluttony, you can't accept healing from allies (pride), you must attack whoever hurts you (wrath), and you need half the treasure (greed).*

**Ice Elemental's Turn**: Casts Frost Nova at you → 18 cold damage
**HP**: 33 - 18 = 15/45

**Wrath Triggered**: You MUST attack the ice elemental next turn (fortunately, that's your target anyway)

**Your Action**: Cast "Hellfire Bolt" at Ice Elemental (8 mana, ascends +2 but already at max)
**Attack Roll**: d20+7 → [17] = Hit!
**Base Damage**: 3d10 fire → [8, 9, 10] = 27 fire damage
**Inferno Bonus**: +10 (MAXIMUM)
**Total Damage**: 27 + 10 = **37 fire damage!**

*BLACK HELLFIRE engulfs the elemental. It SHATTERS into steam and ice shards.*

**Ice Elemental**: DEAD

**Mana**: 17 - 8 = 9/60

**Your Party's Rogue**: Kills last frost wraith

**Combat Over**

*You stand among the melted remains, wings of shadow-flame spread wide, eyes blazing. Then you cast Cooling Ember.*

**Your Action (After Combat)**: Cast "Cooling Ember" (5 mana, descends -3 Inferno)
**Inferno Descent**: 9 → **6**
**Fire Damage Bonus**: +10 → **+6**
**Drawbacks Removed**: Pride removed (can accept help again)

**Mana**: 9 - 5 = 4/60

*The demonic transformation begins to RECEDE. Your wings fade. Your horns shrink. The cracks in your skin seal. You're still partially demonic (Level 6), but no longer at the dangerous maximum.*

**Your Party's Healer**: Heals you for 20 HP
**HP**: 15 + 20 = 35/45

**Your Party's Tank**: "That was... terrifying. You did 70 damage in one hit."
**You**: "Demonic Conflagration with +7 fire damage at Inferno Level 7. Then I ascended to Level 9—maximum inferno. At Level 9, I had +10 fire damage. My Hellfire Bolt did 37 damage."
**Your Party's Mage**: "But you were taking damage every turn and couldn't accept healing."
**You**: "The drawbacks. Level 2 was greed (need half the treasure). Level 5 was wrath (must attack whoever hurts me). Level 7 was gluttony (take 1d6 damage per turn). Level 9 was pride (can't accept help). Each level gives +1 fire damage but adds a drawback."
**Your Party's Healer**: "And Cooling Ember?"
**You**: "Descends me -3 Inferno Levels. I went from 9 to 6, removing the pride drawback so you could heal me. I'm still at Level 6, so I still have greed, wrath, and gluttony, but I can manage those."

**Final State**: Inferno: 6/9 | Fire Bonus: +6 | Mana: 4/60 | HP: 35/45

**The Lesson**: Pyrofiend gameplay is about:
1. **Inferno Ascension**: Started at Level 0, ascended to Level 9 (maximum) through fire spells
2. **Damage Scaling**: Level 0 (+0) → Level 2 (+2) → Level 5 (+5) → Level 7 (+7) → Level 9 (+10)
3. **Spell Damage**: Hellfire Bolt at Level 0 = 24 damage, at Level 9 = 37 damage (+13 damage!)
4. **Ultimate Power**: Demonic Conflagration with +7 bonus = 70 damage in one hit
5. **Drawback Management**: Level 2 (greed), Level 5 (wrath), Level 7 (gluttony), Level 9 (pride)
6. **Self-Damage**: Gluttony dealt 4 + 5 = 9 damage over 2 turns
7. **Cooling Ember**: Descended from 9 → 6 to remove pride, allowing healing

You're the SECOND-HIGHEST DAMAGE CLASS in the game. You ascend through Inferno Levels, each one adding +1 fire damage but imposing thematic drawbacks (greed, wrath, gluttony, pride). At Level 9, you're MORE DEMON THAN MORTAL—+10 fire damage, massive horns, wings of flame, but you can't accept help and you're taking damage every turn. The key is knowing when to ascend for burst damage and when to use Cooling Ember to descend and manage drawbacks. You're not a safe class. You're a DEMONIC GLASS CANNON who trades humanity for DEVASTATING POWER.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Inferno Veil',
    subtitle: 'Demonic Ascension Mechanic',
    
    description: `The Inferno Veil is the Pyrofiend's unique resource system. It represents the character's descent into demonic corruption, with each level granting increased fire damage but inflicting thematic drawbacks based on the circles of Hell and the seven deadly sins.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**Starting State**: All Pyrofiends begin combat at Inferno Level 0

**Ascending**: Many fire spells cause you to ascend 1-3 Inferno Levels when cast
**Descending**: The Cooling Ember spell and certain abilities reduce your Inferno Level
**Maximum Level**: Inferno Level 9 is the maximum—attempting to ascend further has no effect
**Level Persistence**: Your Inferno Level persists between combats unless you rest or use abilities to reduce it

**Damage Bonus**: At each Inferno Level, you gain bonus fire damage to ALL fire spells:
- Level 1: +1 fire damage
- Level 2: +2 fire damage
- Level 3: +3 fire damage
- ...continuing up to...
- Level 9: +10 fire damage

**Drawbacks**: Each level also inflicts increasingly severe penalties (see table below)`
    },
    
    infernoLevelsTable: {
      title: 'Inferno Veil: Level Effects',
      headers: ['Level', 'Fire Damage Bonus', 'Drawback', 'Thematic Inspiration'],
      rows: [
        ['0', '+0', 'None', 'Mortal State'],
        ['1', '+1', 'Minor visual distortions reduce hit chance by 2', 'Limbo - Flickering Flames'],
        ['2', '+2', 'Lustful intensity: 1d4 psychic damage per turn', 'Lust - Distracting Heat'],
        ['3', '+3', 'Oppressive heat: -10 ft movement, constant fatigue', 'Gluttony - Heavy Rain'],
        ['4', '+4', 'Molten veins: +2d6 damage taken from all attacks', 'Greed - Weight of Gold'],
        ['5', '+5', 'Body cracks: 1d6 bleeding per turn, weakened defenses', 'Wrath - River Styx'],
        ['6', '+6', 'Blazing eyes: Disadvantage on sight-based checks/attacks', 'Heresy - Uncontrollable Fire'],
        ['7', '+7', 'Scorching breath: -15 ft speed, 1d6 suffocation per turn', 'Violence - Burning Sand'],
        ['8', '+8', 'Wreathed in flames: 2d4 self-damage per turn, disadvantage on Dex checks', 'Fraud - Raging Flames'],
        ['9', '+10', 'Engulfed: 4d8 self-damage per turn, death in 3 turns if not extinguished, disadvantage on all saves', 'Treachery - Frozen in Fire']
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Level 0-3 (Safe Zone)**: Minimal drawbacks, good for sustained combat
**Level 4-6 (Power Zone)**: High damage with manageable risks, optimal for most encounters
**Level 7-9 (Danger Zone)**: Extreme power but life-threatening drawbacks, use only for critical moments

**Cooling Ember**: Your primary tool for managing Inferno Levels. Reduces levels by 1d4 and heals you for 1d6 per level reduced. Use it when:
- Drawbacks become too severe
- Combat is ending and you want to reset
- You need emergency healing
- You're about to enter a dangerous situation at high levels`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `The Inferno Veil system is elegantly simple to track at the physical table, requiring only a single die and optional reference materials. Here's how to manage your demonic ascension without digital tools:

**Required Materials**:
- **1d10 die** (ten-sided die numbered 0-9)
- **Reference card** with Inferno Level effects (optional but recommended)
- **Damage tracking method** (standard HP tracking)

**The d10 Tracker Method** (Recommended):

Place a d10 in front of you with the current number facing up to represent your Inferno Level:
- **Start of combat**: Set the die to 0
- **When you ascend**: Rotate the die to the new level (e.g., from 3 to 6 after casting a spell that ascends by 3)
- **When you descend**: Rotate the die down (e.g., from 7 to 4 after Cooling Ember reduces by 3)
- **Between combats**: Leave the die at your current level (Inferno persists unless you rest)

**Why d10 Works Perfectly**: The Inferno Veil has exactly 10 levels (0-9), making a d10 the perfect physical representation. Simply rotate the die to show your current level—no math, no tracking sheets, just a quick glance at the die tells you everything.

**Quick Reference Card Template**:
\`\`\`
PYROFIEND INFERNO VEIL TRACKER
Current Level: [d10 showing ___]

DAMAGE BONUSES:
Level 0: +0    Level 5: +5
Level 1: +1    Level 6: +6
Level 2: +2    Level 7: +7
Level 3: +3    Level 8: +8
Level 4: +4    Level 9: +10

ZONES:
0-3: Safe Zone (minimal drawbacks)
4-6: Power Zone (high damage, manageable risk)
7-9: Danger Zone (extreme power, life-threatening)

DRAWBACK REMINDERS:
[Print the drawback table on the back]
\`\`\`

**Alternative Tracking Methods**:

1. **Token/Counter Method**: Use a numbered counter or slider (0-9) to track your level
2. **Paper Method**: Write your current level on a piece of paper and update it as needed
3. **Poker Chip Stack**: Stack chips to represent your level (0 chips = Level 0, 9 chips = Level 9)
4. **Spindown Die**: Use a spindown d20 but only track 0-9

**Managing Drawbacks**:

Keep the Inferno Levels table visible (printed card or phone photo) so you can quickly reference your current drawback. The GM and other players should also have access to this table to help track your penalties.

**Common Drawback Reminders**:
- **Levels 1-3**: Minor penalties (hit chance, psychic damage, movement)
- **Levels 4-6**: Moderate penalties (extra damage taken, bleeding, AC reduction, disadvantage)
- **Levels 7-9**: Severe penalties (suffocation, self-damage, death timer)

**Example In-Person Turn**:

*Your d10 is currently showing 4 (Inferno Level 4)*

1. **Your Turn**: "I cast Infernal Blast, which ascends me by 3 levels"
2. **Rotate d10**: Turn the die from 4 to 7
3. **Apply Bonus**: "My fire damage gets +7 from Inferno Level 7"
4. **Note Drawback**: "I now have the Level 7 drawback: -15 ft speed and 1d6 suffocation damage per turn"
5. **GM Reminder**: The GM notes your new speed and applies suffocation damage at the start of your next turn

**Cooling Ember Example**:

*Your d10 is showing 7 (Inferno Level 7)*

1. **Cast Cooling Ember**: "I'm casting Cooling Ember to reduce my Inferno Level"
2. **Roll Reduction**: Roll 1d4 → Result: 3
3. **Rotate d10**: Turn the die from 7 to 4 (reduced by 3)
4. **Healing**: Roll 3d6 for healing (1d6 per level reduced)
5. **Update Status**: "I'm now at Level 4, and I healed for [3d6 result]"

**Visual Cues for Roleplay**:

Many players enhance the experience by adding thematic elements:
- **Red/orange die**: Use a fire-colored d10 to represent the infernal theme
- **Flame token**: Place a small flame marker next to your d10 when at Level 4+
- **Danger marker**: Add a skull token when you reach Level 7+ (Danger Zone)
- **Sound effects**: Some groups enjoy adding flame sound effects when ascending to high levels

**Why This System Works**: The Inferno Veil is intentionally designed to be simple to track physically. Unlike complex resource systems that require multiple trackers, you only need to know one number: your current level. The d10 makes this instant and tactile—you can feel the weight of ascending as you rotate the die higher, and the relief of descending when you turn it back down. The physical act of rotating the die mirrors the narrative of your character's descent into demonic corruption and their struggle to maintain control.`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Pyrofiend Specializations',
    subtitle: 'Three Paths of Infernal Power',
    
    description: `Every Pyrofiend chooses one of three specializations that define their approach to demonic fire magic. Each specialization offers unique passive abilities and influences your spell selection and playstyle.`,
    
    specs: [
      {
        id: 'inferno',
        name: 'Inferno',
        icon: 'spell_fire_fireball02',
        color: '#FF4500',
        theme: 'Pure Destruction',
        
        description: `The Inferno specialization embodies raw, uncontrolled demonic fire. Inferno Pyrofiends are the most aggressive, ascending rapidly and dealing maximum burst damage. They embrace the corruption fully, using it as a weapon.`,
        
        playstyle: 'Aggressive burst damage, rapid ascension, high-risk high-reward',
        
        strengths: [
          'Highest single-target burst damage',
          'Fastest Inferno Level ascension',
          'Powerful execute abilities at high levels',
          'Bonus damage when above Inferno Level 5'
        ],
        
        weaknesses: [
          'Most vulnerable to drawbacks',
          'Limited defensive options',
          'Requires careful timing',
          'Struggles in prolonged fights'
        ],
        
        passiveAbilities: [
          {
            name: 'Infernal Surge',
            tier: 'Path Passive',
            description: 'When you ascend to Inferno Level 5 or higher, your next fire spell deals an additional 2d6 fire damage.',
            sharedBy: 'All Pyrofiends'
          },
          {
            name: 'Burning Ambition',
            tier: 'Specialization Passive',
            description: 'While at Inferno Level 7 or higher, your fire spells crit on the 2 highest die numbers instead of just the highest, and critical hits deal an additional 1d10 fire damage.',
            uniqueTo: 'Inferno'
          }
        ],
        
        recommendedFor: 'Players who enjoy high-risk gameplay, burst damage, and aggressive tactics'
      },
      
      {
        id: 'wildfire',
        name: 'Wildfire',
        icon: 'spell_fire_flameshock',
        color: '#FF8C00',
        theme: 'Spreading Chaos',
        
        description: `Wildfire Pyrofiends specialize in spreading flames across multiple targets. Their fire jumps from enemy to enemy, creating cascading infernos that consume entire groups. They balance ascension with area control.`,
        
        playstyle: 'Area damage, damage-over-time effects, battlefield control',
        
        strengths: [
          'Excellent multi-target damage',
          'Strong damage-over-time effects',
          'Fire spreads between enemies',
          'Better sustained damage than Inferno'
        ],
        
        weaknesses: [
          'Lower single-target burst',
          'Requires enemy grouping',
          'DoT effects take time',
          'Less effective against single bosses'
        ],
        
        passiveAbilities: [
          {
            name: 'Infernal Surge',
            tier: 'Path Passive',
            description: 'When you ascend to Inferno Level 5 or higher, your next fire spell deals an additional 2d6 fire damage.',
            sharedBy: 'All Pyrofiends'
          },
          {
            name: 'Wildfire Spread',
            tier: 'Specialization Passive',
            description: 'When an enemy affected by your burn effect dies, the burn spreads to all enemies within 10 feet, dealing 2d6 fire damage and applying a new burn effect (1d6 fire damage per turn for 3 turns).',
            uniqueTo: 'Wildfire'
          }
        ],
        
        recommendedFor: 'Players who enjoy area control, damage-over-time builds, and tactical positioning'
      },
      
      {
        id: 'hellfire',
        name: 'Hellfire',
        icon: 'spell_shadow_shadowwordpain',
        color: '#8B0000',
        theme: 'Demonic Resilience',
        
        description: `Hellfire Pyrofiends embrace their demonic nature, gaining dark powers beyond mere fire. They convert damage into healing, summon infernal minions, and use demonic magic to sustain themselves through the Inferno Veil's drawbacks.`,
        
        playstyle: 'Self-sustain, demonic utility, balanced ascension',
        
        strengths: [
          'Best survivability of all specs',
          'Healing from damage dealt',
          'Demonic utility spells',
          'Can maintain high Inferno Levels longer'
        ],
        
        weaknesses: [
          'Lowest raw damage output',
          'More complex resource management',
          'Requires strategic spell selection',
          'Less burst damage than Inferno'
        ],
        
        passiveAbilities: [
          {
            name: 'Infernal Surge',
            tier: 'Path Passive',
            description: 'When you ascend to Inferno Level 5 or higher, your next fire spell deals an additional 2d6 fire damage.',
            sharedBy: 'All Pyrofiends'
          },
          {
            name: 'Demonic Vitality',
            tier: 'Specialization Passive',
            description: 'You heal for 25% of all fire damage you deal. Additionally, when you descend Inferno Levels (through Cooling Ember or other means), you gain temporary hit points equal to 3 times the number of levels descended.',
            uniqueTo: 'Hellfire'
          }
        ],
        
        recommendedFor: 'Players who want survivability, self-sufficiency, and a more forgiving playstyle'
      }
    ]
  },

  // Spell Pools - organized by character level
  // Maps character level to available spell IDs for learning
  spellPools: {
    1: [
      // Level 1 starting spells (pick 3)
      'pyro_ember_spark',
      'pyro_smoldering_touch',
      'pyro_flicker',
      'pyro_cooling_ember',
      'pyro_heat_shield'
    ],
    2: [
      // Level 2 spells
      'pyro_scorching_grasp',
      'pyro_flame_lash',
      'pyro_cinder_bolt'
    ],
    3: [
      // Level 3 spells
      'pyro_fireball',
      'pyro_burning_hands',
      'pyro_flame_step'
    ],
    4: [
      // Level 4 spells
      'pyro_infernal_blast',
      'pyro_searing_ray',
      'pyro_fiery_aura'
    ],
    5: [
      // Level 5 spells
      'pyro_hellfire_wave',
      'pyro_immolation',
      'pyro_fire_whip'
    ],
    6: [
      // Level 6 spells
      'pyro_lava_burst',
      'pyro_flame_storm',
      'pyro_infernal_brand_advanced'
    ],
    7: [
      // Level 7 spells
      'pyro_volcanic_eruption',
      'pyro_hellfire_breath',
      'pyro_demonic_empowerment'
    ],
    8: [
      // Level 8 spells
      'pyro_meteor_shower',
      'pyro_infernal_nova',
      'pyro_phoenix_flame'
    ],
    9: [
      // Level 9 spells
      'pyro_infernal_avatar',
      'pyro_apocalypse',
      'pyro_hellfire_ritual'
    ],
    10: [
      // Level 10 spells
      'pyro_brimstone_teleport',
      'pyro_demonic_ascension',
      'pyro_inferno_mastery'
    ]
  },

  // Spells - organized by level, properly formatted for wizard
  spells: [
    // ========================================
    // LEVEL 1 STARTING SPELLS (5 options, pick 3)
    // Weak starter spells - intentionally low power
    // ========================================
    {
      id: 'pyro_ember_spark',
      name: 'Ember Spark',
      description: 'You channel a tiny fragment of demonic fire, feeling the infernal energy course through your veins as your Inferno Level rises. A small, malevolent spark forms at your fingertips—it glows with an unnatural red-orange light that seems to pulse with dark intent. When you launch it forward, the spark streaks through the air like a tiny comet, leaving a trail of black smoke in its wake. Upon impact, the spark doesn\'t just burn—it burrows into the target\'s flesh, where it continues to smolder and burn with demonic fire. The flames are persistent and hungry, refusing to be extinguished easily. Each time the fire flares up, it causes fresh pain as the demonic energy continues to consume the target from within.',
      level: 1,
      spellType: 'ACTION',
      icon: 'spell_fire_flamebolt',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_flamebolt',
        tags: ['fire', 'damage', 'dot', 'starter'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 3, inferno_ascend: 1, inferno_required: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Ignis Daemonis!',
        somaticText: 'Snap fingers together, a malevolent red-orange spark forming and launching forward'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d3',
        elementType: 'fire',
        damageType: 'direct',
        hasDotEffect: true,
        dotConfig: {
          duration: 2,
          tickFrequency: 'round',
          dotFormula: '1d4',
          isProgressiveDot: false,
          description: 'The demonic spark continues to burn within the target\'s flesh, causing persistent pain as the infernal fire refuses to be extinguished. Each flare-up brings fresh agony as the dark flames consume tissue and spread deeper.'
        },
        description: 'The ember spark strikes with immediate heat, causing instant burns as it burrows into the target. The demonic fire feels different from normal flames—it burns with a cold heat that seems to consume the very essence of life.'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'damage', 'dot', 'starter']
    },

    {
      id: 'pyro_smoldering_touch',
      name: 'Smoldering Touch',
      description: 'Your hand glows with heat as you touch an enemy, dealing instant damage and leaving a lingering smolder.',
      level: 1,
      spellType: 'ACTION',
      icon: 'spell_fire_firebolt',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_firebolt',
        tags: ['fire', 'damage', 'touch', 'dot', 'starter'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 5, inferno_ascend: 1, inferno_required: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Ardeo!',
        somaticText: 'Touch with glowing hand'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d4 + intelligence/3',
        elementType: 'fire',
        damageType: 'direct',
        hasDotEffect: true,
        dotConfig: {
          duration: 1,
          tickFrequency: 'round',
          dotFormula: '1',
          isProgressiveDot: false
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'damage', 'touch', 'dot', 'starter']
    },

    {
      id: 'pyro_flicker',
      name: 'Flicker',
      description: 'A quick flash of fire that streaks toward your target. The flame is small but precise, igniting instantly and leaving a trail of heat in its wake. A basic spell perfect for quick attacks.',
      level: 1,
      spellType: 'ACTION',
      icon: 'spell_fire_sealoffire',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_sealoffire',
        tags: ['fire', 'damage', 'starter'],
        castTime: 0,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 2, inferno_ascend: 1, inferno_required: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'Flicker!'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d3 + intelligence/4',
        elementType: 'fire',
        damageType: 'direct'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'damage', 'starter']
    },

    {
      id: 'pyro_cooling_ember',
      name: 'Cooling Ember',
      description: 'A calming spell that soothes the infernal fire raging within you. The cooling ember draws away excess heat, restoring your body and helping you maintain control over your demonic corruption. Essential for managing the dangerous power you wield.',
      level: 1,
      spellType: 'ACTION',
      icon: 'spell_fire_twilightflamebreath',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_twilightflamebreath',
        tags: ['fire', 'healing', 'utility', 'starter'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_descend', 'inferno_required'],
        resourceValues: { mana: 5, inferno_descend: 2, inferno_required: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Pax Ignis',
        somaticText: 'Place hand over heart'
      },

      resolution: 'DICE',
      effectTypes: ['healing'],

      healingConfig: {
        formula: '1d6 + spirit/3',
        healingType: 'direct',
        hasHotEffect: false
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'healing', 'utility', 'starter']
    },

    {
      id: 'pyro_heat_shield',
      name: 'Heat Shield',
      description: 'Create a barrier of heat around yourself. The shimmering air distorts vision as waves of heat radiate outward, absorbing and dispersing incoming attacks. The shield glows with inner fire, protecting you from harm.',
      level: 1,
      spellType: 'ACTION',
      icon: 'spell_shadow_antishadow',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_shadow_antishadow',
        tags: ['fire', 'buff', 'defensive', 'starter'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_descend', 'inferno_required'],
        resourceValues: { mana: 6, inferno_descend: 1, inferno_required: 1 },  // Heat Shield - minor descend
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Scutum Calor!',
        somaticText: 'Raise hands to create barrier'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'heat_shield_damage_reduction',
          name: 'Heat Shield',
          description: 'The heat shield absorbs and disperses incoming attacks, reducing the damage that reaches you. The shimmering barrier glows brighter as it absorbs more energy.',
          statModifier: {
            stat: 'damage_reduction',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'buff', 'defensive', 'starter']
    },

    // ========================================
    // LEVEL 2 SPELLS
    // ========================================
    {
      id: 'pyro_scorching_grasp',
      name: 'Scorching Grasp',
      description: 'Flames envelop your hand as you reach for your enemy. The searing heat burns through armor and flesh on contact, leaving scorched marks where your hand touches. The fire clings to the target, continuing to burn.',
      level: 2,
      spellType: 'ACTION',
      icon: 'spell_fire_flameshock',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_flameshock',
        tags: ['fire', 'damage', 'touch'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 8, inferno_ascend: 1, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Ardeo!',
        somaticText: 'Grasp with burning hand'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d8 + intelligence/2',
        elementType: 'fire',
        damageType: 'direct'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'damage', 'touch']
    },

    {
      id: 'pyro_flame_lash',
      name: 'Flame Lash',
      description: 'A whip of fire lashes out, pulling your enemy closer while burning them.',
      level: 2,
      spellType: 'ACTION',
      icon: 'spell_fire_flare',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_flare',
        tags: ['fire', 'damage', 'control'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 10, inferno_ascend: 1, inferno_required: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Flagellum Ignis!',
        somaticText: 'Whip hand forward'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '1d6 + intelligence/3',
        elementType: 'fire',
        damageType: 'direct'
      },

      controlConfig: {
        controlType: 'forcedMovement',
        strength: 'weak',
        duration: 0,
        durationUnit: 'instant',
        saveDC: 12,
        saveType: 'strength',
        saveOutcome: 'negates',
        savingThrow: true,
        effects: [{
          id: 'pull',
          name: 'Pull',
          description: 'Pulls the target toward the caster',
          config: {
            movementType: 'pull',
            distance: 15
          }
        }]
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'damage', 'control']
    },

    {
      id: 'pyro_cinder_bolt',
      name: 'Cinder Bolt',
      description: 'A bolt of cinders that explodes on impact, dealing fire damage in a small area.',
      level: 2,
      spellType: 'ACTION',
      icon: 'spell_fire_fireball',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_fireball',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 5 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 12, inferno_ascend: 2, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Cinis Sagitta!',
        somaticText: 'Hurl cinder bolt'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d6 + intelligence',
        elementType: 'fire',
        damageType: 'direct'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'damage', 'aoe']
    },

    // ========================================
    // LEVEL 3 SPELLS
    // ========================================
    {
      id: 'pyro_fireball',
      name: 'Fireball',
      description: 'A classic explosive ball of fire that detonates on impact, damaging all nearby enemies.',
      level: 3,
      spellType: 'ACTION',
      icon: 'spell_fire_fireball02',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_fireball02',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 100,
        aoeShape: 'sphere',
        aoeParameters: { radius: 10 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 18, inferno_ascend: 2, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Ignis Globus!',
        somaticText: 'Hurl ball of flame'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d6 + intelligence',
        elementType: 'fire',
        damageType: 'direct',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          critEffects: ['burning'],
          burningConfig: {
            damagePerRound: '1d6',
            duration: 2,
            durationUnit: 'rounds',
            saveDC: 15,
            saveType: 'constitution'
          }
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'pyro_burning_hands',
      name: 'Burning Hands',
      description: 'A cone of fire erupts from your hands, scorching enemies in front of you.',
      level: 3,
      spellType: 'ACTION',
      icon: 'spell_fire_flamebolt',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_flamebolt',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'cone',
        aoeParameters: { length: 20 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 15, inferno_ascend: 2, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Manus Ardens!',
        somaticText: 'Spread fingers wide'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d8 + intelligence',
        elementType: 'fire',
        damageType: 'direct',
        chanceOnHitConfig: {
          enabled: true,
          procType: 'dice',
          diceThreshold: 17,
          procChance: 20,
          customEffects: ['burning'],
          burningConfig: {
            damagePerRound: '1d4',
            duration: 2,
            durationUnit: 'rounds',
            saveDC: 14,
            saveType: 'constitution'
          }
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'pyro_flame_step',
      name: 'Flame Step',
      description: 'Teleport a short distance in a burst of fire, leaving flames at your departure and arrival points.',
      level: 3,
      spellType: 'ACTION',
      icon: 'ability_mage_firestarter',
      
      typeConfig: {
        school: 'fire',
        icon: 'ability_mage_firestarter',
        tags: ['fire', 'utility', 'teleport'],
        castTime: 0,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 12, inferno_ascend: 1, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 1,  // Utility spell
        components: ['verbal'],
        verbalText: 'Saltus Ignis!'
      },

      resolution: 'DICE',
      effectTypes: ['utility', 'damage'],

      utilityConfig: {
        utilityType: 'Teleport',
        selectedEffects: [{
          id: 'teleport',
          name: 'Teleport',
          distance: 30,
          needsLineOfSight: true
        }],
        duration: 0,
        durationUnit: 'instant',
        concentration: false,
        power: 'minor'
      },

      damageConfig: {
        formula: '1d6',
        elementType: 'fire',
        damageType: 'area',
        triggerCondition: 'area_entry',
        triggerDescription: 'Creatures that enter or start their turn in flame areas take 1d6 fire damage',
        areaShape: 'circle',
        areaParameters: { radius: 5 },
        duration: 1,
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['fire', 'utility', 'teleport']
    },

    // ========================================
    // LEVEL 4 SPELLS
    // ========================================
    {
      id: 'pyro_infernal_blast',
      name: 'Infernal Blast',
      description: 'A concentrated blast of demonic fire that erupts from your hands. The infernal energy burns with intense heat, searing through defenses and leaving nothing but ash in its wake. The blast is focused and devastating.',
      level: 4,
      spellType: 'ACTION',
      icon: 'spell_fire_incinerate',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_incinerate',
        tags: ['fire', 'damage'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 80,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 20, inferno_ascend: 2, inferno_required: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Infernus Ictus!',
        somaticText: 'Thrust palm forward'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '4d6 + intelligence * 1.5',
        elementType: 'fire',
        damageType: 'direct'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'damage']
    },

    {
      id: 'pyro_searing_ray',
      name: 'Searing Ray',
      description: 'A focused ray of intense heat that burns through your target.',
      level: 4,
      spellType: 'ACTION',
      icon: 'spell_fire_flameshock',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_flameshock',
        tags: ['fire', 'damage'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 90,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 18, inferno_ascend: 2, inferno_required: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Radius Ardens!',
        somaticText: 'Point finger'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d8 + intelligence',
        elementType: 'fire',
        damageType: 'direct'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'damage']
    },

    {
      id: 'pyro_fiery_aura',
      name: 'Fiery Aura',
      description: 'Surround yourself with an aura of heat that damages nearby enemies.',
      level: 4,
      spellType: 'CHANNELED',
      icon: 'spell_fire_masterofelements',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_masterofelements',
        tags: ['fire', 'damage', 'buff'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 22, inferno_ascend: 2, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Aura Ignis!',
        somaticText: 'Spread arms wide'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_masterofelements',
        tags: ['fire', 'damage', 'channeled'],
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        maxChannelDuration: 3,
        durationUnit: 'ROUNDS',
        interruptible: true,
        movementAllowed: true,
        tickFrequency: 'START_OF_TURN'
      },

      damageConfig: {
        formula: '1d6',
        elementType: 'fire',
        damageType: 'area',
        triggerCondition: 'area_entry',
        triggerDescription: 'Enemies within 5 feet take 1d6 fire damage at the start of each of their turns',
        areaShape: 'circle',
        areaParameters: { radius: 5 }
      },

      channelingConfig: {
        type: 'persistent',
        baseFormula: '1d6',
        tickFrequency: 'round',
        maxDuration: 3
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'buff']
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    {
      id: 'pyro_hellfire_wave',
      name: 'Hellfire Wave',
      description: 'A wave of hellish fire sweeps over your enemies, burning them intensely.',
      level: 5,
      spellType: 'ACTION',
      icon: 'spell_fire_sealoffire',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_sealoffire',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'cone',
        aoeParameters: { length: 30 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 25, inferno_ascend: 2, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Infernus Unda!',
        somaticText: 'Sweep arms forward'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '4d8 + intelligence * 1.5',
        elementType: 'fire',
        damageType: 'direct'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'pyro_immolation',
      name: 'Immolation',
      description: 'Engulf your target in flames that burn over time.',
      level: 5,
      spellType: 'ACTION',
      icon: 'spell_fire_immolation',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_immolation',
        tags: ['fire', 'damage', 'dot'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 28, inferno_ascend: 3, inferno_required: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Immolatio!',
        somaticText: 'Clench fist'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d8 + intelligence/2',
        elementType: 'fire',
        damageType: 'dot',
        hasDotEffect: true,
        dotConfig: {
          duration: 3,
          tickFrequency: 'round',
          dotFormula: '1d6 + intelligence/4',
          isProgressiveDot: false
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'damage', 'dot']
    },

    {
      id: 'pyro_fire_whip',
      name: 'Fire Whip',
      description: 'A whip of pure fire lashes out, dealing damage and potentially stunning your target.',
      level: 5,
      spellType: 'ACTION',
      icon: 'spell_fire_flare',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_flare',
        tags: ['fire', 'damage'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 24, inferno_ascend: 2, inferno_required: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Flagellum Infernus!',
        somaticText: 'Crack whip motion'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d6 + intelligence',
        elementType: 'fire',
        damageType: 'direct',
        chanceOnHitConfig: {
          enabled: true,
          procType: 'dice',
          diceThreshold: 18,
          procChance: 15,
          customEffects: ['stun'],
          stunConfig: {
            duration: 1,
            durationUnit: 'round',
            saveDC: 14,
            saveType: 'constitution'
          }
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 14,
          saveOutcome: 'negates',
          partialEffect: false
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['fire', 'damage']
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    {
      id: 'pyro_lava_burst',
      name: 'Lava Burst',
      description: 'A burst of molten lava erupts from the ground, dealing massive damage in an area.',
      level: 6,
      spellType: 'ACTION',
      icon: 'spell_shaman_lavaburst',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_shaman_lavaburst',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 80,
        aoeShape: 'circle',
        aoeParameters: { radius: 15 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 32, inferno_ascend: 3, inferno_required: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Terra Ignea!',
        somaticText: 'Slam fist downward',
        materialComponents: 'A piece of volcanic rock'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '6d6 + intelligence * 2',
        elementType: 'fire',
        damageType: 'direct',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          critEffects: ['burning'],
          burningConfig: {
            damagePerRound: '1d6',
            duration: 2,
            durationUnit: 'rounds',
            saveDC: 15,
            saveType: 'constitution'
          }
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'pyro_flame_storm',
      name: 'Flame Storm',
      description: 'Create a swirling storm of fire that damages all enemies in a large area over time.',
      level: 6,
      spellType: 'ACTION',
      icon: 'spell_fire_fireball02',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_fireball02',
        tags: ['fire', 'damage', 'aoe', 'dot'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 100,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 35, inferno_ascend: 2, inferno_required: 4 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Tempestas Ignis!',
        somaticText: 'Raise arms and swirl'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d8 + intelligence',
        elementType: 'fire',
        damageType: 'dot',
        hasDotEffect: true,
        dotConfig: {
          duration: 3,
          tickFrequency: 'round',
          dotFormula: '2d6 + intelligence/2',
          isProgressiveDot: false
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['fire', 'damage', 'aoe', 'dot']
    },

    {
      id: 'pyro_infernal_brand_advanced',
      name: 'Infernal Brand (Advanced)',
      description: 'Mark your enemy with a burning brand that sears into their flesh. The infernal sigil glows with inner fire, continuing to burn and weaken them over time. The searing mark saps their strength as the flames consume them.',
      level: 6,
      spellType: 'ACTION',
      icon: 'spell_fire_sealoffire',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_sealoffire',
        tags: ['fire', 'damage', 'dot', 'debuff'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 70,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 30, inferno_ascend: 2, inferno_required: 4 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Sigillum Infernus!',
        somaticText: 'Draw burning sigil'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '1d4 + intelligence/3',
        elementType: 'fire',
        damageType: 'dot',
        hasDotEffect: true,
        dotConfig: {
          duration: 4,
          tickFrequency: 'round',
          dotFormula: '2d6 + intelligence/2',
          isProgressiveDot: false
        }
      },

      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{
          id: 'weakened',
          name: 'Weakened',
          description: 'The target\'s physical power is diminished by the searing heat, making them weaker and less effective in combat. The infernal brand saps their strength as it burns.',
          statModifier: {
            stat: 'strength',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        canBeDispelled: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'damage', 'dot', 'debuff']
    },

    // ========================================
    // LEVEL 7 SPELLS
    // ========================================
    {
      id: 'pyro_volcanic_eruption',
      name: 'Volcanic Eruption',
      description: 'Cause the ground to erupt with volcanic fire, dealing massive damage in a large area.',
      level: 7,
      spellType: 'ACTION',
      icon: 'spell_fire_lavasplash',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_lavasplash',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 90,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 40, inferno_ascend: 3, inferno_required: 6 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Eruptio Volcanica!',
        somaticText: 'Slam both hands down',
        materialComponents: 'Volcanic ash'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '8d6 + intelligence * 2.5',
        elementType: 'fire',
        damageType: 'direct',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          extraDice: '2d6',
          critEffects: ['burning', 'knockback'],
          burningConfig: {
            damagePerRound: '2d6',
            duration: 3,
            durationUnit: 'rounds',
            saveDC: 16,
            saveType: 'constitution'
          },
          knockbackConfig: {
            distance: 10
          }
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 16,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },

      triggerConfig: {
        effectTriggers: {
          damage: {
            logicType: 'OR',
            compoundTriggers: [{
              id: 'resource_threshold',
              category: 'health',
              name: 'High Inferno Level',
              parameters: {
                resource_type: 'inferno',
                threshold_type: 'percentage',
                percentage: 70,
                comparison: 'greater_than',
                perspective: 'self'
              }
            }]
          }
        },
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: true,
            baseFormula: '8d6 + intelligence * 2.5',
            conditionalFormulas: {
              'resource_threshold_70': '10d6 + intelligence * 3'
            }
          }
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'pyro_hellfire_breath',
      name: 'Hellfire Breath',
      description: 'Breathe a cone of hellfire that incinerates everything in its path.',
      level: 7,
      spellType: 'ACTION',
      icon: 'spell_fire_fire',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_fire',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'cone',
        aoeParameters: { length: 40 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 38, inferno_ascend: 3, inferno_required: 5 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Halitus Infernus!',
        somaticText: 'Inhale deeply and exhale'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '6d8 + intelligence * 2',
        elementType: 'fire',
        damageType: 'direct',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2.5,
          critDiceOnly: false,
          extraDice: '3d8',
          critEffects: ['burning'],
          burningConfig: {
            damagePerRound: '2d8',
            duration: 4,
            durationUnit: 'rounds',
            saveDC: 17,
            saveType: 'constitution'
          }
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'pyro_demonic_empowerment',
      name: 'Demonic Empowerment',
      description: 'Channel demonic power to enhance your fire damage. Your connection to infernal flames intensifies, allowing you to deal +5 fire damage on all fire-based attacks for 5 rounds.',
      level: 7,
      spellType: 'CHANNELED',
      icon: 'spell_shadow_demonictactics',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_shadow_demonictactics',
        tags: ['fire', 'buff'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 35, inferno_ascend: 2, inferno_required: 5 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Potentia Daemonis!',
        somaticText: 'Clench fists and channel'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'fireDamageBoost',
          name: 'Fire Damage Boost',
          description: 'Fire damage increased by +5 for 5 rounds. All fire-based attacks deal additional damage as demonic power flows through your spells and abilities.',
          statModifier: {
            stat: 'fireDamage',
            magnitude: 5,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['fire', 'buff']
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    {
      id: 'pyro_meteor_shower',
      name: 'Meteor Shower',
      description: 'Summon a shower of flaming meteors from the sky. The meteors streak downward in a devastating rain of fire, crashing into the ground with explosive force. The impact creates waves of heat and flame that engulf everything in the area. On particularly devastating impacts, the meteors leave behind lingering flames and send enemies flying.',
      level: 8,
      spellType: 'ACTION',
      icon: 'spell_fire_meteorstorm',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_meteorstorm',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 150,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 45, inferno_ascend: 3, inferno_required: 7 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Meteorus Infernus!',
        somaticText: 'Raise arms to the sky'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '8d6 + intelligence * 2.5',
        elementType: 'fire',
        damageType: 'direct',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          extraDice: '4d6',
          critEffects: ['burning', 'knockback'],
          burningConfig: {
            damagePerRound: '3d6',
            duration: 3,
            durationUnit: 'rounds',
            saveDC: 18,
            saveType: 'constitution'
          },
          knockbackConfig: {
            distance: 15
          }
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'pyro_infernal_nova',
      name: 'Infernal Nova',
      description: 'Release a massive explosion of infernal fire in all directions.',
      level: 8,
      spellType: 'ACTION',
      icon: 'spell_fire_fireball02',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_fireball02',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 35 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 42, inferno_ascend: 3, inferno_required: 8 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Nova Infernus!',
        somaticText: 'Spread arms wide and explode'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '10d6 + intelligence * 3',
        elementType: 'fire',
        damageType: 'direct'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'pyro_phoenix_flame',
      name: 'Phoenix Flame',
      description: 'Summon the essence of a phoenix, dealing massive fire damage and leaving burning ground.',
      level: 8,
      spellType: 'ACTION',
      icon: 'spell_fire_burnout',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_burnout',
        tags: ['fire', 'damage', 'aoe', 'dot'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 120,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 48, inferno_ascend: 3, inferno_required: 8 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Flamma Phoenix!',
        somaticText: 'Summon phoenix gesture'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '6d10 + intelligence * 2',
        elementType: 'fire',
        damageType: 'dot',
        hasDotEffect: true,
        dotConfig: {
          duration: 4,
          tickFrequency: 'round',
          dotFormula: '3d6 + intelligence/2',
          isProgressiveDot: false
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 6
      },

      tags: ['fire', 'damage', 'aoe', 'dot']
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    {
      id: 'pyro_infernal_avatar',
      name: 'Infernal Avatar',
      description: 'Transform into a being of pure fire, gaining immense power and immunity to fire damage.',
      level: 9,
      spellType: 'CHANNELED',
      icon: 'spell_fire_elemental_totem',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_elemental_totem',
        tags: ['fire', 'transformation'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 50, inferno_ascend: 3, inferno_required: 7 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Ego Sum Ignis!',
        somaticText: 'Spread arms wide'
      },

      resolution: 'NONE',
      effectTypes: ['transformation'],

      transformationConfig: {
        customName: 'Infernal Avatar',
        transformType: 'elemental',
        formName: 'Fire Elemental Avatar',
        formDescription: 'You become a being of pure demonic fire, wreathed in flames and radiating intense heat.',
        durationValue: 10,
        durationType: 'rounds',
        concentrationRequired: true,
        statModifiers: [
          { stat: 'fire_spell_power', magnitude: 5, magnitudeType: 'flat' },
          { stat: 'armor', magnitude: 3, magnitudeType: 'flat' }
        ],
        resistances: [
          { damageType: 'fire', resistanceType: 'immunity' }
        ],
        specialAbilities: [
          {
            name: 'Burning Aura',
            description: 'Enemies within 10 feet take 2d6 fire damage at the start of their turn'
          }
        ]
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 10
      },

      tags: ['fire', 'transformation']
    },

    {
      id: 'pyro_apocalypse',
      name: 'Apocalypse',
      description: 'Unleash the full power of demonic fire, creating a cataclysmic explosion that devastates everything.',
      level: 9,
      spellType: 'ACTION',
      icon: 'spell_fire_selfdestruct',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_selfdestruct',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 200,
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 60, inferno_ascend: 3, inferno_required: 9 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Apocalypsis!',
        somaticText: 'Raise arms and channel all power'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '12d10 + intelligence * 4',
        elementType: 'fire',
        damageType: 'direct'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 10
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'pyro_hellfire_ritual',
      name: 'Hellfire Ritual',
      description: 'Perform a ritual that channels infernal power, dramatically increasing your fire damage for a short time.',
      level: 9,
      spellType: 'CHANNELED',
      icon: 'spell_shadow_antishadow',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_shadow_antishadow',
        tags: ['fire', 'buff'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 55, inferno_ascend: 3, inferno_required: 0 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Ritualis Infernus!',
        somaticText: 'Perform ritual gestures',
        materialComponents: 'Demonic essence'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'massiveFireBoost',
          name: 'Massive Fire Boost',
          statModifier: {
            stat: 'fireDamage',
            magnitude: 10,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 12
      },

      tags: ['fire', 'buff']
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    {
      id: 'pyro_brimstone_teleport',
      name: 'Brimstone Teleport',
      description: 'Teleport through hellfire, appearing in a burst of flames and dealing damage to nearby enemies.',
      level: 10,
      spellType: 'ACTION',
      icon: 'ability_mage_firestarter',
      
      typeConfig: {
        school: 'fire',
        icon: 'ability_mage_firestarter',
        tags: ['fire', 'utility', 'teleport', 'damage'],
        castTime: 0,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 30, inferno_ascend: 1, inferno_required: 8 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'Teleportatio Infernus!'
      },

      resolution: 'DICE',
      effectTypes: ['utility', 'damage'],

      utilityConfig: {
        utilityType: 'Teleport',
        selectedEffects: [{
          duration: 0,
        durationUnit: 'instant',
        concentration: false,
        power: 'major'
        }]
      },

      damageConfig: {
        formula: '4d6 + intelligence * 1.5',
        elementType: 'fire',
        damageType: 'direct'
      },

      triggerConfig: {
        effectTriggers: {
          damage_direct: {
            logicType: 'AND',
            compoundTriggers: [{
              id: 'proximity',
              category: 'movement',
              name: 'Proximity',
              parameters: {
                perspective: 'self',
                entity_type: 'enemy',
                distance: 10
              }
            }]
          }
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['fire', 'utility', 'teleport', 'damage']
    },

    {
      id: 'pyro_demonic_ascension',
      name: 'Demonic Ascension',
      description: 'Reach the pinnacle of demonic power, transforming into a true demon of fire with overwhelming power.',
      level: 10,
      spellType: 'ACTION',
      icon: 'spell_fire_elemental_totem',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_elemental_totem',
        tags: ['fire', 'buff', 'transformation'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 70, inferno_ascend: 3, inferno_required: 9 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Ascensio Daemonis!',
        somaticText: 'Channel ultimate power'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'demonicAscension',
          name: 'Demonic Ascension',
          description: 'Gain +15 fire damage to all spells, +5 Armor, immunity to fire damage, flight (30 ft), and enemies within 15 feet take 3d6 fire damage at start of their turn',
          customDescription: 'Gain +15 fire damage to all spells, +5 Armor, immunity to fire damage, flight (30 ft), and enemies within 15 feet take 3d6 fire damage at start of their turn.'
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 15
      },

      tags: ['fire', 'buff', 'transformation']
    },

    {
      id: 'pyro_inferno_mastery',
      name: 'Inferno Mastery',
      description: 'Master the art of infernal fire, unleashing a massive inferno that consumes everything in its path. This ultimate display of pyromantic power demonstrates complete control over flame, creating a cataclysmic explosion of fire that leaves nothing but ash and cinders.',
      level: 10,
      spellType: 'ACTION',
      icon: 'spell_fire_masterofelements',
      
      typeConfig: {
        school: 'fire',
        icon: 'spell_fire_masterofelements',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 200,
        aoeShape: 'circle',
        aoeParameters: { radius: 50 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 80, inferno_ascend: 3, inferno_required: 9 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Dominatio Infernus!',
        somaticText: 'Command all fire'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '15d10 + intelligence * 5',
        elementType: 'fire',
        damageType: 'direct'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 12
      },

      tags: ['fire', 'damage', 'aoe']
    }
  ]
};

