# RI-8 Plaguebringer — implementation evidence

**Date:** 2026-10-23 implementation; 2026-10-25 character round-trip check  
**HEAD:** `77c110db` (worktree dirty; unrelated P14-A7 changes remain uncommitted)  
**Status:** implementation and focused verification complete; full save/reopen round-trip blocked by shared wizard/view defects; no Plaguebringer-specific defect found; no commit, push or deploy.

## Scope

Completed the Plaguebringer pass through the existing class system without rebuilding or retiring legacy content:

- preserved the 50 authored spells, 46 optional records, 2 core grants, 2 unslotted passives, 57 talent nodes and 150 talent ranks;
- preserved all legacy IDs, names, ranks and effects;
- added tier level gates and explicit capstone metadata in place;
- fixed Virulence cost planning for talent spells projected through the shared converter;
- generated a human-readable and machine-readable content lock with source hashes;
- kept contagion, spread, lifecycle and resource application manual-only.

Dossiers and manifests remain outside this implementation. This report does not claim automated combat execution, balance validation, Sol acceptance or production admission.

## Content lock

| Core | Optional | Unslotted passives | Trees | Nodes | Ranks | Capstones |
|---:|---:|---:|---:|---:|---:|---:|
| 2 | 46 | 2 | 3 | 57 | 150 | 3 |

- One starting optional pick and one optional pick per level; earlier unchosen pools remain legal.
- Five talent points per level, 50 total; tiers 1–6 unlock at character levels 1–6.
- Tier-7 passives unlock at level 8 with a 30-point in-tree gate.
- The one-rank tier-7 capstone in each tree requires level 10 and 45 same-tree points.
- Virulence is 0–100 with afflictions 0–10 and thresholds at 25/50/75.
- The two unslotted passives (`plague_incubation_period`, `plague_sterile_environment`) are catalogue records, not level-up grants.

The complete snapshot is `CONTENT-LOCK.md` and `CONTENT-LOCK.json`. All five source hashes in the JSON match the current files.

## Implementation notes

- `plaguebringerResourceContract.js` now reads `resourceCost.resourceTypes` containing `virulence` and `resourceValues.virulence`, including object amounts (`current`, `baseAmount`, `amount`).
- `plaguebringerData.js` now adds `minLevel`, `requiresPoints` and `capstone` to every tree node, and carries those fields into `PLAGUEBRINGER_TALENT_NODES`.
- Capstones are the tier-7 one-rank ACTIVE nodes: `vs_t7_patient_zero`, `tw_t7_grand_puppet`, `dh_t7_the_deep_garden`.
- `PLAGUEBRINGER_PROJECTED_SPELLS_BY_ID` remains empty. Active talent grants continue through the legacy converter as `talent-spell-*`; the reconciliation bypass is harmless because Plaguebringer nodes have no `passiveSpellId`.
- Added `plaguebringerIntegration.test.js` and extended the progression/resource tests.

## Verification

### Automated

| Check | Result | Evidence |
|---|---|---|
| Focused Plaguebringer suites | 6 suites, 44 tests passed | terminal output |
| Scoped ESLint | 0 errors | `npx eslint` on changed source/tests |
| Production build | exit `0`, “Compiled successfully.” | `D:\AppData\Temp\opencode\ri8-build.log`, `ri8-build.exit` |
| Content-lock source hashes | 5/5 match | SHA-256 comparison |
| Whitespace check | clean; CRLF conversion warnings only | `git diff --check` |

Focused suites: `plaguebringerProgression`, `plaguebringerIntegration`, `plaguebringerResourceContract`, `TalentTreeContent`, `PlaguebringerResourceBar`, `Step1CoreDraftPlaguebringer`.

### Browser

Playwright against the running app at `http://localhost:3000`:

- Classes catalogue exposes the Plaguebringer entry.
- Class detail resolves the Virulence resource panel and three specializations.
- Virulent Spreader opens its talent tree with Patient Zero present.
- Patient Zero reports “Requires character level 10” and “Requires 45 points spent in Virulent Spreader”, and is marked locked at the current level.
- At 390×844 the page has no horizontal overflow (`scrollWidth === innerWidth`).
- Console: 1 unrelated error (`Error loading user maps: Missing or insufficient permissions`) and 1 warning.

Screenshot: `plaguebringer-capstone.png`.

## Character round-trip verification (2026-10-25)

### Route and creation

Exercised `http://localhost:3000/account/characters/create` through all five wizard steps:

1. Hero Draft: Bedel Mycellan, Plaguebringer, Apothecary, Neutral Good, name `Vesper Gloomwell`, all 19 ability points allocated, ancestral gifts `Deep-Glow Blood`, `Crypt-Pulse`, `Spore-Sense`, optional spell `Venomous Touch`.
2. Skills & Languages: `arcana` at `NOVICE`, language `Vatsign`.
3. Starting Equipment: five background items retained.
4. Lore & Details: backstory and marginalia entered.
5. Summary: no blockers; `Create Character` enabled.

Creation saved `char_1792754680486_r3rj9hueb` and redirected to `/account`; `/account/characters` listed one character with Bedel (Mycellan) / Plaguebringer and marked it active. The payload creation timestamp is `2026-10-23T11:24:40.486Z`; the blocked edit/view checks were re-run on 2026-10-25 against the persisted character.

### What persisted

The created payload was read back from `mythrill:p5:guest:character.roster` and `mythrill:p5:guest:character.guestRoster`:

- identity: `Vesper Gloomwell`, male, `Neutral Good`;
- heritage: `race:"vreken"`, `subrace:"clean_vreken"`;
- calling: `class:"Plaguebringer"`;
- origin: `background:"sanctuarySeneschal"`, the internal Apothecary ID (`backgroundData.js:2596`, name at `:2626`);
- skills: `selectedSkills:["arcana"]`; `arcana`, Medicine and Insight at `NOVICE`;
- languages: Wayfarer's Cant, Gloomtongue, Vatsign;
- lore: exact backstory and marginalia marker;
- class spells: `known_spells:["pb_curse_of_agony","pb_whisper_of_decay","pb_venomous_touch"]`;
- ancestry: `blood:"deep_glow_blood_clean"`, `song:"crypt_pulse_clean"`, `sense:"spore_sense_vreken"`;
- racial traits: Crypt-Pulse, Glow-Culture, Surgical Bloom;
- Plaguebringer resource in `guestRoster`: `type:"virulenceCultivation"`, current 0, max 100, afflictions 0/10;
- talents: `{}` at level 1, as expected;
- equipment/currency: five background items, 42g 2s.

The canonical creation `roster` omits `classResource` and `talents`; the hydrated `guestRoster` adds `classResource` with Virulence 0/100 and `talents:{}`. Both payloads keep `spells:[]`/`abilities:[]`; spell knowledge is stored in `class_spells.known_spells`, which `coreSlice.js:915` loads. The empty roster Abilities section is therefore a display issue, not a missing-spell save.

This confirms the Plaguebringer identity, heritage, origin, chosen spells, ancestral gifts, racial grants and Virulence initialization persisted. No Plaguebringer-specific content defect was found in this payload.

### Reopen result and boundary

Opening `/account/characters/edit/char_1792754680486_r3rj9hueb` retained name, heritage, calling, origin, gender, alignment and all three ancestral gifts. It did **not** produce a clean save/reopen pass:

- Step 1 shows `Starting Spells 0 of 1 chosen`; the edit summary omits the Grimoire and blocks with `Please select exactly 1 starting spell (currently 0 selected).`
- Step 5 shows `Strength cannot be below 5, You have spent 9 too many points`; `Update` is disabled.
- `/account/characters/view/char_1792754680486_r3rj9hueb` returns `Character not found`.
- `/account/characters` shows HP 50/50, MP 50/50, AP 3, speed 30 ft and an empty Abilities section, while the saved payload has HP 50/50, MP 25/25 (or 25/80 in `guestRoster`), AP 3/3, speed 25 ft, and three known class spells.

Boundary classification:

- `CharacterWizardContext.js:404` `LOAD_CHARACTER` does not restore `class_spells`, although `Step1CoreDraft.jsx:1380` reads `characterData.class_spells.known_spells`. This is a shared wizard edit-load defect, not Plaguebringer-only.
- `CharacterWizardContext.js:439-440` loads persisted `stats` as both `baseStats` and `finalStats`; the edit UI then reapplies racial/background modifiers. The creation save stores background-adjusted `finalStats` (`stats` in the payload omits Apothecary's +2 intelligence/+1 spirit/−1 strength), so reopening double-applies modifiers and can drive Strength below 5. This is a general stat/save-model defect.
- The character is stored in guest scope (`scopeKind:"guest"`, `scopeId:"local-guest"`, `dirty:true`, `cloudBinding:null`), not proven cloud persistence. The account route was accessible without a login prompt, but the saved roster key is guest-scoped.
- Console still reports `Error loading user maps: FirebaseError: Missing or insufficient permissions.` A page reload during the run reset in-memory wizard state once; creation had to be repeated.

Strongest production-path witnesses are the `/account/characters` roster entry and the two guest-roster payloads above. They are not a substitute for a clean edit/update pass, and this report does **not** claim one.

### Round-trip tests and changed paths

No new automated suite was run for this browser round-trip because no code was changed. The latest automated evidence remains the six focused suites / 44 tests, scoped ESLint clean, and production build exit 0 recorded below.

Changed/created RI-8 paths and current SHA-256:

| Path | SHA-256 |
|---|---|
| `vtt-react/src/components/character-creation-wizard/steps/Step1CoreDraft.jsx` | `78a98b24bbb42f5f707f2c9c8d21d91a6f708570453207e3fb88d7d2eca75dd1` |
| `vtt-react/src/components/character-creation-wizard/steps/__tests__/Step1CoreDraftPlaguebringer.test.jsx` | `3b14b1fee69208d85d27b5d6f3cc4ceda75aa667309d2bd2a5d3a5763be1b586` |
| `vtt-react/src/data/plaguebringerResourceContract.js` | `6bd3ba21f103a771328af7b53e6fc5508debe1feb3a704d7352d6a8a2625e6e8` |
| `vtt-react/src/data/classes/plaguebringerData.js` | `1daffb16c51e43e1937ef65d32652f269c88a9abb1a7f8c097664cdf1f34fc98` |
| `vtt-react/src/data/classes/__tests__/plaguebringerProgression.test.js` | `34296c822b3fd2eda9390342281bb64cafc7e53c2031d94df29bdc5614df67f1` |
| `vtt-react/src/data/classes/__tests__/plaguebringerIntegration.test.js` | `ffcfaa6ec5e6f6c79a770d2213541ca2ede8e8c06e3745f79d07bea95646e259` |
| `vtt-react/src/data/__tests__/plaguebringerResourceContract.test.js` | `bbc8f3acc763d6342a8e88dcb6e8ab682182a95c6115bfb872ace17e82b23cad` |
| `.../RI-8-plaguebringer/CONTENT-LOCK.md` | `ea9ee41662f8d3aee2c89c5c0ac9e69f6a2be3c629b87772b7b3b1be5f0e835b` |
| `.../RI-8-plaguebringer/CONTENT-LOCK.json` | `5e9d4e80a26c0d980d789596abc07ccc78ed2f825ef9f2c286963ec224f7fcb3` |
| `.../RI-8-plaguebringer/plaguebringer-capstone.png` | `e04b9b493ba1f6376fbc0c9387284da1f233a93ac728594675533c2dec604019` |

`REPORT.md` is intentionally omitted from the hash table because it is the document being updated.

## Not yet evidenced

- No clean edit/save round-trip: update is blocked by shared wizard validation.
- No character-sheet view: the view route returns `Character not found`.
- No authenticated cloud persistence confirmation; the saved roster is guest-scoped and dirty.
- No automated combat sequence, damage/balance run or server contract was executed; resource behavior remains manual tabletop.
- No commit, push or deploy was performed.

## Known limits

- The legacy trees have no separate level-3 signature node; the tier-7 capstone is the only explicitly marked capstone.
- Existing saves holding a capstone below level 10 or below the 45-point in-tree gate are pruned by the shared pruner. No automatic migration or refund is performed.
- The content lock is a snapshot of existing records, not a CR1 96-record package.
- The save/reopen failures are in shared wizard/edit and character-view code, not in the Plaguebringer data. Per the narrow Plaguebringer scope, shared wizard/view code was not modified.
- The persisted `stats` field omits background modifiers, while `LOAD_CHARACTER` uses that field as base stats and reapplies modifiers; this can block editing any character with racial/background modifiers.
- The edit wizard does not restore `class_spells`, so starting-spell validation reports `0 of 1` even though the saved payload contains all three known Plaguebringer spells.
- The character view route cannot resolve the saved guest-scoped character; roster surfaces disagree on HP/MP max values, speed and Ability count.
- The guest-scoped character is `dirty:true` with `cloudBinding:null`; cloud save/export/import remains unverified.
- Console still reports an unrelated Firebase permission error while loading user maps.
