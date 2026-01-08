// History Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total

export const HISTORY_TABLES = {
    // UNTRAINED - d4 through d20
    history_untrained_d4: {
        name: 'Untrained History (d4)',
        description: 'Untrained historical recall on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You confuse two different dynasties, recall myth as fact', type: 'failure' },
            { roll: [2, 2], result: 'You remember vague rumors, no useful details', type: 'normal' },
            { roll: [3, 3], result: 'You recall basic facts, common knowledge', type: 'success' },
            { roll: [4, 4], result: 'Despite inexperience, you remember key details', type: 'success' }
        ]
    },
    history_untrained_d6: {
        name: 'Untrained History (d6)',
        description: 'Untrained historical recall on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You misidentify the crest, insult someone with wrong lineage', type: 'failure' },
            { roll: [2, 2], result: 'You mix up time periods, recall unrelated events', type: 'failure' },
            { roll: [3, 4], result: 'You remember the general era but few specifics', type: 'normal' },
            { roll: [5, 5], result: 'You recall who won but not why', type: 'normal' },
            { roll: [6, 6], result: 'You remember basic outline and one key detail', type: 'success' }
        ]
    },
    history_untrained_d8: {
        name: 'Untrained History (d8)',
        description: 'Untrained historical recall on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You recall false information, believe propaganda as truth', type: 'failure' },
            { roll: [2, 3], result: 'You confuse similar events from different centuries', type: 'failure' },
            { roll: [4, 4], result: 'You remember fragments but cannot connect them', type: 'normal' },
            { roll: [5, 5], result: 'You recall one side of the story only', type: 'normal' },
            { roll: [6, 6], result: 'You identify the correct era and region', type: 'normal' },
            { roll: [7, 7], result: 'You remember key figures and basic motivations', type: 'success' },
            { roll: [8, 8], result: 'Lucky recall reveals important context', type: 'success' }
        ]
    },
    history_untrained_d10: {
        name: 'Untrained History (d10)',
        description: 'Untrained historical recall on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You mistake myth for history, spread misinformation', type: 'failure' },
            { roll: [3, 4], result: 'You recall contradictory accounts, cannot determine truth', type: 'failure' },
            { roll: [5, 6], result: 'You remember vague details but miss significance', type: 'normal' },
            { roll: [7, 7], result: 'You identify the general time period', type: 'normal' },
            { roll: [8, 8], result: 'You recall scattered facts without full context', type: 'normal' },
            { roll: [9, 9], result: 'You remember one crucial detail correctly', type: 'success' },
            { roll: [10, 10], result: 'Against odds, you recall accurate information', type: 'success' }
        ]
    },
    history_untrained_d12: {
        name: 'Untrained History (d12)',
        description: 'Untrained historical recall on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You confuse enemy factions, recall opposite of truth', type: 'failure' },
            { roll: [3, 4], result: 'You misquote ancient treaty, create diplomatic incident', type: 'failure' },
            { roll: [5, 6], result: 'You remember popular legend instead of actual events', type: 'failure' },
            { roll: [7, 8], result: 'You recall fragments too obscure to be useful', type: 'normal' },
            { roll: [9, 10], result: 'You identify the culture but not the specific event', type: 'normal' },
            { roll: [11, 11], result: 'You remember one name or date correctly', type: 'normal' },
            { roll: [12, 12], result: 'Beginner luck reveals a relevant detail', type: 'success' }
        ]
    },
    history_untrained_d20: {
        name: 'Untrained History (d20)',
        description: 'Untrained historical recall on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'You recall completely false history, dangerous misinformation', type: 'failure' },
            { roll: [4, 6], result: 'You confuse multiple dynasties and time periods', type: 'failure' },
            { roll: [7, 9], result: 'You remember only myths and legends, no facts', type: 'failure' },
            { roll: [10, 12], result: 'You are overwhelmed by contradictory accounts', type: 'failure' },
            { roll: [13, 15], result: 'You recall vague impressions, nothing concrete', type: 'normal' },
            { roll: [16, 17], result: 'You identify the general region and era', type: 'normal' },
            { roll: [18, 18], result: 'You remember a single fragmented detail', type: 'normal' },
            { roll: [19, 19], result: 'Miraculous recall of one accurate fact', type: 'success' },
            { roll: [20, 20], result: 'Against all odds, you remember something useful', type: 'success' }
        ]
    },

    // NOVICE - d4 through d20
    history_novice_d4: {
        name: 'Novice History (d4)',
        description: 'Novice historical recall on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misremember minor details, mostly correct', type: 'failure' },
            { roll: [2, 2], result: 'You recall accurate basic facts', type: 'normal' },
            { roll: [3, 3], result: 'You remember names, dates, and outcomes', type: 'success' },
            { roll: [4, 4], result: 'You recall details and understand significance', type: 'success' }
        ]
    },
    history_novice_d6: {
        name: 'Novice History (d6)',
        description: 'Novice historical recall on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You confuse similar historical figures', type: 'failure' },
            { roll: [2, 2], result: 'You recall the event but miss key context', type: 'normal' },
            { roll: [3, 4], result: 'You remember accurate timeline and major players', type: 'success' },
            { roll: [5, 5], result: 'You recall motivations and consequences', type: 'success' },
            { roll: [6, 6], result: 'You understand cultural impact of the event', type: 'critical' }
        ]
    },
    history_novice_d8: {
        name: 'Novice History (d8)',
        description: 'Novice historical recall on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You mix up related but distinct events', type: 'failure' },
            { roll: [2, 2], result: 'You recall partial information, some errors', type: 'failure' },
            { roll: [3, 4], result: 'You remember the main facts correctly', type: 'normal' },
            { roll: [5, 5], result: 'You identify key figures and their roles', type: 'normal' },
            { roll: [6, 6], result: 'You recall accurate details and context', type: 'success' },
            { roll: [7, 7], result: 'You understand the political implications', type: 'success' },
            { roll: [8, 8], result: 'You connect this event to broader patterns', type: 'critical' }
        ]
    },
    history_novice_d10: {
        name: 'Novice History (d10)',
        description: 'Novice historical recall on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'You recall conflicting accounts, uncertain which is true', type: 'failure' },
            { roll: [3, 4], result: 'You remember basic outline but lack details', type: 'failure' },
            { roll: [5, 6], result: 'You identify the era and major participants', type: 'normal' },
            { roll: [7, 7], result: 'You recall key events in sequence', type: 'normal' },
            { roll: [8, 8], result: 'You remember important details and motivations', type: 'success' },
            { roll: [9, 9], result: 'You understand the historical significance', type: 'success' },
            { roll: [10, 10], result: 'You recall obscure but relevant details', type: 'critical' }
        ]
    },
    history_novice_d12: {
        name: 'Novice History (d12)',
        description: 'Novice historical recall on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'You confuse this with a similar event', type: 'failure' },
            { roll: [3, 4], result: 'You recall fragments but miss connections', type: 'failure' },
            { roll: [5, 6], result: 'You remember the general time and place', type: 'normal' },
            { roll: [7, 8], result: 'You identify major figures involved', type: 'normal' },
            { roll: [9, 10], result: 'You recall accurate sequence of events', type: 'success' },
            { roll: [11, 11], result: 'You understand causes and effects', type: 'success' },
            { roll: [12, 12], result: 'You remember rare details and context', type: 'critical' }
        ]
    },
    history_novice_d20: {
        name: 'Novice History (d20)',
        description: 'Novice historical recall on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'You recall popular myths instead of facts', type: 'failure' },
            { roll: [4, 6], result: 'You remember contradictory sources, cannot reconcile', type: 'failure' },
            { roll: [7, 9], result: 'You identify the culture and approximate era', type: 'normal' },
            { roll: [10, 12], result: 'You recall scattered facts without full picture', type: 'normal' },
            { roll: [13, 15], result: 'You remember key figures and basic timeline', type: 'normal' },
            { roll: [16, 17], result: 'You piece together accurate account', type: 'success' },
            { roll: [18, 18], result: 'You recall important context and motivations', type: 'success' },
            { roll: [19, 19], result: 'You understand the broader implications', type: 'critical' },
            { roll: [20, 20], result: 'You remember obscure details that clarify everything', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    history_trained_d4: {
        name: 'Trained History (d4)',
        description: 'Trained historical recall on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You remember details and cultural context', type: 'success' },
            { roll: [3, 3], result: 'You understand motivations and consequences', type: 'success' },
            { roll: [4, 4], result: 'You connect this to related historical patterns', type: 'critical' }
        ]
    },
    history_trained_d6: {
        name: 'Trained History (d6)',
        description: 'Trained historical recall on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You miss some nuance but recall core facts', type: 'failure' },
            { roll: [2, 2], result: 'You remember accurate timeline and participants', type: 'normal' },
            { roll: [3, 4], result: 'You recall detailed account with context', type: 'success' },
            { roll: [5, 5], result: 'You understand political and cultural significance', type: 'success' },
            { roll: [6, 6], result: 'You identify patterns and draw insights', type: 'critical' }
        ]
    },
    history_trained_d8: {
        name: 'Trained History (d8)',
        description: 'Trained historical recall on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You recall most facts but miss key detail', type: 'failure' },
            { roll: [2, 2], result: 'You remember solid outline with some gaps', type: 'normal' },
            { roll: [3, 4], result: 'You recall accurate sequence and major figures', type: 'normal' },
            { roll: [5, 5], result: 'You remember detailed account with motivations', type: 'success' },
            { roll: [6, 6], result: 'You understand causes, effects, and significance', type: 'success' },
            { roll: [7, 7], result: 'You identify connections to other events', type: 'success' },
            { roll: [8, 8], result: 'You draw meaningful insights from the past', type: 'critical' }
        ]
    },
    history_trained_d10: {
        name: 'Trained History (d10)',
        description: 'Trained historical recall on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'You recall general facts but lack specifics', type: 'failure' },
            { roll: [3, 4], result: 'You remember the era and major participants', type: 'normal' },
            { roll: [5, 6], result: 'You recall key events and timeline', type: 'normal' },
            { roll: [7, 7], result: 'You remember detailed account with context', type: 'success' },
            { roll: [8, 8], result: 'You understand motivations and consequences', type: 'success' },
            { roll: [9, 9], result: 'You identify cultural and political impact', type: 'success' },
            { roll: [10, 10], result: 'You connect this to broader historical patterns', type: 'critical' }
        ]
    },
    history_trained_d12: {
        name: 'Trained History (d12)',
        description: 'Trained historical recall on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'You remember basic facts but miss important context', type: 'failure' },
            { roll: [3, 4], result: 'You recall the time period and region', type: 'normal' },
            { roll: [5, 6], result: 'You remember major figures and events', type: 'normal' },
            { roll: [7, 8], result: 'You recall detailed timeline and motivations', type: 'success' },
            { roll: [9, 10], result: 'You understand significance and consequences', type: 'success' },
            { roll: [11, 11], result: 'You identify connections to related events', type: 'success' },
            { roll: [12, 12], result: 'You draw insightful conclusions from the past', type: 'critical' }
        ]
    },
    history_trained_d20: {
        name: 'Trained History (d20)',
        description: 'Trained historical recall on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 3], result: 'You recall fragments but cannot piece them together', type: 'failure' },
            { roll: [4, 6], result: 'You remember the culture and approximate era', type: 'failure' },
            { roll: [7, 9], result: 'You identify the region and time period', type: 'normal' },
            { roll: [10, 12], result: 'You recall scattered facts and some context', type: 'normal' },
            { roll: [13, 15], result: 'You remember key figures and events', type: 'normal' },
            { roll: [16, 17], result: 'You piece together accurate account', type: 'success' },
            { roll: [18, 18], result: 'You understand motivations and significance', type: 'success' },
            { roll: [19, 19], result: 'You identify important patterns and connections', type: 'critical' },
            { roll: [20, 20], result: 'You recall obscure details that reveal deeper truth', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    history_apprentice_d4: {
        name: 'Apprentice History (d4)',
        description: 'Apprentice historical recall on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'You understand all context and significance', type: 'success' },
            { roll: [3, 3], result: 'You identify patterns and draw insights', type: 'critical' },
            { roll: [4, 4], result: 'You connect this to broader historical movements', type: 'critical' }
        ]
    },
    history_apprentice_d6: {
        name: 'Apprentice History (d6)',
        description: 'Apprentice historical recall on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You remember comprehensive account with context', type: 'success' },
            { roll: [3, 4], result: 'You understand all motivations and consequences', type: 'success' },
            { roll: [5, 5], result: 'You identify cultural and political patterns', type: 'success' },
            { roll: [6, 6], result: 'You draw meaningful insights from multiple eras', type: 'critical' }
        ]
    },
    history_apprentice_d8: {
        name: 'Apprentice History (d8)',
        description: 'Apprentice historical recall on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You recall solid facts but miss some nuance', type: 'failure' },
            { roll: [2, 2], result: 'You remember detailed timeline and participants', type: 'normal' },
            { roll: [3, 4], result: 'You recall comprehensive account with context', type: 'success' },
            { roll: [5, 5], result: 'You understand complex motivations and outcomes', type: 'success' },
            { roll: [6, 6], result: 'You identify significance and broader impact', type: 'success' },
            { roll: [7, 7], result: 'You connect this to related historical patterns', type: 'critical' },
            { roll: [8, 8], result: 'You reveal forgotten perspective that clarifies events', type: 'critical' }
        ]
    },
    history_apprentice_d10: {
        name: 'Apprentice History (d10)',
        description: 'Apprentice historical recall on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 2], result: 'You recall basic outline but lack depth', type: 'failure' },
            { roll: [3, 4], result: 'You remember the era and major events', type: 'normal' },
            { roll: [5, 6], result: 'You recall detailed account with timeline', type: 'normal' },
            { roll: [7, 7], result: 'You understand motivations and context', type: 'success' },
            { roll: [8, 8], result: 'You identify significance and consequences', type: 'success' },
            { roll: [9, 9], result: 'You connect this to broader patterns', type: 'success' },
            { roll: [10, 10], result: 'You draw insightful conclusions from the past', type: 'critical' }
        ]
    },
    history_apprentice_d12: {
        name: 'Apprentice History (d12)',
        description: 'Apprentice historical recall on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 2], result: 'You recall scattered facts without full picture', type: 'failure' },
            { roll: [3, 4], result: 'You remember the culture and time period', type: 'normal' },
            { roll: [5, 6], result: 'You recall key figures and events', type: 'normal' },
            { roll: [7, 8], result: 'You piece together accurate account', type: 'success' },
            { roll: [9, 10], result: 'You understand complex motivations and outcomes', type: 'success' },
            { roll: [11, 11], result: 'You identify important patterns and connections', type: 'success' },
            { roll: [12, 12], result: 'You reveal forgotten perspective that changes understanding', type: 'critical' }
        ]
    },
    history_apprentice_d20: {
        name: 'Apprentice History (d20)',
        description: 'Apprentice historical recall on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 3], result: 'You recall only fragments, cannot connect them', type: 'failure' },
            { roll: [4, 6], result: 'You remember vague details and approximate era', type: 'failure' },
            { roll: [7, 9], result: 'You identify the culture and region', type: 'normal' },
            { roll: [10, 12], result: 'You recall scattered facts with some context', type: 'normal' },
            { roll: [13, 15], result: 'You remember key events and timeline', type: 'normal' },
            { roll: [16, 17], result: 'You piece together detailed account', type: 'success' },
            { roll: [18, 18], result: 'You understand motivations and significance', type: 'success' },
            { roll: [19, 19], result: 'You identify patterns across distant eras', type: 'critical' },
            { roll: [20, 20], result: 'You recall obscure sources that reveal deeper truth', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    history_adept_d4: {
        name: 'Adept History (d4)',
        description: 'Adept historical recall on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You understand complex patterns and significance', type: 'critical' },
            { roll: [3, 3], result: 'You connect this to distant eras and cultures', type: 'critical' },
            { roll: [4, 4], result: 'You reveal forgotten perspectives that reshape understanding', type: 'critical' }
        ]
    },
    history_adept_d6: {
        name: 'Adept History (d6)',
        description: 'Adept historical recall on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You remember comprehensive details and context', type: 'success' },
            { roll: [3, 4], result: 'You understand all motivations and consequences', type: 'success' },
            { roll: [5, 5], result: 'You identify repeating patterns across eras', type: 'critical' },
            { roll: [6, 6], result: 'You draw profound insights from historical parallels', type: 'critical' }
        ]
    },
    history_adept_d8: {
        name: 'Adept History (d8)',
        description: 'Adept historical recall on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You recall most details but miss subtle nuance', type: 'failure' },
            { roll: [2, 2], result: 'You remember comprehensive timeline and context', type: 'normal' },
            { roll: [3, 4], result: 'You understand complex motivations and outcomes', type: 'success' },
            { roll: [5, 5], result: 'You identify significance and broader impact', type: 'success' },
            { roll: [6, 6], result: 'You connect this to patterns across cultures', type: 'success' },
            { roll: [7, 7], result: 'You reveal forgotten perspective that clarifies truth', type: 'critical' },
            { roll: [8, 8], result: 'You draw political and moral insights from the past', type: 'critical' }
        ]
    },
    history_adept_d10: {
        name: 'Adept History (d10)',
        description: 'Adept historical recall on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 2], result: 'You recall solid facts but lack some depth', type: 'failure' },
            { roll: [3, 4], result: 'You remember detailed timeline and participants', type: 'normal' },
            { roll: [5, 6], result: 'You recall comprehensive account with context', type: 'normal' },
            { roll: [7, 7], result: 'You understand complex motivations and significance', type: 'success' },
            { roll: [8, 8], result: 'You identify patterns and broader implications', type: 'success' },
            { roll: [9, 9], result: 'You connect this to distant eras and cultures', type: 'success' },
            { roll: [10, 10], result: 'You reveal forgotten perspective that reshapes understanding', type: 'critical' }
        ]
    },
    history_adept_d12: {
        name: 'Adept History (d12)',
        description: 'Adept historical recall on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 2], result: 'You recall basic facts but miss important context', type: 'failure' },
            { roll: [3, 4], result: 'You remember the era and major events', type: 'normal' },
            { roll: [5, 6], result: 'You recall detailed account with timeline', type: 'normal' },
            { roll: [7, 8], result: 'You understand motivations and consequences', type: 'success' },
            { roll: [9, 10], result: 'You identify significance and patterns', type: 'success' },
            { roll: [11, 11], result: 'You connect this to broader historical movements', type: 'success' },
            { roll: [12, 12], result: 'You draw profound insights from multiple perspectives', type: 'critical' }
        ]
    },
    history_adept_d20: {
        name: 'Adept History (d20)',
        description: 'Adept historical recall on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 3], result: 'You recall fragments but struggle to connect them', type: 'failure' },
            { roll: [4, 6], result: 'You remember scattered details and approximate era', type: 'failure' },
            { roll: [7, 9], result: 'You identify the culture and time period', type: 'normal' },
            { roll: [10, 12], result: 'You recall key events with some context', type: 'normal' },
            { roll: [13, 15], result: 'You piece together detailed timeline', type: 'normal' },
            { roll: [16, 17], result: 'You understand motivations and significance', type: 'success' },
            { roll: [18, 18], result: 'You identify patterns across distant eras', type: 'success' },
            { roll: [19, 19], result: 'You reveal forgotten perspective that clarifies events', type: 'critical' },
            { roll: [20, 20], result: 'You synthesize obscure sources into profound insight', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    history_expert_d4: {
        name: 'Expert History (d4)',
        description: 'Expert historical recall on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'You identify patterns across multiple civilizations', type: 'critical' },
            { roll: [3, 3], result: 'You reveal forgotten perspectives that reshape understanding', type: 'critical' },
            { roll: [4, 4], result: 'You draw profound political and moral insights', type: 'critical' }
        ]
    },
    history_expert_d6: {
        name: 'Expert History (d6)',
        description: 'Expert historical recall on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You understand all context and significance', type: 'success' },
            { roll: [3, 4], result: 'You identify repeating patterns across eras', type: 'critical' },
            { roll: [5, 5], result: 'You connect distant civilizations and events', type: 'critical' },
            { roll: [6, 6], result: 'You reveal forgotten truths that change perspective', type: 'critical' }
        ]
    },
    history_expert_d8: {
        name: 'Expert History (d8)',
        description: 'Expert historical recall on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You remember comprehensive details and context', type: 'success' },
            { roll: [3, 4], result: 'You understand complex motivations and outcomes', type: 'success' },
            { roll: [5, 5], result: 'You identify patterns across cultures and eras', type: 'success' },
            { roll: [6, 6], result: 'You reveal forgotten perspectives that clarify truth', type: 'critical' },
            { roll: [7, 7], result: 'You draw profound insights from historical parallels', type: 'critical' },
            { roll: [8, 8], result: 'You synthesize multiple sources into new understanding', type: 'critical' }
        ]
    },
    history_expert_d10: {
        name: 'Expert History (d10)',
        description: 'Expert historical recall on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 2], result: 'You recall comprehensive facts but miss subtle connections', type: 'failure' },
            { roll: [3, 4], result: 'You remember detailed timeline and all participants', type: 'normal' },
            { roll: [5, 6], result: 'You understand complex motivations and context', type: 'success' },
            { roll: [7, 7], result: 'You identify significance and broader patterns', type: 'success' },
            { roll: [8, 8], result: 'You connect this to distant eras and cultures', type: 'success' },
            { roll: [9, 9], result: 'You reveal forgotten perspective that reshapes understanding', type: 'critical' },
            { roll: [10, 10], result: 'You draw profound insights from multiple civilizations', type: 'critical' }
        ]
    },
    history_expert_d12: {
        name: 'Expert History (d12)',
        description: 'Expert historical recall on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 2], result: 'You recall solid facts but lack some depth', type: 'failure' },
            { roll: [3, 4], result: 'You remember the era and major events', type: 'normal' },
            { roll: [5, 6], result: 'You recall detailed account with context', type: 'normal' },
            { roll: [7, 8], result: 'You understand motivations and significance', type: 'success' },
            { roll: [9, 10], result: 'You identify patterns across eras and cultures', type: 'success' },
            { roll: [11, 11], result: 'You reveal forgotten perspectives that clarify events', type: 'success' },
            { roll: [12, 12], result: 'You synthesize obscure sources into profound insight', type: 'critical' }
        ]
    },
    history_expert_d20: {
        name: 'Expert History (d20)',
        description: 'Expert historical recall on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 3], result: 'You recall scattered details but struggle with connections', type: 'failure' },
            { roll: [4, 6], result: 'You remember fragments and approximate era', type: 'failure' },
            { roll: [7, 9], result: 'You identify the culture and time period', type: 'normal' },
            { roll: [10, 12], result: 'You recall key events with context', type: 'normal' },
            { roll: [13, 15], result: 'You piece together detailed account', type: 'normal' },
            { roll: [16, 17], result: 'You understand motivations and significance', type: 'success' },
            { roll: [18, 18], result: 'You identify patterns across distant civilizations', type: 'success' },
            { roll: [19, 19], result: 'You reveal forgotten perspectives that reshape understanding', type: 'critical' },
            { roll: [20, 20], result: 'You synthesize obscure sources into transformative insight', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    history_master_d4: {
        name: 'Master History (d4)',
        description: 'Master historical recall on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'You identify universal patterns that transcend cultures', type: 'critical' },
            { roll: [3, 3], result: 'You reveal forgotten truths that redefine understanding', type: 'critical' },
            { roll: [4, 4], result: 'You draw transformative insights from the entire span of history', type: 'critical' }
        ]
    },
    history_master_d6: {
        name: 'Master History (d6)',
        description: 'Master historical recall on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'You understand patterns across all civilizations', type: 'critical' },
            { roll: [3, 4], result: 'You connect distant eras and reveal hidden parallels', type: 'critical' },
            { roll: [5, 5], result: 'You reveal forgotten perspectives that transform understanding', type: 'critical' },
            { roll: [6, 6], result: 'You draw profound insights that predict current behavior', type: 'critical' }
        ]
    },
    history_master_d8: {
        name: 'Master History (d8)',
        description: 'Master historical recall on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You understand all context and significance', type: 'success' },
            { roll: [3, 4], result: 'You identify repeating patterns across civilizations', type: 'critical' },
            { roll: [5, 5], result: 'You connect distant eras and cultures', type: 'critical' },
            { roll: [6, 6], result: 'You reveal forgotten truths that reshape perspective', type: 'critical' },
            { roll: [7, 7], result: 'You draw transformative insights from historical parallels', type: 'critical' },
            { roll: [8, 8], result: 'You synthesize all sources into revolutionary understanding', type: 'critical' }
        ]
    },
    history_master_d10: {
        name: 'Master History (d10)',
        description: 'Master historical recall on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 2], result: 'You recall detailed account with minor gaps', type: 'normal' },
            { roll: [3, 4], result: 'You remember comprehensive details and context', type: 'success' },
            { roll: [5, 6], result: 'You understand complex motivations and outcomes', type: 'success' },
            { roll: [7, 7], result: 'You identify patterns across distant civilizations', type: 'success' },
            { roll: [8, 8], result: 'You reveal forgotten perspectives that clarify truth', type: 'critical' },
            { roll: [9, 9], result: 'You draw profound insights from multiple eras', type: 'critical' },
            { roll: [10, 10], result: 'You synthesize obscure sources into transformative understanding', type: 'critical' }
        ]
    },
    history_master_d12: {
        name: 'Master History (d12)',
        description: 'Master historical recall on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 2], result: 'You recall comprehensive facts but miss subtle nuance', type: 'failure' },
            { roll: [3, 4], result: 'You remember detailed timeline and all participants', type: 'normal' },
            { roll: [5, 6], result: 'You understand complex motivations and context', type: 'success' },
            { roll: [7, 8], result: 'You identify significance and broader patterns', type: 'success' },
            { roll: [9, 10], result: 'You connect this to distant eras and cultures', type: 'success' },
            { roll: [11, 11], result: 'You reveal forgotten perspectives that reshape understanding', type: 'critical' },
            { roll: [12, 12], result: 'You draw transformative insights from the entire span of history', type: 'critical' }
        ]
    },
    history_master_d20: {
        name: 'Master History (d20)',
        description: 'Master historical recall on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 3], result: 'You recall fragments but struggle to synthesize them', type: 'failure' },
            { roll: [4, 6], result: 'You remember scattered details and approximate era', type: 'failure' },
            { roll: [7, 9], result: 'You identify the culture and time period', type: 'normal' },
            { roll: [10, 12], result: 'You recall key events with context', type: 'normal' },
            { roll: [13, 15], result: 'You piece together comprehensive account', type: 'normal' },
            { roll: [16, 17], result: 'You understand motivations and significance', type: 'success' },
            { roll: [18, 18], result: 'You identify universal patterns across all civilizations', type: 'success' },
            { roll: [19, 19], result: 'You reveal forgotten truths that redefine understanding', type: 'critical' },
            { roll: [20, 20], result: 'You synthesize all sources into revolutionary insight that predicts the future', type: 'critical' }
        ]
    }
};

