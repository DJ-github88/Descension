export const morthel = {
        id: 'morthel',
        name: 'Morthel',
        essence: 'Shadow-bound revenants',
        description: 'Our voices are the rustle of dead leaves in an empty hallway, thin and carrying the chill of the grave. We are the people of the long twilight, those whose shadows have grown longer than their bodies, reaching for the voids between the stars. Our skin is the color of bone beneath a clouded moon, and our touch is a promise of the stillness that awaits all things. We do not walk through the world so much as we haunt it, moving through the periphery of your vision like a half-remembered dream. The grief of a thousand years is etched into our features, a sorrow so deep it has become a kind of strength. We are the keepers of the forgotten names, the silent observers of the passing of ages. To look into our eyes is to see the end of the road, the final sunset that never quite fades into total night. We are not dead, but we have forgotten how to be truly alive.',
        icon: 'fas fa-skull',
        overview: 'The Neth are people whose ancestors swore impossible oaths. To guard treasures until mountains crumble. To protect secrets until stars fall. Through generations of these death-bound promises, their bloodlines have been marked by undeath. Bodies that refuse to decay. Minds that outlast centuries. Souls bound by vows that transcend death. They are organized into tomb-communities built around the graves they guard. Settlements clustered in mausoleums and necropolises. The Neth do not choose to be undead. It is their heritage, passed down through bloodlines that carry the weight of ancient oaths.',
        culturalBackground: `Neth society is built on tomb-communities organized around the graves and treasures they guard. Settlements clustered in mausoleums and necropolises. Each community traces its founding to ancestors who swore impossible vows. To guard treasures until the mountains crumble. To protect secrets until the stars fall from the sky. Their tombs are silent libraries of the dead. Walls inscribed with oaths that bind souls long after bodies have failed. Community elders pass down the old ways. How to maintain undead bodies. How to fulfill oaths that span centuries. How to guard what was sworn to protect. Death was supposed to release them. But their promises held tighter than any grave. Now they shuffle through eternal night. Flesh rotting but never failing. Minds sharp as the day they died. Community disputes settle through oath-readings and the testimony of those who have guarded longest. They speak of the living with distant pity. Remembering warmth and emotion like half-forgotten dreams. Some Neth embrace their immortality. Becoming patient strategists who outlast any enemy. Others claw at their own tombs. Desperate to complete their duties and finally rest. They are a people bound by oath and undeath. Their guardianship unmatched but their souls forever trapped by promises that cannot be broken.`,
        variantDiversity: 'The Neth are divided into two major tomb bloodlines: The Vault-Keepers are bound by oaths to guard treasures and hoards, while the Dust-Scribes are bound by oaths to preserve knowledge and secrets.',
        integrationNotes: {
            actionPointSystem: 'Neth abilities focus on durability, undead resilience, and obsessive dedication. Their immortal nature provides unique advantages but comes with compulsions.',
            backgroundSynergy: 'Neth excel in backgrounds emphasizing knowledge, dedication, and endurance. Their undead nature creates unique roleplay challenges and opportunities.',
            classCompatibility: 'Neth make excellent tanks, knowledge specialists, and undead-themed casters. Their immunities and resilience enhance classes that benefit from durability.'
        },
        meaningfulTradeoffs: 'Neth gain undead immunities and immortality but are bound by compulsions, vulnerable to radiant damage, and disconnected from the living world. They struggle with their cursed existence.',
        baseTraits: {
            languages: ['Common', 'Necril'],
            lifespan: 'Immortal (cursed)',
            baseSpeed: 25,
            size: 'Medium',
            height: '5\'6" - 6\'2"',
            weight: '120-180 lbs',
            build: 'Gaunt and preserved'
        },
        subraces: {
            hoarder: {
                id: 'hoarder_neth',
                name: 'Vault Keeper',
                description: 'Bodies most preserved of all Graveworn, decay slowed by proximity to treasures. Eyes constantly scanning, always watching. Hands often show wear from handling coins and gems. Many develop a habit of counting and organizing. Their gaze seems to follow anyone near their guarded items. They move stiffly, joints protesting after centuries of standing guard.',
                culturalBackground: `The Vault-Keepers trace their lineage to Graveworn who swore oaths to guard treasures until death. Bloodline marked by eternal guardianship of hoards and vaults. Their tradition requires that every member learn to appraise and protect treasures. Apprenticeships spent mastering the art of guarding what was sworn to protect. Vault-Keeper tombs are built around the treasures they guard. Members serving as eternal sentinels in forgotten vaults. They practice ancient guardianship techniques passed down through generations. How to ward against thieves. How to sense the worth of treasures. How to maintain vigilance for centuries. Their presence wards against thieves. Mere gaze causing shadows to deepen and locks to strengthen. But their obsession grows. They begin to see people as potential thieves. Protective instincts turning paranoid. Many Vault-Keepers live in isolation. Tombs becoming prisons of their own making. The bloodline values protection and dedication. Honor measured in treasures guarded and oaths kept. They are the guardians of Graveworn society. Their vigilance unmatched but their souls forever bound by vows that cannot be broken.`,
                statModifiers: {
                    constitution: 3,
                    strength: 2,
                    intelligence: 1
                },
                traits: [
                    {
                        id: 'treasure_sense_morthel',
                        name: 'Treasure Sense',
                        description: 'Detect valuable items within 120 feet and know their worth.',
                        level: 1,
                        icon: 'inv_misc_coin_01',
                        spellType: 'ACTION',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'detection',
                            secondaryElement: 'treasure',
                            icon: 'inv_misc_coin_01',
                            tags: ['detection', 'treasure', 'appraisal']
                        },
                        utilityConfig: {
                            utilityType: 'detection',
                            selectedEffects: [{
                                id: 'treasure',
                                name: 'Treasure',
                                description: 'Detect valuable items within 120 feet and know their worth.'
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
                        id: 'undead_resilience_morthel',
                        name: 'Undead Resilience',
                        description: 'Immune to poison, disease, and exhaustion.',
                        level: 1,
                        icon: 'spell_shadow_deathsembrace',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'undead',
                            secondaryElement: 'resilience',
                            icon: 'spell_shadow_deathsembrace',
                            tags: ['immunity', 'undead', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Poison Immunity',
                                    description: 'Immune to poison damage and effects',
                                    statusEffect: {
                                        level: 'extreme',
                                        description: 'Your undead nature is unaffected by toxins'
                                    }
                                },
                                {
                                    name: 'Disease Immunity',
                                    description: 'Immune to disease',
                                    statusEffect: {
                                        level: 'extreme',
                                        description: 'Your undead body cannot be infected'
                                    }
                                },
                                {
                                    name: 'Exhaustion Immunity',
                                    description: 'Immune to exhaustion',
                                    statusEffect: {
                                        level: 'extreme',
                                        description: 'Your undead body needs no rest'
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
                        id: 'radiant_vulnerability_morthel_hoarder',
                        name: 'Radiant Vulnerability',
                        description: 'Your undead essence rebels against the purifying light of life, making holy energies burn through your preserved form.',
                        level: 1,
                        icon: 'spell_holy_holybolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'radiant',
                            icon: 'spell_holy_holybolt',
                            tags: ['vulnerability', 'radiant', 'undead', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Radiant Vulnerability',
                                    description: 'Take +50% damage from radiant sources',
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
                languages: ['Common', 'Necril', 'Draconic'],
                speed: 25,
                baseStats: {
                    armor: 0,
                    hp: 30, // Most preserved, decay slowed by proximity to treasures - extra durability
                    mana: 8,
                    ap: 2, // Move stiffly, joints protesting - less action-oriented
                    passivePerception: 3, // Eyes constantly scanning, always watching, Treasure Sense
                    swimSpeed: 0, // Undead, poor swimmers (bodies refuse to decay but not good in water)
                    climbSpeed: 0, // Move stiffly, not climbers
                    visionRange: 60,
                    darkvision: 60, // Undead, can see in darkness
                    initiative: -2 // Move stiffly, joints protesting - slow to react
                },
                savingThrowModifiers: {
                    // Undead nature makes them vulnerable to radiant but resistant to mental effects
                    disadvantage: ['blinded'], // Radiant damage harms undead eyes
                    advantage: ['fear'] // Undead resilience against fear
                }
            },
            scholar: {
                id: 'scholar_neth',
                name: 'Dust Scribe',
                description: 'Bodies covered in dust from handling ancient texts. Fingers stained with ink that never washes off. Eyes glow with accumulated knowledge. They move slowly, carefully, as if afraid to damage something fragile. Many have quills and scrolls always at hand. Their speech sometimes references ancient events as if they happened yesterday.',
                culturalBackground: `The Dust-Scribes trace their lineage to Graveworn who swore oaths to protect scrolls and secrets until the end of time. Bloodline marked by eternal preservation of knowledge. Their tradition requires that every member learn to preserve and archive knowledge. Apprenticeships spent mastering the art of maintaining perfect memory across centuries. Dust-Scribe tombs are built around libraries and archives. Members serving as eternal scholars in forgotten repositories. They practice ancient preservation techniques passed down through generations. How to maintain perfect memory. How to preserve texts through undeath. How to guard secrets that must never be lost. Their minds are vast repositories of forgotten lore. Capable of recalling any text they have read. They are patient researchers. Capable of spending centuries deciphering ancient mysteries. But this knowledge comes at a cost. They lose touch with current events. Minds filled with too many voices from the past. Many Dust-Scribes become reclusive scholars in forgotten libraries. Bodies slowly crumbling like the pages they protect. The bloodline values knowledge and preservation. Honor measured in secrets guarded and wisdom preserved. They are the archivists of Graveworn society. Their memory unmatched but their souls forever bound by oaths to preserve what others have forgotten.`,
                statModifiers: {
                    intelligence: 3,
                    spirit: 2,
                    strength: -2
                },
                traits: [
                    {
                        id: 'perfect_memory_morthel',
                        name: 'Perfect Memory',
                        description: 'Perfect recall of everything you\'ve read. Can learn languages and skills permanently.',
                        level: 1,
                        icon: 'spell_holy_mindvision',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'knowledge',
                            secondaryElement: 'undead',
                            icon: 'spell_holy_mindvision',
                            tags: ['memory', 'knowledge', 'undead', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Perfect Recall',
                                    description: 'Remember everything you have read',
                                    statusEffect: {
                                        level: 'major',
                                        description: 'Your undead mind preserves all knowledge'
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
                        id: 'deathless_vigil_morthel',
                        name: 'Deathless Vigil',
                        description: 'No need for sleep. Can work continuously for days.',
                        level: 1,
                        icon: 'spell_shadow_demonicfortitude',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'undead',
                            secondaryElement: 'endurance',
                            icon: 'spell_shadow_demonicfortitude',
                            tags: ['sleepless', 'undead', 'endurance', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'No Sleep Needed',
                                    description: 'You do not need to sleep',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Your undead body requires no rest'
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
                        id: 'radiant_vulnerability_morthel_scholar',
                        name: 'Radiant Vulnerability',
                        description: 'The spark of unlife within you recoils from the holy radiance that banishes the dead, searing through your preserved intellect.',
                        level: 1,
                        icon: 'spell_holy_holybolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'radiant',
                            icon: 'spell_holy_holybolt',
                            tags: ['vulnerability', 'radiant', 'undead', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Radiant Vulnerability',
                                    description: 'Take +50% damage from radiant sources',
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
                languages: ['Common', 'Necril', 'All Ancient Languages'],
                speed: 25,
                baseStats: {
                    armor: 0,
                    hp: -5, // Bodies covered in dust, physically frail
                    mana: 10, // Perfect memory, vast repositories of knowledge - extra mana
                    ap: 2, // Move slowly, carefully - less action-oriented
                    passivePerception: 3, // Eyes glow with accumulated knowledge, perfect recall
                    swimSpeed: 0, // Undead, poor swimmers
                    climbSpeed: 0, // Move slowly, carefully, not climbers
                    visionRange: 60,
                    darkvision: 60, // Undead, can see in darkness
                    initiative: -2 // Move slowly, carefully - slow to react
                },
                savingThrowModifiers: {
                    // Undead nature makes them vulnerable to radiant but knowledgeable against confusion
                    disadvantage: ['blinded'], // Radiant damage harms undead eyes
                    advantage: ['stun'] // Vast knowledge protects against confusion
                }
            }
        }
    };

export default morthel;