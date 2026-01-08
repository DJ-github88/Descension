// Tactical Combat Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total
// Each die type has exact outcome count: d4=4, d6=6, d8=8, d10=10, d12=12, d20=13
// For d20 tables: 13 unique outcomes with ranges covering all 20 possible roll values

export const TACTICAL_COMBAT_TABLES = {
    // UNTRAINED - d4 through d20
    tacticalcombat_untrained_d4: {
        name: 'Untrained Tactical Combat (d4)',
        description: 'Untrained tactical combat on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You step into an obvious feint', type: 'failure' },
            { roll: [2, 2], result: 'You react slowly but avoid disaster', type: 'normal' },
            { roll: [3, 3], result: 'You maintain basic awareness', type: 'success' },
            { roll: [4, 4], result: 'You read the simple movement correctly', type: 'success' }
        ]
    },
    tacticalcombat_untrained_d6: {
        name: 'Untrained Tactical Combat (d6)',
        description: 'Untrained tactical combat on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You lose track of enemy positions', type: 'failure' },
            { roll: [2, 2], result: 'You misread the attack angle', type: 'failure' },
            { roll: [3, 3], result: 'You hesitate at the wrong moment', type: 'normal' },
            { roll: [4, 4], result: 'You react late but recover', type: 'normal' },
            { roll: [5, 5], result: 'You anticipate the basic strike', type: 'success' },
            { roll: [6, 6], result: 'You position yourself adequately', type: 'success' }
        ]
    },
    tacticalcombat_untrained_d8: {
        name: 'Untrained Tactical Combat (d8)',
        description: 'Untrained tactical combat on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You break formation completely', type: 'failure' },
            { roll: [2, 2], result: 'You waste your action on poor timing', type: 'failure' },
            { roll: [3, 3], result: 'You misjudge the distance badly', type: 'failure' },
            { roll: [4, 4], result: 'You panic under pressure', type: 'failure' },
            { roll: [5, 5], result: 'You barely maintain composure', type: 'normal' },
            { roll: [6, 6], result: 'You follow basic instinct', type: 'normal' },
            { roll: [7, 7], result: 'You make a sound defensive choice', type: 'success' },
            { roll: [8, 8], result: 'You spot an opening by luck', type: 'success' }
        ]
    },
    tacticalcombat_untrained_d10: {
        name: 'Untrained Tactical Combat (d10)',
        description: 'Untrained tactical combat on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You fall for coordinated deception', type: 'failure' },
            { roll: [2, 2], result: 'You expose your flank carelessly', type: 'failure' },
            { roll: [3, 3], result: 'You lose situational awareness', type: 'failure' },
            { roll: [4, 4], result: 'You commit too early to movement', type: 'failure' },
            { roll: [5, 5], result: 'You telegraph your intent clearly', type: 'failure' },
            { roll: [6, 6], result: 'You hold position uncertainly', type: 'normal' },
            { roll: [7, 7], result: 'You react defensively in time', type: 'normal' },
            { roll: [8, 8], result: 'You stumble into good positioning', type: 'success' },
            { roll: [9, 9], result: 'You recognize the threat pattern', type: 'success' },
            { roll: [10, 10], result: 'Instinct guides you to safety', type: 'critical' }
        ]
    },
    tacticalcombat_untrained_d12: {
        name: 'Untrained Tactical Combat (d12)',
        description: 'Untrained tactical combat on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You interfere with allied movement', type: 'failure' },
            { roll: [2, 2], result: 'You freeze in confusion', type: 'failure' },
            { roll: [3, 3], result: 'You misread multiple threats', type: 'failure' },
            { roll: [4, 4], result: 'You abandon tactical position', type: 'failure' },
            { roll: [5, 5], result: 'You overcommit to wrong target', type: 'failure' },
            { roll: [6, 6], result: 'You barely track the chaos', type: 'normal' },
            { roll: [7, 7], result: 'You focus on one threat only', type: 'normal' },
            { roll: [8, 8], result: 'You maintain minimal awareness', type: 'normal' },
            { roll: [9, 9], result: 'You avoid the worst mistakes', type: 'success' },
            { roll: [10, 10], result: 'You sense danger in time', type: 'success' },
            { roll: [11, 11], result: 'You react correctly by chance', type: 'success' },
            { roll: [12, 12], result: 'Pure survival instinct prevails', type: 'critical' }
        ]
    },
    tacticalcombat_untrained_d20: {
        name: 'Untrained Tactical Combat (d20)',
        description: 'Untrained tactical combat on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You trigger friendly fire incident', type: 'failure' },
            { roll: [2, 3], result: 'You collapse under tactical pressure', type: 'failure' },
            { roll: [4, 5], result: 'You cannot process the complexity', type: 'failure' },
            { roll: [6, 7], result: 'You make critical positioning error', type: 'failure' },
            { roll: [8, 9], result: 'You lose all sense of flow', type: 'failure' },
            { roll: [10, 11], result: 'You barely function in chaos', type: 'failure' },
            { roll: [12, 13], result: 'You cling to basic survival', type: 'failure' },
            { roll: [14, 15], result: 'You avoid total disaster', type: 'normal' },
            { roll: [16, 16], result: 'You hold minimal composure', type: 'normal' },
            { roll: [17, 17], result: 'You react to one key threat', type: 'normal' },
            { roll: [18, 18], result: 'You find brief moment of clarity', type: 'success' },
            { roll: [19, 19], result: 'You sense the right move', type: 'success' },
            { roll: [20, 20], result: 'Impossible instinct saves you', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    tacticalcombat_novice_d4: {
        name: 'Novice Tactical Combat (d4)',
        description: 'Novice tactical combat on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misjudge the timing slightly', type: 'failure' },
            { roll: [2, 2], result: 'You execute basic positioning', type: 'normal' },
            { roll: [3, 3], result: 'You read the simple pattern', type: 'success' },
            { roll: [4, 4], result: 'You anticipate the obvious move', type: 'success' }
        ]
    },
    tacticalcombat_novice_d6: {
        name: 'Novice Tactical Combat (d6)',
        description: 'Novice tactical combat on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You predict movement incorrectly', type: 'failure' },
            { roll: [2, 2], result: 'You react a beat too slow', type: 'failure' },
            { roll: [3, 3], result: 'You maintain adequate spacing', type: 'normal' },
            { roll: [4, 4], result: 'You adjust position competently', type: 'normal' },
            { roll: [5, 5], result: 'You recognize attack vectors', type: 'success' },
            { roll: [6, 6], result: 'You counter with good timing', type: 'success' }
        ]
    },
    tacticalcombat_novice_d8: {
        name: 'Novice Tactical Combat (d8)',
        description: 'Novice tactical combat on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You miscommunicate your intent', type: 'failure' },
            { roll: [2, 2], result: 'You overextend your position', type: 'failure' },
            { roll: [3, 3], result: 'You miss the coordination cue', type: 'failure' },
            { roll: [4, 4], result: 'You hesitate on commitment', type: 'normal' },
            { roll: [5, 5], result: 'You maintain defensive stance', type: 'normal' },
            { roll: [6, 6], result: 'You reposition efficiently', type: 'success' },
            { roll: [7, 7], result: 'You exploit minor opening', type: 'success' },
            { roll: [8, 8], result: 'You coordinate basic maneuver', type: 'critical' }
        ]
    },
    tacticalcombat_novice_d10: {
        name: 'Novice Tactical Combat (d10)',
        description: 'Novice tactical combat on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You fall for layered deception', type: 'failure' },
            { roll: [2, 2], result: 'You lose track of secondary threats', type: 'failure' },
            { roll: [3, 3], result: 'You commit to wrong angle', type: 'failure' },
            { roll: [4, 4], result: 'You struggle with complexity', type: 'failure' },
            { roll: [5, 5], result: 'You hold ground uncertainly', type: 'normal' },
            { roll: [6, 6], result: 'You adapt to changing flow', type: 'normal' },
            { roll: [7, 7], result: 'You identify key weakness', type: 'success' },
            { roll: [8, 8], result: 'You time your strike well', type: 'success' },
            { roll: [9, 9], result: 'You read the battle rhythm', type: 'success' },
            { roll: [10, 10], result: 'You execute clean counter', type: 'critical' }
        ]
    },
    tacticalcombat_novice_d12: {
        name: 'Novice Tactical Combat (d12)',
        description: 'Novice tactical combat on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You disrupt team coordination', type: 'failure' },
            { roll: [2, 2], result: 'You cannot track all threats', type: 'failure' },
            { roll: [3, 3], result: 'You misjudge enemy intent', type: 'failure' },
            { roll: [4, 4], result: 'You react to wrong stimulus', type: 'failure' },
            { roll: [5, 5], result: 'You barely maintain focus', type: 'normal' },
            { roll: [6, 6], result: 'You prioritize one threat', type: 'normal' },
            { roll: [7, 7], result: 'You adjust under pressure', type: 'normal' },
            { roll: [8, 8], result: 'You find tactical opening', type: 'success' },
            { roll: [9, 9], result: 'You coordinate with ally', type: 'success' },
            { roll: [10, 10], result: 'You exploit terrain advantage', type: 'success' },
            { roll: [11, 11], result: 'You predict enemy rotation', type: 'critical' },
            { roll: [12, 12], result: 'You orchestrate team movement', type: 'critical' }
        ]
    },
    tacticalcombat_novice_d20: {
        name: 'Novice Tactical Combat (d20)',
        description: 'Novice tactical combat on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You cause cascading tactical failure', type: 'failure' },
            { roll: [2, 3], result: 'You overwhelmed by multi-front assault', type: 'failure' },
            { roll: [4, 5], result: 'You cannot process threat priority', type: 'failure' },
            { roll: [6, 7], result: 'You lose sense of positioning', type: 'failure' },
            { roll: [8, 9], result: 'You struggle to maintain awareness', type: 'failure' },
            { roll: [10, 11], result: 'You focus on immediate survival', type: 'normal' },
            { roll: [12, 13], result: 'You adapt to one threat vector', type: 'normal' },
            { roll: [14, 15], result: 'You hold defensive position', type: 'normal' },
            { roll: [16, 16], result: 'You identify critical weakness', type: 'success' },
            { roll: [17, 17], result: 'You coordinate under pressure', type: 'success' },
            { roll: [18, 18], result: 'You exploit momentary gap', type: 'success' },
            { roll: [19, 19], result: 'You read complex pattern', type: 'critical' },
            { roll: [20, 20], result: 'You orchestrate perfect counter', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    tacticalcombat_trained_d4: {
        name: 'Trained Tactical Combat (d4)',
        description: 'Trained tactical combat on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You read the flow cleanly', type: 'success' },
            { roll: [3, 3], result: 'You anticipate with precision', type: 'success' },
            { roll: [4, 4], result: 'You dominate the exchange', type: 'critical' }
        ]
    },
    tacticalcombat_trained_d6: {
        name: 'Trained Tactical Combat (d6)',
        description: 'Trained tactical combat on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You misread subtle feint', type: 'failure' },
            { roll: [2, 2], result: 'You maintain solid positioning', type: 'normal' },
            { roll: [3, 3], result: 'You control the distance', type: 'normal' },
            { roll: [4, 4], result: 'You dictate the tempo', type: 'success' },
            { roll: [5, 5], result: 'You exploit positioning error', type: 'success' },
            { roll: [6, 6], result: 'You bait enemy commitment', type: 'critical' }
        ]
    },
    tacticalcombat_trained_d8: {
        name: 'Trained Tactical Combat (d8)',
        description: 'Trained tactical combat on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You misjudge enemy adaptation', type: 'failure' },
            { roll: [2, 2], result: 'You adjust to new pattern', type: 'failure' },
            { roll: [3, 3], result: 'You maintain tactical awareness', type: 'normal' },
            { roll: [4, 4], result: 'You coordinate team movement', type: 'normal' },
            { roll: [5, 5], result: 'You control engagement range', type: 'success' },
            { roll: [6, 6], result: 'You create tactical advantage', type: 'success' },
            { roll: [7, 7], result: 'You predict enemy rotation', type: 'success' },
            { roll: [8, 8], result: 'You orchestrate flanking strike', type: 'critical' }
        ]
    },
    tacticalcombat_trained_d10: {
        name: 'Trained Tactical Combat (d10)',
        description: 'Trained tactical combat on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You fall for complex deception', type: 'failure' },
            { roll: [2, 2], result: 'You lose tempo briefly', type: 'failure' },
            { roll: [3, 3], result: 'You recover tactical position', type: 'failure' },
            { roll: [4, 4], result: 'You adapt to pressure', type: 'normal' },
            { roll: [5, 5], result: 'You maintain battle awareness', type: 'normal' },
            { roll: [6, 6], result: 'You counter enemy strategy', type: 'success' },
            { roll: [7, 7], result: 'You exploit formation gap', type: 'success' },
            { roll: [8, 8], result: 'You coordinate multi-target strike', type: 'success' },
            { roll: [9, 9], result: 'You control battlefield flow', type: 'success' },
            { roll: [10, 10], result: 'You execute perfect maneuver', type: 'critical' }
        ]
    },
    tacticalcombat_trained_d12: {
        name: 'Trained Tactical Combat (d12)',
        description: 'Trained tactical combat on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You overwhelmed by coordination', type: 'failure' },
            { roll: [2, 2], result: 'You struggle with multi-front threat', type: 'failure' },
            { roll: [3, 3], result: 'You prioritize incorrectly', type: 'failure' },
            { roll: [4, 4], result: 'You maintain minimal control', type: 'normal' },
            { roll: [5, 5], result: 'You adapt to chaos', type: 'normal' },
            { roll: [6, 6], result: 'You hold tactical position', type: 'normal' },
            { roll: [7, 7], result: 'You identify critical target', type: 'success' },
            { roll: [8, 8], result: 'You coordinate under pressure', type: 'success' },
            { roll: [9, 9], result: 'You exploit terrain perfectly', type: 'success' },
            { roll: [10, 10], result: 'You orchestrate team synergy', type: 'success' },
            { roll: [11, 11], result: 'You dominate tactical space', type: 'critical' },
            { roll: [12, 12], result: 'You execute flawless strategy', type: 'critical' }
        ]
    },
    tacticalcombat_trained_d20: {
        name: 'Trained Tactical Combat (d20)',
        description: 'Trained tactical combat on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You cannot process threat complexity', type: 'failure' },
            { roll: [2, 3], result: 'You lose tactical cohesion', type: 'failure' },
            { roll: [4, 5], result: 'You struggle against coordination', type: 'failure' },
            { roll: [6, 7], result: 'You barely maintain awareness', type: 'failure' },
            { roll: [8, 9], result: 'You hold defensive stance', type: 'normal' },
            { roll: [10, 11], result: 'You adapt to one threat vector', type: 'normal' },
            { roll: [12, 13], result: 'You coordinate limited response', type: 'normal' },
            { roll: [14, 15], result: 'You exploit key weakness', type: 'success' },
            { roll: [16, 16], result: 'You counter multi-directional assault', type: 'success' },
            { roll: [17, 17], result: 'You orchestrate team defense', type: 'success' },
            { roll: [18, 18], result: 'You dominate tactical exchange', type: 'success' },
            { roll: [19, 19], result: 'You execute brilliant counter', type: 'critical' },
            { roll: [20, 20], result: 'You achieve tactical mastery', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    tacticalcombat_apprentice_d4: {
        name: 'Apprentice Tactical Combat (d4)',
        description: 'Apprentice tactical combat on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'You anticipate before movement', type: 'success' },
            { roll: [3, 3], result: 'You control the entire exchange', type: 'critical' },
            { roll: [4, 4], result: 'You dominate with precision', type: 'critical' }
        ]
    },
    tacticalcombat_apprentice_d6: {
        name: 'Apprentice Tactical Combat (d6)',
        description: 'Apprentice tactical combat on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You read the pattern clearly', type: 'success' },
            { roll: [3, 3], result: 'You dictate engagement terms', type: 'success' },
            { roll: [4, 4], result: 'You bait enemy into trap', type: 'success' },
            { roll: [5, 5], result: 'You feint flawlessly', type: 'critical' },
            { roll: [6, 6], result: 'You orchestrate perfect setup', type: 'critical' }
        ]
    },
    tacticalcombat_apprentice_d8: {
        name: 'Apprentice Tactical Combat (d8)',
        description: 'Apprentice tactical combat on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You misread layered intent', type: 'failure' },
            { roll: [2, 2], result: 'You maintain tactical control', type: 'normal' },
            { roll: [3, 3], result: 'You coordinate team positioning', type: 'normal' },
            { roll: [4, 4], result: 'You exploit positioning mistake', type: 'success' },
            { roll: [5, 5], result: 'You control battlefield tempo', type: 'success' },
            { roll: [6, 6], result: 'You predict enemy adaptation', type: 'success' },
            { roll: [7, 7], result: 'You orchestrate flanking assault', type: 'success' },
            { roll: [8, 8], result: 'You dominate tactical space', type: 'critical' }
        ]
    },
    tacticalcombat_apprentice_d10: {
        name: 'Apprentice Tactical Combat (d10)',
        description: 'Apprentice tactical combat on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You overwhelmed by complexity', type: 'failure' },
            { roll: [2, 2], result: 'You lose tempo momentarily', type: 'failure' },
            { roll: [3, 3], result: 'You recover tactical position', type: 'normal' },
            { roll: [4, 4], result: 'You adapt to pressure', type: 'normal' },
            { roll: [5, 5], result: 'You maintain battle awareness', type: 'normal' },
            { roll: [6, 6], result: 'You counter enemy strategy', type: 'success' },
            { roll: [7, 7], result: 'You exploit formation weakness', type: 'success' },
            { roll: [8, 8], result: 'You coordinate complex maneuver', type: 'success' },
            { roll: [9, 9], result: 'You control engagement flow', type: 'success' },
            { roll: [10, 10], result: 'You execute brilliant tactic', type: 'critical' }
        ]
    },
    tacticalcombat_apprentice_d12: {
        name: 'Apprentice Tactical Combat (d12)',
        description: 'Apprentice tactical combat on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You struggle with coordination', type: 'failure' },
            { roll: [2, 2], result: 'You barely track all threats', type: 'failure' },
            { roll: [3, 3], result: 'You prioritize key targets', type: 'failure' },
            { roll: [4, 4], result: 'You maintain tactical awareness', type: 'normal' },
            { roll: [5, 5], result: 'You adapt to chaos', type: 'normal' },
            { roll: [6, 6], result: 'You hold critical position', type: 'normal' },
            { roll: [7, 7], result: 'You identify weakness pattern', type: 'success' },
            { roll: [8, 8], result: 'You coordinate under pressure', type: 'success' },
            { roll: [9, 9], result: 'You exploit terrain advantage', type: 'success' },
            { roll: [10, 10], result: 'You orchestrate team synergy', type: 'success' },
            { roll: [11, 11], result: 'You dominate tactical exchange', type: 'critical' },
            { roll: [12, 12], result: 'You execute perfect strategy', type: 'critical' }
        ]
    },
    tacticalcombat_apprentice_d20: {
        name: 'Apprentice Tactical Combat (d20)',
        description: 'Apprentice tactical combat on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You cannot handle threat density', type: 'failure' },
            { roll: [2, 3], result: 'You lose control of battlefield', type: 'failure' },
            { roll: [4, 5], result: 'You overwhelmed by coordination', type: 'failure' },
            { roll: [6, 7], result: 'You struggle to prioritize', type: 'failure' },
            { roll: [8, 9], result: 'You maintain minimal awareness', type: 'normal' },
            { roll: [10, 11], result: 'You adapt to primary threats', type: 'normal' },
            { roll: [12, 13], result: 'You coordinate defensive response', type: 'normal' },
            { roll: [14, 15], result: 'You exploit critical opening', type: 'success' },
            { roll: [16, 16], result: 'You counter complex assault', type: 'success' },
            { roll: [17, 17], result: 'You orchestrate team counter', type: 'success' },
            { roll: [18, 18], result: 'You dominate chaotic exchange', type: 'success' },
            { roll: [19, 19], result: 'You execute masterful strategy', type: 'critical' },
            { roll: [20, 20], result: 'You achieve perfect tactical control', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    tacticalcombat_adept_d4: {
        name: 'Adept Tactical Combat (d4)',
        description: 'Adept tactical combat on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You control flow effortlessly', type: 'critical' },
            { roll: [3, 3], result: 'You dominate with minimal effort', type: 'critical' },
            { roll: [4, 4], result: 'You achieve tactical perfection', type: 'critical' }
        ]
    },
    tacticalcombat_adept_d6: {
        name: 'Adept Tactical Combat (d6)',
        description: 'Adept tactical combat on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You anticipate all movements', type: 'success' },
            { roll: [3, 3], result: 'You dictate complete flow', type: 'success' },
            { roll: [4, 4], result: 'You bait perfect counter', type: 'critical' },
            { roll: [5, 5], result: 'You orchestrate flawless setup', type: 'critical' },
            { roll: [6, 6], result: 'You dominate with elegance', type: 'critical' }
        ]
    },
    tacticalcombat_adept_d8: {
        name: 'Adept Tactical Combat (d8)',
        description: 'Adept tactical combat on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You maintain superior control', type: 'normal' },
            { roll: [3, 3], result: 'You coordinate team flawlessly', type: 'success' },
            { roll: [4, 4], result: 'You exploit every mistake', type: 'success' },
            { roll: [5, 5], result: 'You control battlefield tempo', type: 'success' },
            { roll: [6, 6], result: 'You predict all adaptations', type: 'success' },
            { roll: [7, 7], result: 'You orchestrate perfect assault', type: 'critical' },
            { roll: [8, 8], result: 'You achieve tactical dominance', type: 'critical' }
        ]
    },
    tacticalcombat_adept_d10: {
        name: 'Adept Tactical Combat (d10)',
        description: 'Adept tactical combat on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You struggle with complexity', type: 'failure' },
            { roll: [2, 2], result: 'You maintain tactical position', type: 'normal' },
            { roll: [3, 3], result: 'You adapt to pressure', type: 'normal' },
            { roll: [4, 4], result: 'You hold battle awareness', type: 'normal' },
            { roll: [5, 5], result: 'You counter enemy strategy', type: 'success' },
            { roll: [6, 6], result: 'You exploit formation gaps', type: 'success' },
            { roll: [7, 7], result: 'You coordinate complex strike', type: 'success' },
            { roll: [8, 8], result: 'You control engagement flow', type: 'success' },
            { roll: [9, 9], result: 'You execute brilliant maneuver', type: 'critical' },
            { roll: [10, 10], result: 'You achieve tactical mastery', type: 'critical' }
        ]
    },
    tacticalcombat_adept_d12: {
        name: 'Adept Tactical Combat (d12)',
        description: 'Adept tactical combat on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You overwhelmed by coordination', type: 'failure' },
            { roll: [2, 2], result: 'You barely track all threats', type: 'failure' },
            { roll: [3, 3], result: 'You maintain minimal control', type: 'normal' },
            { roll: [4, 4], result: 'You adapt to chaos', type: 'normal' },
            { roll: [5, 5], result: 'You hold tactical position', type: 'normal' },
            { roll: [6, 6], result: 'You identify critical targets', type: 'success' },
            { roll: [7, 7], result: 'You coordinate under pressure', type: 'success' },
            { roll: [8, 8], result: 'You exploit terrain perfectly', type: 'success' },
            { roll: [9, 9], result: 'You orchestrate team synergy', type: 'success' },
            { roll: [10, 10], result: 'You dominate tactical space', type: 'critical' },
            { roll: [11, 11], result: 'You execute flawless strategy', type: 'critical' },
            { roll: [12, 12], result: 'You achieve perfect control', type: 'critical' }
        ]
    },
    tacticalcombat_adept_d20: {
        name: 'Adept Tactical Combat (d20)',
        description: 'Adept tactical combat on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You cannot process threat density', type: 'failure' },
            { roll: [2, 3], result: 'You lose tactical cohesion', type: 'failure' },
            { roll: [4, 5], result: 'You struggle against coordination', type: 'failure' },
            { roll: [6, 7], result: 'You barely maintain awareness', type: 'normal' },
            { roll: [8, 9], result: 'You hold defensive stance', type: 'normal' },
            { roll: [10, 11], result: 'You adapt to threat vectors', type: 'normal' },
            { roll: [12, 13], result: 'You coordinate response', type: 'success' },
            { roll: [14, 15], result: 'You exploit key weaknesses', type: 'success' },
            { roll: [16, 16], result: 'You counter multi-front assault', type: 'success' },
            { roll: [17, 17], result: 'You orchestrate team defense', type: 'success' },
            { roll: [18, 18], result: 'You dominate tactical exchange', type: 'critical' },
            { roll: [19, 19], result: 'You execute brilliant counter', type: 'critical' },
            { roll: [20, 20], result: 'You achieve complete mastery', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    tacticalcombat_expert_d4: {
        name: 'Expert Tactical Combat (d4)',
        description: 'Expert tactical combat on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You control flow instinctively', type: 'critical' },
            { roll: [3, 3], result: 'You dominate without effort', type: 'critical' },
            { roll: [4, 4], result: 'You achieve absolute control', type: 'critical' }
        ]
    },
    tacticalcombat_expert_d6: {
        name: 'Expert Tactical Combat (d6)',
        description: 'Expert tactical combat on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You anticipate all patterns', type: 'critical' },
            { roll: [3, 3], result: 'You dictate absolute flow', type: 'critical' },
            { roll: [4, 4], result: 'You bait flawless counter', type: 'critical' },
            { roll: [5, 5], result: 'You orchestrate perfect setup', type: 'critical' },
            { roll: [6, 6], result: 'You dominate with precision', type: 'critical' }
        ]
    },
    tacticalcombat_expert_d8: {
        name: 'Expert Tactical Combat (d8)',
        description: 'Expert tactical combat on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You coordinate team perfectly', type: 'success' },
            { roll: [3, 3], result: 'You exploit every opening', type: 'success' },
            { roll: [4, 4], result: 'You control battlefield tempo', type: 'critical' },
            { roll: [5, 5], result: 'You predict all adaptations', type: 'critical' },
            { roll: [6, 6], result: 'You orchestrate flawless assault', type: 'critical' },
            { roll: [7, 7], result: 'You achieve tactical dominance', type: 'critical' },
            { roll: [8, 8], result: 'You execute perfect strategy', type: 'critical' }
        ]
    },
    tacticalcombat_expert_d10: {
        name: 'Expert Tactical Combat (d10)',
        description: 'Expert tactical combat on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You maintain tactical position', type: 'success' },
            { roll: [3, 3], result: 'You adapt to pressure', type: 'success' },
            { roll: [4, 4], result: 'You hold battle awareness', type: 'success' },
            { roll: [5, 5], result: 'You counter enemy strategy', type: 'success' },
            { roll: [6, 6], result: 'You exploit formation gaps', type: 'critical' },
            { roll: [7, 7], result: 'You coordinate complex strike', type: 'critical' },
            { roll: [8, 8], result: 'You control engagement flow', type: 'critical' },
            { roll: [9, 9], result: 'You execute brilliant maneuver', type: 'critical' },
            { roll: [10, 10], result: 'You achieve tactical perfection', type: 'critical' }
        ]
    },
    tacticalcombat_expert_d12: {
        name: 'Expert Tactical Combat (d12)',
        description: 'Expert tactical combat on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You maintain control', type: 'normal' },
            { roll: [3, 3], result: 'You adapt to chaos', type: 'success' },
            { roll: [4, 4], result: 'You hold tactical position', type: 'success' },
            { roll: [5, 5], result: 'You identify critical targets', type: 'success' },
            { roll: [6, 6], result: 'You coordinate under pressure', type: 'success' },
            { roll: [7, 7], result: 'You exploit terrain perfectly', type: 'critical' },
            { roll: [8, 8], result: 'You orchestrate team synergy', type: 'critical' },
            { roll: [9, 9], result: 'You dominate tactical space', type: 'critical' },
            { roll: [10, 10], result: 'You execute flawless strategy', type: 'critical' },
            { roll: [11, 11], result: 'You achieve perfect control', type: 'critical' },
            { roll: [12, 12], result: 'You demonstrate tactical mastery', type: 'critical' }
        ]
    },
    tacticalcombat_expert_d20: {
        name: 'Expert Tactical Combat (d20)',
        description: 'Expert tactical combat on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You face overwhelming complexity', type: 'failure' },
            { roll: [2, 3], result: 'You struggle with coordination', type: 'normal' },
            { roll: [4, 5], result: 'You barely maintain cohesion', type: 'normal' },
            { roll: [6, 7], result: 'You hold defensive stance', type: 'success' },
            { roll: [8, 9], result: 'You adapt to threat vectors', type: 'success' },
            { roll: [10, 11], result: 'You coordinate response', type: 'success' },
            { roll: [12, 13], result: 'You exploit key weaknesses', type: 'success' },
            { roll: [14, 15], result: 'You counter multi-front assault', type: 'critical' },
            { roll: [16, 16], result: 'You orchestrate team defense', type: 'critical' },
            { roll: [17, 17], result: 'You dominate tactical exchange', type: 'critical' },
            { roll: [18, 18], result: 'You execute brilliant counter', type: 'critical' },
            { roll: [19, 19], result: 'You achieve complete mastery', type: 'critical' },
            { roll: [20, 20], result: 'You demonstrate tactical genius', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    tacticalcombat_master_d4: {
        name: 'Master Tactical Combat (d4)',
        description: 'Master tactical combat on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You dominate with absolute precision', type: 'critical' },
            { roll: [3, 3], result: 'You achieve perfect tactical unity', type: 'critical' },
            { roll: [4, 4], result: 'You transcend tactical limits', type: 'critical' }
        ]
    },
    tacticalcombat_master_d6: {
        name: 'Master Tactical Combat (d6)',
        description: 'Master tactical combat on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You dictate complete battlefield', type: 'critical' },
            { roll: [3, 3], result: 'You bait perfect execution', type: 'critical' },
            { roll: [4, 4], result: 'You orchestrate flawless victory', type: 'critical' },
            { roll: [5, 5], result: 'You dominate with elegance', type: 'critical' },
            { roll: [6, 6], result: 'You achieve tactical perfection', type: 'critical' }
        ]
    },
    tacticalcombat_master_d8: {
        name: 'Master Tactical Combat (d8)',
        description: 'Master tactical combat on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'You exploit every weakness', type: 'critical' },
            { roll: [3, 3], result: 'You control battlefield tempo', type: 'critical' },
            { roll: [4, 4], result: 'You predict all adaptations', type: 'critical' },
            { roll: [5, 5], result: 'You orchestrate perfect assault', type: 'critical' },
            { roll: [6, 6], result: 'You achieve tactical dominance', type: 'critical' },
            { roll: [7, 7], result: 'You execute flawless strategy', type: 'critical' },
            { roll: [8, 8], result: 'You demonstrate absolute mastery', type: 'critical' }
        ]
    },
    tacticalcombat_master_d10: {
        name: 'Master Tactical Combat (d10)',
        description: 'Master tactical combat on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You adapt to all pressure', type: 'critical' },
            { roll: [3, 3], result: 'You hold perfect awareness', type: 'critical' },
            { roll: [4, 4], result: 'You counter all strategies', type: 'critical' },
            { roll: [5, 5], result: 'You exploit all formations', type: 'critical' },
            { roll: [6, 6], result: 'You coordinate complex strikes', type: 'critical' },
            { roll: [7, 7], result: 'You control engagement flow', type: 'critical' },
            { roll: [8, 8], result: 'You execute brilliant maneuvers', type: 'critical' },
            { roll: [9, 9], result: 'You achieve tactical perfection', type: 'critical' },
            { roll: [10, 10], result: 'You demonstrate supreme mastery', type: 'critical' }
        ]
    },
    tacticalcombat_master_d12: {
        name: 'Master Tactical Combat (d12)',
        description: 'Master tactical combat on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You adapt to chaos perfectly', type: 'success' },
            { roll: [3, 3], result: 'You identify all critical targets', type: 'critical' },
            { roll: [4, 4], result: 'You coordinate under any pressure', type: 'critical' },
            { roll: [5, 5], result: 'You exploit terrain flawlessly', type: 'critical' },
            { roll: [6, 6], result: 'You orchestrate perfect synergy', type: 'critical' },
            { roll: [7, 7], result: 'You dominate tactical space', type: 'critical' },
            { roll: [8, 8], result: 'You execute flawless strategy', type: 'critical' },
            { roll: [9, 9], result: 'You achieve perfect control', type: 'critical' },
            { roll: [10, 10], result: 'You demonstrate tactical mastery', type: 'critical' },
            { roll: [11, 11], result: 'You transcend normal limits', type: 'critical' },
            { roll: [12, 12], result: 'You achieve absolute dominance', type: 'critical' }
        ]
    },
    tacticalcombat_master_d20: {
        name: 'Master Tactical Combat (d20)',
        description: 'Master tactical combat on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 3], result: 'You maintain cohesion', type: 'success' },
            { roll: [4, 5], result: 'You hold defensive stance', type: 'success' },
            { roll: [6, 7], result: 'You adapt to all threats', type: 'critical' },
            { roll: [8, 9], result: 'You coordinate perfect response', type: 'critical' },
            { roll: [10, 11], result: 'You exploit all weaknesses', type: 'critical' },
            { roll: [12, 13], result: 'You counter multi-front assault', type: 'critical' },
            { roll: [14, 15], result: 'You orchestrate team defense', type: 'critical' },
            { roll: [16, 16], result: 'You dominate tactical exchange', type: 'critical' },
            { roll: [17, 17], result: 'You execute brilliant counter', type: 'critical' },
            { roll: [18, 18], result: 'You achieve complete mastery', type: 'critical' },
            { roll: [19, 19], result: 'You demonstrate tactical genius', type: 'critical' },
            { roll: [20, 20], result: 'You achieve legendary perfection', type: 'critical' }
        ]
    }
};