# RI-7 — Berserker + Martyr + Warden + Crusader complete content lock

**Date:** 2026-10-27  
**Status:** IMPLEMENTED — retained legacy roster content integrated with explicit progression; unsupported mechanics remain manual.  
**Machine-readable lock:** [CONTENT-LOCK.json](CONTENT-LOCK.json)  
**Evidence report:** [REPORT.md](REPORT.md)

## Scope

RI-7 finishes the four retained roster classes in documented order. Their authored spell libraries, trees, resource systems, guides and HUDs already existed; this cohort adds the missing explicit progression/manifest layer, integration tests and verification. No class was rebuilt, truncated, renamed or converted, and no legacy save data was migrated.

| Class | Authored spells | Pools (L1…L10) | Trees | Nodes | Ranks | Resource |
|---|---:|---|---:|---:|---:|---|
| Berserker | 47 | 9/4/4/4/4/4/4/4/4/4 | 3 | 54 | 150 | Rage / Blood-Heat |
| Martyr | 48 | 7/8/4/4/4/4/4/4/4/4 | 4 | 73 | 200 | Devotion |
| Warden | 46 | 5/8/4/4/4/4/4/4/4/4 | 4 | 77 | 200 | Tension / Vengeance |
| Crusader | 41 | 5/4/4/4/4/4/4/4/4/4 | 3 | 57 | 150 | Fervor |

Each tree remains a complete 50-point tree. Martyr keeps Ironclad and Warden keeps its fourth tree; no tree was deleted for a quota.

## Explicit progression policy

All four classes expose `progression.policy`:

- `startingSpellPicks: 3`.
- `optionalPicksPerLevel: 1`.
- `allowEarlierUnchosen: true`.
- `grantedCoreSpellIds: []`.
- `randomizeStartingSpells: false`, `autoTopUpOnLoad: false`.
- `talentActivesAreGrants: false`, `manualOnly: true`.

Existing known spells are not rewritten; new characters choose three level-1 options and one optional per level.

## Identities and trees

### Berserker

- Role: Striker/Juggernaut; resource **Rage** (`bloodHeat`), 0–100 with pain-immunity/frenzy/burnout thresholds.
- Trees: `savage`, `juggernaut`, `warlord`.
- Native retained: `skald_human`, `thrask_solari`, `morgh_groven`.
- Manifest: `BERSERKER_MANIFEST`.

### Martyr

- Role: Sacrificial Tank; resource **Devotion** (`devotionGauge`), cumulative damage thresholds 0/10/20/40/60/80/100.
- Trees: `redemption`, `zealot`, `ascetic`, `ironclad`.
- Native retained: `korr_solari`, `thrask_solari`, `morgh_groven`, `ithran_groven`, `skald_human`.
- Manifest: `MARTYR_MANIFEST`.

### Warden

- Role: Territory Controller; resource **Tension** (`vengeance-points`), 0–10.
- Trees: `shadowblade`, `jailer`, `vengeance-seeker`, `monolith`.
- Native retained: `morgh_groven`, `ithran_groven`, `drall_fexric`, `kethrin_fexric`, `skald_human`, `clean_vreken`, `marked_vreken`.
- Manifest: `WARDEN_MANIFEST`.

### Crusader

- Role: Vanguard/Holy Defender; resource **Fervor** (`radiantFervor`), 0–100 with Harmonic Stance at 50 and Judgment at 100.
- Trees: `solar_justiciar`, `dawn_bastion`, `harmonic_inquisitor`.
- Native retained: `skald_human`, `thrask_solari`, `silath_astril`.
- Manifest: `CRUSADER_MANIFEST`.

## Shared fixes included

- **Max HP/MP source of truth:** `utils/characterResourceSnapshot.js` now feeds store recalc, roster cards, inspection and the character panel. The panel display uses snapshot maxima rather than a separate breakdown. `characterResourceAgreement.test.js` compares persisted, roster snapshot and store/view source for Minstrel Merryn, Chronarch Tessic and an already-agreeing Arcanoneer Nethien control.
- Restored concurrent CharacterPanel locals (`current`, `healingBreakdown`, `manaRegenBreakdown`) lost in a concurrent edit.
- Updated the stale Step9 test mock and changed the non-policy control in `chaosWeaverProgression` to Pyrofiend.

## Known limits

- Guest/local persistence only; no account/cloud persistence claim.
- Manual/class content only; no combat automation, balance validation, migration, deployment, commit, push or Sol acceptance.
- No class-specific workaround was added for the shared resource calculation.
