# P12C-B2 — action-bound area preview (conditional contract draft)

2026-10-18 · **§8.1 first slice FROZEN and authorized for implementation by the creator.** G1 origin/
centre range, G3 positive overlap of any known occupied grid cell (once per creature), G3a no edge/
corner-only inclusion, and G5 free-point placement are approved. All wider profiles and §14 enforcement
remain conditional/unimplemented. Implementation/verification status is recorded in ENGINEERING_STATE.
Creator answers live in the existing
[decision packet](MYTHRILL_DECISIONS_AREA_AND_REACTIONS_BATCH1.md); ownership in
[cross-track coordination](MYTHRILL_CROSS_TRACK_COORDINATION.md). This expands the B2 sketch in
[next slices §3.5](MYTHRILL_NEXT_SLICES_CONTRACT_20261017.md), without changing accepted B1.

**§8.1 delivered:** implemented, same bounded independent source review accepted after repairs,
final production build3/App7 PASS. [§15](#15-first-slice-implementation-and-verification--2026-10-18)
records exact evidence and remaining limits. The rest of this document remains conditional preparation.

**Creator acceptance recorded, 2026-10-19:** completed §8.1 acceptance is carried forward unchanged.
No Radiant Burst widening, code changes or repeated tests/build/browser verification in the P13B
preparation task. The accepted source/build identities and all §15 manual/live limits remain in force.

**Creator addition, 2026-10-18:** complete targeting/propagation inventory is in
[§9](#9-targeting-and-propagation-coverage-matrix); per-mode open semantics §10, save-path findings §11,
representative flows §12 and the bounded sequence §13. This addition does not expand B2 into execution.

**Main HQ authorization update, 2026-10-18:** creator approved G1/G3/G3a/G5 and explicitly authorized
freezing/implementing [§8.1](#81-first-freeze-candidate-one-original-ranged-circle) only. Earlier
preparation/no-approval statements below are historical or apply to the wider contract. Recipient
conflict, walls and elevation remain visibly GM-adjudicated. P13B and §14 spatial enforcement are not
authorized. Preserve authored data and Class HeadQ's Wizard preservation ownership.

## 1. Deliverable and hard boundary

Choose an authored action → **Preview area** → position/orient its authored geometry → inspect only
visible candidates → **Keep preview** or cancel. This is a local, action-labelled measuring aid.

- No roll, payment, reservation, cooldown, proposal, approval, consequence, condition or automatic damage.
- A candidate highlight means geometric overlap under the displayed policy, never affected, hit or legal.
- Keeping the preview is not casting or accepting targets. It does not post chat, history or announcements
  to the room. The existing manual-notice action remains a separate deliberate action.
- No area transaction is created. P7 still permits source plus at most one target; a sequence of its
  commands is not one atomic area consequence. Execution remains P14/follow-on work.
- No mutation of authored records, Wizard defaults, template sources, class resources or retained rolls.

## 2. Actual checkout and evidence boundary

Inspection baseline: `D:/VTT`, HEAD **`8ba81efbf935e08d4fcd488a9b597f5eb8031b0f`**, 2026-10-18.
The working tree already contained the combat slices and closure, corrected A1a, class-local Chaos Weaver
work and unrelated source/data/assets. HEAD alone is not their accepted identity.

Relevant pre-existing changes: modified `targetingStore.js`, `Grid.jsx`, action bars/confirmation,
P12 panels/services, tokens, narration/feed integration and block server files; untracked `targetPick.js`,
`TargetPickOverlay.*`, `roomRejoinBus.js`, the integrated slice report, coordination/decision drafts and
class C1 files. Existing dirty planning files included the ledger, roadmap, next-slices and P12 contract.
Staged race-image deletions and unrelated item/race/crafting/wizard/class work are concurrent work.
This takeover changes planning documents only; none of those application changes is re-attributed here.
An unrelated untracked `vtt-react/public/test-artifacts/` also appeared during preparation; it was not
generated, inspected as acceptance evidence, removed or staged by this takeover.

Retained acceptance is reused from [P12A](MYTHRILL_PROJECT_12A_IMPLEMENTATION.md),
[P12B](MYTHRILL_PROJECT_12B_IMPLEMENTATION.md) and the
[slice closure report](MYTHRILL_SLICES_20261017_IMPLEMENTATION.md), especially its evening correction:
production `registerRoomJoinedListener`, exactly one listener, corrected P12A 11 checks, repeated rejoins,
slices/P12B/recovery/P9 witnesses, 88 client suites / 567 tests and successful rebuild. Those checks were
not rerun for document preparation. Older P12B stale-offer and P12A pre-P12B statements are historical;
the later r1/closure report supplies current status. Live Firebase, deployment, physical second-device
and human-table gates stay open.

Protected prerequisites inspected: A1a service hash
`48b69255b8958ae75a7aa17ed7aa67c95b6d4c2bada63f4dcd24a305e20f0003`; W1a Step5/resources and W1b serializer
match the corrected hashes in coordination §3. A1a is immutable definition/planning infrastructure, not
a live registry or casting integration. Current class handoff33 parks A1b; this slice does not unpark it.

### Source findings that constrain reuse

All client paths below are under `vtt-react/src/`.

| Existing owner | Verified capability / limitation | B2 treatment |
|---|---|---|
| `store/targetingStore.js:296–323` | One transient B1 exact-ref pick session, excluded from persistence | Extend this interaction lifecycle; do not create another targeting authority |
| `services/targetPick.js`; `grid/TargetPickOverlay.jsx` | Exact refs; planar centre distance; world/screen transforms; player picks use P13A rendered registry; scope cancellation and consumed Esc | Reuse identities, coordinate conversion, advisory wording and cancellation |
| `store/spellAoEStore.js` | Nonpersistent tool, anchor, cursor and one retained placement; generic sizes/defaults; stays armed after commit | Reuse geometry/placement owner with an explicit action-preview mode; B2 is single-session and does not inherit defaults or rapid repeat |
| `grid/SpellAoEOverlay.jsx:113–177,192–216` | All-map-token centre membership; sight-polygon clipping; chat includes affected count/names | These are legacy tool behaviours, not Prism rules. B2 must bypass the chat/affected path and filter before membership |
| `utils/AoETemplates.js` | Circle, cone (angle parameter), line (width parameter), box polygon primitives | Reuse explicit-parameter primitives. `buildAoEPolygon` hard-codes 53.13° cone/5-ft line and places circle/box at its target argument; do not inherit these choices |
| `utils/InfiniteGridSystem.js:490–534,903–963` | Euclidean, hex, 5-10-5, wall-path distance; actual offset-aware cell/world conversions | Use coordinate conversions. Metric options are not approved range rules; label planar distance advisory |
| `grid/CreatureToken.jsx:1146–1167,2203–2217`; `CharacterToken.jsx`; `TokenCombatFloats` | Hidden/FOV rendering gates; rendered exact-actor registration. Portrait diameter is padded/scaled artwork | Use current viewer visibility. Artwork bounds do not establish occupied cells or a gridless footprint |

Legacy free-tool hidden counts/names are a source finding, not a new browser reproduction. A future B2
change to shared membership/output helpers must make those outputs visibility-safe too; do not preserve a
hidden-count leak as a regression requirement. No claim that it has been fixed in this task.

## 3. Authored-data boundary (read-only extraction, not admission)

The preview descriptor names the selected action ID and a fingerprint of the exact selected authored
geometry/targeting data. That fingerprint is local invalidation identity, **not** an A1a definition hash,
trust flag or permission to execute. Card/slot copies must retain provenance; an unknown copy can be a
manual sketch but cannot claim to be the original authored action.

Read `targetingConfig` and, when present, explicitly selected `effectTargeting[effect]`. Do not silently
union effect geometries or prefer top-level data over conflicting per-effect data. Show which effect is
being previewed. Equal geometries may share the drawing, while their recipient labels stay distinct.
Also inspect propagation, tagged recipient overrides, trap/channel/zone timing and prose-only secondary
recipients before labelling a profile supported. A top-level `single` is not proof of one recipient.
Separate **initial selection → first delivery/origin → propagation → application/timing** (§9–§12).

| Authored source example | Observed data | Preview consequence |
|---|---|---|
| `data/classes/martyrData.js:1095–1143`, Radiant Burst | Circle radius10, ranged20; enemy damage / ally healing effect channels; prose says undead/living | Draw the selected channel's explicit circle; show recipient/prose conflict as GM-decided, not “everyone takes damage” |
| `martyrData.js:1259–1288`, Sol's Breath Aegis | `self_centered`, sphere radius10 | Source-locked **plan view**, elevation unresolved; no 3D membership claim |
| `arcanoneerData.js:2655–2698`, Aetheric Lance | Line length60, ranged60; width missing; enemy damage / ally barrier | Manual geometry fallback: do not insert the tool's 5-ft width or assume ranged origin means a beam starts remotely |
| `arcanoneerData.js:1701–1715`, Steam combo | Cone length20; no angle, combo `range:30` outside normal targetingConfig | Missing angle/provenance mapping → manual; no 53.13° or Wizard90° fallback |
| `spellguardData.js:1877–1888`, Leyline Static | `areaShape:'circle', areaSize:30`, self-centered; prose30-ft area | Legacy size meaning is not certified radius/diameter; manual until a named mapping is reviewed |
| Wizard `core/data/targetingTypes.js:68–153,182–245` | Circle/square/cone/line/cube/sphere/cylinder/wall/trail; assorted radius/size/range/angle/length/width defaults | Authoring defaults are not missing-data rules. Alias conversion must be explicit and lossless |

**Proposed initial drawing subset:** 2D circle (explicit radius), cone (explicit length and opening angle),
line (explicit length and width), square (explicit side and origin convention). Reuse the existing box
primitive for a square, without relabelling every authored cube a square. Sphere/cube may show a labelled
2D plan-view outline only when horizontal dimensions and centre/corner interpretation are explicit;
all vertical inclusion remains GM-decided (G6). Cylinder/wall/trail, rings/holes, paths, chains, evolving
zones, multiple disjoint shapes and class anomaly lifecycles stay manual. No persistent zone executor.

Required dimensions are finite positive numbers in known units; cone angle must be in (0,360]. Zero,
negative, NaN, string formulas, absent units, contradictory radius/diameter, conflicting aliases or
unknown shape/origin produce **“Manual geometry — [specific reason]”**. Keep original data inspectable;
do not repair it, parse prose into dimensions, truncate a huge area into a legal-looking one, or price it.
Explicit zero **placement range** is different from zero size: preserve it and report its source; do
not assign zero a gameplay meaning here. Class HeadQ owns the source-backed zero/sentinel semantics
and save/export preservation handoff. Missing range is unknown, never zero or infinity. The first
freeze candidate uses an explicit positive range and does not depend on that investigation.

## 4. Interaction and identity contract

1. **Entry.** A separate Preview area control from an action's manual presentation; it returns before
   the local cast/spend path. Owner uses their existing source attachment; GM may use an existing
   controlled source. No new foreign-actor control permission. One active map interaction across B1,
   B2 and the free template tool; starting another cancels the previous catcher with no resource writes.
2. **Session binding.** Retain session ID, principal/account generation, room, map, exact source ref
   (including incarnation), action ID/data fingerprint, selected effect, map scale/grid revision,
   origin mode, world origin/direction and displayed policy version. Candidate refs are derived from
   current visible actors, not a permanent captured list. Unbound visible tokens can be labelled manual
   map markers, never silently promoted to exact P7 actors.
3. **Self/source-bound.** Source ring and effect-origin marker are distinct even when coincident.
   `self_centered` fixes the centre to the source diagnostic point; cone/line from source fixes its apex/
   start there only when that origin is explicit. Choose orientation, not a new caster point. Whether a
   Large source may originate from its edge is G1b, not an implementation convenience.
4. **Ranged origin.** Show source ring, source→origin aim line and separate origin crosshair. Select the
   origin, then aim directional shapes. A circle needs no orientation. A square rotates only when its
   authored convention allows it. Do not stretch a fixed length to the cursor distance. Coincident aim
   and origin is “direction needed”, never a silent east-facing cone.
5. **Placement feedback.** Always label authored dimensions and diagnostic range. States: **unavailable**
   (bad geometry/scale/source, confirmation disabled); **outside displayed range** (red/dashed + text);
   **within displayed range — advisory**; **GM decides** (amber/hatched + specific unresolved reason).
   Within the ring is not authoritative green “valid”. G1 is pending: show origin distance as advisory;
   an outside-origin result cannot be called illegal under an unapproved G1 convention. If G1 is
   approved, it can block normal placement outside that diagnostic range; a manual sketch remains
   separately labelled. Unresolved LoE/elevation never turns into valid when the cursor stops moving.
6. **Confirm.** Keep preview retains only this local session's geometry/labels, exits its catcher and
   returns to the action. For unresolved cases the button says **Keep manual preview — GM decides**.
   It returns no executable target list, sends no network event and never calls `setTarget`/target history.
7. **Cancel/clear.** Esc (capture/consumed as B1), right-click and visible Cancel end B2 fully and return
   focus to its entry. Clear removes the retained preview. Unlike the legacy tool, no hidden re-arm.
8. **Changes.** Source movement updates a source-locked origin and range diagnostic; ranged origin stays
   at its chosen world point and its range recomputes. Token movement/visibility recomputes candidates.
   Any such change invalidates a kept confirmation and requires re-keeping before it looks current.
   Rebinding/deletion, account/room/map/action/effect/geometry changes or lost control cancel the session;
   scale/grid changes invalidate and require a fresh preview. Pan/zoom/rotation/tilt reproject, not resize
   in feet. Disconnect/hydration uncertainty suspends/clears it; reload starts idle. Existing roll custody
   stays untouched through all of these transitions.

## 5. Geometric membership definitions (conditional, not approved rules)

**Area A** is the authored 2D region in world feet. **Source position S** is where the actor stands;
**effect origin O** is the centre, apex or start the selected geometry names. S and O are not the same
thing for a ranged burst. A candidate is reported once per exact actor, even across several occupied cells.

- **G1 recommendation:** measure placement reach from S to O, not the nearest point of A. Planar
  centre→origin measurement is the existing advisory metric; it does not decide the lasting range metric.
- **G1b open:** source-locked effects from a Large source: centre versus an occupied-footprint edge.
  Recommend centre for a consistent preview anchor; until decided label that anchor advisory.
- **G3 recommendation:** on a grid, count a creature when A overlaps at least one **occupied cell**.
  Occupied cells must come from a known placement/footprint, not portrait padding or all cells the
  artwork touches. Square-grid2×2 Large example means four full cell regions. Fractional/off-grid or
  unknown footprint → GM decides. Hex multi-cell footprints need a reviewed exact cell set; no square
  bounding-box substitute. Hex outlines/planar measurement may still be advisory.
- **G3a open, independent of G3:** positive-area intersection versus boundary contact. Recommend
  **positive-area intersection**: a tangent point/shared edge alone does not count. A numerical tolerance
  classifies near-boundary cases “edge — GM decides”; it must not inflate the area. Analytic circle/
  segment checks or controlled approximations must not make membership depend on zoom/tessellation.
- **G3b open:** gridless use the actual world-space token footprint, not its centre or pixel portrait.
  Recommend positive-area overlap of an explicitly known circular/polygon footprint. No authoritative
  gridless footprint is established by the inspected token renderer; unknown footprint stays manual.
- **G4 recommendation:** include allies unless the authored channel excludes them. Highlight ally
  candidates with text/icon, not colour alone. Do not infer allegiance from PC/creature kind; use an
  established relationship or label unknown. `enemy/enemies`, `ally/allies`, caster exclusion and
  `friendlyFire` require a reviewed mapping; disagreement with prose/config stays GM-decided.
- **G5 recommendation:** free-point O within applicable constraints. Snapping, if later selected, uses
  actual grid transforms/offsets; gridless has no cell centres to snap to. Not approved by tool support.
- **G2 walls/LoE and G6 elevation:** unresolved. A sight polygon proves neither blast blocking nor a
  path from a remote origin. Do not clip as a Prism rule or call a behind-wall/above-area candidate valid.
  Draw the visible plan-view geometry with **LoE/elevation not adjudicated — GM decides**. Masking for
  viewer privacy is separate from clipping for effect rules. Never query hidden wall geometry to reveal it.

Before answers, report factual geometry separately: “visible footprint overlaps drawing; inclusion GM
decides”, “edge — GM decides”, or “outside drawing”. Even complete containment does not establish effect
eligibility, walls or height. No aggregate “affected” count.

## 6. Worked geometry examples

| Case | Exact comparison | Required display before decision / conditional result |
|---|---|---|
| Ranged burst | S=(0,0), O=(70,0), radius20, range60 (feet) | Origin70; nearest edge50; **G1 pending — GM decides**. If G1 origin wins, outside; nearest-edge option would allow it |
| Range boundary | Same card, O=(60,0) | At displayed planar range, not automatically legal: LoE/height/metric still adjudicated; radius does not add another20ft of placement reach under G1 |
| Large target | Known2×2 occupied cells; one has a1ft² intersection, centre outside | G3 pending: overlap shown, GM decides. Under G3+G3a recommendation, one candidate, not four hits |
| Contact only | Circle touches one cell corner, or a line's long edge lies exactly on a cell edge | “Boundary contact — GM decides” until G3a. Under positive-area policy alone this is excluded; a tiny positive overlap would count |
| Gridless | Explicit5-ft-diameter footprint, centre outside,1-ft-wide overlap | G3b pending. Footprint policy includes; centre policy excludes. Unknown portrait size cannot settle it |
| Source vs origin | Large caster at S; self burst versus ranged burst O30ft away | Self burst follows S; ranged burst follows O, line shows S→O. Edge-origin option for Large caster awaits G1b |
| Ally / per-effect | Radiant Burst drawing includes ally and enemy | Separate ally-healing/enemy-damage channel labels, with undead/living conflict visible. Never announce both damaged |
| Wall / flyer | Visible bandit behind known wall; visible flyer above the plan view | Geometric overlap only; each says GM decides. No hidden creature count, even if another is behind that wall |
| Missing width / angle | Aetheric Lance length60 only; Steam length20 only | Specific manual reason, no default-width line/default-angle cone; an independent free sketch is not action-certified |

## 7. Privacy is a release condition, not a targeting rule

Filter by **current viewer visibility before geometry, hit testing, label construction or aggregation**.
Use the same current-map hidden/FOV gates and exact rendered registry as B1/P13A; absence of trustworthy
visibility means no candidate output. No player GM-mode bypass merely from a selected token.

- No hidden-token rings, silhouettes, positions, counts, names, “+N others”, hover reasons, tooltips,
  DOM/ARIA text, accessible announcements, debug/history payloads or cached placement members.
- Keeping geometry stores no frozen name/member list. Re-evaluate visible candidates each render; a token
  becoming hidden disappears from every derived surface immediately, including open summaries.
- GM preview remains local to the GM. Never send a GM-computed candidate list to players. No room event
  or persistence of B2 candidate lists. Source/visible-map facts only in any local status text.
- Existing free-tool confirmation must not be reached through B2; its `affectedNames` chat payload is
  specifically forbidden. Any helper reused there must filter that tool's outputs before publication too.

## 8. Smallest implementation boundary and acceptance (future authorization required)

Combat owns the transient interaction extension and geometry adapter in existing targeting/AoE owners;
map/UI co-owns overlay mounts/transforms; Class owns authored geometry and any data correction. No server
file is needed for B2. Propose extending `targetingStore`, `spellAoEStore`, `SpellAoEOverlay`, `AoETemplates`
and a small action-entry hook in the shared manual gate/confirmation. Preserve B1 callback/ref contract;
no second canvas, targeting store or executable definition registry. Announce exact shared edits before code.

Future focused checks (not run or claimed in this preparation):

| ID | Required witness |
|---|---|
| B2-1 | Exact authored circle/cone/line/square parameters; missing/conflicting data refuses named support; sphere/cube remain labelled plan views |
| B2-2 | Self origin follows source; ranged origin and orientation are separate; source/action/ref/scale changes invalidate coherently |
| B2-3 | Boundary, Large multi-cell, gridless and unknown footprint examples above; policy-pending state cannot look valid |
| B2-4 | Hidden/FOV/other-map tokens cannot change any ring/count/name/DOM/ARIA/chat/history result; test visible→hidden while kept and three viewer roles |
| B2-5 | Instrument rolls, spend, cooldown, approvals, proposals, socket emissions and resource stores: zero calls/mutations through move/keep/cancel/reload |
| B2-6 | One input catcher; B1↔B2↔free-tool cancellation; Esc does not open exit UI; keyboard/touch placement, focus return, pan/zoom/tilt/offset correctness |
| B2-7 | Existing single-target selection/roll retention/manual notice unchanged; shared legacy template outputs visibility-safe if touched |

Source review, focused tests and real Playwright production-component checks are required after approval;
any build follows detached-process rules. No historical accepted suite rerun is required merely to draft
this contract. Freeze needs an explicit supported geometry/policy subset, answers or visible manual
boundaries for G1/G1b/G3/G3a/G3b/G4/G5, and HQ implementation authorization. G2/G6 can remain manual.

### 8.1 First freeze candidate: one original ranged circle

**FROZEN first-slice change contract (creator authorization, 2026-10-18).** Implement only this vertical
subset under the four approved choices. Unknown footprints remain manual; no new footprint authority.

| Item | Exact proposed boundary |
|---|---|
| Input | Original `martyr_radiant_burst` in `data/classes/martyrData.js:1095–1143`; selected `damage` **or** `healing` channel, never their union. Explicit circle radius10ft, ranged origin reach20ft; named read-only profile pins these units/centre convention to the original definition. This is preview provenance, not A1a admission |
| Unresolved recipients | Enemy/ally channel fields conflict with undead/living prose. Show both source statements and **Recipient eligibility — GM decides**. Geometric candidates are not certified damage/healing recipients; no relation inference from actor kind. G4 remains manual for this subset |
| Required answers | G1 (range basis), G3 (occupied-cell membership), G3a (contact predicate), G5 (placement). An explicit `manual` answer keeps that part advisory. G1b self anchors and G3b gridless membership are outside this first subset; they do not block it |
| Footprint | Known square-grid occupied-cell sets only for policy-based candidate labels. Unknown, fractional/off-grid or unverified multi-cell footprints get a manual reason and no inferred membership. Do not derive cells from artwork, token hit radius, or a size name alone |
| Session/output | Existing §4 lifecycle, exact source/account/room/map/action/effect identity; source ring, separate origin crosshair, advisory reach, authored circle, visible geometric candidates; Keep/Cancel/Clear. No executable target list, roll, reservation, payment, chat or consequence |
| Other actions | Missing/conflicting dimensions or altered/unmapped copies get the specific manual fallback. The wider §3 shape list is a later extension, not required for this first patch. Propagation/lifecycle profiles remain as inventoried in §§9–13 |
| Future writes | `store/targetingStore.js`, `store/spellAoEStore.js`, `components/grid/SpellAoEOverlay.jsx`/CSS, `utils/AoETemplates.js`, and only the necessary shared manual entry (`manualActionGate.js` and its action-bar/confirmation caller). `Grid.jsx` only if the existing mount needs props. Exact write list must be announced/reconciled before code; no Wizard/class-data/server edits |
| Verification | B2-1…7 narrowed to this circle/channel: both channels without semantic union; known2×2 footprint and unknown footprint; boundary cases per answer; hidden/FOV/other-map and visible→hidden output equality; no side effects; one catcher, cancel/focus, transform correctness, retained B1 rolls. Focused production-helper tests, Playwright production-component/App witness, integrated detached build and one bounded independent review |

The broader seven-choice table stays available for widening; it is not seven mandatory answers for
this four-choice subset. Authored Wizard variants wait for Class HeadQ's exact preservation/semantics
handoff; this read-only original profile neither repairs their exports nor requires A1b to be unparked.
Obstruction rule enforcement requires a separate future freeze under §14, not the preview patch.

## 9. Targeting and propagation coverage matrix

**Bounded source inventory, 2026-10-18, same HEAD as §2; no new runtime acceptance.** Traced the Wizard
menus/context, both saves/reopen, JSON/template/game-code serializers, card/authoring previews, map
stores/overlays, catalogue variants and P7/P8/P9/P12 consumers. This is a mode/capability inventory,
not a re-audit of class design or a claim that every catalogue card works. The concurrent C1 correction
checkpoint belongs to the class track; its files/checkpoint were not changed by this work.

**Four separate questions:** (1) who/what is initially chosen; (2) how the effect reaches that actor or
origin; (3) how it reaches additional recipients; (4) what is applied, at which event/time. For example,
`single` + explosion chooses one initial actor, not one final recipient. A `chain`-labelled Spirit Link
creates a continuing relationship rather than a flying damage chain. Neither a preview line nor a
catalogue field establishes line-of-effect validation, payment, an accepted hit or atomic consequences.

Source keys (client paths relative to `vtt-react/src/`; line ranges identify the inspected worktree):

- **T** `components/spellcrafting-wizard/core/data/targetingTypes.js:2–153,261–299` (core enum/helpers).
- **W4** `components/spellcrafting-wizard/components/steps/Step4Targeting.jsx` (specific ranges below).
- **CTX** `components/spellcrafting-wizard/context/spellWizardContext.js:143–162,191–249,984–1047,1255–1259`.
- **SAVE** `.../components/steps/Step10Review.jsx:2602–2704`; **APP** `components/spellcrafting-wizard/SpellwizardApp.jsx:235–296,525–536`.
- **SER** `.../core/utils/spellSerializer.js:34–117,618–629,750–889`; **TAG** `.../components/targeting/TagBasedTargeting.jsx:15–18,65–104`.
- **NORM** `.../core/utils/spellNormalizer.js:33–60,342–370`; **FMT** `.../components/common/useTargetingFormatters.js:292–406`.
- In these abbreviated Wizard paths, `.../` means `components/spellcrafting-wizard/`.
  **TrapPlacement** / **Step8Channeling** mean that directory's `components/steps/TrapPlacementStep.jsx`
  / `components/steps/Step8Channeling.jsx`; `debuffTypes.js` means `core/data/debuffTypes.js` there;
  `spellTypeSystem.js` means `core/mechanics/spellTypeSystem.js` there.
- **PICK** `store/targetingStore.js:6–19,105–133,207–237,296–340`; `services/targetPick.js`; `grid/TargetPickOverlay.jsx` (§2).
- **MAP** `store/spellAoEStore.js:16–28`; `grid/SpellAoEOverlay.jsx`; `utils/AoETemplates.js` (§2).
- **EXEC** `services/spellConsequence.js:130–181,340–348`; `hud/SpellConsequencePanel.jsx:60–79,160`;
  `services/weaponStrike.js:18–36`; `services/featherSlash.js:14–20,63–78`;
  `server/services/actorConsequences.js:118–176`. Component shorthand `hud/` and `grid/` means `components/hud/` and `components/grid/`.
- Bare class filenames (`apexData.js`, `martyrData.js`, etc.) below mean `data/classes/<filename>`;
  `testSpells.js` and `skillAbilitiesData.js` mean `data/<filename>`. Server paths are repository-relative.

**Save notation:** **J** = whole non-private draft JSON/template survives structurally (SER), not validated
gameplay; **O** = outer library save/reopen (SAVE/APP), with the alterations in §11. **Manual** in the
execution column means no admitted shared-room mode executor; ordinary GM entries remain possible.
Outside shared rooms, local resource/roll/condition helpers exist, but are not a propagation engine.

| Exact field/mode and source | Authored meaning / layer | Authoring and save now | Preview now | Shared execution now | Missing rules/capability | Owner/phase or deferral |
|---|---|---|---|---|---|---|
| `targetingType:'single'`; T:4, W4:27–39 | One initially selected actor (1), not guaranteed one final recipient | Offered; J/O | Wizard sample point; B1 exact-ref picker for supported controllers | P8 original Feather Slash, P9 admitted immediate single damage/heal subset, P12A basic strike; GM adjudicates legality | No generic projectile/path resolver; inspect all secondary fields first | Existing B1; other actions manual |
| `rangeType:'touch'/'ranged'/'sight'/'unlimited'`; W4:72–76,439–453; catalogue `'melee'/'self'`; `rangeDistance`, `requiresLineOfSight` / `lineOfSightRequired` | Initial reach/origin constraints (2), not propagation-hop distance | Offered four range choices; Step4 encodes touch5/sight60/unlimited−1; J/O keep variants with defaults in §11 | Wizard Euclidean sample range; B1 planar distance/aim is advisory | Supported controllers require GM legality/range/defence adjudication; no general sight/path or hop enforcement | Actual sight vs fixed60, unlimited sentinel, zero/melee/self semantics; every segment's walls/object/cover/LoE separately | Advisory B1/B2; authoritative geometry deferred |
| `targetingType:'self'`; T:46; effect target `self`; EXEC | Caster recipient (1/4) | Catalogue/J/O; Step4 removes `self` from its type menu, then PASSIVE filtering requires it (W4:27–39,249–263). Do not claim a usable universal self control | Labels/legacy sample; P9 picker can choose source itself | P9 can use same exact source/target for a supported **single** heal; arbitrary `self` cards are not thereby supported | Self recipient ≠ caster-centred area or trap-local `rangeType:'self'` | Preserve B1; authoring gap Class; other self effects manual |
| `rangeType:'self_centered'`, also `targetingType:'self_centered'`; W4:33,353–369; `martyr_divine_shield` | Source-bound origin (2), potential many recipients (3/4) | Special Step4 type; catalogue area+range variant; J/O with zero-range caveat | Wizard aura/trail sketch; MAP generic tool is not source-bound | Manual | Source anchor/shape association, G1b/G3, elevation; type and range encodings not equivalent | B2 explicit static footprint only; lifecycle later |
| `targetRestrictions` W4:42–58 | Filters (1/3/4): `any,ally,enemy,self,creature,object,undead,construct,location,friendly_player,friendly_npc,hostile_player,hostile_npc,elemental,demon,beast` | Offered; J/O; catalogue also plural `allies/enemies/objects` and e.g. `horror` | UI labels; old store uses `faction:'friendly'/'hostile'` booleans, not a full relationship/species evaluator | Existing controllers bind actors, not this whole taxonomy; P9 candidate list includes same-map creatures/primary PCs, GM confirms legality | Relations, tags, consent, conflicting prose/restrictions and per-hop filter inheritance | Class wording; Combat named validators; manual until reviewed |
| `TARGET_TYPES.OBJECT/LOCATION`; `targetingType:'point'/'ground'/'location'`; PICK; `chronarchData.js:606–620`, `skillAbilitiesData.js:607–638`, TrapPlacement:90–103 | Point/ground/object initial subject or origin (1/2), not an actor by definition | Restrictions available, but point/ground not Step4 types; trap supplies location; J/O | Wizard location sketches; free MAP point placement; B1 only bound actor refs | Manual; P7 actors are character/creature, not arbitrary objects/ground | Exact object identity/lifecycle versus point coordinates; placement vs effect origin; occupancy/visibility | B2 only explicitly mapped area origins; object/movement/lifecycle follow-ons |
| `targetingType:'multi'`, catalogue `'multiple'`; `maxTargets` vs `targetCount`; T:11, `martyrData.js:3415–3438`, `testSpells.js:1242–1258` | Several independently chosen initial recipients (1) | `multi` offered; J/O retain aliases but do not reconcile them | Wizard labels/estimate; store selected-target array is local, not a bounded action list | Manual; B1 returns one ref | Count includes caster? distinct/repeated targets? per-recipient reach/consent, roll/cost frequency, partial vs atomic | Later role-labelled list picker; P14 named multi-target capability |
| `selectionMethod` / `targetSelectionMethod`: `manual,nearest,farthest,random,lowest_health,highest_health`; W4:62–68; legacy `targetingType:'smart'/'nearest'` T:53–64; trap `'auto'` | Who chooses initial recipient (1), separate from next-hop behaviour | Six choices offered; smart/nearest type removed from menu but test cards retain them; J/O | Synthetic point/dummies; no map selector for these algorithms | Manual (store nearest helpers are placeholders) | Tie metric, visibility, eligible set, randomness custody, HP information entitlement; aliases can disagree | Manual; future per-profile selector, not B2 inference |
| `targetingType:'area'`, `aoeShape`, `aoeParameters`; circle/square/cone/line; T:68–108; W4:1347+ | Static shape from chosen origin/direction (2/3) | Offered shape parameters; J/O; cone `range` vs catalogue `length` | Wizard draws synthetic shapes; MAP free circle/cone/line/cube with different defaults | Manual | G1–G5 and explicit dimensions, occupied footprint; no arbitrary area transaction | B2 proposed subset (§3); P14 effects separate |
| `sphere,cube,cylinder`; T:111–133; W4 shape renderer | Volumes (2/3), not equivalent planar circles/boxes | Offered; J/O | Wizard plan/pseudo-3D drawings; MAP circle labelled Sphere/cube footprint | Manual | Height/origin/vertical intersection G6; no cylinder map primitive established | B2 labelled sphere/cube plan view only; cylinder/3D manual |
| `wall,trail,none`; T:68–75,136–152; legacy `areaShape/areaSize/aoeType` and direct `targetingType:'cone'/'line'` | Wall/trajectory footprint or no area; alternate encodings, not new permission (2/3) | Enum/helpers plus Step4 controls; J/O preserve differing keys; catalogue/test direct cone/line | Wizard drawings; MAP lacks wall/trail; legacy text generator defaults unknown types to single | Manual | Length/width/height/path, corner/centre, pass-through and timing; `areaSize` has no universally certified unit meaning | Static supported aliases only after explicit mapping; wall/trail lifecycle deferred |
| `targetingMode:'unified'/'effect'`, `effectTargeting[effect]`; CTX; SAVE; W4:280–334 | Per-effect recipient/geometry/propagation (1–4), not one union target set | Active Step4 unified/effect; J/O; replacement updates can erase sibling fields (§11) | Per-effect labels; FMT selects effect propagation | Manual for mixed profiles; P9 refuses unsupported top-level shapes/fields | Independent harmful/helpful channels, source roles, conflicting geometries | B2 explicit selected channel only; expanded application later |
| `targetingMode:'tagged'`, `targetingTags[effect].targetOption:'target'/'self'/'both'`; TAG | Route each effect to target/caster/both (4), not another area or hop | TAG component/helper retained; Step4 primarily exposes unified/effect, so no equivalence assumed; J/O | Tag/card formatting; compatibility game code summarizes options | Manual | Tagged vs effect schema migration/admission and mixed payment/effects | Class authoring boundary; later named execution |
| `damageConfig.damageType:'direct'/'area'/'dot'`, nested `areaShape/areaParameters`; `components/creature-wizard/components/windows/BasicAbilityCreator.jsx:142–184`; `data/spellUtils.js:258–340` `meta.{requiresLoS,hasTravelTime,projectileSpeed}` | Damage application category and travel/display metadata (2/4), not another recipient selector or collision algorithm | Creature form emits direct/area/dot; legacy prepareSpellForGame emits meta; no live caller found for that helper | Card/creature preview metadata, no shared projectile flight simulation | P8 exercises only its exact original shape; generic creature ability manual | Damage category vs initial geometry; collision/travel deadline/reactions, invalid target while in flight; no field implies pass-through | Explicit deferral; future named delivery/effect capability |
| `propagation.method:'none'`; W4:80–87; trap builder | No propagation from this configuration (3) | Offered; J/O | No dummy secondary path | Does not itself grant execution; inspect chain/effect/prose too | Contradictory secondary fields can still exist | B2 simple-profile boundary; other fields still checked |
| `.method:'chain'` + `.behavior` + `.parameters.{count,range,decay}`; W4:89–94,134–140,3323–3381; `pyrofiendData.js:1799–1862` | Automatic sequential recipient jumps (3); legacy chain can mean a link | Offered; J/O; flat legacy fields differ from parameters | Wizard dummy sequence; no real map chain | Manual; no consumer in P7/P9/P12 executes it | Count/visited/chooser/basis/falloff/segment/reaction/payment rules (§10) | Future explicit path preview; P13B/P14 per capability, links lifecycle |
| `.method:'bounce'`; W4:96–101,141–146 | Unpredictable/ricocheting traversal, **may revisit** (3) | Offered; J/O; prose-only weapon ricochets also exist | Random dummy arcs, not collision simulation | Manual | Random/nearest/wall surface choices, visit budget, power/speed changes, stop/revalidate | Manual; bounded card-specific P14 + geometry; P13B if interruptible |
| `.method:'seeking'`; W4:103–108,148–154 | Automated search/priorities (delivery/3) | Offered; J/O | Dummy radar/targets; not hidden-actor detection | Manual | Search origin/coverage, policy, limits, entitlement to hidden facts; UI text “ignores obstacles/find hidden” is not engine authority | Deferred named rules; B2 never reveals hidden candidates |
| `.method:'explosion'`; W4:110–115,155–161; `arcanoneerData.js:2749–2799` | First delivery/impact then secondary area (2→3) | Offered; J/O; `behavior:'aoe'` catalogue not in menu | Synthetic impact circle; MAP can draw a free circle but is not linked to impact | Manual (Flame Burst Shell is refused by P9) | Impact point on move/miss, primary re-inclusion, trigger/delay/secondary recursion, area rules | Later impact footprint aid; P14 consequence; P13B/lifecycle where authored |
| `.method:'spreading'`; W4:117–122,162–168,3443–3459; `debuffTypes.js:408–438` `spreadingEffect` | Growing area/contagion/tick transfer (3/4), distinct clocks | Offered feet/second; J/O; debuff spreadRadius/chance is a separate schema | Three dummy rings with animation timing; no admitted infection/zone | Manual | Boundary clock, generation/visit caps, trigger action vs tick, spread origin/filter/chance/consumption | FO-B/FO-E geometry + named domain; no B2 ticking |
| `.method:'forking'`; W4:124–129,169–175,3464–3480 | Multiple branches, possibly recursive/converging (3) | Offered fork count; J/O | Dummy spokes, three points per fork; not simultaneous commits | Manual | Fork origin/depth/total cap, chooser, merge/revisit, power split, per-branch obstruction/reactions | Manual; bounded branching preview later; P14/N-actor decision |
| Legacy `propagation.type:'chain'/'multi'`, `.maxTargets/.chainDistance/.damageDecay` (`data/classes/apexData.js:940–945,1649–1656`); `targetingConfig.propagation.{maxJumps,jumpRange,falloffType,falloffRate}`; damage/healing `chainConfig` (`data/testSpells.js:202–228,295–301`) | Independent legacy propagation encodings (3); `type:'multi'` describes Phantom Blades' simultaneous targets, not automatically travelling hops | Retained by J/O/load configs; no current dedicated chain controls found in damage/healing forms | Some formatter text; Step4 reads root/effect `method/parameters`, not all variants | Manual; strict EXEC refuses these | Semantics/count/units reconciliation, schema provenance, unknown fields | Class reviewed mapping first; no automatic conversion |
| `spec_crossbow_piercing_bolt`, `spec_thrown_ricochet_toss`; `data/weaponActionSpells.js:928–975` | Pass through first into next behind vs second enemy within10ft of first (2/3) | Generated authored cards/J, not propagation dropdown modes | Card prose; advisory aim line for supported basic actions is not this special | Manual; P12A supports only basic IDs | Collinearity/corridor, intervening actors/objects, hit/stop/repeat, roll/payment; stabbing/DR bypass ≠ pass-through | Named later path/profile; P14 (not basic-strike routing) |
| `spellType:'ZONE'`, `targetingConfig.movementBehavior:'static'/'follows_caster'/'movable'`, `typeConfig.leaveTrail/trailDuration`; W4:219–226,650–692,3150–3167; `spellTypeSystem.js:124–139` | Persist/move footprint and apply over lifetime (2/3/4) | Offered/retained J/O; movement controls can update global while effect mode active | Synthetic animated zone/trail; MAP retained placement is only a drawing | Manual | Object ownership, movement event, entry/exit/occupancy, action cost, expiry and revalidation | B2 static geometry only; FO-E/FO-B + approved effects |
| `channelingConfig.{initialRadius,maxRadius,expansionRate,expansionType,persistentEffectType}`; Step8Channeling:252–336,362–397,2154–2195,2446–2475 | `linear/pulsing/erratic` expansion; `aura/field/beam` persistence (2–4) | Authoring suggestions/controls; J/O retained | Channel illustrations/scaled formula preview | Manual | Round/turn vs seconds, sustain payment, moving origin/targets, interruptions; defaults do not define game semantics | P13B for actual interrupts; FO-B/E and named channel execution |
| `TRAP`, `triggerConfig`, `effectTriggers[*].targetingOverride`, `persistentConfig`, type cast-time/STATE/PASSIVE; CTX:191–249; TrapPlacement:76–113 | Initial placement now, recipients determined by later trigger (1 then4) | Trigger/trap/channel configuration J/O; legacy/global/effect trigger shapes coexist | Trap/sample card/trigger descriptions, not armed world objects | Manual. Local health-threshold stat helpers/ticks exist; no generic shared recipient scheduler | Trigger actor vs chosen actor, arm/delay/repeat/expiry, authoritative events and permissions | P13B only voluntary matching reactions; compulsory triggers FO-B/E + named consequences |
| `animist_spirit_link` (`animistData.js:783–796`); `martyr_covenant_of_blood` (`martyrData.js:3415–3455`); `temporal_anchor` (`chronarchData.js:1553–1594`) | Endpoints/shared future damage/heal or delayed coordinate return (1/4), not necessarily propagation travel | Authored catalogue/J/O; no exact linked-object authoring/admission guarantee | Text/selected endpoints at most; no authoritative link/path | Manual | Endpoint consent/identity, causal interception, saved coordinates, invalidation/cycles/duration, coupled owners | Class domain rules + FO-E/B/N; candidate CR-L1/Fate proposals are not generic rules |

Additional taxonomy mismatches are retained, not normalized into support:
`components/spellcrafting-wizard/data/enhancedEffectSystemData.js:37–44`
uses string enums `single,multi,aoe,self,ally,enemy`, unlike T's object enums; `spellTypeSystem.allowedTargeting`
also names `aura` for passives. These are authored/helper vocabularies, not additional exercised map modes.
PICK's `single/multiple/area/none` and `player/party_member/creature/object/location` are UI-state kinds,
not the P7 actor schema or Wizard schemas. Never infer an executable mode from matching English names.

## 10. Propagation rule ledger — what sources settle, and what they do not

For **each** profile freeze must specify: chooser; range basis; hop/branch/recipient limits; revisits;
relations; walls, objects, cover and LoE for every segment; stops; per-hop effects; roll and payment
frequency; real reaction moments; movement/disappearance/rebind. **Open** below means no applicable
rule was established by the inspected fields/consumer, not a recommended universal default.

### Chain (`method:'chain'`, plus the incompatible legacy schemas)

- **Chooser:** W4 describes automatic sequential jumps; behaviours exactly `nearest,farthest,random,
  lowest_health,highest_health`. No manual next-hop behaviour in that menu. Catalogue Glaive Toss says
  chains prioritize Quarry; Conductive Bind says all linked/caged targets. These are distinct selectors.
  TEST: Rejuvenation (`testSpells.js:264–301`) has allied first target40ft and healing-chain
  `targetSelection:'lowest_health',targets:4`; tie/HP metric, subsequent range and whether4 includes the
  initial ally are unspecified. It is not the harmful chain's enemy filter or Wizard's dummy ordering.
- **Range/caps:** Wizard `count` labels **additional** targets (UI1–10), range5–60ft, decay0–50%.
  UI ranges are not tabletop caps. Range label does not say caster/origin/previous. `tox_virulent_plague`
  explicitly says six enemies within20ft **of each other**, `maxTargets:6,chainDistance:20`, first reach50.
  Glaive Toss has `maxChains:4/maxTargets:4` and “first + three more”; do not add another first target.
  TEST: Chain Lightning (`testSpells.js:201–228`) combines targetCount5, maxJumps5 and chainConfig.targets5
  with jumpRange30: that does not settle five total versus five additional or how the minimumDamage10
  interacts with percentage falloff. These counters require their own mapping, not a global chain cap.
- **Revisits/stops:** not defined for ordinary chains; Quarry-hit generation wording does not authorize
  unlimited visits. No-target, missed-hit, immunity, blocked path or zero-effect stop behaviour is open.
- **Filter/segments:** use each card's intended recipients; Searing Chains' enemy prose conflicts with
  empty restrictions; linked/caged eligibility is not nearest enemy. No per-segment wall/object/cover/LoE
  executor exists. Root LoS flags do not establish every-hop permission or obstacle bypass.
- **Effect:** Searing Chains `.damageMultiplier:0.75`, flat `.decay:0.75`, and prose “jumps75%” need
  basis/rounding rulings; Wizard percentages are another encoding. Glaive Toss fixed dice1d8/1d6/1d6/1d4
  conflict with generic `.damageDecay:0.5`; neither is silently replaced. Per-hop rolls vs shared roll,
  saves, price once/per-hop and child reaction moments remain open per card.
- **Invalidation:** no chain target-move/missing policy implemented. Preserve planned exact refs/rolls;
  GM decides stop/skip/rechoose, never silently substitute/refund/reroll. Current P7 CAS alone is not that rule.

### Bounce / ricochet

- **Chooser/revisits:** Wizard unpredictable or nearest bounce; explicitly permits the same target again.
  Behaviours `random,nearest,ricocheting,accelerating,decelerating` are not chain behaviours. No authority
  for a client RNG to choose real recipients, especially hidden ones. Pure demonstration RNG is unrelated.
- **Basis/caps:** Wizard additional count/range controls share chain UI, but range basis unspecified.
  **Ricochet Toss specifically** chooses a second enemy within10ft **of first**, initial reach40, total2;
  Glaive Ricochet says up to three secondary enemies15ft but does not settle whether15ft is each hop or
  around primary. No global interpretation from the word ricochet.
- **Segments/stops:** `ricocheting` says can bounce off walls/objects but has no surface/angle/distance/
  collision budget, cover or LoE algorithm. Whether a surface consumes a hop and what ends a bounce are open.
- **Effect/roll/payment/reactions:** accelerating/decelerating power/speed has no formula. Weapon Toss
  lists weapon+2 to both/2 AP, not roll count, interception procedure or a generic payment splitter.
  Intermediate reaction moments and invalid-recipient stop/retarget remain card decisions. A repeated
  actor may be a new legitimate occurrence; dedup needs occurrence identity, not actor-only suppression.

### Seeking

- **Chooser:** automatic search; behaviours `aggressive,opportunistic,thorough,prioritized,intelligent`.
  “Strongest/vulnerable” metrics, tie/order and who may override are undefined; this is not manual selection.
- **Basis/limits:** UI has seeking range5–60ft but no explicit caster/origin/previous basis, exhaustive
  recipient cap or search duration. A retained `count` is not proof it governs this mode.
- **Segments/visibility:** text “ignores obstacles / can find hidden targets” is authoring intent, not
  established wall/object/cover/LoE/reveal rules. B2 cannot show hidden actors/counts or use private HP to
  betray a priority. Any actual discovery needs a separately approved GM-entitled information projection.
- **Stops/effects/roll/payment/reactions/invalidation:** all require a named card contract. No search
  loop, default80%-damage, reacquisition when a target moves, or forever-valid homing is inferred.

### Explosion on impact

- **Chooser/basis:** selected initial actor/origin comes first; secondary recipients geometrically around
  the impact, not automatically in caster range. Flame Burst Shell states an impact10-ft burst, first
  range90. Primary-centre vs actual collision point on movement/miss still needs a ruling.
- **Limits/revisits/filter/segments:** radius is not a recipient cap; primary re-inclusion/double effect,
  ally exclusion, wall/object/cover/LoE outward from impact, and stop-on-counter/miss are open per card.
  No automatic damage to everyone in a drawn circle.
- **Behaviours:** `standard,shaped,delayed,chain_reaction,elemental`; catalogue `behavior:'aoe'` is an
  unmatched value. Direction/shape, delay identity, recursive secondary count/depth/stop and elemental
  changes are not specified by that label. No global recursive-explosion rule.
- **Effect/roll/payment/reactions/invalidation:** burst vs direct amounts/rolls/saves, once/per-target
  price, eligible pre-impact/on-hit/secondary moments and invalid primary/impact behaviour remain explicit
  decisions. Fixed impact geometry is not automatically a moving-target tracking zone.

### Spreading / contagious effects

- **Chooser/basis:** behaviours `contagion,expanding,creeping,pulsing,consuming` describe infection,
  expanding origin, surface movement, periodic application or resource consumption. They are not one
  nearest-target chain. `spreadingEffect.spreadRadius/spreadChance` says **each tick**; root spreadRate
  says feet/second. No conversion to rounds is approved.
- **Concrete contrary clocks/stops:** Entropy Plague says infected actor **acts** in its main description,
  but its debuff says within10ft **on tick**. Wildfire Spread explicitly triggers on enemy burn **death**,
  all enemies10ft, once/round, and **cannot chain from spread burns**. Preserve that explicit stop only
  for that passive; do not impose it on all contagions.
- **Caps/revisits/filter/segments:** generation cap, re-infection/stacking, previously visited actors,
  adjacency/footprints, walls/objects/cover/LoE across every transfer/expansion and no-target closure are
  otherwise open. “Consuming resources” names no admitted owner/type/payment operation.
- **Effect/roll/payment/reactions/invalidation:** original vs copied remaining duration/effect, chance
  roll retention/frequency, sustain cost, timing and reaction eligibility need per-effect decisions.
  Losing/retiring the original infected actor may or may not end descendants; no lifecycle exists today.

### Forking

- **Chooser/basis:** `equal,random,targeted,cascading,converging` name power/direction/target/recursive/
  merge intentions; no real recipient picker. Fork origin (caster, impact or prior branch point), branch
  range and caster reach are not fixed by the retained generic range parameter.
- **Caps/revisits/stops:** UI forkCount1–6 means branches, not recipients or hop depth. Cascading depth,
  total branch/recipient ceiling, shared-target visitation/convergence and no-target/blocked-branch
  stopping are open. Wizard three dummy points/fork is drawing scaffolding, not a rule.
- **Filter/segments/effects:** targeted type mapping, relation inheritance and wall/object/cover/LoE for
  **every branch** are missing; equal split needs amount/rounding definition, random split needs retained
  selection. Neither20% dummy decay nor simultaneous animation establishes simultaneous consequences.
- **Roll/payment/reactions/invalidation:** count of rolls/saves, branch allocation of one price, when
  recipients can react, branch order/interruption and moved/missing recipient handling remain undecided.

### Legacy simultaneous multi (`propagation.type:'multi'`)

Phantom Blades (`data/classes/apexData.js:1634–1684`) says simultaneous strikes, initial range30ft,
maxTargets4 in both targeting and propagation, formula3d8 and card price1 AP/18 mana/5 Marks. No ordered
inter-recipient hops, fork depth or previous-target range is authored. Who selects the set, repeat hits,
ally/enemy eligibility, caster→each-recipient wall/object/cover/LoE, shared/per-recipient rolls, payment
frequency and interruptions are not supplied by `type:'multi'`. A target moving/disappearing leaves
partial/cancel/reselect behaviour unresolved, as do the no-valid-target and all-blocked stopping cases.
Do not reinterpret this as recursive forking, split its listed price automatically or equate simultaneous
prose with one atomic N-actor transaction. It remains manual with the multi-selection/P14 boundaries.

### Pass-through/piercing, persistent movement and linked/delayed routing

- **Piercing Bolt** is a distinct finite pass-through instruction: first actor then next enemy directly
  behind, same weapon+3 payload, two recipients, initial reach100. No line width/maximum continuation
  distance, chooser among collinear actors, obstruction/cover/LoE, stop-on-miss/armor, revisit, rolls or
  intermediate reaction procedure is established. Do not hit every actor along any `line`. “Two receipts”
  in flavour is not an atomicity/payment contract. Damage type `stabbing` or DR penetration is not travel.
- **Zones/trails/channels:** static, source-following and movable origin differ; entry/exit/pulse targets
  need new event identities. Move cost/rate, path collision/LoE, snapshot vs live occupants, revisit per
  pulse, roll/sustain price, expiry/concentration interruptions and what survives source removal need
  their own lifecycle. A retained MAP polygon is not an armed or ticking zone.
- **Links/delay/triggers:** Spirit Link says two endpoints sharing50% over3 rounds; Covenant chooses up
  to3 allies plus caster; Temporal Anchor binds an actor now and its **cast-time coordinate** for a return
  after2 rounds. Recipient choice, range at setup/use, endpoint movement/consent/retirement, cycles, split
  rounding/mitigation, scheduled checks, price and reaction moments are distinct per domain. No travelling
  chain rules or candidate Fate-transfer semantics are borrowed to fill these gaps. Mandatory effect
  triggers do not automatically ask everyone to react; only an actual eligible authored reaction does.

## 11. Save, load and preview discrepancies (source-derived, no silent corrections)

1. **Raw JSON versus “game code”.** SER34–117/618–629 deep-copies all non-private fields for JSON/templates;
   template instances do not mutate their source. SER857–889's separate `generateGameCode` targeting
   projection keeps type/range/restrictions and for `area` only shape + `aoeParameters.radius || 10`.
   It drops propagation, multi-count, selection strategy, LoS, movement and most dimensions/height.
   A line length60/width5 cannot round-trip through that projection. It is a lossy export, not a live
   interpreter or equivalent canonical draft. Both artifacts are saved by SAVE2630–2632.
2. **Explicit zero geometry is lost in outer save/display.** APP241 and SAVE2610 replace range0 with30;
   the external-preview completion path also does so (`ExternalLivePreview.jsx:57–84`).
   SAVE2615 replaces trap maxTargets0 (“unlimited” in TrapPlacement101) with1. `serializedData` is made
   from the original state and can disagree with the outer record. Reopen APP526 prefers outer
   `targetingConfig`, not a reconciliation with serializedData. NORM342–368 also supplies defaults,
   including0→30 in non-touch range and0→1 maxTargets. These are targeting findings, **not a reversal of
   accepted W1a/W1b resource-cost fixes**; no field was repaired in this task.
3. **Flat versus nested propagation.** Searing Chains/Conductive Bind flat count/range/decay are retained
   by raw save but Step4 reads `.parameters.*`; a reopening can show default3/20/20. Step10 preview222–232
   rebuilds counts from nested parameters and FMT similarly expects parameters, so summaries can omit
   authored flat values. `propagation.type:'chain'` (Glaive Toss) has no `.method`; no converter establishes
   its semantics. `behavior:'bounce'` under methodchain and `behavior:'aoe'` under explosion do not match
   their menu behaviours. Merely preserving bytes is not full editing/display support.
4. **Two competing channel-selection fields.** W4 has `selectionMethod` and `targetSelectionMethod`;
   they can disagree. CTX1011–1017 **replaces** each effect-targeting object. W4 selecting another type
   constructs a replacement (2577–2590), and movement/seeking-range handlers write global state even
   in effect mode (3155–3161,3399–3412). Final Submit also writes global targeting/propagation (439–473).
   Do not claim edits always preserve the selected channel's geometry/propagation or route correctly.
5. **Geometry vocabularies differ.** Wizard cone uses `aoeParameters.range/angle`; catalogue often
   `length` without angle; old area fields use `areaShape/areaSize`; MAP circle means radius but labels
   Sphere. SAVE generates aoeType/aoeShape defaults even on non-area cards. Loss/contradiction is surfaced,
   not silently fixed by preferring a prettier rendering. No valid area inferred from those defaults.
6. **Preview is not traversal evidence.** W4's dummy generator1975–2147 ignores chosen behaviour/range/
   decay: chain uses fixed patterns and20% decay, bounce random positions/15%, seeking random types80%,
   explosion eight particles70%, spreading three rings, forking three dummy points/fork. Its dependencies
   omit behaviour/range/decay. Card FMT displays some settings; older `previewGenerator.js:1508–1542`
   defaults unknown targeting types to single. None establishes real recipients, collisions or policy.
7. **Execution is deliberately narrower.** EXEC P9 rejects unsupported extra fields, non-single targets,
   non-ACTION timing and chain/mixed effects. `manualActionGate.js` and action-bar early returns post a
   notice rather than executing unsupported shared casts. `effectProcessingService.js:141–142` refuses
   shared/manual ticks; local over-time helpers are not a shared spread scheduler. A1a only models
   `targeting.kind:'single',maxTargets:1` (`server/services/authoredSpellDefinitions.js:213–225`), is
   unhooked and has execution disabled. A1b stays parked. No fallback to a second executor.

Library/storage trace: `SpellLibraryContext.js:52–103` spreads the submitted record; its379–398 provider
loads/saves through `core/utils/libraryManager.js:35–87`. The separate external-preview save and
`hooks/useUserSpellsPersistence.js:111` reach the generic Firestore owner
`services/firebase/userSpellService.js:49–104`, which spreads the record then sanitizes undefined values;
this is not server combat admission or live durability proof. These storage owners do not reconcile
outer targeting against draft JSON. `prepareSpellForGame` is a separate legacy projection with no live
caller found, not a hidden propagation execution route. Catalogue `areaType` (e.g.
`data/classes/spellguardData.js:595`) is yet another retained shape spelling needing explicit mapping.

These are verified source-path findings, not new browser reproductions or a complete canonical save
round-trip acceptance. A bounded Class-owned targeting-preservation repair needs its own authorization
and exact JSON→outer-save→reopen→template witnesses before these profiles are called authoring-safe.

## 12. Representative authored flows through the proposed targeting boundary

**All additional flows below are planning/manual beyond B1/B2's explicit subset.** Nothing auto-rolls,
charges, selects hidden actors or creates a consequence. Preserve original bytes and show the reason.

1. **Flame Burst Shell:** select a visible exact primary actor at authored90ft reach → advisory delivery
   S→primary → on-impact secondary10-ft circle → GM decides hits/damage/saves. Because propagation is
   non-none, B2 must not call this a supported ordinary single/area cast; a later footprint aid can show
   an explicitly manual impact disc. Moving primary, missed/cancelled shot and primary re-inclusion stay
   unresolved, rather than borrowing direct area-origin G1 to define projectile collision.
2. **Searing Chains versus Glaive Toss:** select first visible actor → show intended jump profile as
   text/manual path. Searing's root3/15ft/0.75 and damage-chain fields disagree with Wizard editing shape;
   Glaive explicitly lists four dice and prioritizes Quarry. Do not apply Wizard20% dummy decay to either.
   A later ordered-ref path preview can expose per-segment distances/reasons, but every hop's selector,
   repeat, LoE, reaction and effect decision must come from that card. No multi-actor payment implied.
3. **Ricochet Toss / Piercing Bolt:** choose the first actor, then a proposed second10ft from first for
   Toss, versus next enemy directly behind for Bolt. Label the second ref's role and advisory segment;
   no universal nearest-target second pick, no invented line width, and no automatic2-AP charge through
   P12A. One caster plus two recipients exceeds current one-command scope; price/partial/atomic handling
   needs P14's exact contract even if the map can draw two lines.
4. **Radiant Burst / Multi Target Missiles:** Burst selects an effect channel then origin+radius10,
   range20; enemy-damage/ally-heal tags conflict with undead/living prose. Multi Target Missiles instead
   selects up to3 independent actors each within120, no previous-hop path; `targetCount:3` is not quietly
   replaced by `maxTargets` default1. B2 may draw Burst's explicit channel footprint, not apply either
   mixed/multi effect. A future list picker must distinguish independent targets from ordered hops.
5. **Trap / Temporal Anchor / Spirit Link:** trap chooses location now, arms later, then identifies
   triggering/nearby recipients; zero-count save conflict is visible. Anchor selects exact actor now and
   retains cast coordinate for a two-round return, not a new nearest recipient. Spirit Link selects two
   labelled endpoints and later routes a fraction of damage/heal, not a projectile chain. None is an
   active object/event just because a marker or segment was drawn. Expiry, consent, identity and invalid
   future state require their separate lifecycle/domain contracts.

## 13. Updated dependency map and smallest coherent sequence

**Existing B1:** exact one-actor selection, advisory centre distance/aim, retained rolls for the supported
controllers. It supplies reusable interaction/identity, not all Wizard selection algorithms.

**Recommended next bounded order (each separately frozen/authorized, not permission from this document):**

1. **Pin the B2 input profile and scoped Class-owned preservation contract**, co-reviewed by Combat:
   exact original definitions with explicit geometry can proceed without converting every legacy mode.
   Before enabling Wizard-authored variants, preserve their zero/sentinels, selected-effect objects and
   conflict evidence across save/reopen/export/template. Other legacy mappings remain explicit manual
   fallbacks; do not build a universal normalizer. Do not change rules, W1 prices or install A1b. This
   authoring boundary can proceed independently of reactions and of the clean-original B2 subset.
2. **B2 static preview** through existing PICK/MAP: explicit circle/cone/line/square parameters, named
   origin/channel and current visible candidates. Initial coherent profile excludes active propagation,
   moving/persistent lifecycle and unresolved dimension mappings; those actions stay manual. Sphere/
   cube plan view remains labelled; all G decisions/manual boundaries still apply. No server executor.
   Omitted propagation needs the frozen profile to establish absence; it is not a universal `none`
   default when secondary recipients exist in another field or the authored text.
3. **Later bounded selection/path aid**, reuse the same session for an explicit role-labelled list or one
   named two-recipient path (Ricochet Toss is a small candidate). Independent-list order and causal hop
   order stay different. This is a proposed follow-on, **not a new named supported mode** or B2 widening.
4. **P13B opportunity support** stays its own Parry/Riposte pilot. A future propagation executor must
   pause at actual eligible initial/intermediate/impact/hit/damage triggers; it must not open a timer for
   each hop by default. Occurrence IDs need branch/hop position so a permitted repeat actor is not
   suppressed as a duplicate. Manual mandatory-trigger events do not depend on a player Pass ritual.
5. **P14 named immediate multi-recipient capability**, one reviewed card at a time: exact recipients/
   segments, retained results, full cost frequency and accepted effects. Choose explicitly between
   sequential commands with partial-outcome reporting and a bounded N-actor extension **where required**.
   Repeated per-target basic-strike commands would charge the wrong price; a drawn chain gives no atomicity.
   Reaction-dependent variants wait for the necessary P13B moments; noninterrupting manual subsets do not
   secretly implement reactions. No generic propagation engine.
6. **Explicit lifecycle follow-ons (FO-E/FO-B/FO-N, privacy FO-P when needed):** moving/trailing zones,
   spreading generations, delayed explosions/returns, compulsory trigger recipients, entity/linked
   routing and domain-specific conservation. Require authoritative spatial/boundary events, expiry,
   restart/unknown recovery and the class package's reviewed requirements. C1/anomaly and CR-L1 prototypes
   do not supply these automatically. Seeking/hidden discovery, recursive forking/convergence and
   wall/object ricochet remain manual until named rules and capabilities are approved.

This inventory is complete as **bounded preparation**, not a promise to automate every mode. Future
acceptance adds per-profile save-parity, per-segment visibility/LoE/manual reasons, duplicate occurrences,
moved/retired recipients and unchanged roll/payment checks to §8; real browser checks follow actual
authorized UI work. No application source, authoring data or published rules were changed here.

## 14. Obstruction-aware aiming — conditional technical boundary

**2026-10-27 implementation update:** the user separately authorized the bounded single-target
advisory milestone. See §16 for its exact sight-only subset, privacy fallback and verification.
The conditional trajectory/cover/server-authority proposals below remain conditional.

**Prepared at the same HEAD on 2026-10-18; not implemented or a new gameplay default.** The creator's
direction is that ordinary aiming must respect real walls/objects. B1 currently offers only an advisory
aim line; B2 is a drawing. Neither establishes authoritative sight, trajectory, cover or area propagation.

### 14.1 Reusable facts and explicit gaps

Client paths are relative to `vtt-react/src/`; server paths are repository-relative.

| Existing source | Reuse / boundary |
|---|---|
| `utils/WallGeometry.js` (`parseWallKey`, `getWallWorldEndpoints`); `utils/WallSpatialIndex.js:26–109` | Square offset-aware and hex endpoint conversion, bounded spatial lookup of actual wall segments. Index is broad-phase only: a bounding-box match is not a collision. Reuse geometry rather than wall artwork |
| `store/levelEditorStore.js:1087–1250` (`WALL_TYPES`); `utils/VisibilityCalculations.js:154–166,347–435` | Separate `blocksLineOfSight` and `blocksMovement`, plus door `state`. Glass/window/force walls demonstrate sight ≠ physical passage. Neither flag is a reviewed per-effect trajectory rule; no `blocksMovement ⇒ blocks every spell` conversion |
| `components/level-editor/objects/ObjectSystem.jsx:70–130`; `levelEditorStore.js` environmental objects | Object definitions/instances carry sight flags, location and visual size/scale/rotation. A decorative asset/name alone supplies no physical collision hull, cover rule or spell-blocking permission |
| `VisibilityCalculations.js:635–666,932–1001` | Sight code supplies fallback blocking by type, an85%-sized rotated display box, or a tile-index approximation; hex LoS takes its wall branch before the object-index branch. These are rendering/sight conventions, not certified attack hulls or proof that an object path is clear |
| `levelEditorStore.js:2410–2463`; `server/handlers/environmentHandlers.js:163–235` | Editor uses coordinate-keyed `{type,state,id}` records; legacy wall handler uses IDs and door handler writes `isOpen`. Do not choose one state silently or assume live parity. Missing/unmapped/conflicting state/identity → unknown; reconcile in a separately authorized map/authority boundary |
| `server/handlers/tokenHandlers.js:297–330`; `server/services/syncService.js:1235–1259` | Moves are queued and installed into map positions without incrementing the P7 actor resource revision in that path. Actor CAS alone cannot detect positional changes. Pending optimistic/coalesced movement is not a settled authoritative position |
| `server/services/actorConsequences.js:247–278`; `server/handlers/actorConsequenceHandlers.js:222–250,382–406` | Existing stage/binder boundary after authority confirmation, reused by direct and adjudicated commands, then synchronous admission/consumption. No current geometry validation is established there; this is the later enforcement seam, not a new execution service |

These are source observations, not runtime regressions or repairs to accepted combat. There is no
certified spatial/door/object revision for attack checks established by these inspected paths.

### 14.2 Four independent diagnostics and feedback states

Keep separate **LoS** (can perceive), **LoE/trajectory** (can this named delivery pass), **partial
hindrance/cover** (an obstacle may interfere), and **area propagation** (what spreads from an origin).
A clear sight ray cannot green-light an arrow through glass or decide a blast behind a wall. A
centre-to-centre aim segment is an advisory probe, not an authored projectile width or cover sampler.

Proposed result per diagnostic: status, explicit reason, sampled source/endpoints, map/policy/profile
identity and evidence freshness. Only entitled visible geometry may influence player feedback.

| Status | Meaning / visible feedback | Permitted effect in the preview |
|---|---|---|
| **Clear in modeled geometry** | No intersection in a complete, known geometry set **for that diagnostic/profile**; solid aim line + text. If only a2D sight segment was checked, say so | Never “legal/hit”; unmodeled LoE/height/cover remain unknown |
| **Blocked** | A known segment/hull intersects and an explicit reviewed profile or GM ruling says it blocks **this delivery**; break/dash at the entitled visible obstruction + text | Display obstruction; no payment or consequence. Incomplete effect mapping is not enough to assert this state |
| **Partially obstructed — GM decides** | Known partial obstacle/partial-path evidence under an explicit model or GM ruling; amber/hatched path + text | No invented AC, bonus, die, miss percentage or automatic damage reduction; no invented projectile width/multi-ray threshold |
| **Unknown — GM decides** | Missing/conflicting identity, property, footprint, units, door state, pending movement, height or unsupported delivery model; dotted path + specific entitled reason | No silent clear/blocked default. A half-wall's visual `heightScale` or prose alone cannot decide whether a shot goes over it |

Confirmed opaque solid wall, open door, closed/locked door, transparent physical barrier and partial
object are separate fixtures. An open door removes only its correctly mapped leaf's obstruction;
frame/adjacent wall/other object checks remain. Closed does not mean every magic effect is blocked.
Transparent does not mean physically passable. Door opening/closing or object movement/removal must
invalidate feedback. Artwork with no blocking metadata is not a blocker; a map whose physical geometry
is uncertified cannot claim a complete clear trajectory merely because that artwork was ignored.

Authored exceptions (through-wall, arcing, seeking, piercing, ricochet) require the exact card/effect
and reviewed delivery profile or recorded GM ruling. Do not infer an exception from damage type or
use the straight segment model for all spells. Chains/bounces/forks may require a check **per segment**;
an enduring link need not be travel at all. The existing §§9–13 inventory remains the source of scope.
Area-origin delivery and spread outward from that origin are separate checks; G2/G6 remain manual.

### 14.3 Freshness, privacy and recorded GM override

- Bind observations to exact source/target refs/incarnations, sampled settled positions, selected
  definition/effect/profile, room/map, grid/scale and relevant wall/door/object/elevation state identity.
  Recompute on movement or geometry/property/state changes, including footprint and visibility;
  invalidate kept confirmation and require fresh confirmation. Pan/zoom only reprojects. Unknown
  hydration/disconnect/map change follows §4. Never reroll or discard recorded evidence.
- Player feedback uses only their entitled geometry; if it cannot prove completeness, it stays unknown.
  Hidden actors/objects/walls must not change player path colour, stop marker, status, DOM/ARIA, count,
  logs or cached labels. Do not show a generic “blocked” result that acts as a hidden-wall oracle.
  GM-only authoritative findings stay scoped; public refusal/narration is neutral where needed.
- **Future override record, conceptual not a P7 schema:** current authenticated GM, original action/
  approval/command identity, exact refs and positions, map/spatial evidence identity, selected delivery
  and diagnostic, original result, ruling and nonblank reason. Server stamps authority/time; never
  trust a player `ignoreWalls` flag. Revalidation after relevant change requires a new ruling, not
  reuse of a blanket override. Keep private geometry/IDs/hashes/reasons out of public receipts; publish
  only an explicitly safe reason/projection. B2 itself sends/stores no shared override or cast.

### 14.4 Later enforcement seam and bounded acceptance

An overlay-only check is bypassable by a dropdown, alternate action bar or direct command. A future
**separate named spatial-validation freeze** must put the check at the existing P7 stage/binder path
used by both `actor_consequence` and `actor_adjudicate`, after authority awaits and immediately before
synchronous admission/approval consumption. Client diagnostics/fingerprints are evidence, not authority.

That freeze must pin a server-readable map geometry/property profile and settled position evidence,
including door representation parity and invalidation across **all relevant map/movement writers**.
Use an explicit spatial revision or canonical relevant-state fingerprint under the existing room
authority/writer; do not pretend actor CAS or a UI cache reference is that version. Any additional await
requires another current authority/spatial check. Missing/stale/partial/unknown evidence stops supported
automatic resolution for GM adjudication; an explicit authorized override is checked and recorded in
the same admission. A known receipt still returns first: never re-test a historical accepted shot
against today's walls, consume twice, change prepared bytes under the same ID, or auto-refund.

Generic direct-GM HP adjustment remains explicitly manual, not a certified unobstructed attack.
Supported action binders cannot omit the spatial check by switching targeting controls or stripping
the client diagnostic. Exact schema/error/bounds/override projection and automatic block policy need
their own freeze; this preparation assigns no server edits, new ledger, A1b route or gameplay penalty.

Future focused witnesses: four statuses with visible-only output; open→closed door and glass vs sight;
partial object/unknown hull; offsets/angled/hex segments without bounding-box false positives; stale
position with unchanged actor revision, geometry change during authority await, visibility loss;
same selection via map/dropdown/direct supported command; recorded override invalidation and private
projection; retained rolls and exact known-receipt recovery. Run production helpers/handlers plus
Playwright only after the corresponding UI/server slice is authorized. No such checks were run here.

## 15. First-slice implementation and verification — 2026-10-18

**§8.1 only, uncommitted.** Original `martyr_radiant_burst`, selected damage **or** healing channel,
authored radius10ft/reach20ft, square grid. Wider preparation in §§3–14 is not a support claim.

- **Entry:** the HUD's existing manual cast confirmation offers a separate channel selector and
  **Preview area** button. It requires the owner's selected exact primary attachment; it does not
  grant GM control over foreign player sources. The sheet's direct manual-notice producer is unchanged.
- **Geometry:** existing AoE mount/store, circle primitive and world/screen transforms; one input
  catcher across B1/B2/free tool. Crosshair, source/origin markers, source→origin line, range ring,
  free-point circle; outside the displayed planar20ft reach cannot be kept. Pointer/touch and keyboard
  input, Keep, Cancel/Esc/right-click, Clear and focus return. No cast, notice, roll or resource path.
- **Membership:** analytic circle/occupied-cell positive overlap, one actor once. Reuse the actual
  movement engine's square footprint mapping **plus verified cell-centred placement/offsets** (not the
  portrait/size-name alone). Unknown sizes, fractional/off-grid placement and gridless/hex membership
  remain explicit manual cases. Candidate marker says **Overlap only**, not eligible/hit/affected.
- **Privacy:** candidate markers and accessible names are children of the actual token render gate
  (`TokenAreaCandidate` through the existing `TokenCombatFloats` mount). No global candidate list/count,
  frozen member cache or retained names/positions. Hidden/FOV token removal removes all its B2 output
  in the same commit. Existing registry timing, receipt arithmetic and HP floats remain as before.
- **Lifetime:** action/effect/entry, owner/account generation, exact source/ref, room/map/grid/scale and
  connection/recovery are bound. Disconnect/loading clears; source/visible geometry movement invalidates
  confirmation. Returning to the former state never revives confirmation; re-keeping is explicit.
- **Manual:** recipient conflict (enemy/ally channels versus undead/living prose), walls/LoE/elevation
  remain visible GM rulings. No wall clipping, obstruction enforcement, propagation, area execution,
  payment, reservations, authored-content change or Wizard repair was added.

### Review and checks

One bounded independent review initially **BLOCK (R1–R7)**, then same-review repair recheck **source
accepted**: cached member data removed; output moved inside token visibility gate; disconnect/current
loading guards; owning-entry/effect lifetime; nested geometry/propagation fingerprint; latched invalidation;
aim connector. The reviewer ran **4 suites /18 tests**, including eight corrected-expectation probes.
Original RED probes remain intact. Evidence outside Git:
`D:/AppData/Temp/opencode/b2-review-probes/`, `b2-independent-review-utf8.log`, `b2-recheck-probes/`.

Implementation checks: affected **9 suites /44 tests PASS** (`areaPreview`, `ActionAreaPreview`,
`SpellCastConfirmationB2`, `acceptedResultFeed`, `targetPick`, `AoETemplates`, HUD/sheet P9 producers,
`manualActionGate`); after the final finite-source-coordinate guard, changed **3 suites /11 tests PASS**
(overlap, not added to44). Same-review final **2 suites /7 tests PASS**; its `act` warning was fixed.
Scoped lint **0 errors /1 incumbent targetingStore unused-state warning**; UI detector `[]`.

**Build1/App6 PASS:** detached direct CRACO production compile through existing `verification/p10/run.cjs
build`, external output only, **no source snapshot or copied evidence asset tree**. Build1 exit0/drift[];
App witness uses actual optimized App, stores/components, authored record and registered room fixture.
Desktop1440 and supported narrow820 layout; free-point/range/channel/source-movement checks, hidden
projection removal, local-only GM/observer isolation, malformed fallback and keep/cancel/focus. **Zero
outbound events**, unchanged source pools/authored definition and receipt count in the successful run.

**Final closure: build3/App7 PASS.** Caption now sits below the incumbent token name; missing/nonfinite
source coordinates fail closed before projection, with an explicit manual fallback at entry. Final
detached compile exit0/drift[] and actual optimized App witness pass with keyboard **and tablet touch**
placement. Desktop/narrow ARIA snapshots and screenshots confirm the caption repair. Three retained
page errors are deliberately refused Firebase `Failed to fetch` requests (one per fixture principal);
no other page-error type observed. These are not relabelled as zero page errors.

| Final identity/evidence (all bulky output outside Git) | SHA-256 / location |
|---|---|
| Current HEAD (uncommitted slice) | `8ba81efbf935e08d4fcd488a9b597f5eb8031b0f` |
| Final build/source-input manifest | `D:/AppData/Temp/opencode/b2-20261018-build3/build.json`; `15bffe321bd22f0fe4052812d93a92f21ab0685b4e03ede375a533630ed35b91` |
| Built asset manifest | `fa3c62c1652a69cb9f888de141e2ef838ebdcc126fa0684db19cb5b4df20c479` |
| Final actual-App result | `D:/AppData/Temp/opencode/b2-20261018-app7/result.json`; `1bd08e47db11b73745edeba34ca37dd04c3a9909cdae8ddb80f0dbda886ff07e` |
| Independent source report / exact9 production-path,3-test and witness hashes | `D:/AppData/Temp/opencode/b2-recheck-probes/review.md`; `ce96b092078f5c9cb7c80a1c0a01b8f11464c1ee23847392739ba092e021313d` |

The independent source report truthfully says final build3/App were pending **at its writing**; the
later execution above closes those local gates for those reviewed bytes. Review1–7/component FOV
removal evidence and actual-App hidden-projection evidence remain distinct. A1a/W1a/W1b protected
hashes rechecked unchanged; `martyrData.js` has no Git diff. Retained P11/P12/rejoin acceptance was
reused; only affected producers/geometry/feed received focused regression checks.

Build1/App6: `D:/AppData/Temp/opencode/b2-20261018-build1/`, `b2-20261018-app6/`. Earlier witness attempts
are retained externally: fixture hide-flag projection, extra transform `depth` field, precise locator and
phone-grid gate assumptions were corrected in the witness without changing gameplay source/assertions.

### Remaining limits

The preview is local/transient, cleared on reload or owning-entry retirement, and certifies no legal
recipient/consequence. It is deliberately strict about exact original authored bytes; altered/malformed
copies receive a specific manual fallback. Only known square movement footprints are modeled. Physical
second-device, human-table, live Firebase/rules/hide-control transport, deployment and restart durability
are not closed. The retained App fixture seeds hidden flags in the viewer projection (as P13A did);
server hide-control propagation is not established by that witness. The incumbent App gates the tactical
grid off at phone widths;820px is the supported narrow verification surface. A1b remains parked; Class
HeadQ keeps all zero-range/count/export semantics and preservation work. No commit, push or deployment.

## 16. Obstruction-aware single-target advisory milestone — 2026-10-27

**User-authorized implementation; advisory only. Scoped Build5 / production-App8 PASS.** This is a
bounded extension of B1, not a restart of §§9–14's inventory or a new executor. Full-current build
parity is not claimed; the exact concurrent-input boundary is recorded below.

### Working behavior and exact supported semantics

- Existing P8/P9/P12A map entry opens the same picker. Hover previews; tapping/clicking a token pins
  its exact ref. A native **Preview target** selector supports keyboard and touch inspection. **Use
  target** returns the ref to the existing controller; Cancel/Esc/right-click return without a pick.
  The status remains available before confirmation on touch. No roll/payment/consequence path is added.
  The selector consumes its keydown propagation so the map's global arrow-panning shortcut cannot
  steal native option navigation; capture-phase Esc still cancels. Account/room/map changes and the
  existing bootstrap privacy isolation retire the pick rather than displaying a prior viewer's preview.
- `services/aimObstruction.js` exports the reusable read-only query and analytic segment narrow phase.
  Its diagnostic is **planar-centre-sight**, not trajectory. Same-map exact refs and finite world
  coordinates are required. `WallGeometry.parseWallKey/getWallWorldEndpoints` supplies square offset-aware
  and stored/legacy hex endpoints. Pan/zoom only reprojects. Token position, wall/object replacement,
  door state, grid/offset and GM/token-view changes recompute; no geometry result is persisted or cached.
- **Clear:** no intersection in known modeled 2D sight geometry. **Blocked:** a strict crossing of a
  wall with explicit `WALL_TYPES.blocksLineOfSight:true`, or interior overlap with an object explicitly
  configured `blocksLineOfSight:true`. The object shape is precisely the existing visibility model:
  width/height in grid units (default1), scale(default1), world centre or grid-cell centre, rotation
  in degrees(default0),85%-inset rectangle. This is never a physical attack hull.
- Sight-false walls/objects are ignored for **sight only**. Glass/force walls do not thereby allow a
  projectile. No asset/type fallback marks trees, crates or images as attack blockers. Object type
  definitions are consulted only to detect interactive/manual objects, not to invent sight flags.
- Editor wall doors accept only explicit `state:'open'|'closed'|'locked'`. Open removes that segment's
  sight obstruction, not neighboring walls/objects. Legacy `isOpen`, missing/conflicting state,
  intersected overlay-window mappings, unknown wall IDs/types/geometry, unconfigured/interactive
  objects and malformed dimensions stay **unknown**. Tangency, endpoint contact, collinear overlap
  and coincident source/target stay unknown; no boundary contact is promoted to a hit.
- **Partial:** no settled partial obstruction/cover model exists. Such cases remain **unknown — GM
  decides**, never a sampled percentage or fabricated bonus. All attack passage, cover, height,
  footprint-edge origins and propagation remain unknown/manual. Large tokens use the explicitly
  labelled centre diagnostic; area occupied-cell inclusion rules do not become attack origin rules.
- Existing `planarFeet/rangeText` remains separate and unchanged. A sight finding never disables
  selection. “Advisory only; not enforced” is always visible. This does not certify a legal attack.

### Privacy delta and authority boundary

The existing B1 rendered-token registry plus current explicit hidden flags gate token output.
Hidden targets are excluded from selector/rings/hit testing; pinned state contains only an exact-ref
key, not a captured name or position. Missing/deleted/rebound/invisible selections cannot be confirmed.

Wall/object renderers use FOV/exploration/fog and door/attachment-specific rendering; the replicated
editor collections are **not** a certified player-entitled geometry set. No complete per-viewer
geometry projection is currently supplied to B1. Therefore players and the GM's restricted token
view receive one identical unknown message regardless of wall/object contents. The query returns
before inspecting geometry; the picker does not subscribe those viewers to geometry. There are no
obstacle IDs, counts, stop markers, hidden reasons or result caches. Unrestricted existing GM mode
uses the authorized full-map view; it is a local advisory diagnostic, not a new authority claim.

### One focused creator proposal / future staging boundary

Approve **one versioned named-delivery spatial profile and its viewer-safe geometry projection** as
the next freeze: explicit projectile/sight/other delivery distinction, certified geometry completeness,
door/interactive-object identity-state parity, attack hull/height/contact/footprint meaning and
per-viewer disclosure policy. This single contract must precede player clear/blocked trajectory
feedback or authoritative validation. No trajectory property has been silently added to saves.

Delivery-order B's prerequisite is **not met**: current authored single-target/LoS/range fields and
approved decisions do not establish an authoritative obstruction profile. Consequently no exact
enforcement DTO or automatic refusal policy is invented here. The smallest later server contract
remains §14.4: original known-receipt recovery first; existing P7 stage/binder after authority awaits,
before synchronous admission/payment/approval consumption; server-owned exact refs/settled positions,
map/geometry revision or canonical relevant-state identity, selected admitted definition/effect/profile;
recheck after any await; authenticated GM ruling bound to that exact evidence and reason, invalidated
on change; private geometry kept out of public receipts/refusals. The client diagnostic is never proof.
Actor resource revision alone does not version movement. No server/payment/consequence file is edited.

### Owned paths and verification

Runtime: `src/services/aimObstruction.js`, `src/components/grid/TargetPickOverlay.jsx` and `.css`.
Checks: `src/services/__tests__/aimObstruction.test.js`, existing `targetPick.test.js`;
production witness `verification/p12/obstruction-app-browser.cjs`. Paths are relative to `vtt-react`.
Coordination reservation preceded edits; implementation was prepared/tested in an external isolated
worktree snapshot at86996e8d, then transferred only after the live overlay baseline was rechecked.
The worktree checkout timed out copying historical bulky evidence; its Git index is not a delivery
artifact and was not reset. Live unrelated A10/Class/character work is preserved.

Focused checks:2 suites/10 tests PASS; scoped ESLint PASS; UI mechanical detector `[]`.
Production build1/2/App3 and expanded App6 passed their recorded subsets. The actual ArrowDown check
exposed the map shortcut conflict; App6 used the selector API only to finish the other checks on old
build2 and is **not keyboard acceptance**. Build3 was cancelled after this finding. Full-current
Build4 failed on then-concurrent `ClassDetailDisplay.jsx` importing an unavailable `hasClassPixelArt`;
the other owner's files were preserved. No independent review or historical combat
reacceptance is claimed by these implementer-run checks.

**Final production gate, 19:26Z:** scoped **Build5 exit0**, `mirrorDrift:[]`, scoped-source drift `[]`;
**App8 PASS** on the actual optimized App/picker/controllers, not a replacement component bundle.
Build5 uses successful frozen Build2 inputs plus only the four final owned runtime/test files. It
retains production CRACO/config/dependencies; the existing P12 snapshot runner's frontend location
alone is redirected to the coherent external source. `scope.json` and the final seal verify all four
live owned files equal the built inputs. Other concurrent character/Class/A10 inputs are enumerated
in the seal's `currentInputDrift/currentAddedInputs`, not silently accepted or overwritten.
External HEAD advanced `86996e8d`→`89cddc2b` during concurrent work, including some intermediate owned
bytes. This session made no commit/index staging/push/reset. Final delivery identity is the live/built
hash set in the seal, not HEAD alone; final selector/witness deltas remain in the working tree.

| Focused production-App witness | Final result |
|---|---|
| Clear modeled sight; supported stone wall; explicit configured rotated object | PASS; independent advisory sight text and line style |
| Source and target movement; wall replacement; object sight-property edit | PASS; same pinned exact target, current geometry |
| Pan/zoom | PASS; line reprojects, sight result unchanged |
| Editor door open→closed; legacy `isOpen`; interactive object without settled state | PASS clear→blocked→unknown/manual as applicable |
| Actual native ArrowDown/Tab; touch-token pin and touch Use target | PASS on1440px desktop /820px tablet; no map shortcut theft |
| Player hidden-wall/object/overlay additions; explicit hidden token; GM-view downgrade | PASS; identical player status/ray/markup for geometry changes, no secret token label; no prior GM result retained |
| Esc/right-click cancellation and exact retarget to primary PC | PASS; original physical `[2,4]` remains; no reroll control |
| Preview consequence, payment and HP | PASS; no outbound consequence/proposal/adjudication/approval/payment, canonical AP/mana/HP/receipts unchanged |

External evidence (not Git):

- `D:/AppData/Temp/opencode/obstruction-build5/{scope.json,build.json,build.log}`;
  scoped source launcher `obstruction-scoped-build.cjs`, final source `obstruction-final-source/`.
- `D:/AppData/Temp/opencode/obstruction-app8/result.json`, `clear/wall/unknown/player-neutral.aria.yml`,
  `wall-desktop.png`, `tablet.png`; witness SHA256
  `ab73c2e467617b565702e37384bbebcfb5bd8c627846a3864dd8aa4748bffda3`.
- `D:/AppData/Temp/opencode/obstruction-final-seal.json` and `obstruction-seal.cjs` verify final
  source/test/witness/build identity and enumerate concurrent input drift. Asset manifest SHA256
  `98626c86901767a0e7251c52d7e46548071d375474e43027d229321bb3653a98`.

The source/privacy delta review is bounded to this query, picker, visibility consumers and focused
witness: the player gate precedes geometry reads; no new geometry/result storage or outbound route;
only visible current refs can reach selection; attack/cover/partial semantics are not inferred.
The analytic rectangle check also covers vertex-to-vertex crossings (initial endpoint-only contact
classification was corrected to interval/interior testing). Tangent/collinear/offset/hex/malformed
cases and no-read player Proxy check are in the focused helper tests.

Fixture limits: provider login, owner documents, lease/cloud transport are simulated; two retained
`Failed to fetch` browser errors arise under the fixture's blocked provider requests. GM geometry edits
and movement are local production-store projection fixtures, not acceptance of every multiplayer
geometry writer. Background App inventory/window/list/snapshot events are recorded; the preview emits
no consequence or payment and changes no canonical resources. Live Firebase/rules, physical devices,
human-table and deployment are not certified. Phone-width grid access remains the incumbent App's
separate limitation. No commit, push, deployment, migration or other-owner production edits.

Re-run the focused checks from `vtt-react`:

```powershell
node node_modules/react-scripts/scripts/test.js --watchAll=false --runInBand --runTestsByPath src/services/__tests__/aimObstruction.test.js src/services/__tests__/targetPick.test.js
# Use the existing detached production-build runner, then point these at external paths:
$env:APP_BUILD_DIR = 'D:\AppData\Temp\opencode\obstruction-build5\build'
$env:OBSTRUCTION_OUTPUT = 'D:\AppData\Temp\opencode\obstruction-app-replay'
node verification/p12/obstruction-app-browser.cjs
```
