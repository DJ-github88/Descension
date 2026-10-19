# Independent CR-A1a review — BLOCK

Reviewed 2026-10-18. Application code, implementation tests/fixture and original evidence remained read-only. Review additions are confined to this evidence directory. No commit, staging change, runtime installation or class implementation was performed by this reviewer.

## 1. Verdict and exact scope

**BLOCK**: the shared strict-copy boundary silently accepts/discards own Symbol-keyed authored properties and accepts custom array prototypes. These violate the frozen strict JSON/prototype rejection rules and the pre-authorization request/registry validation requirement. Two local guard corrections plus focused regressions are sufficient; no new infrastructure is required.

The original focused suite passes **131 tests**. Independent checks produce **35 passing / 5 failing probe groups**, with the five failures demonstrating the two boundary defects below, not five unrelated defects. Independent identity/preservation checks and the separate capacity experiment pass.

The service remains uninstalled, execution-disabled and unreferenced by application runtime callers. No live authority bypass, remote JSON transport exploit or spell execution is claimed. Symbol properties and custom prototypes cannot originate in a JSON string, but these are reachable inputs to the explicitly strict **Node object APIs** (`compileDefinition`, planners and object-input codec/describe), just as the contract's Date/getter/function rejection cases are. This review does not invent a network path to those values.

Read: root AGENTS/CLAUDE; full frozen `CR-A1a-DEFINITION-INFRASTRUCTURE.md` including HeadQ clarifications; issued `CR-A1a-DEEPSEEK-IMPLEMENTATION-INSTRUCTION.md`; actual service, all implementation tests and original frozen fixture; report §5 and retained baseline/hash/patch/final-test evidence.

## 2. Source identity and preservation

| File | Reviewed SHA-256 |
|---|---|
| `server/services/authoredSpellDefinitions.js` | `b2bc0c7e70fe9118203a23dab910158ba17e91812ba2db014551132993323b49` |
| `server/tests/authoredSpellDefinitions.test.js` | `ea549faeb22b684858af28ed1fa3594db9b00a7732fe42dc9a8239abdc9df4b5` |
| `server/tests/fixtures/crA1aDefinitionVectors.json` | `e6a98a497308b8535538b9887435c9189127afa768b60cd8e01af31cd3c55bdb` |

`verify-identities.cjs` independently verifies:

- All three reported source identities match actual bytes.
- The server fixture is byte-for-byte equal to the original planning fixture, not merely JSON-equivalent.
- All **108 entry-baseline server files** match `entry-server-hashes.json`, including roomCheckpoint, authority, P9/P12 handlers/services and existing tests. No mismatches.
- All three retained new-file patch sections reconstruct the current normalized source text exactly. Patch path escaping/CRLF is normalized for this comparison; byte hashes are checked separately.
- All three deliverable targets are absent at the entry commit recorded in the baseline.
- Entry HEAD `7f0abb8c445644cf46a4964f924a147f93f07610` → implementation-completion HEAD `501e5a9d1f471f5c5c7fad53be0d83481e966e10` changes only `SpellLibrary.jsx` and adds `SpellLibraryGrimoire.test.jsx`, confirming that intervening spellbook work is independent of A1a.

At review entry, A1a additions/evidence and concurrent frontend changes were already staged. During review the user's HEAD moved to `8ba81efbf935e08d4fcd488a9b597f5eb8031b0f`; that commit includes the already-staged A1a additions as well as frontend work. Its message alone is not evidence that it contains only spellbook files. The recorded `completionToReviewDiff` lists those actual paths. Existing server baseline bytes still match. Concurrent race-data changes subsequently appeared in status and were untouched. Do not reset/restore the repository to the older baseline.

Full results: `identity-results.json`. Scoped application `git diff --check` was clean; no broad build/combat suite was run.

## 3. Blocking findings and minimal reproductions

All source locations below refer to `server/services/authoredSpellDefinitions.js` at the reviewed hash.

### F1 — own Symbol keys are silently removed rather than rejected

**Location:** `strictCopy:104–150`; object traversal at `:140` and array property inspection at `:122` use `Object.getOwnPropertyNames`, which excludes Symbol keys.

Minimal reproduction (use original frozen vector, not an invented schema):

```js
const dto = structuredClone(frozen.vectors[0].definition);
dto[Symbol('unsupported-cooldown')] = () => 42;
const actual = api.compileDefinition(dto);
// actual.ok === true
// actual.definitionHash === frozen.vectors[0].definitionHash
```

An own Symbol-keyed getter on `dto.effect` is likewise accepted and discarded. Its getter is not invoked; the defect is **acceptance instead of rejection**, not getter execution.

The same shared boundary accepts a valid registry plus `registry[Symbol('registry-extension')] = true`: `encodeRegistry`, `describe`, `planAdmit` and `planRevoke` all return success. An own Symbol key is non-JSON/unknown authored content, not an absent field that can be dropped to make the DTO or registry supported. Frozen §4 requires rejection before canonicalization; HeadQ requires complete strict request/registry validation before authorization.

**Minimum correction:** reject own Symbol keys for every traversed object/array without reading their property values or invoking accessors. Preserve existing stable boundary failure codes (`INVALID_DEFINITION` / `INVALID_REGISTRY`) and all golden hashes for ordinary accepted JSON.

### F2 — array branch bypasses custom-prototype rejection

**Location:** `strictCopy:121–135`; `isPlainObject:76–79` is only consulted after the array branch, at `:137`.

```js
let calls = 0;
class AuthoredArray extends Array {
  toJSON() { calls++; throw new Error('must not run'); }
}
const dto = structuredClone(frozen.vectors[0].definition);
dto.effect.damageTypes = new AuthoredArray('arcane');
const actual = api.compileDefinition(dto);
// actual.ok === true; same ordinary golden identity; calls === 0
```

A subclassed `registry.definitions` array is also accepted: `planRevoke` invokes authorization once and returns a transition. This should fail `INVALID_REGISTRY` before authorization. No global prototype mutation, Proxy or unreachable combination is needed.

Frozen §4 expressly rejects custom object prototypes; the HeadQ instruction requires plain-object/array strict validation. A subclass with an inherited authored method must not be reduced into a supported ordinary JSON array. No authored method runs in these reproductions, but the rejection requirement is still unmet.

**Minimum correction:** require the ordinary array prototype before processing array data; reject subclassed/altered-prototype arrays without calling their inherited methods. Do not serialize the input to detect or repair it. Retain ordinary arrays, sparse-array rejection and getter rejection.

## 4. Independently verified behavior that passes

The independent probe does not use the implementation suite's builders or roomCheckpoint's canonical/hash functions to generate expected values. It reads the **original planning fixture**, independently sorts keys and hashes with Node crypto, and compares actual production outputs to the fixed canonical JSON/hash/descriptors.

- All three exact frozen canonical JSON strings/hashes/descriptors pass: zero AP `d0f251d9…`, AP1 `c26c8d69…`, healing `8875e6cd…`. AP0/mana0 remain explicit; supported formula/scope changes alter identity.
- Ordinary unknown fields, missing/undefined/null/boolean prices, Date and custom non-array object prototypes are rejected. String-keyed getters and `toJSON` accessors on DTO/resource/array objects are rejected without invocation.
- Both planners detach supported ordinary request **and populated registry** inputs before the authorizer is **invoked**, not merely before it resolves. Independent authorizers synchronously mutate caller registry definitions/decisions and request room at invocation; additional request price/effect/ref and registry mutations occur while pending. Both resulting plans bind to original request hashes, refs, prices, expected revisions and history. Caller objects remain unfrozen and unmodified by the service.
- Fresh failed authority prevents **both admit and revoke replay**; earlier successful authority is not cached. The frozen fail-closed mappings and required authorizer construction are exercised by the focused suite.
- Recursive immutability passes. Separate result trees do not alias caller data or each other. Frozen writes via `Reflect.set` fail without changing values.
- Independent corrupt histories with individually valid definitions fail through **all five consumers**, before planner authorization: duplicate request IDs across actions, version gaps, reordered admits, orphan stored versions, double/early revoke, wrong reference/hash, and revision mismatch. Reordered/early histories have sequences and independent hashes rebuilt so rejection cannot merely be attributed to stale sequence/hash metadata. Existing focused cases additionally cover duplicate admits, unknown revokes and future formats.
- Codec reconstruction plus a fresh factory preserves lookup/revocation/replay state. Admit and revoke exact replays have no nextRegistry/new decision. New versions and revocations preserve previous immutable records. Concurrent plans remain uninstalled; using a stale loser against the selected next snapshot returns `REVISION_CONFLICT`.
- `describe` returns appropriate stable failures and no descriptor on room/hash/binding/revocation mismatches.
- Service imports only the read-only checkpoint helper module; source has no storage/network/RNG/evaluation/installation path. Runtime caller search finds only its focused test import in server code and no browser imports. Descriptors stay `executionEnabled:false`, transitions/replays `installed:false`, lookup `modeled-only`.

These passing results do not cancel F1/F2 or prove live authenticated integration.

## 5. Assessment of implementer report §5

| Interpretation | Independent assessment |
|---|---|
| `emptyRegistry` returns a direct snapshot | **Compatible.** Frozen §6 literally specifies snapshot-or-failure, unlike the encode/decode success wrappers. Independently verified frozen direct snapshot and codec control. No wrapper correction required. |
| Malformed planner/describe envelope → `INVALID_DEFINITION` | **Compatible.** No distinct envelope code is frozen. Missing/extra/invalid data is not silently coerced into a runnable result. |
| Describe order room → found → hash → binding → revoked | **Compatible.** Final errors identify the corresponding mismatches and never return a descriptor. Binding-before-revoked does not bypass revocation. No demand for a different simultaneous-failure precedence. |
| Pre-await validation versus post-authorization semantic checks | **Compatible ownership/order for supported ordinary data, subject to F1/F2.** Entire request is safely copied and envelope-validated; registry is copied and fully history-validated before port invocation. Definition compilation/policy, exact scope/hash, replay/revision/version semantics use only the detached snapshots afterward, as frozen §7 explicitly orders. Do not move all semantic compilation ahead of authority or weaken fresh-authority replay checks merely to change precedence. |
| Authority error mappings; ignored extra trusted-port fields | **No blocking deviation.** Required uid/GM/binding/freshness/room/policy fields are checked. Additional fields on the server-owned result are not accepted public authorization assertions; public request extras are rejected. This does not claim that arbitrary server-code authorizers are untrusted authored input. |
| Request hash/replay and foreign-room ordering | **Compatible.** Independent original-request hash checks match; cross-room request rejection precedes replay lookup after fresh authority. Registry decision hashes are recomputed from exact modeled transitions. |
| Count caps are only defense-in-depth because 256 decisions can never fit | **The tests enforce rejection, but the impossibility claim is false.** See the reachable 256-decision control below. Correct the report and add the real boundary regression. No cap or engine change is needed. |
| Sloppy-mode frozen-mutation assertions use `Reflect.set` | **Justified.** Immutability does not require an assignment exception. Recursive freezing, failed `Reflect.set`, unchanged values and independent ownership are meaningful. Adding a `use strict` directive to the service is unnecessary. |

### Reachable count-limit control

`capacity-and-interpretations.cjs` constructs **128 distinct valid definition IDs at version1**, minimal legal healing/targeting/text values, and 128 admit + 128 revoke decisions. All hashes are genuine, sequences contiguous, request IDs unique and prices explicit. It is **258,657 UTF-8 bytes**, below the **262,144-byte** cap. `encodeRegistry` and `decodeRegistry` accept it. The actual planner, starting from its valid 255-decision predecessor, produces the final revoke at revision256 with `installed:false`.

Thus the report's `~245` observation is fixture-dependent, not a proof about all valid content. Padded 257-decision snapshots are still useful **early count-guard** tests even though their history is not otherwise legal; they do not substitute for a real valid256 control. A legal 257th transition is not required or asserted: the 128-definition/one-admit/at-most-one-revoke rules already prevent it, and the implementation correctly refuses over-count inputs. The implemented service passes the reachable boundary; the correction is to its evidence/test claim.

### Changed test expectations

The original first-red suite/log and the four individual expectation diffs are not retained, so their precise edit history cannot be independently reconstructed from the final green log and report. No claim is made that every reported edit was audited retrospectively. The final golden fixture bytes are unchanged, and the final assertions' schema/error choices, describe precedence, uppercase-UUID correction, `Reflect.set` semantics and word-bounded hygiene check are consistent with the frozen contract. They do not establish complete strict-input coverage: F1/F2 remain concrete counterexamples. The unreachable-capacity justification, in contrast, is disproved above and must be corrected.

## 6. Commands and outcomes

From `D:\VTT\server`:

```powershell
node --check services/authoredSpellDefinitions.js
npx mocha tests/authoredSpellDefinitions.test.js --timeout 10000 --exit
```

Outcomes: syntax success; **131 passing (~3 seconds), zero failing**.

From `D:\VTT`:

```powershell
node docs/plans/mythrill-class-reconstruction/implementation/evidence/CR-A1a-independent-review/verify-identities.cjs
node docs/plans/mythrill-class-reconstruction/implementation/evidence/CR-A1a-independent-review/independent-probes.cjs
node docs/plans/mythrill-class-reconstruction/implementation/evidence/CR-A1a-independent-review/capacity-and-interpretations.cjs
git diff --check -- server/services/authoredSpellDefinitions.js server/tests/authoredSpellDefinitions.test.js server/tests/fixtures/crA1aDefinitionVectors.json
```

Outcomes: identity exit0; independent probes **exit1, 35/40 groups pass, five expected rejection assertions fail**; capacity experiment exit0, including valid256 success; diff check clean. The independent probe was strengthened and rerun to exclude stale sequence/hash explanations for history failures; the original focused suite was not repeatedly broadened. Exact results are in `identity-results.json`, `probe-results.json`, `capacity-interpretation-results.json`.

## 7. Minimal paste-ready DeepSeek correction instruction

> Correct only the strict-input boundary defects F1/F2 in `implementation/evidence/CR-A1a-independent-review/review.md`. Application writable scope remains `server/services/authoredSpellDefinitions.js` and its focused `server/tests/authoredSpellDefinitions.test.js`; update A1a evidence only. Preserve the frozen fixture, checkpoint helper, all other existing source, current index/commits and concurrent spellbook/race work. Do not reset/stash/clean or create a commit.
>
> In shared `strictCopy` (`:104–150`), reject all own Symbol keys on objects **and arrays** without reading their values/accessors. Require the ordinary Array prototype in the array branch (`:121–135`), rejecting subclassed/altered-prototype arrays without invoking inherited behavior. Use existing boundary codes; never strip/normalize these inputs into accepted JSON. No new dependency, universal serializer, formula engine or runtime route is needed.
>
> Add regressions at compiler and object-input request/registry/describe boundaries: Symbol-keyed values/functions/getters and custom array prototypes, including nested `damageTypes` and registry collections. Assert failure, unchanged/unfrozen caller objects, zero getter/toJSON invocations, and zero authorizer invocations for malformed planner inputs. Preserve exact golden JSON/hashes/descriptors, normal array behavior, both deferred-mutation controls, fresh replay authority and full history validation.
>
> Correct report §5's false claim that 256 decisions cannot fit the byte cap. Use the independent valid 128-definition/256-decision, 258,657-byte control as a focused codec/final-revoke-planner boundary regression; preserve caps and existing count/byte refusal tests. Do not demand an impossible legal257 transition. Retain old evidence honestly and refresh source hashes/patch/test results.
>
> Run `node --check services/authoredSpellDefinitions.js`, the focused Mocha command, scoped lint/diff, and the retained independent probes/capacity control against the corrected source; return for independent re-review. Do not implement A1b or modify authority/persistence/P9/P12/Wizard/class data.

## 8. Limits and next gate

No broad frontend/combat/build checks, external services, deployment, live rooms, personal data or two-device testing was needed for this unhooked Node module. No class audit or rename was undertaken. Druid, the Augur-to-Fate-Weaver merger, Doomsayer naming and Oracle retention are preserved; existing application IDs are untouched.

**A1b integration planning is conditional on ACCEPT in this task, so it is not frozen or assigned integration points from this BLOCK review.** A1b implementation remains unauthorized. Re-review the bounded correction first, then investigate current authority, persistence/CAS and casting mechanisms before selecting reused integration seams. No new engine architecture is implied.
