// Medicine Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total
// Medicine governs diagnosis, treatment, stabilization, and physical care
// Die type represents urgency and difficulty, NOT healing output
// Grounded in realism and tension, not magical healing

export const MEDICINE_TABLES = {
    // UNTRAINED - d4 through d20
    medicine_untrained_d4: {
        name: 'Untrained Medicine (d4)',
        description: 'Untrained medical treatment on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You panic and apply wrong treatment', type: 'failure' },
            { roll: [2, 2], result: 'You slow the bleeding temporarily', type: 'normal' },
            { roll: [3, 3], result: 'You clean and bandage the wound properly', type: 'success' },
            { roll: [4, 4], result: 'You stabilize the injury with basic care', type: 'success' }
        ]
    },
    medicine_untrained_d6: {
        name: 'Untrained Medicine (d6)',
        description: 'Untrained medical treatment on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You contaminate the wound with dirty hands', type: 'failure' },
            { roll: [2, 2], result: 'You apply bandage too loosely, bleeding continues', type: 'failure' },
            { roll: [3, 3], result: 'You hesitate, unsure what to do first', type: 'normal' },
            { roll: [4, 4], result: 'You manage to stop the bleeding slowly', type: 'normal' },
            { roll: [5, 5], result: 'You clean and dress the wound adequately', type: 'success' },
            { roll: [6, 6], result: 'You provide basic but effective first aid', type: 'success' }
        ]
    },
    medicine_untrained_d8: {
        name: 'Untrained Medicine (d8)',
        description: 'Untrained medical treatment on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You worsen the injury with rough handling', type: 'failure' },
            { roll: [2, 2], result: 'You faint at the sight of blood', type: 'failure' },
            { roll: [3, 3], result: 'You misdiagnose the problem completely', type: 'failure' },
            { roll: [4, 4], result: 'You apply pressure but in the wrong place', type: 'failure' },
            { roll: [5, 5], result: 'You stabilize briefly but infection risk remains', type: 'normal' },
            { roll: [6, 6], result: 'You stop bleeding but patient remains weak', type: 'normal' },
            { roll: [7, 7], result: 'You treat the wound with basic competence', type: 'success' },
            { roll: [8, 8], result: 'You manage to stabilize the patient', type: 'success' }
        ]
    },
    medicine_untrained_d10: {
        name: 'Untrained Medicine (d10)',
        description: 'Untrained medical treatment on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You break a vial of medicine in your trembling hands', type: 'failure' },
            { roll: [2, 2], result: 'You trigger more bleeding with clumsy probing', type: 'failure' },
            { roll: [3, 3], result: 'You freeze under pressure, unable to act', type: 'failure' },
            { roll: [4, 4], result: 'You apply wrong herb, causing allergic reaction', type: 'failure' },
            { roll: [5, 5], result: 'You delay too long, condition worsens', type: 'failure' },
            { roll: [6, 6], result: 'You barely slow the deterioration', type: 'normal' },
            { roll: [7, 7], result: 'You stabilize temporarily but prognosis poor', type: 'normal' },
            { roll: [8, 8], result: 'Through luck, you apply correct treatment', type: 'success' },
            { roll: [9, 9], result: 'You manage to prevent immediate death', type: 'success' },
            { roll: [10, 10], result: 'Instinct guides you to the right action', type: 'critical' }
        ]
    },
    medicine_untrained_d12: {
        name: 'Untrained Medicine (d12)',
        description: 'Untrained medical treatment on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You cause fatal hemorrhage with wrong incision', type: 'failure' },
            { roll: [2, 2], result: 'You administer poison thinking it is antidote', type: 'failure' },
            { roll: [3, 3], result: 'You collapse from stress, unable to help', type: 'failure' },
            { roll: [4, 4], result: 'You misidentify the toxin completely', type: 'failure' },
            { roll: [5, 5], result: 'You waste precious time with wrong approach', type: 'failure' },
            { roll: [6, 6], result: 'You slow death but cannot reverse it', type: 'normal' },
            { roll: [7, 7], result: 'You buy a few more minutes of life', type: 'normal' },
            { roll: [8, 8], result: 'You dull the pain without curing cause', type: 'normal' },
            { roll: [9, 9], result: 'You stumble onto correct diagnosis', type: 'success' },
            { roll: [10, 10], result: 'You prevent death through desperate measures', type: 'success' },
            { roll: [11, 11], result: 'Miraculous intuition saves the patient', type: 'success' },
            { roll: [12, 12], result: 'Against all odds, you stabilize them', type: 'critical' }
        ]
    },
    medicine_untrained_d20: {
        name: 'Untrained Medicine (d20)',
        description: 'Untrained medical treatment on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You cause catastrophic organ damage', type: 'failure' },
            { roll: [2, 3], result: 'You spread infection to multiple wounds', type: 'failure' },
            { roll: [4, 5], result: 'You sever critical blood vessel by accident', type: 'failure' },
            { roll: [6, 7], result: 'You induce shock with rough treatment', type: 'failure' },
            { roll: [8, 9], result: 'You exhaust yourself without helping patient', type: 'failure' },
            { roll: [10, 11], result: 'You watch helplessly as they deteriorate', type: 'failure' },
            { roll: [12, 13], result: 'You provide comfort but no medical aid', type: 'failure' },
            { roll: [14, 15], result: 'You delay death by mere moments', type: 'normal' },
            { roll: [16, 16], result: 'You stabilize one symptom while others worsen', type: 'normal' },
            { roll: [17, 17], result: 'You keep them breathing a bit longer', type: 'normal' },
            { roll: [18, 18], result: 'Desperate gamble pays off, they stabilize', type: 'success' },
            { roll: [19, 19], result: 'Pure instinct leads to correct treatment', type: 'success' },
            { roll: [20, 20], result: 'Impossible luck saves them from certain death', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    medicine_novice_d4: {
        name: 'Novice Medicine (d4)',
        description: 'Novice medical treatment on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You apply bandage slightly crooked', type: 'failure' },
            { roll: [2, 2], result: 'You clean and dress the wound properly', type: 'normal' },
            { roll: [3, 3], result: 'You treat the injury with confidence', type: 'success' },
            { roll: [4, 4], result: 'You provide quick and effective care', type: 'success' }
        ]
    },
    medicine_novice_d6: {
        name: 'Novice Medicine (d6)',
        description: 'Novice medical treatment on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You forget to sterilize your tools first', type: 'failure' },
            { roll: [2, 2], result: 'You apply treatment but miss secondary injury', type: 'failure' },
            { roll: [3, 3], result: 'You stop bleeding after several attempts', type: 'normal' },
            { roll: [4, 4], result: 'You stabilize the patient adequately', type: 'normal' },
            { roll: [5, 5], result: 'You treat the wound with proper technique', type: 'success' },
            { roll: [6, 6], result: 'You provide competent first aid', type: 'success' }
        ]
    },
    medicine_novice_d8: {
        name: 'Novice Medicine (d8)',
        description: 'Novice medical treatment on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You tie tourniquet too tight, cutting circulation', type: 'failure' },
            { roll: [2, 2], result: 'You misread symptoms, treat wrong condition', type: 'failure' },
            { roll: [3, 3], result: 'You hesitate, losing valuable time', type: 'failure' },
            { roll: [4, 4], result: 'You stabilize but recovery will be slow', type: 'normal' },
            { roll: [5, 5], result: 'You stop infection from spreading', type: 'normal' },
            { roll: [6, 6], result: 'You treat the injury with solid technique', type: 'success' },
            { roll: [7, 7], result: 'You diagnose and treat correctly', type: 'success' },
            { roll: [8, 8], result: 'You establish clear path to recovery', type: 'critical' }
        ]
    },
    medicine_novice_d10: {
        name: 'Novice Medicine (d10)',
        description: 'Novice medical treatment on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You puncture lung while probing wound', type: 'failure' },
            { roll: [2, 2], result: 'You fail to identify internal bleeding', type: 'failure' },
            { roll: [3, 3], result: 'You treat symptoms but miss root cause', type: 'failure' },
            { roll: [4, 4], result: 'You confuse similar toxins, delay treatment', type: 'failure' },
            { roll: [5, 5], result: 'You stabilize barely, prognosis uncertain', type: 'normal' },
            { roll: [6, 6], result: 'You prevent immediate death but complications remain', type: 'normal' },
            { roll: [7, 7], result: 'You identify the problem and treat it', type: 'success' },
            { roll: [8, 8], result: 'You provide effective emergency care', type: 'success' },
            { roll: [9, 9], result: 'You save them from critical condition', type: 'success' },
            { roll: [10, 10], result: 'You prevent permanent damage with quick action', type: 'critical' }
        ]
    },
    medicine_novice_d12: {
        name: 'Novice Medicine (d12)',
        description: 'Novice medical treatment on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You cause septic shock with contaminated tools', type: 'failure' },
            { roll: [2, 2], result: 'You overdose patient with pain medication', type: 'failure' },
            { roll: [3, 3], result: 'You crack rib while performing compressions', type: 'failure' },
            { roll: [4, 4], result: 'You cannot identify the rare disease', type: 'failure' },
            { roll: [5, 5], result: 'You slow deterioration but cannot stop it', type: 'normal' },
            { roll: [6, 6], result: 'You buy time but need expert help', type: 'normal' },
            { roll: [7, 7], result: 'You stabilize through persistent effort', type: 'normal' },
            { roll: [8, 8], result: 'You correctly diagnose complex condition', type: 'success' },
            { roll: [9, 9], result: 'You treat multiple injuries successfully', type: 'success' },
            { roll: [10, 10], result: 'You save them from grievous wounds', type: 'success' },
            { roll: [11, 11], result: 'You prevent scarring with careful sutures', type: 'critical' },
            { roll: [12, 12], result: 'You achieve full recovery against odds', type: 'critical' }
        ]
    },
    medicine_novice_d20: {
        name: 'Novice Medicine (d20)',
        description: 'Novice medical treatment on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You cause fatal embolism during treatment', type: 'failure' },
            { roll: [2, 3], result: 'You fail to recognize curse masking as illness', type: 'failure' },
            { roll: [4, 5], result: 'You exhaust all remedies without success', type: 'failure' },
            { roll: [6, 7], result: 'You stabilize one organ while another fails', type: 'failure' },
            { roll: [8, 9], result: 'You keep them alive but comatose', type: 'failure' },
            { roll: [10, 11], result: 'You prevent death but permanent injury remains', type: 'normal' },
            { roll: [12, 13], result: 'You stabilize after hours of desperate work', type: 'normal' },
            { roll: [14, 15], result: 'You manage to halt the worst symptoms', type: 'normal' },
            { roll: [16, 16], result: 'You identify hidden cause and treat it', type: 'success' },
            { roll: [17, 17], result: 'You save them through innovative technique', type: 'success' },
            { roll: [18, 18], result: 'You achieve remarkable stabilization', type: 'success' },
            { roll: [19, 19], result: 'You discover cure for complex ailment', type: 'critical' },
            { roll: [20, 20], result: 'You pull them back from certain death', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    medicine_trained_d4: {
        name: 'Trained Medicine (d4)',
        description: 'Trained medical treatment on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You treat the wound efficiently', type: 'normal' },
            { roll: [2, 2], result: 'You provide swift and effective care', type: 'success' },
            { roll: [3, 3], result: 'You treat with practiced precision', type: 'success' },
            { roll: [4, 4], result: 'You ensure rapid recovery', type: 'critical' }
        ]
    },
    medicine_trained_d6: {
        name: 'Trained Medicine (d6)',
        description: 'Trained medical treatment on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You miss minor complication initially', type: 'failure' },
            { roll: [2, 2], result: 'You stabilize with standard procedure', type: 'normal' },
            { roll: [3, 3], result: 'You treat the injury competently', type: 'normal' },
            { roll: [4, 4], result: 'You provide excellent care', type: 'success' },
            { roll: [5, 5], result: 'You ensure clean healing with no infection', type: 'success' },
            { roll: [6, 6], result: 'You achieve textbook perfect treatment', type: 'critical' }
        ]
    },
    medicine_trained_d8: {
        name: 'Trained Medicine (d8)',
        description: 'Trained medical treatment on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You overlook secondary infection risk', type: 'failure' },
            { roll: [2, 2], result: 'You treat adequately but recovery slow', type: 'failure' },
            { roll: [3, 3], result: 'You stabilize with proper technique', type: 'normal' },
            { roll: [4, 4], result: 'You diagnose and treat correctly', type: 'normal' },
            { roll: [5, 5], result: 'You provide skilled medical care', type: 'success' },
            { roll: [6, 6], result: 'You treat multiple injuries efficiently', type: 'success' },
            { roll: [7, 7], result: 'You ensure full recovery with no complications', type: 'success' },
            { roll: [8, 8], result: 'You achieve exceptional healing outcome', type: 'critical' }
        ]
    },
    medicine_trained_d10: {
        name: 'Trained Medicine (d10)',
        description: 'Trained medical treatment on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You struggle with unfamiliar complication', type: 'failure' },
            { roll: [2, 2], result: 'You stabilize but miss underlying issue', type: 'failure' },
            { roll: [3, 3], result: 'You treat symptoms successfully', type: 'failure' },
            { roll: [4, 4], result: 'You prevent immediate danger', type: 'normal' },
            { roll: [5, 5], result: 'You diagnose complex condition correctly', type: 'normal' },
            { roll: [6, 6], result: 'You provide effective emergency treatment', type: 'success' },
            { roll: [7, 7], result: 'You save them from critical injury', type: 'success' },
            { roll: [8, 8], result: 'You treat severe wounds with expertise', type: 'success' },
            { roll: [9, 9], result: 'You prevent permanent damage completely', type: 'success' },
            { roll: [10, 10], result: 'You achieve remarkable recovery', type: 'critical' }
        ]
    },
    medicine_trained_d12: {
        name: 'Trained Medicine (d12)',
        description: 'Trained medical treatment on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You encounter rare complication beyond training', type: 'failure' },
            { roll: [2, 2], result: 'You stabilize but recovery will be difficult', type: 'failure' },
            { roll: [3, 3], result: 'You treat but cannot prevent all damage', type: 'failure' },
            { roll: [4, 4], result: 'You keep them alive through skill', type: 'normal' },
            { roll: [5, 5], result: 'You diagnose rare condition correctly', type: 'normal' },
            { roll: [6, 6], result: 'You treat life-threatening injury successfully', type: 'normal' },
            { roll: [7, 7], result: 'You save them from grievous wounds', type: 'success' },
            { roll: [8, 8], result: 'You prevent infection in deep wounds', type: 'success' },
            { roll: [9, 9], result: 'You ensure complete recovery', type: 'success' },
            { roll: [10, 10], result: 'You treat with masterful precision', type: 'success' },
            { roll: [11, 11], result: 'You prevent scarring with expert sutures', type: 'critical' },
            { roll: [12, 12], result: 'You achieve near-perfect healing', type: 'critical' }
        ]
    },
    medicine_trained_d20: {
        name: 'Trained Medicine (d20)',
        description: 'Trained medical treatment on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You face condition beyond your knowledge', type: 'failure' },
            { roll: [2, 3], result: 'You cannot identify exotic toxin', type: 'failure' },
            { roll: [4, 5], result: 'You stabilize temporarily but relapse likely', type: 'failure' },
            { roll: [6, 7], result: 'You prevent death but permanent injury remains', type: 'failure' },
            { roll: [8, 9], result: 'You keep them alive through long ordeal', type: 'normal' },
            { roll: [10, 11], result: 'You treat multiple critical injuries', type: 'normal' },
            { roll: [12, 13], result: 'You stabilize against overwhelming odds', type: 'normal' },
            { roll: [14, 15], result: 'You save them from near-death', type: 'success' },
            { roll: [16, 16], result: 'You identify hidden cause and cure it', type: 'success' },
            { roll: [17, 17], result: 'You treat complex condition successfully', type: 'success' },
            { roll: [18, 18], result: 'You ensure full recovery from severe trauma', type: 'success' },
            { roll: [19, 19], result: 'You prevent all complications masterfully', type: 'critical' },
            { roll: [20, 20], result: 'You save them from certain death', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    medicine_apprentice_d4: {
        name: 'Apprentice Medicine (d4)',
        description: 'Apprentice medical treatment on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You treat with practiced efficiency', type: 'success' },
            { roll: [2, 2], result: 'You ensure rapid and clean healing', type: 'success' },
            { roll: [3, 3], result: 'You achieve perfect treatment', type: 'critical' },
            { roll: [4, 4], result: 'You prevent any scarring or complications', type: 'critical' }
        ]
    },
    medicine_apprentice_d6: {
        name: 'Apprentice Medicine (d6)',
        description: 'Apprentice medical treatment on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You treat adequately with minor oversight', type: 'normal' },
            { roll: [2, 2], result: 'You provide excellent care', type: 'success' },
            { roll: [3, 3], result: 'You ensure swift recovery', type: 'success' },
            { roll: [4, 4], result: 'You treat with expert precision', type: 'success' },
            { roll: [5, 5], result: 'You achieve flawless healing', type: 'critical' },
            { roll: [6, 6], result: 'You prevent all complications perfectly', type: 'critical' }
        ]
    },
    medicine_apprentice_d8: {
        name: 'Apprentice Medicine (d8)',
        description: 'Apprentice medical treatment on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You encounter unexpected complication', type: 'failure' },
            { roll: [2, 2], result: 'You stabilize with standard technique', type: 'normal' },
            { roll: [3, 3], result: 'You treat the injury skillfully', type: 'normal' },
            { roll: [4, 4], result: 'You diagnose and treat expertly', type: 'success' },
            { roll: [5, 5], result: 'You ensure complete recovery', type: 'success' },
            { roll: [6, 6], result: 'You treat multiple wounds efficiently', type: 'success' },
            { roll: [7, 7], result: 'You achieve exceptional outcome', type: 'success' },
            { roll: [8, 8], result: 'You demonstrate masterful technique', type: 'critical' }
        ]
    },
    medicine_apprentice_d10: {
        name: 'Apprentice Medicine (d10)',
        description: 'Apprentice medical treatment on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You face condition at edge of knowledge', type: 'failure' },
            { roll: [2, 2], result: 'You stabilize but prognosis uncertain', type: 'failure' },
            { roll: [3, 3], result: 'You treat successfully with effort', type: 'normal' },
            { roll: [4, 4], result: 'You diagnose complex condition', type: 'normal' },
            { roll: [5, 5], result: 'You provide expert emergency care', type: 'normal' },
            { roll: [6, 6], result: 'You save them from critical state', type: 'success' },
            { roll: [7, 7], result: 'You treat severe trauma expertly', type: 'success' },
            { roll: [8, 8], result: 'You prevent all permanent damage', type: 'success' },
            { roll: [9, 9], result: 'You achieve remarkable healing', type: 'success' },
            { roll: [10, 10], result: 'You demonstrate exceptional skill', type: 'critical' }
        ]
    },
    medicine_apprentice_d12: {
        name: 'Apprentice Medicine (d12)',
        description: 'Apprentice medical treatment on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You encounter unprecedented complication', type: 'failure' },
            { roll: [2, 2], result: 'You stabilize but recovery will be long', type: 'failure' },
            { roll: [3, 3], result: 'You prevent death but damage remains', type: 'failure' },
            { roll: [4, 4], result: 'You keep them alive through expertise', type: 'normal' },
            { roll: [5, 5], result: 'You diagnose rare disease correctly', type: 'normal' },
            { roll: [6, 6], result: 'You treat life-threatening wounds', type: 'normal' },
            { roll: [7, 7], result: 'You save them from grievous injury', type: 'success' },
            { roll: [8, 8], result: 'You ensure full recovery from trauma', type: 'success' },
            { roll: [9, 9], result: 'You treat with masterful precision', type: 'success' },
            { roll: [10, 10], result: 'You prevent scarring completely', type: 'success' },
            { roll: [11, 11], result: 'You achieve near-miraculous healing', type: 'critical' },
            { roll: [12, 12], result: 'You save them from impossible odds', type: 'critical' }
        ]
    },
    medicine_apprentice_d20: {
        name: 'Apprentice Medicine (d20)',
        description: 'Apprentice medical treatment on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You face condition beyond mortal medicine', type: 'failure' },
            { roll: [2, 3], result: 'You cannot counter exotic curse-disease', type: 'failure' },
            { roll: [4, 5], result: 'You stabilize but relapse inevitable', type: 'failure' },
            { roll: [6, 7], result: 'You prevent death but crippling injury remains', type: 'failure' },
            { roll: [8, 9], result: 'You keep them alive through ordeal', type: 'normal' },
            { roll: [10, 11], result: 'You treat multiple critical wounds', type: 'normal' },
            { roll: [12, 13], result: 'You stabilize against dire odds', type: 'normal' },
            { roll: [14, 15], result: 'You save them from near-certain death', type: 'success' },
            { roll: [16, 16], result: 'You identify and cure hidden ailment', type: 'success' },
            { roll: [17, 17], result: 'You treat impossible condition successfully', type: 'success' },
            { roll: [18, 18], result: 'You ensure complete recovery from trauma', type: 'success' },
            { roll: [19, 19], result: 'You discover innovative treatment', type: 'critical' },
            { roll: [20, 20], result: 'You pull them back from death itself', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    medicine_adept_d4: {
        name: 'Adept Medicine (d4)',
        description: 'Adept medical treatment on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You treat with effortless precision', type: 'success' },
            { roll: [2, 2], result: 'You ensure perfect healing', type: 'critical' },
            { roll: [3, 3], result: 'You prevent any trace of injury', type: 'critical' },
            { roll: [4, 4], result: 'You achieve flawless recovery', type: 'critical' }
        ]
    },
    medicine_adept_d6: {
        name: 'Adept Medicine (d6)',
        description: 'Adept medical treatment on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You treat with practiced ease', type: 'success' },
            { roll: [2, 2], result: 'You ensure rapid recovery', type: 'success' },
            { roll: [3, 3], result: 'You achieve perfect healing', type: 'success' },
            { roll: [4, 4], result: 'You prevent all complications', type: 'critical' },
            { roll: [5, 5], result: 'You demonstrate masterful technique', type: 'critical' },
            { roll: [6, 6], result: 'You achieve legendary healing', type: 'critical' }
        ]
    },
    medicine_adept_d8: {
        name: 'Adept Medicine (d8)',
        description: 'Adept medical treatment on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You face rare complication briefly', type: 'normal' },
            { roll: [2, 2], result: 'You treat with expert skill', type: 'normal' },
            { roll: [3, 3], result: 'You diagnose and cure swiftly', type: 'success' },
            { roll: [4, 4], result: 'You ensure complete recovery', type: 'success' },
            { roll: [5, 5], result: 'You treat multiple injuries expertly', type: 'success' },
            { roll: [6, 6], result: 'You achieve exceptional outcome', type: 'success' },
            { roll: [7, 7], result: 'You demonstrate supreme skill', type: 'critical' },
            { roll: [8, 8], result: 'You achieve perfect healing', type: 'critical' }
        ]
    },
    medicine_adept_d10: {
        name: 'Adept Medicine (d10)',
        description: 'Adept medical treatment on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You encounter complex challenge', type: 'failure' },
            { roll: [2, 2], result: 'You stabilize with focused effort', type: 'normal' },
            { roll: [3, 3], result: 'You treat successfully', type: 'normal' },
            { roll: [4, 4], result: 'You diagnose rare condition', type: 'normal' },
            { roll: [5, 5], result: 'You provide expert care', type: 'success' },
            { roll: [6, 6], result: 'You save from critical injury', type: 'success' },
            { roll: [7, 7], result: 'You treat severe trauma expertly', type: 'success' },
            { roll: [8, 8], result: 'You prevent all permanent damage', type: 'success' },
            { roll: [9, 9], result: 'You achieve remarkable healing', type: 'critical' },
            { roll: [10, 10], result: 'You demonstrate legendary skill', type: 'critical' }
        ]
    },
    medicine_adept_d12: {
        name: 'Adept Medicine (d12)',
        description: 'Adept medical treatment on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You face unprecedented challenge', type: 'failure' },
            { roll: [2, 2], result: 'You stabilize through expertise', type: 'failure' },
            { roll: [3, 3], result: 'You prevent death with skill', type: 'normal' },
            { roll: [4, 4], result: 'You treat life-threatening wounds', type: 'normal' },
            { roll: [5, 5], result: 'You diagnose exotic disease', type: 'normal' },
            { roll: [6, 6], result: 'You save from grievous injury', type: 'success' },
            { roll: [7, 7], result: 'You ensure full recovery', type: 'success' },
            { roll: [8, 8], result: 'You treat with masterful precision', type: 'success' },
            { roll: [9, 9], result: 'You prevent scarring completely', type: 'success' },
            { roll: [10, 10], result: 'You achieve near-miraculous healing', type: 'critical' },
            { roll: [11, 11], result: 'You save from impossible odds', type: 'critical' },
            { roll: [12, 12], result: 'You demonstrate supreme mastery', type: 'critical' }
        ]
    },
    medicine_adept_d20: {
        name: 'Adept Medicine (d20)',
        description: 'Adept medical treatment on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You face limits of mortal medicine', type: 'failure' },
            { roll: [2, 3], result: 'You cannot fully counter supernatural affliction', type: 'failure' },
            { roll: [4, 5], result: 'You stabilize but recovery uncertain', type: 'failure' },
            { roll: [6, 7], result: 'You prevent death but injury lingers', type: 'normal' },
            { roll: [8, 9], result: 'You keep them alive through mastery', type: 'normal' },
            { roll: [10, 11], result: 'You treat multiple critical wounds', type: 'normal' },
            { roll: [12, 13], result: 'You stabilize against overwhelming odds', type: 'success' },
            { roll: [14, 15], result: 'You save from near-certain death', type: 'success' },
            { roll: [16, 16], result: 'You cure hidden supernatural cause', type: 'success' },
            { roll: [17, 17], result: 'You treat impossible condition', type: 'success' },
            { roll: [18, 18], result: 'You ensure complete recovery', type: 'critical' },
            { roll: [19, 19], result: 'You discover groundbreaking cure', type: 'critical' },
            { roll: [20, 20], result: 'You defy death through supreme skill', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    medicine_expert_d4: {
        name: 'Expert Medicine (d4)',
        description: 'Expert medical treatment on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You treat with absolute mastery', type: 'critical' },
            { roll: [2, 2], result: 'You achieve perfect healing instantly', type: 'critical' },
            { roll: [3, 3], result: 'You erase all trace of injury', type: 'critical' },
            { roll: [4, 4], result: 'You demonstrate legendary skill', type: 'critical' }
        ]
    },
    medicine_expert_d6: {
        name: 'Expert Medicine (d6)',
        description: 'Expert medical treatment on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You treat with supreme precision', type: 'success' },
            { roll: [2, 2], result: 'You ensure flawless recovery', type: 'critical' },
            { roll: [3, 3], result: 'You achieve perfect healing', type: 'critical' },
            { roll: [4, 4], result: 'You prevent all complications effortlessly', type: 'critical' },
            { roll: [5, 5], result: 'You demonstrate unmatched expertise', type: 'critical' },
            { roll: [6, 6], result: 'You achieve legendary healing', type: 'critical' }
        ]
    },
    medicine_expert_d8: {
        name: 'Expert Medicine (d8)',
        description: 'Expert medical treatment on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You treat with practiced mastery', type: 'success' },
            { roll: [2, 2], result: 'You ensure swift recovery', type: 'success' },
            { roll: [3, 3], result: 'You diagnose and cure expertly', type: 'success' },
            { roll: [4, 4], result: 'You achieve complete healing', type: 'critical' },
            { roll: [5, 5], result: 'You treat multiple wounds flawlessly', type: 'critical' },
            { roll: [6, 6], result: 'You demonstrate supreme technique', type: 'critical' },
            { roll: [7, 7], result: 'You achieve perfect outcome', type: 'critical' },
            { roll: [8, 8], result: 'You display legendary mastery', type: 'critical' }
        ]
    },
    medicine_expert_d10: {
        name: 'Expert Medicine (d10)',
        description: 'Expert medical treatment on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You face complex challenge briefly', type: 'normal' },
            { roll: [2, 2], result: 'You treat with expert precision', type: 'success' },
            { roll: [3, 3], result: 'You diagnose rare condition swiftly', type: 'success' },
            { roll: [4, 4], result: 'You provide masterful care', type: 'success' },
            { roll: [5, 5], result: 'You save from critical state', type: 'success' },
            { roll: [6, 6], result: 'You treat severe trauma expertly', type: 'critical' },
            { roll: [7, 7], result: 'You prevent all permanent damage', type: 'critical' },
            { roll: [8, 8], result: 'You achieve remarkable healing', type: 'critical' },
            { roll: [9, 9], result: 'You demonstrate legendary skill', type: 'critical' },
            { roll: [10, 10], result: 'You achieve supreme mastery', type: 'critical' }
        ]
    },
    medicine_expert_d12: {
        name: 'Expert Medicine (d12)',
        description: 'Expert medical treatment on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You encounter extreme challenge', type: 'normal' },
            { roll: [2, 2], result: 'You stabilize through mastery', type: 'normal' },
            { roll: [3, 3], result: 'You treat life-threatening wounds', type: 'success' },
            { roll: [4, 4], result: 'You diagnose exotic disease', type: 'success' },
            { roll: [5, 5], result: 'You save from grievous injury', type: 'success' },
            { roll: [6, 6], result: 'You ensure full recovery', type: 'success' },
            { roll: [7, 7], result: 'You treat with perfect precision', type: 'critical' },
            { roll: [8, 8], result: 'You prevent scarring completely', type: 'critical' },
            { roll: [9, 9], result: 'You achieve miraculous healing', type: 'critical' },
            { roll: [10, 10], result: 'You save from impossible odds', type: 'critical' },
            { roll: [11, 11], result: 'You demonstrate supreme expertise', type: 'critical' },
            { roll: [12, 12], result: 'You achieve legendary healing', type: 'critical' }
        ]
    },
    medicine_expert_d20: {
        name: 'Expert Medicine (d20)',
        description: 'Expert medical treatment on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'You face ultimate medical challenge', type: 'failure' },
            { roll: [2, 3], result: 'You struggle against supernatural affliction', type: 'normal' },
            { roll: [4, 5], result: 'You stabilize through supreme skill', type: 'normal' },
            { roll: [6, 7], result: 'You prevent death through mastery', type: 'success' },
            { roll: [8, 9], result: 'You treat multiple critical wounds', type: 'success' },
            { roll: [10, 11], result: 'You stabilize against dire odds', type: 'success' },
            { roll: [12, 13], result: 'You save from certain death', type: 'success' },
            { roll: [14, 15], result: 'You cure supernatural cause', type: 'critical' },
            { roll: [16, 16], result: 'You treat impossible condition', type: 'critical' },
            { roll: [17, 17], result: 'You ensure complete recovery', type: 'critical' },
            { roll: [18, 18], result: 'You discover revolutionary cure', type: 'critical' },
            { roll: [19, 19], result: 'You defy death itself', type: 'critical' },
            { roll: [20, 20], result: 'You achieve legendary miracle', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    medicine_master_d4: {
        name: 'Master Medicine (d4)',
        description: 'Master medical treatment on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You treat with absolute perfection', type: 'critical' },
            { roll: [2, 2], result: 'You achieve instant flawless healing', type: 'critical' },
            { roll: [3, 3], result: 'You erase injury as if it never existed', type: 'critical' },
            { roll: [4, 4], result: 'You demonstrate ultimate mastery', type: 'critical' }
        ]
    },
    medicine_master_d6: {
        name: 'Master Medicine (d6)',
        description: 'Master medical treatment on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You treat with unmatched precision', type: 'critical' },
            { roll: [2, 2], result: 'You ensure perfect recovery', type: 'critical' },
            { roll: [3, 3], result: 'You achieve flawless healing', type: 'critical' },
            { roll: [4, 4], result: 'You prevent all complications effortlessly', type: 'critical' },
            { roll: [5, 5], result: 'You demonstrate supreme mastery', type: 'critical' },
            { roll: [6, 6], result: 'You achieve ultimate healing', type: 'critical' }
        ]
    },
    medicine_master_d8: {
        name: 'Master Medicine (d8)',
        description: 'Master medical treatment on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You treat with absolute mastery', type: 'critical' },
            { roll: [2, 2], result: 'You ensure rapid perfect recovery', type: 'critical' },
            { roll: [3, 3], result: 'You diagnose and cure instantly', type: 'critical' },
            { roll: [4, 4], result: 'You achieve complete healing', type: 'critical' },
            { roll: [5, 5], result: 'You treat multiple wounds flawlessly', type: 'critical' },
            { roll: [6, 6], result: 'You demonstrate ultimate technique', type: 'critical' },
            { roll: [7, 7], result: 'You achieve perfect outcome', type: 'critical' },
            { roll: [8, 8], result: 'You display supreme mastery', type: 'critical' }
        ]
    },
    medicine_master_d10: {
        name: 'Master Medicine (d10)',
        description: 'Master medical treatment on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You treat with practiced perfection', type: 'success' },
            { roll: [2, 2], result: 'You handle challenge effortlessly', type: 'critical' },
            { roll: [3, 3], result: 'You diagnose rare condition instantly', type: 'critical' },
            { roll: [4, 4], result: 'You provide flawless care', type: 'critical' },
            { roll: [5, 5], result: 'You save from critical state easily', type: 'critical' },
            { roll: [6, 6], result: 'You treat severe trauma perfectly', type: 'critical' },
            { roll: [7, 7], result: 'You prevent all permanent damage', type: 'critical' },
            { roll: [8, 8], result: 'You achieve miraculous healing', type: 'critical' },
            { roll: [9, 9], result: 'You demonstrate ultimate skill', type: 'critical' },
            { roll: [10, 10], result: 'You achieve absolute mastery', type: 'critical' }
        ]
    },
    medicine_master_d12: {
        name: 'Master Medicine (d12)',
        description: 'Master medical treatment on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You face ultimate challenge calmly', type: 'success' },
            { roll: [2, 2], result: 'You stabilize through supreme mastery', type: 'success' },
            { roll: [3, 3], result: 'You treat life-threatening wounds perfectly', type: 'critical' },
            { roll: [4, 4], result: 'You diagnose any disease instantly', type: 'critical' },
            { roll: [5, 5], result: 'You save from grievous injury effortlessly', type: 'critical' },
            { roll: [6, 6], result: 'You ensure complete recovery', type: 'critical' },
            { roll: [7, 7], result: 'You treat with absolute precision', type: 'critical' },
            { roll: [8, 8], result: 'You prevent scarring completely', type: 'critical' },
            { roll: [9, 9], result: 'You achieve legendary healing', type: 'critical' },
            { roll: [10, 10], result: 'You save from impossible odds', type: 'critical' },
            { roll: [11, 11], result: 'You demonstrate ultimate expertise', type: 'critical' },
            { roll: [12, 12], result: 'You achieve perfect healing', type: 'critical' }
        ]
    },
    medicine_master_d20: {
        name: 'Master Medicine (d20)',
        description: 'Master medical treatment on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'You face limits of mortal knowledge', type: 'normal' },
            { roll: [2, 3], result: 'You counter supernatural affliction', type: 'success' },
            { roll: [4, 5], result: 'You stabilize through ultimate skill', type: 'success' },
            { roll: [6, 7], result: 'You prevent death through mastery', type: 'critical' },
            { roll: [8, 9], result: 'You treat multiple critical wounds perfectly', type: 'critical' },
            { roll: [10, 11], result: 'You stabilize against impossible odds', type: 'critical' },
            { roll: [12, 13], result: 'You save from certain death', type: 'critical' },
            { roll: [14, 15], result: 'You cure any supernatural cause', type: 'critical' },
            { roll: [16, 16], result: 'You treat impossible condition successfully', type: 'critical' },
            { roll: [17, 17], result: 'You ensure complete recovery from anything', type: 'critical' },
            { roll: [18, 18], result: 'You discover ultimate cure', type: 'critical' },
            { roll: [19, 19], result: 'You defy death itself', type: 'critical' },
            { roll: [20, 20], result: 'You achieve the impossible through supreme mastery', type: 'critical' }
        ]
    }
};


