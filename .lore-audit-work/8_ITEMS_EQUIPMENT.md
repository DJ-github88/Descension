# ITEMS & EQUIPMENT — AUDIT

**Domain lead scope:** `vtt-react/src/data/equipment/*`, `vtt-react/src/data/items/**`, `vtt-react/src/data/lootItemsData.js`
**Canon benchmark:** `CANON_REFERENCE.md` (§8 races, §9 classes, §10 eras, §4 houses, §1 entities) + `0_MASTER_LORE_MAP_AND_AUDIT.md` Part 2.
**Method:** Full read of all three equipment files; structural + prose grep of every items file; cross-check of every `classes:` / `races:` / `subraces:` tag against the canonical 20-class / 10-race lists (`classes/index.js`, `CANON_REFERENCE §8–9`).
**Read-only audit — no source files modified.**

---

## A. COVERAGE

| File | Lines | Tagging model | Lore density |
|------|-------|---------------|--------------|
| `equipment/classEquipment.js` | 3312 | `availableFor.classes` (21 distinct class strings) + legacy `availableFor.paths` | Low (mostly stat blocks; comments carry migration history) |
| `equipment/raceEquipment.js` | 1350 | `availableFor.races` + `availableFor.subraces` | High (heavy in-world flavor: Solbrand, Root-Veil, Morvane, Viridane, Hollow-Court) |
| `equipment/backgroundEquipment.js` | 1446 | `availableFor.backgrounds` | Medium (Solbrand / Dawn Vigil / Neth flavor) |
| `items/weapons/index.js` | 3828 | **none** (generic) | None — no cosmology, no class/race tags |
| `items/armor/index.js` | — | none | None |
| `items/accessories/index.js` | — | none | None |
| `items/consumables/index.js` | — | none | None |
| `items/containers/index.js` | — | none | None |
| `items/miscellaneous/*` (14 files) | — | none | None (verified: 0 class/race tags; quest-items.js fully generic) |
| `lootItemsData.js` | 323 | none | **Mixed** — Mythrill canon terms interleaved with generic D&D/Tolkien tropes |

**Key structural fact:** the only item files that gate content on class/race/background are the three `equipment/*` files. Every entry under `items/**` is unrestricted flavor-stat JSON with **zero** `classes:`/`races:`/`availableFor`/`classRestriction` arrays (confirmed by full-directory grep). Therefore the v3 A-08/A-09 deprecated-class-name bug class can only live in `classEquipment.js` — and that is where I concentrated the functional audit.

---

## B. INCONSISTENCY MAP

| ID | SEVERITY | LOCATION (file:line) | CANON SAYS | LORE SAYS | NOTES |
|----|----------|----------------------|------------|-----------|-------|
| **IE-1** | 🔴 CRITICAL | `classEquipment.js:2868,2890,2914,2935,2953` | Canonical classes = exactly 20 (§9). `JUSTICAR_ITEMS` block (5 items) tagged `classes: ['Justicar']`. | "Justicar" is neither canonical nor a documented deprecated/merged class. It exists **only** in this file (whole-repo search). | **FUNCTIONAL BUG.** No class named Justicar is registered in `classes/index.js` (`ALL_CLASSES_DATA`); no `justicarData.js` exists. All 5 items (Sacred Sword, Shield of Faith, Solbrand Plate, Righteous Amulet, Tome of Justice) are **orphaned — never granted to any player.** See §C. |
| **IE-2** | 🔴 CRITICAL | `classEquipment.js:2987,3011,3032,3050,3070` | Canonical classes = exactly 20 (§9). `OATHKEEPER_ITEMS` block (5 items) tagged `classes: ['Oathkeeper']`. | "Oathkeeper" is neither canonical nor a documented deprecated/merged class. Exists **only** in this file. | **FUNCTIONAL BUG.** No `oathkeeperData.js`; not in `ALL_CLASSES_DATA`. All 5 items (Oathbound Blade, Vow Plate, Oath Ring, Tome of Vows, Oath Seal) **orphaned — never granted.** Both IE-1/IE-2 sit in the "Sentinel Path" array (line 3075) alongside the canonical Lunarch/Apex/Warden, so they are exported into `ALL_CLASS_EQUIPMENT` and silently dead. |
| **IE-3** | 🟠 MAJOR | `raceEquipment.js:470,491` vs `:1149,1173` | `CANON_REFERENCE §8 NAMING FLAGS`: "Fexric" spelling unratified; data id `fexrick`. | Base race gated on `races: ['fexrick']` but the two Fexric subrace items gate on `subraces: ['drall_fexric']` / `['kethrin_fexric']` (suffix `_fexric`). Prose itself flips: `:455` "Fexric warren-workers", `:480` "a Fexrick carries". Variable/comment layer uses a third spelling `Ferrick` (`:447,448,1130,1131,1339,1348`). | Master-report **B1** recurs in equipment as a **3-way split**: `Fexrick` (id) / `Fexric` (subrace id + most prose) / `Ferrick` (vars+comments). If subrace resolution normalizes on the base id `fexrick`, the `_fexric`-suffixed subrace keys may fail to match. Functional risk + the species-name collision (Fexrick is also a separate runoff-vermin, per B1) is inherited. |
| **IE-4** | 🟠 MAJOR | `raceEquipment.js:263,819,873`; `backgroundEquipment.js:11,15,34,59,1275`; `lootItemsData.js:40,96` | §1: the bound star is **Sol**. "Solbrand" is an **unratified** conflation term (master A5/A7; F11 notes the faith was renamed "Solbrand Order" with no faction entry). | "Solbrand" used throughout as the proper name of the sun/faith: "Solbrand-tempered cloth", "Solbrand's heat still lives", "quenched in Solbrand-light", "Solbrand Prayer-Leaf", "Solbrand-sealed pouch", "memory of a Solbrand ember". | Same A5 entity-conflation disease. In equipment this is prose-only (no gating impact), but it propagates the unratified name into player-facing item text. Consistent fix = rename Solbrand→Sol (or officially ratify Solbrand). |
| **IE-5** | 🟠 MAJOR | `raceEquipment.js:313,907` | §1: **Morvane = the Watcher**; "Root-Veil" is an undefined conflation term (A5/B3 — Vreken file equates Root-Veil=Solbrand=Morvane). | "Gloves of **Root-Veil** silk that drink the light", "The **Root-Veil** marks its own." | Feeds the A5 collapse. Prose-only here, but locks in the non-canonical entity name on two Vreken items. |
| **IE-6** | 🟠 MAJOR | `classEquipment.js:3114,3177,3196,3220` | `pathData.js` defines 9 canonical paths: vessel, bound, unseen, scarred, archive-sworn, indebted, frostborn, wayfarer, threshold-watcher. | Equipment file uses a **different, legacy path scheme**: `paths: ['hexer']` and `paths: ['harrow']` (also infernal/zealot/arcanist/reaver/mercenary/sentinel groupings). | The path *keys* in `availableFor.paths` do not match any key in `pathData.js`. Items gated on `paths:['hexer']`/`['harrow']` will not resolve against the canonical path system. Functional risk (lower severity than IE-1/2 because paths are a secondary selector). |
| **IE-7** | 🟡 MINOR | `raceEquipment.js:399,1063,1138,1338,1347` (exports `ASTREN_BASE_ITEMS`, `ASTREN_SUBRACE_ITEMS`) | §8: the race is **Astril**. | Section comments + JS identifier names use "Astren". The actual `races: ['astril']` tag (`:419,442`) and prose "Astril"/"Astril bearer" (`:407`) are canonical. | Cosmetic only — the gating tag is correct, so items resolve. But the var/comment layer introduces a 3rd spelling variant alongside Astril/Astril. |
| **IE-8** | 🟡 MINOR | `raceEquipment.js:519,541,563,588,610,631,651` | Master B4/B5: Mimir canon subraces = Masked/Woven/Unwoven; Myrathil canon = Shore/Deep/Brook. | Equipment subrace keys use the **race-file** scheme: `shoreling_myrathil`/`deepling_myrathil`/`riverling_myrathil` and `veiled_mimir`/`tethered_mimir`/`untethered_mimir`. Prose in the same items uses the canon words ("Shore trader", "Deep mystics", "Brook", "Masked", "Woven", "Hollow"). | Inherited subrace-id mismatch. Not introduced by equipment, but the equipment keys are wired to the non-canonical scheme, so any future canon-side rename of subrace ids must touch this file too. |
| **IE-9** | 🟡 MINOR | `lootItemsData.js:34-76,122-147,108,174,187,118,130` | §8: 10 playable races; no dwarves/orcs/elves/druids. `LORE_STYLE_GUIDE` (master A15) bars real-world mythology / IP flavor. | Generic D&D/Tolkien leakage: "Dwarven War Hammer", "Mount Thunderpeak", "Runelord Thrain", "Stonebeard clan", "dwarven ale" (`:34-76`); "Orcish Greataxe", "orc warlord", "Warlord Krag", "Battle of Iron Pass" (`:122-147`); "before the first elf spoke a word" / "Eldwood Forest" (`:108`); "Celestial Conclave" (`:174`); "Archmage Elara" (`:187`); "druid elder" (`:118`). Interleaved with canon terms (Aldren Thalreth, Sundered Monoliths, Neth, Vreken, Bryngloom). | A15-class issue. Prose-only; no gating impact. "Vel-Keth Bayou" (`:118,238,261`) is an unattested sub-location (Keth-derived name?) — flag for geography ratification. |
| **IE-10** | 🟡 MINOR | `lootItemsData.js:28,226` + cross-ref `classResources.js:494,593` | §9: Revenant founders = **Kora / Vesper**. | "deep-ice chambers of **Aldren Thalreth**" / "Aldren Thalreth himself catalogued this heart". Elsewhere (`classResources.js`) Aldren Thalreth is the inventor of Revenant frost-harvesting. | Aldren is canonically Kaelen Thalreth's father (backgroundData). Tying him to the Revenant resource mechanic contradicts the Revenant founder canon (Kora/Vesper). Root cause is in classResources, but the loot items reinforce it. |
| **IE-11** | 🟡 MINOR (coverage) | `classEquipment.js` (whole file) | §9 lists 20 classes including **Animist**. | No `ANIMIST_ITEMS` block exists; `classes:['Animist']` appears **0 times** (verified by exhaustive tag enumeration). | Animist is the only canonical class with zero starting equipment. Coverage gap, not a contradiction. |

**Era labels (§10):** ✅ No violations found in any items/equipment file. No instance of "Age of the First Fae / Norse Kings / Skalds / Rune-Singers / Breach / Adaptation / Collection / Deepening" as an era label. "Deepening" and "Breach" are used correctly as *event* names in flavor text only.

---

## C. DEPRECATED-NAME BUGS vs INTENTIONAL

### C.1 — 🔴 FUNCTIONAL BUGS (deprecated / non-canonical names used as LIVE `classes:` tags)

These break gameplay: the tagged items can never be granted because no class with that name is registered in `classes/index.js` → `ALL_CLASSES_DATA`.

| # | Deprecated/Non-canonical Name | Canonical Target | File:Line (each `classes:` tag) | Item Count | Status |
|---|------------------------------|------------------|---------------------------------|------------|--------|
| 1 | **`Justicar`** | *none* — not a documented merger; appears to be an entirely orphaned/invented class never ratified | `classEquipment.js:2868, 2890, 2914, 2935, 2953` | 5 | **UNFIXED.** No `justicarData.js`; absent from `ALL_CLASSES_DATA`; whole-repo search finds the token only inside `classEquipment.js`. Items: Justicar's Blade, Shield of Faith, Solbrand Plate, Righteous Amulet, Tome of Justice. |
| 2 | **`Oathkeeper`** | *none* — same as above | `classEquipment.js:2987, 3011, 3032, 3050, 3070` | 5 | **UNFIXED.** No `oathkeeperData.js`; absent from `ALL_CLASSES_DATA`; token appears only in `classEquipment.js`. Items: Oathbound Blade, Vow Plate, Oath Ring, Tome of Vows, Oath Seal. |

**Note on scope:** I explicitly checked for the v3 A-08/A-09 deprecated cluster (`Chaos Weaver`, `Lichborne`, `Dreadnaught`, `Deathcaller`, `Fate Weaver`, `Gambler`, `Doomsayer`, `Bladedancer`, `Formbender`, `Covenbane`, `Exorcist`, `Titan`) inside **every** `classes:` array in the equipment file. **None** of them appear as live tags — that bug class is fixed here. The two unfixed bugs above (`Justicar`, `Oathkeeper`) are a *different*, undocumented pair: they are not in the v3 merger list either, so they were never part of the migration and were missed.

### C.2 — ✅ INTENTIONAL / CORRECTLY-MIGRATED (deprecated names appear only in comments, section/array names, or in-world item names — never as functional tags)

| Deprecated Name | Where it Appears (non-functional) | Canonical Tag Actually Used | Verdict |
|-----------------|-----------------------------------|-----------------------------|---------|
| `Oracle` | `classEquipment.js:1100` comment "Oracle has been absorbed into Augur (Seer specialization)"; array `ORACLE_ITEMS` (`:1102`); item-id prefix `oracle-` | `classes: ['Augur']` (`:1130,1150,1174,1192,1213`) | ✅ Clean migration. Comment documents the absorption. |
| `Fate Weaver` | `classEquipment.js:639` comment "Fate Weaver - Destiny manipulator…"; array `GAMBIT_THREADS_ITEMS` (`:640`); item-id prefix `fate-weaver-` (`:642,672,701,725,743,761,781`) | `classes: ['Gambit']` (`:668,697,721,739,757,777,798`) | ✅ Clean migration (12 Gambit items total incl. the main block). |
| `Gambler` | `classEquipment.js:521` section comment "Gambler - Fate manipulator"; in-world **item name** "Gambler's Vest" (`:597`) | `classes: ['Gambit']` (`:540,…,616`) | ✅ "Gambler's Vest" is a proper-noun item name, not a class tag. Intentional flavor. |
| `Lichborne`, `Deathcaller` | `classEquipment.js:1478,1595` comments "merged from Lichborne + Deathcaller as Phase 1.10 consolidation" | `classes: ['Revenant']` | ✅ Comment-only. |
| `Dreadnaught` | `classEquipment.js:1981` comment "Dreadnaught items removed (absorbed into Martyr as Ironclad specialization)" | (items removed) | ✅ Comment-only. |
| `Formbender`, `Bladedancer` | `classEquipment.js:1849,2243` comments "merged into Shaper" | `classes: ['Shaper']` | ✅ Comment-only. |
| `Covenbane`, `Exorcist` | `classEquipment.js:983,2126` comments "formerly Covenbane" / "Phase 1.9 consolidation" | `classes: ['Inquisitor']` | ✅ Comment-only. |
| `Titan` | (not in this file; noted in `classes/index.js:46`) | `classes: ['Warden']` | ✅ N/A here. |

---

## D. VERDICT

The v3 A-08/A-09 deprecated-class-tag bug is **fixed for the documented merger set** (Chaos Weaver / Lichborne / Dreadnaught / Deathcaller / Fate Weaver / Gambler / etc. are all correctly retargeted to their canonical classes, with the old names surviving only as comments/array-names/item-ids). **However, two undocumented orphan classes — `Justicar` and `Oathkeeper` — remain as live `classes:` tags on 10 items that can never be granted to any player** (IE-1/IE-2, CRITICAL). This is the same bug class as A-08/A-09 but for a pair that was never in the migration list. Secondary issues: the Fexric/Fexrick/Ferrick 3-way id split (IE-3) and the legacy path-key mismatch (IE-6) carry functional risk; Solbrand/Root-Veil conflation (IE-4/IE-5) and generic dwarf/orc/elf leakage in loot flavor (IE-9) are prose-level canon contradictions. No new era-label or cosmology inversions were found in this domain beyond what the master report already catalogues.
