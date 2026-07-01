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
    summary: 'A dense, fog-choked ironwood forest in the western hemisphere, governed under the Sovereign Ledger and policed by the Sunder-Palisade check-posts.',
    fullEntry: 'The Frostwood Reach is an ironwood forest wreathed in protective, memory-erasing fog. To prevent it from freezing, House Thalreth traded spatial clarity for insulating mist. Recently, Jarl-Archivist Kaelen Thalreth enforced the Sovereign Ledger, declaring unrecorded property rights void. The region is policed by Mist-Sentinels along the Ironwood Palisade and choked by the Scribe-Cartel monopoly on ink and parchment. Society is split between the registered Ledgered and the outlawed, undocumented Forgotten.',
    relatedTerms: ['apex', 'bladedancer', 'bramble_heath', 'briaran', 'drunhold', 'gambrel', 'gref', 'greymark_keep', 'greythorn_copse', 'grimmwood', 'house_thalreth', 'house_viridane', 'ironwood_heart', 'ledger_halls', 'lunarch', 'mimir', 'mirror_mere', 'mistbarrow', 'rite-of-masks', 'scribes_tower', 'shaper', 'siltmire_flats', 'skalds_landing', 'the_shallows', 'the_shifting_fen', 'toxicologist', 'wraithfen', 'inquisitor', 'veyra', 'sylvanus', 'elias', 'vrael-forty-seventh', 'bri-vessela', 'varis', 'sylas', 'kaelen-thalreth', 'aldren-thalreth', 'elara-thalreth', 'caedren-thalreth', 'thorn-speaker', 'vellan-archivist', 'selene']
  },
  'nordhalla': {
    id: 'nordhalla',
    term: 'Nordhalla',
    type: 'region',
    region: 'nordhalla',
    summary: 'A brutalist cathedral of frozen black fjords and towering glaciers in the northern reaches, fractured by King-Jarl Járn-Tand\'s consolidation and the Sunder-Wall.',
    fullEntry: 'Nordhalla is a freezing wilderness where the advance of titanic glaciers was halted by House Skalvyr\'s bargain. It is currently ruled with an iron fist by King-Jarl Halvar Skalvyr, known as Járn-Tand (Iron-Tooth), who unified the region\'s clans by force. Járn-Tand constructed the Sunder-Wall to regulate the nomadic Fredløse clans and enforce a trade monopoly through the Icechamber Syndicate. The region is marked by intense conflict between loyal Fastboende and outlaw clans, and a campaign of religious persecution known as the Cleansing of the Hearth which targets tribal Animists.',
    relatedTerms: ['augur', 'berserker', 'bloodhammer_sump', 'corvani', 'corvid_speech', 'fjord_gate', 'frozen_archive', 'harbinger', 'house_skalvyr', 'hunger_glaciers', 'rime_born', 'rimors_hearth', 'rooks_promontory', 'skald', 'skalds_landing', 'skalds_longport', 'stel', 'the_still_crag', 'the_warden', 'vargtor', 'vesperas_perch', 'warden', 'ymirs_col', 'animist', 'malakor', 'theron', 'frostcirque', 'xyris', 'sera-three-scars', 'skadi-glass-eye', 'mor-vereth', 'halvar-skalvyr', 'the-first-liar', 'sigurd-skalvyr', 'frigga-skalvyr', 'cassia', 'triune-founders']
  },
  'sundale': {
    id: 'sundale',
    term: 'Sundale',
    type: 'region',
    region: 'sundale',
    summary: 'The scorched ashlands surrounding Emberspire, currently governed by Hierophant Aethelgard\'s Dawn Vigil.',
    fullEntry: 'Sundale is a volcanic ashland desert surrounding the tomb of the sun-god Sol. After the collapse of House Solvan, the region was seized by Hierophant Aethelgard and the Dawn Vigil, who rule it as a martial-theocracy. The state enforces the Caldera Labor-Levies, conscripting the youth into the Martyr Brigades to mine sulfur for the Korr priests\' Sulfur Cartel monopoly. The population is split between the wealthy Deep-Born who live in the Harath-Vault and the impoverished Ash-Dwellers who are blockaded by the Obsidian Citadels.',
    relatedTerms: ['aex', 'basalt_shyr', 'cinder_badlands', 'cinderhoodoo', 'damon', 'dawn_vigil', 'ember_lagoon', 'emberspire', 'emberspire_caldera', 'emberth', 'great_forge', 'grum', 'harath_vault', 'house_solvan', 'inferno_veil', 'keth_amar', 'martyr', 'pyrofiend', 'scathrach', 'sera', 'slag_gulch', 'solbrand', 'sols_anvil_mesa', 'spellguard', 'the_ashen_escarpment', 'the_breach', 'the_deepening', 'titan', 'vault_breath', 'vulkars_karst', 'berserker', 'hark-ash-hammer', 'sol-kaessen', 'sol-vareths', 'thrak-damos', 'dawn-vigil-commander', 'solvan-steward', 'grum-bloodhammer', 'sera-solvan', 'first-cabal']
  },
  'iceheart-sea': {
    id: 'iceheart-sea',
    term: 'Iceheart Sea',
    type: 'region',
    region: 'iceheart-sea',
    summary: 'A violent, churning ocean of city-sized icebergs, governed by the Sea-Charter and policed by the Unfreezing Booms.',
    fullEntry: 'The Iceheart Sea is a storm-lashed ocean where navigable channels never freeze. Recently, Grand Admiral Varis Mereval enforced the Sea-Charter, mandating ship registry with the Mereval Board of Trade. The region is policed by patrol ironclads along the Unfreezing Booms and controlled by the Brine-Bond Syndicate. Undocumented refugees are pressed into lifetime servitude under Press-Warrants. Society is split between the Deck-Born officers and pressed Bilge-Dwellers, while traditional Tide-Speak animism is suppressed under the Luck-Ledger.',
    relatedTerms: ['deepwell_archipelago', 'first_shore', 'gale_storm_shallows', 'house_mereval', 'ironjaw_port', 'kelpies_cove', 'merrowport', 'merryns_drift', 'minstrel', 'myrathil', 'skalds_longport', 'spindrift_lagoon', 'the_saltmaw_estuary', 'the_shivering_bight', 'treakous_rift', 'wraithsound', 'gambit', 'jax', 'merr-cael', 'mer-lyrisa', 'mereval-admiral', 'lyris']
  },
  'cragjaw-peaks': {
    id: 'cragjaw-peaks',
    term: 'Cragjaw Peaks',
    type: 'region',
    region: 'cragjaw-peaks',
    summary: 'A vertical labyrinth of howling blizzards, governed by the Knotted Decree and linked by Groven bone-spans.',
    fullEntry: 'The Cragjaw Peaks are a vertical wilderness of razor ridges. Since House Tesshan traded visibility for a perpetual snow-veil, the region has been buried in blizzard. It is ruled by Jarl-Inca Oda Tesshan, who enforces the Knotted Decree, replacing written script with knotted khipus. The region is governed through the Steam-Line Cartel monopoly and the Tesshan-Mit\'a forced labor system. Its population is split between the high keeps\' Terraced and the lower chasms\' Chasm-Dwellers, while Yokai like the Yuki-Onna and Tengu-Crows stalk the cliffs.',
    relatedTerms: ['ancestor_gaps', 'chronarch', 'deepchasm_keep', 'dreadnaught', 'fexrick', 'frostmaw_holdfast', 'frostmaw_massif', 'gambit', 'gearworks_gulch', 'groven', 'house_tesshan', 'iron_ravine', 'lost_brood_vats', 'stags_rest_moraine', 'sump_galleries', 'sump_rift', 'the_great_gorge', 'the_spans', 'thrumm', 'shaper', 'warden', 'torin', 'alaric', 'veyra', 'lyra', 'fex-vestara', 'deep-alchemist-prime', 'vat-breaker-foreman', 'tesshan-lord', 'nesta']
  },
  'sundrift-vale': {
    id: 'sundrift-vale',
    term: 'Sundrift Vale',
    type: 'region',
    region: 'sundrift-vale',
    summary: 'A starless nomadic steppe governed by the Iron-Yurt Law and mapped by Steppe-Staves.',
    fullEntry: 'The Sundrift Vale is a flat, wind-swept steppe beneath a starless sky. House Ordavan traded fertile soil for the endless migration. It is ruled by Khatun Bayarmaa Ordavan under the Iron-Yurt Law, which regulates grazing pastures using bone Steppe-Staves. Nomadic clans perform the mandatory Ordan-Urtuu post-system service and pay a heavy Herd-Tithe. The population is split between the horse-owning Mounted and the walking Unmounted, while traditional star-communing Sky-Singers are persecuted by the state.',
    relatedTerms: ['ancestor_mounds', 'ancestor_wold', 'astril', 'false_prophet', 'grass_tundra', 'harbinger', 'house_ordavan', 'kumis_downs', 'lien_stalked_grazes', 'morrens_bogpost', 'mound_camps', 'nova_heath', 'starfall_vale', 'synod_hold', 'the_long_steppe', 'the_unlit_knoll', 'animist', 'xyris', 'kael', 'sera-three-scars', 'mor-vereth', 'loras-ordavan', 'li-wei', 'triune-founders']
  },
  'bryngloom-forest': {
    id: 'bryngloom-forest',
    term: 'Bryngloom Forest',
    type: 'region',
    region: 'bryngloom-forest',
    summary: 'A twilight ironwood canopy and sinking peat-bog, governed by the First Contract and the Great Registry.',
    fullEntry: 'The Bryngloom Forest is a twilight swamp. Since the Neth signed the First Contract with the Keeper of the Last Threshold, the region has been governed by legalistic debt-covenants. It is ruled by Regent Morrath Neth, who enforces the Great Registry at Atropolis. Passage is controlled via the living-ironwood Toll-Dikes, and the economy is driven by the Peat-Debt Bondage. Poor Morren are trapped in peonage, while deceased debtors are conscripted into postmortem labor as Debt-Revenants. Traditional Swamp-Song animism is suppressed under Registry-Rituals.',
    relatedTerms: ['animist', 'aran_glen', 'arcanoneer', 'atropolis', 'black_fen', 'covenbane', 'deathcaller', 'drowned_dingle', 'elias', 'exorcist', 'fangmere_grove', 'gambit', 'house_morrath', 'hunters_gully', 'inquisitor', 'ironjaw_port', 'keeper_of_the_last_threshold', 'kora', 'lichborne', 'merryns_drift', 'morrens_bogpost', 'neth', 'orven', 'over_shanty', 'peat_bog_sinks', 'plaguebringer', 'revenant', 'root_veil', 'root_veil_scriptorium', 'sunken_spire', 'thalrens_ledger_post', 'valerius', 'vel_keth_bayou', 'vesper', 'vreken', 'widows_quagmire', 'lyra', 'nyssa', 'sera-three-scars', 'vrael-forty-seventh', 'vespera', 'kor-vasseth', 'triune-founders']
  },

  // NOBLE HOUSES
  'house_thalreth': {
    id: 'house_thalreth',
    term: 'House Thalreth',
    type: 'noble_house',
    region: 'frostwood-reach',
    summary: 'The noble lineage of the Frostwood Reach who traded the region\'s spatial clarity for an insulating fog, now enforcing the Sovereign Ledger.',
    fullEntry: 'House Thalreth is the ancient ruling family of the Frostwood Reach, whose seat of power is Greymark Keep. Driven to protect their lands from the Freeze-Front, they traded spatial clarity for insulating fog. The current lord, Jarl-Archivist Kaelen Thalreth, enforces the Sovereign Ledger, stripping undocumented peoples of their rights. The house maintains the Scribe-Cartel monopoly on ink and paper, and operates the Tapestry-Wards to forcibly assimilate frontier and Mimir children into structured runic logic.',
    relatedTerms: ['briaran', 'frostwood-reach', 'gambrel', 'greymark_keep', 'greythorn_copse', 'house_viridane', 'mirror_mere', 'mistbarrow', 'scribes_tower', 'skalds_landing', 'the_warden', 'toxicologist', 'kaelen-thalreth', 'aldren-thalreth', 'elara-thalreth', 'caedren-thalreth']
  },
  'house_skalvyr': {
    id: 'house_skalvyr',
    term: 'House Skalvyr',
    type: 'noble_house',
    region: 'nordhalla',
    summary: 'The northern lords of Nordhalla who halted the glaciers at the price of eternal winter, now represented by King-Jarl Járn-Tand.',
    fullEntry: 'House Skalvyr is the unyielding ruling family of Nordhalla. During the solar burial, they traded summer to freeze the grinding glaciers in place. Recently, the house consolidated its rule under King-Jarl Halvar Skalvyr (Járn-Tand), who unified the clans by force. To fund his mercenaries, Járn-Tand mortgaged regional resources to southern syndicates, establishing the Icechamber Syndicate trade monopoly. The house enforces its rule through the Sunder-Wall and the Runic Academies, suppressing ancestral animism in favor of controlled runic calculations.',
    relatedTerms: ['augur', 'bloodhammer_sump', 'corvani', 'fjord_gate', 'frozen_archive', 'harbinger', 'hunger_glaciers', 'nordhalla', 'rime_born', 'skald', 'skalds_landing', 'stel', 'the_warden', 'vargtor', 'vesperas_perch', 'warden', 'ymirs_col', 'halvar-skalvyr', 'sigurd-skalvyr', 'frigga-skalvyr']
  },
  'house_solvan': {
    id: 'house_solvan',
    term: 'House Solvan',
    type: 'noble_house',
    region: 'sundale',
    summary: 'The tragic noble family of Sundale, recently sidelined by the Dawn Vigil theocracy.',
    fullEntry: 'House Solvan is the ancient noble lineage of Sundale that spearheaded the entombment of Sol. Following Keth-Amar\'s breach and the collapse of the Solvan Imperium, the house lost its political legitimacy as the volcanic vents began to cool. The family has been largely sidelined by Hierophant Aethelgard and the Dawn Vigil. Their remaining descendants live in the shadow of Emberspire, witnessing their lands being industrially fractured and their youth conscripted by the state.',
    relatedTerms: ['aex', 'basalt_shyr', 'dawn_vigil', 'ember_lagoon', 'emberspire', 'great_forge', 'keth_amar', 'martyr', 'sera', 'solbrand', 'sols_anvil_mesa', 'sundale', 'the_ashen_escarpment', 'the_warden', 'solvan-steward', 'sera-solvan', 'sol-kaessen', 'sol-vareths', 'dawn-vigil-commander', 'first-cabal']
  },

  // FIGURES
  'grum': {
    id: 'grum',
    term: 'Grum Bloodhammer',
    type: 'historical_figure',
    region: 'sundale',
    summary: 'The legendary forge-blacksmith of Emberspire in Sundale who first manifested the Berserker\'s Blood-Heat by surrendering to the volcanic forge during a wyrm attack.',
    fullEntry: 'Grum Bloodhammer was a master forge-blacksmith of the Emberspire volcanic forges in Sundale. During a deep-geyser mining expedition in the volcanic tunnels in the early decades of the Dimming, a colossal ice-wyrm that had been stalking the heated vents burst into the chambers, threatening dozens of workers. Refusing to flee, Grum threw down his tools and deliberately surrendered to the searing heat of the forge, igniting his blood and muscles in an overdrive frenzy of adrenaline. His boiling fury allowed him to shatter the wyrm\'s glacial hide with his bare fists, establishing the path of the Blood-Heat.',
    relatedTerms: ['berserker', 'blood_heat', 'emberspire', 'sundale', 'hark-ash-hammer']
  },
  'sera': {
    id: 'sera',
    term: 'Sera Solvan',
    type: 'historical_figure',
    region: 'sundale',
    summary: 'The Solvarn mother who carved her sacrificed child\'s name into her flesh, becoming the first Martyr.',
    fullEntry: 'Sera Solvan was a mother of House Solvan during the dark years of the capitulation. When the six noble houses marched their firstborn heirs to the northern peaks to be devoured by Keth-Amar, Sera refused to let her child\'s memory be erased by the houses\' subsequent history-purge. She carved her sacrificed child\'s name directly into her forearm with volcanic obsidian. The wound healed into a glowing, sympathetic solar scar, marking the first Martyr path that absorbs the suffering of others.',
    relatedTerms: ['devotion_gauge', 'house_solvan', 'martyr', 'sundale', 'sol-kaessen']
  },
  'valerius': {
    id: 'valerius',
    term: 'Valerius',
    type: 'historical_figure',
    region: 'bryngloom-forest',
    summary: 'The Velun Neth archivist who formulated the rigid, contract-based spellcasting of the Arcanoneer.',
    fullEntry: 'Valerius was a high archivist of the Velun Neth in Atropolis. Evolving stilled breath and silver skin from the Neth\'s First Contract with the Keeper of the Last Threshold, Valerius realized that the magic of the Bryngloom Forest responded to the same legal syntax. By structuring incantations as strict, balanced legal documents, Valerius discovered he could crystallize his blood into volatile shards siphoned through iron, anchoring his limbs to the earth in a freezing lock and generating the first Arcanoneer spells.',
    relatedTerms: ['arcanoneer', 'atropolis', 'bryngloom-forest', 'neth', 'vel-otharen']
  },
  'scathrach': {
    id: 'scathrach',
    term: 'Scathrach, the Ashen Sovereign',
    type: 'historical_figure',
    region: 'sundale',
    summary: 'A parasitic demon-intelligence from the deepest volcanic furnace of Emberspire, who binds with Pyrofiends as a patron.',
    fullEntry: 'Scathrach, known as the Ashen Sovereign, is an ancient, parasitic demonic intelligence nesting deep within the molten vents of Emberspire. Not a standard mortal, Scathrach feeds on absolute despair and answers prayers with destructive, uncontrollable combustion. It is the patron of the Pyrofiend class, offering devastating magical fire at the price of slowly rewriting the spellcaster\'s body into a cracking char-vessel of magma and white-hot bone. Eventually, the Ashen Sovereign claims the host\'s soul entirely for its eternal furnace.',
    relatedTerms: ['emberspire', 'pyrofiend', 'sundale']
  },

  // RACES
  'mimir': {
    id: 'mimir',
    term: 'Mimir',
    type: 'race',
    region: 'frostwood-reach',
    summary: 'A secretive, shape-shifting people of the Frostwood Reach who wear heartwood, storm-glass, or pine masks.',
    fullEntry: 'The Mimir are a slender, rare people of the Frostwood Reach. Evolving from the forester Sylvain, who merged with a doppelganger death-omen, the Mimir possess the ability to shift their physical forms. Because the regional fog decays memory and threatened their identity, they began wearing masks carved from heartwood or storm-glass to lock their true forms. They are divided into the Mask-Borne canopy aristocrats, the Mist-Woven sentinels, and the Unwoven maskless floor-dwellers. Mirror Mere, the perfectly still lake at the heart of Mask-Borne territory, serves as both the Mimir\'s spiritual center and their most reliable tool for verifying identity against the fog\'s erosion.',
    relatedTerms: ['apex', 'briaran', 'frostwood-reach', 'gref', 'mirror_mere', 'rite-of-masks', 'shaper', 'the_shifting_fen', 'wraithfen', 'veyra', 'sylvanus', 'sylas']
  },
  'rite-of-masks': {
    id: 'rite-of-masks',
    term: 'Rite of Masks',
    type: 'cultural_practice',
    region: 'frostwood-reach',
    summary: 'The sacred, defensive custom practiced by the Mimir where they wear beautifully carved, seamless masks to lock their identity against the fog\'s memory-decay and secure trust.',
    fullEntry: 'The Rite of Masks is the central, survival-defining custom of the Mimir race. Originating in the Frostwood Reach where the creeping mist hollows and erases the personal memories of mortals, the Mimir — who possess innate shape-shifting abilities — discovered that their fluid anatomy was highly vulnerable to dissolving under the fog\'s decay. By carving and ritually bonding to a single, seamless mask made of heartwood, storm-glass, or black birch, a Mimir permanently anchors their primary identity and physical form. Socially, the Rite of Masks serves as a covenant of trust with human neighbors: by wearing a constant, recognizable persona, the Mimir guarantees they will not hijack another mortal\'s face or slip away into shape-shifting deception.',
    relatedTerms: ['frostwood-reach', 'greymark_keep', 'mimir', 'mirror_mere']
  },
  'emberth': {
    id: 'emberth',
    term: 'Emberth',
    type: 'race',
    region: 'sundale',
    summary: 'A powerful, dark-skinned people of Sundale who bear deliberate burn-scars encoding their lineage and trade.',
    fullEntry: 'The Emberth are the broad-shouldered craftsmen and Sun-Speakers of Sundale. Warned by prophecy of the sun\'s death, their ancestors sheltered in the thermal caverns beneath Emberspire before the surface froze. They possess large, heat-sensitive eyes and long lungs adapted to thin air. They are divided into the Korr of the deep vault, who tend the Solbrand in holy silence, and the Thrask badland rangers who hunt and mine the volcanic frontier. Ember Lagoon, Sundale\'s only port, is jointly operated by Emberth harbourmasters and Merryn shipping clans, serving as the primary conduit through which Sundale\'s forged goods reach the wider world.',
    relatedTerms: ['cinder_badlands', 'cinderhoodoo', 'damon', 'ember_lagoon', 'emberspire', 'great_forge', 'harath_vault', 'slag_gulch', 'solbrand', 'spellguard', 'sundale', 'titan', 'vault_breath', 'vulkars_karst', 'thrak-damos']
  },
  'neth': {
    id: 'neth',
    term: 'Neth',
    type: 'race',
    region: 'bryngloom-forest',
    summary: 'An immortal, silver-skinned people of the Bryngloom Forest bound by legal contracts to the Root-Veil.',
    fullEntry: 'The Neth are a legalistic, stilled-breath people of Atropolis. Descended from a dying scribe-clan that negotiated a treaty with the Keeper of the Last Threshold, the Neth traded death\'s finality for survival. Their bloodlines are written in the First Contract, rendering them unable to tell a direct lie. They are divided into the silver-skinned Velun pact-lords, the Kessen weavers of the forest floor, and the leaden-grey Drun outcasts who legally do not exist. Beyond Atropolis, the Vel-Keth Bayou — "the water that remembers" — supplies memory-glass deposits harvested by Kessen weavers, while the living-ironwood settlement of Aran-Glen demonstrates the Neth capacity for patient, biological architecture.',
    relatedTerms: ['animist', 'aran_glen', 'arcanoneer', 'atropolis', 'black_fen', 'bryngloom-forest', 'deathcaller', 'drowned_dingle', 'elias', 'gambit', 'house_morrath', 'inquisitor', 'ironjaw_port', 'keeper_of_the_last_threshold', 'kelpies_cove', 'lichborne', 'morrens_bogpost', 'orven', 'over_shanty', 'plaguebringer', 'revenant', 'root_veil', 'root_veil_scriptorium', 'sunken_spire', 'thalrens_ledger_post', 'valerius', 'vel_keth_bayou', 'vesper', 'vreken', 'lyra']
  },
  'astril': {
    id: 'astril',
    term: 'Astril',
    type: 'race',
    region: 'sundrift-vale',
    summary: 'A crystal-skinned people of the Sundrift Vale whose bodies carry the nesting constellation-spirits of Sol\'s ministers.',
    fullEntry: 'The Astril are the luminous guardians of the starless steppe. When Sol was bound, the constellation-spirits of the sun\'s celestial court took refuge inside the bloodlines of the steppe peoples. This nesting manifests as crystalline, glowing skin patterns that hum with celestial resonance. They are divided into the Sylen, who seek total symbiosis with their spirits, the Muren, who bind and suppress them, and the Unlit, who carry no star-glow. Starfall Vale, where the residue of Sol\'s shattered celestial court impacts the earth, remains the most important pilgrimage site for Astril of every caste — a place where the Memory of Sol can still be heard in the harmonic tones of trapped starlight.',
    relatedTerms: ['ancestor_mounds', 'false_prophet', 'house_ordavan', 'lien_stalked_grazes', 'nova_heath', 'starfall_vale', 'sundrift-vale', 'synod_hold', 'the_unlit_knoll', 'xyris']
  },

  // RESOURCES
  'blood_heat': {
    id: 'blood_heat',
    term: 'Blood-Heat',
    type: 'resource',
    region: 'sundale',
    summary: 'The volatile physiological rage of the Berserker, where boiling blood turns pain into apocalyptic strength.',
    fullEntry: 'Blood-Heat represents the dangerous physiological meltdown of the Berserker class. Triggered by intense kinetic strain and wounds, the blood within a Berserker\'s vessels surges in temperature, overriding pain receptors and granting supernatural strength. If this thermal pressure exceeds the maximum threshold, it triggers Metabolic Burnout, rupturing internal pathways and stalling the body in systemic shock.',
    relatedTerms: ['berserker', 'grum', 'hark-ash-hammer', 'grum-bloodhammer']
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
    relatedTerms: ['aex', 'keth_amar', 'lunarch', 'solbrand', 'sundale', 'the_warden']
  },
  'the_breach': {
    id: 'the_breach',
    term: 'The Breach',
    type: 'event',
    region: 'sundale',
    summary: 'The catastrophic event when Keth-Amar cracked Sol\'s volcanic tomb, releasing the Wyrd.',
    fullEntry: 'The Breach occurred when Keth-Amar devoured the firstborn heirs of the six noble houses, utilizing their bloodline keys to fracture the vault binding Sol beneath Sundale. The seal shattered into seven Sundered Monoliths, triggering the eruption of Emberspire and letting the Wyrd bleed through the volcanic cracks into the surface air.',
    relatedTerms: ['emberspire', 'keth_amar', 'starfall_vale', 'sundale', 'the_warden']
  },

  // CREATURES
  'gref': {
    id: 'gref',
    term: 'Gref',
    type: 'creature',
    region: 'frostwood-reach',
    summary: 'A face-stealing Wyrd-manifestation born from the Reach\'s fear of losing one\'s identity to the fog.',
    fullEntry: 'The Gref is a terrifying horror of the Frostwood Reach, born from the Wyrd mirroring the local human fear of cognitive decay. An amorphous, silent predator, the Gref stalks travelers in the fog, stealing their memories and physical features. It leaves its victims maskless and faceless in the mist, wearing their stolen visages to infiltrate timber keeps.',
    relatedTerms: ['frostwood-reach', 'ledger_halls', 'mimir', 'the_shallows', 'wraithfen', 'elias']
  },
  'gambrel': {
    id: 'gambrel',
    term: 'Gambrel',
    type: 'creature',
    region: 'frostwood-reach',
    summary: 'An oath-hunting Wyrd-creature that tracks those who make promises they intend to break.',
    fullEntry: 'The Gambrel is a spindly, long-limbed Wyrd-horror that manifests in the Frostwood Reach. Drawn to the specific guilt of broken agreements and hollow oaths, the Gambrel uses the debtor\'s hidden shame as a visual beacon, stalking carriages along the mist-choked trails. It cannot be outrun, as its speed is directly proportional to the target\'s desperation to forget their broken promises.',
    relatedTerms: ['frostwood-reach', 'house_thalreth', 'ironwood_heart', 'the_shallows', 'elias']
  },
  'stel': {
    id: 'stel',
    term: 'Stel',
    type: 'creature',
    region: 'nordhalla',
    summary: 'A frozen Wyrd-creature that acts as a glacier\'s memory, replaying the death-moments of those caught in the ice.',
    fullEntry: 'The Stel is a heavy, crystalline colossus of Nordhalla, formed from compacted glacial ice and the spiritual residue of the dead. Acting as the physical projection of the glacier\'s memory, the Stel stalks the frozen fjords. It continuously replays the final, terror-filled screams of those who frozen inside the ice sheets, using their disoriented echoes to lure fresh travelers to their doom.',
    relatedTerms: ['house_skalvyr', 'hunger_glaciers', 'nordhalla', 'rime_born', 'rimors_hearth', 'ymirs_col']
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
    relatedTerms: ['aex', 'house_skalvyr', 'house_solvan', 'house_thalreth', 'keth_amar', 'nordhalla', 'silent_seventh', 'the_breach', 'the_deepening', 'the_still_crag', 'titan', 'warden']
  },

  'keth_amar': {
    id: 'keth_amar',
    term: 'Keth-Amar',
    type: 'entity',
    region: 'sundale',
    summary: 'The ancient cosmic predator that hunts dying stars during their Deepening cycle — the catastrophe that triggered the burial of Sol.',
    fullEntry: 'Keth-Amar is a force that has no name in any living language older than eight centuries — because every civilization that named it in writing was destroyed before the word could spread. It hunts stars during their Deepening, the vulnerable death-rebirth cycle, consuming them before they can rekindle. When Sol entered its Deepening, Keth-Amar followed. The seven noble houses, recognizing what was coming, chose to entomb Sol beneath the world rather than surrender it. Keth-Amar accepted the firstborn heirs of the six noble families as tribute — a cost extracted through the dark bargains — and in consuming them, cracked the seal of Sol\'s vault, triggering The Breach. Whether Keth-Amar was satisfied, or merely delayed, is the question every court mage and hedge prophet in Mythrill has been arguing since the eruption of Emberspire.',
    relatedTerms: ['dawn_vigil', 'emberspire', 'house_morrath', 'house_solvan', 'house_viridane', 'lunarch', 'silent_seventh', 'sundale', 'the_breach', 'the_deepening', 'the_warden']
  },

  'solbrand': {
    id: 'solbrand',
    term: 'Solbrand',
    type: 'resource',
    region: 'sundale',
    summary: 'The sacred, searing thermal current that radiates from Sol\'s buried vault beneath Emberspire, tended by the Korr Emberth in holy silence.',
    fullEntry: 'The Solbrand is not a flame. It is the residual warmth of a star that should be dead, bleeding upward through eight hundred feet of volcanic basalt. The Korr Emberth — the vault-dwelling caste of the Emberth race — have tended the Solbrand in sacred, wordless silence since the day Sol was bound. They believe the Solbrand is Sol\'s breathing — that if it ever falters, the star has truly died and no vault, no bargain, no sacrifice can restart it. In practical terms, the Solbrand heats the deep-cavern settlements, powers the forge-caldera used by the Emberth smith-clans, and provides the thermal differential that keeps the Sundale badlands from freezing solid like the rest of the world\'s surface.',
    relatedTerms: ['damon', 'dawn_vigil', 'emberspire', 'emberth', 'harath_vault', 'house_solvan', 'sols_anvil_mesa', 'spellguard', 'sundale', 'the_deepening']
  },

  'aex': {
    id: 'aex',
    term: 'Aex',
    type: 'entity',
    region: 'sundale',
    summary: 'Sol\'s own firstborn — a living entity of pure radiance whose body was flayed to weave the binding seal that entombs the dying star.',
    fullEntry: 'Aex was the firstborn of Sol — not a god, not an angel, but a living entity of pure stellar radiance who had protected the sun through every Deepening since the first star learned to burn. When the seven noble families chose to entomb Sol beneath the volcanic crust of Sundale to protect it from Keth-Amar, the Warden demanded a price: Aex\'s willing sacrifice. It was Solvan who wielded the knife, flaying Aex\'s living hide to weave the binding seal. Whether Aex consented freely or was compelled by loyalty to Sol remains the subject of bitter theological dispute in Sundale.',
    relatedTerms: ['emberspire', 'house_solvan', 'sundale', 'the_deepening', 'the_warden']
  },

  // ============================================================
  // CLASSES (20 active traditions + 6 merged concepts)
  // ============================================================

  'arcanoneer': {
    nativeWeaving: `**Ecological.** The Bryngloom's peat-bogs preserve everything — including clauses — so a magic that functions as filed law could only arise here. **Cultural.** The Velun archive-city and the Neth's biological inability to lie are the substrate of contract-syntax spellcasting. **Founder.** Valerius, a Neth archivist, drafted the First Contract with the Keeper — a direct product of the Bryngloom's reincarnation-contract-law Stratum. **Subrace-native.** Only the Velun Neth carry the contract-locked neurology that can submit a clause without breaching.`,

    id: 'arcanoneer',
    term: 'Arcanoneer',
    type: 'class',
    region: 'bryngloom-forest',
    summary: 'A contract-mage who crystallizes their silver Neth blood into volatile shards, anchoring spells in legal precision rather than instinct.',
    fullEntry: 'The Arcanoneer tradition was formalized by Valerius, the great Velun archivist who realized that the Bryngloom Forest\'s ambient magic responded to the same syntax as Neth contract law. By structuring incantations as strict, legally-binding documents — with offer, consideration, and consequence — a caster can crystallize their blood into volatile Mnemonic Shards that anchor spells with extraordinary precision. The cost is rigidity: an Arcanoneer cannot improvise. Every spell must be prepared, structured, and filed. In combat this translates to absolute devastation within their prepared repertoire and near-helplessness outside it.',
    relatedTerms: ['bryngloom-forest', 'neth', 'valerius']
  },
  'augur': {
    nativeWeaving: `**Ecological.** Nordhalla's glacier-preserved dead keep the ancestral evidence legible for centuries — entrail-reading works nowhere else. **Cultural.** The saga-culture's glacier-entombment ancestor-veneration is the literal practice the art refines. **Founder.** Cassia, a Skald star-watcher, read the Deepening in a sacrificed elk at the Frozen Archive — a product of the pre-Deepening clockwork-genealogy culture. **Subrace-native.** Rune Keeper Skald and Astril; cultures without burial-preservation (Ordan, Merryn) cannot maintain the connection.`,

    id: 'augur',
    term: 'Augur',
    type: 'class',
    region: 'nordhalla',
    summary: 'A death-touched seer who reads the future in the entrails of the present, trading years of their own lifespan for visions.',
    fullEntry: 'The Augur tradition grew in the glacier-tombs of Nordhalla, where the dead stand upright in the ice as permanent witnesses to the living. The first Augurs discovered that prolonged proximity to the glacier-preserved dead created a resonance — flashes of the deceased\'s final visions. They learned to court this resonance deliberately, burning their own life-years to pull usable foresight from the edges of death. An Augur sees probabilities, not certainties — they tell you which path has fewer corpses, not which path has none.',
    relatedTerms: ['frozen_archive', 'house_skalvyr', 'nordhalla']
  },
  'berserker': {
    nativeWeaving: `**Ecological.** Blood-Heat is the body's last-ditch survival protocol weaponized against two extremities — Nordhalla's starvation-cold and Sundale's forge-heat. **Cultural.** The Hunger Pact (consuming the dead) is the deepest scar of the Skald saga-culture; the Thrask reframe is forge-cult. **Founder.** Grum ignited in Sundale's caldera, but the Bloodhammer line marched from Nordhalla's Glacier Bargain starvation. **Subrace-native.** Skald (Hunger-Pact ancestry), Thrask (geothermal resonance), Morgh Groven (Vat-Overclock) — each subrace's biology is a different Heat source.`,

    id: 'berserker',
    term: 'Berserker',
    type: 'class',
    region: 'nordhalla',
    secondaryRegions: ['sundale'],
    summary: 'A warrior of dual heritage — Skald ancestry from Nordhalla and the volcanic founding of Grum Bloodhammer in Sundale — who ignites their Blood-Heat to overdrive their physiology, trading control for catastrophic, self-burning strength.',
    fullEntry: 'The Berserker is a tradition of two regions and one terrible inheritance. The Hunger Pact was forged in Nordhalla: during the worst winter of the Glacier Bargain, the ancestors of the Bloodhammer line consumed their own fallen so the bloodline could persist, and that act entered their marrow. The Blood-Heat itself, however, was born in Sundale — when the Bloodhammer clans migrated south under Torra Bloodhammer into the volcanic tunnels of Emberspire, the smith Grum surrendered to the forge\'s heat to shatter an ice-wyrm bare-handed. Nordhalla gave the Berserker its ancestry; Sundale gave it its fire. Berserkers do not resist pain — they use it as fuel. The Blood-Heat mechanic tracks their physiological thermal pressure as it builds from wounds and exertion. At low heat, a Berserker is fast and strong. At high heat, they are apocalyptic but begin damaging themselves. At Metabolic Burnout, they collapse in systemic shock. Today the tradition is trained in the Harath-Vault arenas of Sundale and pilgrimaged at the Forge of Grum beneath Emberspire, while the Skald elders of the Frozen Archive in Nordhalla still claim the right to decide who may carry the Pact.',
    relatedTerms: ['blood_heat', 'grum', 'harath_vault', 'nordhalla', 'sundale']
  },
  'shaper': {
    nativeWeaving: `**Ecological.** Form-shifting requires biology that can reshape — Mimir crystalline skin and Groven calcifiable bone, evolved in the Frostwood mists and Cragjaw vats. **Cultural.** Sylvanus's kinetic momentum dance (Frostwood fae-grove movement) fused with Torin's biological adaptation (Cragjaw alchemical body-work). **Founder.** Veyra the Mimir chronicler merged both — a product of the Frostwood grove-culture and Cragjaw Vat-Breakers Strata. **Subrace-native.** Mist-Woven Mimir and Morgh Groven only; Humans, Emberth, Neth, and Myrathil biologically cannot hold a shape.`,

    id: 'shaper',
    term: 'Shaper',
    type: 'class',
    region: 'frostwood-reach',
    secondaryRegions: ['cragjaw-peaks'],
    summary: 'A master of kinetic biology of dual origin — the Frostwood Reach momentum dance (Sylvanus) fused with the Frostmaw Holdfast biological body-sculpting (Torin) by the Mimir chronicler Veyra — who treats their body as a malleable weapon.',
    fullEntry: 'The Shaper is a convergence of two regional traditions. In the Frostwood Reach, the kinetic momentum dance was born among the ironwood canopy — a hyper-accelerated combat art of wind-synced striking. In the Cragjaw Peaks, the biological body-sculpting art arose at Frostmaw Holdfast, where practitioners drank raw alchemical sulfur-clay to calcify and reshape their own skeletons. The two traditions existed separately for centuries until the Mimir chronicler Veyra, who had studied both, proved they were one dance seen from two angles — momentum shaping form, form directing momentum. A Shaper navigates 6 Shaping Forms that blend kinetic stances with physical form adaptations, building Kinetic Flux through combat and accumulating Body Toll from every transformation. The tradition is taught at the Shaping Hall in Frostmaw Holdfast (Cragjaw) and in the deep ironwood groves of the Frostwood Reach. The price is absolute: every shift erodes identity, calcifies skin, and frays the nervous system. The dance is killing them, but stopping is death.',
    relatedTerms: ['bladedancer', 'cragjaw-peaks', 'formbender', 'frostmaw_holdfast', 'frostwood-reach', 'groven', 'mimir', 'veyra', 'sylvanus', 'torin']
  },
  'bladedancer': {
    id: 'bladedancer',
    term: 'Bladedancer',
    type: 'concept',
    region: 'frostwood-reach',
    summary: 'The Bladedancer tradition of kinetic momentum warfare has been merged into the Shaper class. See: Shaper.',
    fullEntry: 'The Bladedancer tradition of hyper-accelerated momentum dance originated in the Frostwood Reach. This tradition has been merged with the Formbender biological adaptation art into the Shaper class. Former Bladedancers now fight as Shapers, combining their kinetic momentum dance with biological form-shifting.',
    transition: {
      aftermath: `The last formal Bladedancer dojo in the <LoreLink termId="frostwood-reach">Frostwood Reach</LoreLink> closed sixty years ago; its master walked into the Shaping Hall at <LoreLink termId="frostmaw_holdfast">Frostmaw</LoreLink> and never returned. Former Bladedancers who refused the merge were absorbed into Mimir canopy-defense or faded into mercenary work.`,
      legacySite: `The Old Dance-Floor — a mossed-over ironwood platform in the deep Frostwood where the kinetic forms were once drilled — is now a pilgrimage site for purist Shapers who practice single-tradition momentum work.`,
      survivorNote: `A handful of elderly "pure-dancers" still refuse biological adaptation, arguing the merged art dilutes the momentum discipline. They are respected, dying out, and cannot match a converging Shaper in combat.`
    },
    relatedTerms: ['frostwood-reach', 'shaper']
  },
  'harbinger': {
    nativeWeaving: `**Ecological.** Entropy-reading arises in cultures that have waited for extinction long enough to weaponize it — Nordhalla's glacier-stasis and the Sundrift's darkened sky. **Cultural.** Norse doom-saga crossed with steppe nihilism. **Founder.** Xyris tore reality in the Sundrift and Malakor calculated the doom-arithmetic in Nordhalla — products of the Glacier Bargain and the Ordavan migration-bargain. **Subrace-native.** Sylen Astril, Solvarn, Rune Keeper Skald, Ord — the cultures proximate to entropy.`,

    id: 'harbinger',
    term: 'Harbinger',
    type: 'class',
    region: 'nordhalla',
    secondaryRegions: ['sundrift-vale'],
    summary: 'An entropy prophet of dual origin — Xyris\'s reality-tearing in the Sundrift Vale and Malakor\'s doom-arithmetic in Nordhalla — who channels entropic friction and prophetic certainty into living bomb prophecies.',
    fullEntry: 'The Harbinger was forged in two regions that share a single conviction: that the world is ending, and that the ending can be wielded. In the Sundrift Vale, the nomad Xyris spliced temporal friction into her veins and tore a hole in reality — and the hole killed her. In Nordhalla, the archivist Malakor did the colder work: he calculated the arithmetic of doom, working out exactly when Xyris\'s holes would consume everything. The Harbinger tradition is their merger — the chaos-weaver\'s philosophical surrender to the Wyrd joined to the doomsayer\'s prophetic certainty. A Harbinger does not simply predict doom — they orchestrate it, channeling entropic friction through prophetic visions into living bomb prophecies that detonate across the battlefield. Their Mayhem pressure gauge amplifies all spells as it rises, creating a self-reinforcing cycle of chaos that can only be released through catastrophic Wild Surges. The tradition\'s arithmetic is honed in the Frozen Archive of Nordhalla; its chaos-work is field-tested in the permanent Chaos Pockets now stabilizing across the Sundrift Vale.',
    relatedTerms: ['frozen_archive', 'house_skalvyr', 'nordhalla', 'sundrift-vale', 'xyris', 'malakor']
  },
  'chronarch': {
    nativeWeaving: `**Ecological.** Time-stitching requires the volcanic-glass, gear-craft, and bone-knowledge found only in Cragjaw's vertical engineering tunnels. **Cultural.** Andean khipu-record-keeping crossed with yokai time-suspension folklore. **Founder.** Nesta, a Kethrin engineer, built the engine at Frostmaw during the War of Thousand Screams — a product of the Vat-Breakers' deep-alchemical legacy. **Subrace-native.** Kethrin Fexrick and Ithran Groven only; outsiders have never learned the technique.`,

    id: 'chronarch',
    term: 'Chronarch',
    type: 'class',
    region: 'cragjaw-peaks',
    summary: 'A time-manipulator who unravels small loops of causality to reverse, delay, or accelerate moments — at the cost of temporal echoes.',
    fullEntry: 'The Chronarch tradition is the most intellectually demanding in the known traditions — it requires a practitioner to hold in mind not just what is, but what was and what could be, simultaneously. Chronarchs emerged from the Cragjaw Peaks, where the eternal blizzard that hides the mountains from the outside world created pockets of temporal suspension. A Chronarch does not travel in time. They stitch it — pulling a thread of the past forward or pushing a thread of the present backward by seconds or minutes. Each stitch leaves a temporal echo, a ghost-impression of the unraveled moment that lingers and occasionally acts on its own.',
    relatedTerms: ['cragjaw-peaks', 'house_tesshan']
  },
  'inquisitor': {
    nativeWeaving: `**Ecological.** Anti-Wyrd hunting requires dense supernatural exposure — the Bryngloom's Root-Veil and the Frostwood's face-trading Wyrd. **Cultural.** Slavic bog-sainthood meets Celtic fae-resistance. **Founder.** Orven forged the cold-iron blade in the Bryngloom and Elias opened his veins to bait face-stealers in the Frostwood — products of both regions' Deep Strata. **Subrace-native.** Marked Vreken, Thalren, Unwoven Mimir — the peoples with direct Wyrd-exposure density.`,

    id: 'inquisitor',
    term: 'Inquisitor',
    type: 'class',
    region: 'bryngloom-forest',
    secondaryRegions: ['frostwood-reach'],
    summary: 'A witch-hunter of dual root — Orven\'s cold-iron Vreken tradition in the Bryngloom and Elias the Salt-Scarred\'s anti-Wyrd Thalren tradition in the Frostwood Reach — who severs magical bindings and commands bound fiends.',
    fullEntry: 'The Inquisitor tradition has two roots in two regions, both born from the same necessity: policing the supernatural when it turns predatory. In the Bryngloom Forest, Orven the Still-Handed forged the first cold-iron blade and swore the Barbed Vow to hunt corrupted Vreken whose ancestral spirit-bonds had gone rogue and Drun Neth whose void-sealed contracts defied conventional magic. In the Frostwood Reach, Elias the Salt-Scarred opened his own veins to draw the Wyrd\'s face-stealing horrors — the Gref, the Gambrel — into living flesh where they could be named and cut. The two traditions merged when the supernatural incursion rate tripled and neither regional order could contain it alone. An Inquisitor specializes in identifying, disrupting, and severing magical contracts — they are not magic-resistant by nature; they are magic-literate in the way a surgeon is anatomy-literate. The tradition also encompasses the binding and commanding of fiends through sacred dominance ritual. The Bryngloom order is seated at the Sunken Spire; the Frostwood order operates out of Greymark Keep, and the two stay in contact through a chain of border-shrines.',
    relatedTerms: ['bryngloom-forest', 'covenbane', 'elias', 'exorcist', 'frostwood-reach', 'greymark_keep', 'neth', 'sunken_spire', 'vreken', 'orven']
  },
  'revenant': {
    nativeWeaving: `**Ecological.** Undeath-as-obligation requires the bog-preservation and mycelial Root-Veil that keep the Bryngloom dead "available" rather than gone. **Cultural.** Slavic-Hindu reincarnation-contract law; the Postmortem Corvée treats death as a renegotiated clause. **Founder.** Kora's blood-covenant and Vesper's frost-stasis phylactery — both products of the First Contract Stratum. **Subrace-native.** Clean Vreken, Drun Neth, Morren — the peoples whose cultures accept undeath as continuation of obligation.`,

    id: 'revenant',
    term: 'Revenant',
    type: 'class',
    region: 'bryngloom-forest',
    summary: 'A death caster who has returned from the grave, combining blood-magic sacrifice (Kora\'s covenant) with frost-stasis harvest (Vesper\'s phylactery) into a unified economy of death.',
    fullEntry: 'The Revenant tradition was born from the convergence of two death-magic schools in the Bryngloom Forest. The blood covenant of Kora the Veil-Speaker — who sacrificed her own life force to keep the ancestral lights burning and was cursed to hear the screams of the dead — merged with the frost stasis of Vesper the Scribe — who bound his soul to a basalt phylactery and negotiated perpetual dying to escape the sumps\' lung-rot. When the bog-graves began waking on their own, the two traditions recognized their separate wars were the same. The Revenant now carries both volatile Death Toll (blood-derived necrotic energy) and a kill-charged Phylactery (frost-stasis resurrection), toggling between Rest Mode and Death Shroud to burn HP for devastating power.',
    relatedTerms: ['bryngloom-forest', 'deathcaller', 'kora', 'lichborne', 'neth', 'vesper', 'vreken']
  },
  // 'deathcaller' and 'lichborne' merged into Revenant as Phase 1.10 consolidation
  'deathcaller': {
    id: 'deathcaller',
    term: 'Deathcaller',
    type: 'concept',
    region: 'bryngloom-forest',
    summary: 'The Deathcaller blood-magic tradition has been merged with the Lichborne frost-stasis tradition into the Revenant class. See: Revenant.',
    fullEntry: 'The Deathcaller tradition of blood-fueled necromancy originated with Kora the Veil-Speaker in the Bryngloom Forest. Practitioners sacrificed their own HP to generate volatile Blood Tokens and commune with luminous ancestral dead. This tradition has been merged with Vesper\'s frost-stasis Lichborne tradition into the unified Revenant class. Former Deathcallers now fight as Revenants, combining their blood sacrifice mechanics with phylactery resurrection and Death Shroud frost mode.',
    transition: {
      aftermath: `Kora's blood-covenant practitioners who refused the merge were gradually absorbed into Vreken ancestral-rite roles or driven into the Over-Shanty as unlicensed blood-workers. The last pure Deathcaller covenant dissolved when its senior member could no longer hear the ancestors over the merged chorus.`,
      legacySite: `The Veil-Speaker Shrine in the deep peat-bogs marks where <LoreLink termId="kora">Kora</LoreLink> first fed the ancestral lights; Revenants of the blood-covenant inclination still make offerings here before major workings.`,
      survivorNote: `A few "blood-purists" maintain that the phylactery frost-mode dilutes the blood-covenant volatility; they run hotter Death Toll and refuse the Death Shroud, burning out faster but hitting harder.`
    },
    relatedTerms: ['bryngloom-forest', 'neth', 'revenant', 'vreken']
  },
  // 'dreadnaught' absorbed into Martyr
  'dreadnaught': {
    id: 'dreadnaught',
    term: 'Dreadnaught',
    type: 'concept',
    region: 'cragjaw-peaks',
    summary: 'The Dreadnaught tradition of furnace-armor warfare has been absorbed into the Martyr class as the Ironclad specialization. See: Martyr (Ironclad).',
    fullEntry: 'The Dreadnaught tradition of steam-powered iron juggernauts originated in the Cragjaw Peaks, where Groven troll-kin welded heating pipes to their bodies to defend against the Skreika. This tradition has been absorbed into the Martyr class as the Ironclad specialization — furnace-bound Martyrs who seal themselves in iron plate and combine willing sacrifice with combustion engine mechanics. Former Dreadnaughts now fight as Ironclad Martyrs.',
    transition: {
      aftermath: `The <LoreLink termId="groven">Groven</LoreLink> furnace-armor guilds did not dissolve — they re-licensed. The old Dreadnaught foundries at <LoreLink termId="frostmaw_holdfast">Frostmaw</LoreLink> now produce Ironclad plate under Steam-Line Cartel contracts, and the senior Dreadnaught smiths became the first Ironclad instructors.`,
      legacySite: `The Old Foundry beneath Frostmaw still stamps the Dreadnaught sigil (a pipe-crossed fist) onto Ironclad plate as a maker-mark — the only surviving public acknowledgment of the original tradition.`,
      survivorNote: `Elder "pure-furnace" Groven insist the Martyr theology corrupts the engineering; they maintain the original combustion-mechanics without the Devotion Gauge, running their boilers cold. They are fewer each winter.`
    },
    relatedTerms: ['cragjaw-peaks', 'groven', 'martyr']
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
    transition: {
      aftermath: `The Exorcist purification rites were not lost — they became the defensive half of the Inquisitor curriculum. Former Exorcists who could not swear the Barbed Vow retreated into temple-priest roles or became Hedge-Cleansers, itinerant ritual-workers for villages too small to attract a full Inquisitor.`,
      legacySite: `The Cleansing Chapels of the mid-Bryngloom — where Exorcist rites were codified — now serve as Inquisitor chapterhouses; the old purification fonts are still in daily use.`,
      survivorNote: `Hedge-Cleansers preserve the pure Exorcist art in attenuated form; they are tolerated by the Inquisitors as rural first-responders and quietly resented as unlicensed practitioners.`
    },
    relatedTerms: ['bryngloom-forest', 'covenbane', 'inquisitor']
  },
  'covenbane': {
    id: 'covenbane',
    term: 'Covenbane',
    type: 'concept',
    region: 'bryngloom-forest',
    summary: 'The Covenbane witch-hunting tradition has been merged with the Exorcist ritual purification art into the Inquisitor class. See: Inquisitor.',
    fullEntry: 'The Covenbane tradition of organized witch-hunting and demon binding arose from the necessity of policing the Bryngloom\'s dense supernatural ecosystem. When rogue Neth contracts, corrupted Vreken ancestral bonds, and unbound fiends began threatening settlements, the Covenbane order formed to identify, hunt, and neutralize these threats. This tradition has been merged with the Exorcist\'s ritual purification art into the unified Inquisitor class.',
    transition: {
      aftermath: `The Covenbane order was the more martial of the two roots, and its membership transitioned most cleanly into the Inquisitor — the cold-iron blade and the Barbed Vow are Covenbane inheritances. The order's formal structure became the Inquisitor chain-of-command.`,
      legacySite: `The Covenbane Stronghold in the eastern <LoreLink termId="bryngloom-forest">Bryngloom</LoreLink> is now the regional Inquisitor seat; its hanging-cages (once for bound witches awaiting trial) are preserved as grim heritage.`,
      survivorNote: `None meaningful — the Covenbane did not survive as a distinct identity. The merger was total; a "Covenbane purist" is a contradiction, since the order defined itself by its willingness to adopt new anti-supernatural techniques.`
    },
    relatedTerms: ['bryngloom-forest', 'exorcist', 'inquisitor']
  },
  'false_prophet': {
    nativeWeaving: `**Ecological.** Manufactured meaning arises on a steppe where the sky went dark and the herds must move forever — desperation cosmology. **Cultural.** Mongol steppe-shamanism weaponized into nihilist gospel; the silent ancestral mounds. **Founder.** Li Wei, an Ordan herd-watcher, followed a meteor into a Sundered Monolith crater — a product of the Ordavan migration-bargain and the Silence Between Stars. **Subrace-native.** Ordan, Unlit Astril, Morren — the desperate and the constellationless.`,

    id: 'false_prophet',
    term: 'False Prophet',
    type: 'class',
    region: 'sundrift-vale',
    summary: 'A manipulator who weaponizes faith — creating and exploiting constructed belief systems to accumulate political power and divine-adjacent ability.',
    fullEntry: 'The False Prophet does not believe their own gospel. They understand that belief itself is a resource — that a people who believe something with sufficient intensity generate a spiritual resonance that can be harvested. The tradition originated in the Sundrift Vale, where the starless sky and the nomadic migrations created desperate demand for meaning. A False Prophet engineers that meaning with the cold precision of an architect. They are not necessarily malicious — some build their constructed faiths to protect people, knowing that the lie is more useful than the truth. The power comes from the congregation, not the prophet.',
    relatedTerms: ['astril', 'sundrift-vale', 'synod_hold']
  },
  'gambit': {
    nativeWeaving: `**Ecological.** Risk-calculation arises in maritime-debt and vertical-toll economies where every survival is a wager. **Cultural.** Celtic sea-omen gambling, Andean khipu-probability, and Neth clause-reading. **Founder.** Jax wagered his lifeline against a storm-spirit at Merrowport and Lyra wove probability-webs in the Bryngloom — products of the Mereval storm-bargain and the First Contract. **Subrace-native.** Merryn, Breakers-Born Myrathil, Kessen Neth, Ithran Groven — the risk-cultures.`,

    id: 'gambit',
    term: 'Gambit',
    type: 'class',
    region: 'cragjaw-peaks',
    secondaryRegions: ['iceheart-sea', 'bryngloom-forest'],
    summary: 'A probability-manipulator of tri-regional origin — Jax\'s sea-omen gambling on the Iceheart Sea and Lyra\'s Kessen Neth probability-web reading in the Bryngloom, refined in the toll-negotiations of the Cragjaw Peaks.',
    fullEntry: 'The Gambit tradition was born twice, in two regions, and refined in a third. On the Iceheart Sea, the Merryn pirate Jax wagered his lifeline against a storm-spirit at Merrowport — winning the wind but losing his blood\'s warmth, and proving that probability itself could be staked and won. In the Bryngloom Forest, the Kessen Neth probability-weaver Lyra read the threads of consequence through rune-etched cards, plucking the single timeline in which her caravan survived — at the cost of fracturing her consciousness. The two traditions recognized each other when Lyra\'s caravan crossed the Ancestor-Spans into the Cragjaw Peaks, where the high-stakes toll-negotiations refined both arts into the modern Gambit. A Gambit does not control fate — they nudge it, the power of compound interest: small adjustments made early that accumulate into dramatically different outcomes. They win battles before they start by ensuring the terrain, weather, and morale are all marginally more favorable. The tradition\'s sea-work is headquartered at the Last Table in Merrowport; its contract-work at Ironjaw Port; and its toll-craft among the Groven bridge-keepers of the Cragjaw.',
    relatedTerms: ['bryngloom-forest', 'cragjaw-peaks', 'iceheart-sea', 'ironjaw_port', 'merrowport', 'neth', 'jax', 'lyra']
  },
  'formbender': {
    id: 'formbender',
    term: 'Formbender',
    type: 'concept',
    region: 'cragjaw-peaks',
    summary: 'The Formbender tradition of biological body-sculpting has been merged into the Shaper class. See: Shaper.',
    fullEntry: 'The Formbender tradition of biological adaptation originated in Frostmaw Holdfast. This tradition has been merged with the Bladedancer kinetic momentum art into the Shaper class. Former Formbenders now fight as Shapers, combining their shapeshifting with kinetic form combat.',
    transition: {
      aftermath: `The Frostmaw biological-sculpting studios did not close — they became the biological half of the Shaping Hall. Former Formbenders who rejected the kinetic merge continued as body-sculptors for Groven construction and medical bone-work.`,
      legacySite: `The Calcifying Vats of <LoreLink termId="frostmaw_holdfast">Frostmaw</LoreLink> (re-purposed from the old <LoreLink termId="deep_alchemists">Deep Alchemist</LoreLink> heritage) are where Formbender techniques are still taught in isolation to Shaper initiates before they learn the momentum dance.`,
      survivorNote: `A faction of "bone-purists" practices Formbender arts without kinetic integration, serving as Groven civil engineers and healers. They are the biological-sculptors who keep the Ancestor-Spans repaired.`
    },
    relatedTerms: ['frostmaw_holdfast', 'groven', 'shaper']
  },
  'apex': {
    nativeWeaving: `**Biological.** The Apex art predates external magic entirely — it is pure physiology, anatomy, and sensory refinement. **Cultural.** Appalachian tracker lore, Inuit silent-hunt traditions, and the clinical precision of monastic martial discipline. **Founder.** Sylas, a Mimir tracker who traded his hearing for vibration-sense and built the Silent Hunt on the principle of sensory sacrifice. **Subrace-native.** Maskborne Mimir, Mistwoven Mimir, Unwoven Mimir, Skald, Clean Vreken, Marked Vreken, Ordan.`,

    id: 'apex',
    type: 'class',
    region: 'frostwood-reach',
    term: 'Apex',
    aliases: [],
    summary: 'The oldest tradition in the Frostwood Reach — a predator\'s art older than the fog, rooted in hunting blind through mist-choked timber with anatomical precision and sensory sacrifice.',
    fullEntry: 'The Apex tradition is older than any noble house in the Frostwood Reach — it predates the fog and the bargains, rooted in the practical necessity of hunting blind through mist-choked timber. A Apex does not fight in the conventional sense. They identify, track, position, and resolve targets with the minimum expenditure of force required. Their knowledge of anatomy is comprehensive and non-squeamish — every debilitating strike targets a specific nerve cluster, joint, or blood vessel. They are not warriors. They are problems solved.',
    relatedTerms: ['frostwood-reach', 'mimir', 'sylas', 'ironwood_heart']
  },
  'animist': {
    nativeWeaving: `**Ecological.** Ancestral spirit-channeling requires three biomes — steppe totemic communion, bog spore-inhalation, glacier runic inscription — hence three roots. **Cultural.** Mongol throat-song, Slavic bog-loa, and Norse runic ancestor-veneration. **Founder.** Kael (Ordan), Nyssa (Vreken), and Theron (Skald) each pioneered a root — each a product of their region's Deep Stratum. **Subrace-native.** Ordan, Sylen Astril, Clean Vreken, Morren, Rune Keeper Skald, Velun Neth.`,

    id: 'animist',
    term: 'Animist',
    type: 'class',
    region: 'bryngloom-forest',
    secondaryRegions: ['sundrift-vale', 'nordhalla'],
    summary: 'A spirit-channeler of tri-regional origin — three independent discoveries fused: Kael\'s totemic communion (Sundrift Vale), Nyssa\'s spore-inhalation (Bryngloom), and Theron\'s runic inscription (Nordhalla).',
    fullEntry: 'The Animist tradition is not one art but three, fused at a crossroads by carriers who recognized each other\'s scars. In the Sundrift Vale, the Ordan totem-singer Kael discovered ancestral communion through bone-eruption — the spirit called through a totem woven from the migration-horse\'s mane. In the Bryngloom Forest, the Vreken spore-elder Nyssa inhaled the loa on bioluminescent spores, the spirit speaking through shifting glow on the skin. In Nordhalla, the Skald rune-carver Theron inscribed his ancestors\' names into his own skin at the Frozen Archive, the rune itself the house of the dead. The three traditions merged when their carriers met and realized they spoke dialects of a single ancestral language. An Animist does not summon spirits; they open channels that already exist, drawing power from negotiated bonds with ancestral lineages, spirit courts, and the memory-echoes embedded in the land itself. Where others see death as an ending, an Animist sees it as a change of state. The Convergence rotates its seat between the three regions, keeping its archive-records at the Frozen Archive.',
    relatedTerms: ['bryngloom-forest', 'frozen_archive', 'neth', 'nordhalla', 'sundrift-vale', 'vreken', 'kael', 'nyssa', 'theron']
  },
  // 'lichborne' merged into Revenant as Phase 1.10 consolidation
  'lichborne': {
    id: 'lichborne',
    term: 'Lichborne',
    type: 'concept',
    region: 'bryngloom-forest',
    summary: 'The Lichborne frost-stasis tradition has been merged with the Deathcaller blood-magic tradition into the Revenant class. See: Revenant.',
    fullEntry: 'The Lichborne tradition of partial undeath — negotiating perpetual dying through a basalt phylactery — originated with Vesper the Scribe in the deep peat-bogs of the Bryngloom Forest. By binding their soul to cold stone, Lichbornes achieved immortality at the cost of cold flesh and constant life-force harvesting. This tradition has been merged with Kora\'s blood-covenant Deathcaller tradition into the unified Revenant class. Former Lichbornes now fight as Revenants, retaining their Phylactery resurrection and Death Shroud frost mode while gaining volatile Death Toll from blood sacrifice.',
    transition: {
      aftermath: `<LoreLink termId="vesper">Vesper</LoreLink>'s frost-stasis practitioners who refused the blood-covenant merge retreated into deep peat-bog hermitage; a few "cold-purists" still maintain solitary phylacteries in the deep sumps, refusing the volatile Death Toll in favor of slow, cold undeath.`,
      legacySite: `Vesper's Basalt-Phylactery (the founder's own stone) is enshrined in the Cold Hearth and still pulses once per hour; Revenants of the frost-stasis inclination touch it before long operations.`,
      survivorNote: `The cold-purists run colder and slower than merged Revenants — less burst power, but dramatically longer unlife. Several have been in continuous frost-stasis since before the merger and remember the Bryngloom before the Root-Veil began rejecting the Marked.`
    },
    relatedTerms: ['bryngloom-forest', 'neth', 'revenant', 'vreken']
  },
  'lunarch': {
    nativeWeaving: `**Ecological.** The lunar parasite requires the Frostwood's moonlit groves where the insulating fog thins and fae old-law still holds. **Cultural.** Celtic fae-pacts and the Viridane refusal bloodline. **Founder.** Selene of House Viridane bound the parasite — a direct product of the Refusal and the Silent Seventh Stratum. **Subrace-native.** Briaran (Viridane blood) and Mimir (fetch-bond compatibility); non-Briaran may be chosen but the bloodline is native.`,

    id: 'lunarch',
    term: 'Lunarch',
    type: 'class',
    region: 'frostwood-reach',
    summary: 'A void-touched mage who draws power from the absent sky — channeling the dark between the stars that Sol\'s absence left exposed.',
    fullEntry: 'The Lunarch tradition was born in the Frostwood Reach\'s perpetual fog-shrouded canopy — a place where sunlight never reached even before the Deepening. Lunarchs realized that Sol\'s absence had not left the sky empty. It had left the sky exposed to whatever lay beyond Sol — the cold, vast dark between stars that Keth-Amar itself travels through. They learned to channel this ambient void-light, which is not darkness but the specific quality of space that darkness reveals. A Lunarch\'s power is most effective at night, in low light, and in areas of high Wyrd-density — conditions that describe most of the world.',
    relatedTerms: ['frostwood-reach', 'keth_amar', 'the_deepening']
  },
  'martyr': {
    nativeWeaving: `**Ecological.** Willing-suffering theology arises at Sol's tomb, where the volcanic theocracy demands sacrifice to feed the failing Solbrand. **Cultural.** Mesoamerican solar-sacrifice cosmology and the Solvan Heir-Purge. **Founder.** Sera Solvan carved her sacrificed child's name into her arm — a product of the ur-bargain (Sundale is the wound itself). **Subrace-native.** Solvarn (sun-vigil), Korr Emberth (Vault-Breath), Velun Neth (contract-martyrdom).`,

    id: 'martyr',
    term: 'Martyr',
    type: 'class',
    region: 'sundale',
    summary: 'A self-sacrificing healer and shield who absorbs the suffering of allies into their own body, converting it into protective power through the Devotion Gauge.',
    fullEntry: 'The Martyr tradition was born from the act of Sera Solvan, who carved her sacrificed child\'s name into her flesh with volcanic obsidian and found that the wound glowed rather than healed. A Martyr does not protect allies by standing between them and danger — they absorb what reaches allies into themselves, metabolizing kinetic and magical damage into spiritual resonance tracked in the Devotion Gauge. At low Devotion, a Martyr is a walking wound. At high Devotion, they are a radiant engine of protection that makes the entire party significantly harder to harm. The tradition selects heavily for those who find meaning in suffering.',
    relatedTerms: ['devotion_gauge', 'dreadnaught', 'house_solvan', 'sera', 'sundale']
  },
  'minstrel': {
    nativeWeaving: `**Ecological.** The tide-song requires a maritime culture whose perpetual-storm sea can be bargained with via performance. **Cultural.** Celtic sea-shanty and the ship-as-polity oral tradition. **Founder.** Lyris sang the gales calm at Merrowport — a product of the Mereval storm-bargain. **Subrace-native.** Merryn and Breakers-Born Myrathil; landlocked or vertical cultures lack the oral-maritime substrate.`,

    id: 'minstrel',
    term: 'Minstrel',
    type: 'class',
    region: 'iceheart-sea',
    summary: 'A sonic-resonance practitioner who weaponizes, heals with, and manipulates the world through structured sound and narrative.',
    fullEntry: 'The Minstrel tradition grew from the Merryn storm-sailors of the Iceheart Sea, who discovered that certain rhythms synchronized the body\'s physiological responses to waves and wind — enabling sustained effort that would otherwise exhaust a crew within hours. A Minstrel is not a bard in the conventional sense. Their sound-work is precise, technical, and physically demanding. They can accelerate healing, sharpen focus, disrupt coordination, or shatter stone at the correct resonant frequency. The tradition requires perfect pitch and the ability to maintain complex rhythmic structures while under combat pressure.',
    relatedTerms: ['house_mereval', 'iceheart-sea', 'merrowport', 'skald']
  },
  'plaguebringer': {
    nativeWeaving: `**Ecological.** Disease-hosting requires the Bryngloom's unique fungal-bog ecosystem — the spore-hush and the bog-rot. **Cultural.** Slavic bog-plague sainthood. **Founder.** Vespera bonded with bog-rot to cure the spore-hush — a product of the First Contract and Root-Veil Stratum. **Subrace-native.** Drun Neth (partial-death allows hosting), Morren (desperation), Clean Vreken.`,

    id: 'plaguebringer',
    term: 'Plaguebringer',
    type: 'class',
    region: 'bryngloom-forest',
    summary: 'A biological-vector specialist who cultivates, directs, and weaponizes living disease with the precision of a mycologist.',
    fullEntry: 'The Plaguebringer tradition grew from the Bryngloom Forest\'s fungal-ecology — a world where bioluminescent mycelium connected the roots of every ironwood tree and where the bog-preserved dead occasionally reanimated with fungal intelligence rather than necromantic will. A Plaguebringer is not a chaos agent. They are a cultivator with very specific targets. Their diseases are engineered for selective transmission, predictable progression, and controllable severity. The tradition demands deep biochemical knowledge and the philosophical comfort with causing suffering that most medical traditions specifically train against.',
    relatedTerms: ['bryngloom-forest', 'neth', 'vreken']
  },
  'pyrofiend': {
    nativeWeaving: `**Ecological.** The fire-pact requires proximity to Scathrach's influence beneath Emberspire and a culture that frames self-destruction as power. **Cultural.** Mesoamerican volcanic forge-cult and solar-sacrifice. **Founder.** A cabal of Solvarn occultists swallowed Scathrach's coals beneath Emberspire — products of the ur-bargain's wound. **Subrace-native.** Thrask Emberth and Solvarn outcasts; cold-adapted cultures reject fire-pacts.`,

    id: 'pyrofiend',
    term: 'Pyrofiend',
    type: 'class',
    region: 'sundale',
    summary: 'A volcanic pact-mage who channels Scathrach\'s demonic fire at the cost of their body being slowly remade into a cracking char-vessel of magma and bone.',
    fullEntry: 'The Pyrofiend tradition is the most viscerally destructive in the known world and one of the shortest in average practitioner lifespan. Scathrach, the Ashen Sovereign nesting in Emberspire\'s deepest vent, answers prayers of desperation with uncontrollable combustion — and the Pyrofiend tradition is the art of making that combustion controllable enough to survive. The Inferno Veil mechanic tracks how much of Scathrach\'s heat the practitioner is channeling; at high levels it damages the caster as well as the targets. The body gradually shifts from flesh to volcanic material. Eventually the conversion is complete and Scathrach claims the soul for its eternal furnace.',
    relatedTerms: ['cinderhoodoo', 'emberspire', 'emberspire_caldera', 'inferno_veil', 'scathrach', 'sundale']
  },
  'spellguard': {
    nativeWeaving: `**Ecological.** Magical-defense engineering requires the volcanic forge-tradition and the Solbrand's residual energy. **Cultural.** Forge-cult precision crossed with anti-Wyrd paranoia. **Founder.** Damon the Emberth smith blocked a solar flare with an alchemical tower shield during the entombment — a product of the Emberspire wound. **Subrace-native.** Velun Neth (magical cancellation), Thalren, Solvarn, Korr Emberth.`,

    id: 'spellguard',
    term: 'Spellguard',
    type: 'class',
    region: 'sundale',
    summary: 'A defensive combat-mage who specializes in identifying, neutralizing, and reflecting incoming magical threats — a living counterspell.',
    fullEntry: 'The Spellguard tradition was developed in the forge-caldera keeps of Sundale, where Emberth smiths who worked near the Solbrand needed practitioners capable of intercepting and defusing the occasional magical eruption from Sol\'s imprisoned resonance. A Spellguard does not primarily cast offensive spells — they identify the structure of incoming magic and dismantle it before it arrives, redirect it, or reshape it into something that serves a different purpose. They are the tradition that most resembles engineering rather than artistry.',
    relatedTerms: ['damon', 'emberth', 'solbrand', 'sundale']
  },
  'titan': {
    id: 'titan',
    term: 'Titan',
    type: 'concept',
    region: 'sundale',
    summary: 'The Titan tradition has been absorbed into the Warden class as the Monolith specialization. The calcified juggernaut arts of the Emberspire forge-clans now serve as a Warden path of gravitational immovability.',
    fullEntry: 'The Titan tradition was the Sundale forge-clans\' answer to overwhelming force: practitioners who weaponized their own bone density and gravitational mass to become immovable battlefield anchors. Drawing on the geothermal resonance of the volcanic Sundale landscape, they calcified their skeletons to hold corridors, lock down massive threats, and intercept damage with absolute, dense mass. This tradition has been absorbed into the Warden class as the Monolith specialization, where Wardens graft volcanic iron into their skeletal structure alongside their penitent jailer chains to become living stone sentinels.',
    transition: {
      aftermath: `The Sundale Titan-juggernauts did not vanish — they became the Monolith specialization of the Warden, grafting volcanic iron into their skeletons alongside the jailer chains. The old Titan strong-points along the Ashen Escarpment are now manned by Monolith Wardens.`,
      legacySite: `Sol's Anvil Mesa — where the Titan calcification rites were first performed — remains the initiation site for the Monolith path; the geothermal resonance that enables bone-calcification is strongest there.`,
      survivorNote: `A few "pure-mass" Titans maintain the original art without the chain-graft, serving as immovable garrison-anchors in <LoreLink termId="sundale">Sundale</LoreLink> keeps. They cannot tether like a Warden but can hold a corridor that nothing short of a glacier-wyrm can move them from.`
    },
    relatedTerms: ['emberth', 'groven', 'sundale', 'the_warden', 'warden']
  },
  'toxicologist': {
    nativeWeaving: `**Ecological.** Venom-distillation requires reagents unique to the Frostwood's Wyrd-dense, fog-predator mists. **Cultural.** Germanic-Celtic forest-alchemy and the practical defense against face-traders. **Founder.** Varis the Thalren alchemist extracted fog-predator venom — a product of the Fog Compact's mutated ecosystem. **Subrace-native.** Thalren and Unwoven Mimir; the reagents do not exist outside the Frostwood.`,

    id: 'toxicologist',
    term: 'Toxicologist',
    type: 'class',
    region: 'frostwood-reach',
    summary: 'A poison-crafter and delivery specialist who fights through careful preparation rather than direct confrontation — the most premeditated tradition in Mythrill.',
    fullEntry: 'The Toxicologist tradition grew in the Frostwood Reach\'s fog-choked timber, where the dense undergrowth produced both extraordinary pharmacological resources and the tactical conditions that made slow-acting, area-denial poisons more useful than swords. A Toxicologist is not an assassin in the conventional sense — they are a chemist. Their poisons are engineered for specific physiological effects, specific target populations, and specific durations. The tradition requires extraordinary patience and the stomach for outcomes that unfold over hours rather than seconds.',
    relatedTerms: ['frostwood-reach', 'house_thalreth']
  },
  'warden': {
    nativeWeaving: `**Ecological.** Chain-graft containment requires the ore-hauling and surgical tradition of Frostmaw's mining tunnels. **Cultural.** Andean vertical-engineering and the Vat-Breakers' legacy of containment. **Founder.** Alaric the Groven mine-guard drove an ore-chain through his own forearm to hold a specimen for three days — a product of the Vat-Breakers' Revolt Stratum. **Subrace-native.** Morgh Groven and Fexrick Drall natively; Kessen Neth, Skald, Vreken via the surgical graft (narrative unlock).`,

    id: 'warden',
    term: 'Warden',
    type: 'class',
    region: 'cragjaw-peaks',
    secondaryRegions: ['nordhalla'],
    summary: 'A grim, penitent jailer of dual seat — the chain-graft tradition invented by the Groven Alaric in Frostmaw Holdfast (Cragjaw Peaks) and secondarily practiced through the surgical school of the Frozen Archive (Nordhalla).',
    fullEntry: 'The Warden tradition was born in the lower tunnels of Frostmaw Holdfast in the Cragjaw Peaks, pioneered by the Groven mine-guard Alaric the Law-Keeper. When the Deep Alchemists\' vat-laboratories collapsed and their experiments poured into the tunnels, Alaric drove an ore-hauling chain through his own forearm into the largest specimen and held for three days. The chain rusted into his bone; he refused to have it removed. From that act came the entire chain-graft surgical tradition. Wardens are heavy-martial lockdown specialists who physically anchor themselves to the battlefield\'s greatest horrors, forcing them into a brutal duel of meat and bone; by driving rusted hooks and chains directly into their own flesh, they establish tethers that restrict the movement of abominations and let them build Tether Tension for devastating counter-strikes. Though born in the Cragjaw, the tradition spread to Nordhalla, where the surgical school of the Frozen Archive learned the graft-rite and adapted it for glacier-hunting — producing the cold-iron Skald Wardens who tether the things that crawl from the fjords. The primary seat remains the Chain-Hold at Frostmaw; the secondary seat the Frozen Archive.',
    relatedTerms: ['cragjaw-peaks', 'frozen_archive', 'frostmaw_holdfast', 'house_skalvyr', 'nordhalla', 'titan', 'the_warden', 'alaric']
  },
  'corvani': {
    id: 'corvani',
    term: 'Corvani',
    type: 'subfolk',
    region: 'nordhalla',
    summary: 'GM-only creature race. Glacier-dwelling subfolk of Nordhalla, raven-marked messengers bound to the Corvid Fate-Spirits who trade memories for passage across the frozen wastes.',
    fullEntry: 'The Corvani are a GM-only creature race (non-playable) of Nordhalla — raven-marked glacier-dwellers who carve their eyries into the sheer faces of the mile-high ice sheets. When House Skalvyr halted the glaciers at the price of eternal winter, a splinter group of highland survivors refused to descend into the fjord-keeps. They climbed higher, into the glacier-spires where the wind sings in polyphonic overtones, and struck a fate-bond with the ancient Corvid Fate-Spirits. The spirits anchored their memories against the isolation and granted them the sight to read threads of destiny. Now they serve as messengers between the frozen fjord-keeps, navigating whiteout and glacier-crevasse with preternatural skill. Their price is always a memory, freely given — recorded in the shifting raven-markings that crawl across their skin.',
    relatedTerms: ['corvid_speech', 'house_skalvyr', 'nordhalla', 'rooks_promontory', 'vesperas_perch']
  },
  'corvid_speech': {
    id: 'corvid_speech',
    term: 'Corvid-Speech',
    type: 'language',
    region: 'nordhalla',
    summary: 'GM-only creature language. The complex, polyphonic throat-signed language of the Corvani subfolk and the Corvid Fate-Spirits, utilizing clicks, whistles, and marking-shifts.',
    fullEntry: 'Corvid-Speech is a GM-only non-playable creature language of the Corvani subfolk, born from imitation of the Corvid Fate-Spirits and the howling polar gales of Nordhalla\'s glacier-faces. It is a polyphonic tongue that combines soft clicks, whistling, and low-frequency throat vibrations with subtle shifting of their fate-spun markings. This structure makes the language incredibly dense and near-impossible for other races to speak fluently without magical aid, but permits the Corvani to communicate silently and across vast distances between the frozen fjord-keeps.',
    relatedTerms: ['corvani', 'nordhalla']
  },
  'rime_born': {
    id: 'rime_born',
    term: 'Rime-Born',
    type: 'race',
    region: 'nordhalla',
    summary: 'The frost-touched, non-human survivors of Nordhalla\'s eternal winter, carrying the freezing stasis of the Hunger Pact.',
    fullEntry: 'The Rime-Born (historically referred to as the Breath-Takers or Hrym) are a stoic, formidable people of Nordhalla\'s frozen fjords. Evolving from refugees of the Hunger Pact who consumed their own dead during a three-winter blizzard, they carry a supernatural cold in their blood. Their skin feels like stone left in shadow, their breath freezes even in southern heat, and they suffer from the Frost-Tithe—a supernatural birth-curse tied directly to House Skalvyr\'s bargain with Keth-Amar. When the glaciers were halted, a price was set: every frost-touched birth must "pay" a life to the cold. The child survives by drawing the mother\'s warmth into itself — not as biology, but as the bargain\'s interest collected on each new generation. Those marked before birth emerge as blue-skinned Frostbound, carrying Keth-Amar\'s lingering attention. To quiet the curse, Ice-Cradles are carved into living glacier faces, where the deep cold suppresses the tithe\'s pull.',
    relatedTerms: ['bloodhammer_sump', 'house_skalvyr', 'nordhalla', 'stel', 'the_still_crag', 'vargtor', 'frostcirque']
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
    relatedTerms: ['aran_glen', 'bryngloom-forest', 'neth', 'over_shanty', 'root_veil', 'root_veil_scriptorium', 'valerius', 'vel_keth_bayou', 'vel-otharen', 'morrath-steward']
  },
  'vreken': {
    id: 'vreken',
    term: 'Vreken',
    type: 'race',
    region: 'bryngloom-forest',
    summary: 'A lantern-eyed people of the Bryngloom who sing to their glowing ancestors in inverted cathedrals, carrying amber and silver light through the dark forest.',
    fullEntry: 'The Vreken are the Bryngloom\'s first inhabitants — lantern-eyed crypt-speakers who predate the Neth\'s arrival by centuries. They carry the bioluminescent amber and silver glow of their ancestors in their eyes and skin, singing to the dead in inverted cathedrals carved into the peat-bogs. Divided into the Clean (deep-glow scholars) and the Marked (ghost-mycelium walkers), the Vreken view the Neth as spiritually bankrupt — trading with death instead of honoring it.',
    relatedTerms: ['animist', 'bryngloom-forest', 'deathcaller', 'fangmere_grove', 'hunters_gully', 'inquisitor', 'kora', 'lichborne', 'neth', 'plaguebringer', 'revenant', 'root_veil', 'sunken_spire', 'orven', 'nyssa', 'vespera']
  },
  'briaran': {
    id: 'briaran',
    term: 'Briaran',
    type: 'race',
    region: 'frostwood-reach',
    summary: 'Thorn-blooded descendants of the erased House Viridane who refused the Fog Compact and maintain a spiritual contract with the fae of the deep ironwood.',
    fullEntry: 'The Briaran are the living ghost of House Viridane — the original seventh binding house, erased and replaced by House Morrath after they refused Keth-Amar\'s demands. Known as the "eighth house" in common parlance — a count that begins with the seven official families and adds one more that history tried to forget — the Briaran carry their defiance in their blood and their thorns. They live deep in the untouched ironwood groves of the Frostwood Reach, following the old ways and rejecting Thalreth\'s Fog Compact entirely. Divided into the Unshorn (thorn-cloaked traditionalists) and the Smooth-Skinned (who pass as human), the Briaran possess the Unwritten Word — a truth-sense that detects spoken lies.',
    relatedTerms: ['bramble_heath', 'frostwood-reach', 'greythorn_copse', 'grimmwood', 'house_thalreth', 'house_viridane', 'ironwood_heart', 'mimir', 'silent_seventh', 'bri-vessela', 'thorn-speaker', 'selene']
  },
  'harath_vault': {
    id: 'harath_vault',
    term: 'Harath-Vault',
    type: 'location',
    region: 'sundale',
    summary: 'The massive subterranean capital of the Emberth forge-clans, carved into a dormant volcanic caldera three miles from Emberspire.',
    fullEntry: 'Carved radially into the volcanic throat of a dormant secondary caldera three miles from Emberspire sits the Harath-Vault, the massive subterranean capital of the Emberth forge-clans. Carved out by the Sun-Speakers centuries before the sun\'s death, the vault serves as both sacred temple to the Solbrand and industrial forge-caldera. The Korr Emberth tend the eternal ember here in holy silence, while the Thrask rangers mine and hunt the volcanic frontier above.',
    relatedTerms: ['emberspire', 'emberspire_caldera', 'emberth', 'great_forge', 'solbrand', 'sundale', 'vault_breath', 'vulkars_karst', 'berserker', 'hark-ash-hammer', 'grum-bloodhammer']
  },
  'frostmaw_holdfast': {
    id: 'frostmaw_holdfast',
    term: 'Frostmaw Holdfast',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'The ancestral stronghold of the Groven in the Cragjaw Peaks, site of the original vat-laboratories and the Vat-Breakers\' revolt.',
    fullEntry: 'Frostmaw Holdfast is the calcified heart of Groven civilization — a massive stronghold built into the vertical walls of a Cragjaw ravine. It was here that the Fexric Deep Alchemists first established their vat-laboratories, creating the Groven from Thrumm broodlings. And it was here that the Vat-Breakers\' revolt began, when the first generation of transformed Groven shattered their containment vats and rose against their creators. The holdfast remains contested territory between the Groven and the Deep Alchemists who still operate in the tunnels below.',
    relatedTerms: ['cragjaw-peaks', 'deep_alchemists', 'fexrick', 'formbender', 'frostmaw_massif', 'groven', 'house_tesshan', 'shaper', 'sump_galleries', 'the_spans', 'thrumm', 'vat_breakers_guild', 'warden', 'veyra', 'torin', 'alaric', 'fex-vestara', 'vat-breaker-foreman', 'deep-alchemist-prime', 'tesshan-lord', 'nesta']
  },
  'frozen_archive': {
    id: 'frozen_archive',
    term: 'Frozen Archive',
    type: 'location',
    region: 'nordhalla',
    summary: 'The great glacier-tomb of Nordhalla where the dead stand upright in the ice as permanent witnesses, and where the Augur tradition was born.',
    fullEntry: 'The Frozen Archive is Nordhalla\'s most sacred and terrifying location — a cathedral of ice where the dead stand upright in the glacier, perfectly preserved, their final expressions frozen for eternity. Scribe-sentinels maintain the genealogical records here, and the Augur tradition was born in its corridors, where proximity to the glacier-preserved dead creates a resonance that allows the living to glimpse the dead\'s final visions.',
    relatedTerms: ['augur', 'fjord_gate', 'house_skalvyr', 'nordhalla', 'rimors_hearth', 'harbinger', 'animist', 'warden', 'malakor', 'theron', 'skadi-glass-eye', 'sera-three-scars', 'sigurd-skalvyr', 'cassia', 'xyris', 'mor-vereth', 'halvar-skalvyr', 'the-first-liar', 'li-wei', 'triune-founders']
  },
  'synod_hold': {
    id: 'synod_hold',
    term: 'Synod Hold',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'The crystal-lattice archive of the Astril Luminarchy, where constellation-spirits are studied and the Unlit are judged.',
    fullEntry: 'The Synod Hold is the seat of the Astril Luminarchy — a vast archive built from resonant crystal-lattice in the Sundrift Vale. Here, the Astril hierarchy studies the constellation-spirits carried in their blood, adjudicates disputes between Lit and Unlit castes, and maintains the most comprehensive astronomical records in the known world. The Synod is also where False Prophets are tried and banished, their deceptive light recognized as a toxic forgery of true celestial resonance.',
    relatedTerms: ['ancestor_mounds', 'astril', 'false_prophet', 'house_ordavan', 'mound_camps', 'sundrift-vale', 'the-first-liar', 'loras-ordavan']
  },
  'merrowport': {
    id: 'merrowport',
    term: 'Merrowport',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'The largest human port-city on the Iceheart Sea, anchored to a warm volcanic seamount beneath the frozen waves.',
    fullEntry: 'Merrowport is the largest human settlement on the Iceheart Sea — a sprawling port-city of timber and iron anchored to a massive, warm subterranean volcanic seamount that keeps the surrounding waters perpetually unfrozen. The Merryn storm-sailors who dominate its docks tattoo their charts directly onto their skin, and the city is the primary gateway for trade between the Iceheart and every other region.',
    relatedTerms: ['gale_storm_shallows', 'house_mereval', 'iceheart-sea', 'minstrel', 'myrathil', 'the_shivering_bight', 'gambit', 'jax', 'merr-cael', 'mer-lyrisa', 'mereval-admiral', 'lyris', 'lyra']
  },
  'sunken_spire': {
    id: 'sunken_spire',
    term: 'Sunken Spire',
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A ruined, half-submerged cathedral in the deep Bryngloom where Vreken ancestral spirits congregate and the Over-Shanty black market thrives nearby.',
    fullEntry: 'The Sunken Spire is a ruin of unknown origin — a half-submerged stone cathedral sinking slowly into the peat-bogs of the deep Bryngloom. The Vreken treat it as sacred ground, believing their strongest ancestral spirits congregate in its drowned crypts. Nearby, the lawless Over-Shanty has grown in its shadow, a permanent black-market settlement where Neth contracts hold no authority.',
    relatedTerms: ['bryngloom-forest', 'fangmere_grove', 'merryns_drift', 'neth', 'peat_bog_sinks', 'vreken', 'inquisitor', 'vrael-forty-seventh', 'vespera', 'kor-vasseth', 'kora', 'vesper', 'orven', 'elias']
  },
  'greymark_keep': {
    id: 'greymark_keep',
    term: 'Greymark Keep',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'The ancestral seat of House Thalreth and the administrative core of the Sovereign Ledger, protected by petrified ironwood palisades.',
    fullEntry: 'Greymark Keep is the administrative capital of the Frostwood Reach. A massive peat-stone fortress, it houses the great tapestries of the Sovereign Ledger and the Tapestry-Wards, where Mimir and frontier children are assimilated. The keep is the base of the Scribe-Cartel, which enforces the monopoly on soot-resin ink and paper. It is ruled by Jarl-Archivist Kaelen Thalreth, who holds the keys to the ledger-libraries that legally validate all human existence in the region.',
    relatedTerms: ['frostwood-reach', 'house_thalreth', 'mistbarrow', 'rite-of-masks', 'scribes_tower', 'the_shallows', 'inquisitor', 'kaelen-thalreth', 'aldren-thalreth', 'elara-thalreth']
  },
  'ironjaw_port': {
    id: 'ironjaw_port',
    term: 'Ironjaw Port',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'The Neth\'s largest external outpost, built into the frozen cliffs where the Bryngloom Forest meets the Iceheart Sea.',
    fullEntry: 'Ironjaw Port is the Neth\'s economic lung — their largest external outpost, built into frozen cliffs where the Bryngloom Forest meets the churning Iceheart Sea. Every trade route between the Bryngloom and the outside world passes through it. The port houses a copy of the First Contract, allowing Neth stationed here to operate without the Fading. The mixed Velun-Kessen council that governs the port has been quietly feuding for two centuries over tariff policy.',
    relatedTerms: ['bryngloom-forest', 'iceheart-sea', 'neth', 'skalds_longport', 'the_saltmaw_estuary', 'treakous_rift', 'gambit', 'lyra']
  },
  'skald': {
    id: 'skald',
    term: 'Skald',
    type: 'subculture',
    region: 'nordhalla',
    summary: 'The human subculture of Nordhalla — cold-tempered warriors, glacier-keepers, and oral historians who value bloodline purity and cold-resistance above all.',
    fullEntry: 'The Skald are the dominant human bloodline of Nordhalla, shaped by eight centuries of eternal winter into a hardened, cold-tempered people. They are the warrior backbone of House Skalvyr\'s domain — broad-shouldered, frost-scarred, and possessed of a raw physical endurance that other regions find unsettling. Their oral-history traditions produce the finest chroniclers in the north, and their glacier-keep genealogies validate every Skalvyr bloodline claim. They speak Old Nord and value cold-resistance as the primary measure of worth.',
    relatedTerms: ['house_skalvyr', 'minstrel', 'nordhalla', 'grum-bloodhammer', 'cassia']
  },
  'kora': {
    id: 'kora',
    term: 'Kora',
    type: 'historical_figure',
    region: 'bryngloom-forest',
    summary: 'The Veil-Speaker who founded the blood-covenant tradition of death magic that became one half of the Revenant class.',
    fullEntry: 'Kora the Veil-Speaker sacrificed her own life force to keep the ancestral lights of the Bryngloom burning. When the candle-flames that guided the Vreken through the peat-bogs began to dim, Kora fed them her own vitality, converting her blood into luminous death-magic. The curse that followed — the ability to hear the screams of every ancestor whose light she tended — drove her to codify her techniques into the blood-covenant tradition. Her methods were later merged with Vesper\'s frost-stasis art to create the unified Revenant class.',
    relatedTerms: ['bryngloom-forest', 'revenant', 'vesper', 'vreken']
  },
  'vesper': {
    id: 'vesper',
    term: 'Vesper',
    type: 'historical_figure',
    region: 'bryngloom-forest',
    summary: 'The Scribe who founded the frost-stasis tradition, binding his soul to a basalt phylactery to achieve perpetual dying.',
    fullEntry: 'Vesper the Scribe was a Neth archivist who discovered that the bog\'s preserving ichor — the same substance that sustains the First Contract — could be used to arrest the dying process itself. By binding his soul to a carved basalt phylactery, Vesper achieved a state of perpetual dying: neither alive nor dead, sustained by the cold preservation of the deep peat. His techniques were later merged with Kora\'s blood-covenant to create the Revenant class, combining volatile death-magic with frost-stasis resurrection.',
    relatedTerms: ['bryngloom-forest', 'kora', 'neth', 'revenant']
  },
  'orven': {
    id: 'orven',
    term: 'Orven-Sen',
    type: 'historical_figure',
    region: 'bryngloom-forest',
    summary: 'The Kessen probability-weaver who predicted the eruption of Emberspire sixty-three years before it happened — and whose hidden contingency clauses saved millions.',
    fullEntry: 'Orven-Sen was a mid-level Kessen probability-weaver attached to the Ironjaw Port trade delegation. In the Year of the First Ash (the first year following the Shattering of the Seal and the initial eruption of Emberspire), he filed a formal prediction that the volcano\'s secondary chambers would suffer a second, catastrophic tectonic eruption within a century. He was fined for filing a frivolous prediction and died forty years later without seeing it come true. Sixty-three years after his death, the secondary chambers erupted exactly as predicted — permanently blanketing the sky in thick soot — and his quietly inserted contingency clauses in three generations of warmth-resource contracts saved the Neth an estimated four million gold-weight in renegotiation costs.',
    relatedTerms: ['bryngloom-forest', 'emberspire', 'neth', 'inquisitor']
  },
  'elias': {
    id: 'elias',
    term: 'Elias',
    type: 'historical_figure',
    region: 'bryngloom-forest',
    summary: 'A co-founder of the Inquisitor tradition who developed the ritual frameworks for severing magical contracts and binding fiends.',
    fullEntry: 'Elias was a scholar of the Bryngloom who recognized that the same legal precision the Neth used to write contracts could be inverted to dismantle them. Where the Velun built binding clauses, Elias built severance clauses — ritual frameworks capable of identifying, disrupting, and annulling magical contracts of any complexity. His work became the foundation of the Inquisitor tradition, enabling witch-hunters to sever the bonds between rogue mages and their contracted powers.',
    relatedTerms: ['bryngloom-forest', 'inquisitor', 'neth', 'orven']
  },

  // ============================================================
  // NOBLE HOUSES (continued)
  // ============================================================

  'house_mereval': {
    id: 'house_mereval',
    term: 'House Mereval',
    type: 'noble_house',
    region: 'iceheart-sea',
    summary: 'The seafaring ruling family of the Iceheart Sea, enforcing the Sea-Charter and the Brine-Bond Syndicate.',
    fullEntry: 'House Mereval rules the Iceheart Sea under Grand Admiral Varis. Having traded calm waters for unfreezing sea-lanes, the house governs the floating capital of Merrowport. They maintain control through a monopoly on the Brine-Bond Syndicate, paying crews in Voyage-Shares, and enforce ship registrations via the Unfreezing Booms. Under the state-enforced Luck-Ledger, the house purges Tide-Speak animists. The house has recently deployed steam-trawling fleets, causing ecological damage that drives Myrathil to madness.',
    relatedTerms: ['deepwell_archipelago', 'first_shore', 'gale_storm_shallows', 'iceheart-sea', 'kelpies_cove', 'merrowport', 'minstrel', 'spindrift_lagoon', 'the_saltmaw_estuary', 'mereval-admiral', 'merr-cael', 'mer-lyrisa']
  },
  'house_tesshan': {
    id: 'house_tesshan',
    term: 'House Tesshan',
    type: 'noble_house',
    region: 'cragjaw-peaks',
    summary: 'The mountain lords of the Cragjaw Peaks who enforce the Knotted Decree, the Steam-Line Cartel, and the Tesshan-Mit\'a.',
    fullEntry: 'House Tesshan rules the vertical keeps of the Cragjaw Peaks under Jarl-Inca Oda Tesshan. Having traded visibility for a protective snow-veil, the house isolated itself from lowlanders. They maintain control through a monopoly on the geothermal Steam-Line Cartel and the enforcement of the Tesshan-Mit\'a labor system. By outlawing written language in favor of knotted khipu-cords, Oda Tesshan regulates keeps by controlling their records. The house systematically purges traditional "Kami-Speakers" who commune with mountain rock-spirits (Kami).',
    relatedTerms: ['chronarch', 'cragjaw-peaks', 'deepchasm_keep', 'frostmaw_holdfast', 'frostmaw_massif', 'gearworks_gulch', 'groven', 'iron_ravine', 'vat_breakers_guild', 'tesshan-lord', 'fex-vestara', 'veyra', 'alaric']
  },
  'house_ordavan': {
    id: 'house_ordavan',
    term: 'House Ordavan',
    type: 'noble_house',
    region: 'sundrift-vale',
    summary: 'The nomadic ruling family of the Sundrift Vale, enforcing the Iron-Yurt Law and the Herd-Tithe.',
    fullEntry: 'House Ordavan governs the starless steppe of the Sundrift Vale under Khatun Bayarmaa. Having traded fertile soil for the endless migration, the house enforces pasture and migration registrations on Steppe-Staves. They maintain a monopoly through the Herd-Tithe, demanding a third of yearly foals, and police routes via basalt Cairn-Checkpoints. Under the state-enforced ancestor worship, they systematically purge Sky-Singers. The house recently authorized geothermal Thermal Bores, creating toxic sinkholes on the steppe.',
    relatedTerms: ['ancestor_mounds', 'ancestor_wold', 'astril', 'grass_tundra', 'kumis_downs', 'mound_camps', 'starfall_vale', 'sundrift-vale', 'synod_hold', 'the_long_steppe', 'loras-ordavan']
  },
  'house_morrath': {
    id: 'house_morrath',
    term: 'House Morrath',
    type: 'noble_house',
    region: 'bryngloom-forest',
    summary: 'The noble house of the Bryngloom Forest governed by Regent Morrath Neth, enforcing the Great Registry and the Postmortem Corvée.',
    fullEntry: 'House Morrath governs the Bryngloom Forest under the First Contract. Having borrowed their survival from the Neth scribe-clan, the house operates as an administrative regency. They maintain control through a monopoly on Memory-Glass Covenants and the Great Registry, demanding labor and memory tithes. Deceased debtors are conscripted as Debt-Revenants (the Postmortem Corvée) to work the sumps. The house has recently authorized industrial Peat-Presses, causing swamp drainage that decays the ironwood roots.',
    relatedTerms: ['black_fen', 'bryngloom-forest', 'keth_amar', 'morrens_bogpost', 'neth', 'silent_seventh', 'widows_quagmire', 'morrath-steward', 'vel-otharen', 'kor-vasseth', 'vespera', 'vesper']
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
    relatedTerms: ['deepwell_archipelago', 'emberspire', 'iceheart-sea', 'merrowport', 'spindrift_lagoon', 'the_saltmaw_estuary', 'the_shivering_bight', 'treakous_rift', 'wraithsound']
  },
  'groven': {
    id: 'groven',
    term: 'Groven',
    type: 'race',
    region: 'cragjaw-peaks',
    summary: 'Humanoid bridge-trolls of the Cragjaw Peaks, alchemically forged from Thrumm blood by Fexric Deep Alchemists, who shattered their vats and rose in the Vat-Breakers\' revolt.',
    fullEntry: 'The Groven were not born — they were made. Eight hundred years ago, Fexric Deep Alchemists captured Thrumm broodlings and submerged them in alchemical serums beneath Frostmaw Crag, creating a race of servitors with smoothed stone-hide and extended limbs. The first generation developed will, then language. They shattered their containment vats and rose against their creators in the Vat-Breakers\' revolt, claiming the Ancestor-Spans as their homeland. Divided into the heavy-scaled Morgh and the long-limbed Ithran, the Groven now serve as the Cragjaw\'s bridge-builders, growing calcified spans from the bones of their willing dead.',
    relatedTerms: ['ancestor_gaps', 'cragjaw-peaks', 'deep_alchemists', 'deepchasm_keep', 'dreadnaught', 'fexrick', 'formbender', 'frostmaw_holdfast', 'house_tesshan', 'lost_brood_vats', 'shaper', 'slag_gulch', 'stags_rest_moraine', 'the_great_gorge', 'the_spans', 'thrumm', 'titan', 'vat_breakers_guild', 'torin', 'alaric', 'deep-alchemist-prime', 'vat-breaker-foreman']
  },
  'fexrick': {
    id: 'fexrick',
    term: 'Fexrick',
    type: 'race',
    region: 'cragjaw-peaks',
    summary: 'The oldest continuous civilization on Mythrill — goblinoid engineers whose guilds built the world\'s geothermal infrastructure and who accidentally created both the Groven and themselves.',
    fullEntry: 'The Fexrick are the engineering heart of the known world — goblinoid guild-masters whose geothermal pipes, steam-roads, and turbine wheels form the connective infrastructure that links all seven regions. They predate every other race, having emerged from the deep caverns millennia before humans discovered fire. An accident in the alchemical vats that created the Groven also produced the Fexrick themselves — chemical runoff that coalesced into a new form of life. Divided into the guild-bound Kethrin and the free-roaming Drall clan nomads, the Fexrick speak Fexric and sing maintenance-songs to their machines.',
    relatedTerms: ['cragjaw-peaks', 'deep_alchemists', 'frostmaw_holdfast', 'gearworks_gulch', 'groven', 'sump_galleries', 'sump_rift', 'thrumm', 'deep-alchemist-prime']
  },

  // ============================================================
  // MISSING CONCEPTS
  // ============================================================

  'silent_seventh': {
    id: 'silent_seventh',
    term: 'The Silent Seventh',
    type: 'concept',
    region: 'sundale',
    summary: 'The truth of the Binding Compact: House Viridane, the original seventh house, refused Keth-Amar and was erased from history, replaced by House Morrath as a substitute signatory.',
    fullEntry: 'Among the seven noble houses that officially struck the Binding Compact, one stands silent — its entry in every ledger and contract-hall reduced to a blank line where a name should be. The six surviving houses (Thalreth, Skalvyr, Tesshan, Solvan, Mereval, Ordavan) plus Morrath are publicly recorded, but Morrath\'s records are conspicuously sparse. The reason is now known: House Viridane was the original seventh binding house. When Viridane refused Keth-Amar\'s demands and fled south, the remaining six houses elevated House Morrath — a minor family — as a substitute signatory to fill the gap in the ritual. Viridane was then erased from every record. Morrath\'s records are sparse because they were written to replace a history that predated them. Six houses know this truth. None will confirm it. Scribe-Sentinels who research the matter have a habit of disappearing into the fog.',
    relatedTerms: ['briaran', 'house_morrath', 'house_viridane', 'keth_amar', 'the_warden']
  },
  'damon': {
    id: 'damon',
    term: 'Damon',
    type: 'historical_figure',
    region: 'sundale',
    summary: 'The Emberth smith who founded the Spellguard tradition, developing the art of identifying and neutralizing magical threats near the volatile Solbrand.',
    fullEntry: 'Damon was a master Emberth smith in the forge-caldera keeps of Sundale, working in close proximity to the Solbrand. The imprisoned star\'s resonance occasionally erupted in unpredictable magical bursts — dangerous for the forge-clans who worked nearby. Damon developed the first systematic method for detecting, analyzing, and dismantling incoming magical energy before it could manifest. His techniques became the foundation of the Spellguard tradition: practitioners who treat magical defense as an engineering discipline rather than an artistic one.',
    relatedTerms: ['emberth', 'solbrand', 'spellguard', 'sundale']
  },

  // ============================================================
  // DUAL-ORIGIN & CLASS FOUNDERS
  // ============================================================

  'veyra': {
    id: 'veyra',
    term: 'Veyra',
    type: 'historical_figure',
    region: 'frostwood-reach',
    summary: 'The Mimir chronicler who merged the Frostwood kinetic momentum dance with the Frostmaw biological body-sculpting art to create the Shaper tradition.',
    fullEntry: 'Veyra was a Mimir chronicler who spent centuries studying both the Frostwood Reach kinetic momentum dance (pioneered by Sylvanus) and the Frostmaw Holdfast biological body-sculpting art (pioneered by Torin). She proved they were one dance seen from two angles — momentum shaping form, form directing momentum — and fused them into the six Shaping Forms. She still leads the Form-Convergence from Frostmaw Holdfast, her semi-crystalline skin more calcified each year, the only Shaper to hold the merged art without burning out.',
    relatedTerms: ['frostwood-reach', 'frostmaw_holdfast', 'mimir', 'shaper', 'sylvanus', 'torin', 'house_tesshan']
  },
  'sylvanus': {
    id: 'sylvanus',
    term: 'Sylvanus',
    type: 'historical_figure',
    region: 'frostwood-reach',
    summary: 'The Frostwood Reach practitioner who founded the kinetic momentum dance tradition later merged into the Shaper class.',
    fullEntry: 'Sylvanus was a Mimir of the deep ironwood canopy who learned to synchronize strikes with wind-swept ironwood branches, developing the hyper-accelerated kinetic momentum dance. The tradition was later merged by Veyra with Torin\'s biological adaptation art into the Shaper class.',
    relatedTerms: ['frostwood-reach', 'mimir', 'shaper', 'veyra']
  },
  'torin': {
    id: 'torin',
    term: 'Torin',
    type: 'historical_figure',
    region: 'cragjaw-peaks',
    summary: 'The Frostmaw Holdfast practitioner who founded the biological body-sculpting tradition later merged into the Shaper class.',
    fullEntry: 'Torin was a Groven of Frostmaw Holdfast who drank raw alchemical sulfur-clay, forcing his skeleton to calcify and expand, and developed the biological body-sculpting art from the Deep Alchemists\' vat-heritage turned inward. The tradition was later merged by Veyra with Sylvanus\'s kinetic momentum dance into the Shaper class.',
    relatedTerms: ['cragjaw-peaks', 'frostmaw_holdfast', 'groven', 'shaper', 'veyra']
  },
  'xyris': {
    id: 'xyris',
    term: 'Xyris',
    type: 'historical_figure',
    region: 'sundrift-vale',
    summary: 'The Sundrift Vale nomad who tore a hole in reality and co-founded the Harbinger tradition; she died from the tear.',
    fullEntry: 'Xyris was a nomad of the Sundrift Vale who spliced temporal friction into her veins and tore open reality. The hole killed her, but it proved the chaos could be wielded. Her work was completed by Malakor of Nordhalla, who calculated the arithmetic of her doom — when the holes she opened would consume everything. The Harbinger tradition is their merger: Xyris\'s tear joined to Malakor\'s arithmetic.',
    relatedTerms: ['harbinger', 'malakor', 'sundrift-vale']
  },
  'malakor-the-archivist': {
    id: 'malakor-the-archivist',
    term: 'Malakor',
    type: 'historical_figure',
    region: 'nordhalla',
    summary: 'The Nordhalla archivist who calculated the arithmetic of doom and co-founded the Harbinger tradition; still leads the Doom-Choir.',
    fullEntry: 'Malakor is a Nordhalla archivist who did the cold work Xyris could not: he calculated exactly when her reality-tears would consume everything. The calculation did not break him; it gave him a purpose. He merged Xyris\'s chaos-work with his prophetic arithmetic to found the Harbinger tradition, and still leads the Doom-Choir from the Frozen Archive, serene in the certainty that the equation has only one solution.',
    relatedTerms: ['frozen_archive', 'harbinger', 'nordhalla', 'xyris']
  },
  'orven': {
    id: 'orven',
    term: 'Orven',
    type: 'historical_figure',
    region: 'bryngloom-forest',
    summary: 'The Vreken who forged the first cold-iron blade, swore the Barbed Vow, and co-founded the Inquisitor tradition; gone dark in the deep Bryngloom.',
    fullEntry: 'Orven the Still-Handed was a Vreken of the Bryngloom Forest who forged the first cold-iron blade and swore the Barbed Vow to hunt corrupted kin whose ancestral spirit-bonds had gone rogue. His Bryngloom-rooted tradition was merged with Elias the Salt-Scarred\'s Frostwood anti-Wyrd work into the Inquisitor class. Orven has gone dark — last recorded during a final network-severance in the deep Bryngloom. Neither confirmed dead nor returning.',
    relatedTerms: ['bryngloom-forest', 'elias', 'inquisitor', 'vreken', 'neth', 'emberspire']
  },
  'jax': {
    id: 'jax',
    term: 'Jax',
    type: 'historical_figure',
    region: 'iceheart-sea',
    summary: 'The Merryn pirate who wagered his lifeline against a storm-spirit at Merrowport and co-founded the Gambit tradition; missing, last seen walking into the Iceheart Sea.',
    fullEntry: 'Jax was a Merryn pirate who wagered his lifeline against a storm-spirit at Merrowport — winning the wind but losing his blood\'s warmth. He co-founded the Gambit tradition with Lyra the Kessen probability-weaver. Jax is missing: last seen walking into the Iceheart Sea at midnight, fully clothed, with a smile and a loaded die. The Gambits suspect he walked into the water to clear his debt with the storm-spirit in one final game.',
    relatedTerms: ['gambit', 'iceheart-sea', 'lyra', 'merrowport']
  },
  'lyra': {
    id: 'lyra',
    term: 'Lyra',
    type: 'historical_figure',
    region: 'bryngloom-forest',
    summary: 'The Kessen Neth probability-weaver who co-founded the Gambit tradition; radicalized, now leading the Deck-Burners faction from Ironjaw Port.',
    fullEntry: 'Lyra was a Kessen Neth probability-weaver who read the threads of consequence through rune-etched cards, plucking the single timeline in which her caravan survived — at the cost of fracturing her consciousness. She co-founded the Gambit tradition with Jax the Merryn pirate. Lyra has since radicalized: her Deck-Burners faction seeks to force the universe to choose, burning rune-cards to collapse probability into certainty — a heresy the older Gambits consider a breach of the tradition\'s relationship with chance itself.',
    relatedTerms: ['bryngloom-forest', 'gambit', 'ironjaw_port', 'jax', 'neth']
  },
  'alaric': {
    id: 'alaric',
    term: 'Alaric',
    type: 'historical_figure',
    region: 'cragjaw-peaks',
    summary: 'The Groven mine-guard who invented the chain-graft tradition and founded the Warden class; still leads the Bound with the chain rusted into his bone.',
    fullEntry: 'Alaric the Law-Keeper was a Groven mine-guard in the lower tunnels of Frostmaw Holdfast. When the Deep Alchemists\' vat-laboratories collapsed and their experiments poured into the tunnels, Alaric drove an ore-hauling chain through his own forearm into the largest specimen and held for three days. The chain rusted into his bone; he refused to have it removed. From that act came the entire chain-graft surgical tradition and the Warden class. Alaric still leads the Bound from the Chain-Hold at Frostmaw, his regenerative Thrumm-derived biology keeping him functional eight centuries beyond a normal Groven lifespan.',
    relatedTerms: ['cragjaw-peaks', 'deep_alchemists', 'frostmaw_holdfast', 'groven', 'warden', 'house_tesshan']
  },
  'kael': {
    id: 'kael',
    term: 'Kael',
    type: 'historical_figure',
    region: 'sundrift-vale',
    summary: 'The Ordan totem-singer who discovered ancestral communion through bone-eruption and co-founded the Animist tradition.',
    fullEntry: 'Kael was an Ordan totem-singer of the Sundrift Vale who discovered ancestral communion when a totem woven from his migration-horse\'s mane erupted with bone-resonance and the spirit of his grandfather spoke through the overtones of his throat-singing. His totemic tradition was one of three independent discoveries that merged into the Animist class when he met Nyssa and Theron at a crossroads and recognized their shared art.',
    relatedTerms: ['animist', 'nyssa', 'sundrift-vale', 'theron']
  },
  'nyssa': {
    id: 'nyssa',
    term: 'Nyssa',
    type: 'historical_figure',
    region: 'bryngloom-forest',
    summary: 'The Vreken spore-elder who discovered ancestral communion through spore-inhalation and co-founded the Animist tradition.',
    fullEntry: 'Nyssa was a Vreken spore-elder of the Bryngloom Forest who inhaled the loa on bioluminescent spores and heard the ancestral dead speak through shifting glow on her skin. Her spore-inhalation tradition was one of three independent discoveries that merged into the Animist class when she met Kael and Theron at a crossroads and recognized their shared art.',
    relatedTerms: ['animist', 'bryngloom-forest', 'kael', 'theron', 'vreken']
  },
  'theron': {
    id: 'theron',
    term: 'Theron',
    type: 'historical_figure',
    region: 'nordhalla',
    summary: 'The Skald rune-carver who discovered ancestral communion through skin-inscription at the Frozen Archive and co-founded the Animist tradition.',
    fullEntry: 'Theron was a Skald rune-carver of Nordhalla who inscribed his ancestors\' names into his own skin at the Frozen Archive and found that the rune itself became the house of the dead — the spirit residing in the scar-tissue. His runic tradition was one of three independent discoveries that merged into the Animist class when he met Kael and Nyssa at a crossroads and recognized their shared art.',
    relatedTerms: ['animist', 'frozen_archive', 'kael', 'nordhalla', 'nyssa']
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
    relatedTerms: ['aex', 'dawn_vigil', 'emberspire_caldera', 'emberth', 'grum', 'harath_vault', 'house_solvan', 'keth_amar', 'myrathil', 'orven', 'pyrofiend', 'scathrach', 'solbrand', 'sundale', 'the_breach', 'sol-kaessen', 'sol-vareths', 'thrak-damos', 'solvan-steward', 'dawn-vigil-commander', 'damon', 'malakor', 'hark-ash-hammer', 'frigga-skalvyr', 'grum-bloodhammer', 'sera-solvan', 'first-cabal']
  },

  // ============================================================
  // NOBLE HOUSES — Missing
  // ============================================================

  'house_viridane': {
    id: 'house_viridane',
    term: 'House Viridane',
    type: 'noble_house',
    region: 'frostwood-reach',
    summary: 'The original seventh binding house that refused Keth-Amar — erased and replaced by House Morrath, their descendants surviving as the thorn-blooded Briaran.',
    fullEntry: 'House Viridane was the seventh binding family of the pre-Breach world — and the only one that refused to participate in the Dark Bargains when Keth-Amar demanded capitulation. Called the "eighth house" in common speech because the official records count seven public families and Viridane is the one erased and replaced, they were in truth one of the original seven signatories of Sol\'s Binding Compact. Where the six surviving houses traded memory, summer, visibility, or heirs, Viridane chose defiance. The cost was absolute: their name was struck from every ledger, every contract, every record. Their holdings were distributed among the cooperating houses. House Morrath was elevated to fill the gap in the binding ritual, and Viridane\'s bloodline was declared legally nonexistent. But the Viridane survived. Retreating into the deepest ironwood groves of the Frostwood Reach, they maintained a spiritual contract with the fae of the deep forest — a pact older than the noble houses themselves. Over centuries, the contract changed their bloodline. Their children grew thorns from their forearms. Their eyes shifted to the green of deep canopy. They became the Briaran — the thorn-blooded descendants who carry the Unwritten Word, a truth-sense that detects spoken lies. House Viridane is not dead. It is simply unwritten.',
    relatedTerms: ['briaran', 'frostwood-reach', 'house_thalreth', 'keth_amar', 'silent_seventh', 'bri-vessela', 'selene']
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
    relatedTerms: ['atropolis', 'bryngloom-forest', 'keeper_of_the_last_threshold', 'neth', 'vreken', 'kora', 'orven', 'kor-vasseth', 'triune-founders']
  },

  'thrumm': {
    id: 'thrumm',
    term: 'Thrumm',
    type: 'race',
    region: 'cragjaw-peaks',
    summary: 'The primordial ancestor-species from which the Groven were alchemically created — regenerative, slow-witted tunnel-dwellers still hunted by Deep Alchemists for experimentation.',
    fullEntry: 'The Thrumm are the ancestral root-stock from which the Groven were engineered. Before the Fexric Deep Alchemists began their experiments, the Thrumm were the dominant tunnel-dwelling species of the Cragjaw Peaks — large, powerfully built, and possessed of a supernatural regenerative capacity that allowed them to survive injuries that would kill any other creature. They were not warlike. They were not ambitious. They ate, they bred, they slept, and they healed. It was this combination of physical resilience and intellectual docility that made them perfect subjects for the Deep Alchemists\' transformation vats. Eight hundred years ago, the Alchemists captured hundreds of Thrumm broodlings and submerged them in alchemical serums, accelerating their cognitive development, hardening their skin into stone-scale, and extending their limbs for tool use. The result was the Groven. The Thrumm who were not captured still inhabit the deepest tunnels, but their numbers are dwindling. The Deep Alchemists continue to harvest fresh broodlings when they can find them, and reports from the lower sumps suggest the practice has not stopped.',
    relatedTerms: ['cragjaw-peaks', 'deep_alchemists', 'fexrick', 'frostmaw_holdfast', 'groven', 'vat_breakers_guild']
  },

  'deep_alchemists': {
    id: 'deep-alchemists',
    term: 'Deep Alchemists',
    type: 'faction',
    region: 'cragjaw-peaks',
    summary: 'The most dangerous sub-faction of the Fexrick — cold methodical experimenters who created the Groven from Thrumm blood and continue their work in sealed vat-laboratories beneath Frostmaw Crag.',
    fullEntry: 'The Deep Alchemists are the oldest continuous research organization on Mythrill. Predating the Dark Bargains by millennia, they were refining living matter in the deep tunnels before humans discovered fire. Eight hundred years ago they captured Thrumm broodlings and forged the Groven — a race of servitors intended for manual labor. The first generation developed will, then language, then rebellion. The Vat-Breakers\' revolt shattered the Alchemists\' surface operations, but the guild retreated into sealed vat-laboratories beneath Frostmaw Crag and never stopped working. Their current project — the Lost Brood — involves Thrumm and partially-transformed Groven who have been in their vats for seven centuries. The Alchemists believe the Wyrd itself can be refined, distilled, and injected to create a new form of life that transcends both organic and Wyrd biology.',
    relatedTerms: ['fexrick', 'frostmaw_holdfast', 'groven', 'lost_brood_vats', 'thrumm', 'vat_breakers_guild', 'alaric', 'vat-breaker-foreman']
  },

  'keeper_of_the_last_threshold': {
    id: 'keeper_of_the_last_threshold',
    term: 'Keeper of the Last Threshold',
    type: 'concept',
    region: 'bryngloom-forest',
    summary: 'The entity with whom the Neth struck the First Contract — a death-threshold guardian that enforces all binding agreements in exchange for the preservation of the contracting parties.',
    fullEntry: 'The Keeper of the Last Threshold is the metaphysical entity that enforces the Neth\'s contract system. Neither god nor spirit, the Keeper exists at the boundary between life and death — the last threshold any soul must cross. When the Neth ancestors sought to preserve themselves against the Fading, it was the Keeper they approached, offering to serve as the eternal record-keepers of all contracts in exchange for the preservation of their bodies. The Keeper accepted. Every Neth contract is enforced by the Keeper\'s authority: broken agreements trigger the Debt-Revenant, honored agreements extend the Fading deadline, and the most sacred oaths are sealed with the Keeper\'s own mark. The Drun — Neth who have severed all contracts — are invisible to the Keeper, existing in a state of legal non-existence that is simultaneously freedom and exile.',
    relatedTerms: ['black_fen', 'bryngloom-forest', 'neth', 'root_veil', 'root_veil_scriptorium', 'valerius', 'vel-otharen', 'morrath-steward']
  },

  'vault_breath': {
    id: 'vault_breath',
    term: 'Vault-Breath',
    type: 'concept',
    region: 'sundale',
    summary: 'The Emberth discipline of absolute stillness and thermal conservation — a meditative practice that minimizes heat loss in the volcanic depths of the Harath-Vault.',
    fullEntry: 'Vault-Breath is the foundational Emberth discipline — a meditative practice of absolute physical stillness developed to conserve body heat in the geothermal depths of the Harath-Vault. Practitioners learn to slow their metabolism, reduce their movement to micro-adjustments, and synchronize their breathing with the volcanic vent cycles. At its highest level, Vault-Breath allows an Emberth to enter a state of suspended animation indistinguishable from death — no heartbeat, no breath, no heat signature. The Korr Sun-Speakers use this state during their sacred meditations, while the Thrask rangers employ it for ambush hunting in the cinder badlands.',
    relatedTerms: ['emberth', 'harath_vault', 'sundale']
  },

  'dawn_vigil': {
    id: 'dawn-vigil',
    term: 'Dawn Vigil',
    type: 'faction',
    region: 'sundale',
    summary: 'The most militant of the Solvarn restoration factions — a fighting order that believes the Sundered Monoliths can be reassembled to restart the imprisoned star Sol.',
    fullEntry: 'The Dawn Vigil was originally founded in Year 340 of the Dimming as a quietist, monastic order of Martyrs who tracked Monolith locations in secret. However, in the past two decades, under the aggressive leadership of Hierophant Aethelgard, they militarized, seized control of Sundale\'s keeps, and transformed into a radical global crusading faction. The Vigil dispatches small bands of Solvarn Martyrs, Pyrofiends, and Augurs into every region to recover Sundered Monolith fragments by any means necessary. Their sigil is a rising sun pierced by obsidian. Publicly, they claim to serve the restoration of House Solvan. Privately, the Vigil\'s inner council has calculated that reassembling the Monoliths will not restart Sol — it will summon Keth-Amar back to finish what it started. They continue the expeditions not for restoration, but to ensure no one else assembles them first.',
    relatedTerms: ['emberspire', 'house_solvan', 'keth_amar', 'solbrand', 'sundale', 'the_ashen_escarpment']
  },

  'vat_breakers_guild': {
    id: 'vat-breakers-guild',
    term: 'Vat-Breakers\' Guild',
    type: 'faction',
    region: 'cragjaw-peaks',
    summary: 'The governing body of the Groven, founded by the first generation who shattered their containment vats and rose against the Deep Alchemists in the revolt that freed their people.',
    fullEntry: 'The Vat-Breakers\' Guild is the governing body of Groven civilization — founded by the first generation of transformed Groven who shattered their alchemical containment vats and rose against their Fexric creators. The Guild maintains the Ancestor-Spans (bridges grown from the calcified bones of willing Groven dead), adjudicates Groven law, and patrols the lower tunnels for signs of renewed Deep Alchemist experimentation. Their headquarters in Frostmaw Holdfast houses the calcified skeleton of the first foreman — the Groven who shattered the first vat — her outstretched hand forming the keystone of the main Ancestor-Span. The Guild secretly maintains an archive of stolen Fexric alchemical formulae, including one that may reverse calcification entirely.',
    relatedTerms: ['ancestor_gaps', 'deep_alchemists', 'frostmaw_holdfast', 'groven', 'house_tesshan', 'stags_rest_moraine', 'the_great_gorge', 'thrumm', 'deep-alchemist-prime', 'vat-breaker-foreman']
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
    relatedTerms: ['frostwood-reach', 'gref', 'mimir']
  },
  'mistbarrow': {
    id: 'mistbarrow',
    term: 'Mistbarrow',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'An ancient burial mound predating House Thalreth, shrouded in fog so dense it has its own weather.',
    fullEntry: 'Mistbarrow is one of the Frostwood Reach\'s deepest mysteries — a burial mound that predates every known civilization in the region. The barrow is encased in fog so permanent and so dense that it generates its own microclimate: rain falls inside the fog-bubble even when the surrounding forest is dry. Expeditions have recovered amber tablets inscribed with unknown script and corroded bronze masks of workmanship that surpasses any known Thalren or Mimir craft. The Forgotten Archivists of the Ledger Halls have petitioned House Thalreth for a full excavation for three centuries.',
    relatedTerms: ['frostwood-reach', 'greymark_keep', 'house_thalreth']
  },
  'greythorn_copse': {
    id: 'greythorn_copse',
    term: 'Greythorn Copse',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'A fortified copse of ironwood jointly maintained by Thalren timber-wardens and Briaran thorn-tenders on the eastern trade route.',
    fullEntry: 'Greythorn Copse is a living fortress — a copse of deliberately tangled ironwood trees grown into a defensive wall by generations of Briaran horticulture and maintained by Thalren timber-wardens. The "Grey" in its name connects it to Greymark; the "Thorn" is pure Briaran influence. It serves as the primary waystation between Greymark Keep and the eastern fens, and its single watched gate funnels all trade through a customs post where both races collect tolls.',
    relatedTerms: ['briaran', 'frostwood-reach', 'house_thalreth']
  },
  'drunhold': {
    id: 'drunhold',
    term: 'Drunhold',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'A small woodcutter village of the Frostwood Reach, sitting on the ancient trade routes that stitch the Reach together.',
    fullEntry: 'Drunhold is one of the small ironwood-cutting villages that straggle along the old trade routes of the Frostwood Reach. Its woodcutters work the sacred ironwood groves under strict Thalren quota — a tension that has seeded generations of logger folklore about the forest vengeance (the Grimmstalk myth among them). Crossroad spirits like the Gref are drawn to Drunhold thresholds, where strong partings and forgotten oaths leave the heaviest trails.',
    relatedTerms: ['frostwood-reach', 'grimmwood', 'siltmire_flats', 'alaric']
  },
  'grimmwood': {
    id: 'grimmwood',
    term: 'Grimmwood',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'The oldest heart of the Frostwood Reach — a stand of ironwood and pine that has stood for ten thousand years, dense enough to swallow loggers whole.',
    fullEntry: 'Grimmwood Proper is the ancient core of the Frostwood Reach, where the ironwood and pine have stood for ten thousand years and the canopy admits no light at all. It is treated by the woodcutters of Drunhold with terror rather than ambition: the Grimmstalks — feather-skulled canopy-guardians born of logger guilt — dwell exclusively in its highest branches, and travelers who lose the trail in the silent Grimmwood are rarely recovered. The Briaran claim the Grimmwood as untouchable rootland; the Thalren ledger-wards mark its edge and go no further.',
    relatedTerms: ['briaran', 'drunhold', 'frostwood-reach']
  },
  'siltmire_flats': {
    id: 'siltmire_flats',
    term: 'Siltmire Flats',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'A stretch of the Frostwood Reach where ancient peat has turned the standing water to thick black soup — hunting ground of the Oillipheist.',
    fullEntry: 'The Siltmire Flats are a low, boggy reach of the Frostwood where ten thousand years of peat have turned the standing water into a thick, black, deceptive soup — deep enough to swallow a man, warm enough in rare summer to slow the cold-blooded things that live in it. It is the named hunting ground of the Oillipheist, the blind silt-leech serpent, and Frostwood parents use the Flats as the backdrop for every warning-tale about drowning in dark water. Trade routes skirt the Flats by a wide margin; only peat-cutters and the desperate go near.',
    relatedTerms: ['drunhold', 'frostwood-reach']
  },
  'bramble_heath': {
    id: 'bramble_heath',
    term: 'Bramble Heath',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'Open thorn-covered heathland at the forest edge, patrolled by Briaran rangers tending the living boundary-walls.',
    fullEntry: 'The Bramble Heath marks where the ironwood canopy finally breaks and the fog thins for the first time. It is a savage, beautiful landscape — crimson thorn-flowers bloom year-round in soil nourished by centuries of blood, and the Briaran rangers who patrol here cultivate the thorn-barriers as both defense and art. The heath is the Briaran\'s most visible territorial claim in the Reach, and they defend it with a ferocity that surprises those who underestimate the quiet, plant-tending folk.',
    relatedTerms: ['briaran', 'frostwood-reach']
  },
  'skalds_landing': {
    id: 'skalds_landing',
    term: "Skald's Landing",
    type: 'location',
    region: 'frostwood-reach',
    summary: 'A Skald trading post on the northern river where Nordhalla longships dock to exchange cold-iron and whale oil for ironwood timber.',
    fullEntry: 'Skald\'s Landing is the primary cultural exchange point between the Frostwood Reach and Nordhalla — a small but vital settlement where Norse-style timber longhouses sit incongruously among Thalren peat-stone architecture. The Skald traders bring cold-iron, whale oil, and glacier ice south; they return with ironwood timber, heartwood resin, and Mimir-crafted storm-glass. The cultural friction is constant but productive — both peoples respect stoicism and oral tradition.',
    relatedTerms: ['frostwood-reach', 'house_skalvyr', 'house_thalreth', 'nordhalla']
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
    relatedTerms: ['frostwood-reach', 'house_thalreth', 'mimir', 'rite-of-masks']
  },

  // NORDHALLA — New Locations
  'ymirs_col': {
    id: 'ymirs_col',
    term: "Ymir's Col",
    type: 'location',
    region: 'nordhalla',
    summary: 'A treacherous mountain pass between glacier-capped peaks, named for the frost giant of Skald legend.',
    fullEntry: 'Ymir\'s Col is the most dangerous pass in Nordhalla — a wind-scoured gap between two peaks where the air moves fast enough to strip flesh from bone. Named for the frost giant of Skald pre-Binding mythology, the col is marked by cairns of frozen corpses, their expressions preserved in perfect, screaming clarity. Only the Skald Ice-Trackers can navigate it safely, and even they lose people every year.',
    relatedTerms: ['house_skalvyr', 'nordhalla', 'stel']
  },
  'vargtor': {
    id: 'vargtor',
    term: 'Vargtor',
    type: 'location',
    region: 'nordhalla',
    summary: 'A watchtower settlement atop a rocky tor rising above the glacier line, garrisoned by Skald Ice-Trackers.',
    fullEntry: 'Vargtor — Wolf-Tor in the Old Nord tongue — is a military garrison built atop a natural granite pillar that rises two hundred feet above the glacier line. Wolves gather at its base every winter, drawn by some affinity the Skald cannot explain but do not question. The garrison commands the eastern approaches to the Frozen Archive and serves as the first line of defense against Corvani raiding parties and glacier wyrms. In the tor\'s deepest chambers, runic carvings predating the Skald by centuries have drawn the attention of Rime-Born Rune Keepers.',
    relatedTerms: ['house_skalvyr', 'nordhalla', 'rime_born']
  },
  'the_still_crag': {
    id: 'the_still_crag',
    term: 'The Still Crag',
    type: 'location',
    region: 'nordhalla',
    summary: 'A cliff face and glacial hollow perpetually frozen in absolute silence, where the Rime-Born perform memory-freezing rites.',
    fullEntry: 'The Still Crag is one of Nordhalla\'s most unsettling landmarks — a cliff face where no wind blows, no sound carries, and the ice sculptures of unknown figures stand frozen in attitudes of supplication. The Rime-Born believe the crag is where the Warden\'s breath physically touched the mountain during the Glacier Bargain, freezing everything it touched into permanent, silent witness. Within the crag lies Frostcirque, a natural glacial amphitheater where the ice walls are covered in runic script. Here, the Rime-Born perform their Memory-Freezing rites, preserving their most important experiences in blocks of glacier ice stored in the walls for eternity.',
    relatedTerms: ['nordhalla', 'rime_born', 'the_warden', 'frostcirque']
  },
  'frostcirque': {
    id: 'frostcirque',
    term: 'Frostcirque',
    type: 'location',
    region: 'nordhalla',
    summary: 'A natural glacial amphitheater within the Still Crag, its ice walls covered in runic script, where the Rime-Born perform their Memory-Freezing rites.',
    fullEntry: 'Frostcirque is the heart of the Still Crag — a natural glacial amphitheater where the ice walls are covered in runic script so dense it reads as texture. Here the Rime-Born perform their Memory-Freezing rites, preserving their most important experiences in blocks of glacier ice stored in the walls for eternity. Pilgrims who press a palm to the scrim report a sensation of having always been cold, as though the amphitheater remembers every visitor.',
    relatedTerms: ['the_still_crag', 'rime_born', 'nordhalla']
  },
  'rooks_promontory': {
    id: 'rooks_promontory',
    term: "Rook's Promontory",
    type: 'location',
    region: 'nordhalla',
    summary: 'A high cliff over the frozen sea where the Corvani gather in vast, dark congregations to read prophecy in raven-flight.',
    fullEntry: 'Rook\'s Promontory is the Corvani\'s most sacred site in Nordhalla — a black obsidian cliff jutting over the frozen sea where ravens gather in thousands, their flight patterns interpreted as living prophecy by the Corvani shamans. The cliff is cold even by Nordhalla standards, and the Corvani dwellings carved into its face are accessible only to those who can fly or climb without rope. The Skald consider the promontory cursed; the Corvani consider it home.',
    relatedTerms: ['corvani', 'nordhalla', 'vesperas_perch']
  },

  // SUNDALE — New Locations
  'sols_anvil_mesa': {
    id: 'sols_anvil_mesa',
    term: "Sol's Anvil Mesa",
    type: 'location',
    region: 'sundale',
    summary: 'A massive flat-topped mountain where Solvarn sun-priests hold ceremonies during rare moments of volcanic clarity.',
    fullEntry: 'Sol\'s Anvil Mesa is the spiritual high ground of Sundale — a massive basalt mesa whose flat surface has been carved with solar calendars, prophecy charts, and genealogical records stretching back to the Binding. When the volcanic haze clears enough to glimpse the buried sun\'s residual glow, Solvarn sun-priests ascend the mesa to conduct their holiest ceremonies. The mesa appears to float above the ashlands due to heat-shimmer, creating the illusion that it has been lifted toward the sun it worships.',
    relatedTerms: ['house_solvan', 'solbrand', 'sundale']
  },
  'the_ashen_escarpment': {
    id: 'the_ashen_escarpment',
    term: 'The Ashen Escarpment',
    type: 'location',
    region: 'sundale',
    summary: 'A long, steep slope of compacted volcanic ash forming Sundale\'s natural border, dotted with Solvarn watchtowers.',
    fullEntry: 'The Ashen Escarpment is Sundale\'s defensive wall — a miles-long ridge of compacted volcanic ash that rises sharply from the lowland approaches. Solvarn watchtowers dot the rim, their eternal signal-fires burning with heartwood resin and visible across the ashlands. The escarpment is treacherous to climb — the ash is packed hard as stone in places, but a wrong step can send a traveler sliding into glass-scarred gullies. It serves as both natural fortification and pilgrimage route for those approaching Emberspire from the lowlands.',
    relatedTerms: ['dawn_vigil', 'house_solvan', 'sundale']
  },
  'cinderhoodoo': {
    id: 'cinderhoodoo',
    term: 'Cinderhoodoo',
    type: 'location',
    region: 'sundale',
    summary: 'A cluster of fire-scorched rock spires on the ash plain, used as navigational landmarks by Thrask Emberth rangers.',
    fullEntry: 'Cinderhoodoo is a forest of rock spires rising from the ash plain like grasping fingers — each hoodoo crowned with a cap of harder stone that protects the softer pillar beneath. Some caps have melted and re-fused into grotesque, face-like shapes that change expression depending on the angle of the volcanic light. Thrask Emberth rangers use the hoodoos as navigational landmarks and shelter from the soot-storms, and the formations are slowly being adopted as sacred sites by a growing Pyrofiend cult.',
    relatedTerms: ['emberth', 'pyrofiend', 'sundale', 'vulkars_karst']
  },
  'ember_lagoon': {
    id: 'ember_lagoon',
    term: 'Ember Lagoon',
    type: 'location',
    region: 'sundale',
    summary: 'Sundale\'s only port — a warm saltwater lagoon heated by volcanic vents where Emberth and Merryn traders coexist.',
    fullEntry: 'Ember Lagoon is Sundale\'s lifeline to the outside world — the only harbor where the water does not freeze, warmed perpetually by volcanic vents beneath the seabed. The lagoon glows orange-red at night, earning it the Merryn nickname "the Boiling Door." It is a rare point of genuine cooperation between Emberth, Solvarn, and Merryn — the Emberth control the port infrastructure, the Solvarn maintain the shrine to Sol on the eastern cliff, and the Merryn operate the shipping lanes. Three cultures, one harbor, constant tension, constant profit.',
    relatedTerms: ['basalt_shyr', 'emberth', 'house_solvan', 'sundale']
  },

  // ICEHEART SEA — New Locations
  'kelpies_cove': {
    id: 'kelpies_cove',
    term: "Kelpie's Cove",
    type: 'location',
    region: 'iceheart-sea',
    summary: 'A smuggler\'s inlet hidden behind ice-shoals, marked by bioluminescent lanterns.',
    fullEntry: 'Kelpie\'s Cove is the Iceheart Sea\'s most notorious black-market port — a sheltered inlet hidden behind a wall of grinding ice-shoals that only the most skilled Merryn pilots can navigate. Named for the phantom sea-horse said to lure ships onto the rocks, the cove is where contraband from every region changes hands without questions. Drun outcasts from the Bryngloom maintain a permanent presence here, running the memory-trade alongside traditional smuggling.',
    relatedTerms: ['house_mereval', 'iceheart-sea', 'neth']
  },
  'wraithsound': {
    id: 'wraithsound',
    term: 'Wraithsound',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'A wide, deep inlet where the echoes of drowned sailors carry for miles and the water is said to listen.',
    fullEntry: 'Wraithsound is a place the Merryn navigate only with Myrathil guides — a wide, deep inlet perpetually shrouded in sea-mist where the echoes of the drowned carry for miles. The Myrathil Deep-Born claim the sound is alive — that it listens, remembers, and occasionally speaks in the voices of those it has swallowed. Ships that enter without a guide emerge with crews who refuse to describe what they heard, or worse — crews who speak only in the voices of the dead.',
    relatedTerms: ['iceheart-sea', 'myrathil']
  },
  'deepwell_archipelago': {
    id: 'deepwell_archipelago',
    term: 'Deepwell Archipelago',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'A forty-mile chain of ice-islands concealing underwater Myrathil cave-cities beneath the frozen surface.',
    fullEntry: 'The Deepwell Archipelago is the Deep-Born Myrathil\'s hidden civilization — a chain of ice-islands stretching forty miles, each one concealing underwater cave-cities beneath its frozen surface. The Deep-Born maintain a culture entirely separate from the surface world, emerging only to trade and to conduct their Drowning Rites — rituals that surface-dwellers are not permitted to witness. The archipelago is connected by submerged tunnels that only the Myrathil can navigate.',
    relatedTerms: ['house_mereval', 'iceheart-sea', 'myrathil']
  },
  'spindrift_lagoon': {
    id: 'spindrift_lagoon',
    term: 'Spindrift Lagoon',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'A coral-reef lagoon warmed by volcanic currents, glowing blue-green with cultivated bioluminescence.',
    fullEntry: 'Spindrift Lagoon is the most beautiful settlement in the Iceheart Sea — a warm-water anomaly where coral survived the Deepening, sheltered by volcanic thermal dynamics. The Breakers-Born Myrathil have tended the reef for centuries, cultivating bioluminescent organisms that illuminate the entire lagoon in shades of blue-green. Merryn traders dock at the surface platforms while Myrathil artisans work in underwater markets grown from living coral. The lagoon is visible for miles across the frozen sea — a beacon of warmth and light in the endless dark.',
    relatedTerms: ['house_mereval', 'iceheart-sea', 'myrathil']
  },

  // CRAGJAW PEAKS — New Locations
  'deepchasm_keep': {
    id: 'deepchasm_keep',
    term: 'Deepchasm Keep',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'A Tessen fortress spanning a massive fissure, controlling the only reliable passage between upper peaks and lower galleries.',
    fullEntry: 'Deepchasm Keep is a feat of Tessen engineering — a fortress built across a massive mountain fissure, its foundations anchored into both cliff walls with iron stakes driven into living rock. The only crossing is a bridge of Groven-calcified bone that groans underfoot. The keep controls the primary passage between the upper peaks and the lower mining galleries, making it both a military installation and a toll-collection point of enormous strategic value.',
    relatedTerms: ['cragjaw-peaks', 'groven', 'house_tesshan', 'iron_ravine']
  },
  'the_great_gorge': {
    id: 'the_great_gorge',
    term: 'The Great Gorge',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'A mile-wide canyon bridged by seven calcified bone-spans grown from willing Groven ancestors.',
    fullEntry: 'The Great Gorge is the Cragjaw Peaks\' primary thoroughfare — a mile-wide, bottomless tear in the mountain range bridged by seven calcified bone-spans, each grown from the skeleton of a willing Groven ancestor. The gorge is the Groven\'s greatest leverage: every passage is tolled, every toll is negotiated, and every negotiation favors the Groven. The Bone-Weavers who maintain the spans are among the most respected — and most feared — people in the Peaks.',
    relatedTerms: ['cragjaw-peaks', 'groven', 'stags_rest_moraine', 'vat_breakers_guild']
  },
  'gearworks_gulch': {
    id: 'gearworks_gulch',
    term: 'Gearworks Gulch',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'A Fexrick industrial settlement powered by geothermal vents, producing the finest clockwork in the known world.',
    fullEntry: 'Gearworks Gulch is the industrial heart of the Cragjaw Peaks — a narrow ravine packed with geothermal-powered machinery that runs day and night without pause. The Fexrick artisans here produce the finest clockwork mechanisms, automaton components, and refined metals in the known world. The Chief Artificer governs through competitive exhibition, and the gulch\'s atmosphere of feverish invention attracts the most brilliant — and most unstable — engineers from every region.',
    relatedTerms: ['cragjaw-peaks', 'fexrick', 'house_tesshan', 'sump_rift']
  },
  'frostmaw_massif': {
    id: 'frostmaw_massif',
    term: 'Frostmaw Massif',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'The compact mountain group surrounding Frostmaw Holdfast, perpetually shrouded in the Tesshan blizzard.',
    fullEntry: 'The Frostmaw Massif is a cluster of peaks so dense they form a single, nearly impregnable natural fortress — the mountain stronghold that House Tesshan traded visibility to protect. The massif is perpetually shrouded in the enchanted blizzard, and navigation without Groven bone-compasses or intimate knowledge of the ice-tunnels is suicide. It is both the most defensible and most isolated position in the Cragjaw Peaks.',
    relatedTerms: ['cragjaw-peaks', 'frostmaw_holdfast', 'house_tesshan']
  },

  // SUNDRIFT VALE — New Locations
  'starfall_vale': {
    id: 'starfall_vale',
    term: 'Starfall Vale',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'A deep valley carpeted with crystalline shards of trapped starlight — the impact site of Sol\'s shattered celestial court.',
    fullEntry: 'Starfall Vale is the most sacred site in the Sundrift Vale — a crater where the physical residue of Sol\'s shattered celestial court impacted the earth during the Breach. Thousands of crystalline shards carpet the valley floor, glowing with trapped starlight and producing harmonic tones that the Sylen Astril call the Memory of Sol. The vale is a place of pilgrimage for every Astril caste and a source of prophecy through the Star-Oracle who tends the First Shard.',
    relatedTerms: ['astril', 'house_ordavan', 'nova_heath', 'sundrift-vale', 'the_breach']
  },
  'the_unlit_knoll': {
    id: 'the_unlit_knoll',
    term: 'The Unlit Knoll',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'A small hill where Unlit Astril hold secret judgments — a place where fire refuses to burn and no star-glow can approach.',
    fullEntry: 'The Unlit Knoll is the Unlit Veil\'s most closely guarded site — a small, rounded hill where fire refuses to burn and no light persists. The Unlit have shaped this quality into a tool: their secret judgments, dead-drops, and intelligence operations all center on a place that Astril with constellation-spirits in their blood physically cannot approach. It is a hole in the light of the world, and the Unlit Veil has made it their headquarters.',
    relatedTerms: ['astril', 'nova_heath', 'sundrift-vale']
  },
  'ancestor_wold': {
    id: 'ancestor_wold',
    term: 'Ancestor Wold',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'High, open ground where the Ordan dead are honored in vast earthen barrows that hum with ancestral resonance.',
    fullEntry: 'The Ancestor Wold is the spiritual anchor of the Ordan people — high, open ground where twenty generations of chieftains lie buried beneath earthen barrows that hum with a constant, resonant tone. The hum guides Ordan herders across the starless steppe and marks the Wold as sacred ground where silence is enforced by custom stronger than law. To speak above a whisper here is to invite the wrath of every ancestor buried in the mounds.',
    relatedTerms: ['house_ordavan', 'sundrift-vale', 'the_long_steppe']
  },
  'morrens_bogpost': {
    id: 'morrens_bogpost',
    term: "Morren's Bogpost",
    type: 'location',
    region: 'sundrift-vale',
    summary: 'A Morren trading outpost at the forest-steppe edge, the primary exchange point between Bryngloom and Sundrift goods.',
    fullEntry: 'Morren\'s Bogpost is the primary trade gateway between the Bryngloom Forest and the Sundrift Vale — a cluster of squat peat-stone buildings that smell perpetually of bog-water. Morren debt-brokers here exchange Bryngloom goods (fungal lights, memory-glass, bog-mushroom reagents) for Ordan wool and hide. The credit terms are always generous. The interest always compounds. The Bogpost is the Morren\'s most successful financial outpost outside the Bryngloom.',
    relatedTerms: ['bryngloom-forest', 'house_morrath', 'neth', 'sundrift-vale', 'thalrens_ledger_post']
  },

  // BRYNGLOOM FOREST — New Locations
  'widows_quagmire': {
    id: 'widows_quagmire',
    term: "Widow's Quagmire",
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A treacherous bog where the ground liquefies without warning, named for the Morren widows who walked in to join their debt-dead husbands.',
    fullEntry: 'Widow\'s Quagmire is the Bryngloom Forest\'s most lethal terrain — a stretch of bog where the ground has no solid bottom and the peat is active, digesting anything organic that sinks into it. The quagmire earned its name from the Morren widows who, according to legend, walked into the bog to join their husbands whose debts had killed them. Their hands are said to still clutch unsigned contract-fragments, preserved forever in the acidic peat, reaching upward from depths that no one has survived measuring.',
    relatedTerms: ['bryngloom-forest', 'house_morrath']
  },
  'black_fen': {
    id: 'black_fen',
    term: 'Black Fen',
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'An acidic fen where nothing grows — the Neth\'s dumping ground for voided contracts and legally-annihilated individuals.',
    fullEntry: 'The Black Fen is the Neth contract court\'s final solution — a fen of such extreme acidity that bone dissolves within hours and nothing grows, nothing lives, and nothing is remembered. Failed contracts, dissolved agreements, and legally-voided individuals are cast into its depths. The Neth call it the Final Clause. It is the only place in the Bryngloom where the Root-Veil has no presence and the Keeper of the Last Threshold has no jurisdiction — a legal void that serves as both garbage dump and ultimate threat.',
    relatedTerms: ['bryngloom-forest', 'drowned_dingle', 'house_morrath', 'keeper_of_the_last_threshold', 'neth']
  },
  'vel_keth_bayou': {
    id: 'vel_keth_bayou',
    term: 'Vel-Keth Bayou',
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A marshy channel flowing against the natural gradient, named in the Neth tongue as "the water that remembers."',
    fullEntry: 'Vel-Keth Bayou — "the water that remembers" in the Neth tongue — is a marshy channel that flows uphill, defying physics in ways the Neth insist are perfectly legal under the First Contract. Memory-glass deposits line the banks, glowing faintly with recorded thoughts of the long-dead. The Kessen weavers who tend the bayou harvest the memory-glass for Atropolis\'s contract-archives and sell the excess to Thalren scribes desperate for anything that preserves information against the fog.',
    relatedTerms: ['atropolis', 'bryngloom-forest', 'neth']
  },
  'aran_glen': {
    id: 'aran_glen',
    term: 'Aran-Glen',
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A Kessen Neth settlement where every structure is grown from living ironwood, governed by a steward bound to the grove\'s health.',
    fullEntry: 'Aran-Glen is proof that architecture can be alive — a Kessen Neth settlement where every wall, arch, and roof has been coaxed from living ironwood over centuries of patient horticulture. The Grove-Steward who governs the glen is legally bound to its health: if the grove sickens, their authority voids automatically. It is a governance system designed to prevent corruption through pure self-interest, and it has produced one of the most harmonious settlements in the Bryngloom.',
    relatedTerms: ['atropolis', 'bryngloom-forest', 'neth']
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
    relatedTerms: ['bryngloom-forest', 'sunken_spire', 'vreken']
  },

  // FROSTWOOD REACH
  'the_shallows': {
    id: 'the_shallows',
    term: 'The Shallows',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'A labyrinth of mist-veiled ravines and marshy pine stands surrounding Greymark Keep, where ironwood roots drift when the mists thicken.',
    fullEntry: 'The Shallows are the first test of any traveler entering the Frostwood Reach — a tangle of shallow ravines and silt-roads where the fog presses close and rusted lantern-posts mark paths that may no longer exist. Mist-Sentinels patrol the margins, but even they rely on ironwood root-patterns to navigate, as the roots themselves seem to shift when no one is watching. Gambrels and Grefs hunt here, drawn by the desperation of lost travelers and the oaths they make to find their way out.',
    relatedTerms: ['frostwood-reach', 'gambrel', 'gref', 'greymark_keep', 'ironwood_heart', 'varis']
  },
  'scribes_tower': {
    id: 'scribes_tower',
    term: "Scribes' Tower",
    type: 'location',
    region: 'frostwood-reach',
    summary: 'A vertical archive built inside the hollow shell of a dead ironwood, where archivists copy records before the fog erases them.',
    fullEntry: "The Scribes' Tower is the Frostwood Reach's bulwark against forgetting — a hollowed petrified ironwood converted into a vertical cathedral of parchment and ink. Archivists work in silent shifts, copying maps and genealogies onto calfskin vellum in races against the fog that will eventually consume their memories of what they have written. The Tower connects directly to the Ledger Halls below, where older records lie scattered among petrified roots and the silent echoes of clerks who forgot their own names.",
    relatedTerms: ['frostwood-reach', 'greymark_keep', 'house_thalreth', 'ledger_halls', 'caedren-thalreth', 'vellan-archivist']
  },
  'ledger_halls': {
    id: 'ledger_halls',
    term: 'Ledger Halls',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'A partially collapsed underground archive from the first century of the Dimming, where chained books of records lie among petrified roots.',
    fullEntry: 'The Ledger Halls are a tomb of knowledge — an underground archive dating to the first century after the sun\'s death, now partially collapsed and shrouded in the same fog that plagues the surface above. Chained volumes of records lie scattered among the petrified roots, their pages stiff with cold and damp. The Forgotten Archivists who guard the deeper chambers have been here so long that they have forgotten their own names, knowing only the records they tend and the importance of preserving them.',
    relatedTerms: ['frostwood-reach', 'gref', 'ironwood_heart', 'scribes_tower']
  },
  'ironwood_heart': {
    id: 'ironwood_heart',
    term: 'Ironwood Heart',
    type: 'location',
    region: 'frostwood-reach',
    summary: 'The deepest, darkest grove of the Frostwood Reach, where a titanic glowing white tree stands at the center of a stagnant mist-lake.',
    fullEntry: 'The Ironwood Heart is the deepest, most dangerous place in the Frostwood Reach — a grove so dense that the mist forms a heavy, stagnant lake on the forest floor and the canopy admits no light whatsoever. At its center stands a titanic white tree whose sap remains warm eight centuries after every other ironwood petrified, a living beacon that draws both desperate survivalists and the horrific predators that hunt them. The Unshorn Briaran claim the Heart as sacred ground, tending the white tree with thorn-blood rituals that predate the Fog Compact.',
    relatedTerms: ['briaran', 'frostwood-reach', 'gambrel', 'ledger_halls', 'the_shallows', 'bri-vessela', 'sylas', 'thorn-speaker', 'selene', 'apex']
  },

  // NORDHALLA
  'bloodhammer_sump': {
    id: 'bloodhammer_sump',
    term: 'Bloodhammer Sump',
    type: 'location',
    region: 'nordhalla',
    summary: 'A deep volcanic crater where geothermal heat powers the massive iron smelters that forge the Skalds\' runic cold-iron axes.',
    fullEntry: 'The Bloodhammer Sump is the industrial forge-heart of Nordhalla — a deep, steam-venting volcanic crater ringed by towering walls of ice that channel the geothermal heat into smelters of staggering size. The Bloodhammer Clan of Rime-Born work the forges here, their frost-touched hands immune to burns that would kill a human smith, forging runic cold-iron axes that hold their edge in temperatures that would shatter ordinary steel. The contrast between the glacial walls and the volcanic floor produces a perpetual steam-storm that the Skald have learned to read as a form of divination.',
    relatedTerms: ['fjord_gate', 'house_skalvyr', 'nordhalla', 'rime_born']
  },
  'fjord_gate': {
    id: 'fjord_gate',
    term: 'Fjord-Gate',
    type: 'location',
    region: 'nordhalla',
    summary: 'A massive coastal harbor inside a black fjord, guarded by towering stone doors, flanked by the deep water of the Black Firth.',
    fullEntry: 'Fjord-Gate is Nordhalla\'s primary harbor and the greatest engineering achievement of House Skalvyr — a deep coastal fjord sealed by towering stone doors that slide shut to block sea-storms. The harbor opens directly into the Black Firth, a narrow sea inlet flanked by obsidian cliffs where perfectly reflective water mirrors the dark sky. The firth is the Skald\'s primary naval route to the Iceheart Sea, navigated by starlight since no sunlight has penetrated its depths in eight centuries. Sea-Guard patrols navigate this corridor, where reflections showing non-existent entities test their sanity.',
    relatedTerms: ['bloodhammer_sump', 'frozen_archive', 'house_skalvyr', 'nordhalla', 'halvar-skalvyr', 'frigga-skalvyr']
  },
  'hunger_glaciers': {
    id: 'hunger_glaciers',
    term: 'Hunger Glaciers',
    type: 'location',
    region: 'nordhalla',
    summary: 'A vast, shifting expanse of pure whiteout and deadly crevasses where the ice moves with predatory intent.',
    fullEntry: 'The Hunger Glaciers are the killing ground of Nordhalla — a vast, shifting expanse of pure whiteout where the wind carries a predatory howl and the crevasses open and close with the grinding of the ice sheets. Travelers swear the glaciers move with intention, herding caravans toward dead ends and freezing them into permanent monuments to their own hubris. The Endurance Purists who train here consider survival a spiritual practice, deliberately stranding themselves for weeks to prove their worth to the Rime-Born ancestors.',
    relatedTerms: ['house_skalvyr', 'nordhalla', 'rimors_hearth', 'stel']
  },
  'rimors_hearth': {
    id: 'rimors_hearth',
    term: "Rimor's Hearth",
    type: 'location',
    region: 'nordhalla',
    summary: 'The volcanic ruins of a great mountain keep buried by a sudden glacier advance, still warmed by a few stubborn steam vents.',
    fullEntry: 'Rimor\'s Hearth is a monument to the glacier\'s indifference — a great mountain keep that was buried in a single season when the Hunger Glaciers surged during the first century of the Dimming. A few steam vents still pierce the ice, keeping patches of the black basalt ruins warm enough to shelter freezing travelers and the smugglers who prey on them. Fjord-Riders use the Hearth as a waystation on the dangerous route between the Frozen Archive and the eastern approaches.',
    relatedTerms: ['frozen_archive', 'hunger_glaciers', 'nordhalla', 'stel']
  },
  'vesperas_perch': {
    id: 'vesperas_perch',
    term: "Vespera's Perch",
    type: 'location',
    region: 'nordhalla',
    summary: 'A Corvani cliff-settlement named for the matriarch Vespera, reachable only by rope-ladder and gliding on fixed lines.',
    fullEntry: 'Vespera\'s Perch is the largest permanent Corvani settlement in Nordhalla — a cluster of dwellings carved into the high caves of the eastern mountains, named for the matriarch who led her flock here during the Glacier Bargain. The settlement is inaccessible from the ground, reachable only by rope-ladders and fixed gliding lines that the Corvani navigate with avian grace. The Skald tolerate the Perch because the Corvani trade raven-feather cloaks and storm-predictions of uncanny accuracy, reading prophecies in the flight patterns of the ravens that circle the mountain.',
    relatedTerms: ['corvani', 'house_skalvyr', 'nordhalla', 'rooks_promontory']
  },

  // CRAGJAW PEAKS
  'the_spans': {
    id: 'the_spans',
    term: 'The Spans',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'A terrifying network of arching bone bridges linking the peaks above the blizzard-clouds, grown from Groven ancestors\' calcified skeletons.',
    fullEntry: 'The Spans are the Cragjaw Peaks\' only thoroughfares above the whiteout — a network of arching bridges grown from the calcified skeletons of willing Groven dead, spanning bottomless chasms where the blizzard rages below. Each span represents a Groven ancestor who chose to give their bones to connect the peaks, a sacrifice that the Groven honor with eternal maintenance and the Tessen Scouts cross with white-knuckled terror. Chasm-Stalkers nest in the supports, patient and hungry.',
    relatedTerms: ['ancestor_gaps', 'cragjaw-peaks', 'frostmaw_holdfast', 'groven']
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
    relatedTerms: ['cragjaw-peaks', 'fexrick', 'frostmaw_holdfast', 'sump_rift']
  },
  'lost_brood_vats': {
    id: 'lost_brood_vats',
    term: 'Lost Brood Vats',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'Deep subterranean vaults of cracked stone chambers once used to cultivate biological life, now guarded by feral Wyrd-horrors.',
    fullEntry: 'The Lost Brood Vats are the Deep Alchemists\' original laboratory — a deep, subterranean vault of cracked stone chambers where an unknown race once cultivated biological life in petrified egg-casings and strange runic tubing. The Feral Fexrick who have claimed the upper chambers are descended from the Alchemists\' servitors, warped by centuries of exposure into something only nominally Fexrick. The deeper chambers remain sealed, and the scraping sounds that emanate from behind the sealed doors suggest that the Alchemists\' oldest experiments may still be growing.',
    relatedTerms: ['cragjaw-peaks', 'deep_alchemists', 'groven']
  },
  'iron_ravine': {
    id: 'iron_ravine',
    term: 'Iron Ravine',
    type: 'location',
    region: 'cragjaw-peaks',
    summary: 'A narrow, ore-rich gorge streaked red and black, where mine-shafts honeycomb the cliff faces above precarious rope-bridges.',
    fullEntry: 'The Iron Ravine is the Cragjaw Peaks\' primary source of cold-iron — a narrow gorge where volcanic magnetite stains the walls in streaks of red and black and the air is thick with metallic dust. Mine-shafts honeycomb the cliff faces, connected by wooden platforms and rope-bridges that sway in the constant wind. The Sump-Miners who work the ravine are a hard people, accustomed to cave-ins, toxic gas, and the Scrabs that nest in the deepest seams.',
    relatedTerms: ['cragjaw-peaks', 'deepchasm_keep', 'house_tesshan']
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
    relatedTerms: ['cragjaw-peaks', 'fexrick', 'gearworks_gulch', 'sump_galleries']
  },

  // SUNDALE
  'great_forge': {
    id: 'great_forge',
    term: 'The Great Forge',
    type: 'location',
    region: 'sundale',
    summary: 'A sprawling volcanic cavern city powered by the world\'s magma-core, producing refined cold-iron for all seven regions.',
    fullEntry: 'The Great Forge is Sundale\'s industrial heart and the largest smelting operation in the known world — a sprawling city of black iron and basalt built inside a volcanic cavern warmed by a branch of the world\'s magma-core. The Emberth forge-masters who tend the geothermal bellows produce refined cold-iron in quantities that supply every region on the continent, and the city\'s population of smiths, miners, and merchants makes it second only to the Harath-Vault in Sundale importance. The heat is oppressive, the noise is constant, and the forges never sleep.',
    relatedTerms: ['basalt_shyr', 'emberth', 'harath_vault', 'house_solvan', 'slag_gulch', 'sundale']
  },
  'emberspire_caldera': {
    id: 'emberspire_caldera',
    term: 'Emberspire Caldera',
    type: 'location',
    region: 'sundale',
    summary: 'The active, soot-choked volcanic mouth of Emberspire, where ancient fire-weaving entities dwell among the molten glass.',
    fullEntry: 'The Emberspire Caldera is the screaming mouth of Sundale\'s world-heart volcano — an active, soot-choked caldera that continuously vents ash and molten glass into the dark sky. The heat is lethal to all but the most hardened Emberth, and the volcanic vents are home to fire-weaving elemental entities older than the Dimming itself. Pyrofiend cultists make pilgrimages to the caldera\'s rim to commune with the Cinder-Fiends that nest in the molten rock, returning with scorched eyes and prophecies of burning.',
    relatedTerms: ['cinder_badlands', 'emberspire', 'harath_vault', 'pyrofiend', 'sundale']
  },
  'basalt_shyr': {
    id: 'basalt_shyr',
    term: 'Basalt Shyr',
    type: 'location',
    region: 'sundale',
    summary: 'A trade outpost atop cooling basalt columns on the Sundale border, adjacent to the steaming waters of the Cinder Strait.',
    fullEntry: 'Basalt Shyr is Sundale\'s window to the outside world — a trade outpost built atop a formation of cooling basalt columns adjacent to the Cinder Strait, a narrow sea passage between two volcanic islands where the water steams perpetually and the cliffs weep molten rock. Merryn sailors navigate the dangerous strait at tremendous risk, as the passage halves the journey to the harbor but exposes ships to boiling water and Cinder-Fiends. Basalt Shyr serves as neutral ground where commerce outweighs sun-worship, and merchants exchange metals and volcanic coal for Bryngloom timber and fungal-lights.',
    relatedTerms: ['cinder_badlands', 'ember_lagoon', 'great_forge', 'house_solvan', 'sundale']
  },
  'cinder_badlands': {
    id: 'cinder_badlands',
    term: 'Cinder Badlands',
    type: 'location',
    region: 'sundale',
    summary: 'A vast desert of black obsidian sands and jagged glass spires where toxic soot storms strip the flesh from the unwary.',
    fullEntry: 'The Cinder Badlands are Sundale\'s killing ground — a vast, windswept desert of black obsidian sands and jagged glass spires where the wind carries toxic soot and travelers must wrap themselves in heavy leather or risk having their eyes gouged by flying glass-shards. The Thrask Emberth rangers who patrol this wasteland are among the hardiest people in the known world, navigating by thermal vent patterns and the positions of the hoodoo formations that serve as the only landmarks in an ocean of black sand.',
    relatedTerms: ['basalt_shyr', 'emberspire_caldera', 'emberth', 'sundale']
  },
  'vulkars_karst': {
    id: 'vulkars_karst',
    term: "Vulkar's Karst",
    type: 'location',
    region: 'sundale',
    summary: 'A honeycombed limestone landscape riddled with underground rivers and sinkholes, heated to boiling by geothermal vents.',
    fullEntry: 'Vulkar\'s Karst is a geological impossibility made real — a honeycombed limestone landscape riddled with underground rivers heated to boiling by geothermal vents, depositing vivid orange and red crystals along every cave wall. Named for the Emberth forge-master who first mapped its depths, the karst connects to the Harath-Vault through miles of submerged passages that only the Korr Emberth dare to navigate. The mineral-rich waters produce crystals of extraordinary alchemical value, but the combination of boiling water, unstable limestone, and volcanic gas makes every expedition a gamble with death.',
    relatedTerms: ['cinderhoodoo', 'emberth', 'harath_vault', 'sundale']
  },
  'slag_gulch': {
    id: 'slag_gulch',
    term: 'Slag Gulch',
    type: 'location',
    region: 'sundale',
    summary: 'A narrow ravine settlement built on forge waste, where Emberth and Groven workers salvage metals from industrial debris.',
    fullEntry: 'Slag Gulch is Sundale\'s monument to the principle that nothing useful should be wasted — a permanent foundry town built inside a narrow ravine filled with centuries of forge waste and industrial debris. Emberth and Groven workers process the slag for salvageable metals in operations that are hot, loud, and acrid enough to strip paint from iron. The inhabitants have developed a unique patois mixing Sundari and Terran, and the Gulch produces a surprising volume of refined secondary metals that supplement the Great Forge\'s output.',
    relatedTerms: ['emberth', 'great_forge', 'groven', 'sundale']
  },

  // ICEHEART SEA
  'treakous_rift': {
    id: 'treakous_rift',
    term: 'Treakous Oceanic Rift',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'A bottomless, freezing ocean rift where city-sized glaciers drift above ancient, tentacled horrors sleeping in the black depths.',
    fullEntry: 'The Treakous Oceanic Rift is the deepest known point in the Iceheart Sea — a bottomless, freezing chasm where the water runs black and silent beneath city-sized glaciers. The Myrathil Deep-Stalkers who probe its edges speak of ancient, multi-tentacled horrors coiled in the sub-zero depths, entities that predate the Dimming and regard the ice above as a temporary inconvenience. The currents are violent and unpredictable, capable of dragging a fully-rigged vessel into the abyss in seconds.',
    relatedTerms: ['first_shore', 'iceheart-sea', 'ironjaw_port', 'myrathil']
  },
  'first_shore': {
    id: 'first_shore',
    term: 'First Shore',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'The ancient coastal ruins where House Mereval\'s ancestors first landed eight centuries ago, now encrusted in ice and guarded by standing dead.',
    fullEntry: 'First Shore is the most historically significant — and most haunted — site in the Iceheart Sea: the coastal ruins where the human ancestors of House Mereval first landed eight centuries ago. The stone watchtowers are now encrusted with heavy ice and barnacles, and the skeletal archers who once manned them still stand at their posts, frozen in attitudes of vigilance that the Drowned Revenants who haunt the harbor find amusing. No one excavates here. The dead are still on duty.',
    relatedTerms: ['gale_storm_shallows', 'house_mereval', 'iceheart-sea', 'treakous_rift']
  },
  'gale_storm_shallows': {
    id: 'gale_storm_shallows',
    term: 'Gale-Storm Shallows',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'A treacherous expanse of shallow reefs and perpetual storm-cycles navigated only by bioluminescent moss and ink-charts tattooed on skin.',
    fullEntry: 'The Gale-Storm Shallows are the Iceheart Sea\'s proving ground — a treacherous expanse of shallow reefs, jagged ice-crags, and perpetual storm-cycles where the winds can tear sails to ribbons and the reefs can gut a hull in seconds. Merryn Pirates use the shallows as both hunting ground and refuge, navigating by the soft glow of bioluminescent ocean moss and the ink-charts tattooed on their skin. The storms here never fully cease; they only vary in intensity from dangerous to catastrophic.',
    relatedTerms: ['first_shore', 'house_mereval', 'iceheart-sea', 'merrowport', 'the_shivering_bight']
  },
  'the_saltmaw_estuary': {
    id: 'the_saltmaw_estuary',
    term: 'The Saltmaw Estuary',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'A treacherous mixing of glacial river and frozen sea where Merryn whalers and Myrathil divers compete violently for territory.',
    fullEntry: 'The Saltmaw Estuary is where Nordhalla\'s glacial rivers meet the Iceheart Sea — a churning mix of fresh and salt water choked with ice-floes and rich with seal-hunting grounds and rare thermal minerals washed down from the mountains. Merryn whalers and Myrathil River-Fed divers compete violently for territory, their territorial disputes occasionally escalating into armed skirmishes that House Mereval pretends not to notice. The estuary\'s name comes from the way the glacial water bites at anything that enters it, salt and cold combining into a solution that numbs flesh in seconds.',
    relatedTerms: ['house_mereval', 'iceheart-sea', 'ironjaw_port', 'myrathil', 'skalds_longport']
  },
  'the_shivering_bight': {
    id: 'the_shivering_bight',
    term: 'The Shivering Bight',
    type: 'location',
    region: 'iceheart-sea',
    summary: 'A wide, shallow bay of constant volcanic tremors where ships must drift with engines running, hoping the quakes do not worsen.',
    fullEntry: 'The Shivering Bight is the Iceheart Sea\'s most geologically unstable region — a wide, shallow bay where unstable volcanic activity beneath the seabed produces constant tremors that make anchoring impossible. The bight is rich in thermal vents and the exotic organisms that feed on them, drawing Merryn Cartographers and Myrathil divers despite the danger. Ships must drift through with engines running, crews watching the water for the sudden discoloration that precedes a major eruption.',
    relatedTerms: ['gale_storm_shallows', 'iceheart-sea', 'merrowport', 'myrathil']
  },
  'skalds_longport': {
    id: 'skalds_longport',
    term: "Skald's Longport",
    type: 'location',
    region: 'iceheart-sea',
    summary: 'A Norse-style harbor on the northern coast where Skald longships trade cold-iron and whale products for Merryn salt-fish and Myrathil coral.',
    fullEntry: 'Skald\'s Longport is the cultural bridge between Nordhalla and the Iceheart Sea — a black basalt harbor built in the Skald style, with dragon-prow longhouses that terrify the local Merryn and impress the Myrathil in equal measure. The Skald traders who dock here bring cold-iron, glacier ice, and whale products from the north; they return with salt-fish, Myrathil coral, and news from the wider world. The port is peaceful by Iceheart standards, protected by a natural breakwater of black stone that the Skald have reinforced with iron stakes.',
    relatedTerms: ['iceheart-sea', 'ironjaw_port', 'nordhalla', 'the_saltmaw_estuary']
  },

  // SUNDRIFT VALE
  'mound_camps': {
    id: 'mound_camps',
    term: 'Mound-Camps',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'A sprawling seasonal settlement of wooly-yurts around the great grass mounds, where nomadic throat-singers trade under the starless sky.',
    fullEntry: 'The Mound-Camps are the Sundrift Vale\'s commercial heartbeat — a sprawling, seasonal settlement of heavy wooly-yurts that grows around the base of the great grass mounds every summer when the nomadic clans converge to trade. Ordan throat-singers exchange wool, dried meat, and memory-beads for cold-iron tools and salt, while Astril Outcast Guilds hawk constellation-readings and Lien-crystal trinkets. The camps disassemble completely when the herds move on, leaving no trace but trampled grass and the faint hum of the mounds beneath.',
    relatedTerms: ['grass_tundra', 'house_ordavan', 'sundrift-vale', 'synod_hold']
  },
  'ancestor_mounds': {
    id: 'ancestor_mounds',
    term: 'Ancestor Mounds',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'A vast network of grass-covered earthen barrows holding twenty generations of Ordan chieftains, emitting a continuous guiding hum.',
    fullEntry: 'The Ancestor Mounds are the Sundrift Vale\'s most sacred and practical landmark — a vast network of grass-covered earthen barrows containing the preserved remains of twenty generations of Ordan chieftains, each mound emitting a low, continuous hum at a unique frequency. The Mound-Keepers who tend the barrows maintain that the hum is the ancestors still speaking, guiding lost travelers through the starless steppe and warning of danger through changes in pitch and rhythm. Astril Sylen make pilgrimages here to harmonize with the ancestral tones, seeking glimpses of the constellation-spirits that fell during the Breach.',
    relatedTerms: ['astril', 'house_ordavan', 'sundrift-vale', 'synod_hold']
  },
  'grass_tundra': {
    id: 'grass_tundra',
    term: 'Grass Tundra Steppe',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'An endless, wind-swept plain of grey-green grass beneath a starless sky, home to massive woolly herds and the hunting shadows of the Hungry Child.',
    fullEntry: 'The Grass Tundra Steppe is the Sundrift Vale\'s vast, featureless interior — an endless plain of tough grey-green grass that grows waist-high even without sunlight, stretching beneath a sky empty of stars, constellations, or any navigable feature. Ordan Hunters stalk the woolly herds that graze here, but even they give wide berth to the sudden, hunting shadows of the Hungry Child, the Wyrd-creature that the steppe clans believe is the embodiment of starvation itself.',
    relatedTerms: ['house_ordavan', 'kumis_downs', 'lien_stalked_grazes', 'mound_camps', 'sundrift-vale']
  },
  'lien_stalked_grazes': {
    id: 'lien_stalked_grazes',
    term: 'Lien-Stalked Grazes',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'A region where glowing crystal-infused Lien-stalks replace ordinary grass, attracting mutated beasts and crystal-skinned Astril scavengers.',
    fullEntry: 'The Lien-Stalked Grazes are the Sundrift Vale\'s most alien landscape — a region where the ordinary steppe grass has been replaced by glowing, crystal-infused Lien-stalks that make the ground shimmer with trapped starlight. The soil here is extraordinarily fertile, but the crystalline grass makes grazing dangerous for ordinary herds, attracting instead mutated beasts and the Muren Astril who harvest the Lien-crystals for their beacon-fires. The Hungry Child has been sighted here more frequently than anywhere else on the steppe, drawn by the concentrated starlight.',
    relatedTerms: ['astril', 'grass_tundra', 'sundrift-vale']
  },
  'kumis_downs': {
    id: 'kumis_downs',
    term: 'Kumis Downs',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'Rolling hills of pale grass where Ordan mares produce the fermented mare\'s milk that is the steppe\'s sacred drink and primary trade good.',
    fullEntry: 'The Kumis Downs are the gentlest terrain in the Sundrift Vale — rolling hills of pale grass where Ordan mares graze in vast herds, producing the fermented mare\'s milk that serves as the steppe\'s sacred drink, primary trade good, and ceremonial offering to the ancestral mounds. Ordan riders guard the herds with intimate knowledge of every hillock, and their throat-singing carries for miles across the open ground. The downs are where the Ordan clan-meets are held, where migration routes are negotiated, and where bloodline disputes are settled before they can fester into war.',
    relatedTerms: ['grass_tundra', 'house_ordavan', 'sundrift-vale', 'the_long_steppe']
  },
  'the_long_steppe': {
    id: 'the_long_steppe',
    term: 'The Long Steppe',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'The vast central grasslands stretching horizon to horizon, navigated by the unique hum of ancestral burial mounds.',
    fullEntry: 'The Long Steppe is the Sundrift Vale\'s spine — the vast, featureless central grasslands that stretch from horizon to horizon, broken only by the occasional burial mound or standing stone. Caravans navigate by the hum of the ancestral mounds, each one producing a unique tone that carries through the earth and allows experienced travelers to fix their position with remarkable accuracy. The grass here is grey-green and tough as rope, growing waist-high in soil that the Ordavan Bargain ensures will always produce but never produce anything deeper than grass.',
    relatedTerms: ['ancestor_wold', 'house_ordavan', 'kumis_downs', 'sundrift-vale']
  },
  'nova_heath': {
    id: 'nova_heath',
    term: 'Nova Heath',
    type: 'location',
    region: 'sundrift-vale',
    summary: 'Open heathland lit by Astril beacon-fires of crystalline Lien-wood, a gathering ground for solstice observances across all Astril castes.',
    fullEntry: 'Nova Heath is the Sundrift Vale\'s brightest landmark — open heathland where the Muren Astril maintain great pyres of crystalline Lien-wood that burn with pale, cold light visible for miles across the starless steppe. The beacons serve as gathering points for Astril of all castes during solstice observances, and the Muren use coded fire-patterns to transmit messages across the vast distances of the Vale. It is the closest thing the Astril have to a shared home — a place where Sylen, Muren, and even Unlit gather under light that none of them can take for granted.',
    relatedTerms: ['astril', 'starfall_vale', 'sundrift-vale', 'the_unlit_knoll']
  },

  // BRYNGLOOM FOREST
  'peat_bog_sinks': {
    id: 'peat_bog_sinks',
    term: 'Peat-Bog Sinks',
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A treacherous swamp of bottomless black peat filled with the preserved, aware corpses of ancient debtors risen from broken contracts.',
    fullEntry: 'The Peat-Bog Sinks are the Bryngloom\'s most lethal natural hazard — a swamp of bottomless, preserving black peat where the acidic water is thick enough to walk on and deep enough to swallow anything that breaks the surface. The preserved corpses of ancient debtors lie suspended in the peat, aware and watching through clouded eyes, risen when their contracts were broken by death. Morren Peat-Cutters harvest the bog\'s surface layers with practiced caution, while Drun Outcasts use the deeper sinks as disposal sites for things that must never be found.',
    relatedTerms: ['bryngloom-forest', 'over_shanty', 'sunken_spire']
  },
  'root_veil_scriptorium': {
    id: 'root_veil_scriptorium',
    term: 'Root-Veil Scriptorium',
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A hollow-root complex where Velun Inscriptors carve genealogies onto memory-glass tablets under the direct watch of the Keeper.',
    fullEntry: 'The Root-Veil Scriptorium is where the Neth\'s most sacred records are kept — a quiet complex built where the great ironwood roots descend into the deep bogs, close enough to the Root-Veil\'s mycelial network that the Inscriptors claim they can feel the Keeper\'s presence while they work. Velun scholars carve historical genealogies onto compressed memory-glass tablets here, producing records that the fog cannot erase and the peat cannot dissolve. It is the most legally significant location in the Bryngloom after the Heart-Vault of Atropolis itself.',
    relatedTerms: ['atropolis', 'bryngloom-forest', 'keeper_of_the_last_threshold', 'neth', 'thalrens_ledger_post']
  },
  'over_shanty': {
    id: 'over_shanty',
    term: 'Over-Shanty',
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A chaotic hanging slum of rope-bridges beneath Atropolis, populated by Drun outcasts and Morren peat-cutters beyond the First Contract\'s reach.',
    fullEntry: 'Over-Shanty is the Bryngloom\'s open secret — a chaotic slum of rope-bridges and ramshackle cabins suspended beneath Atropolis\'s main platforms, populated by Drun Neth who burned their names from the First Contract and Morren peat-cutters who never had names there to begin with. No Neth law applies here. No Vreken ancestor watches. The Cult of Forgotten Shadow operates openly, running a memory-trade in extracted experiences that the Velun Pact-Lords officially deny exists. Everything in the Shanty sways, everything is for sale, and everyone is running from something.',
    relatedTerms: ['atropolis', 'bryngloom-forest', 'drowned_dingle', 'neth', 'peat_bog_sinks']
  },
  'drowned_dingle': {
    id: 'drowned_dingle',
    term: 'Drowned Dingle',
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A permanently flooded woodland valley where petrified ironwood trees chime like bells and Morren peat-cutters harvest in flat-bottomed boats.',
    fullEntry: 'The Drowned Dingle is the Bryngloom\'s most melancholic landscape — a wooded valley permanently flooded by bog water where dead ironwood trees stand like skeletal fingers above the dark surface, their petrified branches chiming like bells when the wind blows. Morren peat-cutters navigate the dingle in flat-bottomed boats, harvesting peat and occasionally pulling preserved corpses from the depths. The sound of the chiming trees carries for miles, a slow, random music that the Vreken claim are the voices of ancestors trying to speak through wood instead of bone.',
    relatedTerms: ['black_fen', 'bryngloom-forest', 'neth', 'over_shanty']
  },
  'thalrens_ledger_post': {
    id: 'thalrens_ledger_post',
    term: "Thalren's Ledger-Post",
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A shared Thalren-Morren archive outpost on the forest edge, where scribes copy Neth contract records onto vellum as insurance against the fog.',
    fullEntry: 'Thalren\'s Ledger-Post is a rare collaboration between two cultures that have little else in common — a hybrid outpost of peat-stone and ironwood where Thalren scribes copy Neth contract records onto calfskin vellum, creating duplicates that the fog cannot consume and the peat cannot dissolve. The Morren who co-manage the outpost see it as a business opportunity, charging the Neth for archival services while selling the Thalren access to Bryngloom trade routes. It serves as neutral ground in a forest where neutrality is a commodity more precious than gold.',
    relatedTerms: ['bryngloom-forest', 'merryns_drift', 'morrens_bogpost', 'neth', 'root_veil_scriptorium']
  },
  'merryns_drift': {
    id: 'merryns_drift',
    term: "Merryn's Drift",
    type: 'location',
    region: 'bryngloom-forest',
    summary: 'A Merryn river-trading camp of lashed houseboats on the forest\'s western waterways, carrying goods between Bryngloom and the Iceheart Sea.',
    fullEntry: 'Merryn\'s Drift is the Bryngloom\'s aquatic lifeline — a cluster of houseboats lashed together on the forest\'s western waterways, perpetually bobbing in the slow-moving bog water as Merryn River-Traders shuttle goods between the Bryngloom and the Iceheart Sea. The Merryn here have adapted to fresh water over generations, their salt-scars fading into something gentler, but they retain the storm-sailors\' instinct for reading water and the tattooed ink-charts that mark every safe passage. The Drift is the only reliable overland trade route between the forest and the sea.',
    relatedTerms: ['bryngloom-forest', 'iceheart-sea', 'sunken_spire', 'thalrens_ledger_post']
  },

  // ── NOTABLE FIGURES ──
  // Order Leaders — the current heads of the 19 class traditions

  'hark-ash-hammer': {
    id: 'hark-ash-hammer',
    term: 'Hark Ash-Hammer',
    type: 'character',
    role: 'Blood-Priest of the Berserker Order',
    region: 'sundale',
    summary: 'Blood-Priest and Keeper of the First Forge, who countersigned the Skald Council execution order against the Pact-less Unbound.',
    fullEntry: 'Hark Ash-Hammer is the Blood-Priest of the Berserker order, keeper of the Forge of Grum in the Harath-Vault arenas. He represents the Pact-sworn tradition — those who honor the ancestral Hunger Pact and view the Blood-Heat as a sacred liturgy passed down through the Bloodhammer line. He countersigned the Skald Council\'s execution order against the Unbound, the rogue Berserkers who ignite without the ritual, and views the deep-tunnel settlement forming in Emberspire as a heretical church.',
    relatedTerms: ['harath_vault', 'blood_heat', 'emberspire', 'sundale', 'grum']
  },

  'sera-three-scars': {
    id: 'sera-three-scars',
    term: 'Sera Three-Scars',
    type: 'character',
    role: 'Voice of the Ancestral Convergence',
    region: 'nordhalla',
    summary: 'Speaker of the tri-regional Animist council, the only living keeper who can hold all three ancestral dialects at once.',
    fullEntry: 'Sera Three-Scars convenes the tri-regional council that fuses the Ordan totemic, Vreken spore, and Skald runic Animist traditions into a single art. The three scars of her name mark the three tradition-carriers who met at a crossroads and recognized each other\'s wounds. The ancestral language is fracturing — each generation of Animists loses a few more syllables — and only the Convergence-keeper can still hold all three dialects simultaneously.',
    relatedTerms: ['frozen_archive', 'nordhalla', 'sundrift-vale', 'bryngloom-forest', 'rood-veil']
  },

  'vel-otharen': {
    id: 'vel-otharen',
    term: 'Vel-Otharen',
    type: 'character',
    role: 'Senior Signatory of the Canopy-Ledger',
    region: 'atropolis',
    summary: 'The Arcanoneer signatory who arbitrates contract-magic from Atropolis Heart-Vault, now facing clauses the Keeper itself rejects.',
    fullEntry: 'Vel-Otharen serves as Senior Signatory of the Canopy-Ledger, the Arcanoneer body that arbitrates contract-magic from the Heart-Vault of Atropolis. Heir to Valerius, who drafted the First Contract with the Keeper of the Last Threshold, Vel-Otharen now faces an unprecedented crisis: the Keeper is rejecting clauses it once accepted, and the Velun Contingency Protocol — the legal mechanism designed to handle such scenarios — cannot resolve entities the Keeper refuses to acknowledge.',
    relatedTerms: ['atropolis', 'keeper_of_the_last_threshold', 'velun', 'house_morrath']
  },

  'skadi-glass-eye': {
    id: 'skadi-glass-eye',
    term: 'Skadi Glass-Eye',
    type: 'character',
    role: 'Keeper of the Elk-Rites',
    region: 'nordhalla',
    summary: 'The Augur order\'s Keeper of Cassia\'s elk-rites at the Frozen Archive, presiding over an art where predictions have collapsed from 93% to 41% accuracy.',
    fullEntry: 'Skadi Glass-Eye keeps the elk-rites at the Frozen Archive, maintaining the entrail-reading tradition founded by Cassia, who foresaw the Deepening in a sacrificed elk. Her glass eye replaces the original lost to temporal backlash — an occupational hazard of reading futures that no longer want to be seen. The elk-entrail accuracy has collapsed from a historical 93% to 41% as temporal friction from the Chronarch engine-contamination renders every reading unreliable.',
    relatedTerms: ['frozen_archive', 'nordhalla']
  },

  'fex-vestara': {
    id: 'fex-vestara',
    term: 'Fex-Vestara',
    type: 'character',
    role: 'Conclave-Prime of the Chronarch Order',
    region: 'frostmaw-holdfast',
    summary: 'Keeper of the Reconstruction Schematics at Frostmaw Holdfast, racing the clock as founder Nesta disappears from history.',
    fullEntry: 'Fex-Vestara is Conclave-Prime of the Chronarch conclave at Frostmaw Holdfast, charged with rebuilding the original time-engine from recorded schematics. The crisis is existential: Nesta, who first hooked a volcanic-glass time-engine into her chest, is disappearing from history — records of her fade, memories of her slip. If Nesta ceases to have ever existed, every Chronarch inherits the temporal friction her existence was absorbing, and the entire craft will drown in accumulated paradox.',
    relatedTerms: ['frostmaw_holdfast', 'cragjaw-peaks', 'house_tesshan'],
    worldFriction: 'The founder is being erased from time. Every Chronarch alive will absorb her share of temporal friction.'
  },

  'mor-vereth': {
    id: 'mor-vereth',
    term: 'Mor-Vereth',
    type: 'character',
    role: 'Weaver of the Congregation of the Silence',
    region: 'sundrift-vale',
    summary: 'The False Prophet cell-network weaver, who reports that the Voice is now giving specific instructions pointing toward something trapped in the Frozen Archive\'s lowest vault.',
    fullEntry: 'Mor-Vereth weaves the Congregation of the Silence, the False Prophet cell-network built around Li Wei\'s original broken prophecies in the Sundrift Vale. The Congregation has always received vague impressions from the Voice — fragmented echoes of a faith that never existed. But recently the Voice has changed. It is giving specific instructions now: precise directions, exact times, unambiguous demands. All of them point toward the Frozen Archive\'s lowest vault, where something trapped since the Deepening may be using Mor-Vereth\'s network to arrange its own release.',
    relatedTerms: ['frozen_archive', 'nordhalla', 'sundrift-vale'],
    worldFriction: 'The Voice is no longer vague. It is using them to free something sealed since the Deepening.'
  },

  'merr-cael': {
    id: 'merr-cael',
    term: 'Merr-Cael',
    type: 'character',
    role: 'Harbor-Master of the Merrowport House',
    region: 'iceheart-sea',
    summary: 'Keeper of the Middle Odds, presiding over the Gambit order as it splits between Jax\'s luck-cult and Lyra\'s clause-radicals.',
    fullEntry: 'Merr-Cael serves as Harbor-Master of the Merrowport House and Keeper of the Middle Odds. The Gambit order inherited a founding schism: Jax the pirate, who wagered his lifeline against a storm-spirit, believed in luck; Lyra the clause-weaver, who formalized probability-reading through rune-etched cards, believed in contract. The two founded the tradition together but disagreed on its soul. Jax walked into the sea centuries ago. Lyra\'s followers radicalized into the Deck-Burners, who seek to force the universe to choose between chaos and order. Merr-Cael\'s middleground is shrinking daily.',
    relatedTerms: ['merrowport', 'iceheart-sea', 'house_mereval']
  },

  'malakor': {
    id: 'malakor',
    term: 'Malakor',
    type: 'character',
    role: 'Choir-Prime of the Doom-Arithmetic',
    region: 'nordhalla',
    summary: 'The Harbinger who calculates when each Chaos Pocket will consume reality — and has been correct every time.',
    fullEntry: 'Malakor co-founded the Harbinger tradition with Xyris, who tore the first Chaos Pocket into existence. Math is Malakor\'s medium: he does not see the future, he calculates it, tracking when each reality-tear will expand past the point of containment. The arithmetic has never been wrong. Each Chaos Pocket that opens bleeds warmth from the buried star of Emberspire, accelerating the end the Doom-Choir was founded to predict. Malakor the Finite is the current Choir-Prime, and the number he is most often asked for — the estimated remaining lifespan of the known world — is one he refuses to give.',
    relatedTerms: ['frozen_archive', 'nordhalla', 'emberspire', 'harbinger'],
    worldFriction: 'Each Chaos Pocket accelerates the end. He knows the estimate. He will not say it.'
  },

  'vrael-forty-seventh': {
    id: 'vrael-forty-seventh',
    term: 'Vrael the Forty-Seventh',
    type: 'character',
    role: 'Last Commander of the Barbed Vow',
    region: 'bryngloom-forest',
    summary: 'The forty-seventh Inquisitor commander at the Sunken Spire, facing entities that fall outside the entire art his order was built on.',
    fullEntry: 'Vrael the Forty-Seventh is the last Commander of the Barbed Vow, the Inquisitor order sworn at the Sunken Spire. The order was forged from two roots: Orven the Still-Handed\'s cold-iron Vreken severance of corrupted bonds, and Elias the Salt-Scarred\'s Thalren face-baiting technique — opening their own veins to draw Wyrd horrors into living flesh where they can be named and cut. Only forty-seven Inquisitors remain. The new entities emerging from the deep groves — things that were never bonded, never wrote a contract, never made a pact — fall entirely outside the Inquisitor methodology. Against a horror with no oath to sever and no face to wear, the Barbed Vow has no precedent.',
    relatedTerms: ['sunken_spire', 'bryngloom-forest', 'frostwood-reach', 'ironwood-heart'],
    worldFriction: 'Deep-grove entities now emerge that were never bound by pact or oath. The art has no precedent.'
  },

  'bri-vessela': {
    id: 'bri-vessela',
    term: 'Bri-Vessela',
    type: 'character',
    role: 'Regent of the Lunar Communion',
    region: 'frostwood-reach',
    summary: 'Keeper of the Phases, tending the lunar parasite as elder specimens synchronize toward an unknown convergence.',
    fullEntry: 'Bri-Vessela holds two intertwined roles: Regent of the Lunar Communion, the Lunarch order that tends the dead-moon parasite bound in the Frostwood moonlit groves, and Voice of the Moonlit Groves, the Briaran custodian of House Viridane\'s hidden sanctuaries. She serves in Selene\'s silence — the founder of the Lunarch path has not spoken in centuries. The elder parasites, across all hosts, are now synchronizing: every Lunarch\'s phase-cycle aligns toward an unknown convergence the scholars are calling the hatching-song of the dead moon.',
    relatedTerms: ['ironwood_heart', 'frostwood-reach', 'briaran', 'house_viridane'],
    worldFriction: 'Elder parasites synchronizing across all hosts toward a convergence.'
  },

  'sol-kaessen': {
    id: 'sol-kaessen',
    term: 'Sol-Kaessen',
    type: 'character',
    role: 'Vigil-Mother of the Barbed Vow martyr-order',
    region: 'sundale',
    summary: 'Keeper of the First Scar, guarding the Devotion Gauge as it corrupts into something predatory.',
    fullEntry: 'Sol-Kaessen serves as Vigil-Mother and Keeper of the First Scar, presiding over the Martyr order beneath Emberspire. Founded by Sera Solvan, who carved her sacrificed child\'s name into her arm, the order channels willing suffering to fuel the Devotion Gauge — a measure of absorbed pain that produces miraculous protection. But the noble houses have perverted the founding sacrifice: they now conscript Martyrs through child-training, and the Devotion Gauge itself is corrupting, drawing more suffering than was offered, feeding on the unprotected pain of anyone near a Martyr in combat.',
    relatedTerms: ['emberspire', 'sundale', 'house_solvan', 'sera'],
    worldFriction: 'The Devotion Gauge is corrupting, drawing suffering that was never offered.'
  },

  'mer-lyrisa': {
    id: 'mer-lyrisa',
    term: 'Mer-Lyrisa',
    type: 'character',
    role: 'Tide-Choir Mistress',
    region: 'iceheart-sea',
    summary: 'Keeper of the Silent Frequency at Merrowport, as the sea itself goes silent and the Deep-Born flee something in the abyss.',
    fullEntry: 'Mer-Lyrisa leads the Tide-Choir at Merrowport, holding the cadence-tradition founded by Lyris the Tide-Singer, who calmed the sea-gales at the cost of her spoken voice. The crisis is escalating: the Iceheart Sea has fallen silent — the tides still move but the deep-current songs that have guided Merryn sailors for centuries have ceased entirely. Worse, the Deep-Born Myrathil, the abyssal pressure-forgers, have begun fleeing the ocean trench. When asked what they heard, they will only say it sang back.',
    relatedTerms: ['merrowport', 'iceheart-sea', 'merryn', 'house_mereval'],
    worldFriction: 'The sea is silent. The Deep-Born fled. Something in the abyss sang back.'
  },

  'vespera': {
    id: 'vespera',
    term: 'Vespera',
    type: 'character',
    role: 'Blight-Mother / The First Host',
    region: 'bryngloom-forest',
    summary: 'The original Plaguebringer, who injected Sunken Spire decay-moss into her veins. Her eight-century foundational strain is dying.',
    fullEntry: 'Vespera is both founder and current leader of the Plaguebringer Cultivar — the disease-hosts of the Bryngloom bog-rot, founded originally to cure the spore-hush afflicting the Vreken. Eight centuries ago she injected Sunken Spire decay-moss into her own veins, becoming the first host of a cultivated disease intended as medicine. It worked. It also changed her irrevocably. Now her foundational strain — the original biological template from which every Plaguebringer\'s internal ecosystem descends — is failing. Every practitioner trained from her blood carries a dying inheritance, and Vespera herself may not survive the extinction of the thing she bred.',
    relatedTerms: ['sunken_spire', 'bryngloom-forest', 'vreken', 'house_morrath'],
    worldFriction: 'Her foundational strain is dying. Every Plaguebringer carries a failing inheritance.'
  },

  'sol-vareths': {
    id: 'sol-vareths',
    term: 'Sol-Vareths',
    type: 'character',
    role: 'Last-Ember / The Most-Converted',
    region: 'sundale',
    summary: 'The Pyrofiend order\'s keeper, more basalt than flesh, counting down as Scathrach calls in all debts simultaneously.',
    fullEntry: 'Sol-Vareths, called the Last-Ember and the Most-Converted, leads the Pyrofiend order beneath Emberspire. The order was born when a cabal of seven Solvarn occultists swallowed Scathrach the Ashen Sovereign\'s burning coals in an obsidian cavern for power, trading their souls for demonic fire. Sol-Vareths has converted more of her body to basalt than any living Pyrofiend — she is more stone than woman. The crisis: Scathrach is now calling in all debts simultaneously. No Pyrofiend has ever survived contract collection. Sol-Vareths is counting the days.',
    relatedTerms: ['emberspire', 'sundale', 'house_solvan'],
    worldFriction: 'Scathrach is collecting all debts. No Pyrofiend has survived contract collection.'
  },

  'kor-vasseth': {
    id: 'kor-vasseth',
    term: 'Kor-Vasseth',
    type: 'character',
    role: 'Threshold-Keeper of the Twice-Born',
    region: 'bryngloom-forest',
    summary: 'Warden of the Waking Graves, as the bog-dead rise on their own and march toward the Sundered Monoliths.',
    fullEntry: 'Kor-Vasseth serves as Threshold-Keeper of the Twice-Born, the Revenant order of the Bryngloom peat-bogs. The order carries two founding traditions: Kora the Veil-Speaker\'s blood-covenant, which grants the Vreken dead a living voice to speak through, and Vesper the Scribe\'s frost-stasis arts, which preserve the Neth dead in contractual undeath. Now the bog-graves are waking on their own — dead rising without a covenant, undeath occurring without a contract. They march toward the Sundered Monoliths, and the call that routes them routes through the Root-Veil itself.',
    relatedTerms: ['sunken_spire', 'bryngloom-forest', 'root_veil', 'house_morrath'],
    worldFriction: 'The dead rise without covenant. The call routes through the Root-Veil.'
  },

  'veyra': {
    id: 'veyra',
    term: 'Veyra the Merged',
    type: 'character',
    role: 'Form-Matriarch of the Form-Convergence',
    region: 'cragjaw-peaks',
    summary: 'Keeper of the Six Forms, who merged Sylvanus\'s momentum dance with Torin\'s body-sculpting into a single art.',
    fullEntry: 'Veyra the Merged is both founder and current Form-Matriarch of the Form-Convergence, the Shaper order at Frostmaw Holdfast. A Mimir chronicler by origin, she merged two separate transformation arts into one discipline: Sylvanus\'s momentum-dance, which builds Kinetic Flux from movement, and Torin\'s body-sculpting, which reshapes biology through will. Her merged art is the Six Forms. The crisis is generational: young Shapers, driven by ambition or the pressure of the collapsing world, attempt every transformation at once, burning through their crystalline skin in years rather than decades. Veyra watches an entire generation of her students destroy themselves for speed.',
    relatedTerms: ['frostmaw_holdfast', 'cragjaw-peaks', 'mimir'],
    worldFriction: 'Young Shapers attempt all forms at once, burning themselves out in years.'
  },

  'thrak-damos': {
    id: 'thrak-damos',
    term: 'Thrak-Damos',
    type: 'character',
    role: 'Bulwark-Captain of the Aegis',
    region: 'sundale',
    summary: 'Warden of the Void-Scars at Emberspire, as ambient magic rises and Void Resonance fills faster than it can be purged.',
    fullEntry: 'Thrak-Damos commands the Aegis, the Spellguard order at Emberspire\'s forge-keeps, enforcing Damon the Emberth smith\'s original method of magical defense. Damon blocked a solar flare with an alchemical tower shield, and his heirs have refined that interception into a discipline: identifying, containing, and deflecting hostile magic. The crisis is ambient — the world\'s background magic is rising, and every Spellguard\'s Void Resonance, the measure of absorbed and unpurged energy, fills faster than it can be discharged. Thrak-Damos oversees a generation of defenders who are drowning in the magic they absorb.',
    relatedTerms: ['emberspire', 'sundale', 'emberth'],
    worldFriction: 'Ambient magic rising. Void Resonance fills faster than it can be purged.'
  },

  'varis': {
    id: 'varis',
    term: 'Varis the Trembling',
    type: 'character',
    role: 'Venom-Master of the Distillery',
    region: 'frostwood-reach',
    summary: 'Keeper of the Slow Cup in the Frostwood, as the changing fog spoils venoms that held stable for generations.',
    fullEntry: 'Varis the Trembling is both founder and current Venom-Master of the Distillery, the Toxicologist order in the Frostwood. A Thalren alchemist, he spent years in the ironwood canopies extracting raw venom from fog-predators like the Gref and the Gambrel, distilling them into area-denial poisons. The work left him with chronic tremors and permanently stained fingers — occupational marks every Toxicologist inherits. The crisis: the fog itself is changing. Venoms that held stable for generations are now spoiling in weeks. The chemistry of the mist has shifted, and the Toxicologists are racing to understand why.',
    relatedTerms: ['the_shallows', 'frostwood-reach', 'greymark-keep'],
    worldFriction: 'The fog chemistry is changing. Venoms spoil in weeks instead of years.'
  },

  'alaric': {
    id: 'alaric',
    term: 'Alaric the Law-Keeper',
    type: 'character',
    role: 'Chain-Lord / The First Bound',
    region: 'frostmaw-holdfast',
    summary: 'Founder and Chain-Lord of the Warden order, who drove an ore-chain through his forearm to hold a specimen. Now the iron is turning brittle.',
    fullEntry: 'Alaric the Law-Keeper is both founder and current Chain-Lord of the Bound, the Warden order at Frostmaw\'s Chain-Hold. He established the tradition by driving an ore-chain through his own forearm and holding a captured abomination in place for three days — the chain-graft, the order\'s signature technique, was born in that act of sacrificial restraint. Now the Warden order faces a material crisis: the iron chains are turning brittle in the intensifying cold. The Fexric Drall propose chardalyn as a replacement — an alloy of meteoric origin that is stronger and colder-resistant, but causes progressive madness in anyone who grafts it into living flesh.',
    relatedTerms: ['frostmaw_holdfast', 'cragjaw-peaks', 'drunhold'],
    worldFriction: 'The iron chains are failing. Chardalyn is stronger. It also causes madness.'
  },

  'sylas': {
    id: 'sylas',
    term: 'Silent-Master Sylas',
    type: 'character',
    role: 'The First Hunter / Silent-Master of the Silent Hunt',
    region: 'frostwood-reach',
    summary: 'Founder of the Apex order, who stalked a conceptual Wyrd for seven days and paid for absolute focus with his hearing.',
    fullEntry: 'Silent-Master Sylas founded the Apex order of the Frostwood by stalking a conceptual Wyrd-entity — a creature that existed as an idea rather than a body — for seven consecutive days, tracking it not by sign or spoor but by the absence it left in the perception of everything around it. He caught it. The cost: his hearing, which the entity consumed as a parting blow. Sylas now leads the Silent Hunt, an order of sensory-trackers who trade one sense for absolute focus. The crisis: the mist is learning to hide. Something large has moved through the Reach for months without leaving any trace, and the Apex senses that were supposed to be infallible are finding nothing.',
    relatedTerms: ['ironwood_heart', 'frostwood-reach', 'mimir', 'apex'],
    worldFriction: 'The mist is learning. Something large moves through the Reach without trace.'
  },

  // ── Major Faction Leaders ──

  'kaelen-thalreth': {
    id: 'kaelen-thalreth',
    term: 'Kaelen Thalreth',
    type: 'character',
    role: 'Jarl-Archivist of House Thalreth',
    region: 'frostwood-reach',
    summary: '"The Quill-Lord," who seized control of House Thalreth amid his father\'s memory-fog and enforces the Sovereign Ledger.',
    fullEntry: 'Jarl-Archivist Kaelen Thalreth, called the Quill-Lord, has seized de facto control of House Thalreth due to his father Lord Aldren\'s advanced memory-fog — a condition where the Reach\'s protective mist consumes more of its victims\' memories each generation. Under Kaelen\'s stewardship, the Sovereign Ledger has become an instrument of absolute control: any property not meticulously recorded in the ledgers is declared void, and the undocumented — the Forgotten — exist outside all legal recognition. He tells himself it is preservation. Others call it erasure by quill.',
    relatedTerms: ['greymark_keep', 'frostwood-reach', 'house_thalreth', 'scribe-sentinels']
  },

  'halvar-skalvyr': {
    id: 'halvar-skalvyr',
    term: 'Halvar Skalvyr',
    type: 'character',
    role: 'High King-Jarl of Nordhalla',
    region: 'nordhalla',
    summary: '"Járn-Tand" (Iron-Tooth), who consolidated Nordhalla by force and constructed the Sunder-Wall to tax the nomad clans.',
    fullEntry: 'High King-Jarl Halvar Skalvyr, called Járn-Tand or Iron-Tooth, consolidated his rule over Nordhalla through military force and political cunning. His signature achievement — the Sunder-Wall, a fortified barrier that funnels nomad migration through taxed checkpoints — transformed the region\'s economy at the cost of the Ordan clans\' traditional free passage. He governs the fjord-keeps with an iron grip, his power resting on the twin pillars of the Frozen Archive\'s runic authority and Skalvyr military dominance.',
    relatedTerms: ['fjord_gate', 'nordhalla', 'frozen_archive', 'house_skalvyr']
  },

  'aldren-thalreth': {
    id: 'aldren-thalreth',
    term: 'Aldren Thalreth',
    type: 'character',
    role: 'Lord of House Thalreth (De Jure)',
    region: 'frostwood-reach',
    summary: 'The aging Lord of House Thalreth, whose advanced memory-fog has allowed his son Kaelen to seize de facto control.',
    fullEntry: 'Lord Aldren Thalreth is the de jure head of House Thalreth, though in practice his authority has been eclipsed by his son Kaelen. The Reach\'s memory-erasing fog — the very mist House Thalreth bargained for centuries ago to insulate the ironwood from Nordhalla\'s freezing cold — has consumed so much of Aldren\'s memory that he no longer recalls his own late wife\'s face. He appears at court ceremonies, but the quill-work is done by the son who has not yet formally deposed him.',
    relatedTerms: ['greymark_keep', 'frostwood-reach', 'house_thalreth']
  },

  'elara-thalreth': {
    id: 'elara-thalreth',
    term: 'Elara Thalreth',
    type: 'character',
    role: 'Keeper of the High Hearth',
    region: 'frostwood-reach',
    summary: 'The ceremonial heart of House Thalreth, tending the flame that wards Greymark Keep against the fog.',
    fullEntry: 'Elara Thalreth serves as Keeper of the High Hearth at Greymark Keep, a position older than the Jarl-Archivist\'s office. Her duty is deceptively simple: keep the central flame burning. In a keep where the protective fog steals memory and erases identity, the High Hearth is the one constant — a flame that remembers when the people cannot. Elara holds no political power, but the household staff, the visiting merchants, and the frightened Forgotten who shelter in the keep\'s lower halls all orient themselves by the fire she tends.',
    relatedTerms: ['greymark_keep', 'frostwood-reach', 'house_thalreth']
  },

  'caedren-thalreth': {
    id: 'caedren-thalreth',
    term: 'Caedren Thalreth',
    type: 'character',
    role: 'Master Scribe of the Scribe-Sentinels',
    region: 'frostwood-reach',
    summary: 'The second son who knows about the ledger edits — and authorized many of them.',
    fullEntry: 'Caedren Thalreth, second son of Lord Aldren, serves as Master Scribe of the Scribe-Sentinels from the tower that bears his title. He knows about the edits. He authorized many of them — subtle modifications to the Sovereign Ledger that shift property boundaries, erase certain names, and insert others. He tells himself it is for the good of the Reach: the chaos of contested claims would tear the region apart, and a carefully managed ledger, even an edited one, is better than no ledger at all. He believes this. He has to.',
    relatedTerms: ['scribes_tower', 'frostwood-reach', 'house_thalreth', 'scribe-sentinels']
  },

  'thorn-speaker': {
    id: 'thorn-speaker',
    term: 'The Thorn-Speaker',
    type: 'character',
    role: 'Speaker of the Unshorn Briaran',
    region: 'frostwood-reach',
    summary: 'The voice of the thorn-cloaked traditionalists who reject the Fog Compact as spiritual surrender.',
    fullEntry: 'The Thorn-Speaker is the elected voice of the Unshorn Briaran — the thorn-cloaked traditionalists who live in the Frostwood\'s deepest groves, their forearms bristling with living barbs that are the physical manifestation of an ancient fae-contract. The Unshorn reject the Fog Compact entirely, seeing it as spiritual surrender: where House Thalreth traded the Reach\'s clarity for protective mist, the Briaran believe the fog itself is the enemy, slowly erasing everything that made the forest sacred. The Thorn-Speaker\'s voice carries the weight of the groves, and every word is a thorn.',
    relatedTerms: ['ironwood_heart', 'frostwood-reach', 'briaran']
  },

  'the-first-liar': {
    id: 'the-first-liar',
    term: 'The First Liar',
    type: 'character',
    role: 'Leader of the Unlit Veil',
    region: 'nordhalla',
    summary: 'Head of the revolutionary movement seeking to overthrow the Frozen Archive\'s 2,000-year information monopoly.',
    fullEntry: 'The First Liar leads the Unlit Veil from Synod Hold — a hidden movement that believes the Frozen Archive\'s monopoly on information is the single greatest injustice in the known world. For two thousand years, the Archive has been the sole custodian of history, prophecy, and recorded knowledge. The Unlit Veil argues that this concentration of truth is indistinguishable from its suppression, and the First Liar — whose real identity is unknown, perhaps because it would give the Archive somewhere to send its own Inquisitors — organizes a decentralized campaign of information theft and release.',
    relatedTerms: ['synod_hold', 'nordhalla', 'frozen_archive']
  },

  'loras-ordavan': {
    id: 'loras-ordavan',
    term: 'Loras Ordavan',
    type: 'character',
    role: 'Steppe-Lord of House Ordavan',
    region: 'sundrift-vale',
    summary: 'A man who inherited a puppet\'s throne and has not yet realized it.',
    fullEntry: 'Loras Ordavan is the Steppe-Lord of House Ordavan, ruling the Sundrift Vale from Synod Hold. He inherited the title believing he commanded the loyalty of the nomad clans who cross the vale with their migration-horses. He does not. The Ordan clans, the Ordan migration-riders who sustain the Vale\'s economy, permit him his illusion of authority because a visible Steppe-Lord draws the Dawn Vigil\'s attention while their real leadership operates unseen. Loras has not yet realized he inherited a puppet\'s throne. When he does, the Vale will remember who actually holds the reins.',
    relatedTerms: ['synod_hold', 'sundrift-vale', 'house_ordavan']
  },

  'dawn-vigil-commander': {
    id: 'dawn-vigil-commander',
    term: 'The First Dawn',
    type: 'character',
    role: 'Commander of the Dawn Vigil',
    region: 'sundale',
    summary: 'The secret commander of the Dawn Vigil, whose identity is sealed behind basalt tablets delivered by silent Martyrs.',
    fullEntry: 'The First Dawn commands the Dawn Vigil from the Emberspire Caldera, but their identity is a secret kept even from most of their own order. Commands arrive as sealed basalt tablets delivered by Martyrs who have taken vows of silence — the messengers cannot betray what they cannot speak. Theories abound: that the First Dawn is a council rather than an individual, that the position has been vacant for decades and the basalt tablets are pre-written, or that the First Dawn is the last living Solvan who has not yet surrendered to accumulated grief.',
    relatedTerms: ['emberspire', 'sundale', 'house_solvan']
  },

  'deep-alchemist-prime': {
    id: 'deep-alchemist-prime',
    term: 'The Prime Alchemist',
    type: 'character',
    role: 'Leader of the Deep Alchemists',
    region: 'cragjaw-peaks',
    summary: 'The head of the Deep Alchemists, whose body is now more graft than flesh — no one remembers their original race or gender.',
    fullEntry: 'The Prime Alchemist leads the Deep Alchemists from the Lost Brood-Vats, the sealed laboratories deep beneath Frostmaw Holdfast where the Fexric guild-scientists pursue immortality through flesh-craft. The current Prime has replaced so much of their body with alchemical grafts that no living person remembers their original race or gender — they have become a walking catalogue of their own experiments. The Deep Alchemists maintain an uneasy detente with the Vat-Breakers above them: the Alchemists still believe the Thrumm root-stock was their finest creation; the Groven who broke free of those same vats consider that statement an indictment.',
    relatedTerms: ['lost-brood-vats', 'cragjaw-peaks', 'fexrick', 'groven', 'vat_breakers_guild', 'frostmaw_holdfast']
  },

  'vat-breaker-foreman': {
    id: 'vat-breaker-foreman',
    term: 'The First Foreman',
    type: 'character',
    role: 'Leader of the Vat-Breakers\' Guild',
    region: 'cragjaw-peaks',
    summary: 'The elected leader of the Groven guild who shattered their own containment vessels — now slowly calcifying, as all Groven do.',
    fullEntry: 'The First Foreman leads the Vat-Breakers\' Guild at Frostmaw Holdfast, elected by the Council of Spans and serving typically 20-30 years before the Groven calcification — the hardening of their stone-scaled bodies — advances too far for continued service. The Guild\'s founding act was the shattering of the Deep Alchemists\' containment vats: a revolt of engineered beings who chose freedom over the docility they were bred for. Every Foreman since carries that memory, and the Guild\'s relationship with the Deep Alchemists one level below them remains an ongoing, silent war conducted through Cold-Flame labor contracts and careful memory-preservation.',
    relatedTerms: ['frostmaw_holdfast', 'cragjaw-peaks', 'groven', 'vat_breakers_guild', 'deep_alchemists']
  },

  'solvan-steward': {
    id: 'solvan-steward',
    term: 'The Steward of Emberspire',
    type: 'character',
    role: 'Steward of House Solvan',
    region: 'sundale',
    summary: 'Caretaker of House Solvan, who refuse to call anyone Lord until the sun returns from its tomb.',
    fullEntry: 'The Steward of Emberspire manages House Solvan\'s affairs from the Great Forge, a position defined by absence: the Solvarn refuse to recognize any title higher than "Steward" until Sol — the buried star-god they helped entomb beneath Emberspire eight centuries ago — is released from its prison. The current Steward oversees a house defined by guilt, vigil, and a founding crime they cannot undo. Every Solvarn Martyr who takes the Vow, every Pyrofiend who swallows Scathrach\'s coal, does so under the Steward\'s silent, complicit gaze.',
    relatedTerms: ['great-forge', 'sundale', 'emberspire', 'house_solvan']
  },

  'mereval-admiral': {
    id: 'mereval-admiral',
    term: 'The High Admiral of Merrowport',
    type: 'character',
    role: 'High Admiral of House Mereval',
    region: 'iceheart-sea',
    summary: 'Ruler of Merrowport from the prow of the Wave-Kept, a ship that has not docked in forty years.',
    fullEntry: 'The High Admiral of Merrowport governs House Mereval\'s storm-wracked domains from the prow of the Wave-Kept, a Merryn ships that has not made port in forty years. The Merryn sailors believe a ship that docks loses its luck, and the High Admiral has taken this superstition to its logical extreme: a ruler who never sets foot on land cannot be accused of favoring any port over another. The Wave-Kept sails a circuit of the Iceheart Sea\'s safe currents, and the Admiral\'s judgments are delivered by tide-runner couriers. The Merrowport House considers this elegant governance. The land-bound houses consider it dereliction.',
    relatedTerms: ['merrowport', 'iceheart-sea', 'merryn', 'house_mereval']
  },

  'tesshan-lord': {
    id: 'tesshan-lord',
    term: 'The High-Lord of the Peaks',
    type: 'character',
    role: 'High-Lord of House Tesshan',
    region: 'cragjaw-peaks',
    summary: 'Rules from the highest gallery of Frostmaw Holdfast, where the blizzard wind is loudest and altitude sickness keeps visitors brief.',
    fullEntry: 'The High-Lord of the Peaks governs House Tesshan from the uppermost gallery of Frostmaw Holdfast — a deliberate architectural choice that ensures every petitioner arrives exhausted and eager to conclude business quickly. Sealed inside their snow-buried keeps for four centuries, the Tessen have turned defensive isolation into a political art form. The High-Lord\'s audiences are legendary for their brevity: at this altitude, even a Tessen\'s augmented lungs struggle, and the blizzard wind that never stops screaming through the gallery\'s open arches makes extended conversation physically impossible.',
    relatedTerms: ['frostmaw_holdfast', 'cragjaw-peaks', 'house_tesshan']
  },

  'morrath-steward': {
    id: 'morrath-steward',
    term: 'The Steward of the Seventh Seat',
    type: 'character',
    role: 'Velun Neth Appointee to House Morrath',
    region: 'atropolis',
    summary: 'A Velun Neth who has been "acting" Steward of House Morrath for 317 years. No Morrath descendant has claimed the seat in living memory.',
    fullEntry: 'The Steward of the Seventh Seat has governed House Morrath from Atropolis for 317 years — a Velun Neth appointed as a placeholder when the last Morrath descendant failed to present themselves. The position was meant to be temporary. No Morrath has appeared in living memory. The Steward administers the Morrath contract-debt (the family\'s hereditary obligation to the Keeper) as though the seat\'s true owners might walk through the door tomorrow. Every year that passes without them makes the fiction harder to maintain, but the Keeper of the Last Threshold has not acknowledged any breach — and a Velun Neth cannot voluntarily abandon a contract they signed.',
    relatedTerms: ['atropolis', 'keeper_of_the_last_threshold', 'house_morrath'],
    worldFriction: '317 years as "acting" Steward. The Morrath line may be extinct. The contract binds regardless.'
  },

  'sigurd-skalvyr': {
    id: 'sigurd-skalvyr',
    term: 'Sigurd Skalvyr',
    type: 'character',
    role: 'Jarl of the Archive',
    region: 'nordhalla',
    summary: 'Custodian of the Frozen Archive, gatekeeper of two thousand years of accumulated knowledge.',
    fullEntry: 'Sigurd Skalvyr serves as Jarl of the Archive — the custodian of the Frozen Archive\'s physical and runic collections. Where his brother Halvar rules the fjord-keeps through military force, Sigurd rules the library through access: no scholar, Augur, or Harbinger enters the Archive\'s deeper vaults without his seal. He is arguably more powerful than the High King-Jarl, because while Halvar controls the present, Sigurd controls the past — and in Nordhalla, where the glacier preserves everything, the past is negotiable.',
    relatedTerms: ['frozen_archive', 'nordhalla', 'house_skalvyr']
  },

  'frigga-skalvyr': {
    id: 'frigga-skalvyr',
    term: 'Frigga Skalvyr',
    type: 'character',
    role: 'Geothermal Negotiator for House Skalvyr',
    region: 'nordhalla',
    summary: 'The diplomat who negotiates Nordhalla\'s geothermal energy trade with Sundale\'s volcano-keeps.',
    fullEntry: 'Frigga Skalvyr holds what may be House Skalvyr\'s most dangerous position: Geothermal Negotiator. Nordhalla\'s glacier-bound fjord-keeps depend on imported heat from Sundale\'s volcanic vents — a dependence the Skalvyr would prefer no one mention. Frigga\'s work takes her from the Fjord Gate to Emberspire and back, brokering thermal-trade agreements with houses that have every reason to charge whatever they wish. She has survived three assassination attempts, two trade collapses, and one marriage proposal from a Thrask forge-lord who genuinely did not understand why a Skalvyr would say no.',
    relatedTerms: ['fjord_gate', 'nordhalla', 'emberspire', 'house_skalvyr']
  },

  'vellan-archivist': {
    id: 'vellan-archivist',
    term: 'Vellan the Archivist',
    type: 'character',
    role: 'Senior Archivist of the Scribe-Sentinels',
    region: 'frostwood-reach',
    summary: 'The Scribe-Sentinels\' most senior quill-keeper, who has seen the edits Caedren Thalreth authorized.',
    fullEntry: 'Vellan the Archivist serves as Senior Archivist of the Scribe-Sentinels from the Scribe\'s Tower in the Frostwood Reach. Under Caedren Thalreth\'s authority, the Sentinels maintain the Sovereign Ledger that determines who is Ledgered (a legal citizen) and who is Forgotten (an undocumented non-person). Vellan has seen the edits. She knows which names were erased and which property lines shifted. Unlike Caedren, she did not authorize them — but she also did not stop them, and silence, in the Reach, is its own kind of quill-stroke.',
    relatedTerms: ['scribes_tower', 'frostwood-reach', 'scribe-sentinels']
  },

  // ── Historical Founders ──
  // Founders of the 19 class traditions who are not already covered above

  'grum-bloodhammer': {
    id: 'grum-bloodhammer',
    term: 'Grum Bloodhammer',
    type: 'character',
    role: 'Founder of the Berserker Path',
    region: 'sundale',
    summary: 'The first Berserker, who ignited the Blood-Heat in Emberspire\'s caldera. His forge still burns in the Harath-Vault.',
    fullEntry: 'Grum Bloodhammer was the first to ignite the Blood-Heat — the metabolic fury that converts the body into a self-destructive engine of war. Where the Skald say the Hunger Pact originated in Nordhalla\'s three-winter blizzard, when ancestors consumed their own fallen to survive, Grum channeled that ancestral fire into something deliberate: a weapon. He lit the first Blood-Heat in the caldera of Emberspire, a dwarf whose fury was so bright the Solvarn Vigil thought the buried star was returning. The Forge of Grum in the Harath-Vault — where Berserkers still train beneath the volcanic stone — carries the impression of his hammer in the floor.',
    relatedTerms: ['harath_vault', 'blood_heat', 'emberspire', 'sundale', 'skald']
  },

  'valerius': {
    id: 'valerius',
    term: 'Valerius',
    type: 'character',
    role: 'Founder of the Arcanoneer Path',
    region: 'atropolis',
    summary: 'The Neth who drafted the First Contract with the Keeper of the Last Threshold, binding spoken word to legal consequence.',
    fullEntry: 'Valerius is the most revered and most terrifying name in the Arcanoneer tradition — the Velun Neth who drafted the First Contract with the Keeper of the Last Threshold, transforming spoken incantation into legally-binding document. Every Arcanoneer spell is, in essence, a descendant of that original negotiation: offer, consideration, consequence, all filed with the entity that cannot be cheated. Valerius did not invent the Neth\'s inability to lie; he weaponized it into an art form. The silver blood and stilled breath that mark the Velun Neth are not side-effects of the magic — they are its prerequisite. A non-Neth attempting Arcanoneer craft is a litigant who has already defaulted.',
    relatedTerms: ['atropolis', 'keeper_of_the_last_threshold', 'velun']
  },

  'cassia': {
    id: 'cassia',
    term: 'Cassia',
    type: 'character',
    role: 'Founder of the Augur Path',
    region: 'nordhalla',
    summary: 'The Skald seer who read the Deepening in a sacrificed glacier-elk. The entrails have not been fully accurate since.',
    fullEntry: 'Cassia founded the Augur tradition at the Frozen Archive, reading the future in the entrails of glacier-elk sacrificed on the Archive\'s ice-altars. Her founding prophecy was reading the Deepening — the entombment of the sun-god Sol — in the still-steaming gore of an elk killed at the precise moment of the star\'s disappearance. The glacier-cold slows the cooling of the sacrifice, extending the reading window from seconds to minutes. Every Augur since has used her technique, and every Augur since has watched the accuracy decline — from her 93% to the current 41% — as temporal friction contaminates what was once a reliable art.',
    relatedTerms: ['frozen_archive', 'nordhalla', 'skald']
  },

  'nesta': {
    id: 'nesta',
    term: 'Nesta',
    type: 'character',
    role: 'Founder of the Chronarch Path',
    region: 'cragjaw-peaks',
    summary: 'The first Chronarch, who hooked a volcanic-glass time-engine into her own chest. She is now disappearing from history.',
    fullEntry: 'Nesta was the first Chronarch — the Fexric engineer who, in a Frostmaw workshop, hooked a volcanic-glass time-engine directly into her chest to test whether a human body could serve as the housing for a temporal mechanism. It could. The clockwork chest-engine that every Chronarch now inherits is descended from her prototype, and so is the price: the engine kills its host over years, the body\'s natural decay accelerated by the paradox of operating outside linear time. Nesta is currently disappearing from history — records of her fade, memories slip — as though her existence is being reclaimed by the very mechanism she invented.',
    relatedTerms: ['frostmaw_holdfast', 'cragjaw-peaks'],
    worldFriction: 'Disappearing from history. If she ceases to exist, every Chronarch absorbs her temporal friction.'
  },

  'li-wei': {
    id: 'li-wei',
    term: 'Li Wei',
    type: 'character',
    role: 'Founder of the False Prophet Path',
    region: 'sundrift-vale',
    summary: 'The Ordan visionary who looked into the void where Sol once shone and saw a god that never existed. It began speaking back.',
    fullEntry: 'Li Wei, an Ordan nomad on the Sundrift Vale, founded the False Prophet tradition by looking into the void in the sky where Sol once shone — the empty socket where the star-god was, before the Deepening entombed it — and perceiving something that was never there: a divine presence in the absence itself. He preached a faith built on a vacancy. The faith took root. Then, centuries after Li Wei\'s death, the Voice began to speak — not metaphorically, not through interpretation, but directly, specifically, with instructions. Something has moved into the empty space Li Wei first perceived, and it is using his followers to arrange its emergence.',
    relatedTerms: ['sundrift-vale', 'frozen_archive'],
    worldFriction: 'The Voice now gives specific instructions. Something is using his network to free itself.'
  },

  'jax': {
    id: 'jax',
    term: 'Jax the Wager',
    type: 'character',
    role: 'Co-founder of the Gambit Path',
    region: 'iceheart-sea',
    summary: 'The Merryn pirate who wagered his lifeline against a storm-spirit — and won. He walked into the sea centuries ago.',
    fullEntry: 'Jax, called the Wager, co-founded the Gambit tradition in Merrowport by wagering his own lifeline — his remaining years — against a storm-spirit in the Iceheart Sea. He won. The spirit owed him a favor, and Jax discovered that probability could be coerced, not merely accepted. His side of the Gambit art is the luck-cult: dice weighted with salt-coral, stakes measured in voyage-shares, the belief that chance itself can be charmed into submission. Centuries later, Jax walked into the sea, telling no one why. His followers believe he went to collect the final debt from the storm-spirit. His enemies believe the spirit finally came to collect from him.',
    relatedTerms: ['merrowport', 'iceheart-sea', 'merryn', 'gambit']
  },

  'lyra': {
    id: 'lyra',
    term: 'Lyra the Clause',
    type: 'character',
    role: 'Co-founder of the Gambit Path',
    region: 'bryngloom-forest',
    summary: 'The Neth probability-weaver who formalized chance through rune-etched cards. Her Deck-Burners seek to force the universe to choose.',
    fullEntry: 'Lyra the Clause co-founded the Gambit tradition alongside Jax the Wager, but where he bet on luck, she bet on structure. A Kessen Neth weaving the probability-web of the Bryngloom\'s forest floor, Lyra formalized the art through rune-etched cards — chance quantified, the unknown reduced to a hand that could be read and played. She refined her technique through the Cragjaw toll-negotiations, where every hand of cards was a clause analysis and every win a precedent. After Jax walked into the sea, Lyra radicalized. Her followers, the Deck-Burners, now seek to burn every card in existence, forcing the universe to choose between absolute order and absolute chaos.',
    relatedTerms: ['bryngloom-forest', 'merrowport', 'cragjaw-peaks', 'neth', 'gambit', 'ironjaw_port'],
    worldFriction: 'Her Deck-Burners want to force the universe to choose between chaos and order.'
  },

  'xyris': {
    id: 'xyris',
    term: 'Xyris the Tear',
    type: 'character',
    role: 'Co-founder of the Harbinger Path',
    region: 'nordhalla',
    summary: 'The Astril who tore the first Chaos Pocket into existence, proving that reality could be damaged intentionally.',
    fullEntry: 'Xyris, called the Tear, co-founded the Harbinger tradition by tearing the first Chaos Pocket into the fabric of reality — an act of deliberate metaphysical damage that proved the universe was not as immutable as it seemed. An Astril whose constellation-spirit screamed the future through her crystalline skin, Xyris could not merely predict doom; she needed to understand its mechanism. The Chaos Pocket she created still exists, slowly expanding, and every subsequent tear in reality traces its parentage back to her original. She and Malakor, her mathematician partner, represent the two halves of the Harbinger art: the one who breaks and the one who measures the breaking.',
    relatedTerms: ['frozen_archive', 'nordhalla', 'astril', 'sundrift-vale', 'harbinger']
  },

  'selene': {
    id: 'selene',
    term: 'Selene of House Viridane',
    type: 'character',
    role: 'Founder of the Lunarch Path',
    region: 'frostwood-reach',
    summary: 'The Briaran noble who bound the dead-moon parasite to herself. She has not spoken in centuries.',
    fullEntry: 'Selene of House Viridane founded the Lunarch tradition by binding the dead-moon parasite — a surviving fragment of a celestial entity that died when its moon shattered — to her own body in the Frostwood\'s moonlit groves. The parasite feeds on the host\'s vitality in exchange for lunar-phase abilities tied to the cycle of the dead moon. Selene entered silence centuries ago, retreating into a state between life and undeath where the parasite sustains her without her active participation. The Briaran groves she left behind are now tended by Bri-Vessela, and no one — not even the Regent — knows whether Selene is still capable of waking.',
    relatedTerms: ['ironwood_heart', 'frostwood-reach', 'house_viridane', 'briaran'],
    worldFriction: 'Has not spoken in centuries. No one knows if she can still wake.'
  },

  'sera-solvan': {
    id: 'sera-solvan',
    term: 'Sera Solvan',
    type: 'character',
    role: 'Founder of the Martyr Path',
    region: 'sundale',
    summary: 'The Solvarn noblewoman who carved her sacrificed child\'s name into her arm and founded willing suffering as a sacred art.',
    fullEntry: 'Sera Solvan founded the Martyr tradition in the aftermath of personal tragedy: after the ritual sacrifice of her own child to maintain Sol\'s prison beneath Emberspire, she carved the child\'s name into her arm and declared that every wound willingly absorbed would be a small death in imitation of the buried star she helped entomb. The Devotion Gauge — the measure of accumulated suffering that generates miraculous protection — was born from her pain. Her house, the Solvarn, now conscript their own children into Martyr training. What Sera created as a personal act of atonement has become a factory of consecrated suffering.',
    relatedTerms: ['emberspire', 'sundale', 'house_solvan']
  },

  'lyris': {
    id: 'lyris',
    term: 'Lyris the Tide-Singer',
    type: 'character',
    role: 'Founder of the Minstrel Path',
    region: 'iceheart-sea',
    summary: 'The Merryn storm-sailor who calmed the sea-gales with her voice at the cost of ever speaking again.',
    fullEntry: 'Lyris the Tide-Singer founded the Minstrel tradition by discovering that certain rhythmic cadences could synchronize an entire crew\'s physiology to wave and wind — sustained effort that would exhaust any other people within hours. Her Cadence was maritime engineering: the precise technical manipulation of bodies through sound. The sea-gales calmed at her command, but the cost was absolute: the effort destroyed her vocal cords, and she spent the remainder of her life communicating through written notes. The Tide-Choir at Merrowport carries both her technique and her silence forward.',
    relatedTerms: ['merrowport', 'iceheart-sea', 'merryn']
  },

  'damon': {
    id: 'damon',
    term: 'Damon the Emberth',
    type: 'character',
    role: 'Founder of the Spellguard Path',
    region: 'sundale',
    summary: 'The Emberth smith who blocked a solar flare with an alchemical tower shield, founding magical defense as a craft.',
    fullEntry: 'Damon the Emberth was a smith at the Emberspire forge-keeps who, during a catastrophic solar flare from the imprisoned star Sol, raised an alchemical tower shield and absorbed the flare\'s magical impact. He survived. The shield was slag, but Damon was changed: his body had learned to intercept. He spent the rest of his life refining that interception into a discipline — the Spellguard method of identifying, containing, and deflecting hostile magic. The Bulwark-Captains who lead the Aegis today trace their lineage to his original shield, and every Spellguard\'s Void Resonance is a descendant of the energy he first learned to hold.',
    relatedTerms: ['emberspire', 'sundale', 'emberth', 'solbrand', 'spellguard']
  },

  'kora': {
    id: 'kora',
    term: 'Kora the Veil-Speaker',
    type: 'character',
    role: 'Co-founder of the Revenant Path',
    region: 'bryngloom-forest',
    summary: 'The Vreken who first bound living flesh to ancestral ghost, creating the blood-covenant that lets the dead speak through the living.',
    fullEntry: 'Kora the Veil-Speaker, a Clean Vreken of the Bryngloom, co-founded the Revenant tradition by binding living flesh to ancestral ghost — a blood-covenant that lets the dead speak through a living host. Her founding act was not selfish survival but continued service: she refused death because her ancestors needed a living voice. The Vreken side of the Revenant order — the half-born of Kor-Vasseth\'s Twice-Born — inherits her compassion. The other half, Vesper the Scribe\'s Neth contractual undeath, inherited something colder. The two traditions share a body of technique but diverge on the question of whether undeath is a gift or a debt.',
    relatedTerms: ['sunken_spire', 'bryngloom-forest', 'root_veil', 'vreken', 'revenant']
  },

  'vesper': {
    id: 'vesper',
    term: 'Vesper the Scribe',
    type: 'character',
    role: 'Co-founder of the Revenant Path',
    region: 'bryngloom-forest',
    summary: 'The Neth who formalized undeath through contract — the Postmortem Corvée that binds the deceased to continued service.',
    fullEntry: 'Vesper the Scribe, a Velun Neth of the Bryngloom, co-founded the Revenant tradition by formalizing undeath through contract: the Postmortem Corvée, a legally-binding clause that conscripts the deceased debtor into continued labor after death. Where Kora the Veil-Speaker\'s undeath was a gift offered to the ancestors, Vesper\'s was a debt owed to the Keeper — deferred collection, not avoided death. The frost-stasis arts that preserve the Neth Revenants descend from Vesper\'s original contractual language, and every clause that binds a Morrath debtor to posthumous service traces back to her quill.',
    relatedTerms: ['sunken_spire', 'bryngloom-forest', 'velun', 'house_morrath']
  },

  'orven': {
    id: 'orven',
    term: 'Orven the Still-Handed',
    type: 'character',
    role: 'Co-founder of the Inquisitor Path',
    region: 'bryngloom-forest',
    summary: 'The Vreken who severed the first corrupted ancestral bond with cold iron, founding the severance half of the Inquisitor art.',
    fullEntry: 'Orven the Still-Handed, a Clean Vreken of the Bryngloom, co-founded the Inquisitor tradition by severing a corrupted ancestral bond — a shaman-ghost that had turned predatory — with cold iron. His innovation was recognizing that corrupt bonds could be diagnosed by their bioluminescent signature and severed with the right tool. The Vreken half of the Barbed Vow — the Inquisitor order — tracks supernatural infection through the Root-Veil itself, feeling corruption as a wrongness in the skin. Orven\'s hands never tremble: the Still-Handed title is a description, not a boast.',
    relatedTerms: ['sunken_spire', 'bryngloom-forest', 'root_veil', 'vreken']
  },

  'elias': {
    id: 'elias',
    term: 'Elias the Salt-Scarred',
    type: 'character',
    role: 'Co-founder of the Inquisitor Path',
    region: 'frostwood-reach',
    summary: 'The Thalren who developed the face-baiting technique — opening his own veins to draw Wyrd horrors into flesh where they can be named.',
    fullEntry: 'Elias the Salt-Scarred, a Thalren of the Frostwood Reach, co-founded the Inquisitor tradition by developing the face-baiting technique: opening his own veins to draw Wyrd-creatures — the Gref, the Gambrel, the face-stealing horrors born from human fear — into living flesh where they can be named, categorized, and cut. The salt-scars that cover his body are the map of every entity he has baited and killed. His technique is the active, aggressive half of the Inquisitor art: where Orven severs bonds, Elias creates them, then breaks them on his own terms. Anti-Wyrd paranoia, for the Thalren who follow him, is not a personality trait — it is a survival discipline learned over eight fog-eaten centuries.',
    relatedTerms: ['frostwood-reach', 'sunken_spire', 'gref', 'gambrel']
  },

  'triune-founders': {
    id: 'triune-founders',
    term: 'The Triune Founders',
    type: 'character',
    role: 'Founders of the Animist Path',
    region: 'nordhalla',
    summary: 'Kael, Nyssa, and Theron — the three tradition-carriers from Ordan, Vreken, and Skald lineages who fused disparate ancestral arts into one.',
    fullEntry: 'The Animist tradition has no single founder — it was born at a crossroads where three tradition-carriers met and recognized the scars each carried from their separate ancestral arts. Kael of the Ordan brought totemic invocation, calling ancestors through the overtone of the migration-horse song across the Sundrift Vale. Nyssa of the Vreken brought spore-communion, breathing in the bioluminescent dead and letting them speak through shifting skin-glow. Theron of the Skald brought runic inscription, carving ancestors\' names into living flesh as permanent anchors. Together they formed the tri-regional council that became the Ancestral Convergence, and their three dialects — now fracturing — are the Animist\'s shared language.',
    relatedTerms: ['frozen_archive', 'nordhalla', 'sundrift-vale', 'bryngloom-forest', 'root_veil']
  },

  'first-cabal': {
    id: 'first-cabal',
    term: 'The First Cabal',
    type: 'character',
    role: 'Founders of the Pyrofiend Path',
    region: 'sundale',
    summary: 'Seven Solvarn occultists who swallowed Scathrach\'s burning coals in an obsidian cavern beneath Emberspire, trading their souls for demonic fire.',
    fullEntry: 'The Pyrofiend tradition was founded by seven Solvarn occultists — nobles of the house that helped entomb Sol — who gathered in an obsidian cavern beneath Emberspire and swallowed the burning coals offered by Scathrach the Ashen Sovereign. They understood the pact they were making: demonic fire in exchange for eventual collection. The seven scattered after their pact, each founding a separate Pyrofiend lineage that survives today. Their individual names have been deliberately erased — the Ashen Communion considers anonymity a form of protection, since the demon Scathrach knows exactly who it is coming to collect. What the Cabal did not anticipate is that Scathrach would one day call in all seven debts simultaneously.',
    relatedTerms: ['emberspire', 'sundale', 'house_solvan']
  }

};
