# Original P9 — implementation handoff (not acceptance)

**Status: PASS — independently source-accepted 2026-10-15 (cycle2), after the single bounded repair of the cycle1 BLOCK (B1/B2).** Report: [MYTHRILL_P9_SOURCE_INDEPENDENT_ACCEPTANCE_20261015.md](MYTHRILL_P9_SOURCE_INDEPENDENT_ACCEPTANCE_20261015.md).
Cycle1 BLOCK report, probes and cycle2 evidence: `vtt-react/verification/p9/evidence/independent-review/`.

Date 2026-10-15. Contract: [MYTHRILL_PROJECT_9_CONTRACT.md](MYTHRILL_PROJECT_9_CONTRACT.md) (frozen V1).
**Implementation evidence only. Independent acceptance is separate.** No commit, push or deployment.

## Identity

- `D:/VTT`, branch `master`, HEAD `dd445bec3a295f2a1d1aad8ec0b77e1d2f5e3334`, dirty. Concurrent
  presentation edits preserved: `LandingPage.jsx`, `LandingPage.css`, `LibraryFilters.jsx`
  (not P9 inputs). One gitignored helper exists only on the device
  (`vtt-react/src/data/talentTrees/transform_descriptions.js`, not loaded by any witness).
- Device seal: `vtt-react/verification/p9/evidence/implementation-20261015/seal-*/{source.json,source.diff,seal.json}`.
  Accepted P8 principal SHA256s: unchanged except the two intentional client seams below.
- Existing files were merged preserving each line's original ending (several files are CRLF
  or mixed on the device); every merge was verified to normalize to the reviewed content and
  every device original was verified against HEAD before merging (no concurrent drift).

## Changed paths

New: `server/services/spellPayments.js`, `server/tests/p9SpellConsequences.production.test.js`,
`vtt-react/src/services/{spellConsequence,spellConsequenceService,spellConsequenceCustody}.js`,
`vtt-react/src/components/hud/SpellConsequencePanel.{jsx,css}`, tests
`src/services/__tests__/spellConsequence.test.js`, `src/components/ui/__tests__/ActionBarP9Producer.test.jsx`,
`src/components/character-sheet/__tests__/SpellActionBarP9Producer.test.jsx`, witnesses
`vtt-react/verification/p9/{README.md,checks.cjs,fixture.cjs,browser.cjs}`, this report and the contract.

Modified: `server/services/actorConsequences.js` (typed `classPayment` entry, approval binding,
receipt projection, protected key, import strip), `server/handlers/actorConsequenceHandlers.js`
(approve/withdraw/decline/list, consumption, re-approval notice, bind strips stale home, mirror),
`server/handlers/characterHandlers.js` (legacy class-write fence), `server/handlers/socketHandlers.js`
and `server/services/rateLimitService.js` (registration/limits), `vtt-react/src/services/actorConsequenceService.js`
(`approval` prepared-command field; exported fenced request), `persistence/privateStorageRegistry.js`
(classified `room.spellConsequenceLatest`), producers `components/ui/ActionBar.jsx`,
`components/character-sheet/SpellActionBar.jsx`, `data/classes/arcanoneer/components/ArcanoneerResourceBar.jsx`,
`components/ui/SpellCastConfirmation.jsx` (diagnostic), `components/hud/PartyHUD.jsx` (host mount),
`components/multiplayer/socketHandlers/registerAllHandlers.js`.

Unchanged: P7 command bounds (≤2 actors), CAS, writer admission, receipts' existing fields, static
spell/creature data, class planners/contracts, P8 controller/planner/custody.

## Player/GM workflow

1. In a shared room, a supported spell clicked on the HUD bar, a sheet slot (or any sheet/HUD
   producer) opens the P9 panel instead of the local confirmation. Nothing is spent.
2. The owner (exact primary attachment) picks an exact bound target on the same map, records one
   roll (digital, or physical faces), reviews the price (AP/mana, temporary first; class before → after)
   and approves. If their sheet class value differs from the room home, it is first published (owner sync).
3. The GM sees the request (public class fields only), adjudicates legality/range/defense/mitigation,
   enters the final amount (reason if changed) and accepts one consequence — or declines.
4. The server binds the GM command to the approval: same refs/definition/roll, exact temp-first
   payment from current pools, exact target arithmetic, class home still equal to the approved
   before-state. One atomic P7 receipt installs source pools + class home + target HP.
5. Everyone's result line comes from the receipt; the matching owner's sheet takes the pools and
   class value; a HUD cooldown starts only then. Withdraw/decline/refusal say "no payment was
   recorded" only when the server confirmed it; unknown outcomes offer "check this same approval/command".

## Evidence

Executed in the device checkout (`vtt-react/verification/p9/evidence/implementation-20261015/`):
`seal`, `server`, `lint`, `focused` (see each folder's `command.json`/`output.log`). The device host
ends any process left running after a call, so long suites were split with `P9_SUBSET`; the empty
`server-1792055979062` and `focused-1792056886120` folders are host-terminated attempts with no result.

Executed in a disposable mirror cloned from the same HEAD with the same P9 files, because the device's
Linux shell has no Chrome and the P7 suites rewrite retained P7 evidence JSON: `browser` (real Chrome),
`server-p7`, plus affected P8 `browser`/`rejoin`/`runtime` and P7 `owner`. Mirror/device identity:
2,347 files under `vtt-react/src`, `server/{services,handlers,utils,tests}`, `verification/p6–p9`,
`public/data`, `docs` have identical LF-normalized SHA256s (combined `4643c8011d72b3763ccc88ebc8840804f8b47a89c6cb87f3dd514dda57f3b83e`),
excluding the three concurrent presentation files and the ignored helper. Mirror logs are retained
under `implementation-20261015/mirror/`.

| Run | Result |
|---|---|
| Server P9 + affected (9 suites), device | 129 passing, 0 failing (`server-1792056141113`, repeated `server-1792056242760`) |
| Server P7 production suites (mirror) | 35 passing / 1 pending (archived opt-in RED), unchanged |
| Full server suite (mirror, development check) | 596 passing / 2 pending / 0 failing |
| Focused frontend (21 suites), device | 228/228 across five bounded host calls (`focused-1792056388755`, `-6567132`, `-6751827`, `-7065461`, `-7202349`); mirror single run 228/228 |
| Lint, P9-touched files | 0 new problems; 5 incumbent `migrateBlockId` no-undef errors and 33 incumbent warnings identical to HEAD |
| P9 Chrome witness S3/S4/S6/S7/S9 (mirror) | PASS, zero page errors, 7 receipts |
| P8 W1–W12 browser, B8-1 rejoin, runtime; P7 owner (mirror) | PASS |

## Repair (cycle1 BLOCK)

See the contract's repair erratum. Changed: `server/services/spellPayments.js` (window, runtime-long
closed/consumed memory, route check), `server/services/actorConsequences.js` (passes authorization to
binding), `server/handlers/actorConsequenceHandlers.js` (propose refusal, consumption recorded,
registration window, mirror only from the changing command), client `spellConsequence.js`
(`baseCommitSequence`, truthful refusal wording, N3 guard), `spellConsequenceService.js` (first-submission
tracking, unresolved/reconciled, GM retry wording, N4 candidate), `spellConsequenceCustody.js`,
`SpellConsequencePanel.jsx`; tests `p9SpellConsequences` (R-B1, R-B2 with real pruning, R-N1/N2) and
`spellConsequence.test.js`; witness `browser.cjs`, runner `checks.cjs`. Mirror after repair: P9 server
132 passing; full server 599 passing / 2 pending / 0 failing; focused 230/230; P9 Chrome witness PASS;
P7 server suites 35/1 pending; P8 browser/rejoin/runtime and P7 owner PASS; lint unchanged (incumbent only).

## Limits and open items

- **Creator decision:** `<attr>/K` rounds down (per Arcanoneer's authored text). Veto → non-integer quotients go manual.
- The P7 `lifecycle` browser witness could not run: it reads `D:/AppData/Temp/opencode/p7-final-20261013/...`,
  which this session was refused access to. The server `p7Lifecycle` suite passes.
- Incumbent defect observed, not changed: `ActionBar.jsx` references `migrateBlockId` without importing it
  (legacy non-bank Arcanoneer HUD path). P9 does not reach that path.
- P9's owner status does not mount the P6 save-status lane; a failed personal save after a P9 result
  shows through the existing P6 status (accepted in P8 W4), not re-witnessed here.
- Producers are witnessed as jsdom mounts; the Chrome witness opens the owner panel through the same
  `routeSpellCast` gate. No full-App build/visual, human tabletop, two-device, live backend or deployment proof.
  P5-05/07/09/10/11/12/13/31/32 remain outstanding.
