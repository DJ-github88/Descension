# P14-A1 — final bounded independent acceptance

**Verdict: ACCEPT within the frozen P14-A1 capability and assessed seams.**
2026-10-22 · Same single user-authorized reviewer · `master/ad93fd78048a49030f28af18e23bcf0e91a2aa85`, dirty concurrent worktree.

**Unresolved concrete findings: none.** Original F1 (incomplete whole-record reconciliation) and F2 (lost definition identity on reopen) are closed. Original findings, probe and interim assessments remain in `REPORT.md`; final exact hashes are in `final-source-hashes.json`. This is not a full-repository audit, C4 reacceptance or P14 completion.

## Final source appraisal

- **Whole-Wizard boundary:** `authoredAbility.js:30–100` reconciles outer/draft mechanics, serialized data, effectsMap and targeting; rejects unsupported active mechanics; retains explicit AP/mana/range integer requirements. Healing globalResolution must agree with DICE. No compiler relaxation. Reopen and all affected save producers retain definition identity and detached mechanics; explicit editing creates a newly admitted immutable version rather than mutating installed history.
- **Free remote actions:** `spellConsequence.js:348–355` and `spellPayments.js:258–278` agree on an unchanged AP compare-and-set only for authored, nonself actions with zero AP/mana price. It satisfies the existing nonempty source operation requirement, debits nothing and retains exact source/target revision checks and resource conservation. The focused production test includes the free remote case.
- **Edit handoff:** `SpellLibrary.jsx:1424–1440` clones the selected record and captures the owner guard when Wizard is unmounted. `SpellwizardApp.jsx:187–193` clears the one-shot request before consuming it only under the current guard. `spellbookStore.js:258–261` excludes the transient request from persisted fields. Existing direct/global load routes remain. No new server authority or durable replay queue is introduced.
- **Accepted-history recovery:** `actorConsequenceHandlers.js:373–391` confirms current authority, then checks consumed receipt/hash/owner before actor/definition revalidation. This permits exact accepted-history recovery after deletion/revocation without authorizing fresh execution. Unconsumed work still undergoes current ownership, registry, Stunned, pending/closed-ID, epoch and replay-window checks before registration.
- Registry admission/install, private projections, P7 approval-bound payment/HP/receipt and synchronous consumption, exact-roll custody, unknown replacement blocking and explicit same-command recovery retain the previously reviewed boundaries. No new concrete bypass found in the bounded refinements.

## Production evidence independently appraised

Reviewer read the retained witness source, App7 result/receipts and scoped ARIA records, desktop/tablet-viewport captures, Build4 record/log and final identity gate. **Reviewer did not launch or execute these runs.**

- **Build4:** optimized production compilation succeeded, exit 0; `mirrorDrift:[]`, `concurrentLiveDrift:[]`. Recorded hashes for all 16 scoped client files match current independent measurements. Asset-manifest hash independently matches the build record.
- **App7:** PASS. Witness authors two distinct definitions with actual Wizard controls and Complete Spell, closes/reopens the normal library, explicitly admits via GM UI, then executes physical damage and digital healing through owner exact consent, GM final adjudication and registered P7. Assertions establish no pre-spend, original faces/arithmetic in receipts, temporary-first payment, capped healing, owner personal HP projection, observer narration and HP feedback.
- Lost ACK **and** GM accepted broadcast are suppressed for damage; the witness waits for unknown/disabled replacement, reloads GM, checks exact original command bytes, asserts no additional receipt and exactly one observer chat record. Owner reload creates no new receipt and reloads the installed actions.
- Actual compact-library Edit preserves UUID and explicit zero AP/mana/range; local edit leaves installed v1 untouched; explicit admission creates v2 with a new hash. Mixed healing/debuff remains saved/manual, admission disabled and receipt count unchanged. Captures cover 1440×1000 and 1024×768 viewports; this is not a physical-tablet certification.
- App7 records three nonfatal GM `Failed to fetch` page errors. They remain disclosed; the retained witness completes the relevant assertions. No deployed-provider/network-health claim is made.

## Identity, execution provenance and limits

Independent `Get-FileHash -Algorithm SHA256` measurements match all **22** App7 sourceBefore/sourceAfter entries, the final identity gate, Build4/App7 records and witness identity. All **7 protected files** match their expected hashes and `git diff --exit-code -- <protected paths>` returned 0. Required A1a service SHA256 remains **`48b69255b8958ae75a7aa17ed7aa67c95b6d4c2bada63f4dcd24a305e20f0003`**. HEAD/branch were independently checked. Rules/data collateral is identity-bound, not broadly audited.

Implementer-reported execution: 10 focused authored server PASS; 70 earlier affected production regressions PASS; final affected P9 10 PASS after race repair; final client 6 suites/74 tests PASS, earlier 65 condition/feed/Laws and 4 roll tests PASS; unchanged reviewer probe 15 PASS; prior scoped lint 0/detector `[]`. Overlap is disclosed and counts are not summed. Raw test logs were not independently rerun or supplied as part of this final identity manifest. The reviewer sandbox constraint still prevents independent target execution; acceptance rests on independent source/evidence appraisal plus attributed implementer execution.

Provider authentication, ownership/lease/cloud persistence setup remain fixtures around the real optimized App/router and registered backend. App receipts shown here are temporary-room/live-only; cloud checkpoint durability is not established by that App run (focused server/checkpoint evidence addresses the bounded codec/recovery seam). No live deployment, second-device, adversarial provider or unrelated concurrent-work acceptance is implied. Fresh source changes beyond the final recorded hashes require appropriate delta review. No application sources, historical tests, Git state or dependencies were written by this reviewer.

### Retained evidence

- `D:/AppData/Temp/opencode/p14a1-app7/result.json` — SHA256 `f38de14446ab54ee11d7b2d7e05344305ec12a3b9a566dd42aa6a2e18dd0d524`
- `D:/AppData/Temp/opencode/p14a1-build4/build.json` — SHA256 `ffa602432e8fe3c4762f38809683c5bf300a4af66422e58d4975e6a034660b95`
- `D:/AppData/Temp/opencode/p14a1-final-evidence.json` — SHA256 `94f806db35cb40c5bd324f5b376a262fc0f39156a2bee3aea4653087295eada4`
- Same external review directory: `final-source-hashes.json`, original `bounded-probes.cjs`, historical `REPORT.md` and prior hash manifests.
