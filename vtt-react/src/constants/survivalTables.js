// Survival Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total

export const SURVIVAL_TABLES = {
    // UNTRAINED - d4 through d20
    survival_untrained_d4: {
        name: 'Untrained Survival (d4)',
        description: 'Untrained survival on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You get lost within sight of camp', type: 'failure' },
            { roll: [2, 2], result: 'You find basic shelter but waste time', type: 'normal' },
            { roll: [3, 3], result: 'You secure adequate shelter and rest', type: 'success' },
            { roll: [4, 4], result: 'You find shelter and edible plants nearby', type: 'success' }
        ]
    },
    survival_untrained_d6: {
        name: 'Untrained Survival (d6)',
        description: 'Untrained survival on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You eat poisonous berries, take 1d4 damage', type: 'failure' },
            { roll: [2, 2], result: 'You wander in circles, lose half a day', type: 'failure' },
            { roll: [3, 3], result: 'You find minimal food, still hungry', type: 'normal' },
            { roll: [4, 4], result: 'You make slow progress, exhausted', type: 'normal' },
            { roll: [5, 5], result: 'You navigate correctly and find water', type: 'success' },
            { roll: [6, 6], result: 'You track game successfully, secure food', type: 'success' }
        ]
    },
    survival_untrained_d8: {
        name: 'Untrained Survival (d8)',
        description: 'Untrained survival on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You attract predators, must flee or fight', type: 'failure' },
            { roll: [2, 2], result: 'You suffer exposure, lose 1d6 HP', type: 'failure' },
            { roll: [3, 3], result: 'You waste supplies trying to start fire', type: 'failure' },
            { roll: [4, 4], result: 'You get disoriented, wrong direction', type: 'failure' },
            { roll: [5, 5], result: 'You barely survive, exhausted and hungry', type: 'normal' },
            { roll: [6, 6], result: 'You find temporary shelter, no rest', type: 'normal' },
            { roll: [7, 7], result: 'You navigate safely and find basic food', type: 'success' },
            { roll: [8, 8], result: 'You secure shelter and clean water', type: 'success' }
        ]
    },
    survival_untrained_d10: {
        name: 'Untrained Survival (d10)',
        description: 'Untrained survival on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You stumble into dangerous territory, ambushed', type: 'failure' },
            { roll: [2, 3], result: 'You drink contaminated water, poisoned', type: 'failure' },
            { roll: [4, 5], result: 'You lose your way completely, panic sets in', type: 'failure' },
            { roll: [6, 6], result: 'You injure yourself foraging, take 1d4 damage', type: 'failure' },
            { roll: [7, 7], result: 'You survive but use all rations', type: 'normal' },
            { roll: [8, 8], result: 'You make minimal progress, still lost', type: 'normal' },
            { roll: [9, 9], result: 'You stumble onto a safe path', type: 'success' },
            { roll: [10, 10], result: 'You find shelter and avoid danger', type: 'success' }
        ]
    },
    survival_untrained_d12: {
        name: 'Untrained Survival (d12)',
        description: 'Untrained survival on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You collapse from exposure, unconscious', type: 'failure' },
            { roll: [3, 4], result: 'You are tracked by predators, hunted', type: 'failure' },
            { roll: [5, 6], result: 'You starve, lose 1d8 HP and exhausted', type: 'failure' },
            { roll: [7, 8], result: 'You get hopelessly lost, days off course', type: 'failure' },
            { roll: [9, 9], result: 'You barely cling to life, critical condition', type: 'failure' },
            { roll: [10, 10], result: 'You survive through sheer luck, wounded', type: 'normal' },
            { roll: [11, 11], result: 'You find minimal shelter, still in danger', type: 'success' },
            { roll: [12, 12], result: 'Against odds, you find safe haven', type: 'success' }
        ]
    },
    survival_untrained_d20: {
        name: 'Untrained Survival (d20)',
        description: 'Untrained survival on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'You perish from exposure and starvation', type: 'failure' },
            { roll: [4, 6], result: 'You are mauled by predators, near death', type: 'failure' },
            { roll: [7, 9], result: 'You fall into ravine or trap, severe injury', type: 'failure' },
            { roll: [10, 12], result: 'You succumb to elements, unconscious', type: 'failure' },
            { roll: [13, 15], result: 'You are completely lost, no hope', type: 'failure' },
            { roll: [16, 17], result: 'You barely survive, critically wounded', type: 'failure' },
            { roll: [18, 18], result: 'You cling to life through pure luck', type: 'normal' },
            { roll: [19, 19], result: 'Miraculous survival, find minimal shelter', type: 'success' },
            { roll: [20, 20], result: 'Impossible luck, you find safe passage', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    survival_novice_d4: {
        name: 'Novice Survival (d4)',
        description: 'Novice survival on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misjudge the weather, minor setback', type: 'failure' },
            { roll: [2, 2], result: 'You find adequate shelter and food', type: 'normal' },
            { roll: [3, 3], result: 'You navigate efficiently, make good time', type: 'success' },
            { roll: [4, 4], result: 'You find excellent shelter and fresh water', type: 'success' }
        ]
    },
    survival_novice_d6: {
        name: 'Novice Survival (d6)',
        description: 'Novice survival on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misread tracks, waste time', type: 'failure' },
            { roll: [2, 2], result: 'You take longer route, delayed', type: 'failure' },
            { roll: [3, 3], result: 'You find basic necessities, slow progress', type: 'normal' },
            { roll: [4, 4], result: 'You navigate safely, adequate rest', type: 'normal' },
            { roll: [5, 5], result: 'You track game successfully, good meal', type: 'success' },
            { roll: [6, 6], result: 'You find ideal campsite, full rest', type: 'success' }
        ]
    },
    survival_novice_d8: {
        name: 'Novice Survival (d8)',
        description: 'Novice survival on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You underestimate conditions, minor injury', type: 'failure' },
            { roll: [2, 2], result: 'You lose your bearings briefly, delayed', type: 'failure' },
            { roll: [3, 3], result: 'You struggle with terrain, exhausted', type: 'failure' },
            { roll: [4, 4], result: 'You make slow progress, minimal food', type: 'failure' },
            { roll: [5, 5], result: 'You survive adequately, tired', type: 'normal' },
            { roll: [6, 6], result: 'You find shelter, partial rest', type: 'normal' },
            { roll: [7, 7], result: 'You navigate well, secure food and water', type: 'success' },
            { roll: [8, 8], result: 'You find safe route and good shelter', type: 'success' }
        ]
    },
    survival_novice_d10: {
        name: 'Novice Survival (d10)',
        description: 'Novice survival on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misjudge danger, encounter predators', type: 'failure' },
            { roll: [2, 3], result: 'You get turned around, lose half a day', type: 'failure' },
            { roll: [4, 5], result: 'You struggle to find food, still hungry', type: 'failure' },
            { roll: [6, 6], result: 'You make poor shelter choice, no rest', type: 'failure' },
            { roll: [7, 7], result: 'You survive but use extra rations', type: 'normal' },
            { roll: [8, 8], result: 'You find adequate shelter, tired', type: 'normal' },
            { roll: [9, 9], result: 'You navigate successfully, find food', type: 'success' },
            { roll: [10, 10], result: 'You find safe path and good campsite', type: 'success' }
        ]
    },
    survival_novice_d12: {
        name: 'Novice Survival (d12)',
        description: 'Novice survival on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'You suffer exposure, take 1d4 damage', type: 'failure' },
            { roll: [3, 4], result: 'You get lost, waste a full day', type: 'failure' },
            { roll: [5, 6], result: 'You fail to find food, weakened', type: 'failure' },
            { roll: [7, 8], result: 'You struggle with conditions, exhausted', type: 'failure' },
            { roll: [9, 9], result: 'You barely make progress, still at risk', type: 'failure' },
            { roll: [10, 10], result: 'You survive but depleted', type: 'normal' },
            { roll: [11, 11], result: 'You find minimal shelter and food', type: 'success' },
            { roll: [12, 12], result: 'You navigate through danger safely', type: 'success' }
        ]
    },
    survival_novice_d20: {
        name: 'Novice Survival (d20)',
        description: 'Novice survival on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'You collapse from exhaustion, unconscious', type: 'failure' },
            { roll: [4, 6], result: 'You are hunted by predators, must flee', type: 'failure' },
            { roll: [7, 9], result: 'You suffer severe exposure, lose 1d6 HP', type: 'failure' },
            { roll: [10, 12], result: 'You get hopelessly lost, days delayed', type: 'failure' },
            { roll: [13, 15], result: 'You struggle to survive, critically low on supplies', type: 'failure' },
            { roll: [16, 17], result: 'You barely endure, wounded and exhausted', type: 'failure' },
            { roll: [18, 18], result: 'You survive through determination', type: 'normal' },
            { roll: [19, 19], result: 'You find shelter and minimal food', type: 'success' },
            { roll: [20, 20], result: 'You discover safe passage through luck', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    survival_trained_d4: {
        name: 'Trained Survival (d4)',
        description: 'Trained survival on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You take slightly longer than expected', type: 'failure' },
            { roll: [2, 2], result: 'You handle conditions competently', type: 'normal' },
            { roll: [3, 3], result: 'You navigate efficiently, find good shelter', type: 'success' },
            { roll: [4, 4], result: 'You thrive, find abundant food and water', type: 'success' }
        ]
    },
    survival_trained_d6: {
        name: 'Trained Survival (d6)',
        description: 'Trained survival on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You misread weather signs, minor delay', type: 'failure' },
            { roll: [2, 2], result: 'You take safe but slow route', type: 'failure' },
            { roll: [3, 3], result: 'You navigate competently, adequate rest', type: 'normal' },
            { roll: [4, 4], result: 'You find good shelter and food', type: 'normal' },
            { roll: [5, 5], result: 'You track efficiently, secure provisions', type: 'success' },
            { roll: [6, 6], result: 'You find ideal route and excellent campsite', type: 'success' }
        ]
    },
    survival_trained_d8: {
        name: 'Trained Survival (d8)',
        description: 'Trained survival on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You misjudge conditions, waste supplies', type: 'failure' },
            { roll: [2, 2], result: 'You struggle with terrain, delayed', type: 'failure' },
            { roll: [3, 3], result: 'You make slow but steady progress', type: 'failure' },
            { roll: [4, 4], result: 'You navigate safely, tired', type: 'failure' },
            { roll: [5, 5], result: 'You handle conditions adequately', type: 'normal' },
            { roll: [6, 6], result: 'You find decent shelter and food', type: 'normal' },
            { roll: [7, 7], result: 'You navigate efficiently, secure provisions', type: 'success' },
            { roll: [8, 8], result: 'You find safe route and good rest', type: 'success' }
        ]
    },
    survival_trained_d10: {
        name: 'Trained Survival (d10)',
        description: 'Trained survival on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You underestimate danger, encounter threat', type: 'failure' },
            { roll: [2, 3], result: 'You lose your way temporarily, delayed', type: 'failure' },
            { roll: [4, 5], result: 'You struggle to find adequate food', type: 'failure' },
            { roll: [6, 6], result: 'You make minimal progress, tired', type: 'failure' },
            { roll: [7, 7], result: 'You navigate adequately, use extra supplies', type: 'normal' },
            { roll: [8, 8], result: 'You find decent shelter and water', type: 'normal' },
            { roll: [9, 9], result: 'You handle conditions well, secure food', type: 'success' },
            { roll: [10, 10], result: 'You find efficient route and good campsite', type: 'success' }
        ]
    },
    survival_trained_d12: {
        name: 'Trained Survival (d12)',
        description: 'Trained survival on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'You misjudge severity, take 1d4 damage', type: 'failure' },
            { roll: [3, 4], result: 'You get disoriented, lose significant time', type: 'failure' },
            { roll: [5, 6], result: 'You struggle with harsh conditions, exhausted', type: 'failure' },
            { roll: [7, 8], result: 'You barely maintain course, depleted', type: 'failure' },
            { roll: [9, 9], result: 'You survive but use most supplies', type: 'failure' },
            { roll: [10, 10], result: 'You endure adequately, tired', type: 'normal' },
            { roll: [11, 11], result: 'You navigate through danger, find shelter', type: 'success' },
            { roll: [12, 12], result: 'You handle conditions competently, secure provisions', type: 'success' }
        ]
    },
    survival_trained_d20: {
        name: 'Trained Survival (d20)',
        description: 'Trained survival on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 3], result: 'You are overwhelmed, severe exposure damage', type: 'failure' },
            { roll: [4, 6], result: 'You encounter predators, must fight or flee', type: 'failure' },
            { roll: [7, 9], result: 'You suffer from elements, lose 1d6 HP', type: 'failure' },
            { roll: [10, 12], result: 'You get badly lost, days off course', type: 'failure' },
            { roll: [13, 15], result: 'You struggle to survive, critically low supplies', type: 'failure' },
            { roll: [16, 17], result: 'You endure but wounded and exhausted', type: 'failure' },
            { roll: [18, 18], result: 'You survive through skill and determination', type: 'normal' },
            { roll: [19, 19], result: 'You navigate through danger, find shelter', type: 'success' },
            { roll: [20, 20], result: 'You discover hidden safe route', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    survival_apprentice_d4: {
        name: 'Apprentice Survival (d4)',
        description: 'Apprentice survival on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You complete task with minor inefficiency', type: 'failure' },
            { roll: [2, 2], result: 'You handle conditions with ease', type: 'normal' },
            { roll: [3, 3], result: 'You navigate expertly, find excellent shelter', type: 'success' },
            { roll: [4, 4], result: 'You thrive, abundant provisions and perfect rest', type: 'success' }
        ]
    },
    survival_apprentice_d6: {
        name: 'Apprentice Survival (d6)',
        description: 'Apprentice survival on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You take cautious approach, slightly slow', type: 'failure' },
            { roll: [2, 2], result: 'You navigate safely, adequate progress', type: 'failure' },
            { roll: [3, 3], result: 'You handle conditions well, good shelter', type: 'normal' },
            { roll: [4, 4], result: 'You find efficient route and provisions', type: 'normal' },
            { roll: [5, 5], result: 'You track expertly, secure abundant food', type: 'success' },
            { roll: [6, 6], result: 'You find optimal path and ideal campsite', type: 'success' }
        ]
    },
    survival_apprentice_d8: {
        name: 'Apprentice Survival (d8)',
        description: 'Apprentice survival on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You misjudge one factor, minor setback', type: 'failure' },
            { roll: [2, 2], result: 'You take longer route to ensure safety', type: 'failure' },
            { roll: [3, 3], result: 'You navigate competently, some fatigue', type: 'failure' },
            { roll: [4, 4], result: 'You handle conditions adequately', type: 'failure' },
            { roll: [5, 5], result: 'You find good shelter and water', type: 'normal' },
            { roll: [6, 6], result: 'You navigate efficiently, secure food', type: 'normal' },
            { roll: [7, 7], result: 'You handle terrain expertly, good provisions', type: 'success' },
            { roll: [8, 8], result: 'You find safe route and excellent rest', type: 'success' }
        ]
    },
    survival_apprentice_d10: {
        name: 'Apprentice Survival (d10)',
        description: 'Apprentice survival on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You underestimate challenge, minor injury', type: 'failure' },
            { roll: [2, 3], result: 'You lose time navigating obstacles', type: 'failure' },
            { roll: [4, 5], result: 'You struggle with conditions, tired', type: 'failure' },
            { roll: [6, 6], result: 'You make adequate progress, use extra supplies', type: 'failure' },
            { roll: [7, 7], result: 'You navigate competently, find shelter', type: 'normal' },
            { roll: [8, 8], result: 'You handle conditions well, secure food', type: 'normal' },
            { roll: [9, 9], result: 'You navigate efficiently, good provisions', type: 'success' },
            { roll: [10, 10], result: 'You find optimal route and safe campsite', type: 'success' }
        ]
    },
    survival_apprentice_d12: {
        name: 'Apprentice Survival (d12)',
        description: 'Apprentice survival on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 2], result: 'You misjudge severity, take minor damage', type: 'failure' },
            { roll: [3, 4], result: 'You get temporarily disoriented, delayed', type: 'failure' },
            { roll: [5, 6], result: 'You struggle with harsh conditions, exhausted', type: 'failure' },
            { roll: [7, 8], result: 'You maintain course but depleted', type: 'failure' },
            { roll: [9, 9], result: 'You survive adequately, use most supplies', type: 'failure' },
            { roll: [10, 10], result: 'You endure competently, tired', type: 'normal' },
            { roll: [11, 11], result: 'You navigate through danger, find good shelter', type: 'success' },
            { roll: [12, 12], result: 'You handle conditions expertly, secure provisions', type: 'success' }
        ]
    },
    survival_apprentice_d20: {
        name: 'Apprentice Survival (d20)',
        description: 'Apprentice survival on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 3], result: 'You are overwhelmed by conditions, take 1d6 damage', type: 'failure' },
            { roll: [4, 6], result: 'You encounter serious danger, must evade', type: 'failure' },
            { roll: [7, 9], result: 'You suffer from elements, weakened', type: 'failure' },
            { roll: [10, 12], result: 'You get lost temporarily, significant delay', type: 'failure' },
            { roll: [13, 15], result: 'You struggle to survive, low on supplies', type: 'failure' },
            { roll: [16, 17], result: 'You endure but exhausted', type: 'failure' },
            { roll: [18, 18], result: 'You survive through skill', type: 'normal' },
            { roll: [19, 19], result: 'You navigate danger, find shelter and food', type: 'success' },
            { roll: [20, 20], result: 'You discover safe passage and good campsite', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    survival_adept_d4: {
        name: 'Adept Survival (d4)',
        description: 'Adept survival on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'You master conditions, find extra provisions', type: 'success' },
            { roll: [3, 3], result: 'You navigate perfectly, discover hidden resources', type: 'success' },
            { roll: [4, 4], result: 'You thrive completely, gain advantage on next survival roll', type: 'critical' }
        ]
    },
    survival_adept_d6: {
        name: 'Adept Survival (d6)',
        description: 'Adept survival on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You handle task with minimal effort', type: 'failure' },
            { roll: [2, 2], result: 'You navigate expertly, good progress', type: 'normal' },
            { roll: [3, 3], result: 'You find optimal route and excellent shelter', type: 'normal' },
            { roll: [4, 4], result: 'You secure abundant provisions efficiently', type: 'success' },
            { roll: [5, 5], result: 'You discover hidden water source and game trails', type: 'success' },
            { roll: [6, 6], result: 'You find perfect campsite, allies gain +1 to survival', type: 'critical' }
        ]
    },
    survival_adept_d8: {
        name: 'Adept Survival (d8)',
        description: 'Adept survival on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You take extra precautions, slightly slow', type: 'failure' },
            { roll: [2, 2], result: 'You navigate competently, adequate rest', type: 'failure' },
            { roll: [3, 3], result: 'You handle conditions well, good shelter', type: 'normal' },
            { roll: [4, 4], result: 'You find efficient route and provisions', type: 'normal' },
            { roll: [5, 5], result: 'You navigate expertly, secure abundant food', type: 'normal' },
            { roll: [6, 6], result: 'You master terrain, find excellent campsite', type: 'success' },
            { roll: [7, 7], result: 'You discover safe shortcuts and hidden resources', type: 'success' },
            { roll: [8, 8], result: 'You find ideal route, party gains full rest benefits', type: 'critical' }
        ]
    },
    survival_adept_d10: {
        name: 'Adept Survival (d10)',
        description: 'Adept survival on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You face unexpected challenge, minor delay', type: 'failure' },
            { roll: [2, 3], result: 'You navigate carefully, use extra time', type: 'failure' },
            { roll: [4, 5], result: 'You handle conditions competently, tired', type: 'failure' },
            { roll: [6, 6], result: 'You make good progress, adequate shelter', type: 'normal' },
            { roll: [7, 7], result: 'You navigate efficiently, find food and water', type: 'normal' },
            { roll: [8, 8], result: 'You master conditions, secure good provisions', type: 'success' },
            { roll: [9, 9], result: 'You find optimal route and excellent campsite', type: 'success' },
            { roll: [10, 10], result: 'You discover hidden safe passage, avoid all dangers', type: 'critical' }
        ]
    },
    survival_adept_d12: {
        name: 'Adept Survival (d12)',
        description: 'Adept survival on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 2], result: 'You misjudge one factor, minor setback', type: 'failure' },
            { roll: [3, 4], result: 'You take cautious approach, delayed', type: 'failure' },
            { roll: [5, 6], result: 'You struggle with harsh conditions, fatigued', type: 'failure' },
            { roll: [7, 8], result: 'You maintain course adequately, use supplies', type: 'failure' },
            { roll: [9, 9], result: 'You navigate competently, find shelter', type: 'normal' },
            { roll: [10, 10], result: 'You handle conditions well, secure food', type: 'normal' },
            { roll: [11, 11], result: 'You master terrain, find good provisions and rest', type: 'success' },
            { roll: [12, 12], result: 'You navigate expertly, discover hidden resources', type: 'critical' }
        ]
    },
    survival_adept_d20: {
        name: 'Adept Survival (d20)',
        description: 'Adept survival on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 3], result: 'You are challenged by severity, take minor damage', type: 'failure' },
            { roll: [4, 5], result: 'You face serious obstacles, delayed', type: 'failure' },
            { roll: [6, 8], result: 'You struggle with elements, exhausted', type: 'failure' },
            { roll: [9, 10], result: 'You navigate carefully, use most supplies', type: 'normal' },
            { roll: [11, 13], result: 'You handle conditions competently, find shelter', type: 'normal' },
            { roll: [14, 16], result: 'You master terrain, secure provisions', type: 'success' },
            { roll: [17, 18], result: 'You navigate expertly, find safe route and food', type: 'success' },
            { roll: [19, 19], result: 'You discover hidden sanctuary, full rest and resources', type: 'critical' },
            { roll: [20, 20], result: 'You turn hostile terrain to advantage, gain future bonuses', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    survival_expert_d4: {
        name: 'Expert Survival (d4)',
        description: 'Expert survival on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'You navigate perfectly, discover abundant resources', type: 'critical' },
            { roll: [3, 3], result: 'You read terrain like a map, find optimal routes for miles', type: 'critical' },
            { roll: [4, 4], result: 'You command the wilderness, party gains lasting survival bonuses', type: 'critical' }
        ]
    },
    survival_expert_d6: {
        name: 'Expert Survival (d6)',
        description: 'Expert survival on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You navigate flawlessly, find excellent provisions', type: 'success' },
            { roll: [3, 3], result: 'You discover hidden landmarks and safe routes', type: 'success' },
            { roll: [4, 4], result: 'You find pristine campsite and abundant game', type: 'success' },
            { roll: [5, 5], result: 'You read weather patterns, avoid storms days ahead', type: 'critical' },
            { roll: [6, 6], result: 'You establish perfect base camp, party gains extended rest benefits', type: 'critical' }
        ]
    },
    survival_expert_d8: {
        name: 'Expert Survival (d8)',
        description: 'Expert survival on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You take measured approach, slightly cautious', type: 'failure' },
            { roll: [2, 2], result: 'You navigate expertly, good progress', type: 'normal' },
            { roll: [3, 3], result: 'You master conditions, find excellent shelter', type: 'normal' },
            { roll: [4, 4], result: 'You secure abundant provisions efficiently', type: 'normal' },
            { roll: [5, 5], result: 'You discover hidden resources and safe paths', type: 'success' },
            { roll: [6, 6], result: 'You navigate perfectly, find ideal campsite', type: 'success' },
            { roll: [7, 7], result: 'You read terrain expertly, discover shortcuts and caches', type: 'critical' },
            { roll: [8, 8], result: 'You command wilderness, turn obstacles into advantages', type: 'critical' }
        ]
    },
    survival_expert_d10: {
        name: 'Expert Survival (d10)',
        description: 'Expert survival on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You face unexpected complexity, minor delay', type: 'failure' },
            { roll: [2, 3], result: 'You navigate carefully through challenges', type: 'failure' },
            { roll: [4, 5], result: 'You handle conditions competently, adequate rest', type: 'normal' },
            { roll: [6, 6], result: 'You master terrain, find good shelter and food', type: 'normal' },
            { roll: [7, 7], result: 'You navigate expertly, secure excellent provisions', type: 'success' },
            { roll: [8, 8], result: 'You discover hidden safe routes and resources', type: 'success' },
            { roll: [9, 9], result: 'You read wilderness perfectly, find sanctuary', type: 'critical' },
            { roll: [10, 10], result: 'You turn harsh terrain to advantage, establish supply caches', type: 'critical' }
        ]
    },
    survival_expert_d12: {
        name: 'Expert Survival (d12)',
        description: 'Expert survival on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 2], result: 'You face formidable challenge, minor setback', type: 'failure' },
            { roll: [3, 4], result: 'You take cautious route, delayed but safe', type: 'failure' },
            { roll: [5, 6], result: 'You struggle with severity, fatigued', type: 'failure' },
            { roll: [7, 8], result: 'You navigate competently, use supplies wisely', type: 'normal' },
            { roll: [9, 9], result: 'You master conditions, find adequate shelter', type: 'normal' },
            { roll: [10, 10], result: 'You handle terrain expertly, secure provisions', type: 'success' },
            { roll: [11, 11], result: 'You discover hidden routes and abundant resources', type: 'critical' },
            { roll: [12, 12], result: 'You command wilderness, establish safe haven for future use', type: 'critical' }
        ]
    },
    survival_expert_d20: {
        name: 'Expert Survival (d20)',
        description: 'Expert survival on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 3], result: 'Even your mastery is tested, take minor damage', type: 'failure' },
            { roll: [4, 5], result: 'You face extreme conditions, significant delay', type: 'failure' },
            { roll: [6, 8], result: 'You struggle with severity, exhausted', type: 'failure' },
            { roll: [9, 10], result: 'You navigate carefully, use most supplies', type: 'normal' },
            { roll: [11, 13], result: 'You master conditions, find shelter and food', type: 'normal' },
            { roll: [14, 16], result: 'You handle terrain expertly, secure good provisions', type: 'success' },
            { roll: [17, 18], result: 'You discover hidden sanctuary and safe routes', type: 'success' },
            { roll: [19, 19], result: 'You read wilderness perfectly, establish base camp with lasting benefits', type: 'critical' },
            { roll: [20, 20], result: 'You command nature itself, turn deadly terrain into thriving haven', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    survival_master_d4: {
        name: 'Master Survival (d4)',
        description: 'Master survival on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You read wilderness like your own hand, discover ancient safe routes', type: 'critical' },
            { roll: [3, 3], result: 'You command terrain completely, establish permanent supply caches', type: 'critical' },
            { roll: [4, 4], result: 'You become one with nature, party gains permanent survival bonuses in region', type: 'critical' }
        ]
    },
    survival_master_d6: {
        name: 'Master Survival (d6)',
        description: 'Master survival on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You navigate flawlessly, discover pristine resources', type: 'success' },
            { roll: [3, 3], result: 'You read terrain perfectly, find hidden sanctuaries', type: 'success' },
            { roll: [4, 4], result: 'You establish ideal base camp with abundant provisions', type: 'success' },
            { roll: [5, 5], result: 'You predict weather weeks ahead, avoid all natural dangers', type: 'critical' },
            { roll: [6, 6], result: 'You command wilderness, create thriving haven for all travelers', type: 'critical' }
        ]
    },
    survival_master_d8: {
        name: 'Master Survival (d8)',
        description: 'Master survival on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You approach with legendary caution', type: 'failure' },
            { roll: [2, 2], result: 'You navigate with complete mastery', type: 'normal' },
            { roll: [3, 3], result: 'You command conditions, find excellent shelter', type: 'normal' },
            { roll: [4, 4], result: 'You secure abundant provisions effortlessly', type: 'normal' },
            { roll: [5, 5], result: 'You discover hidden resources and ancient routes', type: 'success' },
            { roll: [6, 6], result: 'You navigate perfectly, establish ideal campsite', type: 'success' },
            { roll: [7, 7], result: 'You read wilderness like a book, find legendary shortcuts', type: 'critical' },
            { roll: [8, 8], result: 'You become legend of the wild, terrain bends to your will', type: 'critical' }
        ]
    },
    survival_master_d10: {
        name: 'Master Survival (d10)',
        description: 'Master survival on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Even legends face challenges, minor delay', type: 'failure' },
            { roll: [2, 3], result: 'You navigate with masterful care', type: 'failure' },
            { roll: [4, 5], result: 'You handle conditions with legendary skill', type: 'normal' },
            { roll: [6, 6], result: 'You master terrain completely, find excellent shelter', type: 'normal' },
            { roll: [7, 7], result: 'You navigate flawlessly, secure abundant provisions', type: 'success' },
            { roll: [8, 8], result: 'You discover hidden sanctuaries and ancient routes', type: 'success' },
            { roll: [9, 9], result: 'You read wilderness perfectly, establish permanent safe haven', type: 'critical' },
            { roll: [10, 10], result: 'You command nature, create legendary base camp known for generations', type: 'critical' }
        ]
    },
    survival_master_d12: {
        name: 'Master Survival (d12)',
        description: 'Master survival on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 2], result: 'You face legendary challenge, minor setback', type: 'failure' },
            { roll: [3, 4], result: 'You take measured approach, delayed but wise', type: 'failure' },
            { roll: [5, 6], result: 'You struggle with extreme severity, fatigued', type: 'failure' },
            { roll: [7, 8], result: 'You navigate with masterful precision', type: 'normal' },
            { roll: [9, 9], result: 'You command conditions, find good shelter', type: 'normal' },
            { roll: [10, 10], result: 'You master terrain completely, secure provisions', type: 'success' },
            { roll: [11, 11], result: 'You discover ancient routes and hidden sanctuaries', type: 'critical' },
            { roll: [12, 12], result: 'You become legend, establish haven that saves countless lives', type: 'critical' }
        ]
    },
    survival_master_d20: {
        name: 'Master Survival (d20)',
        description: 'Master survival on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 3], result: 'Even mastery has limits, take minor damage', type: 'failure' },
            { roll: [4, 5], result: 'You face conditions that test legends, delayed', type: 'failure' },
            { roll: [6, 8], result: 'You struggle with impossible severity, exhausted', type: 'failure' },
            { roll: [9, 10], result: 'You navigate with legendary care, use supplies wisely', type: 'normal' },
            { roll: [11, 13], result: 'You master deadly conditions, find shelter and food', type: 'normal' },
            { roll: [14, 16], result: 'You command hostile terrain, secure excellent provisions', type: 'success' },
            { roll: [17, 18], result: 'You discover hidden sanctuary in impossible places', type: 'success' },
            { roll: [19, 19], result: 'You read wilderness perfectly, establish legendary base camp', type: 'critical' },
            { roll: [20, 20], result: 'You achieve remarkable feat, adapt deadliest terrain into safe haven, establishing a legendary base', type: 'critical' }
        ]
    }
};

