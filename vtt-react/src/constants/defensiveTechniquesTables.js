// Defensive Techniques Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total
// Each die type has exact outcome count: d4=4, d6=6, d8=7, d10=9, d12=10, d20=13
// For d20 tables: 13 unique outcomes with ranges covering all 20 possible roll values
// Triggered by Defend Action - Armor stat governs effectiveness

export const DEFENSIVE_TECHNIQUES_TABLES = {
    // UNTRAINED - d4 through d20
    defensivetechniques_untrained_d4: {
        name: 'Untrained Defensive Techniques (d4)',
        description: 'Untrained defense on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Guard drops completely, take full damage', type: 'failure' },
            { roll: [2, 2], result: 'Clumsy block, armor absorbs minimal impact', type: 'normal' },
            { roll: [3, 3], result: 'Awkward stance holds, reduce damage slightly', type: 'success' },
            { roll: [4, 4], result: 'Lucky deflection, armor catches the blow', type: 'success' }
        ]
    },
    defensivetechniques_untrained_d6: {
        name: 'Untrained Defensive Techniques (d6)',
        description: 'Untrained defense on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Panic, drop weapon and expose yourself', type: 'failure' },
            { roll: [2, 2], result: 'Wrong angle, strike slips past guard', type: 'failure' },
            { roll: [3, 3], result: 'Hesitant block, armor dented', type: 'normal' },
            { roll: [4, 4], result: 'Shaky defense holds barely', type: 'normal' },
            { roll: [5, 5], result: 'Instinctive parry reduces impact', type: 'success' },
            { roll: [6, 6], result: 'Desperate block succeeds, armor strained', type: 'success' }
        ]
    },
    defensivetechniques_untrained_d8: {
        name: 'Untrained Defensive Techniques (d8)',
        description: 'Untrained defense on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Stumble backward, armor gap exposed', type: 'failure' },
            { roll: [2, 2], result: 'Shield misaligned, blow connects solidly', type: 'failure' },
            { roll: [3, 3], result: 'Flinch ruins timing, partial hit lands', type: 'failure' },
            { roll: [4, 4], result: 'Overcommit to block, lose balance', type: 'failure' },
            { roll: [5, 5], result: 'Sloppy guard absorbs some force', type: 'normal' },
            { roll: [6, 6], result: 'Crude block works, armor takes stress', type: 'normal' },
            { roll: [7, 7], result: 'Unrefined deflection reduces damage', type: 'success' },
            { roll: [8, 8], result: 'Raw instinct guides effective block', type: 'success' }
        ]
    },
    defensivetechniques_untrained_d10: {
        name: 'Untrained Defensive Techniques (d10)',
        description: 'Untrained defense on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Frozen in fear, armor buckles under blow', type: 'failure' },
            { roll: [2, 2], result: 'Wild parry fails, weapon knocked aside', type: 'failure' },
            { roll: [3, 3], result: 'Misjudge distance, strike bypasses guard', type: 'failure' },
            { roll: [4, 4], result: 'Armor straps snap from poor positioning', type: 'failure' },
            { roll: [5, 5], result: 'Desperate dodge leaves you off-balance', type: 'failure' },
            { roll: [6, 6], result: 'Frantic block catches edge of attack', type: 'normal' },
            { roll: [7, 7], result: 'Panicked defense partially effective', type: 'normal' },
            { roll: [8, 8], result: 'Survival instinct guides crude block', type: 'success' },
            { roll: [9, 9], result: 'Unexpected resilience, armor holds firm', type: 'success' },
            { roll: [10, 10], result: 'Miraculous timing deflects heavy blow', type: 'critical' }
        ]
    },
    defensivetechniques_untrained_d12: {
        name: 'Untrained Defensive Techniques (d12)',
        description: 'Untrained defense on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Complete breakdown, armor shattered', type: 'failure' },
            { roll: [2, 2], result: 'Guard collapses, take devastating hit', type: 'failure' },
            { roll: [3, 3], result: 'Overwhelmed, defense crumbles entirely', type: 'failure' },
            { roll: [4, 4], result: 'Poor footwork, knocked prone', type: 'failure' },
            { roll: [5, 5], result: 'Shield torn from grip by impact', type: 'failure' },
            { roll: [6, 6], result: 'Barely raise guard in time', type: 'normal' },
            { roll: [7, 7], result: 'Desperate brace absorbs some force', type: 'normal' },
            { roll: [8, 8], result: 'Crude stance holds under pressure', type: 'normal' },
            { roll: [9, 9], result: 'Untrained block surprisingly effective', type: 'success' },
            { roll: [10, 10], result: 'Natural toughness compensates for lack of skill', type: 'success' },
            { roll: [11, 11], result: 'Instinct overrides inexperience', type: 'success' },
            { roll: [12, 12], result: 'Impossible luck, perfect defensive angle', type: 'critical' }
        ]
    },
    defensivetechniques_untrained_d20: {
        name: 'Untrained Defensive Techniques (d20)',
        description: 'Untrained defense on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Total failure, armor pierced completely', type: 'failure' },
            { roll: [2, 3], result: 'Defense shatters, multiple openings exposed', type: 'failure' },
            { roll: [4, 5], result: 'Overwhelmed by force, guard broken', type: 'failure' },
            { roll: [6, 7], result: 'Armor fails under relentless pressure', type: 'failure' },
            { roll: [8, 9], result: 'Stance collapses, lose all positioning', type: 'failure' },
            { roll: [10, 11], result: 'Desperate scramble barely keeps you upright', type: 'failure' },
            { roll: [12, 13], result: 'Wild defense ineffective against precision', type: 'failure' },
            { roll: [14, 15], result: 'Frantic blocking slows the assault', type: 'normal' },
            { roll: [16, 16], result: 'Crude guard catches glancing blow', type: 'normal' },
            { roll: [17, 17], result: 'Untrained resilience absorbs impact', type: 'normal' },
            { roll: [18, 18], result: 'Raw determination creates opening', type: 'success' },
            { roll: [19, 19], result: 'Primal instinct guides effective counter', type: 'success' },
            { roll: [20, 20], result: 'Against all odds, perfect defensive moment', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    defensivetechniques_novice_d4: {
        name: 'Novice Defensive Techniques (d4)',
        description: 'Novice defense on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Mistimed block, armor rattles', type: 'failure' },
            { roll: [2, 2], result: 'Basic guard absorbs the strike', type: 'normal' },
            { roll: [3, 3], result: 'Practiced stance deflects cleanly', type: 'success' },
            { roll: [4, 4], result: 'Confident block, armor holds strong', type: 'success' }
        ]
    },
    defensivetechniques_novice_d6: {
        name: 'Novice Defensive Techniques (d6)',
        description: 'Novice defense on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Hesitation breaks your form', type: 'failure' },
            { roll: [2, 2], result: 'Shield angle wrong, impact jarring', type: 'failure' },
            { roll: [3, 3], result: 'Adequate block, some force bleeds through', type: 'normal' },
            { roll: [4, 4], result: 'Steady defense reduces damage', type: 'normal' },
            { roll: [5, 5], result: 'Trained response deflects effectively', type: 'success' },
            { roll: [6, 6], result: 'Solid parry, armor undamaged', type: 'success' }
        ]
    },
    defensivetechniques_novice_d8: {
        name: 'Novice Defensive Techniques (d8)',
        description: 'Novice defense on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Footwork fails, blow lands hard', type: 'failure' },
            { roll: [2, 2], result: 'Overextend guard, armor stressed', type: 'failure' },
            { roll: [3, 3], result: 'Timing off, partial deflection only', type: 'failure' },
            { roll: [4, 4], result: 'Basic technique absorbs most impact', type: 'normal' },
            { roll: [5, 5], result: 'Practiced block holds position', type: 'normal' },
            { roll: [6, 6], result: 'Competent defense redirects force', type: 'success' },
            { roll: [7, 7], result: 'Trained stance maintains stability', type: 'success' },
            { roll: [8, 8], result: 'Skillful parry creates counter opportunity', type: 'critical' }
        ]
    },
    defensivetechniques_novice_d10: {
        name: 'Novice Defensive Techniques (d10)',
        description: 'Novice defense on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Pressure breaks concentration, guard drops', type: 'failure' },
            { roll: [2, 2], result: 'Armor buckles under heavy strike', type: 'failure' },
            { roll: [3, 3], result: 'Defense wavers, lose ground', type: 'failure' },
            { roll: [4, 4], result: 'Struggle to maintain form', type: 'failure' },
            { roll: [5, 5], result: 'Barely hold position, armor dented', type: 'normal' },
            { roll: [6, 6], result: 'Fundamental technique keeps you standing', type: 'normal' },
            { roll: [7, 7], result: 'Solid block despite heavy pressure', type: 'success' },
            { roll: [8, 8], result: 'Trained reflexes guide effective defense', type: 'success' },
            { roll: [9, 9], result: 'Disciplined stance absorbs punishment', type: 'success' },
            { roll: [10, 10], result: 'Perfect execution under duress', type: 'critical' }
        ]
    },
    defensivetechniques_novice_d12: {
        name: 'Novice Defensive Techniques (d12)',
        description: 'Novice defense on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Overwhelmed, armor cracks under assault', type: 'failure' },
            { roll: [2, 2], result: 'Defense crumbles, forced backward', type: 'failure' },
            { roll: [3, 3], result: 'Guard broken by superior force', type: 'failure' },
            { roll: [4, 4], result: 'Technique fails against relentless attack', type: 'failure' },
            { roll: [5, 5], result: 'Barely deflect, armor severely stressed', type: 'failure' },
            { roll: [6, 6], result: 'Fundamental skills keep you in fight', type: 'normal' },
            { roll: [7, 7], result: 'Basic defense absorbs brutal impact', type: 'normal' },
            { roll: [8, 8], result: 'Trained response holds under pressure', type: 'normal' },
            { roll: [9, 9], result: 'Competent block reduces heavy damage', type: 'success' },
            { roll: [10, 10], result: 'Disciplined form withstands assault', type: 'success' },
            { roll: [11, 11], result: 'Practiced technique proves effective', type: 'success' },
            { roll: [12, 12], result: 'Exceptional timing turns defense into advantage', type: 'critical' }
        ]
    },
    defensivetechniques_novice_d20: {
        name: 'Novice Defensive Techniques (d20)',
        description: 'Novice defense on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Completely outmatched, armor shattered', type: 'failure' },
            { roll: [2, 3], result: 'Defense obliterated by overwhelming force', type: 'failure' },
            { roll: [4, 5], result: 'Guard collapses under sustained pressure', type: 'failure' },
            { roll: [6, 7], result: 'Armor fails against superior technique', type: 'failure' },
            { roll: [8, 9], result: 'Stance broken, knocked off balance', type: 'failure' },
            { roll: [10, 11], result: 'Desperate defense barely functional', type: 'failure' },
            { roll: [12, 13], result: 'Basic skills insufficient, take heavy damage', type: 'failure' },
            { roll: [14, 15], result: 'Fundamental technique slows assault', type: 'normal' },
            { roll: [16, 16], result: 'Trained reflexes absorb some impact', type: 'normal' },
            { roll: [17, 17], result: 'Disciplined stance holds momentarily', type: 'normal' },
            { roll: [18, 18], result: 'Practiced defense finds opening', type: 'success' },
            { roll: [19, 19], result: 'Competent block against overwhelming odds', type: 'success' },
            { roll: [20, 20], result: 'Masterful execution transcends experience', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    defensivetechniques_trained_d4: {
        name: 'Trained Defensive Techniques (d4)',
        description: 'Trained defense on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Rare lapse, armor absorbs poorly', type: 'failure' },
            { roll: [2, 2], result: 'Efficient block, minimal effort', type: 'normal' },
            { roll: [3, 3], result: 'Skilled deflection, armor pristine', type: 'success' },
            { roll: [4, 4], result: 'Effortless parry, perfect form', type: 'success' }
        ]
    },
    defensivetechniques_trained_d6: {
        name: 'Trained Defensive Techniques (d6)',
        description: 'Trained defense on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Momentary distraction, guard slips', type: 'failure' },
            { roll: [2, 2], result: 'Minor error, armor takes light stress', type: 'failure' },
            { roll: [3, 3], result: 'Competent block, damage reduced', type: 'normal' },
            { roll: [4, 4], result: 'Practiced defense holds firm', type: 'normal' },
            { roll: [5, 5], result: 'Skilled parry redirects force', type: 'success' },
            { roll: [6, 6], result: 'Expert timing, armor undamaged', type: 'success' }
        ]
    },
    defensivetechniques_trained_d8: {
        name: 'Trained Defensive Techniques (d8)',
        description: 'Trained defense on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Misjudge angle, blow connects', type: 'failure' },
            { roll: [2, 2], result: 'Technique falters, armor stressed', type: 'failure' },
            { roll: [3, 3], result: 'Adequate defense, some impact felt', type: 'normal' },
            { roll: [4, 4], result: 'Solid block absorbs strike', type: 'normal' },
            { roll: [5, 5], result: 'Trained response deflects cleanly', type: 'success' },
            { roll: [6, 6], result: 'Skillful parry maintains position', type: 'success' },
            { roll: [7, 7], result: 'Expert form redirects momentum', type: 'success' },
            { roll: [8, 8], result: 'Flawless defense creates advantage', type: 'critical' }
        ]
    },
    defensivetechniques_trained_d10: {
        name: 'Trained Defensive Techniques (d10)',
        description: 'Trained defense on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Caught off-guard, armor dented', type: 'failure' },
            { roll: [2, 2], result: 'Defense wavers under heavy blow', type: 'failure' },
            { roll: [3, 3], result: 'Technique strained, partial deflection', type: 'failure' },
            { roll: [4, 4], result: 'Competent block, armor holds', type: 'normal' },
            { roll: [5, 5], result: 'Solid defense absorbs impact', type: 'normal' },
            { roll: [6, 6], result: 'Trained stance maintains stability', type: 'success' },
            { roll: [7, 7], result: 'Skillful parry redirects force', type: 'success' },
            { roll: [8, 8], result: 'Expert timing minimizes damage', type: 'success' },
            { roll: [9, 9], result: 'Disciplined form withstands pressure', type: 'success' },
            { roll: [10, 10], result: 'Perfect defensive execution', type: 'critical' }
        ]
    },
    defensivetechniques_trained_d12: {
        name: 'Trained Defensive Techniques (d12)',
        description: 'Trained defense on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Overwhelmed, armor cracks', type: 'failure' },
            { roll: [2, 2], result: 'Guard broken by superior force', type: 'failure' },
            { roll: [3, 3], result: 'Defense falters, lose ground', type: 'failure' },
            { roll: [4, 4], result: 'Technique strained, armor stressed', type: 'failure' },
            { roll: [5, 5], result: 'Barely hold position, heavy impact', type: 'normal' },
            { roll: [6, 6], result: 'Competent block under pressure', type: 'normal' },
            { roll: [7, 7], result: 'Solid defense absorbs brutal strike', type: 'normal' },
            { roll: [8, 8], result: 'Trained reflexes guide effective parry', type: 'success' },
            { roll: [9, 9], result: 'Skillful stance withstands assault', type: 'success' },
            { roll: [10, 10], result: 'Expert form redirects heavy blow', type: 'success' },
            { roll: [11, 11], result: 'Disciplined technique proves superior', type: 'success' },
            { roll: [12, 12], result: 'Masterful defense turns tide', type: 'critical' }
        ]
    },
    defensivetechniques_trained_d20: {
        name: 'Trained Defensive Techniques (d20)',
        description: 'Trained defense on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Outmatched, armor shattered', type: 'failure' },
            { roll: [2, 3], result: 'Defense obliterated by overwhelming power', type: 'failure' },
            { roll: [4, 5], result: 'Guard collapses under relentless assault', type: 'failure' },
            { roll: [6, 7], result: 'Armor fails against superior technique', type: 'failure' },
            { roll: [8, 9], result: 'Stance broken, forced backward', type: 'failure' },
            { roll: [10, 11], result: 'Desperate defense barely functional', type: 'normal' },
            { roll: [12, 13], result: 'Trained skills slow the assault', type: 'normal' },
            { roll: [14, 15], result: 'Competent technique absorbs punishment', type: 'normal' },
            { roll: [16, 16], result: 'Solid defense holds under duress', type: 'success' },
            { roll: [17, 17], result: 'Skillful parry finds opening', type: 'success' },
            { roll: [18, 18], result: 'Expert form withstands overwhelming odds', type: 'success' },
            { roll: [19, 19], result: 'Disciplined stance creates counter opportunity', type: 'success' },
            { roll: [20, 20], result: 'Flawless execution against impossible odds', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    defensivetechniques_apprentice_d4: {
        name: 'Apprentice Defensive Techniques (d4)',
        description: 'Apprentice defense on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Uncharacteristic slip, minor impact', type: 'failure' },
            { roll: [2, 2], result: 'Smooth deflection, effortless', type: 'normal' },
            { roll: [3, 3], result: 'Advanced technique, armor pristine', type: 'success' },
            { roll: [4, 4], result: 'Masterful parry, perfect control', type: 'success' }
        ]
    },
    defensivetechniques_apprentice_d6: {
        name: 'Apprentice Defensive Techniques (d6)',
        description: 'Apprentice defense on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Rare mistake, guard slips', type: 'failure' },
            { roll: [2, 2], result: 'Minor lapse, armor lightly stressed', type: 'failure' },
            { roll: [3, 3], result: 'Proficient block, damage minimized', type: 'normal' },
            { roll: [4, 4], result: 'Advanced defense holds strong', type: 'normal' },
            { roll: [5, 5], result: 'Expert parry redirects cleanly', type: 'success' },
            { roll: [6, 6], result: 'Masterful timing, flawless execution', type: 'success' }
        ]
    },
    defensivetechniques_apprentice_d8: {
        name: 'Apprentice Defensive Techniques (d8)',
        description: 'Apprentice defense on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Unexpected angle, blow lands', type: 'failure' },
            { roll: [2, 2], result: 'Technique challenged, armor stressed', type: 'failure' },
            { roll: [3, 3], result: 'Proficient defense absorbs strike', type: 'normal' },
            { roll: [4, 4], result: 'Advanced block maintains position', type: 'normal' },
            { roll: [5, 5], result: 'Expert parry deflects effectively', type: 'success' },
            { roll: [6, 6], result: 'Masterful form redirects momentum', type: 'success' },
            { roll: [7, 7], result: 'Superior technique dominates exchange', type: 'success' },
            { roll: [8, 8], result: 'Perfect defense creates tactical advantage', type: 'critical' }
        ]
    },
    defensivetechniques_apprentice_d10: {
        name: 'Apprentice Defensive Techniques (d10)',
        description: 'Apprentice defense on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Pressure breaks concentration, armor dented', type: 'failure' },
            { roll: [2, 2], result: 'Defense strained under heavy blow', type: 'failure' },
            { roll: [3, 3], result: 'Technique tested, partial deflection', type: 'failure' },
            { roll: [4, 4], result: 'Proficient block holds firm', type: 'normal' },
            { roll: [5, 5], result: 'Advanced defense absorbs impact', type: 'normal' },
            { roll: [6, 6], result: 'Expert stance maintains stability', type: 'success' },
            { roll: [7, 7], result: 'Masterful parry redirects force', type: 'success' },
            { roll: [8, 8], result: 'Superior timing minimizes damage', type: 'success' },
            { roll: [9, 9], result: 'Disciplined form withstands pressure', type: 'success' },
            { roll: [10, 10], result: 'Flawless defensive execution', type: 'critical' }
        ]
    },
    defensivetechniques_apprentice_d12: {
        name: 'Apprentice Defensive Techniques (d12)',
        description: 'Apprentice defense on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Overwhelmed by ferocity, armor cracks', type: 'failure' },
            { roll: [2, 2], result: 'Guard broken by exceptional force', type: 'failure' },
            { roll: [3, 3], result: 'Defense challenged, lose ground', type: 'failure' },
            { roll: [4, 4], result: 'Technique strained, armor stressed', type: 'failure' },
            { roll: [5, 5], result: 'Proficient block under heavy pressure', type: 'normal' },
            { roll: [6, 6], result: 'Advanced defense absorbs brutal strike', type: 'normal' },
            { roll: [7, 7], result: 'Expert reflexes guide effective parry', type: 'normal' },
            { roll: [8, 8], result: 'Masterful stance withstands assault', type: 'success' },
            { roll: [9, 9], result: 'Superior form redirects heavy blow', type: 'success' },
            { roll: [10, 10], result: 'Disciplined technique proves dominant', type: 'success' },
            { roll: [11, 11], result: 'Perfect execution under extreme pressure', type: 'success' },
            { roll: [12, 12], result: 'Exceptional defense creates opening', type: 'critical' }
        ]
    },
    defensivetechniques_apprentice_d20: {
        name: 'Apprentice Defensive Techniques (d20)',
        description: 'Apprentice defense on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Completely overwhelmed, armor shattered', type: 'failure' },
            { roll: [2, 3], result: 'Defense destroyed by overwhelming power', type: 'failure' },
            { roll: [4, 5], result: 'Guard collapses under relentless assault', type: 'failure' },
            { roll: [6, 7], result: 'Armor fails against superior force', type: 'failure' },
            { roll: [8, 9], result: 'Stance broken, forced backward', type: 'failure' },
            { roll: [10, 11], result: 'Proficient defense barely holds', type: 'normal' },
            { roll: [12, 13], result: 'Advanced skills slow the assault', type: 'normal' },
            { roll: [14, 15], result: 'Expert technique absorbs punishment', type: 'normal' },
            { roll: [16, 16], result: 'Masterful defense holds under duress', type: 'success' },
            { roll: [17, 17], result: 'Superior parry finds opening', type: 'success' },
            { roll: [18, 18], result: 'Disciplined form withstands overwhelming odds', type: 'success' },
            { roll: [19, 19], result: 'Perfect stance creates counter opportunity', type: 'success' },
            { roll: [20, 20], result: 'Exceptional execution against impossible odds', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    defensivetechniques_adept_d4: {
        name: 'Adept Defensive Techniques (d4)',
        description: 'Adept defense on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Extremely rare error, minimal damage', type: 'failure' },
            { roll: [2, 2], result: 'Effortless deflection, no strain', type: 'normal' },
            { roll: [3, 3], result: 'Superior technique, armor untouched', type: 'success' },
            { roll: [4, 4], result: 'Flawless parry, absolute control', type: 'success' }
        ]
    },
    defensivetechniques_adept_d6: {
        name: 'Adept Defensive Techniques (d6)',
        description: 'Adept defense on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Unusual lapse, guard slips', type: 'failure' },
            { roll: [2, 2], result: 'Minor error, armor lightly stressed', type: 'failure' },
            { roll: [3, 3], result: 'Masterful block, damage negated', type: 'normal' },
            { roll: [4, 4], result: 'Superior defense, effortless', type: 'normal' },
            { roll: [5, 5], result: 'Perfect parry, complete control', type: 'success' },
            { roll: [6, 6], result: 'Exceptional timing, flawless form', type: 'success' }
        ]
    },
    defensivetechniques_adept_d8: {
        name: 'Adept Defensive Techniques (d8)',
        description: 'Adept defense on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Rare misjudgment, blow connects', type: 'failure' },
            { roll: [2, 2], result: 'Technique challenged, armor stressed', type: 'failure' },
            { roll: [3, 3], result: 'Masterful defense absorbs strike', type: 'normal' },
            { roll: [4, 4], result: 'Superior block maintains position', type: 'normal' },
            { roll: [5, 5], result: 'Perfect parry deflects cleanly', type: 'success' },
            { roll: [6, 6], result: 'Exceptional form redirects momentum', type: 'success' },
            { roll: [7, 7], result: 'Dominant technique controls exchange', type: 'success' },
            { roll: [8, 8], result: 'Flawless defense creates tactical superiority', type: 'critical' }
        ]
    },
    defensivetechniques_adept_d10: {
        name: 'Adept Defensive Techniques (d10)',
        description: 'Adept defense on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Intense pressure breaks focus, armor dented', type: 'failure' },
            { roll: [2, 2], result: 'Defense strained under exceptional blow', type: 'failure' },
            { roll: [3, 3], result: 'Technique tested, partial deflection', type: 'failure' },
            { roll: [4, 4], result: 'Masterful block holds firm', type: 'normal' },
            { roll: [5, 5], result: 'Superior defense absorbs impact', type: 'normal' },
            { roll: [6, 6], result: 'Perfect stance maintains stability', type: 'success' },
            { roll: [7, 7], result: 'Exceptional parry redirects force', type: 'success' },
            { roll: [8, 8], result: 'Dominant timing minimizes damage', type: 'success' },
            { roll: [9, 9], result: 'Disciplined form withstands heavy pressure', type: 'success' },
            { roll: [10, 10], result: 'Absolute defensive mastery', type: 'critical' }
        ]
    },
    defensivetechniques_adept_d12: {
        name: 'Adept Defensive Techniques (d12)',
        description: 'Adept defense on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Overwhelmed by savage force, armor cracks', type: 'failure' },
            { roll: [2, 2], result: 'Guard broken by overwhelming power', type: 'failure' },
            { roll: [3, 3], result: 'Defense challenged severely, lose ground', type: 'failure' },
            { roll: [4, 4], result: 'Technique strained, armor stressed', type: 'failure' },
            { roll: [5, 5], result: 'Masterful block under extreme pressure', type: 'normal' },
            { roll: [6, 6], result: 'Superior defense absorbs brutal strike', type: 'normal' },
            { roll: [7, 7], result: 'Perfect reflexes guide effective parry', type: 'normal' },
            { roll: [8, 8], result: 'Exceptional stance withstands assault', type: 'success' },
            { roll: [9, 9], result: 'Dominant form redirects heavy blow', type: 'success' },
            { roll: [10, 10], result: 'Disciplined technique proves superior', type: 'success' },
            { roll: [11, 11], result: 'Flawless execution under brutal pressure', type: 'success' },
            { roll: [12, 12], result: 'Masterful defense turns assault into advantage', type: 'critical' }
        ]
    },
    defensivetechniques_adept_d20: {
        name: 'Adept Defensive Techniques (d20)',
        description: 'Adept defense on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Utterly overwhelmed, armor shattered', type: 'failure' },
            { roll: [2, 3], result: 'Defense destroyed by catastrophic power', type: 'failure' },
            { roll: [4, 5], result: 'Guard collapses under merciless assault', type: 'failure' },
            { roll: [6, 7], result: 'Armor fails against devastating force', type: 'failure' },
            { roll: [8, 9], result: 'Stance broken, driven backward', type: 'failure' },
            { roll: [10, 11], result: 'Masterful defense barely holds', type: 'normal' },
            { roll: [12, 13], result: 'Superior skills slow the onslaught', type: 'normal' },
            { roll: [14, 15], result: 'Perfect technique absorbs punishment', type: 'normal' },
            { roll: [16, 16], result: 'Exceptional defense holds under duress', type: 'success' },
            { roll: [17, 17], result: 'Dominant parry finds opening', type: 'success' },
            { roll: [18, 18], result: 'Disciplined form withstands impossible odds', type: 'success' },
            { roll: [19, 19], result: 'Flawless stance creates counter opportunity', type: 'success' },
            { roll: [20, 20], result: 'Absolute mastery against overwhelming force', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    defensivetechniques_expert_d4: {
        name: 'Expert Defensive Techniques (d4)',
        description: 'Expert defense on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Nearly impossible error, trivial damage', type: 'failure' },
            { roll: [2, 2], result: 'Effortless deflection, perfect economy', type: 'normal' },
            { roll: [3, 3], result: 'Masterful technique, armor pristine', type: 'success' },
            { roll: [4, 4], result: 'Absolute parry, total control', type: 'success' }
        ]
    },
    defensivetechniques_expert_d6: {
        name: 'Expert Defensive Techniques (d6)',
        description: 'Expert defense on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Exceptional lapse, guard slips', type: 'failure' },
            { roll: [2, 2], result: 'Rare error, armor lightly stressed', type: 'failure' },
            { roll: [3, 3], result: 'Perfect block, damage nullified', type: 'normal' },
            { roll: [4, 4], result: 'Masterful defense, no effort', type: 'normal' },
            { roll: [5, 5], result: 'Flawless parry, absolute precision', type: 'success' },
            { roll: [6, 6], result: 'Supreme timing, perfect execution', type: 'success' }
        ]
    },
    defensivetechniques_expert_d8: {
        name: 'Expert Defensive Techniques (d8)',
        description: 'Expert defense on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Unusual misjudgment, blow connects', type: 'failure' },
            { roll: [2, 2], result: 'Technique challenged, armor stressed', type: 'failure' },
            { roll: [3, 3], result: 'Perfect defense absorbs strike', type: 'normal' },
            { roll: [4, 4], result: 'Masterful block maintains position', type: 'normal' },
            { roll: [5, 5], result: 'Flawless parry deflects cleanly', type: 'success' },
            { roll: [6, 6], result: 'Supreme form redirects momentum', type: 'success' },
            { roll: [7, 7], result: 'Absolute technique dominates exchange', type: 'success' },
            { roll: [8, 8], result: 'Perfect defense creates overwhelming advantage', type: 'critical' }
        ]
    },
    defensivetechniques_expert_d10: {
        name: 'Expert Defensive Techniques (d10)',
        description: 'Expert defense on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Extreme pressure breaks focus, armor dented', type: 'failure' },
            { roll: [2, 2], result: 'Defense strained under devastating blow', type: 'failure' },
            { roll: [3, 3], result: 'Technique tested severely, partial deflection', type: 'failure' },
            { roll: [4, 4], result: 'Perfect block holds firm', type: 'normal' },
            { roll: [5, 5], result: 'Masterful defense absorbs impact', type: 'normal' },
            { roll: [6, 6], result: 'Flawless stance maintains stability', type: 'success' },
            { roll: [7, 7], result: 'Supreme parry redirects force', type: 'success' },
            { roll: [8, 8], result: 'Absolute timing minimizes damage', type: 'success' },
            { roll: [9, 9], result: 'Disciplined form withstands extreme pressure', type: 'success' },
            { roll: [10, 10], result: 'Total defensive mastery', type: 'critical' }
        ]
    },
    defensivetechniques_expert_d12: {
        name: 'Expert Defensive Techniques (d12)',
        description: 'Expert defense on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Overwhelmed by monstrous force, armor cracks', type: 'failure' },
            { roll: [2, 2], result: 'Guard broken by catastrophic power', type: 'failure' },
            { roll: [3, 3], result: 'Defense challenged brutally, lose ground', type: 'failure' },
            { roll: [4, 4], result: 'Technique strained severely, armor stressed', type: 'failure' },
            { roll: [5, 5], result: 'Perfect block under devastating pressure', type: 'normal' },
            { roll: [6, 6], result: 'Masterful defense absorbs savage strike', type: 'normal' },
            { roll: [7, 7], result: 'Flawless reflexes guide effective parry', type: 'normal' },
            { roll: [8, 8], result: 'Supreme stance withstands brutal assault', type: 'success' },
            { roll: [9, 9], result: 'Absolute form redirects crushing blow', type: 'success' },
            { roll: [10, 10], result: 'Disciplined technique proves dominant', type: 'success' },
            { roll: [11, 11], result: 'Perfect execution under extreme pressure', type: 'success' },
            { roll: [12, 12], result: 'Masterful defense transforms assault into victory', type: 'critical' }
        ]
    },
    defensivetechniques_expert_d20: {
        name: 'Expert Defensive Techniques (d20)',
        description: 'Expert defense on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Completely overwhelmed, armor obliterated', type: 'failure' },
            { roll: [2, 3], result: 'Defense annihilated by apocalyptic power', type: 'failure' },
            { roll: [4, 5], result: 'Guard collapses under unstoppable assault', type: 'failure' },
            { roll: [6, 7], result: 'Armor fails against world-breaking force', type: 'failure' },
            { roll: [8, 9], result: 'Stance shattered, driven backward', type: 'failure' },
            { roll: [10, 11], result: 'Perfect defense barely holds', type: 'normal' },
            { roll: [12, 13], result: 'Masterful skills slow the devastation', type: 'normal' },
            { roll: [14, 15], result: 'Flawless technique absorbs punishment', type: 'normal' },
            { roll: [16, 16], result: 'Supreme defense holds under duress', type: 'success' },
            { roll: [17, 17], result: 'Absolute parry finds opening', type: 'success' },
            { roll: [18, 18], result: 'Disciplined form withstands impossible force', type: 'success' },
            { roll: [19, 19], result: 'Perfect stance creates counter opportunity', type: 'success' },
            { roll: [20, 20], result: 'Total mastery against unstoppable power', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    defensivetechniques_master_d4: {
        name: 'Master Defensive Techniques (d4)',
        description: 'Master defense on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Inconceivable error, negligible damage', type: 'failure' },
            { roll: [2, 2], result: 'Effortless deflection, absolute economy', type: 'normal' },
            { roll: [3, 3], result: 'Legendary technique, armor untouched', type: 'success' },
            { roll: [4, 4], result: 'Perfect parry, complete mastery', type: 'success' }
        ]
    },
    defensivetechniques_master_d6: {
        name: 'Master Defensive Techniques (d6)',
        description: 'Master defense on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Impossible lapse, guard slips', type: 'failure' },
            { roll: [2, 2], result: 'Unthinkable error, armor lightly stressed', type: 'failure' },
            { roll: [3, 3], result: 'Absolute block, damage erased', type: 'normal' },
            { roll: [4, 4], result: 'Legendary defense, effortless', type: 'normal' },
            { roll: [5, 5], result: 'Perfect parry, supreme precision', type: 'success' },
            { roll: [6, 6], result: 'Transcendent timing, flawless form', type: 'success' }
        ]
    },
    defensivetechniques_master_d8: {
        name: 'Master Defensive Techniques (d8)',
        description: 'Master defense on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Rare misjudgment, blow connects', type: 'failure' },
            { roll: [2, 2], result: 'Technique challenged, armor stressed', type: 'failure' },
            { roll: [3, 3], result: 'Absolute defense absorbs strike', type: 'normal' },
            { roll: [4, 4], result: 'Legendary block maintains position', type: 'normal' },
            { roll: [5, 5], result: 'Perfect parry deflects cleanly', type: 'success' },
            { roll: [6, 6], result: 'Transcendent form redirects momentum', type: 'success' },
            { roll: [7, 7], result: 'Supreme technique dominates exchange', type: 'success' },
            { roll: [8, 8], result: 'Flawless defense creates absolute advantage', type: 'critical' }
        ]
    },
    defensivetechniques_master_d10: {
        name: 'Master Defensive Techniques (d10)',
        description: 'Master defense on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Overwhelming pressure breaks focus, armor dented', type: 'failure' },
            { roll: [2, 2], result: 'Defense strained under catastrophic blow', type: 'failure' },
            { roll: [3, 3], result: 'Technique tested brutally, partial deflection', type: 'failure' },
            { roll: [4, 4], result: 'Absolute block holds firm', type: 'normal' },
            { roll: [5, 5], result: 'Legendary defense absorbs impact', type: 'normal' },
            { roll: [6, 6], result: 'Perfect stance maintains stability', type: 'success' },
            { roll: [7, 7], result: 'Transcendent parry redirects force', type: 'success' },
            { roll: [8, 8], result: 'Supreme timing minimizes damage', type: 'success' },
            { roll: [9, 9], result: 'Disciplined form withstands devastating pressure', type: 'success' },
            { roll: [10, 10], result: 'Complete defensive mastery', type: 'critical' }
        ]
    },
    defensivetechniques_master_d12: {
        name: 'Master Defensive Techniques (d12)',
        description: 'Master defense on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Overwhelmed by titanic force, armor cracks', type: 'failure' },
            { roll: [2, 2], result: 'Guard broken by apocalyptic power', type: 'failure' },
            { roll: [3, 3], result: 'Defense challenged savagely, lose ground', type: 'failure' },
            { roll: [4, 4], result: 'Technique strained brutally, armor stressed', type: 'failure' },
            { roll: [5, 5], result: 'Absolute block under crushing pressure', type: 'normal' },
            { roll: [6, 6], result: 'Legendary defense absorbs devastating strike', type: 'normal' },
            { roll: [7, 7], result: 'Perfect reflexes guide effective parry', type: 'normal' },
            { roll: [8, 8], result: 'Transcendent stance withstands savage assault', type: 'success' },
            { roll: [9, 9], result: 'Supreme form redirects annihilating blow', type: 'success' },
            { roll: [10, 10], result: 'Disciplined technique proves absolute', type: 'success' },
            { roll: [11, 11], result: 'Flawless execution under impossible pressure', type: 'success' },
            { roll: [12, 12], result: 'Legendary defense transforms devastation into triumph', type: 'critical' }
        ]
    },
    defensivetechniques_master_d20: {
        name: 'Master Defensive Techniques (d20)',
        description: 'Master defense on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Utterly overwhelmed, armor annihilated', type: 'failure' },
            { roll: [2, 3], result: 'Defense destroyed by god-like power', type: 'failure' },
            { roll: [4, 5], result: 'Guard collapses under reality-breaking assault', type: 'failure' },
            { roll: [6, 7], result: 'Armor fails against world-ending force', type: 'failure' },
            { roll: [8, 9], result: 'Stance obliterated, driven backward', type: 'failure' },
            { roll: [10, 11], result: 'Absolute defense barely holds', type: 'normal' },
            { roll: [12, 13], result: 'Legendary skills slow the annihilation', type: 'normal' },
            { roll: [14, 15], result: 'Perfect technique absorbs punishment', type: 'normal' },
            { roll: [16, 16], result: 'Transcendent defense holds under duress', type: 'success' },
            { roll: [17, 17], result: 'Supreme parry finds opening', type: 'success' },
            { roll: [18, 18], result: 'Disciplined form withstands apocalyptic force', type: 'success' },
            { roll: [19, 19], result: 'Perfect stance creates counter opportunity', type: 'success' },
            { roll: [20, 20], result: 'Legendary mastery against impossible power', type: 'critical' }
        ]
    }
};

