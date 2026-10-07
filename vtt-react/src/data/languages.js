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
  // ===== STANDARD LANGUAGES =====
  {
    name: "Wayfarer's Cant",
    icon: 'fa-users',
    category: 'standard',
    description: "The trade-tongue the fractured houses built out of necessity. When the Dark Bargains broke every noble line, merchants still had to weigh grain, price a hostage, and swear a road-oath, so the seven regions stitched a pidgin from every tongue they could reach. It belongs to no one and everyone speaks it. A Wayfarer's Cant sentence is short, blunt, and built to be understood by a stranger who may be lying.",
    sound: 'Blunt and adaptable, with familiar vowels and worn-down consonants borrowed from a dozen regions. No music in it, only clarity.',
    example: "Weight's fair, coin's cold, road's open.",
    translation: 'The goods are honest, the payment is up front, and I may pass. (The standard opening of a road-bargain.)'
  },
  {
    name: 'Deep-Thrum',
    icon: 'fa-mountain',
    category: 'standard',
    description: "The slow, grinding geological language of the Cragjaw Peaks' mineral consciousness and the ancient Thrumm stone-trolls who predate all surface races. Each word is a seismic event; a full sentence may take minutes. Hard consonants like shifting granite, chest-rumbling syllables with long silences between that feel like tectonic drift. The mountain itself rumbles in reply.",
    sound: 'Deep and grinding, like stone plates shifting. Syllables that feel like distant avalanches, punctuated by grinding pauses that can stretch for heartbeats.',
    example: 'THRUM... KA... DUR',
    translation: 'The mountain acknowledges your passage. Stone remembers, stone endures.'
  },
  {
    name: 'Synod-Speak',
    icon: 'fa-tree',
    category: 'standard',
    description: "The resonant harmonic language of the Synod Hold's crystal-lattice archives in Sundrift Vale. Lumian echo-signatures speak in its overtones; Astril scholars use it for formal discourse. Each word vibrates at a frequency that memory-glass can store.",
    sound: 'Harmonic and crystalline, with overtones that shimmer like light through prismatic glass. Words ring and sustain.',
    example: 'Syl-velen aeth-mir',
    translation: 'Light remembers, spirit endures'
  },
  {
    name: 'Scrap-Tongue',
    icon: 'fa-spider',
    category: 'standard',
    description: "The salvage-patois of the Frostwood Reach's lesser fae, peat-bog scavengers, and the Revel's abandoned courtiers who never left the party. A practical language of improvisation and barter, borrowing freely from every tongue it touches. No two speakers sound alike.",
    sound: 'Harsh yet adaptable, with sharp consonants borrowed from a dozen languages and nasal tones that carry through the fog.',
    example: 'Kik-scrap grosh-barter! Teek tak!',
    translation: 'Quick salvage, good trade! I take!'
  },
  {
    name: 'Mound-Tongue',
    icon: 'fa-house',
    category: 'standard',
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
    description: "The devouring-speech of Keth Amar's silence-spawn and the Wyrd-touched things that answer it. Scathrach the Ashen Sovereign speaks it in Emberspire's deepest vent, and the words come up tasting of ash. Kethvash has no word for mercy and a dozen for hunger; exorcists learn just enough of it to know when they are being studied.",
    sound: 'Searing and broken, full of stops that scrape the throat and long vowels that seem to pull the air toward the speaker.',
    example: "Keth-vorath ix amar-neth",
    translation: 'The eater hungers, the silence consumes forever'
  },
  {
    name: 'Echo-Song',
    icon: 'fa-sun',
    category: 'exotic',
    description: "Lumia's echo, carried offworld by the Astril refugees and still resonating in their crystalline blood. It is less a language than a remembered biosphere: harmonics that hold the cadence of a star's light and the shape of a world Keth Amar ate. The Synod Hold's recording-lattices hum with it, and every Astril learns it before they learn to lie.",
    sound: 'Luminous and cold, clear tones that sustain like crystal bells struck by starlight, with overtones that seem to arrive from very far away.',
    example: "Ael-drin sol-athiel val-mor",
    translation: 'Blessed light of the dying star endures'
  },
  {
    name: 'Wyrm-Script',
    icon: 'fa-dragon',
    category: 'exotic',
    description: "The ice-wyrm ritual language preserved in the Frozen Archive's deepest vaults beneath Nordhalla. Used in ancient binding rituals, the Rite of the Cold Hearth, and the oldest lichborne phylacteries. Karr Bloodhammer's original contract was written in it.",
    sound: 'Ancient and frigid, with rolling consonants like distant avalanches and sibilant whispers of freezing breath.',
    example: 'Karr-vahzen drah-kuld',
    translation: 'The cold soul endures beyond the ice'
  },
  {
    name: 'Root-Veil',
    icon: 'fa-brain',
    category: 'exotic',
    description: "The mycelial network's ancient whisper-language, older than any surface civilization. Morvane and the fungal entities of the Bryngloom Forest speak it; the Over-Lit hear it constantly. It sounds like spores settling on old bone, and it remembers everything the bogs have swallowed.",
    sound: 'Alien and unsettling, with sub-vocal clicks, fungal hisses, and sounds that seem to bypass the ears entirely.',
    example: "Kss-vul nyr-gast thol-veir",
    translation: 'We observe your debt. The Gloom remembers.'
  },
  {
    name: 'Aethilic',
    icon: 'fa-fire-flame-curved',
    category: 'exotic',
    description: "The consequence-grammar Aethil uses to witness a binding. Aethilic does not conjure; it records. Every clause spoken aloud is heard by something older than the house that spoke it, so the tongue is built from conditions, exemptions, and prices rather than verbs and wishes. Athien contract-houses keep whole vaults of Aethilic codices, and the oldest sections predate the Star-Fall. Sections added later carry Keth's false father-doctrine, which is why a careful notary reads the provenance before the terms.",
    sound: 'Precise and formal, measured syllables that land like a weigh-scale settling. It sounds less spoken than entered into a ledger.',
    example: 'Contractum aeternum vinctura anima',
    translation: 'The eternal contract binds the soul'
  },
  {
    name: 'First-Word',
    icon: 'fa-wind',
    category: 'exotic',
    description: "The root-language the four elemental tongues descend from, older than the elementals themselves. Mareth's first words were First-Word, spoken from the pressure of the deep before there was a shore to hear them. The Deep Thrum beneath Cragjaw grinds in a dialect so old it barely counts as speech. A whole First-Word sentence can shift from water to fire to stone between two syllables, because it never agreed those were separate things.",
    sound: 'Raw and shifting, flowing water and crackling fire and rushing air and grinding earth inside a single breath.',
    example: "Kh'aur-dra ign'vael thal'aqu dhur'terr",
    translation: 'Air-fire-water-earth as one'
  },
  {
    name: 'Thorn-Song',
    icon: 'fa-seedling',
    category: 'exotic',
    description: "The binding tongue of the fae who accepted House Viridane's counter-bargain in the moonlit groves. Florae thorns resonate with its cadence and the Oaken sing it to their groves; the Revel's celebration-song is Thorn-Song, looping forever because the party never agreed to end. Every promise spoken in Thorn-Song leaves a thorn somewhere, and the Thorn-Fall is only the pile of the ones that were broken.",
    sound: 'Musical and unsettling, like wind through thorn-briars, with trilling notes that hang in the air a heartbeat too long.',
    example: "Loun-syl vaen-drael virathel",
    translation: 'The eighth house endures beneath the leaves'
  },
  {
    name: 'Shanty Argot',
    icon: 'fa-dungeon',
    category: 'exotic',
    description: "The rope-bridge pidgin of the Over-Shanty, the hanging slums beneath Atropolis. It knits together Gloom-Tongue, Riven silence-codes, and merchant shorthand, and it changes fast enough that no Athien contract-house has ever codified it. A word is only good until the guards learn it, so the argot is less a language than a standing refusal to be written down.",
    sound: 'Hushed and quick, all sibilants and clipped rope-signals, pitched to carry along a bridge without carrying to the canopy.',
    example: "Ss'drunn ss'gloom-tak now-now",
    translation: 'The Riven whisper, the Gloom takes, move quickly'
  },
  {
    name: 'Vættir-Speech',
    icon: 'fa-mountain',
    category: 'exotic',
    description: "The speech of Nordhalla's land-spirits, the vættir who hold the fjords and slopes the Skald never claimed. Landvaettir, vettir, the nokk, the hollow-backed huldra, and the Fossegrim-Ice all answer to it, though none answer on demand. Skald farmers leave a bowl at the boundary stone and speak Vættir-Speech into it, because a spirit that has been greeted is far less likely to drown your herd. The grammar has no polite register. There is respectful, and there is already-too-late.",
    sound: 'Low and resonant, half-heard, like wind worrying a boundary stone, with long pauses where a human would put a word.',
    example: 'Haugr heil, ve vetr, gang vara',
    translation: 'Hearth be whole, winter be warned, let the herd pass'
  },
  {
    name: 'Neteru Liturgy',
    icon: 'fa-gem',
    category: 'exotic',
    description: "The liturgical command-language of the guardian-spirits of Sundale and the deep vents. Lamassu speak it at gateways, ushabti carry it out without question, and the sun-faced ammit renders verdicts in it. Every sentence is a commandment with a named witness, which is why the spirits obey it and mortals usually should not. Emberspire's Ash-Woven Oracles transcribe Neteru Liturgy onto soot-tablets, and the tablets argue back.",
    sound: 'Formal and declarative, weighty words that arrive like verdicts, with a low drone under the last syllable of each command.',
    example: 'Utuk gate-kal, lamassu men, ammit khar',
    translation: 'The gate is watched, the sentinel stands, the devourer waits'
  },

  // ===== ANCESTRAL & RACIAL LANGUAGES =====
  // NOTE: The Astril people have no dedicated language id of their own. They communicate through
  // Synod-Speak (formal discourse), Echo-Song (Lumia's echo resonating in their vessels),
  // and Veilspeech (the dream-speech of the spirits). No Astril-specific language is defined.
  {
    name: 'Old Nord',
    icon: 'fa-mountain',
    category: 'racial',
    description: "The ancestral language of the Skald people of Nordhalla, preserved in the Frozen Archive's clockwork city-library and spoken natively by the Skald human subrace. Filled with tales of ice, endurance, and the Hunger Pact that lives in every Rime-Born bloodline. Spoken at Bloodhammer funeral-pyres.",
    sound: 'Bold and resonant, echoing with the strength of glacier winds and the clarity of eternal winter.',
    example: 'Frosthald hungrvegr',
    translation: 'Hold fast to honor in the endless cold'
  },
  {
    name: 'Span-Speech',
    icon: 'fa-gem',
    category: 'racial',
    description: "The grinding stone-tongue of earth elementals and the Groven who were shaped from them. Groven speak a calcified dialect that moves like the Ancestor-Spans shifting under blizzard-weight, and the Deep Thrum answers in something older still. A Span-Speech sentence is a load-bearing structure: remove a syllable and the meaning collapses, which is why Groven elders can sound like they are arguing when they are agreeing.",
    sound: 'Deep and rumbling, low grinding tones with mineral resonance, long words that settle like sediment.',
    example: "Dhorgum krath'veil",
    translation: 'Stone rumbles deep. The vat remembers.'
  },
  {
    name: 'Veilspeech',
    icon: 'fa-ghost',
    category: 'racial',
    description: "The whispered tongue of spirits, the Veilborn, and the things that persist between the Wyrd and the physical world. Lumian echo-spirits murmur it through an Astril vessel's dreams, and the Fossegrim hum it to the ice. It sits at the edge of hearing; a mortal listener gets the meaning a half-breath after the sound, which is why mediums learn to answer before they are sure they were spoken to.",
    sound: 'Breathy and barely there, hollow vowels and whispered fricatives that seem to come from just behind the ear.',
    example: "Fhae'sul thae'vir isel'nym",
    translation: 'Between worlds, we speak. Between breaths, we listen.'
  },
  {
    name: 'Skin-Tongue',
    icon: 'fa-masks-theater',
    category: 'racial',
    description: "The shifting speech of actual shapeshifting communities, not a single ancestry. Each speaker carries an inward dialect, so a sentinel who listens closely can name the changeling by cadence alone even after the face has changed. Pooka and lesser fae use it as a game, wearing three voices in one sentence. A Skin-Tongue conversation has no fixed speaker; the truth is what the grammar decided to keep.",
    sound: 'Fluid and unstable, palatal consonants and liquid tones that seem to change shape between the first word and the last.',
    example: "Shael'nyr voresh'im",
    translation: 'I wear many faces. Truth is what I choose.'
  },
  {
    name: 'Grove-Sign',
    icon: 'fa-leaf',
    category: 'racial',
    description: "The guarded code of grove initiates, sworn to the older roots. It passes teacher to initiate in the deepest Bryngloom hollows and the Frostwood ironwood hearts, and it has never been written down where an outsider could find it. Grove-Sign is not a hidden language so much as a hidden grammar; the words are ordinary, and the meaning is the order they are given in. A broken oath is read in the sequence long before anyone admits the words were said.",
    sound: 'Structured clicks, low trills, and flowing syllables woven into a grammar only initiates follow.',
    example: "Klik'thar vash'en druil",
    translation: 'The grove speaks: balance returns'
  },
  {
    name: 'Cinder-Speech',
    icon: 'fa-fire',
    category: 'racial',
    description: "The volatile tongue of fire elementals, Emberspire's magma-children, and the flame-touched. The Korr Sun-Speakers hold entire six-hour vigils in it, speaking only inside their minds to keep the heat from escaping their mouths. Scathrach's voice twists Cinder-Speech into Kethvash when it answers, which is the surest sign that what is listening is not merely fire.",
    sound: 'Sharp explosive stops and hissing sibilants, crackling with a rhythm like magma meeting ice.',
    example: "Kra'shek tar'vek iss",
    translation: 'Flame crackles hot. The ember endures.'
  },
  {
    name: 'Feralspeech',
    icon: 'fa-paw',
    category: 'racial',
    description: "The low register that lets a speaker trade meaning with beasts. The Thrumm understand it in their slow way, ice-wyrms in their cold way, and crag-cats only when it suits them. It is built on pitch, posture, and scent rather than vocabulary, and it grants no obedience. A ranger who speaks Feralspeech can ask a wolf why it is limping. It cannot make the wolf move.",
    sound: 'Low gutturals, growls, and tonal shifts that carry as much meaning through pitch and posture as through sound.',
    example: "Grr'krakth thol'vrin",
    translation: 'Pack-hunt together-strong'
  },
  {
    name: 'Bonewrit',
    icon: 'fa-skull',
    category: 'racial',
    description: "The cold tongue of the undead, the Debt-Revenants who rise to finish a broken contract, and the lichborne souls bound to basalt phylacteries. The Frozen Archive's oldest revenant-scribes write only in Bonewrit, and their ink is a suspension of their own ground bone. Spoken Bonewrit steals the warmth from the air around it; a room grows cold before the speaker finishes the first clause.",
    sound: 'Hollow and dark, breathy fricatives and deep resonants that seem to draw the heat out of a room.',
    example: "Vhyl'kraz nthar'vel dhrim",
    translation: 'In death, we find eternal rest. The contract remains.'
  },
  {
    name: 'War-Cant',
    icon: 'fa-axe-battle',
    category: 'racial',
    description: "The tactical battle-speech developed in the Bloodhammer Sump's geothermal skirmishes and refined during the War of Thousand Screams. Clipped commands, hand-sign modifiers, and gestural shorthand designed to carry over forge-noise and howling Nordhalla wind.",
    sound: 'Guttural and aggressive, with sharp stops and explosive consonants that cut through combat noise.',
    example: "VAEL-GRUM! Krath'voel! Dhra'kesh!",
    translation: "By Vaelen and Grum! Hold the forge! Break their line!"
  },
  {
    name: 'Gloom-Tongue',
    icon: 'fa-moon',
    category: 'racial',
    description: "The ancestral language of the Bryngloom Forest, spoken by Mycellan and Athien alike. Carries the cadence of the Root-Veil's mycelial whispers beneath its surface syllables. The Over-Lit lose Gloom-Tongue last; it is the final thing the hush takes.",
    sound: 'Low and nasal, with murmured consonants and submerged syllables that echo from beneath the peat.',
    example: "Mulgresh veir'nam gloam'dhur",
    translation: 'The Gloom keeps. The root speaks. The veil holds.'
  },
  {
    name: 'Vale-Speak',
    icon: 'fa-feather',
    category: 'racial',
    description: "The memory-language of the Mimir, developed in the Frostwood Reach after the Purge that destroyed the art of mask-forging ninety years ago. Incorporates fog-adapted tonal shifts that carry identity where faces cannot. Each speaker's dialect is as unique as a lost mask.",
    sound: 'Mist-soft with layered sibilants, tonal shifts that carry identity through fog. Each voice uniquely identifiable.',
    example: "Sael'myr thuv'ael virath",
    translation: 'The fog holds. The mask remembers. The vale speaks.'
  },
  {
    name: 'Sundari',
    icon: 'fa-sun',
    category: 'racial',
    description: "The ember-tongue of the Solari people, forged in the shadow of Emberspire. Incorporates heat-gradations as grammatical markers, a word spoken at one temperature means something different at another. The Korr Sun-Speakers elevate it to sacred silence.",
    sound: 'Warm and layered, with tonal shifts that suggest temperature. Ranges from forge-hot consonants to ash-cool vowels.',
    example: "Soth'keth vir'rash thrask'dhel",
    translation: "The sun's ember. The priest tends. The ranger guards."
  },
  {
    name: 'Fex',
    icon: 'fa-cog',
    category: 'racial',
    description: "The industrial tongue of the Fex, developed in the vertical subterranean city of Frostmaw Holdfast around geothermal chimneys. Incorporates pipe-resonance harmonics and pressure-hiss modifiers. The Deep Alchemists' oldest formulae are written in Fex.",
    sound: 'Mechanical and resonant, with pipe-harmonics and pressure-hiss consonants. Echoes like a foundry at work.',
    example: "Alchemite'vek keth'syrin dhav'holm",
    translation: 'The guild binds. The clan roams. The vat holds.'
  },

  // ===== ELEMENTAL TONGUES =====
  {
    name: 'Concord of Four',
    icon: 'fa-wind',
    category: 'elemental',
    description: "The bridge-tongue the four elemental powers use when they must agree. It is a stripped-down descendant of First-Word, holding only the grammar that fire, water, earth, and air can all accept, with every clause that favors one element burned out of it. Elemental summoners use it as the safest way to make a binding understood by all four at once. It is a language of consensus, and it is short, because consensus between the elements rarely lasts.",
    sound: 'Balanced and shifting, a plain harmony of all four elemental cadences, deliberately stripped of flourish.',
    example: 'Vael-urn keth-sol dhav-lhum',
    translation: 'All elements hear. All elements answer.'
  },
  {
    name: 'Greenmantle',
    icon: 'fa-leaf-oak',
    category: 'elemental',
    description: "The raw speech of the living world, older than the Dark Bargains and older than Sol's binding. The Frostwood's ironwood trees murmur it, the Bryngloom's peat-bogs keep it, and the wild and ancient beings of all seven regions root through it. Greenmantle is less a language spoken than one overheard; mortals get fragments, and the fragments are usually about patience, growth, and what the world intends to outlast.",
    sound: 'Deep resonant chanting with heavy vowel harmony, less speech than the sound of a place talking to itself.',
    example: "Gruum'vael thol'en dir'na",
    translation: 'Grow. Thrive. Root deep.'
  },
  {
    name: 'Gale-Speech',
    icon: 'fa-cloud',
    category: 'elemental',
    description: "The light, cutting tongue of sky-dwelling elementals, wind-spirits, and the blizzard-voices that ride above Cragjaw's snow-veil. It is all breath and no body, shaped to be thrown across open air without losing its edges. Storm-chasers listen for Gale-Speech in the howl before a whiteout, because the wind argues with itself just before it turns.",
    sound: 'Breathy fricatives and whistling high vowels, light and airy, with a wind-rush cadence.',
    example: "Fhael'whir suth'aer vael'kesh",
    translation: 'Wind whispers high where the blizzard hides'
  },
  {
    name: 'Tide-Speech',
    icon: 'fa-water',
    category: 'elemental',
    description: "The fluid tongue of aquatic peoples and the deep itself. Foam-spawned Myrathil learn it from finders, chosen kin, and their community rather than from any womb, and they carry it into every port that barely admits they exist. Mareth answers in Tide-Speech through currents, storms, and signs, never routine prophecy. A promise made in Tide-Speech is measured by tide, which is the only measure that has never failed the Myrathil.",
    sound: 'Liquid consonants and flowing vowels with a wave-like rhythm, smooth, low, and made to travel under ice.',
    example: "Lhum'vael syl'ru thar'nym",
    translation: 'Flowing current runs deep. The tide remembers.'
  },

  // ===== SECRET LANGUAGES =====
  {
    name: 'Under-Cant',
    icon: 'fa-mask',
    category: 'secret',
    description: "The working code of the Over-Shanty underworld: rogues, smugglers, fence-men, and the Riven, who have no legal name to sign and so sign everything in shorthand. It hides meaning inside ordinary market talk, tapping a stall's price-board or complaining about the weather in a settled pattern. The Riven keep a variant built for people the law cannot admit exist, which is exactly the audience Under-Cant was made for.",
    sound: 'Coded and subtle, flat and boring on purpose, with meanings buried in pauses, taps, and repeated common words.',
    example: 'The red door is warm, but the window sings',
    translation: 'The front is guarded, use the side entrance silently'
  },
  {
    name: 'Sluagh-Whisper',
    icon: 'fa-ghost',
    category: 'secret',
    description: "The hush the Sluagh leave in a room after they pass. The memory-eating swarm of the Frostwood Reach does not speak so much as swallow the sound around its words, so a sentence arrives with holes in it and the listener supplies the missing pieces from their own recollection. Familiars and mediums carry messages in Sluagh-Whisper because the swarm will not eat what it recognizes as its own. Everyone else forgets they were ever addressed, which is the point.",
    sound: 'Silence with a shape, words heard mainly by what is missing between them. The listener often answers a sentence nobody remembers hearing.',
    example: '[the sentence you have already forgotten being told]',
    translation: 'We have already taken it. You will not miss it.'
  },
  {
    name: 'Hex-Speech',
    icon: 'fa-seedling',
    category: 'secret',
    description: "The guarded ritual language of the Bryngloom's root-wards and bog-curses. Spoken by those who tend the fungal shrines and bargain with the Grandmother of the Bog. Not taught, absorbed through exposure to mycelial memory-deposits.",
    sound: 'Harsh staccato clicks interwoven with low sustained drones, like the bog itself speaking.',
    example: "Krag'vex thul'mir nur'gash",
    translation: 'The wild wood speaks. The Gloom answers.'
  },
  {
    name: "Trickster's Cant",
    icon: 'fa-mask',
    category: 'secret',
    description: "A coded language used by gamblers, information brokers, and those who trade in misdirection across the seven regions. Incorporates false tells and recursive lies; skilled speakers can embed a truth inside three nested deceptions.",
    sound: 'Playful and deceptive, with intentional misdirections and layered meanings.',
    example: 'The raven smiles at midnight, but the worm laughs at dawn',
    translation: 'Trust nothing. Verify everything. The joke is on whoever believes.'
  },

  // ===== SPECIAL LANGUAGES =====
  {
    name: 'Vat-Sign',
    icon: 'fa-hands',
    category: 'special',
    description: "The silent hand-cant the Groven Vat-Breakers built to coordinate a rebellion with the Deep Alchemists listening. It spread from the revolt through every region, because everyone eventually needs to speak over a roar, a forge, or a watchful overseer. Vat-Sign is fully grammatical, not a handful of gestures, and it keeps a formal register used in Athien courts where the walls have ears.",
    sound: 'Silence. Meaning rides on precise hand-shapes, rhythm, and hold.',
    example: '[hold, snap, flat, twice: look, wait, danger]',
    translation: 'Words without sound. Meaning through motion.'
  },
  {
    name: 'Archive-Writ',
    icon: 'fa-scroll',
    category: 'special',
    description: "The script of the pre-Binding civilization entombed in Nordhalla's Frozen Archive, caught mid-sentence when the glacier took the city. The letters are cut shallow and read by raking light across the ice, so a page that thaws is a page lost. Rime-Born Rune Keepers spend whole careers on a single vault, and the oldest carvings under Vargtor run centuries deeper than the Skald, which the Keepers still cannot agree whether to translate or answer.",
    sound: 'Frozen and formal. Each phrase was cut once and never spoken aloud again, so readers reconstruct the sound and are never certain they are right.',
    example: 'Rist-þar, ís-bók, orð varðveitt',
    translation: 'Cut there, ice-book, word preserved.'
  },
  {
    name: 'Span-Runes',
    icon: 'fa-gem',
    category: 'special',
    description: "The elder stone-script of the Ancestor-Spans, carved by the first Cragjaw dead whose calcified bodies became the bridges. Every span carries a rune-row that is half lineage-record and half load-tally, and Groven toll-keepers read the spans the way other peoples read contracts. The script predates Groven speech; the Deep Thrum only rumbles at it, which the Stone-Moot has decided to treat as neither approval nor refusal.",
    sound: 'Grinding and clipped, pitched low against the stone it was cut for. A sentence sounds like a mason checking whether a span will hold.',
    example: 'Grum-kald, bein-vegr, heldr-þar',
    translation: 'Stone-cold, bone-road, holds there. The dead carry the crossing.'
  },
  {
    name: 'Keth-ash',
    icon: 'fa-fire',
    category: 'special',
    description: "A dead precursor to Kethvash, spoken by the first silence-spawn before the Devouring learned to answer. Keth-ash survives in fragments: burnt-off ledger-ends, scorched phylacteries, and the margins of Aethilic codices that notaries refuse to copy. Scholars read it; no one speaks it. A single overheard syllable is how the thing on the other end learns a name, and it keeps the ones it learns.",
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
  celestial: 'Echo-Song',
  lumian: 'Echo-Song',
  infernal: 'Aethilic',
  primordial: 'First-Word',
  sylvan: 'Thorn-Song',
  'shanty-patois': 'Shanty Argot',
  shantypatois: 'Shanty Argot',
  terran: 'Span-Speech',
  ethereal: 'Veilspeech',
  changeling: 'Skin-Tongue',
  druidic: 'Grove-Sign',
  ignan: 'Cinder-Speech',
  'beast speech': 'Feralspeech',
  beast_speech: 'Feralspeech',
  beastspeech: 'Feralspeech',
  necril: 'Bonewrit',
  "thieves' cant": 'Under-Cant',
  'thieves cant': 'Under-Cant',
  thievescant: 'Under-Cant',
  'sign language': 'Vat-Sign',
  sign_language: 'Vat-Sign',
  signlanguage: 'Vat-Sign',
  elemental: 'Concord of Four',
  primal: 'Greenmantle',
  auran: 'Gale-Speech',
  aquan: 'Tide-Speech'
};

export const LANGUAGE_CATEGORIES = {
  standard: { name: 'Standard Languages', icon: 'fa-users', color: '#6B8E23', description: 'Common tongues spoken across the seven regions' },
  exotic: { name: 'Exotic Languages', icon: 'fa-dragon', color: '#8B4513', description: 'Rare languages of otherworldly beings and ancient powers' },
  racial: { name: 'Ancestral Languages', icon: 'fa-star', color: '#9370DB', description: "Heritage tongues of Mythrill's races" },
  elemental: { name: 'Elemental Tongues', icon: 'fa-fire', color: '#4682B4', description: 'Languages of elemental forces and primal nature' },
  secret: { name: 'Secret Languages', icon: 'fa-user-secret', color: '#708090', description: 'Hidden languages known only to specific orders' },
  special: { name: 'Special Languages', icon: 'fa-scroll', color: '#B8860B', description: 'Universal and scholarly languages' }
};

// Normalize legacy, colloquial, and previously-canon names to current canon.
export const normalizeLanguageName = name => {
  if (typeof name !== 'string') return name;
  const trimmed = name.trim();
  if (!trimmed) return trimmed;
  const key = trimmed.toLowerCase();
  return LANGUAGE_ALIASES[key] || trimmed;
};
