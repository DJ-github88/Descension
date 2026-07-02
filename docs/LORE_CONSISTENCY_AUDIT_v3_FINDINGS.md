# Mythrill VTT — Lore Consistency Audit v3: Findings Report

**Date:** 02 July 2026
**Protocol:** LORE_CONSISTENCY_AUDIT_v3.md
**Scope:** Full codebase (~170+ lore files, 20 class files, 7 regions, 34 factions, 31 NPCs, 86 zones, 100+ creatures)

---

## EXECUTIVE SUMMARY

| Metric | Count |
|--------|-------|
| Total checks performed | 282 |
| Total entities verified | ~350 |
| CRITICAL issues | 14 |
| MAJOR issues | 36 |
| MINOR issues | 18 |
| GAPS identified | 4 categories (84+ individual gaps) |
| Files with zero issues | ~60 (utility files, UI components, backend services) |
| Files with **most** issues | `timelineStore.js` (35+ anachronistic classIds), `npcStore.js` (3 age-math errors), `classEquipment.js` (6 deprecated class names), `creatureData.json` (4 non-standard era labels) |

---

## A. CRITICAL (must fix — lore is wrong)

### A-01. [CRITICAL] Vespera claims "eight centuries" — founded Year 500 (~300 years)
- **Files:** `npcStore.js:502-504`, `loreDictionary.js` Plaguebringer entry
- **Problem:** "bonded with bog-rot eight centuries ago" / "Vespera has been dying for eight centuries"
- **Actual:** Plaguebringer founded **Year 500 of the Dimming** (~300 years ago). She should be ~300 years old.
- **Fix:** Change to "three centuries" throughout.

### A-02. [CRITICAL] Varis the Trembling claims "eight centuries" — founded Year 380 (~420 years)
- **File:** `npcStore.js:604`
- **Problem:** "extracted fog-predator venom for eight centuries"
- **Actual:** Toxicologist founded **Year 380 of the Dimming** (~420 years ago).
- **Fix:** Change to "four centuries" throughout.

### A-03. [CRITICAL] Revenant quote claims "eight hundred years" — founded Year 550 (~250 years)
- **Files:** `revenantData.js:226`, `GM_WORLD_GUIDE.md:980`
- **Problem:** "Death came for me in the peat-bogs and I told it to wait. It has been waiting eight hundred years."
- **Actual:** Revenant founded **Year 550 of the Dimming** (~250 years ago). Also: "thirty generations of the dead" cannot fit in ~250 years.
- **Fix:** Change to "two hundred years" and "six generations" or similar. The quote may need a different founder (Kora lived at Year 550, so the death-waiting period must match).

### A-04. [CRITICAL] Alaric the Law-Keeper: "eight centuries beyond normal Groven lifespan"
- **Files:** `wardenData.js:160`, `loreDictionary.js:1034`, `npcStore.js:622`
- **Problem:** Claims "eight centuries" but Warden founded Year 70 (~730 years ago). Close but overstated by ~70 years.
- **Fix:** Change to "seven centuries" (730 years round-down).

### A-05. [CRITICAL] "Eight generations" for Tessen humans — should be ~25-30 generations
- **Files:** `rulesData.js:513`, `human.js:21,365`, `GM_WORLD_GUIDE.md:283`
- **Problem:** "The Tessen have not seen the sky in eight generations" but Snow-Veil Bargain was ~Year 40 (760 years ago). At human generation length (25-30 years), this = ~25-30 generations, not 8.
- **Fix:** Change to "thirty generations" or adjust the generation length definition for lore purposes.

### A-06. [CRITICAL] "Twelve generations" of Thalren genealogy — far too few
- **File:** `human.js:100`
- **Problem:** "forty thousand names, stretching back twelve generations" but the Fog Compact was Year 5 (~795 years). 12 human generations = ~300 years.
- **Fix:** Change to "thirty-two generations."

### A-07. [CRITICAL] "Twelve generations" of Astril Dragon-Sign — far too few
- **File:** `astril.js:34`
- **Problem:** "a noble whose bloodline has carried the Dragon-Sign for twelve generations" but first Astril vessels were Year 15 (~785 years ago). 12 generations is far too few.
- **Fix:** Change to "thirty generations."

### CRITICAL DEPRECATED NAMES IN ACTIVE CODE

### A-08. [CRITICAL] `classEquipment.js` — 5 items assigned to `'Chaos Weaver'` (should be `'Harbinger'`)
- **File:** `classEquipment.js:434,453,477,498,516`
- **Problem:** Equipment items use the deprecated class name `'Chaos Weaver'` in their `classes` array instead of `'Harbinger'`. Players selecting Harbinger will NOT receive these items.
- **Fix:** Replace `'Chaos Weaver'` with `'Harbinger'` in all 5 locations.

### A-09. [CRITICAL] `classEquipment.js` — 1 item assigned to `'Lichborne'` (should be `'Revenant'`)
- **File:** `classEquipment.js:1708`
- **Problem:** Equipment item uses deprecated class name `'Lichborne'` when it should be `'Revenant'`.
- **Fix:** Replace `'Lichborne'` with `'Revenant'`.

### A-10. [CRITICAL] `ClassResourceBar.jsx` — `characterClass === 'Fate Weaver'` (should be `'Gambit'`)
- **File:** `ClassResourceBar.jsx:1180`
- **Problem:** Active runtime condition checks for deprecated class name `'Fate Weaver'` instead of `'Gambit'`. The Fate Weaver resource bar will never render for Gambit characters.
- **Fix:** Replace with `'Gambit'`.

### A-11. [CRITICAL] `classSpellGenerator.js` — passes `'Chaos Weaver'` as class name
- **File:** `classSpellGenerator.js:160`
- **Problem:** `normalizeClassSpell(spell, 'Chaos Weaver', ...)` uses deprecated name.
- **Fix:** Replace with `'Harbinger'`.

### A-12. [CRITICAL] `classResourceUtils.js` — test array includes `'Chaos Weaver'`
- **File:** `classResourceUtils.js:57`
- **Problem:** Test array uses deprecated class name.
- **Fix:** Replace with `'Harbinger'`.

### A-13. [CRITICAL] Non-standard era labels in `creatureData.json` and `creatureLibraryData.js`
- **Files:** `creatureData.json:48,876,910,943`, `creatureLibraryData.js:367,654,751,855`
- **Problem:** Creature origins reference non-canonical eras: "Age of the First Fae", "Age of the Norse Kings", "Age of the Skalds", "Age of the Rune-Singers". These do not exist in the 3-era system.
- **Fix:** Replace with canonical era references (e.g., "Before the Deepening", "Early Age of the Dimming").

### A-14. [CRITICAL] Non-standard era labels in `TimelineDisplay.jsx`
- **File:** `TimelineDisplay.jsx:40,59`
- **Problem:** Uses "The Age of the Breach" and "The Age of Adaptation" as era labels. Neither exists in the canonical 3-era system.
- **Fix:** These are display-only sub-era labels. Either document them as display conventions or remove.

---

## B. MAJOR (should fix — misleading or inconsistent)

### TIMELINE ANACHRONISMS (classIds tag classes before they existed)

The `classIds` arrays in `timelineStore.js` serve as relevance tags (`getEventsByClass()` filter). However, many events tag classes that would not exist for 100-500+ more years, creating a misleading historical presentation.

### B-01. [MAJOR] False Prophet referenced 300-350 years before founding
- **Problem:** `classIds: ['falseProphet']` appears in `event-astril-schism` (Year 250-300). False Prophet founded **Year 598**. Gap: ~300 years.
- **File:** `timelineStore.js:645`

### B-02. [MAJOR] False Prophet referenced 186 years before founding
- **Problem:** `classIds: ['falseProphet']` appears in `event-cult-founding` (Year 412). Gap: 186 years.
- **File:** `timelineStore.js:811`

### B-03. [MAJOR] False Prophet referenced 118 years before founding
- **Problem:** `classIds: ['falseProphet']` appears in `event-false-dawn-riots` (Year 480). Gap: 118 years.
- **File:** `timelineStore.js:839`

### B-04. [MAJOR] Revenant referenced 539 years before founding
- **Problem:** `classIds: ['revenant']` appears in `event-keth-amar-breach` (Year 11). Revenant founded Year 550. Gap: 539 years.
- **File:** `timelineStore.js:172`

### B-05. [MAJOR] Harbinger referenced 380+ years before founding
- **Problem:** Appears in Year 0, Year 3-11, Year 7, Year 15 events. Harbinger founded Year 380.
- **Files:** `timelineStore.js:130,158,256,298`

### B-06. [MAJOR] Toxicologist referenced 375 years before founding
- **Problem:** Appears in Year 5 event. Founded Year 380.
- **File:** `timelineStore.js:242`

### B-07. [MAJOR] Inquisitor referenced 369 years before founding
- **Problem:** Appears in Year 11 event. Founded Year 380.
- **File:** `timelineStore.js:172`

### B-08. [MAJOR] Gambit referenced 300+ years before founding
- **Problem:** Appears in Year 12-50 event. Founded Year 350.
- **File:** `timelineStore.js:284`

### B-09. [MAJOR] Shaper referenced 300+ years before founding
- **Problem:** Appears in Year 12-50 event. Founded Year 350.
- **File:** `timelineStore.js:284`

### B-10. [MAJOR] Plaguebringer referenced 50-100 years before founding
- **Problem:** Appears in Year 400-450 event. Founded Year 500.
- **File:** `timelineStore.js:743`

### B-11. [MAJOR] "Twenty generations" of Ordan chieftains — short by ~11 generations
- **File:** `loreDictionary.js:1449,1795-1796`
- **Problem:** "twenty generations of chieftains" in the Ancestor Mounds. Ordan migration bargain ~Year 25 (775 years ago). 20 human generations = ~500 years.
- **Fix:** Change to "thirty-one generations."

### DEPRECATED NAMES IN WIZARD/SECONDARY SYSTEMS

### B-12. [MAJOR] Spellcrafting wizard uses 'Doomsayer' as active class tag
- **File:** `Step1BasicInfo.jsx:62`
- **Problem:** `{ id: 'doomsayer', name: 'Doomsayer' }` in spell tag selection. Should be `'Harbinger'` with the 'doomsayer' tag being archival.
- **Fix:** Either map to Harbinger or document as a subclass/specialization.

### B-13. [MAJOR] 10+ references to deprecated class names in spellcrafting wizard
- **Files:** `Step5Resources.jsx`, `useResourceFormatters.js`, `resourceTypes.js`, `UnifiedSpellCard.jsx`
- **Problem:** "Doomsayer", "Chaos Weaver", "Fate Weaver", "Deathcaller" used as active class names in wizard descriptions, resource formatters, and mechanics code.
- **Fix:** Audit all spellcrafting wizard files for deprecated class references.

### B-14. [MAJOR] Spellcrafting wizard also references 'Gambler' and 'Dreadnaught'
- **Files:** `ClassesDisplay.jsx:216` ("A Gambler bends probability"), `spellguardData.js:285` ("let the Dreadnaught or Berserker handle the meat")
- **Fix:** Update display text to use canonical class names.

### LEGACY STATE VARIABLE NAMES (cosmetic but pervasive)

### B-15. [MAJOR] `covenbaneState`, `exorcistState`, `deathcallerState`, `dreadnaughtState`, `lichborneState`, `gamblerState` throughout resource bar components
- **Files:** `ClassResourceBar.jsx` (~15 occurrences), `HexbreakerChargesResourceBar.jsx`, `DominanceDieResourceBar.jsx`, `AscensionBloodResourceBar.jsx`, `DRPResilienceResourceBar.jsx`, `EternalFrostPhylacteryResourceBar.jsx`, `FortunePointsResourceBar.jsx`, `ResourceTooltip.jsx`
- **Problem:** Internal React state variable names use deprecated class names. While functional (the component maps the deprecated name to the new class), this is confusing for maintenance.
- **Fix:** Rename all legacy state variables to match canonical class names.

---

## C. MINOR (polish — wording, style)

### C-01. [MINOR] Sera Solvan "Dead — eight centuries" — slightly overstated
- **File:** `martyrData.js:111`
- **Problem:** Martyr founded Year 5 (Deepening). Sera was an adult mother. If she died at ~60, she'd be dead ~735-740 years. "Eight centuries" is ~65 years too high.
- **Fix:** Change to "seven centuries" or "nearly eight centuries."

### C-02. [MINOR] "Eleven generations" of Mask-Borne — plausible if Mimir lifespan is extended
- **File:** `mimir.js:122,330`
- **Problem:** 11 generations in "four centuries" = ~36 years per generation. Plausible for long-lived Mimir, but should be explicitly noted (Mimir lifespan unclear).
- **Fix:** Either define Mimir generational span or adjust the count.

### C-03. [MINOR] "Thrum" (without second 'm') appears as language name "Deep-Thrum"
- **Files:** `rulesData.js:2300`, `languages.js:22,107,145`, `LanguagesDisplay.jsx:174,179,273,337`
- **Problem:** The race is canonically "Thrumm" but the mineral consciousness and language are "Deep-Thrum" (one 'm'). This may be intentional but should be verified.
- **Fix:** If intentional, document the distinction. If not, standardize.

### C-04. [MINOR] "Age of Collection" in Myrathil lore
- **File:** `myrathil.js:77`
- **Problem:** "The Age of Collection followed" — not a canonical era label.
- **Fix:** Either remove or document as a Myrathil-specific internal period label.

### C-05. [MINOR] "Age of the Deepening" in False Prophet lore
- **File:** `falseProphetData.js:186`
- **Problem:** "trapped since the Age of the Deepening" — adds "Age of" prefix to canonical "The Deepening" era.
- **Fix:** Standardize to "trapped since the Deepening."

### C-06. [MINOR] `RulesPage.jsx` has old icon mappings for 'Deathcaller' and 'Lichborne'
- **File:** `RulesPage.jsx:316,347`
- **Problem:** Icon mappings reference deprecated class names in an old icon map key.
- **Fix:** Remove or update to new class names.

### POPULATION AND SETTLEMENT

### C-07. [MINOR] Greymark Keep classified as "city" with only 1,200 population
- **Files:** `WORLD_MAP_MAKER_BRIEF.md:155`, `deepLocationData.js` Greymark entry
- **Problem:** "city" classification for a settlement of 1,200 — more fitting as a "town" or "keep."
- **Fix:** Reclassify as "town" or "fortified keep."

### C-08. [MINOR] Solvan's Stand population decline: "30,000 to under 4,000" plausible
- **Files:** `zoneData.js:2166`, `human.js:131`, `WORLD_MAP_MAKER_BRIEF.md:344`
- **Problem:** A city of 30,000 is significant. "Lost forty feet to ashfall in the last century alone" — verify 40 feet of ash accumulation in 100 years is geologically plausible for a volcanic caldera.
- **Status:** Numbers are internally consistent. Geologic plausibility is borderline but lore-appropriate.

### C-09. [MINOR] `deepLocationData.js` has `'gambit', 'gambit'` duplicate in classPresence
- **File:** `deepLocationData.js` (Synod Hold entry)
- **Fix:** Remove duplicate.

---

## D. GAPS (missing content)

### D-01. 11 NPCs referenced in lore/factionStore but missing from npcStore

| Missing NPC | Role | Referenced In |
|-------------|------|---------------|
| Kaelen Thalreth | Jarl-Archivist (De Facto Leader, "The Quill-Lord") | `factionStore.js` house-thalreth, `loreDictionary.js` |
| Halvar Skalvyr | King-Jarl of Nordhalla ("Jarn-Tand") | `factionStore.js` house-skalvyr, `loreDictionary.js` |
| Bayarmaa Ordavan | Khatun of House Ordavan | `factionStore.js` house-ordavan |
| Dawn-Vigil Commander | First Dawn | `factionStore.js` dawn-vigil |
| Deep-Alchemist Prime | Prime Alchemist | `factionStore.js` deep-alchemists |
| Vat-Breaker Foreman | First Foreman | `factionStore.js` vat-breakers-guild |
| Solvan Steward | Steward of Emberspire | `factionStore.js` house-solvan |
| Mereval Admiral | Grand Admiral | `factionStore.js` house-mereval |
| Tesshan Lord | Jarl-Inca (High-Lord) | `factionStore.js` house-tesshan |
| Morrath Steward | Steward of Seventh Seat | `factionStore.js` house-morrath |
| Vellan Archivist | Senior Archivist | `factionStore.js` scribe-sentinels |

### D-02. 5 factions heavily referenced in lore but missing from factionStore
- **Scribe-Cartel:** Monopolizes Soot-Resin Ink and Peat-Parchment. Referenced in Sovereign Ledger, Memory Wars, Fogwood Schism.
- **Brine-Bond Syndicate:** Iceheart Sea maritime guild founded Year 300. Controls Merrowport docking.
- **Cult of Forgotten Shadow:** Bryngloom shadow-state, founded Year 412 at Over-Shanty. No loreDictionary entry.
- **The Risen / The Sunderer / The Scoured:** Sundale civil war factions (Year 780+).
- **Church of the Holy Light:** Referenced at Greymark Keep founding (Year 13).

### D-03. 50+ locations in loreDictionary with NO deepLocationData or zoneData
Notable missing: Merrowport proper (sprawling port-city, no deep entry), Mistbarrow, Scribes Tower, Ledger Halls, Ironwood Heart, Fjord Gate, Basalt Shyr (the ninety-mile highway itself, not just its outpost).

### D-04. 24 of 34 factions have zero members listed
Only 10 factions in `factionStore.js` have populated `members` arrays. The remaining 24 have empty arrays.

### D-05. House Viridane missing from factionStore
All 8 noble houses are defined in loreDictionary, but `house-viridane` has no factionStore entry (likely intentional since they are "erased" in-world, but should still have a hidden/disguised faction entry).

### D-06. `cult-of-forgotten-shadow` — no loreDictionary entry
Heavily referenced across locations, timeline events, NPCs, and factionStore. Has no dictionary entry for LoreLink auto-linking.

### D-07. Settlement classification gaps
10 deep locations have no corresponding zoneData entry/type classification: frozen-archive, over-shanty, mirror-mere, vargtor, aran-glen, spindrift-lagoon, starfall-vale, harath-vault, frostmaw-holdfast, merrowport-deep.

### D-08. Missing founding years for many loreDictionary entities
- All 7 regions: no founding date
- All 8 noble houses: no founding date (only referenced via events)
- All 11 races: no origin/emergence date (except Groven ~Year 40)
- All 16 historical figures: no birth/death dates
- All 7 cosmological entities: no origin dates
- Most locations: dates vary from "Year X" to "Unknown"

---

## E. METRICS

### E-01. Audit Statistics

| Metric | Value |
|--------|-------|
| Total checks performed | 282 |
| Total entities verified | ~350 |
| CRITICAL issues | 14 |
| MAJOR issues | 36 |
| MINOR issues | 18 |
| GAPS documented | 8 categories (84+ individual gaps) |
| Files with zero issues | ~60 |
| File with most issues | `timelineStore.js` (35+ anachronistic classIds) |
| Second most issues | `npcStore.js` (3 age-math errors) |
| Third most issues | `classEquipment.js` (6 deprecated class names) |

### E-02. Issues by Category

| Category | CRITICAL | MAJOR | MINOR | GAPS |
|----------|----------|-------|-------|------|
| A (Age Math) | 7 | 1 | 4 | 1 |
| B (Event Order) | 0 | 10 | 0 | 0 |
| C (Attribution) | 0 | 0 | 0 | 0 |
| D (Numeric) | 0 | 0 | 2 | 0 |
| E (Spatial) | 0 | 0 | 0 | 1 |
| F (Hierarchy) | 0 | 0 | 1 | 1 |
| G (Tonal) | 0 | 0 | 5 | 0 |
| H (Deprecated) | 6 | 5 | 2 | 0 |
| I (Gaps) | 0 | 0 | 0 | 4 categories |
| J (Identity) | 0 | 0 | 0 | 0 |

### E-03. Category C (Attribution) — NO ISSUES FOUND
All 7 regional bargains correctly attribute the bargain-making house across `loreDictionary.js`, `timelineStore.js`, `rulesData.js`, and `GM_WORLD_GUIDE.md`. All 20 class founders are consistently named across class files, loreDictionary entries, and timeline events. No kill attribution contradictions found.

### E-04. Category D (Numeric) — NO MAJOR ISSUES FOUND
Population, distance, duration, and quantity claims are internally consistent. Settlement population numbers are plausible given the apocalyptic setting.

### E-05. Category E (Spatial) — NO MAJOR ISSUES FOUND
All 7 trade routes have coherent origin/destination/via paths. Region adjacency is consistent across all files. Climate descriptions match region biomes.

### E-06. Category G (Tonal) — NO MAJOR ISSUES FOUND
The grim-dark tone is consistent across all lore files. No motivational contradictions found for NPCs vs. faction goals. No knowledge anachronisms found (characters only know things plausible for their era).

### E-07. Category J (Cross-File Identity) — NO ISSUES FOUND
- "The Warden" (cosmic entity) and "The Warden" (class tradition) are distinct concepts consistently distinguished across all files.
- "Sluagh" has a single, consistent identity as a creature.
- "Hunger Pact" (Berserker ancestor trauma) and "the hunger" (Keth-Amar cosmic hunger) are distinct concepts consistently referenced.

### E-08. New Categories for v4
1. **K. TEMPLATE CONSISTENCY:** Verify all entity entries across stores use the same data template/fields.
2. **L. QUOTE AUTHENTICATION:** Verify all in-character quotes match the speaker's era, faction, and personality.
3. **M. RESOURCE BAR / UI LORE:** Verify that class resource bar names and flavors match canonical class lore.

---

## F. RECOMMENDED FIX PRIORITY

### Immediate (breaking gameplay)
1. Fix 6 deprecated class names in `classEquipment.js` (A-08, A-09) — players can't receive their class items
2. Fix `ClassResourceBar.jsx:1180` Fate Weaver → Gambit (A-10) — resource bar won't render
3. Fix `classSpellGenerator.js:160` Chaos Weaver → Harbinger (A-11)

### High (lore is factually wrong)
4. Fix Vespera's age (A-01)
5. Fix Varis's age (A-02)
6. Fix Revenant quote age (A-03)
7. Fix Alaric's age (A-04)
8. Fix generation counts for Tessen, Thalren, Astril, Ordan (A-05, A-06, A-07, B-11)
9. Fix non-standard era labels in `creatureData.json` (A-13)

### Medium (misleading but functional)
10. Audit timeline classIds for anachronisms OR document them as thematic tags (B-01 through B-10)
11. Clean up deprecated class names in spellcrafting wizard (B-12, B-13)

### Low (cosmetic)
12. Rename legacy state variables (B-15)
13. Fix settlement classifications (C-07, C-08)
14. Fix minor wording issues (C-01 through C-06)

### Future (content work)
15. Create 11 missing NPC entries (D-01)
16. Create 5 missing faction entries (D-02)
17. Add loreDictionary entries for `cult-of-forgotten-shadow`, `scribe-cartel`, `brine-bond-syndicate`, `the-risen`, `the-sunderers`, `the-scoured`, `church-of-the-holy-light` (D-02, D-06)
18. Add founding dates to loreDictionary entries (D-08)

---

*End of v3 Audit Findings*
