// Athletics Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total

export const ATHLETICS_TABLES = {
    // UNTRAINED - d4 through d20
    athletics_untrained_d4: {
        name: 'Untrained Athletics (d4)',
        description: 'Untrained athletics on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You slip and stumble, wasting effort', type: 'failure' },
            { roll: [2, 2], result: 'You complete the task clumsily', type: 'normal' },
            { roll: [3, 3], result: 'You succeed with basic form', type: 'success' },
            { roll: [4, 4], result: 'You manage surprisingly well', type: 'success' }
        ]
    },
    athletics_untrained_d6: {
        name: 'Untrained Athletics (d6)',
        description: 'Untrained athletics on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You lose your grip, take 1d4 damage', type: 'failure' },
            { roll: [2, 2], result: 'You twist your ankle, movement slowed', type: 'failure' },
            { roll: [3, 3], result: 'You barely make it, exhausted', type: 'normal' },
            { roll: [4, 4], result: 'You succeed but strain yourself', type: 'normal' },
            { roll: [5, 5], result: 'You complete the task adequately', type: 'success' },
            { roll: [6, 6], result: 'You perform with decent form', type: 'success' }
        ]
    },
    athletics_untrained_d8: {
        name: 'Untrained Athletics (d8)',
        description: 'Untrained athletics on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You fall badly, take 1d6 damage', type: 'failure' },
            { roll: [2, 2], result: 'You drop the object, it breaks', type: 'failure' },
            { roll: [3, 3], result: 'You fail the grapple, knocked prone', type: 'failure' },
            { roll: [4, 4], result: 'You exhaust yourself, -2 to next check', type: 'failure' },
            { roll: [5, 5], result: 'You succeed but land roughly', type: 'normal' },
            { roll: [6, 6], result: 'You make it, breathing heavily', type: 'normal' },
            { roll: [7, 7], result: 'You complete the task safely', type: 'success' },
            { roll: [8, 8], result: 'You manage with acceptable form', type: 'success' }
        ]
    },
    athletics_untrained_d10: {
        name: 'Untrained Athletics (d10)',
        description: 'Untrained athletics on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You collapse from strain, unconscious', type: 'failure' },
            { roll: [2, 2], result: 'You pull a muscle, take 1d6 damage', type: 'failure' },
            { roll: [3, 3], result: 'You lose balance, fall 10 feet', type: 'failure' },
            { roll: [4, 5], result: 'You fail completely, winded', type: 'failure' },
            { roll: [6, 6], result: 'You give up halfway, discouraged', type: 'failure' },
            { roll: [7, 7], result: 'You barely succeed, take 1d4 damage', type: 'normal' },
            { roll: [8, 8], result: 'You make it but severely strained', type: 'normal' },
            { roll: [9, 9], result: 'You succeed through sheer luck', type: 'success' },
            { roll: [10, 10], result: 'You complete it, surprised at yourself', type: 'success' }
        ]
    },
    athletics_untrained_d12: {
        name: 'Untrained Athletics (d12)',
        description: 'Untrained athletics on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You injure yourself badly, take 2d6 damage', type: 'failure' },
            { roll: [3, 4], result: 'You fail and fall, prone and winded', type: 'failure' },
            { roll: [5, 6], result: 'You lose your grip, drop everything', type: 'failure' },
            { roll: [7, 8], result: 'You cramp up, unable to continue', type: 'failure' },
            { roll: [9, 9], result: 'You fail but avoid injury', type: 'failure' },
            { roll: [10, 10], result: 'You barely survive the attempt', type: 'normal' },
            { roll: [11, 11], result: 'You succeed but take 1d4 damage', type: 'success' },
            { roll: [12, 12], result: 'Against odds, you make it', type: 'success' }
        ]
    },
    athletics_untrained_d20: {
        name: 'Untrained Athletics (d20)',
        description: 'Untrained athletics on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'You suffer catastrophic injury, 3d6 damage', type: 'failure' },
            { roll: [4, 6], result: 'You fail spectacularly, unconscious', type: 'failure' },
            { roll: [7, 9], result: 'You tear muscles, severe pain', type: 'failure' },
            { roll: [10, 12], result: 'You collapse in exhaustion', type: 'failure' },
            { roll: [13, 15], result: 'You fail and give up, demoralized', type: 'failure' },
            { roll: [16, 17], result: 'You fail but learn from it', type: 'failure' },
            { roll: [18, 18], result: 'You barely survive, take 2d4 damage', type: 'normal' },
            { roll: [19, 19], result: 'Miraculous success, but wounded', type: 'success' },
            { roll: [20, 20], result: 'Impossible luck carries you through', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    athletics_novice_d4: {
        name: 'Novice Athletics (d4)',
        description: 'Novice athletics on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You hesitate, wasting time', type: 'failure' },
            { roll: [2, 2], result: 'You succeed with effort', type: 'normal' },
            { roll: [3, 3], result: 'You perform competently', type: 'success' },
            { roll: [4, 4], result: 'You execute with confidence', type: 'success' }
        ]
    },
    athletics_novice_d6: {
        name: 'Novice Athletics (d6)',
        description: 'Novice athletics on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misjudge, minor setback', type: 'failure' },
            { roll: [2, 2], result: 'You succeed but awkwardly', type: 'normal' },
            { roll: [3, 3], result: 'You complete it steadily', type: 'normal' },
            { roll: [4, 4], result: 'You perform with good form', type: 'success' },
            { roll: [5, 5], result: 'You succeed smoothly', type: 'success' },
            { roll: [6, 6], result: 'You execute with growing skill', type: 'success' }
        ]
    },
    athletics_novice_d8: {
        name: 'Novice Athletics (d8)',
        description: 'Novice athletics on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You slip, take 1d4 damage', type: 'failure' },
            { roll: [2, 2], result: 'You lose momentum, must retry', type: 'failure' },
            { roll: [3, 3], result: 'You succeed but strained', type: 'normal' },
            { roll: [4, 4], result: 'You make it, slightly winded', type: 'normal' },
            { roll: [5, 5], result: 'You perform adequately', type: 'normal' },
            { roll: [6, 6], result: 'You succeed with solid technique', type: 'success' },
            { roll: [7, 7], result: 'You complete it confidently', type: 'success' },
            { roll: [8, 8], result: 'You show improving skill', type: 'success' }
        ]
    },
    athletics_novice_d10: {
        name: 'Novice Athletics (d10)',
        description: 'Novice athletics on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You falter badly, take 1d6 damage', type: 'failure' },
            { roll: [2, 3], result: 'You fail, exhausted', type: 'failure' },
            { roll: [4, 4], result: 'You lose your grip, must start over', type: 'failure' },
            { roll: [5, 5], result: 'You barely make it, winded', type: 'normal' },
            { roll: [6, 6], result: 'You succeed but take 1d4 damage', type: 'normal' },
            { roll: [7, 7], result: 'You complete it with effort', type: 'normal' },
            { roll: [8, 8], result: 'You succeed with decent form', type: 'success' },
            { roll: [9, 9], result: 'You perform capably', type: 'success' },
            { roll: [10, 10], result: 'You execute with confidence', type: 'critical' }
        ]
    },
    athletics_novice_d12: {
        name: 'Novice Athletics (d12)',
        description: 'Novice athletics on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'You fail and injure yourself, 1d8 damage', type: 'failure' },
            { roll: [3, 4], result: 'You collapse from strain', type: 'failure' },
            { roll: [5, 6], result: 'You give up, too difficult', type: 'failure' },
            { roll: [7, 7], result: 'You fail but avoid injury', type: 'failure' },
            { roll: [8, 8], result: 'You barely succeed, exhausted', type: 'normal' },
            { roll: [9, 9], result: 'You make it, severely winded', type: 'normal' },
            { roll: [10, 10], result: 'You succeed with determination', type: 'success' },
            { roll: [11, 11], result: 'You complete it, gaining confidence', type: 'success' },
            { roll: [12, 12], result: 'You perform admirably', type: 'critical' }
        ]
    },
    athletics_novice_d20: {
        name: 'Novice Athletics (d20)',
        description: 'Novice athletics on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'You injure yourself badly, 2d6 damage', type: 'failure' },
            { roll: [4, 6], result: 'You fail and fall, prone', type: 'failure' },
            { roll: [7, 9], result: 'You exhaust yourself completely', type: 'failure' },
            { roll: [10, 12], result: 'You give up, too challenging', type: 'failure' },
            { roll: [13, 14], result: 'You fail but learn something', type: 'failure' },
            { roll: [15, 16], result: 'You barely survive the attempt', type: 'normal' },
            { roll: [17, 17], result: 'You succeed, take 1d4 damage', type: 'normal' },
            { roll: [18, 18], result: 'You make it through determination', type: 'success' },
            { roll: [19, 19], result: 'You succeed, surprising yourself', type: 'success' },
            { roll: [20, 20], result: 'You perform beyond your skill level', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    athletics_trained_d4: {
        name: 'Trained Athletics (d4)',
        description: 'Trained athletics on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You overthink it, minor delay', type: 'failure' },
            { roll: [2, 2], result: 'You succeed routinely', type: 'normal' },
            { roll: [3, 3], result: 'You perform with practiced ease', type: 'success' },
            { roll: [4, 4], result: 'You execute flawlessly', type: 'success' }
        ]
    },
    athletics_trained_d6: {
        name: 'Trained Athletics (d6)',
        description: 'Trained athletics on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You stumble slightly, recover quickly', type: 'failure' },
            { roll: [2, 2], result: 'You succeed with minor effort', type: 'normal' },
            { roll: [3, 3], result: 'You complete it smoothly', type: 'normal' },
            { roll: [4, 4], result: 'You perform with good technique', type: 'success' },
            { roll: [5, 5], result: 'You execute with precision', type: 'success' },
            { roll: [6, 6], result: 'You demonstrate trained skill', type: 'success' }
        ]
    },
    athletics_trained_d8: {
        name: 'Trained Athletics (d8)',
        description: 'Trained athletics on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You misstep, minor setback', type: 'failure' },
            { roll: [2, 2], result: 'You succeed but awkwardly', type: 'normal' },
            { roll: [3, 3], result: 'You complete it steadily', type: 'normal' },
            { roll: [4, 4], result: 'You perform competently', type: 'normal' },
            { roll: [5, 5], result: 'You succeed with solid form', type: 'success' },
            { roll: [6, 6], result: 'You execute with confidence', type: 'success' },
            { roll: [7, 7], result: 'You perform skillfully', type: 'success' },
            { roll: [8, 8], result: 'You demonstrate trained prowess', type: 'critical' }
        ]
    },
    athletics_trained_d10: {
        name: 'Trained Athletics (d10)',
        description: 'Trained athletics on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You lose balance, stumble', type: 'failure' },
            { roll: [2, 2], result: 'You fail but recover quickly', type: 'failure' },
            { roll: [3, 3], result: 'You succeed with effort', type: 'normal' },
            { roll: [4, 4], result: 'You make it, slightly winded', type: 'normal' },
            { roll: [5, 5], result: 'You complete it steadily', type: 'normal' },
            { roll: [6, 6], result: 'You perform with good form', type: 'success' },
            { roll: [7, 7], result: 'You succeed confidently', type: 'success' },
            { roll: [8, 8], result: 'You execute with skill', type: 'success' },
            { roll: [9, 9], result: 'You perform impressively', type: 'success' },
            { roll: [10, 10], result: 'You demonstrate mastery', type: 'critical' }
        ]
    },
    athletics_trained_d12: {
        name: 'Trained Athletics (d12)',
        description: 'Trained athletics on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You slip, take 1d4 damage', type: 'failure' },
            { roll: [2, 3], result: 'You fail, must rest', type: 'failure' },
            { roll: [4, 4], result: 'You give up, too taxing', type: 'failure' },
            { roll: [5, 5], result: 'You barely succeed, exhausted', type: 'normal' },
            { roll: [6, 6], result: 'You make it, breathing hard', type: 'normal' },
            { roll: [7, 7], result: 'You succeed with determination', type: 'normal' },
            { roll: [8, 8], result: 'You complete it capably', type: 'success' },
            { roll: [9, 9], result: 'You perform with skill', type: 'success' },
            { roll: [10, 10], result: 'You execute admirably', type: 'success' },
            { roll: [11, 11], result: 'You succeed with flair', type: 'critical' },
            { roll: [12, 12], result: 'You perform exceptionally', type: 'critical' }
        ]
    },
    athletics_trained_d20: {
        name: 'Trained Athletics (d20)',
        description: 'Trained athletics on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'You fail and injure yourself, 1d8 damage', type: 'failure' },
            { roll: [3, 5], result: 'You collapse from exhaustion', type: 'failure' },
            { roll: [6, 8], result: 'You fail, too challenging', type: 'failure' },
            { roll: [9, 10], result: 'You give up, discouraged', type: 'failure' },
            { roll: [11, 12], result: 'You barely survive, winded', type: 'normal' },
            { roll: [13, 14], result: 'You succeed, take 1d4 damage', type: 'normal' },
            { roll: [15, 15], result: 'You make it through grit', type: 'normal' },
            { roll: [16, 16], result: 'You succeed with effort', type: 'success' },
            { roll: [17, 17], result: 'You perform capably', type: 'success' },
            { roll: [18, 18], result: 'You execute skillfully', type: 'success' },
            { roll: [19, 19], result: 'You succeed impressively', type: 'critical' },
            { roll: [20, 20], result: 'You perform at your peak', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    athletics_apprentice_d4: {
        name: 'Apprentice Athletics (d4)',
        description: 'Apprentice athletics on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You succeed effortlessly', type: 'success' },
            { roll: [3, 3], result: 'You perform with practiced grace', type: 'success' },
            { roll: [4, 4], result: 'You execute with perfect form', type: 'critical' }
        ]
    },
    athletics_apprentice_d6: {
        name: 'Apprentice Athletics (d6)',
        description: 'Apprentice athletics on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You succeed smoothly', type: 'normal' },
            { roll: [3, 3], result: 'You perform with ease', type: 'success' },
            { roll: [4, 4], result: 'You execute skillfully', type: 'success' },
            { roll: [5, 5], result: 'You demonstrate refined technique', type: 'success' },
            { roll: [6, 6], result: 'You perform with excellence', type: 'critical' }
        ]
    },
    athletics_apprentice_d8: {
        name: 'Apprentice Athletics (d8)',
        description: 'Apprentice athletics on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You complete it with effort', type: 'normal' },
            { roll: [3, 3], result: 'You succeed steadily', type: 'normal' },
            { roll: [4, 4], result: 'You perform competently', type: 'success' },
            { roll: [5, 5], result: 'You execute with precision', type: 'success' },
            { roll: [6, 6], result: 'You succeed with confidence', type: 'success' },
            { roll: [7, 7], result: 'You perform admirably', type: 'success' },
            { roll: [8, 8], result: 'You demonstrate refined skill', type: 'critical' }
        ]
    },
    athletics_apprentice_d10: {
        name: 'Apprentice Athletics (d10)',
        description: 'Apprentice athletics on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You slip slightly, recover', type: 'failure' },
            { roll: [2, 2], result: 'You succeed with effort', type: 'normal' },
            { roll: [3, 3], result: 'You make it, slightly winded', type: 'normal' },
            { roll: [4, 4], result: 'You complete it steadily', type: 'normal' },
            { roll: [5, 5], result: 'You perform capably', type: 'success' },
            { roll: [6, 6], result: 'You succeed with good form', type: 'success' },
            { roll: [7, 7], result: 'You execute skillfully', type: 'success' },
            { roll: [8, 8], result: 'You perform with precision', type: 'success' },
            { roll: [9, 9], result: 'You succeed impressively', type: 'critical' },
            { roll: [10, 10], result: 'You demonstrate mastery', type: 'critical' }
        ]
    },
    athletics_apprentice_d12: {
        name: 'Apprentice Athletics (d12)',
        description: 'Apprentice athletics on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You misstep, minor setback', type: 'failure' },
            { roll: [2, 2], result: 'You succeed with strain', type: 'normal' },
            { roll: [3, 3], result: 'You make it, breathing hard', type: 'normal' },
            { roll: [4, 4], result: 'You complete it with effort', type: 'normal' },
            { roll: [5, 5], result: 'You succeed steadily', type: 'normal' },
            { roll: [6, 6], result: 'You perform capably', type: 'success' },
            { roll: [7, 7], result: 'You execute with skill', type: 'success' },
            { roll: [8, 8], result: 'You succeed confidently', type: 'success' },
            { roll: [9, 9], result: 'You perform admirably', type: 'success' },
            { roll: [10, 10], result: 'You execute with precision', type: 'critical' },
            { roll: [11, 11], result: 'You succeed impressively', type: 'critical' },
            { roll: [12, 12], result: 'You demonstrate refined mastery', type: 'critical' }
        ]
    },
    athletics_apprentice_d20: {
        name: 'Apprentice Athletics (d20)',
        description: 'Apprentice athletics on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 2], result: 'You fail, take 1d6 damage', type: 'failure' },
            { roll: [3, 4], result: 'You collapse from strain', type: 'failure' },
            { roll: [5, 6], result: 'You give up, too taxing', type: 'failure' },
            { roll: [7, 8], result: 'You fail but avoid injury', type: 'failure' },
            { roll: [9, 10], result: 'You barely succeed, exhausted', type: 'normal' },
            { roll: [11, 12], result: 'You make it, severely winded', type: 'normal' },
            { roll: [13, 13], result: 'You succeed with determination', type: 'normal' },
            { roll: [14, 14], result: 'You complete it capably', type: 'success' },
            { roll: [15, 15], result: 'You perform with skill', type: 'success' },
            { roll: [16, 16], result: 'You execute admirably', type: 'success' },
            { roll: [17, 17], result: 'You succeed with precision', type: 'success' },
            { roll: [18, 18], result: 'You perform impressively', type: 'critical' },
            { roll: [19, 19], result: 'You demonstrate refined skill', type: 'critical' },
            { roll: [20, 20], result: 'You execute near-perfectly', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    athletics_adept_d4: {
        name: 'Adept Athletics (d4)',
        description: 'Adept athletics on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You perform with perfect ease', type: 'success' },
            { roll: [3, 3], result: 'You execute flawlessly', type: 'critical' },
            { roll: [4, 4], result: 'You demonstrate mastery', type: 'critical' }
        ]
    },
    athletics_adept_d6: {
        name: 'Adept Athletics (d6)',
        description: 'Adept athletics on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'You succeed with grace', type: 'success' },
            { roll: [3, 3], result: 'You perform with precision', type: 'success' },
            { roll: [4, 4], result: 'You execute with mastery', type: 'success' },
            { roll: [5, 5], result: 'You demonstrate excellence', type: 'critical' },
            { roll: [6, 6], result: 'You perform with perfect form', type: 'critical' }
        ]
    },
    athletics_adept_d8: {
        name: 'Adept Athletics (d8)',
        description: 'Adept athletics on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You complete it smoothly', type: 'success' },
            { roll: [3, 3], result: 'You perform capably', type: 'success' },
            { roll: [4, 4], result: 'You execute with skill', type: 'success' },
            { roll: [5, 5], result: 'You succeed with precision', type: 'success' },
            { roll: [6, 6], result: 'You perform admirably', type: 'success' },
            { roll: [7, 7], result: 'You demonstrate mastery', type: 'critical' },
            { roll: [8, 8], result: 'You execute with excellence', type: 'critical' }
        ]
    },
    athletics_adept_d10: {
        name: 'Adept Athletics (d10)',
        description: 'Adept athletics on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You complete it steadily', type: 'normal' },
            { roll: [3, 3], result: 'You perform capably', type: 'success' },
            { roll: [4, 4], result: 'You succeed with good form', type: 'success' },
            { roll: [5, 5], result: 'You execute skillfully', type: 'success' },
            { roll: [6, 6], result: 'You perform with precision', type: 'success' },
            { roll: [7, 7], result: 'You succeed confidently', type: 'success' },
            { roll: [8, 8], result: 'You execute admirably', type: 'success' },
            { roll: [9, 9], result: 'You demonstrate mastery', type: 'critical' },
            { roll: [10, 10], result: 'You perform with excellence', type: 'critical' }
        ]
    },
    athletics_adept_d12: {
        name: 'Adept Athletics (d12)',
        description: 'Adept athletics on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You complete it, slightly winded', type: 'normal' },
            { roll: [3, 3], result: 'You perform steadily', type: 'normal' },
            { roll: [4, 4], result: 'You succeed capably', type: 'success' },
            { roll: [5, 5], result: 'You execute with skill', type: 'success' },
            { roll: [6, 6], result: 'You perform with good form', type: 'success' },
            { roll: [7, 7], result: 'You succeed confidently', type: 'success' },
            { roll: [8, 8], result: 'You execute with precision', type: 'success' },
            { roll: [9, 9], result: 'You perform admirably', type: 'success' },
            { roll: [10, 10], result: 'You succeed impressively', type: 'critical' },
            { roll: [11, 11], result: 'You demonstrate mastery', type: 'critical' },
            { roll: [12, 12], result: 'You execute with excellence', type: 'critical' }
        ]
    },
    athletics_adept_d20: {
        name: 'Adept Athletics (d20)',
        description: 'Adept athletics on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You fail, minor setback', type: 'failure' },
            { roll: [2, 3], result: 'You give up, too challenging', type: 'failure' },
            { roll: [4, 5], result: 'You fail but learn from it', type: 'failure' },
            { roll: [6, 7], result: 'You barely succeed, exhausted', type: 'normal' },
            { roll: [8, 9], result: 'You make it, severely winded', type: 'normal' },
            { roll: [10, 11], result: 'You succeed with effort', type: 'normal' },
            { roll: [12, 12], result: 'You complete it steadily', type: 'normal' },
            { roll: [13, 13], result: 'You perform capably', type: 'success' },
            { roll: [14, 14], result: 'You execute with skill', type: 'success' },
            { roll: [15, 15], result: 'You succeed confidently', type: 'success' },
            { roll: [16, 16], result: 'You perform admirably', type: 'success' },
            { roll: [17, 17], result: 'You execute with precision', type: 'success' },
            { roll: [18, 18], result: 'You succeed impressively', type: 'critical' },
            { roll: [19, 19], result: 'You demonstrate mastery', type: 'critical' },
            { roll: [20, 20], result: 'You perform with excellence', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    athletics_expert_d4: {
        name: 'Expert Athletics (d4)',
        description: 'Expert athletics on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'You execute with perfect control', type: 'critical' },
            { roll: [3, 3], result: 'You demonstrate supreme mastery', type: 'critical' },
            { roll: [4, 4], result: 'You perform with flawless precision', type: 'critical' }
        ]
    },
    athletics_expert_d6: {
        name: 'Expert Athletics (d6)',
        description: 'Expert athletics on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You perform gracefully', type: 'success' },
            { roll: [3, 3], result: 'You execute with mastery', type: 'critical' },
            { roll: [4, 4], result: 'You demonstrate excellence', type: 'critical' },
            { roll: [5, 5], result: 'You perform with perfect form', type: 'critical' },
            { roll: [6, 6], result: 'You execute flawlessly', type: 'critical' }
        ]
    },
    athletics_expert_d8: {
        name: 'Expert Athletics (d8)',
        description: 'Expert athletics on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Slight error, execution falters', type: 'failure' },
            { roll: [2, 2], result: 'You perform capably', type: 'success' },
            { roll: [3, 3], result: 'You execute skillfully', type: 'success' },
            { roll: [4, 4], result: 'You succeed with precision', type: 'success' },
            { roll: [5, 5], result: 'You perform admirably', type: 'success' },
            { roll: [6, 6], result: 'You execute with mastery', type: 'critical' },
            { roll: [7, 7], result: 'You demonstrate excellence', type: 'critical' },
            { roll: [8, 8], result: 'You perform with perfect control', type: 'critical' }
        ]
    },
    athletics_expert_d10: {
        name: 'Expert Athletics (d10)',
        description: 'Expert athletics on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You complete it capably', type: 'success' },
            { roll: [3, 3], result: 'You perform with skill', type: 'success' },
            { roll: [4, 4], result: 'You execute confidently', type: 'success' },
            { roll: [5, 5], result: 'You succeed with precision', type: 'success' },
            { roll: [6, 6], result: 'You perform admirably', type: 'success' },
            { roll: [7, 7], result: 'You execute with mastery', type: 'success' },
            { roll: [8, 8], result: 'You succeed impressively', type: 'critical' },
            { roll: [9, 9], result: 'You demonstrate excellence', type: 'critical' },
            { roll: [10, 10], result: 'You perform with perfect form', type: 'critical' }
        ]
    },
    athletics_expert_d12: {
        name: 'Expert Athletics (d12)',
        description: 'Expert athletics on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You complete it steadily', type: 'normal' },
            { roll: [3, 3], result: 'You perform capably', type: 'success' },
            { roll: [4, 4], result: 'You execute with skill', type: 'success' },
            { roll: [5, 5], result: 'You succeed confidently', type: 'success' },
            { roll: [6, 6], result: 'You perform with precision', type: 'success' },
            { roll: [7, 7], result: 'You execute admirably', type: 'success' },
            { roll: [8, 8], result: 'You succeed with mastery', type: 'success' },
            { roll: [9, 9], result: 'You perform impressively', type: 'critical' },
            { roll: [10, 10], result: 'You execute with excellence', type: 'critical' },
            { roll: [11, 11], result: 'You demonstrate perfect control', type: 'critical' },
            { roll: [12, 12], result: 'You perform with flawless form', type: 'critical' }
        ]
    },
    athletics_expert_d20: {
        name: 'Expert Athletics (d20)',
        description: 'Expert athletics on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 2], result: 'You fail, unexpected difficulty', type: 'failure' },
            { roll: [3, 4], result: 'You give up, too taxing', type: 'failure' },
            { roll: [5, 6], result: 'You barely succeed, exhausted', type: 'normal' },
            { roll: [7, 8], result: 'You make it, winded', type: 'normal' },
            { roll: [9, 10], result: 'You succeed with effort', type: 'normal' },
            { roll: [11, 11], result: 'You complete it steadily', type: 'normal' },
            { roll: [12, 12], result: 'You perform capably', type: 'success' },
            { roll: [13, 13], result: 'You execute with skill', type: 'success' },
            { roll: [14, 14], result: 'You succeed confidently', type: 'success' },
            { roll: [15, 15], result: 'You perform with precision', type: 'success' },
            { roll: [16, 16], result: 'You execute admirably', type: 'success' },
            { roll: [17, 17], result: 'You succeed with mastery', type: 'critical' },
            { roll: [18, 18], result: 'You perform impressively', type: 'critical' },
            { roll: [19, 19], result: 'You demonstrate excellence', type: 'critical' },
            { roll: [20, 20], result: 'You execute with perfect control', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    athletics_master_d4: {
        name: 'Master Athletics (d4)',
        description: 'Master athletics on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You execute with supreme mastery', type: 'critical' },
            { roll: [3, 3], result: 'You demonstrate perfect control', type: 'critical' },
            { roll: [4, 4], result: 'You perform with flawless precision', type: 'critical' }
        ]
    },
    athletics_master_d6: {
        name: 'Master Athletics (d6)',
        description: 'Master athletics on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'You perform with grace', type: 'critical' },
            { roll: [3, 3], result: 'You execute with mastery', type: 'critical' },
            { roll: [4, 4], result: 'You demonstrate excellence', type: 'critical' },
            { roll: [5, 5], result: 'You perform with perfect form', type: 'critical' },
            { roll: [6, 6], result: 'You execute with supreme control', type: 'critical' }
        ]
    },
    athletics_master_d8: {
        name: 'Master Athletics (d8)',
        description: 'Master athletics on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Slight error, execution falters', type: 'failure' },
            { roll: [2, 2], result: 'You execute skillfully', type: 'success' },
            { roll: [3, 3], result: 'You succeed with precision', type: 'success' },
            { roll: [4, 4], result: 'You perform admirably', type: 'critical' },
            { roll: [5, 5], result: 'You execute with mastery', type: 'critical' },
            { roll: [6, 6], result: 'You demonstrate excellence', type: 'critical' },
            { roll: [7, 7], result: 'You perform with perfect control', type: 'critical' },
            { roll: [8, 8], result: 'You execute with flawless form', type: 'critical' }
        ]
    },
    athletics_master_d10: {
        name: 'Master Athletics (d10)',
        description: 'Master athletics on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You perform with skill', type: 'success' },
            { roll: [3, 3], result: 'You execute confidently', type: 'success' },
            { roll: [4, 4], result: 'You succeed with precision', type: 'success' },
            { roll: [5, 5], result: 'You perform admirably', type: 'success' },
            { roll: [6, 6], result: 'You execute with mastery', type: 'critical' },
            { roll: [7, 7], result: 'You succeed impressively', type: 'critical' },
            { roll: [8, 8], result: 'You demonstrate excellence', type: 'critical' },
            { roll: [9, 9], result: 'You perform with perfect form', type: 'critical' },
            { roll: [10, 10], result: 'You execute with supreme control', type: 'critical' }
        ]
    },
    athletics_master_d12: {
        name: 'Master Athletics (d12)',
        description: 'Master athletics on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You complete it capably', type: 'success' },
            { roll: [3, 3], result: 'You perform with skill', type: 'success' },
            { roll: [4, 4], result: 'You execute confidently', type: 'success' },
            { roll: [5, 5], result: 'You succeed with precision', type: 'success' },
            { roll: [6, 6], result: 'You perform admirably', type: 'success' },
            { roll: [7, 7], result: 'You execute with mastery', type: 'critical' },
            { roll: [8, 8], result: 'You succeed impressively', type: 'critical' },
            { roll: [9, 9], result: 'You demonstrate excellence', type: 'critical' },
            { roll: [10, 10], result: 'You perform with perfect control', type: 'critical' },
            { roll: [11, 11], result: 'You execute with flawless form', type: 'critical' },
            { roll: [12, 12], result: 'You demonstrate supreme mastery', type: 'critical' }
        ]
    },
    athletics_master_d20: {
        name: 'Master Athletics (d20)',
        description: 'Master athletics on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You fail, rare misjudgment', type: 'failure' },
            { roll: [2, 3], result: 'You barely succeed, winded', type: 'normal' },
            { roll: [4, 5], result: 'You make it with effort', type: 'normal' },
            { roll: [6, 7], result: 'You succeed steadily', type: 'normal' },
            { roll: [8, 9], result: 'You complete it capably', type: 'success' },
            { roll: [10, 10], result: 'You perform with skill', type: 'success' },
            { roll: [11, 11], result: 'You execute confidently', type: 'success' },
            { roll: [12, 12], result: 'You succeed with precision', type: 'success' },
            { roll: [13, 13], result: 'You perform admirably', type: 'success' },
            { roll: [14, 14], result: 'You execute with mastery', type: 'success' },
            { roll: [15, 15], result: 'You succeed impressively', type: 'critical' },
            { roll: [16, 16], result: 'You demonstrate excellence', type: 'critical' },
            { roll: [17, 17], result: 'You perform with perfect control', type: 'critical' },
            { roll: [18, 18], result: 'You execute with flawless form', type: 'critical' },
            { roll: [19, 19], result: 'You demonstrate supreme mastery', type: 'critical' },
            { roll: [20, 20], result: 'You perform at the peak of mortal ability', type: 'critical' }
        ]
    }
};

