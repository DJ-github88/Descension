/**
 * Mythrill Seed Tongues & Scripts
 *
 * Canon tongues and writing systems for the World > Tongues & Scripts tab.
 * Compiled against LORE_STYLE_GUIDE.md, CORE_LORE_FRAMEWORK.md, and the
 * canonical region/house tables. Seeded into languageStore on first load;
 * players may edit, delete, or extend them freely.
 */

export const SEEDED_LANGUAGES = [
  {
    id: 'lang-canon-gjaldmal',
    name: 'Gjaldmál',
    script: 'Ísletur',
    family: 'Northern Isolate',
    description: "Morð takes. The tithe-speech is how the Rime-Touched count what it leaves behind. Spoken below the Silence, where the wind stops and the glacier listens, Gjaldmál carries one clause no other Nordhalla tongue has: a debt-word that cannot be spoken while warm, because the tithe only hears cold voices. Every tithed child receives a name-rune cut into a cradle of river ice; the reader holds the cradle to the light of the Frozen Archive and speaks whatever the meltwater shows. If the ice empties before the name is read, the child is claimed, and the cradle is set adrift in the Sunder-Wall's melt channels. Old Nord speakers hear the grammar and flinch. It's their own language, spoken by someone who has already been paid for.",
    samplePhrase: 'Gjaldit er goldit, nafnit er mitt — the tithe is paid, the name is mine',
    lexicon: [
      { term: 'gjald', meaning: 'price, tithe; the weight a person carries for the cold' },
      { term: 'mál', meaning: 'speech; the part of a debt that can be said aloud' },
      { term: 'ísletur', meaning: 'ice-letter; a name carved to be read once, by meltwater' },
      { term: 'hljóð', meaning: 'the Silence; the pause between tithes, when Morð listens' }
    ],
    isCustom: false,
    worldId: 'mythrill',
    createdAt: '2026-09-13T00:00:00.000Z',
    updatedAt: '2026-09-13T00:00:00.000Z'
  },
  {
    id: 'lang-canon-daudrsongr',
    name: 'Dauðrsöngr',
    script: 'Beinlínur',
    family: 'Old Nord Liturgical',
    description: "The Doom-Choir doesn't sing for the dead. It sings them across, and Dauðrsöngr is the road. Every mourner wears a belt of notched whale-bone, one notch for each death they have witnessed, and reads the notches by touch through the long dark. The song has no first person; the grammar folds the living and the dying into one voice, so neither walks alone. A verse spoken out of turn is an open door, which is why the Choir trains nine winters before it may sing beside a pyre. When the Hungríd Cult stole a belt one lean winter, the Choir sang the thief's name into a blizzard. He was found at the Sunder-Wall with his hands over his ears.",
    samplePhrase: 'Hǫnd tekr hǫnd, ok engi gengr einn — hand takes hand, and no one walks alone',
    lexicon: [
      { term: 'rǫdd', meaning: 'voice; the part of the choir that carries' },
      { term: 'beinlínur', meaning: 'bone-lines; notches that record a life witnessed' },
      { term: 'einn', meaning: 'alone; the one state the song forbids' },
      { term: 'hǫnd', meaning: 'hand; both the living grip and the dying grip' }
    ],
    isCustom: false,
    worldId: 'mythrill',
    createdAt: '2026-09-13T00:00:00.000Z',
    updatedAt: '2026-09-13T00:00:00.000Z'
  },
  {
    id: 'lang-canon-vent-cant',
    name: 'Vent-Cant',
    script: 'Blue-Rune',
    family: 'Deep Warren Pidgin',
    description: "Frostmaw speaks with its vents, and the lowest galleries answer in Vent-Cant. The roar of the chimneys drowns every voiced word, so the words ride the exhale through clenched teeth, pitched to whatever note the nearest pipe is already singing. Groven elders say the language is older than the warrens, and that their ancestors carved its first grammar into the vat-caverns. The Fexric added the writing. Blue-Rune is pressure-dye brushed onto pipe walls; the mark shifts hue with heat, so a warning written at a cold valve reads as a different sentence at a hot one. Every chimney-clan keeps its own pressure-word. To speak a rival's pressure-word in their gallery is a confession or a threat, depending on how the pipes are humming.",
    samplePhrase: 'Kah-vent tri, blu-vekh, hold — third vent, blue pressure, brace',
    lexicon: [
      { term: 'kah', meaning: 'vent; also breath, also the note a pipe is singing' },
      { term: 'vekh', meaning: 'pressure; the weight a wall is currently carrying' },
      { term: 'blu-vekh', meaning: 'blue pressure; safe, but only while cold' },
      { term: 'hold', meaning: 'brace; the word shouted before a seal fails' }
    ],
    isCustom: false,
    worldId: 'mythrill',
    createdAt: '2026-09-13T00:00:00.000Z',
    updatedAt: '2026-09-13T00:00:00.000Z'
  },
  {
    id: 'lang-canon-shard-whisper',
    name: 'Shard-Whisper',
    script: 'Window-Glyphs',
    family: 'Veiled Cipher',
    description: "The Unlit Veil doesn't send letters. It sends shards. Window-Glyphs are cut into slivers of smoked glass, one glyph to a pane, and each agent in a cell is trusted with a single pane. Pressed to the eye at dawn, a pane shows one mark; at dusk it shows another. A full message lives only in the memory of the Veil's reader, who never writes it down and never says it whole. The spoken form is Shard-Whisper, all clipped vowels and tongue-taps, pitched to be lost in steppe wind. Ordavan riders who notice two herders clicking at each other across a water-hole learn to ride the long way around. The Khatun's own guard speak it and don't know it, which is the point.",
    samplePhrase: 'Vesh khaan-tor, Ordavan nak — the pane watches, the herd sleeps',
    lexicon: [
      { term: 'vesh', meaning: 'pane; a single glyph and the trust that guards it' },
      { term: 'khaan', meaning: 'window; the moment a message opens' },
      { term: 'tor', meaning: 'watcher; the reader who holds the whole sentence' },
      { term: 'nak', meaning: 'sleep; safe, unwatched' }
    ],
    isCustom: false,
    worldId: 'mythrill',
    createdAt: '2026-09-13T00:00:00.000Z',
    updatedAt: '2026-09-13T00:00:00.000Z'
  },
  {
    id: 'lang-canon-vale-ink',
    name: 'Vale-Ink',
    script: 'Mirror-Thinning',
    family: 'Mimir Register',
    description: "Every Mimir ledger is dictated twice: once in Vale-Speak, once in Vale-Ink. The second telling is the one that matters. Mirror-Thinning is less a script than a discipline of the hand; the scribe writes with ironwood-gall ink, and where the hand believes a false clause, the stroke thins by a hair. A trained Scribe Sentinel can weigh a finished page in two fingers and name the line that lied. House Thalreth's ledger-libraries run on the practice, which is why the Lord of Greymark keeps his own archive under three locks and trusts none of his kin to copy it. The fog eats memory. It has never learned to eat a page that argues back.",
    samplePhrase: 'Sael thuv, scraw virath — the fog keeps, the ink speaks',
    lexicon: [
      { term: 'scraw', meaning: 'ink; the witness that outlasts memory' },
      { term: 'thuv', meaning: 'keeps; what the hand does when the mind lets go' },
      { term: 'dun', meaning: 'thin; a stroke that admits a lie' },
      { term: 'sael', meaning: 'fog; the reach, the veil, the erasure' }
    ],
    isCustom: false,
    worldId: 'mythrill',
    createdAt: '2026-09-13T00:00:00.000Z',
    updatedAt: '2026-09-13T00:00:00.000Z'
  },
  {
    id: 'lang-canon-current-cant',
    name: 'Current-Cant',
    script: 'Kelp-Writ',
    family: 'Myrathil Deep-Isolate',
    description: "Sound travels differently under the ice, and the Myrathil let the current do the talking. Current-Cant is a trade register pitched low and long, meant to cross a league of black water without breaking into words the surface could catch. Its writing is Kelp-Writ: living kelp grown in rows and knotted at measured intervals, each gap timed to a tide. A message planted at the Sundered Monolith in the Treakous Rift can be read three days later by a shoal that never met the sender. The Board of Trade wrote the practice out of the Sea-Charter and has never caught one deep courier. Mareth, who has never answered directly, answers Kelp-Writ by moving the knots.",
    samplePhrase: 'Syl-ru thal, lhum-vael myra — the current carries, the deep remembers',
    lexicon: [
      { term: 'kelp-writ', meaning: 'living script; a message that grows while it waits' },
      { term: 'tide-gap', meaning: 'the silence between knots; when a message may be read' },
      { term: 'shoal-tongue', meaning: 'the low register; speech shaped to travel under ice' },
      { term: 'myra', meaning: 'tide; the measure of all promises' }
    ],
    isCustom: false,
    worldId: 'mythrill',
    createdAt: '2026-09-13T00:00:00.000Z',
    updatedAt: '2026-09-13T00:00:00.000Z'
  },
  {
    id: 'lang-canon-crown-whisper',
    name: 'Crown-Whisper',
    script: 'Hollow-Sight',
    family: 'Whisper-Cult',
    description: "The Masked Acolytes don't teach a language. They teach a blind spot. Crown-Whisper is heard in the seam between two sounds, and Hollow-Sight is what remains of it on the page: a script with no marks. A reader finds the sentence only by looking past it, in the corner of the eye, the way a hunter finds a hare by not staring. Hold the page in full view and the meaning drains from memory before the eye reaches the end; acolytes practice a full season to carry three words back to their masters. The counterfeit monolith wears Hollow-Sight across its face, which is why no honest copy of it exists, and why the Acolytes are patient with forgers in a way that ought to frighten them. Every reader who succeeds loses something small and cannot name what.",
    samplePhrase: '[three words, read only in the corner of the eye]',
    lexicon: [
      { term: 'seam', meaning: 'the silence between two sounds, where the whisper lives' },
      { term: 'hollow-sight', meaning: 'reading by looking away; the only proof of a page' },
      { term: 'vesper-mark', meaning: "a student's first sentence; never written, only witnessed" },
      { term: 'mask-tongue', meaning: 'speech that requires a covered face; the mask is the grammar' }
    ],
    isCustom: false,
    worldId: 'mythrill',
    createdAt: '2026-09-13T00:00:00.000Z',
    updatedAt: '2026-09-13T00:00:00.000Z'
  },
  {
    id: 'lang-canon-vigil-cant',
    name: 'Vigil-Cant',
    script: 'Ash-Rows',
    family: 'Sundari Liturgical',
    description: "Every dawn, the Dawn Vigil writes itself again. Ash-Rows are lines of cooled ash dragged across obsidian tablets with a finger; the letter holds its shape only until the stone warms, and by midday the tablet is blank. The litany is called Vigil-Cant, and it is spoken while it's written, each word run through the throat at the temperature of the verse. A line of mourning comes out cold, almost whispered. A line of Reforging comes out hot enough to sting. The Vigil teaches that a vow written in fire can't be stolen, only kept or lost. Visitors from Emberspire say the tablets look empty. The Vigil answers that they're simply between promises.",
    samplePhrase: 'Soth-resh kael, ash-ven dhel — the sun’s word burns, the ash keeps watch',
    lexicon: [
      { term: 'resh', meaning: 'word spoken at forge-heat; a binding promise' },
      { term: 'kael', meaning: 'ash; the witness that cools into silence' },
      { term: 'dhel', meaning: 'watch; the hours between writing and erasure' },
      { term: 'soth', meaning: 'sun; what remains of it in the stone' }
    ],
    isCustom: false,
    worldId: 'mythrill',
    createdAt: '2026-09-13T00:00:00.000Z',
    updatedAt: '2026-09-13T00:00:00.000Z'
  },
  {
    id: 'lang-canon-kessen-weave',
    name: 'Kessen-Weave',
    script: 'Debt-Knot',
    family: 'Neth Contract Register',
    description: "Debt in Bryngloom isn't signed. It's woven. The Kessen weavers speak their contracts aloud in a low, wet register while their hands work, and every clause becomes a knot in the bolt. The writing is Debt-Knot, and it's honest the way a rope is honest: pull a strand and you can read exactly how much interest has grown, and where the weave has frayed, the debtor has begun to fail. House Morrath keeps the Great Registry in a vault of stalled looms; each finished bolt is a family's standing, and Regent Morrath Neth can walk the rows and tell you which houses are rotting from the inside. The Keeper of the Last Threshold receives a knot for every debt paid in full. The pile isn't tall. It grows anyway, one knot a season, and Bryngloom takes that as a promise.",
    samplePhrase: 'Kessen veir, thul nam — the weave remembers, the debt holds',
    lexicon: [
      { term: 'kessen', meaning: "weave; the contract as it's made, one knot per clause" },
      { term: 'thul', meaning: 'debt; the weight a loom can measure' },
      { term: 'veir', meaning: "remembers; what a strand does when it's pulled" },
      { term: 'nam', meaning: 'holds; the promise still keeping' }
    ],
    isCustom: false,
    worldId: 'mythrill',
    createdAt: '2026-09-13T00:00:00.000Z',
    updatedAt: '2026-09-13T00:00:00.000Z'
  }
];
