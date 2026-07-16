# LORE INFRASTRUCTURE — AUDIT

Scope: term-ID mappings, the auto-linker, the lore-display components, and
integrity checks (do referenced IDs resolve to `lore.json` keys?).

Benchmark: `CANON_REFERENCE.md` + Part 2 of `0_MASTER_LORE_MAP_AND_AUDIT.md`.

Method: parsed `vtt-react/public/data/lore.json` (273 top-level keys) and
cross-referenced every (a) `<LoreLink termId="X">` string-literal in `src/`,
(b) every `relatedTerms` target inside `lore.json`, (c) every id emitted by
`classLoreStore.js` `NAME_TO_ID`, and (d) the id-convention suspects named in
the brief (`the-wyrd`, `falseProphet`, `silent_seventh`) against `rules.json`.

---

## A. Coverage

Files in domain and what was checked:

| File | Role | Checked for |
|------|------|-------------|
| `constants/loreConstants.js` | Placeholder/hint strings for character lore fields | deprecated names, entity conflation in flavor text |
| `utils/loreAutoLinker.js` | Builds `<LoreLink termId>` from dictionary `entry.id`; skips text inside existing `<LoreLink>` | id≡key integrity; correct termId emission |
| `components/common/LoreLink.jsx` | Looks up `loreDictionary?.[termId]`; falls back to **plain text** (silent broken link) when missing | fallback behaviour, orphan visibility |
| `components/common/LoreTooltip.jsx` | Renders entry; `ALL_CLASSES_DATA.find(c=>c.id===entry.id)` for class worldFriction | hardcoded entity text / conflation; region-color keys |
| `styles/LoreTooltip.css` | Styling only | n/a (no lore content) |
| `components/character-sheet/Lore.jsx` | Character lore form; hardcodes the 20-class `<select>` list | deprecated class names in list |
| `components/world-map/LoreSidebar.jsx` | Region/location panel | demo data, entity text |
| `components/world/ClassLoreDetail.jsx` | Class lore viewer; uses **dynamic** `termId={loc.locationId}` / `{org.headquarters}` | dynamic-termId integrity risk |
| `components/rules/RaceEpicLore.jsx` | Race tome; runs `autoLinkTerminology` then re-parses `<LoreLink>` | parser correctness |
| `components/character-creation-wizard/steps/Step8LoreDetails.jsx` | Wizard lore fields | flavor-text canon |
| `store/classLoreStore.js` | `NAME_TO_ID` map → canonical class ids (5,471 lines, ~95% blank padding) | emitted ids vs lore.json keys; deprecated-alias handling |

External cross-checks: `rules.json` id-convention suspects; `.gemini` scratch
scripts.

---

## B. INCONSISTENCY MAP (ID, SEVERITY, LOCATION, ISSUE, NOTES)

### 🔴 L1 — `falseProphet` (camelCase) class id never resolves in `lore.json`
**LOC:** `store/classLoreStore.js:483` (`'false prophet': 'falseProphet'`) vs `lore.json` key `false_prophet`.
**ISSUE:** `classLoreStore` emits id `falseProphet`, but `lore.json` keys the class as `false_prophet` (snake_case). `LoreLink` does `loreDictionary?.[termId]` → `undefined` for `falseProphet`, and `LoreTooltip` does `ALL_CLASSES_DATA.find(c=>c.id===entry.id)` for worldFriction → symmetric miss. Result: the False Prophet class is the **one class whose tooltip/auto-link silently fails** everywhere the store id drives the lookup.
**NOTES:** `rules.json` correctly uses `false_prophet` (1×, verified). The master audit F10 already flagged the inverse mismatch in `factionStore.js` (`'false_prophet'` vs `'falseProphet'` → `getFactionsByClass` misses it). Same disease, store layer. Fix: standardize the canonical id to `false_prophet` in `NAME_TO_ID` value.

### 🔴 L2 — 8 hardcoded `<LoreLink termId="X">` in class data point at non-existent keys
**LOC:** `data/classes/animistData.js`, `augurData.js`, `gambitData.js`, `falseProphetData.js`, `inquisitorData.js`.
**ISSUE:** These bypass the dictionary-driven auto-linker (which is clean) and hardcode termIds that are **not** among the 273 lore.json keys, so every one renders as plain text with no tooltip (silent broken link). Full list in Section C.
**NOTES:** Mix of named NPCs (`bayar-wind-throat`, `eira_bone_reader`, `helgar_the_rejector`, `ignis_the_watcher`, `mother_ysen`), one location (`ironwood-palisade`), one concept (`monoliths` — real key is `sundered_monoliths`), and one people/subrace (`solvarn` — no key at all; content gap for the Sundale culture).

### 🟠 L3 — `the-wyrd` (hyphen) in `rules.json` vs `the_wyrd` (underscore) in `lore.json`
**LOC:** `rules.json` (1× `the-wyrd`); `lore.json` key = `the_wyrd`.
**ISSUE:** ID-convention mismatch — any cross-reference from rules → lore using the hyphen form will not resolve to `the_wyrd`. `lore.json` has **both** `the_wyrd` (entity) and `wyrd` (concept) — the duplicate/overlap already flagged as master-audit A14.
**NOTES:** Not rendered through the auto-linker (which only wraps dictionary terms), so not a *visible* broken LoreLink — but it is a broken join key. Fix: standardize on underscore; collapse the `the_wyrd`/`wyrd` duplicate.

### 🟠 L4 — bare `viridane` in `rules.json` vs `house_viridane` in `lore.json`
**LOC:** `rules.json` (6× `viridane`); `lore.json` key = `house_viridane`.
**ISSUE:** 6 references to the unprefixed `viridane` will not join to the lore key `house_viridane`. Combined with the separate `silent_seventh` concept entry (which lists `house_viridane` in its `relatedTerms`), the erasure layer is modeled but the bare-id shorthand is broken.
**NOTES:** Confirms brief's "`silent_seventh` not aliased to Viridane" concern: `silent_seventh` and `house_viridane` are two distinct entries (concept vs noble_house) linked only by a one-way `relatedTerms` pointer, with no shared id/alias and no reverse link — and bare `viridane` resolves to neither.

### 🟠 L5 — DEMO location data ships in production (`LoreSidebar.jsx`)
**LOC:** `components/world-map/LoreSidebar.jsx:46-56` (`EXAMPLES_ENABLED = true`).
**ISSUE:** 8 hard-coded `Example:` locations (Blackiron City, Mossford Village, Howling Tundra, Grimspire Peaks, Dustfalls Ruin, Whispering Tomb, Trapper's Camp, Scout's Chalk Note) are injected into **every** region's location list. None are Mythrill-canon; one even has a typo'd bracket. A banner tells devs to flip the flag off — it was never flipped.
**NOTES:** User-visible pollution of the world-map lore panel. Severity MAJOR. Fix: `EXAMPLES_ENABLED = false` (or delete the block).

### 🟠 L6 — `monoliths` termId points at the wrong key
**LOC:** `data/classes/animistData.js:172,250`.
**ISSUE:** `<LoreLink termId="monoliths">Monoliths</LoreLink>` — lore.json has no `monoliths` key; the concept key is `sundered_monoliths`. Two broken links.
**NOTES:** Distinct from the master-audit A2/Solvan Still-Heart issue (which is *content* inside the monolith entries); this is purely an ID miss.

### 🟡 L7 — Dynamic termIds (`locationId`, `headquarters`, `destinationId`) are unvalidated
**LOC:** `components/world/ClassLoreDetail.jsx:141` (`termId={loc.locationId}`), `:200` (`termId={org.headquarters}`); also `m.locationId`, `conn.destinationId` elsewhere.
**ISSUE:** Class/zone/org data objects supply termIds at runtime. Unlike the auto-linker (dictionary-derived, clean), nothing checks these against lore.json, so any class with a `classSpecificLocations[].locationId` or `organizations[].headquarters` that isn't a lore key produces a silent broken link. The 8 hardcoded orphans in L2 prove the class-data layer already contains non-existent ids; the dynamic paths are the same risk class and are not enumerable without a full data sweep.
**NOTES:** Recommend a build-time validator over `ALL_CLASSES_DATA` locationId/headquarters vs lore.json keys.

### 🟡 L8 — `solvarn` people-key is a content gap, not a misspelling
**LOC:** `gambitData.js:211`; `falseProphetData.js:103,206`.
**ISSUE:** "Solvarn" (the Sundale human subrace/culture) is referenced 3× via `<LoreLink termId="solvarn">`, but lore.json has no people/subrace key for it (only the `sundale` region). Three broken links, root cause = missing lore entity.
**NOTES:** Ties to master-audit theme 5 (no canonical human-subrace master list). Fix = add a `solvarn` entry (or alias to `sundale`/the subrace key once canonicalized).

### 🟡 L9 — Deprecated-sub-tradition aliasing conflicts with class data treating them as live
**LOC:** `store/classLoreStore.js:387` (`doomsayer: 'harbinger'`), `:321-322` (covenbane/exorcist→inquisitor), `:354-355` (deathcaller/lichborne→revenant), comments at `:419/:451/:673/:801/:960`.
**ISSUE:** `classLoreStore` consistently **redirects** deprecated names to their merger target. But per master-audit C3, `harbingerData.js`/`gambitData.js` still treat Chaos Weaver / Doomsayer / Fate Weaver / Gambler as **canonical sub-traditions**. Two systems hold opposite truths about the same names. The store is internally consistent; the conflict is cross-file.
**NOTES:** Not a broken link; a classification contradiction surfaced by the store's id map.

### 🟡 L10 — `LoreTooltip`/`LoreSidebar` display layer is itself clean; it surfaces data-layer conflation
**LOC:** `LoreTooltip.jsx`, `LoreSidebar.jsx`.
**ISSUE:** Neither component hardcodes entity text — `LoreTooltip` is type-driven (`entryIcons`, `regionColors` keyed by the 7 canonical regions; `statusStyle` for worldFriction). `regionColors` keys (`frostwood-reach`, `nordhalla`, `sundale`, `iceheart-sea`, `cragjaw-peaks`, `sundrift-vale`, `bryngloom-forest`) all match canonical regions.
**NOTES:** The conflation problems (master A5 Morvane=Root-Veil=Solbrand, A6 Watcher=Dead Moon) are **not** introduced by the display layer — they live in `lore.json` text and are faithfully rendered. No fix needed in these components for conflation.

### 🟡 L11 — `classLoreStore.js` is 5,471 lines, ~95% blank padding
**LOC:** whole file.
**ISSUE:** Massive vertical whitespace (blocks of 20-30 blank lines between every statement). Not a lore defect, but an integrity/maintainability hazard that makes review error-prone.
**NOTES:** Cosmetic; flag for cleanup.

---

## C. BROKEN / ORPHAN term-ID LIST

Legend: resolves? = does `lore.json[termId]` exist?

### Hardcoded `<LoreLink termId="X">` in class data (verified non-resolving)

| termId | resolves? | used in | suggested fix |
|--------|-----------|---------|---------------|
| `bayar-wind-throat` | ❌ NO | `animistData.js:167,234` | add `bayar-wind-throat` NPC entry, or repoint to existing NPC key |
| `eira_bone_reader` | ❌ NO | `augurData.js:89` | add entry or repoint |
| `helgar_the_rejector` | ❌ NO | `augurData.js:173` | add entry or repoint |
| `ignis_the_watcher` | ❌ NO | `augurData.js:137` | add entry or repoint |
| `mother_ysen` | ❌ NO | `augurData.js:105` | add entry or repoint |
| `ironwood-palisade` | ❌ NO | `inquisitorData.js:95` | add location entry or repoint |
| `monoliths` | ❌ NO | `animistData.js:172,250` | **repoint to `sundered_monoliths`** (key exists) |
| `solvarn` | ❌ NO | `gambitData.js:211`; `falseProphetData.js:103,206` | add `solvarn` people entry / alias to `sundale` |

### Class-store id vs lore.json key (verified non-resolving)

| emitted id (classLoreStore `NAME_TO_ID` value) | resolves? | lore.json key | suggested fix |
|--------------------------------------------------|-----------|---------------|---------------|
| `falseProphet` | ❌ NO | `false_prophet` | change value to `false_prophet` |

All other 20 class ids (`arcanoneer`…`warden`) resolve ✔.

### `relatedTerms` targets inside `lore.json`
**0 orphans** — every `relatedTerms` target resolves to a lore.json key. ✔

### id≡key integrity across all 273 entries
**0 mismatches** — for every key, `entry.id === key`, and every entry has a `.term`. ✔
(This is what keeps the auto-linker, which emits `termId="${entry.id}"`, clean for all dictionary-derived links.)

### `rules.json` id-convention mismatches (join keys, not LoreLink-rendered)

| id in rules.json | resolves to lore.json? | correct key | count |
|------------------|------------------------|-------------|-------|
| `the-wyrd` (hyphen) | ❌ NO | `the_wyrd` (underscore) | 1 |
| `viridane` (bare) | ❌ NO | `house_viridane` | 6 |
| `false_prophet` | ✔ YES | `false_prophet` | 1 |

### Brief's named suspects — verdict

| suspect | verdict |
|---------|---------|
| `the-wyrd` (hyphen, rules.json) vs `the_wyrd` (underscore, lore.json) | **confirmed mismatch** — rules.json uses hyphen once; lore key is underscore (L3) |
| `falseProphet` vs `false_prophet` | **confirmed mismatch** — at the *classLoreStore* layer (L1); rules.json itself is correct |
| `silent_seventh` not aliased to Viridane | **confirmed** — `silent_seventh` (concept) and `house_viridane` (noble_house) are distinct entries linked only one-way via `relatedTerms`; bare `viridane` resolves to neither (L4) |

---

## D. .gemini scratch divergence notes

- **No `generate_region1_lore.py` and no `lore_audit_report.md` exist** anywhere under `.gemini/brain/**`. Glob returned empty for both. The closest artefacts are region 2/5 generators and per-region bespoke appliers (see below) — so the "intended-but-divergent" signal for region 1 specifically is **not present** to compare.
- `.gemini/brain/ecd9207b-*/scratch/apply_renames.js` — a one-shot that rewrote **creature names** in `src/data/creatureData.js` away from real-world mythology (e.g. `Sluagh-Ride`→`Sluagh`, `Nidhoggr-Root`→`Níðhöggr`, `Tiamat-Scale`→`Scale of Tiamat`, `Lamashtu-Wail`→`Lamashtu`, plus Jorōgumo/Nurikabe/Tanuki/etc.). This is the IP/real-world-mythology leakage the master audit flags as A15. It shows the intended direction (strip the `-Suffix` compound creature names and use diacritic-correct mythic names) — divergence = any creature names still in the old `-Suffix` form.
- `.gemini/brain/ecd9207b-*/scratch/list_hyphenated.js` — companion lister for hyphenated creature `"name"` fields; confirms the hyphenated-name cleanup was scoped to `creatureData.js`, **not** to lore.json term-ids. So the `the-wyrd`/`ironwood-palisade` hyphen issues in lore/rules were never in scope of that pass.
- `.gemini/brain/e2220471-*/scratch/generate_region5.py` + `validate_region5.py` + `region5_raw.txt`, and `e3574b88-*/scratch/generate_region2.py` — region lore generators exist for regions 2 and 5 only; no region-1 generator. No divergence file to diff against current lore.json for region 1.
- `.gemini/brain/df94bb35-*/scratch/inject_class_lore.js` + `inject_remaining_class_lore.js` — class-lore injection scripts. These are the likely origin of the hardcoded `<LoreLink termId="...">` strings in the class data files (L2): injection scripts that hand-wrote termIds without validating them against lore.json keys. This explains *why* the 8 orphans exist — they were authored by a bulk injector, not the dictionary-aware auto-linker.
- `.gemini/brain/fbd9b16e-*/exorcist_*.md` and `ffdecafe-*/artifacts/{augur,doomsayer}_evaluation.md` — design evaluations for merged/deprecated classes (Exorcist→Inquisitor; Augur; Doomsayer→Harbinger). These are the decision docs behind the `classLoreStore` alias redirects (L9); they support the "deprecated" stance, which `harbingerData.js`/`gambitData.js` data did not fully honor.
- No scratch artefact references `false_prophet`/`falseProphet` casing or `the_wyrd`/`silent_seventh` — those mismatches were never on the scratch radar, consistent with them surviving uncaught.

---

### One-line integrity summary
The auto-linker + `relatedTerms` graph are internally clean (0 id≡key mismatches, 0 relatedTerms orphans), but the **hand-authored** layer is leaky: 8 hardcoded class-data LoreLinks + the `falseProphet` class-store id + `the-wyrd`/`viridane` in rules.json all fail to resolve, and 8 demo locations ship enabled in the world map.
