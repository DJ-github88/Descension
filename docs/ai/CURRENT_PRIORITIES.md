# Current priorities

Updated 2026-10-16 (P12A completion / P11 local closure). The full ledger, with hashes and evidence, is [`docs/ENGINEERING_STATE.md`](../ENGINEERING_STATE.md); this page is the short version.

## Delivered projects

| Project | Status |
|---|---|
| P1–P4 transport, saves, checkpoints, access | Implemented; P5 tracks their remaining environment gates |
| P5 account-bound drafts | 33 independently accepted; 9 environment-blocked gates open |
| P6 truthful character save | Independently source-accepted |
| P7 actor consequence and condition contract | Independently source-accepted 2026-10-14 |
| P8 Branvig Feather Slash | Independently source-accepted 2026-10-14 |
| P9 supported single-target spells | Independently source-accepted 2026-10-15; Sol's identified hook/build/production-App closure complete 2026-10-16 |
| P10 first-table rules and execution contract | Independently reviewed in isolation; bundle integrated and focused tests/build/real-browser verified 2026-10-16; human/operational gates open |
| P11 skill and weapon proficiency foundations | Bounded independent review PASS; PC production build/full-App closure completed with P12A, including actual device save/reload; live gates open |
| P12A basic single-die PC weapon strike → one bound creature | Implemented; one bounded independent source review PASS; manifested production build/full-App A1–A9 and P8/P9 regressions PASS |
| P12B-thin creature hit → owner block → atomic HP and wear (C1/D-E approved) | Implemented; one bounded independent review (BLOCK → repaired) PASS; integrated build, P12B App smoke and P12A/P8/P9 App regressions PASS; live gates open |

Source acceptance is not deployment readiness. Current P12B evidence: [`MYTHRILL_PROJECT_12B_IMPLEMENTATION.md`](../MYTHRILL_PROJECT_12B_IMPLEMENTATION.md). P12A/P11 evidence:
[`MYTHRILL_PROJECT_12A_IMPLEMENTATION.md`](../MYTHRILL_PROJECT_12A_IMPLEMENTATION.md).
Earlier P10 evidence remains in [`MYTHRILL_P10_INTEGRATION_20261016.md`](../MYTHRILL_P10_INTEGRATION_20261016.md).

## Open gates (not closed by any source acceptance)

- P5-05/07/09/10/11/12/13/31/32 environment gates.
- Human: creator validation of the published Laws/canon; one GM + two-player first session, physical and in the VTT.
- Live: real Firebase/rules/backend, two-device, staged deployment smoke, restart/restore. See [`MYTHRILL_FIRST_TABLE_RELEASE_CHECKLIST.md`](../MYTHRILL_FIRST_TABLE_RELEASE_CHECKLIST.md).

## Creator decisions

Decided for the first-table baseline (2026-10-15): 4 AP per PC turn, initiative once per fight, basic strike 2 AP, heritage AP set aside; approved defense and elixir Laws published with open items marked. Armor score, AC and armor rating are obsolete for characters and creatures. Creatures mitigate through flat DR, resistances/vulnerabilities and authored defensive effects; players also through equipment DR dice. Creature Defend improves damage reduction and stays GM-applied.

Skills (2026-10-16): growing proficiency die d4 Untrained → d20 Expert/Master; Standard = manual narrative rank selection, Advanced = authored-task advancement (same rolls); point-buy for initial allocation. Open: proficiency modifier/explosion/face lookup, rank check bonus, check resolution, point-buy budget and bonuses, AC/to-hit weapon faces. Skill-engine defects are a bounded follow-up.

Still open: `<attr>/K` rounding (P9; proposed: round down); AP restoration details beyond the baseline (race differences later?); unexecuted reaction cost (J4); own-turn reactions (J5); Raise Shield wording; Evasion cap/stacking and formula attacks; mitigation order and armor vs non-physical damage; criticals vs shields; which items count as elixirs and elixir timing; Spell Reaction's 2 AP and Evade; the amount, cost and duration of creature Defend; H13 operations owner and first-release decision.

## Next

Route creator Laws/canon validation and the existing first-table/environment gates; appoint the H13
operations owner. P11's ranks/budget/copy and local build/full-App gap are closed. P12A now shows raw
per-weapon proficiency rolls and explicit GM outcomes; modifier/explosion/table lookup stay open.
No face is inferred, no table damage is automatically added, and manual effects remain explicitly
not applied. Critical flat DR stays a GM ruling; armor bypass does not imply flat-DR bypass.

P11–P14 are defined in [`MYTHRILL_P11_P14_ROADMAP.md`](../MYTHRILL_P11_P14_ROADMAP.md).
**P12A is complete under frozen revision3a. P12B-thin is complete under frozen revision 4 §3 with C1/D-E approved (item die = blocking die and wear track); every other D-A…D-J / C2–C5 branch stays GM-adjudicated.**
Remaining decisions include off-tier resistance, mitigation/conversion order, equipment DR versus
non-physical damage, criticals versus shields (and backup shields on bypassed armor), deep storage, Evasion cap/formulas, obsolete
AC/to-hit wording, creature Defend, custom encoding and prose conflicts. Further P12B branches, P13 and P14 need their own
freeze and authorization. Contracts/brief:
[`MYTHRILL_PROJECT_12_CONTRACT.md`](../MYTHRILL_PROJECT_12_CONTRACT.md),
[`MYTHRILL_P12_CREATOR_DECISIONS.md`](../MYTHRILL_P12_CREATOR_DECISIONS.md).
