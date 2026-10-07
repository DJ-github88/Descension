# Mythrill — Canon Implementation Status

**Reviewed:** 2026-10-02

**Target:** `LORE_CANON_AND_HERITAGE_BLUEPRINT.md`

**State:** Implementation in progress. Coverage below is file/section-specific; it does not certify the entire repository reconciled.

## First foundational pass

| Surface | Implemented coverage |
|---|---|
| `docs/CORE_LORE_FRAMEWORK.md` | Living Cosmos, celestial family, bounded Wyrd provenance, public houses and living obligations, distinct Viridane/Unwritten, Counterfeit authorship, era order, layered class provenance and ancestry origin baselines |
| `docs/GM_WORLD_GUIDE.md` | Authority notice and Part I cosmological primer; later regional/ancestry/class chapters still require reconciliation |
| `SEVEN_CONTINENTS_MASTER_REFERENCE.md` | Authority notice, cosmology quick-reference, selected census rows, and Skreika/Glacier Wyrm distinction; full atlas details still require reconciliation |
| `vtt-react/public/data/lore.json` | Core entity, Wyrd, house, seal, and shard entries; retained historical `natural_wyrd` ID with explicit retired-theory framing; existing IDs and related-term lists preserved |
| `vtt-react/public/data/rules.json` | Introduction, cosmic history, current-world opening, Monolith chapter, Wyrd description, and launch-region labels; remaining regional/ancestry/class sections are pending |
| `vtt-react/src/store/deityStore.js` | Corrected celestial/native/cult default records. Retained `deity-unknown-dominator` as an attributed doctrine record and all existing IDs |
| `vtt-react/src/store/timelineStore.js` | Core era/calendar descriptions, entombment/cracking/infiltration/Purge/eruption history, Viridane refusal, First Contract, and a distinct `event-blind-strike`; corrected the core causal chain without renaming old event IDs |
| `vtt-react/src/components/rules/TimelineDisplay.jsx` | Fallback era labels derive from current chronology rather than an independent hardcoded canon table |
| `vtt-react/src/data/versions.js` | Initial foundational revision `2.1.1`; the ancestry pass below publishes `2.1.2` |

### Persistence behavior

`mergeSeededRecords` refreshes untouched default deity fields during local and cloud hydration.
Records marked `isCustom`, `createdAt`, or `updatedAt`, and records scoped to another world, retain
their campaign content. Additional metadata is retained on refreshed defaults. Explicit removed
seed IDs remain removed, including when a stale cloud/default record is present. Unknown custom IDs
remain intact. The store's existing edit action marks campaign edits `isCustom` and `updatedAt`.

Timeline numeric dates remain compatibility/sort fields. Core event prose uses era/phase labels;
the later historical/class records still need the full chronology and founder pass.

## Verification

- Lexicon check: **436 entries**, **2,517 related-term references**, **zero ID mismatches or broken references**.
- The lexicon verifier now returns a failing exit code on invalid IDs/references.
- **8 helper tests** cover refreshed defaults, edit markers, other worlds, removals, metadata retention, idempotence, and missing storage.
- **4 store integration tests** cover local rehydration, cloud hydration/removal union, core causal order and reciprocal links, and custom-world timeline isolation.
- Deity/timeline JavaScript syntax checked as ES modules; Git whitespace checks passed.
- Playwright on the running development app: final cache revision loads the new primer; clicking
  its Sol link opens the corrected lexicon entry; the timeline renders the distinct Blind Strike
  and pre-Star-Fall First Contract; GM-note toggling and era collapse work. No browser console errors.
  Existing Deepling specialization/placeholder-session warnings remain outside this pass.
- During editing, an intermediate revision had cached earlier JSON. The final `2.1.1` publication
  and reload were checked against the actual rendered primer, not just a direct JSON fetch.

These checks do not prove that every prose reference or proposed heritage effect is implemented.

## Ancestry inheritance pass

**Implemented:**

- `raceData.js` filters heritage-scoped traits by the resolved legacy subrace ID after normal
  merging/deduplication. Unscoped/custom traits retain the previous behavior.
- Withered (`drun_neth`) no longer inherit Contractual Lock, pact Stillness/preservation,
  Archive-Tether, Returned Count, or Fraying. They retain their own traits and active Null-Strike,
  with finite lifespan metadata, ordinary bodily needs, and no blanket magical-save advantage.
- Nethien/Veldun keep the pact traits. The old three-breach Charisma/Fading definition is removed;
  Contractual Lock references the one `the_unraveling` ten-step descriptor. Its benefits reference
  real effect IDs, recovery requires substantive obligations, and distance failure is separately
  described with no breach reset or double symptom stacking.
- `combinedTraits.mechanics` contains heritage-qualified mechanics. Race-only mechanic queries
  remain available for overviews; character consumers must supply a resolved heritage ID.
- Arch Mimir receive lineage-mask dependence/protection, without the Broken Mote. Broken Mimir
  receive their Mote and own abilities, without inherited maskless penalties or mask dependence.
  Mask loss is scoped to mask-dependent racial benefits, not every class spell.
- Mimir/Nethien ancestry descriptions and their affected Codex/lexicon entries are reconciled.
  Existing art files, legacy IDs, and the user's visual edits are retained where compatible;
  Withered stolen-soul doctrine is replaced by deliberate severance and limited jurisdiction.
- Creation uses the shared `getRacialLanguages` resolver: heritage override, heritage base traits,
  race base traits, then Common. Empty overrides are respected; unfinished drafts receive base
  grants. Stable race/subrace dependencies prevent repeated effects for adapted custom lineages.
- This pass published rules/lore cache revision **`2.1.2`**; the later pass below publishes `2.1.3`.

**Verified:** 743 checks across existing ancestry schema/integration suites and the creation-step
render tests passed. They cover legacy aliases, passive/spell consumers, retained active abilities,
scoped mechanics, language fallback/overrides, heritage changes, and stable custom-lineage renders.
The 436-entry / 2,517-reference lexicon check remains clean. Playwright confirmed revised Mimir
and Nethien Codex tabs and the Mimir lore popup after cache reload, with no console errors.

**Scope:** Trait selection and creation-language state are executable fixes. Fraying remains a
declarative rule/eligibility descriptor; automatic counter advancement, timers, symptom application,
and Severing character migration are not implemented by this pass. Remaining race biographies,
secondary lore/art briefs, and the broader language qualification system still need reconciliation.

## Remaining ancestry core pass

Core origin/anatomy/history copy was reconciled in `solari`, `florae`, `vreken`, `fexrick`,
`groven`, `human`, `myrathil`, and `astril` race modules, plus seven affected Codex chapters
and eight principal lexicon entries. This is core coverage, not a declaration that every
biography, regional entry, class reference or art brief has been reconciled.

- Solari: human Solvarn antecedents, celestial infusion, conscious Sol and bounded thermal
  impressions; ordinary flesh/black eyes and no forge-flame metabolism are retained.
- Florae: Oken nursery growth versus Viridian biological birth is heritage-specific metadata
  returned by `getFullRaceData`. Permanent barbs, ordinary pruning and disguise are distinguished.
  Existing Dexterity/Wisdom modifier values are preserved as Agility/Spirit, fixing previously
  skipped bonuses in the six-stat modifier path.
- Vreken: native elven antecedents, pre-Star-Fall First Contract chronology and later hostile
  exposure are distinct. Clean no longer inherit the Marked-only shared fungal-hush vulnerability.
  Existing Marked risks and Clean benefits remain; inherited strains are not moral merit badges.
- Fexric/Groven: Thrumm preceded Fexric settlement; engineering harnesses Vurath. Groven experiments,
  liberation, Still-Claiming and reclamation are distinct events. Source sizes and compatible user
  silhouettes/art assets remain. **Sumpborn** are defined as distinct nonplayable created-people
  metadata, without adding a race selection or renaming the `fexrick` player key.
- Humans: five current cultures, public Ordan communities versus concealed noble remnants,
  limited Tessen contacts and separate Viridane/Unwritten histories. The old Ordan display alias
  still resolves to the same saved heritage ID. Bayarmaa's Ordan Khan title is distinguished from
  an intact original seal.
- Myrathil: viable pre-Star-Fall spawnings, later population boom, growing young, chosen kin,
  air/water breathing metadata and buoyancy rather than literal zero gravity.
- Astril: organic bodies/slit pupils, dormant Selunis interpreted through signs, fallible Keth,
  carried charts/internal resonance under a starless sky, and institution-specific ideology.
- Language grant compatibility: Astril default to **Wayfarer's Cant/Echo-Song**; legacy **Lumian**
  and prior-canon names map to their current canon tongues in shared grant reads and edited creation
  drafts, deduplicating equivalent knowledge (see `LANGUAGE_ALIASES`). Untouched saved characters are
  not bulk rewritten. The nine world tongues are registers/scripts/ciphers of parent tongues, not
  independent proficiencies. Broader language qualification remains pending.

**Verified:** 751 checks across three ancestry/schema/creation suites pass. They include applied
Florae stat totals, reproduction inheritance, Clean/Marked passive selection, unchanged playable
census, old Ordan aliases, Myrathil metadata and legacy Astril draft language preservation.
All 436 lexicon IDs / 2,517 related-term references remain valid; source syntax and whitespace
checks pass. Isolated Playwright browser checks captured Solari, Florae, Astril and Fexric Codex
tabs, plus expanded Solari lexicon content, with no errors. Rules/lore publication is **`2.1.3`**.

## Class heritage registry and provenance pass

`src/data/classHeritageRegistry.js` now owns **21 class profiles, 25 heritage rows and exactly
132 normal trained native/adopted relationships**. Forward class views derive from the single
authored inverse map. Profiles separate power source, individual acquisition, first discovery,
institution founding, founder state and current institution. The Tradition tab consumes them.

- `isClassCompatible` and `validateCharacterSelection` use the same registry. Race-only filtering
  uses actual parent membership rather than a prefix assumption that fails for `thalren_human`
  and other suffix-style legacy IDs. `getFullRaceData` exposes derived `normalClassPaths`.
- Qualified outsider access requires a verified, sourced record covering the class's actual
  acquisition requirements. A generic approval flag or incomplete/stringified requirements
  cannot substitute. Supplied incompatible current body/interface states take precedence.
- Arcanoneer interfaces distinguish First Contract from engineering/stellar routes. Skald
  Martyrs default to the Ironclad method; Witness requires additional actual training.
- Class metadata wrappers overlay current restrictions without mutating original mechanics or
  custom class data. Legacy existing-character validation supports acquisition warnings rather
  than silently changing saved classes. No bulk character migration is performed.
- Three Deepling keys remain narrow compatibility lookup aliases. Base metadata, class display
  catalog, creation choices and next/previous navigation enumerate 21 classes. New default
  class-lore generation skips aliases; existing world/user records are preserved.

**Verified:** the registry matches both independently authored blueprint §6 forward tables and
§7 inverse rows. Compatibility and validation agree on all **525** canonical class/heritage
combinations. The targeted registry, ancestry integration and creation render suites pass;
isolated Playwright checks show canonical Arcanoneer, Martyr and Harbinger Tradition panels,
Skald Ironclad and the corrected base-class navigation with no console errors.

**Scope:** Access and common provenance are implemented. Per-heritage numerical edges/costs,
detailed receiving-branch narratives, qualified-route evidence authoring/persistence in the wizard,
and live character-state adapters are still pending. The UI explicitly labels heritage effects
as pending. Individual legacy class templates, secondary history/atlas/origin consumers and
stored class-lore prose still need the comprehensive reconciliation sweep.

## Gambit and Martyr resource-contract pass

`src/data/classResourceContracts.js` now supplies shared caps, normalization, transitions and
spell payment planning for these two engines. The existing `fortunePoints` and `devotionGauge`
engine IDs remain. Character loading, stat/max refresh, resource actions, bars, spell confirmation,
the sheet action bar and the HUD action bar consume the contracts.

- **Gambit:** Fortune is **0–7**, independent of Charisma; Karmic Debt is **0–13**. Debt writes
  mirror the legacy `risk` field, and existing Fortune/Debt aliases and additional save metadata
  are retained. Debt spending/gains operate on Debt rather than accidentally consuming Fortune.
- **Martyr:** available Devotion is **0–6 levels**, with separate cumulative eligible damage and
  `earnedLevels`, `spentLevels`, and `bonusLevels`. Thresholds are **10/20/40/60/80/100 damage**.
  The source's **Model A** worked example governs: 62 damage earns four levels; spending two
  leaves two available and keeps 62 damage. At 73 damage two remain; at 84 damage three are
  available. Explicit level grants restore spent levels or add bounded bonuses without inventing
  damage. Direct manual tier controls establish a fresh ledger at the selected tier's threshold.
- Confirmed legacy raw damage gauges (`max > 6`, without a separate level/damage ledger) convert
  on consumption/loading. Already-spent levels are inferred and retained. Normalization creates
  a new resource object, preserves unrelated metadata, and retains the existing 150-damage overflow
  capacity; overflow is not 150 spendable Devotion levels or hidden over-cap bonus levels.
- Shared casting resolves generic/nested and dedicated Devotion encodings once, respects explicit
  zero costs, checks the owning resource and integer availability, handles all-in costs, and rejects
  malformed costs. Duplicate generic/dedicated costs no longer charge twice. Fixed nested gains
  and dedicated Devotion requirements/gains are handled by the same payment plan.
- Resource guides and max previews use the corrected units. Martyr's drawer distinguishes earned,
  spent, bonus and available levels and uses the next **earned** damage threshold. Managed rules-page
  previews own isolated state, fixing previously inert Gambit controls without changing active
  character resources.

**Verified:** **52 tests across nine suites** pass: contracts/store transitions, both mounted bars,
confirmation affordability, actual sheet/HUD single-spend casting, action assignment, rules preview
rendering and guide normalization. A mounted Martyr/store callback regression preserves two spent
levels at 72 damage and adds one available level at 82. Isolated Playwright checks verify Fortune
saturation at seven, Debt saturation at thirteen and independent decrement, Martyr tier selection,
damage crossings at 80/100, and the existing overflow clamp with six available seals. Browser page
and console error counts are zero. Shared-contract syntax and scoped Git whitespace checks pass.

**Scope:** This implements units, ledger transitions and payment paths. Automatic eligible-damage
classification, decay, aura/passive application, Gambit backlash/collapse and full spell-price
balancing remain pending. Legacy Gambit spells priced above seven still need the deliberate spell
reconciliation pass. The remaining class resource contracts and numerical heritage effects are
not certified by these checks.

## Arcanoneer and Minstrel bank-contract pass

`src/data/classResourceBanks.js` owns shared bank constants, normalization, typed transitions and
spell payment planning. `classResourceContracts.js` routes these bank plans alongside the existing
Gambit/Martyr contracts. The saved `elementalSpheres` and `musicalNotes` IDs remain.

- **Arcanoneer:** eight canonical categories, **four d8 results**, and a **twelve-sphere bank**.
  Known legacy sphere aliases resolve before availability/payment. Unknown sphere IDs are retained
  in `unrecognizedSpheres` metadata rather than counted as spendable canonical categories. Live
  `current` derives from the capped bank. The old extra-die/fifteen-bank specialization claims are
  retired from current tracker copy; additional specialization effects require separate handling.
- **Minstrel:** seven pitches **I–VII**, **five per pitch**, **35 total**. Initialization now uses
  seven zero counts and a 35 maximum rather than seven total notes. Loading, refresh and store
  writes normalize arrays and derive `current` from their sum. Compatible old numeral lists and
  partial count arrays normalize without mutating the saved source object; unrelated metadata stays.
- Structured `musicalCombo.generates` and `requires`, cadence maps, and signed `note_*` values
  govern typed note generation/payment. They override duplicate or inaccurate generic summaries.
  Opening Chord generates **I×2 + V×1**; a bank containing enough total notes but the wrong pitches
  cannot finance a cadence. Gains cannot pay a requirement in the same cast.
- Formulation element arrays, explicit sphere costs and flattened recipe encodings use one
  precedence order instead of being concatenated and charged twice. Malformed requirements and
  foreign banks fail before AP/mana deductions. Untyped generic gains do not invent pitches or
  elements; aggregate-only legacy costs spend existing bank entries in stored sphere / I–VII order.
- Sheet and HUD casting, the shared confirmation modal and managed guide previews consume the
  same plans. Confirmation lists individual pitch requirements. Direct Minstrel Resolve controls
  spend the authored recipe once; they remain note tracking, not automatic spell-effect execution.
- Arcanoneer roll animation commits against the latest bank, preserving intervening spends rather
  than restoring old spheres. Showcase formulation spending only changes the isolated preview bank.
  Guide copy distinguishes implemented bank behavior from manually tracked lifecycle rules.

**Verified:** **85 tests across twelve suites** pass, including prior Gambit/Martyr regressions,
bank initialization/refresh/store actions, all eight sphere categories, legacy alias normalization,
source-authored builder/resolver recipes, actual sheet/HUD payments and rejection, mounted cadence
controls, delayed-roll state updates, and preview isolation. Isolated Playwright checks verify eight
Arcanoneer categories and 4→8→12 generation with overflow blocked; all seven Minstrel pitches cap
at five (35 total), and Perfect Cadence spends I×2/IV×1/V×1 to leave **31 notes**. Page/console
errors are zero. Shared bank syntax and scoped whitespace checks pass.

**Scope:** Automatic own-turn roll scheduling/usage limits, combat-end clearing, out-of-combat note
decay, instrument/spec/passive/aura effects and comprehensive spell-card/prose balancing remain
pending. Numerical effects are not inferred from description text. Apex and Pyrofiend coverage
is extended below; Shaper, Spellguard and Inquisitor coverage follow those passes.

## Apex pack-outcome contract pass

`src/data/apexResourceContract.js` owns the **five-Mark bank**, normalization and a persisted
`apexGeneration` ledger. Initialization, loading, max refresh, store updates, bars and shared
spell payment use it. The saved `quarryMarksCompanion` engine ID, old Mark aliases and unrelated
metadata are retained without modifying the source save object.

- The resolved-outcome API accepts coordinated strikes **+2**, companion hits/damage **+1**,
  companion critical hits **+2**, and pack quarry designation **+1**. Solo hits are ineligible.
  Receipts require a stable ID and current own-turn window; duplicate IDs, stale windows,
  different companions and mismatched coordinated-strike quarry references are rejected.
- Generation is capped at **three per own-turn window**, or **four for Beastmaster**. Spending
  and manual Mark corrections do not refund this budget. Bank overflow consumes the eligible
  generation allowance but is lost, so later spending cannot unlock a hidden reserve.
- `recordApexPackEvent` and `beginApexOwnTurn` expose executable store transitions. The Codex
  provides reported-outcome controls and an explicit **Begin next own turn** action. Advancing
  a round field does not reset the ledger. Ordinary `gainClassResource` calls cannot bypass the
  outcome API by awarding an arbitrary number of Marks.
- Optional `companionTokenId` binding reads the linked creature token's live HP/dead/incapacitated
  state. Missing or unavailable linked tokens cannot generate, and reported availability cannot
  override them. Unlinked manual tracking uses explicit reported availability. The old HUD
  `companionHP` cache remains compatible and is not treated as canvas authority.
- Casting a solo attack or command no longer awards Marks before resolution. The shared spell
  plan handles Mark costs and defers cast-only gains. Apex spell metadata archives the old gift
  as `legacyCastMarkGain` and marks its timing `resolved_pack_outcome`, retaining IDs and authored
  mechanics. Selected overview/guide/example references now distinguish pack outcomes, manual
  corrections and own-turn windows rather than promising Marks for each solo glaive hit.
- The expanded Codex is clamped to the viewport and scrollable, fixing controls that previously
  opened below the visible browser area. Managed rules previews keep these transitions local.

**Verified:** **115 tests across fourteen suites** pass, including the prior resource contracts.
Checks cover all five sources, both generation caps, receipt deduplication, stale/different
companion/target rejection, live token vitality, overflow without reserve, spending without budget
refund, legacy normalization, actual sheet/HUD solo casting and sheet spending, and mounted Codex
controls. Isolated Playwright verifies outcome entry, exhausted budget after spending, new own-turn
windows, full-bank overflow, unavailable-companion gating, and independent manual corrections.
The Codex stays inside a **420×700** viewport; page/console errors are zero. Contract syntax and
scoped whitespace checks pass.

**Scope:** Outcomes and own-turn boundaries are explicitly reported. Automatic hit/damage detection,
owner-token/combat-turn binding, companion commands/effects, decay, Primal Outrage, Bond Sickness,
and comprehensive specialization/spell prose balancing remain pending. This pass does not certify
those mechanisms as automatic. The Pyrofiend and Shaper passes follow below; Spellguard and
Inquisitor remain the next resource contracts.

## Pyrofiend Veil and Debt Call pass

`src/data/pyrofiendResourceContract.js` owns **Veil 0–9**, derived **Ring 0=0 / I=1–3 /
II=4–6 / III=7–9**, and a persistent `debtCall` record. The saved `infernoVeil` engine ID,
legacy level aliases and unrelated metadata remain. Initialization, loading, stat/max refresh,
store updates and casting share the contract.

- Reaching nine **latches three own turns once**. Cooling to any lower Veil, ordinary reset,
  short/long rest, reload, stat refresh and a subsequent return to nine neither clear nor extend
  the call. Ordinary debt-field updates cannot restore elapsed turns or remove processed receipts.
  Recorded receipts also recover elapsed turns from a partial/stale saved counter rather than
  granting time back; duplicate IDs are counted once.
- `advancePyroOwnTurn` consumes distinct reported own-turn IDs idempotently: **3→2→1→0**.
  The third marks the call **expired / terminal consequence due**. Replayed IDs and further
  updates cannot advance or restart an expired call. The counter is independent of current Veil.
- Shared spell planning checks the **pre-cast minimum even when the spell ascends**; raising
  Veil cannot finance its own entry requirement. Dedicated/nested/generic encodings use one
  transition and preserve explicit zero fields. A spell that both rises and cools observes the
  peak first, so a temporary nine still latches the call. Dedicated cooling can clamp to zero.
- Sheet and HUD casting apply the call record then the resulting level once. The modal shows
  the actual transition and surviving countdown. An expired call blocks casting before ordinary
  AP/mana deductions while its terminal consequence awaits resolution.
- The real generic short-rest routine was **raising Veil**, which could accidentally call the
  debt during rest. It now cools Pyrofiend to zero while retaining the call; long-rest reset also
  retains it. The same routine's free Apex Mark recovery is disabled because it bypassed the
  reported pack-outcome contract.
- The controlled bar shows Rings and the latched/expired clock, and exposes **Record next own
  turn**. Controls remain inside narrow viewports. Selected guide/core-rule/level-nine references
  no longer describe descent as a way to cancel an already called debt; damage and passive rules
  are distinguished from what the tracker executes.

**Verified:** **146 tests across sixteen suites** pass, including earlier contracts. New checks
cover Ring boundaries, preserved aliases/save objects, latch/cooling/repeated-nine behavior,
receipt deduplication, monotonic expiry, actual short/long rest paths, reload/reset, real authored
minimum-plus-ascension spells, duplicate payment, temporary peak nine, zero fields, malformed
transitions, foreign ownership, actual sheet/HUD casting and mounted countdown controls. Browser
checks verify 9→cooled 0 with the call intact, repeated nine without restart, reported 3→2→1→0
expiry at Veil zero, disabled further ticking, and a bounded **420×700** control menu. Page/console
errors are zero. Contract syntax and scoped whitespace checks pass; the final label cleanup also
passes its focused render suites and browser recheck.

**Scope:** Own-turn boundaries are explicitly reported; automatic combat-owner turn binding remains
pending. Expiry records the terminal deadline and casting gate. Detonation damage, character-death
resolution, resurrection restrictions, Whisper/Surge, vulnerability/healing effects, out-of-combat
decay and specialization/heritage modifiers are not certified as automatically executed here.

## Shaper Flux and Body Toll pass

`src/data/shaperResourceContract.js` owns **Flux 0–20** and **Body Toll 0–10**. The saved
`kineticFluxBodyToll` engine ID remains. Initialization, loading, refresh, store actions, both
casting paths, confirmation and managed previews use the same pool transitions.

- `current`, `flux` and legacy `momentum` mirror Flux; `bodyToll`, `toll` and legacy `flourish`
  mirror strain. Known scalar/nested legacy shapes and additional metadata are retained. On old
  inconsistent saves, `current` takes precedence over display aliases so already-spent Flux is
  not resurrected; explicit zero values remain zero. Body Toll takes precedence over its aliases.
- Flourish is now explicitly a **risk alias**, not an earned reserve spent on ultimates. Positive
  `body_toll` costs accumulate strain even when prior Toll is zero; they do not charge Flux or
  require a Toll balance. Recovery reduces strain. Risk tiers remain Supple Clay, Joint Lock,
  Identity Erosion, Feral Mutation and Unraveling, with a derived control/handoff-due marker at ten.
- Structured Flux costs/gains and Toll costs/generated strain/reduction fields are applied once.
  Duplicate generation summaries do not stack. Costs are checked before their gains; uppercase
  `ALL` consumes the actual Flux bank and cannot fund an empty-bank finisher. Active-form
  requirements are checked before AP/mana payment. Narrative on-hit recovery is not inferred.
- Six authored Form adoptions share the actual Form spell prices: **2/2/3/2/4/3 Flux** for
  Ataxic Flow / Arterial Strike / Centrifugal Fury / Deadened Bastion / Fluid Apex / Silence Predator.
  They add **one Toll**, except Fluid Apex adds **two**. Spell metadata now includes the typed
  target and strain, and the bar uses the same plan. Re-adopting the active form is a no-op;
  GM mode does not silently waive the price. Manual calibration remains available separately.
- Actual sheet/HUD casting writes the resulting Flux, Toll and optional active form together.
  The modal distinguishes Flux payment from Toll risk. Short rest recovers **three Toll** and
  retains the existing generic Flux-recovery policy using normalized caps. Long rest/reset clears
  both pools and returns to Ataxic Flow while preserving custom and nested legacy metadata.
- Guide/config wording no longer treats Toll as reward Flourish. The prior duplicate-tier parser
  pitfall is avoided by one shared tier definition re-exported from the bar.

**Verified:** **176 tests across eighteen suites** pass, including all prior resource contracts.
New cases cover alias synchronization without refunded spending, zero precedence, nested save
metadata, independent risk accumulation, source builder/signature costs, all six adoption prices,
form requirements, `ALL`, explicit recovery, foreign ownership and malformed values, real short/
long rest paths, actual sheet/HUD transitions, and controlled adoption without a GM bypass.
Browser checks verify 12 Flux / 4 Toll → Arterial Strike **10 / 5** → Fluid Apex **6 / 7**,
unaffordable adoption at one Flux, and independent Toll recovery. The menu fits **420×700**;
page/console errors are zero. Contract syntax and scoped whitespace checks pass.

**Scope:** These are pool and authored-adoption transitions. Directed network routes, opening-free
shifts, specialization discounts/fusion, automatic hit/crit/rooted generation, on-hit recovery,
stance/stat effects, threshold penalties and actual control transfer remain pending. The existing
network table is labeled a design reference rather than claimed as enforced by adoption controls.
Spellguard and Inquisitor coverage follow below.

## Spellguard AEP and residual-accounting pass

`src/data/spellguardResourceContract.js` owns one **0–100 AEP bank**, preserving the saved
`arcaneEnergyPoints` engine ID. Loading, initialization, max refresh, store actions, bars and shared
casting use the same cap and aliases. `current` is authoritative over stale AEP display aliases;
existing `aep`, `arcaneEnergyPoints` and `resonance` values mirror it, including nested metadata.
“Silence Resonance” is saturation terminology, not a phantom additional implemented pool.

- `recordSpellguardInterception` accepts resolved containment, annulment, defusal, deflection or
  siphon receipts in **AEP-equivalent units**. Every successful report retains positive captured
  residual and satisfies **incoming = captured + redirected + dissipated**. No heritage/spec
  yield percentage is invented; cancellation and damage mitigation are outside this accounting API.
- Capacity is accounted separately: **captured = banked + uncontained overflow**. Overflow is
  retained in the receipt history instead of disappearing or becoming a hidden reserve. Receipt
  IDs remain idempotent after venting, reset and reload. Duplicate history is counted once, and
  unrecognized saved receipt records are retained as metadata rather than credited.
- Shared spell planning recognizes fixed authored conversion gains, generic/nested/dedicated AEP
  costs, explicit zero, `ALL`, minimums, owning engine and safe whole amounts. Duplicate encodings
  apply once. Costs cannot borrow their own gain. Variable interception outcomes with no encoded
  quantity require a resolved report; amounts are not inferred from damage/prose or spell names.
- Ordinary short rest no longer refills AEP as if it were generic recoverable currency. Long
  rest/reset grounds the bank to zero while retaining custom metadata and intake receipts.
- The Forge-Tender distinguishes resolved intake from manual calibration, shows retained receipts
  and overflow, and rejects inconsistent/zero-residual reports. At **100** the tracker marks breach
  due; **91–99** is an imminent warning band. Risk effects and breach/reset consequences are not
  automatically applied by the tracker. Existing spell/card/interface prose is updated only in
  the covered resource sections; pre-existing native/exception lore edits are preserved.
- The expanded Forge-Tender is clamped and scrollable. Its old centering animation was corrected
  so the new viewport-clamped position does not shift off-screen during opening.

**Verified:** **204 tests across twenty suites** pass, including earlier resource contracts.
Cases cover stat-independent caps, aliases without resurrected spending, all five conserved modes,
positive residual requirements, invalid/unaccounted energy, overflow, deduplicated saved history,
reset/reload, fixed source conversions, duplicate payment, ownership, `ALL`, actual short/long rest,
mounted reports, confirmation affordability and actual sheet/HUD casts. Browser checks report
annulment **20 = 2 captured + 18 dissipated**, then deflection **20 = 1 captured + 19 redirected**;
an 80-point capture into a 50-point bank retains **50** and records **30 overflow**. Venting to
75 and replaying the same ID gives no new charge. The menu fits **420×700** throughout its opening
animation; page/console errors are zero. Contract syntax and scoped whitespace checks pass.

**Scope:** The receipt ledger records reported interception outcomes. Manual calibration and fixed
authored spell conversions can change the bank independently; ledger totals describe reported
intake, not a complete audit of every bank adjustment. Automatic interception/damage observers,
mode eligibility/equipment/structure validation, yield multipliers, terrain/collateral effects,
decay, radiation/max-HP loss, reflection and meltdown damage/reset remain pending. Inquisitor's
pass follows below.

## Inquisitor Authority and bounded nullification pass

`src/data/inquisitorResourceContract.js` owns **Authority 0–8**, synchronized `current`/`authority`
and existing `righteousAuthority` aliases, and an explicit `nullAura` state. The saved `authority`
engine ID remains; known nested metadata and source saves are preserved. Current takes precedence
over stale display aliases. Initialization, load/refresh, store, casting and the bar share the cap.

- The aura defaults **released** and requires positive Authority to be active. Spending to zero
  releases it; refilling does not silently reactivate it. The Tribunal exposes an explicit toggle.
  Long rest/reset grounds Authority and releases the aura while retaining metadata. Ordinary short
  rest no longer creates occult-contact Authority through generic percentage recovery.
- Shared payment handles generic/nested/dedicated Authority once, including explicit zero, `ALL`,
  whole amounts, ownership and pre-gain affordability. Actual sheet/HUD spending uses the same pool.
- The assistance policy suppresses **known foreign magical buffs, healing and mana enhancement**
  while the recipient's aura is active. Self-originating authority/containment and nonmagical care
  remain. Hostile damage and debuffs do not become immune, and other party members do not inherit
  the recipient's suppression. Explicit foreign origin remains foreign even if self-administered.
- Condition and token records now preserve `sourceEntityId`, `effectOrigin` and `isMagical`.
  Existing foreign effects are retained: `getActiveEffects`/stat-modifier readers and healing-over-
  time ticks dynamically suppress their benefits while active, then permit them after release
  until their ordinary duration expires. Activation and balance changes refresh dependent stats.
- `receiveAssistance` supplies a provenance-aware immediate health/mana intake path. It checks
  suppression before resource mutation; ordinary manual HP calibration remains distinct. The
  recipient adapter recognizes local character aliases, party recipients and labelled creature
  state. Unknown legacy source/magic provenance is not fabricated, so those effects remain
  compatible until callers provide their actual origin metadata.
- Selected resource/Vow prose no longer promises permanent universal corruption immunity or
  unconditional healing rejection. Pre-existing native Marked-Vreken/Thalren and qualified-exception
  prose edits are preserved. The Tribunal adds keyboard/slider semantics and bounded scrolling.

**Verified:** **231 tests across twenty-three suites** pass, including all earlier contracts.
Checks cover stat-independent caps, alias/save preservation, zero release/reactivation, owned
payments without borrowing, real rest, immediate magical/nonmagical healing, self/foreign/unknown
origins, hostile damage, recipient isolation, stored provenance, retained buff records with paused/
resumed stats and healing ticks, mounted toggle controls and actual sheet/HUD casts. Browser checks
verify eight-point saturation, explicit aura toggling, 8→4→0 spending and automatic release, refill
without reactivation, manual release and **420×700** bounds. Page/console errors are zero; contract
syntax and scoped whitespace checks pass.

**Scope:** The suppression integrations operate on provenance-labelled effects and the new typed
intake API. This is not a claim that every legacy instant-heal, item, remote-token or effect caller
already supplies that metadata. Full provenance routing, automatic supernatural-contact generation,
quiet-round decay, rebellion/binding execution, safe-release recovery modifiers, aura-area spatial
handling, cancellation/immunity effects and per-heritage numerical edges remain pending.

The nine selected resource-contract baseline passes are now recorded. That does not certify all
twenty-one class engines, all passive effects or the blueprint's full release acceptance.

## Class acquisition evidence and current-state integration pass

`src/utils/characterClassAccess.js` is the shared adapter. `getCharacterHeritageOptions` reads the
class-scoped `classAcquisition[base].{method,qualification}` plus top-level `bodyStates`;
`getCharacterClassAccess`/`validateCharacterClassAccess` feed the same options to the registry.
Records are keyed by canonical base class name, so compatibility aliases resolve to the real class.
`isUnchangedCharacterCalling` compares the originally loaded calling (with heritage-alias
normalization) so legacy characters warn instead of hard-failing when evidence is absent; changing
the calling makes the missing evidence blocking.

`CharacterCreationWizard/components/ClassAcquisitionEditor.jsx` replaces the class free-text
narrative-approval path. It authors the acquisition source, per-requirement fulfillment and the
verification flag, plus explicit current body/interface states. The wizard stores these in
`classAcquisition`/`bodyStates`; `Step1CoreDraft` no longer routes a restricted class through the
justification modal (backgrounds keep their narrative-unlock path), and the class grid, selection
and final validation share the same registry options. `CharacterWizardContext` records
`originalCalling` on load, validates access in `CORE_DRAFT`, and the completion payload, local store
(`infoSlice`, `coreSlice.loadCharacter`/`saveCurrentCharacter`) and cloud
`transformForStorage`/`transformFromStorage` all carry both fields. `Step9CharacterSummary`
summarizes access status, method, source, requirements and current states.

Registry additions: `getClassHeritageAccess` reports `invalid-method` for a method outside a class's
declared native/method sets, and returns `requirements`/`method` on incompatible-state and
qualified/exception results so authoring and validation agree.

**Scope:** This retains and gates authored evidence; it does not execute it. Qualifying a rare class
does not grant the blueprint's numeric heritage edges/costs, and no automatic body-state changes or
per-class passive effects are added. Existing characters keep their data (unknown acquisition keys
preserved), and legacy incompatible callings keep a warning-only edit path. An orphaned
`setVisualMode('3d')` call in the concurrently edited `Step1CoreDraft` subrace handler (undefined,
would throw on subrace selection) was removed to restore the committed behavior.

## Berserker, Harbinger and Crusader scalar-pool pass

`src/data/berserkerResourceContract.js` owns Rage/Heat as `bloodHeat`: normal band 0–100,
overheat threshold 101 and an extended ceiling of 150 with the eight reachable states
(Smoldering → Frenzied → Primal → Carnage → Cataclysm → Obliteration → Annihilation →
Apocalypse). Normalization is authoritative on `current`, mirrors the legacy `rage`/`bloodHeat`
fields, never collapses overheat at 100, and only reports an `overheated` marker; burnout
(2d6 / reset / stun) stays an encounter consequence rather than an automatic engine.

`src/data/harbingerResourceContract.js` owns Mayhem as `mayhemGauge`, 0–100, with the
Safe/Escalating/Volatile/Maximum/Wild Surge tier table; `wildSurge` is a full-gauge marker, not
automatic damage. `src/data/crusaderResourceContract.js` owns Fervor as `radiantFervor`, 0–100,
with Zeal / Harmonic Stance (50) / Judgment Ready (100) and the Aex/relic framing (not a
Scathrach furnace resource).

All three route through `classResourceContracts.js` (id resolution, normalize/update, value/change
and `getManagedSpellResourcePlan`). Their spell encodings reuse the existing
`resourceCost.classResource` vocabulary: a negative cost means generation (Berserker's
Hemorrhagic Strike `cost:-6`), a positive cost is a spend, and explicit gains are retained; dice
generation is never inferred from prose. Legacy fields and aliases are mirrored, not renamed.

**Scope:** Resource identity, normalization and single-payment accounting only. Automatic
Rage/Mayhem/Fervor generation, decay, Wild Surge resolution, Harmonic Stance stat application,
Death's Door bypass and the numeric heritage edges/costs remain pending. Verified with new contract
suites plus the existing resource/UI suites (153 tests across 12 suites) and clean ESLint on touched
files.

## Augur and Revenant dual-pool pass

`src/data/augurResourceContract.js` owns Benediction/Malediction as
`benediction-malediction` with the spec-defined caps (Auspex 10/10, Harbinger 5/15,
Hierophant 15/5). Each pool clamps to its own cap, `specialization` defaults to the canonical
Auspex spelling, and Omen Debt is a long-rest ledger normalized to its negative representation
(capped at -10) rather than a per-round drain. Spell plans bind to the named pool (`benediction` /
`malediction`), including an all-in cost form.

`src/data/revenantResourceContract.js` owns Death-Toll and the finite phylactery reserve as
`revenant-toll`: Toll 0–20 with the Stasis/Searing/Rot Surge/Cataclysm tier table, Phylactery
0–50, and a `deathShroud` toggle. Legacy `toll`/`current`/`deathToll` aliases and the
`phylactery`/`phylacteryHP` pair are mirrored. A cost above the finite cap is reported but never
rescaled to fit (affordable stays false), so legacy high-cost spell data is not silently changed.

Both route through `classResourceContracts.js` for id resolution, normalize/update, pool-aware
value/change, and `getManagedSpellResourcePlan`. Negative `classResource.cost` still encodes
generation (e.g. a `phylactery` cost of -5 charges the reserve).

**Scope:** Resource identity/normalization and single-payment accounting only. Automatic omen
generation, Omen Debt application at rest, Toll volatility self-damage, phylactery resurrection
triggering and anchor-medium differences remain pending. Also flagged: some legacy Revenant spell
costs (30–40) exceed the 20-point Toll cap and are intentionally left un-reconciled for a future
data pass. Verified with new contract suites plus the existing resource/UI suites and clean ESLint.

## Animist, False Prophet and Plaguebringer scalar-pool pass

`src/data/animistResourceContract.js` owns Resonance as `ancestralResonance`, 0–20, with the
Dormant/Harmonized/Apex Harmonic/Spirit Erosion stage table and an `spiritErosion` marker at 15+.
`src/data/falseProphetResourceContract.js` owns Madness as `madnessPoints`, 0–20, with the
threshold table and a `convulsion` marker at 20; its spell encodings use dice for both generation
and spend, which are flagged (`dice: true`) and handed to the table rather than converted to fixed
numbers. `src/data/plaguebringerResourceContract.js` owns Virulence as `virulenceCultivation`,
0–100, with the Dormant/Sprouting/Blooming/Peak Harvest tiers and a finite affliction counter
(default cap 10).

All three route through `classResourceContracts.js`; Plaguebringer adds pool routing so the
`afflictions` counter is distinct from Virulence, while the Animist and False Prophet bars write
their scalar through `current`. The `-N` / `gain` spell-cost conventions are preserved.

**Scope:** Identity, normalization and single-payment accounting only. Automatic generation,
Spirit Erosion/Convulsion resolution, virulence decay and infection-stage automation remain
pending. Verified with new contract suites plus the existing resource/UI suites (176 tests across
17 suites) and clean ESLint.

## Chronarch, Lunarch, Toxicologist and Warden final-pool pass

`src/data/chronarchResourceContract.js` owns Time Shards and Temporal Strain as
`timeShardsStrain` (both 0–10) with the strain-backlash marker at 10; spending Shards does not
implicitly add Strain because only Temporal Flux abilities do. `src/data/lunarchResourceContract.js`
owns the four-phase `lunarPhases` cycle (New/Waxing/Full/Waning) with a round timer and phase
advancement/requirement plans — deliberately not a spendable 0–4 scalar. `src/data/toxicologistResourceContract.js`
owns `toxinVialsContraptions` with the INT-based Vial capacity (carried from initialization, never
shrunk below the minimum) and the Parts cap of 5. `src/data/wardenResourceContract.js` owns
`vengeance-points` as Tension 0–10, retaining the legacy engine name for saves.

All four route through `classResourceContracts.js`, including pool-aware routing for Chronarch
Shards/Strain and Toxicologist Vials/Parts, and phase-aware routing for Lunarch.

With this pass, **all 21 base classes now use the shared managed resource router** (the nine
original resource-contract classes plus Berserker, Harbinger, Crusader, Augur, Revenant, Animist,
False Prophet, Plaguebringer, Chronarch, Lunarch, Toxicologist and Warden).

**Scope:** Resource identity, normalization and single-payment accounting only. Automatic
generation/decay, Strain backlash resolution, Lunarch auto-cycling, Toxicologist rest recovery and
the numeric heritage edges/costs remain pending. Verified with new contract suites plus the full
existing resource/UI set: 166 contract tests across 19 suites and 181 bar/UI tests across 26 suites
(347 tests / 45 suites) pass, with clean ESLint on touched files.

## Class resource rest-policy pass

`gameStore.takeShortRest` and `resourceSlice.resetClassResource` now cover all 21 managed resources.
On a **short rest**: Rage, Mayhem, Fervor, Resonance, Madness, Virulence and Tension vent to zero;
the Augur's two omen pools vent with no Omen Debt; the Toxicologist regains one Contraption Part
(Vial recovery is dice-driven and deferred); Chronarch Shards/Strain, the Lunarch phase and the
finite Revenant anchor are normalized but untouched. None of the new pools receive the generic
percentage recovery. On a **long rest**: fresh resources are normalized through the managed router,
the Toxicologist refills Vials to its INT-derived maximum and Parts to 5, and the Augur accrues
Omen Debt (one stack per unused point, cap −10) before clearing its pools. Existing
Pyrofiend/Shaper/Spellguard/Inquisitor rest behavior is preserved.

**Scope:** Rest/automation policy only. Automatic in-combat generation/decay, Strain backlash,
Madness Convulsion, Toxicologist rest dice and Lunarch auto-cycling remain pending. Verified with a
new rest-policy suite plus the full contract set (172 tests across 20 suites) and clean ESLint.

## Heritage numeric edge/cost pass (complete native coverage)

`src/data/heritageEdgeContract.js` provides the written typed effect schema the blueprint §5.2
requires: exactly one bounded edge and one paired cost per heritage, typed kinds with per-kind caps,
recognised condition types, and validation that rejects prose-only, unbounded/unlimited,
multi-effect or condition-less entries. `evaluateHeritageEdge` gates the edge on a checkable context
condition and emits bounded edge/cost events; `getHeritageEdge`/`getCharacterHeritageEdge` resolve
canonical class names, compatibility aliases and race/subrace. Native edges are authored for **all 21
classes (56 pairs)**: Animist, Apex, Arcanoneer, Augur, Berserker, Chronarch, Crusader, False
Prophet, Gambit, Harbinger, Inquisitor, Lunarch, Martyr, Minstrel, Plaguebringer, Pyrofiend,
Revenant, Shaper, Spellguard, Toxicologist and Warden. `heritageEffectsImplemented` is true for all
21 in `classHeritageRegistry.js`; the registry test asserts the exact set and the edge test asserts
every native heritage is covered. Witness/truth wording was preserved where a table records a
limitation rather than a numeric cost. E-only rows (qualification-gated) remain, and no effect is
applied to live combat until the consumer pass.

**Consumer:** `src/data/heritageEdgeAdapter.js` translates each authored edge into a bounded engine
modifier bundle with named capability/cost lists (`translateHeritageEdge`), clamps numeric fields to
the schema caps, and applies the edge only when its checkable condition is met
(`collectHeritageModifiers`). `summarizeHeritageEdgesForClass` drives `ClassDetailDisplay`, which now
lists each native heritage's edge and cost and shows implemented/pending copy from the per-class
flag.

**E routes (batch 1):** qualification-gated E edges are authored for Spellguard (Nethien, Thalren,
Clockwork/Caustic Fexric, Tessen) and Toxicologist (Broken Mimir, Withered, Clean/Marked Vreken) —
nine pairs. `collectHeritageModifiers` applies an E edge only after `getClassHeritageAccess` reports
`qualified-exception`, so an unqualified outsider receives nothing.

**Combat surface:** `getActiveHeritageAbilities` exposes the active capability/cost set for a given
context. `src/data/heritageCapabilityConsumers.js` routes every authored capability to an engine hook
via its checkable condition type (`CONDITION_ENGINE_HOOKS`) and resolves raised events with
`resolveHeritageCapabilityEvent`, so application stays explicit per capability rather than a blanket
damage hook that cannot express positional/medium/bond conditions. A test asserts every capability is
unique and routed (no unrouted capabilities). Live hook: `SpellActionBar.handleCastSpell` evaluates
`getActiveHeritageAbilities` after a successful cast (context from an explicit
`charStore.heritageContext` override plus the spell's target restrictions) and posts a heritage-edge
combat notice; it never changes costs or damage, and nothing fires when the condition is unknown.
The library-level `applySpellEffects` hook is opt-in but is not on the live cast path. E-route
coverage now includes Spellguard, Toxicologist, Inquisitor, Lunarch, Minstrel and Shaper; the
remaining E rows and the melee/attack, movement, turn-start and rest pipelines still need events.

**Scope:** typed data, resolvers, validation, the pure consumer adapter, capability routing and
E-route batch 1. Live event raising in the combat pipeline and the remaining E rows remain.

## Remaining dependency-ordered work

1. **Ancestry:** align all ten race files, twenty-five subraces, art/location briefs, inherited traits,
   remaining detailed biographies, historical accounts and secondary consumers against the core
   baselines above. Automatic Fraying/distance state handling remains pending.
2. **Provenance/access:** qualified-route wizard authoring/state persistence baseline is recorded
   above; finish detailed receiving-branch transmission, individual class templates, the remaining
   consumers of the implemented registry, and the blueprint's typed numeric heritage edges/costs.
3. **Mechanics:** all 21 base-class resource contracts now route through the shared managed
   router and rest policies are wired (scoped above). Remaining mechanics work is automation and
   reconciliation: damage/turn automation, automatic generation/decay, and completing the heritage
   edge/cost authoring for the remaining 15 classes plus the E-only rows, then the combat adapter
   that consumes the emitted edge/cost events. Blueprint prose tables are not executable effects or
   final numerical balancing.
4. **Languages/origins:** separate fluency, scripts/registers/ciphers, secret provenance, and temporary
   magical understanding; implement modular Acolyte background, Hollow Sight, and Rime conditions.
5. **Consumer reconciliation:** finish remaining rules chapters, lexicon secondary entries, faction/NPC
   histories, calendar/phase details, regional atlas/GM chapters, class compendiums, and UI captions.
6. **Acceptance:** character/save compatibility, resource engines, heritage eligibility, meaningful
   browser interaction, and the blueprint §12 release checks. Qualification/state persistence now has
   unit/RTL coverage; full authenticated browser creation acceptance and cloud round-trip remain.

The original `LORE_AUDIT_REPORT.md` remains the historical evidence snapshot. Existing user changes,
including the three Deepling overview rows in `rules.json`, are preserved.
