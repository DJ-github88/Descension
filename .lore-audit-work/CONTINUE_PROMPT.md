# HANDOFF PROMPT — copy everything below the line into a new chat

> **SUPERSEDED 25 July 2026.** This handoff prompt described the audit state at the START of the 25 Jul session. All items it lists have since been resolved (see DECISIONS.md D6-D12) or cancelled (see creatureData.json NOT-orphaned finding). Kept here for historical reference only. For current state, see DECISIONS.md (D1-D12), CANON_REFERENCE.md (with §14 status), and the Memory MCP entities.

---

You are continuing a large, in-progress lore-consistency project on the **Mythrill VTT** codebase (a TTRPG virtual tabletop). Working directory: `D:\VTT` (Windows, PowerShell). The React app lives in `D:\VTT\vtt-react\`. The repo is git-managed.

A complete two-pass lore audit was already performed and most fixes are applied. **Do NOT re-audit from scratch.** Your job is to continue executing the remaining work using the documentation already produced. Read the handoff files FIRST (below), then execute.

## STEP 0 — READ THESE FILES FIRST (they are the source of truth for this effort)
1. `D:\VTT\.lore-audit-work\DECISIONS.md` — the 5 ratified canon decisions (Aethil/Warden, Solbrand, entity boundaries, Cult of Forgotten Shadow, 7-houses) + 5 sub-decisions (Mimir subraces = Veiled/Tethered/Untethered; Myrathil = Shoreling/Deepling/Riverling; Vesper = Velun Neth female; Saren-Vel = dead; Admiral Varis → renamed Osric).
2. `D:\VTT\.lore-audit-work\RESOLUTIONS.md` — exactly what's fixed vs deferred, and FILES TOUCHED.
3. `D:\VTT\.lore-audit-work\CANON_REFERENCE.md` — distilled canon (note §11: Augur is Deepening-era, NOT Year 70 — the "Year 70" inference was retracted).
4. `D:\VTT\.lore-audit-work\0_MASTER_LORE_MAP_AND_AUDIT.md` + `0B_MASTER_PASS2_ADDENDUM.md` — the full audit findings with file:line refs.
5. `D:\VTT\.lore-audit-work\1_COSMOLOGY.md` … `12_LORE_INFRASTRUCTURE.md` — per-category detail.
6. `D:\VTT\docs\CORE_LORE_FRAMEWORK.md` — the canonical framework doc (now updated with the ratified decisions).

## STEP 1 — URGENT: SYNC THE STALE DATA COPIES
There are TWO copies of the data files. All fixes were applied ONLY to `D:\VTT\vtt-react\public\data\`. The root copies are now STALE (re-introduce all the fixed inconsistencies if anything reads them):
- `D:\VTT\public\data\lore.json`  ← stale (MD5 C57D02CE…)
- `D:\VTT\public\data\rules.json` ← stale
First, determine which copy is live (the React app in `vtt-react/` serves `vtt-react\public\data\`). Then either sync root ← vtt-react (copy content over) OR delete the root `D:\VTT\public\data\` folder if it's vestigial. Confirm with the user before deleting. Verify identical MD5s afterward. Also check whether `creatures.json`/`abilities.json` have the same two-copy drift.

## WHAT'S ALREADY DONE (do not redo)
- Full 2-pass audit (~250 lore entities + all data files) — see audit files.
- Tier 0 canon ratified into `CORE_LORE_FRAMEWORK.md`.
- Tier 1 gameplay bugs: EXAMPLES_ENABLED=false, dup `starter-oil-flask`→`starter-lantern-oil`, 10 orphan Justicar/Oathkeeper items→Spellguard, broken `monoliths` LoreLink→`sundered_monoliths`.
- Tier 2 narrative: Still-Heart genuine, Fexric-origin fixed, Cult synthesis, Watcher/Dead-Moon split, Aex willing-sacrifice + 7 houses (timelineStore), Shaper founder→Veyra, Kor-Vasseth age, Scathrach Binding-timing, Sereth, Vespera age, Thalreth bargain-counterparty, "8 houses"→7 everywhere, merged-count 6→8.
- Creative reskins: briaran epicHistory, Harbinger capstones (Keth-Amar deifying→adversarial), Inquisitor tree (demon→Wyrd-hound binder), Minstrel tree (forest→Iceheart tide/storm/Lyris). Augur = Deepening-era ratified.
- Decision-gated: Mimir/Myrathil subraces standardized in lore.json/rules.json; Vesper/Saren-Vel/Admiral-Osric fixed; 3 phantom talent imports removed.

## ENGINEERING GUARDRAILS (learned the hard way — follow exactly)
- **Verify every edit parses.** JSON: `try { Get-Content <file> -Raw | ConvertFrom-Json } catch { $_ }`. JS modules: `Get-Content <file> -Raw | node --check --input-type=module` (NOT plain `node --check` — these are ES modules; plain check falsely errors on `import`/`export`).
- **Apostrophes in single-quoted JS strings MUST be escaped** as `\'`. When you write flavor text with `'` (e.g. "Wyrd's", "storm's"), write `\'`. This is the #1 cause of breakage.
- **Two namespaces, do not conflate:** camelCase **code classId** (`falseProphet`, `augur`) used in deepLocationData/factionStore/timelineStore/resource-bars vs snake_case **lore termId** (`false_prophet`) in lore.json `<LoreLink>`/`relatedTerms`. `falseProphet` is NOT a bug — do not "fix" it. They join via a normalization layer.
- **NEVER edit `icon:` strings** (e.g. `spell_shadow_demonicempathy`, `spell_nature_riptide`) — they are WoW icon identifiers used by the UI, even if they contain deprecated/real-world words. Only edit `name:`/`description:` prose.
- **Deprecated class names — three kinds, handle differently:**
  1. Comments (`// 'Deathcaller' merged into Revenant`), `classMigration.js`, and the in-world sub-tradition names inside Harbinger (Chaos Weaver/Doomsayer) & Gambit (Gambler/Fate Weaver) data = **INTENTIONAL, leave them.**
  2. Live `classes:` array tags / generator calls using deprecated names where the canonical class is meant = **BUG, fix.**
  3. Talent-tree boilerplate like Inquisitor "Covenbane" = fix to canonical.
- **"Fexric" vs "Fexrick" is an intentional convention** (`fexrick.js:2-5`: Fexrick = collective noun for the race; Fexric = adjective/plural). NOT a bug. (Only the separate runoff-vermin species also called "Fexrick" is confusing — low priority.)
- **"Eight houses"** = objective error (canon: 7 signed, Viridane was the original 7th, Morrath the post-Breach substitute). The Briaran "8th house" is a folk SELF-TITLE only — allowed inside clearly-labeled Briaran belief, never as narrator fact.
- Keep both lore.json copies in sync (see STEP 1).
- Don't commit unless asked. The user is highly engaged and prefers to make creative-direction decisions via the interactive question tool when there's a genuine fork.

## REMAINING WORK — THREE BUCKETS (user recommends doing #2 first)

### BUCKET 2 (recommended next) — CODE SURGERY (needs verification, highest functional risk)
Silent gameplay-breaking bugs surfaced by the audit. Verify each fix with `node --check` and grep; ideally run the test suite (`vtt-react\src\data\__tests__` and `server\tests`) if available.
- **Spell-dispatch spec-ID schemes (P2-2):**
  - `vtt-react\src\data\classSpellGenerator.js`: `determineChaosWeaverSpecialization` returns Harbinger spec IDs that exist nowhere (`chaos_dice`/`entropy_control`/`reality_bending`) — canonical Harbinger specs are `wild_prophet`/`deaths_seer`/`fate_rift`.
  - Same file: `determineMartyrSpecialization` returns `redeemer`/`avenger`/`protector` — matches no canonical Martyr spec list.
  - `vtt-react\src\data\spellTemplates.js`: `adaptTemplateForClass` is keyed on 24 non-canonical class names (`chronomancer`, `dreadnaught`, `druid`, `shaman`…) → silent no-op for 18 of 20 real classes.
  - `resourceTypes.js`: unreachable `classRestriction` values (`harrow`/`monk`/`hexer`/`warlock`/`dreadnaught`).
  - Martyr spec list diverges across 3 files (`martyrData.js:735` Ironclad never reaches `classSpellCategories`).
  - Cross-check the canonical spec IDs against `vtt-react\src\data\classSpellCategories.js` and each class's `*Data.js` before rewriting, so the generated IDs actually resolve.
- **Timeline `classIds` anachronisms (F9):** ~22 events in `timelineStore.js` tag classes decades/centuries before their founding (v3 B-01..B-10 + 16 new: lunarch/berserker/minstrel/pyrofiend/apex/animist/arcanoneer/warden/shaper×3/gambit×2/toxicologist/inquisitor). `classIds` serve as `getEventsByClass()` relevance tags. Decision needed per tag: remove, or relocate to an event after the class's founding year. Use founding-year canon from `CANON_REFERENCE.md` §11 (Augur=Deepening-era; Warden~Y70; Gambit/Shaper~Y350; Harbinger/Toxicologist/Inquisitor~Y380; Plaguebringer~Y500; Revenant~Y550; False Prophet~Y598).
- **Timeline pulse math (F4):** Year-660 pulse labeled both "55th" (event) and "65th" (REBIRTH_CYCLES); cadence packs 63 pulses into 214 years then a 419-year gap (canon: 8–20-yr spacing, ~12 avg). Reconcile to canon §3.2 (65 pulses 40%→0%).

### BUCKET 1 — BULK IP/MYTHOLOGY CLEANUP (large, mostly cosmetic/low-risk)
~803 real-world-myth proper nouns across `creatureData.json` + `creatures.json` (Fenrir/Ragnarök/Níðhöggr/Tiamat/Apep/Shamash/Strigoi/Vetala/Zmey/"Yokai"/"Mongol"…) + ~20 unratified polytheistic deities (Perchta, Serket, Wadjet, Horus, Heket, Olokun…). `LORE_STYLE_GUIDE.md` warns against these. Also: `lootItemsData.js` D&D races (dwarves/elves/orcs/goblins, "Runelord Thrain", "Mount Thunderpeak"); `summonableTokens.js` Inquisitor fiends (Imp/Pit Fiend/Balor/Demon Prince — now doubly wrong since Inquisitor is Wyrd-themed); public `creatures.json` ↔ src `creatureData.json` drift ("Irish/Gaelic" vs "Skaldic"). Replace with original Mythrill lore. This is a big creative pass; consider delegating per-file to subagents with strict guardrails (only `name`/`description`/`lore` text; never touch statblock mechanics or icon ids).

### BUCKET 3 — CONTENT GAPS
- Missing NPCs: **Bayarmaa Ordavan** (the sitting Khatun who deposed Loras — only a factionStore leader npcId, no entry anywhere) + 7 lore.json stubs missing from `npcStore.js` (Deep-Alchemist Prime, Vat-Breaker Foreman, Solvan/Mereval/Tesshan/Morrath Stewards, Vellan Archivist).
- 41 of 49 factions in `factionStore.js` have empty `members: []`.
- "Solbrand Order" (the Solvan knightly order — ratified D2) has no factionStore entry; 6 social castes (Forgotten/Fredløse/Deck-Born/Bilge-Dwellers/Mounted/Unmounted) exist only as lore concepts.
- 6 broken hardcoded `<LoreLink termId>` in class data (`bayar-wind-throat`, `eira_bone_reader`, `helgar_the_rejector`, `ignis_the_watcher`, `mother_ysen`, `ironwood-palisade`, `solvarn`) — either create matching lore.json entries or strip the LoreLink wrapping to plain text.

## HOW TO OPERATE
- Be concise in chat; use the question tool for genuine creative forks.
- After each fix batch, re-verify parsing (JSON + `node --check --input-type=module`) and update `D:\VTT\.lore-audit-work\RESOLUTIONS.md`.
- Start by reading the STEP 0 files, then do STEP 1 (sync stale copies — confirm with user first), then begin BUCKET 2. State your plan briefly before editing.
