// Weapon Mastery Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total
// Each result includes outcomes for Piercing, Slashing, and Bludgeoning damage types
// Triggered when performing special attacks or creative combat maneuvers

export const WEAPON_MASTERY_TABLES = {
    // UNTRAINED - d4 through d20
    weaponmastery_untrained_d4: {
        name: 'Untrained Weapon Mastery (d4)',
        description: 'Untrained weapon use on a very easy maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: '• Piercing: Blade catches in guard, weapon stuck\n• Slashing: Wild swing throws you off balance\n• Bludgeoning: Overswing causes you to stumble forward', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Shallow thrust with poor form\n• Slashing: Weak cut with incorrect angle\n• Bludgeoning: Glancing blow with minimal impact', type: 'normal' },
            { roll: [3, 3], result: '• Piercing: Decent thrust finds soft tissue\n• Slashing: Clean cut with acceptable form\n• Bludgeoning: Solid strike with good follow-through', type: 'success' },
            { roll: [4, 4], result: '• Piercing: Lucky thrust slips between ribs\n• Slashing: Fortunate arc catches exposed area\n• Bludgeoning: Heavy blow staggers opponent', type: 'success' }
        ]
    },
    weaponmastery_untrained_d6: {
        name: 'Untrained Weapon Mastery (d6)',
        description: 'Untrained weapon use on an easy maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: '• Piercing: Point drags on ground, lose grip\n• Slashing: Edge turns, weapon nearly flies free\n• Bludgeoning: Miss entirely, weapon rebounds painfully', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Hesitant jab telegraphs intent\n• Slashing: Tentative swing lacks commitment\n• Bludgeoning: Weak strike with poor timing', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Awkward thrust with uncertain aim\n• Slashing: Choppy cut with inconsistent power\n• Bludgeoning: Clumsy swing connects poorly', type: 'normal' },
            { roll: [4, 4], result: '• Piercing: Basic thrust reaches target\n• Slashing: Simple cut lands as intended\n• Bludgeoning: Straightforward strike makes contact', type: 'normal' },
            { roll: [5, 5], result: '• Piercing: Determined thrust penetrates defenses\n• Slashing: Committed swing finds opening\n• Bludgeoning: Forceful blow breaks through guard', type: 'success' },
            { roll: [6, 6], result: '• Piercing: Instinctive thrust exploits gap\n• Slashing: Natural motion catches opponent off-guard\n• Bludgeoning: Powerful strike disrupts stance', type: 'success' }
        ]
    },
    weaponmastery_untrained_d8: {
        name: 'Untrained Weapon Mastery (d8)',
        description: 'Untrained weapon use on a moderate maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: '• Piercing: Blade snaps on bone, weapon damaged\n• Slashing: Edge catches armor, wrenches wrist\n• Bludgeoning: Head strikes shield, numbs hand', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Thrust deflected, leaves you exposed\n• Slashing: Swing parried, weapon pulled wide\n• Bludgeoning: Strike blocked, recoil staggers you', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Nervous jab lacks penetration\n• Slashing: Fearful cut has no conviction\n• Bludgeoning: Timid swing bounces off target', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Uncertain thrust barely scratches\n• Slashing: Wavering cut grazes surface\n• Bludgeoning: Hesitant strike taps armor', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Crude thrust makes shallow wound\n• Slashing: Rough cut opens minor gash\n• Bludgeoning: Basic strike causes light bruising', type: 'normal' },
            { roll: [6, 6], result: '• Piercing: Straightforward jab pierces flesh\n• Slashing: Direct swing cuts cleanly\n• Bludgeoning: Simple blow lands solidly', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Focused thrust drives deep\n• Slashing: Deliberate cut slices through\n• Bludgeoning: Concentrated strike impacts hard', type: 'success' },
            { roll: [8, 8], result: '• Piercing: Desperate lunge finds vital area\n• Slashing: Frantic swing catches artery\n• Bludgeoning: Wild strike cracks bone', type: 'success' }
        ]
    },
    weaponmastery_untrained_d10: {
        name: 'Untrained Weapon Mastery (d10)',
        description: 'Untrained weapon use on a challenging maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: '• Piercing: Weapon lodges in shield, disarmed\n• Slashing: Blade binds in armor, yanked from grip\n• Bludgeoning: Weapon catches on obstacle, torn away', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Thrust parried into own leg, 1d4 damage\n• Slashing: Swing redirected into ally nearby\n• Bludgeoning: Strike deflected into own knee', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Point skitters off armor uselessly\n• Slashing: Edge slides off without cutting\n• Bludgeoning: Head glances off without force', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Weak jab fails to penetrate\n• Slashing: Feeble cut barely marks surface\n• Bludgeoning: Soft blow has no effect', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Panicked thrust goes wide\n• Slashing: Rushed swing misses completely\n• Bludgeoning: Hurried strike finds only air', type: 'failure' },
            { roll: [6, 6], result: '• Piercing: Clumsy jab scratches lightly\n• Slashing: Awkward cut nicks skin\n• Bludgeoning: Ungainly blow taps target', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Unrefined thrust punctures shallowly\n• Slashing: Crude swing opens surface wound\n• Bludgeoning: Rough strike bruises moderately', type: 'normal' },
            { roll: [8, 8], result: '• Piercing: Lucky thrust slips past guard\n• Slashing: Fortunate cut finds exposed flesh\n• Bludgeoning: Chance blow strikes vulnerable spot', type: 'success' },
            { roll: [9, 9], result: '• Piercing: Unexpected angle pierces deeply\n• Slashing: Surprising arc cuts through defenses\n• Bludgeoning: Unanticipated strike breaks guard', type: 'success' },
            { roll: [10, 10], result: '• Piercing: Miraculous thrust finds heart\n• Slashing: Impossible swing severs artery\n• Bludgeoning: Incredible blow fractures skull', type: 'critical' }
        ]
    },
    weaponmastery_untrained_d12: {
        name: 'Untrained Weapon Mastery (d12)',
        description: 'Untrained weapon use on a difficult maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: '• Piercing: Blade shatters on impact, unarmed\n• Slashing: Edge chips badly, weapon ruined\n• Bludgeoning: Haft splinters, weapon breaks', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Thrust countered, stabbed by own blade\n• Slashing: Swing reversed, cut by own edge\n• Bludgeoning: Strike turned, hit by own weapon', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Point bends on armor, weapon useless\n• Slashing: Edge dulls completely, no longer cuts\n• Bludgeoning: Head loosens, weapon unsafe', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Thrust blocked, arm wrenched painfully\n• Slashing: Swing parried, shoulder twisted\n• Bludgeoning: Strike deflected, wrist sprained', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Jab intercepted, weapon trapped\n• Slashing: Cut caught, blade held fast\n• Bludgeoning: Blow stopped, weapon seized', type: 'failure' },
            { roll: [6, 6], result: '• Piercing: Thrust misses, overextends dangerously\n• Slashing: Swing fails, spins you around\n• Bludgeoning: Strike whiffs, pulls you off balance', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Weak jab barely penetrates padding\n• Slashing: Feeble cut scratches armor only\n• Bludgeoning: Soft blow rattles plate harmlessly', type: 'normal' },
            { roll: [8, 8], result: '• Piercing: Uncertain thrust finds gap in armor\n• Slashing: Wavering cut slips past defense\n• Bludgeoning: Hesitant strike sneaks through guard', type: 'normal' },
            { roll: [9, 9], result: '• Piercing: Desperate lunge pierces leather\n• Slashing: Frantic swing cuts through cloth\n• Bludgeoning: Wild strike dents metal', type: 'success' },
            { roll: [10, 10], result: '• Piercing: Reckless thrust drives through chainmail\n• Slashing: Heedless cut cleaves through straps\n• Bludgeoning: Careless blow buckles plate', type: 'success' },
            { roll: [11, 11], result: '• Piercing: Instinctive jab finds joint in armor\n• Slashing: Natural swing catches unprotected limb\n• Bludgeoning: Intuitive strike hits helmet seam', type: 'success' },
            { roll: [12, 12], result: '• Piercing: Impossible thrust pierces eye slit\n• Slashing: Unbelievable cut severs tendon\n• Bludgeoning: Inconceivable blow shatters collarbone', type: 'critical' }
        ]
    },
    weaponmastery_untrained_d20: {
        name: 'Untrained Weapon Mastery (d20)',
        description: 'Untrained weapon use on a very difficult maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: '• Piercing: Weapon explodes on impact, 1d6 shrapnel damage to self\n• Slashing: Blade shatters, fragments injure nearby allies\n• Bludgeoning: Haft disintegrates, splinters embed in hand', type: 'failure' },
            { roll: [2, 3], result: '• Piercing: Thrust reversed completely, impale self\n• Slashing: Swing turned fully, slash own body\n• Bludgeoning: Strike redirected, crush own foot', type: 'failure' },
            { roll: [4, 5], result: '• Piercing: Point catches on armor, weapon wrenched away violently\n• Slashing: Edge binds in shield, shoulder dislocated\n• Bludgeoning: Head stuck in obstacle, elbow hyperextended', type: 'failure' },
            { roll: [6, 7], result: '• Piercing: Thrust intercepted, riposted into chest\n• Slashing: Swing caught, countered across face\n• Bludgeoning: Strike blocked, returned to ribs', type: 'failure' },
            { roll: [8, 9], result: '• Piercing: Jab deflected wide, stumble into danger\n• Slashing: Cut parried aside, fall into hazard\n• Bludgeoning: Blow turned away, trip over terrain', type: 'failure' },
            { roll: [10, 11], result: '• Piercing: Weak thrust bounces off harmlessly\n• Slashing: Feeble swing glances off uselessly\n• Bludgeoning: Soft strike rebounds without effect', type: 'failure' },
            { roll: [12, 13], result: '• Piercing: Uncertain jab scratches surface only\n• Slashing: Wavering cut marks armor lightly\n• Bludgeoning: Hesitant blow taps plate gently', type: 'failure' },
            { roll: [14, 15], result: '• Piercing: Crude thrust makes shallow puncture\n• Slashing: Rough cut opens minor wound\n• Bludgeoning: Basic strike causes light bruise', type: 'normal' },
            { roll: [16, 17], result: '• Piercing: Lucky jab slips through defense\n• Slashing: Fortunate swing finds opening\n• Bludgeoning: Chance blow breaks through guard', type: 'success' },
            { roll: [18, 18], result: '• Piercing: Unexpected thrust pierces vital organ\n• Slashing: Surprising cut severs major vessel\n• Bludgeoning: Unanticipated blow fractures spine', type: 'critical' },
            { roll: [19, 19], result: '• Piercing: Miraculous lunge penetrates heart\n• Slashing: Impossible swing decapitates cleanly\n• Bludgeoning: Incredible strike crushes skull', type: 'critical' },
            { roll: [20, 20], result: '• Piercing: Divine thrust pierces all armor to heart\n• Slashing: Legendary cut cleaves through bone\n• Bludgeoning: Mythic blow pulverizes ribcage', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    weaponmastery_novice_d4: {
        name: 'Novice Weapon Mastery (d4)',
        description: 'Novice weapon use on a very easy maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: '• Piercing: Overconfident thrust leaves opening\n• Slashing: Eager swing exposes flank\n• Bludgeoning: Hasty strike pulls you forward', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Adequate thrust with basic form\n• Slashing: Acceptable cut with decent technique\n• Bludgeoning: Passable strike with fair execution', type: 'normal' },
            { roll: [3, 3], result: '• Piercing: Practiced thrust finds target reliably\n• Slashing: Trained swing cuts with confidence\n• Bludgeoning: Drilled strike lands with certainty', type: 'success' },
            { roll: [4, 4], result: '• Piercing: Precise jab exploits obvious weakness\n• Slashing: Controlled arc catches exposed area\n• Bludgeoning: Measured blow strikes vulnerable point', type: 'success' }
        ]
    },
    weaponmastery_novice_d6: {
        name: 'Novice Weapon Mastery (d6)',
        description: 'Novice weapon use on an easy maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: '• Piercing: Mistimed thrust meets counterattack\n• Slashing: Poorly timed swing invites riposte\n• Bludgeoning: Bad timing leaves you open', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Tentative jab lacks conviction\n• Slashing: Uncertain cut wavers mid-swing\n• Bludgeoning: Doubtful strike loses momentum', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Basic thrust connects adequately\n• Slashing: Simple swing lands acceptably\n• Bludgeoning: Standard strike hits decently', type: 'normal' },
            { roll: [4, 4], result: '• Piercing: Solid jab penetrates cleanly\n• Slashing: Firm cut slices through\n• Bludgeoning: Strong blow impacts solidly', type: 'normal' },
            { roll: [5, 5], result: '• Piercing: Confident thrust drives deep\n• Slashing: Assured swing cuts decisively\n• Bludgeoning: Certain strike lands heavily', type: 'success' },
            { roll: [6, 6], result: '• Piercing: Skilled jab finds gap in defense\n• Slashing: Practiced cut exploits opening\n• Bludgeoning: Trained blow breaks through guard', type: 'success' }
        ]
    },
    weaponmastery_novice_d8: {
        name: 'Novice Weapon Mastery (d8)',
        description: 'Novice weapon use on a moderate maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: '• Piercing: Thrust caught, weapon twisted from hand\n• Slashing: Swing trapped, blade wrenched away\n• Bludgeoning: Strike seized, weapon pulled free', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Jab parried, leaves you exposed\n• Slashing: Cut deflected, opens your guard\n• Bludgeoning: Blow blocked, creates vulnerability', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Hesitant thrust lacks force\n• Slashing: Uncertain swing loses power\n• Bludgeoning: Doubtful strike weakens mid-motion', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Weak jab scratches lightly\n• Slashing: Feeble cut grazes surface\n• Bludgeoning: Soft blow taps gently', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Adequate thrust punctures shallowly\n• Slashing: Decent cut opens minor wound\n• Bludgeoning: Fair strike causes light bruising', type: 'normal' },
            { roll: [6, 6], result: '• Piercing: Solid jab pierces flesh\n• Slashing: Firm swing cuts cleanly\n• Bludgeoning: Strong blow lands solidly', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Practiced thrust drives deep\n• Slashing: Trained cut slices through\n• Bludgeoning: Drilled strike impacts hard', type: 'success' },
            { roll: [8, 8], result: '• Piercing: Precise jab finds vital spot\n• Slashing: Controlled arc severs artery\n• Bludgeoning: Measured blow cracks bone', type: 'success' }
        ]
    },
    weaponmastery_novice_d10: {
        name: 'Novice Weapon Mastery (d10)',
        description: 'Novice weapon use on a challenging maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: '• Piercing: Blade binds in armor, disarmed\n• Slashing: Edge catches shield, yanked away\n• Bludgeoning: Head lodges in obstacle, torn free', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Thrust redirected into own thigh\n• Slashing: Swing turned into nearby ally\n• Bludgeoning: Strike deflected into own shin', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Point slides off armor\n• Slashing: Edge glances off plate\n• Bludgeoning: Head bounces off shield', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Weak jab fails to penetrate\n• Slashing: Feeble cut barely marks\n• Bludgeoning: Soft blow has no effect', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Rushed thrust goes wide\n• Slashing: Hurried swing misses\n• Bludgeoning: Hasty strike finds air', type: 'failure' },
            { roll: [6, 6], result: '• Piercing: Basic jab scratches lightly\n• Slashing: Simple cut nicks skin\n• Bludgeoning: Standard blow taps target', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Adequate thrust punctures shallowly\n• Slashing: Decent swing opens surface wound\n• Bludgeoning: Fair strike bruises moderately', type: 'normal' },
            { roll: [8, 8], result: '• Piercing: Practiced jab slips past guard\n• Slashing: Trained cut finds exposed flesh\n• Bludgeoning: Drilled blow strikes vulnerable spot', type: 'success' },
            { roll: [9, 9], result: '• Piercing: Skilled thrust pierces deeply\n• Slashing: Controlled arc cuts through defenses\n• Bludgeoning: Measured strike breaks guard', type: 'success' },
            { roll: [10, 10], result: '• Piercing: Precise lunge finds heart\n• Slashing: Perfect swing severs artery\n• Bludgeoning: Exact blow fractures skull', type: 'critical' }
        ]
    },
    weaponmastery_novice_d12: {
        name: 'Novice Weapon Mastery (d12)',
        description: 'Novice weapon use on a difficult maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: '• Piercing: Blade chips on impact, damaged\n• Slashing: Edge notches badly, impaired\n• Bludgeoning: Haft cracks, weakened', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Thrust countered, stabbed in arm\n• Slashing: Swing reversed, cut across chest\n• Bludgeoning: Strike turned, hit in ribs', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Point bends slightly, less effective\n• Slashing: Edge dulls noticeably, cuts poorly\n• Bludgeoning: Head loosens, strikes weakly', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Thrust blocked, arm strained\n• Slashing: Swing parried, shoulder aches\n• Bludgeoning: Strike deflected, wrist hurts', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Jab intercepted, weapon held\n• Slashing: Cut caught, blade trapped\n• Bludgeoning: Blow stopped, weapon seized', type: 'failure' },
            { roll: [6, 6], result: '• Piercing: Thrust misses, overextends\n• Slashing: Swing fails, spins you\n• Bludgeoning: Strike whiffs, pulls you forward', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Weak jab penetrates padding\n• Slashing: Feeble cut scratches armor\n• Bludgeoning: Soft blow rattles plate', type: 'normal' },
            { roll: [8, 8], result: '• Piercing: Basic thrust finds gap\n• Slashing: Simple cut slips past defense\n• Bludgeoning: Standard strike sneaks through', type: 'normal' },
            { roll: [9, 9], result: '• Piercing: Practiced lunge pierces leather\n• Slashing: Trained swing cuts through cloth\n• Bludgeoning: Drilled strike dents metal', type: 'success' },
            { roll: [10, 10], result: '• Piercing: Skilled thrust drives through chainmail\n• Slashing: Controlled cut cleaves through straps\n• Bludgeoning: Measured blow buckles plate', type: 'success' },
            { roll: [11, 11], result: '• Piercing: Precise jab finds joint in armor\n• Slashing: Perfect swing catches unprotected limb\n• Bludgeoning: Exact strike hits helmet seam', type: 'success' },
            { roll: [12, 12], result: '• Piercing: Masterful thrust pierces eye slit\n• Slashing: Expert cut severs tendon\n• Bludgeoning: Flawless blow shatters collarbone', type: 'critical' }
        ]
    },
    weaponmastery_novice_d20: {
        name: 'Novice Weapon Mastery (d20)',
        description: 'Novice weapon use on a very difficult maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: '• Piercing: Weapon breaks on impact, 1d4 shrapnel damage\n• Slashing: Blade shatters, fragments hit nearby\n• Bludgeoning: Haft splinters, shards embed in hand', type: 'failure' },
            { roll: [2, 3], result: '• Piercing: Thrust fully reversed, impale self\n• Slashing: Swing completely turned, slash own body\n• Bludgeoning: Strike redirected, crush own foot', type: 'failure' },
            { roll: [4, 5], result: '• Piercing: Point catches, weapon wrenched away\n• Slashing: Edge binds, shoulder strained\n• Bludgeoning: Head stuck, elbow twisted', type: 'failure' },
            { roll: [6, 7], result: '• Piercing: Thrust intercepted, riposted\n• Slashing: Swing caught, countered\n• Bludgeoning: Strike blocked, returned', type: 'failure' },
            { roll: [8, 9], result: '• Piercing: Jab deflected, stumble\n• Slashing: Cut parried, trip\n• Bludgeoning: Blow turned, fall', type: 'failure' },
            { roll: [10, 11], result: '• Piercing: Weak thrust bounces off\n• Slashing: Feeble swing glances off\n• Bludgeoning: Soft strike rebounds', type: 'failure' },
            { roll: [12, 13], result: '• Piercing: Basic jab scratches surface\n• Slashing: Simple cut marks armor\n• Bludgeoning: Standard blow taps plate', type: 'failure' },
            { roll: [14, 15], result: '• Piercing: Adequate thrust makes shallow puncture\n• Slashing: Decent cut opens minor wound\n• Bludgeoning: Fair strike causes light bruise', type: 'normal' },
            { roll: [16, 17], result: '• Piercing: Practiced jab slips through defense\n• Slashing: Trained swing finds opening\n• Bludgeoning: Drilled blow breaks through guard', type: 'success' },
            { roll: [18, 18], result: '• Piercing: Skilled thrust pierces vital organ\n• Slashing: Controlled cut severs major vessel\n• Bludgeoning: Measured blow fractures spine', type: 'critical' },
            { roll: [19, 19], result: '• Piercing: Precise lunge penetrates heart\n• Slashing: Perfect swing decapitates cleanly\n• Bludgeoning: Exact strike crushes skull', type: 'critical' },
            { roll: [20, 20], result: '• Piercing: Flawless thrust pierces all armor to heart\n• Slashing: Masterful cut cleaves through bone\n• Bludgeoning: Expert blow pulverizes ribcage', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    weaponmastery_trained_d4: {
        name: 'Trained Weapon Mastery (d4)',
        description: 'Trained weapon use on a very easy maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: '• Piercing: Routine thrust becomes predictable, countered\n• Slashing: Textbook swing telegraphed, parried\n• Bludgeoning: By-the-book strike anticipated, blocked', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Competent thrust with proper form\n• Slashing: Proficient cut with correct technique\n• Bludgeoning: Capable strike with sound execution', type: 'normal' },
            { roll: [3, 3], result: '• Piercing: Trained thrust finds target efficiently\n• Slashing: Practiced swing cuts with precision\n• Bludgeoning: Drilled strike lands with accuracy', type: 'success' },
            { roll: [4, 4], result: '• Piercing: Refined jab exploits defensive flaw\n• Slashing: Polished arc catches weak point\n• Bludgeoning: Honed blow strikes critical area', type: 'success' }
        ]
    },
    weaponmastery_trained_d6: {
        name: 'Trained Weapon Mastery (d6)',
        description: 'Trained weapon use on an easy maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: '• Piercing: Overconfident thrust meets expert counter\n• Slashing: Cocky swing invites masterful riposte\n• Bludgeoning: Arrogant strike opens to skilled response', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Cautious jab lacks commitment\n• Slashing: Careful cut hesitates mid-swing\n• Bludgeoning: Guarded strike loses momentum', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Competent thrust connects reliably\n• Slashing: Proficient swing lands consistently\n• Bludgeoning: Capable strike hits dependably', type: 'normal' },
            { roll: [4, 4], result: '• Piercing: Trained jab penetrates effectively\n• Slashing: Practiced cut slices cleanly\n• Bludgeoning: Drilled blow impacts solidly', type: 'normal' },
            { roll: [5, 5], result: '• Piercing: Refined thrust drives deep with control\n• Slashing: Polished swing cuts decisively\n• Bludgeoning: Honed strike lands with authority', type: 'success' },
            { roll: [6, 6], result: '• Piercing: Skilled jab finds gap with ease\n• Slashing: Expert cut exploits opening smoothly\n• Bludgeoning: Proficient blow breaks guard efficiently', type: 'success' }
        ]
    },
    weaponmastery_trained_d8: {
        name: 'Trained Weapon Mastery (d8)',
        description: 'Trained weapon use on a moderate maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: '• Piercing: Thrust parried, weapon bound\n• Slashing: Swing blocked, blade caught\n• Bludgeoning: Strike deflected, weapon trapped', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Jab intercepted, creates opening\n• Slashing: Cut caught, exposes flank\n• Bludgeoning: Blow stopped, leaves vulnerability', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Cautious thrust lacks penetration\n• Slashing: Careful swing loses power\n• Bludgeoning: Guarded strike weakens', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Basic jab scratches moderately\n• Slashing: Simple cut grazes decently\n• Bludgeoning: Standard blow taps firmly', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Competent thrust punctures adequately\n• Slashing: Proficient cut opens wound\n• Bludgeoning: Capable strike causes bruising', type: 'normal' },
            { roll: [6, 6], result: '• Piercing: Trained jab pierces flesh cleanly\n• Slashing: Practiced swing cuts through\n• Bludgeoning: Drilled blow lands solidly', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Refined thrust drives deep\n• Slashing: Polished cut slices decisively\n• Bludgeoning: Honed strike impacts hard', type: 'success' },
            { roll: [8, 8], result: '• Piercing: Skilled jab finds vital area\n• Slashing: Expert arc severs artery\n• Bludgeoning: Proficient blow cracks bone', type: 'success' }
        ]
    },
    weaponmastery_trained_d10: {
        name: 'Trained Weapon Mastery (d10)',
        description: 'Trained weapon use on a challenging maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: '• Piercing: Blade catches in armor, disarmed\n• Slashing: Edge binds in shield, yanked free\n• Bludgeoning: Head lodges in obstacle, pulled away', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Thrust redirected into own leg\n• Slashing: Swing turned into nearby ally\n• Bludgeoning: Strike deflected into own knee', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Point slides off armor\n• Slashing: Edge glances off plate\n• Bludgeoning: Head bounces off shield', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Weak jab fails to penetrate\n• Slashing: Feeble cut barely marks\n• Bludgeoning: Soft blow has minimal effect', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Rushed thrust goes slightly wide\n• Slashing: Hurried swing misses narrowly\n• Bludgeoning: Hasty strike finds mostly air', type: 'failure' },
            { roll: [6, 6], result: '• Piercing: Basic jab scratches lightly\n• Slashing: Simple cut nicks skin\n• Bludgeoning: Standard blow taps target', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Competent thrust punctures shallowly\n• Slashing: Proficient swing opens surface wound\n• Bludgeoning: Capable strike bruises moderately', type: 'normal' },
            { roll: [8, 8], result: '• Piercing: Trained jab slips past guard\n• Slashing: Practiced cut finds exposed flesh\n• Bludgeoning: Drilled blow strikes vulnerable spot', type: 'success' },
            { roll: [9, 9], result: '• Piercing: Refined thrust pierces deeply\n• Slashing: Polished arc cuts through defenses\n• Bludgeoning: Honed strike breaks guard', type: 'success' },
            { roll: [10, 10], result: '• Piercing: Skilled lunge finds heart\n• Slashing: Expert swing severs artery\n• Bludgeoning: Proficient blow fractures skull', type: 'critical' }
        ]
    },
    weaponmastery_trained_d12: {
        name: 'Trained Weapon Mastery (d12)',
        description: 'Trained weapon use on a difficult maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: '• Piercing: Blade chips on impact, impaired\n• Slashing: Edge notches, less effective\n• Bludgeoning: Haft cracks, weakened', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Thrust countered, stabbed in shoulder\n• Slashing: Swing reversed, cut across arm\n• Bludgeoning: Strike turned, hit in side', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Point bends slightly, impaired\n• Slashing: Edge dulls, cuts poorly\n• Bludgeoning: Head loosens, strikes weakly', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Thrust blocked, arm strained\n• Slashing: Swing parried, shoulder aches\n• Bludgeoning: Strike deflected, wrist hurts', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Jab intercepted, weapon held\n• Slashing: Cut caught, blade trapped\n• Bludgeoning: Blow stopped, weapon seized', type: 'failure' },
            { roll: [6, 6], result: '• Piercing: Thrust misses, slight overextension\n• Slashing: Swing fails, minor spin\n• Bludgeoning: Strike whiffs, small imbalance', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Basic jab penetrates padding\n• Slashing: Simple cut scratches armor\n• Bludgeoning: Standard blow rattles plate', type: 'normal' },
            { roll: [8, 8], result: '• Piercing: Competent thrust finds gap\n• Slashing: Proficient cut slips past defense\n• Bludgeoning: Capable strike sneaks through', type: 'normal' },
            { roll: [9, 9], result: '• Piercing: Trained lunge pierces leather\n• Slashing: Practiced swing cuts through cloth\n• Bludgeoning: Drilled strike dents metal', type: 'success' },
            { roll: [10, 10], result: '• Piercing: Refined thrust drives through chainmail\n• Slashing: Polished cut cleaves through straps\n• Bludgeoning: Honed blow buckles plate', type: 'success' },
            { roll: [11, 11], result: '• Piercing: Skilled jab finds joint in armor\n• Slashing: Expert swing catches unprotected limb\n• Bludgeoning: Proficient strike hits helmet seam', type: 'success' },
            { roll: [12, 12], result: '• Piercing: Masterful thrust pierces eye slit\n• Slashing: Flawless cut severs tendon\n• Bludgeoning: Perfect blow shatters collarbone', type: 'critical' }
        ]
    },
    weaponmastery_trained_d20: {
        name: 'Trained Weapon Mastery (d20)',
        description: 'Trained weapon use on a very difficult maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: '• Piercing: Weapon breaks on impact, 1d4 damage\n• Slashing: Blade shatters, fragments scatter\n• Bludgeoning: Haft splinters, shards fly', type: 'failure' },
            { roll: [2, 3], result: '• Piercing: Thrust reversed, impale self\n• Slashing: Swing turned, slash own body\n• Bludgeoning: Strike redirected, crush own foot', type: 'failure' },
            { roll: [4, 5], result: '• Piercing: Point catches, weapon wrenched\n• Slashing: Edge binds, shoulder strained\n• Bludgeoning: Head stuck, elbow twisted', type: 'failure' },
            { roll: [6, 7], result: '• Piercing: Thrust intercepted, riposted\n• Slashing: Swing caught, countered\n• Bludgeoning: Strike blocked, returned', type: 'failure' },
            { roll: [8, 9], result: '• Piercing: Jab deflected, stumble\n• Slashing: Cut parried, trip\n• Bludgeoning: Blow turned, fall', type: 'failure' },
            { roll: [10, 11], result: '• Piercing: Basic thrust bounces off\n• Slashing: Simple swing glances off\n• Bludgeoning: Standard strike rebounds', type: 'failure' },
            { roll: [12, 13], result: '• Piercing: Competent jab scratches surface\n• Slashing: Proficient cut marks armor\n• Bludgeoning: Capable blow taps plate', type: 'failure' },
            { roll: [14, 15], result: '• Piercing: Trained thrust makes shallow puncture\n• Slashing: Practiced cut opens minor wound\n• Bludgeoning: Drilled strike causes light bruise', type: 'normal' },
            { roll: [16, 17], result: '• Piercing: Refined jab slips through defense\n• Slashing: Polished swing finds opening\n• Bludgeoning: Honed blow breaks through guard', type: 'success' },
            { roll: [18, 18], result: '• Piercing: Skilled thrust pierces vital organ\n• Slashing: Expert cut severs major vessel\n• Bludgeoning: Proficient blow fractures spine', type: 'critical' },
            { roll: [19, 19], result: '• Piercing: Masterful lunge penetrates heart\n• Slashing: Flawless swing decapitates cleanly\n• Bludgeoning: Perfect strike crushes skull', type: 'critical' },
            { roll: [20, 20], result: '• Piercing: Legendary thrust pierces all armor to heart\n• Slashing: Supreme cut cleaves through bone\n• Bludgeoning: Ultimate blow pulverizes ribcage', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    weaponmastery_apprentice_d4: {
        name: 'Apprentice Weapon Mastery (d4)',
        description: 'Apprentice weapon use on a very easy maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: '• Piercing: Predictable pattern exploited, countered\n• Slashing: Familiar rhythm anticipated, parried\n• Bludgeoning: Known tempo read, blocked', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Proficient thrust with refined form\n• Slashing: Skilled cut with polished technique\n• Bludgeoning: Adept strike with honed execution', type: 'normal' },
            { roll: [3, 3], result: '• Piercing: Refined thrust finds target precisely\n• Slashing: Polished swing cuts with finesse\n• Bludgeoning: Honed strike lands with control', type: 'success' },
            { roll: [4, 4], result: '• Piercing: Expert jab exploits subtle weakness\n• Slashing: Masterful arc catches minor flaw\n• Bludgeoning: Skilled blow strikes optimal point', type: 'success' }
        ]
    },
    weaponmastery_apprentice_d6: {
        name: 'Apprentice Weapon Mastery (d6)',
        description: 'Apprentice weapon use on an easy maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: '• Piercing: Overreliance on technique meets adaptation\n• Slashing: Rigid form countered by flexibility\n• Bludgeoning: Textbook approach beaten by improvisation', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Overthinking disrupts natural flow\n• Slashing: Analysis paralysis weakens swing\n• Bludgeoning: Mental hesitation slows strike', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Proficient thrust connects smoothly\n• Slashing: Skilled swing lands efficiently\n• Bludgeoning: Adept strike hits reliably', type: 'normal' },
            { roll: [4, 4], result: '• Piercing: Refined jab penetrates with precision\n• Slashing: Polished cut slices with control\n• Bludgeoning: Honed blow impacts with accuracy', type: 'normal' },
            { roll: [5, 5], result: '• Piercing: Expert thrust drives deep with finesse\n• Slashing: Masterful swing cuts decisively\n• Bludgeoning: Skilled strike lands with authority', type: 'success' },
            { roll: [6, 6], result: '• Piercing: Precise jab finds gap effortlessly\n• Slashing: Controlled cut exploits opening smoothly\n• Bludgeoning: Measured blow breaks guard cleanly', type: 'success' }
        ]
    },
    weaponmastery_apprentice_d8: {
        name: 'Apprentice Weapon Mastery (d8)',
        description: 'Apprentice weapon use on a moderate maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: '• Piercing: Thrust expertly parried, weapon bound\n• Slashing: Swing skillfully blocked, blade caught\n• Bludgeoning: Strike adeptly deflected, weapon trapped', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Jab intercepted, minor opening\n• Slashing: Cut caught, small exposure\n• Bludgeoning: Blow stopped, slight vulnerability', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Careful thrust lacks full penetration\n• Slashing: Measured swing loses some power\n• Bludgeoning: Controlled strike weakens slightly', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Competent jab scratches well\n• Slashing: Proficient cut grazes effectively\n• Bludgeoning: Capable blow taps solidly', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Refined thrust punctures cleanly\n• Slashing: Polished cut opens good wound\n• Bludgeoning: Honed strike causes solid bruising', type: 'normal' },
            { roll: [6, 6], result: '• Piercing: Expert jab pierces flesh deeply\n• Slashing: Masterful swing cuts through cleanly\n• Bludgeoning: Skilled blow lands with force', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Precise thrust drives very deep\n• Slashing: Controlled cut slices decisively\n• Bludgeoning: Measured strike impacts hard', type: 'success' },
            { roll: [8, 8], result: '• Piercing: Flawless jab finds vital area\n• Slashing: Perfect arc severs artery\n• Bludgeoning: Ideal blow cracks bone', type: 'success' }
        ]
    },
    weaponmastery_apprentice_d10: {
        name: 'Apprentice Weapon Mastery (d10)',
        description: 'Apprentice weapon use on a challenging maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: '• Piercing: Blade catches firmly, disarmed\n• Slashing: Edge binds tightly, yanked free\n• Bludgeoning: Head lodges solidly, pulled away', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Thrust redirected skillfully into own leg\n• Slashing: Swing turned expertly into nearby ally\n• Bludgeoning: Strike deflected adeptly into own knee', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Point slides cleanly off armor\n• Slashing: Edge glances smoothly off plate\n• Bludgeoning: Head bounces neatly off shield', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Controlled jab fails to penetrate\n• Slashing: Measured cut barely marks\n• Bludgeoning: Precise blow has minimal effect', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Calculated thrust goes slightly wide\n• Slashing: Planned swing misses narrowly\n• Bludgeoning: Intended strike finds mostly air', type: 'failure' },
            { roll: [6, 6], result: '• Piercing: Competent jab scratches moderately\n• Slashing: Proficient cut nicks decently\n• Bludgeoning: Capable blow taps firmly', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Refined thrust punctures adequately\n• Slashing: Polished swing opens surface wound\n• Bludgeoning: Honed strike bruises well', type: 'normal' },
            { roll: [8, 8], result: '• Piercing: Expert jab slips past guard\n• Slashing: Masterful cut finds exposed flesh\n• Bludgeoning: Skilled blow strikes vulnerable spot', type: 'success' },
            { roll: [9, 9], result: '• Piercing: Precise thrust pierces deeply\n• Slashing: Controlled arc cuts through defenses\n• Bludgeoning: Measured strike breaks guard', type: 'success' },
            { roll: [10, 10], result: '• Piercing: Flawless lunge finds heart\n• Slashing: Perfect swing severs artery\n• Bludgeoning: Ideal blow fractures skull', type: 'critical' }
        ]
    },
    weaponmastery_apprentice_d12: {
        name: 'Apprentice Weapon Mastery (d12)',
        description: 'Apprentice weapon use on a difficult maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: '• Piercing: Blade chips despite care, impaired\n• Slashing: Edge notches unexpectedly, less effective\n• Bludgeoning: Haft cracks surprisingly, weakened', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Thrust expertly countered, stabbed in shoulder\n• Slashing: Swing masterfully reversed, cut across arm\n• Bludgeoning: Strike skillfully turned, hit in side', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Point bends under stress, impaired\n• Slashing: Edge dulls from impact, cuts poorly\n• Bludgeoning: Head loosens from force, strikes weakly', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Thrust blocked firmly, arm strained\n• Slashing: Swing parried solidly, shoulder aches\n• Bludgeoning: Strike deflected strongly, wrist hurts', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Jab intercepted cleanly, weapon held\n• Slashing: Cut caught smoothly, blade trapped\n• Bludgeoning: Blow stopped neatly, weapon seized', type: 'failure' },
            { roll: [6, 6], result: '• Piercing: Thrust misses narrowly, slight overextension\n• Slashing: Swing fails barely, minor spin\n• Bludgeoning: Strike whiffs closely, small imbalance', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Competent jab penetrates padding\n• Slashing: Proficient cut scratches armor\n• Bludgeoning: Capable blow rattles plate', type: 'normal' },
            { roll: [8, 8], result: '• Piercing: Refined thrust finds gap\n• Slashing: Polished cut slips past defense\n• Bludgeoning: Honed strike sneaks through', type: 'normal' },
            { roll: [9, 9], result: '• Piercing: Expert lunge pierces leather\n• Slashing: Masterful swing cuts through cloth\n• Bludgeoning: Skilled strike dents metal', type: 'success' },
            { roll: [10, 10], result: '• Piercing: Precise thrust drives through chainmail\n• Slashing: Controlled cut cleaves through straps\n• Bludgeoning: Measured blow buckles plate', type: 'success' },
            { roll: [11, 11], result: '• Piercing: Flawless jab finds joint in armor\n• Slashing: Perfect swing catches unprotected limb\n• Bludgeoning: Ideal strike hits helmet seam', type: 'success' },
            { roll: [12, 12], result: '• Piercing: Legendary thrust pierces eye slit\n• Slashing: Supreme cut severs tendon\n• Bludgeoning: Ultimate blow shatters collarbone', type: 'critical' }
        ]
    },
    weaponmastery_apprentice_d20: {
        name: 'Apprentice Weapon Mastery (d20)',
        description: 'Apprentice weapon use on a very difficult maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: '• Piercing: Weapon breaks despite skill, 1d4 damage\n• Slashing: Blade shatters unexpectedly, fragments scatter\n• Bludgeoning: Haft splinters surprisingly, shards fly', type: 'failure' },
            { roll: [2, 3], result: '• Piercing: Thrust expertly reversed, impale self\n• Slashing: Swing masterfully turned, slash own body\n• Bludgeoning: Strike skillfully redirected, crush own foot', type: 'failure' },
            { roll: [4, 5], result: '• Piercing: Point catches firmly, weapon wrenched\n• Slashing: Edge binds tightly, shoulder strained\n• Bludgeoning: Head stuck solidly, elbow twisted', type: 'failure' },
            { roll: [6, 7], result: '• Piercing: Thrust intercepted cleanly, riposted\n• Slashing: Swing caught smoothly, countered\n• Bludgeoning: Strike blocked neatly, returned', type: 'failure' },
            { roll: [8, 9], result: '• Piercing: Jab deflected, controlled stumble\n• Slashing: Cut parried, managed trip\n• Bludgeoning: Blow turned, partial fall', type: 'failure' },
            { roll: [10, 11], result: '• Piercing: Competent thrust bounces off\n• Slashing: Proficient swing glances off\n• Bludgeoning: Capable strike rebounds', type: 'failure' },
            { roll: [12, 13], result: '• Piercing: Refined jab scratches surface\n• Slashing: Polished cut marks armor\n• Bludgeoning: Honed blow taps plate', type: 'failure' },
            { roll: [14, 15], result: '• Piercing: Expert thrust makes shallow puncture\n• Slashing: Masterful cut opens minor wound\n• Bludgeoning: Skilled strike causes light bruise', type: 'normal' },
            { roll: [16, 17], result: '• Piercing: Precise jab slips through defense\n• Slashing: Controlled swing finds opening\n• Bludgeoning: Measured blow breaks through guard', type: 'success' },
            { roll: [18, 18], result: '• Piercing: Flawless thrust pierces vital organ\n• Slashing: Perfect cut severs major vessel\n• Bludgeoning: Ideal blow fractures spine', type: 'critical' },
            { roll: [19, 19], result: '• Piercing: Legendary lunge penetrates heart\n• Slashing: Supreme swing decapitates cleanly\n• Bludgeoning: Ultimate strike crushes skull', type: 'critical' },
            { roll: [20, 20], result: '• Piercing: Mythic thrust pierces all armor to heart\n• Slashing: Divine cut cleaves through bone\n• Bludgeoning: Transcendent blow pulverizes ribcage', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    weaponmastery_adept_d4: {
        name: 'Adept Weapon Mastery (d4)',
        description: 'Adept weapon use on a very easy maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: '• Piercing: Feint read perfectly, countered decisively\n• Slashing: Deception anticipated, parried expertly\n• Bludgeoning: Misdirection predicted, blocked masterfully', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Skilled thrust with expert form\n• Slashing: Adept cut with masterful technique\n• Bludgeoning: Proficient strike with refined execution', type: 'normal' },
            { roll: [3, 3], result: '• Piercing: Expert thrust finds target flawlessly\n• Slashing: Masterful swing cuts with elegance\n• Bludgeoning: Skilled strike lands with grace', type: 'success' },
            { roll: [4, 4], result: '• Piercing: Flawless jab exploits minute weakness\n• Slashing: Perfect arc catches tiny flaw\n• Bludgeoning: Ideal blow strikes precise point', type: 'success' }
        ]
    },
    weaponmastery_adept_d6: {
        name: 'Adept Weapon Mastery (d6)',
        description: 'Adept weapon use on an easy maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: '• Piercing: Complacency exploited by superior skill\n• Slashing: Confidence punished by greater mastery\n• Bludgeoning: Assurance countered by exceptional technique', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Perfectionism disrupts fluid motion\n• Slashing: Excessive precision slows swing\n• Bludgeoning: Overcontrol weakens strike', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Skilled thrust connects fluidly\n• Slashing: Adept swing lands gracefully\n• Bludgeoning: Proficient strike hits smoothly', type: 'normal' },
            { roll: [4, 4], result: '• Piercing: Expert jab penetrates with finesse\n• Slashing: Masterful cut slices with elegance\n• Bludgeoning: Refined blow impacts with control', type: 'normal' },
            { roll: [5, 5], result: '• Piercing: Flawless thrust drives deep with precision\n• Slashing: Perfect swing cuts decisively\n• Bludgeoning: Ideal strike lands with authority', type: 'success' },
            { roll: [6, 6], result: '• Piercing: Sublime jab finds gap with ease\n• Slashing: Elegant cut exploits opening naturally\n• Bludgeoning: Graceful blow breaks guard effortlessly', type: 'success' }
        ]
    },
    weaponmastery_adept_d8: {
        name: 'Adept Weapon Mastery (d8)',
        description: 'Adept weapon use on a moderate maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: '• Piercing: Thrust masterfully parried, weapon bound\n• Slashing: Swing expertly blocked, blade caught\n• Bludgeoning: Strike skillfully deflected, weapon trapped', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Jab intercepted smoothly, tiny opening\n• Slashing: Cut caught cleanly, minimal exposure\n• Bludgeoning: Blow stopped neatly, slight vulnerability', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Measured thrust lacks final penetration\n• Slashing: Controlled swing loses edge power\n• Bludgeoning: Precise strike weakens at impact', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Refined jab scratches expertly\n• Slashing: Polished cut grazes skillfully\n• Bludgeoning: Honed blow taps precisely', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Expert thrust punctures smoothly\n• Slashing: Masterful cut opens clean wound\n• Bludgeoning: Skilled strike causes deep bruising', type: 'normal' },
            { roll: [6, 6], result: '• Piercing: Flawless jab pierces flesh perfectly\n• Slashing: Perfect swing cuts through elegantly\n• Bludgeoning: Ideal blow lands with precision', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Sublime thrust drives extremely deep\n• Slashing: Elegant cut slices decisively\n• Bludgeoning: Graceful strike impacts powerfully', type: 'success' },
            { roll: [8, 8], result: '• Piercing: Legendary jab finds vital area\n• Slashing: Supreme arc severs artery\n• Bludgeoning: Mythic blow cracks bone', type: 'success' }
        ]
    },
    weaponmastery_adept_d10: {
        name: 'Adept Weapon Mastery (d10)',
        description: 'Adept weapon use on a challenging maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: '• Piercing: Blade catches expertly, disarmed\n• Slashing: Edge binds skillfully, yanked free\n• Bludgeoning: Head lodges masterfully, pulled away', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Thrust redirected masterfully into own leg\n• Slashing: Swing turned supremely into nearby ally\n• Bludgeoning: Strike deflected expertly into own knee', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Point slides perfectly off armor\n• Slashing: Edge glances flawlessly off plate\n• Bludgeoning: Head bounces ideally off shield', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Precise jab fails to penetrate\n• Slashing: Controlled cut barely marks\n• Bludgeoning: Measured blow has minimal effect', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Calculated thrust goes narrowly wide\n• Slashing: Planned swing misses barely\n• Bludgeoning: Intended strike finds mostly air', type: 'failure' },
            { roll: [6, 6], result: '• Piercing: Refined jab scratches well\n• Slashing: Polished cut nicks cleanly\n• Bludgeoning: Honed blow taps solidly', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Expert thrust punctures effectively\n• Slashing: Masterful swing opens good wound\n• Bludgeoning: Skilled strike bruises deeply', type: 'normal' },
            { roll: [8, 8], result: '• Piercing: Flawless jab slips past guard\n• Slashing: Perfect cut finds exposed flesh\n• Bludgeoning: Ideal blow strikes vulnerable spot', type: 'success' },
            { roll: [9, 9], result: '• Piercing: Sublime thrust pierces very deeply\n• Slashing: Elegant arc cuts through defenses\n• Bludgeoning: Graceful strike breaks guard', type: 'success' },
            { roll: [10, 10], result: '• Piercing: Legendary lunge finds heart\n• Slashing: Supreme swing severs artery\n• Bludgeoning: Mythic blow fractures skull', type: 'critical' }
        ]
    },
    weaponmastery_adept_d12: {
        name: 'Adept Weapon Mastery (d12)',
        description: 'Adept weapon use on a difficult maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: '• Piercing: Blade chips despite expertise, impaired\n• Slashing: Edge notches unexpectedly, less effective\n• Bludgeoning: Haft cracks surprisingly, weakened', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Thrust masterfully countered, stabbed in shoulder\n• Slashing: Swing supremely reversed, cut across arm\n• Bludgeoning: Strike expertly turned, hit in side', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Point bends under extreme stress, impaired\n• Slashing: Edge dulls from hard impact, cuts poorly\n• Bludgeoning: Head loosens from great force, strikes weakly', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Thrust blocked expertly, arm strained\n• Slashing: Swing parried masterfully, shoulder aches\n• Bludgeoning: Strike deflected skillfully, wrist hurts', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Jab intercepted perfectly, weapon held\n• Slashing: Cut caught flawlessly, blade trapped\n• Bludgeoning: Blow stopped ideally, weapon seized', type: 'failure' },
            { roll: [6, 6], result: '• Piercing: Thrust misses barely, minimal overextension\n• Slashing: Swing fails narrowly, tiny spin\n• Bludgeoning: Strike whiffs closely, slight imbalance', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Refined jab penetrates padding\n• Slashing: Polished cut scratches armor\n• Bludgeoning: Honed blow rattles plate', type: 'normal' },
            { roll: [8, 8], result: '• Piercing: Expert thrust finds gap\n• Slashing: Masterful cut slips past defense\n• Bludgeoning: Skilled strike sneaks through', type: 'normal' },
            { roll: [9, 9], result: '• Piercing: Flawless lunge pierces leather\n• Slashing: Perfect swing cuts through cloth\n• Bludgeoning: Ideal strike dents metal', type: 'success' },
            { roll: [10, 10], result: '• Piercing: Sublime thrust drives through chainmail\n• Slashing: Elegant cut cleaves through straps\n• Bludgeoning: Graceful blow buckles plate', type: 'success' },
            { roll: [11, 11], result: '• Piercing: Legendary jab finds joint in armor\n• Slashing: Supreme swing catches unprotected limb\n• Bludgeoning: Mythic strike hits helmet seam', type: 'success' },
            { roll: [12, 12], result: '• Piercing: Divine thrust pierces eye slit\n• Slashing: Transcendent cut severs tendon\n• Bludgeoning: Celestial blow shatters collarbone', type: 'critical' }
        ]
    },
    weaponmastery_adept_d20: {
        name: 'Adept Weapon Mastery (d20)',
        description: 'Adept weapon use on a very difficult maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: '• Piercing: Weapon breaks despite mastery, 1d4 damage\n• Slashing: Blade shatters unexpectedly, fragments scatter\n• Bludgeoning: Haft splinters surprisingly, shards fly', type: 'failure' },
            { roll: [2, 3], result: '• Piercing: Thrust masterfully reversed, impale self\n• Slashing: Swing supremely turned, slash own body\n• Bludgeoning: Strike expertly redirected, crush own foot', type: 'failure' },
            { roll: [4, 5], result: '• Piercing: Point catches solidly, weapon wrenched\n• Slashing: Edge binds firmly, shoulder strained\n• Bludgeoning: Head stuck tightly, elbow twisted', type: 'failure' },
            { roll: [6, 7], result: '• Piercing: Thrust intercepted expertly, riposted\n• Slashing: Swing caught masterfully, countered\n• Bludgeoning: Strike blocked skillfully, returned', type: 'failure' },
            { roll: [8, 9], result: '• Piercing: Jab deflected, minimal stumble\n• Slashing: Cut parried, slight trip\n• Bludgeoning: Blow turned, small fall', type: 'failure' },
            { roll: [10, 11], result: '• Piercing: Refined thrust bounces off\n• Slashing: Polished swing glances off\n• Bludgeoning: Honed strike rebounds', type: 'failure' },
            { roll: [12, 13], result: '• Piercing: Expert jab scratches surface\n• Slashing: Masterful cut marks armor\n• Bludgeoning: Skilled blow taps plate', type: 'failure' },
            { roll: [14, 15], result: '• Piercing: Flawless thrust makes shallow puncture\n• Slashing: Perfect cut opens minor wound\n• Bludgeoning: Ideal strike causes light bruise', type: 'normal' },
            { roll: [16, 17], result: '• Piercing: Sublime jab slips through defense\n• Slashing: Elegant swing finds opening\n• Bludgeoning: Graceful blow breaks through guard', type: 'success' },
            { roll: [18, 18], result: '• Piercing: Legendary thrust pierces vital organ\n• Slashing: Supreme cut severs major vessel\n• Bludgeoning: Mythic blow fractures spine', type: 'critical' },
            { roll: [19, 19], result: '• Piercing: Divine lunge penetrates heart\n• Slashing: Transcendent swing decapitates cleanly\n• Bludgeoning: Celestial strike crushes skull', type: 'critical' },
            { roll: [20, 20], result: '• Piercing: Godlike thrust pierces all armor to heart\n• Slashing: Otherworldly cut cleaves through bone\n• Bludgeoning: Supernatural blow pulverizes ribcage', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    weaponmastery_expert_d4: {
        name: 'Expert Weapon Mastery (d4)',
        description: 'Expert weapon use on a very easy maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: '• Piercing: Subtle tell exploited by equal master\n• Slashing: Minute habit punished by peer\n• Bludgeoning: Tiny pattern countered by rival expert', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Masterful thrust with flawless form\n• Slashing: Expert cut with perfect technique\n• Bludgeoning: Adept strike with ideal execution', type: 'normal' },
            { roll: [3, 3], result: '• Piercing: Flawless thrust finds target perfectly\n• Slashing: Perfect swing cuts with precision\n• Bludgeoning: Ideal strike lands with exactness', type: 'success' },
            { roll: [4, 4], result: '• Piercing: Legendary jab exploits imperceptible weakness\n• Slashing: Supreme arc catches invisible flaw\n• Bludgeoning: Mythic blow strikes optimal point', type: 'success' }
        ]
    },
    weaponmastery_expert_d6: {
        name: 'Expert Weapon Mastery (d6)',
        description: 'Expert weapon use on an easy maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: '• Piercing: Hubris exploited by legendary opponent\n• Slashing: Pride punished by mythic adversary\n• Bludgeoning: Ego countered by transcendent foe', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Overthinking disrupts instinctive flow\n• Slashing: Mental interference slows natural swing\n• Bludgeoning: Conscious thought weakens automatic strike', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Masterful thrust connects seamlessly\n• Slashing: Expert swing lands effortlessly\n• Bludgeoning: Adept strike hits naturally', type: 'normal' },
            { roll: [4, 4], result: '• Piercing: Flawless jab penetrates with grace\n• Slashing: Perfect cut slices with beauty\n• Bludgeoning: Ideal blow impacts with elegance', type: 'normal' },
            { roll: [5, 5], result: '• Piercing: Legendary thrust drives deep with artistry\n• Slashing: Supreme swing cuts decisively\n• Bludgeoning: Mythic strike lands with mastery', type: 'success' },
            { roll: [6, 6], result: '• Piercing: Transcendent jab finds gap instinctively\n• Slashing: Divine cut exploits opening naturally\n• Bludgeoning: Celestial blow breaks guard effortlessly', type: 'success' }
        ]
    },
    weaponmastery_expert_d8: {
        name: 'Expert Weapon Mastery (d8)',
        description: 'Expert weapon use on a moderate maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: '• Piercing: Thrust legendarily parried, weapon bound\n• Slashing: Swing supremely blocked, blade caught\n• Bludgeoning: Strike mythically deflected, weapon trapped', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Jab intercepted flawlessly, imperceptible opening\n• Slashing: Cut caught perfectly, minimal exposure\n• Bludgeoning: Blow stopped ideally, tiny vulnerability', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Controlled thrust lacks ultimate penetration\n• Slashing: Precise swing loses final power\n• Bludgeoning: Measured strike weakens at last moment', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Expert jab scratches masterfully\n• Slashing: Masterful cut grazes expertly\n• Bludgeoning: Skilled blow taps flawlessly', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Flawless thrust punctures elegantly\n• Slashing: Perfect cut opens precise wound\n• Bludgeoning: Ideal strike causes exact bruising', type: 'normal' },
            { roll: [6, 6], result: '• Piercing: Legendary jab pierces flesh sublimely\n• Slashing: Supreme swing cuts through gracefully\n• Bludgeoning: Mythic blow lands with perfection', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Transcendent thrust drives maximally deep\n• Slashing: Divine cut slices decisively\n• Bludgeoning: Celestial strike impacts devastatingly', type: 'success' },
            { roll: [8, 8], result: '• Piercing: Godlike jab finds vital area\n• Slashing: Otherworldly arc severs artery\n• Bludgeoning: Supernatural blow cracks bone', type: 'success' }
        ]
    },
    weaponmastery_expert_d10: {
        name: 'Expert Weapon Mastery (d10)',
        description: 'Expert weapon use on a challenging maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: '• Piercing: Blade catches masterfully, disarmed\n• Slashing: Edge binds expertly, yanked free\n• Bludgeoning: Head lodges perfectly, pulled away', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Thrust redirected legendarily into own leg\n• Slashing: Swing turned supremely into nearby ally\n• Bludgeoning: Strike deflected mythically into own knee', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Point slides sublimely off armor\n• Slashing: Edge glances gracefully off plate\n• Bludgeoning: Head bounces elegantly off shield', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Flawless jab fails to penetrate\n• Slashing: Perfect cut barely marks\n• Bludgeoning: Ideal blow has minimal effect', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Calculated thrust goes infinitesimally wide\n• Slashing: Planned swing misses by hair\n• Bludgeoning: Intended strike finds mostly air', type: 'failure' },
            { roll: [6, 6], result: '• Piercing: Expert jab scratches precisely\n• Slashing: Masterful cut nicks perfectly\n• Bludgeoning: Skilled blow taps exactly', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Flawless thrust punctures optimally\n• Slashing: Perfect swing opens ideal wound\n• Bludgeoning: Legendary strike bruises maximally', type: 'normal' },
            { roll: [8, 8], result: '• Piercing: Supreme jab slips past guard\n• Slashing: Mythic cut finds exposed flesh\n• Bludgeoning: Transcendent blow strikes vulnerable spot', type: 'success' },
            { roll: [9, 9], result: '• Piercing: Divine thrust pierces extremely deeply\n• Slashing: Celestial arc cuts through defenses\n• Bludgeoning: Godlike strike breaks guard', type: 'success' },
            { roll: [10, 10], result: '• Piercing: Otherworldly lunge finds heart\n• Slashing: Supernatural swing severs artery\n• Bludgeoning: Cosmic blow fractures skull', type: 'critical' }
        ]
    },
    weaponmastery_expert_d12: {
        name: 'Expert Weapon Mastery (d12)',
        description: 'Expert weapon use on a difficult maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: '• Piercing: Blade chips despite mastery, impaired\n• Slashing: Edge notches unexpectedly, less effective\n• Bludgeoning: Haft cracks surprisingly, weakened', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Thrust legendarily countered, stabbed in shoulder\n• Slashing: Swing supremely reversed, cut across arm\n• Bludgeoning: Strike mythically turned, hit in side', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Point bends under immense stress, impaired\n• Slashing: Edge dulls from massive impact, cuts poorly\n• Bludgeoning: Head loosens from tremendous force, strikes weakly', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Thrust blocked masterfully, arm strained\n• Slashing: Swing parried expertly, shoulder aches\n• Bludgeoning: Strike deflected perfectly, wrist hurts', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Jab intercepted legendarily, weapon held\n• Slashing: Cut caught supremely, blade trapped\n• Bludgeoning: Blow stopped mythically, weapon seized', type: 'failure' },
            { roll: [6, 6], result: '• Piercing: Thrust misses infinitesimally, no overextension\n• Slashing: Swing fails by hair, imperceptible spin\n• Bludgeoning: Strike whiffs minutely, negligible imbalance', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Expert jab penetrates padding\n• Slashing: Masterful cut scratches armor\n• Bludgeoning: Skilled blow rattles plate', type: 'normal' },
            { roll: [8, 8], result: '• Piercing: Flawless thrust finds gap\n• Slashing: Perfect cut slips past defense\n• Bludgeoning: Ideal strike sneaks through', type: 'normal' },
            { roll: [9, 9], result: '• Piercing: Legendary lunge pierces leather\n• Slashing: Supreme swing cuts through cloth\n• Bludgeoning: Mythic strike dents metal', type: 'success' },
            { roll: [10, 10], result: '• Piercing: Transcendent thrust drives through chainmail\n• Slashing: Divine cut cleaves through straps\n• Bludgeoning: Celestial blow buckles plate', type: 'success' },
            { roll: [11, 11], result: '• Piercing: Godlike jab finds joint in armor\n• Slashing: Otherworldly swing catches unprotected limb\n• Bludgeoning: Supernatural strike hits helmet seam', type: 'success' },
            { roll: [12, 12], result: '• Piercing: Cosmic thrust pierces eye slit\n• Slashing: Ethereal cut severs tendon\n• Bludgeoning: Astral blow shatters collarbone', type: 'critical' }
        ]
    },
    weaponmastery_expert_d20: {
        name: 'Expert Weapon Mastery (d20)',
        description: 'Expert weapon use on a very difficult maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: '• Piercing: Weapon breaks despite expertise, 1d4 damage\n• Slashing: Blade shatters unexpectedly, fragments scatter\n• Bludgeoning: Haft splinters surprisingly, shards fly', type: 'failure' },
            { roll: [2, 3], result: '• Piercing: Thrust legendarily reversed, impale self\n• Slashing: Swing supremely turned, slash own body\n• Bludgeoning: Strike mythically redirected, crush own foot', type: 'failure' },
            { roll: [4, 5], result: '• Piercing: Point catches perfectly, weapon wrenched\n• Slashing: Edge binds flawlessly, shoulder strained\n• Bludgeoning: Head stuck ideally, elbow twisted', type: 'failure' },
            { roll: [6, 7], result: '• Piercing: Thrust intercepted masterfully, riposted\n• Slashing: Swing caught expertly, countered\n• Bludgeoning: Strike blocked perfectly, returned', type: 'failure' },
            { roll: [8, 9], result: '• Piercing: Jab deflected, imperceptible stumble\n• Slashing: Cut parried, negligible trip\n• Bludgeoning: Blow turned, minimal fall', type: 'failure' },
            { roll: [10, 11], result: '• Piercing: Expert thrust bounces off\n• Slashing: Masterful swing glances off\n• Bludgeoning: Skilled strike rebounds', type: 'failure' },
            { roll: [12, 13], result: '• Piercing: Flawless jab scratches surface\n• Slashing: Perfect cut marks armor\n• Bludgeoning: Ideal blow taps plate', type: 'failure' },
            { roll: [14, 15], result: '• Piercing: Legendary thrust makes shallow puncture\n• Slashing: Supreme cut opens minor wound\n• Bludgeoning: Mythic strike causes light bruise', type: 'normal' },
            { roll: [16, 17], result: '• Piercing: Transcendent jab slips through defense\n• Slashing: Divine swing finds opening\n• Bludgeoning: Celestial blow breaks through guard', type: 'success' },
            { roll: [18, 18], result: '• Piercing: Godlike thrust pierces vital organ\n• Slashing: Otherworldly cut severs major vessel\n• Bludgeoning: Supernatural blow fractures spine', type: 'critical' },
            { roll: [19, 19], result: '• Piercing: Cosmic lunge penetrates heart\n• Slashing: Ethereal swing decapitates cleanly\n• Bludgeoning: Astral strike crushes skull', type: 'critical' },
            { roll: [20, 20], result: '• Piercing: Absolute thrust pierces all armor to heart\n• Slashing: Ultimate cut cleaves through bone\n• Bludgeoning: Supreme blow pulverizes ribcage', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    weaponmastery_master_d4: {
        name: 'Master Weapon Mastery (d4)',
        description: 'Master weapon use on a very easy maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: '• Piercing: Infinitesimal tell read by legendary equal\n• Slashing: Microscopic habit punished by mythic peer\n• Bludgeoning: Imperceptible pattern countered by transcendent rival', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Legendary thrust with sublime form\n• Slashing: Supreme cut with transcendent technique\n• Bludgeoning: Mythic strike with divine execution', type: 'normal' },
            { roll: [3, 3], result: '• Piercing: Transcendent thrust finds target sublimely\n• Slashing: Divine swing cuts with absolute precision\n• Bludgeoning: Celestial strike lands with perfect exactness', type: 'success' },
            { roll: [4, 4], result: '• Piercing: Godlike jab exploits invisible weakness\n• Slashing: Otherworldly arc catches nonexistent flaw\n• Bludgeoning: Supernatural blow strikes impossible point', type: 'success' }
        ]
    },
    weaponmastery_master_d6: {
        name: 'Master Weapon Mastery (d6)',
        description: 'Master weapon use on an easy maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: '• Piercing: Absolute confidence exploited by impossible opponent\n• Slashing: Total mastery punished by inconceivable adversary\n• Bludgeoning: Complete perfection countered by unimaginable foe', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Conscious thought disrupts pure instinct\n• Slashing: Mental awareness slows perfect reflex\n• Bludgeoning: Active mind weakens flawless muscle memory', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Legendary thrust connects flawlessly\n• Slashing: Supreme swing lands perfectly\n• Bludgeoning: Mythic strike hits ideally', type: 'normal' },
            { roll: [4, 4], result: '• Piercing: Transcendent jab penetrates with perfection\n• Slashing: Divine cut slices with absolute grace\n• Bludgeoning: Celestial blow impacts with total elegance', type: 'normal' },
            { roll: [5, 5], result: '• Piercing: Godlike thrust drives deep with supreme artistry\n• Slashing: Otherworldly swing cuts decisively\n• Bludgeoning: Supernatural strike lands with ultimate mastery', type: 'success' },
            { roll: [6, 6], result: '• Piercing: Cosmic jab finds gap without thought\n• Slashing: Ethereal cut exploits opening unconsciously\n• Bludgeoning: Astral blow breaks guard reflexively', type: 'success' }
        ]
    },
    weaponmastery_master_d8: {
        name: 'Master Weapon Mastery (d8)',
        description: 'Master weapon use on a moderate maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: '• Piercing: Thrust impossibly parried, weapon bound\n• Slashing: Swing inconceivably blocked, blade caught\n• Bludgeoning: Strike unimaginably deflected, weapon trapped', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Jab intercepted transcendently, no visible opening\n• Slashing: Cut caught divinely, imperceptible exposure\n• Bludgeoning: Blow stopped celestially, microscopic vulnerability', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Perfect thrust lacks final atom of penetration\n• Slashing: Flawless swing loses infinitesimal power\n• Bludgeoning: Ideal strike weakens at quantum level', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Legendary jab scratches with perfection\n• Slashing: Supreme cut grazes with mastery\n• Bludgeoning: Mythic blow taps with absolute control', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Transcendent thrust punctures divinely\n• Slashing: Divine cut opens sublime wound\n• Bludgeoning: Celestial strike causes perfect bruising', type: 'normal' },
            { roll: [6, 6], result: '• Piercing: Godlike jab pierces flesh transcendently\n• Slashing: Otherworldly swing cuts through celestially\n• Bludgeoning: Supernatural blow lands with godlike precision', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Cosmic thrust drives to maximum depth\n• Slashing: Ethereal cut slices with ultimate decisiveness\n• Bludgeoning: Astral strike impacts with supreme devastation', type: 'success' },
            { roll: [8, 8], result: '• Piercing: Absolute jab finds vital area\n• Slashing: Ultimate arc severs artery\n• Bludgeoning: Supreme blow cracks bone', type: 'success' }
        ]
    },
    weaponmastery_master_d10: {
        name: 'Master Weapon Mastery (d10)',
        description: 'Master weapon use on a challenging maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: '• Piercing: Blade catches impossibly, disarmed\n• Slashing: Edge binds inconceivably, yanked free\n• Bludgeoning: Head lodges unimaginably, pulled away', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Thrust redirected impossibly into own leg\n• Slashing: Swing turned inconceivably into nearby ally\n• Bludgeoning: Strike deflected unimaginably into own knee', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Point slides transcendently off armor\n• Slashing: Edge glances divinely off plate\n• Bludgeoning: Head bounces celestially off shield', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Legendary jab fails to penetrate\n• Slashing: Supreme cut barely marks\n• Bludgeoning: Mythic blow has minimal effect', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Perfect thrust goes atomically wide\n• Slashing: Flawless swing misses by quantum measure\n• Bludgeoning: Ideal strike finds only air', type: 'failure' },
            { roll: [6, 6], result: '• Piercing: Legendary jab scratches with absolute precision\n• Slashing: Supreme cut nicks with total perfection\n• Bludgeoning: Mythic blow taps with complete exactness', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Transcendent thrust punctures optimally\n• Slashing: Divine swing opens perfect wound\n• Bludgeoning: Celestial strike bruises ideally', type: 'normal' },
            { roll: [8, 8], result: '• Piercing: Godlike jab slips past guard\n• Slashing: Otherworldly cut finds exposed flesh\n• Bludgeoning: Supernatural blow strikes vulnerable spot', type: 'success' },
            { roll: [9, 9], result: '• Piercing: Cosmic thrust pierces to maximum depth\n• Slashing: Ethereal arc cuts through all defenses\n• Bludgeoning: Astral strike breaks guard completely', type: 'success' },
            { roll: [10, 10], result: '• Piercing: Absolute lunge finds heart\n• Slashing: Ultimate swing severs artery\n• Bludgeoning: Supreme blow fractures skull', type: 'critical' }
        ]
    },
    weaponmastery_master_d12: {
        name: 'Master Weapon Mastery (d12)',
        description: 'Master weapon use on a difficult maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: '• Piercing: Blade chips despite perfection, impaired\n• Slashing: Edge notches unexpectedly, less effective\n• Bludgeoning: Haft cracks surprisingly, weakened', type: 'failure' },
            { roll: [2, 2], result: '• Piercing: Thrust impossibly countered, stabbed in shoulder\n• Slashing: Swing inconceivably reversed, cut across arm\n• Bludgeoning: Strike unimaginably turned, hit in side', type: 'failure' },
            { roll: [3, 3], result: '• Piercing: Point bends under impossible stress, impaired\n• Slashing: Edge dulls from inconceivable impact, cuts poorly\n• Bludgeoning: Head loosens from unimaginable force, strikes weakly', type: 'failure' },
            { roll: [4, 4], result: '• Piercing: Thrust blocked legendarily, arm strained\n• Slashing: Swing parried supremely, shoulder aches\n• Bludgeoning: Strike deflected mythically, wrist hurts', type: 'failure' },
            { roll: [5, 5], result: '• Piercing: Jab intercepted impossibly, weapon held\n• Slashing: Cut caught inconceivably, blade trapped\n• Bludgeoning: Blow stopped unimaginably, weapon seized', type: 'failure' },
            { roll: [6, 6], result: '• Piercing: Thrust misses atomically, no overextension\n• Slashing: Swing fails quantumly, no spin\n• Bludgeoning: Strike whiffs microscopically, no imbalance', type: 'normal' },
            { roll: [7, 7], result: '• Piercing: Legendary jab penetrates padding\n• Slashing: Supreme cut scratches armor\n• Bludgeoning: Mythic blow rattles plate', type: 'normal' },
            { roll: [8, 8], result: '• Piercing: Transcendent thrust finds gap\n• Slashing: Divine cut slips past defense\n• Bludgeoning: Celestial strike sneaks through', type: 'normal' },
            { roll: [9, 9], result: '• Piercing: Godlike lunge pierces leather\n• Slashing: Otherworldly swing cuts through cloth\n• Bludgeoning: Supernatural strike dents metal', type: 'success' },
            { roll: [10, 10], result: '• Piercing: Cosmic thrust drives through chainmail\n• Slashing: Ethereal cut cleaves through straps\n• Bludgeoning: Astral blow buckles plate', type: 'success' },
            { roll: [11, 11], result: '• Piercing: Absolute jab finds joint in armor\n• Slashing: Ultimate swing catches unprotected limb\n• Bludgeoning: Supreme strike hits helmet seam', type: 'success' },
            { roll: [12, 12], result: '• Piercing: Infinite thrust pierces eye slit\n• Slashing: Eternal cut severs tendon\n• Bludgeoning: Timeless blow shatters collarbone', type: 'critical' }
        ]
    },
    weaponmastery_master_d20: {
        name: 'Master Weapon Mastery (d20)',
        description: 'Master weapon use on a very difficult maneuver',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: '• Piercing: Weapon breaks despite mastery, 1d4 damage\n• Slashing: Blade shatters unexpectedly, fragments scatter\n• Bludgeoning: Haft splinters surprisingly, shards fly', type: 'failure' },
            { roll: [2, 3], result: '• Piercing: Thrust impossibly reversed, impale self\n• Slashing: Swing inconceivably turned, slash own body\n• Bludgeoning: Strike unimaginably redirected, crush own foot', type: 'failure' },
            { roll: [4, 5], result: '• Piercing: Point catches transcendently, weapon wrenched\n• Slashing: Edge binds divinely, shoulder strained\n• Bludgeoning: Head stuck celestially, elbow twisted', type: 'failure' },
            { roll: [6, 7], result: '• Piercing: Thrust intercepted legendarily, riposted\n• Slashing: Swing caught supremely, countered\n• Bludgeoning: Strike blocked mythically, returned', type: 'failure' },
            { roll: [8, 9], result: '• Piercing: Jab deflected, microscopic stumble\n• Slashing: Cut parried, atomic trip\n• Bludgeoning: Blow turned, quantum fall', type: 'failure' },
            { roll: [10, 11], result: '• Piercing: Legendary thrust bounces off\n• Slashing: Supreme swing glances off\n• Bludgeoning: Mythic strike rebounds', type: 'failure' },
            { roll: [12, 13], result: '• Piercing: Transcendent jab scratches surface\n• Slashing: Divine cut marks armor\n• Bludgeoning: Celestial blow taps plate', type: 'failure' },
            { roll: [14, 15], result: '• Piercing: Godlike thrust makes shallow puncture\n• Slashing: Otherworldly cut opens minor wound\n• Bludgeoning: Supernatural strike causes light bruise', type: 'normal' },
            { roll: [16, 17], result: '• Piercing: Cosmic jab slips through defense\n• Slashing: Ethereal swing finds opening\n• Bludgeoning: Astral blow breaks through guard', type: 'success' },
            { roll: [18, 18], result: '• Piercing: Absolute thrust pierces vital organ\n• Slashing: Ultimate cut severs major vessel\n• Bludgeoning: Supreme blow fractures spine', type: 'critical' },
            { roll: [19, 19], result: '• Piercing: Infinite lunge penetrates heart\n• Slashing: Eternal swing decapitates cleanly\n• Bludgeoning: Timeless strike crushes skull', type: 'critical' },
            { roll: [20, 20], result: '• Piercing: Perfect thrust pierces all armor to heart\n• Slashing: Flawless cut cleaves through bone\n• Bludgeoning: Ideal blow pulverizes ribcage', type: 'critical' }
        ]
    },
};
