# CR-A1b — live authored-spell integration (first executable integration contract)

> **Status: PARKED by Class HeadQ course correction (2026-10-18). Not review-ready, not frozen, and not an implementation assignment.** Main Mythrill HeadQ owns combat authority, shared execution and persistence. The draft below is retained investigation history, not a selected architecture or a prerequisite for class design/content. Outstanding requirements are handed off in [33_CLASS_DELIVERY_RESET_AND_ENGINE_HANDOFF.md](../33_CLASS_DELIVERY_RESET_AND_ENGINE_HANDOFF.md).
>
> **Evidence provenance correction:** corrected A1a is a proposed integration baseline at service hash `48b69255b8958ae75a7aa17ed7aa67c95b6d4c2bada63f4dcd24a305e20f0003`. Final F1/F2 evidence is **correction plus verification**, because the reviewer applied the corrections; it must not be described as a fresh independent review of untouched implementer work. Preserve the original BLOCK findings and independent probe sources under `evidence/CR-A1a-independent-review/`. W1/A1a work is retained. No A1b code was implemented by this planning workstream.
>
> **Historical draft follows; its acceptance wording, unresolved integration choices and engine prerequisites are superseded by the course correction above.**
> Prepared 2026-10-18 by the DeepSeek implementer at HeadQ's request, on the basis of the retained
> CR-A1a independent review (BLOCK resolved) and a fresh seam investigation of the live server and
> client. A1a bounded acceptance was recorded 2026-10-18: retained probes 40/40, identity check
> exit 0 (108/108 baseline, fixture byte-identical), legal 128/256 capacity control exit 0 against
> `server/services/authoredSpellDefinitions.js` `48b69255…`. W1a/W1b bounded acceptance is also
> recorded. A1b implementation starts only after explicit authorization; this contract is the
> review object for that authorization.

## 1. Goal and hard scope boundary

Add **one named capability** `authored-immediate:v1`: a Wizard-authored, GM-admitted spell pilot
record that executes through the **existing** actor-consequence command/receipt path. It is the
first genuine proof that a newly Wizard-authored spell enters an executable path — and still the
**pilot shape only**: immediate cast, source + one target, price `{ap, mana}`, effect
`damage`/`healing` from the frozen A1a formula subset. No new class state.

**First real witness (end-to-end):** Wizard author → outer save/reopen → GM admit → owner exact
approval → GM result → one existing-authority receipt → HUD/personal save → second-client
reconnect, including 0 AP, insufficient resources, wrong class, changed definition, duplicated
command, stale actor, revoked definition and unsupported program.

**Prohibited:** new class domains/entities/reactions/areas; a second mechanics source (book
picker/library projections stay presentation); new engine architecture; copying the combat
system; silently routing authored casts to direct GM consequence; client hash-only admission;
any global "trusted spell" boolean; changing GM damage/defense rules, legacy IDs or the frozen
P9/P12 flows. Do not treat `bookSpellPickerModal`-style projections as executable records.

## 2. Consumed A1a surface (frozen inputs — do not modify)

From `server/services/authoredSpellDefinitions.js` (hashes pinned in
`evidence/CR-A1a/new-source-hashes.json`):

- `compileDefinition`, `emptyRegistry`, `encodeRegistry`, `decodeRegistry`,
  `createDefinitionRegistry({ authorize }) → { planAdmit, planRevoke, describe }`.
- Plans return `{ ok: true, kind: 'transition' | 'replay', installed: false,
  expectedRegistryRevision, requestHash, nextRegistry, decision, descriptor? }`. **Installation is
  this contract's job — A1a never installs.**
- Fail-closed codes consumed as-is: `REVISION_CONFLICT`, `REQUEST_ID_CONFLICT`, `VERSION_EXISTS`,
  `VERSION_SEQUENCE`, `DEFINITION_REVOKED`, `ALREADY_REVOKED`, `HASH_MISMATCH`, `SCOPE_MISMATCH`,
  `UNSUPPORTED_BINDING`, `UNSUPPORTED_SHAPE`, `CAPACITY`, `INVALID_DEFINITION`,
  `INVALID_REGISTRY`, `AUTHORITY_UNAVAILABLE`, `FORBIDDEN`.
- Invariants preserved: fresh authority on every admit/revoke including replays; full pre-await
  detachment/strictness; complete history validation on every registry read; ≤128 versions,
  ≤256 decisions, ≤256 KiB per registry; golden hashes immutable; `executionEnabled:false` in
  every descriptor until a separate execution contract says otherwise.

## 3. Exact integration seams (investigated 2026-10-18 — reuse, do not duplicate)

### 3.1 Transport + GM authority (new handler)

- New `server/handlers/authoredSpellHandlers.js`, registered exactly like existing handler
  modules (`server/socketHandlers.js:41`, `:857` pattern). Events to freeze (review decision):
  `authored_definition_admit`, `authored_definition_revoke`, `authored_definition_describe`.
- Membership/GM gate: `validateRoomMembership(socket, roomId, true, players, rooms,
  authorityService)` — `server/handlers/roomHandlers.js:97` (GM branch 111–113, current-authority
  denial 125–131), wrapper `server/server.js:281`. `roomId` always comes from the verified socket
  room context, never from an authority-asserting client field.
- Fresh-authority port backing the A1a `authorize` callback must be built on
  `server/services/roomAuthorityService.js` (`assertCurrent` 376, `assertFreshRoomAuthority` ~573,
  `assertOperationContext(context, authorityService, {binding, settle})` 661 with pre/post-await
  binding checks 666–681). **The legacy `if (!authorityService) return { ok: true }` branch
  (662–664) is forbidden** (frozen A1a constraint). The port returns exactly
  `{ok, roomId, uid, gmUid, principalBound, authorityCurrent, rulesetId:'prism',
  rulesetVersion:'cr-a1a-pilot-1'}`; post-await denial follows the P12A witness pattern
  (`server/tests/p12aWeaponStrike.production.test.js:282–292`: GM authority revoked mid-await ⇒
  refusal).
- Payloads must satisfy the A1a request envelopes verbatim (admit: `roomId`, `requestId`,
  `expectedRegistryRevision`, `definition`, `expectedDefinitionHash`; revoke: `…definitionRef`;
  describe: `definitionRef` + `expectedBinding`). No extra fields.

### 3.2 Registry persistence + CAS installation

- Storage: one registry per (room, binding) attached as a new `room.gameState` sub-blob
  (e.g. `gameState.authoredSpellRegistries['prism:cr-a1a-pilot-1']`, exact key shape frozen at
  review). Load/use re-validates through `decodeRegistry`; an invalid blob **refuses the feature
  with a stable code and is never repaired**. Exterior room-checkpoint schema is unchanged
  (unknown-field tolerance only, `server/services/roomCheckpoint.js` canonicalize is structural).
- Install path: `writer.admitConsequence(roomId, prepare, install, {authorityToken})` —
  `server/services/syncService.js:434–454` (revision guard 435–437, checkpoint preflight 439–443,
  authority-fence budget 445–448, synchronous `install(snapshot)` 451). Firestore CAS is the
  revision precondition in `publishRoomCheckpoint` (`server/services/firebaseService.js:664`;
  positive-safe-integer revision 673–680; root `lastUpdateTime` precondition 826–827; post-commit
  authority revalidation 842–853). Live-only rooms follow the `actorConsequenceHandlers.admit`
  branch (76–95: canonicalize via `roomCheckpoint` for live-only, else `writer.admitConsequence`).
- CAS contract: commit only when stored revision === `plan.expectedRegistryRevision`; mismatch →
  bounded `REVISION_CONFLICT` to the client, **no partial write, no decision leak**. A
  `kind:'replay'` plan performs no write and answers idempotently (installed:false +
  `currentRegistryRevision`). Admitted-but-not-executing stays visibly
  “admitted definition, runtime pilot pending”.

### 3.3 Casting execution (the pilot binder)

- New binder/approval modules following the existing capability pattern — **do not byte-modify**
  `spellPayments.js`, `strikeApprovals.js`, `actorConsequences.js` or their tests; add parallel
  modules and register them the same way. Pattern to mirror from
  `server/services/spellPayments.js`: `CAPABILITY` 13, `validateApproval` 120 (price shape
  `{ap, mana}` 132–133), `tempFirst` 141, `sourcePools` 147, `checkAgainstRoom` 152,
  `pendingFor` 170–182, closed registry 185–198, `bindCommand` 217–268 (GM-only 218–220, approval
  custody, `stale_actor_revision` CAS 242–245, expected source pools 249–252, exact expected
  actor array 258–266). Strike sibling: `strikeApprovals.js:202`.
- Admission→execution join: after owner approval and after every await, the server re-reads the
  **installed** registry and the admitted version; execution requires the same
  `definitionHash`/price/class binding as admission (`HASH_MISMATCH`, `DEFINITION_REVOKED` →
  refuse; revocation affects future actions only, history retained). Real actor state comes from
  the live character/token (`characterHandlers.js:129/179–214`), AP/mana/HP staged once through
  `actorConsequences.stage:247` with `resources()` aliases (78) and `validateCommand` (118).
  Two simultaneous actions cannot spend the same pools; a rejected command has no partial cost;
  a lost-ACK check returns the receipt or an honest unknown, never an automatic new cast.
- Amount rule: reuse the frozen P9 admission/consumption amount semantics once cited verbatim in
  review — **freeze decision**, do not invent a second amount rule.

### 3.4 Wizard producer + exact-price witness

- Today the producer path is client-only: `Step10Review.jsx` `handleSaveSpell` 2559 →
  `librarySpell` 2624 / `serializedData: serializeSpell(spellState)` 2630 → local storage
  (`spellLibraryScopedStorage.js`) and direct client Firestore (`userSpellService.js:49`);
  **no socket event exists**. This contract adds a client authored service (mirroring
  `spellConsequenceService.js` and `actorConsequenceService.requestActorEvent:161`) that, after
  the existing local save succeeds, requests GM admission through §3.1.
- Witness artifacts to compare byte-exactly: outer save (Step9/character persistence preserves
  `spells`, `characterPersistenceService.js:110/165`), Review `serializedData`, template/export
  round-trip (`spellSerializer.js` `serializeSpell:34` / `deserializeSpell:50` /
  `createSpellTemplate:65` / `generateSpellFromTemplate:89`; export positive control
  `spellSerializer.resourceRoundTrip.test.js:203–214`), reopen (`loadUserSpells`,
  `userSpellService.js:140`), then the admitted descriptor price and `definitionHash`.
  **No server-supplied default prices may mask UI loss** (frozen W1 rule).

### 3.5 Room state shape

In-memory room: `players` Map, `gm`/`gmId`, `members[]`, `gameState`, `authorityToken`,
`lifecycleState`, `isPermanent`, `settings`; persisted via root + `gameState/current` + per-map
docs. The registry blob attaches under `gameState` (§3.2) and is room-scoped only.

## 4. Freeze targets (decide at review, before implementation)

1. Event names + payloads and the client error mapping table (A1a codes → bounded client
   errors/receipts; no stacks, no partial cost).
2. Registry blob key/schema and its revocation/pending projection.
3. Binder interface: get/closed/consumed/bind/close, shared identity capacity, private recovery
   families, receipt projection (all per the A1 contract outline; no new class state).
4. Amount/roll rule for authored `damage`/`healing` (mirror P9 verbatim).
5. Feature gate name/flag and the visible “runtime pilot pending” surface.

## 5. Executable acceptance (all must run and pass; evidence in `evidence/CR-A1b/`)

Automated (server, production-stack pattern of `p12aWeaponStrike.production.test.js`):

- (a) Wizard-authored payload → GM admit → CAS install; stored registry decodes; descriptor
  price identical to authored 0 AP / mana values.
- (b) Concurrent admits from the same revision: exactly one installs; the loser gets
  `REVISION_CONFLICT` with no partial write.
- (c) Stale loser re-played against the new revision is refused, not silently rebased.
- (d) Non-GM request and GM revoked during the await both refuse (`FORBIDDEN` /
  `AUTHORITY_UNAVAILABLE`), zero install.
- (e) Duplicate command/replay is idempotent; AP/mana spent exactly once.
- (f) 0 AP accepted; insufficient AP/mana refused with no partial cost; temp pools first.
- (g) Wrong class (`UNSUPPORTED_BINDING`), changed definition (`HASH_MISMATCH`), revoked version
  (`DEFINITION_REVOKED`) refused at both approval and command time.
- (h) Unsupported program stays a draft; nothing executes.

Client: exact-price round-trip unit test; request-bytes test (producer → admit envelope);
receipt projection test. End-to-end: two-client reconnect witness per §1.

Commands (from `D:\VTT\server`): `node --check` on each new module; focused
`npx mocha tests/<new>.test.js --timeout 10000 --exit`; scoped eslint; from `D:\VTT`:
`git diff --check` and byte-preservation verification (P9/P12/W1/actorConsequence files and
their tests unchanged except new files).

## 6. Dependencies, gates, rollback

- Dependencies: W1a/W1b bounded acceptance (recorded), A1a bounded acceptance (recorded
  2026-10-18), explicit HeadQ authorization to implement A1b (NOT granted by this document).
- Gate/rollback: named enable gate; rollback disables the gate and keeps canonical drafts and
  admission history; no migration, no conversion of old saves, no refunds.
- Preservation: existing P9/P12/W1/actor-consequence modules and tests stay byte-preserved; new
  modules are additive and registered like existing handlers; no commits/deploys without
  authorization.
