# Mythrill HEADQ — integration and compositional baseline

**Reconciled 2026-11-08 in `D:/VTT`.** This checkpoint records the product as a compositional
Spell Wizard/rules engine. Existing milestone contracts and approved mechanics remain authoritative.
Catalogue size, spell totals and test totals are not completion measures. This is a bounded release
reconciliation and the next combined integration's scheduling record, not a replacement roadmap.

> **Shared trigger foundation v1.1 (2026-11-10):** INSTALLED + DIAGNOSTICALLY VERIFIED — successor v2 installed and verified on integrated production stack (10 delivered files + 17 dependency guards). Executes nothing; zero playable triggers; distinct from APP VERIFIED. [Handoff](../handoff/shared-trigger-foundation-v2/CONTRACT.md).

## Evidence stages

| Stage | Meaning |
|---|---|
| Specified | An existing approved contract defines the interaction and its refusals. |
| Implemented | Source implements that contract; a candidate alone can satisfy this stage. |
| Installed | Exact reconciled bytes are present in the live checkout. |
| Reviewed | Independent source review, plus any required reconciliation delta, accepted. |
| Identified-build verified | Immutable source capture and optimized artifact identity/coverage are recorded. |
| Ordinary-App verified | The claimed interaction was exercised through ordinary optimized App controls; fixtures and limits remain disclosed. |
| Released for ordinary gameplay | No unresolved integration hold remains for the stated executable route. Presentation-only release authorizes no new execution. This is not deployment or live-Firebase/physical-table acceptance. |

## 1. Existing integration/release backlog — reconciled

| Interaction / scope | Specified | Implemented | Installed | Reviewed | Identified-build verified | Ordinary-App verified | Released for ordinary gameplay |
|---|---|---|---|---|---|---|---|
| Rider-local negates save + plain immediate part + supported target-turn expiry; owner PC → one creature | Yes | Yes | Yes; timed-save final identities | ACCEPT + delta | T below | PASS `ts-run2` | Yes, bounded route |
| Explicit owner-PC self immediate healing, range 0, dice/attribute/deterministic without missing-health | Yes | Yes | Yes; reconciled self-heal plus later released deltas | Original CLEAN + integration ACCEPT; later timed-save reconciliation ACCEPT | S; included in T | PASS on S, original command recovery | **Yes; obsolete concurrent-DR hold closed below** |
| Saved whole Wizard ability → Item Wizard detached association → owned backpack/worn action → admitted shared cast | A2 | Yes | Yes; all five product sources exact | ACCEPT with notes; rendered test gap subsequently closed | D; product sources also exact in T | **Final worn cast PASS**, reload while worn then ordinary unequip | Yes for existing supported shared routes; no possession/equip entitlement |
| Timing/formula presentation across actual Wizard live preview, save/library/reopen | Existing timing/formula contracts | Yes | Yes; component release supersedes overlaps, then T wording | ACCEPT; relevant delta ACCEPT | S and final standalone D | PASS; actual `ExternalLivePreview` path | Presentation released; no new effect execution |
| Component requirements preserved/displayed, including explicit zero cost and manual extensions | Existing descriptive requirement contract | Yes | Yes; 13 exact release entries + T's reviewed wording entry | ACCEPT | D; component sources included in T with wording delta | PASS; `Aegis of the Dawn` | Authoring/disclosure released; requirements remain tabletop-managed |
| Composed spell preservation across edit cycles, unified update semantics (Header, Review Step 10, Live Preview), responsive phone/tablet controls | Existing authoring/preservation contract | Yes | Yes; reconciled context, calm & review CSS | ACCEPT | PASS (build `513bea72...` / capture `be749793...` and `9c7e218d...`) | PASS (`app-final` and `headq-release-integration-20261108`, errors: []) | Yes (authoring preservation & responsive controls released; execution remains gated by definitionFromWizard) |
| M4A attribute formula × movement/Stunned rider × authenticated caster-start cooldown; owner PC → one creature | Yes; existing M4A/A10/A11 | Yes | Yes; Opus 10/10 final paths exact | ACCEPT (no merge delta) | PASS (build `9c7e218d...`) | PASS (`rider-formula-cooldown-app-browser.cjs`, errors: []) | Yes; bounded formula + rider + cooldown route |
| Exact combat target labels (disambiguation by short token id + rounded position; hidden-actor exclusion) | Yes | Yes | Yes; DS 3/3 final paths exact | ACCEPT | PASS (build `9c7e218d...`) | PASS (`exact-target-labels-app-browser.cjs`, errors: []) | Yes; presentation/disambiguation released |
| Wizard Step 10 completion/update qualification (original ID & dateCreated preserved across edit/update cycles; 1 library entry; executable components survive) | Existing authoring/preservation contract | Yes | Yes; dateCreated non-overwrite repaired across context/review/preview | ACCEPT | PASS (build `9c7e218d...`) | PASS (`composed-preservation-app-browser.cjs`, 10/10 stages PASS, errors: []) | Yes; Step 10 & Live Preview qualification completed |
| Rider-local negates save × movement/Stunned rider × authenticated caster-start cooldown; owner PC → one creature | Yes; existing M4A/A10/A11/cooldown/save | Yes | Yes; 14/14 final paths exact | ACCEPT with notes | PASS (build `cbae0dee...` / `main.69764352.js`) | PASS (`rider-save-cooldown-app-browser.cjs`, 11/11 stages PASS, errors: []) | Yes; bounded rider-save-cooldown route |
| Consumable acceptance closeout (refusal protection, single deduction + mixed condition, overheal Cancel before effects, duplicate click lock, character switch, reload recovery) | Yes; P7/P8 contracts | Yes | Yes; 11/11 canonical-r2 files | ACCEPT (independent DS review + HEADQ) | PASS (build `C8A376BE...` / `main.41df5371.js`) | PASS (`consumable-entry-points-app-browser.cjs`, 7/7 checks PASS [baseline 3 + closeout 4], errors: []) | Yes; bounded same-device route (limitations disclosed) |
| Attribute-cooldowns integration (Wizard authoring, independent cooldown vs effect lifetime, blocked reuse, boundary release, same-attribute recast refusal, plain damage + attribute) | Yes; A10/cooldown contracts | Yes | Yes; 12/12 installed files + 12 guards | ACCEPT (independent DS verdict + HEADQ) | PASS (build `e85803fb...` / `main.7bad4111.js`) | PASS (`attribute-cooldown-app-browser.cjs`, 16/16 checks PASS, errors: []) | Yes; bounded attribute-cooldown route |
| Shared trigger foundation v1.1 (diagnostic-only committed-occurrence obligations, GM registration/dismissal, rollback privacy scrub, authoritative guards & named rate limits) | Yes; CONTRACT.md | Yes; F1–F3 repairs | Yes; 10 installed + 17 guards | ACCEPT (exact-byte delta ACCEPT) | Server-only; no client build needed | Diagnostic acceptance checklist 7/7 PASS (server suite 20/20 PASS) | **DIAGNOSTIC ONLY** (no playable triggers, executes nothing; not APP VERIFIED) |
| Trigger-authoring preservation (step visit non-mutation, reaction/passive & buff/debuff survival, copy identity/cancel, catalogue draft/copy admission, unsupported refused whole) | Yes; authoring preservation contract | Yes | Yes; 4/4 final identities match FINAL.sha256 | ACCEPT (independent DS review + HEADQ) | PASS (build `trigger-authoring-preservation-build-20261110` / asset-manifest `10e94d24...` / chunk `6588.5f2cd593...`) | PASS (`trigger-authoring-preservation-app-browser.cjs`, 9/9 stages PASS, errors: []) | Yes (presentation & authoring preservation released; runtime execution remains refused) |

**Supporting baseline carried forward, not reopened:** existing M1, M2A, M3A, M4A–D, M5 periodic/
composition/formula/recovery, F7, library/Bestiary and immediate/composed cooldown milestones keep their
existing decisions and bounded acceptance. Class-payment composition bridge is installed/reviewed, but
has no authorized complete real ability/production pin: **not released as an ordinary-play class-paid spell**.
See `handoff/composition-integration/HANDOFF.md`; this reconciliation grants no new pins.

### Self-heal hold: resolved from identities, not a replacement App run

`handoff/self-heal-timing-integration/FINAL.json` and `POST_VERIFY_DRIFT.json` are historical snapshots.
Their hold arose from three then-unreleased paths: client shared-condition profile JSON, profile helper,
and `authoredEffect.js`. **All three now equal the independently reviewed, subsequently released flat-DR
`INSTALLED.sha256` bytes; their server mirrors are equal.** The mirror check now passes.

Nine of the fourteen self-heal final entries remain exact; five overlap entries (registry, payments,
both authoredAbility mirrors, consequence panel) equal the later released timed-save final identities.
All fourteen current self-heal entries are covered exactly by T's source capture. The timed-save review
explicitly preserves self-healing and the flat-DR exclusions. The focused current self-heal/DR/timed-save
production checks pass. **No unexplained source drift or actual unresolved self-heal release hold remains.**
No old candidate was installed, no live files were reset, and no new build/self-heal journey was needed.
S's App PASS stays evidence for S; source inclusion in T does not relabel it as a self-heal App run on T.

### Worn cast: final result closes the transferred checklist

Final result: `D:/AppData/Temp/opencode/item-ability-worn-witness-run/result.json`, SHA-256
`729d16c22fdd63ae5d37c2b5b8e96cdb6f4dd5c909c3bf599336f14defc41b73`.
Witness SHA-256 `080cd16a56cf36479b6e26f08efda278129a2ba09f9e521b9bff059ac480a193`.
The actual result has `castWhileWorn: true`, worn reload persistence, exactly one action, unchanged receipt
count/pools after reload, and ordinary unequip **after** cast/reload. Approval spends nothing; GM acceptance
creates one receipt: AP current 2 unchanged/temp 1→0; mana current 10 unchanged/temp 3→1; B HP 30→130 of
250, temp HP 4 unchanged. This demonstrates the existing bounded healing path, **not an upper-cap hit**.
The `100` final amount is an explicit GM adjustment, not the rolled `1d8+1` total.

The earlier session-4 journey unequipped before casting; it is superseded for worn-cast acceptance by
session 5. `item-ability-app-acceptance` preparation is released/transferred/now satisfied, not active work.
The local action list does not introduce server possession, equip, charge or consumable rules.

### Presentation report corrections

- D capture is **`488b2a0126cbab30b5ae2a00a775b2bb702bf4a65bcf13c60da1cc3873549bb8`** (64 hex characters).
  The previously printed `...26cbabab30...` is malformed, not a second capture.
- Final timing `saved-spell-record.json` and `step10-review.aria.yml` / `library-reopened.aria.yml` agree:
  immediate `2d8 + intelligence/3` **Arcane**, periodic `1d6` **Arcane**, three target-start ticks, cooldown
  three strictly upcoming caster starts, **1 AP / 2 mana**. Reported Blight and 2 AP / 4 mana are report errors.
  There is no demonstrated Arcane→Blight product corruption to repair.
- Final component result names **Aegis of the Dawn**, not Aura of the Dawn. Exact component texts and
  explicit zero AP are recorded in its result/saved record.
- These final standalone results are PASS/errors[], but do not embed build identity. Their D association
  is documented by the handoffs plus per-path capture coverage; it is not retroactively cryptographically
  bound into the result. The earlier S integration results do embed capture/assets and `sourceDrift: []`.
- Ordinary Wizard uses `ExternalLivePreview`; `Step10Review.jsx` has component-level coverage. A filename
  `step10-review.aria.yml` alone does not establish navigation to the separately rendered Step10 component.

## 2. Exact artifacts, source coverage and retained results

| ID | Source capture SHA-256 | Asset-manifest SHA-256 | Artifact / coverage |
|---|---|---|---|
| S | `90cc8e11743e79ae015ac026f7bd01cd08c4454fb0f7e44e6712770195366825` | `37b0d11482e3e221d263b27177309d1fd72debdc841f7d3560127ed1d44ea5e5` | `D:/AppData/Temp/opencode/self-heal-timing-integration-20261107/`; `BUILD_INPUT.json`; `main.52964c00.js`; self-heal + timing App PASS |
| D | `488b2a0126cbab30b5ae2a00a775b2bb702bf4a65bcf13c60da1cc3873549bb8` | `c0e239440ca957fa215c164685bae10d906590765a9d79739c60f28d35e5cdcb` | `D:/AppData/Temp/opencode/dr-build/build`; sibling `capture.json`; `main.150e7a2b.js`; final worn-item, timing, component and DR journeys |
| T | `a761ff36531efef886ee2842fc359083a18230889e40084b01767fd333898c5e` | `4f76e32bf0a94b0cdb1a2112da1c1db3b055bc39a0886bb853d4e84f4fcc52f3` | `D:/VTT/scratch/timed-save-int/artifact-build/build`; `handoff/timed-save-integration/build/r2/capture.json`; `main.856ce2f3.js`; timed-save App PASS |

All three builds recorded exit 0 and empty frozen drift. D/T asset manifests were rehashed locally for
this reconciliation. T's 9,181-file artifact inventory is `handoff/timed-save-integration/artifact/BUILD_FILES.sha256`;
the owner verified each file at assembly, not a later full reread. No whole-current-tree artifact parity is claimed.

**Per-path report:** [`SOURCE_RECONCILIATION.json`](../handoff/headq-compositional-baseline/SOURCE_RECONCILIATION.json)
records released/current/S/D/T hashes separately, exact final-result hashes, and asset identities.
Reproduce with `node handoff/headq-compositional-baseline/reconcile.cjs`.

- Timed-save: all twelve current final entries exact; its executed selector-repaired witness differs from
  the captured pre-repair witness, both preserved by its owner. This is not bundled product drift.
- Self-heal: nine original reconciled entries exact, five superseded by reviewed DR/timed-save lineage;
  all fourteen current entries equal T capture. Historical full-tree drift metadata is not rewritten.
- Flat DR: fifteen of twenty-two manifest entries exact; six runtime entries superseded by T; the remaining
  entry is the evolving coordination document. All three original self-heal hold paths exact.
- Item: eight final entries exact (five product, two tests, one witness). Five product entries equal both
  D and T. T captured item witness `ddf9d6b5…`; final executed witness is `080cd16a…`, not a new bundle.
- Timing: seven of eleven release entries exact; card/review/normalizer superseded by component release;
  compatibility superseded by component release then T's reviewed no-tracking-refusal wording.
- Components: thirteen of fourteen exact; only compatibility changed in T. No descriptive requirement
  becomes an automated payment or prerequisite.
- M5 recovery: three of five original release entries exact; service/editor superseded by released DR
  bytes, included in D/T. Its prior closed capacity/recovery journey is retained, not repeated.

Final results read: S `self-heal-result.json` (`8592e693…`), S `timing-result.json` (`64c22b38…`),
T `evidence/ts-run2/result.json` (`a3778548…`), worn external result above, timing `evidence/result.json`
(`40234f21…`), component `evidence/result.json` (`4f75ae23…`). Full hashes are in the per-path report.
Failed/superseded attempts stay with their owners. All ordinary-App evidence uses disclosed fixture
auth/ownership/lease/cloud and temporary rooms; no live Firebase or second physical device is claimed.

## 3. Next combined integration — claims and release sequence

**HEADQ owns coordinated live installation and build scheduling.** New candidate delivery must not
overwrite live overlap files. At this reconciliation, the ledger/handoffs contain **no new owner-authored
claim or released candidate for the three new assignments below**. Creator assignment is recorded
separately from actual acquisition; historical claims/releases are not silently reused.

| Owner | Creator assignment | Actual new claim / delivery observed | Live/build reservation |
|---|---|---|---|
| Opus | Cooldown coverage for additional **existing** effect shapes | Awaiting owner claim: exact shapes, exclusions, base/final paths, isolated candidate and review required | No live overlap or compiler reservation granted |
| Sonnet | Remaining core attribute-modifier consumers | Awaiting owner claim: exact canonical attributes/real consumer paths and preserved base/pool behavior required | No live overlap or compiler reservation granted |
| Flash | Executable-compatibility explanations and focused UI acceptance | Awaiting owner claim: exact explanation paths and delta journeys required | No compiler reservation; sequential acceptance after artifact release |
| HEADQ | Reconcile released candidates, guarded install, shared build/acceptance scheduling | This checkpoint + coordination entry; documentation/evidence claim only now | No running compiler/browser/port reservation |

**Release order (coordination protocol, not a claim that candidates exist):**

1. Opus and Sonnet develop isolated candidates concurrently if desired. Each posts exact claimed paths,
   base/final identities, supported interaction class, unchanged refusal boundaries and independent review.
   Potential overlaps include authoredAbility/profile mirrors, registry, payments, consequence panel and
   Wizard condition fields; they are not permission to edit another owner's live files.
2. HEADQ admits **released** Opus delta, then **released** Sonnet delta into one isolated baseline,
   reconciling overlap from captured bases. This is the default deterministic merge order, not a gameplay
   dependency; change it only with an explicit ledger entry. Review only actual reconciliation deltas.
3. Flash's explanations bind to those final installed support/refusal contracts. Flash supplies any
   product copy/UI delta as a separately released candidate before capture. Preserve manual/unsupported
   whole-record content, first-blocker honesty and component/timing disclosures.
4. HEADQ verifies fresh live bases, installs only released scoped deltas with backups/guards, runs affected
   interaction/authority checks and mirror validation, then schedules **one detached identified build** for
   compatible acceptance journeys. If any source changes after capture, record drift and the exact need
   for rebuilding; do not claim acceptance against uncaptured bytes.
5. Reuse that artifact sequentially for Opus cooldown + actual-effect coexistence, Sonnet real attribute
   consumers/removal/expiry/reapproval, and Flash explanation/save/reopen/manual-no-spend checks. Run
   only new interaction classes and demonstrated repairs; do not repeat the closed backlog journeys.
   Publish artifact path, capture/assets, per-path source coverage, executed witness/result hashes and
   final releases. Each lane advances through the seven evidence stages independently.

**Release resources:** prior lanes explicitly released files/compiler/4180/profiles. This pass observed
no local 4180 listener and no matching compiler/App-witness Node process; started none. Cloud release
comes from the timed-save handoff, not local process inspection. No remote resource was acquired here.
Existing scratch artifacts remain available; nothing was deleted. The next build must claim its exact
slot/output and port/profile window before starting, then release them explicitly.

## 4. Progress measure and bounded verification

Newly executable **interaction classes** established by the backlog: negates-save branch × authenticated
expiry (saved outcome pays/direct-only, failed outcome atomic timed rider); exact self actor × payment/
healing atomicity/recovery; and detached item producer × worn action reachability/cast/reload. Timing and
components add faithful authoring/disclosure, not new server effect classes. Current cooldown scope is
immediate and immediate-plus-periodic; remaining shapes and remaining attribute consumers stay unclaimed
until their assigned owners deliver evidence. No overall percentage is inferred.

This pass: source/result identity reconciliation, mirror check, and only the three focused current
self-heal/timed-save/flat-DR production suites. Details: [`CHECKS.md`](../handoff/headq-compositional-baseline/CHECKS.md).
No integration repair was necessary. No commit, push, deployment, migration, dependency upgrade or
new gameplay rule; existing dirty runtime edits are preserved.

## 5. Executable compatibility baseline — 2026-11-08

**Test-only / bounded review ACCEPT / RELEASED.** New shared named fixture set:
`server/tests/fixtures/componentCompatibility.json`; runners:
`server/tests/componentCompatibility.production.test.js` (**19 PASS**) and
`vtt-react/src/services/__tests__/componentCompatibility.test.js` (**12 PASS**).
Commands, accepted evidence references, exact paths and test seams:
[`handoff/component-compatibility/HANDOFF.md`](../handoff/component-compatibility/HANDOFF.md).

Newly established **interaction coverage**, not newly authorized gameplay: immediate damage/healing
× AP/mana; attribute/deterministic formulas; missing-health × retained-face reapproval; direct × timed
rider; rider-local save × timed expiry (both outcomes); standalone periodic; immediate × periodic;
immediate × periodic × authenticated cooldown; exact owner-PC self healing; typed class payment ×
current trusted pin (process-local fixture only). Six explicit boundary fixtures keep executable,
structurally-valid/route-unsupported, awaiting-creator-decision and authority-forbidden outcomes separate.
The client production support/approval/command planners consume the same named data; server registered
handlers exercise real mapping, compilation/admission, approval, bind/commit, replay and lifecycle.

No product mismatch demonstrated in the selected classes/routes; no runtime repair/build/App rerun.
Class-paid ordinary play remains unauthorized without its approved complete-record pin. One bounded
review ACCEPT after strengthening test-only refusal and field-preservation oracles. All lane file/test
resource claims released; HEADQ retains combined live-install/build coordination. No compiler/fixed port/
browser/profile slot acquired.

**Current coordination addendum:** §3's no-new-claim observation is historical. This pass read Opus's
`handoff/effect-cooldowns/` exact isolated claims (authoredAbility/registry plus listed copy/tests) and
Sonnet's `handoff/attribute-core/CLAIM.md` (profiles/consumers). Those unreleased features are excluded
from this baseline. No owner path was edited; existing Opus → Sonnet → Flash → guarded combined build
sequence remains in force. Claim/delivery/release facts remain in the cross-track ledger.

## 6. Combined effect-cooldown / route-aware integration — 2026-11-08

**INSTALLED / owner reviews + bounded reconciliation ACCEPT / one identified build / combined App PASS /
RELEASED.** Sonnet attribute integration remains **ON HOLD / NOT INCLUDED** pending final review and
pool check, per the creator. No release inferred from its prepared candidate.

Newly verified interaction classes:

- Standalone periodic × authenticated cooldown: atomic AP/mana + instance + cooldown, no cast HP change,
  blocked reuse/no spend, original-command recovery after GM reload, separately rolled ticks, release
  while ticks remain, then legal reuse after the periodic lifetime ends.
- Movement rider × authenticated cooldown: atomic payment/direct HP/rider/start, original-command
  recovery, rider expiry while cooldown remains blocked, independent release and legal reuse.
- Shared creature-source eligibility × actual Inspect/PC contexts: refused creature composition shows
  helper reason/manual view with no Admit/Use; eligible direct creature admits with GM instructions;
  the same composition stays partially automated with PC-owner instructions in saved-library context.
- Stunned cooldown is **installed + registered-handler/client-planner tested only**, not App-verified.

Source capture `75a285a619afa79fddd54e241ef24ce0fe0857beeef49a228fbea18428ca3d28`;
assets `a22012d3be4915afefeb3d7ad2dc39aba1fd8659f31832fc6400d3683cac5122`,
`main.9e6bab1b.js`, exit0, frozenDrift `[]`. Artifact:
`D:/AppData/Temp/opencode/component-integration-20261108/build-run/build`.
Combined App result `d0003247e7229da40a4f87efe3f29a8a1aa363aeb5f1eee8b21d60ca25b65267`,
passed/errors[]/sourceDrift[]. Normal Combat Initiator discovery/manual initiative/Begin Combat (3)
produced `[pc,A,B]`; no `combat_started` fallback. Four owner casts include legal reuse of both shapes.

Reconciliation: Opus7 exact bases +4 absent →11 exact released finals; Flash4 already exact released
finals, never blindly patched from `b3a2870a`. Reproduced missing refused-Inspect explanation and added
only the shared read-only view, preserving the parent source-route eligibility gates. Server72/client69
+neighbor19 focused checks pass; mirrors and introduced-code lint clean. No broad suites/historical App
reruns. Existing save/payment/attribute/DR/source-target gates retained; no catalogue authorization.

Two concurrent unreleased `SharedDefendingEditor.jsx/.css` edits were caught before install, preserved
live and excluded from the artifact. Candidate copies equal accepted T source exactly. No whole-current-
live-tree parity claim. Scoped guarded install/backups, selected22 live/build hashes and final evidence:
[`handoff/combined-component-integration/`](../handoff/combined-component-integration/HANDOFF.md).
All integration resources/claims released; port4180 free, compiler/browser contexts closed. HEADQ retains
coordination; attribute hold remains. No commit/push/deploy/migration/dependency change.

## 7. Refreshed readable active effects + composed preservation — App acceptance, 2026-11-08

**Already-installed exact finals / carried releases / one identified build / ordinary-App PASS / RELEASED
(presentation + storage conservation).** The refreshed `SharedDefendingEditor` finals
(`dccd32c5`/`2525ce63`/`ae9b82d7`) and the released `composedSpellPreservation` suite (`ad25f5c6`) were
accepted together on one optimized artifact without patching any product file. Prior installed
cooldown/route finals (22 entries) verified unchanged; profile mirror and the held attribute vocabulary
remain exact.

Source capture `f941f7c0190759bcf1f98e5485b4dd4995ba71d02cd04b282af32bb8a8d6187c`;
assets `f08310db7b5edd7a3c469328226fafe4e37dffc126dfcd4dc1a2c918a2807cb9`,
`main.c7677086.js`, exit0, frozenDrift `[]`, liveDrift `[]`. Artifact:
`D:/AppData/Temp/opencode/active-effects-integration-20261108/build-run/build`.

Ordinary-App PASS (readable): GM/observer shared-condition editor with sibling `Active attribute changes`
and `Active movement effects` outside `Shared Stunned` (labels, totals, timing, base-stats notice);
a Wizard-authored/admitted/owner-cast periodic instance with a live due tick (GM Apply/Dismiss; observer
read-only), and the final authenticated boundary leaves a visible, resolvable natural-expiry final tick.
Target HP unchanged. Attribute/movement application routes remain those of the released attribute-modifier
and movement witnesses; display records were fixture-installed through the canonical make*Record shapes.

Ordinary-App PASS (composed, storage conservation): author → reopen → rename/save → reopen preserves every
composed field (formulas, tick policy/count/roll, cooldown, AP/mana, component texts); abandoning an edit
leaves the stored record byte-identical. **Substantive App finding:** the production Spellbook window mounts
the Wizard with `hideHeader`, so `Finalize & Update Spell` / `Cancel Edit` are unreachable there; the
reachable `ExternalLivePreview` `Complete Spell` always mints a new custom id (asserted/disclosed, not
claimed as identity-preserving update). Identity-preserving update and edit-discard remain covered by the
released production-path suite; reported for the Spellbook/Wizard owners, not patched in this pass.

Bounded independent review ACCEPT (non-blocking findings recorded). Evidence and exact hashes:
[`handoff/active-effects-integration/`](../handoff/active-effects-integration/HANDOFF.md). Sonnet STR/CON/CHA
integration and formula-riders runtime installation remain held/excluded. Port 4180, compiler and browser
contexts released; no commit/push/deploy/migration/dependency/catalogue change.

## 8. Formula-rider D1 + standalone INT pool repair — integrated / App PASS / RELEASED, 2026-11-08

| Scope | Specified | Implemented | Installed | Reviewed | Identified-build verified | Ordinary-App verified | Released for ordinary gameplay |
|---|---|---|---|---|---|---|---|
| M4A attribute immediate damage/healing × one movement/Stunned rider, PC → creature, AP/mana | Yes; existing M4A/A10/A11 | Yes | D1 exact 11 finals | Original ACCEPT + delta ACCEPT; no substantive runtime merge delta | F below; 11/11 exact | Movement/damage + retained dice/reapproval/recovery/expiry/removal PASS; Stunned/healing handler/client only | Yes, bounded D1 route; App scope as stated |
| Existing INT room modifier × stored-pool equipment/stat recalculation | Yes; no room-derived pool change | Yes | Standalone exact 3 finals | Sonnet pool ACCEPT; two runtime files byte-identical | F below; 3/3 exact | INT−2 × ordinary Equip/Unequip, formula preview, reload and exact removal PASS | Yes; no historical saved-character repair |

Standalone `handoff/int-room-pool-repair/` was extracted at the user's explicit request from Sonnet's
reviewed pool delta, with fresh live-base checks, manifests, patch, installer and original RED/GREEN
evidence; no profile/admission/panel delta. Formula D1 installed by its own guarded installer. Backups
remain with each package. Sonnet panel candidate predates installed cooldown wording; never copied.
Its actual delivered patch has no panel hunk. Opus's single formula-target diagnostic becomes the
forward merge base, preserving cooldown copy/gates. Explicit reconciliation/notification is in the ledger.

Focused current checks: server 68 PASS (D1/cooldown/M5 formula/compatibility/attributes); seven client
suites 34 PASS; corrected neighbor path plus three affected suites 20 PASS. Initial wrong neighbor
path failed to load, not a product assertion. Mirrors/scoped lint clean. No broad audit or closed
active-effects acceptance rerun. Its Spellbook qualification remains §7. Flash's repair release was
observed after final capture; leave its short acceptance separate. Missing-health and
deterministic bundles, STR/CHA admission, Constitution and NEW formula+rider+cooldown stay excluded.

**Build F:** one actual detached compile; initial source copy refused before compiler on concurrent
Wizard drift. Immutable candidate retained prior accepted Wizard bytes, preserving live concurrent edits.
Capture `afc10032607314d718e428cf37e272ee765e8a1854c86e2a22f84993c7190ca9` (11,884 inputs),
assets `7c3d49636cb180234c8f28cc1c285dc6db763bec6c2d087405c8c5aeec2ec006`, `main.1ab45d3a.js`,
exit0/frozenDrift[]. Artifact `D:/AppData/Temp/opencode/formula-pool-integration-20261108/build-final/build`;
9,181-file inventory and **36/36 selected released=current=captured** coverage in
`handoff/formula-pool-integration/{BUILD_FILES.sha256,SOURCE_COVERAGE.json}`. Build liveDrift[] is against
the frozen candidate, not the evolving live checkout. Seven concurrent Wizard/dialog/style paths and
another owner's witness differ later; all retained live and reported separately, no whole-tree parity.

**New interaction coverage:** M4A attribute formula × movement × authenticated expiry; changed input
refuses whole, retained[5,2] reapproval INT19→17 changes13→12; one atomic payment/HP/rider receipt,
lost-ACK Check same command, exact boundary expiry and GM removal. Combat Initiator selects pc/A/B
(actual roster A/B/pc), no combat_started fallback. Formula result
`e1147535049270aa8f3059bbf01cf94a4e8e0011850f19546092598032a7ce28`, PASS/errors[].

INT room modifier × ordinary inventory Equip/Character Sheet Unequip × reload/removal: actual formula
preview INT12→10→12, stored **HP45/85, mana45/64, AP2/4** unchanged through all four equipment cycles
(eight ordinary changes), no evaluated recalculation. Explicit skald heritage/Mortal Frailty expectations,
complete deterministic target; saved base provenance and stats unchanged. Pool result
`553d7859c50797b04afbf0725f693e943ff1d8bb56b46ab113fdb88d1940d343`, PASS/errors[]. Equipment/personal
INT pool bonuses remain covered by the focused regression, no blanket suppression of effective scores.

Fixture boundaries remain identity/ownership/lease/cloud; neutral item delivery and creature ability
attachment disclosed. Pool reload uses complete personal-mode production loadCharacter then fixture
room entry, without corrective snapshot/hydration/pool writes; not live cloud persistence. Failed
bootstrap/selector attempts retained; no product change after install. Exact witness/result hashes,
review lineage, exclusions and resources: `handoff/formula-pool-integration/HANDOFF.md` and `RESULTS.json`.
All integration claims, compiler/4180/profiles released; other owners' processes preserved. HEADQ retains
integration/build coordination. No commit/push/deploy/pin/migration/upgrade.

## 9. Combined release integration: Formula + Rider + Cooldown, Exact Target Labels, and Wizard Acceptance Qualification — 2026-11-08

**All four releases integrated, verified on one identified repository build, ordinary-App witnesses PASS across all stages, RELEASED.**

### 1. Scopes & Deliverables
1. **Opus Formula + Rider + Cooldown candidate (`handoff/formula-rider-cooldown/`):**
   - 10/10 final paths verified exact (`already-final` via guarded installer).
   - Server handler tests (`server/tests/p14RiderFormulaCooldown.production.test.js`) 8/8 PASS; client tests (`riderFormulaCooldown.test.js`, `SpellConsequenceFormulaRiderCooldown.test.jsx`) 4/4 PASS.
   - Ordinary App browser acceptance run (`vtt-react/verification/p14/rider-formula-cooldown-app-browser.cjs`) PASS with exit code 0 (`rf-app-r1/result.json`).
   - Covered journey: Combat Initiator ordinary controls (roster `A`, `B`, `pc`), authenticated caster-start cooldown (2 starts), owner-attested caster score calculation (INT 19 -> 13 dmg), Dulling Fog application (-2 INT), stale refusal on INT change (`owner_reapproval_required`), owner reapproval with retained physical faces ([5, 2] -> 12 dmg), simulated lost ACK/accepted broadcast + reload + "Check same command" single atomic receipt, blocked reuse during cooldown, authenticated advances (Mired expires at turn 2; cooldown releases at turn 5), and legal reuse with retained faces from refused attempt.
2. **DS Exact Target Labels (`handoff/exact-target-labels/`):**
   - 3/3 final paths verified exact byte-for-byte (`TargetPickOverlay.jsx`, `targetPick.js`, `TargetPickOverlay.test.jsx`).
   - Unit tests: 4/4 PASS.
   - Ordinary App browser acceptance run (`vtt-react/verification/p14/exact-target-labels-app-browser.cjs`) PASS with exit code 0 (`tl-app-r1/result.json`).
   - Verified: Two same-named visible creatures ("Cave Stalker") placed on map receive distinct Preview target options labeled `Cave Stalker · creature · A · (120, 150)` and `Cave Stalker · creature · B · (380, 240)`. Hidden same-named token strictly excluded for non-GM owner. Selecting second target returns exact actor ref (`tokenId: 'B'`). Removal of selected creature clears selection with diagnostic (`The selected target is missing, replaced or no longer eligible`) without silently retargeting creature A.
3. **Wizard Step 10 & Composed Preservation Acceptance Qualification (`handoff/composed-spell-preservation/`):**
   - Repaired `dateCreated` preservation across edit/save cycles: `SpellwizardApp.jsx` loads `spellCopy.dateCreated` without contaminating `cleanWizardState`/`authoredDraft`; `Step10Review.jsx` and `ExternalLivePreview.jsx` retain existing `dateCreated` when editing; `SpellLibraryContext.js` `UPDATE_SPELL` guarantees `dateCreated: spell.dateCreated || updates.dateCreated || new Date().toISOString()`.
   - Unit tests: `spellbookEmbeddedUpdateControls.test.jsx` 12/12 PASS.
   - Ordinary App browser acceptance run (`vtt-react/verification/p14/composed-preservation-app-browser.cjs`) PASS across all 10 stages with exit code 0 (`cp-app-r1/result.json`).
   - Confirmed: `first.id === review.id === preview.id` (`custom-1794167077800-a1i8uabf0`), `first.dateCreated === review.dateCreated === preview.dateCreated` (`2026-11-08T19:44:37.800Z`), library count = 1, executable components survive, and `definitionFromWizard` admits updated supported spell without metadata contamination.
4. **Preserved Boundaries:**
   - Sol remained parked; no routine work routed to Sol.
   - STR/CHA/CON admission and unfinished consumable repair held/excluded.
   - No gameplay rules or catalogue pins added.

### 2. Identified Build Artifact
- Detached build via `cmd.exe /c npx craco build` with 8GB heap allocation.
- Output directory: `D:\AppData\Temp\opencode\headq-release-integration-20261108\build`
- Exit code: 0, 0 errors.
- Asset Manifest SHA256: `9c7e218d0c0d401face2aa3829a3dcd9cff50ab4929196d376871950ae5e56d8` (`main.2627de75.js`).

### 3. Resource Release
- Port 4180 verified free.
- All temporary background processes, fixture servers, and Playwright browser instances cleanly closed.
- Handoff artifacts published in `handoff/headq-combined-release/`.

## 10. Rider save cooldown — integrated / App PASS / RELEASED, 2026-11-08

| Scope | Specified | Implemented | Installed | Reviewed | Identified-build verified | Ordinary-App verified | Released for ordinary gameplay |
|---|---|---|---|---|---|---|---|
| Rider-local negates save × movement/Stunned rider × authenticated caster-start cooldown; owner PC → one creature | Yes; existing M4A/A10/A11/cooldown/save | Yes | Yes; 14/14 final paths exact | ACCEPT with notes | PASS (build `cbae0dee...` / `main.69764352.js`) | PASS (`rider-save-cooldown-app-browser.cjs`, 11/11 stages PASS, errors: []) | Yes; bounded rider-save-cooldown route |

### 1. Delivery & Installation Verification
- **Prerequisites & Identity Check:**
  - Verified prior release `handoff/formula-rider-cooldown/` identities: all 9 files `already-final` (exact byte-for-byte match).
  - Scope-transition regression for `SpellLibraryContext` persistence delta: `SpellLibraryScopeTransition.test.jsx` (17/17 PASS), `composedSpellPreservation.test.jsx` (3/3 PASS), `spellbookEmbeddedUpdateControls.test.jsx` (12/12 PASS).
  - Installer dry run: `python handoff/rider-save-cooldown/install.py` confirmed 9 modified files matched live bases and 5 new files absent.
  - Installed via `python handoff/rider-save-cooldown/install.py install`: 14/14 files installed, backups preserved in `handoff/rider-save-cooldown/backups/`, `INSTALLED.sha256` verified OK, and `node server/scripts/sync-shared.js --check` confirmed clean client/server shared mirror.
- **Affected Server & Client Suites:**
  - Server Mocha: `p14RiderSaveCooldown.production.test.js` (8), `p14TimedSaveBranch.production.test.js` (9), `p14SaveBranch.production.test.js` (10), `p14EffectCooldown.production.test.js` (12), `p14RiderFormulaCooldown.production.test.js` (8), `p14m5CompositionCooldown.production.test.js` (12) — **59 passing (0 failures)**.
  - Client Jest: `riderSaveCooldown.test.js` (3), `SpellConsequenceSaveCooldown.test.jsx` (1), `effectCooldown.test.js` (9), `Step6Cooldown.test.jsx` (4) — **4 suites passed, 17/17 tests passed**.

### 2. Identified Build Artifact
- Detached build via `cmd.exe /c npx craco build` with 8GB heap allocation per AGENTS.md ConPTY rules.
- Output directory: `D:\AppData\Temp\opencode\rider-save-cooldown-20261108\build`
- Exit code: 0, 0 errors.
- Asset Manifest SHA-256: `cbae0dee5276a7cd017d919d57796f4d4646beffe6384c1d006cf28e0d4cf410` (`main.69764352.js`).

### 3. Ordinary-App Browser Acceptance Witness
- Execution: `vtt-react/verification/p14/rider-save-cooldown-app-browser.cjs` executed via system Chrome (`RSC_CHANNEL=chrome`) against the identified production build artifact.
- Result Artifact: `D:\AppData\Temp\opencode\rider-save-cooldown-20261108\rsc-app-r1\result.json`
- Result SHA-256: `b487ed35351e999405656f3dcbf096e4989d817b273bd9253726b2bef7530449`
- Status: `passed: true`, `errors: []` across all 11 stages.

### 4. Verified Behaviors & Stages
1. **Author / Save / Reopen / Admit:** Spell Wizard configured with counted expiry (`target-end-count`, 2 occurrences) + Constitution DC 12 negates save + Cooldown (1 upcoming caster-turn start). Save/reopen cycle preserved whole record; room admission successfully admitted for owner PC.
2. **Combat Start:** Combat Initiator ordinary controls selected PC, A, and B (`Begin Combat (3)`); authoritative roster established as `['A', 'B', 'pc']`.
3. **Clock Adoption:** Shared turn expiry enabled authenticated turn expiry.
4. **Owner Approval:** Owner cast 1 displayed "Cooldown ready", both outcome branches, creature-only targets with explicit reason; physical d8 = 5 (total 8); approval spent nothing and started no cooldown.
5. **Failed Outcome + Lost-ACK Recovery:** GM card radio set to "Target fails" + ACK/accepted broadcast dropped to simulate network loss; GM reloaded and triggered "Check same command": produced ONE single atomic receipt paying 1 AP/2 mana, applying 8 damage (depleting 4 temp HP then 4 current HP), scheduling Rime Hobble (-10 ft movement) to B's 2nd turn end (seq 5), and recording cooldown [start 0, due 2, occurrences 1, period 3, cast commandId].
6. **Blocked Reuse (Failed Branch):** Owner attempt during active cooldown refused ("Not registered (ability on cooldown) — no payment was recorded."), world state untouched.
7. **Reload & Privacy:** Owner and observer reloaded; state verified from room; observer carried no private GM evidence.
8. **Exact Independent Release (Order A):** Advanced clock to boundary 2: cooldown released at its own authenticated boundary; Rime Hobble kept its scheduled expiry (order A); HP and resource pools remained unchanged.
9. **Saved Recast with Earlier Rider Active:** Owner cast 2 while Rime Hobble remained active; GM recorded "Target saves": 1 AP/2 mana paid, 9 damage applied, earlier rider & schedule byte-equal (`chosen.conditionApplied = false`), new cooldown started from this second receipt.
10. **Blocked Reuse (Saved Branch):** Owner attempt during second cooldown refused; world state untouched.
11. **Expiry + Release (Shared Boundary):** Clock advanced to boundary 5: Rime Hobble's second turn end (`riderDue === 5`) and the second cooldown's release (`release2 === 5`) occurred on the exact same authenticated boundary (`sharedBoundary: true`). Both expired/released in commit sequence 8 in a single atomic receipt.

### 5. Roster-Dependent Shared-Boundary Qualification
- With roster `['A', 'B', 'pc']`, actor B immediately precedes PC in turn order. Consequently, Rime Hobble's second turn end (`riderDue === 5`) and the second cooldown's release (`release2 === 5`) converged on the exact same boundary (`sharedBoundary: true`).
- Server test suites (`server/tests/p14RiderSaveCooldown.production.test.js`) already exercise and cover independent boundary sequences. The ordinary-App witness verified that when the boundary is shared, the VTT correctly processes both condition expiration and cooldown release cleanly within the same advance receipt without conflict or dropped state.

### 6. Preserved Boundaries & Resources
- **Sol Work:** Sol remains parked; no routine work routed to Sol.
- **Attributes & Admission:** STR/CHA/CON admission and unreleased attributes remain held.
- **Consumables:** Unfinished consumable work (`handoff/consumable-shared-room-atomicity/`) strictly preserved and held.
- **Rules & Catalogue:** No gameplay restrictions bypassed or unreleased catalogue pins added.
- **Resources Released:** Port 4180 verified free (no active listeners); all detached compiler, fixture, and browser processes terminated.

## 11. HEADQ two-minute critical-path update — 2026-11-09

**Current coordination:** Flash owns live integration and builds by the creator's direction for this
session; earlier HEADQ build-ownership statements above are historical. HEADQ's bounded documentation
pass is complete and its claims released. No implementation/build/App resources were acquired.
The final consumable review is **AWAITING HANDOFF**, as explicitly selected by the creator after the
requested paths were unavailable. See [`handoff/headq-bounded-review/REVIEW.md`](../handoff/headq-bounded-review/REVIEW.md).

### Evidence carried forward, not re-executed

- **Formula × rider × cooldown:** installed/reviewed/identified-build/App/released (§9); retained-face
  reapproval, original-command recovery, blocked reuse and independent expiry/release are established.
- **Rider-local negates save × timed rider × cooldown:** the same seven stages are recorded (§10).
  Saved recast preserves an earlier rider; a shared expiry/release boundary is App-proven. Independent
  boundary arrangements remain handler evidence, not an additional App journey.
- **Exact target selection × actor removal:** same-named visible creatures remain distinguishable;
  removing the selection clears it rather than retargeting (§9). **Edit/update identity × persistence:**
  original id/dateCreated, one entry and executable fields survive both completion paths (§9–10).
- These are interaction classes and carried release evidence, not new verification by this pass.
  Provisional catalogue completion stays **outside the success denominator**. No overall completion
  percentage is asserted; fixture App evidence does not close live-service or physical-table gates.

### Installed versus candidate; current ownership evidence

| Work | Evidence status now | Explicit owner / next acquisition |
|---|---|---|
| Released formula-rider-cooldown and plain-direct rider-save-cooldown | Installed and released as above; their union does **not** prove formula × save × rider × cooldown | Prior Opus deliveries released; Flash owns current integration/build scheduling |
| Opus's **next formula/save composition** | Current exact claim, sealed candidate and installation evidence not located; no stage advancement or gameplay release inferred | Creator identifies Opus's lane; current owner-authored claim still required |
| Consumable reconciliation/recovery | Installed canonical-r2 (11/11 files), verified on build `41df5371`, 7/7 ordinary-App checks PASS (baseline 3 + closeout 4), component storage bounds PASS; RELEASED (§12) | Acceptance complete; frozen runtime; limitations disclosed |
| Remaining STR/CON/CHA attribute work | Held/excluded (§8–10); standalone INT pool repair is installed/released, not evidence that the wider candidate landed | `attribute-core/CLAIM.md` explicitly labels its candidate **HEADQ**; Sonnet attribution in earlier prose is historical, not a fresh claim |
| M6A area/multi-target; typed class-payment bridge | Both installed under existing bounded contracts; ordinary area execution gated; no ordinary-play composed class pin | No current implementation owner acquired in this pass; Flash scheduling ownership grants no content approval |

### Five next slices from the existing roadmap

These are priorities for acquisition, **not new implementation claims**.

1. **M4 composition: formula × save × existing rider/cooldown.** Receive Opus's exact candidate;
   review only its new seams, then Flash integrates if released. Engineering gap: preserve stale-input
   reapproval, retained faces, branch binding and one payment/receipt. Rider-local negates needs no
   new universal save rule; half-save rounding/automated save math remains a separate creator decision.
2. **M3: remaining attribute → real consumers.** Reconcile the existing held candidate with installed
   cooldown/formula work; demonstrate actual consumers, removal/expiry and stored-pool conservation.
   Engineering/review gap; no blanket derived-pool/refill authorization. No fresh owner claim located.
3. **M6A: resolve the existing bounded area activation gate.** Can progress independently of consumables,
   formula/save composition and new resource homes. Creator must explicitly approve or replace
   `shared-area-roll-proposed`: one owner face set proposes the amount for each target, GM adjudicates
   each final amount. Default `creatorApproval: null` remains closed. Atomic 1–8-creature execution
   already exists; the old general N-actor architecture question is not this slice's blocker.
4. **R-track: one frozen resource-domain descriptor/home.** Class HQ must supply the selected domain's
   value/price/conservation/overflow/public-view contract; engineering then reuses typed payment/P7.
   Contract/content work can proceed independently of consumable recovery and area-roll approval.
   Separately, the already-installed three-domain composition bridge needs an explicitly approved
   complete unchanged record plus trusted production pin; a synthetic stripped spell is not closure.
5. **M7: one reaction-card consequence binder.** Reuse W/E1a cause/opportunity/parent identities,
   consent and receipts. Creator must settle that selected card's payment, ordering and interruption
   semantics; engineering supplies its binder and once-only recovery. No generic trigger engine or
   current implementation owner is assumed.

**Immediate release gate:** consumable recovery still needs Flash's sealed identities, DS's findings,
original-disposition reconciliation and a bounded command/actor/item review. This is an engineering
and evidence gap. The separate creator question—owner attribute potion stays GM-applied/refused or
uses `actor_propose`—must not silently change authority during that repair. Class-record discrepancies,
profile confirmation and real ability pins are content/Class HQ questions, not missing core engines.


## 12. Consumable acceptance closeout — verified-build App witness PASS / RELEASED, 2026-11-09

| Scope | Specified | Implemented | Installed | Reviewed | Identified-build verified | Ordinary-App verified | Released for ordinary gameplay |
|---|---|---|---|---|---|---|---|
| Consumable transaction closeout: refusal protection, single deduction + mixed condition/heal, overheal Cancel, duplicate click/replay lock, character switch isolation, same-device reload recovery | Yes; P7/P8 contracts | Yes | Yes; 11/11 canonical-r2 files match `FINAL.sha256` | ACCEPT (independent DS review + HEADQ closeout) | PASS (build `C8A376BE...` / `main.41df5371.js`) | PASS (`consumable-entry-points-app-browser.cjs`, 7/7 checks PASS, errors: []) | Yes; bounded same-device route (limitations disclosed) |

### 1. Exact Installed, Source & Build Coverage
- **Installed Runtime Bytes (Frozen):**
  - Package integrity check via `node handoff/consumable-transaction-boundary/revision-20261109-canonical-r2/install.cjs --check` reports `status: "already-final"` across all 11 files with zero writes:
    1. `server/handlers/actorConsequenceHandlers.js` (`1315570bbd26fa8cb4dd71a17960fa7406a445e99815c32fa69c1042b40693a1`)
    2. `server/services/actorConsequences.js` (`451a56ea74b9b9991cae5e1c4df27c9d9685a9754f9a05b38aa39f37fe3188d3`)
    3. `server/shared/data/sharedConditionProfiles.json` (`6a1b24467ec50c70dcaafeb197171d8717d23d8c11bf98b2eb6e55bbdfb175d7`)
    4. `server/shared/services/catalogueAbility.cjs` (`b59bc659c25608b8b7e0ebfe9d0ef7eaec9e414c0a5204482cf1dbd15dc9ec14`)
    5. `server/shared/services/sharedConditionProfile.js` (`672583da701c67623910c0e86b03947b1981a8f3be2939db27d92cfab10bb574`)
    6. `server/tests/p14m5CompositionFormula.production.test.js` (`bc7c97800cf8516eeaa6407d578b88d30e0147fc2796dd9c7fa0dbd4c4a45749`)
    7. `vtt-react/src/components/character-sheet/SpellActionBar.jsx` (`1cf5a6a6839352c803328e7e7ce71bb7a58e6583908dbff46b142921b72e5052`)
    8. `vtt-react/src/components/hud/BlockingPanel.jsx` (`abf16f5c88b939023c40134ba9a61358a9fec9224422e11d04467c6eb23fc63d`)
    9. `vtt-react/src/components/hud/SpellConsequencePanel.jsx` (`263b8602b9dd632d4b655fc92e21fe82c9e78ea902d33400a4d10f22d56a2bb0`)
    10. `vtt-react/src/components/ui/__tests__/ActionBarConsumableSharedRoom.test.jsx` (`91db72691523b0d5c0e189280d82d43dbcae8a8b136894c25ebc089201a084ef`)
    11. `vtt-react/src/services/consumableCondition.js` (`36113b5bfd170ff456e79b9b5fba45746ee45ce4e3950d24e12ffea25672659e`)
- **Identified Production Build Artifact:**
  - Build directory: `d:/VTT/vtt-react/build` (created 2026-11-09 14:25:30)
  - `asset-manifest.json` SHA-256: `C8A376BE170BFCB3BB6E68DE7CFAF99527C6D9674564B87E9DEB33C8ACAD14CE`
  - Entrypoint `static/js/main.41df5371.js` SHA-256: `AFD5061BE77B16EBA1C91875BF753BEE2B8FD852AD59515E6C6914D06F7E1FEF`
  - Runtime product bytes remained frozen; no rebuild was triggered because existing artifact coverage was 100% complete and compatible.

### 2. Separation of App-Proven Behavior vs. Component/Production-Handler Proofs
To maintain engineering truth, ordinary-App verified behavior is separated from component and system-level proofs:

| Capability / Behavior | Evidence Source | Proven Boundary |
|---|---|---|
| **Ordinary Refusal Atomicity** | Ordinary-App witness (`vtt-react/verification/p14/consumable-evidence-r2/`) | Exercised across Action Bar, SpellActionBar, and Inventory. Family potion refused; item preserved in pack (qty 2), server HP unchanged (20), room conditions 0, refusal notice displayed. |
| **Mixed Healing + Condition Single Deduction** | Ordinary-App witness (`vtt-react/verification/p14/consumable-evidence-r2/`) | Exercised across all 3 entry points. Potion of Vigor consumed once (qty 2 -> 1), 1 room condition applied, server HP healed once (+5 to 25). |
| **Overheal Cancel Before Effects** | Ordinary-App witness (`vtt-react/verification/p14/consumable-evidence-closeout/`) | Potion restoring 25 HP at 20/40 HP triggers manuscript `Overheal Detected` dialog (`overheal-modal.aria.yml`). Clicking Cancel emits 0 commands, keeps server HP at 20, keeps local HP at 20, keeps inventory at 2, and releases the consumption lock. |
| **Duplicate Click / Replay Protection** | Ordinary-App witness (`vtt-react/verification/p14/consumable-evidence-closeout/`) | Rapid double-clicking action slot triggers `withConsumeLock`. Second click is rejected; exactly 1 command emitted, 1 condition applied, server HP healed +5 once (25), inventory decremented once (2 -> 1). |
| **Character Switch & Return Isolation** | Ordinary-App witness (`vtt-react/verification/p14/consumable-evidence-closeout/`) | Command held in flight while switching active character to Character B (`other`). Character B health untouched (15/50). Server ACK commits; command preserved in `mythrill-vtt:unresolved-consumable-commands:v1` journal scoped to `ilse`. Switching back to `ilse` and activating slot reconciles Character A's HP to 25 and decrements pack to 1 without foreign mutation. |
| **Same-Device Reload Recovery** | Ordinary-App witness (`vtt-react/verification/p14/consumable-evidence-closeout/`) | Simulated reload with receipt preserved in localStorage journal: page reloads, journal survives in localStorage, activating slot recovers transaction via `reconcileUnresolved`, server returns known receipt without duplicate condition or revision bump, inventory decrements once (2 -> 1). |
| **Strict Schema Validation & Server Deduplication** | Server production suites (`consumableReceiptDeduplication.headq.production.test.js`, `actorConsequenceHandlers.js`) | Server verifies command schema, executes state transition, records command identity receipt, and deduplicates repeated commands idempotently. |
| **Durable Web Locks Persistence & Storage Failure Permutations** | Component & unit tests (`consumablePersistenceBoundary.ds.test.js`, `ActionBarConsumableUncertainDelivery.headq.test.jsx`) | 10-case storage failure permutations verify scoped Web Locks storage engine, draft storage failures, at-most-once safety, and under-debit behavior under simulated failure. |

### 3. SpellActionBar Witness Limitation Disclosure
- In `consumable-entry-points-app-browser.cjs`, `spellBarEntry` records removals by intercepting `inventoryStore.removeItem` via `window.__removals` rather than reading post-route inventory quantity.
- **Reason:** Navigating to the character sheet view (`/account/characters/view/ilse`) triggers background scoped inventory rehydration that overwrites test-seeded in-memory inventory items during the fixture run.
- **Scope & Disclosed Gap:** Asserting that `removeItem` was called with the correct arguments is strictly narrower than verifying durable reduction in persisted client storage. The durable storage engine under Web Locks is proven by the component/system tests (`consumablePersistenceBoundary.ds.test.js`), not by the SpellActionBar App witness.

### 4. Preserved Documented Limitations (No Universal Exactly-Once Claim)
1. **Storage-Failure Under-Debit Window:** If local draft storage fails during synchronous character saving before asynchronous Web Locks inventory persist completes, an under-debit can occur (item remains in inventory while room effect landed). Under healthy local storage, execution is exactly-once; under storage failure, it is at-most-once (no double deduction).
2. **Cross-Device Exclusion:** Client inventory is strictly device- and character-scoped. Server deduplication operates solely on command identity (`knownReceipt`). There is no distributed cross-device inventory ledger.
3. **Post-Submit Journal-Failure Limitation:** If browser storage fails after command submission, recovery is limited to live session memory and does not survive a page reload.

### 5. Retained Historical Evidence
- Historical failed run preserved: `vtt-react/verification/p14/consumable-evidence/`
- Canonical-r2 report preserved: `vtt-react/verification/p14/consumable-evidence-r2/`
- Closeout missing checks evidence preserved: `vtt-react/verification/p14/consumable-evidence-closeout/`
  - `result.json` (`passed: true`, `errors: []`, all 4 extended checks true)
  - `overheal-modal.aria.yml` (manuscript dialog snapshot)

### 6. Subsystem Status & Queued Release Coordination
- **Consumable Runtime:** 100% frozen. No runtime edits; no Wizard explanation edits.
- **Attribute-Cooldown Release:** RELEASED. Package `handoff/attribute-cooldowns/`. Verified against identified production build `d:\VTT\vtt-react\build` (`asset-manifest.json` SHA-256 `e85803fb378bb0cac1aeaf2046da51ea20e81cafb92fef7757e11b62ebae4d62`, `main.7bad4111.js` SHA-256 `5eeb2a179f516c1762f808b2da0860bb677ac51297146d779dfcf0b537068bae`). All 16 checks across 5 stages PASS.

---

## 13. Attribute Cooldowns Release Report (2026-11-09)

| Scope | Specified | Implemented | Installed | Reviewed | Identified-build verified | Ordinary-App verified | Released for ordinary gameplay |
|---|---|---|---|---|---|---|---|
| Attribute effects + authenticated caster-start cooldowns: author/save/reopen/admit, atomic payment/condition/cooldown receipt, independent effect/cooldown lifecycle, blocked reuse notification, boundary release, combination refusal, dropped-ACK recovery, plain damage + attribute | Yes; A10/A11/cooldown contracts | Yes | Yes; 12/12 candidate files + 12 dependency guards match `FINAL.sha256` | ACCEPT (independent DS verdict + HEADQ release) | PASS (build `e85803fb...` / `main.7bad4111.js`) | PASS (`attribute-cooldown-app-browser.cjs`, 16/16 checks PASS, errors: []) | Yes; bounded placed-creature route (exclusions disclosed) |

### 1. Exact Installed, Source & Build Coverage
- **Installed Runtime Bytes:**
  - Package integrity check via `node handoff/attribute-cooldowns/install.cjs --check` confirms `status: "already-final"` across all 24 guarded paths (12 candidates + 12 dependency guards) with 0 drift:
    1. `vtt-react/src/services/authoredAbility.js` (`0c2014b15df94db830c560cc8ccbc406da13d8c2fca24a5b0de02d794887ea47`)
    2. `server/shared/services/authoredAbility.js` (`0c2014b15df94db830c560cc8ccbc406da13d8c2fca24a5b0de02d794887ea47`)
    3. `server/services/installedDefinitionRegistry.js` (`45f3fbbb61c4d00e1345765733bffaa2ee7ec67db76c3280375f530edd36618d`)
    4. `vtt-react/src/components/spellcrafting-wizard/components/steps/Step6Cooldown.jsx` (`c8d68a44faebef277c7927c5168d3149ad702fdb8caadcea4c511e5c4818eefe`)
    5. `server/tests/p14AttributeCooldown.production.test.js` (`9cc501672d2e6b8e3880e86321615947ab20fe4e49ebf9bc48a3f69c804389a2`)
    6. `vtt-react/src/services/__tests__/attributeCooldown.test.js` (`7bc22756564616099838d64b8ffab91e4fe3765e33edfb9ee92bad27292e666a`)
    7. `server/tests/p14EffectCooldown.production.test.js` (`2526266f5c13d497a23b334ad4a6ee5da2d8e5d9d3f7d5da156fb8ad4644eee5`)
    8. `server/tests/p14m5CompositionCooldown.production.test.js` (`42845ab05c901ce6f28ec6c5e2eaf0c8daa7c4f22f5655dbf75051c0c401ded9`)
    9. `vtt-react/src/services/__tests__/effectCooldown.test.js` (`79abcae11f24bfa19d340a497880bac13543724dd730dd5b96fad8ed81a31138`)
    10. `vtt-react/src/services/__tests__/support/attributeCooldownBase.json` (`f44345ab38eb26743c8f9ccededfb4e64283109a04c3f9a948b0b62cc1870b26`)
    11. `server/tests/p14RiderFormulaCooldown.production.test.js` (`8fb3c6ea475dc105cc01b66609796276edb9d413ce343121cc054c742fe32767`)
    12. `vtt-react/src/components/spellcrafting-wizard/components/steps/__tests__/Step6Cooldown.test.jsx` (`c03f54845779616d95a5007f8bbbda0a38a810b59337c9848a5959fd7fc4068f`)
    - Dependency guards verified: `server/services/actorConsequences.js` (`d0f4e6a8...`), `server/services/authoredCooldowns.js` (`628a7e57...`), `server/services/sharedEffectLifecycle.js` (`918c8215...`), `server/services/spellPayments.js` (`4ca99fb2...`), `server/services/installedAuthoredAbilities.js` (`a682c204...`), `server/shared/services/sharedConditionProfile.js` (`9cdb7122...`), `server/shared/data/sharedConditionProfiles.json` (`b798e060...`), `vtt-react/src/data/sharedConditionProfiles.json` (`b798e060...`), `vtt-react/src/store/conditionStore.js` (`f2079f2f...`), `vtt-react/src/store/characterSlices/statsSlice.js` (`768d123f...`), `vtt-react/src/components/hud/SpellConsequencePanel.jsx` (`0bf3d03c...`), `server/services/strikeApprovals.js` (`1d157354...`).
  - Shared mirror sync verified: `server/scripts/sync-shared.js --check` reports `server/shared is up to date`.
- **Identified Production Build Artifact:**
  - Build directory: `d:/VTT/vtt-react/build`
  - `asset-manifest.json` SHA-256: `e85803fb378bb0cac1aeaf2046da51ea20e81cafb92fef7757e11b62ebae4d62`
  - Main entrypoint `static/js/main.7bad4111.js` SHA-256: `5eeb2a179f516c1762f808b2da0860bb677ac51297146d779dfcf0b537068bae`
  - Main CSS `static/css/main.f075bedb.css` SHA-256: `2785b96de0524042914bf2c2941bd7334980e6beb665bcc45f319e3b81beae93`

### 2. Ordinary-App Verified Behaviors (APP_CHECKLIST.md Full Pass)
The Playwright witness `vtt-react/verification/p14/attribute-cooldown-app-browser.cjs` executed against the identified production build on port 4581 with 0 errors (`passed: true`), generating 22 public ledger receipts in `result.json`:

1. **Pre-flight Excluded Combinations:** `definitionFromWizard` correctly refuses STR, CON, CHA, and attribute + save combinations.
2. **Authoring, Reopen & Room Admission (Stage 0):** Four distinct abilities authored through ordinary Spell Wizard, saved to localStorage, reopened, and admitted into the room:
   - D1: *Dulling Charm* (arcane, action, Intelligence −2, gm-manual expiry, 30 ft, 1 AP, 2 mana, cooldown 2).
   - D2: *Mire Twist* (arcane, action, Agility −2, target-next-start expiry, 30 ft, 1 AP, 2 mana, cooldown 2).
   - D3: *Spirit Flare* (arcane, action, Spirit +2, target-end-count 3 expiry, 30 ft, 1 AP, 2 mana, cooldown 1).
   - D4: *Agility Strike* (arcane, action, plain damage 1d6+2 + Agility −2, gm-manual expiry, 30 ft, 1 AP, 2 mana, cooldown 2).
3. **Atomic Payment + Effect + Cooldown (Stage 1):** D1 cast by owner PC on creature A at sequence 0. Caster AP (5+2 temp -> 5+1 temp) and mana (20+5 temp -> 20+3 temp) deducted in one receipt; condition `Intelligence −2` installed on A; cooldown recorded on PC due sequence 6.
4. **Dropped-ACK Recovery (Stage 1):** GM reload under dropped network ACK; "Check same command" recovers original command ID idempotently with 1 ledger receipt and 0 duplicate consequences.
5. **Blocked Reuse Notice (Stage 1):** Attempting recast while on cooldown displays remaining caster starts and release boundary; refuses without deducting resources or starting new cooldowns.
6. **Independent Lifecycle & Boundary Release (Stage 1):** GM exact manual removal removes condition on creature A while cooldown remains active; sequence 3 advance leaves 1 start remaining; sequence 6 advance releases cooldown at authenticated boundary.
7. **Timed Effect Expiry vs. Cooldown (Stage 2):** D2 cast at seq 6 due seq 12; sequence 8 advance expires Agility −2 on target start (restoring effective AGI) while cooldown stays blocked; sequence 12 advance releases cooldown.
8. **Counted Expiry vs. Cooldown (Stage 3):** D3 cast at seq 12 due seq 15; sequence 15 advance releases cooldown at boundary 15 while counted Spirit +2 condition remains active.
9. **Same-Attribute Combination Refusal (Stage 3):** Recasting D3 on A while active is refused by same-attribute policy (`already changes Spirit on this target`), spending 0 AP/mana and starting no cooldown.
10. **Plain Direct Damage + Attribute Condition (Stage 4):** D4 cast on creature B with rolled 1d6+2 (4+2 = 6 damage); one receipt applies 6 damage, Agility −2 condition, and cooldown 2.
11. **Protected Consumers & Pools (Stage 5):** Stored pool protection (INT pool derivation) and formula reapproval contracts verified intact.

### 3. Preserved Exclusions & Boundaries
- Scope fence strictly preserved: STR/CON/CHA excluded from wizard and definitions; Save + attribute combination refused; PC targets refused on cooldown route ("PC targets unavailable: an ability with a caster-start cooldown applies to one placed creature only; a player character target stays manual."); catalogue/potion routes excluded.
- Fixture boundaries disclosed: mocked identity/provider/ownership, temporary room, complete deterministic owner record.
- Consumable runtime and Wizard explanations remain 100% frozen.

---

## 14. Trigger-Authoring Preservation Integration — verified-build App witness PASS / RELEASED, 2026-11-10

| Scope | Specified | Implemented | Installed | Reviewed | Identified-build verified | Ordinary-App verified | Released for ordinary gameplay |
|---|---|---|---|---|---|---|---|
| Trigger-authoring preservation: step visit non-mutation, reaction/passive & buff/debuff survival, copy identity/cancel, catalogue draft/copy admission, unsupported refused whole | Yes; authoring preservation contract | Yes | Yes; 4/4 candidate files match `FINAL.sha256` | ACCEPT (independent DS review + HEADQ release) | PASS (build `trigger-authoring-preservation-build-20261110` / `10e94d24...`) | PASS (`trigger-authoring-preservation-app-browser.cjs`, 9/9 stages PASS, errors: []) | Yes; authoring & storage preservation released (runtime execution remains refused) |

### 1. Exact Installed, Source & Build Coverage
- **Installed Runtime Bytes:**
  - 4/4 files match byte-for-byte with `handoff/trigger-authoring-preservation/FINAL.sha256`:
    1. `vtt-react/src/components/spellcrafting-wizard/components/common/useTriggerConfig.js` (`f68796bff10e10f3fb43490104983ffaa0c160ee1bcbd06106f01d979b109e5f`)
    2. `vtt-react/src/components/spellcrafting-wizard/SpellwizardApp.jsx` (`f7a9c41f2f01af97d88a11f2cba5fdb04ef565c1d39c3161f070b78bf0e3f2d1`)
    3. `vtt-react/src/components/spellcrafting-wizard/components/steps/Step10Review.jsx` (`4d0e45af476d9ab4714750ed74293a2ec9c5cb378d8f05c3706c387c7397ca53`)
    4. `vtt-react/src/components/spellcrafting-wizard/__tests__/triggerAuthoringPreservation.test.jsx` (`12eda3f15a2198234277cb039e3380fa47dd77ea2edf2e82e8c5286eab9d9fa3`)
- **Identified Production Build Artifact:**
  - Build directory: `D:/AppData/Temp/opencode/trigger-authoring-preservation-build-20261110/build`
  - Capture hash: `8638a702651a9b2dfd1309375cbe2c109fa535123ad513ace3500730d807d5dc`
  - Asset manifest SHA-256: `10e94d24c2b662f0011163c078ab2a2b16c9d3c9835693bb734f1ffb03a9b7fd`
  - Main chunk: `static/js/main.27692ccf.js`
  - Code-split Spellwizard chunk: `static/js/6588.5f2cd593.chunk.js`
  - Compiler exit: `0`
  - Frozen drift: `[]`

### 2. Verified Test Suites & Ordinary-App Witness
- **Scoped ESLint:** 0 errors, 0 warnings across all 4 touched files.
- **Packet Suite:** 14/14 tests PASS (`triggerAuthoringPreservation.test.jsx`).
- **Regression Suites:** 11 suites / 83 tests PASS (`m4bCatalogue`, `wizardLoadResolution`, `spellLibraryCopyIdentity`, `spellLibraryCopyCancel`, `spellbookEmbeddedUpdateControls`, `composedSpellPreservation`, `summonDefinitionPreservation`, `transformationDefinitionPreservation`, `SpellLibraryScopeTransition`, `SpellLibraryGrimoire`, `SharedSpellLibrary`). Combined unit total: 12 suites / 97 tests PASS.
- **Ordinary-App Witness:** `vtt-react/verification/p14/trigger-authoring-preservation-app-browser.cjs` passed all 9 checklist stages (`passed: true`, `errors: []`):
  1. Candidate identities and build manifest verified.
  2. Default record visiting Trigger step does not synthesize `conditionalEffects` or `global.enabled`; room admission granted.
  3. Reaction/passive compound triggers and required conditions survive Update and reopen.
  4. Effect-attached `buffDebuffTriggers` survive Update without corruption.
  5. Unsupported trigger mechanics survive storage and remain safely refused whole by `definitionFromWizard`.
  6. Duplicate creates independent copy (fresh id/date, same `authoredDefinitionId`); mutating copy preserves source record.
  7. Catalogue prepared draft retains default triggers, admits cleanly, and retains binding on duplicate.
  8. Discard Changes (Cancel) leaves stored record byte-identical.
  9. Full browser reload verifies persistence across page refreshes.

### 3. Preserved Exclusions & Boundaries
- Scope fence strictly preserved: authoring and storage preservation only; executes no triggers and provides zero playable runtime automation.
- Unsupported trigger shapes remain refused whole by `definitionFromWizard`.
- Catalogue pins, authorities, and class bindings untouched.

