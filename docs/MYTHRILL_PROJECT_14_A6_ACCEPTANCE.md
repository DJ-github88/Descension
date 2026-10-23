# P14-A6 — exact creature self-healing

2026-10-23 · **Implemented; bounded independent PASS; optimized Build2 / normal-App4 PASS (qualified).**
[Frozen contract](MYTHRILL_PROJECT_14_A6_CONTRACT.md). Accepted P7–A5 behavior carries forward.

## GM workflow now available

1. Tools → Library → Bestiary → Create/Edit Creature → Abilities. Author/select one compatible immediate
   direct healing ACTION with explicit AP/mana prices and bounded dice. Choose **Self** with range0,
   or **Any supported target**. Keep/save normally and place the creature.
2. Placed token → Token Actions → Inspect → Abilities & Spells. Bind if needed, refresh admission,
   **Admit for this creature**, then **Use for this creature**. The immutable saved association/version,
   exact room/map/token/incarnation and current authenticated GM supply authority.
3. In the existing action panel choose **Self — [exact name]**. Record physical faces or roll digitally
   once. Review formula, exact price, retained result, current/max HP and exact source/target identity.
4. **Validate source, target and retained roll**, adjudicate and enter final healing. Preview shows the
   proposed amount and actual HP restoration after cap. **Confirm one creature consequence** installs
   source payment and HP together. Receipt shows both GM-approved healing and actual restored HP.
5. Close/reopen/reload retains evidence. Changed state requires explicit **Revalidate original attempt
   (same roll)**; material authority/target changes use existing positive closure/context refresh.
   Unknown outcomes require **Check same command**, never a new roll or replacement command.

## Supported targeting and authoritative rules

Existing whole-record adapter/compiler: immediate ACTION, one direct healing effect, single/maxTargets1,
explicit bounded formula and AP/mana. `targetRestrictions:['self']` (compiler requires range0) and
`['any']` support Self, including any/range0. No inference from range alone. `enemy` excludes Self;
`ally` self-inclusion is unresolved/manual. If present, per-effect healing `targetType` must explicitly
be `self` or `any`; absent is compatible with the unified profile. Conflicting/complex/mixed records
remain whole/manual. Existing PC-only A1 and creature→PC A5 acceptance remain protected.

No new HP0 rule: existing authoritative direct restoration has no HP>0 gate; a focused case retains
that behavior. This is not admission of revival, regeneration, temporary HP, cleansing or periodic effects.
Canonical acting-source Stunned refuses before/after relevant awaits and at final stage. Defending
does not multiply healing. No condition removal/expiry or new refund/cancellation fee is introduced.

## One actor, one atomic installation

Existing `planSpellCommand` and `spellPayments.bindCommand` already merged source payment and target HP
when exact refs match. A6 enables that narrowly for creature direct healing. One `actors` entry contains
temp-first AP/mana and capped HP finals; P7 validates one before-state, increments revision once and
produces one receipt actor/combined projection/checkpoint. No second mutable source/target copy,
controller, endpoint, receipt store or P7 operation was introduced.

Self-only baseline hashes exact actor contract/revision, current resources/maxima and conditions in the
existing pending attempt. Preparation captures/rechecks across authority awaits; only explicit same-face
validation refreshes it. Binder refuses changed state until then. Existing whole-association/admission/
installed version/hash/current-GM/revocation checks remain authoritative. Missing payable pools refuse;
temporary pools pay first; explicit0 remains0. Healing leaves tempHP unchanged and caps normal HP.
Overhealing/accepted0 can still pay authored price. Open/roll/prepare/cancel spend nothing. Writer,
resource, identity, authority, condition or stale refusal installs neither payment nor HP.

Approved versus actual healing is receipt metadata computed by the client planner and independently
verified by the server binder against authoritative before-HP and capped after-HP. No fake +0 float.

### Production-App defects found and repaired

- The placed Inspect launcher had its own blanket range0/self-only disable guard. It now uses the same
  self-compatible predicate as controller/server; unsupported definitions remain disabled/manual.
- Admission increments source revision but formerly sent that projection only to the GM. With source
  also target, observers lacked the receipt's exact beforeRevision and correctly suppressed HP arithmetic.
  Successful admission now publishes its public ordered snapshot through existing `actor_bound` lifecycle
  delivery. Raw drafts/grants stay private, no result receipt/animation is produced, and no second write
  is added. Registered regression and final App prove the actual self-healing float.

## Retained evidence and recovery

Existing creature/spell attempt and shared-command custody retain faces before preparation and immutable
command before emission. Explicit Self/distinct mode changes retain faces; prepared changes require
positive old-attempt closure and revalidation. Duplicate confirmation returns the original receipt;
different bytes conflict. Unknown/pruned results block replacement. Reload/rejoin never auto-submit.
Lost ACK/broadcast checks original bytes, with no repeated payment/HP/chat/float. Historical recovery is
silent. Checkpoint reconstruction retains combined state/receipt; new epochs refuse old unknown attempts.
Temporary rooms are live-only; persistent accepted-live is not checkpoint-confirmed. No new cloud promise.

## Verification actually executed

- **Final implementer registered group: 91 PASS**: A6 18, A4 21, A5 16, A1 10, P7 consequence17,
  P7 bounds9. One combined group, no addition of earlier overlapping runs. Final log external
  `p14a6-server-final.log`. P7's incumbent small `verification/p7/evidence/server-results.json` witness
  is regenerated by that existing suite; random fixture IDs/times change, not runtime behavior.
- **Client: 4 suites /29 PASS**: new self planner/profile/feed checks, retained creature recovery and target
  changes, accepted-result feed, existing Creature Wizard producer regressions. Earlier3/23 overlaps.
  Incumbent jsdom canvas/store-fixture warnings and Demo Mode notices remain visible; real App uses canvas.
- Scoped client ESLint0; server ESLint0 using the incumbent no-brace style's `curly` override. No claim
  repository-wide/default lint is clean. Mechanical detector `[]` for the changed action panel.
- **Build2 exit0**, unmodified optimized CRACO/config/dependencies in external frozen workspace. Build1
  compiled but precedes the launcher correction. Build2 includes the final client runtime; the later
  public-admission-projection repair is server-only. No rebuild for unrelated concurrent Class drift.
- **App4 PASS**, actual optimized normal App, GM + observer, real Wizard/save/reopen and production
  store placement/registered handlers. Paid Self physical1d8+1 face4: approved5, actual2, HP8→10,
  AP6→5, mana50→47, revision1→2, one receipt actor, sibling unchanged and observer exactly one `+2 HP`.
  ACK+accepted delivery to GM deliberately lost; reload uses identical original command and original
  receipt, without another write or replayed chat/float. Free Any/range0 Self uses digital face3+1=4;
  GM explicitly confirms5 with adjustment reason.0 AP/0 mana remain unchanged. Registered canonical
  Stunned application after prepare refuses with room state unchanged; registered removal and explicit
  revalidation retain original digital faces and allow capped healing. Real rejoin has one room_joined
  listener and consequence count5→5. Observer private draft protection and once-only receipt chat pass.
- 1440/1024 captures and accessibility snapshots retained; no horizontal panel overflow. Captured1024
  viewport has reachable Close/final controls and vertical panel scrolling. Native select/inputs/buttons
  and existing focus restoration retained; no comprehensive accessibility/physical-device certification.
- Earlier App1 failed a witness selector, App2 exposed the launcher guard, App3 exposed the observer
  before-state gap. Those runs and repairs remain externally recorded; final App4 supersedes them.

## One bounded independent review

Same reviewer report `D:/AppData/Temp/opencode/p14a6-review1.md`: **bounded PASS, no repair requested**.
It inspected the narrow A6 source and final projection delta, independently executed **18 A6** and
**47 A4/A5/A1** registered tests, and independently verified55 runtime hashes, protected7,44 scoped
client build inputs and artifact identities. It appraised implementer Build2/App4 and witness source;
**it did not execute the build, App/browser, client suites or P7 suites**. Two earlier interrupted
delegation attempts produced no reviewer evidence; the completed review and its continuation are one
bounded review. No invented independent execution or broader historical audit is claimed.

## Exact identity and concurrent drift

Entry `master/14b21cfec10df7c5c198e1df13cccb79fbdd8c41`. Fresh A5 check:51/53 runtime match,
protected7 match; socket registration and EnhancedCreatureInspectView contain concurrent loot additions.
Preserved Class/Heritage/map/drawing/touch/settings/loot work. External commits advanced through
`f7b7c722`, `e098f768`, `76012be84f7aba409aad831bd6c2c768c0ec859d`, incorporating shared working bytes.
**This agent performed no commit, push, reset, migration, dependency upgrade or deployment.**

Final gate binds **55 runtime files**, App4 before/after/current hashes equal;44 scoped client inputs
match Build2. Protected7 unchanged. Build2 mirrorDrift `[]`; live build drift includes
`src/components/character-creation-wizard/steps/Step1CoreDraft.jsx`. Final comparison also includes
`src/components/talent-tree/__tests__/TalentTreeContent.test.jsx`. Additional concurrent Class test is
unlisted in that build census. Those changes are preserved; no identical-current-full-tree build claim
or semantic acceptance of concurrent content. Gate HEAD is `master/76012be8…`, not source identity alone.

| External artifact under `D:/AppData/Temp/opencode/` | SHA256 |
|---|---|
| `p14a6-final-evidence.json` | `908450b1002dbbe997296549e03e285004d6d22f4f1ee65a7081e05c3af84595` |
| `p14a6-build2/build.json` | `954139bb58b6dfaf2bae61ec041106299c6954cea861959ee42f7593927769fe` |
| Build2 `build/asset-manifest.json` | `390a85306f117391cb3b45b59fcc7f34b06c1a46e0e5d0b7c9c516739d16215b` |
| `p14a6-app4/result.json` | `302e1e12d0534da86a838469956d6be7568c6bd4ea473f5b9e4cf8602d8c9ca2` |

## Files attributable to A6

Runtime: server `services/installedAuthoredAbilities.js`, `services/spellPayments.js`,
`handlers/actorConsequenceHandlers.js`; client `services/authoredAbility.js`, `spellConsequence.js`,
`spellConsequenceService.js`, `acceptedResultFeed.js`, `components/hud/SpellConsequencePanel.jsx`,
`components/creature-wizard/components/common/CreatureAuthoredAbility.jsx`, `public/data/rules.json`.
Checks: new `server/tests/p14a6CreatureSelf.production.test.js`, new client
`services/__tests__/creatureSelfHealing.test.js`, extended `creatureAuthoredRecovery.test.js`.
Witnesses: new `creature-self-app-browser.cjs`, `record-creature-self-evidence.cjs`; optional restriction
in existing `creature-execution-app-browser.cjs` author helper. Docs: A6 contract/this record, next
condition recommendation, engineering/priorities/coordination/roadmap. Other source changes belong to
concurrent owners. Bulky builds/logs/screenshots/review stay external.

## Environment limits and next capability

App4 records **four unattributed Failed to fetch errors** (GM3/observer1), not clean-console or provider
health evidence. Provider authentication, canonical ownership, lease/cloud are fixtures. Initial HP/
bounds and condition commands are disposable fixtures; placement uses the real store producer, not a
drag/drop gesture proof. Checkpoint/restart proof is server reconstruction/epoch evidence, not a real
cloud restart/OS crash. No deployment readiness, human table, physical tablet or second-device claim.

Next smallest reusable profile: [Wizard-authored single Stunned condition, explicit GM-resolved/manual
timing](MYTHRILL_PROJECT_14_AUTHORED_CONDITION_RECOMMENDATION.md). Recommendation only; not implemented.
No all-creature-abilities, ancestry execution, regeneration or all-P14 completion claim.
