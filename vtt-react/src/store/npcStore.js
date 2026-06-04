import { create } from 'zustand';

const NPC_DATA = {
  'aldren-thalreth': {
    id: 'aldren-thalreth',
    name: 'Aldren Thalreth',
    title: 'Lord of Greymark, High Confessor of the Frozen Light (in stasis)',
    race: 'Thalren human',
    gender: 'Male',
    factionIds: ['house-thalreth', 'church-of-the-holy-light', 'scribe-sentinels'],
    locationIds: ['greymark-keep', 'frozen-archive'],
    age: 'Unknown — entered stasis at 57, has been frozen for 700+ years',
    status: 'In meditative stasis',
    appearance:
      'A tall, gaunt man with sharp Thalren features, frozen in a seated meditation posture inside a block of translucent ice. His eyes are closed, his hands rest on his knees, and his lips are slightly parted — as if he is about to speak. He wears the ceremonial white-and-gold robes of the High Confessor, now brittle with age.',
    personality:
      'Before his stasis, Aldren was described as thoughtful, melancholic, and burdened by knowledge he could not share. He spoke rarely, chose words with surgical precision, and had a habit of staring at people for long moments before responding. Those who knew him best say he was already half-gone before he froze himself — as if something had hollowed him out from within.',
    backstory:
      'Aldren Thalreth was the first High Confessor of the Church of the Holy Light, founded in Year 13 of the Dimming. He led the Church for 76 years, during which he discovered a terrible truth in the oldest sealed texts: the Light and the Void are not opposites — they are a single entity, split in two, and their reunification will end existence. Unable to reconcile this with his faith, and unwilling to share the knowledge, he arranged for his own meditative stasis in the deepest vault of the Frozen Archive. He has not spoken since Year 89 of the Dimming. Pilgrims still visit his frozen chamber, reporting that they receive impressions of profound sorrow and fragments of thought that feel like warnings.',
    hooks: [
      'If awakened, Aldren would possess knowledge that could shatter the Church of the Holy Light',
      'The sealed texts he discovered are still hidden somewhere in the Frozen Archive — no one has found them since',
      'Some pilgrims report that Aldren\'s lips have moved. The Scribe-Sentinels dismiss this as frost-crack.'
    ]
  },

  'elara-thalreth': {
    id: 'elara-thalreth',
    name: 'Elara Thalreth',
    title: 'Keeper of the High Hearth',
    race: 'Thalren human',
    gender: 'Female',
    factionIds: ['house-thalreth'],
    locationIds: ['greymark-keep'],
    age: '52',
    status: 'Active',
    appearance:
      'A stout woman with iron-grey hair braided tightly against her skull and hands permanently scarred from handling hot resin-candles. She wears a heavy apron of treated leather over layered wool robes. Her eyes are pale grey, sharp, and perpetually narrowed — she has been squinting against smoke for four decades.',
    personality:
      'Elara is warm, practical, and ruthlessly efficient. She runs the High Hearth with military precision and has no patience for politics, posturing, or priests. She is one of the few people in Greymark who speaks openly about Aldren\'s stasis — she calls it "the Lord\'s long nap" and refuses to treat it with reverence.',
    backstory:
      'Elara was born into the Thalreth household as a distant cousin, raised alongside the family but never in line for succession. At 16, she requested to be assigned to the High Hearth rather than trained in governance. She has tended the central fire for 36 years, longer than any previous Keeper. She knows the Hearth\'s secrets — including the hidden passage behind the throne that leads to the old Ledger Halls.',
    hooks: [
      'Elara knows about the hidden passage and might share its location with someone she trusts',
      'She has been secretly corresponding with a Briaran elder about the history of the Fog Compact — knowledge that could destabilize House Thalreth'
    ]
  },

  'caedren-thalreth': {
    id: 'caedren-thalreth',
    name: 'Caedren Thalreth',
    title: 'Master Scribe of the Scribe-Sentinels',
    race: 'Thalren human',
    gender: 'Male',
    factionIds: ['house-thalreth', 'scribe-sentinels'],
    locationIds: ['scribes-tower'],
    age: '38',
    status: 'Active',
    appearance:
      'A thin, stoop-shouldered man with ink-stained fingers and prematurely grey hair. He wears the grey robes of a Scribe-Sentinel and carries a quill behind his left ear at all times. His eyes are pale and his gaze unsettlingly direct — he looks at people the way he looks at ledgers, as if searching for an error that has been written into them.',
    personality:
      'Caedren is meticulous, quiet, and morally flexible. He genuinely believes that the edits he makes to the ledgers are necessary — that some truths are too destructive to preserve. He tells himself he is protecting the Reach. He does not enjoy the work, but he has made peace with it.',
    backstory:
      'The second son of Lord Aldren, Caedren was never expected to inherit anything. He found his purpose in the Scribes\' Tower, where his methodical nature made him an excellent archivist. When the Great Revision began, he was asked to make his first edit: removing a village that had been destroyed by Gref incursion, because its continued existence in the ledgers confused trade calculations. He has not stopped editing since.',
    hooks: [
      'Caedren knows the location of the original, unedited First Ledger — hidden in a false compartment beneath the tower',
      'He is beginning to suspect that his edits may have caused more harm than they prevented, but he cannot stop without exposing the entire Revision'
    ]
  },

  'sigurd-skalvyr': {
    id: 'sigurd-skalvyr',
    name: 'Sigurd Skalvyr',
    title: 'Jarl of Nordhalla',
    race: 'Skald human',
    gender: 'Male',
    factionIds: ['house-skalvyr'],
    locationIds: ['frozen-archive'],
    age: '61',
    status: 'Active',
    appearance:
      'A man carved from glacier ice — tall, broad-shouldered, with a lined face, pale blue eyes, and a thick white beard that he keeps braided with iron rings. He wears a coat of white bear fur over chainmail. His voice is a low rumble that seems to come from somewhere deeper than his chest.',
    personality:
      'Sigurd speaks rarely and decides slowly. Once a decision is made, he never reverses it. He is respected rather than loved, feared rather than admired. He carries the weight of Nordhalla\'s survival like a physical burden, and it shows in every line of his face.',
    backstory:
      'Sigurd has been Jarl for 34 years, longer than any Skalvyr ruler in recent memory. He has kept Nordhalla stable through the longest winter in recorded history, but the geothermal sumps are failing, and he knows his people cannot survive another generation without heat. His secret negotiations with the Cult of Forgotten Shadow weigh on him — he is a man of old oaths making deals with something that does not honor them.',
    hooks: [
      'Sigurd\'s youngest daughter, Frigga, has become deeply involved with the Cult — more deeply than he knows',
      'He has the only map that shows the hidden geothermal vents beneath the Frozen Archive'
    ]
  },

  'natalie-seline': {
    id: 'natalie-seline',
    name: 'Natalie Seline',
    title: 'First Shadow, Voice of the Silence',
    race: 'Human (Morren)',
    gender: 'Female',
    factionIds: ['cult-of-forgotten-shadow'],
    locationIds: ['over-shanty', 'peat-bog-sinks'],
    age: 'Unknown — at least 400 years',
    status: 'Active',
    appearance:
      'A woman with blank white eyes, pale skin stretched thin over sharp cheekbones, and long black hair streaked with silver. She wears dark robes stitched with silver thread in patterns that shift when viewed indirectly. Her voice has a dual quality — her own words carry a faint undertone of something deeper, a resonance just below hearing.',
    personality:
      'Natalie is calm, patient, and terrifyingly perceptive. She speaks in two voices — her own, and the Silence Between Stars, which communicates through implication rather than words. She has been possessed for so long that the boundaries between her identity and the Void entity have blurred. She no longer knows where her thoughts end and the Silence\'s begin.',
    backstory:
      'Natalie was a priestess of the Church of the Holy Light who was excommunicated for studying forbidden Void texts. In Year 412 of the Dimming, she walked into the peat-bogs of the Bryngloom intending to die. Instead, something found her. For three days and nights, the Silence Between Stars spoke through her, dictating the doctrines of what would become the Cult of Forgotten Shadow. She emerged with blank white eyes and knowledge no mortal should possess.',
    hooks: [
      'Natalie hears the voices of every consciousness consumed by the Void — including her dead mother',
      'She believes the Silence is not malevolent, simply hungry, and that it can be negotiated with',
      'The Void-heat engine beneath the Frozen Archive was built from her instructions — she is the only one who knows how to shut it down'
    ]
  },

  'thorn-speaker': {
    id: 'thorn-speaker',
    name: 'The Thorn-Speaker',
    title: 'Voice of the Ironwood',
    race: 'Briaran human',
    gender: 'Female',
    factionIds: ['unshorn-briaran'],
    locationIds: ['ironwood-heart'],
    age: 'Unknown',
    status: 'Active',
    appearance:
      'A tall, weathered woman whose skin bears the scars of countless Thorn-Walks — pale, branching marks that trace her arms, neck, and face like veins of quartz. She wears a cloak of ironwood bark and moss, and her eyes are the deep amber of aged resin. When she speaks, her voice carries the creak of old timber.',
    personality:
      'The Thorn-Speaker has surrendered her birth name to the forest. She speaks for the ironwoods, and the ironwoods speak through her. She is patient, implacable, and utterly without fear of death. She has seen the Fog Compact\'s original text, and she knows exactly how to destroy it.',
    backstory:
      'The current Thorn-Speaker earned her name during a Thorn-Walk that lasted nine days — the longest in Briaran history. When she returned, she could no longer speak human language for a full year. When her voice returned, it was forever changed, carrying the resonance of the forest. She has led the Briaran resistance against the Fog Compact for thirty years.',
    hooks: [
      'She is planning a raid on the Ledger Halls to burn the original Fog Compact text',
      'She knows a secret path through the Briaran tunnels that bypasses the Scribe-Sentinels\' patrols'
    ]
  },

  'the-factotum': {
    id: 'the-factotum',
    name: 'The Factotum',
    title: 'Unknown',
    race: 'Unknown',
    gender: 'Unknown',
    factionIds: ['zhentarim-network'],
    locationIds: ['synod-hold'],
    age: 'Unknown',
    status: 'Active — presumed multiple individuals',
    appearance:
      'No one has seen the Factotum\'s face. Orders arrive in precise, impersonal handwriting on identical grey parchment, delivered by trained ravens. The handwriting is consistent, methodical, and utterly without identifying characteristics. Some believe the Factotum is an AI, a golem, or a council of seven people who each believe they are the sole Factotum.',
    personality:
      'The Factotum\'s orders are cold, efficient, and strategically brilliant. They never threaten — they simply present the logical consequences of non-compliance. They never demand — they offer choices, where one option is clearly advantageous and the others lead to ruin.',
    backstory:
      'The Zhentarim Network has existed for at least three centuries. The Factotum has been its leader for as long as anyone can remember — or at least, the title has. It is widely believed that "the Factotum" is a role passed down, but no one has ever documented a transition. The current Factotum may be the same one who founded the Network, or the identity may have changed hands dozens of times without anyone knowing.',
    hooks: [
      'If the Factotum is a council of seven, each member could be played against the others',
      'The Factotum\'s ravens are trained and could be followed back to their roost — which might reveal the Factotum\'s location'
    ]
  },

  'valeria-the-grim': {
    id: 'valeria-the-grim',
    name: 'Valeria the Grim',
    title: 'Doomsayer-Priestess of the Frozen Archive',
    race: 'Solvarn human',
    gender: 'Female',
    factionIds: ['church-of-the-holy-light'],
    locationIds: ['frozen-archive'],
    age: 'Unknown — at least 200 years',
    status: 'Sealed in meditation',
    appearance:
      'A gaunt woman with skin the color of old parchment and eyes that seem to look through rather than at. She wears the grey robes of a Doomsayer beneath the white vestments of a priest. Her hands are covered in scarified text — calculations she has carved into her own flesh so she would not forget them.',
    personality:
      'Valeria is the last living person who studied under Malakor the Grim, the original Doomsayer. She is blunt, unsentimental, and brutally honest. She does not offer comfort because she believes comfort is a lie. She offers truth, which is cold but reliable.',
    backstory:
      'Valeria was a young Solvarn priestess when Malakor found her. He recognized in her the same cold clarity that had driven him mad. She became his apprentice and, after his death, his successor. She sealed herself in the deepest vault of the Frozen Archive after her calculations began returning contradictory results — she believes she is close to a truth that will either save or doom everything, and she will not emerge until she knows which.',
    hooks: [
      'Valeria\'s calculations, if completed, would reveal the exact timeline of the world\'s extinction — including how much time is left',
      'The contradictory results she obtained suggest someone or something is actively interfering with the Doomsayer\'s equations'
    ]
  },

  'frigga-skalvyr': {
    id: 'frigga-skalvyr',
    name: 'Frigga Skalvyr',
    title: 'Void Negotiator (Secret) / Jarl\'s Daughter (Public)',
    race: 'Skald human',
    gender: 'Female',
    factionIds: ['house-skalvyr', 'cult-of-forgotten-shadow'],
    locationIds: ['frozen-archive', 'over-shanty'],
    age: '24',
    status: 'Active — clandestine',
    appearance:
      'A young woman with her father\'s ice-blue eyes and a sharp, intelligent face. She dresses in practical furs like any Skald hunter, but those who look closely notice the small silver brooch she always wears — a symbol of the Cult of Forgotten Shadow, hidden in plain sight as a geometric pattern.',
    personality:
      'Frigga is idealistic, impatient, and convinced that her father\'s generation is too slow to save Nordhalla. She genuinely believes the Void-heat technology is the only solution, and she is willing to make deals she does not fully understand to secure it.',
    backstory:
      'The Jarl\'s youngest daughter, Frigga grew up watching Nordhalla freeze. She was 12 when the first geothermal sump failed. By 18, she had made contact with the Cult of Forgotten Shadow through a visiting merchant. By 22, she had facilitated the construction of the first Void-heat engine prototype beneath the Frozen Archive.',
    hooks: [
      'Frigga knows more about the Void-heat engine than she has told her father — it is farther along than he realizes',
      'She has begun hearing whispers from the engine, even when she is not near it'
    ]
  },

  'old-maren': {
    id: 'old-maren',
    name: 'Old Maren',
    title: 'Proprietor of the Root & Resin',
    race: 'Thalren human',
    gender: 'Female',
    factionIds: [],
    locationIds: ['greymark-keep'],
    age: '72',
    status: 'Active',
    appearance:
      'A tiny, wizened woman with bright eyes and hands gnarled by decades of resin-handling. She moves with surprising speed and has a habit of appearing silently behind people who are talking about her.',
    personality:
      'Old Maren is a retired Scribe-Sentinel who traded her quill for a mop. She claims she left the Sentinels because "ledgers are boring," but the truth is she saw something in the Master Scribe\'s chamber that made her leave. She will not say what. She runs the Root & Resin tavern and knows every rumor in Greymark.',
    backstory:
      'Maren served as a Scribe-Sentinel for 30 years until one night, working late, she accessed a restricted ledger and saw entries that should not exist: records of births that never happened, deaths that never occurred, families that had been written into existence. She left the next morning and has not entered the Scribes\' Tower since.',
    hooks: [
      'Maren knows which ledgers were edited, and she could identify the false entries',
      'She has a copy of one of the forged pages, hidden behind a loose stone in the tavern\'s hearth'
    ]
  },

  'korrin-the-shade': {
    id: 'korrin-the-shade',
    name: 'Korrin the Shade',
    title: 'Shadow Confessor of the Cult of Forgotten Shadow',
    race: 'Human (Morren)',
    gender: 'Male',
    factionIds: ['cult-of-forgotten-shadow'],
    locationIds: ['over-shanty', 'peat-bog-sinks'],
    age: '39',
    status: 'Active',
    appearance:
      'A lean, nervous man with hollow cheeks and eyes that dart constantly. He wears the dark robes of the Cult and keeps his hands hidden in his sleeves — his fingers are stained permanently black from handling Void-tainted peat.',
    personality:
      'Korrin is genuinely terrified of the Silence Between Stars. He believes it is malevolent, that Natalie is deceived or compromised, and that the Cult is heading toward catastrophe. But he has nowhere else to go — the Church would execute him, and the surface-world offers nothing to a man who has already looked into the Void.',
    backstory:
      'Korrin was a petty thief in Greymark who was caught and offered a choice: execution or service in the Cult\'s memory-extraction chambers. He chose service and discovered he had a talent for entering other people\'s minds. He has extracted hundreds of memories, and each one has left a scar. He now carries the emotional weight of dozens of lives he does not own.',
    hooks: [
      'Korrin knows the location of Natalie\'s hidden sanctum — the only place where the Silence Between Stars speaks directly',
      'He is looking for a way to leave the Cult without being killed, and might help someone who offers an alternative'
    ]
  },

  'loras-ordavan': {
    id: 'loras-ordavan',
    name: 'Loras Ordavan',
    title: 'Steppe-Lord of the Sundrift Vale',
    race: 'Solvarn human',
    gender: 'Male',
    factionIds: ['house-ordavan'],
    locationIds: ['synod-hold'],
    age: '44',
    status: 'Active — figurehead',
    appearance:
      'A handsome man in his middle years, dressed in fine steppe-leathers and silver jewelry. He has a warm smile and an easy manner, but his eyes flick toward his advisors before he answers any question of substance.',
    personality:
      'Loras is well-meaning, charming, and completely unaware that he is a puppet. He believes the Zhentarim are reliable trade partners. He believes his trade ministers are loyal. He believes the ancestral mounds are falling silent for natural reasons. He is wrong about most of these things.',
    backstory:
      'The Ordavan bloodline has ruled the Sundrift Vale for eight centuries, but Loras is the first Steppe-Lord who grew up with the Zhentarim already embedded in every level of governance. To him, their presence is normal. He has never known a time when his decisions were entirely his own.',
    hooks: [
      'If someone could prove to Loras that he is being manipulated, he would be genuinely grateful — and genuinely dangerous to the Zhentarim',
      'His wife, Lady Mira Ordavan, suspects the truth and has begun her own quiet investigation'
    ]
  }
};

const useNpcStore = create((set, get) => ({
  npcs: Object.values(NPC_DATA),

  getNpc: (npcId) => NPC_DATA[npcId] || null,

  getNpcsByFaction: (factionId) =>
    Object.values(NPC_DATA).filter((npc) => npc.factionIds && npc.factionIds.includes(factionId)),

  getNpcsByLocation: (locationId) =>
    Object.values(NPC_DATA).filter((npc) => npc.locationIds && npc.locationIds.includes(locationId)),

  getNpcsByStatus: (status) =>
    Object.values(NPC_DATA).filter((npc) => npc.status && npc.status.toLowerCase().includes(status.toLowerCase())),

  searchNpcs: (query) => {
    const q = query.toLowerCase();
    return Object.values(NPC_DATA).filter(
      (npc) =>
        npc.name.toLowerCase().includes(q) ||
        npc.title.toLowerCase().includes(q) ||
        (npc.backstory && npc.backstory.toLowerCase().includes(q)) ||
        (npc.personality && npc.personality.toLowerCase().includes(q))
    );
  },

  addNpc: (npc) => {
    NPC_DATA[npc.id] = npc;
    set({ npcs: Object.values(NPC_DATA) });
  }
}));

export { NPC_DATA };
export default useNpcStore;
