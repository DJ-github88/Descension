# P12A — Basic Weapon Strike implementation and acceptance

2026-10-16 · frozen contract revision 3a · checkout `D:/VTT` · HEAD
`8ea1abff1d8c1f959b2d4a10e6b7ca73879c2ff2`.

## Status

| Gate | Result |
|---|---|
| P12A implementation | **Complete** for PC → one bound creature, one basic single-die strike |
| Independent source acceptance | **PASS**, one bounded review with concrete repairs; [report](MYTHRILL_P12A_INDEPENDENT_REVIEW_20261016.md) |
| Integrated production build / App | **PASS** for the manifested frozen source below |
| P11 outstanding build / full-App closure | **Closed locally**, including actual device save/reload; backend/human gates remain separate |
| P12B / creator decisions D-A…D-J | **Preparation only; none approved or implemented** |

No commit, push, deployment, reset, dependency upgrade or unrelated cleanup was performed.
Concurrent source, data, presentation and asset work was preserved.

## Interruption point and the recorded failures

The actual checkout already contained `server/services/strikeApprovals.js`, its registered handler,
dispatch/event/rate-limit additions, and `server/tests/p12aWeaponStrike.production.test.js`. Its seven
tests passed on takeover. No P12 client files or browser witnesses were present. The checkout's
contract was revision **3a** and the creator brief revision **3**. The separately named `(1)` attachments
and partial transcript were not exposed as files in the workspace; the historical clues in the HQ
request were used only to target verification, never as executable instructions.

The three interruption diagnostics now have a dedicated registered-stack witness:

1. **`invalid_resources` before `approval_consumed`:** rebuilding the fixture after its first strike
   produces AP −1 because only 1 AP remains. P7 correctly rejects that malformed command before
   binder dispatch. A different command ID carrying the original **valid** actor entries receives
   `approval_consumed`. Neither path spends again; same-command and same-approval checks recover
   the original receipt, even when current AP is insufficient for a new strike.
2. **`invalid_consequence` before a capability diagnostic:** an object-valued definition hash is
   rejected by P7's primitive adjudication schema. A string-valued cross-capability identity is now
   refused by the shared collision guard as `command_id_conflict`. No weaker P7 validation or
   cosmetic expected-string substitution was introduced.
3. **`insufficient_resources` before `awaiting_gm`:** a genuinely new approval after the fixture has
   paid needs new AP. The runtime-change fixture replenishes AP explicitly before creating its
   next independent approval. A check of an already accepted approval returns its receipt before
   the affordability check.

## Production changes

- **Server registry:** strict ApprovalV1 and decoded chosen-result schemas; capability
  `p12a-strike:v1`; chain and damage derivations; exact source/target/definition/revision binding;
  server-recomputed temp-first AP −2 and creature HP; bounded pending/closed-ID custody.
- **Authority:** owner primary attachment at registration; current direct GM command at consumption;
  membership, generation, owner, registry/hash/closed/consumed state and resource rechecks after the
  authority await. Admission and consumption remain synchronous and atomic through P7.
- **P9 isolation:** P9 module and approval-handler bodies remain unchanged. The shared binder gate
  refuses reverse-order or racing cross-registry identities before either domain can consume them.
  Ordinary exact-command receipt recovery still precedes this gate. The frozen P9 public-receipt
  echo behavior is preserved.
- **Client:** `services/weaponStrike.js`, `weaponStrikeService.js`, `weaponStrikeCustody.js`,
  `components/hud/WeaponStrikePanel.jsx` and CSS; real HUD/sheet routing, host and socket registration;
  private user-scoped family `room.strikeConsequenceLatest`.
- **Producers:** main-hand basic Attack, ranged basic Attack and universal Attack using the main hand.
  Unarmed is 1d4 smashing. Unsupported actions retain their manual path/diagnostic; named abilities
  and existing P9 spells do not enter this controller.
- **GM summary:** exact actors, owner-reported weapon/attribute/rank, raw weapon/proficiency faces,
  complete authored table and explicitly unselected proficiency ruling, relevant private defenses,
  one defense verdict where needed, final amount/reason and one **Confirm and apply** control.
- **Recovery:** approval and prepared GM command are retained before emission. Reload/rejoin never
  automatically resubmits them. Explicit checks resend the original bytes/ID. Uncertain outcomes
  remain unresolved until checked or explicitly reconciled; definitive CAS refusals permit explicit
  correction. Terminal GM history is bounded separately from unresolved command custody.

### Unresolved rules remain visible

Growing per-weapon proficiency dice are used; the legacy shared rank is never applied implicitly.
No proficiency face is inferred, no table damage is added, and no prose becomes an executable
effect. Complete chosen text is recorded and presented as **Not applied by the VTT**. Critical
modifier interpretation, proficiency modifier/explosion/lookup, off-tier resistance, edited/custom
encoding, conflicting defensive prose and combined mitigation remain GM rulings.

**Rare flat DR on a critical is GM-adjudicated, not automatically bypassed.** Equipment armor bypass
does not establish a flat-DR rule. Armor values remain obsolete information. The contract records
this narrow clarification, pending tombstone reservation and the cross-domain collision repair.

Accepted cards/chat come from public P7 receipts and confirm only AP/HP. They do not claim stun,
wear, free attacks, movement, ammunition or other manual effects. New public adjudication data
contains one weapon rank and defense categories, never full `skillRanks` or the private defense
list/prose. Explicitly public GM notes are labelled in the panel.

## Verification

| Witness | Evidence / outcome |
|---|---|
| A1 miss | Registered server and actual App: AP −2 temporary first; HP unchanged; fumble line; nonzero miss damage refused |
| A2 hit | Production planner/server/App: weapon face + floor((score−10)/2); Strength/Agility selection; no proficiency bonus inferred |
| A3 critical / parity | Broken chains refused; 8,8,3 →19; physical/digital face parity in pure production-module checks; both real panel controls exercised |
| A4 proficiency | Sword Trained d8 vs bow Novice d6; stored/quest/default owner; legacy ignored; unknown item requires type; GM choice starts empty |
| A5 truthful manual effects | Actual face18 complete text in accepted receipt/card; no automatic +7 or AP-loss effect; missing required lines refused |
| A6 defenses | Production classifier arithmetic and manual exceptions; server tier arithmetic and held-condition DR verification; critical flat DR explicitly manual |
| A7 final adjustment | Missing reason prevents even an emission in App; registered server refuses mismatches; proposed/post-defense/final preserved |
| A8 authority / recovery | Stale/deleted/retired targets, owner departure, wrong price/resources, revoked GM after handler await; duplicate/conflicting IDs; consumed approval under different command; exact known-receipt recovery |
| A9 production workflow | Real universal HUD slot and actual main-hand/ranged equipment fan → owner panel → compact GM panel → accepted receipt; P8/P9 App regressions pass |
| Reload / rejoin / unknown | Lost owner ACK retains identical approval across reload; lost GM ACK+broadcast retains identical command across reload; explicit receipt check creates no new payment; same-socket rejoin restores missed pending/closure; changed runtime remains unknown |
| Capacity / correction | 33 completed production strikes leave ≤8 terminal GM records; closed-ID reservations tested near4096; real competing P7 command causes stale CAS refusal, survives GM reload and permits one explicit corrected strike |

Executed checks:
- Server: **13 P12 tests PASS**; affected P7/P9 run **49 PASS** (13 P12 +36 regressions).
  Race witnesses hold the actual handler's authority await, after the outer event guard.
- Frontend: **14 suites /126 tests PASS**; additional/affected selection **6 suites /30 checks PASS**
  (overlapping suites; these totals are not added together).
- Scoped ESLint: server **0 findings**; client **0 errors /31 incumbent warnings** in the shared
  action-bar/HUD files; new P12 source has no warnings. Mechanical UI detector: `[]`.
- Scoped tracked whitespace and explicit new-file trailing-whitespace checks pass.

Reusable witnesses: `vtt-react/verification/p12/` and the two retained production test suites.
Commands and fixture limits: [verification README](../vtt-react/verification/p12/README.md).

## Build identity and evidence custody

Final optimized production build:
`D:/AppData/Temp/opencode/p12a-frozen-final-20261016/`.
`build.json` records all copied source/public/config hashes, command, exit0 and `mirrorDrift: []`.
Asset-manifest SHA256:
`32994a1127df5163fa6adbf72723d19bbc2b0425b217f0cc0b971c3a8f88ef43`.

Key runtime artifacts (all outside Git):
- `accepted-app/result.json` — combined P12A/P11 full-App PASS, receipts and ARIA snapshots;
- `stale-recovery-closed/result.json` — adjustment gate and stale-refusal/reload/correction PASS;
- `p11-device-save/result.json` — actual `saveCurrentCharacter` → scoped device roster → page reload
  → actual `loadCharacters` / `loadCharacter`, with all separate/legacy ranks intact;
- `p8-p9-app/result.json` — actual production-App Feather Slash and P9 owner→GM receipt PASS.

Two earlier build attempts are retained outside Git. The first compiled but concurrent equipment-slot
edits yielded a transient missing-import App error; the second encountered a concurrent, incomplete
ShopWindow edit. Neither is acceptance evidence. The final build used an unmodified frozen copy of
the checkout and installed dependencies to prevent mid-compile writes. No source/config substitution
or dependency upgrade occurred. Later concurrent App/account/transition-overlay/SpellActionBar CSS
changes are listed by the manifest and remain outside this exact built-source claim. Current P12
source and the reviewed sheet routing match the accepted build.

## Independent acceptance and external limits

One bounded independent source review initially found two blocking and four should-fix defects;
all were repaired and checked in the same review. Its report preserves initial findings, dispositions,
final fingerprints and source PASS; runtime execution above is attributed to the implementation agent.

These local gates do **not** close live Firebase/rules/backend leases, deployed restart/restore,
two physical devices, a human/creator table session or deployment readiness. Real Socket.IO,
production handlers, stores, UI and compiled App execute; provider login, canonical-owner documents,
lease storage and cloud transport are fixture boundaries. Deliberately refused external Firebase
requests produce retained `Failed to fetch` page errors (six in the combined App run, two in P8/P9);
no other page-error type was observed. Device save/reload is proven; cloud confirmation is not claimed.
P7's pre-existing live-only receipt budget remains unchanged.

## Remaining P12B creator decisions

All **D-A…D-J** remain open: off-tier resistances; mitigation/conversion order; equipment DR versus
non-physical damage; criticals versus shields; armor die source; Evasion cap/stacking and formula
attacks; obsolete AC/to-hit wording; creature Defend; homebrew encoding; prose versus structured
defenses. Proficiency modifier, explosion and face mapping are also still open. P12B, reaction
timers, equipment wear, elixirs and multi-target execution were not implemented.
