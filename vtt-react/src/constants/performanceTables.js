// Performance Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total

export const PERFORMANCE_TABLES = {
    // UNTRAINED - d4 through d20
    performance_untrained_d4: {
        name: 'Untrained Performance (d4)',
        description: 'Untrained performance on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You stumble badly, audience cringes', type: 'failure' },
            { roll: [2, 2], result: 'Awkward performance, polite silence', type: 'normal' },
            { roll: [3, 3], result: 'You manage to entertain, light applause', type: 'success' },
            { roll: [4, 4], result: 'Despite inexperience, you charm them, audience smiles', type: 'success' }
        ]
    },
    performance_untrained_d6: {
        name: 'Untrained Performance (d6)',
        description: 'Untrained performance on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'Terrible performance, audience boos', type: 'failure' },
            { roll: [3, 4], result: 'Awkward performance, polite silence', type: 'normal' },
            { roll: [5, 5], result: 'You manage to entertain, light applause', type: 'success' },
            { roll: [6, 6], result: 'Despite inexperience, you charm them, audience smiles', type: 'success' }
        ]
    },
    performance_untrained_d8: {
        name: 'Untrained Performance (d8)',
        description: 'Untrained performance on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'Catastrophic performance, riot breaks out', type: 'failure' },
            { roll: [4, 5], result: 'Terrible performance, audience boos', type: 'failure' },
            { roll: [6, 6], result: 'Awkward performance, polite silence', type: 'normal' },
            { roll: [7, 7], result: 'You manage to entertain, light applause', type: 'success' },
            { roll: [8, 8], result: 'Despite inexperience, you charm them, audience smiles', type: 'success' }
        ]
    },
    performance_untrained_d10: {
        name: 'Untrained Performance (d10)',
        description: 'Untrained performance on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 4], result: 'Catastrophic performance, riot breaks out', type: 'failure' },
            { roll: [5, 7], result: 'Terrible performance, audience boos', type: 'failure' },
            { roll: [8, 8], result: 'Awkward performance, polite silence', type: 'normal' },
            { roll: [9, 9], result: 'You manage to entertain, light applause', type: 'normal' },
            { roll: [10, 10], result: 'Despite inexperience, you charm them, audience smiles', type: 'success' }
        ]
    },
    performance_untrained_d12: {
        name: 'Untrained Performance (d12)',
        description: 'Untrained performance on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 5], result: 'Catastrophic performance, riot breaks out', type: 'failure' },
            { roll: [6, 9], result: 'Terrible performance, audience boos', type: 'failure' },
            { roll: [10, 10], result: 'Awkward performance, polite silence', type: 'normal' },
            { roll: [11, 11], result: 'You manage to entertain, light applause', type: 'normal' },
            { roll: [12, 12], result: 'Despite inexperience, you charm them, audience smiles', type: 'success' }
        ]
    },
    performance_untrained_d20: {
        name: 'Untrained Performance (d20)',
        description: 'Untrained performance on an extremely difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Catastrophic performance, riot breaks out', type: 'failure' },
            { roll: [9, 14], result: 'Terrible performance, audience boos', type: 'failure' },
            { roll: [15, 16], result: 'Awkward performance, polite silence', type: 'normal' },
            { roll: [17, 18], result: 'You manage to entertain, light applause', type: 'normal' },
            { roll: [19, 19], result: 'Despite inexperience, you charm them, audience smiles', type: 'success' },
            { roll: [20, 20], result: 'Miraculous performance, audience is delighted', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    performance_novice_d4: {
        name: 'Novice Performance (d4)',
        description: 'Novice performance on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Failure, attempt unsuccessful', type: 'failure' },
            { roll: [2, 2], result: 'You entertain well, warm applause', type: 'success' },
            { roll: [3, 3], result: 'Excellent performance, standing ovation', type: 'success' },
            { roll: [4, 4], result: 'Audience is moved to tears', type: 'critical' }
        ]
    },
    performance_novice_d6: {
        name: 'Novice Performance (d6)',
        description: 'Novice performance on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Mediocre performance, polite applause', type: 'failure' },
            { roll: [2, 3], result: 'You entertain well, warm applause', type: 'normal' },
            { roll: [4, 5], result: 'Excellent performance, standing ovation', type: 'success' },
            { roll: [6, 6], result: 'Audience is moved to tears', type: 'critical' }
        ]
    },
    performance_novice_d8: {
        name: 'Novice Performance (d8)',
        description: 'Novice performance on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Terrible performance, audience boos', type: 'failure' },
            { roll: [2, 3], result: 'Mediocre performance, polite applause', type: 'failure' },
            { roll: [4, 5], result: 'You entertain well, warm applause', type: 'normal' },
            { roll: [6, 7], result: 'Excellent performance, standing ovation', type: 'success' },
            { roll: [8, 8], result: 'Audience is moved to tears', type: 'critical' }
        ]
    },
    performance_novice_d10: {
        name: 'Novice Performance (d10)',
        description: 'Novice performance on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'Terrible performance, audience boos', type: 'failure' },
            { roll: [3, 5], result: 'Mediocre performance, polite applause', type: 'failure' },
            { roll: [6, 7], result: 'You entertain well, warm applause', type: 'normal' },
            { roll: [8, 9], result: 'Excellent performance, standing ovation', type: 'success' },
            { roll: [10, 10], result: 'Audience is moved to tears', type: 'critical' }
        ]
    },
    performance_novice_d12: {
        name: 'Novice Performance (d12)',
        description: 'Novice performance on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Terrible performance, audience boos', type: 'failure' },
            { roll: [4, 6], result: 'Mediocre performance, polite applause', type: 'failure' },
            { roll: [7, 9], result: 'You entertain well, warm applause', type: 'normal' },
            { roll: [10, 11], result: 'Excellent performance, standing ovation', type: 'success' },
            { roll: [12, 12], result: 'Audience is moved to tears', type: 'critical' }
        ]
    },
    performance_novice_d20: {
        name: 'Novice Performance (d20)',
        description: 'Novice performance on an extremely difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Terrible performance, audience boos', type: 'failure' },
            { roll: [4, 8], result: 'Mediocre performance, polite applause', type: 'failure' },
            { roll: [9, 12], result: 'You entertain well, warm applause', type: 'normal' },
            { roll: [13, 16], result: 'Excellent performance, standing ovation', type: 'normal' },
            { roll: [17, 19], result: 'Audience is moved to tears', type: 'success' },
            { roll: [20, 20], result: 'Legendary performance, audience inspired', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    performance_trained_d4: {
        name: 'Trained Performance (d4)',
        description: 'Trained performance on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Audience is moved to tears', type: 'success' },
            { roll: [3, 3], result: 'Legendary performance, audience inspired + gain fame', type: 'critical' },
            { roll: [4, 4], result: 'Perfect performance, audience transformed + permanent fans', type: 'critical' }
        ]
    },
    performance_trained_d6: {
        name: 'Trained Performance (d6)',
        description: 'Trained performance on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 3], result: 'Excellent performance, standing ovation', type: 'success' },
            { roll: [4, 5], result: 'Audience is moved to tears', type: 'success' },
            { roll: [6, 6], result: 'Legendary performance, audience inspired + gain fame', type: 'critical' }
        ]
    },
    performance_trained_d8: {
        name: 'Trained Performance (d8)',
        description: 'Trained performance on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Boring performance, audience distracted', type: 'failure' },
            { roll: [2, 3], result: 'Good performance, warm applause', type: 'normal' },
            { roll: [4, 5], result: 'Excellent performance, standing ovation', type: 'success' },
            { roll: [6, 7], result: 'Audience is moved to tears', type: 'success' },
            { roll: [8, 8], result: 'Legendary performance, audience inspired + gain fame', type: 'critical' }
        ]
    },
    performance_trained_d10: {
        name: 'Trained Performance (d10)',
        description: 'Trained performance on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Boring performance, audience distracted', type: 'failure' },
            { roll: [3, 4], result: 'Good performance, warm applause', type: 'normal' },
            { roll: [5, 6], result: 'Excellent performance, standing ovation', type: 'normal' },
            { roll: [7, 8], result: 'Audience is moved to tears', type: 'success' },
            { roll: [9, 9], result: 'Legendary performance, audience inspired + gain fame', type: 'success' },
            { roll: [10, 10], result: 'Perfect performance, audience transformed + permanent fans', type: 'critical' }
        ]
    },
    performance_trained_d12: {
        name: 'Trained Performance (d12)',
        description: 'Trained performance on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Boring performance, audience distracted', type: 'failure' },
            { roll: [3, 5], result: 'Good performance, warm applause', type: 'failure' },
            { roll: [6, 8], result: 'Excellent performance, standing ovation', type: 'normal' },
            { roll: [9, 10], result: 'Audience is moved to tears', type: 'success' },
            { roll: [11, 11], result: 'Legendary performance, audience inspired + gain fame', type: 'success' },
            { roll: [12, 12], result: 'Perfect performance, audience transformed + permanent fans', type: 'critical' }
        ]
    },
    performance_trained_d20: {
        name: 'Trained Performance (d20)',
        description: 'Trained performance on an extremely difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Boring performance, audience distracted', type: 'failure' },
            { roll: [3, 7], result: 'Good performance, warm applause', type: 'failure' },
            { roll: [8, 11], result: 'Excellent performance, standing ovation', type: 'normal' },
            { roll: [12, 15], result: 'Audience is moved to tears', type: 'normal' },
            { roll: [16, 18], result: 'Legendary performance, audience inspired + gain fame', type: 'success' },
            { roll: [19, 19], result: 'Perfect performance, audience transformed + permanent fans', type: 'success' },
            { roll: [20, 20], result: 'Mythic performance, audience enlightened + magical effects', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    performance_apprentice_d4: {
        name: 'Apprentice Performance (d4)',
        description: 'Apprentice performance on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Legendary performance, audience inspired + gain fame', type: 'success' },
            { roll: [3, 3], result: 'Perfect performance, audience transformed + permanent fans', type: 'critical' },
            { roll: [4, 4], result: 'Mythic performance, audience enlightened + magical effects', type: 'critical' }
        ]
    },
    performance_apprentice_d6: {
        name: 'Apprentice Performance (d6)',
        description: 'Apprentice performance on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 3], result: 'Audience is moved to tears', type: 'success' },
            { roll: [4, 5], result: 'Legendary performance, audience inspired + gain fame', type: 'success' },
            { roll: [6, 6], result: 'Perfect performance, audience transformed + permanent fans', type: 'critical' }
        ]
    },
    performance_apprentice_d8: {
        name: 'Apprentice Performance (d8)',
        description: 'Apprentice performance on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Good performance, well received', type: 'failure' },
            { roll: [2, 3], result: 'Excellent performance, standing ovation', type: 'normal' },
            { roll: [4, 5], result: 'Audience is moved to tears', type: 'success' },
            { roll: [6, 7], result: 'Legendary performance, audience inspired + gain fame', type: 'success' },
            { roll: [8, 8], result: 'Perfect performance, audience transformed + permanent fans', type: 'critical' }
        ]
    },
    performance_apprentice_d10: {
        name: 'Apprentice Performance (d10)',
        description: 'Apprentice performance on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Good performance, well received', type: 'failure' },
            { roll: [2, 3], result: 'Excellent performance, standing ovation', type: 'normal' },
            { roll: [4, 5], result: 'Audience is moved to tears', type: 'normal' },
            { roll: [6, 7], result: 'Legendary performance, audience inspired + gain fame', type: 'success' },
            { roll: [8, 9], result: 'Perfect performance, audience transformed + permanent fans', type: 'success' },
            { roll: [10, 10], result: 'Mythic performance, audience enlightened + magical effects', type: 'critical' }
        ]
    },
    performance_apprentice_d12: {
        name: 'Apprentice Performance (d12)',
        description: 'Apprentice performance on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Good performance, well received', type: 'failure' },
            { roll: [2, 4], result: 'Excellent performance, standing ovation', type: 'normal' },
            { roll: [5, 7], result: 'Audience is moved to tears', type: 'normal' },
            { roll: [8, 9], result: 'Legendary performance, audience inspired + gain fame', type: 'success' },
            { roll: [10, 11], result: 'Perfect performance, audience transformed + permanent fans', type: 'success' },
            { roll: [12, 12], result: 'Mythic performance, audience enlightened + magical effects', type: 'critical' }
        ]
    },
    performance_apprentice_d20: {
        name: 'Apprentice Performance (d20)',
        description: 'Apprentice performance on an extremely difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Good performance, well received', type: 'failure' },
            { roll: [2, 6], result: 'Excellent performance, standing ovation', type: 'failure' },
            { roll: [7, 10], result: 'Audience is moved to tears', type: 'normal' },
            { roll: [11, 14], result: 'Legendary performance, audience inspired + gain fame', type: 'normal' },
            { roll: [15, 17], result: 'Perfect performance, audience transformed + permanent fans', type: 'success' },
            { roll: [18, 19], result: 'Mythic performance, audience enlightened + magical effects', type: 'success' },
            { roll: [20, 20], result: 'Divine performance, audience blessed + heal all', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    performance_adept_d4: {
        name: 'Adept Performance (d4)',
        description: 'Adept performance on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Perfect performance, audience transformed + permanent fans', type: 'success' },
            { roll: [3, 3], result: 'Mythic performance, audience enlightened + magical effects', type: 'critical' },
            { roll: [4, 4], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'critical' }
        ]
    },
    performance_adept_d6: {
        name: 'Adept Performance (d6)',
        description: 'Adept performance on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 3], result: 'Legendary performance, audience inspired + gain fame', type: 'success' },
            { roll: [4, 5], result: 'Perfect performance, audience transformed + permanent fans', type: 'success' },
            { roll: [6, 6], result: 'Mythic performance, audience enlightened + magical effects', type: 'critical' }
        ]
    },
    performance_adept_d8: {
        name: 'Adept Performance (d8)',
        description: 'Adept performance on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Excellent performance, standing ovation', type: 'failure' },
            { roll: [2, 3], result: 'Audience is moved to tears', type: 'normal' },
            { roll: [4, 5], result: 'Legendary performance, audience inspired + gain fame', type: 'success' },
            { roll: [6, 7], result: 'Perfect performance, audience transformed + permanent fans', type: 'success' },
            { roll: [8, 8], result: 'Mythic performance, audience enlightened + magical effects', type: 'critical' }
        ]
    },
    performance_adept_d10: {
        name: 'Adept Performance (d10)',
        description: 'Adept performance on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Excellent performance, standing ovation', type: 'failure' },
            { roll: [2, 3], result: 'Audience is moved to tears', type: 'normal' },
            { roll: [4, 5], result: 'Legendary performance, audience inspired + gain fame', type: 'normal' },
            { roll: [6, 7], result: 'Perfect performance, audience transformed + permanent fans', type: 'success' },
            { roll: [8, 9], result: 'Mythic performance, audience enlightened + magical effects', type: 'success' },
            { roll: [10, 10], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'critical' }
        ]
    },
    performance_adept_d12: {
        name: 'Adept Performance (d12)',
        description: 'Adept performance on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Excellent performance, standing ovation', type: 'failure' },
            { roll: [2, 3], result: 'Audience is moved to tears', type: 'failure' },
            { roll: [4, 6], result: 'Legendary performance, audience inspired + gain fame', type: 'normal' },
            { roll: [7, 9], result: 'Perfect performance, audience transformed + permanent fans', type: 'success' },
            { roll: [10, 11], result: 'Mythic performance, audience enlightened + magical effects', type: 'success' },
            { roll: [12, 12], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'critical' }
        ]
    },
    performance_adept_d20: {
        name: 'Adept Performance (d20)',
        description: 'Adept performance on an extremely difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 3], result: 'Even your mastery struggles with this challenge', type: 'failure' },
            { roll: [4, 5], result: 'You make minimal progress despite your skill', type: 'failure' },
            { roll: [6, 8], result: 'Legendary performance, audience inspired + gain fame', type: 'normal' },
            { roll: [9, 10], result: 'Perfect performance, audience transformed + permanent fans', type: 'normal' },
            { roll: [11, 13], result: 'Mythic performance, audience enlightened + magical effects', type: 'success' },
            { roll: [14, 16], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'success' },
            { roll: [17, 19], result: 'Ultimate performance, audience ascended + become immortal legend', type: 'critical' },
            { roll: [20, 20], result: 'Cosmic performance, reality altered + your art becomes law', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    performance_expert_d4: {
        name: 'Expert Performance (d4)',
        description: 'Expert performance on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Mythic performance, audience enlightened + magical effects', type: 'success' },
            { roll: [3, 3], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'critical' },
            { roll: [4, 4], result: 'Ultimate performance, audience ascended + become immortal legend', type: 'critical' }
        ]
    },
    performance_expert_d6: {
        name: 'Expert Performance (d6)',
        description: 'Expert performance on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 3], result: 'Perfect performance, audience transformed + permanent fans', type: 'success' },
            { roll: [4, 5], result: 'Mythic performance, audience enlightened + magical effects', type: 'success' },
            { roll: [6, 6], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'critical' }
        ]
    },
    performance_expert_d8: {
        name: 'Expert Performance (d8)',
        description: 'Expert performance on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Legendary performance, deeply moving', type: 'failure' },
            { roll: [2, 3], result: 'Perfect performance, audience transformed + permanent fans', type: 'normal' },
            { roll: [4, 5], result: 'Mythic performance, audience enlightened + magical effects', type: 'success' },
            { roll: [6, 7], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'success' },
            { roll: [8, 8], result: 'Ultimate performance, audience ascended + become immortal legend', type: 'critical' }
        ]
    },
    performance_expert_d10: {
        name: 'Expert Performance (d10)',
        description: 'Expert performance on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Legendary performance, deeply moving', type: 'failure' },
            { roll: [2, 3], result: 'Perfect performance, audience transformed + permanent fans', type: 'normal' },
            { roll: [4, 5], result: 'Mythic performance, audience enlightened + magical effects', type: 'normal' },
            { roll: [6, 7], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'success' },
            { roll: [8, 9], result: 'Ultimate performance, audience ascended + become immortal legend', type: 'success' },
            { roll: [10, 10], result: 'Cosmic performance, reality altered + your art becomes law', type: 'critical' }
        ]
    },
    performance_expert_d12: {
        name: 'Expert Performance (d12)',
        description: 'Expert performance on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Legendary performance, deeply moving', type: 'failure' },
            { roll: [2, 3], result: 'Perfect performance, audience transformed + permanent fans', type: 'failure' },
            { roll: [4, 6], result: 'Mythic performance, audience enlightened + magical effects', type: 'normal' },
            { roll: [7, 9], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'success' },
            { roll: [10, 11], result: 'Ultimate performance, audience ascended + become immortal legend', type: 'success' },
            { roll: [12, 12], result: 'Cosmic performance, reality altered + your art becomes law', type: 'critical' }
        ]
    },
    performance_expert_d20: {
        name: 'Expert Performance (d20)',
        description: 'Expert performance on an extremely difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 3], result: 'Even your legendary mastery is tested', type: 'failure' },
            { roll: [4, 5], result: 'You make slow progress', type: 'failure' },
            { roll: [6, 8], result: 'Mythic performance, audience enlightened + magical effects', type: 'normal' },
            { roll: [9, 10], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'normal' },
            { roll: [11, 13], result: 'Ultimate performance, audience ascended + become immortal legend', type: 'success' },
            { roll: [14, 16], result: 'Cosmic performance, reality altered + your art becomes law', type: 'success' },
            { roll: [17, 19], result: 'Absolute performance, become deity of art + all who hear worship you', type: 'critical' },
            { roll: [20, 20], result: 'Transcendent performance, your art becomes eternal truth', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    performance_master_d4: {
        name: 'Master Performance (d4)',
        description: 'Master performance on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'success' },
            { roll: [3, 3], result: 'Ultimate performance, audience ascended + become immortal legend', type: 'critical' },
            { roll: [4, 4], result: 'Cosmic performance, reality altered + your art becomes law', type: 'critical' }
        ]
    },
    performance_master_d6: {
        name: 'Master Performance (d6)',
        description: 'Master performance on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 3], result: 'Mythic performance, audience enlightened + magical effects', type: 'success' },
            { roll: [4, 5], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'success' },
            { roll: [6, 6], result: 'Ultimate performance, audience ascended + become immortal legend', type: 'critical' }
        ]
    },
    performance_master_d8: {
        name: 'Master Performance (d8)',
        description: 'Master performance on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Masterful performance, fame spreads', type: 'failure' },
            { roll: [2, 3], result: 'Mythic performance, audience enlightened + magical effects', type: 'normal' },
            { roll: [4, 5], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'success' },
            { roll: [6, 7], result: 'Ultimate performance, audience ascended + become immortal legend', type: 'success' },
            { roll: [8, 8], result: 'Cosmic performance, reality altered + your art becomes law', type: 'critical' }
        ]
    },
    performance_master_d10: {
        name: 'Master Performance (d10)',
        description: 'Master performance on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Masterful performance, fame spreads', type: 'failure' },
            { roll: [2, 3], result: 'Mythic performance, audience enlightened + magical effects', type: 'normal' },
            { roll: [4, 5], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'normal' },
            { roll: [6, 7], result: 'Ultimate performance, audience ascended + become immortal legend', type: 'success' },
            { roll: [8, 9], result: 'Cosmic performance, reality altered + your art becomes law', type: 'success' },
            { roll: [10, 10], result: 'Absolute performance, become deity of art + all who hear worship you', type: 'critical' }
        ]
    },
    performance_master_d12: {
        name: 'Master Performance (d12)',
        description: 'Master performance on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Masterful performance, fame spreads', type: 'failure' },
            { roll: [2, 3], result: 'Mythic performance, audience enlightened + magical effects', type: 'failure' },
            { roll: [4, 6], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'normal' },
            { roll: [7, 9], result: 'Ultimate performance, audience ascended + become immortal legend', type: 'success' },
            { roll: [10, 11], result: 'Cosmic performance, reality altered + your art becomes law', type: 'success' },
            { roll: [12, 12], result: 'Absolute performance, become deity of art + all who hear worship you', type: 'critical' }
        ]
    },
    performance_master_d20: {
        name: 'Master Performance (d20)',
        description: 'Master performance on an extremely difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 3], result: 'Even your ultimate mastery is challenged', type: 'failure' },
            { roll: [4, 5], result: 'You struggle with this impossible task', type: 'failure' },
            { roll: [6, 8], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'normal' },
            { roll: [9, 10], result: 'Ultimate performance, audience ascended + become immortal legend', type: 'normal' },
            { roll: [11, 13], result: 'Cosmic performance, reality altered + your art becomes law', type: 'success' },
            { roll: [14, 16], result: 'Absolute performance, become deity of art + all who hear worship you', type: 'success' },
            { roll: [17, 19], result: 'Transcendent performance, your art becomes eternal truth', type: 'critical' },
            { roll: [20, 20], result: 'Perfect supremacy, you redefine the concept of art itself', type: 'critical' }
        ]
    }
};

