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
**Mid-Combat Crafting**: Craft concoctions as bonus actions to adapt to changing situations
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
- **Gadgeteer**: Deploy contraptions as bonus action, +1 contraption part max, contraptions harder to detect
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
- **Crafting Speed**: Can craft as a bonus action during combat
- **Variety**: Different recipes require different vial costs

**Contraption Parts (Secondary Resource)**
- **Maximum**: 5 parts
- **Generation**: Regain 1 part per short rest, all parts per long rest
- **Usage**: Spend 1-2 parts to deploy contraptions
- **Deployment**: Requires an action to set up contraption
- **Persistence**: Contraptions remain active until triggered or destroyed

**Poison Application**
- **Duration**: Poisons last for 3 attacks or until end of combat
- **Switching**: Changing poisons requires a bonus action
- **Stacking**: Multiple poison effects can stack on the same target`
    },

    // Toxin Vial Recipes Table
    toxinVialRecipesTable: {
      title: 'Toxin Vial Recipes',
      description: 'Concoctions and poisons that can be crafted using Toxin Vials. Crafting takes a bonus action.',
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
          'Thrown as bonus action'
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
    }
  },

  // Specializations
  specializations: {
    title: 'Toxicologist Specializations',
    subtitle: 'Three Paths of Alchemical Mastery',

    description: `Toxicologists can specialize in three distinct approaches to alchemy and battlefield control, each focusing on different aspects of poison crafting, contraption deployment, and tactical expertise.`,

    passiveAbility: {
      name: 'Alchemical Expertise',
      description: 'All Toxicologists can craft poisons and concoctions as a bonus action, and deploy contraptions as an action. Gain immunity to your own poisons and resistance to all poison damage.'
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
          description: 'You can deploy contraptions as a bonus action instead of an action. Your contraptions deal +1d6 damage and have +5ft trigger radius. You can have up to 4 active contraptions at once (instead of 3).'
        },

        keyAbilities: [
          {
            name: 'Rapid Deployment',
            cost: '2 Contraption Parts',
            effect: 'Deploy 2 contraptions simultaneously as a bonus action. Both contraptions are placed within 30ft of you and activate immediately.'
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
            effect: 'Target enemy is completely debilitated. They cannot take actions, reactions, or bonus actions for 2 rounds, have 0 armor, and automatically fail all saves. DC 19 CON save to reduce duration to 1 round and retain reactions.'
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
        components: ['somatic'],
        somaticText: 'Strike with poisoned blade'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '2d6',
        modifier: 'AGILITY',
        damageType: 'poison',
        bonusDamage: {
          condition: 'venomancer_passive',
          amount: '+1d6',
          description: 'Venomancer passive adds +1d6 poison damage'
        }
      },

      effects: {
        damage: {
          instant: {
            amount: '2d6 + AGI',
            type: 'poison',
            description: 'Immediate poison damage'
          },
          overTime: {
            amount: '1d6',
            type: 'poison',
            interval: 'round',
            duration: '4 rounds',
            description: 'Ongoing poison damage'
          }
        },
        debuff: {
          type: 'poisoned',
          duration: '4 rounds',
          description: 'Target is poisoned (disadvantage on attack rolls and ability checks)'
        }
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
        formula: '3d6',
        modifier: 'INTELLIGENCE',
        damageType: 'poison',
        attackType: 'spell_save'
      },

      effects: {
        damage: {
          overTime: {
            amount: '3d6',
            type: 'poison',
            interval: 'round',
            duration: '4 rounds',
            description: 'Poison damage each round in cloud'
          }
        },
        debuff: {
          type: 'weakened',
          effect: '-2 to all rolls',
          duration: '4 rounds',
          description: 'All enemies in cloud have -2 to attack rolls, saves, and ability checks'
        },
        areaControl: {
          description: 'Cloud persists for 4 rounds, damaging enemies who enter or start their turn in it'
        }
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
        components: ['somatic'],
        somaticText: 'Deploy contraption on ground'
      },

      resolution: 'AUTOMATIC',

      damageConfig: {
        formula: '2d6',
        modifier: 'INTELLIGENCE',
        damageType: 'poison',
        attackType: 'automatic'
      },

      effects: {
        damage: {
          instant: {
            amount: '2d6 + INT',
            type: 'poison',
            description: 'Poison damage when triggered'
          }
        },
        debuff: {
          type: 'slowed',
          effect: '-10ft movement',
          duration: '2 rounds',
          description: 'Enemies hit by trap are slowed'
        },
        trap: {
          trigger: 'enemy_proximity',
          triggerRadius: 5,
          description: 'Activates when enemy enters 5ft radius'
        }
      },

      specialMechanics: {
        gadgeteerBonus: {
          enabled: true,
          effect: 'Gadgeteers add +1d6 damage, +5ft trigger radius (total 10ft), and can deploy as bonus action'
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
      description: 'Deploy a supercharged contraption that deals massive damage and applies severe debuffs.',
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
        components: ['somatic', 'material'],
        somaticText: 'Deploy overcharged contraption',
        materialText: 'Enhanced contraption parts'
      },

      savingThrow: {
        enabled: true,
        attribute: 'dexterity',
        difficulty: 17,
        onSuccess: 'half_damage',
        onFailure: 'full_effect'
      },

      resolution: 'SAVING_THROW',

      damageConfig: {
        formula: '5d8',
        modifier: 'INTELLIGENCE',
        damageType: 'fire',
        attackType: 'spell_save'
      },

      effects: {
        damage: {
          instant: {
            amount: '5d8 + INT',
            type: 'fire',
            description: 'Explosive damage when triggered'
          }
        },
        debuff: {
          type: 'burned',
          effect: '-3 AC, 1d6 fire damage per round',
          duration: '3 rounds',
          description: 'Enemies are burned and weakened'
        },
        trap: {
          trigger: 'enemy_proximity',
          triggerRadius: 15,
          description: 'Activates when enemy enters 15ft radius'
        }
      },

      specialMechanics: {
        gadgeteerBonus: {
          enabled: true,
          effect: 'Gadgeteers add +2d8 damage and +5ft radius (total 20ft)'
        },
        explosiveForce: {
          description: 'Enemies hit are knocked back 10ft and knocked prone (STR save DC 15 to resist)'
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
        formula: '1d8',
        modifier: 'AGILITY',
        damageType: 'poison',
        attackType: 'weapon_attack'
      },

      effects: {
        damage: {
          instant: {
            amount: '1d8 + AGI',
            type: 'poison',
            description: 'Minor poison damage'
          }
        },
        debuff: {
          type: 'crippled',
          effects: [
            '-4 to attack rolls',
            '-2 AC',
            '-10ft movement',
            'Disadvantage on all saves'
          ],
          duration: '5 rounds',
          description: 'Target is severely debilitated'
        }
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
        formula: '2d8',
        modifier: 'INTELLIGENCE',
        damageType: 'poison',
        additionalDamage: {
          formula: '2d8',
          type: 'fire'
        }
      },

      effects: {
        damage: {
          instant: {
            amount: '2d8 poison + 2d8 fire',
            type: 'mixed',
            description: 'Combined poison and fire damage'
          }
        },
        condition: {
          type: 'confused',
          effect: 'Attack random target (ally or enemy)',
          duration: '2 rounds',
          description: 'Enemies are confused and attack randomly'
        }
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

      effects: {
        incapacitation: {
          effects: [
            'Cannot take actions, reactions, or bonus actions',
            'Armor reduced to 0',
            'Automatically fail all saves',
            'Vulnerable to all damage types'
          ],
          duration: '2 rounds',
          description: 'Target is completely helpless'
        },
        savingThrowEffect: {
          onSuccess: 'Duration reduced to 1 round, can still take reactions',
          onFailure: 'Full incapacitation for 2 rounds'
        }
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
      description: 'Apply a poison to your weapon as a bonus action. The poison lasts for 3 attacks or until end of combat.',
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
          description: 'Can be used as a bonus action, allowing you to apply poison and attack in the same turn'
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
        components: ['somatic', 'material'],
        somaticText: 'Administer antidote',
        materialText: 'Purifying reagents'
      },

      resolution: 'AUTOMATIC',

      effects: {
        cure: {
          removes: ['poison', 'disease'],
          description: 'Cure all poison and disease effects'
        },
        buff: {
          type: 'poison_resistance',
          effect: '+2 to CON saves vs poison',
          duration: '1 hour',
          description: 'Temporary resistance to poison'
        }
      },

      specialMechanics: {
        emergencyHealing: {
          description: 'Can be used on self or allies as a bonus action for quick emergency response'
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
        attribute: 'dexterity',
        difficulty: 15,
        onSuccess: 'half_damage',
        onFailure: 'full_damage'
      },

      resolution: 'SAVING_THROW',

      damageConfig: {
        formula: '3d8',
        modifier: 'INTELLIGENCE',
        damageType: 'fire',
        attackType: 'spell_save'
      },

      effects: {
        damage: {
          instant: {
            amount: '3d8 + INT',
            type: 'fire',
            description: 'Explosive fire damage'
          }
        },
        ignite: {
          chance: 'Coin flip (heads)',
          effect: '1d6 fire damage per round for 2 rounds',
          description: 'May ignite flammable objects and enemies'
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
          description: 'Creates tactical opportunities'
        }
      },

      specialMechanics: {
        quickDeployment: {
          description: 'Deployed as bonus action, allowing you to create cover and take other actions'
        },
        versatileUtility: {
          description: 'Use for escape, repositioning, protecting allies, or disrupting enemy vision'
        }
      },

      tags: ['utility', 'obscurement', 'tactical', 'universal']
    }
  ]
};

export default TOXICOLOGIST_DATA;




