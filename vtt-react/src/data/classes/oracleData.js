/**
 * Oracle Class Data
 * 
 * Complete class information for the Oracle - a diviner who sees past, present, and future
 * through the Prophetic Vision resource system.
 */

export const ORACLE_DATA = {
  id: 'oracle',
  name: 'Oracle',
  icon: 'fas fa-eye',
  role: 'Support/Utility (Divination & Fate Manipulation)',
  
  // Overview section
  overview: {
    title: 'The Oracle',
    subtitle: 'Seer of Truths and Weaver of Destiny',
    
    description: `Oracles are mystics who pierce the veil between past, present, and future. Through prophetic visions, they glimpse hidden truths, foresee coming events, and manipulate the threads of fate itself. Unlike the Gambler who relies on luck, or the Chronarch who manipulates time, Oracles see the tapestry of destiny and can subtly alter its weave. Their power grows when their predictions prove true, rewarding insight and foresight.`,
    
    rpIdentity: {
      title: 'Roleplaying Identity',
      content: `Oracles are enigmatic seers who speak in riddles and prophecies. They see connections others miss, perceive hidden motives, and sense the weight of destiny on individuals and events. Some are blessed by divine visions, others cursed with unwanted foresight. They might be:

**The Blind Seer**: Physical blindness traded for supernatural sight
**The Dream Walker**: Receiving visions through dreams and trances
**The Omen Reader**: Interpreting signs in nature, cards, bones, or stars
**The Fate Touched**: Born with the gift (or curse) of prophecy
**The Truth Seeker**: Dedicated to uncovering hidden knowledge

Oracles often struggle with the burden of knowledge - seeing tragedies before they occur, knowing secrets that could destroy relationships, or being unable to change what they foresee. They speak cryptically, not from arrogance, but because the future is fluid and speaking too plainly might alter it.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `In combat, Oracles are tactical support specialists who excel at:

**Prediction & Preparation**: Foreseeing enemy actions and granting allies advantage
**Information Warfare**: Revealing enemy weaknesses, hidden threats, and tactical opportunities
**Fate Manipulation**: Forcing rerolls, altering outcomes, and bending probability
**Debuff & Control**: Cursing enemies with ill omens and prophesied doom
**Utility & Revelation**: Detecting traps, seeing through illusions, and uncovering secrets

Oracles are not direct damage dealers but force multipliers who make their allies more effective and their enemies less so. They shine in complex encounters where information and tactical advantage matter more than raw damage.`
    },
    
    playstyle: {
      title: 'Playstyle',
      content: `Oracles reward players who:

**Think Ahead**: Make predictions about combat outcomes and enemy actions
**Pay Attention**: Notice patterns, remember details, and connect information
**Take Risks**: Spend Visions on bold predictions for greater rewards
**Support Allies**: Focus on making the party more effective rather than personal glory
**Embrace Mystery**: Enjoy cryptic abilities and uncertain outcomes

The class has a unique prediction mechanic where you declare what you think will happen (e.g., "The enemy will miss their next attack" or "Our fighter will land a critical hit") and gain bonuses if your prediction proves true. This creates engaging gameplay where you're constantly reading the battlefield and making tactical forecasts.`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Seer\'s Gambit',
      content: `**The Setup**: You're an Oracle (Fate Weaver specialization) facing a group of assassins (4 assassins + 1 assassin master). Your party is with you. Starting Prophetic Visions: 3 (baseline). Starting Mana: 50/60. Your goal: Make predictions about combat events, gain Visions when correct, then spend Visions to manipulate fate and turn the tide of battle.

**Starting State**: Prophetic Visions: 3/10 | Mana: 50/60 | HP: 55/55

**Turn 1 - First Prediction (Visions: 3 → 4)**

*The assassins emerge from the shadows, blades drawn. You close your eyes and SEE. The future unfolds before you like a tapestry.*

**Your Action (1 AP)**: Make a Simple Prediction
**Prediction**: "The assassin master will attack our tank next turn."

*You open your eyes. "The master will strike our tank. Be ready."*

**Assassin #1's Turn**: Attacks your mage → [16] → Hit! → 2d6+3 → [5, 4] + 3 = 12 damage

**Assassin Master's Turn**: Attacks your tank → [18] → Hit! → 3d6+5 → [6, 5, 4] + 5 = 20 damage

*Your prediction was CORRECT. The master attacked the tank.*

**Prediction Result**: CORRECT! → +1 Prophetic Vision
**Prophetic Visions**: 3 + 1 = **4/10**

**Your Action**: Cast "Omen of Weakness" on Assassin Master (6 mana)
**Effect**: Target has disadvantage on next attack roll

*You point at the assassin master. "I see your blade faltering. Your next strike will fail."*

**Mana**: 50 - 6 = 44/60

**Current State**: Visions: 4/10 | Mana: 44/60

**Turn 2 - Witnessing Fate (Visions: 4 → 5)**

**Your Party's Tank**: Attacks Assassin #1 → [20] → **CRITICAL HIT!** → 4d8+5 → [7, 8, 6, 7] + 5 = 33 damage → Assassin #1 DEAD

*A critical hit occurs within 30 feet of you. You WITNESS the threads of fate aligning.*

**Witnessing Fate**: Critical hit within 30 ft → +1 Prophetic Vision
**Prophetic Visions**: 4 + 1 = **5/10**

**Your Action (1 AP)**: Make a Moderate Prediction
**Prediction**: "The assassin master's next attack will miss due to my Omen of Weakness."

*You speak with certainty. "The master's blade will find only air."*

**Assassin Master's Turn**: Attacks your tank (has disadvantage from Omen of Weakness)
**Attack Roll**: d20+7 with DISADVANTAGE → [17, 9] → Take 9 → 9 + 7 = 16 → Miss! (tank's AC is 17)

*The assassin master's blade swings wide, just as you predicted.*

**Prediction Result**: CORRECT! → +2 Prophetic Visions (moderate prediction)
**Prophetic Visions**: 5 + 2 = **7/10**

**Your Party's Mage**: "You... you KNEW he would miss?"
**You**: "I saw it. The future is clear to me."

**Current State**: Visions: 7/10 | Mana: 44/60

**Turn 3 - Altering Fate (Visions: 7 → 4)**

*Assassin #2 attacks your mage. She's low on HP—this could kill her.*

**Assassin #2's Turn**: Attacks your mage → [18] → Hit! → 2d6+3 → [6, 5] + 3 = 14 damage

*Your mage is at 20 HP. This attack will bring her to 6 HP. But you can CHANGE this.*

**Your Action (Reaction)**: Spend 3 Prophetic Visions to "Alter Fate"
**Effect**: Force enemy to reroll attack with disadvantage

*You raise your hand. "No. That is not how this ends. I have SEEN a different future."*

**Prophetic Visions**: 7 - 3 = **4/10**

**Assassin #2's Reroll**: d20+7 with DISADVANTAGE → [14, 7] → Take 7 → 7 + 7 = 14 → Miss! (mage's AC is 15)

*The assassin's blade passes through empty air. Your mage is unharmed. You changed fate itself.*

**Your Party's Mage**: "I... I should be dead. You saved me."
**You**: "I saw you fall. I wove a different thread. You live."

**Your Action**: Cast "Prophetic Strike" on your tank (8 mana + 1 Vision)
**Effect**: Tank's next attack has advantage and deals +2d6 damage
**Cost**: 8 mana + 1 Prophetic Vision

*You touch your tank's shoulder. "I see your blade striking true. Trust the vision."*

**Mana**: 44 - 8 = 36/60
**Prophetic Visions**: 4 - 1 = **3/10**

**Current State**: Visions: 3/10 | Mana: 36/60

**Turn 4 - Prediction Payoff (Visions: 3 → 5)**

**Your Action (1 AP)**: Make a Complex Prediction
**Prediction**: "Our tank will land a critical hit on the assassin master with Prophetic Strike active."

*You speak with absolute certainty. "The master will fall to our tank's blade. I have SEEN it."*

**Your Party's Tank's Turn**: Attacks Assassin Master (has advantage from Prophetic Strike)
**Attack Roll**: d20+6 with ADVANTAGE → [19, 12] → Take 19 → **CRITICAL HIT!** (19-20 crit range)
**Damage**: 2d8+5 → [8, 7] + 5 = 20 damage → DOUBLED = 40 damage
**Prophetic Strike Bonus**: +2d6 → [5, 6] = +11 damage
**Total Damage**: 40 + 11 = **51 damage!**

*The tank's blade GLOWS with prophetic energy. The strike is PERFECT. The assassin master falls, dead.*

**Assassin Master**: DEAD

**Prediction Result**: CORRECT! → +3 Prophetic Visions (complex prediction)
**Prophetic Visions**: 3 + 3 = **6/10**

**Witnessing Fate**: Critical hit within 30 ft → +1 Prophetic Vision
**Prophetic Visions**: 6 + 1 = **7/10**

**Your Party's Tank**: "I... I've never hit that hard. Fifty-one damage. What did you DO?"
**You**: "I saw the future where you struck true. I made it real. Prophetic Strike gave you advantage and +2d6 damage. You rolled a 19—a critical hit. I predicted it. And it came to pass."

**Current State**: Visions: 7/10 | Mana: 36/60

**Turn 5 - Finishing the Fight**

*Three assassins remain. You have 7 Visions. Time to end this.*

**Your Action**: Spend 5 Prophetic Visions to cast "Doom Prophecy" (10 mana + 5 Visions)
**Effect**: All enemies within 30 ft must save DC 16 Wisdom or take 6d8 psychic damage and be frightened

*You raise both hands. Your eyes GLOW with prophetic power. "I have seen your deaths. They are INEVITABLE."*

**Mana**: 36 - 10 = 26/60
**Prophetic Visions**: 7 - 5 = **2/10**

**Assassin #2 Save**: [9] → FAIL! → 6d8 psychic → [7, 6, 8, 5, 6, 7] = 39 damage → DEAD + Frightened
**Assassin #3 Save**: [11] → FAIL! → 39 damage → DEAD + Frightened
**Assassin #4 Save**: [14] → FAIL! → 39 damage → DEAD + Frightened

*All three assassins clutch their heads, screaming. They see their own deaths in vivid detail. Then they fall, dead, their minds shattered by the prophecy.*

**Combat Over**

*You lower your hands. Your eyes stop glowing. The battlefield is silent.*

**Your Party's Mage**: "You... you killed them with a VISION. They saw their own deaths and it killed them."
**You**: "I showed them the truth. Their fates were sealed. I merely revealed it."
**Your Party's Tank**: "And you saved our mage by changing fate. You made the assassin miss."
**You**: "I saw two futures. In one, she died. In the other, she lived. I spent 3 Visions to make the second future real."
**Your Party's Rogue**: "How many Visions do you have now?"
**You**: "Two. I started with 3, gained 7 through correct predictions and witnessing critical hits, spent 9 total. But I'll regenerate to 3 at our next long rest."

**Final State**: Visions: 2/10 | Mana: 26/60 | HP: 55/55

**The Lesson**: Oracle gameplay is about:
1. **Making Predictions**: Made 3 predictions (simple, moderate, complex), gained 1/2/3 Visions when correct
2. **Witnessing Fate**: Gained +1 Vision each time a critical hit occurred within 30 ft (2 crits = +2 Visions)
3. **Altering Fate**: Spent 3 Visions to force assassin to reroll with disadvantage, saved mage's life
4. **Vision-Powered Spells**: Prophetic Strike (8 mana + 1 Vision), Doom Prophecy (10 mana + 5 Visions)
5. **Prediction Accuracy**: All 3 predictions were correct, gained 6 Visions total from predictions
6. **Vision Economy**: Started with 3, gained 7, spent 9, ended with 2
7. **Fate Manipulation**: Changed the future by forcing rerolls and granting advantage

You're not a damage dealer. You're a SEER who manipulates FATE. You make predictions about what will happen, and when you're right, you gain Prophetic Visions. You spend those Visions to CHANGE reality—force rerolls, grant advantage, unleash devastating prophecies. The key is reading the battlefield, making accurate predictions, and spending Visions at critical moments. When you spend 3 Visions to make an assassin miss and save your mage, you're REWRITING FATE. When you spend 5 Visions to cast Doom Prophecy and kill three enemies by showing them their own deaths, you're wielding DESTINY as a weapon. You see the future. And you make it real.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Prophetic Visions',
    subtitle: 'The Oracle\'s Unique Resource Mechanic',

    description: `Oracles generate Prophetic Visions by making accurate predictions and revealing hidden truths. These Visions can be spent to manipulate fate, force rerolls, or unleash powerful divination magic. The more accurate your predictions, the more power you accumulate.`,

    resourceBarExplanation: {
      title: 'Understanding Your Prophetic Visions Interface',
      content: `**What You See**: The Oracle's interface displays a mystical EYE OF PROPHECY with 10 glowing iris segments representing your Prophetic Visions. As you make correct predictions and witness fate, the eye fills with radiant light. Active predictions are shown as floating text above the eye, and fate manipulation options appear when you have Visions to spend.

**EYE OF PROPHECY DISPLAY** (Center of HUD):

**Eye Visualization**:
- **Outer Ring**: Ornate mystical eye with 10 iris segments
- **Iris Segments**: Each segment represents 1 Prophetic Vision (0-10 total)
- **Pupil**: Central dark circle that glows brighter as Visions increase
- **Eyelids**: Partially closed when low Visions, wide open when high Visions
- **Aura**: Swirling ethereal energy around the eye

**Vision Level Visualization**:

**0-2 Visions (Low Insight)**:
- **Iris**: Only 0-2 segments filled with dim blue light
- **Pupil**: Dark, barely glowing
- **Eyelids**: Nearly closed, squinting
- **Aura**: Faint wisps of blue energy
- **Status**: "Low Visions - Limited Foresight"
- **Border**: Gray

**3-5 Visions (Moderate Insight)**:
- **Iris**: 3-5 segments filled with moderate blue-white glow
- **Pupil**: Glowing softly
- **Eyelids**: Half-open
- **Aura**: Moderate swirling energy
- **Status**: "Moderate Visions - Clear Sight"
- **Border**: Blue

**6-8 Visions (High Insight)**:
- **Iris**: 6-8 segments filled with bright silver-blue light
- **Pupil**: Glowing brightly, pulsing
- **Eyelids**: Wide open, alert
- **Aura**: Strong swirling energy, occasional flashes
- **Status**: "High Visions - Prophetic Clarity"
- **Border**: Silver

**9-10 Visions (MAXIMUM FORESIGHT)**:
- **Iris**: 9-10 segments filled with BRILLIANT white-gold light
- **Pupil**: BLAZING with prophetic power, radiating light
- **Eyelids**: FULLY OPEN, eye staring intensely
- **Aura**: INTENSE swirling energy, constant flashes, reality distortion effect
- **Status**: "MAXIMUM VISIONS - OMNISCIENT SIGHT"
- **Border**: Gold, pulsing
- **Screen Effect**: Slight ethereal overlay, you can see faint outlines of future events

**Vision Generation Animation**:

**Correct Prediction**:
- **Prediction Text**: "Prediction: Tank will be attacked" (shown above eye)
- **Event Occurs**: Tank is attacked
- **Validation**: "PREDICTION CORRECT!" text flashes in gold
- **Vision Gain**: Eye iris segment LIGHTS UP, +1/2/3 Visions based on complexity
- **Audio**: Mystical chime, whisper of "truth revealed"
- **Text Notification**: "+2 Prophetic Visions (Correct Prediction)"
- **Pupil Flash**: Pupil flashes brightly

**Witnessing Fate (Critical Hit)**:
- **Critical Hit Occurs**: Ally or enemy rolls natural 20 within 30 ft
- **Fate Detection**: Eye PULSES, detecting the critical moment
- **Vision Gain**: Iris segment lights up, +1 Vision
- **Audio**: Soft bell chime
- **Text Notification**: "+1 Prophetic Vision (Witnessed Critical Hit)"
- **Visual**: Brief flash of light from eye to the critical hit location

**Revealing Truth**:
- **Divination Cast**: You cast "Detect Lies" or similar
- **Truth Revealed**: "Enemy is lying about their intentions"
- **Vision Gain**: Iris segment lights up, +1 Vision
- **Audio**: Revelation sound (mystical whoosh)
- **Text Notification**: "+1 Prophetic Vision (Truth Revealed)"

**Prediction Interface**:

**Making a Prediction** (1 AP):
- **Prediction Menu**: Opens with three options
  * "Simple Prediction (+1 Vision if correct)"
  * "Moderate Prediction (+2 Visions if correct)"
  * "Complex Prediction (+3 Visions if correct)"
- **Text Input**: "Enter your prediction: ___"
- **Examples Shown**: "Enemy will attack tank" / "Ally will crit" / "Enemy will cast Fireball"
- **Confirm Button**: "MAKE PREDICTION"

**Active Prediction Display**:
- **Floating Text**: Above the Eye of Prophecy
- **Prediction**: "ACTIVE: Tank will be attacked next turn"
- **Complexity**: "Moderate Prediction (+2 Visions if correct)"
- **Timer**: "Resolves: Next turn"
- **Status**: "Pending..." (yellow) or "CORRECT!" (gold) or "Incorrect" (red)

**Prediction Resolution**:
- **Correct**: Eye flashes gold, iris segments fill, "+2 Visions!" text
- **Incorrect**: Eye dims briefly, "Prediction Failed" text, no Visions gained
- **Partial**: Some predictions can be partially correct for reduced Visions

**Vision Spending Interface**:

**Alter Fate Options** (when you have Visions):
- **Button 1**: "Force Reroll (3 Visions)" - glows when available
- **Button 2**: "Grant Advantage (2 Visions)" - glows when available
- **Button 3**: "Add +5 to Roll (1 Vision)" - glows when available
- **Button 4**: "Subtract -5 from Roll (1 Vision)" - glows when available

**Alter Fate Animation**:
When you spend Visions to alter fate:
- **Vision Drain**: Eye iris segments DIM (e.g., 7 Visions → 4 Visions, 3 segments fade)
- **Fate Manipulation**: Ethereal energy BURSTS from eye toward target
- **Reality Warp**: Brief distortion effect around target
- **Reroll**: Dice appears, spins, shows new result
- **Audio**: Reality-warping sound (deep resonance + high chime)
- **Text Notification**: "FATE ALTERED! Forced reroll (spent 3 Visions)"

**Vision-Powered Spell Interface**:
When casting spells that cost Visions:
- **Spell Button**: "Prophetic Strike (8 mana + 1 Vision)"
- **Cost Display**: Shows both mana and Vision cost
- **Warning**: "Will reduce Visions: 7 → 6"
- **Cast Animation**: Eye glows, Vision drains, spell effect enhanced with prophetic energy

**Doom Prophecy Cast** (5 Visions):
- **Vision Drain**: 5 iris segments DIM rapidly
- **Eye Transformation**: Eye OPENS FULLY, pupil becomes VOID
- **Prophecy Projection**: Ethereal visions of death project from eye to enemies
- **Enemy Reaction**: Enemies see their own deaths, clutch heads, scream
- **Damage Numbers**: "39 psychic damage (Doom Prophecy)" appears
- **Audio**: Ominous whispers, screams, reality tearing
- **Screen Effect**: Brief flash of death visions

**Fate Thread Visualization**:
When you have high Visions (7+):
- **Fate Threads**: Ethereal silver threads appear connecting you to allies and enemies
- **Thread Colors**:
  * Allies: Golden threads (positive fate)
  * Enemies: Red threads (doomed fate)
  * Uncertain: Silver threads (fate undecided)
- **Thread Manipulation**: When you alter fate, threads SHIFT and REWEAVE

**Prediction History Log**:
- **Recent Predictions**: Shows last 3 predictions
  * "Tank attacked ✓ (+2 Visions)"
  * "Mage will crit ✗ (Failed)"
  * "Enemy casts spell ✓ (+2 Visions)"
- **Accuracy Rate**: "Prediction Accuracy: 75% (6/8 correct)"

**Vision Regeneration Indicator**:
- **Long Rest**: "Visions will reset to 3 at next long rest"
- **Current**: "Visions: 2/10 (will regenerate to 3)"
- **Baseline**: "Baseline Prophetic Insight: 3 Visions"

**Why This Matters**: The Eye of Prophecy makes you FEEL like a seer. When you make a prediction—"The tank will be attacked"—and it comes true, the eye FLASHES GOLD, an iris segment LIGHTS UP, and "+2 Prophetic Visions" appears. You were RIGHT. You SAW the future. When you have 7 Visions and the eye is WIDE OPEN with silver-blue light, you can see fate threads connecting everyone on the battlefield. When you spend 3 Visions to force an enemy to reroll and the eye BURSTS with energy, reality WARPS, and the dice spins to a new result—you just CHANGED FATE. When you cast Doom Prophecy with 5 Visions and the eye becomes a VOID projecting death visions to enemies, you're wielding DESTINY as a weapon. The prediction interface makes the mechanic engaging: you type your prediction, it floats above the eye, and when it resolves you get immediate feedback. Every correct prediction makes you stronger. Every Vision spent reshapes reality. You don't just see the future—you MAKE it.`
    },

    mechanics: {
      title: 'How Prophetic Visions Work',
      content: `**Generating Visions**
You gain Prophetic Visions through:

• **Correct Predictions**: Declare a prediction before an event (e.g., "The next attack will miss"). If correct, gain 1-3 Visions based on specificity
• **Revealing Truths**: Use divination abilities to uncover hidden information (traps, lies, weaknesses) - gain 1 Vision per revelation
• **Fulfilling Prophecies**: At the start of each session, make 3 prophecies about what will happen. Each that comes true grants 2 Visions
• **Witnessing Fate**: When a critical hit or critical miss occurs within 30 feet, gain 1 Vision

**Spending Visions**
Visions can be spent to:

• **Alter Fate** (1-3 Visions): Force a reroll, grant advantage/disadvantage, or add/subtract from a roll
• **Cast Divination Spells**: Many Oracle spells cost Visions instead of or in addition to mana
• **Activate Prophecies**: Trigger powerful effects by spending accumulated Visions
• **Weave Destiny**: Manipulate the threads of fate to create specific outcomes

**Vision Storage**
• Maximum Visions: 10
• Visions persist between combats
• Visions reset to 3 at the start of each long rest (representing baseline prophetic insight)`
    },
    
    predictionMechanics: {
      title: 'Prediction System',
      content: `**Making Predictions**
For 1 AP, you can make a prediction about an upcoming event:

**Simple Prediction** (1 Vision if correct):
• "The next attack will hit/miss"
• "The enemy will move/stay still"
• "An ally will take damage this round"

**Specific Prediction** (2 Visions if correct):
• "The rogue will land a critical hit"
• "The enemy will cast a spell"
• "The fighter will be reduced below half HP"

**Precise Prediction** (3 Visions if correct):
• "The enemy will cast Fireball targeting our cleric"
• "The next attack will roll between 15-20"
• "Two enemies will fall this round"

**Prophecy Timing**
Predictions must be made before the event occurs and are resolved immediately when the event happens or fails to happen. Failed predictions grant no Visions but have no other penalty.`
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Vision Economy**
• Start each session with 3 Visions from your long rest
• Make session prophecies early to potentially gain 6 more Visions (3 prophecies × 2 Visions each)
• Balance between making predictions (risky but rewarding) and spending Visions (immediate power)
• Save Visions for critical moments when altering fate could turn the tide

**Prediction Strategy**
• Make simple predictions frequently to build Visions steadily
• Save specific/precise predictions for when you have strong information
• Use divination spells to gather information that makes predictions easier
• Coordinate with allies to set up predictable scenarios

**Specialization Synergy**
• **Seers** excel at future predictions and gain bonus Visions from correct forecasts
• **Truthseekers** focus on revealing hidden information and past events
• **Fateweavers** spend Visions aggressively to manipulate outcomes directly`
    },

    playingInPerson: {
      title: 'Playing Oracle In Person',
      content: `**Required Materials**:
- **10 Prophetic Vision Tokens** (coins, beads, or dice representing Visions 0-10)
- **Prediction Cards** (for writing down predictions before they resolve)
- **Vision Type Chart** (showing Simple, Complex, and Grand predictions)
- **Fate Manipulation Cards** (showing abilities that spend Visions)
- **Witnessing Tracker** (for tracking critical hits, natural 1s, and major events)
- **Specialization Card** (showing spec-specific bonuses)

**Primary Tracking Method: Vision Tokens + Prediction Cards**

The Oracle gains Prophetic Visions (0-10) by making correct predictions about combat events. Write predictions on cards, then gain Visions when they prove true. Spend Visions on fate manipulation abilities to alter outcomes and bend probability.

**Setup**:
\`\`\`
ORACLE RESOURCE TRACKING:

PROPHETIC VISIONS: [___] / 10
• Start combat: 3 Visions (baseline)
• Gain Visions: Make correct predictions
• Spend Visions: Fate manipulation abilities

VISION GENERATION:
• Simple Prediction (correct): +1 Vision
• Complex Prediction (correct): +2 Visions
• Grand Prediction (correct): +3 Visions
• Witness Critical Hit (within 30 ft): +1 Vision
• Witness Natural 1 (within 30 ft): +1 Vision
• Witness Major Event: +1-3 Visions

VISION SPENDING:
• Force Reroll (2 Visions): Force ally/enemy to reroll
• Alter Fate (3 Visions): Grant advantage/disadvantage
• Prophesied Doom (4 Visions): Curse enemy with ill omen
• Twist Destiny (5 Visions): Change outcome dramatically
• Divine Intervention (10 Visions): Ultimate fate manipulation
\`\`\`

**How It Works**:

**Making Predictions**:
1. **Declare prediction** → Write on prediction card
2. **Wait for resolution** → See if prediction comes true
3. **Correct prediction** → Gain Visions based on difficulty
4. **Add Vision tokens** → Increase Vision count

**Spending Visions**:
1. **Choose ability** → Check Vision cost
2. **Remove Vision tokens** → Subtract from Vision count
3. **Activate ability** → Apply fate manipulation effect

**Prediction Types**:

**Simple Prediction (+1 Vision if correct)**:
- "Enemy will miss next attack"
- "Ally will hit next attack"
- "Enemy will move closer"
- Easy to predict, low reward

**Complex Prediction (+2 Visions if correct)**:
- "Ally will land critical hit within 2 turns"
- "Enemy will cast specific spell"
- "Ally will reduce enemy to 0 HP"
- Moderate difficulty, moderate reward

**Grand Prediction (+3 Visions if correct)**:
- "Combat will end within 3 turns"
- "Specific ally will deliver killing blow"
- "Enemy will flee before dying"
- Hard to predict, high reward

**Example Prediction Making**:

*You have 3 Visions, making a Simple Prediction*

**Your Turn - Make Prediction**:
1. "I predict the orc will miss its next attack!" (1 AP)
2. Write on prediction card: "Orc misses next attack"
3. Wait for orc's turn

**Orc's Turn**:
1. Orc attacks your tank
2. Attack roll: 1d20+5 → [4] + 5 = 9 (miss!)
3. **Prediction CORRECT!**
4. Gain +1 Vision
5. Add 1 Vision token
6. Prophetic Visions: 3 + 1 = **4 Visions**

**Example Complex Prediction**:

*You have 4 Visions, making a Complex Prediction*

**Your Turn - Complex Prediction**:
1. "I predict our fighter will land a critical hit within 2 turns!" (1 AP)
2. Write on prediction card: "Fighter crits within 2 turns"
3. Wait for resolution

**Fighter's Turn (Turn 1)**:
1. Fighter attacks orc
2. Attack roll: 1d20+5 → [15] + 5 = 20 (hit, not crit)
3. Prediction not yet resolved

**Fighter's Turn (Turn 2)**:
1. Fighter attacks orc again
2. Attack roll: 1d20+5 → [20] + 5 = 25 (**CRITICAL HIT!**)
3. **Prediction CORRECT!**
4. Gain +2 Visions
5. Add 2 Vision tokens
6. Prophetic Visions: 4 + 2 = **6 Visions**

**Example Witnessing Fate**:

*You have 6 Visions, ally lands critical hit within 30 ft*

**Ally's Turn**:
1. Ally attacks enemy
2. Attack roll: 1d20+5 → [20] + 5 = 25 (**CRITICAL HIT!**)
3. **Witnessing Fate**: Critical hit within 30 ft
4. Gain +1 Vision
5. Add 1 Vision token
6. Prophetic Visions: 6 + 1 = **7 Visions**

**Example Vision Spending**:

*You have 7 Visions, using Alter Fate to grant advantage*

**Enemy's Turn**:
1. Dragon attacks your ally
2. "I use Alter Fate to grant my ally advantage on the save!" (3 Visions)
3. Remove 3 Vision tokens
4. Prophetic Visions: 7 - 3 = **4 Visions**
5. Ally rolls save with advantage
6. Save roll: 1d20+3 (advantage) → [18, 7] + 3 = 21 (success!)

**Prediction Card Template**:
\`\`\`
═══════════════════════════════════
    PREDICTION CARD
═══════════════════════════════════
TYPE: [Simple / Complex / Grand]

PREDICTION:
_____________________________________
_____________________________________

RESOLUTION:
☐ Correct (+___ Visions)
☐ Incorrect (no Visions)

TURN MADE: ___
TURN RESOLVED: ___
═══════════════════════════════════
\`\`\`

**Vision Generation Chart**:
\`\`\`
═══════════════════════════════════
  PROPHETIC VISION GENERATION
═══════════════════════════════════
PREDICTIONS:
• Simple (correct): +1 Vision
  Examples: "Enemy misses", "Ally hits"

• Complex (correct): +2 Visions
  Examples: "Ally crits within 2 turns"

• Grand (correct): +3 Visions
  Examples: "Combat ends within 3 turns"

WITNESSING FATE:
• Critical hit (within 30 ft): +1 Vision
• Natural 1 (within 30 ft): +1 Vision
• Major event (DM discretion): +1-3 Visions

SPECIALIZATION BONUSES:
• Seer: +1 Vision for correct future predictions
• Truthseeker: +1 Vision for revealing secrets
• Fateweaver: +1 Vision when spending Visions
═══════════════════════════════════
\`\`\`

**Vision Spending Reference Card**:
\`\`\`
═══════════════════════════════════
   FATE MANIPULATION ABILITIES
═══════════════════════════════════
FORCE REROLL (2 Visions):
• Force ally or enemy to reroll any roll
• Must use new result
• Reaction to use

ALTER FATE (3 Visions):
• Grant advantage or disadvantage on any roll
• Affects next roll only
• Reaction to use

PROPHESIED DOOM (4 Visions):
• Curse enemy with ill omen
• Enemy has disadvantage on all rolls for 2 turns
• Action to use

TWIST DESTINY (5 Visions):
• Change outcome dramatically
• Turn hit into miss, or miss into hit
• Turn success into failure, or vice versa
• Reaction to use

DIVINE INTERVENTION (10 Visions - ULTIMATE):
• Rewrite fate entirely
• Prevent death, guarantee success, or alter reality
• Once per long rest
• Reaction to use
═══════════════════════════════════
\`\`\`

**Example In-Person Turn**:

*You have 5 Visions, making predictions and spending Visions*

**Turn 1 - Make Prediction**:
1. "I predict the mage will cast Fireball next turn!" (Complex Prediction)
2. Write on prediction card: "Mage casts Fireball next turn"
3. Wait for mage's turn

**Mage's Turn**:
1. Mage casts Fireball at party
2. **Prediction CORRECT!**
3. Gain +2 Visions
4. Add 2 Vision tokens
5. Prophetic Visions: 5 + 2 = **7 Visions**

**Turn 2 - Alter Fate**:
1. Ally makes save against Fireball
2. "I use Alter Fate to grant advantage!" (3 Visions)
3. Remove 3 Vision tokens
4. Prophetic Visions: 7 - 3 = **4 Visions**
5. Ally rolls save with advantage: [18, 9] + 3 = 21 (success!)

**Turn 3 - Witness Critical**:
1. Fighter attacks enemy
2. Attack roll: [20] = **CRITICAL HIT!**
3. **Witnessing Fate**: +1 Vision
4. Add 1 Vision token
5. Prophetic Visions: 4 + 1 = **5 Visions**

**Alternative Tracking Methods**:

**Method 1: D10 Die**
- Rotate die to show current Visions (0-10)
- Quick and visual
- Single die tracks everything

**Method 2: Token Stack**
- Stack tokens vertically (0-10 tokens)
- Visual representation of foresight
- Satisfying to add/remove

**Method 3: Bead Counter**
- String of beads (10 beads)
- Move beads to track Visions
- Tactile feedback

**Method 4: Paper Tracking**
- Write Vision count on paper
- Cross out and rewrite as it changes
- Minimalist approach

**Prediction Tracking Methods**:

**Method 1: Index Cards**
- Write predictions on index cards
- Flip card when resolved
- Clear and organized

**Method 2: Sticky Notes**
- Write predictions on sticky notes
- Remove when resolved
- Quick and disposable

**Method 3: Prediction Sheet**
- Pre-printed sheet with prediction slots
- Check boxes for correct/incorrect
- Reusable

**Quick Reference Card Template**:
\`\`\`
ORACLE QUICK REFERENCE

VISION GENERATION:
• Simple Prediction (correct): +1 Vision
• Complex Prediction (correct): +2 Visions
• Grand Prediction (correct): +3 Visions
• Witness Critical/Natural 1: +1 Vision
• Seer spec: +1 Vision for future predictions

VISION SPENDING:
• Force Reroll (2 Visions): Reroll any roll
• Alter Fate (3 Visions): Advantage/disadvantage
• Prophesied Doom (4 Visions): Curse enemy
• Twist Destiny (5 Visions): Change outcome
• Divine Intervention (10 Visions): Ultimate

PREDICTION STRATEGY:
• Make Simple Predictions early for safe Visions
• Make Complex Predictions when confident
• Save Grand Predictions for critical moments
• Witness critical hits and natural 1s for bonus Visions
• Spend Visions on critical saves and attacks

FATE MANIPULATION:
• Save 3 Visions for Alter Fate (emergency)
• Save 5 Visions for Twist Destiny (game-changer)
• Save 10 Visions for Divine Intervention (ultimate)
\`\`\`

**Thematic Enhancements**:

Many players enhance the Oracle experience with:
- **Crystal Ball**: Small crystal prop for divination theme
- **Tarot Cards**: Use tarot cards for prediction tracking
- **Purple Dice**: Purple/mystical dice for Vision tracking
- **Prophecy Scrolls**: Parchment for writing predictions
- **Vision Tokens**: Eye-shaped tokens for Prophetic Visions
- **Fate Dice**: Special dice for fate manipulation rolls

**Vision Management Tips**:

**Generation Strategy**:
- **Safe Predictions**: Make Simple Predictions for guaranteed Visions
- **Calculated Risks**: Make Complex Predictions when confident
- **Grand Gambles**: Make Grand Predictions for high-stakes moments
- **Witnessing**: Position within 30 ft of allies for Witnessing bonuses
- **Seer Spec**: Focus on future predictions for bonus Visions

**Spending Strategy**:
- **Emergency Reserve**: Keep 3 Visions for Alter Fate
- **Game-Changer**: Save 5 Visions for Twist Destiny
- **Ultimate**: Save 10 Visions for Divine Intervention
- **Don't Hoard**: Spend Visions when they matter most
- **Fateweaver Spec**: Spend aggressively for bonus Visions

**Prediction Strategy**:
- **Observe Patterns**: Watch enemy behavior for prediction clues
- **Know Your Allies**: Predict ally actions based on their playstyle
- **Read the DM**: Pay attention to DM hints and foreshadowing
- **Start Simple**: Build Visions with Simple Predictions first
- **Escalate**: Make Complex/Grand Predictions when you have Vision buffer

**Why This System Works**: The prediction mechanic creates active engagement with combat. Instead of passively watching, you're constantly analyzing, predicting, and forecasting. Writing predictions on cards creates accountability and excitement when they resolve. The Vision generation creates a satisfying feedback loop—correct predictions generate Visions, which you spend on fate manipulation. The three prediction tiers (Simple/Complex/Grand) create risk/reward decisions. The Witnessing mechanic rewards positioning and awareness. The system is simple to track but creates deep strategic gameplay.

**Pro Tips**:
- **Write Predictions**: Always write predictions on cards for clarity
- **Observe First**: Watch 1-2 turns before making predictions
- **Safe Building**: Use Simple Predictions to build Vision baseline
- **Critical Saves**: Use Alter Fate on critical saves (death saves, major spells)
- **Twist Destiny**: Use on attacks that would kill allies or miss critical targets
- **Divine Intervention**: Save for preventing party wipes or ensuring victory
- **Specialization Awareness**: Know your spec bonuses and maximize them

**Budget-Friendly Alternatives**:
- **No tokens?** Use coins (pennies = 1 Vision, dimes = 10 Visions)
- **No prediction cards?** Write predictions on paper
- **No die?** Track Vision count on paper
- **Minimalist**: Track Visions and predictions on single sheet

**Specialization-Specific Tracking**:

**Seer**:
- Track +1 Vision bonus for correct future predictions
- Focus on predicting future events
- Gain bonus Visions from foresight

**Truthseeker**:
- Track +1 Vision bonus for revealing secrets
- Focus on uncovering hidden information
- Gain bonus Visions from revelation

**Fateweaver**:
- Track +1 Vision bonus when spending Visions
- Spend Visions aggressively
- Gain bonus Visions from manipulation

**Why Oracle Is Perfect for In-Person Play**: The class is built around active engagement and prediction. Writing predictions on cards creates tangible accountability and excitement when they resolve. The Vision token system provides satisfying feedback—correct predictions generate visible resources. The fate manipulation abilities create dramatic moments (rerolls, advantage, outcome changes). The Witnessing mechanic rewards positioning and awareness. The prediction mechanic encourages reading the table, observing patterns, and engaging with combat narratively. Every prediction is a gamble, and every correct prediction is a payoff. The system transforms passive observation into active participation.`
    }
  },

  // Specializations
  specializations: {
    title: 'Oracle Specializations',
    subtitle: 'Three Paths of Prophetic Mastery',
    
    description: `Oracles can specialize in different aspects of divination and fate manipulation. Seers focus on future sight and prediction, Truthseekers uncover hidden knowledge and past events, while Fateweavers actively manipulate destiny threads to create desired outcomes.`,
    
    passiveAbility: {
      name: 'Third Eye',
      description: 'All Oracles can see invisible creatures and objects within 30 feet, have advantage on Insight checks, and can detect when someone is lying to them (though not what the truth is). You also start each long rest with 3 Prophetic Visions.'
    },
    
    specs: [
      {
        id: 'seer',
        name: 'Seer',
        icon: 'spell_holy_farsight',
        color: '#9370DB',
        theme: 'Future Sight & Prediction Mastery',
        
        description: `Seers specialize in glimpsing the future, making their predictions more accurate and rewarding. They can see multiple possible futures and guide allies toward the best outcomes. Their visions of what's to come make them invaluable tactical advisors.`,
        
        playstyle: 'Prediction focus, future sight, tactical foresight, ally guidance',
        
        strengths: [
          'Gain bonus Visions from correct predictions (+1 per prediction)',
          'Can make predictions for 0 AP (free) instead of 1 AP',
          'See 3 seconds into the future, granting advantage on initiative',
          'Predictions have longer duration and can stack'
        ],
        
        weaknesses: [
          'Abilities focused on prediction rather than direct power',
          'Requires accurate forecasting to be effective',
          'Less useful when facing completely unpredictable enemies',
          'Minimal direct damage output'
        ],
        
        specPassive: {
          name: 'Prophetic Clarity',
          description: 'Your predictions grant +1 additional Vision when correct. You can make predictions as a free action (once per round). When you make a correct specific or precise prediction, you can immediately make another prediction for free.'
        },
        
        keyAbilities: [
          'Foresight: See 6 seconds into the future, gaining advantage on your next action (2 Visions)',
          'Shared Vision: Grant an ally advantage on their next roll by showing them the future (1 Vision)',
          'Inevitable Outcome: Declare an attack will hit or miss - it does (5 Visions, once per long rest)'
        ],
        
        recommendedFor: 'Players who enjoy tactical planning and making accurate predictions'
      },

      {
        id: 'truthseeker',
        name: 'Truthseeker',
        icon: 'spell_holy_searinglightpriest',
        color: '#FFD700',
        theme: 'Past Sight & Hidden Knowledge',

        description: `Truthseekers peer into the past and uncover hidden truths. They can read the history of objects, see through lies and illusions, and reveal secrets long buried. Their power comes from knowledge itself, making them master investigators and lore keepers.`,

        playstyle: 'Information gathering, lie detection, secret revelation, investigation',

        strengths: [
          'Automatically detect lies and illusions within 30 feet',
          'Can read the history of objects and locations',
          'Reveal hidden enemies, traps, and secret doors',
          'Gain Visions from uncovering secrets (1 per revelation)'
        ],

        weaknesses: [
          'Less effective in straightforward combat',
          'Abilities require time and investigation',
          'Knowledge doesn\'t always translate to power',
          'Minimal offensive capabilities'
        ],

        specPassive: {
          name: 'All-Seeing Eye',
          description: 'You automatically detect lies, illusions, and hidden creatures within 30 feet. When you reveal a hidden truth (trap, secret door, disguised enemy, etc.), gain 1 Vision. You can touch an object to see its history for the past 24 hours.'
        },

        keyAbilities: [
          'Reveal Truth: Force a creature to answer one question truthfully (3 Visions, Wisdom save to resist)',
          'Past Sight: Touch an object to see its complete history (2 Visions, 1 minute ritual)',
          'Piercing Gaze: See through all illusions and disguises within 60 feet for 1 minute (2 Visions)'
        ],

        recommendedFor: 'Players who love investigation, uncovering secrets, and gathering information'
      },

      {
        id: 'fateweaver',
        name: 'Fateweaver',
        icon: 'spell_arcane_prismaticcloak',
        color: '#FF1493',
        theme: 'Destiny Manipulation & Fate Alteration',

        description: `Fateweavers don't just see destiny - they reshape it. By manipulating the threads of fate, they can force rerolls, alter outcomes, and bend probability to their will. They are aggressive Vision spenders who actively change the course of events rather than merely predicting them.`,

        playstyle: 'Fate manipulation, reroll forcing, outcome alteration, aggressive Vision spending',

        strengths: [
          'Can force enemies to reroll successful attacks',
          'Grant allies rerolls on failed saves or attacks',
          'Manipulate dice results by adding or subtracting values',
          'Create "fate locks" that guarantee specific outcomes'
        ],

        weaknesses: [
          'Burns through Visions quickly',
          'Less Vision generation than other specs',
          'Requires constant Vision management',
          'Reactive playstyle dependent on enemy actions'
        ],

        specPassive: {
          name: 'Threads of Destiny',
          description: 'You can see the glowing threads of fate connecting all creatures. Once per round as a reaction, you can spend 1 Vision to force any creature within 60 feet to reroll an attack, save, or ability check. You choose which result they use.'
        },

        keyAbilities: [
          'Twist Fate: Spend 2 Visions to add or subtract 1d6 from any roll within 60 feet',
          'Sever Thread: Spend 3 Visions to turn a critical hit into a normal hit (or vice versa)',
          'Destiny Lock: Spend 5 Visions to guarantee the next attack against a target hits and crits (once per long rest)'
        ],

        recommendedFor: 'Players who want to actively manipulate combat outcomes and control probability'
      }
    ]
  },

  // Example Spells - organized by specialization
  exampleSpells: [
    // ===== SEER SPECIALIZATION =====
    {
      id: 'oracle_foresight',
      name: 'Foresight',
      description: 'Peer 6 seconds into the future to see the outcome of your next action, granting you perfect clarity.',
      spellType: 'ACTION',
      icon: 'spell_holy_farsight',
      school: 'Divination',
      level: 2,
      specialization: 'seer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SELF',
        range: 0,
        rangeUnit: 'self'
      },

      resourceCost: {
        actionPoints: 1,
        visions: 2,
        components: ['verbal', 'somatic'],
        description: 'Spend 2 Prophetic Visions to glimpse the immediate future'
      },

      duration: {
        value: 1,
        unit: 'round',
        concentration: false
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Gain advantage on your next attack roll, ability check, or saving throw',
        secondary: 'If you make a prediction about the outcome before rolling, gain +1 Vision if correct'
      },

      tags: ['seer', 'divination', 'advantage', 'self-buff']
    },

    {
      id: 'oracle_shared_vision',
      name: 'Shared Vision',
      description: 'Show an ally a glimpse of the future, guiding their actions toward success.',
      spellType: 'ACTION',
      icon: 'spell_holy_divineprovidence',
      school: 'Divination',
      level: 1,
      specialization: 'seer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 60,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: true,
        allowSelf: false
      },

      resourceCost: {
        actionPoints: 2,
        visions: 1,
        components: ['verbal', 'somatic'],
        description: 'Spend 1 Vision to share your foresight'
      },

      duration: {
        value: 1,
        unit: 'instant',
        concentration: false
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Target ally gains advantage on their next roll',
        secondary: 'If they succeed, you gain 1 Vision back'
      },

      tags: ['seer', 'divination', 'ally-buff', 'reaction']
    },

    {
      id: 'oracle_prophecy_of_doom',
      name: 'Prophecy of Doom',
      description: 'Declare a dire prophecy about an enemy\'s fate. If your prediction comes true, they suffer the prophesied doom.',
      spellType: 'ACTION',
      icon: 'spell_shadow_curseofachimonde',
      school: 'Divination',
      level: 4,
      specialization: 'seer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 60,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false,
        allowSelf: false
      },

      resourceCost: {
        actionPoints: 2,
        visions: 3,
        mana: 4,
        components: ['verbal', 'somatic'],
        description: 'Spend 3 Visions and 4 mana to curse with prophecy'
      },

      duration: {
        value: 3,
        unit: 'rounds',
        concentration: true
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        ability: 'WIS',
        dc: 'SPELL_DC',
        onSave: 'Prophecy fails to take hold',
        onFail: 'Target is cursed with prophesied doom'
      },

      effects: {
        primary: 'Declare a specific event (e.g., "You will miss your next attack" or "You will fall below half HP")',
        secondary: 'If the prophecy comes true within 3 rounds, target takes 3d8 psychic damage and is frightened for 1 round',
        tertiary: 'If prophecy comes true, you gain 2 Visions'
      },

      tags: ['seer', 'divination', 'curse', 'prediction', 'psychic']
    },

    // ===== TRUTHSEEKER SPECIALIZATION =====
    {
      id: 'oracle_reveal_truth',
      name: 'Reveal Truth',
      description: 'Compel a creature to speak only truth, unable to lie or deceive.',
      spellType: 'ACTION',
      icon: 'spell_holy_searinglightpriest',
      school: 'Divination',
      level: 3,
      specialization: 'truthseeker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 30,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false,
        allowSelf: false
      },

      resourceCost: {
        actionPoints: 2,
        visions: 3,
        components: ['verbal', 'somatic'],
        description: 'Spend 3 Visions to force truth'
      },

      duration: {
        value: 1,
        unit: 'minute',
        concentration: true
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        ability: 'WIS',
        dc: 'SPELL_DC',
        onSave: 'Target resists the compulsion',
        onFail: 'Target must answer one question truthfully'
      },

      effects: {
        primary: 'Target must answer one question you ask with complete honesty',
        secondary: 'They cannot lie, mislead, or omit important details',
        tertiary: 'When they answer, you gain 1 Vision from the revealed truth'
      },

      tags: ['truthseeker', 'divination', 'interrogation', 'social']
    },

    {
      id: 'oracle_past_sight',
      name: 'Past Sight',
      description: 'Touch an object or location to witness its history, seeing events that transpired here.',
      spellType: 'RITUAL',
      icon: 'spell_arcane_mindvision',
      school: 'Divination',
      level: 2,
      specialization: 'truthseeker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'RITUAL',
        ritualDuration: 1,
        ritualUnit: 'minute'
      },

      targetingConfig: {
        type: 'TOUCH',
        range: 0,
        rangeUnit: 'touch',
        requiresLineOfSight: false
      },

      resourceCost: {
        actionPoints: 2,
        visions: 2,
        components: ['verbal', 'somatic'],
        description: 'Spend 2 Visions to peer into the past'
      },

      duration: {
        value: 10,
        unit: 'minutes',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Witness the complete history of the touched object or location for the past 24 hours',
        secondary: 'See all creatures who interacted with it and hear conversations within 10 feet',
        tertiary: 'Each significant revelation grants 1 Vision (GM discretion, max 3)'
      },

      tags: ['truthseeker', 'divination', 'ritual', 'investigation']
    },

    {
      id: 'oracle_piercing_gaze',
      name: 'Piercing Gaze',
      description: 'Your eyes glow with supernatural light, seeing through all deceptions and illusions.',
      spellType: 'ACTION',
      icon: 'spell_holy_holyguidance',
      school: 'Divination',
      level: 3,
      specialization: 'truthseeker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SELF',
        range: 60,
        rangeUnit: 'feet'
      },

      resourceCost: {
        actionPoints: 2,
        visions: 2,
        components: ['verbal', 'somatic'],
        description: 'Spend 2 Visions to pierce all veils'
      },

      duration: {
        value: 1,
        unit: 'minute',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'See through all illusions, disguises, and invisibility within 60 feet',
        secondary: 'Automatically detect shapechangers and see their true form',
        tertiary: 'Gain 1 Vision for each hidden creature or illusion revealed (max 3 per casting)'
      },

      tags: ['truthseeker', 'divination', 'detection', 'anti-illusion']
    },

    // ===== FATEWEAVER SPECIALIZATION =====
    {
      id: 'oracle_twist_fate',
      name: 'Twist Fate',
      description: 'Reach out and twist the threads of destiny, altering the outcome of an event.',
      spellType: 'REACTION',
      icon: 'spell_arcane_prismaticcloak',
      school: 'Divination',
      level: 2,
      specialization: 'fateweaver',

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION',
        trigger: 'A creature within 60 feet makes an attack roll, ability check, or saving throw'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 60,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: true,
        allowSelf: true
      },

      resourceCost: {
        actionPoints: 1,
        visions: 2,
        components: ['verbal', 'somatic'],
        description: 'Spend 2 Visions to twist fate'
      },

      duration: {
        value: 1,
        unit: 'instant',
        concentration: false
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Add or subtract 1d6 from the target\'s roll',
        secondary: 'You choose whether to add or subtract after seeing the initial roll',
        tertiary: 'Can turn a success into a failure or vice versa'
      },

      tags: ['fateweaver', 'divination', 'reaction', 'manipulation']
    },

    {
      id: 'oracle_sever_thread',
      name: 'Sever Thread',
      description: 'Cut the thread of fate at a critical moment, preventing or ensuring a critical outcome.',
      spellType: 'REACTION',
      icon: 'spell_shadow_soulleech_3',
      school: 'Divination',
      level: 4,
      specialization: 'fateweaver',

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION',
        trigger: 'A creature within 60 feet rolls a natural 20 or natural 1'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 60,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: true,
        allowSelf: true
      },

      resourceCost: {
        actionPoints: 2,
        visions: 3,
        components: ['verbal', 'somatic'],
        description: 'Spend 3 Visions to sever fate\'s thread'
      },

      duration: {
        value: 1,
        unit: 'instant',
        concentration: false
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Turn a natural 20 into a natural 19 (normal hit instead of critical)',
        secondary: 'OR turn a natural 1 into a natural 2 (normal miss instead of critical fail)',
        tertiary: 'OR turn a normal roll into a critical (natural 20) or critical fail (natural 1)'
      },

      tags: ['fateweaver', 'divination', 'reaction', 'critical', 'manipulation']
    },

    {
      id: 'oracle_destiny_lock',
      name: 'Destiny Lock',
      description: 'Lock a creature\'s fate, ensuring their next action results in a specific outcome.',
      spellType: 'ACTION',
      icon: 'spell_holy_powerwordbarrier',
      school: 'Divination',
      level: 5,
      specialization: 'fateweaver',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 60,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: true,
        allowSelf: true
      },

      resourceCost: {
        actionPoints: 3,
        visions: 5,
        mana: 5,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'A golden thread worth 100gp',
        description: 'Spend 5 Visions and 5 mana to lock destiny (once per long rest)'
      },

      duration: {
        value: 1,
        unit: 'round',
        concentration: false
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'The next attack roll made by or against the target automatically succeeds and is a critical hit',
        secondary: 'OR the next saving throw automatically succeeds or fails (your choice)',
        tertiary: 'This effect cannot be prevented, dispelled, or countered - fate is absolute'
      },

      specialMechanics: {
        limitation: 'Can only be used once per long rest',
        note: 'This is the ultimate fate manipulation - use wisely'
      },

      tags: ['fateweaver', 'divination', 'ultimate', 'guaranteed-outcome']
    },

    // ===== UNIVERSAL ABILITIES =====
    {
      id: 'oracle_detect_fate',
      name: 'Detect Fate',
      description: 'Sense the weight of destiny on creatures and objects, seeing who is important to the future.',
      spellType: 'ACTION',
      icon: 'spell_holy_prayerofhealing',
      school: 'Divination',
      level: 1,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'SELF',
        range: 30,
        rangeUnit: 'feet'
      },

      resourceCost: {
        actionPoints: 2,
        visions: 1,
        components: ['verbal', 'somatic'],
        description: 'Spend 1 Vision to sense destiny'
      },

      duration: {
        value: 10,
        unit: 'minutes',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'See glowing threads of fate connecting creatures and objects within 30 feet',
        secondary: 'Brighter threads indicate greater importance to future events',
        tertiary: 'Can identify "key" NPCs, important items, and critical locations'
      },

      tags: ['universal', 'divination', 'detection', 'utility']
    },

    {
      id: 'oracle_omen_reading',
      name: 'Omen Reading',
      description: 'Read the omens in your surroundings to gain insight into the immediate future.',
      spellType: 'RITUAL',
      icon: 'inv_misc_bone_skull_02',
      school: 'Divination',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 10,
        castTimeType: 'RITUAL',
        ritualDuration: 10,
        ritualUnit: 'minutes'
      },

      targetingConfig: {
        type: 'SELF',
        range: 0,
        rangeUnit: 'self'
      },

      resourceCost: {
        actionPoints: 2,
        visions: 2,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'Divination tools (bones, cards, or runes)',
        description: 'Spend 2 Visions to read the omens'
      },

      duration: {
        value: 1,
        unit: 'hour',
        concentration: false
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Gain cryptic insight into the next hour (GM provides 3 vague clues about upcoming events)',
        secondary: 'Advantage on initiative rolls for the next hour',
        tertiary: 'If you act on the omens, gain 1 Vision when the predicted event occurs'
      },

      tags: ['universal', 'divination', 'ritual', 'foresight']
    }
  ]
};

