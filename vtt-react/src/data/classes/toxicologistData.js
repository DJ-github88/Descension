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
  damageTypes: ['poison', 'necrotic'],

  // Overview Section
  overview: {
    title: 'The Toxicologist',
    subtitle: 'Master of Poisons, Concoctions, and Contraptions',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: Toxicologists wield a dual-resource alchemy system—spending Toxin Vials to craft deadly poisons and mid-combat concoctions, while deploying Contraption Parts as battlefield devices that control enemy movement and create tactical advantages.

**Core Mechanic**: Manage Toxin Vials → Craft Poisons & Concoctions Mid-Combat → Deploy Contraption Parts → Stack Debuffs and Control the Battlefield

**Resource**: Toxin Vials (INT mod + 3, min 4) & Contraption Parts (max 5)

**Playstyle**: Tactical alchemical preparation and adaptation

**Best For**: Players who love pre-combat planning, mid-fight crafting, and weaving poisons with gadgets into lethal synergies`
    },

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
- **Contraption Parts**: Max 5, recovered after combat (reclaimed); destroyed contraptions recover 1 part per short rest
- **Weapon Poisons**: 1 vial each, quick-apply to weapon for 3 attacks
- **Brewed Concoctions**: 1-3 vials, more powerful crafted items
- **Part Costs**: 1-2 per contraption
- **Strategy**: Balance poison crafting with contraption deployment

**Weapon Poisons** (1 vial each, applied to weapon, lasts 3 attacks):
- **Neurotoxin**: +1d8 poison damage, -2 to attack rolls for 2 rounds
- **Hemotoxin**: +1d6 poison damage/round for 3 rounds (bleeding DoT)
- **Cytotoxin**: +2d6 necrotic damage, -1d4 max HP (temporary)
- **Myotoxin**: +1d6 poison damage, -10ft movement, disadvantage on STR checks
- **Cardiotoxin**: +2d8 poison damage, stunned 1 round on failed CON save (DC 16)

**Contraption Deployment** (Uses Contraption Parts, deployed as an action):
- **Poison Gas Trap** (1 part): 2d6 poison damage, -10ft movement, triggered when enemy enters 5ft radius
- **Spike Trap** (1 part): 3d6 piercing damage, immobilized 1 round (DC 14 DEX save)
- **Healing Mist Dispenser** (2 parts): Heal 1d8 HP, remove 1 poison/disease when ally enters
- **Smoke Grenade Launcher** (1 part): 15ft smoke cloud, obscures vision for 3 rounds
- **Acid Sprayer** (2 parts): 2d8 poison damage, -3 armor for 3 rounds
- **Alarm Bell** (1 part): Alert allies, +2 initiative for allies within 30ft

**Concoction Crafting** (Mid-Combat, 1 AP each):
- **Antidote** (1 vial): Cure poison/disease, +2 CON saves vs poison for 1 hour
- **Explosive Concoction** (3 vials): 3d8 fire damage in 10ft radius (DEX save DC 15)
- **Smoke Bomb** (1 vial): 15ft smoke cloud, obscures vision for 3 rounds
- **Healing Mist** (2 vials): Heal 2d6 HP to all allies in 10ft radius

**Specialization Synergies**:
- **Venomancer**: +1d6 poison damage on all effects, poison duration +2 rounds
- **Gadgeteer**: Deploy contraptions for 1 AP instead of an action, +1 contraption part max, contraptions deal +1d6 damage
- **Saboteur**: Debuffs last +2 rounds, enemies affected by your poisons/contraptions have -2 to all saves

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

*This example assumes you have 1 minute of pre-combat preparation to deploy contraptions before initiative is rolled.*

**Starting State**: Toxin Vials: 7/7 | Contraption Parts: 5/5 | Mana: 40/50 | HP: 50/50 | Weapon Poison: None

**Pre-Combat - Setting the Trap (Parts: 5 → 3)**

*Five bandits and their leader approach. You smile. They're walking into YOUR laboratory.*

**Action**: Deploy "Spike Trap" at the choke point (1 contraption part)
**Effect**: 3d6 piercing damage when triggered, target immobilized 1 round (DC 14 DEX save)

*You place a concealed spike trap at the choke point where enemies must pass through.*

**Contraption Parts**: 5 - 1 = **4/5**

**Action**: Deploy "Poison Gas Trap" behind the spikes (2 contraption parts)
**Effect**: When triggered, releases poison cloud (5ft radius, 2d6 poison damage, -10ft movement for 2 rounds)

*You place a small device on the ground. When an enemy steps on it, it will release a devastating poison cloud.*

**Contraption Parts**: 4 - 2 = **2/5**

**Your Party's Tank**: "What are all these... devices?"
**You**: "Contraptions. A spike trap at the choke point. A poison gas trap behind it. Once combat starts, I'll coat my blade with Neurotoxin. Let them come."

**Current State**: Vials: 7/7 | Parts: 2/5 | Mana: 40/50 | Weapon: None

**Turn 1 - Opening Strike (Vials: 7 → 3)**

*Roll initiative. The bandits charge. Two of them trigger the spike trap. One stumbles into the poison gas trap.*

**Bandits #1, #2**: Trigger Spike Trap
**Damage**: 3d6 → [4, 5, 3] = 12 piercing damage each
**Save**: DC 14 DEX → Bandit #1 fails (immobilized 1 round), Bandit #2 succeeds (half damage = 6)

**Bandit #3**: Triggers Poison Gas Trap
**Effect**: Poison cloud erupts (5ft radius)
**Damage**: 2d6 → [5, 4] = 9 poison damage
**Effect**: -10ft movement for 2 rounds

**Bandits #3, #4** (adjacent): Caught in poison cloud, take 9 poison damage each

*The poison cloud ERUPTS. The bandits caught inside CHOKE and GASP.*

**Action (1 AP)**: Apply "Neurotoxin" to weapon (1 toxin vial)
**Effect**: Weapon attacks deal +1d8 poison damage, target has -2 to attack rolls for 2 rounds

*You coat your blade with a viscous green poison. It GLISTENS with toxicity.*

**Toxin Vials**: 7 - 1 = **6/7**

**Action**: Melee attack Bandit #1 (immobilized, has Neurotoxin on weapon)
**Attack Roll**: d20+5 → [16] = Hit!
**Base Damage**: 2d6+3 → [5, 4] + 3 = 12 slashing damage
**Neurotoxin**: +1d8 poison → [6] = +6 poison damage
**Total Damage**: 12 + 6 = **18 damage**
**Effect**: Bandit #1 has -2 to attack rolls for 2 rounds

**Bandit #1**: Takes 18 damage → HEAVILY DAMAGED

**Action (1 AP)**: Craft "Explosive Concoction" (3 toxin vials)
**Effect**: Throwable explosive, 3d8 fire damage in 10ft radius (DEX save DC 15 for half)

*You quickly mix chemicals from your vials. The concoction BUBBLES and SMOKES.*

**Toxin Vials**: 6 - 3 = **3/7**

**Your Party's Mage**: "You're crafting explosives MID-COMBAT?!"
**You**: "Explosive Concoction. Costs 3 toxin vials. I'll throw it next turn."

**Current State**: Vials: 3/7 | Parts: 2/5 | Mana: 40/50 | Weapon: Neurotoxin | Explosive ready

**Turn 2 - The Explosion (Vials: 3 → 2)**

*The poison cloud continues. Bandits #3 and #4 take another 9 poison damage.*

**Poison Cloud** (Turn 2 of 2): Bandits #3, #4 take 9 poison damage each
**Poison Cloud**: Expires after this turn

**Action**: Throw "Explosive Concoction" at grouped bandits (no additional cost, already crafted)
**Targets**: Bandits #2, #3, #4 (grouped together)
**Damage**: 3d8 fire → [7, 5, 6] = **18 fire damage each**
**Save**: Bandit #2 succeeds (9 damage), Bandit #3 fails (18 damage), Bandit #4 fails (18 damage)

*You hurl the concoction. It EXPLODES in a massive fireball.*

**Bandit #2**: Takes 9 fire damage (saved) + 6 from spike trap earlier = DAMAGED
**Bandit #3**: Takes 18 fire damage + 18 from poison cloud (2 turns) = **DEAD**
**Bandit #4**: Takes 18 fire damage + 18 from poison cloud (2 turns) = **DEAD**

**Your Party's Rogue**: "Two bandits down with ONE explosive and the gas trap!"
**You**: "Explosive Concoction plus Poison Gas Trap synergy. They were grouped perfectly."

**Action (1 AP)**: Apply "Cytotoxin" to weapon (1 toxin vial)
**Effect**: Weapon attacks deal +2d6 necrotic damage, -1d4 max HP (temporary)

*You coat your blade with a BLACK poison that seems to absorb light.*

**Toxin Vials**: 3 - 1 = **2/7**

**Current State**: Vials: 2/7 | Parts: 2/5 | Mana: 40/50 | Weapon: Cytotoxin

**Turn 3 - Finishing Touches (Vials: 2 → 0)**

*Only Bandit #1, #2, #5, and the Leader remain.*

**Action**: Melee attack Bandit #1 (has Cytotoxin on weapon)
**Attack Roll**: d20+5 → [17] = Hit!
**Base Damage**: 2d6+3 → [6, 5] + 3 = 14 slashing damage
**Cytotoxin**: +2d6 necrotic → [5, 4] = +9 necrotic damage
**Total Damage**: 14 + 9 = **23 damage**
**Effect**: Bandit #1's max HP reduced by 4 (1d4 → [4])

**Bandit #1**: Takes 23 damage → **DEAD**

**Action (1 AP)**: Craft "Antidote" (1 toxin vial)
**Effect**: Cure poison/disease on ally, +2 CON saves vs poison for 1 hour

*You mix a healing concoction, just in case your Tank got hit by residual gas.*

**Toxin Vials**: 2 - 1 = **1/7**

**Your Party's Healer**: "You're almost out of vials!"
**You**: "I still have 1 vial left, and I'll regain 1d4 on a short rest. Plus my contraption parts come back after combat."

**Current State**: Vials: 1/7 | Parts: 2/5 | Mana: 40/50

**Turn 4 - Cleanup**

*Bandit #2, #5, and the Leader remain, all damaged from various sources.*

**Your Party's Tank**: Attacks Bandit #2 → DEAD
**Your Party's Mage**: Casts Magic Missile at Leader → HEAVILY DAMAGED
**Your Party's Rogue**: Attacks Bandit #5 → DEAD

**Action**: Melee attack Leader (still has Cytotoxin on weapon)
**Attack Roll**: d20+5 → [14] = Hit!
**Base Damage**: 2d6+3 → [4, 3] + 3 = 10 slashing damage
**Cytotoxin**: +2d6 necrotic → [6, 2] = +8 necrotic damage
**Total Damage**: 10 + 8 = **18 damage**

**Leader**: Takes 18 damage → **DEAD**

**Combat Over**

*You collect your contraption parts from the spike trap and poison gas trap (reusable — parts are recovered after combat).*

**Contraption Parts**: 2 + 3 (recovered) = **5/5** (back to max)

**Your Party's Rogue**: "You killed two bandits with the explosive + gas combo, poisoned the leader to death, and your weapon poisons dealt massive damage."
**You**: "Toxicologist gameplay. I deployed 2 contraptions before combat (1 part on spike trap, 2 parts on gas trap). I applied Neurotoxin (1 vial) and Cytotoxin (1 vial) to my weapon. I crafted an Explosive Concoction (3 vials) and an Antidote (1 vial). 6 vials spent, 1 remaining, and I recover all contraption parts after combat."

**Final State**: Vials: 1/7 (will regain 1d4 on short rest) | Parts: 5/5 (recovered) | Mana: 40/50 | HP: 50/50

**Damage Breakdown**:
- Neurotoxin (weapon): 6 poison damage to Bandit #1
- Cytotoxin (weapon): 9 + 8 = 17 necrotic damage
- Explosive Concoction: ~15 average fire damage × 3 bandits = ~45 total fire damage
- Poison Gas Trap: 9 poison damage/turn × 2 turns × 2 bandits = 36 total poison damage
- Spike Trap: ~9 average piercing damage × 2 bandits = ~18 total piercing damage
- **Grand Total**: ~122 damage from poisons, contraptions, and concoctions

**The Lesson**: Toxicologist gameplay is about:
1. **Pre-Combat Setup**: Deploy contraptions at choke points BEFORE initiative (spike trap, gas trap)
2. **Weapon Poison Application**: Switch between Neurotoxin (attack debuff) and Cytotoxin (max HP reduction) based on target
3. **Mid-Combat Crafting**: Craft Explosive Concoction (3 vials) and Antidote (1 vial) for 1 AP each
4. **Resource Management**: Spent 6 of 7 vials, recovered all contraption parts after combat
5. **Contraption Synergy**: Spike trap immobilized one bandit, gas trap dealt ongoing poison to grouped enemies
6. **Explosive + Gas Combo**: Explosive Concoction killed enemies already weakened by the gas trap

You're an ALCHEMIST WARRIOR who controls the battlefield through preparation and adaptation. You deploy contraptions (spike traps, gas traps) to control enemy movement BEFORE combat starts. You apply poisons to your weapon (Neurotoxin, Cytotoxin) for enhanced attacks. You craft concoctions MID-COMBAT (explosives, antidotes) to adapt to the situation. You're not a simple damage dealer—you're a TACTICAL ALCHEMIST who turns the battlefield into your laboratory.`
    }
  },

  // Resource System
  resourceSystem: {
    title: 'Alchemical Arsenal',
    subtitle: 'Toxin Vials & Contraption Parts',

    description: `The Toxicologist's unique mechanic revolves around managing two distinct resources: **Toxin Vials** (for crafting poisons and concoctions) and **Contraption Parts** (for deploying battlefield devices). This dual-resource system rewards strategic planning and tactical adaptation.

**Two Crafting Systems:**
- **Weapon Poisons** (1 vial, 1 AP): Quick-apply poisons to your weapon. Lasts 3 attacks or until end of combat. Choose from 5 poison types (Neurotoxin, Hemotoxin, Cytotoxin, Myotoxin, Cardiotoxin).
- **Brewed Concoctions** (1-3 vials, 1 AP): More powerful crafted items — Explosive Concoctions, Smoke Bombs, Antidotes, Healing Mist. These have stronger effects but higher vial costs.

**Active Contraption Limit:** A Toxicologist can have up to 3 active contraptions on the battlefield at once (Gadgeteer specialization: up to 4). Contraption parts are **recovered after combat** when you reclaim your devices — you do not lose parts permanently by deploying contraptions that survive the encounter. Destroyed or triggered consumable contraptions ( Explosive Mine) have their parts spent until recovered on rest.`,

    cards: [
      {
        title: 'Toxin Vials',
        stats: 'INT mod + 3 (min 4)',
        details: 'Spent to craft poisons, concoctions, and antidotes mid-combat. Crafting costs 1 AP. Recover 1d4 per short rest, full on long rest.'
      },
      {
        title: 'Contraption Parts',
        stats: 'Max 5',
        details: 'Deployed as battlefield traps and devices. Each contraption takes 1 action to place. Parts are recovered after combat when you reclaim your devices. Destroyed contraptions recover 1 part per short rest, all per long rest.'
      },
      {
        title: 'Poison Stacking',
        stats: 'Multiple Active',
        details: 'Different poisons can stack on the same target. A poisoned, bleeding, weakened, and armor-shredded enemy is your masterpiece.'
      }
    ],

    usage: {
      momentum: 'Open fights with an Explosive Concoction (3 vials) into grouped enemies, then apply weapon poison and start stacking debuffs. Pre-deployed contraptions at chokepoints mean the fight starts in your favor before initiative is rolled.',
      flourish: 'Craft reactively based on what the encounter demands. Healing Mist to save a dying ally, Smoke Bomb to break line of sight, or Antidote to counter an enemy poisoner. The best Toxicologists adapt their recipes to each fight rather than following a fixed script.'
    },

    overheatRules: {
      title: 'Vial Exhaustion & Contraption Burnout',
      content: `The Toxicologist's resources are finite within each rest cycle. Running dry at the wrong moment is the class's greatest vulnerability.

**Vial Exhaustion (0 Vials)**:
When you run out of vials, you lose your most powerful tool — mid-combat crafting. You can still attack with a poisoned weapon (if applied before running dry), but you cannot craft new concoctions or apply fresh poisons. You become a basic combatant with deployed contraptions as your only edge.

**Contraption Burnout (0 Parts)**:
No parts means no new traps. Existing contraptions remain active, but you cannot layer the battlefield further. In extended encounters, this severely limits your control options.

**Managing the Dual Drain**:
Both resources compete for your limited rest economy. Spending 3 vials on an Explosive Concoction AND 2 parts on a Spike Trap in the same fight can leave you depleted for the next encounter. The key is knowing when to go all-in and when to hold back.

**Recovery Planning**:
- **After Combat**: Reclaim undestroyed contraptions to recover their parts immediately.
- **Short Rest**: Recover 1d4 vials + 1 contraption part (for destroyed contraptions). Plan short rests when you are low on both resources.
- **Long Rest**: Full recovery. If you burned through everything in a boss fight, the long rest afterward resets you completely.
- **Pacing Rule of Thumb**: Spend no more than half your vials in any single non-boss encounter. Save the heavy recipes for fights that matter.`
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
          '2d6 poison damage, -2 armor for 2 rounds',
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
          '2d8 poison damage, -3 armor for 3 rounds',
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
          'Gadgeteer: Also -1 Armor'
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
      title: 'Alchemical Warfare Tactics',
      content: `**Pre-Combat Preparation (Before Initiative)**:
Deploy contraptions at chokepoints and high-traffic areas before the fight begins. A Poison Gas Trap at a doorway and a Spike Trap behind cover can carry an entire encounter. You are the only class that gets stronger before initiative is even rolled — use every second.

**Opening Round (Establish the Debuff Web)**:
Apply weapon poison (1 AP) and throw an Explosive Concoction or Smoke Bomb at grouped enemies. Your goal in the first round is to get as many debuffs active as possible. Weakening Toxin + Corrosive Acid on the same target means they hit less often AND take more damage — the multiplicative effect is devastating.

**Mid-Combat (Reactive Crafting)**:
Craft concoctions reactively based on what the fight demands. Ally goes down? Healing Mist. Enemy caster is annoying? Smoke Bomb to obscure their line of sight. Getting swarmed? Acid Sprayer trap at your feet. Keep 1-2 vials in reserve at all times — the fight can always go sideways.

**Stack & Finish (The Kill Combo)**:
Stack Bleeding Venom + Weakening Toxin on priority targets for sustained damage and reduced accuracy. Against tanks, stack Corrosive Acid + Neurotoxin for armor shredding + attack debuff. Against bosses, lead with Cardiotoxin (stun on failed save) then follow up with your highest-damage poison while they can't fight back.

**Contraption Layering**:
Place traps in sequence — Poison Gas Trap first (slows movement), then Spike Trap behind it (immobilizes slowed targets). Enemies trigger the gas, try to retreat, and hit the spikes. This combo alone can remove a minion from the fight for 2+ rounds.

**Vial Economy**:
You have limited vials. Explosive Concoctions (3 vials) are powerful but expensive. Early in a dungeon, lean on cheap 1-vial recipes (Weakening Toxin, Smoke Bomb). Save your vial-heavy plays for bosses. A short rest restores 1d4 vials — plan your rests around your vial count, not just your HP.`
    },

    playingInPerson: {
      title: 'Playing Toxicologist In Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `The Toxicologist is the most tactile class at the table. Vials, traps, poison tokens, and recipe cards make your turn a hands-on alchemy experience that everyone can see and track.

**Required Materials**:
- **Green Beads/Tokens** — Toxin Vials (INT mod + 3, min 4). Remove one each time you craft.
- **Gray Tokens** — Contraption Parts (max 5). Remove when deploying.
- **Colored Skull Tokens** — One per poison type to mark affected enemies (e.g., red = neurotoxin, blue = hemotoxin, purple = cytotoxin).
- **Index Cards** — Pre-write your top 5 recipes for fast reference during combat.
- **Miniature Markers** — Small dice or tokens to place on the grid where contraptions are deployed.

**Tracking Vials**:
- **Bead Method**: Keep green beads in a small pouch. Pull one out for each vial spent. Visual and tactile — the pouch getting lighter is a great tension builder.
- **d10 Method**: Use a d10 die showing your current vial count. Rotate after each craft. Fast and takes minimal table space.

**Tracking Contraptions**:
Place a d6 or small token on the grid square where each contraption is deployed. Write the contraption type on a sticky note and stick it next to the die so everyone knows what the trap does. When triggered, remove both the die and the note.

**Tracking Active Poisons on Enemies**:
Place colored tokens on enemy miniatures to show active poisons:
- **Red bead** = Neurotoxin (attack penalty)
- **Blue bead** = Hemotoxin (bleeding)
- **Purple bead** = Cytotoxin (armor reduction)
- **Green bead** = Myotoxin (movement penalty)
- **Black bead** = Cardiotoxin (stun risk)

Multiple beads on one mini = that enemy is suffering your full alchemical wrath.

**Quick Reference**:
\`\`\`
TOXICOLOGIST RESOURCES:
  Vials: INT mod + 3 (min 4) | Recover 1d4/short rest, full/long rest
  Parts: Max 5              | Recover 1/short rest, full/long rest
  Crafting: 1 AP per recipe

CHEAP RECIPES (1 vial): Weakening Toxin, Smoke Bomb, Antidote
MID RECIPES (2 vials): Corrosive Acid, Bleeding Venom, Healing Mist
EXPENSIVE (3 vials): Explosive Concoction

CHEAP CONTRAPTIONS (1 part): Gas Trap, Spike Trap, Smoke Grenade, Alarm Bell
HEAVY CONTRAPTIONS (2 parts): Healing Mist Dispenser, Acid Sprayer
\`\`\`

**The Physical Hacks**:
- **Recipe Deck**: Write each recipe on a small card. When you craft, physically discard the card into a "used" pile. At rest, shuffle them back in. Makes resource spending feel real.
- **The Poison Board**: Keep a small section of your character sheet dedicated to tracking which enemies have which poisons. Use checkboxes or a mini grid.
- **Contraption Map**: Before combat, physically place trap markers on the grid where you plan to deploy. This speeds up your turn and makes your battlefield control visible to allies.

**Pro Tips**:
- Tell your party what you're applying to which enemy. "I'm stacking neurotoxin and corrosive acid on the boss — he's at -2 to hit and -2 armor." This helps everyone play around your debuffs.
- Pre-write your "panic recipes" — the 1-vial concoctions you'd craft in an emergency (Antidote, Smoke Bomb). Keep them on a separate card for instant reference when things go wrong.
- Coordinate with your party's melee fighters. They benefit most from weapon poisons applied to their weapons — a Fighter with Corrosive Acid on their greatsword shreds boss armor.`
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
          description: 'All poison damage you deal is increased by +1d6. Poison effects you apply last 2 additional rounds. You have advantage on rolls to craft poisons.'
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
          description: 'All debuffs you apply last 2 additional rounds and require a DC 16 Spirit save to dispel (dispel attempts use the higher of caster\'s spell DC or DC 16). Enemies affected by your poisons or contraptions have -2 to all saves and skill checks.'
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
            effect: 'Target enemy is severely debilitated. They cannot take actions for 1 round (reactions only), have -3 armor, and have disadvantage on all saves. DC 19 CON save to reduce to: no action penalty, -1 armor, and disadvantage on saves for 1 round only.'
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
      icon: 'Poison/Poison Concoction',
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
        durationType: 'rounds',
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
        damageTypes: ['direct'],
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
        },
          resolution: 'DICE',
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'poisoned',
          name: 'Poisoned',
          description: 'Disadvantage on attack rolls and ability checks for 4 rounds',
          statusType: 'poisoned',
          level: 'moderate',
          statPenalty: [{ stat: 'attack', value: -99, magnitudeType: 'disadvantage' }, { stat: 'ability_checks', value: -99, magnitudeType: 'disadvantage' }],
          mechanicsText: 'Disadvantage on attack rolls and ability checks for 4 rounds'
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
      icon: 'Poison/Acid Spray',
      school: 'Alchemy',
      level: 4,
      specialization: 'venomancer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'sphere',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 4,
        durationUnit: 'rounds'
      },

      resourceCost: {
        mana: 12,
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
        formula: '5d6 + intelligence',
        elementType: 'poison',
        damageTypes: ['area'],
        attackType: 'spell_save',
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '2d6',
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
        },
          resolution: 'DICE',
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
      icon: 'Utility/Utility Tool',
      school: 'Engineering',
      level: 2,
      specialization: 'gadgeteer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'sphere',
        aoeSize: 5
      },

      durationConfig: {
        durationType: 'rounds',
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
        damageTypes: ['direct'],
        attackType: 'automatic',
          resolution: 'DICE',
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'slowed',
          name: 'Slowed',
          description: 'Movement speed reduced by 10 feet for 2 rounds',
          statusType: 'slowed',
          level: 'moderate',
          statPenalty: { stat: 'movement_speed', value: -10 },
          movementPenalty: -10
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
      icon: 'Utility/Utility Tool',
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
        durationType: 'rounds',
        duration: 5,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 15,
        contraptionParts: 4,
        actionPoints: 2,
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
      description: 'Deploy a supercharged contraption that explodes in a 15ft radius, dealing fire damage, reducing armor, and leaving a burning DoT.',
      spellType: 'ACTION',
      icon: 'Utility/Utility Tool',
      school: 'Engineering',
      level: 6,
      specialization: 'gadgeteer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'sphere',
        aoeSize: 15
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 10,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 18,
        contraptionParts: 3,
        actionPoints: 2,
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
        formula: '8d6 + intelligence',
        elementType: 'fire',
        damageTypes: ['area'],
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
        },
          resolution: 'DICE',
      },

      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{
          id: 'burned',
          name: 'Burned',
          description: 'Armor reduced by 3 and takes 1d6 fire damage per round for 3 rounds.',
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
          description: 'Enemies are knocked prone on a failed save.'
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
      icon: 'Utility/Hide',
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
        durationType: 'rounds',
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
        formula: '3d6 + agility',
        elementType: 'poison',
        damageTypes: ['direct'],
        attackType: 'weapon_attack',
          resolution: 'DICE',
      },

      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{
          id: 'crippled',
          name: 'Crippled',
          description: '-4 attack rolls, -2 armor, -10ft movement, disadvantage on saves for 5 rounds.',
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
      icon: 'Utility/Orange Bomb',
      school: 'Alchemy',
      level: 5,
      specialization: 'saboteur',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'sphere',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 2,
        durationUnit: 'rounds'
      },

      resourceCost: {
        mana: 15,
        toxinVials: 3,
        contraptionParts: 1,
        actionPoints: 2,
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
        formula: '3d8 + intelligence',
        elementType: 'poison',
        damageTypes: ['area'],
        additionalDamage: {
          formula: '3d8',
          elementType: 'fire'
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 17,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
          resolution: 'DICE',
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
            confusionType: 'random_target',
            saveType: 'constitution',
            saveDC: 14,
            duration: 2,
            durationUnit: 'rounds'
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
      icon: 'Psychic/Mind Control',
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
        durationType: 'rounds',
        duration: 2,
        durationUnit: 'rounds'
      },

      resourceCost: {
        mana: 21,
        toxinVials: 4,
        contraptionParts: 2,
        actionPoints: 2,
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
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 19,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'total_shutdown',
          name: 'Total Shutdown',
          description: 'Cannot take actions (reactions only), -3 armor, disadvantage on all saves for 1 round',
          statusType: 'incapacitated',
          level: 'severe',
          saveType: 'constitution',
          saveDC: 19,
          duration: 1,
          durationUnit: 'rounds',
          stun: false
        }]
      },

      specialMechanics: {
        saboteurBonus: {
          enabled: true,
          effect: 'Saboteurs increase save DC by +2 (total DC 21) and target takes 2d8 poison damage per round while incapacitated'
        },
        ultimateDebuff: {
          description: 'This is the ultimate debuff ability - use strategically on high-priority targets'
        }
      },

      tags: ['single target', 'debuff', 'incapacitate', 'ultimate', 'saboteur']
    },

    // ===== UNIVERSAL ABILITIES =====
    {
      id: 'tox_apply_poison',
      name: 'Apply Weapon Poison',
      description: 'Apply a poison to your weapon for 1 AP. The poison lasts for 3 attacks or until end of combat.',
      spellType: 'ACTION',
      icon: 'Utility/Strange Brew',
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
        durationType: 'rounds',
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

      tags: ['utility', 'poison', 'weapon enhancement', 'universal']
    },

    {
      id: 'tox_antidote',
      name: 'Antidote',
      description: 'Quickly craft and administer an antidote to cure poison or disease.',
      spellType: 'ACTION',
      icon: 'Poison/Poison Flask',
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
        description: 'Cure all poison and disease effects',
        charges: 1,
        mechanicsText: 'Cure all poison and disease effects'
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
      icon: 'Utility/Bomb',
      school: 'Alchemy',
      level: 3,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
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
        actionPoints: 1,
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
        formula: '3d6 + intelligence',
        elementType: 'fire',
        damageTypes: ['area'],
        attackType: 'spell_save',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 15,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
          resolution: 'DICE',
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
      icon: 'Utility/Hide',
      school: 'Alchemy',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 20,
        aoeType: 'sphere',
        aoeSize: 15
      },

      durationConfig: {
        durationType: 'rounds',
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
          description: 'Disrupts enemy vision and positioning for tactical advantage.'
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
      icon: 'Poison/Poison Plague',
      specialization: 'venomancer',

      typeConfig: {
        school: 'necromancy',
        icon: 'Poison/Poison Plague',
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
        resourceValues: { mana: 24, toxinVials: 3 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Release plague vial'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '12d6 + intelligence',
        elementType: 'poison',
        damageTypes: ['persistent'],
        spreadMechanic: 'Spreads to enemies within 10 feet at start of their turn',
        criticalConfig: {
          critType: 'effect',
          critEffects: ['pandemic_spread']
        },
          resolution: 'DICE',
      },

      debuffConfig: {
        debuffType: 'disease',
        effects: [{
          id: 'pandemic_plague',
          name: 'Pandemic Plague',
          description: 'Takes poison damage at start of turn. Spreads to nearby enemies. -4 to Constitution.',
          damageFormula: '3d6',
          dotFormula: '3d6',
          dotDamageType: 'poison',
          damagePerTurn: '3d6',
          statPenalty: { stat: 'constitution', value: -4 }
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'constitution',
        saveOutcome: 'halves_damage'
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 5
       },

      tags: ['damage', 'debuff', 'spreading', 'poison', 'level 8', 'toxicologist']
    },

    {
      id: 'tox_mechanical_monstrosity',
      name: 'Mechanical Monstrosity',
      description: 'Deploy a massive mechanical construct that fights alongside you.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Utility/Utility Tool',
      specialization: 'gadgeteer',

      typeConfig: {
        school: 'conjuration',
        icon: 'Utility/Utility Tool',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 32 },
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

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 6
       },

      tags: ['summoning', 'construct', 'level 8', 'toxicologist']
    },

    {
      id: 'tox_sabotage_supreme',
      name: 'Sabotage Supreme',
      description: 'Apply devastating sabotage to multiple enemies, reducing their effectiveness dramatically.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Piercing/Dagger Whirl',
      specialization: 'saboteur',

      typeConfig: {
        school: 'enchantment',
        icon: 'Piercing/Dagger Whirl',
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
        resourceValues: { mana: 32 },
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
          description: 'Enemies deal half damage, have -5 to hit, and all their gear malfunctions',
          statPenalty: [{ stat: 'damage', value: -50, magnitudeType: 'percentage' }, { stat: 'attack', value: -5 }],
          mechanicsText: 'Half damage, -5 to hit, gear malfunctions'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'agility',
        saveOutcome: 'halves_duration'
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 5
       },

      tags: ['debuff', 'aoe', 'sabotage', 'level 8', 'toxicologist']
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
      icon: 'Necrotic/Death Mark',
      specialization: 'venomancer',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Death Mark',
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
        resourceValues: { mana: 27, toxinVials: 5 },
        actionPoints: 3,
        components: ['somatic'],
        somaticText: 'Inject extinction toxin'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '18d6 + intelligence',
        elementType: 'poison',
        damageTypes: ['direct'],
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
        },
          resolution: 'DICE',
      },

      cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1
       },

      tags: ['damage', 'poison', 'ultimate', 'level 9', 'toxicologist']
    },

    {
      id: 'tox_war_machine',
      name: 'War Machine',
      description: 'Deploy a devastating war machine that dominates the battlefield.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Utility/Utility Tool',
      specialization: 'gadgeteer',

      typeConfig: {
        school: 'conjuration',
        icon: 'Utility/Utility Tool',
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 36 },
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
            abilities: 'Can attack for 6d10 damage, launch artillery for 8d8 in 30ft radius, or deploy shields for +5 Armor to allies'
          }
        }],
        duration: 5,
        durationUnit: 'rounds'
      },

      cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1
       },

      tags: ['summoning', 'construct', 'ultimate', 'level 9', 'toxicologist']
    },

    {
      id: 'tox_total_system_failure',
      name: 'Total System Failure',
      description: 'Cause catastrophic failure in all enemy defenses and abilities.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Social/Careful Blunder',
      specialization: 'saboteur',

      typeConfig: {
        school: 'enchantment',
        icon: 'Social/Careful Blunder',
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
        resourceValues: { mana: 36 },
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
          description: 'All enemy magical items stop working. All buffs are removed. Cannot cast spells for 1 round. -10 Armor.',
          statPenalty: [{ stat: 'armor', value: -10 }, { stat: 'spellcasting', value: -99, magnitudeType: 'blocked' }],
          mechanicsText: 'All magic items stop working, buffs removed, no spells for 1 round, -10 Armor'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 19,
        saveType: 'spirit',
        saveOutcome: 'halves_duration'
      },

      cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1
       },

      tags: ['debuff', 'aoe', 'dispel', 'ultimate', 'level 9', 'toxicologist']
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
      icon: 'Poison/Poison Plague',
      specialization: 'universal',

      typeConfig: {
        school: 'necromancy',
        icon: 'Poison/Poison Plague',
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
        resourceValues: { mana: 30, toxinVials: 'all' },
        actionPoints: 3,
        components: ['somatic'],
        somaticText: 'Release the apocalypse plague'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '22d6 + intelligence',
        elementType: 'poison',
        damageTypes: ['direct'],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 22,
          saveOutcome: 'halves'
        },
        criticalConfig: {
          critType: 'effect',
          critEffects: ['apocalypse_stun', 'plague_worldwide']
        },
          resolution: 'DICE',
      },

      debuffConfig: {
        debuffType: 'plague',
        effects: [{
          id: 'apocalypse_plague',
          name: 'Apocalypse Plague',
          description: 'All enemies are poisoned, weakened, and take ongoing damage. Spreads infinitely between enemies.',
          dotFormula: '4d10',
          dotDamageType: 'poison',
          damagePerTurn: '4d10',
          statPenalty: { stat: 'all_stats', value: -4 },
          mechanicsText: 'Poisoned, weakened, ongoing damage, spreads infinitely'
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes'
      },

      cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1
       },

      tags: ['damage', 'debuff', 'aoe', 'ultimate', 'level 10', 'toxicologist']
    },

    {
      id: 'tox_mechanical_army',
      name: 'Mechanical Army',
      description: 'Deploy an entire army of mechanical constructs to overwhelm the battlefield.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Utility/Strange Brew',
      specialization: 'gadgeteer',

      typeConfig: {
        school: 'conjuration',
        icon: 'Utility/Strange Brew',
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
        resourceValues: { mana: 40 },
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

      cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1
       },

      tags: ['summoning', 'army', 'construct', 'ultimate', 'level 10', 'toxicologist']
    },

    {
      id: 'tox_reality_bomb',
      name: 'Reality Bomb',
      description: 'Deploy the ultimate sabotage device - a bomb that disrupts the fabric of reality itself.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Poison/Poison Contagion',
      specialization: 'saboteur',

      typeConfig: {
        school: 'transmutation',
        icon: 'Poison/Poison Contagion',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 120,
        aoeShape: 'circle',
        aoeParameters: { radius: 50 }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 40 },
        actionPoints: 3,
        components: ['somatic'],
        somaticText: 'Detonate reality bomb'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '22d6 + intelligence',
        elementType: 'force',
        damageTypes: ['direct'],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 22,
          saveOutcome: 'halves'
        },
          resolution: 'DICE',
      },

      specialMechanics: {
        realityBomb: {
          description: 'All magic in the area is suppressed for 1 minute. All creatures are disoriented (disadvantage on all rolls for 1 round). Terrain becomes unstable.',
          antiMagic: true,
          duration: '1 minute'
        }
      },

      cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1
       },

      tags: ['damage', 'control', 'anti magic', 'ultimate', 'level 10', 'toxicologist']
    },

    // ADDITIONAL LEVEL 1 SPELLS
    {
      id: 'tox_poison_dart',
      name: 'Poison Dart',
      description: 'Fire a poison dart that deals 1d6 poison damage and applies a weakening effect.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      specialization: 'universal',

      typeConfig: {
        school: 'conjuration',
        icon: 'Piercing/Thrown Dagger',
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
        formula: '1d6 + intelligence',
        elementType: 'poison',
        damageTypes: ['direct'],
          resolution: 'DICE',
      },

      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{
          id: 'weakened_dart',
          name: 'Weakened',
          description: '-1 to attack rolls for 1 round',
          statModifier: {
            stat: 'attack_rolls',
            magnitude: -1,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        canBeDispelled: true
      },

      resourceCost: {
        resourceTypes: ['mana', 'toxinVials'],
        resourceValues: {
          mana: 2,
          toxinVials: 1
        },
        actionPoints: 1
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0
       },

      resolution: 'DICE',
      tags: ['damage', 'poison', 'dart', 'universal']
    },

    {
      id: 'tox_noxious_fumes',
      name: 'Noxious Fumes',
      description: 'Create a small toxic cloud that deals 1d6 poison damage to enemies in a 10-foot radius and leaves a lingering hazard for 2 rounds.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      specialization: 'universal',

      typeConfig: {
        school: 'conjuration',
        icon: 'Poison/Poison Plague',
        tags: ['damage', 'poison', 'zone', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeShape: 'circle',
        aoeParameters: { radius: 10 }
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 2,
        durationUnit: 'rounds'
      },

      damageConfig: {
        formula: '1d6 + intelligence',
        elementType: 'poison',
        damageTypes: ['area'],
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '1d4',
          duration: 2,
          tickFrequency: 'turn',
          isProgressiveDot: false
        },
          resolution: 'DICE',
      },

      resourceCost: {
        resourceTypes: ['mana', 'toxinVials'],
        resourceValues: {
          mana: 2,
          toxinVials: 1
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2
       },

      resolution: 'DICE',
      tags: ['damage', 'poison', 'zone', 'universal']
    },

    {
      id: 'tox_purifying_antidote',
      name: 'Purifying Antidote',
      description: 'Create an antidote that removes all poison effects from an ally.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['purification'],
      specialization: 'universal',

      typeConfig: {
        school: 'restoration',
        icon: 'Healing/Cure Within',
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
        resourceTypes: ['mana', 'toxinVials'],
        resourceValues: {
          mana: 2,
          toxinVials: 1
        },
        actionPoints: 1,
        components: ['verbal', 'somatic', 'material']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0
       },

      resolution: 'DICE',
      tags: ['purification', 'healing', 'antidote', 'universal']
    },

    // ADDITIONAL LEVEL 3 SPELLS
    {
      id: 'tox_venom_blast',
      name: 'Venom Blast',
      description: 'Strike with concentrated venom that deals poison damage and reduces the target\'s armor.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      specialization: 'universal',

      typeConfig: {
        school: 'necromancy',
        icon: 'Poison/Deadly Poison',
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
        formula: '4d6 + intelligence',
        elementType: 'poison',
        damageTypes: ['direct'],
          resolution: 'DICE',
      },

      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{
          id: 'venom_blast_armor',
          name: 'Armor Corrosion',
          description: '-2 armor for 2 rounds',
          statModifier: {
            stat: 'armor',
            magnitude: -2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        canBeDispelled: true
      },

      resourceCost: {
        resourceTypes: ['mana', 'toxinVials'],
        resourceValues: {
          mana: 8,
          toxinVials: 1
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2
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
      specialization: 'universal',

      typeConfig: {
        school: 'necromancy',
        icon: 'Necrotic/Screaming Skull',
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
        damageTypes: ['direct'],
          resolution: 'DICE',
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
            stunType: 'toxic',
            saveType: 'constitution',
            saveDC: 16,
            duration: 1,
            durationUnit: 'rounds'
          }
        }]
      },

      resourceCost: {
        resourceTypes: ['mana', 'toxinVials'],
        resourceValues: {
          mana: 8,
          toxinVials: 2
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3
       },

      resolution: 'DICE',
      tags: ['damage', 'poison', 'control', 'stun', 'universal']
    },

    // ADDITIONAL LEVEL 4 SPELL
    {
      id: 'tox_poison_bomb',
      name: 'Poison Bomb',
      description: 'Throw a poison bomb that explodes, dealing poison damage and reducing armor for all enemies in a radius.',
      level: 4,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      specialization: 'universal',

      typeConfig: {
        school: 'conjuration',
        icon: 'Arcane/Orb Manipulation',
        tags: ['damage', 'poison', 'aoe', 'bomb', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 40,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemy']
      },

      damageConfig: {
        formula: '5d6 + intelligence',
        elementType: 'poison',
        damageTypes: ['area'],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 16,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
          resolution: 'DICE',
      },

      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{
          id: 'poison_bomb_corrosion',
          name: 'Corroded',
          description: '-1 armor for 2 rounds',
          statModifier: {
            stat: 'armor',
            magnitude: -1,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        canBeDispelled: true
      },

      resourceCost: {
        resourceTypes: ['mana', 'toxinVials'],
        resourceValues: {
          mana: 10,
          toxinVials: 2
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3
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
      specialization: 'universal',

      typeConfig: {
        school: 'necromancy',
        icon: 'Poison/Poison Venom',
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
        formula: '6d8',
        elementType: 'poison',
        damageTypes: ['direct'],
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '1d8',
          duration: 5,
          tickFrequency: 'turn',
          isProgressiveDot: false
        },
          resolution: 'DICE',
      },

      resourceCost: {
        resourceTypes: ['mana', 'toxinVials'],
        resourceValues: {
          mana: 12,
          toxinVials: 2
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 4
       },

      resolution: 'DICE',
      tags: ['damage', 'poison', 'dot', 'deadly', 'universal']
    },

    // ADDITIONAL LEVEL 6 SPELL
    {
      id: 'tox_toxic_wave',
      name: 'Toxic Wave',
      description: 'Send a wave of toxic energy that deals poison damage and slows all enemies in a line.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      specialization: 'universal',

      typeConfig: {
        school: 'evocation',
        icon: 'Poison/Acid Splash',
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
        formula: '7d6 + intelligence',
        elementType: 'poison',
        damageTypes: ['area'],
        criticalConfig: {
          critType: 'effect',
          critEffects: ['poison_burn']
        },
          resolution: 'DICE',
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'toxic_wave_slow',
          name: 'Slowed',
          description: 'Movement speed reduced by 10 feet for 2 rounds',
          statusType: 'slowed',
          level: 'minor',
          statPenalty: { stat: 'movement_speed', value: -10 },
          movementPenalty: -10
        }],
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        canBeDispelled: true
      },

      resourceCost: {
        resourceTypes: ['mana', 'toxinVials'],
        resourceValues: {
          mana: 14,
          toxinVials: 2
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 4
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
      specialization: 'universal',

      typeConfig: {
        school: 'necromancy',
        icon: 'Poison/Poison Contagion',
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
        formula: '10d6',
        elementType: 'poison',
        damageTypes: ['direct'],
        criticalConfig: {
          critType: 'effect',
          critEffects: ['plague_spread']
        },
          resolution: 'DICE',
      },

      resourceCost: {
        resourceTypes: ['mana', 'toxinVials'],
        resourceValues: {
          mana: 16,
          toxinVials: 3
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 6
       },

      resolution: 'DICE',
      tags: ['damage', 'poison', 'spreading', 'plague', 'universal']
    }
  ]
};

export default TOXICOLOGIST_DATA;




