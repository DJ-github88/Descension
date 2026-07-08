# Mythrill VTT — Complete Lore Consistency Audit Prompt

Use this prompt to perform a comprehensive, systematic audit of every lore-bearing file in the Mythrill codebase. The goal is to identify **every contradiction, gap, inconsistency, and shortcoming** — not just major bugs, but every place where the lore is thin, contradictory, or missing.

---

## PART 0: AUDIT PROTOCOL

For every finding, report:
- **Severity**: `CRITICAL` (lore-breaking contradiction), `MAJOR` (missing key data, narrative hole), `MINOR` (wording inconsistency, thin description)
- **File + Line(s)**
- **Problem**: What's wrong
- **Expected**: What it should say (from the canonical source of truth)
- **Canonical Source**: Which file defines the authoritative version
- **Impacted UI**: Which component(s) display this data to users

### Canonical Source Priority (when sources conflict):
1. `timelineStore.js` — dates, events, calendar, trade routes
2. `loreDictionary.js` — entity descriptions, founding details
3. `rulesData.js` — world-state narrative prose
4. Per-class `overview` blocks in `data/classes/*.js` — class-specific lore
5. Per-race files in `data/races/*.js` — race/subrace-specific lore
6. `deepLocationData.js` + `zoneData.js` — location-specific lore
7. `backgroundData.js` — background-specific lore
8. `factionStore.js` + `npcStore.js` — faction/NPC lore
9. Documentation (`.md` files) — summaries, subordinate to data files

---

## PART 1: FILE INVENTORY — READ EVERY ONE

For the audit to be thorough, you **must** read or inspect every file in this inventory. Do not skip any. For large files, use Grep to search for specific patterns, then Read the surrounding context.

### 1.1 — Core World-Lore Data Files (`vtt-react/src/data/`)

| # | File | Focus Areas |
|---|------|------------|
| 1 | `rulesData.js` | World lore, cosmology, regions, timeline summary, class origins, Keth-Amar monologue |
| 2 | `loreDictionary.js` | ~200+ dictionary entries for every entity type |
| 3 | `zoneData.js` | ~86 zone POIs with descriptions, factions, connections |
| 4 | `deepLocationData.js` | Greymark Keep, Frozen Archive, Over-Shanty, Synod Hold deep profiles |
| 5 | `subregions.js` | 26 subregions — climate, terrain, races, factions |
| 6 | `backgroundData.js` | 22 character backgrounds with descriptions, features, class hooks |
| 7 | `pathData.js` | 9 character paths |
| 8 | `languages.js` | All Mythrill languages |
| 9 | `damageTypes.js` | 9 damage types with in-world descriptions |
| 10 | `explorationRules.js` | Region-specific exploration with lore framing |
| 11 | `rollableTables.js` | Random encounter/treasure tables with lore-flavored results |
| 12 | `biomeData.js` | Biome descriptions with encounter tables |
| 13 | `raceData.js` | Race aggregator |
| 14 | `raceMechanics.js` | Escalation tracks for race-specific crises |
| 15 | `creatureData.json` | Bestiary — origin, nature, habitat, combat, depth, hooks, heritage |
| 16 | `creatureLibraryData.js` | Expanded bestiary entries |
| 17 | `creatureAbilitiesAdvanced.js` | Creature ability mechanics with flavor |

### 1.2 — Class Files (`vtt-react/src/data/classes/`)

| # | File |
|---|------|
| 18-37 | `augurData.js`, `spellguardData.js`, `martyrData.js`, `pyrofiendData.js`, `apexData.js`, `berserkerData.js`, `arcanoneerData.js`, `wardenData.js`, `lunarchData.js`, `minstrelData.js`, `animistData.js`, `chronarchData.js`, `gambitData.js`, `shaperData.js`, `inquisitorData.js`, `harbingerData.js`, `toxicologistData.js`, `plaguebringerData.js`, `revenantData.js`, `falseProphetData.js` |
| 38 | `index.js` (class aggregator) |

### 1.3 — Race Files (`vtt-react/src/data/races/`)

| # | File |
|---|------|
| 39 | `human.js` (7 subraces) |
| 40 | `mimir.js` (3 subraces) |
| 41 | `briaran.js` (2 subraces) |
| 42 | `groven.js` (2 subraces) |
| 43 | `emberth.js` (2 subraces) |
| 44 | `vreken.js` (2 subraces) |
| 45 | `neth.js` (3 subraces) |
| 46 | `astril.js` (2 subraces) |
| 47 | `fexrick.js` (2 subraces) |
| 48 | `myrathil.js` (3 subraces) |

### 1.4 — Seeded Stores (`vtt-react/src/store/`)

| # | File | Focus Areas |
|---|------|------------|
| 49 | `timelineStore.js` | **CANONICAL** — 50 events, rebirth cycles, warmth phases, trade routes, calendar |
| 50 | `factionStore.js` | Faction lore, goals, hidden agendas, relationships |
| 51 | `npcStore.js` | NPC backstories, hooks, faction/location affiliations |
| 52 | `worldStore.js` | Region metadata, region-lock logic |
| 53 | `classLoreStore.js` | Aggregated class lore index |

### 1.5 — Display Components with Inline Lore (`vtt-react/src/components/`)

These files **contain inline lore summaries** that may differ from canonical data:

| # | File | Lore Content |
|---|------|-------------|
| 54 | `rules/RulesPage.jsx` | World lore browser (might hardcode prose) |
| 55 | `rules/ClassOriginsDisplay.jsx` | Region→class mapping with inline dark bargain summaries |
| 56 | `rules/DramatisPersonaeDisplay.jsx` | NPC portraits with inline captions |
| 57 | `character-creation-wizard/steps/Step8LoreDetails.jsx` | Backstory placeholder prompts |
| 58 | `landing/MapMakingSection.jsx` | Lord Bertil's checklist — ~120 map-making items with lore references |

### 1.6 — Documentation (`docs/` + root)

| # | File |
|---|------|
| 59 | `docs/GM_WORLD_GUIDE.md` |
| 60 | `docs/CREATURE_COMPENDIUM.md` |
| 61 | `WORLD_MAP_MAKER_BRIEF.md` |
| 62 | `docs/LORE_AUDIT_FINDINGS.md` |
| 63 | `docs/CONSOLIDATION_MASTER_PLAN.md` |

---

## PART 2: COSMIC TIMELINE AUDIT

### 2.1 — Are all dates consistent across all files?

Check EVERY mention of a year/date in every file against the canonical timeline in `timelineStore.js`. Look for:

- [ ] **The Binding**: Is it consistently Year 0 (rulesData) vs. Year 3 (timelineStore)? Report every file that uses the wrong year.
- [ ] **The Breach**: Is it consistently Year 11? Search for "Years 1–2", "Year 1", "Year 2", "Year 10", or any other date near "Breach", "Keth-Amar consumed", "heirs", "capitulation", "shattered seal".
- [ ] **The Fog Compact**: Year 5 — consistent everywhere?
- [ ] **The Glacier Bargain**: Year 7 — consistent everywhere?
- [ ] **The Vat-Breakers' Revolt**: Year ~40 — used consistently?
- [ ] **The Over-Shanty**: Year 412 — consistent?
- [ ] **The Solbrand Dimming**: ~Year 780 — consistent?
- [ ] **The Monoliths Waking**: ~Year 795 — consistent?

### 2.2 — Are the "800 years" references coherent?

Search for every instance of "800 years", "eight hundred years", "eight centuries" across ALL files. For each:

- [ ] Does the context make sense for the event being described?
- [ ] Does it correctly place the founding/emergence in the timeline?
- [ ] Is the event referenced actually ~800 years old, or is it newer?
- [ ] If it's newer (e.g., Plaguebringer founded Year 500, only 300 years old), does the text incorrectly claim 800 years?
- [ ] Does the text acknowledge the 65 failed rebirth cycles where appropriate?

### 2.3 — Do causal chains hold up?

For each event in `timelineStore.js`, check that its `causes` and `effects` arrays reference valid event IDs. Then verify:

- [ ] Every `causes` event chronologically precedes its effect
- [ ] Every `effects` event chronologically follows its cause
- [ ] No circular dependencies
- [ ] All referenced event IDs exist in the SEEDED_EVENTS array

### 2.4 — Phase assignment correctness

- [ ] Is every event assigned to the correct warmth phase?
- [ ] Does each phase's warmth description match the events within it?
- [ ] Are the phase boundaries (Year 0-50, 50-200, 200-450, 450-650, 650-800) consistently applied?

### 2.5 — Trade route coherence

- [ ] Do all 7 trade routes reference valid locationIds in their `origin`, `destination`, and `via` arrays?
- [ ] Do the `established` years make sense relative to the founding of the endpoints?
- [ ] Do the `cargo` descriptions match the regions' actual resources?
- [ ] Do the `history` descriptions reference valid timeline events by name?

---

## PART 3: ENTITY CROSS-REFERENCE AUDIT

### 3.1 — Every LoreLink reference must resolve

The codebase uses `<LoreLink termId="...">` tags that resolve against `loreDictionary.js`. Audit:

- [ ] Search EVERY file in `vtt-react/src/data/` and `vtt-react/src/components/` for `<LoreLink termId="...">` patterns.
- [ ] Extract every `termId` used.
- [ ] Verify each `termId` exists as an entry in `loreDictionary.js`.
- [ ] Flag every orphaned LoreLink that points to a non-existent dictionary entry.

### 3.2 — Every referenced entity must exist

For each of the following, check that the entity exists in its canonical source:

- [ ] **locationIds** in timelineStore.js events — do they exist in zoneData.js?
- [ ] **factionIds** in timelineStore.js events — do they exist in factionStore.js?
- [ ] **classIds** in timelineStore.js events — do they exist in classes/index.js?
- [ ] **subrace references** in class files (subraceVariants) — do they match the actual subrace IDs in race files?
- [ ] **class references** in background files (classHooks) — do they match actual class IDs?
- [ ] **faction references** in zoneData.js — do they match factionStore.js faction IDs?
- [ ] **NPC location/faction references** in npcStore.js — do they match valid locationIds and factionIds?

### 3.3 — Orphaned entity detection

Search for entities referenced in ONE file that don't appear in the canonical source:

- [ ] Factions mentioned in prose (e.g., "the Scribe-Cartel", "the Brine-Bond Syndicate", "the Cult of Forgotten Shadow", "the Deep Alchemists") — do they have entries in factionStore.js or loreDictionary.js?
- [ ] Notable figures mentioned in class/race files — do they have entries in loreDictionary.js or npcStore.js?
- [ ] Locations mentioned in class/race/background prose — do they have entries in zoneData.js?
- [ ] Events mentioned in prose that are not in timelineStore.js — should they be added?

---

## PART 4: CLASS LORE AUDIT

For each of the 20 class files, verify:

### 4.1 — Origin story consistency

- [ ] Does the origin story reference the correct founder? Cross-check with loreDictionary.js.
- [ ] Does the founding year in originStory match the canonical timeline?
- [ ] Does the narrative logic hold — is the class's emergence a plausible RESPONSE to conditions at that time?
- [ ] If the class absorbed a merged tradition (Shaper merged Bladedancer+Formbender, Inquisitor merged Covenbane+Exorcist, etc.), is the merger narrative consistent across both the class file and loreDictionary.js?

### 4.2 — Subrace variant consistency

- [ ] Does every subrace listed in the class's `subraceVariants` section exist in the corresponding race file?
- [ ] Are the `reframe`, `currentCrisisAngle`, and `signatureQuote` for each subrace variant consistent with the subrace's description in the race file?
- [ ] Are the subrace restriction lists (allowed/hard-blocked) consistent between the class file's `restrictions` section and the race file's `integrationNotes`?

### 4.3 — Class-location consistency

- [ ] Do the class's `classSpecificLocations` exist in zoneData.js or deepLocationData.js?
- [ ] Does the class's region of origin match the region→class mapping in `ClassOriginsDisplay.jsx`?
- [ ] Does the class's `livingOrder` HQ location exist?

### 4.4 — Class-crisis consistency

- [ ] Does the class's `currentCrisis` description align with the timeline's present-era events (~Year 795-800)?
- [ ] Are crisis descriptions from different classes contradictory? (e.g., does one class say the Solbrand is failing while another says it's stable?)

### 4.5 — Timeline event cross-reference

- [ ] Is each class listed in the correct timeline events? Check `classIds` fields in timelineStore.js events.
- [ ] Do classes appear in events that happened BEFORE their founding year? (This would be a CRITICAL error.)
- [ ] Are there timeline events that SHOULD list a class but don't?

### 4.6 — LoreLink resolution within class files

- [ ] Do all `<LoreLink termId="...">` tags in the class file resolve to valid loreDictionary.js entries?
- [ ] Are region/faction/race terms that appear in class prose correctly linked?

---

## PART 5: RACE LORE AUDIT

For each of the 10 race files, verify:

### 5.1 — Origin narrative coherence

- [ ] Does the race's origin story align with the cosmic timeline?
- [ ] If the race predates the Dimming (Fexrick, Vreken, Emberth), is the pre-Dimming history consistent with the era description?
- [ ] If the race emerged FROM the Dimming (Myrathil, Briaran, Groven, Neth, Mimir, Astril), is the emergence event in the timeline?
- [ ] For races with pre-Dimming subrace distinctions (Vreken Clean/Marked, Emberth Korr/Thrask), is the ancient origin consistent?

### 5.2 — Subrace emergence dating

- [ ] Does every subrace that emerged after the Dimming have an emergence date or timeframe?
- [ ] Is each emergence date consistent with the timeline events?
- [ ] Are the CAUSAL REASONS for each subrace split/schism narratively coherent?
- [ ] Gaps to specifically check:
  - [ ] Mimir: Purge (Year ~220) and Rupture (Year ~240) — dates present and consistent?
  - [ ] Neth: Drun Severing (Year ~380) — dated and consistent?
  - [ ] Myrathil: Breakers-Born (Year 11), Deep-Born (~Year 100), River-Fed (~Year 150) — dates present?
  - [ ] Astril: Sylen-Muren schism (~Year 250-300) — dated in both epicHistory and subrace descriptions?
  - [ ] Briaran: Smooth-Skinned (~Year 75) — dated?
  - [ ] Groven: Ladder of Purity — connected to Toll Wars (Years 280-340)?
  - [ ] Human subraces: Each tied to its regional bargain year?
  - [ ] Fexrick: Drall expansion during Contraction (Years 200-450)?

### 5.3 — Race-location consistency

- [ ] Does the race's home region match the world map layout?
- [ ] Do the race's `majorLocations` exist in zoneData.js?
- [ ] Is the race listed in its home region's subregions.js entry?
- [ ] Is the race mentioned in its home region's description in zoneData.js and rulesData.js?

### 5.4 — Race-mechanic consistency

- [ ] Does `raceMechanics.js` escalation track thresholds align with the race file's `currentCrisis` severity?
- [ ] Are the race's `baseTraits` and `sharedTraits` consistent with their lore description?
- [ ] Do lifespan numbers make sense? (check for races claiming "800 years" lifespan when they should be older)

### 5.5 — Race-background consistency

- [ ] Does each race's `integrationNotes` (class compatibility) match the subrace restrictions in class files?
- [ ] Does each race's subrace availability in backgrounds (backgroundData.js restrictions) match the race file's `diasporaVariation`?

---

## PART 6: LOCATION AUDIT

### 6.1 — Zone completeness

For each zone in `zoneData.js`:

- [ ] Does it have a `description`?
- [ ] Does it have a `dangerLevel`?
- [ ] Do its `factions` entries reference valid faction IDs?
- [ ] Do its `connections` reference valid zone names?
- [ ] Does its `subRegionId` match a valid subregion in `subregions.js`?
- [ ] Was the zone map-pinned in `locationCoordinates.js`?

### 6.2 — Location founding dates

For the 12 key cities (Greymark Keep, Atropolis, Frozen Archive, Emberspire Caldera, Harath-Vault, Merrowport, Synod-Hold, Over-Shanty, Frostmaw Holdfast, Ironjaw Port, Sunken Spire, Morren's Bogpost):

- [ ] Does the zone description include a founding date or timeframe?
- [ ] Is the founding date consistent with the timeline?
- [ ] Does the founding narrative make sense (e.g., a city can't be founded BEFORE the event that created the region)?

### 6.3 — Other locations needing founding dates

Check if these additional locations have founding context:

- [ ] Grevtholm
- [ ] Fjord-Gate
- [ ] Skalvyrhold
- [ ] Basalt Shyr
- [ ] Ember Lagoon
- [ ] The Shallows
- [ ] Ironwood Heart
- [ ] Scribes' Tower
- [ ] Aran-Glen
- [ ] Deepchasm Keep
- [ ] Gearworks Gulch
- [ ] Driknell Foundry
- [ ] Starfall Vale
- [ ] The Moundwatch
- [ ] Brinehorse Cove
- [ ] Spindrift Lagoon
- [ ] Covenbane Stronghold
- [ ] Vel-Keth Bayou
- [ ] The Storm-Belt / Shard-Window

### 6.4 — Location-prose consistency

- [ ] Does each location's description in `zoneData.js` match its description in `subregions.js`?
- [ ] Does each location's description match how it's described in relevant class/race files?
- [ ] Does the deep location profile (in `deepLocationData.js`, if applicable) match the zone description?

### 6.5 — Danger level coherence

- [ ] Do danger levels make geographic sense? (Su Apex tracker should have HIGH danger near Ironwood Heart, Sundale caldera should be HIGH, etc.)
- [ ] Do danger levels align with the region's description in worldStore.js and rulesData.js?

---

## PART 7: FACTION AUDIT

### 7.1 — Faction completeness

For each named faction in your world (the 7 noble houses + Scribe-Sentinels + Dawn Vigil + Mist-Sentinels + Scribe-Cartel + Brine-Bond Syndicate + Steam-Line Cartel + Cult of Forgotten Shadow + Deep Alchemists + Vat-Breakers Guild):

- [ ] Does it have an entry in `factionStore.js`?
- [ ] Does it have an entry in `loreDictionary.js`?
- [ ] Does its `foundedYear` / establishment context exist?
- [ ] Does its `headquarters` location exist in zoneData.js?
- [ ] Are its `relationships` (allied/rival/hostile) bidirectional? (If A lists B as ally, does B list A as ally?)
- [ ] Do the faction's `publicGoal` and `hiddenAgenda` make sense given the timeline?

### 7.2 — Faction-event consistency

- [ ] Is each faction listed in the timeline events it participated in? Check `factionIds` in timelineStore.js events.
- [ ] Does each faction appear in events AFTER its founding and not BEFORE?
- [ ] Are there timeline events that SHOULD list a faction but don't?

### 7.3 — The erased houses

- [ ] House Viridane: is it correctly described as erased but existing in loreDictionary.js and the Briaran race file? Is it NOT listed in factionStore.js (since it's erased)?
- [ ] House Morrath: is it correctly described as a SUBSTITUTE elevated in Year 11? Is this consistent across rulesData.js, loreDictionary.js, human.js, and the Neth/briaran race files?

---

## PART 8: NPC AUDIT

### 8.1 — Notable figure consistency

For each named NPC that appears across files:

- [ ] Is their backstory consistent between npcStore.js and loreDictionary.js?
- [ ] Is their faction affiliation consistent?
- [ ] Is their location affiliation consistent?
- [ ] Does their timeline (age, era of activity) align with the events they're associated with? (No 800-year-old human.)
- [ ] Are there named figures in class files, race files, or location descriptions that DON'T have entries in npcStore.js or loreDictionary.js?

### 8.2 — Aging and lifespan check

- [ ] For each NPC: is their plausible age consistent with their race's lifespan?
- [ ] For founders who are "still alive": is their claimed age plausible?
- [ ] Are there contradictions about who is alive vs. dead? (e.g., file A says "dead 8 centuries" but file B says "still speaking")

---

## PART 9: BACKGROUND AUDIT

### 9.1 — Background institution dating

For each of the 22 backgrounds:

- [ ] Does the description reference a specific in-world institution, location, or event?
- [ ] If so, is that institution/location/event dated in the timeline or lore dictionary?
- [ ] Is the background's founding narrative logically consistent? (e.g., Shanty Rat requires the Over-Shanty to exist — Year 412 — so it can't be used by a character born before then)

### 9.2 — Background subrace restrictions

- [ ] Are the `allowedSubraces` and `hardBlockedSubraces` consistent between backgroundData.js and the race files' `diasporaVariation` and `integrationNotes`?
- [ ] Do narrative unlock justifications make geographic sense? (e.g., "requires proximity to Sundale" for Emberspire Pilgrim)
- [ ] Do class hook bridges still make sense with the new founding years?

### 9.3 — Background-location consistency

- [ ] Is each background's region of origin consistent?
- [ ] Does a background reference a location that should exist but doesn't have a zoneData.js entry?

---

## PART 10: NARRATIVE COHERENCE AUDIT

### 10.1 — The Keth-Amar arc

- [ ] Does the 8-year corruption arc (Year 3-11) appear consistently wherever the Breach is narrated?
- [ ] Is Keth-Amar's growing influence (Ambient → Targeted → Coordinated → Active Assault) traceable through the timeline events?
- [ ] Does the Keth-Amar monologue in `rulesData.js` align with the detailed event descriptions in `timelineStore.js`?
- [ ] Are there places where Keth-Amar's influence is described as "sudden" or "immediate" when it should be gradual?

### 10.2 — The warmth decline arc

- [ ] Is the decline of geothermal warmth traceable through the five phases?
- [ ] Do race/class/location narratives acknowledge the gradual nature of the decline?
- [ ] Are there narrative claims that warmth "appeared suddenly" or "disappeared suddenly" when the timeline shows it was gradual?
- [ ] Is the Solbrand's dimming (~Year 780) consistently described as the CULMINATION of decline, not the beginning?

### 10.3 — The rebirth cycle integration

- [ ] Do the calendar months and holidays reference the rebirth cycle where appropriate?
- [ ] Do Augur-related events and descriptions mention the 65-cycle data set?
- [ ] Is the "False Dawn" month's cultural significance consistent with the rebirth window mechanic?
- [ ] Do any files describe the rebirth cycle as "active" or "ongoing" when it should be "failed" (after Year 660)?

### 10.4 — Regional coherence

For each of the 7 regions:

- [ ] Is the region's dark bargain consistently described across rulesData.js, loreDictionary.js, worldStore.js, subregions.js, and ClassOriginsDisplay.jsx?
- [ ] Is the region's biome consistent across biomeData.js, subregions.js, and the zone descriptions within it?
- [ ] Is the region's noble house consistently named and described?
- [ ] Are the region's native races consistent across race files and zone descriptions?
- [ ] Are the region's native classes consistent across class files, ClassOriginsDisplay.jsx, and the timeline events?

### 10.5 — "The Silent Seventh" coherence

- [ ] Is House Viridane's story consistent across: rulesData.js, loreDictionary.js, human.js, briaran.js, lunarchData.js?
- [ ] Is House Morrath's substitute status consistent across rulesData.js, loreDictionary.js, human.js (Morren)?
- [ ] Is the "eighth house" / "seven public names and one replaced" framing consistent?
- [ ] Is the Viridane erasure project (three centuries, years 50-350) mentioned consistently?

---

## PART 11: MECHANICAL-LORE CONSISTENCY

### 11.1 — Damage type lore

- [ ] Do the 9 damage types' in-world descriptions (damageTypes.js) align with the cosmology?
- [ ] "Ember = Sol's buried warmth" — is this consistent with the Solbrand-dimming narrative?
- [ ] "Wyrd = Keth-Amar's corruption" — does the Wyrd's behavior in creature descriptions match this?
- [ ] "Rime = Nordhalla's bargained cold" — consistent with the Glacier Bargain description?

### 11.2 — Creature lore

- [ ] For each creature in `creatureData.json` and `creatureLibraryData.js`:
  - [ ] Does its `heritage` (folklore fusion) make sense for its region?
  - [ ] Does its `origin` narrative align with the Wyrd's emergence (Year 11+) and escalation?
  - [ ] Does its `depth` description align with the region's current crisis?

### 11.3 — Equipment lore

- [ ] Do equipment descriptions with lore references (Keth-Amar contract-seals, Solbrand embers, etc.) reference valid entities?
- [ ] Does equipment that claims a specific origin (e.g., "forged at Harath-Vault") align with the location's description?

### 11.4 — Language lore

- [ ] Do all languages in `languages.js` have a plausible in-world origin?
- [ ] Are language categories (standard/exotic/racial/elemental/secret/special) logically assigned?
- [ ] Does each race have appropriate language access?

---

## PART 12: DISPLAY COMPONENT AUDIT

### 12.1 — Lore sidebar / codex

- [ ] Does `LoreSidebar.jsx` display lore that matches the canonical data files?
- [ ] Are there hardcoded lore strings in display components that differ from the data files?
- [ ] Does the region-lock gating logic in `worldStore.js` match the danger levels?

### 12.2 — Rules browser

- [ ] Does `RulesPage.jsx` render the `RULES_CATEGORIES` from `rulesData.js` correctly?
- [ ] Does `ClassOriginsDisplay.jsx` show the correct classes per region?
- [ ] Does `LexiconDisplay.jsx` show all entries from `loreDictionary.js`?

### 12.3 — Character creation

- [ ] Do `Step8LoreDetails.jsx` and its placeholder prompts reference valid in-world concepts?
- [ ] Do the character creation wizard tabs display race/class lore that matches the data files?
- [ ] Do subrace selection tooltips match the subrace descriptions in the race files?

### 12.4 — Lord Bertil's checklist

- [ ] Does every location, route, and faction mentioned in `MapMakingSection.jsx` have a corresponding entry in the data files?
- [ ] Are the city populations listed in the checklist consistent with any population numbers in zoneData.js or deepLocationData.js?
- [ ] Does the checklist's geographic logic ("closer to the buried sun, the warmer the land") match the zone/subregion layout?

---

## PART 13: DOCUMENTATION SYNC AUDIT

### 13.1 — GM World Guide

- [ ] Does `GM_WORLD_GUIDE.md` match the canonical data files in `rulesData.js` and `loreDictionary.js`?
- [ ] Are any dates, event sequences, or entity descriptions in the guide superseded by the expanded timeline?
- [ ] Does the guide correctly note its own subordinate status?

### 13.2 — Map Maker Brief

- [ ] Does `WORLD_MAP_MAKER_BRIEF.md` match the current zoneData.js and subregions.js layout?
- [ ] Are the region descriptions consistent with rulesData.js and loreDictionary.js?
- [ ] Does it reflect the 5-phase warmth curve and rebirth cycle?

### 13.3 — Creature Compendium

- [ ] Does `CREATURE_COMPENDIUM.md` match `creatureData.json`?
- [ ] Are creature regions consistent?

---

## PART 14: GAP DETECTION

### 14.1 — Undated entities

List EVERY entity that lacks a founding date, emergence date, or timeframe:

- [ ] Classes: Any class without a founding year in its originStory?
- [ ] Subraces: Any subrace without an emergence date or timeframe in its description?
- [ ] Locations: Any major city/settlement without a founding date in its zone description?
- [ ] Institutions: Any guild, order, or cartel without a founding date in its lore entry?
- [ ] Conflicts: Any named war or conflict without date boundaries?

### 14.2 — Missing loreLink coverage

- [ ] Are there important entities that SHOULD have loreDictionary entries but don't?
- [ ] Are there entities with loreDictionary entries that SHOULD appear as `<LoreLink>` tags in other files but don't?

### 14.3 — Thin descriptions

Flag any entity whose description is fewer than 2 sentences:

- [ ] Classes: Any class with a thin overview?
- [ ] Subraces: Any subrace with only a tooltip and no cultural background?
- [ ] Locations: Any zone with only one sentence?
- [ ] Backgrounds: Any background with a thin feature?

### 14.4 — Missing causal connections

- [ ] Are there lore events that SHOULD be causally connected but aren't?
- [ ] In the timeline's `causes`/`effects` chains, are there obvious missing links?
- [ ] Do class founding events explain WHY the class emerged (the causal reason), not just WHO founded it?

### 14.5 — Missing conflict narratives

- [ ] Are there suggested or implied conflicts that lack timeline events?
- [ ] Are there wars mentioned in location descriptions that have no corresponding event?
- [ ] Are there faction rivalries described in factionStore.js that have no conflict event in the timeline?

---

## PART 15: FINAL REPORT FORMAT

After completing ALL checks above, produce a report with these sections:

### A. CRITICAL FINDINGS (must fix)
Each item: `[File:Line] Problem | Expected | Impacted UI`

### B. MAJOR FINDINGS (should fix)
Each item: `[File:Line] Problem | Expected | Impacted UI`

### C. MINOR FINDINGS (improvement opportunities)
Each item: `[File:Line] Problem | Suggestion`

### D. GAPS (missing content)
Each item: `Entity type | Entity name | What's missing`

### E. CONSISTENCY METRICS
- Total entities checked
- Total cross-references verified
- Conflicts found (by severity)
- Orphaned references found
- Undated entities found
- Thin descriptions found
- Files with zero issues
- Files with the most issues

### F. PRIORITY ORDER FOR FIXES
Ranked list of what to fix first, with rationale.
