// Intimidation Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total

export const INTIMIDATION_TABLES = {
    // UNTRAINED - d4 through d20
    intimidation_untrained_d4: {
        name: 'Untrained Intimidation (d4)',
        description: 'Untrained intimidation on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Your threat is weak, target laughs at you', type: 'failure' },
            { roll: [2, 2], result: 'Target is unmoved by your attempt', type: 'normal' },
            { roll: [3, 3], result: 'You manage to seem threatening, target is nervous', type: 'success' },
            { roll: [4, 4], result: 'Despite inexperience, you frighten them, target complies', type: 'success' }
        ]
    },
    intimidation_untrained_d6: {
        name: 'Untrained Intimidation (d6)',
        description: 'Untrained intimidation on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Your threat angers them, target becomes hostile', type: 'failure' },
            { roll: [2, 2], result: 'Target mocks your attempt, you lose respect', type: 'failure' },
            { roll: [3, 3], result: 'Your words are clumsy but target listens', type: 'normal' },
            { roll: [4, 4], result: 'Target is uncertain but not frightened', type: 'normal' },
            { roll: [5, 5], result: 'You seem threatening, target is nervous', type: 'success' },
            { roll: [6, 6], result: 'Your presence intimidates, target complies reluctantly', type: 'success' }
        ]
    },
    intimidation_untrained_d8: {
        name: 'Untrained Intimidation (d8)',
        description: 'Untrained intimidation on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You panic, target sees your fear and attacks', type: 'failure' },
            { roll: [2, 2], result: 'Your threat is pathetic, target laughs', type: 'failure' },
            { roll: [3, 3], result: 'Target is completely unmoved', type: 'failure' },
            { roll: [4, 4], result: 'Your inexperience shows, no effect', type: 'failure' },
            { roll: [5, 5], result: 'You barely seem threatening', type: 'normal' },
            { roll: [6, 6], result: 'Target is uncertain but not scared', type: 'normal' },
            { roll: [7, 7], result: 'You find the right tone, target is nervous', type: 'success' },
            { roll: [8, 8], result: 'Lucky intimidation, target complies', type: 'success' }
        ]
    },
    intimidation_untrained_d10: {
        name: 'Untrained Intimidation (d10)',
        description: 'Untrained intimidation on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You say exactly the wrong thing, target attacks you', type: 'failure' },
            { roll: [2, 3], result: 'Your clumsy threat angers them', type: 'failure' },
            { roll: [4, 5], result: 'Target sees through your inexperience, mocks you', type: 'failure' },
            { roll: [6, 6], result: 'You ramble unconvincingly, no effect', type: 'failure' },
            { roll: [7, 7], result: 'Your words are poorly chosen but target listens', type: 'normal' },
            { roll: [8, 8], result: 'Target remains defiant but uncertain', type: 'normal' },
            { roll: [9, 9], result: 'You stumble into intimidation, target is nervous', type: 'success' },
            { roll: [10, 10], result: 'Surprising threat, target complies', type: 'success' }
        ]
    },
    intimidation_untrained_d12: {
        name: 'Untrained Intimidation (d12)',
        description: 'Untrained intimidation on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You completely fail to intimidate, target attacks', type: 'failure' },
            { roll: [3, 4], result: 'Your words cause anger, target becomes hostile', type: 'failure' },
            { roll: [5, 6], result: 'You anger target with poor intimidation', type: 'failure' },
            { roll: [7, 8], result: 'Target sees you as weak, loses respect', type: 'failure' },
            { roll: [9, 9], result: 'Your inexperience is obvious, no effect', type: 'failure' },
            { roll: [10, 10], result: 'Target barely tolerates your threat', type: 'normal' },
            { roll: [11, 11], result: 'You manage minimal intimidation, target is nervous', type: 'success' },
            { roll: [12, 12], result: 'Against odds, you frighten them, target complies', type: 'success' }
        ]
    },
    intimidation_untrained_d20: {
        name: 'Untrained Intimidation (d20)',
        description: 'Untrained intimidation on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'You completely misunderstand the situation, target attacks', type: 'failure' },
            { roll: [4, 6], result: 'Your words cause rage, target becomes violent', type: 'failure' },
            { roll: [7, 9], result: 'You say something offensive, target turns against you', type: 'failure' },
            { roll: [10, 12], result: 'Your intimidation is laughably bad, target mocks you', type: 'failure' },
            { roll: [13, 15], result: 'Target sees you as incompetent, refuses to comply', type: 'failure' },
            { roll: [16, 17], result: 'Your inexperience is painfully obvious, no effect', type: 'failure' },
            { roll: [18, 18], result: 'You barely maintain threat through luck', type: 'normal' },
            { roll: [19, 19], result: 'Miraculous intimidation, target is nervous', type: 'success' },
            { roll: [20, 20], result: 'Impossible threat, target complies', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    intimidation_novice_d4: {
        name: 'Novice Intimidation (d4)',
        description: 'Novice intimidation on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Failure, attempt unsuccessful', type: 'failure' },
            { roll: [2, 2], result: 'You inspire fear, target is nervous and cooperative', type: 'success' },
            { roll: [3, 3], result: 'Your threat is clear, target is frightened', type: 'success' },
            { roll: [4, 4], result: 'Target is terrified, will do anything', type: 'success' }
        ]
    },
    intimidation_novice_d6: {
        name: 'Novice Intimidation (d6)',
        description: 'Novice intimidation on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misjudge the approach, target becomes angry', type: 'failure' },
            { roll: [2, 2], result: 'Your threat is weak, target is skeptical', type: 'failure' },
            { roll: [3, 3], result: 'Target is unmoved by your words', type: 'normal' },
            { roll: [4, 4], result: 'You make a decent attempt, target is nervous', type: 'normal' },
            { roll: [5, 5], result: 'Your intimidation is solid, target is frightened', type: 'success' },
            { roll: [6, 6], result: 'Target is terrified, complies immediately', type: 'success' }
        ]
    },
    intimidation_novice_d8: {
        name: 'Novice Intimidation (d8)',
        description: 'Novice intimidation on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Your inexperience shows, target is defiant', type: 'failure' },
            { roll: [2, 2], result: 'You struggle to intimidate, no effect', type: 'failure' },
            { roll: [3, 3], result: 'Target remains uncertain', type: 'normal' },
            { roll: [4, 4], result: 'Your training helps, target listens', type: 'normal' },
            { roll: [5, 5], result: 'You threaten them adequately, target is nervous', type: 'normal' },
            { roll: [6, 6], result: 'Solid intimidation, target is frightened', type: 'success' },
            { roll: [7, 7], result: 'You inspire fear, target complies', type: 'success' },
            { roll: [8, 8], result: 'Excellent threat, target is terrified', type: 'critical' }
        ]
    },
    intimidation_novice_d10: {
        name: 'Novice Intimidation (d10)',
        description: 'Novice intimidation on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'The challenge overwhelms you, target attacks', type: 'failure' },
            { roll: [2, 2], result: 'You fail to intimidate, target becomes angry', type: 'failure' },
            { roll: [3, 3], result: 'Your words fall flat, no effect', type: 'failure' },
            { roll: [4, 4], result: 'Target remains defiant', type: 'failure' },
            { roll: [5, 5], result: 'You barely maintain threat', type: 'normal' },
            { roll: [6, 6], result: 'Your training shows, target listens', type: 'normal' },
            { roll: [7, 7], result: 'You threaten them, target is nervous', type: 'success' },
            { roll: [8, 8], result: 'Good intimidation, target is frightened', type: 'success' },
            { roll: [9, 9], result: 'You inspire fear, target complies', type: 'success' },
            { roll: [10, 10], result: 'Exceptional threat, target is terrified', type: 'critical' }
        ]
    },
    intimidation_novice_d12: {
        name: 'Novice Intimidation (d12)',
        description: 'Novice intimidation on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'The task is beyond your ability, target attacks', type: 'failure' },
            { roll: [3, 4], result: 'You fail to intimidate, target becomes hostile', type: 'failure' },
            { roll: [5, 6], result: 'Your threat is ineffective, no effect', type: 'failure' },
            { roll: [7, 7], result: 'Target remains skeptical', type: 'failure' },
            { roll: [8, 8], result: 'You barely hold their attention', type: 'normal' },
            { roll: [9, 9], result: 'Your training helps you persevere', type: 'normal' },
            { roll: [10, 10], result: 'You threaten them, target is nervous', type: 'success' },
            { roll: [11, 11], result: 'Solid intimidation, target is frightened', type: 'success' },
            { roll: [12, 12], result: 'You inspire fear, target complies', type: 'critical' }
        ]
    },
    intimidation_novice_d20: {
        name: 'Novice Intimidation (d20)',
        description: 'Novice intimidation on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'You completely fail to intimidate, target attacks', type: 'failure' },
            { roll: [4, 6], result: 'Your words cause rage, target becomes violent', type: 'failure' },
            { roll: [7, 9], result: 'You anger target with poor threats', type: 'failure' },
            { roll: [10, 12], result: 'Your intimidation fails, target loses respect', type: 'failure' },
            { roll: [13, 15], result: 'Target sees your limits, refuses to comply', type: 'failure' },
            { roll: [16, 16], result: 'You barely maintain control', type: 'normal' },
            { roll: [17, 17], result: 'Your training helps you hold them', type: 'normal' },
            { roll: [18, 18], result: 'You threaten them, target is nervous', type: 'success' },
            { roll: [19, 19], result: 'Impressive intimidation, target is frightened', type: 'success' },
            { roll: [20, 20], result: 'Miraculous threat, target is terrified', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    intimidation_trained_d4: {
        name: 'Trained Intimidation (d4)',
        description: 'Trained intimidation on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Your presence crushes their will, target becomes servant', type: 'success' },
            { roll: [3, 3], result: 'Target is paralyzed with fear, obeys instantly', type: 'success' },
            { roll: [4, 4], result: 'Your threat breaks them, target spreads fear of you', type: 'success' }
        ]
    },
    intimidation_trained_d6: {
        name: 'Trained Intimidation (d6)',
        description: 'Trained intimidation on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You struggle with complex situation, partial effect', type: 'failure' },
            { roll: [2, 2], result: 'You intimidate them but miss details', type: 'normal' },
            { roll: [3, 3], result: 'Your threat is clear, target is terrified', type: 'success' },
            { roll: [4, 4], result: 'Target will do anything to avoid your wrath', type: 'success' },
            { roll: [5, 5], result: 'Your presence crushes their will', type: 'critical' },
            { roll: [6, 6], result: 'Target is paralyzed with fear, becomes servant', type: 'critical' }
        ]
    },
    intimidation_trained_d8: {
        name: 'Trained Intimidation (d8)',
        description: 'Trained intimidation on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You misread complex signals, target resists', type: 'failure' },
            { roll: [2, 2], result: 'Their defiance is strong, confused threat', type: 'failure' },
            { roll: [3, 3], result: 'You intimidate them adequately', type: 'normal' },
            { roll: [4, 4], result: 'Target is frightened', type: 'normal' },
            { roll: [5, 5], result: 'You terrify them, target complies', type: 'success' },
            { roll: [6, 6], result: 'Target will do anything', type: 'success' },
            { roll: [7, 7], result: 'Your presence crushes their will', type: 'success' },
            { roll: [8, 8], result: 'Target is paralyzed with fear', type: 'critical' }
        ]
    },
    intimidation_trained_d10: {
        name: 'Trained Intimidation (d10)',
        description: 'Trained intimidation on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'The complexity overwhelms you, target resists', type: 'failure' },
            { roll: [2, 2], result: 'You misread them, target becomes defiant', type: 'failure' },
            { roll: [3, 3], result: 'Their will is strong, confused', type: 'failure' },
            { roll: [4, 4], result: 'Vague threat, uncertain', type: 'normal' },
            { roll: [5, 5], result: 'You intimidate them adequately', type: 'normal' },
            { roll: [6, 6], result: 'Target is frightened', type: 'normal' },
            { roll: [7, 7], result: 'You terrify them, target complies', type: 'success' },
            { roll: [8, 8], result: 'Target will do anything', type: 'success' },
            { roll: [9, 9], result: 'Your presence crushes their will', type: 'success' },
            { roll: [10, 10], result: 'Target is paralyzed with fear', type: 'critical' }
        ]
    },
    intimidation_trained_d12: {
        name: 'Trained Intimidation (d12)',
        description: 'Trained intimidation on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'You fail to intimidate, target resists', type: 'failure' },
            { roll: [3, 4], result: 'Their defiance works, target becomes hostile', type: 'failure' },
            { roll: [5, 6], result: 'You misread signals, wrong approach', type: 'failure' },
            { roll: [7, 7], result: 'Vague uncertain threat', type: 'normal' },
            { roll: [8, 8], result: 'You intimidate them adequately', type: 'normal' },
            { roll: [9, 9], result: 'Target is frightened', type: 'normal' },
            { roll: [10, 10], result: 'You terrify them, target complies', type: 'success' },
            { roll: [11, 11], result: 'Target will do anything', type: 'success' },
            { roll: [12, 12], result: 'Your presence crushes their will', type: 'critical' }
        ]
    },
    intimidation_trained_d20: {
        name: 'Trained Intimidation (d20)',
        description: 'Trained intimidation on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 3], result: 'You completely fail, target attacks', type: 'failure' },
            { roll: [4, 5], result: 'Their defiance is perfect, target becomes violent', type: 'failure' },
            { roll: [6, 8], result: 'You misread everything, dangerous error', type: 'normal' },
            { roll: [9, 10], result: 'Vague threat, uncertain', type: 'normal' },
            { roll: [11, 13], result: 'You intimidate them adequately', type: 'success' },
            { roll: [14, 16], result: 'Target is frightened and complies', type: 'success' },
            { roll: [17, 18], result: 'Target will do anything', type: 'success' },
            { roll: [19, 19], result: 'Your presence crushes their will', type: 'critical' },
            { roll: [20, 20], result: 'Target is paralyzed with fear', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    intimidation_apprentice_d4: {
        name: 'Apprentice Intimidation (d4)',
        description: 'Apprentice intimidation on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Entire groups submit to your presence', type: 'success' },
            { roll: [3, 3], result: 'Your name becomes feared, enemies flee at sight', type: 'success' },
            { roll: [4, 4], result: 'You inspire mythic terror, target worships you', type: 'success' }
        ]
    },
    intimidation_apprentice_d6: {
        name: 'Apprentice Intimidation (d6)',
        description: 'Apprentice intimidation on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Target is paralyzed with fear, becomes servant', type: 'success' },
            { roll: [3, 3], result: 'Target spreads fear of you', type: 'success' },
            { roll: [4, 4], result: 'Entire groups submit to you', type: 'success' },
            { roll: [5, 5], result: 'Your name becomes feared', type: 'critical' },
            { roll: [6, 6], result: 'You inspire mythic terror', type: 'critical' }
        ]
    },
    intimidation_apprentice_d8: {
        name: 'Apprentice Intimidation (d8)',
        description: 'Apprentice intimidation on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Complex situation confuses you slightly', type: 'failure' },
            { roll: [2, 2], result: 'You terrify them completely', type: 'normal' },
            { roll: [3, 3], result: 'Target will do anything', type: 'normal' },
            { roll: [4, 4], result: 'Your presence crushes their will', type: 'normal' },
            { roll: [5, 5], result: 'Target is paralyzed with fear', type: 'success' },
            { roll: [6, 6], result: 'Target spreads fear of you', type: 'success' },
            { roll: [7, 7], result: 'Entire groups submit to you', type: 'success' },
            { roll: [8, 8], result: 'Your name becomes feared', type: 'critical' }
        ]
    },
    intimidation_apprentice_d10: {
        name: 'Apprentice Intimidation (d10)',
        description: 'Apprentice intimidation on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'The challenge is difficult, partial effect', type: 'failure' },
            { roll: [2, 2], result: 'You struggle slightly, vague threat', type: 'failure' },
            { roll: [3, 3], result: 'You terrify them', type: 'normal' },
            { roll: [4, 4], result: 'Target will do anything', type: 'normal' },
            { roll: [5, 5], result: 'Your presence crushes their will', type: 'normal' },
            { roll: [6, 6], result: 'Target is paralyzed with fear', type: 'success' },
            { roll: [7, 7], result: 'Target spreads fear of you', type: 'success' },
            { roll: [8, 8], result: 'Entire groups submit to you', type: 'success' },
            { roll: [9, 9], result: 'Your name becomes feared', type: 'success' },
            { roll: [10, 10], result: 'You inspire mythic terror', type: 'critical' }
        ]
    },
    intimidation_apprentice_d12: {
        name: 'Apprentice Intimidation (d12)',
        description: 'Apprentice intimidation on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 2], result: 'The task is formidable, unclear threat', type: 'failure' },
            { roll: [3, 4], result: 'You struggle to intimidate clearly', type: 'failure' },
            { roll: [5, 6], result: 'You terrify them adequately', type: 'normal' },
            { roll: [7, 7], result: 'Target will do anything', type: 'normal' },
            { roll: [8, 8], result: 'Your presence crushes their will', type: 'normal' },
            { roll: [9, 9], result: 'Target is paralyzed with fear', type: 'success' },
            { roll: [10, 10], result: 'Target spreads fear of you', type: 'success' },
            { roll: [11, 11], result: 'Entire groups submit to you', type: 'success' },
            { roll: [12, 12], result: 'Your name becomes feared', type: 'critical' }
        ]
    },
    intimidation_apprentice_d20: {
        name: 'Apprentice Intimidation (d20)',
        description: 'Apprentice intimidation on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 3], result: 'Even your skill struggles, target resists', type: 'failure' },
            { roll: [4, 5], result: 'You make minimal progress, vague threat', type: 'failure' },
            { roll: [6, 8], result: 'You terrify them adequately', type: 'normal' },
            { roll: [9, 10], result: 'Target will do anything', type: 'normal' },
            { roll: [11, 13], result: 'Your presence crushes their will', type: 'success' },
            { roll: [14, 16], result: 'Target is paralyzed with fear', type: 'success' },
            { roll: [17, 18], result: 'Target spreads fear of you', type: 'success' },
            { roll: [19, 19], result: 'Entire groups submit to you', type: 'critical' },
            { roll: [20, 20], result: 'Your name becomes feared', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    intimidation_adept_d4: {
        name: 'Adept Intimidation (d4)',
        description: 'Adept intimidation on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Your name becomes a curse, instant submission', type: 'critical' },
            { roll: [3, 3], result: 'Legends spread of your terror across lands', type: 'critical' },
            { roll: [4, 4], result: 'Your mere existence breaks wills', type: 'critical' }
        ]
    },
    intimidation_adept_d6: {
        name: 'Adept Intimidation (d6)',
        description: 'Adept intimidation on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Entire groups submit instantly', type: 'success' },
            { roll: [3, 3], result: 'Your name becomes feared across regions', type: 'success' },
            { roll: [4, 4], result: 'Entire armies flee from you', type: 'success' },
            { roll: [5, 5], result: 'Your name becomes a curse', type: 'critical' },
            { roll: [6, 6], result: 'Legends spread of your terror', type: 'critical' }
        ]
    },
    intimidation_adept_d8: {
        name: 'Adept Intimidation (d8)',
        description: 'Adept intimidation on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor challenge, partial terror', type: 'failure' },
            { roll: [2, 2], result: 'Your presence crushes their will', type: 'normal' },
            { roll: [3, 3], result: 'Target is paralyzed with fear', type: 'normal' },
            { roll: [4, 4], result: 'Target spreads fear of you', type: 'normal' },
            { roll: [5, 5], result: 'Entire groups submit to you', type: 'success' },
            { roll: [6, 6], result: 'Your name becomes feared', type: 'success' },
            { roll: [7, 7], result: 'Entire armies flee from you', type: 'success' },
            { roll: [8, 8], result: 'Your name becomes a curse', type: 'critical' }
        ]
    },
    intimidation_adept_d10: {
        name: 'Adept Intimidation (d10)',
        description: 'Adept intimidation on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'The challenge is formidable, unclear threat', type: 'failure' },
            { roll: [2, 2], result: 'You make excellent progress, partial effect', type: 'failure' },
            { roll: [3, 3], result: 'Your presence crushes their will', type: 'normal' },
            { roll: [4, 4], result: 'Target is paralyzed with fear', type: 'normal' },
            { roll: [5, 6], result: 'Target spreads fear of you', type: 'success' },
            { roll: [7, 8], result: 'Entire groups submit to you', type: 'success' },
            { roll: [9, 9], result: 'Your name becomes feared', type: 'success' },
            { roll: [10, 10], result: 'Entire armies flee from you', type: 'critical' }
        ]
    },
    intimidation_adept_d12: {
        name: 'Adept Intimidation (d12)',
        description: 'Adept intimidation on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'The task is formidable, vague threat', type: 'failure' },
            { roll: [2, 2], result: 'You struggle slightly, partial effect', type: 'failure' },
            { roll: [3, 3], result: 'Target is paralyzed with fear', type: 'normal' },
            { roll: [4, 4], result: 'Target spreads fear of you', type: 'normal' },
            { roll: [5, 6], result: 'Entire groups submit to you', type: 'normal' },
            { roll: [7, 8], result: 'Your name becomes feared', type: 'success' },
            { roll: [9, 9], result: 'Entire armies flee from you', type: 'success' },
            { roll: [10, 10], result: 'Your name becomes a curse', type: 'success' },
            { roll: [11, 11], result: 'Legends spread of your terror', type: 'critical' },
            { roll: [12, 12], result: 'Your mere existence breaks wills', type: 'critical' }
        ]
    },
    intimidation_adept_d20: {
        name: 'Adept Intimidation (d20)',
        description: 'Adept intimidation on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 3], result: 'Even your mastery struggles, unclear', type: 'failure' },
            { roll: [4, 5], result: 'You make minimal progress, vague threat', type: 'failure' },
            { roll: [6, 8], result: 'Target is paralyzed with fear', type: 'normal' },
            { roll: [9, 10], result: 'Target spreads fear of you', type: 'normal' },
            { roll: [11, 13], result: 'Entire groups submit to you', type: 'success' },
            { roll: [14, 16], result: 'Your name becomes feared', type: 'success' },
            { roll: [17, 18], result: 'Entire armies flee from you', type: 'success' },
            { roll: [19, 19], result: 'Your name becomes a curse', type: 'critical' },
            { roll: [20, 20], result: 'Legends spread of your terror', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    intimidation_expert_d4: {
        name: 'Expert Intimidation (d4)',
        description: 'Expert intimidation on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Your legend transcends reality, gods fear you', type: 'critical' },
            { roll: [3, 3], result: 'Your presence shatters minds, enemies go mad', type: 'critical' },
            { roll: [4, 4], result: 'You become the embodiment of terror itself', type: 'critical' }
        ]
    },
    intimidation_expert_d6: {
        name: 'Expert Intimidation (d6)',
        description: 'Expert intimidation on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Your name becomes a curse', type: 'success' },
            { roll: [3, 3], result: 'Legends spread of your terror', type: 'success' },
            { roll: [4, 4], result: 'Nations fear your name', type: 'success' },
            { roll: [5, 5], result: 'Your legend transcends reality', type: 'critical' },
            { roll: [6, 6], result: 'Your presence shatters minds', type: 'critical' }
        ]
    },
    intimidation_expert_d8: {
        name: 'Expert Intimidation (d8)',
        description: 'Expert intimidation on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor setback, partial terror', type: 'failure' },
            { roll: [2, 2], result: 'Entire groups submit to you', type: 'normal' },
            { roll: [3, 3], result: 'Your name becomes feared', type: 'normal' },
            { roll: [4, 4], result: 'Entire armies flee from you', type: 'normal' },
            { roll: [5, 5], result: 'Your name becomes a curse', type: 'success' },
            { roll: [6, 6], result: 'Legends spread of your terror', type: 'success' },
            { roll: [7, 7], result: 'Nations fear your name', type: 'success' },
            { roll: [8, 8], result: 'Your legend transcends reality', type: 'critical' }
        ]
    },
    intimidation_expert_d10: {
        name: 'Expert Intimidation (d10)',
        description: 'Expert intimidation on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'The challenge is formidable, partial effect', type: 'failure' },
            { roll: [2, 2], result: 'You make excellent progress, unclear', type: 'failure' },
            { roll: [3, 3], result: 'Entire groups submit to you', type: 'normal' },
            { roll: [4, 4], result: 'Your name becomes feared', type: 'normal' },
            { roll: [5, 6], result: 'Entire armies flee from you', type: 'success' },
            { roll: [7, 8], result: 'Your name becomes a curse', type: 'success' },
            { roll: [9, 9], result: 'Legends spread of your terror', type: 'success' },
            { roll: [10, 10], result: 'Nations fear your name', type: 'critical' }
        ]
    },
    intimidation_expert_d12: {
        name: 'Expert Intimidation (d12)',
        description: 'Expert intimidation on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'The task is formidable, vague threat', type: 'failure' },
            { roll: [2, 2], result: 'You struggle slightly, partial effect', type: 'failure' },
            { roll: [3, 3], result: 'Your name becomes feared', type: 'normal' },
            { roll: [4, 4], result: 'Entire armies flee from you', type: 'normal' },
            { roll: [5, 6], result: 'Your name becomes a curse', type: 'normal' },
            { roll: [7, 8], result: 'Legends spread of your terror', type: 'success' },
            { roll: [9, 9], result: 'Nations fear your name', type: 'success' },
            { roll: [10, 10], result: 'Your legend transcends reality', type: 'success' },
            { roll: [11, 11], result: 'Your presence shatters minds', type: 'critical' },
            { roll: [12, 12], result: 'You become the embodiment of terror', type: 'critical' }
        ]
    },
    intimidation_expert_d20: {
        name: 'Expert Intimidation (d20)',
        description: 'Expert intimidation on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 3], result: 'Even your legendary mastery is tested, unclear', type: 'failure' },
            { roll: [4, 5], result: 'You make slow progress, vague threat', type: 'failure' },
            { roll: [6, 8], result: 'Entire groups submit to you', type: 'normal' },
            { roll: [9, 10], result: 'Your name becomes feared', type: 'normal' },
            { roll: [11, 13], result: 'Entire armies flee from you', type: 'success' },
            { roll: [14, 16], result: 'Your name becomes a curse', type: 'success' },
            { roll: [17, 18], result: 'Legends spread of your terror', type: 'success' },
            { roll: [19, 19], result: 'Nations fear your name', type: 'critical' },
            { roll: [20, 20], result: 'Your legend transcends reality', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    intimidation_master_d4: {
        name: 'Master Intimidation (d4)',
        description: 'Master intimidation on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Your name becomes cosmic law, reality bends to your will', type: 'critical' },
            { roll: [3, 3], result: 'You transcend fear itself, become primordial terror', type: 'critical' },
            { roll: [4, 4], result: 'Your existence rewrites the concept of fear', type: 'critical' }
        ]
    },
    intimidation_master_d6: {
        name: 'Master Intimidation (d6)',
        description: 'Master intimidation on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Your legend transcends reality', type: 'success' },
            { roll: [3, 3], result: 'Your presence shatters minds', type: 'success' },
            { roll: [4, 4], result: 'Entire worlds fear you', type: 'success' },
            { roll: [5, 5], result: 'Your name becomes cosmic law', type: 'critical' },
            { roll: [6, 6], result: 'You transcend fear itself', type: 'critical' }
        ]
    },
    intimidation_master_d8: {
        name: 'Master Intimidation (d8)',
        description: 'Master intimidation on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor challenge, partial cosmic terror', type: 'failure' },
            { roll: [2, 2], result: 'Legends spread of your terror', type: 'normal' },
            { roll: [3, 3], result: 'Nations fear your name', type: 'normal' },
            { roll: [4, 4], result: 'Your legend transcends reality', type: 'normal' },
            { roll: [5, 5], result: 'Your presence shatters minds', type: 'success' },
            { roll: [6, 6], result: 'Entire worlds fear you', type: 'success' },
            { roll: [7, 7], result: 'Your name becomes cosmic law', type: 'success' },
            { roll: [8, 8], result: 'You transcend fear itself', type: 'critical' }
        ]
    },
    intimidation_master_d10: {
        name: 'Master Intimidation (d10)',
        description: 'Master intimidation on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'The challenge is formidable, partial effect', type: 'failure' },
            { roll: [2, 2], result: 'You make excellent progress, unclear', type: 'failure' },
            { roll: [3, 3], result: 'Legends spread of your terror', type: 'normal' },
            { roll: [4, 4], result: 'Nations fear your name', type: 'normal' },
            { roll: [5, 6], result: 'Your legend transcends reality', type: 'success' },
            { roll: [7, 8], result: 'Your presence shatters minds', type: 'success' },
            { roll: [9, 9], result: 'Entire worlds fear you', type: 'success' },
            { roll: [10, 10], result: 'Your name becomes cosmic law', type: 'critical' }
        ]
    },
    intimidation_master_d12: {
        name: 'Master Intimidation (d12)',
        description: 'Master intimidation on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'The task is formidable, vague threat', type: 'failure' },
            { roll: [2, 2], result: 'You struggle slightly, partial effect', type: 'failure' },
            { roll: [3, 3], result: 'Nations fear your name', type: 'normal' },
            { roll: [4, 4], result: 'Your legend transcends reality', type: 'normal' },
            { roll: [5, 6], result: 'Your presence shatters minds', type: 'normal' },
            { roll: [7, 8], result: 'Entire worlds fear you', type: 'success' },
            { roll: [9, 9], result: 'Your name becomes cosmic law', type: 'success' },
            { roll: [10, 10], result: 'You transcend fear itself', type: 'success' },
            { roll: [11, 11], result: 'You become primordial terror', type: 'critical' },
            { roll: [12, 12], result: 'Your existence rewrites the concept of fear', type: 'critical' }
        ]
    },
    intimidation_master_d20: {
        name: 'Master Intimidation (d20)',
        description: 'Master intimidation on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 3], result: 'Even your legendary mastery is tested, unclear', type: 'failure' },
            { roll: [4, 5], result: 'You make slow progress, vague threat', type: 'failure' },
            { roll: [6, 8], result: 'Legends spread of your terror', type: 'normal' },
            { roll: [9, 10], result: 'Nations fear your name', type: 'normal' },
            { roll: [11, 13], result: 'Your legend transcends reality', type: 'success' },
            { roll: [14, 16], result: 'Your presence shatters minds', type: 'success' },
            { roll: [17, 18], result: 'Entire worlds fear you', type: 'success' },
            { roll: [19, 19], result: 'Your name becomes cosmic law', type: 'critical' },
            { roll: [20, 20], result: 'You transcend fear itself, become primordial terror', type: 'critical' }
        ]
    },
};