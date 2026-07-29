# CANON DECISIONS — RATIFIED 16 July 2026

These 5 decisions were ratified by the worldowner after the two-pass lore audit. They amend `docs/CORE_LORE_FRAMEWORK.md` and are the authoritative resolution for every downstream fix. Where any data file conflicts with these, the data is wrong.

---

## D1. The Warden entity — "Aethil" is the true name
- **"Aethil"** (pronounced AY-thil) is the entity's proper noun / true name.
- **"The Warden"** is the common title / descriptor used in prose.
- Usage rule: either is acceptable in narrative; the entity entry is keyed under `aethil`/`the_warden` (both resolve to the same being). This cleanly separates the **Aethil/Warden entity** from the **Warden class** (founded by Alaric).
- Action: ratify "Aethil" in `CORE_LORE_FRAMEWORK.md` §1.1.

## D2. "Solbrand" = the Solvan knightly order
- **The Order of Solbrand** is a human Solvan military order (the sun-knights) — a *faction*, not a star, not a deity, not the faith.
- It is **distinct from**: **Sol** (the bound star), the **Embers of Sol** (the parent faith: Dawn Vigil / Risen / Scoured), and **Aex**.
- Action: every standalone "Solbrand" usage that means Sol, the faith, or a divine power must be replaced with the correct term. "Solbrand" survives only as the order's name.

## D3. Cosmic-entity boundaries (no more conflation)
- **Morvane = the Watcher = the Keeper of the Last Threshold** — ONE entity (culture-named). The world's conscience; boundary of life/death & memory/oblivion.
- **The Root-Veil** is **NOT an entity** — it is the Vreken sacred **mycelial ancestor-network** (a system/place/substrate), not the Watcher, not Sol, not a being.
- **The Dead Moon** is a **distinct dormant star** — unrelated to and unconnected with Keth-Amar's origin; Keth-Amar merely nested in its corpse.
- **Solbrand** = per D2. **Sol** = the bound star. None of these are each other.
- Action: remove every equation that collapses any of the above together (Morvane=Root-Veil, Solbrand=Root-Veil=Sol, Watcher=Dead-Moon, etc.).

## D4. Cult of Forgotten Shadow — single canonical origin (synthesis)
- Founded at **Over-Shanty** by **Vreken exiles, coven-mages, and heretical animists** who reject the Neth–Vreken Reincarnation Bargain.
- Later joined by **Dawn Vigil defectors** who learned that Monolith reassembly summons Keth-Amar (not Sol).
- Doctrine: the deep silence creeping through the burial mounds is the natural return to a primordial, starless dark; they **channel Keth-Amar's whispers** through the cracked seal and embrace the convergence.
- Base + leadership = Vreken-exile/heretic; recent infusion = Vigil defectors; relationship to Keth-Amar = willing channel, not a separate Voice.
- Action: collapse all 4 divergent origins into this one. **Remove "Natalie Seline"** (Warcraft IP) entirely.

## D5. Seven houses is hard canon
- **Exactly 7 original houses signed the Binding:** Thalreth, Skalvyr, Tesshan, Solvan, Mereval, Ordavan, **Viridane** (the original 7th, who refused at the Breach).
- After the Breach the 6 remaining elevated **Morrath** as a substitute 7th → 7 *official* houses including Morrath.
- The **Briaran "8th house"** survives **only** as a Briaran folk self-title / partisan belief (they count Viridane as 7th and themselves as 8th). It is never narrator fact.
- Action: every objective/"narrator" statement of "eight houses signed" is corrected to 7. "Eight houses" is permitted only inside clearly-labeled Briaran belief/propaganda.

---

# CANON DECISIONS — RATIFIED 25 July 2026 (v4 / Florae-schism wave)

## D6. Grimmwood witch-doctor — canonical name locked
- **True fae name: Bri-Yrn** (pronounced BREEN, hard single-syllable closing).
- **Colloquial title: "The Grimm-Mother"** — the name shunning locals, Thalren ledger-wards, and even Trueborn Florae use because they will not speak the true name aloud.
- **Identity:** A true Fair Folk hermit (pre-Wyrd fae, *not* Florae) dwelling deep in Grimmwood, shunned by all surrounding peoples. Likely broker/keeper of the original fae-contract that transformed House Viridane into the Florae.
- **Naming-convention rationale:** "Bri-" prefix ties her to the fae-contract tradition also borne by Bri-Vessela and the briar/Florae lineage; the dual-name pattern (true fae name + fearful title) matches the established world voice (cf. The Thorn-Speaker, The Salt-Scarred, Saren-Vel).
- **lore.json key:** `bri-yrn` (character type, region: frostwood-reach). Use both the true name and the title in the entry so either resolves.
- **Action:** unblocks the Florae schism (D7, pending) — Viridian + Oken subrace lore and `florae.js` refactor may now reference her by name.

## D7. Florae schism — Viridian + Oken subraces ratified
- **Schism origin:** The fae-contract that transformed House Viridane took TWO PRICES. The Viridian paid in thorns (forearms bristle with living barbs = physical mark of the fae-contract, deep-grove dwellers, reject Fog Compact). The Oken paid in timber (crude branch-arms of oak/birch/willow, sap-filled veins, plant Sapling-Sprouts biologically). Both descended from House Viridane; one house, two transformations, one broker (Bri-Yrn).
- **Type field:** New `subrace` type introduced to lore.json (parallel to existing one-offs `subfolk`/`subculture`). Used for `viridian` and `oken`.
- **florae.js refactor:** Single `florae_unified` subrace replaced with `viridian` (3 traits: Thorn-Barb Bristle, Unwritten Word, Fog-Compact Refusal; +Dex+Wis+Cha/−Con) and `oken` (uses race's sharedTraits; keeps original florae_unified content with id 'florae_unified' for backwards-compat).
- **Wild/Shorn lifestyle axis** retained as a personal-lifestyle choice WITHIN each subrace (not the same as the Viridian/Oken bloodline split).
- **Action:** 3 new lore.json entries authored (viridian, oken, bri-yrn). florae.js refactored. Patched briaran/thorn-speaker/grimmwood to reference the schism.

## D8. CANON_REFERENCE.md v4 ratification + Fredløse spelling
- **v4 Monolith myth ratified into CANON_REFERENCE.md:** Sections 1 (Watcher), 3 (Breach), 5 (FULL restructure: 6 true corrupted + 1 false shard [Morrath] + 1 true seventh fragment [Viridane, cleansing key]), 12 (Seven Secrets) all updated.
- **"Fredløse" canonical spelling confirmed** (proper Old Danish with U+00F8). The ASCII "Fredlose" form was a transcription error. 21 instances fixed across 9 files (lore.json, LORE_STYLE_GUIDE.md, 2 race-data .js files, 5 audit-note .md files).
- **Encoding convention:** JSON files use `\u00F8` escape for non-ASCII chars (pure ASCII files, immune to CP1252 round-trip mojibake). `.js`/`.md` files use raw UTF-8 chars directly.

## D9. Mimir subrace canonicalization — Arch + Broken Mimir (2 only)
- **Only 2 subraces** confirmed (audit-note reference to "Veiled/Tethered/Untethered" 3-subrace model was incorrect / superseded).
- **Display names:** Arch Mimir (key=`veiled`) + Broken Mimir (key=`tethered`). Renamed Fractured→Broken for thematic clarity.
- **lore.json mimir prose rewritten:** Old "Masked/Woven/Unwoven" 3-group reference dropped. New prose reflects the 2-subrace reality.
- **mimir.js:** 13 instances of "Fractured Mimir" renamed to "Broken Mimir".

## D10. Neth + Myrathil subrace display names canonicalized
- **Neth:** Descriptor titles canonical (High Neth / Hallowed Neth / Pale Neth). Proper-noun forms (Velun/Kessen/Drun) preserved parenthetically. lore.json neth entry updated throughout (summary + 3 paragraphs).
- **Myrathil:** -ling morphology canonical (Shoreling/Deepling/Riverling). lore.json summary updated.

## D11. Subrace representation migration + Human top-level entry
- **Subrace migration:** Old standalone-subrace lore.json entries (`velun`, `merryn`, `rime_born`) migrated from `type=race` to `type=subrace` for consistency with the post-D6/D7 convention.
- **Human top-level entry authored:** New `human` lore.json entry (id=human, type=race, 17 relatedTerms cross-referencing 7 subraces + 7 houses + Breach/Warden/Aex). Humans were previously represented only via 7 regional subraces in human.js + one standalone merryn entry.

## D12. Seelie Accord direction — B (Splintered) ratified
- **Canon:** The Seelie Accord was a unified pre-Breach fae court governing the Frostwood Reach via mutual-obligation contract (not a throne). The Breach broke the obligations; the Accord "shattered like a mirror" into competing factions.
- **Three named splinter factions:**
  1. **The Hedgerow** (Pooka-led) — claims the guardianship mandate; watches the wild places
  2. **The Revel Court** (Wyrd-corrupted) — claims the rites; ritualizes seasonal celebrations as traps (see `the_revel`)
  3. **The Solitary Ones** (Bri-Yrn and hermits like her) — claim nothing; pre-date the Accord and outlast it
- **Bri-Yrn confirmed apolitical:** Authority from age/craft, not court position. She "never sat in the Seelie Accord." Thalren ledger-wards listing: `"fae — political affiliation: none"`.
- **Thalren listing convention for splinters:** `"fae — political affiliation: contested"`.
- **Action:** New `seelie_accord` lore.json entry authored (type=faction, ~370 words). `the_revel` patched to reference Seelie Accord by name and self-identify as a splinter. `bri-yrn` patched with apolitical clarification. `pooka` cross-referenced.

---

## SESSION-WIDE NOTES (25 Jul 2026)

**Final lore.json state:** 316 entries (was 311 at session start). +5 new top-level entries: `viridian`, `oken`, `bri-yrn`, `human`, `seelie_accord`. Size 572KB → 605KB (+33KB of enriched prose + new canon). 0 mojibake residue. 0 broken cross-references. 0 PS internal property leaks.

**Prose enrichment completed:** All 16 Wyrd creatures flagged in the audit note (5 round-1 majors + 11 round-2 templated stubs) now have hand-crafted prose matching gref/gambrel/stel voice quality. 47 new relatedTerms cross-references added in round 2 alone.

**Audit task CANCELLED:** "Delete src/data/creatureData.json (orphaned narrative source)" — VERIFIED NOT ORPHANED. Has 2 active runtime imports (BestiaryDisplay.jsx + EnhancedCreatureInspectView.jsx) + 172 identifier refs. Original audit's "NO runtime imports" claim was wrong / stale.

**Lessons learned this session:**
- PowerShell 5.1 reads script files without UTF-8-BOM as CP1252, corrupting em-dashes and other non-ASCII chars in here-strings. Mitigation: keep scripts pure-ASCII, build non-ASCII at runtime via `[char]` codes, then run `fix-mojibake.ps1` after edits.
- "Orphan file" audit claims must be verified via grep/import-check before deletion, even when an audit explicitly says "no runtime imports" — codebases evolve.
- `$LASTEXITSTATE` is unreliable for native commands in some PowerShell 5.1 sessions. Use ES-module import via `node -e "import(...)"` for syntax validation instead.

---

# CANON DECISIONS — RATIFIED 26 July 2026 (Dimension 2: cross-reference integrity wave)

## D13. Region keys canonicalized — long forms only
- **Decision:** The short-form region values (`iceheart`, `cragjaw`, `bryngloom`) are NON-CANONICAL; the long forms (`iceheart-sea`, `cragjaw-peaks`, `bryngloom-forest`) are the sole canonical region keys.
- **Rationale:** The short forms had 0 lore.json entries, appeared in only 13 of ~200+ entries (all creatures), and every other entry (regions, locations, houses, creatures) used the long forms. The COMPREHENSIVE_LORE_AUDIT_PROMPT_v2.md §2 region list's inclusion of both forms was vestigial. Long forms have dedicated region entries; short forms were shorthand that produced dead `relatedTerms` cross-refs.
- **Action:** Normalized 13 creatures (4 iceheart + 5 cragjaw + 4 bryngloom) — both their `region` field and their `relatedTerms` entry repointed to the long forms (26 token replacements). lore.json now uses only long-form region keys.
- **Cross-references:** affects pelagos, egbere, gaki, kamaitachi, tengu_scout, vodyan, spume_of_the_drowned, writ_of_passage, storm_crows, sump_scrabs, grandmother_of_the_bog, debt_revenant, cycle_eater.

## D14. Human subrace relatedTerms — dead cross-refs removed
- **Decision:** Remove the 5 dead subrace cross-refs (`thalren`, `tessen`, `solvarn`, `ordan`, `morren`) from the `human` entry's `relatedTerms`. Retain `skald` (type=subculture) and `merryn` (type=subrace), which resolve, plus the 7 houses + Breach/Warden/Aex.
- **Rationale:** The 5 keys exist only as subrace IDs in `human.js`; they have no lore.json entries, so the cross-refs were dead tooltips. Worldowner chose removal over authoring 5 new subrace entries (deferred to a future Dimension 18 prose-enrichment pass if desired). `human.relatedTerms` now has 12 valid cross-refs (was 17, 5 dead).
- **Action:** lore.json `human.relatedTerms` reduced 17→12.
- **Cross-references:** D11 (authored the human entry with the original 17 relatedTerms). Note: `skald`=type=subculture vs `merryn`=type=subrace is a minor type-field inconsistency flagged for Dimension 14.

## D15. Crusader NPC LoreLinks — stripped to plain text
- **Decision:** Strip the `<LoreLink>` tooltip wrapping from `hierophant-aethelgard` and `lord-captain-vane-solvan` in `crusaderData.js`; keep both names as plain text.
- **Rationale:** Neither NPC has a lore.json entry, so the LoreLinks produced dead tooltips. Matches the Session-2 pattern for un-entry'd flavor NPCs. Hierophant Aethelgard (canon-named in §7, referenced across sundale/house_solvan/dawn_vigil/the-sundale-civil-war) and Lord-Captain Vane Solvan (minor fallen founder) can be elevated to full entries in a future Dimension 18 pass if desired.
- **Action:** `crusaderData.js` `livingOrder.founder.name` + `livingOrder.currentLeader.name` converted from `<LoreLink termId="...">Name</LoreLink>` to plain `Name`.
- **Cross-references:** Crusader is a live `comingSoon: true` class (registered in `classes/index.js`); not in CANON_REFERENCE §9 class list — its canonical-class status is unaddressed (outside Dimension 2 scope; flagged for Dimension 6).
