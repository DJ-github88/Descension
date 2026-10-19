# P12B-r1, P13A and P12C-B1 — implementation report

2026-10-18 · Checkout `D:/VTT`, all work **uncommitted**; concurrent work preserved. Authorized by HQ on
2026-10-17. Frozen contracts:

- [P12 rev 5 §3.9](MYTHRILL_PROJECT_12_CONTRACT.md);
- [P13A](MYTHRILL_PROJECT_13A_CONTRACT.md);
- [P12C-B1](MYTHRILL_PROJECT_12C_B1_CONTRACT.md).

Class-track coordination is in [MYTHRILL_CROSS_TRACK_COORDINATION.md](MYTHRILL_CROSS_TRACK_COORDINATION.md).
Bulky evidence (build log, witness results, screenshots, accessibility snapshots) is kept outside Git under
`D:\AppData\Temp\opencode\slices-20261017\`.

## Verdicts

| Slice | Independent review | App witness |
|---|---|---|
| P12B-r1 | **PASS**. The first review raised 4 should-fixes; all are fixed and re-checked | PASS (carry-forward, revalidation, void) |
| P13A | **PASS**. The first review was BLOCK with 10 findings; all are fixed and re-checked | PASS (three viewers, dedupe, hidden actor, reload) |
| P12C-B1 | **PASS**. The first review was BLOCK with 3 must-fix and 4 should-fix findings; all are fixed. The first re-check left one gap (a refused Feather Slash rerolled after close and reopen), now fixed; the final re-check passed | PASS (P8, P9 picking; retention; manual action). The witness found one more bug, now fixed (below) |

**Found by the witness after review:** pressing Esc while picking also reached the app's own Escape handler,
which opened "return to the realm gate". The overlay now consumes Esc in the capture phase. The App witness
verifies the fix; no further review was run for this one-line change.

## What users can now do

- **Blocking (P12B-r1).**
  - A creature can attack twice before the owner rolls, and both recorded block rolls still apply, provided
    the creature's only changes in between were those attacks' own AP payments.
  - Any other change asks the GM to rule that the recorded rolls still stand, with a reason everyone sees.
    It never asks for a new roll.
  - A piece that is no longer available leaves the GM ruling. Nothing switches to "Don't block" automatically.
  - Withdrawing or voiding closes that attack for good. The owner sees it under "Closed attacks" and cannot
    roll it again.
- **Combat feedback (P13A).**
  - Calm floating text over tokens shows applied HP damage and healing, with "N absorbed" when temporary HP
    took part of the damage.
  - A short narration banner, a session history and one screen-reader announcement appear for each accepted
    result. AP, mana and wear appear in narration and history only.
  - Numbers come only from exact before/after revisions. Results naming something a viewer cannot see are
    neutral on every surface.
  - Reloading or reconnecting replays nothing.
- **Targeting (P12C-B1).**
  - "Pick on map" in the strike, spell and Feather Slash panels shows a crosshair, source and target rings,
    an advisory card-range ring and an aim line with the planar centre distance. Esc or right-click cancels.
  - Recorded rolls survive target changes, close and reopen, reload, withdrawal and a refused first
    submission. They never move to another weapon, spell or source.
  - Discarding a roll is explicit and listed on the device.
  - In a shared room, an action the VTT does not support posts a manual notice and spends nothing.

## Supported, manual fallback, future

| | Supported (exercised) | Manual fallback | Future capability |
|---|---|---|---|
| Blocking | Carry-forward, GM revalidation, void and withdraw closure | Unavailable piece: GM ruling | S1 (should an unavailable piece mean "Don't block"?) |
| Feedback | HP/temp-HP floats; narration and history for HP, AP, mana and wear | — | F1 (float AP/mana/wear?); per-domain class-resource presenters (dependency table row 3) |
| Targeting | Single exact target for P8, P9 and P12A | GM adjudicates range and line of effect | B2 area preview (G1–G6); linked actors, companions and summons (rows 5–6) |
| Unsupported actions | — | Notice only; costs paid with the existing resource controls | Optional "pay listed costs" control; new capabilities (P13B, P14, follow-on projects) |

**Behaviour change to note.** In shared rooms, unsupported spells and abilities no longer spend AP, mana,
class resources or cooldowns locally. Before this change they spent locally but applied no effect for anyone.

## Remaining limitations

- Rolls are made on the owner's device. A player who clears site data can roll again, and physical dice
  carry the same trust.
- Closed-attack records and pending approvals are server memory: a server restart forgets them. A GM can then
  offer the same attack again and the owner can roll it again. No old offer, approval or prepared command
  executes under the new epoch (P12B B25; P7 A4; P12A runtime-change test).
- An approval reconciled while its outcome is unknown does not return its rolls, since it may already have
  been accepted.
- Floats sit inside the token, so they inherit wall-occlusion opacity and token stacking.
- In view-from-token, the GM narration still shows everything (the GM sees all).
- Approval-time distance is not recorded; GM summaries show the current advisory distance.
- The adjudication column still sits over the right edge of the map. It is now height-bounded and
  collapsible; anything under it can be reached by collapsing it.

## Integration closure (2026-10-18)

**Integrated verdict: PASS**, including the P12A rejoin witness after the harness correction below.

**1. Automatic rejoin recovery restored, with one `room_joined` listener.**
- `services/roomRejoinBus.js` (new) is an in-process fan-out.
- The App's single `room_joined` listener relays to it only for a rejoin of the current room. Since the
  evening correction, that listener is registered through `registerRoomJoinedListener` (see the P12A
  verification correction).
- The strike and blocking services subscribe at handler registration and unsubscribe in the same cleanup.
  Each subscriber also checks:
  - its own registration socket;
  - account principal and generation, and the current room id (`currentActorDelivery`).
- After a rejoin they only re-read server-scoped lists (`actor_strike_list`, `actor_block_list`, own blocking
  view). Nothing is replayed, rerolled or paid.
- No socket listener was added. `useSocketConnection.eligibility.test.js` (exactly one `room_joined`
  listener) passes unchanged.

**2. Panel obstruction fixed.**
- The adjudication column (`ActorConsequenceLayer.jsx`, one-line mount in PartyHUD) is height-bounded:
  - 1440 px: at most 46% of the viewport and 420 px wide;
  - at or below 1100 px: 40% and 340 px.
- It collapses to a chip on demand, remembered per device. Collapsing only hides presentation; pending work
  stays mounted.
- The App witness now opens Feather Slash with a real hover and click at 1440 px, where it was blocked before.
- Measured: 1440×1000 expanded 420×460 and collapsed 137×31; 820×700 expanded 340×280 and collapsed 137×50.

**3. Accepted scope preserved.**
- AP, mana and wear stay in narration only.
- An unavailable block piece stays GM-adjudicated.
- No "pay listed costs" button.
- No area preview or reaction windows.
- **New-epoch safety** (focused regression P12B **B25**, added because no P12B test covered it): after a
  runtime change, which means a new epoch and empty server-memory registries:
  - the old prepared block command returns `outcome_unknown`;
  - the old pending and the old voided offers cannot be approved again;
  - the old approval is not re-registered;
  - nothing is applied and no receipt is added.
- P7 (A4) and P12A already covered the same for generic and strike commands.

**Verification.**
- Server P12B suite: 22 passing (B25 new). Server files other than that test are unchanged since the full run
  (770 passing; the only 2 failures are evidence-folder hooks absent in the workspace).
- Client: 87 suites passed and 1 was skipped (559 tests) across services, hud, grid, combat, ui,
  character-sheet, multiplayer and store. New: `roomRejoin.test.js` (4) and `ActorConsequenceLayer.test.jsx` (1).
- Scoped lint: no errors.
- One rebuild for the changed frontend, after syncing the class track's concurrent Chaos Weaver prototype
  files: "Compiled successfully".

| App witness (closure build) | Result |
|---|---|
| Slices witness (`slices-20261017-app-browser.cjs`) | **PASS**, 0 page errors: all earlier checks; Feather Slash by real click at 1440 px; **3 repeated rejoin cycles** (block offer reappears for the owner, owner's roll reappears for the GM; one list read per rejoin, one `room_joined` listener, same room, exactly one receipt with the pre-rejoin face); layout bounds and collapse at 1440 and 820 px |
| P12B (`p12b-app-browser.cjs`, original) | PASS |
| P12 recovery (`recovery-browser.cjs`, original) | PASS |
| P9 integration (`p9/integration/app-browser.cjs`, original) | PASS |
| P12A (`app-browser.cjs`, original harness) | Afternoon: FAIL at "same-socket rejoin", because the harness never registered the App's listener. Resolved by the harness correction below: **PASS** |

## P12A verification correction (2026-10-18, evening)

**Production behaviour** (what the App does):
- `services/roomRejoinBus.js` now owns the registration of a socket's single `room_joined` listener:
  `registerRoomJoinedListener(socket, onJoined)`.
- The App's room lifecycle (`roomLifecycleHandlers.js`) passes its existing join handling as `onJoined`.
- The registered listener:
  - ignores a retired socket;
  - decides before the join handling whether this is a rejoin of the room the client is already in (same
    current socket, same room id or persistent id);
  - runs the join handling;
  - then relays the rejoin to subscribed services (P12A strikes, P12B blocking).
- Registering again on the same socket replaces the listener, so a socket never carries two; a stale
  cleanup cannot remove a newer listener.
- Services stay subscribers only. Their own fence (registration socket, account principal and generation,
  room) still applies.
- One rebuild for this source change: "Compiled successfully".

**Harness correction (test infrastructure only):**
- `verification/p12/app-browser.cjs` now calls the same compiled `registerRoomJoinedListener` on its socket
  instead of relying on the per-service `room_joined` listener that commit `120ea382` removed.
- The harness does not mount `MultiplayerApp` (the App's lifecycle is compiled into that lazily loaded
  module), so it passes no UI join handler. Registration, rejoin decision and relay are production code.
- No explicit refresh was added and no assertion was weakened. Added checks:
  - exactly one `room_joined` listener after each rejoin;
  - exactly one pending-list read per rejoin;
  - the GM sees the owner's original approval bytes;
  - owner custody and GM command custody are unchanged;
  - no receipt is added by a rejoin or a withdraw.
- The pre-correction witness is preserved byte-identical (SHA-256 `2d8fa969…`) as
  `verification/p12/app-browser.20261016-original.cjs`, as historical evidence.
- The slices witness uses the same production registration, replacing an earlier hand-registered relay
  listener.
- Its stale-delivery section now checks:
  - a socket retired by the production handoff path gets zero reads after a rejoin;
  - a late `room_joined` for a room the client has left gets zero reads, with one listener kept.
- An earlier draft instead treated a same-account, same-socket rejoin of the same room id (with a new room
  object) as stale. That is a legitimate rejoin by design, so the draft was replaced.
- One P13A step now waits for the GM's narration entry before asserting, because delivery order across
  pages is not fixed. The assertion is unchanged.

| Result (closure build after the correction) | |
|---|---|
| P12A `app-browser.cjs` (corrected harness) | **PASS**, all 11 checks incl. same-socket rejoin (twice), 33 completed strikes, runtime unknown, P11 |
| Slices witness | **PASS**, 0 page errors: 3 repeated rejoin cycles (one read each, one listener, one receipt each with the pre-rejoin face), retired socket 0 reads, left room 0 reads, layout, P8/P9/P13A |
| P12B, P12 recovery, P9 integration (original witnesses, unchanged) | **PASS** on the corrected build |
| Unit | `roomRejoin.test.js` 7 + `useSocketConnection.eligibility.test.js` (exactly one `room_joined` listener) unchanged; client 88 suites / 567 tests |

## Verification (first delivery, 2026-10-18 morning)

- Server full suite 770 passing and 2 pending; client 82 suites / 540 tests; one integrated build after
  syncing 86 concurrent files.
- Slices, P12B, recovery and P9 witnesses passed.
- P12A failed only at rejoin after commit `120ea382`, which led to the closure above.

## How to rerun

From `vtt-react`, after a production build in an external directory (see `verification/p12/README.md`):

```powershell
$env:APP_BUILD_DIR='D:\AppData\Temp\opencode\slices-YOUR-RUN\build'
$env:SLICES_OUTPUT='D:\AppData\Temp\opencode\slices-YOUR-RUN\app'
node verification/p12/slices-20261017-app-browser.cjs
```

Focused client tests: `--testPathPattern='acceptedResultFeed|targetPick|manualActionGate|strikeRollDrafts|spellRollDrafts|featherUnsentRoll|equipmentBlocking|ActionBarP9|SpellActionBarP9|roomRejoin|ActorConsequenceLayer|useSocketConnection.eligibility'`.
Server: `npx mocha tests/p12bBlockWear.production.test.js --exit`.

## Cross-track reconciliation (2026-10-18)

- Of the 27 existing files combat writes, 25 were byte-identical on the device to the base they were edited
  from. `blockingService.js` and `weaponStrikeService.js` differed only by commit `120ea382` (removed
  `room_joined` listeners). The combat versions keep that removal; a three-way merge reproduces them exactly.
- No overlap with CR-W1a/W1b or CR-A1a files. Verified identities and file ownership are in
  [MYTHRILL_CROSS_TRACK_COORDINATION.md](MYTHRILL_CROSS_TRACK_COORDINATION.md) §2–§3.
- CR-A1b is not implemented, and no second admission or execution engine was created.

## Next creator decisions

- **S1.** Unavailable block piece: keep the GM ruling, or default to "Don't block"?
- **F1.** Float AP, mana and wear, or keep them in narration only?
- **Manual actions.** A "pay listed costs" button needs its own payment contract first (not built).
- **G1–G6.** Area-preview geometry decisions, needed before P12C-B2.
- **Class track.** Reviewed requirements are needed before the P13B (reaction payment) and P14 contracts are
  frozen.
