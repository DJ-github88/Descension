# Mythrill — Prism combat capability plan (canonical)

Combat architecture lead · 2026-10-30 · **planning only.** No production code, commit, push, deployment,
migration or dependency change was made. Nothing here approves new gameplay rules; every rule question is
listed once in §F.

**HQ corrections (2026-10-30), binding on this plan:**
1. A11 combination applies only to compatible movement modifiers.
2. "One round" stays unresolved; timing is supported or GM-managed, never mapped automatically.
3. Save branches follow each admitted definition's exact semantics; there is no universal save rule.
4. Every unsupported secondary effect is preserved and visibly identified; partial automation is never called complete.
5. Static catalogue counts estimate breadth; they do not set priority alone.
6. Integrated attribute/buff consumers (sheet, client effects) are distinct from authoritative authored modifiers (movement only).

## 0. Ownership, identity and evidence

**Documentation ownership.** This file and roadmap §18 (a pointer to this file) belong to the combat
architecture lead. They hold the capability matrix and the milestone order **only**; status tables stay where
they live. Sol owns `ENGINEERING_STATE.md`, `CURRENT_PRIORITIES.md` and the candidate/integration status in
the coordination file. Sonnet owns storage reliability. Class HQ owns class design, resource schemas and
reconstruction. Argon's Minstrel handoff is read, not edited. Not edited by this pass: the ledger, priorities,
coordination file, any A10/A11 milestone, any code.

**Checkout verified.** `D:\VTT`, origin `https://github.com/DJ-github88/Descension.git`, branch `master`,
HEAD `89cddc2b`, dirty working tree (concurrent work preserved). This is not Tower of Mythrill. The old
`D:/Mythrill/Descension` path in `CLAUDE.md` is historical (ledger says so).

**Read.** Repo `CLAUDE.md`; `AGENTS.md` (scanned for documentation rules; none restrict this file). Roadmap (`MYTHRILL_P11_P14_ROADMAP.md` §1–§17), A10 and A11 milestones, `ENGINEERING_STATE.md`
(head, "Current work"), cross-track coordination (standing rules, entries 2026-10-27 → 2026-10-29 21:08Z),
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
- The rev3 consolidated combat proposal was never accessible (roadmap §2). The repo's checker reports are dated
  2026-10-27, before A10/A11 acceptance, and still label `authored-effect:v1` provisional.

**Contradictions reconciled.** `ENGINEERING_STATE.md` (last edited 19:48Z) still shows the A11 candidate as
`integrationReady:false` / storage defect open. The coordination file (21:08Z) is later: sealed candidate
`integrationReady:true`, `storageRepairAccepted:true`, persistent-profile App10 PASS. **Coordination is newer;
the ledger is stale** — Sol should update it. Roadmap §17 ends at A10 and does not mention A11 or Minstrel.

---

## A. Current state — what can actually be executed

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
Opening Chord → Resolving Strike pair; storage-r2 duplicate prevention.

| Item | Implemented | Tested | Integrated | Live-service verified |
|---|---|---|---|---|
| P7 consequence/receipts, P8, P9, P10 | yes | independently source-accepted | yes (accepted baseline) | no |
| P11–P13 (proficiency, strike, wear, narration, B1/B2, W, E1a) | yes | bounded reviews + App witnesses | yes | no |
| P14 C1–C4, A1–A9 | yes | repaired bounded ACCEPT + App PASS (qualified) | yes (App14 journey) | no |
| A10 composable effects | yes | review ACCEPT, handlers 11/11, App4 PASS (qualified) | yes (final A10 accepted) | no |
| A11 movement stacking/refresh | yes | review ACCEPT, handlers 9/9, App10 PASS (qualified) | **sealed candidate only** | no |
| Minstrel pair | yes (Argon) | handlers 9/9 reported; Sol 41 handlers, 40 client | **sealed candidate only** | no |
| storage-r2 | yes (Sonnet) | 51 storage tests; persistent App10: 0 identical duplicates over 5 reloads + pair run | **sealed candidate only** | no |

---

## B. Capability matrix

Scoping counts are from the catalogue checker (1,992 records, multi-label; **not acceptance**). 434 records are
intentionally manual-only (CR-1) and 431 are passive/descriptive; they are not "missing engine".

| Family | Existing implementation and evidence | Missing infrastructure vs adapter/content | Unsupported / unresolved | Owner · depends on |
|---|---|---|---|---|
| **Direct, mixed** | A1–A6 single direct; A10 direct + Stunned/movement, one P7 command (`spellPayments.bindEffect`) | Adapter: let class-paid PC sources use the bundle (M1) | More than one effect block; crit/alt (136) | Combat · M1 |
| **Delayed** | None | Infrastructure: C4 only knows "target's next turn start/end" | Delayed damage/"at end of round" | Combat · M2 |
| **Periodic** (56) | Legacy client-local `processOverTimeEffectsForTarget` from `combatStore`; not authoritative, no receipts. P7 record fields exist | Infrastructure: tick roll custody, C4 boundary command that may pay/damage | Tick roll vs fixed, start/end, death at tick, stacking | Combat · M2, creator |
| **Explicit timing** | C4: authenticated clock, exact-instance schedules (≤256, ≤32 per boundary) | Infrastructure: N-round counters (`dueSequence` arithmetic is local) | Roster change mid-effect; "per round" vs per-turn | Combat · M2 |
| **Stat buffs/debuffs** (617) | Flat movement only (A10) with identity/stack/refresh (A11). P7 validates 17 modifier keys as data. Integrated client consumers (sheet `getTotalStatsWithEffects`, `getCreatureEffectiveStats`) read client effects; **authoritative** authored support is movement only | Infrastructure: stat→consumer registry (not an engine). Content: normalize vocabulary | Vocabulary is fragmented (`spirit` 25, `movement_speed` 18, `health` 14, `attack`/`all_rolls`/`attack_rolls`/`spell_attack`… ~40, `damage_reduction`/`damageReduction`) | Combat + Class HQ + Sonnet (attribute helper) · M3 |
| **Stacking/refresh/suppression/immunity/removal** | A11: different names add, same definition+source refreshes, ≥0 floor; GM exact-instance removal | A11 is movement-only (HQ); other families need their own policy; suppression/immunity none | Source leaves/dies; different source same effect (refused) | Combat · creator |
| **Saves, conditional, scaling** (130 / 72) | Nothing executes saves; Wizard lane refuses them | Adapter: GM-attested branch in approval (M1); formula grammar extensions | Who rolls, DC modifiers, half-damage rounding, `attr/K` rounding (D14-4) | Combat + creator · M1, M4 |
| **Damage/healing, temp HP, defenses, equipment** | P7 HP/temp pools; P12 strike/DR/wear; Defending | Adapter work per source | Mitigation order (D12-1…6) | Combat |
| **Targeting, obstruction, areas, multi-target, propagation** (532) | B1 single pick; obstruction-aware aim (Sol); B2 §8.1 preview only | Infrastructure decision: P7 is source+≤1 target (§C-limits) | D14-3 atomic? Chain-as-link vs travel; geometry G-series | Combat · M6 |
| **Triggered effects, reactions, chains** (210) | W private collector (no execution); E1a Riposte binder with parent/opportunity ids | Adapter: per-card binders; no generic evaluator | D13-1…8; loop budget not frozen | Combat + creator · M7 |
| **Class resources** (1,319 payment-home gap) | P9: 3 domains with typed `classPayment{domain,before,after,price}` | Adapter per domain (descriptor + Class HQ-approved schema). 29 named domains in the catalogue; 3 have P9 room homes | Domain rules are Class HQ's; 13 Arcanoneer + 12 Martyr data conflicts | Class HQ + Combat · R-track |
| **Passives, summons, zones, transformations** (567) | None (class-local/manual) | Infrastructure: entity lifecycle FO-B/E/N | All of it | Class HQ + Combat · M9 |
| **Character/creature/item/Wizard authoring** | Wizard→registry→admission (`installedDefinitionRegistry`), library, item, creature producers (A1–A3) | Adapter: class-record admission by profile (M1) | Wizard refuses saves, crit, partial, class payment | Combat/Opus + Class HQ |
| **Persistence, reconnect, once-only, GM correction** | P7 receipts, `commandId` replay, "Check same command", retained rolls/approvals, GM exact removal | Storage growth is Sonnet's; live-service unproven | Server restart of WeakMap/lease state not shown | Sonnet, Sol |

### Proven limits (read in code)

1. **P7 command:** 1–2 actors, ≤32 condition operations, ≤64 KB, `classPayment` mode `sync` single-actor, mode
   `spell` needs an approval (`actorConsequences.js:129-190`).
2. **C4 boundary:** one transition expires at most 2 actors (`turn_expiry_capacity`), roster ≤64, schedules ≤256,
   ≤32 per boundary; the receipt text says "no payment, regeneration or recurring effects"
   (`sharedEffectLifecycle.js:40-41,86-88,104`). A boundary touches only the ending and starting actors, so 2 is
   enough for expiry **and** for ticks on those two.
3. **Bundles refuse class payment:** `authored-effect:v1` approvals require `classPayment === null`
   (`spellPayments.js:137`); the Wizard lane prices AP + mana only, one target, DICE only, no save/crit/partial
   (`authoredAbility.js:80-83,150`). P9 pays classes but has no rider. **The two lanes cannot compose.**
4. **Formula grammar:** authored lane `NdM(±K)`, ≤50 dice, sides 2–100 (`authoredAbility.js:8,16-19`).
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
| P7 limits vs multi-target | Keep P7. First ship sequential per-target commands under one exchange id (payment once, per-target receipts, "partial" shown). Extend P7 to N actors only if the creator requires all-or-nothing (D14-3) — then a bounded contract freeze (suggest ≤8), not before. |
| Atomic install vs reactions/triggers | One command for payment + HP + install (proven). A triggered consequence is **its own command and receipt** (E1a precedent). No transaction across a chain. |
| Causality, frequency, loops | Reuse E1a identities (`opportunityId`, `parentKeys`): every triggered command records its cause and depth; a technical budget hands control to the GM ("continue/close"). Budgets are safety limits, never tabletop rules (roadmap §13). |
| Refresh/expiry identity, source removal | Identity = definition action id + exact source + version/terms (A11). Schedules keyed by `[target ref, recordId]`. **Source removal has no path except GM per-instance removal;** default stays "persists until expiry" until the creator decides. |
| Many class resources, no executor each | Keep one executor: `classPayment` is already domain-typed. Each domain = a descriptor (value/price validation, conservation, public view, home) approved by Class HQ. Unhomed domains stay manual. Retire per-ability allowlists into profile-driven admission (M1). |
| Formula safety, recorded rolls | Closed grammar only; never evaluate arbitrary text. Extend the grammar by named, tested forms (`attr/K`, missing-HP) after creator rounding decisions. The owner's roll is bound into the approval hash; GM final amount is adjudicated once; replay returns the original receipt. |
| Old definitions as profiles evolve | Installed definitions are immutable by hash. New semantics = new capability version (`authored-effect:v2`); old records keep working but do not combine (A11 pattern: pre-A11 records refuse combination). Refresh at changed terms refuses. No bulk migration planned. |

---

## C. Dependency-ordered roadmap

Each milestone unlocks a family, has one observable workflow and a completion boundary (focused tests, one
normal-App persistent-profile proof, one bounded review). Scoping counts are from §B.

**First mini-campaign needs**

- **M0 — Land and verify the sealed candidate** (Sol). Install A11 + Minstrel + storage-r2 into `D:\VTT`; one
  independent bounded review of the post-A11 deltas; re-run affected checks from the installed tree; update the
  ledger. *Workflow:* ordinary GM + owner run the Minstrel pair and a movement refresh in the live checkout.
  *Boundary:* installed bytes match the sealed identity; review recorded. Live-service gates stay separate.
- **M1 — Class-paid composed effect with GM-attested save branch** (§D). Next implementation.
- **M2 — Round-counted expiry (N rounds)** on C4, plus the periodic-tick decision record. *Workflow:* a 2-round
  slow expires at the exact boundary; roster change refuses to a labelled manual state. *Boundary:* schedules
  survive reconnect; no browser timers. Unlocks the duration family (454 static) for single targets.
- **M3 — PC-target composed effects + attribute-modifier consumers.** Reuse A5/A9 consent for the target owner;
  one stat→consumer table for attribute modifiers (via Sonnet's helper); normalized vocabulary from Class HQ.
  *Workflow:* an ally buff (Minstrel rhythm) and a creature rider on a PC change real effective stats and expire.
  Unlocks ally/self buffs and creature riders on players.

**Wider automation**

- **M4 — Conditional outcomes and formulas:** half-damage/partial saves, selected crit/alt forms, `attr/K` and
  missing-HP grammar. Needs rounding decisions.
- **M5 — Periodic ticks** (damage/heal over time, absorb shields) on C4 v2: boundary commands may pay/damage; a tick
  roll rule. Small breadth (56 static) — after M2/M4, not before.
- **M6 — Multi-target and area execution:** sequential per-target exchange; B2 selection; N-actor P7 only on D14-3.
- **M7 — Triggered/reaction consequences**, one card family at a time through P13B binders.

**Long-term class/ancestry breadth (parallel tracks)**

- **R-track — class-resource domains, one at a time** (29 named, 3 homed): contract, Class HQ approval,
  descriptor, tests. Highest breadth, but only after Class HQ freezes each domain's rules.
- **M9 — Entity lifecycle:** summons, zones, transformations, links, source removal (FO-B/E/N).
- **M10 — Passives/ancestry/items** as installed profiles with the same registry and refusal discipline.

None of M4–M10 blocks a first mini-campaign; manual fallbacks remain.

---

## D. Next implementation milestone — M1

### Comparison (why not the others first)

| Candidate | Value (evidence) | Dependencies / open decisions | Verdict |
|---|---|---|---|
| **Class-paid composed effect + save branch** | Removes the one structural seam (§B limit 3); 67 records are payable in the three homed classes, only 4 are fully compatible; 13 are single-target with a buff/debuff gap (6 with no other gap); first-campaign group C | Payment, identity, consent, refresh all accepted; timing GM-managed; Class HQ confirms one profile entry (§F) | **Next** |
| Periodic effects | 56 records (~3%); legacy ticker is client-local | Tick roll custody, changes C4's accepted "no recurring" contract, needs M2 and rules | Later (M5) |
| Numeric modifiers (more stats) | Biggest effect family (617) | Consumers per stat, fragmented vocabulary, mostly ally/self targets → needs PC consent (M3) and Sonnet's attribute contract | After M1/M2 |
| PC-target bundles | Valuable for creature riders on players | Needs consumer evidence on the PC side and bundle consent text | M3 |
| Targeting / reactions | 532 / 210 records | Blocked on D14-3 and D13-1…8 plus an N-actor choice | M6/M7 |

### M1 — Class-paid composed effect with GM-attested save branch

**Why now.** It composes two accepted lanes (P9 class payment; A10/A11 bundles) for one composed effect,
without another per-spell allowlist, engine, clock or consent surface.

**M1 status (2026-10-30):** implemented and delivered to Sol (`handoff/m1-delivery/`); bounded review ACCEPT WITH NOTES
after fixes; build/App PASS on the verified base. Runtime-disabled until Class HQ confirms the Rime-Iron Clasp profile.

### M1 frozen scope (HQ-accepted direction, 2026-10-30)

**Base.** The latest coherent combined candidate `hq-minstrel-storage-a11-20261029-r1` (working-byte `4829cc5a…`,
assets `e12aba1c…`), which Sol now treats as the accepted base (coordination, 2026-10-30). No shared runtime
file is edited while Sol lands it. Implementation starts on the landed bytes, re-hashed at entry.

**One supported composed effect: new capability `class-effect:v1`.** `p9-spell:v1` and `authored-effect:v1`
keep their meanings byte-for-byte. A closed compiler (`class-effect-1`) accepts only this shape; anything else
is refused with a reason and stays manual:
- **Route.** Source: an exact owner primary PC who knows the class record (existing P9 prerequisites). Target:
  one exact placed creature. No PC targets.
- **Price.** Authored AP + mana + the existing typed `classPayment` for the three homed domains, planned by the
  existing client planners and conserved by `spellPayments`. No new domain.
- **Direct.** One DICE damage OR healing, in the existing P9 formula vocabulary (`NdM±K`, attribute score,
  `attr/K` floored, attribute modifier), read from `combatAttributes(character)`. These effective attributes
  come from the *integrated* sheet path (equipment plus client-side buff/debuff effects). That is not
  authoritative modifier support: the only authoritative authored modifier remains A10/A11 movement.
- **Rider.** Exactly one `debuffConfig` effect that is a flat movement change expressible as the canonical A10
  movement record (whole 5 ft, −60…+60), with consistent encodings (`statPenalty.movement_speed` = `movementPenalty`).
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
| 1 AP, 4 mana, rime ×2 (Elemental Spheres; `enhancesCombo: "ice_ice"` = the Frost Spike recipe, existing P9 metadata) | Automated payment |
| 1d8 + intelligence/4 rime damage | Automated: owner roll and floored effective INT bound in the approval; GM final amount + reason |
| Frozen Limbs: movement −10 ft | Automated, *failed* branch only |
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
- any unbound branch or changed timing → refused;
- a changed bank or attributes → `owner_reapproval_required`, keeping the retained roll.

**Atomic payment and recovery.** One P7 command, 2 actors, ≤3 operations (inside proven limits):
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
- Normal App, one persistent GM profile: the Arcanoneer casts twice (*saved*; then *failed*, speed 35 → 25 ft).
  The not-automated line is visible to owner, GM and observer. The GM removes the instance → 35 ft. A dropped
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
a stat→consumer table (M3); per-card reaction binders (M7); resource-domain descriptors (R-track).

**Demonstrated limitations needing a changed contract:** (1) C4 boundary commands may not pay or damage —
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
Then build **M1 — class-paid composed effect with a GM-attested save branch**, proving it on Rime-Iron Clasp.
Not periodic effects first: they touch only ~3% of the catalogue and need decisions the other milestones
produce. M1 needs no creator decision; Class HQ confirms one profile entry.
