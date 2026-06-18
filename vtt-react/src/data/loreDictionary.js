/**
 * Lore Dictionary Database
 *
 * Houses TTRPG-styled dictionary entries for regions, noble houses, historical figures,
 * classes, races, resources, events, and creatures. 
 * Written in the sweeping, solemn Mythrill voice.
 */

export const LORE_DICTIONARY = {
  // REGIONS
  'frostwood-reach': {
    id: 'frostwood-reach',
    term: 'Frostwood Reach',
    type: 'region',
    region: 'frostwood-reach',
    summary: 'A dense, fog-choked ironwood forest in the western hemisphere where volcanic heat from the south collides with the northern freeze.',
    fullEntry: 'The Frostwood Reach represents the desperate compromise between the warmth of the deep earth and the encroaching silence of the Freeze-Front. Ancient, towering ironwood forests stretch beneath a perpetual canopy of mist, their petrified trunks hardened by centuries of cold until the wood mimics tempered iron. To prevent the forests and their native beasts from freezing into glass, House Thalreth traded spatial clarity for an insulating, protective fog. Scribe-sentinels patrol the timber keeps, quills constantly scratching out lineages and maps before the fog slowly eats what they remember of themselves.',
    relatedTerms: ['house_thalreth', 'greymark_keep', 'mimir', 'briaran', 'gref', 'gambrel', 'wraithfen', 'mistbarrow', 'mirror_mere', 'greythorn_copse', 'bramble_heath']
  },
  'nordhalla': {
    id: 'nordhalla',
    term: 'Nordhalla',
    type: 'region',
    region: 'nordhalla',
    summary: 'A brutalist cathedral of frozen black fjords and towering glaciers in the northern reaches, warmed only by deep geothermal sumps.',
    fullEntry: 'Nordhalla is a freezing wilderness where the advance of titanic, mountain-crushing glaciers was halted mid-stride by the desperate bargain of House Skalvyr. The tundra is a flat black mirror beneath a washed-out sky that has not seen true sunlight in eight centuries. Wind-carved ice sculptures stand as monuments to the ancient dead, and keeps are dug into geothermal volcanic vents. Survival here is an endurance-purist\'s trial, where bloodlines are fiercely guarded and the heat determines a family\'s status.',
    relatedTerms: ['house_skalvyr', 'frozen_archive', 'rime_born', 'bloodhammer', 'stel', 'skreika', 'ymirs_col', 'vargtor', 'the_black_firth', 'rooks_promontory', 'frostcirque']
  },
  'sundale': {
    id: 'sundale',
    term: 'Sundale',
    type: 'region',
    region: 'sundale',
    summary: 'The scorched ashlands surrounding Emberspire, where the dying sun-god Sol was bound beneath the earth.',
    fullEntry: 'Sundale is the volcanic womb of the world, a desert of basalt, obsidian rivers, and perpetual ashfall. It is here that Sol was bound beneath the volcanic crust by the seven noble families to protect the star from the cosmic hunter Keth-Amar. Warmed by the world-heart volcano Emberspire, the region is thick with geothermal activity and soot-filled air. It is shared by the forge-clans of the Emberth, who tend the Solbrand, and the remnants of Solvarn humans who refuse to abandon the tomb of their star.',
    relatedTerms: ['house_solvan', 'emberspire', 'harath_vault', 'emberth', 'solbrand', 'cinder', 'sols_anvil_mesa', 'the_ashen_escarpment', 'ember_lagoon', 'cinderhoodoo']
  },
  'iceheart-sea': {
    id: 'iceheart-sea',
    term: 'Iceheart Sea',
    type: 'region',
    region: 'iceheart-sea',
    summary: 'A violent, freezing ocean of city-sized icebergs and perpetual gales, navigated only by the grace of unfreezing currents.',
    fullEntry: 'The Iceheart Sea is a churning, frozen expanse where storm-cycles are perpetual and icebergs drift like slow-moving mountains. House Mereval traded calm waters for navigable sea-lanes that never freeze, ensuring trade routes remain open at the cost of the ocean never sleeping. Ships pitch and roll through freezing foam, and sailors navigate by bioluminescent light and the advice of the Merryn captains who tattoo their charts directly onto their skin.',
    relatedTerms: ['house_mereval', 'merrowport', 'ironjaw_port', 'myrathil', 'drowned_spume', 'spindrift_lagoon', 'deepwell_archipelago', 'wraithsound', 'kelpies_cove']
  },
  'cragjaw-peaks': {
    id: 'cragjaw-peaks',
    term: 'Cragjaw Peaks',
    type: 'region',
    region: 'cragjaw-peaks',
    summary: 'A vertical wilderness of howling blizzards and razor ridges, bridged together by the calcified spans of the Groven.',
    fullEntry: 'The Cragjaw Peaks are a vertical labyrinth of rock and ice where visibility was traded for a perpetual blizzard to hide the keeps of House Tesshan from the starving lowlanders. Centuries of drift have buried all natural landmarks, leaving the high mountain holds isolated. The only thoroughfares above the whiteout are the Ancestor-Spans — bridges grown from the bones of the Groven\'s willing dead, spanning bottomless ravines.',
    relatedTerms: ['house_tesshan', 'frostmaw_holdfast', 'groven', 'fexrick', 'thrumm', 'scrab', 'the_great_gorge', 'gearworks_gulch', 'deepchasm_keep', 'frostmaw_massif']
  },
  'sundrift-vale': {
    id: 'sundrift-vale',
    term: 'Sundrift Vale',
    type: 'region',
    region: 'sundrift-vale',
    summary: 'A wind-swept, starless steppe of dead tundra grass where nomadic clans follow woolly herds.',
    fullEntry: 'The Sundrift Vale stretches beneath a dark sky empty of stars, constellations, or navigable heavens. House Ordavan traded fertile soil for the endless migration, ensuring the steppe\'s grass always returns to feed the great woolly herds. Nomadic clans navigate the starless grasslands by memory and the hum of ancestral burial mounds, sharing the steppe with the crystal-skinned Astril who carry the constellation-spirits of Sol\'s ministers in their veins.',
    relatedTerms: ['house_ordavan', 'synod_hold', 'astril', 'lien', 'hungry_child', 'starfall_vale', 'the_unlit_knoll', 'kumis_downs', 'ancestor_wold']
  },
  'bryngloom-forest': {
    id: 'bryngloom-forest',
    term: 'Bryngloom Forest',
    type: 'region',
    region: 'bryngloom-forest',
    summary: 'A semi-frozen sinking bog and bioluminescent forest governed by the contracts of the silver-skinned Neth.',
    fullEntry: 'The Bryngloom Forest is a damp, twilight canopy where ironwood trees grow above bottomless, peat-sinking bogs. Here, the ancestors of the Neth struck a legalistic contract with the Root-Veil, trading death\'s finality for silver skin and stilled breath. It is a land of litigation, memory-preservation, and bioluminescent fungal groves, shared in cold silence with the lantern-eyed Vreken who sing to their glowing ancestors in inverted cathedrals. The oldest pre-bargain records name this land simply the Gloom — an older name that still survives in archaic speech, in the ancestral Gloom-Tongue, and in the Vreken epithet \'the Gloom-Lit\'; the compound Bryngloom is the modern form.',
    relatedTerms: ['atropolis', 'sunken_spire', 'neth', 'vreken', 'cycle_eater', 'debt_revenant', 'vel_keth_bayou', 'aran_glen', 'black_fen', 'widows_quagmire', 'morrens_bogpost']
  },

  // NOBLE HOUSES
  'house_thalreth': {
    id: 'house_thalreth',
    term: 'House Thalreth',
    type: 'noble_house',
    region: 'frostwood-reach',
    summary: 'The noble lineage of the Frostwood Reach who traded the region\'s spatial clarity for an insulating, protective fog.',
    fullEntry: 'House Thalreth is the ancient ruling family of the Frostwood Reach, whose seat of power is Greymark Keep. Driven by a desperate need to protect their territory and wildlife from freezing solid during the Deepening, they bargained away the spatial clarity of the Reach. The resulting insulating fog keeps their ironwood timber warm but slowly eats the memories of their descendants, forcing them to maintain exhaustive, chained ledger-libraries to verify their lineages. The house also maintains satellite settlements at Mistbarrow, where archivists continue to petition for excavation of the ancient barrow, and Greythorn Copse, the fortified copse on the eastern trade route co-managed with the Briaran.',
    relatedTerms: ['frostwood-reach', 'greymark_keep', 'mistbarrow', 'greythorn_copse', 'mirror_mere']
  },
  'house_skalvyr': {
    id: 'house_skalvyr',
    term: 'House Skalvyr',
    type: 'noble_house',
    region: 'nordhalla',
    summary: 'The northern lords of Nordhalla who halted the glaciers at the price of an eternal winter.',
    fullEntry: 'House Skalvyr is the unyielding noble family of Nordhalla. During the sun\'s burial, when titanic glaciers advanced to grind their mountain keeps into dust, Skalvyr bargained with the Cosmic Warden to freeze the ice sheets in place. The Warden capitulated, halting the glaciers permanently — but decreed that summer would never return to the north. Their descendants rule the brutalist fjord-keeps, valuing cold-resistance above all. Vargtor, the wolf-tor garrison rising above the glacier line, serves as the house\'s primary forward garrison against glacier wyrms and eastern threats.',
    relatedTerms: ['nordhalla', 'frozen_archive', 'vargtor', 'ymirs_col', 'the_black_firth']
  },
  'house_solvan': {
    id: 'house_solvan',
    term: 'House Solvan',
    type: 'noble_house',
    region: 'sundale',
    summary: 'The tragic family of Sundale whose heirs were sacrificed to bind the dying star Sol beneath their ashlands.',
    fullEntry: 'House Solvan is the noble family of Sundale, heavily scarred by the history of the Great Breach. It was Solvan who spearheaded the entombment of Sol, flaying Aex to weave the binding seal. Pressed to extinction by the cold, they capitulated to Keth-Amar, marching their firstborn north. Their descendants remain in the scorched, soot-choked badlands of Emberspire, refusing to leave because leaving would mean admitting their ancestral sacrifice was meaningless. Sol\'s Anvil Mesa, the massive basalt tableland where Solvarn sun-priests conduct their holiest ceremonies, remains the house\'s most sacred ceremonial site outside Emberspire itself.',
    relatedTerms: ['sundale', 'emberspire', 'keth_amar', 'sols_anvil_mesa', 'the_ashen_escarpment', 'ember_lagoon']
  },

  // FIGURES
  'grum': {
    id: 'grum',
    term: 'Grum Bloodhammer',
    type: 'historical_figure',
    region: 'sundale',
    summary: 'The legendary forge-blacksmith of Emberspire in Sundale who first manifested the Berserker\'s Blood-Heat by surrendering to the volcanic forge during a wyrm attack.',
    fullEntry: 'Grum Bloodhammer was a master forge-blacksmith of the Emberspire volcanic forges in Sundale. During a deep-geyser mining expedition in the volcanic tunnels in the year 412 of the Dimming, a colossal ice-wyrm that had been stalking the heated vents burst into the chambers, threatening dozens of workers. Refusing to flee, Grum threw down his tools and deliberately surrendered to the searing heat of the forge, igniting his blood and muscles in an overdrive frenzy of adrenaline. His boiling fury allowed him to shatter the wyrm\'s glacial hide with his bare fists, establishing the path of the Blood-Heat.',
    relatedTerms: ['berserker', 'sundale', 'emberspire', 'blood_heat']
  },
  'sera': {
    id: 'sera',
    term: 'Sera Solvan',
    type: 'historical_figure',
    region: 'sundale',
    summary: 'The Solvarn mother who carved her sacrificed child\'s name into her flesh, becoming the first Martyr.',
    fullEntry: 'Sera Solvan was a mother of House Solvan during the dark years of the capitulation. When the six noble houses marched their firstborn heirs to the northern peaks to be devoured by Keth-Amar, Sera refused to let her child\'s memory be erased by the houses\' subsequent history-purge. She carved her sacrificed child\'s name directly into her forearm with volcanic obsidian. The wound healed into a glowing, sympathetic solar scar, marking the first Martyr path that absorbs the suffering of others.',
    relatedTerms: ['martyr', 'house_solvan', 'sundale']
  },
  'valerius': {
    id: 'valerius',
    term: 'Valerius',
    type: 'historical_figure',
    region: 'bryngloom-forest',
    summary: 'The Velun Neth archivist who formulated the rigid, contract-based spellcasting of the Arcanoneer.',
    fullEntry: 'Valerius was a high archivist of the Velun Neth in Atropolis. Evolving stilled breath and silver skin from the Neth\'s First Contract with the Keeper of the Last Threshold, Valerius realized that the magic of the Bryngloom Forest responded to the same legal syntax. By structuring incantations as strict, balanced legal documents, Valerius discovered he could crystallize his blood into volatile shards siphoned through iron, anchoring his limbs to the earth in a freezing lock and generating the first Arcanoneer spells.',
    relatedTerms: ['arcanoneer', 'neth', 'bryngloom-forest']
  },
  'scathrach': {
    id: 'scathrach',
    term: 'Scathrach, the Ashen Sovereign',
    type: 'historical_figure',
    region: 'sundale',
    summary: 'A parasitic demon-intelligence from the deepest volcanic furnace of Emberspire, who binds with Pyrofiends as a patron.',
    fullEntry: 'Scathrach, known as the Ashen Sovereign, is an ancient, parasitic demonic intelligence nesting deep within the molten vents of Emberspire. Not a standard mortal, Scathrach feeds on absolute despair and answers prayers with destructive, uncontrollable combustion. It is the patron of the Pyrofiend class, offering devastating magical fire at the price of slowly rewriting the spellcaster\'s body into a cracking char-vessel of magma and white-hot bone. Eventually, the Ashen Sovereign claims the host\'s soul entirely for its eternal furnace.',
    relatedTerms: ['pyrofiend', 'sundale', 'emberspire']
  },

  // RACES
  'mimir': {
    id: 'mimir',
    term: 'Mimir',
    type: 'race',
    region: 'frostwood-reach',
    summary: 'A secretive, shape-shifting people of the Frostwood Reach who wear heartwood, storm-glass, or pine masks.',
    fullEntry: 'The Mimir are a slender, rare people of the Frostwood Reach. Evolving from the forester Sylvain, who merged with a doppelganger death-omen, the Mimir possess the ability to shift their physical forms. Because the regional fog decays memory and threatened their identity, they began wearing masks carved from heartwood or storm-glass to lock their true forms. They are divided into the Mask-Borne canopy aristocrats, the Mist-Woven sentinels, and the Unwoven maskless floor-dwellers. Mirror Mere, the perfectly still lake at the heart of Mask-Borne territory, serves as both the Mimir\'s spiritual center and their most reliable tool for verifying identity against the fog\'s erosion.',
    relatedTerms: ['frostwood-reach', 'gref', 'mirror_mere', 'the_shifting_fen', 'wraithfen']
  },
  'rite-of-masks': {
    id: 'rite-of-masks',
    term: 'Rite of Masks',
    type: 'cultural_practice',
    region: 'frostwood-reach',
    summary: 'The sacred, defensive custom practiced by the Mimir where they wear beautifully carved, seamless masks to lock their identity against the fog\'s memory-decay and secure trust.',
    fullEntry: 'The Rite of Masks is the central, survival-defining custom of the Mimir race. Originating in the Frostwood Reach where the creeping mist hollows and erases the personal memories of mortals, the Mimir — who possess innate shape-shifting abilities — discovered that their fluid anatomy was highly vulnerable to dissolving under the fog\'s decay. By carving and ritually bonding to a single, seamless mask made of heartwood, storm-glass, or black birch, a Mimir permanently anchors their primary identity and physical form. Socially, the Rite of Masks serves as a covenant of trust with human neighbors: by wearing a constant, recognizable persona, the Mimir guarantees they will not hijack another mortal\'s face or slip away into shape-shifting deception.',
    relatedTerms: ['mimir', 'frostwood-reach', 'greymark_keep']
  },
  'emberth': {
    id: 'emberth',
    term: 'Emberth',
    type: 'race',
    region: 'sundale',
    summary: 'A powerful, dark-skinned people of Sundale who bear deliberate burn-scars encoding their lineage and trade.',
    fullEntry: 'The Emberth are the broad-shouldered craftsmen and Sun-Speakers of Sundale. Warned by prophecy of the sun\'s death, their ancestors sheltered in the thermal caverns beneath Emberspire before the surface froze. They possess large, heat-sensitive eyes and long lungs adapted to thin air. They are divided into the Korr of the deep vault, who tend the Solbrand in holy silence, and the Thrask badland rangers who hunt and mine the volcanic frontier. Ember Lagoon, Sundale\'s only port, is jointly operated by Emberth harbourmasters and Merryn shipping clans, serving as the primary conduit through which Sundale\'s forged goods reach the wider world.',
    relatedTerms: ['sundale', 'solbrand', 'harath_vault', 'ember_lagoon', 'cinderhoodoo', 'slag_gulch']
  },
  'neth': {
    id: 'neth',
    term: 'Neth',
    type: 'race',
    region: 'bryngloom-forest',
    summary: 'An immortal, silver-skinned people of the Bryngloom Forest bound by legal contracts to the Root-Veil.',
    fullEntry: 'The Neth are a legalistic, stilled-breath people of Atropolis. Descended from a dying scribe-clan that negotiated a treaty with the Keeper of the Last Threshold, the Neth traded death\'s finality for survival. Their bloodlines are written in the First Contract, rendering them unable to tell a direct lie. They are divided into the silver-skinned Velun pact-lords, the Kessen weavers of the forest floor, and the leaden-grey Drun outcasts who legally do not exist. Beyond Atropolis, the Vel-Keth Bayou — "the water that remembers" — supplies memory-glass deposits harvested by Kessen weavers, while the living-ironwood settlement of Aran-Glen demonstrates the Neth capacity for patient, biological architecture.',
    relatedTerms: ['bryngloom-forest', 'atropolis', 'drun', 'velun', 'kessen', 'vel_keth_bayou', 'aran_glen', 'black_fen']
  },
  'astril': {
    id: 'astril',
    term: 'Astril',
    type: 'race',
    region: 'sundrift-vale',
    summary: 'A crystal-skinned people of the Sundrift Vale whose bodies carry the nesting constellation-spirits of Sol\'s ministers.',
    fullEntry: 'The Astril are the luminous guardians of the starless steppe. When Sol was bound, the constellation-spirits of the sun\'s celestial court took refuge inside the bloodlines of the steppe peoples. This nesting manifests as crystalline, glowing skin patterns that hum with celestial resonance. They are divided into the Sylen, who seek total symbiosis with their spirits, the Muren, who bind and suppress them, and the Unlit, who carry no star-glow. Starfall Vale, where the residue of Sol\'s shattered celestial court impacts the earth, remains the most important pilgrimage site for Astril of every caste — a place where the Memory of Sol can still be heard in the harmonic tones of trapped starlight.',
    relatedTerms: ['sundrift-vale', 'synod_hold', 'starfall_vale', 'the_unlit_knoll', 'nova_heath']
  },

  // RESOURCES
  'blood_heat': {
    id: 'blood_heat',
    term: 'Blood-Heat',
    type: 'resource',
    region: 'sundale',
    summary: 'The volatile physiological rage of the Berserker, where boiling blood turns pain into apocalyptic strength.',
    fullEntry: 'Blood-Heat represents the dangerous physiological meltdown of the Berserker class. Triggered by intense kinetic strain and wounds, the blood within a Berserker\'s vessels surges in temperature, overriding pain receptors and granting supernatural strength. If this thermal pressure exceeds the maximum threshold, it triggers Metabolic Burnout, rupturing internal pathways and stalling the body in systemic shock.',
    relatedTerms: ['berserker', 'grum']
  },
  'inferno_veil': {
    id: 'inferno_veil',
    term: 'Inferno Veil',
    type: 'resource',
    region: 'sundale',
    summary: 'The progressive volcanic heat tracked by Pyrofiends as their demonic pact claims their flesh.',
    fullEntry: 'The Inferno Veil is the super-heated magical resonance managed by the Pyrofiend class. Forged from bargains with volcanic caldera fiends, the Pyrofiend channels destructive heat that detonates across adjacent tiles. As the veil rises, the spellcaster\'s damage scales aggressively, but the sulfurous, crackling energy sears their own capillaries and pulls their soul closer to the fiend\'s absolute claim.',
    relatedTerms: ['pyrofiend', 'sundale']
  },
  'devotion_gauge': {
    id: 'devotion_gauge',
    term: 'Devotion Gauge',
    type: 'resource',
    region: 'sundale',
    summary: 'The spiritual threshold accumulated by Martyrs as they volunteer to absorb the suffering of their allies.',
    fullEntry: 'The Devotion Gauge is the mechanical tracker of the Martyr class. Woven from the sacrifice of Sera Solvan, the Martyr generates spiritual resonance by absorbing the kinetic and magical strain directed at their allies. This suffering is not lost; it is cataloged and converted into radiant, defensive barriers and protective seals that shield the party.',
    relatedTerms: ['martyr', 'sera']
  },

  // EVENTS
  'the_deepening': {
    id: 'the_deepening',
    term: 'The Deepening',
    type: 'event',
    region: 'sundale',
    summary: 'The ancient, natural death-rebirth cycle of celestial bodies that was interrupted by the burial of the sun.',
    fullEntry: 'The Deepening is the fundamental rhythm of the Mythrill universe — the cyclical process by which a star sheds its exhausted light and rekindles its fire from within. When Sol entered this vulnerable state, it attracted the cosmic predator Keth-Amar, triggering the seven noble families\' desperate entombment of the star beneath Sundale and breaking the natural cycle of the heavens.',
    relatedTerms: ['sundale', 'keth_amar']
  },
  'the_breach': {
    id: 'the_breach',
    term: 'The Breach',
    type: 'event',
    region: 'sundale',
    summary: 'The catastrophic event when Keth-Amar cracked Sol\'s volcanic tomb, releasing the Wyrd.',
    fullEntry: 'The Breach occurred when Keth-Amar devoured the firstborn heirs of the six noble houses, utilizing their bloodline keys to fracture the vault binding Sol beneath Sundale. The seal shattered into seven Sundered Monoliths, triggering the eruption of Emberspire and letting the Wyrd bleed through the volcanic cracks into the surface air.',
    relatedTerms: ['sundale', 'emberspire', 'keth_amar']
  },

  // CREATURES
  'gref': {
    id: 'gref',
    term: 'Gref',
    type: 'creature',
    region: 'frostwood-reach',
    summary: 'A face-stealing Wyrd-manifestation born from the Reach\'s fear of losing one\'s identity to the fog.',
    fullEntry: 'The Gref is a terrifying horror of the Frostwood Reach, born from the Wyrd mirroring the local human fear of cognitive decay. An amorphous, silent predator, the Gref stalks travelers in the fog, stealing their memories and physical features. It leaves its victims maskless and faceless in the mist, wearing their stolen visages to infiltrate timber keeps.',
    relatedTerms: ['frostwood-reach', 'mimir']
  },
  'gambrel': {
    id: 'gambrel',
    term: 'Gambrel',
    type: 'creature',
    region: 'frostwood-reach',
    summary: 'An oath-hunting Wyrd-creature that tracks those who make promises they intend to break.',
    fullEntry: 'The Gambrel is a spindly, long-limbed Wyrd-horror that manifests in the Frostwood Reach. Drawn to the specific guilt of broken agreements and hollow oaths, the Gambrel uses the debtor\'s hidden shame as a visual beacon, stalking carriages along the mist-choked trails. It cannot be outrun, as its speed is directly proportional to the target\'s desperation to forget their broken promises.',
    relatedTerms: ['frostwood-reach', 'house_thalreth']
  },
  'stel': {
    id: 'stel',
    term: 'Stel',
    type: 'creature',
    region: 'nordhalla',
    summary: 'A frozen Wyrd-creature that acts as a glacier\'s memory, replaying the death-moments of those caught in the ice.',
    fullEntry: 'The Stel is a heavy, crystalline colossus of Nordhalla, formed from compacted glacial ice and the spiritual residue of the dead. Acting as the physical projection of the glacier\'s memory, the Stel stalks the frozen fjords. It continuously replays the final, terror-filled screams of those who frozen inside the ice sheets, using their disoriented echoes to lure fresh travelers to their doom.',
    relatedTerms: ['nordhalla', 'house_skalvyr']
  },

  // ============================================================
  // COSMOLOGICAL ENTITIES
  // ============================================================

  'the_warden': {
    id: 'the_warden',
    term: 'The Warden',
    type: 'entity',
    region: 'sundale',
    summary: 'The ancient, impartial cosmic arbitrator who brokered the Original Binding of Sol and enforces the cost of every bargain struck in Mythrill.',
    fullEntry: 'The Warden is not a god, not a spirit, not a force of nature in any conventional sense. It is the universe\'s mechanism of consequence — a presence older than Sol itself that exists to enforce the logic of exchange. The Warden\'s role in Mythrill\'s history is two-fold.\n\nFirst: the **Original Binding**. When Sol entered the Deepening, the seven noble families approached the Warden with a desperate proposal — to entomb the dying star beneath the volcanic crust of Sundale. The Warden accepted this bargain on one condition: the willing sacrifice of Aex, Sol\'s own firstborn, whose living hide was flayed to weave the binding seal. This is the act for which the Warden is remembered, and the reason its name is spoken with both reverence and dread.\n\nSecond: the **Regional Compacts**. After Sol was bound, each noble house (or, in Bryngloom\'s case, the Neth ancestors rather than a noble family) returned to the Warden to negotiate individual compacts — protective bargains that traded something precious for something necessary. Thalreth traded clarity for fog. Skalvyr traded summer for halted glaciers. Each compact was accepted without negotiation and without mercy.\n\nThe Dark Bargains — the capitulation to Keth-Amar and the sacrifice of firstborn heirs — were struck with Keth-Amar directly, not with the Warden. Confusion arises because both entities deal in exchange, but they are not the same. The Warden enforces balance. Keth-Amar devours.\n\nThe Warden does not punish. It does not reward. It remembers every clause of every contract, and it enforces them without exception. Those who have encountered what they believe to be the Warden describe only a sensation: the certainty that a debt has just been recognized.',
    relatedTerms: ['the_deepening', 'the_breach', 'keth_amar', 'house_solvan', 'house_thalreth']
  },

  'keth_amar': {
    id: 'keth_amar',
    term: 'Keth-Amar',
    type: 'entity',
    region: 'sundale',
    summary: 'The ancient cosmic predator that hunts dying stars during their Deepening cycle — the catastrophe that triggered the burial of Sol.',
    fullEntry: 'Keth-Amar is a force that has no name in any living language older than eight centuries — because every civilization that named it in writing was destroyed before the word could spread. It hunts stars during their Deepening, the vulnerable death-rebirth cycle, consuming them before they can rekindle. When Sol entered its Deepening, Keth-Amar followed. The seven noble houses, recognizing what was coming, chose to entomb Sol beneath the world rather than surrender it. Keth-Amar accepted the firstborn heirs of the six noble families as tribute — a cost extracted through the dark bargains — and in consuming them, cracked the seal of Sol\'s vault, triggering The Breach. Whether Keth-Amar was satisfied, or merely delayed, is the question every court mage and hedge prophet in Mythrill has been arguing since the eruption of Emberspire.',
    relatedTerms: ['the_deepening', 'the_breach', 'house_solvan', 'sundale']
  },

  'solbrand': {
    id: 'solbrand',
    term: 'Solbrand',
    type: 'resource',
    region: 'sundale',
    summary: 'The sacred, searing thermal current that radiates from Sol\'s buried vault beneath Emberspire, tended by the Korr Emberth in holy silence.',
    fullEntry: 'The Solbrand is not a flame. It is the residual warmth of a star that should be dead, bleeding upward through eight hundred feet of volcanic basalt. The Korr Emberth — the vault-dwelling caste of the Emberth race — have tended the Solbrand in sacred, wordless silence since the day Sol was bound. They believe the Solbrand is Sol\'s breathing — that if it ever falters, the star has truly died and no vault, no bargain, no sacrifice can restart it. In practical terms, the Solbrand heats the deep-cavern settlements, powers the forge-caldera used by the Emberth smith-clans, and provides the thermal differential that keeps the Sundale badlands from freezing solid like the rest of the world\'s surface.',
    relatedTerms: ['sundale', 'emberth', 'house_solvan', 'the_deepening']
  },

  'aex': {
    id: 'aex',
    term: 'Aex',
    type: 'entity',
    region: 'sundale',
    summary: 'Sol\'s own firstborn — a living entity of pure radiance whose body was flayed to weave the binding seal that entombs the dying star.',
    fullEntry: 'Aex was the firstborn of Sol — not a god, not an angel, but a living entity of pure stellar radiance who had protected the sun through every Deepening since the first star learned to burn. When the seven noble families chose to entomb Sol beneath the volcanic crust of Sundale to protect it from Keth-Amar, the Warden demanded a price: Aex\'s willing sacrifice. It was Solvan who wielded the knife, flaying Aex\'s living hide to weave the binding seal. Whether Aex consented freely or was compelled by loyalty to Sol remains the subject of bitter theological dispute in Sundale.',
    relatedTerms: ['the_warden', 'house_solvan', 'sundale', 'emberspire', 'the_deepening']
  },

  // ============================================================
  // CLASSES (20 active traditions + 6 merged concepts)
  // ============================================================

  'arcanoneer': {
    id: 'arcanoneer',
    term: 'Arcanoneer',
    type: 'class',
    region: 'bryngloom-forest',
    summary: 'A contract-mage who crystallizes their silver Neth blood into volatile shards, anchoring spells in legal precision rather than instinct.',
    fullEntry: 'The Arcanoneer tradition was formalized by Valerius, the great Velun archivist who realized that the Bryngloom Forest\'s ambient magic responded to the same syntax as Neth contract law. By structuring incantations as strict, legally-binding documents — with offer, consideration, and consequence — a caster can crystallize their blood into volatile Mnemonic Shards that anchor spells with extraordinary precision. The cost is rigidity: an Arcanoneer cannot improvise. Every spell must be prepared, structured, and filed. In combat this translates to absolute devastation within their prepared repertoire and near-helplessness outside it.',
    relatedTerms: ['neth', 'bryngloom-forest', 'valerius']
  },
  'augur': {
    id: 'augur',
    term: 'Augur',
    type: 'class',
    region: 'nordhalla',
    summary: 'A death-touched seer who reads the future in the entrails of the present, trading years of their own lifespan for visions.',
    fullEntry: 'The Augur tradition grew in the glacier-tombs of Nordhalla, where the dead stand upright in the ice as permanent witnesses to the living. The first Augurs discovered that prolonged proximity to the glacier-preserved dead created a resonance — flashes of the deceased\'s final visions. They learned to court this resonance deliberately, burning their own life-years to pull usable foresight from the edges of death. An Augur sees probabilities, not certainties — they tell you which path has fewer corpses, not which path has none.',
    relatedTerms: ['nordhalla', 'house_skalvyr']
  },
  'berserker': {
    id: 'berserker',
    term: 'Berserker',
    type: 'class',
    region: 'nordhalla',
    summary: 'A warrior who deliberately ignites their Blood-Heat to overdrive their physiology — trading control for catastrophic, self-burning strength.',
    fullEntry: 'The Berserker path was first walked by Grum Bloodhammer in the volcanic tunnels of Emberspire. Berserkers do not resist pain — they use it as fuel. The Blood-Heat mechanic tracks their physiological thermal pressure as it builds from wounds and exertion. At low heat, a Berserker is fast and strong. At high heat, they are apocalyptic but begin damaging themselves. At Metabolic Burnout, they collapse in systemic shock. The tradition demands absolute trust in one\'s own body and a total disregard for consequences — two traits that make Berserkers formidable in the short term and costly in the long.',
    relatedTerms: ['nordhalla', 'grum', 'blood_heat']
  },
  'shaper': {
    id: 'shaper',
    term: 'Shaper',
    type: 'class',
    region: 'frostwood-reach',
    summary: 'A master of kinetic biology who treats their body as a malleable weapon, merging the Bladedancer\'s momentum dance with the Formbender\'s biological adaptation.',
    fullEntry: 'The Shaper tradition was born from the convergence of the Frostwood Reach kinetic momentum dance and the Frostmaw Holdfast biological body-sculpting. The Mimir chronicler Veyra merged both arts, creating a combatant who reshapes posture, bone density, and musculature in real time. A Shaper navigates 6 Shaping Forms that blend kinetic stances with physical form adaptations, building Kinetic Flux through combat and accumulating Body Toll from every transformation. The price is absolute: every shift erodes identity, calcifies skin, and frays the nervous system. The dance is killing them, but stopping is death.',
    relatedTerms: ['frostwood-reach', 'frostmaw_holdfast', 'mimir', 'groven', 'bladedancer', 'formbender']
  },
  'bladedancer': {
    id: 'bladedancer',
    term: 'Bladedancer',
    type: 'concept',
    region: 'frostwood-reach',
    summary: 'The Bladedancer tradition of kinetic momentum warfare has been merged into the Shaper class. See: Shaper.',
    fullEntry: 'The Bladedancer tradition of hyper-accelerated momentum dance originated in the Frostwood Reach. This tradition has been merged with the Formbender biological adaptation art into the Shaper class. Former Bladedancers now fight as Shapers, combining their kinetic momentum dance with biological form-shifting.',
    relatedTerms: ['shaper', 'frostwood-reach']
  },
  'harbinger': {
    id: 'harbinger',
    term: 'Harbinger',
    type: 'class',
    region: 'nordhalla',
    summary: 'An entropy prophet and catastrophe engine who channels entropic friction and prophetic doom into living bomb prophecies, merging the Chaos Weaver\'s mayhem amplification with the Doomsayer\'s prophetic certainty.',
    fullEntry: 'The Harbinger tradition was forged in the darkest corners of both Sundrift Vale and Nordhalla, combining the Chaos Weaver\'s philosophical surrender to the Wyrd with the Doomsayer\'s prophetic certainty of catastrophe. A Harbinger does not simply predict doom — they orchestrate it, channeling entropic friction through prophetic visions into living bomb prophecies that detonate across the battlefield. Their Mayhem pressure gauge amplifies all spells as it rises, creating a self-reinforcing cycle of chaos that can only be released through catastrophic Wild Surges. They are simultaneously the most terrifyingly unpredictable and most strategically reliable battlefield presence in any party.',
    relatedTerms: ['nordhalla', 'sundrift-vale', 'house_skalvyr', 'chaos_weaver', 'doomsayer']
  },
  'chronarch': {
    id: 'chronarch',
    term: 'Chronarch',
    type: 'class',
    region: 'cragjaw-peaks',
    summary: 'A time-manipulator who unravels small loops of causality to reverse, delay, or accelerate moments — at the cost of temporal echoes.',
    fullEntry: 'The Chronarch tradition is the most intellectually demanding in the known traditions — it requires a practitioner to hold in mind not just what is, but what was and what could be, simultaneously. Chronarchs emerged from the Cragjaw Peaks, where the eternal blizzard that hides the mountains from the outside world created pockets of temporal suspension. A Chronarch does not travel in time. They stitch it — pulling a thread of the past forward or pushing a thread of the present backward by seconds or minutes. Each stitch leaves a temporal echo, a ghost-impression of the unraveled moment that lingers and occasionally acts on its own.',
    relatedTerms: ['cragjaw-peaks', 'house_tesshan']
  },
  'inquisitor': {
    id: 'inquisitor',
    term: 'Inquisitor',
    type: 'class',
    region: 'bryngloom-forest',
    summary: 'A witch-hunter and demon binder who severs magical bindings and commands bound fiends through sacred ritual, trained to hunt the Drun outcasts and rogue coven-mages of the Bryngloom.',
    fullEntry: 'The Inquisitor tradition arose in the Bryngloom Forest, where the complexity of Neth contract magic and Vreken ancestral spirit-bonds created both incredible power and incredible loopholes. An Inquisitor specializes in identifying, disrupting, and severing magical contracts — whether the target is a Drun Neth whose void-sealed body resists conventional magic, a Vreken shaman whose ancestral binding has gone rogue, a court mage whose contracted familiar has turned against them, or a bound demon whose loyalties are faltering. They are not magic-resistant by nature; they are magic-literate in the way a surgeon is anatomy-literate. The tradition also encompasses the binding and commanding of fiends through sacred dominance ritual, maintaining divine authority over the bound or risking demonic escape.',
    relatedTerms: ['bryngloom-forest', 'neth', 'vreken']
  },
  'revenant': {
    id: 'revenant',
    term: 'Revenant',
    type: 'class',
    region: 'bryngloom-forest',
    summary: 'A death caster who has returned from the grave, combining blood-magic sacrifice (Kora\'s covenant) with frost-stasis harvest (Vesper\'s phylactery) into a unified economy of death.',
    fullEntry: 'The Revenant tradition was born from the convergence of two death-magic schools in the Bryngloom Forest. The blood covenant of Kora the Veil-Speaker — who sacrificed her own life force to keep the ancestral lights burning and was cursed to hear the screams of the dead — merged with the frost stasis of Vesper the Scribe — who bound his soul to a basalt phylactery and negotiated perpetual dying to escape the sumps\' lung-rot. When the bog-graves began waking on their own, the two traditions recognized their separate wars were the same. The Revenant now carries both volatile Death Toll (blood-derived necrotic energy) and a kill-charged Phylactery (frost-stasis resurrection), toggling between Rest Mode and Death Shroud to burn HP for devastating power.',
    relatedTerms: ['bryngloom-forest', 'neth', 'vreken']
  },
  // 'deathcaller' and 'lichborne' merged into Revenant as Phase 1.10 consolidation
  'deathcaller': {
    id: 'deathcaller',
    term: 'Deathcaller',
    type: 'concept',
    region: 'bryngloom-forest',
    summary: 'The Deathcaller blood-magic tradition has been merged with the Lichborne frost-stasis tradition into the Revenant class. See: Revenant.',
    fullEntry: 'The Deathcaller tradition of blood-fueled necromancy originated with Kora the Veil-Speaker in the Bryngloom Forest. Practitioners sacrificed their own HP to generate volatile Blood Tokens and commune with luminous ancestral dead. This tradition has been merged with Vesper\'s frost-stasis Lichborne tradition into the unified Revenant class. Former Deathcallers now fight as Revenants, combining their blood sacrifice mechanics with phylactery resurrection and Death Shroud frost mode.',
    relatedTerms: ['revenant', 'bryngloom-forest', 'vreken', 'neth']
  },
  // 'dreadnaught' absorbed into Martyr
  'dreadnaught': {
    id: 'dreadnaught',
    term: 'Dreadnaught',
    type: 'concept',
    region: 'cragjaw-peaks',
    summary: 'The Dreadnaught tradition of furnace-armor warfare has been absorbed into the Martyr class as the Ironclad specialization. See: Martyr (Ironclad).',
    fullEntry: 'The Dreadnaught tradition of steam-powered iron juggernauts originated in the Cragjaw Peaks, where Groven troll-kin welded heating pipes to their bodies to defend against the Skreika. This tradition has been absorbed into the Martyr class as the Ironclad specialization — furnace-bound Martyrs who seal themselves in iron plate and combine willing sacrifice with combustion engine mechanics. Former Dreadnaughts now fight as Ironclad Martyrs.',
    relatedTerms: ['martyr', 'cragjaw-peaks', 'groven']
  },
  // 'exorcist' removed (merged with Covenbane into 'inquisitor' — see above)
  // 'exorcist' and 'covenbane' merged into Inquisitor as Phase 1.9 consolidation
  'exorcist': {
    id: 'exorcist',
    term: 'Exorcist',
    type: 'concept',
    region: 'bryngloom-forest',
    summary: 'The Exorcist tradition of ritual purification has been merged with the Covenbane witch-hunting art into the Inquisitor class. See: Inquisitor.',
    fullEntry: 'The Exorcist tradition of ritual purification and spirit-cleansing originated in the Bryngloom Forest, where the density of Neth contract-magic and Vreken spirit-bonds created frequent supernatural disruptions. This tradition has been merged with the Covenbane demon-binding art into the unified Inquisitor class. Former Exorcists now fight as Inquisitors, combining their cleansing rituals with the Inquisitor\'s contract-severing and fiend-binding capabilities.',
    relatedTerms: ['inquisitor', 'bryngloom-forest', 'covenbane']
  },
  'covenbane': {
    id: 'covenbane',
    term: 'Covenbane',
    type: 'concept',
    region: 'bryngloom-forest',
    summary: 'The Covenbane witch-hunting tradition has been merged with the Exorcist ritual purification art into the Inquisitor class. See: Inquisitor.',
    fullEntry: 'The Covenbane tradition of organized witch-hunting and demon binding arose from the necessity of policing the Bryngloom\'s dense supernatural ecosystem. When rogue Neth contracts, corrupted Vreken ancestral bonds, and unbound fiends began threatening settlements, the Covenbane order formed to identify, hunt, and neutralize these threats. This tradition has been merged with the Exorcist\'s ritual purification art into the unified Inquisitor class.',
    relatedTerms: ['inquisitor', 'bryngloom-forest', 'exorcist']
  },
  'false_prophet': {
    id: 'false_prophet',
    term: 'False Prophet',
    type: 'class',
    region: 'sundrift-vale',
    summary: 'A manipulator who weaponizes faith — creating and exploiting constructed belief systems to accumulate political power and divine-adjacent ability.',
    fullEntry: 'The False Prophet does not believe their own gospel. They understand that belief itself is a resource — that a people who believe something with sufficient intensity generate a spiritual resonance that can be harvested. The tradition originated in the Sundrift Vale, where the starless sky and the nomadic migrations created desperate demand for meaning. A False Prophet engineers that meaning with the cold precision of an architect. They are not necessarily malicious — some build their constructed faiths to protect people, knowing that the lie is more useful than the truth. The power comes from the congregation, not the prophet.',
    relatedTerms: ['sundrift-vale', 'astril']
  },
  'gambit': {
    id: 'gambit',
    term: 'Gambit',
    type: 'class',
    region: 'cragjaw-peaks',
    summary: 'A probability-manipulator who reads the threads of consequence and gently redirects them — making unlikely outcomes inevitable without apparent intervention.',
    fullEntry: 'The Gambit tradition draws from the Kessen Neth\'s practice of probability-web reading in the Bryngloom Forest, refined through the high-stakes toll negotiations of the Cragjaw Peaks. A Gambit does not control fate — they nudge it. Their power is the power of compound interest: small adjustments made early that accumulate into dramatically different outcomes. They win battles before they start by ensuring the terrain, weather, and morale are all marginally more favorable. They are impossible to credit with specific victories and impossible to blame for specific losses.',
    relatedTerms: ['cragjaw-peaks', 'neth', 'bryngloom-forest']
  },
  'formbender': {
    id: 'formbender',
    term: 'Formbender',
    type: 'concept',
    region: 'cragjaw-peaks',
    summary: 'The Formbender tradition of biological body-sculpting has been merged into the Shaper class. See: Shaper.',
    fullEntry: 'The Formbender tradition of biological adaptation originated in Frostmaw Holdfast. This tradition has been merged with the Bladedancer kinetic momentum art into the Shaper class. Former Formbenders now fight as Shapers, combining their shapeshifting with kinetic form combat.',
    relatedTerms: ['shaper', 'frostmaw_holdfast', 'groven']
  },
  'apex': {
    id: 'apex',
    term: 'Apex',
    aliases: [],
    fullEntry: 'The Apex tradition is older than any noble house in the Frostwood Reach — it predates the fog and the bargains, rooted in the practical necessity of hunting blind through mist-choked timber. A Apex does not fight in the conventional sense. They identify, track, position, and resolve targets with the minimum expenditure of force required. Their knowledge of anatomy is comprehensive and non-squeamish — every debilitating strike targets a specific nerve cluster, joint, or blood vessel. They are not warriors. They are problems solved.',
    relatedTerms: ['frostwood-reach', 'mimir']
  },
  'animist': {
    id: 'animist',
    term: 'Animist',
    type: 'class',
    region: 'bryngloom-forest',
    summary: 'A spirit-channeler who bridges the gap between the ancestral dead and the living world, drawing power from ancient spirit bonds to cast, heal, and protect.',
    fullEntry: 'The Animist tradition is the Bryngloom Forest\'s most ancient and most socially central practice — born from the understanding that the dead never truly leave. An Animist does not summon spirits; they open channels that already exist. Their power comes from negotiated bonds with ancestral lineages, spirit courts, and the memory-echoes embedded in the land itself. Where others see death as an ending, an Animist sees it as a change of state — and one that can be conversed with, bargained with, and occasionally commanded through deep respect and ritual obligation.',
    relatedTerms: ['bryngloom-forest', 'vreken', 'neth']
  },
  // 'lichborne' merged into Revenant as Phase 1.10 consolidation
  'lichborne': {
    id: 'lichborne',
    term: 'Lichborne',
    type: 'concept',
    region: 'bryngloom-forest',
    summary: 'The Lichborne frost-stasis tradition has been merged with the Deathcaller blood-magic tradition into the Revenant class. See: Revenant.',
    fullEntry: 'The Lichborne tradition of partial undeath — negotiating perpetual dying through a basalt phylactery — originated with Vesper the Scribe in the deep peat-bogs of the Bryngloom Forest. By binding their soul to cold stone, Lichbornes achieved immortality at the cost of cold flesh and constant life-force harvesting. This tradition has been merged with Kora\'s blood-covenant Deathcaller tradition into the unified Revenant class. Former Lichbornes now fight as Revenants, retaining their Phylactery resurrection and Death Shroud frost mode while gaining volatile Death Toll from blood sacrifice.',
    relatedTerms: ['revenant', 'bryngloom-forest', 'neth', 'vreken']
  },
  'lunarch': {
    id: 'lunarch',
    term: 'Lunarch',
    type: 'class',
    region: 'frostwood-reach',
    summary: 'A void-touched mage who draws power from the absent sky — channeling the dark between the stars that Sol\'s absence left exposed.',
    fullEntry: 'The Lunarch tradition was born in the Frostwood Reach\'s perpetual fog-shrouded canopy — a place where sunlight never reached even before the Deepening. Lunarchs realized that Sol\'s absence had not left the sky empty. It had left the sky exposed to whatever lay beyond Sol — the cold, vast dark between stars that Keth-Amar itself travels through. They learned to channel this ambient void-light, which is not darkness but the specific quality of space that darkness reveals. A Lunarch\'s power is most effective at night, in low light, and in areas of high Wyrd-density — conditions that describe most of the world.',
    relatedTerms: ['frostwood-reach', 'the_deepening', 'keth_amar']
  },
  'martyr': {
    id: 'martyr',
    term: 'Martyr',
    type: 'class',
    region: 'sundale',
    summary: 'A self-sacrificing healer and shield who absorbs the suffering of allies into their own body, converting it into protective power through the Devotion Gauge.',
    fullEntry: 'The Martyr tradition was born from the act of Sera Solvan, who carved her sacrificed child\'s name into her flesh with volcanic obsidian and found that the wound glowed rather than healed. A Martyr does not protect allies by standing between them and danger — they absorb what reaches allies into themselves, metabolizing kinetic and magical damage into spiritual resonance tracked in the Devotion Gauge. At low Devotion, a Martyr is a walking wound. At high Devotion, they are a radiant engine of protection that makes the entire party significantly harder to harm. The tradition selects heavily for those who find meaning in suffering.',
    relatedTerms: ['sundale', 'sera', 'devotion_gauge', 'house_solvan']
  },
  'minstrel': {
    id: 'minstrel',
    term: 'Minstrel',
    type: 'class',
    region: 'iceheart-sea',
    summary: 'A sonic-resonance practitioner who weaponizes, heals with, and manipulates the world through structured sound and narrative.',
    fullEntry: 'The Minstrel tradition grew from the Merryn storm-sailors of the Iceheart Sea, who discovered that certain rhythms synchronized the body\'s physiological responses to waves and wind — enabling sustained effort that would otherwise exhaust a crew within hours. A Minstrel is not a bard in the conventional sense. Their sound-work is precise, technical, and physically demanding. They can accelerate healing, sharpen focus, disrupt coordination, or shatter stone at the correct resonant frequency. The tradition requires perfect pitch and the ability to maintain complex rhythmic structures while under combat pressure.',
    relatedTerms: ['iceheart-sea', 'house_mereval']
  },
  'plaguebringer': {
    id: 'plaguebringer',
    term: 'Plaguebringer',
    type: 'class',
    region: 'bryngloom-forest',
    summary: 'A biological-vector specialist who cultivates, directs, and weaponizes living disease with the precision of a mycologist.',
    fullEntry: 'The Plaguebringer tradition grew from the Bryngloom Forest\'s fungal-ecology — a world where bioluminescent mycelium connected the roots of every ironwood tree and where the bog-preserved dead occasionally reanimated with fungal intelligence rather than necromantic will. A Plaguebringer is not a chaos agent. They are a cultivator with very specific targets. Their diseases are engineered for selective transmission, predictable progression, and controllable severity. The tradition demands deep biochemical knowledge and the philosophical comfort with causing suffering that most medical traditions specifically train against.',
    relatedTerms: ['bryngloom-forest', 'neth', 'vreken']
  },
  'pyrofiend': {
    id: 'pyrofiend',
    term: 'Pyrofiend',
    type: 'class',
    region: 'sundale',
    summary: 'A volcanic pact-mage who channels Scathrach\'s demonic fire at the cost of their body being slowly remade into a cracking char-vessel of magma and bone.',
    fullEntry: 'The Pyrofiend tradition is the most viscerally destructive in the known world and one of the shortest in average practitioner lifespan. Scathrach, the Ashen Sovereign nesting in Emberspire\'s deepest vent, answers prayers of desperation with uncontrollable combustion — and the Pyrofiend tradition is the art of making that combustion controllable enough to survive. The Inferno Veil mechanic tracks how much of Scathrach\'s heat the practitioner is channeling; at high levels it damages the caster as well as the targets. The body gradually shifts from flesh to volcanic material. Eventually the conversion is complete and Scathrach claims the soul for its eternal furnace.',
    relatedTerms: ['sundale', 'scathrach', 'inferno_veil', 'emberspire']
  },
  'spellguard': {
    id: 'spellguard',
    term: 'Spellguard',
    type: 'class',
    region: 'sundale',
    summary: 'A defensive combat-mage who specializes in identifying, neutralizing, and reflecting incoming magical threats — a living counterspell.',
    fullEntry: 'The Spellguard tradition was developed in the forge-caldera keeps of Sundale, where Emberth smiths who worked near the Solbrand needed practitioners capable of intercepting and defusing the occasional magical eruption from Sol\'s imprisoned resonance. A Spellguard does not primarily cast offensive spells — they identify the structure of incoming magic and dismantle it before it arrives, redirect it, or reshape it into something that serves a different purpose. They are the tradition that most resembles engineering rather than artistry.',
    relatedTerms: ['sundale', 'emberth', 'solbrand']
  },
  'titan': {
    id: 'titan',
    term: 'Titan',
    type: 'concept',
    region: 'sundale',
    summary: 'The Titan tradition has been absorbed into the Warden class as the Monolith specialization. The calcified juggernaut arts of the Emberspire forge-clans now serve as a Warden path of gravitational immovability.',
    fullEntry: 'The Titan tradition was the Sundale forge-clans\' answer to overwhelming force: practitioners who weaponized their own bone density and gravitational mass to become immovable battlefield anchors. Drawing on the geothermal resonance of the volcanic Sundale landscape, they calcified their skeletons to hold corridors, lock down massive threats, and intercept damage with absolute, dense mass. This tradition has been absorbed into the Warden class as the Monolith specialization, where Wardens graft volcanic iron into their skeletal structure alongside their penitent jailer chains to become living stone sentinels.',
    relatedTerms: ['warden', 'sundale', 'emberth', 'groven']
  },
  'toxicologist': {
    id: 'toxicologist',
    term: 'Toxicologist',
    type: 'class',
    region: 'frostwood-reach',
    summary: 'A poison-crafter and delivery specialist who fights through careful preparation rather than direct confrontation — the most premeditated tradition in Mythrill.',
    fullEntry: 'The Toxicologist tradition grew in the Frostwood Reach\'s fog-choked timber, where the dense undergrowth produced both extraordinary pharmacological resources and the tactical conditions that made slow-acting, area-denial poisons more useful than swords. A Toxicologist is not an assassin in the conventional sense — they are a chemist. Their poisons are engineered for specific physiological effects, specific target populations, and specific durations. The tradition requires extraordinary patience and the stomach for outcomes that unfold over hours rather than seconds.',
    relatedTerms: ['frostwood-reach', 'house_thalreth']
  },
  'warden': {
    id: 'warden',
    term: 'Warden',
    type: 'class',
    region: 'nordhalla',
    summary: 'A territorial guardian who bonds to a specific location and draws power from defending it — becoming exponentially more dangerous as threats penetrate closer to their claimed ground.',
    fullEntry: 'The Warden tradition was born in the fjord-keeps of Nordhalla, where the eternal winter made retreating untenable and abandoned territory permanently lost to the glaciers. A Warden does not have a territory because it is convenient — they have a territory because they have chosen to die rather than lose it. The tradition grants increasing power the deeper an enemy advances into designated ground, creating a gradient of danger that punishes aggression and rewards defenders. A Warden outside their territory is a capable fighter; a Warden defending the keep they grew up in is a different category of threat entirely.',
    relatedTerms: ['nordhalla', 'house_skalvyr']
  },
  'corvani': {
    id: 'corvani',
    term: 'Corvani',
    type: 'subfolk',
    region: 'nordhalla',
    summary: 'Glacier-dwelling subfolk of Nordhalla, raven-marked messengers bound to the Corvid Fate-Spirits who trade memories for passage across the frozen wastes.',
    fullEntry: 'The Corvani are a rare subfolk of Nordhalla — raven-marked glacier-dwellers who carve their eyries into the sheer faces of the mile-high ice sheets. When House Skalvyr halted the glaciers at the price of eternal winter, a splinter group of highland survivors refused to descend into the fjord-keeps. They climbed higher, into the glacier-spires where the wind sings in polyphonic overtones, and struck a fate-bond with the ancient Corvid Fate-Spirits. The spirits anchored their memories against the isolation and granted them the sight to read threads of destiny. Now they serve as messengers between the frozen fjord-keeps, navigating whiteout and glacier-crevasse with preternatural skill. Their price is always a memory, freely given — recorded in the shifting raven-markings that crawl across their skin.',
    relatedTerms: ['nordhalla', 'corvid_speech', 'house_skalvyr']
  },
  'corvid_speech': {
    id: 'corvid_speech',
    term: 'Corvid-Speech',
    type: 'cultural_practice',
    region: 'frostwood-reach',
    summary: 'The complex, polyphonic throat-signed language of the Corvani subfolk and the Corvid Fate-Spirits, utilizing clicks, whistles, and marking-shifts.',
    fullEntry: 'Corvid-Speech is the ancestral language of the Corvani subfolk, born from imitation of the Corvid Fate-Spirits and the howling polar gales of Nordhalla\'s glacier-faces. It is a polyphonic tongue that combines soft clicks, whistling, and low-frequency throat vibrations with subtle shifting of their fate-spun markings. This structure makes the language incredibly dense and near-impossible for other races to speak fluently without magical aid, but permits the Corvani to communicate silently and across vast distances between the frozen fjord-keeps.',
    relatedTerms: ['corvani', 'nordhalla']
  },
  'rime_born': {
    id: 'rime_born',
    term: 'Rime-Born',
    type: 'race',
    region: 'nordhalla',
    summary: 'The frost-touched, non-human survivors of Nordhalla\'s eternal winter, carrying the freezing stasis of the Hunger Pact.',
    fullEntry: 'The Rime-Born (historically referred to as the Breath-Takers or Hrym) are a stoic, formidable people of Nordhalla\'s frozen fjords. Evolving from refugees of the Hunger Pact who consumed their own dead during a three-winter blizzard, they carry a supernatural cold in their blood. Their skin feels like stone left in shadow, their breath freezes even in southern heat, and they suffer from the Milk-Grief—a supernatural labor-cold that drains a mother\'s warmth to save the child. They are divided into the library-dwelling Rune Keepers, the fury-driven Bloodhammers, and the blue-skinned Frostbound.',
    relatedTerms: ['nordhalla', 'house_skalvyr', 'bloodhammer', 'stel', 'skreika']
  },

  // ============================================================
  // MISSING LORELINK TARGETS — Locations, Races, NPCs
  // ============================================================

  'atropolis': {
    id: 'atropolis',
    term: 'Atropolis',
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'The cathedral-grove capital of the Neth — a living archive woven from ancient ironwood trees where the First Contract is preserved.',
    fullEntry: 'Atropolis is not a city of stone. It is a cultivated cathedral-grove — the oldest ironwood trees in the Bryngloom Forest, each one shaped over a thousand years into archive-chambers where the Neth live, work, and preserve every contract ever written. The deepest chamber of the oldest tree — the Heart-Vault — contains the First Contract itself, visible through living heartwood that has grown around the original document for eight centuries.',
    relatedTerms: ['neth', 'bryngloom-forest', 'valerius']
  },
  'vreken': {
    id: 'vreken',
    term: 'Vreken',
    type: 'race',
    region: 'bryngloom-forest',
    summary: 'A lantern-eyed people of the Bryngloom who sing to their glowing ancestors in inverted cathedrals, carrying amber and silver light through the dark forest.',
    fullEntry: 'The Vreken are the Bryngloom\'s first inhabitants — lantern-eyed crypt-speakers who predate the Neth\'s arrival by centuries. They carry the bioluminescent amber and silver glow of their ancestors in their eyes and skin, singing to the dead in inverted cathedrals carved into the peat-bogs. Divided into the Clean (deep-glow scholars) and the Marked (ghost-mycelium walkers), the Vreken view the Neth as spiritually bankrupt — trading with death instead of honoring it.',
    relatedTerms: ['bryngloom-forest', 'neth', 'sunken_spire']
  },
  'briaran': {
    id: 'briaran',
    term: 'Briaran',
    type: 'race',
    region: 'frostwood-reach',
    summary: 'Thorn-blooded descendants of the erased House Viridane who refused the Fog Compact and maintain a spiritual contract with the fae of the deep ironwood.',
    fullEntry: 'The Briaran are the living ghost of House Viridane — the eighth noble house that refused to participate in the Dark Bargains and was erased from every record for their defiance. Thorn-blooded and fae-contracted, they live deep in the untouched ironwood groves of the Frostwood Reach, following the old ways and rejecting Thalreth\'s Fog Compact entirely. Divided into the Unshorn (thorn-cloaked traditionalists) and the Smooth-Skinned (who pass as human), the Briaran possess the Unwritten Word — a truth-sense that detects spoken lies.',
    relatedTerms: ['frostwood-reach', 'house_thalreth', 'mimir']
  },
  'harath_vault': {
    id: 'harath_vault',
    term: 'Harath-Vault',
    type: 'location',
    region: 'sundale',
    summary: 'The massive subterranean capital of the Emberth forge-clans, carved into a dormant volcanic caldera three miles from Emberspire.',
    fullEntry: 'Carved radially into the volcanic throat of a dormant secondary caldera three miles from Emberspire sits the Harath-Vault, the massive subterranean capital of the Emberth forge-clans. Carved out by the Sun-Speakers centuries before the sun\'s death, the vault serves as both sacred temple to the Solbrand and industrial forge-caldera. The Korr Emberth tend the eternal ember here in holy silence, while the Thrask rangers mine and hunt the volcanic frontier above.',
    relatedTerms: ['emberth', 'sundale', 'solbrand', 'emberspire']
  },
  'frostmaw_holdfast': {
    id: 'frostmaw_holdfast',
    term: 'Frostmaw Holdfast',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'The ancestral stronghold of the Groven in the Cragjaw Peaks, site of the original vat-laboratories and the Vat-Breakers\' revolt.',
    fullEntry: 'Frostmaw Holdfast is the calcified heart of Groven civilization — a massive stronghold built into the vertical walls of a Cragjaw ravine. It was here that the Fexric Deep Alchemists first established their vat-laboratories, creating the Groven from Thrumm broodlings. And it was here that the Vat-Breakers\' revolt began, when the first generation of transformed Groven shattered their containment vats and rose against their creators. The holdfast remains contested territory between the Groven and the Deep Alchemists who still operate in the tunnels below.',
    relatedTerms: ['groven', 'fexrick', 'cragjaw-peaks']
  },
  'frozen_archive': {
    id: 'frozen_archive',
    term: 'Frozen Archive',
    type: 'location',
    region: 'nordhalla',
    summary: 'The great glacier-tomb of Nordhalla where the dead stand upright in the ice as permanent witnesses, and where the Augur tradition was born.',
    fullEntry: 'The Frozen Archive is Nordhalla\'s most sacred and terrifying location — a cathedral of ice where the dead stand upright in the glacier, perfectly preserved, their final expressions frozen for eternity. Scribe-sentinels maintain the genealogical records here, and the Augur tradition was born in its corridors, where proximity to the glacier-preserved dead creates a resonance that allows the living to glimpse the dead\'s final visions.',
    relatedTerms: ['nordhalla', 'house_skalvyr', 'augur']
  },
  'synod_hold': {
    id: 'synod_hold',
    term: 'Synod Hold',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'The crystal-lattice archive of the Astril Luminarchy, where constellation-spirits are studied and the Unlit are judged.',
    fullEntry: 'The Synod Hold is the seat of the Astril Luminarchy — a vast archive built from resonant crystal-lattice in the Sundrift Vale. Here, the Astril hierarchy studies the constellation-spirits carried in their blood, adjudicates disputes between Lit and Unlit castes, and maintains the most comprehensive astronomical records in the known world. The Synod is also where False Prophets are tried and banished, their deceptive light recognized as a toxic forgery of true celestial resonance.',
    relatedTerms: ['astril', 'sundrift-vale', 'false_prophet']
  },
  'merrowport': {
    id: 'merrowport',
    term: 'Merrowport',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'The largest human port-city on the Iceheart Sea, anchored to a warm volcanic seamount beneath the frozen waves.',
    fullEntry: 'Merrowport is the largest human settlement on the Iceheart Sea — a sprawling port-city of timber and iron anchored to a massive, warm subterranean volcanic seamount that keeps the surrounding waters perpetually unfrozen. The Merryn storm-sailors who dominate its docks tattoo their charts directly onto their skin, and the city is the primary gateway for trade between the Iceheart and every other region.',
    relatedTerms: ['iceheart-sea', 'house_mereval', 'minstrel']
  },
  'sunken_spire': {
    id: 'sunken_spire',
    term: 'Sunken Spire',
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A ruined, half-submerged cathedral in the deep Bryngloom where Vreken ancestral spirits congregate and the Over-Shanty black market thrives nearby.',
    fullEntry: 'The Sunken Spire is a ruin of unknown origin — a half-submerged stone cathedral sinking slowly into the peat-bogs of the deep Bryngloom. The Vreken treat it as sacred ground, believing their strongest ancestral spirits congregate in its drowned crypts. Nearby, the lawless Over-Shanty has grown in its shadow, a permanent black-market settlement where Neth contracts hold no authority.',
    relatedTerms: ['bryngloom-forest', 'vreken', 'neth']
  },
  'greymark_keep': {
    id: 'greymark_keep',
    term: 'Greymark Keep',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'The ancestral seat of House Thalreth and the center of Frostwood Reach\'s timber civilization, protected by the insulating fog of the Fog Compact.',
    fullEntry: 'Greymark Keep is the seat of House Thalreth and the administrative heart of the Frostwood Reach. A vast timber fortress of petrified ironwood, it houses the ledger-libraries that preserve Thalren bloodlines against the fog\'s memory erosion, the Scribe-Sentinels\' headquarters, and the sealed vault containing the original text of the Fog Compact. The current Lord, Aldren Thalreth, has forgotten the location of a critical ledger — a secret that could doom the entire house.',
    relatedTerms: ['frostwood-reach', 'house_thalreth', 'scribe-sentinels']
  },
  'ironjaw_port': {
    id: 'ironjaw_port',
    term: 'Ironjaw Port',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'The Neth\'s largest external outpost, built into the frozen cliffs where the Bryngloom Forest meets the Iceheart Sea.',
    fullEntry: 'Ironjaw Port is the Neth\'s economic lung — their largest external outpost, built into frozen cliffs where the Bryngloom Forest meets the churning Iceheart Sea. Every trade route between the Bryngloom and the outside world passes through it. The port houses a copy of the First Contract, allowing Neth stationed here to operate without the Fading. The mixed Velun-Kessen council that governs the port has been quietly feuding for two centuries over tariff policy.',
    relatedTerms: ['iceheart-sea', 'neth', 'bryngloom-forest']
  },
  'skald': {
    id: 'skald',
    term: 'Skald',
    type: 'subculture',
    region: 'nordhalla',
    summary: 'The human subculture of Nordhalla — cold-tempered warriors, glacier-keepers, and oral historians who value bloodline purity and cold-resistance above all.',
    fullEntry: 'The Skald are the dominant human bloodline of Nordhalla, shaped by eight centuries of eternal winter into a hardened, cold-tempered people. They are the warrior backbone of House Skalvyr\'s domain — broad-shouldered, frost-scarred, and possessed of a raw physical endurance that other regions find unsettling. Their oral-history traditions produce the finest chroniclers in the north, and their glacier-keep genealogies validate every Skalvyr bloodline claim. They speak Old Nord and value cold-resistance as the primary measure of worth.',
    relatedTerms: ['nordhalla', 'house_skalvyr', 'minstrel']
  },
  'kora': {
    id: 'kora',
    term: 'Kora',
    type: 'historical_figure',
    region: 'bryngloom-forest',
    summary: 'The Veil-Speaker who founded the blood-covenant tradition of death magic that became one half of the Revenant class.',
    fullEntry: 'Kora the Veil-Speaker sacrificed her own life force to keep the ancestral lights of the Bryngloom burning. When the candle-flames that guided the Vreken through the peat-bogs began to dim, Kora fed them her own vitality, converting her blood into luminous death-magic. The curse that followed — the ability to hear the screams of every ancestor whose light she tended — drove her to codify her techniques into the blood-covenant tradition. Her methods were later merged with Vesper\'s frost-stasis art to create the unified Revenant class.',
    relatedTerms: ['revenant', 'bryngloom-forest', 'vreken', 'vesper']
  },
  'vesper': {
    id: 'vesper',
    term: 'Vesper',
    type: 'historical_figure',
    region: 'bryngloom-forest',
    summary: 'The Scribe who founded the frost-stasis tradition, binding his soul to a basalt phylactery to achieve perpetual dying.',
    fullEntry: 'Vesper the Scribe was a Neth archivist who discovered that the bog\'s preserving ichor — the same substance that sustains the First Contract — could be used to arrest the dying process itself. By binding his soul to a carved basalt phylactery, Vesper achieved a state of perpetual dying: neither alive nor dead, sustained by the cold preservation of the deep peat. His techniques were later merged with Kora\'s blood-covenant to create the Revenant class, combining volatile death-magic with frost-stasis resurrection.',
    relatedTerms: ['revenant', 'bryngloom-forest', 'neth', 'kora']
  },
  'orven': {
    id: 'orven',
    term: 'Orven-Sen',
    type: 'historical_figure',
    region: 'bryngloom-forest',
    summary: 'The Kessen probability-weaver who predicted the eruption of Emberspire sixty-three years before it happened — and whose hidden contingency clauses saved millions.',
    fullEntry: 'Orven-Sen was a mid-level Kessen probability-weaver attached to the Ironjaw Port trade delegation. In the Year of the First Ash, he filed a formal prediction that Emberspire would erupt within a century. He was fined for filing a frivolous prediction and died forty years later without seeing it come true. Sixty-three years after his death, Emberspire erupted — and his quietly inserted contingency clauses in three generations of warmth-resource contracts saved the Neth an estimated four million gold-weight in renegotiation costs.',
    relatedTerms: ['neth', 'bryngloom-forest', 'emberspire']
  },
  'elias': {
    id: 'elias',
    term: 'Elias',
    type: 'historical_figure',
    region: 'bryngloom-forest',
    summary: 'A co-founder of the Inquisitor tradition who developed the ritual frameworks for severing magical contracts and binding fiends.',
    fullEntry: 'Elias was a scholar of the Bryngloom who recognized that the same legal precision the Neth used to write contracts could be inverted to dismantle them. Where the Velun built binding clauses, Elias built severance clauses — ritual frameworks capable of identifying, disrupting, and annulling magical contracts of any complexity. His work became the foundation of the Inquisitor tradition, enabling witch-hunters to sever the bonds between rogue mages and their contracted powers.',
    relatedTerms: ['inquisitor', 'bryngloom-forest', 'neth']
  },

  // ============================================================
  // NOBLE HOUSES (continued)
  // ============================================================

  'house_mereval': {
    id: 'house_mereval',
    term: 'House Mereval',
    type: 'noble_house',
    region: 'iceheart-sea',
    summary: 'The seafaring noble family of the Iceheart Sea who traded calm waters for perpetually unfreezing sea-lanes, binding the ocean to never rest.',
    fullEntry: 'House Mereval rules the great, churning expanse of the Iceheart Sea. When their ancestors faced the freezing of the oceans during the Deepening, they bargained for navigable sea-lanes that would never freeze. The Warden accepted, but the price was the ocean\'s peace: the Iceheart would never sleep. Storm-cycles are now perpetual, and the sea must be fought as much as navigated. Their descendants rule from Merrowport, a floating city anchored to a warm submarine volcano, maintaining the trade routes that connect all seven regions. Spindrift Lagoon, the warm-water coral port tended by the Breakers-Born Myrathil, and the Deepwell Archipelago, the hidden underwater chain of Myrathil cave-cities, serve as the house\'s key southern and deep-water ports.',
    relatedTerms: ['iceheart-sea', 'merrowport', 'minstrel', 'spindrift_lagoon', 'deepwell_archipelago', 'kelpies_cove']
  },
  'house_tesshan': {
    id: 'house_tesshan',
    term: 'House Tesshan',
    type: 'noble_house',
    region: 'cragjaw-peaks',
    summary: 'The mountain lords of the Cragjaw Peaks who traded visibility for a perpetual blizzard to hide their highland keeps from starving lowlanders.',
    fullEntry: 'House Tesshan rules the vertical labyrinth of the Cragjaw Peaks, where the eternal blizzard hides their fortress-keeps from the starving lowland riders. Their bargain traded spatial visibility for protective snow-veil — a dense, permanent whiteout that buries all natural landmarks. Their descendants survive through the Groven\'s Ancestor-Spans, the only thoroughfares above the blizzard line. The Tesshan value altitude as status and concealment as currency. Deepchasm Keep, the fortress spanning the great mountain fissure, controls the only reliable passage between upper peaks and lower galleries and serves as the house\'s most strategically vital installation.',
    relatedTerms: ['cragjaw-peaks', 'frostmaw_holdfast', 'groven', 'deepchasm_keep', 'gearworks_gulch', 'frostmaw_massif']
  },
  'house_ordavan': {
    id: 'house_ordavan',
    term: 'House Ordavan',
    type: 'noble_house',
    region: 'sundrift-vale',
    summary: 'The nomadic noble family of the Sundrift Vale who traded fertile soil for the endless migration, ensuring the steppe grass always returns to feed the great woolly herds.',
    fullEntry: 'House Ordavan governs the wind-swept, starless steppe of the Sundrift Vale. Their bargain traded fertile soil for the endless migration — the grass will always return, but nothing deeper than grass can take root. Their descendants follow the woolly herds in perpetual nomadic cycles, navigating by the hum of ancestral burial mounds. The Ordavan are increasingly puppeteered by the Unlit Veil, whose "advisors" have embedded themselves at every level of governance. The Kumis Downs, rolling grasslands in the southern steppe, serve as the primary gathering grounds for the Ordavan clan-meets where migration routes are negotiated and bloodline disputes are settled.',
    relatedTerms: ['sundrift-vale', 'synod_hold', 'astril', 'kumis_downs', 'ancestor_wold', 'starfall_vale']
  },
  'house_morrath': {
    id: 'house_morrath',
    term: 'House Morrath',
    type: 'noble_house',
    region: 'bryngloom-forest',
    summary: 'The seventh and most mysterious of the binding houses, who rule the Bryngloom Forest. Unique among the houses: they had nothing left to trade, so they borrowed their survival from the Neth.',
    fullEntry: 'House Morrath is the ghost among houses — the seventh noble family named in the Binding Compact, yet the one with the least surviving record. When the six other houses marched their firstborn to the northern peaks to satisfy Keth-Amar, Morrath had nothing left to trade that Keth-Amar would accept. Their survival was instead borrowed from the Neth — the scribe-clan who had already struck their own legalistic contract with the Keeper of the Last Threshold. This has produced a permanent tension: the Morrath are a noble house whose authority is mediated through the Neth\'s contract-law, making them simultaneously sovereign and subordinate, a contradiction that has defined the Bryngloom\'s politics for eight centuries. Morren\'s Bogpost, the trading outpost at the forest-steppe edge, exemplifies the Morrath strategy of financial entanglement — generous credit, compounding interest, and permanent economic leverage over every trading partner.',
    relatedTerms: ['bryngloom-forest', 'neth', 'keth_amar', 'morrens_bogpost', 'black_fen', 'widows_quagmire']
  },

  // ============================================================
  // MISSING RACE ENTRIES
  // ============================================================

  'myrathil': {
    id: 'myrathil',
    term: 'Myrathil',
    type: 'race',
    region: 'iceheart-sea',
    summary: 'A bioluminescent sea-born people spawned from volcanic foam, with webbed fingers and ocean-blue eyes, divided into shore-dwelling Breakers-Born, abyssal Deep-Born, and inland River-Fed.',
    fullEntry: 'The Myrathil are the Sea-Foam Born — a people whose origin lies in the moment Emberspire erupted and bled volcanic fury into the frozen oceans. The interaction of magma with seawater spawned the first Myrathil from bioluminescent foam. Their skin shifts color with mood, their eyes are the deep blue of ocean trenches, and their fingers are webbed for swimming. They are divided into the diplomatic Breakers-Born (shore-dwellers), the mystical Deep-Born (abyssal pressure-forgers), and the exploratory River-Fed (inland swimmers who trade ocean-depth for freshwater mobility).',
    relatedTerms: ['iceheart-sea', 'emberspire', 'merrowport']
  },
  'groven': {
    id: 'groven',
    term: 'Groven',
    type: 'race',
    region: 'cragjaw-peaks',
    summary: 'Humanoid bridge-trolls of the Cragjaw Peaks, alchemically forged from Thrumm blood by Fexric Deep Alchemists, who shattered their vats and rose in the Vat-Breakers\' revolt.',
    fullEntry: 'The Groven were not born — they were made. Eight hundred years ago, Fexric Deep Alchemists captured Thrumm broodlings and submerged them in alchemical serums beneath Frostmaw Crag, creating a race of servitors with smoothed stone-hide and extended limbs. The first generation developed will, then language. They shattered their containment vats and rose against their creators in the Vat-Breakers\' revolt, claiming the Ancestor-Spans as their homeland. Divided into the heavy-scaled Morgh and the long-limbed Ithran, the Groven now serve as the Cragjaw\'s bridge-builders, growing calcified spans from the bones of their willing dead.',
    relatedTerms: ['cragjaw-peaks', 'fexrick', 'frostmaw_holdfast', 'deep_alchemists']
  },
  'fexrick': {
    id: 'fexrick',
    term: 'Fexrick',
    type: 'race',
    region: 'cragjaw-peaks',
    summary: 'The oldest continuous civilization on Mythrill — goblinoid engineers whose guilds built the world\'s geothermal infrastructure and who accidentally created both the Groven and themselves.',
    fullEntry: 'The Fexrick are the engineering heart of the known world — goblinoid guild-masters whose geothermal pipes, steam-roads, and turbine wheels form the connective infrastructure that links all seven regions. They predate every other race, having emerged from the deep caverns millennia before humans discovered fire. An accident in the alchemical vats that created the Groven also produced the Fexrick themselves — chemical runoff that coalesced into a new form of life. Divided into the guild-bound Kethrin and the free-roaming Drall clan nomads, the Fexrick speak Fexric and sing maintenance-songs to their machines.',
    relatedTerms: ['cragjaw-peaks', 'groven', 'deep_alchemists', 'frostmaw_holdfast']
  },

  // ============================================================
  // MISSING CONCEPTS
  // ============================================================

  'silent_seventh': {
    id: 'silent_seventh',
    term: 'The Silent Seventh',
    type: 'concept',
    region: 'sundale',
    summary: 'The unexplained mystery of the Binding Compact: one of the seven noble houses stands silent in every record, its name struck from history for a refusal whose nature remains unknown.',
    fullEntry: 'Among the seven noble houses that struck the Binding Compact, one stands silent — its entry in every ledger and contract-hall reduced to a blank line where a name should be. The surviving six houses (Thalreth, Skalvyr, Tesshan, Solvan, Mereval, Ordavan, Morrath) are publicly recorded, but scholars have noted that Morrath\'s records are unusually sparse. The truth is likely that House Viridane — the eighth house, erased for refusing the Dark Bargains — was originally the seventh binding house, and Morrath was a late replacement who borrowed their survival from the Neth rather than striking their own bargain. None of the six surviving houses will confirm or deny this, and Scribe-Sentinels who have researched the matter have a habit of disappearing into the fog.',
    relatedTerms: ['house_morrath', 'briaran', 'keth_amar', 'the_warden']
  },
  'damon': {
    id: 'damon',
    term: 'Damon',
    type: 'historical_figure',
    region: 'sundale',
    summary: 'The Emberth smith who founded the Spellguard tradition, developing the art of identifying and neutralizing magical threats near the volatile Solbrand.',
    fullEntry: 'Damon was a master Emberth smith in the forge-caldera keeps of Sundale, working in close proximity to the Solbrand. The imprisoned star\'s resonance occasionally erupted in unpredictable magical bursts — dangerous for the forge-clans who worked nearby. Damon developed the first systematic method for detecting, analyzing, and dismantling incoming magical energy before it could manifest. His techniques became the foundation of the Spellguard tradition: practitioners who treat magical defense as an engineering discipline rather than an artistic one.',
    relatedTerms: ['spellguard', 'sundale', 'emberth', 'solbrand']
  },

  // ============================================================
  // LOCATIONS
  // ============================================================

  'emberspire': {
    id: 'emberspire',
    term: 'Emberspire',
    type: 'location',
    region: 'sundale',
    summary: 'The world-heart volcano of Sundale — the volcanic caldera beneath which the dying star Sol was bound by the seven noble families during the Great Breach.',
    fullEntry: 'Emberspire is the single most consequential geological feature in the known world: a massive active volcano in the heart of Sundale whose caldera plunges to depths no expedition has survived. It was into this volcanic throat that House Solvan and the other six noble families lowered the binding seal — woven from the flayed essence of Aex — to imprison the dying star Sol beneath the crust. The Emberspire has burned without interruption for eight centuries, fed by the imprisoned star\'s fading radiance. The Emberth forge-clans build their keeps in its shadow, harvesting geothermal heat for their forges and rituals. The Dawn Vigil believes the Emberspire\'s magma chamber connects to the Sundered Monolith fragments scattered across the continent, and that reassembling them would restart Sol within the caldera.',
    relatedTerms: ['sundale', 'house_solvan', 'solbrand', 'emberth', 'dawn_vigil', 'aex', 'keth_amar']
  },

  // ============================================================
  // NOBLE HOUSES — Missing
  // ============================================================

  'house_viridane': {
    id: 'house_viridane',
    term: 'House Viridane',
    type: 'noble_house',
    region: 'frostwood-reach',
    summary: 'The erased eighth noble house that refused the Dark Bargains — stricken from every record for their defiance, their descendants surviving as the thorn-blooded Briaran.',
    fullEntry: 'House Viridane was the eighth noble family of the pre-Breach world — and the only one that refused to participate in the Dark Bargains when Keth-Amar demanded capitulation. Where the seven surviving houses traded memory, summer, visibility, or heirs, Viridane chose defiance. The cost was absolute: their name was struck from every ledger, every contract, every record. Their holdings were distributed among the cooperating houses. Their bloodline was declared legally nonexistent. But the Viridane survived. Retreating into the deepest ironwood groves of the Frostwood Reach, they maintained a spiritual contract with the fae of the deep forest — a pact older than the noble houses themselves. Over centuries, the contract changed their bloodline. Their children grew thorns from their forearms. Their eyes shifted to the green of deep canopy. They became the Briaran — the thorn-blooded descendants who carry the Unwritten Word, a truth-sense that detects spoken lies. House Viridane is not dead. It is simply unwritten.',
    relatedTerms: ['briaran', 'frostwood-reach', 'house_thalreth', 'keth_amar', 'silent_seventh']
  },

  // ============================================================
  // CONCEPTS & ENTITIES
  // ============================================================

  'root_veil': {
    id: 'root_veil',
    term: 'Root-Veil',
    type: 'concept',
    region: 'bryngloom-forest',
    summary: 'The vast mycelial network beneath the Bryngloom Forest — a living entity the Vreken worship as a sacred ancestor. The Neth know it by another name: the Keeper of the Last Threshold.',
    fullEntry: 'The Root-Veil is the ancient, continent-spanning mycelial network that underlies the Bryngloom Forest. Neither plant nor animal, the Root-Veil is a living intelligence that predates the Wyrd and the Breach — a biological substrate that has been absorbing and recycling the dead for longer than any race has kept records. The Vreken, who predate the Neth in the Bryngloom, worship the Root-Veil as a sacred ancestor — the living memory of every organism the forest has ever absorbed. The Neth ancestors perceived the same entity differently: they called it the Keeper of the Last Threshold, the death-boundary guardian, and approached it with a legalistic proposition. If the Keeper would sustain their bodies and halt their decay, the Neth would serve as its record-keepers, cataloguing every organism the mycelium absorbed. The contract was struck. The Neth received silver skin and stilled breath; the Keeper received the most meticulous biological archive in the known world. Whether the Root-Veil and the Keeper are the same entity viewed through different theological lenses, or two distinct intelligences sharing the same substrate, is a matter of bitter theological dispute between the Vreken and the Neth that has never been resolved.',
    relatedTerms: ['neth', 'vreken', 'bryngloom-forest', 'atropolis', 'keeper_of_the_last_threshold']
  },

  'thrumm': {
    id: 'thrumm',
    term: 'Thrumm',
    type: 'race',
    region: 'cragjaw-peaks',
    summary: 'The primordial ancestor-species from which the Groven were alchemically created — regenerative, slow-witted tunnel-dwellers still hunted by Deep Alchemists for experimentation.',
    fullEntry: 'The Thrumm are the ancestral root-stock from which the Groven were engineered. Before the Fexric Deep Alchemists began their experiments, the Thrumm were the dominant tunnel-dwelling species of the Cragjaw Peaks — large, powerfully built, and possessed of a supernatural regenerative capacity that allowed them to survive injuries that would kill any other creature. They were not warlike. They were not ambitious. They ate, they bred, they slept, and they healed. It was this combination of physical resilience and intellectual docility that made them perfect subjects for the Deep Alchemists\' transformation vats. Eight hundred years ago, the Alchemists captured hundreds of Thrumm broodlings and submerged them in alchemical serums, accelerating their cognitive development, hardening their skin into stone-scale, and extending their limbs for tool use. The result was the Groven. The Thrumm who were not captured still inhabit the deepest tunnels, but their numbers are dwindling. The Deep Alchemists continue to harvest fresh broodlings when they can find them, and reports from the lower sumps suggest the practice has not stopped.',
    relatedTerms: ['groven', 'fexrick', 'deep_alchemists', 'frostmaw_holdfast', 'cragjaw-peaks']
  },

  'deep_alchemists': {
    id: 'deep_alchemists',
    term: 'Deep Alchemists',
    type: 'faction',
    region: 'cragjaw-peaks',
    summary: 'The most dangerous sub-faction of the Fexrick — cold methodical experimenters who created the Groven from Thrumm blood and continue their work in sealed vat-laboratories beneath Frostmaw Crag.',
    fullEntry: 'The Deep Alchemists are the oldest continuous research organization on Mythrill. Predating the Dark Bargains by millennia, they were refining living matter in the deep tunnels before humans discovered fire. Eight hundred years ago they captured Thrumm broodlings and forged the Groven — a race of servitors intended for manual labor. The first generation developed will, then language, then rebellion. The Vat-Breakers\' revolt shattered the Alchemists\' surface operations, but the guild retreated into sealed vat-laboratories beneath Frostmaw Crag and never stopped working. Their current project — the Lost Brood — involves Thrumm and partially-transformed Groven who have been in their vats for seven centuries. The Alchemists believe the Wyrd itself can be refined, distilled, and injected to create a new form of life that transcends both organic and Wyrd biology.',
    relatedTerms: ['fexrick', 'groven', 'thrumm', 'frostmaw_holdfast', 'vat_breakers_guild']
  },

  'keeper_of_the_last_threshold': {
    id: 'keeper_of_the_last_threshold',
    term: 'Keeper of the Last Threshold',
    type: 'concept',
    region: 'bryngloom-forest',
    summary: 'The entity with whom the Neth struck the First Contract — a death-threshold guardian that enforces all binding agreements in exchange for the preservation of the contracting parties.',
    fullEntry: 'The Keeper of the Last Threshold is the metaphysical entity that enforces the Neth\'s contract system. Neither god nor spirit, the Keeper exists at the boundary between life and death — the last threshold any soul must cross. When the Neth ancestors sought to preserve themselves against the Fading, it was the Keeper they approached, offering to serve as the eternal record-keepers of all contracts in exchange for the preservation of their bodies. The Keeper accepted. Every Neth contract is enforced by the Keeper\'s authority: broken agreements trigger the Debt-Revenant, honored agreements extend the Fading deadline, and the most sacred oaths are sealed with the Keeper\'s own mark. The Drun — Neth who have severed all contracts — are invisible to the Keeper, existing in a state of legal non-existence that is simultaneously freedom and exile.',
    relatedTerms: ['neth', 'bryngloom-forest', 'debt_revenant', 'root_veil']
  },

  'vault_breath': {
    id: 'vault_breath',
    term: 'Vault-Breath',
    type: 'concept',
    region: 'sundale',
    summary: 'The Emberth discipline of absolute stillness and thermal conservation — a meditative practice that minimizes heat loss in the volcanic depths of the Harath-Vault.',
    fullEntry: 'Vault-Breath is the foundational Emberth discipline — a meditative practice of absolute physical stillness developed to conserve body heat in the geothermal depths of the Harath-Vault. Practitioners learn to slow their metabolism, reduce their movement to micro-adjustments, and synchronize their breathing with the volcanic vent cycles. At its highest level, Vault-Breath allows an Emberth to enter a state of suspended animation indistinguishable from death — no heartbeat, no breath, no heat signature. The Korr Sun-Speakers use this state during their sacred meditations, while the Thrask rangers employ it for ambush hunting in the cinder badlands.',
    relatedTerms: ['emberth', 'sundale', 'harath_vault']
  },

  'dawn_vigil': {
    id: 'dawn_vigil',
    term: 'Dawn Vigil',
    type: 'faction',
    region: 'sundale',
    summary: 'The most militant of the Solvarn restoration factions — a fighting order that believes the Sundered Monoliths can be reassembled to restart the imprisoned star Sol.',
    fullEntry: 'The Dawn Vigil is the expeditionary sword-arm of the Solvarn restoration movement. Founded in Year 340 of the Dimming by a Martyr who could feel every Monolith fragment\'s location across the continent, the Vigil dispatches small bands of Solvarn Martyrs, Pyrofiends, and Augurs into every region to recover Sundered Monolith fragments by any means necessary. Their sigil is a rising sun pierced by obsidian. Publicly, they serve House Solvan as an officially deniable military force. Privately, the Vigil\'s inner council has calculated that reassembling the Monoliths will not restart Sol — it will summon Keth-Amar back to finish what it started. They continue the expeditions not for restoration, but to ensure no one else assembles them first.',
    relatedTerms: ['house_solvan', 'sundale', 'emberspire', 'solbrand', 'keth_amar']
  },

  'vat_breakers_guild': {
    id: 'vat_breakers_guild',
    term: 'Vat-Breakers\' Guild',
    type: 'faction',
    region: 'cragjaw-peaks',
    summary: 'The governing body of the Groven, founded by the first generation who shattered their containment vats and rose against the Deep Alchemists in the revolt that freed their people.',
    fullEntry: 'The Vat-Breakers\' Guild is the governing body of Groven civilization — founded by the first generation of transformed Groven who shattered their alchemical containment vats and rose against their Fexric creators. The Guild maintains the Ancestor-Spans (bridges grown from the calcified bones of willing Groven dead), adjudicates Groven law, and patrols the lower tunnels for signs of renewed Deep Alchemist experimentation. Their headquarters in Frostmaw Holdfast houses the calcified skeleton of the first foreman — the Groven who shattered the first vat — her outstretched hand forming the keystone of the main Ancestor-Span. The Guild secretly maintains an archive of stolen Fexric alchemical formulae, including one that may reverse calcification entirely.',
    relatedTerms: ['groven', 'deep_alchemists', 'frostmaw_holdfast', 'house_tesshan', 'thrumm']
  },

  // ============================================================
  // NEW LOCATIONS — Regional Expansion (Aquatic, Mountain, Wasteland Terrain)
  // ============================================================

  // FROSTWOOD REACH — New Locations
  'wraithfen': {
    id: 'wraithfen',
    term: 'Wraithfen',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'A fog-drowned fen on the eastern border where Mimir Unwoven wander without masks, their forms dissolving in the mist.',
    fullEntry: 'The Wraithfen is a liminal place where the Frostwood Reach\'s protective fog becomes something else — thicker, warmer, and seemingly alive. The Unwoven Mimir who drift through its depths have abandoned their masks entirely, allowing their forms to blur and shift with the mist. Thalren trappers give the fen a wide berth. Those who enter too deep return speaking languages that no living scholar can identify, their memories contaminated with impressions of lives they never lived.',
    relatedTerms: ['frostwood-reach', 'mimir', 'gref']
  },
  'mistbarrow': {
    id: 'mistbarrow',
    term: 'Mistbarrow',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'An ancient burial mound predating House Thalreth, shrouded in fog so dense it has its own weather.',
    fullEntry: 'Mistbarrow is one of the Frostwood Reach\'s deepest mysteries — a burial mound that predates every known civilization in the region. The barrow is encased in fog so permanent and so dense that it generates its own microclimate: rain falls inside the fog-bubble even when the surrounding forest is dry. Expeditions have recovered amber tablets inscribed with unknown script and corroded bronze masks of workmanship that surpasses any known Thalren or Mimir craft. The Forgotten Archivists of the Ledger Halls have petitioned House Thalreth for a full excavation for three centuries.',
    relatedTerms: ['frostwood-reach', 'greymark_keep', 'gallows_wood']
  },
  'greythorn_copse': {
    id: 'greythorn_copse',
    term: 'Greythorn Copse',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'A fortified copse of ironwood jointly maintained by Thalren timber-wardens and Briaran thorn-tenders on the eastern trade route.',
    fullEntry: 'Greythorn Copse is a living fortress — a copse of deliberately tangled ironwood trees grown into a defensive wall by generations of Briaran horticulture and maintained by Thalren timber-wardens. The "Grey" in its name connects it to Greymark; the "Thorn" is pure Briaran influence. It serves as the primary waystation between Greymark Keep and the eastern fens, and its single watched gate funnels all trade through a customs post where both races collect tolls.',
    relatedTerms: ['frostwood-reach', 'briaran', 'house_thalreth']
  },
  'drunhold': {
    id: 'drunhold',
    term: 'Drunhold',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'A small woodcutter village of the Frostwood Reach, sitting on the ancient trade routes that stitch the Reach together.',
    fullEntry: 'Drunhold is one of the small ironwood-cutting villages that straggle along the old trade routes of the Frostwood Reach. Its woodcutters work the sacred ironwood groves under strict Thalren quota — a tension that has seeded generations of logger folklore about the forest vengeance (the Grimmstalk myth among them). Crossroad spirits like the Gref are drawn to Drunhold thresholds, where strong partings and forgotten oaths leave the heaviest trails.',
    relatedTerms: ['frostwood-reach', 'grimmwood', 'gallows_wood']
  },
  'grimmwood': {
    id: 'grimmwood',
    term: 'Grimmwood',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'The oldest heart of the Frostwood Reach — a stand of ironwood and pine that has stood for ten thousand years, dense enough to swallow loggers whole.',
    fullEntry: 'Grimmwood Proper is the ancient core of the Frostwood Reach, where the ironwood and pine have stood for ten thousand years and the canopy admits no light at all. It is treated by the woodcutters of Drunhold with terror rather than ambition: the Grimmstalks — feather-skulled canopy-guardians born of logger guilt — dwell exclusively in its highest branches, and travelers who lose the trail in the silent Grimmwood are rarely recovered. The Briaran claim the Grimmwood as untouchable rootland; the Thalren ledger-wards mark its edge and go no further.',
    relatedTerms: ['frostwood-reach', 'drunhold', 'briaran', 'gallows_wood']
  },
  'siltmire_flats': {
    id: 'siltmire_flats',
    term: 'Siltmire Flats',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'A stretch of the Frostwood Reach where ancient peat has turned the standing water to thick black soup — hunting ground of the Oillipheist.',
    fullEntry: 'The Siltmire Flats are a low, boggy reach of the Frostwood where ten thousand years of peat have turned the standing water into a thick, black, deceptive soup — deep enough to swallow a man, warm enough in rare summer to slow the cold-blooded things that live in it. It is the named hunting ground of the Oillipheist, the blind silt-leech serpent, and Frostwood parents use the Flats as the backdrop for every warning-tale about drowning in dark water. Trade routes skirt the Flats by a wide margin; only peat-cutters and the desperate go near.',
    relatedTerms: ['frostwood-reach', 'drunhold', 'gallows_wood']
  },
  'bramble_heath': {
    id: 'bramble_heath',
    term: 'Bramble Heath',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'Open thorn-covered heathland at the forest edge, patrolled by Briaran rangers tending the living boundary-walls.',
    fullEntry: 'The Bramble Heath marks where the ironwood canopy finally breaks and the fog thins for the first time. It is a savage, beautiful landscape — crimson thorn-flowers bloom year-round in soil nourished by centuries of blood, and the Briaran rangers who patrol here cultivate the thorn-barriers as both defense and art. The heath is the Briaran\'s most visible territorial claim in the Reach, and they defend it with a ferocity that surprises those who underestimate the quiet, plant-tending folk.',
    relatedTerms: ['frostwood-reach', 'briaran', 'pooka']
  },
  'skalds_landing': {
    id: 'skalds_landing',
    term: "Skald's Landing",
    type: 'location',
    region: 'frostwood-reach',
    summary: 'A Skald trading post on the northern river where Nordhalla longships dock to exchange cold-iron and whale oil for ironwood timber.',
    fullEntry: 'Skald\'s Landing is the primary cultural exchange point between the Frostwood Reach and Nordhalla — a small but vital settlement where Norse-style timber longhouses sit incongruously among Thalren peat-stone architecture. The Skald traders bring cold-iron, whale oil, and glacier ice south; they return with ironwood timber, heartwood resin, and Mimir-crafted storm-glass. The cultural friction is constant but productive — both peoples respect stoicism and oral tradition.',
    relatedTerms: ['frostwood-reach', 'nordhalla', 'house_thalreth', 'house_skalvyr']
  },
  'the_shifting_fen': {
    id: 'the_shifting_fen',
    term: 'The Shifting Fen',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'A Mimir-held fen that physically changes position with the seasons, tended by Mist-Woven sentinels.',
    fullEntry: 'The Shifting Fen is the Mist-Woven Mimir\'s domain — a stretch of bogland that literally rearranges itself with the turning of the year. Paths that were solid ground last month are impassable mire today; new clearings open where dense marsh stood before. The Mist-Woven claim the fen is a living test of perception, rewarding those who do not rely on memory and punishing those who trust old maps. It is both a sacred site and a practical training ground for the Mimir\'s most dangerous operatives.',
    relatedTerms: ['frostwood-reach', 'mimir']
  },
  'mirror_mere': {
    id: 'mirror_mere',
    term: 'Mirror Mere',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'A perfectly still lake settlement where Mask-Borne Mimir test their reflections against their masks to verify their identity holds.',
    fullEntry: 'Mirror Mere is the spiritual center of the Mask-Borne Mimir — a perfectly still lake that reflects not just the present but ripples with echoes of the near future. The Mimir built their settlement around it as both anchor and oracle, using the lake\'s reflections to verify their identities against the fog\'s erosion and to divine coming events. The mere never ripples, even in storm weather, and the Mimir believe it is conscious — that it watches and remembers everything it reflects.',
    relatedTerms: ['frostwood-reach', 'mimir', 'rite-of-masks']
  },

  // NORDHALLA — New Locations
  'ymirs_col': {
    id: 'ymirs_col',
    term: "Ymir's Col",
    type: 'location',
    region: 'nordhalla',
    summary: 'A treacherous mountain pass between glacier-capped peaks, named for the frost giant of Skald legend.',
    fullEntry: 'Ymir\'s Col is the most dangerous pass in Nordhalla — a wind-scoured gap between two peaks where the air moves fast enough to strip flesh from bone. Named for the frost giant of Skald pre-Binding mythology, the col is marked by cairns of frozen corpses, their expressions preserved in perfect, screaming clarity. Only the Skald Ice-Trackers can navigate it safely, and even they lose people every year.',
    relatedTerms: ['nordhalla', 'house_skalvyr', 'stel']
  },
  'vargtor': {
    id: 'vargtor',
    term: 'Vargtor',
    type: 'location',
    region: 'nordhalla',
    summary: 'A watchtower settlement atop a rocky tor rising above the glacier line, garrisoned by Skald Ice-Trackers.',
    fullEntry: 'Vargtor — Wolf-Tor in the Old Nord tongue — is a military garrison built atop a natural granite pillar that rises two hundred feet above the glacier line. Wolves gather at its base every winter, drawn by some affinity the Skald cannot explain but do not question. The garrison commands the eastern approaches to the Frozen Archive and serves as the first line of defense against Corvani raiding parties and glacier wyrms. In the tor\'s deepest chambers, runic carvings predating the Skald by centuries have drawn the attention of Rime-Born Rune Keepers.',
    relatedTerms: ['nordhalla', 'house_skalvyr', 'rime_born']
  },
  'frostcirque': {
    id: 'frostcirque',
    term: 'Frostcirque',
    type: 'location',
    region: 'nordhalla',
    summary: 'A glacial hollow high in the mountains where the Rime-Born perform their oldest rituals — the freezing of memory into ice.',
    fullEntry: 'Frostcirque is sacred ground to the Rime-Born — a natural amphitheater carved by ancient glaciers where the ice walls are covered in runic script so old that even the Skald Keepers cannot read it. The Rime-Born perform their Memory-Freezing rites here, preserving their most important experiences in blocks of glacier ice that are stored in the cirque walls for eternity. The air in Frostcirque is absolutely still — a quality that even the constant Nordhalla wind respects.',
    relatedTerms: ['nordhalla', 'rime_born']
  },
  'the_still_crag': {
    id: 'the_still_crag',
    term: 'The Still Crag',
    type: 'location',
    region: 'nordhalla',
    summary: 'A cliff face perpetually frozen in absolute silence, where the Rime-Born claim the Warden\'s breath touched the mountain.',
    fullEntry: 'The Still Crag is one of Nordhalla\'s most unsettling landmarks — a cliff face where no wind blows, no sound carries, and the ice sculptures of unknown figures stand frozen in attitudes of supplication. The Rime-Born believe the crag is where the Warden\'s breath physically touched the mountain during the Glacier Bargain, freezing everything it touched into permanent, silent witness. The sculptures are not carved — they appear to have been people, caught mid-gesture by something that stopped time itself.',
    relatedTerms: ['nordhalla', 'rime_born', 'the_warden']
  },
  'rooks_promontory': {
    id: 'rooks_promontory',
    term: "Rook's Promontory",
    type: 'location',
    region: 'nordhalla',
    summary: 'A high cliff over the frozen sea where the Corvani gather in vast, dark congregations to read prophecy in raven-flight.',
    fullEntry: 'Rook\'s Promontory is the Corvani\'s most sacred site in Nordhalla — a black obsidian cliff jutting over the frozen sea where ravens gather in thousands, their flight patterns interpreted as living prophecy by the Corvani shamans. The cliff is cold even by Nordhalla standards, and the Corvani dwellings carved into its face are accessible only to those who can fly or climb without rope. The Skald consider the promontory cursed; the Corvani consider it home.',
    relatedTerms: ['nordhalla', 'corvani']
  },
  'the_black_firth': {
    id: 'the_black_firth',
    term: 'The Black Firth',
    type: 'location',
    region: 'nordhalla',
    summary: 'A long, narrow inlet flanked by obsidian cliffs where the black water reflects like a dark mirror.',
    fullEntry: 'The Black Firth is a long, narrow sea inlet flanked by obsidian cliffs hundreds of feet high — a natural corridor of black stone and blacker water. The firth is the Skald\'s primary naval route to the Iceheart Sea, navigated by starlight since no sunlight has penetrated its depths in eight centuries. The water is perfectly still and perfectly reflective, showing a mirror-image of the cliffs that is indistinguishable from reality. Sailors report seeing things in the reflection that do not exist above the waterline.',
    relatedTerms: ['nordhalla', 'house_skalvyr']
  },

  // SUNDALE — New Locations
  'sols_anvil_mesa': {
    id: 'sols_anvil_mesa',
    term: "Sol's Anvil Mesa",
    type: 'location',
    region: 'sundale',
    summary: 'A massive flat-topped mountain where Solvarn sun-priests hold ceremonies during rare moments of volcanic clarity.',
    fullEntry: 'Sol\'s Anvil Mesa is the spiritual high ground of Sundale — a massive basalt mesa whose flat surface has been carved with solar calendars, prophecy charts, and genealogical records stretching back to the Binding. When the volcanic haze clears enough to glimpse the buried sun\'s residual glow, Solvarn sun-priests ascend the mesa to conduct their holiest ceremonies. The mesa appears to float above the ashlands due to heat-shimmer, creating the illusion that it has been lifted toward the sun it worships.',
    relatedTerms: ['sundale', 'house_solvan', 'solbrand']
  },
  'the_ashen_escarpment': {
    id: 'the_ashen_escarpment',
    term: 'The Ashen Escarpment',
    type: 'location',
    region: 'sundale',
    summary: 'A long, steep slope of compacted volcanic ash forming Sundale\'s natural border, dotted with Solvarn watchtowers.',
    fullEntry: 'The Ashen Escarpment is Sundale\'s defensive wall — a miles-long ridge of compacted volcanic ash that rises sharply from the lowland approaches. Solvarn watchtowers dot the rim, their eternal signal-fires burning with heartwood resin and visible across the ashlands. The escarpment is treacherous to climb — the ash is packed hard as stone in places, but a wrong step can send a traveler sliding into glass-scarred gullies. It serves as both natural fortification and pilgrimage route for those approaching Emberspire from the lowlands.',
    relatedTerms: ['sundale', 'house_solvan', 'dawn_vigil']
  },
  'cinderhoodoo': {
    id: 'cinderhoodoo',
    term: 'Cinderhoodoo',
    type: 'location',
    region: 'sundale',
    summary: 'A cluster of fire-scorched rock spires on the ash plain, used as navigational landmarks by Thrask Emberth rangers.',
    fullEntry: 'Cinderhoodoo is a forest of rock spires rising from the ash plain like grasping fingers — each hoodoo crowned with a cap of harder stone that protects the softer pillar beneath. Some caps have melted and re-fused into grotesque, face-like shapes that change expression depending on the angle of the volcanic light. Thrask Emberth rangers use the hoodoos as navigational landmarks and shelter from the soot-storms, and the formations are slowly being adopted as sacred sites by a growing Pyrofiend cult.',
    relatedTerms: ['sundale', 'emberth', 'pyrofiend']
  },
  'ember_lagoon': {
    id: 'ember_lagoon',
    term: 'Ember Lagoon',
    type: 'location',
    region: 'sundale',
    summary: 'Sundale\'s only port — a warm saltwater lagoon heated by volcanic vents where Emberth and Merryn traders coexist.',
    fullEntry: 'Ember Lagoon is Sundale\'s lifeline to the outside world — the only harbor where the water does not freeze, warmed perpetually by volcanic vents beneath the seabed. The lagoon glows orange-red at night, earning it the Merryn nickname "the Boiling Door." It is a rare point of genuine cooperation between Emberth, Solvarn, and Merryn — the Emberth control the port infrastructure, the Solvarn maintain the shrine to Sol on the eastern cliff, and the Merryn operate the shipping lanes. Three cultures, one harbor, constant tension, constant profit.',
    relatedTerms: ['sundale', 'emberth', 'house_solvan']
  },

  // ICEHEART SEA — New Locations
  'kelpies_cove': {
    id: 'kelpies_cove',
    term: "Kelpie's Cove",
    type: 'location',
    region: 'iceheart-sea',
    summary: 'A smuggler\'s inlet hidden behind ice-shoals, marked by bioluminescent lanterns.',
    fullEntry: 'Kelpie\'s Cove is the Iceheart Sea\'s most notorious black-market port — a sheltered inlet hidden behind a wall of grinding ice-shoals that only the most skilled Merryn pilots can navigate. Named for the phantom sea-horse said to lure ships onto the rocks, the cove is where contraband from every region changes hands without questions. Drun outcasts from the Bryngloom maintain a permanent presence here, running the memory-trade alongside traditional smuggling.',
    relatedTerms: ['iceheart-sea', 'house_mereval', 'neth']
  },
  'wraithsound': {
    id: 'wraithsound',
    term: 'Wraithsound',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'A wide, deep inlet where the echoes of drowned sailors carry for miles and the water is said to listen.',
    fullEntry: 'Wraithsound is a place the Merryn navigate only with Myrathil guides — a wide, deep inlet perpetually shrouded in sea-mist where the echoes of the drowned carry for miles. The Myrathil Deep-Born claim the sound is alive — that it listens, remembers, and occasionally speaks in the voices of those it has swallowed. Ships that enter without a guide emerge with crews who refuse to describe what they heard, or worse — crews who speak only in the voices of the dead.',
    relatedTerms: ['iceheart-sea', 'myrathil', 'drowned_spume']
  },
  'deepwell_archipelago': {
    id: 'deepwell_archipelago',
    term: 'Deepwell Archipelago',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'A forty-mile chain of ice-islands concealing underwater Myrathil cave-cities beneath the frozen surface.',
    fullEntry: 'The Deepwell Archipelago is the Deep-Born Myrathil\'s hidden civilization — a chain of ice-islands stretching forty miles, each one concealing underwater cave-cities beneath its frozen surface. The Deep-Born maintain a culture entirely separate from the surface world, emerging only to trade and to conduct their Drowning Rites — rituals that surface-dwellers are not permitted to witness. The archipelago is connected by submerged tunnels that only the Myrathil can navigate.',
    relatedTerms: ['iceheart-sea', 'myrathil']
  },
  'spindrift_lagoon': {
    id: 'spindrift_lagoon',
    term: 'Spindrift Lagoon',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'A coral-reef lagoon warmed by volcanic currents, glowing blue-green with cultivated bioluminescence.',
    fullEntry: 'Spindrift Lagoon is the most beautiful settlement in the Iceheart Sea — a warm-water anomaly where coral survived the Deepening, sheltered by volcanic thermal dynamics. The Breakers-Born Myrathil have tended the reef for centuries, cultivating bioluminescent organisms that illuminate the entire lagoon in shades of blue-green. Merryn traders dock at the surface platforms while Myrathil artisans work in underwater markets grown from living coral. The lagoon is visible for miles across the frozen sea — a beacon of warmth and light in the endless dark.',
    relatedTerms: ['iceheart-sea', 'myrathil', 'house_mereval']
  },

  // CRAGJAW PEAKS — New Locations
  'deepchasm_keep': {
    id: 'deepchasm_keep',
    term: 'Deepchasm Keep',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'A Tessen fortress spanning a massive fissure, controlling the only reliable passage between upper peaks and lower galleries.',
    fullEntry: 'Deepchasm Keep is a feat of Tessen engineering — a fortress built across a massive mountain fissure, its foundations anchored into both cliff walls with iron stakes driven into living rock. The only crossing is a bridge of Groven-calcified bone that groans underfoot. The keep controls the primary passage between the upper peaks and the lower mining galleries, making it both a military installation and a toll-collection point of enormous strategic value.',
    relatedTerms: ['cragjaw-peaks', 'house_tesshan', 'groven']
  },
  'the_great_gorge': {
    id: 'the_great_gorge',
    term: 'The Great Gorge',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'A mile-wide canyon bridged by seven calcified bone-spans grown from willing Groven ancestors.',
    fullEntry: 'The Great Gorge is the Cragjaw Peaks\' primary thoroughfare — a mile-wide, bottomless tear in the mountain range bridged by seven calcified bone-spans, each grown from the skeleton of a willing Groven ancestor. The gorge is the Groven\'s greatest leverage: every passage is tolled, every toll is negotiated, and every negotiation favors the Groven. The Bone-Weavers who maintain the spans are among the most respected — and most feared — people in the Peaks.',
    relatedTerms: ['cragjaw-peaks', 'groven', 'vat_breakers_guild']
  },
  'gearworks_gulch': {
    id: 'gearworks_gulch',
    term: 'Gearworks Gulch',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'A Fexrick industrial settlement powered by geothermal vents, producing the finest clockwork in the known world.',
    fullEntry: 'Gearworks Gulch is the industrial heart of the Cragjaw Peaks — a narrow ravine packed with geothermal-powered machinery that runs day and night without pause. The Fexrick artisans here produce the finest clockwork mechanisms, automaton components, and refined metals in the known world. The Chief Artificer governs through competitive exhibition, and the gulch\'s atmosphere of feverish invention attracts the most brilliant — and most unstable — engineers from every region.',
    relatedTerms: ['cragjaw-peaks', 'fexrick', 'house_tesshan']
  },
  'frostmaw_massif': {
    id: 'frostmaw_massif',
    term: 'Frostmaw Massif',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'The compact mountain group surrounding Frostmaw Holdfast, perpetually shrouded in the Tesshan blizzard.',
    fullEntry: 'The Frostmaw Massif is a cluster of peaks so dense they form a single, nearly impregnable natural fortress — the mountain stronghold that House Tesshan traded visibility to protect. The massif is perpetually shrouded in the enchanted blizzard, and navigation without Groven bone-compasses or intimate knowledge of the ice-tunnels is suicide. It is both the most defensible and most isolated position in the Cragjaw Peaks.',
    relatedTerms: ['cragjaw-peaks', 'house_tesshan', 'frostmaw_holdfast']
  },

  // SUNDRIFT VALE — New Locations
  'starfall_vale': {
    id: 'starfall_vale',
    term: 'Starfall Vale',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'A deep valley carpeted with crystalline shards of trapped starlight — the impact site of Sol\'s shattered celestial court.',
    fullEntry: 'Starfall Vale is the most sacred site in the Sundrift Vale — a crater where the physical residue of Sol\'s shattered celestial court impacted the earth during the Breach. Thousands of crystalline shards carpet the valley floor, glowing with trapped starlight and producing harmonic tones that the Sylen Astril call the Memory of Sol. The vale is a place of pilgrimage for every Astril caste and a source of prophecy through the Star-Oracle who tends the First Shard.',
    relatedTerms: ['sundrift-vale', 'astril', 'the_breach']
  },
  'the_unlit_knoll': {
    id: 'the_unlit_knoll',
    term: 'The Unlit Knoll',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'A small hill where Unlit Astril hold secret judgments — a place where fire refuses to burn and no star-glow can approach.',
    fullEntry: 'The Unlit Knoll is the Unlit Veil\'s most closely guarded site — a small, rounded hill where fire refuses to burn and no light persists. The Unlit have shaped this quality into a tool: their secret judgments, dead-drops, and intelligence operations all center on a place that Astril with constellation-spirits in their blood physically cannot approach. It is a hole in the light of the world, and the Unlit Veil has made it their headquarters.',
    relatedTerms: ['sundrift-vale', 'astril', 'unlit_veil']
  },
  'ancestor_wold': {
    id: 'ancestor_wold',
    term: 'Ancestor Wold',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'High, open ground where the Ordan dead are honored in vast earthen barrows that hum with ancestral resonance.',
    fullEntry: 'The Ancestor Wold is the spiritual anchor of the Ordan people — high, open ground where twenty generations of chieftains lie buried beneath earthen barrows that hum with a constant, resonant tone. The hum guides Ordan herders across the starless steppe and marks the Wold as sacred ground where silence is enforced by custom stronger than law. To speak above a whisper here is to invite the wrath of every ancestor buried in the mounds.',
    relatedTerms: ['sundrift-vale', 'house_ordavan']
  },
  'morrens_bogpost': {
    id: 'morrens_bogpost',
    term: "Morren's Bogpost",
    type: 'location',
    region: 'sundrift-vale',
    summary: 'A Morren trading outpost at the forest-steppe edge, the primary exchange point between Bryngloom and Sundrift goods.',
    fullEntry: 'Morren\'s Bogpost is the primary trade gateway between the Bryngloom Forest and the Sundrift Vale — a cluster of squat peat-stone buildings that smell perpetually of bog-water. Morren debt-brokers here exchange Bryngloom goods (fungal lights, memory-glass, bog-mushroom reagents) for Ordan wool and hide. The credit terms are always generous. The interest always compounds. The Bogpost is the Morren\'s most successful financial outpost outside the Bryngloom.',
    relatedTerms: ['sundrift-vale', 'bryngloom-forest', 'neth']
  },

  // BRYNGLOOM FOREST — New Locations
  'widows_quagmire': {
    id: 'widows_quagmire',
    term: "Widow's Quagmire",
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A treacherous bog where the ground liquefies without warning, named for the Morren widows who walked in to join their debt-dead husbands.',
    fullEntry: 'Widow\'s Quagmire is the Bryngloom Forest\'s most lethal terrain — a stretch of bog where the ground has no solid bottom and the peat is active, digesting anything organic that sinks into it. The quagmire earned its name from the Morren widows who, according to legend, walked into the bog to join their husbands whose debts had killed them. Their hands are said to still clutch unsigned contract-fragments, preserved forever in the acidic peat, reaching upward from depths that no one has survived measuring.',
    relatedTerms: ['bryngloom-forest', 'debt_revenant', 'cycle_eater']
  },
  'black_fen': {
    id: 'black_fen',
    term: 'Black Fen',
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'An acidic fen where nothing grows — the Neth\'s dumping ground for voided contracts and legally-annihilated individuals.',
    fullEntry: 'The Black Fen is the Neth contract court\'s final solution — a fen of such extreme acidity that bone dissolves within hours and nothing grows, nothing lives, and nothing is remembered. Failed contracts, dissolved agreements, and legally-voided individuals are cast into its depths. The Neth call it the Final Clause. It is the only place in the Bryngloom where the Root-Veil has no presence and the Keeper of the Last Threshold has no jurisdiction — a legal void that serves as both garbage dump and ultimate threat.',
    relatedTerms: ['bryngloom-forest', 'neth', 'keeper_of_the_last_threshold']
  },
  'vel_keth_bayou': {
    id: 'vel_keth_bayou',
    term: 'Vel-Keth Bayou',
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A marshy channel flowing against the natural gradient, named in the Neth tongue as "the water that remembers."',
    fullEntry: 'Vel-Keth Bayou — "the water that remembers" in the Neth tongue — is a marshy channel that flows uphill, defying physics in ways the Neth insist are perfectly legal under the First Contract. Memory-glass deposits line the banks, glowing faintly with recorded thoughts of the long-dead. The Kessen weavers who tend the bayou harvest the memory-glass for Atropolis\'s contract-archives and sell the excess to Thalren scribes desperate for anything that preserves information against the fog.',
    relatedTerms: ['bryngloom-forest', 'neth', 'atropolis']
  },
  'aran_glen': {
    id: 'aran_glen',
    term: 'Aran-Glen',
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A Kessen Neth settlement where every structure is grown from living ironwood, governed by a steward bound to the grove\'s health.',
    fullEntry: 'Aran-Glen is proof that architecture can be alive — a Kessen Neth settlement where every wall, arch, and roof has been coaxed from living ironwood over centuries of patient horticulture. The Grove-Steward who governs the glen is legally bound to its health: if the grove sickens, their authority voids automatically. It is a governance system designed to prevent corruption through pure self-interest, and it has produced one of the most harmonious settlements in the Bryngloom.',
    relatedTerms: ['bryngloom-forest', 'neth', 'atropolis']
  },
  'hunters_gully': {
    id: 'hunters_gully',
    term: "Hunter's Gully",
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A water-worn ravine used by Vreken for coordinated ambush hunts, illuminated by bioluminescent kill-zone markers.',
    fullEntry: 'Hunter\'s Gully is Marked Vreken territory — a narrow, water-worn ravine where the walls force prey into single-file and the Vreken drop from above in coordinated strikes. The gully floor is carpeted with bioluminescent moss that the Vreken have cultivated in distinct brightness patterns to mark their kill-zones. Trespassers are considered sport, and the Vreken have never lost a hunt in their home territory.',
    relatedTerms: ['bryngloom-forest', 'vreken']
  },
  'fangmere_grove': {
    id: 'fangmere_grove',
    term: 'Fangmere Grove',
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A sacred Vreken wood where blood-rites and ancestral communion ceremonies are held in preternatural silence.',
    fullEntry: 'Fangmere Grove is the Vreken\'s most sacred site outside the Sunken Spire — a perfect circle of ironwood trees whose roots intertwine with Vreken ancestral bones. The grove is preternaturally quiet; even the ambient bioluminescence dims here, as if the light itself shows respect. The Clean Vreken hold their blood-rites and naming ceremonies here, and the Crypt-Council convenes beneath the central tree when matters of ancestral importance demand judgment.',
    relatedTerms: ['bryngloom-forest', 'vreken', 'sunken_spire']
  },

  // FROSTWOOD REACH
  'the_shallows': {
    id: 'the_shallows',
    term: 'The Shallows',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'A labyrinth of mist-veiled ravines and marshy pine stands surrounding Greymark Keep, where ironwood roots drift when the mists thicken.',
    fullEntry: 'The Shallows are the first test of any traveler entering the Frostwood Reach — a tangle of shallow ravines and silt-roads where the fog presses close and rusted lantern-posts mark paths that may no longer exist. Mist-Sentinels patrol the margins, but even they rely on ironwood root-patterns to navigate, as the roots themselves seem to shift when no one is watching. Gambrels and Grefs hunt here, drawn by the desperation of lost travelers and the oaths they make to find their way out.',
    relatedTerms: ['frostwood-reach', 'greymark_keep', 'gambrel', 'gref']
  },
  'scribes_tower': {
    id: 'scribes_tower',
    term: "Scribes' Tower",
    type: 'location',
    region: 'frostwood-reach',
    summary: 'A vertical archive built inside the hollow shell of a dead ironwood, where archivists copy records before the fog erases them.',
    fullEntry: "The Scribes' Tower is the Frostwood Reach's bulwark against forgetting — a hollowed petrified ironwood converted into a vertical cathedral of parchment and ink. Archivists work in silent shifts, copying maps and genealogies onto calfskin vellum in races against the fog that will eventually consume their memories of what they have written. The Tower connects directly to the Ledger Halls below, where older records lie scattered among petrified roots and the silent echoes of clerks who forgot their own names.",
    relatedTerms: ['frostwood-reach', 'greymark_keep', 'ledger_halls', 'house_thalreth']
  },
  'ledger_halls': {
    id: 'ledger_halls',
    term: 'Ledger Halls',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'A partially collapsed underground archive from the first century of the Dimming, where chained books of records lie among petrified roots.',
    fullEntry: 'The Ledger Halls are a tomb of knowledge — an underground archive dating to the first century after the sun\'s death, now partially collapsed and shrouded in the same fog that plagues the surface above. Chained volumes of records lie scattered among the petrified roots, their pages stiff with cold and damp. The Forgotten Archivists who guard the deeper chambers have been here so long that they have forgotten their own names, knowing only the records they tend and the importance of preserving them.',
    relatedTerms: ['frostwood-reach', 'scribes_tower', 'ironwood_heart', 'gref']
  },
  'ironwood_heart': {
    id: 'ironwood_heart',
    term: 'Ironwood Heart',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'The deepest, darkest grove of the Frostwood Reach, where a titanic glowing white tree stands at the center of a stagnant mist-lake.',
    fullEntry: 'The Ironwood Heart is the deepest, most dangerous place in the Frostwood Reach — a grove so dense that the mist forms a heavy, stagnant lake on the forest floor and the canopy admits no light whatsoever. At its center stands a titanic white tree whose sap remains warm eight centuries after every other ironwood petrified, a living beacon that draws both desperate survivalists and the horrific predators that hunt them. The Unshorn Briaran claim the Heart as sacred ground, tending the white tree with thorn-blood rituals that predate the Fog Compact.',
    relatedTerms: ['frostwood-reach', 'briaran', 'gambrel', 'the_shallows']
  },

  // NORDHALLA
  'bloodhammer_sump': {
    id: 'bloodhammer_sump',
    term: 'Bloodhammer Sump',
    type: 'location',
    region: 'nordhalla',
    summary: 'A deep volcanic crater where geothermal heat powers the massive iron smelters that forge the Skalds\' runic cold-iron axes.',
    fullEntry: 'The Bloodhammer Sump is the industrial forge-heart of Nordhalla — a deep, steam-venting volcanic crater ringed by towering walls of ice that channel the geothermal heat into smelters of staggering size. The Bloodhammer Clan of Rime-Born work the forges here, their frost-touched hands immune to burns that would kill a human smith, forging runic cold-iron axes that hold their edge in temperatures that would shatter ordinary steel. The contrast between the glacial walls and the volcanic floor produces a perpetual steam-storm that the Skald have learned to read as a form of divination.',
    relatedTerms: ['nordhalla', 'rime_born', 'fjord_gate', 'house_skalvyr']
  },
  'fjord_gate': {
    id: 'fjord_gate',
    term: 'Fjord-Gate',
    type: 'location',
    region: 'nordhalla',
    summary: 'A massive coastal harbor inside a black fjord, guarded by towering stone doors that seal against sea-storms.',
    fullEntry: 'Fjord-Gate is Nordhalla\'s primary harbor and the greatest engineering achievement of House Skalvyr — a deep coastal fjord sealed by towering stone doors that slide shut to block the worst of the sea-storms. It is the gateway through which all northern trade flows, connecting Nordhalla to the Iceheart Sea and the wider world. The Sea-Guard who patrol the harbor are the only Skald who regularly interact with foreigners, and they have developed a culture distinct from the insular fjord-keepers of the interior.',
    relatedTerms: ['nordhalla', 'house_skalvyr', 'frozen_archive', 'bloodhammer_sump']
  },
  'hunger_glaciers': {
    id: 'hunger_glaciers',
    term: 'Hunger Glaciers',
    type: 'location',
    region: 'nordhalla',
    summary: 'A vast, shifting expanse of pure whiteout and deadly crevasses where the ice moves with predatory intent.',
    fullEntry: 'The Hunger Glaciers are the killing ground of Nordhalla — a vast, shifting expanse of pure whiteout where the wind carries a predatory howl and the crevasses open and close with the grinding of the ice sheets. Travelers swear the glaciers move with intention, herding caravans toward dead ends and freezing them into permanent monuments to their own hubris. The Endurance Purists who train here consider survival a spiritual practice, deliberately stranding themselves for weeks to prove their worth to the Rime-Born ancestors.',
    relatedTerms: ['nordhalla', 'house_skalvyr', 'stel', 'rimors_hearth']
  },
  'rimors_hearth': {
    id: 'rimors_hearth',
    term: "Rimor's Hearth",
    type: 'location',
    region: 'nordhalla',
    summary: 'The volcanic ruins of a great mountain keep buried by a sudden glacier advance, still warmed by a few stubborn steam vents.',
    fullEntry: 'Rimor\'s Hearth is a monument to the glacier\'s indifference — a great mountain keep that was buried in a single season when the Hunger Glaciers surged during the first century of the Dimming. A few steam vents still pierce the ice, keeping patches of the black basalt ruins warm enough to shelter freezing travelers and the smugglers who prey on them. Fjord-Riders use the Hearth as a waystation on the dangerous route between the Frozen Archive and the eastern approaches.',
    relatedTerms: ['nordhalla', 'frozen_archive', 'hunger_glaciers', 'stel']
  },
  'vesperas_perch': {
    id: 'vesperas_perch',
    term: "Vespera's Perch",
    type: 'location',
    region: 'nordhalla',
    summary: 'A Corvani cliff-settlement named for the matriarch Vespera, reachable only by rope-ladder and gliding on fixed lines.',
    fullEntry: 'Vespera\'s Perch is the largest permanent Corvani settlement in Nordhalla — a cluster of dwellings carved into the high caves of the eastern mountains, named for the matriarch who led her flock here during the Glacier Bargain. The settlement is inaccessible from the ground, reachable only by rope-ladders and fixed gliding lines that the Corvani navigate with avian grace. The Skald tolerate the Perch because the Corvani trade raven-feather cloaks and storm-predictions of uncanny accuracy, reading prophecies in the flight patterns of the ravens that circle the mountain.',
    relatedTerms: ['nordhalla', 'corvani', 'rooks_promontory', 'house_skalvyr']
  },

  // CRAGJAW PEAKS
  'the_spans': {
    id: 'the_spans',
    term: 'The Spans',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'A terrifying network of arching bone bridges linking the peaks above the blizzard-clouds, grown from Groven ancestors\' calcified skeletons.',
    fullEntry: 'The Spans are the Cragjaw Peaks\' only thoroughfares above the whiteout — a network of arching bridges grown from the calcified skeletons of willing Groven dead, spanning bottomless chasms where the blizzard rages below. Each span represents a Groven ancestor who chose to give their bones to connect the peaks, a sacrifice that the Groven honor with eternal maintenance and the Tessen Scouts cross with white-knuckled terror. Chasm-Stalkers nest in the supports, patient and hungry.',
    relatedTerms: ['cragjaw-peaks', 'frostmaw_holdfast', 'groven', 'ancestor_gaps']
  },
  'ancestor_gaps': {
    id: 'ancestor_gaps',
    term: 'The Ancestor-Gaps',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'An ancient vertical burial valley where the Groven grow their bone-spans, its walls honeycombed with thousands of burial niches.',
    fullEntry: 'The Ancestor-Gaps are the most sacred site in Groven civilization — a vertical valley where the rock walls are honeycombed with thousands of burial niches, each one containing a Groven ancestor whose bones may one day be called upon to grow a new span. The air hums with a deep, constant vibration as the mountain winds pass through the ancestral bones, producing a tone the Bone-Weavers interpret as the voices of the dead. It is here that new spans are germinated, the bones of the recently deceased planted in the cliff face to begin their centuries-long calcification.',
    relatedTerms: ['cragjaw-peaks', 'groven', 'the_spans', 'vat_breakers_guild']
  },
  'sump_galleries': {
    id: 'sump_galleries',
    term: 'Sump Galleries',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'Toxic mining shafts beneath the mountain peaks where leather-masked miners extract sulfur and coal-iron amidst volcanic gases.',
    fullEntry: 'The Sump Galleries are the poisoned underbelly of the Cragjaw Peaks — the lower mining shafts where Tessen miners in leather respirators extract sulfur and coal-iron from seams that bleed volcanic gas. The air is warm but heavy with toxins, and the shadows hide scurrying, multi-legged horrors that the Fexrick Scavengers harvest for alchemical components. The galleries connect to both Frostmaw Holdfast above and the Lost Brood Vats below, making them the most dangerous transit corridor in the Peaks.',
    relatedTerms: ['cragjaw-peaks', 'frostmaw_holdfast', 'fexrick', 'scrab']
  },
  'lost_brood_vats': {
    id: 'lost_brood_vats',
    term: 'Lost Brood Vats',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'Deep subterranean vaults of cracked stone chambers once used to cultivate biological life, now guarded by feral Wyrd-horrors.',
    fullEntry: 'The Lost Brood Vats are the Deep Alchemists\' original laboratory — a deep, subterranean vault of cracked stone chambers where an unknown race once cultivated biological life in petrified egg-casings and strange runic tubing. The Feral Fexrick who have claimed the upper chambers are descended from the Alchemists\' servitors, warped by centuries of exposure into something only nominally Fexrick. The deeper chambers remain sealed, and the scraping sounds that emanate from behind the sealed doors suggest that the Alchemists\' oldest experiments may still be growing.',
    relatedTerms: ['cragjaw-peaks', 'deep_alchemists', 'groven', 'scrab']
  },
  'iron_ravine': {
    id: 'iron_ravine',
    term: 'Iron Ravine',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'A narrow, ore-rich gorge streaked red and black, where mine-shafts honeycomb the cliff faces above precarious rope-bridges.',
    fullEntry: 'The Iron Ravine is the Cragjaw Peaks\' primary source of cold-iron — a narrow gorge where volcanic magnetite stains the walls in streaks of red and black and the air is thick with metallic dust. Mine-shafts honeycomb the cliff faces, connected by wooden platforms and rope-bridges that sway in the constant wind. The Sump-Miners who work the ravine are a hard people, accustomed to cave-ins, toxic gas, and the Scrabs that nest in the deepest seams.',
    relatedTerms: ['cragjaw-peaks', 'house_tesshan', 'deepchasm_keep', 'scrab']
  },
  'stags_rest_moraine': {
    id: 'stags_rest_moraine',
    term: "Stag's Rest Moraine",
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'A massive glacial deposit shaped like a sleeping stag, sacred to the Groven, where every stone surface is carved with lineage petroglyphs.',
    fullEntry: 'Stag\'s Rest Moraine is the Groven\'s most sacred gathering ground — a massive deposit of shattered rock and ancient ice naturally shaped like a sleeping stag, a formation the Groven consider a message from the mountain itself. Every exposed surface of stone is carved with petroglyphs tracing Groven lineage back to the Vat-Breakers\' revolt, and the Bone-Weavers hold their most important ceremonies here, invoking the ancestors whose bones form the spans that bind the Peaks together.',
    relatedTerms: ['cragjaw-peaks', 'groven', 'the_great_gorge', 'vat_breakers_guild']
  },
  'sump_rift': {
    id: 'sump_rift',
    term: 'Sump Rift',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'A thousand-foot underground fissure slick with chemical runoff, where strange fungal colonies feed on forge-slag and mechanical parts.',
    fullEntry: 'The Sump Rift is the Cragjaw Peaks\' abyss — an underground fissure that descends for thousands of feet, its walls slick with chemical runoff and industrial residue from centuries of Fexrick industry. Fungal colonies thrive in the depths, feeding on forge-slag and corroded machinery in an ecosystem that exists nowhere else in the known world. The Fexrick Scavengers who dare the rift\'s upper reaches return with materials of extraordinary alchemical potential — and stories of things growing in the dark that have learned to eat metal.',
    relatedTerms: ['cragjaw-peaks', 'fexrick', 'sump_galleries', 'gearworks_gulch']
  },

  // SUNDALE
  'great_forge': {
    id: 'great_forge',
    term: 'The Great Forge',
    type: 'location',
    region: 'sundale',
    summary: 'A sprawling volcanic cavern city powered by the world\'s magma-core, producing refined cold-iron for all seven regions.',
    fullEntry: 'The Great Forge is Sundale\'s industrial heart and the largest smelting operation in the known world — a sprawling city of black iron and basalt built inside a volcanic cavern warmed by a branch of the world\'s magma-core. The Emberth forge-masters who tend the geothermal bellows produce refined cold-iron in quantities that supply every region on the continent, and the city\'s population of smiths, miners, and merchants makes it second only to the Harath-Vault in Sundale importance. The heat is oppressive, the noise is constant, and the forges never sleep.',
    relatedTerms: ['sundale', 'harath_vault', 'emberth', 'house_solvan']
  },
  'emberspire_caldera': {
    id: 'emberspire_caldera',
    term: 'Emberspire Caldera',
    type: 'location',
    region: 'sundale',
    summary: 'The active, soot-choked volcanic mouth of Emberspire, where ancient fire-weaving entities dwell among the molten glass.',
    fullEntry: 'The Emberspire Caldera is the screaming mouth of Sundale\'s world-heart volcano — an active, soot-choked caldera that continuously vents ash and molten glass into the dark sky. The heat is lethal to all but the most hardened Emberth, and the volcanic vents are home to fire-weaving elemental entities older than the Dimming itself. Pyrofiend cultists make pilgrimages to the caldera\'s rim to commune with the Cinder-Fiends that nest in the molten rock, returning with scorched eyes and prophecies of burning.',
    relatedTerms: ['sundale', 'emberspire', 'harath_vault', 'pyrofiend']
  },
  'basalt_shyr': {
    id: 'basalt_shyr',
    term: 'Basalt Shyr',
    type: 'location',
    region: 'sundale',
    summary: 'A trade outpost atop cooling basalt columns on the Sundale border, the primary gateway between the ashlands and the lowlands.',
    fullEntry: 'Basalt Shyr is Sundale\'s window to the outside world — a trade outpost built atop a formation of cooling basalt columns where the volcanic region meets the lowland approaches. Kessen Merchants and house Solvan factors exchange Sundale\'s refined metals and volcanic coal for Bryngloom fungal-lights, timber, and the rare goods that the frozen world produces in diminishing quantities. The outpost is the closest thing to neutral ground in Sundale, a place where the geothermal heat yields to ordinary cold and the rules of commerce outweigh the passions of sun-worship.',
    relatedTerms: ['sundale', 'house_solvan', 'great_forge', 'ember_lagoon']
  },
  'cinder_badlands': {
    id: 'cinder_badlands',
    term: 'Cinder Badlands',
    type: 'location',
    region: 'sundale',
    summary: 'A vast desert of black obsidian sands and jagged glass spires where toxic soot storms strip the flesh from the unwary.',
    fullEntry: 'The Cinder Badlands are Sundale\'s killing ground — a vast, windswept desert of black obsidian sands and jagged glass spires where the wind carries toxic soot and travelers must wrap themselves in heavy leather or risk having their eyes gouged by flying glass-shards. The Thrask Emberth rangers who patrol this wasteland are among the hardiest people in the known world, navigating by thermal vent patterns and the positions of the hoodoo formations that serve as the only landmarks in an ocean of black sand.',
    relatedTerms: ['sundale', 'emberspire_caldera', 'emberth', 'basalt_shyr']
  },
  'vulkars_karst': {
    id: 'vulkars_karst',
    term: "Vulkar's Karst",
    type: 'location',
    region: 'sundale',
    summary: 'A honeycombed limestone landscape riddled with underground rivers and sinkholes, heated to boiling by geothermal vents.',
    fullEntry: 'Vulkar\'s Karst is a geological impossibility made real — a honeycombed limestone landscape riddled with underground rivers heated to boiling by geothermal vents, depositing vivid orange and red crystals along every cave wall. Named for the Emberth forge-master who first mapped its depths, the karst connects to the Harath-Vault through miles of submerged passages that only the Korr Emberth dare to navigate. The mineral-rich waters produce crystals of extraordinary alchemical value, but the combination of boiling water, unstable limestone, and volcanic gas makes every expedition a gamble with death.',
    relatedTerms: ['sundale', 'harath_vault', 'emberth', 'cinderhoodoo']
  },
  'slag_gulch': {
    id: 'slag_gulch',
    term: 'Slag Gulch',
    type: 'location',
    region: 'sundale',
    summary: 'A narrow ravine settlement built on forge waste, where Emberth and Groven workers salvage metals from industrial debris.',
    fullEntry: 'Slag Gulch is Sundale\'s monument to the principle that nothing useful should be wasted — a permanent foundry town built inside a narrow ravine filled with centuries of forge waste and industrial debris. Emberth and Groven workers process the slag for salvageable metals in operations that are hot, loud, and acrid enough to strip paint from iron. The inhabitants have developed a unique patois mixing Sundari and Terran, and the Gulch produces a surprising volume of refined secondary metals that supplement the Great Forge\'s output.',
    relatedTerms: ['sundale', 'great_forge', 'emberth', 'groven']
  },
  'the_cinder_strait': {
    id: 'the_cinder_strait',
    term: 'The Cinder Strait',
    type: 'location',
    region: 'sundale',
    summary: 'A narrow, boiling water passage between volcanic islands that halves the journey to Merrowport but has claimed more ships than any other route.',
    fullEntry: 'The Cinder Strait is the most dangerous shipping lane in the known world — a narrow passage between two volcanic islands where the water steams perpetually and the cliffs weep molten rock during peak volcanic cycles. Merryn sailors navigate the strait at tremendous risk, as the passage halves the journey to Merrowport and the profit justifies the danger for those who survive. The strait is home to Cinder-Fiends that surface during eruptions, and the wreckage of a hundred ships litters the boiling floor beneath the waves.',
    relatedTerms: ['sundale', 'emberspire_caldera', 'slag_gulch', 'merrowport']
  },

  // ICEHEART SEA
  'treakous_rift': {
    id: 'treakous_rift',
    term: 'Treakous Oceanic Rift',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'A bottomless, freezing ocean rift where city-sized glaciers drift above ancient, tentacled horrors sleeping in the black depths.',
    fullEntry: 'The Treakous Oceanic Rift is the deepest known point in the Iceheart Sea — a bottomless, freezing chasm where the water runs black and silent beneath city-sized glaciers. The Myrathil Deep-Stalkers who probe its edges speak of ancient, multi-tentacled horrors coiled in the sub-zero depths, entities that predate the Dimming and regard the ice above as a temporary inconvenience. The currents are violent and unpredictable, capable of dragging a fully-rigged vessel into the abyss in seconds.',
    relatedTerms: ['iceheart-sea', 'myrathil', 'ironjaw_port', 'drowned_spume']
  },
  'first_shore': {
    id: 'first_shore',
    term: 'First Shore',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'The ancient coastal ruins where House Mereval\'s ancestors first landed eight centuries ago, now encrusted in ice and guarded by standing dead.',
    fullEntry: 'First Shore is the most historically significant — and most haunted — site in the Iceheart Sea: the coastal ruins where the human ancestors of House Mereval first landed eight centuries ago. The stone watchtowers are now encrusted with heavy ice and barnacles, and the skeletal archers who once manned them still stand at their posts, frozen in attitudes of vigilance that the Drowned Revenants who haunt the harbor find amusing. No one excavates here. The dead are still on duty.',
    relatedTerms: ['iceheart-sea', 'house_mereval', 'treakous_rift', 'drowned_spume']
  },
  'gale_storm_shallows': {
    id: 'gale_storm_shallows',
    term: 'Gale-Storm Shallows',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'A treacherous expanse of shallow reefs and perpetual storm-cycles navigated only by bioluminescent moss and ink-charts tattooed on skin.',
    fullEntry: 'The Gale-Storm Shallows are the Iceheart Sea\'s proving ground — a treacherous expanse of shallow reefs, jagged ice-crags, and perpetual storm-cycles where the winds can tear sails to ribbons and the reefs can gut a hull in seconds. Merryn Pirates use the shallows as both hunting ground and refuge, navigating by the soft glow of bioluminescent ocean moss and the ink-charts tattooed on their skin. The storms here never fully cease; they only vary in intensity from dangerous to catastrophic.',
    relatedTerms: ['iceheart-sea', 'merrowport', 'house_mereval', 'first_shore']
  },
  'the_saltmaw_estuary': {
    id: 'the_saltmaw_estuary',
    term: 'The Saltmaw Estuary',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'A treacherous mixing of glacial river and frozen sea where Merryn whalers and Myrathil divers compete violently for territory.',
    fullEntry: 'The Saltmaw Estuary is where Nordhalla\'s glacial rivers meet the Iceheart Sea — a churning mix of fresh and salt water choked with ice-floes and rich with seal-hunting grounds and rare thermal minerals washed down from the mountains. Merryn whalers and Myrathil River-Fed divers compete violently for territory, their territorial disputes occasionally escalating into armed skirmishes that House Mereval pretends not to notice. The estuary\'s name comes from the way the glacial water bites at anything that enters it, salt and cold combining into a solution that numbs flesh in seconds.',
    relatedTerms: ['iceheart-sea', 'house_mereval', 'myrathil', 'ironjaw_port']
  },
  'the_shivering_bight': {
    id: 'the_shivering_bight',
    term: 'The Shivering Bight',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'A wide, shallow bay of constant volcanic tremors where ships must drift with engines running, hoping the quakes do not worsen.',
    fullEntry: 'The Shivering Bight is the Iceheart Sea\'s most geologically unstable region — a wide, shallow bay where unstable volcanic activity beneath the seabed produces constant tremors that make anchoring impossible. The bight is rich in thermal vents and the exotic organisms that feed on them, drawing Merryn Cartographers and Myrathil divers despite the danger. Ships must drift through with engines running, crews watching the water for the sudden discoloration that precedes a major eruption.',
    relatedTerms: ['iceheart-sea', 'gale_storm_shallows', 'merrowport', 'myrathil']
  },
  'skalds_longport': {
    id: 'skalds_longport',
    term: "Skald's Longport",
    type: 'location',
    region: 'iceheart-sea',
    summary: 'A Norse-style harbor on the northern coast where Skald longships trade cold-iron and whale products for Merryn salt-fish and Myrathil coral.',
    fullEntry: 'Skald\'s Longport is the cultural bridge between Nordhalla and the Iceheart Sea — a black basalt harbor built in the Skald style, with dragon-prow longhouses that terrify the local Merryn and impress the Myrathil in equal measure. The Skald traders who dock here bring cold-iron, glacier ice, and whale products from the north; they return with salt-fish, Myrathil coral, and news from the wider world. The port is peaceful by Iceheart standards, protected by a natural breakwater of black stone that the Skald have reinforced with iron stakes.',
    relatedTerms: ['iceheart-sea', 'nordhalla', 'ironjaw_port', 'the_saltmaw_estuary']
  },

  // SUNDRIFT VALE
  'mound_camps': {
    id: 'mound_camps',
    term: 'Mound-Camps',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'A sprawling seasonal settlement of wooly-yurts around the great grass mounds, where nomadic throat-singers trade under the starless sky.',
    fullEntry: 'The Mound-Camps are the Sundrift Vale\'s commercial heartbeat — a sprawling, seasonal settlement of heavy wooly-yurts that grows around the base of the great grass mounds every summer when the nomadic clans converge to trade. Ordan throat-singers exchange wool, dried meat, and memory-beads for cold-iron tools and salt, while Astril Outcast Guilds hawk constellation-readings and Lien-crystal trinkets. The camps disassemble completely when the herds move on, leaving no trace but trampled grass and the faint hum of the mounds beneath.',
    relatedTerms: ['sundrift-vale', 'synod_hold', 'house_ordavan', 'grass_tundra']
  },
  'ancestor_mounds': {
    id: 'ancestor_mounds',
    term: 'Ancestor Mounds',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'A vast network of grass-covered earthen barrows holding twenty generations of Ordan chieftains, emitting a continuous guiding hum.',
    fullEntry: 'The Ancestor Mounds are the Sundrift Vale\'s most sacred and practical landmark — a vast network of grass-covered earthen barrows containing the preserved remains of twenty generations of Ordan chieftains, each mound emitting a low, continuous hum at a unique frequency. The Mound-Keepers who tend the barrows maintain that the hum is the ancestors still speaking, guiding lost travelers through the starless steppe and warning of danger through changes in pitch and rhythm. Astril Sylen make pilgrimages here to harmonize with the ancestral tones, seeking glimpses of the constellation-spirits that fell during the Breach.',
    relatedTerms: ['sundrift-vale', 'house_ordavan', 'synod_hold', 'astril']
  },
  'grass_tundra': {
    id: 'grass_tundra',
    term: 'Grass Tundra Steppe',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'An endless, wind-swept plain of grey-green grass beneath a starless sky, home to massive woolly herds and the hunting shadows of the Hungry Child.',
    fullEntry: 'The Grass Tundra Steppe is the Sundrift Vale\'s vast, featureless interior — an endless plain of tough grey-green grass that grows waist-high even without sunlight, stretching beneath a sky empty of stars, constellations, or any navigable feature. Ordan Hunters stalk the woolly herds that graze here, but even they give wide berth to the sudden, hunting shadows of the Hungry Child, the Wyrd-creature that the steppe clans believe is the embodiment of starvation itself.',
    relatedTerms: ['sundrift-vale', 'house_ordavan', 'mound_camps', 'hungry_child']
  },
  'lien_stalked_grazes': {
    id: 'lien_stalked_grazes',
    term: 'Lien-Stalked Grazes',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'A region where glowing crystal-infused Lien-stalks replace ordinary grass, attracting mutated beasts and crystal-skinned Astril scavengers.',
    fullEntry: 'The Lien-Stalked Grazes are the Sundrift Vale\'s most alien landscape — a region where the ordinary steppe grass has been replaced by glowing, crystal-infused Lien-stalks that make the ground shimmer with trapped starlight. The soil here is extraordinarily fertile, but the crystalline grass makes grazing dangerous for ordinary herds, attracting instead mutated beasts and the Muren Astril who harvest the Lien-crystals for their beacon-fires. The Hungry Child has been sighted here more frequently than anywhere else on the steppe, drawn by the concentrated starlight.',
    relatedTerms: ['sundrift-vale', 'astril', 'grass_tundra', 'hungry_child']
  },
  'kumis_downs': {
    id: 'kumis_downs',
    term: 'Kumis Downs',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'Rolling hills of pale grass where Ordan mares produce the fermented mare\'s milk that is the steppe\'s sacred drink and primary trade good.',
    fullEntry: 'The Kumis Downs are the gentlest terrain in the Sundrift Vale — rolling hills of pale grass where Ordan mares graze in vast herds, producing the fermented mare\'s milk that serves as the steppe\'s sacred drink, primary trade good, and ceremonial offering to the ancestral mounds. Ordan riders guard the herds with intimate knowledge of every hillock, and their throat-singing carries for miles across the open ground. The downs are where the Ordan clan-meets are held, where migration routes are negotiated, and where bloodline disputes are settled before they can fester into war.',
    relatedTerms: ['sundrift-vale', 'house_ordavan', 'grass_tundra', 'the_long_steppe']
  },
  'the_long_steppe': {
    id: 'the_long_steppe',
    term: 'The Long Steppe',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'The vast central grasslands stretching horizon to horizon, navigated by the unique hum of ancestral burial mounds.',
    fullEntry: 'The Long Steppe is the Sundrift Vale\'s spine — the vast, featureless central grasslands that stretch from horizon to horizon, broken only by the occasional burial mound or standing stone. Caravans navigate by the hum of the ancestral mounds, each one producing a unique tone that carries through the earth and allows experienced travelers to fix their position with remarkable accuracy. The grass here is grey-green and tough as rope, growing waist-high in soil that the Ordavan Bargain ensures will always produce but never produce anything deeper than grass.',
    relatedTerms: ['sundrift-vale', 'house_ordavan', 'kumis_downs', 'ancestor_wold']
  },
  'nova_heath': {
    id: 'nova_heath',
    term: 'Nova Heath',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'Open heathland lit by Astril beacon-fires of crystalline Lien-wood, a gathering ground for solstice observances across all Astril castes.',
    fullEntry: 'Nova Heath is the Sundrift Vale\'s brightest landmark — open heathland where the Muren Astril maintain great pyres of crystalline Lien-wood that burn with pale, cold light visible for miles across the starless steppe. The beacons serve as gathering points for Astril of all castes during solstice observances, and the Muren use coded fire-patterns to transmit messages across the vast distances of the Vale. It is the closest thing the Astril have to a shared home — a place where Sylen, Muren, and even Unlit gather under light that none of them can take for granted.',
    relatedTerms: ['sundrift-vale', 'astril', 'starfall_vale', 'the_unlit_knoll']
  },

  // BRYNGLOOM FOREST
  'peat_bog_sinks': {
    id: 'peat_bog_sinks',
    term: 'Peat-Bog Sinks',
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A treacherous swamp of bottomless black peat filled with the preserved, aware corpses of ancient debtors risen from broken contracts.',
    fullEntry: 'The Peat-Bog Sinks are the Bryngloom\'s most lethal natural hazard — a swamp of bottomless, preserving black peat where the acidic water is thick enough to walk on and deep enough to swallow anything that breaks the surface. The preserved corpses of ancient debtors lie suspended in the peat, aware and watching through clouded eyes, risen when their contracts were broken by death. Morren Peat-Cutters harvest the bog\'s surface layers with practiced caution, while Drun Outcasts use the deeper sinks as disposal sites for things that must never be found.',
    relatedTerms: ['bryngloom-forest', 'sunken_spire', 'debt_revenant', 'cycle_eater']
  },
  'root_veil_scriptorium': {
    id: 'root_veil_scriptorium',
    term: 'Root-Veil Scriptorium',
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A hollow-root complex where Velun Inscriptors carve genealogies onto memory-glass tablets under the direct watch of the Keeper.',
    fullEntry: 'The Root-Veil Scriptorium is where the Neth\'s most sacred records are kept — a quiet complex built where the great ironwood roots descend into the deep bogs, close enough to the Root-Veil\'s mycelial network that the Inscriptors claim they can feel the Keeper\'s presence while they work. Velun scholars carve historical genealogies onto compressed memory-glass tablets here, producing records that the fog cannot erase and the peat cannot dissolve. It is the most legally significant location in the Bryngloom after the Heart-Vault of Atropolis itself.',
    relatedTerms: ['bryngloom-forest', 'atropolis', 'neth', 'keeper_of_the_last_threshold']
  },
  'over_shanty': {
    id: 'over_shanty',
    term: 'Over-Shanty',
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A chaotic hanging slum of rope-bridges beneath Atropolis, populated by Drun outcasts and Morren peat-cutters beyond the First Contract\'s reach.',
    fullEntry: 'Over-Shanty is the Bryngloom\'s open secret — a chaotic slum of rope-bridges and ramshackle cabins suspended beneath Atropolis\'s main platforms, populated by Drun Neth who burned their names from the First Contract and Morren peat-cutters who never had names there to begin with. No Neth law applies here. No Vreken ancestor watches. The Cult of Forgotten Shadow operates openly, running a memory-trade in extracted experiences that the Velun Pact-Lords officially deny exists. Everything in the Shanty sways, everything is for sale, and everyone is running from something.',
    relatedTerms: ['bryngloom-forest', 'atropolis', 'neth', 'peat_bog_sinks']
  },
  'drowned_dingle': {
    id: 'drowned_dingle',
    term: 'Drowned Dingle',
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A permanently flooded woodland valley where petrified ironwood trees chime like bells and Morren peat-cutters harvest in flat-bottomed boats.',
    fullEntry: 'The Drowned Dingle is the Bryngloom\'s most melancholic landscape — a wooded valley permanently flooded by bog water where dead ironwood trees stand like skeletal fingers above the dark surface, their petrified branches chiming like bells when the wind blows. Morren peat-cutters navigate the dingle in flat-bottomed boats, harvesting peat and occasionally pulling preserved corpses from the depths. The sound of the chiming trees carries for miles, a slow, random music that the Vreken claim are the voices of ancestors trying to speak through wood instead of bone.',
    relatedTerms: ['bryngloom-forest', 'black_fen', 'over_shanty', 'neth']
  },
  'thalrens_ledger_post': {
    id: 'thalrens_ledger_post',
    term: "Thalren's Ledger-Post",
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A shared Thalren-Morren archive outpost on the forest edge, where scribes copy Neth contract records onto vellum as insurance against the fog.',
    fullEntry: 'Thalren\'s Ledger-Post is a rare collaboration between two cultures that have little else in common — a hybrid outpost of peat-stone and ironwood where Thalren scribes copy Neth contract records onto calfskin vellum, creating duplicates that the fog cannot consume and the peat cannot dissolve. The Morren who co-manage the outpost see it as a business opportunity, charging the Neth for archival services while selling the Thalren access to Bryngloom trade routes. It serves as neutral ground in a forest where neutrality is a commodity more precious than gold.',
    relatedTerms: ['bryngloom-forest', 'root_veil_scriptorium', 'morrens_bogpost', 'neth']
  },
  'merryns_drift': {
    id: 'merryns_drift',
    term: "Merryn's Drift",
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A Merryn river-trading camp of lashed houseboats on the forest\'s western waterways, carrying goods between Bryngloom and the Iceheart Sea.',
    fullEntry: 'Merryn\'s Drift is the Bryngloom\'s aquatic lifeline — a cluster of houseboats lashed together on the forest\'s western waterways, perpetually bobbing in the slow-moving bog water as Merryn River-Traders shuttle goods between the Bryngloom and the Iceheart Sea. The Merryn here have adapted to fresh water over generations, their salt-scars fading into something gentler, but they retain the storm-sailors\' instinct for reading water and the tattooed ink-charts that mark every safe passage. The Drift is the only reliable overland trade route between the forest and the sea.',
    relatedTerms: ['bryngloom-forest', 'sunken_spire', 'thalrens_ledger_post', 'iceheart-sea']
  }
};
