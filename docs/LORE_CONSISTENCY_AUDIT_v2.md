# Mythrill VTT  -  Evolved Lore Consistency Audit v2

Use this prompt to perform a comprehensive, systematic audit of every lore-bearing file in the Mythrill codebase. This version incorporates lessons from previous audits  -  it targets the specific categories of bugs, gaps, and contradictions that were actually found in production.

## AUDIT PROTOCOL

For every finding, report:
- **Severity**: `CRITICAL` (lore-breaking), `MAJOR` (misleading/wrong), `MINOR` (wording/stylistic)
- **File + Line(s)**
- **Problem**: What's wrong
- **Expected**: What it should say
- **Canonical Source**: Which file defines the authoritative version
- **Category**: Which check category caught this (for triage)

---

## CATEGORY 1: TIMELINE DATE CONSISTENCY

Every date reference must match the canonical timeline in `timelineStore.js`.

### 1.1  -  Breach date
Grep all files for any year number near "Breach", "Keth-Amar consumed", "heirs sacrificed", "capitulation", "sundered seal", "monoliths shattered". Canonical: **Year 11**. Flag anything else.

### 1.2  -  Binding date
Grep for any year near "Binding", "entombment", "entombed". Canonical: **Year 3**. Flag anything else.

### 1.3  -  Fog Compact date
Grep for "Fog Compact". Canonical: **Year 5, Deepening** (NOT Dimming). Flag era mislabels.

### 1.4  -  Glacier Bargain date
Grep for "Glacier Bargain". Canonical: **Year 7, Deepening** (NOT Dimming). Flag era mislabels.

### 1.5  -  Era boundaries
Any event dated Year 0-12 uses `eraId: 'deepening'`. Any event Year 12+ uses `eraId: 'dimming'`. Flag era mismatches.

### 1.6  -  "800 years" coherence
Grep all files for "800 years", "eight hundred years", "eight centuries". For each:
- Is the entity described actually ~800 years old?
- If newer (e.g., Plaguebringer Year 500 = ~300 years), flag the overstatement.
- Does the text acknowledge the 65 failed rebirth cycles where contextually appropriate?

### 1.7  -  Phase boundaries
Check every event's `phase` field against its year:
- False Spring: Years 0–50
- First Ebbing: Years 50–200
- Contraction: Years 200–450
- Squeeze: Years 450–650
- Intrusion: Years 650–800

### 1.8  -  Causal chain validity
In `timelineStore.js`, for every event:
- All `causes` IDs exist in SEEDED_EVENTS
- All `effects` IDs exist in SEEDED_EVENTS
- No cause is chronologically LATER than its effect
- Cause/effect pairs are reciprocal (if A lists B as effect, B should list A as cause)

### 1.9  -  Founding year vs event appearance
For every `classIds` entry in timeline events: flag any class whose founding year is AFTER the event year. (Note: this may be intentional  -  classIds are used as thematic/origin-story tags. Flag for awareness, not as bugs.)

---

## CATEGORY 2: ENTITY CROSS-REFERENCE RESOLUTION

Every entity ID used anywhere must resolve to its canonical source.

### 2.1  -  LoreLink termId resolution
Extract every `<LoreLink termId="X">` from all files. Verify X exists in `loreDictionary.js`. Flag orphans.

### 2.2  -  Location ID resolution
Extract every `locationId` from `timelineStore.js` events, `factionStore.js` HQs, class files' `livingOrder`/`classSpecificLocations`. Verify each matches a zone ID in `zoneData.js`. Flag mismatches.

### 2.3  -  Faction ID resolution
Extract every `factionId` from timeline events. Verify each exists in `factionStore.js`. Flag missing factions.

### 2.4  -  Class ID resolution
Extract every `classId` from timeline events, background hooks, faction affiliations. Verify each matches a class ID in `classes/index.js`. Flag mismatches.

### 2.5  -  Subrace ID resolution
Extract every subrace name from class files' `subraceVariants`, `restrictions`, `allowedSubraces`. Verify each matches a subrace ID in the corresponding race file. Flag resolved-but-wrong and unresolved.

### 2.6  -  NPC faction/location references
For every NPC in `npcStore.js`, verify their `factionIds` and `locationIds` resolve correctly.

---

## CATEGORY 3: CROSS-FILE DESCRIPTION CONSISTENCY

The same entity described in two different files must not contradict.

### 3.1  -  Region dark bargains
Compare each region's bargain description across: `rulesData.js`, `loreDictionary.js`, `worldStore.js`, `subregions.js`, `ClassOriginsDisplay.jsx`. Flag any file that attributes the bargain to the wrong house, wrong cost, or wrong consequence.

### 3.2  -  Noble house details
For each noble house, compare across `rulesData.js`, `loreDictionary.js`, `factionStore.js`, `human.js` subrace descriptions:
- Leader name and title  -  must match
- Seat/capital  -  must match
- Bargain terms  -  must match
- Current status (ruling/declined/sidelined)  -  must be consistent

### 3.3  -  Entity identity
For these key entities, compare across all files that mention them:
- **The Warden** (cosmic entity vs playable class)  -  are they clearly distinguished?
- **The Keeper / Root-Veil**  -  same entity or not? Are files consistent?
- **Aex**  -  flayed by whom? House Solvan consistently named?
- **The Wyrd**  -  consistent origin and behavior?
- **Sol's Breath**  -  consistent description of its decline?

### 3.4  -  Region→race mapping
For each region, compare the races listed in `subregions.js` `primaryRaces` with the races' own files' stated home region. Flag any race listed in a region where the race file says it doesn't live.

### 3.5  -  Region→class mapping
For each region in `ClassOriginsDisplay.jsx`, compare the listed classes with those classes' own `loreDictionary` region field. Flag any class listed under the wrong region.

### 3.6  -  Creature-region pairing
For each region, check that its creatures' folklore `origin`/`heritage` fields reference mythologies matching the region's designated folklore pair. The canonical pairs are:
- Frostwood Reach = Celtic + Germanic/Grimm
- Nordhalla = Norse + Alpine + Inuit
- Sundale = Mesopotamian + Egyptian
- Cragjaw Peaks = Japanese/Yokai + Andean/Incan
- Iceheart Sea = Greek + Polynesian/African
- Sundrift Vale = Mongolian/Turkic + Chinese
- Bryngloom Forest = Slavic + West African/Vedic

---

## CATEGORY 4: NAMING COLLISIONS AND INCONSISTENCIES

### 4.1  -  Same name, different entities
Search for any proper noun that refers to two completely different things:
- Check specifically: "Unwoven" (was Mimir caste + Sundale faction; Sundale should now be "the Scoured"), "Sylvain" (founder + modern NPC; should be intentional honor-name), "Sluagh" (two different creatures)
- Report any remaining collisions

### 4.2  -  Same entity, different names
Search for entities referred to by different names in different files:
- "King-Jarl" vs "High King-Jarl" for Halvar Skalvyr
- "Grand Admiral" vs "High Admiral" for Varis Mereval
- "Jarl-Inca" vs "High-Lord" for Oda Tesshan
- "Regent Morrath Neth" vs "Scribe-King" vs "Steward of the Seventh Seat"
- Flag all title/name mismatches

### 4.3  -  Hyphenation consistency
Check these terms for consistent hyphenation:
- "Scribe-Sentinel" (not "Scribe Sentinel")
- "Keth-Amar" (not "Keth Amar")
- "Rage" (not "Rage" or "Bloodheat")
- "First Contract" (always capitalized)
- Region names: "Frostwood Reach" (not "the Frostwood" alone in formal contexts)

### 4.4  -  Capitalization consistency
Check: "Emberspire" (always capitalized, rarely "the Emberspire"), "Sol" (not "the sun" in formal entries), "the Warden" (cosmic entity gets lowercase 'the', class Warden may not).

### 4.5  -  Obsolete name variants
Search for any term that might be an abandoned name variant still lingering:
- "Solbound" (should be "Sol" per canonical usage)
- "Thrum" (should be "Thrumm")
- Any other variant spellings

---

## CATEGORY 5: NPC AND LIFESPAN VALIDATION

### 5.1  -  Lifespan violations
For every NPC in `npcStore.js` and every named figure in `loreDictionary.js`, extract their race and stated age. Compare against the race's `lifespan` from the race file. Flag any NPC whose age exceeds their race's maximum lifespan WITHOUT explicit magical explanation.

### 5.2  -  "Still alive" founder age checks
For every class founder described as "still alive" or "still [verb]ing":
- Calculate their current age (present year ~800 minus founding year plus assumed adult age at founding)
- Compare against their race's lifespan
- Verify the lore provides an explicit explanation for any lifespan exceedance (e.g., Thrumm regeneration for Alaric, bog-rot for Vespera, calcification for Veyra)

### 5.3  -  Race field accuracy
For every NPC, verify their `race` field matches an actual race name from race files. Flag NPCs listed as "Briaran human" (Briaran are not human) or other hybrid/category errors.

### 5.4  -  Impossible backstories
For every NPC, check if their backstory references events that happened before they could have been alive given their race's lifespan. Flag any NPC claiming personal involvement in an event that predates their possible birth.

---

## CATEGORY 6: FACTION RELATIONSHIP SYMMETRY

### 6.1  -  Alliance/rivalry bidirectionality
For every faction's `relationships` array in `factionStore.js`:
- If A lists B as "allied", B must also list A as "allied" (or reciprocal like "vassal"→"overlord")
- If A lists B as "rival" or "hostile", B must also list A as something negative
- Flag any one-directional relationships

### 6.2  -  Relationship type correctness
Check relationship semantics:
- "puppet_master" means "I control them"  -  the CONTROLLED faction should have type "puppet", not "puppet_master"
- "vassal" / "overlord" should be reciprocal
- "neutral" should be bidirectional
- Flag any relationship where the type doesn't match the description text

### 6.3  -  Orphaned relationship targets
For every relationship, verify the target faction ID exists in `factionStore.js`. Flag any relationship pointing to a non-existent faction.

### 6.4  -  Duplicate relationships
Flag any faction that lists the same target faction twice (once as "allied", once as "neutral", etc.).

---

## CATEGORY 7: ENTITY COMPLETENESS

### 7.1  -  Missing loreDictionary entries
For every named entity (person, place, faction, concept) referenced across the codebase, verify it has a `loreDictionary.js` entry. Specifically check:
- All 20 class founders
- All 7 noble house leaders
- All named subrace founders (Aurel Shorn-First, Saren-Vel, Tharun Muren, etc.)
- All named NPCs referenced in `rulesData.js` Dramatis Personae section
- All named conflicts and institutions
- The Sundale civil war factions (the Risen, the Sunderer, the Scoured)
- Regional underclasses (the Forgotten, the Fredløse, the Bilge-Dwellers, the Mounted/Unmounted)

### 7.2  -  Missing timeline events
Flag any significant historical event mentioned in prose (class origins, race histories, location backstories) that has NO corresponding entry in `timelineStore.js` SEEDED_EVENTS.

### 7.3  -  Missing location entries
Flag any named location referenced in class files, race files, or background descriptions that has NO entry in `zoneData.js`.

### 7.4  -  Missing NPC entries
Flag any named individual referenced in class/race/location lore that has NO entry in either `npcStore.js` or `loreDictionary.js`.

---

## CATEGORY 8: NARRATIVE LOGIC AND GAPS

### 8.1  -  Governance gaps
For each region, trace its governance from the Binding (Year 3) to present. Flag any period where a region appears to have NO governing body or bargain.

### 8.2  -  Causal breaks
Flag any narrative where event B is presented as a consequence of event A, but the causal logic is missing or broken. Example: "the Bloodhammer migration took 93 years"  -  is this explicitly stated?

### 8.3  -  Unexplained phenomena
Flag any major lore element that is referenced but never explained:
- The dead moon/egg (now has entry, verify)
- The Watcher in the Mist (now has entry, verify)
- What Keth-Amar "planted" before the Binding (referenced in monologue)
- Why Keth-Amar cannot swallow Sol "whole" (explained as partial seal, verify consistency)
- Why the seal cracks widen naturally (geothermal pressure, verify consistency)

### 8.4  -  "Something in the mist" resolution
Verify that the Watcher in the Mist entry now connects: the fae presence → House Viridane's counter-bargain → the dead moon/egg → the lunar parasites → the Lunarch class. Flag any broken links in this chain.

### 8.5  -  The Viridane chronology
Verify the sequence makes sense: Binding (Year 3) → 8 years of Keth-Amar whispers → Breach (Year 11) → Viridane is reached by the Watcher BEFORE the whispers take hold → Viridane flees → Morrath elevated → Erasure begins. Flag any temporal impossibilities.

---

## CATEGORY 9: MECHANICAL-LORE ALIGNMENT

### 9.1  -  Class origin → mechanic match
For each class, verify the originStory's narrative directly supports the class's core mechanic:
- Martyr: Sera's self-wounding → Vow absorbs others' wounds. Match?
- Pyrofiend: Scathrach's parasitic fire → Inferno Veil kills the caster. Match?
- Revenant: Kora's blood-as-currency → Toll damages the caster. Match?
- Spellguard: Damon's absorbed solar flare → Void Resonance detonates if not purged. Match?
- Plaguebringer: Vespera's hosted bog-rot → self-damage from cultivated diseases. Match?
- Flag any class where the origin story does NOT explain why the mechanic works the way it does.

### 9.2  -  Damage type → lore match
For each damage type in `damageTypes.js`, verify the in-world description aligns with the cosmology:
- Ember = "Sol's buried warmth"  -  consistent with Sol's Breath dimming?
- Wyrd = "Keth-Amar's corruption"  -  consistent with Wyrd behavior in creature lore?
- Rime = "Nordhalla's bargained cold"  -  consistent with Glacier Bargain?

### 9.3  -  Race trait → lore match
For a sample of 5 races, verify their `baseTraits` and `sharedTraits` are logically derived from their lore descriptions. Flag any trait that seems arbitrary or unexplained by the lore.

### 9.4  -  Creature stat → biome match
For a sample of 10 creatures, verify their HP, resistances, and abilities are appropriate for their region's danger level and biome. Flag any creature that seems overpowered or underpowered for its placement.

---

## CATEGORY 10: DOCUMENTATION SYNC

### 10.1  -  GM World Guide accuracy
Compare `GM_WORLD_GUIDE.md` against the canonical data files. Flag any outdated dates, event sequences, or entity descriptions.

### 10.2  -  Map Maker Brief accuracy
Compare `WORLD_MAP_MAKER_BRIEF.md` against `zoneData.js` and `subregions.js`. Flag any locations that don't align.

### 10.3  -  Creature Compendium sync
Compare `CREATURE_COMPENDIUM.md` against `creatureData.json`. Flag any creatures with diverging descriptions.

### 10.4  -  Consolidation Master Plan accuracy
Verify that `CONSOLIDATION_MASTER_PLAN.md` reflects the current state of class consolidations. Flag any outdated merge documentation.

---

## CATEGORY 11: DISPLAY COMPONENT AUDIT

### 11.1  -  Hardcoded lore strings
Search all display components (`vtt-react/src/components/`) for lore text that is hardcoded inline rather than pulled from data files. Flag any that might diverge from canonical sources when data files are updated.

### 11.2  -  Lord Bertil's checklist consistency
Read `MapMakingSection.jsx` CHECKLIST_TEMPLATE. For every location, route, faction, and landmark mentioned:
- Verify it exists in the canonical data files
- Verify its description text matches `zoneData.js`, `loreDictionary.js`, etc.
- Flag any population numbers, founding dates, or descriptions that contradict

### 11.3  -  Character creation wizard
Read the character creation components. For every lore reference surfaced during creation (race descriptions, class overviews, subrace tooltips, background features, backstory prompts):
- Verify the displayed text matches the canonical data files
- Flag any stale or outdated lore text

---

## CATEGORY 12: DUPLICATE AND GHOST DETECTION

### 12.1  -  Duplicate entries
Search every data file for duplicate entries (same ID or same name used twice):
- `deepLocationData.js`  -  check for duplicate events in `significantEvents` arrays
- `creatureData.json`  -  check for duplicate creature names
- `factionStore.js`  -  check for duplicate faction entries
- `loreDictionary.js`  -  check for duplicate term IDs

### 12.2  -  Phantom references
Search for any entity ID referenced in `causes`/`effects` arrays, `classIds`, `factionIds`, or `locationIds` that has NO corresponding entry in its canonical source. Flag every phantom.

### 12.3  -  Dead code / deprecated references
Search for references to merged/obsolete class names (Bladedancer, Formbender, Covenbane, Exorcist, Deathcaller, Lichborne, Dreadnaught, Titan, Doomsayer, Chaos Weaver) that might still appear as active classes rather than historical footnotes.

---

## CATEGORY 13: RACE-LOCATION-CLASS COHERENCE

### 13.1  -  Race home region accuracy
For each race, verify that its home region (per its race file) is:
- Listed in that region's `subregions.js` `primaryRaces`
- Described in that region's `rulesData.js` section
- Reflected in that region's `worldStore.js` metadata

### 13.2  -  Subrace diaspora accuracy
For each subrace described as "diasporic" or having spread beyond its home region:
- Verify the `diasporaVariation` text is consistent with the region descriptions of where they spread
- Check that subrace restrictions in class/background files don't contradict the diaspora narrative

### 13.3  -  Class-region restrictions
For each class, verify that its `restrictions.allowedSubraces` list makes geographic sense  -  subraces from regions where the class canonically operates should be allowed, and subraces from regions where the class is described as "banned" or "distrusted" should be hard-blocked or omitted.

---

## CATEGORY 14: BIRTHRIGHT AND CHARACTER CREATION

### 14.1  -  Birthright question consistency
For each race file's `birthrightQuestions`, verify the questions reference valid in-world concepts, locations, and events. Flag any that reference outdated or non-existent lore.

### 14.2  -  Background subrace access
For each background in `backgroundData.js`, verify its subrace restrictions and narrative unlock justifications make geographic and historical sense:
- A background set in Sundale should not be available to subraces that have never been to Sundale
- A background referencing Year 412 should not have an "always available" justification that contradicts a pre-412 origin

---

## CATEGORY 15: FINAL REPORT

After completing ALL checks, produce a report with:

### A. CRITICAL FINDINGS
Each: `[File:Line] Problem | Expected | Category | Impacted UI`

### B. MAJOR FINDINGS
Each: `[File:Line] Problem | Expected | Category | Impacted UI`

### C. MINOR FINDINGS
Each: `[File:Line] Problem | Suggestion | Category`

### D. GAPS (entities missing from canonical sources)
Each: `Entity type | Entity name | What's missing | Where referenced`

### E. METRICS
- Total checks performed
- Total entities verified
- Total cross-references validated
- Conflicts found (by severity and category)
- Orphaned references found
- Naming collisions found
- Lifespan violations found
- Files with zero issues
- Files with the most issues
- New issue categories discovered (for v3 prompt)

### F. PRIORITY TRIAGE
Ranked list of what to fix first, grouped by category and effort.
