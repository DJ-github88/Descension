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
    relatedTerms: ['house_tesshan', 'frostmaw_holdfast', 'groven', 'fexrick', 'thrumm', 'scrab']
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
    fullEntry: 'Ironjaw Port is the Neth\'s economic lung — their largest external outpost, built into frozen cliffs where the Gloom Forest meets the churning Iceheart Sea. Every trade route between the Bryngloom and the outside world passes through it. The port houses a copy of the First Contract, allowing Neth stationed here to operate without the Fading. The mixed Velun-Kessen council that governs the port has been quietly feuding for two centuries over tariff policy.',
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
    fullEntry: 'House Mereval rules the great, churning expanse of the Iceheart Sea. When their ancestors faced the freezing of the oceans during the Deepening, they bargained for navigable sea-lanes that would never freeze. The Warden accepted, but the price was the ocean\'s peace: the Iceheart would never sleep. Storm-cycles are now perpetual, and the sea must be fought as much as navigated. Their descendants rule from Merrowport, a floating city anchored to a warm submarine volcano, maintaining the trade routes that connect all seven regions.',
    relatedTerms: ['iceheart-sea', 'merrowport', 'minstrel']
  },
  'house_tesshan': {
    id: 'house_tesshan',
    term: 'House Tesshan',
    type: 'noble_house',
    region: 'cragjaw-peaks',
    summary: 'The mountain lords of the Cragjaw Peaks who traded visibility for a perpetual blizzard to hide their highland keeps from starving lowlanders.',
    fullEntry: 'House Tesshan rules the vertical labyrinth of the Cragjaw Peaks, where the eternal blizzard hides their fortress-keeps from the starving lowland riders. Their bargain traded spatial visibility for protective snow-veil — a dense, permanent whiteout that buries all natural landmarks. Their descendants survive through the Groven\'s Ancestor-Spans, the only thoroughfares above the blizzard line. The Tesshan value altitude as status and concealment as currency.',
    relatedTerms: ['cragjaw-peaks', 'frostmaw_holdfast', 'groven']
  },
  'house_ordavan': {
    id: 'house_ordavan',
    term: 'House Ordavan',
    type: 'noble_house',
    region: 'sundrift-vale',
    summary: 'The nomadic noble family of the Sundrift Vale who traded fertile soil for the endless migration, ensuring the steppe grass always returns to feed the great woolly herds.',
    fullEntry: 'House Ordavan governs the wind-swept, starless steppe of the Sundrift Vale. Their bargain traded fertile soil for the endless migration — the grass will always return, but nothing deeper than grass can take root. Their descendants follow the woolly herds in perpetual nomadic cycles, navigating by the hum of ancestral burial mounds. The Ordavan are increasingly puppeteered by the Unlit Veil, whose "advisors" have embedded themselves at every level of governance.',
    relatedTerms: ['sundrift-vale', 'synod_hold', 'astril']
  },
  'house_morrath': {
    id: 'house_morrath',
    term: 'House Morrath',
    type: 'noble_house',
    region: 'bryngloom-forest',
    summary: 'The seventh and most mysterious of the binding houses, who rule the Bryngloom Forest. Unique among the houses: they had nothing left to trade, so they borrowed their survival from the Neth.',
    fullEntry: 'House Morrath is the ghost among houses — the seventh noble family named in the Binding Compact, yet the one with the least surviving record. When the six other houses marched their firstborn to the northern peaks to satisfy Keth-Amar, Morrath had nothing left to trade that Keth-Amar would accept. Their survival was instead borrowed from the Neth — the scribe-clan who had already struck their own legalistic contract with the Keeper of the Last Threshold. This has produced a permanent tension: the Morrath are a noble house whose authority is mediated through the Neth\'s contract-law, making them simultaneously sovereign and subordinate, a contradiction that has defined the Bryngloom\'s politics for eight centuries.',
    relatedTerms: ['bryngloom-forest', 'neth', 'keth_amar']
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
  }
};
