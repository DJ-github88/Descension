/**
 * Enhanced Background Data Module
 * 
 * Defines all 9 custom backgrounds with sub-backgrounds and spell-like abilities
 * Structure mirrors the race/subrace system with:
 * - Overview and thematic description
 * - Mechanical benefits (stat bonuses, passive abilities)
 * - Sub-backgrounds (specializations) - 3 per background
 * - Selectable abilities (6-8 per sub-background, choose 2)
 * - Abilities formatted like spells with detailed mechanics
 */

export const ENHANCED_BACKGROUNDS = {
    zealot: {
        id: 'zealot',
        name: 'Zealot',
        description: 'Driven by unwavering faith and spiritual conviction',
        icon: 'fas fa-cross',
        overview: 'Zealots draw strength from unwavering faith and spiritual conviction. Whether serving divine entities or abstract ideals, they channel spiritual energy into tangible power, often making personal sacrifices to strengthen their connection to higher powers.',
        
        mechanicalBenefits: [
            {
                name: 'Wisdom Bonus',
                description: '+1 to Wisdom attribute checks',
                type: 'stat'
            },
            {
                name: 'Faithful Resolve',
                description: 'Advantage on saves against fear and charm',
                type: 'passive'
            },
            {
                name: 'Corruption Sense',
                description: 'Can sense general presence of corruption',
                type: 'passive'
            }
        ],

        // Integration with game systems
        integrationNotes: {
            actionPointSystem: 'Zealot abilities often cost 2-3 AP and provide powerful combat or support effects. Divine abilities may have faith-based requirements.',
            backgroundSynergy: 'Works well with Sentinel (guardian themes) or Mystic (spiritual power) backgrounds.',
            classCompatibility: 'Particularly strong with Paladin, Cleric, or Warrior classes. Divine abilities complement holy magic and righteous combat.'
        },

        // Roleplaying guidance
        roleplayingTips: [
            'Consider how your background shapes your worldview and motivations',
            'Think about how your abilities manifest and what they mean to your character',
            'Explore the relationship between your background and your class choice',
            'Use your background abilities creatively in both combat and roleplay situations'
        ],

        thematicElements: {
            corePhilosophy: 'Zealots draw strength from unwavering faith and spiritual conviction. Whether serving divine entities or abstract ideals, they channel spiritual energy into tangible power, often making personal sacrifices to strengthen their connection to higher powers.',
            mechanicalIntegration: 'Your background abilities are designed to work seamlessly with the Action Point system and complement any class choice.'
        },

        // Sub-backgrounds (specializations)
        subBackgrounds: {
            divineCrusader: {
                id: 'divine_crusader',
                name: 'Divine Crusader',
                description: 'Warriors who fight in the name of their faith',
                theme: 'Combat prowess and righteous fury',
                icon: 'fas fa-sword',
                
                // Abilities pool (choose 2)
                abilities: [
                    {
                        id: 'holy_strike',
                        name: 'Holy Strike',
                        description: 'Imbue your weapon with divine energy, dealing radiant damage to enemies of your faith',
                        icon: 'spell_holy_holysmite',
                        type: 'active',
                        effectType: 'damage',
                        usage: '1/Short Rest',
                        apCost: 2,
                        targeting: {
                            range: 'Melee',
                            targets: 1,
                            areaType: 'single'
                        },
                        effects: {
                            damage: {
                                formula: '2d8',
                                type: 'radiant',
                                scaling: 'Increases to 3d8 against undead or fiends'
                            }
                        },
                        restrictions: 'Must be wielding a melee weapon',
                        details: 'As a bonus action, your next melee attack deals an additional 2d8 radiant damage. Against undead or fiends, this increases to 3d8.'
                    },
                    {
                        id: 'righteous_fury',
                        name: 'Righteous Fury',
                        description: 'Channel divine wrath to enhance your combat abilities',
                        icon: 'spell_holy_crusade',
                        type: 'active',
                        effectType: 'buff',
                        usage: '1/Long Rest',
                        apCost: 3,
                        targeting: {
                            range: 'Self',
                            targets: 1,
                            areaType: 'self'
                        },
                        effects: {
                            buff: {
                                duration: '1 minute',
                                effects: [
                                    '+2 to attack rolls',
                                    '+1d6 radiant damage on all attacks',
                                    'Resistance to necrotic damage'
                                ]
                            }
                        },
                        restrictions: 'Cannot be used while under fear effects',
                        details: 'For 1 minute, you gain +2 to attack rolls, deal an extra 1d6 radiant damage on all attacks, and have resistance to necrotic damage.'
                    },
                    {
                        id: 'divine_shield',
                        name: 'Divine Shield',
                        description: 'Summon a protective barrier of holy light',
                        icon: 'spell_holy_divineintervention',
                        type: 'active',
                        effectType: 'buff',
                        usage: '1/Short Rest',
                        apCost: 2,
                        targeting: {
                            range: 'Self or Touch',
                            targets: 1,
                            areaType: 'single'
                        },
                        effects: {
                            buff: {
                                duration: '3 rounds',
                                effects: [
                                    'Absorbs 2d10 + Wisdom modifier damage',
                                    'Grants advantage on saves vs. evil creatures'
                                ]
                            }
                        },
                        details: 'Create a shield that absorbs 2d10 + Wisdom modifier damage for 3 rounds. While active, grants advantage on saves against effects from evil creatures.'
                    },
                    {
                        id: 'smite_evil',
                        name: 'Smite Evil',
                        description: 'Call down divine judgment on your foes',
                        icon: 'spell_holy_prayerofhealing',
                        type: 'active',
                        effectType: 'damage',
                        usage: '1/Combat',
                        apCost: 4,
                        targeting: {
                            range: '30 feet',
                            targets: 1,
                            areaType: 'single'
                        },
                        effects: {
                            damage: {
                                formula: '4d6',
                                type: 'radiant',
                                scaling: 'Double damage against undead, fiends, or evil-aligned creatures'
                            },
                            debuff: {
                                duration: '2 rounds',
                                effects: ['Target is blinded if they fail a Wisdom save']
                            }
                        },
                        restrictions: 'Target must be hostile',
                        details: 'Deal 4d6 radiant damage (doubled against undead/fiends/evil). Target must make a Wisdom save or be blinded for 2 rounds.'
                    },
                    {
                        id: 'crusaders_resolve',
                        name: 'Crusader\'s Resolve',
                        description: 'Your faith makes you nearly unstoppable',
                        icon: 'spell_holy_restoration',
                        type: 'passive',
                        effectType: 'buff',
                        usage: 'Passive',
                        apCost: 0,
                        targeting: {
                            range: 'Self',
                            targets: 1,
                            areaType: 'self'
                        },
                        effects: {
                            buff: {
                                duration: 'Permanent',
                                effects: [
                                    'When reduced to 0 HP, may make a Wisdom save (DC 10 + damage taken) to drop to 1 HP instead',
                                    'Can only trigger once per long rest'
                                ]
                            }
                        },
                        details: 'When you would be reduced to 0 hit points, you can make a Wisdom save to drop to 1 HP instead. This can only happen once per long rest.'
                    },
                    {
                        id: 'holy_ground',
                        name: 'Holy Ground',
                        description: 'Consecrate the area around you with divine power',
                        icon: 'spell_holy_innerfire',
                        type: 'active',
                        effectType: 'utility',
                        usage: '1/Long Rest',
                        apCost: 3,
                        targeting: {
                            range: 'Self',
                            targets: 'All allies within 15 feet',
                            areaType: 'radius'
                        },
                        effects: {
                            buff: {
                                duration: '1 minute',
                                effects: [
                                    'Allies gain +1 AC',
                                    'Undead and fiends have disadvantage on attacks',
                                    'Area counts as consecrated ground'
                                ]
                            }
                        },
                        details: 'Create a 15-foot radius of holy ground for 1 minute. Allies gain +1 AC, undead/fiends have disadvantage on attacks, and the area is consecrated.'
                    }
                ]
            },

            sacredHealer: {
                id: 'sacred_healer',
                name: 'Sacred Healer',
                description: 'Compassionate souls who mend wounds and cure ailments',
                theme: 'Healing and protective magic',
                icon: 'fas fa-hand-holding-heart',
                
                abilities: [
                    {
                        id: 'healing_touch',
                        name: 'Healing Touch',
                        description: 'Channel divine energy to heal wounds',
                        icon: 'spell_holy_flashheal',
                        type: 'active',
                        effectType: 'healing',
                        usage: '3/Long Rest',
                        apCost: 2,
                        targeting: {
                            range: 'Touch',
                            targets: 1,
                            areaType: 'single'
                        },
                        effects: {
                            healing: {
                                formula: '2d8 + Wisdom modifier',
                                type: 'instant'
                            }
                        },
                        details: 'Touch a creature to restore 2d8 + Wisdom modifier hit points. Can be used 3 times per long rest.'
                    },
                    {
                        id: 'cure_ailment',
                        name: 'Cure Ailment',
                        description: 'Remove diseases, poisons, and curses',
                        icon: 'spell_holy_purify',
                        type: 'active',
                        effectType: 'utility',
                        usage: '1/Short Rest',
                        apCost: 3,
                        targeting: {
                            range: 'Touch',
                            targets: 1,
                            areaType: 'single'
                        },
                        effects: {
                            utility: {
                                effects: [
                                    'Remove one disease',
                                    'Neutralize one poison',
                                    'End one curse (DC 15 Wisdom check)'
                                ]
                            }
                        },
                        details: 'Touch a creature to remove one disease, neutralize one poison, or attempt to end one curse (DC 15 Wisdom check).'
                    },
                    {
                        id: 'prayer_of_healing',
                        name: 'Prayer of Healing',
                        description: 'Lead a prayer that heals multiple allies',
                        icon: 'spell_holy_prayerofhealing02',
                        type: 'active',
                        effectType: 'healing',
                        usage: '1/Long Rest',
                        apCost: 4,
                        targeting: {
                            range: '30 feet',
                            targets: 'Up to 6 allies',
                            areaType: 'multi'
                        },
                        effects: {
                            healing: {
                                formula: '1d8 + Wisdom modifier',
                                type: 'instant'
                            }
                        },
                        restrictions: 'Requires 1 minute of prayer',
                        details: 'After 1 minute of prayer, up to 6 allies within 30 feet regain 1d8 + Wisdom modifier hit points.'
                    },
                    {
                        id: 'divine_ward',
                        name: 'Divine Ward',
                        description: 'Place a protective ward on an ally',
                        icon: 'spell_holy_powerwordbarrier',
                        type: 'active',
                        effectType: 'buff',
                        usage: '1/Short Rest',
                        apCost: 2,
                        targeting: {
                            range: '30 feet',
                            targets: 1,
                            areaType: 'single'
                        },
                        effects: {
                            buff: {
                                duration: '1 hour',
                                effects: [
                                    'Next time target would take damage, reduce it by 2d10',
                                    'Ward then expires'
                                ]
                            }
                        },
                        details: 'Place a ward on an ally that lasts 1 hour. The next time they would take damage, reduce it by 2d10, then the ward expires.'
                    },
                    {
                        id: 'blessed_resilience',
                        name: 'Blessed Resilience',
                        description: 'Grant an ally temporary fortitude',
                        icon: 'spell_holy_blessedresillience',
                        type: 'active',
                        effectType: 'buff',
                        usage: '3/Long Rest',
                        apCost: 1,
                        targeting: {
                            range: 'Touch',
                            targets: 1,
                            areaType: 'single'
                        },
                        effects: {
                            buff: {
                                duration: '1 hour',
                                effects: [
                                    'Target gains temporary HP equal to your Wisdom modifier + your level',
                                    'Advantage on Constitution saves'
                                ]
                            }
                        },
                        details: 'Touch an ally to grant them temporary HP equal to Wisdom modifier + your level and advantage on Constitution saves for 1 hour.'
                    },
                    {
                        id: 'martyrs_sacrifice',
                        name: 'Martyr\'s Sacrifice',
                        description: 'Transfer wounds from an ally to yourself',
                        icon: 'spell_holy_painsupression',
                        type: 'active',
                        effectType: 'healing',
                        usage: '1/Long Rest',
                        apCost: 2,
                        targeting: {
                            range: '30 feet',
                            targets: 1,
                            areaType: 'single'
                        },
                        effects: {
                            healing: {
                                formula: 'Up to 3d10',
                                type: 'transfer'
                            }
                        },
                        restrictions: 'You take half the damage healed',
                        details: 'Heal an ally for up to 3d10 hit points. You take half the amount healed as damage (cannot be reduced).'
                    },
                    {
                        id: 'sanctuary',
                        name: 'Sanctuary',
                        description: 'Protect an ally from harm',
                        icon: 'spell_holy_holyprotection',
                        type: 'active',
                        effectType: 'buff',
                        usage: '1/Short Rest',
                        apCost: 3,
                        targeting: {
                            range: 'Touch',
                            targets: 1,
                            areaType: 'single'
                        },
                        effects: {
                            buff: {
                                duration: '1 minute',
                                effects: [
                                    'Attackers must make Wisdom save or choose a different target',
                                    'Ends if target attacks or casts a harmful spell'
                                ]
                            }
                        },
                        details: 'For 1 minute, creatures attacking the target must make a Wisdom save or choose a different target. Ends if target attacks.'
                    }
                ]
            },

            faithInquisitor: {
                id: 'faith_inquisitor',
                name: 'Faith Inquisitor',
                description: 'Investigators who root out corruption and heresy',
                theme: 'Detection and purification',
                icon: 'fas fa-eye',

                abilities: [
                    {
                        id: 'detect_evil',
                        name: 'Detect Evil',
                        description: 'Sense the presence of evil and corruption',
                        icon: 'spell_holy_sealofwisdom',
                        type: 'active',
                        effectType: 'utility',
                        usage: 'At Will',
                        apCost: 1,
                        targeting: {
                            range: '60 feet',
                            targets: 'All creatures',
                            areaType: 'radius'
                        },
                        effects: {
                            utility: {
                                duration: '1 minute',
                                effects: [
                                    'Sense presence of evil creatures',
                                    'Detect undead, fiends, and aberrations',
                                    'Identify cursed objects'
                                ]
                            }
                        },
                        details: 'For 1 minute, sense the presence of evil creatures, undead, fiends, aberrations, and cursed objects within 60 feet.'
                    },
                    {
                        id: 'purifying_flame',
                        name: 'Purifying Flame',
                        description: 'Burn away corruption with holy fire',
                        icon: 'spell_holy_searinglightpriest',
                        type: 'active',
                        effectType: 'damage',
                        usage: '1/Short Rest',
                        apCost: 3,
                        targeting: {
                            range: '30 feet',
                            targets: 1,
                            areaType: 'single'
                        },
                        effects: {
                            damage: {
                                formula: '3d6',
                                type: 'radiant',
                                scaling: 'Double damage to cursed or corrupted creatures'
                            },
                            utility: {
                                effects: ['Removes one curse or corruption effect on hit']
                            }
                        },
                        details: 'Deal 3d6 radiant damage (doubled against cursed/corrupted creatures) and remove one curse or corruption effect.'
                    },
                    {
                        id: 'truth_seeker',
                        name: 'Truth Seeker',
                        description: 'Compel a creature to speak truthfully',
                        icon: 'spell_holy_divinepurpose',
                        type: 'active',
                        effectType: 'control',
                        usage: '1/Long Rest',
                        apCost: 2,
                        targeting: {
                            range: '30 feet',
                            targets: 1,
                            areaType: 'single'
                        },
                        effects: {
                            control: {
                                duration: '10 minutes',
                                effects: [
                                    'Target must make Wisdom save or cannot lie',
                                    'You know if they succeed on the save',
                                    'Target is aware of the effect'
                                ]
                            }
                        },
                        details: 'Target makes a Wisdom save or cannot lie for 10 minutes. You know if they succeed, and they are aware of the effect.'
                    },
                    {
                        id: 'banish_corruption',
                        name: 'Banish Corruption',
                        description: 'Drive out evil spirits and corruption',
                        icon: 'spell_holy_dispelmagic',
                        type: 'active',
                        effectType: 'utility',
                        usage: '1/Long Rest',
                        apCost: 4,
                        targeting: {
                            range: 'Touch',
                            targets: 1,
                            areaType: 'single'
                        },
                        effects: {
                            utility: {
                                effects: [
                                    'Remove all curses from target',
                                    'End possession effects',
                                    'Purge corruption',
                                    'Requires 1 minute ritual'
                                ]
                            }
                        },
                        restrictions: 'Requires 1 minute ritual',
                        details: 'After a 1-minute ritual, remove all curses, end possession, and purge corruption from a creature or object.'
                    },
                    {
                        id: 'inquisitors_gaze',
                        name: 'Inquisitor\'s Gaze',
                        description: 'See through lies and illusions',
                        icon: 'spell_holy_sealofwisdom',
                        type: 'passive',
                        effectType: 'utility',
                        usage: 'Passive',
                        apCost: 0,
                        targeting: {
                            range: 'Self',
                            targets: 1,
                            areaType: 'self'
                        },
                        effects: {
                            utility: {
                                duration: 'Permanent',
                                effects: [
                                    'Advantage on Insight checks to detect lies',
                                    'Can see through illusions with a Wisdom check',
                                    'Immune to being charmed by evil creatures'
                                ]
                            }
                        },
                        details: 'You have advantage on Insight checks to detect lies, can see through illusions with a Wisdom check, and are immune to charm from evil creatures.'
                    },
                    {
                        id: 'divine_judgment',
                        name: 'Divine Judgment',
                        description: 'Pass judgment on the wicked',
                        icon: 'spell_holy_holysmite',
                        type: 'active',
                        effectType: 'damage',
                        usage: '1/Combat',
                        apCost: 5,
                        targeting: {
                            range: '60 feet',
                            targets: 1,
                            areaType: 'single'
                        },
                        effects: {
                            damage: {
                                formula: '5d8',
                                type: 'radiant',
                                scaling: 'Damage scales with target\'s evil deeds (GM discretion)'
                            },
                            debuff: {
                                duration: '3 rounds',
                                effects: ['Target has disadvantage on all rolls if evil-aligned']
                            }
                        },
                        restrictions: 'Only works on evil-aligned creatures',
                        details: 'Deal 5d8 radiant damage to an evil creature. If evil-aligned, they have disadvantage on all rolls for 3 rounds.'
                    }
                ]
            }
        }
    }
};

// Helper functions
export const getEnhancedBackgroundData = (backgroundId) => {
    return ENHANCED_BACKGROUNDS[backgroundId] || null;
};

export const getAllEnhancedBackgrounds = () => {
    return Object.values(ENHANCED_BACKGROUNDS);
};

export const getSubBackgrounds = (backgroundId) => {
    const background = getEnhancedBackgroundData(backgroundId);
    return background ? Object.values(background.subBackgrounds) : [];
};

export const getSubBackgroundData = (backgroundId, subBackgroundId) => {
    const background = getEnhancedBackgroundData(backgroundId);
    return background?.subBackgrounds?.[subBackgroundId] || null;
};

export const getSubBackgroundAbilities = (backgroundId, subBackgroundId) => {
    const subBackground = getSubBackgroundData(backgroundId, subBackgroundId);
    return subBackground?.abilities || [];
};

