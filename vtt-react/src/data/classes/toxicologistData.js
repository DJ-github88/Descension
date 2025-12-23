/**
 * Toxicologist Class Data
 * 
 * Complete class information for the Toxicologist - a master of poisons, concoctions,
 * and minor contraptions who controls the battlefield through alchemy and tactical deployment.
 */

export const TOXICOLOGIST_DATA = {
  id: 'toxicologist',
  name: 'Toxicologist',
  icon: 'fas fa-flask',
  role: 'Damage/Support',

  // Overview Section
  overview: {
    title: 'The Toxicologist',
    subtitle: 'Master of Poisons, Concoctions, and Contraptions',

    description: `The Toxicologist is a master of poisons, concoctions, and minor contraptions, combining their knowledge of alchemy with deadly combat skills. Through the dual-resource system of Toxin Vials and Contraption Parts, they control the battlefield with strategic poison application and tactical device deployment, weakening enemies and creating devastating synergies.`,

    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Toxicologists are alchemists who have turned their knowledge of chemistry and biology into weapons of war. They understand the delicate balance between medicine and poison, life and death. Their laboratories are filled with bubbling vials, exotic ingredients, and mechanical contraptions—each one a tool for controlling the battlefield.

Unlike traditional mages who rely on arcane power, Toxicologists trust in science, experimentation, and preparation. They spend hours perfecting poison formulas, testing contraption designs, and studying the weaknesses of their enemies. Every battle is an experiment, every enemy a test subject.

In roleplay, Toxicologists often embody:
- **The Mad Scientist**: Obsessed with perfecting the ultimate poison or contraption
- **The Plague Doctor**: Uses knowledge of disease and toxins to both harm and heal
- **The Assassin Alchemist**: Crafts poisons for silent, efficient kills
- **The Battlefield Engineer**: Deploys contraptions to control territory and protect allies
- **The Herbalist Gone Dark**: Turned knowledge of healing plants into deadly toxins

Toxicologists often carry the scent of chemicals and herbs, their fingers stained with reagents. They collect rare ingredients obsessively, always seeking new components for their experiments. Some wear protective gear—masks, gloves, aprons—while others have built up immunity to their own poisons through careful exposure.

**Philosophy**: "Nature provides the ingredients. Science provides the method. I provide the application."`
    },

    combatRole: {
      title: 'Combat Role',
      content: `The Toxicologist is a tactical damage dealer and battlefield controller who excels at:

**Poison Application**: Apply various poisons to weapons for DoT, debuffs, and burst damage
**Battlefield Control**: Deploy contraptions to control enemy movement and create tactical advantages
**Mid-Combat Crafting**: Craft concoctions for 1 AP to adapt to changing situations
**Debuff Mastery**: Weaken enemies through stacking poison effects and contraption synergies
**Strategic Utility**: Provide antidotes, explosives, and tactical support

**Strengths**:
- Exceptional battlefield control through contraption placement
- Versatile damage output with 8 different poison types
- High adaptability through mid-combat concoction crafting
- Strong debuff capabilities that weaken entire enemy teams
- Unique utility through antidotes and explosive concoctions
- Rewards strategic planning and tactical positioning

**Weaknesses**:
- Requires careful management of two separate resources
- Contraption deployment costs action economy
- Less effective against poison-immune enemies
- Limited direct healing capabilities
- Complexity requires planning and game knowledge
- Vulnerable when caught without prepared resources

The Toxicologist shines in tactical combats where they can prepare the battlefield with contraptions, apply poisons strategically, and adapt their concoctions to counter enemy tactics.`
    },

    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Toxicologist is about preparation, adaptation, and tactical resource management. Key strategic considerations:

**Resource Management**:
- **Toxin Vials**: INT mod + 3 (min 4), regain 1d4 per short rest
- **Contraption Parts**: Max 5, regain 1 per short rest
- **Vial Costs**: 1-2 for poisons, 2-3 for concoctions, 3 for explosives
- **Part Costs**: 1-2 per contraption
- **Strategy**: Balance poison crafting with contraption deployment

**Poison Selection** (8 Types):
- **Paralytic**: Slow + disadvantage on DEX saves
- **Necrotic**: 2d6 necrotic DoT over 3 rounds
- **Corrosive**: Reduce armor by 2
- **Hallucinogenic**: Disadvantage on attacks
- **Hemorrhagic**: Prevent healing for 2 rounds
- **Soporific**: CON save or fall unconscious
- **Caustic**: 3d8 instant acid damage
- **Virulent**: Spread to adjacent enemies

**Contraption Deployment** (6 Types):
- **Poison Gas Trap**: 10ft poison cloud when triggered
- **Caltrops Field**: Difficult terrain + damage
- **Smoke Bomb**: Vision obscurement
- **Alarm Bell**: Alert to enemy movement
- **Net Launcher**: Restrain single target
- **Explosive Mine**: 3d10 fire damage AoE

**Concoction Crafting** (Mid-Combat):
- **Antidote** (2 vials): Cure poison/disease + resistance
- **Explosive Concoction** (3 vials): 4d6 fire damage AoE
- **Smoke Bomb** (2 vials): Obscure vision for escape
- **Acid Flask** (2 vials): 3d8 acid + armor reduction

**Specialization Synergies**:
- **Venomancer**: +1d6 poison damage, poison duration +1 round, poison save DC +2
- **Gadgeteer**: Deploy contraptions for 1 AP, +1 contraption part max, contraptions harder to detect
- **Saboteur**: Poisons reduce enemy damage by 1d6, contraptions slow enemies, debuff duration +1 round

**Combat Flow**:
- **Pre-Combat**: Deploy contraptions at choke points and key locations
- **Opening**: Apply poison to weapon, throw explosive concoction at grouped enemies
- **Mid-Combat**: Switch poisons based on enemy type, craft concoctions as needed
- **Defensive**: Use smoke bombs and caltrops to create escape routes
- **Finishing**: Stack multiple poisons on priority targets for devastating DoT

**Team Dynamics**:
- Works well with tanks who can protect while setting up contraptions
- Synergizes with crowd control that groups enemies for AoE poisons
- Benefits from scouts who can identify enemy weaknesses
- Provides utility through antidotes and defensive contraptions
- Can zone enemies away from vulnerable allies with poison clouds`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Alchemist\'s Laboratory',
      content: `**The Setup**: You're a Toxicologist (Venomancer specialization) facing a group of bandits (5 bandits + 1 bandit leader). Your party is with you. Starting Resources: Toxin Vials: 7/7, Contraption Parts: 5/5. Starting Mana: 40/50. Your goal: Deploy contraptions to control the battlefield, apply poisons to your weapon, and craft concoctions mid-combat to adapt to the situation.

**Starting State**: Toxin Vials: 7/7 | Contraption Parts: 5/5 | Mana: 40/50 | HP: 50/50 | Weapon Poison: None

**Turn 1 - Setting the Trap (Vials: 7 → 6, Parts: 5 → 3)**

*Five bandits and their leader approach. You smile. They're walking into YOUR laboratory.*

**Your Action (Pre-Combat Setup)**: Deploy "Caltrops" (1 contraption part, 1 AP)
**Effect**: 10 ft area, enemies take 1d4 damage and speed reduced by 10 ft

*You scatter caltrops across the ground at the choke point.*

**Contraption Parts**: 5 - 1 = **4/5**

**Your Action**: Deploy "Poison Gas Trap" (2 contraption parts)
**Effect**: When triggered, releases poison cloud (15 ft radius, 2d6 poison damage per turn, lasts 3 rounds)

*You place a small device on the ground. When an enemy steps on it, it will release a devastating poison cloud.*

**Contraption Parts**: 4 - 2 = **2/5**

**Your Action (1 AP)**: Apply "Paralytic Poison" to weapon (1 toxin vial)
**Effect**: Weapon attacks deal +1d6 poison damage, target has disadvantage on DEX saves for 2 rounds

*You coat your blade with a viscous green poison. It GLISTENS with toxicity.*

**Toxin Vials**: 7 - 1 = **6/7**

**Your Party's Tank**: "What are all these... devices?"
**You**: "Contraptions. Caltrops to slow them. A poison gas trap for when they group up. And my weapon is coated with paralytic poison. Let them come."

**Current State**: Vials: 6/7 | Parts: 2/5 | Mana: 40/50 | Weapon: Paralytic Poison

**Turn 2 - Springing the Trap (Vials: 6 → 3)**

*The bandits charge. Three of them step on the caltrops. One triggers the poison gas trap.*

**Bandits #1, #2, #3**: Step on caltrops
**Damage**: 1d4 → [3] = 3 damage each
**Effect**: Speed reduced by 10 ft

**Bandit #4**: Triggers Poison Gas Trap
**Effect**: Poison cloud erupts (15 ft radius)

**Bandits #4, #5, Leader**: All caught in poison cloud
**Poison Damage**: 2d6 → [5, 4] = 9 poison damage each per turn for 3 rounds

*The poison cloud ERUPTS. The bandits caught inside CHOKE and GASP.*

**Your Action**: Melee attack Bandit #1 (has paralytic poison on weapon)
**Attack Roll**: d20+5 → [16] = Hit!
**Base Damage**: 2d6+3 → [5, 4] + 3 = 12 damage
**Paralytic Poison**: +1d6 poison → [5] = +5 poison damage
**Total Damage**: 12 + 5 = **17 damage**
**Effect**: Bandit #1 has disadvantage on DEX saves for 2 rounds

**Bandit #1**: Takes 17 damage → HEAVILY DAMAGED

**Your Action (1 AP)**: Craft "Explosive Concoction" (3 toxin vials)
**Effect**: Throwable explosive, 4d6 fire damage in 10 ft radius

*You quickly mix chemicals from your vials. The concoction BUBBLES and SMOKES.*

**Toxin Vials**: 6 - 3 = **3/7**

**Your Party's Mage**: "You're crafting explosives MID-COMBAT?!"
**You**: "Explosive Concoction. Costs 3 toxin vials. I'll throw it next turn."

**Current State**: Vials: 3/7 | Parts: 2/5 | Mana: 40/50 | Explosive ready

**Turn 3 - The Explosion (Vials: 3 → 2)**

*The poison cloud continues. Bandits #4, #5, and Leader take another 9 poison damage each.*

**Poison Cloud** (Turn 2 of 3): Bandits #4, #5, Leader take 9 poison damage each

**Your Action**: Throw "Explosive Concoction" at grouped bandits (no cost, already crafted)
**Targets**: Bandits #2, #3, #4 (grouped together)
**Damage**: 4d6 fire → [6, 5, 6, 4] = **21 fire damage each**

*You hurl the concoction. It EXPLODES in a massive fireball.*

**Bandit #2**: Takes 21 fire damage → **DEAD**
**Bandit #3**: Takes 21 fire damage → **DEAD**
**Bandit #4**: Takes 21 fire damage → **DEAD**

**Your Party's Rogue**: "THREE bandits with ONE explosive!"
**You**: "Explosive Concoction. 4d6 fire damage in 10 feet. They were grouped perfectly."

**Your Action (1 AP)**: Apply "Necrotic Poison" to weapon (1 toxin vial)
**Effect**: Weapon attacks deal +1d8 necrotic damage, target's max HP reduced by damage dealt

*You coat your blade with a BLACK poison that seems to absorb light.*

**Toxin Vials**: 3 - 1 = **2/7**

**Current State**: Vials: 2/7 | Parts: 2/5 | Mana: 40/50 | Weapon: Necrotic Poison

**Turn 4 - Finishing Touches (Vials: 2 → 0)**

*Only Bandit #1, #5, and the Leader remain. The poison cloud continues (Turn 3 of 3).*

**Poison Cloud** (Turn 3 of 3): Bandit #5 and Leader take 9 poison damage each
**Poison Cloud**: Expires after this turn

**Your Action**: Melee attack Bandit #1 (has necrotic poison on weapon)
**Attack Roll**: d20+5 → [17] = Hit!
**Base Damage**: 2d6+3 → [6, 5] + 3 = 14 damage
**Necrotic Poison**: +1d8 necrotic → [7] = +7 necrotic damage
**Total Damage**: 14 + 7 = **21 damage**
**Effect**: Bandit #1's max HP reduced by 7

**Bandit #1**: Takes 21 damage → **DEAD**

**Your Action (1 AP)**: Craft "Antidote" (2 toxin vials)
**Effect**: Cure poison/disease on ally, grant poison resistance for 1 hour

*You mix a healing concoction, just in case.*

**Toxin Vials**: 2 - 2 = **0/7**

**Your Party's Healer**: "You're out of vials!"
**You**: "I'll regain 1d4 vials on a short rest. But I've already killed 4 bandits and dealt massive poison damage to the others."

**Current State**: Vials: 0/7 | Parts: 2/5 | Mana: 40/50

**Turn 5 - Cleanup**

*Bandit #5 and the Leader remain, both heavily damaged from poison cloud (27 poison damage total over 3 turns).*

**Your Party's Tank**: Attacks Bandit #5 → DEAD
**Your Party's Mage**: Casts Magic Missile at Leader → DEAD

**Combat Over**

*You collect your contraption parts from the caltrops and poison gas trap (reusable).*

**Contraption Parts**: 2 + 3 (recovered) = **5/5** (back to max)

**Your Party's Rogue**: "You killed three bandits with one explosive, poisoned two others to death with the gas trap, and your weapon poisons dealt massive damage."
**You**: "Toxicologist gameplay. I started with 7 toxin vials and 5 contraption parts. I spent 1 part on caltrops, 2 parts on the poison gas trap. I spent 1 vial on paralytic poison for my weapon, 3 vials on the explosive concoction, 1 vial on necrotic poison, and 2 vials on an antidote."
**Your Party's Mage**: "And the poison gas trap?"
**You**: "Dealt 2d6 poison damage per turn for 3 turns to everyone in 15 feet. That's 9 damage per turn × 3 turns = 27 total poison damage to Bandits #4, #5, and the Leader. Bandit #4 also took 21 fire damage from the explosive, so he took 30 total damage from my abilities alone."
**Your Party's Tank**: "And you recovered your contraption parts?"
**You**: "Contraptions are reusable. I recover the parts after combat. Toxin vials regenerate 1d4 per short rest."

**Final State**: Vials: 0/7 (will regain 1d4 on short rest) | Parts: 5/5 (recovered) | Mana: 40/50 | HP: 50/50

**Damage Breakdown**:
- Paralytic Poison (weapon): 5 poison damage to Bandit #1
- Necrotic Poison (weapon): 7 necrotic damage to Bandit #1
- Explosive Concoction: 21 fire damage × 3 bandits = 63 total fire damage
- Poison Gas Trap: 9 poison damage/turn × 3 turns × 3 bandits = 81 total poison damage
- Caltrops: 3 damage × 3 bandits = 9 total damage
- **Grand Total**: ~165 damage from poisons, contraptions, and concoctions

**The Lesson**: Toxicologist gameplay is about:
1. **Contraption Deployment**: Placed caltrops (1 part) and poison gas trap (2 parts) before combat
2. **Poison Application**: Applied paralytic poison (1 vial) and necrotic poison (1 vial) to weapon
3. **Mid-Combat Crafting**: Crafted explosive concoction (3 vials) and antidote (2 vials) for 1 AP each
4. **Resource Management**: Started with 7 vials and 5 parts, spent all vials strategically
5. **Contraption Recovery**: Recovered 3 parts after combat (contraptions are reusable)
6. **Poison Synergy**: Poison gas trap dealt 27 damage over 3 turns to multiple enemies
7. **Explosive Burst**: Explosive concoction dealt 21 damage to 3 grouped enemies (63 total)

You're an ALCHEMIST WARRIOR who controls the battlefield through preparation and adaptation. You deploy contraptions (caltrops, poison gas traps) to control enemy movement and deal damage. You apply poisons to your weapon (paralytic, necrotic) for enhanced attacks. You craft concoctions MID-COMBAT (explosives, antidotes) to adapt to the situation. The poison gas trap alone dealt 81 total damage over 3 turns. The explosive concoction killed 3 bandits in one throw. You're not a simple damage dealer—you're a TACTICAL ALCHEMIST who turns the battlefield into your laboratory.`
    }
  },

  // Resource System
  resourceSystem: {
    title: 'Alchemical Arsenal',
    subtitle: 'Toxin Vials & Contraption Parts',

    description: `The Toxicologist's unique mechanic revolves around managing two distinct resources: **Toxin Vials** (for crafting poisons and concoctions) and **Contraption Parts** (for deploying battlefield devices). This dual-resource system rewards strategic planning and tactical adaptation.`,

    mechanics: {
      title: 'How It Works',
      content: `**Toxin Vials (Primary Resource)**
- **Maximum**: INT modifier + 3 (minimum 4)
- **Generation**: Regain 1d4 vials per short rest, all vials per long rest
- **Usage**: Spend 1-3 vials to craft poisons, concoctions, or antidotes
- **Crafting Speed**: Can craft for 1 AP during combat
- **Variety**: Different recipes require different vial costs

**Contraption Parts (Secondary Resource)**
- **Maximum**: 5 parts
- **Generation**: Regain 1 part per short rest, all parts per long rest
- **Usage**: Spend 1-2 parts to deploy contraptions
- **Deployment**: Requires an action to set up contraption
- **Persistence**: Contraptions remain active until triggered or destroyed

**Poison Application**
- **Duration**: Poisons last for 3 attacks or until end of combat
- **Switching**: Changing poisons requires 1 AP
- **Stacking**: Multiple poison effects can stack on the same target`
    },

    // Toxin Vial Recipes Table
    toxinVialRecipesTable: {
      title: 'Toxin Vial Recipes',
      description: 'Concoctions and poisons that can be crafted using Toxin Vials. Crafting takes 1 AP.',
      headers: ['Recipe', 'Vial Cost', 'Effect', 'Duration', 'Notes'],
      rows: [
        [
          'Paralysis Poison',
          '2 vials',
          'Target must save (DC 14 CON) or be paralyzed for 1 round',
          '3 attacks',
          'Applied to weapon or dart'
        ],
        [
          'Weakening Toxin',
          '1 vial',
          '-2 to attack rolls and -1d4 damage',
          '3 attacks',
          'Stacks with other debuffs'
        ],
        [
          'Corrosive Acid',
          '2 vials',
          '2d6 acid damage, -2 armor for 2 rounds',
          '3 attacks',
          'Eats through armor'
        ],
        [
          'Bleeding Venom',
          '2 vials',
          '1d6 poison damage per round for 4 rounds',
          '3 attacks',
          'DoT effect, stacks'
        ],
        [
          'Antidote',
          '1 vial',
          'Cure poison/disease, +2 CON saves for 1 hour',
          'Instant',
          'Can be used on allies'
        ],
        [
          'Explosive Concoction',
          '3 vials',
          '3d8 fire damage in 10ft radius',
          'Instant',
          'Thrown as action, DEX save DC 15'
        ],
        [
          'Smoke Bomb',
          '1 vial',
          'Create 15ft radius smoke cloud, obscures vision',
          '3 rounds',
          'Thrown for 1 AP'
        ],
        [
          'Healing Mist',
          '2 vials',
          'Heal 2d6 HP to all allies in 10ft radius',
          'Instant',
          'Rare utility option'
        ]
      ]
    },

    // Contraption Types Table
    contraptionTypesTable: {
      title: 'Contraption Types',
      description: 'Minor devices that can be deployed on the battlefield. Deployment requires an action.',
      headers: ['Contraption', 'Parts Cost', 'Trigger', 'Effect', 'Duration'],
      rows: [
        [
          'Poison Gas Trap',
          '1 part',
          'Enemy enters 5ft radius',
          '2d6 poison damage, -10ft movement for 2 rounds',
          'Until triggered or 10 minutes'
        ],
        [
          'Spike Trap',
          '1 part',
          'Enemy enters 5ft square',
          '3d6 piercing damage, immobilized for 1 round (DC 14 DEX save)',
          'Until triggered or 10 minutes'
        ],
        [
          'Healing Mist Dispenser',
          '2 parts',
          'Ally enters 5ft radius',
          'Heal 1d8 HP, remove 1 poison/disease',
          'Until triggered or 10 minutes'
        ],
        [
          'Smoke Grenade Launcher',
          '1 part',
          'Enemy enters 10ft radius',
          'Create 15ft smoke cloud, obscures vision for 3 rounds',
          'Until triggered or 10 minutes'
        ],
        [
          'Acid Sprayer',
          '2 parts',
          'Enemy enters 5ft cone',
          '2d8 acid damage, -3 armor for 3 rounds',
          'Until triggered or 10 minutes'
        ],
        [
          'Alarm Bell',
          '1 part',
          'Enemy enters 10ft radius',
          'Alert allies, +2 initiative for allies within 30ft',
          'Until triggered or 1 hour'
        ]
      ]
    },

    // Poison Weapon Effects Table
    poisonWeaponEffectsTable: {
      title: 'Weapon Poison Effects',
      description: 'Poisons applied to weapons. Each poison lasts for 3 attacks or until end of combat.',
      headers: ['Poison Type', 'Damage/Effect', 'Secondary Effect', 'Save DC', 'Specialization Bonus'],
      rows: [
        [
          'Neurotoxin',
          '1d8 poison damage',
          'Target -2 to attack rolls for 2 rounds',
          'DC 14 CON',
          'Venomancer: +1d6 damage'
        ],
        [
          'Hemotoxin',
          '1d6 poison damage/round for 3 rounds',
          'Bleeding effect, stacks',
          'DC 13 CON',
          'Venomancer: Duration +2 rounds'
        ],
        [
          'Cytotoxin',
          '2d6 necrotic damage',
          '-1d4 max HP (temporary)',
          'DC 15 CON',
          'Gadgeteer: Also -1 AC'
        ],
        [
          'Myotoxin',
          '1d6 poison damage',
          '-10ft movement, disadvantage on STR checks',
          'DC 14 CON',
          'Saboteur: Also -2 to saves'
        ],
        [
          'Cardiotoxin',
          '2d8 poison damage',
          'Stunned for 1 round on failed save',
          'DC 16 CON',
          'Venomancer: Stun duration +1 round'
        ]
      ]
    },

    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Resource Economy**: Balance Toxin Vials between offensive poisons and utility concoctions. Save Contraption Parts for key choke points.

**Contraption Placement**: Deploy contraptions at choke points, near allies, or to protect flanks. Consider enemy movement patterns.

**Poison Synergies**: Stack different poison types on the same target for devastating combos (e.g., Bleeding + Weakening).

**Adaptation**: Craft concoctions mid-combat to respond to threats. Keep 1-2 vials in reserve for emergencies.

**Specialization Synergy**: Each specialization enhances different aspects - Venomancer boosts poison damage, Gadgeteer improves contraptions, Saboteur excels at debuffs.`
    },

    playingInPerson: {
      title: 'Playing Toxicologist In Person',
      content: `**Required Materials**:
- **Toxin Vial Tokens** (10 tokens, beads, or dice representing vials)
- **Contraption Part Tokens** (5 tokens representing mechanical parts)
- **Poison Type Cards** (showing different poison effects)
- **Contraption Cards** (showing deployed contraptions and their effects)
- **Crafting Recipe Chart** (showing vial costs for concoctions)
- **Deployment Markers** (for marking contraption locations on map)

**Primary Tracking Method: Dual Token System (Vials + Parts)**

The Toxicologist uses two separate resources: Toxin Vials (for poisons and concoctions) and Contraption Parts (for mechanical devices). Track both with physical tokens that you spend and regenerate.

**Setup**:
\`\`\`
TOXICOLOGIST RESOURCE TRACKING:

TOXIN VIALS: [___] / 10
• Regenerate: 1 vial per short rest, all vials per long rest
• Spend on: Poisons (1-3 vials), concoctions (2-4 vials)
• Venomancer: +1d6 poison damage
• Gadgeteer: 8 max vials (instead of 10)

CONTRAPTION PARTS: [___] / 5
• Regenerate: 1 part per short rest, all parts per long rest
• Spend on: Deploy contraptions (1-2 parts each)
• Gadgeteer: 6 max parts (instead of 5)
• Saboteur: Contraptions harder to detect

POISON TYPES:
• Lethal: High damage over time
• Weakening: Reduce enemy stats
• Paralyzing: Reduce movement/actions
• Bleeding: Stacking damage

CONTRAPTION TYPES:
• Traps: Triggered by proximity
• Turrets: Automated attacks
• Smoke Bombs: Vision/movement denial
• Caltrops: Area denial
\`\`\`

**How It Works**:

**Toxin Vials (Poison Crafting)**:
1. **Spend vials** → Apply poison or craft concoction
2. **Remove tokens** → Subtract from vial count
3. **Regenerate** → Add 1 token per short rest, all per long rest

**Contraption Parts (Device Deployment)**:
1. **Spend parts** → Deploy contraption
2. **Place marker** → Mark contraption location on map
3. **Remove tokens** → Subtract from part count
4. **Regenerate** → Add 1 token per short rest, all per long rest

**Example Poison Application**:

*You have 8 toxin vials, attacking with poisoned weapon*

**Your Turn - Venom Strike**:
1. "I strike with Venom Strike!" (2 vials)
2. Remove 2 vial tokens
3. Toxin vials: 8 - 2 = **6 vials**
4. Attack roll: 1d20+5 → [16] + 5 = 21 (hit!)
5. Weapon damage: 1d8+3 → [6] + 3 = 9 damage
6. Poison damage: 2d6 → [5,4] = 9 poison damage (immediate)
7. Ongoing poison: 1d6 poison damage per turn for 4 turns

**Example Contraption Deployment**:

*You have 4 contraption parts, deploying poison gas trap*

**Your Turn - Deploy Trap**:
1. "I deploy a Poison Gas Trap at the doorway!" (2 parts)
2. Remove 2 part tokens
3. Contraption parts: 4 - 2 = **2 parts**
4. Place trap marker on map at doorway
5. Trap effect: When triggered, 3d6 poison damage (CON save DC 15)
6. Trap duration: Until triggered or 1 hour

**Example Concoction Crafting**:

*You have 7 toxin vials, crafting antidote concoction*

**During Combat (1 AP)**:
1. "I craft an Antidote Concoction!" (3 vials)
2. Remove 3 vial tokens
3. Toxin vials: 7 - 3 = **4 vials**
4. Concoction effect: Cure poison, remove 1 disease
5. Use immediately or save for later

**Poison Type Reference Cards**:
\`\`\`
═══════════════════════════════════
    LETHAL POISON (High Damage)
═══════════════════════════════════
COST: 2 Toxin Vials

IMMEDIATE: 2d6 poison damage
ONGOING: 1d6 poison damage per turn (4 turns)
SAVE: CON DC 15 to end early

VENOMANCER BONUS: +1d6 poison damage
═══════════════════════════════════

═══════════════════════════════════
   WEAKENING POISON (Stat Reduction)
═══════════════════════════════════
COST: 2 Toxin Vials

IMMEDIATE: 1d6 poison damage
EFFECT: -2 to STR and DEX for 3 turns
SAVE: CON DC 15 to negate debuff

SABOTEUR BONUS: Lasts 2 additional turns
═══════════════════════════════════

═══════════════════════════════════
  PARALYZING POISON (Movement Denial)
═══════════════════════════════════
COST: 3 Toxin Vials

IMMEDIATE: 1d6 poison damage
EFFECT: -20 ft speed, -1 action per turn (3 turns)
SAVE: CON DC 15 to negate debuff

SABOTEUR BONUS: Requires coin flip to dispel
═══════════════════════════════════

═══════════════════════════════════
    BLEEDING POISON (Stacking DoT)
═══════════════════════════════════
COST: 2 Toxin Vials

IMMEDIATE: 1d4 poison damage
ONGOING: 1d4 poison damage per turn (stacks)
DURATION: 5 turns

VENOMANCER BONUS: +1d6 initial damage
═══════════════════════════════════
\`\`\`

**Contraption Reference Cards**:
\`\`\`
═══════════════════════════════════
    POISON GAS TRAP
═══════════════════════════════════
COST: 2 Contraption Parts

TRIGGER: Enemy enters within 5 ft
EFFECT: 3d6 poison damage (CON save DC 15, half)
AREA: 10 ft radius cloud (lasts 2 turns)
DURATION: Until triggered or 1 hour

GADGETEER BONUS: Deploy for 1 AP
═══════════════════════════════════

═══════════════════════════════════
    AUTOMATED TURRET
═══════════════════════════════════
COST: 2 Contraption Parts

EFFECT: Attacks nearest enemy each turn
ATTACK: +5 to hit, 2d6 piercing damage
RANGE: 30 ft
DURATION: 5 turns or until destroyed (20 HP)

GADGETEER BONUS: +1 contraption part max
═══════════════════════════════════

═══════════════════════════════════
    SMOKE BOMB
═══════════════════════════════════
COST: 1 Contraption Part

EFFECT: 15 ft radius smoke cloud
VISION: Heavily obscured (disadvantage on attacks)
MOVEMENT: -10 ft speed inside cloud
DURATION: 3 turns

SABOTEUR BONUS: Lasts 2 additional turns
═══════════════════════════════════

═══════════════════════════════════
    CALTROPS FIELD
═══════════════════════════════════
COST: 1 Contraption Part

AREA: 10 ft square
EFFECT: 1d4 piercing damage, -10 ft speed
SAVE: DEX DC 15 to avoid
DURATION: Until cleared or 1 hour

GADGETEER BONUS: Harder to detect (DC +3)
═══════════════════════════════════
\`\`\`

**Concoction Crafting Chart**:
\`\`\`
═══════════════════════════════════
   CONCOCTION RECIPES
═══════════════════════════════════
ANTIDOTE (3 vials):
• Cure poison, remove 1 disease
• 1 AP to craft and use

HEALING SALVE (2 vials):
• Restore 2d8+INT HP
• 1 AP to craft and use

EXPLOSIVE VIAL (4 vials):
• Throw: 4d6 fire damage (15 ft radius)
• DEX save DC 15, half on save

INVISIBILITY POTION (3 vials):
• Invisible for 1 minute
• Ends if you attack or cast spell

SPEED ELIXIR (2 vials):
• +20 ft speed for 3 turns
• +1 action per turn
═══════════════════════════════════
\`\`\`

**Example In-Person Turn**:

*You have 6 toxin vials, 3 contraption parts*

**Turn 1 - Deploy Trap**:
1. "I deploy a Poison Gas Trap at the doorway!" (2 parts)
2. Remove 2 part tokens
3. Contraption parts: 3 - 2 = **1 part**
4. Place trap marker on map

**Turn 2 - Apply Poison**:
1. "I attack with Lethal Poison!" (2 vials)
2. Remove 2 vial tokens
3. Toxin vials: 6 - 2 = **4 vials**
4. Attack: 1d20+5 → [18] + 5 = 23 (hit!)
5. Damage: 1d8+3 → [7] + 3 = 10 damage
6. Poison: 2d6 → [5,4] = 9 poison damage
7. Ongoing: 1d6 poison per turn (4 turns)

**Turn 3 - Craft Concoction**:
1. "I craft a Healing Salve!" (2 vials, 1 AP)
2. Remove 2 vial tokens
3. Toxin vials: 4 - 2 = **2 vials**
4. Use immediately: 2d8+INT → [7,6] + 3 = 16 HP restored

**Turn 4 - Enemy Triggers Trap**:
1. Orc enters doorway (trap triggers!)
2. Poison gas: 3d6 → [6,5,4] = 15 poison damage
3. CON save: 1d20+2 → [8] + 2 = 10 (fail!)
4. Orc takes full 15 damage
5. 10 ft cloud remains for 2 turns

**Alternative Tracking Methods**:

**Method 1: Colored Tokens**
- Green tokens = Toxin Vials
- Gray tokens = Contraption Parts
- Visual distinction between resources

**Method 2: Dice Tracking**
- d10 for toxin vials (rotate to show count)
- d6 for contraption parts (rotate to show count)
- Quick and compact

**Method 3: Bead System**
- String of beads (10 green, 5 gray)
- Move beads to track resources
- Tactile feedback

**Method 4: Paper Tracking**
- Write vial and part counts on paper
- Cross out and rewrite as they change
- Minimalist approach

**Quick Reference Card Template**:
\`\`\`
TOXICOLOGIST QUICK REFERENCE

TOXIN VIALS (10 max, 8 for Gadgeteer):
• Regenerate: 1 per short rest, all per long rest
• Lethal Poison: 2 vials (high damage)
• Weakening Poison: 2 vials (stat reduction)
• Paralyzing Poison: 3 vials (movement denial)
• Bleeding Poison: 2 vials (stacking DoT)
• Concoctions: 2-4 vials (various effects)

CONTRAPTION PARTS (5 max, 6 for Gadgeteer):
• Regenerate: 1 per short rest, all per long rest
• Poison Gas Trap: 2 parts (3d6 poison)
• Automated Turret: 2 parts (attacks each turn)
• Smoke Bomb: 1 part (vision denial)
• Caltrops: 1 part (area denial)

STRATEGY:
• Venomancer: Focus on poisons (+1d6 damage)
• Gadgeteer: Focus on contraptions (6 max parts)
• Saboteur: Focus on debuffs (last 2 extra turns)
• Save 2-3 vials for emergency concoctions
• Deploy contraptions before combat starts
\`\`\`

**Thematic Enhancements**:

Many players enhance the Toxicologist experience with:
- **Vial Props**: Small bottles or test tubes for toxin vials
- **Green Dice**: Green dice for poison damage rolls
- **Contraption Miniatures**: Small props for deployed contraptions
- **Poison Tokens**: Skull tokens for poisoned enemies
- **Crafting Mat**: Alchemy mat for concoction crafting
- **Smoke Effects**: Cotton balls for smoke bomb clouds

**Resource Management Tips**:

**Vial Management**:
- **Save Reserves**: Keep 2-3 vials for emergency concoctions
- **Poison Priority**: Use lethal poison for high-value targets
- **Concoction Timing**: Craft concoctions mid-combat as needed
- **Regeneration**: Take short rests to regenerate vials
- **Venomancer**: Maximize poison damage with spec bonus

**Part Management**:
- **Pre-Deploy**: Deploy contraptions before combat starts
- **Trap Placement**: Place traps at chokepoints and doorways
- **Turret Positioning**: Deploy turrets with clear line of sight
- **Save Parts**: Keep 1-2 parts for mid-combat deployment
- **Gadgeteer**: Maximize contraptions with 6 max parts

**Specialization Strategy**:
- **Venomancer**: Focus on poison application (+1d6 damage, +2 turns duration)
- **Gadgeteer**: Focus on contraption deployment (6 max parts, 1 AP deploy)
- **Saboteur**: Focus on debuffs (last 2 extra turns, harder to dispel)

**Why This System Works**: The dual resource system (vials + parts) creates two distinct gameplay loops. Vials are for direct combat (poisons and concoctions), while parts are for battlefield control (traps and contraptions). The physical act of removing tokens when you spend resources creates satisfying feedback. The regeneration system (1 per short rest) encourages resource management and strategic spending. The crafting system (concoctions) provides mid-combat adaptation. The system is simple to track but creates deep strategic gameplay.

**Pro Tips**:
- **Pre-Combat Prep**: Deploy contraptions before combat starts
- **Vial Conservation**: Don't waste vials on weak enemies
- **Concoction Flexibility**: Craft concoctions mid-combat for adaptation
- **Trap Synergy**: Combine traps with area denial for maximum effect
- **Regeneration Timing**: Take short rests to regenerate resources
- **Specialization Awareness**: Know your spec bonuses and maximize them

**Budget-Friendly Alternatives**:
- **No tokens?** Use coins (pennies = vials, dimes = parts)
- **No cards?** Write poison/contraption effects on paper
- **No markers?** Use dice to mark contraption locations
- **Minimalist**: Track vial and part counts on paper

**Specialization-Specific Tracking**:

**Venomancer**:
- Track +1d6 poison damage bonus
- Track +2 turn duration on poison effects
- Disadvantage on saves against your poisons

**Gadgeteer**:
- Track 8 max toxin vials (instead of 10)
- Track 6 max contraption parts (instead of 5)
- Deploy contraptions for 1 AP

**Saboteur**:
- Track +2 turn duration on all debuffs
- Mark debuffs requiring coin flip to dispel
- Track -2 to all saves for poisoned/contraption-affected enemies

**Why Toxicologist Is Perfect for In-Person Play**: The class is built around physical resource management (vials and parts) that creates satisfying token manipulation. The dual resource system creates multiple decision points—spend vials on poisons or concoctions? Spend parts on traps or turrets? The crafting system provides mid-combat adaptation and problem-solving. The contraption deployment creates spatial awareness and battlefield control. The poison application creates ongoing damage tracking that feels impactful. Every vial spent is a tactical decision, and every contraption deployed is a strategic investment. The system is simple enough to track mid-combat but creates deep strategic gameplay.`
    }
  },

  // Specializations
  specializations: {
    title: 'Toxicologist Specializations',
    subtitle: 'Three Paths of Alchemical Mastery',

    description: `Toxicologists can specialize in three distinct approaches to alchemy and battlefield control, each focusing on different aspects of poison crafting, contraption deployment, and tactical expertise.`,

    passiveAbility: {
      name: 'Alchemical Expertise',
      description: 'All Toxicologists can craft poisons and concoctions for 1 AP, and deploy contraptions as an action. Gain immunity to your own poisons and resistance to all poison damage.'
    },

    specs: [
      {
        name: 'Venomancer',
        icon: 'fas fa-skull-crossbones',
        description: 'Masters of deadly poisons and toxins. Venomancers focus on maximizing poison damage and duration, creating the most lethal concoctions possible.',

        passiveAbility: {
          name: 'Potent Toxins',
          description: 'All poison damage you deal is increased by +1d6. Poison effects you apply last 2 additional rounds. Enemies have disadvantage on saves against your poisons.'
        },

        keyAbilities: [
          {
            name: 'Concentrated Venom',
            cost: '2 Toxin Vials',
            effect: 'Apply a super-concentrated poison to your weapon. Next attack deals 4d8 poison damage and target is poisoned for 1 minute (DC 17 CON save to halve damage and negate poisoned condition).'
          },
          {
            name: 'Toxic Cloud',
            cost: '3 Toxin Vials',
            effect: 'Create a 20ft radius poison cloud. All enemies in area take 3d6 poison damage per round and have -2 to all rolls. Lasts 4 rounds. DC 16 CON save for half damage.'
          },
          {
            name: 'Lethal Injection',
            cost: '4 Toxin Vials',
            effect: 'Inject target with lethal toxin. Target takes 6d10 poison damage immediately and 2d10 poison damage per round for 5 rounds. DC 18 CON save to halve initial damage and reduce DoT to 1d10.'
          }
        ]
      },
      {
        name: 'Gadgeteer',
        icon: 'fas fa-cog',
        description: 'Masters of contraptions and mechanical devices. Gadgeteers excel at deploying multiple contraptions and enhancing their effects.',

        passiveAbility: {
          name: 'Improved Contraptions',
          description: 'You can deploy contraptions for 1 AP instead of an action. Your contraptions deal +1d6 damage and have +5ft trigger radius. You can have up to 4 active contraptions at once (instead of 3).'
        },

        keyAbilities: [
          {
            name: 'Rapid Deployment',
            cost: '2 Contraption Parts',
            effect: 'Deploy 2 contraptions simultaneously for 1 AP. Both contraptions are placed within 30ft of you and activate immediately.'
          },
          {
            name: 'Overcharged Trap',
            cost: '3 Contraption Parts',
            effect: 'Deploy a supercharged contraption. When triggered, it deals 5d8 damage (type based on contraption), affects 15ft radius, and applies additional debuff for 3 rounds.'
          },
          {
            name: 'Contraption Network',
            cost: '4 Contraption Parts',
            effect: 'Link all your active contraptions. When one triggers, all others activate simultaneously. Enemies caught in multiple effects take full damage from each and have disadvantage on all saves.'
          }
        ]
      },
      {
        name: 'Saboteur',
        icon: 'fas fa-user-secret',
        description: 'Masters of debuffs and battlefield disruption. Saboteurs focus on weakening enemies and creating chaos through combined poison and contraption effects.',

        passiveAbility: {
          name: 'Debilitating Expertise',
          description: 'All debuffs you apply last 2 additional rounds and require a coin flip (heads) to dispel successfully. Enemies affected by your poisons or contraptions have -2 to all saves and skill checks.'
        },

        keyAbilities: [
          {
            name: 'Crippling Toxin',
            cost: '2 Toxin Vials',
            effect: 'Apply a debilitating poison. Target has -4 to attack rolls, -2 armor, -10ft movement, and disadvantage on all saves for 5 rounds. DC 16 CON save to reduce penalties by half.'
          },
          {
            name: 'Chaos Grenade',
            cost: '3 Toxin Vials + 1 Contraption Part',
            effect: 'Throw a grenade that combines poison and mechanical chaos. 20ft radius: 2d8 poison + 2d8 fire damage, enemies are confused (attack random target) for 2 rounds. DC 17 INT save to negate confusion.'
          },
          {
            name: 'Total Shutdown',
            cost: '4 Toxin Vials + 2 Contraption Parts',
            effect: 'Target enemy is completely debilitated. They cannot take actions or reactions for 2 rounds, have 0 armor, and automatically fail all saves. DC 19 CON save to reduce duration to 1 round and retain reactions.'
          }
        ]
      }
    ]
  },

  // Example Spells - organized by specialization
  exampleSpells: [
    // ===== VENOMANCER SPECIALIZATION =====
    {
      id: 'tox_venom_strike',
      name: 'Venom Strike',
      description: 'Strike with a poisoned weapon, injecting deadly toxin that deals immediate and ongoing damage.',
      spellType: 'ACTION',
      icon: 'ability_rogue_deadlybrew',
      school: 'Physical',
      level: 2,
      specialization: 'venomancer',

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
        durationType: 'duration',
        duration: 4,
        durationUnit: 'rounds'
      },

      resourceCost: {
        toxinVials: 2,
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Strike with poisoned blade'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '2d6 + agility',
        elementType: 'poison',
        damageType: 'direct',
        bonusDamage: {
          condition: 'venomancer_passive',
          amount: '+1d6',
          description: 'Venomancer passive adds +1d6 poison damage'
        },
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '1d6',
          duration: 4,
          tickFrequency: 'turn',
          isProgressiveDot: false
        }
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'poisoned',
          name: 'Poisoned',
          description: 'Disadvantage on attack rolls and ability checks for 4 rounds',
          statusType: 'poisoned',
          level: 'moderate'
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        canBeDispelled: true
      },

      specialMechanics: {
        venomancerBonus: {
          enabled: true,
          effect: 'Venomancers add +1d6 to all poison damage and extend DoT duration by 2 rounds'
        },
        weaponPoison: {
          description: 'This poison is applied to your weapon and affects the next attack'
        }
      },

      tags: ['melee', 'poison', 'damage', 'dot', 'venomancer']
    },

    {
      id: 'tox_toxic_cloud',
      name: 'Toxic Cloud',
      description: 'Hurl a vial that shatters into a poisonous cloud, damaging and debuffing all enemies in the area.',
      spellType: 'ACTION',
      icon: 'spell_nature_corrosivebreath',
      school: 'Alchemy',
      level: 4,
      specialization: 'venomancer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'sphere',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'duration',
        duration: 4,
        durationUnit: 'rounds'
      },

      resourceCost: {
        mana: 6,
        toxinVials: 3,
        actionPoints: 1,
        components: ['somatic', 'material'],
        somaticText: 'Throw vial at target location',
        materialText: 'Concentrated toxin vial'
      },

      savingThrow: {
        enabled: true,
        attribute: 'constitution',
        difficulty: 16,
        onSuccess: 'half_damage',
        onFailure: 'full_effect'
      },

      resolution: 'SAVING_THROW',

      damageConfig: {
        formula: '3d6 + intelligence',
        elementType: 'poison',
        damageType: 'area',
        attackType: 'spell_save',
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '3d6',
          duration: 4,
          tickFrequency: 'turn',
          isProgressiveDot: false
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 16,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },

      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{
          id: 'weakened',
          name: 'Weakened',
          description: '-2 to attack rolls, saves, and ability checks for 4 rounds',
          statModifier: {
            stat: 'all_rolls',
            magnitude: -2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 16,
        saveType: 'constitution',
        saveOutcome: 'halves',
        canBeDispelled: true
      },

      specialMechanics: {
        venomancerBonus: {
          enabled: true,
          effect: 'Venomancers add +1d6 damage per round and extend duration by 2 rounds (total 6 rounds)'
        },
        persistentCloud: {
          description: 'Cloud remains in place, affecting all creatures who enter or remain in the area'
        }
      },

      tags: ['aoe', 'poison', 'damage', 'debuff', 'dot', 'venomancer']
    },

    // ===== GADGETEER SPECIALIZATION =====
    {
      id: 'tox_poison_trap',
      name: 'Poison Gas Trap',
      description: 'Deploy a contraption that releases poison gas when enemies approach, damaging and slowing them.',
      spellType: 'ACTION',
      icon: 'inv_misc_enggizmos_27',
      school: 'Engineering',
      level: 2,
      specialization: 'gadgeteer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'sphere',
        aoeSize: 5
      },

      durationConfig: {
        durationType: 'duration',
        duration: 10,
        durationUnit: 'minutes'
      },

      resourceCost: {
        contraptionParts: 1,
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Deploy contraption on ground'
      },

      resolution: 'AUTOMATIC',

      damageConfig: {
        formula: '2d6 + intelligence',
        elementType: 'poison',
        damageType: 'direct',
        attackType: 'automatic'
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'slowed',
          name: 'Slowed',
          description: 'Movement speed reduced by 10 feet for 2 rounds',
          statusType: 'slowed',
          level: 'moderate'
        }],
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        canBeDispelled: true
      },

      specialMechanics: {
        gadgeteerBonus: {
          enabled: true,
          effect: 'Gadgeteers add +1d6 damage, +5ft trigger radius (total 10ft), and can deploy for 1 AP'
        },
        contraptionPersistence: {
          description: 'Trap remains active until triggered or 10 minutes pass'
        }
      },

      tags: ['trap', 'poison', 'damage', 'debuff', 'gadgeteer']
    },

    {
      id: 'tox_contraption_network',
      name: 'Contraption Network',
      description: 'Link all your active contraptions. When one triggers, all activate simultaneously for devastating combos.',
      spellType: 'ACTION',
      icon: 'inv_misc_enggizmos_30',
      school: 'Engineering',
      level: 5,
      specialization: 'gadgeteer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self',
        rangeDistance: 0
      },

      durationConfig: {
        durationType: 'duration',
        duration: 5,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 8,
        contraptionParts: 4,
        actionPoints: 1,
        components: ['somatic', 'verbal'],
        verbalText: 'Activate network protocol!',
        somaticText: 'Link contraptions with arcane energy'
      },

      resolution: 'AUTOMATIC',

      effects: {
        network: {
          description: 'All active contraptions are linked. When one triggers, all others activate simultaneously.',
          maxContraptions: 4,
          duration: '5 minutes'
        },
        chainReaction: {
          description: 'Enemies caught in multiple contraption effects take full damage from each and have disadvantage on all saves'
        }
      },

      specialMechanics: {
        gadgeteerBonus: {
          enabled: true,
          effect: 'Gadgeteers can link up to 5 contraptions (instead of 4) and network lasts 10 minutes'
        },
        tacticalSynergy: {
          description: 'Combine different contraption types for varied effects (poison + spike + acid = devastating combo)'
        }
      },

      tags: ['utility', 'contraption', 'combo', 'gadgeteer']
    },

    {
      id: 'tox_overcharged_trap',
      name: 'Overcharged Trap',
      description: 'Deploy a supercharged contraption that explodes with devastating force. The device is overcharged with volatile chemicals, creating a massive fireball that engulfs everything in the area. The explosion leaves enemies burned and crippled, their defenses shattered by the blast.',
      spellType: 'ACTION',
      icon: 'inv_misc_enggizmos_32',
      school: 'Engineering',
      level: 6,
      specialization: 'gadgeteer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'sphere',
        aoeSize: 15
      },

      durationConfig: {
        durationType: 'duration',
        duration: 10,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 10,
        contraptionParts: 3,
        actionPoints: 1,
        components: ['somatic', 'material'],
        somaticText: 'Deploy overcharged contraption',
        materialText: 'Enhanced contraption parts'
      },

      savingThrow: {
        enabled: true,
        attribute: 'agility',
        difficulty: 17,
        onSuccess: 'half_damage',
        onFailure: 'full_effect'
      },

      resolution: 'SAVING_THROW',

      damageConfig: {
        formula: '5d8 + intelligence',
        elementType: 'fire',
        damageType: 'area',
        attackType: 'spell_save',
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '1d6',
          duration: 3,
          tickFrequency: 'turn',
          isProgressiveDot: false
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 17,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },

      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{
          id: 'burned',
          name: 'Burned',
          description: 'Severely burned by the explosive force. Their armor is damaged and they continue to burn, taking fire damage over time as the flames consume them.',
          statModifier: {
            stat: 'armor',
            magnitude: -3,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        canBeDispelled: true
      },

      specialMechanics: {
        gadgeteerBonus: {
          enabled: true,
          effect: 'Gadgeteers add +2d8 damage and +5ft radius (total 20ft)'
        },
        explosiveForce: {
          description: 'The explosive force sends enemies flying backward and knocks them to the ground. The concussive blast is powerful enough to throw even the strongest foes off balance, though those with exceptional strength may resist being knocked down.'
        }
      },

      tags: ['trap', 'fire', 'damage', 'debuff', 'aoe', 'gadgeteer']
    },

    // ===== SABOTEUR SPECIALIZATION =====
    {
      id: 'tox_crippling_toxin',
      name: 'Crippling Toxin',
      description: 'Apply a debilitating poison that severely weakens the target, reducing their combat effectiveness.',
      spellType: 'ACTION',
      icon: 'ability_rogue_envelopingshadows',
      school: 'Alchemy',
      level: 3,
      specialization: 'saboteur',

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
        durationType: 'duration',
        duration: 5,
        durationUnit: 'rounds'
      },

      resourceCost: {
        toxinVials: 2,
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Apply crippling poison to weapon'
      },

      savingThrow: {
        enabled: true,
        attribute: 'constitution',
        difficulty: 16,
        onSuccess: 'half_penalties',
        onFailure: 'full_effect'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '1d8 + agility',
        elementType: 'poison',
        damageType: 'direct',
        attackType: 'weapon_attack'
      },

      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{
          id: 'crippled',
          name: 'Crippled',
          description: 'Severely crippled by the sabotage. Their attacks become clumsy and inaccurate, their armor is compromised, their movement is slowed, and they struggle to resist further effects. The sabotage has left them nearly helpless.',
          statModifier: {
            stat: 'attack_rolls',
            magnitude: -4,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 16,
        saveType: 'constitution',
        saveOutcome: 'halves',
        canBeDispelled: true
      },

      specialMechanics: {
        saboteurBonus: {
          enabled: true,
          effect: 'Saboteurs extend duration by 2 rounds (total 7 rounds) and debuffs require coin flip (heads) to dispel'
        },
        stackingDebuffs: {
          description: 'Can stack with other debuff effects for devastating combinations'
        }
      },

      tags: ['melee', 'poison', 'debuff', 'saboteur']
    },

    {
      id: 'tox_chaos_grenade',
      name: 'Chaos Grenade',
      description: 'Throw a grenade combining poison and explosives, dealing damage and causing confusion.',
      spellType: 'ACTION',
      icon: 'inv_misc_bomb_08',
      school: 'Alchemy',
      level: 5,
      specialization: 'saboteur',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'sphere',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'duration',
        duration: 2,
        durationUnit: 'rounds'
      },

      resourceCost: {
        mana: 7,
        toxinVials: 3,
        contraptionParts: 1,
        actionPoints: 1,
        components: ['somatic', 'material'],
        somaticText: 'Throw chaos grenade',
        materialText: 'Alchemical explosive'
      },

      savingThrow: {
        enabled: true,
        attribute: 'intelligence',
        difficulty: 17,
        onSuccess: 'damage_only',
        onFailure: 'full_effect'
      },

      resolution: 'SAVING_THROW',

      damageConfig: {
        formula: '2d8 + intelligence',
        elementType: 'poison',
        damageType: 'area',
        additionalDamage: {
          formula: '2d8',
          elementType: 'fire'
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 17,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },

      controlConfig: {
        controlType: 'mind_control',
        duration: 2,
        durationUnit: 'rounds',
        saveDC: 17,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'confused',
          name: 'Confused',
          description: 'Attack random target (ally or enemy) for 2 rounds',
          config: {
            confusionType: 'random_target'
          }
        }]
      },

      specialMechanics: {
        saboteurBonus: {
          enabled: true,
          effect: 'Saboteurs extend confusion duration by 1 round and add -2 to all saves for affected enemies'
        },
        randomTargeting: {
          description: 'Confused enemies roll 1d8 to determine attack target (1-4 = ally, 5-8 = enemy)'
        }
      },

      tags: ['aoe', 'poison', 'fire', 'damage', 'confusion', 'saboteur']
    },

    {
      id: 'tox_total_shutdown',
      name: 'Total Shutdown',
      description: 'Completely debilitate a target, rendering them helpless for a short duration.',
      spellType: 'ACTION',
      icon: 'spell_shadow_mindsteal',
      school: 'Alchemy',
      level: 7,
      specialization: 'saboteur',

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
        durationType: 'duration',
        duration: 2,
        durationUnit: 'rounds'
      },

      resourceCost: {
        mana: 12,
        toxinVials: 4,
        contraptionParts: 2,
        actionPoints: 1,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Total system failure!',
        somaticText: 'Inject shutdown toxin',
        materialText: 'Rare neurotoxin compound'
      },

      savingThrow: {
        enabled: true,
        attribute: 'constitution',
        difficulty: 19,
        onSuccess: 'reduced_duration',
        onFailure: 'full_effect'
      },

      resolution: 'SAVING_THROW',

      controlConfig: {
        controlType: 'incapacitation',
        duration: 2,
        durationUnit: 'rounds',
        saveDC: 19,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'total_shutdown',
          name: 'Total Shutdown',
          description: 'Cannot take actions or reactions, armor reduced to 0, automatically fail all saves, vulnerable to all damage types',
          statusType: 'incapacitated',
          level: 'severe'
        }]
      },

      specialMechanics: {
        saboteurBonus: {
          enabled: true,
          effect: 'Saboteurs increase save DC by +2 (total DC 21) and target takes 2d10 poison damage per round while incapacitated'
        },
        ultimateDebuff: {
          description: 'This is the ultimate debuff ability - use strategically on high-priority targets'
        }
      },

      tags: ['single-target', 'debuff', 'incapacitate', 'ultimate', 'saboteur']
    },

    // ===== UNIVERSAL ABILITIES =====
    {
      id: 'tox_apply_poison',
      name: 'Apply Weapon Poison',
      description: 'Apply a poison to your weapon for 1 AP. The poison lasts for 3 attacks or until end of combat.',
      spellType: 'ACTION',
      icon: 'inv_potion_24',
      school: 'Alchemy',
      level: 1,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self',
        rangeDistance: 0
      },

      durationConfig: {
        durationType: 'special',
        duration: 3,
        durationUnit: 'attacks'
      },

      resourceCost: {
        toxinVials: 1,
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Apply poison to weapon'
      },

      resolution: 'AUTOMATIC',

      effects: {
        weaponEnhancement: {
          duration: '3 attacks or end of combat',
          poisonTypes: [
            'Neurotoxin (+1d8 poison, -2 attack)',
            'Hemotoxin (1d6/round for 3 rounds)',
            'Cytotoxin (2d6 necrotic, -1d4 max HP)',
            'Myotoxin (1d6 poison, -10ft movement)',
            'Cardiotoxin (2d8 poison, stun on failed save)'
          ],
          description: 'Choose one poison type when applying'
        }
      },

      specialMechanics: {
        quickCrafting: {
          description: 'Can be used for 1 AP, allowing you to apply poison and attack in the same turn'
        },
        poisonChoice: {
          description: 'Choose from 5 different poison types based on tactical needs'
        }
      },

      tags: ['utility', 'poison', 'weapon-enhancement', 'universal']
    },

    {
      id: 'tox_antidote',
      name: 'Antidote',
      description: 'Quickly craft and administer an antidote to cure poison or disease.',
      spellType: 'ACTION',
      icon: 'inv_potion_54',
      school: 'Alchemy',
      level: 1,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        rangeDistance: 5
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        toxinVials: 1,
        actionPoints: 1,
        components: ['somatic', 'material'],
        somaticText: 'Administer antidote',
        materialText: 'Purifying reagents'
      },

      resolution: 'AUTOMATIC',

      utilityConfig: {
        utilityType: 'cure',
        cures: ['poison', 'disease'],
        description: 'Cure all poison and disease effects'
      },

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'poison_resistance',
          name: 'Poison Resistance',
          description: '+2 to Constitution saves vs poison for 1 hour',
          statModifier: {
            stat: 'constitution_saves',
            magnitude: 2,
            magnitudeType: 'flat',
            condition: 'vs_poison'
          }
        }],
        durationValue: 1,
        durationType: 'hours',
        durationUnit: 'hours',
        canBeDispelled: false
      },

      specialMechanics: {
        emergencyHealing: {
          description: 'Can be used on self or allies for 1 AP for quick emergency response'
        },
        preventative: {
          description: 'Grants temporary poison resistance even if target is not currently poisoned'
        }
      },

      tags: ['utility', 'healing', 'cure', 'universal']
    },

    {
      id: 'tox_explosive_concoction',
      name: 'Explosive Concoction',
      description: 'Throw an explosive concoction that deals fire damage in an area.',
      spellType: 'ACTION',
      icon: 'inv_misc_bomb_05',
      school: 'Alchemy',
      level: 3,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'sphere',
        aoeSize: 10
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        toxinVials: 3,
        components: ['somatic', 'material'],
        somaticText: 'Throw explosive vial',
        materialText: 'Volatile alchemical mixture'
      },

      savingThrow: {
        enabled: true,
        attribute: 'agility',
        difficulty: 15,
        onSuccess: 'half_damage',
        onFailure: 'full_damage'
      },

      resolution: 'SAVING_THROW',

      damageConfig: {
        formula: '3d8 + intelligence',
        elementType: 'fire',
        damageType: 'area',
        attackType: 'spell_save',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 15,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },

      specialMechanics: {
        versatileUse: {
          description: 'Can be used for damage, destroying obstacles, or creating environmental hazards'
        },
        craftingSpeed: {
          description: 'Crafted and thrown as a single action'
        }
      },

      tags: ['aoe', 'fire', 'damage', 'explosive', 'universal']
    },

    {
      id: 'tox_smoke_bomb',
      name: 'Smoke Bomb',
      description: 'Deploy a smoke bomb that obscures vision and provides cover.',
      spellType: 'ACTION',
      icon: 'ability_rogue_smoke',
      school: 'Alchemy',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 20,
        aoeType: 'sphere',
        aoeSize: 15
      },

      durationConfig: {
        durationType: 'duration',
        duration: 3,
        durationUnit: 'rounds'
      },

      resourceCost: {
        toxinVials: 1,
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Throw smoke bomb'
      },

      resolution: 'AUTOMATIC',

      effects: {
        obscurement: {
          type: 'heavy_obscurement',
          radius: 15,
          duration: '3 rounds',
          description: 'Area is heavily obscured, blocking vision'
        },
        tactical: {
          effects: [
            'Attacks through smoke have disadvantage',
            'Can use to escape or reposition',
            'Provides cover for allies'
          ],
          description: 'Creates tactical opportunities by manipulating the battlefield terrain and enemy positioning, allowing for strategic advantages in combat.'
        }
      },

      specialMechanics: {
        quickDeployment: {
          description: 'Deployed for 1 AP, allowing you to create cover and take other actions'
        },
        versatileUtility: {
          description: 'Use for escape, repositioning, protecting allies, or disrupting enemy vision'
        }
      },

      tags: ['utility', 'obscurement', 'tactical', 'universal']
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    {
      id: 'tox_pandemic',
      name: 'Pandemic',
      description: 'Release a devastating plague that spreads between enemies, dealing damage and applying debilitating effects.',
      level: 8,
      spellType: 'ACTION',
      icon: 'spell_shadow_plaguecloud',
      specialization: 'venomancer',

      typeConfig: {
        school: 'necromancy',
        icon: 'spell_shadow_plaguecloud',
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
        resourceTypes: ['mana', 'toxinVials'],
        resourceValues: { mana: 45, toxinVials: 3 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Release plague vial'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '6d8 + intelligence',
        elementType: 'poison',
        damageType: 'persistent',
        spreadMechanic: 'Spreads to enemies within 10 feet at start of their turn',
        criticalConfig: {
          critType: 'effect',
          critEffects: ['pandemic_spread']
        }
      },

      debuffConfig: {
        debuffType: 'disease',
        effects: [{
          id: 'pandemic_plague',
          name: 'Pandemic Plague',
          description: 'Takes poison damage at start of turn. Spreads to nearby enemies. -4 to Constitution.',
          damageFormula: '3d8'
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'constitution',
        saveOutcome: 'halves_damage'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['damage', 'debuff', 'spreading', 'poison', 'level-8', 'toxicologist']
    },

    {
      id: 'tox_mechanical_monstrosity',
      name: 'Mechanical Monstrosity',
      description: 'Deploy a massive mechanical construct that fights alongside you.',
      level: 8,
      spellType: 'ACTION',
      icon: 'inv_misc_enggizmos_30',
      specialization: 'gadgeteer',

      typeConfig: {
        school: 'conjuration',
        icon: 'inv_misc_enggizmos_30',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 55 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Activate construct'
      },

      resolution: 'NONE',
      effectTypes: ['summoning'],

      summonConfig: {
        creatures: [{
          id: 'mechanical_monstrosity',
          name: 'Mechanical Monstrosity',
          description: 'A large mechanical construct armed with weapons',
          size: 'Large',
          type: 'construct',
          stats: {
            maxHp: 80,
            armor: 18,
            maxMana: 0
          },
          config: {
            quantity: 1,
            duration: 5,
            durationUnit: 'rounds',
            hasDuration: true,
            concentration: false,
            controlType: 'mental',
            abilities: 'Can attack for 4d10 damage or launch missiles for 3d8 damage in 15ft radius'
          }
        }],
        duration: 5,
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 6
      },

      tags: ['summoning', 'construct', 'level-8', 'toxicologist']
    },

    {
      id: 'tox_sabotage_supreme',
      name: 'Sabotage Supreme',
      description: 'Apply devastating sabotage to multiple enemies, reducing their effectiveness dramatically.',
      level: 8,
      spellType: 'ACTION',
      icon: 'ability_rogue_dismantle',
      specialization: 'saboteur',

      typeConfig: {
        school: 'enchantment',
        icon: 'ability_rogue_dismantle',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 50 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Trigger sabotage devices'
      },

      resolution: 'NONE',
      effectTypes: ['debuff'],

      debuffConfig: {
        debuffType: 'sabotage',
        effects: [{
          id: 'supreme_sabotage',
          name: 'Supreme Sabotage',
          description: 'Enemies deal half damage, have -5 to hit, and all their gear malfunctions'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'agility',
        saveOutcome: 'halves_duration'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['debuff', 'aoe', 'sabotage', 'level-8', 'toxicologist']
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    {
      id: 'tox_extinction_toxin',
      name: 'Extinction Toxin',
      description: 'Deploy the ultimate poison that can kill even the most resilient creatures.',
      level: 9,
      spellType: 'ACTION',
      icon: 'spell_shadow_deathcoil',
      specialization: 'venomancer',

      typeConfig: {
        school: 'necromancy',
        icon: 'spell_shadow_deathcoil',
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
        resourceTypes: ['mana', 'toxinVials'],
        resourceValues: { mana: 70, toxinVials: 5 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Inject extinction toxin'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '15d8 + intelligence * 2',
        elementType: 'poison',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 20,
          saveOutcome: 'halves'
        },
        specialRules: 'Ignores poison immunity. Creatures with poison resistance take full damage.',
        criticalConfig: {
          critType: 'effect',
          critEffects: ['instant_death', 'poison_immunity_break']
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['damage', 'poison', 'ultimate', 'level-9', 'toxicologist']
    },

    {
      id: 'tox_war_machine',
      name: 'War Machine',
      description: 'Deploy a devastating war machine that dominates the battlefield.',
      level: 9,
      spellType: 'ACTION',
      icon: 'inv_misc_enggizmos_27',
      specialization: 'gadgeteer',

      typeConfig: {
        school: 'conjuration',
        icon: 'inv_misc_enggizmos_27',
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 80 },
        actionPoints: 3,
        components: ['somatic'],
        somaticText: 'Deploy war machine'
      },

      resolution: 'NONE',
      effectTypes: ['summoning'],

      summonConfig: {
        creatures: [{
          id: 'war_machine',
          name: 'War Machine',
          description: 'A massive war machine bristling with weapons',
          size: 'Huge',
          type: 'construct',
          stats: {
            maxHp: 150,
            armor: 22,
            maxMana: 0
          },
          config: {
            quantity: 1,
            duration: 5,
            durationUnit: 'rounds',
            hasDuration: true,
            concentration: false,
            controlType: 'mental',
            abilities: 'Can attack for 6d10 damage, launch artillery for 8d8 in 30ft radius, or deploy shields for +5 AC to allies'
          }
        }],
        duration: 5,
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['summoning', 'construct', 'ultimate', 'level-9', 'toxicologist']
    },

    {
      id: 'tox_total_system_failure',
      name: 'Total System Failure',
      description: 'Cause catastrophic failure in all enemy defenses and abilities.',
      level: 9,
      spellType: 'ACTION',
      icon: 'ability_rogue_wrongfullyaccused',
      specialization: 'saboteur',

      typeConfig: {
        school: 'enchantment',
        icon: 'ability_rogue_wrongfullyaccused',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 90,
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 75 },
        actionPoints: 3,
        components: ['somatic'],
        somaticText: 'Trigger total failure'
      },

      resolution: 'NONE',
      effectTypes: ['debuff'],

      debuffConfig: {
        debuffType: 'system_failure',
        effects: [{
          id: 'total_system_failure',
          name: 'Total System Failure',
          description: 'All enemy magical items stop working. All buffs are removed. Cannot cast spells for 1 round. -10 AC.'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 19,
        saveType: 'spirit',
        saveOutcome: 'halves_duration'
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['debuff', 'aoe', 'dispel', 'ultimate', 'level-9', 'toxicologist']
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    {
      id: 'tox_apocalypse_plague',
      name: 'Apocalypse Plague',
      description: 'Unleash a plague of biblical proportions that devastates everything it touches.',
      level: 10,
      spellType: 'ACTION',
      icon: 'spell_shadow_plaguecloud',
      specialization: 'universal',

      typeConfig: {
        school: 'necromancy',
        icon: 'spell_shadow_plaguecloud',
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 100 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'toxinVials'],
        resourceValues: { mana: 100, toxinVials: 'all' },
        actionPoints: 3,
        components: ['somatic'],
        somaticText: 'Release the apocalypse plague'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '20d8 + intelligence * 3',
        elementType: 'poison',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 22,
          saveOutcome: 'halves'
        },
        criticalConfig: {
          critType: 'effect',
          critEffects: ['apocalypse_stun', 'plague_worldwide']
        }
      },

      debuffConfig: {
        debuffType: 'plague',
        effects: [{
          id: 'apocalypse_plague',
          name: 'Apocalypse Plague',
          description: 'All enemies are poisoned, weakened, and take ongoing damage. Spreads infinitely between enemies.'
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes'
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['damage', 'debuff', 'aoe', 'ultimate', 'level-10', 'toxicologist']
    },

    {
      id: 'tox_mechanical_army',
      name: 'Mechanical Army',
      description: 'Deploy an entire army of mechanical constructs to overwhelm the battlefield.',
      level: 10,
      spellType: 'ACTION',
      icon: 'inv_misc_enggizmos_25',
      specialization: 'gadgeteer',

      typeConfig: {
        school: 'conjuration',
        icon: 'inv_misc_enggizmos_25',
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 100 },
        actionPoints: 3,
        components: ['somatic'],
        somaticText: 'Activate mechanical army'
      },

      resolution: 'NONE',
      effectTypes: ['summoning'],

      summonConfig: {
        creatures: [{
          id: 'mechanical_soldier',
          name: 'Mechanical Soldier',
          description: 'A combat-ready mechanical soldier',
          size: 'Medium',
          type: 'construct',
          stats: {
            maxHp: 40,
            armor: 16,
            maxMana: 0
          },
          config: {
            quantity: 8,
            duration: 5,
            durationUnit: 'rounds',
            hasDuration: true,
            concentration: false,
            controlType: 'autonomous',
            abilities: 'Attacks for 2d10 damage each'
          }
        }],
        duration: 5,
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['summoning', 'army', 'construct', 'ultimate', 'level-10', 'toxicologist']
    },

    {
      id: 'tox_reality_bomb',
      name: 'Reality Bomb',
      description: 'Deploy the ultimate sabotage device - a bomb that disrupts the fabric of reality itself.',
      level: 10,
      spellType: 'ACTION',
      icon: 'spell_shadow_unstableaffliction_3',
      specialization: 'saboteur',

      typeConfig: {
        school: 'transmutation',
        icon: 'spell_shadow_unstableaffliction_3',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 120,
        aoeShape: 'circle',
        aoeParameters: { radius: 50 }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 100 },
        actionPoints: 3,
        components: ['somatic'],
        somaticText: 'Detonate reality bomb'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '15d10 + intelligence * 2',
        elementType: 'force',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 22,
          saveOutcome: 'halves'
        }
      },

      specialMechanics: {
        realityBomb: {
          description: 'All magic in the area is suppressed for 1 minute. All creatures are disoriented (disadvantage on all rolls for 1 round). Terrain becomes unstable.',
          antiMagic: true,
          duration: '1 minute'
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['damage', 'control', 'anti-magic', 'ultimate', 'level-10', 'toxicologist']
    },

    // ADDITIONAL LEVEL 1 SPELLS
    {
      id: 'tox_poison_dart',
      name: 'Poison Dart',
      description: 'Fire a poison dart that deals 1d6 poison damage and applies minor poison.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'conjuration',
        icon: 'inv_throwingknife_04',
        tags: ['damage', 'poison', 'dart', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: ['enemy'],
        maxTargets: 1
      },

      damageConfig: {
        formula: '1d6',
        elementType: 'poison',
        damageType: 'direct'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 10
        },
        actionPoints: 1
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      resolution: 'DICE',
      tags: ['damage', 'poison', 'dart', 'universal']
    },

    {
      id: 'tox_toxic_cloud',
      name: 'Toxic Cloud',
      description: 'Create a small toxic cloud that deals 1d4 poison damage to enemies in a 10-foot radius.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'conjuration',
        icon: 'spell_shadow_plaguecloud',
        tags: ['damage', 'poison', 'zone', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeShape: 'circle',
        aoeParameters: { radius: 10 }
      },

      damageConfig: {
        formula: '1d4',
        elementType: 'poison',
        damageType: 'area'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 10
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      resolution: 'DICE',
      tags: ['damage', 'poison', 'zone', 'universal']
    },

    {
      id: 'tox_antidote',
      name: 'Antidote',
      description: 'Create an antidote that removes all poison effects from an ally.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['purification'],

      typeConfig: {
        school: 'restoration',
        icon: 'inv_potion_53',
        tags: ['purification', 'healing', 'antidote', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        rangeDistance: 5,
        targetRestrictions: ['ally'],
        maxTargets: 1
      },

      purificationConfig: {
        purificationType: 'cleanse',
        cleansesTypes: ['poison'],
        dispelStrength: 'moderate'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 10
        },
        actionPoints: 1,
        components: ['verbal', 'somatic', 'material']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      resolution: 'DICE',
      tags: ['purification', 'healing', 'antidote', 'universal']
    },

    // ADDITIONAL LEVEL 3 SPELLS
    {
      id: 'tox_venom_strike',
      name: 'Venom Strike',
      description: 'Strike with concentrated venom that deals poison damage.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'necromancy',
        icon: 'ability_creature_poison_06',
        tags: ['damage', 'poison', 'venom', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: ['enemy'],
        maxTargets: 1
      },

      damageConfig: {
        formula: '4d8',
        elementType: 'poison',
        damageType: 'direct'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 18
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      resolution: 'DICE',
      tags: ['damage', 'poison', 'venom', 'universal']
    },

    {
      id: 'tox_toxic_shock',
      name: 'Toxic Shock',
      description: 'Shock an enemy with concentrated toxins, stunning them and dealing poison damage.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],

      typeConfig: {
        school: 'necromancy',
        icon: 'spell_shadow_deathscream',
        tags: ['damage', 'poison', 'control', 'stun', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemy'],
        maxTargets: 1
      },

      damageConfig: {
        formula: '3d6',
        elementType: 'poison',
        damageType: 'direct'
      },

      controlConfig: {
        controlType: 'incapacitation',
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 15,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'toxic_shock',
          name: 'Toxic Shock',
          description: 'Stunned by toxins - cannot act for 1 round',
          config: {
            stunType: 'toxic'
          }
        }]
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 18
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      resolution: 'DICE',
      tags: ['damage', 'poison', 'control', 'stun', 'universal']
    },

    // ADDITIONAL LEVEL 4 SPELL
    {
      id: 'tox_poison_bomb',
      name: 'Poison Bomb',
      description: 'Throw a poison bomb that explodes, dealing poison damage to all enemies in a radius.',
      level: 4,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'conjuration',
        icon: 'inv_misc_orb_05',
        tags: ['damage', 'poison', 'aoe', 'bomb', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 40,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemy']
      },

      damageConfig: {
        formula: '5d8',
        elementType: 'poison',
        damageType: 'area',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 16,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 22
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      resolution: 'DICE',
      tags: ['damage', 'poison', 'aoe', 'bomb', 'universal']
    },

    // ADDITIONAL LEVEL 5 SPELL
    {
      id: 'tox_deadly_toxin',
      name: 'Deadly Toxin',
      description: 'Apply a deadly toxin that deals poison damage over time.',
      level: 5,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'necromancy',
        icon: 'ability_creature_poison_05',
        tags: ['damage', 'poison', 'dot', 'deadly', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: ['enemy'],
        maxTargets: 1
      },

      damageConfig: {
        formula: '6d10',
        elementType: 'poison',
        damageType: 'direct',
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '1d10',
          duration: 5,
          tickFrequency: 'turn',
          isProgressiveDot: false
        }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 28
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      resolution: 'DICE',
      tags: ['damage', 'poison', 'dot', 'deadly', 'universal']
    },

    // ADDITIONAL LEVEL 6 SPELL
    {
      id: 'tox_toxic_wave',
      name: 'Toxic Wave',
      description: 'Send a wave of toxic energy that deals poison damage to all enemies in a line.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'evocation',
        icon: 'spell_nature_acid_01',
        tags: ['damage', 'poison', 'line', 'wave', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'line',
        aoeParameters: { length: 60, width: 10 },
        targetRestrictions: ['enemy']
      },

      damageConfig: {
        formula: '7d8',
        elementType: 'poison',
        damageType: 'area',
        criticalConfig: {
          critType: 'effect',
          critEffects: ['poison_burn']
        }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 35
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      resolution: 'DICE',
      tags: ['damage', 'poison', 'line', 'wave', 'universal']
    },

    // ADDITIONAL LEVEL 7 SPELL
    {
      id: 'tox_virulent_plague',
      name: 'Virulent Plague',
      description: 'Release a virulent plague that spreads between enemies, dealing poison damage.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'necromancy',
        icon: 'spell_shadow_contagion',
        tags: ['damage', 'poison', 'spreading', 'plague', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'chain',
        rangeType: 'ranged',
        rangeDistance: 50,
        targetRestrictions: ['enemy'],
        maxTargets: 6,
        chainDistance: 20
      },

      damageConfig: {
        formula: '8d8',
        elementType: 'poison',
        damageType: 'direct',
        criticalConfig: {
          critType: 'effect',
          critEffects: ['plague_spread']
        }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 45
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 6
      },

      resolution: 'DICE',
      tags: ['damage', 'poison', 'spreading', 'plague', 'universal']
    }
  ]
};

export default TOXICOLOGIST_DATA;




