# MASTER AUDIT — PASS 2 ADDENDUM (secondary domains)
**Date:** 16 July 2026 · Covers the 6 domains Pass 1 didn't reach: creatures/abilities, items/equipment, spells, talent trees, backgrounds/misc, lore-infrastructure. Detail in files `7_–_12_` in this folder.

> **Headline:** Pass 2 confirms the core-layer findings and adds **~9 new CRITICAL** issues — most are **functional/gameplay-breaking** (silent failures, orphan classes, broken links), which the narrative-only Pass 1 could never have caught. This is exactly why closing the gaps before fixing mattered.

---

## NEW CRITICAL (functional / gameplay-breaking)

### 🔴 P2-1. Orphan classes `Justicar` & `Oathkeeper` — 10 items never grantable
`classEquipment.js:2868-3070` — 5 items tagged `classes:['Justicar']`, 5 tagged `classes:['Oathkeeper']`. Neither class exists (no data file, absent from `ALL_CLASSES_DATA`). Players can never receive them. Same bug class as v3 A-08/A-09, but for two classes that were never in the documented merger list — so they were missed. *(IE-1/IE-2)*

### 🔴 P2-2. Spell categorization layer silently broken (5 sub-issues)
- `determineChaosWeaverSpecialization` returns Harbinger spec IDs that **exist nowhere** (`chaos_dice`/`entropy_control`/`reality_bending` vs canonical `wild_prophet`/`deaths_seer`/`fate_rift`).
- `determineMartyrSpecialization` returns `redeemer`/`avenger`/`protector` — matches no canonical list.
- `spellTemplates.js:adaptTemplateForClass` keyed on **24 non-canonical classes** (`chronomancer`, `dreadnaught`, `druid`, `shaman`…) → silent no-op for 18 of 20 real classes.
- `resourceTypes.js` unreachable `classRestriction` values (`harrow`/`monk`/`hexer`/`warlock`/`dreadnaught`).
- Martyr spec list diverges across 3 files; `Ironclad` lives in `martyrData.js:735` but never reaches `classSpellCategories`. *(S1–S5)*
**Net effect:** spell-to-class dispatch silently fails for a large fraction of content.

### 🔴 P2-3. Martyr talent tree: founder = "Sundale" (a region), patron = "Solbrand"
`martyr.js` — founder field = **"Sundale"** (×31, a *region* not a person); patron = **"Solbrand"** (×38, unratified alias). Canon: founder **Sera Solvan**, patron **Sol / Embers of Sol**. *(TT-2)*

### 🔴 P2-4. Animist talent tree ships real-world Vodou loa
`animist.js:128-211` — Baron Samedi (×2), Simbi, Erzulie, capstone "The Triune Devourer." Inverts canon Animist (Kael/Nyssa/Theron; ancestral spirits via the Watcher). *(TT-1)*

### 🔴 P2-5. "Eight noble houses" in player-facing backgrounds
`backgroundData.js:783,1218,1308` (groveWarden) — *"There were eight noble houses, not seven… Viridane, the erased eighth house."* Canon §4: **7** signed; Viridane = original **7th**; "8th house" is a Briaran folk self-title. Echoes master F1 but in character-creation text. *(BG-1)*

### 🔴 P2-6. Broken LoreLinks / term-ID mismatches (user-visible dead tooltips)
- `classLoreStore.js` id **`falseProphet`** vs lore.json key **`false_prophet`** → False Prophet tooltip/auto-link silently fails.
- 8 hardcoded `<LoreLink termId="…">` in class data resolve to **nothing**: `bayar-wind-throat`, `eira_bone_reader`, `helgar_the_rejector`, `ignis_the_watcher`, `mother_ysen`, `ironwood-palisade`, `monoliths` (→ should be `sundered_monoliths`), `solvarn` (content gap).
- rules.json join keys: `the-wyrd` (hyphen, ×1) vs `the_wyrd`; bare `viridane` (×6) vs `house_viridane`. *(L1–L6)*

### 🔴 P2-7. "Solbrand" — pervasive unratified entity/relic/faith term
**34× in creatures**, plus heavy use in `martyr.js` and elsewhere. Canon has no "Solbrand." It blurs **Sol** (the star) / a sun-relic / the **Embers of Sol** faith / possibly the "Solbrand Order" (the failed Solvan knightly order). A new conflation vector only partially caught in Pass 1 (vreken.js). Needs a single canonical definition. *(CA-1, TT-2)*

---

## NEW MAJOR

- **P2-8. Real-world mythology pastiche is systemic** — **803 proper-noun hits** across creatures (Fenrir/Ragnarök/Níðhöggr/Tiamat/Apep/Shamash/Strigoi/Vetala/Zmey/"Yokai"/"Mongol") + ~20 unratified polytheistic deities (Perchta, Serket, Wadjet, Horus, Heket, Olokun…). `LORE_STYLE_GUIDE` warns against this; it's the *design* of the creature file, not accidents. *(CA-2/CA-3; also TT-1 Vodou, BG-3/4 D&D)*
- **P2-9.** `lootItemsData.js` D&D IP-leakage cluster — dwarves/elves/orcs/goblins + "Runelord Thrain," "Mount Thunderpeak," "Battle of Iron Pass." Non-canonical races. *(BG-3)*
- **P2-10.** Inquisitor (Wyrd-hunter) summons Emberspire fiends (Imp/Pit Fiend/Balor/Demon Prince) — trespasses Pyrofiend's Scathrach-pact domain + imports D&D fiend taxonomy. *(BG-4)*
- **P2-11.** `minstrel.js` re-skinned to non-canonical forest **"Revel Sylvan"** (×18); zero Mereval/tide/**Lyris** refs (canon hook). *(TT-3)*
- **P2-12.** `harbinger.js` frames **Keth-Amar as a willing patron** granting boons/godhood (×19) — inverts adversarial-predator canon. *(TT-4)*
- **P2-13.** dead `talentTrees/index.js` references phantom classes (Inscriber/Witch Doctor/Primalist + 6 non-existent Gambit exports). *(TT-6)*
- **P2-14.** public `creatures.json` ↔ src `creatureData.json` **diverged** ("Irish/Gaelic" vs "Skaldic"). *(CA-4)*
- **P2-15.** Duplicate `id: 'starter-oil-flask'` (`startingEquipmentData.js:648 & :1004`) — data collision. *(BG-6)*
- **P2-16.** `EXAMPLES_ENABLED = true` ships 8 demo locations into every region in the world map. *(L5)*

---

## NEW MINOR (selected)
- Husque = "a localized leak of Keth-Amar's hunger" — only creature breaking the fear-born Wyrd-Spawn model (CA-7).
- "Root-Veil aurora"/"Root-Veil monster" — 4th & 5th meanings for an already-overloaded token (BG-5, CA-6).
- `'false_prophet'` snake_case in live `classHooks` extends master F10's three-way split (BG-7).
- Aldren Thalreth (a scribe) credited as Revenant resource inventor instead of Kora/Vesper (S6).
- `<h3>Doomsayer Prophecy</h3>` rendered to users; deprecated names in wizard descriptions & HUD state hooks (S7–S9).
- Inquisitor "Covenbane" boilerplate ×7 = the one genuine deprecated-name **bug** in talent trees (TT-5); "Fate Weaver"/"Shockwave Gambler" talent *titles* are acceptable flavor.

---

## RESOLVED / CLEAN (good news from Pass 2)
- **Documented deprecated-name set is correctly migrated** in equipment — Chaos Weaver/Lichborne/Dreadnaught/Deathcaller/Fate Weaver/Gambler survive only as comments/array-names/item-ids; the live `classes:` tags point canonical. The *only* functional tag bugs are Justicar/Oathkeeper (P2-1) + Inquisitor "Covenbane" (TT-5).
- **v3 A-13 era strings** ("Age of the Norse Kings" etc.) **fixed** (0 exact hits); only prose echoes remain.
- **`relatedTerms` graph is clean** — 0 orphans; all `entry.id===key` valid; display components (LoreTooltip/LoreSidebar) are themselves clean (they only surface data-layer conflation).
- **Merged-class count = 8 confirmed** in live data.
- **Sol is correctly ungendered** in creatures; Aex/Scathrach never misused there; Watcher↔Dead-Moon and Aethil conflations absent from creatures.

---

## FINAL COVERAGE VERDICT
Every lore-bearing data file and doc has now been examined:
- **Pass 1 (core narrative):** lore.json, rules.json, 10 race files, 20 class data files, timelineStore, factionStore, npcStore, compendium, GM guide, all docs, region/zone/location data.
- **Pass 2 (secondary):** creatures/abilities (~2 MB), items/equipment (~600 KB), spells, talent trees (~400 KB), backgrounds/misc, lore-infrastructure + term-link integrity + `.gemini` scratch.

Purely mechanical files (combat math, dice, audio, grid math, etc.) carry no lore and were excluded by design. We are at **effectively complete coverage of all lore-bearing content** — sufficient to begin fixing without the risk of acting on an incomplete picture. (Caveat: line-level grep-sweeps of component files may still hide isolated flavor strings; the systemic picture is complete and the findings converge across independent agents.)

---

## CONSOLIDATED FIX PLAN (ready to execute on your go)
Sequenced so earlier steps unblock later ones. Each tier is independently shippable.

**Tier 0 — Ratify the canon layer (decisions, not code):**
1. Officially decide **"Aethil" vs "The Warden"** (master A7) and **what "Solbrand" is** (P2-7).
2. Pin the **entity boundaries**: Morvane=Watcher; Root-Veil, Solbrand, Dead-Moon are each distinct (A5/A6). Collapse the Cult of Forgotten Shadow to **one** origin (A4).
*One decision per item unblocks dozens of downstream fixes.*

**Tier 1 — Gameplay-breaking (do first, low lore-risk):**
3. Fix orphan classes Justicar/Oathkeeper (P2-1) → remap to canonical or delete.
4. Fix spell categorization: spec-ID schemes + `adaptTemplateForClass` key list (P2-2).
5. Fix `falseProphet`→`false_prophet` + 8 broken LoreLinks + `the-wyrd`/`viridane` join keys (P2-6); turn off `EXAMPLES_ENABLED` (P2-16); dedupe `starter-oil-flask` (P2-15).

**Tier 2 — Core narrative contradictions (the Pass-1 CRITICALs):**
6. Propagate framework fixes into data: Aex willing (A1), Still-Heart genuine (A2), Fexric-origin (A3), Scathrach-Binding (A11), Sereth (A12).
7. Timeline: 7 houses at Binding (F1), Augur→~Year 70 (C4), pulse math (F4), classIds anachronisms (F9), remove "Natalie Seline" (A4).
8. Founder corrections: Shaper→Veyra (C1), Animist→Kael/Nyssa/Theron (C2), Martyr→Sera Solvan (P2-3), Kor-Vasseth age (E1).

**Tier 3 — Talent trees & domain reskins:**
9. Animist loa→ancestors (P2-4), Minstrel→Mereval/Lyris (P2-11), Harbinger→adversarial Keth-Amar (P2-12), Inquisitor Covenbane→Inquisitor (TT-5), dead index.js phantom classes (P2-13).

**Tier 4 — Naming & scheme standardization:**
10. Fexric/Fexrick canonical spelling (B1); Mimir/Myrathil subraces (B4/B5); merged-class count 8 (C7); "8 houses"→"7" everywhere (P2-5/BG-1).

**Tier 5 — Flavor/IP cleanup (large, low-risk, can batch):**
11. Real-world mythology/IP pastiche (P2-8/P2-9/P2-10), era-label prose echoes, entity-conflation flavor strings.

**Tier 6 — Content gaps:** missing NPCs (Bayarmaa + 7 stubs), faction members (F11).

*End of Pass 2 Addendum.*
