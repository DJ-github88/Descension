# P14-A3 — Creature Wizard ability producer

2026-10-22 · **FROZEN before implementation; delivered; bounded independent ACCEPT; Build1/App9 PASS (qualified).** Execution remains PC-only.

## Current source and workflow

Entry: clean `master/652aad2b12eaa130be12a2d2d56abaafac8d7d57`. Prior A1/A2 acceptance
identified uncommitted bytes on ad93fd78; reuse its evidence without equating HEADs.
Current CreatureWizardApp normalizes/reconstructs legacy abilities on reopen; its save
updates both library owners and creatureStore propagates template fields to placed tokens.
CreatureToken/inspect also consult library data. These seams require narrow preservation.

GM opens Bestiary → Create/Edit Creature → Abilities → separate activated ability,
or chooses a compatible saved Spell Library snapshot. Inspect exact mechanics, explicitly
Keep, save normally, reopen, inspect saved content, choose existing binding and explicitly
admit through normal AuthoredAdmission. No save/admission payment or HP consequence.
Creature-origin casting is unavailable, with an explanation; normal admitted-PC access
elsewhere retains A1 permissions. Existing creature abilities/execution paths stay separate.

## Data, preservation and versions

One optional `creature.authoredAbility = {schemaVersion:1, record, librarySpellId}`,
using A2's whole detached Wizard record and nullable provenance. No item entitlement fields.
Definition UUID differs from creature library ID, placed token ID/incarnation, installed
version/hash, approval and command IDs. No dereference/substitution by provenance or name.
Opening does not mint a definition UUID. Missing/duplicate library identity is visibly
unselectable; malformed association stays preserved/manual. Edits retain UUID; explicit
A1 re-admission selects/creates immutable versions. Installed history never mutates.

Existing abilities include legacy dice objects, rich Wizard records, traits/actions, priority
and trigger metadata. Existing `abilities` entries must be deep-preserved on reopen/save,
including unknown fields, null, zero, missing and malformed values; no targeting normalization,
maxTargets:0 reinterpretation or partial execution. Separate association never rewrites them.
Template/copy/placed creation detaches the new association. Template edits continue unrelated
propagation but never add/replace/remove this association on an already placed instance.
Placed inspection reads the instance association, including its absence, not the current template.
Unfinished compact edits are retained across closing/reopening the window and gated before
navigation/save; explicit cancellation discards only the pending edit. No migration/catalogue rewrite.

## Capability and ownership

Actual A1 adapter/validator is compatibility authority: immediate ACTION, one supported target,
explicit nonnegative integer AP/mana/range (zero retained), one direct damage OR healing,
bounded dice vocabulary. Complex/unknown/conflicting records remain manual and fully preserved.
No creature execution, fake PC/owner, local debit, new binding/economy/endpoint/roll/payment/
receipt engine. A1a executionEnabled:false/compiler/fixtures and W1 owners remain protected.

Writable: narrow shared compact editor reuse; creature producer/status component; CreatureWizard
load/save and pending-edit retention; creatureStore association copy/propagation guard; existing
inspect surfaces; focused tests/witness/identity recorder; this contract, follow-on contract and
existing engineering/priorities/coordination/roadmap. Protected: A1 server admission/execution/
custody/payment, Class/Heritage/RI-2/ancestral selection, Spell Wizard/export/W1, catalogue and
unrelated combat/persistence. Recheck bytes before writes; retain concurrent work.

## Acceptance

Real Wizard author damage/healing, library selection, explicit0 AP/mana/range, Keep/save/reopen
fidelity, rich legacy/manual preservation, cancelled/pending edits, template/copy/placed isolation,
library change/deletion, missing/duplicate identities, v1 vs explicitly admittedv2, no resource/HP/
receipt change, no creature cast, keyboard/focus/narrow layout. Focused A1/A2/W1 regressions,
one detached production build with source identity, production App walkthrough and one bounded
independent delta review. Bulk evidence external; no commit/push/deploy/reset/upgrade/migration.

Creature-source authority is a separate follow-on contract, not implemented by this producer.

## Delivered workflow and evidence

1. Tools → Library → Bestiary → Create New, or right-click a saved creature → Edit.
   Open step3 Abilities → Separate activated ability. Add, or choose a compatible saved
   Spell Library definition; inspect/edit name, type/formula, explicit AP/mana/range and
   one target. **Keep ability on creature** explicitly retains it. Keep/Cancel gates step
   navigation/save; session drafts are exact-creature/account scoped and survive window/
   tab close/reopen. Cancelled new abilities do not resurrect. Page reload durability is
   not added. Existing creature abilities remain separate and retain their full records.
2. Step5 Shop Config → Save Creature. Reopen Edit → Abilities to inspect/edit the same
   UUID/content. Right-click the library creature → Inspect → Abilities & Spells; inspect
   the whole JSON when needed. Choose an existing class binding → **Admit this saved
   version**. This is normal A1 admission, no resources spent and no creature casting.
3. Placed token → Token Actions → Inspect → Abilities & Spells shows its own preserved
   association. Editing the template leaves this old instance unchanged. Explicitly
   admitting a template's revised record creates/selects A1's immutable version; old
   history remains unchanged. A1's incumbent status compares the latest installed version;
   an older placed copy may say Changed sincev2 even though itsv1 remains installed.
4. Normal owner-PC Admitted abilities can reuse the definition only under unchanged A1
   permissions. The creature surfaces expose **no Cast/Use launcher**. Unsupported whole
   records remain inspectable/manual; never execute a supported fragment.

[Independent acceptance and exact identities](MYTHRILL_PROJECT_14_A3_ACCEPTANCE.md) records
6 client suites54 tests, A1 server10, reviewer8 repair probes/final6 tests, one optimized
build and App9. Runtime files: shared ItemAbilityEditor compact form options only;
CreatureAuthoredAbility; CreatureWizardApp/context/Step3; CreatureLibrary duplicate;
ExternalCreaturePreview/EnhancedCreatureInspectView; CreatureWizard.css; creatureStore.
Tests/witnesses: CreatureAuthoredAbility.test.jsx, creature-app-browser.cjs and
record-creature-evidence.cjs. No A1 engine/W1/compiler/Class/Heritage writes by this agent.
All bulk stays external. Later concurrent overflow UI drift is disclosed, not overwritten
or claimed built. [A4 preparation](MYTHRILL_PROJECT_14_A4_SOURCE_AUTHORITY_CONTRACT.md)
identifies the new creature-source authority capability actually required.
