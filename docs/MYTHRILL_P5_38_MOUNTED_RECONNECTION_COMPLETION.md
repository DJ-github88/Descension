# P5-38 — mounted account-handoff reconnection completion

Date: 2026-10-11

Status: implementation verification complete; consolidated independent P5 source acceptance pending.

## Scope and starting-source finding

This run covers P5-38 only. The starting source already contained the runtime correction from `3f58cc05`: reactive socket-principal eligibility and the mounted setup-effect dependency. Fresh current-source reproduction confirmed automatic B replacement. Consequently, this run strengthened the permanent regression and completed mounted/two-tab validation rather than introducing another runtime change.

The five P5-01 character corrections await their separate final independent acceptance. The other 31 accepted P5 cases and nine external verification gates retain the user-provided status. This report does not declare full P5 acceptance.

## 1. Original RED reproduction

The exact historical `MultiplayerApp.jsx` from `3f58cc05^` was compiled in temporary test/browser loaders, with the remaining current production lifecycle modules retained. No working-tree source rollback was performed.

Real Chrome mounted witness:

- A connected and entered Room A; server Room A projection was active.
- A→B went through the production Firebase auth listener and handoff coordinator.
- B's gate became active; A's socket was retired.
- Socket count remained **1**, mounted lobby socket was **null**, presence socket was **null**.
- An ordinary parent rerender still left socket count **1** and lobby socket **null**.

Evidence: `D:/AppData/Temp/opencode/p5-38-red-mounted.results.json`.

The strengthened permanent mounted regression also demonstrates RED against this historical component. It first verifies A connection, retirement, disconnected transport and zero listeners, then releases the B handoff and rerenders. It fails at B's missing connected socket, before B admission. Jest: **1 failed / 5 skipped**.

Commands, from `D:/VTT/vtt-react`:

```powershell
node "D:\AppData\Temp\opencode\p5-38-red-mounted.cjs"
node "D:\AppData\Temp\opencode\p5-38-red-regression.cjs"
```

The RED runner expects the inner Jest failure. Its record is `p5-38-red-regression.log`.

## 2. Root cause and retained minimal runtime correction

Originally the socket setup effect depended only on `SOCKET_URL`. Production auth-change handling correctly retired A and set the mounted socket to null, but neither an auth change nor a gate activation was a setup-effect dependency. An ordinary rerender could not restart that effect.

The already-present runtime correction consists of:

- `vtt-react/src/components/multiplayer/useSocketConnection.js`: `computeEligibleSocketPrincipal` requires an active matching scope without a pending handoff or fail-closed hold. `useEligibleSocketPrincipal` reconciles auth/gate changes after `whenHandoffIdle()`. Cleanup skips `leave_room` for a principal-retired socket.
- `vtt-react/src/components/multiplayer/MultiplayerApp.jsx`: setup is guarded by eligibility and depends on `[SOCKET_URL, eligibleSocketPrincipal]`, disposing the preceding setup before starting the destination setup.

Existing principal/generation/disposal fences, production handler registration, room admission continuation, guest policy and durable server-membership policy were exercised unchanged.

## 3. Exact changes in this run

`vtt-react/src/components/multiplayer/__tests__/useSocketConnection.eligibility.test.js`:

- The setup spy now invokes real `setupSocketConnection`; real auth-change handling and cursor lifecycle are retained.
- Removed mocked production socket-handler registration, room admission and game-state services.
- Simulated only Socket.IO transport plus the existing Firebase boundary; mounted visual children remain inert observers.
- Initializes the production store registry.
- Added mounted A→held-B retirement/automatic connection/handler/presence/normal admission regression, including ordinary rerender and late A packet rejection.
- Normal admission uses lobby join intent, the real `room_joined` listener and the mounted parent's timed auto-continue into real `handleJoinRoom`.
- Added delayed A token-refresh regression, verifying that the actual forced refresh was invoked and cannot reconnect the retired A transport under B.
- Retained the prior eligibility and held-handoff tests.

This completion report is the other added repository file. Temporary validation runners and evidence reside under `D:/AppData/Temp/opencode`; browser snapshots reside under `.playwright-mcp`.

## 4. GREEN mounted-app and two-tab evidence

`p5-38-two-tab.cjs` runs two simultaneously mounted real Chrome pages in one browser context/origin. Only tab 1 changes the simulated Firebase identity. Tab 2 receives native cross-tab storage events and executes its own production auth listener, coordinator and mounted lifecycle.

Both tabs verified:

1. A entered its room through normal lobby intent and production server-packet/auto-continue admission.
2. Held A→B: one socket; A retired/disconnected; A listeners zero; presence null; no B socket while pending.
3. Release: exactly one automatically created B replacement; B production `room_joined` handler registered once; normal B admission completed; server B map projection active.
4. A admission held at the external character-query boundary, late A packets and captured A room callbacks were released after B admission. B room and map stayed active.
5. Existing B transport disconnect/reconnect retained the same socket and emitted the production room rejoin; no additional socket or room-handler registration.
6. Held B→C superseded by D: no C socket; final tokens exactly A, B, D; one connected socket; one production room handler on D.
7. Retired sockets emitted zero `leave_room`, `leave_party`, revocation or kick events. No browser page errors or simulated-wire callback errors.

Evidence: `D:/AppData/Temp/opencode/p5-38-two-tab.results.json`.

An additional interactive Playwright tool run confirmed both actual mounted apps, clicking auth B only in tab 1 and normal lobby admission in each tab:

| Tab | Retired A socket | Automatic B socket | B room | B room handlers |
| --- | --- | --- | --- | --- |
| 1 | `socket-mdgdnvg7` | `socket-if1how8s` | `room-u-b` | 1 |
| 2 | `socket-tm3qvbks` | `socket-hiibnkc2` | `room-u-b` | 1 |

Snapshots: `.playwright-mcp/p5-38-live-tab1-B.snapshot.yml`, `.playwright-mcp/p5-38-live-tab2-B.snapshot.yml`. Both sessions had A retired with zero listeners, B bound to presence, and `SERVER room-u-b` as the active map.

The retained mounted acceptance runner was also freshly rerun: automatic replacement/admission/late admission/supersession scenario and separately held A token-refresh scenario both passed.

Browser boundaries: real React, Zustand, production auth/handoff/socket/admission modules and DOM; Firebase/Firestore and Socket.IO network transport simulated; routing and heavy visual children inert. No test manually creates B's socket or invokes B socket setup.

## 5. Regression, lint and build results

- Focused client: **7 suites / 89 tests passed**, including **6/6** strengthened eligibility/mounted tests and existing cleanup, lifetime, admission, guest-policy and handoff regressions.
- Server access-boundary/correction checks: **43 passed** over real production registered middleware/handlers and real Socket.IO transport.
- Additional real-server membership witness: password admission creates durable A entitlement; client disconnect keeps membership and performs zero revocations; a fresh same-UID connection resumes without a password through retained membership. External token verification and durable persistence are simulated at fixture boundaries.
- Changed permanent regression ESLint: **0 errors / 0 warnings**, including `--max-warnings 0`.
- `useSocketConnection.js`: **0 errors / 0 warnings**.
- `MultiplayerApp.jsx`: **0 errors / 51 pre-existing warnings**. Diagnostic rule/message/location comparison matches HEAD; no new lint findings.
- Detached `npm run build`: **Compiled successfully**, exit **0**. Logs: `D:/AppData/Temp/opencode/p5-38-build.log`, `p5-38-build.exit`.
- Scoped `git diff --check`: passed.

Focused client command:

```powershell
node "node_modules/react-scripts/scripts/test.js" --watchAll=false --runInBand --silent --testPathPattern="useSocketConnection.eligibility|waveA_guestAndSocket|waveA_rCorrections|waveA_blockerCorrections|waveA_handoff|waveB_b1b5Corrections|waveB_b6b11ProductionClosure"
```

## 6. Remaining demonstrated source failures

No remaining P5-38 source failure was demonstrated by these checks. P5-01 final independent acceptance and nine external gates remain separate. No P6 work, commits, pushes or deployment were performed.

**P5-38 IMPLEMENTATION COMPLETE — READY FOR CONSOLIDATED FINAL P5 SOURCE ACCEPTANCE.**
