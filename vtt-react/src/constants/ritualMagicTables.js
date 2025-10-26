// Ritual Magic Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total
// Each die type has exact outcome count: d4=4, d6=6, d8=8, d10=10, d12=12, d20=13
// For d20 tables: 13 unique outcomes with ranges covering all 20 possible roll values

export const RITUAL_MAGIC_TABLES = {
    // UNTRAINED - d4 through d20
    ritualmagic_untrained_d4: {
        name: 'Untrained Ritual Magic (d4)',
        description: 'Untrained ritual magic on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Circle breaks mid-chant, energy dissipates', type: 'failure' },
            { roll: [2, 2], result: 'Ritual completes but effect is weak and brief', type: 'normal' },
            { roll: [3, 3], result: 'Ritual succeeds with minor flaws', type: 'success' },
            { roll: [4, 4], result: 'Despite inexperience, ritual holds stable', type: 'success' }
        ]
    },
    ritualmagic_untrained_d6: {
        name: 'Untrained Ritual Magic (d6)',
        description: 'Untrained ritual magic on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Sigil breaks, backlash deals 1d4 damage', type: 'failure' },
            { roll: [2, 2], result: 'You skip a step, ritual fails harmlessly', type: 'failure' },
            { roll: [3, 3], result: 'Ritual barely holds, effect lasts half duration', type: 'normal' },
            { roll: [4, 4], result: 'Ritual completes but requires extra time', type: 'normal' },
            { roll: [5, 5], result: 'Ritual succeeds as intended', type: 'success' },
            { roll: [6, 6], result: 'Lucky alignment, ritual is stable', type: 'success' }
        ]
    },
    ritualmagic_untrained_d8: {
        name: 'Untrained Ritual Magic (d8)',
        description: 'Untrained ritual magic on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Energy inverts, all participants take 1d6 damage', type: 'failure' },
            { roll: [2, 2], result: 'Circle destabilizes, components consumed for nothing', type: 'failure' },
            { roll: [3, 3], result: 'You misalign the focus, ritual collapses', type: 'failure' },
            { roll: [4, 4], result: 'Ritual stutters but does not break', type: 'failure' },
            { roll: [5, 5], result: 'Ritual succeeds but effect is unpredictable', type: 'normal' },
            { roll: [6, 6], result: 'Ritual completes with visible strain', type: 'normal' },
            { roll: [7, 7], result: 'Ritual holds, effect is reliable', type: 'success' },
            { roll: [8, 8], result: 'Ritual succeeds with surprising stability', type: 'success' }
        ]
    },
    ritualmagic_untrained_d10: {
        name: 'Untrained Ritual Magic (d10)',
        description: 'Untrained ritual magic on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Ritual summons hostile entity, 2d6 damage to all', type: 'failure' },
            { roll: [2, 2], result: 'Energy escapes violently, destroy all components', type: 'failure' },
            { roll: [3, 3], result: 'Your fear disrupts the flow, ritual fails', type: 'failure' },
            { roll: [4, 4], result: 'Ritual collapses at critical moment', type: 'failure' },
            { roll: [5, 5], result: 'Ritual barely forms, fades within minutes', type: 'failure' },
            { roll: [6, 6], result: 'Ritual succeeds but is fragile and unstable', type: 'normal' },
            { roll: [7, 7], result: 'Ritual holds but requires constant focus', type: 'normal' },
            { roll: [8, 8], result: 'Through luck, ritual achieves basic effect', type: 'success' },
            { roll: [9, 9], result: 'Ritual unexpectedly stabilizes', type: 'success' },
            { roll: [10, 10], result: 'Surprising moment of clarity guides you', type: 'critical' }
        ]
    },
    ritualmagic_untrained_d12: {
        name: 'Untrained Ritual Magic (d12)',
        description: 'Untrained ritual magic on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Ritual tears planar boundary, 3d6 damage and corruption', type: 'failure' },
            { roll: [2, 2], result: 'Energy feedback loop, lose 1 point from casting stat', type: 'failure' },
            { roll: [3, 3], result: 'You provoke spiritual backlash, cursed for 1 day', type: 'failure' },
            { roll: [4, 4], result: 'Ritual fails spectacularly, area becomes tainted', type: 'failure' },
            { roll: [5, 5], result: 'Ritual collapses, all participants exhausted', type: 'failure' },
            { roll: [6, 6], result: 'Ritual barely forms, lasts only moments', type: 'normal' },
            { roll: [7, 7], result: 'Ritual succeeds but with dangerous flaws', type: 'normal' },
            { roll: [8, 8], result: 'Ritual holds through sheer determination', type: 'normal' },
            { roll: [9, 9], result: 'Ritual achieves minimal stable effect', type: 'success' },
            { roll: [10, 10], result: 'Ritual succeeds against the odds', type: 'success' },
            { roll: [11, 11], result: 'Miraculous focus creates fragile success', type: 'success' },
            { roll: [12, 12], result: 'Impossible instinct guides perfect execution', type: 'critical' }
        ]
    },
    ritualmagic_untrained_d20: {
        name: 'Untrained Ritual Magic (d20)',
        description: 'Untrained ritual magic on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Catastrophic failure, planar rift opens, 4d6 damage to all nearby', type: 'failure' },
            { roll: [2, 3], result: 'Ritual inverts, opposite effect occurs with harmful results', type: 'failure' },
            { roll: [4, 5], result: 'Energy storm erupts, all participants lose consciousness', type: 'failure' },
            { roll: [6, 7], result: 'Ritual corrupts itself, permanent taint on location', type: 'failure' },
            { roll: [8, 9], result: 'You break all containment, wild magic spreads', type: 'failure' },
            { roll: [10, 11], result: 'Ritual fails but does not harm anyone', type: 'failure' },
            { roll: [12, 13], result: 'Ritual forms briefly then collapses', type: 'failure' },
            { roll: [14, 15], result: 'Ritual barely holds, extremely unstable', type: 'normal' },
            { roll: [16, 16], result: 'Ritual succeeds but lasts only minutes', type: 'normal' },
            { roll: [17, 17], result: 'Ritual achieves weak but stable effect', type: 'normal' },
            { roll: [18, 18], result: 'Against odds, ritual holds together', type: 'success' },
            { roll: [19, 19], result: 'Ritual succeeds through pure instinct', type: 'success' },
            { roll: [20, 20], result: 'Impossible luck creates stable ritual', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    ritualmagic_novice_d4: {
        name: 'Novice Ritual Magic (d4)',
        description: 'Novice ritual magic on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Circle wavers but holds with effort', type: 'failure' },
            { roll: [2, 2], result: 'Ritual completes smoothly', type: 'normal' },
            { roll: [3, 3], result: 'Ritual succeeds with good stability', type: 'success' },
            { roll: [4, 4], result: 'Ritual forms perfectly, lasts full duration', type: 'success' }
        ]
    },
    ritualmagic_novice_d6: {
        name: 'Novice Ritual Magic (d6)',
        description: 'Novice ritual magic on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You mistime a gesture, ritual stutters', type: 'failure' },
            { roll: [2, 2], result: 'Ritual completes but effect is weaker', type: 'failure' },
            { roll: [3, 3], result: 'Ritual succeeds after some adjustment', type: 'normal' },
            { roll: [4, 4], result: 'Ritual forms reliably', type: 'normal' },
            { roll: [5, 5], result: 'Ritual succeeds with solid execution', type: 'success' },
            { roll: [6, 6], result: 'Ritual achieves strong stable effect', type: 'success' }
        ]
    },
    ritualmagic_novice_d8: {
        name: 'Novice Ritual Magic (d8)',
        description: 'Novice ritual magic on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Energy spike disrupts the pattern, ritual fails', type: 'failure' },
            { roll: [2, 2], result: 'You lose focus, circle breaks', type: 'failure' },
            { roll: [3, 3], result: 'Ritual forms but is unstable', type: 'failure' },
            { roll: [4, 4], result: 'Ritual succeeds with minor flaws', type: 'normal' },
            { roll: [5, 5], result: 'Ritual completes after brief struggle', type: 'normal' },
            { roll: [6, 6], result: 'Ritual achieves intended effect', type: 'success' },
            { roll: [7, 7], result: 'Ritual forms with good stability', type: 'success' },
            { roll: [8, 8], result: 'Ritual succeeds with impressive control', type: 'critical' }
        ]
    },
    ritualmagic_novice_d10: {
        name: 'Novice Ritual Magic (d10)',
        description: 'Novice ritual magic on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Ritual collapses under complexity, 1d6 backlash', type: 'failure' },
            { roll: [2, 2], result: 'You cannot maintain the pattern, ritual fails', type: 'failure' },
            { roll: [3, 3], result: 'Your inexperience shows, ritual is weak', type: 'failure' },
            { roll: [4, 4], result: 'Ritual barely forms, highly unstable', type: 'failure' },
            { roll: [5, 5], result: 'Ritual succeeds but requires constant attention', type: 'normal' },
            { roll: [6, 6], result: 'Ritual holds after repeated adjustments', type: 'normal' },
            { roll: [7, 7], result: 'Ritual achieves stable effect', type: 'success' },
            { roll: [8, 8], result: 'Ritual succeeds despite difficulty', type: 'success' },
            { roll: [9, 9], result: 'Ritual forms with surprising strength', type: 'success' },
            { roll: [10, 10], result: 'Ritual achieves remarkable stability', type: 'critical' }
        ]
    },
    ritualmagic_novice_d12: {
        name: 'Novice Ritual Magic (d12)',
        description: 'Novice ritual magic on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Ritual overwhelms you, 2d6 damage and exhaustion', type: 'failure' },
            { roll: [2, 2], result: 'Energy breaks containment, ritual fails dangerously', type: 'failure' },
            { roll: [3, 3], result: 'You push too hard, lose connection', type: 'failure' },
            { roll: [4, 4], result: 'Ritual forms but immediately destabilizes', type: 'failure' },
            { roll: [5, 5], result: 'Ritual barely succeeds, very fragile', type: 'normal' },
            { roll: [6, 6], result: 'Ritual holds but shows signs of strain', type: 'normal' },
            { roll: [7, 7], result: 'Ritual struggles but maintains form', type: 'normal' },
            { roll: [8, 8], result: 'Ritual succeeds through determination', type: 'success' },
            { roll: [9, 9], result: 'Ritual achieves stable effect', type: 'success' },
            { roll: [10, 10], result: 'Ritual shows remarkable resilience', type: 'success' },
            { roll: [11, 11], result: 'Ritual defies expectations', type: 'critical' },
            { roll: [12, 12], result: 'Perfect focus creates lasting effect', type: 'critical' }
        ]
    },
    ritualmagic_novice_d20: {
        name: 'Novice Ritual Magic (d20)',
        description: 'Novice ritual magic on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Ritual tears reality, 3d6 damage and planar disturbance', type: 'failure' },
            { roll: [2, 3], result: 'Energy feedback, all participants take 2d6 damage', type: 'failure' },
            { roll: [4, 5], result: 'You misread the pattern completely, chaos ensues', type: 'failure' },
            { roll: [6, 7], result: 'Ritual collapses, area becomes magically unstable', type: 'failure' },
            { roll: [8, 9], result: 'Ritual fails to form properly', type: 'failure' },
            { roll: [10, 11], result: 'Ritual forms weakly, fades quickly', type: 'normal' },
            { roll: [12, 13], result: 'Ritual wavers between success and failure', type: 'normal' },
            { roll: [14, 15], result: 'Ritual holds but will not strengthen', type: 'normal' },
            { roll: [16, 16], result: 'Ritual achieves minimal stable effect', type: 'success' },
            { roll: [17, 17], result: 'Ritual succeeds through careful focus', type: 'success' },
            { roll: [18, 18], result: 'Ritual performs despite overwhelming complexity', type: 'success' },
            { roll: [19, 19], result: 'Perfect timing creates strong bond', type: 'critical' },
            { roll: [20, 20], result: 'Ritual achieves what seemed impossible', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    ritualmagic_trained_d4: {
        name: 'Trained Ritual Magic (d4)',
        description: 'Trained ritual magic on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Ritual forms instantly and holds', type: 'normal' },
            { roll: [2, 2], result: 'Ritual succeeds with perfect alignment', type: 'success' },
            { roll: [3, 3], result: 'Ritual achieves enhanced stability', type: 'success' },
            { roll: [4, 4], result: 'Ritual forms with exceptional power', type: 'critical' }
        ]
    },
    ritualmagic_trained_d6: {
        name: 'Trained Ritual Magic (d6)',
        description: 'Trained ritual magic on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Minor distraction causes brief flicker', type: 'failure' },
            { roll: [2, 2], result: 'Ritual completes with slight hesitation', type: 'normal' },
            { roll: [3, 3], result: 'Ritual forms smoothly', type: 'normal' },
            { roll: [4, 4], result: 'Ritual executes perfectly', type: 'success' },
            { roll: [5, 5], result: 'Ritual shows enhanced potency', type: 'success' },
            { roll: [6, 6], result: 'Ritual achieves ideal resonance', type: 'critical' }
        ]
    },
    ritualmagic_trained_d8: {
        name: 'Trained Ritual Magic (d8)',
        description: 'Trained ritual magic on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Unfamiliar pattern causes hesitation', type: 'failure' },
            { roll: [2, 2], result: 'Ritual needs extra focus to stabilize', type: 'failure' },
            { roll: [3, 3], result: 'Ritual completes after adjustment', type: 'normal' },
            { roll: [4, 4], result: 'Ritual forms with confidence', type: 'normal' },
            { roll: [5, 5], result: 'Ritual performs reliably', type: 'success' },
            { roll: [6, 6], result: 'Ritual adapts well to complexity', type: 'success' },
            { roll: [7, 7], result: 'Ritual exceeds basic requirements', type: 'success' },
            { roll: [8, 8], result: 'Ritual demonstrates deep understanding', type: 'critical' }
        ]
    },
    ritualmagic_trained_d10: {
        name: 'Trained Ritual Magic (d10)',
        description: 'Trained ritual magic on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Complexity overwhelms the pattern, ritual fails', type: 'failure' },
            { roll: [2, 2], result: 'You misread the energy flow', type: 'failure' },
            { roll: [3, 3], result: 'Ritual forms but lacks full power', type: 'failure' },
            { roll: [4, 4], result: 'Ritual succeeds partially, needs support', type: 'normal' },
            { roll: [5, 5], result: 'Ritual completes with your guidance', type: 'normal' },
            { roll: [6, 6], result: 'Ritual rises to the challenge', type: 'success' },
            { roll: [7, 7], result: 'Ritual shows adaptive strength', type: 'success' },
            { roll: [8, 8], result: 'Ritual impresses with quick formation', type: 'success' },
            { roll: [9, 9], result: 'Ritual masters new pattern immediately', type: 'success' },
            { roll: [10, 10], result: 'Ritual displays unexpected brilliance', type: 'critical' }
        ]
    },
    ritualmagic_trained_d12: {
        name: 'Trained Ritual Magic (d12)',
        description: 'Trained ritual magic on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Natural forces override the binding', type: 'failure' },
            { roll: [2, 2], result: 'Ritual becomes frustrated, collapses', type: 'failure' },
            { roll: [3, 3], result: 'Ritual struggles with resistance', type: 'failure' },
            { roll: [4, 4], result: 'Ritual attempts but lacks full strength', type: 'normal' },
            { roll: [5, 5], result: 'Ritual succeeds through determination', type: 'normal' },
            { roll: [6, 6], result: 'Ritual overcomes natural resistance', type: 'normal' },
            { roll: [7, 7], result: 'Ritual shows power beyond training', type: 'success' },
            { roll: [8, 8], result: 'Ritual proves absolutely stable', type: 'success' },
            { roll: [9, 9], result: 'Ritual performs with unwavering strength', type: 'success' },
            { roll: [10, 10], result: 'Ritual achieves remarkable feat', type: 'success' },
            { roll: [11, 11], result: 'Ritual defies natural limits', type: 'critical' },
            { roll: [12, 12], result: 'Ritual mastery conquers all doubt', type: 'critical' }
        ]
    },
    ritualmagic_trained_d20: {
        name: 'Trained Ritual Magic (d20)',
        description: 'Trained ritual magic on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Primal forces break the binding, ritual fails', type: 'failure' },
            { roll: [2, 3], result: 'Ritual cannot overcome planar resistance', type: 'failure' },
            { roll: [4, 5], result: 'Ritual tries but breaks under pressure', type: 'failure' },
            { roll: [6, 7], result: 'Ritual wavers between stability and chaos', type: 'failure' },
            { roll: [8, 9], result: 'Ritual holds position but will not advance', type: 'normal' },
            { roll: [10, 11], result: 'Ritual pushes past resistance with help', type: 'normal' },
            { roll: [12, 13], result: 'Ritual struggles but maintains control', type: 'normal' },
            { roll: [14, 15], result: 'Ritual performs despite overwhelming odds', type: 'success' },
            { roll: [16, 16], result: 'Ritual mastery conquers all resistance', type: 'success' },
            { roll: [17, 17], result: 'Ritual achieves the impossible through skill', type: 'success' },
            { roll: [18, 18], result: 'Ritual transcends normal limits', type: 'success' },
            { roll: [19, 19], result: 'Ritual becomes legendary in this moment', type: 'critical' },
            { roll: [20, 20], result: 'Ritual and caster achieve perfect unity', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    ritualmagic_apprentice_d4: {
        name: 'Apprentice Ritual Magic (d4)',
        description: 'Apprentice ritual magic on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Ritual forms before chant completes', type: 'success' },
            { roll: [2, 2], result: 'Ritual performs with perfect precision', type: 'success' },
            { roll: [3, 3], result: 'Ritual resonates with deep harmony', type: 'critical' },
            { roll: [4, 4], result: 'Ritual attunement is unmistakable', type: 'critical' }
        ]
    },
    ritualmagic_apprentice_d6: {
        name: 'Apprentice Ritual Magic (d6)',
        description: 'Apprentice ritual magic on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Momentary distraction by ambient energy', type: 'normal' },
            { roll: [2, 2], result: 'Ritual executes flawlessly', type: 'success' },
            { roll: [3, 3], result: 'Ritual adds its own elegant flourish', type: 'success' },
            { roll: [4, 4], result: 'Ritual anticipates next three steps', type: 'success' },
            { roll: [5, 5], result: 'Ritual protects from unseen interference', type: 'critical' },
            { roll: [6, 6], result: 'Ritual reveals hidden connections', type: 'critical' }
        ]
    },
    ritualmagic_apprentice_d8: {
        name: 'Apprentice Ritual Magic (d8)',
        description: 'Apprentice ritual magic on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Ritual hesitates, sensing hidden danger', type: 'failure' },
            { roll: [2, 2], result: 'Ritual performs adequately', type: 'normal' },
            { roll: [3, 3], result: 'Ritual completes efficiently', type: 'normal' },
            { roll: [4, 4], result: 'Ritual shows tactical awareness', type: 'success' },
            { roll: [5, 5], result: 'Ritual improvises to overcome obstacle', type: 'success' },
            { roll: [6, 6], result: 'Ritual coordinates with ambient forces', type: 'success' },
            { roll: [7, 7], result: 'Ritual displays unexpected depth', type: 'success' },
            { roll: [8, 8], result: 'Ritual teaches you something new', type: 'critical' }
        ]
    },
    ritualmagic_apprentice_d10: {
        name: 'Apprentice Ritual Magic (d10)',
        description: 'Apprentice ritual magic on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Ritual senses your doubt, wavers', type: 'failure' },
            { roll: [2, 2], result: 'Ritual confused by conflicting energies', type: 'failure' },
            { roll: [3, 3], result: 'Ritual needs repeated reinforcement', type: 'normal' },
            { roll: [4, 4], result: 'Ritual performs with minor errors', type: 'normal' },
            { roll: [5, 5], result: 'Ritual succeeds through perseverance', type: 'normal' },
            { roll: [6, 6], result: 'Ritual handles complexity admirably', type: 'success' },
            { roll: [7, 7], result: 'Ritual finds creative solution', type: 'success' },
            { roll: [8, 8], result: 'Ritual exceeds expectations', type: 'success' },
            { roll: [9, 9], result: 'Ritual performs with masterful precision', type: 'success' },
            { roll: [10, 10], result: 'Ritual achieves near-perfection', type: 'critical' }
        ]
    },
    ritualmagic_apprentice_d12: {
        name: 'Apprentice Ritual Magic (d12)',
        description: 'Apprentice ritual magic on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Ritual strength falters at critical moment', type: 'failure' },
            { roll: [2, 2], result: 'Ritual attempts but cannot complete', type: 'failure' },
            { roll: [3, 3], result: 'Ritual struggles against planar forces', type: 'failure' },
            { roll: [4, 4], result: 'Ritual barely succeeds, exhausted', type: 'normal' },
            { roll: [5, 5], result: 'Ritual completes with visible strain', type: 'normal' },
            { roll: [6, 6], result: 'Ritual pushes through adversity', type: 'normal' },
            { roll: [7, 7], result: 'Ritual shows remarkable resilience', type: 'success' },
            { roll: [8, 8], result: 'Ritual willpower matches your own', type: 'success' },
            { roll: [9, 9], result: 'Ritual overcomes impossible odds', type: 'success' },
            { roll: [10, 10], result: 'Ritual performs heroic binding', type: 'success' },
            { roll: [11, 11], result: 'Ritual transcends normal limits', type: 'critical' },
            { roll: [12, 12], result: 'Ritual becomes living inspiration', type: 'critical' }
        ]
    },
    ritualmagic_apprentice_d20: {
        name: 'Apprentice Ritual Magic (d20)',
        description: 'Apprentice ritual magic on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Ritual cannot overcome cosmic limits', type: 'failure' },
            { roll: [2, 3], result: 'Ritual energies prove too strong', type: 'failure' },
            { roll: [4, 5], result: 'Ritual tries valiantly but fails', type: 'failure' },
            { roll: [6, 7], result: 'Ritual makes partial progress only', type: 'failure' },
            { roll: [8, 9], result: 'Ritual achieves minimum success', type: 'normal' },
            { roll: [10, 11], result: 'Ritual succeeds through sheer will', type: 'normal' },
            { roll: [12, 13], result: 'Ritual pushes beyond known limits', type: 'normal' },
            { roll: [14, 15], result: 'Ritual transcends normal capabilities', type: 'success' },
            { roll: [16, 16], result: 'Ritual performs legendary binding', type: 'success' },
            { roll: [17, 17], result: 'Ritual defies planar law for you', type: 'success' },
            { roll: [18, 18], result: 'Ritual achieves the truly impossible', type: 'success' },
            { roll: [19, 19], result: 'Ritual becomes myth made real', type: 'critical' },
            { roll: [20, 20], result: 'Ritual and caster forge eternal bond', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    ritualmagic_adept_d4: {
        name: 'Adept Ritual Magic (d4)',
        description: 'Adept ritual magic on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Ritual responds to your mere thought', type: 'success' },
            { roll: [2, 2], result: 'Ritual moves as extension of your will', type: 'critical' },
            { roll: [3, 3], result: 'Ritual and you share single purpose', type: 'critical' },
            { roll: [4, 4], result: 'Ritual bond transcends normal limits', type: 'critical' }
        ]
    },
    ritualmagic_adept_d6: {
        name: 'Adept Ritual Magic (d6)',
        description: 'Adept ritual magic on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Ritual performs with minimal guidance', type: 'success' },
            { roll: [2, 2], result: 'Ritual executes with flawless precision', type: 'success' },
            { roll: [3, 3], result: 'Ritual improves upon your design', type: 'success' },
            { roll: [4, 4], result: 'Ritual demonstrates tactical genius', type: 'critical' },
            { roll: [5, 5], result: 'Ritual saves you from hidden threat', type: 'critical' },
            { roll: [6, 6], result: 'Ritual reveals secret knowledge', type: 'critical' }
        ]
    },
    ritualmagic_adept_d8: {
        name: 'Adept Ritual Magic (d8)',
        description: 'Adept ritual magic on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Ritual pauses to assess energies', type: 'normal' },
            { roll: [2, 2], result: 'Ritual completes smoothly', type: 'normal' },
            { roll: [3, 3], result: 'Ritual handles challenge expertly', type: 'success' },
            { roll: [4, 4], result: 'Ritual shows strategic thinking', type: 'success' },
            { roll: [5, 5], result: 'Ritual adapts brilliantly to change', type: 'success' },
            { roll: [6, 6], result: 'Ritual coordinates complex pattern', type: 'success' },
            { roll: [7, 7], result: 'Ritual demonstrates near-divine insight', type: 'critical' },
            { roll: [8, 8], result: 'Ritual achieves perfect execution', type: 'critical' }
        ]
    },
    ritualmagic_adept_d10: {
        name: 'Adept Ritual Magic (d10)',
        description: 'Adept ritual magic on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Ritual requires extra focus from you', type: 'failure' },
            { roll: [2, 2], result: 'Ritual needs reassurance to proceed', type: 'normal' },
            { roll: [3, 3], result: 'Ritual completes with effort', type: 'normal' },
            { roll: [4, 4], result: 'Ritual rises to difficult challenge', type: 'normal' },
            { roll: [5, 5], result: 'Ritual performs admirably under pressure', type: 'success' },
            { roll: [6, 6], result: 'Ritual solves complex problem', type: 'success' },
            { roll: [7, 7], result: 'Ritual shows remarkable ingenuity', type: 'success' },
            { roll: [8, 8], result: 'Ritual exceeds all expectations', type: 'success' },
            { roll: [9, 9], result: 'Ritual achieves mastery of pattern', type: 'critical' },
            { roll: [10, 10], result: 'Ritual performs with legendary skill', type: 'critical' }
        ]
    },
    ritualmagic_adept_d12: {
        name: 'Adept Ritual Magic (d12)',
        description: 'Adept ritual magic on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Ritual reaches limit of capability', type: 'failure' },
            { roll: [2, 2], result: 'Ritual struggles but perseveres', type: 'failure' },
            { roll: [3, 3], result: 'Ritual barely succeeds through will', type: 'normal' },
            { roll: [4, 4], result: 'Ritual completes with difficulty', type: 'normal' },
            { roll: [5, 5], result: 'Ritual pushes past normal limits', type: 'normal' },
            { roll: [6, 6], result: 'Ritual shows extraordinary power', type: 'success' },
            { roll: [7, 7], result: 'Ritual defies planar boundaries', type: 'success' },
            { roll: [8, 8], result: 'Ritual achieves remarkable victory', type: 'success' },
            { roll: [9, 9], result: 'Ritual transcends magical limits', type: 'success' },
            { roll: [10, 10], result: 'Ritual becomes living legend', type: 'critical' },
            { roll: [11, 11], result: 'Ritual achieves mythical feat', type: 'critical' },
            { roll: [12, 12], result: 'Ritual rewrites planar law', type: 'critical' }
        ]
    },
    ritualmagic_adept_d20: {
        name: 'Adept Ritual Magic (d20)',
        description: 'Adept ritual magic on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Ritual cannot transcend cosmic law', type: 'failure' },
            { roll: [2, 3], result: 'Ritual tries but planar forces prevent success', type: 'failure' },
            { roll: [4, 5], result: 'Ritual reaches absolute limit', type: 'failure' },
            { roll: [6, 7], result: 'Ritual achieves partial miracle', type: 'normal' },
            { roll: [8, 9], result: 'Ritual succeeds against all odds', type: 'normal' },
            { roll: [10, 11], result: 'Ritual defies planar order', type: 'normal' },
            { roll: [12, 13], result: 'Ritual transcends mortal limits', type: 'success' },
            { roll: [14, 15], result: 'Ritual achieves impossible binding', type: 'success' },
            { roll: [16, 16], result: 'Ritual becomes force of nature', type: 'success' },
            { roll: [17, 17], result: 'Ritual rewrites reality briefly', type: 'success' },
            { roll: [18, 18], result: 'Ritual and caster become one being', type: 'critical' },
            { roll: [19, 19], result: 'Ritual ascends to mythic status', type: 'critical' },
            { roll: [20, 20], result: 'Ritual achieves eternal greatness', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    ritualmagic_expert_d4: {
        name: 'Expert Ritual Magic (d4)',
        description: 'Expert ritual magic on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Ritual forms before you think the pattern', type: 'critical' },
            { roll: [2, 2], result: 'Ritual and you share consciousness', type: 'critical' },
            { roll: [3, 3], result: 'Ritual becomes perfect mirror of intent', type: 'critical' },
            { roll: [4, 4], result: 'Ritual transcends mortal understanding', type: 'critical' }
        ]
    },
    ritualmagic_expert_d6: {
        name: 'Expert Ritual Magic (d6)',
        description: 'Expert ritual magic on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Ritual performs with absolute mastery', type: 'success' },
            { roll: [2, 2], result: 'Ritual achieves flawless execution', type: 'critical' },
            { roll: [3, 3], result: 'Ritual demonstrates supernatural skill', type: 'critical' },
            { roll: [4, 4], result: 'Ritual defies planar limitations', type: 'critical' },
            { roll: [5, 5], result: 'Ritual becomes living art', type: 'critical' },
            { roll: [6, 6], result: 'Ritual achieves perfection itself', type: 'critical' }
        ]
    },
    ritualmagic_expert_d8: {
        name: 'Expert Ritual Magic (d8)',
        description: 'Expert ritual magic on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Ritual completes effortlessly', type: 'success' },
            { roll: [2, 2], result: 'Ritual handles complexity with ease', type: 'success' },
            { roll: [3, 3], result: 'Ritual shows masterful technique', type: 'success' },
            { roll: [4, 4], result: 'Ritual performs with legendary grace', type: 'critical' },
            { roll: [5, 5], result: 'Ritual achieves tactical perfection', type: 'critical' },
            { roll: [6, 6], result: 'Ritual demonstrates divine precision', type: 'critical' },
            { roll: [7, 7], result: 'Ritual transcends physical limits', type: 'critical' },
            { roll: [8, 8], result: 'Ritual becomes myth incarnate', type: 'critical' }
        ]
    },
    ritualmagic_expert_d10: {
        name: 'Expert Ritual Magic (d10)',
        description: 'Expert ritual magic on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Ritual requires brief concentration', type: 'normal' },
            { roll: [2, 2], result: 'Ritual succeeds with minor effort', type: 'success' },
            { roll: [3, 3], result: 'Ritual handles challenge expertly', type: 'success' },
            { roll: [4, 4], result: 'Ritual overcomes difficulty smoothly', type: 'success' },
            { roll: [5, 5], result: 'Ritual shows brilliant problem-solving', type: 'success' },
            { roll: [6, 6], result: 'Ritual achieves remarkable victory', type: 'critical' },
            { roll: [7, 7], result: 'Ritual performs impossible pattern', type: 'critical' },
            { roll: [8, 8], result: 'Ritual defies reality itself', type: 'critical' },
            { roll: [9, 9], result: 'Ritual becomes force beyond nature', type: 'critical' },
            { roll: [10, 10], result: 'Ritual achieves divine perfection', type: 'critical' }
        ]
    },
    ritualmagic_expert_d12: {
        name: 'Expert Ritual Magic (d12)',
        description: 'Expert ritual magic on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Ritual pushed to absolute limits', type: 'normal' },
            { roll: [2, 2], result: 'Ritual succeeds through sheer mastery', type: 'normal' },
            { roll: [3, 3], result: 'Ritual overcomes planar boundaries', type: 'success' },
            { roll: [4, 4], result: 'Ritual transcends magical limits', type: 'success' },
            { roll: [5, 5], result: 'Ritual achieves legendary feat', type: 'success' },
            { roll: [6, 6], result: 'Ritual defies cosmic law', type: 'success' },
            { roll: [7, 7], result: 'Ritual becomes living miracle', type: 'critical' },
            { roll: [8, 8], result: 'Ritual rewrites planar order', type: 'critical' },
            { roll: [9, 9], result: 'Ritual achieves mythic greatness', type: 'critical' },
            { roll: [10, 10], result: 'Ritual ascends beyond mortal realm', type: 'critical' },
            { roll: [11, 11], result: 'Ritual becomes eternal legend', type: 'critical' },
            { roll: [12, 12], result: 'Ritual achieves godlike status', type: 'critical' }
        ]
    },
    ritualmagic_expert_d20: {
        name: 'Expert Ritual Magic (d20)',
        description: 'Expert ritual magic on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Ritual faces task beyond comprehension', type: 'failure' },
            { roll: [2, 3], result: 'Ritual struggles against cosmic forces', type: 'normal' },
            { roll: [4, 5], result: 'Ritual barely succeeds through mastery', type: 'normal' },
            { roll: [6, 7], result: 'Ritual achieves near-impossible feat', type: 'success' },
            { roll: [8, 9], result: 'Ritual transcends mortal limits', type: 'success' },
            { roll: [10, 11], result: 'Ritual defies planar law', type: 'success' },
            { roll: [12, 13], result: 'Ritual rewrites reality', type: 'success' },
            { roll: [14, 15], result: 'Ritual becomes force of nature', type: 'critical' },
            { roll: [16, 16], result: 'Ritual achieves divine miracle', type: 'critical' },
            { roll: [17, 17], result: 'Ritual transcends physical existence', type: 'critical' },
            { roll: [18, 18], result: 'Ritual becomes eternal legend', type: 'critical' },
            { roll: [19, 19], result: 'Ritual ascends to mythic realm', type: 'critical' },
            { roll: [20, 20], result: 'Ritual and caster become timeless myth', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    ritualmagic_master_d4: {
        name: 'Master Ritual Magic (d4)',
        description: 'Master ritual magic on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Ritual and you exist as single entity', type: 'critical' },
            { roll: [2, 2], result: 'Ritual transcends all mortal bounds', type: 'critical' },
            { roll: [3, 3], result: 'Ritual becomes avatar of perfection', type: 'critical' },
            { roll: [4, 4], result: 'Ritual achieves absolute unity with you', type: 'critical' }
        ]
    },
    ritualmagic_master_d6: {
        name: 'Master Ritual Magic (d6)',
        description: 'Master ritual magic on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Ritual performs beyond comprehension', type: 'critical' },
            { roll: [2, 2], result: 'Ritual defies all planar law', type: 'critical' },
            { roll: [3, 3], result: 'Ritual becomes living divinity', type: 'critical' },
            { roll: [4, 4], result: 'Ritual transcends physical reality', type: 'critical' },
            { roll: [5, 5], result: 'Ritual achieves cosmic perfection', type: 'critical' },
            { roll: [6, 6], result: 'Ritual becomes eternal force', type: 'critical' }
        ]
    },
    ritualmagic_master_d8: {
        name: 'Master Ritual Magic (d8)',
        description: 'Master ritual magic on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Ritual executes with divine grace', type: 'critical' },
            { roll: [2, 2], result: 'Ritual performs impossible feat casually', type: 'critical' },
            { roll: [3, 3], result: 'Ritual rewrites planar order', type: 'critical' },
            { roll: [4, 4], result: 'Ritual transcends mortal understanding', type: 'critical' },
            { roll: [5, 5], result: 'Ritual becomes force beyond nature', type: 'critical' },
            { roll: [6, 6], result: 'Ritual achieves mythic perfection', type: 'critical' },
            { roll: [7, 7], result: 'Ritual ascends to legendary status', type: 'critical' },
            { roll: [8, 8], result: 'Ritual becomes timeless legend', type: 'critical' }
        ]
    },
    ritualmagic_master_d10: {
        name: 'Master Ritual Magic (d10)',
        description: 'Master ritual magic on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Ritual handles challenge effortlessly', type: 'success' },
            { roll: [2, 2], result: 'Ritual overcomes difficulty with ease', type: 'critical' },
            { roll: [3, 3], result: 'Ritual defies impossible odds', type: 'critical' },
            { roll: [4, 4], result: 'Ritual transcends planar limits', type: 'critical' },
            { roll: [5, 5], result: 'Ritual rewrites reality itself', type: 'critical' },
            { roll: [6, 6], result: 'Ritual becomes living miracle', type: 'critical' },
            { roll: [7, 7], result: 'Ritual achieves divine feat', type: 'critical' },
            { roll: [8, 8], result: 'Ritual ascends beyond mortal realm', type: 'critical' },
            { roll: [9, 9], result: 'Ritual becomes eternal myth', type: 'critical' },
            { roll: [10, 10], result: 'Ritual achieves cosmic greatness', type: 'critical' }
        ]
    },
    ritualmagic_master_d12: {
        name: 'Master Ritual Magic (d12)',
        description: 'Master ritual magic on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Ritual faces ultimate challenge', type: 'success' },
            { roll: [2, 2], result: 'Ritual overcomes through mastery', type: 'success' },
            { roll: [3, 3], result: 'Ritual transcends all boundaries', type: 'critical' },
            { roll: [4, 4], result: 'Ritual defies cosmic forces', type: 'critical' },
            { roll: [5, 5], result: 'Ritual rewrites planar law', type: 'critical' },
            { roll: [6, 6], result: 'Ritual becomes force of nature', type: 'critical' },
            { roll: [7, 7], result: 'Ritual achieves impossible miracle', type: 'critical' },
            { roll: [8, 8], result: 'Ritual transcends physical existence', type: 'critical' },
            { roll: [9, 9], result: 'Ritual becomes living divinity', type: 'critical' },
            { roll: [10, 10], result: 'Ritual ascends to godhood', type: 'critical' },
            { roll: [11, 11], result: 'Ritual becomes eternal legend', type: 'critical' },
            { roll: [12, 12], result: 'Ritual achieves absolute perfection', type: 'critical' }
        ]
    },
    ritualmagic_master_d20: {
        name: 'Master Ritual Magic (d20)',
        description: 'Master ritual magic on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Ritual confronts ultimate impossibility', type: 'normal' },
            { roll: [2, 3], result: 'Ritual struggles against cosmic will', type: 'success' },
            { roll: [4, 5], result: 'Ritual overcomes through divine power', type: 'success' },
            { roll: [6, 7], result: 'Ritual transcends all mortal limits', type: 'critical' },
            { roll: [8, 9], result: 'Ritual defies reality itself', type: 'critical' },
            { roll: [10, 11], result: 'Ritual rewrites cosmic order', type: 'critical' },
            { roll: [12, 13], result: 'Ritual becomes force beyond nature', type: 'critical' },
            { roll: [14, 15], result: 'Ritual achieves divine miracle', type: 'critical' },
            { roll: [16, 16], result: 'Ritual transcends physical realm', type: 'critical' },
            { roll: [17, 17], result: 'Ritual becomes living god', type: 'critical' },
            { roll: [18, 18], result: 'Ritual ascends to eternal myth', type: 'critical' },
            { roll: [19, 19], result: 'Ritual achieves cosmic perfection', type: 'critical' },
            { roll: [20, 20], result: 'Ritual and caster become one eternal force', type: 'critical' }
        ]
    }
};

