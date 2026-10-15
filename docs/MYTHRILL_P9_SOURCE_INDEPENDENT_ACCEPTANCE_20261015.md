# Original P9: independent source acceptance re-review (cycle 2)

## Verdict: PASS for independent source acceptance

The repair closes cycle-1 blockers B1 and B2. I re-ran my own probes against the real registered stack to confirm this.

The repair also closes N1 through N4. It introduces no new defect, and no P7 or P8 regression appeared in the executed witnesses.

**What this PASS covers:** the exact P9 file bytes listed in
`/tmp/claude-0/p9/review2/p9-identity-lf-sha256.txt`.
- Those are 29 LF-normalized SHA256 values, and the manifest itself hashes to `a5a75dc3…`.
- The device `D:/VTT` and the mirror are identical for all 29 files.

**What it does not cover:** human tabletop and creator confirmation, two-device play, live Firestore/backend, the full App build, and deployment (listed in the last section).

**Ground rules:** I did not write this code and made no production edits. My only git write was the instructed restore of the P7 evidence JSON.

## Identity and the concurrent drift

Mirror and device are both at HEAD `dd445bec…`. Thirteen P9 files changed relative to my cycle-1 review. I checked this against the device's own cycle-1 seal (`implementation-20261015/seal-1792055631489/source.json`), which matches my cycle-1 hashes. The repair diff is at `/tmp/claude-0/p9/review2/repair.diff`.

### Concurrent drift on the device (third party, after the cycle-1 seal)

The drift is much larger than the coordinator listed. About 90 tracked files are modified, and there are new assets, location/shopkeeper files and tests. Here is how each relevant part bears on P9.

**One P9 file is affected: `SpellCastConfirmation.jsx`.**
- The device copy differs from the mirror (`5eeeeae6…` on the device vs `ed1c2eb6…` in the mirror).
- The diff is colour constants only (`#a78bfa` → `#584485` and similar). The P9 diagnostic lines are intact.
- Its P9 identity is therefore the mirror bytes, and the device copy is a presentation-only variant.

**Accepted P8 data inputs changed: `abilities.json` and `creatures.json`.**
- Their accepted P8 SHA256 values no longer match on the device (`07ffc620…` and `66cf07a0…`).
- The change is additive only: 4 new shopkeeper creatures (barnaby-finch, morwenna-coldforge, madame-vespera, corrick-featherquill).
- No existing entry changed, including grimmstalk.
- Consequence: the P8 identity record needs a note. The drift does not affect P9 logic.

**`creatureStore.js`, which P9 reads, changed by one line:** it adds a `SHOPKEEPER` creature type.

**`animistData.js` and `apexData.js` changed lore and images only.** No spell definitions changed, so the supported set is unaffected.

**`SpellCastResourceContracts.test.jsx` gained one new test.** This is a focused-suite input on the device only; the mirror still uses the HEAD version.

**Other P8 principal hashes on the device:** the remaining 10 still hold (including the two intentional P9 seams, unchanged since cycle 1).

**Judgement:** this drift does not change the P9 verdict. Because it touches accepted P8 inputs and one P9 producer's styling, it should be recorded in the ledger with the creator's acceptance or attribution. A P9 sign-off should name the exact P9 bytes above, not the current device tree.

## Repair inspected

### B1
- `actor_propose` now refuses commands carrying an `approval` or any `classPayment` (`approval_requires_gm`).
- `bindCommand` now requires `authorization.kind === 'gm'`, so approvals can only be consumed on the direct GM route.
- Consumption is recorded with `close(…, 'consumed')`.

### B2
- Approvals now carry a validated `baseCommitSequence`, and registration requires `replayFloor ≤ base ≤ commitSequence`.
- A consumed ID returns `retry_window_expired` on re-registration and `approval_consumed` on bind and withdraw.
- Closed and consumed IDs are kept for the whole runtime, with a cap of 4096. A new runtime gets a new epoch, so old approvals come back as `outcome_unknown`.

### Client wording and custody
- `ownerRefusal` and `gmRefusal`: only a refused **first submission** may say "no payment was recorded".
- The `sent` flag is persisted before the approval is emitted.
- Re-check refusals, `approval_consumed` and `retry_window_expired` all become the `unresolved` phase. That phase blocks new casts until the owner explicitly marks it reconciled.
- When the GM re-checks a command and it is refused, the client never says "nothing was applied".
- Nothing is re-sent automatically. The server still refuses a second consumption.

### Non-blocking items
- **N1:** the closed-ID list is no longer FIFO-evicted.
- **N2:** the room mirror only takes the class home from the command that changed it.
- **N3:** `supportSpell` wraps errors and returns a manual diagnostic instead of throwing.
- **N4:** a recovery candidate is created before the home overwrites the sheet without device custody.

## Commands and results (`/tmp/claude-0/p9/review2/`)

**Note on runner exit codes:** every runner below exited 1. In each case the cause is the mirror's line-ending artefact on `CreatureAbilityFanOut.jsx`. The device bytes match the accepted hash, and no file drifted during any run.

| Run | Result |
|---|---|
| P9 `server` | 132 passing, 0 failing |
| P9 `focused` | 21 suites, 230/230 passing |
| P9 `lint` | 38 problems (5 errors, 33 warnings), identical to the incumbent counts; the four new P9 sources are clean |
| P9 `browser` (Chromium 1194) | S3, S7, S6 and S4 witnessed; 0 page errors; 7 receipts |
| P9 `server-p7` | 35 passing, 1 pending; P7 evidence JSON (2 files) restored and verified clean |
| P8 `browser` | W1–W12 pass, 0 errors |
| P8 `rejoin` | pass |
| P8 `runtime` | pass (checkpoint input taken from my P8 browser run) |
| P7 `owner` | 8 observations, 0 page errors |
| P7 `lifecycle` | **not runnable here:** it needs an external `D:/AppData` input (environment limit) |

**Probes against the real `productionStackServer`**, in `probes/`. Each approval now carries `baseCommitSequence`.

| Probe | Observed result |
|---|---|
| PA | Owner proposal carrying an approval is refused with `approval_requires_gm`. Cycle-1 PA and PA2 now time out waiting for a proposal event that never comes, which is expected because the route is closed. |
| PI | Owner proposals with an approval, with a sync, or from another user are all refused; the approval stays pending. A direct GM accept then installs once, the receipt names the GM as authorizer, the registry and fence clear, and a later legacy class write reaches the mirror. |
| PB | After 270 confirmed receipts prune the consuming receipt, re-checking the same approval returns `retry_window_expired`, both before and after the owner syncs back to the original before-state. It is never re-registered and nothing is paid twice. |
| PH | Base ahead of the ledger → `invalid_spell_approval`. A still-pending approval survives pruning and the GM can accept it. A fresh approval built from a pruned snapshot → `retry_window_expired`. After the consumed receipt is pruned: re-check → `retry_window_expired`, withdraw → `approval_consumed`, GM bind → `approval_consumed`. After a runtime change → `outcome_unknown`. |
| PF | The server still answers `retry_window_expired` to a GM re-check of an installed command. The client now maps this to "unresolved … may have been applied", which the `client-wording` table confirms. |
| PE | Withdrawn approval replay is still refused (`approval_withdrawn`) after 260 later closures. |
| PG | The room mirror keeps the newer legacy class value after an unrelated GM command. |
| PC | No Martyr ledger fields reach the GM, other players, a late joiner or the checkpoint read. The Minstrel GM view shows current/max only. |
| PD | The GM or a third party cannot install a class home. An ordinary-first payment, a sync entry inside an approved command, and a dropped target entry are all refused. |
| `client-wording.cjs` | Full refusal-wording table: "no payment was recorded" appears only for first-submission refusals other than `retry_window_expired` and `approval_consumed`. Restorative Prayer with no class resource returns a manual diagnostic. Formula R7 still reads 1d8+4 at INT 16. |
| `client-pure.out` | The adapter still supports exactly Slug, Prayer, Opening Chord and Harmonic Strike. |

## Residual observations (non-blocking, honestly bounded)

- **Owner trust:** the server cannot check the owner's price or roll constant against the authored definition, and the GM panel shows only the owner-approved price. This matches the frozen contract and parity with owner self-edits.
- **Same behaviour as accepted P8:**
  - After a server restart, an approval left `unknown` keeps the owner on "unknown" for that room.
  - Binding does not compare the approval epoch to the current epoch on the same room object.
- **Approval capacity:** new approvals are refused at 4096 closures per room per runtime. This is a bounded liveness limit, and the wording stays truthful.
- **GM first-submission wording:** a first submission refused with `approval_consumed` reads "Refused …; nothing was applied". That is true for that command. The earlier consuming receipt is the one that was applied.
- **Creator decision outstanding:** the `<attr>/K` round-down rule remains flagged for creator confirmation, and it is reported honestly.

## Outstanding (not proven here)

- Human tabletop and creator confirmation, including `<attr>/K`.
- Two-device play.
- Live Firestore, rules and backend lease.
- Full-App build and visual check, deployment, and deployed crash/restart.
- P7 `lifecycle` browser witness (environment limit).
- Ledger and creator handling of the concurrent device drift, including the changed accepted P8 data hashes.
- P5-05, 07, 09, 10, 11, 12, 13, 31 and 32.
