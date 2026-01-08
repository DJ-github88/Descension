// Nature Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total
// Each die type has exact outcome count: d4=4, d6=6, d8=8, d10=10, d12=12, d20=13
// For d20 tables: 13 unique outcomes with ranges covering all 20 possible roll values

export const NATURE_TABLES = {
    // UNTRAINED - d4 through d20
    nature_untrained_d4: {
        name: 'Untrained Nature (d4)',
        description: 'Untrained nature knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You confuse safe plant for toxic one', type: 'failure' },
            { roll: [2, 2], result: 'You recognize plant but know nothing else', type: 'normal' },
            { roll: [3, 3], result: 'You identify common plant correctly', type: 'success' },
            { roll: [4, 4], result: 'You recall basic use from folklore', type: 'success' }
        ]
    },
    nature_untrained_d6: {
        name: 'Untrained Nature (d6)',
        description: 'Untrained nature knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You misidentify species completely', type: 'total-failure' },
            { roll: [2, 2], result: 'You mistake edible for poisonous', type: 'failure' },
            { roll: [3, 3], result: 'You guess correctly but unsure', type: 'normal' },
            { roll: [4, 4], result: 'You recall vague description', type: 'normal' },
            { roll: [5, 5], result: 'You identify plant and basic habitat', type: 'success' },
            { roll: [6, 6], result: 'You remember one useful property', type: 'success' }
        ]
    },
    nature_untrained_d8: {
        name: 'Untrained Nature (d8)',
        description: 'Untrained nature knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You eat toxic berry, take 1d6 poison damage', type: 'failure' },
            { roll: [2, 2], result: 'You follow animal tracks in wrong direction', type: 'failure' },
            { roll: [3, 3], result: 'You fail to notice weather warning signs', type: 'failure' },
            { roll: [4, 4], result: 'You misread terrain, waste time', type: 'failure' },
            { roll: [5, 5], result: 'You identify creature type vaguely', type: 'normal' },
            { roll: [6, 6], result: 'You recognize dangerous plant too late', type: 'normal' },
            { roll: [7, 7], result: 'You find safe water source', type: 'success' },
            { roll: [8, 8], result: 'You predict weather within 6 hours', type: 'success' }
        ]
    },
    nature_untrained_d10: {
        name: 'Untrained Nature (d10)',
        description: 'Untrained nature knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You disturb venomous creature, 2d6 damage', type: 'failure' },
            { roll: [2, 2], result: 'You contaminate water sample badly', type: 'failure' },
            { roll: [3, 3], result: 'You ignore predator signs, danger follows', type: 'failure' },
            { roll: [4, 4], result: 'You mistake season, ruin harvest', type: 'failure' },
            { roll: [5, 5], result: 'You fail to identify migration pattern', type: 'failure' },
            { roll: [6, 6], result: 'You recognize ecosystem but not details', type: 'normal' },
            { roll: [7, 7], result: 'You find edible plants through luck', type: 'normal' },
            { roll: [8, 8], result: 'You identify animal by sound alone', type: 'success' },
            { roll: [9, 9], result: 'You locate medicinal herb by chance', type: 'success' },
            { roll: [10, 10], result: 'You stumble upon rare natural resource', type: 'critical' }
        ]
    },
    nature_untrained_d12: {
        name: 'Untrained Nature (d12)',
        description: 'Untrained nature knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You trigger toxic spore cloud, 3d6 damage', type: 'failure' },
            { roll: [2, 2], result: 'You destroy rare specimen through ignorance', type: 'failure' },
            { roll: [3, 3], result: 'You misread all environmental clues', type: 'failure' },
            { roll: [4, 4], result: 'You fail to see obvious danger signs', type: 'failure' },
            { roll: [5, 5], result: 'You cannot identify any local flora', type: 'failure' },
            { roll: [6, 6], result: 'You make wild guess, completely wrong', type: 'normal' },
            { roll: [7, 7], result: 'You recall superstition, partially true', type: 'normal' },
            { roll: [8, 8], result: 'You identify one element correctly', type: 'normal' },
            { roll: [9, 9], result: 'You recognize pattern from childhood tale', type: 'success' },
            { roll: [10, 10], result: 'You apply folk wisdom successfully', type: 'success' },
            { roll: [11, 11], result: 'You find useful resource by instinct', type: 'success' },
            { roll: [12, 12], result: 'You discover hidden natural advantage', type: 'critical' }
        ]
    },
    nature_untrained_d20: {
        name: 'Untrained Nature (d20)',
        description: 'Untrained nature knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You cause catastrophic ecological disaster, 4d6 damage to all nearby, area becomes permanently toxic', type: 'total-failure' },
            { roll: [2, 3], result: 'You destroy critical ecosystem balance, triggering chain reaction that endangers entire region', type: 'total-failure' },
            { roll: [4, 5], result: 'You misidentify everything catastrophically, leading party into deadly trap, 3d6 damage', type: 'total-failure' },
            { roll: [6, 7], result: 'You fail to understand any natural process, waste critical resources and time', type: 'failure' },
            { roll: [8, 9], result: 'You cannot read terrain at all, get completely lost', type: 'failure' },
            { roll: [10, 11], result: 'You see patterns but understand nothing, make dangerous assumptions', type: 'failure' },
            { roll: [12, 13], result: 'You rely on pure superstition, mislead everyone', type: 'failure' },
            { roll: [14, 15], result: 'You make one correct observation', type: 'normal' },
            { roll: [16, 16], result: 'You recall fragment of useful lore', type: 'normal' },
            { roll: [17, 17], result: 'You identify single species correctly', type: 'normal' },
            { roll: [18, 18], result: 'You apply basic common sense', type: 'success' },
            { roll: [19, 19], result: 'You make lucky connection', type: 'success' },
            { roll: [20, 20], result: 'You discover truth through accident', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    nature_novice_d4: {
        name: 'Novice Nature (d4)',
        description: 'Novice nature knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You overlook obvious detail', type: 'failure' },
            { roll: [2, 2], result: 'You identify plant and habitat', type: 'normal' },
            { roll: [3, 3], result: 'You recall medicinal properties', type: 'success' },
            { roll: [4, 4], result: 'You know preparation method', type: 'success' }
        ]
    },
    nature_novice_d6: {
        name: 'Novice Nature (d6)',
        description: 'Novice nature knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You confuse similar species', type: 'failure' },
            { roll: [2, 2], result: 'You identify but miss key detail', type: 'failure' },
            { roll: [3, 3], result: 'You recognize plant and season', type: 'normal' },
            { roll: [4, 4], result: 'You know basic uses', type: 'normal' },
            { roll: [5, 5], result: 'You identify and locate more nearby', type: 'success' },
            { roll: [6, 6], result: 'You recall rare application', type: 'success' }
        ]
    },
    nature_novice_d8: {
        name: 'Novice Nature (d8)',
        description: 'Novice nature knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misread animal behavior', type: 'failure' },
            { roll: [2, 2], result: 'You mistake weather pattern', type: 'failure' },
            { roll: [3, 3], result: 'You identify species incompletely', type: 'failure' },
            { roll: [4, 4], result: 'You understand ecosystem basics', type: 'normal' },
            { roll: [5, 5], result: 'You predict weather 12 hours ahead', type: 'normal' },
            { roll: [6, 6], result: 'You track animal successfully', type: 'success' },
            { roll: [7, 7], result: 'You find safe path through terrain', type: 'success' },
            { roll: [8, 8], result: 'You locate valuable natural material', type: 'critical' }
        ]
    },
    nature_novice_d10: {
        name: 'Novice Nature (d10)',
        description: 'Novice nature knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misidentify dangerous creature', type: 'failure' },
            { roll: [2, 2], result: 'You fail to read migration signs', type: 'failure' },
            { roll: [3, 3], result: 'You overlook critical ecosystem link', type: 'failure' },
            { roll: [4, 4], result: 'You understand part but not whole', type: 'failure' },
            { roll: [5, 5], result: 'You identify most elements correctly', type: 'normal' },
            { roll: [6, 6], result: 'You predict natural event roughly', type: 'normal' },
            { roll: [7, 7], result: 'You understand terrain advantages', type: 'success' },
            { roll: [8, 8], result: 'You locate rare medicinal plant', type: 'success' },
            { roll: [9, 9], result: 'You predict weather 24 hours ahead', type: 'success' },
            { roll: [10, 10], result: 'You discover hidden natural cache', type: 'critical' }
        ]
    },
    nature_novice_d12: {
        name: 'Novice Nature (d12)',
        description: 'Novice nature knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You fail to understand complex pattern', type: 'failure' },
            { roll: [2, 2], result: 'You misread symbiotic relationship', type: 'failure' },
            { roll: [3, 3], result: 'You cannot identify rare species', type: 'failure' },
            { roll: [4, 4], result: 'You miss subtle environmental change', type: 'failure' },
            { roll: [5, 5], result: 'You identify major elements only', type: 'normal' },
            { roll: [6, 6], result: 'You understand basic interactions', type: 'normal' },
            { roll: [7, 7], result: 'You recognize unusual specimen', type: 'normal' },
            { roll: [8, 8], result: 'You predict seasonal shift', type: 'success' },
            { roll: [9, 9], result: 'You identify all local species', type: 'success' },
            { roll: [10, 10], result: 'You find optimal harvest time', type: 'success' },
            { roll: [11, 11], result: 'You locate rare natural resource', type: 'critical' },
            { roll: [12, 12], result: 'You discover unique ecosystem trait', type: 'critical' }
        ]
    },
    nature_novice_d20: {
        name: 'Novice Nature (d20)',
        description: 'Novice nature knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You completely misunderstand ecosystem', type: 'failure' },
            { roll: [2, 3], result: 'You fail to identify any rare species', type: 'failure' },
            { roll: [4, 5], result: 'You cannot read complex patterns', type: 'failure' },
            { roll: [6, 7], result: 'You miss all subtle indicators', type: 'failure' },
            { roll: [8, 9], result: 'You identify surface details only', type: 'failure' },
            { roll: [10, 11], result: 'You understand fragments', type: 'normal' },
            { roll: [12, 13], result: 'You piece together partial picture', type: 'normal' },
            { roll: [14, 15], result: 'You identify key species', type: 'normal' },
            { roll: [16, 16], result: 'You understand major relationships', type: 'success' },
            { roll: [17, 17], result: 'You predict environmental change', type: 'success' },
            { roll: [18, 18], result: 'You locate valuable materials', type: 'success' },
            { roll: [19, 19], result: 'You discover rare specimen', type: 'critical' },
            { roll: [20, 20], result: 'You uncover hidden natural phenomenon', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    nature_trained_d4: {
        name: 'Trained Nature (d4)',
        description: 'Trained nature knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You know all common applications', type: 'success' },
            { roll: [3, 3], result: 'You recall advanced preparation', type: 'success' },
            { roll: [4, 4], result: 'You recognize optimal harvest method', type: 'critical' }
        ]
    },
    nature_trained_d6: {
        name: 'Trained Nature (d6)',
        description: 'Trained nature knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You miss one minor detail', type: 'failure' },
            { roll: [2, 2], result: 'You identify with complete accuracy', type: 'normal' },
            { roll: [3, 3], result: 'You know medicinal and culinary uses', type: 'normal' },
            { roll: [4, 4], result: 'You understand growth cycle fully', type: 'success' },
            { roll: [5, 5], result: 'You locate best specimens nearby', type: 'success' },
            { roll: [6, 6], result: 'You discover uncommon property', type: 'critical' }
        ]
    },
    nature_trained_d8: {
        name: 'Trained Nature (d8)',
        description: 'Trained nature knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You confuse rare subspecies', type: 'failure' },
            { roll: [2, 2], result: 'You identify but miss variant', type: 'failure' },
            { roll: [3, 3], result: 'You understand ecosystem thoroughly', type: 'normal' },
            { roll: [4, 4], result: 'You predict weather 48 hours ahead', type: 'normal' },
            { roll: [5, 5], result: 'You track animal to den', type: 'success' },
            { roll: [6, 6], result: 'You identify all local flora and fauna', type: 'success' },
            { roll: [7, 7], result: 'You find rare medicinal compound', type: 'success' },
            { roll: [8, 8], result: 'You discover unique adaptation', type: 'critical' }
        ]
    },
    nature_trained_d10: {
        name: 'Trained Nature (d10)',
        description: 'Trained nature knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You fail to identify exotic species', type: 'failure' },
            { roll: [2, 2], result: 'You misread complex symbiosis', type: 'failure' },
            { roll: [3, 3], result: 'You understand most relationships', type: 'failure' },
            { roll: [4, 4], result: 'You identify rare species correctly', type: 'normal' },
            { roll: [5, 5], result: 'You understand food web completely', type: 'normal' },
            { roll: [6, 6], result: 'You predict migration patterns', type: 'success' },
            { roll: [7, 7], result: 'You locate rare natural materials', type: 'success' },
            { roll: [8, 8], result: 'You identify medicinal combinations', type: 'success' },
            { roll: [9, 9], result: 'You discover hidden ecosystem service', type: 'success' },
            { roll: [10, 10], result: 'You find exceptionally rare specimen', type: 'critical' }
        ]
    },
    nature_trained_d12: {
        name: 'Trained Nature (d12)',
        description: 'Trained nature knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You cannot identify unknown species', type: 'failure' },
            { roll: [2, 2], result: 'You miss critical environmental factor', type: 'failure' },
            { roll: [3, 3], result: 'You fail to predict rare event', type: 'failure' },
            { roll: [4, 4], result: 'You understand major patterns', type: 'normal' },
            { roll: [5, 5], result: 'You identify unusual adaptations', type: 'normal' },
            { roll: [6, 6], result: 'You predict seasonal anomaly', type: 'normal' },
            { roll: [7, 7], result: 'You understand complex interactions', type: 'success' },
            { roll: [8, 8], result: 'You locate valuable rare resource', type: 'success' },
            { roll: [9, 9], result: 'You identify all ecosystem niches', type: 'success' },
            { roll: [10, 10], result: 'You discover new medicinal use', type: 'success' },
            { roll: [11, 11], result: 'You find pristine natural specimen', type: 'critical' },
            { roll: [12, 12], result: 'You uncover hidden natural cycle', type: 'critical' }
        ]
    },
    nature_trained_d20: {
        name: 'Trained Nature (d20)',
        description: 'Trained nature knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You face completely unknown ecosystem', type: 'failure' },
            { roll: [2, 3], result: 'You cannot identify alien species', type: 'failure' },
            { roll: [4, 5], result: 'You fail to understand unique biome', type: 'failure' },
            { roll: [6, 7], result: 'You miss critical adaptations', type: 'failure' },
            { roll: [8, 9], result: 'You identify surface patterns only', type: 'normal' },
            { roll: [10, 11], result: 'You understand basic structure', type: 'normal' },
            { roll: [12, 13], result: 'You piece together ecosystem', type: 'normal' },
            { roll: [14, 15], result: 'You identify key species', type: 'success' },
            { roll: [16, 16], result: 'You understand major relationships', type: 'success' },
            { roll: [17, 17], result: 'You predict environmental shift', type: 'success' },
            { roll: [18, 18], result: 'You discover rare natural process', type: 'success' },
            { roll: [19, 19], result: 'You locate exceptional specimen', type: 'critical' },
            { roll: [20, 20], result: 'You uncover unique natural phenomenon', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    nature_apprentice_d4: {
        name: 'Apprentice Nature (d4)',
        description: 'Apprentice nature knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'You know all properties and uses', type: 'success' },
            { roll: [3, 3], result: 'You understand complete life cycle', type: 'critical' },
            { roll: [4, 4], result: 'You recognize optimal conditions', type: 'critical' }
        ]
    },
    nature_apprentice_d6: {
        name: 'Apprentice Nature (d6)',
        description: 'Apprentice nature knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You know all medicinal applications', type: 'success' },
            { roll: [3, 3], result: 'You understand ecosystem role fully', type: 'success' },
            { roll: [4, 4], result: 'You predict growth patterns', type: 'success' },
            { roll: [5, 5], result: 'You discover advanced preparation', type: 'critical' },
            { roll: [6, 6], result: 'You identify rare variant', type: 'critical' }
        ]
    },
    nature_apprentice_d8: {
        name: 'Apprentice Nature (d8)',
        description: 'Apprentice nature knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You miss subtle subspecies marker', type: 'failure' },
            { roll: [2, 2], result: 'You understand all major elements', type: 'normal' },
            { roll: [3, 3], result: 'You predict weather 72 hours ahead', type: 'normal' },
            { roll: [4, 4], result: 'You identify complex relationships', type: 'success' },
            { roll: [5, 5], result: 'You track animal through difficult terrain', type: 'success' },
            { roll: [6, 6], result: 'You locate rare medicinal plants', type: 'success' },
            { roll: [7, 7], result: 'You understand symbiotic networks', type: 'success' },
            { roll: [8, 8], result: 'You discover unique natural compound', type: 'critical' }
        ]
    },
    nature_apprentice_d10: {
        name: 'Apprentice Nature (d10)',
        description: 'Apprentice nature knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You struggle with exotic species', type: 'failure' },
            { roll: [2, 2], result: 'You miss rare adaptation', type: 'failure' },
            { roll: [3, 3], result: 'You identify most species correctly', type: 'normal' },
            { roll: [4, 4], result: 'You understand ecosystem dynamics', type: 'normal' },
            { roll: [5, 5], result: 'You predict natural events accurately', type: 'normal' },
            { roll: [6, 6], result: 'You identify all local species', type: 'success' },
            { roll: [7, 7], result: 'You understand food web completely', type: 'success' },
            { roll: [8, 8], result: 'You locate valuable resources', type: 'success' },
            { roll: [9, 9], result: 'You discover rare natural process', type: 'success' },
            { roll: [10, 10], result: 'You find exceptional specimen', type: 'critical' }
        ]
    },
    nature_apprentice_d12: {
        name: 'Apprentice Nature (d12)',
        description: 'Apprentice nature knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You cannot identify unknown species', type: 'failure' },
            { roll: [2, 2], result: 'You miss critical interaction', type: 'failure' },
            { roll: [3, 3], result: 'You fail to predict rare event', type: 'failure' },
            { roll: [4, 4], result: 'You understand major patterns', type: 'normal' },
            { roll: [5, 5], result: 'You identify unusual adaptations', type: 'normal' },
            { roll: [6, 6], result: 'You predict environmental change', type: 'normal' },
            { roll: [7, 7], result: 'You understand complex symbiosis', type: 'success' },
            { roll: [8, 8], result: 'You locate rare natural materials', type: 'success' },
            { roll: [9, 9], result: 'You identify all ecosystem roles', type: 'success' },
            { roll: [10, 10], result: 'You discover new application', type: 'success' },
            { roll: [11, 11], result: 'You find pristine specimen', type: 'critical' },
            { roll: [12, 12], result: 'You uncover hidden natural cycle', type: 'critical' }
        ]
    },
    nature_apprentice_d20: {
        name: 'Apprentice Nature (d20)',
        description: 'Apprentice nature knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You face completely alien ecosystem', type: 'failure' },
            { roll: [2, 3], result: 'You cannot identify exotic species', type: 'failure' },
            { roll: [4, 5], result: 'You fail to understand unique biome', type: 'failure' },
            { roll: [6, 7], result: 'You miss critical adaptations', type: 'failure' },
            { roll: [8, 9], result: 'You identify basic patterns', type: 'normal' },
            { roll: [10, 11], result: 'You understand major structure', type: 'normal' },
            { roll: [12, 13], result: 'You piece together ecosystem', type: 'normal' },
            { roll: [14, 15], result: 'You identify key species', type: 'success' },
            { roll: [16, 16], result: 'You understand relationships', type: 'success' },
            { roll: [17, 17], result: 'You predict major shift', type: 'success' },
            { roll: [18, 18], result: 'You discover rare process', type: 'success' },
            { roll: [19, 19], result: 'You locate exceptional resource', type: 'critical' },
            { roll: [20, 20], result: 'You uncover unique phenomenon', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    nature_adept_d4: {
        name: 'Adept Nature (d4)',
        description: 'Adept nature knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You understand all applications', type: 'critical' },
            { roll: [3, 3], result: 'You predict all interactions', type: 'critical' },
            { roll: [4, 4], result: 'You see complete natural picture', type: 'critical' }
        ]
    },
    nature_adept_d6: {
        name: 'Adept Nature (d6)',
        description: 'Adept nature knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'You know all properties', type: 'success' },
            { roll: [3, 3], result: 'You understand ecosystem perfectly', type: 'success' },
            { roll: [4, 4], result: 'You predict all patterns', type: 'critical' },
            { roll: [5, 5], result: 'You discover hidden property', type: 'critical' },
            { roll: [6, 6], result: 'You find rare variant', type: 'critical' }
        ]
    },
    nature_adept_d8: {
        name: 'Adept Nature (d8)',
        description: 'Adept nature knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You understand all relationships', type: 'normal' },
            { roll: [3, 3], result: 'You predict weather week ahead', type: 'success' },
            { roll: [4, 4], result: 'You identify complex interactions', type: 'success' },
            { roll: [5, 5], result: 'You locate rare specimens', type: 'success' },
            { roll: [6, 6], result: 'You understand symbiotic networks', type: 'success' },
            { roll: [7, 7], result: 'You discover unique compound', type: 'critical' },
            { roll: [8, 8], result: 'You find exceptional resource', type: 'critical' }
        ]
    },
    nature_adept_d10: {
        name: 'Adept Nature (d10)',
        description: 'Adept nature knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You need time to analyze', type: 'failure' },
            { roll: [2, 2], result: 'You identify all species', type: 'normal' },
            { roll: [3, 3], result: 'You understand ecosystem fully', type: 'normal' },
            { roll: [4, 4], result: 'You predict natural events', type: 'normal' },
            { roll: [5, 5], result: 'You identify rare adaptations', type: 'success' },
            { roll: [6, 6], result: 'You understand food web', type: 'success' },
            { roll: [7, 7], result: 'You locate valuable materials', type: 'success' },
            { roll: [8, 8], result: 'You discover rare process', type: 'success' },
            { roll: [9, 9], result: 'You find pristine specimen', type: 'critical' },
            { roll: [10, 10], result: 'You uncover hidden cycle', type: 'critical' }
        ]
    },
    nature_adept_d12: {
        name: 'Adept Nature (d12)',
        description: 'Adept nature knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You struggle with unknown species', type: 'failure' },
            { roll: [2, 2], result: 'You miss subtle interaction', type: 'failure' },
            { roll: [3, 3], result: 'You identify major patterns', type: 'normal' },
            { roll: [4, 4], result: 'You understand adaptations', type: 'normal' },
            { roll: [5, 5], result: 'You predict environmental shift', type: 'normal' },
            { roll: [6, 6], result: 'You understand complex symbiosis', type: 'success' },
            { roll: [7, 7], result: 'You locate rare resources', type: 'success' },
            { roll: [8, 8], result: 'You identify all niches', type: 'success' },
            { roll: [9, 9], result: 'You discover new use', type: 'success' },
            { roll: [10, 10], result: 'You find exceptional specimen', type: 'critical' },
            { roll: [11, 11], result: 'You uncover natural secret', type: 'critical' },
            { roll: [12, 12], result: 'You master ecosystem knowledge', type: 'critical' }
        ]
    },
    nature_adept_d20: {
        name: 'Adept Nature (d20)',
        description: 'Adept nature knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You face truly alien ecosystem', type: 'failure' },
            { roll: [2, 3], result: 'You cannot identify exotic species', type: 'failure' },
            { roll: [4, 5], result: 'You fail to understand biome', type: 'failure' },
            { roll: [6, 7], result: 'You identify basic patterns', type: 'normal' },
            { roll: [8, 9], result: 'You understand structure', type: 'normal' },
            { roll: [10, 11], result: 'You piece together ecosystem', type: 'normal' },
            { roll: [12, 13], result: 'You identify key species', type: 'success' },
            { roll: [14, 15], result: 'You understand relationships', type: 'success' },
            { roll: [16, 16], result: 'You predict major changes', type: 'success' },
            { roll: [17, 17], result: 'You discover rare process', type: 'success' },
            { roll: [18, 18], result: 'You locate exceptional resource', type: 'critical' },
            { roll: [19, 19], result: 'You uncover unique phenomenon', type: 'critical' },
            { roll: [20, 20], result: 'You master alien ecosystem', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    nature_expert_d4: {
        name: 'Expert Nature (d4)',
        description: 'Expert nature knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You understand all connections', type: 'critical' },
            { roll: [3, 3], result: 'You predict all outcomes', type: 'critical' },
            { roll: [4, 4], result: 'You see complete natural harmony', type: 'critical' }
        ]
    },
    nature_expert_d6: {
        name: 'Expert Nature (d6)',
        description: 'Expert nature knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'You know all properties', type: 'critical' },
            { roll: [3, 3], result: 'You understand ecosystem perfectly', type: 'critical' },
            { roll: [4, 4], result: 'You predict all patterns', type: 'critical' },
            { roll: [5, 5], result: 'You discover hidden secrets', type: 'critical' },
            { roll: [6, 6], result: 'You find exceptional variant', type: 'critical' }
        ]
    },
    nature_expert_d8: {
        name: 'Expert Nature (d8)',
        description: 'Expert nature knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'You understand all relationships', type: 'success' },
            { roll: [3, 3], result: 'You predict weather precisely', type: 'success' },
            { roll: [4, 4], result: 'You identify complex interactions', type: 'critical' },
            { roll: [5, 5], result: 'You locate rare specimens', type: 'critical' },
            { roll: [6, 6], result: 'You understand networks completely', type: 'critical' },
            { roll: [7, 7], result: 'You discover unique compounds', type: 'critical' },
            { roll: [8, 8], result: 'You find exceptional resources', type: 'critical' }
        ]
    },
    nature_expert_d10: {
        name: 'Expert Nature (d10)',
        description: 'Expert nature knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You identify all species', type: 'success' },
            { roll: [3, 3], result: 'You understand ecosystem fully', type: 'success' },
            { roll: [4, 4], result: 'You predict natural events', type: 'success' },
            { roll: [5, 5], result: 'You identify rare adaptations', type: 'success' },
            { roll: [6, 6], result: 'You understand food web', type: 'critical' },
            { roll: [7, 7], result: 'You locate valuable materials', type: 'critical' },
            { roll: [8, 8], result: 'You discover rare processes', type: 'critical' },
            { roll: [9, 9], result: 'You find pristine specimens', type: 'critical' },
            { roll: [10, 10], result: 'You uncover hidden cycles', type: 'critical' }
        ]
    },
    nature_expert_d12: {
        name: 'Expert Nature (d12)',
        description: 'Expert nature knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You identify major patterns', type: 'normal' },
            { roll: [3, 3], result: 'You understand adaptations', type: 'success' },
            { roll: [4, 4], result: 'You predict environmental shifts', type: 'success' },
            { roll: [5, 5], result: 'You understand complex symbiosis', type: 'success' },
            { roll: [6, 6], result: 'You locate rare resources', type: 'success' },
            { roll: [7, 7], result: 'You identify all niches', type: 'critical' },
            { roll: [8, 8], result: 'You discover new uses', type: 'critical' },
            { roll: [9, 9], result: 'You find exceptional specimens', type: 'critical' },
            { roll: [10, 10], result: 'You uncover natural secrets', type: 'critical' },
            { roll: [11, 11], result: 'You master ecosystem knowledge', type: 'critical' },
            { roll: [12, 12], result: 'You achieve perfect understanding', type: 'critical' }
        ]
    },
    nature_expert_d20: {
        name: 'Expert Nature (d20)',
        description: 'Expert nature knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You face unprecedented ecosystem', type: 'failure' },
            { roll: [2, 3], result: 'You need time to analyze', type: 'normal' },
            { roll: [4, 5], result: 'You identify basic patterns', type: 'normal' },
            { roll: [6, 7], result: 'You understand structure', type: 'success' },
            { roll: [8, 9], result: 'You piece together ecosystem', type: 'success' },
            { roll: [10, 11], result: 'You identify key species', type: 'success' },
            { roll: [12, 13], result: 'You understand relationships', type: 'success' },
            { roll: [14, 15], result: 'You predict major changes', type: 'critical' },
            { roll: [16, 16], result: 'You discover rare processes', type: 'critical' },
            { roll: [17, 17], result: 'You locate exceptional resources', type: 'critical' },
            { roll: [18, 18], result: 'You uncover unique phenomena', type: 'critical' },
            { roll: [19, 19], result: 'You master alien ecosystem', type: 'critical' },
            { roll: [20, 20], result: 'You achieve complete mastery', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    nature_master_d4: {
        name: 'Master Nature (d4)',
        description: 'Master nature knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You understand all connections', type: 'critical' },
            { roll: [3, 3], result: 'You predict all outcomes', type: 'critical' },
            { roll: [4, 4], result: 'You see complete natural harmony', type: 'critical' }
        ]
    },
    nature_master_d6: {
        name: 'Master Nature (d6)',
        description: 'Master nature knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You know all properties', type: 'critical' },
            { roll: [3, 3], result: 'You understand ecosystem perfectly', type: 'critical' },
            { roll: [4, 4], result: 'You predict all patterns', type: 'critical' },
            { roll: [5, 5], result: 'You discover hidden secrets', type: 'critical' },
            { roll: [6, 6], result: 'You find exceptional variants', type: 'critical' }
        ]
    },
    nature_master_d8: {
        name: 'Master Nature (d8)',
        description: 'Master nature knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'You understand all relationships', type: 'critical' },
            { roll: [3, 3], result: 'You predict weather precisely', type: 'critical' },
            { roll: [4, 4], result: 'You identify complex interactions', type: 'critical' },
            { roll: [5, 5], result: 'You locate rare specimens', type: 'critical' },
            { roll: [6, 6], result: 'You understand networks completely', type: 'critical' },
            { roll: [7, 7], result: 'You discover unique compounds', type: 'critical' },
            { roll: [8, 8], result: 'You find exceptional resources', type: 'critical' }
        ]
    },
    nature_master_d10: {
        name: 'Master Nature (d10)',
        description: 'Master nature knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You identify all species', type: 'critical' },
            { roll: [3, 3], result: 'You understand ecosystem fully', type: 'critical' },
            { roll: [4, 4], result: 'You predict natural events', type: 'critical' },
            { roll: [5, 5], result: 'You identify rare adaptations', type: 'critical' },
            { roll: [6, 6], result: 'You understand food web', type: 'critical' },
            { roll: [7, 7], result: 'You locate valuable materials', type: 'critical' },
            { roll: [8, 8], result: 'You discover rare processes', type: 'critical' },
            { roll: [9, 9], result: 'You find pristine specimens', type: 'critical' },
            { roll: [10, 10], result: 'You uncover hidden cycles', type: 'critical' }
        ]
    },
    nature_master_d12: {
        name: 'Master Nature (d12)',
        description: 'Master nature knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You identify major patterns', type: 'success' },
            { roll: [3, 3], result: 'You understand adaptations', type: 'critical' },
            { roll: [4, 4], result: 'You predict environmental shifts', type: 'critical' },
            { roll: [5, 5], result: 'You understand complex symbiosis', type: 'critical' },
            { roll: [6, 6], result: 'You locate rare resources', type: 'critical' },
            { roll: [7, 7], result: 'You identify all niches', type: 'critical' },
            { roll: [8, 8], result: 'You discover new uses', type: 'critical' },
            { roll: [9, 9], result: 'You find exceptional specimens', type: 'critical' },
            { roll: [10, 10], result: 'You uncover natural secrets', type: 'critical' },
            { roll: [11, 11], result: 'You master ecosystem knowledge', type: 'critical' },
            { roll: [12, 12], result: 'You achieve perfect understanding', type: 'critical' }
        ]
    },
    nature_master_d20: {
        name: 'Master Nature (d20)',
        description: 'Master nature knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 3], result: 'You need brief analysis', type: 'success' },
            { roll: [4, 5], result: 'You identify basic patterns', type: 'success' },
            { roll: [6, 7], result: 'You understand structure', type: 'critical' },
            { roll: [8, 9], result: 'You piece together ecosystem', type: 'critical' },
            { roll: [10, 11], result: 'You identify key species', type: 'critical' },
            { roll: [12, 13], result: 'You understand relationships', type: 'critical' },
            { roll: [14, 15], result: 'You predict major changes', type: 'critical' },
            { roll: [16, 16], result: 'You discover rare processes', type: 'critical' },
            { roll: [17, 17], result: 'You locate exceptional resources', type: 'critical' },
            { roll: [18, 18], result: 'You uncover unique phenomena', type: 'critical' },
            { roll: [19, 19], result: 'You master alien ecosystem', type: 'critical' },
            { roll: [20, 20], result: 'You achieve absolute mastery', type: 'critical' }
        ]
    }
};

