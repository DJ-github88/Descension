// Spellcraft Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total
// Combat-focused spellcasting: control, precision, and adaptation under pressure

export const SPELLCRAFT_TABLES = {
    // UNTRAINED - d4 through d20
    spellcraft_untrained_d4: {
        name: 'Untrained Spellcraft (d4)',
        description: 'Untrained spellcraft on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Spell misfires, minor arcane backlash', type: 'failure' },
            { roll: [2, 2], result: 'Spell fizzles, energy dissipates harmlessly', type: 'normal' },
            { roll: [3, 3], result: 'Spell releases with shaky control', type: 'success' },
            { roll: [4, 4], result: 'Spell lands cleanly despite inexperience', type: 'success' }
        ]
    },
    spellcraft_untrained_d6: {
        name: 'Untrained Spellcraft (d6)',
        description: 'Untrained spellcraft on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Spell explodes prematurely, 1d4 damage to self', type: 'failure' },
            { roll: [2, 2], result: 'Spell veers off target wildly', type: 'failure' },
            { roll: [3, 3], result: 'Spell weakens mid-flight, reduced effect', type: 'normal' },
            { roll: [4, 4], result: 'Spell wobbles but reaches target', type: 'normal' },
            { roll: [5, 5], result: 'Spell strikes true with unstable energy', type: 'success' },
            { roll: [6, 6], result: 'Spell connects, brief moment of clarity', type: 'success' }
        ]
    },
    spellcraft_untrained_d8: {
        name: 'Untrained Spellcraft (d8)',
        description: 'Untrained spellcraft on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Spell collapses, arcane feedback burns you for 1d6', type: 'failure' },
            { roll: [2, 2], result: 'Spell hits wrong target, ally or environment', type: 'failure' },
            { roll: [3, 3], result: 'Concentration breaks, spell dissipates', type: 'failure' },
            { roll: [4, 4], result: 'Spell rebounds toward you, must dodge', type: 'failure' },
            { roll: [5, 5], result: 'Spell barely holds together, weak impact', type: 'normal' },
            { roll: [6, 6], result: 'Spell reaches target but effect shortened', type: 'normal' },
            { roll: [7, 7], result: 'Spell lands with acceptable precision', type: 'success' },
            { roll: [8, 8], result: 'Spell strikes cleanly, lucky timing', type: 'success' }
        ]
    },
    spellcraft_untrained_d10: {
        name: 'Untrained Spellcraft (d10)',
        description: 'Untrained spellcraft on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Spell detonates in hand, 2d6 damage, lose concentration', type: 'failure' },
            { roll: [2, 2], result: 'Arcane surge overwhelms you, stunned briefly', type: 'failure' },
            { roll: [3, 3], result: 'Spell spirals out of control, random effect', type: 'failure' },
            { roll: [4, 4], result: 'Energy recoils, you take 1d6 and spell fails', type: 'failure' },
            { roll: [5, 5], result: 'Spell splits into weak fragments', type: 'failure' },
            { roll: [6, 6], result: 'Spell barely forms, minimal effect', type: 'normal' },
            { roll: [7, 7], result: 'Spell holds but drains you heavily', type: 'normal' },
            { roll: [8, 8], result: 'Spell connects with shaky trajectory', type: 'success' },
            { roll: [9, 9], result: 'Spell lands through sheer luck', type: 'success' },
            { roll: [10, 10], result: 'Instinct guides spell to target', type: 'critical' }
        ]
    },
    spellcraft_untrained_d12: {
        name: 'Untrained Spellcraft (d12)',
        description: 'Untrained spellcraft on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Catastrophic misfire, 3d6 damage, spell backfires on allies', type: 'failure' },
            { roll: [2, 2], result: 'Spell implodes, arcane burn and lose next action', type: 'failure' },
            { roll: [3, 3], result: 'Magic tears free, uncontrolled surge hits random target', type: 'failure' },
            { roll: [4, 4], result: 'Spell collapses mid-cast, energy backlash', type: 'failure' },
            { roll: [5, 5], result: 'Concentration shatters, spell fizzles violently', type: 'failure' },
            { roll: [6, 6], result: 'Spell forms but immediately destabilizes', type: 'normal' },
            { roll: [7, 7], result: 'Spell barely reaches target, greatly weakened', type: 'normal' },
            { roll: [8, 8], result: 'Spell wobbles dangerously but connects', type: 'normal' },
            { roll: [9, 9], result: 'Spell strikes with unstable energy', type: 'success' },
            { roll: [10, 10], result: 'Spell lands despite overwhelming odds', type: 'success' },
            { roll: [11, 11], result: 'Raw talent surfaces, spell succeeds', type: 'success' },
            { roll: [12, 12], result: 'Impossible focus, spell strikes perfectly', type: 'critical' }
        ]
    },
    spellcraft_untrained_d20: {
        name: 'Untrained Spellcraft (d20)',
        description: 'Untrained spellcraft on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Total magical breakdown, 4d6 damage, spell chain reaction', type: 'failure' },
            { roll: [2, 3], result: 'Spell erupts uncontrolled, damages area around you', type: 'failure' },
            { roll: [4, 5], result: 'Arcane overload, stunned and spell fails catastrophically', type: 'failure' },
            { roll: [6, 7], result: 'Magic rips through you, 2d6 damage and disoriented', type: 'failure' },
            { roll: [8, 9], result: 'Spell fragments into useless sparks', type: 'failure' },
            { roll: [10, 11], result: 'Concentration breaks under pressure', type: 'failure' },
            { roll: [12, 13], result: 'Spell barely forms, collapses immediately', type: 'failure' },
            { roll: [14, 15], result: 'Spell reaches halfway then dissipates', type: 'normal' },
            { roll: [16, 16], result: 'Spell connects weakly, minimal impact', type: 'normal' },
            { roll: [17, 17], result: 'Spell wobbles to target through chaos', type: 'normal' },
            { roll: [18, 18], result: 'Against all odds, spell strikes', type: 'success' },
            { roll: [19, 19], result: 'Raw instinct carries spell home', type: 'success' },
            { roll: [20, 20], result: 'Miraculous control, spell lands perfectly', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    spellcraft_novice_d4: {
        name: 'Novice Spellcraft (d4)',
        description: 'Novice spellcraft on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Spell wavers slightly before release', type: 'failure' },
            { roll: [2, 2], result: 'Spell flows smoothly with basic control', type: 'normal' },
            { roll: [3, 3], result: 'Spell releases with clean precision', type: 'success' },
            { roll: [4, 4], result: 'Spell strikes with confident energy', type: 'success' }
        ]
    },
    spellcraft_novice_d6: {
        name: 'Novice Spellcraft (d6)',
        description: 'Novice spellcraft on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Spell drifts off course, misses narrowly', type: 'failure' },
            { roll: [2, 2], result: 'Spell weakens as you lose focus', type: 'failure' },
            { roll: [3, 3], result: 'Spell reaches target with minor deviation', type: 'normal' },
            { roll: [4, 4], result: 'Spell flows steadily to target', type: 'normal' },
            { roll: [5, 5], result: 'Spell strikes with stable energy', type: 'success' },
            { roll: [6, 6], result: 'Spell connects with practiced ease', type: 'success' }
        ]
    },
    spellcraft_novice_d8: {
        name: 'Novice Spellcraft (d8)',
        description: 'Novice spellcraft on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Spell destabilizes, minor backlash', type: 'failure' },
            { roll: [2, 2], result: 'Concentration slips, spell veers off', type: 'failure' },
            { roll: [3, 3], result: 'Spell wobbles but you regain control', type: 'failure' },
            { roll: [4, 4], result: 'Spell reaches target with reduced power', type: 'normal' },
            { roll: [5, 5], result: 'Spell holds together under pressure', type: 'normal' },
            { roll: [6, 6], result: 'Spell strikes with acceptable precision', type: 'success' },
            { roll: [7, 7], result: 'Spell flows cleanly despite difficulty', type: 'success' },
            { roll: [8, 8], result: 'Spell lands with growing confidence', type: 'critical' }
        ]
    },
    spellcraft_novice_d10: {
        name: 'Novice Spellcraft (d10)',
        description: 'Novice spellcraft on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Spell collapses, arcane feedback stings', type: 'failure' },
            { roll: [2, 2], result: 'Spell breaks apart mid-flight', type: 'failure' },
            { roll: [3, 3], result: 'Your inexperience shows, spell fails', type: 'failure' },
            { roll: [4, 4], result: 'Spell barely holds, weak impact', type: 'failure' },
            { roll: [5, 5], result: 'Spell reaches target but effect shortened', type: 'normal' },
            { roll: [6, 6], result: 'Spell connects after struggle', type: 'normal' },
            { roll: [7, 7], result: 'Spell lands with effort', type: 'success' },
            { roll: [8, 8], result: 'Spell strikes despite complexity', type: 'success' },
            { roll: [9, 9], result: 'Spell flows with surprising control', type: 'success' },
            { roll: [10, 10], result: 'Spell lands with unexpected precision', type: 'critical' }
        ]
    },
    spellcraft_novice_d12: {
        name: 'Novice Spellcraft (d12)',
        description: 'Novice spellcraft on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Spell implodes, 1d6 arcane burn', type: 'failure' },
            { roll: [2, 2], result: 'Magic spirals out of control', type: 'failure' },
            { roll: [3, 3], result: 'Concentration breaks under strain', type: 'failure' },
            { roll: [4, 4], result: 'Spell fragments before reaching target', type: 'failure' },
            { roll: [5, 5], result: 'Spell barely forms, minimal effect', type: 'normal' },
            { roll: [6, 6], result: 'Spell wobbles dangerously but connects', type: 'normal' },
            { roll: [7, 7], result: 'Spell holds through determination', type: 'normal' },
            { roll: [8, 8], result: 'Spell reaches target with effort', type: 'success' },
            { roll: [9, 9], result: 'Spell strikes despite difficulty', type: 'success' },
            { roll: [10, 10], result: 'Spell lands with growing skill', type: 'success' },
            { roll: [11, 11], result: 'Spell flows with unexpected grace', type: 'critical' },
            { roll: [12, 12], result: 'Perfect focus, spell strikes true', type: 'critical' }
        ]
    },
    spellcraft_novice_d20: {
        name: 'Novice Spellcraft (d20)',
        description: 'Novice spellcraft on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Spell detonates, 2d6 damage and lose concentration', type: 'failure' },
            { roll: [2, 3], result: 'Arcane surge overwhelms you, spell fails', type: 'failure' },
            { roll: [4, 5], result: 'Spell tears free, uncontrolled effect', type: 'failure' },
            { roll: [6, 7], result: 'Magic collapses mid-cast, backlash', type: 'failure' },
            { roll: [8, 9], result: 'Spell dissipates before reaching target', type: 'failure' },
            { roll: [10, 11], result: 'Spell barely forms, weak and unstable', type: 'normal' },
            { roll: [12, 13], result: 'Spell wobbles through chaos', type: 'normal' },
            { roll: [14, 15], result: 'Spell reaches target but weakened', type: 'normal' },
            { roll: [16, 16], result: 'Spell connects with shaky control', type: 'success' },
            { roll: [17, 17], result: 'Spell lands through perseverance', type: 'success' },
            { roll: [18, 18], result: 'Spell strikes despite overwhelming odds', type: 'success' },
            { roll: [19, 19], result: 'Training surfaces, spell succeeds', type: 'critical' },
            { roll: [20, 20], result: 'Breakthrough moment, perfect casting', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    spellcraft_trained_d4: {
        name: 'Trained Spellcraft (d4)',
        description: 'Trained spellcraft on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Spell flows with practiced ease', type: 'normal' },
            { roll: [2, 2], result: 'Spell releases with clean control', type: 'success' },
            { roll: [3, 3], result: 'Spell strikes with confident precision', type: 'success' },
            { roll: [4, 4], result: 'Spell lands perfectly, effortless', type: 'critical' }
        ]
    },
    spellcraft_trained_d6: {
        name: 'Trained Spellcraft (d6)',
        description: 'Trained spellcraft on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Spell wavers briefly before stabilizing', type: 'failure' },
            { roll: [2, 2], result: 'Spell flows smoothly to target', type: 'normal' },
            { roll: [3, 3], result: 'Spell releases with stable energy', type: 'normal' },
            { roll: [4, 4], result: 'Spell strikes with practiced control', type: 'success' },
            { roll: [5, 5], result: 'Spell lands with clean precision', type: 'success' },
            { roll: [6, 6], result: 'Spell connects perfectly, no wasted energy', type: 'critical' }
        ]
    },
    spellcraft_trained_d8: {
        name: 'Trained Spellcraft (d8)',
        description: 'Trained spellcraft on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Spell destabilizes under pressure', type: 'failure' },
            { roll: [2, 2], result: 'Spell requires extra focus to maintain', type: 'failure' },
            { roll: [3, 3], result: 'Spell reaches target with minor deviation', type: 'normal' },
            { roll: [4, 4], result: 'Spell flows steadily despite difficulty', type: 'normal' },
            { roll: [5, 5], result: 'Spell strikes with controlled power', type: 'success' },
            { roll: [6, 6], result: 'Spell adapts smoothly to conditions', type: 'success' },
            { roll: [7, 7], result: 'Spell lands with practiced precision', type: 'success' },
            { roll: [8, 8], result: 'Spell flows with masterful control', type: 'critical' }
        ]
    },
    spellcraft_trained_d10: {
        name: 'Trained Spellcraft (d10)',
        description: 'Trained spellcraft on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Spell complexity overwhelms you', type: 'failure' },
            { roll: [2, 2], result: 'Spell breaks apart under strain', type: 'failure' },
            { roll: [3, 3], result: 'Spell barely holds together', type: 'failure' },
            { roll: [4, 4], result: 'Spell reaches target but weakened', type: 'normal' },
            { roll: [5, 5], result: 'Spell connects with effort', type: 'normal' },
            { roll: [6, 6], result: 'Spell strikes through determination', type: 'success' },
            { roll: [7, 7], result: 'Spell flows with controlled power', type: 'success' },
            { roll: [8, 8], result: 'Spell adapts to complexity smoothly', type: 'success' },
            { roll: [9, 9], result: 'Spell lands with impressive precision', type: 'success' },
            { roll: [10, 10], result: 'Spell strikes with perfect timing', type: 'critical' }
        ]
    },
    spellcraft_trained_d12: {
        name: 'Trained Spellcraft (d12)',
        description: 'Trained spellcraft on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Spell collapses under extreme pressure', type: 'failure' },
            { roll: [2, 2], result: 'Arcane flow disrupted, spell fails', type: 'failure' },
            { roll: [3, 3], result: 'Spell fragments mid-flight', type: 'failure' },
            { roll: [4, 4], result: 'Spell barely forms, minimal impact', type: 'normal' },
            { roll: [5, 5], result: 'Spell reaches target with visible strain', type: 'normal' },
            { roll: [6, 6], result: 'Spell holds through focused will', type: 'normal' },
            { roll: [7, 7], result: 'Spell strikes despite difficulty', type: 'success' },
            { roll: [8, 8], result: 'Spell flows with controlled precision', type: 'success' },
            { roll: [9, 9], result: 'Spell adapts to extreme conditions', type: 'success' },
            { roll: [10, 10], result: 'Spell lands with remarkable control', type: 'success' },
            { roll: [11, 11], result: 'Spell strikes with masterful timing', type: 'critical' },
            { roll: [12, 12], result: 'Perfect execution under pressure', type: 'critical' }
        ]
    },
    spellcraft_trained_d20: {
        name: 'Trained Spellcraft (d20)',
        description: 'Trained spellcraft on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Spell tears apart, arcane backlash', type: 'failure' },
            { roll: [2, 3], result: 'Magic spirals beyond control', type: 'failure' },
            { roll: [4, 5], result: 'Spell collapses under complexity', type: 'failure' },
            { roll: [6, 7], result: 'Concentration breaks, spell fails', type: 'failure' },
            { roll: [8, 9], result: 'Spell barely holds, greatly weakened', type: 'normal' },
            { roll: [10, 11], result: 'Spell reaches target with difficulty', type: 'normal' },
            { roll: [12, 13], result: 'Spell wobbles but connects', type: 'normal' },
            { roll: [14, 15], result: 'Spell strikes through determination', type: 'success' },
            { roll: [16, 16], result: 'Spell flows with controlled power', type: 'success' },
            { roll: [17, 17], result: 'Spell adapts to chaos smoothly', type: 'success' },
            { roll: [18, 18], result: 'Spell lands with impressive precision', type: 'success' },
            { roll: [19, 19], result: 'Masterful control under extreme pressure', type: 'critical' },
            { roll: [20, 20], result: 'Perfect casting against impossible odds', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    spellcraft_apprentice_d4: {
        name: 'Apprentice Spellcraft (d4)',
        description: 'Apprentice spellcraft on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Spell releases with effortless control', type: 'success' },
            { roll: [2, 2], result: 'Spell flows with practiced mastery', type: 'success' },
            { roll: [3, 3], result: 'Spell strikes with perfect precision', type: 'critical' },
            { roll: [4, 4], result: 'Spell lands flawlessly, no wasted energy', type: 'critical' }
        ]
    },
    spellcraft_apprentice_d6: {
        name: 'Apprentice Spellcraft (d6)',
        description: 'Apprentice spellcraft on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Spell requires brief focus adjustment', type: 'normal' },
            { roll: [2, 2], result: 'Spell flows with clean control', type: 'success' },
            { roll: [3, 3], result: 'Spell strikes with confident precision', type: 'success' },
            { roll: [4, 4], result: 'Spell adapts smoothly to conditions', type: 'success' },
            { roll: [5, 5], result: 'Spell lands with masterful timing', type: 'critical' },
            { roll: [6, 6], result: 'Perfect execution, spell enhanced', type: 'critical' }
        ]
    },
    spellcraft_apprentice_d8: {
        name: 'Apprentice Spellcraft (d8)',
        description: 'Apprentice spellcraft on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Spell wavers under unexpected pressure', type: 'failure' },
            { roll: [2, 2], result: 'Spell flows smoothly to target', type: 'normal' },
            { roll: [3, 3], result: 'Spell releases with stable energy', type: 'normal' },
            { roll: [4, 4], result: 'Spell strikes with controlled power', type: 'success' },
            { roll: [5, 5], result: 'Spell adapts to difficulty smoothly', type: 'success' },
            { roll: [6, 6], result: 'Spell lands with practiced precision', type: 'success' },
            { roll: [7, 7], result: 'Spell flows with masterful control', type: 'success' },
            { roll: [8, 8], result: 'Perfect timing, spell enhanced', type: 'critical' }
        ]
    },
    spellcraft_apprentice_d10: {
        name: 'Apprentice Spellcraft (d10)',
        description: 'Apprentice spellcraft on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Spell destabilizes under complexity', type: 'failure' },
            { roll: [2, 2], result: 'Spell requires extra concentration', type: 'failure' },
            { roll: [3, 3], result: 'Spell reaches target with effort', type: 'normal' },
            { roll: [4, 4], result: 'Spell flows steadily despite difficulty', type: 'normal' },
            { roll: [5, 5], result: 'Spell strikes with controlled precision', type: 'normal' },
            { roll: [6, 6], result: 'Spell adapts to complexity smoothly', type: 'success' },
            { roll: [7, 7], result: 'Spell lands with impressive control', type: 'success' },
            { roll: [8, 8], result: 'Spell flows with masterful timing', type: 'success' },
            { roll: [9, 9], result: 'Spell strikes with perfect precision', type: 'success' },
            { roll: [10, 10], result: 'Flawless execution, spell enhanced', type: 'critical' }
        ]
    },
    spellcraft_apprentice_d12: {
        name: 'Apprentice Spellcraft (d12)',
        description: 'Apprentice spellcraft on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Spell breaks under extreme pressure', type: 'failure' },
            { roll: [2, 2], result: 'Spell barely holds together', type: 'failure' },
            { roll: [3, 3], result: 'Spell reaches target but weakened', type: 'failure' },
            { roll: [4, 4], result: 'Spell connects with visible strain', type: 'normal' },
            { roll: [5, 5], result: 'Spell flows with focused effort', type: 'normal' },
            { roll: [6, 6], result: 'Spell strikes through determination', type: 'normal' },
            { roll: [7, 7], result: 'Spell adapts to difficulty smoothly', type: 'success' },
            { roll: [8, 8], result: 'Spell lands with controlled power', type: 'success' },
            { roll: [9, 9], result: 'Spell flows with impressive precision', type: 'success' },
            { roll: [10, 10], result: 'Spell strikes with masterful control', type: 'success' },
            { roll: [11, 11], result: 'Perfect timing under pressure', type: 'critical' },
            { roll: [12, 12], result: 'Flawless execution, spell enhanced', type: 'critical' }
        ]
    },
    spellcraft_apprentice_d20: {
        name: 'Apprentice Spellcraft (d20)',
        description: 'Apprentice spellcraft on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Spell collapses under overwhelming complexity', type: 'failure' },
            { roll: [2, 3], result: 'Arcane flow disrupted completely', type: 'failure' },
            { roll: [4, 5], result: 'Spell fragments mid-flight', type: 'failure' },
            { roll: [6, 7], result: 'Spell barely forms, minimal effect', type: 'failure' },
            { roll: [8, 9], result: 'Spell reaches target with great effort', type: 'normal' },
            { roll: [10, 11], result: 'Spell holds through focused will', type: 'normal' },
            { roll: [12, 13], result: 'Spell strikes despite difficulty', type: 'normal' },
            { roll: [14, 15], result: 'Spell flows with controlled precision', type: 'success' },
            { roll: [16, 16], result: 'Spell adapts to chaos smoothly', type: 'success' },
            { roll: [17, 17], result: 'Spell lands with impressive control', type: 'success' },
            { roll: [18, 18], result: 'Spell strikes with masterful timing', type: 'success' },
            { roll: [19, 19], result: 'Perfect execution under extreme pressure', type: 'critical' },
            { roll: [20, 20], result: 'Flawless casting, spell greatly enhanced', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    spellcraft_adept_d4: {
        name: 'Adept Spellcraft (d4)',
        description: 'Adept spellcraft on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Spell flows with absolute control', type: 'success' },
            { roll: [2, 2], result: 'Spell strikes with perfect precision', type: 'critical' },
            { roll: [3, 3], result: 'Spell lands flawlessly, enhanced effect', type: 'critical' },
            { roll: [4, 4], result: 'Masterful casting, spell greatly enhanced', type: 'critical' }
        ]
    },
    spellcraft_adept_d6: {
        name: 'Adept Spellcraft (d6)',
        description: 'Adept spellcraft on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Spell releases with practiced mastery', type: 'success' },
            { roll: [2, 2], result: 'Spell flows with effortless control', type: 'success' },
            { roll: [3, 3], result: 'Spell strikes with perfect timing', type: 'success' },
            { roll: [4, 4], result: 'Spell lands flawlessly, enhanced', type: 'critical' },
            { roll: [5, 5], result: 'Masterful execution, spell empowered', type: 'critical' },
            { roll: [6, 6], result: 'Perfect casting, spell greatly enhanced', type: 'critical' }
        ]
    },
    spellcraft_adept_d8: {
        name: 'Adept Spellcraft (d8)',
        description: 'Adept spellcraft on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Spell requires brief concentration', type: 'normal' },
            { roll: [2, 2], result: 'Spell flows with clean control', type: 'normal' },
            { roll: [3, 3], result: 'Spell strikes with practiced precision', type: 'success' },
            { roll: [4, 4], result: 'Spell adapts smoothly to conditions', type: 'success' },
            { roll: [5, 5], result: 'Spell lands with masterful control', type: 'success' },
            { roll: [6, 6], result: 'Spell flows with perfect timing', type: 'success' },
            { roll: [7, 7], result: 'Flawless execution, spell enhanced', type: 'critical' },
            { roll: [8, 8], result: 'Masterful casting, spell empowered', type: 'critical' }
        ]
    },
    spellcraft_adept_d10: {
        name: 'Adept Spellcraft (d10)',
        description: 'Adept spellcraft on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Spell wavers under pressure', type: 'failure' },
            { roll: [2, 2], result: 'Spell flows with effort', type: 'normal' },
            { roll: [3, 3], result: 'Spell reaches target steadily', type: 'normal' },
            { roll: [4, 4], result: 'Spell strikes with controlled power', type: 'normal' },
            { roll: [5, 5], result: 'Spell adapts to complexity smoothly', type: 'success' },
            { roll: [6, 6], result: 'Spell lands with impressive precision', type: 'success' },
            { roll: [7, 7], result: 'Spell flows with masterful control', type: 'success' },
            { roll: [8, 8], result: 'Spell strikes with perfect timing', type: 'success' },
            { roll: [9, 9], result: 'Flawless execution, spell enhanced', type: 'critical' },
            { roll: [10, 10], result: 'Masterful casting, spell empowered', type: 'critical' }
        ]
    },
    spellcraft_adept_d12: {
        name: 'Adept Spellcraft (d12)',
        description: 'Adept spellcraft on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Spell destabilizes under extreme pressure', type: 'failure' },
            { roll: [2, 2], result: 'Spell requires intense focus', type: 'failure' },
            { roll: [3, 3], result: 'Spell reaches target with effort', type: 'normal' },
            { roll: [4, 4], result: 'Spell flows steadily despite difficulty', type: 'normal' },
            { roll: [5, 5], result: 'Spell strikes with controlled precision', type: 'normal' },
            { roll: [6, 6], result: 'Spell adapts to difficulty smoothly', type: 'success' },
            { roll: [7, 7], result: 'Spell lands with impressive control', type: 'success' },
            { roll: [8, 8], result: 'Spell flows with masterful timing', type: 'success' },
            { roll: [9, 9], result: 'Spell strikes with perfect precision', type: 'success' },
            { roll: [10, 10], result: 'Flawless execution, spell enhanced', type: 'critical' },
            { roll: [11, 11], result: 'Masterful casting, spell empowered', type: 'critical' },
            { roll: [12, 12], result: 'Perfect control, spell greatly enhanced', type: 'critical' }
        ]
    },
    spellcraft_adept_d20: {
        name: 'Adept Spellcraft (d20)',
        description: 'Adept spellcraft on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Spell breaks under overwhelming complexity', type: 'failure' },
            { roll: [2, 3], result: 'Spell barely holds together', type: 'failure' },
            { roll: [4, 5], result: 'Spell reaches target but weakened', type: 'failure' },
            { roll: [6, 7], result: 'Spell connects with visible strain', type: 'normal' },
            { roll: [8, 9], result: 'Spell flows with focused effort', type: 'normal' },
            { roll: [10, 11], result: 'Spell strikes through determination', type: 'normal' },
            { roll: [12, 13], result: 'Spell adapts to chaos smoothly', type: 'success' },
            { roll: [14, 15], result: 'Spell lands with controlled power', type: 'success' },
            { roll: [16, 16], result: 'Spell flows with impressive precision', type: 'success' },
            { roll: [17, 17], result: 'Spell strikes with masterful control', type: 'success' },
            { roll: [18, 18], result: 'Flawless execution, spell enhanced', type: 'critical' },
            { roll: [19, 19], result: 'Masterful casting, spell empowered', type: 'critical' },
            { roll: [20, 20], result: 'Perfect control, spell greatly enhanced', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    spellcraft_expert_d4: {
        name: 'Expert Spellcraft (d4)',
        description: 'Expert spellcraft on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Spell flows with absolute mastery', type: 'critical' },
            { roll: [2, 2], result: 'Spell strikes with perfect precision, enhanced', type: 'critical' },
            { roll: [3, 3], result: 'Flawless casting, spell empowered', type: 'critical' },
            { roll: [4, 4], result: 'Masterful control, spell greatly enhanced', type: 'critical' }
        ]
    },
    spellcraft_expert_d6: {
        name: 'Expert Spellcraft (d6)',
        description: 'Expert spellcraft on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Spell releases with effortless mastery', type: 'success' },
            { roll: [2, 2], result: 'Spell flows with perfect control', type: 'critical' },
            { roll: [3, 3], result: 'Spell strikes with flawless precision', type: 'critical' },
            { roll: [4, 4], result: 'Masterful casting, spell enhanced', type: 'critical' },
            { roll: [5, 5], result: 'Perfect execution, spell empowered', type: 'critical' },
            { roll: [6, 6], result: 'Absolute control, spell greatly enhanced', type: 'critical' }
        ]
    },
    spellcraft_expert_d8: {
        name: 'Expert Spellcraft (d8)',
        description: 'Expert spellcraft on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Spell flows with practiced mastery', type: 'success' },
            { roll: [2, 2], result: 'Spell strikes with effortless control', type: 'success' },
            { roll: [3, 3], result: 'Spell lands with perfect timing', type: 'success' },
            { roll: [4, 4], result: 'Flawless execution, spell enhanced', type: 'critical' },
            { roll: [5, 5], result: 'Masterful casting, spell empowered', type: 'critical' },
            { roll: [6, 6], result: 'Perfect control, spell greatly enhanced', type: 'critical' },
            { roll: [7, 7], result: 'Absolute mastery, spell maximized', type: 'critical' },
            { roll: [8, 8], result: 'Legendary precision, spell transcendent', type: 'critical' }
        ]
    },
    spellcraft_expert_d10: {
        name: 'Expert Spellcraft (d10)',
        description: 'Expert spellcraft on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Spell requires focused concentration', type: 'normal' },
            { roll: [2, 2], result: 'Spell flows with clean control', type: 'success' },
            { roll: [3, 3], result: 'Spell strikes with practiced precision', type: 'success' },
            { roll: [4, 4], result: 'Spell adapts smoothly to complexity', type: 'success' },
            { roll: [5, 5], result: 'Spell lands with masterful control', type: 'success' },
            { roll: [6, 6], result: 'Flawless execution, spell enhanced', type: 'critical' },
            { roll: [7, 7], result: 'Masterful casting, spell empowered', type: 'critical' },
            { roll: [8, 8], result: 'Perfect control, spell greatly enhanced', type: 'critical' },
            { roll: [9, 9], result: 'Absolute mastery, spell maximized', type: 'critical' },
            { roll: [10, 10], result: 'Legendary precision, spell transcendent', type: 'critical' }
        ]
    },
    spellcraft_expert_d12: {
        name: 'Expert Spellcraft (d12)',
        description: 'Expert spellcraft on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Spell wavers under extreme pressure', type: 'normal' },
            { roll: [2, 2], result: 'Spell flows with effort', type: 'normal' },
            { roll: [3, 3], result: 'Spell strikes with controlled power', type: 'success' },
            { roll: [4, 4], result: 'Spell adapts to difficulty smoothly', type: 'success' },
            { roll: [5, 5], result: 'Spell lands with impressive precision', type: 'success' },
            { roll: [6, 6], result: 'Spell flows with masterful control', type: 'success' },
            { roll: [7, 7], result: 'Flawless execution, spell enhanced', type: 'critical' },
            { roll: [8, 8], result: 'Masterful casting, spell empowered', type: 'critical' },
            { roll: [9, 9], result: 'Perfect control, spell greatly enhanced', type: 'critical' },
            { roll: [10, 10], result: 'Absolute mastery, spell maximized', type: 'critical' },
            { roll: [11, 11], result: 'Legendary precision, spell transcendent', type: 'critical' },
            { roll: [12, 12], result: 'Ultimate control, spell perfected', type: 'critical' }
        ]
    },
    spellcraft_expert_d20: {
        name: 'Expert Spellcraft (d20)',
        description: 'Expert spellcraft on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Spell destabilizes under overwhelming complexity', type: 'failure' },
            { roll: [2, 3], result: 'Spell requires intense concentration', type: 'normal' },
            { roll: [4, 5], result: 'Spell reaches target with effort', type: 'normal' },
            { roll: [6, 7], result: 'Spell flows steadily despite chaos', type: 'success' },
            { roll: [8, 9], result: 'Spell strikes with controlled precision', type: 'success' },
            { roll: [10, 11], result: 'Spell adapts to complexity smoothly', type: 'success' },
            { roll: [12, 13], result: 'Spell lands with masterful control', type: 'success' },
            { roll: [14, 15], result: 'Flawless execution, spell enhanced', type: 'critical' },
            { roll: [16, 16], result: 'Masterful casting, spell empowered', type: 'critical' },
            { roll: [17, 17], result: 'Perfect control, spell greatly enhanced', type: 'critical' },
            { roll: [18, 18], result: 'Absolute mastery, spell maximized', type: 'critical' },
            { roll: [19, 19], result: 'Legendary precision, spell transcendent', type: 'critical' },
            { roll: [20, 20], result: 'Ultimate control, spell perfected', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    spellcraft_master_d4: {
        name: 'Master Spellcraft (d4)',
        description: 'Master spellcraft on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Spell flows with transcendent mastery', type: 'critical' },
            { roll: [2, 2], result: 'Perfect casting, spell greatly enhanced', type: 'critical' },
            { roll: [3, 3], result: 'Absolute control, spell maximized', type: 'critical' },
            { roll: [4, 4], result: 'Legendary precision, spell perfected', type: 'critical' }
        ]
    },
    spellcraft_master_d6: {
        name: 'Master Spellcraft (d6)',
        description: 'Master spellcraft on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Spell releases with absolute mastery', type: 'critical' },
            { roll: [2, 2], result: 'Flawless casting, spell enhanced', type: 'critical' },
            { roll: [3, 3], result: 'Masterful control, spell empowered', type: 'critical' },
            { roll: [4, 4], result: 'Perfect execution, spell greatly enhanced', type: 'critical' },
            { roll: [5, 5], result: 'Absolute precision, spell maximized', type: 'critical' },
            { roll: [6, 6], result: 'Legendary control, spell perfected', type: 'critical' }
        ]
    },
    spellcraft_master_d8: {
        name: 'Master Spellcraft (d8)',
        description: 'Master spellcraft on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Spell flows with effortless mastery', type: 'critical' },
            { roll: [2, 2], result: 'Spell strikes with perfect control', type: 'critical' },
            { roll: [3, 3], result: 'Flawless execution, spell enhanced', type: 'critical' },
            { roll: [4, 4], result: 'Masterful casting, spell empowered', type: 'critical' },
            { roll: [5, 5], result: 'Perfect precision, spell greatly enhanced', type: 'critical' },
            { roll: [6, 6], result: 'Absolute control, spell maximized', type: 'critical' },
            { roll: [7, 7], result: 'Legendary mastery, spell perfected', type: 'critical' },
            { roll: [8, 8], result: 'Transcendent casting, spell ascendant', type: 'critical' }
        ]
    },
    spellcraft_master_d10: {
        name: 'Master Spellcraft (d10)',
        description: 'Master spellcraft on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Spell flows with practiced mastery', type: 'success' },
            { roll: [2, 2], result: 'Spell strikes with effortless control', type: 'critical' },
            { roll: [3, 3], result: 'Spell lands with perfect timing', type: 'critical' },
            { roll: [4, 4], result: 'Flawless execution, spell enhanced', type: 'critical' },
            { roll: [5, 5], result: 'Masterful casting, spell empowered', type: 'critical' },
            { roll: [6, 6], result: 'Perfect control, spell greatly enhanced', type: 'critical' },
            { roll: [7, 7], result: 'Absolute mastery, spell maximized', type: 'critical' },
            { roll: [8, 8], result: 'Legendary precision, spell perfected', type: 'critical' },
            { roll: [9, 9], result: 'Transcendent control, spell ascendant', type: 'critical' },
            { roll: [10, 10], result: 'Ultimate mastery, spell divine', type: 'critical' }
        ]
    },
    spellcraft_master_d12: {
        name: 'Master Spellcraft (d12)',
        description: 'Master spellcraft on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Spell requires focused concentration', type: 'success' },
            { roll: [2, 2], result: 'Spell flows with clean control', type: 'success' },
            { roll: [3, 3], result: 'Spell strikes with masterful precision', type: 'critical' },
            { roll: [4, 4], result: 'Flawless execution, spell enhanced', type: 'critical' },
            { roll: [5, 5], result: 'Masterful casting, spell empowered', type: 'critical' },
            { roll: [6, 6], result: 'Perfect control, spell greatly enhanced', type: 'critical' },
            { roll: [7, 7], result: 'Absolute mastery, spell maximized', type: 'critical' },
            { roll: [8, 8], result: 'Legendary precision, spell perfected', type: 'critical' },
            { roll: [9, 9], result: 'Transcendent control, spell ascendant', type: 'critical' },
            { roll: [10, 10], result: 'Ultimate mastery, spell divine', type: 'critical' },
            { roll: [11, 11], result: 'Supreme casting, spell transcendent', type: 'critical' },
            { roll: [12, 12], result: 'Absolute perfection, spell eternal', type: 'critical' }
        ]
    },
    spellcraft_master_d20: {
        name: 'Master Spellcraft (d20)',
        description: 'Master spellcraft on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Spell wavers under overwhelming complexity', type: 'normal' },
            { roll: [2, 3], result: 'Spell flows with effort', type: 'success' },
            { roll: [4, 5], result: 'Spell strikes with controlled power', type: 'success' },
            { roll: [6, 7], result: 'Spell adapts to chaos smoothly', type: 'critical' },
            { roll: [8, 9], result: 'Spell lands with masterful control', type: 'critical' },
            { roll: [10, 11], result: 'Flawless execution, spell enhanced', type: 'critical' },
            { roll: [12, 13], result: 'Masterful casting, spell empowered', type: 'critical' },
            { roll: [14, 15], result: 'Perfect control, spell greatly enhanced', type: 'critical' },
            { roll: [16, 16], result: 'Absolute mastery, spell maximized', type: 'critical' },
            { roll: [17, 17], result: 'Legendary precision, spell perfected', type: 'critical' },
            { roll: [18, 18], result: 'Transcendent control, spell ascendant', type: 'critical' },
            { roll: [19, 19], result: 'Ultimate mastery, spell divine', type: 'critical' },
            { roll: [20, 20], result: 'Absolute perfection, spell eternal', type: 'critical' }
        ]
    }
};

