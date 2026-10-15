# Original P9 — Supported single-target spell consequences

**FROZEN V1 before production implementation, 2026-10-15.** Authority is original
Project 9 only (`MYTHRILL_NEXT_PHASE.md:1138–1186`, §15, §17, H8/H9), the frozen P7
contract (F1–F6, C1–C6; C2 named payment adapter and C3 temporary pools are resolved
below by the approved creator rules in the takeover brief) and accepted P8. Implementation
evidence and independent acceptance are separate. No commit, push or deployment.

## Verified starting position

- Checkout `D:/VTT`, branch `master`, HEAD `dd445bec3a295f2a1d1aad8ec0b77e1d2f5e3334`
  (the reviewed P8 identity `8ee079fa…` plus a concurrent commit of the P8 work and
  presentation edits). All 11 principal P8 SHA256s in the accepted report, the frozen P8
  contract and the P8 report match current bytes; server source is unchanged since
  `8ee079fa`. Three concurrent presentation edits (landing page, landing CSS, library
  filters) are preserved and are not P9 inputs. No P8 re-audit was performed.
- No P9 contract existed. The approved creator rules this freeze relies on: bare
  attribute = score, `<attr>_modifier`/`<attr>mod` = modifier, temporary AP/mana counted
  and spent first, cooldowns start from accepted receipts, reserve-never-pre-spend, one
  P7 command per consequence group (two actors at most).

## F9.1 — supported set (positively validated, otherwise manual with a diagnostic)

The original definition is the raw entry in `CLASS_DATA_MAP[casterClass].spells` with the
exact spell ID. Slot copies, `useCharacterSpells` aliases, Arcanoneer formulation cards,
library/custom spells and weapon actions are never compiled into support; they stay
manual and say why. A spell is supported only when all of these hold:

- `spellType: ACTION`, `typeConfig.castTimeType: IMMEDIATE`, `targetingConfig.targetingType:
  single` (`maxTargets` absent or 1); no propagation/AoE/trigger/channel/duration (except
  `durationConfig: {durationType: 'instant'}`), mechanics, effects or special-mechanics keys.
- `effectTypes` exactly `['damage']` with `damageConfig` (keys ⊆ formula, damageTypes,
  resolution, description, elementType; non-empty declared `damageTypes`) **or** exactly
  `['healing']` with `healingConfig` (keys ⊆ formula, healingType `direct`, hasHotEffect
  false, description, resolution). `resolution: DICE` in the config or at root. Crit,
  save, DOT/HOT, chain, auto-hit, secondary damage and other keys → manual.
- Explicit numeric `resourceCost.actionPoints`; mana from one consistent encoding;
  no HP cost; `useFormulas` empty. Cooldown is turn-based/real-time/none with a finite value.
- Formula (approved vocabulary): `NdM` terms (at least one), integers, a bare attribute
  (score), `<attr>_modifier`/`<attr>mod` (modifier = ⌊(score−10)/2⌋, the existing sheet
  convention), and `<attr>/K` with integer K>0. Attributes: strength, agility,
  constitution, intelligence, spirit, charisma. Refused tokens: int, str, agi, con, spi,
  cha, wis, dex, intellect. Multiplication, parentheses, percentages, other identifiers →
  manual. `resolveDynamicSpellFormula` output is never used (it reads `1d8 + intelligence/4`
  at INT 16 as 1d8+7; the approved reading is 1d8+4).
- **Decision for creator confirmation:** `<attr>/K` rounds **down**, following the class's
  own authored text ("Intelligence / 4, rounded down", Arcanoneer). If vetoed, non-integer
  quotients become manual; no other rule changes.
- Payer domain from the existing `getManagedSpellResourcePlan`, unchanged:
  `none` (no class component), `elementalSpheres` and `musicalNotes` (bank contract),
  `devotionGauge` (Martyr ledger). Typed duplicate encodings that disagree (e.g.
  `arc_arcane_missile` spheres `[Arcane, ember]` vs `arcane_sphere`/`holy_sphere`) → manual.
  An explicit pitch/sphere recipe taking precedence over a generic count summary is the
  existing bank contract and is preserved. Generic class keys other than type/cost/gain
  (e.g. `resolvesCadence`) → manual. Pyrofiend, Apex, Lunarch, Toxicologist, Chronarch,
  Gambit, Shaper, Spellguard, Inquisitor, Berserker, Harbinger, Crusader, Augur, Revenant,
  Animist, False Prophet, Plaguebringer and Warden payments stay manual: no revisioned room
  home exists for them in P9. Their existing local paths, latches and receipts are untouched.

Current authored spells meeting F9.1 (computed from source, not hand-picked): Marrow-Piercing
Slug `arc_spark_bolt` (spheres), Restorative Prayer `martyr_restorative_prayer` (devotion),
Opening Chord `minstrel_opening_chord` and Harmonic Strike `minstrel_harmonic_strike`
(notes). The adapter, not this list, decides; the list is reported for review.

## F9.2 — authoritative revisioned class home (brief items 1–2)

- Home: `maps[mapId].characterTokens[tokenId].state.classPayment = {version:1, domain,
  value}` on the bound **primary** PC attachment, revisioned by that actor's existing
  `actorContract.revision` (one increment per accepted command). Server-owned: protected
  from every legacy envelope, moved to recovery on untrusted import, absent from public
  token projection. The owner reads it through the existing owner-private recovery read.
- Typed values (no other fields): spheres `{type:'elementalSpheres', spheres:[≤12 canonical]}`;
  notes `{type:'musicalNotes', notes:[7 integers 0–5]}`; devotion `{type:'devotionGauge',
  current, max:6, damage, earnedLevels, spentLevels, bonusLevels}` with the ledger identity.
- Owner sync: a single-actor P7 entry `classPayment:{mode:'sync', before, after}` (before =
  current home or null) lets the **owner only** publish their own sheet value, parity with
  today's owner class edits. Refused while an approval for that actor is pending.
- Fence: while an approval is pending for an owner+character, legacy
  `character_resource_updated` class writes for that player are refused before mutation or
  relay (`class_payment_pending`), as is owner sync.

## F9.3 — owner approval, GM adjudication, one P7 command

1. Owner (verified UID = source `ownerUid`, primary attachment, matching active sheet)
   selects an exact bound target on the same map, then records **one** roll (digital, or
   physical faces). Changing target before approval clears the roll. The owner approves
   `ApprovalV1 {approvalId, actionEpoch, source, target, spell{definitionId, definitionHash,
   name, kind, damageTypes}, roll{mode, dice[{sides,faces}], constant, total, reading},
   price{ap, mana}, classPayment{domain, before, after, price}|null}` via `actor_spell_approve`.
2. Server validates strict shape, ownership, exact refs, typed class values, price
   conservation (sphere/note list arithmetic; devotion closed-form ledger), `before` equal to
   the current home, temp-inclusive affordability and roll totals, then holds a bounded
   in-memory approval (≤32/room, one per source actor). GM sessions receive a privacy
   projection (class values reduced to public fields). Same ID/same bytes is idempotent
   (accepted receipt, pending, or `outcome_unknown` after a runtime change); changed bytes
   conflict.
3. GM explicitly adjudicates legality/range/defense/mitigation and enters a finite
   nonnegative integer final amount (reason required when it differs from the roll). The GM
   client prepares one strict P7 command: source entry (temp-first AP/mana finals;
   `classPayment:{mode:'spell', domain, approvalHash}`; self-heal HP on the same entry),
   target entry (temp-HP-first damage, or healing capped at max with temp unchanged), exact
   refs/revisions, P7 adjudication scalars, and top-level `approval:{approvalId, contentHash}`.
4. Server binding (economic validation): GM; approval pending with that hash; owner still a
   room member and token owner; same source/target/definition/roll; exact temp-first
   source finals from **current** pools; exact target arithmetic; class home still equal to
   approved `before`, else `owner_reapproval_required` (price/typed result changed) and the
   owner is notified. Revision bumps and temp/ordinary split changes need no owner
   re-approval; the GM re-prepares explicitly (no automatic rebase). Installation is the
   existing P7 all-or-none admission; the approval is consumed in the same synchronous step.
5. Receipt authorization `{kind:'owner-approval-gm', authorizerUid, proposalId:approvalId,
   approvalHash}` and public `classPayment:{domain, public}`. Results, chat and cooldowns derive
   from accepted receipts only. Owner may withdraw before acceptance; GM may decline. Only a
   server-confirmed withdrawal/decline/refusal may say no payment was recorded.

## F9.4 — producers, custody, reconciliation

- HUD `ActionBar.jsx` (spell slots), sheet `SpellActionBar.jsx` (spell slots and equipment
  weapon actions) and `ArcanoneerResourceBar.jsx` route a supported spell in a shared room to
  the P9 panel and never pre-spend it, start its cooldown or emit an empty-target notice.
  Unsupported spells keep their existing manual path; `SpellCastConfirmation` shows the
  diagnostic in shared rooms. Offline/no-room play is unchanged.
- Bounded latest approval per owner+room is retained in a classified scoped family; retries
  and reload/rejoin check the same approval bytes and roll. No reroll or new approval is
  created automatically.
- Matching owner only (UID, canonical character, room attachment, account generation):
  common pools via P7 reconciliation; class value from the approved `after` (or the
  owner-private home when custody is absent). A personal class value edited during the
  pending window is preserved as a recovery candidate before replacement.
- Mitigation and resistances (object/numeric/name variants) are shown as advisory and are
  explicitly manual: the GM final amount is the supported seam.

## Frozen witnesses (mandatory)

| ID | Required production-path observation |
|---|---|
| S1 | Adapter over all authored class spells; supported list and precise manual diagnostics; Slug, Prayer, Opening Chord/Harmonic Strike; Arcane Missile conflict, Pyrofiend, crit/save/AoE/DOT manual. |
| S2 | Formula vocabulary: Slug at INT 16 → 1d8+4; Prayer spirit score; modifier tokens; refused abbreviations/multiplication; never the dynamic evaluator. |
| S3 | Real server: owner approval → GM adjudication → one receipt; source AP/mana temp-first, class home before/after, target HP; damage and heal; self-heal single actor. |
| S4 | Spheres exact recipe and Minstrel exact pitches; Martyr spent ledger (spend then gain restores spent first); Pyrofiend peak/latch unaffected (manual). |
| S5 | Re-approval on class change; no re-approval for revision bump or split change; stale GM command refuses without mutation. |
| S6 | Legacy class write fenced while pending; owner sync refused while pending; non-owner sync/approval refused; foreign target/owner, wrong map, unbound, NaN refuse. |
| S7 | Duplicate approval/command/ACK loss: one roll, one payment, one receipt; withdraw/decline truthful; outcome_unknown after runtime change. |
| S8 | Mounted HUD and sheet producers: supported spell opens P9 panel with zero local spend/cooldown/empty-target emit; unsupported keeps manual diagnostic; cooldown starts only on receipt. |
| S9 | Matching owner reconciliation of pools and class value; other owners/sheets untouched; checkpoint encode/decode retains home + receipt. |

Fixtures may replace provider/owner documents/lease backend/cloud transport. Real socket
registration, authority, P7 staging/CAS/admission, writer and receipt consumers execute.
Human tabletop, two-device, live backend, full-App build and deployment remain outstanding.

## Rollback

Set `P9_SPELL_EXECUTION=false` in `services/spellConsequence.js`: producers return to the
manual path; accepted homes/receipts stay readable. Never refund or replay accepted casts.

## Repair erratum — independent BLOCK B1/B2, 2026-10-15

F9.1–F9.4 stand. The independent review demonstrated two gaps in how an approval is consumed;
the single bounded repair closes them without new rules:

- **B1.** An owner approval (and any `classPayment` entry) is refused on `actor_propose`, and
  approval binding requires the GM's own direct `actor_consequence` (`approval_requires_gm` on
  the adjudication route). The approval is consumed only there and the receipt names the GM.
- **B2.** `ApprovalV1` carries `baseCommitSequence` from the snapshot it was prepared against.
  Registration requires `replayFloor ≤ baseCommitSequence ≤ commitSequence`, so an approval whose
  receipt could have been pruned is `retry_window_expired` (unknown), never registered again.
  Consumed, withdrawn, declined and re-approval IDs are remembered for the whole runtime (never
  evicted; new approvals refuse at 4,096 closures). A new runtime has a new epoch, so older
  approvals are `outcome_unknown` there. Only a refusal of an approval's first submission may say
  "no payment was recorded"; a refused re-check (or `approval_consumed`/`retry_window_expired`)
  is shown as unresolved and the owner explicitly marks it reconciled with the GM. A GM
  "check same command" refusal is never shown as "nothing was applied".
- Non-blocking: the legacy room mirror takes the class home only from the command that changed it;
  a missing class resource is a manual diagnostic; without device custody the prior sheet class
  value is preserved as a recovery candidate before replacement.
