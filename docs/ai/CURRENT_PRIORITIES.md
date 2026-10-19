# Current priorities

Updated 2026-10-19 (W accepted complete; E1a execution contract prepared only; B2 acceptance retained). Actual checkout HEAD:
`8ba81efbf935e08d4fcd488a9b597f5eb8031b0f`, with substantial preserved uncommitted work. The full ledger,
with source identities/evidence, is [`docs/ENGINEERING_STATE.md`](../ENGINEERING_STATE.md).

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
| P12B-r1 recorded-roll preservation | Implemented/reviewed; stale-state revalidation, carry-forward only with ledger proof, closed offers; unavailable piece stays GM-adjudicated |
| P13A accepted-result narration and HP/temp-HP floats | Implemented/reviewed; AP/mana/wear narration only; visibility/dedup/recovery rules retained |
| P12C-B1 single-target map picking | Implemented/reviewed; advisory range/aim, exact refs, retained rolls; unsupported shared-room actions post manual notice and spend nothing |
| P12C-B2 §8.1 original Radiant Burst preview | Implemented; bounded independent source review accepted after repairs; final build3/App7 PASS. Selected channel,10ft circle/20ft origin reach, square grid; geometry only, not recipients/effects |
| P13B-W private declaration collector | Implemented; bounded independent source + final delta acceptance, final Build3/App4 PASS.8s, prior GM seal, private revisions/withdrawal, same-deadline reconnect, manual review/interruption; no payment/reservation/effect/execution |

Source acceptance is not deployment readiness. Current P12B evidence: [`MYTHRILL_PROJECT_12B_IMPLEMENTATION.md`](../MYTHRILL_PROJECT_12B_IMPLEMENTATION.md). P12A/P11 evidence:
[`MYTHRILL_PROJECT_12A_IMPLEMENTATION.md`](../MYTHRILL_PROJECT_12A_IMPLEMENTATION.md).
Earlier P10 evidence remains in [`MYTHRILL_P10_INTEGRATION_20261016.md`](../MYTHRILL_P10_INTEGRATION_20261016.md).

Latest evidence: [`MYTHRILL_SLICES_20261017_IMPLEMENTATION.md`](../MYTHRILL_SLICES_20261017_IMPLEMENTATION.md),
evening closure: production `registerRoomJoinedListener` shared with corrected harness, exactly one listener,
P12A 11 checks, repeated rejoins without duplicate consequences, slices/P12B/recovery/P9 regressions,
88 client suites/567 tests and production rebuild. Reused, not rerun for B2. Latest bounded B2 evidence:
[contract §15](../MYTHRILL_PROJECT_12C_B2_CONTRACT.md#15-first-slice-implementation-and-verification--2026-10-18);
affected9 suites/44 tests, final changed3 suites/11 tests (overlap), bounded independent review, build3
exit0/drift[] and actual-App7 with zero outbound effects. Operational/live gates remain separate.
Latest P13B handoff: [§11](../MYTHRILL_PROJECT_13B_CONTRACT.md#11-w-implementation-and-integrated-handoff--2026-10-19)
centralizes exact integrated source/review/build/result identities. Server9/9 and client3 suites/14
retained; only outstanding delta coverage ran (3 probes PASS), not another audit. Final client Build3
mismatches `[]`, asset `84547e1e…`, App4 PASS with no resource/P7 consequence emission or receipt0→0;
strict state comparison ignores only root/map actorProjection.cut. Lifecycle records are not accepted outcomes.

## Open gates (not closed by any source acceptance)

- P5-05/07/09/10/11/12/13/31/32 environment gates.
- Human: creator validation of the published Laws/canon; one GM + two-player first session, physical and in the VTT.
- Live: real Firebase/rules/backend, two-device, staged deployment smoke, restart/restore. See [`MYTHRILL_FIRST_TABLE_RELEASE_CHECKLIST.md`](../MYTHRILL_FIRST_TABLE_RELEASE_CHECKLIST.md).

## Creator decisions

Decided for the first-table baseline (2026-10-15): 4 AP per PC turn, initiative once per fight, basic strike 2 AP, heritage AP set aside; approved defense and elixir Laws published with open items marked. Armor score, AC and armor rating are obsolete for characters and creatures. Creatures mitigate through flat DR, resistances/vulnerabilities and authored defensive effects; players also through equipment DR dice. Creature Defend improves damage reduction and stays GM-applied.

Skills (2026-10-16): growing proficiency die d4 Untrained → d20 Expert/Master; Standard = manual narrative rank selection, Advanced = authored-task advancement (same rolls); point-buy for initial allocation. Open: proficiency modifier/explosion/face lookup, rank check bonus, check resolution, point-buy budget and bonuses, AC/to-hit weapon faces. Skill-engine defects are a bounded follow-up.

Still open: `<attr>/K` rounding (P9; proposed: round down); AP restoration details beyond the baseline (race differences later?); unexecuted reaction cost (J4); own-turn reactions (J5); Raise Shield wording; Evasion cap/stacking and formula attacks; mitigation order and armor vs non-physical damage; criticals vs shields; which items count as elixirs and elixir timing; Spell Reaction's 2 AP and Evade; the amount, cost and duration of creature Defend; H13 operations owner and first-release decision.

Area first-slice decisions **approved 2026-10-18:** G1 origin/centre reach, G3 positive overlap of any
known occupied grid cell counted once, G3a edge/corner contact excluded, G5 free point without snapping.
G1b/G3b/G4 remain independent; walls/G2, elevation/G6 and Radiant Burst recipient conflict stay manual.

Reaction collection **approved and delivered 2026-10-19:** D13-6b full8s/no normal early close, D13-11
both pre-cutoff correction/withdrawal with history, D13-10 explicit interrupted/manual takeover,
same-deadline reconnect and no grace/pause/extension. No fee/refund/order/effect rule thereby approved.

## Next

**Remaining wider capabilities require separate decisions/freeze/authorization:**

1. [`P12C-B2 conditional contract`](../MYTHRILL_PROJECT_12C_B2_CONTRACT.md): action-bound area preview,
   explicit geometry/origins, visible candidates, worked boundary/Large/gridless cases. No roll, payment,
   proposal, chat or effect. **§8.1 is delivered** under approved G1/G3/G3a/G5; G1b/G3b/G4 remain open,
   walls/G2 and elevation/G6 stay manual.
   Creator addition: [complete coverage matrix and per-mode gaps](../MYTHRILL_PROJECT_12C_B2_CONTRACT.md#9-targeting-and-propagation-coverage-matrix),
   save-path losses/contradictions, five representative flows and bounded phase sequence are prepared.
   Class-owned targeting-preservation/mapping needs a separate contract; B2 stays simple static preview.
   List/path aids, six propagation methods and persistent/linked/delayed recipients are not thereby executed.
   **Delivered first subset (§8.1):** original Radiant Burst ranged-circle/channel on square grid;
   recipient conflict remains GM-decided. No next spell/profile has been selected or authorized;
   G1b/G3b/G4 remain independent for widening. **Obstruction preparation (§14):** four-state diagnostics,
   door/transparent/partial/unknown handling, spatial freshness and scoped GM ruling; future shared P7
   enforcement seam identified. No current authoritative wall/cover/area rule or source repair implied.
2. [`P13B E1a proposal §12`](../MYTHRILL_PROJECT_13B_CONTRACT.md#12-smallest-next-execution-candidate--e1a-not-authorized):
   **Contract prepared for approval, no code authorized.** Exact original card/source hash,1-AP price,
   particular attack/Parry and authenticated GM success/prior-payment attestation; exact owner/target
   consent, retained physical/digital rolls, GM damage, single P7 AP/HP+once-only opportunity consumption.
   Bind a valid fresh closed Riposte follow-up, or manually attest/open that fresh8s follow-up through W;
   same execution path, no name-only authority or automatic counter-attack. Prior Parry is not charged
   again. Cancellation/stale/ACK/rejoin/restart/privacy semantics are specified. W acceptance unchanged;
   no review/build repeated. No new rule answer blocks manual arithmetic/eligibility/fees, but contract/
   implementation go-ahead is still required; no automatic Parry/chain/typed price/A1b.
3. [`Compact creator packet rev4`](../MYTHRILL_DECISIONS_AREA_AND_REACTIONS_BATCH1.md): collection decisions
   answered. Card arithmetic/order/own-turn/unexecuted fees remain manual unless a later named slice actually
   automates them; do not ask those questions merely to reopen the completed collector.

**Broader combat roadmap remains open:** eligible reaction-card highlighting backed by actual authored
triggers; Counterspell/Intervene and subsequent causal chains; shared condition/buff/debuff expiry/proc/
stacking lifecycle; authoritative obstruction and broader per-profile propagation. E1a claims none of
these merely by applying an approved AP/HP consequence. Existing P7 record operations/advisory geometry
do not close those lifecycle or spatial capabilities.

**Coordination:** [`shared ownership/dependencies`](../MYTHRILL_CROSS_TRACK_COORDINATION.md).
Main combat HQ owns shared execution/authority/persistence; Class HeadQ owns class packages and reviewed
domain rules. Current class handoff33 parks A1b. W1a/W1b corrected exact-price/template behaviour and A1a
hash `48b69255…` are preserved; A1a is server-only/unhooked (correction-plus-verification evidence). C1's
reported local manual workshop is not shared execution. Cards/wagers, typed banks, links, real entities,
body/loadouts and delayed effects remain distinct. R1/CR-L1 proposals are not approved payment schemas.

**Class update:**33's delivery model is superseded by34/RI-1 normal class integration. Latest parent
checkpoint reports RI-1 independent BLOCK/corrections pending; its recovery state/class paths are
preserved. Normal-surface integration does not establish reaction execution or resource reservations.

No **wider** B2/P13B execution/area execution implementation is authorized by the completed B2/W slices. Next shared-engine
slice requires its own bounded freeze/authorization; Class-owned zero/export preservation continues
independently. No commit/push/deployment in this task.

**Other standing priorities:**

Route creator Laws/canon validation and the existing first-table/environment gates; appoint the H13
operations owner. P11's ranks/budget/copy and local build/full-App gap are closed. P12A now shows raw
per-weapon proficiency rolls and explicit GM outcomes; modifier/explosion/table lookup stay open.
No face is inferred, no table damage is automatically added, and manual effects remain explicitly
not applied. Critical flat DR stays a GM ruling; armor bypass does not imply flat-DR bypass.

P11–P14 are defined in [`MYTHRILL_P11_P14_ROADMAP.md`](../MYTHRILL_P11_P14_ROADMAP.md).
**P12A is complete under frozen revision3a. P12B-thin is complete under frozen revision 4 §3 with C1/D-E approved (item die = blocking die and wear track); every other D-A…D-J / C2–C5 branch stays GM-adjudicated.**
Remaining decisions include off-tier resistance, mitigation/conversion order, equipment DR versus
non-physical damage, criticals versus shields (and backup shields on bypassed armor), deep storage, Evasion cap/formulas, obsolete
AC/to-hit wording, creature Defend, custom encoding and prose conflicts. Further P12B branches, P13B execution and P14 need their own
freeze and authorization; P13A is already complete. S1 (unavailable block piece), F1 (AP/mana/wear floats)
and an optional manual “pay listed costs” control remain separate open follow-ups. Contracts/brief:
[`MYTHRILL_PROJECT_12_CONTRACT.md`](../MYTHRILL_PROJECT_12_CONTRACT.md),
[`MYTHRILL_P12_CREATOR_DECISIONS.md`](../MYTHRILL_P12_CREATOR_DECISIONS.md).
