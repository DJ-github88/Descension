# Mythrill VTT  -  Ultimate Lore Consistency Fix Protocol

**Date:** July 2026
**Track record:** 3 audit cycles (v1, v2, v3) found 14 CRITICAL + 36 MAJOR + 84+ gaps. Each audit found NEW categories of bugs. This protocol is designed to **eliminate the root cause** of recurring inconsistencies.

---

## ROOT CAUSE ANALYSIS

After 3 audits, every inconsistency falls into one of these patterns:

| Root Cause | % of Bugs | Example |
|-----------|-----------|---------|
| **No single source of truth**  -  age/generation claims in NPC/race files are manually typed, not derived from founding dates | 40% | Vespera says "eight centuries" but class was founded Year 500 (~300 years) |
| **Relevance tagging conflated with chronology**  -  timeline classIds tag thematically connected classes regardless of whether they existed | 25% | False Prophet tagged in Year 250 event, but founded Year 598 |
| **Deprecated names leak into active code**  -  renaming a class doesn't purge old names from all code paths | 15% | Chaos Weaver still in classEquipment.js, ClassResourceBar.jsx |
| **Split settlement data**  -  one location's data lives across 3+ stores with no canonical source | 10% | Greymark Keep is "city" with 1,200 pop; 50+ locations in loreDictionary have no zoneData |
| **Undocumented display conventions**  -  UI components use non-canonical labels that look like lore | 10% | TimelineDisplay.jsx "Age of the Breach" vs canonical "The Deepening" |

---

## THE FIX: SINGLE SOURCE OF TRUTH (SSOT) ARCHITECTURE

For every lore claim, designate ONE canonical source. All other occurrences DERIVE from it and must be audited against it.

### SSOT Table

| Claim Type | CANONICAL Source | What to Extract |
|------------|-----------------|-----------------|
| Class founding year | `src/data/classes/*Data.js` → `originStory` | Year pattern (`Year X of the Dimming/Deepening`) |
| Class founder | `src/data/classes/*Data.js` → `founderName` | Name of founder |
| Class description | `src/data/classes/*Data.js` → `originStory`, `signatureQuote`, `currentCrisis` | Full canonical text |
| Timeline event chronology | `src/store/timelineStore.js` → `SEEDED_EVENTS[].date.year` | Year, factionIds, classIds, causes, effects |
| Calendar / Era names | `src/store/timelineStore.js` → `MYTHRILL_CALENDAR.eras` | 3 eras: Before the Deepening, The Deepening, The Age of the Dimming |
| Bargain attribution | `src/data/loreDictionary.js` → house entries + the_warden entry | House name, year, region |
| NPC age/death status | `src/store/npcStore.js`  -  but DERIVED from class founding years | Must cross-ref class data |
| Region geography | `src/data/subregions.js` + `src/data/regionPolygons.js` | Borders, adjacency |
| Settlement type/population | `src/data/deepLocationData.js` (primary) + `src/data/zoneData.js` (gameplay) | Type, pop, dominant races |
| Race description | `src/data/races/*.js` | Origin, culture, relations |
| Faction membership | `src/store/factionStore.js` | Leaders, members, hidden agendas |
| Era labels (canonical) | `src/store/timelineStore.js` → `eras` | "Before the Deepening", "The Deepening", "The Age of the Dimming" |
| Deprecated class names | `src/data/classes/index.js` (merge comments) | Blacklist: Chaos Weaver, Lichborne, Doomsayer, etc. |

---

## EXECUTION PROTOCOL

### Phase 1: Extract SSOT Data

Run this phase first. It builds the canonical reference tables.

#### P1.1  -  Class Founding Years

Read every file in `src/data/classes/*Data.js`. Extract:

| Class | Year Founded | Founder | Notes |
|-------|-------------|---------|-------|
| Augur | Y2 Deepening | Cassia | |
| Spellguard | Y3 Deepening | Damon | |
| Martyr | Y5 Deepening | Sera Solvan | |
| Pyrofiend | Y12 Dimming | First Cabal | |
| ... | ... | ... | ... (all 20 classes) |

Present year = **Year 800 of the Dimming** (not Year 0). Calculate age: `800 - founding_year = actual age`.

#### P1.2  -  Timeline Event Table

Read `timelineStore.js` SEEDED_EVENTS. For each event extract:
- `date.year`, `title`, `classIds`, `factionIds`, `causes`, `effects`

Build a chronological index. Note: `classIds` are **relevance tags**, not chronological markers. Document this explicitly.

#### P1.3  -  Era Canon

From `MYTHRILL_CALENDAR.eras`:
- **Before the Deepening**  -  Year < 0
- **The Deepening**  -  Year 0-12
- **The Age of the Dimming**  -  Year 12+

No other era names are canonical. "Age of Collection", "Age of the Breach", "Age of the Norse Kings" etc. must be removed or prefixed with "What some call...".

#### P1.4  -  Deprecated Class Blacklist

From `src/data/classes/index.js`:
- **Merged into Shaper:** Formbender, Bladedancer
- **Merged into Inquisitor:** Covenbane, Exorcist
- **Merged into Revenant:** Deathcaller, Lichborne
- **Merged into Berserker:** Titan
- **Merged into Harbinger:** Doomsayer, Chaos Weaver
- **Merged into Gambit:** Gambler, Fate Weaver
- **Merged into Martyr:** Dreadnaught

---

### Phase 2: Fix All Deviations (Fix-Forward)

For each phase below, fix every deviation. Do NOT audit first then fix  -  fix as you find.

#### P2.1  -  NPC Age Fix (4 known + any new)

For each NPC in `npcStore.js`:

1. If the NPC is a class founder, look up the class founding year from P1.1
2. Calculate: `current_age = 800 - founding_year`
3. If the NPC's `age` field or `backstory`/`appearance`/`personality` text claims a different age, fix it
4. Round down to nearest century for readability (300+ for Year 500, 400+ for Year 380, etc.)

**Patterns to grep:**
- `"eight centuries"` in any NPC  -  verify the entity actually existed for 800 years. Exceptions: entities founded in Year 0-12 (correct), entities founded Year 25-599 (wrong).
- `"centuries"` in any NPC backstory  -  verify each claim
- `"generations"` in any NPC description  -  verify count × 25 ≤ years elapsed

#### P2.2  -  Generation Math Fix (all race files + loreDictionary)

For each file in `src/data/races/*.js`, loreDictionary.js, rulesData.js, GM_WORLD_GUIDE.md:

1. Find ALL claims of "X generations" 
2. Identify the founding/reference year of the entity
3. Calculate expected generations: `(800 - founding_year) / 25` (for humans), `/ 35` (for long-lived races like Mimir, Vreken)
4. If actual count differs from expected by more than 20%, fix it
5. General rule: 1 generation = 25 years for humans, 35 for long-lived races

**Common fixes (from v3 audit):**
- Tessen "8 generations" → "30 generations" (human, ~760 years)
- Thalren "12 generations" → "32 generations" (human, ~795 years)
- Astril "12 generations" → "30 generations" (human-adjacent, ~785 years)
- Ordan "20 generations" → "31 generations" (human, ~775 years)
- Revenant "30 generations" → "6 generations" (250 years old, not 750)

#### P2.3  -  Deprecated Name Purge

For each deprecated name in P1.4, search ALL files in `vtt-react/src/`:

1. **Active class assignments** in `classEquipment.js` → `classes: ['DEPRECATED']` → rename to the merged-into class
2. **State variable names** in `ClassResourceBar.jsx`, resource bar components → rename prefix/suffix
3. **Spellcrafting wizard** references → rename or remap
4. **Function/constant names** referencing old class names → rename
5. **Comments** referencing old class names → update
6. **CSS** referring to old class names → update
7. **Icon mappings** in `ClassDetailDisplay.jsx`, `RulesPage.jsx` → update
8. **Texture/asset filenames** → rename or alias

**Grep patterns (per deprecated name):**
```
"{name}" in *.js, *.jsx, *.css, *.json not in docs/ not in CLAUDE.md
```
Exclude legitimate archival references: loreDictionary entries, in-world quotes, historical mentions.

#### P2.4  -  Era Label Standardization

Search ALL files for era labels. For each:

1. Compare against canonical eras from P1.3
2. If not an exact match for a canonical era, either:
   - Rename to canonical (preferred)
   - Prefix with "What some call..." or similar distancing language
   - Add an explicit note that it's a non-canonical display label

**Grep patterns:**
```
"Age of the [^D]"  // any "Age of the X" that isn't "Age of the Dimming"
"Age of Collection"
"Age of the Norse Kings|Age of the First Fae|Age of the Skalds|Age of the Rune-Singers"
"The Age of the Breach"
"The Age of Adaptation"
"The Age of the Deepening"  // should just be "The Deepening"
```

#### P2.5  -  Settlement Classification Fix

Cross-reference `deepLocationData.js` populations with `zoneData.js` types:

| Population | Appropriate Type |
|-----------|-----------------|
| < 100 | Outpost, Camp, Hamlet, Shrine |
| 100-500 | Village, Settlement, Watchtower |
| 500-2,000 | Town, Fortified Keep |
| 2,000-10,000 | City |
| 10,000+ | Metropolis, Capital |

**Known issues:**
- Greymark Keep: "city" with 1,200 pop → reclassify as "fortified keep" or "town"

#### P2.6  -  Missing Entity Fills

For each entity type, ensure the data store has an entry matching the SSOT:

| Type | SSOT | Missing Count |
|------|------|---------------|
| NPCs | factionStore references | 11 missing (see v3 findings D-01) |
| Factions | loreDictionary + timeline references | 5 missing (see v3 findings D-02) |
| Locations | loreDictionary entries | 50+ missing deepLocationData |
| House faction | loreDictionary house entries | 1 missing (house-viridane) |

For each missing entity: create a minimal entry in the appropriate store.

#### P2.7  -  Timeline Anachronism Documentation

For each event in `timelineStore.js` where `classIds` includes a class founded AFTER the event year:

1. Add a comment: `// NOTE: classIds are relevance tags, not chronological markers. [Class] founded Year X, event is Year Y.`
2. OR: Remove the anachronistic classId and add it to a separate `relevantClassIds` array if one exists

This is a DESIGN intensional (relevance filtering), not a bug. But it MUST BE DOCUMENTED so future audits don't flag it.

---

### Phase 3: Validation

#### P3.1  -  Run the Automated Validation Script

Execute `node scripts/validateLoreConsistency.js` to check:

1. All classIds in timeline events are either chronological OR documented as relevance tags
2. Zero deprecated class names in active code paths
3. All era labels match canonical eras
4. All NPC ages are consistent with class founding years
5. Settlement types match population ranges
6. No empty causes/effects arrays on events that should have them

#### P3.2  -  Manual Verification Checklist

Check these by reading:

- [ ] Every NPC quote mentioning years/centuries is consistent with their class founding year
- [ ] Every race description claiming "X generations" is within 20% of the calculated value
- [ ] All 7 regional bargains name the correct house across all files
- [ ] All 20 class founders are consistently named across class files, loreDictionary, and timeline
- [ ] No character knows information from after their time period
- [ ] The grim-dark tone is maintained  -  no unwarranted optimism
- [ ] Every <LoreLink> target exists in loreDictionary.js
- [ ] Trade routes in timelineStore can be mapped on the physical geography

---

## LORE GOVERNANCE (Preventing Future Drift)

### Rule 1: SSOT Always Wins
When adding lore, the SSOT for that entity type is the ONLY source for its fundamental facts. All other files DERIVE from it.

### Rule 2: Age/Generation Claims Must Be Calculated
Never type a number for centuries or generations. Calculate: `(800 - founding_year) / generation_length`.
For quotes in character voices, the quote must be consistent with the founding year even if the character is rounding.

### Rule 3: Deprecated Names Must Be Blacklisted
When a class is renamed/merged:
1. Update `src/data/classes/index.js` with the merge comment
2. Run a grep for the old name across ALL source files
3. Fix every match (or explicitly document why it's exempt)
4. Add the old name to the validation script's blacklist

### Rule 4: Era Labels Come From One Place
Never invent a new era name. The 3 canonical eras are the only eras. Sub-periods within an era must be explicitly labeled as "display periods" or "warmth phases" (as timelineStore.js already does with False Spring, First Ebbing, etc.).

### Rule 5: Settlement Data Resides in deepLocationData.js
If a location is important enough to have lore, it needs:
- An entry in `deepLocationData.js` (population, leadership, economy, atmosphere)
- An entry in `zoneData.js` (gameplay type, danger level, hazards)
- An entry in `loreDictionary.js` (description for LoreLink)
- A coordinate in `locationCoordinates.js` (map pin)

If any of these are missing, add a placeholder.

---

## APPENDIX: QUICK REFERENCE  -  PRESENT YEAR MATH

Present year in Mythrill = **Year 800 of the Dimming** (or ~800)

| Entity Founded | Year | Actual Age | Say "..." |
|----------------|------|-----------|-----------|
| Augur | 2 Deepening | ~798 | eight centuries |
| Spellguard | 3 Deepening | ~797 | eight centuries |
| Fog Compact | 5 Deepening | ~795 | eight centuries |
| Martyr | 5 Deepening | ~795 | eight centuries |
| Glacier Bargain | 7 Deepening | ~793 | eight centuries |
| The Breach | 11 Deepening | ~789 | eight centuries |
| Pyrofiend | 12 Dimming | ~788 | eight centuries |
| Apex | 10-30 Dimming | ~770-790 | eight centuries |
| First Contract | 25 Dimming | ~775 | eight centuries |
| Arcanoneer | 60 Dimming | ~740 | seven centuries |
| Warden | 70 Dimming | ~730 | seven centuries |
| Lunarch | 80 Dimming | ~720 | seven centuries |
| Berserker | 100 Dimming | ~700 | seven centuries |
| Animist | 120-200 Dimming | ~600-680 | six-seven centuries |
| Chronarch | 310 Dimming | ~490 | five centuries |
| Gambit | 350 Dimming | ~450 | four-five centuries |
| Shaper | 350 Dimming | ~450 | four-five centuries |
| Harbinger | 380 Dimming | ~420 | four centuries |
| Inquisitor | 380 Dimming | ~420 | four centuries |
| Toxicologist | 380 Dimming | ~420 | four centuries |
| Plaguebringer | 500 Dimming | ~300 | three centuries |
| Revenant | 550 Dimming | ~250 | two-three centuries |
| False Prophet | 598 Dimming | ~202 | two centuries |

**Generation math:** Age ÷ 25 = expected human generations. Always round to nearest integer.
- e.g., 800 ÷ 25 = 32 generations (Fog Compact to present)

---

*End of LORE_FIX_MASTER.md  -  execute phases 1-3 sequentially, verify with P3.1 before declaring complete.*
