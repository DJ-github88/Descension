import { create } from 'zustand';

const NPC_DATA = {
  'aldren-thalreth': {
    id: 'aldren-thalreth',
    name: 'Aldren Thalreth',
    title: 'Lord of Greymark',
    race: 'Thalren human',
    gender: 'Male',
    factionIds: ['house-thalreth', 'scribe-sentinels'],
    locationIds: ['greymark-keep'],
    age: 'Unknown — appears to be in his mid-sixties, though the fog may have aged him differently',
    status: 'Active',
    appearance:
      'A tall, gaunt man with sharp Thalren features, carrying a worn leather journal everywhere. His eyes have the distant, unfocused quality of a man who can no longer trust his own memories.',
    personality:
      'Aldren is thoughtful, melancholic, and burdened by knowledge he can no longer verify. The fog has eaten so many of his memories that he cannot recall his own mother\'s face. He speaks rarely, chooses words with surgical precision, and carries his journal everywhere, re-reading entries about his own life that he no longer remembers writing.',
    backstory:
      'Aldren Thalreth is the current Lord of Greymark Keep, the ancestral seat of House Thalreth — named for his celebrated ancestor, High Confessor Aldren Thalreth the Elder, who chose frozen stasis over memory-loss in Nordhalla\'s Frozen Archive in Year 89 of the Dimming. The younger Aldren inherited a house already crumbling under the weight of the Fog Compact — the insulating fog that protects the Frostwood Reach has slowly consumed his family\'s memories for generations. His tragedy is that he has forgotten the location of a critical ledger — the one recording the exact terms of the Compact. Without it, no one knows when the fog\'s price will be paid in full.',
    hooks: [
      'His frozen namesake, High Confessor Aldren Thalreth the Elder, still lies entombed in the Frozen Archive; if the Elder were ever awakened, the knowledge he carries could shatter the Church of the Holy Light',
      'The sealed texts the Elder discovered before his self-entombment are still hidden somewhere in the Frozen Archive — no one has found them since',
      'Some pilgrims report that the Elder\'s frozen lips have moved. The Scribe-Sentinels dismiss this as frost-crack.'
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

  'the-first-liar': {
    id: 'the-first-liar',
    name: 'The First Liar',
    title: 'Unknown',
    race: 'Unlit Astril',
    gender: 'Unknown',
    factionIds: ['unlit-veil'],
    locationIds: ['synod-hold'],
    age: 'Unknown',
    status: 'Active — presumed multiple individuals',
    appearance:
      'No one has seen the First Liar\'s face. Orders arrive as memory-crystal fragments delivered by Unlit couriers who genuinely do not know what message they carry. The instructions are structured in perfect iambic meter — a signature no forger has ever replicated.',
    personality:
      'The First Liar\'s orders are cold, efficient, and strategically brilliant. They never threaten — they simply present the logical consequences of non-compliance. They never demand — they offer choices, where one option is clearly advantageous and the others lead to ruin.',
    backstory:
      'The Unlit Veil has existed for at least three centuries. The First Liar has been its leader for as long as anyone can remember — or at least, the title has. It is widely believed that "the First Liar" is a role passed down, but no one has ever documented a transition. The current First Liar may be the same one who founded the Veil, or the identity may have changed hands dozens of times without anyone knowing. Because Unlit Astril have no light-patterns to betray them, and no star-glow to recognize, any Unlit could be the First Liar — and the Veil cultivates this ambiguity deliberately.',
    hooks: [
      'If the First Liar is a council of seven, each member could be played against the others',
      'The First Liar\'s memory-crystals carry residual star-sap traces that could be tracked back to their source'
    ]
  },

  'valeria-the-grim': {
    id: 'valeria-the-grim',
    name: 'Valeria the Grim',
    title: 'Doomsayer-Priestess of the Frozen Archive',
    race: 'Solvarn human',
    gender: 'Female',
    factionIds: ['house-thalreth'],
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
    title: 'Geothermal Negotiator / Jarl\'s Daughter',
    race: 'Skald human',
    gender: 'Female',
    factionIds: ['house-skalvyr'],
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
    title: 'Shadow Confessor of the Over-Shanty',
    race: 'Human (Morren)',
    gender: 'Male',
    factionIds: [],
    locationIds: ['over-shanty'],
    age: '39',
    status: 'Active',
    appearance:
      'A lean, nervous man with hollow cheeks and eyes that dart constantly. He wears dark robes and keeps his hands hidden in his sleeves — his fingers are stained permanently black from handling peat-bog ink.',
    personality:
      'Korrin is genuinely terrified of the deep bog. He believes something ancient and hungry watches from beneath the peat, and that the Bryngloom is not done with its bargains. But he has nowhere else to go — the Neth control the only safe roads, and the surface-world offers nothing to a man who has already seen what lives in the deep water.',
    backstory:
      'Korrin was a petty thief in Greymark who fled into the Bryngloom after stealing from House Thalreth. He found work in the Over-Shanty as a memory-extraction specialist — a man who can enter other people\'s minds through bog-fumes and incense. He has extracted hundreds of memories, and each one has left a scar.',
    hooks: [
      'Korrin knows a hidden path through the Severing Bog that bypasses Neth patrols',
      'He is looking for a way to leave the Over-Shanty without being killed, and might help someone who offers an alternative'
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
      'Loras is well-meaning, charming, and completely unaware that he is a puppet. He believes the Unlit Veil are reliable trade partners. He believes his trade ministers are loyal. He believes the ancestral mounds are falling silent for natural reasons. He is wrong about most of these things.',
    backstory:
      'The Ordavan bloodline has ruled the Sundrift Vale for eight centuries, but Loras is the first Steppe-Lord who grew up with the Unlit Veil already embedded in every level of governance. To him, their presence is normal. He has never known a time when his decisions were entirely his own.',
    hooks: [
      'If someone could prove to Loras that he is being manipulated, he would be genuinely grateful — and genuinely dangerous to the Unlit Veil',
      'His wife, Lady Mira Ordavan, suspects the truth and has begun her own quiet investigation'
    ]
  },

  // ============================================================
  // CLASS ORDER LEADERS — anchors the Phase B livingOrder blocks
  // to living, named NPCs the GM can portray at the order seat.
  // ============================================================

  'hark-ash-hammer': {
    id: 'hark-ash-hammer',
    name: 'Hark Ash-Hammer',
    title: 'Keeper of the First Forge (Blood-Priest of the Bloodhammer Line)',
    race: 'Skald human',
    gender: 'Male',
    factionIds: ['bloodhammer-line'],
    locationIds: ['harath-vault', 'emberspire'],
    age: '67',
    status: 'Active',
    appearance: 'A massive, scarred Skald elder whose every exhale steams in all but forge-heat. He carries a blacksmith\'s hammer too heavy for any living Berserker to lift, and his forearms are latticed with old burn-scars that flush dull red when his Blood-Heat rises in his sleep.',
    personality: 'Silent for years at a stretch, then devastatingly direct. Hark has maintained the Forge of Grum for forty years without speaking and considers words a waste of heat. He signed the Unbound execution order and has not slept soundly since.',
    backstory: 'Hark leads the Bloodhammer Line from the Harath-Vault arenas, keeper of the Forge of Grum where the first Blood-Heat ignited. He countersigned the Skald Council\'s order to execute the Unbound and now hunts the deep-tunnel settlement of Pact-less Berserkers. Privately, he suspects the Unbound are right — that the Hunger Pact was a leash, not a source — and the hammer grows heavier each year.',
    hooks: [
      'Hark knows the Unbound settlement\'s location but has not yet struck; a party could be hired by either side of the schism',
      'He alone can lift Grum\'s hammer; if he dies or defects, the line\'s claim to legitimacy dies with him',
      'A Thrask Emberth Berserker in Hark\'s confidence is feeding the Unbound forge-fragments — Hark suspects but will not investigate'
    ]
  },

  'sera-three-scars': {
    id: 'sera-three-scars',
    name: 'Sera Three-Scars',
    title: 'Voice of the Ancestral Convergence',
    race: 'Morren human',
    gender: 'Female',
    factionIds: ['ancestral-convergence'],
    locationIds: ['frozen-archive'],
    age: '49',
    status: 'Active — failing',
    appearance: 'A gaunt Morren woman who bears the marks of all three Animist traditions: throat-tattoos from the Ordan overtones, faint bioluminescent tracery on her wrists from inhaled Vreken spores, and a single carved rune on her collarbone that never fully heals. Her eyes flicker between three distant focuses.',
    personality: 'Patient, exhausted, and quietly desperate. Sera is the only living Animist who can still hold all three ancestral dialects at once, and the effort is killing her. She translates between traditions that no longer fully understand each other and grieves that she has found no successor.',
    backstory: 'Sera leads the Ancestral Convergence, the tri-regional council that fuses the Ordan totemic, Vreken spore, and Skald runic traditions into one Animist art. As the ancestral language fractures, her bridging-mind is the only thing holding the tradition together. Every young Animist who attempts all three simultaneously suffers sensory collapse — there is no heir.',
    hooks: [
      'Sera seeks a party to escort a promising young Animist to each of the three regional seats before the Convergence dissolves',
      'Her rune-scar has begun migrating toward her throat, which the Skald Rune-Keeper read as a death-omen',
      'She suspects the dialect-fracture is being engineered — by the Frozen Archive Chronarchs, or something older'
    ]
  },

  'vel-otharen': {
    id: 'vel-otharen',
    name: 'Vel-Otharen',
    title: 'Senior Signatory of the Canopy-Ledger',
    race: 'Velun Neth',
    gender: 'Unspecified (Neth do not emphasize gender)',
    factionIds: ['canopy-ledger', 'house-morrath'],
    locationIds: ['atropolis'],
    age: '412',
    status: 'Active',
    appearance: 'The eldest active Arcanoneer — more Mnemonic Shard than flesh, his silver skin translucent where the crystallized blood-clauses show through. His pig-iron forearm graft is original, fused eight generations of refinement ago. He has not spoken an unplanned word in thirty years.',
    personality: 'Precise, patient, and privately terrified. Vel-Otharen chairs the arbitration that cannot resolve the Velun Contingency Protocol and believes, but cannot prove, that the contract-breach originates inside the Heart-Vault itself.',
    backstory: 'Ledger-Prime of the Canopy-Ledger, Vel-Otharan presides over the Arcanoneer order from Atropolis\'s Heart-Vault. His own filed Mnemonic Shards are degrading — clauses the Keeper once accepted now rejected — and he suspects the breach is internal. He believes arbitration can still resolve the Protocol dispute; he is almost certainly wrong.',
    hooks: [
      'Vel-Otharen can grant a party access to the Heart-Vault\'s deepest contracts — for a filed consideration they must honor',
      'A faction of junior Arcanoneers believe Vel-Otharen himself is the breach and want him deposed',
      'His degrading shards, if analyzed, would reveal what the Keeper is currently rejecting — and why'
    ]
  },

  'skadi-glass-eye': {
    id: 'skadi-glass-eye',
    name: 'Skadi Glass-Eye',
    title: 'Keeper of the Elk-Rites (Archive-Mistress of the Frozen Order of the Elk)',
    race: 'Skald human',
    gender: 'Female',
    factionIds: ['frozen-order-of-the-elk', 'house-skalvyr'],
    locationIds: ['frozen-archive'],
    age: '54',
    status: 'Active',
    appearance: 'A tall, frost-scarred Skald woman with one eye clouded to milky glass by a childhood vision-burn. She wears the grey robes of the Augur order over chainmail and carries a carved elk-horn staff she uses as much for walking the glacier-halls as for ritual.',
    personality: 'Steady, unsentimental, and privately frantic. Skadi has presided over the accuracy collapse from 93% to 41% without flinching — at least where the junior augurs can see. She believes the elk are still true and something is editing the future they can see.',
    backstory: 'Cassia\'s great-great-granddaughter, Skadi learned the augury from a woman preserved in the glacier-ice who no longer remembers being her great-great-grandmother. She maintains the elk-herds and the ritual calendar at the Frozen Archive, defending her founder\'s method against contradictory readings. Privately she has begun a secret cross-reference suggesting the interference is temporal — the Chronarchs\' stitching.',
    hooks: [
      'Skadi will pay handsomely for any Chronarch temporal-log that overlaps a failed elk-reading',
      'She has not told the Archive council that the founder Cassia\'s preserved lips have begun moving again',
      'A rival augur faction claims Skadi is falsifying the 41% figure to protect the order\'s funding'
    ]
  },

  'fex-vestara': {
    id: 'fex-vestara',
    name: 'Fex-Vestara',
    title: 'Keeper of the Reconstruction Schematics (Conclave-Prime of the Frostmaw Conclave)',
    race: 'Kethrin Fexrick',
    gender: 'Female',
    factionIds: ['frostmaw-conclave'],
    locationIds: ['frostmaw-holdfast'],
    age: '88',
    status: 'Active — racing the clock',
    appearance: 'A compact, oil-stained Kethrin engineer whose chest is partly open, the rebuilt time-dilation engine visible behind a glass plate — her own prototype. Her gear-tattoos chart the reconstruction in real-time, new ones appearing as each subsystem completes.',
    personality: 'Driven, methodical, and grieving in advance. Fex-Vestara refuses to accept that Nesta\'s disappearance is unpreventable and considers the reconstruction either genius or the product of grief — she is no longer sure which.',
    backstory: 'Conclave-Prime of the Frostmaw Conclave, Fex-Vestara has spent six years rebuilding Nesta\'s original Chronarch engine from recorded schematics, arguing that if the machine persists, its inventor will too. She is three weeks from completion; Nesta is estimated at four weeks from final collapse.',
    hooks: [
      'Fex-Vestara needs a rare volcanic-glass component only recoverable from a Deep Alchemist sealed lab',
      'The Kethrin guilds consider her project heresy — a team has been sent to halt her',
      'If she succeeds and Nesta persists inside the new engine, Nesta may not be grateful'
    ]
  },

  'mor-vereth': {
    id: 'mor-vereth',
    name: 'Mor-Vereth',
    title: 'Weaver of the Congregation of the Silence',
    race: 'Morren human',
    gender: 'Female',
    factionIds: ['congregation-of-the-silence'],
    locationIds: ['starfall-vale'],
    age: '41',
    status: 'Active — terrified',
    appearance: 'A cold, organized Morren woman whose debt-brand on her forearm is partially obscured by a newer mark — a silence-glyph that pulses faintly in time with Li Wei\'s breathing. Her eyes are constantly tracking something no one else can see.',
    personality: 'Methodical, genuinely uncertain, and in over her head. Mor-Vereth built the cell-network around Li Wei\'s broken prophecies and does not know whether she is leading a liberation movement or steering millions toward something she cannot see.',
    backstory: 'Cell-Mother of the Congregation of the Silence, Mor-Vereth receives the Voice\'s new, specific instructions — descend to the Frozen Archive\'s lowest vault, open the way — and is terrified because they are no longer suggestions. Li Wei\'s heart now beats in the rhythm of the commands. She keeps the founder alive because the Voice will not speak through any other throat.',
    hooks: [
      'Mor-Vereth will covertly aid any party investigating the Voice — she wants out but cannot stop the rhythm',
      'She alone knows the location of the "lowest vault" the Voice is directing the Congregation toward',
      'A Synod kill-team has her name; she will trade information for extraction'
    ]
  },

  'merr-cael': {
    id: 'merr-cael',
    name: 'Merr-Cael',
    title: 'Keeper of the Middle Odds (Harbor-Master of the Merrowport House)',
    race: 'Merryn human',
    gender: 'Male',
    factionIds: ['merrowport-house'],
    locationIds: ['merrowport'],
    age: '58',
    status: 'Active — losing',
    appearance: 'A weathered Merryn broker with salt-bleached hair and a coat weighed down by a hundred voyage-share tokens strung along its hem. His fingers are permanently ink-stained from the contracts he drafts and the odds he scratches on slate.',
    personality: 'Tired, principled, and increasingly isolated. Merr-Cael believes in the wager as a discipline, not a religion, and is the only thing standing between the House and a civil war between the followers of its two vanished founders.',
    backstory: 'Harbor-Master of the Merrowport House, Merr-Cael has spent thirty years keeping the Gambit order solvent while Jax walked into the sea and Lyra radicalized. The House is splitting along its founding fault-line — luck versus clause — and his middle ground is shrinking. He has one play left: find out what Jax actually won, before the Deck-Burners do.',
    hooks: [
      'Merr-Cael hires the party to retrace Jax\'s final walk and recover the loaded die',
      'He holds the only copy of the Last Table\'s founding-wager — a clause that could dissolve the Deck-Burners legally',
      'Lyra has put a price on his head; he knows and continues to work anyway'
    ]
  },

  'malakor': {
    id: 'malakor',
    name: 'Malakor the Finite',
    title: 'Choir-Prime of the Doom-Arithmetic',
    race: 'Skald human',
    gender: 'Male',
    factionIds: ['doom-choir', 'house-skalvyr'],
    locationIds: ['frozen-archive'],
    age: '471',
    status: 'Active',
    appearance: 'A spare, ancient Skald archivist whose skin has the desiccated stillness of someone who stopped expecting surprise centuries ago. His eyes are the flat grey of a glacier\'s underside. He writes equations in frost on the table when he thinks no one is looking.',
    personality: 'Calm, precise, and absolutely without hope — not despair, which would be an error in the math, but the serene certainty that the equation has only one solution. He considers hope a rounding error.',
    backstory: 'Catastrophe-Reader Malakor did the cold work Xyris could not: he calculated exactly when her reality-tears would consume everything, and the calculation gave him a purpose. He leads the Doom-Choir from the Frozen Archive and has predicted the permanent Chaos Pockets now stabilizing across the Sundrift Vale. What he has not shared: each pocket bleeds warmth from the buried star, accelerating the end his equation predicted.',
    hooks: [
      'Malakor will share the exact date of the world\'s end for a price — usually a piece of information that worsens the equation',
      'A faction of the Choir agrees with him that a faster end is a more accurate end; they are actively widening the Pockets',
      'He alone can read Xyris\'s original notes, which are written in a reality-torn script that damages the reader'
    ]
  },

  'vrael-forty-seventh': {
    id: 'vrael-forty-seventh',
    name: 'Vrael the Forty-Seventh',
    title: 'Last Commander of the Barbed Vow',
    race: 'Thalren human',
    gender: 'Female',
    factionIds: ['barbed-vow'],
    locationIds: ['sunken-spire'],
    age: '52',
    status: 'Active — half-erased',
    appearance: 'A lean, scar-wrapped Thalren woman whose Bait-Vow scars glow faintly with the broken promises she has sworn to lure the Wyrd. She is translucent at the edges — the Sovereign Ledger is half-done striking her name, and she is visibly becoming a ghost in her own lifetime.',
    personality: 'Weary, iron-willed, and morally compromised. Vrael leads because she was the forty-seventh remaining Inquisitor and the most senior willing. She has stopped recruiting because the oath now kills more initiates than it survives.',
    backstory: 'Last Commander of the Barbed Vow, Vrael commands forty-six remaining Inquisitors against a tripled incursion rate. The new deep-grove entities have no contracts to sever and no faces to bait, falling outside her entire art. In desperation she has begun training recruits in forbidden binding techniques — borrowing from the traditions the Inquisitors were founded to destroy.',
    hooks: [
      'Vrael will commission any party to investigate the unnamed deep-grove entities — she has no tools left for them',
      'She carries a forbidden bound-fiend she has not yet told the order about; it is bargaining for its release',
      'Her ongoing legal erasure means she cannot enter Greymark Keep without being arrested — a jurisdictional trap'
    ]
  },

  'bri-vessela': {
    id: 'bri-vessela',
    name: 'Bri-Vessela',
    title: 'Keeper of the Phases (Regent of the Lunar Communion)',
    race: 'Unshorn Briaran',
    gender: 'Female',
    factionIds: ['lunar-communion', 'briaran-groves'],
    locationIds: ['frostwood-reach'],
    age: '63',
    status: 'Active — acting',
    appearance: 'A senior Unshorn Briaran whose thorn-clusters run thick across her forearms and shoulders, prickling upright when Selene\'s whispers reach her. She wears the ghost-metal regent\'s token openly and carries a transcription-journal at all times, ink still wet from the latest dead-language entry.',
    personality: 'Reluctant, theological, and increasingly frightened. Bri-Vessela is a scholar forced into power by Selene\'s silence. She spends her nights transcribing whispers she does not understand and her days pretending she does.',
    backstory: 'Regent of the Lunar Communion in Selene\'s silence, Bri-Vessela leads only because the alternative was civil war between the caste-factions. The elder parasites are synchronizing every Lunarch\'s phases toward an unknown convergence, and Selene\'s whispers are, she has begun to suspect, not madness but instructions — the hatching-song of the dead moon.',
    hooks: [
      'Bri-Vessela desperately needs a translator for the dead-language whispers; she will fund any expedition to find one',
      'She can be convinced to either halt the convergence or accelerate it — depending on what the party learns',
      'A Smooth-Skinned faction is secretly welcoming the hatching; Bri-Vessela does not know who'
    ]
  },

  'sol-kaessen': {
    id: 'sol-kaessen',
    name: 'Sol-Kaessen',
    title: 'Keeper of the First Scar (Vigil-Mother of the Covenant of the Scar)',
    race: 'Solvarn human',
    gender: 'Female',
    factionIds: ['covenant-of-the-scar', 'dawn-vigil'],
    locationIds: ['emberspire'],
    age: '47',
    status: 'Active',
    appearance: 'A Solvarn woman who has absorbed so much allied suffering that she glows faintly in the dark — the Devotion Gauge made visible. Her forearms bear the original scar-pattern of the Covenant, and a fainter, newer set of marks she refuses to explain.',
    personality: 'Gentle, fierce, and torn in half. Sol-Kaessen genuinely believes in the willing sacrifice and has presided over the houses\' conscription program without intervening, because the conscripted Martyrs keep Sundale\'s people alive. She has not decided whether she is a saint or a collaborator.',
    backstory: 'Vigil-Mother of the Covenant of the Scar, Sol-Kaessen tends Sera Solvan\'s original scarred forearm beneath Emberspire. She is crushed between the Covenant\'s founding principle (willing sacrifice) and the houses\' practice (conscripted child-training). The conscripted Martyrs heal less cleanly and have begun absorbing without consent — the Devotion Gauge corrupting into something predatory.',
    hooks: [
      'Sol-Kaessen will shelter any party fleeing the Dawn Vigil\'s conscription — and ask them to prove the corruption',
      'She is one quiet order away from open schism with Sundale\'s theocracy',
      'A conscripted Martyr she trained has gone fully predatory and is hunting the party\'s allies; Sol-Kaessen will help stop them'
    ]
  },

  'mer-lyrisa': {
    id: 'mer-lyrisa',
    name: 'Mer-Lyrisa',
    title: 'Keeper of the Silent Frequency (Tide-Choir Mistress)',
    race: 'Merryn human',
    gender: 'Female',
    factionIds: ['tide-choir'],
    locationIds: ['merrowport'],
    age: '36',
    status: 'Active — hoarse',
    appearance: 'A hoarse, sleepless Merryn woman named for the vanished founder she never met. Her throat bears the old scar of the storm-voice trade, and she carries the recovered lute with the god-shattering note carved into its soundboard.',
    personality: 'Obsessed, grieving, and increasingly reckless. Mer-Lyrisa leads a Choir that has lost its instrument and suspects the silence is not absence but a held breath. She is considering playing the note.',
    backstory: 'Tide-Choir Mistress, Mer-Lyrisa holds a collapsing order together while the Iceheart Sea stays silent and the silence spreads up the rivers. Her only lead is the recovered lute and its carving about shattering gods. She has forbidden deep-water performances and grounded the Deep-Born who fled the abyss — but she knows the silence is advancing.',
    hooks: [
      'Mer-Lyrisa hires the party to investigate what the Deep-Born heard singing back in the abyss',
      'She will trade passage and Choir protection for help decoding the lute-carving',
      'If the party cannot stop the silence, she intends to play the note herself — and wants witnesses'
    ]
  },

  'vespera': {
    id: 'vespera',
    name: 'Vespera',
    title: 'The First Host (Blight-Mother of the Cultivar)',
    race: 'Clean Vreken',
    gender: 'Female',
    factionIds: ['cultivar'],
    locationIds: ['bryngloom-forest'],
    age: '800+',
    status: 'Active — bedridden, dying with her strain',
    appearance: 'Waxy, pale, and cold — a Vreken alchemist who bonded with bog-rot eight centuries ago. Her bioluminescence is dim and irregular, flickering where the dying foundational strain no longer sustains her skin. She is calm about her own death in a way her students find unbearable.',
    personality: 'Serene, clinical, and terminally patient. Vespera has been dying for eight centuries; this is just the final stretch. She is more concerned with the succession-strain project than her own survival.',
    backstory: 'Blight-Mother and First Host of the Cultivar, Vespera founded the Plaguebringer tradition by injecting Sunken Spire decay-moss into her own veins to cure the spore-hush. Her foundational bacterial strain is now dying, and every Plaguebringer trained from her blood is carrying a failing inheritance. She has tasked her cultivators with engineering a successor strain that does not require her blood as substrate.',
    hooks: [
      'Vespera will fund any expedition to recover a viable deep-bog strain uncontorrupted by the Root-Veil\'s rejection',
      'She suspects the Root-Veil is deliberately killing her strain — and can explain why the forest would wage biological war',
      'A radical faction of her cultivators wants to let the strain die and the tradition end; Vespera disagrees'
    ]
  },

  'sol-vareths': {
    id: 'sol-vareths',
    name: 'Sol-Vareths',
    title: 'The Most-Converted (Last-Ember of the Ashen Communion)',
    race: 'Solvarn human',
    gender: 'Male',
    factionIds: ['ashen-communion'],
    locationIds: ['emberspire'],
    age: '34 (effective; the conversion has aged him further)',
    status: 'Active — on a known countdown',
    appearance: 'More char-vessel than flesh — bones visible through translucent magma-skin, heat radiating from him in visible waves. He marks the estimated day of his final collection on a calendar of scar-tissue renewed each morning.',
    personality: 'Serene, terrifying, and entirely resigned. Sol-Vareths leads only by virtue of having survived the longest, and he leads nothing so much as the countdown. He considers the Apostate\'s Path mercy.',
    backstory: 'Last-Ember of the Ashen Communion, Sol-Vareths is the eldest living Pyrofiend — more basalt than flesh. He leads precisely when Scathrach has called in all debts simultaneously. He has organized the younger Pyrofiends into the Apostate\'s Path, accelerating their own conversion to fight harder before the end, which he considers mercy and the Thrask consider a death sentence.',
    hooks: [
      'Sol-Vareths knows the precise terms of every Pyrofiend\'s pact with Scathrach and can negotiate extensions — for a price',
      'He is searching for a way to die before Scathrach can claim him whole; he would trade all his knowledge for it',
      'A Solvarn Pyrofiend in his care has discovered a way to sever the pact — Sol-Vareths is hiding her from Scathrach'
    ]
  },

  'kor-vasseth': {
    id: 'kor-vasseth',
    name: 'Kor-Vasseth',
    title: 'Warden of the Waking Graves (Threshold-Keeper of the Twice-Born)',
    race: 'Mixed Vreken-Neth descent',
    gender: 'Male',
    factionIds: ['twice-born'],
    locationIds: ['bryngloom-forest'],
    age: '431',
    status: 'Active — frightened for the first time in four centuries',
    appearance: 'An ancient Revenant of mixed Vreken-Neth descent, calm and whisper-layered with ancestral overtones. His skin is frost-stasis pale, his eyes the bioluminescent amber of Vreken dead-sight. One hand is silver-Neth, the other amber-Vreken — both traditions visible in his body.',
    personality: 'Calm, ancient, and newly afraid. Kor-Vasseth has led the Twice-Born through three previous bog-grave awakenings. The fourth is different, and the difference has him frightened for the first time in four centuries.',
    backstory: 'Threshold-Keeper of the Twice-Born, Kor-Vasseth carries both founders\' arts — Kora\'s Death Toll and Vesper\'s Phylactery. He is investigating the twelve Revenants found drained and the dead marching toward the Sundered Monoliths. The call routes through the Root-Veil, and he cannot stop the march without severing the Root-Veil itself — which would kill every Marked Revenant, half his order.',
    hooks: [
      'Kor-Vasseth hires the party to escort a Drun Neth Revenant (immune to the routing) to the nearest Monolith to observe what calls the dead',
      'He alone knows which of the Twelve Drained Revenants left a final message — and it names the caller',
      'Severing the Root-Veil is on his table; he wants the party\'s counsel before he decides'
    ]
  },

  'veyra': {
    id: 'veyra',
    name: 'Veyra the Merged',
    title: 'Keeper of the Six Forms (Form-Matriarch of the Form-Convergence)',
    race: 'Mimir',
    gender: 'Female',
    factionIds: ['form-convergence'],
    locationIds: ['frostmaw-holdfast'],
    age: '600+',
    status: 'Active',
    appearance: 'Ancient, patient, and more stone than flesh — Veyra\'s semi-crystalline Mimir skin is heavily calcified, a living record of every transformation she has held. Her mask is integrated into her form, edges blurred by centuries of shaping.',
    personality: 'Patient, exacting, and losing an argument. Veyra insists no student attempt convergence until mastering each form alone. The young convergers consider this archaic; she considers their burnout rate the proof she is right.',
    backstory: 'Form-Matriarch of the Form-Convergence, Veyra merged Sylvanus\'s kinetic momentum dance with Torin\'s biological adaptation art into the six Shaping Forms. She is the only Shaper to hold the merged art without burning out, because she invented it slowly over centuries. She is being forced to teach the dangerous convergence she spent centuries proving premature, because the world will not wait for slow.',
    hooks: [
      'Veyra will train any qualifying Shaper in a single safe form — but refuses convergence training without proof of mastery',
      'She alone remembers the pre-merge Bladedancer and Formbender traditions intact; her archive is the only complete record',
      'A purist faction is stealing her records to "restore" the single traditions; she wants them recovered'
    ]
  },

  'thrak-damos': {
    id: 'thrak-damos',
    name: 'Thrak-Damos',
    title: 'Warden of the Void-Scars (Bulwark-Captain of the Aegis)',
    race: 'Thrask Emberth',
    gender: 'Male',
    factionIds: ['aegis'],
    locationIds: ['emberspire'],
    age: '51',
    status: 'Active',
    appearance: 'A Thrask Emberth veteran whose forearms are latticed with absorbed-magic scars that glow blue through his sleeves. His basalt-dark skin is cracked with the radiation-stress of decades of Spellguard service, and he cannot enter a dark room unnoticed.',
    personality: 'A pragmatist drill-sergeant watching his engineering discipline fail against a threat it was never built for. Thrak-Damos is precise, blunt, and deeply frustrated.',
    backstory: 'Bulwark-Captain of the Aegis, Thrak-Damos leads from the Emberspire forge-keeps and enforces Damon\'s method with drill-sergeant discipline. The rising ambient magic has no structure to dismantle and no vector to redirect; he has begun ordering Spellguards to absorb — Damon\'s forbidden technique — because there is nothing left to dismantle.',
    hooks: [
      'Thrak-Damos hires the party to map Arcane Saturation hot-spots before they burst',
      'He can teach a Spellguard the forbidden absorption technique — but only to those who understand Damon\'s original rule',
      'A glowing Spellguard under his command has gone rogue, detonating stored radiation in populated areas'
    ]
  },

  'varis': {
    id: 'varis',
    name: 'Varis the Trembling',
    title: 'Keeper of the Slow Cup (Venom-Master of the Distillery)',
    race: 'Thalren human',
    gender: 'Male',
    factionIds: ['distillery'],
    locationIds: ['frostwood-reach'],
    age: '800+ (prolonged by careful self-dosing)',
    status: 'Active',
    appearance: 'Old, trembling, and still working — a Thalren alchemist whose chronic tremors make every pour dangerous. His fingers are permanently stained and two apprentices flank each dose. He carries Grum-weight nothing; his burden is a satchel of degrading vials.',
    personality: 'Stubborn, brilliant, and furious at the fog. Varis considers the changing fog a personal insult — the resentment of a master watching his medium rewrite itself without his consent.',
    backstory: 'Venom-Master and founder of the Distillery, Varis extracted fog-predator venom for eight centuries and now presides over the spoilage of his life\'s work. His desperation project — distilling the changing fog itself — has killed two apprentices and produced uncharacterizable reagents. He refuses to stop.',
    hooks: [
      'Varis will pay for live fog-predator specimens from the deep Reach — the shallow ones no longer yield stable venom',
      'He can identify any poison or reagent in the Frostwood on sight, including the new fog-distillates no one understands',
      'His juniors are quietly trying to have him declared incompetent so they can shut down the fog-distillation project'
    ]
  },

  'alaric': {
    id: 'alaric',
    name: 'Alaric the Law-Keeper',
    title: 'The First Bound (Chain-Lord of the Bound)',
    race: 'Groven',
    gender: 'Male',
    factionIds: ['the-bound', 'vat-breakers-guild'],
    locationIds: ['frostmaw-holdfast'],
    age: '800+ (sustained by Thrumm-derived regeneration)',
    status: 'Active',
    appearance: 'Ancient, immovable, and more iron than flesh — the original ore-hauling chain rusted into his forearm eight centuries ago is now so integrated that removing it would kill him. His Groven stone-hide is threaded with the oxidation of generations.',
    personality: 'Grieved, principled, and immovable. Alaric refuses chardalyn absolutely — even as brittle-iron casualties mount — because the chain exists to ensure nothing is contained the way the Groven were, and the makers\' metal betrays the principle.',
    backstory: 'Chain-Lord and founder of the Bound, Alaric invented the chain-graft tradition when he drove an ore-hauling chain through his own forearm to hold a Deep Alchemist specimen for three days. He still leads from the Chain-Hold at Frostmaw. The Bound are fracturing along the chardalyn fault-line, and Alaric\'s principled refusal may be the order\'s epitaph.',
    hooks: [
      'Alaric will personally train any qualifying Warden in the graft-rite — but refuses chardalyn-bearers absolutely',
      'He knows the location of every Deep Alchemist sealed lab and will trade the knowledge for protection of the iron-chain tradition',
      'A chardalyn-mad Warden Alaric trained has escaped the Chain-Hold; Alaric wants them found before the madness spreads'
    ]
  },

  'sylas': {
    id: 'sylas',
    name: 'Sylas',
    title: 'The First Hunter (Silent-Master of the Silent Hunt)',
    race: 'Mimir',
    gender: 'Male',
    factionIds: ['silent-hunt'],
    locationIds: ['frostwood-reach'],
    age: 'Unknown',
    status: 'Active — deaf',
    appearance: 'Deaf, lethal, and patient beyond any living tracker. Sylas communicates through a tactile sign-language; a pair of Apexes can hold a silent conversation through hand-pressure alone. His Mimir mask is scored with forty years of Wyrd-trail marks.',
    personality: 'Predatory, still, and realizing he has become the hunted. Sylas has tracked the same conceptual Wyrd-entity on and off for forty years; lately it has begun circling him.',
    backstory: 'Silent-Master and founder of the Silent Hunt, Sylas tuned his senses to silent vibrations and paid with his hearing to achieve absolute focus. The mist is now learning to hide — not randomly but deliberately — and Sylas has concluded something large has moved through the Reach for months without trace. He is preparing to dissolve into the fog himself, knowing he may not return.',
    hooks: [
      'Sylas will hire the party to retrieve Unwoven trackers who dissolved into the fog to find the hider and did not return',
      'He can teach the tactile sign-language and the sensory-sacrifice initiation to any qualifying Apex',
      'He believes the hider is the thing the mist is protecting — and that it has noticed him'
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
