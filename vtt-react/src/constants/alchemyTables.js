// Alchemy Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total
// Each die type has exact outcome count: d4=4, d6=6, d8=8, d10=10, d12=12, d20=13
// For d20 tables: 13 unique outcomes with ranges covering all 20 possible roll values

export const ALCHEMY_TABLES = {
    // UNTRAINED - d4 through d20
    alchemy_untrained_d4: {
        name: 'Untrained Alchemy (d4)',
        description: 'Untrained alchemy on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Mixture spills, materials wasted', type: 'failure' },
            { roll: [2, 2], result: 'Weak reaction, unstable result', type: 'normal' },
            { roll: [3, 3], result: 'Basic mixture forms correctly', type: 'success' },
            { roll: [4, 4], result: 'Stable compound created', type: 'success' }
        ]
    },
    alchemy_untrained_d6: {
        name: 'Untrained Alchemy (d6)',
        description: 'Untrained alchemy on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Volatile fumes cause coughing, lose 1 turn', type: 'failure' },
            { roll: [2, 2], result: 'Wrong ratio, mixture separates', type: 'failure' },
            { roll: [3, 3], result: 'Cloudy solution, partial success', type: 'normal' },
            { roll: [4, 4], result: 'Mixture stabilizes after shaking', type: 'normal' },
            { roll: [5, 5], result: 'Clean reaction, correct result', type: 'success' },
            { roll: [6, 6], result: 'Surprisingly pure mixture', type: 'success' }
        ]
    },
    alchemy_untrained_d8: {
        name: 'Untrained Alchemy (d8)',
        description: 'Untrained alchemy on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Flask shatters, 1d4 acid damage', type: 'failure' },
            { roll: [2, 2], result: 'Toxic vapor released, nausea for 1 hour', type: 'failure' },
            { roll: [3, 3], result: 'Reagents burn, acrid smoke fills area', type: 'failure' },
            { roll: [4, 4], result: 'Incorrect temperature, mixture ruined', type: 'failure' },
            { roll: [5, 5], result: 'Weak potency, half normal effect', type: 'normal' },
            { roll: [6, 6], result: 'Unstable but functional', type: 'normal' },
            { roll: [7, 7], result: 'Correct mixture achieved', type: 'success' },
            { roll: [8, 8], result: 'Stable compound with good clarity', type: 'success' }
        ]
    },
    alchemy_untrained_d10: {
        name: 'Untrained Alchemy (d10)',
        description: 'Untrained alchemy on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Violent explosion, 2d6 fire damage to all nearby', type: 'failure' },
            { roll: [2, 2], result: 'Caustic spill burns skin, 1d6 acid damage', type: 'failure' },
            { roll: [3, 3], result: 'Fumes ignite, eyebrows singed', type: 'failure' },
            { roll: [4, 4], result: 'Complete contamination, all materials lost', type: 'failure' },
            { roll: [5, 5], result: 'False reaction misleads you', type: 'failure' },
            { roll: [6, 6], result: 'Barely stable, degrades in 1 hour', type: 'normal' },
            { roll: [7, 7], result: 'Functional but impure mixture', type: 'normal' },
            { roll: [8, 8], result: 'Correct process through trial', type: 'success' },
            { roll: [9, 9], result: 'Lucky timing creates stable result', type: 'success' },
            { roll: [10, 10], result: 'Accidental discovery of better method', type: 'critical' }
        ]
    },
    alchemy_untrained_d12: {
        name: 'Untrained Alchemy (d12)',
        description: 'Untrained alchemy on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Catastrophic reaction, 3d6 damage and equipment destroyed', type: 'failure' },
            { roll: [2, 2], result: 'Poisonous gas cloud, all nearby sickened', type: 'failure' },
            { roll: [3, 3], result: 'Runaway reaction melts container', type: 'failure' },
            { roll: [4, 4], result: 'Ingredients reject combination violently', type: 'failure' },
            { roll: [5, 5], result: 'No reaction occurs, materials inert', type: 'failure' },
            { roll: [6, 6], result: 'Extremely unstable, dangerous to handle', type: 'normal' },
            { roll: [7, 7], result: 'Weak effect, short duration', type: 'normal' },
            { roll: [8, 8], result: 'Inconsistent potency throughout', type: 'normal' },
            { roll: [9, 9], result: 'Functional despite poor technique', type: 'success' },
            { roll: [10, 10], result: 'Surprisingly effective result', type: 'success' },
            { roll: [11, 11], result: 'Beginner luck yields quality product', type: 'success' },
            { roll: [12, 12], result: 'Miraculous success reveals natural talent', type: 'critical' }
        ]
    },
    alchemy_untrained_d20: {
        name: 'Untrained Alchemy (d20)',
        description: 'Untrained alchemy on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Massive detonation, 4d6 damage, workspace destroyed', type: 'failure' },
            { roll: [2, 3], result: 'Corrosive spray melts tools and containers', type: 'failure' },
            { roll: [4, 5], result: 'Uncontrolled exothermic reaction causes burns', type: 'failure' },
            { roll: [6, 7], result: 'Toxic residue contaminates entire area', type: 'failure' },
            { roll: [8, 9], result: 'Reagents crystallize into useless mass', type: 'failure' },
            { roll: [10, 11], result: 'Unstable foam expands uncontrollably', type: 'failure' },
            { roll: [12, 13], result: 'Reaction freezes mid-process', type: 'failure' },
            { roll: [14, 15], result: 'Barely functional, unpredictable effects', type: 'normal' },
            { roll: [16, 16], result: 'Crude but working mixture', type: 'normal' },
            { roll: [17, 17], result: 'Unstable success, handle carefully', type: 'normal' },
            { roll: [18, 18], result: 'Against odds, proper compound forms', type: 'success' },
            { roll: [19, 19], result: 'Inexplicable success through intuition', type: 'success' },
            { roll: [20, 20], result: 'Impossible result, discover unique variant', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    alchemy_novice_d4: {
        name: 'Novice Alchemy (d4)',
        description: 'Novice alchemy on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Minor spill, some material lost', type: 'failure' },
            { roll: [2, 2], result: 'Standard mixture created', type: 'normal' },
            { roll: [3, 3], result: 'Clean reaction, good yield', type: 'success' },
            { roll: [4, 4], result: 'Efficient process, extra dose created', type: 'success' }
        ]
    },
    alchemy_novice_d6: {
        name: 'Novice Alchemy (d6)',
        description: 'Novice alchemy on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Timing off, weak potency', type: 'failure' },
            { roll: [2, 2], result: 'Slight cloudiness, reduced effect', type: 'failure' },
            { roll: [3, 3], result: 'Acceptable quality achieved', type: 'normal' },
            { roll: [4, 4], result: 'Proper mixture with good stability', type: 'normal' },
            { roll: [5, 5], result: 'Clear solution, full potency', type: 'success' },
            { roll: [6, 6], result: 'Enhanced clarity, improved effect', type: 'success' }
        ]
    },
    alchemy_novice_d8: {
        name: 'Novice Alchemy (d8)',
        description: 'Novice alchemy on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Bubbles over, lose half materials', type: 'failure' },
            { roll: [2, 2], result: 'Incorrect sequence, must restart', type: 'failure' },
            { roll: [3, 3], result: 'Impurities remain, reduced duration', type: 'failure' },
            { roll: [4, 4], result: 'Functional but unstable', type: 'normal' },
            { roll: [5, 5], result: 'Standard result achieved', type: 'normal' },
            { roll: [6, 6], result: 'Good reaction, reliable potency', type: 'success' },
            { roll: [7, 7], result: 'Smooth process, quality product', type: 'success' },
            { roll: [8, 8], result: 'Excellent technique, extended shelf life', type: 'critical' }
        ]
    },
    alchemy_novice_d10: {
        name: 'Novice Alchemy (d10)',
        description: 'Novice alchemy on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Reaction runs away, minor explosion', type: 'failure' },
            { roll: [2, 2], result: 'Temperature spike ruins batch', type: 'failure' },
            { roll: [3, 3], result: 'Precipitate forms incorrectly', type: 'failure' },
            { roll: [4, 4], result: 'Barely stable, short duration', type: 'failure' },
            { roll: [5, 5], result: 'Weak but functional result', type: 'normal' },
            { roll: [6, 6], result: 'Adequate mixture with care', type: 'normal' },
            { roll: [7, 7], result: 'Proper compound achieved', type: 'success' },
            { roll: [8, 8], result: 'Good stability and potency', type: 'success' },
            { roll: [9, 9], result: 'Refined technique yields quality', type: 'success' },
            { roll: [10, 10], result: 'Perfect balance, enhanced effect', type: 'critical' }
        ]
    },
    alchemy_novice_d12: {
        name: 'Novice Alchemy (d12)',
        description: 'Novice alchemy on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Dangerous fumes, take 1d6 poison damage', type: 'failure' },
            { roll: [2, 2], result: 'Reagents crystallize prematurely', type: 'failure' },
            { roll: [3, 3], result: 'Separation occurs, mixture fails', type: 'failure' },
            { roll: [4, 4], result: 'Highly unstable, risky to use', type: 'failure' },
            { roll: [5, 5], result: 'Marginal success, unpredictable', type: 'normal' },
            { roll: [6, 6], result: 'Functional with careful handling', type: 'normal' },
            { roll: [7, 7], result: 'Stable enough for use', type: 'normal' },
            { roll: [8, 8], result: 'Reliable mixture created', type: 'success' },
            { roll: [9, 9], result: 'Strong potency achieved', type: 'success' },
            { roll: [10, 10], result: 'Excellent quality despite difficulty', type: 'success' },
            { roll: [11, 11], result: 'Masterful control yields superior result', type: 'critical' },
            { roll: [12, 12], result: 'Breakthrough technique discovered', type: 'critical' }
        ]
    },
    alchemy_novice_d20: {
        name: 'Novice Alchemy (d20)',
        description: 'Novice alchemy on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Violent reaction, 2d6 damage and materials lost', type: 'failure' },
            { roll: [2, 3], result: 'Corrosive failure damages equipment', type: 'failure' },
            { roll: [4, 5], result: 'Complex reaction beyond current skill', type: 'failure' },
            { roll: [6, 7], result: 'Multiple failed attempts waste materials', type: 'failure' },
            { roll: [8, 9], result: 'Partial success, very weak effect', type: 'failure' },
            { roll: [10, 11], result: 'Barely functional, unstable compound', type: 'normal' },
            { roll: [12, 13], result: 'Crude but working mixture', type: 'normal' },
            { roll: [14, 15], result: 'Functional with limitations', type: 'normal' },
            { roll: [16, 16], result: 'Successful despite complexity', type: 'success' },
            { roll: [17, 17], result: 'Good result through persistence', type: 'success' },
            { roll: [18, 18], result: 'Strong mixture with care', type: 'success' },
            { roll: [19, 19], result: 'Exceptional control yields quality', type: 'critical' },
            { roll: [20, 20], result: 'Perfect execution, discover improved method', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    alchemy_trained_d4: {
        name: 'Trained Alchemy (d4)',
        description: 'Trained alchemy on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Small misstep, attempt fails', type: 'failure' },
            { roll: [2, 2], result: 'Efficient process, quick completion', type: 'success' },
            { roll: [3, 3], result: 'High purity achieved', type: 'success' },
            { roll: [4, 4], result: 'Perfect mixture, bonus dose created', type: 'critical' }
        ]
    },
    alchemy_trained_d6: {
        name: 'Trained Alchemy (d6)',
        description: 'Trained alchemy on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Slight distraction, minor impurity', type: 'failure' },
            { roll: [2, 2], result: 'Standard quality produced', type: 'normal' },
            { roll: [3, 3], result: 'Clean reaction, good yield', type: 'normal' },
            { roll: [4, 4], result: 'Excellent clarity and potency', type: 'success' },
            { roll: [5, 5], result: 'Superior mixture, extended duration', type: 'success' },
            { roll: [6, 6], result: 'Masterful technique, enhanced effect', type: 'critical' }
        ]
    },
    alchemy_trained_d8: {
        name: 'Trained Alchemy (d8)',
        description: 'Trained alchemy on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Unusual reagent behavior, reduced effect', type: 'failure' },
            { roll: [2, 2], result: 'Takes longer than expected', type: 'failure' },
            { roll: [3, 3], result: 'Acceptable result achieved', type: 'normal' },
            { roll: [4, 4], result: 'Reliable mixture created', type: 'normal' },
            { roll: [5, 5], result: 'Strong potency, good stability', type: 'success' },
            { roll: [6, 6], result: 'Refined product, excellent quality', type: 'success' },
            { roll: [7, 7], result: 'Superior result, increased yield', type: 'success' },
            { roll: [8, 8], result: 'Exceptional purity, double duration', type: 'critical' }
        ]
    },
    alchemy_trained_d10: {
        name: 'Trained Alchemy (d10)',
        description: 'Trained alchemy on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Complex interaction causes instability', type: 'failure' },
            { roll: [2, 2], result: 'Unexpected precipitate forms', type: 'failure' },
            { roll: [3, 3], result: 'Requires multiple attempts', type: 'failure' },
            { roll: [4, 4], result: 'Functional but imperfect', type: 'normal' },
            { roll: [5, 5], result: 'Solid result with patience', type: 'normal' },
            { roll: [6, 6], result: 'Good mixture, reliable effect', type: 'success' },
            { roll: [7, 7], result: 'Strong compound, stable reaction', type: 'success' },
            { roll: [8, 8], result: 'Excellent control, enhanced potency', type: 'success' },
            { roll: [9, 9], result: 'Superior quality, extended effect', type: 'success' },
            { roll: [10, 10], result: 'Perfect synthesis, discover refinement', type: 'critical' }
        ]
    },
    alchemy_trained_d12: {
        name: 'Trained Alchemy (d12)',
        description: 'Trained alchemy on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Volatile reaction, minor burns', type: 'failure' },
            { roll: [2, 2], result: 'Reagents resist combination', type: 'failure' },
            { roll: [3, 3], result: 'Timing proves too difficult', type: 'failure' },
            { roll: [4, 4], result: 'Barely stable, handle with care', type: 'normal' },
            { roll: [5, 5], result: 'Functional with limitations', type: 'normal' },
            { roll: [6, 6], result: 'Adequate result through skill', type: 'normal' },
            { roll: [7, 7], result: 'Reliable mixture achieved', type: 'success' },
            { roll: [8, 8], result: 'Strong effect, good duration', type: 'success' },
            { roll: [9, 9], result: 'Excellent quality despite challenge', type: 'success' },
            { roll: [10, 10], result: 'Superior compound, enhanced properties', type: 'success' },
            { roll: [11, 11], result: 'Masterful execution, potent result', type: 'critical' },
            { roll: [12, 12], result: 'Perfect control, breakthrough achieved', type: 'critical' }
        ]
    },
    alchemy_trained_d20: {
        name: 'Trained Alchemy (d20)',
        description: 'Trained alchemy on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Dangerous instability, explosion risk', type: 'failure' },
            { roll: [2, 3], result: 'Multiple cascading failures', type: 'failure' },
            { roll: [4, 5], result: 'Complexity overwhelms technique', type: 'failure' },
            { roll: [6, 7], result: 'Partial success, very weak', type: 'failure' },
            { roll: [8, 9], result: 'Barely functional compound', type: 'normal' },
            { roll: [10, 11], result: 'Unstable but usable', type: 'normal' },
            { roll: [12, 13], result: 'Adequate mixture with care', type: 'normal' },
            { roll: [14, 15], result: 'Successful through persistence', type: 'success' },
            { roll: [16, 16], result: 'Good result, reliable effect', type: 'success' },
            { roll: [17, 17], result: 'Strong mixture, stable reaction', type: 'success' },
            { roll: [18, 18], result: 'Excellent quality achieved', type: 'success' },
            { roll: [19, 19], result: 'Superior compound, enhanced effect', type: 'critical' },
            { roll: [20, 20], result: 'Perfect synthesis, new technique learned', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    alchemy_apprentice_d4: {
        name: 'Apprentice Alchemy (d4)',
        description: 'Apprentice alchemy on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Rapid synthesis, double yield', type: 'success' },
            { roll: [3, 3], result: 'Enhanced potency, extended duration', type: 'critical' },
            { roll: [4, 4], result: 'Masterwork quality, triple effect', type: 'critical' }
        ]
    },
    alchemy_apprentice_d6: {
        name: 'Apprentice Alchemy (d6)',
        description: 'Apprentice alchemy on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Excellent mixture created', type: 'success' },
            { roll: [3, 3], result: 'Superior purity achieved', type: 'success' },
            { roll: [4, 4], result: 'Enhanced effect, stable compound', type: 'success' },
            { roll: [5, 5], result: 'Potent result, increased yield', type: 'critical' },
            { roll: [6, 6], result: 'Perfect synthesis, discover variation', type: 'critical' }
        ]
    },
    alchemy_apprentice_d8: {
        name: 'Apprentice Alchemy (d8)',
        description: 'Apprentice alchemy on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Unusual conditions, slight delay', type: 'failure' },
            { roll: [2, 2], result: 'Good quality produced', type: 'normal' },
            { roll: [3, 3], result: 'Strong mixture, reliable effect', type: 'normal' },
            { roll: [4, 4], result: 'Excellent stability achieved', type: 'success' },
            { roll: [5, 5], result: 'Superior compound, enhanced potency', type: 'success' },
            { roll: [6, 6], result: 'Refined technique, double duration', type: 'success' },
            { roll: [7, 7], result: 'Exceptional purity, increased yield', type: 'success' },
            { roll: [8, 8], result: 'Masterful control, perfect result', type: 'critical' }
        ]
    },
    alchemy_apprentice_d10: {
        name: 'Apprentice Alchemy (d10)',
        description: 'Apprentice alchemy on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Complex variables cause uncertainty', type: 'failure' },
            { roll: [2, 2], result: 'Requires careful adjustment', type: 'failure' },
            { roll: [3, 3], result: 'Functional result achieved', type: 'normal' },
            { roll: [4, 4], result: 'Reliable mixture with effort', type: 'normal' },
            { roll: [5, 5], result: 'Good quality, stable reaction', type: 'normal' },
            { roll: [6, 6], result: 'Strong compound created', type: 'success' },
            { roll: [7, 7], result: 'Excellent control, enhanced effect', type: 'success' },
            { roll: [8, 8], result: 'Superior quality, extended duration', type: 'success' },
            { roll: [9, 9], result: 'Refined synthesis, potent result', type: 'success' },
            { roll: [10, 10], result: 'Perfect execution, discover improvement', type: 'critical' }
        ]
    },
    alchemy_apprentice_d12: {
        name: 'Apprentice Alchemy (d12)',
        description: 'Apprentice alchemy on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Volatile reagents resist control', type: 'failure' },
            { roll: [2, 2], result: 'Difficult balance to maintain', type: 'failure' },
            { roll: [3, 3], result: 'Challenging but manageable', type: 'failure' },
            { roll: [4, 4], result: 'Adequate result with focus', type: 'normal' },
            { roll: [5, 5], result: 'Stable mixture achieved', type: 'normal' },
            { roll: [6, 6], result: 'Good quality through skill', type: 'normal' },
            { roll: [7, 7], result: 'Strong compound, reliable effect', type: 'success' },
            { roll: [8, 8], result: 'Excellent potency, good duration', type: 'success' },
            { roll: [9, 9], result: 'Superior quality, enhanced properties', type: 'success' },
            { roll: [10, 10], result: 'Refined result, increased yield', type: 'success' },
            { roll: [11, 11], result: 'Masterful synthesis, potent effect', type: 'critical' },
            { roll: [12, 12], result: 'Perfect control, breakthrough method', type: 'critical' }
        ]
    },
    alchemy_apprentice_d20: {
        name: 'Apprentice Alchemy (d20)',
        description: 'Apprentice alchemy on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Extreme complexity causes failure', type: 'failure' },
            { roll: [2, 3], result: 'Multiple variables overwhelm process', type: 'failure' },
            { roll: [4, 5], result: 'Unstable intermediates form', type: 'failure' },
            { roll: [6, 7], result: 'Partial success, weak effect', type: 'failure' },
            { roll: [8, 9], result: 'Functional but imperfect', type: 'normal' },
            { roll: [10, 11], result: 'Adequate mixture with care', type: 'normal' },
            { roll: [12, 13], result: 'Reliable result through skill', type: 'normal' },
            { roll: [14, 15], result: 'Good quality achieved', type: 'success' },
            { roll: [16, 16], result: 'Strong compound, stable reaction', type: 'success' },
            { roll: [17, 17], result: 'Excellent control, enhanced effect', type: 'success' },
            { roll: [18, 18], result: 'Superior quality, extended duration', type: 'success' },
            { roll: [19, 19], result: 'Refined synthesis, potent result', type: 'critical' },
            { roll: [20, 20], result: 'Perfect execution, unique variant discovered', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    alchemy_adept_d4: {
        name: 'Adept Alchemy (d4)',
        description: 'Adept alchemy on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Instant synthesis, quadruple potency', type: 'critical' },
            { roll: [3, 3], result: 'Flawless purity, permanent stability', type: 'critical' },
            { roll: [4, 4], result: 'Transcendent quality, new properties emerge', type: 'critical' }
        ]
    },
    alchemy_adept_d6: {
        name: 'Adept Alchemy (d6)',
        description: 'Adept alchemy on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Superior compound, enhanced effect', type: 'success' },
            { roll: [3, 3], result: 'Refined synthesis, double duration', type: 'success' },
            { roll: [4, 4], result: 'Masterful control, triple potency', type: 'critical' },
            { roll: [5, 5], result: 'Perfect purity, increased yield', type: 'critical' },
            { roll: [6, 6], result: 'Flawless execution, discover enhancement', type: 'critical' }
        ]
    },
    alchemy_adept_d8: {
        name: 'Adept Alchemy (d8)',
        description: 'Adept alchemy on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Strong mixture created', type: 'normal' },
            { roll: [3, 3], result: 'Excellent stability achieved', type: 'success' },
            { roll: [4, 4], result: 'Superior quality, enhanced potency', type: 'success' },
            { roll: [5, 5], result: 'Refined compound, extended effect', type: 'success' },
            { roll: [6, 6], result: 'Masterful synthesis, double duration', type: 'success' },
            { roll: [7, 7], result: 'Perfect control, triple yield', type: 'critical' },
            { roll: [8, 8], result: 'Flawless execution, new variation found', type: 'critical' }
        ]
    },
    alchemy_adept_d10: {
        name: 'Adept Alchemy (d10)',
        description: 'Adept alchemy on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Complex reaction requires focus', type: 'failure' },
            { roll: [2, 2], result: 'Challenging but controlled', type: 'normal' },
            { roll: [3, 3], result: 'Good quality achieved', type: 'normal' },
            { roll: [4, 4], result: 'Strong compound created', type: 'normal' },
            { roll: [5, 5], result: 'Excellent result, stable reaction', type: 'success' },
            { roll: [6, 6], result: 'Superior quality, enhanced effect', type: 'success' },
            { roll: [7, 7], result: 'Refined synthesis, extended duration', type: 'success' },
            { roll: [8, 8], result: 'Masterful control, increased potency', type: 'success' },
            { roll: [9, 9], result: 'Perfect execution, double yield', type: 'critical' },
            { roll: [10, 10], result: 'Flawless technique, breakthrough achieved', type: 'critical' }
        ]
    },
    alchemy_adept_d12: {
        name: 'Adept Alchemy (d12)',
        description: 'Adept alchemy on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Extreme difficulty tests skill', type: 'failure' },
            { roll: [2, 2], result: 'Volatile but manageable', type: 'failure' },
            { roll: [3, 3], result: 'Adequate result with effort', type: 'normal' },
            { roll: [4, 4], result: 'Reliable mixture achieved', type: 'normal' },
            { roll: [5, 5], result: 'Good quality through mastery', type: 'normal' },
            { roll: [6, 6], result: 'Strong compound, stable effect', type: 'success' },
            { roll: [7, 7], result: 'Excellent control, enhanced potency', type: 'success' },
            { roll: [8, 8], result: 'Superior quality, extended duration', type: 'success' },
            { roll: [9, 9], result: 'Refined synthesis, increased yield', type: 'success' },
            { roll: [10, 10], result: 'Masterful execution, potent result', type: 'critical' },
            { roll: [11, 11], result: 'Perfect control, new method discovered', type: 'critical' },
            { roll: [12, 12], result: 'Flawless mastery, revolutionary technique', type: 'critical' }
        ]
    },
    alchemy_adept_d20: {
        name: 'Adept Alchemy (d20)',
        description: 'Adept alchemy on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Unprecedented complexity causes failure', type: 'failure' },
            { roll: [2, 3], result: 'Multiple cascading challenges', type: 'failure' },
            { roll: [4, 5], result: 'Extreme volatility difficult to control', type: 'failure' },
            { roll: [6, 7], result: 'Partial success, limited effect', type: 'normal' },
            { roll: [8, 9], result: 'Functional result with care', type: 'normal' },
            { roll: [10, 11], result: 'Reliable mixture through skill', type: 'normal' },
            { roll: [12, 13], result: 'Good quality achieved', type: 'success' },
            { roll: [14, 15], result: 'Strong compound, stable reaction', type: 'success' },
            { roll: [16, 16], result: 'Excellent control, enhanced effect', type: 'success' },
            { roll: [17, 17], result: 'Superior quality, extended duration', type: 'success' },
            { roll: [18, 18], result: 'Refined synthesis, increased potency', type: 'critical' },
            { roll: [19, 19], result: 'Masterful execution, perfect result', type: 'critical' },
            { roll: [20, 20], result: 'Flawless mastery, unique substance created', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    alchemy_expert_d4: {
        name: 'Expert Alchemy (d4)',
        description: 'Expert alchemy on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Transcendent purity, permanent enhancement', type: 'critical' },
            { roll: [3, 3], result: 'Flawless synthesis, new properties discovered', type: 'critical' },
            { roll: [4, 4], result: 'Absolute mastery, revolutionary compound', type: 'critical' }
        ]
    },
    alchemy_expert_d6: {
        name: 'Expert Alchemy (d6)',
        description: 'Expert alchemy on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Masterful synthesis, quadruple effect', type: 'critical' },
            { roll: [3, 3], result: 'Perfect control, quintuple duration', type: 'critical' },
            { roll: [4, 4], result: 'Flawless execution, increased yield', type: 'critical' },
            { roll: [5, 5], result: 'Transcendent purity, new variation', type: 'critical' },
            { roll: [6, 6], result: 'Absolute perfection, breakthrough achieved', type: 'critical' }
        ]
    },
    alchemy_expert_d8: {
        name: 'Expert Alchemy (d8)',
        description: 'Expert alchemy on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Superior compound, enhanced effect', type: 'success' },
            { roll: [3, 3], result: 'Refined synthesis, double duration', type: 'success' },
            { roll: [4, 4], result: 'Masterful control, triple potency', type: 'critical' },
            { roll: [5, 5], result: 'Perfect execution, quadruple yield', type: 'critical' },
            { roll: [6, 6], result: 'Flawless technique, enhanced properties', type: 'critical' },
            { roll: [7, 7], result: 'Transcendent quality, new effect discovered', type: 'critical' },
            { roll: [8, 8], result: 'Absolute mastery, revolutionary result', type: 'critical' }
        ]
    },
    alchemy_expert_d10: {
        name: 'Expert Alchemy (d10)',
        description: 'Expert alchemy on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Strong compound achieved', type: 'success' },
            { roll: [3, 3], result: 'Excellent quality, stable reaction', type: 'success' },
            { roll: [4, 4], result: 'Superior control, enhanced effect', type: 'success' },
            { roll: [5, 5], result: 'Refined synthesis, extended duration', type: 'success' },
            { roll: [6, 6], result: 'Masterful execution, increased potency', type: 'critical' },
            { roll: [7, 7], result: 'Perfect technique, double yield', type: 'critical' },
            { roll: [8, 8], result: 'Flawless control, triple effect', type: 'critical' },
            { roll: [9, 9], result: 'Transcendent quality, new properties', type: 'critical' },
            { roll: [10, 10], result: 'Absolute perfection, breakthrough method', type: 'critical' }
        ]
    },
    alchemy_expert_d12: {
        name: 'Expert Alchemy (d12)',
        description: 'Expert alchemy on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Good quality through mastery', type: 'normal' },
            { roll: [3, 3], result: 'Strong compound created', type: 'success' },
            { roll: [4, 4], result: 'Excellent result, stable effect', type: 'success' },
            { roll: [5, 5], result: 'Superior quality, enhanced potency', type: 'success' },
            { roll: [6, 6], result: 'Refined synthesis, extended duration', type: 'success' },
            { roll: [7, 7], result: 'Masterful control, increased yield', type: 'critical' },
            { roll: [8, 8], result: 'Perfect execution, double effect', type: 'critical' },
            { roll: [9, 9], result: 'Flawless technique, triple potency', type: 'critical' },
            { roll: [10, 10], result: 'Transcendent quality, new variation', type: 'critical' },
            { roll: [11, 11], result: 'Absolute mastery, revolutionary compound', type: 'critical' },
            { roll: [12, 12], result: 'Perfect synthesis, unique substance discovered', type: 'critical' }
        ]
    },
    alchemy_expert_d20: {
        name: 'Expert Alchemy (d20)',
        description: 'Expert alchemy on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Extreme complexity requires effort', type: 'failure' },
            { roll: [2, 3], result: 'Challenging variables to manage', type: 'normal' },
            { roll: [4, 5], result: 'Functional result with focus', type: 'normal' },
            { roll: [6, 7], result: 'Good quality achieved', type: 'success' },
            { roll: [8, 9], result: 'Strong compound, stable reaction', type: 'success' },
            { roll: [10, 11], result: 'Excellent control, enhanced effect', type: 'success' },
            { roll: [12, 13], result: 'Superior quality, extended duration', type: 'success' },
            { roll: [14, 15], result: 'Refined synthesis, increased potency', type: 'critical' },
            { roll: [16, 16], result: 'Masterful execution, double yield', type: 'critical' },
            { roll: [17, 17], result: 'Perfect control, triple effect', type: 'critical' },
            { roll: [18, 18], result: 'Flawless technique, new properties', type: 'critical' },
            { roll: [19, 19], result: 'Transcendent quality, breakthrough achieved', type: 'critical' },
            { roll: [20, 20], result: 'Absolute mastery, legendary compound created', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    alchemy_master_d4: {
        name: 'Master Alchemy (d4)',
        description: 'Master alchemy on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Transcendent synthesis, permanent effects', type: 'critical' },
            { roll: [3, 3], result: 'Absolute mastery, reality-altering compound', type: 'critical' },
            { roll: [4, 4], result: 'Perfect unity with elements, legendary creation', type: 'critical' }
        ]
    },
    alchemy_master_d6: {
        name: 'Master Alchemy (d6)',
        description: 'Master alchemy on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Perfect synthesis, unlimited duration', type: 'critical' },
            { roll: [3, 3], result: 'Flawless control, new substance class', type: 'critical' },
            { roll: [4, 4], result: 'Transcendent quality, revolutionary properties', type: 'critical' },
            { roll: [5, 5], result: 'Absolute perfection, mythical compound', type: 'critical' },
            { roll: [6, 6], result: 'Ultimate mastery, redefine alchemy itself', type: 'critical' }
        ]
    },
    alchemy_master_d8: {
        name: 'Master Alchemy (d8)',
        description: 'Master alchemy on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Masterful control, quadruple potency', type: 'critical' },
            { roll: [3, 3], result: 'Perfect execution, quintuple yield', type: 'critical' },
            { roll: [4, 4], result: 'Flawless technique, unlimited duration', type: 'critical' },
            { roll: [5, 5], result: 'Transcendent synthesis, new properties', type: 'critical' },
            { roll: [6, 6], result: 'Absolute mastery, revolutionary compound', type: 'critical' },
            { roll: [7, 7], result: 'Perfect unity, mythical substance', type: 'critical' },
            { roll: [8, 8], result: 'Ultimate perfection, legendary creation', type: 'critical' }
        ]
    },
    alchemy_master_d10: {
        name: 'Master Alchemy (d10)',
        description: 'Master alchemy on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Superior compound, triple effect', type: 'critical' },
            { roll: [3, 3], result: 'Refined synthesis, quadruple potency', type: 'critical' },
            { roll: [4, 4], result: 'Masterful control, quintuple yield', type: 'critical' },
            { roll: [5, 5], result: 'Perfect execution, unlimited duration', type: 'critical' },
            { roll: [6, 6], result: 'Flawless technique, new properties', type: 'critical' },
            { roll: [7, 7], result: 'Transcendent quality, revolutionary compound', type: 'critical' },
            { roll: [8, 8], result: 'Absolute mastery, mythical substance', type: 'critical' },
            { roll: [9, 9], result: 'Perfect unity, legendary creation', type: 'critical' },
            { roll: [10, 10], result: 'Ultimate perfection, redefine possibility', type: 'critical' }
        ]
    },
    alchemy_master_d12: {
        name: 'Master Alchemy (d12)',
        description: 'Master alchemy on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Excellent quality achieved', type: 'success' },
            { roll: [3, 3], result: 'Superior control, double effect', type: 'critical' },
            { roll: [4, 4], result: 'Refined synthesis, triple potency', type: 'critical' },
            { roll: [5, 5], result: 'Masterful execution, quadruple yield', type: 'critical' },
            { roll: [6, 6], result: 'Perfect technique, quintuple duration', type: 'critical' },
            { roll: [7, 7], result: 'Flawless control, new properties', type: 'critical' },
            { roll: [8, 8], result: 'Transcendent quality, revolutionary compound', type: 'critical' },
            { roll: [9, 9], result: 'Absolute mastery, mythical substance', type: 'critical' },
            { roll: [10, 10], result: 'Perfect unity, legendary creation', type: 'critical' },
            { roll: [11, 11], result: 'Ultimate perfection, reality-altering', type: 'critical' },
            { roll: [12, 12], result: 'Eternal mastery, redefine alchemy forever', type: 'critical' }
        ]
    },
    alchemy_master_d20: {
        name: 'Master Alchemy (d20)',
        description: 'Master alchemy on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 3], result: 'Good quality through mastery', type: 'success' },
            { roll: [4, 5], result: 'Strong compound, stable reaction', type: 'success' },
            { roll: [6, 7], result: 'Excellent control, enhanced effect', type: 'critical' },
            { roll: [8, 9], result: 'Superior quality, double potency', type: 'critical' },
            { roll: [10, 11], result: 'Refined synthesis, triple yield', type: 'critical' },
            { roll: [12, 13], result: 'Masterful execution, quadruple duration', type: 'critical' },
            { roll: [14, 15], result: 'Perfect technique, quintuple effect', type: 'critical' },
            { roll: [16, 16], result: 'Flawless control, new properties', type: 'critical' },
            { roll: [17, 17], result: 'Transcendent quality, revolutionary compound', type: 'critical' },
            { roll: [18, 18], result: 'Absolute mastery, mythical substance', type: 'critical' },
            { roll: [19, 19], result: 'Perfect unity, legendary creation', type: 'critical' },
            { roll: [20, 20], result: 'Ultimate perfection, eternal masterwork', type: 'critical' }
        ]
    }
};


