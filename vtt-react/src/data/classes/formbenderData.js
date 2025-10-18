/**
 * Formbender Class Data
 * 
 * Complete class information for the Formbender - a shapeshifter who harnesses
 * primal forms through the Wild Instinct resource system.
 */

export const FORMBENDER_DATA = {
  id: 'formbender',
  name: 'Formbender',
  icon: 'fas fa-paw',
  role: 'Hybrid (Tank/Damage/Support)',
  
  // Overview section
  overview: {
    title: 'The Formbender',
    subtitle: 'Master of Wild Instinct and Primal Transformation',
    
    description: `The Formbender is a versatile shapeshifter who channels primal energy through four distinct wild forms. By gathering Wild Instinct through form-specific actions, Formbenders can unleash devastating abilities, adapt to any combat situation, and embody the raw power of nature itself. Each form offers unique strengths and playstyles, from the stealthy Nightstalker to the resilient Ironhide, the aerial Skyhunter, and the pack-focused Frostfang.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `**Primal Connection**: Formbenders are deeply attuned to the wild, drawing power from the primal essence of nature's apex predators. They walk the line between civilization and savagery, channeling bestial instincts while maintaining their sense of self.

**Adaptive Warriors**: Unlike traditional spellcasters, Formbenders are physical combatants who shift their form to match the needs of battle. They are scouts, guardians, hunters, and pack leaders—all in one.

**Nature's Champions**: Formbenders often serve as protectors of the wild, defending natural places from corruption and civilization's encroachment. Their connection to primal forces makes them formidable allies and terrifying enemies.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `**Adaptive Hybrid**: The Formbender's role changes based on their active form. Nightstalker excels at stealth and burst damage, Ironhide serves as a durable tank, Skyhunter provides mobility and aerial control, and Frostfang offers pack tactics and sustained damage.

**Resource Management**: Success as a Formbender requires careful Wild Instinct management—knowing when to gather, when to spend, and when to switch forms. Each form generates Wild Instinct differently, rewarding players who embrace each form's unique playstyle.

**Form Synergy**: Skilled Formbenders chain forms together, using one form to generate Wild Instinct and another to spend it. This creates dynamic combat patterns where no two fights play out the same way.`
    },
    
    playstyle: {
      title: 'Playstyle',
      content: `**Fluid Transformation**: Combat begins with choosing your opening form for free, then adapting as the battle evolves. Switching forms costs 1 Wild Instinct, so planning your transformations is crucial.

**Form-Specific Actions**: Each form has unique ways to generate Wild Instinct:
- **Nightstalker**: Stealth, ambushes, and precision strikes
- **Ironhide**: Taunting, tanking damage, and protecting allies
- **Skyhunter**: Scouting, aerial attacks, and enhanced perception
- **Frostfang**: Tracking, pack tactics, and coordinated strikes

**Escalating Power**: Wild Instinct abilities scale from 1-5 WI, allowing you to choose between frequent small boosts or saving for devastating ultimate abilities. This creates meaningful moment-to-moment decisions in combat.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Wild Instinct System',
    subtitle: 'Primal Energy Through Form Mastery',
    
    description: `Wild Instinct is the primal energy that fuels the Formbender's transformations and abilities. This resource is gathered through actions that align with each form's nature and spent to unleash powerful form-specific abilities or switch between forms mid-combat.`,

    mechanics: {
      title: 'Core Mechanics',
      content: `**Wild Instinct Capacity**: Maximum Wild Instinct is 15 points. Wild Instinct does not decay between combats, allowing strategic resource banking.

**Free Initial Transformation**: At the start of combat, enter any form for free. This allows you to begin generating Wild Instinct immediately.

**Form Switching Cost**: Each subsequent form switch during combat costs 1 Wild Instinct. Plan your transformations carefully to maintain resource efficiency.

**Wild Instinct Generation**: Generate Wild Instinct through form-specific actions: Sneaking (Nightstalker), Taunting (Ironhide), Scouting (Skyhunter), Tracking (Frostfang). Form-specific abilities generate 2 Wild Instinct.`
    },
    
    wildInstinctGenerationTable: {
      title: 'Wild Instinct Generation Methods',
      headers: ['Action', 'Form', 'WI Generated', 'Notes'],
      rows: [
        ['Sneaking (per round)', 'Nightstalker', '1', 'Must be in stealth'],
        ['Ambush from Stealth', 'Nightstalker', '2', 'Form-specific ability'],
        ['Taunting Enemy', 'Ironhide', '1', 'Per enemy taunted'],
        ['Taking Damage for Ally', 'Ironhide', '2', 'Form-specific ability'],
        ['Scouting/Enhanced Vision', 'Skyhunter', '1', 'Spotting hidden threats'],
        ['Dive Attack', 'Skyhunter', '2', 'Form-specific ability'],
        ['Tracking Target', 'Frostfang', '1', 'Successful tracking check'],
        ['Pack Tactics', 'Frostfang', '2', 'Coordinated attack with ally']
      ]
    },
    
    formAbilitiesTable: {
      title: 'Wild Instinct Ability Costs',
      headers: ['Ability Tier', 'WI Cost', 'Power Level', 'Example Effects'],
      rows: [
        ['Tier 1', '1 WI', 'Minor', '+1d4 damage, advantage on checks'],
        ['Tier 2', '2 WI', 'Moderate', '+2d4 damage, status effects, invisibility'],
        ['Tier 3', '3 WI', 'Strong', '+3d4 damage, stuns, teleportation'],
        ['Tier 4', '4 WI', 'Major', '+4d4 damage, fear effects, illusions'],
        ['Tier 5', '5 WI', 'Ultimate', '+5d4 damage, paralysis, immunity']
      ]
    }
  },
  
  // Specializations
  specializations: {
    title: 'Formbender Specializations',
    subtitle: 'Three Paths of Transformation Mastery',

    description: `Formbenders can specialize in radically different transformation philosophies. Metamorphs create chimeric hybrid forms, Skinwalkers steal and mimic the forms of their enemies, and Primordials channel ancient elemental transformations. Each path offers a completely unique approach to shapeshifting.`,

    passiveAbility: {
      name: 'Primal Attunement',
      description: 'All Formbenders can transform into their four base forms (Nightstalker, Ironhide, Skyhunter, Frostfang) and generate Wild Instinct through form-specific actions. The first transformation each combat is free.'
    },

    specs: [
      {
        id: 'metamorph',
        name: 'Metamorph',
        icon: 'ability_hunter_pet_chimera',
        color: '#9932CC',
        theme: 'Chimeric Hybrid Forms & Adaptive Evolution',

        description: `Metamorphs transcend the limitations of single forms, creating chimeric hybrids that combine traits from multiple creatures. They can merge forms together, creating unique combinations like a bear with eagle wings or a panther with serpent fangs. Their mastery lies in adaptation and versatility.`,

        playstyle: 'Hybrid form creation, multi-trait combinations, adaptive combat',

        strengths: [
          'Can combine two base forms simultaneously for hybrid abilities',
          'Access to unique chimeric transformations unavailable to other specs',
          'Hybrid forms inherit strengths from both parent forms',
          'Unmatched versatility in adapting to any situation'
        ],

        weaknesses: [
          'Hybrid forms cost more Wild Instinct to maintain',
          'Cannot access pure form ultimate abilities',
          'Transformation complexity requires careful planning',
          'Jack-of-all-trades means less specialization'
        ],

        specPassive: {
          name: 'Chimeric Fusion',
          description: 'You can merge two base forms together, creating hybrid forms with combined traits. Hybrid forms cost 2 WI to activate but grant abilities from both parent forms. You can also manifest partial transformations (wings, claws, gills) without fully shapeshifting.'
        },

        keyAbilities: [
          'Chimeric Merge: Combine two forms (e.g., Nightstalker + Skyhunter = Shadow Raptor with stealth and flight)',
          'Adaptive Evolution: Spend 3 WI to temporarily gain resistance to the last damage type you received',
          'Partial Shift: Manifest specific traits (claws, wings, gills, enhanced senses) without full transformation (1 WI each)'
        ],

        recommendedFor: 'Players who love creative problem-solving and want maximum transformation flexibility'
      },

      {
        id: 'skinwalker',
        name: 'Skinwalker',
        icon: 'spell_shadow_possession',
        color: '#8B0000',
        theme: 'Form Theft & Enemy Mimicry',

        description: `Skinwalkers possess the dark art of stealing forms from defeated enemies, adding them to their repertoire. They can transform into humanoids, monsters, and even magical creatures they've slain, perfectly mimicking their abilities and appearance. This forbidden magic makes them master infiltrators and adaptable combatants.`,

        playstyle: 'Form collection, enemy mimicry, infiltration, stolen abilities',

        strengths: [
          'Can steal and permanently learn forms from defeated enemies',
          'Perfect mimicry allows infiltration and deception',
          'Access to enemy racial abilities and traits',
          'Form library grows stronger with each victory'
        ],

        weaknesses: [
          'Must defeat enemies to gain their forms',
          'Can only maintain 10 stolen forms at a time',
          'Stolen forms may have unfamiliar abilities',
          'Requires kills to expand transformation options'
        ],

        specPassive: {
          name: 'Harvest Form',
          description: 'When you reduce a creature to 0 HP, you can spend 5 WI to steal its form. You can transform into stolen forms, gaining their physical stats, racial abilities, and appearance. You can store up to 10 stolen forms. Transforming into a stolen form costs 2 WI.'
        },

        keyAbilities: [
          'Perfect Mimicry: While in a stolen form, you are indistinguishable from the original creature (even to magic)',
          'Stolen Power: Use one ability from your current stolen form (costs vary by ability power)',
          'Form Vault: Spend 10 minutes to swap out stored forms, replacing old ones with new acquisitions'
        ],

        recommendedFor: 'Players who enjoy collecting abilities and using enemy powers against them'
      },

      {
        id: 'primordial',
        name: 'Primordial',
        icon: 'spell_fire_elementaldevastation',
        color: '#FF4500',
        theme: 'Ancient Elemental Transformations',

        description: `Primordials channel the ancient power of the elemental planes, transforming into primal elemental beings of fire, water, earth, and air. These transformations are more powerful than standard forms but come with elemental vulnerabilities. They embody raw elemental fury and can reshape the battlefield itself.`,

        playstyle: 'Elemental transformations, environmental manipulation, high-risk high-reward',

        strengths: [
          'Elemental forms deal massive elemental damage',
          'Can manipulate terrain and environment while transformed',
          'Immunity to their element while in elemental form',
          'Elemental forms have devastating ultimate abilities'
        ],

        weaknesses: [
          'Vulnerable to opposing elements (Fire weak to Water, etc.)',
          'Elemental forms cost 3 WI to activate',
          'Cannot use base animal forms while specialized',
          'Environmental dependence (harder to use Fire form underwater)'
        ],

        specPassive: {
          name: 'Elemental Ascension',
          description: 'You replace your base forms with four elemental forms: Inferno (fire), Tsunami (water), Avalanche (earth), and Tempest (air). Each grants immunity to its element, vulnerability to its opposite, and the ability to manipulate that element within 30 feet.'
        },

        keyAbilities: [
          'Inferno Form: Become living fire, dealing 1d6 fire damage to adjacent enemies each round, immune to fire, vulnerable to cold',
          'Tsunami Form: Become living water, gain swim speed 60ft, breathe underwater, create water walls, vulnerable to lightning',
          'Avalanche Form: Become living stone, gain +5 AC, tremorsense 30ft, reshape earth, vulnerable to thunder',
          'Tempest Form: Become living wind, gain fly speed 60ft, create wind barriers, vulnerable to being grounded'
        ],

        recommendedFor: 'Players who want powerful elemental magic and don\'t mind tactical vulnerabilities'
      }
    ]
  },

  // Example Spells - organized by form and specialization
  exampleSpells: [
    // ===== NIGHTSTALKER FORM (CAT) =====
    {
      id: 'fb_ambush_strike',
      name: 'Ambush Strike',
      description: 'Strike from the shadows with devastating precision. Damage and effects scale with Wild Instinct spent.',
      spellType: 'ACTION',
      icon: 'ability_rogue_ambush',
      school: 'Physical',
      level: 3,
      specialization: 'nightstalker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 5,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false,
        allowSelf: false
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating effects'
        }
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        baseDamage: {
          diceCount: 1,
          diceType: 4,
          damageType: 'slashing',
          scaling: 'per_wi_spent'
        }
      },

      effects: {
        tier1: {
          wiCost: 1,
          damage: '1d4',
          effect: 'None'
        },
        tier2: {
          wiCost: 2,
          damage: '2d4',
          effect: 'Apply Bleeding (1d4 damage per round for 3 rounds)'
        },
        tier3: {
          wiCost: 3,
          damage: '3d4',
          effect: 'Stun target for 1 round'
        },
        tier4: {
          wiCost: 4,
          damage: '4d4',
          effect: 'Reduce target movement speed by 50% for 2 rounds'
        },
        tier5: {
          wiCost: 5,
          damage: '5d4',
          effect: 'Paralyze target for 1 round'
        }
      },

      specialMechanics: {
        stealthRequirement: {
          description: 'Must be used from stealth for full effect',
          bonus: 'Advantage on attack roll if attacking from stealth'
        },
        wildInstinctScaling: {
          description: 'Effects scale based on Wild Instinct spent',
          tiers: 5
        }
      },

      tags: ['physical', 'stealth', 'burst-damage', 'nightstalker', 'feral-shifter'],
      flavorText: 'From the shadows, death strikes without warning.'
    },

    {
      id: 'fb_shadowmeld',
      name: 'Shadowmeld',
      description: 'Blend into the shadows, becoming invisible and creating illusionary duplicates at higher tiers.',
      spellType: 'ACTION',
      icon: 'spell_shadow_charm',
      school: 'Illusion',
      level: 2,
      specialization: 'nightstalker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SELF',
        range: 0,
        rangeUnit: 'self'
      },

      durationConfig: {
        type: 'timed',
        value: 1,
        unit: 'minutes',
        concentration: false,
        breakCondition: 'Attacking or taking damage'
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating stealth effects'
        }
      },

      resolution: 'AUTOMATIC',

      effects: {
        tier1: {
          wiCost: 1,
          effect: 'Advantage on Stealth checks for 1 minute'
        },
        tier2: {
          wiCost: 2,
          effect: 'Become invisible for 1 minute or until you attack'
        },
        tier3: {
          wiCost: 3,
          effect: 'Teleport to darkness within 30 feet and become invisible'
        },
        tier4: {
          wiCost: 4,
          effect: 'Create 1 illusionary duplicate for 1 minute'
        },
        tier5: {
          wiCost: 5,
          effect: 'Become invisible and create 2 illusionary duplicates'
        }
      },

      specialMechanics: {
        shadowTeleport: {
          description: 'At tier 3+, can teleport to any area of dim light or darkness',
          range: 30
        },
        illusions: {
          description: 'Duplicates mimic your movements and confuse enemies',
          duration: '1 minute'
        }
      },

      tags: ['stealth', 'invisibility', 'illusion', 'nightstalker', 'utility'],
      flavorText: 'The shadows embrace those who walk in darkness.'
    },

    // ===== IRONHIDE FORM (BEAR) =====
    {
      id: 'fb_roaring_assault',
      name: 'Roaring Assault',
      description: 'Unleash a devastating roar that damages and controls enemies. Effects scale with Wild Instinct.',
      spellType: 'ACTION',
      icon: 'ability_druid_demoralizingroar',
      school: 'Physical',
      level: 4,
      specialization: 'ironhide',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'AOE',
        range: 10,
        rangeUnit: 'feet',
        aoeType: 'RADIUS',
        aoeSize: 10,
        requiresLineOfSight: false
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating AoE effects'
        }
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        ability: 'constitution',
        dc: 14,
        onSuccess: 'Half damage',
        onFailure: 'Full damage and additional effects'
      },

      damageConfig: {
        baseDamage: {
          diceCount: 1,
          diceType: 6,
          damageType: 'thunder',
          scaling: 'per_wi_spent'
        }
      },

      effects: {
        tier1: {
          wiCost: 1,
          damage: '1d6',
          effect: 'None'
        },
        tier2: {
          wiCost: 2,
          damage: '2d6',
          effect: 'Cause fear in enemies within 10 feet for 1 round'
        },
        tier3: {
          wiCost: 3,
          damage: '3d6',
          effect: 'Knock back enemies 10 feet'
        },
        tier4: {
          wiCost: 4,
          damage: '4d6',
          effect: 'Stun enemies within 10 feet for 1 round'
        },
        tier5: {
          wiCost: 5,
          damage: '5d6',
          effect: 'Knock enemies prone within 10 feet'
        }
      },

      specialMechanics: {
        fearEffect: {
          description: 'Frightened enemies have disadvantage on attack rolls',
          duration: '1 round'
        },
        knockback: {
          description: 'Enemies are pushed away from you',
          distance: 10
        }
      },

      tags: ['aoe', 'thunder', 'crowd-control', 'ironhide', 'feral-shifter'],
      flavorText: 'The bear\'s roar shakes the very earth.'
    },

    {
      id: 'fb_fortress_of_fur',
      name: 'Fortress of Fur',
      description: 'Harden your hide to absorb damage and gain defensive bonuses. Ultimate tier grants temporary invulnerability.',
      spellType: 'ACTION',
      icon: 'spell_nature_stoneclawtotem',
      school: 'Abjuration',
      level: 3,
      specialization: 'ironhide',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SELF',
        range: 0,
        rangeUnit: 'self'
      },

      durationConfig: {
        type: 'timed',
        value: 1,
        unit: 'minutes',
        concentration: false
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating defensive effects'
        }
      },

      resolution: 'AUTOMATIC',

      effects: {
        tier1: {
          wiCost: 1,
          effect: 'Gain 1d6 temporary HP'
        },
        tier2: {
          wiCost: 2,
          effect: 'Gain 2d6 temporary HP and resistance to physical damage'
        },
        tier3: {
          wiCost: 3,
          effect: 'Gain 3d6 temporary HP and immunity to physical damage'
        },
        tier4: {
          wiCost: 4,
          effect: 'Gain 4d6 temporary HP and reflect 50% of melee damage'
        },
        tier5: {
          wiCost: 5,
          effect: 'Gain 5d6 temporary HP and immunity to all damage types'
        }
      },

      specialMechanics: {
        damageReflection: {
          description: 'At tier 4+, reflect melee damage back to attackers',
          percentage: 50
        },
        temporaryInvulnerability: {
          description: 'Tier 5 grants brief immunity to all damage',
          duration: '1 minute'
        }
      },

      tags: ['defense', 'temporary-hp', 'resistance', 'ironhide', 'restoration-shifter'],
      flavorText: 'The bear\'s hide becomes as hard as stone.'
    },

    // ===== SKYHUNTER FORM (HAWK) =====
    {
      id: 'fb_talon_dive',
      name: 'Talon Dive',
      description: 'Dive from above with razor-sharp talons, grappling and stunning enemies.',
      spellType: 'ACTION',
      icon: 'ability_druid_flightform',
      school: 'Physical',
      level: 3,
      specialization: 'skyhunter',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 30,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating dive effects'
        }
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        baseDamage: {
          diceCount: 1,
          diceType: 6,
          damageType: 'slashing',
          scaling: 'per_wi_spent'
        }
      },

      effects: {
        tier1: {
          wiCost: 1,
          damage: '1d6',
          effect: 'None'
        },
        tier2: {
          wiCost: 2,
          damage: '2d6',
          effect: 'Apply Grappled condition'
        },
        tier3: {
          wiCost: 3,
          damage: '3d6',
          effect: 'Stun target for 1 round'
        },
        tier4: {
          wiCost: 4,
          damage: '4d6',
          effect: 'Reduce target attack rolls by 50% for 2 rounds'
        },
        tier5: {
          wiCost: 5,
          damage: '5d6',
          effect: 'Paralyze target for 1 round'
        }
      },

      specialMechanics: {
        aerialAdvantage: {
          description: 'Gain advantage on attack roll if you have flight active',
          bonus: 'Advantage on attack'
        },
        grapple: {
          description: 'Grappled targets cannot move and have disadvantage on attacks',
          duration: 'Until escape (Athletics/Acrobatics check)'
        }
      },

      tags: ['physical', 'aerial', 'grapple', 'skyhunter', 'feral-shifter'],
      flavorText: 'From the skies, the hunter descends.'
    },

    {
      id: 'fb_winds_grace',
      name: 'Wind\'s Grace',
      description: 'Harness the power of wind for enhanced perception, flight, and devastating wind attacks.',
      spellType: 'ACTION',
      icon: 'spell_nature_cyclone',
      school: 'Evocation',
      level: 4,
      specialization: 'skyhunter',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'VARIES',
        range: 30,
        rangeUnit: 'feet'
      },

      durationConfig: {
        type: 'varies',
        value: 1,
        unit: 'minutes'
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating wind effects'
        }
      },

      resolution: 'VARIES',

      effects: {
        tier1: {
          wiCost: 1,
          effect: 'Advantage on Perception checks for 1 hour'
        },
        tier2: {
          wiCost: 2,
          effect: 'Gain flight speed equal to walking speed for 1 minute'
        },
        tier3: {
          wiCost: 3,
          effect: 'Summon gust pushing enemies back 10 feet (Str save DC 14)'
        },
        tier4: {
          wiCost: 4,
          effect: 'Gain flight and wind barrier granting +2 AC for 1 minute'
        },
        tier5: {
          wiCost: 5,
          effect: 'Summon tornado dealing 3d6 damage and throwing enemies 20 feet'
        }
      },

      specialMechanics: {
        flightMobility: {
          description: 'Flight allows you to ignore difficult terrain and avoid ground hazards',
          speed: 'Equal to walking speed'
        },
        tornado: {
          description: 'Tier 5 creates a devastating tornado in a 15-foot radius',
          damage: '3d6',
          knockback: 20
        }
      },

      tags: ['utility', 'flight', 'wind', 'aoe', 'skyhunter', 'balance-shifter'],
      flavorText: 'The winds obey those who soar among them.'
    },

    // ===== FROSTFANG FORM (WOLF) =====
    {
      id: 'fb_frostbite_strike',
      name: 'Frostbite Strike',
      description: 'Bite with frost-infused fangs, dealing cold damage and applying slowing effects.',
      spellType: 'ACTION',
      icon: 'spell_frost_frostbolt',
      school: 'Evocation',
      level: 3,
      specialization: 'frostfang',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 5,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating frost effects'
        }
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        baseDamage: {
          diceCount: 1,
          diceType: 6,
          damageType: 'cold',
          scaling: 'per_wi_spent'
        }
      },

      effects: {
        tier1: {
          wiCost: 1,
          damage: '1d6 cold',
          effect: 'None'
        },
        tier2: {
          wiCost: 2,
          damage: '2d6 cold',
          effect: 'Apply Slowed (movement speed reduced by 50%)'
        },
        tier3: {
          wiCost: 3,
          damage: '3d6 cold',
          effect: 'Freeze target for 1 round (cannot move or act)'
        },
        tier4: {
          wiCost: 4,
          damage: '4d6 cold',
          effect: 'Reduce target attack rolls by 50% for 2 rounds'
        },
        tier5: {
          wiCost: 5,
          damage: '5d6 cold',
          effect: 'Paralyze target for 1 round'
        }
      },

      specialMechanics: {
        frostEffect: {
          description: 'Cold damage slows enemies and reduces their effectiveness',
          duration: 'Varies by tier'
        },
        freeze: {
          description: 'Frozen targets are incapacitated and vulnerable to shattering',
          vulnerability: 'Bludgeoning damage'
        }
      },

      tags: ['cold', 'physical', 'crowd-control', 'frostfang', 'feral-shifter'],
      flavorText: 'The wolf\'s bite carries the chill of winter.'
    },

    {
      id: 'fb_pack_leaders_call',
      name: 'Pack Leader\'s Call',
      description: 'Summon spectral wolves to fight alongside you and empower your allies.',
      spellType: 'ACTION',
      icon: 'spell_nature_spiritwolf',
      school: 'Conjuration',
      level: 4,
      specialization: 'frostfang',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'VARIES',
        range: 30,
        rangeUnit: 'feet'
      },

      durationConfig: {
        type: 'timed',
        value: 1,
        unit: 'minutes',
        concentration: false
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating pack effects'
        }
      },

      resolution: 'AUTOMATIC',

      effects: {
        tier1: {
          wiCost: 1,
          effect: 'Advantage on tracking checks for 1 hour'
        },
        tier2: {
          wiCost: 2,
          effect: 'Summon 1 spectral wolf (AC 13, HP 15, Attack +5 for 1d6+2 damage)'
        },
        tier3: {
          wiCost: 3,
          effect: 'Summon 2 spectral wolves'
        },
        tier4: {
          wiCost: 4,
          effect: 'Summon wolf pack granting allies advantage on attacks for 1 minute'
        },
        tier5: {
          wiCost: 5,
          effect: 'Summon alpha wolf (AC 15, HP 30, Attack +7 for 2d8+3, grants +2 AC to allies)'
        }
      },

      specialMechanics: {
        spectralWolves: {
          description: 'Summoned wolves act on your turn and follow your commands',
          duration: '1 minute'
        },
        packTactics: {
          description: 'Wolves and allies gain advantage when attacking the same target',
          bonus: 'Advantage on attack rolls'
        },
        alphaWolf: {
          description: 'Tier 5 alpha wolf is a powerful summon with enhanced stats',
          stats: 'AC 15, HP 30, +7 to hit, 2d8+3 damage'
        }
      },

      tags: ['summoning', 'pack-tactics', 'support', 'frostfang', 'restoration-shifter'],
      flavorText: 'The pack answers the call of their leader.'
    },

    // ===== UNIVERSAL SPELLS (ALL FORMS) =====
    {
      id: 'fb_natures_grasp',
      name: 'Nature\'s Grasp',
      description: 'Vines erupt from the ground to restrain a target.',
      spellType: 'ACTION',
      icon: 'spell_nature_stranglevines',
      school: 'Conjuration',
      level: 1,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 30,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false
      },

      durationConfig: {
        type: 'timed',
        value: 1,
        unit: 'minutes',
        concentration: true
      },

      resourceCost: {
        mana: 2
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        ability: 'strength',
        dc: 13,
        onSuccess: 'No effect',
        onFailure: 'Restrained'
      },

      specialMechanics: {
        restrainedCondition: {
          description: 'Restrained creatures have speed 0 and disadvantage on Dex saves',
          escape: 'Strength or Acrobatics check DC 13'
        }
      },

      tags: ['crowd-control', 'nature', 'universal', 'all-specs'],
      flavorText: 'Nature itself reaches out to bind your foes.'
    },

    {
      id: 'fb_healing_touch',
      name: 'Healing Touch',
      description: 'Channel nature\'s healing energy to restore an ally\'s health.',
      spellType: 'ACTION',
      icon: 'spell_nature_healingtouch',
      school: 'Evocation',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 30,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: true,
        allowSelf: true
      },

      resourceCost: {
        mana: 2
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        baseHealing: {
          diceCount: 1,
          diceType: 4,
          flatBonus: 0
        }
      },

      specialMechanics: {
        restorationShifterBonus: {
          description: 'Restoration Shifters can cast this while shapeshifted for 1 less mana',
          manaCost: 1
        }
      },

      tags: ['healing', 'support', 'universal', 'all-specs', 'restoration-shifter'],
      flavorText: 'Life flows through your touch, mending wounds.'
    },

    {
      id: 'fb_wild_shape_partial',
      name: 'Wild Shape (Partial)',
      description: 'Transform part of your body into an animal feature, gaining temporary abilities.',
      spellType: 'ACTION',
      icon: 'ability_druid_wildmark',
      school: 'Transmutation',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SELF',
        range: 0,
        rangeUnit: 'self'
      },

      durationConfig: {
        type: 'timed',
        value: 1,
        unit: 'minutes',
        concentration: false
      },

      resourceCost: {
        mana: 2
      },

      resolution: 'AUTOMATIC',

      effects: {
        claws: {
          description: 'Grow claws for climbing',
          benefit: 'Climbing speed equal to walking speed'
        },
        wings: {
          description: 'Sprout wings for gliding',
          benefit: 'Glide up to 60 feet when falling'
        },
        gills: {
          description: 'Develop gills for breathing underwater',
          benefit: 'Breathe underwater for 1 minute'
        },
        enhancedSenses: {
          description: 'Enhance senses like a predator',
          benefit: 'Advantage on Perception checks for 1 minute'
        }
      },

      specialMechanics: {
        partialTransformation: {
          description: 'Unlike full forms, partial transformations don\'t prevent spellcasting',
          note: 'Can be used alongside other abilities'
        }
      },

      tags: ['transformation', 'utility', 'universal', 'all-specs', 'balance-shifter'],
      flavorText: 'The wild flows through you, reshaping your form.'
    }
  ]
};


