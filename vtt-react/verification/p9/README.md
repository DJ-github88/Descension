# Original P9 implementation witnesses

**Implementation checks only. Final acceptance belongs to the independent reviewer.**
Authority: frozen `docs/MYTHRILL_PROJECT_9_CONTRACT.md`, original roadmap
`MYTHRILL_NEXT_PHASE.md:1138–1186`, P7 F1–F6/C1–C6 and accepted P8.

## Execute into fresh evidence

From `vtt-react`, set `P9_OUTPUT` to a new directory, then:

```text
node verification/p9/checks.cjs server      # P9 production stack + non-writing affected server suites
node verification/p9/checks.cjs focused     # P9 + affected frontend suites
node verification/p9/checks.cjs lint        # P9-touched frontend files (incumbent errors reported)
node verification/p9/checks.cjs browser     # real Chrome; set P9_CHROME to an executable if no Chrome channel
node verification/p9/checks.cjs server-p7   # disposable mirror only: these P7 suites rewrite retained P7 evidence JSON
node verification/p9/checks.cjs seal        # source packet, diff, P8 identity comparison
```

Each run writes `command.json` (argv, cwd, start/end, exit, before/after hashes,
drift, accepted P8 comparison) and `output.log` into a timestamped folder.

## Coverage

| Witness | Where | Observation |
|---|---|---|
| S1/S2 | `src/services/__tests__/spellConsequence.test.js` | Adapter over every authored class spell: exactly Slug, Prayer, Opening Chord, Harmonic Strike supported; precise manual reasons; approved formula vocabulary and refused tokens. |
| S3/S9 | server `p9SpellConsequences` + `browser.cjs` | Owner sync, approval, GM adjudication, one receipt; temp-first; class home; target HP; public receipt/projection without private class fields; P3 encode/decode; checkpoint-confirmed label only from the writer. |
| S4 | unit + server + browser | Sphere recipe, Minstrel exact pitches, Martyr spent ledger and self-heal; Pyrofiend stays manual and still latches. |
| S5 | server | Revision bump/split change: stale refusal, GM re-prepares, no owner re-approval; class home change: `owner_reapproval_required`, approval closed, owner notified. |
| S6 | server + browser | Legacy class write and owner sync fenced while pending; non-owner/foreign/malformed refusals; legacy envelopes cannot write the home; import/rebind never adopt it. |
| S7 | server + browser | Approval/command ACK loss: same bytes, one roll/payment/receipt; actual page reload keeps custody; withdraw/decline truthful and final; runtime change → outcome_unknown. |
| S8 | `ActionBarP9Producer`, `SpellActionBarP9Producer` (jsdom mounts) | Supported spell opens owner approval with zero local spend/cooldown/empty-target emit; cooldown only from the accepted-receipt event; unsupported keeps manual confirmation with diagnostic; offline unchanged. |

Fixtures: provider ID verification, canonical owner documents, lease backend, cloud
transport, writer status sink wiring (parity with `server.js`), inherited inert Firebase
SDK/config/router. Real: registered Socket.IO middleware/authority, P7 staging/CAS/admission,
writer, P3 codec, stores, P7/P9 services, scoped custody and the mounted P9 host.

Not proven here: human tabletop/creator, two-device, live Firestore/rules/backend lease,
full-App build/visual, deployed crash/restart. P5-05/07/09/10/11/12/13/31/32 remain open.
