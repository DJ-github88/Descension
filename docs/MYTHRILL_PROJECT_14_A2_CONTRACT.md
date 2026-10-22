# P14-A2 — Item ability producer and access association

2026-10-22 · **FROZEN before production edits; implemented; bounded independent ACCEPT; Build3/App10 PASS (qualified fixture/UI evidence).**

## Baseline and ownership

Entry `master/ad93fd78048a49030f28af18e23bcf0e91a2aa85`, dirty working tree. A1 is
the accepted uncommitted implementation, not HEAD alone. Read engineering state,
current priorities, roadmap §14, coordination §8–9 and A1 contract/acceptance.
Carry forward C1–C4/P8/P9/P12/E1a/W1 acceptance. The A1 reviewer independently
inspected source, evidence and hashes but did not independently execute the runs
because its execution sandbox was unavailable.

Main HQ owns this item producer and the reused shared interfaces. Class/Heritage
owns content/loadouts/selection/compatibility; RI-2 corrections remain separate.
Initial dirty A1 runtime/tests/witnesses, C4/status documents and RI-2 correction2
evidence are pre-existing work, preserved. No stable-ID, grant, migration or balance
changes. Recheck shared bytes before writes; additive status updates only.

## Stored association / identity

One optional `item.authoredAbility`: `{schemaVersion:1, record, librarySpellId}`.
`record` is a detached **whole A1 Wizard library record**, including
`authoredDefinitionId` UUID and `authoredDraft`, not a second spell language.
`librarySpellId` is nullable provenance only. No runtime name lookup or library
dereference: deleted/changed library content cannot replace the embedded snapshot.
Missing snapshot/unknown schema remains recoverable/manual. The selected A1 class
binding is chosen explicitly at normal GM admission, validated there and on use;
it is not a new class or item grant. Launch matches the complete canonical definition
against installed versions using each installed binding/version and exact UUID.
If multiple bindings match, the owner explicitly selects the version/binding.

Item library `id`, inventory instance `id`/`originalItemId`, ability definition UUID,
installed room/version/hash, approval UUID and command UUID remain distinct. Copying
to inventory deep-copies the association; opening/rendering/loading never mints an
ability UUID. New authoring mints once on explicit Add. Editing a snapshot preserves
its definition UUID and changes only that item copy; library/template/other instance
bytes and installed history remain unchanged. Explicit admission creates a new
immutable version; exact older snapshots may still use their non-revoked versions.

## Authority / mechanics / recovery

This is an **authoring/access association only**, not server-validated item possession,
equipment, holding, consumption, charges or creature-origin entitlement. Existing A1
primary owner-PC/class binding/installed version/membership/source/target/revision/
Stunned/affordability/consent/P7 writer checks remain authoritative. GM adjudicates
item prerequisites and legality explicitly; item association never asserts them met.
Separate activated definition is identified as such, never extraction from a complex
on-hit/passive/consumable record. Original item effects/data remain intact and manual.

Only `authored-immediate:v1`: immediate ACTION, one exact owner primary PC, one exact
PC/creature target (self allowed), explicit AP/mana and range including0, one direct
damage OR healing, bounded NdM±K. Existing advanced Spell Wizard is the detailed
authoring surface; compatible saved library records can be selected as snapshots.
Compact edits preserve unedited whole-record fields; unsupported records cannot be
flattened by this editor. No triggers/passives/charges/wear/mixed effects/areas/
reactions/new economies/creature sources/recurrence/expiry.

Reuse `definitionFromWizard`, normal `AuthoredAdmission`, installed A1 refs,
`routeSpellCast` and existing P9 panel/custody/P7 receipts/P13A feedback. No item-only
custody. Closing an item changes no attempt. Unknown prevents replacement; explicit
same-byte recovery retains roll/approval/command. No save/admission/approval debit;
accepted consequence alone atomically installs price+HP. History never reapplies.

## Writable / protected

Writable: new pure item snapshot/edit/match helper; compact Item Wizard editor;
narrow ItemWizard save/init preservation; ItemLibrary selected-item access and edit
preservation; InventoryWindow item access; inventory library-copy preservation;
shared panel association label/focus return only; focused tests/App witness/evidence
recorder, player/GM explanation and engineering/priorities/coordination/roadmap.
Admission component may be reused without changing authority. Protected: all A1a
compiler/tests/fixtures, W1 editor/manager/serializer, A1 server authority/payment/
registry/consent/custody bodies, Class/Heritage/RI-2/ancestry selection and unrelated
targeting/export work. Concrete findings beyond this boundary need a recorded delta.

## Acceptance and handoff

Actual production editor authors damage and healing (0 AP/range0), save/close/reopen
exact fields, library snapshots/deleted references, template/instance isolation;
normal GM admission; real inventory/item launch; physical/digital same A1 execution;
approval no spend/accepted once, manual complex data no spend; repeated launch,
panel reopen/lost ACK/reload/reconnect preserve original attempt. Focused production
handler regressions cover unauthorized/Stunned/stale/revoked/edited/refused writer,
no partial pools, retained stale faces and accepted-history recovery. Reuse unchanged
A1 acceptance rather than repeat the historical matrix. Detached production build,
production-App witness, keyboard/tablet bounds and one bounded independent review.
Bulky evidence outside Git under `D:/AppData/Temp/opencode/`; reusable tests and
concise records in repo. No commit/push/deploy/reset/dependency change.

Future Creature Wizard producer may reuse compact Wizard record editing/snapshot
and pure A1 mapping/admission interfaces. Creature-origin execution still requires
its own exact source-authority contract. Next smallest extension is that producer
with owner-PC access, or a separately contracted item entitlement if actually needed.

## Initial review repairs / bounded preparation deltas

The one authorized independent reviewer found F1 name/type stacking overwrote item
snapshots, F2 existing library-edit mapping dropped nested manual fields, F3 pending
compact edits could be lost across navigation, F4 pointer-only library selection.
Repairs: no auto/explicit merging when either item has an association; deep preserve
all fields through the existing library-copy path for associated items; retain nested
manual/unknown data in library Edit and do not merge defaults into saved on-hit programs;
Keep/Cancel gates navigation/save; accessible Enter/Space selection in both library
views. `ItemCard.jsx` is additionally writable for that exact selection seam. Existing
normalizer meanings and unrelated export/targeting code remain untouched. New Laws
item-ability explanation is additive in `public/data/rules.json`, preserving A1 text.

## Implementation and verification — 2026-10-22

### Delivered workflow

1. **Tools → Library → Armory → Create Item**, or an existing item's **Edit Item**.
   In **Basic Info → Activated ability**, add a separate immediate ability or select
   a compatible Spell Library snapshot. Compact fields are name/description, direct
   damage or healing, damage type, formula, AP/mana, range and one target restriction.
   Keep/Cancel finishes the embedded edit before navigation/save. Detailed authoring
   stays in the existing advanced Spell Wizard; no reduced persisted spell format.
2. Save, close and reopen the item normally. Select its library card/row (Enter/Space
   works), expand the item/ability summary, select the existing class binding and
   **Admit this saved version** through the unchanged A1 admission component. Refresh
   and check-original admission remain available. Saving/admission spend nothing.
3. Copy/distribute the saved item through existing inventory paths. **Inventory →
   Item abilities** shows each associated item and its name, price/formula/targeting,
   support/manual and admission status. Refresh and explicitly select the matching
   saved version/class binding, then **Use item ability**. The existing A1 panel shows
   the originating item and selected primary-PC source, exact target, retained roll,
   price and pending/accepted/failed/unknown state. Focus returns to the item launcher.
4. Owner records physical faces or rolls digitally, then approves. Nothing is spent.
   GM adjudicates item requirements/legality/range/defense/mitigation/final amount and
   accepts one P7 consequence. Temporary pools/HP, healing caps, receipt-only narration
   and HP feedback use A1 unchanged. An unknown acknowledgement retains the original
   approval/command; close/reopen/reload/reconnect never creates replacement work.

`item.authoredAbility` embeds the whole detached Wizard record. `librarySpellId` is
provenance, never an executable lookup or substituted by name. Unknown schema or
missing record stays manual/recoverable; deleted library content does not erase a
stored snapshot. No installed ref is writable in the item: exact installed versions
are matched from trusted A1 room lookup by UUID and complete canonical bytes, using
that version's existing class binding. The owner's explicit selection chooses among
exact matches; revocation disables the matching version. Changing a saved definition
does not match installed history until explicit admission, while other unchanged
snapshots may continue using their separately admitted non-revoked old version.

### Actual verification and independent verdict

- **Production-App10 PASS:** actual Item Wizard authored **Quill Spark** (Arcane
  `1d6+2`,1 AP/3 mana/range30) and **Ribbon Mending** (`1d8+1`,0 AP/0 mana/range0).
  Verification-only definitions, not canonical/balance additions. Actual normal
  Library Edit/save/reopen compares complete association; same A1 admission and real
  Inventory launcher; physical/digital exact rolls, no approval spend, temp-first
  payment/damage and capped healing; accepted narration and HP feedback once.
- Lost owner ACK → unknown → item collapse/reopen → page reload → real socket
  disconnect/connect/rejoin → original exact approval check, still no spend. Lost
  GM ACK+broadcast → unknown/disabled replacement → reload → original command bytes,
  same receipt/one narration. Accepted history/rejoin adds no receipt. Actual revised
  healing retains UUID, initially offers no use, explicitv2 preserves installedv1 and
  owner's original inventory snapshot. Enabled custom on-hit/stun, mixed damage+
  debuff association and unknown customStorage survive real edit/save exactly, remain
  manual and spend nothing. Desktop1440/tablet1024 horizontal bounds/captures retained.
- **Focused checks:** final4 client suites14 tests, earlier6 suites25 (overlap), W1
  preservation3 suites43; unchanged affected A1 production server10. Unauthorized
  admission/use, Stunned, changed/revoked/corrupt definitions, stale/recreated/deleted
  actors, post-await checks, retained stale faces and writer refusal/no partial state
  reuse those actual registered-handler checks and accepted A1 scope. No full prior
  phase acceptance repeated. Scoped lint0 errors/32 incumbent warnings; new helper/UI
  lint0; detector `[]`. Reusable new tests are the item helper/inventory suite and
  real Wizard/library-selection suite.
- **One independent review:** F1–F4 BLOCK → repairs → independent eight-check repair
  probe and two production suites/five tests PASS → final source/evidence ACCEPT.
  [Concise acceptance](MYTHRILL_PROJECT_14_A2_ACCEPTANCE.md); original and final full
  reports/probes/hashes in external `p14a2-review1/`. Reviewer independently executed
  A2 probes/tests, but independently appraised (did not launch) Build3/App10. The A1
  prior reviewer independently inspected source, evidence and hashes but did not
  independently execute the runs because its execution sandbox was unavailable.

### Identity / evidence / limits

Entry/final `master/ad93fd78048a49030f28af18e23bcf0e91a2aa85`, **reviewed uncommitted
bytes**, no HEAD-only claim. Build3 optimized detached production compile exit0,
before/after drift `[]`. All31 runtime hashes match current/App10 before+after/final
gate; gated client build mismatches `[]`; independent seven protected identities
match A1a/W1/universal-card baseline. No A1 server runtime, custody, compiler or
resource-authoring bodies changed. Initial C4/status/RI-2 and accepted A1 work retained.

Under `D:/AppData/Temp/opencode/`:

| Artifact | SHA256 |
|---|---|
| `p14a2-final-evidence.json` | `c42435d5e92c252ddd703b7aa0fc3723ae52e0002788b2b5fde96d1ead6c8c77` |
| `p14a2-build3/build.json` | `843fe0ee92698fbdf976f51de226321468d0a00421f2094ef13c0ad4d45f0e6f` |
| Build3 `asset-manifest.json` | `15cbc77da4f90e6b409614a318fb6e5a1dbbec0bb2f292b6dedbe46b9549bed1` |
| `p14a2-app10/result.json` | `a45c6f032c3e9d2223dd282029d9707bbd6aae94ce08fbe72cae838d085aa34a` |

App uses real optimized App/router/controls and registered backend, with provider
authentication, canonical ownership, lease/cloud and delivery/manual-source setup as
fixtures. Receipts are temporary-room/live-only. **Five nonfatal fetch errors remain.**
An unrelated incumbent P13 disconnected-collection notice persists after fixture
rejoin and visibly obscures upper Inventory in both captures: horizontal bounds and
completed action assertions are proven, not universally unobstructed tablet layout
or pristine networking. This task does not repair/reaccept P13. No deployment, cloud
checkpoint confirmation, physical tablet or second-device certification.

Intermediate Build1 named-CJS export failure (helper converted to ESM), App fixture
path/selector corrections, App5 lingering-timer timeout after passing assertions and
App8/9 failed attempts to clear that unrelated notice remain retained externally.
Build3/App10 are final. New reusable witnesses: `verification/p14/item-app-browser.cjs`
and `record-item-evidence.cjs`; no bulky evidence in Git.

### Reusable producer handoff / next smallest extension

`ItemAbilityEditor` writes only ordinary whole Wizard records; pure
`snapshotAbility/newItemAbility/editItemAbility/itemAbilitySupport/matchingItemVersions`
live in `services/itemAuthoredAbility.js`. They perform no authority/storage/payment.
The reusable chain remains complete record → `definitionFromWizard` → normal A1
GM admission → trusted installed ref → `routeSpellCast` → existing P9/P7/P13A.
Creature Wizard can reuse the record editor/producer boundary under a separate
producer-preservation contract, initially retaining owner-PC execution. Actually
acting from a creature requires its own exact source-authority contract; item
possession/equipment entitlement likewise needs a separately server-validated extension.
