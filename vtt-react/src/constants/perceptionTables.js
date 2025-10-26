// Perception Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total
// Each die type has exact outcome count: d4=4, d6=6, d8=8, d10=10, d12=12, d20=13
// For d20 tables: 13 unique outcomes with ranges covering all 20 possible roll values

export const PERCEPTION_TABLES = {
    // UNTRAINED - d4 through d20
    perception_untrained_d4: {
        name: 'Untrained Perception (d4)',
        description: 'Untrained perception on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You focus on wrong detail, miss the obvious', type: 'failure' },
            { roll: [2, 2], result: 'You notice something but cannot identify it', type: 'normal' },
            { roll: [3, 3], result: 'You spot the obvious detail clearly', type: 'success' },
            { roll: [4, 4], result: 'You notice detail and basic context', type: 'success' }
        ]
    },
    perception_untrained_d6: {
        name: 'Untrained Perception (d6)',
        description: 'Untrained perception on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You mistake shadow for threat, false alarm', type: 'failure' },
            { roll: [2, 2], result: 'You hear sounds but misjudge direction', type: 'failure' },
            { roll: [3, 3], result: 'You detect movement but lose track of it', type: 'normal' },
            { roll: [4, 4], result: 'You notice something odd but cannot place it', type: 'normal' },
            { roll: [5, 5], result: 'You spot hidden object or movement', type: 'success' },
            { roll: [6, 6], result: 'You detect detail others would miss', type: 'success' }
        ]
    },
    perception_untrained_d8: {
        name: 'Untrained Perception (d8)',
        description: 'Untrained perception on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You fixate on distraction, miss real danger', type: 'failure' },
            { roll: [2, 2], result: 'You overlook movement in plain sight', type: 'failure' },
            { roll: [3, 3], result: 'You notice too late to react properly', type: 'failure' },
            { roll: [4, 4], result: 'You sense something wrong but cannot identify', type: 'failure' },
            { roll: [5, 5], result: 'You detect faint sound or distant motion', type: 'normal' },
            { roll: [6, 6], result: 'You spot partial clue to hidden presence', type: 'normal' },
            { roll: [7, 7], result: 'You notice concealed object or creature', type: 'success' },
            { roll: [8, 8], result: 'You detect ambush signs just in time', type: 'success' }
        ]
    },
    perception_untrained_d10: {
        name: 'Untrained Perception (d10)',
        description: 'Untrained perception on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You walk into obvious trap, completely oblivious', type: 'failure' },
            { roll: [2, 2], result: 'You ignore warning signs, danger strikes', type: 'failure' },
            { roll: [3, 3], result: 'You misjudge distance badly, stumble', type: 'failure' },
            { roll: [4, 4], result: 'You confuse harmless for hostile', type: 'failure' },
            { roll: [5, 5], result: 'You sense unease but see nothing', type: 'failure' },
            { roll: [6, 6], result: 'You catch glimpse of hidden threat', type: 'normal' },
            { roll: [7, 7], result: 'You hear faint sound, locate general area', type: 'normal' },
            { roll: [8, 8], result: 'You spot well-hidden detail through luck', type: 'success' },
            { roll: [9, 9], result: 'You notice subtle inconsistency in scene', type: 'success' },
            { roll: [10, 10], result: 'You detect hidden danger moments before', type: 'critical' }
        ]
    },
    perception_untrained_d12: {
        name: 'Untrained Perception (d12)',
        description: 'Untrained perception on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You are completely blind to surroundings', type: 'failure' },
            { roll: [2, 2], result: 'You focus on wrong sense entirely', type: 'failure' },
            { roll: [3, 3], result: 'You dismiss critical detail as unimportant', type: 'failure' },
            { roll: [4, 4], result: 'You see nothing unusual despite danger', type: 'failure' },
            { roll: [5, 5], result: 'You feel watched but cannot locate source', type: 'failure' },
            { roll: [6, 6], result: 'You detect vague wrongness in area', type: 'normal' },
            { roll: [7, 7], result: 'You notice single odd detail', type: 'normal' },
            { roll: [8, 8], result: 'You catch brief flicker of movement', type: 'normal' },
            { roll: [9, 9], result: 'You spot expertly hidden clue', type: 'success' },
            { roll: [10, 10], result: 'You sense danger through instinct', type: 'success' },
            { roll: [11, 11], result: 'You notice pattern others cannot see', type: 'success' },
            { roll: [12, 12], result: 'You detect nearly invisible threat', type: 'critical' }
        ]
    },
    perception_untrained_d20: {
        name: 'Untrained Perception (d20)',
        description: 'Untrained perception on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You are utterly oblivious to everything', type: 'failure' },
            { roll: [2, 3], result: 'You hallucinate threats that are not there', type: 'failure' },
            { roll: [4, 5], result: 'You stare directly at danger, see nothing', type: 'failure' },
            { roll: [6, 7], result: 'You trust false sense of security', type: 'failure' },
            { roll: [8, 9], result: 'You notice only after danger passes', type: 'failure' },
            { roll: [10, 11], result: 'You sense wrongness but freeze', type: 'failure' },
            { roll: [12, 13], result: 'You detect vague disturbance', type: 'failure' },
            { roll: [14, 15], result: 'You feel uneasy but see nothing', type: 'normal' },
            { roll: [16, 16], result: 'You catch faint trace of presence', type: 'normal' },
            { roll: [17, 17], result: 'You notice single subtle clue', type: 'normal' },
            { roll: [18, 18], result: 'You spot well-concealed detail', type: 'success' },
            { roll: [19, 19], result: 'You sense hidden danger through luck', type: 'success' },
            { roll: [20, 20], result: 'You detect impossible-to-see threat', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    perception_novice_d4: {
        name: 'Novice Perception (d4)',
        description: 'Novice perception on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You glance away at wrong moment', type: 'failure' },
            { roll: [2, 2], result: 'You notice detail immediately', type: 'normal' },
            { roll: [3, 3], result: 'You spot detail and understand context', type: 'success' },
            { roll: [4, 4], result: 'You notice detail before others react', type: 'success' }
        ]
    },
    perception_novice_d6: {
        name: 'Novice Perception (d6)',
        description: 'Novice perception on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misread subtle cue, wrong conclusion', type: 'failure' },
            { roll: [2, 2], result: 'You notice but cannot interpret meaning', type: 'failure' },
            { roll: [3, 3], result: 'You detect movement after brief delay', type: 'normal' },
            { roll: [4, 4], result: 'You spot hidden object with effort', type: 'normal' },
            { roll: [5, 5], result: 'You notice concealed detail clearly', type: 'success' },
            { roll: [6, 6], result: 'You detect multiple hidden elements', type: 'success' }
        ]
    },
    perception_novice_d8: {
        name: 'Novice Perception (d8)',
        description: 'Novice perception on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You focus on decoy, miss real threat', type: 'failure' },
            { roll: [2, 2], result: 'You notice too slowly to warn others', type: 'failure' },
            { roll: [3, 3], result: 'You sense danger but cannot pinpoint', type: 'failure' },
            { roll: [4, 4], result: 'You detect faint clue to hidden presence', type: 'normal' },
            { roll: [5, 5], result: 'You spot camouflaged object or creature', type: 'normal' },
            { roll: [6, 6], result: 'You notice ambush before it springs', type: 'success' },
            { roll: [7, 7], result: 'You detect multiple threats at once', type: 'success' },
            { roll: [8, 8], result: 'You sense danger with time to prepare', type: 'critical' }
        ]
    },
    perception_novice_d10: {
        name: 'Novice Perception (d10)',
        description: 'Novice perception on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You overlook expertly hidden detail', type: 'failure' },
            { roll: [2, 2], result: 'You notice but misinterpret significance', type: 'failure' },
            { roll: [3, 3], result: 'You sense wrongness but see nothing', type: 'failure' },
            { roll: [4, 4], result: 'You catch glimpse but lose track', type: 'failure' },
            { roll: [5, 5], result: 'You detect faint trace of passage', type: 'normal' },
            { roll: [6, 6], result: 'You spot well-concealed clue', type: 'normal' },
            { roll: [7, 7], result: 'You notice subtle pattern in chaos', type: 'success' },
            { roll: [8, 8], result: 'You detect hidden threat clearly', type: 'success' },
            { roll: [9, 9], result: 'You sense invisible presence nearby', type: 'success' },
            { roll: [10, 10], result: 'You pinpoint exact location of threat', type: 'critical' }
        ]
    },
    perception_novice_d12: {
        name: 'Novice Perception (d12)',
        description: 'Novice perception on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You are blind to masterful concealment', type: 'failure' },
            { roll: [2, 2], result: 'You sense unease but find nothing', type: 'failure' },
            { roll: [3, 3], result: 'You notice after danger has moved', type: 'failure' },
            { roll: [4, 4], result: 'You detect vague wrongness in area', type: 'normal' },
            { roll: [5, 5], result: 'You catch faint sound or scent', type: 'normal' },
            { roll: [6, 6], result: 'You spot single subtle inconsistency', type: 'normal' },
            { roll: [7, 7], result: 'You notice expertly hidden detail', type: 'success' },
            { roll: [8, 8], result: 'You detect concealed magical aura', type: 'success' },
            { roll: [9, 9], result: 'You sense invisible creature nearby', type: 'success' },
            { roll: [10, 10], result: 'You notice trap before triggering', type: 'success' },
            { roll: [11, 11], result: 'You detect multiple hidden threats', type: 'critical' },
            { roll: [12, 12], result: 'You sense danger moments before strike', type: 'critical' }
        ]
    },
    perception_novice_d20: {
        name: 'Novice Perception (d20)',
        description: 'Novice perception on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You are completely fooled by deception', type: 'failure' },
            { roll: [2, 3], result: 'You see nothing despite careful search', type: 'failure' },
            { roll: [4, 5], result: 'You sense wrongness but cannot locate', type: 'failure' },
            { roll: [6, 7], result: 'You notice only after threat reveals', type: 'failure' },
            { roll: [8, 9], result: 'You feel watched but see nothing', type: 'failure' },
            { roll: [10, 11], result: 'You detect vague disturbance', type: 'normal' },
            { roll: [12, 13], result: 'You catch faint trace of presence', type: 'normal' },
            { roll: [14, 15], result: 'You notice single minute detail', type: 'normal' },
            { roll: [16, 16], result: 'You spot nearly invisible clue', type: 'success' },
            { roll: [17, 17], result: 'You detect hidden magical effect', type: 'success' },
            { roll: [18, 18], result: 'You sense invisible threat location', type: 'success' },
            { roll: [19, 19], result: 'You notice pattern in seeming chaos', type: 'critical' },
            { roll: [20, 20], result: 'You detect impossible-to-see danger', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    perception_trained_d4: {
        name: 'Trained Perception (d4)',
        description: 'Trained perception on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You notice detail instantly', type: 'normal' },
            { roll: [2, 2], result: 'You spot detail and all context', type: 'success' },
            { roll: [3, 3], result: 'You detect detail before it appears', type: 'success' },
            { roll: [4, 4], result: 'You sense everything in area clearly', type: 'critical' }
        ]
    },
    perception_trained_d6: {
        name: 'Trained Perception (d6)',
        description: 'Trained perception on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You briefly distracted, refocus quickly', type: 'failure' },
            { roll: [2, 2], result: 'You notice hidden detail clearly', type: 'normal' },
            { roll: [3, 3], result: 'You spot concealed object immediately', type: 'normal' },
            { roll: [4, 4], result: 'You detect multiple hidden elements', type: 'success' },
            { roll: [5, 5], result: 'You sense all nearby threats', type: 'success' },
            { roll: [6, 6], result: 'You notice detail others cannot see', type: 'critical' }
        ]
    },
    perception_trained_d8: {
        name: 'Trained Perception (d8)',
        description: 'Trained perception on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You miss well-hidden detail', type: 'failure' },
            { roll: [2, 2], result: 'You notice but need time to process', type: 'failure' },
            { roll: [3, 3], result: 'You detect camouflaged presence', type: 'normal' },
            { roll: [4, 4], result: 'You spot expertly hidden clue', type: 'normal' },
            { roll: [5, 5], result: 'You notice ambush before it springs', type: 'success' },
            { roll: [6, 6], result: 'You detect invisible disturbance', type: 'success' },
            { roll: [7, 7], result: 'You sense all hidden threats nearby', type: 'success' },
            { roll: [8, 8], result: 'You pinpoint exact threat location', type: 'critical' }
        ]
    },
    perception_trained_d10: {
        name: 'Trained Perception (d10)',
        description: 'Trained perception on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You overlook masterfully hidden detail', type: 'failure' },
            { roll: [2, 2], result: 'You sense wrongness but cannot locate', type: 'failure' },
            { roll: [3, 3], result: 'You notice after brief delay', type: 'failure' },
            { roll: [4, 4], result: 'You detect faint trace of presence', type: 'normal' },
            { roll: [5, 5], result: 'You spot well-concealed clue', type: 'normal' },
            { roll: [6, 6], result: 'You notice subtle magical residue', type: 'success' },
            { roll: [7, 7], result: 'You detect invisible creature nearby', type: 'success' },
            { roll: [8, 8], result: 'You sense trap before triggering', type: 'success' },
            { roll: [9, 9], result: 'You notice pattern in complex scene', type: 'success' },
            { roll: [10, 10], result: 'You detect all hidden threats at once', type: 'critical' }
        ]
    },
    perception_trained_d12: {
        name: 'Trained Perception (d12)',
        description: 'Trained perception on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You are blind to perfect concealment', type: 'failure' },
            { roll: [2, 2], result: 'You sense unease but find nothing', type: 'failure' },
            { roll: [3, 3], result: 'You notice only after threat moves', type: 'failure' },
            { roll: [4, 4], result: 'You detect vague disturbance', type: 'normal' },
            { roll: [5, 5], result: 'You catch faint magical signature', type: 'normal' },
            { roll: [6, 6], result: 'You spot minute inconsistency', type: 'normal' },
            { roll: [7, 7], result: 'You notice expertly hidden detail', type: 'success' },
            { roll: [8, 8], result: 'You detect invisible magical effect', type: 'success' },
            { roll: [9, 9], result: 'You sense hidden creature precisely', type: 'success' },
            { roll: [10, 10], result: 'You notice trap mechanism clearly', type: 'success' },
            { roll: [11, 11], result: 'You detect multiple hidden dangers', type: 'critical' },
            { roll: [12, 12], result: 'You sense threat before it acts', type: 'critical' }
        ]
    },
    perception_trained_d20: {
        name: 'Trained Perception (d20)',
        description: 'Trained perception on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You are fooled by masterful illusion', type: 'failure' },
            { roll: [2, 3], result: 'You see nothing despite thorough search', type: 'failure' },
            { roll: [4, 5], result: 'You sense wrongness but cannot identify', type: 'failure' },
            { roll: [6, 7], result: 'You notice only after threat reveals', type: 'failure' },
            { roll: [8, 9], result: 'You feel observed but see nothing', type: 'normal' },
            { roll: [10, 11], result: 'You detect faint magical disturbance', type: 'normal' },
            { roll: [12, 13], result: 'You catch trace of invisible presence', type: 'normal' },
            { roll: [14, 15], result: 'You spot nearly imperceptible clue', type: 'success' },
            { roll: [16, 16], result: 'You detect hidden magical aura', type: 'success' },
            { roll: [17, 17], result: 'You sense invisible threat location', type: 'success' },
            { roll: [18, 18], result: 'You notice pattern others cannot see', type: 'success' },
            { roll: [19, 19], result: 'You detect impossible-to-see danger', type: 'critical' },
            { roll: [20, 20], result: 'You sense all hidden elements at once', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    perception_apprentice_d4: {
        name: 'Apprentice Perception (d4)',
        description: 'Apprentice perception on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You notice everything instantly', type: 'success' },
            { roll: [2, 2], result: 'You sense all details before looking', type: 'success' },
            { roll: [3, 3], result: 'You detect hidden elements effortlessly', type: 'critical' },
            { roll: [4, 4], result: 'You perceive complete scene at glance', type: 'critical' }
        ]
    },
    perception_apprentice_d6: {
        name: 'Apprentice Perception (d6)',
        description: 'Apprentice perception on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You briefly distracted by environment', type: 'normal' },
            { roll: [2, 2], result: 'You notice all visible details clearly', type: 'success' },
            { roll: [3, 3], result: 'You detect all hidden elements', type: 'success' },
            { roll: [4, 4], result: 'You sense threats before they appear', type: 'success' },
            { roll: [5, 5], result: 'You notice invisible disturbances', type: 'critical' },
            { roll: [6, 6], result: 'You perceive magical auras clearly', type: 'critical' }
        ]
    },
    perception_apprentice_d8: {
        name: 'Apprentice Perception (d8)',
        description: 'Apprentice perception on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You miss perfectly hidden detail', type: 'failure' },
            { roll: [2, 2], result: 'You notice all visible elements', type: 'normal' },
            { roll: [3, 3], result: 'You detect well-hidden details', type: 'normal' },
            { roll: [4, 4], result: 'You spot expertly concealed clues', type: 'success' },
            { roll: [5, 5], result: 'You sense invisible presence nearby', type: 'success' },
            { roll: [6, 6], result: 'You detect magical concealment', type: 'success' },
            { roll: [7, 7], result: 'You notice all hidden threats', type: 'success' },
            { roll: [8, 8], result: 'You sense danger before it strikes', type: 'critical' }
        ]
    },
    perception_apprentice_d10: {
        name: 'Apprentice Perception (d10)',
        description: 'Apprentice perception on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You overlook masterful concealment', type: 'failure' },
            { roll: [2, 2], result: 'You sense wrongness but cannot locate', type: 'failure' },
            { roll: [3, 3], result: 'You detect faint disturbance', type: 'normal' },
            { roll: [4, 4], result: 'You spot well-hidden clue', type: 'normal' },
            { roll: [5, 5], result: 'You notice subtle magical trace', type: 'normal' },
            { roll: [6, 6], result: 'You detect invisible creature', type: 'success' },
            { roll: [7, 7], result: 'You sense hidden trap mechanism', type: 'success' },
            { roll: [8, 8], result: 'You notice pattern in chaos', type: 'success' },
            { roll: [9, 9], result: 'You detect all concealed threats', type: 'success' },
            { roll: [10, 10], result: 'You sense danger moments before', type: 'critical' }
        ]
    },
    perception_apprentice_d12: {
        name: 'Apprentice Perception (d12)',
        description: 'Apprentice perception on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You are blind to perfect illusion', type: 'failure' },
            { roll: [2, 2], result: 'You sense unease but see nothing', type: 'failure' },
            { roll: [3, 3], result: 'You notice only after threat moves', type: 'failure' },
            { roll: [4, 4], result: 'You detect vague magical presence', type: 'normal' },
            { roll: [5, 5], result: 'You catch faint invisible trace', type: 'normal' },
            { roll: [6, 6], result: 'You spot minute detail others miss', type: 'normal' },
            { roll: [7, 7], result: 'You notice expertly hidden element', type: 'success' },
            { roll: [8, 8], result: 'You detect invisible magical aura', type: 'success' },
            { roll: [9, 9], result: 'You sense concealed creature precisely', type: 'success' },
            { roll: [10, 10], result: 'You notice complex trap system', type: 'success' },
            { roll: [11, 11], result: 'You detect all hidden dangers', type: 'critical' },
            { roll: [12, 12], result: 'You sense threat before action', type: 'critical' }
        ]
    },
    perception_apprentice_d20: {
        name: 'Apprentice Perception (d20)',
        description: 'Apprentice perception on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You cannot pierce supreme illusion', type: 'failure' },
            { roll: [2, 3], result: 'You see nothing despite keen senses', type: 'failure' },
            { roll: [4, 5], result: 'You sense wrongness but cannot identify', type: 'failure' },
            { roll: [6, 7], result: 'You notice only after reveal', type: 'failure' },
            { roll: [8, 9], result: 'You feel watched but see nothing', type: 'normal' },
            { roll: [10, 11], result: 'You detect faint magical signature', type: 'normal' },
            { roll: [12, 13], result: 'You catch trace of invisible presence', type: 'normal' },
            { roll: [14, 15], result: 'You spot imperceptible clue', type: 'success' },
            { roll: [16, 16], result: 'You detect hidden magical effect', type: 'success' },
            { roll: [17, 17], result: 'You sense invisible threat precisely', type: 'success' },
            { roll: [18, 18], result: 'You notice impossible-to-see pattern', type: 'success' },
            { roll: [19, 19], result: 'You detect all concealed elements', type: 'critical' },
            { roll: [20, 20], result: 'You sense danger before it forms', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    perception_adept_d4: {
        name: 'Adept Perception (d4)',
        description: 'Adept perception on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You perceive everything without effort', type: 'success' },
            { roll: [2, 2], result: 'You sense all details before observing', type: 'critical' },
            { roll: [3, 3], result: 'You detect hidden and visible as one', type: 'critical' },
            { roll: [4, 4], result: 'You perceive complete truth instantly', type: 'critical' }
        ]
    },
    perception_adept_d6: {
        name: 'Adept Perception (d6)',
        description: 'Adept perception on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You notice all details effortlessly', type: 'success' },
            { roll: [2, 2], result: 'You detect all hidden elements', type: 'success' },
            { roll: [3, 3], result: 'You sense invisible presences clearly', type: 'success' },
            { roll: [4, 4], result: 'You perceive magical auras perfectly', type: 'critical' },
            { roll: [5, 5], result: 'You notice threats before they form', type: 'critical' },
            { roll: [6, 6], result: 'You sense all nearby dangers at once', type: 'critical' }
        ]
    },
    perception_adept_d8: {
        name: 'Adept Perception (d8)',
        description: 'Adept perception on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You need moment to focus senses', type: 'normal' },
            { roll: [2, 2], result: 'You notice all visible and hidden', type: 'normal' },
            { roll: [3, 3], result: 'You detect expertly concealed details', type: 'success' },
            { roll: [4, 4], result: 'You sense invisible creatures clearly', type: 'success' },
            { roll: [5, 5], result: 'You perceive magical concealment', type: 'success' },
            { roll: [6, 6], result: 'You notice all threats simultaneously', type: 'success' },
            { roll: [7, 7], result: 'You detect danger before it manifests', type: 'critical' },
            { roll: [8, 8], result: 'You sense all hidden elements perfectly', type: 'critical' }
        ]
    },
    perception_adept_d10: {
        name: 'Adept Perception (d10)',
        description: 'Adept perception on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You need extra focus to perceive', type: 'failure' },
            { roll: [2, 2], result: 'You detect faint disturbance', type: 'normal' },
            { roll: [3, 3], result: 'You notice well-hidden detail', type: 'normal' },
            { roll: [4, 4], result: 'You sense subtle magical trace', type: 'normal' },
            { roll: [5, 5], result: 'You detect invisible presence', type: 'success' },
            { roll: [6, 6], result: 'You notice complex trap system', type: 'success' },
            { roll: [7, 7], result: 'You sense pattern in chaos', type: 'success' },
            { roll: [8, 8], result: 'You detect all concealed threats', type: 'success' },
            { roll: [9, 9], result: 'You perceive danger before it acts', type: 'critical' },
            { roll: [10, 10], result: 'You sense all hidden elements at once', type: 'critical' }
        ]
    },
    perception_adept_d12: {
        name: 'Adept Perception (d12)',
        description: 'Adept perception on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You struggle against perfect illusion', type: 'failure' },
            { roll: [2, 2], result: 'You sense wrongness but cannot pierce', type: 'failure' },
            { roll: [3, 3], result: 'You detect vague magical presence', type: 'normal' },
            { roll: [4, 4], result: 'You catch faint invisible trace', type: 'normal' },
            { roll: [5, 5], result: 'You spot minute inconsistency', type: 'normal' },
            { roll: [6, 6], result: 'You notice expertly hidden detail', type: 'success' },
            { roll: [7, 7], result: 'You detect invisible magical aura', type: 'success' },
            { roll: [8, 8], result: 'You sense concealed creature precisely', type: 'success' },
            { roll: [9, 9], result: 'You perceive complex trap network', type: 'success' },
            { roll: [10, 10], result: 'You detect all hidden dangers', type: 'critical' },
            { roll: [11, 11], result: 'You sense threat before it forms', type: 'critical' },
            { roll: [12, 12], result: 'You pierce all concealment at once', type: 'critical' }
        ]
    },
    perception_adept_d20: {
        name: 'Adept Perception (d20)',
        description: 'Adept perception on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You cannot pierce supreme concealment', type: 'failure' },
            { roll: [2, 3], result: 'You sense wrongness but see nothing', type: 'failure' },
            { roll: [4, 5], result: 'You detect vague disturbance', type: 'failure' },
            { roll: [6, 7], result: 'You catch faint magical signature', type: 'normal' },
            { roll: [8, 9], result: 'You notice trace of invisible presence', type: 'normal' },
            { roll: [10, 11], result: 'You spot imperceptible detail', type: 'normal' },
            { roll: [12, 13], result: 'You detect hidden magical effect', type: 'success' },
            { roll: [14, 15], result: 'You sense invisible threat location', type: 'success' },
            { roll: [16, 16], result: 'You notice impossible-to-see pattern', type: 'success' },
            { roll: [17, 17], result: 'You detect all concealed elements', type: 'success' },
            { roll: [18, 18], result: 'You sense danger before it manifests', type: 'critical' },
            { roll: [19, 19], result: 'You perceive all hidden truths', type: 'critical' },
            { roll: [20, 20], result: 'You detect threats across dimensions', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    perception_expert_d4: {
        name: 'Expert Perception (d4)',
        description: 'Expert perception on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You perceive all without thought', type: 'critical' },
            { roll: [2, 2], result: 'You sense everything before observing', type: 'critical' },
            { roll: [3, 3], result: 'You detect all truths instantly', type: 'critical' },
            { roll: [4, 4], result: 'You perceive beyond normal senses', type: 'critical' }
        ]
    },
    perception_expert_d6: {
        name: 'Expert Perception (d6)',
        description: 'Expert perception on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You notice all details perfectly', type: 'success' },
            { roll: [2, 2], result: 'You detect all hidden elements', type: 'critical' },
            { roll: [3, 3], result: 'You sense invisible presences clearly', type: 'critical' },
            { roll: [4, 4], result: 'You perceive magical auras perfectly', type: 'critical' },
            { roll: [5, 5], result: 'You notice threats before they exist', type: 'critical' },
            { roll: [6, 6], result: 'You sense all dangers simultaneously', type: 'critical' }
        ]
    },
    perception_expert_d8: {
        name: 'Expert Perception (d8)',
        description: 'Expert perception on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You notice all details effortlessly', type: 'success' },
            { roll: [2, 2], result: 'You detect all visible and hidden', type: 'success' },
            { roll: [3, 3], result: 'You sense expertly concealed details', type: 'success' },
            { roll: [4, 4], result: 'You perceive invisible creatures clearly', type: 'critical' },
            { roll: [5, 5], result: 'You detect magical concealment', type: 'critical' },
            { roll: [6, 6], result: 'You notice all threats at once', type: 'critical' },
            { roll: [7, 7], result: 'You sense danger before it forms', type: 'critical' },
            { roll: [8, 8], result: 'You perceive all hidden elements', type: 'critical' }
        ]
    },
    perception_expert_d10: {
        name: 'Expert Perception (d10)',
        description: 'Expert perception on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You need brief focus to perceive', type: 'normal' },
            { roll: [2, 2], result: 'You detect all visible details', type: 'success' },
            { roll: [3, 3], result: 'You notice well-hidden elements', type: 'success' },
            { roll: [4, 4], result: 'You sense subtle magical traces', type: 'success' },
            { roll: [5, 5], result: 'You detect invisible presences', type: 'success' },
            { roll: [6, 6], result: 'You perceive complex trap systems', type: 'critical' },
            { roll: [7, 7], result: 'You sense patterns in chaos', type: 'critical' },
            { roll: [8, 8], result: 'You detect all concealed threats', type: 'critical' },
            { roll: [9, 9], result: 'You perceive danger before it acts', type: 'critical' },
            { roll: [10, 10], result: 'You sense all hidden elements', type: 'critical' }
        ]
    },
    perception_expert_d12: {
        name: 'Expert Perception (d12)',
        description: 'Expert perception on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You need concentration to pierce', type: 'normal' },
            { roll: [2, 2], result: 'You detect vague disturbance', type: 'normal' },
            { roll: [3, 3], result: 'You notice expertly hidden detail', type: 'success' },
            { roll: [4, 4], result: 'You sense invisible magical aura', type: 'success' },
            { roll: [5, 5], result: 'You perceive concealed creature', type: 'success' },
            { roll: [6, 6], result: 'You detect complex trap network', type: 'success' },
            { roll: [7, 7], result: 'You notice all hidden dangers', type: 'critical' },
            { roll: [8, 8], result: 'You sense threat before it forms', type: 'critical' },
            { roll: [9, 9], result: 'You pierce all concealment', type: 'critical' },
            { roll: [10, 10], result: 'You perceive all hidden truths', type: 'critical' },
            { roll: [11, 11], result: 'You detect threats across planes', type: 'critical' },
            { roll: [12, 12], result: 'You sense all dangers at once', type: 'critical' }
        ]
    },
    perception_expert_d20: {
        name: 'Expert Perception (d20)',
        description: 'Expert perception on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You struggle against supreme illusion', type: 'failure' },
            { roll: [2, 3], result: 'You sense wrongness but cannot pierce', type: 'normal' },
            { roll: [4, 5], result: 'You detect faint disturbance', type: 'normal' },
            { roll: [6, 7], result: 'You notice imperceptible detail', type: 'success' },
            { roll: [8, 9], result: 'You sense invisible threat', type: 'success' },
            { roll: [10, 11], result: 'You detect hidden magical effect', type: 'success' },
            { roll: [12, 13], result: 'You perceive impossible-to-see pattern', type: 'success' },
            { roll: [14, 15], result: 'You notice all concealed elements', type: 'critical' },
            { roll: [16, 16], result: 'You sense danger before manifestation', type: 'critical' },
            { roll: [17, 17], result: 'You perceive all hidden truths', type: 'critical' },
            { roll: [18, 18], result: 'You detect threats across dimensions', type: 'critical' },
            { roll: [19, 19], result: 'You sense all dangers simultaneously', type: 'critical' },
            { roll: [20, 20], result: 'You perceive beyond mortal senses', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    perception_master_d4: {
        name: 'Master Perception (d4)',
        description: 'Master perception on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You perceive all without effort', type: 'critical' },
            { roll: [2, 2], result: 'You sense everything before it exists', type: 'critical' },
            { roll: [3, 3], result: 'You detect all truths simultaneously', type: 'critical' },
            { roll: [4, 4], result: 'You perceive across all dimensions', type: 'critical' }
        ]
    },
    perception_master_d6: {
        name: 'Master Perception (d6)',
        description: 'Master perception on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You notice all details perfectly', type: 'critical' },
            { roll: [2, 2], result: 'You detect all hidden elements', type: 'critical' },
            { roll: [3, 3], result: 'You sense invisible presences', type: 'critical' },
            { roll: [4, 4], result: 'You perceive magical auras perfectly', type: 'critical' },
            { roll: [5, 5], result: 'You notice threats before they form', type: 'critical' },
            { roll: [6, 6], result: 'You sense all dangers across planes', type: 'critical' }
        ]
    },
    perception_master_d8: {
        name: 'Master Perception (d8)',
        description: 'Master perception on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You perceive all effortlessly', type: 'critical' },
            { roll: [2, 2], result: 'You detect all visible and hidden', type: 'critical' },
            { roll: [3, 3], result: 'You sense expertly concealed details', type: 'critical' },
            { roll: [4, 4], result: 'You perceive invisible creatures', type: 'critical' },
            { roll: [5, 5], result: 'You detect magical concealment', type: 'critical' },
            { roll: [6, 6], result: 'You notice all threats at once', type: 'critical' },
            { roll: [7, 7], result: 'You sense danger before it forms', type: 'critical' },
            { roll: [8, 8], result: 'You perceive all hidden elements', type: 'critical' }
        ]
    },
    perception_master_d10: {
        name: 'Master Perception (d10)',
        description: 'Master perception on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You notice all details instantly', type: 'success' },
            { roll: [2, 2], result: 'You detect all visible elements', type: 'critical' },
            { roll: [3, 3], result: 'You sense well-hidden details', type: 'critical' },
            { roll: [4, 4], result: 'You perceive subtle magical traces', type: 'critical' },
            { roll: [5, 5], result: 'You detect invisible presences', type: 'critical' },
            { roll: [6, 6], result: 'You notice complex trap systems', type: 'critical' },
            { roll: [7, 7], result: 'You sense patterns in chaos', type: 'critical' },
            { roll: [8, 8], result: 'You detect all concealed threats', type: 'critical' },
            { roll: [9, 9], result: 'You perceive danger before it acts', type: 'critical' },
            { roll: [10, 10], result: 'You sense all hidden elements', type: 'critical' }
        ]
    },
    perception_master_d12: {
        name: 'Master Perception (d12)',
        description: 'Master perception on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You need brief focus to perceive', type: 'success' },
            { roll: [2, 2], result: 'You detect all visible details', type: 'success' },
            { roll: [3, 3], result: 'You notice expertly hidden elements', type: 'critical' },
            { roll: [4, 4], result: 'You sense invisible magical auras', type: 'critical' },
            { roll: [5, 5], result: 'You perceive concealed creatures', type: 'critical' },
            { roll: [6, 6], result: 'You detect complex trap networks', type: 'critical' },
            { roll: [7, 7], result: 'You notice all hidden dangers', type: 'critical' },
            { roll: [8, 8], result: 'You sense threats before they form', type: 'critical' },
            { roll: [9, 9], result: 'You pierce all concealment', type: 'critical' },
            { roll: [10, 10], result: 'You perceive all hidden truths', type: 'critical' },
            { roll: [11, 11], result: 'You detect threats across planes', type: 'critical' },
            { roll: [12, 12], result: 'You sense all dangers at once', type: 'critical' }
        ]
    },
    perception_master_d20: {
        name: 'Master Perception (d20)',
        description: 'Master perception on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You need concentration to pierce', type: 'normal' },
            { roll: [2, 3], result: 'You sense vague disturbance', type: 'success' },
            { roll: [4, 5], result: 'You detect faint presence', type: 'success' },
            { roll: [6, 7], result: 'You notice imperceptible detail', type: 'critical' },
            { roll: [8, 9], result: 'You sense invisible threat', type: 'critical' },
            { roll: [10, 11], result: 'You detect hidden magical effect', type: 'critical' },
            { roll: [12, 13], result: 'You perceive impossible-to-see pattern', type: 'critical' },
            { roll: [14, 15], result: 'You notice all concealed elements', type: 'critical' },
            { roll: [16, 16], result: 'You sense danger before manifestation', type: 'critical' },
            { roll: [17, 17], result: 'You perceive all hidden truths', type: 'critical' },
            { roll: [18, 18], result: 'You detect threats across dimensions', type: 'critical' },
            { roll: [19, 19], result: 'You sense all dangers simultaneously', type: 'critical' },
            { roll: [20, 20], result: 'You perceive beyond mortal comprehension', type: 'critical' }
        ]
    }
};

