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
        ['5', '+5', 'Body cracks: 1d6 bleeding per turn, -4 AC', 'Wrath - River Styx'],
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
            description: 'While at Inferno Level 7 or higher, your critical hit chance with fire spells increases by 10%, and critical hits deal an additional 1d10 fire damage.',
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
      // Level 1 spells: Basic fire spells (5 options, pick 3)
      'pyro_ember_spark',
      'pyro_hellfire_bolt',
      'pyro_infernal_brand',
      'pyro_demonic_resilience',
      'pyro_flame_lash'
    ],
    2: [
      // Level 2-3 spells: Early Inferno spells
      'pyro_scorching_grasp',
      'pyro_fireball',
      'pyro_flame_lash'
    ],
    4: [
      // Level 4-5 spells: Mid-tier Inferno spells
      'pyro_fireball',
      'pyro_hellfire_wave',
      'pyro_scorching_grasp'
    ],
    6: [
      // Level 6-7 spells: High-tier Inferno spells
      'pyro_lava_burst',
      'pyro_hellfire_wave',
      'pyro_fireball'
    ],
    8: [
      // Level 8-9 spells: Ultimate Inferno spells
      'pyro_meteor_shower',
      'pyro_infernal_avatar',
      'pyro_lava_burst'
    ],
    10: [
      // Level 10+ spells: Master-tier spells
      'pyro_infernal_avatar',
      'pyro_meteor_shower',
      'pyro_brimstone_teleport'
    ]
  },

  // Example Spells - showcasing Inferno Veil ascension mechanics
  exampleSpells: [
    // ========================================
    // LEVEL 1 STARTING SPELLS (5 options, pick 3)
    // ========================================
    {
      id: 'pyro_ember_spark',
      name: 'Ember Spark',
      description: 'A minor spark of demonic fire that ignites your target, burning over time.',
      spellType: 'ACTION',
      icon: 'spell_fire_flamebolt',
      school: 'Evocation',
      level: 1,

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
        durationType: 'timed',
        duration: 3,
        durationUnit: 'rounds'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Ignis!',
        somaticText: 'Snap fingers to create spark'
      },

      resolution: 'DICE',

      damageConfig: {
        damageType: 'dot',
        elementType: 'fire',
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '1d4',
          duration: 3,
          tickFrequency: 'round',
          scalingType: 'flat'
        }
      },

      effectTypes: ['damage'],

      effects: {
        damage: {
          dot: {
            formula: '1d4',
            type: 'fire',
            duration: 3,
            interval: 'round'
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 0,
          ascendBy: 1
        }
      },

      tags: ['fire', 'damage', 'dot', 'inferno-0', 'starter']
    },

    {
      id: 'pyro_hellfire_bolt',
      name: 'Hellfire Bolt',
      description: 'A bolt of infernal fire streaks toward your enemy, burning with demonic intensity.',
      spellType: 'ACTION',
      icon: 'spell_fire_firebolt',
      school: 'Evocation',
      level: 1,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 90
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 8,
        components: ['verbal', 'somatic'],
        verbalText: 'Infernus Sagitta!',
        somaticText: 'Thrust hand forward'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d8',
        damageType: 'fire',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '1d8',
            type: 'fire'
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 0,
          ascendBy: 1
        }
      },

      tags: ['fire', 'damage', 'ranged', 'inferno-0', 'starter']
    },

    {
      id: 'pyro_infernal_brand',
      name: 'Infernal Brand',
      description: 'Mark your enemy with a burning brand that sears their flesh over time.',
      spellType: 'ACTION',
      icon: 'spell_fire_sealoffire',
      school: 'Evocation',
      level: 1,

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
        duration: 2
      },

      resourceCost: {
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Sigillum Ignis!',
        somaticText: 'Draw burning sigil in the air'
      },

      resolution: 'DICE',

      damageConfig: {
        damageType: 'dot',
        elementType: 'fire',
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '1d4',
          duration: 2,
          tickFrequency: 'turn',
          scalingType: 'flat'
        }
      },

      debuffConfig: {
        statusEffects: [
          {
            id: 'burning',
            name: 'Infernal Brand',
            description: 'Marked with burning brand'
          }
        ],
        duration: 2,
        durationType: 'turns'
      },

      effectTypes: ['damage', 'debuff'],

      effects: {
        damage: {
          dot: {
            formula: '1d4',
            type: 'fire',
            duration: 2,
            interval: 'turn'
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 0,
          ascendBy: 1
        }
      },

      tags: ['fire', 'damage', 'dot', 'debuff', 'inferno-0', 'starter']
    },

    {
      id: 'pyro_demonic_resilience',
      name: 'Demonic Resilience',
      description: 'Channel infernal power to harden your flesh, gaining temporary resistance to damage.',
      spellType: 'CHANNELED',
      icon: 'spell_shadow_antishadow',
      school: 'Abjuration',
      level: 1,

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION',
        maxChannelDuration: 3,
        durationUnit: 'TURNS',
        interruptible: true,
        movementAllowed: true
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 3
      },

      resourceCost: {
        mana: 12,
        components: ['verbal', 'somatic'],
        verbalText: 'Fortis Daemon!',
        somaticText: 'Clench fist over heart'
      },

      resolution: 'NONE',

      buffConfig: {
        statModifiers: [
          {
            id: 'damageReduction',
            name: 'Damage Reduction',
            magnitude: 3,
            magnitudeType: 'flat'
          }
        ],
        statusEffects: [
          {
            id: 'demonic_resilience',
            name: 'Demonic Resilience',
            description: 'Your skin glows with faint embers'
          }
        ],
        duration: 3,
        durationType: 'turns'
      },

      effectTypes: ['buff'],

      effects: {
        buff: {
          duration: 3,
          stats: {
            damageReduction: 3
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 0,
          ascendBy: 1
        }
      },

      tags: ['fire', 'buff', 'defensive', 'channeled', 'inferno-0', 'starter']
    },

    {
      id: 'pyro_flame_lash',
      name: 'Flame Lash',
      description: 'A whip of fire lashes out at your enemy, pulling them closer as it burns.',
      spellType: 'ACTION',
      icon: 'spell_fire_flare',
      school: 'Evocation',
      level: 1,

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
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Flagellum Ignis!',
        somaticText: 'Whip hand forward'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d6',
        damageType: 'fire',
        scalingType: 'none'
      },

      // Control effect for pull
      controlConfig: {
        instant: true,
        effects: [
          {
            id: 'pull',
            name: 'Pull',
            description: 'Instantaneous',
            mechanicsText: '10 feet',
            config: {
              distance: 10
            }
          }
        ]
      },

      effects: {
        damage: {
          instant: {
            formula: '1d6',
            type: 'fire'
          }
        },
        utility: {
          pull: {
            distance: 10,
            unit: 'feet'
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 0,
          ascendBy: 1
        }
      },

      tags: ['fire', 'damage', 'utility', 'pull', 'inferno-0', 'starter']
    },

    // ========================================
    // INFERNO VEIL 0-3 - Early Corruption Spells
    // ========================================

    {
      id: 'pyro_scorching_grasp',
      name: 'Scorching Grasp',
      description: 'Flames envelop your hand as you touch an enemy, burning them and leaving lingering fire.',
      spellType: 'ACTION',
      icon: 'spell_fire_flameshock',
      school: 'Evocation',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Ardeo!',
        somaticText: 'Grasp with burning hand'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d10',
        damageType: 'fire',
        elementType: 'fire',
        scalingType: 'none',
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '1d4',
          duration: 1,
          tickFrequency: 'turn',
          scalingType: 'flat'
        }
      },

      effectTypes: ['damage'],

      effects: {
        damage: {
          instant: {
            formula: '1d10',
            type: 'fire'
          },
          dot: {
            formula: '1d4',
            type: 'fire',
            duration: 1,
            interval: 'turn'
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 1,
          ascendBy: 1
        }
      },

      tags: ['fire', 'damage', 'dot', 'touch', 'inferno-1']
    },

    {
      id: 'pyro_fireball',
      name: 'Fireball',
      description: 'A classic explosive ball of fire that detonates on impact, damaging all nearby enemies. You absorb some of the heat, healing yourself.',
      spellType: 'ACTION',
      icon: 'spell_fire_fireball02',
      school: 'Evocation',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 120,
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 10
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 20,
        components: ['verbal', 'somatic'],
        verbalText: 'Ignis Globus!',
        somaticText: 'Hurl ball of flame'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d6',
        damageType: 'fire',
        scalingType: 'none'
      },

      restorationConfig: {
        resourceType: 'health',
        formula: 'HALF_DAMAGE_DEALT',
        duration: 'instant',
        resolution: 'DICE'
      },

      effectTypes: ['damage', 'restoration'],

      effects: {
        damage: {
          instant: {
            formula: '3d6',
            type: 'fire',
            aoe: true
          }
        },
        restoration: {
          instant: {
            formula: 'HALF_DAMAGE_DEALT',
            resourceType: 'health'
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 3,
          ascendBy: 3
        }
      },

      tags: ['fire', 'damage', 'aoe', 'restoration', 'inferno-3']
    },

    // INFERNO VEIL 4-6 - Demonic Power Spells
    {
      id: 'pyro_hellfire_wave',
      name: 'Hellfire Wave',
      description: 'A wave of hellish fire sweeps over your enemies, burning them intensely and leaving them smoldering.',
      spellType: 'ACTION',
      icon: 'spell_fire_sealoffire',
      school: 'Evocation',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'cone',
        aoeParameters: {
          length: 30
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Infernus Unda!',
        somaticText: 'Sweep arms forward'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '4d8',
        damageType: 'fire',
        elementType: 'fire',
        scalingType: 'none',
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '1d8',
          duration: 1,
          tickFrequency: 'turn',
          scalingType: 'flat'
        }
      },

      effectTypes: ['damage'],

      effects: {
        damage: {
          instant: {
            formula: '4d8',
            type: 'fire',
            aoe: true
          },
          dot: {
            formula: '1d8',
            type: 'fire',
            duration: 1,
            interval: 'turn'
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 4,
          ascendBy: 2
        }
      },

      tags: ['fire', 'damage', 'aoe', 'cone', 'dot', 'inferno-4']
    },

    {
      id: 'pyro_lava_burst',
      name: 'Lava Burst',
      description: 'A burst of molten lava erupts from the ground beneath your target, dealing massive damage and splashing nearby enemies.',
      spellType: 'ACTION',
      icon: 'spell_shaman_lavaburst',
      school: 'Evocation',
      level: 6,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 80,
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 15
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 32,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Terra Ignea!',
        somaticText: 'Slam fist downward',
        materialText: 'A piece of volcanic rock'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '6d6',
        damageType: 'fire',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '6d6',
            type: 'fire',
            primaryTarget: true
          },
          splash: {
            formula: '3d6',
            type: 'fire',
            aoe: true
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 6,
          ascendBy: 3
        }
      },

      tags: ['fire', 'damage', 'aoe', 'splash', 'inferno-6']
    },

    // INFERNO VEIL 7-9 - Ultimate Corruption Spells
    {
      id: 'pyro_meteor_shower',
      name: 'Meteor Shower',
      description: 'Summon a shower of flaming meteors from the sky, devastating a large area and leaving burning craters.',
      spellType: 'ACTION',
      icon: 'spell_fire_meteorstorm',
      school: 'Evocation',
      level: 8,

      typeConfig: {
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 150,
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 30
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 45,
        components: ['verbal', 'somatic'],
        verbalText: 'Meteorus Infernus!',
        somaticText: 'Raise arms to the sky'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '8d6',
        damageType: 'fire',
        elementType: 'fire',
        scalingType: 'none',
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '2d8',
          duration: 2,
          tickFrequency: 'turn',
          scalingType: 'flat'
        }
      },

      effectTypes: ['damage'],

      effects: {
        damage: {
          instant: {
            formula: '8d6',
            type: 'fire',
            aoe: true
          },
          dot: {
            formula: '2d8',
            type: 'fire',
            duration: 2,
            interval: 'turn'
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 8,
          ascendBy: 2
        }
      },

      tags: ['fire', 'damage', 'aoe', 'dot', 'ultimate', 'inferno-8']
    },

    {
      id: 'pyro_infernal_avatar',
      name: 'Infernal Avatar',
      description: 'Transform into a being of pure fire, gaining immense power and immunity to fire damage. Your very presence burns those around you.',
      spellType: 'BUFF',
      icon: 'spell_fire_elemental_totem',
      school: 'Transmutation',
      level: 9,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 50,
        components: ['verbal', 'somatic'],
        verbalText: 'Ego Sum Ignis!',
        somaticText: 'Spread arms wide as flames engulf you'
      },

      resolution: 'NONE',

      buffConfig: {
        stats: {
          fireDamage: '+5',
          armorClass: '+3'
        },
        effects: [
          'Immunity to fire damage',
          'Enemies within 10 feet take 2d6 fire damage at start of their turn',
          'Your fire spells ignore fire resistance'
        ]
      },

      effects: {
        buff: {
          duration: 60,
          stats: {
            fireDamage: 5,
            ac: 3
          },
          immunities: ['fire'],
          aura: {
            damage: '2d6',
            type: 'fire',
            radius: 10
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 9,
          ascendBy: 1
        }
      },

      tags: ['fire', 'buff', 'transformation', 'aura', 'ultimate', 'inferno-9']
    },

    // INFERNO MANAGEMENT - Ascend and Descend Dynamically
    {
      id: 'pyro_cooling_ember',
      name: 'Cooling Ember',
      description: 'A calming spell to manage your Inferno Levels. The demonic fire within you dims, healing your wounds as corruption fades.',
      spellType: 'ACTION',
      icon: 'spell_fire_twilightflamebreath',
      school: 'Abjuration',
      level: 1,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Pax Ignis',
        somaticText: 'Place hand over heart'
      },

      resolution: 'DICE',

      healingConfig: {
        formula: '1d6_PER_LEVEL_REDUCED',
        healingType: 'self',
        description: 'Heal 1d6 per Inferno Level reduced'
      },

      effects: {
        healing: {
          instant: {
            formula: '1d6',
            multiplier: 'INFERNO_LEVELS_REDUCED',
            target: 'self'
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 0,
          descendBy: '1d4'
        }
      },

      tags: ['fire', 'healing', 'utility', 'inferno-management']
    },

    {
      id: 'pyro_flame_step',
      name: 'Flame Step',
      description: 'Teleport a short distance in a burst of fire, leaving flames at your departure and arrival points.',
      spellType: 'ACTION',
      icon: 'ability_mage_firestarter',
      school: 'Conjuration',
      level: 2,

      typeConfig: {
        castTime: 0,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 15,
        components: ['verbal'],
        verbalText: 'Saltus Ignis!'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d6',
        damageType: 'fire',
        scalingType: 'none'
      },

      utilityConfig: {
        type: 'teleport',
        distance: 30,
        unit: 'feet'
      },

      effects: {
        utility: {
          teleport: {
            distance: 30,
            unit: 'feet'
          }
        },
        damage: {
          instant: {
            formula: '1d6',
            type: 'fire',
            targets: 'adjacent_at_start_and_end'
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 0,
          ascendBy: 1
        }
      },

      tags: ['fire', 'utility', 'teleport', 'mobility']
    }
  ]
};

