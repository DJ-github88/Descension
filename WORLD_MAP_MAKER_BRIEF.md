# MYTHRILL — World Map Maker's Brief

> [!IMPORTANT]
> **CANONICAL SOURCE NOTICE & LORE REVISIONS**
> This document is a reference brief for map artists and GMs, not the final source of truth. The canonical sources of truth are:
> 1. `vtt-react/src/data/rulesData.js` for cosmology, timelines, and regional overviews.
> 2. `vtt-react/src/data/loreDictionary.js` for specific characters, locations, factions, and house definitions.
> 3. `LORE_STYLE_GUIDE.md` for writing rules and the unified history timeline.
>
> **Known Canon Adjustments:**
> - **House Viridane**: Under the unified canon, House Viridane was the **original seventh binding family** (one of the original seven signatories of Sol's Binding Compact). When they refused Keth Amar's demands, the remaining six houses elevated House Morrath as their replacement and spent three centuries erasing every trace of Viridane. The common label of House Viridane as the "eighth house" is the public's term (counting the seven official houses plus the erased one).
> - **Timeline Consistency**: The setting operates strictly on the **475-Year Epoch Master Timeline** (Year 0 Star-Fall & Celestial Binding, Years 0–300 Incremental Aex Cracks, Year 325 Blizzard's End Massacre, Years 325–475 Freezing Era / Present Day).
> - **Real-World Renames**: Legacy Norse/Scottish place-names have been updated in the source code (e.g. `Ymir's Col` -> `Skadi's Col`, `Ymirhold` -> `Skalvyrhold`, `Valley of Ymir` -> `Valley of Rime`, `Kelpie's Cove` -> `Brinehorse Cove`).
>
> **A comprehensive documentation of the world, its regions, races, creatures, factions, and lore — for the map artist who will draw our world.**

---

## HOW TO USE THIS DOCUMENT

This is your master reference. Read it cover-to-cover before drawing. It contains:

- **Part I: World Overview** — the history that shaped everything
- **Part II: Geographic Logic** — why the world is shaped the way it is
- **Part III: The Seven Continents** — detailed breakdown of each region with subregions, cities, races, creatures, factions, and explicit map art suggestions
- **Part IV: Inter-Regional Connections** — trade routes, war zones, hidden passages
- **Part V: The Noble Houses** — who rules where, their bargains, their sigils
- **Part VI: Visual & Sensory Guide** — what each region looks, sounds, smells like
- **Part VII: Iconography** — symbols, banners, map decorations
- **Part VIII: Current World Tensions** — what should feel unstable on the map
- **Part IX: Color Palettes** — exact hex codes per region
- **Part X: Open Questions / Suggestions** — what is yours to interpret and add

The world is built around a central tenet: **the closer to the buried sun, the warmer the land.** The further from Sundale's volcanic warmth, the colder. The world radiates outward in temperature gradients.

---

# PART I: WORLD OVERVIEW — THE DEEPENING & THE BINDING

## The Original World

Before the Deepening, the world of **Mythrill** was a place of relative warmth. **Sol** — the sun — was a living star, not a buried god. Continents were wider. Oceans were kinder. The deep forests were just forests; the glaciers were just cold; the dark was just night.

Eight noble families held the civilization together through trade, marriage, and slow, patient politics.

## The Deepening — Sol's Death-Cycle

The **Deepening** is the natural, ancient rhythm by which a star sheds its exhausted light and rekindles its fire from within. It is not a malediction — it is the cosmic heartbeat. When Sol entered the Deepening, the world began to cool, the sun dimmed, and the long night began. **It would have ended in renewal had nothing intervened.**

## Keth Amar, the Sun-Eater

A cosmic predator — a thing of no fixed form, with **no name in any language older than five centuries** (every civilization that named it in writing was destroyed). Keth Amar hunts stars during their Deepening, consuming them before they can rekindle. When Sol was concealed in the volcanic core, Keth Amar followed, hunting the celestial scent as the world grew colder, as famine spread, as the noble houses fractured under political pressure.

Keth Amar does not destroy by force — **it whispers bargains**. It is the universe's deal-maker from the dark side of the stars.

## Aex — Sol's Firstborn

A living entity of pure stellar radiance, not a god but a guardian that had protected Sol through every Deepening since the first star learned to burn. When the seven families chose to entomb the dying star, the Warden demanded Aex's sacrifice. **House Solvan wielded the knife** — flaying Aex alive to weave the binding seal that became the volcanic vault beneath what is now called Emberspire.

## The Warden — The Cosmic Arbitrator

The **Warden** is not a god. It is the universe's mechanism of consequence — older than Sol, enforcing every bargain struck in Mythrill without exception, mercy, or negotiation. It is the original binder.

## The Original Binding (Year 0)

The seven noble families (Thalreth, Skalvyr, Tesshan, Solvan, Mereval, Ordavan, and Viridane) sealed Sol beneath the volcanic crust of what would become Sundale. **The volcano shook for eleven days** after the sealing. The binding held. The sun was entombed — but still alive, its fading warmth bleeding upward through eight hundred feet of basalt.

## The Dark Bargains & Blizzard's End (Year 325)

After three centuries of incremental cracks, Keth Amar approached the houses in Year 300 posing as the celestial father. It whispered promises of warmth to a starving, fracturing world. In Year 325 at Blizzard's End, **six houses capitulated.** They marched their firstborn heirs to the northern peaks. Keth Amar consumed them as vessels — each heir carried a **bloodline-key** encoded in their veins, and Keth Amar used those keys from inside to **crack the vault's seal from within**. Emberspire erupted. The Wyrd flooded through the fracture. The binding shattered into **seven Sundered Monoliths**.

## The Seven Regional Compacts (Each House's Bargain)

After the Breach, each noble house (or, in Bryngloom's case, the Neth ancestors) returned to the **Warden** to negotiate survival compacts. The Warden accepted without negotiation, without mercy.

- **House Thalreth (Frostwood Reach):** Traded **spatial clarity** for **insulating fog** — the mist preserves the ancient ironwood, but it also decays memory.
- **House Skalvyr (Nordhalla):** Traded **summer** for **halted glaciers** — the ice stopped grinding south, but winter became eternal.
- **House Solvan (Sundale):** Traded their **remaining heirs' futures** for the **volcanic warmth** of Emberspire's living tomb.
- **House Mereval (Iceheart Sea):** Traded **calm waters** for **unfreezing sea-lanes** — the channels never freeze, but the seas are perpetually, violently churning.
- **House Tesshan (Cragjaw Peaks):** Traded **visibility** for a **protective snow-veil** — the blizzard hides the keeps, but it also traps them inside.
- **House Ordavan (Sundrift Vale):** Traded **fertile soil** for **endless grass** — the steppe always returns, but nothing deeper than grass can take root.
- **House Morrath (Bryngloom Forest):** Had nothing left to trade. They **borrowed their survival from the Neth**, at interest.

## The Silent Seventh — House Viridane

**House Viridane was the original seventh binding house** — the one that did not march north when Keth Amar called. Before the breach, while the other families prepared their children, Viridane began hearing a different voice — not Keth's whispers, but something older watching from the **moonlit groves**. They turned south instead of north, carrying nothing, and **the fog rose behind them as if the world itself was helping them disappear**. They fulfilled a counter-pact with the fae. Their name was struck from every record. **House Morrath was elevated to fill the gap in the binding ritual** as a substitute signatory. Viridane's descendants are the **Florae** — thorn-blooded, fae-touched, carrying the Unwritten Word (a truth-sense that detects spoken lies).

**Why was Viridane erased?** **Keth Amar hunts through knowledge.** To carry the memory of Viridane was to hold a thread the Sun-Eater could follow. The erasure was protection as much as punishment. The fog that swallowed their name keeps them safe. Six houses suspect the truth. None will confirm it. Scribe-Sentinels who research the matter have a habit of disappearing into the fog.

> **For the map:** The Reach has TWO climates because of Viridane. The southern half is warmer (close to Sundale, dense ironwood, fog-bound) — the northern half is the cold "Frostfang Wastes" with stone structures, frozen lakes, sparse twisted ironwood, and Jutul-like giants. **Draw the divide.**

## The Seven Sundered Monoliths

The fragments of the Warden-bound original seal. Each is a piece of Aex's sundered body, crystallized. Each **resonates**, and its resonance is shifting. The monoliths are waking up after centuries of silence, and their song is getting louder. **Known locations:**
- The Treakous Oceanic Rift (Iceheart Sea)
- The Shard-Window storm-vortex (Storm-Belt)
- The Berg of the Frozen Flame (Northern Ice-Flows)
- Beneath Frostmaw Crag (Cragjaw Peaks — a chamber where snow has never fallen)
- And others scattered

## The Wyrd

The Wyrd is the cosmic corruption-bleed that seeps through the cracks Keth Amar opened. **It is not the origin of Mythrill's creatures.** Native beasts, spirits, and peoples predate the Great Binding; the Wyrd arrived later, carrying Ancient Cosmic Wyrdkin, generating direct Keth-spawn (Wyrdspawn), and occasionally warping individual natives into Wyrd-touched variants. Local fear and folklore translate and camouflage these encounters  -  they shape how survivors describe a creature, not what the creature actually is or where it came from. The Wyrd makes heroes into monsters and ordinary fears into apex predators. It is getting thicker. The fog is changing chemistry; venoms spoil; augur accuracy is falling.

## The Current World (Year 475 / 150 Years of Freezing Era)

Four hundred and seventy-five years after the Star-Fall, and one hundred and fifty years after Blizzard's End. Six human cultures have hardened around the consequences of their bargains. The Warden enforces every contract. Keth Amar's debt remains collectible. The Sun-Eater is **not satisfied** — only delayed. **Keth Amar is pressed against the partial seal**, drinking Sol's light slowly, having only consumed the firstborn heirs (six of the seven monolith fragments carry Aex's stolen life; the seventh is a hollow echo where Viridane's signature was never placed — Morrath's name is a fabrication stitched over the gap). He does not fully know why he cannot breach Sol's prison. He senses that one monolith "sings wrong" and keeps digging, clawing, frustrated.

---

# PART II: GEOGRAPHIC LOGIC

The world of Mythrill is arranged around a central heart — **Sundale**, the volcanic tomb of the buried sun. **The closer to Sundale, the warmer the land.** The further, the colder. This is the world's defining climatic logic.

| Region | Position | Distance from Sundale | Climate Logic |
|---|---|---|---|
| **Sundale** | Center | 0 (the heart) | WARMEST — volcanic warmth bleeds upward |
| **Frostwood Reach (Southern)** | North-east | Near | Cool, damp, fog-bound |
| **Iceheart Sea** | Center-west | Mid | Storm-belt, never freezes but violent |
| **Bryngloom Forest** | South-west | Mid | Mild, damp, twilight under canopy |
| **Sundrift Vale** | South | Far | Cold steppe, starless sky |
| **Frostwood Reach (Northern)** | Far north-east | Far | Sub-arctic, Frostfang Wastes |
| **Cragjaw Peaks** | Far east | Far | Alpine, perpetual blizzard |
| **Nordhalla** | Far north | Farthest | POLAR — eternal winter |

---

# PART III: THE SEVEN CONTINENTS

---

## 1. FROSTWOOD REACH — "The Mist-Archivists' Forest"

**VIBE:** Somber, hushed, paranoid, archival, fog-drenched. A people obsessed with preservation because the very air devours memory.

**COLOR PALETTE:** Deep peat-brown, fog-white, amber hearth-glow, ironwood black, muted green moss, bioluminescent pale blue-green at night.

**CLIMATE & WEATHER:**
- Southern half: cool-temperate, damp, fog-bound year-round
- Northern half (Frostfang Wastes): sub-arctic, biting wind, summer lasts 8 weeks
- The fog is **memory-erasing** — chronic exposure hollows out personal memories over a decade; wilderness exposure causes acute memory tolls every 24 hours
- Smells: burning heartwood resin, damp parchment, peat-smoke, mineral cold-fog
- Light: dim and diffuse; oil lamps and hearth-fires cast halos; on clear nights (rare), bioluminescent lichen glows pale blue-green

**DOMINANT TREE:** Petrified ironwood — dense, harder than steel, fire-resistant, 10,000+ year old specimens in the deepest groves

### Subregions

**A. The Southern Reach** (Frostwood-South-Reach) — the warm, dense political heart
- Climate: cool-temperate, damp, fog-bound
- Terrain: petrified ironwood forest, peat-bog hollows, silt-roads
- Zones: greymark-keep, scribes-tower, ledger-halls, the-shallows, greythorn-copse, skalds-landing, mirror-mere, bramble-heath, meadowglen-crossing, velling-pass

**B. The Frostfang Wastes** (Frostwood-North-Reach) — the cold, stony north
- Climate: sub-arctic, biting wind, summer lasts 8 weeks
- Terrain: granite tundra, frozen lakes (Iron Lake — melts 8 weeks in summer), sparse twisted ironwood, glacial moraine
- Zones: frostfang-wastes, grevtholm, iron-lake, the-stone-circles, bearsback-summit
- People: Greymark Northwatch (garrison), Stone-Speakers (Skald expatriates), Jutul raiders rumored

**C. The Eastern Fens** (Frostwood-Eastern-Fens) — lawless marshland
- Climate: damp, hazy, mild
- Terrain: peat-bog, marsh, drowned ironwood groves
- Zones: wraithfen, the-shifting-fen (geography rearranges itself overnight), mistbarrow (pre-Thalreth burial mound)

### Cities & Settlements

- **Greymark Keep** (city, 1,200 pop) — peat-stone fortress, the High Hearth with its 800-year perpetual flame, Mist-Sentinels patrol, the Scribe-Sentinels enforce the Sovereign Ledger
- **Scribes' Tower** (settlement) — vertical parchment-cathedral inside a hollowed petrified ironwood
- **Mirror Mere** (settlement, 200 pop) — lake village of the Arch Mimir; the lake never ripples
- **Greythorn Copse** (settlement) — fortified ironwood copse jointly maintained by Thalren and Briaran
- **Skald's Landing** (settlement) — Skald trading post on the northern river, dragon-prow longhouses
- **Grevtholm** (settlement) — fortified stone keep, northernmost Thalren outpost against Jutul
- **Meadowglen Crossing** (settlement) — waystation between Frostwood and Sundale

### Notable Landmarks

- **The Ironwood Heart** — the deepest grove, with a stagnant mist-lake and a titanic glowing white tree at the center
- **Mistbarrow** — pre-Thalreth burial mound with its own weather system
- **Bearsback Summit** — double-peaked granite mountain, Skald legend says a great bear died there
- **Iron Lake** — frozen most of the year; mirror-still in summer; locals say drowned Jutul-maidens wait
- **The Stone Circles** — pre-Binding runic monoliths tended by Stone-Speakers
- **Bramble Heath** — crimson thorn-flowers bloom year-round in soil nourished by centuries of blood

### People & Races

- **Thalren humans** — archivists, obsessed with preservation. Chained journals, written genealogies, fog-resistant documentation. Peat-stone colored clothing, fur-trimmed cloaks, quill-and-flame medallions. Pale, tall, lean.
- **Mimir** — the Mask-Bound; tall, slender (1.78-2.13m), unnaturally fluid movement. **Masks of heartwood or storm-glass** with glowing eye-beads — their faces are NEVER shown. Wear bark-hide cloaks. Fractured Mimir carry a small glowing energy-companion (Mote) orbiting their shoulder. Two subraces:
  - **Arch Mimir (Veiled)** — canopy aristocrats in Ironwood Heart & Mirror Mere
  - **Fractured Mimir (Tethered)** — sentinels & floor-dwellers in Ironwood Palisade, Wraithfen & Shifting Fen
- **Florae (the "eighth house")** — thorn-blooded, fae-touched descendants of House Viridane. **Thorns grow where other races grow hair** — along forearms, shoulders, spine. The thorns lie flat when calm, prickle at broken oaths, and migrate over a lifetime toward the site of the oldest unfulfilled promise. Two kinds: **Viridian Florae** (thorn-cloaked traditionalists in deep groves) and **Oken Florae** (timber-born artisans passing in the wider world). Wear ghost-metal (cold alloy from the deep groves).
- **Skald expatriates** — on the northern fringe, manning Skald's Landing and Grevtholm
- **Moraine Clan humans** — frontier dwellers in the Frostfang
- **The Forgotten** — undocumented people stripped of their rights by the Sovereign Ledger

### Creatures & Monsters

- **Gref** — native Frostwood Seelie memory-merchant (a separate face-stealing Wyrd mimic sometimes wears its shape). Stalks travelers in fog, trading in memories and physical features.
- **Gambrel** — Ancient Cosmic Wyrdkin oath-collector; spindly, long-limbed stalker drawn to broken agreements.
- **Stel** — heavy crystalline colossus of compacted ice, projects glacier-memories (found in the Frostfang north).
- **Oillipheist** — blind silt-leech serpent of the Siltmire Flats
- **Mist-Shark** — predator of the Velling Pass
- **Jutul-raider** — giant troll-like beings in the deep Frostfang Wastes
- **Drudehaunt** — spectral omen washing away identities
- **Drowned-Memory** — Iron Lake entity

### Factions

- **House Thalreth** — ruling family. Jarl-Archivist **Kaelen Thalreth** ("The Quill-Lord")
- **Scribe-Cartel** — monopoly on soot-resin ink and peat-parchment
- **Mist-Sentinels** — Ironwood Palisade patrol
- **Greymark Northwatch** — Frostfang garrison
- **The Stone-Speakers** — Skald expatriates who tend pre-Binding runic monoliths
- **Viridian Florae** — thorn-cloaked traditionalists
- **Oken Florae** — timber-born diaspora

### Map Art Suggestions

- **Symbols:** petrified ironwood trees (carved with genealogical records), quill-and-flame crests, Mimir masks (heartwood, storm-glass), Florae thorn-clusters, Mist-Sentinel watchtowers, Moss-Wax candles, runic monoliths of the Stone-Speakers, Scribe-Sentinel lantern-posts
- **Buildings:** peat-stone with petrified-ironwood timbers; Scribes' Tower as a vertical hollowed trunk; Greymark Keep with a great ironwood-root throne and eternal amber-flame High Hearth
- **Landmarks:** glowing white tree at the Ironwood Heart, pre-Thalreth runic stone circles, the perpetually-fog-bound Mistbarrow with rain falling inside its own weather bubble
- **The entire map should be heavily fogged** — use a misty overlay, with only zone-edges showing sharp detail
- **Color: muted greens, browns, ambers, fog-white. Almost NO blue. Almost NO sunlight. Everything feels damp.**

---

## 2. NORDHALLA — "The Glacier Cathedral"

**VIBE:** Brutal, severe, militaristic, cold-pure, blood-and-iron. Endurance as religion. Wolves howling at watchtowers. Black ice. The groan of glaciers.

**COLOR PALETTE:** Ice-blue, glacier-white, obsidian black, blood-red (Járn-Tand's sigil), forge-orange (volcanic vents), cold-iron grey, whale-oil amber. Sky is hard pale blue-grey; never black (perpetual polar light).

**CLIMATE & WEATHER:**
- Three sub-climates: the polar interior (perpetual blizzard), the cold-temperate maritime east coast (moderated by sea), and the milder volcanic southern shore
- Severity 1 minimum weather always. Whiteout is constant.
- Smells: cold stone, whale-oil, iron, blood from chiseling halls, mineral scent of old ice
- Light: pale blue-green from geothermal vents filtered through ice; orange from forge-fires

### Subregions

**A. The Glacier-Heart** (Nordhalla-Glacier-Heart) — the polar interior
- Climate: polar, perpetual blizzard, brief white summer
- Terrain: glaciers, ice fields, frozen chasms, granite peaks
- Zones: frozen-archive, rimors-hearth, hunger-glaciers, skadis-col, the-still-crag, frosthold-citadel, bearsbeards-beak
- People: Rime-Born, Frostbound, Corvani, Skald royal clans

**B. The Fjord-Coast** (Nordhalla-Fjord-Coast) — the populated eastern face
- Climate: cold-temperate maritime, moderated by sea
- Terrain: black granite fjords, sea-cliffs, harbor towns, fish-farms
- Zones: fjord-gate, bloodhammer-sump, eldonholm, vesperas-perch, rooks-promontory, vargtor, spars-folly

**C. The Southern Shore** (Nordhalla-Southern-Shore) — the volcanic south
- Climate: cold but milder, sea-moderated
- Terrain: volcanic black-sand beaches, sea-cliffs, geothermal hot-springs
- Zones: xardins-hearth, southern-shore-smugglers-cove
- The only place where Skald, Merryn, and Frostbound can sit in the same water (hot springs)

### Cities & Settlements

- **Frosthold Citadel** (city) — royal seat of House Skalvyr, carved into Bearsbeard's Beak. Throne of stone older than the Skald clans. King-Jarl Halvar Járn-Tand rules here.
- **The Frozen Archive** (tomb/cultural city) — glacier-tomb where dead stand upright in ice. Augur tradition born here. Sigurd Skalvyr is Jarl of the Archive.
- **Fjord-Gate** (settlement) — massive harbor with stone doors that slide shut to block sea-storms
- **Bloodhammer Sump** (settlement) — volcanic forge-crater, the industrial heart of Nordhalla
- **Vargtor** (settlement, 150 pop) — watchtower on a granite tor; wolves gather at its base
- **Eldonholm** (settlement) — Skald fishing town, pure-blooded and proud
- **Xardin's Hearth** (settlement) — southernmost port, volcanic vent keeps harbor ice-free; hot springs
- **Smuggler's Cove** (settlement) — Fredløse outlaw hangout

### Notable Landmarks

- **Bearsbeard's Beak** — highest peak, a granite tooth said to be the petrified corpse of a bear that challenged the sun
- **Skadi's Col** — wind-scoured gap between two peaks, the air strips flesh from bone in minutes
- **The Hunger Glaciers** — shifting whiteout expanse
- **The Still Crag** — cliff face perpetually frozen in absolute silence; the Rime-Born perform memory-freezing rites here
- **Rimor's Hearth** — ruins of a buried mountain keep, still warm from stubborn steam vents
- **The Spar's Folly** — half-built black-granite sea-wall, abandoned
- **Rook's Promontory** — black obsidian cliff over the frozen sea, Corvani sacred site

### People & Races

- **Skald humans** — broad-shouldered, frost-scarred, raw physical endurance. Pale, blue-eyed, white or fair hair. Wear fur-trimmed leather, carved runic cold-iron jewelry, whale-bone amulets. Speak Old Nord. Their dead are entombed standing in glacier-ice.
- **Rime-Born** — frost-touched survivors of the Hunger Pact. Skin feels like stone left in shadow; breath freezes even in southern heat. Blue-skinned **Frostbound** carry Keth Amar's lingering attention. Use Ice-Cradles carved into glacier faces.
- **Corvani** — raven-marked, fate-bonded to Corvid Fate-Spirits. Dwell in eyries carved into mile-high ice sheets. Read destiny in raven flight patterns. Their price for any service is a memory. Have shifting raven-markings across their skin.
- **Berserkers (Bloodhammer Clan)** — Skald warriors who channel the Hunger Pact's fury into the Rage
- **Fredløse** — outlaw nomad clans on the southern shore

### Creatures & Monsters

- **Stel** — crystalline colossus of compacted ice that projects glacier-memories
- **Helhest** — three-legged nightmare-horse, plague-aura 50-ft radius, anchors glaciers (killing one releases it)
- **Glacier Wyrm / Skreika** — ice-dragons
- **Skrei** — drowned Skald warriors, swim the cold seas
- **Jutul-king** — frost-giant of Skald legend
- **Perchtar** — marching winter judges

### Factions

- **House Skalvyr** — High King-Jarl **Halvar Skalvyr** (Járn-Tand, Iron-Tooth)
- **Icechamber Syndicate** — trade monopoly
- **Sunder-Wall** — Halvar's fortified barrier
- **Bloodhammer Clan** — Rime-Born forge-workers
- **Runic Academies** — controlled runic knowledge
- **Skald Keepers** — glacier archivists
- **Cult of Forgotten Shadow** — clandestine Void-heat research
- **Cleansing of the Hearth** — religious persecution of tribal Animists

### Map Art Suggestions

- **Symbols:** ice-axes, Járn-Tand sigil (iron-tooth), Corvani raven-feather, Frost-Tithe cradle, runic cold-iron axes, wolf-head gateposts, whale-bone staves
- **Buildings:** black granite, basalt, ice-carved facades, dragon-prow longhouses (Skald style), seal-skin roofed huts on southern shore
- **Landmarks:** the Frozen Archive as a glacier face with the dead standing visible in the ice, Bearsbeard's Beak as an impossible tooth, Skadi's Col with cairns of frozen corpses, Vargtor's wolf-circle, geothermal vents with steam plumes
- **Color: ice blue, glacier white, obsidian black, blood red, forge orange. Use a lot of stark white contrast.**

---

## 3. SUNDALE — "The Ashlands of the Buried Sun"

**VIBE:** Incandescent, ash-choked, martyr-haunted, theocratic, industrially gothic. A land of sacrifice and forge-fire. Black sand and red embers.

**COLOR PALETTE:** Obsidian black, basalt grey, ash-white, cinder-orange, blood-red, deep ember-orange, sulfur-yellow, gold. Sky perpetually choked with soot, except at certain volcanic-clearing moments.

**CLIMATE & WEATHER:**
- Hot, dry, ash-fall, cool at night
- Navigation/perception checks at disadvantage without alchemical respirators
- Caldera Ashfall: 1d4 fire damage per hour without protective cloaks
- Water skins evaporate at twice the standard rate
- Smells: sulfur, salt water (Ember Lagoon), volcanic heat, roasting fish, molten metal

### Subregions (Concentric rings around Emberspire)

**A. The Ash-Heart** (Sundale-Ash-Heart) — the dead volcanic core
- Climate: uninhabitable, ash-fall, sulfuric fumes
- Terrain: obsidian sand, basalt columns, active lava fields
- Zones: emberspire-caldera, sols-anvil-mesa, cinder-badlands, spinstones-columns, cinderbloom-crater, the-star-caves

**B. The Ashen Fringe** (Sundale-Ashen-Fringe) — the wide ring of ashen flatland
- Climate: hot, dry, ash-fall, cool at night
- Terrain: volcanic ash plains, geothermal vents, sulfur sumps, basalt formations
- Zones: harath-vault, great-forge, the-ashen-escarpment, vulkars-karst, slag-gulch, solvans-stand, thornshire-colony

**C. The Green Rim** (Sundale-Green-Rim) — the coastal ring where life grows
- Climate: warm, mild winters, sea-breezes
- Terrain: coastal plains, sheltered valleys, geothermal hot-springs, oasis groves
- Zones: konjaw-port, ironjaw-village, ember-lagoon, meadowglen, warmheath, breezebough, basalt-shyr

**D. The Glitterwood** (Sundale-Glitterwood) — the forested HALF-ISLAND (peninsula)
- Climate: warm, humid, sheltered by mountain spine
- Terrain: crystal-rich soil, ancient broadleaf forest, geothermal hot-springs, hidden valleys
- Zones: the-glittering-forest, glitterwood-heart, old-sun-shrine
- The peninsula connected to the main landmass by a narrow isthmus — the **greenest land in the region**, long thought cursed, now home to the Risen, Smooth-Skinned exiles, and hermits who fled the Dawn Vigil

### Cities & Settlements

- **Harath-Vault** (city, 600 pop) — massive subterranean capital of the Emberth, carved into a volcanic caldera. The Great Forge in its center. The Sol's Breath tended in the Harath-Chamber. 100 militia.
- **The Great Forge** (city) — sprawling city of black iron and basalt inside a volcanic cavern
- **Solvan's Stand** (city) — dying capital of House Solvan, once 30,000, now under 4,000. Outer wall lost 40 feet to ashfall in the last century.
- **Ember Lagoon** (settlement, 350 pop) — Sundale's only port, warm saltwater lagoon heated by volcanic vents. Glowing orange-red at night.
- **Basalt Shyr** (settlement) — trade outpost atop cooling basalt columns
- **Slag Gulch** (settlement) — narrow ravine of forge waste
- **Konjaw Port** (settlement) — most cosmopolitan town, Merryn captains, Risen cult, Dawn Vigil
- **Meadowglen** (wilderness) — the breadbasket, hot-spring network keeps it green
- **Ironjaw Village** (settlement) — Emberth fishing-and-smelting hamlet
- **Thornshire Colony** (settlement) — Dawn Vigil penal colony, bramble-thorns grow inward
- **Glitterwood Heart** (settlement) — Risen capital, longhouses built into living trees
- **Old Sun Shrine** (ruin) — pre-Binding temple, circular basalt plaza

### Notable Landmarks

- **Emberspire / Emberspire Caldera** — the world-heart volcano, the most consequential geological feature in the world
- **Sol's Anvil Mesa** — flat-topped basalt mesa carved with solar calendars
- **The Ashen Escarpment** — long ridge of compacted volcanic ash, Solvarn watchtowers with eternal signal-fires
- **Cinderhoodoo** — forest of fire-scorched rock spires, face-like melting shapes
- **Spinstones Columns** — ring of basalt columns carved with binding-runes, boundary of the inner Ash-Heart
- **Cinderbloom Crater** — secondary vent with red-bloomed lichen, used for Martyr purification
- **The Star Caves** — lava-tubes beneath the Spinstones, haunted by the Husque
- **Vulkar's Karst** — honeycombed limestone riddled with underground rivers

### People & Races

- **Emberth** — the forge-clans. Broad-shouldered, heavy. **Cold-bodied** — flesh dark as basalt charcoal, sheds grey mineral-ash. They harvest external heat to survive. Enormous heat-sensitive eyes. **Burn-scars on forearms** encode clan affiliation (the Marking-Rite). Two castes:
  - **Korr** — deep-vault, calcified, absolute stillness
  - **Thrask** — high-vault, surface-rangers, blurred marks
- **Solvarn humans** — sun-vigil martyrs, descended from House Solvan. They refuse to leave. Wear ceremonial sun-disc medallions, ash-stained robes, religious vestments. Pale skin darkened by ash. They pray to a buried god.
- **Merryn expatriates** — at Ember Lagoon, Konjaw Port
- **The Risen** — old Solvarn faith revivalists in the Glitterwood
- **Smooth-Skinned exiles** — descendants of the old Solvan nobility who fled to the Glitterwood

### Creatures & Monsters

- **Cinder-Fiend** — fire-weaving elemental entity of the volcanic vents
- **Sun-Husk** — burnt-shrouded predator of the ash fields
- **Ash-Woven Oracle** — entity of the Cinderbloom Crater
- **Husque** — mobile reality-fissures that walk the lava tubes
- **The Cinder** — silent entity in the Star Caves
- **Crystal-Stag** — radiant beast of the Glitterwood
- **Scathrach the Ashen Sovereign** — parasitic demon-intelligence in Emberspire's deepest vent

### Factions

- **House Solvan** — tragic ruling lineage, sidelined
- **Dawn Vigil** — the militant theocratic order under Hierophant Aethelgard. Sigil: rising sun pierced by obsidian.
- **Sulfur Cartel** — Korr priests' monopoly on sulfur mining
- **Martyr Brigades** — conscripted youth labor
- **Emberth Watchers** — guard the inner Ash-Heart
- **The Risen** — old sun-worship revival in the Glitterwood
- **Free Glitterwood Council** — local governance

### Map Art Suggestions

- **Symbols:** rising sun pierced by obsidian, forge-anvil, volcanic cross, burning heart, Martyr Vow seal
- **Buildings:** black basalt and obsidian, iron-banded, lava-fed forge-pits
- **Landmarks:** Emberspire as a smoking mountain with a permanent red glow at its peak. Sol's Anvil Mesa floating in heat-shimmer. The Ashen Escarpment with watchtowers and signal-fires. Cinderhoodoo as a forest of melted spires.
- **The Glitterwood: a lush green peninsula** sparkling with crystal-rich soil, the greenest land in the region — a stark contrast to the black and orange of the rest
- **Color: BLACK and ORANGE dominate. Almost monochrome except for the orange embers.**

---

## 4. ICEHEART SEA — "The Storm-Lashed Heart"

**VIBE:** Salt, storm, perpetual motion, oceanic, dramatic. The sea that never rests.

**COLOR PALETTE:** Deep ocean blue-black, storm-grey, ice-white, gold (House Mereval), coral pink, bioluminescent teal/blue-green, amber lantern-light.

**CLIMATE & WEATHER:**
- Storm-belt, sea-cold, gales year-round
- Open waters never freeze (House Mereval's bargain) but the storm-cycles never rest
- The Shard-Window is a perpetual 3-mile-wide storm-vortex
- Smells: salt water, seaweed, Myrathil incense, Neth silver-blood, spilled ale

### Subregions (An archipelago of island-clusters — the largest continent by area)

**A. The Merrow Archipelago** (Iceheart-Merrow-Archipelago) — central inhabited islands
- Climate: storm-belt, sea-cold, gales year-round
- Terrain: volcanic seamounts lashed into floating cities, black-sand beaches
- Zones: merrowport, ironjaw-port, brinehorse-cove, spindrift-lagoon, blackteeth-isle, the-lucky-anchor

**B. The Storm-Belt** (Iceheart-Storm-Belt) — western
- Climate: perpetual cyclone-belt, lightning, salt-rain
- Terrain: open sea, storm-vortexes, sea-stacks, drowned shipwrecks
- Zones: shard-window, gale-storm-shallows, wraithsound

**C. The Deepwell Trench** (Iceheart-Deepwell-Trench) — eastern
- Climate: frigid deep-sea, no surface weather
- Terrain: abyssal rift, underwater basalt cave-cities, bioluminescent reefs
- Zones: deepwell-archipelago, treakous-rift, the-shivering-bight

**D. The Northern Ice-Flows** (Iceheart-Northern-Iceflows) — north
- Climate: polar marine, ice-floe year-round
- Terrain: city-sized icebergs, frozen sea, ancient ruins on bergs
- Zones: first-shore, berg-of-the-frozen-flame, whaleroot-floe

**E. The Western Isles** (Iceheart-Western-Isles) — western chain
- Climate: cold maritime, fog-belt, salt-spray
- Terrain: black-granite sea-stacks, sea-cliffs, hidden coves
- Zones: saryreach-castle, blackteeth-skerry, tide-court-cove

**F. The Saltmaw Estuary** (Iceheart-Saltmaw) — southernmost
- Climate: damp, foggy, sea-tidal
- Terrain: salt-marsh, glacial melt, tidal flats
- Zones: the-saltmaw-estuary

### Cities & Settlements

- **Merrowport** (city, 500+ pop) — magnificent floating city anchored to a warm volcanic seamount. Merryn storm-sailors with ink-charts tattooed on their skin. House Mereval's capital.
- **Ironjaw Port** (settlement) — Neth's largest external outpost, black basalt walls in frozen cliffs
- **Saryreach Castle** (city) — abandoned Mereval naval fortress, now the Pirate-Queen's seat
- **Spindrift Lagoon** (settlement, 250 pop) — warm bioluminescent coral inlet. The most beautiful settlement.
- **Blackteeth Isle** (settlement) — volcanic island, Drift-Council representatives
- **The Lucky Anchor** (settlement) — floating gambling-and-dock on three lashed warships
- **Tide-Court Cove** (settlement) — Mer-Court's hidden tidal harbor
- **Brinehorse Cove** (settlement) — black-market port behind ice-shoals

### Notable Landmarks

- **The Shard-Window** — 3-mile-wide storm-vortex over a Sundered Monolith. The "binding-storm" of the Shard. The Storm-Speakers tend a shrine on the rim.
- **The Treakous Oceanic Rift** — bottomless chasm. A Sundered Monolith fragment rests here, coiled around by an Abyssal Leviathan.
- **First Shore** — the original Mereval landing site, now encrusted in ice and barnacles
- **The Shivering Bight** — wide shallow bay with constant volcanic tremors
- **Wraithsound** — sea-mist inlet that listens, remembers, speaks in the voices of the drowned
- **Deepwell Archipelago** — 40-mile chain of ice-islands concealing underwater Myrathil cave-cities
- **Berg of the Frozen Flame** — city-sized iceberg with a natural gas-vent burning in its heart
- **Blackteeth Skerry** — jagged reef, the traditional boundary

### People & Races

- **Merryn humans** — storm-sailors, pragmatic, demonstrative. **Tattoo their contracts onto their skin** — the only documents the Drift-Council enforces. Oil-leather, whale-bone jewelry, sea-glass in braided hair.
- **Myrathil** — the Sea-Foam Born. **Lean, fluid build; ocean-blue eyes too large for their faces; webbed fingers; skin shifts color with mood along vein-lines**; bioluminescent. Three castes:
  - **Breakers-Born** — shore-dwelling, diplomatic, trade
  - **Deep-Born** — abyssal pressure-forgers, dwell in underwater cave-cities
  - **River-Fed** — freshwater explorers
- **Neth Velun** — at Ironjaw Port, the Neth's external economic lung
- **Stormspeakers** — animist cult on the Storm-Belt rim
- **Mer-Court emissaries** — at Saryreach and Tide-Court

### Creatures & Monsters

- **Abyssal Leviathan** — multi-tentacled horror coiled around the Treakous Rift's Sundered Monolith
- **Draugr Helmsman** — undead pirates
- **Nereid** — seductive water-spirits
- **Storm-Wraith** — entity of the Shard-Window
- **Boreal Huldra** — the ice-floe fae
- **Myriad** — wraith-storm-spirits in the Storm-Belt

### Factions

- **House Mereval** — Grand Admiral Varis Mereval enforces the Sea-Charter
- **Brine-Bond Syndicate** — trade monopoly
- **Board of Trade** — ship registry
- **Drift-Council** — Merryn governing body
- **Pirate-Queen of Saryreach** — holds a letter of marque
- **Mer-Court** — animist council
- **Icewhisper Coven** — Berg-Witches of the Northern Ice-Flows

### Map Art Suggestions

- **Symbols:** tridents, ship-anchors, kraken, wave-patterns, House Mereval's golden scale on coral spire, ink-tattooed arms, coral-grown architecture
- **Ships:** Merryn longships with dragon-prows, ice-breaker ironclads of the Board of Trade, the Wave-Kept (Admiral's flagship, perpetually at sea), lashed-warship gambling dens
- **The Shard-Window:** a 3-mile-wide perpetual cyclone, drawn as a giant spiral storm
- **Merrowport:** floating city with volcanic glow beneath, ships tied to a warm seamount
- **Spindrift Lagoon:** the only patch of blue-green light in the entire sea
- **Color: deep ocean blue, storm grey, ice white, gold highlights, teal bioluminescence. The map should look WET — wave textures, salt spray, mist.**

---

## 5. CRAGJAW PEAKS — "The Howling Vertical Labyrinth"

**VIBE:** Vertical, claustrophobic, bone-bridges, blizzard, mechanical, gothic-industrial. A culture of stone and steam.

**COLOR PALETTE:** Granite grey, basalt black, snow white, forge-orange, copper/brass, Groven bone-ivory, blood-red. Sky invisible — perpetual blizzard whiteout.

**CLIMATE & WEATHER:**
- Alpine, year-round blizzard above the mid-line
- Sub-alpine, wind-blasted, snow-veiled in the gorges
- Hot, toxic, sulfuric at the deepest sumps
- High-altitude: low-oxygen strain, the Mit'a Exhaustion rules

### Subregions (Vertically stacked)

**A. The Frostmaw Massif** (Cragjaw-Massif) — central spine, the highest
- Climate: alpine, year-round blizzard above the mid-line
- Terrain: granite peaks, glacial cirques, ice fields, volcanic crater-keeps
- Zones: frostmaw-holdfast, frostmaw-massif, skirmours-crag, the-stone-cog
- People: Tessen, Jutul warbands (in the high peaks), Thrumm (primordial)

**B. The Gorge-Web** (Cragjaw-Gorge-Web) — mid-altitude
- Climate: sub-alpine, wind-blasted, snow-veiled
- Terrain: chasms, hanging-bridges, mid-altitude valleys, whiteouts
- Zones: the-spans, ancestor-gaps, deepchasm-keep, the-great-gorge, alley-of-knor

**C. The Iron Sumps** (Cragjaw-Iron-Sumps) — deep industrial heart
- Climate: hot, toxic, sulfuric at the deepest
- Terrain: toxic mining shafts, geothermal pipes, basalt vats, lava-fed forges
- Zones: gearworks-gulch, sump-galleries, iron-ravine, lost-brood-vats, stags-rest-moraine, driknell-foundry

### Cities & Settlements

- **Frostmaw Holdfast** (city, 900 pop) — ancestral Groven stronghold in a volcanic plug at Cragjaw's heart. Built around the first shattered vat. Vat-Breaker Foreman leads. 150 militia.
- **Gearworks Gulch** (settlement, 400 pop) — narrow ravine of geothermal-powered industry
- **Deepchasm Keep** (settlement) — Tesshan fortress across a massive fissure
- **The Stone Cog** (settlement) — Tesshan fortress-monastery, walls carved to look like gear-teeth, seat of the Jarl-Inca's political power
- **Driknell Foundry** (settlement) — Fexric industrial complex in the deep Iron Sumps
- **The Spans** (wilderness) — Groven-calcified bone bridges spanning bottomless chasms
- **Lost Brood Vats** (ruin, extreme danger) — sealed Deep Alchemist laboratories

### Notable Landmarks

- **Frostmaw Holdfast** — the calcified heart of Groven civilization
- **The Ancestor-Spans** — bone bridges grown from willing Groven dead
- **The Subterranean Vault** — beneath Frostmaw, where a Sundered Monolith rests in a chamber where snow has never fallen
- **The Lost Brood Vats** — Deep Alchemists' original labs, sealed for centuries
- **The Great Gorge** — seven bone-spans, the Cragjaw's primary thoroughfare
- **Skirmour's Crag** — Jutul-king Skirmour's sacred peak

### People & Races

- **Tessen humans** — the keep-dwellers. Have not seen open sky in four hundred years. Sealed inside Tesshan keeps, depend on Fexrick geothermal pipes purchased through intermediaries they have never met. Wear heavy mountain robes, ceremonial khipu-cords instead of writing. Their internal politics have grown Byzantine.
- **Groven** — humanoid bridge-trolls, ALCHEMICALLY FORGED from Thrumm blood. **Tall, slender, long-limbed (1.98-2.28m)**. **Stone-scales** (fine, tessellated) over living flesh. **Tusks** curve from lower jaws. **Tufted tails** as counterbalances. **Moss and lichen** grow in scale-crevices. Two castes:
  - **Morgh** — heavy-scaled, deep-chested, mid-crag warrens, laborers and warriors
  - **Ithran** — long-limbed, fine scales, bridge-top settlements, diplomats and toll-keepers
- **Fexrick (Kethrin Guild-Bound)** — green/pale-skinned goblinoid engineers, 3'8"-4'6". **Elaborate beards woven with copper wire, gear-teeth, fiber-optic strands** — the beard is their resume. **Visible mechanical replacement** (gear, alchemical ocular, cyber-arm). Speak Fexric.
- **Fexrick (Drall Clan-Free)** — outside the guild system, improvised beards, salvage tinkerers
- **Jutul warbands** — at Skirmour's Crag
- **Thrumm** — primordial ancestor species, regenerative tunnel-dwellers

### Creatures & Monsters

- **Chasm-Stalker** — nests in the Span supports, patient and hungry
- **Scrab** — multi-legged horror of the Sump Galleries
- **Toxic Spore-Horror** — fungal creature of the lower sumps
- **Thrumm** — primordial tunnel-dwellers
- **Jutul-warbands** — at Skirmour's Crag
- **Lost-Brood Remnant** — in the sealed Vats
- **Native mountain spirits** — Yuki-Onna (snow-women), Tengu-Crows (raven goblins)

### Factions

- **House Tesshan** — Jarl-Inca Oda Tesshan enforces the Knotted Decree (khipu-cords, no written script)
- **Steam-Line Cartel** — geothermal heat monopoly
- **Kethrin Guilds** — Fexric trade guilds
- **Drall Clan-Free** — Fexrick outside the guilds
- **Vat-Breakers' Guild** — Groven governing body
- **Deep Alchemists** — sealed in the lower tunnels, ongoing vat-laboratory work

### Map Art Suggestions

- **Symbols:** massive interlocked gears, Groven bone-anchors, khipu-cord knots, Chasm-Stalker claws, Fexric copper-wire beards
- **Bridges:** calcified Groven vertebrae spanning chasms above the blizzard — these are the ICON of the region
- **Frostmaw Holdfast:** a vertical fortress-city built into a volcanic plug
- **Gearworks Gulch:** a narrow ravine packed with geothermal-powered machinery
- **The Spans:** chasms with skeletal bridges over whiteout
- **Color: granite grey, basalt black, snow white, forge orange, copper/brass, blood red. The map should look VERTICAL and MECHANICAL — lots of pipes, gears, steep cliff faces**

---

## 6. SUNDRIFT VALE — "The Starless Steppe"

**VIBE:** Endless, windswept, mournful, ancient, nomadic, melancholy. The sky is empty. The grass never grows deeper than grass. The wind never stops.

**COLOR PALETTE:** Pale grey-green grass, ash-grey sky (permanently dark, no stars), gold (House Ordavan, ancestral barrows), Lien-crystal starlight (pale silver-white), bone-white (Steppe-Staves).

**CLIMATE & WEATHER:**
- Cold-temperate steppe, perpetual wind, mild summers
- The wind never stops
- Sub-arctic on the Blizzard Bluff (northern edge)
- The sky is **permanently dark, starless** — Sol's celestial court was eaten
- Smells: dry grass, animal musk, cooking smoke, fermented mare's milk (kumis)
- Light: darkness broken only by firelight, whale-oil lamps, Lien-crystal beacons, the bioluminescence of woolly herd antlers

### Subregions (Radiating from the central basin)

**A. The Long Steppe** (Sundrift-Long-Steppe) — vast central plain
- Climate: cold-temperate steppe, perpetual wind, mild summers
- Terrain: endless grass plains, low rolling hills, occasional ancestor mound
- Zones: the-long-steppe, grass-tundra, kumis-downs, lien-stalked-grazes, mound-camps, the-unlit-knoll

**B. The Ancestor Wolds** (Sundrift-Ancestor-Wolds) — eastern uplands
- Climate: cool upland, fog in the burial hollows
- Terrain: burial barrows, hallowed ground, cairn-checkpoints
- Zones: ancestor-mounds, mound-camps, novas-heath, the-moundwatch

**C. The Starfall Basin** (Sundrift-Starfall-Basin) — western basin
- Climate: cold, the basin is sheltered by ridges
- Terrain: meteor crater, crystal-fields, crystal-lattice spires
- Zones: synod-hold, starfall-vale

**D. The Bogpost March** (Sundrift-Bogpost-Marsh) — southern transition to Bryngloom
- Climate: damp, foggy, the edge of the swamp
- Terrain: marshy steppe, peat-edges, river-crossings
- Zones: morrens-bogpost

**E. The Blizzard Bluff** (Sundrift-Blizzard-Bluff) — northern edge
- Climate: sub-arctic, perpetual wind, deep snow in winter
- Terrain: high bluffs, cairn-marked passes, cold grassland
- Zones: blizzard-bluff

### Cities & Settlements

- **Synod Hold** (city, 800 pop) — crystal-lattice Astril cathedral-fortress. Pale limestone buildings in concentric rings, every entrance faces east.
- **Mound-Camps** (settlement) — sprawling seasonal settlement of wool-yurts around the great grass mounds
- **Ancestor Mounds** (tomb) — vast network of grass-covered earthen barrows of 20 generations
- **The Moundwatch** (settlement) — cairn-checkpoint manned by Ordan March Wardens
- **Morren's Bogpost** (settlement) — Morren trading outpost at forest-steppe edge
- **Starfall Vale** (wilderness pilgrimage) — the crater where Sol's celestial court fell
- **The Unlit Knoll** (ruin) — Unlit Veil headquarters
- **Nova's Heath** (wilderness) — celestial impact site, Unlit Veil's hidden judgment-hill

### Notable Landmarks

- **Starfall Vale** — the most sacred site, a crater carpeted with crystalline shards glowing with trapped starlight
- **The Ancestor Mounds** — vast network of barrows, each mound emits a unique hum
- **The Unlit Knoll** — where fire refuses to burn, no light persists
- **Lien-Stalked Grazes** — region where the grass is replaced by glowing crystal-infused Lien-stalks
- **Nova's Heath** — perfect circle of crystallized soil from a celestial impact
- **The Kumis Downs** — rolling hills of pale grass, Ordan mare herds
- **The Blizzard Bluff** — Snow-Tooth, the wind never stops

### People & Races

- **Ordan humans** — nomadic horse-riders, throat-singers. Wind-leather cloaks, layered felt, herding leathers. Dark, weathered, lean. Wear bone Steppe-Staves as identity documents. Migrate endlessly following the woolly herds.
- **Astril** — the Star-Carried. Lean and wind-marked. **Luminous constellation-patterns ebb across their skin** in the dark, the visible proof of their inhabiting constellation-spirits (animal signs of the old zodiac: Horse, Wolf, Dragon, Serpent, Tiger, Stag). Three castes:
  - **Sylen** — embrace the spirit, blazing patterns, risk being consumed
  - **Muren** — suppress the spirit, dim patterns, risk eruption
  - **Unlit** — born without a spirit, the only Astril who can lie (their skin doesn't betray them)
- **Sky-Singers** — persecuted Animist throat-singers
- **Mounted** (horse-owning) and **Unmounted** (walking) — class division

### Creatures & Monsters

- **Hungry Child** — Ancient Cosmic Wyrdkin of the steppe; a star-story harvester that occupies the rejected dead
- **Lien** — pale crystal-creature of the Lien-stalked grazes
- **Qilin** — single-horned beast of the Starfall
- **Almas** — living memory of the Vale, watches from ridges
- **Nokhor** — predator of the Kumis Downs
- **Zud** — steppe blizzard-predator
- **Mound-Eater** — ancient catastrophic entity, can silence a mound permanently

### Factions

- **House Ordavan** — Khatun Bayarmaa Ordavan, Iron-Yurt Law, Steppe-Staves
- **Astril Synod** — ruling council of the Luminarchy at Synod Hold
- **Unlit Veil** — shadowy Astril intelligence network, actually rules Synod Hold
- **Sky-Singers** — persecuted Animists

### Map Art Suggestions

- **Symbols:** yurt-circle, throat-singer mouth, ancestor-mound with humming aura, Sky-Singer horn, Steppe-Stave (bone with notches), Lien-crystal shard, pale horse, woolly herd, the empty starless sky
- **Buildings:** low circular stone buildings in concentric rings, every entrance facing east. Pale limestone. No wood (no trees). Felt-and-bone yurts. Crystal-lattice spires (Astril architecture).
- **Landmarks:** the great barrows of the Ancestor Wolds emitting hum-lines, the crystal-shard carpet of Starfall Vale, the Unlit Knoll as a black absence in the dark sky
- **Color: pale grey-green, gold, bone-white, ash-grey, with patches of pale silver-white starlight. The sky should be DARK — permanently. The only natural light is the glow of the Lien-stalks, the woolly herd antlers, and the Astril patterns.**

---

## 7. BRYNGLOOM FOREST — "The Twilight Swamp of the First Contract"

**VIBE:** Twilight, bioluminescent, gothic, legalistic, damp, fungal, monastic, sepulchral. The Neth's eternal archive.

**COLOR PALETTE:** Deep peat-brown, dark moss-green, shadow-black, bioluminescent teal, amber, silver (Neth skin), purple (Vreken lantern-eyes). Sky invisible — twilight canopy.

**CLIMATE & WEATHER:**
- Damp, mild, foggy under the canopy
- Twilight year-round — the canopy admits no direct light
- Smells: damp wood, peat-rot, cheap spirits, cooking fires, unwashed bodies, the faint sweet undertone of preserving bogs
- Light: bioluminescent moss, lantern-eyes of Vreken, silver skin of Neth, never direct sunlight

### Subregions (Six distinct zones)

**A. The Canopy-Heart** (Bryngloom-Canopy-Heart) — political heart, Atropolis
- Climate: damp, mild, foggy under the canopy
- Terrain: living ironwood cathedral-grove, central lake, peat-bog, hanging slums
- Zones: atropolis, over-shanty, peat-bog-sinks, merryns-drift, the-great-mere

**B. The Sunken Basin** (Bryngloom-Sunken-Basin) — south-eastern depression
- Climate: damp, the spire-pointed fungal air is thick
- Terrain: sinkhole, inverted gothic architecture, fungal forests, shallow pools
- Zones: the-sunken-spire, fangmere-grove, the-crypt-of-aedris

**C. The Peat-Wastes** (Bryngloom-Peat-Wastes) — northern acidic peat-bogs
- Climate: damp, sulfuric, foggy
- Terrain: acid peat-bog, liquefying mud, dead ironwood stumps
- Zones: widows-quagmire, black-fen, drowned-dingle

**D. The Western Bayous** (Bryngloom-Western-Bayous) — western edge
- Climate: damp, mild, the bayou is always misty
- Terrain: ironwood bayous, river-cliffs, ancient fae-contracts carved into bark
- Zones: vel-keth-bayou, aran-glen, hunters-gully, drowned-dingle, covenbane-stronghold

**E. The Great Mere** (Bryngloom-Great-Mere) — **vast central lake with small wooded islands**
- Climate: damp, mild, islands have their own microclimates
- Terrain: open lake, forested islands, peat-bog shore
- Zones: the-great-mere, monks-of-the-sunken-stone
- The lake level rises and falls with the moon; islands that are above-water one season may be underwater the next

**F. The Root-Veil** (Bryngloom-Root-Veil) — subterranean mycelial network
- Climate: always dark, always damp, air thick with spores
- Terrain: mycelial network, ironwood root-tunnels, fungal groves
- Zones: root-veil-scriptorium
- Beneath the entire forest, the mycelial network connects every ironwood root. The Keeper of the Last Threshold rules here.

### Cities & Settlements

- **Atropolis** (city) — magnificent suspended canopy-city of the Neth, grown from living ironwoods. Branch-walkways, lawyers, pact-mages, memory-glass. The First Contract is preserved in the Heart-Vault of the oldest tree.
- **The Sunken Spire** (city) — inverted subterranean Vreken capital, 400 feet down into a peat-stone sinkhole. Phosphorescent fungal shrouds illuminate crypts.
- **Over-Shanty** (settlement, 600 pop) — chaotic hanging slum of rope-bridges beneath Atropolis. Drun outcasts, Morren peat-cutters. The Dangling Keel tavern sits over the deepest bog.
- **Aran-Glen** (settlement, 300 pop) — Kessen Neth village where every structure is grown from living ironwood
- **Covenbane Stronghold** (settlement) — Inquisition seat in the western bayous, black ironwood and cold-iron bars
- **Monks of the Sunken Stone** (settlement) — Velun monastery on the largest island of the Great Mere
- **Merryn's Drift** (settlement) — Merryn river-trading camp of lashed houseboats
- **The Crypt of Aedris** (tomb) — deepest chamber of the Sunken Spire
- **Root-Veil Scriptorium** (settlement) — the library of unbreakable memory at the heart of the Root-Veil

### Notable Landmarks

- **Atropolis** — the ironwood cathedral-grove, the living archive
- **The First Contract** — visible through living heartwood in the Heart-Vault
- **The Sunken Spire** — inverted gothic cathedral in a sinkhole
- **Vel-Keth Bayou** ("the water that remembers") — flows uphill, memory-glass deposits line the banks
- **The Root-Veil** — continent-spanning mycelial network, the Keeper of the Last Threshold
- **Fangmere Grove** — perfect circle of ironwood, Vreken ancestral bones in roots
- **Drowned Dingle** — petrified trees chime in the wind
- **Black Fen** — the Final Clause, legal void where the Keeper has no jurisdiction
- **The Great Mere** — vast central lake, rises and falls with the moon

### People & Races

- **Neth (High Neth, Pale Neth, Hallowed Neth)** — pact-bound, non-breathing legalists divided by Morvane's judgment at the Well of Youth into three marked lineages:
  - **High Neth (The Loyalists)** — porcelain-lined translucent skin creeping beneath temples, preserving natural warmth and rare fertility in the white canopy spires of Atropolis.
  - **Pale Neth (The Conspirators / Cold Undead)** — drow-like cold undead with ashen-grey skin, silver hair, and obsidian eyes; live in subterranean peat-caverns (The Drun Fen Vaults & Over-Shanty Deep-Quarter).
  - **Hallowed Neth (The Profane)** — paper-white semi-translucent spirit conduits bound to Morvane's Threshold shrines.
- **Vreken** — the Gloom-Lit. **Compact, wiry, 4'10"-5'6", long-fingered, curled ears**. **Lantern-eyes that glow** — rust-amber (Clean/Deep-Glow) or silver-white (Marked/Ghost-Mycelium). Gothic monastic vestments.
- **Morren humans** — debtors, peat-cutters, bog-dwellers. Swamp-worn, peat-stained, exhausted. Wear roughspun fiber-cloth, leather wraps.

### Creatures & Monsters

- **Debt-Revenant** — preserved, aware corpses of ancient debtors risen when contracts broke
- **Cycle-Eater** — entity of the bog, dissolves contract-debt
- **Edict** — Black Fen legal-void entity
- **Vatra** — bayou bog-creature
- **Leshy** — forest guardian of the bayous
- **Wist** — quiet Fangmere entity
- **Drowned-Wraith** — Drowned Dingle ghost
- **Lichborne Aedris** — the First-Lit's preserved form

### Factions

- **House Morrath** — Regent Morrath Neth (a substitute signatory elevated to fill the gap left by House Viridane's erasure)
- **Velun Pact-Lords** — Velun governing body
- **Kessen Weavers** — the probability-weavers
- **Crypt-Council** — Vreken ruling body
- **Cult of Forgotten Shadow** — memory-trade
- **Covenbane Inquisition** — witch-hunters
- **Lake-Council** — joint Neth/Merryn governance

### Map Art Suggestions

- **Symbols:** silver scrolls, First Contract seal, lantern-eyes, glowing mycelium, debt-revenant chain
- **Buildings:** Atropolis as a cathedral-grove of living ironwood grown into archive-chambers. The Sunken Spire as an inverted gothic cathedral descending into the earth. Aran-Glen as living-wood architecture. Over-Shanty as rope-bridges dangling in shadow.
- **Bridges:** rope-bridges, hanging platforms, living-bridges grown over decades
- **The Great Mere: vast central lake, forested islands** — this is the icon of the region
- **The Root-Veil: subterranean mycelial network** should be suggested as a dark layer beneath the map
- **Color: deep greens, browns, blacks, silver (Neth), teal/amber/purple (bioluminescence). Almost no sunlight. Everything is illuminated from BELOW or WITHIN.**

---

# PART IV: INTER-REGIONAL CONNECTIONS

### Trade Routes

- **The Velling Pass / Meadowglen Crossing** — connects Frostwood Reach to Sundale through a narrow valley
- **The Cinder Strait** — sea route from Sundale to Iceheart via Ember Lagoon and Basalt Shyr
- **The Iceheart Sea lanes** — connect every region by sea, policed by the Board of Trade
- **The Ashen Escarpment** — Sundale's natural border, with watchtowers and signal-fires
- **Skald's Landing** — northern river trade between Frostwood and Nordhalla
- **Morren's Bogpost** — the only major trade gateway between Bryngloom and Sundrift Vale
- **The Sunder-Wall** — Halvar's barrier funnels all Nordhallan migration through taxed checkpoints
- **The Ironwood Palisade** — Frostwood's border checkpoints
- **The Ancestor-Spans** — the ONLY reliable passage through the Cragjaw Peaks
- **The Toll-Dikes** — living-ironwood gates in the Bryngloom that charge peat-debt tolls
- **The Unfreezing Booms** — Iceheart Sea channels, guarded by Mereval ironclads

### Hidden Passages

- **The Lost Brood Vats** — sealed but accessible through Fexric service-shaft
- **The Subterranean Vault** — beneath Frostmaw, where a Sundered Monolith rests
- **The Star Caves** — lava-tubes beneath Spinstones Columns, sealed but the seals don't always hold
- **The Wraithfen** — fog-drowned fen where the Forgotten and Fractured Mimir hide
- **The Tide-Court Cove** — fills twice a day, the Mer-Court's hidden harbor
- **The Root-Veil Scriptorium** — accessible only through Keeper's permission

---

# PART V: THE NOBLE HOUSES — COMPLETE COMPENDIUM

| House | Region | Sigil | Bargain | Current Lord |
|---|---|---|---|---|
| **Thalreth** | Frostwood Reach | Petrified ironwood tree clutching quill and flame | Spatial clarity → fog | Jarl-Archivist Kaelen Thalreth |
| **Skalvyr** | Nordhalla | Iron-tooth, glacier wall | Summer → halted glaciers | King-Jarl Halvar Skalvyr (Járn-Tand) |
| **Solvan** | Sundale | Rising sun, scar-marked arm | Heirs' futures → volcanic warmth | The Solvan Steward (sidelined) |
| **Mereval** | Iceheart Sea | Golden scale on coral spire | Calm waters → navigable storm-lanes | Grand Admiral Varis Mereval |
| **Tesshan** | Cragjaw Peaks | Gear-tooth, khipu-knot | Visibility → protective snow-veil | Jarl-Inca Oda Tesshan |
| **Ordavan** | Sundrift Vale | Seven standing stones | Fertile soil → endless grass | Khatun Bayarmaa Ordavan (puppet: Steppe-Lord Loras) |
| **Morrath** | Bryngloom Forest | Tolch-keth contract seal | Borrowed survival from the Neth at interest | Regent Morrath Neth (substitute, not a real Morrath) |
| **Viridane** (Silenced) | Frostwood Reach (erased) | Negative space (cloaks with the seal's shape cut out) | Refused Keth Amar, made a counter-pact with the fae. **Paid with their name.** | Descendants are the Florae |

---

# PART VI: VISUAL & SENSORY GUIDE

### Frostwood Reach
- **LOOKS:** Iron-dark forest, fog, peat-grey, amber hearth-glow, dark green moss
- **SOUNDS:** scratching quills, distant fog-horns, creak of ironwood beams
- **SMELLS:** burning heartwood resin, damp parchment, peat-smoke
- **LIGHT:** dim, diffuse, amber hearths, blue-green bioluminescent lichen at night
- **WEATHER:** fog, fog, fog, occasional rain, snow only in the north
- **ICONIC IMAGES:** a tall faceless Mimir leaning forward with a wooden mask; a Thalren scribe copying genealogies by amber fire; a Briaran with thorns along her forearms

### Nordhalla
- **LOOKS:** Ice blue, obsidian black, glacier white, forge orange, blood red
- **SOUNDS:** wind howling, ice cracking, wolf howls, the grind of glaciers
- **SMELLS:** cold stone, whale-oil, iron, blood from the chiseling halls
- **LIGHT:** pale blue-green from geothermal vents through ice; orange forge-fires
- **WEATHER:** blizzard, whiteout, killing cold
- **ICONIC IMAGES:** a Rime-Born with blue skin, exhaling frozen mist; a Skald carver chiseling genealogies with his own blood; Corvani on a cliff-edge reading raven flight

### Sundale
- **LOOKS:** Black basalt, obsidian, cinder orange, blood red, ash grey, Solvan gold
- **SOUNDS:** thunder of forge-hammers, hiss of quenched metal, the rumble of volcanic vents
- **SMELLS:** superheated basalt, molten metal, sulfur, Emberth sweat, ozone
- **LIGHT:** orange-red from forge-pits and vents; never truly dark
- **WEATHER:** ash-fall, soot storms, heat shimmer
- **ICONIC IMAGES:** an Emberth Korr kneeling in absolute silence around the Sol's Breath; a Solvarn priest with ash-stained robes praying to a buried sun; Scathrach's coals glowing in the deep

### Iceheart Sea
- **LOOKS:** Deep ocean blue-black, storm grey, ice white, gold, coral pink, bioluminescent teal
- **SOUNDS:** waves crashing, ship rigging, the hum of Myrathil sonar-comm
- **SMELLS:** salt water, seaweed, Myrathil incense, Neth silver-blood
- **LIGHT:** grey daylight, dark night, phosphor glow in deep water
- **WEATHER:** perpetual gales, storms, salt-rain
- **ICONIC IMAGES:** a Merryn captain with ink-tattooed charts on his arms; a Myrathil Breaker-Born with webbed fingers; the Shard-Window's eye of the storm

### Cragjaw Peaks
- **LOOKS:** Granite grey, basalt black, snow white, forge orange, copper/brass, blood red, bone ivory
- **SOUNDS:** wind howling, hammer on anvil, steam venting, the groan of bone-spans
- **SMELLS:** sulfur, hot metal, machine oil, ozone, acid-etching
- **LIGHT:** amber bio-luminescent moss, geothermal glow-tubes, forge orange
- **WEATHER:** perpetual blizzard, whiteout, sulfuric fog at the depths
- **ICONIC IMAGES:** a Groven Ithran diplomat standing on a calcified bone-span above a chasm; a Fexric Kethrin with a beard woven in copper wire and gears

### Sundrift Vale
- **LOOKS:** Pale grey-green grass, ash-grey sky (no stars), gold, bone white, pale silver-white starlight
- **SOUNDS:** wind, wind, always wind; throat-singing; the hum of ancestral mounds
- **SMELLS:** dry grass, animal musk, cooking smoke, fermented mare's milk
- **LIGHT:** darkness broken only by firelight, whale-oil lamps, Lien-crystal beacons, woolly herd antler-glow
- **WEATHER:** perpetual wind, occasional blizzard
- **ICONIC IMAGES:** an Ordan throat-singer on a Steppe-Stave; an Astril Muren with dim constellation patterns on her skin; a burial mound glowing faintly with starlight

### Bryngloom Forest
- **LOOKS:** Deep peat-brown, dark moss-green, shadow-black, bioluminescent teal, amber, silver, purple
- **SOUNDS:** creak of rope-bridges, distant splashes, laughter, arguments, the chimes of Drowned Dingle trees
- **SMELLS:** damp wood, peat-rot, cheap spirits, cooking fires, unwashed bodies
- **LIGHT:** bioluminescent moss, lantern-eyes of Vreken, silver skin of Neth, never direct sunlight
- **WEATHER:** damp, mild, foggy, the canopy never admits direct light
- **ICONIC IMAGES:** a Neth Velun in silver robes, chest still, in absolute stillness; a Vreken Clean with rust-amber lantern-eyes; a Debt-Revenant suspended in black peat

---

# PART VII: KEY ICONOGRAPHY FOR THE MAP

### Universal Symbols
- **The Seven Stars** — once there were constellations; now a starless sky in the Sundrift
- **Aex's Fragment** — the Sundered Monoliths, scattered
- **The First Contract** — sealed in the Heart-Vault of Atropolis
- **Keth Amar's Mark** — the binding seal that broke

### Region-Specific Crests & Banners
- **Frostwood:** A petrified ironwood tree clutching a quill and a flame
- **Nordhalla:** An iron-tooth (Járn-Tand's sigil), or a glacier wall with a blue Rime-Born hand
- **Sundale:** A rising sun pierced by obsidian (Dawn Vigil), or an anvil crossed with a forge-hammer
- **Iceheart Sea:** A golden scale on a coral spire
- **Cragjaw:** Interlocking gears framing a steam-vent, or a khipu-knot
- **Sundrift:** A circle of seven standing stones
- **Bryngloom:** A bioluminescent lantern in a peat-stone arch

### Map Decorations to Include

- **Frostwood:** Ironwood Palisade check-posts, Mist-Sentinel watchtowers, Scribe-Sentinel lantern-posts, Moss-Wax candle icons, runic stone circles in the Frostfang north
- **Nordhalla:** The Sunder-Wall, blood-forges at the Bloodhammer Sump, ice-axes and Corvani raven-feather icons, the Frozen Archive as a glacier face with standing dead
- **Sundale:** Dawn Vigil signal-fires on the Ashen Escarpment, Obsidian Citadels, the Cinderhoodoo forest, the Spinstones Columns, Sol's Anvil Mesa
- **Iceheart Sea:** Ironclad patrol ships in the lanes, the Wave-Kept (never docks), the Shard-Window vortex, Blackteeth Skerry reef
- **Cragjaw:** Bone-spans across chasms (the icon of the region), the Stone Cog gear-walls, Fexric copper-wire beard icons, geothermal pipes
- **Sundrift:** Ancestor mounds with hum-aura, Moundwatch cairn-checkpoint, pale horse and woolly herd icons
- **Bryngloom:** Toll-Dike gates, the Great Mere with forested islands, rope-bridges, hanging platforms, the Dangling Keel tavern

### Iconography Suggestion for Hidden Features

- Small skull or eye icons over the Lost Brood Vats
- A crack in the ground near Frostmaw indicating the Subterranean Vault
- A red glow under Emberspire suggesting the buried star
- A question mark or absent sigil where House Viridane used to be
- Small eye-and-thorn icons where Briaran hidden camps are
- A red glint inside the Shard-Window's eye suggesting the Monolith below
- A crown-of-thorns at Sundale's Sun Shrines (Risen symbol)
- Whale-tail sigils where Myrathil underwater cave-cities exist

---

# PART VIII: CURRENT WORLD FRICTION (What the Map Should Suggest is Unstable)

For the map artist: these tensions should be **visible in the world-state** even if the political borders are stable. The map should feel like the world is on the edge of something.

1. **The tide has gone silent** — the Iceheart's deep-current songs have ceased
2. **The Devotion is corrupting** — Martyrs' suffering is being drawn without offering
3. **The Unbound are forming** — rogue Berserkers in Emberspire's deep tunnels
4. **The Deep-Born are fleeing** — Myrathil leaving the Treakous Rift
5. **The bog-dead are rising without covenant** — the Waking Graves
6. **The Drowned are walking toward the Monoliths**
7. **Chardalyn is replacing iron** — Wardens must choose between brittle chains and maddening metal
8. **Venoms are spoiling** — fog chemistry is changing
9. **The First Dawn may be vacant** — basalt tablets are pre-written
10. **The Voice is giving specific instructions** — pointing to the Frozen Archive's lowest vault
11. **Ambient magic is rising** — Void Resonance fills faster than it can be purged
12. **The Parasites are synchronizing** — lunar convergence is coming
13. **The Lost Brood is alive** — the 800-year Feral Brood has hyperintelligence
14. **The Founder is being erased from time** — Nesta the Chronarch
15. **The Keeper is rejecting clauses it once accepted** — the First Contract is failing
16. **The monoliths are waking** — their song is getting louder

---

# PART IX: RECOMMENDED COLOR PALETTES

| Region | Primary Hex | Accent Hex | Mood |
|---|---|---|---|
| **Frostwood Reach** | `#4a3728` (peat-brown) | `#8b7355` (amber) | Muted, archival, damp |
| **Nordhalla** | `#1a3a5c` (deep blue) | `#7ec8e3` (ice) | Cold, stark, iron |
| **Sundale** | `#5a1a00` (blood) | `#cc4400` (ember) | Volcanic, martyr-haunted |
| **Iceheart Sea** | `#1a3a5a` (navy) | `#c4a040` (gold) | Stormy, merchant-proud |
| **Cragjaw Peaks** | `#2a3a4a` (steel) | `#7a8a5a` (moss-bronze) | Vertical, mechanical, bone |
| **Sundrift Vale** | `#8b6914` (bronze) | `#d4c5a0` (cream) | Starless, endless, mournful |
| **Bryngloom Forest** | `#1a4a2a` (deep green) | `#4a8a5a` (silver-green) | Twilight, fungal, glowing |

### Secondary accent colors

- **Forgotten/shadow tones:** `#0a0a0a` (deep black)
- **Bioluminescent teal:** `#3affe0`
- **Wraith/ghost white:** `#d0e0e8`
- **Magma/ember:** `#ff6622`
- **Iron/steel:** `#4a5560`

---

# PART X: OPEN QUESTIONS & SUGGESTIONS

These are intentional gaps left for the map artist's interpretation. If you want to add detail here, do — these are the spaces where your creative choices will be appreciated.

## What the map maker can interpret freely

### Icons to consider adding

- **Briaran thorn-clusters** scattered across the Frostwood — small bushes of red-flowered thorns that hint at hidden groves
- **Cairn-piles** marking trade routes between regions (especially Sundrift Vale)
- **Wreck-sites** in the Iceheart — old ships half-submerged, sometimes still "manned" by draugr
- **Geothermal vents** as small orange dots in Nordhalla, Sundale, Cragjaw, and Bryngloom
- **Bone-spans** drawn as a series of small vertebrae icons across chasms in the Cragjaw
- **Spore-clouds** as small purple puffs in the Bryngloom
- **Star-crystals** as small white dots in Sundrift Vale (the Lien-stalks)
- **Knotted khipu-cords** as small braided strings in the Cragjaw
- **Memory-glass** as small reflective mirrors in the Bryngloom
- **Sun-shrines** as small disc icons in Sundale's Green Rim
- **Hush-quiet zones** (no birds, no wind) in the Bryngloom — represented by absence
- **Rime-spires** as small blue crystals in Nordhalla
- **Volcanic-glassed dunes** as black glassy patches in Sundale
- **Wraithfen-lanterns** in the Frostwood Eastern Fens

### Map features left to your interpretation

- The exact coastline details of Sundale
- The placement of minor islands in the Iceheart
- The exact location of the Jutul caves in the Frostfang Wastes
- The shape of the cave systems beneath Frostmaw
- The number and shape of the islands in the Bryngloom's Great Mere
- The specific layout of the Storm-Belt
- The paths of the deep trade routes
- The border between the Frostwood and Nordhalla
- The shape of the inner Sea route (the Cinder Strait)

### What we'd love to see added

- **A "You Are Here" compass rose** that doubles as a sigil of one of the houses
- **A small inset map** of a key city (Greymark, Merrowport, Atropolis, Frosthold, Frostmaw Holdfast, or Synod Hold)
- **A "Distances" legend** showing travel time between regions in different seasons
- **A "Climate Zones" key** showing temperature gradients
- **A "Bargain Stones" indicator** — small rune-stones at the borders of each region showing what each house traded
- **A "Wyrd-Corruption Density" map** — an overlay showing where Wyrd corruption, breaches, and Wyrdspawn are most concentrated (distinct from native-creature ranges)
- **"Hidden" markers** (dotted lines, faded icons) for passages, Briaran camps, pirate coves
- **A small inset** showing the Wyrd-corruption growth over the last 150 years
- **A "Where the Buried Star Sits" indicator** at Emberspire's heart
- **Trade route arrows** showing the Iceheart Sea lanes

---

# CLOSING NOTES

## The defining features to emphasize

- **Frostwood Reach:** the ironwood, the fog, the masks, the NORTH/SOUTH divide (warm south vs. cold Frostfang north)
- **Nordhalla:** the glaciers, the bone-tombs, the cold, the COAST on south and east
- **Sundale:** the volcano, the ash, the Sol's Breath, the FORESTED HALF-ISLAND (Glitterwood)
- **Iceheart Sea:** the storm, the ships, the ink-tattoos, the LARGEST continent by area
- **Cragjaw Peaks:** the spans, the blizzard, the gears, the JUTUL in the high peaks
- **Sundrift Vale:** the empty sky, the endless grass, the silent mounds
- **Bryngloom Forest:** the canopy, the glow, the contracts, the GREAT MERE lake with islands

## The world's central tension

Keth Amar is **pressed against the partial seal**, drinking Sol's light slowly. He knows six bloodlines answered, but he does not know that the seventh monolith is a hollow echo — Viridane's signature was never placed, and Morrath's name is a fabrication stitched over the gap. He is digging, clawing, sensing that one monolith "sings wrong" but never understanding why. The world is dying at the rate Sol is being drained. One hundred and fifty years of freezing winter. The world ends when Sol does.

The hidden truth: **Keth Amar hunts through knowledge.** He can sense what people know. To hide from him, a family must be *forgotten*. House Viridane escaped by being erased from every record — the fog that ate their name was the protection that let them flee. The Briaran are their descendants.

This is the architecture of the world. Every region, every race, every creature is downstream of this single truth.

---

**Document version 1.0** — for the map artist commissioned to draw the world of Mythrill.
