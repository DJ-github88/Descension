# Mythrill VTT Lore Audit — Continuation Prompt

Copy and paste the following prompt into your next chat session to continue the lore audit:

---

## LORE AUDIT CONTINUATION PROMPT

We have been conducting a comprehensive lore consistency audit across the Mythrill VTT codebase at `D:\VTT\vtt-react\src\`. This is an ongoing effort spanning ~20 iterations across multiple chat sessions. **~170+ contradictions resolved across 50+ files** to date.

### PROJECT OVERVIEW

Mythrill is a dark-industrial-fantasy TTRPG setting with:
- **20 playable classes** (in `data/classes/`)
- **10 playable races** with 25+ subraces (in `data/races/`)
- **45+ factions** (in `store/factionStore.js`)
- **35+ NPCs** (in `store/npcStore.js`)
- **63+ timeline events** (in `store/timelineStore.js`)
- **~280 lore dictionary entries** (in `data/loreDictionary.js`)
- **132 zones** across 7 regions (in `data/zoneData.js`)
- **192+ creatures** (in `data/creatureData.json`)
- **7 biomes** with full exploration rules (in `data/biomeData.js`)
- Talent trees, equipment, backgrounds, deep locations, cosmology

### KEY CONVENTIONS (ESTABLISHED & ENFORCED)

**Naming / Formatting:**
- **LoreLink termIds**: `loreDictionary.js` keys use underscores (`frostwood_reach`). A `LORE_ALIASES` array at the bottom adds hyphen-keyed runtime aliases (~10 entries) for backward compat with LoreLinks that use hyphens.
- **Zone IDs**: hyphens (`greymark-keep`). **LoreDictionary keys**: underscores (`greymark_keep`).
- **Region IDs**: hyphens: `frostwood-reach`, `nordhalla`, `sundale`, `iceheart-sea`, `cragjaw-peaks`, `sundrift-vale`, `bryngloom-forest`.
- **Spec IDs** (class specializations): underscore_case for multi-word IDs.
- **Class resource types**: lowercase (e.g., `"madness"`, `"rage"`, `"resonance"`).

**Era Terminology (CRITICAL - most common error):**
- **The Deepening** = Year 0–12 (the cataclysm itself — Sol's death-trance, the Binding, the Bargains, the Breach)
- **The Age of the Dimming** = Year 12–present (~800 years of frozen twilight, 65 failed rebirth cycles)
- These are **DISTINCT eras**, not synonyms. "Year X of the Dimming" is correct for everything after Year 12.

**House Politics:**
- **House Viridane** = the "original seventh house" (one of seven signatories who refused the sacrifice and fled — NOT "eighth house")
- **House Morrath** = elevated as a substitute after Viridane fled
- **House Solvan** = sidelined by the Dawn Vigil (not still ruling Sundale)
- The Binding had **seven original signatory houses** (Thalreth, Skalvyr, Solvan, Mereval, Ordavan, Tesshan, Viridane). After Viridane's flight, Morrath was elevated to maintain the seven.

**Race Terminology:**
- **Fexrick** = singular collective noun (the race as an entity)
- **Fexric** = adjective / plural form (e.g., "Fexric engineers", "the Fexric are")
- **Groven** = both singular and plural
- **Thrumm** = both singular and plural

**Notable Name/Fact Corrections:**
- **Grum** is titled "the Iron-Smith" (Bloodhammer is the clan name, not his personal title)
- **Vesper** (Revenant co-founder) is male and Neth (not human)
- **Nesta** (Chronarch founder) is a Kethrin Fexric engineer, still alive but fading from history
- **Li Wei** is alive (not dead per older loreDictionary entry)
- **Valerius** founded the Arcanoneer "in the decades after" the First Contract (not "during")
- **Sera Solvan** founded the Martyr in Year 12 of the Dimming (not Year 5 Deepening)
- **Gambit** founded Year 350 Dimming (not Year 60)
- **The Breach** occurred Year 11 of the Deepening (not Dimming)
- **False Prophet** first sermon Year 598 Dimming (not Year 501)
- **Cassia's first Augur reading** was Year 2 of the Deepening (not Year 0)
- **Pyrofiend** origin: First Cabal narrative (not Ignis the Emberth miner)
- **Vespera strain** age: "three centuries" (not "eight centuries")

### WHAT HAS BEEN FIXED (~170+ issues across 50+ files)

#### Last Session's New Fixes

**False Prophet classResource integration (critical gameplay fix):**
- Added `classResource: { type: "madness", cost: N }` to all 12 False Prophet spells in `falseProphetData.js` (Prophet of Wrath costs 6, Wrack with Guilt costs 4, Unravel costs 6, Shared Delusion costs 6, Faith-Stealer costs 6, Vision of the End costs 4, Apocalyptic Revelation costs 8, Mass Hallucination costs 8, Forced Conversion costs 8, Erase costs 8, Collective Delusion costs 12, Prophet of Lies costs 0)
- Removed `madnessSpending` property from 11 of 12 spells (kept on Prophet of Lies with `formula: "all"` — its cost is all accumulated madness)
- Fixed broken spell integration (level-3 spell had shorthand object syntax instead of a statement body, causing console errors and preventing other spells from loading)

**Creature data expansion:**
- Added 17 new creature entries to `creatureData.json` across all 6 regions (Scavenging Flock in Frostwood Reach, Gloom Vines in Bryngloom Forest, Vilemaw Broodling in Bryngloom, Moonhowl Alpha in Sundrift Vale, Glacial Remnant in Nordhalla, Crystalline Stalker in Cragjaw Peaks, Dust Devil in Sundale, Ember Wraith in Sundale, Bloodseeker Vine in Bryngloom, Sun-Scorched Hydra in Sundale, Razorwing in Cragjaw Peaks, Brambleheart in Frostwood Reach, Tainted Nymph in Bryngloom, Veil Stalker in Bryngloom, Reanimated Knight in Bryngloom, Drowned Priestess in Iceheart Sea, Siren in Iceheart Sea)

**Timeline/Chronology fixes:**
- `timelineStore.js`: Added `CHRONOLOGY_ERA_DISPLAY` constant (correcting Dimming entry to include year range "Year 12–Present"), added `getChronology()` getter for React component consumption.
- `chronologyData.js` (standalone file): Fixed Dimming entry to read `"800 years of frozen twilight"` instead of an empty string, added missing Year Range.
- `TimelineDisplay.jsx`: Removed import from broken `chronologyData.js`; now imports `CHRONOLOGY_ERA_DISPLAY` from `timelineStore.js` and calls `getChronology()` reactively.

**Party/Multiplayer asset fixes:**
- Fixed tooltip image URLs to use proper `ASSET_BASE` construction instead of broken relative paths
- Fixed `imageUrl` field name (was `imageUrl`) in tooltip-to-token settings mapping
- Added 6 missing map tokens for party members
- Enforced party member clearing BEFORE `create_room` to prevent duplicate HUD spawns
- Added `isConnected` flag to party members for duplicate detection

**ClassesDisplay refactor:**
- Created `data/classes/classDisplayData.js` — standalone module with all 20 class display entries (name, imageIcon, icon, role, resource, playstyle, roleColor, damageTypes), extracted from the component
- Updated `ClassesDisplay.jsx` to import and use `CLASS_DISPLAY_DATA` instead of maintaining a hard-coded inline `CLASS_DATA` array (removed ~60 lines of inline data and 23 FontAwesome icon imports)

**Fexric → Fextius rename:**
- Renamed a creature named "Fexric" in `creatureData.json` to "Fextius" to avoid confusion with the Fexric race
- Renamed corresponding image file references

#### Prior Sessions' Fixes (consolidated)

**Cross-Reference Fixes:**
- Added 10 LORE_ALIASES for broken LoreLink termIds (regions, cartels, events)
- Fixed 4 broken relatedTerms in loreDictionary.js
- Fixed 6 NPC locationIds that used regionId instead of zoneId
- Fixed 30 missing timeline causal chain reciprocals (effects arrays)
- Fixed 25 missing faction relationship reciprocals
- Added Icechamber Syndicate + Sulfur Cartel factions
- Added 6 missing NPCs (vorr-geth, thessa-ire, kaelen-thalreth, halvar-skalvyr, grum-bloodhammer, jax)

**Founder/Narrative Fixes:**
- Fixed Grum Bloodhammer: race Skald (not Thrask/Dwarf), status Dead, title "Iron-Smith"
- Fixed Li Wei: alive (not dead), Sol-Vareths gender: male
- Fixed Orven subrace: Clean Vreken (not Marked)
- Fixed multiple founding dates (Martyr → Year 12 Dimming, Gambit → Year 350, etc.)
- Fixed Breach era, Arcanoneer origin, False Prophet sermon date, Augur quote year
- Fixed Warden founding text, Damon identity, Pyrofiend narrative

**Name Collision Fixes:**
- "Deep-Born" → "Vault-Born", "Unwoven" → "Scoured"
- Multiple class figure name deconflictions (Malakor→Morvath, Lyra→Lirith, Vael→Veth, etc.)
- Captain Mereval → Captain Merevas
- Brine→Lampeia, Skerry→Hull-Smith (creatures)

**Structural Fixes:**
- Warden spec ID: shadowblade→iron-stalker, Augur spec ID: harbinger→doomsayer
- Lunarch talent tree swap (sanguine-warden ↔ void-caller)
- Plaguebringer spec IDs: hyphens→underscores
- Minstrel talent tree prerequisite fix
- Gambit talent ID: missing tier prefix
- classSpellCategories, summonableTokens, classLoreStore, classResources alignment
- raceEquipment.js: 5 fabricated subrace refs rewritten, ASTREN→ASTRIL

**Component/UI Fixes:**
- LanguagesDisplay.jsx: Exorcist→Inquisitor, Lichborne→Revenant
- TimelineDisplay.jsx: class renames, chronology source fix
- spellcrafting-wizard: 38 stale class references across 8 files
- ClassResourceBar.jsx: dead state cleanup (noted)

### WHAT REMAINS TO BE DONE

#### Content Gaps (need authoring, not bug fixes)
1. **False Prophet resource cost model**: All 12 spells now have `classResource` costs, but the *balance* hasn't been reviewed — Prophet of Lies costs 0 with `"all"` formula (spends ALL madness), which is a unique model among classes. Verify this is intentional.
2. **Other resource-gap classes**: Lunarch, Minstrel, Shaper, and a few other classes may still have spells that only cost mana without classResource costs. Need a full audit across ALL classes.
3. **17 missing creature stat blocks**: Gambrel, Stel, Skreika, Hungry Child, and 13 other signature regional Wyrd-creatures described in rulesData still have no creatureData entry (NOT the 17 we just added — different creatures).
4. **4 human subraces missing equipment**: `skald_human`, `solvarn_human`, `ordan_human`, `morren_human` have no raceEquipment entries.
5. **~46 missing zone coordinate mappings**: `locationCoordinates.js` has 86 of 132 zones mapped.

#### Known Inconsistencies (most likely to yield new finds)
6. **"Fexric" vs "Fexrick" convention**: ~50+ sites use "Fexric" as a singular noun where "Fexrick" is correct per conventions (e.g., "a Fexric" → "a Fexrick"). Deeply embedded in prose across rulesData, loreDictionary, class files, subregions, biome encounter tables, creature lore, and faction descriptions. Low-impact but pervasive.
7. **ClassResourceBar.jsx**: ~500 lines of dead state variables for removed classes (covenbaneState, deathcallerState, dreadnaughtState, exorcistState, lichborneState, oracleState, titanState) — cleanup pass needed.
8. **TimelineDisplay.jsx legacy code**: Still has a parallel hard-coded timeline with wrong Augur origin ("House Thalreth" instead of Cassia at Frozen Archive), BP date format instead of Year/Era format. Should be fully migrated to consume `timelineStore.js` — the chronology import was fixed but the event rendering still uses legacy data.
9. **InquisitorData.js**: Contains inline empty talentTrees stubs that conflict with the real `talentTrees/inquisitor.js`.
10. **Berserker talent tree**: Position overflow (y:7 in a 0-6 system) and t7 prefix breaking convention.
11. **Revenant spec gap**: `classSpellCategories` has 6 Revenant specs but class data only defines 3 (3 are PLACEHOLDER_TREE).
12. **Creature naming**: Tengu-Crow (rulesData) vs Tengu Scout (creatureData) — same entity, creatureData missing voice-stealing ability. Kappa role conflict (pest in rulesData vs guardian in creatureData).
13. **"everywhere-else" and "human-settlements" as meta-regions**: Used in class worldFriction entries — intentional but non-canonical region IDs.
14. **Wyrd terminology**: Wyrd-creature/horror/manifestation/spawn used as undocumented synonyms throughout.
15. **Synod Hold vs Synod-Hold**: Mixed hyphenation throughout.
16. **Faction count**: LORE_AUDIT says 47, `factionStore.js` has ~45 seeded factions — discrepancy.

#### Larger Migration / Refactoring
17. **ClassesDisplay.jsx**: The CLASS_DATA array was extracted to `classDisplayData.js`, but the ideal end-state is to derive display data directly from the per-class data files (in `data/classes/`). Currently the display data is a separate standalone copy that could drift from the per-class files. Each per-class file already has some of these fields at top level (name, icon, role, damageTypes in many cases), but fields like `imageIcon`, `resource`, `playstyle`, `roleColor` are missing from most per-class files. See `data/classes/index.js` for the class aggregator.
18. **False Prophet/Lunarch/Minstrel spells**: These classes had no classResource costs on their spells initially. We fixed False Prophet (12 spells). Lunarch and Minstrel likely still need the same treatment — adding classResource costs to 100+ spells is game design work.

#### Low-Priority / Aesthetic
19. **LoreLink cross-reference drift**: The `relatedTerms` arrays in `loreDictionary.js` require manual maintenance — stale entries accumulate and new terms get missed. Would benefit from automated verification.
20. **Three races without dedicated subregion listings**: Myrathil (Iceheart Sea), Briaran (Frostwood Reach), and Fexric (Cragjaw Peaks) have deep lore in their race files but aren't always listed as primary races in subregion definitions.
21. **Biome vs Region one-to-one mapping**: Each region maps to a single biome, but some have internal variation (e.g., Sundale's Green Rim is not desert-like, Frostwood has fens).

### FILES MODIFIED (50+ files across all sessions)

**This session (new/modified):**
- `data/classes/falseProphetData.js` — classResource on 12 spells, madnessSpending removal
- `data/creatureData.json` — 17 new creatures, Fexric→Fextius rename
- `store/timelineStore.js` — CHRONOLOGY_ERA_DISPLAY, getChronology()
- `data/chronologyData.js` — Dimming entry fix
- `components/rules/TimelineDisplay.jsx` — chronology import fix
- `data/classes/classDisplayData.js` — NEW: extracted display data module
- `components/rules/ClassesDisplay.jsx` — import-based data source

**Prior sessions (modified):**
- `data/loreDictionary.js` — aliases, relatedTerms, region values, rewritten entries
- `data/rulesData.js` — Fexric adjective, Vault-Born, dramatis personae, lexicon
- `store/factionStore.js` — new factions, classAffinities, relationships
- `store/npcStore.js` — new NPCs, locationIds, titles, backstories
- `store/timelineStore.js` — causal chains, founding dates, event descriptions
- `data/classes/*.js` — all 20 files: spec IDs, resource types, story fixes, LoreLinks
- `data/classes/index.js` — clean
- `data/equipment/raceEquipment.js` — subrace refs, ASTREN→ASTRIL, weapon stats
- `data/talentTreeData.js` — spec keys, backdrop keys, Lunarch swap
- `data/talentTrees/minstrel.js, gambit.js` — prerequisite fixes
- `data/classSpellCategories.js` — spec ID alignment
- `data/classResources.js` — completion confirmed
- `data/summonableTokens.js` — 24 legacy fixes
- `data/classLoreStore.js` — 14 legacy class aliases
- `data/races/human.js, briaran.js, emberth.js` — lore fixes
- `data/deepLocationData.js` — rulers, dates, classPresence, foundedBy
- `data/biomeData.js` — weather table, encounter description
- `data/pathData.js` — Emberth silence
- `data/zoneData.js` — Aedris title, Covenbane location
- `data/subregions.js` — Covenbane location
- `components/rules/ClassesDisplay.jsx` — resource names, display refactor
- `components/rules/LanguagesDisplay.jsx` — stale class names
- `components/rules/TimelineDisplay.jsx` — stale class names, Viridane house number, chrn fix
- `components/landing/MapMakingSection.jsx` — noted
- `components/spellcrafting-wizard/**` — 38 stale class references across 8 files
- `components/common/LoreLink.jsx` — noted

### HOW TO CONTINUE

1. **Ask me to "continue the lore audit"** — I'll launch parallel deep-dive tasks into specific areas.
2. **Focus on a specific system**: "audit the faction store for consistency", "audit creature descriptions against biome data", "audit class resource costs across all 20 classes".
3. **Fix remaining noted items**: The "What Remains" section above is prioritized by impact and likelihood of finding issues.
4. **Best areas for new discoveries**:
   - Cross-referencing class ability descriptions against talent tree effects
   - Checking the spellcrafting-wizard core mechanics for stale logic
   - Auditing files we haven't read line-by-line yet (backgroundData, race lore files, equipment)
   - Checking consistency between NPC hooks and actual faction/zone state
   - Full class resource cost audit (Lunarch, Minstrel, Shaper, and others may be missing classResource on spells)
