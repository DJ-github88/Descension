# RI-6 — Arcanoneer + Minstrel + Chronarch complete content lock

**Date:** 2026-10-27  
**Status:** IMPLEMENTED — retained legacy roster content integrated with explicit progression; manual/unsupported mechanics remain manual.  
**Machine-readable lock:** [CONTENT-LOCK.json](CONTENT-LOCK.json)  
**Evidence report:** [REPORT.md](REPORT.md)

## Scope

This cohort finishes the three retained roster classes in documented order. Their authored spell libraries, three trees, resource systems, guides and HUDs already existed; the cohort adds the missing explicit progression/manifest layer, integration tests and verification. No class was rebuilt, truncated, renamed or converted, and no legacy save data was migrated.

| Class | Authored spells | Pools (L1…L10) | Trees | Nodes | Ranks | Resource |
|---|---:|---|---:|---:|---:|---|
| Arcanoneer | 43 | 6/4/4/4/4/4/4/4/4/4 | 3 | 57 | 150 | Elemental Spheres |
| Minstrel | 51 | 9/5/6/4/4/4/4/4/4/4 | 3 | 57 | 150 | Musical Notes |
| Chronarch | 49 | 7/6/4/4/4/4/4/4/4/4 | 3 | 57 | 150 | Time Shards + Temporal Strain |

Each class keeps three complete 50-point trees. Node counts exceed the 54-node baseline because these retained classes have richer node layouts; the existing content was preserved rather than truncated.

## Explicit progression policy (new in this cohort)

All three classes now expose `progression.policy`:

- `startingSpellPicks: 3` — the historical three level-1 starting choices.
- `optionalPicksPerLevel: 1` — one authored pick per level.
- `allowEarlierUnchosen: true`.
- `grantedCoreSpellIds: []` — these retained classes have no separately granted core spell.
- `randomizeStartingSpells: false` and `autoTopUpOnLoad: false` — no random or automatic top-up; existing saved spell lists are not rewritten.
- `talentActivesAreGrants: false`; `manualOnly: true`.

Level pools remain exactly as authored, including the richer level-1/2/3 pools for Minstrel and Chronarch. The policy stops the old default `3 + (level − 1)` auto-assignment for new choices without deleting any known spell from an existing character.

## Class identities and trees

### Arcanoneer

- Role: Magi-ballistic Artillery / Elemental Combinator; resource **Elemental Spheres** (`elementalSpheres`); 4d8 roll, bank up to 12, 36-combination matrix.
- Trees: `prism_mage` (Prism Mage), `entropy_weaver` (Entropy Weaver), `sphere_architect` (Sphere Architect).
- Native subraces retained: `velun_neth`, `kethrin_fexric`, `drall_fexric`, `vashir_astril`.
- Identity manifest: `ARCANONEER_MANIFEST`, policy `ARCANONEER_PROGRESSION_POLICY`.

### Minstrel

- Role: Bardic Commander / Conductor of Living Resonance; resource **Musical Notes** (`musicalNotes`), seven pitches I–VII, bank max 35.
- Trees: `soulsinger` (Harmonic Weaving), `battlechoir` (Chord Combinations), `dissonance` (Musical Magic).
- Native subraces retained: `merryn_human`, `shoreling_myrathil`, `riverling_myrathil`, `deepling_myrathil`, `clean_vreken` (the registry also carries the concurrent Broken Mimir recommendation; no native edge is implemented).
- Identity manifest: `MINSTREL_MANIFEST`, policy `MINSTREL_PROGRESSION_POLICY`.

### Chronarch

- Role: Time Controller; resource **Time Shards + Temporal Strain** (`timeShardsStrain`), both max 10; finite anchors and backlash.
- Trees: `stasis` (Stasis), `displacement` (Displacement), `rewinding` (Rewinding).
- Native subraces retained: `kethrin_fexric`, `ithran_groven`, `tessen_human`, `velun_neth`.
- Identity manifest: `CHRONARCH_MANIFEST`, policy `CHRONARCH_PROGRESSION_POLICY`.

## Shared fixes made during the cohort

- Restored `hasClassPixelArt` in `classIconUtils.js`; class-detail/catalogue code already imported it, and its absence broke detail rendering.
- Roster/inspection derived resources now pass `ancestry` to `calculateDerivedStats` with race/subrace.
- Prior cohort tests accept the concurrent heritage-registry provenance records while still requiring no implemented heritage effects and no native access.

## Known limits

- Guest/local persistence only; no account/cloud persistence claim.
- Manual/class content only; no combat automation, balance validation, migration or deployment claim.
- The Minstrel/Chronarch view stat-tab max HP/MP remains +6 HP/+5 MP above persisted roster resources; this is a shared ancestry/derived-stat discrepancy, not fixed with a class-specific workaround. The Arcanoneer witness agrees.
- No commit, push, deploy or Sol acceptance.
