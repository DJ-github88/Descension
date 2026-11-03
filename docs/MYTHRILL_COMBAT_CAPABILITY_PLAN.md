# Mythrill â€” Prism combat capability plan (canonical)

Combat architecture lead Â· 2026-10-30 Â· **planning only.** No production code, commit, push, deployment,
migration or dependency change was made. Nothing here approves new gameplay rules; every rule question is
listed once in Â§F.

**HQ corrections (2026-10-30), binding on this plan:**
1. A11 combination applies only to compatible movement modifiers.
2. "One round" stays unresolved; timing is supported or GM-managed, never mapped automatically.
3. Save branches follow each admitted definition's exact semantics; there is no universal save rule.
4. Every unsupported secondary effect is preserved and visibly identified; partial automation is never called complete.
5. Static catalogue counts estimate breadth; they do not set priority alone.
6. Integrated attribute/buff consumers (sheet, client effects) are distinct from authoritative authored modifiers (movement only).

## 0. Ownership, identity and evidence

**Documentation ownership.** This file and roadmap Â§18 (a pointer to this file) belong to the combat
architecture lead. They hold the capability matrix and the milestone order **only**; status tables stay where
they live. Sol owns `ENGINEERING_STATE.md`, `CURRENT_PRIORITIES.md` and the candidate/integration status in
the coordination file. Sonnet owns storage reliability. Class HQ owns class design, resource schemas and
reconstruction. Argon's Minstrel handoff is read, not edited. Not edited by this pass: the ledger, priorities,
coordination file, any A10/A11 milestone, any code.

**Checkout verified.** `D:\VTT`, origin `https://github.com/DJ-github88/Descension.git`, branch `master`,
HEAD `89cddc2b`, dirty working tree (concurrent work preserved). This is not Tower of Mythrill. The old
`D:/Mythrill/Descension` path in `CLAUDE.md` is historical (ledger says so).

**Read.** Repo `CLAUDE.md`; `AGENTS.md` (scanned for documentation rules; none restrict this file). Roadmap (`MYTHRILL_P11_P14_ROADMAP.md` Â§1â€“Â§17), A10 and A11 milestones, `ENGINEERING_STATE.md`
(head, "Current work"), cross-track coordination (standing rules, entries 2026-10-27 â†’ 2026-10-29 21:08Z),
`CURRENT_PRIORITIES.md` (head), ability-compatibility checker reports and handoffs. **Inspected selectively:**
`server/services/{actorConsequences,spellPayments,sharedEffectLifecycle,reactionWindows,riposteExecution}.js`,
`server/shared/services/{authoredAbility,authoredEffect,sharedConditionProfile,sharedEffectTiming}.js`,
client `combatAttributes.js`, `effectProcessingService.js`, `combatStore.js` call sites. No historical test or
build was re-run. The compatibility checker was run once, read-only, over the catalogue (output outside the
repo) to size families; **its classifications and counts are static-analysis scoping, never gameplay acceptance.**

**Unavailable or not established (do not assume):**
- The sealed combined candidate lives at `D:/AppData/Temp/opencode/hq-minstrel-storage-a11-20261029-r1/`,
  outside the connected folder. Its facts below come from coordination records, not from reading its source.
- **Live-checkout installation: not done.** In `D:\VTT` the server markers for A11 (`movementCombination`) and
  Minstrel (`APPROVED_MINSTREL_SPELLS`) are absent; A11 and storage-r2 exist only as transfers under `handoff/`.
  (Client-side and storage-r2 install state were not individually checked.)
- **Independent review of the post-A11 deltas (Minstrel reconciliation, storage-r2): none recorded.** A11 itself
  has one bounded independent ACCEPT. Sol's targeted checks on the combined candidate are own checks.
- **Live-service verification: none for anything.** All connected-App evidence uses fixture auth, provider,
  ownership, lease and cloud boundaries; the nine P5 environment gates remain open.
- The rev3 consolidated combat proposal was never accessible (roadmap Â§2). The repo's checker reports are dated
  2026-10-27, before A10/A11 acceptance, and still label `authored-effect:v1` provisional.

**Contradictions reconciled.** `ENGINEERING_STATE.md` (last edited 19:48Z) still shows the A11 candidate as
`integrationReady:false` / storage defect open. The coordination file (21:08Z) is later: sealed candidate
`integrationReady:true`, `storageRepairAccepted:true`, persistent-profile App10 PASS. **Coordination is newer;
the ledger is stale** â€” Sol should update it. Roadmap Â§17 ends at A10 and does not mention A11 or Minstrel.

---

## A. Current state â€” what can actually be executed

**Players and GMs can, today (accepted baseline):** create, save and reload characters; run a connected
GM-led fight; make a basic weapon strike against a creature; take a creature hit with owner block, HP and
wear in one receipt; Defend, Shield Bash (manual result) and PC/creature Stunned with exact custody; declare
reactions privately and run the one original Riposte; see accepted results as narration and floating text;
pick single targets on the map and preview one area. Abilities authored in the Wizards (character, item,
creature) run as **one target, one direct DICE damage or healing, or one Stunned, or one direct effect plus
Stunned/flat movement change**, with owner approval, GM final amount, one atomic payment-and-consequence
command and once-only recovery. Expiry is manual or at the target's next turn start/end (C4). Class spells
run through P9 for three payment domains (Elemental Spheres, Musical Notes, Devotion Gauge) as plain
single-target damage/healing.

**Everything else is played by hand** with a visible reason; GM manual entry and physical dice always work.

**Not yet in the live checkout (candidate only):** A11 stacking/refresh of movement effects; the Minstrel
Opening Chord â†’ Resolving Strike pair; storage-r2 duplicate prevention.

| Item | Implemented | Tested | Integrated | Live-service verified |
|---|---|---|---|---|
| P7 consequence/receipts, P8, P9, P10 | yes | independently source-accepted | yes (accepted baseline) | no |
| P11â€“P13 (proficiency, strike, wear, narration, B1/B2, W, E1a) | yes | bounded reviews + App witnesses | yes | no |
| P14 C1â€“C4, A1â€“A9 | yes | repaired bounded ACCEPT + App PASS (qualified) | yes (App14 journey) | no |
| A10 composable effects | yes | review ACCEPT, handlers 11/11, App4 PASS (qualified) | yes (final A10 accepted) | no |
| A11 movement stacking/refresh | yes | review ACCEPT, handlers 9/9, App10 PASS (qualified) | **sealed candidate only** | no |
| Minstrel pair | yes (Argon) | handlers 9/9 reported; Sol 41 handlers, 40 client | **sealed candidate only** | no |
| storage-r2 | yes (Sonnet) | 51 storage tests; persistent App10: 0 identical duplicates over 5 reloads + pair run | **sealed candidate only** | no |

---

## B. Capability matrix

Scoping counts are from the catalogue checker (1,992 records, multi-label; **not acceptance**). 434 records are
intentionally manual-only (CR-1) and 431 are passive/descriptive; they are not "missing engine".

| Family | Existing implementation and evidence | Missing infrastructure vs adapter/content | Unsupported / unresolved | Owner Â· depends on |
|---|---|---|---|---|
| **Direct, mixed** | A1â€“A6 single direct; A10 direct + Stunned/movement, one P7 command (`spellPayments.bindEffect`) | Adapter: let class-paid PC sources use the bundle (M1) | More than one effect block; crit/alt (136) | Combat Â· M1 |
| **Delayed** | None | Infrastructure: C4 only knows "target's next turn start/end" | Delayed damage/"at end of round" | Combat Â· M2 |
| **Periodic** (56) | Legacy client-local `processOverTimeEffectsForTarget` from `combatStore`; not authoritative, no receipts. P7 record fields exist | Infrastructure: tick roll custody, C4 boundary command that may pay/damage | Tick roll vs fixed, start/end, death at tick, stacking | Combat Â· M2, creator |
| **Explicit timing** | C4: authenticated clock, exact-instance schedules (â‰¤256, â‰¤32 per boundary) | Infrastructure: N-round counters (`dueSequence` arithmetic is local) | Roster change mid-effect; "per round" vs per-turn | Combat Â· M2 |
| **Stat buffs/debuffs** (617) | Flat movement only (A10) with identity/stack/refresh (A11). P7 validates 17 modifier keys as data. Integrated client consumers (sheet `getTotalStatsWithEffects`, `getCreatureEffectiveStats`) read client effects; **authoritative** authored support is movement only | Infrastructure: statâ†’consumer registry (not an engine). Content: normalize vocabulary | Vocabulary is fragmented (`spirit` 25, `movement_speed` 18, `health` 14, `attack`/`all_rolls`/`attack_rolls`/`spell_attack`â€¦ ~40, `damage_reduction`/`damageReduction`) | Combat + Class HQ + Sonnet (attribute helper) Â· M3 |
| **Stacking/refresh/suppression/immunity/removal** | A11: different names add, same definition+source refreshes, â‰¥0 floor; GM exact-instance removal | A11 is movement-only (HQ); other families need their own policy; suppression/immunity none | Source leaves/dies; different source same effect (refused) | Combat Â· creator |
| **Saves, conditional, scaling** (130 / 72) | Nothing executes saves; Wizard lane refuses them | Adapter: GM-attested branch in approval (M1); formula grammar extensions | Who rolls, DC modifiers, half-damage rounding, `attr/K` rounding (D14-4) | Combat + creator Â· M1, M4 |
| **Damage/healing, temp HP, defenses, equipment** | P7 HP/temp pools; P12 strike/DR/wear; Defending | Adapter work per source | Mitigation order (D12-1â€¦6) | Combat |
| **Targeting, obstruction, areas, multi-target, propagation** (532) | B1 single pick; obstruction-aware aim (Sol); B2 Â§8.1 preview only | Infrastructure decision: P7 is source+â‰¤1 target (Â§C-limits) | D14-3 atomic? Chain-as-link vs travel; geometry G-series | Combat Â· M6 |
| **Triggered effects, reactions, chains** (210) | W private collector (no execution); E1a Riposte binder with parent/opportunity ids | Adapter: per-card binders; no generic evaluator | D13-1â€¦8; loop budget not frozen | Combat + creator Â· M7 |
| **Class resources** (1,319 payment-home gap) | P9: 3 domains with typed `classPayment{domain,before,after,price}` | Adapter per domain (descriptor + Class HQ-approved schema). 29 named domains in the catalogue; 3 have P9 room homes | Domain rules are Class HQ's; 13 Arcanoneer + 12 Martyr data conflicts | Class HQ + Combat Â· R-track |
| **Passives, summons, zones, transformations** (567) | None (class-local/manual) | Infrastructure: entity lifecycle FO-B/E/N | All of it | Class HQ + Combat Â· M9 |
| **Character/creature/item/Wizard authoring** | Wizardâ†’registryâ†’admission (`installedDefinitionRegistry`), library, item, creature producers (A1â€“A3) | Adapter: class-record admission by profile (M1) | Wizard refuses saves, crit, partial, class payment | Combat/Opus + Class HQ |
| **Persistence, reconnect, once-only, GM correction** | P7 receipts, `commandId` replay, "Check same command", retained rolls/approvals, GM exact removal | Storage growth is Sonnet's; live-service unproven | Server restart of WeakMap/lease state not shown | Sonnet, Sol |

### Proven limits (read in code)

1. **P7 command:** 1â€“2 actors, â‰¤32 condition operations, â‰¤64 KB, `classPayment` mode `sync` single-actor, mode
   `spell` needs an approval (`actorConsequences.js:129-190`).
2. **C4 boundary:** one transition expires at most 2 actors (`turn_expiry_capacity`), roster â‰¤64, schedules â‰¤256,
   â‰¤32 per boundary; the receipt text says "no payment, regeneration or recurring effects"
   (`sharedEffectLifecycle.js:40-41,86-88,104`). A boundary touches only the ending and starting actors, so 2 is
   enough for expiry **and** for ticks on those two.
3. **Bundles refuse class payment:** `authored-effect:v1` approvals require `classPayment === null`
   (`spellPayments.js:137`); the Wizard lane prices AP + mana only, one target, DICE only, no save/crit/partial
   (`authoredAbility.js:80-83,150`). P9 pays classes but has no rider. **The two lanes cannot compose.**
4. **Formula grammar:** authored lane `NdM(Â±K)`, â‰¤50 dice, sides 2â€“100 (`authoredAbility.js:8,16-19`).
5. **Per-ability allowlists do not scale:** per the coordination record, the Minstrel pair added
   `APPROVED_MINSTREL_SPELLS`/`APPROVED_MINSTREL_RESOLVERS` to shared execution files. Fine for one pair; not a pattern.
6. **Stat modifiers from shared records:** `combatAttributes` reads the client condition store; whether
   room-authoritative records reach it for characters is **not established** (verify in M3).

### Speculative risks (not demonstrated)

N-target payloads fitting 64 KB/32 ops; trigger loops (no trigger executor exists); schedule capacity in
long fights; source-removal cost at scale; checker counts overstating breadth (records counted in several groups).

### The scaling questions, answered

| Question | Position |
|---|---|
| P7 limits vs multi-target | Keep P7. First ship sequential per-target commands under one exchange id (payment once, per-target receipts, "partial" shown). Extend P7 to N actors only if the creator requires all-or-nothing (D14-3) â€” then a bounded contract freeze (suggest â‰¤8), not before. |
| Atomic install vs reactions/triggers | One command for payment + HP + install (proven). A triggered consequence is **its own command and receipt** (E1a precedent). No transaction across a chain. |
| Causality, frequency, loops | Reuse E1a identities (`opportunityId`, `parentKeys`): every triggered command records its cause and depth; a technical budget hands control to the GM ("continue/close"). Budgets are safety limits, never tabletop rules (roadmap Â§13). |
| Refresh/expiry identity, source removal | Identity = definition action id + exact source + version/terms (A11). Schedules keyed by `[target ref, recordId]`. **Source removal has no path except GM per-instance removal;** default stays "persists until expiry" until the creator decides. |
| Many class resources, no executor each | Keep one executor: `classPayment` is already domain-typed. Each domain = a descriptor (value/price validation, conservation, public view, home) approved by Class HQ. Unhomed domains stay manual. Retire per-ability allowlists into profile-driven admission (M1). |
| Formula safety, recorded rolls | Closed grammar only; never evaluate arbitrary text. Extend the grammar by named, tested forms (`attr/K`, missing-HP) after creator rounding decisions. The owner's roll is bound into the approval hash; GM final amount is adjudicated once; replay returns the original receipt. |
| Old definitions as profiles evolve | Installed definitions are immutable by hash. New semantics = new capability version (`authored-effect:v2`); old records keep working but do not combine (A11 pattern: pre-A11 records refuse combination). Refresh at changed terms refuses. No bulk migration planned. |

---

## C. Dependency-ordered roadmap

### M4A â€” integer attribute formula connection: frozen, implemented, App-verified (2026-11-02)

Creator direction: one pipeline, **Spell Wizard â†’ structured definition â†’ Prism execution â†’
persistence/recovery**. Authoring must preserve creative mechanics. Manual adjudication is an interim
boundary for unsupported deterministic mechanics, not completed implementation. M3A is installed;
its prior acceptance is carried with the qualifications in `handoff/m3a-delivery/reconciled/`.

The smallest settled formula increment extends the existing shared M1/P9 calculation contract:
one direct damage OR healing, a positive dice term plus signed integer/attribute terms. Full caster
attribute names (`strength`, `agility`, `constitution`, `intelligence`, `spirit`, `charisma`) mean
effective **scores**, not modifiers. Explicit `_modifier`/`mod` retains floor((scoreâˆ’10)/2);
`attribute/K` retains the accepted P9 floor. Add `attribute * K` and `(attribute * K)`, whole K=1â€¦10.
No general expression evaluation, fractional multiplier, target/state/resource variable, save or
resistance-order inference. Dice sides2â€¦100, total facesâ‰¤50, groupsâ‰¤8, formulaâ‰¤120 characters,
literalâ‰¤10000, attested scores0â€¦1000, aggregate constant absoluteâ‰¤10000. Invalid/missing/nonfinite
inputs refuse the whole operation, with no payment/outcome.

New immediate definitions use `authored-immediate:v2` (schema4, compiler `p14-m4-formula-1`);
v1 definitions and hashes retain their exact grammar/meaning. Existing registry/version/admission,
P7 writer, owner approval, GM final amount/reason and original-command recovery remain the pipeline.
Effective scores remain owner-attested through the existing sheet path (M3B authoritative attribute
consumers are not installed). The server independently verifies formula arithmetic against those
bounded inputs, not their derivation. Approval also captures exact source revision and the server's
public character/conditions projection hash (not hidden raw token fields); a source revision or
represented-state change requires explicit owner reapproval with retained faces. Target HP/revision changes require a
fresh exact GM command; target data is never a formula input. Private sheet edits require refreshed
owner consent and are not advertised as server-derived attributes. Formula totals remain signed;
the GM's final nonnegative amount/reason and existing HP floor/cap are unchanged, never an inferred
rounding or mitigation rule. This v2 increment's gameplay route is primary owner PC â†’ one creature;
creature sources, PC/self targets and composed-effect v2 formulas remain outside this increment.

Real catalogue calculation cohort: `bsk_unstoppable_onslaught` (`6d8 + strength * 2`),
`martyr_shield_of_faith` (`3d8 + spirit * 2`), `lunarch_apogee_cataclysm`
(`6d8 + intelligence * 2`). These full records remain intact: line/AoE, self-health or unhomed
resource prices, absorption shield, cooldowns and authored secondary prose are still unsupported.
They are calculation/refusal examples, never rewritten as direct single-target spells. Newly
Wizard-authored supported direct definitions exercise gameplay execution independently of spell name.

Actual creator questions isolated from settled work: `(maxHealth-currentHealth)/4` rounding and
overheal behavior; odd half-damage rounding; automated save rolling and resistance order.
No default is invented. Fractional scaling (e.g. agility*1.5) remains affected by rounding decisions.

**Acceptance (qualified).** Bounded calculation/authority review **ACCEPT** after repairs: a
crafted v2 hash with a non-authored definition ID could bypass installed checks; v2 now requires the
namespace plus unconditional installed verification at registration and consumption, and a raw
consequence without `approval` refuses. Verification compares the authoritative public token
projection, so hidden raw fields cannot false-refuse while represented changes still revalidate.
Six new registered-handler cases pass (constant/reading/attribute forgery, array/null inputs,
same-revision and authority-await source change, target CAS, writer refusal, once-only original
command). Affected server 53/mirrors and client 5 suites/37 pass; client lint clean; UI detector `[]`.

One coordinated App witness **PASS** on the exact optimized artifact (second compiler attempt;
first failed packaging on an object-spread/Babel export issue, preserved): capture
`30c7e4adâ€¦e783c`, assets `bb48de7fâ€¦154ad`, `frozenDrift:[]`. Real Wizard controls saved and
reopened both definitions, showed the unsupported fractional formula as manual, admitted and cast
them. `1d8 + intelligence * 2` face4 + INT16Ã—2 = 36; temp-first payment; dropped GM ACK recovered
by the same original command after reload (one receipt, faces retained). `1d8 + intelligence/4`
face4 + floor(16/4) = 8 healed to the existing cap behavior. No page errors.

Qualifications: provider/ownership/lease/cloud and player identity are fixtures (no real Firebase,
second device or live service). The witness ran headless Chrome with persisted private profiles
under an ACL-restricted external folder; one nav-selector derivative and test-only edits are
recorded. Eight unrelated Class/UI/Wave-A source paths arrived after the capture and are preserved;
every M4 runtime input and the server match the frozen capture. Not covered: creature sources,
PC/self targets, formula composed with class payment/effects, and healing/benefit consent UI.
This completes **this increment**, not full M4 (missing-HP, fractional and half-save forms remain).

### M4B - real-spell formula + pinned class payment + PC healing consent (R1/R2/R3/R4 repaired, accepted/closed, 2026-11-03)

Authorized narrow extension: `authored-immediate:v2` may compose with one reviewed catalogue-backed
typed class payment and with existing primary-PC healing target consent. The shared adapter recognizes
the three P9 domains from top-level record encodings (`elementalSpheres`, `musicalNotes`,
`devotionGauge`), but only the Martyr `devotionGauge` route is pinned, reviewed and production-tested
end to end. Nested `resourceValues` `devotion_*` / `*_sphere` / `note_*` forms remain refused and are
not claimed. No new domain, parallel payer or consent system is introduced; the existing bank planners,
typed conservation, target policy/P7 writer, approval and recovery remain the route. `classPayment` is
admitted only when the whole record matches a reviewed server/shared pin; the approval still carries
the source home's exact before/after and the existing `conserve` check.

Catalogue authority (R1 repair): `vtt-react/src/data/catalogueAbilityProfiles.json` (byte-equal server
mirror) pins the exact `{classId, spellId, recordHash}` and reviewed executable projection. The adapter,
`definitionFromWizard`/`compileDefinition` and cast-time `checkApproval` all require that pin. A
client-supplied record and its own matching hash are not authority. R2 refuses conflicting supported
resource encodings rather than choosing one. R3 requires the exact target-consent record at final
formula PC-healing acceptance; a missing record refuses before any payment, gain or healing. Admitted
versions stay immutable and revocation stays explicit; catalogue edits need a new reviewed pin and a
new explicit admission, never a silent rewrite.

Catalogue availability (R4 repair): stored-registry validation verifies immutable structure, canonical
bytes, definition hash, compiler version and descriptor without requiring a historical pin to remain
executable. Admission and cast still require the exact current pin. A retired/replaced pin leaves the
whole definition listed and exactly revocable with an explicit `catalogueEligibility` unavailable
reason, and refuses at approval/commit as `catalogue_provenance_untrusted`; unrelated definitions in
the room remain usable. No latest-version substitution or client-supplied-hash trust was added, and a
structurally tampered record still fails registry validation. N3: catalogue drafts accept exact
loaded-default `triggerConfig`/`mechanicsConfig` only; non-default executable settings remain refused.

Whole-record eligibility is enforced by the shared catalogue adapter: the complete source record is
preserved in the saved library record and hashed (`spellId`/`classId`/`recordHash`); only a clean
single-target direct DICE formula with the record's explicit AP/mana and one supported class operation
is executable. Editing an executable field invalidates the source binding rather than rewriting the
catalogue record. The reviewed cohort is **Martyr `martyr_restorative_prayer`** (whole record: 1 AP, 5
mana, Devotion +1, ranged 30 ft ally, `1d4 + spirit`, no cooldown/save/rider). `minstrel_resolving_strike`
remains on its accepted P9 route and is not migrated. `arc_spark_bolt` is not selected: its
Durability-ignore/combo requirements are not supported or covered by an approved contract.

Coverage matrix update (actual new routes, not broad catalogue admission): source primary owner PC ->
one distinct primary PC, direct healing only, with AP/mana + the reviewed Martyr Devotion operation;
target owner sees and accepts the exact proposed amount. The sphere/note adapter branches have unit
coverage only and no reviewed catalogue pin; they are not advertised as end-to-end routes. Browser
witnessing of the new route is **established on build identity** `m4b-r4-build-20261103-r1`
(capture `3ffc6e17...`, exit 0, no capture/live drift; asset manifest `219d60ef...`): normal App
prepare/save/reopen -> admit -> class-card cast -> owner `[4] + 18 = 22` -> target acceptance -> GM
final healing 22 -> receipt (`actualHealing 10`, AP 2->1 including temporary AP 1->0, mana base
10->8 plus temporary 3->0 = total 13->8, so the 5-mana price was paid as 3 temporary + 2 base,
Devotion 0->1, ally HP 20->30, temp HP 3 preserved). Payment conservation is asserted in the
witness; the App's "10->8" is the base-pool display only. Only this Martyr/Devotion route was browser-witnessed; sphere/note adapters
remain unit/shared-adapter coverage. M4B-specific dropped-ACK/reload was not separately re-run in the
App; the shared M4A App recovery and M4B production original-command replay cover the identical-command
path. Auth/provider/ownership/lease/cloud and player identity are fixtures; no live
Firebase or second physical device. The same script's auxiliary weapon-info UI sub-check passed its
desktop/keyboard/sheet/direct-click paths but its emulated touch tap did not open the pinned table
(recorded limit, not a Prayer failure). Targeted checks: M4A 6/6, M4B production 13/13, M4B client
10/10 and shared-mirror sync pass.
Regressions cover the doctored self-consistent record with its pin reason asserted, wrong or missing
identity, a removed pin preserving registry/list/revoke/unrelated execution, pending approval
retirement before commit, conflicting resource fields, missing target consent atomically and the
genuine pinned Prayer. Client scoped lint is clean; server files retain their existing brace/style
baseline.

### M6A — bounded ranged-circle area / multi-target execution (`authored-area:v1`): implemented & App-witnessed in isolated worktree (staged for guarded integration, 2026-11-03)

First bounded M6 increment implemented, independently reviewed, built, and App-witnessed in isolated worktree
`D:/AppData/Temp/opencode/m6a-area-execution-20261103/root` (handoff: [`handoff/m6a-delivery/HANDOFF.md`](../handoff/m6a-delivery/HANDOFF.md);
**not yet installed into live `D:\VTT` bytes**):
- **Capability & route:** `authored-area:v1` (compiler `p14-m6a-area-1`, schema `1`) for primary owner PC source → $1 \dots 8$ distinct placed creature targets on the same map (`MAX_AREA_TARGETS = 8`, `MAX_AREA_ACTORS = 9` including source; technical engine/receipt limits, not game rules; $>8$ refuses `area_target_capacity_exceeded` before payment, never truncates).
- **Geometry & privacy:** reuses B2 ranged-circle helpers (`circleCellOverlap`, `occupiedPreviewCells`, `visibleAreaCandidates`) for radii $5 \dots 60$ ft and ranges $0 \dots 120$ ft while distinguishing accepted B2 preview (`martyr_radiant_burst` 10-ft radius / 20-ft range) from newly tested M6A radii/grid cases. Advisory client preview only; eligibility/range/LoE remain GM-adjudicated. Hidden/unrendered tokens never leak through candidate counts, `actor_not_found` refusal details, or observer feed/chat.
- **Roll scope, formulas & payment:** `AREA_ROLL_PROCEDURE = 'shared-area-roll-proposed'` (one owner roll proposes `roll.total` per target; GM adjudicates per-target `finalAmount` and `adjustmentReason`; never duplicates shared dice faces onto per-target objects; explicitly flagged as a proposed first-profile rule requiring creator confirmation). Supports M4A formulas including integer divisors (`attr/2`, `attr/3`, `attr/K` floored) and M4B typed class payments (`elementalSpheres`, `musicalNotes`, `devotionGauge`). Catalogue AoE candidates are rejected only on their true non-formula whole-record blockers; proven via real Spell Wizard authoring (`Prism Arcane Pulse`, `2d6 + intelligence/2`).
- **Verification:** server production tests + regressions `193/193` (`p14m6aAreaExecution.production.test.js` 10/10); client `4 suites / 39 tests`; independent review (`bb76f68f-73a7-4117-ab1b-aff31aebc02c`) findings repaired; detached build exit `0` (assets `3f18acbf...`); multi-browser App witness `m6a-area-app-browser.cjs` PASS (`result.json.passed: true`).

Each milestone unlocks a family, has one observable workflow and a completion boundary (focused tests, one
normal-App persistent-profile proof, one bounded review). Scoping counts are from Â§B.

**First mini-campaign needs**

- **M0 â€” Land and verify the sealed candidate** (Sol). Install A11 + Minstrel + storage-r2 into `D:\VTT`; one
  independent bounded review of the post-A11 deltas; re-run affected checks from the installed tree; update the
  ledger. *Workflow:* ordinary GM + owner run the Minstrel pair and a movement refresh in the live checkout.
  *Boundary:* installed bytes match the sealed identity; review recorded. Live-service gates stay separate.
- **M1 â€” Class-paid composed effect with GM-attested save branch** (Â§D). Next implementation.
- **M2 â€” Round-counted expiry (N rounds)** on C4, plus the periodic-tick decision record. *Workflow:* a 2-round
  slow expires at the exact boundary; roster change refuses to a labelled manual state. *Boundary:* schedules
  survive reconnect; no browser timers. Unlocks the duration family (454 static) for single targets.
- **M3 â€” PC-target composed effects + attribute-modifier consumers.** Reuse A5/A9 consent for the target owner;
  one statâ†’consumer table for attribute modifiers (via Sonnet's helper); normalized vocabulary from Class HQ.
  *Workflow:* an ally buff (Minstrel rhythm) and a creature rider on a PC change real effective stats and expire.
  Unlocks ally/self buffs and creature riders on players.

**Wider automation**

- **M4 â€” Conditional outcomes and formulas:** half-damage/partial saves, selected crit/alt forms, `attr/K` and
  missing-HP grammar. Needs rounding decisions.
- **M5 â€” Periodic ticks** (damage/heal over time, absorb shields) on C4 v2: boundary commands may pay/damage; a tick
  roll rule. Small breadth (56 static) â€” after M2/M4, not before.
- **M6 â€” Multi-target and area execution:** sequential per-target exchange; B2 selection; N-actor P7 only on D14-3.
- **M7 â€” Triggered/reaction consequences**, one card family at a time through P13B binders.

**Long-term class/ancestry breadth (parallel tracks)**

- **R-track â€” class-resource domains, one at a time** (29 named, 3 homed): contract, Class HQ approval,
  descriptor, tests. Highest breadth, but only after Class HQ freezes each domain's rules.
- **M9 â€” Entity lifecycle:** summons, zones, transformations, links, source removal (FO-B/E/N).
- **M10 â€” Passives/ancestry/items** as installed profiles with the same registry and refusal discipline.

None of M4â€“M10 blocks a first mini-campaign; manual fallbacks remain.

---

## D. Next implementation milestone â€” M1

### Comparison (why not the others first)

| Candidate | Value (evidence) | Dependencies / open decisions | Verdict |
|---|---|---|---|
| **Class-paid composed effect + save branch** | Removes the one structural seam (Â§B limit 3); 67 records are payable in the three homed classes, only 4 are fully compatible; 13 are single-target with a buff/debuff gap (6 with no other gap); first-campaign group C | Payment, identity, consent, refresh all accepted; timing GM-managed; Class HQ confirms one profile entry (Â§F) | **Next** |
| Periodic effects | 56 records (~3%); legacy ticker is client-local | Tick roll custody, changes C4's accepted "no recurring" contract, needs M2 and rules | Later (M5) |
| Numeric modifiers (more stats) | Biggest effect family (617) | Consumers per stat, fragmented vocabulary, mostly ally/self targets â†’ needs PC consent (M3) and Sonnet's attribute contract | After M1/M2 |
| PC-target bundles | Valuable for creature riders on players | Needs consumer evidence on the PC side and bundle consent text | M3 |
| Targeting / reactions | 532 / 210 records | Blocked on D14-3 and D13-1â€¦8 plus an N-actor choice | M6/M7 |

### M1 â€” Class-paid composed effect with GM-attested save branch

**Why now.** It composes two accepted lanes (P9 class payment; A10/A11 bundles) for one composed effect,
without another per-spell allowlist, engine, clock or consent surface.

**M1 status (2026-10-30):** implemented and delivered to Sol (`handoff/m1-delivery/`); bounded review ACCEPT WITH NOTES
after fixes; build/App PASS on the verified base. Runtime-disabled until Class HQ confirms the Rime-Iron Clasp profile.

### M1 frozen scope (HQ-accepted direction, 2026-10-30)

**Base.** The latest coherent combined candidate `hq-minstrel-storage-a11-20261029-r1` (working-byte `4829cc5aâ€¦`,
assets `e12aba1câ€¦`), which Sol now treats as the accepted base (coordination, 2026-10-30). No shared runtime
file is edited while Sol lands it. Implementation starts on the landed bytes, re-hashed at entry.

**One supported composed effect: new capability `class-effect:v1`.** `p9-spell:v1` and `authored-effect:v1`
keep their meanings byte-for-byte. A closed compiler (`class-effect-1`) accepts only this shape; anything else
is refused with a reason and stays manual:
- **Route.** Source: an exact owner primary PC who knows the class record (existing P9 prerequisites). Target:
  one exact placed creature. No PC targets.
- **Price.** Authored AP + mana + the existing typed `classPayment` for the three homed domains, planned by the
  existing client planners and conserved by `spellPayments`. No new domain.
- **Direct.** One DICE damage OR healing, in the existing P9 formula vocabulary (`NdMÂ±K`, attribute score,
  `attr/K` floored, attribute modifier), read from `combatAttributes(character)`. These effective attributes
  come from the *integrated* sheet path (equipment plus client-side buff/debuff effects). That is not
  authoritative modifier support: the only authoritative authored modifier remains A10/A11 movement.
- **Rider.** Exactly one `debuffConfig` effect that is a flat movement change expressible as the canonical A10
  movement record (whole 5 ft, âˆ’60â€¦+60), with consistent encodings (`statPenalty.movement_speed` = `movementPenalty`).
- **Branches.** Derived from each definition's own structure, never from a general rule. M1 supports two
  shapes: no save, or a save located in the rider block with that block's `saveOutcome: "negates"`. Anything
  else is refused: a save on the damage, `halves_effects`/`half_damage`, saves in several blocks, or
  conflicting encodings.
- **Timing.** The authored duration is shown verbatim and the instance is `gm-manual` (the GM removes it).
  There is no round-to-turn mapping and no C4 schedule. A structured boundary is used only where the record
  itself already authors one; Rime-Iron Clasp does not.
- **Combination.** The rider is a compatible movement modifier, so A11 applies exactly as for authored movement,
  with identity = the class-effect definition action id plus the exact source. It is not generalized to any
  other rider family.
- **Disclosure.** Each admitted record needs a reviewed, hash-pinned profile entry
  (`server/shared/data/classEffectProfiles.json`) listing its *Automated*, *GM-managed* and *Not automated*
  parts. If the record bytes stop matching the pinned hash, admission refuses. Owner approval, GM confirmation,
  receipt and narration say **"partially automated"** and list every not-automated item. They never say complete.

**Rime-Iron Clasp (`arc_frost_touch`; RI-6 content, read, never edited) resolves to:**

| Authored part | M1 treatment |
|---|---|
| 1 AP, 4 mana, rime Ã—2 (Elemental Spheres; `enhancesCombo: "ice_ice"` = the Frost Spike recipe, existing P9 metadata) | Automated payment |
| 1d8 + intelligence/4 rime damage | Automated: owner roll and floored effective INT bound in the approval; GM final amount + reason |
| Frozen Limbs: movement âˆ’10 ft | Automated, *failed* branch only |
| Constitution DC 12, negates, inside `debuffConfig` | Branch: the GM records the table's result. *Saved*: damage only. *Failed*: damage + Frozen Limbs. Damage applies in both branches (`damageConfig` has no save). The VTT does no save math |
| "for 1 round" | GM-managed: shown verbatim; the GM removes the exact instance |
| "Frozen targets take +1d4 bonus damage from the next physical attack against them" (description prose) | **Not automated.** Listed on every surface; GM applies |
| Touch range, empty `targetRestrictions` | Range advisory (B1); M1 route narrows to creature targets |

Sources for this authored meaning: the record (`arcanoneerData.js:2205`). The Wizard places *Save Outcome*
inside the debuff configuration (`DebuffEffects.jsx:1274-1290`). The card renders it on the debuff line as
"(negate)" (`UnifiedSpellCard.jsx:3580-3595`). Frost Spike combo: `arcanoneerData.js:1246`. P9 formula reader:
`spellConsequence.js:83-125`. The Laws draft and Class HQ docs define neither saves nor "one round".

**Consent-bound outcome.** Owner approval binds: exact source/target refs and revisions; the price with sphere
before/after; the retained roll and attribute reading; both branches' complete consequences; the GM-managed
timing text; and the not-automated list. It spends nothing. GM confirmation picks one bound branch and the
final amount. Refusals:
- any unbound branch or changed timing â†’ refused;
- a changed bank or attributes â†’ `owner_reapproval_required`, keeping the retained roll.

**Atomic payment and recovery.** One P7 command, 2 actors, â‰¤3 operations (inside proven limits):
- source: AP, mana and spell-mode `classPayment`;
- target: HP, plus on *failed* the movement record (with A11's remove when refreshing).

Recovery uses the existing path: same-`commandId` replay, *Check same command*, consumed approval, original
receipt. The public receipt carries the branch and outcome, with no bank internals or private GM evidence.

**Files (prospective, on the landed candidate).**
- New: `server/shared/services/classEffect.js` + client mirror; `server/shared/data/classEffectProfiles.json`
  + mirror; `server/tests/p14m1ClassEffect.production.test.js`; client `__tests__/m1ClassEffect.test.js`;
  `vtt-react/verification/p14/class-effect-app-browser.cjs`.
- Edited:
  - `server/services/spellPayments.js` (validate/bind);
  - `server/services/actorConsequences.js` (identity whitelist, class-effect movement records only);
  - `server/shared/services/sharedConditionProfile.js` + mirror (occurrence prefix);
  - `scripts/sync-shared.js`;
  - client `services/{spellConsequence,spellConsequenceService,acceptedResultFeed}.js` and
    `components/hud/SpellConsequencePanel.{jsx,css}`.
- Not touched: class data (RI-6 lock); resource planners/contracts (Class HQ); attribute helper and storage
  (Sonnet); Minstrel allowlists; A10/A11 meaning.

**Non-goals.** Mapping rounds to turns; C4 counters; other stats or riders; PC targets; other save outcomes;
VTT save math; automating the +1d4; areas; periodic effects; reactions; new domains. Further records join later
only through a reviewed profile entry, with no code change.

**Acceptance.**
- Registered-handler tests:
  - both branches are atomic;
  - refused with nothing spent: an unbound branch, changed timing, stale bank or attributes, wrong domain,
    creature source, PC target, a hash-mismatched record, unsupported save shapes;
  - A11 add/refresh/refusal with a class-effect rider beside an authored one;
  - a lost ACK yields one receipt;
  - privacy sentinel;
  - P9/A10/A11/Minstrel regressions.
- Normal App, one persistent GM profile: the Arcanoneer casts twice (*saved*; then *failed*, speed 35 â†’ 25 ft).
  The not-automated line is visible to owner, GM and observer. The GM removes the instance â†’ 35 ft. A dropped
  ACK is recovered. Narration appears once.
- One bounded independent review: payment atomicity, branch binding, disclosure completeness, privacy.

**Safe parallel work (no shared runtime edits).** Sol lands the candidate. Class HQ reviews the Rime-Iron Clasp
profile entry. Sonnet continues storage. Checker owners refresh the profile labels.

---

## E. Architectural confidence

**Retain unchanged:** P7 writer/receipts/once-only replay; admission registry with capability+hash; owner
consent + GM final; condition profile with identities; C4 authenticated clock; domain-typed `classPayment`;
accepted-result narration; recovery pattern ("Check same command").

**Extend (adapters/consumers, no rewrite):** bundle lane accepts class payment (M1); C4 N-round counters (M2);
a statâ†’consumer table (M3); per-card reaction binders (M7); resource-domain descriptors (R-track).

**Demonstrated limitations needing a changed contract:** (1) C4 boundary commands may not pay or damage â€”
periodic ticks need a separately frozen C4 v2 (M5). (2) P7's 2-actor bound is real for multi-target; a contract
change is required **only if** the creator demands all-or-nothing (D14-3). (3) Per-ability allowlists must give
way to profile-driven admission. **No speculative rewrite is warranted**; nothing observed argues against P7,
the registry or C4 as foundations.

---

## F. Consolidated decision list

**Creator decisions required for M1: none.** Every rule question touching Rime-Iron Clasp is either resolved from
current records (where the save applies; damage unaffected) or carried as GM-managed / not automated ("one
round", the +1d4, how a save is rolled).

**Class HQ confirmation required for M1 (not creator):**
1. The Rime-Iron Clasp profile entry's *Automated* / *GM-managed* / *Not automated* split.
2. That `debuffConfig.saveOutcome` scopes to its own block, as the Wizard authors it.

**Open creator decisions, not blocking M1:**
- what "one round" means for automatic expiry;
- how a Prism save is rolled and by whom (needed only for VTT save math);
- what "halves" means for a movement rider;
- whether "Frozen" in the +1d4 text means Frozen Limbs (needed only to automate it);
- N-round durations and roster changes (M2);
- what happens to effects when the source leaves;
- D14-3 atomic multi-target;
- D14-4 rounding (M1 uses the accepted P9 floor unchanged);
- periodic tick rules;
- D12/D13 as listed in the roadmap.

**Class HQ (ongoing):** class-data conflicts, resource schemas per domain, stat vocabulary.

---

## How close are we, what is the biggest remaining obstacle, and what do we build next?

**How close.** The execution foundation is sound and proven at the single-target level: one owner-consented,
GM-confirmed, atomic, once-only command that can pay, change HP and install an effect with exact expiry and
stacking. A first mini-campaign can run now with manual fallbacks for everything else. What stands between today
and comprehensive automation is breadth, not a missing core: no ability that mixes a class payment with a
rider, no save, no multi-round duration, no multi-target, no triggers, and about 26 of 29 named class-resource economies
without a room home. Nothing is live-service verified, and the newest work is not yet installed in the checkout.

**Biggest remaining obstacle.** For the first campaign: the two accepted lanes (class-paid spells vs
Wizard-authored effects) cannot compose, so every interesting class spell falls back to hand-play. For the
whole vision: class-resource economies are the widest gap (1,319 catalogue records by static count), and each
one needs Class HQ's frozen rules before engineering can help.

**What we build next.** First land and independently verify the sealed A11 + Minstrel + storage-r2 candidate (M0).
Then build **M1 â€” class-paid composed effect with a GM-attested save branch**, proving it on Rime-Iron Clasp.
Not periodic effects first: they touch only ~3% of the catalogue and need decisions the other milestones
produce. M1 needs no creator decision; Class HQ confirms one profile entry.

