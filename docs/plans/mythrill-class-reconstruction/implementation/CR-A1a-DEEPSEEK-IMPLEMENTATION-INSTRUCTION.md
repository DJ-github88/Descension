# CR-A1a — finalized implementation instruction (issued 2026-10-18)

**Issued to:** DeepSeek implementer (or any implementer agent).
**Basis:** frozen contract [CR-A1a-DEFINITION-INFRASTRUCTURE.md](CR-A1a-DEFINITION-INFRASTRUCTURE.md) including its 2026-10-18 HeadQ clarification addendum, plus the recorded combined W1a/W1b bounded acceptance ([evidence/independent-review/re-review-corrected.md](evidence/independent-review/re-review-corrected.md), [evidence/source-diff-manifest.json](evidence/source-diff-manifest.json)). This document is the separate implementation authorization required by contract §8. It does not widen the contract.

## 0. Preflight (do these first, in order)

1. Read root `AGENTS.md`/`CLAUDE.md`, then the full contract above.
2. Refresh `git status`, branch and HEAD; confirm `server/services/authoredSpellDefinitions.js`, `server/tests/authoredSpellDefinitions.test.js` and `implementation/evidence/CR-A1a/` do **not** exist. If any exists: **stop and report**, reconcile ownership, do not overwrite.
3. Preserve the dirty/untracked tree exactly. Never reset/stash/clean. Never copy an older snapshot over newer work. No commits.
4. Confirm `server/services/roomCheckpoint.js` still exports `canonicalize`, `stableStringify`, `sha256Hex` (read-only reuse; no edits to it or any existing file).

## 1. Deliverables (exact file list — nothing else)

1. `server/services/authoredSpellDefinitions.js` — CommonJS, Node-only.
2. `server/tests/authoredSpellDefinitions.test.js` — Mocha + `assert`.
3. `server/tests/fixtures/crA1aDefinitionVectors.json` — copy of the frozen `implementation/fixtures/CR-A1a-definition-vectors.json`, byte-preserving its expected hashes.
4. Evidence under `implementation/evidence/CR-A1a/`: final `diff`/patch of only the new/changed files, `new-source-hashes.json`, test-run output, and a short `report.md` (deliverables, commands, results, failure-matrix coverage, explicit remaining A1b blockers).

Zero changes to any pre-existing file. If any existing file must change to make A1a work, **stop and report** — that needs a new contract, not a widened A1a.

## 2. API surface (exact — contract §6)

```text
compileDefinition(dto) -> {ok:true,canonicalDefinition,definitionHash,descriptor} | {ok:false,code,path?}
emptyRegistry(roomId) -> valid revision-0 snapshot | {ok:false,code}
encodeRegistry(snapshot) -> {ok:true,json} | {ok:false,code}
decodeRegistry(json) -> {ok:true,registry} | {ok:false,code}
createDefinitionRegistry({authorize}) -> {planAdmit(registry,request), planRevoke(registry,request), describe(registry,{definitionRef,expectedBinding})}
```

- Strict canonical pilot DTO per contract §4 (all fields required, no defaults, no unknown fields; AP integer 0–20; mana integer 0–10,000; formula `NdM(±K)?` canonically; depth ≤ 8; ≤ 16 KiB).
- Constants: `compilerVersion:'cr-a1a-1'`, `capabilityId:'authored-immediate:v1'`, `executionEnabled:false`, `installed:false`.
- Descriptor hash chain exactly as contract §5 (`mythrill:authored-definition:v1\n` + canonical JSON; identity `(roomId,definitionId,definitionVersion,definitionHash)`).
- Missing/non-function authorizer at factory construction throws `TypeError`. No default allow-authorizer. No filesystem/network/storage side effects in this module. No `eval`/`Function`/`vm`, no RNG.
- Returned successful records/descriptors/snapshots/plans are detached deep-frozen copies; mutating any returned object must never affect an input or another result.

## 3. HeadQ clarification 1 — pre-await input ownership and detachment (mandatory)

`planAdmit` and `planRevoke` must, **synchronously and before invoking/awaiting `authorize`**:

1. Validate and detach the **entire request** (including nested `definition`, `definitionRef`, strings, numbers) and the **entire registry** (including full `definitions`/`decisions` arrays) into private internal snapshots.
2. Detach via strict JSON/data-property validation of plain objects/arrays — never an unchecked serialization that can invoke getters or `toJSON`, never a coercive path.
3. Fully validate registry **history** (§4 below) at this boundary; reject invalid inputs before authorization is invoked.
4. After the `await`, use **only** those validated private snapshots for scope, hashes, replay, expected-revision, version/revocation checks and result construction. Never reread caller-owned objects or any nested field.
5. Never mutate or freeze caller inputs; the caller must remain able to mutate its own objects while a plan is pending without changing the pending plan.

Required tests (both admit and revoke): construct a deferred authorizer promise; start the plan; while authorization is pending mutate caller-owned request fields (nested price/effect/ref) and the caller's registry copies (revision/definitions/decisions); then resolve authorization with a valid GM result. Assert the result uses the **original** validated snapshots (original request hash, ref, price, history, expected revision), with no mutation leakage, no thrown exception and no substituted transition. Assert invalid original inputs fail **before** the authorizer is invoked. Assert caller inputs were neither frozen nor mutated by the planner.

This does not install or lock a registry — the future live owner still needs fresh authority and revision CAS (A1b).

## 4. HeadQ clarification 2 — complete history validation (mandatory)

Validating each definition/hash/descriptor in isolation is insufficient. **All** snapshot consumers — `encodeRegistry`, `decodeRegistry`, `planAdmit`, `planRevoke`, `describe` — must validate the history as a sequence of **legal modeled transitions**, freshly each call (never trusting a previously decoded snapshot). Reject with the frozen stable codes (`INVALID_REGISTRY` for corrupt snapshots, specific codes where the contract assigns them):

- Globally unique `requestId`s across **both** admit and revoke decisions.
- Unique contiguous decision sequences, `revision === decision count`.
- First admitted version is 1; successive admitted versions are exactly prior-maximum + 1 **in decision order**; no gaps, no out-of-order admits.
- Exactly one admit per stored version; no orphan admits, no duplicate admits, no dangling or wrong-hash references.
- No revoke before its admit, no unknown-version revoke, no double revoke.
- Immutable references/room/binding consistent; every decision's recomputed request hash consistent with that transition's request and `expectedRegistryRevision === sequence − 1`.
- Reject gaps and internally inconsistent histories **even when every individual definition compiles successfully**. Never repair, discard or reorder invalid history into acceptance. These checks validate modeled consistency only — not a GM signature or live installation.

Required tests: construct corrupt histories through encode/decode, both planners and describe whose individual definitions and descriptors remain valid — duplicate request IDs (including across admit/revoke), version gaps, out-of-order admits, orphan/duplicate admits, dangling/wrong-hash refs, revoke-before-admit/unknown/double revokes, duplicate/gapped sequences, revision/count mismatch, inconsistent decision request hashes. Include valid replay/revocation/restart-style controls that must succeed.

## 5. Authority port (contract §6 — unchanged)

Required server-code dependency captured at construction; never a field/function from authored content or a public request. Fresh invocation per admit/revoke **including replays**; success data exactly `{ok:true,roomId,uid,gmUid,principalBound:true,authorityCurrent:true,rulesetId:'prism',rulesetVersion:'cr-a1a-pilot-1'}` with `uid===gmUid` and all flags true; absent/false/thrown results fail closed (`AUTHORITY_UNAVAILABLE`/`FORBIDDEN`). Factory instance binds one trusted caller context. Unknown client authorization fields rejected. Do not copy `assertOperationContext`'s legacy missing-service success branch.

## 6. Frozen fixture and verification (from `D:\VTT\server`)

Golden vectors (expected values are supplied, never regenerated by the code under test):

- Zero-AP damage definition → `d0f251d988425dfa9c04011e9e86f02628838efdbce3716f41694ea2f507b351`
- Same definition with AP1 → `c26c8d69d1d1c512d6e67c1098f44723a4301917265d64f280bb4421e7a7f49f`
- Direct-healing vector → `8875e6cdf3e866e48fadddbba436d4194bd87e213dc123abeb7d84330f0dd692`

```powershell
node --check services/authoredSpellDefinitions.js
npx mocha tests/authoredSpellDefinitions.test.js --timeout 10000 --exit
```

Cover the full contract §8 regression matrix (vectors, price failures, unsupported-shape rejection, authority failures, version/replay/revocation, codec round trip, corrupt/oversized snapshots, no-mutation of returned objects, plus both HeadQ clarification test groups above). Existing actor consequence/P9/P12 files must remain byte-identical; no full combat suite/build is required if they are.

## 7. Boundaries and stop conditions

- **Never**: live endpoint/GM panel, registry storage/lease/CAS installation, Firebase writer, socket wiring, browser/Wizard/book imports, actor eligibility, runtime payment/targeting, React/ESM imports into Node, new dependencies, changes to roomCheckpoint/P7/P8/P9/P12/socketHandlers/storage registry/class data, or any file outside §1.
- **Stop and report** if a target file pre-exists with unrelated work, if any existing file must change, if semantic drift appears versus the contract, or if a fixture hash mismatch is found.
- **Final report**: files created (paths + SHA-256), exact commands run and observed results, failure-matrix coverage map, evidence directory contents, and the explicit list of remaining A1b blockers (live authority handler, registry storage/installation/CAS, actor adapter, Wizard integration/casting). No execution or installation claim — `executionEnabled:false`, `installed:false`, modeled-only.
