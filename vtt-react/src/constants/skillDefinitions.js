// Quest-Based Skills System - Pathfinder Style
// Each skill has quests that unlock rollable tables and abilities

export const SKILL_CATEGORIES = {
    COMBAT: {
        name: 'Combat Mastery',
        icon: 'Slashing/Slashing Slash',
        description: 'Master the arts of war and combat'
    },
    EXPLORATION: {
        name: 'Exploration & Survival',
        icon: 'Radiant/Enlightened Vision',
        description: 'Navigate the wilderness and uncover secrets'
    },
    SOCIAL: {
        name: 'Social & Influence',
        icon: 'Social/CouncilGathering',
        description: 'Master the arts of persuasion and leadership'
    },
    ARCANE: {
        name: 'Arcane Studies',
        icon: 'Arcane/Ebon Blaze',
        description: 'Delve into magical mysteries and forbidden knowledge'
    }
};

export const SKILL_DEFINITIONS = {
    // Combat Mastery Skills
    weaponMastery: {
        name: 'Weapon Mastery',
        category: SKILL_CATEGORIES.COMBAT.name,
        primaryStat: 'strength',
        secondaryStat: 'agility',
        description: 'Master various weapons and combat techniques',
        icon: 'Slashing/Slashing Slash',
        rollableTables: {
            UNTRAINED: {
                d8: 'weaponmastery_untrained_d8'
            },
            NOVICE: {
                d8: 'weaponmastery_novice_d8'
            },
            TRAINED: {
                d8: 'weaponmastery_trained_d8'
            },
            APPRENTICE: {
                d8: 'weaponmastery_apprentice_d8'
            },
            ADEPT: {
                d8: 'weaponmastery_adept_d8'
            },
            EXPERT: {
                d8: 'weaponmastery_expert_d8'
            },
            MASTER: {
                d8: 'weaponmastery_master_d8'
            }
        }
    },
    tacticalCombat: {
        name: 'Tactical Combat',
        category: SKILL_CATEGORIES.COMBAT.name,
        primaryStat: 'intelligence',
        secondaryStat: 'strength',
        description: 'Understand battlefield tactics and strategic positioning',
        icon: 'Social/CouncilGathering',
        rollableTables: {
            UNTRAINED: {
                d4: 'tacticalcombat_untrained_d4',
                d6: 'tacticalcombat_untrained_d6',
                d8: 'tacticalcombat_untrained_d8',
                d10: 'tacticalcombat_untrained_d10',
                d12: 'tacticalcombat_untrained_d12',
                d20: 'tacticalcombat_untrained_d20'
            },
            NOVICE: {
                d4: 'tacticalcombat_novice_d4',
                d6: 'tacticalcombat_novice_d6',
                d8: 'tacticalcombat_novice_d8',
                d10: 'tacticalcombat_novice_d10',
                d12: 'tacticalcombat_novice_d12',
                d20: 'tacticalcombat_novice_d20'
            },
            TRAINED: {
                d4: 'tacticalcombat_trained_d4',
                d6: 'tacticalcombat_trained_d6',
                d8: 'tacticalcombat_trained_d8',
                d10: 'tacticalcombat_trained_d10',
                d12: 'tacticalcombat_trained_d12',
                d20: 'tacticalcombat_trained_d20'
            },
            APPRENTICE: {
                d4: 'tacticalcombat_apprentice_d4',
                d6: 'tacticalcombat_apprentice_d6',
                d8: 'tacticalcombat_apprentice_d8',
                d10: 'tacticalcombat_apprentice_d10',
                d12: 'tacticalcombat_apprentice_d12',
                d20: 'tacticalcombat_apprentice_d20'
            },
            ADEPT: {
                d4: 'tacticalcombat_adept_d4',
                d6: 'tacticalcombat_adept_d6',
                d8: 'tacticalcombat_adept_d8',
                d10: 'tacticalcombat_adept_d10',
                d12: 'tacticalcombat_adept_d12',
                d20: 'tacticalcombat_adept_d20'
            },
            EXPERT: {
                d4: 'tacticalcombat_expert_d4',
                d6: 'tacticalcombat_expert_d6',
                d8: 'tacticalcombat_expert_d8',
                d10: 'tacticalcombat_expert_d10',
                d12: 'tacticalcombat_expert_d12',
                d20: 'tacticalcombat_expert_d20'
            },
            MASTER: {
                d4: 'tacticalcombat_master_d4',
                d6: 'tacticalcombat_master_d6',
                d8: 'tacticalcombat_master_d8',
                d10: 'tacticalcombat_master_d10',
                d12: 'tacticalcombat_master_d12',
                d20: 'tacticalcombat_master_d20'
            }
        }
    },

    // Exploration & Survival Skills
    investigation: {
        name: 'Investigation',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Uncover clues, solve mysteries, and find hidden secrets',
        icon: 'Radiant/Enlightened Vision',
        rollableTables: {
            UNTRAINED: {
                d4: 'investigation_untrained_d4',
                d6: 'investigation_untrained_d6',
                d8: 'investigation_untrained_d8',
                d10: 'investigation_untrained_d10',
                d12: 'investigation_untrained_d12',
                d20: 'investigation_untrained_d20'
            },
            NOVICE: {
                d4: 'investigation_novice_d4',
                d6: 'investigation_novice_d6',
                d8: 'investigation_novice_d8',
                d10: 'investigation_novice_d10',
                d12: 'investigation_novice_d12',
                d20: 'investigation_novice_d20'
            },
            TRAINED: {
                d4: 'investigation_trained_d4',
                d6: 'investigation_trained_d6',
                d8: 'investigation_trained_d8',
                d10: 'investigation_trained_d10',
                d12: 'investigation_trained_d12',
                d20: 'investigation_trained_d20'
            },
            APPRENTICE: {
                d4: 'investigation_apprentice_d4',
                d6: 'investigation_apprentice_d6',
                d8: 'investigation_apprentice_d8',
                d10: 'investigation_apprentice_d10',
                d12: 'investigation_apprentice_d12',
                d20: 'investigation_apprentice_d20'
            },
            ADEPT: {
                d4: 'investigation_adept_d4',
                d6: 'investigation_adept_d6',
                d8: 'investigation_adept_d8',
                d10: 'investigation_adept_d10',
                d12: 'investigation_adept_d12',
                d20: 'investigation_adept_d20'
            },
            EXPERT: {
                d4: 'investigation_expert_d4',
                d6: 'investigation_expert_d6',
                d8: 'investigation_expert_d8',
                d10: 'investigation_expert_d10',
                d12: 'investigation_expert_d12',
                d20: 'investigation_expert_d20'
            },
            MASTER: {
                d4: 'investigation_master_d4',
                d6: 'investigation_master_d6',
                d8: 'investigation_master_d8',
                d10: 'investigation_master_d10',
                d12: 'investigation_master_d12',
                d20: 'investigation_master_d20'
            }
        }
    },
    athletics: {
        name: 'Athletics',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'strength',
        secondaryStat: 'constitution',
        description: 'Climb, swim, jump, and perform physical feats',
        icon: 'General/Leap Mountain',
        rollableTables: {
            UNTRAINED: {
                d4: 'athletics_untrained_d4',
                d6: 'athletics_untrained_d6',
                d8: 'athletics_untrained_d8',
                d10: 'athletics_untrained_d10',
                d12: 'athletics_untrained_d12',
                d20: 'athletics_untrained_d20'
            },
            NOVICE: {
                d4: 'athletics_novice_d4',
                d6: 'athletics_novice_d6',
                d8: 'athletics_novice_d8',
                d10: 'athletics_novice_d10',
                d12: 'athletics_novice_d12',
                d20: 'athletics_novice_d20'
            },
            TRAINED: {
                d4: 'athletics_trained_d4',
                d6: 'athletics_trained_d6',
                d8: 'athletics_trained_d8',
                d10: 'athletics_trained_d10',
                d12: 'athletics_trained_d12',
                d20: 'athletics_trained_d20'
            },
            APPRENTICE: {
                d4: 'athletics_apprentice_d4',
                d6: 'athletics_apprentice_d6',
                d8: 'athletics_apprentice_d8',
                d10: 'athletics_apprentice_d10',
                d12: 'athletics_apprentice_d12',
                d20: 'athletics_apprentice_d20'
            },
            ADEPT: {
                d4: 'athletics_adept_d4',
                d6: 'athletics_adept_d6',
                d8: 'athletics_adept_d8',
                d10: 'athletics_adept_d10',
                d12: 'athletics_adept_d12',
                d20: 'athletics_adept_d20'
            },
            EXPERT: {
                d4: 'athletics_expert_d4',
                d6: 'athletics_expert_d6',
                d8: 'athletics_expert_d8',
                d10: 'athletics_expert_d10',
                d12: 'athletics_expert_d12',
                d20: 'athletics_expert_d20'
            },
            MASTER: {
                d4: 'athletics_master_d4',
                d6: 'athletics_master_d6',
                d8: 'athletics_master_d8',
                d10: 'athletics_master_d10',
                d12: 'athletics_master_d12',
                d20: 'athletics_master_d20'
            }
        }
    },

    // Social & Influence Skills
    persuasion: {
        name: 'Persuasion',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'charisma',
        secondaryStat: 'intelligence',
        description: 'Convince others through charm and reasoning',
        icon: 'Social/CouncilGathering',
        rollableTables: {
            UNTRAINED: {
                d4: 'persuasion_untrained_d4',
                d6: 'persuasion_untrained_d6',
                d8: 'persuasion_untrained_d8',
                d10: 'persuasion_untrained_d10',
                d12: 'persuasion_untrained_d12',
                d20: 'persuasion_untrained_d20'
            },
            NOVICE: {
                d4: 'persuasion_novice_d4',
                d6: 'persuasion_novice_d6',
                d8: 'persuasion_novice_d8',
                d10: 'persuasion_novice_d10',
                d12: 'persuasion_novice_d12',
                d20: 'persuasion_novice_d20'
            },
            TRAINED: {
                d4: 'persuasion_trained_d4',
                d6: 'persuasion_trained_d6',
                d8: 'persuasion_trained_d8',
                d10: 'persuasion_trained_d10',
                d12: 'persuasion_trained_d12',
                d20: 'persuasion_trained_d20'
            },
            APPRENTICE: {
                d4: 'persuasion_apprentice_d4',
                d6: 'persuasion_apprentice_d6',
                d8: 'persuasion_apprentice_d8',
                d10: 'persuasion_apprentice_d10',
                d12: 'persuasion_apprentice_d12',
                d20: 'persuasion_apprentice_d20'
            },
            ADEPT: {
                d4: 'persuasion_adept_d4',
                d6: 'persuasion_adept_d6',
                d8: 'persuasion_adept_d8',
                d10: 'persuasion_adept_d10',
                d12: 'persuasion_adept_d12',
                d20: 'persuasion_adept_d20'
            },
            EXPERT: {
                d4: 'persuasion_expert_d4',
                d6: 'persuasion_expert_d6',
                d8: 'persuasion_expert_d8',
                d10: 'persuasion_expert_d10',
                d12: 'persuasion_expert_d12',
                d20: 'persuasion_expert_d20'
            },
            MASTER: {
                d4: 'persuasion_master_d4',
                d6: 'persuasion_master_d6',
                d8: 'persuasion_master_d8',
                d10: 'persuasion_master_d10',
                d12: 'persuasion_master_d12',
                d20: 'persuasion_master_d20'
            }
        }
    },
    deception: {
        name: 'Deception',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'charisma',
        secondaryStat: 'intelligence',
        description: 'Mislead and manipulate through lies and misdirection',
        icon: 'General/Deceit',
        rollableTables: {
            UNTRAINED: {
                d4: 'deception_untrained_d4',
                d6: 'deception_untrained_d6',
                d8: 'deception_untrained_d8',
                d10: 'deception_untrained_d10',
                d12: 'deception_untrained_d12',
                d20: 'deception_untrained_d20'
            },
            NOVICE: {
                d4: 'deception_novice_d4',
                d6: 'deception_novice_d6',
                d8: 'deception_novice_d8',
                d10: 'deception_novice_d10',
                d12: 'deception_novice_d12',
                d20: 'deception_novice_d20'
            },
            TRAINED: {
                d4: 'deception_trained_d4',
                d6: 'deception_trained_d6',
                d8: 'deception_trained_d8',
                d10: 'deception_trained_d10',
                d12: 'deception_trained_d12',
                d20: 'deception_trained_d20'
            },
            APPRENTICE: {
                d4: 'deception_apprentice_d4',
                d6: 'deception_apprentice_d6',
                d8: 'deception_apprentice_d8',
                d10: 'deception_apprentice_d10',
                d12: 'deception_apprentice_d12',
                d20: 'deception_apprentice_d20'
            },
            ADEPT: {
                d4: 'deception_adept_d4',
                d6: 'deception_adept_d6',
                d8: 'deception_adept_d8',
                d10: 'deception_adept_d10',
                d12: 'deception_adept_d12',
                d20: 'deception_adept_d20'
            },
            EXPERT: {
                d4: 'deception_expert_d4',
                d6: 'deception_expert_d6',
                d8: 'deception_expert_d8',
                d10: 'deception_expert_d10',
                d12: 'deception_expert_d12',
                d20: 'deception_expert_d20'
            },
            MASTER: {
                d4: 'deception_master_d4',
                d6: 'deception_master_d6',
                d8: 'deception_master_d8',
                d10: 'deception_master_d10',
                d12: 'deception_master_d12',
                d20: 'deception_master_d20'
            }
        }
    },
    leadership: {
        name: 'Leadership',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'charisma',
        secondaryStat: 'spirit',
        description: 'Inspire and command others in times of need',
        icon: 'Radiant/Radiant Light 5',
        rollableTables: {
            UNTRAINED: {
                d4: 'leadership_untrained_d4',
                d6: 'leadership_untrained_d6',
                d8: 'leadership_untrained_d8',
                d10: 'leadership_untrained_d10',
                d12: 'leadership_untrained_d12',
                d20: 'leadership_untrained_d20'
            },
            NOVICE: {
                d4: 'leadership_novice_d4',
                d6: 'leadership_novice_d6',
                d8: 'leadership_novice_d8',
                d10: 'leadership_novice_d10',
                d12: 'leadership_novice_d12',
                d20: 'leadership_novice_d20'
            },
            TRAINED: {
                d4: 'leadership_trained_d4',
                d6: 'leadership_trained_d6',
                d8: 'leadership_trained_d8',
                d10: 'leadership_trained_d10',
                d12: 'leadership_trained_d12',
                d20: 'leadership_trained_d20'
            },
            APPRENTICE: {
                d4: 'leadership_apprentice_d4',
                d6: 'leadership_apprentice_d6',
                d8: 'leadership_apprentice_d8',
                d10: 'leadership_apprentice_d10',
                d12: 'leadership_apprentice_d12',
                d20: 'leadership_apprentice_d20'
            },
            ADEPT: {
                d4: 'leadership_adept_d4',
                d6: 'leadership_adept_d6',
                d8: 'leadership_adept_d8',
                d10: 'leadership_adept_d10',
                d12: 'leadership_adept_d12',
                d20: 'leadership_adept_d20'
            },
            EXPERT: {
                d4: 'leadership_expert_d4',
                d6: 'leadership_expert_d6',
                d8: 'leadership_expert_d8',
                d10: 'leadership_expert_d10',
                d12: 'leadership_expert_d12',
                d20: 'leadership_expert_d20'
            },
            MASTER: {
                d4: 'leadership_master_d4',
                d6: 'leadership_master_d6',
                d8: 'leadership_master_d8',
                d10: 'leadership_master_d10',
                d12: 'leadership_master_d12',
                d20: 'leadership_master_d20'
            }
        }
    },

    // Arcane Studies Skills
    arcaneKnowledge: {
        name: 'Arcane Knowledge',
        category: SKILL_CATEGORIES.ARCANE.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Study and recognize magic, runes, enchantments, and arcane structures',
        icon: 'Arcane/Ebon Blaze',
        rollableTables: {
            UNTRAINED: {
                d4: 'arcaneknowledge_untrained_d4',
                d6: 'arcaneknowledge_untrained_d6',
                d8: 'arcaneknowledge_untrained_d8',
                d10: 'arcaneknowledge_untrained_d10',
                d12: 'arcaneknowledge_untrained_d12',
                d20: 'arcaneknowledge_untrained_d20'
            },
            NOVICE: {
                d4: 'arcaneknowledge_novice_d4',
                d6: 'arcaneknowledge_novice_d6',
                d8: 'arcaneknowledge_novice_d8',
                d10: 'arcaneknowledge_novice_d10',
                d12: 'arcaneknowledge_novice_d12',
                d20: 'arcaneknowledge_novice_d20'
            },
            TRAINED: {
                d4: 'arcaneknowledge_trained_d4',
                d6: 'arcaneknowledge_trained_d6',
                d8: 'arcaneknowledge_trained_d8',
                d10: 'arcaneknowledge_trained_d10',
                d12: 'arcaneknowledge_trained_d12',
                d20: 'arcaneknowledge_trained_d20'
            },
            APPRENTICE: {
                d4: 'arcaneknowledge_apprentice_d4',
                d6: 'arcaneknowledge_apprentice_d6',
                d8: 'arcaneknowledge_apprentice_d8',
                d10: 'arcaneknowledge_apprentice_d10',
                d12: 'arcaneknowledge_apprentice_d12',
                d20: 'arcaneknowledge_apprentice_d20'
            },
            ADEPT: {
                d4: 'arcaneknowledge_adept_d4',
                d6: 'arcaneknowledge_adept_d6',
                d8: 'arcaneknowledge_adept_d8',
                d10: 'arcaneknowledge_adept_d10',
                d12: 'arcaneknowledge_adept_d12',
                d20: 'arcaneknowledge_adept_d20'
            },
            EXPERT: {
                d4: 'arcaneknowledge_expert_d4',
                d6: 'arcaneknowledge_expert_d6',
                d8: 'arcaneknowledge_expert_d8',
                d10: 'arcaneknowledge_expert_d10',
                d12: 'arcaneknowledge_expert_d12',
                d20: 'arcaneknowledge_expert_d20'
            },
            MASTER: {
                d4: 'arcaneknowledge_master_d4',
                d6: 'arcaneknowledge_master_d6',
                d8: 'arcaneknowledge_master_d8',
                d10: 'arcaneknowledge_master_d10',
                d12: 'arcaneknowledge_master_d12',
                d20: 'arcaneknowledge_master_d20'
            }
        }
    },
    ritualMagic: {
        name: 'Ritual Magic',
        category: SKILL_CATEGORIES.ARCANE.name,
        primaryStat: 'spirit',
        secondaryStat: 'intelligence',
        description: 'Perform complex magical rituals and ceremonies',
        icon: 'General/Ritual Outfit',
        rollableTables: {
            UNTRAINED: {
                d4: 'ritualmagic_untrained_d4',
                d6: 'ritualmagic_untrained_d6',
                d8: 'ritualmagic_untrained_d8',
                d10: 'ritualmagic_untrained_d10',
                d12: 'ritualmagic_untrained_d12',
                d20: 'ritualmagic_untrained_d20'
            },
            NOVICE: {
                d4: 'ritualmagic_novice_d4',
                d6: 'ritualmagic_novice_d6',
                d8: 'ritualmagic_novice_d8',
                d10: 'ritualmagic_novice_d10',
                d12: 'ritualmagic_novice_d12',
                d20: 'ritualmagic_novice_d20'
            },
            TRAINED: {
                d4: 'ritualmagic_trained_d4',
                d6: 'ritualmagic_trained_d6',
                d8: 'ritualmagic_trained_d8',
                d10: 'ritualmagic_trained_d10',
                d12: 'ritualmagic_trained_d12',
                d20: 'ritualmagic_trained_d20'
            },
            APPRENTICE: {
                d4: 'ritualmagic_apprentice_d4',
                d6: 'ritualmagic_apprentice_d6',
                d8: 'ritualmagic_apprentice_d8',
                d10: 'ritualmagic_apprentice_d10',
                d12: 'ritualmagic_apprentice_d12',
                d20: 'ritualmagic_apprentice_d20'
            },
            ADEPT: {
                d4: 'ritualmagic_adept_d4',
                d6: 'ritualmagic_adept_d6',
                d8: 'ritualmagic_adept_d8',
                d10: 'ritualmagic_adept_d10',
                d12: 'ritualmagic_adept_d12',
                d20: 'ritualmagic_adept_d20'
            },
            EXPERT: {
                d4: 'ritualmagic_expert_d4',
                d6: 'ritualmagic_expert_d6',
                d8: 'ritualmagic_expert_d8',
                d10: 'ritualmagic_expert_d10',
                d12: 'ritualmagic_expert_d12',
                d20: 'ritualmagic_expert_d20'
            },
            MASTER: {
                d4: 'ritualmagic_master_d4',
                d6: 'ritualmagic_master_d6',
                d8: 'ritualmagic_master_d8',
                d10: 'ritualmagic_master_d10',
                d12: 'ritualmagic_master_d12',
                d20: 'ritualmagic_master_d20'
            }
        }
    },

    // Additional D&D Standard Skills
    acrobatics: {
        name: 'Acrobatics',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'agility',
        secondaryStat: 'strength',
        description: 'Balance, tumble, and perform acrobatic stunts to avoid falls and navigate difficult terrain',
        icon: 'General/Leap Mountain',
        rollableTables: {
            UNTRAINED: {
                d4: 'acrobatics_untrained_d4',
                d6: 'acrobatics_untrained_d6',
                d8: 'acrobatics_untrained_d8',
                d10: 'acrobatics_untrained_d10',
                d12: 'acrobatics_untrained_d12',
                d20: 'acrobatics_untrained_d20'
            },
            NOVICE: {
                d4: 'acrobatics_novice_d4',
                d6: 'acrobatics_novice_d6',
                d8: 'acrobatics_novice_d8',
                d10: 'acrobatics_novice_d10',
                d12: 'acrobatics_novice_d12',
                d20: 'acrobatics_novice_d20'
            },
            TRAINED: {
                d4: 'acrobatics_trained_d4',
                d6: 'acrobatics_trained_d6',
                d8: 'acrobatics_trained_d8',
                d10: 'acrobatics_trained_d10',
                d12: 'acrobatics_trained_d12',
                d20: 'acrobatics_trained_d20'
            },
            APPRENTICE: {
                d4: 'acrobatics_apprentice_d4',
                d6: 'acrobatics_apprentice_d6',
                d8: 'acrobatics_apprentice_d8',
                d10: 'acrobatics_apprentice_d10',
                d12: 'acrobatics_apprentice_d12',
                d20: 'acrobatics_apprentice_d20'
            },
            ADEPT: {
                d4: 'acrobatics_adept_d4',
                d6: 'acrobatics_adept_d6',
                d8: 'acrobatics_adept_d8',
                d10: 'acrobatics_adept_d10',
                d12: 'acrobatics_adept_d12',
                d20: 'acrobatics_adept_d20'
            },
            EXPERT: {
                d4: 'acrobatics_expert_d4',
                d6: 'acrobatics_expert_d6',
                d8: 'acrobatics_expert_d8',
                d10: 'acrobatics_expert_d10',
                d12: 'acrobatics_expert_d12',
                d20: 'acrobatics_expert_d20'
            },
            MASTER: {
                d4: 'acrobatics_master_d4',
                d6: 'acrobatics_master_d6',
                d8: 'acrobatics_master_d8',
                d10: 'acrobatics_master_d10',
                d12: 'acrobatics_master_d12',
                d20: 'acrobatics_master_d20'
            }
        }
    },
    animalHandling: {
        name: 'Animal Handling',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'spirit',
        secondaryStat: 'charisma',
        description: 'Calm, train, and read the intentions of animals and beasts',
        icon: 'General/Glowing Paw Prints',
        rollableTables: {
            UNTRAINED: {
                d4: 'animalhandling_untrained_d4',
                d6: 'animalhandling_untrained_d6',
                d8: 'animalhandling_untrained_d8',
                d10: 'animalhandling_untrained_d10',
                d12: 'animalhandling_untrained_d12',
                d20: 'animalhandling_untrained_d20'
            },
            NOVICE: {
                d4: 'animalhandling_novice_d4',
                d6: 'animalhandling_novice_d6',
                d8: 'animalhandling_novice_d8',
                d10: 'animalhandling_novice_d10',
                d12: 'animalhandling_novice_d12',
                d20: 'animalhandling_novice_d20'
            },
            TRAINED: {
                d4: 'animalhandling_trained_d4',
                d6: 'animalhandling_trained_d6',
                d8: 'animalhandling_trained_d8',
                d10: 'animalhandling_trained_d10',
                d12: 'animalhandling_trained_d12',
                d20: 'animalhandling_trained_d20'
            },
            APPRENTICE: {
                d4: 'animalhandling_apprentice_d4',
                d6: 'animalhandling_apprentice_d6',
                d8: 'animalhandling_apprentice_d8',
                d10: 'animalhandling_apprentice_d10',
                d12: 'animalhandling_apprentice_d12',
                d20: 'animalhandling_apprentice_d20'
            },
            ADEPT: {
                d4: 'animalhandling_adept_d4',
                d6: 'animalhandling_adept_d6',
                d8: 'animalhandling_adept_d8',
                d10: 'animalhandling_adept_d10',
                d12: 'animalhandling_adept_d12',
                d20: 'animalhandling_adept_d20'
            },
            EXPERT: {
                d4: 'animalhandling_expert_d4',
                d6: 'animalhandling_expert_d6',
                d8: 'animalhandling_expert_d8',
                d10: 'animalhandling_expert_d10',
                d12: 'animalhandling_expert_d12',
                d20: 'animalhandling_expert_d20'
            },
            MASTER: {
                d4: 'animalhandling_master_d4',
                d6: 'animalhandling_master_d6',
                d8: 'animalhandling_master_d8',
                d10: 'animalhandling_master_d10',
                d12: 'animalhandling_master_d12',
                d20: 'animalhandling_master_d20'
            }
        }
    },
    arcana: {
        name: 'Arcana',
        category: SKILL_CATEGORIES.ARCANE.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Manipulate, sense, and control ambient magical energy - the practical interface between raw magic and the physical world',
        icon: 'Arcane/Ebon Blaze',
        rollableTables: {
            UNTRAINED: {
                d4: 'arcana_untrained_d4',
                d6: 'arcana_untrained_d6',
                d8: 'arcana_untrained_d8',
                d10: 'arcana_untrained_d10',
                d12: 'arcana_untrained_d12',
                d20: 'arcana_untrained_d20'
            },
            NOVICE: {
                d4: 'arcana_novice_d4',
                d6: 'arcana_novice_d6',
                d8: 'arcana_novice_d8',
                d10: 'arcana_novice_d10',
                d12: 'arcana_novice_d12',
                d20: 'arcana_novice_d20'
            },
            TRAINED: {
                d4: 'arcana_trained_d4',
                d6: 'arcana_trained_d6',
                d8: 'arcana_trained_d8',
                d10: 'arcana_trained_d10',
                d12: 'arcana_trained_d12',
                d20: 'arcana_trained_d20'
            },
            APPRENTICE: {
                d4: 'arcana_apprentice_d4',
                d6: 'arcana_apprentice_d6',
                d8: 'arcana_apprentice_d8',
                d10: 'arcana_apprentice_d10',
                d12: 'arcana_apprentice_d12',
                d20: 'arcana_apprentice_d20'
            },
            ADEPT: {
                d4: 'arcana_adept_d4',
                d6: 'arcana_adept_d6',
                d8: 'arcana_adept_d8',
                d10: 'arcana_adept_d10',
                d12: 'arcana_adept_d12',
                d20: 'arcana_adept_d20'
            },
            EXPERT: {
                d4: 'arcana_expert_d4',
                d6: 'arcana_expert_d6',
                d8: 'arcana_expert_d8',
                d10: 'arcana_expert_d10',
                d12: 'arcana_expert_d12',
                d20: 'arcana_expert_d20'
            },
            MASTER: {
                d4: 'arcana_master_d4',
                d6: 'arcana_master_d6',
                d8: 'arcana_master_d8',
                d10: 'arcana_master_d10',
                d12: 'arcana_master_d12',
                d20: 'arcana_master_d20'
            }
        }
    },
    history: {
        name: 'History',
        category: SKILL_CATEGORIES.ARCANE.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Understanding, interpretation, and recall of recorded or oral events across time',
        icon: 'Arcane/Sands of Time',
        rollableTables: {
            UNTRAINED: {
                d4: 'history_untrained_d4',
                d6: 'history_untrained_d6',
                d8: 'history_untrained_d8',
                d10: 'history_untrained_d10',
                d12: 'history_untrained_d12',
                d20: 'history_untrained_d20'
            },
            NOVICE: {
                d4: 'history_novice_d4',
                d6: 'history_novice_d6',
                d8: 'history_novice_d8',
                d10: 'history_novice_d10',
                d12: 'history_novice_d12',
                d20: 'history_novice_d20'
            },
            TRAINED: {
                d4: 'history_trained_d4',
                d6: 'history_trained_d6',
                d8: 'history_trained_d8',
                d10: 'history_trained_d10',
                d12: 'history_trained_d12',
                d20: 'history_trained_d20'
            },
            APPRENTICE: {
                d4: 'history_apprentice_d4',
                d6: 'history_apprentice_d6',
                d8: 'history_apprentice_d8',
                d10: 'history_apprentice_d10',
                d12: 'history_apprentice_d12',
                d20: 'history_apprentice_d20'
            },
            ADEPT: {
                d4: 'history_adept_d4',
                d6: 'history_adept_d6',
                d8: 'history_adept_d8',
                d10: 'history_adept_d10',
                d12: 'history_adept_d12',
                d20: 'history_adept_d20'
            },
            EXPERT: {
                d4: 'history_expert_d4',
                d6: 'history_expert_d6',
                d8: 'history_expert_d8',
                d10: 'history_expert_d10',
                d12: 'history_expert_d12',
                d20: 'history_expert_d20'
            },
            MASTER: {
                d4: 'history_master_d4',
                d6: 'history_master_d6',
                d8: 'history_master_d8',
                d10: 'history_master_d10',
                d12: 'history_master_d12',
                d20: 'history_master_d20'
            }
        }
    },
    insight: {
        name: 'Insight',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'spirit',
        secondaryStat: 'intelligence',
        description: 'Read body language and determine true intentions to detect lies',
        icon: 'Psychic/Psychic Telepathy',
        rollableTables: {
            UNTRAINED: {
                d4: 'insight_untrained_d4',
                d6: 'insight_untrained_d6',
                d8: 'insight_untrained_d8',
                d10: 'insight_untrained_d10',
                d12: 'insight_untrained_d12',
                d20: 'insight_untrained_d20'
            },
            NOVICE: {
                d4: 'insight_novice_d4',
                d6: 'insight_novice_d6',
                d8: 'insight_novice_d8',
                d10: 'insight_novice_d10',
                d12: 'insight_novice_d12',
                d20: 'insight_novice_d20'
            },
            TRAINED: {
                d4: 'insight_trained_d4',
                d6: 'insight_trained_d6',
                d8: 'insight_trained_d8',
                d10: 'insight_trained_d10',
                d12: 'insight_trained_d12',
                d20: 'insight_trained_d20'
            },
            APPRENTICE: {
                d4: 'insight_apprentice_d4',
                d6: 'insight_apprentice_d6',
                d8: 'insight_apprentice_d8',
                d10: 'insight_apprentice_d10',
                d12: 'insight_apprentice_d12',
                d20: 'insight_apprentice_d20'
            },
            ADEPT: {
                d4: 'insight_adept_d4',
                d6: 'insight_adept_d6',
                d8: 'insight_adept_d8',
                d10: 'insight_adept_d10',
                d12: 'insight_adept_d12',
                d20: 'insight_adept_d20'
            },
            EXPERT: {
                d4: 'insight_expert_d4',
                d6: 'insight_expert_d6',
                d8: 'insight_expert_d8',
                d10: 'insight_expert_d10',
                d12: 'insight_expert_d12',
                d20: 'insight_expert_d20'
            },
            MASTER: {
                d4: 'insight_master_d4',
                d6: 'insight_master_d6',
                d8: 'insight_master_d8',
                d10: 'insight_master_d10',
                d12: 'insight_master_d12',
                d20: 'insight_master_d20'
            }
        }
    },
    intimidation: {
        name: 'Intimidation',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'strength',
        secondaryStat: 'charisma',
        description: 'Influence others through threats, hostile actions, and physical presence',
        icon: 'General/Void Scream',
        rollableTables: {
            UNTRAINED: {
                d4: 'intimidation_untrained_d4',
                d6: 'intimidation_untrained_d6',
                d8: 'intimidation_untrained_d8',
                d10: 'intimidation_untrained_d10',
                d12: 'intimidation_untrained_d12',
                d20: 'intimidation_untrained_d20'
            },
            NOVICE: {
                d4: 'intimidation_novice_d4',
                d6: 'intimidation_novice_d6',
                d8: 'intimidation_novice_d8',
                d10: 'intimidation_novice_d10',
                d12: 'intimidation_novice_d12',
                d20: 'intimidation_novice_d20'
            },
            TRAINED: {
                d4: 'intimidation_trained_d4',
                d6: 'intimidation_trained_d6',
                d8: 'intimidation_trained_d8',
                d10: 'intimidation_trained_d10',
                d12: 'intimidation_trained_d12',
                d20: 'intimidation_trained_d20'
            },
            APPRENTICE: {
                d4: 'intimidation_apprentice_d4',
                d6: 'intimidation_apprentice_d6',
                d8: 'intimidation_apprentice_d8',
                d10: 'intimidation_apprentice_d10',
                d12: 'intimidation_apprentice_d12',
                d20: 'intimidation_apprentice_d20'
            },
            ADEPT: {
                d4: 'intimidation_adept_d4',
                d6: 'intimidation_adept_d6',
                d8: 'intimidation_adept_d8',
                d10: 'intimidation_adept_d10',
                d12: 'intimidation_adept_d12',
                d20: 'intimidation_adept_d20'
            },
            EXPERT: {
                d4: 'intimidation_expert_d4',
                d6: 'intimidation_expert_d6',
                d8: 'intimidation_expert_d8',
                d10: 'intimidation_expert_d10',
                d12: 'intimidation_expert_d12',
                d20: 'intimidation_expert_d20'
            },
            MASTER: {
                d4: 'intimidation_master_d4',
                d6: 'intimidation_master_d6',
                d8: 'intimidation_master_d8',
                d10: 'intimidation_master_d10',
                d12: 'intimidation_master_d12',
                d20: 'intimidation_master_d20'
            }
        }
    },
    medicine: {
        name: 'Medicine',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Diagnose illness, treat wounds, and stabilize the dying',
        icon: 'Healing/Prayer',
        rollableTables: {
            UNTRAINED: {
                d4: 'medicine_untrained_d4',
                d6: 'medicine_untrained_d6',
                d8: 'medicine_untrained_d8',
                d10: 'medicine_untrained_d10',
                d12: 'medicine_untrained_d12',
                d20: 'medicine_untrained_d20'
            },
            NOVICE: {
                d4: 'medicine_novice_d4',
                d6: 'medicine_novice_d6',
                d8: 'medicine_novice_d8',
                d10: 'medicine_novice_d10',
                d12: 'medicine_novice_d12',
                d20: 'medicine_novice_d20'
            },
            TRAINED: {
                d4: 'medicine_trained_d4',
                d6: 'medicine_trained_d6',
                d8: 'medicine_trained_d8',
                d10: 'medicine_trained_d10',
                d12: 'medicine_trained_d12',
                d20: 'medicine_trained_d20'
            },
            APPRENTICE: {
                d4: 'medicine_apprentice_d4',
                d6: 'medicine_apprentice_d6',
                d8: 'medicine_apprentice_d8',
                d10: 'medicine_apprentice_d10',
                d12: 'medicine_apprentice_d12',
                d20: 'medicine_apprentice_d20'
            },
            ADEPT: {
                d4: 'medicine_adept_d4',
                d6: 'medicine_adept_d6',
                d8: 'medicine_adept_d8',
                d10: 'medicine_adept_d10',
                d12: 'medicine_adept_d12',
                d20: 'medicine_adept_d20'
            },
            EXPERT: {
                d4: 'medicine_expert_d4',
                d6: 'medicine_expert_d6',
                d8: 'medicine_expert_d8',
                d10: 'medicine_expert_d10',
                d12: 'medicine_expert_d12',
                d20: 'medicine_expert_d20'
            },
            MASTER: {
                d4: 'medicine_master_d4',
                d6: 'medicine_master_d6',
                d8: 'medicine_master_d8',
                d10: 'medicine_master_d10',
                d12: 'medicine_master_d12',
                d20: 'medicine_master_d20'
            }
        }
    },
    nature: {
        name: 'Nature',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Knowledge of terrain, plants, animals, and weather patterns',
        icon: 'Nature/Nature Natural 11',
        rollableTables: {
            UNTRAINED: {
                d4: 'nature_untrained_d4',
                d6: 'nature_untrained_d6',
                d8: 'nature_untrained_d8',
                d10: 'nature_untrained_d10',
                d12: 'nature_untrained_d12',
                d20: 'nature_untrained_d20'
            },
            NOVICE: {
                d4: 'nature_novice_d4',
                d6: 'nature_novice_d6',
                d8: 'nature_novice_d8',
                d10: 'nature_novice_d10',
                d12: 'nature_novice_d12',
                d20: 'nature_novice_d20'
            },
            TRAINED: {
                d4: 'nature_trained_d4',
                d6: 'nature_trained_d6',
                d8: 'nature_trained_d8',
                d10: 'nature_trained_d10',
                d12: 'nature_trained_d12',
                d20: 'nature_trained_d20'
            },
            APPRENTICE: {
                d4: 'nature_apprentice_d4',
                d6: 'nature_apprentice_d6',
                d8: 'nature_apprentice_d8',
                d10: 'nature_apprentice_d10',
                d12: 'nature_apprentice_d12',
                d20: 'nature_apprentice_d20'
            },
            ADEPT: {
                d4: 'nature_adept_d4',
                d6: 'nature_adept_d6',
                d8: 'nature_adept_d8',
                d10: 'nature_adept_d10',
                d12: 'nature_adept_d12',
                d20: 'nature_adept_d20'
            },
            EXPERT: {
                d4: 'nature_expert_d4',
                d6: 'nature_expert_d6',
                d8: 'nature_expert_d8',
                d10: 'nature_expert_d10',
                d12: 'nature_expert_d12',
                d20: 'nature_expert_d20'
            },
            MASTER: {
                d4: 'nature_master_d4',
                d6: 'nature_master_d6',
                d8: 'nature_master_d8',
                d10: 'nature_master_d10',
                d12: 'nature_master_d12',
                d20: 'nature_master_d20'
            }
        }
    },
    perception: {
        name: 'Perception',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'spirit',
        secondaryStat: 'intelligence',
        description: 'Spot, hear, and detect things in your environment',
        icon: 'Radiant/Enlightened Vision',
        rollableTables: {
            UNTRAINED: {
                d4: 'perception_untrained_d4',
                d6: 'perception_untrained_d6',
                d8: 'perception_untrained_d8',
                d10: 'perception_untrained_d10',
                d12: 'perception_untrained_d12',
                d20: 'perception_untrained_d20'
            },
            NOVICE: {
                d4: 'perception_novice_d4',
                d6: 'perception_novice_d6',
                d8: 'perception_novice_d8',
                d10: 'perception_novice_d10',
                d12: 'perception_novice_d12',
                d20: 'perception_novice_d20'
            },
            TRAINED: {
                d4: 'perception_trained_d4',
                d6: 'perception_trained_d6',
                d8: 'perception_trained_d8',
                d10: 'perception_trained_d10',
                d12: 'perception_trained_d12',
                d20: 'perception_trained_d20'
            },
            APPRENTICE: {
                d4: 'perception_apprentice_d4',
                d6: 'perception_apprentice_d6',
                d8: 'perception_apprentice_d8',
                d10: 'perception_apprentice_d10',
                d12: 'perception_apprentice_d12',
                d20: 'perception_apprentice_d20'
            },
            ADEPT: {
                d4: 'perception_adept_d4',
                d6: 'perception_adept_d6',
                d8: 'perception_adept_d8',
                d10: 'perception_adept_d10',
                d12: 'perception_adept_d12',
                d20: 'perception_adept_d20'
            },
            EXPERT: {
                d4: 'perception_expert_d4',
                d6: 'perception_expert_d6',
                d8: 'perception_expert_d8',
                d10: 'perception_expert_d10',
                d12: 'perception_expert_d12',
                d20: 'perception_expert_d20'
            },
            MASTER: {
                d4: 'perception_master_d4',
                d6: 'perception_master_d6',
                d8: 'perception_master_d8',
                d10: 'perception_master_d10',
                d12: 'perception_master_d12',
                d20: 'perception_master_d20'
            }
        }
    },
    performance: {
        name: 'Performance',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'charisma',
        secondaryStat: 'agility',
        description: 'Entertain an audience through music, dance, acting, or storytelling',
        icon: 'General/Inspiration',
        rollableTables: {
            UNTRAINED: {
                d4: 'performance_untrained_d4',
                d6: 'performance_untrained_d6',
                d8: 'performance_untrained_d8',
                d10: 'performance_untrained_d10',
                d12: 'performance_untrained_d12',
                d20: 'performance_untrained_d20'
            },
            NOVICE: {
                d4: 'performance_novice_d4',
                d6: 'performance_novice_d6',
                d8: 'performance_novice_d8',
                d10: 'performance_novice_d10',
                d12: 'performance_novice_d12',
                d20: 'performance_novice_d20'
            },
            TRAINED: {
                d4: 'performance_trained_d4',
                d6: 'performance_trained_d6',
                d8: 'performance_trained_d8',
                d10: 'performance_trained_d10',
                d12: 'performance_trained_d12',
                d20: 'performance_trained_d20'
            },
            APPRENTICE: {
                d4: 'performance_apprentice_d4',
                d6: 'performance_apprentice_d6',
                d8: 'performance_apprentice_d8',
                d10: 'performance_apprentice_d10',
                d12: 'performance_apprentice_d12',
                d20: 'performance_apprentice_d20'
            },
            ADEPT: {
                d4: 'performance_adept_d4',
                d6: 'performance_adept_d6',
                d8: 'performance_adept_d8',
                d10: 'performance_adept_d10',
                d12: 'performance_adept_d12',
                d20: 'performance_adept_d20'
            },
            EXPERT: {
                d4: 'performance_expert_d4',
                d6: 'performance_expert_d6',
                d8: 'performance_expert_d8',
                d10: 'performance_expert_d10',
                d12: 'performance_expert_d12',
                d20: 'performance_expert_d20'
            },
            MASTER: {
                d4: 'performance_master_d4',
                d6: 'performance_master_d6',
                d8: 'performance_master_d8',
                d10: 'performance_master_d10',
                d12: 'performance_master_d12',
                d20: 'performance_master_d20'
            }
        }
    },
    religion: {
        name: 'Religion',
        category: SKILL_CATEGORIES.ARCANE.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Study and interpretation of divine entities, faith traditions, and sacred doctrine',
        icon: 'Radiant/Radiant Light 5',
        rollableTables: {
            UNTRAINED: {
                d4: 'religion_untrained_d4',
                d6: 'religion_untrained_d6',
                d8: 'religion_untrained_d8',
                d10: 'religion_untrained_d10',
                d12: 'religion_untrained_d12',
                d20: 'religion_untrained_d20'
            },
            NOVICE: {
                d4: 'religion_novice_d4',
                d6: 'religion_novice_d6',
                d8: 'religion_novice_d8',
                d10: 'religion_novice_d10',
                d12: 'religion_novice_d12',
                d20: 'religion_novice_d20'
            },
            TRAINED: {
                d4: 'religion_trained_d4',
                d6: 'religion_trained_d6',
                d8: 'religion_trained_d8',
                d10: 'religion_trained_d10',
                d12: 'religion_trained_d12',
                d20: 'religion_trained_d20'
            },
            APPRENTICE: {
                d4: 'religion_apprentice_d4',
                d6: 'religion_apprentice_d6',
                d8: 'religion_apprentice_d8',
                d10: 'religion_apprentice_d10',
                d12: 'religion_apprentice_d12',
                d20: 'religion_apprentice_d20'
            },
            ADEPT: {
                d4: 'religion_adept_d4',
                d6: 'religion_adept_d6',
                d8: 'religion_adept_d8',
                d10: 'religion_adept_d10',
                d12: 'religion_adept_d12',
                d20: 'religion_adept_d20'
            },
            EXPERT: {
                d4: 'religion_expert_d4',
                d6: 'religion_expert_d6',
                d8: 'religion_expert_d8',
                d10: 'religion_expert_d10',
                d12: 'religion_expert_d12',
                d20: 'religion_expert_d20'
            },
            MASTER: {
                d4: 'religion_master_d4',
                d6: 'religion_master_d6',
                d8: 'religion_master_d8',
                d10: 'religion_master_d10',
                d12: 'religion_master_d12',
                d20: 'religion_master_d20'
            }
        }
    },
    sleightOfHand: {
        name: 'Sleight of Hand',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'agility',
        secondaryStat: 'intelligence',
        description: 'Manual trickery including pickpocketing, concealing objects, and performing tricks',
        icon: 'General/Lockpick',
        rollableTables: {
            UNTRAINED: {
                d4: 'sleightOfHand_untrained_d4',
                d6: 'sleightOfHand_untrained_d6',
                d8: 'sleightOfHand_untrained_d8',
                d10: 'sleightOfHand_untrained_d10',
                d12: 'sleightOfHand_untrained_d12',
                d20: 'sleightOfHand_untrained_d20'
            },
            NOVICE: {
                d4: 'sleightOfHand_novice_d4',
                d6: 'sleightOfHand_novice_d6',
                d8: 'sleightOfHand_novice_d8',
                d10: 'sleightOfHand_novice_d10',
                d12: 'sleightOfHand_novice_d12',
                d20: 'sleightOfHand_novice_d20'
            },
            TRAINED: {
                d4: 'sleightOfHand_trained_d4',
                d6: 'sleightOfHand_trained_d6',
                d8: 'sleightOfHand_trained_d8',
                d10: 'sleightOfHand_trained_d10',
                d12: 'sleightOfHand_trained_d12',
                d20: 'sleightOfHand_trained_d20'
            },
            APPRENTICE: {
                d4: 'sleightOfHand_apprentice_d4',
                d6: 'sleightOfHand_apprentice_d6',
                d8: 'sleightOfHand_apprentice_d8',
                d10: 'sleightOfHand_apprentice_d10',
                d12: 'sleightOfHand_apprentice_d12',
                d20: 'sleightOfHand_apprentice_d20'
            },
            ADEPT: {
                d4: 'sleightOfHand_adept_d4',
                d6: 'sleightOfHand_adept_d6',
                d8: 'sleightOfHand_adept_d8',
                d10: 'sleightOfHand_adept_d10',
                d12: 'sleightOfHand_adept_d12',
                d20: 'sleightOfHand_adept_d20'
            },
            EXPERT: {
                d4: 'sleightOfHand_expert_d4',
                d6: 'sleightOfHand_expert_d6',
                d8: 'sleightOfHand_expert_d8',
                d10: 'sleightOfHand_expert_d10',
                d12: 'sleightOfHand_expert_d12',
                d20: 'sleightOfHand_expert_d20'
            },
            MASTER: {
                d4: 'sleightOfHand_master_d4',
                d6: 'sleightOfHand_master_d6',
                d8: 'sleightOfHand_master_d8',
                d10: 'sleightOfHand_master_d10',
                d12: 'sleightOfHand_master_d12',
                d20: 'sleightOfHand_master_d20'
            }
        }
    },
    stealth: {
        name: 'Stealth',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'agility',
        secondaryStat: 'intelligence',
        description: 'Move silently and hide from enemies to avoid detection',
        icon: 'General/Stealth',
        rollableTables: {
            UNTRAINED: {
                d4: 'stealth_untrained_d4',
                d6: 'stealth_untrained_d6',
                d8: 'stealth_untrained_d8',
                d10: 'stealth_untrained_d10',
                d12: 'stealth_untrained_d12',
                d20: 'stealth_untrained_d20'
            },
            NOVICE: {
                d4: 'stealth_novice_d4',
                d6: 'stealth_novice_d6',
                d8: 'stealth_novice_d8',
                d10: 'stealth_novice_d10',
                d12: 'stealth_novice_d12',
                d20: 'stealth_novice_d20'
            },
            TRAINED: {
                d4: 'stealth_trained_d4',
                d6: 'stealth_trained_d6',
                d8: 'stealth_trained_d8',
                d10: 'stealth_trained_d10',
                d12: 'stealth_trained_d12',
                d20: 'stealth_trained_d20'
            },
            APPRENTICE: {
                d4: 'stealth_apprentice_d4',
                d6: 'stealth_apprentice_d6',
                d8: 'stealth_apprentice_d8',
                d10: 'stealth_apprentice_d10',
                d12: 'stealth_apprentice_d12',
                d20: 'stealth_apprentice_d20'
            },
            ADEPT: {
                d4: 'stealth_adept_d4',
                d6: 'stealth_adept_d6',
                d8: 'stealth_adept_d8',
                d10: 'stealth_adept_d10',
                d12: 'stealth_adept_d12',
                d20: 'stealth_adept_d20'
            },
            EXPERT: {
                d4: 'stealth_expert_d4',
                d6: 'stealth_expert_d6',
                d8: 'stealth_expert_d8',
                d10: 'stealth_expert_d10',
                d12: 'stealth_expert_d12',
                d20: 'stealth_expert_d20'
            },
            MASTER: {
                d4: 'stealth_master_d4',
                d6: 'stealth_master_d6',
                d8: 'stealth_master_d8',
                d10: 'stealth_master_d10',
                d12: 'stealth_master_d12',
                d20: 'stealth_master_d20'
            }
        }
    },
    survival: {
        name: 'Survival',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'constitution',
        secondaryStat: 'intelligence',
        description: 'Follow tracks, hunt, navigate wilderness, and predict weather',
        icon: 'General/Glowing Paw Prints',
        rollableTables: {
            UNTRAINED: {
                d4: 'survival_untrained_d4',
                d6: 'survival_untrained_d6',
                d8: 'survival_untrained_d8',
                d10: 'survival_untrained_d10',
                d12: 'survival_untrained_d12',
                d20: 'survival_untrained_d20'
            },
            NOVICE: {
                d4: 'survival_novice_d4',
                d6: 'survival_novice_d6',
                d8: 'survival_novice_d8',
                d10: 'survival_novice_d10',
                d12: 'survival_novice_d12',
                d20: 'survival_novice_d20'
            },
            TRAINED: {
                d4: 'survival_trained_d4',
                d6: 'survival_trained_d6',
                d8: 'survival_trained_d8',
                d10: 'survival_trained_d10',
                d12: 'survival_trained_d12',
                d20: 'survival_trained_d20'
            },
            APPRENTICE: {
                d4: 'survival_apprentice_d4',
                d6: 'survival_apprentice_d6',
                d8: 'survival_apprentice_d8',
                d10: 'survival_apprentice_d10',
                d12: 'survival_apprentice_d12',
                d20: 'survival_apprentice_d20'
            },
            ADEPT: {
                d4: 'survival_adept_d4',
                d6: 'survival_adept_d6',
                d8: 'survival_adept_d8',
                d10: 'survival_adept_d10',
                d12: 'survival_adept_d12',
                d20: 'survival_adept_d20'
            },
            EXPERT: {
                d4: 'survival_expert_d4',
                d6: 'survival_expert_d6',
                d8: 'survival_expert_d8',
                d10: 'survival_expert_d10',
                d12: 'survival_expert_d12',
                d20: 'survival_expert_d20'
            },
            MASTER: {
                d4: 'survival_master_d4',
                d6: 'survival_master_d6',
                d8: 'survival_master_d8',
                d10: 'survival_master_d10',
                d12: 'survival_master_d12',
                d20: 'survival_master_d20'
            }
        }
    }
};

// Skill progression ranks - 7 levels of expertise with 10 quests per skill
export const SKILL_RANKS = {
    UNTRAINED: { name: 'Untrained', color: '#6b6b6b', questsRequired: 0, statBonus: 0 },
    NOVICE: { name: 'Novice', color: '#8b7355', questsRequired: 1, statBonus: 1 },
    TRAINED: { name: 'Trained', color: '#4a7c59', questsRequired: 3, statBonus: 2 },
    APPRENTICE: { name: 'Apprentice', color: '#5d8a6b', questsRequired: 6, statBonus: 3 },
    ADEPT: { name: 'Adept', color: '#2563eb', questsRequired: 9, statBonus: 4 },
    EXPERT: { name: 'Expert', color: '#7a3b2e', questsRequired: 11, statBonus: 5 },
    MASTER: { name: 'Master', color: '#9d4edd', questsRequired: 12, statBonus: 6 }
};
