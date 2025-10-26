// Leadership Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total

export const LEADERSHIP_TABLES = {
    // UNTRAINED - d4 through d20
    leadership_untrained_d4: {
        name: 'Untrained Leadership (d4)',
        description: 'Untrained leadership on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Your words confuse followers, they hesitate', type: 'failure' },
            { roll: [2, 2], result: 'Followers are uncertain but maintain morale', type: 'normal' },
            { roll: [3, 3], result: 'You inspire basic confidence, followers gain +1 to actions', type: 'success' },
            { roll: [4, 4], result: 'Despite inexperience, you rally them, followers gain +2 to actions', type: 'success' }
        ]
    },
    leadership_untrained_d6: {
        name: 'Untrained Leadership (d6)',
        description: 'Untrained leadership on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Your command is weak, followers lose morale', type: 'failure' },
            { roll: [2, 2], result: 'You contradict yourself, followers are confused', type: 'failure' },
            { roll: [3, 3], result: 'Your words are clumsy but followers listen', type: 'normal' },
            { roll: [4, 4], result: 'Followers are unmoved but willing to try', type: 'normal' },
            { roll: [5, 5], result: 'You manage to inspire them, followers gain +1 to actions', type: 'success' },
            { roll: [6, 6], result: 'Your passion shows through, followers gain +2 to actions', type: 'success' }
        ]
    },
    leadership_untrained_d8: {
        name: 'Untrained Leadership (d8)',
        description: 'Untrained leadership on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You panic, followers flee or rebel', type: 'failure' },
            { roll: [2, 2], result: 'Your fear is obvious, followers lose confidence', type: 'failure' },
            { roll: [3, 3], result: 'You stumble over words, followers are demoralized', type: 'failure' },
            { roll: [4, 4], result: 'Your inexperience shows, no effect', type: 'failure' },
            { roll: [5, 5], result: 'You barely maintain order, followers hesitate', type: 'normal' },
            { roll: [6, 6], result: 'Followers remain uncertain but listen', type: 'normal' },
            { roll: [7, 7], result: 'You find the right words, followers gain +1 to actions', type: 'success' },
            { roll: [8, 8], result: 'Lucky inspiration, followers gain +2 to actions', type: 'success' }
        ]
    },
    leadership_untrained_d10: {
        name: 'Untrained Leadership (d10)',
        description: 'Untrained leadership on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You say exactly the wrong thing, followers panic and flee', type: 'failure' },
            { roll: [2, 3], result: 'Your clumsy command angers followers', type: 'failure' },
            { roll: [4, 5], result: 'Followers see through your inexperience, lose morale', type: 'failure' },
            { roll: [6, 6], result: 'You ramble unconvincingly, followers ignore you', type: 'failure' },
            { roll: [7, 7], result: 'Your words are poorly chosen but followers try', type: 'normal' },
            { roll: [8, 8], result: 'Followers remain skeptical but willing', type: 'normal' },
            { roll: [9, 9], result: 'You stumble into inspiration, followers gain +1 to actions', type: 'success' },
            { roll: [10, 10], result: 'Surprising rally, followers gain +2 to actions', type: 'success' }
        ]
    },
    leadership_untrained_d12: {
        name: 'Untrained Leadership (d12)',
        description: 'Untrained leadership on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You completely fail to inspire, followers abandon you', type: 'failure' },
            { roll: [3, 4], result: 'Your words cause panic, followers flee', type: 'failure' },
            { roll: [5, 6], result: 'You anger followers with poor leadership', type: 'failure' },
            { roll: [7, 8], result: 'Followers see you as incompetent, lose respect', type: 'failure' },
            { roll: [9, 9], result: 'Your inexperience is obvious, no effect', type: 'failure' },
            { roll: [10, 10], result: 'Followers barely tolerate your command', type: 'normal' },
            { roll: [11, 11], result: 'You manage minimal inspiration, followers gain +1 to actions', type: 'success' },
            { roll: [12, 12], result: 'Against odds, you rally them, followers gain +2 to actions', type: 'success' }
        ]
    },
    leadership_untrained_d20: {
        name: 'Untrained Leadership (d20)',
        description: 'Untrained leadership on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'You completely misunderstand the situation, followers mutiny', type: 'failure' },
            { roll: [4, 6], result: 'Your words cause mass panic, followers flee in terror', type: 'failure' },
            { roll: [7, 9], result: 'You say something offensive, followers turn against you', type: 'failure' },
            { roll: [10, 12], result: 'Your leadership is laughably bad, followers mock you', type: 'failure' },
            { roll: [13, 15], result: 'Followers see you as incompetent, refuse to follow', type: 'failure' },
            { roll: [16, 17], result: 'Your inexperience is painfully obvious, no effect', type: 'failure' },
            { roll: [18, 18], result: 'You barely maintain order through luck', type: 'normal' },
            { roll: [19, 19], result: 'Miraculous inspiration, followers gain +1 to actions', type: 'success' },
            { roll: [20, 20], result: 'Impossible rally, followers gain +2 to actions', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    leadership_novice_d4: {
        name: 'Novice Leadership (d4)',
        description: 'Novice leadership on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Followers listen but remain uncertain', type: 'normal' },
            { roll: [2, 2], result: 'You inspire confidence, followers gain +2 to actions', type: 'success' },
            { roll: [3, 3], result: 'Your command is clear, followers gain +3 to actions', type: 'success' },
            { roll: [4, 4], result: 'Followers are impressed, gain +3 to actions + extra action', type: 'success' }
        ]
    },
    leadership_novice_d6: {
        name: 'Novice Leadership (d6)',
        description: 'Novice leadership on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misjudge the approach, followers lose morale', type: 'failure' },
            { roll: [2, 2], result: 'Your command is weak, followers are skeptical', type: 'failure' },
            { roll: [3, 3], result: 'Followers are unmoved by your words', type: 'normal' },
            { roll: [4, 4], result: 'You make a decent attempt, followers gain +1 to actions', type: 'normal' },
            { roll: [5, 5], result: 'Your leadership is solid, followers gain +2 to actions', type: 'success' },
            { roll: [6, 6], result: 'Followers are inspired, gain +3 to actions', type: 'success' }
        ]
    },
    leadership_novice_d8: {
        name: 'Novice Leadership (d8)',
        description: 'Novice leadership on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Your inexperience shows, followers hesitate', type: 'failure' },
            { roll: [2, 2], result: 'You struggle to inspire, no effect', type: 'failure' },
            { roll: [3, 3], result: 'Followers remain uncertain', type: 'normal' },
            { roll: [4, 4], result: 'Your training helps, followers listen', type: 'normal' },
            { roll: [5, 5], result: 'You rally them adequately, followers gain +1 to actions', type: 'normal' },
            { roll: [6, 6], result: 'Solid leadership, followers gain +2 to actions', type: 'success' },
            { roll: [7, 7], result: 'You inspire confidence, followers gain +3 to actions', type: 'success' },
            { roll: [8, 8], result: 'Excellent command, followers gain +3 to actions + extra action', type: 'critical' }
        ]
    },
    leadership_novice_d10: {
        name: 'Novice Leadership (d10)',
        description: 'Novice leadership on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'The challenge overwhelms you, followers panic', type: 'failure' },
            { roll: [2, 2], result: 'You fail to inspire, followers lose morale', type: 'failure' },
            { roll: [3, 3], result: 'Your words fall flat, no effect', type: 'failure' },
            { roll: [4, 4], result: 'Followers remain doubtful', type: 'failure' },
            { roll: [5, 5], result: 'You barely maintain order', type: 'normal' },
            { roll: [6, 6], result: 'Your training shows, followers listen', type: 'normal' },
            { roll: [7, 7], result: 'You rally them, followers gain +1 to actions', type: 'success' },
            { roll: [8, 8], result: 'Good leadership, followers gain +2 to actions', type: 'success' },
            { roll: [9, 9], result: 'You inspire them, followers gain +3 to actions', type: 'success' },
            { roll: [10, 10], result: 'Exceptional command, followers gain +3 to actions + extra action', type: 'critical' }
        ]
    },
    leadership_novice_d12: {
        name: 'Novice Leadership (d12)',
        description: 'Novice leadership on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'The task is beyond your ability, followers flee', type: 'failure' },
            { roll: [3, 4], result: 'You fail to inspire, followers lose confidence', type: 'failure' },
            { roll: [5, 6], result: 'Your command is ineffective, no effect', type: 'failure' },
            { roll: [7, 7], result: 'Followers remain skeptical', type: 'failure' },
            { roll: [8, 8], result: 'You barely hold them together', type: 'normal' },
            { roll: [9, 9], result: 'Your training helps you persevere', type: 'normal' },
            { roll: [10, 10], result: 'You rally them, followers gain +1 to actions', type: 'success' },
            { roll: [11, 11], result: 'Solid leadership, followers gain +2 to actions', type: 'success' },
            { roll: [12, 12], result: 'You inspire them, followers gain +3 to actions', type: 'critical' }
        ]
    },
    leadership_novice_d20: {
        name: 'Novice Leadership (d20)',
        description: 'Novice leadership on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'You completely fail to lead, followers mutiny', type: 'failure' },
            { roll: [4, 6], result: 'Your words cause panic, followers flee', type: 'failure' },
            { roll: [7, 9], result: 'You anger followers with poor decisions', type: 'failure' },
            { roll: [10, 12], result: 'Your leadership fails, followers lose respect', type: 'failure' },
            { roll: [13, 15], result: 'Followers see your limits, refuse to follow', type: 'failure' },
            { roll: [16, 16], result: 'You barely maintain control', type: 'normal' },
            { roll: [17, 17], result: 'Your training helps you hold them', type: 'normal' },
            { roll: [18, 18], result: 'You rally them, followers gain +1 to actions', type: 'success' },
            { roll: [19, 19], result: 'Impressive leadership, followers gain +2 to actions', type: 'success' },
            { roll: [20, 20], result: 'Miraculous command, followers gain +3 to actions + extra action', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    leadership_trained_d4: {
        name: 'Trained Leadership (d4)',
        description: 'Trained leadership on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You make good progress, followers gain +2 to actions', type: 'normal' },
            { roll: [2, 2], result: 'Your skill is apparent, followers gain +3 to actions + extra action', type: 'success' },
            { roll: [3, 3], result: 'You build strong morale, followers become fearless', type: 'success' },
            { roll: [4, 4], result: 'Followers are thoroughly inspired, gain +4 to all stats', type: 'success' }
        ]
    },
    leadership_trained_d6: {
        name: 'Trained Leadership (d6)',
        description: 'Trained leadership on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You struggle slightly, followers gain +1 to actions', type: 'failure' },
            { roll: [2, 2], result: 'Your training shows, followers gain +2 to actions', type: 'normal' },
            { roll: [3, 3], result: 'Solid command, followers gain +3 to actions', type: 'success' },
            { roll: [4, 4], result: 'You inspire them well, followers gain +3 to actions + extra action', type: 'success' },
            { roll: [5, 5], result: 'Your expertise shines, followers become fearless', type: 'critical' },
            { roll: [6, 6], result: 'Perfect leadership, followers gain +4 to all stats + double actions', type: 'critical' }
        ]
    },
    leadership_trained_d8: {
        name: 'Trained Leadership (d8)',
        description: 'Trained leadership on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You face difficulty, followers hesitate', type: 'failure' },
            { roll: [2, 2], result: 'Your command wavers, followers gain +1 to actions', type: 'failure' },
            { roll: [3, 3], result: 'You maintain order, followers gain +2 to actions', type: 'normal' },
            { roll: [4, 4], result: 'Your training helps, followers gain +2 to actions', type: 'normal' },
            { roll: [5, 5], result: 'Good leadership, followers gain +3 to actions', type: 'success' },
            { roll: [6, 6], result: 'You inspire confidence, followers gain +3 to actions + extra action', type: 'success' },
            { roll: [7, 7], result: 'Excellent command, followers become fearless', type: 'success' },
            { roll: [8, 8], result: 'Masterful rally, followers gain +4 to all stats + double actions', type: 'critical' }
        ]
    },
    leadership_trained_d10: {
        name: 'Trained Leadership (d10)',
        description: 'Trained leadership on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'The challenge tests you, no effect', type: 'failure' },
            { roll: [2, 2], result: 'You struggle to inspire, followers hesitate', type: 'failure' },
            { roll: [3, 3], result: 'Your training barely helps, followers gain +1 to actions', type: 'failure' },
            { roll: [4, 4], result: 'You maintain control, followers gain +1 to actions', type: 'normal' },
            { roll: [5, 5], result: 'Adequate leadership, followers gain +2 to actions', type: 'normal' },
            { roll: [6, 6], result: 'You rally them, followers gain +2 to actions', type: 'normal' },
            { roll: [7, 7], result: 'Good command, followers gain +3 to actions', type: 'success' },
            { roll: [8, 8], result: 'You inspire them, followers gain +3 to actions + extra action', type: 'success' },
            { roll: [9, 9], result: 'Strong leadership, followers become fearless', type: 'success' },
            { roll: [10, 10], result: 'Exceptional rally, followers gain +4 to all stats + double actions', type: 'critical' }
        ]
    },
    leadership_trained_d12: {
        name: 'Trained Leadership (d12)',
        description: 'Trained leadership on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'The task is formidable, followers panic', type: 'failure' },
            { roll: [3, 4], result: 'You struggle to lead, no effect', type: 'failure' },
            { roll: [5, 6], result: 'Your training helps you persevere, followers gain +1 to actions', type: 'failure' },
            { roll: [7, 7], result: 'You barely maintain order, followers gain +1 to actions', type: 'normal' },
            { roll: [8, 8], result: 'Adequate command, followers gain +2 to actions', type: 'normal' },
            { roll: [9, 9], result: 'You rally them, followers gain +2 to actions', type: 'normal' },
            { roll: [10, 10], result: 'Good leadership, followers gain +3 to actions', type: 'success' },
            { roll: [11, 11], result: 'You inspire them, followers gain +3 to actions + extra action', type: 'success' },
            { roll: [12, 12], result: 'Strong command, followers become fearless', type: 'critical' }
        ]
    },
    leadership_trained_d20: {
        name: 'Trained Leadership (d20)',
        description: 'Trained leadership on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 3], result: 'The task is beyond your current ability, followers flee', type: 'failure' },
            { roll: [4, 5], result: 'You struggle to make any headway, followers panic', type: 'failure' },
            { roll: [6, 8], result: 'You make minimal progress, no effect', type: 'normal' },
            { roll: [9, 10], result: 'Your training helps you persevere, followers gain +1 to actions', type: 'normal' },
            { roll: [11, 13], result: 'You present solid leadership, followers gain +2 to actions', type: 'success' },
            { roll: [14, 16], result: 'Your skill is evident, followers gain +3 to actions', type: 'success' },
            { roll: [17, 18], result: 'You inspire them, followers gain +3 to actions + extra action', type: 'success' },
            { roll: [19, 19], result: 'Impressive command, followers become fearless', type: 'critical' },
            { roll: [20, 20], result: 'Miraculous rally, followers gain +4 to all stats + double actions', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    leadership_apprentice_d4: {
        name: 'Apprentice Leadership (d4)',
        description: 'Apprentice leadership on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You effortlessly inspire, followers gain +3 to actions + extra action', type: 'normal' },
            { roll: [2, 2], result: 'Your mastery is clear, followers become fearless', type: 'success' },
            { roll: [3, 3], result: 'You rally them completely, followers gain +4 to all stats + double actions', type: 'success' },
            { roll: [4, 4], result: 'Followers transcend limits, gain +5 to all stats + triple actions', type: 'success' }
        ]
    },
    leadership_apprentice_d6: {
        name: 'Apprentice Leadership (d6)',
        description: 'Apprentice leadership on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You make good progress, followers gain +2 to actions', type: 'normal' },
            { roll: [2, 2], result: 'Your skill is apparent, followers gain +3 to actions + extra action', type: 'success' },
            { roll: [3, 3], result: 'You build strong morale, followers become fearless', type: 'success' },
            { roll: [4, 4], result: 'Followers are thoroughly inspired, gain +4 to all stats + double actions', type: 'success' },
            { roll: [5, 5], result: 'Your expertise shines, followers gain +5 to all stats + triple actions', type: 'critical' },
            { roll: [6, 6], result: 'Perfect command, followers gain +6 to all stats + quadruple actions', type: 'critical' }
        ]
    },
    leadership_apprentice_d8: {
        name: 'Apprentice Leadership (d8)',
        description: 'Apprentice leadership on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor setback, followers gain +1 to actions', type: 'failure' },
            { roll: [2, 2], result: 'You maintain order, followers gain +2 to actions', type: 'normal' },
            { roll: [3, 3], result: 'Good leadership, followers gain +3 to actions', type: 'normal' },
            { roll: [4, 4], result: 'You inspire them, followers gain +3 to actions + extra action', type: 'normal' },
            { roll: [5, 5], result: 'Strong command, followers become fearless', type: 'success' },
            { roll: [6, 6], result: 'Excellent rally, followers gain +4 to all stats + double actions', type: 'success' },
            { roll: [7, 7], result: 'Masterful leadership, followers gain +5 to all stats + triple actions', type: 'success' },
            { roll: [8, 8], result: 'Legendary command, followers gain +6 to all stats + quadruple actions', type: 'critical' }
        ]
    },
    leadership_apprentice_d10: {
        name: 'Apprentice Leadership (d10)',
        description: 'Apprentice leadership on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'The challenge is difficult, no effect', type: 'failure' },
            { roll: [2, 2], result: 'You struggle slightly, followers gain +1 to actions', type: 'failure' },
            { roll: [3, 3], result: 'Your skill helps, followers gain +2 to actions', type: 'normal' },
            { roll: [4, 4], result: 'Adequate leadership, followers gain +2 to actions', type: 'normal' },
            { roll: [5, 5], result: 'You rally them, followers gain +3 to actions', type: 'normal' },
            { roll: [6, 6], result: 'Good command, followers gain +3 to actions + extra action', type: 'success' },
            { roll: [7, 7], result: 'You inspire them, followers become fearless', type: 'success' },
            { roll: [8, 8], result: 'Strong leadership, followers gain +4 to all stats + double actions', type: 'success' },
            { roll: [9, 9], result: 'Excellent rally, followers gain +5 to all stats + triple actions', type: 'success' },
            { roll: [10, 10], result: 'Masterful command, followers gain +6 to all stats + quadruple actions', type: 'critical' }
        ]
    },
    leadership_apprentice_d12: {
        name: 'Apprentice Leadership (d12)',
        description: 'Apprentice leadership on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 2], result: 'The task is formidable, followers hesitate', type: 'failure' },
            { roll: [3, 4], result: 'You struggle to inspire, no effect', type: 'failure' },
            { roll: [5, 6], result: 'Your skill helps you persevere, followers gain +1 to actions', type: 'normal' },
            { roll: [7, 7], result: 'You maintain control, followers gain +2 to actions', type: 'normal' },
            { roll: [8, 8], result: 'Good leadership, followers gain +3 to actions', type: 'normal' },
            { roll: [9, 9], result: 'You rally them, followers gain +3 to actions + extra action', type: 'success' },
            { roll: [10, 10], result: 'Strong command, followers become fearless', type: 'success' },
            { roll: [11, 11], result: 'Excellent leadership, followers gain +4 to all stats + double actions', type: 'success' },
            { roll: [12, 12], result: 'Masterful rally, followers gain +5 to all stats + triple actions', type: 'critical' }
        ]
    },
    leadership_apprentice_d20: {
        name: 'Apprentice Leadership (d20)',
        description: 'Apprentice leadership on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 3], result: 'The task is beyond your current ability, followers panic', type: 'failure' },
            { roll: [4, 5], result: 'You struggle to make any headway, no effect', type: 'failure' },
            { roll: [6, 8], result: 'You make minimal progress, followers gain +1 to actions', type: 'normal' },
            { roll: [9, 10], result: 'Your training helps you persevere, followers gain +2 to actions', type: 'normal' },
            { roll: [11, 13], result: 'You present solid leadership, followers gain +3 to actions', type: 'success' },
            { roll: [14, 16], result: 'Your skill is evident, followers gain +3 to actions + extra action', type: 'success' },
            { roll: [17, 18], result: 'You inspire them, followers become fearless', type: 'success' },
            { roll: [19, 19], result: 'Impressive command, followers gain +4 to all stats + double actions', type: 'critical' },
            { roll: [20, 20], result: 'Miraculous rally, followers gain +5 to all stats + triple actions', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    leadership_adept_d4: {
        name: 'Adept Leadership (d4)',
        description: 'Adept leadership on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Your unparalleled skill creates instant loyalty, followers gain +4 to all stats + double actions', type: 'success' },
            { roll: [2, 2], result: 'You inspire a movement, followers gain +5 to all stats + triple actions', type: 'critical' },
            { roll: [3, 3], result: 'Followers transcend limits, gain +6 to all stats + quadruple actions', type: 'critical' },
            { roll: [4, 4], result: 'Your words create legends, followers gain +7 to all stats + quintuple actions', type: 'critical' }
        ]
    },
    leadership_adept_d6: {
        name: 'Adept Leadership (d6)',
        description: 'Adept leadership on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You effortlessly inspire, followers gain +3 to actions + extra action', type: 'normal' },
            { roll: [2, 2], result: 'Your mastery is absolute, followers gain +4 to all stats + double actions', type: 'success' },
            { roll: [3, 3], result: 'You inspire them completely, followers gain +5 to all stats + triple actions', type: 'success' },
            { roll: [4, 4], result: 'Followers transcend limits, gain +6 to all stats + quadruple actions', type: 'success' },
            { roll: [5, 5], result: 'Your expertise creates legends, followers gain +7 to all stats + quintuple actions', type: 'critical' },
            { roll: [6, 6], result: 'Perfect command, followers gain +8 to all stats + unlimited actions', type: 'critical' }
        ]
    },
    leadership_adept_d8: {
        name: 'Adept Leadership (d8)',
        description: 'Adept leadership on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor challenge, followers gain +2 to actions', type: 'failure' },
            { roll: [2, 2], result: 'You maintain order, followers gain +3 to actions + extra action', type: 'normal' },
            { roll: [3, 3], result: 'Good leadership, followers become fearless', type: 'normal' },
            { roll: [4, 4], result: 'You inspire them, followers gain +4 to all stats + double actions', type: 'normal' },
            { roll: [5, 5], result: 'Strong command, followers gain +5 to all stats + triple actions', type: 'success' },
            { roll: [6, 6], result: 'Excellent rally, followers gain +6 to all stats + quadruple actions', type: 'success' },
            { roll: [7, 7], result: 'Masterful leadership, followers gain +7 to all stats + quintuple actions', type: 'success' },
            { roll: [8, 8], result: 'Legendary command, followers gain +8 to all stats + unlimited actions', type: 'critical' }
        ]
    },
    leadership_adept_d10: {
        name: 'Adept Leadership (d10)',
        description: 'Adept leadership on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'The challenge is formidable, followers gain +1 to actions', type: 'failure' },
            { roll: [2, 2], result: 'You make excellent progress, followers gain +2 to actions', type: 'failure' },
            { roll: [3, 3], result: 'Your skill helps you advance, followers gain +3 to actions + extra action', type: 'normal' },
            { roll: [4, 4], result: 'You expertly navigate difficulty, followers become fearless', type: 'normal' },
            { roll: [5, 6], result: 'Your mastery overcomes obstacles, followers gain +4 to all stats + double actions', type: 'success' },
            { roll: [7, 8], result: 'You inspire greatness, followers gain +5 to all stats + triple actions', type: 'success' },
            { roll: [9, 9], result: 'Excellent leadership, followers gain +6 to all stats + quadruple actions', type: 'success' },
            { roll: [10, 10], result: 'Masterful rally, followers gain +7 to all stats + quintuple actions', type: 'critical' }
        ]
    },
    leadership_adept_d12: {
        name: 'Adept Leadership (d12)',
        description: 'Adept leadership on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'The task is formidable, no effect', type: 'failure' },
            { roll: [2, 2], result: 'You struggle slightly, followers gain +1 to actions', type: 'failure' },
            { roll: [3, 3], result: 'Your skill helps, followers gain +2 to actions', type: 'normal' },
            { roll: [4, 4], result: 'You maintain control, followers gain +3 to actions + extra action', type: 'normal' },
            { roll: [5, 6], result: 'Good leadership, followers become fearless', type: 'normal' },
            { roll: [7, 8], result: 'You rally them, followers gain +4 to all stats + double actions', type: 'success' },
            { roll: [9, 9], result: 'Strong command, followers gain +5 to all stats + triple actions', type: 'success' },
            { roll: [10, 10], result: 'Excellent leadership, followers gain +6 to all stats + quadruple actions', type: 'success' },
            { roll: [11, 11], result: 'Masterful rally, followers gain +7 to all stats + quintuple actions', type: 'critical' },
            { roll: [12, 12], result: 'Legendary command, followers gain +8 to all stats + unlimited actions', type: 'critical' }
        ]
    },
    leadership_adept_d20: {
        name: 'Adept Leadership (d20)',
        description: 'Adept leadership on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 3], result: 'Even your mastery struggles with this challenge, followers hesitate', type: 'failure' },
            { roll: [4, 5], result: 'You make minimal progress despite your skill, no effect', type: 'failure' },
            { roll: [6, 8], result: 'Your expertise helps you advance slowly, followers gain +1 to actions', type: 'normal' },
            { roll: [9, 10], result: 'You persevere with your mastery, followers gain +2 to actions', type: 'normal' },
            { roll: [11, 13], result: 'Your skill overcomes obstacles, followers gain +3 to actions + extra action', type: 'success' },
            { roll: [14, 16], result: 'You inspire them, followers become fearless', type: 'success' },
            { roll: [17, 18], result: 'Strong leadership, followers gain +4 to all stats + double actions', type: 'success' },
            { roll: [19, 19], result: 'Impressive command, followers gain +5 to all stats + triple actions', type: 'critical' },
            { roll: [20, 20], result: 'Miraculous rally, followers gain +6 to all stats + quadruple actions', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    leadership_expert_d4: {
        name: 'Expert Leadership (d4)',
        description: 'Expert leadership on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Your legendary skill creates instant devotion, followers gain +5 to all stats + triple actions', type: 'success' },
            { roll: [2, 2], result: 'You inspire a revolution, followers gain +6 to all stats + quadruple actions', type: 'critical' },
            { roll: [3, 3], result: 'Followers transcend mortality, gain +7 to all stats + quintuple actions', type: 'critical' },
            { roll: [4, 4], result: 'Your words create gods, followers gain +10 to all stats + unlimited actions', type: 'critical' }
        ]
    },
    leadership_expert_d6: {
        name: 'Expert Leadership (d6)',
        description: 'Expert leadership on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You effortlessly command, followers gain +4 to all stats + double actions', type: 'normal' },
            { roll: [2, 2], result: 'Your mastery is legendary, followers gain +5 to all stats + triple actions', type: 'success' },
            { roll: [3, 3], result: 'You inspire transcendence, followers gain +6 to all stats + quadruple actions', type: 'success' },
            { roll: [4, 4], result: 'Followers become legends, gain +7 to all stats + quintuple actions', type: 'success' },
            { roll: [5, 5], result: 'Your expertise creates myths, followers gain +8 to all stats + unlimited actions', type: 'critical' },
            { roll: [6, 6], result: 'Perfect command, followers gain +10 to all stats + time stops for enemies', type: 'critical' }
        ]
    },
    leadership_expert_d8: {
        name: 'Expert Leadership (d8)',
        description: 'Expert leadership on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor setback, followers gain +3 to actions + extra action', type: 'failure' },
            { roll: [2, 2], result: 'You maintain order, followers become fearless', type: 'normal' },
            { roll: [3, 3], result: 'Good leadership, followers gain +4 to all stats + double actions', type: 'normal' },
            { roll: [4, 4], result: 'You inspire them, followers gain +5 to all stats + triple actions', type: 'normal' },
            { roll: [5, 5], result: 'Strong command, followers gain +6 to all stats + quadruple actions', type: 'success' },
            { roll: [6, 6], result: 'Excellent rally, followers gain +7 to all stats + quintuple actions', type: 'success' },
            { roll: [7, 7], result: 'Masterful leadership, followers gain +8 to all stats + unlimited actions', type: 'success' },
            { roll: [8, 8], result: 'Legendary command, followers gain +10 to all stats + time stops for enemies', type: 'critical' }
        ]
    },
    leadership_expert_d10: {
        name: 'Expert Leadership (d10)',
        description: 'Expert leadership on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'The challenge is formidable, followers gain +2 to actions', type: 'failure' },
            { roll: [2, 2], result: 'You make excellent progress, followers gain +3 to actions + extra action', type: 'failure' },
            { roll: [3, 3], result: 'Your skill helps you advance, followers become fearless', type: 'normal' },
            { roll: [4, 4], result: 'You expertly navigate difficulty, followers gain +4 to all stats + double actions', type: 'normal' },
            { roll: [5, 6], result: 'Your mastery overcomes obstacles, followers gain +5 to all stats + triple actions', type: 'success' },
            { roll: [7, 8], result: 'You inspire greatness, followers gain +6 to all stats + quadruple actions', type: 'success' },
            { roll: [9, 9], result: 'Excellent leadership, followers gain +7 to all stats + quintuple actions', type: 'success' },
            { roll: [10, 10], result: 'Masterful rally, followers gain +8 to all stats + unlimited actions', type: 'critical' }
        ]
    },
    leadership_expert_d12: {
        name: 'Expert Leadership (d12)',
        description: 'Expert leadership on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'The task is formidable, followers gain +1 to actions', type: 'failure' },
            { roll: [2, 2], result: 'You struggle slightly, followers gain +2 to actions', type: 'failure' },
            { roll: [3, 3], result: 'Your skill helps, followers gain +3 to actions + extra action', type: 'normal' },
            { roll: [4, 4], result: 'You maintain control, followers become fearless', type: 'normal' },
            { roll: [5, 6], result: 'Good leadership, followers gain +4 to all stats + double actions', type: 'normal' },
            { roll: [7, 8], result: 'You rally them, followers gain +5 to all stats + triple actions', type: 'success' },
            { roll: [9, 9], result: 'Strong command, followers gain +6 to all stats + quadruple actions', type: 'success' },
            { roll: [10, 10], result: 'Excellent leadership, followers gain +7 to all stats + quintuple actions', type: 'success' },
            { roll: [11, 11], result: 'Masterful rally, followers gain +8 to all stats + unlimited actions', type: 'critical' },
            { roll: [12, 12], result: 'Legendary command, followers gain +10 to all stats + time stops for enemies', type: 'critical' }
        ]
    },
    leadership_expert_d20: {
        name: 'Expert Leadership (d20)',
        description: 'Expert leadership on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 3], result: 'Even your legendary mastery is tested, no effect', type: 'failure' },
            { roll: [4, 5], result: 'You make slow progress despite your skill, followers gain +1 to actions', type: 'failure' },
            { roll: [6, 8], result: 'Your expertise helps you advance, followers gain +2 to actions', type: 'normal' },
            { roll: [9, 10], result: 'You persevere with mastery, followers gain +3 to actions + extra action', type: 'normal' },
            { roll: [11, 13], result: 'Your skill overcomes obstacles, followers become fearless', type: 'success' },
            { roll: [14, 16], result: 'You inspire them, followers gain +4 to all stats + double actions', type: 'success' },
            { roll: [17, 18], result: 'Strong leadership, followers gain +5 to all stats + triple actions', type: 'success' },
            { roll: [19, 19], result: 'Impressive command, followers gain +6 to all stats + quadruple actions', type: 'critical' },
            { roll: [20, 20], result: 'Miraculous rally, followers gain +7 to all stats + quintuple actions', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    leadership_master_d4: {
        name: 'Master Leadership (d4)',
        description: 'Master leadership on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Your unparalleled skill creates instant devotion, followers gain +6 to all stats + quadruple actions', type: 'success' },
            { roll: [2, 2], result: 'You inspire a divine movement, followers gain +7 to all stats + quintuple actions', type: 'critical' },
            { roll: [3, 3], result: 'Followers transcend mortality, gain +8 to all stats + unlimited actions', type: 'critical' },
            { roll: [4, 4], result: 'Your words create living legends, followers gain +10 to all stats + time stops for enemies + victory guaranteed', type: 'critical' }
        ]
    },
    leadership_master_d6: {
        name: 'Master Leadership (d6)',
        description: 'Master leadership on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You effortlessly command legends, followers gain +5 to all stats + triple actions', type: 'normal' },
            { roll: [2, 2], result: 'Your mastery is absolute, followers gain +6 to all stats + quadruple actions', type: 'success' },
            { roll: [3, 3], result: 'You inspire transcendence, followers gain +7 to all stats + quintuple actions', type: 'success' },
            { roll: [4, 4], result: 'Followers become myths, gain +8 to all stats + unlimited actions', type: 'success' },
            { roll: [5, 5], result: 'Your expertise creates gods, followers gain +10 to all stats + time stops for enemies', type: 'critical' },
            { roll: [6, 6], result: 'Perfect command, followers gain +10 to all stats + time stops for enemies + victory guaranteed', type: 'critical' }
        ]
    },
    leadership_master_d8: {
        name: 'Master Leadership (d8)',
        description: 'Master leadership on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor challenge, followers gain +4 to all stats + double actions', type: 'failure' },
            { roll: [2, 2], result: 'You maintain order, followers gain +5 to all stats + triple actions', type: 'normal' },
            { roll: [3, 3], result: 'Good leadership, followers gain +6 to all stats + quadruple actions', type: 'normal' },
            { roll: [4, 4], result: 'You inspire them, followers gain +7 to all stats + quintuple actions', type: 'normal' },
            { roll: [5, 5], result: 'Strong command, followers gain +8 to all stats + unlimited actions', type: 'success' },
            { roll: [6, 6], result: 'Excellent rally, followers gain +10 to all stats + time stops for enemies', type: 'success' },
            { roll: [7, 7], result: 'Masterful leadership, followers gain +10 to all stats + time stops for enemies + victory guaranteed', type: 'success' },
            { roll: [8, 8], result: 'Legendary command, followers ascend to godhood + enemies flee in terror', type: 'critical' }
        ]
    },
    leadership_master_d10: {
        name: 'Master Leadership (d10)',
        description: 'Master leadership on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'The challenge is formidable, followers gain +3 to actions + extra action', type: 'failure' },
            { roll: [2, 2], result: 'You make excellent progress, followers become fearless', type: 'failure' },
            { roll: [3, 3], result: 'Your skill helps you advance, followers gain +4 to all stats + double actions', type: 'normal' },
            { roll: [4, 4], result: 'You expertly navigate difficulty, followers gain +5 to all stats + triple actions', type: 'normal' },
            { roll: [5, 6], result: 'Your mastery overcomes obstacles, followers gain +6 to all stats + quadruple actions', type: 'success' },
            { roll: [7, 8], result: 'You inspire greatness, followers gain +7 to all stats + quintuple actions', type: 'success' },
            { roll: [9, 9], result: 'Excellent leadership, followers gain +8 to all stats + unlimited actions', type: 'success' },
            { roll: [10, 10], result: 'Masterful rally, followers gain +10 to all stats + time stops for enemies + victory guaranteed', type: 'critical' }
        ]
    },
    leadership_master_d12: {
        name: 'Master Leadership (d12)',
        description: 'Master leadership on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'The task is formidable, followers gain +2 to actions', type: 'failure' },
            { roll: [2, 2], result: 'You struggle slightly, followers gain +3 to actions + extra action', type: 'failure' },
            { roll: [3, 3], result: 'Your skill helps, followers become fearless', type: 'normal' },
            { roll: [4, 4], result: 'You maintain control, followers gain +4 to all stats + double actions', type: 'normal' },
            { roll: [5, 6], result: 'Good leadership, followers gain +5 to all stats + triple actions', type: 'normal' },
            { roll: [7, 8], result: 'You rally them, followers gain +6 to all stats + quadruple actions', type: 'success' },
            { roll: [9, 9], result: 'Strong command, followers gain +7 to all stats + quintuple actions', type: 'success' },
            { roll: [10, 10], result: 'Excellent leadership, followers gain +8 to all stats + unlimited actions', type: 'success' },
            { roll: [11, 11], result: 'Masterful rally, followers gain +10 to all stats + time stops for enemies', type: 'critical' },
            { roll: [12, 12], result: 'Legendary command, followers gain +10 to all stats + time stops for enemies + victory guaranteed', type: 'critical' }
        ]
    },
    leadership_master_d20: {
        name: 'Master Leadership (d20)',
        description: 'Master leadership on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 3], result: 'Even your legendary mastery is tested, followers gain +1 to actions', type: 'failure' },
            { roll: [4, 5], result: 'You make slow progress despite your skill, followers gain +2 to actions', type: 'failure' },
            { roll: [6, 8], result: 'Your expertise helps you advance, followers gain +3 to actions + extra action', type: 'normal' },
            { roll: [9, 10], result: 'You persevere with mastery, followers become fearless', type: 'normal' },
            { roll: [11, 13], result: 'Your skill overcomes obstacles, followers gain +4 to all stats + double actions', type: 'success' },
            { roll: [14, 16], result: 'You inspire them, followers gain +5 to all stats + triple actions', type: 'success' },
            { roll: [17, 18], result: 'Strong leadership, followers gain +6 to all stats + quadruple actions', type: 'success' },
            { roll: [19, 19], result: 'Impressive command, followers gain +7 to all stats + quintuple actions', type: 'critical' },
            { roll: [20, 20], result: 'Miraculous rally, followers gain +10 to all stats + time stops for enemies + victory guaranteed', type: 'critical' }
        ]
    },
};

