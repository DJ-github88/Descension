/**
 * Minstrel Class Data
 *
 * Complete class information for the Minstrel — a conductor of reality's death rattle
 * who tears magic from dying dimensions through bone and grief instruments.
 * Music is not art. It is violation. Every note is theft. Every cadence is mutilation.
 */

export const MINSTREL_DATA = {
  id : "minstrel",
  name: "Minstrel",
  icon: "fas fa-music",
  role: "Support",
  damageTypes: ["wyrd", "storm"],

  // Overview section
  overview: {
    originStory: `The Merryn sailor Lyris sang a sacred sea-symphony to the churning gales of the Iceheart Sea, calming the waves so her ice-locked vessel could dock at Merrowport. The song was beautiful, but it was a transaction with the deep tides, drawing the freezing currents into her lungs.

The ocean mother accepted the song, but she stole Lyris's spoken voice. The Minstrel can only communicate through melodic whispers or the strings of her lute. Attempting to scream or speak normally causes her throat to bleed and her lungs to fill with salt-water, her melodies carrying the physical weight of the gales.

Let the chorus rise. The sea has taken your voice, but your song can still shatter the glaciers. Sing until the world listens.`,
    title: "The Minstrel",
    subtitle: "Conductor of Reality's Death Rattle",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Minstrel does not play music — they tear it screaming from the corpses of dying realities. Each note is a stolen fragment of a collapsing dimension, hoarded and combined into cadences that violate the laws of existence.

**Core Mechanic**: Cast builder spells → Harvest musical notes (I–VII) from unraveling planes → Combine notes into cadences → Unleash catastrophic effects that reshape the battlefield

**Resource**: Musical Notes (7 types, stack up to 5 each), Mana — and the slow erosion of your own body

**Playstyle**: Combo-building support with sustained power escalation through accumulated sonic atrocities

**Best For**: Players who enjoy combo systems, the creeping dread of building toward devastation, and the martyrdom of protecting everyone except themselves`,
    },

    description: `There is nothing beautiful about what the Minstrel does. They play instruments crafted from bone and grief, each chord progression a fresh wound torn in the fabric of existence. Their magic is not art — it is a fundamental violation of physics that demands biological payment. Every note they collect is a splinter stolen from a dying reality, and every cadence they resolve is an act of cosmic mutilation that rewrites the battlefield in blood and resonance. The music should not exist. It exists because the Minstrel forces it to, and the world pays the price.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE GENESIS**
The minstrel's auditory resonance was born on the storm-lashed decks of <LoreLink termId="merrowport">Merrowport</LoreLink>. A Merryn sailor named **Lyris** sang to the churning gales, using the sea's own frequency to steady her vessel. The price of this musical balance was her spoken voice. The sea-gales stole her spoken speech, leaving her able to communicate only in melodic whispers that crumbled when she tried to scream.

**CITIES & CIVIL RECEPTION**
Minstrels are highly celebrated in the floating taverns of <LoreLink termId="merrowport">Merrowport</LoreLink> and the nomadic yurt-camps of the steppe.

**RACES & CULTURAL AFFILIATION**
The class is heavily practiced by the Merryn humans and the <LoreLink termId="myrathil">Breakers-Born Myrathil</LoreLink>.

**NOTABLE FIGURES**
* **Lyris the Tide-Singer**: The sailor whose melodies calmed the Iceheart Sea but left her throat bleeding if she tried to speak.
* **Aurelius the Tide-Singer**: A Myrathil bard whose songs could resonate with the deep rifts, opening safe passages between drift-ice.`
    },

    signatureQuote: {
      text: '"You think music is beauty. You are wrong. Music is resonance — the frequency at which things break. I have found the note that shatters ice. I am looking for the one that shatters gods."',
      speaker: 'Lyris the Tide-Singer',
      context: 'Her lute, recovered from the Iceheart Sea, had this carved into its soundboard'
    },

    philosophy: {
      coreTenet: 'Sound is older than light. Before the sun, before the stars, there was vibration — the hum of potential, the frequency of emptiness, the note that preceded creation. The Minstrel does not make music. They remember the original note, the one that started everything, and they play it backward.',
      relationship: 'A Minstrel\'s power comes from the resonance of dying realities. When a timeline collapses, it releases a burst of energy — a death-cry that exists as pure frequency. Minstrels harvest these frequencies and store them as musical notes, which they combine into Cadences that violate natural law. The relationship is parasitic: Minstrels cannot create music; they must harvest it from the death of other possibilities. Their art is built on the grave of what could have been.',
      paradox: 'The Minstrel seeks the perfect Cadence — the combination of notes that will produce the most beautiful sound ever heard. But the most beautiful sounds come from the most catastrophic collapses. The Minstrel is therefore incentivized to seek out destruction, to position themselves at the epicenter of collapsing realities, to drink in the death-rattle of dying timelines. They are artists of catastrophe, and their masterpiece is always someone else\'s tragedy.'
    },

    currentCrisis: `The Iceheart Sea has fallen silent. For the first time in recorded history, the tides have stopped singing. The Merryn sailors who navigate by the ocean\'s frequency report total silence — no subsonic rhythm, no deep-bass pulse, nothing. The sea is still moving, but it makes no sound.

The Minstrels of Merrowport are terrified. The ocean\'s song was the oldest continuous frequency in the known world — it had been playing for longer than any Minstrel could measure. Its silence means something. Lyris the Tide-Singer, who understood the sea better than anyone, has not been seen since the silence began. Some Minstrels believe she dove into the silent water to find the lost note. Others believe she fled because she knew what the silence meant: the Iceheart Sea is dying. And if a body of water that large can die, so can everything else.`,

    meaningfulTradeoffs: `Minstrels trade their own voice for their music. The stolen frequencies degrade the larynx — every Cadence performed causes cumulative damage to the vocal cords. Senior Minstrels speak in hoarse whispers, if they can speak at all. Their voices are replaced by their instruments; they communicate through hummed melodies, tapped rhythms, and the expressive language of lute-strings. The irony is not lost on them: they are masters of sound who have sacrificed their own.`,

    classSpecificLocations: [
      {
        name: 'The Tide-Chamber',
        locationId: 'merrowport',
        description: 'A submerged stone amphitheater beneath the Merrowport docks, accessible only by diving through a flooded passage. The chamber is designed to amplify the ocean\'s natural frequencies — Minstrels would sit here for hours, letting the sea\'s song fill them. The chamber is now completely silent, the water still and dead.',
        purpose: 'Meditation chamber and frequency-harvesting site',
        status: 'Silent — the Minstrels maintain a vigil, hoping the song returns'
      }
    ],

    combatRole: {
      title: "Combat Role",
      content: `The Minstrel is a fragile conductor who stands at the epicenter of atrocity, weaponizing stolen frequencies to reshape the battlefield:

**Cadence Architect**: No other class offers the Minstrel's note-building strategic depth. Through builder spells, they harvest musical notes from collapsing planes, then resolve them into devastating cadences — Perfect Cadence guarantees critical hits, Deceptive Cadence stuns enemies, Authentic Cadence heals the entire party. This is the ONLY combo-building support with cadence mechanics in existence.

**Martyr's Bargain**: The Minstrel protects everyone except themselves. They CANNOT self-heal — all healing targets allies only. They require an instrument to cast; disarmed, they are utterly powerless. While performing any active song, they suffer -2 DR, the music demanding total vulnerability. Silence effects render them useless. They are a conductor stripped of armor, bleeding for the rhythm that keeps their allies alive.

**Strengths**:
- Unmatched combo-building support with cadence resolution
- Guarantees critical hits through Perfect Cadence (I-IV-V-I)
- Powerful sustained healing for the party (never for themselves)
- Area control through Deceptive Cadence and Tritone Substitution
- Unique strategic depth through 10 distinct cadence progressions

**Weaknesses**:
- Requires an instrument to cast (Instrument Dependency — disarmed = no spells, no hope)
- Cannot self-heal — all healing targets allies only, leaving the Minstrel to rot
- -2 DR while performing any active song — the music demands total vulnerability
- Combo system requires planning and foresight across multiple turns
- Vulnerable to silence and interruption effects — rendered completely useless
- Fragile without armor, fragile with it, fragile always

The Minstrel shines when they can endure long enough to unleash a prepared cadence at the exact moment their party needs it most — a guaranteed crit on the killing blow, a desperate party heal when death is certain, a stun that buys one more round of survival. They are the doomed conductor of an orchestra that plays on only because they refuse to stop bleeding.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing a Minstrel is about reading the rhythm of battle and conducting your party to victory. Key strategic considerations:

**Note Management**:
- Each spell generates specific musical notes (I, II, III, IV, V, VI, VII)
- Notes stack up to 5 of each type
- Notes persist between combats but decay slowly (1 note per minute out of combat, oldest first)
- Managing your note economy is crucial to having the right cadences available

**Chord Progression Planning**:
- **Perfect Cadence (I-IV-V-I)**: Guarantees ally critical hit - save for crucial moments
- **Deceptive Cadence (IV-VII-V-IV)**: Stuns enemies - use for crowd control
- **Circle of Fifths (V-I-VI-V)**: Damage over time - apply early in fights
- **Plagal Cadence (VI-V-I-III)**: Speed boost - use for repositioning or pursuit
- **Half Cadence (VII-V-IV-VI)**: Shield - preemptive defense before big attacks
- **Authentic Cadence (I-VI-III-I)**: Healing and damage reduction - sustain through burst
- **Phrygian Cadence (V-IV-I-VII)**: Attack advantage - empower damage dealers
- **Neapolitan Sixth (III-I-IV-V)**: Crit chance boost - stack with Perfect Cadence

**Instrument Selection**:
Different instruments provide different bonuses and affect your playstyle:
- **Lute/Harp**: Bonus to healing and charm effects
- **Drum**: Bonus to damage and buff duration
- **Flute/Horn**: Increased range and area of effect
- **Voice**: No equipment required, bonus to all effects but shorter range

**Specialization Synergies**:
- **Battlechoir**: Aggressive support, damage amplification, war songs — Perfect Cadence, Circle of Fifths, Phrygian Cadence, Neapolitan Sixth
- **Soulsinger**: Healing focus, emotional manipulation, protective melodies — Authentic Cadence, Picardy Third, Plagal Cadence
- **Dissonance**: Debuffs and control, chaotic magic, reality-warping sounds — Deceptive Cadence, Half Cadence, Tritone Substitution

**Team Dynamics**:
- Works best with coordinated teams who can capitalize on buffs
- Synergizes with classes that benefit from critical hits (Battlechoir)
- Provides sustained healing for prolonged encounters (Soulsinger)
- Offers crowd control for tactical teams (Dissonance)`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Perfect Cadence",
      content: `**The Setup**: You're a Minstrel (Battlechoir specialization) with a war drum, facing a group of bandits (5 bandits + 1 bandit leader). Your party is with you. Starting Notes: I(1), V(1) from a previous short rest. Starting Mana: 50/60. Your goal: Build musical notes through builder spells, then resolve them into powerful cadences to support your party.

**Starting State**: Notes: I(1), V(1) | Mana: 50/60 | HP: 60/60

**Turn 1 - Building Notes (Notes: I(1), V(1) → I(1), V(3), VII(1))**

*You raise your war drum, its surface etched with ancient runes. The bandits charge. You begin to PLAY.*

**Your Action**: Cast "Inspiring Rhythm" on your party (3 mana, builder spell)
**Effect**: Grant +1 to attack rolls for 1 round (allies within 15 ft)
**Musical Notes Generated**: V(2) + VII(1)

*BOOM. BOOM. BOOM. Your drum echoes across the battlefield. Your party feels the rhythm, moving with newfound confidence.*

**Notes**: I(1), V(1) + V(2), VII(1) = **I(1), V(3), VII(1)**
**Mana**: 50 - 3 = 47/60

**Your Party's Tank**: "I feel faster! Stronger!"
**You**: "That's the rhythm of war. Let it guide you."

**Bandit #1's Turn**: Attacks tank → Miss! (tank has +1 attack from your buff, turning a near-miss into a clean dodge)

*The bandit's sword clangs off the tank's armor. The rhythm protected him.*

**Current State**: Notes: I(1), V(3), VII(1) | Mana: 47/60

**Turn 2 - More Building (Notes: I(1), V(3), VII(1) → I(2), III(2), V(3), VII(1))**

**Your Action**: Cast "Harmonic Strike" at Bandit #2 (4 mana, builder spell)
**Attack Roll**: d20+5 → [16] = Hit!
**Damage**: 1d8 bludgeoning → [6] = **6 damage**
**Musical Notes Generated**: III(2) + I(1)

*You strike your drum with a thunderous CRASH. The sound wave SLAMS into the bandit, knocking him back.*

**Notes**: I(1), V(3), VII(1) + III(2), I(1) = **I(2), III(2), V(3), VII(1)**
**Mana**: 47 - 4 = 43/60

**Bandit #2**: 6 damage taken, staggered

**Your Party's Mage**: Casts Fireball → 35 damage to 3 bandits

**Current State**: Notes: I(2), III(2), V(3), VII(1) | Mana: 43/60

**Turn 3 - Building to Cadence (Notes: I(2), III(2), V(3), VII(1) → I(3), III(2), V(4), VII(2))**

*You have I(2), V(3). You need I(2) and IV(1) and V(1) for the Perfect Cadence. You have the I and V — but you need an IV note.*

**Your Action**: Cast "Melancholy Melody" on enemies (8 mana, builder spell)
**Effect**: -1 to enemy attack rolls for 2 rounds (20 ft radius)
**Musical Notes Generated**: VI(2) + IV(1)

*You play a haunting melody. The bandits falter, their strikes losing precision.*

**Notes**: I(2), III(2), V(3), VII(1) + VI(2), IV(1) = **I(2), III(2), IV(1), V(3), VI(2), VII(1)**
**Mana**: 43 - 8 = 35/60

**Your Party's Tank**: "They're weakening! I can see it in their eyes."
**You**: "Good. Because I'm about to play the Perfect Cadence. Next attack—make it count."

**Current State**: Notes: I(2), III(2), IV(1), V(3), VI(2), VII(1) | Mana: 35/60

**Turn 4 - PERFECT CADENCE (Notes: I(2), III(2), IV(1), V(3), VI(2), VII(1) → I(0), III(2), IV(0), V(2), VI(2), VII(1))**

*You have I(2), IV(1), V(3). Time to play the PERFECT CADENCE: I-IV-V-I. This will guarantee your tank's next attack is a critical hit.*

**Your Action**: Play "Perfect Cadence" targeting your tank (16 mana, resolver spell)
**Notes Consumed**: I(2), IV(1), V(1) = 4 notes total
**Effect**: Target's next attack is a guaranteed critical hit

*You play the progression: BOOM (I). BOOM-BOOM (IV). BOOM-BOOM-BOOM (V). BOOM (I). The rhythm is PERFECT. The sound resonates with reality itself. Your tank's weapon GLOWS with harmonic energy.*

**Notes**: I(2), III(2), IV(1), V(3), VI(2), VII(1) - I(2) - IV(1) - V(1) = **I(0), III(2), V(2), VI(2), VII(1)**
**Mana**: 35 - 16 = 19/60

**Your Party's Tank**: "My sword... it's SINGING!"
**You**: "Strike NOW!"

**Your Party's Tank's Turn**: Attacks Bandit Leader
**Attack Roll**: d20+6 → [12] = Hit! → **GUARANTEED CRITICAL HIT** (Perfect Cadence)
**Damage**: 2d8+5 → [7, 8] + 5 = 20 damage → **DOUBLED** = **40 damage!**

*The tank's sword strikes with the force of a thunderclap. The bandit leader is CRUSHED.*

**Bandit Leader**: 40 damage taken, DEAD

**Your Party's Mage**: "FORTY DAMAGE! What did you DO?"
**You**: "Perfect Cadence. I-IV-V-I. The most powerful chord progression in music. Guarantees a critical hit."

**Current State**: Notes: I(0), III(2), V(2), VI(2), VII(1) | Mana: 19/60

**Turn 5 - Rebuilding Notes**

*The bandit leader is dead. Four bandits remain. Time to rebuild your notes.*

**Your Action**: Cast "Opening Chord" at Bandit #5 (4 mana, builder spell)
**Attack Roll**: d20+5 → [17] = Hit!
**Damage**: 1d6 lightning → [5] = **5 storm damage**
**Musical Notes Generated**: I(2) + V(1)

**Notes**: I(0), III(2), V(2), VI(2), VII(1) + I(2), V(1) = **I(2), III(2), V(3), VI(2), VII(1)**
**Mana**: 19 - 4 = 15/60

**Your Party's Rogue**: Sneak attacks Bandit #3 → DEAD
**Your Party's Mage**: Casts Fire Bolt → Bandit #4 DEAD

**Two bandits remain**

**Current State**: Notes: I(2), III(2), V(3), VI(2), VII(1) | Mana: 15/60

**Turn 6 - Finishing the Fight**

**Your Action**: Cast "Harmonic Strike" at Bandit #6 (4 mana, builder spell)
**Attack Roll**: d20+5 → [14] = Hit!
**Damage**: 1d8 bludgeoning → [6] = **6 damage**
**Musical Notes Generated**: III(2) + I(1)
**Result**: Bandit #6 DEAD

**Notes**: I(2), III(2), V(3), VI(2), VII(1) + III(2), I(1) = **I(3), III(4), V(3), VI(2), VII(1)**
**Mana**: 15 - 4 = 11/60

**Your Party's Tank**: Attacks Bandit #5 → DEAD

**Combat Over**

*You lower your drum. The battlefield is silent except for the fading echoes of your music.*

**Your Party's Tank**: "That Perfect Cadence... I've never hit that hard in my life. Forty damage on a critical."
**You**: "I spent four musical notes to play it: two I notes, one IV, and one V. The Perfect Cadence requires I(2), IV(1), V(1) and guarantees your next attack is a critical hit. I had been building those notes through my builder spells — Opening Chord generates I(2)+V(1), Harmonic Strike generates III(2)+I(1), and Melancholy Melody generates VI(2)+IV(1)."
**Your Party's Mage**: "So you were building up to that the whole fight?"
**You**: "Exactly. I started with I(1), V(1) from a short rest. By turn 3, I had I(2), IV(1), V(3) — enough for the Perfect Cadence. Now I have I(3), III(4), V(3), VI(2), VII(1) banked for the next fight."
**Your Party's Rogue**: "What other cadences can you play?"
**You**: "Many. Deceptive Cadence (IV(2), VII(1), V(1)) stuns enemies. Circle of Fifths (V(2), I(1), VI(1)) deals damage over time. Plagal Cadence (VI(1), V(1), I(1), III(1)) gives speed boosts. Each requires specific notes, so I have to plan ahead."

**Final State**: Notes: I(3), III(4), V(3), VI(2), VII(1) | Mana: 11/60 | HP: 60/60

**The Lesson**: Minstrel gameplay is about:
1. **Note Building**: Cast builder spells to generate musical notes — each spell produces 2-3 notes of specific types
2. **Note Stacking**: Notes stack up to 5 of each type (I through VII), and persist between combats
3. **Cadence Planning**: Perfect Cadence requires I(2), IV(1), V(1) — 4 notes total — and guarantees a critical hit
4. **Resource Management**: Started with I(1), V(1), built to I(2), IV(1), V(3), spent 4 notes for cadence
5. **Builder Spells**: Opening Chord (I(2)+V(1)), Harmonic Strike (III(2)+I(1)), Inspiring Rhythm (V(2)+VII(1)), Melancholy Melody (VI(2)+IV(1))
6. **Cadence Impact**: Perfect Cadence guaranteed tank's critical hit: 20 damage → 40 damage (doubled)
7. **Note Persistence**: Ended with I(3), III(4), V(3), VI(2), VII(1) banked for next fight

You're not a simple support caster. You're a MUSICAL CONDUCTOR. You build notes through builder spells, stack them up, then RESOLVE them into powerful cadences. The Perfect Cadence (I(2)+IV(1)+V(1)) guarantees a critical hit. The Deceptive Cadence (IV(2)+VII(1)+V(1)) stuns enemies. Each cadence requires specific notes, so you have to PLAN AHEAD. Cast the right builder spells to generate the notes you need, then unleash the cadence at the perfect moment. Your party fights to the rhythm of your music. You are the MAESTRO of the battlefield.`,
    },
  },

  // Resource System
  resourceSystem: {
    title: "Musical Combo System",
    subtitle: "Harvesting the Death Cries of Collapsing Realities",

    description: `The Minstrel's resource system is built on a foundation of cosmic theft. Every musical note is a splinter harvested from a dimension in its final moments of collapse — a dying reality's last frequency, captured and compressed into something a mortal mind can barely comprehend. Builder spells gouge these fragments from the fabric of existence, accumulating them in a terrible ledger. Resolving spells — cadences — then spend these hoarded fragments to commit fresh atrocities: guaranteeing critical wounds, stunning minds with impossible harmonics, or stitching allies back together through frequencies that should have stayed silent. Mastering the Minstrel means accepting that your power is stolen from the dead, and that every cadence you play hastens the entropy of everything around you.`,

    resourceBarExplanation: {
      title: "Understanding Your Musical Notes Interface",
      content: `**What You See**: The Minstrel's interface displays a MUSICAL STAFF with seven note positions (I–VII), each showing how many notes of that type you have stacked (0–5). Available cadences are highlighted below the staff when you have the required notes.

**Staff Layout**:
- **Seven Note Positions**: I through VII arranged horizontally, each with a thematic color (gold, blue, purple, green, red, dark blue, white)
- **Note Stacks**: Each position shows 0–5 notes; filled positions glow, empty positions are dimmed
- **Cadence Buttons**: Below the staff — green when available, gray when missing notes. Hovering shows required notes, current notes, and the effect

**Key Interactions**:
- **Casting a builder spell**: Note symbols fly to the staff and add to the appropriate stacks (e.g., "+1 V, +1 VII")
- **Playing a cadence**: Notes drain from the staff in sequence, a chord progression plays, and the effect fires
- **Out of combat**: A decay timer shows when the next note will fade (1 note per minute, oldest first)
- **Hovering a cadence**: Shows "Required: I(2), IV(1), V(1)" vs "You have: I(3), IV(1), V(1)" so you can plan your next cast`,
    },

    mechanics: {
      title: "How It Works",
      content: `**Musical Notes**: The foundation of Minstrel magic

**Builder Spells** generate specific musical notes:
- Each spell generates 1-3 notes of specific types
- Notes stack up to 5 of each type (I, II, III, IV, V, VI, VII)
- Notes persist between combats
- Notes decay at 1 per minute when out of combat (oldest note first; if tied, lowest numeral)

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
- **Voice**: No equipment needed, +1 to all effects, -10 ft range`,
    },

    musicalNotesTable: {
      title: "Musical Notes System",
      headers: ["Note", "Function", "Thematic Role", "Generated By"],
      rows: [
        [
          "I (Tonic)",
          "Foundation",
          "Stability and home",
          "Basic attacks, defensive spells",
        ],
        [
          "II (Supertonic)",
          "Mild Tension",
          "Creates dissonance",
          "Debuff and control spells",
        ],
        [
          "III (Mediant)",
          "Color",
          "Emotional depth",
          "Charm and emotion spells",
        ],
        [
          "IV (Subdominant)",
          "Movement",
          "Forward motion",
          "Support and healing spells",
        ],
        [
          "V (Dominant)",
          "Strong Tension",
          "Demands resolution",
          "Offensive spells",
        ],
        [
          "VI (Submediant)",
          "Relative Minor",
          "Melancholy and depth",
          "Fear and sorrow spells",
        ],
        [
          "VII (Leading Tone)",
          "Urgent Tension",
          "Pulls to tonic",
          "Finisher and climax spells",
        ],
      ],
    },

    chordProgressionsTable: {
      title: "Chord Progressions & Cadences",
      headers: ["Progression", "Name", "Sequence", "Effect", "Tactical Use"],
      rows: [
        [
          "Perfect Cadence",
          "Harmonious Resolution",
          "I→IV→V→I",
          "Ally's next attack is guaranteed critical hit",
          "Save for boss damage phases",
        ],
        [
          "Deceptive Cadence",
          "Enchanter's Trick",
          "IV→VII→V→IV",
          "Disorient enemy (-2 attacks/saves, DC 15 Spirit save)",
          "Interrupt dangerous casts",
        ],
        [
          "Circle of Fifths",
          "Eternal Torment",
          "V→I→VI→V",
          "3d6+spirit DoT for 3 turns (30 ft radius)",
          "Apply early to groups",
        ],
        [
          "Plagal Cadence",
          "Sacred Ascent",
          "VI→V→I→III",
          "+20 ft speed, +2 Dex for 2 rounds",
          "Repositioning or pursuit",
        ],
        [
          "Half Cadence",
          "Arcane Shield",
          "VII→V→IV→VI",
          "2d6+spirit shield for 2 rounds (15 ft radius)",
          "Pre-cast before big attacks",
        ],
        [
          "Authentic Cadence",
          "Grand Finale",
          "I→VI→III→I",
          "-4 damage taken, restore 4d6+spirit HP (20 ft radius)",
          "Survive burst damage",
        ],
        [
          "Phrygian Cadence",
          "Ancient Resolve",
          "V→IV→I→VII",
          "Advantage on attacks for 2 turns",
          "Boost damage dealers",
        ],
        [
          "Neapolitan Sixth",
          "Mystical Precision",
          "III→I→IV→V",
          "+2 crit chance for 2 rounds",
          "Stack with other crit buffs",
        ],
        [
          "Tritone Substitution",
          "Dissonant Chains",
          "IV→I→V→VI",
          "Paralyze enemy (DC 18 Spirit save, 30 ft)",
          "Lock down priority targets",
        ],
        [
          "Picardy Third",
          "Triumph of Light",
          "I→VII→V→III",
          "+2 to saves, restore 6d6+spirit HP (20 ft)",
          "Counter debuff-heavy enemies",
        ],
      ],
    },

    strategicConsiderations: {
      title: "Strategic Considerations",
      content: `**Early Combat (Turns 1-3)**: Focus on building notes with efficient builder spells. Prioritize notes for your most-needed cadences.

**Mid Combat (Turns 4-6)**: Begin resolving cadences. Use defensive cadences (Half Cadence, Authentic Cadence) to sustain your party, or offensive ones (Circle of Fifths, Phrygian Cadence) to pressure enemies.

**Late Combat (Turns 7+)**: Unleash your most powerful cadences. Perfect Cadence can secure kills, Tritone Substitution can lock down remaining threats.

**Between Combats**: Maintain 2-3 notes of each type as a "baseline" for quick cadence access. Let excess notes decay naturally.

**Instrument Choice**:
- **Lute** for healing-focused builds (Soulsinger)
- **War Drum** for aggressive support (Battlechoir)
- **Flute** for ranged safety and large groups
- **Voice** for versatility when you can't carry instruments`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "Physical Tracking for Tabletop Play",
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
Cost: I(2), IV(1), V(1) = 4 notes total
Effect: Ally's next attack = CRITICAL HIT
Use: Boss damage phases, guaranteed kills

CIRCLE OF FIFTHS (V-I-VI-V)
Cost: V(2), I(1), VI(1) = 4 notes total
Effect: 3d6+spirit DoT for 3 turns (30 ft radius)
Use: Apply early to enemy groups

DECEPTIVE CADENCE (IV-VII-V-IV)
Cost: IV(2), VII(1), V(1) = 4 notes total
Effect: Disorient enemy (-2 attacks/saves for 1 round, DC 15 Spirit save)
Use: Interrupt dangerous casts

AUTHENTIC CADENCE (I-VI-III-I)
Cost: I(2), VI(1), III(1) = 4 notes total
Effect: -4 damage taken, restore 4d6+spirit HP (20 ft)
Use: Survive burst damage

PLAGAL CADENCE (VI-V-I-III)
Cost: VI(1), V(1), I(1), III(1) = 4 notes total
Effect: +20 ft speed, +2 Dex for 2 rounds
Use: Repositioning or pursuit

HALF CADENCE (VII-V-IV-VI)
Cost: VII(1), V(1), IV(1), VI(1) = 4 notes total
Effect: 2d6+spirit shield for 2 rounds (15 ft radius)
Use: Pre-cast before big attacks

PHRYGIAN CADENCE (V-IV-I-VII)
Cost: V(1), IV(1), I(1), VII(1) = 4 notes total
Effect: Advantage on attacks for 2 rounds
Use: Boost damage dealers

NEAPOLITAN SIXTH (III-I-IV-V)
Cost: III(1), I(1), IV(1), V(1) = 4 notes total
Effect: +2 crit chance for 2 rounds
Use: Stack with Perfect Cadence

TRITONE SUBSTITUTION (IV-I-V-VI)
Cost: IV(1), I(1), V(1), VI(1) = 4 notes total
Effect: Paralyze enemy (DC 18 Spirit save)
Use: Lock down priority targets

PICARDY THIRD (I-VII-V-III)
Cost: I(1), VII(1), V(1), III(1) = 4 notes total
Effect: +2 to saves, restore 6d6+spirit HP (20 ft)
Use: Counter debuff-heavy enemies

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
• Opening Chord → I(2) + V(1)
• Harmonic Strike → III(2) + I(1)
• Inspiring Rhythm → V(2) + VII(1)
• Uplifting Rhythm → II(1) + VI(2)
• Melancholy Melody → VI(2) + IV(1)
• Climactic Crescendo → VII(2) + V(1)
• Healing Hymn → IV(2) + I(1)
• War Drum Beat → V(1) + VI(2)
• Dissonant Shriek → VII(3) + II(1)
• Song of Rest → I(1) + IV(1)

RESOLVER SPELLS (Consume Notes):
• Minor Cadence → IV(1) + I(1)
• Soothing Melody → VII(1) + III(1)
• Resolving Strike → I(1) + V(1)
• Mending Cadence → IV(1) + I(1)
\`\`\`

**Cadence Planning**:

Before combat, decide which cadences you want to prioritize:
- **Offensive Build**: Focus on generating V, I for Perfect Cadence and Circle of Fifths
- **Defensive Build**: Focus on generating I, VI, III for Authentic Cadence and Plagal Cadence
- **Control Build**: Focus on generating IV, VII, V for Deceptive Cadence and Half Cadence
- **Critical Build**: Focus on generating III, I, IV for Neapolitan Sixth, stack with Perfect Cadence
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

**Why Minstrel Is Perfect for In-Person Play**: The class is built around accumulating and spending specific combinations of resources, which translates beautifully to physical tokens. Unlike abstract resources like mana, musical notes are discrete, countable, and combinable—perfect for tactile tracking. The act of building your note collection and then spending them in specific sequences mirrors the musical concept of building tension and resolving it, making the gameplay both mechanically satisfying and thematically immersive.`,
    },

    // Cadence Matrix — the 10 chord progressions a Minstrel can resolve.
    // Structured counterpart to `chordProgressionsTable` (which is the
    // human-readable table). Each entry is shaped to be consumed directly
    // by `cadenceToSpell.js` to render a UnifiedSpellCard tooltip, and by
    // `MinstrelResourceBar.jsx` to render ready/locked cadence chips.
    //
    // `notes` is a map of numeral → count consumed, e.g. { I: 2, IV: 1, V: 1 }
    // for the Perfect Cadence (matches the in-person tracking card).
    cadenceMatrix: {
      title: "Cadence Matrix",
      subtitle: "The 10 Resolvable Progressions",
      description: `Every Minstrel can resolve any of the ten cadences provided they have banked the required notes. Cadences are not learned — they are inherent to the mathematics of stolen frequencies. Bank the notes through builder spells, then resolve the cadence to commit its atrocity.`,
      baseManaCost: 16,
      baseRange: 60,

      entries: [
        {
          id: "perfect_cadence",
          name: "Perfect Cadence",
          epithet: "Harmonious Resolution",
          sequence: "I→IV→V→I",
          notes: { I: 2, IV: 1, V: 1 },
          damageTypes: ["storm"],
          targetType: "single_ally",
          range: 60,
          primaryEffect: "buff",
          secondaryEffect: "guaranteed_crit",
          effectDescription: "Target ally's next attack is a guaranteed critical hit. The progression resolves the dominant tension (V) back onto the tonic (I), and reality rewards the resolution with impossible precision.",
          flavorText: "BOOM. BOOM-BOOM. BOOM-BOOM-BOOM. BOOM. The rhythm is PERFECT — and the weapon in your ally's hand begins to sing.",
          tacticalUse: "Save for boss damage phases and guaranteed kills.",
        },
        {
          id: "deceptive_cadence",
          name: "Deceptive Cadence",
          epithet: "Enchanter's Trick",
          sequence: "IV→VII→V→IV",
          notes: { IV: 2, VII: 1, V: 1 },
          damageTypes: ["wyrd"],
          targetType: "area",
          range: 60,
          aoeShape: "circle",
          aoeParameters: { radius: 20 },
          primaryEffect: "control",
          secondaryEffect: "disoriented",
          effectDescription: "Disorient every enemy in a 20 ft radius: -2 to attacks and saves for 1 round. DC 15 Spirit save negates. The ear refuses the lie the progression tells — V resolves to IV instead of I, and the mind buckles.",
          flavorText: "An impossible resolution. The chord that promised home delivers exile, and the enemy's grip on reality slips a quarter-tone sideways.",
          tacticalUse: "Interrupt dangerous casts and shut down clusters.",
        },
        {
          id: "circle_of_fifths",
          name: "Circle of Fifths",
          epithet: "Eternal Torment",
          sequence: "V→I→VI→V",
          notes: { V: 2, I: 1, VI: 1 },
          damageTypes: ["storm"],
          targetType: "area",
          range: 60,
          aoeShape: "circle",
          aoeParameters: { radius: 30 },
          primaryEffect: "damage",
          secondaryEffect: "dot",
          effectDescription: "Deal 3d6 + Spirit storm damage and apply a damage-over-time effect (3d6 + Spirit per turn) for 3 turns to every creature in a 30 ft radius. The progression never resolves — it spirals endlessly through fifths, and so does the pain.",
          flavorText: "The progression eats its own tail. Each fifth calls the next, and the next, and the next — a wheel of resonance that grinds whatever it touches.",
          tacticalUse: "Apply early to grouped enemies for sustained pressure.",
        },
        {
          id: "plagal_cadence",
          name: "Plagal Cadence",
          epithet: "Sacred Ascent",
          sequence: "VI→V→I→III",
          notes: { VI: 1, V: 1, I: 1, III: 1 },
          damageTypes: ["ember"],
          targetType: "single_ally",
          range: 60,
          primaryEffect: "buff",
          secondaryEffect: "haste",
          effectDescription: "Target ally gains +20 ft movement speed and +2 Dexterity for 2 rounds. The 'Amen' progression lifts the listener — feet leave the ground, if only for a moment.",
          flavorText: "The amen. Not a victory, but the breath before victory — the moment the chorus inhales and the body remembers it can move.",
          tacticalUse: "Repositioning, pursuit, escaping an AOE.",
        },
        {
          id: "half_cadence",
          name: "Half Cadence",
          epithet: "Arcane Shield",
          sequence: "VII→V→IV→VI",
          notes: { VII: 1, V: 1, IV: 1, VI: 1 },
          damageTypes: ["storm"],
          targetType: "area",
          range: 60,
          aoeShape: "circle",
          aoeParameters: { radius: 15 },
          primaryEffect: "barrier",
          secondaryEffect: "shield",
          effectDescription: "Shield every ally in a 15 ft radius for 2d6 + Spirit. Shield persists for 2 rounds. The progression stops on the dominant — suspended, unresolved, holding its breath and bracing for impact.",
          flavorText: "The music pauses mid-phrase. Everything holds. The shield is the silence before the downbeat, and it will not be broken early.",
          tacticalUse: "Pre-cast before a known big attack lands.",
        },
        {
          id: "authentic_cadence",
          name: "Authentic Cadence",
          epithet: "Grand Finale",
          sequence: "I→VI→III→I",
          notes: { I: 2, VI: 1, III: 1 },
          damageTypes: ["ember"],
          targetType: "area",
          range: 60,
          aoeShape: "circle",
          aoeParameters: { radius: 20 },
          primaryEffect: "healing",
          secondaryEffect: "damage_reduction",
          effectDescription: "Allies in a 20 ft radius take -4 damage for 1 round and restore 4d6 + Spirit HP. The Minstrel CANNOT heal themselves — every drop of mending flows outward. The progression descends through the relative minor and finds its way home, knitting flesh as it goes.",
          flavorText: "The melody walks down through grief and lands on the tonic. Where it lands, wounds close — except on the hands that played it.",
          tacticalUse: "Survive a burst-damage round and stabilize the party.",
        },
        {
          id: "phrygian_cadence",
          name: "Phrygian Cadence",
          epithet: "Ancient Resolve",
          sequence: "V→IV→I→VII",
          notes: { V: 1, IV: 1, I: 1, VII: 1 },
          damageTypes: ["storm"],
          targetType: "single_ally",
          range: 60,
          primaryEffect: "buff",
          secondaryEffect: "advantage",
          effectDescription: "Target ally gains advantage on all attacks for 2 turns. The lowered second of the Phrygian color is a knife-edge the ally's blade learns to ride.",
          flavorText: "An ancient, dark-hued close. The semitone drop that the ear reads as danger — and your ally reads as permission.",
          tacticalUse: "Boost a damage dealer going into a full attack action.",
        },
        {
          id: "neapolitan_sixth",
          name: "Neapolitan Sixth",
          epithet: "Mystical Precision",
          sequence: "III→I→IV→V",
          notes: { III: 1, I: 1, IV: 1, V: 1 },
          damageTypes: ["wyrd"],
          targetType: "single_ally",
          range: 60,
          primaryEffect: "buff",
          secondaryEffect: "crit_chance",
          effectDescription: "Target ally gains +2 to critical hit chance for 2 rounds. Stacks with Perfect Cadence for a guaranteed, amplified crit. The flatted-second chord colors the resolution with exotic precision.",
          flavorText: "A borrowed chord from a foreign key. It shouldn't fit. It fits perfectly — and your ally's aim suddenly shares its impossible geometry.",
          tacticalUse: "Stack with Perfect Cadence for cataclysmic single hits.",
        },
        {
          id: "tritone_substitution",
          name: "Tritone Substitution",
          epithet: "Dissonant Chains",
          sequence: "IV→I→V→VI",
          notes: { IV: 1, I: 1, V: 1, VI: 1 },
          damageTypes: ["wyrd"],
          targetType: "single",
          range: 60,
          primaryEffect: "control",
          secondaryEffect: "paralyze",
          effectDescription: "Paralyze a single target. DC 18 Spirit save negates. The devil's interval — the tritone — slides V out and slams a flatted-II in its place, and the enemy's nervous system goes with it.",
          flavorText: "The devil's interval, weaponized. Two notes that the Church banned for a thousand years, deployed in a single surgical strike.",
          tacticalUse: "Lock down a priority target for a full round.",
        },
        {
          id: "picardy_third",
          name: "Picardy Third",
          epithet: "Triumph of Light",
          sequence: "I→VII→V→III",
          notes: { I: 1, VII: 1, V: 1, III: 1 },
          damageTypes: ["ember"],
          targetType: "area",
          range: 60,
          aoeShape: "circle",
          aoeParameters: { radius: 20 },
          primaryEffect: "healing",
          secondaryEffect: "save_bonus",
          effectDescription: "Allies in a 20 ft radius gain +2 to all saves for 1 round and restore 6d6 + Spirit HP. A minor key resolves to a major tonic — the raised third that turns despair into borrowed, transient hope. The Minstrel still cannot self-heal.",
          flavorText: "The third that shouldn't be major, is. For one phrase, the music refuses to grieve — and the wounded get up again.",
          tacticalUse: "Counter debuff-heavy enemies and recover from a bad round.",
        },
      ],
    },
  },

  // Specializations
  specializations: {
    title: "Minstrel Specializations",
    subtitle: "Three Paths of Accumulated Suffering",

    description: `Every Minstrel chooses how they will suffer. The music demands a specialty — a particular brand of torment through which they channel their stolen frequencies. Each path offers unique passive abilities and shapes both the spells they learn and the manner in which the magic consumes them.`,

    specs: [
      { id : "battlechoir",
        name: "Battlechoir",
        icon: "Radiant/Divine Downward Sword",
        color: "#DC143C",
        theme: "War Songs & Aggressive Support",

        description: `Battlechoir Minstrels are the butchers of the battlefield — war drummers who drive soldiers into a killing frenzy with rhythms that bypass the conscious mind entirely. Their songs do not inspire courage; they strip away hesitation, morality, and restraint, leaving only the compulsion to slaughter. Every cadence they play amplifies ally lethality while grinding enemy morale into dust. They favor drums made from stretched skin and horns carved from the ribs of beasts that should have stayed extinct. The Battlechoir does not play music to uplift — they play to ensure that nothing on the receiving end survives.`,

        playstyle: "Aggressive support, damage amplification, offensive buffs",

        strengths: [
          "Highest damage amplification for allies",
          "Strong offensive cadences",
          "Excellent for coordinated teams",
          "War drums provide bonus damage",
        ],

        weaknesses: [
          "Lower healing output than Soulsinger",
          "Requires allies to capitalize on buffs",
          "Less effective when team is scattered",
          "Vulnerable when focused",
        ],

        passiveAbilities: [
          {
            name: "Harmonic Resonance",
            tier: "Path Passive",
            description:
              "When you complete a 4-note cadence, all allies within 30 feet gain +1d4 to their next attack or spell. This bonus stacks up to 3 times.",
            sharedBy: "All Minstrels",
          },
          {
            name: "War Anthem",
            tier: "Specialization Passive",
            description:
              "Your offensive cadences (Circle of Fifths, Phrygian Cadence, Neapolitan Sixth) grant all affected allies +2 to attack rolls for 2 turns. Additionally, when an ally scores a critical hit while affected by your buffs, you generate 1 random musical note.",
            uniqueTo: "Battlechoir",
          },
        ],

        recommendedFor:
          "Players who enjoy empowering their team, coordinated tactics, and aggressive playstyles",
      },

      { id : "soulsinger",
        name: "Soulsinger",
        icon: "Healing/Prayer",
        color: "#4169E1",
        theme: "Healing Melodies & Emotional Magic",

        description: `Soulsingers are not healers — they are desperate mourners whose songs are final pleas to powers that may not be listening. They channel raw anguish through their instruments, weaving frequencies that knit torn flesh and mend shattered bone through sheer sonic coercion. Their melodies are not gentle; they are the sounds of grief weaponized, lullabies sung over open graves that somehow keep the living from joining the dead. They favor lutes strung with hair from the bereaved and harps whose frames creek like gallows. A Soulsinger's healing is effective because it transfers the agony — not from patient to healer, but into the instrument itself, which slowly warps and cracks under accumulated sorrow.`,

        playstyle:
          "Sustained healing, emotional manipulation, protective support",

        strengths: [
          "Strongest healing output",
          "Excellent sustained support",
          "Emotional manipulation abilities",
          "Can heal while building notes",
        ],

        weaknesses: [
          "Lower damage contribution",
          "Less burst healing than dedicated healers",
          "Requires mana management",
          "Vulnerable to interruption",
        ],

        passiveAbilities: [
          {
            name: "Harmonic Resonance",
            tier: "Path Passive",
            description:
              "When you complete a 4-note cadence, the target ally gains +1d4 to their next attack or spell. This bonus stacks up to 3 times.",
            sharedBy: "All Minstrels",
          },
          {
            name: "Soothing Melody",
            tier: "Specialization Passive",
            description:
              "Your healing cadences (Authentic Cadence, Picardy Third) heal for an additional 1d6 HP. Additionally, whenever you heal an ally, you generate 1 Tonic (I) note. When using a Lute or Harp, healing is increased by an additional +2.",
            uniqueTo: "Soulsinger",
          },
        ],

        recommendedFor:
          "Players who enjoy healing, supporting their team, and emotional roleplay",
      },

      { id : "dissonance",
        name: "Dissonance",
        icon: "Psychic/Agonizing Scream",
        color: "#8B008B",
        theme: "Chaotic Sounds & Reality Warping",

        description: `Dissonance Minstrels have gazed into the void between notes and found something staring back. They wield frequencies that should not exist — atonal shrieks that unravel thought, progressions that cause the inner ear to bleed, chords that make the air itself flinch. Their music is not chaos; it is a calculated assault on the fundamental structure of reality, each discordant interval a crowbar prying at the seams of existence. They carry instruments that no luthier would claim: twisted constructions of metal and nerve that produce sounds more felt than heard. To hear a Dissonance Minstrel play is to understand that madness has a melody, and it is being performed at you.`,

        playstyle:
          "Crowd control, debuffs, chaotic effects, reality manipulation",

        strengths: [
          "Best crowd control capabilities",
          "Powerful debuffs and fear effects",
          "Unique reality-warping abilities",
          "Excels against grouped enemies",
        ],

        weaknesses: [
          "Lowest healing output",
          "Chaotic effects can be unpredictable",
          "Requires careful positioning",
          "Less effective against single targets",
        ],

        passiveAbilities: [
          {
            name: "Harmonic Resonance",
            tier: "Path Passive",
            description:
              "When you complete a 4-note cadence, the target ally gains +1d4 to their next attack or spell. This bonus stacks up to 3 times.",
            sharedBy: "All Minstrels",
          },
          {
            name: "Cacophony",
            tier: "Specialization Passive",
            description:
              "Your control cadences (Deceptive Cadence, Tritone Substitution) have their save DC increased by 2. Additionally, when an enemy fails a save against your cadence, all enemies within 10 feet must make a Wisdom save (DC 10 + your Spirit modifier) or become frightened for 1 turn. Dissonant sounds echo unpredictably.",
            uniqueTo: "Dissonance",
          },
        ],

        recommendedFor:
          "Players who enjoy control, debuffs, and unpredictable chaotic magic",
      },
    ],
  },

  // Spell Pools - organized by character level
  // Maps character level to available spell IDs for learning
  spellPools: {
    1: [
      "minstrel_opening_chord",
      "minstrel_harmonic_strike",
      "minstrel_inspiring_rhythm",
      "minstrel_uplifting_rhythm",
      "minstrel_symphonic_echo",
    ],
    2: [
      "minstrel_healing_hymn",
      "minstrel_war_drum",
      "minstrel_melancholy_melody",
      "minstrel_minor_cadence",
      "minstrel_mending_cadence",
    ],
    3: [
      "minstrel_dissonant_shriek",
      "minstrel_song_of_rest",
      "minstrel_climactic_crescendo",
      "minstrel_soothing_melody",
      "minstrel_resolving_strike",
    ],
    4: [
      "minstrel_perfect_cadence",
      "minstrel_harmony_strike",
      "minstrel_deceptive_cadence",
      "minstrel_plagal_cadence",
    ],
    5: [
      "minstrel_circle_of_fifths",
      "minstrel_authentic_cadence",
      "minstrel_half_cadence",
      "minstrel_phrygian_cadence",
    ],
    6: [
      "minstrel_tritone_substitution",
      "minstrel_picardy_third",
      "minstrel_neapolitan_sixth",
    ],
    7: [
      "minstrel_symphony_of_destruction",
      "minstrel_song_of_heroes",
      "minstrel_cacophonous_blast",
    ],
    8: [
      "minstrel_magnum_opus",
      "minstrel_serenade_of_shadows",
      "minstrel_harmony_of_renewal",
    ],
    9: [
      "minstrel_crescendo_of_power",
      "minstrel_requiem_of_the_fallen",
      "minstrel_tempo_mastery",
    ],
    10: [
      "minstrel_legendary_performance",
      "minstrel_song_of_creation",
      "minstrel_final_cadence",
    ],
  },

  // Spells - organized by level, properly formatted for wizard
  spells: [
    // ========================================
    // LEVEL 1 STARTING SPELLS (5 options, pick 3)
    // ========================================
    { id: "minstrel_opening_chord",
      name: "Opening Chord",
      description:
        "Strike a resonant chord that generates foundational notes and deals minor sonic damage.",
      level: 1,
      spellType: "ACTION",
      icon: "Radiant/Divine Halo",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Divine Halo",
        tags: ["builder", "basic", "sonic", "tonic generator", "level 1"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Resonare!",
        somaticText: "Strum instrument or gesture musically",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "1d6",
        elementType: "storm",
        damageTypes: ["storm"],
        resolution: "DICE",
      },

      musicalCombo: {
        type: "builder",
        generates: [
          { note: "I", count: 2 },
          { note: "V", count: 1 },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: ["builder", "basic", "sonic", "tonic generator", "level 1"],
    },

    { id: "minstrel_harmonic_strike",
      name: "Harmonic Strike",
      description:
        "Strike your foe with a resonant blow, dealing damage and generating mediant notes.",
      level: 1,
      spellType: "ACTION",
      icon: "Bludgeoning/Mortal Strike",

      typeConfig: {
        school: "ember",
        icon: "Bludgeoning/Mortal Strike",
        tags: ["builder", "melee", "basic", "mediant generator", "level 1"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        useFormulas: {},
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Strike with instrument or weapon",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "1d8",
        elementType: "physical",
        damageTypes: ["physical"],
        resolution: "DICE",
      },

      musicalCombo: {
        type: "builder",
        generates: [
          { note: "III", count: 2 },
          { note: "I", count: 1 },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: ["builder", "melee", "basic", "mediant generator", "level 1"],
    },

    { id: "minstrel_inspiring_rhythm",
      name: "Inspiring Rhythm",
      description:
        "Play an inspiring rhythm that grants all nearby allies +1 to attack rolls for 1 round. Generates dominant notes.",
      level: 1,
      spellType: "ACTION",
      icon: "Radiant/Golden Ring",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Golden Ring",
        tags: ["builder", "support", "dominant generator", "level 1"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self_centered",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 3 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Inspiro!",
        somaticText: "Play inspiring rhythm",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "custom",
        effects: [
          { id : "inspiring_rhythm",
            name: "Inspiring Rhythm",
            description:
              "Allies within 15ft gain +1 to attack rolls for 1 round.",
            customDescription:
              "Allies within 15ft gain +1 to attack rolls for 1 round.",
            statModifier: {
              stat: "attack",
              magnitude: 1,
              magnitudeType: "flat",
            },
            mechanicsText: "+1 to attack rolls for 1 round",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      musicalCombo: {
        type: "builder",
        generates: [
          { note: "V", count: 2 },
          { note: "VII", count: 1 },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: ["builder", "support", "dominant generator", "level 1"],
    },

    { id: "minstrel_minor_cadence",
      name: "Minor Cadence",
      description:
        "Play a simple cadence that heals nearby allies by consuming subdominant and tonic notes.",
      level: 1,
      spellType: "ACTION",
      icon: "Radiant/Radiant Bolt",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Radiant Bolt",
        tags: ["resolver", "healing", "subdominant generator", "level 1"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Sanare!",
        somaticText: "Play healing cadence",
      },

      resolution: "DICE",
      effectTypes: ["healing"],

      healingConfig: {
        formula: "1d6 + spirit/4",
        healingType: "direct",
        hasHotEffect: false,
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "IV", count: 1 },
          { note: "I", count: 1 },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: ["resolver", "healing", "subdominant generator", "level 1"],
    },

    { id: "minstrel_soothing_melody",
      name: "Soothing Melody",
      description:
        "Play a calming melody that removes minor debuffs and generates leading tone notes.",
      level: 3,
      spellType: "ACTION",
      icon: "Radiant/Radiant Divinity",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Radiant Divinity",
        tags: ["resolver", "utility", "leading generator", "level 3"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 3 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Pax!",
        somaticText: "Play soothing melody",
      },

      resolution: "NONE",
      effectTypes: ["utility"],

      utilityConfig: {
        utilityType: "restoration",
        selectedEffects: [
          { id : "remove_debuff",
            name: "Remove Debuff",
            description: "Removes one minor debuff from the target",
          },
        ],
        duration: 0,
        durationUnit: "instant",
        concentration: false,
        power: "minor",
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "VII", count: 1 },
          { note: "III", count: 1 },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: ["resolver", "utility", "leading generator", "level 3"],
    },

    { id: "minstrel_uplifting_rhythm",
      name: "Uplifting Rhythm",
      description:
        "Play an uplifting rhythm that bolsters an ally and generates supertonic notes.",
      spellType: "ACTION",
      icon: "Radiant/Radiant Warrior",
      level: 1,

      typeConfig: {
        school: "wyrd",
        icon: "Radiant/Radiant Warrior",
        tags: [
          "builder",
          "buff",
          "support",
          "supertonic generator",
          "battlechoir",
          "level 1",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 2,
        durationUnit: "turns",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Uplifting verse",
        somaticText: "Play encouraging rhythm",
      },

      resolution: "AUTOMATIC",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "armor_boost",
            name: "DR Boost",
            description: "+2 DR for 2 turns",
            statModifier: {
              stat: "armor",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 2,
        durationType: "turns",
        durationUnit: "turns",
        stackingRule: "replace",
        maxStacks: 1,
      },

      musicalCombo: {
        type: "builder",
        generates: [
          { note: "II", count: 1 },
          { note: "VI", count: 2 },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: [
        "builder",
        "buff",
        "support",
        "supertonic generator",
        "battlechoir",
        "level 1",
      ],
    },

    { id: "minstrel_resolving_strike",
      name: "Resolving Strike",
      description:
        "Resolve a simple harmonic progression (I→V) that releases a burst of sonic energy.",
      spellType: "ACTION",
      icon: "Arcane/Orb Manipulation",
      level: 3,

      typeConfig: {
        school: "storm",
        icon: "Arcane/Orb Manipulation",
        tags: ["resolver", "cadence", "damage", "simple", "level 3"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Simple resolution phrase",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "1d8 + spirit",
        elementType: "storm",
        damageTypes: ["storm"],
        resolution: "DICE",
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "I", count: 1 },
          { note: "V", count: 1 },
        ],
        cadenceName: "Resolving Strike",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: ["resolver", "cadence", "damage", "simple", "level 3"],
    },

    { id: "minstrel_mending_cadence",
      name: "Mending Cadence",
      description:
        "Complete a gentle progression (IV→I) that soothes wounds and calms the spirit.",
      spellType: "ACTION",
      icon: "Healing/Reaching Hand",
      level: 1,

      typeConfig: {
        school: "ember",
        icon: "Healing/Reaching Hand",
        tags: [
          "resolver",
          "cadence",
          "healing",
          "restoration",
          "simple",
          "soulsinger",
          "level 1",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Gentle healing melody",
      },

      resolution: "DICE",
      effectTypes: ["healing", "damage"],

      healingConfig: {
        healingType: "direct",
        formula: "1d8 + spirit",
        resolution: "DICE",
      },

      damageConfig: {
        formula: "1d8 + spirit",
        elementType: "ember",
        damageTypes: ["ember"],
        conditionalDamage: {
          enabled: true,
          conditions: [
            {
              targetType: "creature_type",
              creatureTypes: ["undead", "fiend"],
              bonusFormula: "healing_rolled",
              description:
                "Deals ember damage equal to healing rolled to undead and fiends",
            },
          ],
        },
        resolution: "DICE",
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "IV", count: 1 },
          { note: "I", count: 1 },
        ],
        cadenceName: "Mending Cadence",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: [
        "resolver",
        "cadence",
        "healing",
        "restoration",
        "soulsinger",
        "level 1",
      ],
    },

    { id: "minstrel_healing_hymn",
      name: "Healing Hymn",
      description: "Sing a soothing melody that heals an ally.",
      spellType: "ACTION",
      icon: "Healing/Golden Heart",
      level: 2,

      typeConfig: {
        school: "ember",
        icon: "Healing/Golden Heart",
        tags: [
          "builder",
          "healing",
          "subdominant generator",
          "soulsinger",
          "level 2",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Melodic healing verse",
      },

      resolution: "DICE",
      effectTypes: ["healing", "damage"],

      healingConfig: {
        healingType: "direct",
        formula: "2d6 + spirit",
        resolution: "DICE",
      },

      damageConfig: {
        formula: "2d6 + spirit",
        elementType: "ember",
        damageTypes: ["ember"],
        conditionalDamage: {
          enabled: true,
          conditions: [
            {
              targetType: "creature_type",
              creatureTypes: ["undead", "fiend"],
              bonusFormula: "healing_rolled",
              description:
                "Deals ember damage equal to healing rolled to undead and fiends",
            },
          ],
        },
        resolution: "DICE",
      },

      musicalCombo: {
        type: "builder",
        generates: [
          { note: "IV", count: 2 },
          { note: "I", count: 1 },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      specialMechanics: {
        instrumentBonus: {
          lute: { healingBonus: 2 },
          harp: { healingBonus: 2 },
        },
      },

      tags: [
        "builder",
        "healing",
        "subdominant generator",
        "soulsinger",
        "level 2",
      ],
    },

    { id: "minstrel_war_drum",
      name: "War Drum Beat",
      description: "Beat a powerful rhythm that damages enemies in an area.",
      spellType: "ACTION",
      icon: "Utility/Overlords Command",
      level: 2,

      typeConfig: {
        school: "storm",
        icon: "Utility/Overlords Command",
        tags: [
          "builder",
          "aoe",
          "damage",
          "dominant generator",
          "battlechoir",
          "area effect",
          "level 2",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: ["enemy"],
        maxTargets: 99,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Beat drum or stomp rhythmically",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "2d6 + spirit",
        elementType: "storm",
        damageTypes: ["storm"],
        resolution: "DICE",
      },

      musicalCombo: {
        type: "builder",
        generates: [
          { note: "V", count: 1 },
          { note: "VI", count: 2 },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      specialMechanics: {
        instrumentBonus: {
          drum: { damageBonus: "1d4" },
        },
      },

      tags: [
        "builder",
        "aoe",
        "damage",
        "dominant generator",
        "submediant generator",
        "battlechoir",
        "area effect",
        "level 2",
      ],
    },

    { id: "minstrel_dissonant_shriek",
      name: "Dissonant Shriek",
      description:
        "Unleash a discordant scream that generates tension notes and frightens enemies.",
      spellType: "ACTION",
      icon: "Psychic/Agonizing Scream",
      level: 3,

      typeConfig: {
        school: "wyrd",
        icon: "Psychic/Agonizing Scream",
        tags: [
          "builder",
          "aoe",
          "fear",
          "leading tone generator",
          "dissonance",
          "level 3",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemy"],
        maxTargets: 99,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Piercing discordant scream",
      },

      resolution: "DICE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "3d6 + spirit",
        elementType: "wyrd",
        damageTypes: ["wyrd"],
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "fear",
        effects: [
          { id : "frightened",
            controlType: "frightened",
            name: "Frightened",
            description: "Target is frightened",
            config: {
              duration: 2,
              durationUnit: "rounds",
              savingThrow: true,
              savingThrowType: "spirit",
              difficultyClass: 14,
            },
          },
        ],
        duration: 2,
        durationUnit: "rounds",
        savingThrow: true,
        savingThrowType: "spirit",
        difficultyClass: 14,
      },

      musicalCombo: {
        type: "builder",
        generates: [
          { note: "VII", count: 3 },
          { note: "II", count: 1 },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      tags: [
        "builder",
        "aoe",
        "fear",
        "leading tone generator",
        "dissonance",
        "level 3",
      ],
    },

    // Resolving Spells - Consume Notes for Powerful Cadences
    { id: "minstrel_perfect_cadence",
      name: "Perfect Cadence",
      description:
        "Complete a perfect harmonic progression (I→IV→V→I) that guarantees an ally's next attack will critically strike.",
      spellType: "ACTION",
      icon: "Radiant/Radiant Bolt",
      level: 4,

      typeConfig: {
        school: "wyrd",
        icon: "Radiant/Radiant Bolt",
        tags: [
          "resolver",
          "cadence",
          "buff",
          "critical",
          "battlechoir",
          "level 4",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 1,
        durationUnit: "turns",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 16 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Harmonic resolution phrase",
      },

      resolution: "AUTOMATIC",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "custom",
        effects: [
          { id : "guaranteed_crit",
            name: "Guaranteed Critical Hit",
            description: "Next attack is guaranteed critical hit",
            mechanicsText: "Next attack is guaranteed critical hit",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        canBeDispelled: true,
        concentrationRequired: false,
        stackingRule: "replace",
        maxStacks: 1,
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "I", count: 2 },
          { note: "IV", count: 1 },
          { note: "V", count: 1 },
        ],
        cadenceName: "Perfect Cadence",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: [
        "resolver",
        "cadence",
        "buff",
        "critical",
        "battlechoir",
        "level 4",
      ],
    },

    { id: "minstrel_circle_of_fifths",
      name: "Circle of Fifths",
      description:
        "Weave an eternal loop of torment (V→I→VI→V) that traps enemies in relentless agony.",
      spellType: "ACTION",
      icon: "Fire/Dragon Breath",
      level: 5,

      typeConfig: {
        school: "storm",
        icon: "Fire/Dragon Breath",
        tags: ["resolver", "cadence", "dot", "aoe", "battlechoir", "level 5"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemy"],
        maxTargets: 99,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 3,
        durationUnit: "turns",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Cyclical harmonic phrase",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "3d6 + spirit",
        elementType: "storm",
        damageTypes: ["storm"],
        resolution: "DICE",
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "V", count: 2 },
          { note: "I", count: 1 },
          { note: "VI", count: 1 },
        ],
        cadenceName: "Circle of Fifths",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["resolver", "cadence", "dot", "aoe", "battlechoir", "level 5"],
    },

    { id: "minstrel_authentic_cadence",
      name: "Authentic Cadence",
      description:
        "Perform a grand finale (I→VI→III→I) that fortifies and heals all nearby allies.",
      spellType: "ACTION",
      icon: "Healing/Prayer",
      level: 5,

      typeConfig: {
        school: "ember",
        icon: "Healing/Prayer",
        tags: [
          "resolver",
          "cadence",
          "healing",
          "aoe",
          "defensive",
          "soulsinger",
          "level 5",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["ally"],
        maxTargets: 99,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 1,
        durationUnit: "turns",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Triumphant finale verse",
      },

      resolution: "DICE",
      effectTypes: ["healing", "buff", "damage"],

      healingConfig: {
        formula: "4d6 + spirit",
        healingType: "direct",
        resolution: "DICE",
      },

      damageConfig: {
        formula: "4d6 + spirit",
        elementType: "ember",
        damageTypes: ["ember"],
        conditionalDamage: {
          enabled: true,
          conditions: [
            {
              targetType: "creature_type",
              creatureTypes: ["undead", "fiend"],
              bonusFormula: "healing_rolled",
              description:
                "Deals ember damage equal to healing rolled to undead and fiends",
            },
          ],
        },
        resolution: "DICE",
      },

      buffConfig: {
        buffType: "damage_reduction",
        effects: [
          { id : "authentic_protection",
            name: "Authentic Protection",
            description: "Reduce incoming damage by 4",
            mechanicsText: "-4 damage taken for 1 round",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "I", count: 2 },
          { note: "VI", count: 1 },
          { note: "III", count: 1 },
        ],
        cadenceName: "Authentic Cadence",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      specialMechanics: {
        instrumentBonus: {
          lute: { healingBonus: 2 },
          harp: { healingBonus: 2 },
        },
      },

      tags: [
        "resolver",
        "cadence",
        "healing",
        "aoe",
        "defensive",
        "soulsinger",
        "level 5",
      ],
    },

    { id: "minstrel_tritone_substitution",
      name: "Tritone Substitution",
      description:
        "Unleash powerful dissonance (IV→I→V→VI) that binds and paralyzes a foe.",
      spellType: "ACTION",
      icon: "Psychic/Mind Strike",
      level: 6,

      typeConfig: {
        school: "wyrd",
        icon: "Psychic/Mind Strike",
        tags: [
          "resolver",
          "cadence",
          "control",
          "paralyze",
          "dissonance",
          "level 6",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 1,
        durationUnit: "turns",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 24 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Dissonant binding phrase",
      },

      resolution: "SAVE",
      effectTypes: ["control"],

      controlConfig: {
        controlType: "incapacitation",
        effects: [
          { id : "paralyzed",
            controlType: "paralyze",
            name: "Paralyzed",
            description: "Target is paralyzed",
            config: {
              duration: 1,
              durationUnit: "rounds",
              savingThrow: true,
              savingThrowType: "spirit",
              difficultyClass: 18,
            },
          },
        ],
        duration: 1,
        durationUnit: "rounds",
        savingThrow: true,
        savingThrowType: "spirit",
        difficultyClass: 18,
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "IV", count: 1 },
          { note: "I", count: 1 },
          { note: "V", count: 1 },
          { note: "VI", count: 1 },
        ],
        cadenceName: "Tritone Substitution",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: [
        "resolver",
        "cadence",
        "control",
        "paralyze",
        "dissonance",
        "level 6",
      ],
    },

    { id: "minstrel_picardy_third",
      name: "Picardy Third",
      description:
        "Shift from darkness to light (I→VII→V→III), filling allies with renewed hope and resilience.",
      spellType: "ACTION",
      icon: "Radiant/Divine Radiance",
      level: 6,

      typeConfig: {
        school: "ember",
        icon: "Radiant/Divine Radiance",
        tags: [
          "resolver",
          "cadence",
          "healing",
          "buff",
          "saves",
          "soulsinger",
          "level 6",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["ally"],
        maxTargets: 99,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 24 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Hopeful ascending melody",
      },

      resolution: "DICE",
      effectTypes: ["healing", "buff", "damage"],

      healingConfig: {
        formula: "6d6 + spirit",
        healingType: "direct",
        resolution: "DICE",
      },

      damageConfig: {
        formula: "6d6 + spirit",
        elementType: "ember",
        damageTypes: ["ember"],
        conditionalDamage: {
          enabled: true,
          conditions: [
            {
              targetType: "creature_type",
              creatureTypes: ["undead", "fiend"],
              bonusFormula: "healing_rolled",
              description:
                "Deals ember damage equal to healing rolled to undead and fiends",
            },
          ],
        },
        resolution: "DICE",
      },

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "picardy_saves",
            name: "Picardy Resolve",
            description: "+2 to all saving throws for 3 rounds",
            statModifier: {
              stat: "saving_throws",
              magnitude: 2,
              magnitudeType: "flat",
            },
            mechanicsText: "+2 to all saving throws for 3 rounds",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "I", count: 1 },
          { note: "VII", count: 1 },
          { note: "V", count: 1 },
          { note: "III", count: 1 },
        ],
        cadenceName: "Picardy Third",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: [
        "resolver",
        "cadence",
        "healing",
        "buff",
        "saves",
        "soulsinger",
        "level 6",
      ],
    },

    // Utility Spell
    { id: "minstrel_song_of_rest",
      name: "Song of Rest",
      description:
        "Perform a calming melody that allows allies to recover during a short rest.",
      spellType: "ACTION",
      icon: "Psychic/Mind Control",
      level: 3,

      typeConfig: {
        school: "ember",
        icon: "Psychic/Mind Control",
        tags: ["utility", "ritual", "healing", "rest", "soulsinger", "level 3"],
        castTime: 10,
        castTimeType: "MINUTES",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["ally"],
        maxTargets: 99,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 1,
        durationUnit: "hours",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Soothing rest melody",
      },

      resolution: "DICE",
      effectTypes: ["healing", "damage"],

      healingConfig: {
        formula: "2d8",
        healingType: "direct",
        resolution: "DICE",
      },

      damageConfig: {
        formula: "2d8",
        elementType: "ember",
        damageTypes: ["ember"],
        conditionalDamage: {
          enabled: true,
          conditions: [
            {
              targetType: "creature_type",
              creatureTypes: ["undead", "fiend"],
              bonusFormula: "healing_rolled",
              description:
                "Deals ember damage equal to healing rolled to undead and fiends",
            },
          ],
        },
        resolution: "DICE",
      },

      musicalCombo: {
        type: "builder",
        generates: [
          { note: "I", count: 1 },
          { note: "IV", count: 1 },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: ["utility", "ritual", "healing", "rest", "soulsinger", "level 3"],
    },

    // ========================================
    // NEW BUILDER SPELLS — VI & VII Generation
    // ========================================
    { id: "minstrel_melancholy_melody",
      name: "Melancholy Melody",
      description:
        "Play a haunting melody that generates submediant and subdominant notes, weakening nearby enemies with sorrow.",
      level: 2,
      spellType: "ACTION",
      icon: "Psychic/Mind Control",

      typeConfig: {
        school: "wyrd",
        icon: "Psychic/Mind Control",
        tags: [
          "builder",
          "debuff",
          "submediant generator",
          "soulsinger",
          "dissonance",
          "level 2",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Doloroso...",
        somaticText: "Play haunting melody",
      },

      resolution: "DICE",
      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "1d6 + spirit/4",
        elementType: "wyrd",
        damageTypes: ["wyrd"],
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "melancholy",
            name: "Melancholy",
            description: "Enemy has -1 to attack rolls for 2 rounds.",
            statPenalty: [{ stat: "attack", value: -1 }],
            mechanicsText: "-1 to attack rolls for 2 rounds",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      musicalCombo: {
        type: "builder",
        generates: [
          { note: "VI", count: 2 },
          { note: "IV", count: 1 },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: [
        "builder",
        "debuff",
        "submediant generator",
        "soulsinger",
        "dissonance",
        "level 2",
      ],
    },

    { id: "minstrel_climactic_crescendo",
      name: "Climactic Crescendo",
      description:
        "Build to a thrilling crescendo that generates leading tone and dominant notes while buffing ally attack power.",
      level: 3,
      spellType: "ACTION",
      icon: "Fire/Rising Inferno",

      typeConfig: {
        school: "ember",
        icon: "Fire/Rising Inferno",
        tags: [
          "builder",
          "buff",
          "leading tone generator",
          "battlechoir",
          "dissonance",
          "level 3",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self_centered",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Crescendo!",
        somaticText: "Build intensity with instrument",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "crescendo_power",
            name: "Crescendo Power",
            description:
              "Allies within 20 feet gain +2 to damage rolls for 2 rounds.",
            statModifier: {
              stat: "damage",
              magnitude: 2,
              magnitudeType: "flat",
            },
            mechanicsText: "+2 to damage rolls for 2 rounds",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        stackingRule: "replace",
        maxStacks: 1,
      },

      musicalCombo: {
        type: "builder",
        generates: [
          { note: "VII", count: 2 },
          { note: "V", count: 1 },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: [
        "builder",
        "buff",
        "leading tone generator",
        "battlechoir",
        "dissonance",
        "level 3",
      ],
    },

    // ========================================
    // NEW CADENCE SPELLS — Missing 5 Cadences
    // ========================================
    { id: "minstrel_deceptive_cadence",
      name: "Deceptive Cadence",
      description:
        "Play a deceptive progression (IV→VII→V→IV) that disorients an enemy, imposing -2 to attacks and saves for 1 round (DC 15 Spirit save to resist).",
      level: 4,
      spellType: "ACTION",
      icon: "Psychic/Mind Strike",

      typeConfig: {
        school: "wyrd",
        icon: "Psychic/Mind Strike",
        tags: [
          "resolver",
          "cadence",
          "control",
          "disoriented",
          "dissonance",
          "level 4",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
      },

      durationConfig: {
        durationType: "rounds",
        duration: 1,
        durationUnit: "turns",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 16 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fallax Resolutio!",
        somaticText: "Deceptive hand movement",
      },

      resolution: "SAVE",
      effectTypes: ["control"],

      controlConfig: {
        controlType: "incapacitation",
        effects: [
          { id : "disoriented",
            controlType: "disoriented",
            name: "Disoriented",
            description: "Target is disoriented (-2 attacks/saves)",
            config: {
              duration: 1,
              durationUnit: "rounds",
              savingThrow: true,
              savingThrowType: "spirit",
              difficultyClass: 15,
            },
          },
        ],
        duration: 1,
        durationUnit: "rounds",
        savingThrow: true,
        savingThrowType: "spirit",
        difficultyClass: 15,
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "IV", count: 2 },
          { note: "VII", count: 1 },
          { note: "V", count: 1 },
        ],
        cadenceName: "Deceptive Cadence",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["resolver", "cadence", "control", "disoriented", "dissonance", "level 4"],
    },

    { id: "minstrel_plagal_cadence",
      name: "Plagal Cadence",
      description:
        "Perform a sacred ascent (VI→V→I→III) that grants allies swiftness and agility, enhancing their movement and reflexes.",
      level: 4,
      spellType: "ACTION",
      icon: "Radiant/Radiant Warrior",

      typeConfig: {
        school: "arcane",
        icon: "Radiant/Radiant Warrior",
        tags: ["resolver", "cadence", "buff", "speed", "soulsinger", "level 4"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["ally"],
      },

      durationConfig: {
        durationType: "rounds",
        duration: 2,
        durationUnit: "turns",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 16 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Surge Sanctus!",
        somaticText: "Ascending melodic gesture",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "plagal_swiftness",
            name: "Plagal Swiftness",
            description:
              "Allies gain +20 ft movement speed and +2 Dexterity for 2 rounds.",
            statModifier: [
              { stat: "movement_speed", magnitude: 20, magnitudeType: "flat" },
              { stat: "agility", magnitude: 2, magnitudeType: "flat" },
            ],
            mechanicsText: "+20 ft speed, +2 Dex for 2 rounds",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "VI", count: 1 },
          { note: "V", count: 1 },
          { note: "I", count: 1 },
          { note: "III", count: 1 },
        ],
        cadenceName: "Plagal Cadence",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["resolver", "cadence", "buff", "speed", "soulsinger", "level 4"],
    },

    { id: "minstrel_half_cadence",
      name: "Half Cadence",
      description:
        "An unresolved progression (VII→V→IV→VI) that creates protective harmonic barriers around your allies, absorbing incoming damage.",
      level: 5,
      spellType: "ACTION",
      icon: "Force/Force Field",

      typeConfig: {
        school: "storm",
        icon: "Force/Force Field",
        tags: [
          "resolver",
          "cadence",
          "shield",
          "defensive",
          "dissonance",
          "level 5",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: ["ally"],
      },

      durationConfig: {
        durationType: "rounds",
        duration: 2,
        durationUnit: "turns",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Semper Custos!",
        somaticText: "Protective harmonic gesture",
      },

      resolution: "DICE",
      effectTypes: ["buff", "damage"],

      damageConfig: {
        formula: "2d6 + spirit",
        elementType: "storm",
        damageTypes: ["storm"],
        shieldConfig: {
          shieldType: "absorption",
          shieldValueFormula: "2d6 + spirit",
          duration: 2,
          durationUnit: "rounds",
        },
        resolution: "DICE",
      },

      buffConfig: {
        buffType: "shield",
        effects: [
          { id: "harmonic_barrier",
            name: "Harmonic Barrier",
            description: "Allies within 15 ft gain a protective shield absorbing 2d6 + spirit damage for 2 rounds.",
            shieldAmount: "2d6 + spirit",
            shieldDuration: 2,
            shieldDurationType: "rounds",
          },
        ],
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "VII", count: 1 },
          { note: "V", count: 1 },
          { note: "IV", count: 1 },
          { note: "VI", count: 1 },
        ],
        cadenceName: "Half Cadence",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: [
        "resolver",
        "cadence",
        "shield",
        "defensive",
        "dissonance",
        "level 5",
      ],
    },

    { id: "minstrel_phrygian_cadence",
      name: "Phrygian Cadence",
      description:
        "An ancient progression (V→IV→I→VII) that channels the resolve of warriors past, granting allies advantage on all attacks.",
      level: 5,
      spellType: "ACTION",
      icon: "Radiant/Divine Halo",

      typeConfig: {
        school: "wyrd",
        icon: "Radiant/Divine Halo",
        tags: [
          "resolver",
          "cadence",
          "buff",
          "advantage",
          "battlechoir",
          "level 5",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["ally"],
      },

      durationConfig: {
        durationType: "rounds",
        duration: 2,
        durationUnit: "turns",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Virtus Antiqua!",
        somaticText: "Resolute conducting gesture",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "phrygian_resolve",
            name: "Phrygian Resolve",
            description:
              "Allies gain advantage on all attack rolls for 2 rounds.",
            statModifier: {
              stat: "attack_advantage",
              magnitude: 1,
              magnitudeType: "advantage",
            },
            mechanicsText: "Advantage on attack rolls for 2 rounds",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "V", count: 1 },
          { note: "IV", count: 1 },
          { note: "I", count: 1 },
          { note: "VII", count: 1 },
        ],
        cadenceName: "Phrygian Cadence",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: [
        "resolver",
        "cadence",
        "buff",
        "advantage",
        "battlechoir",
        "level 5",
      ],
    },

    { id: "minstrel_neapolitan_sixth",
      name: "Neapolitan Sixth",
      description:
        "A precise and unexpected progression (III→I→IV→V) that sharpens ally precision, increasing critical hit chance.",
      level: 6,
      spellType: "ACTION",
      icon: "Radiant/Radiant Bolt",

      typeConfig: {
        school: "arcane",
        icon: "Radiant/Radiant Bolt",
        tags: [
          "resolver",
          "cadence",
          "buff",
          "critical",
          "battlechoir",
          "level 6",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["ally"],
      },

      durationConfig: {
        durationType: "rounds",
        duration: 2,
        durationUnit: "turns",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 24 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Exactio Perfecta!",
        somaticText: "Precise harmonic gesture",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "neapolitan_precision",
            name: "Neapolitan Precision",
            description: "Allies gain +2 to critical hit chance for 2 rounds.",
            statModifier: {
              stat: "crit_chance",
              magnitude: 2,
              magnitudeType: "flat",
            },
            mechanicsText: "+2 crit chance for 2 rounds",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "III", count: 1 },
          { note: "I", count: 1 },
          { note: "IV", count: 1 },
          { note: "V", count: 1 },
        ],
        cadenceName: "Neapolitan Sixth",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: [
        "resolver",
        "cadence",
        "buff",
        "critical",
        "battlechoir",
        "level 6",
      ],
    },

    // ========================================
    // LEVEL 7 SPELLS
    // ========================================
    { id: "minstrel_symphony_of_destruction",
      name: "Symphony of Destruction",
      description:
        "Conduct a devastating symphony that unleashes waves of sonic energy, dealing massive storm damage to all enemies in a large area.",
      level: 7,
      spellType: "ACTION",
      icon: "Nature/Earth Shatter",

      typeConfig: {
        school: "ember",
        icon: "Nature/Earth Shatter",
        tags: ["damage", "aoe", "storm", "resolver", "level 7"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 28 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Destructio Symphonia!",
        somaticText: "Grand conducting gestures",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "10d6 + spirit",
        elementType: "storm",
        damageTypes: ["storm"],
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2.5,
          critDiceOnly: false,
          extraDice: "3d10",
          critEffects: ["deafen", "knockback"],
          deafenConfig: {
            duration: 2,
            durationUnit: "rounds",
            saveDC: 17,
            saveType: "constitution",
          },
          knockbackConfig: {
            distance: 15,
          },
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 17,
          saveOutcome: "halves",
          partialEffect: true,
          partialEffectFormula: "damage/2",
        },
        resolution: "DICE",
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "V", count: 3 },
          { note: "I", count: 2 },
        ],
        requiredNotes: 5,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      tags: ["damage", "aoe", "storm", "resolver", "level 7"],
    },

    { id: "minstrel_song_of_heroes",
      name: "Song of Heroes",
      description:
        "Perform an inspiring ballad that empowers all allies with legendary might, granting significant bonuses to attack and damage.",
      level: 7,
      spellType: "ACTION",
      icon: "Radiant/Divine Radiance",

      typeConfig: {
        school: "wyrd",
        icon: "Radiant/Divine Radiance",
        tags: ["buff", "aoe", "support", "builder", "level 7"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 28 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Canticum Heroum!",
        somaticText: "Strum heroic melody",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "heroic_might",
            name: "Heroic Might",
            description:
              "Allies gain +2 to attack rolls and +1d6 damage on all attacks for 3 rounds.",
            statModifier: {
              stat: "attack_rolls",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: true,
      },

      musicalCombo: {
        type: "builder",
        generates: [
          { note: "I", count: 2 },
          { note: "III", count: 1 },
          { note: "VII", count: 1 },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      tags: ["buff", "aoe", "support", "builder", "level 7"],
    },

    { id: "minstrel_cacophonous_blast",
      name: "Cacophonous Blast",
      description:
        "Unleash a devastating blast of pure discordance that disrupts enemy spellcasting and causes wyrd damage to all who hear it.",
      level: 7,
      spellType: "ACTION",
      icon: "Psychic/Agonizing Scream",

      typeConfig: {
        school: "wyrd",
        icon: "Psychic/Agonizing Scream",
        tags: ["damage", "control", "wyrd", "dissonance", "level 7"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 28 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Piercing shriek of discord",
      },

      resolution: "DICE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "10d6 + spirit",
        elementType: "wyrd",
        damageTypes: ["wyrd"],
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "incapacitation",
        strength: "moderate",
        duration: 1,
        durationUnit: "rounds",
        saveDC: 16,
        saveType: "spirit",
        savingThrow: true,
        effects: [
          { id : "disrupted",
            name: "Disrupted",
            description:
              "Enemies cannot cast spells until the end of their next turn",
            config: {
              saveType: "constitution",
              saveDC: 16,
              condition: "silenced",
              duration: 1,
              durationUnit: "rounds",
              durationType: "rounds",
              recoveryMethod: "automatic",
            },
          },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      musicalCombo: {
        type: "builder",
        generates: [
          { note: "VII", count: 2 },
          { note: "II", count: 2 },
        ],
      },

      tags: ["damage", "control", "wyrd", "level 7"],
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    { id: "minstrel_magnum_opus",
      name: "Magnum Opus",
      description:
        "Perform your greatest masterpiece. Enemies within 40 feet suffer 12d6 + Spirit ember damage (DC 18 Spirit save for half), while all allies in the same radius are healed for 6d6 + Spirit.",
      level: 8,
      spellType: "ACTION",
      icon: "Radiant/Divine Blessing",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Divine Blessing",
        tags: ["damage", "healing", "aoe", "resolver", "level 8"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingMode: "effect",
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
        targetRestrictions: ["enemy", "ally"],
      },

      effectTargeting: {
        damage: {
          targetingType: "area",
          rangeType: "self_centered",
          aoeShape: "circle",
          aoeParameters: { radius: 40 },
          targetRestrictions: ["enemy"],
        },
        healing: {
          targetingType: "area",
          rangeType: "self_centered",
          aoeShape: "circle",
          aoeParameters: { radius: 40 },
          targetRestrictions: ["ally"],
        },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 32 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "Opus Magnum Virtuoso!",
        somaticText: "Grand performance gestures",
      },

      resolution: "DICE",
      effectTypes: ["damage", "healing"],

      damageConfig: {
        formula: "12d6 + spirit",
        elementType: "ember",
        damageTypes: ["ember"],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "spirit",
          difficultyClass: 18,
          saveOutcome: "halves",
        },
        resolution: "DICE",
      },

      healingConfig: {
        formula: "6d6 + spirit",
        healingType: "direct",
        hasHotEffect: false,
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "I", count: 3 },
          { note: "V", count: 3 },
          { note: "VII", count: 2 },
        ],
        requiredNotes: 8,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      tags: ["damage", "healing", "aoe", "resolver", "level 8"],
    },

    { id: "minstrel_serenade_of_shadows",
      name: "Serenade of Shadows",
      description:
        "A haunting melody that causes enemies to become entranced and vulnerable, reducing their defenses and causing fear.",
      level: 8,
      spellType: "ACTION",
      icon: "Psychic/Mind Control",

      typeConfig: {
        school: "wyrd",
        icon: "Psychic/Mind Control",
        tags: ["debuff", "control", "aoe", "dissonance", "level 8"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 25 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 32 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Dark haunting melody",
        somaticText: "Shadowy conducting motions",
      },

      resolution: "NONE",
      effectTypes: ["debuff", "control"],

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "entranced",
            name: "Entranced",
            description:
              "Enemies have -4 DR and disadvantage on saving throws for 4 rounds.",
            statPenalty: [
              { stat: "armor", value: -4 },
              {
                stat: "saving_throws",
                value: -99,
                magnitudeType: "disadvantage",
              },
            ],
            mechanicsText:
              "-4 DR and disadvantage on saving throws for 4 rounds",
          },
        ],
        durationValue: 4,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 17,
        saveType: "spirit",
        saveOutcome: "negates",
      },

      controlConfig: {
        controlType: "mind_control",
        strength: "moderate",
        duration: 2,
        durationUnit: "rounds",
        saveDC: 17,
        saveType: "spirit",
        savingThrow: true,
        effects: [
          { id : "fear",
            name: "Frightened",
            description: "Enemies are frightened and must move away from you",
            config: {
              fearStrength: "moderate",
              saveType: "charisma",
              saveDC: 16,
              duration: 2,
              durationUnit: "rounds",
            },
          },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      musicalCombo: {
        type: "builder",
        generates: [
          { note: "VI", count: 2 },
          { note: "VII", count: 1 },
        ],
      },

      tags: ["debuff", "control", "aoe", "level 8"],
    },

    { id: "minstrel_harmony_of_renewal",
      name: "Harmony of Renewal",
      description:
        "A powerful healing melody that restores allies to full fighting capacity, removing negative effects and providing regeneration.",
      level: 8,
      spellType: "ACTION",
      icon: "Healing/Renewal",

      typeConfig: {
        school: "ember",
        icon: "Healing/Renewal",
        tags: ["healing", "purification", "aoe", "level 8"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 32 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Harmonia Renovare!",
        somaticText: "Sweeping healing gestures",
      },

      resolution: "DICE",
      effectTypes: ["healing", "purification"],

      healingConfig: {
        formula: "10d6 + spirit",
        healingType: "direct",
        hasHotEffect: true,
        hotFormula: "2d6",
        hotDuration: 3,
        hotTickType: "round",
      },

      purificationConfig: {
        purificationType: "cleanse",
        targetType: "area",
        power: "major",
        duration: "instant",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      musicalCombo: {
        type: "builder",
        generates: [
          { note: "I", count: 2 },
          { note: "IV", count: 1 },
        ],
      },

      tags: ["healing", "purification", "aoe", "level 8"],
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    { id: "minstrel_crescendo_of_power",
      name: "Crescendo of Power",
      description:
        "Build to an overwhelming crescendo that empowers all your subsequent spells for the rest of combat.",
      level: 9,
      spellType: "ACTION",
      icon: "Radiant/Radiant Glow",

      typeConfig: {
        school: "wyrd",
        icon: "Radiant/Radiant Glow",
        tags: ["buff", "self", "empowerment", "level 9"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 36 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Crescendo Potentia!",
        somaticText: "Building intensity gestures",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "empowered_performance",
            name: "Empowered Performance",
            description:
              "All your spells deal 25% more damage and healing for 5 rounds. Concentration required.",
            statModifier: {
              stat: "spell_power",
              magnitude: 25,
              magnitudeType: "percentage",
            },
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "I", count: 3 },
          { note: "V", count: 3 },
          { note: "VII", count: 2 },
        ],
      },

      tags: ["buff", "self", "empowerment", "level 9"],
    },

    { id: "minstrel_requiem_of_the_fallen",
      name: "Requiem of the Fallen",
      description:
        "A mournful yet powerful requiem that damages enemies while granting allies the spirits of fallen heroes.",
      level: 9,
      spellType: "ACTION",
      icon: "Necrotic/Drain Soul",

      typeConfig: {
        school: "blight",
        icon: "Necrotic/Drain Soul",
        tags: ["damage", "buff", "aoe", "resolver", "level 9"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 50 },
        targetRestrictions: ["enemy", "ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 36 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "Requiem Aeternam Dona Eis!",
        somaticText: "Solemn performance",
      },

      resolution: "DICE",
      effectTypes: ["damage", "buff"],

      damageConfig: {
        formula: "15d6 + spirit",
        elementType: "blight",
        damageTypes: ["blight"],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "spirit",
          difficultyClass: 19,
          saveOutcome: "halves",
        },
        resolution: "DICE",
      },

      buffConfig: {
        buffType: "statusEffect",
        effects: [
          { id : "spirit_of_heroes",
            name: "Spirit of Heroes",
            description:
              "Allies gain +4 to all saving throws and deal +3d6 damage on attacks for 5 rounds.",
            mechanicsText:
              "+4 to all saving throws and +3d6 damage on attacks for 5 rounds",
            statModifier: [
              { stat: "saving_throws", magnitude: 4, magnitudeType: "flat" },
            ],
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "I", count: 4 },
          { note: "V", count: 4 },
          { note: "VII", count: 2 },
        ],
        requiredNotes: 10,
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["damage", "buff", "aoe", "resolver", "level 9"],
    },

    { id: "minstrel_tempo_mastery",
      name: "Tempo Mastery",
      description:
        "Gain complete control over the tempo of battle, granting allies extra actions while slowing enemies.",
      level: 9,
      spellType: "ACTION",
      icon: "Force/Force Field",

      typeConfig: {
        school: "wyrd",
        icon: "Force/Force Field",
        tags: ["buff", "debuff", "control", "level 9"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
        targetRestrictions: ["enemy", "ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 36 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Tempus Dominium!",
        somaticText: "Time-bending conducting",
      },

      resolution: "NONE",
      effectTypes: ["buff", "debuff"],

      buffConfig: {
        buffType: "statusEffect",
        effects: [
          { id : "accelerated_tempo",
            name: "Accelerated Tempo",
            description:
              "Allies gain an extra 1 AP on their next turn for 2 rounds.",
            mechanicsText: "Extra 1 AP on next turn for 2 rounds",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: true,
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "slowed_tempo",
            name: "Slowed Tempo",
            description:
              "Enemies lose their reaction and have their speed halved for 3 rounds.",
            statPenalty: [
              {
                stat: "movement_speed",
                value: -50,
                magnitudeType: "percentage",
              },
            ],
            movementPenalty: -50,
            mechanicsText: "Lose reaction, speed halved for 3 rounds",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 18,
        saveType: "constitution",
        saveOutcome: "negates",
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "V", count: 2 },
          { note: "I", count: 2 },
          { note: "VII", count: 1 },
        ],
      },

      tags: ["buff", "debuff", "control", "level 9"],
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    { id: "minstrel_legendary_performance",
      name: "Legendary Performance",
      description:
        "The pinnacle of musical mastery - a performance so profound it reshapes reality itself. Enemies within 60 feet suffer 20d6 + Spirit ember damage (DC 20 Spirit save for half), allies in the same radius are healed for 10d6 + Spirit, and those allies gain +3 to attack rolls, +2 DR, and immunity to fear and charm for 5 rounds.",
      level: 10,
      spellType: "ACTION",
      icon: "Radiant/Divine Illumination",

      typeConfig: {
        school: "ember",
        icon: "Radiant/Divine Illumination",
        tags: ["damage", "buff", "aoe", "ultimate", "level 10"],
        castTime: 3,
        castTimeType: "IMMEDIATE",
      },

      targetingMode: "effect",
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 60 },
        targetRestrictions: ["enemy", "ally"],
      },

      effectTargeting: {
        damage: {
          targetingType: "area",
          rangeType: "self_centered",
          aoeShape: "circle",
          aoeParameters: { radius: 60 },
          targetRestrictions: ["enemy"],
        },
        healing: {
          targetingType: "area",
          rangeType: "self_centered",
          aoeShape: "circle",
          aoeParameters: { radius: 60 },
          targetRestrictions: ["ally"],
        },
        buff: {
          targetingType: "area",
          rangeType: "self_centered",
          aoeShape: "circle",
          aoeParameters: { radius: 60 },
          targetRestrictions: ["ally"],
        },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 40 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "Cantus Legendarum Ultimus!",
        somaticText: "Ultimate grand performance",
      },

      resolution: "DICE",
      effectTypes: ["damage", "buff", "healing"],

      damageConfig: {
        formula: "20d6 + spirit",
        elementType: "ember",
        damageTypes: ["ember"],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "spirit",
          difficultyClass: 20,
          saveOutcome: "halves",
        },
        resolution: "DICE",
      },

      healingConfig: {
        formula: "10d6 + spirit",
        healingType: "direct",
        hasHotEffect: false,
      },

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "legendary_inspiration",
            name: "Legendary Inspiration",
            description:
              "Allies gain +3 to attack rolls, +2 DR, and immunity to fear and charm for 5 rounds.",
            statModifier: {
              stat: "all_rolls",
              magnitude: 3,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "I", count: 4 },
          { note: "V", count: 4 },
          { note: "III", count: 2 },
          { note: "VII", count: 2 },
        ],
      },

      tags: ["damage", "buff", "aoe", "ultimate", "level 10"],
    },

    { id: "minstrel_song_of_creation",
      name: "Song of Creation",
      description:
        "Sing the primal song of creation, summoning a powerful ally from pure musical energy and enhancing all allies with creative power.",
      level: 10,
      spellType: "ACTION",
      icon: "Arcane/Magical Sword",

      typeConfig: {
        school: "arcane",
        icon: "Arcane/Magical Sword",
        tags: ["summoning", "buff", "ultimate", "level 10"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 40 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "Cantus Creationis!",
        somaticText: "Weave music into reality",
      },

      resolution: "NONE",
      effectTypes: ["summoning", "buff"],

      summoningConfig: {
        creatures: [
          { id : "musical_avatar",
            name: "Avatar of Music",
            description:
              "A being of pure musical energy that fights alongside you",
            size: "Large",
            type: "construct",
            tokenIcon: "spell_holy_innerfire",
            stats: {
              maxHp: 100,
              armor: 18,
              maxMana: 0,
            },
            config: {
              quantity: 1,
              duration: 10,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "mental",
              controlRange: 120,
            },
          },
        ],
        duration: 10,
        durationUnit: "rounds",
        hasDuration: true,
        concentration: false,
        controlRange: 120,
        controlType: "mental",
      },

      buffConfig: {
        buffType: "statusEffect",
        effects: [
          { id : "creative_energy",
            name: "Creative Energy",
            description:
              "Allies gain +1 to all ability scores for the duration of the summon",
            statModifier: {
              stat: "all_stats",
              magnitude: 1,
              magnitudeType: "flat",
            },
            mechanicsText: "+3 to all ability scores for duration of summon",
          },
        ],
        durationValue: 10,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "I", count: 5 },
          { note: "III", count: 3 },
          { note: "V", count: 5 },
        ],
      },

      tags: ["summoning", "buff", "ultimate", "level 10"],
    },

    { id: "minstrel_final_cadence",
      name: "Final Cadence",
      description:
        "The ultimate cadence that consumes all accumulated musical energy to deliver a finishing blow that can end any battle.",
      level: 10,
      spellType: "ACTION",
      icon: "Fire/Rising Inferno",

      typeConfig: {
        school: "ember",
        icon: "Fire/Rising Inferno",
        tags: ["damage", "single target", "ultimate", "resolver", "level 10"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 40 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "CADENZA FINALE!",
        somaticText: "Final strike gesture",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "25d6 + spirit",
        elementType: "storm",
        damageTypes: ["storm"],
        criticalConfig: {
          enabled: true,
          critMultiplier: 3,
          critDiceOnly: false,
        },
        resolution: "DICE",
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "I", count: 5 },
          { note: "III", count: 3 },
          { note: "V", count: 5 },
          { note: "VII", count: 2 },
        ],
        requiredNotes: 15,
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["damage", "single target", "ultimate", "resolver", "level 10"],
    },

    // ADDITIONAL LEVEL 4 SPELL
    { id: "minstrel_harmony_strike",
      name: "Harmony Strike",
      description:
        "Strike with harmonic resonance, dealing storm damage and generating musical notes.",
      level: 4,
      spellType: "ACTION",
      icon: "Bard/Bard Song",
      effectTypes: ["damage"],

      typeConfig: {
        school: "ember",
        icon: "Psychic/Mind Control",
        tags: ["damage", "storm", "note generation", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },

      damageConfig: {
        formula: "5d6 + spirit",
        elementType: "storm",
        damageTypes: ["storm"],
        resolution: "DICE",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: {
          mana: 16,
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      musicalCombo: {
        type: "resolver",
        requires: [
          { note: "II", count: 1 },
          { note: "IV", count: 1 },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      resolution: "DICE",
      tags: ["damage", "storm", "note generation", "universal"],
    },
    // ===== PASSIVE ABILITIES =====
    { id: "minstrel_instrument_dependency",
      name: "Instrument Dependency",
      description:
        "Your magic flows through your instrument. You must have a musical instrument equipped to cast any spell. If you are disarmed, silenced, or your instrument is destroyed, you cannot cast spells or maintain active songs. A replacement instrument costs 50 gold and requires a short rest to attune.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Social/Golden Harp",
      effectTypes: ["passive"],
      typeConfig: {
        school: "wyrd",
        icon: "Social/Golden Harp",
        tags: ["passive", "minstrel", "restriction"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "minstrel", "restriction"],
    },
    { id: "minstrel_songbird_fragility",
      name: "Songbird Fragility",
      description:
        "While you are playing an active song or maintaining a cadence, your guard is lowered. You suffer -2 DR for the duration of any actively maintained musical effect. This penalty stacks with other effects but cannot reduce Passive DR below 0.",
      level: 1,
      spellType: "PASSIVE",
      icon: "General/Broken Armor",
      effectTypes: ["passive"],
      typeConfig: {
        school: "wyrd",
        icon: "General/Broken Armor",
        tags: ["passive", "minstrel", "weakness"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "minstrel", "weakness"],
    },
    { id: "minstrel_dissonant_feedback",
      name: "Dissonant Feedback",
      description:
        "When a musical combo fails (wrong notes played, interrupted, or target resists your cadence), the discordant energy feeds back through your instrument. You take 1d4 wyrd damage per note level of the failed combo. This damage cannot be reduced or prevented.",
      level: 3,
      spellType: "PASSIVE",
      icon: "Psychic/Agonizing Scream",
      effectTypes: ["passive"],
      typeConfig: {
        school: "wyrd",
        icon: "Psychic/Agonizing Scream",
        tags: ["passive", "minstrel", "weakness"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "minstrel", "weakness"],
    },

      {
        "id": "minstrel_symphonic_echo",
        "name": "Symphonic Echo",
        "description": "Imbue an instrument, door handle, or container with a short, beautiful musical chord. When touched by any creature, the chord plays automatically, echoing a pre-recorded memory or message.",
        "level": 1,
        "spellType": "ACTION",
        "icon": "Social/Music Note",
        "typeConfig": {
          "school": "arcane",
          "icon": "Social/Music Note",
          "tags": [
            "utility",
            "roleplay",
            "minstrel"
          ],
          "castTime": 1,
          "castTimeType": "IMMEDIATE"
        },
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "touch",
          "targetRestrictions": []
        },
        "resourceCost": {
          "actionPoints": 1,
          "resourceTypes": [
            "mana"
          ],
          "resourceValues": {
            "mana": 2
          },
          "components": [
            "verbal",
            "somatic"
          ],
          "verbalText": "Echo, resonate...",
          "somaticText": "Lightly tap your instrument, whistling a short five-note melody"
        },
        "resolution": "NONE",
        "effectTypes": [
          "utility"
        ],
        "utilityConfig": {
          "utilityType": "conjuration",
          "selectedEffects": [
            {
              "id": "symphonic_echo_effect",
              "name": "Musical Seal",
              "description": "Stores a 10-second musical message or chord on the touched object. It plays at double your normal speaking volume when the object is next touched."
            }
          ],
          "duration": 24,
          "durationUnit": "hours",
          "concentration": false,
          "power": "minor"
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        },
        "tags": [
          "utility",
          "roleplay",
          "minstrel"
        ]
      },
  ],
};
