// Sleight of Hand Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total

export const SLEIGHT_OF_HAND_TABLES = {
    // UNTRAINED - d4 through d20
    sleightOfHand_untrained_d4: {
        name: 'Untrained Sleight of Hand (d4)',
        description: 'Untrained sleight of hand on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You fumble badly, drop everything', type: 'failure' },
            { roll: [2, 2], result: 'Clumsy attempt, observers are suspicious', type: 'normal' },
            { roll: [3, 3], result: 'You manage the trick, no one notices', type: 'success' },
            { roll: [4, 4], result: 'Despite inexperience, smooth execution', type: 'success' }
        ]
    },
    sleightOfHand_untrained_d6: {
        name: 'Untrained Sleight of Hand (d6)',
        description: 'Untrained sleight of hand on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'Obvious attempt, immediately caught', type: 'failure' },
            { roll: [3, 4], result: 'Clumsy attempt, observers are suspicious', type: 'normal' },
            { roll: [5, 5], result: 'You manage the trick, no one notices', type: 'success' },
            { roll: [6, 6], result: 'Despite inexperience, smooth execution', type: 'success' }
        ]
    },
    sleightOfHand_untrained_d8: {
        name: 'Untrained Sleight of Hand (d8)',
        description: 'Untrained sleight of hand on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'Catastrophic fumble, injure yourself + caught', type: 'failure' },
            { roll: [4, 5], result: 'Obvious attempt, immediately caught', type: 'failure' },
            { roll: [6, 6], result: 'Clumsy attempt, observers are suspicious', type: 'normal' },
            { roll: [7, 7], result: 'You manage the trick, no one notices', type: 'success' },
            { roll: [8, 8], result: 'Despite inexperience, smooth execution', type: 'success' }
        ]
    },
    sleightOfHand_untrained_d10: {
        name: 'Untrained Sleight of Hand (d10)',
        description: 'Untrained sleight of hand on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 4], result: 'Catastrophic fumble, injure yourself + caught', type: 'failure' },
            { roll: [5, 7], result: 'Obvious attempt, immediately caught', type: 'failure' },
            { roll: [8, 8], result: 'Clumsy attempt, observers are suspicious', type: 'normal' },
            { roll: [9, 9], result: 'You manage the trick, no one notices', type: 'normal' },
            { roll: [10, 10], result: 'Despite inexperience, smooth execution', type: 'success' }
        ]
    },
    sleightOfHand_untrained_d12: {
        name: 'Untrained Sleight of Hand (d12)',
        description: 'Untrained sleight of hand on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 5], result: 'Catastrophic fumble, injure yourself + caught', type: 'failure' },
            { roll: [6, 9], result: 'Obvious attempt, immediately caught', type: 'failure' },
            { roll: [10, 10], result: 'Clumsy attempt, observers are suspicious', type: 'normal' },
            { roll: [11, 11], result: 'You manage the trick, no one notices', type: 'normal' },
            { roll: [12, 12], result: 'Despite inexperience, smooth execution', type: 'success' }
        ]
    },
    sleightOfHand_untrained_d20: {
        name: 'Untrained Sleight of Hand (d20)',
        description: 'Untrained sleight of hand on an extremely difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Catastrophic fumble, injure yourself + caught', type: 'failure' },
            { roll: [9, 14], result: 'Obvious attempt, immediately caught', type: 'failure' },
            { roll: [15, 16], result: 'Clumsy attempt, observers are suspicious', type: 'normal' },
            { roll: [17, 18], result: 'You manage the trick, no one notices', type: 'normal' },
            { roll: [19, 19], result: 'Despite inexperience, smooth execution', type: 'success' },
            { roll: [20, 20], result: 'Miraculous trick, flawless technique', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    sleightOfHand_novice_d4: {
        name: 'Novice Sleight of Hand (d4)',
        description: 'Novice sleight of hand on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Slight fumble, observers notice something odd', type: 'failure' },
            { roll: [2, 2], result: 'Smooth execution, trick succeeds', type: 'success' },
            { roll: [3, 3], result: 'Flawless technique, no one notices', type: 'success' },
            { roll: [4, 4], result: 'Impossible feat, steal something valuable', type: 'critical' }
        ]
    },
    sleightOfHand_novice_d6: {
        name: 'Novice Sleight of Hand (d6)',
        description: 'Novice sleight of hand on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Clumsy attempt, observers are suspicious', type: 'failure' },
            { roll: [2, 3], result: 'Smooth execution, trick succeeds', type: 'normal' },
            { roll: [4, 5], result: 'Flawless technique, no one notices', type: 'success' },
            { roll: [6, 6], result: 'Impossible feat, steal something valuable', type: 'critical' }
        ]
    },
    sleightOfHand_novice_d8: {
        name: 'Novice Sleight of Hand (d8)',
        description: 'Novice sleight of hand on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Fumble badly, drop everything and get caught', type: 'failure' },
            { roll: [2, 3], result: 'Clumsy attempt, observers are suspicious', type: 'failure' },
            { roll: [4, 5], result: 'Smooth execution, trick succeeds', type: 'normal' },
            { roll: [6, 7], result: 'Flawless technique, no one notices', type: 'success' },
            { roll: [8, 8], result: 'Impossible feat, steal something valuable', type: 'critical' }
        ]
    },
    sleightOfHand_novice_d10: {
        name: 'Novice Sleight of Hand (d10)',
        description: 'Novice sleight of hand on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'Fumble badly, drop everything and get caught', type: 'failure' },
            { roll: [3, 5], result: 'Clumsy attempt, observers are suspicious', type: 'failure' },
            { roll: [6, 7], result: 'Smooth execution, trick succeeds', type: 'normal' },
            { roll: [8, 9], result: 'Flawless technique, no one notices', type: 'success' },
            { roll: [10, 10], result: 'Impossible feat, steal something valuable', type: 'critical' }
        ]
    },
    sleightOfHand_novice_d12: {
        name: 'Novice Sleight of Hand (d12)',
        description: 'Novice sleight of hand on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Fumble badly, drop everything and get caught', type: 'failure' },
            { roll: [4, 6], result: 'Clumsy attempt, observers are suspicious', type: 'failure' },
            { roll: [7, 9], result: 'Smooth execution, trick succeeds', type: 'normal' },
            { roll: [10, 11], result: 'Flawless technique, no one notices', type: 'success' },
            { roll: [12, 12], result: 'Impossible feat, steal something valuable', type: 'critical' }
        ]
    },
    sleightOfHand_novice_d20: {
        name: 'Novice Sleight of Hand (d20)',
        description: 'Novice sleight of hand on an extremely difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Fumble badly, drop everything and get caught', type: 'failure' },
            { roll: [4, 8], result: 'Clumsy attempt, observers are suspicious', type: 'failure' },
            { roll: [9, 12], result: 'Smooth execution, trick succeeds', type: 'normal' },
            { roll: [13, 16], result: 'Flawless technique, no one notices', type: 'normal' },
            { roll: [17, 19], result: 'Impossible feat, steal something valuable', type: 'success' },
            { roll: [20, 20], result: 'Masterful trick, steal from multiple targets', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    sleightOfHand_trained_d4: {
        name: 'Trained Sleight of Hand (d4)',
        description: 'Trained sleight of hand on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Minor slip, observers notice something', type: 'failure' },
            { roll: [2, 2], result: 'Impossible feat, steal something valuable', type: 'success' },
            { roll: [3, 3], result: 'Masterful trick, steal from multiple targets', type: 'critical' },
            { roll: [4, 4], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'critical' }
        ]
    },
    sleightOfHand_trained_d6: {
        name: 'Trained Sleight of Hand (d6)',
        description: 'Trained sleight of hand on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Slight mishap, execution is clumsy', type: 'failure' },
            { roll: [2, 3], result: 'Flawless technique, no one notices', type: 'success' },
            { roll: [4, 5], result: 'Impossible feat, steal something valuable', type: 'success' },
            { roll: [6, 6], result: 'Masterful trick, steal from multiple targets', type: 'critical' }
        ]
    },
    sleightOfHand_trained_d8: {
        name: 'Trained Sleight of Hand (d8)',
        description: 'Trained sleight of hand on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Slight slip, observers notice something', type: 'failure' },
            { roll: [2, 3], result: 'Smooth execution, trick succeeds', type: 'normal' },
            { roll: [4, 5], result: 'Flawless technique, no one notices', type: 'success' },
            { roll: [6, 7], result: 'Impossible feat, steal something valuable', type: 'success' },
            { roll: [8, 8], result: 'Masterful trick, steal from multiple targets', type: 'critical' }
        ]
    },
    sleightOfHand_trained_d10: {
        name: 'Trained Sleight of Hand (d10)',
        description: 'Trained sleight of hand on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Slight slip, observers notice something', type: 'failure' },
            { roll: [3, 4], result: 'Smooth execution, trick succeeds', type: 'normal' },
            { roll: [5, 6], result: 'Flawless technique, no one notices', type: 'normal' },
            { roll: [7, 8], result: 'Impossible feat, steal something valuable', type: 'success' },
            { roll: [9, 9], result: 'Masterful trick, steal from multiple targets', type: 'success' },
            { roll: [10, 10], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'critical' }
        ]
    },
    sleightOfHand_trained_d12: {
        name: 'Trained Sleight of Hand (d12)',
        description: 'Trained sleight of hand on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Slight slip, observers notice something', type: 'failure' },
            { roll: [3, 5], result: 'Smooth execution, trick succeeds', type: 'failure' },
            { roll: [6, 8], result: 'Flawless technique, no one notices', type: 'normal' },
            { roll: [9, 10], result: 'Impossible feat, steal something valuable', type: 'success' },
            { roll: [11, 11], result: 'Masterful trick, steal from multiple targets', type: 'success' },
            { roll: [12, 12], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'critical' }
        ]
    },
    sleightOfHand_trained_d20: {
        name: 'Trained Sleight of Hand (d20)',
        description: 'Trained sleight of hand on an extremely difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Slight slip, observers notice something', type: 'failure' },
            { roll: [3, 7], result: 'Smooth execution, trick succeeds', type: 'failure' },
            { roll: [8, 11], result: 'Flawless technique, no one notices', type: 'normal' },
            { roll: [12, 15], result: 'Impossible feat, steal something valuable', type: 'normal' },
            { roll: [16, 18], result: 'Masterful trick, steal from multiple targets', type: 'success' },
            { roll: [19, 19], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'success' },
            { roll: [20, 20], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    sleightOfHand_apprentice_d4: {
        name: 'Apprentice Sleight of Hand (d4)',
        description: 'Apprentice sleight of hand on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Small error, attempt is noticed', type: 'failure' },
            { roll: [2, 2], result: 'Masterful trick, steal from multiple targets', type: 'success' },
            { roll: [3, 3], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'critical' },
            { roll: [4, 4], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'critical' }
        ]
    },
    sleightOfHand_apprentice_d6: {
        name: 'Apprentice Sleight of Hand (d6)',
        description: 'Apprentice sleight of hand on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 3], result: 'Impossible feat, steal something valuable', type: 'success' },
            { roll: [4, 5], result: 'Masterful trick, steal from multiple targets', type: 'success' },
            { roll: [6, 6], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'critical' }
        ]
    },
    sleightOfHand_apprentice_d8: {
        name: 'Apprentice Sleight of Hand (d8)',
        description: 'Apprentice sleight of hand on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Good execution, minor tell', type: 'failure' },
            { roll: [2, 3], result: 'Flawless technique, no one notices', type: 'normal' },
            { roll: [4, 5], result: 'Impossible feat, steal something valuable', type: 'success' },
            { roll: [6, 7], result: 'Masterful trick, steal from multiple targets', type: 'success' },
            { roll: [8, 8], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'critical' }
        ]
    },
    sleightOfHand_apprentice_d10: {
        name: 'Apprentice Sleight of Hand (d10)',
        description: 'Apprentice sleight of hand on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Good execution, minor tell', type: 'failure' },
            { roll: [2, 3], result: 'Flawless technique, no one notices', type: 'normal' },
            { roll: [4, 5], result: 'Impossible feat, steal something valuable', type: 'normal' },
            { roll: [6, 7], result: 'Masterful trick, steal from multiple targets', type: 'success' },
            { roll: [8, 9], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'success' },
            { roll: [10, 10], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'critical' }
        ]
    },
    sleightOfHand_apprentice_d12: {
        name: 'Apprentice Sleight of Hand (d12)',
        description: 'Apprentice sleight of hand on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Good execution, minor tell', type: 'failure' },
            { roll: [2, 4], result: 'Flawless technique, no one notices', type: 'normal' },
            { roll: [5, 7], result: 'Impossible feat, steal something valuable', type: 'normal' },
            { roll: [8, 9], result: 'Masterful trick, steal from multiple targets', type: 'success' },
            { roll: [10, 11], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'success' },
            { roll: [12, 12], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'critical' }
        ]
    },
    sleightOfHand_apprentice_d20: {
        name: 'Apprentice Sleight of Hand (d20)',
        description: 'Apprentice sleight of hand on an extremely difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Good execution, minor tell', type: 'failure' },
            { roll: [2, 6], result: 'Flawless technique, no one notices', type: 'failure' },
            { roll: [7, 10], result: 'Impossible feat, steal something valuable', type: 'normal' },
            { roll: [11, 14], result: 'Masterful trick, steal from multiple targets', type: 'normal' },
            { roll: [15, 17], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'success' },
            { roll: [18, 19], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'success' },
            { roll: [20, 20], result: 'Masterful technique, steal from multiple targets undetected', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    sleightOfHand_adept_d4: {
        name: 'Adept Sleight of Hand (d4)',
        description: 'Adept sleight of hand on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'success' },
            { roll: [3, 3], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'critical' },
            { roll: [4, 4], result: 'Masterful technique, steal from multiple targets undetected', type: 'critical' }
        ]
    },
    sleightOfHand_adept_d6: {
        name: 'Adept Sleight of Hand (d6)',
        description: 'Adept sleight of hand on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 3], result: 'Masterful trick, steal from multiple targets', type: 'success' },
            { roll: [4, 5], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'success' },
            { roll: [6, 6], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'critical' }
        ]
    },
    sleightOfHand_adept_d8: {
        name: 'Adept Sleight of Hand (d8)',
        description: 'Adept sleight of hand on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Flawless execution, unnoticed', type: 'failure' },
            { roll: [2, 3], result: 'Impossible feat, steal something valuable', type: 'normal' },
            { roll: [4, 5], result: 'Masterful trick, steal from multiple targets', type: 'success' },
            { roll: [6, 7], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'success' },
            { roll: [8, 8], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'critical' }
        ]
    },
    sleightOfHand_adept_d10: {
        name: 'Adept Sleight of Hand (d10)',
        description: 'Adept sleight of hand on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Flawless execution, unnoticed', type: 'failure' },
            { roll: [2, 3], result: 'Impossible feat, steal something valuable', type: 'normal' },
            { roll: [4, 5], result: 'Masterful trick, steal from multiple targets', type: 'normal' },
            { roll: [6, 7], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'success' },
            { roll: [8, 9], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'success' },
            { roll: [10, 10], result: 'Masterful technique, steal from multiple targets undetected', type: 'critical' }
        ]
    },
    sleightOfHand_adept_d12: {
        name: 'Adept Sleight of Hand (d12)',
        description: 'Adept sleight of hand on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Flawless execution, unnoticed', type: 'failure' },
            { roll: [2, 3], result: 'Impossible feat, steal something valuable', type: 'failure' },
            { roll: [4, 6], result: 'Masterful trick, steal from multiple targets', type: 'normal' },
            { roll: [7, 9], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'success' },
            { roll: [10, 11], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'success' },
            { roll: [12, 12], result: 'Masterful technique, steal from multiple targets undetected', type: 'critical' }
        ]
    },
    sleightOfHand_adept_d20: {
        name: 'Adept Sleight of Hand (d20)',
        description: 'Adept sleight of hand on an extremely difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 3], result: 'Even your mastery struggles with this challenge', type: 'failure' },
            { roll: [4, 5], result: 'You make minimal progress despite your skill', type: 'failure' },
            { roll: [6, 8], result: 'Masterful trick, steal from multiple targets', type: 'normal' },
            { roll: [9, 10], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'normal' },
            { roll: [11, 13], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'success' },
            { roll: [14, 16], result: 'Masterful technique, steal from multiple targets undetected', type: 'success' },
            { roll: [17, 19], result: 'Legendary sleight of hand, make object vanish + reappear elsewhere', type: 'critical' },
            { roll: [20, 20], result: 'Cosmic sleight, steal fate + rewrite destiny', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    sleightOfHand_expert_d4: {
        name: 'Expert Sleight of Hand (d4)',
        description: 'Expert sleight of hand on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'success' },
            { roll: [3, 3], result: 'Masterful technique, steal from multiple targets undetected', type: 'critical' },
            { roll: [4, 4], result: 'Legendary sleight of hand, make object vanish + reappear elsewhere', type: 'critical' }
        ]
    },
    sleightOfHand_expert_d6: {
        name: 'Expert Sleight of Hand (d6)',
        description: 'Expert sleight of hand on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 3], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'success' },
            { roll: [4, 5], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'success' },
            { roll: [6, 6], result: 'Masterful technique, steal from multiple targets undetected', type: 'critical' }
        ]
    },
    sleightOfHand_expert_d8: {
        name: 'Expert Sleight of Hand (d8)',
        description: 'Expert sleight of hand on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Impossible feat, valuable item stolen', type: 'failure' },
            { roll: [2, 3], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'normal' },
            { roll: [4, 5], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'success' },
            { roll: [6, 7], result: 'Masterful technique, steal from multiple targets undetected', type: 'success' },
            { roll: [8, 8], result: 'Legendary sleight of hand, make object vanish + reappear elsewhere', type: 'critical' }
        ]
    },
    sleightOfHand_expert_d10: {
        name: 'Expert Sleight of Hand (d10)',
        description: 'Expert sleight of hand on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Impossible feat, valuable item stolen', type: 'failure' },
            { roll: [2, 3], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'normal' },
            { roll: [4, 5], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'normal' },
            { roll: [6, 7], result: 'Masterful technique, steal from multiple targets undetected', type: 'success' },
            { roll: [8, 9], result: 'Legendary sleight of hand, make object vanish + reappear elsewhere', type: 'success' },
            { roll: [10, 10], result: 'Cosmic sleight, steal fate + rewrite destiny', type: 'critical' }
        ]
    },
    sleightOfHand_expert_d12: {
        name: 'Expert Sleight of Hand (d12)',
        description: 'Expert sleight of hand on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Impossible feat, valuable item stolen', type: 'failure' },
            { roll: [2, 3], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'failure' },
            { roll: [4, 6], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'normal' },
            { roll: [7, 9], result: 'Masterful technique, steal from multiple targets undetected', type: 'success' },
            { roll: [10, 11], result: 'Legendary sleight of hand, make object vanish + reappear elsewhere', type: 'success' },
            { roll: [12, 12], result: 'Cosmic sleight, steal fate + rewrite destiny', type: 'critical' }
        ]
    },
    sleightOfHand_expert_d20: {
        name: 'Expert Sleight of Hand (d20)',
        description: 'Expert sleight of hand on an extremely difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 3], result: 'Even your legendary mastery is tested', type: 'failure' },
            { roll: [4, 5], result: 'You make slow progress', type: 'failure' },
            { roll: [6, 8], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'normal' },
            { roll: [9, 10], result: 'Masterful technique, steal from multiple targets undetected', type: 'normal' },
            { roll: [11, 13], result: 'Legendary sleight of hand, make object vanish + reappear elsewhere', type: 'success' },
            { roll: [14, 16], result: 'Cosmic sleight, steal fate + rewrite destiny', type: 'success' },
            { roll: [17, 19], result: 'Absolute mastery, steal reality itself + reshape existence', type: 'critical' },
            { roll: [20, 20], result: 'Transcendent fingers, steal the concept of possession', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    sleightOfHand_master_d4: {
        name: 'Master Sleight of Hand (d4)',
        description: 'Master sleight of hand on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Masterful technique, steal from multiple targets undetected', type: 'success' },
            { roll: [3, 3], result: 'Legendary sleight of hand, make object vanish + reappear elsewhere', type: 'critical' },
            { roll: [4, 4], result: 'Cosmic sleight, steal fate + rewrite destiny', type: 'critical' }
        ]
    },
    sleightOfHand_master_d6: {
        name: 'Master Sleight of Hand (d6)',
        description: 'Master sleight of hand on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 3], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'success' },
            { roll: [4, 5], result: 'Masterful technique, steal from multiple targets undetected', type: 'success' },
            { roll: [6, 6], result: 'Legendary sleight of hand, make object vanish + reappear elsewhere', type: 'critical' }
        ]
    },
    sleightOfHand_master_d8: {
        name: 'Master Sleight of Hand (d8)',
        description: 'Master sleight of hand on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Masterful trick, multiple targets', type: 'failure' },
            { roll: [2, 3], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'normal' },
            { roll: [4, 5], result: 'Masterful technique, steal from multiple targets undetected', type: 'success' },
            { roll: [6, 7], result: 'Legendary sleight of hand, make object vanish + reappear elsewhere', type: 'success' },
            { roll: [8, 8], result: 'Cosmic sleight, steal fate + rewrite destiny', type: 'critical' }
        ]
    },
    sleightOfHand_master_d10: {
        name: 'Master Sleight of Hand (d10)',
        description: 'Master sleight of hand on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Masterful trick, multiple targets', type: 'failure' },
            { roll: [2, 3], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'normal' },
            { roll: [4, 5], result: 'Masterful technique, steal from multiple targets undetected', type: 'normal' },
            { roll: [6, 7], result: 'Legendary sleight of hand, make object vanish + reappear elsewhere', type: 'success' },
            { roll: [8, 9], result: 'Cosmic sleight, steal fate + rewrite destiny', type: 'success' },
            { roll: [10, 10], result: 'Absolute mastery, steal reality itself + reshape existence', type: 'critical' }
        ]
    },
    sleightOfHand_master_d12: {
        name: 'Master Sleight of Hand (d12)',
        description: 'Master sleight of hand on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Masterful trick, multiple targets', type: 'failure' },
            { roll: [2, 3], result: 'Exceptional dexterity, steal equipped items + plant evidence', type: 'failure' },
            { roll: [4, 6], result: 'Masterful technique, steal from multiple targets undetected', type: 'normal' },
            { roll: [7, 9], result: 'Legendary sleight of hand, make object vanish + reappear elsewhere', type: 'success' },
            { roll: [10, 11], result: 'Cosmic sleight, steal fate + rewrite destiny', type: 'success' },
            { roll: [12, 12], result: 'Absolute mastery, steal reality itself + reshape existence', type: 'critical' }
        ]
    },
    sleightOfHand_master_d20: {
        name: 'Master Sleight of Hand (d20)',
        description: 'Master sleight of hand on an extremely difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 3], result: 'Even your ultimate mastery is challenged', type: 'failure' },
            { roll: [4, 5], result: 'You struggle with this impossible task', type: 'failure' },
            { roll: [6, 8], result: 'Masterful technique, steal from multiple targets undetected', type: 'normal' },
            { roll: [9, 10], result: 'Legendary sleight of hand, make object vanish + reappear elsewhere', type: 'normal' },
            { roll: [11, 13], result: 'Cosmic sleight, steal fate + rewrite destiny', type: 'success' },
            { roll: [14, 16], result: 'Absolute mastery, steal reality itself + reshape existence', type: 'success' },
            { roll: [17, 19], result: 'Transcendent fingers, steal the concept of possession', type: 'critical' },
            { roll: [20, 20], result: 'Perfect supremacy, you redefine the concept of theft itself', type: 'critical' }
        ]
    }
};

