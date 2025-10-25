export const PRIMALIST_DATA = {
  id: 'primalist',
  name: 'Primalist',
  icon: 'fas fa-mountain',
  role: 'Support/Control',
  
  // Overview section
  overview: {
    title: 'Primalist Overview',
    subtitle: 'Master of Totemic Magic and Primal Forces',

    description: `The Primalist harnesses the raw, untamed power of nature through the use of totems and earth magic. They can place and maintain powerful totems that channel primal forces, allowing them to support allies, control the battlefield, and unleash devastating effects on enemies. The Primalist's abilities are deeply rooted in their connection to the natural world, making them a versatile and strategic class that excels in both support and offense.`,

    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `The Primalist is a conduit of raw, untamed nature, channeling primal forces through sacred totems. They are shamans, earth-speakers, and keepers of ancient traditions who commune with the spirits of earth, wind, fire, and water. Primalists view the natural world as a living entity with which they maintain a sacred bond, placing totems as anchors to channel these elemental forces.

In roleplay, Primalists are often tribal leaders, spiritual guides, or wandering shamans who seek to maintain balance between civilization and the wild. They speak with reverence for the elements, perform rituals to honor nature spirits, and view their totems as sacred conduits rather than mere tools. Their connection to the earth runs deep, and they can sense disturbances in the natural order.`
    },

    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Support/Control

**Combat Style**: Strategic totem placement and battlefield control

**Strengths**:
- Versatile support through multiple totem combinations
- Area control and zone denial
- Sustained healing and buffing capabilities
- Powerful synergy effects when totems are combined
- Adaptable to different combat scenarios

**Weaknesses**:
- Totems can be destroyed by enemies
- Requires setup time to achieve maximum effectiveness
- Vulnerable while placing totems
- Limited direct damage without totem synergies
- Positioning-dependent playstyle`
    },

    playstyle: {
      title: 'Playstyle',
      content: `The Primalist excels at creating powerful zones of control through strategic totem placement. Their playstyle revolves around:

**Totem Management**: Carefully placing and maintaining up to 8 different totems, each providing unique benefits to allies or hindrances to enemies.

**Synergy Activation**: Achieving powerful combined effects by maintaining 4 active totems simultaneously, triggering devastating synergies like Healing Sanctuary or Elemental Fury.

**Battlefield Control**: Using totems to create zones that enhance allies, debuff enemies, and control the flow of combat.

**Adaptive Strategy**: Switching between offensive and defensive totem combinations based on the situation, from healing sanctuaries to elemental storms.`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Totem Circle',
      content: `**The Setup**: You're a Primalist (Earthcaller specialization) facing a group of demons (5 lesser demons + 1 demon lord). Your party is with you. Starting Totems: None. Starting Mana: 50/60. Totemic Synergy: 0. Your goal: Place totems strategically, build Totemic Synergy, then activate powerful synergy effects when you have 4 totems active.

**Starting State**: Totems: 0/8 | Totemic Synergy: 0 | Mana: 50/60 | HP: 55/55

**Turn 1 - First Totems (Totems: 0 → 2, Synergy: 0 → 2)**

*The demons charge. You kneel, pressing your hands to the earth. The spirits answer your call.*

**Your Action**: Place Healing Totem (3 mana, 1 action)
**Effect**: Totem appears, 10 ft radius, heals allies 1d6 HP per turn

*A wooden totem carved with healing runes rises from the ground, glowing with green energy.*

**Totems Active**: 1/8 (Healing Totem)
**Totemic Synergy**: 0 + 1 (totem placed) = **1**
**Mana**: 50 - 3 = 47/60

**Your Action (1 AP)**: Place Guardian Totem (3 mana)
**Effect**: Totem appears, 10 ft radius, grants allies shield absorbing 5 damage per attack

*A stone totem etched with protective symbols rises beside the healing totem, radiating defensive energy.*

**Totems Active**: 2/8 (Healing, Guardian)
**Totemic Synergy**: 1 + 1 (totem placed) = **2**
**Mana**: 47 - 3 = 44/60

**Healing Totem Effect**: All allies within 10 ft heal 1d6 → [5] = 5 HP
**Guardian Totem Effect**: All allies within 10 ft gain 5-damage shield

**Your Party's Tank**: "I feel... stronger. Protected."
**You**: "The spirits watch over us. Two totems active. I need four for synergy."

**Current State**: Totems: 2/8 | Synergy: 2 | Mana: 44/60

**Turn 2 - Building the Circle (Totems: 2 → 4, Synergy: 2 → 6)**

*The demons attack. Your tank takes a hit for 12 damage, but the Guardian shield absorbs 5, reducing it to 7. The Healing Totem pulses, healing everyone for 5 HP.*

**Start of Turn**: Each active totem generates +1 Synergy
**Totemic Synergy**: 2 + 2 (2 totems active) = **4**

**Your Action**: Place Earth Totem (3 mana)
**Effect**: Totem appears, 10 ft radius, grants +2 AC and resistance to non-magical damage

*A massive stone totem erupts from the ground, its surface covered in earth runes. The ground trembles.*

**Totems Active**: 3/8 (Healing, Guardian, Earth)
**Totemic Synergy**: 4 + 1 (totem placed) = **5**
**Mana**: 44 - 3 = 41/60

**Your Action (1 AP)**: Place Rejuvenation Totem (3 mana)
**Effect**: Totem appears, 10 ft radius, heals allies 1d4 HP at start of their turn

*A living wood totem sprouts from the earth, vines wrapping around it, pulsing with life energy.*

**Totems Active**: 4/8 (Healing, Guardian, Earth, Rejuvenation) → **SYNERGY THRESHOLD REACHED!**
**Totemic Synergy**: 5 + 1 (totem placed) = **6**
**Mana**: 41 - 3 = 38/60

*The four totems RESONATE. Their energies intertwine, creating a CIRCLE OF POWER.*

**Synergy Available**: "Healing Sanctuary" (Healing + Rejuvenation + Guardian + Earth)
**Effect**: Heals allies for +1d6 HP, reduces damage taken by 50%, lasts 2 turns

**Your Party's Mage**: "The totems... they're glowing together!"
**You**: "Four totems. The circle is complete. I can activate Healing Sanctuary now."

**Current State**: Totems: 4/8 | Synergy: 6 | Mana: 38/60

**Turn 3 - Activating Synergy (Synergy: 6 → 0)**

*The demons continue their assault. But you have four totems. Time to activate the synergy.*

**Start of Turn**: Each active totem generates +1 Synergy
**Totemic Synergy**: 6 + 4 (4 totems active) = **10**

**Your Action**: Activate "Healing Sanctuary" Synergy (costs 6 Synergy)
**Required Totems**: Healing, Rejuvenation, Guardian, Earth (all present ✓)
**Effect**: Heals allies for +1d6 HP per turn, reduces damage taken by 50%, lasts 2 turns

*You raise your staff. The four totems BLAZE with power. Their energies merge into a SANCTUARY.*

**Totemic Synergy**: 10 - 6 (synergy cost) = **4**

**Healing Sanctuary Active**: 2 turns remaining
**Effect**: All allies within totem range (10 ft) gain:
- +1d6 HP per turn (from synergy)
- +1d6 HP per turn (from Healing Totem)
- +1d4 HP per turn (from Rejuvenation Totem)
- 50% damage reduction (from synergy)
- 5-damage shield per attack (from Guardian Totem)
- +2 AC (from Earth Totem)
- Resistance to non-magical damage (from Earth Totem)

*A dome of golden-green energy surrounds your party. The totems hum with power.*

**Your Party's Tank**: Takes hit from demon → 15 damage → Reduced by 50% (synergy) = 7 damage → Shield absorbs 5 = **2 damage taken**
**Healing**: Tank heals 1d6 + 1d6 + 1d4 → [5] + [6] + [3] = **14 HP healed**

**Your Party's Healer**: "We're... we're invincible! The demons can't hurt us!"
**You**: "The Healing Sanctuary. Four totems working as one. This is the power of synergy."

**Current State**: Totems: 4/8 | Synergy: 4 | Mana: 38/60 | Healing Sanctuary: 2 turns

**Turn 4 - Maintaining the Sanctuary (Synergy: 4 → 8)**

*The demons attack furiously, but the Healing Sanctuary makes your party nearly invincible. Damage is reduced by 50%, shields absorb hits, and massive healing keeps everyone topped off.*

**Start of Turn**: Each active totem generates +1 Synergy
**Totemic Synergy**: 4 + 4 (4 totems active) = **8**

**Healing Sanctuary**: 1 turn remaining

**Demon Lord's Turn**: Attacks your tank → 25 damage → Reduced by 50% = 12 damage → Shield absorbs 5 = **7 damage taken**
**Healing**: Tank heals 1d6 + 1d6 + 1d4 → [6] + [5] + [4] = **15 HP healed**

*Your tank takes 7 damage, then heals 15 HP. Net result: +8 HP.*

**Your Party's Tank**: "I'm GAINING health while being attacked!"
**You**: "That's the power of the totems. The spirits protect us."

**Your Action**: Cast "Primal Strike" at Demon Lord (8 mana)
**Attack Roll**: d20+6 → [17] = Hit!
**Damage**: 3d8 nature → [7, 6, 8] = **21 nature damage**

**Mana**: 38 - 8 = 30/60

**Your Party's Mage**: Casts Fireball → 40 damage to 3 demons → 2 demons DEAD

**Current State**: Totems: 4/8 | Synergy: 8 | Mana: 30/60 | Healing Sanctuary: 1 turn

**Turn 5 - Sanctuary Ends, Totems Remain (Synergy: 8 → 12)**

**Start of Turn**: Each active totem generates +1 Synergy
**Totemic Synergy**: 8 + 4 (4 totems active) = **12**

**Healing Sanctuary**: Expires (2 turns elapsed)

*The golden-green dome fades. But the totems remain, still providing their individual benefits.*

**Active Totem Effects** (still active):
- Healing Totem: +1d6 HP per turn
- Rejuvenation Totem: +1d4 HP per turn
- Guardian Totem: 5-damage shield per attack
- Earth Totem: +2 AC, resistance to non-magical damage

**Your Action**: Place Flamecaller Totem (3 mana)
**Effect**: Totem appears, 10 ft radius, adds 1d6 fire damage to allies' weapon attacks

*A totem wreathed in flames rises from the ground, crackling with fire.*

**Totems Active**: 5/8 (Healing, Guardian, Earth, Rejuvenation, Flamecaller)
**Totemic Synergy**: 12 + 1 (totem placed) = **13**
**Mana**: 30 - 3 = 27/60

**Your Party's Tank**: Attacks Demon Lord (has Flamecaller bonus)
**Attack Roll**: [18] = Hit!
**Damage**: 2d8+5 → [7, 6] + 5 = 18 damage
**Flamecaller Bonus**: +1d6 fire → [5] = +5 fire damage
**Total Damage**: 18 + 5 = **23 damage!**

*The tank's sword BLAZES with fire from the Flamecaller Totem.*

**Current State**: Totems: 5/8 | Synergy: 13 | Mana: 27/60

**Turn 6 - Finishing the Fight**

*Three demons remain: Demon Lord + 2 lesser demons. Your party is fully healed and buffed.*

**Start of Turn**: Each active totem generates +1 Synergy
**Totemic Synergy**: 13 + 5 (5 totems active) = **18**

**Your Party's Rogue**: Sneak attacks Lesser Demon → +1d6 fire (Flamecaller) → DEAD
**Your Party's Mage**: Casts Lightning Bolt → Lesser Demon DEAD

**Only Demon Lord remains**

**Your Action**: Cast "Earthen Wrath" at Demon Lord (10 mana)
**Effect**: 4d10 nature damage + stun (DC 15 save)
**Damage**: 4d10 → [9, 8, 7, 10] = **34 nature damage**
**Save**: [11] → FAIL! → Stunned for 1 round

**Mana**: 27 - 10 = 17/60

**Your Party's Tank**: Attacks stunned Demon Lord (advantage, +1d6 fire)
**Attack Roll**: d20+6 with advantage → [19, 14] → Take 19 = Hit!
**Damage**: 2d8+5 + 1d6 fire → [8, 7] + 5 + [6] = **26 damage**
**Result**: Demon Lord DEAD

**Combat Over**

*You dismiss the totems. They sink back into the earth, their work done.*

**Your Party's Healer**: "We barely took any damage. That Healing Sanctuary... we were healing faster than they could hurt us."
**You**: "I placed four totems: Healing, Guardian, Earth, Rejuvenation. When all four were active, I activated Healing Sanctuary synergy. It cost 6 Totemic Synergy and lasted 2 turns. During those turns, we had +1d6 HP/turn from synergy, +1d6 from Healing Totem, +1d4 from Rejuvenation Totem, 50% damage reduction, shields, and +2 AC."
**Your Party's Tank**: "And the fire damage on my sword?"
**You**: "Flamecaller Totem. I placed it after the sanctuary ended. It added +1d6 fire damage to all weapon attacks within 10 feet."
**Your Party's Mage**: "How much Totemic Synergy did you have at the end?"
**You**: "Eighteen. Each totem placed generates +1 Synergy. Each turn a totem is active generates +1 Synergy per totem. I had 5 totems active for multiple turns, so Synergy built up quickly."

**Final State**: Totems: 0/8 (dismissed) | Synergy: 18 | Mana: 17/60 | HP: 55/55

**The Lesson**: Primalist gameplay is about:
1. **Totem Placement**: Placed 5 totems total (Healing, Guardian, Earth, Rejuvenation, Flamecaller)
2. **Synergy Building**: Each totem placed = +1 Synergy, each totem active per turn = +1 Synergy
3. **Synergy Activation**: Activated Healing Sanctuary (required 4 specific totems, cost 6 Synergy)
4. **Sanctuary Power**: 50% damage reduction + massive healing (1d6 + 1d6 + 1d4 = ~11 HP/turn)
5. **Damage Mitigation**: Tank took 15 damage → reduced to 7 → shield absorbed 5 → only 2 damage taken
6. **Totem Stacking**: Individual totem effects stack (Healing + Rejuvenation + Guardian + Earth all active simultaneously)
7. **Synergy Economy**: Started with 0, built to 18 by maintaining multiple totems over multiple turns

You're not a direct damage dealer. You're a TOTEM MASTER. You place totems that provide individual benefits, then when you have 4 totems active, you activate SYNERGIES that combine their powers into devastating effects. Healing Sanctuary made your party nearly invincible—50% damage reduction, massive healing, shields, and AC bonuses all at once. The key is strategic totem placement, building Totemic Synergy, and activating synergies at critical moments. Each totem is a spirit ally. Together, they create SANCTUARIES OF POWER.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Totemic Synergy System',
    subtitle: 'Harmonizing Primal Forces Through Sacred Totems',

    description: `Totemic Synergy measures the Primalist's ability to harmonize the effects of their totems. When totems are placed and maintained in strategic positions, they create powerful combined effects. The Primalist must carefully plan and manage their totems to maximize these synergistic outcomes.`,

    resourceBarExplanation: {
      title: 'Understanding Your Totemic Synergy Interface',
      content: `**What You See**: The Primalist's interface displays a TOTEM CIRCLE with 8 totem slots arranged in a circle, showing which totems are active and their status. In the center, a SYNERGY COUNTER shows your accumulated Totemic Synergy. When you have 4+ totems active, available synergy combinations are highlighted. The battlefield shows totem positions with glowing radius indicators.

**TOTEM CIRCLE DISPLAY** (Main Interface):

**Circle Layout**:
- **8 Totem Slots**: Arranged in a circle, one for each totem type
- **Active Totems**: Glow brightly when placed on battlefield
- **Inactive Slots**: Grayed out, showing totem type but not active
- **Center Synergy Counter**: Large number showing Totemic Synergy (0-99+)
- **Connecting Lines**: When 4+ totems active, lines connect them showing synergy potential

**Totem Slot Visualization**:

**Healing Totem (Top Position)**:
- **Icon**: Green wooden totem with healing runes
- **Inactive**: Gray outline, "Healing Totem (Not Placed)"
- **Active**: Glowing green, "Healing Totem (Active)" with pulsing aura
- **Effect Display**: "Heals 1d6 HP/turn (10 ft radius)"
- **HP Bar**: Shows totem health "10/10 HP"

**Guardian Totem (Top-Right Position)**:
- **Icon**: Stone totem with shield symbols
- **Active**: Glowing blue-gray, pulsing protective energy
- **Effect Display**: "5-damage shield per attack (10 ft radius)"

**Flamecaller Totem (Right Position)**:
- **Icon**: Flaming totem wreathed in fire
- **Active**: Glowing red-orange, flames dancing
- **Effect Display**: "+1d6 fire damage to weapon attacks (10 ft radius)"

**Storm Totem (Bottom-Right Position)**:
- **Icon**: Totem crackling with lightning
- **Active**: Glowing electric blue, sparks flying
- **Effect Display**: "+1 spell attack/save DC (10 ft radius)"

**Rejuvenation Totem (Bottom Position)**:
- **Icon**: Living wood totem with vines
- **Active**: Glowing vibrant green, vines growing
- **Effect Display**: "Heals 1d4 HP at turn start (10 ft radius)"

**Earth Totem (Bottom-Left Position)**:
- **Icon**: Massive stone totem with earth runes
- **Active**: Glowing brown-gold, ground trembling
- **Effect Display**: "+2 AC, resist non-magical damage (10 ft radius)"

**Frost Totem (Left Position)**:
- **Icon**: Ice-covered totem with frost crystals
- **Active**: Glowing icy blue, frost spreading
- **Effect Display**: "Enemies -10 ft speed (10 ft radius)"

**Wind Totem (Top-Left Position)**:
- **Icon**: Totem with swirling wind patterns
- **Active**: Glowing white-silver, wind swirling
- **Effect Display**: "Allies +10 ft speed, adv Dex saves (10 ft radius)"

**Synergy Counter (Center of Circle)**:
- **Display**: Large glowing number "18 Synergy"
- **Color Coding**:
  * 0-5 Synergy: Gray (low)
  * 6-11 Synergy: Blue (moderate, can activate synergy)
  * 12-19 Synergy: Green (high)
  * 20+ Synergy: Gold (maximum)
- **Generation Rate**: "+5/turn (5 totems active)" shown below counter

**Totem Placement Animation**:
When you place a totem:
- **Casting**: "Place Healing Totem (3 mana)" cast
- **Ground Effect**: Earth cracks, totem RISES from ground
- **Totem Appearance**: Wooden/stone totem materializes, glowing with power
- **Radius Indicator**: 10 ft circle appears on ground around totem (green for allies)
- **Slot Update**: Totem slot in circle LIGHTS UP, changes from gray to glowing
- **Synergy Gain**: "+1 Synergy (Totem Placed)" notification
- **Audio**: Deep earth rumble, totem activation sound (varies by type)
- **Text Notification**: "Healing Totem Placed (10 ft radius)"

**Active Totem Display on Battlefield**:
- **Totem Model**: 3D totem appears on battlefield at placement location
- **Radius Circle**: 10 ft glowing circle on ground (green for allies, red for enemies)
- **Effect Particles**: Healing totems have green particles, Flamecaller has fire, etc.
- **HP Bar**: Small HP bar above totem "10/10 HP"
- **Pulsing Effect**: Totem pulses each turn when effect triggers

**Synergy Generation**:

**Per Turn** (automatic):
- **Each Active Totem**: +1 Synergy per totem per turn
- **Example**: 5 totems active = +5 Synergy per turn
- **Counter Update**: "18 → 23 Synergy (+5 from 5 totems)"
- **Visual**: Synergy counter glows, number increases with animation

**Per Placement**:
- **Totem Placed**: +1 Synergy immediately
- **Visual**: Energy flows from totem to center synergy counter

**Synergy Activation Interface**:

**4 Totems Active** (Synergy Threshold):
- **Connecting Lines**: Lines appear connecting the 4 active totems in the circle
- **Synergy Buttons**: Available synergies appear as buttons below the circle
- **Example**: "Healing Sanctuary (6 Synergy)" button glows gold

**Healing Sanctuary Button**:
- **Icon**: Combined icon of Healing + Rejuvenation + Guardian + Earth totems
- **Status**: "AVAILABLE" (green) if you have all 4 required totems + 6 Synergy
- **Status**: "MISSING TOTEMS" (red) if missing required totems
- **Status**: "INSUFFICIENT SYNERGY" (orange) if have totems but not enough Synergy
- **Cost Display**: "Requires: 6 Synergy"
- **Required Totems**: Shows icons of Healing, Rejuvenation, Guardian, Earth
- **Effect Preview**: "Heals +1d6 HP/turn, 50% damage reduction, 2 turns"

**Synergy Activation Animation**:
When you activate a synergy:
- **Button Press**: Click "Healing Sanctuary" button
- **Synergy Drain**: Counter decreases "18 → 12 Synergy (-6)"
- **Totem Resonance**: All 4 required totems GLOW BRIGHTLY, pulsing in unison
- **Energy Convergence**: Energy beams shoot from totems to center, then EXPLODE outward
- **Sanctuary Formation**: Golden-green dome appears, covering all allies in totem range
- **Audio**: Powerful harmonic resonance, all 4 totem sounds blending
- **Text Notification**: "HEALING SANCTUARY ACTIVATED! (2 turns remaining)"
- **Screen Effect**: Brief golden flash, sanctuary dome visible

**Active Synergy Display**:
When synergy is active:
- **Synergy Icon**: Large icon appears on HUD "Healing Sanctuary (2 turns)"
- **Effect List**: Shows all active effects
  * "+1d6 HP/turn (Synergy)"
  * "50% Damage Reduction (Synergy)"
  * "+1d6 HP/turn (Healing Totem)"
  * "+1d4 HP/turn (Rejuvenation Totem)"
  * "5-damage shield (Guardian Totem)"
  * "+2 AC (Earth Totem)"
- **Duration Countdown**: "2 turns → 1 turn → Expired"
- **Visual**: Dome pulses, allies inside have golden-green aura

**Totem Damage/Destruction**:
When enemy attacks a totem:
- **Attack Animation**: Enemy strikes totem
- **Damage Number**: "-5 HP" appears above totem
- **HP Bar Update**: "10/10 → 5/10 HP"
- **Warning**: "⚠️ Healing Totem taking damage!"
- **Destruction**: If HP reaches 0, totem SHATTERS, slot goes gray
- **Synergy Loss**: If synergy was active and required that totem, synergy BREAKS
- **Text Notification**: "Healing Totem DESTROYED! Healing Sanctuary disrupted!"

**Totem Repositioning**:
When you reposition a totem (1 action point):
- **Selection**: Click totem on battlefield
- **Movement**: Drag totem to new location
- **Radius Preview**: New 10 ft radius shown before confirming
- **Confirmation**: Click to place, totem SINKS into ground at old location, RISES at new location
- **Audio**: Earth rumble, totem movement sound
- **Text**: "Healing Totem repositioned"

**Multiple Totem Stacking**:
When you have multiple totems active:
- **Buff Icons**: All totem effects shown as buff icons on allies
  * Green cross (Healing)
  * Blue shield (Guardian)
  * Red flame (Flamecaller)
  * Brown stone (Earth)
  * Green leaf (Rejuvenation)
- **Stacking Display**: "5 Totem Buffs Active"
- **Combined Effects**: All effects apply simultaneously

**Synergy Combinations Display**:
Shows all possible synergies:
- **Healing Sanctuary**: Healing, Rejuvenation, Guardian, Earth (defensive)
- **Elemental Fury**: Flamecaller, Storm, Frost, Wind (offensive)
- **Protective Bastion**: Guardian, Earth, Frost, Wind (tank)
- **Storm of Wrath**: Flamecaller, Storm, Frost, Healing (hybrid)
- **Vital Grove**: Healing, Rejuvenation, Guardian, Wind (mobility + healing)

**Why This Matters**: The Totem Circle interface makes you FEEL like a shaman commanding spirits. When you place a totem and it RISES from the ground with a deep rumble, the slot in your circle LIGHTS UP, and "+1 Synergy" appears—you're building power. When you have 4 totems active and the connecting lines appear between them, showing "Healing Sanctuary AVAILABLE", you KNOW you can unleash it. When you activate the synergy and all 4 totems GLOW in unison, energy beams converge, and a golden-green DOME surrounds your party—you're witnessing the spirits working together. The battlefield view shows each totem with its glowing radius, so you can see exactly who's in range. When your tank takes 15 damage but it's reduced to 2 by the sanctuary, then heals 14 HP from multiple totems, you SEE the power of synergy. The synergy counter building from 0 to 18 over multiple turns shows your growing power. You're not just casting spells—you're CONDUCTING A SYMPHONY OF SPIRITS.`
    },

    mechanics: {
      title: 'Core Mechanics',
      content: `**Totem Placement**: The Primalist can place up to 8 different types of totems on the battlefield. Each totem has a 10-foot radius of effect unless otherwise specified.

**Totemic Synergy Generation**: Each totem placed generates 1 point of Totemic Synergy. Each turn a totem remains active generates 1 additional point of Totemic Synergy.

**Synergy Activation**: When the Primalist maintains 4 active totems simultaneously, they can trigger powerful synergistic effects based on the combination of totems in play.

**Totem Vulnerability**: Enemies can target and destroy totems (each totem has 10 HP and 12 AC). Destroyed totems disrupt synergy and must be replaced.

**Totem Duration**: Totems remain active until destroyed or dismissed by the Primalist. The Primalist can reposition totems for 1 action point.`
    },
    
    totemTypesTable: {
      title: 'Eight Sacred Totems',
      headers: ['Totem', 'Effect', 'Radius', 'Mana Cost'],
      rows: [
        ['Healing Totem', 'Heals allies for 1d6 HP each turn', '10 ft', '3'],
        ['Guardian Totem', 'Grants allies shield absorbing 5 damage per attack', '10 ft', '3'],
        ['Flamecaller Totem', 'Adds 1d6 fire damage to allies\' weapon attacks', '10 ft', '3'],
        ['Storm Totem', 'Grants +1 to spell attack rolls and spell save DCs', '10 ft', '3'],
        ['Rejuvenation Totem', 'Heals allies for 1d4 HP at start of their turn', '10 ft', '3'],
        ['Earth Totem', 'Grants +2 AC and resistance to non-magical damage', '10 ft', '3'],
        ['Frost Totem', 'Reduces enemy movement speed by 10 ft', '10 ft', '3'],
        ['Wind Totem', 'Increases ally movement speed by 10 ft, advantage on Dex saves', '10 ft', '3']
      ]
    },
    
    synergyEffectsTable: {
      title: 'Totemic Synergy Combinations (4 Totems Required)',
      headers: ['Synergy Name', 'Required Totems', 'Effect', 'Duration'],
      rows: [
        ['Healing Sanctuary', 'Healing, Rejuvenation, Guardian, Earth', 'Heals allies for +1d6 HP, reduces damage taken by 50%', '2 turns'],
        ['Elemental Fury', 'Flamecaller, Storm, Frost, Wind', 'Enhances attacks with fire/lightning/frost damage, increases attack/movement speed', '3 turns'],
        ['Protective Bastion', 'Guardian, Earth, Frost, Wind', 'Grants resistance to all damage types, +10 ft movement speed', '3 turns'],
        ['Storm of Wrath', 'Flamecaller, Storm, Frost, Healing', 'Enhances attacks with elemental damage, heals for portion of damage dealt', '3 turns'],
        ['Vital Grove', 'Healing, Rejuvenation, Guardian, Wind', 'Rapid health regeneration, increased movement speed and defense', '3 turns']
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Totem Positioning**: Place totems in protected locations where they can affect the maximum number of allies while being difficult for enemies to reach.

**Synergy Planning**: Plan your totem combinations in advance based on the encounter. Healing Sanctuary for tough fights, Elemental Fury for offense.

**Totem Defense**: Use Guardian and Earth totems to create defensive zones that protect your other totems from being destroyed.

**Adaptive Placement**: Be ready to reposition totems as the battlefield shifts. Use 1 action point to move totems to maintain optimal coverage.

**Resource Management**: Each totem costs 3 mana. Plan your placements carefully to avoid running out of mana before achieving synergy.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `The Primalist's Totemic Synergy system—placing up to 8 totems and tracking synergy points—creates a strategic, visual in-person experience. Here's how to track your totems and synergy at the table:

**Required Materials**:
- **8 totem tokens or miniatures** (one for each totem type, different colors recommended)
- **Synergy tracker** (d100 die, tokens, or paper)
- **Totem reference card** with totem effects and synergy combinations
- **Battle map** for totem placement

**Totem Placement Tracking**:

**The Physical Totem Method** (Recommended):

Use physical tokens or miniatures to represent your totems on the battle map:
- **8 Totem Types**: Each totem has a unique token/mini
  - **Healing Totem** (Green): Heals 1d6 HP/turn (10 ft radius)
  - **Guardian Totem** (Blue): 5-damage shield per attack (10 ft radius)
  - **Flamecaller Totem** (Red): +1d6 fire damage to weapons (10 ft radius)
  - **Storm Totem** (Electric Blue): +1 spell attack/save DC (10 ft radius)
  - **Rejuvenation Totem** (Light Green): Heals 1d4 HP at turn start (10 ft radius)
  - **Earth Totem** (Brown): +2 AC, resist non-magical damage (10 ft radius)
  - **Frost Totem** (Icy Blue): Enemies -10 ft speed (10 ft radius)
  - **Wind Totem** (White): Allies +10 ft speed, adv Dex saves (10 ft radius)

**Setup**:
- **Totem Bank**: Keep unused totem tokens in front of you
- **Battle Map**: Place active totems on the map at their locations
- **Radius Markers**: Use 10 ft radius templates to show totem effect areas

**Placing Totems**:
1. Announce: "I place a Healing Totem here!" (point to location on map)
2. Place the green totem token at that location
3. Mark 10 ft radius around it (use template or measure)
4. Add +1 to Totemic Synergy counter
5. Note totem HP (10 HP each, can be destroyed)

**Totemic Synergy Tracking**:

**The d100 Method** (Recommended):

Use a d100 (percentile die) to track Totemic Synergy:
- **Starting State**: Set to 0
- **Generating Synergy**:
  - Place totem → +1 Synergy (adjust die)
  - Each active totem at start of turn → +1 Synergy per totem (adjust die)
  - Example: 5 totems active → +5 Synergy per turn
- **Spending Synergy**:
  - Activate synergy combination → Subtract cost (adjust die)
  - Example: Healing Sanctuary (costs 12 Synergy) → Subtract 12

**Alternative Tracking Methods**:
- **Token Method**: Use tokens/beads to represent Synergy points (add/remove as needed)
- **Paper Method**: Write Synergy count on paper, update as needed
- **Tally Method**: Use hash marks to track Synergy

**Synergy Combinations Reference Card**:
\`\`\`
TOTEMIC SYNERGY COMBINATIONS
(Requires 4+ active totems)

HEALING SANCTUARY (12 Synergy)
Totems: Healing + Guardian + Rejuvenation + Earth
Effect: 50% damage reduction, +3 AC, heal 3d6/turn
Duration: 3 turns

ELEMENTAL FURY (15 Synergy)
Totems: Flamecaller + Storm + Frost + Wind
Effect: 2d6 damage per element (8d6 total) to all enemies
Duration: Instant

NATURE'S WRATH (18 Synergy)
Totems: Earth + Wind + Storm + Flamecaller
Effect: Earthquake + tornado, 4d8 damage, knock prone
Duration: 2 turns

SPIRIT SHIELD (10 Synergy)
Totems: Guardian + Earth + Wind + Healing
Effect: Allies immune to crits, +5 AC, +20 temp HP
Duration: 3 turns

PRIMAL STORM (20 Synergy)
Totems: All 8 totems active
Effect: Massive elemental storm, 6d10 damage, heal 4d8
Duration: 3 turns
\`\`\`

**Example In-Person Turn**:

*You have 2 totems active (Healing, Guardian), 4 Totemic Synergy*

**Turn 1 - Building the Circle**:
1. "I place an Earth Totem near our tank!"
2. Place brown totem token on map near tank mini
3. Mark 10 ft radius around it
4. Add +1 Synergy: 4 + 1 = 5 Synergy (adjust d100 to 5)
5. Start of turn: 3 totems active → +3 Synergy: 5 + 3 = 8 Synergy

**Turn 2 - Fourth Totem (Synergy Unlocked!)**:
1. "I place a Rejuvenation Totem in the center!"
2. Place light green totem token in center of party
3. Mark 10 ft radius
4. Add +1 Synergy: 8 + 1 = 9 Synergy
5. Start of turn: 4 totems active → +4 Synergy: 9 + 4 = 13 Synergy
6. **SYNERGY AVAILABLE**: "I have 4 totems active! I can activate Healing Sanctuary!"

**Turn 3 - Activate Synergy**:
1. "I activate Healing Sanctuary!" (costs 12 Synergy)
2. Subtract Synergy: 13 - 12 = 1 Synergy (adjust d100 to 1)
3. Effect: All allies within totem range gain:
   - 50% damage reduction
   - +3 AC
   - Heal 3d6 HP per turn
   - Duration: 3 turns
4. Roll healing: 3d6 → [5, 6, 4] = 15 HP healed to all allies!

**Totem Destruction Tracking**:

When enemies attack your totems:
- **Totem HP**: Each totem has 10 HP
- **Totem AC**: 12 (can be hit by enemies)
- **Destroyed**: Remove totem token from map, lose its effects
- **Synergy Impact**: Lose passive Synergy generation from that totem

**Example**:
- Enemy attacks Healing Totem → Hits! → 8 damage → Totem at 2/10 HP
- Next attack → 5 damage → Totem destroyed! → Remove green token from map
- Synergy generation: Was +4/turn (4 totems), now +3/turn (3 totems)

**Quick Reference Card Template**:
\`\`\`
PRIMALIST QUICK REFERENCE

TOTEM PLACEMENT:
• Cost: 3 mana per totem
• HP: 10 HP each (AC 12)
• Radius: 10 ft (15 ft for Spiritcaller)
• Max Active: 8 totems

TOTEMIC SYNERGY:
• Place totem: +1 Synergy
• Each active totem (start of turn): +1 Synergy
• Synergy combinations require 4+ totems
• Stormbringer: Only needs 3 totems for synergy

TOTEM TYPES:
🟢 Healing: 1d6 HP/turn
🔵 Guardian: 5-damage shield
🔴 Flamecaller: +1d6 fire damage
⚡ Storm: +1 spell attack/DC
🌿 Rejuvenation: 1d4 HP at turn start
🟤 Earth: +2 AC, resist damage
❄️ Frost: Enemies -10 ft speed
💨 Wind: Allies +10 ft speed, adv Dex
\`\`\`

**Thematic Enhancements**:

Many players enhance the totem experience with:
- **Custom Totem Minis**: Use small totem miniatures or tokens
- **Colored Tokens**: Use different colored tokens for each totem type
- **Radius Templates**: Use 10 ft radius templates to show effect areas
- **Totem Cards**: Print cards with totem effects for quick reference
- **Synergy Tracker Mat**: Print a mat with synergy combinations listed

**Visual Organization**:

**Totem Circle Layout** (on table):
\`\`\`
YOUR PLAY AREA:

[Totem Bank]     [Synergy Tracker]
🟢🔵🔴⚡🌿🟤❄️💨    d100: [18]

BATTLE MAP:
[Place active totems on map with radius markers]
\`\`\`

**Battlefield Tracking**:
- **Active Totems**: On battle map at their locations
- **Radius Markers**: Show 10 ft effect areas
- **Totem HP**: Track on paper or with dice next to each totem
- **Synergy Counter**: d100 or tokens showing current Synergy

**Example Full Combat Sequence**:

*Starting: 0 totems, 0 Synergy*

**Turn 1**: Place Healing Totem → 1 totem, 1 Synergy
**Turn 2**: Place Guardian Totem → 2 totems, 1 + 1 (placed) + 2 (active) = 4 Synergy
**Turn 3**: Place Earth Totem → 3 totems, 4 + 1 (placed) + 3 (active) = 8 Synergy
**Turn 4**: Place Rejuvenation Totem → 4 totems, 8 + 1 (placed) + 4 (active) = 13 Synergy
**Turn 5**: Activate Healing Sanctuary (12 Synergy) → 4 totems, 1 Synergy remaining
**Turn 6**: Build Synergy → 1 + 4 (active) = 5 Synergy
**Turn 7**: Place Flamecaller Totem → 5 totems, 5 + 1 (placed) + 5 (active) = 11 Synergy

**Specialization-Specific Tracking**:

**Earthwarden**:
- Totems have +5 HP (15 HP instead of 10)
- Totems regenerate 5 HP per turn (track HP carefully)
- Healing Sanctuary lasts 4 turns instead of 3

**Stormbringer**:
- Only need 3 totems for synergy (not 4)
- Elemental totems deal +1d6 damage (note on totem cards)
- Elemental Fury deals 3d6 per element (12d6 total instead of 8d6)

**Spiritcaller**:
- Totems have 15 ft radius instead of 10 ft (use larger templates)
- Can move totems for 0 action points (reposition freely)
- Enemies in totem range have disadvantage on saves

**Why This System Works**: The physical act of placing totem tokens on the battle map, marking their effect radii, and watching your Synergy counter climb creates a STRATEGIC PUZZLE. You're not just casting spells—you're building a network of sacred totems that combine into powerful synergies. The visual representation of totems on the map makes positioning decisions tangible, and the Synergy counter shows how close you are to activating devastating combinations. The moment you place your 4th totem and announce "Synergy available!" is incredibly satisfying.

**Pro Tips**:
- **Plan Ahead**: Decide which synergy you want BEFORE placing totems
- **Positioning**: Place totems to cover maximum allies while staying safe from enemies
- **Totem Defense**: Position totems behind cover or near tanks to protect them
- **Synergy Timing**: Activate synergies at critical moments (boss phases, party in danger)
- **Totem Diversity**: Don't place all offensive or all defensive totems—balance is key

**Budget-Friendly Alternatives**:
- **No totem minis?** Use coins, buttons, or colored tokens
- **No radius templates?** Use measuring tape or estimate
- **No d100?** Use tokens or paper to track Synergy
- **Minimalist**: Just track totem locations and Synergy count on paper

**Why Primalist Is Perfect for In-Person Play**: The class is built around physical placement of totems on a battle map, creating a visual, strategic experience. Placing totem tokens, marking their effect radii, and watching your Synergy counter climb makes the abstract concept of "totemic magic" tangible and engaging. The moment you activate a synergy combination—removing 12+ Synergy from your counter and announcing a massive effect—creates a dramatic, memorable moment. The physical components (totem tokens, radius markers, Synergy tracker) make every combat feel like building a sacred circle of power.`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Primalist Specializations',
    subtitle: 'Three Paths of Totemic Mastery',
    
    description: `Primalists can specialize in different aspects of totemic magic, each offering unique approaches to totem synergy and battlefield control. These specializations focus on healing (Earthwarden), elemental damage (Stormbringer), or tactical control (Spiritcaller).`,
    
    passiveAbility: {
      name: 'Totemic Mastery',
      description: 'All Primalists can place and maintain up to 8 different totems and trigger synergy effects when 4 totems are active. Totems have 10 HP, 12 AC, and a 10-foot radius.'
    },
    
    specs: [
      {
        id: 'earthwarden',
        name: 'Earthwarden',
        icon: 'spell_nature_stoneclawtotem',
        color: '#8B4513',
        theme: 'Healing & Protection',
        
        description: `Earthwardens focus on defensive totems and healing synergies, creating sanctuaries of protection for their allies. They excel at sustaining parties through prolonged encounters and providing powerful defensive buffs.`,
        
        playstyle: 'Defensive support, sustained healing, damage mitigation',
        
        strengths: [
          'Enhanced healing totem effects (+50% healing)',
          'Totems have +5 HP and +2 AC',
          'Can place 5th totem for enhanced synergies',
          'Healing Sanctuary synergy heals for 2d6 instead of 1d6'
        ],
        
        weaknesses: [
          'Lower offensive capabilities',
          'Requires allies to stay within totem range',
          'Vulnerable to area damage that destroys multiple totems'
        ],
        
        specPassive: {
          name: 'Earth\'s Embrace',
          description: 'Your healing totems (Healing, Rejuvenation) heal for 50% more. Your defensive totems (Guardian, Earth) grant +1 additional AC. You can place a 5th totem to create enhanced synergies.'
        },
        
        keyAbilities: [
          'Sanctuary Aura - Healing Sanctuary lasts 1 additional turn',
          'Earthen Resilience - Totems regenerate 5 HP per turn',
          'Sacred Ground - Allies standing near totems gain +1 AC'
        ]
      },
      {
        id: 'stormbringer',
        name: 'Stormbringer',
        icon: 'spell_nature_callstorm',
        color: '#4169E1',
        theme: 'Elemental Damage & Offense',
        
        description: `Stormbringers channel the fury of the elements through their totems, creating devastating storms of fire, frost, and lightning. They excel at dealing area damage and enhancing allies' offensive capabilities.`,
        
        playstyle: 'Offensive support, elemental damage, attack enhancement',
        
        strengths: [
          'Elemental totems deal +1d6 additional damage',
          'Elemental Fury synergy deals 3d6 damage per element',
          'Can trigger synergies with only 3 totems',
          'Storm of Wrath heals for 100% of damage dealt'
        ],
        
        weaknesses: [
          'Lower defensive capabilities',
          'Totems are more vulnerable (normal HP/AC)',
          'Requires aggressive positioning'
        ],
        
        specPassive: {
          name: 'Elemental Wrath',
          description: 'Your elemental totems (Flamecaller, Storm, Frost, Wind) deal +1d6 damage. You can trigger synergy effects with only 3 active totems instead of 4. Elemental Fury deals 3d6 per element instead of 2d6.'
        },
        
        keyAbilities: [
          'Lightning Strike - Storm Totem can strike enemies for 2d6 lightning damage',
          'Inferno - Flamecaller Totem creates burning ground (1d6 fire/turn)',
          'Blizzard - Frost Totem creates freezing zone (DC 15 Con save or frozen)'
        ]
      },
      {
        id: 'spiritcaller',
        name: 'Spiritcaller',
        icon: 'spell_nature_invisibilitytotem',
        color: '#9370DB',
        theme: 'Crowd Control & Utility',
        
        description: `Spiritcallers commune with nature spirits to enhance their totems with crowd control and utility effects. They excel at battlefield manipulation, enemy debuffs, and providing unique tactical advantages.`,
        
        playstyle: 'Tactical control, crowd control, utility support',
        
        strengths: [
          'Totems apply additional debuffs to enemies',
          'Can move totems for 0 action points',
          'Totems have 15-foot radius instead of 10-foot',
          'Unique spirit-based synergy combinations'
        ],
        
        weaknesses: [
          'Lower direct healing and damage',
          'Requires careful positioning and timing',
          'Synergies focus on control rather than raw power'
        ],
        
        specPassive: {
          name: 'Spirit Bond',
          description: 'Your totems have a 15-foot radius instead of 10-foot. You can reposition totems for 0 action points. Enemies within totem range have disadvantage on saving throws against your spells.'
        },
        
        keyAbilities: [
          'Spirit Walk - Teleport to any active totem location',
          'Ancestral Guidance - Totems reveal invisible enemies',
          'Totemic Projection - Project totem effects to distant location'
        ]
      }
    ]
  },
  
  // Example Spells
  exampleSpells: [
    // HEALING TOTEMS
    {
      id: 'prim_healing_totem',
      name: 'Healing Totem',
      description: 'Place a sacred totem that channels healing energy to all allies within range, restoring health each turn.',
      spellType: 'ACTION',
      icon: 'spell_nature_healingwavegreater',
      school: 'Nature',
      level: 2,
      specialization: 'healing-totems',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: 'Until destroyed or dismissed',
        concentration: false
      },

      targetingConfig: {
        range: '30 feet (placement)',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet',
          description: 'All allies within 10 feet of the totem'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 3
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'HEALING',
            amount: '1d6',
            timing: 'START_OF_TURN',
            description: 'Heals all allies within range for 1d6 HP at the start of each turn'
          },
          {
            type: 'SUMMON',
            creature: 'Healing Totem',
            hp: 10,
            ac: 12,
            duration: 'Until destroyed'
          }
        ]
      },

      specialMechanics: {
        totemProperties: {
          hp: 10,
          ac: 12,
          radius: '10 feet',
          synergyGeneration: '1 point per turn active'
        },
        earthwardenBonus: {
          description: 'Earthwarden specialization: Heals for 1d6 + 3 (50% bonus)',
          bonus: '+3 healing'
        }
      },

      tags: ['healing-totems', 'totem', 'healing', 'support', 'earthwarden', 'all-specs']
    },

    {
      id: 'prim_rejuvenation_totem',
      name: 'Rejuvenation Totem',
      description: 'Place a totem that grants regeneration to all allies within range, healing them at the start of their turns.',
      spellType: 'ACTION',
      icon: 'spell_nature_rejuvenation',
      school: 'Nature',
      level: 2,
      specialization: 'healing-totems',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: 'Until destroyed or dismissed',
        concentration: false
      },

      targetingConfig: {
        range: '30 feet (placement)',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet',
          description: 'All allies within 10 feet of the totem'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 3
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'HEALING',
            amount: '1d4',
            timing: 'START_OF_TURN',
            description: 'Heals all allies for 1d4 HP at the start of their turn'
          },
          {
            type: 'SUMMON',
            creature: 'Rejuvenation Totem',
            hp: 10,
            ac: 12,
            duration: 'Until destroyed'
          }
        ]
      },

      specialMechanics: {
        totemProperties: {
          hp: 10,
          ac: 12,
          radius: '10 feet',
          synergyGeneration: '1 point per turn active'
        },
        regeneration: {
          description: 'Grants regeneration buff to allies',
          duration: 'While within totem range'
        }
      },

      tags: ['healing-totems', 'totem', 'healing', 'regeneration', 'earthwarden', 'all-specs']
    },

    // DEFENSIVE TOTEMS
    {
      id: 'prim_guardian_totem',
      name: 'Guardian Totem',
      description: 'Place a protective totem that shields all allies within range, absorbing incoming damage.',
      spellType: 'ACTION',
      icon: 'spell_nature_stoneskintotem',
      school: 'Nature',
      level: 3,
      specialization: 'defensive-totems',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: 'Until destroyed or dismissed',
        concentration: false
      },

      targetingConfig: {
        range: '30 feet (placement)',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet',
          description: 'All allies within 10 feet of the totem'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 3
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'BUFF',
            stat: 'DAMAGE_ABSORPTION',
            amount: 5,
            description: 'Absorbs 5 damage per attack'
          },
          {
            type: 'SUMMON',
            creature: 'Guardian Totem',
            hp: 10,
            ac: 12,
            duration: 'Until destroyed'
          }
        ]
      },

      specialMechanics: {
        totemProperties: {
          hp: 10,
          ac: 12,
          radius: '10 feet',
          synergyGeneration: '1 point per turn active'
        },
        earthwardenBonus: {
          description: 'Earthwarden specialization: Grants +1 additional AC',
          bonus: '+1 AC'
        }
      },

      tags: ['defensive-totems', 'totem', 'defense', 'shield', 'earthwarden', 'all-specs']
    },

    {
      id: 'prim_earth_totem',
      name: 'Earth Totem',
      description: 'Place a totem of solid earth that increases allies\' armor and grants resistance to physical damage.',
      spellType: 'ACTION',
      icon: 'spell_nature_strengthofearthtotem02',
      school: 'Earth',
      level: 3,
      specialization: 'defensive-totems',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: 'Until destroyed or dismissed',
        concentration: false
      },

      targetingConfig: {
        range: '30 feet (placement)',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet',
          description: 'All allies within 10 feet of the totem'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 3
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'BUFF',
            stat: 'AC',
            amount: 2,
            description: 'Increases AC by 2'
          },
          {
            type: 'BUFF',
            stat: 'RESISTANCE',
            damageType: 'NON_MAGICAL',
            description: 'Grants resistance to non-magical damage'
          },
          {
            type: 'SUMMON',
            creature: 'Earth Totem',
            hp: 10,
            ac: 12,
            duration: 'Until destroyed'
          }
        ]
      },

      specialMechanics: {
        totemProperties: {
          hp: 10,
          ac: 12,
          radius: '10 feet',
          synergyGeneration: '1 point per turn active'
        },
        earthwardenBonus: {
          description: 'Earthwarden specialization: Grants +1 additional AC (total +3)',
          bonus: '+1 AC'
        }
      },

      tags: ['defensive-totems', 'totem', 'defense', 'resistance', 'earthwarden', 'all-specs']
    },

    // ELEMENTAL TOTEMS
    {
      id: 'prim_flamecaller_totem',
      name: 'Flamecaller Totem',
      description: 'Place a totem wreathed in flames that enhances allies\' weapons with fire damage.',
      spellType: 'ACTION',
      icon: 'spell_fire_sealoffire',
      school: 'Fire',
      level: 3,
      specialization: 'elemental-totems',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: 'Until destroyed or dismissed',
        concentration: false
      },

      targetingConfig: {
        range: '30 feet (placement)',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet',
          description: 'All allies within 10 feet of the totem'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 3
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'BUFF',
            stat: 'WEAPON_DAMAGE',
            damageType: 'FIRE',
            amount: '1d6',
            description: 'Adds 1d6 fire damage to weapon attacks'
          },
          {
            type: 'SUMMON',
            creature: 'Flamecaller Totem',
            hp: 10,
            ac: 12,
            duration: 'Until destroyed'
          }
        ]
      },

      specialMechanics: {
        totemProperties: {
          hp: 10,
          ac: 12,
          radius: '10 feet',
          synergyGeneration: '1 point per turn active'
        },
        stormbringerBonus: {
          description: 'Stormbringer specialization: Adds 2d6 fire damage instead of 1d6',
          bonus: '+1d6 fire damage'
        },
        burningGround: {
          description: 'Stormbringer specialization: Creates burning ground dealing 1d6 fire damage per turn',
          requirement: 'Stormbringer only'
        }
      },

      tags: ['elemental-totems', 'totem', 'fire', 'damage', 'stormbringer', 'all-specs']
    },

    {
      id: 'prim_storm_totem',
      name: 'Storm Totem',
      description: 'Place a crackling totem that enhances allies\' spellcasting with storm energy.',
      spellType: 'ACTION',
      icon: 'spell_nature_stormreach',
      school: 'Lightning',
      level: 3,
      specialization: 'elemental-totems',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: 'Until destroyed or dismissed',
        concentration: false
      },

      targetingConfig: {
        range: '30 feet (placement)',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet',
          description: 'All allies within 10 feet of the totem'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 3
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'BUFF',
            stat: 'SPELL_ATTACK',
            amount: 1,
            description: 'Grants +1 to spell attack rolls'
          },
          {
            type: 'BUFF',
            stat: 'SPELL_DC',
            amount: 1,
            description: 'Grants +1 to spell save DCs'
          },
          {
            type: 'SUMMON',
            creature: 'Storm Totem',
            hp: 10,
            ac: 12,
            duration: 'Until destroyed'
          }
        ]
      },

      specialMechanics: {
        totemProperties: {
          hp: 10,
          ac: 12,
          radius: '10 feet',
          synergyGeneration: '1 point per turn active'
        },
        stormbringerBonus: {
          description: 'Stormbringer specialization: Can strike enemies for 2d6 lightning damage for 1 action point',
          bonus: 'Lightning Strike ability'
        }
      },

      tags: ['elemental-totems', 'totem', 'lightning', 'buff', 'stormbringer', 'all-specs']
    },

    {
      id: 'prim_frost_totem',
      name: 'Frost Totem',
      description: 'Place a freezing totem that slows enemies and reduces their attack speed.',
      spellType: 'ACTION',
      icon: 'spell_frost_frostshock',
      school: 'Frost',
      level: 3,
      specialization: 'elemental-totems',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: 'Until destroyed or dismissed',
        concentration: false
      },

      targetingConfig: {
        range: '30 feet (placement)',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet',
          description: 'All enemies within 10 feet of the totem'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 3
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'DEBUFF',
            stat: 'MOVEMENT_SPEED',
            amount: -10,
            description: 'Reduces enemy movement speed by 10 feet'
          },
          {
            type: 'DEBUFF',
            stat: 'ATTACK_SPEED',
            description: 'Reduces enemy attack speed'
          },
          {
            type: 'SUMMON',
            creature: 'Frost Totem',
            hp: 10,
            ac: 12,
            duration: 'Until destroyed'
          }
        ]
      },

      specialMechanics: {
        totemProperties: {
          hp: 10,
          ac: 12,
          radius: '10 feet',
          synergyGeneration: '1 point per turn active'
        },
        stormbringerBonus: {
          description: 'Stormbringer specialization: Creates freezing zone (DC 15 Con save or frozen)',
          bonus: 'Blizzard effect'
        }
      },

      tags: ['elemental-totems', 'totem', 'frost', 'debuff', 'slow', 'stormbringer', 'all-specs']
    },

    {
      id: 'prim_wind_totem',
      name: 'Wind Totem',
      description: 'Place a totem that channels swift winds, increasing allies\' movement and reflexes.',
      spellType: 'ACTION',
      icon: 'spell_nature_windfury',
      school: 'Air',
      level: 2,
      specialization: 'elemental-totems',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: 'Until destroyed or dismissed',
        concentration: false
      },

      targetingConfig: {
        range: '30 feet (placement)',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet',
          description: 'All allies within 10 feet of the totem'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 3
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'BUFF',
            stat: 'MOVEMENT_SPEED',
            amount: 10,
            description: 'Increases movement speed by 10 feet'
          },
          {
            type: 'BUFF',
            stat: 'SAVING_THROW',
            saveType: 'DEXTERITY',
            description: 'Grants advantage on Dexterity saving throws'
          },
          {
            type: 'SUMMON',
            creature: 'Wind Totem',
            hp: 10,
            ac: 12,
            duration: 'Until destroyed'
          }
        ]
      },

      specialMechanics: {
        totemProperties: {
          hp: 10,
          ac: 12,
          radius: '10 feet',
          synergyGeneration: '1 point per turn active'
        },
        spiritcallerBonus: {
          description: 'Spiritcaller specialization: 15-foot radius instead of 10-foot',
          bonus: '+5 feet radius'
        }
      },

      tags: ['elemental-totems', 'totem', 'air', 'buff', 'mobility', 'all-specs']
    },

    // SYNERGY EFFECTS
    {
      id: 'prim_healing_sanctuary',
      name: 'Healing Sanctuary',
      description: 'Activate a powerful synergy when Healing, Rejuvenation, Guardian, and Earth totems are active, creating a sanctuary of protection and healing.',
      spellType: 'REACTION',
      icon: 'spell_holy_prayerofhealing',
      school: 'Nature',
      level: 5,
      specialization: 'synergy-effects',

      typeConfig: {
        actionType: 'SPELL',
        castTime: 'Reaction (when 4 totems active)',
        duration: '2 turns',
        concentration: false
      },

      targetingConfig: {
        range: 'Self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 20,
          unit: 'feet',
          description: 'All allies within 20 feet'
        },
        validTargets: ['ALLIES']
      },

      resourceCost: {
        totemicSynergy: 4,
        description: 'Requires 4 active totems: Healing, Rejuvenation, Guardian, Earth'
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'HEALING',
            amount: '2d8',
            description: 'Heals all allies for 2d8 HP'
          },
          {
            type: 'BUFF',
            stat: 'DAMAGE_REDUCTION',
            amount: 50,
            unit: 'PERCENT',
            duration: '2 turns',
            description: 'Reduces damage taken by 50%'
          }
        ]
      },

      specialMechanics: {
        synergyRequirement: {
          totems: ['Healing Totem', 'Rejuvenation Totem', 'Guardian Totem', 'Earth Totem'],
          description: 'All 4 totems must be active to trigger this synergy'
        },
        earthwardenBonus: {
          description: 'Earthwarden specialization: Heals for 2d6 additional HP, lasts 3 turns instead of 2',
          bonus: '+2d6 healing, +1 turn duration'
        }
      },

      tags: ['synergy-effects', 'healing', 'defense', 'ultimate', 'earthwarden']
    },

    {
      id: 'prim_elemental_fury',
      name: 'Elemental Fury',
      description: 'Unleash a devastating elemental storm when Flamecaller, Storm, Frost, and Wind totems are active, enhancing allies with fire, lightning, and frost.',
      spellType: 'REACTION',
      icon: 'spell_nature_wispheal',
      school: 'Elemental',
      level: 6,
      specialization: 'synergy-effects',

      typeConfig: {
        actionType: 'SPELL',
        castTime: 'Reaction (when 4 totems active)',
        duration: '3 turns',
        concentration: false
      },

      targetingConfig: {
        range: 'Self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 30,
          unit: 'feet',
          description: 'All allies within 30 feet'
        },
        validTargets: ['ALLIES']
      },

      resourceCost: {
        totemicSynergy: 4,
        description: 'Requires 4 active totems: Flamecaller, Storm, Frost, Wind'
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'BUFF',
            stat: 'WEAPON_DAMAGE',
            damageType: 'FIRE',
            amount: '2d6',
            description: 'Adds 2d6 fire damage to attacks'
          },
          {
            type: 'BUFF',
            stat: 'WEAPON_DAMAGE',
            damageType: 'LIGHTNING',
            amount: '2d6',
            description: 'Adds 2d6 lightning damage to attacks'
          },
          {
            type: 'BUFF',
            stat: 'WEAPON_DAMAGE',
            damageType: 'FROST',
            amount: '2d6',
            description: 'Adds 2d6 frost damage to attacks'
          },
          {
            type: 'BUFF',
            stat: 'ATTACK_SPEED',
            description: 'Increases attack speed'
          },
          {
            type: 'BUFF',
            stat: 'MOVEMENT_SPEED',
            amount: 10,
            description: 'Increases movement speed by 10 feet'
          }
        ]
      },

      specialMechanics: {
        synergyRequirement: {
          totems: ['Flamecaller Totem', 'Storm Totem', 'Frost Totem', 'Wind Totem'],
          description: 'All 4 totems must be active to trigger this synergy'
        },
        stormbringerBonus: {
          description: 'Stormbringer specialization: Deals 3d6 per element instead of 2d6, can trigger with only 3 totems',
          bonus: '+1d6 per element, reduced totem requirement'
        }
      },

      tags: ['synergy-effects', 'elemental', 'damage', 'ultimate', 'stormbringer']
    },

    // UTILITY SPELLS
    {
      id: 'prim_totemic_call',
      name: 'Totemic Call',
      description: 'Summon all eight sacred totems at once in a powerful ritual, creating a complete totemic circle.',
      spellType: 'ACTION',
      icon: 'spell_nature_nullward',
      school: 'Nature',
      level: 7,
      specialization: 'utility',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: '1 minute',
        concentration: true
      },

      targetingConfig: {
        range: 'Self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 30,
          unit: 'feet',
          description: 'Totems placed in circle around caster'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 10
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'SUMMON',
            creature: 'All 8 Totems',
            description: 'Summons Healing, Guardian, Flamecaller, Storm, Rejuvenation, Earth, Frost, and Wind totems',
            duration: '1 minute'
          }
        ]
      },

      specialMechanics: {
        ultimateAbility: {
          description: 'Places all 8 totems simultaneously in optimal positions',
          synergyGeneration: '8 points immediately, then 8 per turn'
        },
        multiSynergy: {
          description: 'Can trigger multiple synergy effects simultaneously',
          note: 'With 8 totems, can activate 2 different synergies at once'
        }
      },

      tags: ['utility', 'ultimate', 'totem', 'all-specs']
    },

    {
      id: 'prim_totemic_recall',
      name: 'Totemic Recall',
      description: 'Instantly reposition all active totems to your current location, maintaining their effects.',
      spellType: 'ACTION',
      icon: 'spell_shaman_dropall',
      school: 'Nature',
      level: 3,
      specialization: 'utility',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 Action Point',
        duration: 'Instant',
        concentration: false
      },

      targetingConfig: {
        range: 'Self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 20,
          unit: 'feet',
          description: 'Totems repositioned around caster'
        },
        validTargets: ['TOTEMS']
      },

      resourceCost: {
        mana: 4
      },

      resolution: {
        type: 'AUTOMATIC',
        effects: [
          {
            type: 'SPECIAL',
            description: 'Repositions all active totems to caster\'s location without destroying them'
          }
        ]
      },

      specialMechanics: {
        repositioning: {
          description: 'Moves all totems without breaking synergies or resetting durations',
          note: 'Useful for maintaining synergies while repositioning'
        },
        spiritcallerBonus: {
          description: 'Spiritcaller specialization: Costs 0 action points instead of 1',
          bonus: 'No action cost'
        }
      },

      tags: ['utility', 'totem', 'mobility', 'spiritcaller', 'all-specs']
    },

    {
      id: 'prim_earthquake',
      name: 'Earthquake',
      description: 'Channel the fury of the earth to create a massive tremor that shakes the ground and devastates enemies.',
      spellType: 'ACTION',
      icon: 'spell_nature_earthquake',
      school: 'Earth',
      level: 8,
      specialization: 'utility',

      typeConfig: {
        actionType: 'SPELL',
        castTime: '1 action',
        duration: 'Instant',
        concentration: false
      },

      targetingConfig: {
        range: '120 feet',
        areaOfEffect: {
          type: 'RADIUS',
          size: 50,
          unit: 'feet',
          description: 'All creatures in 50-foot radius'
        },
        validTargets: ['GROUND']
      },

      resourceCost: {
        mana: 8
      },

      resolution: {
        type: 'SAVING_THROW',
        savingThrow: {
          ability: 'DEXTERITY',
          dc: 16,
          onSave: 'HALF_DAMAGE',
          onFail: 'FULL_DAMAGE_AND_PRONE'
        },
        damage: {
          amount: '4d6',
          type: 'BLUDGEONING'
        },
        effects: [
          {
            type: 'CONDITION',
            condition: 'PRONE',
            description: 'Knocks all creatures prone on failed save'
          }
        ]
      },

      specialMechanics: {
        terrainEffect: {
          description: 'Creates difficult terrain in the area for 1 minute',
          note: 'Enemies have disadvantage on Dexterity saves while in area'
        }
      },

      tags: ['utility', 'damage', 'earth', 'aoe', 'ultimate', 'all-specs']
    }
  ]
};

