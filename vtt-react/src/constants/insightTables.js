// Insight Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total

export const INSIGHT_TABLES = {
    // UNTRAINED - d4 through d20
    insight_untrained_d4: {
        name: 'Untrained Insight (d4)',
        description: 'Untrained insight on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You misread their intentions, believe the opposite', type: 'failure' },
            { roll: [2, 2], result: 'Their body language confuses you, uncertain', type: 'normal' },
            { roll: [3, 3], result: 'You sense basic honesty or dishonesty', type: 'success' },
            { roll: [4, 4], result: 'Despite inexperience, you read their true intent', type: 'success' }
        ]
    },
    insight_untrained_d6: {
        name: 'Untrained Insight (d6)',
        description: 'Untrained insight on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You completely misread them, believe lies', type: 'failure' },
            { roll: [2, 2], result: 'Their signals confuse you, wrong conclusion', type: 'failure' },
            { roll: [3, 3], result: 'You can\'t tell truth from lies', type: 'normal' },
            { roll: [4, 4], result: 'Uncertain reading, vague impressions', type: 'normal' },
            { roll: [5, 5], result: 'You sense their basic intentions', type: 'success' },
            { roll: [6, 6], result: 'You detect simple deception', type: 'success' }
        ]
    },
    insight_untrained_d8: {
        name: 'Untrained Insight (d8)',
        description: 'Untrained insight on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You believe the opposite of truth, completely fooled', type: 'failure' },
            { roll: [2, 2], result: 'Their lies seem convincing, you trust them', type: 'failure' },
            { roll: [3, 3], result: 'You misread all their signals', type: 'failure' },
            { roll: [4, 4], result: 'Your inexperience shows, no useful reading', type: 'failure' },
            { roll: [5, 5], result: 'You barely sense anything, confused', type: 'normal' },
            { roll: [6, 6], result: 'Uncertain impressions, can\'t be sure', type: 'normal' },
            { roll: [7, 7], result: 'You sense basic honesty or dishonesty', type: 'success' },
            { roll: [8, 8], result: 'Lucky read, you detect their intent', type: 'success' }
        ]
    },
    insight_untrained_d10: {
        name: 'Untrained Insight (d10)',
        description: 'Untrained insight on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You believe exactly the wrong thing, dangerous misread', type: 'failure' },
            { roll: [2, 3], result: 'Their deception completely fools you', type: 'failure' },
            { roll: [4, 5], result: 'You misread all signals, wrong conclusions', type: 'failure' },
            { roll: [6, 6], result: 'Your inexperience leads you astray', type: 'failure' },
            { roll: [7, 7], result: 'You sense nothing useful, confused', type: 'normal' },
            { roll: [8, 8], result: 'Vague impressions, uncertain', type: 'normal' },
            { roll: [9, 9], result: 'You stumble onto truth, sense basic intent', type: 'success' },
            { roll: [10, 10], result: 'Surprising read, you detect deception', type: 'success' }
        ]
    },
    insight_untrained_d12: {
        name: 'Untrained Insight (d12)',
        description: 'Untrained insight on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You completely fail to read them, believe opposite of truth', type: 'failure' },
            { roll: [3, 4], result: 'Their lies seem like absolute truth to you', type: 'failure' },
            { roll: [5, 6], result: 'You misread everything, dangerous conclusions', type: 'failure' },
            { roll: [7, 8], result: 'Your inexperience makes you gullible', type: 'failure' },
            { roll: [9, 9], result: 'You sense nothing, completely confused', type: 'failure' },
            { roll: [10, 10], result: 'Vague uncertain feelings, no clarity', type: 'normal' },
            { roll: [11, 11], result: 'You barely sense basic honesty or dishonesty', type: 'success' },
            { roll: [12, 12], result: 'Against odds, you detect their intent', type: 'success' }
        ]
    },
    insight_untrained_d20: {
        name: 'Untrained Insight (d20)',
        description: 'Untrained insight on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'You completely misunderstand, believe opposite of truth', type: 'failure' },
            { roll: [4, 6], result: 'Their deception is perfect to you, completely fooled', type: 'failure' },
            { roll: [7, 9], result: 'You misread everything, dangerous misunderstanding', type: 'failure' },
            { roll: [10, 12], result: 'Your reading is laughably wrong', type: 'failure' },
            { roll: [13, 15], result: 'You sense nothing useful, completely lost', type: 'failure' },
            { roll: [16, 17], result: 'Your inexperience is painfully obvious', type: 'failure' },
            { roll: [18, 18], result: 'You barely sense anything through luck', type: 'normal' },
            { roll: [19, 19], result: 'Miraculous insight, you sense basic intent', type: 'success' },
            { roll: [20, 20], result: 'Impossible read, you detect their deception', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    insight_novice_d4: {
        name: 'Novice Insight (d4)',
        description: 'Novice insight on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You sense their surface emotions clearly', type: 'normal' },
            { roll: [2, 2], result: 'You detect lies and know their basic motivation', type: 'success' },
            { roll: [3, 3], result: 'You read their intentions and immediate plans', type: 'success' },
            { roll: [4, 4], result: 'You understand their desires and fears', type: 'success' }
        ]
    },
    insight_novice_d6: {
        name: 'Novice Insight (d6)',
        description: 'Novice insight on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misread subtle cues, wrong impression', type: 'failure' },
            { roll: [2, 2], result: 'Their emotions confuse you, uncertain', type: 'failure' },
            { roll: [3, 3], result: 'You sense basic honesty or dishonesty', type: 'normal' },
            { roll: [4, 4], result: 'You detect their surface emotions', type: 'normal' },
            { roll: [5, 5], result: 'You read their intentions clearly', type: 'success' },
            { roll: [6, 6], result: 'You know their motivations and detect all lies', type: 'success' }
        ]
    },
    insight_novice_d8: {
        name: 'Novice Insight (d8)',
        description: 'Novice insight on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misread them completely, wrong conclusion', type: 'failure' },
            { roll: [2, 2], result: 'Their deception works, you believe lies', type: 'failure' },
            { roll: [3, 3], result: 'You sense confusion, can\'t read clearly', type: 'normal' },
            { roll: [4, 4], result: 'Vague impressions, uncertain reading', type: 'normal' },
            { roll: [5, 5], result: 'You detect basic honesty or dishonesty', type: 'normal' },
            { roll: [6, 6], result: 'You sense their true intentions', type: 'success' },
            { roll: [7, 7], result: 'You read their motivations and detect lies', type: 'success' },
            { roll: [8, 8], result: 'You understand their desires and fears', type: 'critical' }
        ]
    },
    insight_novice_d10: {
        name: 'Novice Insight (d10)',
        description: 'Novice insight on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You completely misread them, dangerous error', type: 'failure' },
            { roll: [2, 2], result: 'Their lies fool you completely', type: 'failure' },
            { roll: [3, 3], result: 'You sense nothing useful, confused', type: 'failure' },
            { roll: [4, 4], result: 'Your reading is unclear, uncertain', type: 'failure' },
            { roll: [5, 5], result: 'Vague impressions, can\'t be sure', type: 'normal' },
            { roll: [6, 6], result: 'You barely sense their emotions', type: 'normal' },
            { roll: [7, 7], result: 'You detect basic honesty or dishonesty', type: 'success' },
            { roll: [8, 8], result: 'You read their intentions', type: 'success' },
            { roll: [9, 9], result: 'You know their motivations and detect lies', type: 'success' },
            { roll: [10, 10], result: 'You understand their desires and fears', type: 'critical' }
        ]
    },
    insight_novice_d12: {
        name: 'Novice Insight (d12)',
        description: 'Novice insight on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'You fail to read them, believe opposite of truth', type: 'failure' },
            { roll: [3, 4], result: 'Their deception is perfect, you trust lies', type: 'failure' },
            { roll: [5, 6], result: 'You misread everything, wrong conclusions', type: 'failure' },
            { roll: [7, 7], result: 'You sense nothing useful', type: 'failure' },
            { roll: [8, 8], result: 'Vague uncertain impressions', type: 'normal' },
            { roll: [9, 9], result: 'You barely sense their emotions', type: 'normal' },
            { roll: [10, 10], result: 'You detect basic honesty or dishonesty', type: 'success' },
            { roll: [11, 11], result: 'You read their intentions', type: 'success' },
            { roll: [12, 12], result: 'You know their motivations', type: 'critical' }
        ]
    },
    insight_novice_d20: {
        name: 'Novice Insight (d20)',
        description: 'Novice insight on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'You completely fail, believe opposite of truth', type: 'failure' },
            { roll: [4, 6], result: 'Their lies are perfect to you, completely fooled', type: 'failure' },
            { roll: [7, 9], result: 'You misread everything, dangerous error', type: 'failure' },
            { roll: [10, 12], result: 'Your reading is wrong, bad conclusions', type: 'failure' },
            { roll: [13, 15], result: 'You sense nothing useful, lost', type: 'failure' },
            { roll: [16, 16], result: 'Vague impressions, uncertain', type: 'normal' },
            { roll: [17, 17], result: 'You barely sense their emotions', type: 'normal' },
            { roll: [18, 18], result: 'You detect basic honesty or dishonesty', type: 'success' },
            { roll: [19, 19], result: 'You read their intentions', type: 'success' },
            { roll: [20, 20], result: 'Miraculous insight, you know their motivations', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    insight_trained_d4: {
        name: 'Trained Insight (d4)',
        description: 'Trained insight on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You read their thoughts and know all lies', type: 'normal' },
            { roll: [2, 2], result: 'You understand their deepest motivations and predict actions', type: 'success' },
            { roll: [3, 3], result: 'You see their past experiences shaping current behavior', type: 'success' },
            { roll: [4, 4], result: 'You know their secrets and hidden agendas', type: 'success' }
        ]
    },
    insight_trained_d6: {
        name: 'Trained Insight (d6)',
        description: 'Trained insight on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You struggle with complex emotions, partial read', type: 'failure' },
            { roll: [2, 2], result: 'You sense their intentions but miss details', type: 'normal' },
            { roll: [3, 3], result: 'You read their motivations clearly', type: 'success' },
            { roll: [4, 4], result: 'You detect all lies and know their fears', type: 'success' },
            { roll: [5, 5], result: 'You understand their desires and predict actions', type: 'critical' },
            { roll: [6, 6], result: 'You see their past and know all secrets', type: 'critical' }
        ]
    },
    insight_trained_d8: {
        name: 'Trained Insight (d8)',
        description: 'Trained insight on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You misread complex signals, wrong impression', type: 'failure' },
            { roll: [2, 2], result: 'Their emotions are unclear, confused reading', type: 'failure' },
            { roll: [3, 3], result: 'You sense basic intentions', type: 'normal' },
            { roll: [4, 4], result: 'You detect their motivations', type: 'normal' },
            { roll: [5, 5], result: 'You read them clearly, know all lies', type: 'success' },
            { roll: [6, 6], result: 'You understand their fears and desires', type: 'success' },
            { roll: [7, 7], result: 'You predict their actions and know secrets', type: 'success' },
            { roll: [8, 8], result: 'You see their past experiences clearly', type: 'critical' }
        ]
    },
    insight_trained_d10: {
        name: 'Trained Insight (d10)',
        description: 'Trained insight on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'The complexity overwhelms you, wrong read', type: 'failure' },
            { roll: [2, 2], result: 'You misread them, believe lies', type: 'failure' },
            { roll: [3, 3], result: 'Their emotions confuse you', type: 'failure' },
            { roll: [4, 4], result: 'Vague impressions, uncertain', type: 'normal' },
            { roll: [5, 5], result: 'You sense basic intentions', type: 'normal' },
            { roll: [6, 6], result: 'You detect their motivations', type: 'normal' },
            { roll: [7, 7], result: 'You read them clearly, detect all lies', type: 'success' },
            { roll: [8, 8], result: 'You know their fears and desires', type: 'success' },
            { roll: [9, 9], result: 'You predict their actions', type: 'success' },
            { roll: [10, 10], result: 'You see their past and know secrets', type: 'critical' }
        ]
    },
    insight_trained_d12: {
        name: 'Trained Insight (d12)',
        description: 'Trained insight on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'You fail to read them, believe opposite', type: 'failure' },
            { roll: [3, 4], result: 'Their deception works, you trust lies', type: 'failure' },
            { roll: [5, 6], result: 'You misread signals, wrong conclusions', type: 'failure' },
            { roll: [7, 7], result: 'Vague uncertain impressions', type: 'normal' },
            { roll: [8, 8], result: 'You sense basic intentions', type: 'normal' },
            { roll: [9, 9], result: 'You detect their motivations', type: 'normal' },
            { roll: [10, 10], result: 'You read them clearly, detect lies', type: 'success' },
            { roll: [11, 11], result: 'You know their fears and desires', type: 'success' },
            { roll: [12, 12], result: 'You predict their actions', type: 'critical' }
        ]
    },
    insight_trained_d20: {
        name: 'Trained Insight (d20)',
        description: 'Trained insight on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 3], result: 'You completely fail, believe opposite of truth', type: 'failure' },
            { roll: [4, 5], result: 'Their lies fool you completely', type: 'failure' },
            { roll: [6, 8], result: 'You misread everything, dangerous error', type: 'normal' },
            { roll: [9, 10], result: 'Vague impressions, uncertain', type: 'normal' },
            { roll: [11, 13], result: 'You sense basic intentions', type: 'success' },
            { roll: [14, 16], result: 'You detect their motivations and lies', type: 'success' },
            { roll: [17, 18], result: 'You know their fears and desires', type: 'success' },
            { roll: [19, 19], result: 'You predict their actions', type: 'critical' },
            { roll: [20, 20], result: 'You see their past and know secrets', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    insight_apprentice_d4: {
        name: 'Apprentice Insight (d4)',
        description: 'Apprentice insight on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You read their soul, know all thoughts and secrets', type: 'normal' },
            { roll: [2, 2], result: 'You see their entire past and predict all future actions', type: 'success' },
            { roll: [3, 3], result: 'You understand their deepest self, can manipulate perfectly', type: 'success' },
            { roll: [4, 4], result: 'You know them better than they know themselves', type: 'success' }
        ]
    },
    insight_apprentice_d6: {
        name: 'Apprentice Insight (d6)',
        description: 'Apprentice insight on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You sense surface thoughts and emotions', type: 'normal' },
            { roll: [2, 2], result: 'You read their mind, know all lies and secrets', type: 'success' },
            { roll: [3, 3], result: 'You see their past and predict actions', type: 'success' },
            { roll: [4, 4], result: 'You understand their soul completely', type: 'success' },
            { roll: [5, 5], result: 'You know all thoughts and can manipulate them', type: 'critical' },
            { roll: [6, 6], result: 'You know them better than they know themselves', type: 'critical' }
        ]
    },
    insight_apprentice_d8: {
        name: 'Apprentice Insight (d8)',
        description: 'Apprentice insight on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Complex emotions confuse you slightly', type: 'failure' },
            { roll: [2, 2], result: 'You read their intentions and motivations', type: 'normal' },
            { roll: [3, 3], result: 'You detect all lies and know fears', type: 'normal' },
            { roll: [4, 4], result: 'You understand their desires and secrets', type: 'normal' },
            { roll: [5, 5], result: 'You read their mind and predict actions', type: 'success' },
            { roll: [6, 6], result: 'You see their past clearly', type: 'success' },
            { roll: [7, 7], result: 'You understand their soul', type: 'success' },
            { roll: [8, 8], result: 'You know all thoughts and can manipulate them', type: 'critical' }
        ]
    },
    insight_apprentice_d10: {
        name: 'Apprentice Insight (d10)',
        description: 'Apprentice insight on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'The challenge is difficult, partial read', type: 'failure' },
            { roll: [2, 2], result: 'You struggle slightly, vague impressions', type: 'failure' },
            { roll: [3, 3], result: 'You sense their intentions', type: 'normal' },
            { roll: [4, 4], result: 'You detect their motivations and lies', type: 'normal' },
            { roll: [5, 5], result: 'You know their fears and desires', type: 'normal' },
            { roll: [6, 6], result: 'You read their mind and secrets', type: 'success' },
            { roll: [7, 7], result: 'You predict their actions', type: 'success' },
            { roll: [8, 8], result: 'You see their past', type: 'success' },
            { roll: [9, 9], result: 'You understand their soul', type: 'success' },
            { roll: [10, 10], result: 'You know all thoughts', type: 'critical' }
        ]
    },
    insight_apprentice_d12: {
        name: 'Apprentice Insight (d12)',
        description: 'Apprentice insight on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 2], result: 'The task is formidable, unclear reading', type: 'failure' },
            { roll: [3, 4], result: 'You struggle to read them clearly', type: 'failure' },
            { roll: [5, 6], result: 'You sense basic intentions', type: 'normal' },
            { roll: [7, 7], result: 'You detect their motivations', type: 'normal' },
            { roll: [8, 8], result: 'You know their fears and desires', type: 'normal' },
            { roll: [9, 9], result: 'You read their mind, detect all lies', type: 'success' },
            { roll: [10, 10], result: 'You predict their actions', type: 'success' },
            { roll: [11, 11], result: 'You see their past', type: 'success' },
            { roll: [12, 12], result: 'You understand their soul', type: 'critical' }
        ]
    },
    insight_apprentice_d20: {
        name: 'Apprentice Insight (d20)',
        description: 'Apprentice insight on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 3], result: 'Even your skill struggles, wrong impression', type: 'failure' },
            { roll: [4, 5], result: 'You make minimal progress, vague read', type: 'failure' },
            { roll: [6, 8], result: 'You sense basic intentions', type: 'normal' },
            { roll: [9, 10], result: 'You detect their motivations', type: 'normal' },
            { roll: [11, 13], result: 'You know their fears and desires', type: 'success' },
            { roll: [14, 16], result: 'You read their mind, detect lies', type: 'success' },
            { roll: [17, 18], result: 'You predict their actions', type: 'success' },
            { roll: [19, 19], result: 'You see their past', type: 'critical' },
            { roll: [20, 20], result: 'You understand their soul', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    insight_adept_d4: {
        name: 'Adept Insight (d4)',
        description: 'Adept insight on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You experience their memories as your own', type: 'success' },
            { roll: [2, 2], result: 'You see all possible futures for them', type: 'critical' },
            { roll: [3, 3], result: 'You can rewrite their memories and personality', type: 'critical' },
            { roll: [4, 4], result: 'You alter their destiny with a thought', type: 'critical' }
        ]
    },
    insight_adept_d6: {
        name: 'Adept Insight (d6)',
        description: 'Adept insight on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You read their soul completely', type: 'normal' },
            { roll: [2, 2], result: 'You know all thoughts and can manipulate them', type: 'success' },
            { roll: [3, 3], result: 'You experience their memories', type: 'success' },
            { roll: [4, 4], result: 'You see all possible futures', type: 'success' },
            { roll: [5, 5], result: 'You can rewrite their memories', type: 'critical' },
            { roll: [6, 6], result: 'You alter their destiny', type: 'critical' }
        ]
    },
    insight_adept_d8: {
        name: 'Adept Insight (d8)',
        description: 'Adept insight on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor challenge, partial soul reading', type: 'failure' },
            { roll: [2, 2], result: 'You read their mind completely', type: 'normal' },
            { roll: [3, 3], result: 'You know all thoughts and secrets', type: 'normal' },
            { roll: [4, 4], result: 'You can manipulate their thoughts', type: 'normal' },
            { roll: [5, 5], result: 'You understand their soul', type: 'success' },
            { roll: [6, 6], result: 'You experience their memories', type: 'success' },
            { roll: [7, 7], result: 'You see all possible futures', type: 'success' },
            { roll: [8, 8], result: 'You can rewrite their memories', type: 'critical' }
        ]
    },
    insight_adept_d10: {
        name: 'Adept Insight (d10)',
        description: 'Adept insight on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'The challenge is formidable, unclear read', type: 'failure' },
            { roll: [2, 2], result: 'You make excellent progress, partial reading', type: 'failure' },
            { roll: [3, 3], result: 'You read their mind', type: 'normal' },
            { roll: [4, 4], result: 'You know all thoughts', type: 'normal' },
            { roll: [5, 6], result: 'You understand their soul', type: 'success' },
            { roll: [7, 8], result: 'You experience their memories', type: 'success' },
            { roll: [9, 9], result: 'You see all possible futures', type: 'success' },
            { roll: [10, 10], result: 'You can rewrite their memories', type: 'critical' }
        ]
    },
    insight_adept_d12: {
        name: 'Adept Insight (d12)',
        description: 'Adept insight on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'The task is formidable, vague impressions', type: 'failure' },
            { roll: [2, 2], result: 'You struggle slightly, partial read', type: 'failure' },
            { roll: [3, 3], result: 'You sense their thoughts', type: 'normal' },
            { roll: [4, 4], result: 'You read their mind', type: 'normal' },
            { roll: [5, 6], result: 'You know all thoughts', type: 'normal' },
            { roll: [7, 8], result: 'You understand their soul', type: 'success' },
            { roll: [9, 9], result: 'You experience their memories', type: 'success' },
            { roll: [10, 10], result: 'You see all possible futures', type: 'success' },
            { roll: [11, 11], result: 'You can rewrite their memories', type: 'critical' },
            { roll: [12, 12], result: 'You alter their destiny', type: 'critical' }
        ]
    },
    insight_adept_d20: {
        name: 'Adept Insight (d20)',
        description: 'Adept insight on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 3], result: 'Even your mastery struggles, unclear', type: 'failure' },
            { roll: [4, 5], result: 'You make minimal progress, vague read', type: 'failure' },
            { roll: [6, 8], result: 'You sense their thoughts', type: 'normal' },
            { roll: [9, 10], result: 'You read their mind', type: 'normal' },
            { roll: [11, 13], result: 'You know all thoughts', type: 'success' },
            { roll: [14, 16], result: 'You understand their soul', type: 'success' },
            { roll: [17, 18], result: 'You experience their memories', type: 'success' },
            { roll: [19, 19], result: 'You see all possible futures', type: 'critical' },
            { roll: [20, 20], result: 'You can rewrite their memories', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    insight_expert_d4: {
        name: 'Expert Insight (d4)',
        description: 'Expert insight on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You perceive cosmic truths through them', type: 'success' },
            { roll: [2, 2], result: 'You see all timelines and realities for them', type: 'critical' },
            { roll: [3, 3], result: 'You merge consciousness, become one being', type: 'critical' },
            { roll: [4, 4], result: 'You achieve perfect understanding of all minds nearby', type: 'critical' }
        ]
    },
    insight_expert_d6: {
        name: 'Expert Insight (d6)',
        description: 'Expert insight on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You experience their memories completely', type: 'normal' },
            { roll: [2, 2], result: 'You see all possible futures', type: 'success' },
            { roll: [3, 3], result: 'You rewrite their memories and destiny', type: 'success' },
            { roll: [4, 4], result: 'You perceive cosmic truths', type: 'success' },
            { roll: [5, 5], result: 'You see all timelines and realities', type: 'critical' },
            { roll: [6, 6], result: 'You merge consciousness with them', type: 'critical' }
        ]
    },
    insight_expert_d8: {
        name: 'Expert Insight (d8)',
        description: 'Expert insight on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor setback, partial soul reading', type: 'failure' },
            { roll: [2, 2], result: 'You understand their soul', type: 'normal' },
            { roll: [3, 3], result: 'You experience their memories', type: 'normal' },
            { roll: [4, 4], result: 'You see all possible futures', type: 'normal' },
            { roll: [5, 5], result: 'You can rewrite their memories', type: 'success' },
            { roll: [6, 6], result: 'You alter their destiny', type: 'success' },
            { roll: [7, 7], result: 'You perceive cosmic truths', type: 'success' },
            { roll: [8, 8], result: 'You see all timelines and realities', type: 'critical' }
        ]
    },
    insight_expert_d10: {
        name: 'Expert Insight (d10)',
        description: 'Expert insight on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'The challenge is formidable, partial read', type: 'failure' },
            { roll: [2, 2], result: 'You make excellent progress, unclear', type: 'failure' },
            { roll: [3, 3], result: 'You understand their soul', type: 'normal' },
            { roll: [4, 4], result: 'You experience their memories', type: 'normal' },
            { roll: [5, 6], result: 'You see all possible futures', type: 'success' },
            { roll: [7, 8], result: 'You can rewrite their memories', type: 'success' },
            { roll: [9, 9], result: 'You perceive cosmic truths', type: 'success' },
            { roll: [10, 10], result: 'You see all timelines and realities', type: 'critical' }
        ]
    },
    insight_expert_d12: {
        name: 'Expert Insight (d12)',
        description: 'Expert insight on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'The task is formidable, vague impressions', type: 'failure' },
            { roll: [2, 2], result: 'You struggle slightly, partial read', type: 'failure' },
            { roll: [3, 3], result: 'You read their soul', type: 'normal' },
            { roll: [4, 4], result: 'You experience their memories', type: 'normal' },
            { roll: [5, 6], result: 'You see all possible futures', type: 'normal' },
            { roll: [7, 8], result: 'You can rewrite their memories', type: 'success' },
            { roll: [9, 9], result: 'You alter their destiny', type: 'success' },
            { roll: [10, 10], result: 'You perceive cosmic truths', type: 'success' },
            { roll: [11, 11], result: 'You see all timelines and realities', type: 'critical' },
            { roll: [12, 12], result: 'You merge consciousness with them', type: 'critical' }
        ]
    },
    insight_expert_d20: {
        name: 'Expert Insight (d20)',
        description: 'Expert insight on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 3], result: 'Even your legendary mastery is tested, unclear', type: 'failure' },
            { roll: [4, 5], result: 'You make slow progress, vague read', type: 'failure' },
            { roll: [6, 8], result: 'You understand their soul', type: 'normal' },
            { roll: [9, 10], result: 'You experience their memories', type: 'normal' },
            { roll: [11, 13], result: 'You see all possible futures', type: 'success' },
            { roll: [14, 16], result: 'You can rewrite their memories', type: 'success' },
            { roll: [17, 18], result: 'You perceive cosmic truths', type: 'success' },
            { roll: [19, 19], result: 'You see all timelines and realities', type: 'critical' },
            { roll: [20, 20], result: 'You merge consciousness with them', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    insight_master_d4: {
        name: 'Master Insight (d4)',
        description: 'Master insight on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You achieve cosmic awareness, know all minds nearby', type: 'success' },
            { roll: [2, 2], result: 'You see all timelines across all realities', type: 'critical' },
            { roll: [3, 3], result: 'You merge with universal consciousness', type: 'critical' },
            { roll: [4, 4], result: 'You transcend individual thought, become omniscient', type: 'critical' }
        ]
    },
    insight_master_d6: {
        name: 'Master Insight (d6)',
        description: 'Master insight on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You see all possible futures and realities', type: 'normal' },
            { roll: [2, 2], result: 'You perceive cosmic truths', type: 'success' },
            { roll: [3, 3], result: 'You merge consciousness with them', type: 'success' },
            { roll: [4, 4], result: 'You achieve cosmic awareness', type: 'success' },
            { roll: [5, 5], result: 'You see all timelines across all realities', type: 'critical' },
            { roll: [6, 6], result: 'You merge with universal consciousness', type: 'critical' }
        ]
    },
    insight_master_d8: {
        name: 'Master Insight (d8)',
        description: 'Master insight on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor challenge, partial cosmic reading', type: 'failure' },
            { roll: [2, 2], result: 'You can rewrite their memories', type: 'normal' },
            { roll: [3, 3], result: 'You alter their destiny', type: 'normal' },
            { roll: [4, 4], result: 'You perceive cosmic truths', type: 'normal' },
            { roll: [5, 5], result: 'You see all timelines and realities', type: 'success' },
            { roll: [6, 6], result: 'You merge consciousness with them', type: 'success' },
            { roll: [7, 7], result: 'You achieve cosmic awareness', type: 'success' },
            { roll: [8, 8], result: 'You merge with universal consciousness', type: 'critical' }
        ]
    },
    insight_master_d10: {
        name: 'Master Insight (d10)',
        description: 'Master insight on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'The challenge is formidable, partial read', type: 'failure' },
            { roll: [2, 2], result: 'You make excellent progress, unclear', type: 'failure' },
            { roll: [3, 3], result: 'You see all possible futures', type: 'normal' },
            { roll: [4, 4], result: 'You perceive cosmic truths', type: 'normal' },
            { roll: [5, 6], result: 'You merge consciousness with them', type: 'success' },
            { roll: [7, 8], result: 'You achieve cosmic awareness', type: 'success' },
            { roll: [9, 9], result: 'You see all timelines across all realities', type: 'success' },
            { roll: [10, 10], result: 'You merge with universal consciousness', type: 'critical' }
        ]
    },
    insight_master_d12: {
        name: 'Master Insight (d12)',
        description: 'Master insight on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'The task is formidable, vague impressions', type: 'failure' },
            { roll: [2, 2], result: 'You struggle slightly, partial read', type: 'failure' },
            { roll: [3, 3], result: 'You alter their destiny', type: 'normal' },
            { roll: [4, 4], result: 'You perceive cosmic truths', type: 'normal' },
            { roll: [5, 6], result: 'You see all timelines and realities', type: 'normal' },
            { roll: [7, 8], result: 'You merge consciousness with them', type: 'success' },
            { roll: [9, 9], result: 'You achieve cosmic awareness', type: 'success' },
            { roll: [10, 10], result: 'You see all timelines across all realities', type: 'success' },
            { roll: [11, 11], result: 'You merge with universal consciousness', type: 'critical' },
            { roll: [12, 12], result: 'You transcend individual thought, become omniscient', type: 'critical' }
        ]
    },
    insight_master_d20: {
        name: 'Master Insight (d20)',
        description: 'Master insight on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 3], result: 'Even your legendary mastery is tested, unclear', type: 'failure' },
            { roll: [4, 5], result: 'You make slow progress, vague read', type: 'failure' },
            { roll: [6, 8], result: 'You perceive cosmic truths', type: 'normal' },
            { roll: [9, 10], result: 'You see all timelines and realities', type: 'normal' },
            { roll: [11, 13], result: 'You merge consciousness with them', type: 'success' },
            { roll: [14, 16], result: 'You achieve cosmic awareness', type: 'success' },
            { roll: [17, 18], result: 'You see all timelines across all realities', type: 'success' },
            { roll: [19, 19], result: 'You merge with universal consciousness', type: 'critical' },
            { roll: [20, 20], result: 'You transcend individual thought, become omniscient', type: 'critical' }
        ]
    },
};