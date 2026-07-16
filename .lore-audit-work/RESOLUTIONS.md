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
`docs/CORE_LORE_FRAMEWORK.md` · `vtt-react/public/data/lore.json` · `vtt-react/public/data/rules.json` · `public/data/lore.json` (root — synced in S2) · `public/data/rules.json` (root — synced in S2) · `vtt-react/src/store/timelineStore.js` · `vtt-react/src/store/npcStore.js` · `vtt-react/src/store/factionStore.js` · `vtt-react/src/data/classes/shaperData.js` · `vtt-react/src/data/classes/pyrofiendData.js` · `vtt-react/src/data/classes/animistData.js` · `vtt-react/src/data/equipment/classEquipment.js` · `vtt-react/src/data/startingEquipmentData.js` · `vtt-react/src/data/backgroundData.js` · `vtt-react/src/data/THEMATIC_AUDIT.md` · `vtt-react/src/components/world-map/LoreSidebar.jsx` · `vtt-react/src/data/classSpellGenerator.js` (S2: spec-ID scheme) · `vtt-react/src/data/classSpellCategories.js` (S2: +ironclad Martyr spec) · `vtt-react/src/store/timelineStore.js` (S2: F4 Layer A — 55th→65th pulse ordinal) · `vtt-react/src/data/classes/animistData.js` (S2: LoreLink fix) · `vtt-react/src/data/classes/augurData.js` (S2: LoreLink fix) · `vtt-react/src/data/classes/inquisitorData.js` (S2: LoreLink fix) · `vtt-react/src/data/classes/gambitData.js` (S2: LoreLink fix) · `vtt-react/src/data/classes/falseProphetData.js` (S2: LoreLink fix)

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
