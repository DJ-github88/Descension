# Original P9: independent source acceptance review

**Verdict: BLOCK.** Two defects are demonstrated against the brief's requirements and the frozen
contract, both on the real registered server stack (findings B1 and B2). Everything else this
review covered held. That includes formula reading, the supported set, producer routing,
temp-first arithmetic, the fence, privacy, re-approval semantics and the P7/P8 regression
witnesses. Reviewer: independent; I did not write this code. I made no edits to production source,
tests, witnesses or docs, and made no git writes apart from the instructed restore of P7 evidence.

## Identity
- Mirror `/home/claude/dj-github88/descension`, HEAD `dd445bec3a295f2a1d1aad8ec0b77e1d2f5e3334`. Delta: 13 modified
  tracked files and 13 untracked P9 paths (`git status`). `git diff --stat`: 321 insertions and 92 deletions over the 13 modified files.
- Device `D:/VTT` (device_bash): same HEAD, same P9 delta, plus the 3 concurrent presentation files (LandingPage.jsx,
  LandingPage.css, LibraryFilters.jsx). All 29 P9 paths have identical LF-normalized SHA256 values on the device and in
  the mirror (checked after all runs too).
- Accepted P8 principal SHA256 values in device bytes: 10 of the 12 runner-listed identities match exactly.
  `actorConsequenceService.js` (f014993e…) and `privateStorageRegistry.js` (9eaf175b…) differ. These are the two
  intentional seams, and their diffs are additive (`requestActorEvent`, `approval` extra key, the
  `room.spellConsequenceLatest` family). The runner's mirror-side "p8Drift" for CreatureToken.jsx and
  CreatureAbilityFanOut.jsx is a line-ending artefact only: the device bytes match the accepted hashes.

## Inspected
Server: `spellPayments.js` (all), and the diffs of `actorConsequences.js`, `actorConsequenceHandlers.js`,
`characterHandlers.js` (fence), `socketHandlers.js` and `rateLimitService.js`, read against the surrounding
P7/P8 stage/admit/propose/adjudicate code, the projection allowlists (`roomAccessService`) and
`request_room_checkpoint`.
Client: `spellConsequence.js`, `spellConsequenceService.js`, `spellConsequenceCustody.js` and `SpellConsequencePanel.jsx`
(all), the producer diffs (ActionBar, SpellActionBar, ArcanoneerResourceBar, SpellCastConfirmation, PartyHUD,
registerAllHandlers), `classResourceContracts` devotion ledger arithmetic, `useCharacterSpells`, and the HUD drop
assignment shape.

## Commands run (outputs under /tmp/claude-0/p9/review/)
| Command | Result |
|---|---|
| `checks.cjs server` | mocha 129 passing, 0 failing. Runner exit 1 only from mirror line-ending P8 "drift" (see Identity) |
| `checks.cjs focused` | 21 suites, 228/228 passing (same runner note) |
| `checks.cjs lint` | 5 errors, 33 warnings. All incumbent: per-file counts equal HEAD via `eslint --stdin` of `git show HEAD:` (ActionBar 12/12, SpellActionBar 4/4, PartyHUD 20/20, ArcanoneerResourceBar 2/2, others 0). New P9 files: 0 problems |
| `checks.cjs browser` (Chromium 1194) | S3/S7/S6/S4 witnessed, 0 page errors, 7 receipts |
| `checks.cjs server-p7` | 35 passing, 1 pending. The rewritten P7 evidence JSON (2 files) was restored with `git checkout -- vtt-react/verification/p7/evidence/` and verified clean |
| `p8/checks.cjs browser` | W1–W12 pass, 0 errors, exit 0 |
| `p8/checks.cjs rejoin` | "no second roll/payment/consequence", exit 0 |
| `p8/checks.cjs runtime` (P8_CHECKPOINT_INPUT = my browser run) | "Fresh runtime known receipt confirmed; old unknown … refused with zero mutation/RNG", exit 0 |
| `p7/final-checks.cjs owner` | 8 observations, 0 page errors, exit 0 |
| P7 `lifecycle` | **Not run:** it needs an external `D:/AppData/...` input that does not exist here (environment limit) |
| Probe `probes/client-pure.cjs` | Formula vocabulary and adapter over every authored class spell (see Closure) |
| Probes `probes/server-probes*.test.js` (mocha, real `productionStackServer`) | PA, PA2, PB, PC, PD, PE, PF, PG. Raw output in `probes/*.out` |

## Blocking findings

**B1. An approval installed through the P8 propose→adjudicate route is never consumed.**
- Where: `server/handlers/actorConsequenceHandlers.js:367-371`. `actor_adjudicate` calls `actors.stage`, and
  `actorConsequences.js:246` binds `command.approval` there. Only the direct `actor_consequence` route removes the
  approval (`:235`). `actor_propose` (`:321`) accepts a command carrying `approval`, and `validateCommand` allows the field.
- Scenario (PA, real stack): the owner registers a Slug approval and then proposes the strict GM-shaped command through
  `actor_propose`. The GM adjudicates it, and the receipt is installed with spheres, AP/mana and target HP. Afterwards
  `payments.get` still holds the approval. As a result:
  - legacy class writes are refused (`class_payment_pending`), as are owner sync and every new approval (`approval_pending`);
  - withdraw and decline only echo the receipt and leave the entry in place;
  - the GM list still shows it pending.
- Second consequence (PA2): with a `classPayment:null` approval, which the server accepts and which `none`-domain spells
  use, a later GM `actor_consequence` binds the same approval again. The result is two receipts for one approval and
  roll, and AP 5+1 temp → 4+0 and mana 30+3 → 25+0 for a 1 AP / 4 mana price.
- Receipt misattribution: on this route the receipt says `owner-approval-gm` with `authorizerUid` = the owner's UID,
  because `stage` receives `owner.uid` at `:305`.
- This breaks contract F9.3.4 ("the approval is consumed in the same synchronous step") and the one-payment guarantee.
- Fix required: refuse `approval` on `actor_propose`/`actor_adjudicate`, or consume the approval and record the GM as
  authorizer on that route too.

**B2. Consumed-approval memory depends on the bounded receipt ledger, so re-checks after eviction mis-report or pay again.**
- Where: `spellPayments.js:192` (`consumedReceipt` scans only the retained receipts). `close` (`:184-189`) never
  records consumption. The approve handler (`actorConsequenceHandlers.js:262-275`) re-validates an evicted approval as
  if it were new. Client wording: `spellConsequenceService.js:74-76` and `:121`.
- Scenario (PB, real stack): an approval is accepted and the owner keeps it as awaiting/unknown, for example after
  missing the ACK and broadcast across a disconnect. 270 later confirmed P7 receipts follow (replayFloor 16, consumed
  receipt evicted). Then:
  1. "Check this same approval" returns `class_home_required`, which the owner client renders as **"Not registered
     (class home required) — no payment was recorded."** That is false: the payment was recorded.
  2. Once the owner's home again equals the approved before-state (owner sync), the same approval bytes are
     **re-registered** (`awaiting_gm`) and the GM accepts them again. That is a second payment for the same approvalId
     and roll (AP 5→4, mana 29→25 again).
- GM side (PF): re-checking the installed GM command after eviction returns `retry_window_expired`. `settleGm`
  (`spellConsequenceService.js:273`) renders that as "Refused (retry window expired); nothing was applied." This is
  also false.
- Violated requirements: "never report nothing was spent after any group was submitted" and "unknown outcomes must not
  reroll/respend/reapply". P7/P8 commands avoid this with `baseCommitSequence`/`retry_window_expired`; approvals have
  no equivalent.
- Fix required:
  - Record consumed approval IDs durably, or bind approvals to a commit-sequence floor and refuse below `replayFloor`.
  - Treat `retry_window_expired` (and a re-check refusal of an already-registered approval) as an unknown outcome,
    never as "no payment / nothing applied".

## Non-blocking findings and observations
- **N1. Withdrawn or declined approvals become replayable after 256 later closures.** The closed-ID list is FIFO-bounded
  (`spellPayments.js:188`). In PE, a withdrawn approval re-registered as `awaiting_gm` after 260 closures. Reaching it
  needs deliberate abuse by the owner, so it is low severity. The B2 fix should cover it.
- **N2. Later unrelated installs overwrite the legacy room mirror with a stale class home.** Once a home exists, every
  P7 install copies it into `player.character.classResource` (`actorConsequenceHandlers.js:69-71`). In PG, a legacy
  write set the mirror to storm,storm,rime, and an unrelated GM creature command reverted it to `ember`. Live relays are
  unaffected; joins and resyncs see the stale value.
- **N3. Restorative Prayer throws when the Martyr's classResource is undefined.** `planClassPayment` throws a TypeError
  through `changeManagedClassResource` (probe). This reaches `routeSpellCast` and `spellDiagnostic`, which runs during
  SpellCastConfirmation render. Nothing is spent. It is a robustness gap only.
- **N4. Owner sync without custody overwrites the sheet with no recovery candidate.** With no matching custody,
  `applyOwnerClassFromHome` (`spellConsequenceService.js:193-200`) overwrites the personal class value without the
  recovery candidate that F9.4 describes. This would show up on two devices, which is unverified.
- **Observation (contract design, honestly bounded):** the server checks price conservation and affordability but cannot
  check the owner's AP/mana/class price or roll constant against the authored definition. The GM panel shows only the
  owner-approved price. This is parity with owner self-edits under the frozen contract, but it is residual trust in the
  owner.
- **Observation (P8 precedent):** bind does not compare the approval's `actionEpoch` (an approval object can outlive an
  authority-generation change on the same room object). After a restart, an unresolved approval leaves the owner stuck
  at "unknown" for supported spells in that room. Both match accepted P8 proposal/custody behaviour.
- **Honest report:** the `<attr>/K` round-down rule is flagged for creator confirmation in both the contract and the
  implementation report, and the reading text says "rounded down".

## Closure (verified, no defect found)
- **R1, home:** `state.classPayment` is protected, stripped on import and rebind, and absent from projections and the
  checkpoint read. It is revisioned per accepted command, and the private home survives the writer/P3 codec.
- **R2, fence:** works (S6, PA).
- **R3, re-approval:** a class-home change closes the approval (`owner_reapproval_required`) with zero mutation.
  Revision or split changes give a CAS refusal and GM re-preparation, with no owner re-approval (S5, PD).
- **R4, cooldowns:** start only from the accepted-receipt event, HUD slot only. The four supported spells have
  cooldown value 0.
- **R5, temp first:** exact temp-first on both sides. An ordinary-first command is refused (`approval_mismatch`, PD).
- **R6, producers:** HUD, sheet slots, sheet equipment, HUD equipment and Arcanoneer all route before any spend. A
  confirm-time guard exists. Offline play is unchanged.
- **R7, formula reading:**
  - `1d8 + intelligence/4` at INT 16 reads as 1d8+4. Bare attribute = score; `_modifier`/`mod` = ⌊(s−10)/2⌋.
  - int, str, agi, con, spi, cha, wis, dex and intellect are refused, as are multiplication, parentheses and percentages.
  - There are no `resolveDynamicSpellFormula` references.
- **R8, manual fallback:** Animist (Resonance), Minstrel resolving strike, Pyrofiend and the others stay manual with
  diagnostics. The supported set is exactly Slug, Prayer, Opening Chord and Harmonic Strike.
- **Martyr devotion arithmetic:** the server's conservation rule equals the client ledger rule. The cap clamp is
  non-binding.
- **Privacy (PC):**
  - No Martyr ledger fields reach the GM, other players, a late joiner or the checkpoint read.
  - The GM's Minstrel projection carries only current/max.
- **Authority:**
  - The GM or a third party cannot install a home (`class_payment_owner_required` / `authorization_required`).
  - A sync entry cannot ride inside an approved command (`invalid_class_payment`), and a dropped target entry is refused.
  - Replay after withdraw or decline is refused (until N1).
  - Exceptions throw before install, so no partial state was observed.
- **P7/P8 regressions:** none observed in the executed witnesses.

## Outstanding (not proven here)
- Human tabletop and creator confirmation, including the `<attr>/K` decision.
- Two-device play.
- Live Firestore, rules and backend lease.
- Full-App build and visual check, deployment, and deployed crash/restart.
- P7 `lifecycle` browser witness (environment).
- P5-05/07/09/10/11/12/13/31/32.
