// Religion Skill Multi-Dimensional Tables
// 7 proficiency levels × 6 dice types = 42 tables total

export const RELIGION_TABLES = {
    // UNTRAINED - d4 through d20
    religion_untrained_d4: {
        name: 'Untrained Religion (d4)',
        description: 'Untrained religious knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You confuse this deity with another, commit grave offense', type: 'failure' },
            { roll: [2, 2], result: 'You misidentify the symbol, show ignorance', type: 'normal' },
            { roll: [3, 3], result: 'You recognize the deity by name only', type: 'success' },
            { roll: [4, 4], result: 'You recall basic domain and common worship practice', type: 'success' }
        ]
    },
    religion_untrained_d6: {
        name: 'Untrained Religion (d6)',
        description: 'Untrained religious knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You attribute power to the wrong god, insult followers', type: 'failure' },
            { roll: [2, 2], result: 'You mistake a sect for a cult, cause offense', type: 'failure' },
            { roll: [3, 3], result: 'You vaguely recall hearing about this faith', type: 'normal' },
            { roll: [4, 4], result: 'You know the deity exists but little else', type: 'normal' },
            { roll: [5, 5], result: 'You identify the symbol and basic domain', type: 'success' },
            { roll: [6, 6], result: 'You recall a popular myth about this deity', type: 'success' }
        ]
    },
    religion_untrained_d8: {
        name: 'Untrained Religion (d8)',
        description: 'Untrained religious knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You misquote scripture badly, offend the faithful', type: 'failure' },
            { roll: [2, 2], result: 'You confuse symbols from different faiths', type: 'failure' },
            { roll: [3, 3], result: 'You mistake heresy for doctrine', type: 'failure' },
            { roll: [4, 4], result: 'You rely on superstition rather than knowledge', type: 'normal' },
            { roll: [5, 5], result: 'You sense this is sacred but know nothing more', type: 'normal' },
            { roll: [6, 6], result: 'You recognize the ritual form but not its meaning', type: 'normal' },
            { roll: [7, 7], result: 'You recall a broad story about this faith', type: 'success' },
            { roll: [8, 8], result: 'You identify the deity and one major tenet', type: 'success' }
        ]
    },
    religion_untrained_d10: {
        name: 'Untrained Religion (d10)',
        description: 'Untrained religious knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You invoke the wrong deity, commit blasphemy', type: 'failure' },
            { roll: [2, 2], result: 'You confuse opposing faiths, dangerous error', type: 'failure' },
            { roll: [3, 4], result: 'You mistake sacred for profane', type: 'failure' },
            { roll: [5, 6], result: 'You are overwhelmed by unfamiliar symbols', type: 'normal' },
            { roll: [7, 7], result: 'You sense divine presence but cannot identify it', type: 'normal' },
            { roll: [8, 8], result: 'You guess correctly through luck', type: 'normal' },
            { roll: [9, 9], result: 'You vaguely recall hearing of this obscure faith', type: 'success' },
            { roll: [10, 10], result: 'You stumble upon the correct interpretation', type: 'success' }
        ]
    },
    religion_untrained_d12: {
        name: 'Untrained Religion (d12)',
        description: 'Untrained religious knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You commit terrible heresy, invoke forbidden name', type: 'failure' },
            { roll: [2, 3], result: 'You attribute miracles to the wrong deity', type: 'failure' },
            { roll: [4, 5], result: 'You confuse ancient faiths, show deep ignorance', type: 'failure' },
            { roll: [6, 7], result: 'You mistake divine symbols for arcane runes', type: 'failure' },
            { roll: [8, 9], result: 'You are completely lost in unfamiliar theology', type: 'normal' },
            { roll: [10, 10], result: 'You sense something sacred but cannot explain it', type: 'normal' },
            { roll: [11, 11], result: 'You make a wild guess that seems plausible', type: 'normal' },
            { roll: [12, 12], result: 'Pure luck reveals a fragment of truth', type: 'success' }
        ]
    },
    religion_untrained_d20: {
        name: 'Untrained Religion (d20)',
        description: 'Untrained religious knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You invoke a forbidden deity, commit grave blasphemy', type: 'failure' },
            { roll: [3, 5], result: 'You confuse primordial faiths, dangerous misunderstanding', type: 'failure' },
            { roll: [6, 8], result: 'You mistake divine law for mortal custom', type: 'failure' },
            { roll: [9, 11], result: 'You are overwhelmed by ancient symbols', type: 'failure' },
            { roll: [12, 14], result: 'You rely on fear and superstition', type: 'failure' },
            { roll: [15, 16], result: 'You sense great power but understand nothing', type: 'normal' },
            { roll: [17, 17], result: 'You recognize this is beyond your knowledge', type: 'normal' },
            { roll: [18, 18], result: 'You make an educated guess based on rumors', type: 'normal' },
            { roll: [19, 19], result: 'Miraculous insight reveals a tiny fragment', type: 'success' },
            { roll: [20, 20], result: 'Against all odds, you grasp a basic truth', type: 'critical' }
        ]
    },

    // NOVICE - d4 through d20
    religion_novice_d4: {
        name: 'Novice Religion (d4)',
        description: 'Novice religious knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You confuse similar deities, minor error', type: 'failure' },
            { roll: [2, 2], result: 'You identify the deity and domain correctly', type: 'normal' },
            { roll: [3, 3], result: 'You recall the deity, domain, and common practices', type: 'success' },
            { roll: [4, 4], result: 'You explain the basic theology clearly', type: 'success' }
        ]
    },
    religion_novice_d6: {
        name: 'Novice Religion (d6)',
        description: 'Novice religious knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You mistake a minor sect for the main faith', type: 'failure' },
            { roll: [2, 2], result: 'You recall the symbol but not its full meaning', type: 'normal' },
            { roll: [3, 3], result: 'You identify the deity and basic tenets', type: 'normal' },
            { roll: [4, 4], result: 'You recall a well-known myth accurately', type: 'success' },
            { roll: [5, 5], result: 'You explain the ritual purpose correctly', type: 'success' },
            { roll: [6, 6], result: 'You identify the faith and its regional variations', type: 'success' }
        ]
    },
    religion_novice_d8: {
        name: 'Novice Religion (d8)',
        description: 'Novice religious knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You confuse the sect with a similar one', type: 'failure' },
            { roll: [2, 2], result: 'You misinterpret the symbolic meaning', type: 'failure' },
            { roll: [3, 3], result: 'You recognize the faith but recall little detail', type: 'normal' },
            { roll: [4, 4], result: 'You identify the deity and one major teaching', type: 'normal' },
            { roll: [5, 5], result: 'You recall the ritual form and basic purpose', type: 'normal' },
            { roll: [6, 6], result: 'You explain the core doctrine accurately', type: 'success' },
            { roll: [7, 7], result: 'You identify the sect and its beliefs', type: 'success' },
            { roll: [8, 8], result: 'You recall a lesser-known myth correctly', type: 'success' }
        ]
    },
    religion_novice_d10: {
        name: 'Novice Religion (d10)',
        description: 'Novice religious knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You mistake heretical teaching for orthodox doctrine', type: 'failure' },
            { roll: [2, 2], result: 'You confuse obscure symbols', type: 'failure' },
            { roll: [3, 4], result: 'You recognize the faith but lack deeper knowledge', type: 'normal' },
            { roll: [5, 6], result: 'You recall fragments of the teaching', type: 'normal' },
            { roll: [7, 7], result: 'You identify the obscure sect correctly', type: 'normal' },
            { roll: [8, 8], result: 'You explain the doctrine with minor gaps', type: 'success' },
            { roll: [9, 9], result: 'You recall an ancient text passage', type: 'success' },
            { roll: [10, 10], result: 'You identify the faith and its historical context', type: 'success' }
        ]
    },
    religion_novice_d12: {
        name: 'Novice Religion (d12)',
        description: 'Novice religious knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You confuse ancient faiths, serious error', type: 'failure' },
            { roll: [2, 3], result: 'You misidentify the deity entirely', type: 'failure' },
            { roll: [4, 5], result: 'You mistake the symbols for another faith', type: 'failure' },
            { roll: [6, 7], result: 'You sense this is old but know little more', type: 'normal' },
            { roll: [8, 9], result: 'You vaguely recall hearing of this faith', type: 'normal' },
            { roll: [10, 10], result: 'You identify the general tradition', type: 'normal' },
            { roll: [11, 11], result: 'You recall a fragment of ancient doctrine', type: 'success' },
            { roll: [12, 12], result: 'You piece together the basic theology', type: 'success' }
        ]
    },
    religion_novice_d20: {
        name: 'Novice Religion (d20)',
        description: 'Novice religious knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'You invoke forbidden names, commit heresy', type: 'failure' },
            { roll: [3, 5], result: 'You confuse primordial deities', type: 'failure' },
            { roll: [6, 8], result: 'You mistake divine symbols for arcane marks', type: 'failure' },
            { roll: [9, 11], result: 'You are overwhelmed by ancient theology', type: 'failure' },
            { roll: [12, 14], result: 'You sense great age but understand little', type: 'normal' },
            { roll: [15, 16], result: 'You recognize this is beyond common knowledge', type: 'normal' },
            { roll: [17, 17], result: 'You recall a rumor about this lost faith', type: 'normal' },
            { roll: [18, 18], result: 'You identify the tradition correctly', type: 'success' },
            { roll: [19, 19], result: 'You recall a fragment of forgotten scripture', type: 'success' },
            { roll: [20, 20], result: 'You grasp the core principle through study', type: 'critical' }
        ]
    },

    // TRAINED - d4 through d20
    religion_trained_d4: {
        name: 'Trained Religion (d4)',
        description: 'Trained religious knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You overlook a minor detail', type: 'failure' },
            { roll: [2, 2], result: 'You identify the deity, domain, and practices', type: 'normal' },
            { roll: [3, 3], result: 'You explain the theology and common rituals', type: 'success' },
            { roll: [4, 4], result: 'You recall the full myth and its meaning', type: 'success' }
        ]
    },
    religion_trained_d6: {
        name: 'Trained Religion (d6)',
        description: 'Trained religious knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You confuse minor sects', type: 'failure' },
            { roll: [2, 2], result: 'You identify the faith and basic doctrine', type: 'normal' },
            { roll: [3, 3], result: 'You recall the deity and major teachings', type: 'normal' },
            { roll: [4, 4], result: 'You explain the ritual and its purpose', type: 'success' },
            { roll: [5, 5], result: 'You identify regional variations accurately', type: 'success' },
            { roll: [6, 6], result: 'You recall multiple myths and their lessons', type: 'success' }
        ]
    },
    religion_trained_d8: {
        name: 'Trained Religion (d8)',
        description: 'Trained religious knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You mistake a subtle doctrinal difference', type: 'failure' },
            { roll: [2, 2], result: 'You misinterpret symbolic layering', type: 'failure' },
            { roll: [3, 3], result: 'You identify the sect and basic beliefs', type: 'normal' },
            { roll: [4, 4], result: 'You recall the core doctrine accurately', type: 'normal' },
            { roll: [5, 5], result: 'You explain the ritual significance', type: 'success' },
            { roll: [6, 6], result: 'You identify the sect lineage correctly', type: 'success' },
            { roll: [7, 7], result: 'You recall obscure teachings accurately', type: 'success' },
            { roll: [8, 8], result: 'You explain the theological nuances', type: 'success' }
        ]
    },
    religion_trained_d10: {
        name: 'Trained Religion (d10)',
        description: 'Trained religious knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You confuse heretical and orthodox teachings', type: 'failure' },
            { roll: [2, 2], result: 'You misread ancient symbols', type: 'failure' },
            { roll: [3, 3], result: 'You identify the obscure faith correctly', type: 'normal' },
            { roll: [4, 5], result: 'You recall fragments of the doctrine', type: 'normal' },
            { roll: [6, 6], result: 'You explain the teaching with clarity', type: 'normal' },
            { roll: [7, 7], result: 'You identify the sect and its history', type: 'success' },
            { roll: [8, 8], result: 'You recall ancient texts accurately', type: 'success' },
            { roll: [9, 9], result: 'You explain complex theological concepts', type: 'success' },
            { roll: [10, 10], result: 'You trace the doctrinal lineage correctly', type: 'success' }
        ]
    },
    religion_trained_d12: {
        name: 'Trained Religion (d12)',
        description: 'Trained religious knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You mistake ancient faiths for each other', type: 'failure' },
            { roll: [2, 2], result: 'You confuse primordial symbols', type: 'failure' },
            { roll: [3, 4], result: 'You identify the tradition but lack detail', type: 'normal' },
            { roll: [5, 6], result: 'You recall the general theology', type: 'normal' },
            { roll: [7, 7], result: 'You piece together the doctrine', type: 'normal' },
            { roll: [8, 8], result: 'You identify the ancient faith correctly', type: 'success' },
            { roll: [9, 9], result: 'You recall forgotten scripture passages', type: 'success' },
            { roll: [10, 10], result: 'You explain the lost teaching accurately', type: 'success' },
            { roll: [11, 11], result: 'You trace the faith through history', type: 'success' },
            { roll: [12, 12], result: 'You understand the theological evolution', type: 'critical' }
        ]
    },
    religion_trained_d20: {
        name: 'Trained Religion (d20)',
        description: 'Trained religious knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'You invoke forbidden names unknowingly', type: 'failure' },
            { roll: [3, 4], result: 'You confuse primordial deities', type: 'failure' },
            { roll: [5, 7], result: 'You mistake divine symbols for mortal marks', type: 'failure' },
            { roll: [8, 10], result: 'You are challenged by the complexity', type: 'normal' },
            { roll: [11, 12], result: 'You identify the tradition generally', type: 'normal' },
            { roll: [13, 14], result: 'You recall fragments of lost doctrine', type: 'normal' },
            { roll: [15, 15], result: 'You piece together the ancient faith', type: 'success' },
            { roll: [16, 16], result: 'You recall primordial scripture', type: 'success' },
            { roll: [17, 17], result: 'You explain the forgotten theology', type: 'success' },
            { roll: [18, 18], result: 'You trace divine lineage accurately', type: 'success' },
            { roll: [19, 19], result: 'You understand the cosmic principle', type: 'critical' },
            { roll: [20, 20], result: 'You grasp the primordial truth', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 through d20
    religion_apprentice_d4: {
        name: 'Apprentice Religion (d4)',
        description: 'Apprentice religious knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You overlook a subtle nuance', type: 'failure' },
            { roll: [2, 2], result: 'You explain the theology comprehensively', type: 'normal' },
            { roll: [3, 3], result: 'You recall the full myth and its interpretations', type: 'success' },
            { roll: [4, 4], result: 'You identify all regional variations', type: 'success' }
        ]
    },
    religion_apprentice_d6: {
        name: 'Apprentice Religion (d6)',
        description: 'Apprentice religious knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You miss a minor doctrinal point', type: 'failure' },
            { roll: [2, 2], result: 'You explain the faith and its practices', type: 'normal' },
            { roll: [3, 3], result: 'You recall the deity and all major teachings', type: 'normal' },
            { roll: [4, 4], result: 'You explain ritual symbolism in depth', type: 'success' },
            { roll: [5, 5], result: 'You identify all sects and their differences', type: 'success' },
            { roll: [6, 6], result: 'You recall multiple myths and their connections', type: 'success' }
        ]
    },
    religion_apprentice_d8: {
        name: 'Apprentice Religion (d8)',
        description: 'Apprentice religious knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You confuse subtle theological distinctions', type: 'failure' },
            { roll: [2, 2], result: 'You identify the sect and its beliefs', type: 'normal' },
            { roll: [3, 3], result: 'You recall the doctrine accurately', type: 'normal' },
            { roll: [4, 4], result: 'You explain the ritual and its layers', type: 'success' },
            { roll: [5, 5], result: 'You trace the sect lineage through history', type: 'success' },
            { roll: [6, 6], result: 'You recall obscure texts accurately', type: 'success' },
            { roll: [7, 7], result: 'You explain theological debates clearly', type: 'success' },
            { roll: [8, 8], result: 'You identify doctrinal evolution', type: 'critical' }
        ]
    },
    religion_apprentice_d10: {
        name: 'Apprentice Religion (d10)',
        description: 'Apprentice religious knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You mistake heresy for lost doctrine', type: 'failure' },
            { roll: [2, 2], result: 'You misread complex symbols', type: 'failure' },
            { roll: [3, 3], result: 'You identify the obscure faith', type: 'normal' },
            { roll: [4, 4], result: 'You recall the teaching with minor gaps', type: 'normal' },
            { roll: [5, 5], result: 'You explain the doctrine clearly', type: 'normal' },
            { roll: [6, 6], result: 'You identify the sect and its schisms', type: 'success' },
            { roll: [7, 7], result: 'You recall ancient scripture accurately', type: 'success' },
            { roll: [8, 8], result: 'You explain complex theology', type: 'success' },
            { roll: [9, 9], result: 'You trace doctrinal lineage precisely', type: 'success' },
            { roll: [10, 10], result: 'You identify hidden theological connections', type: 'critical' }
        ]
    },
    religion_apprentice_d12: {
        name: 'Apprentice Religion (d12)',
        description: 'Apprentice religious knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You confuse ancient faiths', type: 'failure' },
            { roll: [2, 2], result: 'You misinterpret primordial symbols', type: 'failure' },
            { roll: [3, 3], result: 'You identify the tradition', type: 'normal' },
            { roll: [4, 5], result: 'You recall the general theology', type: 'normal' },
            { roll: [6, 6], result: 'You piece together the doctrine', type: 'normal' },
            { roll: [7, 7], result: 'You identify the ancient faith', type: 'success' },
            { roll: [8, 8], result: 'You recall forgotten texts', type: 'success' },
            { roll: [9, 9], result: 'You explain lost teachings', type: 'success' },
            { roll: [10, 10], result: 'You trace the faith through ages', type: 'success' },
            { roll: [11, 11], result: 'You understand theological shifts', type: 'critical' },
            { roll: [12, 12], result: 'You discern hidden heresy', type: 'critical' }
        ]
    },
    religion_apprentice_d20: {
        name: 'Apprentice Religion (d20)',
        description: 'Apprentice religious knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'You invoke forbidden names', type: 'failure' },
            { roll: [2, 3], result: 'You confuse primordial deities', type: 'failure' },
            { roll: [4, 5], result: 'You mistake divine for mortal', type: 'failure' },
            { roll: [6, 8], result: 'You struggle with the complexity', type: 'normal' },
            { roll: [9, 10], result: 'You identify the tradition', type: 'normal' },
            { roll: [11, 12], result: 'You recall fragments of lost doctrine', type: 'normal' },
            { roll: [13, 14], result: 'You piece together the ancient faith', type: 'success' },
            { roll: [15, 15], result: 'You recall primordial scripture', type: 'success' },
            { roll: [16, 16], result: 'You explain forgotten theology', type: 'success' },
            { roll: [17, 17], result: 'You trace divine ancestry', type: 'success' },
            { roll: [18, 18], result: 'You understand cosmic principles', type: 'critical' },
            { roll: [19, 19], result: 'You grasp primordial truths', type: 'critical' },
            { roll: [20, 20], result: 'You sense divine influence at work', type: 'critical' }
        ]
    },

    // ADEPT - d4 through d20
    religion_adept_d4: {
        name: 'Adept Religion (d4)',
        description: 'Adept religious knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You note a minor inconsistency', type: 'failure' },
            { roll: [2, 2], result: 'You explain the theology with full context', type: 'success' },
            { roll: [3, 3], result: 'You recall all myths and their meanings', type: 'success' },
            { roll: [4, 4], result: 'You identify all variations and their origins', type: 'critical' }
        ]
    },
    religion_adept_d6: {
        name: 'Adept Religion (d6)',
        description: 'Adept religious knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You overlook a subtle detail', type: 'failure' },
            { roll: [2, 2], result: 'You explain the faith comprehensively', type: 'normal' },
            { roll: [3, 3], result: 'You recall all teachings and their context', type: 'success' },
            { roll: [4, 4], result: 'You explain ritual symbolism deeply', type: 'success' },
            { roll: [5, 5], result: 'You identify all sects and their histories', type: 'success' },
            { roll: [6, 6], result: 'You trace theological evolution clearly', type: 'critical' }
        ]
    },
    religion_adept_d8: {
        name: 'Adept Religion (d8)',
        description: 'Adept religious knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You miss a nuanced distinction', type: 'failure' },
            { roll: [2, 2], result: 'You identify the sect and all beliefs', type: 'normal' },
            { roll: [3, 3], result: 'You recall the doctrine with full detail', type: 'success' },
            { roll: [4, 4], result: 'You explain ritual layers completely', type: 'success' },
            { roll: [5, 5], result: 'You trace sect lineage precisely', type: 'success' },
            { roll: [6, 6], result: 'You recall obscure texts with context', type: 'success' },
            { roll: [7, 7], result: 'You explain theological debates expertly', type: 'critical' },
            { roll: [8, 8], result: 'You identify doctrinal shifts and causes', type: 'critical' }
        ]
    },
    religion_adept_d10: {
        name: 'Adept Religion (d10)',
        description: 'Adept religious knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You confuse subtle heretical variations', type: 'failure' },
            { roll: [2, 2], result: 'You identify the obscure faith', type: 'normal' },
            { roll: [3, 3], result: 'You recall the teaching accurately', type: 'normal' },
            { roll: [4, 4], result: 'You explain the doctrine fully', type: 'success' },
            { roll: [5, 5], result: 'You identify all sect schisms', type: 'success' },
            { roll: [6, 6], result: 'You recall ancient scripture with context', type: 'success' },
            { roll: [7, 7], result: 'You explain complex theology clearly', type: 'success' },
            { roll: [8, 8], result: 'You trace doctrinal lineage completely', type: 'critical' },
            { roll: [9, 9], result: 'You identify hidden connections', type: 'critical' },
            { roll: [10, 10], result: 'You predict faith behavior accurately', type: 'critical' }
        ]
    },
    religion_adept_d12: {
        name: 'Adept Religion (d12)',
        description: 'Adept religious knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You mistake ancient faith variations', type: 'failure' },
            { roll: [2, 2], result: 'You identify the tradition', type: 'normal' },
            { roll: [3, 3], result: 'You recall the theology', type: 'normal' },
            { roll: [4, 4], result: 'You piece together the doctrine', type: 'success' },
            { roll: [5, 5], result: 'You identify the ancient faith', type: 'success' },
            { roll: [6, 6], result: 'You recall forgotten texts', type: 'success' },
            { roll: [7, 7], result: 'You explain lost teachings', type: 'success' },
            { roll: [8, 8], result: 'You trace the faith through history', type: 'success' },
            { roll: [9, 9], result: 'You understand theological evolution', type: 'critical' },
            { roll: [10, 10], result: 'You discern hidden heresy', type: 'critical' },
            { roll: [11, 11], result: 'You uncover forgotten tenets', type: 'critical' },
            { roll: [12, 12], result: 'You sense divine patterns', type: 'critical' }
        ]
    },
    religion_adept_d20: {
        name: 'Adept Religion (d20)',
        description: 'Adept religious knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'You invoke forbidden names unknowingly', type: 'failure' },
            { roll: [2, 2], result: 'You confuse primordial deities', type: 'failure' },
            { roll: [3, 4], result: 'You mistake divine for mortal', type: 'normal' },
            { roll: [5, 6], result: 'You identify the tradition', type: 'normal' },
            { roll: [7, 8], result: 'You recall fragments of lost doctrine', type: 'normal' },
            { roll: [9, 10], result: 'You piece together the ancient faith', type: 'success' },
            { roll: [11, 11], result: 'You recall primordial scripture', type: 'success' },
            { roll: [12, 12], result: 'You explain forgotten theology', type: 'success' },
            { roll: [13, 13], result: 'You trace divine ancestry', type: 'success' },
            { roll: [14, 14], result: 'You understand cosmic principles', type: 'critical' },
            { roll: [15, 15], result: 'You grasp primordial truths', type: 'critical' },
            { roll: [16, 16], result: 'You sense divine influence at work', type: 'critical' },
            { roll: [17, 18], result: 'You predict faith behavior', type: 'critical' },
            { roll: [19, 20], result: 'You uncover lost divine knowledge', type: 'critical' }
        ]
    },

    // EXPERT - d4 through d20
    religion_expert_d4: {
        name: 'Expert Religion (d4)',
        description: 'Expert religious knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You explain the theology with scholarly depth', type: 'success' },
            { roll: [3, 3], result: 'You recall all myths and their cultural context', type: 'critical' },
            { roll: [4, 4], result: 'You trace all variations to their sources', type: 'critical' }
        ]
    },
    religion_expert_d6: {
        name: 'Expert Religion (d6)',
        description: 'Expert religious knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You explain the faith with full scholarship', type: 'success' },
            { roll: [3, 3], result: 'You recall all teachings and their evolution', type: 'success' },
            { roll: [4, 4], result: 'You explain ritual symbolism completely', type: 'success' },
            { roll: [5, 5], result: 'You identify all sects and their lineages', type: 'critical' },
            { roll: [6, 6], result: 'You trace theological shifts through ages', type: 'critical' }
        ]
    },
    religion_expert_d8: {
        name: 'Expert Religion (d8)',
        description: 'Expert religious knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You identify the sect and all beliefs', type: 'success' },
            { roll: [3, 3], result: 'You recall the doctrine with scholarly precision', type: 'success' },
            { roll: [4, 4], result: 'You explain ritual layers with full context', type: 'success' },
            { roll: [5, 5], result: 'You trace sect lineage through history', type: 'success' },
            { roll: [6, 6], result: 'You recall obscure texts and their meanings', type: 'critical' },
            { roll: [7, 7], result: 'You explain theological debates masterfully', type: 'critical' },
            { roll: [8, 8], result: 'You identify doctrinal shifts and predict trends', type: 'critical' }
        ]
    },
    religion_expert_d10: {
        name: 'Expert Religion (d10)',
        description: 'Expert religious knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You identify the obscure faith', type: 'success' },
            { roll: [3, 3], result: 'You recall the teaching with full detail', type: 'success' },
            { roll: [4, 4], result: 'You explain the doctrine comprehensively', type: 'success' },
            { roll: [5, 5], result: 'You identify all sect schisms and causes', type: 'success' },
            { roll: [6, 6], result: 'You recall ancient scripture with context', type: 'success' },
            { roll: [7, 7], result: 'You explain complex theology expertly', type: 'critical' },
            { roll: [8, 8], result: 'You trace doctrinal lineage completely', type: 'critical' },
            { roll: [9, 9], result: 'You identify hidden theological connections', type: 'critical' },
            { roll: [10, 10], result: 'You predict faith behavior with precision', type: 'critical' }
        ]
    },
    religion_expert_d12: {
        name: 'Expert Religion (d12)',
        description: 'Expert religious knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You recall the theology', type: 'success' },
            { roll: [3, 3], result: 'You piece together the doctrine', type: 'success' },
            { roll: [4, 4], result: 'You identify the ancient faith', type: 'success' },
            { roll: [5, 5], result: 'You recall forgotten texts', type: 'success' },
            { roll: [6, 6], result: 'You explain lost teachings', type: 'success' },
            { roll: [7, 7], result: 'You trace the faith through ages', type: 'critical' },
            { roll: [8, 8], result: 'You understand theological evolution', type: 'critical' },
            { roll: [9, 9], result: 'You discern hidden heresy', type: 'critical' },
            { roll: [10, 10], result: 'You uncover forgotten tenets', type: 'critical' },
            { roll: [11, 11], result: 'You sense divine patterns clearly', type: 'critical' },
            { roll: [12, 12], result: 'You trace divine ancestry precisely', type: 'critical' }
        ]
    },
    religion_expert_d20: {
        name: 'Expert Religion (d20)',
        description: 'Expert religious knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 3], result: 'You identify the tradition', type: 'success' },
            { roll: [4, 5], result: 'You recall fragments of lost doctrine', type: 'success' },
            { roll: [6, 7], result: 'You piece together the ancient faith', type: 'success' },
            { roll: [8, 9], result: 'You recall primordial scripture', type: 'success' },
            { roll: [10, 10], result: 'You explain forgotten theology', type: 'success' },
            { roll: [11, 11], result: 'You trace divine ancestry', type: 'critical' },
            { roll: [12, 12], result: 'You understand cosmic principles', type: 'critical' },
            { roll: [13, 13], result: 'You grasp primordial truths', type: 'critical' },
            { roll: [14, 14], result: 'You sense divine influence at work', type: 'critical' },
            { roll: [15, 16], result: 'You predict faith behavior accurately', type: 'critical' },
            { roll: [17, 18], result: 'You uncover lost divine knowledge', type: 'critical' },
            { roll: [19, 20], result: 'You comprehend the divine mystery', type: 'critical' }
        ]
    },

    // MASTER - d4 through d20
    religion_master_d4: {
        name: 'Master Religion (d4)',
        description: 'Master religious knowledge on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You recall all myths and their interconnections', type: 'critical' },
            { roll: [3, 3], result: 'You trace all variations to primordial sources', type: 'critical' },
            { roll: [4, 4], result: 'You reveal hidden theological patterns', type: 'critical' }
        ]
    },
    religion_master_d6: {
        name: 'Master Religion (d6)',
        description: 'Master religious knowledge on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You recall all teachings and their origins', type: 'success' },
            { roll: [3, 3], result: 'You explain ritual symbolism in full context', type: 'critical' },
            { roll: [4, 4], result: 'You identify all sects and their connections', type: 'critical' },
            { roll: [5, 5], result: 'You trace theological evolution completely', type: 'critical' },
            { roll: [6, 6], result: 'You predict future doctrinal shifts', type: 'critical' }
        ]
    },
    religion_master_d8: {
        name: 'Master Religion (d8)',
        description: 'Master religious knowledge on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You recall the doctrine with perfect precision', type: 'success' },
            { roll: [3, 3], result: 'You explain ritual layers completely', type: 'success' },
            { roll: [4, 4], result: 'You trace sect lineage through all ages', type: 'critical' },
            { roll: [5, 5], result: 'You recall obscure texts and their context', type: 'critical' },
            { roll: [6, 6], result: 'You explain theological debates masterfully', type: 'critical' },
            { roll: [7, 7], result: 'You identify doctrinal shifts and causes', type: 'critical' },
            { roll: [8, 8], result: 'You uncover hidden theological truths', type: 'critical' }
        ]
    },
    religion_master_d10: {
        name: 'Master Religion (d10)',
        description: 'Master religious knowledge on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You recall the teaching with full detail', type: 'success' },
            { roll: [3, 3], result: 'You explain the doctrine comprehensively', type: 'success' },
            { roll: [4, 4], result: 'You identify all sect schisms and causes', type: 'critical' },
            { roll: [5, 5], result: 'You recall ancient scripture with full context', type: 'critical' },
            { roll: [6, 6], result: 'You explain complex theology with clarity', type: 'critical' },
            { roll: [7, 7], result: 'You trace doctrinal lineage perfectly', type: 'critical' },
            { roll: [8, 8], result: 'You identify all hidden connections', type: 'critical' },
            { roll: [9, 9], result: 'You predict faith behavior with certainty', type: 'critical' },
            { roll: [10, 10], result: 'You sense divine influence clearly', type: 'critical' }
        ]
    },
    religion_master_d12: {
        name: 'Master Religion (d12)',
        description: 'Master religious knowledge on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You piece together the doctrine', type: 'success' },
            { roll: [3, 3], result: 'You identify the ancient faith', type: 'success' },
            { roll: [4, 4], result: 'You recall forgotten texts', type: 'critical' },
            { roll: [5, 5], result: 'You explain lost teachings', type: 'critical' },
            { roll: [6, 6], result: 'You trace the faith through all ages', type: 'critical' },
            { roll: [7, 7], result: 'You understand theological evolution', type: 'critical' },
            { roll: [8, 8], result: 'You discern all hidden heresy', type: 'critical' },
            { roll: [9, 9], result: 'You uncover all forgotten tenets', type: 'critical' },
            { roll: [10, 10], result: 'You sense divine patterns perfectly', type: 'critical' },
            { roll: [11, 11], result: 'You trace divine ancestry completely', type: 'critical' },
            { roll: [12, 12], result: 'You comprehend the divine plan', type: 'critical' }
        ]
    },
    religion_master_d20: {
        name: 'Master Religion (d20)',
        description: 'Master religious knowledge on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You recall fragments of lost doctrine', type: 'success' },
            { roll: [3, 3], result: 'You piece together the ancient faith', type: 'success' },
            { roll: [4, 4], result: 'You recall primordial scripture', type: 'critical' },
            { roll: [5, 5], result: 'You explain forgotten theology', type: 'critical' },
            { roll: [6, 6], result: 'You trace divine ancestry', type: 'critical' },
            { roll: [7, 7], result: 'You understand cosmic principles', type: 'critical' },
            { roll: [8, 8], result: 'You grasp primordial truths', type: 'critical' },
            { roll: [9, 9], result: 'You sense divine influence at work', type: 'critical' },
            { roll: [10, 10], result: 'You predict faith behavior perfectly', type: 'critical' },
            { roll: [11, 11], result: 'You uncover lost divine knowledge', type: 'critical' },
            { roll: [12, 12], result: 'You comprehend the divine mystery', type: 'critical' },
            { roll: [13, 14], result: 'You reveal the cosmic order', type: 'critical' },
            { roll: [15, 16], result: 'You understand the divine hierarchy', type: 'critical' },
            { roll: [17, 18], result: 'You trace all faiths to their source', type: 'critical' },
            { roll: [19, 20], result: 'You achieve theological enlightenment', type: 'critical' }
        ]
    }
};

