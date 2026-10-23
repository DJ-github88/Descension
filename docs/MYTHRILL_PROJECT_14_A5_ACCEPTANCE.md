# P14-A5 — admitted creature → exact primary PC

2026-10-23 · **Implemented; bounded independent ACCEPT (qualified); Build5/App6 PASS.**
[Frozen contract](MYTHRILL_PROJECT_14_A5_CONTRACT.md). Historical P7–A4 acceptance carries forward.

**No remaining concrete blocker established in the single bounded review.** Final reviewer report:
`D:/AppData/Temp/opencode/p14a5-review1/FINAL_ACCEPTANCE.md`. The reviewer independently measured
runtime/build/App identities and appraised implementer-generated runs; it executed no target code.

## Working behavior and exact walkthrough

1. **GM author/place:** Tools → Library → Bestiary → Create/Edit Creature → Abilities. Keep one
   compatible immediate direct damage OR healing ability with explicit AP/mana prices and bounded
   formula. Save/reopen normally, then place this disposable or saved creature.
2. **GM authority:** placed token → Token Actions → Inspect → Abilities & Spells. Bind if needed,
   refresh room admission, **Admit for this creature**, **Use for this creature**. The exact current GM,
   source incarnation/association, admission and immutable version/hash supply authority—not library ID.
3. **GM target/roll:** choose one exact primary PC on the same map using the real chooser/map picker.
   Record physical faces or roll digitally once. Inspect source/target labels, formula, prices and
   authored range/restriction. Range-zero distinct targets and self-only records remain refused.
4. **GM proposal:** enter damage before equipment blocking OR proposed healing and an explicit
   targeting/applicability ruling. Damage's equipment applicability is a deliberate ruling, never an
   inference that every spell is blockable. **Offer exact proposal to PC owner** applies/spends nothing.
5. **Owner damage:** the existing Blocking and wear panel displays the exact offer, authored targeting,
   retained result, prices and ruling. Use the current declared favored piece/backups and record its
   physical/digital block face, or explicitly **Don't block — accept damage proposal**. Declaring pieces
   retains the existing own-turn/out-of-combat selection rules. Rejecting the proposal applies nothing.
6. **Owner healing:** **Accept this healing proposal** explicitly accepts the displayed amount. There
   is no equipment roll/wear and no timeout, proxy or automatic acceptance. This is this software
   workflow's authorization, not a universal tabletop healing-consent rule.
7. **GM final:** in the same block/consent adjudication column, review the recorded block and required
   manual rulings, confirm final HP damage/healing, then **Confirm and apply**. The default shown result
   is the accepted proposal after mechanically derived equipment reduction. A damage adjustment requires
   a reason; healing final must match the accepted proposal, with the HP cap applied authoritatively.
8. **Changed healing/material authority:** a changed healing amount is refused. Reopen the retained
   creature action → **Refresh admission or change target (keep faces)**. Positive closure precedes
   compatible current-admission refresh and a new validation identity; the original source faces and old
   attempt evidence remain. Send the revised proposal and obtain explicit owner acceptance again.

## Automatic versus GM-adjudicated

Automatic: exact authority/identity/version/revocation checks; canonical acting-source Stunned refusal;
temp-first AP/mana payment; temp-first damage; capped healing; current favored/available equipment;
armor natural1–2 versus shield natural1 wear; existing die ladder/breakage; canonical PC Defending2×
reduction/no wear; current revisions/bounds; one receipt/attempt consumption; existing private owner
reconciliation and add-before-clear/full-pack protection; privacy-aware once-only accepted feedback.

GM adjudicates hit, legality, range/restrictions, authored block applicability, nonphysical protection,
critical shields, flat DR/resistance/conversion and mitigation order. No Armor Class/rating calculation.
Stunned targets do not choose defense or accept healing automatically. No new condition duration/save/
advantage/ancestry behavior. No general complex/area/chain/reaction/periodic execution support.

## One atomic authoritative installation

The existing P12B attack DTO gains optional typed `authored` proof: exact A4 attempt/definition/source
authority, offered target revision, authored targeting and explicit block-applicability/ruling. Its
reserved command UUID equals the attempt UUID; immutable offer hash binds owner approval. A5 alone
admits `blocking:null, roll:null` for explicit no-equipment acceptance. Named authored IDs cannot shed
their proof and downgrade into the manual P12B route. A4's direct creature preparation remains
PC-target-refusing; it cannot bypass owner consent.

P7's existing two-actor shape already represents the combination; **no new P7 operation/writer**:
source AP/mana finals + PC HP/tempHP + optional existing `equipmentWear`, receipt and synchronous
approval/offer consumption. Refusal installs none. Zero prices stay zero; a free source uses existing
unchanged-AP CAS. Accepted final0 may pay its authored price; cancellation/unexecuted work creates no
fee. Authoritative wear/declaration revisions are atomic with HP/payment. Private sheet/pack adoption
still uses existing P12B custody/conflict recovery; it is not a second room transaction or cloud promise.

The existing authored formula bound of50 recorded faces is retained by the typed A5 attack; legacy
manual P12B stays at20. Original natural faces are never replaced by a GM reduction number.

## Staleness and recovery

- Current authority, exact source/target, association/version, Stunned, payable pools, HP bounds and
  equipment are checked after relevant awaits and at final P7 stage. Unknown results block replacements.
- Source revision changes retain P12B sibling AP proof or explicit source revalidation. Changed target
  revisions require exact from/to/reason `targetRevalidation`. Both may coexist. The GM explicitly
  confirms original evidence, never rerolls. Changed/unavailable equipment stays a ruling; faces cannot
  be re-read on another die. Defending added/removed/expired changes the current authoritative derivation.
- Existing spell attempt and `room.blockingLatest` custody retain faces/offer/approval/command before
  emission. Close/reopen/reload does not submit. Rejoin reads through the single production
  `room_joined` registration/roomRejoinBus; no additional persistent socket registration.
- Lost owner ACK checks the original approval. Lost consequence ACK/delivery checks the original
  immutable command. Known history refreshes state silently, without replayed chat/floating HP.
- A definitive pre-registration offer refusal can positively close the original same-epoch retained
  attack into the existing tombstone ledger. This grants no execution. Missing/pruned/old-epoch outcomes
  cannot silently renew provenance. Revoked/withdrawn/consumed identities cannot execute elsewhere.
- Temporary rooms are live-only. Persistent rooms retain existing writer/checkpoint/receipt/epoch rules;
  accepted-live is not checkpoint-confirmed. No new private durable server storage or offline replay queue.

## Verification actually executed

- Final registered production group: **79 PASS**, including **16 A5** plus A4 creature→creature,
  A1 owner-PC, P12B blocking/wear and C4 lifecycle regressions. Earlier72/78 groups overlap, not added.
- Final client group: **5 suites /47 PASS**: equipment planning, private blocking custody, creature
  retained recovery/material refresh, accepted feed and item break/full-pack path. Earlier43/45 and
  focused7 overlap. Fixture Demo Mode logs are retained.
- Client scoped ESLint0; server scoped ESLint0 with the existing no-brace style's `curly` rule disabled.
  Raw default server lint reported82 curly findings across these files, including incumbent A4 code;
  no claim that the repository/default lint is clean. Mechanical UI detector `[]`.
- One bounded independent reviewer identified R1 target revalidation, R2 pre-offer failure custody,
  R3 sibling-AP plus target revalidation, R4 never-registered positive closure; repaired in the same
  review. Additional compatible material refresh received source clearance. Independent target-code
  execution is **zero** because the reviewer's required execution sandbox controls are unavailable.
  Implementer tests/build/App are not represented as reviewer-launched runs.
- Preliminary App4/Build3 passed main GM/owner/observer flow, owner lost ACK/real rejoin1 listener,
  damage tempHP/wear/owner reconciliation, GM lost ACK+broadcast/reload/original command, Defending and
  pending removal with original face, explicit zero-price capped healing, foreign owner/secondary refusal,
  private pending state and narration1. That is not final parity: material-refresh code changed during it.
  Later material reapproval/readmission with unchanged digital faces is exercised before final identity.

### Final optimized identity and real production-App result

**Build5 exit0 / App6 PASS.** Actual GM, owner and observer normal App clients exercised author/save/
reopen/place/admit; exact primary-PC chooser; retained physical source face4/1d6+2; explicit arcane
block-applicability ruling; owner natural armor face2/d8; GM final4. Creature AP6→5 and mana50→47,
PC tempHP3→0 and HP20→19, armor d8→d6 install once. Owner private sheet reaches d6. Lost owner ACK
checks the same approval after real rejoin (one persistent room_joined listener/original exact actor).
Lost GM ACK+delivery → reload → identical original command returns the original receipt, no second
cost/HP/wear. Observer float is exactly `−1 HP` plus `3 absorbed`; narration/log count is1.

Canonical Defending then yields original face2→4/no wear on currentd6; its registered removal while a
later block is pending demands explicit target revalidation, retains face2 and yields reduction2/d6→d4.
Healing uses a separately authored zero-AP/zero-mana creature and retained digital1d8+1. Owner explicitly
accepts100; GM attempt to change final99 refuses without state change. Actual source readmission then
positive old-offer closure/current-grant refresh/new attempt and proposal99 retain the identical digital
faces; a new exact-owner acceptance precedes capped HP40 and no equipment entry. Wrong owner/account
and secondary token requests refuse with full room state unchanged. Pending offers stay private.

Panel/Close fit and no horizontal internal overflow pass at1440 and1024. Final captures were inspected;
the known collector notice remains visible. No claim of a universally unobstructed HUD or physical tablet.

- **53/53 runtime hashes** match App6 before/after/current. Scoped build client mismatches`[]`.
- Seven A1a/W1/card protected identities match. Build5 mirrorDrift`[]`, concurrentLiveDrift`[]`.
- Reviewer independently measured all **11,351 recorded client-manifest entries** against current bytes:
  drift`[]`. This includes current concurrent Class inputs, without semantic acceptance of that work or
  an independent census of unlisted newly added files. This is stronger recorded-file parity than A4's
  excluded later Class drift; it does not retroactively change A4 evidence.
- Final branch/HEAD remains `master/14b21cfec10df7c5c198e1df13cccb79fbdd8c41`; acceptance binds the
  uncommitted byte identities. Earlier Build1–4/App attempts are retained externally: fixture export/
  chat-field assertion corrections, runtime iteration and pre-fix tablet clipping are not erased.
- App6 retains **four unattributed `Failed to fetch` page errors** (GM, owner, observer, GM). Passing
  focused checks are not clean-console/provider-health evidence. Earlier App4/source drift is superseded
  only for final parity by the final App6 identity.

| External artifact under `D:/AppData/Temp/opencode/` | SHA256 |
|---|---|
| `p14a5-final-evidence.json` | `269f83e2922d87b347d0df3a3cdd9165a1213208bf4db5d2f9128cba097ed093` |
| `p14a5-build5/build.json` | `2e1aec29d30f6febb3fee830ada79a612580741b85da27a00b88213af1115c9e` |
| Build5 `build/asset-manifest.json` | `365a08e5c28162b9da37c753b1dd3d050db52b6e6214137b73225c88b67bcae2` |
| `p14a5-app6/result.json` | `b20caf5ecf55feb97bc0b9e3d4d13a14236ef50e92a50d425e385ee284338f03` |

Reviewer-owned static SHA256/JSON/Git checks confirmed these artifacts, all53 runtime files, protected7,
  scoped client inputs and recorded full-client parity. **Zero independent test/probe/build/browser runs**;
the actual79-server/47-client/Build5/App6 executions remain implementer-attributed. Source semantics were
reviewed only in the bounded A5 delta, not all53 manifest dependencies or the concurrent Class work.

### Late concurrent drift — recorded after final acceptance

At **2026-10-23T07:18:56.042Z**, unrelated map/drawing/touch UI work appeared after the final gate and
reviewer's original static appraisal. **53 A5 runtime files and protected7 remain byte-identical**.
The recorded full-client comparison now differs in these **nine** Build5 inputs:

- `src/components/level-editor/editorTools.js`, `ProfessionalVTTEditor.jsx`, `useEditorKeyboard.js`,
  `VTTDrawingEngine.jsx`, `__tests__/DrawingTools.test.jsx`;
- `src/components/level-editor/tools/DrawingTools.jsx` and `tools/styles/DrawingTools.css`;
- `src/store/levelEditorStore.js`, `src/utils/strokeRenderer.js`.

Additional unlisted map/touch helper/components/tests appear in Git status, outside the recorded build
manifest census. They are preserved, neither overwritten nor attributed to A5. **Current-tree full-build
parity is no longer claimed.** Build5/App6 and the bounded A5 source acceptance still identify the exact
accepted bytes; earlier no-drift statements above describe their measurement time, not this later tree.

External snapshot `p14a5-handoff-drift.json` SHA256
`6f23010f68b9d68a29aac8c306e10bdda1814cb962c426ca0fd1b3160ab33d34`; original gate is unchanged.
The same reviewer independently rechecked the nine paths/before-current hashes, unchanged53/protected7/
gate/build/App artifacts and added `p14a5-review1/ADDENDUM.md`. No renewed audit/runtime execution/build.

## UI and environment limits

The known disconnected-collector notice remains visible near the upper centre and overlaps upper HUD
space at1024px. It did not obstruct the exercised owner/GM A5 controls. No unrelated collector/Inventory
cleanup was attempted. A directly relevant one-line blocking-panel width fix prevents the panel/Close
control being clipped by its existing tablet-width parent column; final layout assertions cover both.

Production App/router/components/CSS, real browser Socket.IO and registered backend handlers execute.
Provider login/canonical ownership documents/lease/cloud remain fixture boundaries. Disposable creatures
are authored/saved/placed through real controls/stores; secondary and initial tempHP are explicit fixtures.
No live Firebase/rules, cloud restart, OS crash, second physical device, human-table or deployment proof.
Source checkpoint/epoch behavior is focused production-stack evidence and accepted foundation reuse.
Four `Failed to fetch` page errors occurred in preliminary App4; final run errors are recorded separately.
Viewport/keyboard-accessible controls are not comprehensive physical-tablet/accessibility certification.

## Source identity, files and handoff

Entry `master/14b21cfec10df7c5c198e1df13cccb79fbdd8c41`, including uncommitted A4 fixes/evidence and
concurrent Class/Heritage/UI work. This agent made no commit/push/reset/deploy/dependency/migration change.
Later Class RulesPage/ClassDetailDisplay/talent-tree/class-icon/RI-3 work is preserved and separately owned.
Unlike A4 Build4, the final A5 snapshot includes current lichborneData/classResourceContracts/classResources
bytes; final exact hash/drift checks identify what actually compiled, not historical assumptions.

A5 runtime edits only: server `blockApprovals`, `installedAuthoredAbilities`, `spellPayments`,
`actorConsequences`, `actorConsequenceHandlers`; client `blockingService`, `equipmentBlocking`,
`spellConsequenceService`, `acceptedResultFeed`, `BlockingPanel.jsx/.css`, `SpellConsequencePanel.jsx`,
and `public/data/rules.json`. Tests: new `p14a5CreaturePc.production.test.js`, extended
`equipmentBlocking.test.js` and `creatureAuthoredRecovery.test.js`. Witnesses: new
`creature-pc-app-browser.cjs`/`record-creature-pc-evidence.cjs`, narrow shared-helper export/target-label
update to the existing A4 witness. Docs: contract/this record, historical A5 prep, engineering/priorities/
coordination/roadmap. Other dirty files are concurrent/pre-existing work, not attributed to A5.

Bulk builds/screenshots/logs/review are external under `D:/AppData/Temp/opencode/p14a5-*`.
Recommended next smallest reusable capability: exact admitted creature **self-healing**, separately
frozen, reusing one-actor source payment+HP without adding a combat/resource/condition subsystem.
