# P12C-B1 — Integrated single-target picking (contract)

**FROZEN 2026-10-17** under HQ's authorization of the same day (proposal:
[MYTHRILL_NEXT_SLICES_CONTRACT_20261017.md](MYTHRILL_NEXT_SLICES_CONTRACT_20261017.md) §3, with HQ's amendments).
Client-only. No server, P7, approval schema or capability change. P12C-B2 (area preview), constrained
area placement and authoritative range/line-of-effect validation stay later roadmap requirements.

## 1. Map picking for the existing controllers

Controllers: P12A Strike (owner), P9 Spell (owner), P8 Feather Slash (GM).

- **Entry/exit.** "Pick on map" in the open panel. While picking, the panel steps aside (its modal is
  closed, its state kept); Esc, right-click or the overlay's Cancel returns to the panel unchanged.
- **Overlay** (`grid/TargetPickOverlay.jsx`, beside the area-template overlay): crosshair cursor; source
  ring; target ring on the hovered/selected candidate; **advisory range ring** at the card range; **aim
  line** from source to hovered token labelled "planar centre distance X ft" (the accepted P8 convention).
  Beyond the ring: "outside card range — GM decides", still selectable. Nothing is measured to edges,
  walls, elevation or grid diagonals; no rule is implied.
- **Candidates** are exactly the controller's existing candidate list (exact bound ref, room, map, kind
  rules). For a player, a token that is not currently rendered for them (hidden from players, fog/FOV,
  other map) is neither a candidate nor hit-testable, and nothing about it is shown. A rendered
  non-candidate shows the controller's reason and cannot be picked.
- **Selection** writes the exact ref into the panel's existing field. Costs, kinds, counts and the
  confirmation button are unchanged; picking never spends, rolls or creates a proposal.
- **Card range:** P9 and P8 use the authored `targetingConfig.rangeDistance`; P12A uses the strike card's
  generated range (`getWeaponRange`, a code default per weapon kind), labelled as such. Range is advisory;
  the GM adjudicates as today. The GM summaries show the **current** advisory distance (P8/P9 already did;
  P12A adds it). Approval-time distance is not recorded: approvals have exact schemas and no position field.

## 2. Roll retention (no free rerolls before approval)

- A recorded roll is never cleared by a target change.
- **Drafts** are retained in the controller's existing private custody family (`room.strikeConsequenceLatest`,
  `room.spellConsequenceLatest`; P8 already retains its roll in `room.featherSlashLatest`) at roll time, bound
  to `{uid, roomId, characterId, exact source attachment, action context}` where the action context is P12A
  `{actionId, slot, itemId, weaponType, weapon die}` and P9 `{spellId}`. Closing/reopening the panel and reload
  restore the same roll.
- A draft never moves to a different action: opening another action while a draft exists shows the
  retained roll and offers only "Use that action" (send from it) or an explicit **Discard recorded roll**;
  the discarded faces stay listed on the device (last five). Nothing is silently carried or dropped.
- After an owner withdraws an approval, its recorded rolls return as a draft for the same context, so a
  re-approval (for example after a target change) reuses them. A GM decline is final, as today.
- Rolls are made on the owner's device: the VTT keeps them and shows discards, but cannot prove a player
  never cleared site data; physical dice carry the same trust.

## 3. Manual actions in shared rooms spend nothing

When a shared-room action is not supported by P8/P9/P12A (the existing diagnostic is shown), the old local
cast path no longer spends AP, mana, class resources, cooldowns or HP. The confirmation says
"Manual — the VTT applies nothing" and its button posts a manual notice only; costs are paid with the
existing resource controls and the effect is resolved at the table. Outside shared rooms nothing changes.

## 4. Acceptance

| ID | Check |
|---|---|
| T1 | Pick on map selects the same exact ref as the dropdown; approval bytes are identical |
| T2 | Crosshair, rings and aim line appear and clear on Esc, right-click, cancel and pick |
| T3 | Range ring equals the card range per controller; outside-range is labelled and selectable |
| T4 | Non-candidates refuse with a reason; hidden/fogged tokens never highlight for players |
| T5 | Target change, close/reopen and reload keep the recorded roll; no second roll control appears |
| T6 | A draft for another action is shown, not reused; discard is explicit and listed |
| T7 | Withdraw then re-approve reuses the recorded roll |
| T8 | Picking never spends or proposes; P8/P9/P12A/P12B paths otherwise unchanged |
| T9 | A manual (unsupported) action in a shared room spends nothing and posts a notice |
