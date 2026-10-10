/**
 * Mythrill Languages Data Module
 *
 * Single source of truth for all languages available in Mythrill VTT.
 *
 * Canon pass (2026-10-01): retired the remaining D&D-generic names and re-anchored
 * every tongue to a region, people, or creature of Mythrill. Legacy names are
 * preserved as read aliases in normalizeLanguageName so old characters, custom
 * worlds, and edited drafts resolve without losing or duplicating fluency.
 *
 * The nine World > Tongues & Scripts entries are registers, scripts, or ciphers
 * of these parent tongues (see src/data/seedLanguages.js), not independent
 * proficiencies.
 */

export const LANGUAGES = [
  // ===== TRADE TONGUES =====
  {
    name: "Wayfarer's Cant",
    icon: 'fa-users',
    category: 'standard',
    script: "Road chalk and tally marks",
    nativeSpeakers: ["All peoples (trade pidgin)"],

    description: "The trade-tongue the fractured houses built out of necessity. When the Dark Bargains broke every noble line, merchants still had to weigh grain, price a hostage, and swear a road-oath, so the seven regions stitched a pidgin from every tongue they could reach. It belongs to no one and everyone speaks it. A Wayfarer's Cant sentence is short, blunt, and built to be understood by a stranger who may be lying.",
    sound: 'Blunt and adaptable, with familiar vowels and worn-down consonants borrowed from a dozen regions. No music in it, only clarity.',
    example: "Weight's fair, coin's cold, road's open.",
    translation: 'The goods are honest, the payment is up front, and I may pass. (The standard opening of a road-bargain.)'
  },
  {
    name: 'Scrapspeech',
    icon: 'fa-spider',
    category: 'exotic',
    script: "Chalk tallies only",
    nativeSpeakers: ["Frostwood fae","peat-bog scavengers","abandoned courtiers"],

    description: "The salvage-patois of the Frostwood Reach's lesser fae, peat-bog scavengers, and Revalen's abandoned courtiers who never left the party. A practical language of improvisation and barter, borrowing freely from every tongue it touches. No two speakers sound alike.",
    sound: 'Harsh yet adaptable, with sharp consonants borrowed from a dozen languages and nasal tones that carry through the fog.',
    example: 'Kik-scrap grosh-barter! Teek tak!',
    translation: 'Quick salvage, good trade! I take!'
  },
  {
    name: 'Moundsong',
    icon: 'fa-house',
    category: 'racial',
    script: "Steppe staves",
    nativeSpeakers: ["Ordu (Human)"],

    description: "The throat-sung nomadic language of the Ordu steppe-peoples of Sundrift Vale, spoken natively by the Ordu human subrace. Carries across the grasslands in harmonic overtones that seem to hum from the ancestor-mounds themselves. Used to navigate when the sky offers no stars.",
    sound: 'Throat-sung and resonant, with harmonic overtones that carry for miles across open steppe. Warm and rolling.',
    example: 'Oor-dan valen hum-eth',
    translation: 'The ancestors sing beneath our feet'
  },

  // ===== EXOTIC LANGUAGES =====
  {
    name: 'Kethvash',
    icon: 'fa-fire',
    category: 'exotic',
    script: "No written form",
    nativeSpeakers: ["Silence-spawn","Scathrach the Ashen Sovereign"],

    pickable: false,
    description: "The devouring-speech of Keth Amar's silence-spawn and the Wyrd-touched things that answer it. Scathrach the Ashen Sovereign speaks it in Emberspire's deepest vent, and the words come up tasting of ash. Kethvash has no word for mercy and a dozen for hunger; exorcists learn just enough of it to know when they are being studied.",
    sound: 'Searing and broken, full of stops that scrape the throat and long vowels that seem to pull the air toward the speaker.',
    example: "Keth-vorath ix amar-neth",
    translation: 'The eater hungers, the silence consumes forever'
  },
  {
    name: 'Echosong',
    icon: 'fa-sun',
    category: 'racial',
    script: "Crystal-lattice glyphs",
    nativeSpeakers: ["Astril"],

    description: "Lumia's echo, carried offworld by the Astril refugees and still resonating in their crystalline blood. It is less a language than a remembered biosphere: harmonics that hold the cadence of a star's light and the shape of a world Keth Amar ate. The Synod Hold's recording-lattices hum with it, and every Astril learns it before they learn to lie.",
    sound: 'Luminous and cold, clear tones that sustain like crystal bells struck by starlight, with overtones that seem to arrive from very far away.',
    example: "Ael-drin sol-athiel val-mor",
    translation: 'Blessed light of the dying star endures'
  },
  {
    name: 'Wyrmspeech',
    icon: 'fa-dragon',
    category: 'exotic',
    script: "Ice-cut runes",
    nativeSpeakers: ["Ice-wyrms","Frozen Archive rites"],

    description: "The ice-wyrm ritual language preserved in the Frozen Archive's deepest vaults beneath Nordhalla. Used in ancient binding rituals, the Rite of the Cold Hearth, and the oldest lichborne phylacteries. Karr Bloodhammer's original contract was written in it.",
    sound: 'Ancient and frigid, with rolling consonants like distant avalanches and sibilant whispers of freezing breath.',
    example: 'Karr-vahzen drah-kuld',
    translation: 'The cold soul endures beyond the ice'
  },
  {
    name: 'Rootveil',
    icon: 'fa-brain',
    category: 'exotic',
    script: "No written form (spore-signature)",
    nativeSpeakers: ["Morvane","Mycellan","the Over-Lit"],

    pickable: false,
    description: "The mycelial network's ancient whisper-language, older than any surface civilization. Morvane and the fungal entities of the Bryngloom Forest speak it; the Over-Lit hear it constantly. It sounds like spores settling on old bone, and it remembers everything the bogs have swallowed.",
    sound: 'Alien and unsettling, with sub-vocal clicks, fungal hisses, and sounds that seem to bypass the ears entirely.',
    example: "Kss-vul nyr-gast thol-veir",
    translation: 'We observe your debt. The Gloom remembers.'
  },
  {
    name: 'Aethilic',
    icon: 'fa-fire-flame-curved',
    category: 'racial',
    script: "Ledger codices",
    nativeSpeakers: ["Athien contract-houses"],

    description: "The consequence-grammar Aethil uses to witness a binding. Aethilic does not conjure; it records. Every clause spoken aloud is heard by something older than the house that spoke it, so the tongue is built from conditions, exemptions, and prices rather than verbs and wishes. Athien contract-houses keep whole vaults of Aethilic codices, and the oldest sections predate the Star-Fall. Sections added later carry Keth's false father-doctrine, which is why a careful notary reads the provenance before the terms.",
    sound: 'Precise and formal, measured syllables that land like a weigh-scale settling. It sounds less spoken than entered into a ledger.',
    example: 'Contractum aeternum vinctura anima',
    translation: 'The eternal contract binds the soul'
  },
  {
    name: 'First Word',
    icon: 'fa-wind',
    category: 'elemental',
    script: "No written form (elemental)",
    nativeSpeakers: ["Elementals","Nereid (Myrathil)"],

    description: "The root-language the four elemental tongues descend from, older than the elementals themselves. Mareth's first words were First Word, spoken from the pressure of the deep before there was a shore to hear them. The deep stone-grind beneath Cragjaw grinds in a dialect so old it barely counts as speech. A whole First Word sentence can shift from water to fire to stone between two syllables, because it never agreed those were separate things.",
    sound: 'Raw and shifting, flowing water and crackling fire and rushing air and grinding earth inside a single breath.',
    example: "Kh'aur-dra ign'vael thal'aqu dhur'terr",
    translation: 'Air-fire-water-earth as one'
  },
  {
    name: 'Thornsong',
    icon: 'fa-seedling',
    category: 'racial',
    script: "Thorn script",
    nativeSpeakers: ["Florae","Hollow-Court fae"],

    description: "The binding tongue of the fae who accepted House Viridane's counter-bargain in the moonlit groves. Florae thorns resonate with its cadence and the Oaken sing it to their groves; Revalen's celebration-song is Thornsong, looping forever because the party never agreed to end. Every promise spoken in Thornsong leaves a thorn somewhere, and the Thorn-Fall is only the pile of the ones that were broken.",
    sound: 'Musical and unsettling, like wind through thorn-briars, with trilling notes that hang in the air a heartbeat too long.',
    example: "Loun-syl vaen-drael virathel",
    translation: 'The eighth house endures beneath the leaves'
  },
  {
    name: 'Vættir Speech',
    icon: 'fa-mountain',
    category: 'exotic',
    script: "Boundary marks",
    nativeSpeakers: ["Nordhalla land-spirits","Skald farmers"],

    description: "The speech of Nordhalla's land-spirits, the vættir who hold the fjords and slopes the Skald never claimed. Landvett, Vettur, the Nokkvar, the hollow-backed Holdra, and the Fosskarl all answer to it, though none answer on demand. Skald farmers leave a bowl at the boundary stone and speak Vættir Speech into it, because a spirit that has been greeted is far less likely to drown your herd. The grammar has no polite register. There is respectful, and there is already-too-late.",
    sound: 'Low and resonant, half-heard, like wind worrying a boundary stone, with long pauses where a human would put a word.',
    example: 'Haugr heil, ve vetr, gang vara',
    translation: 'Hearth be whole, winter be warned, let the herd pass'
  },
  {
    name: 'Neteru Liturgy',
    icon: 'fa-gem',
    category: 'exotic',
    script: "Soot tablets",
    nativeSpeakers: ["Sundale guardian-spirits","Dawn Vigil oracles"],

    description: "The liturgical command-language of the guardian-spirits of Sundale and the deep vents. Lamassa speak it at gateways, ushabti carry it out without question, and the sun-faced ammit renders verdicts in it. Every sentence is a commandment with a named witness, which is why the spirits obey it and mortals usually should not. Emberspire's Ashvara Oracles transcribe Neteru Liturgy onto soot-tablets, and the tablets argue back.",
    sound: 'Formal and declarative, weighty words that arrive like verdicts, with a low drone under the last syllable of each command.',
    example: 'Utuk gate-kal, lamassu men, ammit khar',
    translation: 'The gate is watched, the sentinel stands, the devourer waits'
  },

  // ===== ANCESTRAL & RACIAL LANGUAGES =====
  // NOTE: Echosong is the registered Astril heritage tongue (Lumia's echo resonating in their
  // vessels). Synod remains the formal discourse register of the Synod Hold, and Veilspeech
  // is the spirits' dream-speech rather than an Astril proficiency.
  {
    name: 'Old Nord',
    icon: 'fa-mountain',
    category: 'racial',
    script: "Memory-runes",
    nativeSpeakers: ["Skald (Human)"],

    description: "The ancestral language of the Skald people of Nordhalla, preserved in the Frozen Archive's clockwork city-library and spoken natively by the Skald human subrace. Filled with tales of ice, endurance, and the Hunger Pact that lives in every Rime-Born bloodline. Spoken at Bloodhammer funeral-pyres.",
    sound: 'Bold and resonant, echoing with the strength of glacier winds and the clarity of eternal winter.',
    example: 'Frosthald hungrvegr',
    translation: 'Hold fast to honor in the endless cold'
  },
  {
    name: 'Spanspeech',
    icon: 'fa-gem',
    category: 'racial',
    script: "Span runes",
    nativeSpeakers: ["Groven"],

    description: "The grinding stone-tongue of earth elementals and the Groven who were shaped from them. Groven speak a calcified dialect that moves like the Ancestor-Spans shifting under blizzard-weight, and the Deep Thrum answers in something older still. A Spanspeech sentence is a load-bearing structure: remove a syllable and the meaning collapses, which is why Groven elders can sound like they are arguing when they are agreeing.",
    sound: 'Deep and rumbling, low grinding tones with mineral resonance, long words that settle like sediment.',
    example: "Dhorgum krath'veil",
    translation: 'Stone rumbles deep. The vat remembers.'
  },
  {
    name: 'Veilspeech',
    icon: 'fa-ghost',
    category: 'exotic',
    script: "No written form (dream-speech)",
    nativeSpeakers: ["Spirits","Veilborn","Fosskarl","Astril mediums"],

    description: "The whispered tongue of spirits, the Veilborn, and the things that persist between the Wyrd and the physical world. Lumian echo-spirits murmur it through an Astril vessel's dreams, and the Fosskarl hum it to the ice. It sits at the edge of hearing; a mortal listener gets the meaning a half-breath after the sound, which is why mediums learn to answer before they are sure they were spoken to.",
    sound: 'Breathy and barely there, hollow vowels and whispered fricatives that seem to come from just behind the ear.',
    example: "Fhae'sul thae'vir isel'nym",
    translation: 'Between worlds, we speak. Between breaths, we listen.'
  },
  {
    name: 'Shifterspeech',
    icon: 'fa-masks-theater',
    category: 'exotic',
    script: "No fixed form (inward dialect)",
    nativeSpeakers: ["Pukhal","lesser fae","shapeshifting communities"],

    description: "The shifting speech of actual shapeshifting communities, not a single ancestry. Each speaker carries an inward dialect, so a sentinel who listens closely can name the changeling by cadence alone even after the face has changed. Pukhal and lesser fae use it as a game, wearing three voices in one sentence. A Shifterspeech conversation has no fixed speaker; the truth is what the grammar decided to keep.",
    sound: 'Fluid and unstable, palatal consonants and liquid tones that seem to change shape between the first word and the last.',
    example: "Shael'nyr voresh'im",
    translation: 'I wear many faces. Truth is what I choose.'
  },
  {
    name: 'Grovesign',
    icon: 'fa-leaf',
    category: 'secret',
    script: "Initiate memory only",
    nativeSpeakers: ["Florae grove initiates","ironwood hollows"],

    description: "The guarded code of grove initiates, sworn to the older roots. It passes teacher to initiate in the deepest Bryngloom hollows and the Frostwood ironwood hearts, and it has never been written down where an outsider could find it. Grovesign is not a hidden language so much as a hidden grammar; the words are ordinary, and the meaning is the order they are given in. A broken oath is read in the sequence long before anyone admits the words were said.",
    sound: 'Structured clicks, low trills, and flowing syllables woven into a grammar only initiates follow.',
    example: "Klik'thar vash'en druil",
    translation: 'The grove speaks: balance returns'
  },
  {
    name: 'Cinderspeech',
    icon: 'fa-fire',
    category: 'racial',
    script: "Magma cuts",
    nativeSpeakers: ["Korr (Solari)","fire elementals"],

    description: "The volatile tongue of fire elementals, Emberspire's magma-children, and the flame-touched. The Korr Sun-Speakers hold entire six-hour vigils in it, speaking only inside their minds to keep the heat from escaping their mouths. Scathrach's voice twists Cinderspeech into Kethvash when it answers, which is the surest sign that what is listening is not merely fire.",
    sound: 'Sharp explosive stops and hissing sibilants, crackling with a rhythm like magma meeting ice.',
    example: "Kra'shek tar'vek iss",
    translation: 'Flame crackles hot. The ember endures.'
  },
  {
    name: 'Feralspeech',
    icon: 'fa-paw',
    category: 'exotic',
    script: "Pitch and posture",
    nativeSpeakers: ["Thrumm","ice-wyrms","rangers"],

    description: "The low register that lets a speaker trade meaning with beasts. The Thrumm understand it in their slow way, ice-wyrms in their cold way, and crag-cats only when it suits them. It is built on pitch, posture, and scent rather than vocabulary, and it grants no obedience. A ranger who speaks Feralspeech can ask a wolf why it is limping. It cannot make the wolf move.",
    sound: 'Low gutturals, growls, and tonal shifts that carry as much meaning through pitch and posture as through sound.',
    example: "Grr'krakth thol'vrin",
    translation: 'Pack-hunt together-strong'
  },
  {
    name: 'Bonewrit',
    icon: 'fa-skull',
    category: 'racial',
    script: "Ground-bone ink",
    nativeSpeakers: ["Undead","Riven scribes","Frozen Archive revenants"],

    description: "The cold tongue of the undead, the Vezan who rise to finish a broken contract, and the lichborne souls bound to basalt phylacteries. The Frozen Archive's oldest revenant-scribes write only in Bonewrit, and their ink is a suspension of their own ground bone. Spoken Bonewrit steals the warmth from the air around it; a room grows cold before the speaker finishes the first clause.",
    sound: 'Hollow and dark, breathy fricatives and deep resonants that seem to draw the heat out of a room.',
    example: "Vhyl'kraz nthar'vel dhrim",
    translation: 'In death, we find eternal rest. The contract remains.'
  },
  {
    name: 'Warcant',
    icon: 'fa-axe-battle',
    category: 'special',
    script: "Field signs",
    nativeSpeakers: ["Skald warbands"],

    description: "The tactical battle-speech developed in the Bloodhammer Sump's geothermal skirmishes and refined during the War of Thousand Screams. Clipped commands, hand-sign modifiers, and gestural shorthand designed to carry over forge-noise and howling Nordhalla wind.",
    sound: 'Guttural and aggressive, with sharp stops and explosive consonants that cut through combat noise.',
    example: "VAEL-GRUM! Krath'voel! Dhra'kesh!",
    translation: "By Vaelen and Grum! Hold the forge! Break their line!"
  },
  {
    name: 'Gloomtongue',
    icon: 'fa-moon',
    category: 'racial',
    script: "Barkcut",
    nativeSpeakers: ["Athien","Mycellan"],

    description: "The ancestral language of the Bryngloom Forest, spoken by Mycellan and Athien alike. Carries the cadence of the Root-Veil's mycelial whispers beneath its surface syllables. The Over-Lit lose Gloomtongue last; it is the final thing the hush takes.",
    sound: 'Low and nasal, with murmured consonants and submerged syllables that echo from beneath the peat.',
    example: "Mulgresh veir'nam gloam'dhur",
    translation: 'The Gloom keeps. The root speaks. The veil holds.'
  },
  {
    name: 'Valespeak',
    icon: 'fa-feather',
    category: 'racial',
    script: "Vale ink",
    nativeSpeakers: ["Mimir"],

    description: "The memory-language of the Mimir, developed in the Frostwood Reach after the Purge that destroyed the art of mask-forging ninety years ago. Incorporates fog-adapted tonal shifts that carry identity where faces cannot. Each speaker's dialect is as unique as a lost mask.",
    sound: 'Mist-soft with layered sibilants, tonal shifts that carry identity through fog. Each voice uniquely identifiable.',
    example: "Sael'myr thuv'ael virath",
    translation: 'The fog holds. The mask remembers. The vale speaks.'
  },
  {
    name: 'Sundari',
    icon: 'fa-sun',
    category: 'racial',
    script: "Ash rows",
    nativeSpeakers: ["Solari"],

    description: "The ember-tongue of the Solari people, forged in the shadow of Emberspire. Incorporates heat-gradations as grammatical markers, a word spoken at one temperature means something different at another. The Korr Sun-Speakers elevate it to sacred silence.",
    sound: 'Warm and layered, with tonal shifts that suggest temperature. Ranges from forge-hot consonants to ash-cool vowels.',
    example: "Soth'keth vir'rash thrask'dhel",
    translation: "The sun's ember. The priest tends. The ranger guards."
  },
  {
    name: 'Fex',
    icon: 'fa-cog',
    category: 'racial',
    script: "Pressure dye",
    nativeSpeakers: ["Fex"],

    description: "The industrial tongue of the Fex, developed in the vertical subterranean city of Frostmaw Holdfast around geothermal chimneys. Incorporates pipe-resonance harmonics and pressure-hiss modifiers. The Deep Alchemists' oldest formulae are written in Fex.",
    sound: 'Mechanical and resonant, with pipe-harmonics and pressure-hiss consonants. Echoes like a foundry at work.',
    example: "Alchemite'vek keth'syrin dhav'holm",
    translation: 'The guild binds. The clan roams. The vat holds.'
  },

  // ===== ELEMENTAL TONGUES =====
  {
    name: 'Greenmantle',
    icon: 'fa-leaf-oak',
    category: 'elemental',
    script: "No written form (the world speaking)",
    nativeSpeakers: ["Ironwood groves","the living world"],

    pickable: false,
    description: "The raw speech of the living world, older than the Dark Bargains and older than Sol's binding. The Frostwood's ironwood trees murmur it, the Bryngloom's peat-bogs keep it, and the wild and ancient beings of all seven regions root through it. Greenmantle is less a language spoken than one overheard; mortals get fragments, and the fragments are usually about patience, growth, and what the world intends to outlast.",
    sound: 'Deep resonant chanting with heavy vowel harmony, less speech than the sound of a place talking to itself.',
    example: "Gruum'vael thol'en dir'na",
    translation: 'Grow. Thrive. Root deep.'
  },
  {
    name: 'Galespeech',
    icon: 'fa-cloud',
    category: 'elemental',
    script: "No written form (carried on air)",
    nativeSpeakers: ["Wind elementals","blizzard-voices"],

    pickable: false,
    description: "The light, cutting tongue of sky-dwelling elementals, wind-spirits, and the blizzard-voices that ride above Cragjaw's snow-veil. It is all breath and no body, shaped to be thrown across open air without losing its edges. Storm-chasers listen for Galespeech in the howl before a whiteout, because the wind argues with itself just before it turns.",
    sound: 'Breathy fricatives and whistling high vowels, light and airy, with a wind-rush cadence.',
    example: "Fhael'whir suth'aer vael'kesh",
    translation: 'Wind whispers high where the blizzard hides'
  },
  {
    name: 'Tidespeech',
    icon: 'fa-water',
    category: 'elemental',
    script: "Kelp knots",
    nativeSpeakers: ["Myrathil","Merryn (Human)"],

    description: "The fluid tongue of aquatic peoples and the deep itself. Foam-spawned Myrathil learn it from finders, chosen kin, and their community rather than from any womb, and they carry it into every port that barely admits they exist. Mareth answers in Tidespeech through currents, storms, and signs, never routine prophecy. A promise made in Tidespeech is measured by tide, which is the only measure that has never failed the Myrathil.",
    sound: 'Liquid consonants and flowing vowels with a wave-like rhythm, smooth, low, and made to travel under ice.',
    example: "Lhum'vael syl'ru thar'nym",
    translation: 'Flowing current runs deep. The tide remembers.'
  },

  // ===== SECRET LANGUAGES =====
  {
    name: 'Undercant',
    icon: 'fa-mask',
    category: 'standard',
    script: "Taps and tallies",
    nativeSpeakers: ["Weft (Athien)","Over-Shanty underworld","Riven"],

    description: "The working code of the Over-Shanty underworld: rogues, smugglers, fence-men, and the Riven, who have no legal name to sign and so sign everything in shorthand. It hides meaning inside ordinary market talk, tapping a stall's price-board or complaining about the weather in a settled pattern. The Riven keep a variant built for people the law cannot admit exist, which is exactly the audience Undercant was made for.",
    sound: 'Coded and subtle, flat and boring on purpose, with meanings buried in pauses, taps, and repeated common words.',
    example: 'The red door is warm, but the window sings',
    translation: 'The front is guarded, use the side entrance silently'
  },
  {
    name: 'Rabengast Whisper',
    icon: 'fa-ghost',
    category: 'secret',
    script: "No written form (sound with holes)",
    nativeSpeakers: ["The Rabengast"],

    description: "The hush the Rabengast leave in a room after they pass. The memory-eating swarm of the Frostwood Reach does not speak so much as swallow the sound around its words, so a sentence arrives with holes in it and the listener supplies the missing pieces from their own recollection. Familiars and mediums carry messages in Rabengast Whisper because the swarm will not eat what it recognizes as its own. Everyone else forgets they were ever addressed, which is the point.",
    sound: 'Silence with a shape, words heard mainly by what is missing between them. The listener often answers a sentence nobody remembers hearing.',
    example: '[the sentence you have already forgotten being told]',
    translation: 'We have already taken it. You will not miss it.'
  },
  {
    name: 'Hexspeech',
    icon: 'fa-seedling',
    category: 'secret',
    script: "Spore-deposits",
    nativeSpeakers: ["Bryngloom root-wards","bog-curse keepers"],

    description: "The guarded ritual language of the Bryngloom's root-wards and bog-curses. Spoken by those who tend the fungal shrines and bargain with the Babara. Not taught, absorbed through exposure to mycelial memory-deposits.",
    sound: 'Harsh staccato clicks interwoven with low sustained drones, like the bog itself speaking.',
    example: "Krag'vex thul'mir nur'gash",
    translation: 'The wild wood speaks. The Gloom answers.'
  },
  {
    name: "Trickster's Cant",
    icon: 'fa-mask',
    category: 'standard',
    script: "No written form (deliberately false)",
    nativeSpeakers: ["Gamblers","information brokers"],

    description: "A coded language used by gamblers, information brokers, and those who trade in misdirection across the seven regions. Incorporates false tells and recursive lies; skilled speakers can embed a truth inside three nested deceptions.",
    sound: 'Playful and deceptive, with intentional misdirections and layered meanings.',
    example: 'The raven smiles at midnight, but the worm laughs at dawn',
    translation: 'Trust nothing. Verify everything. The joke is on whoever believes.'
  },

  // ===== SPECIAL LANGUAGES =====
  {
    name: 'Vatsign',
    icon: 'fa-hands',
    category: 'special',
    script: "Gestural",
    nativeSpeakers: ["Groven","Athien courts (formal register)"],

    description: "The silent hand-cant the Groven Vat-Breakers built to coordinate a rebellion with the Deep Alchemists listening. It spread from the revolt through every region, because everyone eventually needs to speak over a roar, a forge, or a watchful overseer. Vatsign is fully grammatical, not a handful of gestures, and it keeps a formal register used in Athien courts where the walls have ears.",
    sound: 'Silence. Meaning rides on precise hand-shapes, rhythm, and hold.',
    example: '[hold, snap, flat, twice: look, wait, danger]',
    translation: 'Words without sound. Meaning through motion.'
  },
  {
    name: 'Archive Writ',
    icon: 'fa-scroll',
    category: 'special',
    script: "Ice-cut letters",
    nativeSpeakers: ["Frozen Archive scholars","Rime-Born Rune Keepers"],

    description: "The script of the pre-Binding civilization entombed in Nordhalla's Frozen Archive, caught mid-sentence when the glacier took the city. The letters are cut shallow and read by raking light across the ice, so a page that thaws is a page lost. Rime-Born Rune Keepers spend whole careers on a single vault, and the oldest carvings under Vargtor run centuries deeper than the Skald, which the Keepers still cannot agree whether to translate or answer.",
    sound: 'Frozen and formal. Each phrase was cut once and never spoken aloud again, so readers reconstruct the sound and are never certain they are right.',
    example: 'Rist-þar, ís-bók, orð varðveitt',
    translation: 'Cut there, ice-book, word preserved.'
  },
  {
    name: 'Span Runes',
    icon: 'fa-gem',
    category: 'special',
    script: "Its own cut-runes",
    nativeSpeakers: ["Groven toll-keepers","Stone-Moot"],

    description: "The elder stone-script of the Ancestor-Spans, carved by the first Cragjaw dead whose calcified bodies became the bridges. Every span carries a rune-row that is half lineage-record and half load-tally, and Groven toll-keepers read the spans the way other peoples read contracts. The script predates Groven speech; the Deep Thrum only rumbles at it, which the Stone-Moot has decided to treat as neither approval nor refusal.",
    sound: 'Grinding and clipped, pitched low against the stone it was cut for. A sentence sounds like a mason checking whether a span will hold.',
    example: 'Grum-kald, bein-vegr, heldr-þar',
    translation: 'Stone-cold, bone-road, holds there. The dead carry the crossing.'
  },
  {
    name: 'Kethash',
    icon: 'fa-fire',
    category: 'special',
    script: "Scorched fragments",
    nativeSpeakers: ["None living (read only, once)"],

    pickable: false,
    description: "A dead precursor to Kethvash, spoken by the first silence-spawn before the Devouring learned to answer. Kethash survives in fragments: burnt-off ledger-ends, scorched phylacteries, and the margins of Aethilic codices that notaries refuse to copy. Scholars read it; no one speaks it. A single overheard syllable is how the thing on the other end learns a name, and it keeps the ones it learns.",
    sound: 'Broken and guttering, like a fire starved of air. Most scholars only ever read it, and only ever once.',
    example: '[a scorched clause: ...marrow / ...name / ...come]',
    translation: 'It was not a language. It was a mouth learning to be one.'
  }
];

/**
 * Legacy and colloquial names mapped to their current canon tongue. Kept so saved
 * characters, edited drafts, custom worlds, and published records resolve without
 * duplicate or orphaned fluency. Previously-canon display names are aliases too.
 */
export const LANGUAGE_ALIASES = {
  common: "Wayfarer's Cant",
  abyssal: 'Kethvash',
  celestial: 'Echosong',
  lumian: 'Echosong',
  infernal: 'Aethilic',
  primordial: 'First Word',
  sylvan: 'Thornsong',
  'shanty-patois': 'Undercant',
  'shanty argot': 'Undercant',
  'shanty-argot': 'Undercant',
  shantypatois: 'Undercant',
  terran: 'Spanspeech',
  ethereal: 'Veilspeech',
  changeling: 'Shifterspeech',
  druidic: 'Grovesign',
  ignan: 'Cinderspeech',
  'beast speech': 'Feralspeech',
  beast_speech: 'Feralspeech',
  beastspeech: 'Feralspeech',
  necril: 'Bonewrit',
  "thieves' cant": 'Undercant',
  'thieves cant': 'Undercant',
  thievescant: 'Undercant',
  'sign language': 'Vatsign',
  sign_language: 'Vatsign',
  signlanguage: 'Vatsign',
  elemental: 'First Word',
  primal: 'Greenmantle',
  auran: 'Galespeech',
  aquan: 'Tidespeech',

  // Hyphenated pre-2026-10 canon forms - legacy saves keep fluency.
  'deep-thrum': 'Spanspeech',
  'concord of four': 'First Word',
  'concord-of-four': 'First Word',
  'wyrm-script': 'Wyrmspeech',
  'wyrm script': 'Wyrmspeech',
  'synod-speak': 'Echosong',
  'scrap-tongue': 'Scrapspeech',
  'mound-tongue': 'Moundsong',
  'echo-song': 'Echosong',
  'wyrm-script': 'Wyrmspeech',
  'root-veil': 'Rootveil',
  'first-word': 'First Word',
  'thorn-song': 'Thornsong',
  'vættir-speech': 'Vættir Speech',
  'span-speech': 'Spanspeech',
  'skin-tongue': 'Shifterspeech',
  'grove-sign': 'Grovesign',
  'cinder-speech': 'Cinderspeech',
  'war-cant': 'Warcant',
  'gloom-tongue': 'Gloomtongue',
  'vale-speak': 'Valespeak',
  'gale-speech': 'Galespeech',
  'tide-speech': 'Tidespeech',
  'under-cant': 'Undercant',
  'sluagh-whisper': 'Rabengast Whisper',
  'hex-speech': 'Hexspeech',
  'vat-sign': 'Vatsign',
  'archive-writ': 'Archive Writ',
  'span-runes': 'Span Runes',
  'keth-ash': 'Kethash',
  'weft-weave': 'Debt Weave',
  'debt-weave': 'Debt Weave',
  'vent-cant': 'Vent Cant',
  'shard-whisper': 'Shard Whisper',
  'vale-ink': 'Vale Ink',
  'current-cant': 'Current Cant',
  'crown-whisper': 'Crown Whisper',
  'vigil-cant': 'Vigil Cant',
};

export const LANGUAGE_CATEGORIES = {
  standard: { name: 'Trade Tongues', icon: 'fa-users', color: '#6B8E23', description: 'Trade cants and working pidgins of the seven regions' },
  exotic: { name: 'Exotic Languages', icon: 'fa-dragon', color: '#8B4513', description: 'Rare languages of otherworldly beings and ancient powers' },
  racial: { name: 'Ancestral Languages', icon: 'fa-star', color: '#9370DB', description: "Heritage tongues of Mythrill's races" },
  elemental: { name: 'Elemental Tongues', icon: 'fa-fire', color: '#4682B4', description: 'Languages of elemental forces and primal nature' },
  secret: { name: 'Secret Languages', icon: 'fa-user-secret', color: '#708090', description: 'Hidden languages known only to specific orders' },
  special: { name: 'Special Languages', icon: 'fa-scroll', color: '#B8860B', description: 'Coded, gestural and scholarly languages' }
};

// Normalize legacy, colloquial, and previously-canon names to current canon.
export const normalizeLanguageName = name => {
  if (typeof name !== 'string') return name;
  const trimmed = name.trim();
  if (!trimmed) return trimmed;
  const key = trimmed.toLowerCase();
  return LANGUAGE_ALIASES[key] || trimmed;
};
