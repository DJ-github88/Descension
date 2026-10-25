# P14-A9 — authored canonical Stunned targeting exact primary PCs

2026-10-25 · [Frozen contract](MYTHRILL_PROJECT_14_A9_CONTRACT.md).
Implementation and focused regressions complete; production-App and final same-review evidence pending.
Prior P7–A8 acceptance is carried forward, including accepted uncommitted bytes.

## Player / GM workflow

1. Author one immediate ACTION in the normal Spell Wizard, Control → canonical Stunned,
   one single target, explicit nonnegative integer AP/mana, source duration and manual expiry.
2. Creature source: select the saved whole ability in Creature Wizard, Keep/save/place,
   then placed Inspect → Abilities & Spells → bind/admit that exact creature → Use.
   Choose an exact distinct primary PC on its map; retain successful manual GM resolution.
3. PC source: normal saved-library admission with the supported **arcanoneer** binding;
   exact primary source owner chooses another exact primary PC, then explicitly approves
   action/price/target/effect/duration. This authorizes spending only that PC's resources.
4. Current authenticated GM manually resolves eligibility, range, saves, immunity and success,
   retains private timing/evidence, and confirms payment and Stunned together. No dice fabricated.
5. Existing token, owner sheet and GM condition controls show the same exact UUID. Duration is
   **[Authored duration] — GM removes**. Exact removal preserves other independent instances.

### Hostile versus voluntary

**Hostile is the production default.** No target acknowledgement, approval or online device
is required. Silence is never labelled consent. The owner sees authoritative current Stunned
and an instance-specific instruction to message the GM for correction; reporting changes no
effect, payment, receipt or execution opportunity. Only GM correction/removal can edit/remove
an accepted authored PC-target instance. This is the bounded software policy, not automated
PvP/campaign consent, save success or immunity verification.

**Voluntary needs explicit GM designation plus independent affirmative target acceptance.**
The GM designation lives with the existing server approval, cannot be client-forged or downgraded
under that attempt, and binds exact full terms privately. Target reviews exact primary attachment,
canonical effect/duration, source price, admitted definition/version/hash and an opaque source handle.
Public handles are random and not enumerable hashes of concealed actor refs. The server binds the
exact source/target/version/price/duration privately. Target can withdraw before installation; no
proxy/silence/timeout acceptance. Changed terms require fresh appropriate approval, never reuse a
different character's class-matching consent. Disposable fixtures exercise voluntary Stunned;
canonical content has no invented beneficial Stunned mechanics.

## Installation, projection and enforcement

Both routes reuse A7's condition primitive, A4 creature grant or A8 owner source consent, and the
existing P7 stage/writer/receipt path. One synchronous installation includes temp-first exact source
AP/mana debit, one canonical C2 condition, approval/attempt consumption and accepted receipt. Zero
prices remain zero with the existing unchanged-AP CAS. Refusal installs none. Source restrictions,
Stunned, exact primary actors/incarnations/revisions, immutable admission/binding/revocation, current
GM and voluntary records recheck after awaits and immediately before installation.

Full canonical source attribution and GM evidence stay authoritative/private. Public PC-target
condition views omit sourceActor; the same strict canonical mechanics/UUID/duration remain active.
Public receipts reveal only target condition facts, not source identity, undisclosed ability names,
raw definitions, private GM notes or target consent internals. Owner-private recovery also redacts
concealed authored attribution while preserving unrelated private/local recovery data. GM correction
from this public view restores only the original immutable source attribution server-side.

Supported action/reaction/voluntary movement enforcement remains C2-owned. Prepared source attempts
cannot bypass newly applied Stunned. A Stunned target may receive another independent instance, read
notices, accept a voluntary proposal, report, recover or undergo GM correction. Removing one sibling
does not restore availability until the last applicable canonical instance is removed. Normal owner
save/hydration consumes authoritative shared state rather than overwriting it with local buffs.

Only successful application is automated. Failed/unexecuted attempt prices, saves, STR/AGI failure
recording, advantage and expiry remain manually resolved. No C4 Shield Bash schedule is inferred.

## Recovery and privacy

Existing spellPayments pending/closed custody and A8 device spell/shared-condition families own all
work; no new notification store/permission engine. GM designation/target consent are independent
from source payment consent. Private accepted receipts retain target policy evidence. Lost target
response checks the original proposal; an already installed response returns the immutable original
receipt and authoritative snapshot. Client recovery applies it through the existing silent P7
reconciliation path. Retained unknown responses remain explicitly checkable after pending lists close.
Pruned/unknown outcomes cannot be replaced. Close/reopen/reload retains exact original work; existing
single room_joined registration refreshes lists/state without executing. Historical results are silent.

Temporary rooms are live-only. Permanent-room writer admission is not synchronous cloud confirmation;
checkpoint/epoch/replay-floor recovery remains the existing P7 contract. No new offline replay queue.

## Focused verification and review

- Registered handler group: **67 PASS / one incumbent skipped negative witness** covering A9/A8/A7,
  A5, C2/C3/C4 and installed codec. Separate corrected A4+A9 run **30 PASS** (21 A4 and nine overlapping
  A9 cases); these totals are not summed. Initial command used an incorrect A4 filename, corrected in
  the separate run. A9's nine cases include both sources, offline/no-ack hostile policy, explicit
  voluntary acceptance/withdrawal/separate source consent, exact authority/identity, forged flags,
  post-await source Stunned, writer/resources, GM-only correction and private recovery.
- Client focused groups: four suites14 and four suites37 PASS before final recovery repair;
  final changed recovery group two suites8 PASS. Overlapping runs are not summed.
- Scoped client lint0 after final recovery edits; server lint0 with incumbent `curly:off` override.
  Mechanical UI detector `[]`. No repository-wide lint/clean-console claim.
- One independent **review1**, continued for concrete repairs. Original R1–R5: owner removal bypass,
  private recovery leak, redacted-view GM correction mismatch, incomplete voluntary terms, stale target
  proposal display. Repairs inspected; continuation identified R6 enumerable source fingerprint and
  R7 missing silent reconciliation on consumed target-response recovery. Both repaired with random
  public handles/private binding hash and existing P7 historical reconciliation/custody controls.
  Final verdict and actual independent execution qualification will be recorded below.

## Production build / App and exact identities

Entry `master/77c110db32f6a8b8f82a8982d5040540a644a43c`. Before runtime edits, all **63 A8 runtime**
and **seven protected** working-byte hashes match A8's accepted manifest; recorded in external
`D:/AppData/Temp/opencode/p14a9-baseline.json`. HEAD alone is not the accepted source identity.

Build1 attempted the live whole tree and failed in concurrent Class work: missing export
`DOOMSAYER_TALENT_NODES` from `doomsayerData`. Those files were preserved. Build2 successfully compiled
the verified coherent accepted A8 Build4 production inputs plus all current scoped A9 client files,
using unchanged normal production CRACO/config/dependencies. Build3 includes subsequent review repairs.
This is a **scoped production build**, not a full-current-tree build claim. Exact input inventory,
overlaid paths, live differences and newly added live inputs remain in each external build record.

Concurrent Class/Heritage/Plaguebringer/Doomsayer/Oracle/App/character/dice/coin/card/social/calm UI
changes are separately owned and are not accepted by A9. Protected compiler/fixtures/W1 resource
editor/manager/serializer/universal-card identities remain unchanged. No commit/push/deploy/reset,
dependency change, class migration, ancestry change or catalogue rewrite.

## Changed files and reusable witnesses

Server: `services/{installedAuthoredAbilities,spellPayments,actorConsequences}.js`,
`handlers/{actorConsequenceHandlers,socketHandlers}.js`.
Client: `services/{authoredCondition,sharedConditionProfile,spellConsequence,spellConsequenceService}.js`,
`components/hud/SpellConsequencePanel.jsx`; additive Laws in `public/data/rules.json`.
New focused tests: `server/tests/p14a9PcTargetCondition.production.test.js` and
`src/services/__tests__/pcTargetConditionRecovery.test.js`.
Witnesses: `verification/p14/{pc-target-condition-app-browser,pc-target-condition-build,
record-pc-target-condition-evidence}.cjs`; existing A7 witness exports reused helpers.
Contract/this record, engineering/priorities/coordination/roadmap and preparation status updated.
Bulk logs/builds/ARIA/screenshots/reviewer probes remain external under `p14a9-*`.

## Next smallest reusable capability — recommendation only

Recommend **authenticated duration/expiry for this authored condition profile**, with a separately
frozen structured timing contract. `server/services/sharedEffectLifecycle.js` already owns exact
authenticated combat occurrences, instance fingerprints, bounded atomic removals and manual fallback;
current scheduling is closed to Defending/Shield Bash. Reuse that owner rather than parsing arbitrary
authored prose or introducing a clock. The next contract must identify its legitimate source timing
terms/anchors and unsupported/manual cases; no schedule or timing semantics is assigned here.

A numeric modifier would need a new authoritative condition consumer and a reviewed combination rule:
weapon strike presently proposes weapon/attribute damage; equipment blocking consumes the closed
Defending multiplier, while generic modifier aggregation is local. Therefore it is not yet a smaller
server-authoritative profile simply by choosing a number. No magnitude/stacking/expiry rules or follow-on
implementation are invented in A9.
