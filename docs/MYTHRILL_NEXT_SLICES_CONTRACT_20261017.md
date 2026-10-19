# Next slices after P12B — proposed contracts (awaiting HQ approval)

**Latest 2026-10-19:** **P13B-W collection delivered**, bounded independent source/final delta review
accepted and integrated Build3/App4 verified. [Exact handoff/limits](MYTHRILL_PROJECT_13B_CONTRACT.md#11-w-implementation-and-integrated-handoff--2026-10-19).
No reaction payment/reservation/roll/effect execution; GM manual resolution remains explicit. Proposed
E1a original Riposte AP/HP execution needs its own contract/go-ahead. Older blanket W-preparation-only
status below is superseded; B2 acceptance remains unchanged and was not rerun.

**Latest 2026-10-18:** creator approved G1/G3/G3a/G5, froze/authorized **B2 §8.1 only**, and that
Radiant Burst circle/channel subset is implemented, independently source-reviewed and final build3/
App7 verified. [B2 §15](MYTHRILL_PROJECT_12C_B2_CONTRACT.md#15-first-slice-implementation-and-verification--2026-10-18)
has exact evidence/limits. Wider B2, obstruction enforcement, P13B execution and area execution remain conditional;
earlier blanket preparation-only statements here do not reopen the completed subset.

2026-10-17 · **Status (2026-10-18): P12B-r1, P13A and P12C-B1 authorized by HQ, frozen as
[P12 rev 5 §3.9](MYTHRILL_PROJECT_12_CONTRACT.md), [P13A](MYTHRILL_PROJECT_13A_CONTRACT.md) and
[P12C-B1](MYTHRILL_PROJECT_12C_B1_CONTRACT.md) with HQ's amendments, implemented and reviewed. Those
frozen contracts win where they differ from this proposal. P12C-B2, P13B and area execution remain
preparation only.** Checkout `D:/VTT`
(uncommitted P12A/P12B work preserved). Builds on: [ENGINEERING_STATE.md](ENGINEERING_STATE.md),
[MYTHRILL_P11_P14_ROADMAP.md](MYTHRILL_P11_P14_ROADMAP.md) (§11 records the allocation below),
[MYTHRILL_PROJECT_12_CONTRACT.md](MYTHRILL_PROJECT_12_CONTRACT.md) rev 4,
[MYTHRILL_PROJECT_12B_IMPLEMENTATION.md](MYTHRILL_PROJECT_12B_IMPLEMENTATION.md).
Approved decisions are not reopened (C1/D-E and everything confirmed earlier). No AC, no
numerical homogenization, no generic resource scalar.

**Preparation continuation, 2026-10-18 (actual checkout HEAD `8ba81efbf935e08d4fcd488a9b597f5eb8031b0f`):**
[P12C-B2 conditional draft](MYTHRILL_PROJECT_12C_B2_CONTRACT.md),
[P13B conditional draft with cases A–D](MYTHRILL_PROJECT_13B_CONTRACT.md) and the existing
[creator packet, now rev2](MYTHRILL_DECISIONS_AREA_AND_REACTIONS_BATCH1.md) are complete as preparation.
No implementation or new creator decision is approved. These drafts replace the B2 sketch and earlier
reaction suggestions as the current preparation objects. Shared dependencies/owners are in
[coordination](MYTHRILL_CROSS_TRACK_COORDINATION.md); current class handoff33 parks A1b. The original
proposal/research below is retained history: its “approve to implement” asks for the three completed
slices and its proposed defaults are not new pending assignments or approvals.

**Creator addition incorporated:** [B2 §9–§13](MYTHRILL_PROJECT_12C_B2_CONTRACT.md#9-targeting-and-propagation-coverage-matrix)
contains the bounded all-type coverage matrix, per-mode propagation gaps, save-path findings/examples
and recommended sequence. Selection/delivery/propagation/application are distinct. B2 remains static
preview; actual reaction moments require P13B, multi-recipient effects P14, persistent/delayed/linked
recipients named lifecycle follow-ons. No expansion of the implementation authorization.

## 0. Boundary for approval

| Order | Slice | Delivers | Blocked by an unresolved rule? | Ask |
|---|---|---|---|---|
| 1 | **P12B-r1** | Recorded rolls survive the same-creature stale offer; no free rerolls | No (S1 has a safe default) | **Approve to implement** |
| 2 | **P13A** | Accepted-result narration and calm floating combat text | No (consumes receipts only) | **Approve to implement** |
| 3 | **P12C-B1** | Map targeting for the existing single-target controllers | No (advisory range, GM adjudicates as today) | **Approve to implement** |
| — | P12C-B2 | Authored area-template preview, visibly manual | Explicit geometry policies/manual subset in the B2 draft | **Conditional draft prepared; not frozen** |
| — | P13B | Reaction windows and chains | Policy/card/payment/privacy boundaries in the P13B draft | **Conditional draft prepared; not frozen** |
| — | P14 | Area/multi-target consequences | G1–G5, D14-3, P7 N-actor question | Later |

One slice at a time, each with its own bounded independent review. All three approved slices are
independent of the open defense and reaction decisions (C2–C5, D-A…D-J except D-E, D13-x).
They are sequenced, not parallel, because P13A and P12C-B1 both touch the token components and the
action-result path.

## 1. P12B stale-offer limitation (inspected) and repair P12B-r1

### 1.1 What happens today

- The offer's attack carries `sourceRevision` (the creature's revision at offer time) inside its hash
  (`server/services/blockApprovals.js` `validateAttack`, `addOffer`).
- At consumption, `bindCommand` fails with `stale_attack` when the creature's revision has moved
  (`blockApprovals.js:303–305`), and also requires `command.actors[0].expectedRevision ===
  sourceRevision` (`:309`).
- The handler treats `stale_attack` as unconsumable and **closes the approval**
  (`server/handlers/actorConsequenceHandlers.js:6`, `:236–238`). The recorded block face is
  discarded.

**Example.** Branvig makes two attacks on Ilse. Both are offered. Ilse rolls a 2 on her chest piece
for the first; the GM applies it (Branvig's AP is spent, so its revision moves). Ilse rolls a 1 for
the second. The GM's command fails `stale_attack`; the approval closes; the only path is a re-offer
and a **new block roll**. Ilse gets a free reroll of a bad face, and if the GM re-rolls the attack
dice for the re-offer, so does Branvig. The same happens if anything else touches Branvig between
offer and resolution (for example a P12A strike against it).

### 1.2 Two adjacent seams that also discard a recorded roll

- **Piece leaves its slot while a block roll is pending.** `firstAvailable`/`checkPiece` then fail
  (`no_blocking_piece` / `stale_blocking_state`), the handler closes the approval as
  `owner_reapproval_required` or `invalidated`, and the owner can roll again (`:236–238`). An owner
  who sees a bad face can trigger this by unequipping. Observed in source; not exercised by a witness.
- **Before approval (P12A and P9 panels).** Changing the target clears the recorded roll
  (`WeaponStrikePanel.jsx:67`, `SpellConsequencePanel.jsx:73`), and reopening the dialog does too
  (`:46`, `:43`), so a digital roll can be redone before sending. This is fixed in P12C-B1 (§3.4),
  because map targeting drives exactly this seam.

### 1.3 Repair rules (P12B-r1)

| # | Rule |
|---|---|
| R1 | A recorded attack roll (in the offer) and a recorded block face (in the approval) are never discarded by a revision change. They end only by consumption, owner withdrawal, or an explicit GM **void** (§R5). No path issues a new roll for the same offer. |
| R2 | **Explained change: carry forward.** If every P7 receipt that touched the creature since `attack.sourceRevision` is a consumed `p12b-block:v1` command from **this creature** (sibling attacks that only spent its AP), and the ledger chain is contiguous (nothing pruned), consumption proceeds. The command's creature `expectedRevision` is the **current** revision (normal P7 CAS); AP is recomputed temp-first from current pools. If the creature can no longer pay, `insufficient_resources`: the approval **stays pending** and the GM must void or adjust by hand. |
| R3 | **Unexplained change: revalidate.** Anything else (HP change, condition change, another capability's receipt, pruned history) fails `attack_revalidation_required` without closing the approval. The GM panel lists the public changes since the offer (HP/AP/condition before → now, from receipts). The GM either confirms **"Recorded rolls still stand"** (reason required; recorded in the public receipt as `revalidation {fromRevision, toRevision, reason}`) or voids. |
| R4 | **Piece unavailable after the roll** (S1 default). The approval stays pending and fails `block_piece_unavailable` with the recorded face and piece shown to the GM. The GM voids the block and resolves HP through the existing direct GM consequence. No new block roll for that offer. |
| R5 | **Void** = the existing `actor_block_decline`, relabelled "Void attack — nothing applied", which already closes the approval **and** removes the offer. The owner and GM see the recorded faces in the closure message. |
| R6 | Unchanged: declaration CAS, one pending block per character, critical-vs-armor refusal, ID-space guards, retry → same receipt, `approval_consumed` on reuse. |

Schema impact: `chosenResult` gains one optional key `revalidation` inside the `p12b-block:v1`
capability (contract revision 5 §3.4). No P7 field, pool, receipt shape or checkpoint codec changes.

### 1.4 Acceptance (adds to B1–B14)

| ID | Check |
|---|---|
| B15 | Two offers from one creature to one PC: both block faces kept; both consumed; AP spent twice; two receipts |
| B16 | Same creature, two PCs: second consumption carries forward |
| B17 | A P12A strike hits the creature between offer and consumption → `attack_revalidation_required`, approval still pending → GM confirms with reason → receipt records `revalidation` |
| B18 | GM void → nothing applied, offer closed, no new roll possible for that `commandId` |
| B19 | Creature cannot afford the second attack → refused, approval pending, nothing spent |
| B20 | Pruned ledger between offer and consumption → revalidation required, never silent carry-forward |
| B21 | Unequip during a pending block → `block_piece_unavailable`; owner cannot re-roll that offer |
| B22 | Retry/duplicate → original receipt; App smoke repeats the P12B path plus B15 and B18 |

**Files.** `server/services/blockApprovals.js`, `server/handlers/actorConsequenceHandlers.js`
(remove `stale_attack` and the piece-unavailable codes from the close-on-failure path),
`vtt-react/src/services/blockingService.js`, `components/hud/BlockingPanel.jsx`, P12B server and
client tests. No other module.

## 2. P13A — accepted-result narration and floating combat text

### 2.1 What exists

- `components/combat/FloatingCombatText.jsx`: a fixed-position, screen-pixel "fountain" (random arc,
  scale 1.4, rotation, glow, neon `#ff4444`/`#44ff44`), driven through `window.showFloatingCombatText`.
  Its only callers (`multiplayer/socketHandlers/characterHandlers.js:77`, `:156`) are disabled with
  *"Scrolling combat text removed per user request to eliminate wild animations"*. The manager is
  mounted in `App.jsx:883` and `multiplayer/GameSurface.jsx:201` (whether both mount on one route
  was not checked; a shared `window` global would make that fragile).
- `components/combat-narration-preview/`: unmounted presenter with an accepted-only outcome rule,
  public-field whitelist, queue of one current plus four waiting, session history, `aria-live`,
  reduced-motion handling and normal-flow placement.
- Calm palette rules (`components/hud/calmBarPalette.js`): no glows, danger in brick, never neon.
  HUD semantics (`HudStatBar.css`): HP red, mana blue, AP amber.
- Receipt seam: `services/actorConsequenceService.js` `applyAcceptedConsequence` applies every
  accepted P7 receipt. **Public receipts carry only after-values** (`actorConsequences.js`
  `publicReceipt`), not before-values or deltas.

### 2.2 Where the numbers come from (no P7 change)

For each receipt actor, P13A reads the client's own projection **immediately before** the receipt is
applied. Only when that projection's actor revision equals the receipt's `beforeRevision` does it
compute the applied change:

- HP: `Δcurrent = before.current − after.current`, `Δtemp = before.temp − after.temp`.
- Mana and AP likewise. Class resources are not floated (opaque per-class homes; no common scalar).
- Equipment wear: the receipt's public `equipmentWear` line (`beforeDie → afterDie`, broken).

Any other case (revision gap, missing token, readOnly receipt) shows **no number**. This uses actual
applied values: a 15-damage final amount on a 5-HP creature floats "−5 HP". Raw rolls, proposed
amounts and pending approvals never float. A later server-side `applied` delta in the receipt would
need its own P7 contract; it is not proposed.

### 2.3 Live versus historical

A float is shown only when all hold:
1. the receipt arrived through the live `actor_consequence_accepted` broadcast or the submitter's own
   command acknowledgement, while the room is connected and hydrated;
2. its `commitSequence` is above the high-water mark recorded at the last hydration;
3. the exact-revision rule above produced a number;
4. its `roomId:commandId:actorRef` key has not floated before (bounded in-memory set of 256 keys).

Snapshot hydration, reconnect, reload, "Check same command/strike/roll" recoveries and catch-up
receipts update state silently and add history lines, never animations. The ack and broadcast of
the same receipt float once (rule 4, and rule 3 fails on the second delivery anyway).

### 2.4 What appears

| Change | Float (text, never colour alone) | Ink on parchment chip | Contrast on `#f8f5ee` |
|---|---|---|---|
| Damage | `−9 HP` with a drop glyph | `#a32a1f` (HUD HP) | 6.6:1 |
| Temp HP absorbed | `3 absorbed` with a hatched-shield glyph, beside the HP chip | `#68533e` (muted) | 6.7:1 |
| Healing | `+6 HP` with a leaf glyph | `#3f6b3a` (GOOD) | 5.7:1 |
| Mana / AP spent (F1) | `−4 mana` · `−2 AP`, smaller, on the actor that paid | `#34588f` · `#6e4f10` | 6.6:1 · 6.9:1 |
| Armor/shield wear (F1) | `Chest d8 → d6`; `Chest broken` | ink `#34251a`; broken `#8b3a2a` | 13.5:1 · 7.1:1 |
| Miss (P12A receipt says miss) | `Miss` | ink | 13.5:1 |

The AP HUD amber `#b0841f` fails text contrast (3.1:1), so the darker AP stop is used.

**Presentation.**
- One chip group per receipt actor, rendered **inside each token's own render tree**, so hidden
  tokens (`hiddenFromPlayers`), fog/FOV-invisible tokens and other maps never show floats, and
  zoom/pan follow automatically. Text is counter-scaled to stay 12–20 px on screen.
- Calm motion: rise about 24 px and fade over 1.8 s. No arc, rotation, scale pop or glow. With
  `prefers-reduced-motion`, no movement: a static chip fades after 2.5 s.
- Placed above the token's top edge, never over the token centre, selection ring or targeting
  controls; `pointer-events: none`. At most three groups per token stack upward; older groups beyond
  three collapse into a `+N` chip.
- Floats are `aria-hidden`. The narration line announces the same accepted result once through the
  presenter's `aria-live="polite"` region.
- The legacy fountain is retired. The disabled `characterHandlers` calls stay disabled.

### 2.5 Narration adapter

- Mount the existing presenter in a reserved HUD slot that does not overlap the action bar, HUD
  panels or targeting controls (desktop and narrow).
- Feed only accepted receipts as `{phase: 'outcome', accepted: true}` with a new ID per receipt.
  Text comes from the existing builders (`acceptedText`, `acceptedBlockText`, and the P8/P9 receipt
  parsers). An unknown capability gets a neutral line built from the applied deltas only
  ("Branvig: HP −5"). No arithmetic or breakdown that the receipt does not contain.
- **Three surfaces stay distinct:** floats (seconds, at the token), the narration banner (one
  sentence, session history in memory), and the existing chat/combat log (the persistent record,
  posted exactly as today; P13A adds no second chat line).
- Historical receipts (§2.3) go to narration history only, never to the banner queue (a
  history-only action is a small addition to the existing queue reducer).

### 2.6 Acceptance

| ID | Check |
|---|---|
| A1 | P12A hit: "−N HP" on the creature equals its HP drop; AP chip on the attacker; one narration line |
| A2 | Temp HP split: "−4 HP" and "3 absorbed" match the before/after values |
| A3 | Overkill: final amount above remaining HP floats the actual drop |
| A4 | P9 heal floats "+N HP"; P8 and P12B (with wear chip) float correctly |
| A5 | Pending approval or proposal: nothing floats |
| A6 | Ack plus broadcast of one receipt: one float. Duplicate delivery: none |
| A7 | Reload, reconnect, hydration, explicit recovery: state correct, zero animations, history updated |
| A8 | Hidden creature and fogged token: no float for players; GM sees it. Other map: none |
| A9 | Five hits on one token within a second: readable stack, `+N`, nothing covers targeting controls |
| A10 | Reduced motion: no movement. Zoom out/in: text stays legible |
| A11 | Screen reader: one polite announcement per accepted result |
| A12 | App regressions: P8, P9, P12A, P12B paths unchanged; zero page errors |

**Files.** New `services/acceptedResultFeed.js` (pure: receipt + prior projection → float entries
and narration events) with tests; one capture/emit hook in `actorConsequenceService.js`
`applyAcceptedConsequence`; rewritten `components/combat/FloatingCombatText.jsx` (+ CSS) as a
token-anchored layer with a one-line mount in `CreatureToken.jsx` and `CharacterToken.jsx`; the
narration mount in the HUD. The narration preview modules are reused, not forked.

## 3. P12C — targeting follow-through

### 3.1 What exists

- `store/targetingStore.js`: local single/multiple/area selection state, no authority.
- P12A/P9 panels pick the target from a `<select>` of exact bound refs; P8's GM dialog picks one
  exact target. P9 and P8 already print an advisory range line (`advisoryRange`,
  `featherSlash.rangeDiagnostic`: "Advisory planar center distance … GM adjudication required").
- Authored ranges: P9's four spells (`rangeDistance` 60/30/60/5), Feather Slash (melee 10 ft), and
  the strike cards' generated `targetingConfig.rangeDistance` from `getWeaponRange` (code defaults
  such as bow 150, crossbow 120, unarmed 5; not item-authored, so shown as "card range").
- Area tool (`store/spellAoEStore.js`, `grid/SpellAoEOverlay.jsx`, `utils/AoETemplates.js`): a
  free-standing two-click template launched from the dice menu, with hand-picked shape/size, an
  origin clicked anywhere (not bound to the actor or the card's range), wall clipping through the
  placer's sight polygon, and token-**centre** membership. Its member count is computed over all
  map tokens with no `hiddenFromPlayers`/FOV filter, so a player's preview can count hidden
  creatures (observed in source, not browser-verified).
- `InfiniteGridSystem.calculateDistance` supports straight-line, 5-10-5 diagonal, hex and
  wall-path measurement. None is a confirmed Prism range rule.
- Authored area data at HEAD `8ea1abff`: `aoeShape` circle 286, cone 17, line 15, sphere 9,
  square 1; `aoeParameters` radius/length/angle/width; `rangeType` `self_centered` 265; line-of-sight
  flags under two spellings (`requiresLineOfSight` 50, `lineOfSightRequired` 33); `friendlyFire`
  authored once.

### 3.2 Three layers, kept separate

| Layer | Owner | P12C-B1 behaviour |
|---|---|---|
| Preview and selection | Client (targeting store, map overlay) | Crosshair, rings, aim line, highlights. Never authoritative |
| Authoritative validation | Server (exact refs, revisions, approvals) + the GM's explicit adjudication (range, legality, line of effect) | Unchanged. The GM summary shows advisory distance at approval and now |
| Consequence execution | One existing P7 command per supported controller | Unchanged |

A highlighted token is a candidate, not a valid target and not an applied result.

### 3.3 B1 scope (single target, existing controllers only)

- **Entry.** "Pick on map" in the open P12A Strike, P9 Spell or P8 Feather Slash panel. Esc,
  right-click or "Cancel" leaves targeting with the panel unchanged.
- **Crosshair cursor** while picking; the source token gets a source ring; the chosen target a
  target ring and its name in the panel.
- **Range ring** around the source with the action's card range, labelled "card range N ft —
  advisory". **Aim line** to the hovered token with "planar centre distance X ft" (the accepted P8
  convention). Beyond the ring: amber "outside card range — GM decides", still selectable.
- **Eligibility** comes only from the controller's existing candidate list (its exact-ref,
  binding, map and kind rules). Non-candidates show the panel's reason on hover ("not a bound
  creature", "other map", "your own token"). Hidden and fogged tokens are never candidates for a
  player.
- **Selection** writes the exact ref into the panel's existing field. Costs, counts, kinds and
  price approval are untouched: confirmation is still the panel's own Approve/Confirm button.
- **Revalidation at the GM.** The adjudication summary shows the advisory distance recorded at
  approval and the current one; "moved since approval" is flagged. Server CAS on revisions is as
  today.
- **Manual, visibly.** Area, cone, line, chain and multi-target cards show "Manual: the VTT does not
  resolve this action" and keep today's local path.

### 3.4 Roll retention (closes the §1.2 pre-approval seam)

- A recorded roll stays recorded when the target changes before approval; the roll does not
  depend on the target in any supported action.
- The recorded roll is retained in the controller's existing private custody family
  (`room.strikeConsequenceLatest`, P9's family) **at roll time**, so closing and reopening the panel,
  or reloading, shows the same roll instead of a fresh button.
- After approval, a target change means withdraw and re-approve with the **same** recorded roll
  (P9 already has "approve again (same roll)"). Rolls happen on the owner's device: the VTT keeps them
  and the GM sees withdrawals, but it cannot prove a determined player never cleared site data.
  Physical dice carry the same trust; this is stated, not hidden.

### 3.5 B2 (prepare only): authored area preview, still manual

**Continuation:** this original sketch is expanded and qualified by
[the complete B2 conditional draft](MYTHRILL_PROJECT_12C_B2_CONTRACT.md), including independent
boundary-contact/gridless/source-anchor questions, explicit dimensions, malformed-data/manual fallbacks,
visible-only output and identity changes. That draft wins over shorthand “inside”/range assertions here.
G1/G3/G4/G5 remain recommendations, not approved conventions; G2/G6 remain manual.

Shape and size from `aoeShape`/`aoeParameters`; origin bound to the source for `self_centered`,
placed within the card range for `ranged`; membership computed over the viewer's **visible** tokens
only; tokens shown as "inside" or "edge — GM decides"; nothing posted, rolled, spent or executed;
moving the template only redraws. It needs these decisions first (default until decided: show the
ambiguous state, assert nothing):

| # | Gap | Example |
|---|---|---|
| G1 | Range to the area's origin or its nearest edge | 20-ft-radius circle, card range 60: origin at 70 ft, edge at 50 ft |
| G2 | Do walls stop areas (today's tool clips by the placer's sight)? | A wall splits a 15-ft cone: are the creatures behind it caught? |
| G3 | Partial overlap | A Large creature with one square inside the circle |
| G4 | Friendly fire when `targetRestrictions` is empty | A circle on two enemies and one ally |
| G5 | Origin snapping | Free point, grid intersection or cell centre |
| G6 | Elevation | A flying creature above a circle (GM decides) |

### 3.6 Acceptance (B1)

| ID | Check |
|---|---|
| T1 | Pick on map selects the same exact ref as the dropdown; the approval bytes are identical |
| T2 | Crosshair, source ring and target ring appear and clear on Esc, right-click, cancel and send |
| T3 | Range ring equals the card range for each supported producer; outside-range is labelled, selectable, and flagged to the GM |
| T4 | Non-candidates are refused with the panel's reason; hidden/fogged tokens never highlight for players |
| T5 | Changing target, closing/reopening and reloading keep the recorded roll; no second roll button appears |
| T6 | Withdraw and re-approve after a target change reuses the recorded roll |
| T7 | Target moved after approval: GM summary shows both distances; nothing re-rolls or spends |
| T8 | Area/multi-target cards say Manual and keep today's path |
| T9 | Picking never spends AP/mana or creates a proposal |
| T10 | App regressions: P8, P9, P12A, P12B and the existing area tool unchanged |

**Files.** `store/targetingStore.js` (a pick-session field, excluded from its `persist`); a new `grid/TargetPickOverlay.jsx`
(+ CSS) mounted beside `SpellAoEOverlay` in `Grid.jsx`; the three panels (`WeaponStrikePanel.jsx`,
`SpellConsequencePanel.jsx`, the P8 dialog) for the button, roll retention and GM distance line;
their custody modules for the roll-time draft. No server change.

## 4. Decisions to make (new, small, player-facing)

Current compact questions/dependencies: [packet rev2](MYTHRILL_DECISIONS_AREA_AND_REACTIONS_BATCH1.md).
The original table below is retained proposal history; S1/F1 remain open and no default is adopted.

| # | For | Question | Default until decided |
|---|---|---|---|
| S1 | P12B-r1 | Ilse rolled a 1 to block, then unequipped her chest piece before the GM resolved. Should the attack resolve as **Don't block**, or does the GM decide each time? | GM decides; never a new roll |
| F1 | P13A | Besides HP, should floats show AP/mana spent and armor wear, or should those stay in the narration line only? | Show them, smaller than HP |
| G1–G6 | P12C-B2 only | §3.5 | Ambiguous state shown |

The P13A presentation (calm rise, parchment chip, no fountain) follows your earlier request to remove
wild combat-text animation; it is not a new question.

## 5. Evidence and limits of this preparation

- Read on the device: the ledger, roadmap, P12 contract rev 4, P12B report, the P12A/P12B/P9/P8 client
  and server sources cited above. Other cited files were read in a read-only clone of HEAD
  `8ea1abff` after checking that their device timestamps predate that commit.
- The device shell was unavailable in this session, so **no tests or witnesses were run**; every
  finding is source reading. Data counts come from HEAD and may differ slightly from the live tree.
- No production file was changed. No commit, push or deployment.

**2026-10-18 continuation evidence:** the live checkout and source owners were inspected directly in
`D:/VTT` for the two new conditional drafts; the earlier unavailable-shell/read-only-clone limitation
above applies only to the original preparation. Current source facts are in B2 §2–§3 and P13B §1–§4.
Retained closure reports were reused, not rerun. Documentation changes only; current HEAD and pre-existing
uncommitted changes are recorded in B2 §2 and ENGINEERING_STATE. No application implementation.
