# P12 — Targeting and Defense Resolution (contract)

**Revision 5, 2026-10-17: P12B-r1 (§3.9) FROZEN for implementation (HQ authorization of 2026-10-17).**
**Revision 4, 2026-10-16. Slice 12A is FROZEN and complete (revision 3a). Slice 12B-thin (§3) is FROZEN for
implementation (HQ authorization of 2026-10-16).** Approved creator decision: **C1/D-E** only (the item's current
authored die is its blocking die and wear track). None of the other creator decisions in
[MYTHRILL_P12_CREATOR_DECISIONS.md](MYTHRILL_P12_CREATOR_DECISIONS.md) is approved; every undecided item stays a
visible GM ruling. Roadmap scope: [MYTHRILL_P11_P14_ROADMAP.md](MYTHRILL_P11_P14_ROADMAP.md) §5.

**Narrow implementation clarifications (2026-10-16; no creator decision approved):**
- Critical strikes leave rare flat DR **GM-adjudicated**. Excluding its automated subtraction is
  not an armor-bypass rule and never means flat DR is automatically ignored. Equipment DR and
  rare flat DR remain distinct.
- Admission reserves closed-ID capacity for pending approvals (closed + pending ≤4096), so
  consumption can always retain its tombstone without exceeding the frozen bound.
- Independent review found the reverse-order cross-P9 collision: a P9 registration can arrive
  after a strike claims the same ID. The shared P7 binder dispatch now refuses cross-registry or
  foreign-receipt collisions with `command_id_conflict` **before either binder consumes**. P9's
  module and approval handlers remain unchanged. This strengthens §2.6's one-way registration
  check without authorizing any additional consequence or changing ordinary P9 retries.

Revision 3 changes, in response to HQ's freeze amendments:
1. **Usable workflow.** Manual proficiency and defense rulings are one compact adjudication summary
   with a single explicit GM confirmation. Per-item bookkeeping ticks and separate "creature defenses
   applied" acknowledgements are removed. Only defenses relevant to this strike are listed; authored
   prose is collapsed behind its name.
2. **Proficiency layer.** The actual weapon type, its separate rank, die and authored table are shown.
   Interpretation stays manual. The VTT never infers a face and never adds a table damage bonus.
   The complete chosen face text is shown and recorded as not applied.
3. **Accepted results.** A receipt confirms only its committed AP/HP. Manual effects are listed as
   "Not applied by the VTT". No tick or flag in the receipt claims a separate effect was committed.
4. **Custody.** P7/P9 recovery semantics are kept (§5). The "restart means never retry" sentence is
   replaced by the exact behaviour.
5. **Server boundary.** The capability, approval schema, adjudication schema and the three P7 touch
   points are specified exactly (§2.6) and reviewed before code.
6. **Decision brief.** "Top face always hits" is labelled as proposed; the D-F1 comparisons are
   labelled conditional on it (decision brief revision 3).

## 1. What exists today (verified in source and data)

| Area | Owner today | Fact that shapes P12 |
|---|---|---|
| Strike rule | Laws › Combat Basics; Attacks & Damage | Weapon die once; natural 1 misses (fumble: weapon durability damage); top face is a critical — roll again and add, may explode repeatedly, and triggers a weapon-specific condition; otherwise face + Strength or Agility modifier. Modifier = (score − 10) ÷ 2, rounded down. |
| Strike attribute | `utils/weaponIntegration.js` | Ranged slot or DAGGER/RAPIER → Agility, else Strength. |
| Strike price | creator decision 1A; `BASIC_WEAPON_STRIKE_AP` = 2 | The action-bar cards in `data/weaponActionSpells.js` still say 1 AP. 12A charges the decided 2 AP and says so; the card text is a recorded follow-up, not changed here. |
| Weapon proficiency | Laws › Weapons; `utils/weaponProficiency.js` (P11) | Per-weapon rank, die d4…d20 (`WEAPON_TYPE_TIERS`); 1–20 outcome table per archetype (`WEAPON_TYPE_SIMPLE_TABLES` via `getWeaponSimpleTable`). Modifier, explosion and face mapping are **[Open]**. 23 faces name AC or to-hit. |
| Equipped weapon type | item `discipline`/`weaponType`/`subtype` | `getWeaponDisciplineKey` silently falls back to `sword`; 12A does not use that fallback. |
| Weapon dice | `weaponStats.baseDamage` | 34 items roll 2–4 dice; the strike rule is single-die. |
| Creature defenses | five sources (§2.3) | Library percent-reduced tiers, prose, instance conditions, wizard percent-taken encoding, campaign free text. |
| Damage modifiers | Laws › Damage Modifiers | Reductions round down (×0.75, ×0.5, ×0); increases round up (×1.25, ×1.5, ×2). |
| Authority/receipts | P7 | Exact refs and revisions; source + one target; HP/mana/AP current/temp and typed conditions. |
| Pattern reused | P9 `spellPayments` / `spellConsequence*` | Owner approval → GM's direct consequence binds and consumes it → one receipt. |

## 2. Slice 12A — basic weapon strike, PC → one creature (FROZEN)

### 2.1 Producer and support

In a shared room, these action-bar producers open the Strike panel instead of the local cast:
- main hand "Attack (…)" (`mh_standard_attack`);
- ranged "Ranged Attack (…)" (`ranged_standard_attack`);
- the library "Attack (Melee or Ranged)" (`universal_attack`), using the main hand.

The strike is supported only when the weapon (or unarmed, 1d4 smashing) rolls exactly **one** die.
Multi-die weapons, thrown weapons, off-hand strikes (dual wield), weapon specials and every other
weapon action keep today's path unchanged, with no claim of room automation. Outside a shared room
nothing changes.

### 2.2 Workflow

**Owner (attacker's player).** Nothing is spent before the GM accepts.
1. Picks one bound creature on their own map.
2. **Weapon roll.** Rolls the weapon die on screen or enters physical faces.
   - Natural 1: miss. The panel records the one face only.
   - Top face: critical. The panel asks for the next face until a face below the top is recorded
     (at most 20 faces). Proposed damage = sum of faces. *[Open: whether the attribute modifier is
     added on a critical. The GM includes it in the final amount if ruled.]*
   - Otherwise: hit. Proposed damage = face + modifier, at least 0.
3. **Proficiency (manual, labelled).** The panel shows:
   - the weapon type (from the item; if it does not name a known type, the owner must pick one —
     recorded as `typeSource: 'owner'`);
   - the separate rank and die for that type (`resolveWeaponRank`; the legacy shared rank is never used);
   - the authored table for that type (archetype name; faces collapsed, AC/to-hit faces marked
     `[Open: obsolete wording]`).

   The owner rolls the proficiency die on screen or enters physical faces. Only raw faces are recorded
   (1 face; up to 4 if the table explodes it — *[Open]*). The panel states: *"[Open: whether a modifier
   is added, whether the die explodes, and how the result maps onto faces 1–20. The GM picks the
   outcome.]"*
4. Approves the price: **2 AP** (temporary AP first). Sends to the GM.

**GM — one compact adjudication summary.**
- **Strike line:** weapon, faces, outcome, proposed amount.
- **Proficiency:** type, rank, die, raw faces and the table. The GM picks exactly one:
  - a face *n* (1–20);
  - **No proficiency outcome**, with a reason;
  - **Deferred**, resolved at the table.

  Nothing is pre-selected or inferred from the raw faces. A chosen face shows its complete authored
  text and its tier label (for example "Tactical Edge (+2 dmg)"). Its damage is **not** added; the GM
  may include it in the final amount, and the reason line records it.
- **Defense** (§2.3): at most one automated step with its arithmetic, then the list of GM-ruled items
  relevant to this strike. Each item is one line, with authored text behind its name. When the list is
  not empty, the GM picks one verdict: *No listed defense applies* or *Applied in the final amount*,
  with an optional note.
- **Final amount**, prefilled with the post-defense amount. A reason is required when it differs.
- **Preview** of exactly what the command applies and what it does not.
- One button, **Confirm and apply**. This is the GM's single explicit confirmation.

**Result.** One P7 command applies attacker AP −2 (temp first) and creature HP (temp first). The
receipt is the only result.

### 2.3 Creature defenses in 12A

| # | Source | 12A handling |
|---|---|---|
| 1 | Bundled library (`/data/creatures.json`), percent **reduced**/**added** per damage type | Automated only when all hold: the token's `creatureId` is a bundled id; the GM's loaded entry has the same `resistances`/`vulnerabilities` as the bundled file (else "edited"); the strike's damage type is one of the 11 Laws types; exactly one entry for that type exists (resistance **or** vulnerability); its value is 25/50/100; and there is no `all` entry. Anything else for that type, `all`, or a material key (`iron`, `copper`) is a GM-ruled item. Off-tier values wait for D-A. |
| 2 | Authored abilities (`/data/abilities.json`) of a bundled creature | Abilities matching the audit's defensive pattern are GM-ruled items, listed by name; text collapsed. Never parsed. |
| 3 | Instance conditions (`state.conditions`) | Flat DR automated only when: no tier step applies; the target has exactly one condition with a non-zero numeric `effects.damageReduction`, and that value is an integer 1–1000; and the strike is not a critical (D-D). Otherwise each DR condition is a GM-ruled item. `effects.armor` is shown as obsolete information, never applied, and needs no ruling. |
| 4 | Custom or edited creature (wizard percent-**taken** encoding; D-I) | Not automated. A GM-ruled item is listed when it has an entry for this damage type or `all`. A creature not in the bundled library always gets one item: "Custom creature: defenses not known to the VTT". |
| 5 | Campaign homebrew (free text, not linked to tokens) | Covered by the custom-creature item above. |
| — | Creature Defend, conversion/absorb, auras | GM-ruled (D-H, D-B), reached through the custom item or the verdict note. |

Arithmetic (Laws): resistance *p* → ⌊x·(100−p)/100⌋; vulnerability *p* → ⌈x·(100+p)/100⌉;
flat DR *d* → max(0, x − d).

A miss has no defense step.

### 2.4 What the receipt says, and what it does not

Accepted text (card and chat):

> "Accepted: AP −2 (Ilse), HP −9 (Grimmstalk). **Not applied by the VTT:** Face 18 (sword): Dazing
> Hilt Impact: …; Critical hit: the weapon-specific condition from Laws › Attacks & Damage."

- A miss reads "Accepted: AP −2 (Ilse). Miss — HP unchanged." plus the fumble line.
- The receipt never implies stun, prone, wear, AP loss, extra targets, conditions or ammunition were
  applied.
- If the GM applies one, that is a separate normal action with its own P7 command.

The receipt is public. It carries:
- the one weapon rank used, never `skillRanks`;
- no ability names, resistance values or prose. GM-ruled defense items appear only as source
  categories; the GM's optional verdict note is marked "visible to everyone" in the panel.

### 2.5 Other 12A manual items (visible reason)

- The critical-miss follow-up and fumble durability damage.
- Dual wield, thrown weapons, ammunition, multi-die and formula weapons.
- Area or multi-target attacks.
- Damage conversion (D-B).

### 2.6 Server boundary (exact; reviewed before code — revision 3a after the specification review)

The specification review (2026-10-16, PASS WITH REQUIRED CHANGES) found no widening of authority.
Its three blocking and eight should-fix findings are resolved below; see §9.

**Capability.** `p12a-strike:v1`. Definition identity:
- `adjudication.definitionId = 'basic-weapon-strike'`;
- `adjudication.definitionVersionOrHash = 'p12a-strike:v1/basic-weapon-strike'`.

**New module** `server/services/strikeApprovals.js`. It owns its own approval registry and closed-ID
memory, separate from P9's:
- a WeakMap per room;
- at most 32 pending entries and 512 KB per room;
- one pending strike per owner + character;
- at most 4096 closed IDs **per room** per runtime. IDs are never evicted; at the limit,
  registration is refused with `approval_capacity` until the runtime changes (as in P9).

It exports `validateApproval`, `checkAgainstRoom`, `checkWindow`, `bindCommand`, `consumedReceipt`,
`get`/`add`/`close`/`closedCode`/`pendingFor`/`listAll`, `CAPABILITY`, and the constants below.

**Server constants.** These are duplicated from the client; a client Jest test reads the server file
and asserts equality:
- `STRIKE_AP = 2`;
- the rank → die ladder: UNTRAINED 4, NOVICE 6, TRAINED 8, APPRENTICE 10, ADEPT 12, EXPERT 20, MASTER 20;
- the 11 Laws damage types: smashing, slicing, stabbing, ember, rime, storm, blight, sacred, wyrd,
  arcane, primal;
- the four fixed manual-effect texts.

**Bounds.**
- String bounds count UTF-16 code units (JavaScript `length`); every bounded string is non-empty
  unless stated.
- "Fixed" text means exact string equality with the server constant.
- The decoded `chosenResult` is at most **8192 UTF-8 bytes**. The field bounds below fit inside it:
  the worst case is about 2.9 KB of ASCII, and under 8 KB if every text is three-byte UTF-8.
  The whole command stays within P7's 65536 bytes.

**ApprovalV1 (owner → `actor_strike_approve`).** Exact keys at every level; unknown keys are refused
with `invalid_strike_approval`. Serialized size ≤ 8192 bytes.

| Field | Rule |
|---|---|
| `version` | `1` |
| `roomId`, `actionEpoch` | strings ≤ 200 |
| `approvalId` | UUID |
| `baseCommitSequence` | safe integer ≥ 0; inside the replay window (else `retry_window_expired`; above the current sequence → `invalid_strike_approval`) |
| `source` | exact P7 **character** ref in this room |
| `target` | exact P7 **creature** ref, same room and map |
| `weapon` | `{slot: 'mainHand'\|'ranged', itemId: string ≤ 120 or null, name: string ≤ 80, weaponType: /^[a-z][a-z ]{1,38}$/, typeSource: 'item'\|'owner', die: integer 2–100, damageType: /^[a-z]{2,20}$/, attribute: 'strength'\|'agility', score: integer 0–100, modifier: integer = ⌊(score − 10)/2⌋}`. `itemId: null` only for unarmed: `weaponType 'unarmed'`, `slot 'mainHand'`, `die 4`, `damageType 'smashing'`. |
| `roll` | `{mode: 'digital'\|'physical', faces: 1–20 integers in 1…die}`; chain rule below |
| `proficiency` | `{weaponType: = weapon.weaponType, rank: one of the 7 rank keys, rankSource: 'stored'\|'quests'\|'default', die: = ladder[rank], table: /^[a-z]{2,20}$/, roll: {mode, faces: 1–4 integers in 1…die}}`. A proficiency roll is required on every strike, a miss included. |
| `price` | exactly `{ap: 2}` |

**Owner-reported fields.** `weapon.name/itemId/weaponType/typeSource/die/damageType/attribute/score`
and `proficiency.rank/rankSource/table` are owner-reported sheet data:
- the server checks their shape and internal consistency only;
- the GM summary labels them "owner-reported";
- they cannot widen authority, because the GM alone sets `finalAmount`.

The client derives them as follows:
- the attribute from `weaponIntegration`;
- the score from the sheet's `stats` (as P9 does);
- the table from `getWeaponArchetype(weaponType)`.

**Chain rule.**
- If `faces[0] = 1`, there is exactly one face (miss).
- Otherwise every face except the last equals `die`.
- The last face is below `die` unless there are 20 faces.
- One face that is neither 1 nor `die` is a hit.

**Approval-ID space.** Strike and P9 receipts both use `authorization.proposalId` with kind
`owner-approval-gm`.
- `strikeApprovals.consumedReceipt` matches only receipts whose
  `adjudication.definitionVersionOrHash` starts with `p12a-strike:v1/`.
- Registration refuses (`command_id_conflict`) an `approvalId` that is pending or closed in P9's
  registry, or that appears in any non-strike receipt.
- P9's own `consumedReceipt` is left unchanged. A P9 approve, withdraw or decline sent with a
  strike's ID can find that public strike receipt, but:
  - the hash check refuses the approve (`command_id_conflict`);
  - withdraw and decline only echo the already-public receipt and change nothing.

  This cross-match is accepted and documented, so P9 stays byte-identical.

**Registration** (`actor_strike_approve`). It mirrors P9's `actor_spell_approve`, in this order:
1. A strike receipt for this `approvalId` returns that receipt (approval hash and owner must match,
   else `command_id_conflict`).
2. A pending strike entry with the same hash returns `awaiting_gm`; a different hash fails with
   `command_id_conflict`.
3. A closed strike ID fails: `retry_window_expired` if consumed, else `approval_<code>`.
4. The cross-registry ID check above.
5. A different `actionEpoch` fails with `outcome_unknown`.
6. The window is checked.
7. The submitter must be `source.ownerUid` and own the bound primary token.
8. `checkAgainstRoom`:
   - the source is located;
   - the target is located and bound, and is a creature;
   - the source can afford 2 AP, temp first (`insufficient_resources`).
9. The room authority is confirmed (`await`).
10. Ownership and `checkAgainstRoom` are rechecked.
11. **A pending entry is re-checked after the await** (returns `awaiting_gm`).
12. The entry is added; the GM receives
    `actor_strike_pending {roomId, approval, contentHash, submitterUid}`.

**Other events.** These mirror P9 one-for-one:
- `actor_strike_withdraw` (owner only);
- `actor_strike_decline` (GM only);
- `actor_strike_list` (own entry, plus all entries for the GM);
- `actor_strike_closed {roomId, approvalId, contentHash, code}`, sent to the owner and the GM on
  withdraw or decline.

Consumption sends no `closed` event: the accepted receipt broadcast settles both sides, as in P9.

The four request events are added to `AUTHORITATIVE_ROOM_EVENTS` and to the rate limits at the P9
values. `actor_propose` already refuses any command carrying `approval` (`approval_requires_gm`), so
`actor_adjudicate` can never consume one.

**GM command** (`actor_consequence` with `approval: {approvalId, contentHash}`), bound by
`strikeApprovals.bindCommand`:
1. The player is GM, and the authorization kind is `gm` (direct). Otherwise `forbidden` /
   `approval_requires_gm`.
2. The entry is in the strike registry. Otherwise:
   - `approval_consumed` if a strike receipt exists;
   - `approval_<code>` if closed;
   - else `outcome_unknown`.
3. The `contentHash` matches (`command_id_conflict`).
4. The owner is still a room member (`owner_unavailable`).
5. `command.source` and `command.target` are hash-equal to the approval (`approval_mismatch`).
6. `definitionId` and `definitionVersionOrHash` are exactly as above (`approval_mismatch`).
7. `chosenResult` is a string whose UTF-8 size is ≤ 8192 bytes, decoding to exactly:

```
{ capability: 'p12a-strike:v1', approvalId, gmConfirmed: true,
  names: { source: string ≤ 60, target: string ≤ 60 },
  weapon, roll, proficiencyRecord,          // hash-equal to approval.weapon / .roll / .proficiency
  rollOutcome: 'miss'|'hit'|'critical',     // the WEAPON ROLL outcome (= server derivation); the result is finalAmount
  proposed: integer,                        // = server derivation
  proficiency: {kind:'face', face: 1–20, text: string ≤ 400, tier: string ≤ 60}
             | {kind:'none', reason: string ≤ 300}
             | {kind:'deferred'},
  defense: { damageType: = weapon.damageType,
             automated: null
                      | {kind:'resistance'|'vulnerability', percent: 25|50|100}
                      | {kind:'flatDr', amount: integer 1–1000, recordId: string ≤ 200},
             afterDefense: integer,         // = server arithmetic
             manual: ['library'|'ability'|'condition'|'custom'] (0–8; source categories only),
             ruling: null | {verdict: 'not-applicable'|'applied-in-final', note: string 0–300} },
  notApplied: [{source, text: string ≤ 160}] (0–5, canonical order) }
```

   Any other key, type or bound fails with `invalid_strike_adjudication`. An echo or derivation
   mismatch fails with `approval_mismatch`.

   **Privacy.** The receipt is public (`publicReceipt` copies `chosenResult`). It therefore carries
   only:
   - the defense **source categories**, never ability names, resistance values or prose (the GM
     panel shows those to the GM only);
   - the automated step, which the HP arithmetic would reveal anyway;
   - the GM's verdict note, which the panel marks "visible to everyone".

8. **Server derivations.** The server recomputes:
   - `rollOutcome`/`proposed`: miss → 0; critical → sum of faces; hit → max(0, face + modifier).
   - `afterDefense` from `proposed`:
     - resistance *p* → ⌊x·(100−p)/100⌋;
     - vulnerability *p* → ⌈x·(100+p)/100⌉;
     - flat DR *d* → max(0, x − d);
     - `null` → x.
   - A tier step requires `damageType` to be one of the 11 Laws types.
   - `flatDr` requires all of:
     - the roll outcome is not critical;
     - the target has **exactly one** condition whose `effects.damageReduction` is a number other
       than 0;
     - that value is an integer 1–1000;
     - the condition's `recordId || id` equals `recordId`, and the value equals `amount`.

     The client uses the same test. Any other DR value is a GM-ruled `condition` item.
   - On a miss: `automated: null`, `manual: []`, `ruling: null`, `afterDefense: 0` and
     `finalAmount: 0`. Any of the three proficiency choices is allowed.
   - `ruling` is non-null exactly when `manual` is non-empty.
   - `typeof definitionVersionOrHash === 'string'` is guarded before the prefix dispatch.
9. **Required not-applied entries.** They appear in this canonical order, each at most once, and no
   other source is allowed:

| # | Source | Required when | Text |
|---|---|---|---|
| 1 | `proficiency-face` | the choice is a face | `Face <n> (<table>)` (a reference; the complete face text is `proficiency.text`, shown in full by every presentation) |
| 2 | `proficiency-deferred` | the choice is deferred | fixed |
| 3 | `weapon-critical` | the roll outcome is critical | fixed |
| 4 | `weapon-fumble` | the roll outcome is a miss | fixed |
| 5 | `ammunition` | `weapon.slot` is `ranged` | fixed |

10. `finalAmount` is an integer 0–100000. `adjustmentReason` is a string ≤ 2000 (may be empty),
    required non-blank exactly when `finalAmount ≠ afterDefense`.
11. Every `expectedRevision` is current (`stale_actor_revision`).
12. `actors` are exactly the following, in this order, with no `conditions` or `classPayment`:
    - the source: `{ref: source, finalResources: {ap: tempFirst(current, temp, 2)}}`. This is P9's
      `tempFirst`, which refuses with `insufficient_resources`.
    - the target: `{ref: target, finalResources: {hp: {current: max(0, current − (amount −
      fromTemp)), temp: temp − fromTemp}}}`, where `fromTemp = min(temp, amount)`. This is P9's
      damage arithmetic; a lethal hit is valid.

    On a miss (`amount = 0`) the target entry is its unchanged `{current, temp}`. The entry is
    required (P7 requires the target among `actors`), and the target's revision still advances.

**Receipt budget.**
- A strike adjudication is typically 1.2–2 KB; the P7 receipt adds each actor's full condition
  list (existing P7 shape).
- P7's existing limit of 256 receipts / 512 KB is unchanged:
  - in persistent rooms, confirmed receipts are pruned (raising `replayFloor`, so retry windows
    close sooner);
  - in live-only rooms receipts are never pruned, and a long session eventually reaches
    `receipt_capacity` for every P7 command.

  This is a pre-existing P7 property, recorded as a limitation, not changed by 12A.

**P7 touch points.** These are the only changes to existing server files:
- `services/actorConsequences.js` `stage`. The single `require('./spellPayments').bindCommand(...)`
  call becomes a dispatch:
  - `strikeApprovals` when `typeof command.adjudication.definitionVersionOrHash === 'string'` and it
    starts with `p12a-strike:v1/`;
  - otherwise `spellPayments`, unchanged.

  `stage` also returns that `binder`. The receipt's `authorization` keeps the existing
  `owner-approval-gm` shape. A mislabelled prefix finds no entry in that registry and is refused.
  It cannot reach the other registry.
- `handlers/actorConsequenceHandlers.js`:
  - Line 232's `payments.close(...)` becomes `(staged.binder || payments).close(...)`.
  - The P9 `closeApproval` and `owner_reapproval_required` path stay P9-only. A strike never raises
    that code.
  - The four strike events are registered through a parameterised flow. The P9 handler code is left
    byte-identical apart from the one-line close change.
- `handlers/socketHandlers.js` and `services/rateLimitService.js`: the event names are added.

No P7 validation, field, pool, receipt shape or checkpoint codec changes. No client can widen its
authority:
- the owner can only register a strike for their own primary character;
- only the GM's direct command can consume it, with server-recomputed AP and HP.

### 2.7 Client additions

- `src/services/weaponStrike.js` (pure):
  - support decision;
  - strict weapon-type mapping without the `sword` fallback;
  - rolls and the chain rule;
  - approval builder;
  - defense classification and arithmetic;
  - GM command planner;
  - receipt parser and accepted text.
- `src/services/weaponStrikeService.js`: producer routing, owner custody, GM adjudication and
  socket handlers. It mirrors `spellConsequenceService.js`.
- `src/services/weaponStrikeCustody.js`: new private family `room.strikeConsequenceLatest`
  (user scope; one latest strike per owner and room).
- `src/components/hud/WeaponStrikePanel.jsx` (+ CSS), mounted next to the P9 host.
- Action bar: one routing line per producer (`routeWeaponStrike`) before the local cast.

## 3. Slice 12B-thin — creature hit → owner block → atomic HP and wear (FROZEN, revision 4)

**HQ authorization 2026-10-16.** Approved creator decision **C1/D-E**: the item's current authored die
is its blocking die and wear track; the category/quality tables are authoring guidance, not overrides.
No other D-A…D-J, C2–C5 or H-a…H-e answer is approved. Preparation detail and rationale:
[MYTHRILL_P12B_EQUIPMENT_WEAR_EXTENSION_DRAFT.md](MYTHRILL_P12B_EQUIPMENT_WEAR_EXTENSION_DRAFT.md) revision 2.

**In scope:**
- the owner's blocking declaration;
- the GM's attack offer;
- the owner's block roll approval bound to that attack;
- one GM P7 command applying creature AP, target HP and the piece's wear;
- safe reconciliation into the owner's private sheet;
- repair of the item-loss-on-break defect in the directly affected path.

**Explicitly GM-adjudicated (never automated):**

| Branch | Handling |
|---|---|
| Hit/miss and Evasion (D-F) | The GM declares the hit |
| Non-physical damage (D-C) | Required ruling `non-physical` |
| A critical against a shield (D-D) | Required ruling `critical-shield` |
| A backup shield when favored armor is bypassed (C3) | Not automated; the GM resolves HP by hand |
| Flat DR, resistances, conversion (D-B) | Optional ruling categories; the GM's final amount with a reason |

A critical against favored armor is refused (approved: no roll, no wear).

**Not in scope:** deep storage (C4), instance-id migration, a generic GM override, GM edits of a
declaration, reactions such as Raise Shield, and P13.

### 3.1 Declaration (server home `token.state.equipmentBlocking`)

- **Owner sync:** actor entry `blockingDeclaration { beforeRevision, mode: 'block'|'none', pieces[{slot, itemId, name, kind, currentDie}] }`.
  - Accepted only through the direct `actor_consequence`:
    - submitter = `ref.ownerUid`;
    - primary attachment;
    - single actor;
    - no approval.
  - `actor_propose` refuses it (`blocking_owner_required`).
  - CAS on `beforeRevision` (`stale_blocking_state`).
  - Refused while a block approval is pending (`blocking_pending`).
- **Each piece:**
  - must match the shared `token.character.equipment[slot]`: same `id`, the kind derived from
    `type`/`subtype` (`SHIELD` → shield, `armor` → armor), same name;
  - otherwise `equipment_projection_mismatch`;
  - dice are ladder values only (`d4 d6 d8 d10 d12 d20`).
- **The server stamps:**
  - `revision = beforeRevision + 1`;
  - `broken: false`;
  - `declaredDuring`;
  - `raised` (slots whose owner-declared die rose; shown to the GM).
- **List bound:** one entry per slot key (19) — technical only. There is no player-facing backup limit.
- **Protection:** `equipmentBlocking` is in `PROTECTED`.
- **Recovery:** a new incarnation moves it to `actorRecovery.priorBlocking`; an import moves it to
  `importedEquipmentBlocking`.

### 3.2 Selection window (server, at commit)

1. No active combat → allowed (`{outOfCombat: true}`).
2. A turn-order entry with `tokenId` equal to the character's token but no `actorRef` →
   `combat_binding_required`.
3. Matching `actorRef` entries:
   - none → allowed as out of combat (C5 technical default);
   - more than one → `combat_turn_ambiguous`.
4. Otherwise allowed only when `currentTurnIndex` is that entry → records `{round, turnIndex, turnStartTime}`;
   else `not_your_turn`.

The check only reads whose turn it is. `combatAuthority` / `COMBAT_AUTHORITY_ENFORCEMENT` (who may
advance turns) is unchanged.

### 3.3 Visibility

- **Owner (own primary) and current GM:** read the declaration through `actor_blocking_view` and
  receive `actor_blocking_changed` pushes.
- **Never projected:** it is excluded from the general token projection (positive allowlist) and from
  other members' events.
- **Public receipt lines:**
  - sync → `blocking: {revision}`;
  - wear → `equipmentWear: {slot, name, kind, beforeDie, afterDie, broken, naturalFace, defending, blockingRevision}`.
  No item id, backups or undeclared dice. Equipped item ids remain the pre-existing shared equipment data.

### 3.4 Attack offer, block approval, consumption

**Offer.** `actor_block_offer {roomId, commandId, attack}`:
- GM only. `commandId` is the UUID that will be the GM's P7 command ID.
- `attack = {capability: 'p12b-attack:v1', source, target, sourceRevision, ability{id|null, name}, roll{mode, dice, faces}, outcome: hit|critical, damageType, proposedDamage, apCost}`.
- The server checks the current source revision, computes `attackHash` (P7 canonical hash), keeps the
  offer in process memory (≤ 32) and forwards it only to the target's owner.
- Re-offering the same `commandId` with different bytes → `command_id_conflict`.

**Approval.** `actor_block_approve` (`p12b-block:v1`):
- carries `attack {commandId, attackHash}`, `blocking {revision, slot, itemId, die}` and one face;
- requires a live offer with equal hash and refs;
- must name the first available piece at the current declaration revision;
- registry semantics as P12A: process memory; ≤ 32 per room; one per character; closed + pending
  ≤ 4096; `outcome_unknown` after a runtime change; withdraw (owner), decline (GM), list (own/GM).

**GM command.** Actors `[creature {ap}, character {hp, equipmentWear}]`; adjudication
`creature-attack-block` / `p12b-block:v1/creature-attack-block`. Consumption requires:
- `commandId === approval.attack.commandId`;
- `hash(chosen.attack) === attackHash`;
- refs equal;
- source `expectedRevision === attack.sourceRevision`;
- `chosen.block` equal to the current piece, face, Defending state and `reduction = face × (Defending ? 2 : 1)`;
- `afterBlock = max(0, proposedDamage − reduction)`;
- final amount ≠ `afterBlock` needs a reason;
- creature AP = temp-first `apCost`; target HP = temp-first final amount;
- the wear entry equals the server derivation.

**Failure codes:**
- a different attack or changed facts → `approval_mismatch`;
- a consumed approval → `approval_consumed`;
- a changed declaration → `stale_blocking_state`, approval closed `owner_reapproval_required`;
- the cross-capability ID collision guard is extended to the new registry.

### 3.5 Wear

`equipmentWear {slot, itemId, blockingRevision, beforeDie, afterDie, broken}`, recomputed and never trusted:
- available piece = the first entry not broken and still in its shared slot;
- `wears = !Defending && (armor ? face ≤ 2 : face === 1)`;
- one step on `d20→d12→d10→d8→d6→d4→broken`.

Apply: the piece's die/broken, declaration revision +1, actor revision +1 — atomic with HP in one receipt.

### 3.6 Owner device reconciliation (private)

**Custody.** `roomEquipmentCustody` lives inside the character payload and is saved with equipment
and inventory in one P6 draft:
- per exact attachment: room revision, pieces `{slot, itemKey, keySource, die}`, `pendingUnequip`, conflicts;
- bounds: ≤ 4 entries and ≤ 8 conflicts, refusing at capacity.

**Instance key:** `instanceId`, else a uuid-form `id`, else `slot:id` (slot-legacy). Nothing is minted
or migrated. The user's item library is never a target.

| Receipt vs custody | Action |
|---|---|
| Custody revision ≥ the receipt's after-revision | No-op |
| Lower than its before-revision | Held as a gap; fast-forward from the scoped view |
| Equal, with private die = custody die = before-die | Apply |
| Anything else | Conflict: both values kept, nothing chosen |

Home fast-forward is used only when the difference is explainable by wear (same pieces, dice not
higher). The prior private values are first preserved in `roomActorRecoveryCandidates`.

Retired attachments are reconciled from the owner's `actor_recovery` (`priorBlocking`).

Re-declaration is refused while conflicts are unresolved.

### 3.7 Broken pieces

On the owner device:
1. Record `pendingUnequip` with the broken die.
2. Add the item to the pack, checking the result.
3. Only then clear the slot.

A full pack leaves the item broken and inert in its slot, pending. Never delete, never duplicate. The
server already skips broken pieces.

The existing fumble/manual path (`itemStore.updateItemDurability`) receives the same add-then-clear
order with a focused regression.

### 3.8 Acceptance (12B)

| ID | Check |
|---|---|
| B1 | Declaration out of combat; owner/GM-only reads; public receipts carry the revision only |
| B2 | Selection window |
| B3 | Declaration boundaries (shared equipment, CAS, owner only, protected) |
| B4 | Armor d8 face 2 → d6 with HP and creature AP in one receipt; minimal public line |
| B5 | Shield/Defend rules; forged wear refused |
| B6 | Breakage and backups |
| B7 | Attack binding and GM adjustment |
| B8 | GM-adjudicated branches |
| B9 | Retries and consumed approvals |
| B10 | Retired attachment |
| B11 | ID space and offer scoping |
| B12 | Owner custody: interrupted saves, duplicate/out-of-order receipts, eviction, changed equipment, retired attachment, full-pack breakage; competing values preserved |
| B13 | Break-path regression |
| B14 | Production App owner/GM path plus P12A/P8/P9 regressions |

### 3.9 P12B-r1 — recorded rolls survive stale state (FROZEN, revision 5, 2026-10-17)

HQ authorization of 2026-10-17 with amendments. No new creator rule is approved: "Don't block" for an
unavailable piece is **not** automated (S1 stays open).

**Principle.** A recorded attack roll (offer) and a recorded block face (approval) are never discarded to
obtain a new roll. They end only by consumption, owner withdrawal, GM void or an unconsumable binding
failure; every ending keeps the offer closed with its recorded outcome.

**Offer baseline (server memory, not hashed, never sent to players).** At `actor_block_offer` the server
stores `{revision, commitSequence, resources (hp/mana/ap current/temp/max), conditionsHash}` of the source
creature next to the offer.

**R1 Carry-forward (automatic).** When the creature's revision differs from `attack.sourceRevision`, the
server walks the P7 ledger from the baseline. Carry-forward is allowed only when **all** hold:
- `baseline.commitSequence ≥ replayFloor` (no pruned history) and every intervening receipt that names the
  creature is retained;
- each such receipt is a consumed `p12b-block:v1/creature-attack-block` command with
  `authorization.kind = owner-approval-gm`, `receipt.source` = this creature and `chosen.attack.source` =
  this creature (a sibling attack); a matching capability name alone is not enough;
- for each receipt, the creature entry's `beforeRevision` equals the previous `afterRevision` (contiguous),
  it carries no class payment, blocking or wear, its condition list hashes equal to the baseline, HP and mana
  (current/temp/max) equal the previous state, and AP equals `tempFirst(previous AP, chosen.attack.apCost)`
  with the same max;
- the chain ends at the creature's current revision and its current resources/conditions equal the chain's
  final state.

The GM command then names the creature's **current** revision; AP is recomputed temp-first from current
pools. Insufficient AP refuses (`insufficient_resources`) and the approval **stays pending**.

**R2 Attack revalidation (explicit).** Any other difference fails `attack_revalidation_required` (details:
from/to revision, `history_unavailable` or `unexplained_change`, public HP/mana/AP before→now and whether
conditions changed) and the approval stays pending. The GM may resubmit with
`chosen.revalidation = {fromRevision: attack.sourceRevision, toRevision: current, reason}` (reason 1–300
characters). `revalidation` must be absent when no revalidation is required. The recorded attack bytes and
block face are unchanged; the public receipt carries the revalidation.

**R3 Target side (explicit; no reinterpretation).** At consumption the approval's recorded block
`{revision, slot, itemId, die}` must still be the current first available piece at the same declaration
revision. Otherwise the approval stays pending and fails:
- `block_piece_unavailable` — the recorded piece is broken or no longer in its shared slot;
- `block_revalidation_required` — the piece is present but the declaration revision, die or first available
  piece changed (for example wear from an earlier hit).
A face rolled on one die is never treated as a roll on another die. The only resolutions are GM **void**
(then HP by hand through the existing direct GM consequence) or owner withdrawal. No automatic Don't block.

**R4 Closure without reopening.** Owner withdrawal, GM void (`actor_block_decline` with `approvalId`), GM
withdrawal of an unrolled offer, consumption and unconsumable binding failures (`critical_bypasses_armor`,
`actor_binding_conflict`, `secondary_attachment`, `actor_not_found`) close the approval **and** the offer.
A closed offer keeps a tombstone `{commandId, code, ability, attack roll, outcome, proposedDamage, block
face/piece if rolled, closedAt}` (≤ 4096 per room, process memory like approvals). Re-offering the same
`commandId` and approving a closed offer fail `offer_closed`. `actor_block_list` returns the 32 most recent
tombstones to the GM and to the target's owner only. A new attack is a new offer with a new `commandId`;
its tombstone history stays visible to both.

**Client.** GM planner uses the current creature revision; on `attack_revalidation_required` the GM card
shows the changes and offers "Recorded rolls still stand" (reason required) or "Void attack"; on
`block_piece_unavailable`/`block_revalidation_required` it shows recorded versus current piece and offers
only "Void block roll — resolve HP by hand". The owner never sees a "roll again" path for a closed offer.

**Acceptance (adds to B1–B14).** B15 one creature, two attacks on one PC, both faces kept, AP spent twice;
B16 two PCs; B17 intervening strike → revalidation required → GM confirms with reason → receipt records it;
B18 void → nothing applied, `offer_closed` for re-approval and re-offer; B19 insufficient AP → pending kept;
B20 pruned history → revalidation; B21 piece unavailable → pending, only void; B22 wear between approval
and consumption → `block_revalidation_required`; B23 a forged sibling (same capability, other source or extra
change) does not carry forward; B24 owner withdraw closes the offer; retries return the original receipt.

## 4. Non-goals

- Reactions and timers (P13); elixirs, multi-target and areas (P14).
- AC, Armor score or hidden ratings.
- A generic mitigation engine; rebalancing dice, tiers or creatures.
- Migrating item dice or resistance encodings.
- Parsing prose defenses, outcome faces or obsolete wording.
- Automating proficiency outcomes, creature Defend or any non-HP/AP effect, except the one
  equipment-wear effect frozen in §3 (12B-thin).
- Changing the weapon action cards' AP text.

## 5. Authority, privacy, persistence, recovery

- The owner approves the price and the rolls for their own primary character only. The GM
  authorizes the consequence and every manual ruling (P7 F5).
- Approval never spends. The approval is consumed synchronously with admission, so it can be
  consumed only once.
- **Owner custody.**
  - The latest approval (exact bytes, approval ID and recorded rolls) is retained on the device
    under `room.strikeConsequenceLatest`.
  - **Check this same strike** re-sends the identical bytes, never a new roll. The server answers:
    - the existing receipt, when one is retained in the ledger (also after a restart, once
      checkpointed);
    - `awaiting_gm` when the approval is pending;
    - `approval_withdrawn` / `approval_declined`;
    - `outcome_unknown` when the runtime changed and no receipt exists;
    - `retry_window_expired` when the replay floor passed.
  - An unresolved strike blocks a new one until it is withdrawn or declined, accepted, or explicitly
    marked reconciled with the GM.
- **GM custody.**
  - The prepared command keeps its command ID. **Check same command** re-sends the identical bytes;
    P7 `knownReceipt` returns the original receipt.
  - After a GM reload, a still-pending approval reappears through `actor_strike_list`. A new command
    can consume it at most once.
  - A consumed approval refuses a second command (`approval_consumed`).
- **Runtime change.** Pending approvals are process-memory only. After a runtime change the approval's
  `actionEpoch` no longer matches:
  - it cannot be re-registered (`outcome_unknown`);
  - a GM command cannot bind it (no entry).

  Nothing is ever resubmitted automatically. Explicit checks still recover any receipt that exists.

## 6. Acceptance checks (12A)

| ID | Check |
|---|---|
| A1 | Natural 1: on acceptance AP −2 (temp first), target HP unchanged; receipt says miss and lists the fumble line. A final amount other than 0 is refused. |
| A2 | Hit: face + attribute modifier; Strength vs Agility from `weaponIntegration`; modifier per Laws. |
| A3 | Critical: the chain is recorded; physical and digital paths produce the same record; the server refuses a broken chain. |
| A4 | Proficiency: per-weapon rank and die shown; raw faces recorded; the GM must choose face/none/deferred; no pre-selection; legacy shared rank never used; an unmapped item requires an explicit weapon type. |
| A5 | A face with stun/prone/wear: the receipt's `notApplied` carries the complete face text; HP/AP only change; the accepted text says "Not applied by the VTT". The server refuses a receipt that omits a required entry. |
| A6 | Defenses: a published tier is automated with Laws rounding; off-tier, `all`, material, prose and custom items need the one verdict; lone flat DR is automated (not on a critical); DR plus tier is GM-ruled; the server refuses inconsistent arithmetic or a flat DR the target does not hold. |
| A7 | A GM adjustment needs a reason; the receipt holds proposed, post-defense and final values. |
| A8 | A stale, deleted or other-map target, insufficient AP or a wrong price → refusal, nothing spent. Same approval or command retried → the original receipt. A second command → `approval_consumed`. |
| A9 | Production client: owner and GM through the real action bar and panels (P9 harness pattern); P8/P9 regressions unchanged. |

## 7. Gates

Source acceptance (one bounded independent review) is separate from:
- the production build;
- the full-App smoke (still outstanding from P11; combined with 12A when Windows execution is
  available);
- live Firebase/rules;
- two devices;
- a human session;
- staged deployment.

## 8. Preparation record

- Read-only data audit: `vtt-react/verification/p12/defense_data_audit.py` (results outside Git).
- Decision brief, revision 3.

## 9. Specification review record (before code)

One bounded independent review of §2.6 was done on 2026-10-16.

**Verdict:** PASS WITH REQUIRED CHANGES. No widening of client authority was found.

**Resolved in revision 3a:**
1. **Size:** the `chosenResult` size limit and field bounds made consistent; duplicate face text
   removed.
2. **HP arithmetic:** the exact P9 damage calculation, so a lethal hit is valid.
3. **Flat DR:** the same integer 1–1000 test on client and server; matched by `recordId || id`.
4. **Shared approval IDs:** the strike receipt filter and the cross-registry ID refusal; P9's
   cross-match documented.
5. **Owner-reported fields:** labelled as such; the unarmed rule stated.
6. **Registration:** the pending re-check after the await, target binding and strike error codes.
7. **Close path:** the binder-specific close; no `closed` event on consumption.
8. **Ambiguities resolved:**
   - miss handling and the required proficiency roll;
   - the canonical `notApplied` order;
   - a non-null ruling;
   - the damage-type guard;
   - the type guard before the prefix check;
   - the table recorded as owner-reported.
9. **Receipt budget** stated, including the existing live-only P7 limit.
10. **Receipt privacy:** only defense categories are recorded.
11. **Closed IDs:** the limit is per room, with the at-limit behaviour stated.
12. **Roll outcome:** `rollOutcome` names the weapon-roll outcome; the result is the final amount.
