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
    relatedTerms: ['house_thalreth', 'greymark_keep', 'mimir', 'briaran', 'gref', 'gambrel']
  },
  'nordhalla': {
    id: 'nordhalla',
    term: 'Nordhalla',
    type: 'region',
    region: 'nordhalla',
    summary: 'A brutalist cathedral of frozen black fjords and towering glaciers in the northern reaches, warmed only by deep geothermal sumps.',
    fullEntry: 'Nordhalla is a freezing wilderness where the advance of titanic, mountain-crushing glaciers was halted mid-stride by the desperate bargain of House Skalvyr. The tundra is a flat black mirror beneath a washed-out sky that has not seen true sunlight in eight centuries. Wind-carved ice sculptures stand as monuments to the ancient dead, and keeps are dug into geothermal volcanic vents. Survival here is an endurance-purist\'s trial, where bloodlines are fiercely guarded and the heat determines a family\'s status.',
    relatedTerms: ['house_skalvyr', 'frozen_archive', 'rime_born', 'bloodhammer', 'stel', 'skreika']
  },
  'sundale': {
    id: 'sundale',
    term: 'Sundale',
    type: 'region',
    region: 'sundale',
    summary: 'The scorched ashlands surrounding Emberspire, where the dying sun-god Sol was bound beneath the earth.',
    fullEntry: 'Sundale is the volcanic womb of the world, a desert of basalt, obsidian rivers, and perpetual ashfall. It is here that Sol was bound beneath the volcanic crust by the seven noble families to protect the star from the cosmic hunter Keth-Amar. Warmed by the world-heart volcano Emberspire, the region is thick with geothermal activity and soot-filled air. It is shared by the forge-clans of the Emberth, who tend the Solbrand, and the remnants of Solvarn humans who refuse to abandon the tomb of their star.',
    relatedTerms: ['house_solvan', 'emberspire', 'harath_vault', 'emberth', 'solbrand', 'cinder']
  },
  'iceheart-sea': {
    id: 'iceheart-sea',
    term: 'Iceheart Sea',
    type: 'region',
    region: 'iceheart-sea',
    summary: 'A violent, freezing ocean of city-sized icebergs and perpetual gales, navigated only by the grace of unfreezing currents.',
    fullEntry: 'The Iceheart Sea is a churning, frozen expanse where storm-cycles are perpetual and icebergs drift like slow-moving mountains. House Mereval traded calm waters for navigable sea-lanes that never freeze, ensuring trade routes remain open at the cost of the ocean never sleeping. Ships pitch and roll through freezing foam, and sailors navigate by bioluminescent light and the advice of the Merryn captains who tattoo their charts directly onto their skin.',
    relatedTerms: ['house_mereval', 'merrowport', 'ironjaw_port', 'myrathil', 'drowned_spume']
  },
  'cragjaw-peaks': {
    id: 'cragjaw-peaks',
    term: 'Cragjaw Peaks',
    type: 'region',
    region: 'cragjaw-peaks',
    summary: 'A vertical wilderness of howling blizzards and razor ridges, bridged together by the calcified spans of the Groven.',
    fullEntry: 'The Cragjaw Peaks are a vertical labyrinth of rock and ice where visibility was traded for a perpetual blizzard to hide the keeps of House Tesshan from the starving lowlanders. Centuries of drift have buried all natural landmarks, leaving the high mountain holds isolated. The only thoroughfares above the whiteout are the Ancestor-Spans — bridges grown from the bones of the Groven\'s willing dead, spanning bottomless ravines.',
    relatedTerms: ['house_tesshan', 'frostmaw_holdfast', 'groven', 'fexrick', 'thrum', 'scrab']
  },
  'sundrift-vale': {
    id: 'sundrift-vale',
    term: 'Sundrift Vale',
    type: 'region',
    region: 'sundrift-vale',
    summary: 'A wind-swept, starless steppe of dead tundra grass where nomadic clans follow woolly herds.',
    fullEntry: 'The Sundrift Vale stretches beneath a dark sky empty of stars, constellations, or navigable heavens. House Ordavan traded fertile soil for the endless migration, ensuring the steppe\'s grass always returns to feed the great woolly herds. Nomadic clans navigate the starless grasslands by memory and the hum of ancestral burial mounds, sharing the steppe with the crystal-skinned Astril who carry the constellation-spirits of Sol\'s ministers in their veins.',
    relatedTerms: ['house_ordavan', 'synod_hold', 'astril', 'lien', 'hungry_child']
  },
  'bryngloom-forest': {
    id: 'bryngloom-forest',
    term: 'Bryngloom Forest',
    type: 'region',
    region: 'bryngloom-forest',
    summary: 'A semi-frozen sinking bog and bioluminescent forest governed by the contracts of the silver-skinned Neth.',
    fullEntry: 'The Bryngloom Forest is a damp, twilight canopy where ironwood trees grow above bottomless, peat-sinking bogs. Here, the ancestors of the Neth struck a legalistic contract with the Root-Veil, trading death\'s finality for silver skin and stilled breath. It is a land of litigation, memory-preservation, and bioluminescent fungal groves, shared in cold silence with the lantern-eyed Vreken who sing to their glowing ancestors in inverted cathedrals.',
    relatedTerms: ['atropolis', 'sunken_spire', 'neth', 'vreken', 'cycle_eater', 'debt_revenant']
  },

  // NOBLE HOUSES
  'house_thalreth': {
    id: 'house_thalreth',
    term: 'House Thalreth',
    type: 'noble_house',
    region: 'frostwood-reach',
    summary: 'The noble lineage of the Frostwood Reach who traded the region\'s spatial clarity for an insulating, protective fog.',
    fullEntry: 'House Thalreth is the ancient ruling family of the Frostwood Reach, whose seat of power is Greymark Keep. Driven by a desperate need to protect their territory and wildlife from freezing solid during the Deepening, they bargained away the spatial clarity of the Reach. The resulting insulating fog keeps their ironwood timber warm but slowly eats the memories of their descendants, forcing them to maintain exhaustive, chained ledger-libraries to verify their lineages.',
    relatedTerms: ['frostwood-reach', 'greymark_keep']
  },
  'house_skalvyr': {
    id: 'house_skalvyr',
    term: 'House Skalvyr',
    type: 'noble_house',
    region: 'nordhalla',
    summary: 'The northern lords of Nordhalla who halted the glaciers at the price of an eternal winter.',
    fullEntry: 'House Skalvyr is the unyielding noble family of Nordhalla. During the sun\'s burial, when titanic glaciers advanced to grind their mountain keeps into dust, Skalvyr bargained with the Cosmic Warden to freeze the ice sheets in place. The Warden capitulated, halting the glaciers permanently — but decreed that summer would never return to the north. Their descendants rule the brutalist fjord-keeps, valuing cold-resistance above all.',
    relatedTerms: ['nordhalla', 'frozen_archive']
  },
  'house_solvan': {
    id: 'house_solvan',
    term: 'House Solvan',
    type: 'noble_house',
    region: 'sundale',
    summary: 'The tragic family of Sundale whose heirs were sacrificed to bind the dying star Sol beneath their ashlands.',
    fullEntry: 'House Solvan is the noble family of Sundale, heavily scarred by the history of the Great Breach. It was Solvan who spearheaded the entombment of Sol, flaying Aex to weave the binding seal. Pressed to extinction by the cold, they capitulated to Keth-Amar, marching their firstborn north. Their descendants remain in the scorched, soot-choked badlands of Emberspire, refusing to leave because leaving would mean admitting their ancestral sacrifice was meaningless.',
    relatedTerms: ['sundale', 'emberspire', 'keth_amar']
  },

  // FIGURES
  'grum': {
    id: 'grum',
    term: 'Grum Bloodhammer',
    type: 'historical_figure',
    region: 'nordhalla',
    summary: 'The legendary blacksmith of Emberspire who first manifested the violent biological rage of the Berserker.',
    fullEntry: 'Grum Bloodhammer was a master blacksmith who lived during the early centuries of the volcanic era. During a mining expedition in the frozen tunnels of Emberspire in the year 412, a colossal ice-wyrm burst into the chambers, threatening the workers. Refusing to flee, Grum threw down his tools and surrendered to the heat of the forge, igniting his blood and muscles in an overdrive surge of adrenaline. His boiling fury allowed him to shatter the wyrm\'s glacial hide, establishing the path of the Blood-Thief.',
    relatedTerms: ['berserker', 'sundale', 'nordhalla']
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
    fullEntry: 'Valerius was a high archivist of the Velun Neth in Atropolis. Evolving stilled breath and silver skin from the Neth\'s First Contract with the Keeper of the Last Threshold, Valerius realized that the magic of the Gloom Forest responded to the same legal syntax. By structuring incantations as strict, balanced legal documents, Valerius discovered he could crystallize his blood into volatile shards siphoned through iron, anchoring his limbs to the earth in a freezing lock and generating the first Arcanoneer spells.',
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
    fullEntry: 'The Mimir are a slender, rare people of the Frostwood Reach. Evolving from the forester Sylvain, who merged with a doppelganger death-omen, the Mimir possess the ability to shift their physical forms. Because the regional fog decays memory and threatened their identity, they began wearing masks carved from heartwood or storm-glass to lock their true forms. They are divided into the Mask-Borne canopy aristocrats, the Mist-Woven sentinels, and the Unwoven maskless floor-dwellers.',
    relatedTerms: ['frostwood-reach', 'gref']
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
    fullEntry: 'The Emberth are the broad-shouldered craftsmen and Sun-Speakers of Sundale. Warned by prophecy of the sun\'s death, their ancestors sheltered in the thermal caverns beneath Emberspire before the surface froze. They possess large, heat-sensitive eyes and long lungs adapted to thin air. They are divided into the Korr of the deep vault, who tend the Solbrand in holy silence, and the Thrask badland rangers who hunt and mine the volcanic frontier.',
    relatedTerms: ['sundale', 'solbrand', 'harath_vault']
  },
  'neth': {
    id: 'neth',
    term: 'Neth',
    type: 'race',
    region: 'bryngloom-forest',
    summary: 'An immortal, silver-skinned people of the Bryngloom Forest bound by legal contracts to the Root-Veil.',
    fullEntry: 'The Neth are a legalistic, stilled-breath people of Atropolis. Descended from a dying scribe-clan that negotiated a treaty with the Keeper of the Last Threshold, the Neth traded death\'s finality for survival. Their bloodlines are written in the First Contract, rendering them unable to tell a direct lie. They are divided into the silver-skinned Velun pact-lords, the Kessen weavers of the forest floor, and the leaden-grey Drun outcasts who legally do not exist.',
    relatedTerms: ['bryngloom-forest', 'atropolis', 'drun', 'velun', 'kessen']
  },
  'astril': {
    id: 'astril',
    term: 'Astril',
    type: 'race',
    region: 'sundrift-vale',
    summary: 'A crystal-skinned people of the Sundrift Vale whose bodies carry the nesting constellation-spirits of Sol\'s ministers.',
    fullEntry: 'The Astril are the luminous guardians of the starless steppe. When Sol was bound, the constellation-spirits of the sun\'s celestial court took refuge inside the bloodlines of the steppe peoples. This nesting manifests as crystalline, glowing skin patterns that hum with celestial resonance. They are divided into the Sylen, who seek total symbiosis with their spirits, the Muren, who bind and suppress them, and the Unlit, who carry no star-glow.',
    relatedTerms: ['sundrift-vale', 'synod_hold']
  },

  // RESOURCES
  'blood_heat': {
    id: 'blood_heat',
    term: 'Blood-Heat',
    type: 'resource',
    region: 'nordhalla',
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
    summary: 'The ancient, impartial cosmic arbitrator who accepted the seven noble dark bargains and enforces their terms unto eternity.',
    fullEntry: 'The Warden is not a god, not a spirit, not a force of nature in any conventional sense. It is the universe\'s mechanism of consequence — a presence older than Sol itself that exists to enforce the logic of exchange. When the seven noble houses of Mythrill sought to protect themselves from the dying of the sun and the advance of Keth-Amar, each house approached the Warden with a bargain: something precious traded for something necessary. The Warden accepted every offer without negotiation and without mercy, applying each agreed price with perfect, cold precision. It does not punish. It does not reward. It remembers every clause of every contract, and it enforces them without exception. Those who have encountered what they believe to be the Warden describe only a sensation: the certainty that a debt has just been recognized.',
    relatedTerms: ['the_deepening', 'the_breach', 'keth_amar', 'house_solvan']
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

  'deep_alchemists': {
    id: 'deep_alchemists',
    term: 'Deep Alchemists',
    type: 'faction',
    region: 'cragjaw-peaks',
    summary: 'The Fexrick industrial guild responsible for the alchemical creation of the Groven — and still operating in the abyssal tunnels beneath Frostmaw Crag.',
    fullEntry: 'The Deep Alchemists are the most dangerous sub-faction of the Fexrick goblinoid engineers — a guild of cold, methodical experimenters who treat living creatures as raw material to be refined. It was the Deep Alchemists who established vat-laboratories in the lightless tunnels beneath Frostmaw Crag and submerged captured Thrumm broodlings in alchemical serums to create the first Groven. When the Groven escaped in the Vat-Breakers\' revolt, the Deep Alchemists did not dissolve their program. They sealed their operations deeper, in tunnels too narrow and too hot for Groven pursuit, and continued their work. Recent Groven expeditions into the lower tunnels have returned with evidence of fresh alchemical residue and Groven-pattern scale fragments — suggesting the Lost Brood, the broodlings left behind during the escape, may still be alive in vats that have not seen daylight in centuries.',
    relatedTerms: ['groven', 'fexrick', 'cragjaw-peaks']
  },

  // ============================================================
  // CLASSES (27 traditions)
  // ============================================================

  'arcanoneer': {
    id: 'arcanoneer',
    term: 'Arcanoneer',
    type: 'class',
    region: 'bryngloom-forest',
    summary: 'A contract-mage who crystallizes their silver Neth blood into volatile shards, anchoring spells in legal precision rather than instinct.',
    fullEntry: 'The Arcanoneer tradition was formalized by Valerius, the great Velun archivist who realized that the Gloom Forest\'s ambient magic responded to the same syntax as Neth contract law. By structuring incantations as strict, legally-binding documents — with offer, consideration, and consequence — a caster can crystallize their blood into volatile Mnemonic Shards that anchor spells with extraordinary precision. The cost is rigidity: an Arcanoneer cannot improvise. Every spell must be prepared, structured, and filed. In combat this translates to absolute devastation within their prepared repertoire and near-helplessness outside it.',
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
  'bladedancer': {
    id: 'bladedancer',
    term: 'Bladedancer',
    type: 'class',
    region: 'frostwood-reach',
    summary: 'A blade-artist who fights in flowing, unpredictable patterns that mirror the fog-eating movements of the Frostwood mist.',
    fullEntry: 'The Bladedancer tradition was born in the Frostwood Reach, where combat in dense fog taught fighters that rigid, predictable stance-work was lethal. A Bladedancer never occupies the same position twice, flowing between strikes and repositioning with the fluid inevitability of water. They are not duelists — they do not stand their ground. They are current-walkers, exploiting momentum, using each deflection to feed the next strike. Their footwork is so integrated with their blade-work that separating the two is impossible.',
    relatedTerms: ['frostwood-reach', 'house_thalreth']
  },
  'chaos_weaver': {
    id: 'chaos_weaver',
    term: 'Chaos Weaver',
    type: 'class',
    region: 'sundrift-vale',
    summary: 'A wild-magic practitioner who surrenders control of their spellcasting to the raw, unpredictable Wyrd — accepting catastrophic variance for catastrophic power.',
    fullEntry: 'The Chaos Weaver does not cast spells. They invite the Wyrd to act through them and negotiate, in the fraction of a second between intention and detonation, for the result to be in their general direction. The tradition originated in the Sundrift Vale, where the steppe\'s gravity anomalies and silt-tides created zones of ambient Wyrd-density that swallowed conventional magical theory. A Chaos Weaver\'s power scales with their willingness to accept the cost — a spell that could heal might incinerate, a spell that could shield might transpose. The tradition demands philosophical surrender and produces practitioners who are either terrifyingly effective or catastrophically self-destructive.',
    relatedTerms: ['sundrift-vale', 'house_ordavan']
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
  'covenbane': {
    id: 'covenbane',
    term: 'Covenbane',
    type: 'class',
    region: 'bryngloom-forest',
    summary: 'A witch-hunter who severs magical bindings and contracts, trained to hunt the Drun outcasts and rogue coven-mages of the Bryngloom.',
    fullEntry: 'The Covenbane tradition arose in the Bryngloom Forest, where the complexity of Neth contract magic and Vreken ancestral spirit-bonds created both incredible power and incredible loopholes. A Covenbane specializes in identifying, disrupting, and severing magical contracts — whether the target is a Drun Neth whose void-sealed body resists conventional magic, a Vreken shaman whose ancestral binding has gone rogue, or a court mage whose contracted familiar has turned against them. They are not magic-resistant by nature; they are magic-literate in the way a surgeon is anatomy-literate.',
    relatedTerms: ['bryngloom-forest', 'neth', 'vreken']
  },
  'deathcaller': {
    id: 'deathcaller',
    term: 'Deathcaller',
    type: 'class',
    region: 'bryngloom-forest',
    summary: 'A necromancer who communes with the ancestors preserved in the Vreken death-song tradition, compelling or bargaining with the luminous dead.',
    fullEntry: 'The Deathcaller tradition grew from the Vreken practice of preserving ancestral spirits in luminous death-song bodies. A Deathcaller is not a conventional necromancer raising mindless dead — they are negotiators, historians, and occasionally hostage-takers of the specific, named dead who remember exactly who they were in life. A Vreken ancestor compelled by a Deathcaller may be furious, cooperative, mournful, or pedantic depending on who they were. The tradition demands deep knowledge of Vreken genealogy, death-song protocols, and the political histories of the Bryngloom forest clans.',
    relatedTerms: ['bryngloom-forest', 'vreken', 'neth']
  },
  'doomsayer': {
    id: 'doomsayer',
    term: 'Doomsayer',
    type: 'class',
    region: 'nordhalla',
    summary: 'A prophet of inevitable catastrophe who weaponizes despair — turning the certainty of bad outcomes into a tactical resource.',
    fullEntry: 'The Doomsayer tradition was born in Nordhalla\'s eternal winter, where centuries of darkness produced a philosophical tradition that separated hope from planning. A Doomsayer does not lie when they predict catastrophe — they are usually right. Their power derives from having thought through every bad outcome in advance and prepared for it. In combat, a Doomsayer identifies the worst-case scenario and ensures everyone else has already accepted it — reducing the tactical shock of disaster to near-zero while leaving enemies still in denial. They are simultaneously the least comforting and most reliable battlefield presence in any party.',
    relatedTerms: ['nordhalla', 'house_skalvyr']
  },
  'dreadnaught': {
    id: 'dreadnaught',
    term: 'Dreadnaught',
    type: 'class',
    region: 'cragjaw-peaks',
    summary: 'An armored juggernaut who fights as a moving fortification — trading speed and agility for absolute, immovable control of a zone.',
    fullEntry: 'The Dreadnaught tradition originated in the Cragjaw Peaks, where the verticality of combat on narrow mountain bridges made any warrior who could not be moved effectively invincible. A Dreadnaught does not pursue enemies — they establish a position and make it prohibitively costly to challenge. Their armor is not decorative; it is structural. Their weapons are not for offense — they are for enforcement. A Dreadnaught stands where they stand until the tactical situation resolves around them.',
    relatedTerms: ['cragjaw-peaks', 'groven']
  },
  'exorcist': {
    id: 'exorcist',
    term: 'Exorcist',
    type: 'class',
    region: 'frostwood-reach',
    summary: 'A spirit-hunter who tracks and dispels Wyrd-horrors born from human fear in the fog-choked Frostwood — using ritual, iron, and carefully named words.',
    fullEntry: 'The Exorcist tradition was formalized in the Frostwood Reach, where the ambient fog births Wyrd-horrors directly from concentrated human fear. An Exorcist\'s primary tool is nomenclature — the Wyrd-horrors of the Reach can only be permanently destroyed if correctly named, and naming a fear-construct requires understanding what specific terror generated it. An Exorcist is part hunter, part therapist, part archivist. They maintain classified bestiary records of every Wyrd-manifestation by emotional origin, and their rituals involve both iron implements and carefully negotiated vocabulary.',
    relatedTerms: ['frostwood-reach', 'house_thalreth', 'gref', 'gambrel']
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
  'fate_weaver': {
    id: 'fate_weaver',
    term: 'Fate Weaver',
    type: 'class',
    region: 'cragjaw-peaks',
    summary: 'A probability-manipulator who reads the threads of consequence and gently redirects them — making unlikely outcomes inevitable without apparent intervention.',
    fullEntry: 'The Fate Weaver tradition draws from the Kessen Neth\'s practice of probability-web reading in the Bryngloom Forest, refined through the high-stakes toll negotiations of the Cragjaw Peaks. A Fate Weaver does not control fate — they nudge it. Their power is the power of compound interest: small adjustments made early that accumulate into dramatically different outcomes. They win battles before they start by ensuring the terrain, weather, and morale are all marginally more favorable. They are impossible to credit with specific victories and impossible to blame for specific losses.',
    relatedTerms: ['cragjaw-peaks', 'neth', 'bryngloom-forest']
  },
  'formbender': {
    id: 'formbender',
    term: 'Formbender',
    type: 'class',
    region: 'cragjaw-peaks',
    summary: 'A body-sculptor who reshapes their own biological structure in real time — an art born from the Fexrick\'s alchemical transformation of the Thrumm.',
    fullEntry: 'The Formbender tradition is directly descended from the Fexrick Deep Alchemists\' work on the Thrumm — but the Formbenders turned the knowledge back inward. Where the alchemists modified others, a Formbender modifies themselves. The tradition requires an intimate, clinical understanding of one\'s own biology and the ability to override pain and self-preservation instincts that would stop ordinary practitioners short. A Formbender can reshape joints, redistribute mass, alter density, and temporarily restructure sensory organs. The price is that the body remembers each transformation and accumulates biological debt.',
    relatedTerms: ['cragjaw-peaks', 'groven', 'deep_alchemists']
  },
  'gambler': {
    id: 'gambler',
    term: 'Gambler',
    type: 'class',
    region: 'iceheart-sea',
    summary: 'A tidal-luck manipulator who bets their own fortune on every action — making high-variance, high-reward plays with genuine stakes.',
    fullEntry: 'The Gambler tradition grew from the storm-chasing Merryn culture of the Iceheart Sea, where the difference between a good sail and death was frequently a single decision made with incomplete information. A Gambler does not cheat the odds — they find odds that favor them and bet accordingly. Their resource is not mana or stamina but luck itself, tracked as a fluid commodity that rises with risk-taking and depletes with caution. A Gambler forced into a defensive posture loses effectiveness. A Gambler allowed to drive their own risk calculus is terrifying.',
    relatedTerms: ['iceheart-sea', 'house_mereval']
  },
  'huntress': {
    id: 'huntress',
    term: 'Huntress',
    type: 'class',
    region: 'frostwood-reach',
    summary: 'A predator-specialist who uses terrain, patience, and anatomical knowledge to dismantle targets with clinical efficiency from beyond engagement range.',
    fullEntry: 'The Huntress tradition is older than any noble house in the Frostwood Reach — it predates the fog and the bargains, rooted in the practical necessity of hunting blind through mist-choked timber. A Huntress does not fight in the conventional sense. They identify, track, position, and resolve targets with the minimum expenditure of force required. Their knowledge of anatomy is comprehensive and non-squeamish — every debilitating strike targets a specific nerve cluster, joint, or blood vessel. They are not warriors. They are problems solved.',
    relatedTerms: ['frostwood-reach', 'mimir']
  },
  'inscriptor': {
    id: 'inscriptor',
    term: 'Inscriptor',
    type: 'class',
    region: 'nordhalla',
    summary: 'A rune-scribe who tattoos power directly onto flesh — their own or their allies\' — creating permanent magical inscriptions with irreversible costs.',
    fullEntry: 'The Inscriptor tradition was born in Nordhalla from the desperate need to carry power externally — in a world where memory and spirit can be eaten by ice and cold, writing something onto a body ensures it survives what the mind might not. An Inscriptor\'s spells are not cast; they are carved. The runes are permanent, the power is permanent, and the cost is permanent. An Inscriptor who writes the wrong inscription or writes it incorrectly cannot erase it. They carry their mistakes on their skin forever, alongside their triumphs.',
    relatedTerms: ['nordhalla', 'house_skalvyr']
  },
  'lichborne': {
    id: 'lichborne',
    term: 'Lichborne',
    type: 'class',
    region: 'bryngloom-forest',
    summary: 'A mortal who has negotiated partial undeath — alive enough to function, dead enough to be immune to things that kill the living.',
    fullEntry: 'The Lichborne tradition is the Bryngloom Forest\'s most controversial and most misunderstood practice. A Lichborne has not died — they have arranged to be perpetually dying, indefinitely deferred. By striking a contract with the Keeper of the Last Threshold that leaves the terms permanently unresolved, a Lichborne occupies a legal liminal state: technically alive but sustaining themselves on a combination of fungal-necromantic resonance and willpower. They retain full cognition, full agency, and most of their emotional range — though the latter tends to simplify over decades. They are immune to several methods of killing the living while remaining vulnerable to methods that destroy the dead.',
    relatedTerms: ['bryngloom-forest', 'neth', 'vreken']
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
  'oracle': {
    id: 'oracle',
    term: 'Oracle',
    type: 'class',
    region: 'sundrift-vale',
    summary: 'A constellation-spirit medium who channels the imprisoned ministers of Sol\'s court — trading their physical senses for superhuman perception and prophetic access.',
    fullEntry: 'The Oracle tradition belongs to the Astril — specifically, to those who chose symbiosis with the constellation-spirit nesting in their skin rather than suppression of it. An Oracle does not have visions. They receive reports — structured, filed, occasionally bureaucratic communications from the celestial intelligence sharing their body. The spirits are not omniscient but they are ancient, and they remember the world before Sol was buried. An Oracle\'s power comes from that memory and the spirit\'s ability to perceive things outside the mortal sensory range. The cost is that the spirit\'s agenda occasionally supersedes the host\'s.',
    relatedTerms: ['sundrift-vale', 'astril']
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
  'primalist': {
    id: 'primalist',
    term: 'Primalist',
    type: 'class',
    region: 'sundrift-vale',
    summary: 'An instinct-warrior who strips away civilization\'s constraints to access the raw, predatory capability buried under generations of social conditioning.',
    fullEntry: 'The Primalist tradition is the Sundrift Vale\'s answer to an environment that kills the hesitant. Under the starless sky, with predators moving through silt-tides that silence sound, the nomadic Ordan clans produced fighters who could not afford the fraction-of-a-second delay that conscious decision-making requires. A Primalist operates on trained instinct — reflexes that have been drilled past the point of thought. They are not berserkers; they do not lose control. They are the opposite: utterly in control of a self that has been simplified to its most essential, most dangerous form.',
    relatedTerms: ['sundrift-vale', 'house_ordavan']
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
    type: 'class',
    region: 'sundale',
    summary: 'A massive-force specialist who enhances their physical scale and impact to fight as a singular, overwhelming presence.',
    fullEntry: 'The Titan tradition is the Sundale forge-clans\' answer to the same question the Berserkers of Nordhalla answered differently: how do you make one body sufficient against many? Where the Berserker burns hotter, the Titan grows larger — drawing on the geothermal resonance of the volcanic Sundale landscape to temporarily increase their physical scale, density, and impact. A Titan does not fight fast. They fight with the patient certainty of an avalanche: inevitable, immovable, and ultimately unstoppable if allowed to build momentum.',
    relatedTerms: ['sundale', 'emberth', 'groven']
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
  'witch_doctor': {
    id: 'witch_doctor',
    term: 'Witch Doctor',
    type: 'class',
    region: 'bryngloom-forest',
    summary: 'A spirit-surgeon who navigates the boundary between the living and the ancestral dead, performing interventions on both that neither domain can perform alone.',
    fullEntry: 'The Witch Doctor tradition is the Bryngloom Forest\'s most socially central practice — the person who speaks to both the Vreken\'s luminous dead and the living, mediating disputes that span generations. A Witch Doctor performs spirit-surgery: the removal of lingering ancestral trauma from the living, the anchoring of unstable death-song spirits in the dead, and the negotiation of the Keeper of the Last Threshold\'s claims when they come due unexpectedly. They are healers in the deepest sense — they heal relationships between the dead and the living that would otherwise fester into haunting.',
    relatedTerms: ['bryngloom-forest', 'vreken', 'neth']
  },
  'corvani': {
    id: 'corvani',
    term: 'Corvani',
    type: 'race',
    region: 'frostwood-reach',
    summary: 'Highland seer-scouts bound to the Corvid Fate-Spirits, carrying destiny on raven wings and shifting markings.',
    fullEntry: 'The Corvani are the resilient survivors of the Frostwood Reach\'s highest ridges, dwelling in stone eyries carved directly into sheer basalt cliffs above the tree line. Refusing to succumb to Keth-Amar\'s capitulation or noble rule, their ancestors struck a fate-bond with the ancient Corvid Fate-Spirits to preserve their memories against the memory-erasing fog. In exchange, they accepted the spirits\' mark: shifting, raven-feather markings on their skin, obsidian-dark eyes sensitive to intense light, and premonitive sight that reveals threads of shifting destiny.',
    relatedTerms: ['frostwood-reach', 'mimir', 'corvid_speech']
  },
  'corvid_speech': {
    id: 'corvid_speech',
    term: 'Corvid-Speech',
    type: 'cultural_practice',
    region: 'frostwood-reach',
    summary: 'The complex, polyphonic throat-signed language of the Corvani, utilizing both clicks and whispers.',
    fullEntry: 'Corvid-Speech is the ancestral language of the Corvani, born from imitation of the Corvid Fate-Spirits and the howling winds of the mountain passes. It is a polyphonic tongue that combines soft clicks, whistling, and low-frequency throat vibrations with subtle shifting of their fate-spun markings. This structure makes the language incredibly dense and near-impossible for other races to speak fluently without magical aid, but permits the Corvani to communicate silently and across vast distances in the high basalt spires.',
    relatedTerms: ['corvani', 'frostwood-reach']
  },
  'rime_born': {
    id: 'rime_born',
    term: 'Rime-Born',
    type: 'race',
    region: 'nordhalla',
    summary: 'The frost-touched, non-human survivors of Nordhalla\'s eternal winter, carrying the freezing stasis of the Hunger Pact.',
    fullEntry: 'The Rime-Born (historically referred to as the Breath-Takers or Hrym) are a stoic, formidable people of Nordhalla\'s frozen fjords. Evolving from refugees of the Hunger Pact who consumed their own dead during a three-winter blizzard, they carry a supernatural cold in their blood. Their skin feels like stone left in shadow, their breath freezes even in southern heat, and they suffer from the Milk-Grief—a supernatural labor-cold that drains a mother\'s warmth to save the child. They are divided into the library-dwelling Rune Keepers, the fury-driven Bloodhammers, and the blue-skinned Frostbound.',
    relatedTerms: ['nordhalla', 'house_skalvyr', 'bloodhammer', 'stel', 'skreika']
  }
};
