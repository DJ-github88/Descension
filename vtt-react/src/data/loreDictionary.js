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
    relatedTerms: ['house_skalvyr', 'frozen_archive', 'skald', 'bloodhammer', 'stel', 'skreika']
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
  }
};
