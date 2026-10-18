# CR-A1a — immutable definition, descriptor and admission-planning infrastructure

**Status: FROZEN bounded implementation contract. A separate implementation authorization is required.** HeadQ accepts the seven core directions for prototype development; this is not approval of tuning, abilities, trees, natives, application changes or migration.

**HeadQ clarification addendum (2026-10-18):** inputs must be validated and detached before awaiting authorization, and registry validation must prove the complete transition history. The explicit requirements below clarify the existing immutable/planning boundary; server-only, execution-disabled and uninstalled scope is unchanged. The original freeze manifest remains historical evidence; this addendum does not authorize implementation.

Preflight: read root AGENTS/CLAUDE, refresh branch/HEAD/status and [focused source hashes/new-target collision check](../evidence/frozen-handoff-source.json). Preserve current dirty/untracked P12 and all user work. Do not reset/stash/clean or copy an old source snapshot over newer work. Semantic drift needs reconciliation, not a guessed widening of this contract.

## 1. Goal and hard scope boundary

Provide a **server-only CommonJS module**, strict canonical pilot DTO, deterministic descriptor/hash, immutable definition versions and authority-checked **registry transition plans**. Provide a validated JSON registry codec. No browser imports/module-sharing decision, new endpoint, live registry installation, Firebase writer, Wizard integration or casting is part of A1a.

This is useful independently of W1a/b using explicit-price fixtures. It is **not** end-to-end authored-spell acceptance: no definition becomes live/executable merely because its candidate record/descriptor exists. Transport, installation and the actual Wizard adapter are a separately frozen A1b/integration task.

## 2. Exact files and preservation

Create only:

1. `server/services/authoredSpellDefinitions.js`.
2. `server/tests/authoredSpellDefinitions.test.js` (Mocha, Node assertions).
3. `server/tests/fixtures/crA1aDefinitionVectors.json` — copy the frozen planning fixture, preserving its expected hashes.
4. Implementation evidence under this package's `implementation/evidence/CR-A1a/`.

Read-only reuse: `server/services/roomCheckpoint.js` exports `canonicalize`, `stableStringify`, `sha256Hex`; strict JSON validation must precede these helpers because their existing legacy behavior can omit undefined/convert Dates. No changes to that codec, P7/P8/P9/P12, actor handlers/approval binders, roomAuthorityService, storage registry, socketHandlers, React/CRACO, books, Wizard state/saves or source class data.

No new dependency, shared package or second formula/rules engine. Do not import React/ESM class data into Node, move existing parsers, or alter P9 for code reuse. The pilot grammar below is a deliberately smaller stat-independent subset, not a new general formula language.

If a proposed new file already exists with unrelated work at execution time, stop and reconcile ownership. Do not overwrite it or silently expand the file list.

## 3. Frozen architectural choices

| Question | Decision |
|---|---|
| Shared browser/server code placement | Server-only CJS in A1a; browser adapter deferred, no bundler change |
| Catalogue scope | One exact existing `room.id`; no guessed campaign-to-room mapping or cross-room sharing |
| Ruleset binding | Explicit `prism` / `cr-a1a-pilot-1` / one canonical current class ID; this is a new pilot-policy tag, not a Laws/save migration |
| Formula scope | One dice group with an optional integer constant; no attributes, functions, percentages or arbitrary code |
| Authority | Required server-owned authorizer dependency; current room GM only, current bound principal and authority; never a client approval flag |
| Persistence | Strict snapshot codec/round-trip only; no live gameState key, install callback or backend path in A1a |
| Price defaults | None at admission. Both AP and mana must be explicit integers, including0 |
| Executability | Descriptor always `executionEnabled:false`; A1a never rolls, pays, applies or routes a cast |

There is **no unresolved architectural choice inside A1a**. Live authoritative installation/storage, socket/UI integration and actor/ruleset adaptation intentionally remain A1b blockers; they are not decisions an A1a implementer should guess.

## 4. Canonical pilot definition DTO

Exact example and field names:

```json
{
  "schemaVersion": 1,
  "scope": {"roomId": "headq-pilot-room"},
  "definitionId": "11111111-1111-4111-8111-111111111111",
  "definitionVersion": 1,
  "name": "Pilot Arcane Dart",
  "description": "One immediate single-target Arcane damage payload.",
  "binding": {"rulesetId": "prism", "rulesetVersion": "cr-a1a-pilot-1", "classId": "arcanoneer"},
  "spellType": "ACTION",
  "castTimeType": "IMMEDIATE",
  "targeting": {"kind": "single", "maxTargets": 1, "rangeFeet": 30, "restriction": "enemy"},
  "resourceCost": {"actionPoints": 0, "mana": 4},
  "effect": {"kind": "damage", "formula": "1d6+2", "damageTypes": ["arcane"]}
}
```

### Required validation

- Every displayed field is required. No unknown fields at any schema level. Healing uses `{kind:'healing',formula}` with **no damageTypes**. Damage has exactly one damage type.
- `definitionId`: canonical lowercase UUID v4; version positive safe integer, ≤1,000,000. Name1–120 characters, description0–4,000; roomId1–200. Preserve case/whitespace of textual content; require well-formed UTF-8 round trip. No inferred name/ID or trimming price data.
- AP integer0–20; mana integer0–10,000. Missing, undefined, null, numeric strings, negative/fractional/non-finite values are invalid. No estimate/default/round/clamp.
- Targeting kind single, maxTargets1, integer range0–300 feet; restriction one of self/ally/enemy/any. Self requires range0. These declare constraints, not a proof of legal targets, LoS or range.
- Formula: canonical ASCII `NdM`, optionally followed by `+K` or `-K`; N1–50, M2–100, K1–10,000. No spaces, leading zeroes, extra groups, attributes or normalization of unsupported syntax. Examples `1d6`, `2d8+3`, `1d6-2`. Produce one dice group and signed constant0 when absent. No RNG or evaluation of strings as code.
- Damage type is one canonical ID: arcane, sacred, blight, ember, rime, primal, storm, wyrd, slicing, stabbing or smashing. No aliases, multiple elements or inferred Sacred damage for healing.
- Binding class IDs: arcanoneer, berserker, shaper, harbinger, chronarch, inquisitor, revenant, false_prophet, gambit, apex, animist, lunarch, martyr, minstrel, plaguebringer, pyrofiend, spellguard, toxicologist, warden, augur, crusader. These preserve current compatibility IDs, not a final roster. Druid's name approval does not register a new application ID.
- Before canonicalization reject unsafe/prototype keys, custom object prototypes, Date, functions/symbols/bigints/undefined, sparse arrays, non-finite numbers; depth≤8, canonical definition UTF-8 bytes≤16KiB. No getter/function invocation or coercive `toJSON` path accepted as authored content.

Explicitly reject class resource/programs, materials, cooldowns, durations, saves, critical modifiers, mixed effects, HoTs/DoTs, summons, links, body changes, movement, reactions, areas/multiple targets, scripts and arbitrary JSON-path instructions. Do not strip such fields and then call the reduced spell supported. Saving the original unsupported draft remains separate and permitted by its existing authoring flow.

The DTO is **not** arbitrary Wizard state. A future explicit adapter must inspect the whole draft, refuse unsupported mechanics and verify exact canonical prices before constructing it. A book projection/name/slot copy is not that adapter or admission authority.

## 5. Identity, hash and deterministic descriptor

Strictly validate first. Then use the existing canonicalizer to sort object keys and preserve array order. Define:

```text
canonicalJSON = stableStringify(canonicalize(validDTO,'definition').value)
definitionHash = sha256Hex('mythrill:authored-definition:v1\n' + canonicalJSON)
identity = (roomId,definitionId,definitionVersion,definitionHash)
compilerVersion = 'cr-a1a-1'
capabilityId = 'authored-immediate:v1'
```

Hash **all DTO content**, including exact price, scope, binding, version, name/description, targeting and effect. No timestamps/RNG/current stats enter the descriptor. Reordered object keys hash identically; arrays and meaningful string changes do not get silently canonicalized away. AP0 and AP1, missing and explicit price, changed class/ruleset/version/formula must never share an accepted identity.

Descriptor exact shape:

```text
{
 schemaVersion:1, capabilityId:'authored-immediate:v1', compilerVersion:'cr-a1a-1',
 definitionRef:{roomId,definitionId,definitionVersion,definitionHash},
 binding:{rulesetId,rulesetVersion,classId},
 price:{ap,mana},
 targeting:{kind:'single',maxTargets:1,rangeFeet,restriction},
 effect:{kind:'damage'|'healing',dice:[{count,sides}],constant,damageTypes:[]|[type]},
 executionEnabled:false
}
```

Supported descriptor means supported **definition syntax**, not affordability, learned eligibility, admission installation or execution. Prose remains inert reviewed text and cannot grant an untyped extra effect.

## 6. Required module API

```text
compileDefinition(dto)
  -> {ok:true,canonicalDefinition,definitionHash,descriptor}
   | {ok:false,code,path?}
emptyRegistry(roomId) -> valid revision0 snapshot | {ok:false,code}
encodeRegistry(snapshot) -> {ok:true,json} | failure
decodeRegistry(json) -> {ok:true,registry} | failure
createDefinitionRegistry({authorize}) -> {
  planAdmit(registry,request): Promise<plan|failure>,
  planRevoke(registry,request): Promise<plan|failure>,
  describe(registry,{definitionRef,expectedBinding}): result
}
```

No input mutation. Successful canonical records, descriptors, snapshots and plan results are detached deep-frozen copies; modifying a returned object cannot modify an input or another result. Bad caller data returns stable failure objects; missing/nonfunction authorizer at factory construction throws TypeError. No default “allow” authorizer. No filesystem/network/storage side effects in this module.

**Pre-await input ownership (HeadQ):** `planAdmit` and `planRevoke` must synchronously validate and detach the entire request and registry into private snapshots **before invoking/awaiting the authorizer**. Detach via strict JSON/data-property validation, not an unchecked JSON stringify that invokes getters or `toJSON`. Fully validate registry history as described in §7 at this boundary. Reject invalid inputs before authorization. After the await, use only those validated private snapshots for scope, hashes, replay, expected revision, version/revocation checks and construction of results; never reread caller-owned objects or their nested fields. The caller must remain able to mutate its own inputs without changing the pending plan. This does not install or lock a registry: the eventual live owner still needs fresh authority and revision CAS.

### Authority port and planning semantics

`authorize({operation:'admit'|'revoke',roomId})` is a **required server-code dependency captured at construction**, never a field/function supplied by an authored definition or public request. It must resolve the authenticated principal/current room GM and fresh authority, not trust request `isGM`/uid/approved flags. Its exact success data is `{ok:true,roomId,uid,gmUid,principalBound:true,authorityCurrent:true,rulesetId:'prism',rulesetVersion:'cr-a1a-pilot-1'}`. UID fields are nonempty well-formed strings≤200 characters. Core requires uid===gmUid, matching room/policy and every flag; absent/false/thrown results fail closed. Unknown client authorization fields are rejected.

Bind a factory instance to **one trusted caller context**, not a process-global “current user”. Invoke its authorizer fresh for every admit/revoke, including a replay; never cache an earlier GM/lease success. A1a provides/tests this dependency contract but does not create a live authenticated handler.

The future live adapter must derive this from current server membership/room authority with pre/post-await binding checks. Existing `assertOperationContext` has a legacy missing-service success branch; copying that fallback is forbidden. Do not change that existing helper in A1a.

A1a returns a **plan**, not live admission. Plan includes expected registry revision, exact request hash, next validated snapshot, immutable record/descriptor, decision and `installed:false`. A prospective admit decision in nextRegistry is not published/installed by this module. Later live installation must recheck authority and CAS synchronously through its owning persistence/admission path. No browser can self-assert that an A1a plan has been installed.

Success result shapes are fixed: a new transition returns `{ok:true,kind:'transition',installed:false,expectedRegistryRevision,requestHash,nextRegistry,definitionRef,decision}` plus the descriptor for admit. An exact replay returns `{ok:true,kind:'replay',installed:false,requestId,requestHash,definitionRef,currentRegistryRevision}` with **no nextRegistry** and no new decision. `describe` returns `{ok:true,descriptor,admissionState:'modeled-only'}` for valid non-revoked data, never a live execution claim.

## 7. Registry, version, replay and revocation rules

Snapshot shape:

```text
{
 schemaVersion:1, roomId, revision:nonnegativeSafeInteger,
 definitions:[{definitionRef,canonicalDefinition,compilerVersion,descriptor}],
 decisions:[{requestId,requestHash,byUid,sequence,action:'admit'|'revoke',definitionRef}]
}
```

All fields exact/required; codec validates hashes, descriptor recomputation, room/binding consistency, unique identity/version/sequence/request IDs and monotonic revision. ≤128 definition versions, ≤256 decisions, ≤256KiB snapshot; reject capacity instead of evicting identity evidence. Never silently migrate an unknown schema/compile version.

Revision equals decision count; sequences are contiguous1…N. Every definition has exactly one preceding admit decision; any revoke follows it and there is at most one. Version sequences have no gaps. Decision request hashes can be recomputed from the referenced immutable definition/ref and `expectedRegistryRevision=sequence−1`. Codec validity is not proof of a real GM signature or installation: importing a valid snapshot never self-authorizes it. The later trusted host must choose its own installed snapshot, not a client-supplied replacement.

**History validation (HeadQ):** validating each definition/hash/descriptor in isolation is insufficient. All snapshot consumers (`encodeRegistry`, `decodeRegistry`, both planners and `describe`) must reject invalid registry histories. Validate the history as a sequence of legal modeled transitions: globally unique request IDs across admit/revoke decisions; unique contiguous sequences and revision equal to decision count; first admitted version1 and successive admitted versions exactly prior maximum+1 in decision order; exactly one admit for every stored version, with no orphan/duplicate admit or dangling/wrong-hash reference; no revoke before admit, unknown-version revoke or second revoke; immutable references/room/binding and recomputed decision request hashes consistent with that transition's request and expected revision. Reject gaps and internally inconsistent histories even when all individual definitions compile successfully. Use the frozen registry failure codes, including `INVALID_REGISTRY` for corrupt snapshots; never repair, discard or reorder invalid history into acceptance. These checks validate modeled consistency, not a GM signature or live installation.

Admit request: `{roomId,requestId,expectedRegistryRevision,definition,expectedDefinitionHash}`. Revoke request: `{roomId,requestId,expectedRegistryRevision,definitionRef}`. requestId lowercase UUID v4. Request hash is existing canonicalHash of the entire validated request, not client-provided.

1. Synchronously validate and detach request and registry (including complete history), then freshly authorize the current GM; resolve replay and perform exact room/policy/hash/expected revision and transition checks against the detached inputs in the frozen order below. No actor AP/mana or class state is read/written.
2. First version for a definitionId is1; next is current maximum+1. No overwrite of an existing version. A price/name/rules change creates a new version/hash.
3. Same requestId, same request hash and same authorized principal returns an idempotent replay with **no** revision/event addition, even if its original expected revision is now old. Same requestId with different content/principal fails. A new requestId trying an existing version fails VERSION_EXISTS.
4. A new transition increments revision once; decision sequence equals that revision. Definition bytes remain immutable. Revocation appends a decision, never changes/deletes definition content or old decisions.
5. A revoked version cannot be re-admitted; create a new version after review. Revoke an unknown/already-revoked version with a new request fails. Original same-request replay remains idempotent.
6. `describe` verifies a complete reference/hash and exact expected ruleset/class binding against a validated snapshot. Unknown, modified, mismatched or latest-revoked records return no descriptor. A fresh `compileDefinition` alone is never an admitted lookup.
7. Two plans based on the same revision do not both install automatically: A1a performs no installation. Future owner must CAS the expected revision; a stale loser is replanned, not silently merged. No permission to revoke/refund already executed combat actions.

Minimum stable codes: INVALID_DEFINITION, UNSUPPORTED_SHAPE, UNSUPPORTED_BINDING, HASH_MISMATCH, FORBIDDEN, AUTHORITY_UNAVAILABLE, SCOPE_MISMATCH, REVISION_CONFLICT, REQUEST_ID_CONFLICT, VERSION_EXISTS, VERSION_SEQUENCE, DEFINITION_NOT_FOUND, DEFINITION_REVOKED, ALREADY_REVOKED, CAPACITY, INVALID_REGISTRY, UNSUPPORTED_REGISTRY_VERSION. No runnable descriptor accompanies failure.

Code assignment: malformed/missing/extra DTO keys, types or prices →INVALID_DEFINITION; unsupported action/effect/target/formula literals →UNSUPPORTED_SHAPE; unsupported/mismatched ruleset/class →UNSUPPORTED_BINDING; expected hash mismatch →HASH_MISMATCH. Missing/failed/thrown fresh-authority verification →AUTHORITY_UNAVAILABLE; wrong/unbound principal/GM →FORBIDDEN; different room →SCOPE_MISMATCH. Validate request/registry structure, authorize, resolve exact replay, then expected revision, compiled definition/hash and version transition. No later check converts an earlier failure into a descriptor/default.

## 8. Required regressions and verification

Golden data: [CR-A1a-definition-vectors.json](fixtures/CR-A1a-definition-vectors.json). The zero-AP damage definition above hashes to `d0f251d988425dfa9c04011e9e86f02628838efdbce3716f41694ea2f507b351`; changing only AP to1 produces `c26c8d69d1d1c512d6e67c1098f44723a4301917265d64f280bb4421e7a7f49f`. The direct-healing vector hashes to `8875e6cdf3e866e48fadddbba436d4194bd87e213dc123abeb7d84330f0dd692`. Expected descriptors/canonical JSON are supplied, not regenerated by the implementation being tested. These are structural fixtures, not approved class spells.

- Frozen damage/healing vectors: exact canonical JSON/hash/descriptor;0 AP/mana0 preserved; object key reordering stable; price/name/version/class/ruleset/scope changes alter identity or fail as appropriate.
- Missing/null/string/fraction/negative prices fail with no default. No unsupported field is dropped to make a spell supported. Reject code-like formulas, attrs, mixed/area/resource/program/duration/reaction/entity cases.
- Missing authorizer, unauthorized player, forged client approval fields, mismatched GM UID, stale/unbound/failed authority port fail; thrown authorizer is not success.
- Existing-version overwrite, altered expected hash, wrong room/ruleset/class, duplicate request changed content, revoked lookup and out-of-order version fail without input mutation.
- Same-request replay leaves revision/events unchanged; revocation appends without modifying bytes; codec JSON round trip/restart-style reconstruction preserves identity/status; corrupt/oversized/future snapshots fail without replacement writes.
- Changing returned objects never mutates stored/caller input; stale concurrent plans are explicit, no installed/live claim.
- For both admit and revoke, use a deferred authorizer promise: start a plan, mutate caller-owned request fields/nested definition price/effect or definitionRef and registry revision/definitions/decisions while authorization is pending, then resolve authorization. The result must use the original validated detached snapshots (original request hash/ref/price/history/expected revision), with no mutation leakage, exception or substituted transition. Caller input objects must not have been frozen or mutated by the planner. Invalid original inputs fail before invoking the authorizer.
- Reject corrupt histories through encode/decode, both planners and describe: duplicate request IDs (including across admit/revoke), version gaps or out-of-order admits, orphan/duplicate admits, dangling/wrong-hash references, revoke-before-admit/unknown/double revocations, duplicate/gapped sequences, revision/count mismatch and inconsistent decision request hashes. Construct cases whose individual definitions and descriptors remain valid so history validation itself is proven; include valid replay/revocation/restart controls.
- No imports from browser, P9 or P12; no eval/Function/vm execution of authored content, filesystem/network access, RNG, generic mutation program or new runtime hook.

From `D:\VTT\server`, after separate implementation authorization:

```powershell
node --check services/authoredSpellDefinitions.js
npx mocha tests/authoredSpellDefinitions.test.js --timeout 10000 --exit
```

These new paths do not exist until implementation. Existing actor consequence/P9/P12 files must remain byte-identical; if they do, no full combat suite/build is required merely for this unhooked module. If an implementer needs to touch them, stop for a new contract rather than broaden A1a. No App/Firestore/two-device acceptance is claimed by the Node suite.

## 9. Dependencies, acceptance, exclusions and rollback

**Independent preparation:** W1a/b are not compile/stage module dependencies. A1a accepts only explicit-price DTO fixtures and never invokes the lossy Wizard paths.

**Integration gate:** before claiming any real Wizard-authored admission/acceptance, both W1 fixes plus a frozen adapter must prove outer save, Review serializedData, template/export, reopen, admitted hash and descriptor price agree exactly. Do not supply default prices at the server to mask UI loss. That real witness, live GM authority, storage installation and casting belong to A1b/integration; it stays blocked until specified/authorized.

That adapter must distinguish a genuinely new draft whose default was explicitly reviewed/materialized from an imported/serialized payload whose price was lost. A missing imported price requires explicit re-authoring/review; silently reopening it with a default1 is not proof of the original authored price. A1a does not repair old libraries or add this loader/UI provenance flow.

**Acceptance:** module and codec implement the exact DTO/API/rules above, golden vectors and failure matrix pass, all effects are staged-only with execution disabled, old P9/P12 remain byte-preserved and no UI/backend route is activated. Output patch/tests/frozen fixture/evidence plus explicit remaining A1b blockers.

**Rollback:** remove/disconnect only this unreferenced module/tests or leave it unused. Preserve definition snapshots/fixtures; no old character/spell/ruleset migration and no combat refund. Future installed-registry rollback needs its own lifecycle contract—do not improvise one here.

**Still outside A1a:** live endpoint/GM panel, actual registry storage/lease/CAS installation, browser/Wizard/book adapters, actor eligibility/learned spells, runtime payment/targeting/mitigation, new resources, summons, links, transformations, reactions, areas and full libraries. The original reconstruction backlog remains open.
