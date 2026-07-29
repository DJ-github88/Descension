# LORE FIX — RESOLUTIONS LOG
**Session:** 16 July 2026 · Canon decisions in `DECISIONS.md`. All edits re-verified to parse (JSON valid; all JS modules pass `node --check --input-type=module`).

## ✅ RESOLVED — SESSION 2: stale data-copy sync (STEP 1)
- **Live location confirmed:** `vtt-react/public/data/` (Vite serves `/data/*.json` via `src/data/versions.js:9-12`; every root `package.json` script `cd`s into `vtt-react`/`server`; socket.io server doesn't serve these files). Root `D:\VTT\public\data\` referenced only by scratch `_verify_lore.mjs/.cjs` (already flagged "needs rewrite" — TODO 3.8).
- **Decision (user, 16 Jul 2026):** sync root ← vtt-react (keep both in sync; do NOT delete vestigial root copy yet).
- **Synced:** root `lore.json` (C57D02CE…→3ACFBA3A…) and `rules.json` (672B3E1A…→C1D898D1…) overwritten from `vtt-react/public/data/`.
- **Already identical (untouched):** `creatures.json` (BEA1589F…) · `abilities.json` (8BB4F9C0…).
- **Verified:** all 4 MD5 pairs now IDENTICAL; all 4 JSON files parse (`ConvertFrom-Json`).

## ✅ RESOLVED — SESSION 2: spell-dispatch / spec-ID scheme (P2-2)
Live data `ALL_CLASS_SPELLS` (powers character creation + level-up spell pick in `progressionSlice`/`infoSlice`/`useClassSpellLibrary`/`LevelUpChoiceModal`) was stamping Harbinger & Martyr spells with **non-existent specialization IDs**, silently breaking spec filtering.
- **`classSpellGenerator.js`** — `determineChaosWeaverSpecialization`: `chaos_dice`/`entropy_control`/`reality_bending` → canonical Harbinger `wild_prophet`/`deaths_seer`/`fate_rift` (prefers the spec tag every Harbinger spell already carries, then heuristic). `determineMartyrSpecialization`: `redeemer`/`avenger`/`protector` → canonical Martyr `redemption`/`zealot`/`ascetic` (healing→redemption, damage→zealot, defensive→ascetic; +`ironclad` if tagged). `getElementTypeForSpecialization` map: swapped the 3 stale Martyr keys for canonical (+`ironclad`→ember, `zealot`→ember) and added Harbinger `wild_prophet`/`deaths_seer`→wyrd, `fate_rift`→storm.
- **`classSpellCategories.js`** — Martyr section: added the missing 4th spec `ironclad` (was only redemption/zealot/ascetic). All 3 files now agree (martyrData / classSpellCategories / classSpellGenerator).
- **Verified:** both files pass `node --check --input-type=module`; 15/15 isolated logic cases return canonical IDs; confirmed real Harbinger spells carry spec tags (tag-preference fires).
- **Left (dead code — ZERO callers, no runtime impact):** `spellTemplates.js:adaptTemplateForClass` (24 non-canonical class keys; graceful `mana` fallback; never imported) and `resourceTypes.js:getResourcesForClass` + unreachable `classRestriction` entries `harrow`/`monk`/`hexer`/`warlock`/`dreadnaught` (never imported; `dreadnaught`/`harrow`/`hexer` are intentional deprecated/in-world tradition names per guardrail). Full canonical-class remapping of these would be a large data task with wrong-mapping risk for zero behavioral gain.

## ✅ RESOLVED — SESSION 2: pulse ordinal typo (F4 Layer A)
- **`timelineStore.js`** `event-last-rebirth` (Year 660): description said *"The **fifty-fifth** pulse"* while `REBIRTH_CYCLES` (cycle 65, Year 660) and the same sentence's *"sixty-five-pulse data set"* say 65 → **"fifty-fifth"→"sixty-fifth"**. Resolves the headline F4 "Year-660 labeled both 55th & 65th" self-contradiction. Verified `node --check --input-type=module`.
- **Still open (F4 Layer B — creative, DEFERRED per user 16 Jul):** `REBIRTH_CYCLES` cadence is bunched — cycles 1–63 cram into Years 12–226 (~3yr spacing) then jump to 645–660, contradicting canon §6 (8–20yr spacing, ~12avg, 65 pulses 40%→0% over ~648yrs). Fixing = re-spacing milestones across the full timeline AND rewriting each `significance` (they cite era-specific events, e.g. "Dawn Vigil formalizes" at cycle 20 but Dawn Vigil is ~300yr post-Breach). Also cycle 55 significance duplicates cycle 65's "scream has stopped." Left for a dedicated creative pass.

## ✅ RESOLVED — SESSION 2: timeline classIds anachronisms (F9, full pass)
**Founding-year table ratified** (present ≈ Y800). Hard-canon §11 where given; the timeline's OWN founding-summary events (`event-first-ebbing-traditions`, `event-contraction-traditions`, `event-squeeze-traditions`, `event-war-thousand-screams`) governed the rest — they superseded my initial inferences (corrected: **lunarch ~80, minstrel ~100, arcanoneer ~60, chronarch ~300**). Augur = Deepening-era (~Y0) per RATIFIED §11 (the stale "Y70" in 4_CLASSES.md CL-06/CL-07 was overruled).
- **Rule applied:** remove a classId when `event.year < founding.year` AND gap > 50yr AND the event narrative does NOT explicitly name the class/founder/founding act. Keep era-summary founding events, narrative-supported precursors/origins, and post-founding tags.
- **Removed 16 anachronistic tags across 11 events** (`timelineStore.js`): sol-deepening→harbinger · keth-amar-breach→inquisitor,lunarch · remaining-bargains→animist,gambit,shaper · emberspire-eruption→berserker · myrathil-spawning→minstrel · brook-emerge→gambit · mimir-rupture→shaper · toll-wars→shaper · memory-wars→toxicologist,inquisitor · vreken-overlit-epidemic→plaguebringer · cult-founding→falseProphet,revenant.
- **Kept (intentional):** the 4 era-summary `-traditions` founding events; precursors (berserker@glacier-bargain & @hunger-winter & @bloodhammer-migration, shaper@first-thermal-war, pyrofiend@emberspire-eruption); origins (lunarch@viridane-flight, warden@vat-breakers-revolt, arcanoneer@first-contract, gambit@brine-bond-syndicate gap 50); augur throughout.
- **Verified:** `node --check --input-type=module` passes; re-scan confirms only intentional/narrative-supported tags remain.

## ✅ RESOLVED — SESSION 2: broken NPC/location LoreLinks (P2-6 / Tier 6)
Comprehensive scan of every `LoreLink termId` in `src` vs lore.json keys (93 unique termIds; the 7 broken ones matched the handoff list exactly — `monoliths` was already fixed→`sundered_monoliths` in the prior session). All 7 dead tooltips resolved:
- **Repointed** `solvarn`→`house_solvan` (2 genuine "Solvarn"-text uses in `gambitData.js`, `falseProphetData.js`) — points the demonym at the canonical Solvan house entry.
- **Stripped** (kept inner name as plain text): 5 one-off flavor NPCs — `bayar-wind-throat` (animistData ×2), `eira_bone_reader`, `mother_ysen`, `ignis_the_watcher` (augurData ×3), `helgar_the_rejector` (augurData) — plus `ironwood-palisade` (inquisitorData) and the mis-tagged "Ash-Dwellers" link (falseProphetData). Rationale: minor figures with no canonical entry; `bayar-wind-throat` intersects the unresolved Animist-leader divergence (CL-02: animistData "Bayar Wind-Throat" vs compendium "Convenor Sera Three-Scars") so no entry invented. Richer entries can be added in a later content-enrichment pass.
- **Verified:** all 5 class files pass `node --check --input-type=module`; re-scan = 0 real broken termIds (3 remaining hits are false positives: `${item.id}` auto-linker template + regex fragments in component files).

## ✅ RESOLVED — SESSION 2: broken NPC/location LoreLinks (P2-6 / Tier 6)
Comprehensive scan of every `LoreLink termId` in `src` vs lore.json keys (93 unique termIds; the 7 broken ones matched the handoff list exactly — `monoliths` was already fixed→`sundered_monoliths` in the prior session). All 7 dead tooltips resolved:
- **Repointed** `solvarn`→`house_solvan` (2 genuine "Solvarn"-text uses in `gambitData.js`, `falseProphetData.js`) — points the demonym at the canonical Solvan house entry.
- **Stripped** (kept inner name as plain text): 5 one-off flavor NPCs — `bayar-wind-throat` (animistData ×2), `eira_bone_reader`, `mother_ysen`, `ignis_the_watcher` (augurData ×3), `helgar_the_rejector` (augurData) — plus `ironwood-palisade` (inquisitorData) and the mis-tagged "Ash-Dwellers" link (falseProphetData). Rationale: minor figures with no canonical entry; `bayar-wind-throat` intersects the unresolved Animist-leader divergence (CL-02: animistData "Bayar Wind-Throat" vs compendium "Convenor Sera Three-Scars") so no entry invented. Richer entries can be added in a later content-enrichment pass.
- **Verified:** all 5 class files pass `node --check --input-type=module`; re-scan = 0 real broken termIds (3 remaining hits are false positives: `${item.id}` auto-linker template + regex fragments in component files).

## ✅ RESOLVED — SESSION 2: Solbrand thermal resource → "Sol's Breath" + Order of Solbrand creation (D2)
**Rationale:** D2 ratified "Solbrand = the Solvan knightly order (sun-knights), a faction, distinct from Sol / Embers of Sol / Aex." The prior lore.json `solbrand` entry described the *thermal current* (resource). Per D2, "Solbrand" must mean only the Order; the thermal current needed a canonical name.

**Changes:**
- **lore.json (both copies):** 
  - `solbrand` (resource) → renamed `sols_breath` ("Sol's Breath") with full resource entry
  - New `solbrand` entry created: `type: "faction"`, the Order of Solbrand (sun-knights, Solvan military order, distinct from Dawn Vigil / Embers of Sol)
- **emberth.js**: All 30+ "Solbrand" → "Sol's Breath" (with ID fixes: `solbrand_pulse_korr` → `sols_breath_pulse_korr`, etc.)
- **augurData.js**: Korr Emberth reframe + signatureAbility + crisisAngle updated to "Sol's Breath"; title "Solbrand-Reader" → "Sol's Breath-Reader"
- **martyrData.js**: Korr Martyr reframe updated to "tend Sol's Breath"
- **factionStore.js**: Added `order-of-solbrand` faction entry (full entry with leader `grandmaster-solbrand`, 4 captains, HQ `sun-keep`, relationships to `house-solvan`, `dawn-vigil`, `covenant-of-the-scar`, `cult-of-forgotten-shadow`)
- **classSpellCategories.js**: Martyr path renamed `Solbrand Path` → `Sol's Path`
- **inquisitorData.js**: `ironwood-palisade` LoreLink stripped (no entry)
- **Solvarn repoint**: 3 LoreLinks `solvarn` → `house_solvan` (2 "Solvarn" texts in gambitData/falseProphetData repointed; 1 mis-tagged "Ash-Dwellers" stripped)

**Verified:** all edited files pass `node --check --input-type=module`; both lore.json copies synced and valid.

## ✅ RESOLVED (this session)

### Tier 0 — Canon ratified
- `docs/CORE_LORE_FRAMEWORK.md`: Aethil=true name (§1.1); entity boundaries Morvane=Watcher / Root-Veil distinct / Solbrand=order / Dead-Moon distinct (§1.5); Cult of Forgotten Shadow synthesis origin (§7); hard-canon 7 houses (§4).
- `.lore-audit-work/DECISIONS.md`: all 5 decisions logged.

### Tier 1 — Gameplay bugs
- `LoreSidebar.jsx`: `EXAMPLES_ENABLED` true→false (kills demo-location pollution).
- `startingEquipmentData.js`: duplicate `starter-oil-flask` id → second renamed `starter-lantern-oil`.
- `classEquipment.js`: 10 orphan items (Justicar×5, Oathkeeper×5) → remapped to **Spellguard** (now grantable).
- `animistData.js`: broken `termId="monoliths"` → `sundered_monoliths`.

### Tier 2 — Narrative contradictions (lore.json unless noted)
- Still-Heart: "false decoy" → genuine heart-fragment (per canon §8.2).
- Fexric origin: inverted "Fexric are an accident of the Groven vats" → "Fexric created the Groven ~800 yrs ago" (summary + fullEntry).
- Cult of Forgotten Shadow: collapsed to the D4 synthesis (both lore.json references: cult entry + keth_amar entry).
- Watcher/Dead-Moon: removed "dreaming consciousness of the dead moon" conflation; Watcher reframed quiescent (not freely bargaining).
- Aex: timelineStore Binding narrative — "does not volunteer / hunt Aex / flay alive" → "volunteered / Solvan wielded the knife / he sang" (A1). "eight noble houses" → "seven" (F1).
- Shaper founder: `shaperData.js` Torin → **Veyra** (Torin retained as the sculpt-tradition root).
- Kor-Vasseth: age 431→247, "four centuries"→"two centuries" (Revenant founded ~Y550).
- Scathrach: `pyrofiendData.js` "born with the Breach / not ancient" → ancient, Binding-origin, rejected Keth-Amar.
- Sereth: lore.json death cause "shame at his imperfect creation" → "died of its own contradictions"; Mimir masks "heartwood, storm-glass, or pine" → "heartwood or storm-glass".
- Vespera: lore.json summary "eight-century" → "three-century".
- Thalreth bargain attribution: "bargain with Aethil" → "Dark Bargain with Keth-Amar" (lore.json ×2).
- "Eight houses" objective errors fixed: `rules.json` (Viridane "8th noble family"→"original 7th signatory"; Skalvyr "Aethil bargain"→"Dark Bargain with Keth-Amar"); `backgroundData.js` groveWarden long+short+hook (×3) → canon 7-house framing.
- Merged-class count: `THEMATIC_AUDIT.md` "6 merged concepts" → "8".

### Verified NON-issues (no change — would have broken things)
- `falseProphet` is the consistent camelCase *code classId* (separate namespace from snake_case lore termId) — not a termId bug.
- `rules.json` `"the-wyrd"` is a rules-nav section id, not a lore join-key.
- "Fexric" vs "Fexrick": intentional convention (`fexrick.js:2-5` — Fexrick=collective noun, Fexric=adjective), not a naming error.

---

## ⏳ DEFERRED — needs creative work or careful code surgery (next sessions)

### Creative rewrites (Tier 3 + creative Tier 2)
- **Animist talent tree**: Vodou loa (Baron Samedi etc.) → canon ancestors; founder "no three founders" → Kael/Nyssa/Theron.
- **Minstrel talent tree**: reskinned to "Revel Sylvan" → restore Mereval/tide/Lyris hook.
- **Harbinger talent tree**: Keth-Amar as willing patron → adversarial predator.
- **Martyr talent tree**: founder "Sundale" → Sera Solvan; patron "Solbrand" → Sol.
- **briaran.js** race-file opening: "eight houses / the other seven families" voice-rewrite to canon 7.
- **Augur founding**: placed at Deepening/Year-3 → ~Year 70 (backstory shift across augurData + compendium + GM guide).
- **Dawn Vigil rationale**: "assemble so no one else does" → "assemble to bind Keth-Amar" (lore.json + factionStore).
- **NPC contradictions (need decisions)**: Vesper race/gender (Neth+she vs Morren-Thalren+he); Saren-Vel alive-vs-dead; "Grand Admiral Varis" name collision with Varis the Trembling (rename the admiral).
- **Subrace scheme unification**: Mimir (Veiled/Tethered/Untethered vs Masked/Woven/Unwoven); Myrathil (Shoreling/Deepling/Riverling vs Shore/Deep/Brook) — needs a canonical-scheme decision, then race-file rewrite.
- **Inquisitor "Covenbane"** boilerplate (talentTrees) → Inquisitor; **dead `talentTrees/index.js`** phantom classes (Inscriber/Witch Doctor/Primalist).

### Bulk flavor/IP cleanup (Tier 5) — large
- ~803 real-world mythology proper-noun strings (creatures: Fenrir/Tiamat/Strigoi/"Yokai" etc.) + ~20 unratified polytheistic deities.
- D&D IP leakage: `lootItemsData.js` (dwarves/elves/orcs/goblins, "Runelord Thrain"); `summonableTokens.js` Inquisitor fiends (Imp/Pit Fiend/Balor/Demon Prince).
- Public `creatures.json` ↔ src `creatureData.json` drift ("Irish/Gaelic" vs "Skaldic").
- Era-label prose echoes; remaining entity-conflation flavor ("Solbrand" as deity/relic in creatures, 34×).

### Code surgery (needs own effort + tests)
- **Spell-dispatch** (P2-2): `determineChaosWeaverSpecialization`/`determineMartyrSpecialization` return non-existent spec IDs; `spellTemplates.js:adaptTemplateForClass` keyed on 24 non-canonical classes; unreachable `resourceTypes.js` restrictions; Martyr spec divergence across 3 files.
- **Timeline `classIds` anachronisms**: ~22 events tag classes before their founding years (judgment needed per tag).
- **Timeline pulse math**: Year-660 pulse labeled both 55th & 65th; cadence packs 63 pulses into 214 yrs.
- **6 broken NPC LoreLinks** (`bayar-wind-throat`, `eira_bone_reader`, `helgar_the_rejector`, `ignis_the_watcher`, `mother_ysen`, `ironwood-palisade`, `solvarn`) → create lore.json entries (Tier 6) or strip links.

### Content gaps (Tier 6)
- Missing NPCs: Bayarmaa Ordavan (both stores) + 7 npcStore stubs (Deep-Alchemist Prime, Vat-Breaker Foreman, Solvan/Mereval/Tesshan/Morrath Stewards, Vellan Archivist).
- 41 of 49 factions have empty `members: []`.
- Solbrand Order has no faction entry; 6 social castes exist only as lore concepts.

---

## FILES TOUCHED (this session)
`docs/CORE_LORE_FRAMEWORK.md` · `vtt-react/public/data/lore.json` · `vtt-react/public/data/rules.json` · `public/data/lore.json` (root — synced in S2) · `public/data/rules.json` (root — synced in S2) · `vtt-react/src/store/timelineStore.js` · `vtt-react/src/store/npcStore.js` · `vtt-react/src/store/factionStore.js` · `vtt-react/src/data/classes/shaperData.js` · `vtt-react/src/data/classes/pyrofiendData.js` · `vtt-react/src/data/classes/animistData.js` · `vtt-react/src/data/equipment/classEquipment.js` · `vtt-react/src/data/startingEquipmentData.js` · `vtt-react/src/data/backgroundData.js` · `vtt-react/src/data/THEMATIC_AUDIT.md` · `vtt-react/src/components/world-map/LoreSidebar.jsx` · `vtt-react/src/data/classSpellGenerator.js` (S2: spec-ID scheme) · `vtt-react/src/data/classSpellCategories.js` (S2: +ironclad Martyr spec) · `vtt-react/src/store/timelineStore.js` (S2: F4 Layer A — 55th→65th pulse ordinal) · `vtt-react/src/data/classSpellGenerator.js` (S2: spec-ID scheme) · `vtt-react/src/data/classSpellCategories.js` (S2: +ironclad Martyr spec) · `vtt-react/src/store/timelineStore.js` (S2: F4 Layer A — 55th→65th pulse ordinal) · `vtt-react/src/data/classes/animistData.js` (S2: LoreLink fix) · `vtt-react/src/data/classes/augurData.js` (S2: LoreLink fix) · `vtt-react/src/data/classes/inquisitorData.js` (S2: LoreLink fix) · `vtt-react/src/data/classes/gambitData.js` (S2: LoreLink fix) · `vtt-react/src/data/classes/falseProphetData.js` (S2: LoreLink fix) · `vtt-react/src/data/classes/augurData.js` (S2: Sol's Breath rename) · `vtt-react/src/data/races/emberth.js` (S2: Sol's Breath rename) · `vtt-react/src/data/classes/berserkerData.js` (S2: Sol's Breath rename) · `vtt-react/src/data/classes/martyrData.js` (S2: Sol's Breath rename) · `vtt-react/src/data/races/emberth.js` (S2: Sol's Breath rename) · `vtt-react/src/data/backgroundAbilities.js` (S2: Sol's Breath rename) · `vtt-react/public/data/lore.json` (S2: sols_breath + solbrand faction) · `vtt-react/src/store/factionStore.js` (S2: order-of-solbrand)

---

## ✅ RESOLVED — CREATIVE PASS CHUNK 2 (talent trees + Dawn Vigil + briaran)

- `martyr.js` talent tree: "Sundale"→"the Martyr", "Solbrand"→"Sol" throughout (~40 refs) — founder/patron now canon (Sera Solvan / Sol).
- `inquisitor.js` talent tree: "The Covenbane purges with fire that remembers Sol" → "The Inquisitor purges with cold iron that remembers the Wyrd's first name" (×7).
- `animist.js` talent tree: Vodou loa (Baron Samedi / Simbi / Erzulie / Triune Devourer / death loa) → canon ancestor-spirits (Bone-Choir / Spore-Mothers / Rune-Singers / Triune Ancestors). Mechanics + `requires` ids preserved.
- `briaran.js`: cardFlavor + description + overview openings corrected (8 houses → 7; Viridane = original 7th signatory; Briaran voice preserved).
- Dawn Vigil rationale (`lore.json` + `factionStore.js`): "assemble so no one else does" → canon "reassemble to draw Keth-Amar down and bind it as Aex was bound" (§7).
- `talentTrees/index.js`: removed 3 phantom import blocks (Inscriber / Witch Doctor / Primalist — source files don't exist; nothing imported the symbols).

## ⏳ STILL DEFERRED (creative / decisions / code)
- **DEEP RESKIN BUCKET: ✅ COMPLETE**
  - briaran `epicHistory` — Binding/Breach conflation fixed; 7 houses; Aex willing.
  - Harbinger tree — 5 Keth-Amar-deifying capstones → adversarial-parasite framing.
  - Inquisitor tree — demon-binding → **Wyrd-hound binder** (Shadow Legion→Wyrd Pack, Demon Cyclone→Wyrd Cyclone, Infernal General→Pack Alpha, Demon Prince→Hollow Sovereign; all icon/id/mechanics/DD preserved).
  - Minstrel tree — forest → **Iceheart tide & storm** (Revel Sylvan/oaks/leaves → waves/gales/Mereval deep/Lyris/tide-song across 43 descriptions; musical terms + mechanics intact).
  - Augur founding — **Deepening-era ratified** (lore was correct; corrected the CANON_REFERENCE "Year 70" inference — no lore change).
- **NPC contradictions**: ✅ DONE (Vesper=Velun Neth female; Saren-Vel=dead; Admiral→Osric).
- **Subrace schemes**: ✅ DONE in lore.json/rules.json (Veiled/Tethered/Untethered; Shoreling/Deepling/Riverling ratified).

## REMAINING BUCKETS (separate efforts)
- **Tier 5 — bulk IP/mythology cleanup**: ~803 real-world-myth proper nouns in creatures (Fenrir/Tiamat/Strigoi/"Yokai"…) + ~20 unratified deities; D&D race/fiend content in lootItems (dwarves/elves/orcs/goblins, "Runelord Thrain") & summonableTokens (Imp/Pit Fiend/Balor); public creatures.json ↔ src creatureData.json drift. Large, mostly cosmetic/low-lore-risk.
- **Code surgery**: ✅ spell-dispatch DONE (P2-2) · ✅ timeline `classIds` anachronisms DONE (F9, full pass — 16 tags removed across 11 events; founding-year table ratified). ✅ F4 Layer A (pulse 55th→65th ordinal). ⏳ F4 Layer B (REBIRTH_CYCLES cadence re-spacing + significance rewrites) DEFERRED to a creative pass per user. (adaptTemplateForClass & resourceTypes confirmed dead code, left.)
- **Tier 6 — content gaps**: missing NPCs (Bayarmaa Ordavan + 7 npcStore stubs); 41 of 49 factions with empty `members`; Solbrand Order faction entry; 6 broken NPC LoreLinks (create entries or strip).

## ✅ RESOLVED — 26 Jul 2026: Dimension 2 (cross-reference integrity)

Full audit script: `dimension2_audit.ps1`. Findings doc: `dimension2_audit.md`.

**Layer A — relatedTerms (was 18 broken → 0):**
- 13 creatures had short-form region keys (`iceheart`/`cragjaw`/`bryngloom`) in BOTH `region` + `relatedTerms`. **D13**: normalized to long forms (`iceheart-sea`/`cragjaw-peaks`/`bryngloom-forest`) — 26 token replacements via raw-text `.Replace()` (quoted tokens only; verified long forms unaffected by closing-quote position). Atomic write + validated (316 entries, 0 leaks, 0 mojibake).
- 5 dead human-subrace refs in `human.relatedTerms` (thalren/tessen/solvarn/ordan/morren — keys exist only in `human.js`, no lore.json entries). **D14**: removed via substring-splice on the human block (mixed CRLF/LF line endings required `[regex]::Split` on `\r\n|\r|\n`, rejoin CRLF; strict "removed exactly 5" guard). `human.relatedTerms` 17→12.

**Layer B — LoreLink termId in src (was 3 broken unique → 0):**
- `termId="florae"` ×6 in `lunarchData.js`/`toxicologistData.js` → repointed to `briaran` (canonical Florae lore.json key per §4/§8/D7; inner text unchanged). Both files pass `node --check --input-type=module`.
- `termId="hierophant-aethelgard"` + `termId="lord-captain-vane-solvan"` in `crusaderData.js` → **D15**: stripped to plain text (no entries exist; matches Session-2 NPC pattern). `node --check` OK.

**Deferred (cosmetic):** `astril` self-references itself in `relatedTerms` (line 557). An initial Edit-tool attempt mis-targeted an identical `ancestor_wold/astril/false_prophet` sequence in `sundrift-vale` (different indentation) and removed a LEGITIMATE cross-ref; reverted from backup (MD5-verified to baseline). The self-ref is harmless (it resolves, just redundantly) and needs an entry-scoped removal script. Left for a later cleanup pass.

**Cross-dimensional leads logged:** (a) `mimir` summary still says "heartwood, storm-glass, or **pine**" — D8 claimed masks were changed to "heartwood or storm-glass" but only the fullEntry was updated, not the summary → Dimension 3. (b) `rite-of-masks` fullEntry says "heartwood, storm-glass, or black birch" → Dimension 3 mask-material reconciliation. (c) `fex-vestara` + `alaric` use `region: frostmaw-holdfast` (a location, not a region; that location's region is nordhalla) → Dimension 11. (d) `skald`=type=subculture vs `merryn`=type=subrace → Dimension 14. (e) `crusader` class not in CANON_REFERENCE §9 → Dimension 6.

**Encoding note:** lore.json has MIXED line endings — the D11 (`human`) and D12 (`seelie_accord`) entries use LF, while the rest of the file uses CRLF. The Q2 splice normalized the human block to CRLF; seelie_accord still has LF. Not a functional issue (JSON is line-ending-agnostic) but flagged for a future normalization pass if desired.

**Backups:** `lore.json.bak-dim2-trivial-20260725-231031` (baseline), `lore.json.bak-dim2-decisions-20260726-123431` (pre-Q1/Q2), `lunarchData.js.bak-dim2-trivial-20260725-231031`, `toxicologistData.js.bak-dim2-trivial-20260725-231031`, `crusaderData.js.bak-dim2-decisions-20260726-123431`.

## ✅ RESOLVED — 26 Jul 2026: Dimension 3 (description vs lore consistency)

Full audit script: `dimension3_audit.ps1`. Findings doc: `dimension3_audit.md`. Fix script: `apply_dim3_mimir_fixes.ps1`.

**Mechanical pass:**
- Coverage: 35/193 creatures have lore entries; 158 without (Tier 5 IP cleanup, deferred to D18).
- Type mismatches: 3 (gref/gambrel/stel — creatures.json uses monster subtypes like "fey"/"monstrosity" while lore.json uses broad category "creature"). Two different type systems, not contradictions. Deferred to D14.
- Duplicate-word typos: 2 → 0 (gref "stooped stooped" in description + nature; FIXED via Edit replaceAll).
- Lore-only creature types: 0.
- Abilities framing: `abilities.json` is keyed by creature id, not class id — prompt's D3 "abilities vs lore class entries" is a mismatch. Class abilities live in `*Data.js`, not `abilities.json`. Flagged for D8.

**Prose fixes applied (mimir entry — completing D8/D9/RESOLUTIONS Tier 2):**
1. Summary: "heartwood, storm-glass, or pine masks" → "heartwood or storm-glass masks" (D8 completion — summary was missed when fullEntry was fixed).
2. Sereth: "whose shame at his imperfect creation drove him to hide his people from the world itself" → "who died of its own contradictions and left its people hidden in the world" (RESOLUTIONS Tier 2 completion — canonical death cause + pronoun "it/its").
3. Duplicate Mirror Mere sentence removed (stale "Masked territory" naming from pre-D9 era; preceding canonical sentence retained).
4. "The Woven's living craft preserves" → "The Broken Mimir's living craft preserves" (D9 completion — "Woven" was missed when D9 dropped Masked/Woven/Unwoven).
5. rite-of-masks: "heartwood, storm-glass, or black birch" → "heartwood or storm-glass" (D8 completion — third mask-material variant).

**Deferred:**
- Deep prose scan of remaining 34 matched creatures (only mimir manually investigated).
- 158 creatures without lore entries (D18).
- 3 type mismatches (D14).
- "Woven Mimir" in `the_shifting_fen` entry + 5 other stale "Woven"/"Masked" refs in lore.json/classData/deepLocationData/CANON_REFERENCE (D15).

**Backups:** `lore.json.dim3-backup-20260726-131814`. Validation: 316 entries, 0 leaks, 0 mojibake.

## ✅ RESOLVED — 26 Jul 2026: Dimension 4 (faction hooks consistency)

Findings doc: `dimension4_audit.md`. Fix scripts: `apply_dim4_cult_fix.ps1`, `apply_dim4_brine_fix.ps1`, `apply_dim4_legacy_fix.ps1`.

**Fixes applied:**
1. **factionStore.js duplicate removal** (F4-3): Removed 15 duplicate faction entries (lines 1665-1845). Eliminated corrupted `astril-synod` (had Scoured's relationships/lore/secrets copy-pasted). 82 -> 67 entries. Syntax verified via `node --check`. Backup: `factionStore.js.dim4-backup-20260726-132701`.
2. **Cult naming fix** (F4-1): Renamed `cult_of_the_silent_dark` -> `cult_of_forgotten_shadow` in lore.json (key, id, term, alias, summary, fullEntry — all matching D4 canon). Updated 22 `relatedLore` references in `itemLoreData.js` (20) + `weapons/index.js` (2). Backups: `lore.json.dim4-cult-backup-20260726-133732`, `itemLoreData.js.dim4-cult-backup`, `weapons-index.js.dim4-cult-backup`.
3. **Brine-Bond Syndicate merge** (F4-2): Merged duplicate lore.json entries. Kept hyphenated `brine-bond-syndicate` (more detailed), added unique relatedTerms (`mereval-steward`, `myrathil`) from underscored entry, removed underscored `brine_bond_syndicate` entry, updated 2 cross-references. 316 -> 315 entries. Backup: `lore.json.dim4-brine-backup-20260726-134631`.
4. **Legacy faction removal** (F4-5): Removed 6 stale factions from factionStore.js (crown-coalition, blood-hammer-highlands, canopy-concordat, wyrd-host, scoured-syndicate, leviathan-empire). Used non-existent classes (voidwalker, shadowblade, etc.), empty members, referenced pre-D9 "Fractured Mimir". 67 -> 61 entries. Syntax verified. Backup: `factionStore.js.dim4-legacy-backup-20260726-134911`.

**Deferred:**
- F4-4: Icechamber Syndicate — no lore.json or factionStore.js entry; referenced in 15+ places. Deferred to D18.
- F4-6: Faction key naming inconsistency (hyphens vs underscores in lore.json) — cosmetic, no functional impact.

**Final state:** lore.json = 315 entries, 0 leaks, 0 mojibake. factionStore.js = 61 entries, syntax valid.

## ✅ RESOLVED — 26 Jul 2026: Dimension 5 (biome ecology)

Findings doc: `dimension5_audit.md`. Audit script: `dimension5_audit.ps1`.

**Fixes applied:**
1. **sirrush tags** (F5-1): Replaced duplicate `"dragon"` tag with `"sundale"` in creatures.json. Tags: `["dragon","dragon","serpent","horned"]` -> `["dragon","sundale","serpent","horned"]`. Habitat clearly mentions Sundale but tag was missing.

**Verified clean:**
- Tag region vs lore.json region: 0 mismatches across all 35 creatures with lore entries.
- No duplicate tags remaining in any creature.
- 1 border creature (skreika) correctly tagged Nordhalla with habitat mentioning Iceheart borders — not a bug.
- 18 creatures with habitat not explicitly mentioning region name — all verified as using location names within the correct region. Not bugs.

**Final state:** creatures.json = 193 entries, all with valid region tags. No region mismatches.
