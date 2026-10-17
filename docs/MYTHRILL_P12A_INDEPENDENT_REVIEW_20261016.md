# P12A bounded independent source review — 2026-10-16

**Final source verdict after repair verification: PASS for the bounded P12A scope.** B1, B2 and S1–S4 are resolved in the reviewed source. See the repair disposition and final source hashes below.

**Initial verdict (preserved): BLOCK source acceptance pending B1–B2.** Four additional should-fix findings follow. The findings and original line references below describe the initial source, not outstanding defects in the repaired snapshot.

## Basis and limits

- Reviewed the working-tree production additions against `MYTHRILL_PROJECT_12_CONTRACT.md` revision 3a and the explicit constraint that critical armor bypass must not extend to flat DR. P12B and D-A…D-J remain unapproved.
- Base HEAD: `8ea1abff1d8c1f959b2d4a10e6b7ca73879c2ff2`; reviewed additions are uncommitted. Line numbers below refer to the source inspected during this review.
- Scope: `strikeApprovals.js`; strike handler additions, binder dispatch/close, event allowlist/rates; `weaponStrike*.js`; panel/CSS; action-bar routing, host/handler registration and private-storage registry additions. Existing P7/P9 and room lifecycle helpers were read only to establish the affected call paths.
- Evidence is source tracing. No tests, browser checks or builds were run, and no production code was changed. The implementation agent is expanding tests and owns runtime validation. This is one bounded source review, not release or deployment acceptance.

## Blocking findings

### B1 — A refused GM command can permanently lock its still-pending card

**Source:** `vtt-react/src/services/weaponStrikeService.js:142–156`; `vtt-react/src/components/hud/WeaponStrikePanel.jsx:96,122–125,143`.

`settleGm` records every receipt-less response as `unknown`, including an explicit `stale_actor_revision` refusal. The approval remains in `gmPending`. Its card disables both editing/confirmation and decline, and offers only **Check same command**. The reconciliation control exists only for statuses **without** a pending card. Retrying the retained stale command cannot repair its expected revisions. Reload restores the unknown status and the pending approval, reproducing the lock.

**Concrete path:** another accepted actor change wins during the server's authority await → strike command receives `stale_actor_revision` → the unchanged approval is permanently locked from GM correction/decline in this UI. A genuinely unknown command with a still-pending approval also lacks the reconciliation action the status message instructs the GM to use.

**Bounded fix:** provide an explicit recovery/reconciliation path on the pending card while retaining the original command. Distinguish a proven command refusal from delivery uncertainty; allow explicit fresh preparation after a definitive refusal or GM reconciliation. Never silently regenerate a command for an unknown result.

**Affected check:** stale-revision refusal followed by usable recovery, including after reload; also a timed-out command whose approval remains pending.

### B2 — Same-socket rejoin does not recover missed pending approvals

**Source:** `vtt-react/src/components/hud/WeaponStrikePanel.jsx:130–136`; `vtt-react/src/services/weaponStrikeService.js:111–116,177–191`.

The only automatic pending-list read is the host effect keyed by `[shared, uid, roomId, socket]`. Strike handlers subscribe to pending/closed/accepted events, but not a successful rejoin. On an ordinary transport reconnect the socket object and those scalar dependencies remain unchanged. The existing connection handler changes connection status (`connectionHandlers.js:140–166`), and the existing reconnect branch returns after refreshing party members (`roomLifecycleHandlers.js:38–158`). Neither performs a strike list read.

**Concrete path:** GM disconnects → owner registers a strike while the GM is offline → the one-shot pending event is missed → GM rejoins on the same socket object → no card appears. There is no visible refresh-pending control, and an owner checking the same approval only gets `awaiting_gm`; that existing-entry path does not resend the GM event. Missed closure events likewise leave stale cards.

**Bounded fix:** perform a principal/room-fenced `actor_strike_list` read after successful rejoin, or an equivalent reliable connection-generation signal, and replace the pending projection. A list read must not automatically resubmit approvals or commands. A visible refresh control is useful as recovery, but rejoin must itself restore pending state.

**Affected check:** owner approval and closure while GM is disconnected; reconnect with the identical socket object and room ID.

## Should-fix findings

### S1 — The 32-entry GM custody bound becomes a lifetime strike limit

**Source:** `vtt-react/src/services/weaponStrikeCustody.js:17–18`; `vtt-react/src/services/weaponStrikeService.js:118–121,154–156,169–174`.

Each GM command appends a new ID to `record.gm`. Acceptance and reconciliation retain the entry forever, and no removal/pruning path exists. After 32 completed strikes, preparing strike 33 throws `Prepared strike custody capacity reached` before emission. Reload/rejoin preserves the same full map. This counts resolved history as active custody and makes a normal room eventually unusable on that GM device.

**Bounded fix:** reserve the bound for unresolved prepared commands; retain only a bounded/latest resolved history and retire terminal entries when making room. Preserve unresolved exact commands and never evict them merely to admit a new strike.

**Affected check:** 33 sequential accepted strikes, plus capacity with unresolved commands that must remain retained.

### S2 — Closed-ID memory can exceed the frozen 4096-ID maximum

**Source:** `server/services/strikeApprovals.js:101–114`.

Admission checks only the current closed count; closing an existing pending entry always inserts another ID. At 4095 closed IDs, up to 32 different owner/character approvals can still be admitted, and closing them produces 4127 closed IDs. Registration eventually stops, but the stated hard bound has already been exceeded. The analogous historical P9 behavior does not establish the new P12A invariant.

**Bounded fix:** reserve closed-ID capacity when admitting a pending ID (count closed IDs plus outstanding reservations). Closing/consumption must always be able to retain its tombstone; do not evict IDs or fail after installing a consequence.

**Affected check:** near-limit admission of multiple distinct pending approvals, followed by withdrawal/decline/consumption.

### S3 — UUID and rank checks accept non-string JSON values

**Source:** `server/services/strikeApprovals.js:53,69–70`.

`UUID.test(approval.approvalId || '')` coerces its argument, so `approvalId: ["<valid UUID>"]` passes. Similarly, `own(RANK_DIE, proficiency.rank)` and `RANK_DIE[proficiency.rank]` accept `rank: ["TRAINED"]` with die 8. These violate the exact frozen schema. The array approval ID is particularly troublesome: it becomes a `Map` object-identity key after cloning; a later approve/withdraw/GM command carries a different decoded array and cannot find it, leaving an unwithdrawable pending approval occupying capacity.

**Bounded fix:** require `typeof approval.approvalId === 'string'` and `typeof proficiency.rank === 'string'` before their existing UUID/enum checks. Keep the existing size and exact-key checks.

**Affected check:** single-element array UUID and rank inputs must return `invalid_strike_approval` and install no pending entry.

### S4 — Cross-P9 ID isolation is one-way and can create ambiguous receipts

**Source:** `server/services/strikeApprovals.js:123–125,201–238`; `server/handlers/actorConsequenceHandlers.js:264–295,433–475`; `server/services/actorConsequences.js:245–247`.

The new strike registration gate correctly refuses IDs already present in P9. The reverse order remains possible: register a strike ID, then register a valid P9 approval with that same ID while neither has a receipt. The unchanged P9 path does not inspect strikes. Both binders subsequently use only their own pending registry and can consume the two approvals under separate GM commands, producing two `owner-approval-gm` receipts with the same `proposalId` and different hashes/capabilities. After strike-first consumption, P9's unfiltered receipt lookup can return the strike receipt instead of its own later receipt, making a same-P9-approval check return `command_id_conflict`.

This is **not** the frozen, accepted case of P9 withdraw/decline merely echoing an already-public strike receipt: here both approvals existed before consumption, and both can commit. Each command still requires the GM and its own approved price; this is an identity/recovery defect, not evidence of unauthorized spending.

**Bounded fix:** enforce a synchronous cross-registry/foreign-receipt conflict check at the shared binder-dispatch boundary before either capability can consume an ID claimed by the other, including registration-await races. Keep P9 handler/module code unchanged if retaining that freeze constraint. Clarify the one-way registration wording if necessary; do not treat deliberate reuse as an ordinary retry.

**Affected check:** strike-first then P9 registration under the same ID, both consumption orders, and a P9 registration suspended across its authority await. No pair of accepted receipts may acquire the same approval identity across capabilities.

## Notes / source invariants observed

- **Critical flat DR:** client `weaponStrike.js:89–94` leaves it in the manual condition list with explicit wording; server `strikeApprovals.js:172–178` refuses an automated flat-DR step on a critical. Armor is informational. No extension of critical armor bypass to flat DR was found.
- **Authority:** new registration confirms the captured room/session authority and rechecks owner attachment, consumed/pending/closed/foreign IDs, epoch, window and affordability after the await (`actorConsequenceHandlers.js:447–475`). Direct consequence staging rechecks current actor revisions; binding requires GM/direct authorization and recomputes exact temp-first AP/HP. Consumption uses the selected binder synchronously after admission. No widening to P12B or non-HP/AP effects was found in the reviewed additions.
- **Strict adjudication:** exact nested keys, size/text limits, echo hashes, weapon chain derivation, manual-verdict presence, canonical not-applied entries and final-resource equality are enforced. S2–S3 qualify the bounds/schema assessment.
- **Manual proficiency:** per-type rank resolution avoids the legacy shared rank; the GM choice starts empty, raw proficiency faces do not select a face, and table damage is not added by the planner. Complete selected face text is recorded and presented as not applied.
- **Defense and public data:** the planner restricts automation to the frozen tier/lone-DR cases; other relevant sources require the compact verdict. New public adjudication data contains defense categories, the allowed automated step and explicitly public ruling text, not the private defense-item list or `skillRanks`. Existing P7 condition projections are unchanged. Published-tier provenance remains the GM client's check, as frozen; the server verifies allowed tier shape/arithmetic.
- **Exact checks/unknown:** owner checks resend the retained approval and GM checks resend the retained command, including its ID. Retained receipts are consulted before epoch/window rejection on the server. Receipt-less timeouts remain unresolved and do not claim no payment. The owner blocks a new strike while unresolved. These source properties do not cure B1–B2 or S4.
- Event names and rate values match the frozen P9 pattern; action-bar routing and host/socket/private-family registration are present. Runtime acceptance, build and full-App gates remain separate from this verdict.

## Final repair verification — same bounded review, 2026-10-16

**Disposition: all six original findings closed on source inspection. No unresolved blocking or should-fix defect was identified in these repair paths.** This continuation verified the six reported repairs and their immediate integration; it did not start another audit or extend the approved scope.

| Finding | Final disposition and source evidence |
|---|---|
| **B1** | **Resolved.** `weaponStrikeService.js:145–161` distinguishes listed definitive refusals from unknown delivery, retains the prepared command, and permits explicit fresh preparation from a refused/reconciled state. `WeaponStrikePanel.jsx:125–126` offers exact command checking whenever a pending card has a retained command and reconciliation while locked. Editing/confirmation can resume after refusal or explicit reconciliation, including restored custody. Unknown results remain locked until an explicit recovery action; no automatic new command is prepared. |
| **B2** | **Resolved.** `weaponStrikeService.js:182–198` registers and cleans up a `room_joined` listener. It invokes the list refresh under the captured principal/generation and current room fence. `refreshStrikeApprovals` (`111–116`) independently fences the response and replaces the pending projection. This covers same-socket reconnects without resending an approval or consequence. Initial join remains covered by the host effect. |
| **S1** | **Resolved for the reported lifetime custody limit.** `weaponStrikeService.js:118–124` retains all other unresolved commands, at most seven other terminal custody entries, and the current entry. Sequential accepted strikes therefore no longer accumulate a permanent 32-entry device-custody barrier. The existing hard custody limit still refuses before emission if unresolved custody fills capacity; unresolved command bytes are not evicted. |
| **S2** | **Resolved.** `strikeApprovals.js:101–107` checks closed count **plus pending count** before admission. Each pending ID reserves its eventual non-evicted tombstone, so ordinary closure/consumption transfers that reservation rather than overflowing 4096. No fallible capacity check was added after consequence installation. |
| **S3** | **Resolved.** `strikeApprovals.js:53,69` requires string UUID and rank values before the existing regex/own-property/ladder checks. The array-coercion inputs identified in the initial finding are rejected before registry insertion. |
| **S4** | **Resolved.** `actorConsequences.js:245–253` checks cross-registry/foreign-receipt collisions synchronously before either selected binder runs. Strike commands check P9 pending/closed IDs and non-strike receipts; P9 commands check strike pending/closed IDs and strike receipts. No await separates this guard, binding, staging and admission. `knownReceipt` remains ahead of the guard, preserving an already-accepted identical command retry. A reverse-order registration race may leave conflicting pending approvals, but cannot produce two accepted cross-capability receipts with that identity. Such a collision is an explicit refusal, not a retry. |

### Constraint and integration verification

- The contract's narrow clarification at `MYTHRILL_PROJECT_12_CONTRACT.md:9–19` records tombstone reservation, shared-boundary collision refusal and the critical flat-DR distinction. It approves no creator decision or P12B consequence.
- Critical flat DR still stays manual in `weaponStrike.js:89–94`, and the server still refuses its automated use on a critical in `strikeApprovals.js:173–178`.
- The production diff confirms `spellPayments.js` has no changes. The P9 approval handlers are unchanged; the existing consequence handler's only modified line remains binder-specific consumption/close, followed by the additive strike handlers.
- Exact owner/GM replay, public defense-category privacy and manual proficiency behavior from the initial review remain applicable. The repairs do not add payment on approval, automatic resubmission or non-HP/AP consequences.

### Validation provenance

- **Independently performed here:** source inspection of repaired paths, shared-boundary/P9 diff inspection, focused inspection of the added registered-stack regression cases, `git diff --check` on the repair paths (passed), and SHA-256 capture below.
- **Reported by the implementation agent/user, not rerun by this reviewer:** registered P12 server tests **13 passing**, affected server checks **49 passing**, frontend **14 suites / 126 tests passing**, and scoped server lint corrected/passing.
- No production edits, test execution, browser work or full build were performed by this reviewer. The final verdict is source acceptance for this bounded P12A review; it does not substitute for the separate build, full-App, Firebase, two-device or human-session gates.

### Final source fingerprints

SHA-256 of the working-tree file bytes captured at repair verification, with `SpellActionBar.jsx` amended at same-review final closure below. Whole-file hashes identify the snapshot; review coverage remains the scoped additions/repairs, not unrelated content in those files. `spellPayments.js` is included as the unchanged P9 baseline.

```text
CB1333EB286D51E70A0AD4EA6D612FA66DFA0A12C3CDCC1D1FE496CACF893F61  server/services/strikeApprovals.js
4F796C5D723B22D0377149161CC6A595419B63D73DC31A0D31AB49F2C16CE79F  server/services/actorConsequences.js
DF7EAE4358D575459B7E8E44447AFE1DE683485FB73AD7EAA88EADD14F08B78B  server/handlers/actorConsequenceHandlers.js
A40880BD455F57DBCE0D54C9EE54D8806A057C0C5D7419123B942C9BACB3CD25  server/handlers/socketHandlers.js
880F925BE83F1CEDFA9980F0781BA489B864D87F3DB2A9CD2380E1D0CBD917AC  server/services/rateLimitService.js
B3D8194A9CB39286980B81F5B0DEB2F4E4C6521E824373D4CE0D64E3CE9BD208  server/services/spellPayments.js
3405E26943FFF83EB733502F43B52DE0B4104F8BD77FCF49039C027942EF3D27  vtt-react/src/services/weaponStrike.js
77335E330E2DC91A446FF8F5EB7EB404C5CEC8B803C9DF0235A60387E72DA8BE  vtt-react/src/services/weaponStrikeService.js
D800F3137E077DE8DCD5A003E4B19B44405F5D1DFA40587FCB075312EB0A8ACC  vtt-react/src/services/weaponStrikeCustody.js
89C66F68F283CB9B1597E8601BCCC8FBE9D20CEAE3BF3C30A4F4587E0A3A5A17  vtt-react/src/components/hud/WeaponStrikePanel.jsx
D5B5C93636E43052BD2A2A60BF768F8BFA33C2F4C97E932EBF6DFE3EE271D63C  vtt-react/src/components/hud/WeaponStrikePanel.css
28FD53A74A6CB46CD2F520C836A998F9D44D159CBB7C19A346A841F525946389  vtt-react/src/components/ui/ActionBar.jsx
F413208B4C6D53DF30EA49EF6898B8710729BF3CBC789CE108D1CB45D6A9FC23  vtt-react/src/components/ui/SpellCastConfirmation.jsx
34F4A5CA812807807B6657170D94BD9D1ECFA41987EBBFB19451A35C6D9C1321  vtt-react/src/components/character-sheet/SpellActionBar.jsx
88E6785A7716C163955076A258C6A917401E27B6A2B43D855D1BFE69AF97D405  vtt-react/src/components/hud/PartyHUD.jsx
E044B624F9C1ECB82D8A742A135B67AADDDCA551FAC88AEA4489EA2B4433C353  vtt-react/src/components/multiplayer/socketHandlers/registerAllHandlers.js
9332A8D8BF4EFF65A3BC93973B8F9BB8F061AE11D493EFEE65981614B3015BDB  vtt-react/src/persistence/privateStorageRegistry.js
```

## Same-review final closure — 2026-10-16

**Bounded source verdict remains PASS; this review is closed.** All six initial findings and their repair dispositions remain preserved. No relevant routing or binder-guard drift was found in the two closure checks requested; this was not a new audit.

- **Current sheet routing preserved:** `SpellActionBar.jsx:289–295` still routes equipment actions through P12 first, then P9, before local confirmation. `926–940` still returns from P12/P9 routing before any local resource-cost path. The inspection-panel producer at `1850–1855` preserves the same routing order. The manual-path diagnostics at `2125–2126` remain present. Removal of `useActionBarAsset` and the presentation class-name additions do not alter these routing decisions.
- **Shared collision guard preserved:** `actorConsequences.js:233–253` still recovers the known exact command receipt first and performs the synchronous symmetric cross-domain collision check before either binder consumes. Its SHA-256 remains `4F796C5D723B22D0377149161CC6A595419B63D73DC31A0D31AB49F2C16CE79F`.
- **Fingerprint amendment:** the sheet's prior repair-review SHA-256 was `1BD8FAFFC42AFA07980B1D638BA38A40A237117561FC5D76279D3BE035B175E8`; its current SHA-256 is `34F4A5CA812807807B6657170D94BD9D1ECFA41987EBBFB19451A35C6D9C1321`. The current value matches `build.json`'s `src/components/character-sheet/SpellActionBar.jsx` entry. The implementation owner reports the accepted new P12 modules unchanged since repair verification; this closure did not reopen their review or a CSS audit.

### Frozen runtime evidence — attributed to implementation

Artifact root: `D:/AppData/Temp/opencode/p12a-frozen-final-20261016/`. Production snapshot: `build/`; manifest: `build.json` (records build exit **0**). The reviewer read the supplied result artifacts and manifest entries, but did not execute their checks, rerun tests, launch browsers or rebuild.

| Implementation artifact | Reported successful coverage |
|---|---|
| `accepted-app/result.json` (`passed: true`) | Full optimized App: all three P12 producers; miss/hit/critical and digital rolling; lost acknowledgements with exact owner/GM reload checks; same-socket rejoin; 33 completed strikes with GM custody count **8**; runtime-change unknown. Also reports P11 full-App sheet/per-weapon ranks/legacy handling, canonical working-payload reload, and wizard budget/Summary/existing-character edit. |
| `stale-recovery-closed/result.json` (`passed: true`) | Final-adjustment reason gate; server-handler post-await stale refusal; GM reload; explicit corrected preparation with a new command ID and exactly one strike payment. The artifact records distinct refused/accepted command IDs for the same approval. |
| `p8-p9-app/result.json` (`passed: true`) | Full-App P8/P9 regression witness on the frozen production build. |

External provider/network errors were deliberately blocked by the implementation witnesses and remain declared in the artifacts. Identity/provider ownership, lease storage and cloud writes use fixture boundaries. This evidence does not claim live Firebase/rules, a physical second device, a human session or staged deployment. Source acceptance remains the bounded verdict above; runtime results are implementation-owned evidence, not an independent rerun.
