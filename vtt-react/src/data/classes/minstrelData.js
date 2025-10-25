/**
 * Minstrel Class Data
 * 
 * Complete class information for the Minstrel - a musical spellcaster
 * who weaves magic through chord progressions and harmonic resonance.
 */

export const MINSTREL_DATA = {
  id: 'minstrel',
  name: 'Minstrel',
  icon: 'fas fa-music',
  role: 'Support',

  // Overview section
  overview: {
    title: 'The Minstrel',
    subtitle: 'Master of Musical Magic',
    
    description: `The Minstrel is a master of musical magic, weaving spells through intricate chord progressions and harmonic resonance. By combining spells with specific musical functions, the Minstrel creates harmonious effects that support allies, hinder foes, and manipulate the battlefield through the power of song. Their unique mechanic revolves around building musical notes and resolving them into powerful cadences.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Minstrels are wandering performers, court musicians, battlefield drummers, and mystical bards who have discovered that music is not merely art—it is a fundamental force of reality. Through years of study and practice, they've learned to channel magic through musical theory, turning chord progressions into tangible power.

Their instruments are their spellcasting foci, and each Minstrel develops a unique relationship with their chosen instrument. Some carry ancient lutes passed down through generations, others wield war drums that echo with ancestral spirits, while still others use their own voice as their primary instrument.

In roleplay, Minstrels often serve as:
- **The Traveling Bard**: Collecting songs and stories while secretly gathering magical power
- **The Court Musician**: Using their position to influence politics and protect their patrons
- **The Battle Hymn Singer**: Leading troops with inspiring war songs and devastating sonic attacks
- **The Mystical Composer**: Seeking the perfect song that will unlock ultimate magical power
- **The Instrument Collector**: Hunting for legendary instruments with unique magical properties

Minstrels understand that every sound has meaning, every rhythm has power, and every melody can change the world. They see music in everything—the clash of swords, the rhythm of footsteps, the harmony of voices in conversation.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Minstrel is a versatile support class that excels at:

**Adaptive Support**: Can switch between healing, buffing, and damage based on the situation
**Combo Gameplay**: Building musical notes and resolving them into powerful cadences creates engaging tactical decisions
**Area Effects**: Most Minstrel abilities affect multiple allies or enemies, making positioning crucial
**Sustained Power**: Unlike burst classes, Minstrels build power over time through careful note management

**Strengths**:
- Excellent multi-target support capabilities
- High versatility through different chord progressions
- Strong sustained healing and buffing
- Unique utility through musical effects
- Can adapt to different party compositions

**Weaknesses**:
- Requires setup time to build notes
- Less effective when caught alone
- Lower burst healing than dedicated healers
- Combo system requires planning and foresight
- Vulnerable to silence and interruption effects

The Minstrel shines in group content where they can orchestrate the flow of battle, building notes through builder spells and unleashing devastating cadences at critical moments.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Minstrel is about reading the rhythm of battle and conducting your party to victory. Key strategic considerations:

**Note Management**:
- Each spell generates specific musical notes (I, II, III, IV, V, VI, VII)
- Notes stack up to 5 of each type
- Notes persist between combats but decay slowly (1 note per minute out of combat)
- Managing your note economy is crucial to having the right cadences available

**Chord Progression Planning**:
- **Perfect Cadence (I-IV-V-I)**: Guarantees ally critical hit - save for crucial moments
- **Deceptive Cadence (IV-VII-V-IV)**: Stuns enemies - use for crowd control
- **Circle of Fifths (V-I-VI-V)**: Damage over time - apply early in fights
- **Plagal Cadence (VI-V-I-III)**: Speed boost - use for repositioning or pursuit
- **Half Cadence (VII-V-IV-VI)**: Shield - preemptive defense before big attacks

**Instrument Selection**:
Different instruments provide different bonuses and affect your playstyle:
- **Lute/Harp**: Bonus to healing and charm effects
- **Drum**: Bonus to damage and buff duration
- **Flute/Horn**: Increased range and area of effect
- **Voice**: No equipment required, bonus to all effects but shorter range

**Specialization Synergies**:
- **Battlechoir**: Aggressive support, damage amplification, war songs
- **Soulsinger**: Healing focus, emotional manipulation, protective melodies
- **Dissonance**: Debuffs and control, chaotic magic, reality-warping sounds

**Team Dynamics**:
- Works best with coordinated teams who can capitalize on buffs
- Synergizes with classes that benefit from critical hits (Battlechoir)
- Provides sustained healing for prolonged encounters (Soulsinger)
- Offers crowd control for tactical teams (Dissonance)`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Perfect Cadence',
      content: `**The Setup**: You're a Minstrel (Battlechoir specialization) with a war drum, facing a group of bandits (5 bandits + 1 bandit leader). Your party is with you. Starting Notes: I(2), IV(1), V(1) from previous encounter. Starting Mana: 50/60. Your goal: Build musical notes through builder spells, then resolve them into powerful cadences to support your party.

**Starting State**: Notes: I(2), IV(1), V(1) | Mana: 50/60 | HP: 60/60

**Turn 1 - Building Notes (Notes: I(2), IV(1), V(1) → I(3), IV(1), V(1), II(1))**

*You raise your war drum, its surface etched with ancient runes. The bandits charge. You begin to PLAY.*

**Your Action**: Cast "Inspiring Rhythm" on your party's tank (4 mana, builder spell)
**Effect**: Grant +2 AC for 2 rounds
**Musical Note Generated**: II (Supertonic)

*BOOM. BOOM. BOOM. Your drum echoes across the battlefield. Your tank feels the rhythm, moving with newfound confidence.*

**Notes**: I(2), IV(1), V(1) + II(1) = **I(2), II(1), IV(1), V(1)**
**Mana**: 50 - 4 = 46/60

**Your Party's Tank**: "I feel faster! Stronger!"
**You**: "That's the rhythm of war. Let it guide you."

**Bandit #1's Turn**: Attacks tank → [14] → Miss! (tank has +2 AC from your buff)

*The bandit's sword clangs off the tank's armor. The rhythm protected him.*

**Current State**: Notes: I(2), II(1), IV(1), V(1) | Mana: 46/60

**Turn 2 - More Building (Notes: I(3), II(1), IV(1), V(1), III(1))**

**Your Action**: Cast "Harmonic Strike" at Bandit #2 (5 mana, builder spell)
**Attack Roll**: d20+5 → [16] = Hit!
**Damage**: 2d6 thunder → [5, 6] = **11 thunder damage**
**Musical Note Generated**: III (Mediant)

*You strike your drum with a thunderous CRASH. The sound wave SLAMS into the bandit, knocking him back.*

**Notes**: I(2), II(1), IV(1), V(1) + III(1) = **I(2), II(1), III(1), IV(1), V(1)**
**Mana**: 46 - 5 = 41/60

**Bandit #2**: 11 damage taken, staggered

**Your Party's Mage**: Casts Fireball → 35 damage to 3 bandits

**Current State**: Notes: I(2), II(1), III(1), IV(1), V(1) | Mana: 41/60

**Turn 3 - Building to Cadence (Notes: I(3), II(1), III(1), IV(1), V(1))**

*You have I, IV, and V notes. You can play a PERFECT CADENCE (I-IV-V-I). But you need one more I note first.*

**Your Action**: Cast "Resonant Chord" on your party (6 mana, builder spell)
**Effect**: Heal all allies for 1d8 HP
**Healing Roll**: 1d8 → [6] = 6 HP to each ally
**Musical Note Generated**: I (Tonic)

*You play a deep, resonant chord. The sound VIBRATES through your party, mending wounds.*

**Notes**: I(2), II(1), III(1), IV(1), V(1) + I(1) = **I(3), II(1), III(1), IV(1), V(1)**
**Mana**: 41 - 6 = 35/60

**Your Party's Tank**: "I'm healed! And I feel... ready."
**You**: "Good. Because I'm about to play the Perfect Cadence. Next attack—make it count."

**Current State**: Notes: I(3), II(1), III(1), IV(1), V(1) | Mana: 35/60

**Turn 4 - PERFECT CADENCE (Notes: I(3), II(1), III(1), IV(1), V(1) → I(2), II(1), III(1))**

*You have I(3), IV(1), V(1). Time to play the PERFECT CADENCE: I-IV-V-I. This will guarantee your tank's next attack is a critical hit.*

**Your Action**: Play "Perfect Cadence" (I-IV-V-I) targeting your tank (10 mana)
**Notes Consumed**: I(1), IV(1), V(1), I(1) = 4 notes total
**Effect**: Target's next attack is a guaranteed critical hit

*You play the progression: BOOM (I). BOOM-BOOM (IV). BOOM-BOOM-BOOM (V). BOOM (I). The rhythm is PERFECT. The sound resonates with reality itself. Your tank's weapon GLOWS with harmonic energy.*

**Notes**: I(3), II(1), III(1), IV(1), V(1) - I(1) - IV(1) - V(1) - I(1) = **I(2), II(1), III(1)**
**Mana**: 35 - 10 = 25/60

**Your Party's Tank**: "My sword... it's SINGING!"
**You**: "Strike NOW!"

**Your Party's Tank's Turn**: Attacks Bandit Leader
**Attack Roll**: d20+6 → [12] = Hit! → **GUARANTEED CRITICAL HIT** (Perfect Cadence)
**Damage**: 2d8+5 → [7, 8] + 5 = 20 damage → **DOUBLED** = **40 damage!**

*The tank's sword strikes with the force of a thunderclap. The bandit leader is CRUSHED.*

**Bandit Leader**: 40 damage taken, DEAD

**Your Party's Mage**: "FORTY DAMAGE! What did you DO?"
**You**: "Perfect Cadence. I-IV-V-I. The most powerful chord progression in music. Guarantees a critical hit."

**Current State**: Notes: I(2), II(1), III(1) | Mana: 25/60

**Turn 5 - Rebuilding Notes**

*The bandit leader is dead. Four bandits remain. Time to rebuild your notes.*

**Your Action**: Cast "Inspiring Rhythm" on your mage (4 mana)
**Effect**: +2 AC for 2 rounds
**Musical Note Generated**: II (Supertonic)

**Notes**: I(2), II(1), III(1) + II(1) = **I(2), II(2), III(1)**
**Mana**: 25 - 4 = 21/60

**Your Party's Rogue**: Sneak attacks Bandit #3 → DEAD
**Your Party's Mage**: Casts Fire Bolt → Bandit #4 DEAD

**Two bandits remain**

**Current State**: Notes: I(2), II(2), III(1) | Mana: 21/60

**Turn 6 - Finishing the Fight**

**Your Action**: Cast "Harmonic Strike" at Bandit #5 (5 mana)
**Attack Roll**: d20+5 → [17] = Hit!
**Damage**: 2d6 thunder → [6, 5] = **11 thunder damage**
**Musical Note Generated**: III (Mediant)
**Result**: Bandit #5 DEAD

**Notes**: I(2), II(2), III(1) + III(1) = **I(2), II(2), III(2)**
**Mana**: 21 - 5 = 16/60

**Your Party's Tank**: Attacks Bandit #6 → DEAD

**Combat Over**

*You lower your drum. The battlefield is silent except for the fading echoes of your music.*

**Your Party's Tank**: "That Perfect Cadence... I've never hit that hard in my life. Forty damage on a critical."
**You**: "I spent four musical notes to play it: I-IV-V-I. The Perfect Cadence guarantees your next attack is a critical hit. I had been building those notes through my builder spells—Inspiring Rhythm generates II notes, Harmonic Strike generates III notes, Resonant Chord generates I notes."
**Your Party's Mage**: "So you were building up to that the whole fight?"
**You**: "Exactly. I started with I(2), IV(1), V(1) from the previous fight. I built up to I(3), IV(1), V(1), then played the Perfect Cadence. Now I have I(2), II(2), III(2) banked for the next fight."
**Your Party's Rogue**: "What other cadences can you play?"
**You**: "Many. Deceptive Cadence (IV-VII-V-IV) stuns enemies. Circle of Fifths (V-I-VI-V) deals damage over time. Plagal Cadence (VI-V-I-III) gives speed boosts. Half Cadence (VII-V-IV-VI) creates shields. Each requires specific notes, so I have to plan ahead."

**Final State**: Notes: I(2), II(2), III(2) | Mana: 16/60 | HP: 60/60

**The Lesson**: Minstrel gameplay is about:
1. **Note Building**: Cast builder spells to generate musical notes (I, II, III, IV, V, VI, VII)
2. **Note Stacking**: Notes stack up to 5 of each type, persist between combats
3. **Cadence Planning**: Perfect Cadence requires I-IV-V-I (4 notes total), guarantees critical hit
4. **Resource Management**: Started with I(2), IV(1), V(1), built to I(3), IV(1), V(1), spent 4 notes for cadence
5. **Builder Spells**: Inspiring Rhythm (generates II), Harmonic Strike (generates III), Resonant Chord (generates I)
6. **Cadence Impact**: Perfect Cadence guaranteed tank's critical hit: 20 damage → 40 damage (doubled)
7. **Note Persistence**: Ended with I(2), II(2), III(2) banked for next fight

You're not a simple support caster. You're a MUSICAL CONDUCTOR. You build notes through builder spells, stack them up, then RESOLVE them into powerful cadences. The Perfect Cadence (I-IV-V-I) guarantees a critical hit. The Deceptive Cadence (IV-VII-V-IV) stuns enemies. Each cadence requires specific notes, so you have to PLAN AHEAD. Cast the right builder spells to generate the notes you need, then unleash the cadence at the perfect moment. Your party fights to the rhythm of your music. You are the MAESTRO of the battlefield.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Musical Combo System',
    subtitle: 'Chord Progressions & Harmonic Resonance',

    description: `The Minstrel's unique resource system is based on Western music theory. Builder spells generate musical notes (I through VII), and Resolving spells consume specific note combinations to create powerful cadences. Mastering the Minstrel requires understanding both musical theory and tactical timing.`,

    resourceBarExplanation: {
      title: 'Understanding Your Musical Notes Interface',
      content: `**What You See**: The Minstrel's interface displays a MUSICAL STAFF with seven note positions (I, II, III, IV, V, VI, VII), each showing how many notes of that type you currently have stacked. Notes appear as glowing musical symbols on the staff, and available cadences are highlighted when you have the required notes.

**MUSICAL STAFF DISPLAY** (Horizontal Bar):

**Staff Layout**:
- **Seven Note Positions**: I, II, III, IV, V, VI, VII arranged horizontally
- **Note Stacks**: Each position shows 0-5 notes stacked vertically
- **Glowing Notes**: Active notes glow with musical energy
- **Empty Positions**: Grayed out when no notes present
- **Cadence Buttons**: Below the staff, showing available cadences

**Note Position Visualization**:

**I (Tonic) - Foundation**:
- **Symbol**: Whole note (○) in gold
- **Position**: Far left of staff
- **Glow**: Warm golden light
- **Label**: "I (Tonic) - 3/5"
- **Thematic**: Stability, home, resolution

**II (Supertonic) - Mild Tension**:
- **Symbol**: Half note (𝅗𝅥) in light blue
- **Position**: Second from left
- **Glow**: Cool blue shimmer
- **Label**: "II (Supertonic) - 2/5"
- **Thematic**: Dissonance, tension

**III (Mediant) - Color**:
- **Symbol**: Quarter note (♩) in purple
- **Position**: Third from left
- **Glow**: Purple-pink aura
- **Label**: "III (Mediant) - 2/5"
- **Thematic**: Emotion, depth

**IV (Subdominant) - Movement**:
- **Symbol**: Eighth note (♪) in green
- **Position**: Center-left
- **Glow**: Vibrant green pulse
- **Label**: "IV (Subdominant) - 1/5"
- **Thematic**: Forward motion, support

**V (Dominant) - Strong Tension**:
- **Symbol**: Sixteenth note (♬) in red
- **Position**: Center-right
- **Glow**: Intense red flame
- **Label**: "V (Dominant) - 1/5"
- **Thematic**: Demands resolution, power

**VI (Submediant) - Relative Minor**:
- **Symbol**: Dotted note (♩.) in dark blue
- **Position**: Second from right
- **Glow**: Deep blue melancholy
- **Label**: "VI (Submediant) - 0/5"
- **Thematic**: Sadness, depth

**VII (Leading Tone) - Urgent Tension**:
- **Symbol**: Sharp note (♯) in bright white
- **Position**: Far right
- **Glow**: Brilliant white urgency
- **Label**: "VII (Leading Tone) - 0/5"
- **Thematic**: Pulls to tonic, climax

**Note Stack Display**:
When you have multiple notes of one type:
- **1 Note**: Single symbol, faint glow
- **2 Notes**: Two symbols stacked, moderate glow
- **3 Notes**: Three symbols stacked, bright glow
- **4 Notes**: Four symbols stacked, intense glow, pulsing
- **5 Notes (MAX)**: Five symbols stacked, MAXIMUM glow, "MAX" label, pulsing rapidly

**Note Generation Animation**:
When you cast a builder spell:
- **Spell Cast**: "Inspiring Rhythm (4 mana)" cast
- **Note Creation**: Musical note symbol appears above your character
- **Note Flight**: Symbol flies to the staff, lands on appropriate position
- **Stack Update**: Note adds to stack, counter updates "II: 1/5 → 2/5"
- **Audio**: Musical note sound (pitch corresponds to note type: I = low C, II = D, III = E, etc.)
- **Visual**: Staff position glows brighter
- **Text Notification**: "+1 II Note (Inspiring Rhythm)"

**Cadence Availability Display**:
Below the musical staff, cadence buttons show:

**Perfect Cadence (I-IV-V-I)**:
- **Button**: Large button with musical notation "I→IV→V→I"
- **Status**: "AVAILABLE" (green) if you have I(2+), IV(1+), V(1+)
- **Status**: "UNAVAILABLE" (gray) if missing notes
- **Cost Display**: "Requires: I(1), IV(1), V(1), I(1)"
- **Effect Preview**: "Ally's next attack = CRITICAL HIT"
- **Highlight**: Glows gold when available

**Deceptive Cadence (IV-VII-V-IV)**:
- **Button**: Medium button "IV→VII→V→IV"
- **Status**: "UNAVAILABLE" (gray) - missing VII notes
- **Cost Display**: "Requires: IV(1), VII(1), V(1), IV(1)"
- **Effect Preview**: "Stun enemy (DC 15 save)"
- **Highlight**: Grayed out when unavailable

**Circle of Fifths (V-I-VI-V)**:
- **Button**: Medium button "V→I→VI→V"
- **Status**: "UNAVAILABLE" (gray) - missing VI notes
- **Cost Display**: "Requires: V(1), I(1), VI(1), V(1)"
- **Effect Preview**: "2d4 DoT for 3 turns (30 ft radius)"

**Cadence Cast Animation**:
When you play a cadence:
- **Button Press**: Click "Perfect Cadence" button
- **Note Consumption**: Notes DRAIN from staff in sequence
  * I note glows and flies off staff → "I (1/3 → 0/3)"
  * IV note glows and flies off staff → "IV (1/1 → 0/1)"
  * V note glows and flies off staff → "V (1/1 → 0/1)"
  * I note glows and flies off staff → "I (0/3 → -1/3)" wait, that's wrong...
  * Actually: I(2) → I(1) after first I, then I(1) → I(0) after second I
- **Musical Sequence**: Each note plays its pitch in sequence (C → F → G → C)
- **Cadence Effect**: Massive burst of harmonic energy
- **Target Highlight**: Ally glows with golden light (Perfect Cadence)
- **Audio**: Full chord progression played dramatically
- **Text Notification**: "PERFECT CADENCE PLAYED! Ally's next attack = CRITICAL HIT"
- **Screen Effect**: Brief musical notation overlay

**Note Decay Indicator**:
When out of combat:
- **Decay Timer**: "Note Decay: 45 seconds until next decay"
- **Warning**: "⚠️ 1 note will decay in 15 seconds"
- **Decay Animation**: One note fades from staff, counter decreases
- **Text**: "-1 I Note (decay)"

**Builder Spell Interface**:
When you have builder spells ready:
- **Spell Buttons**: Show which notes they generate
  * "Inspiring Rhythm (4 mana) → +1 II Note"
  * "Harmonic Strike (5 mana) → +1 III Note"
  * "Resonant Chord (6 mana) → +1 I Note"
- **Strategic Info**: "Need IV and V notes for Perfect Cadence"

**Cadence Planning Interface**:
When hovering over a cadence:
- **Required Notes**: "Perfect Cadence requires: I(2), IV(1), V(1)"
- **Current Notes**: "You have: I(3), IV(1), V(1) ✓"
- **Missing Notes**: "You need: VII(1) ✗" (for other cadences)
- **After Cast**: "After casting, you will have: I(2), IV(0), V(0)"

**Instrument Display**:
Your equipped instrument is shown:
- **Instrument Icon**: War drum image
- **Instrument Bonus**: "+1d4 damage, +1 turn buff duration"
- **Visual**: Character model holds/plays instrument during casts

**Combat Integration**:
- **Builder Spell Cast**: "Inspiring Rhythm → +1 II Note → II: 1/5 → 2/5"
- **Cadence Cast**: "Perfect Cadence → Consumed I(1), IV(1), V(1), I(1) → Tank's next attack = CRIT"
- **Critical Hit Result**: Tank attacks → "40 damage (CRITICAL - Perfect Cadence)"

**Note Persistence Display**:
Between combats:
- **Banked Notes**: "Notes Banked: I(2), II(2), III(2)"
- **Decay Warning**: "Notes decay 1/minute out of combat"
- **Strategic Info**: "Build notes before next fight"

**Why This Matters**: The Musical Staff interface makes you FEEL like a composer conducting a symphony. When you cast Inspiring Rhythm and see the II note symbol fly to the staff with a musical "D" pitch, you're BUILDING your composition. When you have I(3), IV(1), V(1) and the Perfect Cadence button GLOWS GOLD with "AVAILABLE", you KNOW you can unleash it. When you click the button and watch the notes drain in sequence—I → IV → V → I—each playing its pitch (C → F → G → C), and your tank's weapon GLOWS with harmonic energy, you feel like a MAESTRO. The cadence planning interface shows exactly what you need: "Need VII notes for Deceptive Cadence" tells you to cast the right builder spells. The note persistence between combats lets you PREPARE—end one fight with I(2), II(2), III(2) banked, ready for the next encounter. You're not just casting spells—you're COMPOSING MUSIC that shapes reality.`
    },

    mechanics: {
      title: 'How It Works',
      content: `**Musical Notes**: The foundation of Minstrel magic

**Builder Spells** generate specific musical notes:
- Each spell generates 1-3 notes of specific types
- Notes stack up to 5 of each type (I, II, III, IV, V, VI, VII)
- Notes persist between combats
- Notes decay at 1 per minute when out of combat

**Resolving Spells** consume note combinations:
- Require specific sequences of notes (e.g., V→I for Perfect Cadence)
- Consume the notes used in the progression
- Create powerful effects based on the cadence type
- Some progressions have multiple valid orderings

**Note Persistence**:
- Notes remain after combat, allowing you to prepare for the next encounter
- Strategic players can build notes during downtime
- Decay prevents infinite stacking but allows short-term planning

**Instrument Effects**:
Your chosen instrument modifies your abilities:
- **Lute**: +2 to healing, advantage on charm effects
- **War Drum**: +1d4 to damage spells, +1 turn to buff duration
- **Flute**: +10 ft to spell range, +5 ft to AOE radius
- **Horn**: +15 ft to spell range, allies hear you through walls
- **Voice**: No equipment needed, +1 to all effects, -10 ft range`
    },

    musicalNotesTable: {
      title: 'Musical Notes System',
      headers: ['Note', 'Function', 'Thematic Role', 'Generated By'],
      rows: [
        ['I (Tonic)', 'Foundation', 'Stability and home', 'Basic attacks, defensive spells'],
        ['II (Supertonic)', 'Mild Tension', 'Creates dissonance', 'Debuff and control spells'],
        ['III (Mediant)', 'Color', 'Emotional depth', 'Charm and emotion spells'],
        ['IV (Subdominant)', 'Movement', 'Forward motion', 'Support and healing spells'],
        ['V (Dominant)', 'Strong Tension', 'Demands resolution', 'Offensive spells'],
        ['VI (Submediant)', 'Relative Minor', 'Melancholy and depth', 'Fear and sorrow spells'],
        ['VII (Leading Tone)', 'Urgent Tension', 'Pulls to tonic', 'Finisher and climax spells']
      ]
    },

    chordProgressionsTable: {
      title: 'Chord Progressions & Cadences',
      headers: ['Progression', 'Name', 'Sequence', 'Effect', 'Tactical Use'],
      rows: [
        ['Perfect Cadence', 'Harmonious Resolution', 'I→IV→V→I', 'Ally\'s next attack is guaranteed critical hit', 'Save for boss damage phases'],
        ['Deceptive Cadence', 'Enchanter\'s Trick', 'IV→VII→V→IV', 'Stun enemy (DC 15 save)', 'Interrupt dangerous casts'],
        ['Circle of Fifths', 'Eternal Torment', 'V→I→VI→V', '2d4 DoT for 3 turns (30 ft radius)', 'Apply early to groups'],
        ['Plagal Cadence', 'Sacred Ascent', 'VI→V→I→III', '+20 ft speed, +2 Dex for 2 turns', 'Repositioning or pursuit'],
        ['Half Cadence', 'Arcane Shield', 'VII→V→IV→VI', '2d6 shield for 2 turns (15 ft radius)', 'Pre-cast before big attacks'],
        ['Authentic Cadence', 'Grand Finale', 'I→VI→III→I', '-4 damage taken, restore 1d8 HP (20 ft radius)', 'Survive burst damage'],
        ['Phrygian Cadence', 'Ancient Resolve', 'V→IV→I→VII', 'Advantage on attacks for 2 turns', 'Boost damage dealers'],
        ['Neapolitan Sixth', 'Mystical Precision', 'III→I→IV→V', '+2 crit chance next turn', 'Stack with other crit buffs'],
        ['Tritone Substitution', 'Dissonant Chains', 'IV→I→V→VI', 'Paralyze enemy (DC 18 save, 30 ft)', 'Lock down priority targets'],
        ['Picardy Third', 'Triumph of Light', 'I→VII→V→III', '+2 to saves, restore 2d6 HP (20 ft)', 'Counter debuff-heavy enemies']
      ]
    },

    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Early Combat (Turns 1-3)**: Focus on building notes with efficient builder spells. Prioritize notes for your most-needed cadences.

**Mid Combat (Turns 4-6)**: Begin resolving cadences. Use defensive cadences (Half Cadence, Authentic Cadence) to sustain your party, or offensive ones (Circle of Fifths, Phrygian Cadence) to pressure enemies.

**Late Combat (Turns 7+)**: Unleash your most powerful cadences. Perfect Cadence can secure kills, Tritone Substitution can lock down remaining threats.

**Between Combats**: Maintain 2-3 notes of each type as a "baseline" for quick cadence access. Let excess notes decay naturally.

**Instrument Choice**:
- **Lute** for healing-focused builds (Soulsinger)
- **War Drum** for aggressive support (Battlechoir)
- **Flute** for ranged safety and large groups
- **Voice** for versatility when you can't carry instruments`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `The Minstrel's musical note system is uniquely suited to physical tracking with tokens or dice, creating a visual representation of your musical composition. Here's how to track your notes and cadences at the table:

**Required Materials**:
- **35 tokens or beads** (5 each of 7 different colors for the 7 note types)
- **Tracking mat or paper** with 7 note positions (I, II, III, IV, V, VI, VII)
- **Cadence reference card** with progression sequences
- **Optional: Musical staff diagram** for thematic immersion

**Musical Note Tracking**:

**The Seven-Color Token Method** (Recommended):

Use different colored tokens to represent each note type:
- **I (Tonic)**: Gold/yellow tokens (foundation, stability)
- **II (Supertonic)**: Light blue tokens (mild tension)
- **III (Mediant)**: Purple tokens (emotional color)
- **IV (Subdominant)**: Green tokens (movement)
- **V (Dominant)**: Red tokens (strong tension)
- **VI (Submediant)**: Dark blue tokens (melancholy)
- **VII (Leading Tone)**: White tokens (urgent tension)

**Setup**:
Create a tracking mat with 7 columns labeled I through VII:
\`\`\`
[I]  [II]  [III]  [IV]  [V]  [VI]  [VII]
 ○    ○     ○      ○     ○    ○     ○
 ○    ○     ○      ○     ○    ○     ○
 ○    ○     ○      ○     ○    ○     ○
 ○    ○     ○      ○     ○    ○     ○
 ○    ○     ○      ○     ○    ○     ○
(Max 5 tokens per column)
\`\`\`

**Generating Notes**:
- When you cast a builder spell, place a token in the appropriate column
- Example: Cast "Inspiring Rhythm" (generates II) → Place 1 light blue token in the II column
- Example: Cast "Resonant Chord" (generates I) → Place 1 gold token in the I column
- Stack tokens vertically (max 5 per note type)

**Consuming Notes for Cadences**:
- When you cast a resolver spell (cadence), remove the required tokens
- Example: Perfect Cadence (I-IV-V-I) → Remove 1 gold, 1 green, 1 red, 1 gold token
- Example: Circle of Fifths (V-I-VI-V) → Remove 1 red, 1 gold, 1 dark blue, 1 red token

**Alternative Tracking Methods**:

**The Dice Method**:
Use 7 different colored d6 dice, each set to show your current count (0-5) for that note:
- Gold d6 for I (showing 3 = you have 3 I notes)
- Blue d6 for II (showing 2 = you have 2 II notes)
- Purple d6 for III (showing 1 = you have 1 III note)
- etc.

**The Tally Method**:
Draw a simple grid on paper:
\`\`\`
I:   ||||  (4 notes)
II:  ||    (2 notes)
III: |||   (3 notes)
IV:  |     (1 note)
V:   ||    (2 notes)
VI:  -     (0 notes)
VII: -     (0 notes)
\`\`\`

**Cadence Reference Card Template**:
\`\`\`
MINSTREL CADENCE QUICK REFERENCE

PERFECT CADENCE (I-IV-V-I)
Cost: I(1), IV(1), V(1), I(1) = 4 notes total
Effect: Ally's next attack = CRITICAL HIT
Use: Boss damage phases, guaranteed kills

CIRCLE OF FIFTHS (V-I-VI-V)
Cost: V(1), I(1), VI(1), V(1) = 4 notes total
Effect: 2d4 DoT for 3 turns (30 ft radius)
Use: Apply early to enemy groups

DECEPTIVE CADENCE (IV-VII-V-IV)
Cost: IV(1), VII(1), V(1), IV(1) = 4 notes total
Effect: Stun enemy (DC 15 save)
Use: Interrupt dangerous casts

AUTHENTIC CADENCE (I-VI-III-I)
Cost: I(1), VI(1), III(1), I(1) = 4 notes total
Effect: -4 damage taken, restore 1d8 HP (20 ft)
Use: Survive burst damage

[Print all 10 cadences on card]
\`\`\`

**Example In-Person Turn**:

*You have: I(3), II(2), III(1), IV(1), V(2), VI(0), VII(0)*

**Turn 1 - Building Notes**:
1. "I cast Inspiring Rhythm" (costs 4 mana, generates II)
2. Place 1 light blue token in II column
3. Now have: I(3), II(3), III(1), IV(1), V(2), VI(0), VII(0)

**Turn 2 - Resolving a Cadence**:
1. "I cast Perfect Cadence to guarantee our fighter's next attack is a crit!"
2. Check your tokens: Need I(1), IV(1), V(1), I(1)
3. Remove tokens: 1 gold from I, 1 green from IV, 1 red from V, 1 gold from I
4. Now have: I(1), II(3), III(1), IV(0), V(1), VI(0), VII(0)
5. Fighter's next attack automatically crits!

**Turn 3 - Building Back Up**:
1. "I cast Harmonic Strike" (generates III)
2. Place 1 purple token in III column
3. Now have: I(1), II(3), III(2), IV(0), V(1), VI(0), VII(0)

**Visual Organization Tips**:

1. **Color Coding**: Use distinctly different colors for each note type to avoid confusion
2. **Musical Staff Mat**: Draw or print a musical staff for thematic immersion
3. **Cadence Cards**: Keep cadence reference cards easily accessible
4. **Token Storage**: Use a small container or bag for unused tokens

**Thematic Enhancements**:

Many players enhance the musical experience with:
- **Musical Staff Mat**: Print a decorative musical staff with note positions
- **Note Symbols**: Use tokens with musical note symbols (♩, ♪, ♫, ♬)
- **Instrument Prop**: Keep a small instrument prop (toy lute, drum, flute) on the table
- **Humming/Singing**: Some players hum or sing when casting spells for immersion
- **Musical Dice**: Use dice with musical symbols instead of numbers

**Quick Reference: Note Generation**:

Keep a list of which spells generate which notes:
\`\`\`
BUILDER SPELLS (Generate Notes):
• Opening Chord → I (Tonic)
• Inspiring Rhythm → II (Supertonic)
• Harmonic Strike → III (Mediant)
• Resonant Chord → IV (Subdominant)
• Power Chord → V (Dominant)
• Melancholy Melody → VI (Submediant)
• Climactic Crescendo → VII (Leading Tone)
\`\`\`

**Cadence Planning**:

Before combat, decide which cadences you want to prioritize:
- **Offensive Build**: Focus on generating V, I, VI for Circle of Fifths
- **Defensive Build**: Focus on generating I, VI, III for Authentic Cadence
- **Control Build**: Focus on generating IV, VII, V for Deceptive Cadence
- **Versatile Build**: Maintain 2-3 of each note for flexibility

**Example Full Combat Sequence**:

*Starting with 0 notes*

**Turn 1**: Cast Opening Chord → Add I token → I(1)
**Turn 2**: Cast Inspiring Rhythm → Add II token → I(1), II(1)
**Turn 3**: Cast Harmonic Strike → Add III token → I(1), II(1), III(1)
**Turn 4**: Cast Resonant Chord → Add IV token → I(1), II(1), III(1), IV(1)
**Turn 5**: Cast Power Chord → Add V token → I(1), II(1), III(1), IV(1), V(1)
**Turn 6**: Cast Opening Chord again → Add I token → I(2), II(1), III(1), IV(1), V(1)
**Turn 7**: Cast Perfect Cadence! → Remove I, IV, V, I → I(0), II(1), III(1), IV(0), V(0)
**Result**: Ally gets guaranteed critical hit!

**Why This System Works**: The physical act of placing tokens as you build notes creates a visual representation of your musical composition. You can SEE your melody taking shape, FEEL the satisfaction of completing a cadence by removing the tokens, and PLAN ahead by looking at which notes you need for specific progressions. The color-coded tokens make it easy to identify which notes you have at a glance, and the tactile experience of moving tokens mirrors the musical flow of building and resolving tension.

**Pro Tips**:
- **Pre-Combat Setup**: Start each combat with a few notes already banked (they persist between combats)
- **Cadence Priority**: Keep a mental list of your top 3 most-used cadences
- **Token Management**: Keep unused tokens organized by color for quick access
- **Visual Scanning**: Glance at your mat to quickly see which cadences are available
- **Communication**: Announce which cadence you're using so allies can plan around the effect

**Budget-Friendly Alternatives**:
- **No colored tokens?** Use different shaped objects (buttons, coins, paper clips) for each note
- **No tokens at all?** Use the dice method (7 d6 dice) or tally marks on paper
- **Minimalist**: Just write the note counts on paper and update as needed

**Why Minstrel Is Perfect for In-Person Play**: The class is built around accumulating and spending specific combinations of resources, which translates beautifully to physical tokens. Unlike abstract resources like mana, musical notes are discrete, countable, and combinable—perfect for tactile tracking. The act of building your note collection and then spending them in specific sequences mirrors the musical concept of building tension and resolving it, making the gameplay both mechanically satisfying and thematically immersive.`
    }
  },

  // Specializations
  specializations: {
    title: 'Minstrel Specializations',
    subtitle: 'Three Paths of Musical Mastery',

    description: `Every Minstrel chooses one of three specializations that define their musical style and magical focus. Each specialization offers unique passive abilities and influences your spell selection and playstyle.`,

    specs: [
      {
        id: 'battlechoir',
        name: 'Battlechoir',
        icon: 'spell_holy_crusaderstrike',
        color: '#DC143C',
        theme: 'War Songs & Aggressive Support',

        description: `Battlechoir Minstrels are battlefield commanders who turn combat into a symphony of destruction. Their war songs amplify ally damage, grant tactical advantages, and demoralize enemies. They favor drums, horns, and powerful vocals that can be heard over the chaos of battle.`,

        playstyle: 'Aggressive support, damage amplification, offensive buffs',

        strengths: [
          'Highest damage amplification for allies',
          'Strong offensive cadences',
          'Excellent for coordinated teams',
          'War drums provide bonus damage'
        ],

        weaknesses: [
          'Lower healing output than Soulsinger',
          'Requires allies to capitalize on buffs',
          'Less effective when team is scattered',
          'Vulnerable when focused'
        ],

        passiveAbilities: [
          {
            name: 'Harmonic Resonance',
            tier: 'Path Passive',
            description: 'When you complete a 4-note cadence, all allies within 30 feet gain +1d4 to their next attack or spell. This bonus stacks up to 3 times.',
            sharedBy: 'All Minstrels'
          },
          {
            name: 'War Anthem',
            tier: 'Specialization Passive',
            description: 'Your offensive cadences (Circle of Fifths, Phrygian Cadence, Neapolitan Sixth) grant all affected allies +2 to attack rolls for 2 turns. Additionally, when an ally scores a critical hit while affected by your buffs, you generate 1 random musical note.',
            uniqueTo: 'Battlechoir'
          }
        ],

        recommendedFor: 'Players who enjoy empowering their team, coordinated tactics, and aggressive playstyles'
      },

      {
        id: 'soulsinger',
        name: 'Soulsinger',
        icon: 'spell_holy_prayerofhealing',
        color: '#4169E1',
        theme: 'Healing Melodies & Emotional Magic',

        description: `Soulsingers are empathic healers who channel emotion through music. Their gentle melodies soothe wounds, calm fears, and restore hope. They understand that music touches the soul, and through this connection, they can heal both body and spirit. Soulsingers favor lutes, harps, and soft vocals.`,

        playstyle: 'Sustained healing, emotional manipulation, protective support',

        strengths: [
          'Strongest healing output',
          'Excellent sustained support',
          'Emotional manipulation abilities',
          'Can heal while building notes'
        ],

        weaknesses: [
          'Lower damage contribution',
          'Less burst healing than dedicated healers',
          'Requires mana management',
          'Vulnerable to interruption'
        ],

        passiveAbilities: [
          {
            name: 'Harmonic Resonance',
            tier: 'Path Passive',
            description: 'When you complete a 4-note cadence, all allies within 30 feet gain +1d4 to their next attack or spell. This bonus stacks up to 3 times.',
            sharedBy: 'All Minstrels'
          },
          {
            name: 'Soothing Melody',
            tier: 'Specialization Passive',
            description: 'Your healing cadences (Authentic Cadence, Picardy Third) heal for an additional 1d6 HP. Additionally, whenever you heal an ally, you generate 1 Tonic (I) note. When using a Lute or Harp, healing is increased by an additional +2.',
            uniqueTo: 'Soulsinger'
          }
        ],

        recommendedFor: 'Players who enjoy healing, supporting their team, and emotional roleplay'
      },

      {
        id: 'dissonance',
        name: 'Dissonance',
        icon: 'spell_shadow_psychicscream',
        color: '#8B008B',
        theme: 'Chaotic Sounds & Reality Warping',

        description: `Dissonance Minstrels have discovered that not all music is harmonious—and that chaos has its own terrible beauty. They wield discordant sounds, atonal melodies, and reality-warping frequencies that confuse, terrify, and control. Their music is an assault on the senses and the mind itself.`,

        playstyle: 'Crowd control, debuffs, chaotic effects, reality manipulation',

        strengths: [
          'Best crowd control capabilities',
          'Powerful debuffs and fear effects',
          'Unique reality-warping abilities',
          'Excels against grouped enemies'
        ],

        weaknesses: [
          'Lowest healing output',
          'Chaotic effects can be unpredictable',
          'Requires careful positioning',
          'Less effective against single targets'
        ],

        passiveAbilities: [
          {
            name: 'Harmonic Resonance',
            tier: 'Path Passive',
            description: 'When you complete a 4-note cadence, all allies within 30 feet gain +1d4 to their next attack or spell. This bonus stacks up to 3 times.',
            sharedBy: 'All Minstrels'
          },
          {
            name: 'Cacophony',
            tier: 'Specialization Passive',
            description: 'Your control cadences (Deceptive Cadence, Tritone Substitution) have their save DC increased by 2. Additionally, when an enemy fails a save against your cadence, all enemies within 10 feet must make a Wisdom save (DC 13) or become frightened for 1 turn. Dissonant sounds echo unpredictably.',
            uniqueTo: 'Dissonance'
          }
        ],

        recommendedFor: 'Players who enjoy control, debuffs, and unpredictable chaotic magic'
      }
    ]
  },

  // Example Spells - showcasing the spell wizard system
  exampleSpells: [
    // Builder Spells - Generate Musical Notes
    {
      id: 'minstrel_opening_chord',
      name: 'Opening Chord',
      description: 'Strike a resonant chord that generates foundational notes and deals minor sonic damage.',
      spellType: 'ACTION',
      icon: 'spell_holy_divinepurpose',
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
        durationType: 'instant'
      },

      resourceCost: {
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Resonare!',
        somaticText: 'Strum instrument or gesture musically'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d6',
        damageType: 'thunder',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '1d6',
            type: 'thunder'
          }
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'builder',
          generates: [
            { note: 'I', count: 2 },
            { note: 'V', count: 1 }
          ]
        }
      },

      tags: ['builder', 'basic', 'sonic', 'tonic-generator']
    },

    {
      id: 'minstrel_healing_hymn',
      name: 'Healing Hymn',
      description: 'Sing a soothing melody that heals an ally and generates subdominant notes.',
      spellType: 'ACTION',
      icon: 'spell_holy_heal',
      school: 'Abjuration',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 15,
        components: ['verbal'],
        verbalText: 'Melodic healing verse'
      },

      resolution: 'DICE',

      effects: {
        healing: {
          instant: {
            formula: '2d6+2',
            type: 'magical'
          }
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'builder',
          generates: [
            { note: 'IV', count: 2 },
            { note: 'I', count: 1 }
          ]
        },
        instrumentBonus: {
          lute: { healingBonus: 2 },
          harp: { healingBonus: 2 }
        }
      },

      tags: ['builder', 'healing', 'subdominant-generator', 'soulsinger']
    },

    {
      id: 'minstrel_war_drum',
      name: 'War Drum Beat',
      description: 'Beat a powerful rhythm that damages enemies and generates dominant notes.',
      spellType: 'ACTION',
      icon: 'ability_warrior_warcry',
      school: 'Evocation',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'sphere',
        aoeSize: 15
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 20,
        components: ['somatic'],
        somaticText: 'Beat drum or stomp rhythmically'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d4',
        damageType: 'thunder',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '2d4',
            type: 'thunder'
          }
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'builder',
          generates: [
            { note: 'V', count: 3 }
          ]
        },
        instrumentBonus: {
          drum: { damageBonus: '1d4' }
        }
      },

      tags: ['builder', 'aoe', 'damage', 'dominant-generator', 'battlechoir']
    },

    {
      id: 'minstrel_dissonant_shriek',
      name: 'Dissonant Shriek',
      description: 'Unleash a discordant scream that generates tension notes and frightens enemies.',
      spellType: 'ACTION',
      icon: 'spell_shadow_psychicscream',
      school: 'Enchantment',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        aoeType: 'sphere',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal'],
        verbalText: 'Piercing discordant scream'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'psychic',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '2d6',
            type: 'psychic'
          }
        },
        condition: {
          type: 'frightened',
          duration: 2,
          saveType: 'wisdom',
          saveDC: 14
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'builder',
          generates: [
            { note: 'VII', count: 2 },
            { note: 'II', count: 1 }
          ]
        }
      },

      tags: ['builder', 'aoe', 'fear', 'leading-tone-generator', 'dissonance']
    },

    // Resolving Spells - Consume Notes for Powerful Cadences
    {
      id: 'minstrel_perfect_cadence',
      name: 'Perfect Cadence',
      description: 'Complete a perfect harmonic progression (I→IV→V→I) that guarantees an ally\'s next attack will critically strike.',
      spellType: 'ACTION',
      icon: 'spell_holy_holybolt',
      school: 'Divination',
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
        durationType: 'timed',
        duration: 1,
        durationUnit: 'turns'
      },

      resourceCost: {
        mana: 30,
        components: ['verbal', 'somatic'],
        verbalText: 'Harmonic resolution phrase'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          type: 'guaranteed-crit',
          duration: 1,
          description: 'Next attack is guaranteed critical hit'
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'resolver',
          consumes: [
            { note: 'I', count: 2 },
            { note: 'IV', count: 1 },
            { note: 'V', count: 1 }
          ],
          cadenceName: 'Perfect Cadence'
        }
      },

      tags: ['resolver', 'cadence', 'buff', 'critical', 'battlechoir']
    },

    {
      id: 'minstrel_circle_of_fifths',
      name: 'Circle of Fifths',
      description: 'Weave an eternal loop of torment (V→I→VI→V) that traps enemies in relentless agony.',
      spellType: 'ACTION',
      icon: 'spell_fire_twilightflamebreath',
      school: 'Evocation',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'sphere',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'timed',
        duration: 3,
        durationUnit: 'turns'
      },

      resourceCost: {
        mana: 40,
        components: ['verbal', 'somatic'],
        verbalText: 'Cyclical harmonic phrase'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d4',
        damageType: 'thunder',
        scalingType: 'none'
      },

      effects: {
        damage: {
          dot: {
            formula: '2d4',
            type: 'thunder',
            duration: 3,
            interval: 'turn'
          }
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'resolver',
          consumes: [
            { note: 'V', count: 2 },
            { note: 'I', count: 1 },
            { note: 'VI', count: 1 }
          ],
          cadenceName: 'Circle of Fifths'
        }
      },

      tags: ['resolver', 'cadence', 'dot', 'aoe', 'battlechoir']
    },

    {
      id: 'minstrel_authentic_cadence',
      name: 'Authentic Cadence',
      description: 'Perform a grand finale (I→VI→III→I) that fortifies and heals all nearby allies.',
      spellType: 'ACTION',
      icon: 'spell_holy_prayerofhealing02',
      school: 'Abjuration',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        aoeType: 'sphere',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'turns'
      },

      resourceCost: {
        mana: 45,
        components: ['verbal', 'somatic'],
        verbalText: 'Triumphant finale verse'
      },

      resolution: 'DICE',

      effects: {
        healing: {
          instant: {
            formula: '1d8',
            type: 'magical'
          }
        },
        buff: {
          type: 'damage-reduction',
          value: 4,
          duration: 1,
          description: 'Reduce incoming damage by 4'
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'resolver',
          consumes: [
            { note: 'I', count: 2 },
            { note: 'VI', count: 1 },
            { note: 'III', count: 1 }
          ],
          cadenceName: 'Authentic Cadence'
        },
        instrumentBonus: {
          lute: { healingBonus: 2 },
          harp: { healingBonus: 2 }
        }
      },

      tags: ['resolver', 'cadence', 'healing', 'aoe', 'defensive', 'soulsinger']
    },

    {
      id: 'minstrel_tritone_substitution',
      name: 'Tritone Substitution',
      description: 'Unleash powerful dissonance (IV→I→V→VI) that binds and paralyzes a foe.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowwordpain',
      school: 'Enchantment',
      level: 6,

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
        duration: 1,
        durationUnit: 'turns'
      },

      resourceCost: {
        mana: 50,
        components: ['verbal', 'somatic'],
        verbalText: 'Dissonant binding phrase'
      },

      resolution: 'SAVE',

      effects: {
        condition: {
          type: 'paralyzed',
          duration: 1,
          saveType: 'wisdom',
          saveDC: 18
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'resolver',
          consumes: [
            { note: 'IV', count: 1 },
            { note: 'I', count: 1 },
            { note: 'V', count: 1 },
            { note: 'VI', count: 1 }
          ],
          cadenceName: 'Tritone Substitution'
        }
      },

      tags: ['resolver', 'cadence', 'control', 'paralyze', 'dissonance']
    },

    {
      id: 'minstrel_picardy_third',
      name: 'Picardy Third',
      description: 'Shift from darkness to light (I→VII→V→III), filling allies with renewed hope and resilience.',
      spellType: 'ACTION',
      icon: 'spell_holy_divineprovidence',
      school: 'Abjuration',
      level: 6,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        aoeType: 'sphere',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 55,
        components: ['verbal', 'somatic'],
        verbalText: 'Hopeful ascending melody'
      },

      resolution: 'DICE',

      effects: {
        healing: {
          instant: {
            formula: '2d6',
            type: 'magical'
          }
        },
        buff: {
          type: 'saving-throw',
          value: 2,
          duration: 3,
          description: '+2 to all saving throws'
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'resolver',
          consumes: [
            { note: 'I', count: 1 },
            { note: 'VII', count: 1 },
            { note: 'V', count: 1 },
            { note: 'III', count: 1 }
          ],
          cadenceName: 'Picardy Third'
        }
      },

      tags: ['resolver', 'cadence', 'healing', 'buff', 'saves', 'soulsinger']
    },

    // Utility Spell
    {
      id: 'minstrel_song_of_rest',
      name: 'Song of Rest',
      description: 'Perform a calming melody that allows allies to recover during a short rest.',
      spellType: 'RITUAL',
      icon: 'spell_holy_silence',
      school: 'Abjuration',
      level: 3,

      typeConfig: {
        castTime: 10,
        castTimeType: 'MINUTES'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        aoeType: 'sphere',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'hours'
      },

      resourceCost: {
        mana: 20,
        components: ['verbal', 'somatic'],
        verbalText: 'Soothing rest melody'
      },

      resolution: 'DICE',

      effects: {
        healing: {
          instant: {
            formula: '2d8',
            type: 'magical',
            description: 'Bonus healing during short rest'
          }
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'builder',
          generates: [
            { note: 'I', count: 1 },
            { note: 'IV', count: 1 }
          ]
        }
      },

      tags: ['utility', 'ritual', 'healing', 'rest', 'soulsinger']
    }
  ]
};


