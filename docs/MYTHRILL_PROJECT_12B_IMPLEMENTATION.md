# P12B-thin — creature hit → owner block → atomic HP and wear

2026-10-16 · frozen contract revision 4 §3 ([MYTHRILL_PROJECT_12_CONTRACT.md](MYTHRILL_PROJECT_12_CONTRACT.md)) ·
checkout `D:/VTT` (uncommitted).

## Status

| Gate | Result |
|---|---|
| Creator decision | **C1/D-E approved** (item's current authored die = blocking die and wear track). No other D-A…D-J, C2–C5 or H-a…H-e answer is approved |
| Implementation | **Complete** for the frozen thin slice |
| Independent source review | One bounded review: initial **BLOCK** (one privacy defect, six should-fix) → all repaired in the same review → **PASS** |
| Integrated production build | **PASS** (exit 0; manifest outside Git) |
| App smoke | **P12B PASS**; P12A main + recovery and P8/P9 regressions **PASS**, 0 page errors |
| Live / human / deployment gates | Not closed |

No commit, push, deployment, P13 work, deep-storage feature, instance-id migration or generic GM override.
Concurrent work in the checkout was preserved: every commit was hash- or mtime-guarded.

## What was built

**Server** (`server/services/blockApprovals.js`, P7 touch points in `actorConsequences.js` and `actorConsequenceHandlers.js`).

Owner declaration (`blockingDeclaration`):
- server-enforced selection window: own turn in active combat; free out of combat; an unbound own
  combatant entry refused;
- checked against shared equipment, with CAS on the revision;
- owner only, never through `actor_propose`, refused while a block is pending;
- stored in `state.equipmentBlocking`, which is protected, moved to recovery on rebind and on import.

Owner/GM-scoped access only:
- `actor_blocking_view` and `actor_blocking_changed` reach only the owner and the GM;
- the general projection never carries the declaration;
- public receipts carry only the revision, or one minimal wear line. Declaration receipts withhold
  `contentHash` (review R1).

GM attack offer → owner block approval → consumption:
- bound by the reserved P7 `commandId`, the canonical attack hash, the refs and the creature revision;
- the GM's command is `[creature {ap}, character {hp, equipmentWear}]`;
- wear is recomputed: armor wears on 1–2, shield on 1, never while Defending; first available piece; one ladder step;
- HP and wear commit in one receipt.

Branches that stay GM-adjudicated: a critical against favored armor is refused at offer, approval and
consumption. A critical against a shield and non-physical damage each require an explicit ruling. Flat
DR, resistances, Evasion and conversion appear only as named rulings in the GM's final amount, with a
reason.

Approvals that can never be consumed are closed: stale declaration, piece gone, stale attack, rebind.

**Client** (`equipmentBlocking.js`, `blockingCustody.js`, `blockingService.js`, `hud/BlockingPanel.jsx`).
- **Owner chip and dialog:** order the favored piece and backups, or "Don't block". A block-roll card
  appears for each offered attack (digital roll or physical face).
- **GM form and pending cards:** review preview, ruling checkboxes, final amount and reason, check same command.
- **Private custody** (`roomEquipmentCustody`, saved with equipment and inventory in both the canonical
  and the runtime drafts):
  - revision lineage;
  - instance keys without minting: `instanceId`, else a uuid `id`, else slot-legacy;
  - duplicate receipt → no-op; gap → wait, then fast-forward from the scoped view after preserving
    prior values as a recovery candidate;
  - competing values → both kept, resolved only by the owner;
  - a whole-declaration conflict blocks writes until an explicit re-align;
  - retired attachments reconcile from owner recovery;
  - capacity: clean foreign entries are pruned, declarations are refused up front when custody is still full.
- **Breakage:** add to the pack first; clear the slot only on success. A full pack leaves the piece
  broken and inert in its slot, pending.
- **Device custody family** `room.blockingLatest` holds exact prepared bytes. It is registered in the
  P5 registry; the App smoke caught the missing registration.

**Existing defect fixed in the directly affected path:** `itemStore.updateItemDurability` used to clear
the slot first and ignore a full-pack refusal, which lost the item. It now adds first and clears the
slot only when the pack accepted the item. Focused regression: `store/__tests__/itemStoreBreakPath.test.js`.

## Verification

| Witness | Result |
|---|---|
| Server, registered stack | `p12bBlockWear.production.test.js` **12 PASS** (B1–B12); with P12A/P9/P7 suites **61 PASS** on the checkout machine |
| Client, focused | custody 14, rules/planning 7, break path 3, persistence 1: **25 PASS**. Affected client set (P7/P8/P9/P11/P12A/Laws/persistence): **16 suites, 142 PASS, 1 skipped**. P5 registry/storage-contract suites **10 PASS** |
| Custody scenarios (B12) | Interrupted save (crash before/after retention, torn write → conflict, never a second step); duplicate and out-of-order receipts; eviction fast-forward with preserved priors; moved, ambiguous and repaired equipment; character/account scope; retired attachment; full-pack breakage, interrupted add, no deletion or duplication; capacity refusal; whole-declaration re-align |
| Lint | New and changed client and server files: 0 errors / 0 warnings |
| App smoke, P12B | **PASS, 0 page errors:** real character sync publishes shared equipment (never durability) → refusal on another combatant's turn → declaration → offer → physical block roll → GM review/confirm → HP 20→15, creature AP −1, chest d8→d6 on the room and on the private sheet → duplicate delivery no-op → P6 character draft carries custody revision 2 with d6 → two held receipts released in reverse (gap waits, both apply) → d4 → broken with a full pack (stays equipped, pending; nothing deleted) → space freed → exactly one pack copy → next block uses the backup shield (face 2, no wear). The observer never receives declaration data |
| App regressions | P12A main (all strike/recovery/P11 witnesses) **PASS**; P12A stale-recovery **PASS**; P8 Feather Slash + P9 spell **PASS** |

**Independent review:** one bounded review by a separate agent.
- The initial BLOCK finding (R1) was a real leak: the declaration's public command hash could be
  brute-forced from public data. The reviewer recovered the order and dice in 341 hashes.
- R1–R7 and note 8 were all repaired and confirmed by the same reviewer: **PASS**.
- Leftover note 1 (`stale_attack` unreachable from the GM client's plan) was then repaired and is covered by B12.
- Record: `review-record.md` in the evidence folder.

## Build identity and evidence custody (outside Git)

`D:/AppData/Temp/opencode/p12b-20261016/`:
- `source-snapshot.tgz` (sha256 `d0212283…36d5`);
- `p12b-evidence.tgz` (sha256 `96970171…58a7`), unpacked in `evidence/p12b/`:
  - `build/`, `build.json` (asset-manifest sha256 `d7f204ef…2db2`, the build's source hashes, and
    concurrent live drift);
  - `app/`, `p12a-app/`, `p12a-recovery/`, `p8-p9-app/` results and ARIA snapshots;
  - `review-record.md`;
  - the container browser preload.

**Where it ran.** The build and App ran in the cloud workspace because the linked machine's shell has
3 GB, below the 4–8 GB the build needs. Source came from the hash-identified snapshot, with dependencies
installed from the checkout lockfile. Review and App-smoke repairs were applied identically to the
snapshot and to the checkout (hash-checked).

**Limits of this build:**
- no `.env` files (Firebase Demo Mode; the witnesses refuse Firebase anyway);
- `public/assets` absent except three CSS-imported images;
- `GENERATE_SOURCEMAP=false`;
- external font/CDN requests fulfilled empty by a container-only preload, because the sandbox cannot
  reach them and a failed `@import` made the CSS chunk loader reload in a loop.

**Concurrent drift.** 28 unrelated live files changed after the snapshot (class data, tooltips,
equipment slot, styles). In `coreSlice.js`, the P12B line is present in both versions; all other P12B
files are hash-identical between build input and checkout. The acceptance claim names the built
source, not that later concurrent work.

## Remaining (not closed)

- **Creator choices:**
  - C2/D-D criticals vs shields;
  - C3 backup shield on bypassed armor (not automated);
  - C4 "deep storage" (the interim keeps the piece in its slot, broken, inert and pending);
  - C5 out-of-combat confirmation;
  - D-C, D-B order, D-F, conversion; all of D-A…D-J except D-E.
- **HQ:** H-a…H-e (a scoped declaration was used, as authorized).
- **Gates:** live Firebase/rules, two devices, a human session, deployment.
- **Known limitation:** two offers from the same creature cannot both be consumed (the creature
  revision moves); the second needs a re-offer and a new roll.
