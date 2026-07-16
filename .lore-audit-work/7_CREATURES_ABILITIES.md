# CREATURES & ABILITIES — AUDIT

**Domain lead:** Creatures & Abilities
**Date:** 16 July 2026
**Canon benchmark:** `CANON_REFERENCE.md` (§§1–13)
**Cross-check:** `0_MASTER_LORE_MAP_AND_AUDIT.md` Parts 1–2 (focus on NEW issues, not re-listing)

---

## A. SCOPE / COVERAGE

Files audited (read fully or in representative chunks; all are large):

| File | Size | Lines | Role |
|---|---|---|---|
| `vtt-react/public/data/creatures.json` | 652 KB | 17,116 | Flat array of creature statblocks (id/name/desc/tags/stats/abilities/loot). **No region/folklore field.** |
| `vtt-react/src/data/creatureData.json` | 678 KB | 6,779 | Region-grouped lore codex: 7 region blocks, each w/ `folklore` tag + full creature lore (origin/nature/habitat/combat/depth/hooks/heritage). |
| `vtt-react/public/data/abilities.json` | 760 KB | 31,216 | Creature abilities keyed by creature-id; short lore descriptions + full spell-card config. |
| `vtt-react/src/data/creatureAbilityBuilders.js` | 15 KB | 388 | Pure helper functions (`dmg/heal/buff/debuff/ctrl/util/summon/transform/passive`). **No lore content** — only type-normalization + config assembly. CLEAN. |

**Integrity / duplication notes:**
- `public/data/creatures.json` and a sibling `D:\VTT\public\data\creatures.json` are **byte-identical** (MD5 `BEA158…`). Same for `abilities.json` (MD5 `8BB4F9…`). So the `vtt-react/public` copies are the canonical ones audited.
- `creatures.json` (public statblocks) and `creatureData.json` (src lore codex) are **different files with overlapping creature casts that have DIVERGED** — see CA-4.
- **`creatureLibraryData.js` does NOT exist** in the current codebase (glob `**/creatureLibraryData*` = 0 hits). The v3 audit referenced it; it has since been removed. No action required — noted for completeness.

Search methods: ripgrep/`Select-String` for every canon-critical term (Keth-Amar, Scathrach, Aex, Sol gendering, Morvane/Root-Veil/Solbrand, Watcher/Dead-Moon/Aethil, all 12 deprecated class names, era labels, real-world ethnonyms + ~90 real-world myth proper nouns), plus full structural reads of region blocks.

---

## B. INCONSISTENCY MAP

Severity: **🔴 CRITICAL** (lore flatly wrong / inverts canon) · **🟠 MAJOR** (misleading / diverges from canon) · **🟡 MINOR** (polish).

### CA-1 🟠 — "Solbrand": undefined entity term used 34× as object / faith / deity-adjacent (NEW conflation vector)

**Locations:**
- `creatures.json`: 7523, 7526, 7711, 8280, 8282, 8283, 8366, 8851, 8912, 14263, 15420, 15489, 15889 (13×)
- `creatureData.json`: 1921, 1988, 2137, 2140, 2157, 2210, 2227, 2452, 2454, 2455, 2472, 2487, 2514, 2705, 2741, 2757, 2762, 6040, 6501, 6536, 6642 (21×)

**CANON SAYS:** No "Solbrand" entity exists. The bound star is **Sol** (§1); its faith is the **Embers of Sol** → 3 factions (§7). The master audit (A5) only caught "Solbrand = Root-Veil" inside `vreken.js` and a missing "Solbrand Order" faction (F11); it did **not** survey the creatures codex.

**LORE SAYS:** "Solbrand" is used simultaneously as:
1. A **sacred object/relic** — *"a Wyrd-coiled volcanic glass serpent wound around the Solbrand at the Harath-Vault"* (creatures.json:7523 / creatureData.json:2137); *"warmth of the Solbrand"* (7526/2157); *"sacred bowl of the Solbrand"* (8283/2472); *"light of the Solbrand"* (8851/2762, 8912/2757).
2. A **faith tradition** — *"Solbrand-reverence"* (8280/2452, 8366/2487, folklore field 1921); *"Solbrand faith"* (15889/6642); *"Solbrand lore"* (14263/6040); *"Solbrand mythology"* / *"Solbrand-reverence mythology"* (8366/2487, 2514).
3. A **cultural adjective** — *"Solbrand Yakshini"* (15420/6501), *"Solbrand Gandharvas"* (15489/6536).

**NOTES:** This is the single largest NEW conflation vector in the creatures domain. It blurs Sol (the star), a sun-relic object, and the Embers-of-Sol faith into one undefined token — exactly the "entity-conflation disease" the master audit (Theme 1) names as the project's #1 lore problem, now extended into creatures. Critically, the same entries **also** refer correctly to *"the sun-spirit Sol"* (8280/2452, 8912/2757), proving the writers know Sol exists — so "Solbrand" is an unratified parallel term that must either be renamed to Sol / Embers-of-Sol / a defined relic, or formally defined in `CORE_LORE_FRAMEWORK.md`.

---

### CA-2 🟠 — Systematic real-world mythology / IP leakage (pervasive; far beyond GM-guide scope of master audit A15)

**Locations:** Throughout both creature files. Quantified:
- Real-world myth **proper nouns**: **303** hits in `creatures.json`, **500** in `creatureData.json`.
- Real-world **ethnonyms / geography** (Gaelic, Celtic, Romanian, Caucasus, Assyrian, etc.): **21** in `creatures.json`, **45** in `creatureData.json`.

**CANON SAYS:** §13 + `LORE_STYLE_GUIDE` (per master audit A15) warn against real-world mythology / IP leakage; Mythrill is meant to be its own world.

**LORE SAYS:** The entire creatures codex is architected as a 1:1 map of **in-world region → real-world folklore tradition**, with every creature a fusion of two real-world myths. Representative (non-exhaustive):
- **Nordhalla = Norse/Germanic**: Fenrir + Ragnarök + Gleipnir + Níðhöggr + "World Tree" (creatures.json:6928/6527), Dísablót/Dísir (7013), Krampus + Jötunn (5249), Perchten + Rauhnächte (6089), Helhest, Myling, Jutul, Lindwyrm, Valravn, Kraken, Draugr, Huldra, Nokk, Fossegrim, Nachtkrapp, Marepress.
- **Sundale = Mesopotamian/Egyptian**: Tiamat + Apep (7523/2137), Shamash + Serket (7708/2207), Lamashtu + Taweret (7903/2277), Ifrit + Wadjet (8057/2347), Ghul + Medjed (8126/2382), Nisroch + Horus (8773/2667), Heket + "Ishtar Gate" (8993/2772), Kur + Duat (8851/2741), Lamassu, Sirrush, Anzu, Bes, Peri, Daeva, Gugalanna, Mushussu.
- **Bryngloom = Slavic/Hindu**: Strigoi + Vetala (14263/6040), Vourdalak (15328/6486), Preta (14857/6275), Zmey Gorynych + Makara (14572/6147), Mavka/Yakshini (15420/6501), Alkonost/Gandharva (15489/6536), Sirin/Navagraha (15889/6642), Vila.
- **Cragjaw = Japanese**: "Tesshan Yokai" (folklore field 3855) — Tatzelwurm variants, etc.
- **Iceheart Sea = Greek**: "Aegean" (folklore field 2909), Triton, Ketos, Hippocampus, Olokun (Yoruba, 10158/3563).
- **Sundrift Vale = Mongol**: "Mongol/steppe" (folklore field 4800), Almasty "of the Caucasus" (12341/4981).
- **Frostwood = Celtic/Germanic**: Dullahan, Bean Nighe, Cu Sith, Nuckelavee, Pixie, Erlking, Schrat, Pooka/Púca, Brownie/Urisk, Sluagh, Fuath, Grogoch.

**NOTES:** Master audit A15 rated this MINOR based on the GM guide. In the creatures codex it is the **foundational design** (the `folklore` field of every region block literally names the real-world source culture), so I upgrade to MAJOR. This is not a "fact contradiction" but a systematic identity/tonal divergence from canon's "own world" principle. Fixing requires either (a) ratifying the in-world cultures as having genuinely distinct mythopoetic traditions with renamed creatures, or (b) accepting the real-world pastiche as intentional and updating `LORE_STYLE_GUIDE`.

---

### CA-3 🟠 — Unratified polytheistic pantheon (cosmology divergence)

**Locations:** ~20 "deity/goddess/god" references across both files. e.g.:
- `creatures.json`: 5603 ("Thalren winter goddess Perchta"), 7708 ("Serket, the Solvarn scorpion-goddess"), 7903 ("hippopotamus-goddess Taweret"), 8057 ("cobra-goddess Wadjet"), 8126 ("sheeted deity … Solvarn Book of the Dead"), 8773 ("eagle-headed deity"), 8993 ("frog-goddess Heket"), 13900 ("Ordan wind deity").
- `creatureData.json`: 703, 2057 ("protective deity"), 2207, 2277, 2338 ("protector deity"), 2347, 2382, 2667, 2693 ("Assyrian falcon-deity"), 2772, 3569 ("water deity"), 5613.

**CANON SAYS:** §13 — *"All magic flows from the Warden's bargain-framework + consequences of Binding/Breach… None is raw power; all is debt/contract/infection."* §8 ratifies exactly **one** active world-bound deity (Morvane = the Watcher) plus the unratified Mimir creator Sereth (master audit B8). There is **no polytheistic pantheon** in canon.

**LORE SAYS:** The creatures codex populates a full polytheism — Perchta, Cailleach, Shamash, Serket, Taweret, Wadjet, Medjed, Nisroch, Horus, Heket, Khepri, Ishtar, Tiamat, Apep, Olokun, etc. — each attributed to an in-world culture ("Solvarn goddess," "Thalren goddess," "Ordan wind deity").

**NOTES:** The saving grace (and why this is MAJOR not CRITICAL) is that most are framed as **pre-Wyrd mythology that the Wyrd anomaly then materialized** (e.g. Lamassu heritage, creatureData.json:2057: *"The Wyrd anomaly acted upon the miners' desire for sanctuary, materializing these winged bulls"*), which is consistent with the Wyrd-Spawn model (§2). The problem is the *volume* implies an active, present pantheon rather than dead myth, and canon's magic model has no room for answered prayers to "Solvarn goddesses." Soft cosmology divergence.

---

### CA-4 🟠 — `creatures.json` (public) ↔ `creatureData.json` (src) have diverged; public file retains raw real-world ethnonyms

**Locations (representative divergences):**
| Creature | `creatures.json` (public) | `creatureData.json` (src) |
|---|---|---|
| Oillipheist origin | :359 *"ancient **Irish** water-dragon myths"* | :49 *"ancient **Skaldic** water-dragon myths"* |
| Cailleach origin | :5603 *"**Gaelic** winter hag Cailleach"* | :703 *"**Skaldic** winter hag Cailleach"* |

**CANON SAYS:** n/a (hygiene) — but the public-facing statblock file is the one GMs/players actually load.

**LORE SAYS:** The src lore codex was **partially de-contaminated** (real-world ethnonyms → in-world culture names like "Skaldic"), but the cleaning was **incomplete** (creatureData.json still has "Assyrian" :2693, "Romanian" :6040, "Caucasus" :4981, "Ishtar Gate" :2772), and the public `creatures.json` was **not cleaned at all** (still has Irish/Gaelic).

**NOTES:** Mirrors the master-audit Theme 2 ("framework doc fixed, data not propagated") but here it is **data file → data file** drift: two parallel creature datasets with inconsistent de-contamination. Which file is authoritative for lore? If `creatureData.json`, the public statblocks need re-syncing. (Distinct from the lore.json pair, which the master audit found byte-identical.)

---

### CA-5 🟡 — Deprecated era-label exact STRINGS are FIXED in creatures; prose-form echoes persist

**Locations (prose echoes, in BOTH files):**
| Concept echoed | `creatures.json` | `creatureData.json` |
|---|---|---|
| "Age of the First Fae" | :359 *"when the first fae walked the world"* | :49 |
| "Age of the Norse Kings" | :646 *"when the Skaldic Kings ruled the frozen north"* | :951 |
| "Age of the Skalds" | :743 *"in the age when skalds sang the sagas"* | :986 |
| "Age of the Rune-Singers" | :847 *"when rune-singers bound the stones"* | :1020 |

**CANON SAYS:** §10 — canonical eras are **Before the Deepening / [Binding-Breach] / The Age of the Dimming**. v3 A-13 flagged the exact strings "Age of the First Fae / Norse Kings / Skalds / Rune-Singers" as non-canonical.

**LORE SAYS:** The **exact deprecated strings do NOT appear** in either creatures file (grep for `Age of (the )?(First Fae|Norse Kings|Skalds|Rune-Singers|…)` = 0 hits). ✅ The v3 A-13 violations are **fixed at the string level** in this domain. However, the same four concepts survive as subordinate prose clauses inside `origin` fields (quoted above), attached to the *canonical* label "Before the Deepening" (which §10 does ratify, so the era label itself is fine — only the descriptive clause echoes a deprecated era).

**NOTES:** MINOR — these are flavor prose, not data fields/IDs, so they cause no mechanical breakage. But the "Skaldic Kings / skalds' sagas / rune-singers / first fae" framing still implies the non-canonical pre-Dimming sub-eras that v3 tried to remove. "Before the Deepening" usage itself is correct and should NOT be flagged.

---

### CA-6 🟡 — "Root-Veil" undefined term (1 use)

**Locations:** `creatures.json`:14572 / `creatureData.json`:6147 (Zmey-Bog origin): *"the Makara, a composite **Root-Veil monster** of Atropolis's watery domain."*

**CANON SAYS:** "Root-Veil" is undefined. Master audit A5 maps the Vreken conflation (Morvane = Root-Veil = Solbrand) and flags Root-Veil as an unratified synonym.

**LORE SAYS:** "Root-Veil" is used here as a **folklore-source label** ("Root-Veil monster"), i.e. a third function for the term beyond entity-name (cf. CA-1 Solbrand, A5). Adds a fourth meaning to an already-overloaded token.

**NOTES:** Single occurrence, low impact, but compounds the entity-naming disease.

---

### CA-7 🟡 — Husque origin blurs the Wyrd-Spawn vs Wyrd-Channel boundary

**Locations:** `creatures.json`:16372 / `creatureData.json`:2876 (Husque origin): *"a mobile rip in spatial reality, a **localized leak of Keth-Amar's hunger** that has occupied a shell of basalt and mineral slag."*

**CANON SAYS:** §2 Wyrd hierarchy — **Wyrd-Spawn** = animated nightmare monsters *born from regional fears*, unique per region; **Wyrd-Channel** = Keth-Amar's *direct attention* (boss-tier). The distinction is origin: folklore-fear vs direct-Keth-Amar.

**LORE SAYS:** The Husque is presented as a generic creature that is literally "a leak of Keth-Amar's hunger" — i.e. direct-Keth-Amar origin, not fear-born — yet it is filed as a normal creature, not a boss/Channel.

**NOTES:** This is the **only** creature in the domain whose origin deviates from the fear-born Wyrd-Spawn model. Everywhere else the model is respected (see §C/verdict). Minor tier-blurring, not a hard inversion. (Compare Cycle-Eater, creatures.json:17052 / creatureData.json:6748, which is correctly fear-born: *"born from the fear that Keth-Amar will devour the forest's reincarnation cycle"*.)

---

### CA-8 ℹ️ — `creatureLibraryData.js` removed; no action

The v3 audit referenced `creatureLibraryData.js`. Glob `**/creatureLibraryData*` across the repo = **0 hits**. The file has been deleted from the codebase. No inconsistency to report; recorded so future audits don't re-hunt for it.

---

### CLEAN CONFIRMATIONS (things checked and found NOT contradictory — important for the verdict)

These canonical pitfalls were explicitly searched for and are **absent** from all three creatures/abilities files:

1. **Sol gendered "she/he"** — Sol is referenced neutrally (*"the sun-spirit Sol"*, *"Sol's own consciousness"* — creatures.json:8280/8912; creatureData.json:2452/2757). ✅ No gendering.
2. **Aex "unwilling/forced/hunted"** (master audit A1) — **0 mentions** of Aex in any creatures/abilities file. ✅
3. **Scathrach "born at the Breach"** (master audit A11) — **0 mentions** of Scathrach. ✅
4. **Watcher ↔ Dead-Moon conflation** (master audit A6) — **0 mentions** of "Dead Moon" or "Watcher" as the cosmic entity. Lowercase "watcher"/"Gate-Watcher"/"quiet watchers" are generic creature-role words, not the entity. ✅
5. **Aethil / "the Warden" entity** (master audit A7) — **0 mentions**. ✅
6. **Morvane** — 6 uses, **all canon-consistent** (death/contract boundary: *"contracts were called by Morvane"* creatures.json:14857; *"returned to a half-life by Morvane"* :15328; *"the sound of Morvane"* :15892; mirrored at creatureData.json:6275/6486/6663). Morvane = the Keeper/Watcher per §1. ✅ No conflation with Sol/Root-Veil here.
7. **Fog Compact attribution** — Cailleach entry explicitly *"the Fog Compact is its true source"* (creatures.json:5603 / creatureData.json:703), correctly attributing Thalreth's fog to its bargain (§4) and framing the goddess-credit as folk error. ✅ Canon-aware.
8. **Sundered Monolith references** (Iceheart Sea creatures) — consistent with canon §5 (Mereval Depth-Breath Monolith sundered at Breach). ✅
9. **House-count / Monolith-count errors** — none (no "8 houses," no second false Monolith — the master-audit A2/D1 errors do not appear here). ✅
10. **Wyrd-Spawn origin model (§2)** — overwhelmingly respected: ~all creatures follow *"born from the regional fear of X → Wyrd anomaly materialized/twisted it."* Only CA-7 (Husque) deviates.
11. **"the Dimming"** in abilities.json — used correctly as the era name; no non-canonical era-label strings anywhere in abilities.json. ✅
12. **abilities.json + creatureAbilityBuilders.js** — essentially lore-clean. Only "god" reference is the generic ability name *"God's-Mistake-Intellect"* (abilities.json:12584, for the Ketos leviathan) — not a deity claim. ✅

---

## C. INTENTIONAL-VS-BUG DEPRECATED-NAME NOTE

**Result: NO deprecated/merged class names appear as live identifiers anywhere in the creatures/abilities domain.**

Searched all three files for the full deprecated set — `Deathcaller`, `Lichborne`, `Dreadnaught`, `Bladedancer`, `Formbender`, `Covenbane`, `Exorcist`, `Chaos Weaver`, `Doomsayer`, `Fate Weaver`, `Gambler` — plus `classId`/`className` fields: **0 hits in every file.**

The creatures/abilities data model keys everything by creature-id and damage-school (`wyrd/ember/rime/storm/arcane/primal/blight/sacred/physical`), never by character class. `creatureAbilityBuilders.js` only references the 9 canonical damage types. Therefore the deprecated-name class of bug (master audit C3/C7) **does not and cannot occur here** — there is nothing to distinguish "intentional sub-tradition" from "buggy live tag," because no class tags exist at all.

The only "Fate-Weaver"-adjacent text is flavor: Sirin-Song is called *"the Fate-Weaver"* (creatures.json:15892 / creatureData.json:6642) as a creature epithet (manipulating "nine threads… birth, contract, dissolution"), **not** a class identifier. This is in-world prose, not a deprecated-class usage — leave as-is.

---

## SUMMARY TABLE

| ID | Sev | Issue | Files |
|---|---|---|---|
| CA-1 | 🟠 | "Solbrand" undefined entity term, 34× (object/faith/deity blur) | creatures.json + creatureData.json |
| CA-2 | 🟠 | Systematic real-world mythology/IP leakage (803 proper-noun hits; by design) | both creature files |
| CA-3 | 🟠 | Unratified polytheistic pantheon (~20 deity refs; canon magic model is bargain-based) | both creature files |
| CA-4 | 🟠 | Public `creatures.json` ↔ src `creatureData.json` diverged; public file un-decontaminated | both |
| CA-5 | 🟡 | v3 era-label strings FIXED; 4 prose echoes persist (Skaldic Kings / skalds / rune-singers / first fae) | both |
| CA-6 | 🟡 | "Root-Veil" undefined term, 1× | both |
| CA-7 | 🟡 | Husque = direct Keth-Amar leak (blurs Spawn/Channel tier) | both |
| CA-8 | ℹ️ | `creatureLibraryData.js` deleted; no action | — |

**Counts by severity:** 🟠 MAJOR = 4 · 🟡 MINOR = 3 · ℹ️ INFO = 1 · 🔴 CRITICAL = **0**

---

*End of Creatures & Abilities audit.*
