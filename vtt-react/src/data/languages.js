/**
 * Mythrill Languages Data Module
 *
 * Single source of truth for all languages available in Mythrill VTT.
 * Replaces D&D-generic names with Mythrill-native equivalents.
 *
 * Phase 4 (2026-06-10): 10 D&D-generic languages replaced, 5 missing race languages added.
 */

export const LANGUAGES = [
    // ===== STANDARD LANGUAGES =====
    {
        name: 'Common',
        icon: 'fa-users',
        category: 'standard',
        description: 'The universal trade language spoken across all seven regions. Born from the necessity of communication after the Dark Bargains fractured every noble house. Clear and straightforward.',
        sound: 'Clear and straightforward, with familiar vowel patterns and common consonant sounds.',
        example: 'Well met, good merchant',
        translation: 'Well met, good merchant'
    },
    {
        name: 'Deep-Thrum',
        icon: 'fa-mountain',
        category: 'standard',
        description: 'The slow, grinding geological language of the Cragjaw Peaks\' mineral consciousness and the ancient Thrumm stone-trolls who predate all surface races. Each word is a seismic event; a full sentence may take minutes. Hard consonants like shifting granite, chest-rumbling syllables with long silences between that feel like tectonic drift. The mountain itself rumbles in reply.',
        sound: 'Deep and grinding, like stone plates shifting. Syllables that feel like distant avalanches, punctuated by grinding pauses that can stretch for heartbeats.',
        example: 'THRUM... KA... DUR',
        translation: 'The mountain acknowledges your passage. Stone remembers, stone endures.'
    },    {
        name: 'Synod-Speak',
        icon: 'fa-tree',
        category: 'standard',
        description: 'The resonant harmonic language of the Synod-Hold\'s crystal-lattice archives in Sundrift Vale. Constellation-spirits speak in its overtones; Astril scholars use it for formal discourse. Each word vibrates at a frequency that memory-glass can store.',
        sound: 'Harmonic and crystalline, with overtones that shimmer like light through prismatic glass. Words ring and sustain.',
        example: 'Syl-velen aeth-mir',
        translation: 'Light remembers, spirit endures'
    },
    {
        name: 'Scrap-Tongue',
        icon: 'fa-spider',
        category: 'standard',
        description: 'The salvage-patois of the Frostwood Reach\'s lesser fae, peat-bog scavengers, and the Revel\'s abandoned courtiers who never left the party. A practical language of improvisation and barter, borrowing freely from every tongue it touches. No two speakers sound alike.',
        sound: 'Harsh yet adaptable, with sharp consonants borrowed from a dozen languages and nasal tones that carry through the fog.',
        example: 'Kik-scrap grosh-barter! Teek tak!',
        translation: 'Quick salvage, good trade! I take!'
    },
    {
        name: 'Mound-Tongue',
        icon: 'fa-house',
        category: 'standard',
        description: 'The throat-sung nomadic language of the Ordan steppe-peoples of Sundrift Vale. Carries across the grasslands in harmonic overtones that seem to hum from the ancestor-mounds themselves. Used to navigate when the sky offers no stars.',
        sound: 'Throat-sung and resonant, with harmonic overtones that carry for miles across open steppe. Warm and rolling.',
        example: 'Oor-dan valen hum-eth',
        translation: 'The ancestors sing beneath our feet'
    },

    // ===== EXOTIC LANGUAGES =====
    {
        name: 'Abyssal',
        icon: 'fa-fire',
        category: 'exotic',
        description: 'The corrupted tongue of Keth-Amar\'s void-spawn and demonic intelligences. Scathrach the Ashen Sovereign speaks it in Emberspire\'s deepest volcanic vent. Burns the throat of mortal speakers and leaves ash-taste for days.',
        sound: 'Corrupted and searing, with sounds that seem to scorch the air. Each word carries volcanic heat.',
        example: 'X\'keth-vorath ix\'amar\'neth',
        translation: 'The eater hungers, the void consumes forever'
    },
    {
        name: 'Celestial',
        icon: 'fa-sun',
        category: 'exotic',
        description: 'The harmonious language of the constellation-spirits who fled Keth-Amar\'s slaughter and took sanctuary in willing Astril vessels. Carries the memory of stars in its cadence. The Synod-Hold\'s archives resonate with it.',
        sound: 'Pure and luminous, with clear tones that resonate like crystal bells struck by starlight.',
        example: 'Ael\'drin sol\'athiel val\'mor',
        translation: 'Blessed light of the dying star endures'
    },
    {
        name: 'Wyrm-Script',
        icon: 'fa-dragon',
        category: 'exotic',
        description: 'The ice-wyrm ritual language preserved in the Frozen Archive\'s deepest vaults beneath Nordhalla. Used in ancient binding rituals, the Rite of the Cold Hearth, and the oldest lichborne phylacteries. Karr Bloodhammer\'s original contract was written in it.',
        sound: 'Ancient and frigid, with rolling consonants like distant avalanches and sibilant whispers of freezing breath.',
        example: 'Karr-vahzen drah-kuld',
        translation: 'The cold soul endures beyond the ice'
    },
    {
        name: 'Root-Veil',
        icon: 'fa-brain',
        category: 'exotic',
        description: 'The mycelial network\'s ancient whisper-language, older than any surface civilization. Spoken by the Keeper of the Last Threshold and fungal entities in the Bryngloom Forest. The Over-Lit hear it constantly. Sounds like spores settling on old bone.',
        sound: 'Alien and unsettling, with sub-vocal clicks, fungal hisses, and sounds that seem to bypass the ears entirely.',
        example: '*spore-settle* *mycelium-pulse* *root-whisper*',
        translation: 'We observe your debt. The Gloom remembers.'
    },
    {
        name: 'Infernal',
        icon: 'fa-fire-flame-curved',
        category: 'exotic',
        description: 'The structured binding-language of the Warden\'s enforcement — the universe\'s mechanism of consequence. Every syllable is a clause; every pause, a penalty. Used in Neth contract-houses for clauses that must survive death. The First Contract\'s oldest sections are in Infernal.',
        sound: 'Precise and binding, with measured syllables and formal cadence that carries metaphysical weight.',
        example: 'Contractum aeternum vinctura anima',
        translation: 'The eternal contract binds the soul'
    },
    {
        name: 'Primordial',
        icon: 'fa-wind',
        category: 'exotic',
        description: 'The ancient root-language of elementals, from which Aquan, Auran, Ignan, and Terran descend. The Sea Mother\'s first words were Primordial. The Deep Thrum beneath Cragjaw speaks a dialect so old it barely qualifies as language.',
        sound: 'Raw and elemental, shifting between flowing water, crackling fire, rushing air, and rumbling earth in a single breath.',
        example: 'Aur-ign-aqu-terr-unus',
        translation: 'Air-fire-water-earth as one'
    },
    {
        name: 'Sylvan',
        icon: 'fa-seedling',
        category: 'exotic',
        description: 'The whimsical, binding tongue of the fae entities who accepted House Viridane\'s counter-bargain in moonlit groves. Briaran thorns resonate with its cadence; the Unshorn speak it to their groves. The Revel\'s celebration-song is Sylvan, endlessly repeating.',
        sound: 'Musical and enchanting, like wind through thorn-briars with trilling notes and promises that echo.',
        example: 'Viridane-thornwhisper-grove-song',
        translation: 'The eighth house endures beneath the leaves'
    },
    {
        name: 'Shanty-Patois',
        icon: 'fa-dungeon',
        category: 'exotic',
        description: 'The trade-pidgin of the Over-Shanty hanging slums beneath Atropolis. Blends Gloom-Tongue, Drun silence-codes, and merchant shorthand. Evolving too fast for any Neth contract-house to codify.',
        sound: 'Hushed and rapid, with sibilant whispers adapted for rope-bridge eavesdropping and peat-bog secrecy.',
        example: 'Ss\'drunn ss\'gloom-tak now-now',
        translation: 'The Drun whisper, the Gloom takes, move quickly'
    },

    // ===== ANCESTRAL & RACIAL LANGUAGES =====
    {
        name: 'Old Nord',
        icon: 'fa-mountain',
        category: 'racial',
        description: 'The ancestral language of the Skald people of Nordhalla, preserved in the Frozen Archive\'s clockwork city-library. Filled with tales of ice, endurance, and the Hunger Pact that lives in every Rime-Born bloodline. Spoken at Bloodhammer funeral-pyres.',
        sound: 'Bold and resonant, echoing with the strength of glacier winds and the clarity of eternal winter.',
        example: 'Frost-hold hunger-keep',
        translation: 'Hold fast to honor in the endless cold'
    },
    {
        name: 'Corvid-Speech',
        icon: 'fa-crow',
        category: 'racial',
        description: 'The fate-touched language of the Corvani subfolk, bound to the ancient Corvid Fate-Spirits who preserve memories against the northern isolation. Incorporates clicks, whistles, and raven-calls. The markings on a Corvani\'s skin shift in time with certain phrases, allowing silent communication across glacier-faces.',
        sound: 'Mysterious and melodic, with clicks, whistles, and trills that mimic the calls of ravens and crows carried on polar wind.',
        example: '*caw-click-whistle* *fate-mark-shift*',
        translation: 'The flock watches. The secret is kept.'
    },
    {
        name: 'Terran',
        icon: 'fa-gem',
        category: 'racial',
        description: 'The slow, grinding language of earth elementals and stone-touched races. Groven speak a calcified dialect, their words grinding like the Ancestor-Spans shifting under blizzard-weight. The Deep Thrum answers in Terran.',
        sound: 'Deep and rumbling, like shifting stone with low, grinding tones and mineral resonance.',
        example: 'Rumble-grind-stone-deep-vat',
        translation: 'Stone rumbles deep. The vat remembers.'
    },
    {
        name: 'Ethereal',
        icon: 'fa-ghost',
        category: 'racial',
        description: 'The whispered language of spirits, the Veilborn, and entities that exist between the Wyrd and physical reality. Constellation-spirits murmur it in their Astril vessels\' dreams. Barely audible to mortal ears without training.',
        sound: 'Whispered and ethereal, like distant voices carried on wind that may not exist. Barely perceptible.',
        example: '*whisper-whisper-echo* *veil-drift*',
        translation: 'Between worlds, we speak. Between breaths, we listen.'
    },
    {
        name: 'Changeling',
        icon: 'fa-masks-theater',
        category: 'racial',
        description: 'The secretive language of changelings and shapeshifters, designed to convey hidden meanings and shifting identities. Each speaker develops a personal dialect; fluent listeners can identify a specific changeling by their speech-patterns alone.',
        sound: 'Fluid and shifting, with tones that seem to change mid-sentence, reflecting the speaker\'s mutable nature.',
        example: 'Face-shift meaning-change truth-hide',
        translation: 'I wear many faces. Truth is what I choose.'
    },
    {
        name: 'Druidic',
        icon: 'fa-leaf',
        category: 'racial',
        description: 'The secret code language of druids, forbidden to non-druids by ancient oath. Passed from teacher to initiate in the Bryngloom\'s deepest groves and the Frostwood Reach\'s ironwood hearts. Cannot be learned from books.',
        sound: 'Natural and flowing, woven from nature\'s sounds — rustling leaves, flowing water, bird calls.',
        example: '*rustle* *flow* *chirp-chirp*',
        translation: 'The grove speaks: balance returns'
    },
    {
        name: 'Ignan',
        icon: 'fa-fire',
        category: 'racial',
        description: 'The crackling, volatile language of fire elementals, Emberspire\'s magma-children, and flame-touched beings. The Korr Sun-Speakers use it in their six-hour silent vigils — speaking it only in their minds. Scathrach\'s voice corrupts Ignan into Abyssal.',
        sound: 'Crackling and sizzling, with sharp pops and hisses like magma meeting ice.',
        example: 'Crackle-pop-burn-hot-ember',
        translation: 'Flame crackles hot. The ember endures.'
    },
    {
        name: 'Beast Speech',
        icon: 'fa-paw',
        category: 'racial',
        description: 'The primal tongue that allows communication with animals and beasts. Understood by the Thrumm in their slow way, the ice-wyrms in their cold way, and the crag-cats in their indifferent way. Does not confer obedience — only conversation.',
        sound: 'Primal and instinctual, mixing growls, chirps, and natural animal sounds with meaning.',
        example: '*growl-chirp-whine*',
        translation: 'Pack-hunt together-strong'
    },
    {
        name: 'Necril',
        icon: 'fa-skull',
        category: 'racial',
        description: 'The cold, lifeless tongue of the undead, Debt-Revenants who rise to complete broken contracts, and lichborne souls bound to basalt phylacteries. Used in necromantic rituals. The Frozen Archive\'s oldest revenant-scribes write only in Necril.',
        sound: 'Cold and lifeless, with hollow tones that seem to drain warmth from the air. Each word a memory of breath.',
        example: 'Death-cold-eternal-rest-contract',
        translation: 'In death, we find eternal rest. The contract remains.'
    },
    {
        name: 'War-Cant',
        icon: 'fa-axe-battle',
        category: 'racial',
        description: 'The tactical battle-speech developed in the Bloodhammer Sump\'s geothermal skirmishes and refined during the War of Thousand Screams. Clipped commands, hand-sign modifiers, and gestural shorthand designed to carry over forge-noise and howling Nordhalla wind.',
        sound: 'Guttural and aggressive, with sharp stops and explosive consonants that cut through combat noise.',
        example: 'VAEL-GRUM! Forge-hold! Break-line!',
        translation: 'By Vaelen and Grum! Hold the forge! Break their line!'
    },
    {
        name: 'Gloom-Tongue',
        icon: 'fa-moon',
        category: 'racial',
        description: 'The ancestral language of the Bryngloom Forest, spoken by Vreken and Neth alike. Carries the cadence of the Root-Veil\'s mycelial whispers beneath its surface syllables. The Over-Lit lose Gloom-Tongue last — it is the final thing the hush takes.',
        sound: 'Low and murmuring, with fungal undertones and syllables that seem to echo from beneath the peat.',
        example: 'Gloom-keep root-speak veil-hold',
        translation: 'The Gloom keeps. The root speaks. The veil holds.'
    },
    {
        name: 'Vale-Speak',
        icon: 'fa-feather',
        category: 'racial',
        description: 'The memory-language of the Mimir, developed in the Frostwood Reach after the Purge that destroyed the art of mask-forging ninety years ago. Incorporates fog-adapted tonal shifts that carry identity where faces cannot. Each speaker\'s dialect is as unique as a lost mask.',
        sound: 'Mist-soft and layered, with tonal shifts that carry through fog. Each voice uniquely identifiable.',
        example: 'Fog-keep mask-remember vale-speak',
        translation: 'The fog holds. The mask remembers. The vale speaks.'
    },
    {
        name: 'Sundari',
        icon: 'fa-sun',
        category: 'racial',
        description: 'The ember-tongue of the Emberth people, forged in the shadow of Emberspire. Incorporates heat-gradations as grammatical markers — a word spoken at one temperature means something different at another. The Korr Sun-Speakers elevate it to sacred silence.',
        sound: 'Warm and layered, with tonal shifts that suggest temperature. Ranges from forge-hot consonants to ash-cool vowels.',
        example: 'Sol-ember-korr-thrask',
        translation: 'The sun\'s ember. The priest tends. The ranger guards.'
    },
    {
        name: 'Fexric',
        icon: 'fa-cog',
        category: 'racial',
        description: 'The industrial tongue of the Fexrick, developed in the vertical subterranean city of Frostmaw Holdfast around geothermal chimneys. Incorporates pipe-resonance harmonics and pressure-hiss modifiers. The Deep Alchemists\' oldest formulae are written in Fexric.',
        sound: 'Mechanical and resonant, with pipe-harmonics and pressure-hiss consonants. Echoes like a foundry at work.',
        example: 'Kethrin-guild drall-free vat-hold',
        translation: 'The guild binds. The clan roams. The vat holds.'
    },

    // ===== ELEMENTAL TONGUES =====
    {
        name: 'Elemental',
        icon: 'fa-wind',
        category: 'elemental',
        description: 'The general language of elementals, bridging all elemental planes and intelligences. A simplified derivative of Primordial used when fire, water, earth, and air must arrive at consensus.',
        sound: 'Balanced and shifting, a simplified harmony of all four elemental cadences.',
        example: 'Aur-ign-aqu-terr',
        translation: 'Air, fire, water, earth'
    },
    {
        name: 'Primal',
        icon: 'fa-leaf-oak',
        category: 'elemental',
        description: 'The raw language of nature itself, understood by wild and ancient beings across all seven regions. The Frostwood\'s ironwood trees murmur it. The Bryngloom\'s peat-bogs preserve it. Older than the Dark Bargains, older than Sol\'s binding.',
        sound: 'Raw and ancient, a language that is less speech and more the world speaking to itself.',
        example: 'Grow-thrive-root-deep',
        translation: 'Grow. Thrive. Root deep.'
    },
    {
        name: 'Auran',
        icon: 'fa-cloud',
        category: 'elemental',
        description: 'The light, airy language of sky-dwelling elementals, wind-spirits, and the blizzard-voices above the Cragjaw Peaks\' snow-veil. The Corvani Fate-Scouts who navigate above the blizzard line speak fragments of Auran.',
        sound: 'Light and airy, whistling like wind through high clouds with breathy consonants.',
        example: 'Whistle-rush-sky-high-blizzard',
        translation: 'Wind whispers high where the blizzard hides'
    },
    {
        name: 'Aquan',
        icon: 'fa-water',
        category: 'elemental',
        description: 'The fluid, flowing language of water elementals, the Iceheart Sea\'s consciousness, and the Myrathil people. The Sea Mother speaks in Aquan — though she rarely speaks at all, preferring to send storms. Myrathil Deep-Born learn it in the womb.',
        sound: 'Flowing and fluid, like water rushing over stones with bubbling and gurgling tones.',
        example: 'Gurgle-flow-deep-current-tide',
        translation: 'Flowing current runs deep. The tide remembers.'
    },

    // ===== SECRET LANGUAGES =====
    {
        name: 'Thieves\' Cant',
        icon: 'fa-mask',
        category: 'secret',
        description: 'A secret code jargon used by rogues, smugglers, and the Over-Shanty\'s underworld to communicate covertly in public. The Drun have their own dialect, adapted to their legally non-existent status.',
        sound: 'Coded and subtle, with double meanings and signals disguised as casual speech.',
        example: 'The red door is warm, but the window sings',
        translation: 'The front is guarded, use the side entrance silently'
    },
    {
        name: 'Hex-Speech',
        icon: 'fa-seedling',
        category: 'secret',
        description: 'The guarded ritual language of the Bryngloom\'s root-wards and bog-curses. Spoken by those who tend the fungal shrines and bargain with the Grandmother of the Bog. Not taught — absorbed through exposure to mycelial memory-deposits.',
        sound: 'Natural and thrumming, woven from fungal resonance, low hums, and animal calls.',
        example: '*rustle* *thrum* *growl* *spore*',
        translation: 'The wild wood speaks. The Gloom answers.'
    },
    {
        name: 'Trickster\'s Cant',
        icon: 'fa-mask',
        category: 'secret',
        description: 'A coded language used by gamblers, information brokers, and those who trade in misdirection across the seven regions. Incorporates false tells and recursive lies — skilled speakers can embed a truth inside three nested deceptions.',
        sound: 'Playful and deceptive, with intentional misdirections and layered meanings.',
        example: 'The raven smiles at midnight, but the worm laughs at dawn',
        translation: 'Trust nothing. Verify everything. The joke is on whoever believes.'
    },

    // ===== SPECIAL LANGUAGES =====
    {
        name: 'Sign Language',
        icon: 'fa-hands',
        category: 'special',
        description: 'A universal gestural language allowing silent communication across language barriers. Developed by the Groven Vat-Breakers during their rebellion to coordinate without the Fexric overhearing, then adopted across all regions.',
        sound: 'Silent gestures and hand movements that convey meaning without sound.',
        example: '[Complex hand gestures — silence, move, hold, strike]',
        translation: 'Words without sound. Meaning through motion.'
    },
    {
        name: 'All Ancient Languages',
        icon: 'fa-scroll',
        category: 'special',
        description: 'Comprehensive knowledge of dead and ancient tongues across Mythrill — pre-Binding dialects, the first words spoken after the Dark Bargains, and languages whose last native speaker calcified into an Ancestor-Span centuries ago. Granted only to the most dedicated scholars.',
        sound: 'A symphony of forgotten tongues, each with its own ancient cadence and lost beauty.',
        example: 'Many voices, one knowledge',
        translation: 'The past speaks through me'
    }
];

export const LANGUAGE_CATEGORIES = {
    standard: { name: 'Standard Languages', icon: 'fa-users', color: '#6B8E23', description: 'Common tongues spoken across the seven regions' },
    exotic: { name: 'Exotic Languages', icon: 'fa-dragon', color: '#8B4513', description: 'Rare languages of otherworldly beings and ancient powers' },
    racial: { name: 'Ancestral Languages', icon: 'fa-star', color: '#9370DB', description: 'Heritage tongues of Mythrill\'s races' },
    elemental: { name: 'Elemental Tongues', icon: 'fa-fire', color: '#4682B4', description: 'Languages of elemental forces and primal nature' },
    secret: { name: 'Secret Languages', icon: 'fa-user-secret', color: '#708090', description: 'Hidden languages known only to specific orders' },
    special: { name: 'Special Languages', icon: 'fa-scroll', color: '#B8860B', description: 'Universal and scholarly languages' }
};
