export const volketh = {
        id: 'volketh',
        name: 'Volketh',
        essence: 'Sky-born wind-riders',
        description: 'The sky is not a place we visit; it is our true home, and the earth is merely where we rest our weary wings. Our bones are hollowed by the ambition of flight, and our hearts beat with the frantic urgency of the gale. We see the world from above, a tapestry of colors and movements that those tethered to the ground can never truly comprehend. The wind is our sibling, whispering secrets of the mountain peaks and the distant oceans into our ears. Our plumage is a mosaic of the storm and the sun, and our eyes are as sharp as the talons we carry. We do not just fly; we navigate the invisible currents of the world, dancing on the edge of the clouds where the air is thin and pure. We are the heralds of the high places, the scouts of the infinite blue who have traded the safety of the soil for the freedom of the vertical. To us, a wall is an insult and a roof is a cage.',
        icon: 'fas fa-bolt',
        overview: 'The Volketh are people whose ancestors survived terrible storms. Those struck by lightning and lived. Or born during tempests that killed their families. Through generations of living in storm-prone regions, their bloodlines have been marked by electrical damage. Scarred skin that glows faintly during storms. Nervous systems permanently damaged by electrical burns passed down through bloodlines. They are organized into nomadic bands that follow storm patterns. Settlements built in the wake of thunderstorms. The Volketh do not choose to attract storms. It is their heritage, passed down through bloodlines that carry the storm damage.',
        culturalBackground: `Volketh society is built on nomadic bands that follow storm patterns. Communities organized around surviving the tempests that shaped their ancestors. Each band traces its lineage to survivors of legendary disasters. Farmers whose homes were struck. Sailors pulled from shipwrecks. Children who watched their families die in floods. Their camps huddle in the wake of thunderstorms. Tents pitched in muddy fields where lightning still crackles in the air. Band elders pass down the old ways. How to read storm signs. How to survive lightning strikes. How to find shelter when the sky turns deadly. Their skin scars glow during storms. Making them targets for superstitious folk who blame them for the weather. They do not control storms. They attract them. Their damaged bodies acting like lightning rods. Band disputes settle through storm-trials and the testimony of those who have survived the most strikes. They are a people bound by storm and survival. Their knowledge of weather unmatched but their bodies forever marked by the forces that shaped them.`,
        variantDiversity: 'The Volketh are divided into three major band bloodlines: The Lightning-Struck bear scars from direct strikes and act as living lightning rods, the Nerve-Wracked have nervous systems damaged by continuous electrical exposure, and the Wind-Broken survived hurricanes that scarred their lungs and minds.',
        integrationNotes: {
            actionPointSystem: 'Volketh abilities focus on lightning damage, mobility, and area control. Their electrical nature provides powerful offensive options but can be unpredictable.',
            backgroundSynergy: 'Volketh excel in backgrounds emphasizing survival, trauma, and disaster recovery. Their storm-scarred nature complements aggressive and mobile playstyles.',
            classCompatibility: 'Volketh make excellent elemental casters, mobile strikers, and warriors who channel their trauma. Their lightning abilities enhance classes that deal burst damage.'
        },
        meaningfulTradeoffs: 'Volketh gain powerful lightning abilities and high mobility but are vulnerable to grounding effects and struggle with fine control. Their damaged nervous systems make them unreliable.',
        baseTraits: {
            languages: ['Common', 'Auran', 'Primordial'],
            lifespan: '60-90 years',
            baseSpeed: 35,
            size: 'Medium',
            height: '5\'4" - 6\'0"',
            weight: '120-180 lbs',
            build: 'Jittery and energetic'
        },
        subraces: {
            thundercaller: {
                id: 'thundercaller_volketh',
                name: 'Lightning Struck',
                description: 'Scars form branching patterns like lightning across their skin. These scars glow during storms. Skin feels warm to the touch, like banked electricity. Eyes flash with electrical light when agitated. Their hair stands on end constantly. Many have burns where lightning entered and exited. Their scars ache before storms arrive.',
                culturalBackground: `The Lightning-Struck trace their lineage to Volketh who survived direct lightning strikes. Bloodline marked by scars that conduct electrical charge. Their tradition requires that every member learn to read storm signs from their own scars. Apprenticeships spent understanding how their damaged flesh reacts to atmospheric pressure. Lightning-Struck bands serve as weather-readers and storm-warners. Members acting as living lightning rods that can sense approaching tempests. They practice ancient survival techniques passed down through generations. How to ground themselves during strikes. How to read scar-pain as weather prediction. How to warn others before storms arrive. Their scars ache before storms. Damaged nerves reacting to atmospheric pressure changes. But this is not a gift. It is nerve damage that makes them suffer. The scars sometimes discharge static. Shocking those who touch them. During calm weather, the damaged nerves settle. But storms bring agony as their scars burn with phantom electricity. The bloodline values warning and protection. Honor measured in storms predicted and lives saved. They are the storm-readers of Volketh society. Their knowledge valuable but their bodies forever marked by the lightning that shaped them.`,
                statModifiers: {
                    charisma: 3,
                    constitution: 2,
                    strength: 1
                },
                traits: [
                    {
                        id: 'thunder_voice_volketh',
                        name: 'Thunder Voice',
                        description: 'Voice carries thunder power. Deal sonic damage and stun enemies.',
                        level: 1,
                        icon: 'spell_nature_thunderclap',
                        spellType: 'ACTION',
                        effectTypes: ['damage', 'debuff'],
                        typeConfig: {
                            school: 'lightning',
                            secondaryElement: 'sonic',
                            icon: 'spell_nature_thunderclap',
                            tags: ['sonic', 'stun', 'damage']
                        },
                        damageConfig: {
                            damageType: 'direct',
                            elementType: 'thunder',
                            formula: '2d6'
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Stunned',
                                    description: 'Target is stunned for 1 round',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Thunder stuns the target'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'rounds',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'area',
                            rangeType: 'self_centered',
                            aoeSize: 15
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 },
                            actionPoints: 2,
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
                        id: 'storm_presence_volketh',
                        name: 'Storm Presence',
                        description: 'Allies within 30 feet gain intimidation bonus.',
                        level: 1,
                        icon: 'spell_nature_lightning',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'lightning',
                            secondaryElement: 'social',
                            icon: 'spell_nature_lightning',
                            tags: ['aura', 'intimidation', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Intimidating Presence',
                                    description: 'Allies gain intimidation bonus',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Your storm-scarred presence inspires fear'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'area',
                            rangeType: 'self_centered',
                            aoeSize: 30
                        }
                    },
                    {
                        id: 'grounding_vulnerability_volketh',
                        name: 'Grounding Vulnerability',
                        description: 'Vulnerable to effects that ground electricity (+50% damage from metal weapons and water attacks).',
                        level: 1,
                        icon: 'spell_nature_earthbind',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'grounding',
                            icon: 'spell_nature_earthbind',
                            tags: ['vulnerability', 'grounding', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Grounding Vulnerability',
                                    description: 'Take +50% damage from metal and water attacks',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
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
                languages: ['Common', 'Auran', 'Primordial'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 12, // Scarred by lightning but resilient
                    mana: 8, // Electrical energy grants some mana
                    ap: 3, // Storm-readers, standard AP
                    passivePerception: 13, // Read storm signs, scars ache before storms
                    swimSpeed: 15, // Grounding vulnerability makes swimming difficult
                    climbSpeed: 20, // Not climbers
                    visionRange: 65,
                    darkvision: 0,
                    initiative: 1 // Living lightning rods, quick to react
                },
                savingThrowModifiers: {
                    // Grounding vulnerability makes them susceptible to metal and water damage
                    disadvantage: ['poison'], // Vulnerable to grounding effects from metal and water
                    advantage: ['fear'] // Storm presence makes them intimidating
                }
            },
            lightningborn: {
                id: 'lightningborn_stormborn',
                name: 'Nerve Wracked',
                description: 'Constant twitches and spasms mark their movement. Eyes dart erratically, unable to focus long. Hands shake, making precise work difficult. Their reflexes are hyperactive, movements jerky. Skin shows burn marks from electrical exposure. Many have trouble speaking clearly, words interrupted by spasms. They move fast but uncontrolled.',
                culturalBackground: `The Nerve-Wracked trace their lineage to Volketh who were exposed to continuous electrical storms during childhood. Bloodline marked by permanently damaged nervous systems. Their tradition requires that every member learn to function despite neurological damage. Apprenticeships spent mastering control over twitchy reflexes. Nerve-Wracked bands serve as messengers and scouts. Members hyperactive reflexes allowing them to move quickly despite the damage. They practice ancient coping techniques passed down through generations. How to channel twitches into movement. How to think clearly despite electrical interference. How to function when nerves misfire. Their reflexes are hyperactive. Not fast by choice, but twitchy and uncontrolled. Muscles responding to phantom electrical signals. During calm weather, the damage settles and they can think clearly. But storms bring mental chaos as their damaged nerves short-circuit. Many Nerve-Wracked struggle with basic tasks. Nervous systems too damaged for precision work. The bloodline values adaptation and resilience. Honor measured in tasks completed despite the damage. They are the survivors of Volketh society. Their resilience unmatched but their bodies forever marked by currents that flowed through them too long.`,
                statModifiers: {
                    agility: 4,
                    intelligence: 2,
                    spirit: 1
                },
                traits: [
                    {
                        id: 'lightning_reflexes_volketh',
                        name: 'Lightning Reflexes',
                        description: 'Move at lightning speed in bursts, but become exhausted.',
                        level: 1,
                        icon: 'spell_nature_lightningoverload',
                        spellType: 'ACTION',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'lightning',
                            secondaryElement: 'movement',
                            icon: 'spell_nature_lightningoverload',
                            tags: ['movement', 'speed', 'lightning']
                        },
                        utilityConfig: {
                            utilityType: 'movement',
                            selectedEffects: [{
                                id: 'dash',
                                name: 'Dash',
                                description: 'Move at incredible speed for a short burst.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'major'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 },
                            actionPoints: 2,
                            components: ['verbal', 'somatic']
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
                        id: 'chain_reaction_volketh',
                        name: 'Chain Reaction',
                        description: 'Attacks can arc to nearby enemies, but may hit allies.',
                        level: 1,
                        icon: 'spell_nature_chainlightning',
                        spellType: 'PASSIVE',
                        effectTypes: ['damage'],
                        typeConfig: {
                            school: 'lightning',
                            secondaryElement: 'chain',
                            icon: 'spell_nature_chainlightning',
                            tags: ['chain', 'lightning', 'damage', 'passive']
                        },
                        damageConfig: {
                            damageType: 'direct',
                            elementType: 'lightning',
                            chainDistance: 10
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        }
                    },
                    {
                        id: 'water_vulnerability_volketh',
                        name: 'Water Vulnerability',
                        description: 'Vulnerable to water-based effects (+50% damage from water attacks).',
                        level: 1,
                        icon: 'spell_frost_waterbolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'water',
                            icon: 'spell_frost_waterbolt',
                            tags: ['vulnerability', 'water', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Water Vulnerability',
                                    description: 'Take +50% damage from water attacks',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
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
                languages: ['Common', 'Auran', 'Primordial'],
                speed: 35,
                baseStats: {
                    armor: 0,
                    hp: 24, // Nerve damage, not particularly hardy
                    mana: 8,
                    ap: 4, // Hyperactive reflexes, move fast - extra action point
                    passivePerception: 1, // Eyes dart erratically, unable to focus long
                    swimSpeed: 0, // Water vulnerability, poor swimmers
                    climbSpeed: 5, // Hyperactive reflexes, decent climbers
                    visionRange: 60,
                    darkvision: 0,
                    initiative: 4 // Hyperactive reflexes, quick to react (but uncontrolled)
                },
                savingThrowModifiers: {
                    // Nerve damage makes them vulnerable to stunning but agile against paralysis
                    disadvantage: ['stun'], // Nerve damage vulnerable to stunning
                    advantage: ['paralyze'] // Hyperactive reflexes resist paralysis
                }
            },
            tempest: {
                id: 'tempest_stormborn',
                name: 'Wind Broken',
                description: 'Breathing is labored, audible even at rest. Lungs scarred from pressure damage show in their chest movements. Skin sometimes shows signs of oxygen deprivation, bluish tint around lips. Their breath creates strange air currents when they exert themselves. Many have coughs that never fully heal. They tire easily but push through with determination.',
                culturalBackground: `The Wind-Broken trace their lineage to Volketh who survived hurricanes and tornadoes that destroyed everything they knew. Bloodline marked by damaged lungs from pressure changes and debris. Their tradition requires that every member learn to function despite respiratory damage. Apprenticeships spent mastering breathing techniques that compensate for scarred lung tissue. Wind-Broken bands serve as fighters and protectors. Members damaged breathing creating unintended air disturbances that confuse enemies. They practice ancient survival techniques passed down through generations. How to breathe despite damage. How to channel panic into strength. How to fight when lungs do not work properly. Their breathing creates strange air currents. Not from power but from scarred lung tissue that does not expand properly. Strong emotions trigger panic attacks that manifest as irregular breathing patterns. Which superstitious folk mistake for weather control. But this is not control. It is trauma response. Their bodies reacting to memories of wind and destruction. Many Wind-Broken develop severe anxiety disorders. Unable to cope with the sounds of wind or approaching storms. The bloodline values strength and survival. Honor measured in battles fought despite the damage. They are the fighters of Volketh society. Their resilience unmatched but their bodies forever marked by the storms that took their homes.`,
                statModifiers: {
                    strength: 4,
                    constitution: 2,
                    agility: 1
                },
                traits: [
                    {
                        id: 'storm_rage_volketh',
                        name: 'Storm Rage',
                        description: 'Enter berserk rage. +3 attack, +2d6 lightning damage, resistance to physical damage.',
                        level: 1,
                        icon: 'ability_warrior_rampage',
                        spellType: 'ACTION',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'lightning',
                            secondaryElement: 'rage',
                            icon: 'ability_warrior_rampage',
                            tags: ['rage', 'lightning', 'combat']
                        },
                        buffConfig: {
                            buffType: 'statEnhancement',
                            statModifiers: [
                                {
                                    id: 'rage_attack',
                                    name: 'Attack Bonus',
                                    magnitude: 3,
                                    magnitudeType: 'flat',
                                    category: 'combat'
                                }
                            ],
                            effects: [
                                {
                                    name: 'Lightning Damage',
                                    description: '+2d6 lightning damage',
                                    statusEffect: {
                                        level: 'major',
                                        description: 'Your attacks crackle with lightning'
                                    }
                                },
                                {
                                    name: 'Physical Resistance',
                                    description: 'Resistance to physical damage',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Storm energy protects you'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'minutes',
                            canBeDispelled: false
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
                        id: 'eye_of_the_storm_volketh',
                        name: 'Eye of the Storm',
                        description: 'Create zone of calm protecting allies, but cannot move.',
                        level: 1,
                        icon: 'spell_nature_nullifydisease',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'utility'],
                        typeConfig: {
                            school: 'lightning',
                            secondaryElement: 'protection',
                            icon: 'spell_nature_nullifydisease',
                            tags: ['protection', 'zone', 'allies']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Calm Zone',
                                    description: 'Allies in zone are protected from storm effects',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'The eye of the storm provides safety'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'minutes',
                            durationUnit: 'minutes',
                            canBeDispelled: false
                        },
                        utilityConfig: {
                            utilityType: 'environment',
                            selectedEffects: [{
                                id: 'weather_control',
                                name: 'Weather Control',
                                description: 'Create a 20-foot radius zone of calm weather, protecting allies from storm effects.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'moderate'
                        },
                        targetingConfig: {
                            targetingType: 'area',
                            rangeType: 'self_centered',
                            aoeSize: 20
                        },
                        resourceCost: {
                            actionPoints: 2,
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 }
                        },
                        cooldownConfig: {
                            type: 'short_rest',
                            value: 1
                        }
                    },
                    {
                        id: 'pressure_vulnerability_volketh',
                        name: 'Pressure Vulnerability',
                        description: 'Hurricane-scarred lungs struggle against pressure changes that once nearly crushed them, leaving your body vulnerable to crushing forces that echo the storms of your ancestors.',
                        level: 1,
                        icon: 'ability_warrior_sunder',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'pressure',
                            icon: 'ability_warrior_sunder',
                            tags: ['vulnerability', 'pressure', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Pressure Vulnerability',
                                    description: 'Hurricane-damaged lungs make you vulnerable to crushing attacks that mirror the pressure changes that scarred your ancestors',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
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
                languages: ['Common', 'Auran'],
                speed: 35,
                baseStats: {
                    armor: 0,
                    hp: 28, // Fighters and protectors, damaged lungs but determined - extra durability
                    mana: 8,
                    ap: 4, // Fighters, storm rage - extra action point
                    passivePerception: 1, // Not particularly perceptive
                    swimSpeed: 0, // Not swimmers, calculated from speed
                    climbSpeed: 0, // Not climbers
                    visionRange: 60,
                    darkvision: 0,
                    initiative: 2 // Fighters, quick to react
                },
                savingThrowModifiers: {
                    // Damaged lungs make them vulnerable to poison but determined against exhaustion
                    disadvantage: ['poison'], // Damaged lungs vulnerable to poison
                    advantage: ['exhaustion'] // Fighters push through exhaustion
                }
            }
        }
    };

export default volketh;