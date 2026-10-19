# RI-1 — Chaos Weaver: repair reusable C1 work and integrate the established class system

**Directly executable DeepSeek assignment, 2026-10-18.** Latest creator direction replaces per-class workshop delivery. This is the first bounded integration cohort, not a generic infrastructure phase. Application implementation is assigned to DeepSeek; the preparation/re-review session made no application changes.

## Outcome

Chaos Weaver exists as a distinct **development** class in the ordinary class catalogue/detail, creation, learning/progression, talent trees, spell library/cards and resource HUD. Preserve the complete authored C1 library and six-tile SVG. All effects whose current engine support is absent remain explicitly manual/disabled; no new combat execution is claimed. Existing Gambit and all legacy characters keep their IDs/data/resources.

Inputs (read before editing):

- `CLASS-C1-CHAOS-WEAVER.md`, its correction report and `evidence/CLASS-C1-chaos-weaver/independent-rereview/review.md` (**BLOCK B1–B7**, not accepted C1).
- `../34_ROSTER_INTEGRATION_COHORTS.md`, `../02A_CLASS_LIFECYCLE_AND_SOURCE_MAP.md`, `../29_PRIORITY_REVIEW_RULES_AND_SERIALIZATION.md`, `../28_HERITAGE_REVIEW_AND_PRIORITY_ORIGINS.md`, `../evidence/headq-priority-compatibility.json`.
- Actual templates `data/classes/arcanoneerData.js`, `data/classes/minstrelData.js`; talent rank shapes `data/talentTrees/minstrel.js`, `data/talentTrees/talentSystem.mjs`; actual detail, starter, level-up, talent and resource consumers listed below. Reuse shapes/consumers; preserve C1 rules where templates differ.

## Keep and correct

- **97 unique authored identities:**40 optional (four at every level1–10,≥2 nondamage),3 core,6 talent actives,48 passive rank records;54 nodes/18 per tree/50 capacity each, global50/5×level. No duplicated `cw1_07`: retain `cr1_chaos_weaver_read_instability`. Preserve all existing C1 IDs, tuples, AP/mana0, prices, outcomes, target roles and expiries. Source module IDs and materialized talent IDs must be explicitly linked, never guessed from similar names.
- Six IDs S1/S2/M1/M2/F1/F2, immutable symbols and four zones; one pending/one Anomaly; fixed sorted physical mapping, all primary spent; paid recovery, retained Fracture and one optional reserved continuation; completed-long-rest-only reset; no generated tile or postcommit reroll.
- Repair **B1** completed legal picks and level/respec eligibility; **B2** import of legal recovered/rested histories; **B3** strict pending price/continuation/owner checks; **B4** no Anomaly void redraw; **B5** deterministic downside and primary confirmation when declining; **B6** whole integer parsing; **B7** mounted contrast. Fix reusable domain logic and its reachable integrated controls. Do not build another workshop, extend its infrastructure or use it as the acceptance route.
- Preserve old workshop source/evidence as a reference and regression harness during integration. Remove its prominent catalogue entry in favor of the normal class-detail entry; normal details may link to retained reference material if useful. No requirement to expand or re-certify a retired preview surface. Keep original C1 BLOCK/evidence historically accurate.

## Smallest adapter, using existing data owners

1. Export an ordinary `CHAOS_WEAVER_DATA` shaped for existing class consumers. Prefer a small `data/classes/chaosWeaverIntegration.js` projection of the existing C1 constants, re-exported/registered without circular imports. The adapter supplies `id`, `name`, `overview`, descriptions, attributes/equipment, specializations, resourceSystem, full `spells`, `spellPools`, progression, native variants, `developmentStatus:'development'` and per-record authored/manual support labels. It must not duplicate97 separately maintained definitions. Keep C1's closed packet untouched by presentation-only defaults.
2. Project each record into the **full existing spell schema** required by actual cards/library: description, ACTION/PASSIVE, effectTypes, resourceCost, targetingConfig, applicable damage/buff/utility/duration/cooldown fields, class/source/tree/category IDs, and exact class-specific metadata using the existing special-mechanics slot. Retain the authoritative typed C1 tile/branch/continuation/downside record and source ID/version. No arbitrary JS/program executor. For sampled spells do not flatten a favored branch into an unconditional damageConfig; show all branches and denominator/price in the actual card. Preserve0/null explicitly. Reuse actual UnifiedSpellCard; add only the minimal class-detail presentation needed for fields its generic view cannot express. Do not edit main Wizard schema/load/save/export to disguise unsupported data as executable.
3. `ALL_CLASSES_DATA`, display entries, spell map/categories, talent map and resource guide/config all resolve **Chaos Weaver** under its independent ID. Existing callback/detail navigation is the entry seam. Normal development selection can create a **new** character via normal provenance/qualification controls; status is visible before selection. Never select a new class by silently converting an existing Gambit save.
4. Use existing creation/level-up learning. C1 core3 are granted separately; optional exactly1/level, chosen explicitly from current-or-earlier unchosen legal pool. Signature/capstone/passive acquisition requires paid ranks; no automatic3-spell random startup or load-time top-up for this class. Add an explicit class progression policy to the data and honor it in the existing starter/progression/level-up consumers; leave other classes' defaults intact. No rival store or picker framework.
5. Reuse TalentTreeContent. Adapt C1 nodes to existing full `spell` + `rankUpgrades` shape; max-rank absolute values and full predecessor AND gates unchanged. Honor explicit `requiresPoints`/minimum level for these nodes, independent of decorative row; preserve existing seven-tier behavior for nodes without explicit C1 policy. Support nine C1 rows through the existing board sizing/layout. Add canonical owned-spell identity support for these nodes with legacy `talent-spell-${id}` default unchanged; signature/grant source identity must resolve when acquired and disappear when legitimately removed. Avoid generating a second passive record for the same paid rank. Review-mode Codex trees remain read-only and make no library writes.
6. Reuse `ChaosWeaverResourceDisplay` from ClassResourceBar for the new class, both normal detail showcase and actual character HUD. Keep prop-driven state, labels and external44px inspection/control targets. Do not route this class into old Mayhem or generic numeric resource adjustments. Initial **personal class record is uninitialized**, not six usable tiles silently refilled; explicit manual completed-rest/setup is required. Any new manual class-resource edit validates the complete candidate state before using existing owner callbacks. Inspect existing personal save/load with nonempty zones; if the standard codec preserves it, do not alter the codec. Room-shared state/control remains read-only/manual-disabled where HeadQ has not admitted this domain. Do not copy the rehearsal session into room authority or use local UI state as authoritative resource truth.
7. Register C1's existing proposed Alchemite `drall_fexric` provenance/variant with explicit development/proposed labels: anomaly_encounter, containment_training, stabilizing_interface; broken stabilizer blocks active procedure. Native training and rare acquired qualification are positive requirements, not race/personality hardBlocks. Prepared Exchange remains once/rest, actual part required, different symbols, real spent/available IDs and5ft downside. Do not claim inventory or heritage edge autoexecutes; preserve manual paired cost in metadata/guide. Central registry remains the access owner.
8. Add data-only explicit compatibility mappings per34. Existing Gambit/legacy Mayhem/old Chaos Weaver historical payloads are preserved, not reinterpreted as C1 tiles. Store literal source IDs and `automaticConversion:false`; migration requires future explicit user choice and field-level mapping. No migration script in RI-1.

## Exact writable paths

All application paths relative to `vtt-react/src/`. Edit only when required by the above outcomes; capture current bytes and reconcile dirty overlaps before editing.

**Existing C1 reuse/correction:**

- `data/classes/chaosWeaverData.js`
- `data/classes/chaosWeaverRules.js`
- `data/talentTrees/chaosWeaver.js`
- `components/hud/ChaosWeaverResourceDisplay.jsx`
- `data/classes/__tests__/chaosWeaverPackage.test.js`
- `data/classes/__tests__/chaosWeaverRules.test.js`
- `components/hud/__tests__/ChaosWeaverResourceDisplay.test.jsx`

**New small projections/guide/mapping and integration tests:**

- `data/classes/chaosWeaverIntegration.js`
- `data/classes/classReconstructionCompatibility.js`
- `data/resourceSystems/chaosWeaverResourceGuide.js`
- `data/classes/__tests__/chaosWeaverIntegration.test.js`
- `components/hud/__tests__/ChaosWeaverClassResourceIntegration.test.jsx`
- `store/characterSlices/__tests__/chaosWeaverProgression.test.js`

**Existing integration seams:**

- `data/classes/index.js`
- `data/classes/classDisplayData.js`
- `data/classSpellGenerator.js`
- `data/classSpellCategories.js`
- `data/talentTreeData.js`
- `data/classResources.js`
- `data/classResourceContracts.js`
- `data/resourceSystems/index.js`
- `data/classHeritageRegistry.js`
- `components/rules/ClassesDisplay.jsx`
- `components/rules/ClassDetailDisplay.jsx`
- `components/rules/ClassDetailDisplay.css`
- `components/rules/__tests__/ClassesDisplay.test.jsx`
- `components/rules/__tests__/ClassDetailDisplaySpells.test.jsx`
- `components/hud/ClassResourceBar.jsx`
- `components/talent-tree/TalentTreeContent.jsx`
- `components/talent-tree/TalentTreeContent.css`
- `components/talent-tree/__tests__/TalentTreeContent.test.jsx`
- `components/character-creation-wizard/steps/Step1CoreDraft.jsx`
- `components/character-creation-wizard/steps/Step9CharacterSummary.jsx`
- `components/modals/LevelUpChoiceModal.jsx`
- `store/characterSlices/infoSlice.js`
- `store/characterSlices/progressionSlice.js`

Tests/evidence outside application: only `docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-1-chaos-weaver-integration/` (create). Original C1 evidence/probes are read-only. Existing workshop JSX/CSS/tests are retained read-only; do not spend this cohort redesigning them. Any indispensable additional seam must be identified with a concrete blocker and bounded amendment before editing; do not broaden into all stores or Wizard.

**Read-only controls:** all legacy class definitions/spells/trees/resources/variants; every `server/` path; `PartyHUD.jsx`; `store/characterSlices/coreSlice.js`; `store/characterSlices/resourceSlice.js`; `store/characterHelpers.js`; personal/room persistence codecs; W1/A1a fixtures/evidence; main Wizard schema/reducer/load/save/targeting/export files; P9/P12/P13/cast producers/manual gate; global CSS/assets/canonical lore/Laws. Current concurrent server/frontend work is not part of RI-1.

## Acceptance — meaningful actual-system checks

1. Manifest remains97/54; all49 active prices and all rank values/source IDs resolve in actual adapter/card/library output. No random or time-derived IDs; no dropped typed branch/price or0 values. Four options each level, legal earlier unchosen options, optional07 stable identity and no duplicates.
2. Positive **and** negative legal builds: level1 one optional succeeds; full-tree point50 capstone succeeds at10; gate5 cannot borrow another tree; unpaid signature/core/passive cannot be optional; lower level/respec removes eligibility/grants; max-rank absolutes/max-not-sum modifiers and capstone-only extensions hold. Verify normal editor/learning/store paths, not just pure helpers.
3. New development character: select Chaos Weaver through normal class/acquisition UI; core grants present, choose exactly one optional at level1. Level2 adds one legal optional; reopen library/load/ensure-starter produces **no extra optional/talent grant/refill**. Existing Berserker/Arcanoneer controls retain original behavior. Read-only Codex inspection produces no spellbook/library writes.
4. Normal class detail has overview, full spell cards/pools, full three trees, progression, resource guide/SVG and provenance/variants; no workshop required. Actual1280px/360px route checks, keyboard entry/back and inspector Escape/focus return,44px controls, measured contrast. No inherited low-contrast header or clipping.
5. Six-tile invalid operations atomically refuse; three formerly rejected exact legal prices work. Normal data/HUD projections retain pending face/outcome/continuation and bound ownership; no partial paid state. No redraw after Anomaly void. Rest/once-use/decline and deterministic Fracture have explicit retained downside/confirmation in any reachable manual flow. Incomplete automatic engine support is labeled and applies no AP/HP/movement/resource/cooldown.
6. Run all three existing C1 manual sequences on reusable pure rules with explicit faces/confirmations; verify relevant integrated cards/controls reflect their results. Anomaly sequence must include trigger face, M/F retained branch, settle, rebind, avoid, paid dismissal/Fold. Use Bias face5/6 for F1; face3 correctly selects S2. These are tabletop witnesses, not automated combat/balance tests.
7. Canonical packet round-trip before/after commit/face/continuation/settle/**Fold/rest**; unknown fields, forged price/mapping/continuation, orphan zones and changed branches remain exact rejected drafts, not sanitized certified records. Ordinary personal character snapshot round-trip preserves the new typed state and known/ranked IDs. Capture actual codec fixture; no multiplayer durability assertion.
8. Load/save unchanged legacy Gambit, Augur (including Nereid alias), Harbinger, Revenant, Shaper and Apex fixtures: same class key/IDs, known spells, talents, acquisition and classResource. Compatibility mapping does not call the class-change initializer. Other current classes still select normally. No unsupported C1 cast falls through to a generic local effect/payment path; if an existing route cannot safely suppress it without protected engine changes, expose it read-only/manual-disabled and report exact Main HeadQ seam.

Run targeted Jest for changed consumers and new controls; retain original five C1 suites as baseline controls, explicitly report any old workshop expectation invalidated by corrected domain rules rather than silently weakening assertions. Run retained original independent probes unchanged and supplementary probes; account for justified face/confirmation sequencing changes separately. Scoped ESLint JS/JSX only, diff check, source hashes on writable and protected controls. Use detached builds only if needed; no raw foreground webpack build. No broad combat/balance suite merely because class content changed.

## Required return

Changed-file list and entry/current hashes; full actual registered class/spell/talent/progression/native manifests; exact legacy compatibility mappings; test/browser evidence on normal routes; remaining unsupported capabilities named for Main HeadQ; remaining reproducible content/integration failures. Distinguish authored, selectable development, manually usable and automatically admitted. No commit/push/deploy unless separately requested.

## Copy-ready DeepSeek prompt

> Implement **RI-1 Chaos Weaver repair + established-system integration** exactly as specified in `docs/plans/mythrill-class-reconstruction/implementation/RI-1-CHAOS-WEAVER-INTEGRATION.md` and the creator strategy in `34_ROSTER_INTEGRATION_COHORTS.md`.
>
> Start from the current working tree, preserve concurrent work and capture entry hashes. Read original C1 plus its independent corrected-source BLOCK B1–B7. Reuse all useful97-record/54-node content, pure rules and six-tile SVG; repair reusable import/atomicity/build/lifecycle defects. Register a distinct development Chaos Weaver in the **existing** catalogue/detail/creation/spell-pool/progression/talent/library/HUD/heritage system, using current well-formed classes as shape references. Implement the complete class, not examples or an isolated preview. Keep C1 identity/rules/tuning while adapting explicit gates and one-pick progression to the existing consumers. Remove the prominent workshop entry as the delivery path; build no further workshop framework.
>
> Respect the exact writable/read-only paths and acceptance checks in RI-1. Preserve legacy Gambit and every other saved identity through explicit data-only successor mappings, with no automatic conversion or resource refill. New class-specific unsupported effects stay visibly manual/disabled and apply nothing automatically; shared engine work belongs to Main Mythrill HeadQ. Do not edit server/P9/P12/P13, main Wizard targeting/export contracts, original probes/evidence, canonical lore or global CSS. If a protected seam blocks only an affected control, disable that control, document the exact dependency and finish unrelated complete class content/integration.
>
> Verify positive legal builds as well as refusals; exact imports after recovery/rest; immutable face through void; all three specialization sequences including Anomaly; actual normal-route cards/learning/rank/HUD and narrow keyboard/touch/contrast; legacy saved fixtures. Return source hashes, full manifests/mappings, meaningful test/browser evidence and precise capability boundaries. Do not call this live automated combat or claim C1's historical BLOCK was accepted. No commits/pushes/deploys.
