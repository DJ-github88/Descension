# P14-A4 — creature-source execution implementation and acceptance

2026-10-22 · **Bounded independent ACCEPT (qualified); Build4/App10 PASS.**
[Frozen contract](MYTHRILL_PROJECT_14_A4_SOURCE_AUTHORITY_CONTRACT.md).

**No remaining concrete blocking findings.** Same single reviewer closed original R1–R5, residual
race/unbound-Inspect/withdrawal-recovery findings and the narrowly required dependency corrections.
Final independent report: `D:/AppData/Temp/opencode/p14a4-review1/FINAL_ACCEPTANCE.md`; independently
measured identities: `final-independent-identities.json` in that directory. Reviewer independently ran
focused tests/probes and appraised implementer-executed optimized build/App, with no relaunch claim.

## What the GM can do

1. Tools → Library → Bestiary → Create/Edit Creature → Abilities. Add a separate immediate damage or
   healing ability, or select a compatible whole saved Spell Library snapshot. Keep it, save normally,
   reopen to inspect, then place the saved creature in the shared room.
2. Placed token → Token Actions → Inspect → Abilities & Spells. Bind the exact placed actor if needed.
   Refresh room admission, choose **Admit for this creature**, then **Use for this creature**. This binds
   the current saved association and immutable installed version to that exact map/token/incarnation.
3. Select one distinct exact placed creature on the same map, using the chooser or **Pick creature on
   map**. Inspect formula/range/restriction and authored defenses. Record physical faces or roll digitally
   once. **Validate source, target and retained roll** spends nothing.
4. Review exact authored AP/mana price, source/target identities and retained result. Explicitly adjudicate
   legality, range, target restrictions, flat DR/resistance/vulnerability/defensive effects and final amount.
   Explain adjustments. **Confirm one creature consequence** atomically installs payment and HP once.
5. Read accepted payment/HP and receipt. Temporary pools pay/absorb first; healing caps HP. Closing/reload
   keeps evidence. Unknown requires the original command check. After a known refusal, remove Stunned or
   correct state and explicitly revalidate the same faces. **Refresh admission or change target (keep
   faces)** positively closes the old attempt before adopting compatible new authority/target context.

Range0 remains0 and is visibly unsupported against a distinct creature; self-only and PC targets refuse.
Complex original records remain whole/manual. Neither example names nor a compiler class anchor grant
execution. Creature-only installation does not implicitly admit PC use. No second engine or owner fiction.

## Bounded implementation

- Exact grant under protected `actorContract.authoredAdmission`: source ref, full-association hash,
  immutable definition ref, request identity/hash and current GM UID. Bounded request history remains in
  existing `actorConsequences` ledger; creation-decision provenance also distinguishes creature-only
  versions. Current GM/session, whole association/version/revocation, exact actors, Stunned, pools and
  revisions recheck after awaits and at the shared binder/P7 stage. Recreated/copied tokens cannot inherit
  another incarnation's permission. Template changes do not replace placed snapshots.
- Existing admission planner/writer, spellPayments preparation/binder, spell command planner/custody,
  P7 atomic installation/receipt and P13A visibility feed reused. Original PC approval stays PC-only.
  Exact authored prices including0; no basic-strike2-AP default. Missing positive-price resources refuse;
  unavailable unused pools remain absent. Accepted amount0 can pay; opening/rolling/preparing/cancelling
  cannot. Writer or other refusal applies no partial payment, HP or attempt consumption.
- Existing scoped spell/device slot retains faces/attempt before emission; shared command custody retains
  immutable consequence before emission. Unknown/pruned outcomes block replacement. Same bytes recover
  original receipts; conflicting bytes refuse. Positive withdrawal closure is itself idempotently
  recoverable. Historical recovery is silent. Restart is trusted checkpoint/new-epoch reconstruction,
  not authorization to execute old unknown provenance. Unavailable exact recovery stays manual.
- Shared placement captures detached whole association and authored defense fields. GM-only lookup
  restores saved Inspect after reload; a finite numeric public stat projection lets library-less clients
  render custom tokens. Public snapshots do not include raw drafts, admission history or an armor score.

## Verification actually executed

- Final new production suite: **21 A4 tests**, with **10 A1 tests** in the last affected run: **31 PASS**.
  Earlier affected A4/A1/P9/C2/import group **45 PASS** (before the final one route-isolation test);
  separate P12A/P12B/C4 affected group **45 PASS**. These are overlapping groups, not a summed total.
- Client affected group **6 suites /40 PASS**; final feed/pure/creature-custody group **3 suites /27 PASS**.
  Earlier A1/A2/A3 pure/producer/controller groups carry their recorded passes; counts overlap.
  Scoped runtime lint0; mechanical UI detector `[]`. Earlier producer tests emitted incumbent jsdom
  canvas/store-fixture warnings; no production browser canvas replacement was used.
- One independent reviewer: initial R1–R5 BLOCK, concrete repairs, residual cross-route request race,
  unbound Inspect and lost withdrawal ACK repairs; source closure CLEAR. Independent source/probes/tests
  also cover unused-pool feedback, creature-only vs explicit PC admission/checkpoint/source deletion,
  reserved close capacity and private defense lookup. This is the same bounded reviewer throughout.
- Production App5/Build1 passed main workflow; enhanced App7/Build2 passed material source admission/target
  changes with original faces, lost withdrawal ACK, actual unavailable-pool projection, Stunned correction,
  damage lost ACK+broadcast/reload/original receipt and once-only observer narration/HP feedback.
  Final runtime additionally repairs unused-pool healing feedback and prevents implicit PC route grants;
  final source/build/App identities are recorded below. Earlier App attempts retain locator,
  absent custom-token numeric projection and evidence-comparison failures externally; none are hidden.

### Final optimized run and identity gate

**Build4 exit0 / App10 PASS.** Final run uses actual author/save/reopen, real shared placement, GM reload
while unbound → Inspect bind/admit/use, physical1d6+2 face4, price1 AP/3 mana and exact separate sibling.
Explicit admission refresh, lost withdrawal ACK → original positive closure check, map-pick A → target B
all keep the original faces under a new validation identity. No pre-spend. Confirmed damage6 absorbs4
tempHP and reduces normalHP2; source AP6→5/mana50→47 and sibling pools remain unchanged.

GM accepted ACK and broadcast are suppressed. Unknown blocks replacement; actual reload/rejoin restores
original command check and receipt without a second spend/HP change. Observer damage floats are exactly
`−2 HP` and `4 absorbed`, and chat remains once-only. Digital healing uses0 AP/0 mana. A registered P7
Stunned application after preparation refuses the action with state unchanged; registered removal and
explicit same-roll revalidation allow final1000 GM-adjudicated healing capped to250 HP. The exact live
healing float is `+222 HP`, even with unused source mana/target AP/mana deliberately unavailable. Those
pools remain absent. A second actual reload/rejoin and original production controller recovery keep
receipt count unchanged and replay neither chat nor floats. Observer lookup/public tokens expose no
raw source associations.1440×1000 and1024×768 action captures have no horizontal overflow.

- All **43 runtime hashes** match App10 before/after/current source; every scoped client input matches
  Build4; client mismatches `[]`. Seven protected identities match, including compiler `48b69255…`.
- Build4 mirrorDrift `[]`. ConcurrentLiveDrift names **lichborneData.js, classResourceContracts.js,
  classResources.js**: concurrent Class resource/content work, not A4 changes. Those later bytes were
  not in the frozen optimized run. This is scoped A4 parity, **not full current-tree build parity or
  independent acceptance of the concurrent Class resource integration**. Earlier Build2 separately
  recorded infoSlice/progressionSlice drift. No unrelated rebuilding/overwriting was performed.
- App10 records **five `Failed to fetch` page errors**, origins unattributed. All named action assertions
  pass, but the run is not error-free/provider-health evidence. Earlier App8 map-picker locator and
  App9 mangled-export discovery failures are fixed in the witness only, without runtime edits/rebuilds.
- Exact current evidence HEAD: `master/14b21cfec10df7c5c198e1df13cccb79fbdd8c41`, mixed committed and
  uncommitted bytes due concurrent external commits. This agent made no Git writes.

| External artifact under `D:/AppData/Temp/opencode/` | SHA256 |
|---|---|
| `p14a4-final-evidence.json` | `23197fcc6dce301e9ffe4bf97d1b12f70233704af8cba8da898191c692fabc11` |
| `p14a4-build4/build.json` | `02231fe87621b8879fe34f7032184a46ab0a373c6c1d6a249bd76d1f84009c2b` |
| Build4 `asset-manifest.json` | `4cb0d118ddf42db676ae0857a7632f1b90c4f2e4b3bd7fc13ac890a3d9bf4531` |
| `p14a4-app10/result.json` | `10394093369058592fb57b0deb66fedcce9857f5da11cdb67cade32efaac70ce` |

The reviewer independently executes focused source probes/tests; optimized build/App are implementer-
executed and supplied for independent evidence/hash appraisal, not represented as reviewer-launched runs.
The final reviewer independently matched all43 current/App hashes, frozen client inputs, seven protected
identities and all four artifact digests above, then returned **ACCEPT, bounded and qualified**. Its final
independent runs were21 A4+10 A1 server and3 client suites27 PASS. Five fetch errors, concurrent Class drift,
fixture/live-only/checkpoint-reconstruction and viewport/device limits remain part of that acceptance.

## Files in this slice

Server: `handlers/actorConsequenceHandlers.js`, `socketHandlers.js`, `tokenHandlers.js`;
`services/installedAuthoredAbilities.js`, `spellPayments.js`, `actorConsequences.js`, `roomAccessService.js`.
Client services: `actorConsequenceService.js`, `spellConsequence.js`, `spellConsequenceService.js`,
`spellConsequenceCustody.js`, `authoredAbilityRegistry.js`, `acceptedResultFeed.js`.
UI: `SpellConsequencePanel.jsx`, `AuthoredAdmission.jsx`, `CreatureAuthoredAbility.jsx`,
`EnhancedCreatureInspectView.jsx`. Help: `public/data/rules.json` shared capability explanation.
Checks: `server/tests/p14a4CreatureAuthored.production.test.js`, `creatureAuthoredRecovery.test.js`,
`acceptedResultFeed.test.js`, narrow A3 producer expectation update; new
`verification/p14/creature-execution-app-browser.cjs` and `record-creature-execution-evidence.cjs`.
Docs: A4 contract/this record, A5 preparation, engineering ledger, current priorities, coordination, roadmap.

## Identity, external evidence and limits

Entry `master/485c0bbab9171879e2ea47cd83b44ddc0f046deb`, dirty accepted A3 documentation/witnesses and
concurrent Class/Fate Weaver/overflow UI. External commits advanced through a5d99e88/de0f4c9c/893a0648/
14b21cfe while this agent worked. **This agent made no commit, push, reset or other Git write.** Later
Class progression/info changes are unrelated, preserved and excluded from A4 acceptance. Exact bytes,
not HEAD alone, identify reviewed/built/tested source. Seven protected A1a/W1/universal files are gated.

All bulk is under `D:/AppData/Temp/opencode/`: `p14a4-review1/` retains original findings, probes,
repair/source/delta closure; `p14a4-build*/` and `p14a4-app*/` retain builds, manifests, snapshots, viewport
captures and results. Build2 recorded unrelated concurrent `infoSlice.js`/`progressionSlice.js` drift.
The final gate must distinguish scoped parity from full-current-tree compilation.

Optimized App/router/components and real browser Socket.IO/registered handlers execute; auth/provider,
ownership/lease/cloud are fixtures. Actual store placement emits real token creation; deliberate missing-
pool setup and condition commands use disposable fixture actors and registered P7. App receipts are
temporary-room/live-only. Checkpoint/new-epoch proof is focused server codec/reconstruction, not a live
cloud restart, OS-process crash, adversarial provider or second-device durability demonstration. Recorded
`Failed to fetch` page errors are disclosed, not attributed to a provider without evidence.1440/1024
captures prove bounded viewport fit, not physical-tablet/comprehensive accessibility certification.

No deployment readiness, all-creature-abilities or all-P14 claim. No migration/dependency upgrade.
Next: [A5 preparation](MYTHRILL_PROJECT_14_A5_CREATURE_PC_PREPARATION.md), exact owner block/consent/wear
with atomic A4 source payment, and separately decided healing consent with no equipment blocking.
