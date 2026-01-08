// Animal Handling Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total
// Each die type has exact outcome count: d4=4, d6=6, d8=8, d10=10, d12=12, d20=13
// For d20 tables: 13 unique outcomes with ranges covering all 20 possible roll values

export const ANIMAL_HANDLING_TABLES = {
    // UNTRAINED - d4 through d20
    animalhandling_untrained_d4: {
        name: 'Untrained Animal Handling (d4)',
        description: 'Untrained animal handling on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You spook the animal with sudden movement', type: 'failure' },
            { roll: [2, 2], result: 'Animal remains wary but does not flee', type: 'normal' },
            { roll: [3, 3], result: 'Animal accepts your presence cautiously', type: 'success' },
            { roll: [4, 4], result: 'Animal calms and allows approach', type: 'success' }
        ]
    },
    animalhandling_untrained_d6: {
        name: 'Untrained Animal Handling (d6)',
        description: 'Untrained animal handling on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Animal panics and bolts away', type: 'failure' },
            { roll: [2, 2], result: 'You give wrong signal, animal confused', type: 'failure' },
            { roll: [3, 3], result: 'Animal backs away nervously', type: 'normal' },
            { roll: [4, 4], result: 'Animal watches you with suspicion', type: 'normal' },
            { roll: [5, 5], result: 'Animal tolerates your presence', type: 'success' },
            { roll: [6, 6], result: 'Animal shows mild curiosity', type: 'success' }
        ]
    },
    animalhandling_untrained_d8: {
        name: 'Untrained Animal Handling (d8)',
        description: 'Untrained animal handling on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Animal bites or kicks defensively', type: 'failure' },
            { roll: [2, 2], result: 'Animal rears up, nearly trampling you', type: 'failure' },
            { roll: [3, 3], result: 'Your clumsy approach frightens the animal', type: 'failure' },
            { roll: [4, 4], result: 'Animal growls or hisses in warning', type: 'failure' },
            { roll: [5, 5], result: 'Animal remains agitated but does not attack', type: 'normal' },
            { roll: [6, 6], result: 'Animal settles slightly after initial fear', type: 'normal' },
            { roll: [7, 7], result: 'Animal accepts basic contact', type: 'success' },
            { roll: [8, 8], result: 'Animal calms enough to be led', type: 'success' }
        ]
    },
    animalhandling_untrained_d10: {
        name: 'Untrained Animal Handling (d10)',
        description: 'Untrained animal handling on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Animal attacks violently, 1d6 damage', type: 'failure' },
            { roll: [2, 2], result: 'Animal breaks free and flees permanently', type: 'failure' },
            { roll: [3, 3], result: 'Your fear transmits, animal becomes hostile', type: 'failure' },
            { roll: [4, 4], result: 'Animal refuses all commands, thrashes', type: 'failure' },
            { roll: [5, 5], result: 'Animal alerts others with distress calls', type: 'failure' },
            { roll: [6, 6], result: 'Animal barely tolerates your presence', type: 'normal' },
            { roll: [7, 7], result: 'Animal obeys one simple command reluctantly', type: 'normal' },
            { roll: [8, 8], result: 'Through luck, animal cooperates briefly', type: 'success' },
            { roll: [9, 9], result: 'Animal unexpectedly responds to your tone', type: 'success' },
            { roll: [10, 10], result: 'Surprising moment of connection forms', type: 'critical' }
        ]
    },
    animalhandling_untrained_d12: {
        name: 'Untrained Animal Handling (d12)',
        description: 'Untrained animal handling on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Animal mauls you savagely, 2d6 damage', type: 'failure' },
            { roll: [2, 2], result: 'Animal stampedes, endangering others', type: 'failure' },
            { roll: [3, 3], result: 'You provoke territorial aggression', type: 'failure' },
            { roll: [4, 4], result: 'Animal sees you as threat, will not calm', type: 'failure' },
            { roll: [5, 5], result: 'Animal ignores you completely', type: 'failure' },
            { roll: [6, 6], result: 'Animal watches but will not approach', type: 'normal' },
            { roll: [7, 7], result: 'Animal accepts food but remains distant', type: 'normal' },
            { roll: [8, 8], result: 'Animal shows brief flicker of interest', type: 'normal' },
            { roll: [9, 9], result: 'Animal allows one cautious touch', type: 'success' },
            { roll: [10, 10], result: 'Animal senses your good intent', type: 'success' },
            { roll: [11, 11], result: 'Miraculous calm, animal allows brief touch', type: 'success' },
            { roll: [12, 12], result: 'Impossible instinct creates fragile trust', type: 'critical' }
        ]
    },
    animalhandling_untrained_d20: {
        name: 'Untrained Animal Handling (d20)',
        description: 'Untrained animal handling on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Predator attacks pack, 3d6 damage to all nearby', type: 'failure' },
            { roll: [2, 3], result: 'Animal goes berserk, destroys equipment', type: 'failure' },
            { roll: [4, 5], result: 'Entire herd scatters in panic', type: 'failure' },
            { roll: [6, 7], result: 'Animal injures itself trying to escape', type: 'failure' },
            { roll: [8, 9], result: 'You break fragile trust completely', type: 'failure' },
            { roll: [10, 11], result: 'Animal remains wild and unreachable', type: 'failure' },
            { roll: [12, 13], result: 'Animal freezes in primal terror', type: 'failure' },
            { roll: [14, 15], result: 'Animal stops attacking but stays hostile', type: 'normal' },
            { roll: [16, 16], result: 'Animal pauses, uncertain', type: 'normal' },
            { roll: [17, 17], result: 'Animal shows momentary hesitation', type: 'normal' },
            { roll: [18, 18], result: 'Against odds, animal shows brief curiosity', type: 'success' },
            { roll: [19, 19], result: 'Animal senses something different in you', type: 'success' },
            { roll: [20, 20], result: 'Impossible instinct guides you, animal trusts', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    animalhandling_novice_d4: {
        name: 'Novice Animal Handling (d4)',
        description: 'Novice animal handling on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Animal startles at your approach', type: 'failure' },
            { roll: [2, 2], result: 'Animal calms quickly with gentle words', type: 'normal' },
            { roll: [3, 3], result: 'Animal responds to basic commands', type: 'success' },
            { roll: [4, 4], result: 'Animal shows trust, follows willingly', type: 'success' }
        ]
    },
    animalhandling_novice_d6: {
        name: 'Novice Animal Handling (d6)',
        description: 'Novice animal handling on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Animal misreads your intent, backs away', type: 'failure' },
            { roll: [2, 2], result: 'Animal hesitates, unsure of your signals', type: 'failure' },
            { roll: [3, 3], result: 'Animal obeys after some coaxing', type: 'normal' },
            { roll: [4, 4], result: 'Animal responds but needs reassurance', type: 'normal' },
            { roll: [5, 5], result: 'Animal follows your lead confidently', type: 'success' },
            { roll: [6, 6], result: 'Animal bonds with you, eager to please', type: 'success' }
        ]
    },
    animalhandling_novice_d8: {
        name: 'Novice Animal Handling (d8)',
        description: 'Novice animal handling on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Animal snaps at you in frustration', type: 'failure' },
            { roll: [2, 2], result: 'Animal pulls away, breaking your grip', type: 'failure' },
            { roll: [3, 3], result: 'Your timing is off, animal confused', type: 'failure' },
            { roll: [4, 4], result: 'Animal tests your authority, resists', type: 'normal' },
            { roll: [5, 5], result: 'Animal settles after brief struggle', type: 'normal' },
            { roll: [6, 6], result: 'Animal accepts your guidance', type: 'success' },
            { roll: [7, 7], result: 'Animal performs task reliably', type: 'success' },
            { roll: [8, 8], result: 'Animal shows growing trust', type: 'critical' }
        ]
    },
    animalhandling_novice_d10: {
        name: 'Novice Animal Handling (d10)',
        description: 'Novice animal handling on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Animal bucks violently, you lose control', type: 'failure' },
            { roll: [2, 2], result: 'Animal refuses and becomes defensive', type: 'failure' },
            { roll: [3, 3], result: 'Your inexperience shows, animal disobeys', type: 'failure' },
            { roll: [4, 4], result: 'Animal senses your uncertainty, hesitates', type: 'failure' },
            { roll: [5, 5], result: 'Animal complies slowly, grudgingly', type: 'normal' },
            { roll: [6, 6], result: 'Animal follows after repeated attempts', type: 'normal' },
            { roll: [7, 7], result: 'Animal trusts your judgment enough to obey', type: 'success' },
            { roll: [8, 8], result: 'Animal performs task despite difficulty', type: 'success' },
            { roll: [9, 9], result: 'Animal surprises you with loyalty', type: 'success' },
            { roll: [10, 10], result: 'Animal overcomes fear through bond', type: 'critical' }
        ]
    },
    animalhandling_novice_d12: {
        name: 'Novice Animal Handling (d12)',
        description: 'Novice animal handling on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Animal panics under pressure, injures you', type: 'failure' },
            { roll: [2, 2], result: 'Animal breaks training, reverts to wild', type: 'failure' },
            { roll: [3, 3], result: 'You push too hard, animal loses trust', type: 'failure' },
            { roll: [4, 4], result: 'Animal freezes in fear, will not respond', type: 'failure' },
            { roll: [5, 5], result: 'Animal barely cooperates, stressed', type: 'normal' },
            { roll: [6, 6], result: 'Animal obeys but shows signs of strain', type: 'normal' },
            { roll: [7, 7], result: 'Animal struggles but maintains composure', type: 'normal' },
            { roll: [8, 8], result: 'Animal pushes through fear to obey', type: 'success' },
            { roll: [9, 9], result: 'Animal trusts you in dangerous moment', type: 'success' },
            { roll: [10, 10], result: 'Animal shows remarkable courage', type: 'success' },
            { roll: [11, 11], result: 'Animal defies instinct for you', type: 'critical' },
            { roll: [12, 12], result: 'Bond proves stronger than fear', type: 'critical' }
        ]
    },
    animalhandling_novice_d20: {
        name: 'Novice Animal Handling (d20)',
        description: 'Novice animal handling on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Animal goes feral, attacks indiscriminately', type: 'failure' },
            { roll: [2, 3], result: 'Animal flees and will not return', type: 'failure' },
            { roll: [4, 5], result: 'You misread instincts completely, chaos ensues', type: 'failure' },
            { roll: [6, 7], result: 'Animal shuts down emotionally, unreachable', type: 'failure' },
            { roll: [8, 9], result: 'Animal resists every attempt', type: 'failure' },
            { roll: [10, 11], result: 'Animal shows flickers of recognition', type: 'normal' },
            { roll: [12, 13], result: 'Animal wavers between trust and terror', type: 'normal' },
            { roll: [14, 15], result: 'Animal holds position but will not advance', type: 'normal' },
            { roll: [16, 16], result: 'Animal obeys one critical command', type: 'success' },
            { roll: [17, 17], result: 'Animal overcomes instinct to trust you', type: 'success' },
            { roll: [18, 18], result: 'Animal performs despite overwhelming fear', type: 'success' },
            { roll: [19, 19], result: 'Perfect timing creates unbreakable bond', type: 'critical' },
            { roll: [20, 20], result: 'Animal achieves what seemed impossible', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    animalhandling_trained_d4: {
        name: 'Trained Animal Handling (d4)',
        description: 'Trained animal handling on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Animal eagerly follows your commands', type: 'success' },
            { roll: [3, 3], result: 'Animal anticipates your needs', type: 'success' },
            { roll: [4, 4], result: 'Animal shows deep affection and loyalty', type: 'critical' }
        ]
    },
    animalhandling_trained_d6: {
        name: 'Trained Animal Handling (d6)',
        description: 'Trained animal handling on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Animal briefly distracted but refocuses', type: 'failure' },
            { roll: [2, 2], result: 'Animal obeys with slight hesitation', type: 'normal' },
            { roll: [3, 3], result: 'Animal performs task smoothly', type: 'normal' },
            { roll: [4, 4], result: 'Animal executes command perfectly', type: 'success' },
            { roll: [5, 5], result: 'Animal shows initiative, helps proactively', type: 'success' },
            { roll: [6, 6], result: 'Animal reads your intent before you signal', type: 'critical' }
        ]
    },
    animalhandling_trained_d8: {
        name: 'Trained Animal Handling (d8)',
        description: 'Trained animal handling on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Animal balks at unfamiliar situation', type: 'failure' },
            { roll: [2, 2], result: 'Animal needs extra encouragement', type: 'failure' },
            { roll: [3, 3], result: 'Animal complies after reassurance', type: 'normal' },
            { roll: [4, 4], result: 'Animal trusts your judgment', type: 'normal' },
            { roll: [5, 5], result: 'Animal performs task confidently', type: 'success' },
            { roll: [6, 6], result: 'Animal adapts to new challenge well', type: 'success' },
            { roll: [7, 7], result: 'Animal exceeds expectations', type: 'success' },
            { roll: [8, 8], result: 'Animal demonstrates remarkable understanding', type: 'critical' }
        ]
    },
    animalhandling_trained_d10: {
        name: 'Trained Animal Handling (d10)',
        description: 'Trained animal handling on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Animal overwhelmed by complexity, freezes', type: 'failure' },
            { roll: [2, 2], result: 'Animal misinterprets your signal', type: 'failure' },
            { roll: [3, 3], result: 'Animal tries but fails to understand', type: 'failure' },
            { roll: [4, 4], result: 'Animal performs partially, needs guidance', type: 'normal' },
            { roll: [5, 5], result: 'Animal completes task with your support', type: 'normal' },
            { roll: [6, 6], result: 'Animal rises to the challenge', type: 'success' },
            { roll: [7, 7], result: 'Animal shows problem-solving ability', type: 'success' },
            { roll: [8, 8], result: 'Animal impresses with quick learning', type: 'success' },
            { roll: [9, 9], result: 'Animal masters new skill immediately', type: 'success' },
            { roll: [10, 10], result: 'Animal displays unexpected brilliance', type: 'critical' }
        ]
    },
    animalhandling_trained_d12: {
        name: 'Trained Animal Handling (d12)',
        description: 'Trained animal handling on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Animal instincts override training', type: 'failure' },
            { roll: [2, 2], result: 'Animal becomes frustrated, stops trying', type: 'failure' },
            { roll: [3, 3], result: 'Animal struggles with fear response', type: 'failure' },
            { roll: [4, 4], result: 'Animal attempts but lacks confidence', type: 'normal' },
            { roll: [5, 5], result: 'Animal succeeds through determination', type: 'normal' },
            { roll: [6, 6], result: 'Animal overcomes natural fear to obey', type: 'normal' },
            { roll: [7, 7], result: 'Animal shows courage beyond training', type: 'success' },
            { roll: [8, 8], result: 'Animal trust in you proves absolute', type: 'success' },
            { roll: [9, 9], result: 'Animal performs with unwavering resolve', type: 'success' },
            { roll: [10, 10], result: 'Animal achieves remarkable feat', type: 'success' },
            { roll: [11, 11], result: 'Animal defies nature through bond', type: 'critical' },
            { roll: [12, 12], result: 'Animal loyalty conquers all doubt', type: 'critical' }
        ]
    },
    animalhandling_trained_d20: {
        name: 'Trained Animal Handling (d20)',
        description: 'Trained animal handling on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Animal survival instinct takes over, flees', type: 'failure' },
            { roll: [2, 3], result: 'Animal cannot overcome primal terror', type: 'failure' },
            { roll: [4, 5], result: 'Animal tries but breaks under pressure', type: 'failure' },
            { roll: [6, 7], result: 'Animal wavers between trust and fear', type: 'failure' },
            { roll: [8, 9], result: 'Animal holds position but will not advance', type: 'normal' },
            { roll: [10, 11], result: 'Animal pushes past fear with your help', type: 'normal' },
            { roll: [12, 13], result: 'Animal struggles but maintains control', type: 'normal' },
            { roll: [14, 15], result: 'Animal performs despite overwhelming odds', type: 'success' },
            { roll: [16, 16], result: 'Animal loyalty conquers all instinct', type: 'success' },
            { roll: [17, 17], result: 'Animal achieves the impossible through bond', type: 'success' },
            { roll: [18, 18], result: 'Animal transcends fear completely', type: 'success' },
            { roll: [19, 19], result: 'Animal becomes legend in this moment', type: 'critical' },
            { roll: [20, 20], result: 'Animal and you achieve perfect unity', type: 'critical' }
        ]
    },


    // APPRENTICE - d4 through d20
    animalhandling_apprentice_d4: {
        name: 'Apprentice Animal Handling (d4)',
        description: 'Apprentice animal handling on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Animal performs with perfect precision', type: 'success' },
            { roll: [3, 3], result: 'Animal shows joy in serving you', type: 'critical' },
            { roll: [4, 4], result: 'Animal devotion is unmistakable', type: 'critical' }
        ]
    },
    animalhandling_apprentice_d6: {
        name: 'Apprentice Animal Handling (d6)',
        description: 'Apprentice animal handling on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Animal executes flawlessly', type: 'success' },
            { roll: [3, 3], result: 'Animal adds its own clever twist', type: 'success' },
            { roll: [4, 4], result: 'Animal anticipates your next three commands', type: 'success' },
            { roll: [5, 5], result: 'Animal protects you from unseen danger', type: 'critical' },
            { roll: [6, 6], result: 'Animal communicates complex information', type: 'critical' }
        ]
    },
    animalhandling_apprentice_d8: {
        name: 'Apprentice Animal Handling (d8)',
        description: 'Apprentice animal handling on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Animal hesitates, sensing hidden danger', type: 'failure' },
            { roll: [2, 2], result: 'Animal performs adequately', type: 'normal' },
            { roll: [3, 3], result: 'Animal completes task efficiently', type: 'normal' },
            { roll: [4, 4], result: 'Animal shows tactical awareness', type: 'success' },
            { roll: [5, 5], result: 'Animal improvises to overcome obstacle', type: 'success' },
            { roll: [6, 6], result: 'Animal coordinates with other creatures', type: 'success' },
            { roll: [7, 7], result: 'Animal displays unexpected intelligence', type: 'success' },
            { roll: [8, 8], result: 'Animal teaches you something new', type: 'critical' }
        ]
    },
    animalhandling_apprentice_d10: {
        name: 'Apprentice Animal Handling (d10)',
        description: 'Apprentice animal handling on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Animal senses your doubt, wavers', type: 'failure' },
            { roll: [2, 2], result: 'Animal confused by conflicting instincts', type: 'failure' },
            { roll: [3, 3], result: 'Animal needs repeated encouragement', type: 'normal' },
            { roll: [4, 4], result: 'Animal performs with minor errors', type: 'normal' },
            { roll: [5, 5], result: 'Animal succeeds through perseverance', type: 'normal' },
            { roll: [6, 6], result: 'Animal handles complexity admirably', type: 'success' },
            { roll: [7, 7], result: 'Animal finds creative solution', type: 'success' },
            { roll: [8, 8], result: 'Animal exceeds your expectations', type: 'success' },
            { roll: [9, 9], result: 'Animal performs with masterful precision', type: 'success' },
            { roll: [10, 10], result: 'Animal achieves near-perfection', type: 'critical' }
        ]
    },
    animalhandling_apprentice_d12: {
        name: 'Apprentice Animal Handling (d12)',
        description: 'Apprentice animal handling on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Animal courage falters at critical moment', type: 'failure' },
            { roll: [2, 2], result: 'Animal attempts but cannot complete', type: 'failure' },
            { roll: [3, 3], result: 'Animal struggles against nature', type: 'failure' },
            { roll: [4, 4], result: 'Animal barely succeeds, exhausted', type: 'normal' },
            { roll: [5, 5], result: 'Animal completes task with visible strain', type: 'normal' },
            { roll: [6, 6], result: 'Animal pushes through adversity', type: 'normal' },
            { roll: [7, 7], result: 'Animal shows remarkable resilience', type: 'success' },
            { roll: [8, 8], result: 'Animal willpower matches your own', type: 'success' },
            { roll: [9, 9], result: 'Animal overcomes impossible odds', type: 'success' },
            { roll: [10, 10], result: 'Animal performs heroic deed', type: 'success' },
            { roll: [11, 11], result: 'Animal transcends normal limits', type: 'critical' },
            { roll: [12, 12], result: 'Animal becomes living inspiration', type: 'critical' }
        ]
    },
    animalhandling_apprentice_d20: {
        name: 'Apprentice Animal Handling (d20)',
        description: 'Apprentice animal handling on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Animal cannot overcome biological limits', type: 'failure' },
            { roll: [2, 3], result: 'Animal instincts prove too strong', type: 'failure' },
            { roll: [4, 5], result: 'Animal tries valiantly but fails', type: 'failure' },
            { roll: [6, 7], result: 'Animal makes partial progress only', type: 'failure' },
            { roll: [8, 9], result: 'Animal achieves minimum success', type: 'normal' },
            { roll: [10, 11], result: 'Animal succeeds through sheer will', type: 'normal' },
            { roll: [12, 13], result: 'Animal pushes beyond known limits', type: 'normal' },
            { roll: [14, 15], result: 'Animal transcends normal capabilities', type: 'success' },
            { roll: [16, 16], result: 'Animal performs legendary feat', type: 'success' },
            { roll: [17, 17], result: 'Animal defies nature itself for you', type: 'success' },
            { roll: [18, 18], result: 'Animal achieves the truly impossible', type: 'success' },
            { roll: [19, 19], result: 'Animal becomes myth made real', type: 'critical' },
            { roll: [20, 20], result: 'Animal and you forge eternal bond', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    animalhandling_adept_d4: {
        name: 'Adept Animal Handling (d4)',
        description: 'Adept animal handling on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Animal moves as extension of your will', type: 'critical' },
            { roll: [3, 3], result: 'Animal and you share single purpose', type: 'critical' },
            { roll: [4, 4], result: 'Animal bond transcends normal limits', type: 'critical' }
        ]
    },
    animalhandling_adept_d6: {
        name: 'Adept Animal Handling (d6)',
        description: 'Adept animal handling on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Animal executes with flawless precision', type: 'success' },
            { roll: [3, 3], result: 'Animal improves upon your plan', type: 'success' },
            { roll: [4, 4], result: 'Animal demonstrates tactical genius', type: 'critical' },
            { roll: [5, 5], result: 'Animal saves you from hidden threat', type: 'critical' },
            { roll: [6, 6], result: 'Animal reveals secret knowledge', type: 'critical' }
        ]
    },
    animalhandling_adept_d8: {
        name: 'Adept Animal Handling (d8)',
        description: 'Adept animal handling on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Animal completes task smoothly', type: 'normal' },
            { roll: [3, 3], result: 'Animal handles challenge expertly', type: 'success' },
            { roll: [4, 4], result: 'Animal shows strategic thinking', type: 'success' },
            { roll: [5, 5], result: 'Animal adapts brilliantly to change', type: 'success' },
            { roll: [6, 6], result: 'Animal coordinates complex maneuver', type: 'success' },
            { roll: [7, 7], result: 'Animal demonstrates near-human insight', type: 'critical' },
            { roll: [8, 8], result: 'Animal achieves perfect execution', type: 'critical' }
        ]
    },
    animalhandling_adept_d10: {
        name: 'Adept Animal Handling (d10)',
        description: 'Adept animal handling on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Animal requires extra focus from you', type: 'failure' },
            { roll: [2, 2], result: 'Animal needs reassurance to proceed', type: 'normal' },
            { roll: [3, 3], result: 'Animal completes task with effort', type: 'normal' },
            { roll: [4, 4], result: 'Animal rises to difficult challenge', type: 'normal' },
            { roll: [5, 5], result: 'Animal performs admirably under pressure', type: 'success' },
            { roll: [6, 6], result: 'Animal solves complex problem', type: 'success' },
            { roll: [7, 7], result: 'Animal shows remarkable ingenuity', type: 'success' },
            { roll: [8, 8], result: 'Animal exceeds all expectations', type: 'success' },
            { roll: [9, 9], result: 'Animal achieves mastery of task', type: 'critical' },
            { roll: [10, 10], result: 'Animal performs with legendary skill', type: 'critical' }
        ]
    },
    animalhandling_adept_d12: {
        name: 'Adept Animal Handling (d12)',
        description: 'Adept animal handling on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Animal reaches limit of capability', type: 'failure' },
            { roll: [2, 2], result: 'Animal struggles but perseveres', type: 'failure' },
            { roll: [3, 3], result: 'Animal barely succeeds through will', type: 'normal' },
            { roll: [4, 4], result: 'Animal completes task with difficulty', type: 'normal' },
            { roll: [5, 5], result: 'Animal pushes past normal limits', type: 'normal' },
            { roll: [6, 6], result: 'Animal shows extraordinary courage', type: 'success' },
            { roll: [7, 7], result: 'Animal defies natural boundaries', type: 'success' },
            { roll: [8, 8], result: 'Animal achieves remarkable victory', type: 'success' },
            { roll: [9, 9], result: 'Animal transcends species limits', type: 'success' },
            { roll: [10, 10], result: 'Animal becomes living legend', type: 'critical' },
            { roll: [11, 11], result: 'Animal achieves mythical feat', type: 'critical' },
            { roll: [12, 12], result: 'Animal rewrites natural law', type: 'critical' }
        ]
    },
    animalhandling_adept_d20: {
        name: 'Adept Animal Handling (d20)',
        description: 'Adept animal handling on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Animal cannot transcend nature', type: 'failure' },
            { roll: [2, 3], result: 'Animal tries but biology prevents success', type: 'failure' },
            { roll: [4, 5], result: 'Animal reaches absolute limit', type: 'failure' },
            { roll: [6, 7], result: 'Animal achieves partial miracle', type: 'normal' },
            { roll: [8, 9], result: 'Animal succeeds against all odds', type: 'normal' },
            { roll: [10, 11], result: 'Animal defies natural order', type: 'normal' },
            { roll: [12, 13], result: 'Animal transcends mortal limits', type: 'success' },
            { roll: [14, 15], result: 'Animal achieves impossible deed', type: 'success' },
            { roll: [16, 16], result: 'Animal becomes force of nature', type: 'success' },
            { roll: [17, 17], result: 'Animal rewrites reality briefly', type: 'success' },
            { roll: [18, 18], result: 'Animal and you become one being', type: 'critical' },
            { roll: [19, 19], result: 'Animal ascends to mythic status', type: 'critical' },
            { roll: [20, 20], result: 'Animal achieves eternal greatness', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    animalhandling_expert_d4: {
        name: 'Expert Animal Handling (d4)',
        description: 'Expert animal handling on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Animal and you share consciousness', type: 'critical' },
            { roll: [3, 3], result: 'Animal becomes perfect mirror of intent', type: 'critical' },
            { roll: [4, 4], result: 'Animal transcends mortal understanding', type: 'critical' }
        ]
    },
    animalhandling_expert_d6: {
        name: 'Expert Animal Handling (d6)',
        description: 'Expert animal handling on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Animal achieves flawless execution', type: 'critical' },
            { roll: [3, 3], result: 'Animal demonstrates supernatural skill', type: 'critical' },
            { roll: [4, 4], result: 'Animal defies natural limitations', type: 'critical' },
            { roll: [5, 5], result: 'Animal becomes living art', type: 'critical' },
            { roll: [6, 6], result: 'Animal achieves perfection itself', type: 'critical' }
        ]
    },
    animalhandling_expert_d8: {
        name: 'Expert Animal Handling (d8)',
        description: 'Expert animal handling on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Animal handles complexity with ease', type: 'success' },
            { roll: [3, 3], result: 'Animal shows masterful technique', type: 'success' },
            { roll: [4, 4], result: 'Animal performs with legendary grace', type: 'critical' },
            { roll: [5, 5], result: 'Animal achieves tactical perfection', type: 'critical' },
            { roll: [6, 6], result: 'Animal demonstrates divine precision', type: 'critical' },
            { roll: [7, 7], result: 'Animal transcends physical limits', type: 'critical' },
            { roll: [8, 8], result: 'Animal becomes myth incarnate', type: 'critical' }
        ]
    },
    animalhandling_expert_d10: {
        name: 'Expert Animal Handling (d10)',
        description: 'Expert animal handling on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Animal succeeds with minor effort', type: 'success' },
            { roll: [3, 3], result: 'Animal handles challenge expertly', type: 'success' },
            { roll: [4, 4], result: 'Animal overcomes difficulty smoothly', type: 'success' },
            { roll: [5, 5], result: 'Animal shows brilliant problem-solving', type: 'success' },
            { roll: [6, 6], result: 'Animal achieves remarkable victory', type: 'critical' },
            { roll: [7, 7], result: 'Animal performs impossible maneuver', type: 'critical' },
            { roll: [8, 8], result: 'Animal defies reality itself', type: 'critical' },
            { roll: [9, 9], result: 'Animal becomes force beyond nature', type: 'critical' },
            { roll: [10, 10], result: 'Animal achieves divine perfection', type: 'critical' }
        ]
    },
    animalhandling_expert_d12: {
        name: 'Expert Animal Handling (d12)',
        description: 'Expert animal handling on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Animal succeeds through sheer mastery', type: 'normal' },
            { roll: [3, 3], result: 'Animal overcomes natural boundaries', type: 'success' },
            { roll: [4, 4], result: 'Animal transcends species limits', type: 'success' },
            { roll: [5, 5], result: 'Animal achieves legendary feat', type: 'success' },
            { roll: [6, 6], result: 'Animal defies biological law', type: 'success' },
            { roll: [7, 7], result: 'Animal becomes living miracle', type: 'critical' },
            { roll: [8, 8], result: 'Animal rewrites natural order', type: 'critical' },
            { roll: [9, 9], result: 'Animal achieves mythic greatness', type: 'critical' },
            { roll: [10, 10], result: 'Animal ascends beyond mortal realm', type: 'critical' },
            { roll: [11, 11], result: 'Animal becomes eternal legend', type: 'critical' },
            { roll: [12, 12], result: 'Animal achieves godlike status', type: 'critical' }
        ]
    },
    animalhandling_expert_d20: {
        name: 'Expert Animal Handling (d20)',
        description: 'Expert animal handling on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Animal faces task beyond comprehension', type: 'failure' },
            { roll: [2, 3], result: 'Animal struggles against cosmic forces', type: 'normal' },
            { roll: [4, 5], result: 'Animal barely succeeds through mastery', type: 'normal' },
            { roll: [6, 7], result: 'Animal achieves near-impossible feat', type: 'success' },
            { roll: [8, 9], result: 'Animal transcends mortal limits', type: 'success' },
            { roll: [10, 11], result: 'Animal defies natural law', type: 'success' },
            { roll: [12, 13], result: 'Animal rewrites reality', type: 'success' },
            { roll: [14, 15], result: 'Animal becomes force of nature', type: 'critical' },
            { roll: [16, 16], result: 'Animal achieves divine miracle', type: 'critical' },
            { roll: [17, 17], result: 'Animal transcends physical existence', type: 'critical' },
            { roll: [18, 18], result: 'Animal becomes eternal legend', type: 'critical' },
            { roll: [19, 19], result: 'Animal ascends to mythic realm', type: 'critical' },
            { roll: [20, 20], result: 'Animal and you become timeless myth', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    animalhandling_master_d4: {
        name: 'Master Animal Handling (d4)',
        description: 'Master animal handling on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Animal transcends all mortal bounds', type: 'critical' },
            { roll: [3, 3], result: 'Animal becomes avatar of perfection', type: 'critical' },
            { roll: [4, 4], result: 'Animal achieves absolute unity with you', type: 'critical' }
        ]
    },
    animalhandling_master_d6: {
        name: 'Master Animal Handling (d6)',
        description: 'Master animal handling on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Animal defies all natural law', type: 'critical' },
            { roll: [3, 3], result: 'Animal becomes living divinity', type: 'critical' },
            { roll: [4, 4], result: 'Animal transcends physical reality', type: 'critical' },
            { roll: [5, 5], result: 'Animal achieves cosmic perfection', type: 'critical' },
            { roll: [6, 6], result: 'Animal becomes eternal force', type: 'critical' }
        ]
    },
    animalhandling_master_d8: {
        name: 'Master Animal Handling (d8)',
        description: 'Master animal handling on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Animal performs impossible feat casually', type: 'critical' },
            { roll: [3, 3], result: 'Animal rewrites natural order', type: 'critical' },
            { roll: [4, 4], result: 'Animal transcends mortal understanding', type: 'critical' },
            { roll: [5, 5], result: 'Animal becomes force beyond nature', type: 'critical' },
            { roll: [6, 6], result: 'Animal achieves mythic perfection', type: 'critical' },
            { roll: [7, 7], result: 'Animal ascends to legendary status', type: 'critical' },
            { roll: [8, 8], result: 'Animal becomes timeless legend', type: 'critical' }
        ]
    },
    animalhandling_master_d10: {
        name: 'Master Animal Handling (d10)',
        description: 'Master animal handling on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'Animal overcomes difficulty with ease', type: 'critical' },
            { roll: [3, 3], result: 'Animal defies impossible odds', type: 'critical' },
            { roll: [4, 4], result: 'Animal transcends natural limits', type: 'critical' },
            { roll: [5, 5], result: 'Animal rewrites reality itself', type: 'critical' },
            { roll: [6, 6], result: 'Animal becomes living miracle', type: 'critical' },
            { roll: [7, 7], result: 'Animal achieves divine feat', type: 'critical' },
            { roll: [8, 8], result: 'Animal ascends beyond mortal realm', type: 'critical' },
            { roll: [9, 9], result: 'Animal becomes eternal myth', type: 'critical' },
            { roll: [10, 10], result: 'Animal achieves cosmic greatness', type: 'critical' }
        ]
    },
    animalhandling_master_d12: {
        name: 'Master Animal Handling (d12)',
        description: 'Master animal handling on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Animal overcomes through mastery', type: 'success' },
            { roll: [3, 3], result: 'Animal transcends all boundaries', type: 'critical' },
            { roll: [4, 4], result: 'Animal defies cosmic forces', type: 'critical' },
            { roll: [5, 5], result: 'Animal rewrites natural law', type: 'critical' },
            { roll: [6, 6], result: 'Animal becomes force of nature', type: 'critical' },
            { roll: [7, 7], result: 'Animal achieves impossible miracle', type: 'critical' },
            { roll: [8, 8], result: 'Animal transcends physical existence', type: 'critical' },
            { roll: [9, 9], result: 'Animal becomes living divinity', type: 'critical' },
            { roll: [10, 10], result: 'Animal ascends to godhood', type: 'critical' },
            { roll: [11, 11], result: 'Animal becomes eternal legend', type: 'critical' },
            { roll: [12, 12], result: 'Animal achieves absolute perfection', type: 'critical' }
        ]
    },
    animalhandling_master_d20: {
        name: 'Master Animal Handling (d20)',
        description: 'Master animal handling on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 3], result: 'Animal struggles against cosmic will', type: 'success' },
            { roll: [4, 5], result: 'Animal overcomes through divine power', type: 'success' },
            { roll: [6, 7], result: 'Animal transcends all mortal limits', type: 'critical' },
            { roll: [8, 9], result: 'Animal defies reality itself', type: 'critical' },
            { roll: [10, 11], result: 'Animal rewrites cosmic order', type: 'critical' },
            { roll: [12, 13], result: 'Animal becomes force beyond nature', type: 'critical' },
            { roll: [14, 15], result: 'Animal achieves divine miracle', type: 'critical' },
            { roll: [16, 16], result: 'Animal transcends physical realm', type: 'critical' },
            { roll: [17, 17], result: 'Animal becomes living god', type: 'critical' },
            { roll: [18, 18], result: 'Animal ascends to eternal myth', type: 'critical' },
            { roll: [19, 19], result: 'Animal achieves cosmic perfection', type: 'critical' },
            { roll: [20, 20], result: 'Animal and you become one eternal force', type: 'critical' }
        ]
    }
};
