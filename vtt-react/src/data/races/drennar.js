export const drennar = {
        id: 'drennar',
        name: 'Drennar',
        essence: 'Abyssal survivors',
        description: 'The weight of the ocean is a cold, heavy hand that never lets go, even in the driest of lands. We are the architects of the deep, our bones compressed by the crushing pressure of the abyss and our skin glowing with the bioluminescent fever of the trenches. We do not walk; we endure the dragging burden of gravity that feels like a pale imitation of the sea’s embrace. Our eyes are wide and dark, hungry for the faint, flickering lights that are the only stars we ever knew. We carry the silence of the sunken cities in our lungs, and our voices are the low, distant rumble of shifting tectonic plates. We are the survivors of the great floods and the deep mines, the ones who grew accustomed to the dark until the light became a weapon against us. We are not of your world; we are the memory of what the earth hides beneath its waves.',
        icon: 'fas fa-water',
        overview: 'The Drennar are people whose ancestors survived underwater disasters. Miners trapped in flooded tunnels. Sailors dragged to crushing depths. Divers who stayed too long in the abyss. Through generations of living in pressure-damaged bodies, their bloodlines have been marked by deep-sea trauma. Deformed skeletons. Crushed organs. Skin that glows from bacterial infections passed down through generations. They are organized into communities built around abandoned mines and sunken wrecks. Settlements clustered where the pressure-damaged can survive. The Drennar do not choose to glow. It is their heritage, passed down through bloodlines that carry the corruption of deep-sea wounds.',
        culturalBackground: `Drennar society is built on communities clustered around abandoned mines and sunken wrecks. Settlements built where pressure-damaged bodies can survive. Each community traces its lineage to survivors of legendary disasters. Miners trapped in flooded tunnels. Sailors dragged to crushing depths. Divers who stayed too long in the abyss. Their settlements cluster in places where the crushing dark is familiar. Inhabitants living proof that some survive the depths. Though perhaps they should not have. Community elders pass down the old ways. How to survive pressure changes. How to read deep-sea currents. How to function despite deformed bodies. The glowing patterns on their skin are not decoration. They are infected scars from pressure injuries. Bioluminescent bacteria that colonized their damaged tissue. Passed down through generations. Their slow movements are not patience but permanent damage. Joints crushed by pressure. Bones that never healed right. Community disputes settle through pressure-trials and the testimony of those who have survived the deepest dives. They avoid the surface not from preference but necessity. Their deformed bodies struggle with normal gravity. Pressure-damaged lungs cannot handle thin air. They are a people bound by depth and survival. Their knowledge of the abyss unmatched but their bodies forever marked by the pressure that shaped them.`,
        variantDiversity: 'The Drennar are divided into three major community bloodlines: The Crush-Scarred bear permanent deformities from surviving the crushing abyss, the Abyss-Walkers adapted to deep-sea environments through generations of suffering, and the Pressure-Torn survived rapid pressure changes that left them unstable.',
        integrationNotes: {
            actionPointSystem: 'Drennar abilities focus on pressure manipulation, bioluminescence, and aquatic superiority. Their pressure-damaged bodies provide unique tactical options.',
            backgroundSynergy: 'Drennar excel in backgrounds emphasizing survival, endurance, and trauma recovery. Their deformed bodies create interesting challenges on land.',
            classCompatibility: 'Drennar make excellent ambush specialists, pressure mages, and patient strategists. Their abilities enhance classes that rely on positioning and control.'
        },
        meaningfulTradeoffs: 'Drennar gain powerful aquatic abilities and pressure resistance but suffer on land and in bright light. Their deformities make social interaction difficult.',
        baseTraits: {
            languages: ['Common', 'Aquan', 'Deep Speech'],
            lifespan: '150-200 years',
            baseSpeed: 25,
            size: 'Medium',
            height: '5\'8" - 6\'4"',
            weight: '180-280 lbs',
            build: 'Deformed and bulky'
        },
        subraces: {
            abyssal: {
                id: 'abyssal_drennar',
                name: 'Crush Scarred',
                description: 'Most deformed of all Drennar. Bodies twisted by pressure, bones visibly warped. Movement is slow and painful. Skin glows brightest, patterns marking old injuries. Many have permanently hunched postures. Their joints crack audibly when they move. They struggle to walk on land, their bodies shaped for the deep.',
                culturalBackground: `The Crush-Scarred trace their lineage to Drennar who survived depths that should have pulverized their bones. Bloodline marked by permanent deformities from crushing pressure. Their tradition requires that every member learn to function despite severe physical damage. Apprenticeships spent mastering movement with deformed skeletons and crushed organs. Crush-Scarred communities serve as deep-miners and abyss-explorers. Members able to survive depths that would kill others because their bodies are already broken. They practice ancient survival techniques passed down through generations. How to move with crushed vertebrae. How to function with damaged joints. How to survive what has already broken them. Their bodies are maps of injuries that never healed properly. Bones warped by forces that reshaped them. They can survive in the deep not from adaptation but because their bodies are already broken. What would kill others has already happened to them. Many Crush-Scarred become reclusive hermits. Unable to interact normally due to their deformities. The bloodline values endurance and survival. Honor measured in depths reached despite the damage. They are the deep-explorers of Drennar society. Their resilience unmatched but their bodies forever marked by the pressure that broke them.`,
                statModifiers: {
                    constitution: 4,
                    strength: 1,
                    spirit: 1
                },
                traits: [
                    {
                        id: 'pressure_adaptation_drennar',
                        name: 'Pressure Adaptation',
                        description: 'Resistant to bludgeoning damage. Can survive any ocean depth.',
                        level: 1,
                        icon: 'Physical/Brace',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'defense',
                            secondaryElement: 'pressure',
                            icon: 'Physical/Brace',
                            tags: ['resistance', 'bludgeoning', 'pressure', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Bludgeoning Resistance',
                                    description: 'Resistance to bludgeoning damage',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Your pressure-adapted body resists crushing blows'
                                    }
                                },
                                {
                                    name: 'Depth Survival',
                                    description: 'Can survive any ocean depth',
                                    statusEffect: {
                                        level: 'extreme',
                                        description: 'No depth can crush your adapted form'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'abyssal_resilience_drennar',
                        name: 'Abyssal Resilience',
                        description: 'Resistant to frost and acid damage.',
                        level: 1,
                        icon: 'Physical/Toughness',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'defense',
                            secondaryElement: 'abyssal',
                            icon: 'Physical/Toughness',
                            tags: ['resistance', 'frost', 'acid', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Frost Resistance',
                                    description: 'Resistance to frost damage',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'The deep frost no longer harms you'
                                    }
                                },
                                {
                                    name: 'Acid Resistance',
                                    description: 'Resistance to acid damage',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Deep-sea chemicals have toughened you'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'light_sensitivity_drennar',
                        name: 'Light Sensitivity',
                        description: 'Vulnerable to radiant damage (+50% damage) and blinded by daylight.',
                        level: 1,
                        icon: 'spell_holy_holybolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'light',
                            icon: 'spell_holy_holybolt',
                            tags: ['vulnerability', 'radiant', 'light', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Radiant Vulnerability',
                                    description: 'Take 50% more radiant damage',
                                    statusEffect: {
                                        vulnerabilityType: 'radiant',
                                        vulnerabilityPercent: 50
                                    }
                                },
                                {
                                    name: 'Daylight Blindness',
                                    description: 'Blinded by daylight',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Bright light overwhelms your adapted eyes'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Aquan', 'Deep Speech'],
                speed: 25,
                baseStats: {
                    armor: 0,
                    hp: 10, // Most deformed, bodies already broken - extra durability from adaptation
                    mana: 8,
                    ap: 2, // Move slowly and painfully - less action-oriented
                    passivePerception: 1, // Not particularly perceptive
                    swimSpeed: 20, // Adapted to deep-sea, excellent swimmers
                    climbSpeed: 0, // Bodies deformed, not climbers
                    visionRange: 60,
                    darkvision: 120, // Eyes adapted to absolute darkness
                    initiative: -2 // Move slowly and painfully - slow to react
                },
                savingThrowModifiers: {
                    // Light sensitivity makes them vulnerable to blinding but pressure-adapted against stunning
                    disadvantage: ['blinded'], // Light sensitivity causes blinding
                    advantage: ['stun'] // Pressure adaptation resists stunning
                }
            },
            trench: {
                id: 'trench_drennar',
                name: 'Abyss Walker',
                description: 'Bodies compressed from years in the deep. Bones denser, shorter stature. Eyes adapted to absolute darkness, pupils huge. Skin glows with bacterial patterns. They move awkwardly on land, their bodies shaped for pressure. Many have developed webbing between fingers and toes. Their senses are tuned to the deep, struggling on the surface.',
                culturalBackground: `The Abyss-Walkers trace their lineage to Drennar who were trapped in deep-sea environments for extended periods. Bloodline marked by slow adaptation to crushing pressure through generations. Their tradition requires that every member spend years in the deepest trenches. Learning to function in permanent darkness and crushing pressure. Abyss-Walker communities serve as deep-sea traders and abyss-guides. Members able to navigate crushing depths where others cannot survive. They practice ancient adaptation techniques passed down through generations. How to function with compressed bones. How to see in absolute darkness. How to survive through slow change. Their bodies changed through suffering. Bones compressing. Organs shifting. Senses rewiring to function in permanent darkness. Their bioluminescence is not control but infection. Glowing bacteria that colonized their pressure wounds. Making them visible targets in the dark. Many Abyss-Walkers become solitary because normal interaction is too painful. Deformed bodies making them outcasts. The bloodline values adaptation and endurance. Honor measured in depths survived and changes endured. They are the deep-navigators of Drennar society. Their adaptation unmatched but their bodies forever marked by the slow crushing that shaped them.`,
                statModifiers: {
                    agility: 4,
                    intelligence: 2,
                    constitution: 1
                },
                traits: [
                    {
                        id: 'bioluminescent_lure_drennar',
                        name: 'Bioluminescent Lure',
                        description: 'Create hypnotic light patterns to lure and confuse enemies.',
                        level: 1,
                        icon: 'General/Amplify',
                        spellType: 'ACTION',
                        effectTypes: ['debuff', 'control'],
                        typeConfig: {
                            school: 'illusion',
                            secondaryElement: 'light',
                            icon: 'General/Amplify',
                            tags: ['illusion', 'hypnotic', 'lure']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Hypnotized',
                                    description: 'Target is lured and confused',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'The hypnotic patterns capture their attention'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            saveDC: 12,
                            saveType: 'spirit',
                            saveOutcome: 'negates',
                            canBeDispelled: false
                        },
                        controlConfig: {
                            controlType: 'mind_control',
                            strength: 'weak',
                            duration: 1,
                            durationUnit: 'rounds',
                            saveDC: 12,
                            saveType: 'spirit',
                            savingThrow: true,
                            effects: [{
                                id: 'confuse',
                                name: 'Lured',
                                description: 'Target is drawn toward the hypnotic lights and has disadvantage on attacks against you',
                                config: {
                                    controlLevel: 'distraction',
                                    mentalApproach: 'subtle'
                                }
                            }]
                        },
                        targetingConfig: {
                            targetingType: 'single',
                            rangeType: 'ranged',
                            rangeDistance: 30
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 6 },
                            actionPoints: 1,
                            components: ['verbal']
                        },
                        cooldownConfig: {
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'ambush_predator_drennar',
                        name: 'Ambush Predator',
                        description: 'Double damage on surprise attacks, but disadvantage in direct combat.',
                        level: 1,
                        icon: 'General/Sword',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'combat',
                            secondaryElement: 'ambush',
                            icon: 'General/Sword',
                            tags: ['ambush', 'surprise', 'combat', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Ambush Damage',
                                    description: 'Double damage on surprise attacks',
                                    statusEffect: {
                                        level: 'major',
                                        description: 'You strike from the shadows with deadly precision'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Direct Combat Weakness',
                                    description: 'Disadvantage in direct combat',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'You struggle in face-to-face confrontations'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'surface_frailty_drennar',
                        name: 'Surface Frailty',
                        description: 'Vulnerable to radiant damage (+50% damage) and take damage in bright light.',
                        level: 1,
                        icon: 'spell_holy_holybolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'light',
                            icon: 'spell_holy_holybolt',
                            tags: ['vulnerability', 'radiant', 'light', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Radiant Vulnerability',
                                    description: 'Take 50% more radiant damage',
                                    statusEffect: {
                                        vulnerabilityType: 'radiant',
                                        vulnerabilityPercent: 50
                                    }
                                },
                                {
                                    name: 'Light Damage',
                                    description: '1d4 radiant damage per minute in bright light',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Bright light harms your adapted eyes'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Common', 'Aquan', 'Deep Speech'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 32, // Bodies compressed, not particularly hardy
                    mana: 8,
                    ap: 4, // Deep-sea traders, quick reactions - extra action point
                    passivePerception: 3, // Senses tuned to the deep, bioluminescent lure
                    swimSpeed: 20, // Adapted to deep-sea, excellent swimmers
                    climbSpeed: 0, // Bodies compressed, not climbers
                    visionRange: 60,
                    darkvision: 120, // Eyes adapted to absolute darkness
                    initiative: 2 // Deep-sea traders, quick to react
                },
                savingThrowModifiers: {
                    // Surface frailty makes them vulnerable to radiant
                    disadvantage: ['blinded'], // Vulnerable to radiant light effects
                    advantage: ['restrained'] // Adapted to deep-sea, agile movement
                }
            },
            twilight: {
                id: 'twilight_drennar',
                name: 'Pressure Torn',
                description: 'Bodies show signs of violent pressure shifts. Eardrums often burst, hearing damaged. Lungs scarred, breathing labored. Skin shows patterns from pressure damage. They move carefully, as if every movement causes pain. Many have trouble with balance. Their bodies cannot settle in one environment for long.',
                culturalBackground: `The Pressure-Torn trace their lineage to Drennar who survived rapid pressure changes. Submarine disasters. Diving accidents. Sudden decompression. Bloodline marked by bodies damaged by violent shifts. Their tradition requires that every member learn to function despite constant pain. Apprenticeships spent mastering adaptation to pressure changes that cause agony. Pressure-Torn communities serve as boundary-walkers and pressure-mediators. Members able to move between depths that would kill others. They practice ancient survival techniques passed down through generations. How to function with burst eardrums. How to breathe with scarred lungs. How to survive despite blood vessel damage. Their bodies were damaged by the violent shifts. Eardrums burst. Lungs scarred. Blood vessels permanently damaged. They can function in different environments not from adaptation but because their bodies are already broken. They feel pain everywhere. Belonging nowhere. Many Pressure-Torn become wanderers not by choice but because they cannot stay anywhere long. The pressure changes cause them constant pain. The bloodline values resilience and boundary-walking. Honor measured in transitions survived despite the pain. They are the mediators of Drennar society. Their versatility unmatched but their bodies forever marked by the violent shifts that broke them.`,
                statModifiers: {
                    agility: 3,
                    intelligence: 2,
                    spirit: 1
                },
                traits: [
                    {
                        id: 'adaptive_gills_drennar',
                        name: 'Adaptive Gills',
                        description: 'Can breathe both water and air.',
                        level: 1,
                        icon: 'General/Pour Water',
                        spellType: 'PASSIVE',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'aquatic',
                            secondaryElement: 'adaptation',
                            icon: 'General/Pour Water',
                            tags: ['breathing', 'aquatic', 'amphibious', 'passive']
                        },
                        utilityConfig: {
                            utilityType: 'environmental',
                            selectedEffects: [{
                                id: 'breathing',
                                name: 'Breathing',
                                description: 'Breathe both underwater and in air.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'moderate'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'chromatic_display_drennar',
                        name: 'Chromatic Display',
                        description: 'Change bioluminescent patterns for communication.',
                        level: 1,
                        icon: 'Utility/Light 1',
                        spellType: 'ACTION',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'communication',
                            secondaryElement: 'light',
                            icon: 'Utility/Light 1',
                            tags: ['communication', 'light', 'display']
                        },
                        utilityConfig: {
                            utilityType: 'communication',
                            selectedEffects: [{
                                id: 'visual',
                                name: 'Visual',
                                description: 'Communicate through changing light patterns.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'minor'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 6 },
                            actionPoints: 1,
                            components: ['verbal']
                        },
                        cooldownConfig: {
                            type: 'short_rest',
                            value: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'pressure_instability_drennar',
                        name: 'Pressure Instability',
                        description: 'Your scarred lungs and burst eardrums react violently (+50% damage) to sudden pressure changes, making you dangerously vulnerable to the concussive force of thunderous magic.',
                        level: 1,
                        icon: 'Force/Sonic Boom',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'thunder',
                            icon: 'Force/Sonic Boom',
                            tags: ['vulnerability', 'thunder', 'pressure', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Thunder Vulnerability',
                                    description: 'Take 50% more damage from thunder sources.',
                                    statusEffect: {
                                        vulnerabilityType: 'thunder',
                                        vulnerabilityPercent: 50
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    }
                ],
                languages: ['Common', 'Aquan'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 26, // Bodies damaged by violent pressure shifts, physically frail
                    mana: 8,
                    ap: 3, // Boundary-walkers, standard AP
                    passivePerception: 2, // Can move between depths, sense pressure changes
                    swimSpeed: 15, // Adaptive gills, decent swimmers
                    climbSpeed: 0, // Bodies damaged, not climbers
                    visionRange: 60,
                    darkvision: 60, // Adapted to different environments
                    initiative: 0 // Move carefully, as if every movement causes pain - not quick to react
                },
                savingThrowModifiers: {
                    // Pressure instability makes them vulnerable to thunder
                    disadvantage: ['stun'], // Vulnerable to thunder/pressure wave stunning effects
                    advantage: ['restrained'] // Boundary-walkers, can move between depths
                }
            }
        }
    };

export default drennar;