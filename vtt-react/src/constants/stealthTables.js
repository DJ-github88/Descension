// Stealth Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total

export const STEALTH_TABLES = {
    // UNTRAINED - d4 through d20
    stealth_untrained_d4: {
        name: 'Untrained Stealth (d4)',
        description: 'Untrained stealth on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You knock something over, alert entire area', type: 'failure' },
            { roll: [2, 2], result: 'Loud stumbling, immediately detected', type: 'normal' },
            { roll: [3, 3], result: 'You manage to stay quiet, partially hidden', type: 'success' },
            { roll: [4, 4], result: 'Despite inexperience, you remain undetected', type: 'success' }
        ]
    },
    stealth_untrained_d6: {
        name: 'Untrained Stealth (d6)',
        description: 'Untrained stealth on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'Catastrophic noise, alert entire area', type: 'failure' },
            { roll: [3, 4], result: 'Loud stumbling, immediately detected', type: 'failure' },
            { roll: [5, 5], result: 'Partially hidden, enemies are alert', type: 'normal' },
            { roll: [6, 6], result: 'Successfully hidden, enemies unaware', type: 'success' }
        ]
    },
    stealth_untrained_d8: {
        name: 'Untrained Stealth (d8)',
        description: 'Untrained stealth on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'Catastrophic noise, alert entire area', type: 'failure' },
            { roll: [3, 5], result: 'Loud stumbling, immediately detected', type: 'failure' },
            { roll: [6, 7], result: 'Partially hidden, enemies are alert', type: 'normal' },
            { roll: [8, 8], result: 'Successfully hidden, enemies unaware', type: 'success' }
        ]
    },
    stealth_untrained_d10: {
        name: 'Untrained Stealth (d10)',
        description: 'Untrained stealth on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'Catastrophic noise, alert entire area', type: 'failure' },
            { roll: [4, 6], result: 'Loud stumbling, immediately detected', type: 'failure' },
            { roll: [7, 9], result: 'Partially hidden, enemies are alert', type: 'normal' },
            { roll: [10, 10], result: 'Successfully hidden, enemies unaware', type: 'success' }
        ]
    },
    stealth_untrained_d12: {
        name: 'Untrained Stealth (d12)',
        description: 'Untrained stealth on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'Catastrophic noise, alert entire area', type: 'failure' },
            { roll: [4, 7], result: 'Loud stumbling, immediately detected', type: 'failure' },
            { roll: [8, 11], result: 'Partially hidden, enemies are alert', type: 'normal' },
            { roll: [12, 12], result: 'Successfully hidden, enemies unaware', type: 'success' }
        ]
    },
    stealth_untrained_d20: {
        name: 'Untrained Stealth (d20)',
        description: 'Untrained stealth on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Catastrophic noise, alert entire area', type: 'failure' },
            { roll: [9, 14], result: 'Loud stumbling, immediately detected', type: 'failure' },
            { roll: [15, 18], result: 'Partially hidden, enemies are alert', type: 'normal' },
            { roll: [19, 19], result: 'Successfully hidden, enemies unaware', type: 'success' },
            { roll: [20, 20], result: 'Perfectly concealed despite inexperience', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    stealth_novice_d4: {
        name: 'Novice Stealth (d4)',
        description: 'Novice stealth on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Minor noise, enemies investigate', type: 'failure' },
            { roll: [2, 2], result: 'Successfully hidden, enemies unaware', type: 'normal' },
            { roll: [3, 3], result: 'Perfectly concealed, can move freely', type: 'success' },
            { roll: [4, 4], result: 'Become invisible, gain surprise attack advantage', type: 'critical' }
        ]
    },
    stealth_novice_d6: {
        name: 'Novice Stealth (d6)',
        description: 'Novice stealth on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Make loud noise, immediately detected', type: 'failure' },
            { roll: [2, 3], result: 'Partially hidden, enemies are alert', type: 'normal' },
            { roll: [4, 5], result: 'Successfully hidden, enemies unaware', type: 'success' },
            { roll: [6, 6], result: 'Perfectly concealed, can move freely', type: 'success' }
        ]
    },
    stealth_novice_d8: {
        name: 'Novice Stealth (d8)',
        description: 'Novice stealth on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Make loud noise, immediately detected', type: 'failure' },
            { roll: [2, 3], result: 'Partially hidden, enemies are alert', type: 'normal' },
            { roll: [4, 6], result: 'Successfully hidden, enemies unaware', type: 'success' },
            { roll: [7, 7], result: 'Perfectly concealed, can move freely', type: 'success' },
            { roll: [8, 8], result: 'Become invisible, gain surprise attack advantage', type: 'critical' }
        ]
    },
    stealth_novice_d10: {
        name: 'Novice Stealth (d10)',
        description: 'Novice stealth on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Make loud noise, immediately detected', type: 'failure' },
            { roll: [2, 4], result: 'Partially hidden, enemies are alert', type: 'normal' },
            { roll: [5, 7], result: 'Successfully hidden, enemies unaware', type: 'success' },
            { roll: [8, 9], result: 'Perfectly concealed, can move freely', type: 'success' },
            { roll: [10, 10], result: 'Become invisible, gain surprise attack advantage', type: 'critical' }
        ]
    },
    stealth_novice_d12: {
        name: 'Novice Stealth (d12)',
        description: 'Novice stealth on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'Make loud noise, immediately detected', type: 'failure' },
            { roll: [3, 5], result: 'Partially hidden, enemies are alert', type: 'normal' },
            { roll: [6, 9], result: 'Successfully hidden, enemies unaware', type: 'success' },
            { roll: [10, 11], result: 'Perfectly concealed, can move freely', type: 'success' },
            { roll: [12, 12], result: 'Become invisible, gain surprise attack advantage', type: 'critical' }
        ]
    },
    stealth_novice_d20: {
        name: 'Novice Stealth (d20)',
        description: 'Novice stealth on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Make loud noise, immediately detected', type: 'failure' },
            { roll: [4, 8], result: 'Partially hidden, enemies are alert', type: 'normal' },
            { roll: [9, 14], result: 'Successfully hidden, enemies unaware', type: 'success' },
            { roll: [15, 18], result: 'Perfectly concealed, can move freely', type: 'success' },
            { roll: [19, 19], result: 'Become invisible, gain surprise attack advantage', type: 'critical' },
            { roll: [20, 20], result: 'Shadow form, pass through enemies undetected', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    stealth_trained_d4: {
        name: 'Trained Stealth (d4)',
        description: 'Trained stealth on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Small misstep, attempt fails', type: 'failure' },
            { roll: [2, 2], result: 'Perfectly concealed, can move freely', type: 'success' },
            { roll: [3, 3], result: 'Become invisible, gain surprise attack advantage', type: 'success' },
            { roll: [4, 4], result: 'Shadow form, pass through enemies undetected', type: 'critical' }
        ]
    },
    stealth_trained_d6: {
        name: 'Trained Stealth (d6)',
        description: 'Trained stealth on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Minor sound, enemies investigate', type: 'failure' },
            { roll: [2, 2], result: 'Successfully hidden, enemies unaware', type: 'normal' },
            { roll: [3, 4], result: 'Perfectly concealed, can move freely', type: 'success' },
            { roll: [5, 5], result: 'Become invisible, gain surprise attack advantage', type: 'success' },
            { roll: [6, 6], result: 'Shadow form, pass through enemies undetected', type: 'critical' }
        ]
    },
    stealth_trained_d8: {
        name: 'Trained Stealth (d8)',
        description: 'Trained stealth on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Minor sound, enemies investigate', type: 'failure' },
            { roll: [2, 2], result: 'Successfully hidden, enemies unaware', type: 'normal' },
            { roll: [3, 5], result: 'Perfectly concealed, can move freely', type: 'success' },
            { roll: [6, 7], result: 'Become invisible, gain surprise attack advantage', type: 'success' },
            { roll: [8, 8], result: 'Shadow form, pass through enemies undetected', type: 'critical' }
        ]
    },
    stealth_trained_d10: {
        name: 'Trained Stealth (d10)',
        description: 'Trained stealth on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Minor sound, enemies investigate', type: 'failure' },
            { roll: [2, 3], result: 'Successfully hidden, enemies unaware', type: 'normal' },
            { roll: [4, 6], result: 'Perfectly concealed, can move freely', type: 'success' },
            { roll: [7, 9], result: 'Become invisible, gain surprise attack advantage', type: 'success' },
            { roll: [10, 10], result: 'Shadow form, pass through enemies undetected', type: 'critical' }
        ]
    },
    stealth_trained_d12: {
        name: 'Trained Stealth (d12)',
        description: 'Trained stealth on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Minor sound, enemies investigate', type: 'failure' },
            { roll: [2, 3], result: 'Successfully hidden, enemies unaware', type: 'normal' },
            { roll: [4, 7], result: 'Perfectly concealed, can move freely', type: 'success' },
            { roll: [8, 11], result: 'Become invisible, gain surprise attack advantage', type: 'success' },
            { roll: [12, 12], result: 'Shadow form, pass through enemies undetected', type: 'critical' }
        ]
    },
    stealth_trained_d20: {
        name: 'Trained Stealth (d20)',
        description: 'Trained stealth on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Minor sound, enemies investigate', type: 'failure' },
            { roll: [3, 7], result: 'Successfully hidden, enemies unaware', type: 'normal' },
            { roll: [8, 13], result: 'Perfectly concealed, can move freely', type: 'success' },
            { roll: [14, 17], result: 'Become invisible, gain surprise attack advantage', type: 'success' },
            { roll: [18, 19], result: 'Shadow form, pass through enemies undetected', type: 'critical' },
            { roll: [20, 20], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    stealth_apprentice_d4: {
        name: 'Apprentice Stealth (d4)',
        description: 'Apprentice stealth on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Become invisible, gain surprise attack advantage', type: 'success' },
            { roll: [3, 3], result: 'Shadow form, pass through enemies undetected', type: 'critical' },
            { roll: [4, 4], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'critical' }
        ]
    },
    stealth_apprentice_d6: {
        name: 'Apprentice Stealth (d6)',
        description: 'Apprentice stealth on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Well hidden, slight movement noticed', type: 'failure' },
            { roll: [2, 2], result: 'Perfectly concealed, can move freely', type: 'normal' },
            { roll: [3, 4], result: 'Become invisible, gain surprise attack advantage', type: 'success' },
            { roll: [5, 5], result: 'Shadow form, pass through enemies undetected', type: 'success' },
            { roll: [6, 6], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'critical' }
        ]
    },
    stealth_apprentice_d8: {
        name: 'Apprentice Stealth (d8)',
        description: 'Apprentice stealth on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Well hidden, slight movement noticed', type: 'failure' },
            { roll: [2, 2], result: 'Perfectly concealed, can move freely', type: 'normal' },
            { roll: [3, 4], result: 'Become invisible, gain surprise attack advantage', type: 'success' },
            { roll: [5, 6], result: 'Shadow form, pass through enemies undetected', type: 'success' },
            { roll: [7, 7], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'critical' },
            { roll: [8, 8], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'critical' }
        ]
    },
    stealth_apprentice_d10: {
        name: 'Apprentice Stealth (d10)',
        description: 'Apprentice stealth on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Well hidden, slight movement noticed', type: 'failure' },
            { roll: [2, 3], result: 'Perfectly concealed, can move freely', type: 'normal' },
            { roll: [4, 5], result: 'Become invisible, gain surprise attack advantage', type: 'success' },
            { roll: [6, 8], result: 'Shadow form, pass through enemies undetected', type: 'success' },
            { roll: [9, 9], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'critical' },
            { roll: [10, 10], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'critical' }
        ]
    },
    stealth_apprentice_d12: {
        name: 'Apprentice Stealth (d12)',
        description: 'Apprentice stealth on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Well hidden, slight movement noticed', type: 'failure' },
            { roll: [2, 3], result: 'Perfectly concealed, can move freely', type: 'normal' },
            { roll: [4, 6], result: 'Become invisible, gain surprise attack advantage', type: 'success' },
            { roll: [7, 9], result: 'Shadow form, pass through enemies undetected', type: 'success' },
            { roll: [10, 11], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'critical' },
            { roll: [12, 12], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'critical' }
        ]
    },
    stealth_apprentice_d20: {
        name: 'Apprentice Stealth (d20)',
        description: 'Apprentice stealth on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Well hidden, slight movement noticed', type: 'failure' },
            { roll: [2, 6], result: 'Perfectly concealed, can move freely', type: 'normal' },
            { roll: [7, 12], result: 'Become invisible, gain surprise attack advantage', type: 'success' },
            { roll: [13, 16], result: 'Shadow form, pass through enemies undetected', type: 'success' },
            { roll: [17, 19], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'critical' },
            { roll: [20, 20], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    stealth_adept_d4: {
        name: 'Adept Stealth (d4)',
        description: 'Adept stealth on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Shadow form, pass through enemies undetected', type: 'success' },
            { roll: [3, 3], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'critical' },
            { roll: [4, 4], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'critical' }
        ]
    },
    stealth_adept_d6: {
        name: 'Adept Stealth (d6)',
        description: 'Adept stealth on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Become invisible, gain surprise attack advantage', type: 'normal' },
            { roll: [3, 3], result: 'Shadow form, pass through enemies undetected', type: 'success' },
            { roll: [4, 5], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'success' },
            { roll: [6, 6], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'critical' }
        ]
    },
    stealth_adept_d8: {
        name: 'Adept Stealth (d8)',
        description: 'Adept stealth on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Become invisible, gain surprise attack advantage', type: 'normal' },
            { roll: [3, 4], result: 'Shadow form, pass through enemies undetected', type: 'success' },
            { roll: [5, 6], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'success' },
            { roll: [7, 7], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'critical' },
            { roll: [8, 8], result: 'Divine concealment, erase your existence from memory', type: 'critical' }
        ]
    },
    stealth_adept_d10: {
        name: 'Adept Stealth (d10)',
        description: 'Adept stealth on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Become invisible, gain surprise attack advantage', type: 'normal' },
            { roll: [3, 4], result: 'Shadow form, pass through enemies undetected', type: 'success' },
            { roll: [5, 7], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'success' },
            { roll: [8, 9], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'critical' },
            { roll: [10, 10], result: 'Divine concealment, erase your existence from memory', type: 'critical' }
        ]
    },
    stealth_adept_d12: {
        name: 'Adept Stealth (d12)',
        description: 'Adept stealth on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Become invisible, gain surprise attack advantage', type: 'normal' },
            { roll: [3, 5], result: 'Shadow form, pass through enemies undetected', type: 'success' },
            { roll: [6, 8], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'success' },
            { roll: [9, 11], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'critical' },
            { roll: [12, 12], result: 'Divine concealment, erase your existence from memory', type: 'critical' }
        ]
    },
    stealth_adept_d20: {
        name: 'Adept Stealth (d20)',
        description: 'Adept stealth on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 5], result: 'Become invisible, gain surprise attack advantage', type: 'normal' },
            { roll: [6, 11], result: 'Shadow form, pass through enemies undetected', type: 'success' },
            { roll: [12, 15], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'success' },
            { roll: [16, 18], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'critical' },
            { roll: [19, 20], result: 'Divine concealment, erase your existence from memory', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    stealth_expert_d4: {
        name: 'Expert Stealth (d4)',
        description: 'Expert stealth on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'success' },
            { roll: [3, 3], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'critical' },
            { roll: [4, 4], result: 'Divine concealment, erase your existence from memory', type: 'critical' }
        ]
    },
    stealth_expert_d6: {
        name: 'Expert Stealth (d6)',
        description: 'Expert stealth on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Shadow form, pass through enemies undetected', type: 'normal' },
            { roll: [3, 3], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'success' },
            { roll: [4, 4], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'success' },
            { roll: [5, 6], result: 'Divine concealment, erase your existence from memory', type: 'critical' }
        ]
    },
    stealth_expert_d8: {
        name: 'Expert Stealth (d8)',
        description: 'Expert stealth on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Shadow form, pass through enemies undetected', type: 'normal' },
            { roll: [3, 4], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'success' },
            { roll: [5, 6], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'success' },
            { roll: [7, 7], result: 'Divine concealment, erase your existence from memory', type: 'critical' },
            { roll: [8, 8], result: 'Ultimate stealth, become undetectable by all means + instant kill', type: 'critical' }
        ]
    },
    stealth_expert_d10: {
        name: 'Expert Stealth (d10)',
        description: 'Expert stealth on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Shadow form, pass through enemies undetected', type: 'normal' },
            { roll: [3, 4], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'success' },
            { roll: [5, 7], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'success' },
            { roll: [8, 9], result: 'Divine concealment, erase your existence from memory', type: 'critical' },
            { roll: [10, 10], result: 'Ultimate stealth, become undetectable by all means + instant kill', type: 'critical' }
        ]
    },
    stealth_expert_d12: {
        name: 'Expert Stealth (d12)',
        description: 'Expert stealth on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 3], result: 'Shadow form, pass through enemies undetected', type: 'normal' },
            { roll: [4, 6], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'success' },
            { roll: [7, 9], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'success' },
            { roll: [10, 11], result: 'Divine concealment, erase your existence from memory', type: 'critical' },
            { roll: [12, 12], result: 'Ultimate stealth, become undetectable by all means + instant kill', type: 'critical' }
        ]
    },
    stealth_expert_d20: {
        name: 'Expert Stealth (d20)',
        description: 'Expert stealth on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 4], result: 'Shadow form, pass through enemies undetected', type: 'normal' },
            { roll: [5, 9], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'success' },
            { roll: [10, 14], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'success' },
            { roll: [15, 17], result: 'Divine concealment, erase your existence from memory', type: 'critical' },
            { roll: [18, 20], result: 'Ultimate stealth, become undetectable by all means + instant kill', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    stealth_master_d4: {
        name: 'Master Stealth (d4)',
        description: 'Master stealth on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'success' },
            { roll: [3, 3], result: 'Divine concealment, erase your existence from memory', type: 'critical' },
            { roll: [4, 4], result: 'Ultimate stealth, become undetectable by all means + instant kill', type: 'critical' }
        ]
    },
    stealth_master_d6: {
        name: 'Master Stealth (d6)',
        description: 'Master stealth on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'normal' },
            { roll: [3, 3], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'success' },
            { roll: [4, 5], result: 'Divine concealment, erase your existence from memory', type: 'success' },
            { roll: [6, 6], result: 'Ultimate stealth, become undetectable by all means + instant kill', type: 'critical' }
        ]
    },
    stealth_master_d8: {
        name: 'Master Stealth (d8)',
        description: 'Master stealth on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'normal' },
            { roll: [3, 4], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'success' },
            { roll: [5, 6], result: 'Divine concealment, erase your existence from memory', type: 'success' },
            { roll: [7, 7], result: 'Ultimate stealth, become undetectable by all means + instant kill', type: 'critical' },
            { roll: [8, 8], result: 'Absolute stealth, rewrite reality to never have been there', type: 'critical' }
        ]
    },
    stealth_master_d10: {
        name: 'Master Stealth (d10)',
        description: 'Master stealth on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'normal' },
            { roll: [3, 4], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'success' },
            { roll: [5, 7], result: 'Divine concealment, erase your existence from memory', type: 'success' },
            { roll: [8, 9], result: 'Ultimate stealth, become undetectable by all means + instant kill', type: 'critical' },
            { roll: [10, 10], result: 'Absolute stealth, rewrite reality to never have been there', type: 'critical' }
        ]
    },
    stealth_master_d12: {
        name: 'Master Stealth (d12)',
        description: 'Master stealth on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'normal' },
            { roll: [3, 5], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'success' },
            { roll: [6, 8], result: 'Divine concealment, erase your existence from memory', type: 'success' },
            { roll: [9, 11], result: 'Ultimate stealth, become undetectable by all means + instant kill', type: 'critical' },
            { roll: [12, 12], result: 'Absolute stealth, rewrite reality to never have been there', type: 'critical' }
        ]
    },
    stealth_master_d20: {
        name: 'Master Stealth (d20)',
        description: 'Master stealth on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 3], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'normal' },
            { roll: [4, 8], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'success' },
            { roll: [9, 13], result: 'Divine concealment, erase your existence from memory', type: 'success' },
            { roll: [14, 16], result: 'Ultimate stealth, become undetectable by all means + instant kill', type: 'critical' },
            { roll: [17, 20], result: 'Absolute stealth, rewrite reality to never have been there', type: 'critical' }
        ]
    }
};

