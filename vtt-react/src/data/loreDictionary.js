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
 fullEntry: 'For eight centuries, the Frostwood Reach has been hidden beneath a <LoreLink termId="memory_fog_mechanics">fog that eats memories</LoreLink>. House Thalreth traded the Reach\'s clarity for that insulating mist to keep it from freezing. Recently, Jarl-Archivist Kaelen Thalreth enforced the Sovereign Ledger, declaring unrecorded property rights silence. The region is policed by Mist-Sentinels along the Ironwood Palisade and choked by the Scribe-Cartel monopoly on ink and parchment. Society is split between the registered Ledgered and the outlawed, undocumented Forgotten.',
 relatedTerms: ['apex', 'bladedancer', 'bramble_heath', 'briaran', 'drunhold', 'gambrel', 'gref', 'greymark_keep', 'greythorn_copse', 'grimmwood', 'house_thalreth', 'house_viridane', 'ironwood_heart', 'ledger_halls', 'lunarch', 'mimir', 'mirror_mere', 'mistbarrow', 'rite-of-masks', 'scribes_tower', 'shaper', 'siltmire_flats', 'skalds_landing', 'the_shallows', 'the_shifting_fen', 'toxicologist', 'wraithfen', 'inquisitor', 'veyra', 'sylvanus', 'elias', 'vrael-forty-seventh', 'bri-vessela', 'varis', 'sylas', 'kaelen-thalreth', 'aldren-thalreth', 'elara-thalreth', 'caedren-thalreth', 'thorn-speaker', 'vellan-archivist', 'selene', 'memory_fog_mechanics']
  },
  'nordhalla': {
 id: 'nordhalla',
 term: 'Nordhalla',
 type: 'region',
 region: 'nordhalla',
 summary: 'A brutalist cathedral of frozen black fjords and towering glaciers in the northern reaches, fractured by King-Jarl Jarn-Tand\'s consolidation and the Sunder-Wall.',
 fullEntry: 'House Skalvyr halted the titanic glaciers of Nordhalla with a bargain, and the price of that halt is eternal winter. It is currently ruled with an iron fist by King-Jarl Halvar Skalvyr, called Jarn-Tand, who unified the region\'s clans by force. Jarn-Tand constructed the Sunder-Wall to regulate the nomadic Fredløse clans and enforce a trade monopoly through the Icechamber Syndicate. The region is marked by intense conflict between loyal Fastboende and outlaw clans, and a campaign of religious persecution, the Cleansing of the Hearth, which targets tribal Animists.',
 relatedTerms: ['augur', 'berserker', 'bloodhammer_sump', 'corvani', 'corvid_speech', 'fjord_gate', 'frozen_archive', 'harbinger', 'house_skalvyr', 'hunger_glaciers', 'rime_born', 'rimors_hearth', 'rooks_promontory', 'skald', 'skalds_landing', 'skalds_longport', 'stel', 'the_still_crag', 'the_warden', 'vargtor', 'vesperas_perch', 'warden', 'skadis_col', 'animist', 'malakor', 'theron', 'frostcirque', 'xyris', 'sera-three-scars', 'skadi-glass-eye', 'mor-vereth', 'halvar-skalvyr', 'the-first-liar', 'sigurd-skalvyr', 'frigga-skalvyr', 'cassia', 'triune-founders']
  },
  'sundale': {
 id: 'sundale',
 term: 'Sundale',
 type: 'region',
 region: 'sundale',
 summary: 'The scorched ashlands surrounding Emberspire, currently governed by Hierophant Aethelgard\'s Dawn Vigil.',
 fullEntry: 'The buried star Sol lies beneath Sundale, and the ashland above it has never stopped burning. After the collapse of House Solvan, the region was seized by Hierophant Aethelgard and the Dawn Vigil, who rule it as a martial-theocracy. The state enforces the Caldera Labor-Levies, conscripting the youth into the Martyr Brigades to mine sulfur for the Korr priests\' Sulfur Cartel monopoly. The population is split between the wealthy Deep-Born who live in the Harath-Vault and the impoverished Ash-Dwellers who are blockaded by the Obsidian Citadels.',
 relatedTerms: ['aex', 'basalt_shyr', 'cinder_badlands', 'cinderhoodoo', 'damon', 'dawn_vigil', 'ember_lagoon', 'emberspire', 'emberspire_caldera', 'emberth', 'great_forge', 'grum', 'harath_vault', 'house_solvan', 'inferno_veil', 'keth_amar', 'martyr', 'pyrofiend', 'scathrach', 'sera', 'slag_gulch', 'solbrand', 'sols_anvil_mesa', 'spellguard', 'the_ashen_escarpment', 'the_breach', 'the_deepening', 'titan', 'vault_breath', 'vulkars_karst', 'berserker', 'hark-ash-hammer', 'sol-kaessen', 'sol-vareths', 'thrak-damos', 'dawn-vigil-commander', 'solvan-steward', 'grum-bloodhammer', 'sera-solvan', 'first-cabal']
  },
  'iceheart-sea': {
 id: 'iceheart-sea',
 term: 'Iceheart Sea',
 type: 'region',
 region: 'iceheart-sea',
 summary: 'A violent, churning ocean of city-sized icebergs, governed by the Sea-Charter and policed by the Unfreezing Booms.',
 fullEntry: 'Storms and city-sized icebergs rule the Iceheart Sea, and the channels between them never freeze. Recently, Grand Admiral Varis Mereval enforced the Sea-Charter, mandating ship registry with the Mereval Board of Trade. The region is policed by patrol ironclads along the Unfreezing Booms and controlled by the Brine-Bond Syndicate. Undocumented refugees are pressed into lifetime servitude under Press-Warrants. Society is split between the Deck-Born officers and pressed Bilge-Dwellers, while traditional Tide-Speak animism is suppressed under the Luck-Ledger.',
 relatedTerms: ['deepwell_archipelago', 'first_shore', 'gale_storm_shallows', 'house_mereval', 'ironjaw_port', 'brinehorse_cove', 'merrowport', 'merryns_drift', 'minstrel', 'myrathil', 'skalds_longport', 'spindrift_lagoon', 'the_saltmaw_estuary', 'the_shivering_bight', 'treakous_rift', 'wraithsound', 'gambit', 'jax', 'merr-cael', 'mer-lyrisa', 'mereval-admiral', 'lyris']
  },
  'cragjaw-peaks': {
 id: 'cragjaw-peaks',
 term: 'Cragjaw Peaks',
 type: 'region',
 region: 'cragjaw-peaks',
 summary: 'A vertical labyrinth of howling blizzards, governed by the Knotted Decree and linked by Groven bone-spans.',
 fullEntry: 'The Cragjaw Peaks are a vertical wilderness of razor ridges, and House Tesshan buried them in perpetual blizzard to keep the world from looking in. The snow-veil was the trade: visibility for secrecy, warmth for isolation. Jarl Oda Tesshan enforces the Knotted Decree from the highest keep, replacing written script with knotted cords that only the Tesshan can read, and they don\'t teach it. The Steam-Line Cartel runs the infrastructure. The Tesshan corvée runs the labor. The high keeps hold the Terraced, who govern. The lower chasms hold the Chasm-Dwellers, who dig. And the Wyrd-kin stalk the cliffs: the Rime-Brides in the upper snows, the Storm-Crows above the ravines, watching anyone who climbs.',
 relatedTerms: ['ancestor_gaps', 'chronarch', 'deepchasm_keep', 'dreadnaught', 'fexrick', 'frostmaw_holdfast', 'frostmaw_massif', 'gambit', 'gearworks_gulch', 'groven', 'house_tesshan', 'iron_ravine', 'lost_brood_vats', 'stags_rest_moraine', 'sump_galleries', 'sump_rift', 'the_great_gorge', 'the_spans', 'thrumm', 'shaper', 'warden', 'torin', 'alaric', 'veyra', 'lyra', 'fex-vestara', 'deep-alchemist-prime', 'vat-breaker-foreman', 'tesshan-lord', 'nesta']
  },
  'sundrift-vale': {
 id: 'sundrift-vale',
 term: 'Sundrift Vale',
 type: 'region',
 region: 'sundrift-vale',
 summary: 'A starless nomadic steppe governed by the Iron-Yurt Law and mapped by Steppe-Staves.',
 fullEntry: 'Beneath a starless sky, the Sundrift Vale stretches flat and wind-swept to every horizon, and the Ordan nomads who cross it never stop moving. House Ordavan traded fertile soil for the endless migration. It is ruled by Khatun Bayarmaa Ordavan under the Iron-Yurt Law, which regulates grazing pastures using bone Steppe-Staves. Nomadic clans perform the mandatory Ordan-Urtuu post-system service and pay a heavy Herd-Tithe. The population is split between the horse-owning Mounted and the walking Unmounted, while traditional star-communing Sky-Singers are persecuted by the state.',
 relatedTerms: ['ancestor_mounds', 'ancestor_wold', 'astril', 'false_prophet', 'grass_tundra', 'harbinger', 'house_ordavan', 'kumis_downs', 'lien_stalked_grazes', 'morrens_bogpost', 'mound_camps', 'nova_heath', 'starfall_vale', 'synod_hold', 'the_long_steppe', 'the_unlit_knoll', 'animist', 'xyris', 'kael', 'sera-three-scars', 'mor-vereth', 'loras-ordavan', 'li-wei', 'triune-founders']
  },
  'bryngloom-forest': {
 id: 'bryngloom-forest',
 term: 'Bryngloom Forest',
 type: 'region',
 region: 'bryngloom-forest',
 summary: 'A twilight ironwood canopy and sinking peat-bog, governed by the First Contract and the Great Registry.',
 fullEntry: 'The Bryngloom Forest is a twilight swamp where the trees glow and the bogs remember what falls into them. Since the Neth signed the First Contract with the Keeper of the Last Threshold, the region has been governed by legalistic debt-covenants. It is ruled by Regent Morrath Neth, who enforces the Great Registry at Atropolis. Passage is controlled via the living-ironwood Toll-Dikes, and the economy is driven by the Peat-Debt Bondage. Poor Morren are trapped in peonage, while deceased debtors are conscripted into postmortem labor as Debt-Revenants. Traditional Swamp-Song animism is suppressed under Registry-Rituals.',
 relatedTerms: ['animist', 'aran_glen', 'arcanoneer', 'atropolis', 'black_fen', 'covenbane', 'deathcaller', 'drowned_dingle', 'elias', 'exorcist', 'fangmere_grove', 'gambit', 'house_morrath', 'hunters_gully', 'inquisitor', 'ironjaw_port', 'keeper_of_the_last_threshold', 'kora', 'lichborne', 'merryns_drift', 'morrens_bogpost', 'neth', 'orven', 'over_shanty', 'peat_bog_sinks', 'plaguebringer', 'revenant', 'root_veil', 'root_veil_scriptorium', 'sunken_spire', 'thalrens_ledger_post', 'valerius', 'vel_keth_bayou', 'vesper', 'vreken', 'lyra', 'nyssa', 'sera-three-scars', 'vrael-forty-seventh', 'vespera', 'kor-vasseth', 'triune-founders']
  },

  // NOBLE HOUSES
  'house_thalreth': {
 id: 'house_thalreth',
 term: 'House Thalreth',
 type: 'noble_house',
 region: 'frostwood-reach',
 summary: 'The noble lineage of the Frostwood Reach who traded the region\'s spatial clarity for an insulating fog, now enforcing the Sovereign Ledger.',
 fullEntry: 'House Thalreth rules the Frostwood Reach from Greymark Keep, and has done so since the fog came. Driven to protect their lands from the Freeze-Front, they traded spatial clarity for <LoreLink termId="memory_fog_mechanics">insulating fog</LoreLink>, or so the public record states. The fog serves purposes older than the Freeze-Front, and Thalreth\'s bargain with the Warden merely formalized what was already rising. The current lord, Jarl-Archivist Kaelen Thalreth, enforces the Sovereign Ledger, stripping undocumented peoples of their rights. The house maintains the Scribe-Cartel monopoly on ink and paper, and operates the Tapestry-Wards to forcibly assimilate frontier and Mimir children into structured runic logic.',
 relatedTerms: ['briaran', 'frostwood-reach', 'gambrel', 'greymark_keep', 'greythorn_copse', 'house_viridane', 'mirror_mere', 'mistbarrow', 'scribes_tower', 'skalds_landing', 'the_warden', 'toxicologist', 'kaelen-thalreth', 'aldren-thalreth', 'elara-thalreth', 'caedren-thalreth', 'memory_fog_mechanics']
  },
  'house_skalvyr': {
 id: 'house_skalvyr',
 term: 'House Skalvyr',
 type: 'noble_house',
 region: 'nordhalla',
 summary: 'The northern lords of Nordhalla who halted the glaciers at the price of eternal winter, now represented by King-Jarl Jarn-Tand.',
 fullEntry: 'House Skalvyr traded summer to freeze the grinding glaciers of Nordhalla in place, and the cold has been theirs ever since. Recently, the house consolidated its rule under King-Jarl Halvar Skalvyr (Jarn-Tand), who unified the clans by force. To fund his mercenaries, Jarn-Tand mortgaged regional resources to southern syndicates, establishing the Icechamber Syndicate trade monopoly. The house enforces its rule through the Sunder-Wall and the Runic Academies, suppressing ancestral animism in favor of controlled runic calculations.',
 relatedTerms: ['augur', 'bloodhammer_sump', 'corvani', 'fjord_gate', 'frozen_archive', 'harbinger', 'hunger_glaciers', 'nordhalla', 'rime_born', 'skald', 'skalds_landing', 'stel', 'the_warden', 'vargtor', 'vesperas_perch', 'warden', 'skadis_col', 'halvar-skalvyr', 'sigurd-skalvyr', 'frigga-skalvyr']
  },
  'house_solvan': {
 id: 'house_solvan',
 term: 'House Solvan',
 type: 'noble_house',
 region: 'sundale',
 summary: 'The tragic noble family of Sundale, recently sidelined by the Dawn Vigil theocracy.',
 fullEntry: 'House Solvan spearheaded the entombment of Sol beneath Sundale, and the star has been pressing against the vault ever since. Following Keth-Amar\'s breach and the collapse of the Solvan Imperium, the house lost its political legitimacy as the volcanic vents began to cool. The family has been largely sidelined by Hierophant Aethelgard and the Dawn Vigil. Their remaining descendants live in the shadow of Emberspire, witnessing their lands being industrially fractured and their youth conscripted by the state.',
 relatedTerms: ['aex', 'basalt_shyr', 'dawn_vigil', 'ember_lagoon', 'emberspire', 'great_forge', 'keth_amar', 'martyr', 'sera', 'solbrand', 'sols_anvil_mesa', 'sundale', 'the_ashen_escarpment', 'the_warden', 'solvan-steward', 'sera-solvan', 'sol-kaessen', 'sol-vareths', 'dawn-vigil-commander', 'first-cabal']
  },

  // FIGURES
  'grum': {
 id: 'grum',
 term: 'Grum Bloodhammer',
 type: 'historical_figure',
 region: 'sundale',
 summary: 'The legendary forge-blacksmith of Emberspire in Sundale who first manifested the Berserker\'s Blood-Heat by surrendering to the volcanic forge during a wyrm attack.',
 fullEntry: 'When the ice-wyrm burst into the Emberspire mining-chambers, every Emberth ran. Grum Bloodhammer didn\'t. The master forge-blacksmith threw down his tools and surrendered to the forge-heat instead, igniting his own blood and muscles past anything a living body should survive. His bare fists shattered the wyrm\'s glacial hide. The workers lived. And the Berserker\'s Blood-Heat was born in that moment: the path of a man who chose to burn rather than flee.',
 relatedTerms: ['berserker', 'blood_heat', 'emberspire', 'sundale', 'hark-ash-hammer']
  },
  'sera': {
 id: 'sera',
 term: 'Sera Solvan',
 type: 'historical_figure',
 region: 'sundale',
 summary: 'The Solvarn mother who carved her sacrificed child\'s name into her flesh, becoming the first Martyr.',
 fullEntry: 'When the six houses marched their firstborn to the peaks to feed them to Keth-Amar, Sera Solvan of House Solvan went with a piece of volcanic obsidian and carved her child\'s name into her own forearm. The houses tried to purge the memory of what they\'d done. The wound had other ideas. It healed into a glowing solar scar that pulsed with the heat of the child she had lost, and Sera became the first Martyr: one who takes the suffering meant for others and carries it in their own flesh. The Scar-Shrine beneath Emberspire still keeps the obsidian, and the scar still glows.',
 relatedTerms: ['devotion_gauge', 'house_solvan', 'martyr', 'sundale', 'sol-kaessen']
  },
'scathrach': {
  id: 'scathrach',
  term: 'Scathrach, the Ashen Sovereign',
  type: 'historical_figure',
  region: 'sundale',
  summary: 'A fragment of Aex\'s flayed hide that fell into Emberspire\'s deepest vent during the Binding itself, corrupted by the Wyrd and grown sentient.',
  fullEntry: 'Something nests in the molten vents beneath Emberspire, and the Emberth have a name for it: Scathrach, the Ashen Sovereign. It is not older than the Binding — it was born during it. A fragment of Aex\'s flayed hide fell into Emberspire\'s deepest vent while the seal was being woven, and the Wyrd, already leaking through Aex\'s stretched body, corrupted it. For centuries Scathrach was Keth-Amar\'s emissary, a rooting tendril through the wound, feeding the Sun-Eater information and despair from within the world. But Aex\'s nature was too strong. The fragment rejected the corruption.\n\nNow Scathrach despises Keth-Amar for what it was made into. It calls in Pyrofiend debts not to serve the Sun-Eater but to hoard power to wound it back. Keth-Amar cannot reach into that vent anymore — Scathrach sealed it from within. The Ashen Sovereign always collects its bargains, but the fire is no longer the Sun-Eater\'s. Every Pyrofiend ends in the furnace, and the next bargain is already being struck, and somewhere below the magma, Scathrach waits for the strike that will finally mean something.',
  relatedTerms: ['emberspire', 'pyrofiend', 'sundale']
  },

  // RACES
  'mimir': {
 id: 'mimir',
 term: 'Mimir',
 type: 'race',
 region: 'frostwood-reach',
 summary: 'A secretive, shape-shifting people of the Frostwood Reach who wear heartwood, storm-glass, or pine masks.',
 fullEntry: 'The Mimir are the mask-wearers of the Frostwood canopy, and they have never shown their faces to outsiders. They began when the forester Sylvain merged with a doppelganger death-omen, and the union left them able to shift their shapes. But the fog that saved the Reach from freezing also devours memory. After generations in the mist, a Mimir can forget their own face. So they carve masks from heartwood or storm-glass, and the mask becomes the only thing holding them together.\n\nThe Mask-Borne rule the canopy-holds as aristocrats. The Mist-Woven keep watch from the high aeries. The Unwoven, born without masks, drift the valley floor carrying cracked heirlooms no one remembers how to repair. At the heart of Mask-Borne territory lies Mirror Mere, a lake so still it returns a Mimir\'s true face even when they can no longer recall it.\n\nThe art of carving new masks died when the inquisitors burned the birthing chambers. The Hunters pay fortunes for Mimir masks on the black market. And every year, the fog grows a little thicker.',
 relatedTerms: ['apex', 'briaran', 'frostwood-reach', 'gref', 'mirror_mere', 'rite-of-masks', 'shaper', 'the_shifting_fen', 'wraithfen', 'veyra', 'sylvanus', 'sylas']
  },
  'rite-of-masks': {
 id: 'rite-of-masks',
 term: 'Rite of Masks',
 type: 'cultural_practice',
 region: 'frostwood-reach',
 summary: 'The sacred, defensive custom practiced by the Mimir where they wear beautifully carved, fluid masks to lock their identity against the fog\'s memory-decay and secure trust.',
 fullEntry: 'The Rite of Masks holds the Mimir together. Without it, the fog dissolves them. Originating in the Frostwood Reach where the creeping mist hollows and erases the personal memories of mortals, the Mimir, who possess innate shape-shifting abilities, discovered that their fluid anatomy was highly vulnerable to dissolving under the fog\'s decay. By carving and ritually bonding to a single, fluid mask made of heartwood, storm-glass, or black birch, a Mimir permanently anchors their primary identity and physical form. Socially, the Rite of Masks serves as a covenant of trust with human neighbors: by wearing a constant, recognizable persona, the Mimir guarantees they will not hijack another mortal\'s face or slip away into shape-shifting deception.',
 relatedTerms: ['frostwood-reach', 'greymark_keep', 'mimir', 'mirror_mere']
  },
  'emberth': {
 id: 'emberth',
 term: 'Emberth',
 type: 'race',
 region: 'sundale',
 summary: 'A powerful, dark-skinned people of Sundale who bear deliberate burn-scars encoding their lineage and trade.',
 fullEntry: 'Sol spoke in heat and image, never words, and the Emberth were the ones who listened. When prophecy warned of the sun\'s death, their ancestors descended into the thermal caverns beneath Emberspire and waited out the freezing of the surface above. Generations later they are still there, broad-shouldered and patient, their large heat-sensitive eyes adapted to the dark, their long lungs built for thin volcanic air.\n\nThe Korr tend the deep vault where the Solbrand still glows, and they keep their sacred silence. The Thrask range the badlands above, hunting and mining the volcanic frontier. Together they work the greatest forges left in the world. At Ember Lagoon, Sundale\'s only port, Emberth harbourmasters and Merryn shipping clans load the forged goods onto ships and send them out to whatever\'s left of civilization.',
 relatedTerms: ['cinder_badlands', 'cinderhoodoo', 'damon', 'ember_lagoon', 'emberspire', 'great_forge', 'harath_vault', 'slag_gulch', 'solbrand', 'spellguard', 'sundale', 'titan', 'vault_breath', 'vulkars_karst', 'thrak-damos']
  },
  'neth': {
 id: 'neth',
 term: 'Neth',
 type: 'race',
 region: 'bryngloom-forest',
 summary: 'An immortal, silver-skinned people of the Bryngloom Forest bound by legal contracts to the Root-Veil.',
 fullEntry: 'For eight centuries, the Neth have kept a contract with the forest spirit other races only fear. The terms are simple: the Keeper of the Last Threshold preserves their bodies, and the Neth write down everything it consumes. They cannot lie. They cannot break a promise. They cannot stop writing. The alternative is the silence that waits for anyone who breaches the agreement.\n\nThey rose from the bog with silver skin and stilled breath, descended from a dying scribe-clan that negotiated survival out of the Keeper\'s mouth. Now they rule Atropolis and divide into three: the silver-skinned Velun pact-lords who govern the canopy, the Kessen weavers who work the forest floor, and the leaden-grey Drun, outcasts who burned their names from the Contract and legally do not exist.\n\nBeyond the city, the Vel-Keth Bayou, "the water that remembers," supplies the memory-glass that Kessen weavers harvest from its bed. The living-ironwood settlement of Aran-Glen shows what the Neth can build when they have centuries and a forest willing to be shaped.',
 relatedTerms: ['animist', 'aran_glen', 'arcanoneer', 'atropolis', 'black_fen', 'bryngloom-forest', 'deathcaller', 'drowned_dingle', 'elias', 'gambit', 'house_morrath', 'inquisitor', 'ironjaw_port', 'keeper_of_the_last_threshold', 'brinehorse_cove', 'lichborne', 'morrens_bogpost', 'orven', 'over_shanty', 'plaguebringer', 'revenant', 'root_veil', 'root_veil_scriptorium', 'sunken_spire', 'thalrens_ledger_post', 'valerius', 'vel_keth_bayou', 'vesper', 'vreken', 'lyra']
  },
  'astril': {
 id: 'astril',
 term: 'Astril',
 type: 'race',
 region: 'sundrift-vale',
 summary: 'A crystal-skinned people of the Sundrift Vale whose bodies carry the nesting constellation-spirits of Sol\'s ministers.',
 fullEntry: 'When Sol was entombed, its celestial court didn\'t die with it. The constellation-spirits fled the darkening sky and nested inside the bloodlines of the steppe peoples, and the children born after carried their light in the skin. The Astril glow. Crystalline patterns trace their bodies and hum with a resonance older than the Dimming. They are the luminous guardians of a starless steppe, keeping a dead court alive in living glass.\n\nNot all of them welcome the light. The Sylen seek total symbiosis with the spirit they carry. The Muren bind and suppress theirs, afraid of what the resonance might wake. And the Unlit carry no star-glow at all, born to parents whose spirits went quiet before they could pass it on. Every caste makes pilgrimage to Starfall Vale, where the residue of Sol\'s shattered court still strikes the earth, and the Memory of Sol can be heard in the harmonic tones of trapped starlight.',
 relatedTerms: ['ancestor_mounds', 'ancestor_wold', 'astril', 'false_prophet', 'grass_tundra', 'harbinger', 'house_ordavan', 'kumis_downs', 'lien_stalked_grazes', 'morrens_bogpost', 'mound_camps', 'nova_heath', 'starfall_vale', 'synod_hold', 'the_long_steppe', 'the_unlit_knoll', 'animist', 'xyris', 'kael', 'sera-three-scars', 'mor-vereth', 'loras-ordavan', 'li-wei', 'triune-founders']
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
 summary: 'The progressive volcanic heat tracked by Pyrofiends as their Wyrd-touched pact claims their flesh.',
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
  summary: 'Sol\'s natural death-rebirth cycle, interrupted by the Binding. The 12-year resonance is a harmonic of the 7 Monoliths, not a fixed clock.',
  fullEntry: 'The Deepening is the natural cycle by which a star sheds exhausted light and rekindles. Sol entered that vulnerable state, and the binding houses entombed it beneath Sundale to protect it from Keth-Amar, breaking the cycle of the heavens. But the old model was wrong.\n\nThe twelve-year resonance is not a fixed clock. It is the natural harmonic of the seven Monoliths trying to sync up. The Pulse that the Augurs measure is not Sol trying to rekindle — it is Aex screaming. Sol is in torpor, unable to rebirth, unable to die. The Augurs have been measuring Aex\'s scream output: forty percent in the first century, declining to zero across sixty-five pulses. Aex has stopped screaming. The Monoliths are waking because he can no longer hold them still.\n\nKeth-Amar is NOT consuming rebirth attempts. Keth-Amar is pressed against the partial seal, leeching energy through the cracks. The Wyrd is its corruption bleeding through. The "rebirth window" model was a myth that scholars believed for centuries, but the Augurs now know it was wrong. The months of First Thaw and False Dawn are all that remains of the old hope, preserved in ritual long after the understanding behind it withered.',
  relatedTerms: ['aex', 'keth_amar', 'lunarch', 'solbrand', 'sundale', 'the_warden']
  },
'the_breach': {
  id: 'the_breach',
  term: 'The Breach',
  type: 'event',
  region: 'sundale',
  summary: 'The catastrophic event when six of the seven houses fed their firstborn heirs to Keth-Amar, cracking Sol\'s tomb and releasing the Wyrd.',
  fullEntry: 'The Binding held for eight years. Then it broke. For eight years after Sol was entombed, Keth-Amar whispered to the noble houses from the dark beyond the vault, working at them through bargains, dreams, and the slow poison of dread until six of the houses could not hold out any longer. Six of seven heirs agreed and were consumed as vessel-keys. The seventh — Viridane\'s — never agreed. The Watcher in the Mist reached them first, and they fled south into the Frostwood.\n\nBecause only six heirs fed Keth-Amar, the seal cracked but did not shatter. The vault opened partially. The seal split into seven Monoliths: six true fragments of Aex\'s woven hide, and one false. Viridane\'s signature was never real, so their Monolith is a hollow echo, a stone with no binding power.\n\nEmberspire erupted. And the Wyrd, the formless rot sealed since before human memory, bled through the volcanic cracks into the air the living breathe. The Breach is the name the survivors gave to the day the world cracked open and the long night stopped being something that might end.',
  relatedTerms: ['emberspire', 'keth_amar', 'starfall_vale', 'sundale', 'the_warden', 'the_corruption_years', 'the_partial_seal']
    },
 
   // CREATURES
  'gref': {
 id: 'gref',
 term: 'Gref',
 type: 'creature',
 region: 'frostwood-reach',
 summary: 'A face-stealing Wyrd-manifestation born from the Reach\'s fear of losing one\'s identity to the fog.',
 fullEntry: 'The fog eats memory slowly. The Gref doesn\'t. Born from the Wyrd mirroring the Frostwood\'s fear of losing itself, the Gref is an amorphous, silent thing that stalks travelers in the mist and strips them of their faces and their recollections together. It leaves its victims blank and maskless in the fog, then walks into the timber keeps wearing a stolen visage and the name that went with it. The Mimir, whose masks are the only thing holding them together, fear the Gref more than anything else in the Reach.',
 relatedTerms: ['frostwood-reach', 'ledger_halls', 'mimir', 'the_shallows', 'wraithfen', 'elias']
  },
  'gambrel': {
 id: 'gambrel',
 term: 'Gambrel',
 type: 'creature',
 region: 'frostwood-reach',
 summary: 'An oath-hunting Wyrd-creature that tracks those who make promises they intend to break.',
 fullEntry: 'Break a promise in the Frostwood Reach and the Gambrel comes. It is a spindly, long-limbed thing born from the Wyrd\'s taste for guilt, and it tracks the shame of a broken oath the way a hound tracks blood. It stalks the carriages on the mist-choked trails, and the more desperately you want to forget what you swore, the faster it moves. No one has outrun a Gambrel. The Reach\'s answer is simple: keep your word, or don\'t travel the trails at all.',
 relatedTerms: ['frostwood-reach', 'house_thalreth', 'ironwood_heart', 'the_shallows', 'elias']
  },
  'stel': {
 id: 'stel',
 term: 'Stel',
 type: 'creature',
 region: 'nordhalla',
 summary: 'A frozen Wyrd-creature that acts as a glacier\'s memory, replaying the death-moments of those caught in the ice.',
 fullEntry: 'The glaciers of Nordhalla remember everyone they have taken, and sometimes they give the dead back. The Stel is a heavy, crystalline colossus compacted from glacial ice and the spiritual residue of those who froze inside it. It stalks the frozen fjords as the living projection of the glacier\'s memory, replaying the final screams of the dead to lure the living close enough to join them. If you hear a familiar voice out on the ice, it isn\'t.',
 relatedTerms: ['house_skalvyr', 'hunger_glaciers', 'nordhalla', 'rime_born', 'rimors_hearth', 'skadis_col']
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
 fullEntry: 'The Warden is no spirit, no ancestor, no force of nature. It is the universe\'s mechanism of consequence: a presence older than Sol that exists to enforce the logic of exchange. Every bargain has a price, and the Warden doesn\'t forget it.\n\nIts hand is on the founding of the world. When Sol entered the Deepening, the binding houses came to the Warden with a proposal to entomb the dying star beneath Sundale, and the Warden named its price: Aex, Sol\'s own firstborn, willing, whose living hide was flayed to weave the binding seal. Afterward each house returned to strike its own compact. Thalreth traded clarity for fog. Skalvyr traded summer for halted glaciers. Each was accepted without negotiation and without mercy.\n\nThe Dark Bargains, the capitulation to Keth-Amar and the sacrifice of the firstborn heirs, were struck with Keth-Amar directly. The Warden did not broker them. Confusion arises because both entities deal in exchange, but they are not the same. The Warden enforces balance. Keth-Amar devours. Those who have encountered what they believe to be the Warden describe only a sensation: the certainty that a debt has just been recognized.',
 relatedTerms: ['aex', 'house_skalvyr', 'house_solvan', 'house_thalreth', 'keth_amar', 'nordhalla', 'silent_seventh', 'the_breach', 'the_deepening', 'the_still_crag', 'titan', 'warden']
  },

  'keth_amar': {
   id: 'keth_amar',
   term: 'Keth-Amar',
   type: 'entity',
   region: 'sundale',
   summary: 'The ancient cosmic predator that hunts stars in their Deepening cycle, pressed against the partial seal and seeping corruption through the cracks.',
   fullEntry: 'Every civilization that named Keth-Amar in writing was destroyed before the word could spread. That is why it has no name in any living language older than eight centuries. It hunts stars in their Deepening, the vulnerable death-rebirth cycle, and consumes them before they can rekindle. When Sol entered its Deepening, Keth-Amar followed, and the binding houses chose to entomb the star beneath the world rather than surrender it.\n\nKeth-Amar is not mindless hunger. It schemes. It studies its prey\'s fears, folklore, and fractures. For eight years after the Binding, it whispered to the houses not with rage, but with precision: tailored dread, bargains that sounded like reason. Six houses broke. They marched their firstborn to the peaks, and Keth-Amar took them as vessel-keys. But Viridane never agreed, so the seal cracked only partially. Keth-Amar did NOT eat sixty-five rebirth attempts. It is pressed against the partial seal, seeping through the cracks, feeding on energy bleeding through — Sol\'s life, Aex\'s pain.\n\nDuring the Corruption Years, it offered Sol\'s own warmth deceptively to the houses, pretending it could free heat while using the bargains to crack the seal. It has never broken a bargain under the Warden\'s framework. It is bitter that the seventh heir (Viridane\'s) never agreed.\n\nThe Cult of Forgotten Shadow is an organized merger between the Over-Shanty bog-cult and disillusioned Dawn Vigil defectors who learned that Monolith reassembly summons Keth-Amar rather than Sol. It is not a separate entity serving an emissary; it acts as a channel for Keth-Amar\'s direct whispers through the cracks, for there is no independent Voice.',
   relatedTerms: ['dawn_vigil', 'emberspire', 'house_morrath', 'house_solvan', 'house_viridane', 'lunarch', 'silent_seventh', 'sundale', 'the_breach', 'the_deepening', 'the_warden', 'the_corruption_years', 'the_partial_seal']
     },

  'the_watcher': {
    id: 'the_watcher',
    term: 'The Watcher in the Mist',
    type: 'entity',
    region: 'frostwood-reach',
    summary: 'The impartial cosmic boundary entity between life, death, memory, and oblivion, known as the Keeper of the Last Threshold in the Bryngloom.',
    fullEntry: 'The Watcher in the Mist (called the Keeper of the Last Threshold by the Neth and the Root-Veil by the Vreken) is the world\'s memory and conscience. Older than Keth-Amar\'s intrusion, it exists as the boundary between life and death, memory and oblivion. Impartial and all-knowing, it rarely acts directly. However, during the Breach, it reached House Viridane in the moonlit groves before Keth-Amar could claim their heir, offering a counter-bargain of memory-fog to hide them from the Sun-Eater\'s view. The Watcher is currently fracturing under Keth-Amar\'s immense pressure, causing the boundary of memory and death to collapse across the northern reaches.',
    relatedTerms: ['briaran', 'house_viridane', 'keth_amar', 'memory_fog_mechanics', 'the_partial_seal', 'the_breach', 'keeper_of_the_last_threshold']
  },
 
   'solbrand': {
 id: 'solbrand',
 term: 'Solbrand',
 type: 'resource',
 region: 'sundale',
 summary: 'The sacred, searing thermal current that radiates from Sol\'s buried vault beneath Emberspire, tended by the Korr Emberth in sacred silence.',
 fullEntry: 'The Solbrand is not a flame. It is the residual warmth of a star that should be dead, bleeding upward through eight hundred feet of volcanic basalt. The Korr Emberth, the vault-dwelling caste of the Emberth race, have tended the Solbrand in sacred, wordless silence since the day Sol was bound. They believe the Solbrand is Sol\'s breathing, that if it ever falters, the star has truly died and no vault, no bargain, no sacrifice can restart it. In practical terms, the Solbrand heats the deep-cavern settlements, powers the forge-caldera used by the Emberth smith-clans, and provides the thermal differential that keeps the Sundale badlands from freezing solid like the rest of the world\'s surface.',
 relatedTerms: ['damon', 'dawn_vigil', 'emberspire', 'emberth', 'harath_vault', 'house_solvan', 'sols_anvil_mesa', 'spellguard', 'sundale', 'the_deepening']
  },

'aex': {
  id: 'aex',
  term: 'Aex',
  type: 'entity',
  region: 'sundale',
  summary: 'Sol\'s firstborn, a living entity of pure stellar radiance who willingly gave his living hide to weave the binding seal that entombs the dying star.',
  fullEntry: 'Aex was Sol\'s firstborn: not a spirit, not an ancestor, but a living entity of pure stellar radiance that had protected the sun through every Deepening since the first star learned to burn. It was the sun\'s child in the oldest sense, a being woven from the same fusion-fire that lit the system, sentient light given form and will.\n\nWhen the Deepening began and Keth-Amar arrived to feed, the binding houses faced an impossible choice. To entomb Sol was to cage a star, and no cage could hold a star unless it was made from the star\'s own substance. The Warden, that ancient mechanism of cosmic consequence, named its price: Aex. The firstborn, flayed alive, its living tissue woven into a seal that could pass through Sol\'s outer radiance and grip the star at its core. There was no other way.\n\nHouse Solvan wielded the knife. The blade was a shard of crystallized starlight, the only edge that could cut a being of pure radiance. They flayed Aex\'s living hide in a single unbroken sheet, and the firstborn did not scream. It sang. The song was Sol\'s own frequency, a harmonic that matched the star\'s death-throes, and the houses wove that singing hide into the seal while Aex bled stellar plasma onto the ritual ground. The knife shattered the moment the seal was complete, its fragments scattered among the seven houses as relics and as warnings of what the Warden charges for a star.\n\nAex offered itself willingly. This is settled. No coerced binding could hold the metaphysical weight of a god — Aex knew this, and consented. The fragments of the knife, still held by the houses, are said to tremble when the seal strains, reminders of the cost, not of struggle. The willingness is canonical.\n\nAex was not killed. He is LYNGED — stretched across the vault in perpetual agony. Conscious. Aware. The seven Sundered Monoliths are parts of his body scattered when the seal cracked. The false Monolith (Viridane\'s missing heir) means only six of seven are real. If the false one is corrupted, Wyrd reaches Aex\'s heart and transforms him. Every pulse the Augurs measured was Aex screaming. He screamed 65 times. Now he has stopped. Exhausted. The Monoliths wake because he can no longer hold them still.',
 relatedTerms: ['emberspire', 'house_solvan', 'sundale', 'the_deepening', 'the_warden', 'keth_amar', 'sundered_monoliths', 'frozen_archive', 'the_corruption_years', 'the_partial_seal']
   },

'sol': {
  id: 'sol',
  term: 'Sol',
  type: 'entity',
  region: 'sundale',
  summary: 'The dying star entombed beneath Emberspire, a living celestial consciousness in forced torpor — unable to rebirth, unable to die.',
  fullEntry: 'Sol burns at the heart of this world, a living star whose consciousness spans the system it warms. When it entered the Deepening, Keth-Amar came to consume it, and the binding houses entombed Sol beneath Sundale rather than surrender it. Sol did not consent to this, but it was done to save it.\n\nSol is not trying to rekindle. It is in forced torpor — bound beneath Sundale, wrapped in Aex\'s stretched hide. It cannot rebirth. It cannot die. It cannot scream. It endures.\n\nAll that remains of Sol\'s conscious warmth is the Solbrand, the residual thermal current bleeding upward through the basalt. The Korr Emberth tend it in sacred silence and believe Sol still breathes. The Augurs at the Frozen Archive once tracked the twelve-year windows as rebirth attempts. They now know those pulses were Aex screaming, not Sol igniting.',
 relatedTerms: ['aex', 'keth_amar', 'solbrand', 'sundale', 'the_deepening', 'the_breach', 'the_warden', 'emberspire', 'frozen_archive']
  },

  // ============================================================
  // CLASSES (20 active traditions + 6 merged concepts)
  // ============================================================

  'arcanoneer': {
 nativeWeaving: `**Ecological.** The Bryngloom's peat-bogs preserve everything, including clauses, so a magic that operates as filed law could only arise here. **Cultural.** The Velun archive-city and the Neth's biological inability to lie are the substrate of contract-syntax spellcasting. **Founder.** Valerius, a Neth archivist, drafted the First Contract with the Keeper, a direct product of the Bryngloom's reincarnation-contract-law Stratum. **Subrace-native.** Only the Velun Neth carry the contract-locked neurology that can submit a clause without breaching.`,

 id: 'arcanoneer',
 term: 'Arcanoneer',
 type: 'class',
 region: 'bryngloom-forest',
 summary: 'A contract-mage who crystallizes their silver Neth blood into volatile shards, anchoring spells in legal precision rather than instinct.',
 fullEntry: 'Valerius drafted the First Contract in the early centuries of the Dimming, and the Arcanoneer tradition was born the moment he realized the Bryngloom\'s ambient magic obeyed the same syntax as Neth contract law. Offer, consideration, consequence. An Arcanoneer files an incantation like a legal document and watches their own silver blood crystallize into volatile Mnemonic Shards that anchor the spell with extraordinary precision. The cost is rigidity. An Arcanoneer cannot improvise. Every spell must be prepared, structured, and filed before it can be cast. Within that prepared repertoire they are absolutely devastating. Outside it, they\'re nearly helpless.',
 relatedTerms: ['bryngloom-forest', 'neth', 'valerius']
  },
  'augur': {
 nativeWeaving: `**Ecological.** Nordhalla's glacier-preserved dead keep the ancestral evidence legible for centuries, entrail-reading works nowhere else. **Cultural.** The saga-culture's glacier-entombment ancestor-veneration is the literal practice the art refines. **Founder.** Cassia, a Skald star-watcher, read the Deepening in a sacrificed elk at the Frozen Archive, a product of the pre-Deepening clockwork-genealogy culture. **Subrace-native.** Rune Keeper Skald and Astril; cultures without burial-preservation (Ordan, Merryn) cannot maintain the connection.`,

 id: 'augur',
 term: 'Augur',
 type: 'class',
 region: 'nordhalla',
 summary: 'A death-touched seer who reads the future in the entrails of the present, trading years of their own lifespan for visions.',
 fullEntry: 'At the Binding, Cassia read the Deepening\'s hour in the entrails of a glacier-elk at the Frozen Archive, and the Augur tradition grew from that reading in the glacier-tombs of Nordhalla, where the dead stand upright in the ice as permanent witnesses. The first Augurs found that standing close to the preserved dead brought a resonance: flashes of the deceased\'s final visions, caught at the edge of death. They learned to court it deliberately, burning their own life-years to pull usable foresight from what the dead had seen last. An Augur sees probabilities, not certainties. They\'ll tell you which path has fewer corpses, not which path has none.',
 relatedTerms: ['frozen_archive', 'house_skalvyr', 'nordhalla']
  },
  'berserker': {
 nativeWeaving: `**Ecological.** Blood-Heat is the body's last-ditch survival protocol weaponized against two extremities, Nordhalla's starvation-cold and Sundale's forge-heat. **Cultural.** The Hunger Pact (consuming the dead) is the deepest scar of the Skald saga-culture; the Thrask reframe is forge-cult. **Founder.** Grum ignited in Sundale's caldera, but the Bloodhammer line marched from Nordhalla's Glacier Bargain starvation. **Subrace-native.** Skald (Hunger-Pact ancestry), Thrask (geothermal resonance), Morgh Groven (Vat-Overclock), each subrace's biology is a different Heat source.`,

 id: 'berserker',
 term: 'Berserker',
 type: 'class',
 region: 'nordhalla',
 secondaryRegions: ['sundale'],
 summary: 'A warrior of dual heritage, Skald ancestry from Nordhalla and the volcanic founding of Grum Bloodhammer in Sundale, who ignites their Blood-Heat to overdrive their physiology, trading control for catastrophic, self-burning strength.',
 fullEntry: 'The Berserker carries two regions in their blood and one terrible inheritance. The Hunger Pact was forged in Nordhalla during the worst winter of the Glacier Bargain, when the ancestors of the Bloodhammer line consumed their own fallen so the bloodline could persist, and that act entered their marrow. The Blood-Heat itself was born in Sundale, when the Bloodhammer clans migrated south under Torra Bloodhammer into the volcanic tunnels of Emberspire and the smith Grum surrendered to the forge\'s heat to shatter an ice-wyrm bare-handed. Nordhalla gave the Berserker its ancestry. Sundale gave it its fire.\n\nBerserkers don\'t resist pain. They use it as fuel. The Blood-Heat tracks their thermal pressure as it builds from wounds and exertion: at low heat, fast and strong; at high heat, apocalyptic but self-damaging; at Metabolic Burnout, they collapse in systemic shock. The tradition trains in the Harath-Vault arenas of Sundale and pilgrimages to the Forge of Grum beneath Emberspire, while the Skald elders of the Frozen Archive still claim the right to decide who may carry the Pact.',
 relatedTerms: ['blood_heat', 'grum', 'harath_vault', 'nordhalla', 'sundale']
  },
  'shaper': {
 nativeWeaving: `**Ecological.** Form-shifting requires biology that can reshape, Mimir crystalline skin and Groven calcifiable bone, evolved in the Frostwood mists and Cragjaw vats. **Cultural.** Sylvanus's kinetic momentum dance (Frostwood fae-grove movement) fused with Torin's biological adaptation (Cragjaw alchemical body-work). **Founder.** Veyra the Mimir chronicler merged both, a product of the Frostwood grove-culture and Cragjaw Vat-Breakers Strata. **Subrace-native.** Mist-Woven Mimir and Morgh Groven only; Humans, Emberth, Neth, and Myrathil biologically cannot hold a shape.`,

 id: 'shaper',
 term: 'Shaper',
 type: 'class',
 region: 'frostwood-reach',
 secondaryRegions: ['cragjaw-peaks'],
 summary: 'A master of kinetic biology of dual origin, the Frostwood Reach momentum dance (Sylvanus) fused with the Frostmaw Holdfast biological body-sculpting (Torin) by the Mimir chronicler Veyra, who treats their body as a malleable weapon.',
 fullEntry: 'The Shaper tradition was born when the Mimir chronicler Veyra proved two regional arts were one dance seen from two angles. In the Frostwood Reach, the kinetic momentum dance was born among the ironwood canopy: a hyper-accelerated combat art of wind-synced striking. In the Cragjaw Peaks, the biological body-sculpting art arose at Frostmaw Holdfast, where practitioners drank raw alchemical sulfur-clay to calcify and reshape their own skeletons. Veyra fused them centuries into the Dimming, proving that momentum shapes form and form directs momentum. A Shaper navigates six Shaping Forms that blend kinetic stances with physical adaptation, building Kinetic Flux through combat and accumulating Body Toll from every transformation. The tradition is taught at the Shaping Hall in Frostmaw Holdfast and in the deep ironwood groves of the Frostwood Reach. The price is absolute: every shift erodes identity, calcifies skin, and frays the nervous system. The dance is killing them. They can\'t stop.',
 relatedTerms: ['bladedancer', 'cragjaw-peaks', 'formbender', 'frostmaw_holdfast', 'frostwood-reach', 'groven', 'mimir', 'veyra', 'sylvanus', 'torin']
  },
  'bladedancer': {
 id: 'bladedancer',
 term: 'Bladedancer',
 type: 'concept',
 region: 'frostwood-reach',
 summary: 'A dead Frostwood tradition whose kinetic momentum dance survives only inside the Shaper class.',
 fullEntry: 'For centuries, the Bladedancers of the Frostwood Reach drilled a hyper-accelerated momentum dance on mossed-over ironwood platforms beneath the canopy. They synchronized their strikes with wind-swept branches, weaving kinetic form into blade-work so fast the fog could not keep up. The tradition was old. The fog that ate memories could not eat motion.\n\nThen the Formbenders of Frostmaw Holdfast proved their biological body-sculpting was the same art seen from another angle: momentum shaping form, form directing momentum. The two were merged into the Shaper class. The last Bladedancer master walked into the Shaping Hall at Frostmaw and never came back.\n\nNow the only place to learn the momentum dance is inside a Shaper\'s training. Former Bladedancers who refused the merger drill their old forms alone, or in mercenary bands, or in Mimir canopy-defense. They are respected, dying out, and unable to match a converging Shaper in a fight.\n\nPick up a Shaper\'s blade and you carry two traditions in one hand. The Old Dance-Floor is still mossed over in the deep Frostwood, and purist Shapers still pilgrimage there to drill the single-tradition forms that started everything.',
 transition: {
 aftermath: `The last formal Bladedancer dojo in the <LoreLink termId="frostwood-reach">Frostwood Reach</LoreLink> closed sixty years ago; its master walked into the Shaping Hall at <LoreLink termId="frostmaw_holdfast">Frostmaw</LoreLink> and never returned. Former Bladedancers who refused the merge were absorbed into Mimir canopy-defense or faded into mercenary work.`,
 legacySite: `The Old Dance-Floor, a mossed-over ironwood platform in the deep Frostwood where the kinetic forms were once drilled, is now a pilgrimage site for purist Shapers who practice single-tradition momentum work.`,
 survivorNote: `A handful of elderly "pure-dancers" still refuse biological adaptation, arguing the merged art dilutes the momentum discipline. They are respected, dying out, and cannot match a converging Shaper in combat.`
    },
 relatedTerms: ['frostwood-reach', 'shaper']
  },
  'harbinger': {
 nativeWeaving: `**Ecological.** Entropy-reading arises in cultures that have waited for extinction long enough to weaponize it, Nordhalla's glacier-stasis and the Sundrift's darkened sky. **Cultural.** Skald doom-saga crossed with Ordan steppe-nihilism. **Founder.** Xyris tore reality in the Sundrift and Malakor calculated the doom-arithmetic in Nordhalla, products of the Glacier Bargain and the Ordavan migration-bargain. **Subrace-native.** Sylen Astril, Solvarn, Rune Keeper Skald, Ord, the cultures proximate to entropy.`,

 id: 'harbinger',
 term: 'Harbinger',
 type: 'class',
 region: 'nordhalla',
 secondaryRegions: ['sundrift-vale'],
 summary: 'An entropy prophet of dual origin, Xyris\'s reality-tearing in the Sundrift Vale and Malakor\'s doom-arithmetic in Nordhalla, who channels entropic friction and prophetic certainty into living bomb prophecies.',
 fullEntry: 'The Harbinger was forged in two regions that share one conviction: the world is ending, and the ending can be wielded. In the Sundrift Vale, the nomad Xyris spliced temporal friction into her veins and tore a hole in reality, and the hole killed her. In Nordhalla, the archivist Malakor did the colder work, calculating the arithmetic of doom, working out exactly when Xyris\'s holes would consume everything. The Harbinger tradition is their merger: the chaos-weaver\'s surrender to the Wyrd joined to the doomsayer\'s certainty.\n\nA Harbinger doesn\'t simply predict doom. They orchestrate it, channeling entropic friction through prophetic visions into living bomb prophecies that detonate across the battlefield. Their Mayhem pressure gauge amplifies every spell as it rises, a self-reinforcing cycle of chaos that can only be released through catastrophic Wild Surges. The arithmetic is honed in the Frozen Archive of Nordhalla. The chaos-work is field-tested in the permanent Chaos Pockets stabilizing across the Sundrift Vale.',
 relatedTerms: ['frozen_archive', 'house_skalvyr', 'nordhalla', 'sundrift-vale', 'xyris', 'malakor']
  },
  'chronarch': {
 nativeWeaving: `**Ecological.** Time-stitching requires the volcanic-glass, gear-craft, and bone-knowledge found only in Cragjaw's vertical engineering tunnels. **Cultural.** Groven knot-record-keeping crossed with Fexric time-suspension folklore. **Founder.** Nesta, a Kethrin engineer, built the engine at Frostmaw during the War of Thousand Screams, a product of the Vat-Breakers' deep-alchemical legacy. **Subrace-native.** Kethrin Fexric and Ithran Groven only; outsiders have never learned the technique.`,

 id: 'chronarch',
 term: 'Chronarch',
 type: 'class',
 region: 'cragjaw-peaks',
 summary: 'A time-manipulator who unravels small loops of causality to reverse, delay, or accelerate moments, at the cost of temporal echoes.',
 fullEntry: 'During the War of Thousand Screams, a Kethrin engineer named Nesta built a time-dilation engine at Frostmaw, and the Chronarch tradition came out of that engine. It is the most demanding craft in the known world: a Chronarch must hold in mind not just what is, but what was and what could be, all at once. The eternal blizzard of the Cragjaw Peaks created pockets of temporal suspension, and Nesta\'s engine learned to pull at them. A Chronarch doesn\'t travel through time. They stitch it, pulling a thread of the past forward or pushing a thread of the present back by seconds or minutes. Each stitch leaves a temporal echo, a ghost-impression of the unraveled moment that lingers and sometimes acts on its own.',
 relatedTerms: ['cragjaw-peaks', 'house_tesshan']
  },
  'inquisitor': {
 nativeWeaving: `**Ecological.** Anti-Wyrd hunting requires dense supernatural exposure, the Bryngloom's Root-Veil and the Frostwood's face-trading Wyrd. **Cultural.** Vreken bog-sainthood meets Briaran fae-resistance. **Founder.** Orven forged the cold-iron blade in the Bryngloom and Elias opened his veins to bait face-stealers in the Frostwood, products of both regions' Deep Strata. **Subrace-native.** Marked Vreken, Thalren, Unwoven Mimir, the peoples with direct Wyrd-exposure density.`,

 id: 'inquisitor',
 term: 'Inquisitor',
 type: 'class',
 region: 'bryngloom-forest',
 secondaryRegions: ['frostwood-reach'],
 summary: 'A witch-hunter of dual root, Orven\'s cold-iron Vreken tradition in the Bryngloom and Elias the Salt-Scarred\'s anti-Wyrd Thalren tradition in the Frostwood Reach, who severs magical bindings and commands bound fiends.',
 fullEntry: 'The Inquisitor has two roots in two regions, both born from the same necessity: policing the supernatural when it turns predatory. In the Bryngloom Forest, Orven the Still-Handed forged the first cold-iron blade and swore the Barbed Vow to hunt corrupted Vreken whose ancestral spirit-bonds had gone rogue, and Drun Neth whose silence-sealed contracts defied conventional magic. In the Frostwood Reach, Elias the Salt-Scarred opened his own veins to draw the Wyrd\'s face-stealing horrors, the Gref and the Gambrel, into living flesh where they could be named and cut. The two traditions merged when the supernatural incursion rate tripled and neither regional order could contain it alone.\n\nAn Inquisitor specializes in identifying, disrupting, and severing magical contracts. They aren\'t magic-resistant by nature; they are magic-literate in the way a surgeon is anatomy-literate. The tradition also encompasses the binding and commanding of fiends through sacred dominance ritual. The Bryngloom order is seated at the Sunken Spire. The Frostwood order operates out of Greymark Keep. The two stay in contact through a chain of border-shrines.',
 relatedTerms: ['bryngloom-forest', 'covenbane', 'elias', 'exorcist', 'frostwood-reach', 'greymark_keep', 'neth', 'sunken_spire', 'vreken', 'orven']
  },
  'revenant': {
 nativeWeaving: `**Ecological.** Undeath-as-obligation requires the bog-preservation and mycelial Root-Veil that keep the Bryngloom dead "available" rather than gone. **Cultural.** Vreken-Neth reincarnation-contract law; the Postmortem Corvée treats death as a renegotiated clause. **Founder.** Kora's blood-covenant and Vesper's frost-stasis phylactery, both products of the First Contract Stratum. **Subrace-native.** Clean Vreken, Drun Neth, Morren, the peoples whose cultures accept undeath as continuation of obligation.`,

 id: 'revenant',
 term: 'Revenant',
 type: 'class',
 region: 'bryngloom-forest',
 summary: 'A death caster who has returned from the grave, combining blood-magic sacrifice (Kora\'s covenant) with frost-stasis harvest (Vesper\'s phylactery) into a unified economy of death.',
 fullEntry: 'In the later centuries of the Dimming, the bog-graves of the Bryngloom began waking on their own, and two death-magic schools recognized they\'d been fighting the same war. Kora the Veil-Speaker had sacrificed her own life-force to keep the ancestral lights burning, and the curse for it was hearing the dead scream. Vesper the Scribe had bound his soul to a basalt phylactery and negotiated perpetual dying to escape the lung-rot of the sumps. Their traditions merged into the Revenant: a caster who carries both a volatile Death Toll of blood-derived necrotic energy and a kill-charged Phylactery for frost-stasis resurrection, toggling between Rest Mode and Death Shroud to burn their own HP for devastating power.',
 relatedTerms: ['bryngloom-forest', 'deathcaller', 'kora', 'lichborne', 'neth', 'vesper', 'vreken']
  },
  // 'deathcaller' and 'lichborne' merged into Revenant as Phase 1.10 consolidation
  'deathcaller': {
 id: 'deathcaller',
 term: 'Deathcaller',
 type: 'concept',
 region: 'bryngloom-forest',
 summary: 'A dead Bryngloom blood-magic art that fed the caster\'s life-force to luminous ancestors. Lives on only inside the Revenant class.',
 fullEntry: 'In the deep peat-bogs of the Bryngloom Forest, Kora the Veil-Speaker taught her covenant to feed their own blood to the ancestral lights. The dead rewarded them with luminous counsel and volatile Blood Tokens that could be spent on necrotic workings. It cost them their health. Kora could hear the dead screaming. By the end, she could hear little else.\n\nWhen Vesper the Scribe fused his basalt phylactery to the same bargain, the two traditions recognized they were fighting the same war. They merged into the Revenant class. The last pure Deathcaller covenant dissolved when its senior member could no longer hear the ancestors over the merged chorus.\n\nFormer Deathcallers who refused the merger were absorbed into Vreken ancestral-rite roles, or driven into the Over-Shanty as unlicensed blood-workers. The Veil-Speaker Shrine in the deep peat still marks where Kora first fed the lights, and Revenants of the blood-covenant inclination still make offerings there before major workings.\n\nIf you walk the Revenant\'s path, you carry Kora\'s blood-debt and Vesper\'s frost-chain both. A few blood-purists still run a hotter Death Toll and refuse the Death Shroud, burning out faster but hitting harder. The choice is yours.',
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
 summary: 'A dead Cragjaw tradition of steam-powered iron juggernauts. The Groven furnace-armor guilds still stamp the old sigil on every plate of Ironclad Martyr-issue.',
 fullEntry: 'In the vertical warrens of the Cragjaw Peaks, Groven troll-kin welded heating pipes to their own bodies and sealed themselves in iron plate to fight the Skreika. They became steam-powered juggernauts: slow, furnace-hot, and impossible to move from a corridor once they anchored. The Dreadnaughts held the deep tunnels when nothing else could.\n\nThe tradition did not die. It re-licensed. The old Dreadnaught foundries at Frostmaw now produce Ironclad plate under Steam-Line Cartel contracts, and the senior Dreadnaught smiths became the first Ironclad instructors. What was once a Groven defense-rite is now a specialization of the Martyr class, the furnace-bound path where penitents combine willing sacrifice with combustion-engine mechanics.\n\nA few elder pure-furnace Groven insist the Martyr theology corrupts the engineering. They run their boilers cold, without the Devotion Gauge, and there are fewer of them every winter. The Old Foundry beneath Frostmaw still stamps the Dreadnaught sigil, a pipe-crossed fist, onto every plate of Ironclad-issue as a maker-mark. It is the only public acknowledgment that the original tradition ever existed.\n\nWalk the Ironclad path and you wear a hundred years of Groven engineering on your back. The boiler still answers the old commands. The furnace still hungers.',
 transition: {
 aftermath: `The <LoreLink termId="groven">Groven</LoreLink> furnace-armor guilds did not dissolve, they re-licensed. The old Dreadnaught foundries at <LoreLink termId="frostmaw_holdfast">Frostmaw</LoreLink> now produce Ironclad plate under Steam-Line Cartel contracts, and the senior Dreadnaught smiths became the first Ironclad instructors.`,
 legacySite: `The Old Foundry beneath Frostmaw still stamps the Dreadnaught sigil (a pipe-crossed fist) onto Ironclad plate as a maker-mark, the only surviving public acknowledgment of the original tradition.`,
 survivorNote: `Elder "pure-furnace" Groven insist the Martyr theology corrupts the engineering; they maintain the original combustion-mechanics without the Devotion Gauge, running their boilers cold. They are fewer each winter.`
    },
 relatedTerms: ['cragjaw-peaks', 'groven', 'martyr']
  },
  // 'exorcist' removed (merged with Covenbane into 'inquisitor', see above)
  // 'exorcist' and 'covenbane' merged into Inquisitor as Phase 1.9 consolidation
  'exorcist': {
 id: 'exorcist',
 term: 'Exorcist',
 type: 'concept',
 region: 'bryngloom-forest',
 summary: 'A dead Bryngloom purification art. Its cleansing rites survive only as the defensive half of the Inquisitor\'s curriculum.',
 fullEntry: 'The density of Neth contract-magic and Vreken spirit-bonds in the Bryngloom made the Exorcist tradition necessary. Practitioners codified cleansing rites to dispel the supernatural disruptions that bled out of corrupted contracts and rogue ancestral bonds. Their fonts ran with clean water. Their chants could unmake a haunting.\n\nWhen the supernatural incursion rate tripled, the Exorcists merged with the Covenbane witch-hunters into the Inquisitor class. The purification rites were not lost. They became the defensive half of the Inquisitor curriculum. The Cleansing Chapels of the mid-Bryngloom, where the Exorcist canon was first written, still serve as Inquisitor chapterhouses, and their old fonts are still in daily use.\n\nExorcists who could not swear the Inquisitor\'s Barbed Vow retreated into temple-priest roles or went itinerant. The Hedge-Cleansers walk village to village, performing attenuated rites for settlements too small to attract a full Inquisitor. The order tolerates them as rural first-responders and quietly resents them as unlicensed practitioners.\n\nTake up the Inquisitor\'s cold-iron blade and you inherit the Exorcist\'s font as well as the Covenbane\'s cage. The water still remembers how to be clean.',
 transition: {
 aftermath: `The Exorcist purification rites were not lost, they became the defensive half of the Inquisitor curriculum. Former Exorcists who could not swear the Barbed Vow retreated into temple-priest roles or became Hedge-Cleansers, itinerant ritual-workers for villages too small to attract a full Inquisitor.`,
 legacySite: `The Cleansing Chapels of the mid-Bryngloom, where Exorcist rites were codified, now serve as Inquisitor chapterhouses; the old purification fonts are still in daily use.`,
 survivorNote: `Hedge-Cleansers preserve the pure Exorcist art in attenuated form; they are tolerated by the Inquisitors as rural first-responders and quietly resented as unlicensed practitioners.`
    },
 relatedTerms: ['bryngloom-forest', 'covenbane', 'inquisitor']
  },
  'covenbane': {
 id: 'covenbane',
 term: 'Covenbane',
 type: 'concept',
 region: 'bryngloom-forest',
 summary: 'A dead Bryngloom witch-hunting order. Its cold-iron blade and Barbed Vow are the martial spine of the modern Inquisitor.',
 fullEntry: 'Rogue Neth contracts, corrupted Vreken ancestral bonds, and unbound fiends kept the Covenbane order in business for generations. They formed to identify, hunt, and neutralize the supernatural threats that the Bryngloom\'s dense magical substrate kept producing. The Covenbane forged the first cold-iron blade and swore the Barbed Vow, the hunter\'s promise that no contracted horror would walk free while a Covenbane still drew breath.\n\nWhen the incursion rate overwhelmed either regional order alone, the Covenbane merged with the Exorcist purification art into the Inquisitor class. The merger was total. The Covenbane\'s martial structure became the Inquisitor chain-of-command. The Covenbane Stronghold in the eastern Bryngloom now serves as the regional Inquisitor seat, and its hanging-cages, once for bound witches awaiting trial, are preserved as grim heritage.\n\nA Covenbane purist is a contradiction in terms. The order defined itself by its willingness to adopt any new anti-supernatural technique that worked, and the Inquisitor is the working continuation of that willingness.\n\nSwear the Barbed Vow and you carry every cold-iron blade the Covenbane ever forged. The cages still hang. The blade still cuts.',
 transition: {
 aftermath: `The Covenbane order was the more martial of the two roots, and its membership transitioned most cleanly into the Inquisitor, the cold-iron blade and the Barbed Vow are Covenbane inheritances. The order's formal structure became the Inquisitor chain-of-command.`,
 legacySite: `The Covenbane Stronghold in the eastern <LoreLink termId="bryngloom-forest">Bryngloom</LoreLink> is now the regional Inquisitor seat; its hanging-cages (once for bound witches awaiting trial) are preserved as grim heritage.`,
 survivorNote: `None meaningful, the Covenbane did not survive as a distinct identity. The merger was total; a "Covenbane purist" is a contradiction, since the order defined itself by its willingness to adopt new anti-supernatural techniques.`
    },
 relatedTerms: ['bryngloom-forest', 'exorcist', 'inquisitor']
  },
  'false_prophet': {
 nativeWeaving: `**Ecological.** Manufactured meaning arises on a steppe where the sky went dark and the herds must move forever, desperation cosmology. **Cultural.** Ordan steppe-shamanism weaponized into nihilist gospel; the silent ancestral mounds. **Founder.** Li Wei, an Ordan herd-watcher, followed a meteor into a Sundered Monolith crater, a product of the Ordavan migration-bargain and the Silence Between Stars. **Subrace-native.** Ordan, Unlit Astril, Morren, the desperate and the constellationless.`,

 id: 'false_prophet',
 term: 'False Prophet',
 type: 'class',
 region: 'sundrift-vale',
 summary: 'A manipulator who weaponizes faith, creating and exploiting constructed belief systems to accumulate political power and sacred-adjacent ability.',
 fullEntry: 'Li Wei followed a meteor into a Sundered Monolith crater in the most recent centuries and witnessed what he called the Silence Between Stars. The False Prophet tradition came out of that witness, but the False Prophet does not believe their own gospel. They understand that belief itself is a resource: a people who believe something with sufficient intensity generate a spiritual resonance that can be harvested. The tradition took root in the Sundrift Vale, where the starless sky and the nomadic migrations created a desperate demand for meaning. A False Prophet engineers that meaning with the cold precision of an architect. They aren\'t necessarily malicious. Some build their constructed faiths to protect people, knowing the lie is more useful than the truth. The power comes from the congregation, not the prophet.',
 relatedTerms: ['astril', 'sundrift-vale', 'synod_hold']
  },
  'gambit': {
 nativeWeaving: `**Ecological.** Risk-calculation arises in maritime-debt and vertical-toll economies where every survival is a wager. **Cultural.** Merryn sea-omen gambling, Groven knot-probability, and Neth clause-reading. **Founder.** Jax wagered his lifeline against a storm-spirit at Merrowport and Lyra wove probability-webs in the Bryngloom, products of the Mereval storm-bargain and the First Contract. **Subrace-native.** Merryn, Breakers-Born Myrathil, Kessen Neth, Ithran Groven, the risk-cultures.`,

 id: 'gambit',
 term: 'Gambit',
 type: 'class',
 region: 'cragjaw-peaks',
 secondaryRegions: ['iceheart-sea', 'bryngloom-forest'],
 summary: 'A probability-manipulator of tri-regional origin, Jax\'s sea-omen gambling on the Iceheart Sea and Lyra\'s Kessen Neth probability-web reading in the Bryngloom, refined in the toll-negotiations of the Cragjaw Peaks.',
 fullEntry: 'The Gambit tradition was born twice, in two regions, and refined in a third. On the Iceheart Sea, the Merryn pirate Jax wagered his lifeline against a storm-spirit at Merrowport, winning the wind but losing his blood\'s warmth, and proving that probability itself could be staked and won. In the Bryngloom Forest, the Kessen Neth probability-weaver Lyra read the threads of consequence through rune-etched cards, plucking the single timeline in which her caravan survived, at the cost of fracturing her consciousness. The two traditions recognized each other when Lyra\'s caravan crossed the Ancestor-Spans into the Cragjaw Peaks, where the high-stakes toll-negotiations refined both arts into the modern Gambit.\n\nA Gambit doesn\'t control fate. They nudge it, the power of compound interest: small adjustments made early that accumulate into dramatically different outcomes. They win battles before they start by ensuring the terrain, weather, and morale are all marginally more favorable. The sea-work is headquartered at the Last Table in Merrowport. The contract-work is at Ironjaw Port. The toll-craft is among the Groven bridge-keepers of the Cragjaw.',
 relatedTerms: ['bryngloom-forest', 'cragjaw-peaks', 'iceheart-sea', 'ironjaw_port', 'merrowport', 'neth', 'jax', 'lyra']
  },
  'formbender': {
 id: 'formbender',
 term: 'Formbender',
 type: 'concept',
 region: 'cragjaw-peaks',
 summary: 'A dead Frostmaw body-sculpting art. Its calcifying vats still train Shaper initiates before they ever learn the momentum dance.',
 fullEntry: 'In the deep laboratories of Frostmaw Holdfast, practitioners learned to drink raw alchemical sulfur-clay and force their own skeletons to calcify and reshape. The Formbender tradition turned biology into a weapon: bone-density on command, limb-extension for tool-use, skin that hardened to stone-scale. The art was old Deep Alchemist heritage turned inward.\n\nWhen the Mimir chronicler Veyra proved that Formbender body-sculpting and the Bladedancer momentum dance were one art seen from two angles, the two were merged into the Shaper class. The Frostmaw biological-sculpting studios did not close. They became the biological half of the Shaping Hall, where Shaper initiates still learn the calcifying forms before they ever touch a blade.\n\nFormbenders who rejected the kinetic merge continued as body-sculptors, doing Groven civil engineering and medical bone-work. A faction of bone-purists still practices the art without kinetic integration. They are the biological-sculptors who keep the Ancestor-Spans repaired.\n\nChoose the Shaper\'s path and you inherit the Calcifying Vats of Frostmaw before you ever learn the dance. Your bones are the first weapon you forge.',
 transition: {
 aftermath: `The Frostmaw biological-sculpting studios did not close, they became the biological half of the Shaping Hall. Former Formbenders who rejected the kinetic merge continued as body-sculptors for Groven construction and medical bone-work.`,
 legacySite: `The Calcifying Vats of <LoreLink termId="frostmaw_holdfast">Frostmaw</LoreLink> (re-purposed from the old <LoreLink termId="deep_alchemists">Deep Alchemist</LoreLink> heritage) are where Formbender techniques are still taught in isolation to Shaper initiates before they learn the momentum dance.`,
 survivorNote: `A faction of "bone-purists" practices Formbender arts without kinetic integration, serving as Groven civil engineers and healers. They are the biological-sculptors who keep the Ancestor-Spans repaired.`
    },
 relatedTerms: ['frostmaw_holdfast', 'groven', 'shaper']
  },
  'apex': {
 nativeWeaving: `**Biological.** The Apex art predates external magic entirely, it is pure physiology, anatomy, and sensory refinement. **Cultural.** Thalren tracker lore, Mimir silent-hunt traditions, and the clinical precision of canopy-martial discipline. **Founder.** Sylas, a Mimir tracker who traded his hearing for vibration-sense and built the Silent Hunt on the principle of sensory sacrifice. **Subrace-native.** Maskborne Mimir, Mistwoven Mimir, Unwoven Mimir, Skald, Clean Vreken, Marked Vreken, Ordan.`,

 id: 'apex',
 type: 'class',
 region: 'frostwood-reach',
 term: 'Apex',
 aliases: [],
 summary: 'The oldest tradition in the Frostwood Reach, a predator\'s art older than the fog, rooted in hunting blind through mist-choked timber with anatomical precision and sensory sacrifice.',
 fullEntry: 'The Apex tradition is older than any noble house in the Frostwood Reach. It predates the fog and the bargains, rooted in the one necessity the early foresters could not avoid: hunting blind through mist-choked timber. Sylas formalized the Silent Hunt in the years before the Breach, trading his hearing for vibration-sense until he could feel a heartbeat through the moss. An Apex doesn\'t fight in any conventional sense. They identify, track, position, and resolve targets with the minimum force required, and every debilitating strike finds a specific nerve cluster, joint, or blood vessel. They are not warriors. They are problems solved.',
 relatedTerms: ['frostwood-reach', 'mimir', 'sylas', 'ironwood_heart']
  },
  'animist': {
 nativeWeaving: `**Ecological.** Ancestral spirit-channeling requires three biomes, steppe totemic communion, bog spore-inhalation, glacier runic inscription, hence three roots. **Cultural.** Ordan throat-song, Vreken bog-spirit communion, and Skald runic ancestor-veneration. **Founder.** Kael (Ordan), Nyssa (Vreken), and Theron (Skald) each pioneered a root, each a product of their region's Deep Stratum. **Subrace-native.** Ordan, Sylen Astril, Clean Vreken, Morren, Rune Keeper Skald, Velun Neth.`,

 id: 'animist',
 term: 'Animist',
 type: 'class',
 region: 'bryngloom-forest',
 secondaryRegions: ['sundrift-vale', 'nordhalla'],
 summary: 'A spirit-channeler of tri-regional origin, three independent discoveries fused: Kael\'s totemic communion (Sundrift Vale), Nyssa\'s spore-inhalation (Bryngloom), and Theron\'s runic inscription (Nordhalla).',
 fullEntry: 'The Animist tradition is not one art but three, fused at a crossroads by carriers who recognized each other\'s scars. In the Sundrift Vale, the Ordan totem-singer Kael discovered ancestral communion through bone-eruption, the spirit called through a totem woven from the migration-horse\'s mane. In the Bryngloom Forest, the Vreken spore-elder Nyssa inhaled the spirits on bioluminescent spores, the dead speaking through shifting glow on her skin. In Nordhalla, the Skald rune-carver Theron inscribed his ancestors\' names into his own skin at the Frozen Archive, the rune itself becoming the house of the dead. The three merged when their carriers met and realized they spoke dialects of a single ancestral language.\n\nAn Animist doesn\'t summon spirits. They open channels that already exist, drawing power from negotiated bonds with ancestral lineages, spirit courts, and the memory-echoes embedded in the land. Where others see death as an ending, an Animist sees a change of state. The Convergence rotates its seat between the three regions and keeps its archive-records at the Frozen Archive.',
 relatedTerms: ['bryngloom-forest', 'frozen_archive', 'neth', 'nordhalla', 'sundrift-vale', 'vreken', 'kael', 'nyssa', 'theron']
  },
  // 'lichborne' merged into Revenant as Phase 1.10 consolidation
  'lichborne': {
 id: 'lichborne',
 term: 'Lichborne',
 type: 'concept',
 region: 'bryngloom-forest',
 summary: 'A dead Bryngloom undeath art. Vesper\'s basalt phylactery still pulses in the Cold Hearth once an hour.',
 fullEntry: 'Vesper the Scribe bound his soul to a basalt phylactery in the deep peat-bogs of the Bryngloom Forest to escape the lung-rot of the sumps. He called the result perpetual dying. His followers, the Lichborne, achieved a cold undeath in exchange for cold flesh and constant life-force harvesting.\n\nWhen the bog-graves began waking on their own, the Lichborne recognized their war was the same as Kora\'s Deathcaller covenant. The two traditions merged into the Revenant class. Lichborne who refused the blood-covenant merge retreated into deep peat-bog hermitage. A few cold-purists still maintain solitary phylacteries in the deep sumps, refusing the volatile Death Toll in favor of slow, cold unlife.\n\nVesper\'s own basalt stone is enshrined in the Cold Hearth and still pulses once per hour. Revenants of the frost-stasis inclination touch it before long operations. The cold-purists run colder and slower than merged Revenants, with less burst power but dramatically longer unlife. Several have been in continuous frost-stasis since before the merger and remember the Bryngloom before the Root-Veil began rejecting the Marked.\n\nWalk the Revenant\'s road and you carry Vesper\'s stone and Kora\'s blood in the same chest. The pulse still keeps time.',
 transition: {
 aftermath: `<LoreLink termId="vesper">Vesper</LoreLink>'s frost-stasis practitioners who refused the blood-covenant merge retreated into deep peat-bog hermitage; a few "cold-purists" still maintain solitary phylacteries in the deep sumps, refusing the volatile Death Toll in favor of slow, cold undeath.`,
 legacySite: `Vesper's Basalt-Phylactery (the founder's own stone) is enshrined in the Cold Hearth and still pulses once per hour; Revenants of the frost-stasis inclination touch it before long operations.`,
 survivorNote: `The cold-purists run colder and slower than merged Revenants, less burst power, but dramatically longer unlife. Several have been in continuous frost-stasis since before the merger and remember the Bryngloom before the Root-Veil began rejecting the Marked.`
    },
 relatedTerms: ['bryngloom-forest', 'neth', 'revenant', 'vreken']
  },
  'lunarch': {
 nativeWeaving: `**Ecological.** The lunar parasite requires the Frostwood's moonlit groves where the insulating fog thins and fae old-law still holds. **Cultural.** Briaran fae-pacts and the Viridane refusal bloodline. **Founder.** Selene of House Viridane bound the parasite, a direct product of the Refusal and the Silent Seventh Stratum. **Subrace-native.** Briaran (Viridane blood) and Mimir (fetch-bond compatibility); non-Briaran may be chosen but the bloodline is native.`,

 id: 'lunarch',
 term: 'Lunarch',
 type: 'class',
 region: 'frostwood-reach',
 summary: 'A silence-touched mage who draws power from the absent sky, channeling the dark between the stars that Sol\'s absence left exposed.',
 fullEntry: 'Selene of House Viridane bargained with the wildwood fae in the moonlit groves where the Frostwood fog thins, and the Lunarch tradition came out of that bargain in the first centuries of the Dimming. The canopy she walked was fog-shrouded and starless, a place where sunlight never reached even before the Deepening. But Sol\'s absence hadn\'t left the sky empty. It had left the sky exposed to whatever lay beyond Sol: the cold, vast dark between stars that Keth-Amar itself travels through. Lunarchs learned to channel that ambient silence-light, which is not darkness but the specific quality of space that darkness reveals. Their power is strongest at night, in low light, in areas of high Wyrd-density, which is to say: most of the world.',
 relatedTerms: ['frostwood-reach', 'keth_amar', 'the_deepening']
  },
  'martyr': {
 nativeWeaving: `**Ecological.** Willing-suffering theology arises at Sol's tomb, where the volcanic theocracy demands sacrifice to feed the failing Solbrand. **Cultural.** Solbrand solar-sacrifice cosmology and the Solvan Heir-Purge. **Founder.** Sera Solvan carved her sacrificed child's name into her arm, a product of the ur-bargain (Sundale is the wound itself). **Subrace-native.** Solvarn (sun-vigil), Korr Emberth (Vault-Breath), Velun Neth (contract-martyrdom).`,

 id: 'martyr',
 term: 'Martyr',
 type: 'class',
 region: 'sundale',
 summary: 'A self-sacrificing healer and shield who absorbs the suffering of allies into their own body, converting it into protective power through the Devotion Gauge.',
 fullEntry: 'Sera Solvan carved her sacrificed child\'s name into her forearm with volcanic obsidian just after the Binding, and the wound glowed instead of healing. That scar became the first Martyr\'s mark. A Martyr doesn\'t protect allies by standing between them and danger. They absorb what reaches allies into themselves, metabolizing kinetic and magical damage into spiritual resonance tracked in the Devotion Gauge. At low Devotion, a Martyr is a walking wound. At high Devotion, they are a radiant engine of protection that makes the whole party harder to harm. The tradition selects heavily for those who find meaning in suffering.',
 relatedTerms: ['devotion_gauge', 'dreadnaught', 'house_solvan', 'sera', 'sundale']
  },
  'minstrel': {
 nativeWeaving: `**Ecological.** The tide-song requires a maritime culture whose perpetual-storm sea can be bargained with via performance. **Cultural.** Merryn sea-shanty and the ship-as-polity oral tradition. **Founder.** Lyris sang the gales calm at Merrowport, a product of the Mereval storm-bargain. **Subrace-native.** Merryn and Breakers-Born Myrathil; landlocked or vertical cultures lack the oral-maritime substrate.`,

 id: 'minstrel',
 term: 'Minstrel',
 type: 'class',
 region: 'iceheart-sea',
 summary: 'A sonic-resonance practitioner who weaponizes, heals with, and manipulates the world through structured sound and narrative.',
 fullEntry: 'Lyris sang the Iceheart calms at Merrowport in the first centuries of the Dimming, and the storm held while she sang. The Minstrel tradition grew from that discovery among the Merryn storm-sailors: certain rhythms synchronized the body\'s responses to waves and wind, enabling sustained effort that would otherwise exhaust a crew within hours. A Minstrel is not a bard. Their sound-work is precise, technical, and physically demanding. They accelerate healing, sharpen focus, disrupt coordination, or shatter stone at the correct resonant frequency. The tradition demands perfect pitch and the nerve to hold a complex rhythm while someone\'s trying to kill you.',
 relatedTerms: ['house_mereval', 'iceheart-sea', 'merrowport', 'skald']
  },
  'plaguebringer': {
 nativeWeaving: `**Ecological.** Disease-hosting requires the Bryngloom's unique fungal-bog substrate, the spore-hush and the bog-rot. **Cultural.** Vreken bog-plague sainthood. **Founder.** Vespera bonded with bog-rot to cure the spore-hush, a product of the First Contract and Root-Veil Stratum. **Subrace-native.** Drun Neth (partial-death allows hosting), Morren (desperation), Clean Vreken.`,

 id: 'plaguebringer',
 term: 'Plaguebringer',
 type: 'class',
 region: 'bryngloom-forest',
 summary: 'A biological-vector specialist who cultivates, directs, and weaponizes living disease with the precision of a mycologist.',
 fullEntry: 'Vespera bonded with bog-rot to cure the spore-hush in the later centuries of the Dimming, and the Plaguebringer tradition grew from what she learned weaponizing the Bryngloom\'s fungal substrate. The forest she worked in was alive in ways other regions weren\'t: bioluminescent mycelium connected the roots of every ironwood, and the bog-preserved dead occasionally reanimated with fungal intelligence rather than necromantic will. A Plaguebringer is not a chaos agent. They are a cultivator with very specific targets, engineering diseases for selective transmission, predictable progression, and controllable severity. The tradition demands deep biochemical knowledge and the kind of comfort with causing suffering that most medical traditions train specifically against.',
 relatedTerms: ['bryngloom-forest', 'neth', 'vreken']
  },
  'pyrofiend': {
 nativeWeaving: `**Ecological.** The fire-pact requires proximity to Scathrach's influence beneath Emberspire and a culture that frames self-destruction as power. **Cultural.** Solbrand volcanic forge-cult and solar-sacrifice. **Founder.** A cabal of Solvarn occultists swallowed Scathrach's coals beneath Emberspire, products of the ur-bargain's wound. **Subrace-native.** Thrask Emberth and Solvarn outcasts; cold-adapted cultures reject fire-pacts.`,

 id: 'pyrofiend',
 term: 'Pyrofiend',
 type: 'class',
 region: 'sundale',
 summary: 'A volcanic pact-mage who channels Scathrach\'s Wyrd-touched fire at the cost of their body being slowly remade into a cracking char-vessel of magma and bone.',
 fullEntry: 'When the first rebirth failed, seven Solvarn occultists swallowed Scathrach\'s coals in an obsidian cavern beneath Emberspire, and the Pyrofiend tradition was born in that fire. It is the most viscerally destructive craft in the known world and the shortest in average practitioner lifespan. Scathrach, the Ashen Sovereign nesting in Emberspire\'s deepest vent, answers desperation with uncontrollable combustion, and the Pyrofiend\'s art is making that combustion controllable enough to survive. The Inferno Veil tracks how much of that heat the practitioner channels; at high levels it burns the caster along with everything else. The body shifts from flesh to volcanic material, year by year, until the conversion completes and Scathrach claims what\'s left.',
 relatedTerms: ['cinderhoodoo', 'emberspire', 'emberspire_caldera', 'inferno_veil', 'scathrach', 'sundale']
  },
  'spellguard': {
 nativeWeaving: `**Ecological.** Magical-defense engineering requires the volcanic forge-tradition and the Solbrand's residual energy. **Cultural.** Forge-cult precision crossed with anti-Wyrd paranoia. **Founder.** Damon the Emberth smith blocked a solar flare with an alchemical tower shield during the entombment, a product of the Emberspire wound. **Subrace-native.** Velun Neth (magical cancellation), Thalren, Solvarn, Korr Emberth.`,

 id: 'spellguard',
 term: 'Spellguard',
 type: 'class',
 region: 'sundale',
 summary: 'A defensive combat-mage who specializes in identifying, neutralizing, and reflecting incoming magical threats, a living counterspell.',
 fullEntry: 'At the Binding, the Emberth smith Damon blocked a solar flare with an alchemical tower shield during Sol\'s entombment, and the Spellguard tradition grew from that shield in the forge-caldera keeps of Sundale. The smiths who worked near the Solbrand needed practitioners who could intercept and defuse the magical eruptions that bled from Sol\'s imprisoned resonance. A Spellguard doesn\'t cast offensive spells. They read the structure of incoming magic and dismantle it before it arrives, redirect it, or reshape it into something that serves a different purpose. They are the tradition that looks most like engineering and least like art.',
 relatedTerms: ['damon', 'emberth', 'solbrand', 'sundale']
  },
  'titan': {
 id: 'titan',
 term: 'Titan',
 type: 'concept',
 region: 'sundale',
 summary: 'A dead Sundale juggernaut art. The forge-clans\' calcified bone-density technique survives as the Warden\'s Monolith specialization.',
 fullEntry: 'The Sundale forge-clans bred their own answer to overwhelming force. Drawing on the geothermal resonance of the volcanic badlands, practitioners of the Titan tradition calcified their skeletons until they could anchor a corridor that nothing short of a glacier-wyrm could move them from. They were not fast. They did not need to be.\n\nThe tradition has been absorbed into the Warden class as the Monolith specialization. Wardens graft volcanic iron into their skeletons alongside their penitent jailer chains and become living stone sentinels. The old Titan strong-points along the Ashen Escarpment are now manned by Monolith Wardens. Sol\'s Anvil Mesa, where the calcification rites were first performed, remains the initiation site for the Monolith path: the geothermal resonance that enables bone-calcification is strongest there.\n\nA few pure-mass Titans keep the original art without the chain-graft, serving as immovable garrison-anchors in Sundale keeps. They cannot tether like a Warden, but they can hold a corridor that nothing short of a glacier-wyrm can move them from. Their numbers thin each generation.\n\nTake up the Warden\'s chains and choose the Monolith path, and the volcanic iron finds your bones. The Mesa remembers how to calcify. The corridor holds.',
 transition: {
 aftermath: `The Sundale Titan-juggernauts did not vanish, they became the Monolith specialization of the Warden, grafting volcanic iron into their skeletons alongside the jailer chains. The old Titan strong-points along the Ashen Escarpment are now manned by Monolith Wardens.`,
 legacySite: `Sol's Anvil Mesa, where the Titan calcification rites were first performed, remains the initiation site for the Monolith path; the geothermal resonance that enables bone-calcification is strongest there.`,
 survivorNote: `A few "pure-mass" Titans maintain the original art without the chain-graft, serving as immovable garrison-anchors in <LoreLink termId="sundale">Sundale</LoreLink> keeps. They cannot tether like a Warden but can hold a corridor that nothing short of a glacier-wyrm can move them from.`
    },
 relatedTerms: ['emberth', 'groven', 'sundale', 'the_warden', 'warden']
  },
  'toxicologist': {
 nativeWeaving: `**Ecological.** Venom-distillation requires reagents unique to the Frostwood's Wyrd-dense, fog-predator mists. **Cultural.** Thalren-Briaran forest-alchemy and the practical defense against face-traders. **Founder.** Varis the Thalren alchemist extracted fog-predator venom, a product of the Fog Compact's mutated substrate. **Subrace-native.** Thalren and Unwoven Mimir; the reagents do not exist outside the Frostwood.`,

 id: 'toxicologist',
 term: 'Toxicologist',
 type: 'class',
 region: 'frostwood-reach',
 summary: 'A poison-crafter and delivery specialist who fights through careful preparation rather than direct confrontation, the most premeditated tradition in Mythrill.',
 fullEntry: 'Varis the Trembling systematized venom extraction from the fog-predator reagents unique to the Frostwood Reach in the mid-Diming centuries, and the Toxicologist tradition grew in the fog-choked timber where those reagents lived. The dense undergrowth produced extraordinary pharmacological resources and the tactical conditions that made slow-acting, area-denial poisons more useful than swords. A Toxicologist isn\'t an assassin. They are a chemist, engineering poisons for specific physiological effects, specific target populations, and specific durations. The tradition demands extraordinary patience and the stomach for outcomes that unfold over hours rather than seconds.',
 relatedTerms: ['frostwood-reach', 'house_thalreth']
  },
  'warden': {
 nativeWeaving: `**Ecological.** Chain-graft containment requires the ore-hauling and surgical tradition of Frostmaw's mining tunnels. **Cultural.** Groven vertical-engineering and the Vat-Breakers' legacy of containment. **Founder.** Alaric the Groven mine-guard drove an ore-chain through his own forearm to hold a specimen for three days, a product of the Vat-Breakers' Revolt Stratum. **Subrace-native.** Morgh Groven and Fexric Drall natively; Kessen Neth, Skald, Vreken via the surgical graft (narrative unlock).`,

 id: 'warden',
 term: 'Warden',
 type: 'class',
 region: 'cragjaw-peaks',
 secondaryRegions: ['nordhalla'],
 summary: 'A grim, penitent jailer of dual seat, the chain-graft tradition invented by the Groven Alaric in Frostmaw Holdfast (Cragjaw Peaks) and secondarily practiced through the surgical school of the Frozen Archive (Nordhalla).',
 fullEntry: 'When the Deep Alchemists\' vat-laboratories collapsed and their experiments poured into the tunnels, the Groven mine-guard Alaric drove an ore-hauling chain through his own forearm into the largest specimen and held for three days. The chain rusted into his bone. He wouldn\'t let them remove it. From that act came the Warden tradition: heavy-martial lockdown specialists who anchor themselves to the battlefield\'s greatest horrors by driving rusted hooks and chains directly into their own flesh, forcing abominations into a brutal duel of meat and bone while they build Tether Tension for devastating counter-strikes. Born in the Cragjaw, the tradition spread to Nordhalla, where the surgical school of the Frozen Archive learned the graft-rite and adapted it for glacier-hunting, producing the cold-iron Skald Wardens who tether the things that crawl from the fjords. The primary seat is the Chain-Hold at Frostmaw. The secondary is the Frozen Archive.',
 relatedTerms: ['cragjaw-peaks', 'frozen_archive', 'frostmaw_holdfast', 'house_skalvyr', 'nordhalla', 'titan', 'the_warden', 'alaric']
  },
  'corvani': {
 id: 'corvani',
 term: 'Corvani',
 type: 'subfolk',
 region: 'nordhalla',
 summary: 'GM-only creature race. Glacier-dwelling subfolk of Nordhalla, raven-marked messengers bound to the Corvid Fate-Spirits who trade memories for passage across the frozen wastes.',
 fullEntry: 'When House Skalvyr halted the glaciers at the price of eternal winter, a splinter group of highland survivors wouldn\'t descend into the fjord-keeps. They climbed higher, into the glacier-spires where the wind sings in polyphonic overtones, and struck a fate-bond with the ancient Corvid Fate-Spirits. The spirits anchored their memories against the isolation and granted them the sight to read threads of destiny. The Corvani are what they became: raven-marked glacier-dwellers, non-playable, who carve their eyries into the sheer faces of the mile-high ice sheets and serve as messengers between the frozen fjord-keeps. They navigate whiteout and glacier-crevasse with preternatural skill, and their price is always a memory, freely given, recorded in the shifting raven-markings that crawl across their skin.',
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
 fullEntry: 'The Rime-Born (historically referred to as the Breath-Takers or Hrym) are a stoic, formidable people of Nordhalla\'s frozen fjords. Evolving from refugees of the Hunger Pact who consumed their own dead during a three-winter blizzard, they carry a supernatural cold in their blood. Their skin feels like stone left in shadow, their breath freezes even in southern heat, and they suffer from the Frost-Tithe,a supernatural birth-curse tied directly to House Skalvyr\'s bargain with Keth-Amar. When the glaciers were halted, a price was set: every frost-touched birth must "pay" a life to the cold. The child survives by drawing the mother\'s warmth into itself, not as biology, but as the bargain\'s interest collected on each new generation. Those marked before birth emerge as blue-skinned Frostbound, carrying Keth-Amar\'s lingering attention. To quiet the curse, Ice-Cradles are carved into living glacier faces, where the deep cold suppresses the tithe\'s pull.',
 relatedTerms: ['bloodhammer_sump', 'house_skalvyr', 'nordhalla', 'stel', 'the_still_crag', 'vargtor', 'frostcirque']
  },

  // ============================================================
  // MISSING LORELINK TARGETS, Locations, Races, NPCs
  // ============================================================

  'atropolis': {
 id: 'atropolis',
 term: 'Atropolis',
 type: 'location',
 region: 'bryngloom-forest',
 summary: 'The cathedral-grove capital of the Neth, a living archive woven from ancient ironwood trees where the First Contract is preserved.',
 fullEntry: 'Atropolis was never quarried or built. It was grown. The oldest ironwood trees in the Bryngloom Forest were coaxed over centuries into cathedral-shapes, their heartwood hollowed and hardened into archive-chambers where the Neth live, write, and preserve every contract ever struck. Walk its root-bridges and you\'ll hear the canopy hum with the scratching of quills and the slow creak of living wood remembering what it has absorbed. At its center stands the Heart-Vault, the deepest chamber of the oldest tree, where the First Contract is visible still, fossilized in living heartwood like a fly in amber. The Neth say the city remembers everything. The Drun, swaying in their rope-slum beneath the canopy, say the city remembers everything and lies about half of it.',
 relatedTerms: ['aran_glen', 'bryngloom-forest', 'neth', 'over_shanty', 'root_veil', 'root_veil_scriptorium', 'valerius', 'vel_keth_bayou', 'vel-otharen', 'morrath-steward']
  },
  'vreken': {
 id: 'vreken',
 term: 'Vreken',
 type: 'race',
 region: 'bryngloom-forest',
 summary: 'A lantern-eyed people of the Bryngloom who sing to their glowing ancestors in inverted cathedrals, carrying amber and silver light through the dark forest.',
 fullEntry: 'The Vreken were in the Bryngloom before the bog had a name. They are the lantern-eyed crypt-speakers who predate the Neth by centuries, carrying the amber and silver glow of their dead in their skin and their eyes. They sing to the ancestors in inverted cathedrals carved into the peat, reading the mycelium like others read maps, harvesting Ghost-Mycelium from the Hush-Bogs. The Root-Veil was theirs before the Neth ever called it the Keeper.\n\nNow the Neth write contracts over the ground the Vreken never owned on paper, and the Vreken watch from the forest floor. The Clean keep the deep-glow scholarship of their elders. The Marked walk the ghost-mycelium where the dead still remember. They call the Neth spiritually bankrupt, traders with death who forgot how to honor it, and they haven\'t forgiven the bargain that turned the forest\'s first children into tenants.',
 relatedTerms: ['animist', 'bryngloom-forest', 'deathcaller', 'fangmere_grove', 'hunters_gully', 'inquisitor', 'kora', 'lichborne', 'neth', 'plaguebringer', 'revenant', 'root_veil', 'sunken_spire', 'orven', 'nyssa', 'vespera']
  },
  'briaran': {
 id: 'briaran',
 term: 'Briaran',
 type: 'race',
 region: 'frostwood-reach',
 summary: 'Thorn-blooded descendants of the erased House Viridane who refused the Fog Compact and maintain a spiritual contract with the fae of the deep ironwood.',
 fullEntry: 'There were eight houses, not seven. The histories will tell you otherwise, and the histories are wrong. House Viridane was the original seventh signatory of the Binding, and when the other six broke to feed their heirs to Keth-Amar, Viridane refused. The houses erased the name, elevated House Morrath in its place, and called the count seven. But the bloodline didn\'t die. It went into the deep ironwood groves of the Frostwood Reach and grew thorns.\n\nThe Briaran are what Viridane became. They carry the refusal in their forearms and the old ways in their songs, and they reject Thalreth\'s Fog Compact entirely. The Unshorn wear their thorn-cloaks openly and tend the groves that remember. The Smooth-Skinned pass as human, moving through Ledgered towns with a truth-sense the fog cannot erode: the Unwritten Word, which hears a spoken lie the way a foot feels a false step.',
 relatedTerms: ['bramble_heath', 'frostwood-reach', 'greythorn_copse', 'grimmwood', 'house_thalreth', 'house_viridane', 'ironwood_heart', 'mimir', 'silent_seventh', 'bri-vessela', 'thorn-speaker', 'selene']
  },
  'harath_vault': {
 id: 'harath_vault',
 term: 'Harath-Vault',
 type: 'location',
 region: 'sundale',
 summary: 'The massive subterranean capital of the Emberth forge-clans, carved into a dormant volcanic caldera three miles from Emberspire.',
 fullEntry: 'Three miles from Emberspire, the mountain opens into a throat of black basalt, and the Harath-Vault descends into it: the subterranean capital of the Emberth forge-clans, radial and vast, hewn by the Sun-Speakers before the sun ever died. Every wall is a forge. Every forge is a temple. The Solbrand glows in the deep vault, and the Korr tend its eternal ember in the silence they keep for sacred things. Above them the Thrask rangers work the volcanic frontier, mining and hunting the badlands that would freeze solid if the ember ever failed. The vault is the reason Sundale still has a heartbeat, and the Emberth don\'t intend to let it stop.',
 relatedTerms: ['emberspire', 'emberspire_caldera', 'emberth', 'great_forge', 'solbrand', 'sundale', 'vault_breath', 'vulkars_karst', 'berserker', 'hark-ash-hammer', 'grum-bloodhammer']
  },
  'frostmaw_holdfast': {
 id: 'frostmaw_holdfast',
 term: 'Frostmaw Holdfast',
 type: 'location',
 region: 'cragjaw-peaks',
 summary: 'The ancestral stronghold of the Groven in the Cragjaw Peaks, site of the original vat-laboratories and the Vat-Breakers\' revolt.',
 fullEntry: 'Frostmaw Holdfast clings to the vertical walls of a Cragjaw ravine, a massive stronghold calcified into the rock, and it is the heart of Groven civilization. Here the Fexric Deep Alchemists built the vat-laboratories that forged the Groven from Thrumm broodlings, and here the Vat-Breakers\' revolt began, when the first generation shattered their containment vats and rose against their creators. The holdfast remains contested ground: the Groven hold the heights, the Deep Alchemists still work the tunnels below, and the war between them has never formally ended. Walk the Span of Frostmaw and you\'ll see the vats where the Groven were made, and the grooves in the stone where they broke out; both are preserved, and neither side will let the other forget.',
 relatedTerms: ['cragjaw-peaks', 'deep_alchemists', 'fexrick', 'formbender', 'frostmaw_massif', 'groven', 'house_tesshan', 'shaper', 'sump_galleries', 'the_spans', 'thrumm', 'vat_breakers_guild', 'warden', 'veyra', 'torin', 'alaric', 'fex-vestara', 'vat-breaker-foreman', 'deep-alchemist-prime', 'tesshan-lord', 'nesta']
  },
  'frozen_archive': {
 id: 'frozen_archive',
 term: 'Frozen Archive',
 type: 'location',
 region: 'nordhalla',
 summary: 'The great glacier-tomb of Nordhalla where the dead stand upright in the ice as permanent witnesses, and where the Augur tradition was born.',
 fullEntry: 'The dead do not lie down in Nordhalla. They stand. The Frozen Archive is a cathedral of glacier-ice where the dead are set upright in the wall and frozen mid-expression, perfectly preserved, their last sight still behind their eyes. Scribe-sentinels keep the genealogies of every soul interred, chalking the names into the frost. And the Augurs walk the corridors to stand close to the preserved, because proximity to the glacier-dead brings a resonance the living can use: a glimpse of the final vision the dead were seeing when the cold took them. The Archive is Nordhalla\'s memory, and Nordhalla doesn\'t bury its memory. It displays it.',
 relatedTerms: ['augur', 'fjord_gate', 'house_skalvyr', 'nordhalla', 'rimors_hearth', 'harbinger', 'animist', 'warden', 'malakor', 'theron', 'skadi-glass-eye', 'sera-three-scars', 'sigurd-skalvyr', 'cassia', 'xyris', 'mor-vereth', 'halvar-skalvyr', 'the-first-liar', 'li-wei', 'triune-founders']
  },
  'synod_hold': {
 id: 'synod_hold',
 term: 'Synod Hold',
 type: 'location',
 region: 'sundrift-vale',
 summary: 'The crystal-lattice archive of the Astril Luminarchy, where constellation-spirits are studied and the Unlit are judged.',
 fullEntry: 'The Astril Luminarchy built its seat from resonant crystal-lattice in the Sundrift Vale, and the hum of trapped starlight hasn\'t stopped since. The Synod Hold is where the Astril hierarchy studies the constellation-spirits carried in their blood, adjudicates disputes between the Lit and the Unlit, and keeps the most complete astronomical records left in the world. The Synod is also where False Prophets are tried and banished, their deceptive light recognized as a toxic forgery of true celestial resonance. Enter the Synod Hold and the starlight hum will press against your teeth; the Astril say the lattice remembers every constellation it has ever trapped, and it is still singing them.',
 relatedTerms: ['ancestor_mounds', 'astril', 'false_prophet', 'house_ordavan', 'mound_camps', 'sundrift-vale', 'the-first-liar', 'loras-ordavan']
  },
  'merrowport': {
 id: 'merrowport',
 term: 'Merrowport',
 type: 'location',
 region: 'iceheart-sea',
 summary: 'The largest human port-city on the Iceheart Sea, anchored to a warm volcanic seamount beneath the frozen waves.',
 fullEntry: 'Merrowport sits on a warm volcanic seamount beneath the frozen waves, and the heat keeps its harbor open when every other port on the Iceheart Sea has iced shut. Timber and iron, sprawling and loud, it is the largest human settlement on the sea and the gateway through which every trade route to the wider world must pass. The Merryn storm-sailors run the docks, and the Merryn do not use paper charts. They tattoo the currents onto their skin, every route they have survived inked where they cannot lose it to the water. The city belongs to whoever can read those skins and pay the harbor-fees. Most can\'t do either.',
 relatedTerms: ['gale_storm_shallows', 'house_mereval', 'iceheart-sea', 'minstrel', 'myrathil', 'the_shivering_bight', 'gambit', 'jax', 'merr-cael', 'mer-lyrisa', 'mereval-admiral', 'lyris', 'lyra']
  },
  'sunken_spire': {
 id: 'sunken_spire',
 term: 'Sunken Spire',
 type: 'location',
 region: 'bryngloom-forest',
 summary: 'A ruined, half-submerged cathedral in the deep Bryngloom where Vreken ancestral spirits congregate and the Over-Shanty black market thrives nearby.',
 fullEntry: 'No one knows who built the Sunken Spire. It rises out of the deep Bryngloom peat half-drowned, a stone cathedral sinking by inches into the bog, its spire listing and its crypts already underwater. The Vreken claim it as sacred ground. They say their strongest ancestors congregate in the drowned crypts where the living cannot follow, and they sing to those waters in tones no other race has learned.\n\nIn the Spire\'s shadow, the lawless Over-Shanty has put down roots, a permanent black-market settlement where Neth contracts hold no authority and the Drun trade in things the Velun would rather pretend don\'t exist.',
 relatedTerms: ['bryngloom-forest', 'fangmere_grove', 'merryns_drift', 'neth', 'peat_bog_sinks', 'vreken', 'inquisitor', 'vrael-forty-seventh', 'vespera', 'kor-vasseth', 'kora', 'vesper', 'orven', 'elias']
  },
  'greymark_keep': {
 id: 'greymark_keep',
 term: 'Greymark Keep',
 type: 'location',
 region: 'frostwood-reach',
 summary: 'The ancestral seat of House Thalreth and the administrative core of the Sovereign Ledger, protected by petrified ironwood palisades.',
 fullEntry: 'Greymark Keep rises from the peat-bogs of the Frostwood Reach like a fist of grey stone wrapped in fog. Every lineage, every deed, every marriage contract in the Reach is filed somewhere inside its walls, and whatever isn\'t recorded doesn\'t legally exist. The Sovereign Ledger fills whole wings of the fortress, ink on damp parchment that the Scribe-Cartel guards more jealously than gold. Jarl-Archivist Kaelen Thalreth holds the keys. Through the Tapestry-Wards, the keep assimilates Mimir foundlings and frontier children into the Ledgered fold, rewriting who they are one entry at a time. Stand in the courtyard and you can smell the soot-resin ink and the ironwood smoke, and hear the scratch of ten thousand quills turning people into paragraphs.',
 relatedTerms: ['frostwood-reach', 'house_thalreth', 'mistbarrow', 'rite-of-masks', 'scribes_tower', 'the_shallows', 'inquisitor', 'kaelen-thalreth', 'aldren-thalreth', 'elara-thalreth']
  },
  'ironjaw_port': {
 id: 'ironjaw_port',
 term: 'Ironjaw Port',
 type: 'location',
 region: 'iceheart-sea',
 summary: 'The Neth\'s largest external outpost, built into the frozen cliffs where the Bryngloom Forest meets the Iceheart Sea.',
 fullEntry: 'Where the Bryngloom Forest meets the Iceheart Sea, the cliffs freeze vertical and grey, and the Neth built Ironjaw Port into their face. It is the Neth\'s largest outpost beyond Atropolis and the only throat through which the Bryngloom\'s trade breathes, and the Neth don\'t let anything through without a contract. The port keeps a copy of the First Contract in its counting-house so that Neth stationed here can work without the Fading. A mixed council of Velun and Kessen governs the tariffs they charge the world for the privilege of passage, and that council has been feuding over those tariffs for two centuries. The feud is older than most of the sailors who depend on it.',
 relatedTerms: ['bryngloom-forest', 'iceheart-sea', 'neth', 'skalds_longport', 'the_saltmaw_estuary', 'treakous_rift', 'gambit', 'lyra']
  },
  'skald': {
 id: 'skald',
 term: 'Skald',
 type: 'subculture',
 region: 'nordhalla',
 summary: 'The human subculture of Nordhalla, cold-tempered warriors, glacier-keepers, and oral historians who value bloodline purity and cold-resistance above all.',
 fullEntry: 'The Skald are the dominant human bloodline of Nordhalla, shaped by eight centuries of eternal winter into a hardened, cold-tempered people. They are the warrior backbone of House Skalvyr\'s domain, broad-shouldered, frost-scarred, and possessed of a raw physical endurance that other regions find unsettling. Their oral-history traditions produce the finest chroniclers in the north, and their glacier-keep genealogies validate every Skalvyr bloodline claim. They speak Old Nord and value cold-resistance as the primary measure of worth. Carry Skald blood and the cold tests you before the world does; the glacier-keep genealogies remember every ancestor who passed, and every one who didn\'t.',
 relatedTerms: ['house_skalvyr', 'minstrel', 'nordhalla', 'grum-bloodhammer', 'cassia']
  },
  'orven-sen': {
    id: 'orven-sen',
    term: 'Orven-Sen',
 type: 'historical_figure',
 region: 'bryngloom-forest',
 summary: 'The Kessen probability-weaver who predicted the eruption of Emberspire sixty-three years before it happened, and whose hidden contingency clauses saved millions.',
 fullEntry: 'Orven-Sen was a mid-level Kessen probability-weaver attached to the Ironjaw Port trade delegation. In the Year of the First Ash (the first year following the Shattering of the Seal and the initial eruption of Emberspire), he filed a formal prediction that the volcano\'s secondary chambers would suffer a second, catastrophic tectonic eruption within a century. He was fined for filing a frivolous prediction and died forty years later without seeing it come true. Sixty-three years after his death, the secondary chambers erupted exactly as predicted, permanently blanketing the sky in thick soot, and his quietly inserted contingency clauses in three generations of warmth-resource contracts saved the Neth an estimated four million gold-weight in renegotiation costs.',
 relatedTerms: ['bryngloom-forest', 'emberspire', 'neth']
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
 fullEntry: 'House Mereval rules the Iceheart Sea under Grand Admiral Varis. Having traded calm waters for unfreezing sea-lanes, the house governs the floating capital of Merrowport. They maintain control through a monopoly on the Brine-Bond Syndicate, paying crews in Voyage-Shares, and enforce ship registrations via the Unfreezing Booms. Under the state-enforced Luck-Ledger, the house purges Tide-Speak animists. The house has recently deployed steam-trawling fleets, causing damage to the deep-current substrate that drives Myrathil to madness. Sail under Mereval colors and the Sea-Charter follows you; the Board of Trade owns your wake, and the Myrathil beneath the keel remember every ship that wronged them.',
 relatedTerms: ['deepwell_archipelago', 'first_shore', 'gale_storm_shallows', 'iceheart-sea', 'brinehorse_cove', 'merrowport', 'minstrel', 'spindrift_lagoon', 'the_saltmaw_estuary', 'mereval-admiral', 'merr-cael', 'mer-lyrisa']
  },
  'house_tesshan': {
 id: 'house_tesshan',
 term: 'House Tesshan',
 type: 'noble_house',
 region: 'cragjaw-peaks',
 summary: 'The mountain lords of the Cragjaw Peaks who enforce the Knotted Decree, the Steam-Line Cartel, and the Tesshan corvée.',
 fullEntry: 'House Tesshan rules the vertical keeps of the Cragjaw Peaks under Jarl Oda Tesshan, who traded visibility for a protective snow-veil and isolated the peaks from the lowlands. They hold control through the Steam-Line Cartel monopoly and the Tesshan corvée labor system. By outlawing written language in favor of knotted cords that only they can read, the Tesshan regulate every keep by controlling its records. And they purge the Rock-Speakers who commune with the mountain spirits, because the mountains answer to the Tesshan now, and they don\'t share.',
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
 fullEntry: 'House Morrath governs the Bryngloom Forest under the First Contract. Having borrowed their survival from the Neth scribe-clan, the house operates as an administrative regency, a role they were elevated to fill when the original seventh seat went silent. Their authority is an injunction, a name written where another name was removed. They maintain control through a monopoly on Memory-Glass Covenants and the Great Registry, demanding labor and memory tithes. Deceased debtors are conscripted as Debt-Revenants (the Postmortem Corvée) to work the sumps. The house has recently authorized industrial Peat-Presses, causing swamp drainage that decays the ironwood roots.',
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
 fullEntry: 'When Emberspire erupted and bled fire into the frozen sea, the ocean answered with foam. The Myrathil crawled out of that foam: bioluminescent, web-fingered, their eyes the deep blue of the trenches they left behind. Their skin still shifts color with mood, flushing silver when they rage and going dark when they grieve.\n\nThe Breakers-Born keep the shore, working the docks and the diplomatic tables where the Board of Trade decides who sails and who sinks. The Deep-Born descend to the abyssal pressure-forges where no light reaches, crafting things the surface world doesn\'t see. And the River-Fed swim inland, trading saltwater for the freshwater rivers that thread the continent, carrying news and goods to places no ship can reach.',
 relatedTerms: ['deepwell_archipelago', 'emberspire', 'iceheart-sea', 'merrowport', 'spindrift_lagoon', 'the_saltmaw_estuary', 'the_shivering_bight', 'treakous_rift', 'wraithsound']
  },
  'groven': {
 id: 'groven',
 term: 'Groven',
 type: 'race',
 region: 'cragjaw-peaks',
 summary: 'Humanoid bridge-trolls of the Cragjaw Peaks, alchemically forged from Thrumm blood by Fexric Deep Alchemists, who shattered their vats and rose in the Vat-Breakers\' revolt.',
 fullEntry: 'The Groven were not born. They were made. Fexric Deep Alchemists captured Thrumm broodlings, submerged them in alchemical serums beneath Frostmaw Crag, and raised a race of servitors with smoothed stone-hide and limbs built long for labor. Then the servitors developed will. Then language. Then they shattered their containment vats and rose against the alchemists in the Vat-Breakers\' revolt, claiming the Ancestor-Spans as a homeland no one had meant to give them.\n\nNow the Groven are the bridge-builders of the Cragjaw Peaks. The heavy-scaled Morgh anchor the foundations. The long-limbed Ithran thread the spans. And when a Groven dies willing, the bones go into the next bridge, calcifying into arches that carry the living across the ravines their makers didn\'t intend them to cross.',
 relatedTerms: ['ancestor_gaps', 'cragjaw-peaks', 'deep_alchemists', 'deepchasm_keep', 'dreadnaught', 'fexrick', 'formbender', 'frostmaw_holdfast', 'house_tesshan', 'lost_brood_vats', 'shaper', 'slag_gulch', 'stags_rest_moraine', 'the_great_gorge', 'the_spans', 'thrumm', 'titan', 'vat_breakers_guild', 'torin', 'alaric', 'deep-alchemist-prime', 'vat-breaker-foreman']
  },
  'fexrick': {
 id: 'fexrick',
 term: 'Fexric',
 type: 'race',
 region: 'cragjaw-peaks',
 summary: 'The oldest continuous civilization on Mythrill, goblinoid engineers whose guilds built the world\'s geothermal infrastructure and who accidentally created both the Groven and themselves.',
 fullEntry: 'The Fexric built the world\'s bones and then forgot to write themselves into the history. Goblinoid guild-masters with a knack for geothermal plumbing, they laid the steam-roads, the turbine wheels, and the pipes that link all seven regions, and they were doing it millennia before humans found fire. They predate everyone.\n\nThey were an accident. The same alchemical vats that forged the Groven bled chemical runoff that coalesced into the Fexric, and the runoff learned to sing. The guild-bound Kethrin keep the infrastructure running and sing maintenance-songs to their machines. The free-roaming Drall clans wander the deep caverns where no maps reach. Both kinds speak Fexric, and they don\'t agree on much else.',
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
 summary: 'The original seventh binding house, erased from history for refusing Keth-Amar. Six houses suspect the truth. None will confirm it.',
 fullEntry: 'Among the houses that signed the Binding Compact, one stands silent. Its entry in every ledger and contract-hall is a blank line where a name should be.\n\nThe reason is now known, though no house will say so aloud. House Viridane was the original seventh signatory. When the Watcher in the Mist reached them before Keth-Amar could claim them, they fled south. The remaining six houses, Thalreth, Skalvyr, Tesshan, Solvan, Mereval, Ordavan, could not complete the ritual with a gap. They elevated a minor family, House Morrath, as a substitute signatory.\n\nThe erasure that followed was not political. Keth-Amar hunts through knowledge. To carry the memory of Viridane was to hold a thread the Sun-Eater could follow. The fog that swallowed their name was protection as much as punishment. Morrath\'s records are sparse because they were written to replace a history that predated them, and because the details of what happened to the seventh house are safest when they are not known at all.\n\nSix houses suspect this truth. None will confirm it. Scribe-Sentinels who research the matter have a habit of disappearing into the fog. The Briaran carry Viridane\'s blood in their thorns, and they do not forget what the ledgers will not record.\n\nYou will not find Viridane\'s name in any ledger that survives. But if you walk the deep ironwood with a Briaran guide, the Unwritten Word will tell you whether what you have been told about the seventh house is the truth, or merely what the fog has decided you are allowed to remember.',
 relatedTerms: ['briaran', 'house_morrath', 'house_viridane', 'keth_amar', 'the_warden', 'the_partial_seal']
   },
   'memory_fog_mechanics': {
 id: 'memory_fog_mechanics',
 term: 'Memory Fog Mechanics',
 type: 'concept',
 region: 'frostwood-reach',
 summary: 'The Frostwood fog eats memory in two ways: slow decay for those who live in it, acute amnesia for those who travel through. The Moss-Wax trade keeps the Reach alive.',
 fullEntry: 'The fog of the Frostwood Reach eats memory on two schedules.\n\nFor those who live in it, the decay is slow. A decade of unprotected exposure hollows out foundational memories: family faces, a mother\'s name, the song you sang as a child. You do not notice the moment each one goes. You notice the hole it leaves years later.\n\nFor travelers in the deep wilderness, the danger is acute. Every twenty-four hours the fog demands a Spirit save, and on a failed save it takes a single piece of you: a name, a face, the terms of a contract you came here to honor. The Memory Toll does not negotiate.\n\nThe Reach survives through ritual countermeasures. Moss-Wax Candles burned at the trail\'s edge ward off the mist. Alchemical Fae-Hush drunk before sleep stabilizes the mind. Memory-Glass tablets, light-refracting, record what their owners cannot trust themselves to remember. The shape-shifting Mimir must perform the Rite of Masks to lock their fluid anatomy, or the fog dissolves them entirely.\n\nHouse Thalreth claims the fog as the price of their bargain with the Warden. Scholars note it predates the formal compact, as if it were already rising before any trade was struck, waiting for a reason to take hold. Some whisper the fog remembers what the houses agreed to forget, and it protects that silence by consuming any memory that tries to surface.\n\nWalk the Frostwood long enough and the fog will tax you. Carry Moss-Wax, drink your Fae-Hush, and carve your name on Memory-Glass before you sleep. The fog is patient. You must be patient too.',
 relatedTerms: ['frostwood-reach', 'house_thalreth', 'mimir', 'rite-of-masks', 'scribes_tower', 'mirror_mere']
  },

  // ============================================================
  // DUAL-ORIGIN & CLASS FOUNDERS
  // ============================================================

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
  'malakor-the-archivist': {
 id: 'malakor-the-archivist',
 term: 'Malakor',
 type: 'historical_figure',
 region: 'nordhalla',
 summary: 'The archivist who calculated when the world ends, and found the answer soothing. He still leads the Doom-Choir from the Frozen Archive, counting down.',
 fullEntry: 'Xyris tore the holes in reality. Malakor did the cold work she could not: he calculated exactly when those tears would consume everything. The number did not break him; it gave him a purpose. He merged Xyris\'s chaos-work with his own prophetic arithmetic and founded the Harbinger tradition, and he still leads the Doom-Choir from the Frozen Archive, serene in the certainty that the equation has only one solution. The Choir is still singing the count, and if you can hear it, you\'re already a Harbinger; the only question left is what you do with the time Malakor says you have.',
 relatedTerms: ['frozen_archive', 'harbinger', 'nordhalla', 'xyris']
  },
  'kael': {
 id: 'kael',
 term: 'Kael',
 type: 'historical_figure',
 region: 'sundrift-vale',
 summary: 'The Ordan totem-singer whose migration-horse mane totem erupted with his grandfather\'s voice, co-founding the Animist tradition.',
 fullEntry: 'Kael wove a totem from his migration-horse\'s mane, and the totem erupted with bone-resonance, and the spirit of his grandfather spoke through the overtones of his throat-singing. That was the first ancestor any Ordan called back on purpose. His totemic tradition was one of three independent discoveries that merged into the Animist class when he met Nyssa and Theron at a crossroads and recognized the scars they each carried. The ancestors still answer the throat-singers of the Sundrift Vale. Learn the overtones, and one of them may answer you.',
 relatedTerms: ['animist', 'nyssa', 'sundrift-vale', 'theron']
  },
  'nyssa': {
 id: 'nyssa',
 term: 'Nyssa',
 type: 'historical_figure',
 region: 'bryngloom-forest',
 summary: 'The Vreken spore-elder who discovered ancestral communion through spore-inhalation and co-founded the Animist tradition.',
 fullEntry: 'Nyssa was a Vreken spore-elder of the Bryngloom Forest who inhaled the spirits on bioluminescent spores and heard the ancestral dead speak through shifting glow on her skin. Her spore-inhalation tradition was one of three independent discoveries that merged into the Animist class when she met Kael and Theron at a crossroads and recognized their shared art.',
 relatedTerms: ['animist', 'bryngloom-forest', 'kael', 'theron', 'vreken']
  },
  'theron': {
 id: 'theron',
 term: 'Theron',
 type: 'historical_figure',
 region: 'nordhalla',
 summary: 'The Skald rune-carver who inscribed his ancestors\' names into his own skin and found the dead living in the scars, co-founding the Animist tradition.',
 fullEntry: 'Theron carved his ancestors\' names into his own skin at the Frozen Archive, and the runes became the house of the dead: each spirit residing in the scar-tissue it was written into. His runic tradition was one of three independent discoveries that merged into the Animist class when he met Kael and Nyssa at a crossroads and recognized the scars they each carried. The Skald still carve their dead into living skin at the Archive. Inscribe a name with the right intent, and the name may answer back.',
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
 summary: 'The world-heart volcano of Sundale, beneath whose caldera the dying star Sol was entombed at the Binding by House Solvan and the binding houses.',
 fullEntry: 'Eight centuries of fire have not exhausted the Emberspire. The great volcano of Sundale burns without pause, its caldera plunging past the depth any expedition has survived, fed by the dying star entombed beneath the crust. At the Binding, House Solvan and the other binding houses lowered a seal woven from the flayed lifeblood of Aex down that volcanic throat and chained Sol where the world could not watch it die. When the Breach cracked the vault, the mountain answered with eight centuries of uninterrupted fire. The Emberth forge-clans built their keeps in its shadow and have tended its geothermal breath ever since, guarding the ember they call Sol\'s last heartbeat. The Dawn Vigil preaches that the magma-chamber connects to the Sundered Monolith fragments scattered across the continent, and that reassembling them would reignite the star inside the caldera. Whether that would be a rebirth or a second catastrophe, no one alive can say.',
 relatedTerms: ['aex', 'dawn_vigil', 'emberspire_caldera', 'emberth', 'grum', 'harath_vault', 'house_solvan', 'keth_amar', 'myrathil', 'orven', 'pyrofiend', 'scathrach', 'solbrand', 'sundale', 'the_breach', 'sol-kaessen', 'sol-vareths', 'thrak-damos', 'solvan-steward', 'dawn-vigil-commander', 'damon', 'malakor', 'hark-ash-hammer', 'frigga-skalvyr', 'grum-bloodhammer', 'sera-solvan', 'first-cabal']
  },

  // ============================================================
  // NOBLE HOUSES, Missing
  // ============================================================

  'house_viridane': {
 id: 'house_viridane',
 term: 'House Viridane',
 type: 'noble_house',
 region: 'frostwood-reach',
 summary: 'The original seventh binding house that refused Keth-Amar, erased and replaced by House Morrath, their descendants surviving as the thorn-blooded Briaran.',
 fullEntry: 'House Viridane was the seventh binding family of the pre-Breach world, the one that did not march north when Keth-Amar called. The official account calls it refusal. The truth, buried deeper than even the erasure, is that something reached them first. In the weeks before the Dark Bargain was struck, while the other families prepared their children for the peaks, Viridane began hearing a different voice, not Keth\'s whispers, but something older, watching from the moonlit groves. Whether they sought it out or it came to them is a question no surviving record answers. What is known: they turned south instead of north, carrying nothing, and the fog rose behind them as if the world itself was helping them disappear. Called the "eighth house" in common speech because the official records count seven public families and Viridane is the one erased and replaced, they were in truth one of the original seven signatories of Sol\'s Binding Compact. The cost of their escape was absolute: their name was struck from every ledger, every contract, every record. Their holdings were distributed among the cooperating houses. House Morrath was elevated to fill the gap in the binding ritual, and Viridane\'s bloodline was declared legally nonexistent. But the Viridane survived. In the deepest ironwood groves of the Frostwood Reach, they fulfilled the contract with the fae, a pact that had found them before Keth\'s shadow fell. Over centuries, the contract changed their bloodline. Their children grew thorns from their forearms. Their eyes shifted to the green of deep canopy. They became the Briaran, the thorn-blooded descendants who carry the Unwritten Word, a truth-sense that detects spoken lies. House Viridane is not dead. It is simply unwritten.',
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
  summary: 'The vast mycelial network beneath the Bryngloom Forest. The Vreken revere it as an ancestor. The Neth know it as the Keeper of the Last Threshold.',
  fullEntry: 'Beneath the Bryngloom Forest runs a continent-spanning mycelial network older than the Wyrd and the Breach. Neither plant nor animal, the Root-Veil is a living intelligence that has been absorbing and recycling the dead for longer than any race has kept records. Its threads remember every organism the forest has ever eaten.\n\nThe Vreken, who predate the Neth in the Bryngloom, revere the Root-Veil as a sacred ancestor: the living memory of every organism the forest has absorbed. They read the mycelium like others read maps. They harvest Ghost-Mycelium from the Hush-Bogs. They sing to the network in inverted cathedrals carved into the peat.\n\nThe Neth ancestors perceived the same entity differently. They called it the Keeper of the Last Threshold, the death-boundary guardian, and approached it with a legalistic proposition: if the Keeper would sustain their bodies and halt their decay, the Neth would serve as its record-keepers, cataloguing every organism the mycelium absorbed. The Keeper accepted. The Neth rose from the bog with silver skin and stilled breath.\n\nWhether the Root-Veil and the Keeper are the same entity viewed through different lenses, or two distinct intelligences sharing the same substrate, is a matter of bitter dispute between the Vreken and the Neth that has never been resolved. The dispute has produced more contract-law than any other question in the Bryngloom.\n\nStand on the peat of the Bryngloom and you stand on the Root-Veil. The threads know your weight. The Keeper is counting your breaths. Choose your contracts carefully: the network beneath your feet has been eating the careless for longer than your line has been walking.',
 relatedTerms: ['atropolis', 'bryngloom-forest', 'keeper_of_the_last_threshold', 'neth', 'vreken', 'kora', 'orven', 'kor-vasseth', 'triune-founders']
  },

  'thrumm': {
 id: 'thrumm',
 term: 'Thrumm',
 type: 'race',
 region: 'cragjaw-peaks',
 summary: 'The primordial ancestor-species from which the Groven were alchemically created, regenerative, slow-witted tunnel-dwellers still hunted by Deep Alchemists for experimentation.',
 fullEntry: 'Before the Groven, there were the Thrumm. They were the dominant tunnel-dwellers of the Cragjaw Peaks: large, powerfully built, possessed of a supernatural regenerative capacity that let them survive injuries that would kill any other creature. They were not warlike. They were not ambitious. They ate, they bred, they slept, and they healed. It was this combination of physical resilience and intellectual docility that made them perfect subjects for the Deep Alchemists\' transformation vats.\n\nEight hundred years ago, the Alchemists captured hundreds of Thrumm broodlings and submerged them in alchemical serums, accelerating their cognitive development, hardening their skin into stone-scale, and extending their limbs for tool use. The result was the Groven. The Thrumm who were not captured still inhabit the deepest tunnels, but their numbers are dwindling. The Deep Alchemists continue to harvest fresh broodlings when they can find them, and reports from the lower sumps suggest the practice has not stopped. Walk the deepest tunnels of the Cragjaw Peaks and you may meet the species the Groven were made from; the Thrumm are still healing, still docile, and still being taken, and the Alchemists never asked whether they wanted to be improved.',
 relatedTerms: ['cragjaw-peaks', 'deep_alchemists', 'fexrick', 'frostmaw_holdfast', 'groven', 'vat_breakers_guild']
  },

  'deep_alchemists': {
 id: 'deep-alchemists',
 term: 'Deep Alchemists',
 type: 'faction',
 region: 'cragjaw-peaks',
 summary: 'Older than the Dark Bargains, older than human fire, the Fexric research sect that forged the Groven from Thrumm blood, lost them to revolt, and retreated beneath Frostmaw Crag to keep working.',
 fullEntry: 'For long ages before the Dark Bargains, the Deep Alchemists worked the deep tunnels of the Cragjaw Peaks, refining living flesh in sealed vats while humans were still learning to make fire. They are the oldest continuous research sect on Mythrill, a branch of the Fexric who treated flesh the way a smith treats ore: something to be melted, alloyed, and poured into a better shape. They were never kind about it.\n\nTheir great work was the Groven. Eight hundred years ago, the Alchemists captured hundreds of Thrumm broodlings, the regenerative tunnel-dwellers who did little but eat, sleep, and heal, and submerged them in alchemical serums. They hardened skin into stone-scale, lengthened limbs for tool use, and forced cognition awake. The Groven were built to labor. The first generation developed will, then language, then a revolt that shattered the Alchemists\' surface operations.\n\nThe guild didn\'t die. It retreated into sealed vat-laboratories beneath Frostmaw Crag and kept working. Its current project is the Lost Brood: Thrumm and half-transformed Groven who have hung in those vats for seven centuries, still being adjusted by hands that never stopped. The Alchemists now believe the Wyrd itself can be refined, distilled, and injected. They want to brew a form of life that transcends both organic flesh and Wyrd substance.\n\nThey are still down there. The Groven above know it. If you walk the lower sumps of Frostmaw and listen to the pipes, you can hear the vats humming. Whether you come as a Groven with a debt to settle, a Fexric with a curiosity you cannot explain, or simply someone who values their own bones, the Deep Alchemists would very much like to meet you.',
 relatedTerms: ['fexrick', 'frostmaw_holdfast', 'groven', 'lost_brood_vats', 'thrumm', 'vat_breakers_guild', 'alaric', 'vat-breaker-foreman']
  },

  'keeper_of_the_last_threshold': {
 id: 'keeper_of_the_last_threshold',
 term: 'Keeper of the Last Threshold',
 type: 'concept',
 region: 'bryngloom-forest',
 summary: 'The death-boundary guardian who enforces every Neth contract. Honored clauses extend the Fading; broken ones wake the Debt-Revenant.',
 fullEntry: 'At the boundary between life and death waits the Keeper of the Last Threshold. Neither power nor spirit, it exists at the last threshold any soul must cross, and it does not move from that place.\n\nWhen the Neth ancestors sought to preserve themselves against the Fading, it was the Keeper they approached. Their proposition was precise: if the Keeper would sustain their bodies and halt their decay, the Neth would serve as the eternal record-keepers of every contract the Keeper\'s substrate absorbed. The Keeper considered the argument and accepted. Every Neth contract since has been enforced by the Keeper\'s authority.\n\nBreak an agreement and the Keeper sends the Debt-Revenant. Honor an agreement and the Fading deadline extends. Seal an oath with the Keeper\'s own mark and even the bog cannot easily claim you. The Drun, Neth who have severed every contract, are invisible to the Keeper, existing in a state of legal non-existence that is simultaneously freedom and exile. The Keeper does not hunt them. It no longer sees them.\n\nThe Keeper does not punish. It does not reward. It remembers every clause of every contract, and it enforces them without exception. Those who have encountered what they believe to be the Keeper describe only a sensation: the certainty that a debt has just been recognized.\n\nSign a Neth contract and your name is now in the Keeper\'s keeping. The Keeper is patient. The Keeper does not forget. Your breath is the collateral, and the threshold does not close.',
 relatedTerms: ['black_fen', 'bryngloom-forest', 'neth', 'root_veil', 'root_veil_scriptorium', 'valerius', 'vel-otharen', 'morrath-steward']
  },

  'vault_breath': {
 id: 'vault_breath',
 term: 'Vault-Breath',
 type: 'concept',
 region: 'sundale',
 summary: 'The Emberth art of absolute stillness. A master of Vault-Breath can slow their heart to silence and vanish from any heat-sense.',
 fullEntry: 'In the geothermal depths of the Harath-Vault, body heat is the difference between a useful worker and a corpse. The Emberth forged Vault-Breath to close that gap. The discipline trains absolute physical stillness: metabolism slowed, movement reduced to micro-adjustments, breathing synchronized with the volcanic vent cycles until an Emberth at rest radiates nothing the cavern can detect.\n\nAt its highest level, Vault-Breath allows an Emberth to enter a state of suspended animation indistinguishable from death. No heartbeat. No breath. No heat signature. The Korr Sun-Speakers use this state during their sacred meditations. The Thrask rangers employ it for ambush hunting in the cinder badlands, lying flat on black rock for days before the strike.\n\nVault-Breath is not magic. It is discipline hammered into muscle and bone over years of practice. An Emberth who has mastered it is the most patient predator in the Sundale badlands, and the most difficult target.\n\nLearn Vault-Breath and the volcanic dark becomes a place you can wait. The vents mark time. The stillness becomes a weapon. The cinder badlands have room for one more ambush.',
 relatedTerms: ['emberth', 'harath_vault', 'sundale']
  },

  'dawn_vigil': {
 id: 'dawn-vigil',
 term: 'Dawn Vigil',
 type: 'faction',
 region: 'sundale',
 summary: 'Born in the Dimming as quiet Monolith-trackers, the Dawn Vigil now marches under Hierophant Aethelgard, sending Solvarn Martyrs and Pyrofiends across the world to seize Sundered fragments: publicly to relight Sol, privately to keep anyone from summoning Keth-Amar back.',
 fullEntry: 'For generations after the Dimming, the Dawn Vigil were quiet. A monastic order of Martyrs, they tracked the scattered Sundered Monoliths in secret, marking locations on ash-paper maps and praying for the day Sol would relight. They kept the old faith and asked nothing of anyone.\n\nThen Hierophant Aethelgard took the chair. Within two decades she had militarized the order, seized the keeps of Sundale, and turned a cloister into an army on the march. Now bands of Solvarn Martyrs, Pyrofiends, and Augurs march into every region under a sigil of a rising sun pierced by obsidian, taking Sundered fragments by whatever means the moment requires. Publicly, the Vigil serves the restoration of House Solvan.\n\nThe Vigil\'s inner council has done the math, and the answer is worse than the faithful fear. Reassembling the Monoliths will not bring Sol back. It will summon Keth-Amar to finish what was started at the Breach. They keep marching anyway, because if they do not assemble the fragments first, someone else will.\n\nThe ash keeps falling on Sundale. The keeps fly the obsidian sun. If you carry Martyr scars or Augur sight, the Vigil has a use for you, and the work isn\'t done.',
 relatedTerms: ['emberspire', 'house_solvan', 'keth_amar', 'solbrand', 'sundale', 'the_ashen_escarpment']
  },

  'vat_breakers_guild': {
 id: 'vat-breakers-guild',
 term: 'Vat-Breakers\' Guild',
 type: 'faction',
 region: 'cragjaw-peaks',
 summary: 'The Groven forged their own government the day they broke out of the Alchemists\' vats. The Vat-Breakers\' Guild still runs Groven law, the bone Ancestor-Spans, and the long watch for whatever the Deep Alchemists brew next.',
 fullEntry: 'The first Groven were built to lift what the Fexric could not, and to ask nothing. They weren\'t asked long. The generation that crawled out of the alchemical vats shattered them, killed their keepers where they could, and rose against the Fexric who made them. The Vat-Breakers\' Guild is the government those first foremen founded, and it has run Groven life ever since.\n\nThe Guild keeps the Ancestor-Spans, the bone-bridges grown from the calcified dead of Groven who willed their skeletons to the work. It adjudicates Groven law. It patrols the lower tunnels, listening for the hum of Deep Alchemist vats and the scrape of fresh Thrumm harvesting. The Guildhall at Frostmaw Holdfast holds the bones of the first foreman, the Groven who shattered the first vat. Her outstretched hand is the keystone of the main span. Every Groven who crosses that bridge walks under her palm.\n\nThe Guild also keeps secrets. Beneath the Holdfast lies an archive of stolen Fexric formulae, pulled from Alchemist laboratories over centuries of raids. One of those formulae may reverse calcification entirely. The foremen haven\'t decided whether to use it, or whether the Groven would still be Groven without their stone.\n\nThe vats are still humming somewhere below. The Deep Alchemists are still working. If you are Groven, your bones are owed to the span and your vengeance is owed to the sumps. If you aren\'t, the Guild will trade with you, guard you, and watch you very carefully.',
 relatedTerms: ['ancestor_gaps', 'deep_alchemists', 'frostmaw_holdfast', 'groven', 'house_tesshan', 'stags_rest_moraine', 'the_great_gorge', 'thrumm', 'deep-alchemist-prime', 'vat-breaker-foreman']
  },

  // ============================================================
  // NEW LOCATIONS, Regional Expansion (Aquatic, Mountain, Wasteland Terrain)
  // ============================================================

  // FROSTWOOD REACH, New Locations
  'wraithfen': {
 id: 'wraithfen',
 term: 'Wraithfen',
 type: 'location',
 region: 'frostwood-reach',
 summary: 'A fog-drowned fen on the eastern border where Mimir Unwoven wander without masks, their forms dissolving in the mist.',
 fullEntry: 'Where the Frostwood Reach\'s protective fog becomes something else, thicker, warmer, and seemingly alive, the Wraithfen opens. The Unwoven Mimir who drift through its depths have abandoned their masks entirely, letting their forms blur and shift with the mist. Thalren trappers give the fen a wide berth. Those who enter too deep return speaking languages no living scholar can identify, their memories contaminated with impressions of lives they never lived. Enter the Wraithfen and you may walk out speaking someone else\'s memories; the Mimir who drift there chose to stay because they no longer remember which memories were theirs.',
 relatedTerms: ['frostwood-reach', 'gref', 'mimir']
  },
  'mistbarrow': {
 id: 'mistbarrow',
 term: 'Mistbarrow',
 type: 'location',
 region: 'frostwood-reach',
 summary: 'An ancient burial mound predating House Thalreth, shrouded in fog so dense it has its own weather.',
 fullEntry: 'A burial mound older than every known civilization in the Frostwood Reach, wrapped in fog so permanent it generates its own weather: rain falls inside the mist even when the surrounding forest is dry. Expeditions into Mistbarrow have recovered amber tablets inscribed with unknown script and corroded bronze masks of workmanship that surpasses any Thalren or Mimir craft. The Forgotten Archivists of the Ledger Halls have petitioned House Thalreth for a full excavation for three centuries, and House Thalreth has refused for three centuries, because whatever is buried beneath Mistbarrow predates the Ledger, and the Ledger does not survive things it cannot record. Descend into the barrow and you\'ll find what the Thalreth won\'t excavate; the question is whether what finds you can be recorded in ink that survives the fog.',
 relatedTerms: ['frostwood-reach', 'greymark_keep', 'house_thalreth']
  },
  'greythorn_copse': {
 id: 'greythorn_copse',
 term: 'Greythorn Copse',
 type: 'location',
 region: 'frostwood-reach',
 summary: 'A fortified copse of ironwood jointly maintained by Thalren timber-wardens and Briaran thorn-tenders on the eastern trade route.',
 fullEntry: 'Greythorn Copse is a living fortress, a wall of deliberately tangled ironwood grown by generations of Briaran horticulture and kept by Thalren timber-wardens. The "Grey" in its name connects it to Greymark; the "Thorn" is pure Briaran. It stands as the primary waystation between Greymark Keep and the eastern fens, and its single watched gate funnels all trade through a customs post where both races collect tolls. Pass through Greythorn\'s gate and you\'ll pay two tolls in two languages, and the thorn-wall above you is still growing; the Briaran tend it like a garden, and it has never once let an army through.',
 relatedTerms: ['briaran', 'frostwood-reach', 'house_thalreth']
  },
  'drunhold': {
 id: 'drunhold',
 term: 'Drunhold',
 type: 'location',
 region: 'frostwood-reach',
 summary: 'A small woodcutter village of the Frostwood Reach, sitting on the ancient trade routes that stitch the Reach together.',
 fullEntry: 'Drunhold straggles along the old trade routes of the Frostwood Reach, one of the small ironwood-cutting villages where the woodcutters work the sacred groves under strict Thalren quota. That tension has seeded generations of logger folklore about forest vengeance, the Grimmstalk myth among them. Crossroad spirits like the Gref are drawn to Drunhold\'s thresholds, where strong partings and forgotten oaths leave the heaviest trails. Stop at a Drunhold threshold and you\'ll feel where the oaths were broken; the Gref can smell it too, and the woodcutters lock their doors at dusk for reasons the quota-ledgers don\'t mention.',
 relatedTerms: ['frostwood-reach', 'grimmwood', 'siltmire_flats', 'alaric']
  },
  'grimmwood': {
 id: 'grimmwood',
 term: 'Grimmwood',
 type: 'location',
 region: 'frostwood-reach',
 summary: 'The oldest heart of the Frostwood Reach, a stand of ironwood and pine older than the Binding, dense enough to swallow loggers whole.',
 fullEntry: 'Grimmwood Proper is the ancient core of the Frostwood Reach, where the ironwood and pine have stood since before the Binding and the canopy admits no light at all. It is treated by the woodcutters of Drunhold with terror rather than ambition: the Grimmstalks, feather-skulled canopy-guardians born of logger guilt, dwell exclusively in its highest branches, and travelers who lose the trail in the silent Grimmwood are rarely recovered. The Briaran claim the Grimmwood as untouchable rootland; the Thalren ledger-wards mark its edge and go no further. Walk into the Grimmwood and you walk into the oldest thing in the Reach; the trees were old when the fog came, and they do not care about your ledger or your name.',
 relatedTerms: ['briaran', 'drunhold', 'frostwood-reach']
  },
  'siltmire_flats': {
 id: 'siltmire_flats',
 term: 'Siltmire Flats',
 type: 'location',
 region: 'frostwood-reach',
 summary: 'A stretch of the Frostwood Reach where ancient peat has turned the standing water to thick black soup. Hunting ground of the Oillipheist.',
 fullEntry: 'The Siltmire Flats are a low, boggy reach of the Frostwood where peat older than the Binding has turned the standing water into a thick, black, deceptive soup, deep enough to swallow a person, warm enough in rare summer to slow the cold-blooded things that live in it. It is the named hunting ground of the Oillipheist, the blind silt-leech serpent, and Frostwood parents use the Flats as the backdrop for every warning-tale about drowning in dark water. Trade routes skirt the Flats by a wide margin; only peat-cutters and the desperate go near. Cross the Flats and the Oillipheist will taste your footsteps through the silt before it sees you; move slowly, move quietly, and hope the peat is frozen enough to hold.',
 relatedTerms: ['drunhold', 'frostwood-reach']
  },
  'bramble_heath': {
 id: 'bramble_heath',
 term: 'Bramble Heath',
 type: 'location',
 region: 'frostwood-reach',
 summary: 'Open thorn-covered heathland at the forest edge, patrolled by Briaran rangers tending the living boundary-walls.',
 fullEntry: 'The Bramble Heath marks where the ironwood canopy finally breaks and the fog thins for the first time. It is a savage, beautiful landscape: crimson thorn-flowers bloom year-round in soil nourished by centuries of blood, and the Briaran rangers who patrol here cultivate the thorn-barriers as both defense and art. The heath is the Briaran\'s most visible territorial claim in the Reach, and they defend it with a ferocity that surprises those who underestimate the quiet, plant-tending folk. Walk the heath in bloom and you\'ll see why the Briaran fought for it; the thorn-flowers grow in soil that remembers the blood, and they bloom brightest where the oldest wounds were.',
 relatedTerms: ['briaran', 'frostwood-reach']
  },
  'skalds_landing': {
 id: 'skalds_landing',
 term: "Skald's Landing",
 type: 'location',
 region: 'frostwood-reach',
 summary: 'A Skald trading post on the northern river where Nordhalla longships dock to exchange cold-iron and whale oil for ironwood timber.',
 fullEntry: 'Skald\'s Landing is where the Frostwood Reach meets Nordhalla, and the meeting shows in the architecture: Skald timber longhouses standing among Thalren peat-stone walls, each side built by people who respect the other\'s stubbornness. The Skald traders bring cold-iron, whale oil, and glacier ice south, and they return with ironwood timber, heartwood resin, and Mimir-crafted storm-glass. The friction is constant and productive. Both peoples respect stoicism and oral tradition, and they don\'t yield on much else.',
 relatedTerms: ['frostwood-reach', 'house_skalvyr', 'house_thalreth', 'nordhalla']
  },
  'the_shifting_fen': {
 id: 'the_shifting_fen',
 term: 'The Shifting Fen',
 type: 'location',
 region: 'frostwood-reach',
 summary: 'A Mimir-held fen that physically changes position with the seasons, tended by Mist-Woven sentinels.',
 fullEntry: 'The Shifting Fen belongs to the Mist-Woven Mimir, a stretch of bogland that rearranges itself with the turning of the year. Paths that were solid ground last month are impassable mire today; new clearings open where dense marsh stood before. The Mist-Woven claim the fen is a living test of perception, rewarding those who do not rely on memory and punishing those who trust old maps. It is both a sacred site and a practical training ground for the Mimir\'s most dangerous operatives. Cross the Shifting Fen with an old map and the fen will move before you do; cross it without a map, and you may be the first to find where it has gone.',
 relatedTerms: ['frostwood-reach', 'mimir']
  },
  'mirror_mere': {
 id: 'mirror_mere',
 term: 'Mirror Mere',
 type: 'location',
 region: 'frostwood-reach',
 summary: 'A perfectly still lake settlement where Mask-Borne Mimir test their reflections against their masks to verify their identity holds.',
 fullEntry: 'Mirror Mere is the spiritual center of the Mask-Borne Mimir, a perfectly still lake that reflects not just the present but ripples with echoes of the near future. The Mimir built their settlement around it as both anchor and oracle, using the lake\'s reflections to verify their identities against the fog\'s erosion and to read coming events. The mere never ripples, even in storm weather, and the Mimir believe it is conscious, that it watches and remembers everything it reflects. Look into Mirror Mere and you\'ll see what the fog has taken from you, reflected back before you lost it; the Mimir say the lake remembers every face it has ever shown, even the ones whose owners no longer can.',
 relatedTerms: ['frostwood-reach', 'house_thalreth', 'mimir', 'rite-of-masks']
  },

  // NORDHALLA, New Locations
  'skadis_col': {
 id: 'skadis_col',
 term: "Skadi's Col",
 type: 'location',
 region: 'nordhalla',
 summary: 'A treacherous mountain pass between glacier-capped peaks, named for a figure of Skald pre-Binding legend.',
 fullEntry: 'Skadi\'s Col is the most dangerous pass in Nordhalla, a wind-scoured gap between two peaks where the air moves fast enough to strip flesh from bone. Named for a figure of Skald pre-Binding legend, the col is marked by cairns of frozen corpses, their expressions preserved in perfect, screaming clarity. Only the Skald Ice-Trackers can navigate it safely, and even they lose people every year. Cross the col with an Ice-Tracker or don\'t cross it at all; the wind doesn\'t negotiate, and the cairns are full of people who thought they could make it in a hurry.',
 relatedTerms: ['house_skalvyr', 'nordhalla', 'stel']
  },
  'vargtor': {
 id: 'vargtor',
 term: 'Vargtor',
 type: 'location',
 region: 'nordhalla',
 summary: 'A watchtower settlement atop a rocky tor rising above the glacier line, garrisoned by Skald Ice-Trackers.',
 fullEntry: 'Vargtor, Wolf-Tor in the Old Nord tongue, is a military garrison built atop a natural granite pillar that rises two hundred feet above the glacier line. Wolves gather at its base every winter, drawn by some affinity the Skald cannot explain but do not question. The garrison commands the eastern approaches to the Frozen Archive and serves as the first line of defense against Corvani raiding parties and glacier wyrms. In the tor\'s deepest chambers, runic carvings predating the Skald by centuries have drawn the attention of Rime-Born Rune Keepers. Climb to Vargtor\'s peak and you\'ll see why the wolves gather; the runic carvings below are older than the garrison, and the Rune Keepers still haven\'t decided whether they\'re reading them or answering them.',
 relatedTerms: ['house_skalvyr', 'nordhalla', 'rime_born']
  },
  'the_still_crag': {
 id: 'the_still_crag',
 term: 'The Still Crag',
 type: 'location',
 region: 'nordhalla',
 summary: 'A cliff face and glacial hollow perpetually frozen in absolute silence, where the Rime-Born perform memory-freezing rites.',
 fullEntry: 'The Still Crag is a cliff face where no wind blows, no sound carries, and the ice sculptures of unknown figures stand frozen in attitudes of supplication. The Rime-Born believe the crag is where the Warden\'s breath physically touched the mountain during the Glacier Bargain, freezing everything it touched into permanent, silent witness. Within the crag lies Frostcirque, a natural glacial amphitheater where the ice walls are covered in runic script. Here, the Rime-Born perform their Memory-Freezing rites, preserving their most important experiences in blocks of glacier ice stored in the walls for eternity. Stand on the Still Crag and you\'ll feel the silence press against your ears; the Warden\'s breath froze this place mid-word, and the word has never been spoken since.',
 relatedTerms: ['nordhalla', 'rime_born', 'the_warden', 'frostcirque']
  },
  'frostcirque': {
 id: 'frostcirque',
 term: 'Frostcirque',
 type: 'location',
 region: 'nordhalla',
 summary: 'A natural glacial amphitheater within the Still Crag, its ice walls covered in runic script, where the Rime-Born perform their Memory-Freezing rites.',
 fullEntry: 'Frostcirque is the heart of the Still Crag, a natural glacial amphitheater where the ice walls are covered in runic script so dense it reads as texture. Here the Rime-Born perform their Memory-Freezing rites, preserving their most important experiences in blocks of glacier ice stored in the walls for eternity. Pilgrims who press a palm to the scrim report a sensation of having always been cold, as though the amphitheater remembers every visitor. Press your hand to the Frostcirque ice and you\'ll feel every Rime-Born who pressed theirs before you; the memory-freezing works both ways, and the ice remembers hands as readily as it remembers rites.',
 relatedTerms: ['the_still_crag', 'rime_born', 'nordhalla']
  },
  'rooks_promontory': {
 id: 'rooks_promontory',
 term: "Rook's Promontory",
 type: 'location',
 region: 'nordhalla',
 summary: 'A high cliff over the frozen sea where the Corvani gather in vast, dark congregations to read prophecy in raven-flight.',
 fullEntry: 'Rook\'s Promontory is the Corvani\'s most sacred site in Nordhalla, a black obsidian cliff jutting over the frozen sea where ravens gather in thousands, their flight patterns interpreted as living prophecy by the Corvani shamans. The cliff is cold even by Nordhalla standards, and the Corvani dwellings carved into its face are accessible only to those who can fly or climb without rope. The Skald consider the promontory cursed; the Corvani consider it home. Climb the promontory and you\'ll see the ravens read the future in the sky; the Corvani will tell you what the flights mean, but they won\'t tell you whether the prophecy is for you or about you.',
 relatedTerms: ['corvani', 'nordhalla', 'vesperas_perch']
  },

  // SUNDALE, New Locations
  'sols_anvil_mesa': {
 id: 'sols_anvil_mesa',
 term: "Sol's Anvil Mesa",
 type: 'location',
 region: 'sundale',
 summary: 'A massive flat-topped mountain where Solvarn sun-priests hold ceremonies during rare moments of volcanic clarity.',
 fullEntry: 'Sol\'s Anvil Mesa is the spiritual high ground of Sundale, a massive basalt mesa whose flat surface has been carved with solar calendars, prophecy charts, and genealogical records stretching back to the Binding. When the volcanic haze clears enough to glimpse the buried sun\'s residual glow, Solvarn sun-priests ascend the mesa to conduct their holiest ceremonies. The mesa appears to float above the ashlands, an illusion of heat-shimmer, creating the impression that it has been lifted toward the sun it worships. Climb the Anvil at the right hour and you\'ll see the carved calendars glow with the residual light of the star they were cut to honor; the priests say the mesa remembers every dawn since the Binding, and the carvings are still being added.',
 relatedTerms: ['house_solvan', 'solbrand', 'sundale']
  },
  'the_ashen_escarpment': {
 id: 'the_ashen_escarpment',
 term: 'The Ashen Escarpment',
 type: 'location',
 region: 'sundale',
 summary: 'A long, steep slope of compacted volcanic ash forming Sundale\'s natural border, dotted with Solvarn watchtowers.',
 fullEntry: 'The Ashen Escarpment is Sundale\'s defensive wall, a miles-long ridge of compacted volcanic ash that rises sharply from the lowland approaches. Solvarn watchtowers dot the rim, their eternal signal-fires burning with heartwood resin and visible across the ashlands. The escarpment is treacherous to climb: the ash is packed hard as stone in places, but a wrong step can send a traveler sliding into glass-scarred gullies. It serves as both natural fortification and pilgrimage route for those approaching Emberspire from the lowlands. Climb the escarpment as a pilgrim and the signal-fires will track you the whole way; climb it as anything else, and the Solvarn will know before you reach the top.',
 relatedTerms: ['dawn_vigil', 'house_solvan', 'sundale']
  },
  'cinderhoodoo': {
 id: 'cinderhoodoo',
 term: 'Cinderhoodoo',
 type: 'location',
 region: 'sundale',
 summary: 'A cluster of fire-scorched rock spires on the ash plain, used as navigational landmarks by Thrask Emberth rangers.',
 fullEntry: 'Cinderhoodoo is a forest of rock spires rising from the ash plain like grasping fingers, each hoodoo crowned with a cap of harder stone that protects the softer pillar beneath. Some caps have melted and re-fused into grotesque, face-like shapes that change expression depending on the angle of the volcanic light. Thrask Emberth rangers use the hoodoos as navigational landmarks and shelter from the soot-storms, and the formations are slowly being adopted as sacred sites by a growing Pyrofiend cult. Walk the hoodoos at dusk and the faces will change before you\'ve passed them; the Pyrofiend say the spires are learning to look back, and the rangers don\'t disagree.',
 relatedTerms: ['emberth', 'pyrofiend', 'sundale', 'vulkars_karst']
  },
  'ember_lagoon': {
 id: 'ember_lagoon',
 term: 'Ember Lagoon',
 type: 'location',
 region: 'sundale',
 summary: 'Sundale\'s only port, a warm saltwater lagoon heated by volcanic vents where Emberth and Merryn traders coexist.',
 fullEntry: 'Ember Lagoon is Sundale\'s lifeline to the outside world, the only harbor where the water does not freeze, warmed perpetually by volcanic vents beneath the seabed. The lagoon glows orange-red at night, earning it the Merryn nickname "the Boiling Door." It is a rare point of genuine cooperation between Emberth, Solvarn, and Merryn: the Emberth control the port infrastructure, the Solvarn maintain the shrine to Sol on the eastern cliff, and the Merryn operate the shipping lanes. Three cultures, one harbor, constant tension, constant profit. Dock at the Boiling Door and you\'ll trade with three peoples who agree on nothing but the price of passage; the lagoon keeps the peace by being too valuable to fight over.',
 relatedTerms: ['basalt_shyr', 'emberth', 'house_solvan', 'sundale']
  },

  // ICEHEART SEA, New Locations
  'brinehorse_cove': {
 id: 'brinehorse_cove',
 term: "Brinehorse Cove",
 type: 'location',
 region: 'iceheart-sea',
 summary: 'A smuggler\'s inlet hidden behind ice-shoals, marked by bioluminescent lanterns.',
 fullEntry: 'Brinehorse Cove is the Iceheart Sea\'s most notorious black-market port, a sheltered inlet hidden behind a wall of grinding ice-shoals that only the most skilled Merryn pilots can navigate. Named for the phantom sea-horse said to lure ships onto the rocks, the cove is where contraband from every region changes hands without questions. Drun outcasts from the Bryngloom maintain a permanent presence here, running the memory-trade alongside traditional smuggling. Run the ice-shoals into the cove and you\'ll find every region\'s secrets for sale; the phantom sea-horse is a story the smugglers tell to explain the ships that don\'t come back, and not all of them are stories.',
 relatedTerms: ['house_mereval', 'iceheart-sea', 'neth']
  },
  'wraithsound': {
 id: 'wraithsound',
 term: 'Wraithsound',
 type: 'location',
 region: 'iceheart-sea',
 summary: 'A wide, deep inlet where the echoes of drowned sailors carry for miles and the water is said to listen.',
 fullEntry: 'Wraithsound is a place the Merryn navigate only with Myrathil guides, a wide, deep inlet perpetually shrouded in sea-mist where the echoes of the drowned carry for miles. The Myrathil Deep-Born claim the sound is alive, that it listens, remembers, and occasionally speaks in the voices of those it has swallowed. Ships that enter without a guide emerge with crews who refuse to describe what they heard, or worse, crews who speak only in the voices of the dead. Cross Wraithsound with a Myrathil guide or don\'t cross it; the sound remembers every voice it has swallowed, and it is always hungry for one more.',
 relatedTerms: ['iceheart-sea', 'myrathil']
  },
  'deepwell_archipelago': {
 id: 'deepwell_archipelago',
 term: 'Deepwell Archipelago',
 type: 'location',
 region: 'iceheart-sea',
 summary: 'A forty-mile chain of ice-islands concealing underwater Myrathil cave-cities beneath the frozen surface.',
 fullEntry: 'The Deepwell Archipelago is the Deep-Born Myrathil\'s hidden civilization, a chain of ice-islands stretching forty miles, each one concealing underwater cave-cities beneath its frozen surface. The Deep-Born maintain a culture entirely separate from the surface world, emerging only to trade and to conduct their Drowning Rites, rituals that surface-dwellers are not permitted to witness. The archipelago is connected by submerged tunnels that only the Myrathil can navigate. Sail the forty-mile chain and you\'ll see only ice; the cities are beneath it, and the Deep-Born decide whether you ever see them, because the tunnels answer to them and the ice doesn\'t answer to anyone.',
 relatedTerms: ['house_mereval', 'iceheart-sea', 'myrathil']
  },
  'spindrift_lagoon': {
 id: 'spindrift_lagoon',
 term: 'Spindrift Lagoon',
 type: 'location',
 region: 'iceheart-sea',
 summary: 'A coral-reef lagoon warmed by volcanic currents, glowing blue-green with cultivated bioluminescence.',
 fullEntry: 'Spindrift Lagoon is the most beautiful settlement in the Iceheart Sea, a warm-water anomaly where coral survived the Deepening, sheltered by volcanic thermal dynamics. The Breakers-Born Myrathil have tended the reef for centuries, cultivating bioluminescent organisms that illuminate the entire lagoon in shades of blue-green. Merryn traders dock at the surface platforms while Myrathil artisans work in underwater markets grown from living coral. The lagoon is visible for miles across the frozen sea, a beacon of warmth and light in the endless dark. Dock at Spindrift and you\'ll see the only color the Iceheart has left; the Myrathil grew it on purpose, because someone had to remember what light looked like.',
 relatedTerms: ['house_mereval', 'iceheart-sea', 'myrathil']
  },

  // CRAGJAW PEAKS, New Locations
  'deepchasm_keep': {
 id: 'deepchasm_keep',
 term: 'Deepchasm Keep',
 type: 'location',
 region: 'cragjaw-peaks',
 summary: 'A Tessen fortress spanning a massive fissure, controlling the only reliable passage between upper peaks and lower galleries.',
 fullEntry: 'Deepchasm Keep is a feat of Tessen engineering, a fortress built across a massive mountain fissure, its foundations anchored into both cliff walls with iron stakes driven into living rock. The only crossing is a bridge of Groven-calcified bone that groans underfoot. The keep controls the primary passage between the upper peaks and the lower mining galleries, making it both a military installation and a toll-collection point of enormous strategic value. Cross the bone-bridge at Deepchasm and you\'ll pay the Tessen toll on one side and hear the Groven bone groan beneath you on the other; both are the price of passage, and neither is negotiable.',
 relatedTerms: ['cragjaw-peaks', 'groven', 'house_tesshan', 'iron_ravine']
  },
  'the_great_gorge': {
 id: 'the_great_gorge',
 term: 'The Great Gorge',
 type: 'location',
 region: 'cragjaw-peaks',
 summary: 'A mile-wide canyon bridged by seven calcified bone-spans grown from willing Groven ancestors.',
 fullEntry: 'The Great Gorge is the Cragjaw Peaks\' primary thoroughfare, a mile-wide, bottomless tear in the mountain range bridged by seven calcified bone-spans, each grown from the skeleton of a willing Groven ancestor. The gorge is the Groven\'s greatest wield: every passage is tolled, every toll is negotiated, and every negotiation favors the Groven. The Bone-Weavers who maintain the spans are among the most respected, and most feared, people in the Peaks. Cross the Great Gorge and you\'ll negotiate with the Bone-Weavers for every step; the Groven built the road from their dead, and they will not let you cross it for free.',
 relatedTerms: ['cragjaw-peaks', 'groven', 'stags_rest_moraine', 'vat_breakers_guild']
  },
  'gearworks_gulch': {
 id: 'gearworks_gulch',
 term: 'Gearworks Gulch',
 type: 'location',
 region: 'cragjaw-peaks',
 summary: 'A Fexric industrial settlement powered by geothermal vents, producing the finest clockwork in the known world.',
 fullEntry: 'Gearworks Gulch is the industrial heart of the Cragjaw Peaks, a narrow ravine packed with geothermal-powered machinery that runs day and night without pause. The Fexric artisans here produce the finest clockwork mechanisms, automaton components, and refined metals in the known world. The Chief Artificer governs through competitive exhibition, and the gulch\'s atmosphere of feverish invention attracts the most brilliant, and most unstable, engineers from every region. Walk the Gulch and you\'ll hear the machines that never stop; the Fexric tune them like instruments, and the clockwork they produce is the only thing in the Peaks that runs on time.',
 relatedTerms: ['cragjaw-peaks', 'fexrick', 'house_tesshan', 'sump_rift']
  },
  'frostmaw_massif': {
 id: 'frostmaw_massif',
 term: 'Frostmaw Massif',
 type: 'location',
 region: 'cragjaw-peaks',
 summary: 'The compact mountain group surrounding Frostmaw Holdfast, perpetually shrouded in the Tesshan blizzard.',
 fullEntry: 'The Frostmaw Massif is a cluster of peaks so dense they form a single, nearly impregnable natural fortress, the mountain stronghold that House Tesshan traded visibility to protect. The massif is perpetually shrouded in the enchanted blizzard, and navigation without Groven bone-compasses or intimate knowledge of the ice-tunnels is suicide. It is both the most defensible and most isolated position in the Cragjaw Peaks. Enter the Massif without a bone-compass and the blizzard will decide where you go; the Tesshan traded sight for safety, and the blizzard doesn\'t give either back.',
 relatedTerms: ['cragjaw-peaks', 'frostmaw_holdfast', 'house_tesshan']
  },

  // SUNDRIFT VALE, New Locations
  'starfall_vale': {
 id: 'starfall_vale',
 term: 'Starfall Vale',
 type: 'location',
 region: 'sundrift-vale',
 summary: 'A deep valley carpeted with crystalline shards of trapped starlight, the impact site of Sol\'s shattered celestial court.',
 fullEntry: 'Starfall Vale is the most sacred site in the Sundrift Vale, a crater where the physical residue of Sol\'s shattered celestial court impacted the earth during the Breach. Thousands of crystalline shards carpet the valley floor, glowing with trapped starlight and producing harmonic tones that the Sylen Astril call the Memory of Sol. The vale is a place of pilgrimage for every Astril caste and a source of prophecy through the Star-Oracle who tends the First Shard. Walk the Starfall floor and you\'ll hear Sol\'s court sing from the shards; the Sylen say the starlight remembers what it was before the Breach, and the Star-Oracle is the only one who can translate it.',
 relatedTerms: ['astril', 'house_ordavan', 'nova_heath', 'sundrift-vale', 'the_breach']
  },
  'the_unlit_knoll': {
 id: 'the_unlit_knoll',
 term: 'The Unlit Knoll',
 type: 'location',
 region: 'sundrift-vale',
 summary: 'A small hill where Unlit Astril hold secret judgments, a place where fire refuses to burn and no star-glow can approach.',
 fullEntry: 'The Unlit Knoll is the Unlit Veil\'s most closely guarded site, a small, rounded hill where fire refuses to burn and no light persists. The Unlit have shaped this quality into a tool: their secret judgments, dead-drops, and intelligence operations all center on a place that Astril with constellation-spirits in their blood physically cannot approach. It is a hole in the light of the world, and the Unlit Veil has made it their headquarters. Stand on the Unlit Knoll and no starlight will touch you; for the Unlit, that is the point, and for every Lit Astril, that is the warning.',
 relatedTerms: ['astril', 'nova_heath', 'sundrift-vale']
  },
  'ancestor_wold': {
 id: 'ancestor_wold',
 term: 'Ancestor Wold',
 type: 'location',
 region: 'sundrift-vale',
 summary: 'High, open ground where the Ordan dead are honored in vast earthen barrows that hum with ancestral resonance.',
 fullEntry: 'The Ancestor Wold is the spiritual anchor of the Ordan people, high, open ground where thirty-one generations of chieftains lie buried beneath earthen barrows that hum with a constant, resonant tone. The hum guides Ordan herders across the starless steppe and marks the Wold as sacred ground where silence is enforced by custom stronger than law. To speak above a whisper here is to invite the wrath of every ancestor buried in the mounds. Walk the Wold and you\'ll hear the thirty-one generations hum through the barrows; the Ordan navigate by the sound, and the ancestors expect silence from anyone who passes.',
 relatedTerms: ['house_ordavan', 'sundrift-vale', 'the_long_steppe']
  },
  'morrens_bogpost': {
 id: 'morrens_bogpost',
 term: "Morren's Bogpost",
 type: 'location',
 region: 'sundrift-vale',
 summary: 'A Morren trading outpost at the forest-steppe edge, the primary exchange point between Bryngloom and Sundrift goods.',
 fullEntry: 'Morren\'s Bogpost is the primary trade gateway between the Bryngloom Forest and the Sundrift Vale, a cluster of squat peat-stone buildings that smell perpetually of bog-water. Morren debt-brokers here exchange Bryngloom goods, fungal lights, memory-glass, bog-mushroom reagents, for Ordan wool and hide. The credit terms are always generous. The interest always compounds. The Bogpost is the Morren\'s most successful financial outpost outside the Bryngloom. Trade at the Bogpost and you\'ll get generous terms; the Morren count on the interest, not the principal, and the bog-water smell is the last thing you\'ll remember about the deal you shouldn\'t have made.',
 relatedTerms: ['bryngloom-forest', 'house_morrath', 'neth', 'sundrift-vale', 'thalrens_ledger_post']
  },

  // BRYNGLOOM FOREST, New Locations
  'widows_quagmire': {
 id: 'widows_quagmire',
 term: "Widow's Quagmire",
 type: 'location',
 region: 'bryngloom-forest',
 summary: 'A treacherous bog where the ground liquefies without warning, named for the Morren widows who walked in to join their debt-dead husbands.',
 fullEntry: 'Widow\'s Quagmire is the Bryngloom Forest\'s most lethal terrain, a stretch of bog where the ground has no solid bottom and the peat is active, digesting anything organic that sinks into it. The quagmire earned its name from the Morren widows who, according to legend, walked into the bog to join their husbands whose debts had killed them. Their hands are said to still clutch unsigned contract-fragments, preserved forever in the acidic peat, reaching upward from depths that no one has survived measuring. Cross the Quagmire and you may feel a hand catch your ankle; the widows are still holding their unsigned contracts, and the peat preserves everything but the terms.',
 relatedTerms: ['bryngloom-forest', 'house_morrath']
  },
  'black_fen': {
 id: 'black_fen',
 term: 'Black Fen',
 type: 'location',
 region: 'bryngloom-forest',
 summary: 'An acidic fen where nothing grows, the Neth\'s dumping ground for voided contracts and legally-annihilated individuals.',
 fullEntry: 'The Black Fen is the Neth contract court\'s final solution, a fen of such extreme acidity that bone dissolves within hours and nothing grows, nothing lives, and nothing is remembered. Failed contracts, dissolved agreements, and legally-voided individuals are cast into its depths. The Neth call it the Final Clause. It is the only place in the Bryngloom where the Root-Veil has no presence and the Keeper of the Last Threshold has no jurisdiction, a legal silence that serves as both garbage dump and ultimate threat. Stand at the Black Fen\'s edge and you\'ll understand the Neth\'s final threat; the Final Clause dissolves everything, and the Keeper itself won\'t follow you in.',
 relatedTerms: ['bryngloom-forest', 'drowned_dingle', 'house_morrath', 'keeper_of_the_last_threshold', 'neth']
  },
  'vel_keth_bayou': {
 id: 'vel_keth_bayou',
 term: 'Vel-Keth Bayou',
 type: 'location',
 region: 'bryngloom-forest',
 summary: 'A marshy channel flowing against the natural gradient, named in the Neth tongue as "the water that remembers."',
 fullEntry: 'Vel-Keth Bayou, "the water that remembers" in the Neth tongue, is a marshy channel that flows uphill, defying physics in ways the Neth insist are perfectly legal under the First Contract. Memory-glass deposits line the banks, glowing faintly with recorded thoughts of the long-dead. The Kessen weavers who tend the bayou harvest the memory-glass for Atropolis\'s contract-archives and sell the excess to Thalren scribes desperate for anything that preserves information against the fog. Sail the Vel-Keth and you\'ll hear the dead think in the banks; the water flows uphill because the First Contract says it can, and the Neth have never found a clause that says it can\'t.',
 relatedTerms: ['atropolis', 'bryngloom-forest', 'neth']
  },
  'aran_glen': {
 id: 'aran_glen',
 term: 'Aran-Glen',
 type: 'location',
 region: 'bryngloom-forest',
 summary: 'A Kessen Neth settlement where every structure is grown from living ironwood, governed by a steward bound to the grove\'s health.',
 fullEntry: 'Aran-Glen is proof that architecture can be alive, a Kessen Neth settlement where every wall, arch, and roof has been coaxed from living ironwood over centuries of patient horticulture. The Grove-Steward who governs the glen is legally bound to its health: if the grove sickens, their authority voids automatically. It is a governance system designed to prevent corruption through pure self-interest, and it has produced one of the most harmonious settlements in the Bryngloom. Walk Aran-Glen and you\'ll walk through a living contract; the ironwood walls grew because the Steward kept them healthy, and the Steward stays honest because the walls would wilt if they didn\'t.',
 relatedTerms: ['atropolis', 'bryngloom-forest', 'neth']
  },
  'hunters_gully': {
 id: 'hunters_gully',
 term: "Hunter's Gully",
 type: 'location',
 region: 'bryngloom-forest',
 summary: 'A water-worn ravine used by Vreken for coordinated ambush hunts, illuminated by bioluminescent kill-zone markers.',
 fullEntry: 'Hunter\'s Gully is Marked Vreken territory, a narrow, water-worn ravine where the walls force prey into single-file and the Vreken drop from above in coordinated strikes. The gully floor is carpeted with bioluminescent moss that the Vreken have cultivated in distinct brightness patterns to mark their kill-zones. Trespassers are considered sport, and the Vreken have never lost a hunt in their home territory. Walk the Gully without an invitation and the moss will mark you as prey; the Vreken drop from above, and the brightness patterns tell them exactly where to land.',
 relatedTerms: ['bryngloom-forest', 'vreken']
  },
  'fangmere_grove': {
 id: 'fangmere_grove',
 term: 'Fangmere Grove',
 type: 'location',
 region: 'bryngloom-forest',
 summary: 'A sacred Vreken wood where blood-rites and ancestral communion ceremonies are held in preternatural silence.',
 fullEntry: 'Fangmere Grove is the Vreken\'s most sacred site outside the Sunken Spire, a perfect circle of ironwood trees whose roots intertwine with Vreken ancestral bones. The grove is preternaturally quiet; even the ambient bioluminescence dims here, as if the light itself shows respect. The Clean Vreken hold their blood-rites and naming ceremonies here, and the Crypt-Council convenes beneath the central tree when matters of ancestral importance demand judgment. Step into Fangmere and the light will dim around you; the Vreken ancestors are listening, and the grove expects the same respect from the living that it gets from the dead.',
 relatedTerms: ['bryngloom-forest', 'sunken_spire', 'vreken']
  },

  // FROSTWOOD REACH
  'the_shallows': {
 id: 'the_shallows',
 term: 'The Shallows',
 type: 'location',
 region: 'frostwood-reach',
 summary: 'A labyrinth of mist-veiled ravines and marshy pine stands surrounding Greymark Keep, where ironwood roots drift when the mists thicken.',
 fullEntry: 'The Shallows are the first test of any traveler entering the Frostwood Reach, a tangle of shallow ravines and silt-roads where the fog presses close and rusted lantern-posts mark paths that may no longer exist. Mist-Sentinels patrol the margins, but even they rely on ironwood root-patterns to navigate, as the roots themselves seem to shift when no one is watching. Gambrels and Grefs hunt here, drawn by the desperation of lost travelers and the oaths they make to find their way out. Enter the Shallows and the fog will test whether you meant the oaths you made to get through; the Gambrel can taste a broken promise, and the Shallows are where the desperate come to make them.',
 relatedTerms: ['frostwood-reach', 'gambrel', 'gref', 'greymark_keep', 'ironwood_heart', 'varis']
  },
  'scribes_tower': {
 id: 'scribes_tower',
 term: "Scribes' Tower",
 type: 'location',
 region: 'frostwood-reach',
 summary: 'A vertical archive built inside the hollow shell of a dead ironwood, where archivists copy records before the fog erases them.',
 fullEntry: "The Scribes' Tower is the Frostwood Reach's bulwark against forgetting, a hollowed petrified ironwood converted into a vertical cathedral of parchment and ink. Archivists work in silent shifts, copying maps and genealogies onto calfskin vellum in races against the fog that will eventually consume their memories of what they have written. The Tower connects directly to the Ledger Halls below, where older records lie scattered among petrified roots and the silent echoes of clerks who forgot their own names. Climb the Scribes' Tower and you'll hear the scratching that never stops; the archivists are copying faster than the fog can erase, and they are losing.",
 relatedTerms: ['frostwood-reach', 'greymark_keep', 'house_thalreth', 'ledger_halls', 'caedren-thalreth', 'vellan-archivist']
  },
  'ledger_halls': {
 id: 'ledger_halls',
 term: 'Ledger Halls',
 type: 'location',
 region: 'frostwood-reach',
 summary: 'A partially collapsed underground archive from the first century of the Dimming, where chained books of records lie among petrified roots.',
 fullEntry: 'The Ledger Halls are a tomb of knowledge, an underground archive dating to the first century after the sun\'s death, now partially collapsed and shrouded in the same fog that plagues the surface above. Chained volumes of records lie scattered among the petrified roots, their pages stiff with cold and damp. The Forgotten Archivists who guard the deeper chambers have been here so long that they have forgotten their own names, knowing only the records they tend and the importance of preserving them. Descend into the Ledger Halls and you\'ll find clerks who forgot their names but remember every page they\'ve guarded; the fog took the men and left the records, and the records are all the men have left to be.',
 relatedTerms: ['frostwood-reach', 'gref', 'ironwood_heart', 'scribes_tower']
  },
  'ironwood_heart': {
 id: 'ironwood_heart',
 term: 'Ironwood Heart',
 type: 'location',
 region: 'frostwood-reach',
 summary: 'The deepest, darkest grove of the Frostwood Reach, where a titanic glowing white tree stands at the center of a stagnant mist-lake.',
 fullEntry: 'The Ironwood Heart is the deepest, most dangerous grove in the Frostwood Reach, so dense that the mist forms a heavy, stagnant lake on the forest floor and the canopy admits no light whatsoever. At its center stands a titanic white tree whose sap remains warm eight centuries after every other ironwood petrified, a living beacon that draws both desperate survivalists and the horrific predators that hunt them. The Unshorn Briaran claim the Heart as sacred ground, tending the white tree with thorn-blood rituals that predate the Fog Compact. Reach the white tree and you\'ll find the only warmth in the Reach that never asked for a bargain; the Briaran say it remembers the forest before the fog, and it is still waiting for the fog to end.',
 relatedTerms: ['briaran', 'frostwood-reach', 'gambrel', 'ledger_halls', 'the_shallows', 'bri-vessela', 'sylas', 'thorn-speaker', 'selene', 'apex']
  },

  // NORDHALLA
  'bloodhammer_sump': {
 id: 'bloodhammer_sump',
 term: 'Bloodhammer Sump',
 type: 'location',
 region: 'nordhalla',
 summary: 'A deep volcanic crater where geothermal heat powers the massive iron smelters that forge the Skalds\' runic cold-iron axes.',
 fullEntry: 'The Bloodhammer Sump is the industrial forge-heart of Nordhalla, a deep, steam-venting volcanic crater ringed by towering walls of ice that channel the geothermal heat into smelters of staggering size. The Bloodhammer Clan of Rime-Born work the forges here, their frost-touched hands immune to burns that would kill an ordinary smith, forging runic cold-iron axes that hold their edge in temperatures that would shatter ordinary steel. The contrast between the glacial walls and the volcanic floor produces a perpetual steam-storm that the Skald have learned to read as a form of divination. Stand at the Sump\'s edge and you\'ll feel the ice wall behind you and the forge-fire ahead; the Bloodhammer work where the two meet, because the cold-iron they forge will hold an edge nowhere else.',
 relatedTerms: ['fjord_gate', 'house_skalvyr', 'nordhalla', 'rime_born']
  },
  'fjord_gate': {
 id: 'fjord_gate',
 term: 'Fjord-Gate',
 type: 'location',
 region: 'nordhalla',
 summary: 'A massive coastal harbor inside a black fjord, guarded by towering stone doors, flanked by the deep water of the Black Firth.',
 fullEntry: 'Fjord-Gate is Nordhalla\'s primary harbor and the greatest engineering achievement of House Skalvyr, a deep coastal fjord sealed by towering stone doors that slide shut to block sea-storms. The harbor opens directly into the Black Firth, a narrow sea inlet flanked by obsidian cliffs where perfectly reflective water mirrors the dark sky. The firth is the Skald\'s primary naval route to the Iceheart Sea, navigated by starlight since no sunlight has penetrated its depths in eight centuries. Sea-Guard patrols navigate this corridor, where reflections showing non-existent entities test their sanity. Sail the Black Firth and you\'ll see things in the water that aren\'t in the sky; the Sea-Guard have learned to trust the stars over the reflection, and the reflection doesn\'t like being ignored.',
 relatedTerms: ['bloodhammer_sump', 'frozen_archive', 'house_skalvyr', 'nordhalla', 'halvar-skalvyr', 'frigga-skalvyr']
  },
  'hunger_glaciers': {
 id: 'hunger_glaciers',
 term: 'Hunger Glaciers',
 type: 'location',
 region: 'nordhalla',
 summary: 'A vast, shifting expanse of pure whiteout and deadly crevasses where the ice moves with predatory intent.',
 fullEntry: 'The Hunger Glaciers are the killing ground of Nordhalla, a vast, shifting expanse of pure whiteout where the wind carries a predatory howl and the crevasses open and close with the grinding of the ice sheets. Travelers swear the glaciers move with intention, herding caravans toward dead ends and freezing them into permanent monuments to their own hubris. The Endurance Purists who train here consider survival a spiritual practice, deliberately stranding themselves for weeks to prove their worth to the Rime-Born ancestors. Cross the Hunger Glaciers and you\'ll feel the ice herd you; the Purists survive by refusing to go where the glacier wants them, and the glacier always wants them somewhere they won\'t come back from.',
 relatedTerms: ['house_skalvyr', 'nordhalla', 'rimors_hearth', 'stel']
  },
  'rimors_hearth': {
 id: 'rimors_hearth',
 term: "Rimor's Hearth",
 type: 'location',
 region: 'nordhalla',
 summary: 'The volcanic ruins of a great mountain keep buried by a sudden glacier advance, still warmed by a few stubborn steam vents.',
 fullEntry: 'Rimor\'s Hearth is a monument to the glacier\'s indifference, a great mountain keep that was buried in a single season when the Hunger Glaciers surged during the first century of the Dimming. A few steam vents still pierce the ice, keeping patches of the black basalt ruins warm enough to shelter freezing travelers and the smugglers who prey on them. Fjord-Riders use the Hearth as a waystation on the dangerous route between the Frozen Archive and the eastern approaches. Shelter at Rimor\'s Hearth and you\'ll sleep in a ruin the glacier swallowed and spat back; the steam vents still warm the basalt, and the smugglers still warm themselves on both.',
 relatedTerms: ['frozen_archive', 'hunger_glaciers', 'nordhalla', 'stel']
  },
  'vesperas_perch': {
 id: 'vesperas_perch',
 term: "Vespera's Perch",
 type: 'location',
 region: 'nordhalla',
 summary: 'A Corvani cliff-settlement named for the matriarch Vespera, reachable only by rope-ladder and gliding on fixed lines.',
 fullEntry: 'Vespera\'s Perch is the largest permanent Corvani settlement in Nordhalla, a cluster of dwellings carved into the high caves of the eastern mountains, named for the matriarch who led her flock here during the Glacier Bargain. The settlement is inaccessible from the ground, reachable only by rope-ladders and fixed gliding lines that the Corvani navigate with avian grace. The Skald tolerate the Perch because the Corvani trade raven-feather cloaks and storm-predictions of uncanny accuracy, reading prophecies in the flight patterns of the ravens that circle the mountain. Climb to the Perch and you\'ll need wings or rope; the Corvani will lower the latter if they think you\'re worth the climb, and the ravens will tell them whether you are.',
 relatedTerms: ['corvani', 'house_skalvyr', 'nordhalla', 'rooks_promontory']
  },

  // CRAGJAW PEAKS
  'the_spans': {
 id: 'the_spans',
 term: 'The Spans',
 type: 'location',
 region: 'cragjaw-peaks',
 summary: 'A terrifying network of arching bone bridges linking the peaks above the blizzard-clouds, grown from Groven ancestors\' calcified skeletons.',
 fullEntry: 'The Spans are the Cragjaw Peaks\' only thoroughfares above the whiteout, a network of arching bridges grown from the calcified skeletons of willing Groven dead, spanning bottomless chasms where the blizzard rages below. Each span represents a Groven ancestor who chose to give their bones to connect the peaks, a sacrifice that the Groven honor with eternal maintenance and the Tessen Scouts cross with white-knuckled terror. Chasm-Stalkers nest in the supports, patient and hungry. Cross a Span and you walk on the bones of someone who chose to become the road; the Groven maintain them because the dead asked them to, and the Chasm-Stalkers nest in them because the dead don\'t mind.',
 relatedTerms: ['ancestor_gaps', 'cragjaw-peaks', 'frostmaw_holdfast', 'groven']
  },
  'ancestor_gaps': {
 id: 'ancestor_gaps',
 term: 'The Ancestor-Gaps',
 type: 'location',
 region: 'cragjaw-peaks',
 summary: 'An ancient vertical burial valley where the Groven grow their bone-spans, its walls honeycombed with thousands of burial niches.',
 fullEntry: 'The Ancestor-Gaps are the most sacred site in Groven civilization, a vertical valley where the rock walls are honeycombed with thousands of burial niches, each one containing a Groven ancestor whose bones may one day be called upon to grow a new span. The air hums with a deep, constant vibration as the mountain winds pass through the ancestral bones, producing a tone the Bone-Weavers interpret as the voices of the dead. It is here that new spans are germinated, the bones of the recently deceased planted in the cliff face to begin their centuries-long calcification. Stand in the Ancestor-Gaps and you\'ll hear the dead hum through their own bones; the Groven plant their dead here to become roads, and the dead agree because the living still need to cross.',
 relatedTerms: ['cragjaw-peaks', 'groven', 'the_spans', 'vat_breakers_guild']
  },
  'sump_galleries': {
 id: 'sump_galleries',
 term: 'Sump Galleries',
 type: 'location',
 region: 'cragjaw-peaks',
 summary: 'Toxic mining shafts beneath the mountain peaks where leather-masked miners extract sulfur and coal-iron amidst volcanic gases.',
 fullEntry: 'The Sump Galleries are the poisoned underbelly of the Cragjaw Peaks, the lower mining shafts where Tessen miners in leather respirators extract sulfur and coal-iron from seams that bleed volcanic gas. The air is warm but heavy with toxins, and the shadows hide scurrying, multi-legged horrors that the Fexric Scavengers harvest for alchemical components. The galleries connect to both Frostmaw Holdfast above and the Lost Brood Vats below, making them the most dangerous transit corridor in the Peaks. Descend the Sump Galleries with a respirator or don\'t descend them at all; the Fexric Scavengers breathe the gas fine, and they\'re the ones who decide whether you get to keep yours.',
 relatedTerms: ['cragjaw-peaks', 'fexrick', 'frostmaw_holdfast', 'sump_rift']
  },
  'lost_brood_vats': {
 id: 'lost_brood_vats',
 term: 'Lost Brood Vats',
 type: 'location',
 region: 'cragjaw-peaks',
 summary: 'Deep subterranean vaults of cracked stone chambers once used to cultivate biological life, now guarded by feral Wyrd-horrors.',
 fullEntry: 'The Lost Brood Vats are the Deep Alchemists\' original laboratory, a deep, subterranean vault of cracked stone chambers where an unknown race once cultivated biological life in petrified egg-casings and strange runic tubing. The Feral Fexric who have claimed the upper chambers are descended from the Alchemists\' servitors, warped by centuries of exposure into something only nominally Fexric. The deeper chambers remain sealed, and the scraping sounds that emanate from behind the sealed doors suggest that the Alchemists\' oldest experiments may still be growing.',
 relatedTerms: ['cragjaw-peaks', 'deep_alchemists', 'groven']
  },
  'iron_ravine': {
 id: 'iron_ravine',
 term: 'Iron Ravine',
 type: 'location',
 region: 'cragjaw-peaks',
 summary: 'A narrow, ore-rich gorge streaked red and black, where mine-shafts honeycomb the cliff faces above precarious rope-bridges.',
 fullEntry: 'The Iron Ravine is the Cragjaw Peaks\' primary source of cold-iron, a narrow gorge where volcanic magnetite stains the walls in streaks of red and black and the air is thick with metallic dust. Mine-shafts honeycomb the cliff faces, connected by wooden platforms and rope-bridges that sway in the constant wind. The Sump-Miners who work the ravine are a hard people, accustomed to cave-ins, toxic gas, and the Scrabs that nest in the deepest seams.',
 relatedTerms: ['cragjaw-peaks', 'deepchasm_keep', 'house_tesshan']
  },
  'stags_rest_moraine': {
 id: 'stags_rest_moraine',
 term: "Stag's Rest Moraine",
 type: 'location',
 region: 'cragjaw-peaks',
 summary: 'A massive glacial deposit shaped like a sleeping stag, sacred to the Groven, where every stone surface is carved with lineage petroglyphs.',
 fullEntry: 'Stag\'s Rest Moraine is the Groven\'s most sacred gathering ground, a massive deposit of shattered rock and ancient ice naturally shaped like a sleeping stag, a formation the Groven consider a message from the mountain itself. Every exposed surface of stone is carved with petroglyphs tracing Groven lineage back to the Vat-Breakers\' revolt, and the Bone-Weavers hold their most important ceremonies here, invoking the ancestors whose bones form the spans that bind the Peaks together.',
 relatedTerms: ['cragjaw-peaks', 'groven', 'the_great_gorge', 'vat_breakers_guild']
  },
  'sump_rift': {
 id: 'sump_rift',
 term: 'Sump Rift',
 type: 'location',
 region: 'cragjaw-peaks',
 summary: 'A thousand-foot underground fissure slick with chemical runoff, where strange fungal colonies feed on forge-slag and mechanical parts.',
 fullEntry: 'The Sump Rift is the Cragjaw Peaks\' abyss, an underground fissure that descends for thousands of feet, its walls slick with chemical runoff and industrial residue from centuries of Fexric industry. Fungal colonies thrive in the depths, feeding on forge-slag and corroded machinery in an substrate that exists nowhere else in the known world. The Fexric Scavengers who dare the rift\'s upper reaches return with materials of extraordinary alchemical potential, and stories of things growing in the dark that have learned to eat metal.',
 relatedTerms: ['cragjaw-peaks', 'fexrick', 'gearworks_gulch', 'sump_galleries']
  },

  // SUNDALE
  'great_forge': {
 id: 'great_forge',
 term: 'The Great Forge',
 type: 'location',
 region: 'sundale',
 summary: 'A sprawling volcanic cavern city powered by the world\'s magma-core, producing refined cold-iron for all seven regions.',
 fullEntry: 'The Great Forge is Sundale\'s industrial heart and the largest smelting operation in the known world, a sprawling city of black iron and basalt built inside a volcanic cavern warmed by a branch of the world\'s magma-core. The Emberth forge-masters who tend the geothermal bellows produce refined cold-iron in quantities that supply every region on the continent, and the city\'s population of smiths, miners, and merchants makes it second only to the Harath-Vault in Sundale importance. The heat is oppressive, the noise is constant, and the forges never sleep.',
 relatedTerms: ['basalt_shyr', 'emberth', 'harath_vault', 'house_solvan', 'slag_gulch', 'sundale']
  },
  'emberspire_caldera': {
 id: 'emberspire_caldera',
 term: 'Emberspire Caldera',
 type: 'location',
 region: 'sundale',
 summary: 'The active, soot-choked volcanic mouth of Emberspire, where ancient fire-weaving entities dwell among the molten glass.',
 fullEntry: 'The Emberspire Caldera is the screaming mouth of Sundale\'s world-heart volcano, an active, soot-choked caldera that continuously vents ash and molten glass into the dark sky. The heat is lethal to all but the most hardened Emberth, and the volcanic vents are home to fire-weaving elemental entities older than the Dimming itself. Pyrofiend cultists make pilgrimages to the caldera\'s rim to commune with the Cinder-Fiends that nest in the molten rock, returning with scorched eyes and prophecies of burning.',
 relatedTerms: ['cinder_badlands', 'emberspire', 'harath_vault', 'pyrofiend', 'sundale']
  },
  'basalt_shyr': {
 id: 'basalt_shyr',
 term: 'Basalt Shyr',
 type: 'location',
 region: 'sundale',
 summary: 'A trade outpost atop cooling basalt columns on the Sundale border, adjacent to the steaming waters of the Cinder Strait.',
 fullEntry: 'Basalt Shyr is Sundale\'s window to the outside world, a trade outpost built atop a formation of cooling basalt columns adjacent to the Cinder Strait, a narrow sea passage between two volcanic islands where the water steams perpetually and the cliffs weep molten rock. Merryn sailors navigate the dangerous strait at tremendous risk, as the passage halves the journey to the harbor but exposes ships to boiling water and Cinder-Fiends. Basalt Shyr serves as neutral ground where commerce outweighs sun-worship, and merchants exchange metals and volcanic coal for Bryngloom timber and fungal-lights.',
 relatedTerms: ['cinder_badlands', 'ember_lagoon', 'great_forge', 'house_solvan', 'sundale']
  },
  'cinder_badlands': {
 id: 'cinder_badlands',
 term: 'Cinder Badlands',
 type: 'location',
 region: 'sundale',
 summary: 'A vast desert of black obsidian sands and jagged glass spires where toxic soot storms strip the flesh from the unwary.',
 fullEntry: 'The Cinder Badlands are Sundale\'s killing ground, a vast, windswept desert of black obsidian sands and jagged glass spires where the wind carries toxic soot and travelers must wrap themselves in heavy leather or risk having their eyes gouged by flying glass-shards. The Thrask Emberth rangers who patrol this wasteland are among the hardiest people in the known world, navigating by thermal vent patterns and the positions of the hoodoo formations that serve as the only landmarks in an ocean of black sand.',
 relatedTerms: ['basalt_shyr', 'emberspire_caldera', 'emberth', 'sundale']
  },
  'vulkars_karst': {
 id: 'vulkars_karst',
 term: "Vulkar's Karst",
 type: 'location',
 region: 'sundale',
 summary: 'A honeycombed limestone landscape riddled with underground rivers and sinkholes, heated to boiling by geothermal vents.',
 fullEntry: 'Vulkar\'s Karst is a geological impossibility made real, a honeycombed limestone landscape riddled with underground rivers heated to boiling by geothermal vents, depositing vivid orange and red crystals along every cave wall. Named for the Emberth forge-master who first mapped its depths, the karst connects to the Harath-Vault through miles of submerged passages that only the Korr Emberth dare to navigate. The mineral-rich waters produce crystals of extraordinary alchemical value, but the combination of boiling water, unstable limestone, and volcanic gas makes every expedition a gamble with death.',
 relatedTerms: ['cinderhoodoo', 'emberth', 'harath_vault', 'sundale']
  },
  'slag_gulch': {
 id: 'slag_gulch',
 term: 'Slag Gulch',
 type: 'location',
 region: 'sundale',
 summary: 'A narrow ravine settlement built on forge waste, where Emberth and Groven workers salvage metals from industrial debris.',
 fullEntry: 'Slag Gulch is Sundale\'s monument to the principle that nothing useful should be wasted, a permanent foundry town built inside a narrow ravine filled with centuries of forge waste and industrial debris. Emberth and Groven workers process the slag for salvageable metals in operations that are hot, loud, and acrid enough to strip paint from iron. The inhabitants have developed a unique patois mixing Sundari and Terran, and the Gulch produces a surprising volume of refined secondary metals that supplement the Great Forge\'s output.',
 relatedTerms: ['emberth', 'great_forge', 'groven', 'sundale']
  },

  // ICEHEART SEA
  'treakous_rift': {
 id: 'treakous_rift',
 term: 'Treakous Oceanic Rift',
 type: 'location',
 region: 'iceheart-sea',
 summary: 'A bottomless, freezing ocean rift where city-sized glaciers drift above ancient, tentacled horrors sleeping in the black depths.',
 fullEntry: 'The Treakous Oceanic Rift is the deepest known point in the Iceheart Sea, a bottomless, freezing chasm where the water runs black and silent beneath city-sized glaciers. The Myrathil Deep-Stalkers who probe its edges speak of ancient, multi-tentacled horrors coiled in the sub-zero depths, entities that predate the Dimming and regard the ice above as a temporary inconvenience. The currents are violent and unpredictable, capable of dragging a fully-rigged vessel into the abyss in seconds.',
 relatedTerms: ['first_shore', 'iceheart-sea', 'ironjaw_port', 'myrathil']
  },
  'first_shore': {
 id: 'first_shore',
 term: 'First Shore',
 type: 'location',
 region: 'iceheart-sea',
 summary: 'The ancient coastal ruins where House Mereval\'s ancestors first landed eight centuries ago, now encrusted in ice and guarded by standing dead.',
 fullEntry: 'First Shore is the most historically significant, and most haunted, site in the Iceheart Sea: the coastal ruins where the human ancestors of House Mereval first landed eight centuries ago. The stone watchtowers are now encrusted with heavy ice and barnacles, and the skeletal archers who once manned them still stand at their posts, frozen in attitudes of vigilance that the Drowned Revenants who haunt the harbor find amusing. No one excavates here. The dead are still on duty.',
 relatedTerms: ['gale_storm_shallows', 'house_mereval', 'iceheart-sea', 'treakous_rift']
  },
  'gale_storm_shallows': {
 id: 'gale_storm_shallows',
 term: 'Gale-Storm Shallows',
 type: 'location',
 region: 'iceheart-sea',
 summary: 'A treacherous expanse of shallow reefs and perpetual storm-cycles navigated only by bioluminescent moss and ink-charts tattooed on skin.',
 fullEntry: 'The Gale-Storm Shallows are the Iceheart Sea\'s proving ground, a treacherous expanse of shallow reefs, jagged ice-crags, and perpetual storm-cycles where the winds can tear sails to ribbons and the reefs can gut a hull in seconds. Merryn Pirates use the shallows as both hunting ground and refuge, navigating by the soft glow of bioluminescent ocean moss and the ink-charts tattooed on their skin. The storms here never fully cease; they only vary in intensity from dangerous to catastrophic.',
 relatedTerms: ['first_shore', 'house_mereval', 'iceheart-sea', 'merrowport', 'the_shivering_bight']
  },
  'the_saltmaw_estuary': {
 id: 'the_saltmaw_estuary',
 term: 'The Saltmaw Estuary',
 type: 'location',
 region: 'iceheart-sea',
 summary: 'A treacherous mixing of glacial river and frozen sea where Merryn whalers and Myrathil divers compete violently for territory.',
 fullEntry: 'The Saltmaw Estuary is where Nordhalla\'s glacial rivers meet the Iceheart Sea, a churning mix of fresh and salt water choked with ice-floes and rich with seal-hunting grounds and rare thermal minerals washed down from the mountains. Merryn whalers and Myrathil River-Fed divers compete violently for territory, their territorial disputes occasionally escalating into armed skirmishes that House Mereval pretends not to notice. The estuary\'s name comes from the way the glacial water bites at anything that enters it, salt and cold combining into a solution that numbs flesh in seconds.',
 relatedTerms: ['house_mereval', 'iceheart-sea', 'ironjaw_port', 'myrathil', 'skalds_longport']
  },
  'the_shivering_bight': {
 id: 'the_shivering_bight',
 term: 'The Shivering Bight',
 type: 'location',
 region: 'iceheart-sea',
 summary: 'A wide, shallow bay of constant volcanic tremors where ships must drift with engines running, hoping the quakes do not worsen.',
 fullEntry: 'The Shivering Bight is the Iceheart Sea\'s most geologically unstable region, a wide, shallow bay where unstable volcanic activity beneath the seabed produces constant tremors that make anchoring impossible. The bight is rich in thermal vents and the exotic organisms that feed on them, drawing Merryn Cartographers and Myrathil divers despite the danger. Ships must drift through with engines running, crews watching the water for the sudden discoloration that precedes a major eruption.',
 relatedTerms: ['gale_storm_shallows', 'iceheart-sea', 'merrowport', 'myrathil']
  },
  'skalds_longport': {
 id: 'skalds_longport',
 term: "Skald's Longport",
 type: 'location',
 region: 'iceheart-sea',
 summary: 'A Skald-style harbor on the northern coast where Skald longships trade cold-iron and whale products for Merryn salt-fish and Myrathil coral.',
 fullEntry: 'Skald\'s Longport is the cultural bridge between Nordhalla and the Iceheart Sea, a black basalt harbor built in the Skald style, with dragon-prow longhouses that terrify the local Merryn and impress the Myrathil in equal measure. The Skald traders who dock here bring cold-iron, glacier ice, and whale products from the north; they return with salt-fish, Myrathil coral, and news from the wider world. The port is peaceful by Iceheart standards, protected by a natural breakwater of black stone that the Skald have reinforced with iron stakes.',
 relatedTerms: ['iceheart-sea', 'ironjaw_port', 'nordhalla', 'the_saltmaw_estuary']
  },

  // SUNDRIFT VALE
  'mound_camps': {
 id: 'mound_camps',
 term: 'Mound-Camps',
 type: 'location',
 region: 'sundrift-vale',
 summary: 'A sprawling seasonal settlement of wooly-yurts around the great grass mounds, where nomadic throat-singers trade under the starless sky.',
 fullEntry: 'The Mound-Camps are the Sundrift Vale\'s commercial heartbeat, a sprawling, seasonal settlement of heavy wooly-yurts that grows around the base of the great grass mounds every summer when the nomadic clans converge to trade. Ordan throat-singers exchange wool, dried meat, and memory-beads for cold-iron tools and salt, while Astril Outcast Guilds hawk constellation-readings and Lien-crystal trinkets. The camps disassemble completely when the herds move on, leaving no trace but trampled grass and the faint hum of the mounds beneath.',
 relatedTerms: ['grass_tundra', 'house_ordavan', 'sundrift-vale', 'synod_hold']
  },
  'ancestor_mounds': {
 id: 'ancestor_mounds',
 term: 'Ancestor Mounds',
 type: 'location',
 region: 'sundrift-vale',
 summary: 'A vast network of grass-covered earthen barrows holding thirty-one generations of Ordan chieftains, emitting a continuous guiding hum.',
 fullEntry: 'The Ancestor Mounds are the Sundrift Vale\'s most sacred and practical landmark, a vast network of grass-covered earthen barrows containing the preserved remains of thirty-one generations of Ordan chieftains, each mound emitting a low, continuous hum at a unique frequency. The Mound-Keepers who tend the barrows maintain that the hum is the ancestors still speaking, guiding lost travelers through the starless steppe and warning of danger through changes in pitch and rhythm. Astril Sylen make pilgrimages here to harmonize with the ancestral tones, seeking glimpses of the constellation-spirits that fell during the Breach.',
 relatedTerms: ['astril', 'house_ordavan', 'sundrift-vale', 'synod_hold']
  },
  'grass_tundra': {
 id: 'grass_tundra',
 term: 'Grass Tundra Steppe',
 type: 'location',
 region: 'sundrift-vale',
 summary: 'An endless, wind-swept plain of grey-green grass beneath a starless sky, home to massive woolly herds and the hunting shadows of the Hungry Child.',
 fullEntry: 'The Grass Tundra Steppe is the Sundrift Vale\'s vast, featureless interior, an endless plain of tough grey-green grass that grows waist-high even without sunlight, stretching beneath a sky empty of stars, constellations, or any navigable feature. Ordan Hunters stalk the woolly herds that graze here, but even they give wide berth to the sudden, hunting shadows of the Hungry Child, the Wyrd-creature that the steppe clans believe is the embodiment of starvation itself.',
 relatedTerms: ['house_ordavan', 'kumis_downs', 'lien_stalked_grazes', 'mound_camps', 'sundrift-vale']
  },
  'lien_stalked_grazes': {
 id: 'lien_stalked_grazes',
 term: 'Lien-Stalked Grazes',
 type: 'location',
 region: 'sundrift-vale',
 summary: 'A region where glowing crystal-infused Lien-stalks replace ordinary grass, attracting mutated beasts and crystal-skinned Astril scavengers.',
 fullEntry: 'The Lien-Stalked Grazes are the Sundrift Vale\'s most alien landscape, a region where the ordinary steppe grass has been replaced by glowing, crystal-infused Lien-stalks that make the ground shimmer with trapped starlight. The soil here is extraordinarily fertile, but the crystalline grass makes grazing dangerous for ordinary herds, attracting instead mutated beasts and the Muren Astril who harvest the Lien-crystals for their beacon-fires. The Hungry Child has been sighted here more frequently than anywhere else on the steppe, drawn by the concentrated starlight.',
 relatedTerms: ['astril', 'grass_tundra', 'sundrift-vale']
  },
  'kumis_downs': {
 id: 'kumis_downs',
 term: 'Kumis Downs',
 type: 'location',
 region: 'sundrift-vale',
 summary: 'Rolling hills of pale grass where Ordan mares produce the fermented mare\'s milk that is the steppe\'s sacred drink and primary trade good.',
 fullEntry: 'The Kumis Downs are the gentlest terrain in the Sundrift Vale, rolling hills of pale grass where Ordan mares graze in vast herds, producing the fermented mare\'s milk that serves as the steppe\'s sacred drink, primary trade good, and ceremonial offering to the ancestral mounds. Ordan riders guard the herds with intimate knowledge of every hillock, and their throat-singing carries for miles across the open ground. The downs are where the Ordan clan-meets are held, where migration routes are negotiated, and where bloodline disputes are settled before they can fester into war.',
 relatedTerms: ['grass_tundra', 'house_ordavan', 'sundrift-vale', 'the_long_steppe']
  },
  'the_long_steppe': {
 id: 'the_long_steppe',
 term: 'The Long Steppe',
 type: 'location',
 region: 'sundrift-vale',
 summary: 'The vast central grasslands stretching horizon to horizon, navigated by the unique hum of ancestral burial mounds.',
 fullEntry: 'The Long Steppe is the Sundrift Vale\'s spine, the vast, featureless central grasslands that stretch from horizon to horizon, broken only by the occasional burial mound or standing stone. Caravans navigate by the hum of the ancestral mounds, each one producing a unique tone that carries through the earth and allows experienced travelers to fix their position with remarkable accuracy. The grass here is grey-green and tough as rope, growing waist-high in soil that the Ordavan Bargain ensures will always produce but never produce anything deeper than grass.',
 relatedTerms: ['ancestor_wold', 'house_ordavan', 'kumis_downs', 'sundrift-vale']
  },
  'nova_heath': {
 id: 'nova_heath',
 term: 'Nova Heath',
 type: 'location',
 region: 'sundrift-vale',
 summary: 'Open heathland lit by Astril beacon-fires of crystalline Lien-wood, a gathering ground for solstice observances across all Astril castes.',
 fullEntry: 'Nova Heath is the Sundrift Vale\'s brightest landmark, open heathland where the Muren Astril maintain great pyres of crystalline Lien-wood that burn with pale, cold light visible for miles across the starless steppe. The beacons serve as gathering points for Astril of all castes during solstice observances, and the Muren use coded fire-patterns to transmit messages across the vast distances of the Vale. It is the closest thing the Astril have to a shared home, a place where Sylen, Muren, and even Unlit gather under light that none of them can take for granted.',
 relatedTerms: ['astril', 'starfall_vale', 'sundrift-vale', 'the_unlit_knoll']
  },

  // BRYNGLOOM FOREST
  'peat_bog_sinks': {
 id: 'peat_bog_sinks',
 term: 'Peat-Bog Sinks',
 type: 'location',
 region: 'bryngloom-forest',
 summary: 'A treacherous swamp of bottomless black peat filled with the preserved, aware corpses of ancient debtors risen from broken contracts.',
 fullEntry: 'The Peat-Bog Sinks are the Bryngloom\'s most lethal natural hazard, a swamp of bottomless, preserving black peat where the acidic water is thick enough to walk on and deep enough to swallow anything that breaks the surface. The preserved corpses of ancient debtors lie suspended in the peat, aware and watching through clouded eyes, risen when their contracts were broken by death. Morren Peat-Cutters harvest the bog\'s surface layers with practiced caution, while Drun Outcasts use the deeper sinks as disposal sites for things that must never be found.',
 relatedTerms: ['bryngloom-forest', 'over_shanty', 'sunken_spire']
  },
  'root_veil_scriptorium': {
 id: 'root_veil_scriptorium',
 term: 'Root-Veil Scriptorium',
 type: 'location',
 region: 'bryngloom-forest',
 summary: 'A hollow-root complex where Velun Inscriptors carve genealogies onto memory-glass tablets under the direct watch of the Keeper.',
 fullEntry: 'The Root-Veil Scriptorium is where the Neth\'s most sacred records are kept, a quiet complex built where the great ironwood roots descend into the deep bogs, close enough to the Root-Veil\'s mycelial network that the Inscriptors claim they can feel the Keeper\'s presence while they work. Velun scholars carve historical genealogies onto compressed memory-glass tablets here, producing records that the fog cannot erase and the peat cannot dissolve. It is the most legally significant location in the Bryngloom after the Heart-Vault of Atropolis itself.',
 relatedTerms: ['atropolis', 'bryngloom-forest', 'keeper_of_the_last_threshold', 'neth', 'thalrens_ledger_post']
  },
  'over_shanty': {
 id: 'over_shanty',
 term: 'Over-Shanty',
 type: 'location',
 region: 'bryngloom-forest',
 summary: 'A chaotic hanging slum of rope-bridges beneath Atropolis, populated by Drun outcasts and Morren peat-cutters beyond the First Contract\'s reach.',
 fullEntry: 'Over-Shanty is the Bryngloom\'s open secret, a chaotic slum of rope-bridges and ramshackle cabins suspended beneath Atropolis\'s main platforms, populated by Drun Neth who burned their names from the First Contract and Morren peat-cutters who never had names there to begin with. No Neth law applies here. No Vreken ancestor watches. The Cult of Forgotten Shadow operates openly, running a memory-trade in extracted experiences that the Velun Pact-Lords officially deny exists. Everything in the Shanty sways, everything is for sale, and everyone is running from something.',
 relatedTerms: ['atropolis', 'bryngloom-forest', 'drowned_dingle', 'neth', 'peat_bog_sinks']
  },
  'drowned_dingle': {
 id: 'drowned_dingle',
 term: 'Drowned Dingle',
 type: 'location',
 region: 'bryngloom-forest',
 summary: 'A permanently flooded woodland valley where petrified ironwood trees chime like bells and Morren peat-cutters harvest in flat-bottomed boats.',
 fullEntry: 'The Drowned Dingle is the Bryngloom\'s most melancholic landscape, a wooded valley permanently flooded by bog water where dead ironwood trees stand like skeletal fingers above the dark surface, their petrified branches chiming like bells when the wind blows. Morren peat-cutters navigate the dingle in flat-bottomed boats, harvesting peat and occasionally pulling preserved corpses from the depths. The sound of the chiming trees carries for miles, a slow, random music that the Vreken claim are the voices of ancestors trying to speak through wood instead of bone.',
 relatedTerms: ['black_fen', 'bryngloom-forest', 'neth', 'over_shanty']
  },
  'thalrens_ledger_post': {
 id: 'thalrens_ledger_post',
 term: "Thalren's Ledger-Post",
 type: 'location',
 region: 'bryngloom-forest',
 summary: 'A shared Thalren-Morren archive outpost on the forest edge, where scribes copy Neth contract records onto vellum as insurance against the fog.',
 fullEntry: 'Thalren\'s Ledger-Post is a rare collaboration between two cultures that have little else in common, a hybrid outpost of peat-stone and ironwood where Thalren scribes copy Neth contract records onto calfskin vellum, creating duplicates that the fog cannot consume and the peat cannot dissolve. The Morren who co-manage the outpost see it as a business opportunity, charging the Neth for archival services while selling the Thalren access to Bryngloom trade routes. It serves as neutral ground in a forest where neutrality is a commodity more precious than gold.',
 relatedTerms: ['bryngloom-forest', 'merryns_drift', 'morrens_bogpost', 'neth', 'root_veil_scriptorium']
  },
  'merryns_drift': {
 id: 'merryns_drift',
 term: "Merryn's Drift",
 type: 'location',
 region: 'bryngloom-forest',
 summary: 'A Merryn river-trading camp of lashed houseboats on the forest\'s western waterways, carrying goods between Bryngloom and the Iceheart Sea.',
 fullEntry: 'Merryn\'s Drift is the Bryngloom\'s aquatic lifeline, a cluster of houseboats lashed together on the forest\'s western waterways, perpetually bobbing in the slow-moving bog water as Merryn River-Traders shuttle goods between the Bryngloom and the Iceheart Sea. The Merryn here have adapted to fresh water over generations, their salt-scars fading into something gentler, but they retain the storm-sailors\' instinct for reading water and the tattooed ink-charts that mark every safe passage. The Drift is the only reliable overland trade route between the forest and the sea.',
 relatedTerms: ['bryngloom-forest', 'iceheart-sea', 'sunken_spire', 'thalrens_ledger_post']
  },

  // ── NOTABLE FIGURES ──
  // Order Leaders, the current heads of the 19 class traditions

  'hark-ash-hammer': {
 id: 'hark-ash-hammer',
 term: 'Hark Ash-Hammer',
 type: 'character',
 role: 'Blood-Priest of the Berserker Order',
 region: 'sundale',
 summary: 'Blood-Priest and Keeper of the First Forge, who countersigned the Skald Council execution order against the Pact-less Unbound.',
 fullEntry: 'Hark Ash-Hammer keeps the Forge of Grum in the Harath-Vault arenas, and as Blood-Priest of the Berserker order he speaks for the Pact-sworn: those who honor the ancestral Hunger Pact and treat the Blood-Heat as a sacred liturgy passed down through the Bloodhammer line. He countersigned the Skald Council\'s execution order against the Unbound, the rogue Berserkers who ignite without the ritual, and he calls the deep-tunnel settlement forming beneath Emberspire a heretical church. Stand before the Forge of Grum and you stand before Hark\'s authority; the Blood-Heat answers the Pact-sworn, and Hark decides who counts.',
 relatedTerms: ['harath_vault', 'blood_heat', 'emberspire', 'sundale', 'grum']
  },

  'sera-three-scars': {
 id: 'sera-three-scars',
 term: 'Sera Three-Scars',
 type: 'character',
 role: 'Voice of the Ancestral Convergence',
 region: 'nordhalla',
 summary: 'Speaker of the tri-regional Animist council, the only living keeper who can hold all three ancestral dialects at once.',
 fullEntry: 'Sera Three-Scars convenes the tri-regional council that fuses the Ordan totemic, Vreken spore, and Skald runic Animist traditions into a single art, and she is the only living keeper who can hold all three dialects at once. The three scars of her name mark the three tradition-carriers who met at a crossroads and recognized each other\'s wounds. The ancestral language is fracturing, each generation of Animists losing a few more syllables, and when the last dialect fails, the Convergence fails with it. Sit at Sera\'s council and you\'ll hear what the ancestors still sound like when all three traditions sing at once; learn her scars, and you may be the one who keeps the last syllable from going silent.',
 relatedTerms: ['frozen_archive', 'nordhalla', 'sundrift-vale', 'bryngloom-forest', 'root_veil']
  },

  'vel-otharen': {
 id: 'vel-otharen',
 term: 'Vel-Otharen',
 type: 'character',
 role: 'Senior Signatory of the Canopy-Ledger',
 region: 'atropolis',
 summary: 'The Arcanoneer signatory who arbitrates contract-magic from Atropolis Heart-Vault, now facing clauses the Keeper itself rejects.',
 fullEntry: 'Vel-Otharen arbitrates contract-magic from the Heart-Vault of Atropolis, Senior Signatory of the Canopy-Ledger and heir to Valerius, who drafted the First Contract with the Keeper of the Last Threshold. He now faces a crisis the Arcanoneers have no precedent for: the Keeper is rejecting clauses it once accepted, and the Velun Contingency Protocol, the legal mechanism designed for exactly such scenarios, cannot resolve entities the Keeper refuses to acknowledge. Draft a clause in Atropolis and you may find the Keeper reading it differently than every prior precedent, and Vel-Otharen is the one who has to tell you whether your contract still holds.',
 relatedTerms: ['atropolis', 'keeper_of_the_last_threshold', 'velun', 'house_morrath']
  },

  'skadi-glass-eye': {
 id: 'skadi-glass-eye',
 term: 'Skadi Glass-Eye',
 type: 'character',
 role: 'Keeper of the Elk-Rites',
 region: 'nordhalla',
 summary: 'The Augur order\'s Keeper of Cassia\'s elk-rites at the Frozen Archive, presiding over an art where predictions have collapsed from 93% to 41% accuracy.',
 fullEntry: 'Skadi Glass-Eye keeps the elk-rites at the Frozen Archive, maintaining the entrail-reading tradition founded by Cassia, who foresaw the Deepening in a sacrificed elk. Her glass eye replaces the original lost to temporal backlash, an occupational hazard of reading futures that no longer want to be seen. The elk-entrail accuracy has collapsed from ninety-three percent in Cassia\'s day to forty-one now, as temporal friction from the Chronarch engine-contamination renders every reading unreliable. Watch Skadi read the gore and you\'ll see her flinch when the future fights back; the elk still die willing, but the answers they give are getting harder to hear.',
 relatedTerms: ['frozen_archive', 'nordhalla']
  },

  'fex-vestara': {
 id: 'fex-vestara',
 term: 'Fex-Vestara',
 type: 'character',
 role: 'Conclave-Prime of the Chronarch Order',
 region: 'frostmaw-holdfast',
 summary: 'Keeper of the Reconstruction Schematics at Frostmaw Holdfast, racing the clock as founder Nesta disappears from history.',
 fullEntry: 'Fex-Vestara rebuilds the original time-engine from recorded schematics at Frostmaw Holdfast, Conclave-Prime of the Chronarch conclave, racing a clock only she can see. Nesta, who first hooked a volcanic-glass time-engine into her chest, is disappearing from history: records of her fade, memories of her slip. If Nesta ceases to have ever existed, every Chronarch inherits the temporal friction her existence was absorbing, and the entire craft drowns in accumulated paradox. Fex-Vestara is rebuilding the engine before the woman who invented it is gone, and if you carry a Chronarch\'s chest-engine, you\'re already running on her time.',
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
 fullEntry: 'Mor-Vereth weaves the Congregation of the Silence, the False Prophet cell-network built around Li Wei\'s original broken prophecies in the Sundrift Vale. The Congregation has always received vague impressions from the Voice, fragmented echoes of a faith that never existed. But the Voice has changed. It gives specific instructions now: precise directions, exact times, unambiguous demands, all of them pointing toward the Frozen Archive\'s lowest vault, where something trapped since the Deepening may be using Mor-Vereth\'s network to arrange its own release. Carry a cell\'s message and you may be carrying the instructions that free whatever Li Wei\'s absence woke, and Mor-Vereth is no longer sure she\'s the one deciding where the messages go.',
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
 fullEntry: 'Merr-Cael holds the Middle Odds at Merrowport, Harbor-Master of the Gambit order, and the middle is all that keeps the tradition from splitting in two. Jax the pirate wagered his lifeline against a storm-spirit and believed in luck; Lyra the clause-weaver formalized probability through rune-etched cards and believed in contract. They founded the tradition together and disagreed on its soul. Jax walked into the sea. Lyra\'s followers became the Deck-Burners, who want to force the universe to choose between chaos and order. Merr-Cael\'s middleground shrinks daily, and if you\'re rolling dice in Merrowport, you\'re standing on the ground he\'s losing.',
 relatedTerms: ['merrowport', 'iceheart-sea', 'house_mereval']
  },

  'malakor': {
 id: 'malakor',
 term: 'Malakor',
 type: 'character',
 role: 'Choir-Prime of the Doom-Arithmetic',
 region: 'nordhalla',
 summary: 'The Harbinger who calculates when each Chaos Pocket will consume reality, and has been correct every time.',
 fullEntry: 'Malakor co-founded the Harbinger tradition with Xyris, who tore the first Chaos Pocket into existence. Math is Malakor\'s medium: he does not see the future, he calculates it, tracking when each reality-tear will expand past the point of containment. The arithmetic has never been wrong. Each Chaos Pocket that opens bleeds warmth from the buried star of Emberspire, accelerating the end the Doom-Choir was founded to predict. Malakor the Finite is the current Choir-Prime, and the number he is most often asked for, the estimated remaining lifespan of the known world, is the one he refuses to give. His unnatural longevity, nearly five centuries of counting despite Skald blood, is a side-effect of sustained contact with the Harbinger equations, temporal friction suspending his biological aging. Ask Malakor for the number and he will not give it; ask whether you should be afraid, and his silence is the answer.',
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
 fullEntry: 'Vrael the Forty-Seventh commands the last forty-seven Inquisitors of the Barbed Vow, sworn at the Sunken Spire. The order was forged from two roots: Orven the Still-Handed\'s cold-iron severance of corrupted bonds, and Elias the Salt-Scarred\'s face-baiting technique of opening his own veins to draw Wyrd horrors into living flesh where they can be named and cut. Now the deep groves are producing entities that fall outside the entire art: things that were never bonded, never wrote a contract, never made a pact. Against a horror with no oath to sever and no face to wear, the Barbed Vow has no precedent. Hold the cold iron with Vrael and you\'ll feel what he feels: the methodology that saved the world for centuries is meeting something it was never built to cut.',
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
 fullEntry: 'Bri-Vessela tends the dead-moon parasite in the Frostwood\'s moonlit groves, Regent of the Lunar Communion and Voice of the Moonlit Groves, the Briaran custodian of House Viridane\'s hidden sanctuaries. She serves in Selene\'s silence; the founder of the Lunarch path has not spoken in centuries, and Bri-Vessela speaks for her. The elder parasites, across all hosts, are now synchronizing, every Lunarch\'s phase-cycle aligning toward an unknown convergence the scholars are calling the hatching-song of the dead moon. Stand in the moonlit groves when the cycles align and you\'ll feel the parasite hum before you hear it, and Bri-Vessela is the one who decides whether that hum is a song or a warning.',
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
 fullEntry: 'Sol-Kaessen keeps the First Scar beneath Emberspire, Vigil-Mother of the Martyr order founded by Sera Solvan, who carved her sacrificed child\'s name into her arm and declared every willing wound a small death in imitation of the buried star. The Devotion Gauge, the measure of absorbed suffering that produces miraculous protection, was born from Sera\'s pain. Now the noble houses have perverted the founding sacrifice: they conscript Martyrs through child-training, and the Gauge itself is corrupting, drawing more suffering than was offered, feeding on the unprotected pain of anyone near a Martyr in combat. Take the Vow beneath Emberspire and you\'ll feel the Gauge pull more than you offered; Sol-Kaessen is the one who decides whether that pull is still sacred or already predatory.',
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
 fullEntry: 'Mer-Lyrisa leads the Tide-Choir at Merrowport, holding the cadence-tradition founded by Lyris the Tide-Singer, who calmed the sea-gales at the cost of her spoken voice. The Iceheart Sea has fallen silent. The tides still move, but the deep-current songs that guided Merryn sailors for centuries have ceased entirely, and the Deep-Born Myrathil, the abyssal pressure-forgers, have begun fleeing the ocean trench. When asked what they heard, they will only say it sang back. Sail the Iceheart with Mer-Lyrisa\'s choir and you\'ll hear the silence for yourself; the sea that always sang is holding its breath, and whatever it\'s listening for is listening back.',
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
 fullEntry: 'Vespera injected Sunken Spire decay-moss into her own veins to cure the spore-hush afflicting the Vreken, and became the first host of a cultivated disease intended as medicine. It worked. It also changed her irrevocably. Eight centuries on, she still leads the Plaguebringer Cultivar from the Bryngloom bogs, but her foundational strain, the original biological template from which every Plaguebringer\'s internal substrate descends, is failing. Every practitioner trained from her blood carries a dying inheritance, and Vespera herself may not survive the extinction of the thing she bred. Carry her strain and you carry a cure that is dying of its own age; Vespera is watching the medicine outlive the disease, and the disease is winning.',
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
 fullEntry: 'Sol-Vareths, called the Last-Ember, leads the Pyrofiend order beneath Emberspire, and she is more stone than woman. The order was born when seven Solvarn occultists swallowed Scathrach the Ashen Sovereign\'s burning coals in an obsidian cavern, trading their souls for Wyrd-touched fire. Sol-Vareths has converted more of her body to basalt than any living Pyrofiend. Now Scathrach is calling in all debts simultaneously, and no Pyrofiend has ever survived contract collection. Sol-Vareths is counting the days, and if you carry a Pyrofiend\'s coal, you\'re counting them with her; the Ashen Sovereign collects in full, and the stone you traded for is the price you\'ll pay it in.',
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
 fullEntry: 'Kor-Vasseth keeps the Waking Graves of the Bryngloom peat-bogs, Threshold-Keeper of the Twice-Born, the Revenant order that carries two founding traditions: Kora the Veil-Speaker\'s blood-covenant, which grants the Vreken dead a living voice to speak through, and Vesper the Scribe\'s frost-stasis arts, which preserve the Neth dead in contractual undeath. Now the bog-graves are waking on their own, dead rising without a covenant, undeath occurring without a contract. They march toward the Sundered Monoliths, and the call that routes them routes through the Root-Veil itself. Stand at the Waking Graves with Kor-Vasseth and you\'ll feel the dead move before you see them; they are no longer answering the covenant, and whatever they\'re answering is older than the contracts that bound them.',
 relatedTerms: ['sunken_spire', 'bryngloom-forest', 'root_veil', 'house_morrath'],
 worldFriction: 'The dead rise without covenant. The call routes through the Root-Veil.'
  },

  'veyra': {
 id: 'veyra',
 term: 'Veyra the Merged',
 type: 'character',
 role: 'Form-Matriarch of the Form-Convergence',
 region: 'cragjaw-peaks',
 summary: 'The Mimir who proved momentum and form were one dance, and fused them into the Six Forms. She still leads the Shapers at Frostmaw Holdfast, watching her students burn themselves out for speed.',
 fullEntry: 'Veyra spent centuries watching two dances and seeing one. Sylvanus wove kinetic momentum from the ironwood canopy; Torin sculpted biology in the Frostmaw deeps. A Mimir chronicler by origin, Veyra proved they were the same art seen from two angles, momentum shaping form and form directing momentum, and fused them into the Six Forms. She still leads the Form-Convergence at Frostmaw Holdfast, her semi-crystalline skin more calcified each year, the only Shaper to hold the merged art without burning out.\n\nHer students are not so patient. Driven by ambition and a collapsing world, the young ones attempt every transformation at once, burning through their crystalline skin in years rather than decades. Veyra watches an entire generation destroy itself for speed. If you want the merged art whole, learn it from her before her skin calcifies past speech, because she\'s the last Shaper who remembers what patience bought.',
 relatedTerms: ['frostmaw_holdfast', 'cragjaw-peaks', 'mimir'],
 worldFriction: 'Young Shapers attempt all forms at once, burning themselves out in years.'
  },

  'thrak-damos': {
 id: 'thrak-damos',
 term: 'Thrak-Damos',
 type: 'character',
 role: 'Bulwark-Captain of the Aegis',
 region: 'sundale',
 summary: 'Warden of the Silence-Scars at Emberspire, as ambient magic rises and Silence Resonance fills faster than it can be purged.',
 fullEntry: 'Thrak-Damos commands the Aegis, the Spellguard order at Emberspire\'s forge-keeps, enforcing the method Damon the Emberth forged when he blocked a solar flare with an alchemical tower shield. His heirs refined that interception into a discipline of identifying, containing, and deflecting hostile magic. The world\'s background magic is rising, and every Spellguard\'s Silence Resonance, the measure of absorbed and unpurged energy, fills faster than it can be discharged. Thrak-Damos oversees a generation of defenders who are drowning in the magic they absorb. Raise a shield with the Aegis and you\'ll feel the Resonance climbing; Thrak-Damos is the one who decides when a defender has held too much, and the decision is usually too late.',
 relatedTerms: ['emberspire', 'sundale', 'emberth'],
 worldFriction: 'Ambient magic rising. Silence Resonance fills faster than it can be purged.'
  },

  'varis': {
 id: 'varis',
 term: 'Varis the Trembling',
 type: 'character',
 role: 'Venom-Master of the Distillery',
 region: 'frostwood-reach',
 summary: 'Keeper of the Slow Cup in the Frostwood, as the changing fog spoils venoms that held stable for generations.',
 fullEntry: 'Varis the Trembling built the Distillery, the Toxicologist order in the Frostwood, extracting raw venom from fog-predators like the Gref and the Gambrel in the ironwood canopies and distilling them into area-denial poisons. The work left him with chronic tremors and permanently stained fingers, occupational marks every Toxicologist inherits, and Varis still keeps the Slow Cup despite hands that can barely hold it. Now the fog itself is changing. Venoms that held stable for generations spoil in weeks, the chemistry of the mist has shifted, and the Toxicologists race to understand why. Brew in the Distillery and you\'ll inherit Varis\'s tremor and his race; the fog is changing the venoms faster than he can change the cures.',
 relatedTerms: ['the_shallows', 'frostwood-reach', 'greymark-keep'],
 worldFriction: 'The fog chemistry is changing. Venoms spoil in weeks instead of years.'
  },

  'alaric': {
 id: 'alaric',
 term: 'Alaric the Law-Keeper',
 type: 'character',
 role: 'Chain-Lord / The First Bound',
 region: 'frostmaw-holdfast',
 summary: 'Founder and Chain-Lord of the Warden order, who drove an ore-chain through his forearm to hold a specimen for three days. Now the iron is turning brittle.',
 fullEntry: 'Alaric drove an ore-chain through his own forearm and held a captured abomination in place for three days. The chain-graft, the Warden order\'s signature technique, was born in that act of sacrificial restraint. He still leads the Bound from Frostmaw\'s Chain-Hold, the iron rusted into his bone, his regenerative Thrumm-derived biology keeping him functional long past a normal Groven lifespan.\n\nNow the iron is turning brittle in the intensifying cold, and the order he founded faces a choice. The Fexric Drall propose chardalyn as a replacement: an alloy of meteoric origin, stronger and colder-resistant, but it causes progressive madness in anyone who grafts it into living flesh. Alaric has held the line for centuries. The chain in his arm is the only thing keeping him certain the line is worth holding, and it is starting to snap.',
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
 fullEntry: 'Silent-Master Sylas stalked a conceptual Wyrd-entity, a creature that existed as an idea rather than a body, for seven consecutive days, tracking it not by sign or spoor but by the absence it left in the perception of everything around it. He caught it. The cost was his hearing, which the entity consumed as a parting blow. Sylas now leads the Silent Hunt, an order of sensory-trackers who trade one sense for absolute focus. But the mist is learning to hide. Something large has moved through the Reach for months without leaving any trace, and the Apex senses that were supposed to be infallible are finding nothing. Hunt with the Silent Master and you\'ll trade a sense for the truth; the question Sylas won\'t answer is whether the thing in the mist is hiding from the Apex, or whether it has already learned to hunt them back.',
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
 fullEntry: 'Kaelen Thalreth runs the Frostwood Reach from behind a desk piled with Sovereign Ledgers. His father Aldren sits in a nearby chamber re-reading his own journals, trying to remember who he is. The memory-fog took Aldren\'s mind; Kaelen is determined it won\'t take the Reach. He enforces the Sovereign Ledger as absolute law: any property not recorded in the ledgers is silence, and the undocumented don\'t legally exist. He tells himself it\'s preservation. The Forgotten call it erasure by quill.',
 relatedTerms: ['greymark_keep', 'frostwood-reach', 'house_thalreth', 'scribe-sentinels']
  },

  'halvar-skalvyr': {
 id: 'halvar-skalvyr',
 term: 'Halvar Skalvyr',
 type: 'character',
 role: 'High King-Jarl of Nordhalla',
 region: 'nordhalla',
 summary: 'Jarn-Tand, who built the Sunder-Wall to funnel the nomad clans through taxed checkpoints and broke their traditional free passage with it.',
 fullEntry: 'Halvar Skalvyr, called Jarn-Tand (Iron-Tooth), took Nordhalla by force and then built the wall that made the taking stick. The Sunder-Wall funnels every nomad migration through taxed checkpoints, and the Ordan clans who once crossed free now pay Skalvyr tolls for the land they were born on. His power rests on two pillars: the Frozen Archive\'s runic authority and Skalvyr steel. He governs the fjord-keeps with an iron grip, and the glaciers outside the wall do his quiet work for him. Cross the Sunder-Wall and you pay Halvar\'s price. The Fredlose clans beyond it are the ones who refused, and the cold remembers what they chose.',
 relatedTerms: ['fjord_gate', 'nordhalla', 'frozen_archive', 'house_skalvyr']
  },

  'aldren-thalreth': {
 id: 'aldren-thalreth',
 term: 'Aldren Thalreth',
 type: 'character',
 role: 'Lord of House Thalreth (De Jure)',
 region: 'frostwood-reach',
 summary: 'The aging Lord of House Thalreth, whose advanced memory-fog has allowed his son Kaelen to seize de facto control.',
 fullEntry: 'Lord Aldren Thalreth still wears the title, but his son Kaelen holds the quill. The memory-fog took Aldren\'s wife\'s face first, then her name, then the years between. House Thalreth bargained for that mist long ago to keep the ironwood from Nordhalla\'s creeping cold, and now it eats the man who inherited the bargain. Aldren appears at court ceremonies and signs nothing. The ledgers pass to his son, and Aldren doesn\'t protest because he can\'t recall what he\'s losing.',
 relatedTerms: ['greymark_keep', 'frostwood-reach', 'house_thalreth']
  },

  'elara-thalreth': {
 id: 'elara-thalreth',
 term: 'Elara Thalreth',
 type: 'character',
 role: 'Keeper of the High Hearth',
 region: 'frostwood-reach',
 summary: 'Keeper of the High Hearth at Greymark Keep, the one flame that remembers when the fog takes everything else. She holds no political power, and everyone in the keep orients by her fire.',
 fullEntry: 'The High Hearth at Greymark Keep has burned longer than the Jarl-Archivist\'s office has existed, and Elara Thalreth is the one who keeps it. Her duty is deceptively simple: keep the central flame lit. In a keep where the fog steals memory and erases identity, the hearth is the one constant, a flame that remembers when the people cannot.\n\nElara holds no political power, but the household staff, the visiting merchants, and the frightened Forgotten who shelter in the lower halls all orient themselves by the fire she tends. When the flame dips, the keep holds its breath. When it steadies, they breathe again. Tend a fire in the Frostwood long enough and you learn what Elara learned: in a place that eats memory, the only thing that remembers is the thing you refuse to let go out.',
 relatedTerms: ['greymark_keep', 'frostwood-reach', 'house_thalreth']
  },

  'caedren-thalreth': {
 id: 'caedren-thalreth',
 term: 'Caedren Thalreth',
 type: 'character',
 role: 'Master Scribe of the Scribe-Sentinels',
 region: 'frostwood-reach',
 summary: 'The second son who knows about the ledger edits, and authorized many of them. He tells himself a managed ledger is better than no ledger at all.',
 fullEntry: 'Caedren Thalreth, second son of Lord Aldren, keeps the Scribe-Sentinels from the tower that bears his title. He knows about the edits. He authorized many of them: subtle modifications to the Sovereign Ledger that shift property boundaries, erase certain names, and insert others. He tells himself it is for the good of the Reach, that the chaos of contested claims would tear the region apart, and a carefully managed ledger, even an edited one, is better than no ledger at all. He believes this. He has to. Open a ledger in the Frostwood and ask whose name was there before yours, and Caedren is the man who knows the answer, and the man who decided you didn\'t need to.',
 relatedTerms: ['scribes_tower', 'frostwood-reach', 'house_thalreth', 'scribe-sentinels']
  },

  'thorn-speaker': {
 id: 'thorn-speaker',
 term: 'The Thorn-Speaker',
 type: 'character',
 role: 'Speaker of the Unshorn Briaran',
 region: 'frostwood-reach',
 summary: 'The elected voice of the Unshorn Briaran, whose forearms bristle with living barbs. They reject the Fog Compact as surrender, and every word they speak is a thorn.',
 fullEntry: 'The Unshorn Briaran live in the Frostwood\'s deepest groves, their forearms bristling with living barbs that are the physical mark of an ancient fae-contract, and the Thorn-Speaker is the voice they elected to speak for them. The Unshorn reject the Fog Compact entirely. Where House Thalreth traded the Reach\'s clarity for protective mist, the Briaran believe the fog itself is the enemy, slowly erasing everything that made the forest sacred. The Thorn-Speaker\'s voice carries the weight of the groves, and every word is a thorn. Walk the deep groves with thorns on your arms and the Unshorn will hear you. Walk them without, and the fog will reach you before they do.',
 relatedTerms: ['ironwood_heart', 'frostwood-reach', 'briaran']
  },

  'the-first-liar': {
 id: 'the-first-liar',
 term: 'The First Liar',
 type: 'character',
 role: 'Leader of the Unlit Veil',
 region: 'nordhalla',
 summary: 'Head of the Unlit Veil, the hidden movement that believes the Frozen Archive\'s monopoly on truth is indistinguishable from its suppression.',
 fullEntry: 'The First Liar leads the Unlit Veil from Synod Hold, a hidden movement that believes the Frozen Archive\'s monopoly on information is the single greatest injustice in the known world. For as long as the Archive has stood, it has been the sole custodian of history, prophecy, and recorded knowledge. The Unlit Veil argues that this concentration of truth is indistinguishable from its suppression, and the First Liar, whose real identity is unknown, perhaps because it would give the Archive somewhere to send its own Inquisitors, organizes a decentralized campaign of information theft and release. The Archive keeps the past. The Unlit Veil steals it back, one page at a time, and if you\'ve ever read a banned manuscript in Nordhalla, you\'ve already held the First Liar\'s work in your hands.',
 relatedTerms: ['synod_hold', 'nordhalla', 'frozen_archive']
  },

  'loras-ordavan': {
 id: 'loras-ordavan',
 term: 'Loras Ordavan',
 type: 'character',
 role: 'Steppe-Lord of House Ordavan',
 region: 'sundrift-vale',
 summary: 'A man who inherited a puppet\'s throne and has not yet realized it.',
 fullEntry: 'Loras Ordavan sits the Steppe-Lord\'s throne at Synod Hold, believing he commands the loyalty of the nomad clans who cross the Sundrift Vale with their migration-horses. He does not. The Ordan clans permit him his illusion because a visible Steppe-Lord draws the Dawn Vigil\'s attention while their real leadership operates unseen. Loras inherited a puppet\'s throne and has not yet realized it. When he does, the Vale will remember who actually holds the reins, and so will everyone who mistook the puppet for the hand.',
 relatedTerms: ['synod_hold', 'sundrift-vale', 'house_ordavan']
  },

  'dawn-vigil-commander': {
 id: 'dawn-vigil-commander',
 term: 'The First Dawn',
 type: 'character',
 role: 'Commander of the Dawn Vigil',
 region: 'sundale',
 summary: 'The secret commander of the Dawn Vigil, whose identity is sealed behind basalt tablets delivered by silent Martyrs who cannot betray what they cannot speak.',
 fullEntry: 'The First Dawn commands the Dawn Vigil from the Emberspire Caldera, but their identity is a secret kept even from most of their own order. Commands arrive as sealed basalt tablets delivered by Martyrs who have taken vows of silence, messengers who cannot betray what they cannot speak. Theories abound: that the First Dawn is a council rather than an individual, that the position has been vacant for decades and the basalt tablets are pre-written, or that the First Dawn is the last living Solvan who has not yet surrendered to accumulated grief. Whoever sits behind the title, the tablets still arrive, the orders still hold, and the Obsidian Citadels still answer. Carry a basalt tablet in Sundale and you speak with the First Dawn\'s voice, and no one alive can prove you shouldn\'t.',
 relatedTerms: ['emberspire', 'sundale', 'house_solvan']
  },

  'deep-alchemist-prime': {
 id: 'deep-alchemist-prime',
 term: 'The Prime Alchemist',
 type: 'character',
 role: 'Leader of the Deep Alchemists',
 region: 'cragjaw-peaks',
 summary: 'The head of the Deep Alchemists, whose body is now more graft than flesh. No one remembers their original race or gender, and they prefer it that way.',
 fullEntry: 'The Prime Alchemist leads the Deep Alchemists from the Lost Brood-Vats, the sealed laboratories deep beneath Frostmaw Holdfast where the Fexric guild-scientists pursue immortality through flesh-craft. The current Prime has replaced so much of their body with alchemical grafts that no living person remembers their original race or gender; they have become a walking catalogue of their own experiments. The Deep Alchemists maintain an uneasy detente with the Vat-Breakers above them: the Alchemists still believe the Thrumm root-stock was their finest creation, and the Groven who broke free of those same vats consider that statement an indictment. Descend to the Lost Brood-Vats and you\'ll find a Prime who forgot what they were before they began, and a workshop that never stopped improving on the mistake.',
 relatedTerms: ['lost-brood-vats', 'cragjaw-peaks', 'fexrick', 'groven', 'vat_breakers_guild', 'frostmaw_holdfast']
  },

  'vat-breaker-foreman': {
 id: 'vat-breaker-foreman',
 term: 'The First Foreman',
 type: 'character',
 role: 'Leader of the Vat-Breakers\' Guild',
 region: 'cragjaw-peaks',
 summary: 'The elected leader of the Groven guild who shattered their own containment vessels. Like all Groven, they are slowly calcifying, and the stone will claim them soon.',
 fullEntry: 'The First Foreman leads the Vat-Breakers\' Guild at Frostmaw Holdfast, elected by the Council of Spans and serving a generation or two before the Groven calcification, the hardening of their stone-scaled bodies, advances too far for continued service. The Guild\'s founding act was the shattering of the Deep Alchemists\' containment vats: a revolt of engineered beings who chose freedom over the docility they were bred for. Every Foreman since carries that memory, and the Guild\'s relationship with the Deep Alchemists one level below remains a silent war conducted through Cold-Flame labor contracts and careful memory-preservation. The stone takes every Foreman in the end. Take the title and you inherit the memory of the vats, the war beneath, and the certainty that your own skin is already beginning to set.',
 relatedTerms: ['frostmaw_holdfast', 'cragjaw-peaks', 'groven', 'vat_breakers_guild', 'deep_alchemists']
  },

  'solvan-steward': {
 id: 'solvan-steward',
 term: 'The Steward of Emberspire',
 type: 'character',
 role: 'Steward of House Solvan',
 region: 'sundale',
 summary: 'Caretaker of House Solvan, who refuse to call anyone Lord until the sun returns from its tomb.',
 fullEntry: 'The Steward of Emberspire manages House Solvan\'s affairs from the Great Forge, a position defined by absence: the Solvarn refuse to recognize any title higher than "Steward" until Sol, the buried star they helped entomb beneath Emberspire, is released from its prison. The current Steward oversees a house defined by guilt, vigil, and a founding crime they cannot undo. Every Solvarn Martyr who takes the Vow, every Pyrofiend who swallows Scathrach\'s coal, does so under the Steward\'s silent, complicit gaze. Hold the Steward\'s seat and you hold a house that won\'t call you Lord, a crime that won\'t stay buried, and a star that won\'t stop pressing against the door you sealed it behind.',
 relatedTerms: ['great-forge', 'sundale', 'emberspire', 'house_solvan']
  },

  'mereval-admiral': {
 id: 'mereval-admiral',
 term: 'The Grand Admiral of Merrowport',
 type: 'character',
 role: 'Grand Admiral of House Mereval',
 region: 'iceheart-sea',
 summary: 'Ruler of Merrowport from the prow of the Wave-Kept, a ship that has not docked in forty years. A ruler who never touches land cannot be accused of favoring any port.',
 fullEntry: 'The Grand Admiral of Merrowport governs House Mereval\'s storm-wracked domains from the prow of the Wave-Kept, a Merryn ship that has not made port in forty years. The Merryn believe a ship that docks loses its luck, and the Grand Admiral has taken this superstition to its logical extreme: a ruler who never sets foot on land cannot be accused of favoring any port over another. The Wave-Kept sails a circuit of the Iceheart Sea\'s safe currents, and the Admiral\'s judgments arrive by tide-runner courier. The Merrowport House considers this elegant governance. The land-bound houses consider it dereliction. Take a courier\'s post on the Wave-Kept and you\'ll learn what the Admiral learned decades ago: the sea is the only throne that doesn\'t tilt when the wind changes.',
 relatedTerms: ['merrowport', 'iceheart-sea', 'merryn', 'house_mereval']
  },

  'tesshan-lord': {
 id: 'tesshan-lord',
 term: 'The High-Lord of the Peaks',
 type: 'character',
 role: 'High-Lord of House Tesshan',
 region: 'cragjaw-peaks',
 summary: 'Rules from the highest gallery of Frostmaw Holdfast, where the blizzard wind is loudest and altitude sickness keeps visitors brief.',
 fullEntry: 'The High-Lord of the Peaks governs House Tesshan from the uppermost gallery of Frostmaw Holdfast, a deliberate architectural choice that ensures every petitioner arrives exhausted and eager to conclude business quickly. Sealed inside their snow-buried keeps for centuries, the Tessen have turned defensive isolation into a political art form. The High-Lord\'s audiences are legendary for their brevity: at this altitude, even a Tessen\'s augmented lungs struggle, and the blizzard wind that never stops screaming through the gallery\'s open arches makes extended conversation physically impossible. Climb to the High-Lord\'s gallery and you\'ll get your audience, but the wind will decide how long it lasts, and the climb back down is the part most petitioners don\'t remember clearly.',
 relatedTerms: ['frostmaw_holdfast', 'cragjaw-peaks', 'house_tesshan']
  },

  'morrath-steward': {
 id: 'morrath-steward',
 term: 'The Steward of the Seventh Seat',
 type: 'character',
 role: 'Velun Neth Appointee to House Morrath',
 region: 'atropolis',
 summary: 'A Velun Neth who has been "acting" Steward of House Morrath for over three centuries. No Morrath descendant has claimed the seat in living memory.',
 fullEntry: 'The Steward of the Seventh Seat has governed House Morrath from Atropolis for over three centuries, a Velun Neth appointed as a placeholder when the last Morrath descendant failed to present themselves. The position was meant to be temporary. No Morrath has appeared in living memory. The Steward administers the Morrath contract-debt, the family\'s hereditary obligation to the Keeper, as though the seat\'s true owners might walk through the door tomorrow. Every year that passes without them makes the fiction harder to maintain, but the Keeper of the Last Threshold has not acknowledged any breach, and a Velun Neth cannot voluntarily abandon a contract they signed. Sign a contract in Atropolis and you may wait a long time for the seat\'s real owner to relieve you of it; the Steward has been waiting three centuries, and the door still hasn\'t opened.',
 relatedTerms: ['atropolis', 'keeper_of_the_last_threshold', 'house_morrath'],
 worldFriction: 'Over three centuries as "acting" Steward. The Morrath line may be extinct. The contract binds regardless.'
  },

  'sigurd-skalvyr': {
 id: 'sigurd-skalvyr',
 term: 'Sigurd Skalvyr',
 type: 'character',
 role: 'Jarl of the Archive',
 region: 'nordhalla',
 summary: 'Custodian of the Frozen Archive, gatekeeper of its accumulated knowledge. In Nordhalla, where the glacier preserves everything, the past is negotiable, and Sigurd holds the seal.',
 fullEntry: 'Sigurd Skalvyr keeps the Frozen Archive\'s physical and runic collections, and no scholar, Augur, or Harbinger enters the deeper vaults without his seal. Where his brother Halvar rules the fjord-keeps through military force, Sigurd rules the library through access. He is more powerful than the High King-Jarl, because while Halvar controls the present, Sigurd controls the past, and in Nordhalla, where the glacier preserves everything, the past is negotiable. Seek the deeper vaults and you\'ll need Sigurd\'s seal, and Sigurd does not give it to anyone who hasn\'t convinced him the past they\'re looking for is the past he wants found.',
 relatedTerms: ['frozen_archive', 'nordhalla', 'house_skalvyr']
  },

  'frigga-skalvyr': {
 id: 'frigga-skalvyr',
 term: 'Frigga Skalvyr',
 type: 'character',
 role: 'Geothermal Negotiator for House Skalvyr',
 region: 'nordhalla',
 summary: 'The Skalvyr diplomat who built the Silence-Heat engine beneath the Frozen Archive and now negotiates Nordhalla\'s clandestine geothermal trade.',
  fullEntry: 'Facing Nordhalla\'s terminal geothermal failure, Frigga Skalvyr decided the Glacier Bargain was worth breaking. She made clandestine contact with outcast Emberth pyrofiends and built the Silence-Heat engine beneath the Frozen Archive, trading ancestral stability for stolen warmth. The engine worked, but the price came due in ghost-data and double-visions. Today, she holds the dangerous title of Geothermal Negotiator, traveling between the Fjord Gate and Emberspire to broker thermal-trade agreements with houses that hold all the leverage. She still tends the engine, and whether she saved her house or doomed it is the question every shaman asks and none can answer.',
 relatedTerms: ['fjord_gate', 'nordhalla', 'emberspire', 'house_skalvyr', 'frozen_archive', 'emberth']
  },

  'vellan-archivist': {
 id: 'vellan-archivist',
 term: 'Vellan the Archivist',
 type: 'character',
 role: 'Senior Archivist of the Scribe-Sentinels',
 region: 'frostwood-reach',
 summary: 'The Scribe-Sentinels\' most senior quill-keeper, who has seen the edits Caedren Thalreth authorized.',
 fullEntry: 'Vellan the Archivist keeps the Scribe-Sentinels\' deepest records from the Scribe\'s Tower in the Frostwood Reach, and she has seen the edits. She knows which names were erased and which property lines shifted. Under Caedren Thalreth\'s authority, the Sentinels maintain the Sovereign Ledger that decides who is Ledgered and who is Forgotten. Unlike Caedren, she did not authorize the edits, but she also did not stop them, and silence, in the Reach, is its own kind of quill-stroke. Read the ledger Vellan keeps and you\'ll find the names that are supposed to have always been gone; she knows they weren\'t, and the knowing is the heaviest quill she carries.',
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
 fullEntry: 'Grum Bloodhammer was the first to ignite the Blood-Heat, the metabolic fury that converts the body into a self-destructive engine of war. Where the Skald say the Hunger Pact originated in Nordhalla\'s three-winter blizzard, when ancestors consumed their own fallen to survive, Grum channeled that ancestral fire into something deliberate: a weapon. He lit the first Blood-Heat in the caldera of Emberspire, and his fury was so bright the Solvarn Vigil thought the buried star was returning. The Forge of Grum in the Harath-Vault, where Berserkers still train beneath the volcanic stone, carries the impression of his hammer in the floor. Strike the floor and you\'ll feel where he stood; the stone still remembers the heat of the first Berserker who burned himself into it.',
 relatedTerms: ['harath_vault', 'blood_heat', 'emberspire', 'sundale', 'skald']
  },

  'valerius': {
 id: 'valerius',
 term: 'Valerius',
 type: 'character',
 role: 'Founder of the Arcanoneer Path',
 region: 'atropolis',
 summary: 'The Neth who drafted the First Contract with the Keeper of the Last Threshold, binding spoken word to legal consequence.',
 fullEntry: 'Valerius drafted the First Contract with the Keeper of the Last Threshold in the early generations of the Dimming, and every Arcanoneer spell cast since descends from that negotiation. He didn\'t invent the Neth\'s inability to lie. He weaponized it. A Velun Neth who structures an incantation like a filing cannot default on the syntax, and the Keeper enforces every clause in blood. The silver skin and stilled breath that mark the Velun are not side-effects of the craft; they are its prerequisite. A non-Neth attempting Arcanoneer work is a litigant who has already defaulted.',
 relatedTerms: ['atropolis', 'keeper_of_the_last_threshold', 'velun']
  },

  'cassia': {
 id: 'cassia',
 term: 'Cassia',
 type: 'character',
 role: 'Founder of the Augur Path',
 region: 'nordhalla',
 summary: 'The Skald seer who read the Deepening in a sacrificed glacier-elk. The entrails have not been fully accurate since.',
 fullEntry: 'Cassia read the future in the entrails of glacier-elk sacrificed on the Frozen Archive\'s ice-altars, and the first future she read was the Deepening: the entombment of the buried star Sol, visible in the still-steaming gore of an elk killed at the precise moment of the star\'s disappearance. The glacier-cold slows the cooling of the sacrifice, extending the reading window from seconds to minutes. Every Augur since has used her technique, and every Augur since has watched the accuracy decline, from ninety-three percent in her day to forty-one now, as temporal friction contaminates what was once a reliable art. The entrails still speak, but they\'re getting quieter, and if you want to read them before the signal fails entirely, the ice-altar is still open and the elk are still running.',
 relatedTerms: ['frozen_archive', 'nordhalla', 'skald']
  },

  'nesta': {
 id: 'nesta',
 term: 'Nesta',
 type: 'character',
 role: 'Founder of the Chronarch Path',
 region: 'cragjaw-peaks',
 summary: 'The first Chronarch, who hooked a volcanic-glass time-engine into her own chest. She is now disappearing from history.',
 fullEntry: 'Nesta, a Fexric engineer in a Frostmaw workshop, hooked a volcanic-glass time-engine directly into her own chest to test whether a living body could house a temporal mechanism. It could. The clockwork chest-engine every Chronarch now inherits descends from her prototype, and so does the price: the engine kills its host over years, the body\'s natural decay accelerated by the paradox of operating outside linear time. Nesta is disappearing from history. Records of her fade, memories slip, as though her existence is being reclaimed by the very mechanism she invented. Wear the engine she built and you may outlive your own name; Nesta is proving that a Chronarch can run out of time in a direction no one expected.',
 relatedTerms: ['frostmaw_holdfast', 'cragjaw-peaks'],
 worldFriction: 'Disappearing from history. If she ceases to exist, every Chronarch absorbs her temporal friction.'
  },

  'li-wei': {
 id: 'li-wei',
 term: 'Li Wei',
 type: 'character',
 role: 'Founder of the False Prophet Path',
 region: 'sundrift-vale',
 summary: 'The Ordan visionary who looked into the silence where Sol once shone and saw a presence that was never there. Centuries later, it began speaking back.',
 fullEntry: 'Li Wei looked into the silence where Sol used to shine and saw something that was never there. The Ordan nomad preached a faith built on the absence itself, a presence in the empty socket where the star had been, and the faith took root across the Sundrift Vale because people wanted to believe the dark wasn\'t empty. Li Wei died. Centuries later, the thing he had imagined started talking back. The Voice speaks directly now, with instructions, and something has moved into the space Li Wei first pointed at, using his followers to arrange its arrival.',
 relatedTerms: ['sundrift-vale', 'frozen_archive'],
 worldFriction: 'The Voice now gives specific instructions. Something is using his network to free itself.'
  },

  'jax': {
 id: 'jax',
 term: 'Jax the Wager',
 type: 'character',
 role: 'Co-founder of the Gambit Path',
 region: 'iceheart-sea',
 summary: 'The Merryn pirate who wagered his remaining years against a storm-spirit and won. Then he walked into the sea, and no one knows which of them finally collected.',
 fullEntry: 'Jax wagered his own lifeline against a storm-spirit in the Iceheart Sea, betting his remaining years on a single throw. He won. The spirit owed him a favor, and Jax discovered that probability could be coerced, not merely accepted. His half of the Gambit art is the luck-cult: dice weighted with salt-coral, stakes measured in voyage-shares, the belief that chance itself can be charmed into submission.\n\nCenturies later, Jax walked into the sea at midnight, fully clothed, with a smile and a loaded die, telling no one why. His followers believe he went to collect the final debt from the storm-spirit. His enemies believe the spirit finally came to collect from him. The Gambits still roll his dice, and if you\'re betting in Merrowport, you\'re playing Jax\'s game whether you know it or not, and the sea still holds the score.',
 relatedTerms: ['merrowport', 'iceheart-sea', 'merryn', 'gambit']
  },

  'lyra': {
 id: 'lyra',
 term: 'Lyra the Clause',
 type: 'character',
 role: 'Co-founder of the Gambit Path',
 region: 'bryngloom-forest',
 summary: 'The Neth probability-weaver who formalized chance into rune-etched cards. Her Deck-Burners now want to force the universe to choose.',
 fullEntry: 'Lyra bet on structure where Jax bet on luck. A Kessen Neth weaving the probability-web of the Bryngloom\'s forest floor, she formalized the art through rune-etched cards: chance quantified, the unknown reduced to a hand that could be read and played. She refined her technique through the Cragjaw toll-negotiations, where every hand of cards was a clause analysis and every win a precedent.\n\nAfter Jax walked into the sea, Lyra radicalized. Her followers, the Deck-Burners, now seek to burn every card in existence, forcing the universe to choose between absolute order and absolute chaos. The older Gambits call it heresy, a breach of the tradition\'s whole relationship with chance. Lyra calls it the only honest bet left, and she is dealing the next hand from Ironjaw Port.',
 relatedTerms: ['bryngloom-forest', 'merrowport', 'cragjaw-peaks', 'neth', 'gambit', 'ironjaw_port'],
 worldFriction: 'Her Deck-Burners want to force the universe to choose between chaos and order.'
  },

  'xyris': {
 id: 'xyris',
 term: 'Xyris the Tear',
 type: 'character',
 role: 'Co-founder of the Harbinger Path',
 region: 'nordhalla',
 summary: 'The Astril who tore the first hole in reality to understand how the world ends. The hole is still growing.',
 fullEntry: 'Xyris could not merely predict doom; she needed to understand its mechanism. An Astril whose constellation-spirit screamed the future through her crystalline skin, she tore the first Chaos Pocket into the fabric of reality, an act of deliberate metaphysical damage that proved the universe was not as immutable as it seemed. The Pocket she created still exists, slowly expanding, and every subsequent tear in reality traces its parentage back to her original.\n\nShe and Malakor, her mathematician partner, are the two halves of the Harbinger art: the one who breaks and the one who measures the breaking. The Tear is still growing. If you want to know what it will consume next, ask Malakor; he has already counted it, and Xyris is the reason he had to.',
 relatedTerms: ['frozen_archive', 'nordhalla', 'astril', 'sundrift-vale', 'harbinger']
  },

  'selene': {
 id: 'selene',
 term: 'Selene of House Viridane',
 type: 'character',
 role: 'Founder of the Lunarch Path',
 region: 'frostwood-reach',
 summary: 'The Briaran noble who bound the dead-moon parasite to herself. She has not spoken in centuries.',
 fullEntry: 'Selene of House Viridane bound a fragment of the dead moon to her own body in the Frostwood\'s moonlit groves, and founded the Lunarch tradition in that binding. The parasite feeds on the host\'s vitality in exchange for lunar-phase abilities tied to the dead moon\'s cycle. The thing that died when its moon shattered now lives inside a Briaran noble who carries Viridane\'s blood.\n\nSelene entered silence centuries ago, retreating into a state between life and undeath where the parasite sustains her without her active participation. The groves she left behind are now tended by Bri-Vessela, and no one, not even the Regent, knows whether Selene is still capable of waking. The dead moon\'s cycle still turns, and the parasite still feeds. Walk the moonlit groves and you may hear what the silence is hiding, and learn whether the thing inside Selene is waiting for her to wake or waiting for her to finish dying.',
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
 fullEntry: 'Sera Solvan carved her sacrificed child\'s name into her own arm after the ritual that kept Sol imprisoned beneath Emberspire, and declared every wound willingly absorbed a small death in imitation of the buried star she helped entomb. The Devotion Gauge, the measure of accumulated suffering that generates miraculous protection, was born from her pain. Her house, the Solvarn, now conscript their own children into Martyr training. What Sera created as a personal act of atonement has become a factory of consecrated suffering. Take the Vow that Sera carved into her own skin and you inherit her grief and her Gauge; the question the Solvarn no longer ask is whether the suffering still serves the star, or whether it has started serving itself.',
 relatedTerms: ['emberspire', 'sundale', 'house_solvan']
  },

  'lyris': {
 id: 'lyris',
 term: 'Lyris the Tide-Singer',
 type: 'character',
 role: 'Founder of the Minstrel Path',
 region: 'iceheart-sea',
 summary: 'The Merryn storm-sailor who calmed the sea-gales with her voice at the cost of ever speaking again.',
 fullEntry: 'Lyris the Tide-Singer discovered that certain rhythmic cadences could synchronize an entire crew\'s physiology to wave and wind, a sustained effort that would exhaust any other people within hours. Her Cadence was maritime engineering: the precise manipulation of bodies through sound. The sea-gales calmed at her command, but the cost was absolute: the effort destroyed her vocal cords, and she spent the remainder of her life communicating through written notes. The Tide-Choir at Merrowport carries both her technique and her silence forward. Sing with the Tide-Choir and you\'ll learn what Lyris learned: the sea answers a voice that gives everything, and it takes the voice as payment.',
 relatedTerms: ['merrowport', 'iceheart-sea', 'merryn']
  },

  'damon': {
 id: 'damon',
 term: 'Damon the Emberth',
 type: 'character',
 role: 'Founder of the Spellguard Path',
 region: 'sundale',
 summary: 'The Emberth smith who raised a tower shield against a solar flare and walked away alive. Every Spellguard\'s defense descends from that one block.',
 fullEntry: 'Damon the Emberth was working the Emberspire forge-keeps when a solar flare erupted from Sol\'s vault. He raised an alchemical tower shield and absorbed the flare\'s magical impact. He survived. The shield was slag, but Damon was changed: his body had learned to intercept. He spent the rest of his life refining that interception into the Spellguard method of identifying, containing, and deflecting hostile magic.\n\nThe Bulwark-Captains who lead the Aegis today trace their lineage to his original shield, and every Spellguard\'s Silence Resonance is a descendant of the energy he first learned to hold. The magic hasn\'t stopped coming since. Raise a shield in Sundale and you inherit Damon\'s trick, and the debt that comes with it: the body that learns to hold the fire learns what he learned, one absorbed blow at a time.',
 relatedTerms: ['emberspire', 'sundale', 'emberth', 'solbrand', 'spellguard']
  },

  'kora': {
 id: 'kora',
 term: 'Kora the Veil-Speaker',
 type: 'character',
 role: 'Co-founder of the Revenant Path',
 region: 'bryngloom-forest',
 summary: 'The Vreken who bound living flesh to ancestral ghost, so the dead could keep speaking through the living. Her half of the Revenant art is a gift, not a debt.',
 fullEntry: 'Kora refused death because her ancestors needed a living voice. A Clean Vreken of the Bryngloom, she bound living flesh to ancestral ghost, a blood-covenant that lets the dead speak through a living host. Her founding act was not selfish survival but continued service: the candle-flames that guided the Vreken through the peat-bogs were dimming, and Kora fed them her own vitality, converting her blood into luminous death-magic until the dead she tended began to scream back through her skin.\n\nHer half of the Revenant tradition, carried now by the Twice-Born of Kor-Vasseth, inherits that compassion. The other half, Vesper the Scribe\'s contractual undeath, inherited something colder. The two share a body of technique but diverge on the question of whether undeath is a gift or a debt. Kora\'s answer was always the same: the dead ask, and the living owe. Carry that voice, and you carry her covenant.',
 relatedTerms: ['sunken_spire', 'bryngloom-forest', 'root_veil', 'vreken', 'revenant']
  },

  'vesper': {
 id: 'vesper',
 term: 'Vesper the Scribe',
 type: 'character',
 role: 'Co-founder of the Revenant Path',
 region: 'bryngloom-forest',
 summary: 'The Neth who wrote undeath into a contract: the Postmortem Corvée that binds the deceased to continued labor. Her half of the Revenant art is a debt, not a gift.',
 fullEntry: 'Vesper the Scribe discovered that the bog\'s preserving ichor, the same substance that sustains the First Contract, could arrest the dying process itself. A Velun Neth of the Bryngloom, she bound her soul to a carved basalt phylactery and achieved a state of perpetual dying: neither alive nor dead, sustained by the cold preservation of the deep peat. Then she wrote it into law. The Postmortem Corvée is her clause, a legally-binding contract that conscripts the deceased debtor into continued labor after death.\n\nWhere Kora the Veil-Speaker\'s undeath was a gift offered to the ancestors, Vesper\'s was a debt owed to the Keeper, deferred collection, not avoided death. The frost-stasis arts that preserve the Neth Revenants descend from Vesper\'s original contractual language, and every clause that binds a Morrath debtor to posthumous service traces back to her quill. The dead still work the sumps of the Bryngloom. Sign a Morrath contract, and you may join them sooner than you think.',
 relatedTerms: ['sunken_spire', 'bryngloom-forest', 'velun', 'house_morrath']
  },

  'orven': {
 id: 'orven',
 term: 'Orven the Still-Handed',
 type: 'character',
 role: 'Co-founder of the Inquisitor Path',
 region: 'bryngloom-forest',
 summary: 'The Vreken who severed the first corrupted ancestral bond with cold iron, founding the severance half of the Inquisitor art. His hands have never trembled since.',
 fullEntry: 'A shaman-ghost turned predatory, and Orven cut the bond that held it with cold iron. A Clean Vreken of the Bryngloom, he co-founded the Inquisitor tradition in that cut, recognizing that corrupt bonds could be diagnosed by their bioluminescent signature and severed with the right tool. His Bryngloom-rooted half of the Barbed Vow tracks supernatural infection through the Root-Veil itself, feeling corruption as a wrongness in the skin.\n\nOrven has gone dark. He was last recorded during a final network-severance in the deep Bryngloom, neither confirmed dead nor returning, and the Inquisitors who follow him still wait for word that may never come. His hands never trembled: the Still-Handed title is a description, not a boast. Take up the cold iron, and you may be the one to find what he found, or to learn why he stopped reporting back.',
 relatedTerms: ['sunken_spire', 'bryngloom-forest', 'root_veil', 'vreken']
  },

  'elias': {
 id: 'elias',
 term: 'Elias the Salt-Scarred',
 type: 'character',
 role: 'Co-founder of the Inquisitor Path',
 region: 'frostwood-reach',
 summary: 'The Thalren who opened his own veins to draw Wyrd horrors into flesh where they could be named and cut. The salt-scars map every entity he baited and killed.',
 fullEntry: 'Elias the Salt-Scarred opened his own veins to draw Wyrd-creatures into living flesh where they could be named, categorized, and cut. A Thalren of the Frostwood Reach, he co-founded the Inquisitor tradition on that technique: the Gref, the Gambrel, the face-stealing horrors born from human fear, he baited them with his own blood and broke them on his own terms. The salt-scars that cover his body are the map of every entity he baited and killed.\n\nWhere Orven severs corrupted bonds, Elias creates them, then severs them himself. His is the active, aggressive half of the Inquisitor art, and anti-Wyrd paranoia, for the Thalren who follow him, is not a personality trait but a survival discipline learned over eight fog-eaten centuries. The fog is still birthing things that wear the faces of the people they took. Open a vein in the deep Reach, and you will learn what Elias learned: some horrors only answer to the blood that calls them, and the cost of the calling is written forever in the skin.',
 relatedTerms: ['frostwood-reach', 'sunken_spire', 'gref', 'gambrel']
  },

  'triune-founders': {
 id: 'triune-founders',
 term: 'The Triune Founders',
 type: 'character',
 role: 'Founders of the Animist Path',
 region: 'nordhalla',
 summary: 'Kael, Nyssa, and Theron, the three tradition-carriers from Ordan, Vreken, and Skald lineages who fused disparate ancestral arts into one.',
 fullEntry: 'The Animist tradition has no single founder. It was born at a crossroads where three tradition-carriers met and recognized the scars each carried from their separate ancestral arts. Kael of the Ordan brought totemic invocation, calling ancestors through the overtone of the migration-horse song across the Sundrift Vale. Nyssa of the Vreken brought spore-communion, breathing in the bioluminescent dead and letting them speak through shifting skin-glow. Theron of the Skald brought runic inscription, carving ancestors\' names into living flesh as permanent anchors. Together they formed the tri-regional council that became the Ancestral Convergence, and their three dialects, now fracturing, are the Animist\'s shared language. Learn all three and you hold what the founders held at the crossroads; lose one, and the Animist art loses a third of the voices it was built to carry.',
 relatedTerms: ['frozen_archive', 'nordhalla', 'sundrift-vale', 'bryngloom-forest', 'root_veil']
  },

  'first-cabal': {
 id: 'first-cabal',
 term: 'The First Cabal',
 type: 'character',
 role: 'Founders of the Pyrofiend Path',
 region: 'sundale',
 summary: 'Seven Solvarn occultists who swallowed Scathrach\'s burning coals in an obsidian cavern beneath Emberspire, trading their souls for Wyrd-touched fire.',
 fullEntry: 'Seven Solvarn occultists, nobles of the house that helped entomb Sol, gathered in an obsidian cavern beneath Emberspire and swallowed the burning coals offered by Scathrach the Ashen Sovereign. They understood the pact they were making: Wyrd-touched fire in exchange for eventual collection. The seven scattered after their pact, each founding a separate Pyrofiend lineage that survives today. Their individual names have been deliberately erased; the Ashen Communion considers anonymity a form of protection, since the Wyrd-entity Scathrach knows exactly who it is coming to collect. What the Cabal did not anticipate is that Scathrach would one day call in all seven debts simultaneously, and that day has come. Swallow the coal and you join the Cabal\'s lineage, and the Ashen Sovereign is collecting every debt at once.',
 relatedTerms: ['emberspire', 'sundale', 'house_solvan']
  },

  // ============================================================
  // CORE EVENTS & CONCEPTS
  // ============================================================

  'rebirth-cycle': {
 id: 'rebirth-cycle',
 term: 'Rebirth Cycle',
 type: 'concept',
 region: 'sundale',
summary: 'Outdated theory. The twelve-year pulse was Aex screaming, not Sol rekindling. The Augurs now know the old model was wrong.',
  fullEntry: 'Every twelve years, the Solbrand surges. A pulse of heat and light rises from beneath Emberspire, ripples outward, and subsides. For eight centuries the Augurs called this the Rebirth Cycle: Sol\'s attempt to rekindle, consumed each time by Keth-Amar before it could crest. They measured the decline: 40%, then 31%, then 14%, then 2%, then 0%. Sixty-five pulses. The star, they said, was failing.\n\nThey were wrong. The pulse is not Sol trying to rekindle. Sol is in forced torpor, unable to rebirth, unable to die. The twelve-year resonance is the natural harmonic of the seven Sundered Monoliths trying to sync up. Every pulse was Aex screaming — the lynched firstborn, stretched across the vault, his scattered body parts straining toward reunion.\n\nThe Augurs measured the scream\'s output. 40% to 0% across sixty-five pulses. The scream did not weaken because Sol\'s fire was dying. It weakened because Aex was exhausting. He has stopped screaming. The Monoliths are waking not because he wants them to, but because he can no longer hold them still.\n\nThe calendar months of First Thaw and The False Dawn remain cultural echoes of the old belief: the brief weeks when surface frost melts slightly and the eastern horizon glows amber for an hour before fading. The holiday called First Thaw Vigil is not a celebration. It is the population of Sundale standing in their doorways at dawn, watching for a pulse that no one has the heart to tell them was never a rebirth.',
 relatedTerms: ['solbrand', 'the_deepening', 'keth_amar', 'frozen_archive', 'sundale', 'augur', 'dawn_vigil', 'emberspire']
  },

  'the-first-thermal-war': {
 id: 'the-first-thermal-war',
 term: 'The First Thermal War',
 type: 'event',
 region: 'cragjaw-peaks',
 summary: 'The first war of the Dimming fought over heat rather than honor. Three factions met in the Cragjaw tunnels where the geothermal vents were dying, and two decades later the Steam-Line Cartel owned every warm pipe in the Peaks.',
 fullEntry: 'The Dimming was an inconvenience until the vents began to fail. Then it became a war.\n\nIn the first centuries of the long cold, three factions converged on the same dying geothermal vein beneath the Cragjaw Peaks. Fexric holdfasts had heated their great-halls off that vein for generations; the tunnels were ancestral, the infrastructure was theirs, and they would not abandon either. Nordhalla Skald refugees came south along the Hunger Road, their own vents dead, pressing into Cragjaw territory with nothing left to lose. The Groven toll-keepers of the Ancestor-Spans saw every tunnel as a passage, and every passage as a tollable thing.\n\nThey fought for two decades. Perhaps three thousand died, a small number by the standards of later wars, but the first number that mattered. The First Thermal War proved the shape of everything that followed: as the vents cooled, populations moved, and the displaced clashed with the entrenched. Heat, not honor, would decide who lived.\n\nOut of the corpses came the Steam-Line Cartel. The surviving geothermal pipes were consolidated into a single distribution network, and the Cartel set the price for every drop of warmth that crossed the Peaks. The Groven signed their first formal toll-treaties at Ironjaw Port: bridge-rights recognized, in exchange for regulated rates. The treaties held. The roads stayed open. The Groven became the gatekeepers of Cragjaw transit, and they\'ve collected on every crossing since.\n\nThe war is over. The pattern it set is not. Walk the Hunger Road today and you will see the same refugees, the same failing vents, the same entrenched powers deciding who freezes. The Steam-Line Cartel still owns the pipes. The Groven still own the bridges. And the next war over heat is already being negotiated in the toll-houses along the Spans.',
 relatedTerms: ['cragjaw-peaks', 'fexrick', 'groven', 'ancestor_gaps', 'ironjaw_port', 'house_skalvyr', 'nordhalla']
  },

  'the-war-of-thousand-screams': {
 id: 'the-war-of-thousand-screams',
 term: 'The War of Thousand Screams',
 type: 'event',
 region: 'cragjaw-peaks',
 summary: 'The largest war of the mid-Diming centuries. Twenty years of screams beneath Frostmaw Holdfast, and when it ended the Deep Alchemists were gone, the Chronarch tradition was born, and the Groven had walled the Spans.',
 fullEntry: 'Centuries into the Dimming, two catastrophes met beneath Frostmaw Holdfast, and the war that followed lasted twenty years.\n\nThe Deep Alchemists had been pushing experiments in the lowest tunnels until the experiments pushed back. Containment failed. Warped biological constructs and raw alchemical runoff flooded the lower galleries, and at the same moment the last geothermal vents across the Cragjaw Peaks began to fail. Every major hold fought every other for the few warm zones that remained. The surface war was fought over heat. The war beneath was fought against things that had once been alchemy.\n\nFour things survived that war, and none of them can be undone. Nesta, a Fexric engineer, built her time-dilation engine in the ruins of a collapsed alchemy-vat. Her first successful stitch rewound a tunnel collapse by forty seconds, and three hundred trapped miners walked out alive. The Chronarch tradition traces itself to that stitch. The Steam-Line Cartel came through the chaos holding every geothermal pipe in the Peaks, and no challenger has risen since. The Deep Alchemists, knowing their work could never again be safe near the surface, sealed themselves into the lowest tunnels and were never recorded again. And the Groven walled the Ancestor-Spans as permanent military checkpoints, a posture they have held through every war since.\n\nThe war takes its name from the sound the escaped constructs made, a chorus of synthetic, echoing screams that the sealed galleries have never stopped repeating. Miners who work the deep claims say the screaming still rises through the rock on quiet nights.\n\nThe lower tunnels are closed. The screams are not. Descend into Frostmaw Holdfast far enough and you will hear what the Deep Alchemists left behind, and you will understand why the Groven won\'t lower the Spans, no matter who asks.',
 relatedTerms: ['cragjaw-peaks', 'frostmaw_holdfast', 'deepchasm_keep', 'chronarch', 'groven', 'ancestor_gaps', 'fexrick', 'nesta']
  },

  'the-toll-wars': {
 id: 'the-toll-wars',
 term: 'The Toll Wars',
 type: 'event',
 region: 'cragjaw-peaks',
 summary: 'Sixty years of skirmishes over the Groven bridges of the Cragjaw chasms. The noble houses won their right to cross. The Groven won the right to keep charging them for it.',
 fullEntry: 'The Groven built the Ancestor-Spans, massive bone-and-iron bridges across the Cragjaw chasms, and the Groven have always collected for the crossing. Centuries into the Dimming, when the thermal refugees came west in numbers the Spans had never seen, the Groven raised their rates. Then they raised them again.\n\nThe Toll Wars were not a war. They were sixty years of skirmishes, ambushes, sieges, and broken treaties, fought across the length of the Spans. Nordhalla Skald caravans that could no longer afford the toll turned to force. Sundale merchant trains turned back at Deepchasm Keep came back with blades. The bloodiest engagement was at Ironjaw Port, where a combined Nordhalla-Sundale force seized the bridge customs-house and tried to hold it until the rates were renegotiated. The Groven defenders held for eleven days. Reinforcements arrived from the Tesshan high-keeps, and the siege broke.\n\nThe wars ended at a table, not on a bridge. Ithra-Mal, an Ithran diplomat, negotiated the first sovereign treaty to recognize Groven bridge-rights, in exchange for capped rates and guaranteed passage for every recognized noble house. The houses signed because they had no other crossing. They have resented the terms for six centuries.\n\nThe Spans still stand. The toll-houses still open at dawn. Cross the Ancestor-Spans today and you\'ll pay the Groven rate, sign the Groven ledger, and learn what every noble house learned under Ithra-Mal\'s treaty: the only thing worse than paying the Groven is not crossing at all.',
 relatedTerms: ['cragjaw-peaks', 'groven', 'ancestor_gaps', 'ironjaw_port', 'deepchasm_keep', 'house_tesshan', 'house_skalvyr', 'sundale']
  },

  'the-memory-wars': {
 id: 'the-memory-wars',
 term: 'The Memory Wars',
 type: 'event',
 region: 'frostwood-reach',
 summary: 'A hundred-year cold war in the Frostwood Reach, fought with ink and erasure rather than blades. The Scribe-Cartel kept the ledgers. The Forgotten carved their names into ironwood instead.',
 fullEntry: 'Centuries into the Dimming, the Frostwood Reach fought a war that produced no battlefields and no corpses, only empty pages. The Scribe-Cartel held the only ink that survived the fog, Soot-Resin Ink and Peat-Parchment, and whoever held the ink held the law. A family whose ledger was complete had rights. A family whose ledger was damaged, incomplete, or never purchased had nothing.\n\nThe Forgotten were the families who had lost that ledger. Some rotted in the fog. Some had ancestors who were never written down. Some had been erased on purpose, during Cartel "audits" that left whole villages legally nonexistent. They organized in the only way left to them: raiding archive-towers and ledger-shrines, stealing blank parchment, burning Cartel ink-stores, and carving their own names into the ironwood trunks in defiance. The ink might fade. The bark would remember.\n\nThe Cartel answered with ink-embargoes on whole villages, a swollen Mist-Sentinels border guard, and a standing bounty on any Thalren caught carrying forged documents. The Briaran stepped into the gap. Their tell-songs pass by voice, not parchment, and the fog can\'t eat a song. They sheltered Forgotten fugitives in the canopied deep-groves, and the Cartel has never forgiven it.\n\nThe Memory Wars ended in stalemate. The Forgotten stayed undocumented. The Cartel stayed in power. And the Briaran remained the only folk the Mist-Sentinels refuse to patrol.\n\nWalk the Reach with a name on paper and the Cartel can wipe it. Walk it without one and the Briaran may hide you. The ink is still wet, the ledgers are still open, and the war that produced no corpses is still being fought in every archive-tower from Greymark to the ironwood edge.',
 relatedTerms: ['frostwood-reach', 'scribe-cartel', 'sovereign-ledger', 'briaran', 'house_thalreth', 'ledger_halls', 'scribes_tower', 'memory_fog_mechanics']
  },

  'the-false-dawn-riots': {
 id: 'the-false-dawn-riots',
 term: 'The False Dawn Riots',
 type: 'event',
 region: 'sundale',
 summary: 'The night the 40th Rebirth Window opened and produced nothing. Sundale burned its temples, the Frozen Archive sealed its gates, and the Korr began the silence they have never broken.',
 fullEntry: 'For nearly five centuries the priests of Sundale had promised the same thing: Sol would rise again, the next window would be the one, the Dimming was temporary, the warmth would return. In the later centuries of the Dimming, the fortieth Rebirth Window opened and produced nothing. No surge. No glow. The eastern horizon stayed dead.\n\nThe lie broke overnight. Temples burned across the Caldera Ward. Augurs who had spent careers predicting imminent rekindling were dragged from the Frozen Archive\'s satellite observatories and beaten in the streets. The Archive sealed its gates and did not open them for eleven years.\n\nHouse Solvan\'s Imperium, already failing, collapsed. Its remaining authority dissolved the night Ash-Dwellers stormed the Harath-Vault. Into the vacuum stepped the Dawn Vigil, until then a ceremonial order of sun-priests. They seized the Obsidian Citadels, declared martial law, and never gave the authority back.\n\nThe riots also birthed the Solbrand\'s concealment. The Korr, the tending-clan sworn to keep the sacred flame, had known for decades that the Solbrand was dimming. They chose silence over panic. In the chaos of the riots, that silence became permanent policy, and the Korr have hidden the flame\'s decline from every generation since.\n\nThe temples of the Caldera Ward are rebuilt. The Dawn Vigil still rules from the Obsidian Citadels. But the Korr still keep their silence, the Solbrand still dims, and the next window is already being counted down by an Auguriate that learned, forty windows ago, never to promise that the dawn will come. Stand in a Sundale doorway at the next First Thaw Vigil and you\'ll see what hope looks like when it has been promised away for centuries. Whether you keep it or break it is the only question the Korr have left to the rest of us.',
 relatedTerms: ['sundale', 'rebirth-cycle', 'solbrand', 'dawn_vigil', 'house_solvan', 'emberspire', 'frozen_archive', 'harath_vault', 'augur']
  },

  'the-silence-heat-heresy': {
 id: 'the-silence-heat-heresy',
 term: 'The Silence-Heat Heresy',
 type: 'event',
 region: 'nordhalla',
 summary: 'Nordhalla\'s deepest shame and its only remaining warmth. Frigga Skalvyr buried a heat-engine beneath the Frozen Archive and traded the Glacier Bargain\'s stability for stolen fire.',
 fullEntry: 'Within living memory, Frigga Skalvyr looked at the cold that was killing her house and made a choice every Skald elder would have called unthinkable. She excavated a chamber beneath the Frozen Archive, the most sacred ground in Nordhalla, where generations of Skald dead stand preserved in the glacier ice. Into that chamber she built a heat-engine powered by Emberspire obsidian, volcanic glass stolen from Sundale, and calibrated by outlawed contact with a bound Pyrofiend. House Skalvyr had publicly condemned the Pyrofiend and their Wyrd-touched bargains for centuries. Frigga made one.\n\nThe engine worked. Heat spread through the Archive, the fjord-gate garrison, and the northern keeps, the first real warmth Nordhalla had felt in generations. Then the price came due.\n\nThe thermal gradient disturbed the glacier-preserved dead. A slow temporal friction crept into the ice, distorting its preservation, contaminating the Augurs\' readings with ghost-data bleeding in from centuries past and centuries yet to come. Skald rune-readers stationed near the engine saw double. Three Augurs fell into prophecy-trances from which they have never awakened.\n\nFrigga traded the Glacier Bargain\'s stability for stolen warmth, and the question of whether she saved Nordhalla or doomed it is the one every shaman now asks and none can answer. The engine still burns beneath the Archive. The dead still shift in the ice. And the cold that Frigga tried to kill is still coming, slower now, warmed by a fire that was never hers to light. Stand in the Frozen Archive and listen. The glacier will whisper two things at once: what was, and what will be. The Augurs can\'t tell them apart anymore. Perhaps you can.',
 relatedTerms: ['nordhalla', 'house_skalvyr', 'frozen_archive', 'emberspire', 'pyrofiend', 'augur', 'frigga-skalvyr']
  },

  'the-sundale-civil-war': {
 id: 'the-sundale-civil-war',
 term: 'The Sundale Civil War',
 type: 'event',
 region: 'sundale',
 summary: 'A three-way war over one question: what does it mean when the fire goes out? The Risen keep the faith, the Sunderer are hunted, and the Scoured scour the badlands for the shards of Sol\'s broken seal.',
 fullEntry: 'The Sundale Civil War began within living memory and has never formally ended. It is a doctrinal war fought over a single question: what does it mean when the fire goes out?\n\nThe Risen hold the old faith. They believe Sol will rekindle, that the Rebirth Cycle will one day succeed, that the cost of faith must be paid whatever comes. They control the conservative wing of the Dawn Vigil and the upper reaches of the Harath-Vault. The Sunderer are heretics. They believe the Solbrand is not Sol\'s warmth but Keth-Amar\'s feeding-line, that the sacred flame is the predator\'s feeding-tendril, and that extinguishing it would free Sol from consumption. They are hunted, outlawed, and growing in number among the Ash-Dwellers who have seen nothing but dimming all their lives. The Scoured go further. They deface their forge-marks, sever their ancestral contracts, and scour the badlands for Monolith Shards, the fragments of Sol\'s original binding seal. Their answer to the Dimming is to reassemble the Sundered Monoliths, re-forge the vault, and re-entomb Sol properly, knowing full well this would summon Keth-Amar to consume what remains.\n\nThe Dawn Vigil has split down the same fault. One faction wants the Monoliths reassembled regardless of consequence. The other would rather let the star die than summon the predator back. Hierophant Aethelgard seized the Korr territories as strategic assets and began the formal conscription of Martyrs, individuals who carry Sol\'s sacred scars, as weapons in a war no one is winning.\n\nThe fire\'s still going out. The three faiths still answer the question three ways, and none of them can afford to be wrong. Choose a side in Sundale, or refuse all three, and the question still finds you: when the last ember dies, will you have prayed, will you have hunted, or will you have scoured the badlands for the shards of a seal that should never be re-forged?',
 relatedTerms: ['sundale', 'solbrand', 'rebirth-cycle', 'dawn_vigil', 'keth_amar', 'house_solvan', 'martyr', 'emberspire', 'the_breach', 'harath_vault']
  },

  'sovereign-ledger': {
 id: 'sovereign-ledger',
 term: 'The Sovereign Ledger',
 type: 'concept',
 region: 'frostwood-reach',
 summary: 'The Frostwood Reach\'s legal system. If you are not written in the Sovereign Ledger, you do not legally exist.',
 fullEntry: 'In the Frostwood Reach, written record is the only record that survives. Living memory rots in the fog. So the Sovereign Ledger was built: a centralized registry of every citizen\'s lineage, property claim, and legal standing, sealed in the archive-vaults beneath Greymark Keep in the first centuries of the Diming.\n\nThe Scribe-Cartel monopolizes the only materials that resist the fog, Soot-Resin Ink and Peat-Parchment, making literacy and legal recognition the same thing. Every birth, death, marriage, and property transfer must be recorded on Cartel-certified parchment in Cartel-certified ink, at Cartel-set prices. A family whose ledger is lost becomes Forgotten. A family that cannot afford Cartel prices becomes Forgotten. A family whose records the Cartel decides contain errors becomes Forgotten.\n\nThe system divides the Reach into two classes. The Ledgered hold rights to property, trade, marriage, and standing in a Thalren court. The Forgotten hold nothing. They cannot own land. They cannot testify. They cannot marry a Ledgered citizen. They can be expelled from any settlement at the Cartel\'s discretion.\n\nLord Aldren Thalreth formalized the system with his Ledger Purge in the first generations of the Diming. He consolidated every regional record into a single sealed vault at Greymark Keep and declared that any claim not present in the consolidated ledger was silence. The Purge eliminated three noble houses from legal existence in a single afternoon. Their descendants walk the Reach today as Forgotten, with no record that their line ever held a name.\n\nCross the threshold of Greymark Keep and the Ledger knows whether you exist. If your name is in the vault, you have rights. If it is not, the fog has already begun to claim you. The Scribe-Sentinels will not stop it.',
 relatedTerms: ['frostwood-reach', 'scribe-cartel', 'the-memory-wars', 'house_thalreth', 'greymark_keep', 'ledger_halls', 'memory_fog_mechanics', 'aldren-thalreth']
  },

  'scribe-cartel': {
 id: 'scribe-cartel',
 term: 'The Scribe-Cartel',
 type: 'faction',
 region: 'frostwood-reach',
 summary: 'In the Frostwood Reach, only Soot-Resin Ink and Peat-Parchment resist the fog, and only the Scribe-Cartel may make them. Lose your ledger, miss a price, or displease a Sentinel, and your family stops existing.',
 fullEntry: 'In the Frostwood Reach, the fog eats memory, and the Scribe-Cartel sells the only cure. Soot-Resin Ink and Peat-Parchment are the two materials that resist the fog\'s erosion, and the Cartel holds the monopoly on both: who makes them, who sells them, and what they cost. The Sovereign Ledger demands that every birth, death, marriage, property transfer, and legal judgment be written on Cartel-certified parchment in Cartel-certified ink, at prices the Cartel sets. If it isn\'t written in their ink, it didn\'t happen.\n\nThis makes the Cartel the arbiter of existence. A family whose ledger rots in the fog becomes Forgotten. A family that can\'t meet the Cartel\'s prices becomes Forgotten. A family whose records a Scribe-Sentinel decides contain an error becomes Forgotten, and the Forgotten cannot own land, cannot testify, cannot marry into the Ledgered, and can be driven from any settlement at the Cartel\'s word. Every ledger-page passes through the Scribe\'s Tower near Greymark Keep, where the senior Sentinels inspect each one for the ink\'s integrity and the writing\'s obedience.\n\nThe Cartel holds a charter from House Thalreth, which makes it formally a trade guild. The distinction is a courtesy. A body that controls who can read, who can be remembered, and what the records say does not answer to any house. Its power is theocratic in all but name, and the Thalreth sign the Cartel\'s decrees because the alternative is to be edited out of their own archives.\n\nThe ink is still wet, the ledgers are still open, and the Sentinels are still taking names. If you walk the Reach with a name on paper, the Cartel can wipe it. If you walk it without one, the Cartel is the only authority that could give it back.',
 relatedTerms: ['frostwood-reach', 'sovereign-ledger', 'the-memory-wars', 'the-great-revision', 'house_thalreth', 'scribes_tower', 'greymark_keep', 'ledger_halls', 'memory_fog_mechanics']
  },

  'brine-bond-syndicate': {
 id: 'brine-bond-syndicate',
 term: 'The Brine-Bond Syndicate',
 type: 'faction',
 region: 'iceheart-sea',
 summary: 'Centuries into the Dimming, the Brine-Bond Syndicate took the Iceheart Sea\'s lanes and turned storm-luck into a commodity. From Merrowport they tax the Merryn\'s gift for surviving the weather, and tattoo the debt straight onto the skin.',
 fullEntry: 'Centuries into the Dimming, when the Iceheart\'s storms grew teeth and the old crossings weren\'t safe anymore, the Brine-Bond Syndicate opened its doors at Merrowport and never closed them. They govern the commercial lanes now. Every hull that turns a profit on cold water does so because the Syndicate allows it.\n\nThe Syndicate\'s first invention was the Luck-Ledger. Merryn sailors have always carried storm-luck, the thing that decides whether a ship comes home or vanishes behind the next swell. Once, that was a gift between a sailor and the sea, unmeasured and free. The Syndicate put a number to it. They measured luck, wrote it down, taxed it, and then began to trade it. A Merryn born lucky can sell the surplus. A Merryn running dry can buy more, at Syndicate rates, on Syndicate terms, forfeit the moment they default. The sea still decides who drowns. The Syndicate just decides who can afford to try.\n\nThey also hold the Sea-Charter. Every vessel on the Iceheart must be Syndicate-registered, crewed by Syndicate-certified sailors, and bonded through Syndicate-approved insurers. Sail under those papers and you\'re a trader. Sail without them and you\'re a Bilge-Dweller, an undocumented hand pressed into a hull whose debt is built to outlive you. The Syndicate marks every member in skin-tattoos laid down at the Merrowport registry-house. A Merryn\'s body is a ledger. Every line of ink is a contract binding them to the house.\n\nThe lanes are open, the rates are posted, and the registry-house doesn\'t sleep. If you want to sail the Iceheart and come back, you\'ll sign somewhere, ink will go into your skin, and the Brine-Bond will own a share of every wave you cross.',
 relatedTerms: ['iceheart-sea', 'house_mereval', 'merrowport', 'merryns_drift', 'skalds_longport', 'ironjaw_port']
  },

  'the-great-revision': {
 id: 'the-great-revision',
 term: 'The Great Revision',
 type: 'event',
 region: 'frostwood-reach',
 summary: 'The Frostwood Reach\'s longest-running conspiracy, and the one that cannot be proven. Senior Scribe-Sentinels edit the ledger-libraries, erasing family lines and rewriting history, and every generation of Sentinels believes it was the first to think of it.',
 fullEntry: 'In the later centuries of the Dimming, the senior Scribe-Sentinels of the Frostwood Reach discovered what the fog could do for a patient hand. Because the fog erases memory, a living document, one still being read, copied, and revised, can be edited without detection. Add a line today and within a generation it will be remembered as having always been there. Remove a line and within a generation it will be forgotten as having ever existed.\n\nEach cohort of Sentinels believes it is the first to make this discovery. Each cohort, upon making it, uses it, unaware that its predecessors did precisely the same. The cumulative damage stretches across every ledger-page ever written, and no one can measure it because the measuring would require the very records the Revision has already changed.\n\nEntire family lines have been erased and replaced. Noble houses that stood in the early centuries of the Dimming appear in no census from the mid-Diming centuries. Treaties whose terms were quietly "corrected" now bind houses to obligations their ancestors never agreed to, and the houses pay, because the Ledger says they always did.\n\nThe Revision cannot stop. No generation of Sentinels can verify what its predecessors changed, and the Cartel\'s authority depends on the Ledger being the source of truth. Question the Ledger and the Cartel falls. So the Cartel guards the Ledger, the Sentinels keep editing it, and the truth has been rewritten so many times that the original no longer exists.\n\nOpen a ledger in the Frostwood Reach and you\'ll read a history that believes itself. Every line was always there. Every name was always gone. The Sentinels are still writing, the fog is still eating, and the only record you can trust is the one no one has touched yet. Find it before they do.',
 relatedTerms: ['frostwood-reach', 'scribe-cartel', 'sovereign-ledger', 'house_thalreth', 'scribes_tower', 'ledger_halls', 'memory_fog_mechanics']
  },

  // ============================================================
  // CONCEPTS: Wyrd, Monoliths, Tithe
  // ============================================================

'the_corruption_years': {
  id: 'the_corruption_years',
  term: 'The Corruption Years',
  type: 'event',
  region: 'sundale',
  summary: 'Years 3-11 after the Binding, when Keth-Amar whispered to the houses for eight years, offering Sol\'s own warmth deceptively to crack the seal.',
  fullEntry: 'The Binding held for eight years. Then it broke. The Corruption Years span that interval — years 3 through 11 after the Binding — in which Keth-Amar worked on each house individually, tailoring its whispers to their deepest fears.\n\nKeth-Amar did not rage against the seal. It did not batter the vault with cosmic force. It whispered. The Wyrd is its corruption breathed into folklore: every Gref, every Gambrel, every Stel that now walks the world is a shape Keth-Amar learned to wear during these years.\n\nKeth-Amar offered Sol\'s own warmth deceptively to the houses, pretending it could free heat for them while using the bargains to crack the seal. It worked each house separately, studying their folklore, their famine-memories, their ancestral phobias. It has never broken a bargain under the Warden\'s framework, because it never needed to — it simply made offers whose fulfillment was itself the trap.\n\nThe result was the Breach. Six houses broke. Viridane alone heard a different voice in the mist, older than Keth-Amar\'s hunger and more patient, and they turned south while the other six turned north.',
  relatedTerms: ['keth_amar', 'the_breach', 'the_deepening', 'wyrd', 'house_thalreth', 'house_skalvyr', 'house_solvan', 'house_mereval', 'house_tesshan', 'house_ordavan', 'house_viridane', 'neth', 'aex']
    },

'the_partial_seal': {
  id: 'the_partial_seal',
  term: 'The Partial Seal',
  type: 'concept',
  region: 'sundale',
  summary: 'The seal that is neither whole nor broken. Keth-Amar is pressed against it, seeping through cracks, because Viridane\'s heir never agreed to the sacrifice.',
  fullEntry: 'The seal that entombs Sol — woven from Aex\'s flayed hide — was meant to require seven bloodline signatures. Seven houses held it in place. When Keth-Amar\'s corruption broke six of those houses and they marched their firstborn to the peaks, the seal was meant to fall entirely. It did not. Viridane\'s heir never agreed. The Watcher in the Mist reached them first, and they fled south.\n\nBecause only six heirs fed Keth-Amar, the seal cracked but did not shatter. The vault opened partially. The seal remains in a state of permanent fracture: neither whole nor wholly broken. Keth-Amar can seep through the cracks, feed on the energy bleeding through, whisper to those who listen. But it cannot enter fully. It cannot consume Sol whole.\n\nThe six surviving houses could not admit failure. They erased House Viridane from every record, struck their name from every ledger, and elevated House Morrath as a substitute signatory. Morrath\'s blood could not replace Viridane\'s. But the power of institutional denial, backed by eight centuries of pretense, held the seal where true magic could not.\n\nThe true reason for the erasure is cosmic, not political: Keth-Amar hunts through knowledge. To remember Viridane is to leave a thread it can follow. Erasing the name from every archive, burning every portrait, sealing every mention — this was not merely punishment. It was the only way to keep Keth-Amar from following the memory back to the one house that said no.\n\nThe seal cannot be mended. But it was never meant to hold forever. The Monoliths are waking, and when they resume their original positions, the Partial Seal will either snap shut or fall open.',
  relatedTerms: ['house_viridane', 'house_morrath', 'keth_amar', 'the_breach', 'sol', 'sundered_monoliths', 'briaran', 'watcher_in_the_mist', 'memory_fog_mechanics', 'silent_seventh']
    },

   'wyrd': {
 id: 'wyrd',
 term: 'Wyrd',
 type: 'concept',
 region: 'sundale',
 summary: 'The raw substance of unmaking that bled through Sol\'s broken seal. It takes the shape of whatever a population fears most.',
 fullEntry: 'The Wyrd is not magic. It is the raw, entropic substance of unmaking, the blood of Keth-Amar that bled through the fractures in Sol\'s binding seal when the Breach shattered the vault. Where magic builds, the Wyrd unbuilds. Where magic names, the Wyrd unnames.\n\nThe Wyrd answers to mortal consciousness, and what it answers to first is fear. It takes the shape of whatever a population dreads most. In the Frostwood Reach, where the fog steals faces, the Wyrd grew the face-stealing Gref. Among the oath-bound, it grew the Gambrel, which hunts those who break their promises. In the glacier-fjords of Nordhalla, where the cold preserves the dead, it condensed into the frozen death-echoes called the Stel. Every localized horror in Mythrill is the Wyrd learning a new fear and wearing it.\n\nWyrd concentration was first confined to the Emberspire caldera. Through the Contraction phase of the early and middle Diming centuries, the seal-cracks widened under geothermal pressure and Wyrd-miasma spread across the continent. In the Squeeze that followed, the mid-to-late Diming, Wyrd-density reached epidemic levels. Entire settlements were abandoned to Wyrd-manifestations. The Inquisitor order was founded specifically to hunt and sever Wyrd-creatures, and the cold-iron blade became the only reliable answer.\n\nThe Wyrd is not diminishing. It is accelerating.\n\nStand in the wrong grove at the wrong hour and the Wyrd will learn what you fear. The Inquisitors can teach you to cut it. They cannot teach you to unlearn it. The next shape it wears may already be yours.',
 relatedTerms: ['keth_amar', 'the_breach', 'gref', 'gambrel', 'stel', 'inquisitor', 'emberspire', 'the_deepening', 'the_corruption_years']
   },
 
'sundered_monoliths': {
  id: 'sundered_monoliths',
  term: 'Sundered Monoliths',
  type: 'concept',
  region: 'sundale',
  summary: 'Seven fragments of Aex\'s body scattered when the seal cracked — six true Monoliths and one false echo, all parts of Sol\'s binding seal.',
  fullEntry: 'When the six houses fed their firstborn heirs to Keth-Amar at the Breach, the binding seal — woven from Aex\'s flayed hide — fractured into seven fragments. But only six are real. Viridane\'s signature was never placed, so the seventh Monolith is a hollow echo, a stone with no binding power.\n\nThe six true Monoliths are parts of Aex\'s body, scattered across the continent:\n\n**Fog-Hand** — House Thalreth. The right hand, skin. Lodged in the Frostwood Reach, where its presence thickens the memory-fog.\n\n**Ice-Crown** — House Skalvyr. A fragment of forehead and skull. Buried in Nordhalla\'s glaciers, radiating cold that compounds the eternal winter.\n\n**Wind-Bone** — House Tesshan. A rib bone. Embedded in the Cragjaw Peaks, howling through the blizzard-veil.\n\n**Depth-Breath** — House Mereval. The lungs. Sunk beneath the Iceheart Sea, broadcasting a low-frequency command signal that certain Wyrd-creatures obey.\n\n**Grass-Spine** — House Ordavan. The spine. Lodged in the Sundrift Vale, its presence intensifying the Silt-Tide\'s restless rhythm.\n\n**Still-Heart** — House Solvan. The heart. But this is the false decoy. Solvan\'s Monolith was deliberately misidentified; the true heart lies elsewhere, hidden even from the houses.\n\n**False Monolith** — House Viridane. No body part. No binding power. A hollow echo where Viridane\'s signature was meant to be.\n\nFor nearly eight centuries these stones lay dormant. Now they are waking. Aex can no longer hold them still. The Dawn Vigil publicly claims reassembling them will restart Sol. Their inner council has calculated it will summon Keth-Amar instead.',
  relatedTerms: ['the_breach', 'aex', 'keth_amar', 'emberspire', 'dawn_vigil', 'treakous_rift', 'cragjaw-peaks', 'sundrift-vale', 'iceheart-sea', 'wyrd']
  },

  'frost_tithe': {
 id: 'frost_tithe',
 term: 'Frost-Tithe',
 type: 'concept',
 region: 'nordhalla',
 summary: 'The price House Skalvyr pays for halting the glaciers. Every frost-touched birth must surrender a life to the cold.',
 fullEntry: 'House Skalvyr halted the advancing glaciers at the price of eternal winter. The Frost-Tithe is the interest on that bargain, collected every frost-touched generation.\n\nEvery child born to the cold bloodlines, Rime-Born, Skald, and the northern families, must pay a life to the cold. The infant survives only by drawing its mother\'s warmth into itself. This is not biology. It is the bargain\'s metaphysical interest, collected on each new birth. Some mothers survive the loss. Many do not.\n\nThe Tithe has worsened since the Solbrand began failing within living memory. The star\'s diminishing thermal resonance can no longer offset the accumulating debt. Mothers who once lost one child in three now lose two. The Frost-Tithe claims twice as many infants as it did a generation ago.\n\nThe only known mitigation is the Ice-Cradles: niches carved into living glacier faces where the deep cold suppresses the tithe\'s pull. Even these are failing as the glaciers themselves begin to shift in response to the Solbrand\'s decline. The Rime-Born carve new Ice-Cradles every winter. The glaciers reclaim them every spring.\n\nWalk the frost-touched bloodlines and you carry the Tithe in your bones. The cold remembers what House Skalvyr promised. The next child born in your line will pay, unless you find a way to break the bargain that the Glacier Bargain has thus far refused to release.',
 relatedTerms: ['house_skalvyr', 'nordhalla', 'rime_born', 'skald', 'solbrand', 'keth_amar']
  },

  'silt_tide': {
 id: 'silt_tide',
 term: 'Silt-Tide',
 type: 'concept',
 region: 'sundrift-vale',
 summary: 'A gravitational anomaly of the Sundrift Vale. Every three months, the soil itself rises and falls like an ocean tide.',
 fullEntry: 'In the Sundrift Vale, the ground breathes. Roughly every three months, the silt and topsoil of the Vale rise in a slow wave, cresting several feet before receding. The Silt-Tide reshapes the landscape with every cycle. It is one of the lingering consequences of House Ordavan\'s dark bargain: when the fertile soil was traded away for endless migration, the land itself grew restless.\n\nThe Ordan migration routes are timed to the Silt-Tide\'s rhythm. The herds move with the tide\'s pull. The ancient cairns and mound-camps of the Vale are built only on ground the tide never reaches, the high places, the star-knolls, the ancestor-wolds. The Astril throat-singers can predict the tide\'s arrival by the way their constellation-spirits hum in response to the shifting earth. They begin the songs days before the soil moves.\n\nThe Silt-Tide does not kill. It buries. A camp pitched on low ground when the tide rises will be under several feet of silt by morning, and those who slept through it will dig themselves out alive but changed: their belongings gone, their bearings lost, and the Vale looking like a different country than the one they went to sleep in.\n\nWalk the Vale with an Ordan guide or do not walk it at all. The Silt-Tide waits for no one. The constellation-spirits are singing, and the soil is already beginning to stir.',
 relatedTerms: ['sundrift-vale', 'house-ordavan', 'ordan']
  },

  // ============================================================
  // ADDITIONAL HISTORICAL FIGURES
  // ============================================================

  'aurel-shorn-first': {
 id: 'aurel-shorn-first',
 term: 'Aurel Shorn-First',
 type: 'historical_figure',
 region: 'frostwood-reach',
 summary: 'The first Smooth-Skinned Briaran, who walked out of the moonlit groves three generations after House Viridane\'s flight.',
 fullEntry: 'Aurel Shorn-First was the first Briaran to systematically shave his thorns flat to the skin and walk the wider world in a borrowed human name. He walked out of the moonlit groves three generations after House Viridane\'s flight (~in the first centuries of the Dimming). The Smooth-Skinned subrace traces its origin to him.',
 relatedTerms: ['briaran', 'frostwood-reach', 'house_viridane', 'ironwood_heart']
  },

  'saren-vel': {
 id: 'saren-vel',
 term: 'Saren-Vel',
 type: 'historical_figure',
 region: 'bryngloom-forest',
 summary: 'The founder of the Drun subrace, the most powerful Velun Neth mage who burned her name from the First Contract.',
 fullEntry: 'Before she was the first Drun, Saren-Vel was the most powerful Velun Neth mage of her generation: a contract-lawyer whose binding-clauses were so precise the Keeper had never found a loophole. She drafted the trade-treaty that opened Ironjaw Port to the Emberth. She wrote the inheritance-contract that resolved a three-century dispute between two Velun bloodlines. She was also unraveling.\n\nFor decades she had been breaking small contracts, a promise here, a receipt there, a skipped ritual, each breach a taste of freedom and a step toward the Fading. The flame she carried into the deepest Bryngloom bog had been prepared over thirty years: pure annihilation, the inverse of the pact\'s preservation, burning only ink. She touched it to the First Contract and her name vanished from every active copy at once. The silence that followed lasted seventeen seconds. Every Neth alive counted them.\n\nShe walked out past guards who could not touch her because no contract authorized them to. She has not spoken a word in four centuries. The Drun revere her as their founder: legally nonexistent, beyond the contract-magic that binds every other Neth, and free. The Velun still call her the greatest legal crisis in their history, a person who exists outside the law and therefore cannot be wrong about anything, because "wrong" requires a standard she no longer acknowledges.',
 relatedTerms: ['bryngloom-forest', 'neth', 'velun', 'drunhold', 'keeper_of_the_last_threshold', 'house_morrath']
  },


  'watcher_in_the_mist': {
 id: 'watcher_in_the_mist',
 term: 'The Watcher in the Mist',
 type: 'entity',
 region: 'frostwood-reach',
 summary: 'An ancient fey presence in the Frostwood\'s moonlit groves, the entity that reached House Viridane before Keth-Amar could claim them.',
 fullEntry: 'Briaran oral tradition names it the Watcher in the Mist, the presence that spoke to House Viridane in the moonlit groves during their flight south. Older than Keth-Amar\'s hunger and more patient, it offered the fleeing family a counter-bargain: protection from the Sun-Eater\'s sight in exchange for a permanent bond to the groves. Its exact nature is unknown, some Briaran theologians believe it is the dreaming consciousness of the dead moon, whose shattered fragments became the lunar parasites; others believe it is the collective voice of the fae court that has inhabited the Frostwood since before humans first set foot on the continent. What is certain is that it chose Viridane, and Viridane chose it, and the Briaran have carried the physical mark of that choice, their thorns, for eight centuries. Walk the moonlit groves with thorns on your arms and you may hear what House Viridane heard; the Watcher is still there, still patient, and still offering its bargain to anyone who carries the blood to hear it.',
 relatedTerms: ['house-viridane', 'briaran', 'lunarch', 'frostwood-reach']
  },

  'dead_moon': {
 id: 'dead_moon',
 term: 'The Dead Moon (Vael)',
 type: 'entity',
 region: 'frostwood-reach',
 summary: 'The shattered corpse of a celestial thing, what the Lunarch parasites hatched from.',
 fullEntry: 'The dead moon was not a moon at all, it was an egg. What laid it, and what it was meant to hatch, are questions no living scholar can answer. When it shattered, whether by violence, age, or the same cosmic hunger that devours Sol, its fragments fell across the Frostwood Reach. The fae of the moonlit groves gathered the largest pieces and nurtured them. From those fragments, the lunar parasites emerged: ancient celestial predators that feed on memory, sensation, sanity, and vitality. The Lunarch class bonds with these parasites, trading warmth and memory for silence-light. The relationship between the dead moon, the Watcher in the Mist, and the lunar parasites is one of the deepest unresolved mysteries in Mythrill. Look up on a clear night in the Frostwood Reach and you\'ll see where the dead moon used to hang, a dark socket in a sky that has no stars; the fragments are below, the parasites are awake, and whatever was meant to hatch may still be growing.',
 relatedTerms: ['watcher_in_the_mist', 'lunarch', 'briaran', 'frostwood-reach']
  },


  'the_risen': {
 id: 'the_risen',
 term: 'The Risen',
 type: 'faction',
 region: 'sundale',
 summary: 'The old faith of Sundale, holding the Harath-Vault and tending the Solbrand on the promise that Sol will rise again when the Sundered Monoliths are whole. The Korr and the deep-born Solvarn still stand with them.',
 fullEntry: 'Someone has to tend the fire, or there\'s no fire to come back to. That is the whole of the Risen\'s faith. They hold to the original theology of the Dawn Vigil: keep the Solbrand at any cost, hunt the Sundered Monoliths down and reassemble them, and Sol will rise the day the seal is whole again. In a Sundale that is eating itself over what the Solbrand actually is, the Risen are the ones who still call it Sol\'s warmth and mean it.\n\nThey keep the Harath-Vault as their stronghold and draw their strength from the Korr Emberth, the Solvarn deep-born, and the old Martyr families who can still remember when the fire answered back. They are the largest of the three factions, and the slowest to raise a hand against a brother, which is why they keep losing ground to those who aren\'t.\n\nThey aren\'t alone in this war. The Sunderer preach that the Solbrand is Keth-Amar\'s feeding line and must be put out. The Scoured deface their forge-marks and hunt Monolith Shards to seal the breach rather than reassemble it. The Risen call both of them heretics, mean it, and keep tending the flame.\n\nThe Solbrand still burns, for now. If you can still feel warmth in it, the Risen have a place for you at the forge, and a long night\'s work to share.',
 relatedTerms: ['sundale', 'dawn-vigil', 'emberspire', 'sol', 'the_sunderers', 'the_scoured']
  },

  'the_sunderers': {
 id: 'the_sunderers',
 term: 'The Sunderer',
 type: 'faction',
 region: 'sundale',
 summary: 'The heretics of Sundale who call the Solbrand a feeding line: Keth-Amar\'s straw, draining the last warmth of a dying star. Their answer is to tear it out and let Sol go.',
 fullEntry: 'Not everyone in Sundale calls the Solbrand a gift. The Sunderer say it is a mouth. They preach that the flame the Risen tend so faithfully is no remnant of Sol at all, but a conduit, the line through which Keth-Amar drains the dying star\'s last warmth one swallow at a time. To feed it is to feed the thing that ate the sun.\n\nTheir answer is the simplest one in the civil war, and the cruelest: put the Solbrand out, starve Keth-Amar, and let Sol die on the chance that the Sun-Eater dies hungry. They gather among the younger Thrask Emberth, among Dawn Vigil defectors who couldn\'t keep tending what they\'d stopped believing in, and among the Ash-Dweller conscripts who have lived their whole lives under a dimming sky and never once felt Sol\'s warmth. The Dawn Vigil has named them anathema. The naming hasn\'t stopped them growing.\n\nThe Vigil hunts them in the open. The Scoured hunt Monolith Shards in the dark. The Sunderer just keep watching the Solbrand and seeing teeth in it, waiting for someone brave enough to pull the flame down.\n\nIf you\'ve stood at the Solbrand and felt nothing but hunger in the heat, the Sunderer will find you, and they\'ll tell you what you already suspect.',
 relatedTerms: ['sundale', 'dawn-vigil', 'emberspire', 'keth_amar', 'the_risen']
  },

  'the_scoured': {
 id: 'the_scoured',
 term: 'The Scoured',
 type: 'faction',
 region: 'sundale',
 summary: 'Named for the forge-marks they cut from their own skin, the Scoured have walked away from Korr and Thrask alike to hunt Monolith Shards across all seven regions. They mean to seal the Breach with them, not relight Sol, and the Dawn Vigil calls them fanatics for it.',
 fullEntry: 'The Scoured take their name from what they do to their skin. Every new member cuts the forge-marks off their flesh on the day they join, walking away from Korr and Thrask bloodline alike. They have no clan left. They chose this.\n\nThey believe one thing, and it is the thing no one in Sundale wants to hear: if the Sundered Monoliths were ever reassembled, the result wouldn\'t be Sol\'s return. It would be Keth-Amar\'s. So the Scoured don\'t want the Monoliths put back together. They want to gather every Shard and hammer it back into the original binding seal, locking the door that the Breach cracked open, even if the star on the other side of it stays dark forever.\n\nThey are scattered across all seven regions, moving in small cells, passing Shard-sightings and safe-house routes through a network that has never had a center. The Dawn Vigil hunts them as dangerous fanatics. The Korr tending-clan mourns them as noble fools. Both are partly right.\n\nThe Shards are still out there, and so are the people quietly gathering them. If you\'d rather seal a door than wait for it to open, the Scoured know the way to the next safe house, and the price of entry is a mark you no longer want to carry.',
 relatedTerms: ['sundale', 'sundered_monoliths', 'emberspire', 'keth_amar', 'the_risen', 'the_sunderers']
  },

  'the_forgotten': {
 id: 'the_forgotten',
 term: 'The Forgotten',
 type: 'concept',
 region: 'frostwood-reach',
 summary: 'The undocumented underclass of the Frostwood Reach. If the Sovereign Ledger does not name you, no Thalren court will hear you.',
 fullEntry: 'In the Frostwood Reach, the Forgotten are the people the Sovereign Ledger does not name. Their entries were lost to the fog, never recorded by the Scribe-Cartel, or deliberately erased during the Great Revision. Without a documented lineage, a Forgotten has no legal rights: no property, no marriage, no testimony that any Thalren court will hear.\n\nThey survive in the palisade-shantytowns thrown up outside Greymark Keep, and in the deeper ironwood groves beyond Cartel reach. They take work the Ledgered will not take. They marry in ceremonies no Scribe-Sentinel will witness. They die in places no Scribe-Sentinel will record. To be Forgotten is to be invisible to the only authority that recognizes existence.\n\nThe Briaran, whose oral history is immune to fog-erasure, have sheltered Forgotten fugitives since the Memory Wars. The Briaran Unwritten Word can tell a Forgotten\'s lineage back six generations from memory alone. The Sovereign Ledger cannot do the same for its own Ledgered families. This is one of the reasons the Briaran and the Cartel distrust each other across every mile of the Reach.\n\nCarry no Ledger-stamp in the Frostwood and the Scribe-Sentinels can erase you with a single line through a registry. Carry a Briaran thorn in your blood, and the Unwritten Word will remember you when the fog and the Ledger are both gone. The choice of who remembers you is yours.',
 relatedTerms: ['frostwood-reach', 'sovereign-ledger', 'scribe-cartel', 'the-great-revision', 'memory-wars']
  },

  'the_fredlose': {
 id: 'the_fredlose',
 term: 'The Fredlose',
 type: 'concept',
 region: 'nordhalla',
 summary: 'The outlaw clans of Nordhalla. They refuse King-Jarl Halvar Skalvyr\'s iron crown and keep the old songs the Runic Academies want burned.',
 fullEntry: 'Beyond the Sunder-Wall, in the frozen wastes no Skalvyr tax-collector reaches, the Fredlose clans live as they did before the Glacier Bargain. Fredlose is Old Nord for "the lawless," and the clans wear the name as a boast. They refuse fealty to King-Jarl Halvar Skalvyr and his iron crown. They answer to no jarl at all.\n\nThey survive by raiding, by mammoth-hunting, and by the old ways the Runic Academies seek to burn. The Frost Chanters among them preserve the oral-history traditions that predate the Glacier Bargain, songs and stories the settled Fastboende have forgotten or been forbidden to sing. Where the Fastboende buried their past beneath the ice to halt the glaciers, the Fredlose kept theirs alive in throat and memory.\n\nThe Fredlose are divided from the settled Fastboende not by blood but by choice. The boundary between them is the Sunder-Wall. A Fastboende who walks beyond it can become Fredlose in a single winter. A Fredlose who walks back can never quite become Fastboende again: the songs do not wash out of the throat.\n\nCross the Sunder-Wall and the Fredlose will test you. Bring a song they have not heard, and they may let you sit at their fire. The glaciers do not negotiate with the iron crown, and neither do they.',
 relatedTerms: ['nordhalla', 'house-skalvyr', 'sunder-wall']
  },

  'the_deck_born': {
 id: 'the_deck_born',
 term: 'The Deck-Born',
 type: 'concept',
 region: 'iceheart-sea',
 summary: 'The officer caste of the Iceheart Sea. Born into registered Mereval families, their skin is a legal document.',
 fullEntry: 'On the Iceheart Sea, command is inherited. The Deck-Born are the officer class of the maritime society, Merryn sailors born into families registered with the Mereval Board of Trade. They command the ships. They hold the Luck-Ledger accounts. They pass their trade-tattoos, legal contracts inked on their skin, to their heirs as the only inheritance that matters.\n\nThe trade-tattoos are the Deck-Born\'s true wealth. Each one is a contract, a charter, a license, or a debt recorded in ink that cannot be erased without erasing the skin that bears it. A Deck-Born captain\'s arm is worth more than the ship beneath them. The Mereval Board of Trade recognizes the tattoos before it recognizes the family name.\n\nBelow the Deck-Born in the shipboard hierarchy are the Bilge-Dwellers: pressed sailors with no registered lineage, no Luck-Ledger accounts, and tattoos that mark them as property rather than partners. The gulf between Deck and Bilge is the central fact of Iceheart maritime life. A Bilge-Dweller who earns enough Luck-Ledger credit to buy their freedom becomes Deck-Born in a single generation, and the Deck-Born officer class fiercely resents and quietly obstructs every such ascension.\n\nTake a Deck-Born\'s post and your skin becomes a ledger. Every contract you sign goes on your arm. Every debt you owe goes on your neck. The Board of Trade reads you before it hears you.',
 relatedTerms: ['iceheart-sea', 'house-mereval', 'brine-bond-syndicate', 'the-bilge-dwellers']
  },

  'the_bilge_dwellers': {
 id: 'the_bilge_dwellers',
 term: 'The Bilge-Dwellers',
 type: 'concept',
 region: 'iceheart-sea',
 summary: 'The pressed-sailor underclass of the Iceheart Sea. Their tattoos are not contracts. They are property-marks.',
 fullEntry: 'Under the Mereval Board of Trade\'s Press-Warrants, any undocumented sailor on the Iceheart Sea can be conscripted into lifetime maritime service. Merryn or not, the pressed become Bilge-Dwellers. They work the bilges. They work the oar-decks. They work the storm-watch that no Deck-Born officer will take. Their service has no end-date and no wage but survival.\n\nTheir tattoos are not contracts. They are property-marks, inked at the moment of pressing to record the debt and the owner. A Bilge-Dweller\'s arm is an invoice. The ink does not wash off and the debt does not diminish. The Press-Warrant system is designed to ensure it never does.\n\nThere is one path out. A Bilge-Dweller who earns enough Luck-Ledger credit can buy their freedom and become Deck-Born in a single generation. The Deck-Born officer class fiercely resents every such ascension and quietly obstructs it at every port. The Board of Trade permits the path in principle and starves it in practice. Most Bilge-Dwellers die Bilge-Dwellers.\n\nTake a Bilge-Dweller\'s oar and the Board of Trade owns your arm. The ink goes on at the pressing. The work goes on until the sea takes you, or until you have earned enough luck to buy back the skin you were born in.',
 relatedTerms: ['iceheart-sea', 'house-mereval', 'brine-bond-syndicate', 'the-deck-born']
  },

  'the_mounted': {
 id: 'the_mounted',
 term: 'The Mounted (De Hesteborne)',
 type: 'concept',
 region: 'sundrift-vale',
 summary: 'The horse-owning aristocracy of the Ordan nomads. Under the Iron-Yurt Law, only the Mounted may speak in the clan-moots.',
 fullEntry: 'On the Sundrift Vale\'s migration circuit, a horse is citizenship. The Mounted, De Hesteborne in the Ordan tongue, are the horse-owning aristocracy of the Ordan nomads, and under the Iron-Yurt Law established by House Ordavan, only they may speak in the clan-moots.\n\nOnly the Mounted carry Steppe-Staves, the carved record of their lineage. Only the Mounted vote on migration routes. They own the herds. They command the migration. They hold the throat-singing traditions that map the starless sky. Their authority over the Unmounted is absolute, and the Iron-Yurt Law enforces it at every camp.\n\nBut the Mounted\'s hold is slipping. Horse-populations decline in the cooling Vale, and every dead mare is a family demoted. A Mounted clan that loses its horses does not become Unmounted in name alone. It becomes Unmounted in law: stripped of its Steppe-Staves, silenced in the moot, and forced to walk the circuit it once commanded. The Iron-Yurt Law does not recognize sentiment, and the frost does not spare the aristocrat.\n\nRide the Sundrift circuit as one of the Mounted and the moot will hear you. The Steppe-Stave in your hand is your voice and your vote. The herds are thinning. The frost is deepening. The law that gave you authority is the same law that will take it back the moment your last horse dies.',
 relatedTerms: ['sundrift-vale', 'house-ordavan', 'the-unmounted']
  },

  'the_unmounted': {
 id: 'the_unmounted',
 term: 'The Unmounted (De Hestelose)',
 type: 'concept',
 region: 'sundrift-vale',
 summary: 'The horse-less underclass of the Ordan nomads. They walk the migration circuit behind the herds, and the Iron-Yurt Law gives them no voice.',
 fullEntry: 'On the Sundrift Vale\'s migration circuit, to walk is to be silent. The Unmounted, De Hestelose in the Ordan tongue, are the horse-less underclass of the Ordan nomads, and the Iron-Yurt Law gives them no voice in the clan-moots.\n\nThe Unmounted cannot speak at the moot. They cannot carry Steppe-Staves. They cannot vote on the migration routes they must walk. They move through the circuit behind the herds, carrying what the Mounted cannot load. They eat after the Mounted eat. They sleep where the Mounted will not sleep. The Iron-Yurt Law is clear, and the Mounted enforce it without sentiment.\n\nThe Unmounted keep their own oral traditions. Throat-sung in private, passed between walking families, the songs are unofficial and unsanctioned. The Mounted dismiss them as the complaints of the dispossessed. The Unmounted call them the true record of the Vale, because the people who walk the ground hear it differently than the people who ride above it.\n\nThe Purge of the Sky-Singers targeted the Unmounted first. The Mounted came for the throat-singers who would not stop the old songs, and the Unmounted remember. They have not forgiven, and they have not stopped singing.\n\nWalk the circuit Unmounted and the law will not hear you. The herds move on without your vote. But if you learn the unsanctioned songs and walk them in private, you carry the record the Sky-Singers died for. The frost does not ask whether you ride.',
 relatedTerms: ['sundrift-vale', 'house-ordavan', 'the-mounted']
  },

  'tharun_muren': {
 id: 'tharun_muren',
 term: 'Tharun Muren',
 type: 'historical_figure',
 region: 'sundrift-vale',
 summary: 'The founder of the Muren Astril path, first to suppress a constellation-spirit through ritual rather than embrace.',
 fullEntry: 'Tharun Muren, an Astril of the Wolf bloodline in the early centuries of the Dimming, became the first to successfully suppress his constellation through ritual rather than embrace it. His methods, the binding chants, the fasting, the scarification patterns that channel spirit-energy away from the conscious mind, became the foundation of the Muren path. He was assassinated at forty-two by his own Sylen sister, who believed his suppression was starving the Wolf. The Wolf chose her. She lost herself to the Over-Sung within the year. Walk the Muren path and you walk the line Tharun drew between mastery and starvation; the Wolf still remembers which sibling chose which.',
 relatedTerms: ['astril', 'sundrift-vale', 'sylen-muren-schism']
  }


};
