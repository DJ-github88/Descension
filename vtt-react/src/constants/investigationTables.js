// Investigation Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total

export const INVESTIGATION_TABLES = {
    // UNTRAINED - d4 through d20
    investigation_untrained_d4: {
        name: 'Untrained Investigation (d4)',
        description: 'Untrained investigation on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You overlook the obvious clue right in front of you', type: 'failure' },
            { roll: [2, 2], result: 'You find nothing useful', type: 'failure' },
            { roll: [3, 3], result: 'You spot a basic clue', type: 'normal' },
            { roll: [4, 4], result: 'Lucky observation reveals a useful detail', type: 'success' }
        ]
    },
    investigation_untrained_d6: {
        name: 'Untrained Investigation (d6)',
        description: 'Untrained investigation on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You contaminate the scene', type: 'failure' },
            { roll: [2, 3], result: 'You find nothing and waste time searching', type: 'failure' },
            { roll: [4, 4], result: 'You notice something odd but cannot explain it', type: 'normal' },
            { roll: [5, 5], result: 'You discover a minor clue', type: 'normal' },
            { roll: [6, 6], result: 'You stumble upon an important detail', type: 'success' }
        ]
    },
    investigation_untrained_d8: {
        name: 'Untrained Investigation (d8)',
        description: 'Untrained investigation on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You are completely confused by the scene', type: 'failure' },
            { roll: [3, 4], result: 'You disturb evidence and find nothing', type: 'failure' },
            { roll: [5, 5], result: 'You sense something is wrong but find nothing', type: 'normal' },
            { roll: [6, 6], result: 'You notice a vague clue', type: 'normal' },
            { roll: [7, 7], result: 'You accidentally discover something useful', type: 'success' },
            { roll: [8, 8], result: 'Luck reveals a fragmented but helpful clue', type: 'success' }
        ]
    },
    investigation_untrained_d10: {
        name: 'Untrained Investigation (d10)',
        description: 'Untrained investigation on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You find nothing and disturb the scene', type: 'failure' },
            { roll: [3, 4], result: 'You are overwhelmed by too many details', type: 'failure' },
            { roll: [5, 6], result: 'You notice something but cannot make sense of it', type: 'normal' },
            { roll: [7, 8], result: 'You sense importance but cannot connect anything', type: 'normal' },
            { roll: [9, 9], result: 'Pure luck reveals a minor clue', type: 'success' },
            { roll: [10, 10], result: 'Against all odds, you find something useful', type: 'success' }
        ]
    },
    investigation_untrained_d12: {
        name: 'Untrained Investigation (d12)',
        description: 'Untrained investigation on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You destroy critical evidence through careless handling', type: 'failure' },
            { roll: [3, 4], result: 'You contaminate the scene and reach the wrong conclusion', type: 'failure' },
            { roll: [5, 6], result: 'You are overwhelmed by details and find nothing useful', type: 'failure' },
            { roll: [7, 8], result: 'You waste time chasing irrelevant details', type: 'failure' },
            { roll: [9, 10], result: 'You sense something is wrong but cannot identify what', type: 'normal' },
            { roll: [11, 11], result: 'You notice an odd detail but misinterpret its meaning', type: 'normal' },
            { roll: [12, 12], result: 'Beginner\'s luck reveals a fragmented clue', type: 'normal' }
        ]
    },
    investigation_untrained_d20: {
        name: 'Untrained Investigation (d20)',
        description: 'Untrained investigation on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'You destroy multiple pieces of evidence', type: 'failure' },
            { roll: [4, 6], result: 'You contaminate the scene and draw false conclusions', type: 'failure' },
            { roll: [7, 9], result: 'You are completely overwhelmed and panic', type: 'failure' },
            { roll: [10, 12], result: 'You find nothing and waste significant time', type: 'failure' },
            { roll: [13, 15], result: 'You notice something strange but have no idea what it means', type: 'normal' },
            { roll: [16, 17], result: 'You sense importance but cannot connect anything', type: 'normal' },
            { roll: [18, 18], result: 'You stumble upon a tiny, unclear clue', type: 'normal' },
            { roll: [19, 19], result: 'Miraculous luck reveals a fragmented detail', type: 'success' },
            { roll: [20, 20], result: 'Against all odds, you notice something genuinely useful', type: 'success' }
        ]
    },

    // NOVICE - d4 through d20
    investigation_novice_d4: {
        name: 'Novice Investigation (d4)',
        description: 'Novice investigation on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You follow a false lead briefly', type: 'failure' },
            { roll: [2, 2], result: 'You find a basic clue', type: 'failure' },
            { roll: [3, 3], result: 'You discover an important detail', type: 'normal' },
            { roll: [4, 4], result: 'You piece together multiple clues', type: 'success' }
        ]
    },
    investigation_novice_d6: {
        name: 'Novice Investigation (d6)',
        description: 'Novice investigation on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You waste time on a red herring', type: 'failure' },
            { roll: [2, 2], result: 'You are briefly misled', type: 'failure' },
            { roll: [3, 3], result: 'You find a minor clue', type: 'normal' },
            { roll: [4, 5], result: 'You uncover useful evidence', type: 'normal' },
            { roll: [6, 6], result: 'You connect two important clues', type: 'success' }
        ]
    },
    investigation_novice_d8: {
        name: 'Novice Investigation (d8)',
        description: 'Novice investigation on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'You follow a false lead and lose time', type: 'failure' },
            { roll: [3, 3], result: 'You find fragmented clues', type: 'normal' },
            { roll: [4, 5], result: 'You gather useful evidence', type: 'normal' },
            { roll: [6, 6], result: 'You discover important evidence', type: 'success' },
            { roll: [7, 8], result: 'You identify a key pattern', type: 'success' }
        ]
    },
    investigation_novice_d10: {
        name: 'Novice Investigation (d10)',
        description: 'Novice investigation on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'You are misled by false evidence', type: 'failure' },
            { roll: [3, 4], result: 'You waste time on red herrings', type: 'failure' },
            { roll: [5, 6], result: 'You find scattered clues', type: 'normal' },
            { roll: [7, 7], result: 'You uncover a significant detail', type: 'normal' },
            { roll: [8, 9], result: 'You make a breakthrough connection', type: 'success' },
            { roll: [10, 10], result: 'You piece together crucial evidence', type: 'success' }
        ]
    },
    investigation_novice_d12: {
        name: 'Novice Investigation (d12)',
        description: 'Novice investigation on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'You follow multiple false leads and waste hours', type: 'failure' },
            { roll: [3, 4], result: 'You are misled by planted evidence', type: 'failure' },
            { roll: [5, 6], result: 'You gather scattered, incomplete clues', type: 'normal' },
            { roll: [7, 8], result: 'You find some useful but fragmented evidence', type: 'normal' },
            { roll: [9, 10], result: 'You discover crucial evidence', type: 'success' },
            { roll: [11, 11], result: 'You deduce an important connection', type: 'success' },
            { roll: [12, 12], result: 'You piece together a breakthrough', type: 'critical' }
        ]
    },
    investigation_novice_d20: {
        name: 'Novice Investigation (d20)',
        description: 'Novice investigation on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'You are completely overwhelmed and follow false leads', type: 'failure' },
            { roll: [4, 6], result: 'You waste time on red herrings', type: 'failure' },
            { roll: [7, 9], result: 'You struggle but find minor, unclear clues', type: 'normal' },
            { roll: [10, 12], result: 'You gather fragmented evidence', type: 'normal' },
            { roll: [13, 15], result: 'You discover useful but incomplete evidence', type: 'success' },
            { roll: [16, 17], result: 'You find important clues and make connections', type: 'success' },
            { roll: [18, 19], result: 'You make an unexpected breakthrough', type: 'critical' },
            { roll: [20, 20], result: 'You connect disparate clues into a clear pattern', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    investigation_trained_d4: {
        name: 'Trained Investigation (d4)',
        description: 'Trained investigation on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You briefly consider a false lead', type: 'failure' },
            { roll: [2, 2], result: 'You quickly identify all obvious clues', type: 'failure' },
            { roll: [3, 3], result: 'You piece together the full picture', type: 'normal' },
            { roll: [4, 4], result: 'You solve the mystery and predict next steps', type: 'success' }
        ]
    },
    investigation_trained_d6: {
        name: 'Trained Investigation (d6)',
        description: 'Trained investigation on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You waste a few minutes on misleading evidence', type: 'failure' },
            { roll: [2, 2], result: 'You gather useful clues', type: 'failure' },
            { roll: [3, 4], result: 'You find all important clues', type: 'normal' },
            { roll: [5, 5], result: 'You deduce the underlying pattern', type: 'normal' },
            { roll: [6, 6], result: 'You solve the mystery completely', type: 'success' }
        ]
    },
    investigation_trained_d8: {
        name: 'Trained Investigation (d8)',
        description: 'Trained investigation on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You lose time on a red herring', type: 'failure' },
            { roll: [2, 3], result: 'You gather useful evidence', type: 'failure' },
            { roll: [4, 5], result: 'You find important clues', type: 'normal' },
            { roll: [6, 6], result: 'You uncover hidden connections', type: 'normal' },
            { roll: [7, 8], result: 'You deduce the full truth', type: 'success' }
        ]
    },
    investigation_trained_d10: {
        name: 'Trained Investigation (d10)',
        description: 'Trained investigation on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'You are briefly misled by false evidence', type: 'failure' },
            { roll: [3, 4], result: 'You waste time on convincing red herrings', type: 'failure' },
            { roll: [5, 6], result: 'You find important clues', type: 'normal' },
            { roll: [7, 7], result: 'You discover crucial evidence', type: 'normal' },
            { roll: [8, 9], result: 'You solve the mystery and identify motives', type: 'success' },
            { roll: [10, 10], result: 'You deduce the conspiracy', type: 'success' }
        ]
    },
    investigation_trained_d12: {
        name: 'Trained Investigation (d12)',
        description: 'Trained investigation on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You waste time on expertly crafted misleading evidence', type: 'failure' },
            { roll: [2, 3], result: 'You follow a convincing false lead', type: 'failure' },
            { roll: [4, 5], result: 'You gather scattered, disconnected clues', type: 'normal' },
            { roll: [6, 7], result: 'You find useful evidence but struggle to connect it', type: 'normal' },
            { roll: [8, 9], result: 'You uncover hidden evidence', type: 'success' },
            { roll: [10, 10], result: 'You discover crucial connections', type: 'success' },
            { roll: [11, 11], result: 'You deduce the conspiracy', type: 'critical' },
            { roll: [12, 12], result: 'You solve the mystery and identify motives', type: 'critical' }
        ]
    },
    investigation_trained_d20: {
        name: 'Trained Investigation (d20)',
        description: 'Trained investigation on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'You are misled by expertly planted false evidence', type: 'failure' },
            { roll: [3, 4], result: 'You struggle with convincing false leads', type: 'failure' },
            { roll: [5, 7], result: 'You find fragmented, unclear clues', type: 'normal' },
            { roll: [8, 10], result: 'You gather useful but incomplete evidence', type: 'normal' },
            { roll: [11, 13], result: 'You discover important evidence', type: 'success' },
            { roll: [14, 16], result: 'You uncover hidden connections', type: 'success' },
            { roll: [17, 18], result: 'You solve a major part of the mystery', type: 'critical' },
            { roll: [19, 19], result: 'You deduce the conspiracy and key players', type: 'critical' },
            { roll: [20, 20], result: 'You solve the mystery completely', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    investigation_apprentice_d4: {
        name: 'Apprentice Investigation (d4)',
        description: 'Apprentice investigation on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You briefly consider a false lead', type: 'failure' },
            { roll: [2, 2], result: 'You find all crucial evidence', type: 'normal' },
            { roll: [3, 3], result: 'You solve the mystery completely', type: 'success' },
            { roll: [4, 4], result: 'You deduce everything and predict future events', type: 'success' }
        ]
    },
    investigation_apprentice_d6: {
        name: 'Apprentice Investigation (d6)',
        description: 'Apprentice investigation on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You notice a minor red herring but quickly dismiss it', type: 'failure' },
            { roll: [2, 2], result: 'You gather all important clues', type: 'normal' },
            { roll: [3, 4], result: 'You solve the mystery completely', type: 'normal' },
            { roll: [5, 5], result: 'You uncover hidden motives', type: 'success' },
            { roll: [6, 6], result: 'You deduce everything and predict next moves', type: 'success' }
        ]
    },
    investigation_apprentice_d8: {
        name: 'Apprentice Investigation (d8)',
        description: 'Apprentice investigation on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You briefly consider a false lead', type: 'failure' },
            { roll: [2, 3], result: 'You find all crucial evidence', type: 'failure' },
            { roll: [4, 5], result: 'You gather important clues', type: 'normal' },
            { roll: [6, 6], result: 'You deduce the full truth', type: 'normal' },
            { roll: [7, 8], result: 'You solve the mystery and identify all conspirators', type: 'success' }
        ]
    },
    investigation_apprentice_d10: {
        name: 'Apprentice Investigation (d10)',
        description: 'Apprentice investigation on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You waste time on a red herring', type: 'failure' },
            { roll: [2, 3], result: 'You are briefly misled', type: 'failure' },
            { roll: [4, 5], result: 'You gather important clues', type: 'normal' },
            { roll: [6, 7], result: 'You find crucial evidence', type: 'normal' },
            { roll: [8, 9], result: 'You uncover hidden connections', type: 'success' },
            { roll: [10, 10], result: 'You deduce the conspiracy and motives', type: 'success' }
        ]
    },
    investigation_apprentice_d12: {
        name: 'Apprentice Investigation (d12)',
        description: 'Apprentice investigation on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You are briefly misled by sophisticated false evidence', type: 'failure' },
            { roll: [2, 2], result: 'You waste time on a red herring', type: 'failure' },
            { roll: [3, 4], result: 'You find scattered but useful clues', type: 'normal' },
            { roll: [5, 6], result: 'You gather important evidence', type: 'normal' },
            { roll: [7, 8], result: 'You discover crucial evidence', type: 'success' },
            { roll: [9, 10], result: 'You uncover hidden connections and motives', type: 'success' },
            { roll: [11, 11], result: 'You solve the mystery and predict future moves', type: 'critical' },
            { roll: [12, 12], result: 'You deduce everything and identify all conspirators', type: 'critical' }
        ]
    },
    investigation_apprentice_d20: {
        name: 'Apprentice Investigation (d20)',
        description: 'Apprentice investigation on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 2], result: 'You struggle with masterfully crafted misleading evidence', type: 'failure' },
            { roll: [3, 4], result: 'You are temporarily misled by false leads', type: 'failure' },
            { roll: [5, 7], result: 'You gather fragmented clues', type: 'normal' },
            { roll: [8, 10], result: 'You find useful evidence', type: 'normal' },
            { roll: [11, 13], result: 'You uncover important evidence', type: 'success' },
            { roll: [14, 16], result: 'You discover crucial connections', type: 'success' },
            { roll: [17, 18], result: 'You solve the mystery and identify all involved', type: 'critical' },
            { roll: [19, 19], result: 'You deduce the conspiracy and predict next moves', type: 'critical' },
            { roll: [20, 20], result: 'You uncover hidden motives and secondary plots', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    investigation_adept_d4: {
        name: 'Adept Investigation (d4)',
        description: 'Adept investigation on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You briefly consider misdirection', type: 'failure' },
            { roll: [2, 2], result: 'You find all crucial evidence', type: 'normal' },
            { roll: [3, 3], result: 'You solve everything instantly', type: 'success' },
            { roll: [4, 4], result: 'You deduce everything and predict future events', type: 'success' }
        ]
    },
    investigation_adept_d6: {
        name: 'Adept Investigation (d6)',
        description: 'Adept investigation on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You lose a moment on misdirection', type: 'failure' },
            { roll: [2, 2], result: 'You gather all important clues', type: 'normal' },
            { roll: [3, 4], result: 'You solve the mystery effortlessly', type: 'normal' },
            { roll: [5, 5], result: 'You deduce all motives and connections', type: 'success' },
            { roll: [6, 6], result: 'You uncover the full conspiracy', type: 'success' }
        ]
    },
    investigation_adept_d8: {
        name: 'Adept Investigation (d8)',
        description: 'Adept investigation on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You lose a few minutes on misdirection', type: 'failure' },
            { roll: [2, 3], result: 'You find all crucial evidence', type: 'failure' },
            { roll: [4, 5], result: 'You gather all important clues', type: 'normal' },
            { roll: [6, 6], result: 'You deduce complex patterns', type: 'normal' },
            { roll: [7, 8], result: 'You solve the mystery and uncover hidden plots', type: 'success' }
        ]
    },
    investigation_adept_d10: {
        name: 'Adept Investigation (d10)',
        description: 'Adept investigation on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You briefly follow a false lead', type: 'failure' },
            { roll: [2, 3], result: 'You waste time on expert misdirection', type: 'failure' },
            { roll: [4, 5], result: 'You gather all important clues', type: 'normal' },
            { roll: [6, 7], result: 'You find crucial evidence', type: 'normal' },
            { roll: [8, 9], result: 'You uncover the conspiracy', type: 'success' },
            { roll: [10, 10], result: 'You solve the case and predict future events', type: 'success' }
        ]
    },
    investigation_adept_d12: {
        name: 'Adept Investigation (d12)',
        description: 'Adept investigation on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You waste time on deliberate expert misdirection', type: 'failure' },
            { roll: [2, 2], result: 'You are briefly delayed by false leads', type: 'failure' },
            { roll: [3, 4], result: 'You find crucial evidence', type: 'normal' },
            { roll: [5, 6], result: 'You gather important clues and connections', type: 'normal' },
            { roll: [7, 8], result: 'You deduce complex patterns', type: 'success' },
            { roll: [9, 10], result: 'You uncover the conspiracy', type: 'success' },
            { roll: [11, 11], result: 'You solve the case and identify all motives', type: 'critical' },
            { roll: [12, 12], result: 'You uncover the full conspiracy and predict future events', type: 'critical' }
        ]
    },
    investigation_adept_d20: {
        name: 'Adept Investigation (d20)',
        description: 'Adept investigation on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 2], result: 'You are misled by expert misdirection', type: 'failure' },
            { roll: [3, 4], result: 'You struggle with sophisticated false evidence', type: 'failure' },
            { roll: [5, 7], result: 'You gather scattered clues', type: 'normal' },
            { roll: [8, 10], result: 'You find important evidence', type: 'normal' },
            { roll: [11, 13], result: 'You uncover crucial evidence', type: 'success' },
            { roll: [14, 16], result: 'You deduce complex patterns and connections', type: 'success' },
            { roll: [17, 18], result: 'You solve the case and identify all involved parties', type: 'critical' },
            { roll: [19, 19], result: 'You uncover the full conspiracy and all motives', type: 'critical' },
            { roll: [20, 20], result: 'You solve everything and predict future crimes', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    investigation_expert_d4: {
        name: 'Expert Investigation (d4)',
        description: 'Expert investigation on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You briefly consider expert misdirection', type: 'failure' },
            { roll: [2, 2], result: 'You find all available evidence', type: 'normal' },
            { roll: [3, 3], result: 'You instantly see all connections', type: 'success' },
            { roll: [4, 4], result: 'You solve everything and expose the entire network', type: 'success' }
        ]
    },
    investigation_expert_d6: {
        name: 'Expert Investigation (d6)',
        description: 'Expert investigation on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You lose a moment on misdirection', type: 'failure' },
            { roll: [2, 2], result: 'You gather all crucial clues', type: 'normal' },
            { roll: [3, 4], result: 'You solve the mystery and all related cases', type: 'normal' },
            { roll: [5, 5], result: 'You uncover the full conspiracy network', type: 'success' },
            { roll: [6, 6], result: 'You identify the mastermind and all accomplices', type: 'success' }
        ]
    },
    investigation_expert_d8: {
        name: 'Expert Investigation (d8)',
        description: 'Expert investigation on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You lose a few minutes on expert misdirection', type: 'failure' },
            { roll: [2, 3], result: 'You find all available evidence', type: 'failure' },
            { roll: [4, 5], result: 'You gather all crucial clues', type: 'normal' },
            { roll: [6, 6], result: 'You deduce hidden connections', type: 'normal' },
            { roll: [7, 8], result: 'You uncover the elaborate conspiracy', type: 'success' }
        ]
    },
    investigation_expert_d10: {
        name: 'Expert Investigation (d10)',
        description: 'Expert investigation on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You are briefly delayed by expertly hidden evidence', type: 'failure' },
            { roll: [2, 3], result: 'You waste time on masterful misdirection', type: 'failure' },
            { roll: [4, 5], result: 'You find all crucial clues', type: 'normal' },
            { roll: [6, 7], result: 'You gather all available evidence', type: 'normal' },
            { roll: [8, 9], result: 'You deduce the conspiracy', type: 'success' },
            { roll: [10, 10], result: 'You solve the case and identify the mastermind', type: 'success' }
        ]
    },
    investigation_expert_d12: {
        name: 'Expert Investigation (d12)',
        description: 'Expert investigation on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You waste time on masterfully crafted misdirection', type: 'failure' },
            { roll: [2, 2], result: 'You are briefly delayed by expertly hidden evidence', type: 'failure' },
            { roll: [3, 4], result: 'You find all available evidence', type: 'normal' },
            { roll: [5, 6], result: 'You gather crucial clues and patterns', type: 'normal' },
            { roll: [7, 8], result: 'You deduce hidden connections', type: 'success' },
            { roll: [9, 10], result: 'You uncover the elaborate conspiracy', type: 'success' },
            { roll: [11, 11], result: 'You solve the case and identify the mastermind', type: 'critical' },
            { roll: [12, 12], result: 'You uncover all layers and prevent future crimes', type: 'critical' }
        ]
    },
    investigation_expert_d20: {
        name: 'Expert Investigation (d20)',
        description: 'Expert investigation on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 2], result: 'You struggle with masterfully hidden evidence', type: 'failure' },
            { roll: [3, 4], result: 'You are delayed by expert-level misdirection', type: 'failure' },
            { roll: [5, 7], result: 'You gather all available clues', type: 'normal' },
            { roll: [8, 10], result: 'You find crucial evidence', type: 'normal' },
            { roll: [11, 13], result: 'You uncover hidden evidence', type: 'success' },
            { roll: [14, 16], result: 'You deduce the elaborate conspiracy', type: 'success' },
            { roll: [17, 18], result: 'You solve the case and prevent future crimes', type: 'critical' },
            { roll: [19, 19], result: 'You identify the mastermind and all accomplices', type: 'critical' },
            { roll: [20, 20], result: 'You uncover the entire network and all related mysteries', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    investigation_master_d4: {
        name: 'Master Investigation (d4)',
        description: 'Master investigation on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You briefly consider legendary misdirection', type: 'failure' },
            { roll: [2, 2], result: 'You find all evidence and hidden clues', type: 'normal' },
            { roll: [3, 3], result: 'You see all connections instantly', type: 'success' },
            { roll: [4, 4], result: 'You achieve perfect deduction, solving all related mysteries', type: 'success' }
        ]
    },
    investigation_master_d6: {
        name: 'Master Investigation (d6)',
        description: 'Master investigation on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You lose a moment on masterful deception', type: 'failure' },
            { roll: [2, 2], result: 'You gather all evidence', type: 'normal' },
            { roll: [3, 4], result: 'You solve everything and all related cases', type: 'normal' },
            { roll: [5, 5], result: 'You uncover multi-layered conspiracies', type: 'success' },
            { roll: [6, 6], result: 'You identify all conspirators and predict their moves', type: 'success' }
        ]
    },
    investigation_master_d8: {
        name: 'Master Investigation (d8)',
        description: 'Master investigation on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You briefly consider a masterfully crafted deception', type: 'failure' },
            { roll: [2, 3], result: 'You find all evidence and hidden clues', type: 'failure' },
            { roll: [4, 5], result: 'You gather all available evidence', type: 'normal' },
            { roll: [6, 6], result: 'You deduce the entire conspiracy network', type: 'normal' },
            { roll: [7, 8], result: 'You uncover multi-layered plots', type: 'success' }
        ]
    },
    investigation_master_d10: {
        name: 'Master Investigation (d10)',
        description: 'Master investigation on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You are briefly delayed by legendary misdirection', type: 'failure' },
            { roll: [2, 3], result: 'You struggle with impossible concealment', type: 'failure' },
            { roll: [4, 5], result: 'You find all evidence and hidden clues', type: 'normal' },
            { roll: [6, 7], result: 'You gather every piece of available evidence', type: 'normal' },
            { roll: [8, 9], result: 'You deduce the entire conspiracy', type: 'success' },
            { roll: [10, 10], result: 'You solve the impossible case', type: 'success' }
        ]
    },
    investigation_master_d12: {
        name: 'Master Investigation (d12)',
        description: 'Master investigation on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You waste time on impossibly concealed evidence', type: 'failure' },
            { roll: [2, 2], result: 'You are briefly delayed by legendary misdirection', type: 'failure' },
            { roll: [3, 4], result: 'You find all evidence and hidden clues', type: 'normal' },
            { roll: [5, 6], result: 'You gather every piece of available evidence', type: 'normal' },
            { roll: [7, 8], result: 'You deduce the entire conspiracy network', type: 'success' },
            { roll: [9, 10], result: 'You uncover multi-layered plots', type: 'success' },
            { roll: [11, 11], result: 'You solve the impossible case', type: 'critical' },
            { roll: [12, 12], result: 'You predict all moves and prevent all future crimes', type: 'critical' }
        ]
    },
    investigation_master_d20: {
        name: 'Master Investigation (d20)',
        description: 'Master investigation on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 2], result: 'You struggle with impossibly hidden evidence', type: 'failure' },
            { roll: [3, 4], result: 'You are challenged by legendary concealment', type: 'failure' },
            { roll: [5, 7], result: 'You find all evidence and hidden clues', type: 'normal' },
            { roll: [8, 10], result: 'You gather every available piece of evidence', type: 'normal' },
            { roll: [11, 13], result: 'You deduce multi-layered conspiracies', type: 'success' },
            { roll: [14, 16], result: 'You uncover the entire conspiracy network', type: 'success' },
            { roll: [17, 18], result: 'You solve the impossible and predict all future related events', type: 'critical' },
            { roll: [19, 19], result: 'You uncover conspiracies within conspiracies', type: 'critical' },
            { roll: [20, 20], result: 'You achieve perfect deduction, solving all related mysteries', type: 'critical' }
        ]
    }
};

