# M6A ordinary casting — activation brief

**HEADQ · 2026-11-09 · candidate prepared; ordinary activation HELD.**

## 1. Verified state and exact blockers

The engine is installed. The shared-roll gameplay procedure is still unapproved:
`vtt-react/src/services/authoredAbility.js:22–35` and its server mirror retain
`AREA_ROLL_POLICY.creatorApproval: null`. Current registered-handler M6A tests pass **12/12**,
including default refusal at admission, approval and execution. No ordinary route was enabled.

| Category | Current truth / remaining work |
|---|---|
| Existing approved rules | B2 G1 origin range, G3 known-cell positive overlap once per creature, G3a tangency excluded, G5 free point are answered. They describe advisory geometry, not automatic affected-target authority. B1 §2 retains physical/digital faces through target changes, close/reopen, reload and confirmed owner withdrawal. Do not ask these again. |
| Installed bounded execution contract | M6A handoff §1 specifies 1–8 exact distinct placed creature targets, primary owner PC source, one payment, per-target GM amounts/reasons, atomic commit or no changes, privacy and original-command recovery. This is the existing technical profile, not a newly inferred universal area rule. |
| Engineering/UI gap, independently repairable | Area OwnerPanel used `kind:map:token` slot keys instead of existing incarnation-aware `pickKey`. Recreated actors could be adopted; missing/hidden targets could be filtered into a smaller set; withdrawal returned incompatible `pickKey` keys. Isolated reviewed repair in `handoff/m6a-activation/`; not installed. Legacy ambiguous selections fail closed while keeping the roll. |
| Activation engineering, conditional on decision | Record an actual creator approval reference in both `authoredAbility.js` mirrors if shared-roll is chosen; align pending-proposal UI copy with that decision. Preserve exact procedure identity unless a separately reviewed version change is intended. If separate rolls are chosen, the present one-roll schema/UI/receipt binder is insufficient: prepare a bounded new roll profile, not a flag flip. |
| Missing ordinary-App acceptance | No candidate-containing identified build or browser result exists for this repair. No flag-free approved area casting result exists. Flash acknowledgement/build scheduling is pending. The new narrow ordinary-control witness is supplied, with explicit proposal/approved modes; it has syntax/static review only, not a browser PASS. |
| One unresolved first-profile creator decision | For this bounded ranged-circle profile, one owner roll for the cast or an independent owner roll for each target? Exact reply text below. |

**Evidence qualification.** `handoff/m6a-delivery/HANDOFF.md` §§4,6 and capability plan M6A report
the 2026-11-03 installed build/App proof. Direct inspection of
`D:/AppData/Temp/opencode/m6a-integrated-20261103/m6a-app-witness/result.json` confirms
`passed: true`, `creatorApproval: null`, explicit test enablement, default refusal and a two-target
receipt. It also contains **four `Failed to fetch` page errors**. Preserve that result as qualified
fixture-App evidence, not a clean flag-free release. Its GM free-text “half damage agility save”
reason is an adjudication string, **not save or rounding automation approval**. The later INT
placeholder-overlay qualification in coordination (2026-11-06) also applies to that old score fixture.
No completed witness was repeated here.

**Scope stays bounded.** `targetingType: multi`, other shapes, creature sources, PC area targets,
area effect bundles and catalogue whole-record widening remain outside this profile. General
D14-3 partial-versus-atomic policy is not globally settled by this engineering profile. It need not
be reopened to reuse its explicitly installed all-or-none behavior. Walls/elevation/eligibility
remain GM rulings. No save, mitigation, new class-resource or shape decision is attached to the ask.
Source/compiler range bound is **1–300 ft** (`installedDefinitionRegistry.js:258–262`), radius
**5–60 ft in 5-ft increments**; capability plan's old “0–120 ft” summary is inaccurate. This brief
corrects the summary without changing geometry or admission rules.

## 2. One concrete creator decision

**Question:** For the existing first M6A ranged-circle profile, should the owner record the
damage/healing dice **once per cast**, proposing that total to every selected creature, or record
**independent dice per target**? Recommendation for minimum release work: approve the installed
shared-roll proposal **for this profile only**. This is a recommendation, not authorization.

Example: one authored immediate damage formula `2d6 + 8`, targets A/B/C, price 1 AP + 2 mana.
The constant avoids adding a score/resource question.

| Item | Shared-roll choice (installed proposal) | Separate-roll choice (requires further engineering) |
|---|---|---|
| Dice | Record `[4,5]` once → **17** proposed to A, B and C. One shared face set in approval/receipt, not three copies presented as independent rolls. | A `[4,5]` → **17**, B `[1,3]` → **12**, C `[6,2]` → **16**. Each roll belongs to its exact target; this is illustrative, not an implemented schema. |
| GM final amounts | Example **A=17, B=8, C=0**, with GM explanation for B and C because they differ from 17. Zero is an adjudicated amount, not target deletion or “refused”. | GM can still adjudicate each amount; the new binder must compare against each target's own proposal (17/12/16). Existing per-target GM authority needs no new gameplay answer. |
| B's revision becomes stale after command preparation | Entire stale command refuses; A/C HP and source price unchanged. Shared `[4,5]` stays recorded. Review refreshed exact B and prepare a fresh command only after definitive refusal; no reroll. | Staleness must not be a free reroll. The precise multi-roll custody representation is engineering required by this choice; this brief does not invent target-remapping rules. |
| B is removed, hidden or recreated | Never substitute a new B or silently cast on A/C. Unsent candidate now blocks; explicitly remove unavailable selection or choose intended exact target, keeping `[4,5]`. If an approval is already pending and target set changes, confirm owner withdrawal and approve a new exact set with retained faces. | Same exact-target/consent restriction; independent faces cannot be manufactured from the shared set. Further implementation needed. |
| Payment | Roll, placement, owner approval and confirmed withdrawal spend **nothing**. One successful GM atomic commit pays **1 AP + 2 mana once**, temporary first, together with all selected target outcomes. | Existing once-only payment timing does not need a new answer just because dice scope changes. |
| Refused target / partial execution | Invalid B means whole selected cast refuses. No A/C partial commit, no partial charge, no hidden truncation. Owner may explicitly approve a smaller valid set before execution after closing the old approval; that is a new consented set, not partial execution of the old command. GM decline is final under B1; do not auto-reopen it as a free retry. | Choosing separate dice alone does not authorize sequential partial execution or a new refund policy. Keep current all-or-none contract unless separately changed. |
| Lost ACK / exact-command recovery | If command **X** may have landed: reload and **Check same command**, retaining X's commandId and exact bytes (approvalId/hash/targets/amounts/faces). Return original receipt; never pay or damage twice. Do not rebuild X with refreshed revisions. A definitive stale refusal and an unknown outcome are different states. | Same recovery principle; new representation would need tests, not a new gameplay decision. |

**Already settled — citations, not new questions:**
- Dice retention: [B1 §2](MYTHRILL_PROJECT_12C_B1_CONTRACT.md#2-roll-retention-no-free-rerolls-before-approval).
- GM amounts/reasons: [M6A handoff §1, lines 35–37](../handoff/m6a-delivery/HANDOFF.md).
- Once-only payment, atomic refusal and privacy: same handoff §1, lines 38–48;
  current `p14m6aAreaExecution.production.test.js` cases 1,3,6,7,9,10.
- Current GM re-preparation after a **definitive** stale refusal: server case 3 (lines 649–687);
  `gmAcceptSpell` prepares from a fresh snapshot. Original-command checking after unknown delivery
  remains separate (`gmCheckSpellCommand`, exact custody).
- Preview decisions: [area creator packet §2](MYTHRILL_DECISIONS_AREA_AND_REACTIONS_BATCH1.md#2-area-choices--preview-only).

Suggested creator reply:
> Approve one shared owner roll per cast for the first M6A ranged-circle creature-target profile,
> with per-target GM final amounts under its existing payment, refusal and recovery contract.

**Recorded Creator Decision (2026-11-10):**
> *Approve one shared owner roll per cast for the first M6A ranged-circle, creature-target profile, with per-target GM final amounts under the existing payment, refusal and exact-command recovery contracts.*
- Reference: `creator-approval-20261110-m6a-shared-roll`
- Scope: `first-ranged-circle-creature-targets` (bounded shared-roll procedure only; independent per-target rolls, new target profiles, additional mechanics, and trigger decisions T1–T6 remain unapproved).

Or reply **“Separate owner rolls per target for this profile”**; activation then stays held for
that implementation. Neither reply establishes a universal Prism area/chain rule.

## 3. Shortest release path / ownership

| Dependency / exact paths | Current owner and status | Acceptance step |
|---|---|---|
| `handoff/m6a-activation/**`; this brief + additive plan/roadmap/coordination notes | HEADQ preparation; candidate frozen and source review ACCEPT | Preserve base/final SHA256; install only this delta after exact live comparison / rebase. |
| Runtime target `vtt-react/src/components/hud/SpellConsequencePanel.jsx`; new `.../hud/__tests__/SpellConsequenceAreaSelection.test.jsx` | HEADQ candidate only; live overlapping composition bytes not acquired or overwritten | Guard base `0bf3d03c…02b15`, candidate `a19c48e7…54db7b`; mounted 5/5, M6A + cooldown neighbors 5/5. Preserve later deltas. |
| Actual creator shared/separate-roll record | Creator; **pending** | Record exact scoped answer. No test flag counts as approval. |
| `vtt-react/src/services/authoredAbility.js`, `server/shared/services/authoredAbility.js`; gate-related copy in consequence panel | Future activation integration only after answer; Flash coordinates live file acquisition against Argon's current claims | Shared choice: real `creatorApproval.reference`, mirrored parity, no widened shapes/routes/resources. Separate choice: new bounded engineering first. No files in this row claimed/edited here. |
| One compatible frozen source capture + optimized artifact | **Flash sole build coordinator**, request posted in coordination; acknowledgement **pending** | Include accepted panel delta plus only concurrent work Flash explicitly accepts; publish capture hash, sources, manifest and drift. Detached compile once. No HEADQ compiler/port/profile reservation. |
| `handoff/m6a-activation/m6a-selection-app-browser.cjs` + `preflight.cjs` | Supplied by HEADQ; Flash/claimed witness executor after shared artifact exists | New stale-selection → explicit removal → close/reopen → approval → withdrawal → exact-set reapproval → per-target GM amounts → atomic payment → dropped ACK/reload/exact-command recovery. Save ARIA/result/artifact hashes. Proposal mode is engineering-only; approved mode sets no test flags. |
| Consumable entry points/helper/service and transaction package | Flash live integration; Argon transaction/reload boundary | Preserve `ActionBar.jsx`, `SpellActionBar.jsx`, `InventoryWindow.jsx`, `consumableCondition.js`, `actorConsequenceService.js`, their tests and `handoff/consumable-transaction-boundary/**`. M6A has no dependency on finishing a new consumable transaction. No edits in this lane. |

Flash's 2026-11-09 consumable build (`72345fff…`, `main.9d4d288f.js`) predates this candidate;
it cannot certify the candidate. Its newly published evidence supersedes earlier consumable
status for its exact bytes, while later Argon changes stay separate. Do not infer release from
the ledger's older “HELD”/“RELEASED” entries or overwrite their history.

**Release acceptance:** one approved-mode optimized-App result on the compatible artifact,
no proposal flags, exact refs/retained faces, no approval-time spend, one receipt/payment, untouched
excluded target, exact-command recovery unchanged, no unexplained browser errors. Current witness
fixture-seeds authoring/admission and explicitly discloses that limit; it supplements the old Wizard
author/save proof, not a new claim of flag-free Wizard admission. On the same release artifact,
the executor must additionally verify the actual saved Wizard record can be admitted with the flag
absent. Do not call the whole profile released before that step. Live Firebase/deployment remains
a separate evidence level under the existing checkpoint stages.

Commands and exact checks: [candidate handoff](../handoff/m6a-activation/HANDOFF.md).
