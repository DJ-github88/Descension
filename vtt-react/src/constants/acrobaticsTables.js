// Acrobatics Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total

export const ACROBATICS_TABLES = {
    // UNTRAINED - d4 through d20
    acrobatics_untrained_d4: {
        name: 'Untrained Acrobatics (d4)',
        description: 'Untrained acrobatics on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You trip over your own feet', type: 'failure' },
            { roll: [2, 2], result: 'You stumble but catch yourself', type: 'normal' },
            { roll: [3, 3], result: 'You manage the movement awkwardly', type: 'success' },
            { roll: [4, 4], result: 'You complete it with clumsy grace', type: 'success' }
        ]
    },
    acrobatics_untrained_d6: {
        name: 'Untrained Acrobatics (d6)',
        description: 'Untrained acrobatics on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You fall flat on your face, take 1d4 damage', type: 'failure' },
            { roll: [2, 2], result: 'You lose balance and stumble backward', type: 'failure' },
            { roll: [3, 3], result: 'You barely keep your footing', type: 'normal' },
            { roll: [4, 4], result: 'You wobble but stay upright', type: 'normal' },
            { roll: [5, 5], result: 'You land ungracefully but safely', type: 'success' },
            { roll: [6, 6], result: 'You manage a sloppy recovery', type: 'success' }
        ]
    },
    acrobatics_untrained_d8: {
        name: 'Untrained Acrobatics (d8)',
        description: 'Untrained acrobatics on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You crash down hard, take 1d6 damage', type: 'failure' },
            { roll: [2, 2], result: 'You twist your ankle painfully', type: 'failure' },
            { roll: [3, 3], result: 'You slip and fall prone', type: 'failure' },
            { roll: [4, 4], result: 'You mistime the movement, -2 to next action', type: 'failure' },
            { roll: [5, 5], result: 'You land roughly, winded', type: 'normal' },
            { roll: [6, 6], result: 'You recover late but avoid injury', type: 'normal' },
            { roll: [7, 7], result: 'You complete it with effort', type: 'success' },
            { roll: [8, 8], result: 'You succeed despite poor form', type: 'success' }
        ]
    },
    acrobatics_untrained_d10: {
        name: 'Untrained Acrobatics (d10)',
        description: 'Untrained acrobatics on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You collide with an obstacle, take 1d8 damage', type: 'failure' },
            { roll: [2, 2], result: 'You fall badly, prone and stunned', type: 'failure' },
            { roll: [3, 3], result: 'You lose all momentum, fall 10 feet', type: 'failure' },
            { roll: [4, 5], result: 'You panic mid-movement, freeze up', type: 'failure' },
            { roll: [6, 6], result: 'You fail and draw unwanted attention', type: 'failure' },
            { roll: [7, 7], result: 'You barely make it, take 1d4 damage', type: 'normal' },
            { roll: [8, 8], result: 'You succeed but lose your balance', type: 'normal' },
            { roll: [9, 9], result: 'You pull it off through luck', type: 'success' },
            { roll: [10, 10], result: 'You succeed, surprising yourself', type: 'success' }
        ]
    },
    acrobatics_untrained_d12: {
        name: 'Untrained Acrobatics (d12)',
        description: 'Untrained acrobatics on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You crash spectacularly, take 2d6 damage', type: 'failure' },
            { roll: [3, 4], result: 'You fall and tumble uncontrollably', type: 'failure' },
            { roll: [5, 6], result: 'You slip off completely, prone', type: 'failure' },
            { roll: [7, 8], result: 'You freeze in fear, unable to move', type: 'failure' },
            { roll: [9, 9], result: 'You fail but avoid serious injury', type: 'failure' },
            { roll: [10, 10], result: 'You barely survive the attempt', type: 'normal' },
            { roll: [11, 11], result: 'You succeed but take 1d4 damage', type: 'success' },
            { roll: [12, 12], result: 'Against all odds, you make it', type: 'success' }
        ]
    },
    acrobatics_untrained_d20: {
        name: 'Untrained Acrobatics (d20)',
        description: 'Untrained acrobatics on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'You plummet catastrophically, 3d6 damage', type: 'failure' },
            { roll: [4, 6], result: 'You fail and knock yourself unconscious', type: 'failure' },
            { roll: [7, 9], result: 'You twist multiple limbs, severe pain', type: 'failure' },
            { roll: [10, 12], result: 'You collapse in exhaustion and fear', type: 'failure' },
            { roll: [13, 15], result: 'You give up mid-attempt, demoralized', type: 'failure' },
            { roll: [16, 17], result: 'You fail but learn your limits', type: 'failure' },
            { roll: [18, 18], result: 'You barely survive, take 2d4 damage', type: 'normal' },
            { roll: [19, 19], result: 'Miraculous success, but wounded', type: 'success' },
            { roll: [20, 20], result: 'Impossible luck carries you through', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    acrobatics_novice_d4: {
        name: 'Novice Acrobatics (d4)',
        description: 'Novice acrobatics on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misstep slightly', type: 'failure' },
            { roll: [2, 2], result: 'You complete it with basic control', type: 'normal' },
            { roll: [3, 3], result: 'You land with decent balance', type: 'success' },
            { roll: [4, 4], result: 'You execute it smoothly', type: 'success' }
        ]
    },
    acrobatics_novice_d6: {
        name: 'Novice Acrobatics (d6)',
        description: 'Novice acrobatics on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You stumble and lose momentum', type: 'failure' },
            { roll: [2, 2], result: 'You land awkwardly, -1 to next action', type: 'failure' },
            { roll: [3, 3], result: 'You maintain your footing', type: 'normal' },
            { roll: [4, 4], result: 'You recover with basic technique', type: 'normal' },
            { roll: [5, 5], result: 'You land cleanly', type: 'success' },
            { roll: [6, 6], result: 'You execute with controlled grace', type: 'success' }
        ]
    },
    acrobatics_novice_d8: {
        name: 'Novice Acrobatics (d8)',
        description: 'Novice acrobatics on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You slip and fall prone', type: 'failure' },
            { roll: [2, 2], result: 'You lose balance, take 1d4 damage', type: 'failure' },
            { roll: [3, 3], result: 'You mistime the jump', type: 'failure' },
            { roll: [4, 4], result: 'You land off-target', type: 'failure' },
            { roll: [5, 5], result: 'You complete it with effort', type: 'normal' },
            { roll: [6, 6], result: 'You land safely but ungracefully', type: 'normal' },
            { roll: [7, 7], result: 'You execute with good form', type: 'success' },
            { roll: [8, 8], result: 'You land with stable balance', type: 'success' }
        ]
    },
    acrobatics_novice_d10: {
        name: 'Novice Acrobatics (d10)',
        description: 'Novice acrobatics on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You fall hard, take 1d6 damage', type: 'failure' },
            { roll: [2, 2], result: 'You collide with surface, stunned', type: 'failure' },
            { roll: [3, 3], result: 'You slip off balance completely', type: 'failure' },
            { roll: [4, 5], result: 'You fail to maintain control', type: 'failure' },
            { roll: [6, 6], result: 'You barely avoid falling', type: 'failure' },
            { roll: [7, 7], result: 'You land roughly but safely', type: 'normal' },
            { roll: [8, 8], result: 'You recover with minor strain', type: 'normal' },
            { roll: [9, 9], result: 'You complete it with control', type: 'success' },
            { roll: [10, 10], result: 'You land with practiced ease', type: 'success' }
        ]
    },
    acrobatics_novice_d12: {
        name: 'Novice Acrobatics (d12)',
        description: 'Novice acrobatics on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'You crash down, take 1d8 damage', type: 'failure' },
            { roll: [3, 4], result: 'You fall and tumble badly', type: 'failure' },
            { roll: [5, 6], result: 'You lose grip and slip', type: 'failure' },
            { roll: [7, 8], result: 'You fail but avoid injury', type: 'failure' },
            { roll: [9, 9], result: 'You barely hold on', type: 'normal' },
            { roll: [10, 10], result: 'You succeed with visible effort', type: 'normal' },
            { roll: [11, 11], result: 'You land with good technique', type: 'success' },
            { roll: [12, 12], result: 'You execute it confidently', type: 'success' }
        ]
    },
    acrobatics_novice_d20: {
        name: 'Novice Acrobatics (d20)',
        description: 'Novice acrobatics on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'You fall catastrophically, 2d6 damage', type: 'failure' },
            { roll: [4, 6], result: 'You crash and get knocked prone', type: 'failure' },
            { roll: [7, 9], result: 'You twist a limb, severe pain', type: 'failure' },
            { roll: [10, 12], result: 'You lose all momentum', type: 'failure' },
            { roll: [13, 15], result: 'You fail but stay conscious', type: 'failure' },
            { roll: [16, 17], result: 'You barely make it, winded', type: 'normal' },
            { roll: [18, 18], result: 'You succeed with strain', type: 'normal' },
            { roll: [19, 19], result: 'You land with controlled precision', type: 'success' },
            { roll: [20, 20], result: 'You execute it flawlessly', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    acrobatics_trained_d4: {
        name: 'Trained Acrobatics (d4)',
        description: 'Trained acrobatics on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You hesitate briefly', type: 'failure' },
            { roll: [2, 2], result: 'You complete it effortlessly', type: 'normal' },
            { roll: [3, 3], result: 'You land with fluid grace', type: 'success' },
            { roll: [4, 4], result: 'You execute it perfectly', type: 'success' }
        ]
    },
    acrobatics_trained_d6: {
        name: 'Trained Acrobatics (d6)',
        description: 'Trained acrobatics on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You misjudge slightly', type: 'failure' },
            { roll: [2, 2], result: 'You land with minor imbalance', type: 'failure' },
            { roll: [3, 3], result: 'You maintain steady control', type: 'normal' },
            { roll: [4, 4], result: 'You execute with practiced ease', type: 'normal' },
            { roll: [5, 5], result: 'You land with elegant balance', type: 'success' },
            { roll: [6, 6], result: 'You flow through the movement', type: 'success' }
        ]
    },
    acrobatics_trained_d8: {
        name: 'Trained Acrobatics (d8)',
        description: 'Trained acrobatics on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You slip and stumble', type: 'failure' },
            { roll: [2, 2], result: 'You lose footing momentarily', type: 'failure' },
            { roll: [3, 3], result: 'You land off-center', type: 'failure' },
            { roll: [4, 4], result: 'You recover with effort', type: 'failure' },
            { roll: [5, 5], result: 'You complete it smoothly', type: 'normal' },
            { roll: [6, 6], result: 'You land with controlled precision', type: 'normal' },
            { roll: [7, 7], result: 'You execute with agile grace', type: 'success' },
            { roll: [8, 8], result: 'You land in perfect balance', type: 'success' }
        ]
    },
    acrobatics_trained_d10: {
        name: 'Trained Acrobatics (d10)',
        description: 'Trained acrobatics on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You misjudge the distance', type: 'failure' },
            { roll: [2, 2], result: 'You slip off balance', type: 'failure' },
            { roll: [3, 3], result: 'You land awkwardly', type: 'failure' },
            { roll: [4, 5], result: 'You lose momentum', type: 'failure' },
            { roll: [6, 6], result: 'You barely maintain control', type: 'failure' },
            { roll: [7, 7], result: 'You land safely with effort', type: 'normal' },
            { roll: [8, 8], result: 'You execute with good technique', type: 'normal' },
            { roll: [9, 9], result: 'You complete it with fluid motion', type: 'success' },
            { roll: [10, 10], result: 'You land with impressive control', type: 'success' }
        ]
    },
    acrobatics_trained_d12: {
        name: 'Trained Acrobatics (d12)',
        description: 'Trained acrobatics on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'You fall and take 1d6 damage', type: 'failure' },
            { roll: [3, 4], result: 'You lose grip and slip', type: 'failure' },
            { roll: [5, 6], result: 'You fail to maintain balance', type: 'failure' },
            { roll: [7, 8], result: 'You barely avoid falling', type: 'failure' },
            { roll: [9, 9], result: 'You succeed with visible strain', type: 'normal' },
            { roll: [10, 10], result: 'You land with controlled effort', type: 'normal' },
            { roll: [11, 11], result: 'You execute with practiced skill', type: 'success' },
            { roll: [12, 12], result: 'You land with elegant precision', type: 'success' }
        ]
    },
    acrobatics_trained_d20: {
        name: 'Trained Acrobatics (d20)',
        description: 'Trained acrobatics on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 3], result: 'You fall badly, take 2d6 damage', type: 'failure' },
            { roll: [4, 6], result: 'You crash and get stunned', type: 'failure' },
            { roll: [7, 9], result: 'You slip and fall prone', type: 'failure' },
            { roll: [10, 12], result: 'You lose all control', type: 'failure' },
            { roll: [13, 15], result: 'You fail but avoid injury', type: 'failure' },
            { roll: [16, 17], result: 'You barely succeed, winded', type: 'normal' },
            { roll: [18, 18], result: 'You complete it with effort', type: 'normal' },
            { roll: [19, 19], result: 'You land with skilled precision', type: 'success' },
            { roll: [20, 20], result: 'You execute it with grace', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    acrobatics_apprentice_d4: {
        name: 'Apprentice Acrobatics (d4)',
        description: 'Apprentice acrobatics on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You complete it without thought', type: 'failure' },
            { roll: [2, 2], result: 'You execute it instinctively', type: 'normal' },
            { roll: [3, 3], result: 'You flow through it gracefully', type: 'success' },
            { roll: [4, 4], result: 'You land with effortless precision', type: 'success' }
        ]
    },
    acrobatics_apprentice_d6: {
        name: 'Apprentice Acrobatics (d6)',
        description: 'Apprentice acrobatics on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You overcorrect slightly', type: 'failure' },
            { roll: [2, 2], result: 'You land with minor adjustment', type: 'failure' },
            { roll: [3, 3], result: 'You execute with smooth control', type: 'normal' },
            { roll: [4, 4], result: 'You land with practiced grace', type: 'normal' },
            { roll: [5, 5], result: 'You complete it with fluid motion', type: 'success' },
            { roll: [6, 6], result: 'You execute it with elegant ease', type: 'success' }
        ]
    },
    acrobatics_apprentice_d8: {
        name: 'Apprentice Acrobatics (d8)',
        description: 'Apprentice acrobatics on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You misjudge the angle', type: 'failure' },
            { roll: [2, 2], result: 'You land off-balance', type: 'failure' },
            { roll: [3, 3], result: 'You recover with effort', type: 'failure' },
            { roll: [4, 4], result: 'You complete it adequately', type: 'failure' },
            { roll: [5, 5], result: 'You land with controlled precision', type: 'normal' },
            { roll: [6, 6], result: 'You execute with skilled technique', type: 'normal' },
            { roll: [7, 7], result: 'You flow through it gracefully', type: 'success' },
            { roll: [8, 8], result: 'You land with impressive balance', type: 'success' }
        ]
    },
    acrobatics_apprentice_d10: {
        name: 'Apprentice Acrobatics (d10)',
        description: 'Apprentice acrobatics on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You slip and fall', type: 'failure' },
            { roll: [2, 2], result: 'You lose your grip', type: 'failure' },
            { roll: [3, 3], result: 'You land roughly', type: 'failure' },
            { roll: [4, 5], result: 'You barely maintain balance', type: 'failure' },
            { roll: [6, 6], result: 'You recover with strain', type: 'failure' },
            { roll: [7, 7], result: 'You land safely with effort', type: 'normal' },
            { roll: [8, 8], result: 'You execute with good control', type: 'normal' },
            { roll: [9, 9], result: 'You complete it with agile grace', type: 'success' },
            { roll: [10, 10], result: 'You land with precise control', type: 'success' }
        ]
    },
    acrobatics_apprentice_d12: {
        name: 'Apprentice Acrobatics (d12)',
        description: 'Apprentice acrobatics on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 2], result: 'You fall and take 1d6 damage', type: 'failure' },
            { roll: [3, 4], result: 'You slip off completely', type: 'failure' },
            { roll: [5, 6], result: 'You lose momentum', type: 'failure' },
            { roll: [7, 8], result: 'You barely hold on', type: 'failure' },
            { roll: [9, 9], result: 'You succeed with visible effort', type: 'normal' },
            { roll: [10, 10], result: 'You land with controlled technique', type: 'normal' },
            { roll: [11, 11], result: 'You execute with skilled precision', type: 'success' },
            { roll: [12, 12], result: 'You land with graceful control', type: 'success' }
        ]
    },
    acrobatics_apprentice_d20: {
        name: 'Apprentice Acrobatics (d20)',
        description: 'Apprentice acrobatics on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 3], result: 'You crash down, take 2d6 damage', type: 'failure' },
            { roll: [4, 6], result: 'You fall and get stunned', type: 'failure' },
            { roll: [7, 9], result: 'You slip and tumble', type: 'failure' },
            { roll: [10, 12], result: 'You lose all control', type: 'failure' },
            { roll: [13, 15], result: 'You fail but stay upright', type: 'failure' },
            { roll: [16, 17], result: 'You barely succeed, strained', type: 'normal' },
            { roll: [18, 18], result: 'You complete it with effort', type: 'normal' },
            { roll: [19, 19], result: 'You land with skilled control', type: 'success' },
            { roll: [20, 20], result: 'You execute with impressive grace', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    acrobatics_adept_d4: {
        name: 'Adept Acrobatics (d4)',
        description: 'Adept acrobatics on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You execute it reflexively', type: 'failure' },
            { roll: [2, 2], result: 'You complete it with ease', type: 'normal' },
            { roll: [3, 3], result: 'You flow through it naturally', type: 'success' },
            { roll: [4, 4], result: 'You land with perfect balance', type: 'success' }
        ]
    },
    acrobatics_adept_d6: {
        name: 'Adept Acrobatics (d6)',
        description: 'Adept acrobatics on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You overestimate slightly', type: 'failure' },
            { roll: [2, 2], result: 'You land with minor correction', type: 'failure' },
            { roll: [3, 3], result: 'You execute with fluid control', type: 'normal' },
            { roll: [4, 4], result: 'You land with elegant precision', type: 'normal' },
            { roll: [5, 5], result: 'You complete it with graceful ease', type: 'success' },
            { roll: [6, 6], result: 'You execute it with refined technique', type: 'success' }
        ]
    },
    acrobatics_adept_d8: {
        name: 'Adept Acrobatics (d8)',
        description: 'Adept acrobatics on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You misjudge the timing', type: 'failure' },
            { roll: [2, 2], result: 'You land with imbalance', type: 'failure' },
            { roll: [3, 3], result: 'You recover quickly', type: 'failure' },
            { roll: [4, 4], result: 'You complete it smoothly', type: 'failure' },
            { roll: [5, 5], result: 'You land with precise control', type: 'normal' },
            { roll: [6, 6], result: 'You execute with refined skill', type: 'normal' },
            { roll: [7, 7], result: 'You flow through it with grace', type: 'success' },
            { roll: [8, 8], result: 'You land with exceptional balance', type: 'success' }
        ]
    },
    acrobatics_adept_d10: {
        name: 'Adept Acrobatics (d10)',
        description: 'Adept acrobatics on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You slip unexpectedly', type: 'failure' },
            { roll: [2, 2], result: 'You lose your footing', type: 'failure' },
            { roll: [3, 3], result: 'You land awkwardly', type: 'failure' },
            { roll: [4, 5], result: 'You maintain balance with effort', type: 'failure' },
            { roll: [6, 6], result: 'You recover with skill', type: 'failure' },
            { roll: [7, 7], result: 'You land safely with control', type: 'normal' },
            { roll: [8, 8], result: 'You execute with practiced precision', type: 'normal' },
            { roll: [9, 9], result: 'You complete it with fluid grace', type: 'success' },
            { roll: [10, 10], result: 'You land with masterful control', type: 'success' }
        ]
    },
    acrobatics_adept_d12: {
        name: 'Adept Acrobatics (d12)',
        description: 'Adept acrobatics on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 2], result: 'You fall, take 1d6 damage', type: 'failure' },
            { roll: [3, 4], result: 'You slip off balance', type: 'failure' },
            { roll: [5, 6], result: 'You lose momentum', type: 'failure' },
            { roll: [7, 8], result: 'You barely maintain control', type: 'failure' },
            { roll: [9, 9], result: 'You succeed with effort', type: 'normal' },
            { roll: [10, 10], result: 'You land with skilled technique', type: 'normal' },
            { roll: [11, 11], result: 'You execute with refined precision', type: 'success' },
            { roll: [12, 12], result: 'You land with elegant control', type: 'success' }
        ]
    },
    acrobatics_adept_d20: {
        name: 'Adept Acrobatics (d20)',
        description: 'Adept acrobatics on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 3], result: 'You crash, take 2d6 damage', type: 'failure' },
            { roll: [4, 6], result: 'You fall and get stunned', type: 'failure' },
            { roll: [7, 9], result: 'You slip and tumble', type: 'failure' },
            { roll: [10, 12], result: 'You lose control', type: 'failure' },
            { roll: [13, 15], result: 'You fail but recover', type: 'failure' },
            { roll: [16, 17], result: 'You barely succeed', type: 'normal' },
            { roll: [18, 18], result: 'You complete it with strain', type: 'normal' },
            { roll: [19, 19], result: 'You land with refined control', type: 'success' },
            { roll: [20, 20], result: 'You execute with remarkable grace', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    acrobatics_expert_d4: {
        name: 'Expert Acrobatics (d4)',
        description: 'Expert acrobatics on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You complete it automatically', type: 'failure' },
            { roll: [2, 2], result: 'You execute it without effort', type: 'normal' },
            { roll: [3, 3], result: 'You flow through it seamlessly', type: 'success' },
            { roll: [4, 4], result: 'You land with flawless precision', type: 'success' }
        ]
    },
    acrobatics_expert_d6: {
        name: 'Expert Acrobatics (d6)',
        description: 'Expert acrobatics on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You adjust mid-movement', type: 'failure' },
            { roll: [2, 2], result: 'You land with subtle correction', type: 'failure' },
            { roll: [3, 3], result: 'You execute with masterful control', type: 'normal' },
            { roll: [4, 4], result: 'You land with polished precision', type: 'normal' },
            { roll: [5, 5], result: 'You complete it with effortless grace', type: 'success' },
            { roll: [6, 6], result: 'You execute it with professional ease', type: 'success' }
        ]
    },
    acrobatics_expert_d8: {
        name: 'Expert Acrobatics (d8)',
        description: 'Expert acrobatics on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You miscalculate slightly', type: 'failure' },
            { roll: [2, 2], result: 'You land with minor imbalance', type: 'failure' },
            { roll: [3, 3], result: 'You recover instantly', type: 'failure' },
            { roll: [4, 4], result: 'You complete it fluidly', type: 'failure' },
            { roll: [5, 5], result: 'You land with expert control', type: 'normal' },
            { roll: [6, 6], result: 'You execute with polished skill', type: 'normal' },
            { roll: [7, 7], result: 'You flow through it with mastery', type: 'success' },
            { roll: [8, 8], result: 'You land with professional precision', type: 'success' }
        ]
    },
    acrobatics_expert_d10: {
        name: 'Expert Acrobatics (d10)',
        description: 'Expert acrobatics on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You slip on landing', type: 'failure' },
            { roll: [2, 2], result: 'You lose balance momentarily', type: 'failure' },
            { roll: [3, 3], result: 'You land off-center', type: 'failure' },
            { roll: [4, 5], result: 'You maintain control with skill', type: 'failure' },
            { roll: [6, 6], result: 'You recover with expertise', type: 'failure' },
            { roll: [7, 7], result: 'You land with controlled precision', type: 'normal' },
            { roll: [8, 8], result: 'You execute with expert technique', type: 'normal' },
            { roll: [9, 9], result: 'You complete it with refined grace', type: 'success' },
            { roll: [10, 10], result: 'You land with exceptional control', type: 'success' }
        ]
    },
    acrobatics_expert_d12: {
        name: 'Expert Acrobatics (d12)',
        description: 'Expert acrobatics on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 2], result: 'You slip, take 1d4 damage', type: 'failure' },
            { roll: [3, 4], result: 'You lose footing', type: 'failure' },
            { roll: [5, 6], result: 'You lose momentum', type: 'failure' },
            { roll: [7, 8], result: 'You maintain control with effort', type: 'failure' },
            { roll: [9, 9], result: 'You succeed with skill', type: 'normal' },
            { roll: [10, 10], result: 'You land with expert technique', type: 'normal' },
            { roll: [11, 11], result: 'You execute with polished precision', type: 'success' },
            { roll: [12, 12], result: 'You land with masterful control', type: 'success' }
        ]
    },
    acrobatics_expert_d20: {
        name: 'Expert Acrobatics (d20)',
        description: 'Expert acrobatics on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 3], result: 'You fall, take 1d8 damage', type: 'failure' },
            { roll: [4, 6], result: 'You slip and tumble', type: 'failure' },
            { roll: [7, 9], result: 'You lose balance', type: 'failure' },
            { roll: [10, 12], result: 'You barely maintain control', type: 'failure' },
            { roll: [13, 15], result: 'You fail but recover quickly', type: 'failure' },
            { roll: [16, 17], result: 'You succeed with effort', type: 'normal' },
            { roll: [18, 18], result: 'You complete it with skill', type: 'normal' },
            { roll: [19, 19], result: 'You land with expert control', type: 'success' },
            { roll: [20, 20], result: 'You execute with breathtaking grace', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    acrobatics_master_d4: {
        name: 'Master Acrobatics (d4)',
        description: 'Master acrobatics on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You execute it instinctively', type: 'failure' },
            { roll: [2, 2], result: 'You complete it effortlessly', type: 'normal' },
            { roll: [3, 3], result: 'You flow through it perfectly', type: 'success' },
            { roll: [4, 4], result: 'You land with absolute precision', type: 'success' }
        ]
    },
    acrobatics_master_d6: {
        name: 'Master Acrobatics (d6)',
        description: 'Master acrobatics on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You make a subtle adjustment', type: 'failure' },
            { roll: [2, 2], result: 'You land with minimal correction', type: 'failure' },
            { roll: [3, 3], result: 'You execute with supreme control', type: 'normal' },
            { roll: [4, 4], result: 'You land with flawless precision', type: 'normal' },
            { roll: [5, 5], result: 'You complete it with perfect grace', type: 'success' },
            { roll: [6, 6], result: 'You execute it with legendary ease', type: 'success' }
        ]
    },
    acrobatics_master_d8: {
        name: 'Master Acrobatics (d8)',
        description: 'Master acrobatics on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You adjust mid-air', type: 'failure' },
            { roll: [2, 2], result: 'You land with slight imbalance', type: 'failure' },
            { roll: [3, 3], result: 'You recover seamlessly', type: 'failure' },
            { roll: [4, 4], result: 'You complete it smoothly', type: 'failure' },
            { roll: [5, 5], result: 'You land with masterful control', type: 'normal' },
            { roll: [6, 6], result: 'You execute with supreme skill', type: 'normal' },
            { roll: [7, 7], result: 'You flow through it with perfection', type: 'success' },
            { roll: [8, 8], result: 'You land with incredible precision', type: 'success' }
        ]
    },
    acrobatics_master_d10: {
        name: 'Master Acrobatics (d10)',
        description: 'Master acrobatics on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You slip unexpectedly', type: 'failure' },
            { roll: [2, 2], result: 'You lose balance briefly', type: 'failure' },
            { roll: [3, 3], result: 'You land slightly off-center', type: 'failure' },
            { roll: [4, 5], result: 'You maintain control expertly', type: 'failure' },
            { roll: [6, 6], result: 'You recover with mastery', type: 'failure' },
            { roll: [7, 7], result: 'You land with precise control', type: 'normal' },
            { roll: [8, 8], result: 'You execute with masterful technique', type: 'normal' },
            { roll: [9, 9], result: 'You complete it with supreme grace', type: 'success' },
            { roll: [10, 10], result: 'You land with flawless control', type: 'success' }
        ]
    },
    acrobatics_master_d12: {
        name: 'Master Acrobatics (d12)',
        description: 'Master acrobatics on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 2], result: 'You slip slightly', type: 'failure' },
            { roll: [3, 4], result: 'You lose footing momentarily', type: 'failure' },
            { roll: [5, 6], result: 'You lose some momentum', type: 'failure' },
            { roll: [7, 8], result: 'You maintain control with skill', type: 'failure' },
            { roll: [9, 9], result: 'You succeed with expertise', type: 'normal' },
            { roll: [10, 10], result: 'You land with masterful technique', type: 'normal' },
            { roll: [11, 11], result: 'You execute with supreme precision', type: 'success' },
            { roll: [12, 12], result: 'You land with perfect control', type: 'success' }
        ]
    },
    acrobatics_master_d20: {
        name: 'Master Acrobatics (d20)',
        description: 'Master acrobatics on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 3], result: 'You slip, take 1d4 damage', type: 'failure' },
            { roll: [4, 6], result: 'You lose balance', type: 'failure' },
            { roll: [7, 9], result: 'You land awkwardly', type: 'failure' },
            { roll: [10, 12], result: 'You barely maintain control', type: 'failure' },
            { roll: [13, 15], result: 'You fail but recover instantly', type: 'failure' },
            { roll: [16, 17], result: 'You succeed with effort', type: 'normal' },
            { roll: [18, 18], result: 'You complete it with mastery', type: 'normal' },
            { roll: [19, 19], result: 'You land with supreme control', type: 'success' },
            { roll: [20, 20], result: 'You execute with flawless perfection', type: 'critical' }
        ]
    }
};

