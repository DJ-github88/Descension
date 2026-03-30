// Arcana Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total
// Governs manipulation, sensing, and control of ambient magical energy

export const ARCANA_TABLES = {
    // UNTRAINED - d4 through d20
    arcana_untrained_d4: {
        name: 'Untrained Arcana (d4)',
        description: 'Untrained arcana on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Energy backlash, minor mana drain', type: 'failure' },
            { roll: [2, 2], result: 'Unstable channeling, energy flickers', type: 'normal' },
            { roll: [3, 3], result: 'Brief control, energy holds momentarily', type: 'success' },
            { roll: [4, 4], result: 'Lucky stabilization, clean flow', type: 'success' }
        ]
    },
    arcana_untrained_d6: {
        name: 'Untrained Arcana (d6)',
        description: 'Untrained arcana on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Magical feedback burns your hands', type: 'failure' },
            { roll: [2, 2], result: 'Energy dissipates before you can shape it', type: 'failure' },
            { roll: [3, 4], result: 'Partial channeling, unstable but present', type: 'normal' },
            { roll: [5, 5], result: 'You manage brief control', type: 'success' },
            { roll: [6, 6], result: 'Clean energy flow despite inexperience', type: 'success' }
        ]
    },
    arcana_untrained_d8: {
        name: 'Untrained Arcana (d8)',
        description: 'Untrained arcana on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Arcane surge overwhelms you, lose focus', type: 'failure' },
            { roll: [2, 2], result: 'Energy rejects your touch, minor shock', type: 'failure' },
            { roll: [3, 4], result: 'Chaotic flow, barely contained', type: 'failure' },
            { roll: [5, 5], result: 'You sense the energy but cannot hold it', type: 'normal' },
            { roll: [6, 6], result: 'Brief stabilization before it fades', type: 'normal' },
            { roll: [7, 7], result: 'You channel energy with shaky control', type: 'success' },
            { roll: [8, 8], result: 'Surprisingly stable flow', type: 'success' }
        ]
    },
    arcana_untrained_d10: {
        name: 'Untrained Arcana (d10)',
        description: 'Untrained arcana on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Violent discharge, equipment damaged', type: 'failure' },
            { roll: [2, 2], result: 'Energy backlash, mental exhaustion', type: 'failure' },
            { roll: [3, 4], result: 'Uncontrolled surge, magic scatters', type: 'failure' },
            { roll: [5, 5], result: 'You detect the field but cannot touch it', type: 'failure' },
            { roll: [6, 6], result: 'Fleeting contact, energy slips away', type: 'normal' },
            { roll: [7, 7], result: 'Unstable hold, requires constant focus', type: 'normal' },
            { roll: [8, 8], result: 'You manage partial channeling', type: 'success' },
            { roll: [9, 9], result: 'Brief but clean energy flow', type: 'success' },
            { roll: [10, 10], result: 'Unexpected control, stable for a moment', type: 'critical' }
        ]
    },
    arcana_untrained_d12: {
        name: 'Untrained Arcana (d12)',
        description: 'Untrained arcana on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Catastrophic feedback, focus item cracks', type: 'failure' },
            { roll: [2, 2], result: 'Arcane burnout, cannot attempt again soon', type: 'failure' },
            { roll: [3, 4], result: 'Wild energy lash, minor injury', type: 'failure' },
            { roll: [5, 5], result: 'Complete rejection, magic repels you', type: 'failure' },
            { roll: [6, 6], result: 'You sense powerful currents but cannot grasp them', type: 'normal' },
            { roll: [7, 8], result: 'Momentary contact, energy too volatile', type: 'normal' },
            { roll: [9, 9], result: 'Unstable channeling, fades quickly', type: 'normal' },
            { roll: [10, 10], result: 'You manage brief control', type: 'success' },
            { roll: [11, 12], result: 'Lucky stabilization, clean but short flow', type: 'success' }
        ]
    },
    arcana_untrained_d20: {
        name: 'Untrained Arcana (d20)',
        description: 'Untrained arcana on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'Explosive backlash, severe mana drain and disorientation', type: 'failure' },
            { roll: [3, 3], result: 'Arcane shock, lose consciousness briefly', type: 'failure' },
            { roll: [4, 5], result: 'Violent rejection, magic burns your mind', type: 'failure' },
            { roll: [6, 6], result: 'Complete failure, energy too complex', type: 'failure' },
            { roll: [7, 7], result: 'You detect immense power but cannot approach', type: 'failure' },
            { roll: [8, 9], result: 'Fleeting awareness, no control possible', type: 'normal' },
            { roll: [10, 10], result: 'Brief contact before overwhelming surge', type: 'normal' },
            { roll: [11, 11], result: 'You sense the pattern but cannot hold it', type: 'normal' },
            { roll: [12, 13], result: 'Momentary stabilization, quickly lost', type: 'normal' },
            { roll: [14, 14], result: 'Unstable channeling, requires full concentration', type: 'success' },
            { roll: [15, 15], result: 'You manage partial control', type: 'success' },
            { roll: [16, 17], result: 'Brief but clean energy flow', type: 'success' },
            { roll: [18, 20], result: 'Miraculous stabilization, perfect moment of control', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    arcana_novice_d4: {
        name: 'Novice Arcana (d4)',
        description: 'Novice arcana on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Energy wavers, brief loss of focus', type: 'failure' },
            { roll: [2, 2], result: 'Stable channeling, clean flow', type: 'success' },
            { roll: [3, 3], result: 'Smooth control, energy responds well', type: 'success' },
            { roll: [4, 4], result: 'Perfect flow, effortless manipulation', type: 'critical' }
        ]
    },
    arcana_novice_d6: {
        name: 'Novice Arcana (d6)',
        description: 'Novice arcana on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Brief instability, lose control momentarily', type: 'failure' },
            { roll: [2, 2], result: 'Steady channeling, minor adjustments needed', type: 'success' },
            { roll: [3, 4], result: 'Clean energy flow, well controlled', type: 'success' },
            { roll: [5, 5], result: 'Smooth manipulation, energy obeys', type: 'critical' },
            { roll: [6, 6], result: 'Effortless control, perfect harmony', type: 'critical' }
        ]
    },
    arcana_novice_d8: {
        name: 'Novice Arcana (d8)',
        description: 'Novice arcana on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Energy resists, minor feedback', type: 'failure' },
            { roll: [2, 2], result: 'Unstable flow, requires focus', type: 'normal' },
            { roll: [3, 4], result: 'Partial control, energy fluctuates', type: 'normal' },
            { roll: [5, 5], result: 'Steady channeling achieved', type: 'success' },
            { roll: [6, 6], result: 'Clean flow, well managed', type: 'success' },
            { roll: [7, 7], result: 'Smooth control, energy responds', type: 'critical' },
            { roll: [8, 8], result: 'Perfect manipulation, harmonious flow', type: 'critical' }
        ]
    },
    arcana_novice_d10: {
        name: 'Novice Arcana (d10)',
        description: 'Novice arcana on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Arcane backlash, lose concentration', type: 'failure' },
            { roll: [2, 2], result: 'Energy scatters, difficult to recapture', type: 'failure' },
            { roll: [3, 4], result: 'Chaotic flow, barely contained', type: 'normal' },
            { roll: [5, 5], result: 'Unstable but present, requires effort', type: 'normal' },
            { roll: [6, 6], result: 'Partial stabilization achieved', type: 'success' },
            { roll: [7, 7], result: 'Steady channeling, good control', type: 'success' },
            { roll: [8, 8], result: 'Clean energy flow', type: 'success' },
            { roll: [9, 9], result: 'Smooth manipulation, well executed', type: 'critical' },
            { roll: [10, 10], result: 'Perfect control, energy harmonizes', type: 'critical' }
        ]
    },
    arcana_novice_d12: {
        name: 'Novice Arcana (d12)',
        description: 'Novice arcana on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Violent feedback, mental strain', type: 'failure' },
            { roll: [2, 2], result: 'Energy rejects control, dissipates', type: 'failure' },
            { roll: [3, 4], result: 'Wild fluctuations, hard to manage', type: 'failure' },
            { roll: [5, 5], result: 'You sense the pattern but struggle to hold it', type: 'normal' },
            { roll: [6, 6], result: 'Unstable channeling, constant adjustments', type: 'normal' },
            { roll: [7, 8], result: 'Partial control, energy wavers', type: 'normal' },
            { roll: [9, 9], result: 'Steady flow achieved', type: 'success' },
            { roll: [10, 10], result: 'Clean channeling, well controlled', type: 'success' },
            { roll: [11, 12], result: 'Smooth manipulation, energy responds', type: 'critical' }
        ]
    },
    arcana_novice_d20: {
        name: 'Novice Arcana (d20)',
        description: 'Novice arcana on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'Catastrophic backlash, severe mana drain', type: 'failure' },
            { roll: [3, 3], result: 'Arcane shock, disoriented', type: 'failure' },
            { roll: [4, 5], result: 'Energy overwhelms you, lose focus', type: 'failure' },
            { roll: [6, 6], result: 'Complete rejection, too complex', type: 'failure' },
            { roll: [7, 7], result: 'You detect the field but cannot grasp it', type: 'failure' },
            { roll: [8, 9], result: 'Fleeting contact, energy too volatile', type: 'normal' },
            { roll: [10, 10], result: 'Brief hold before surge breaks free', type: 'normal' },
            { roll: [11, 11], result: 'Unstable channeling, fades quickly', type: 'normal' },
            { roll: [12, 13], result: 'Partial control, requires full focus', type: 'normal' },
            { roll: [14, 14], result: 'You manage steady flow', type: 'success' },
            { roll: [15, 15], result: 'Clean channeling achieved', type: 'success' },
            { roll: [16, 17], result: 'Smooth control, energy responds', type: 'success' },
            { roll: [18, 20], result: 'Excellent manipulation, harmonious flow', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    arcana_trained_d4: {
        name: 'Trained Arcana (d4)',
        description: 'Trained arcana on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Smooth control, energy harmonizes', type: 'critical' },
            { roll: [3, 3], result: 'Flawless manipulation, resonant flow', type: 'critical' },
            { roll: [4, 4], result: 'Perfect attunement, energy responds instantly', type: 'critical' }
        ]
    },
    arcana_trained_d6: {
        name: 'Trained Arcana (d6)',
        description: 'Trained arcana on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Slight error, execution falters', type: 'failure' },
            { roll: [2, 2], result: 'Smooth control, well executed', type: 'success' },
            { roll: [3, 4], result: 'Effortless manipulation, energy obeys', type: 'critical' },
            { roll: [5, 5], result: 'Perfect flow, harmonious resonance', type: 'critical' },
            { roll: [6, 6], result: 'Flawless control, energy synchronizes', type: 'critical' }
        ]
    },
    arcana_trained_d8: {
        name: 'Trained Arcana (d8)',
        description: 'Trained arcana on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Steady channeling, good control', type: 'success' },
            { roll: [3, 4], result: 'Clean flow, well managed', type: 'success' },
            { roll: [5, 5], result: 'Smooth manipulation, energy responds', type: 'success' },
            { roll: [6, 6], result: 'Effortless control, harmonious flow', type: 'critical' },
            { roll: [7, 7], result: 'Perfect channeling, resonant energy', type: 'critical' },
            { roll: [8, 8], result: 'Flawless manipulation, complete synchronization', type: 'critical' }
        ]
    },
    arcana_trained_d10: {
        name: 'Trained Arcana (d10)',
        description: 'Trained arcana on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Energy resists, minor feedback', type: 'failure' },
            { roll: [2, 2], result: 'Unstable flow, requires focus', type: 'normal' },
            { roll: [3, 4], result: 'Partial control, energy fluctuates', type: 'normal' },
            { roll: [5, 5], result: 'Steady channeling achieved', type: 'success' },
            { roll: [6, 6], result: 'Clean flow, well controlled', type: 'success' },
            { roll: [7, 7], result: 'Smooth manipulation, energy responds', type: 'success' },
            { roll: [8, 8], result: 'Effortless control, harmonious flow', type: 'critical' },
            { roll: [9, 9], result: 'Perfect channeling, resonant energy', type: 'critical' },
            { roll: [10, 10], result: 'Flawless manipulation, complete attunement', type: 'critical' }
        ]
    },
    arcana_trained_d12: {
        name: 'Trained Arcana (d12)',
        description: 'Trained arcana on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Arcane backlash, lose concentration', type: 'failure' },
            { roll: [2, 2], result: 'Energy scatters, difficult to recapture', type: 'failure' },
            { roll: [3, 4], result: 'Chaotic flow, barely contained', type: 'normal' },
            { roll: [5, 5], result: 'Unstable but present, requires effort', type: 'normal' },
            { roll: [6, 6], result: 'Partial stabilization achieved', type: 'success' },
            { roll: [7, 8], result: 'Steady channeling, good control', type: 'success' },
            { roll: [9, 9], result: 'Clean energy flow', type: 'success' },
            { roll: [10, 10], result: 'Smooth manipulation, harmonious', type: 'critical' },
            { roll: [11, 12], result: 'Perfect control, resonant energy', type: 'critical' }
        ]
    },
    arcana_trained_d20: {
        name: 'Trained Arcana (d20)',
        description: 'Trained arcana on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Violent backlash, severe mana drain', type: 'failure' },
            { roll: [3, 3], result: 'Arcane shock, disoriented', type: 'failure' },
            { roll: [4, 5], result: 'Energy overwhelms you, lose focus', type: 'failure' },
            { roll: [6, 6], result: 'Complete rejection, too volatile', type: 'failure' },
            { roll: [7, 7], result: 'You detect the field but struggle to grasp it', type: 'normal' },
            { roll: [8, 9], result: 'Fleeting contact, energy resists', type: 'normal' },
            { roll: [10, 10], result: 'Brief hold, requires full concentration', type: 'normal' },
            { roll: [11, 11], result: 'Unstable channeling, constant adjustments', type: 'normal' },
            { roll: [12, 13], result: 'Partial control achieved', type: 'success' },
            { roll: [14, 14], result: 'Steady flow, well managed', type: 'success' },
            { roll: [15, 15], result: 'Clean channeling, good control', type: 'success' },
            { roll: [16, 17], result: 'Smooth manipulation, energy responds', type: 'critical' },
            { roll: [18, 20], result: 'Excellent control, harmonious resonance', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    arcana_apprentice_d4: {
        name: 'Apprentice Arcana (d4)',
        description: 'Apprentice arcana on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Flawless control, energy synchronizes', type: 'critical' },
            { roll: [3, 3], result: 'Harmonious flow, resonant manipulation', type: 'critical' },
            { roll: [4, 4], result: 'Complete mastery, effortless precision', type: 'critical' }
        ]
    },
    arcana_apprentice_d6: {
        name: 'Apprentice Arcana (d6)',
        description: 'Apprentice arcana on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Slight error, execution falters', type: 'failure' },
            { roll: [2, 2], result: 'Effortless manipulation, energy obeys', type: 'critical' },
            { roll: [3, 4], result: 'Perfect channeling, harmonious resonance', type: 'critical' },
            { roll: [5, 5], result: 'Flawless control, complete synchronization', type: 'critical' },
            { roll: [6, 6], result: 'Masterful attunement, energy flows like water', type: 'critical' }
        ]
    },
    arcana_apprentice_d8: {
        name: 'Apprentice Arcana (d8)',
        description: 'Apprentice arcana on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Slight error, execution falters', type: 'failure' },
            { roll: [2, 2], result: 'Clean control, well executed', type: 'success' },
            { roll: [3, 4], result: 'Smooth manipulation, energy responds', type: 'success' },
            { roll: [5, 5], result: 'Effortless channeling, harmonious flow', type: 'critical' },
            { roll: [6, 6], result: 'Perfect control, resonant energy', type: 'critical' },
            { roll: [7, 7], result: 'Flawless manipulation, complete attunement', type: 'critical' },
            { roll: [8, 8], result: 'Masterful precision, energy synchronizes perfectly', type: 'critical' }
        ]
    },
    arcana_apprentice_d10: {
        name: 'Apprentice Arcana (d10)',
        description: 'Apprentice arcana on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Partial control, energy wavers', type: 'normal' },
            { roll: [3, 4], result: 'Steady channeling achieved', type: 'success' },
            { roll: [5, 5], result: 'Clean flow, well controlled', type: 'success' },
            { roll: [6, 6], result: 'Smooth manipulation, energy responds', type: 'success' },
            { roll: [7, 7], result: 'Effortless control, harmonious flow', type: 'success' },
            { roll: [8, 8], result: 'Perfect channeling, resonant energy', type: 'critical' },
            { roll: [9, 9], result: 'Flawless manipulation, complete attunement', type: 'critical' },
            { roll: [10, 10], result: 'Masterful precision, energy obeys instantly', type: 'critical' }
        ]
    },
    arcana_apprentice_d12: {
        name: 'Apprentice Arcana (d12)',
        description: 'Apprentice arcana on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Energy resists, minor feedback', type: 'failure' },
            { roll: [2, 2], result: 'Unstable flow, requires focus', type: 'normal' },
            { roll: [3, 4], result: 'Partial control, energy fluctuates', type: 'normal' },
            { roll: [5, 5], result: 'Steady channeling achieved', type: 'success' },
            { roll: [6, 6], result: 'Clean flow, well controlled', type: 'success' },
            { roll: [7, 8], result: 'Smooth manipulation, energy responds', type: 'success' },
            { roll: [9, 9], result: 'Effortless control, harmonious flow', type: 'critical' },
            { roll: [10, 10], result: 'Perfect channeling, resonant energy', type: 'critical' },
            { roll: [11, 12], result: 'Flawless manipulation, complete synchronization', type: 'critical' }
        ]
    },
    arcana_apprentice_d20: {
        name: 'Apprentice Arcana (d20)',
        description: 'Apprentice arcana on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 2], result: 'Arcane backlash, mana drain', type: 'failure' },
            { roll: [3, 3], result: 'Energy scatters, lose focus', type: 'failure' },
            { roll: [4, 5], result: 'Chaotic flow, barely contained', type: 'failure' },
            { roll: [6, 6], result: 'You detect the pattern but struggle to hold it', type: 'normal' },
            { roll: [7, 7], result: 'Unstable channeling, constant adjustments', type: 'normal' },
            { roll: [8, 9], result: 'Partial control, energy wavers', type: 'normal' },
            { roll: [10, 10], result: 'Steady flow achieved', type: 'normal' },
            { roll: [11, 11], result: 'Clean channeling, good control', type: 'success' },
            { roll: [12, 13], result: 'Smooth manipulation, energy responds', type: 'success' },
            { roll: [14, 14], result: 'Effortless control, harmonious flow', type: 'success' },
            { roll: [15, 15], result: 'Perfect channeling, resonant energy', type: 'critical' },
            { roll: [16, 17], result: 'Flawless manipulation, complete attunement', type: 'critical' },
            { roll: [18, 20], result: 'Masterful precision, energy synchronizes perfectly', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    arcana_adept_d4: {
        name: 'Adept Arcana (d4)',
        description: 'Adept arcana on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Perfect harmony, energy flows effortlessly', type: 'critical' },
            { roll: [3, 3], result: 'Complete mastery, resonant precision', type: 'critical' },
            { roll: [4, 4], result: 'Absolute control, energy obeys without thought', type: 'critical' }
        ]
    },
    arcana_adept_d6: {
        name: 'Adept Arcana (d6)',
        description: 'Adept arcana on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Flawless manipulation, energy synchronizes', type: 'critical' },
            { roll: [3, 4], result: 'Harmonious channeling, resonant precision', type: 'critical' },
            { roll: [5, 5], result: 'Complete attunement, energy flows like thought', type: 'critical' },
            { roll: [6, 6], result: 'Absolute mastery, perfect synchronization', type: 'critical' }
        ]
    },
    arcana_adept_d8: {
        name: 'Adept Arcana (d8)',
        description: 'Adept arcana on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Slight error, execution falters', type: 'failure' },
            { roll: [2, 2], result: 'Smooth control, energy responds', type: 'success' },
            { roll: [3, 4], result: 'Effortless manipulation, harmonious flow', type: 'critical' },
            { roll: [5, 5], result: 'Perfect channeling, resonant energy', type: 'critical' },
            { roll: [6, 6], result: 'Flawless control, complete attunement', type: 'critical' },
            { roll: [7, 7], result: 'Masterful precision, energy synchronizes', type: 'critical' },
            { roll: [8, 8], result: 'Absolute harmony, perfect flow', type: 'critical' }
        ]
    },
    arcana_adept_d10: {
        name: 'Adept Arcana (d10)',
        description: 'Adept arcana on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Steady channeling achieved', type: 'success' },
            { roll: [3, 4], result: 'Clean flow, well controlled', type: 'success' },
            { roll: [5, 5], result: 'Smooth manipulation, energy responds', type: 'success' },
            { roll: [6, 6], result: 'Effortless control, harmonious flow', type: 'success' },
            { roll: [7, 7], result: 'Perfect channeling, resonant energy', type: 'critical' },
            { roll: [8, 8], result: 'Flawless manipulation, complete attunement', type: 'critical' },
            { roll: [9, 9], result: 'Masterful precision, energy synchronizes', type: 'critical' },
            { roll: [10, 10], result: 'Absolute control, perfect harmony', type: 'critical' }
        ]
    },
    arcana_adept_d12: {
        name: 'Adept Arcana (d12)',
        description: 'Adept arcana on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Slight error, execution falters', type: 'failure' },
            { roll: [2, 2], result: 'Partial control, energy fluctuates', type: 'normal' },
            { roll: [3, 4], result: 'Steady channeling achieved', type: 'success' },
            { roll: [5, 5], result: 'Clean flow, well controlled', type: 'success' },
            { roll: [6, 6], result: 'Smooth manipulation, energy responds', type: 'success' },
            { roll: [7, 8], result: 'Effortless control, harmonious flow', type: 'critical' },
            { roll: [9, 9], result: 'Perfect channeling, resonant energy', type: 'critical' },
            { roll: [10, 10], result: 'Flawless manipulation, complete attunement', type: 'critical' },
            { roll: [11, 12], result: 'Masterful precision, absolute synchronization', type: 'critical' }
        ]
    },
    arcana_adept_d20: {
        name: 'Adept Arcana (d20)',
        description: 'Adept arcana on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 2], result: 'Energy resists, minor feedback', type: 'failure' },
            { roll: [3, 3], result: 'Chaotic flow, barely contained', type: 'failure' },
            { roll: [4, 5], result: 'Unstable channeling, constant adjustments', type: 'normal' },
            { roll: [6, 6], result: 'Partial control, energy wavers', type: 'normal' },
            { roll: [7, 7], result: 'Steady flow achieved', type: 'normal' },
            { roll: [8, 9], result: 'Clean channeling, good control', type: 'success' },
            { roll: [10, 10], result: 'Smooth manipulation, energy responds', type: 'success' },
            { roll: [11, 11], result: 'Effortless control, harmonious flow', type: 'success' },
            { roll: [12, 13], result: 'Perfect channeling, resonant energy', type: 'success' },
            { roll: [14, 14], result: 'Flawless manipulation, complete attunement', type: 'critical' },
            { roll: [15, 15], result: 'Masterful precision, energy synchronizes', type: 'critical' },
            { roll: [16, 17], result: 'Absolute control, perfect harmony', type: 'critical' },
            { roll: [18, 20], result: 'Supreme mastery, energy flows like thought', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    arcana_expert_d4: {
        name: 'Expert Arcana (d4)',
        description: 'Expert arcana on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Supreme control, energy flows as extension of will', type: 'critical' },
            { roll: [3, 3], result: 'Complete harmony, resonant synchronization', type: 'critical' },
            { roll: [4, 4], result: 'Flawless precision, energy obeys before thought', type: 'critical' }
        ]
    },
    arcana_expert_d6: {
        name: 'Expert Arcana (d6)',
        description: 'Expert arcana on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Flawless control, complete synchronization', type: 'critical' },
            { roll: [3, 4], result: 'Absolute attunement, harmonious resonance', type: 'critical' },
            { roll: [5, 5], result: 'Supreme mastery, energy flows like breath', type: 'critical' },
            { roll: [6, 6], result: 'Complete unity, perfect harmony', type: 'critical' }
        ]
    },
    arcana_expert_d8: {
        name: 'Expert Arcana (d8)',
        description: 'Expert arcana on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Slight error, execution falters', type: 'failure' },
            { roll: [2, 2], result: 'Effortless manipulation, energy responds', type: 'critical' },
            { roll: [3, 4], result: 'Perfect channeling, harmonious flow', type: 'critical' },
            { roll: [5, 5], result: 'Flawless control, resonant energy', type: 'critical' },
            { roll: [6, 6], result: 'Masterful precision, complete attunement', type: 'critical' },
            { roll: [7, 7], result: 'Absolute synchronization, perfect harmony', type: 'critical' },
            { roll: [8, 8], result: 'Supreme mastery, energy flows as one', type: 'critical' }
        ]
    },
    arcana_expert_d10: {
        name: 'Expert Arcana (d10)',
        description: 'Expert arcana on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Clean flow, well managed', type: 'success' },
            { roll: [3, 4], result: 'Smooth manipulation, energy responds', type: 'success' },
            { roll: [5, 5], result: 'Effortless control, harmonious flow', type: 'critical' },
            { roll: [6, 6], result: 'Perfect channeling, resonant energy', type: 'critical' },
            { roll: [7, 7], result: 'Flawless manipulation, complete attunement', type: 'critical' },
            { roll: [8, 8], result: 'Masterful precision, energy synchronizes', type: 'critical' },
            { roll: [9, 9], result: 'Absolute control, perfect harmony', type: 'critical' },
            { roll: [10, 10], result: 'Supreme mastery, energy flows effortlessly', type: 'critical' }
        ]
    },
    arcana_expert_d12: {
        name: 'Expert Arcana (d12)',
        description: 'Expert arcana on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Steady channeling achieved', type: 'success' },
            { roll: [3, 4], result: 'Clean flow, well controlled', type: 'success' },
            { roll: [5, 5], result: 'Smooth manipulation, energy responds', type: 'success' },
            { roll: [6, 6], result: 'Effortless control, harmonious flow', type: 'critical' },
            { roll: [7, 8], result: 'Perfect channeling, resonant energy', type: 'critical' },
            { roll: [9, 9], result: 'Flawless manipulation, complete attunement', type: 'critical' },
            { roll: [10, 10], result: 'Masterful precision, energy synchronizes', type: 'critical' },
            { roll: [11, 12], result: 'Absolute control, supreme harmony', type: 'critical' }
        ]
    },
    arcana_expert_d20: {
        name: 'Expert Arcana (d20)',
        description: 'Expert arcana on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 2], result: 'Unstable flow, requires focus', type: 'normal' },
            { roll: [3, 3], result: 'Partial control, energy wavers', type: 'normal' },
            { roll: [4, 5], result: 'Steady channeling achieved', type: 'normal' },
            { roll: [6, 6], result: 'Clean flow, good control', type: 'success' },
            { roll: [7, 7], result: 'Smooth manipulation, energy responds', type: 'success' },
            { roll: [8, 9], result: 'Effortless control, harmonious flow', type: 'success' },
            { roll: [10, 10], result: 'Perfect channeling, resonant energy', type: 'success' },
            { roll: [11, 11], result: 'Flawless manipulation, complete attunement', type: 'critical' },
            { roll: [12, 13], result: 'Masterful precision, energy synchronizes', type: 'critical' },
            { roll: [14, 14], result: 'Absolute control, perfect harmony', type: 'critical' },
            { roll: [15, 15], result: 'Supreme mastery, energy flows effortlessly', type: 'critical' },
            { roll: [16, 17], result: 'Complete unity, resonant precision', type: 'critical' },
            { roll: [18, 20], result: 'Transcendent control, energy obeys without thought', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    arcana_master_d4: {
        name: 'Master Arcana (d4)',
        description: 'Master arcana on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Perfect unity, complete synchronization with arcane field', type: 'critical' },
            { roll: [3, 3], result: 'Absolute mastery, energy obeys before intention forms', type: 'critical' },
            { roll: [4, 4], result: 'Supreme harmony, flawless resonance with magical current', type: 'critical' }
        ]
    },
    arcana_master_d6: {
        name: 'Master Arcana (d6)',
        description: 'Master arcana on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Absolute attunement, energy flows effortlessly', type: 'critical' },
            { roll: [3, 4], result: 'Supreme mastery, complete synchronization', type: 'critical' },
            { roll: [5, 5], result: 'Transcendent precision, energy as extension of self', type: 'critical' },
            { roll: [6, 6], result: 'Perfect unity, resonant flow beyond technique', type: 'critical' }
        ]
    },
    arcana_master_d8: {
        name: 'Master Arcana (d8)',
        description: 'Master arcana on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Perfect channeling, harmonious energy', type: 'critical' },
            { roll: [3, 4], result: 'Flawless manipulation, complete attunement', type: 'critical' },
            { roll: [5, 5], result: 'Masterful precision, resonant synchronization', type: 'critical' },
            { roll: [6, 6], result: 'Absolute control, perfect harmony', type: 'critical' },
            { roll: [7, 7], result: 'Supreme mastery, energy flows as thought', type: 'critical' },
            { roll: [8, 8], result: 'Transcendent unity, flawless resonance', type: 'critical' }
        ]
    },
    arcana_master_d10: {
        name: 'Master Arcana (d10)',
        description: 'Master arcana on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Slight error, execution falters', type: 'failure' },
            { roll: [2, 2], result: 'Smooth manipulation, energy responds', type: 'success' },
            { roll: [3, 4], result: 'Effortless control, harmonious flow', type: 'critical' },
            { roll: [5, 5], result: 'Perfect channeling, resonant energy', type: 'critical' },
            { roll: [6, 6], result: 'Flawless manipulation, complete attunement', type: 'critical' },
            { roll: [7, 7], result: 'Masterful precision, energy synchronizes', type: 'critical' },
            { roll: [8, 8], result: 'Absolute control, perfect harmony', type: 'critical' },
            { roll: [9, 9], result: 'Supreme mastery, energy flows effortlessly', type: 'critical' },
            { roll: [10, 10], result: 'Transcendent unity, flawless resonance', type: 'critical' }
        ]
    },
    arcana_master_d12: {
        name: 'Master Arcana (d12)',
        description: 'Master arcana on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Clean flow, well managed', type: 'success' },
            { roll: [3, 4], result: 'Smooth manipulation, energy responds', type: 'success' },
            { roll: [5, 5], result: 'Effortless control, harmonious flow', type: 'critical' },
            { roll: [6, 6], result: 'Perfect channeling, resonant energy', type: 'critical' },
            { roll: [7, 8], result: 'Flawless manipulation, complete attunement', type: 'critical' },
            { roll: [9, 9], result: 'Masterful precision, energy synchronizes', type: 'critical' },
            { roll: [10, 10], result: 'Absolute control, perfect harmony', type: 'critical' },
            { roll: [11, 12], result: 'Supreme mastery, transcendent resonance', type: 'critical' }
        ]
    },
    arcana_master_d20: {
        name: 'Master Arcana (d20)',
        description: 'Master arcana on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 2], result: 'Partial control, energy fluctuates', type: 'normal' },
            { roll: [3, 3], result: 'Steady channeling achieved', type: 'success' },
            { roll: [4, 5], result: 'Clean flow, well controlled', type: 'success' },
            { roll: [6, 6], result: 'Smooth manipulation, energy responds', type: 'success' },
            { roll: [7, 7], result: 'Effortless control, harmonious flow', type: 'success' },
            { roll: [8, 9], result: 'Perfect channeling, resonant energy', type: 'critical' },
            { roll: [10, 10], result: 'Flawless manipulation, complete attunement', type: 'critical' },
            { roll: [11, 11], result: 'Masterful precision, energy synchronizes', type: 'critical' },
            { roll: [12, 13], result: 'Absolute control, perfect harmony', type: 'critical' },
            { roll: [14, 14], result: 'Supreme mastery, energy flows effortlessly', type: 'critical' },
            { roll: [15, 15], result: 'Transcendent unity, flawless resonance', type: 'critical' },
            { roll: [16, 17], result: 'Complete synchronization, energy as pure will', type: 'critical' },
            { roll: [18, 20], result: 'Perfect mastery, harmonious flow beyond mortal technique', type: 'critical' }
        ]
    }
};

