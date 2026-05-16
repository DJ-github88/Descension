export const astren = {
    id: 'astren',
    name: 'Astren',
    essence: 'Stellar exiles',
    description: 'Our ancestors did not walk across the land to find this place; they fell from the velvet dark between the stars, bringing the cold of the void with them. We are the children of the meteors, our skin mapped with the silver geometry of constellations that no longer exist in the sky. Our thoughts are not linear, but fractured by the cosmic truths that we carry in our marrow—truths that make the stone walls of your cities feel as thin as wet parchment. When we touch you, you feel the chill of a dying sun; when we speak, we echo the mathematics of the infinite. We move with a grace that is not entirely anchored to the ground, as if we are still waiting for the gravity of our home to reclaim us. We are the heralds of the outside, the witnesses to the vast, uncaring silence of the cosmos, forever seeking a way back to the light we once knew.',
    icon: '/assets/icons/races/astren.png',
    overview: 'The Astren are people whose ancestors literally fell from the stars. Crashing to earth in meteors and comets. Through generations of carrying cosmic energy, their bloodlines have been marked by alien origins. Eyes that reflect unfamiliar constellations. Minds that fracture under cosmic truths. Bodies scarred by the fall. They are organized into crater-communities built around the impact sites where their ancestors landed. Settlements clustered where the void touches earth. The Astren do not choose to be alien. It is their heritage, passed down through bloodlines that remember the great fall.',
    culturalBackground: `Astren society is built on crater-communities organized around the impact sites where their ancestors fell. Settlements clustered where meteors scarred the earth. Each community traces its founding to ancestors who crashed to earth in comets and meteors. Traditions preserving the memory of the great fall. Their craters scar the wilderness like divine wounds. Occupants emerging from the smoke with eyes that reflect constellations never seen from this world. Community elders pass down the old ways. How to channel cosmic energy. How to read star patterns. How to navigate the alien knowledge that fractures mortal minds. They speak of the great fall. Of being cast out from realms where mathematics paint reality and time flows backward. Their minds fracture under the weight of cosmic truths. Seeing futures that have not happened. Remembering lives never lived. Community disputes settle through star-readings and the testimony of those who remember the void best. They bear the cold of the void in their bones. Touch leaving frost patterns that linger for days. Some Astren become wandering prophets. Speaking truths that sound like madness to those who hear them. Others hoard their cosmic knowledge. Becoming enigmatic advisors to kings and warlords. They are a people bound by star and void. Their cosmic knowledge unmatched but their minds forever fractured by truths that break mortal understanding.`,
    variantDiversity: 'The Astren are divided into three major crater bloodlines: The Void-Walkers come from the empty spaces between stars, the Sun-Bound carry the fire of dying suns, and the Star-Mapped embody the patterns written in the constellations.',
    integrationNotes: {
        actionPointSystem: 'Astren abilities focus on cosmic energy, gravity manipulation, and reality warping. Their alien nature provides unique tactical options.',
        backgroundSynergy: 'Astren excel in backgrounds emphasizing knowledge, cosmic power, and alien perspectives. Their otherworldly nature creates compelling roleplay.',
        classCompatibility: 'Astren make excellent cosmic casters, gravity manipulators, and knowledge seekers. Their abilities enhance classes that warp reality.'
    },
    meaningfulTradeoffs: 'Astren gain incredible cosmic powers and alien knowledge but struggle to relate to mortals and risk madness from their own insights.',
    baseTraits: {
        languages: ['Common', 'Celestial', 'Cosmic'],
        lifespan: 'Unknown',
        baseSpeed: 30,
        size: 'Medium',
        height: '5\'6" - 6\'2"',
        weight: '130-190 lbs',
        build: 'Slender and otherworldly'
    },
    subraces: {
        voidwalker: {
            id: 'voidwalker_astren',
            name: 'Void Walker',
            description: 'Coldest touch of all Astren. Skin pale as starlight, eyes dark like the void. Their presence makes air feel thin. They seem to fade slightly at the edges. Many have trouble staying in one place. Their movements sometimes leave trails of shadow. They speak rarely, voices carrying echoes of empty space.',
            culturalBackground: `The Void-Walkers trace their lineage to Astren who fell from the empty spaces between stars. Bloodline marked by the cold void that birthed them. Their tradition requires that every member learn to navigate the spaces between reality. Apprenticeships spent mastering the art of walking paths that others cannot see. Void-Walker craters are built in places where the void touches earth. Members serving as navigators and seekers of hidden knowledge. They practice ancient void-walking techniques passed down through generations. How to step through shadows that are not there. How to hear the void whispers. How to find lost places in the emptiness. They claim the void speaks to them in the silence between heartbeats. Showing them paths through reality that others cannot see. But the void hungers. Prolonged use of their gifts leaves them feeling empty and disconnected. Many Void-Walkers become reclusive seekers of hidden knowledge. Minds filled with too much cosmic silence. The bloodline values knowledge and navigation. Honor measured in paths found and voids traversed. They are the navigators of Astren society. Their void-walking unmatched but their souls forever marked by the emptiness that birthed them.`,
            statModifiers: {
                spirit: 4,
                intelligence: 3,
                agility: 1
            },
            traits: [
                {
                    id: 'void_step_astren',
                    name: 'Void Step',
                    description: 'Teleport through the void between spaces.',
                    level: 1,
                    icon: 'spell_arcane_blink',
                    spellType: 'ACTION',
                    effectTypes: ['utility'],
                    typeConfig: {
                        school: 'void',
                        secondaryElement: 'teleport',
                        icon: 'spell_arcane_blink',
                        tags: ['teleport', 'void', 'movement']
                    },
                    utilityConfig: {
                        utilityType: 'movement',
                        selectedEffects: [{
                            id: 'teleport',
                            name: 'Teleport',
                            description: 'Step through the void to another location within 60 feet.'
                        }],
                        duration: 0,
                        durationUnit: 'instant',
                        power: 'major'
                    },
                    targetingConfig: {
                        targetingType: 'location',
                        rangeType: 'ranged',
                        rangeDistance: 60
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
                    id: 'cosmic_isolation_astren',
                    name: 'Cosmic Isolation',
                    description: 'Immune to mind-affecting effects and fear.',
                    level: 1,
                    icon: 'spell_shadow_antimagicshell',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff'],
                    typeConfig: {
                        school: 'mental',
                        secondaryElement: 'cosmic',
                        icon: 'spell_shadow_antimagicshell',
                        tags: ['immunity', 'mind', 'fear', 'passive']
                    },
                    buffConfig: {
                        buffType: 'statusEffect',
                        effects: [
                            {
                                name: 'Mind Immunity',
                                description: 'Immune to mind-affecting effects',
                                statusEffect: {
                                    level: 'extreme',
                                    description: 'Your alien mind is beyond mortal manipulation'
                                }
                            },
                            {
                                name: 'Fear Immunity',
                                description: 'Immune to fear',
                                statusEffect: {
                                    level: 'extreme',
                                    description: 'The void has shown you true terror'
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
                    id: 'radiant_vulnerability_astren',
                    name: 'Radiant Vulnerability',
                    description: 'Vulnerable to radiant damage (+50% damage) as your void-touched essence reacts violently to purifying solar light.',
                    level: 1,
                    icon: 'Radiant/Radiant Beam',
                    spellType: 'PASSIVE',
                    effectTypes: ['debuff'],
                    typeConfig: {
                        school: 'void',
                        secondaryElement: 'radiant',
                        icon: 'Radiant/Radiant Beam',
                        tags: ['vulnerability', 'radiant', 'void', 'passive']
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            {
                                id: 'damage_vulnerability',
                                name: 'Radiant Vulnerability',
                                description: 'Take 50% more damage from radiant sources.',
                                statusEffect: {
                                    vulnerabilityType: 'radiant',
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
            languages: ['Celestial', 'Cosmic', 'Deep Speech'],
            speed: 30
        },
        sunborn: {
            id: 'sunborn_astren',
            name: 'Sun Bound',
            description: 'Skin warm to the touch, sometimes glowing faintly. Eyes bright like captured starlight. Their presence warms the air around them. Many have hair that seems to flicker like flame. They glow slightly, especially in darkness. Their touch can leave warmth behind. They move with radiant energy, never fully still.',
            culturalBackground: `The Sun-Bound trace their lineage to Astren who fell from dying stars. Bloodline marked by the stellar fire that birthed them. Their tradition requires that every member learn to channel solar energy. Apprenticeships spent mastering the art of controlling the stellar fire within. Sun-Bound craters are built in places where solar energy collects. Members serving as healers, warriors, beacons of light. They practice ancient solar techniques passed down through generations. How to ignite flames with a glance. How to heal with solar warmth. How to channel stellar radiance. Their skin burns warm to the touch even in winter. Presence inspiring hope in dark times. They claim the sun death screams taught them the value of light and warmth. Making them radiant beacons. But the stellar fire consumes them. They must rest in darkness to avoid burning out completely. Many Sun-Bound become wandering healers or warriors of light. Inner fire both blessing and burden. The bloodline values light and warmth. Honor measured in darkness dispelled and wounds healed. They are the beacons of Astren society. Their solar fire unmatched but their bodies forever marked by the dying stars that birthed them.`,
            statModifiers: {
                strength: 2,
                charisma: 3,
                spirit: -2
            },
            traits: [
                {
                    id: 'stellar_radiance_astren',
                    name: 'Stellar Radiance',
                    description: 'Emit intense light and heat. Damage nearby enemies.',
                    level: 1,
                    icon: 'spell_holy_innerfire',
                    spellType: 'ACTION',
                    effectTypes: ['damage'],
                    typeConfig: {
                        school: 'fire',
                        secondaryElement: 'radiant',
                        icon: 'spell_holy_innerfire',
                        tags: ['radiant', 'fire', 'aoe', 'damage']
                    },
                    damageConfig: {
                        damageType: 'direct',
                        elementType: 'radiant',
                        formula: '2d6'
                    },
                    targetingConfig: {
                        targetingType: 'area',
                        rangeType: 'self_centered',
                        aoeSize: 10
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
                    id: 'solar_healing_astren',
                    name: 'Solar Healing',
                    description: 'While in direct sunlight, you regain 1d4 + your proficiency bonus hit points at the start of each of your turns. This regeneration does not function while you are at 0 HP or unconscious.',
                    level: 1,
                    icon: 'spell_holy_renew',
                    spellType: 'PASSIVE',
                    effectTypes: ['healing'],
                    typeConfig: {
                        school: 'healing',
                        secondaryElement: 'solar',
                        icon: 'spell_holy_renew',
                        tags: ['healing', 'regeneration', 'solar', 'passive']
                    },
                    healingConfig: {
                        healingType: 'hot',
                        formula: '1d4 + proficiency',
                        hasHotEffect: true,
                        hotTickInterval: 1,
                        hotDuration: 'while in direct sunlight (no effect at 0 HP or while unconscious)'
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
                    }
                },
                {
                    id: 'necrotic_vulnerability_sunborn_astren',
                    name: 'Necrotic Vulnerability',
                    description: 'Vulnerable to necrotic damage (+50% damage) as the encroaching darkness of the void seeks to extinguish your inner stellar fire.',
                    level: 1,
                    icon: 'Necrotic/Necrotic Decay 1',
                    spellType: 'PASSIVE',
                    effectTypes: ['debuff'],
                    typeConfig: {
                        school: 'radiant',
                        secondaryElement: 'necrotic',
                        icon: 'Necrotic/Necrotic Decay 1',
                        tags: ['vulnerability', 'necrotic', 'shadow', 'passive']
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            {
                                id: 'damage_vulnerability',
                                name: 'Necrotic Vulnerability',
                                description: 'Take 50% more damage from necrotic sources.',
                                statusEffect: {
                                    vulnerabilityType: 'necrotic',
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
            languages: ['Common', 'Celestial', 'Ignan'],
            speed: 30,
            baseStats: {
                armor: 0,
                hp: 10, // Stellar fire gives them some durability but consumes their spirit
                mana: 15, // Moderate stellar energy grants some mana
                ap: 3, // Radiant energy gives them standard action points
                passivePerception: 12, // Stellar awareness enhances perception
                swimSpeed: 5, // Not natural swimmers, water can quench their fire
                climbSpeed: 5, // Not natural climbers
                visionRange: 65,
                darkvision: 0,
                initiative: 1 // Radiant energy makes them quick to react
            },
            savingThrowModifiers: {
                // Stellar fire provides advantage against cold and darkness effects
                advantage: ['stun', 'fear'] // Inner fire resists cold shock and fear effects
            }
        },
        constellation: {
            id: 'constellation_astren',
            name: 'Star Mapped',
            description: 'Skin marked with patterns like constellations. These patterns sometimes glow faintly at night. Eyes reflect star patterns when they focus. Many have trouble focusing on immediate things. They move with purpose that seems driven by unseen forces. Their presence makes you feel watched by distant stars. Many wear robes that reveal their patterns.',
            culturalBackground: `The Star-Mapped trace their lineage to Astren who fell bearing the patterns of constellations. Bloodline marked by star-maps etched into their very essence. Their tradition requires that every member learn to read the patterns written in the heavens. Apprenticeships spent mastering the art of navigating by stars and reading fate in constellations. Star-Mapped craters are built under open skies where the stars are clearest. Members serving as astronomers, prophets, counselors. They practice ancient star-reading techniques passed down through generations. How to read fate in star patterns. How to navigate by the night sky. How to see the grand patterns in random events. Their skin bears the patterns of constellations. Souls mapped by the stars themselves. They claim the stars guide their fates. Showing them destinies written in the heavens. But this cosmic awareness overwhelms them. They struggle to focus on immediate concerns. Minds always reaching for the bigger picture. Many Star-Mapped become astronomers or prophets. Living under open skies. The bloodline values knowledge and prophecy. Honor measured in patterns read and fates understood. They are the seers of Astren society. Their star-reading unmatched but their minds forever fractured by patterns that cannot be unseen.`,
            statModifiers: {
                spirit: 4,
                intelligence: 3,
                agility: 1
            },
            traits: [
                {
                    id: 'star_reading_astren',
                    name: 'Star Reading',
                    description: 'Read fate in the stars. Gain advantage on one divination check.',
                    level: 1,
                    icon: 'spell_holy_prophecy',
                    spellType: 'ACTION',
                    effectTypes: ['utility'],
                    typeConfig: {
                        school: 'divination',
                        secondaryElement: 'cosmic',
                        icon: 'spell_holy_prophecy',
                        tags: ['divination', 'fate', 'stars']
                    },
                    utilityConfig: {
                        utilityType: 'divination',
                        selectedEffects: [{
                            id: 'fate',
                            name: 'Fate',
                            description: 'Read the patterns in the stars to divine the future.'
                        }],
                        duration: 0,
                        durationUnit: 'instant',
                        power: 'moderate'
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
                    id: 'constellation_form_astren',
                    name: 'Constellation Form',
                    description: 'Transform into starlight. Become intangible but cannot affect physical world.',
                    level: 1,
                    icon: 'spell_arcane_blink',
                    spellType: 'ACTION',
                    effectTypes: ['transformation', 'buff'],
                    typeConfig: {
                        school: 'transmutation',
                        secondaryElement: 'starlight',
                        icon: 'spell_arcane_blink',
                        tags: ['transformation', 'intangible', 'starlight']
                    },
                    buffConfig: {
                        buffType: 'statusEffect',
                        effects: [
                            {
                                name: 'Starlight Form',
                                description: 'Become intangible',
                                statusEffect: {
                                    level: 'major',
                                    description: 'You become made of pure starlight'
                                }
                            }
                        ],
                        durationValue: 1,
                        durationType: 'minutes',
                        durationUnit: 'minutes',
                        canBeDispelled: true
                    },
                    transformationConfig: {
                        transformationType: 'elemental',
                        targetType: 'self',
                        duration: 1,
                        durationUnit: 'minutes',
                        power: 'major',
                        specialEffects: ['intangible', 'luminous', 'cannot_attack']
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
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
                    id: 'psychic_vulnerability_starborn_astren',
                    name: 'Psychic Vulnerability',
                    description: 'Vulnerable to psychic damage (+50% damage) as your cosmic awareness leaves your mind exposed to mental intrusions.',
                    level: 1,
                    icon: 'Psychic/Mental Dissaray',
                    spellType: 'PASSIVE',
                    effectTypes: ['debuff'],
                    typeConfig: {
                        school: 'cosmic',
                        secondaryElement: 'psychic',
                        icon: 'Psychic/Mental Dissaray',
                        tags: ['vulnerability', 'psychic', 'cosmic', 'passive']
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            {
                                id: 'damage_vulnerability',
                                name: 'Psychic Vulnerability',
                                description: 'Take 50% more damage from psychic sources.',
                                statusEffect: {
                                    vulnerabilityType: 'psychic',
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
            languages: ['Common', 'Celestial', 'Cosmic'],
            speed: 30,
            baseStats: {
                armor: 0,
                hp: 5, // Cosmic awareness makes them physically frail
                mana: 12, // Strong connection to the stars grants enhanced mana
                ap: 2, // Minds filled with cosmic patterns, less action-oriented
                passivePerception: 13, // Cosmic awareness enhances perception
                swimSpeed: 10, // Not natural swimmers
                climbSpeed: 10, // Not natural climbers
                visionRange: 60,
                darkvision: 30,
                initiative: -1 // Cosmic awareness makes them slower to react to immediate threats
            },
            savingThrowModifiers: {
                // Cosmic awareness provides advantage against divination and mental effects
                advantage: ['charm', 'fear', 'stun'] // Star reading resists mental control, fear, and confusion
            }
        }
    }
}
};;

export default astren;