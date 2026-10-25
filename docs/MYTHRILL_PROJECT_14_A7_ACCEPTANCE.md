# P14-A7 — Wizard-authored canonical Stunned implementation

2026-10-23. [Frozen contract](MYTHRILL_PROJECT_14_A7_CONTRACT.md).
**Implemented; same-review repaired bounded independent ACCEPT; optimized Build4/App4 PASS (qualified).**
Prior A1–A6/C1–C4 acceptance is reused, not re-audited. Acceptance binds the reviewed working bytes below.

## GM walkthrough

1. Spellbook → Spell Wizard. Author an **ACTION**, explicitly **Immediate**. Effects → **Control** →
   **Use canonical Stunned profile (replace control configuration)**. Enter source-authored duration and
   required GM adjudication note. Select single target, one restriction, positive authored range and
   fixed whole-number AP/mana prices, including zero. **Complete Spell** saves the whole record.
2. Tools → Library → Bestiary → Create/Edit Creature → Abilities. Select the saved definition in
   **Compatible Spell Library definition**. The same shared fields inspect/edit it; unchanged Keep
   preserves the exact whole record. **Keep ability on creature**, save, then place that saved creature.
3. Placed token → Token Actions → Inspect → Abilities & Spells. Bind if needed, refresh room admission,
   **Admit for this creature**, **Use for this creature**. Exact source incarnation/whole association,
   current authenticated GM and immutable definition/version/hash supply authority.
4. Choose one distinct exact placed creature on the same map. Resolve eligibility, range, saves and
   success manually. Enter an explicit GM timing note; optionally retain private manual resolution
   evidence. Confirm **I resolved eligibility/range/saves and confirm that this Stunned outcome succeeded**.
   **Validate successful condition application** spends/applies nothing.
5. Review the retained success, timing and exact price. Confirm that review, then **Confirm payment and
   Stunned together**. One P7 admission installs payment, one canonical Stunned instance and receipt.
6. Use existing token/GM shared condition controls to inspect/remove that exact source-attributed
   instance. Separate accepted applications stay independent. All supported Stunned restrictions remain
   until the final active canonical instance is removed. No refresh/merge/stacking value is invented.
7. Close/reopen/reload retains evidence. For changed authority/target use explicit context refresh and
   reconfirm success; changed state uses explicit original-attempt revalidation. Lost ACK requires
   **Check same command**. Unknown/pruned outcomes block replacements. Rejoin never automatically submits;
   known historical recovery never replays narration/payment/application.

## Supported profile and authority

`controlConfig.authoredCondition` contains explicit `profile:authored-condition:v1`,
`conditionKey:stunned`, `expiryPolicy:gm-manual`, `durationText` and `gmNote`. The whole Wizard adapter
requires exactly one control effect, immediate ACTION, single/maxTargets1, any/ally/enemy restriction,
range1–300 and explicit AP0–20/mana0–10000. Names/icons/free text confer no mechanic. Mixed, periodic,
area, chained, save/trigger programs and unsupported active payloads remain whole/manual.

Companion compiler `p14-a7-condition-1` stores schema2 entries in the **same authoredSpellRegistry**;
legacy schema1 snapshots delegate to unchanged A1a, mixed snapshots validate both compiler versions,
full decision hashes/sequential versions/revocation and original capacity limits. `executionEnabled:false`
remains syntax metadata. No second registry, payment path or compiler-class authorization.
Condition-only versions are creature-only; normal PC admission and PC-target approval routes refuse.
Item/Creature associations preserve whole records; item association grants no condition execution.

## Atomicity, mechanics and duration

Existing spell attempt/preparation, command planner/custody and P7 binder/stage/writer are owners.
One strictly bound operation pair: source temp-first AP/mana finals (unchanged-AP CAS for free price),
target exactly one canonical C2 Stunned add. Instance UUID equals application attempt/result UUID;
source occurrence `authored-condition:<UUID>` and exact sourceActor preserve attribution. The immutable
P7 command has its own custody identity. Exact outcome, manual timing, evidence and admitted definition
bind the result. Any resource/bounds/revision/authority/admission/Stunned/writer/capacity refusal installs
neither payment nor condition and leaves the attempt unconsumed.

C2's strict canonical profile/predicate owns no-actions/no-reactions/voluntary-movement enforcement;
A7 copies no enforcement. Source eligibility rechecks after authority awaits and at P7 staging. Generic
add/update cannot fabricate authored execution provenance; exact accepted-instance GM corrections and
removals remain possible. Name-only legacy records are never promoted.

The record adds only optional authored manual-duration text to C2's constructor/validator and public
projection. **[Authored duration] — GM removes** is visible. Original duration metadata remains in the
immutable definition; ambiguous timing needs the explicit GM note. C3 named provenance and C4's Defending/
Shield Bash schedules remain separate. Saves/success/eligibility/range/card arithmetic, automatic STR/AGI
save-failure recording, the table's advantage procedure and expiry remain GM-managed. No fabricated
save roll, damage/healing number, HP float, universal timer, periodic effect or numerical stacking rule.

Preparing/cancelling spends nothing. Recording no application does **not** declare the tabletop attempt
free; unsuccessful attempts and their costs remain manual. Only successful application is automated.

## Recovery and privacy

Existing device spell attempt and shared immutable-command custody persist before emission. Manual
outcome/timing/evidence survive close/reload. Closed condition attempts and prior revalidation histories
are carried into the existing bounded64 attemptHistory before the next action replaces the latest;
full history refuses replacement instead of dropping evidence. The same command recovers its original
receipt even after condition removal. Old-epoch/pruned/unavailable outcomes cannot be recreated fresh.

Full private resolution remains in the authoritative stored receipt and GM device attempt; public receipt
projection removes manual-save evidence, private authored timing payloads and fingerprint hashes. Existing
visibility-aware feed narrates Stunned once; no HP/healing float. Historical recovery hydrates silently.
Temporary rooms are live-only; persistent accepted-live and actual checkpoint confirmation retain their
existing distinct meanings. No new cloud/device/offline durability promise.

## Repairs and one bounded review

Same reviewer `D:/AppData/Temp/opencode/p14a7-review1/REVIEW.md` independently found R1: finishing a condition
attempt could lose its non-roll evidence on the next action. Repaired using existing bounded attemptHistory;
reviewer independently reproduced repair, JSON reload, second launch and capacity refusal. Original finding
and probe are retained. Final reviewer disposition: **ACCEPT — bounded P14-A7 source feature; no open
correctness findings or evidence blockers**. Build4/App4 were implementer-executed and independently
appraised, not relaunched by the reviewer.

Actual App1 additionally found nested SpellLibraryProvider ownership split: Spellbook saved to a nested
provider while Creature read stale outer App state. Nested windows now share the existing parent provider;
standalone provider/reducer/storage remain unchanged. Focused nested-writer→outer-reader and existing
library/producer regressions pass; same reviewer inspected the actual ownership path. App2 found unchanged
compact Keep unnecessarily materialized equivalent price aliases; condition no-op Keep now returns an
exact detached whole snapshot. Reviewer independently probed JSON/serializedData/alias preservation and edits.

## Verification and source identity

- **Final implementer server group244 PASS:** A7 registered13, companion registry2, A6/A5/A4/A1,
  C2/C3/C4, affected P9 and unchanged A1a compiler vectors/history/limits. Log:
  `D:/AppData/Temp/opencode/p14a7-server-final.log`. Final client **12 suites/82 PASS**, including
  condition mapping/planner, old authored/spell helpers, recovery, canonical condition controller/feed,
  Item/Creature producers and nested library ownership; `p14a7-client-final.log`. Earlier groups overlap.
- **Reviewer-executed:**244 server cases; initial7 client suites59, then overlapping9/40 and4/14;
  R1 reproduction/repair/history-capacity probes, no-op whole-record probe,8 final validation checks,
  executable AST comparison and scoped lint. These are distinct from final implementer logs/build/App.
- **Lint:** scoped client runtime0 warnings/errors, server0 with incumbent `curly:off` override.
  Mechanical detector `[]`. Existing jsdom canvas/incomplete store and grimoire storage mock/act
  warnings remain in affected tests; no repository-wide clean-console/lint claim.
- **Final Build4:** exit0, unmodified production CRACO/config/dependencies in external frozen workspace,
  mirrorDrift `[]`, concurrentLiveDrift `[]`. Build inputs and output retained in `p14a7-build4/`.
- **Final App4:** `p14a7-app4/result.json` PASS, actual optimized normal App and registered backend.
  Authors **A7 Still Bell** (1 AP/3 mana) and **A7 Quiet Anchor** (0/0), both range30/Any, using actual
  Spell Wizard controls. Exact whole library snapshots selected/kept in Creature Wizard, saved/placed,
  reloaded while unbound, bound/admitted through placed Inspect and launched into the same panel.
  Generic Wizard validation now recognizes this explicit manual-duration profile (no false missing-
  duration error or invented global duration); the final saved records assert that correction.
- Paid source AP6→5/mana50→47 and one source-attributed canonical Stunned installation; free source
  pools unchanged and a second independent instance from a different source. No dice input, no HP
  operation/float. Prepared success/timing/private evidence survive close/reload without spending.
  Both instances appear by exact UUID in existing GM shared-condition controls. Target's actual
  supported authored action preparation refuses; authenticated delegated voluntary movement refuses.
  Removing one leaves restriction active, removing final restores movement and supported preparation.
  The last restored action is validated then explicitly cancelled, not silently applied.
- Lost GM ACK **and accepted broadcast**: unknown original command survives reload; exact same bytes
  recover original receipt with no additional payment/application. Observer chat/history is1; final
  narration checks show observer history1 and recovered GM history1/active0. Historical GM chat remains0,
  no HP float. Actual reconnect/rejoin emits4→4 consequences and keeps exactly1 room_joined listener.
  Observer projections contain no source drafts or private manual-save evidence. Viewport1440×1000
  and1024×768 ARIA/layout/screenshots retained; panel has no horizontal overflow and uses vertical scroll.
- App1 exposed the provider split; App2 stopped on the no-op Keep identity assertion; App3 passed the
  main flow but preceded the final generic-duration validation and stronger narration checks. Build1–3
  and App1–3 remain retained intermediate evidence, not substituted for final Build4/App4.

### Exact identity and qualifications

Entry/final branch `master`, HEAD `77c110db32f6a8b8f82a8982d5040540a644a43c`. Accepted identity is the
**reviewed working bytes**, not HEAD alone. Final gate `D:/AppData/Temp/opencode/p14a7-final-evidence.json`
SHA256 `6dbbbdb9e0b5f6ea12ba2cd68150bad5136d075e9070bc6bf537b71b6f1211a8` names62 runtime files,
seven protected identities, exact Build4/App4/witness hashes and client mismatch/drift lists. All62 match
App4 before/after/current; all scoped client runtime matches Build4. Seven protected A1a/W1/card files
match prior accepted hashes. At the final review, all11,380 recorded client inputs match both retained
mirror and current source. Scoped and recorded full-client drift are `[]` **at that measurement**.

Independent report `p14a7-review1/REVIEW.md` SHA256
`ceec3d92f4e794dd4fa7c7ade6c306f3e367947b8259e85b46bf5717c5bc2b92`;
independent final manifest `p14a7-review1/final-source-identities.json` SHA256
`e5d3f5bae1115a4d023fb59caf7ebc96b672fe482128a4a8d318f7540cb276b6`.
No reviewer application edits, build/browser relaunch or second reviewer. Bulky evidence/builds external.

Initial5 modified documentation files are preserved, including the A6 acceptance correction. Concurrent
Class/Heritage/UI work remains owned separately: Step1CoreDraft/Plaguebringer test, Plaguebringer resource/
progression/integration and RI-8 evidence edits appeared during this slice. Final build includes their
then-current inputs; **A7 acceptance does not accept Class semantics**. No commit/push/deploy/reset/
dependency upgrade/catalogue rewrite/class migration/ancestry change was performed.

**Environment limits:** six retained `Failed to fetch` errors in App4. Actual optimized App, browser
Socket.IO and registered handlers, but provider authentication, canonical ownership, authority lease and
cloud transport are fixture boundaries. App receipts are temporary-room/live-only. Persistent writer
refusal and trusted checkpoint/new-epoch recovery are focused server evidence, not real Firebase/rules,
cloud confirmation, staged deployment, cloud restart or physical second-device/tablet acceptance.
Outstanding human/provider/cloud/device/release gates remain open.

### Changed files / reusable witnesses

- Authority/definitions: `server/services/installedDefinitionRegistry.js` (new),
  `installedAuthoredAbilities.js`, `spellPayments.js`, `actorConsequences.js`,
  `server/handlers/actorConsequenceHandlers.js`.
- Shared client: `src/services/authoredCondition.js` (new), `authoredAbility.js`, `itemAuthoredAbility.js`,
  `sharedConditionProfile.js`, `sharedConditionService.js`, `spellConsequence.js`,
  `spellConsequenceService.js`, `acceptedResultFeed.js` under `vtt-react/`.
- UI: shared `AuthoredConditionFields.jsx` (new), `Step3Effects.jsx`, `AuthoredAdmission.jsx`,
  `spellWizardContext.js`, `SpellLibraryContext.js`, `CreatureAuthoredAbility.jsx`,
  `ItemAbilityEditor.jsx`, `SpellConsequencePanel.jsx`; help `vtt-react/public/data/rules.json`.
- Tests: new server `p14a7AuthoredCondition.production.test.js`, `installedConditionRegistry.test.js`,
  client `authoredCondition.test.js`, `SharedSpellLibrary.test.jsx`; extended
  `creatureAuthoredRecovery.test.js`. Reusable witnesses:
  `verification/p14/authored-condition-app-browser.cjs`, `record-authored-condition-evidence.cjs`.
- Contract/this record plus engineering ledger, priorities, shared coordination, roadmap and recommendation
  delivery pointer. Concurrent files listed above are not A7-authored changes.

## Next bounded capability comparison — recommendation only

| Follow-on | Reuse | Additional decisions/dependencies | Relative scope |
|---|---|---|---|
| PC-source → creature Stunned, then separately PC targets | Same explicit condition profile, existing P9 exact source-owner price/outcome approval, P7 condition binder/custody/C2 | Freeze PC eligibility/admission binding and retain owner consent. A PC target needs separately explicit target consent; A5 healing acceptance is not blanket condition consent. | Smallest useful next slice if limited first to exact owner PC → distinct creature. |
| One structured numeric buff/debuff with an existing authoritative consumer | Existing condition spine and a selected DR/blocking/stat consumer | First choose the consumer and freeze its canonical modifier, authored values, bounds, suppression and stacking rules; authoring vocabulary alone supplies none. | More rule work; no magnitude/stacking is invented by A7. |
| General authenticated duration/expiry | C4 authenticated boundaries, exact instance identity, P7 atomic removals | Source vs target occurrence, ambiguous units, start/end semantics, adoption/restart, independent schedules and capacity policy need a general contract. | Broadest; C4's named schedules are insufficient authority. |

**Recommend next:** one exact owner PC source → distinct placed creature using this same Stunned profile,
explicit existing owner approval and manual timing. Compare/freeze PC-target consent separately. This
adds a reusable route with settled C2 mechanics before introducing new numeric or timing rules.
