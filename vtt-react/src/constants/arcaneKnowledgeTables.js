// Arcane Knowledge Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total
// This skill represents study and recognition of magic, runes, enchantments, and arcane structures

export const ARCANE_KNOWLEDGE_TABLES = {
    // UNTRAINED - d4 through d20
    arcaneknowledge_untrained_d4: {
        name: 'Untrained Arcane Knowledge (d4)',
        description: 'Untrained arcane knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You mistake a simple glyph for a curse, flee in panic', type: 'failure' },
            { roll: [2, 2], result: 'You recognize magic is present but cannot identify it', type: 'normal' },
            { roll: [3, 3], result: 'You correctly identify the school of magic', type: 'success' },
            { roll: [4, 4], result: 'Lucky guess reveals the basic purpose', type: 'success' }
        ]
    },

    arcaneknowledge_untrained_d6: {
        name: 'Untrained Arcane Knowledge (d6)',
        description: 'Untrained arcane knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You confuse protective ward with trap, trigger it accidentally', type: 'failure' },
            { roll: [2, 2], result: 'You recall outdated theory, draw false conclusion', type: 'failure' },
            { roll: [3, 4], result: 'You sense magical energy but cannot interpret it', type: 'normal' },
            { roll: [5, 5], result: 'You identify the spell type correctly', type: 'success' },
            { roll: [6, 6], result: 'You recognize the magical tradition it belongs to', type: 'success' }
        ]
    },

    arcaneknowledge_untrained_d8: {
        name: 'Untrained Arcane Knowledge (d8)',
        description: 'Untrained arcane knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You misread rune sequence, activate dormant enchantment', type: 'failure' },
            { roll: [2, 2], result: 'You confuse similar symbols, believe opposite effect', type: 'failure' },
            { roll: [3, 4], result: 'You recognize some components but miss the pattern', type: 'normal' },
            { roll: [5, 5], result: 'You recall fragment of relevant lore', type: 'normal' },
            { roll: [6, 6], result: 'You identify the general magical effect', type: 'success' },
            { roll: [7, 7], result: 'You determine the approximate age and origin', type: 'success' },
            { roll: [8, 8], result: 'You notice a hidden secondary enchantment', type: 'critical' }
        ]
    },

    arcaneknowledge_untrained_d10: {
        name: 'Untrained Arcane Knowledge (d10)',
        description: 'Untrained arcane knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You mistake defensive sigil for summoning circle, expect wrong result', type: 'failure' },
            { roll: [2, 2], result: 'You apply superstition instead of knowledge, completely wrong', type: 'failure' },
            { roll: [3, 4], result: 'You sense powerful magic but cannot comprehend it', type: 'failure' },
            { roll: [5, 5], result: 'You recognize one familiar element among many', type: 'normal' },
            { roll: [6, 6], result: 'You guess the magical school correctly', type: 'normal' },
            { roll: [7, 7], result: 'You identify the primary function', type: 'success' },
            { roll: [8, 8], result: 'You recall similar magic from stories', type: 'success' },
            { roll: [9, 9], result: 'You determine it is safe or dangerous', type: 'success' },
            { roll: [10, 10], result: 'You intuit the creator intent through pattern', type: 'critical' }
        ]
    },

    arcaneknowledge_untrained_d12: {
        name: 'Untrained Arcane Knowledge (d12)',
        description: 'Untrained arcane knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You touch unknown rune, suffer minor arcane backlash', type: 'failure' },
            { roll: [2, 2], result: 'You confuse planar symbols, believe wrong dimension', type: 'failure' },
            { roll: [3, 4], result: 'You recognize ancient script but cannot translate it', type: 'failure' },
            { roll: [5, 5], result: 'You sense immense complexity, feel overwhelmed', type: 'failure' },
            { roll: [6, 6], result: 'You identify one component of the structure', type: 'normal' },
            { roll: [7, 8], result: 'You recognize the magical language used', type: 'normal' },
            { roll: [9, 9], result: 'You determine the general purpose', type: 'success' },
            { roll: [10, 10], result: 'You identify the school and tradition', type: 'success' },
            { roll: [11, 12], result: 'You notice a critical flaw in the enchantment', type: 'critical' }
        ]
    },

    arcaneknowledge_untrained_d20: {
        name: 'Untrained Arcane Knowledge (d20)',
        description: 'Untrained arcane knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You misinterpret forbidden rune, trigger ward, suffer damage', type: 'failure' },
            { roll: [3, 3], result: 'You confuse experimental magic with standard spell, dangerously wrong', type: 'failure' },
            { roll: [4, 5], result: 'You recognize power but attribute it to wrong source', type: 'failure' },
            { roll: [6, 6], result: 'You sense multiple overlapping enchantments, cannot separate them', type: 'failure' },
            { roll: [7, 7], result: 'You identify it as extremely complex magic', type: 'normal' },
            { roll: [8, 9], result: 'You recognize one familiar symbol in the pattern', type: 'normal' },
            { roll: [10, 10], result: 'You determine it is ancient and powerful', type: 'normal' },
            { roll: [11, 11], result: 'You identify the primary magical school', type: 'success' },
            { roll: [12, 13], result: 'You sense the general intent behind creation', type: 'success' },
            { roll: [14, 14], result: 'You recognize the cultural origin', type: 'success' },
            { roll: [15, 15], result: 'You identify a key component of the structure', type: 'success' },
            { roll: [16, 17], result: 'You notice an unusual modification to standard form', type: 'critical' },
            { roll: [18, 20], result: 'You intuit the core principle through pure instinct', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    arcaneknowledge_novice_d4: {
        name: 'Novice Arcane Knowledge (d4)',
        description: 'Novice arcane knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You identify the spell but miss subtle variation', type: 'normal' },
            { roll: [2, 2], result: 'You recognize the enchantment and its basic function', type: 'success' },
            { roll: [3, 3], result: 'You identify school, effect, and duration', type: 'success' },
            { roll: [4, 4], result: 'You recognize the specific caster tradition', type: 'critical' }
        ]
    },

    arcaneknowledge_novice_d6: {
        name: 'Novice Arcane Knowledge (d6)',
        description: 'Novice arcane knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You identify the spell type but not the specific variant', type: 'failure' },
            { roll: [2, 2], result: 'You recognize the school and general purpose', type: 'normal' },
            { roll: [3, 4], result: 'You identify the spell and its primary effect', type: 'success' },
            { roll: [5, 5], result: 'You determine the power level and components', type: 'success' },
            { roll: [6, 6], result: 'You recognize the signature of the caster', type: 'critical' }
        ]
    },

    arcaneknowledge_novice_d8: {
        name: 'Novice Arcane Knowledge (d8)',
        description: 'Novice arcane knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You confuse similar enchantments, identify wrong spell', type: 'failure' },
            { roll: [2, 2], result: 'You identify the school but miss the specific application', type: 'normal' },
            { roll: [3, 4], result: 'You recognize the spell and basic mechanics', type: 'normal' },
            { roll: [5, 5], result: 'You identify the full effect and duration', type: 'success' },
            { roll: [6, 6], result: 'You determine the components and casting method', type: 'success' },
            { roll: [7, 7], result: 'You recognize the magical tradition and era', type: 'success' },
            { roll: [8, 8], result: 'You notice a clever modification to standard form', type: 'critical' }
        ]
    },

    arcaneknowledge_novice_d10: {
        name: 'Novice Arcane Knowledge (d10)',
        description: 'Novice arcane knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You mistake layered enchantment for single spell', type: 'failure' },
            { roll: [2, 2], result: 'You identify primary effect but miss secondary triggers', type: 'failure' },
            { roll: [3, 4], result: 'You recognize the magical school and general structure', type: 'normal' },
            { roll: [5, 5], result: 'You identify the primary enchantment', type: 'normal' },
            { roll: [6, 6], result: 'You determine the spell effect and limitations', type: 'success' },
            { roll: [7, 7], result: 'You recognize the components and power source', type: 'success' },
            { roll: [8, 8], result: 'You identify the cultural origin and purpose', type: 'success' },
            { roll: [9, 9], result: 'You notice a secondary enchantment layer', type: 'critical' },
            { roll: [10, 10], result: 'You recognize a rare magical technique', type: 'critical' }
        ]
    },

    arcaneknowledge_novice_d12: {
        name: 'Novice Arcane Knowledge (d12)',
        description: 'Novice arcane knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You identify one layer but miss the complex interaction', type: 'failure' },
            { roll: [2, 2], result: 'You recognize the tradition but not the specific spell', type: 'failure' },
            { roll: [3, 4], result: 'You determine the primary magical school', type: 'failure' },
            { roll: [5, 5], result: 'You identify the general enchantment type', type: 'normal' },
            { roll: [6, 6], result: 'You recognize several component spells', type: 'normal' },
            { roll: [7, 8], result: 'You determine the overall purpose and function', type: 'success' },
            { roll: [9, 9], result: 'You identify the power source and binding method', type: 'success' },
            { roll: [10, 10], result: 'You recognize the creator school and era', type: 'success' },
            { roll: [11, 12], result: 'You notice how multiple enchantments interact', type: 'critical' }
        ]
    },

    arcaneknowledge_novice_d20: {
        name: 'Novice Arcane Knowledge (d20)',
        description: 'Novice arcane knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'You misidentify experimental magic, completely wrong conclusion', type: 'failure' },
            { roll: [3, 3], result: 'You recognize power but cannot determine source or purpose', type: 'failure' },
            { roll: [4, 5], result: 'You identify it as beyond your current understanding', type: 'failure' },
            { roll: [6, 6], result: 'You sense multiple schools working together', type: 'failure' },
            { roll: [7, 7], result: 'You identify the dominant magical school', type: 'normal' },
            { roll: [8, 9], result: 'You recognize some familiar patterns', type: 'normal' },
            { roll: [10, 10], result: 'You determine it is ancient and complex', type: 'normal' },
            { roll: [11, 11], result: 'You identify the primary enchantment purpose', type: 'success' },
            { roll: [12, 13], result: 'You recognize the cultural tradition', type: 'success' },
            { roll: [14, 14], result: 'You determine the approximate power level', type: 'success' },
            { roll: [15, 15], result: 'You identify key components of the structure', type: 'success' },
            { roll: [16, 17], result: 'You notice an unusual planar influence', type: 'critical' },
            { roll: [18, 20], result: 'You recognize a lost magical technique', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    arcaneknowledge_trained_d4: {
        name: 'Trained Arcane Knowledge (d4)',
        description: 'Trained arcane knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You identify everything instantly', type: 'success' },
            { roll: [2, 2], result: 'You recognize spell, components, and caster level', type: 'success' },
            { roll: [3, 3], result: 'You determine full mechanics and potential counters', type: 'critical' },
            { roll: [4, 4], result: 'You identify hidden optimization in the casting', type: 'critical' }
        ]
    },

    arcaneknowledge_trained_d6: {
        name: 'Trained Arcane Knowledge (d6)',
        description: 'Trained arcane knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You identify the spell but miss minor details', type: 'normal' },
            { roll: [2, 2], result: 'You recognize all primary characteristics', type: 'success' },
            { roll: [3, 4], result: 'You determine full effect, duration, and components', type: 'success' },
            { roll: [5, 5], result: 'You identify weaknesses and potential counters', type: 'critical' },
            { roll: [6, 6], result: 'You recognize the specific caster and their style', type: 'critical' }
        ]
    },

    arcaneknowledge_trained_d8: {
        name: 'Trained Arcane Knowledge (d8)',
        description: 'Trained arcane knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You identify most features but miss one key detail', type: 'failure' },
            { roll: [2, 2], result: 'You recognize the spell and basic mechanics', type: 'normal' },
            { roll: [3, 4], result: 'You identify full effect and all components', type: 'success' },
            { roll: [5, 5], result: 'You determine the exact casting method used', type: 'success' },
            { roll: [6, 6], result: 'You recognize the tradition and modifications', type: 'success' },
            { roll: [7, 7], result: 'You identify optimal countermeasures', type: 'critical' },
            { roll: [8, 8], result: 'You notice how to replicate the effect more efficiently', type: 'critical' }
        ]
    },

    arcaneknowledge_trained_d10: {
        name: 'Trained Arcane Knowledge (d10)',
        description: 'Trained arcane knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You identify the primary spell but miss layered effects', type: 'failure' },
            { roll: [2, 2], result: 'You recognize the school and general structure', type: 'normal' },
            { roll: [3, 4], result: 'You identify the main enchantment and purpose', type: 'normal' },
            { roll: [5, 5], result: 'You determine all spell components', type: 'success' },
            { roll: [6, 6], result: 'You recognize the power source and bindings', type: 'success' },
            { roll: [7, 7], result: 'You identify all enchantment layers', type: 'success' },
            { roll: [8, 8], result: 'You determine how layers interact', type: 'critical' },
            { roll: [9, 9], result: 'You recognize a rare combination technique', type: 'critical' },
            { roll: [10, 10], result: 'You identify the exact sequence of casting', type: 'critical' }
        ]
    },

    arcaneknowledge_trained_d12: {
        name: 'Trained Arcane Knowledge (d12)',
        description: 'Trained arcane knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You identify major components but miss critical interaction', type: 'failure' },
            { roll: [2, 2], result: 'You recognize the tradition but not the specific variant', type: 'failure' },
            { roll: [3, 4], result: 'You determine the primary magical schools involved', type: 'normal' },
            { roll: [5, 5], result: 'You identify the core enchantment structure', type: 'normal' },
            { roll: [6, 6], result: 'You recognize multiple spell layers', type: 'success' },
            { roll: [7, 8], result: 'You determine the overall purpose and mechanics', type: 'success' },
            { roll: [9, 9], result: 'You identify the power flow and anchors', type: 'success' },
            { roll: [10, 10], result: 'You recognize how to safely dismantle it', type: 'critical' },
            { roll: [11, 12], result: 'You notice an innovative binding technique', type: 'critical' }
        ]
    },

    arcaneknowledge_trained_d20: {
        name: 'Trained Arcane Knowledge (d20)',
        description: 'Trained arcane knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'You identify surface structure but miss deeper complexity', type: 'failure' },
            { roll: [3, 3], result: 'You recognize it as highly advanced magic', type: 'failure' },
            { roll: [4, 5], result: 'You determine some schools involved', type: 'failure' },
            { roll: [6, 6], result: 'You identify the dominant enchantment type', type: 'normal' },
            { roll: [7, 7], result: 'You recognize several component spells', type: 'normal' },
            { roll: [8, 9], result: 'You determine the general purpose', type: 'normal' },
            { roll: [10, 10], result: 'You identify the primary power source', type: 'success' },
            { roll: [11, 11], result: 'You recognize the cultural tradition', type: 'success' },
            { roll: [12, 13], result: 'You determine key structural elements', type: 'success' },
            { roll: [14, 14], result: 'You identify multiple enchantment layers', type: 'success' },
            { roll: [15, 15], result: 'You recognize a rare magical framework', type: 'critical' },
            { roll: [16, 17], result: 'You notice planar or extraplanar influence', type: 'critical' },
            { roll: [18, 20], result: 'You identify a lost or forbidden technique', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    arcaneknowledge_apprentice_d4: {
        name: 'Apprentice Arcane Knowledge (d4)',
        description: 'Apprentice arcane knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You comprehend everything, including subtle nuances', type: 'success' },
            { roll: [2, 2], result: 'You identify spell, caster intent, and optimal counters', type: 'critical' },
            { roll: [3, 3], result: 'You recognize how to improve the enchantment', type: 'critical' },
            { roll: [4, 4], result: 'You understand the theoretical foundation completely', type: 'critical' }
        ]
    },

    arcaneknowledge_apprentice_d6: {
        name: 'Apprentice Arcane Knowledge (d6)',
        description: 'Apprentice arcane knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You identify all features with perfect clarity', type: 'success' },
            { roll: [2, 2], result: 'You recognize spell, components, and all variations', type: 'success' },
            { roll: [3, 4], result: 'You determine full mechanics and weaknesses', type: 'critical' },
            { roll: [5, 5], result: 'You identify how to replicate and enhance it', type: 'critical' },
            { roll: [6, 6], result: 'You recognize the caster mastery level and training', type: 'critical' }
        ]
    },

    arcaneknowledge_apprentice_d8: {
        name: 'Apprentice Arcane Knowledge (d8)',
        description: 'Apprentice arcane knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You identify all major elements clearly', type: 'normal' },
            { roll: [2, 2], result: 'You recognize the full spell structure', type: 'success' },
            { roll: [3, 4], result: 'You determine all components and interactions', type: 'success' },
            { roll: [5, 5], result: 'You identify the exact casting sequence', type: 'success' },
            { roll: [6, 6], result: 'You recognize all enchantment layers and purposes', type: 'critical' },
            { roll: [7, 7], result: 'You determine optimal methods to counter or enhance', type: 'critical' },
            { roll: [8, 8], result: 'You notice a masterful technique worth studying', type: 'critical' }
        ]
    },

    arcaneknowledge_apprentice_d10: {
        name: 'Apprentice Arcane Knowledge (d10)',
        description: 'Apprentice arcane knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You identify most layers but miss one subtle element', type: 'failure' },
            { roll: [2, 2], result: 'You recognize the primary structure and purpose', type: 'normal' },
            { roll: [3, 4], result: 'You identify all major enchantment components', type: 'success' },
            { roll: [5, 5], result: 'You determine the power source and flow', type: 'success' },
            { roll: [6, 6], result: 'You recognize all spell interactions', type: 'success' },
            { roll: [7, 7], result: 'You identify the binding methods and anchors', type: 'success' },
            { roll: [8, 8], result: 'You determine the exact creation sequence', type: 'critical' },
            { roll: [9, 9], result: 'You recognize an advanced combination technique', type: 'critical' },
            { roll: [10, 10], result: 'You notice how multiple schools synergize perfectly', type: 'critical' }
        ]
    },

    arcaneknowledge_apprentice_d12: {
        name: 'Apprentice Arcane Knowledge (d12)',
        description: 'Apprentice arcane knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You identify the framework but miss deeper complexity', type: 'failure' },
            { roll: [2, 2], result: 'You recognize the tradition and general structure', type: 'normal' },
            { roll: [3, 4], result: 'You determine the primary enchantments', type: 'normal' },
            { roll: [5, 5], result: 'You identify multiple spell layers', type: 'success' },
            { roll: [6, 6], result: 'You recognize the power architecture', type: 'success' },
            { roll: [7, 8], result: 'You determine all component interactions', type: 'success' },
            { roll: [9, 9], result: 'You identify the theoretical foundation', type: 'critical' },
            { roll: [10, 10], result: 'You recognize how to safely modify it', type: 'critical' },
            { roll: [11, 12], result: 'You notice an elegant solution to complex problem', type: 'critical' }
        ]
    },

    arcaneknowledge_apprentice_d20: {
        name: 'Apprentice Arcane Knowledge (d20)',
        description: 'Apprentice arcane knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 2], result: 'You identify major structure but miss critical details', type: 'failure' },
            { roll: [3, 3], result: 'You recognize it as exceptionally complex', type: 'failure' },
            { roll: [4, 5], result: 'You determine several schools and traditions involved', type: 'normal' },
            { roll: [6, 6], result: 'You identify the primary enchantment framework', type: 'normal' },
            { roll: [7, 7], result: 'You recognize multiple component spells', type: 'normal' },
            { roll: [8, 9], result: 'You determine the overall purpose and function', type: 'success' },
            { roll: [10, 10], result: 'You identify the power sources and bindings', type: 'success' },
            { roll: [11, 11], result: 'You recognize all enchantment layers', type: 'success' },
            { roll: [12, 13], result: 'You determine how layers interact and synergize', type: 'success' },
            { roll: [14, 14], result: 'You identify the theoretical principles', type: 'critical' },
            { roll: [15, 15], result: 'You recognize a rare or lost magical framework', type: 'critical' },
            { roll: [16, 17], result: 'You notice extraplanar or divine influence', type: 'critical' },
            { roll: [18, 20], result: 'You comprehend a forbidden or experimental technique', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    arcaneknowledge_adept_d4: {
        name: 'Adept Arcane Knowledge (d4)',
        description: 'Adept arcane knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You understand everything including creator psychology', type: 'critical' },
            { roll: [2, 2], result: 'You comprehend all aspects and see improvements', type: 'critical' },
            { roll: [3, 3], result: 'You recognize the theoretical elegance and flaws', type: 'critical' },
            { roll: [4, 4], result: 'You perceive connections to broader magical theory', type: 'critical' }
        ]
    },

    arcaneknowledge_adept_d6: {
        name: 'Adept Arcane Knowledge (d6)',
        description: 'Adept arcane knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You comprehend all elements with perfect clarity', type: 'success' },
            { roll: [2, 2], result: 'You understand the complete magical architecture', type: 'critical' },
            { roll: [3, 4], result: 'You recognize all nuances and potential applications', type: 'critical' },
            { roll: [5, 5], result: 'You identify how to replicate and perfect it', type: 'critical' },
            { roll: [6, 6], result: 'You perceive the caster mastery and intent fully', type: 'critical' }
        ]
    },

    arcaneknowledge_adept_d8: {
        name: 'Adept Arcane Knowledge (d8)',
        description: 'Adept arcane knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You identify all components with complete understanding', type: 'success' },
            { roll: [2, 2], result: 'You recognize the full magical structure and theory', type: 'success' },
            { roll: [3, 4], result: 'You determine all interactions and dependencies', type: 'critical' },
            { roll: [5, 5], result: 'You identify optimal methods to enhance or counter', type: 'critical' },
            { roll: [6, 6], result: 'You recognize the deeper theoretical principles', type: 'critical' },
            { roll: [7, 7], result: 'You notice connections to other magical systems', type: 'critical' },
            { roll: [8, 8], result: 'You comprehend the innovation and its implications', type: 'critical' }
        ]
    },

    arcaneknowledge_adept_d10: {
        name: 'Adept Arcane Knowledge (d10)',
        description: 'Adept arcane knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You identify all major elements clearly', type: 'normal' },
            { roll: [2, 2], result: 'You recognize the complete structure', type: 'success' },
            { roll: [3, 4], result: 'You determine all enchantment layers and purposes', type: 'success' },
            { roll: [5, 5], result: 'You identify all power flows and bindings', type: 'success' },
            { roll: [6, 6], result: 'You recognize all spell interactions', type: 'success' },
            { roll: [7, 7], result: 'You determine the theoretical foundation', type: 'critical' },
            { roll: [8, 8], result: 'You identify advanced techniques employed', type: 'critical' },
            { roll: [9, 9], result: 'You recognize how to adapt the technique', type: 'critical' },
            { roll: [10, 10], result: 'You notice a breakthrough principle worth researching', type: 'critical' }
        ]
    },

    arcaneknowledge_adept_d12: {
        name: 'Adept Arcane Knowledge (d12)',
        description: 'Adept arcane knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You identify the primary structure and most layers', type: 'normal' },
            { roll: [2, 2], result: 'You recognize the tradition and framework', type: 'success' },
            { roll: [3, 4], result: 'You determine all major enchantments', type: 'success' },
            { roll: [5, 5], result: 'You identify the power architecture', type: 'success' },
            { roll: [6, 6], result: 'You recognize all component interactions', type: 'success' },
            { roll: [7, 8], result: 'You determine the theoretical principles', type: 'critical' },
            { roll: [9, 9], result: 'You identify how to safely modify or enhance', type: 'critical' },
            { roll: [10, 10], result: 'You recognize an innovative approach', type: 'critical' },
            { roll: [11, 12], result: 'You notice how it advances magical theory', type: 'critical' }
        ]
    },

    arcaneknowledge_adept_d20: {
        name: 'Adept Arcane Knowledge (d20)',
        description: 'Adept arcane knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 2], result: 'You identify the framework but miss subtle complexities', type: 'failure' },
            { roll: [3, 3], result: 'You recognize it as masterwork magic', type: 'normal' },
            { roll: [4, 5], result: 'You determine multiple schools and traditions', type: 'normal' },
            { roll: [6, 6], result: 'You identify the primary enchantment structure', type: 'normal' },
            { roll: [7, 7], result: 'You recognize numerous component spells', type: 'success' },
            { roll: [8, 9], result: 'You determine the overall architecture', type: 'success' },
            { roll: [10, 10], result: 'You identify all power sources and flows', type: 'success' },
            { roll: [11, 11], result: 'You recognize all enchantment layers', type: 'success' },
            { roll: [12, 13], result: 'You determine complex interactions', type: 'critical' },
            { roll: [14, 14], result: 'You identify the theoretical foundation', type: 'critical' },
            { roll: [15, 15], result: 'You recognize a rare magical framework', type: 'critical' },
            { roll: [16, 17], result: 'You notice divine or cosmic influence', type: 'critical' },
            { roll: [18, 20], result: 'You comprehend a revolutionary technique', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    arcaneknowledge_expert_d4: {
        name: 'Expert Arcane Knowledge (d4)',
        description: 'Expert arcane knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You perceive all aspects and their place in magical history', type: 'critical' },
            { roll: [2, 2], result: 'You understand the magic and its broader implications', type: 'critical' },
            { roll: [3, 3], result: 'You recognize how it relates to fundamental theory', type: 'critical' },
            { roll: [4, 4], result: 'You comprehend the magic at a transcendent level', type: 'critical' }
        ]
    },

    arcaneknowledge_expert_d6: {
        name: 'Expert Arcane Knowledge (d6)',
        description: 'Expert arcane knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You understand everything with absolute clarity', type: 'critical' },
            { roll: [2, 2], result: 'You comprehend the complete magical theory', type: 'critical' },
            { roll: [3, 4], result: 'You recognize all applications and variations', type: 'critical' },
            { roll: [5, 5], result: 'You identify how to perfect and transcend it', type: 'critical' },
            { roll: [6, 6], result: 'You perceive connections to universal magical laws', type: 'critical' }
        ]
    },

    arcaneknowledge_expert_d8: {
        name: 'Expert Arcane Knowledge (d8)',
        description: 'Expert arcane knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You comprehend all elements and their significance', type: 'success' },
            { roll: [2, 2], result: 'You understand the complete magical architecture', type: 'critical' },
            { roll: [3, 4], result: 'You recognize all theoretical foundations', type: 'critical' },
            { roll: [5, 5], result: 'You identify how to enhance or revolutionize it', type: 'critical' },
            { roll: [6, 6], result: 'You perceive the deeper magical principles', type: 'critical' },
            { roll: [7, 7], result: 'You notice connections across magical disciplines', type: 'critical' },
            { roll: [8, 8], result: 'You comprehend its place in magical evolution', type: 'critical' }
        ]
    },

    arcaneknowledge_expert_d10: {
        name: 'Expert Arcane Knowledge (d10)',
        description: 'Expert arcane knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You identify all components with deep understanding', type: 'success' },
            { roll: [2, 2], result: 'You recognize the complete structure and theory', type: 'success' },
            { roll: [3, 4], result: 'You determine all layers and interactions', type: 'critical' },
            { roll: [5, 5], result: 'You identify all power flows and principles', type: 'critical' },
            { roll: [6, 6], result: 'You recognize the theoretical foundation', type: 'critical' },
            { roll: [7, 7], result: 'You determine advanced techniques employed', type: 'critical' },
            { roll: [8, 8], result: 'You identify how to adapt and improve it', type: 'critical' },
            { roll: [9, 9], result: 'You recognize a significant magical innovation', type: 'critical' },
            { roll: [10, 10], result: 'You notice how it advances fundamental theory', type: 'critical' }
        ]
    },

    arcaneknowledge_expert_d12: {
        name: 'Expert Arcane Knowledge (d12)',
        description: 'Expert arcane knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You identify the complete structure clearly', type: 'success' },
            { roll: [2, 2], result: 'You recognize all major enchantments', type: 'success' },
            { roll: [3, 4], result: 'You determine the power architecture', type: 'critical' },
            { roll: [5, 5], result: 'You identify all component interactions', type: 'critical' },
            { roll: [6, 6], result: 'You recognize the theoretical principles', type: 'critical' },
            { roll: [7, 8], result: 'You determine how to modify or perfect it', type: 'critical' },
            { roll: [9, 9], result: 'You identify an innovative approach', type: 'critical' },
            { roll: [10, 10], result: 'You recognize how it advances the field', type: 'critical' },
            { roll: [11, 12], result: 'You notice a breakthrough in magical understanding', type: 'critical' }
        ]
    },

    arcaneknowledge_expert_d20: {
        name: 'Expert Arcane Knowledge (d20)',
        description: 'Expert arcane knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 2], result: 'You identify most elements but miss one subtle layer', type: 'normal' },
            { roll: [3, 3], result: 'You recognize it as legendary magic', type: 'success' },
            { roll: [4, 5], result: 'You determine the primary structure', type: 'success' },
            { roll: [6, 6], result: 'You identify multiple schools and traditions', type: 'success' },
            { roll: [7, 7], result: 'You recognize the enchantment framework', type: 'success' },
            { roll: [8, 9], result: 'You determine the overall architecture', type: 'critical' },
            { roll: [10, 10], result: 'You identify all power sources', type: 'critical' },
            { roll: [11, 11], result: 'You recognize all enchantment layers', type: 'critical' },
            { roll: [12, 13], result: 'You determine complex interactions', type: 'critical' },
            { roll: [14, 14], result: 'You identify the theoretical foundation', type: 'critical' },
            { roll: [15, 15], result: 'You recognize a masterwork framework', type: 'critical' },
            { roll: [16, 17], result: 'You notice cosmic or primordial influence', type: 'critical' },
            { roll: [18, 20], result: 'You comprehend a paradigm-shifting technique', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    arcaneknowledge_master_d4: {
        name: 'Master Arcane Knowledge (d4)',
        description: 'Master arcane knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You perceive the magic and its echo across reality', type: 'critical' },
            { roll: [2, 2], result: 'You understand it as part of the cosmic tapestry', type: 'critical' },
            { roll: [3, 3], result: 'You recognize its connection to fundamental forces', type: 'critical' },
            { roll: [4, 4], result: 'You comprehend the magic at an absolute level', type: 'critical' }
        ]
    },

    arcaneknowledge_master_d6: {
        name: 'Master Arcane Knowledge (d6)',
        description: 'Master arcane knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You understand everything with transcendent clarity', type: 'critical' },
            { roll: [2, 2], result: 'You comprehend the magic and its universal implications', type: 'critical' },
            { roll: [3, 4], result: 'You recognize all connections to fundamental laws', type: 'critical' },
            { roll: [5, 5], result: 'You identify how to transcend its limitations', type: 'critical' },
            { roll: [6, 6], result: 'You perceive the magic as expression of cosmic truth', type: 'critical' }
        ]
    },

    arcaneknowledge_master_d8: {
        name: 'Master Arcane Knowledge (d8)',
        description: 'Master arcane knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You comprehend all aspects with perfect understanding', type: 'critical' },
            { roll: [2, 2], result: 'You understand the complete magical theory', type: 'critical' },
            { roll: [3, 4], result: 'You recognize all theoretical foundations', type: 'critical' },
            { roll: [5, 5], result: 'You identify how to revolutionize it', type: 'critical' },
            { roll: [6, 6], result: 'You perceive the deepest magical principles', type: 'critical' },
            { roll: [7, 7], result: 'You notice connections to universal forces', type: 'critical' },
            { roll: [8, 8], result: 'You comprehend its role in magical reality', type: 'critical' }
        ]
    },

    arcaneknowledge_master_d10: {
        name: 'Master Arcane Knowledge (d10)',
        description: 'Master arcane knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You identify all elements with absolute clarity', type: 'critical' },
            { roll: [2, 2], result: 'You recognize the complete structure and theory', type: 'critical' },
            { roll: [3, 4], result: 'You determine all layers and principles', type: 'critical' },
            { roll: [5, 5], result: 'You identify all power flows and foundations', type: 'critical' },
            { roll: [6, 6], result: 'You recognize the theoretical framework', type: 'critical' },
            { roll: [7, 7], result: 'You determine all advanced techniques', type: 'critical' },
            { roll: [8, 8], result: 'You identify how to perfect and transcend it', type: 'critical' },
            { roll: [9, 9], result: 'You recognize a revolutionary innovation', type: 'critical' },
            { roll: [10, 10], result: 'You notice how it reshapes magical understanding', type: 'critical' }
        ]
    },

    arcaneknowledge_master_d12: {
        name: 'Master Arcane Knowledge (d12)',
        description: 'Master arcane knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You comprehend the complete structure', type: 'critical' },
            { roll: [2, 2], result: 'You recognize all enchantments and purposes', type: 'critical' },
            { roll: [3, 4], result: 'You determine the power architecture', type: 'critical' },
            { roll: [5, 5], result: 'You identify all interactions and dependencies', type: 'critical' },
            { roll: [6, 6], result: 'You recognize the theoretical principles', type: 'critical' },
            { roll: [7, 8], result: 'You determine how to perfect it', type: 'critical' },
            { roll: [9, 9], result: 'You identify a paradigm-shifting approach', type: 'critical' },
            { roll: [10, 10], result: 'You recognize how it advances fundamental theory', type: 'critical' },
            { roll: [11, 12], result: 'You notice a revelation in magical law', type: 'critical' }
        ]
    },

    arcaneknowledge_master_d20: {
        name: 'Master Arcane Knowledge (d20)',
        description: 'Master arcane knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 2], result: 'You identify all major elements with deep insight', type: 'success' },
            { roll: [3, 3], result: 'You recognize it as mythic magic', type: 'critical' },
            { roll: [4, 5], result: 'You determine the complete structure', type: 'critical' },
            { roll: [6, 6], result: 'You identify all schools and traditions', type: 'critical' },
            { roll: [7, 7], result: 'You recognize the enchantment framework', type: 'critical' },
            { roll: [8, 9], result: 'You determine the full architecture', type: 'critical' },
            { roll: [10, 10], result: 'You identify all power sources and flows', type: 'critical' },
            { roll: [11, 11], result: 'You recognize all enchantment layers', type: 'critical' },
            { roll: [12, 13], result: 'You determine all complex interactions', type: 'critical' },
            { roll: [14, 14], result: 'You identify the theoretical foundation', type: 'critical' },
            { roll: [15, 15], result: 'You recognize a legendary framework', type: 'critical' },
            { roll: [16, 17], result: 'You notice primordial or divine influence', type: 'critical' },
            { roll: [18, 20], result: 'You comprehend a reality-altering principle', type: 'critical' }
        ]
    }
};

