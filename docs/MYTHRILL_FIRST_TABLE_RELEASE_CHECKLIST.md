# First-table release checklist (P10)

Updated 2026-10-16 for integration. A gate passes only with the evidence it requires. Unperformed gates remain explicit. This checklist does not authorize deployment. Local integrated verification is recorded separately in [MYTHRILL_P10_INTEGRATION_20261016.md](MYTHRILL_P10_INTEGRATION_20261016.md).

## Ownership (facts from the repository)

| Component | Delivery path in repo | Owner | Status |
|---|---|---|---|
| Frontend bundle | `netlify.toml` (Node 20, `npm run build:netlify`, socket URL `descension-mythrill.up.railway.app`); second path `Dockerfile` (Node 18, `npm run build`) | **Unassigned (H13)** | FAILED: two delivery paths; choose an authoritative release path and record the Firebase config it ships |
| Socket server | `server/` (`nixpacks.toml`, Node ≥ 20), Railway per socket URL | **Unassigned (H13)** | NOT VERIFIED: deployed version/config not established |
| Firestore rules / indexes | `firebase.json` → `firestore.rules`, `firestore.indexes.json` (eur3) | **Unassigned (H13)** | NOT VERIFIED: deployed rules not compared |
| Storage rules | `storage.rules` | **Unassigned (H13)** | NOT VERIFIED; uploads/community publish stay off until privacy gates are shown |
| Cloud Functions | `functions/` (cascade cleanup, storage triggers) | **Unassigned (H13)** | NOT VERIFIED: destructive Functions need proof before activation |
| Service-account key | Device `server/firebase-service-account.json`, ignored/untracked | Operator | Keep out of Git/builds; rotate if ever shared |

## Supported capability versions

- Static data: rules/lore 2.3.0, abilities 1.5.0 (explicitly also admits 1.4.0), creatures 2.12.0.
- P8 `feather-slash:v1`, Branvig only; receipt capability deliberately retains `feather-slash:v1/abilities:1.4.0` across both reviewed datasets.
- P9 `p9-spell:v1`, four authored spells; P7 command ≤ 2 actors. Everything else manual with diagnostic.

## Release gates

| Gate | Evidence required | Status |
|---|---|---|
| Staged smoke: configured Firebase auth, socket handshake, acknowledged mutation | Staged URL run log | NOT PERFORMED |
| Save / fault / rejoin on staged services | Run log with fault injection | NOT PERFORMED |
| Scratch checkpoint export and restore | Export file + restored room | NOT PERFORMED |
| Rollback rehearsal (frontend, server, rules together) | Compatible pairs + rehearsal | NOT PERFORMED |
| Two-device / two-client reconnect | Repeated scenario log | NOT PERFORMED |
| Reduced-motion / WebGL-off leaves rules unchanged | Browser check | NOT PERFORMED |
| Creator validation of Laws and canon | Creator sign-off | OPEN |
| One GM + two players: physical and VTT first session using First Table Reference | Session notes | OPEN |
| P5-05/07/09/10/11/12/13/31/32 | Per P5 ledger | OPEN |
| Personal data export and verified erasure for beta accounts | Procedure + rehearsal | NOT PERFORMED (external-beta gate) |

## Owner decision

H13: who owns deployment/recovery, and what is the first release? Recommended: free invited first-table release with built-in assets, uploads off. Until owner and required live evidence exist: **not release-ready**.

## Known residuals (not repaired by this integration)

- Encumbrance tooltip `statCalculationBreakdown.js` says -10/-20 ft; applied speed modifiers are -25%/-75%.
- No character/creature Armor score, AC, hidden armor rating or soak die. P10 removes the changed card/list/tooltip/codex/editor displays, hidden `getArmorRating`/`getSoakDie`, DR→`ac` copying, and Defending marker's unused `armor: 2`. Players use equipment DR dice, rare flat DR, resistance/vulnerability and Evasion distinctly. Creatures use flat DR, resistance/vulnerability and authored defensive effects, with no equipment wear. Legacy saved `armor`/`armorClass`/`ac` bytes and P7's accepted `armor` condition modifier stay, never converted to DR. Legacy buffs are unresolved, not current protection; TargetHUD/spell card say so. Unchanged PartyHUD still labels such a legacy buff "Armor". Dormant creature-wizard/library and unused new-character armor defaults remain stored, not current protection.
- Creature Defend stays GM-adjudicated; amount, cost and duration remain `[Open]`.
- Saved Attack/Defend spellbook copies can retain old costs until re-added; no player-data migration.
- A PC with saved `actionPoints.max: 3` retains 3 in combat until sheet recalculation; no silent migration. GM can set AP manually. Which sheet action rewrites it is not yet verified.
- Existing saved "Based on Initiative Roll" rooms keep their config until GM changes it.
- Duplicate other-class summary rows remain; only Gambit duplicates were in the named scope.
- Skill-system follow-up stays separate: per-weapon storage, conflicting roll paths, negative budget, misleading text outside P10 pages, and eventual proficiency integration into weapon combat. See implementation report for creator-open details.
