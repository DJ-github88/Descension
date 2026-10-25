# P14-A8 — owner primary PC → creature authored Stunned

2026-10-25 · [Frozen contract](MYTHRILL_PROJECT_14_A8_CONTRACT.md).
**Implemented; same-review repaired bounded ACCEPT; optimized Build4/App10 PASS (qualified).**
Prior P7–A7 acceptance carries forward, not restarted.

## Working player / GM flow

1. GM: Spellbook → Spell Wizard → immediate ACTION → Control → **Use canonical
   Stunned profile**. Enter authored duration, required source adjudication note,
   one single target with positive range and explicit whole-number AP/mana, including0.
   Complete Spell saves the original whole record.
2. GM: reopen normal Spell Library details, choose existing **arcanoneer** binding,
   **Admit this saved version**. Normal admission explicitly authorizes the PC
   route; placed-creature-only admission does not. Edits need a new immutable version.
3. Owner: select the exact matching primary PC attachment; **Admitted abilities** →
   refresh → **Use admitted ability** → one distinct exact placed creature on the
   same map. Review source/target, price, canonical mechanics and authored duration.
   **Approve exact price, target and Stunned duration** applies and spends nothing.
4. GM: existing **Spell adjudication** shows those same terms. Resolve eligibility,
   range, saves, immunity and success manually. Enter required private timing
   clarification, optional private resolution evidence and explicitly confirm success.
   **Confirm PC payment and Stunned together** installs one P7 consequence.
5. Existing shared-condition controls show the exact attributed instance. Remove
   that UUID manually at **[Authored duration] — GM removes**. Sibling instances
   remain active; supported action/reaction/voluntary movement availability returns
   only after the last applicable canonical instance is removed.

No dummy damage faces, HP result or float. Failed/unexecuted tabletop attempt costs
are GM-managed; no automatic debit never rules the attempt free. Saves, STR/AGI
failure recording, advantage, range/eligibility and expiry retain manual boundaries.

## Authority, consent and atomic installation

Only the accepted A7 profile, one primary owner **Arcanoneer** PC source and one
distinct placed creature target. The companion validator still accepts only that
existing binding; no reconstructed-class roster is registered. The same installed
registry/history distinguishes normal PC admission from requests belonging to exact
creature-source grants. A1a/compiler fixtures and authored-immediate:v1 are preserved.
No new registry, payment engine, condition engine or item entitlement.

Owner approval binds exact source/target refs, installed definition/version/hash,
price, stable attempt/approval UUID and `conditionTerms` containing canonical Stunned
and complete source timing. `roll:null`; no owner GM-success attestation. GM success/
timing/evidence belongs to the immutable command. Server matches its timing exactly
to consent; changed duration returns `owner_reapproval_required`. Notes are prose
evidence, not interpreted rules: the installed PC record always uses the original
authored duration, never substitutes the note. Material target/version/price/effect/
duration changes require positive closure and fresh owner approval; prior terms remain.

Existing A1 owner/membership/primary/canonical character/ref/incarnation, installed
binding/revocation, current GM and C2 source-Stunned checks repeat after awaits and
at P7 stage. Temp-first AP/mana planning and free unchanged-AP CAS are reused. One
writer admission installs debit, exact canonical condition, approval consumption and
receipt synchronously. Pools/revisions/bounds/identity/authority/admission changes,
invalid/capacity conditions and writer refusal install neither side. Generic writes
cannot forge authored provenance. Exact-instance GM corrections/removals remain C2
administration; they do not rewrite original consent/receipt or refund prices.

## Recovery and privacy

Existing scoped spell custody retains condition-only approvals and bounded prior
consent history without rolls. Existing shared-condition command custody also retains
private GM pre-command resolution drafts. Emitted command bytes remain immutable;
known refusal permits explicit re-preparation with command history, unknown/pruned
outcomes block replacement. No proxy or timeout approval.

Close/reopen/reload retains pending consent, GM success/timing and original commands.
Original approval/full-byte withdrawal checks recover lost ACKs. Another account or
character cannot adopt/resend/withdraw the original condition attempt. Rejoin uses
the existing single `room_joined` bus for list refresh only. Socket registration
captures account/generation/socket before initial join; event delivery checks the
current room rather than freezing an absent prejoin room. Historical recovery is silent.

Private PC timing clarification/evidence stays in GM device custody and authoritative
receipt; public result carries only approved duration/expiry and accepted condition
facts. PC installed condition contains no private note. A7 creature projection remains
preserved. Existing visibility-aware narration/history emits once, with no HP float.
Temporary rooms are live-only; accepted-live is not cloud checkpoint confirmation.

## Verification and one independent review

- Implementer affected server **254 PASS**: A8 ten handler cases plus A7/A4/A5/A6/A1,
  C2/C3/C4, P9, installed codec and protected A1a vectors/history/capacity. Earlier
  33/100 groups overlap; no summed historical total.
- Final implementer client **11 suites/73 PASS**, including prejoin registration,
  original approval/withdrawal recovery, whole-record adapter, A1/A7/Item helpers and
  shared canonical condition controllers. Earlier groups overlap. Existing Demo Mode/incomplete
  inventory change-store mock warnings retained; no global clean-console claim.
- Final scoped runtime client lint0; server lint0 with incumbent `curly:off` override;
  mechanical detector `[]`. No full-repository lint claim.
- Scoped `git diff --check` passes. Full-tree check reports trailing whitespace in
  concurrent `CharacterSheetWindow.jsx:513` and `Lore.jsx:932`; those separate-owner
  bytes were preserved, not silently cleaned up. Git also reports its incumbent
  LF→CRLF notices; no normalization/configuration change was made.
- Same independent reviewer: R1 private timing-note projection, R2 lost withdrawal
  response, R3 absent rejoin refresh. R1/R2 repairs independently passed. Continuation
  found prejoin registration order masked by the App fixture. Final repair uses
  account-only registration fencing/current-room checks; new helper regression and
  browser fixture now register spell handlers before initial room join.
- Build2/App9 passed the entire main flow but preceded final prejoin correction.
  They remain intermediate evidence, not substituted for final build/App.

### Final production App and independent execution

**Build4** exited0 with unmodified production CRACO/config/dependencies, external frozen
workspace and mirrorDrift `[]`. **App10** passed13 check groups using real optimized
App controls and registered backend, with spell handlers registered **before room join
on every role/setup/reload**, matching the reviewed production lifecycle ordering.

- Real Spell Wizard authors **A8 Owner Bell** (1 AP/3 mana) and **A8 Quiet Seal** (0/0),
  both canonical Stunned/range30/Any/manual duration. Normal library PC binding and
  explicit version admission, no Creature or item-based authorization shortcut.
- Exact primary Ilse source and creature A then B target visible; no condition roll
  controls. Owner approval spends nothing. Changed A→B terms positively close old
  consent and require a new approval UUID. Both original terms persist in actual
  device attemptHistory. Zero-price approval also executed with keyboard Enter.
- Lost owner approval ACK → reload → exact original approval check; lost withdrawal
  ACK **and closure broadcast** → reload → positive original full-byte closure → fresh
  target approval. Missed GM pending notification restores through actual reconnect
  and existing single-listener bus, reading lists without emitting an action.
- Required private GM success/timing/evidence persists on reload before emission;
  one P7 result consumes1 temporary AP and3 temporary mana, leaves base pools/HP
  unchanged, installs one exact source-attributed canonical condition. Free second
  definition leaves all PC pools unchanged and installs a distinct UUID.
- Lost GM consequence ACK and GM/owner accepted delivery: immutable original command
  survives reload; same bytes recover the original receipt. Owner checks original
  approval silently. Observer has one live narration/history and chat entry, no HP
  float or private GM clarification/evidence; historical recovery never narrates again.
- Target's actual supported P12B action preparation and delegated voluntary movement
  refuse. Existing GM exact-condition controls remove one UUID while enforcement
  remains; final removal restores movement and supported action preparation, whose
  disposable offer is then explicitly withdrawn. The separate availability probe uses
  fixture equipment plus the normal owner blocking declaration, not a condition price.
- Authenticated observer foreign-owner and owner secondary-token attempts refuse.
  Owner/GM ARIA and1440×1000/1024×768 panel widths/scroll evidence retained. No
  horizontal overflow; incumbent bounded parent column/panel vertical scrolling remains.

**Same one independent reviewer final verdict:** bounded **ACCEPT**, R1/R2/R3 closed,
no concrete correctness blocker at final v2 bytes. It found, retained and verified the
initial privacy/closure findings and the prejoin repair's lifecycle regression. Actual
independent execution (overlapping groups are not summed):

| Reviewer execution | Result |
|---|---|
| A8/A7/A4/A1 + installed codec |56 server PASS, rerun on R1/R2 repaired server bytes |
| A5/A6/C2/C3 regressions |44 server PASS |
| Registered independent privacy/closure/reverse-admission/post-await probes |14 PASS including10 repeated A8 cases |
| Repaired adapter/owner/creature/spell client group |8 suites/55 PASS |
| Final condition/recovery/A1 recovery/roll-draft group |4 suites/16 PASS |
| Final Item workflow/helper group |2 suites/5 PASS |
| Actual controller **and actual custody** prejoin/account/socket/room/await fencing probe |5 independent checks PASS |

Exact commands, timestamps, earlier failures and repair probes are retained in
`D:/AppData/Temp/opencode/p14a8-review1/REVIEW.md`. Final controller command:
`node D:/AppData/Temp/opencode/p14a8-review1/continuation-controller.cjs --prejoin`.
It independently rehashed/apprised final63 runtime,51 scoped client,7 protected and
11,383 frozen inputs. **Build4/App10 were implementer-executed and reviewer-inspected,
not reviewer-relaunched.** No reviewer application-source edits or second reviewer.

## Exact source, files and environment

Entry `master/77c110db32f6a8b8f82a8982d5040540a644a43c`. Before edits all62 A7
runtime identities and7 protected files matched its accepted manifest. Acceptance
binds final working bytes, not HEAD. Pre-existing A7/docs and concurrent Class/
Heritage/Plaguebringer/UI remain separately owned. Build2 had scoped parity with10
later unrelated dice/coin/social inputs drifting. Build4 includes their then-current
bytes along with concurrent App/character-sheet/calm styling; A8 accepts none of those
semantics. Final recorded full-client drift and added-input drift are both `[]` at
2026-10-25T13:07:35Z; scoped63 runtime/protected7 drift `[]`. Later edits must be
measured again rather than treating this timestamp as permanent full-tree parity.

Final branch/HEAD remain `master/77c110db32f6a8b8f82a8982d5040540a644a43c`.
Final gate `D:/AppData/Temp/opencode/p14a8-final-evidence-v2.json` SHA256
`cb0bc9a0c78456568471c670b90a3bb508e72ee28f46674921da6484777cd141` binds exact
runtime/App/build/witness and protected hashes. All63 runtime files match App10
before/after/current; all51 scoped client files match Build4. The seven protected
A1a/W1/card hashes remain accepted A7 bytes. Independent report SHA256
`0084494da9f2869aff09dbe9d812e170acda911ea2a9246a0d7c2b46e4a08cf2`.

| Final artifact | SHA256 |
|---|---|
| `p14a8-build4/build.json` | `44641700945498af2a13cc086c11bda216a8c63ef95461636de0ae16049ef38e` |
| `p14a8-app10/result.json` | `d88d8441bb9fd3c29687bef24e6b240de90ffdab824c06f766314af0a7055576` |
| Build4 asset manifest | `d2e4b6482de477ee6db0318181ecbff2f76273870e546406225acda3f6108f79` |
| Final browser witness | `fc3a03521b3f8e1e3488eb6417f83576a2996dd59fd9810703f421959344c890` |

Runtime changes: `server/handlers/actorConsequenceHandlers.js`,
`server/services/{installedAuthoredAbilities,spellPayments,actorConsequences}.js`;
client `src/services/{authoredAbility,authoredAbilityRegistry,authoredCondition,
spellConsequence,spellConsequenceService,spellConsequenceCustody,sharedConditionCustody}.js`,
`src/components/hud/SpellConsequencePanel.jsx`, library `AuthoredAdmission.jsx`,
`src/components/item-generation/ItemAbilityAccess.jsx` (condition-aware copy only),
additive `public/data/rules.json` help. Adapter canonical comparison now follows JSON
omission of optional undefined metadata found in the live library; absent/invalid
required prices still refuse. No protected Wizard resource/serializer change.

Reusable tests: `server/tests/p14a8OwnerCondition.production.test.js`, client
`src/services/__tests__/{ownerAuthoredCondition,ownerConditionRecovery}.test.js`.
Witnesses: `verification/p14/{owner-condition-app-browser,owner-condition-build,
record-owner-condition-evidence}.cjs`. A7 witness exports reusable author/narration
helpers without auto-running on import. P9 App fixture has optional prejoin-registration
mode; previous callers retain their behavior. Contract/this record, next-policy
preparation, engineering/priorities/coordination/roadmap are updated additively.

Bulky builds/screenshots/ARIA/commands/reports stay in
`D:/AppData/Temp/opencode/p14a8-*`, outside Git. Provider auth/canonical ownership,
lease and cloud are fixture boundaries. Optimized production UI/registered handlers
are exercised; real Firebase/rules, cloud confirmation/restart, physical second-device/
tablet and deployment readiness are not. Persistent writer/checkpoint/new-epoch
refusal/recovery is focused server evidence. No commit/push/deploy/reset/dependency
upgrade/catalogue rewrite/class/ancestry migration.

App10 retains **10 `Failed to fetch` page errors**. The fixture deliberately aborts
provider requests, but per-error stack/network correlation is not retained, so this
is a qualified pass, not a zero-error run or attribution of every error to one cause.

## Next bounded contract — prepared only

[PC-target preparation](MYTHRILL_PROJECT_14_PC_TARGET_CONDITION_PREPARATION.md)
compares creature→PC and PC→PC source consent, exact target acknowledgement,
GM saves/immunity adjudication, coupled payment/condition and existing corrections.
**D-PC-1 creator decision:** recommend GM hostile-effect authority with separate
non-veto delivery acknowledgement; voluntary effects require affirmative target
consent. Disconnected hostile targets do not silently gain a universal veto. No
PC-target route, arbitrary conditions, automatic expiry or all-P14 completion claim.
