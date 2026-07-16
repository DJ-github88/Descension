# HOUSES, REGIONS & GEOGRAPHY — LORE CAPTURE & AUDIT

Category auditor scope: Noble Houses, Regions, Geography/Settlements.
Sources read: `CANON_REFERENCE.md` (§4 Houses/Bargains, §5 Monoliths), `CORE_LORE_FRAMEWORK.md`, `GM_WORLD_GUIDE.md`, `lore.json` (full, 4666 lines), `regionPolygons.js`, `subregions.js`, `zoneData.js`, `deepLocationData.js`, `locationCoordinates.js`, `biomeData.js`.

Severity key: HIGH = contradicts canon source-of-truth. MED = internal inconsistency / completeness gap with gameplay impact. LOW = cosmetic / naming / documentation drift.

---

## A. COMPLETE LORE PICTURE

### A.1 REGIONS (7 confirmed — no 8th region exists)

| Region (lore.json id) | Biome | Climate/Curse | Ruling House | Bargain (traded → got / cost) | Monolith (house / body part) | Capital(s) |
|---|---|---|---|---|---|---|
| frostwood-reach | Forest | Memory-eating fog; ironwood canopy | Thalreth (ruling) + Viridane (erased original 7th) | clarity → insulating fog / memory erasure | Fog-Hand (Thalreth / right hand·skin) | Greymark Keep |
| nordhalla | Arctic | Halted glaciers; eternal winter; Frost-Tithe | Skalvyr | summer → halted glaciers / eternal winter + Frost-Tithe + Hunger Winter | Ice-Crown (Skalvyr / forehead·skull) | The Frozen Archive |
| sundale | Desert | Volcanic ashlands; Emberspire = Sol's tomb | Solvan (sidelined by Dawn Vigil) | wielded the knife → guilt & silence / their legacy | Still-Heart (Solvan / heart) | The Harath-Vault |
| iceheart-sea | Ocean | City-sized icebergs; perpetual storms; unfreezing channels | Mereval | calm seas → navigable channels / perpetual storms | Depth-Breath (Mereval / lungs) | Merrowport + Ironjaw Port |
| cragjaw-peaks | Underdark | Vertical labyrinth; eternal blizzard; bone-spans | Tesshan | visibility → blizzard-veil / lost landmarks | Wind-Bone (Tesshan / rib bone) | Frostmaw Holdfast |
| sundrift-vale | Steppe | Starless sky; endless grass; nomadic herds | Ordavan | fertile soil → endless grass / dark sky, constellations flee | Grass-Spine (Ordavan / spine) | Synod Hold + Mound-Camps |
| bryngloom-forest | Swamp | Twilight ironwood canopy; sinking peat-bogs | Morrath (substitute 7th) | Neth First Contract (NOT a noble-house bargain) | NONE in canon — 7th Monolith = Viridane's False Monolith (Frostwood/shifting) | Atropolis + The Sunken Spire |

Region polygon map (4096×3072) layout: Nordhalla top-left · Frostwood top-right · Sundale upper-center · Iceheart Sea center-left · Cragjaw right · Sundrift Vale bottom-right · Bryngloom bottom-left.

### A.2 HOUSES (8 documented)

| House (id) | Region | Traded | Got | Cost | Current Leader | Status |
|---|---|---|---|---|---|---|
| house_thalreth | frostwood-reach | clarity | insulating fog | memory erasure | Jarl-Archivist Kaelen Thalreth | Ruling; father Aldren de jure but fog-addled |
| house_skalvyr | nordhalla | summer | halted glaciers | eternal winter, Frost-Tithe, Hunger Winter | King-Jarl Halvar Skalvyr ("Jarn-Tand") | Ruling; consolidated by force, Sunder-Wall |
| house_solvan | sundale | wielded the knife | guilt & silence | their legacy | Steward of Emberspire (no "Lord" until Sol returns) | Sidelined by Hierophant Aethelgard / Dawn Vigil |
| house_mereval | iceheart-sea | calm seas | navigable channels | perpetual storms | Grand Admiral (Varis; rules from ship Wave-Kept, 40 yrs at sea) | Ruling via Sea-Charter / Brine-Bond Syndicate |
| house_tesshan | cragjaw-peaks | visibility | blizzard-veil | lost landmarks | Jarl Oda Tesshan ("High-Lord of the Peaks") | Ruling via Knotted Decree / Steam-Line Cartel |
| house_ordavan | sundrift-vale | fertile soil | endless grass | dark sky, constellations flee | Khatun Bayarmaa Ordavan (de facto); Loras Ordavan (puppet Steppe-Lord) | Ruling via Iron-Yurt Law / Herd-Tithe |
| house_morrath | bryngloom-forest | (substitute — no original bargain) | — | — | Regent Morrath Neth (Velun "acting" steward, 300+ yrs) | Governing; true Morrath line possibly extinct |
| house_viridane | frostwood-reach | REFUSED | Watcher's protection | erased from history | (no current noble leader; Briaran carry the blood) | Erased; survives as the Briaran (Bri-Vessela, Thorn-Speaker) |

"8 vs 7 houses" handling: CONSISTENT with canon. Viridane = original 7th signatory; Morrath = substitute 7th after Breach. "Eighth house" is used only as Briaran folk-speech (lore.json house_viridane:1979, briaran:1430). No hard contradiction.

### A.3 SETTLEMENTS BY REGION (canonical, lore.json + zoneData)

**Frostwood Reach** — Greymark Keep (city-pin/town-zone, pop 1200), Scribes' Tower, Ledger Halls, The Shallows, Ironwood Heart, Mirror Mere (pop 200), Wraithfen, Mistbarrow, Greythorn Copse, Bramble Heath, Skald's Landing, The Shifting Fen, Drunhold, Grimmwood, Siltmire Flats. Subregion-only: frostfang-wastes, grevtholm, iron-lake, the-stone-circles, bearsback-summit, meadowglen-crossing, velling-pass.

**Nordhalla** — The Frozen Archive (pop 400), Fjord-Gate, Bloodhammer Sump, Hunger Glaciers, Rimor's Hearth, Skadi's Col, Vargtor (pop 150), The Still Crag, Frostcirque, Rook's Promontory, Vespera's Perch. Subregion-only: frosthold-citadel, bearsbeards-beak, eldonholm, spars-folly, xardins-hearth, southern-shore-smugglers-cove.

**Sundale** — The Harath-Vault (city, pop 600), The Great Forge (city), Emberspire Caldera, Basalt Shyr, Cinder Badlands, Sol's Anvil Mesa, The Ashen Escarpment, Vulkar's Karst, Slag Gulch, Ember Lagoon (pop 350), Cinderhoodoo. Subregion-only: konjaw-port, ironjaw-village, thornshire-colony, meadowglen, warmheath, breezebough, the-glittering-forest, glitterwood-heart, old-sun-shrine, spinstones-columns, cinderbloom-crater, the-star-caves, solvans-stand.

**Iceheart Sea** — Merrowport (city, pop 500), Ironjaw Port, Treakous Rift, First Shore, Gale-Storm Shallows, Brinehorse Cove, The Saltmaw Estuary, Wraithsound, Deepwell Archipelago, Spindrift Lagoon (pop 250), The Shivering Bight, Skald's Longport. Subregion-only: saryreach-castle, blackteeth-skerry, tide-court-cove, shard-window, berg-of-the-frozen-flame, whaleroot-floe, blackteeth-isle, the-lucky-anchor.

**Cragjaw Peaks** — Frostmaw Holdfast (city, pop 900), The Spans, Ancestor-Gaps, Sump Galleries, Deepchasm Keep, Iron Ravine, The Great Gorge, Stag's Rest Moraine, Gearworks Gulch (pop 400), Frostmaw Massif, Lost Brood Vats, Sump Rift. Subregion-only: skirmours-crag, alley-of-knor, the-stone-cog, driknell-foundry.

**Sundrift Vale** — Synod Hold (city, pop 800), Mound-Camps, Ancestor Mounds, Grass Tundra, Lien-Stalked Grazes, Kumis Downs, The Long Steppe, Starfall Vale (pop 150), The Unlit Knoll, Morren's Bogpost, Nova Heath, Ancestor Wold. Subregion-only: thaw-run-river, blizzard-bluff, the-moundwatch.

**Bryngloom Forest** — Atropolis (city, NO deep data), The Sunken Spire (city, NO deep data), Peat-Bog Sinks, Over-Shanty (pop 600), Widow's Quagmire, Black Fen, Vel-Keth Bayou, Aran-Glen (pop 300), Fangmere Grove, Merryn's Drift, Drowned Dingle, Hunter's Gully, Root-Veil Scriptorium, Thalren's Ledger-Post. Subregion-only: the-great-mere, monks-of-the-sunken-stone, covenbane-stronghold, the-crypt-of-aedris.

---

## B. INCONSISTENCY MAP

### HIGH severity

**HG-01 — Solvan Still-Heart mislabeled as the "false decoy" (CONTRADICTS CANON §5/§8.2)**
- Location: `lore.json:4362` (sundered_monoliths.fullEntry)
- Canon says: Solvan's Still-Heart is the GENUINE heart-fragment of Aex — "misidentified" only in the sense that some mistake it for the False Monolith. CANON_REFERENCE:52 & CORE_LORE_FRAMEWORK:235 explicitly: "this is *not* the False Monolith… Solvan's Still-Heart is the genuine (if misidentified) heart-fragment of Aex."
- Lore says: "Still-Heart — House Solvan. The heart. But this is the false decoy. Solvan's Monolith was deliberately misidentified; the true heart lies elsewhere, hidden even from the houses."
- Notes: This invents a 7th "true heart elsewhere" that canon does not support and directly inverts canon's clarification. The False Monolith is Viridane's (no body part), correctly stated one line later — but the Solvan line is wrong. Highest-priority fix.

**HG-02 — GM guide invents a Monolith for Bryngloom (canon assigns none)**
- Location: `GM_WORLD_GUIDE.md:440`
- Canon says: 7 Monoliths = 6 true (Thalreth/Skalvyr/Tesshan/Mereval/Ordavan/Solvan) + 1 False (Viridane, Frostwood/shifting). Bryngloom's house (Morrath) is the SUBSTITUTE and has NO Monolith.
- Lore says: "The regional Sundered Monolith rests at the bottom of a bog-pool that has no bottom, leaking the memories of drowned divers into the peat." GM guide gives one Monolith to EACH of the 7 regions, leaving no slot for the False Monolith's distinct status.
- Notes: GM guide is explicitly non-authoritative (GM_WORLD_GUIDE:4-5), so this is documentation drift. But a Bryngloom Monolith cannot exist under canon without displacing the count.

### MEDIUM severity

**HG-03 — GM guide mislocates 3 true Monoliths vs canon**
- Location: `GM_WORLD_GUIDE.md:226` (Sundale), `:336` (Cragjaw), `:389` (Sundrift)
- Canon says: Still-Heart = "ruins of the oldest Solvan keep, beneath the floor of the hall where Aex was named" (NOT Emberspire's throat); Wind-Bone = "crevasse on the highest unclimbed peak" (NOT beneath Frostmaw Crag); Grass-Spine = "half-buried in the endless grass, ridge of black crystalline vertebrae running for a mile" (NOT inside the oldest Ancestor Mound).
- Lore (GM guide) says: Still-Heart in Emberspire throat; Wind-Bone "deep beneath Frostmaw Crag"; Grass-Spine "buried deep within the oldest Ancestor Mound."
- Notes: Non-authoritative GM guide; lore.json sundered_monoliths entry is closer to canon but still vague on exact sites.

**HG-04 — Character `region` tags use LOCATION ids instead of REGION ids**
- Location: `lore.json:3253` (vel-otharen `region:"atropolis"`), `:3734` (morrath-steward `region:"atropolis"`), `:3828` (valerius `region:"atropolis"`), `:3281` (fex-vestara `region:"frostmaw-holdfast"`), `:3497` (alaric `region:"frostmaw-holdfast"`)
- Canon/expected: region field should be one of the 7 region keys. atropolis & frostmaw-holdfast are locations, not regions.
- Notes: Breaks any code that filters characters by region key. Should be `bryngloom-forest` / `cragjaw-peaks` respectively.

**HG-05 — the-first-liar region tag conflicts with its described base**
- Location: `lore.json:3615` (region "nordhalla") + `:3617` ("leads the Unlit Veil from Synod Hold")
- Issue: Synod Hold is in sundrift-vale (lore.json:1532, coords:104). The Unlit are an Astril subrace native to Sundrift Vale. Yet the character is tagged nordhalla and argues against the Frozen Archive. Region tag, base location, and faction origin are mutually inconsistent.
- Notes: The Unlit Veil / Synod Hold / Frozen Archive relationship needs disambiguation — is this a Nordhalla operative or a Sundrift Astril movement?

**HG-06 — Zones with a lore.json entry AND map coordinate, but MISSING from zoneData.js**
- Location: missing in `zoneData.js`
- Affected: `cinderhoodoo` (sundale, lore:2356, coords:64), `sump-rift` (cragjaw, lore:2844, coords:97), `frostcirque` (nordhalla, lore:2304, coords:47), `skalds-longport` (iceheart, lore:3018, coords:83), `thalrens-ledger-post` (bryngloom, lore:3187, coords:132)
- Notes: These render as map pins with rich lore but have no danger/faction/connection record. Deeper than prior D-03 finding.

**HG-07 — Thalreth fog bargain misattributed to "Aethil" (the Warden) instead of Keth-Amar**
- Location: `lore.json:316` (house_thalreth "bargain with Aethil"), `:1839` (memory_fog_mechanics "bargain with Aethil"), `:2296` (Aethil's breath during "Glacier Bargain")
- Canon says: Dark Bargains were "struck with Keth-Amar directly. Aethil had no part in them" (CORE_LORE_FRAMEWORK §4, §2.2). The Warden/Aethil is the framework, not a bargainer.
- Lore says: even lore.json's own the_warden entry (:706) corrects this ("Aethil had no part in them"), yet house_thalreth and memory_fog_mechanics still phrase the fog as a "bargain with Aethil."
- Notes: Internally contradictory within lore.json; misleading about who Thalreth bargained with.

**HG-08 — Settlement classification vs population plausibility**
- Location: `zoneData.js:18` vs `locationCoordinates.js:24` (greymark-keep "town" vs "city"); `deepLocationData.js` populations
- Issues: greymark-keep = "town" in zoneData but "city" pin in coordinates (re-confirms prior C-07). merrowport pop 500 despite being "the largest human port-city" on the sea (lore.json:1551). harath-vault pop 600 as "the subterranean capital" of the Emberth. frostmaw-holdfast pop 900 is the largest; for "cities"/capitals these numbers read as large towns.
- Notes: Could be intentional post-catastrophe demographics, but the "largest/capital" labels clash with the small figures.

**HG-09 — Orphan deep-location: thornwood-grove**
- Location: `deepLocationData.js:1297` (`DEEP_LOCATIONS['thornwood-grove']`)
- Issue: Has full population/leadership/economy data but appears NOWHERE in zoneData, locationCoordinates, subregions, or lore.json. No region assignment, no map pin.
- Notes: Either dead data or a location that was never wired into the world.

**HG-10 — Bryngloom capitals (Atropolis, Sunken Spire) have NO deep location data**
- Location: absent from `deepLocationData.js` (only 15 entries; neither city present)
- Issue: Atropolis (House Morrath seat, Neth capital, "city" pin) and The Sunken Spire (Vreken capital, "city" pin) lack population/leadership/economy/defenses records, unlike peer capitals Greymark/Merrowport/Frostmaw/Synod Hold/Harath-Vault/Frozen Archive.
- Notes: Completeness gap — two of the seven regional capitals are missing deep data.

**HG-11 — Blizzard Bluff subregion claims Sundrift Vale borders Frostwood Reach**
- Location: `subregions.js:289-299`
- Issue: "northern edge of the Vale… separates the warmer steppe from the deep ice of the Frostwood Reach… Frostwood Thalren patrols meet them at the cairns." But regionPolygons place Cragjaw Peaks (x 2930-3960, y 970-2100) directly between Sundrift Vale (y 2330+) and Frostwood Reach (y 90-690) on the right side. They do not share a border.
- Notes: Adjacency error — either the bluff borders Cragjaw, or the map layout is wrong.

### LOW severity

**HG-12 — Region polygon colors duplicated across non-adjacent regions**
- Location: `regionPolygons.js` — nordhalla & cragjaw-peaks share red (rgba 107,26,26); frostwood-reach & sundrift-vale share green; sundale & bryngloom-forest share gold.
- Notes: Visual ambiguity only; not lore-breaking.

**HG-13 — "Vespera" / "Vesper" naming collision**
- Location: `lore.json:3400` (Vespera = Plaguebringer founder, bryngloom), `:2748-2754` (Vespera = Corvani matriarch namesake of Vespera's Perch, nordhalla), `:4004` (Vesper the Scribe = Lichborne/Revenant co-founder, bryngloom)
- Notes: Two different "Vespera"s in different regions/eras plus "Vesper." Distinct characters but easily confused.

**HG-14 — fexrick id vs "Fexric" term spelling**
- Location: `lore.json:1798-1800` (id "fexrick", term "Fexric")
- Notes: Documented in CANON_REFERENCE §8. The lore key uses -ck, the display name uses -c.

**HG-15 — snake_case vs kebab-case key split (systemic)**
- Location: lore.json keys are snake_case (e.g. `greymark_keep`, `house_thalreth`) while zoneData/locationCoordinates/subregions use kebab-case (`greymark-keep`). `zoneData.js:8-10` header explicitly notes conversion is required.
- Notes: Documented convention, but a recurring cross-reference hazard.

**HG-16 — Bargain COST under/miss-stated in two house entries**
- Location: `lore.json:1665` (house_mereval: "traded calm waters for unfreezing sea-lanes" — omits cost "perpetual storms"); `lore.json:190/1687` (cragjaw: "visibility for secrecy, warmth for isolation" — adds "warmth" not in canon; omits "lost landmarks")
- Notes: Incompleteness vs canon §4; the costs appear elsewhere (region summaries) but not in the house entries.

**HG-17 — Confusable settlement names**
- Location: `meadowglen-crossing` (Frostwood) vs `meadowglen` (Sundale); `ironjaw-port` (Neth/Iceheart) vs `ironjaw-village` (Sundale)
- Notes: Same root, different regions — lookup/UX hazard.

**HG-18 — Coordinate-only features with no zoneData or lore.json entry**
- Location: `locationCoordinates.js:50` (the-black-firth), `:66` (the-cinder-strait)
- Notes: Geographic features mentioned inside other locations' lore (fjord-gate, basalt-shyr) but given map pins without their own zone/lore records.

**HG-19 — "Aedris the First-Lit" absent from lore.json despite heavy data-file use**
- Location: referenced in `vreken.js:169-208`, `zoneData.js:1136/2089-2101`, `subregions.js:319`, `lunarch.js:130-279`, `deepLocationData` (Crypt of Aedris) — but NO entry in lore.json
- Notes: Aedris is a legitimate Vreken figure (first recorded Over-Lit, NOT a typo for Aex), but the lore dictionary is missing the entry, creating a data-rich/lore-poor gap. (Resolves the earlier "Aedris vs Aex" suspicion — they are unrelated.)

---

## C. WHAT CHECKS OUT (no action)

- Exactly 7 regions across lore.json, regionPolygons, biomeData, subregions — no spurious 8th.
- 8 houses present; 6 original bargainers + Morrath (substitute) + Viridane (erased). House↔region pairings consistent across lore.json, zoneData regionIds, subregions, biomeData.
- Bargain attribution matches canon §4 for Thalreth/Skalvyr/Solvan/Ordavan/Viridane; Mereval & Tesshan mostly match (see HG-16).
- Monolith house↔body-part↔region mapping in lore.json sundered_monoliths matches canon for 6 of 7 (Thalreth·hand/Frostwood, Skalvyr·skull/Nordhalla, Tesshan·rib/Cragjaw, Mereval·lungs/Iceheart, Ordavan·spine/Sundrift, Viridane·none) — ONLY the Solvan heart entry is wrong (HG-01).
- biome→region mapping is clean and 1:1 (arctic/desert/forest/swamp/ocean/underdark/steppe).
- locationCoordinates regionIds all correctly match their declared region.
- "8 houses vs 7 houses" handled everywhere as Briaran folk-truth per canon §4 — no hard factual contradiction.
- All 123 zoneData zones carry a valid regionId; none are orphaned to an invalid region.
