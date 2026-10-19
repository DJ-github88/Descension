# P13A — Accepted-result narration and floating combat text (contract)

**FROZEN 2026-10-17** under HQ's authorization of the same day (proposal:
[MYTHRILL_NEXT_SLICES_CONTRACT_20261017.md](MYTHRILL_NEXT_SLICES_CONTRACT_20261017.md) §2, with HQ's amendments).
Client-only. No server, P7 receipt, checkpoint or capability change. No reaction windows.

## 1. Scope

- **Floating text: HP only.** Damage `−N HP`, healing `+N HP` and the temporary-HP part of the same change.
  AP, mana and armour wear are **not** floated in this slice; they appear in narration and history.
  F1 stays open: the entry model is a list of typed parts, so a later slice can enable more kinds.
- **Narration:** one sentence per accepted result in a compact banner, a session history and one polite
  screen-reader announcement, reusing `combat-narration-preview/narrationQueue.js`.
- The existing chat/combat-log lines of P8, P9, P12A and P12B stay the persistent record. Their text is
  unchanged when every actor is reportable; otherwise §4 applies to them too (neutral line or nothing).

## 2. Numbers: exact-revision guard

For each actor of an accepted receipt, the client reads its **own** projection immediately before the
receipt is applied. Only when that projection's actor revision equals the receipt's `beforeRevision`:
`ΔHP = after.current − before.current`, `Δtemp = after.temp − before.temp` (same for AP/mana in narration).
Any other case (gap, unknown token, read-only receipt, later snapshot) shows **no number**. Deltas are
never inferred from a snapshot or from `finalAmount`. A 15-point hit on a 5-HP creature reads `−5 HP`.

**Temporary HP wording.** `N absorbed` only when the accepted consequence establishes damage absorption:
the actor is the receipt's target of a supported damage capability whose server arithmetic applies damage
to temporary HP first (P12A hit/critical, P12B block, P8 Feather Slash, P9 `kind: damage`) and its temp
decreased. Otherwise neutral: `−N temp HP` / `+N temp HP`.

## 3. Live versus historical

Floats, banners and announcements happen only when all hold:
1. delivery is live: the `actor_consequence_accepted` broadcast, or a fresh admission acknowledgement
   (the server marks it with `delivery`); explicit recoveries ("check same …") and post-refresh retries are
   historical;
2. `commitSequence` is above the highest one this client has already presented for the room, live or
   as history (review 1 erratum: the per-room mark replaces the earlier `admission` hydration test,
   which suppressed every live result on clients that had not hydrated `admission`);
3. the exact-revision guard produced the number (floats) or the actor is otherwise reportable (narration);
4. the receipt key `roomId:commandId` was not published before (bounded set of 256).

Historical receipts update state and add a **history-only** entry (no banner, no announcement, no float).
Reload and reconnect hydrate from snapshots and publish nothing.

## 4. Visibility and privacy on every surface

An actor is reportable to a viewer when:
- the viewer is the current GM; or
- its token is currently rendered for the viewer (the float layer inside the token registers it while
  mounted; hidden-from-players, fog/FOV-hidden and other-map tokens do not render); or
- it is the viewer's own character.

- **Floats:** only on rendered tokens; never queued for later.
- **Banner, history, announcement:** built only from reportable actors. If every actor is reportable,
  the sentence may name the source, the target and the capability (weapon, ability, spell) and carry the
  existing public result text as details. If any actor is not reportable, the sentence lists only the
  reportable actors' own changes, with no capability, ability, source or other names, and no details.
  If none is reportable, nothing is published on any surface.
- Names come from the viewer's local token data, never from hidden tokens.

## 5. Presentation

- Float chip: parchment `#f8f5ee`, 1px rule border, 3px semantic left rule, sign + word + glyph
  (never colour alone): damage `#a32a1f` (6.6:1), healing `#3f6b3a` (5.7:1), temp/absorbed `#68533e` (6.7:1).
- Anchored above the token's top edge inside its render tree (follows pan/zoom; fixed 15px screen text),
  `pointer-events: none`, `aria-hidden`. At most three groups per token; more collapse into `+N`.
- Calm motion: rise ~24px and fade over 1.8s; no arc, rotation, scale pop or glow. Reduced motion: static,
  fades after 2.5s. The legacy fountain manager becomes inert (its callers were already disabled at the
  creator's request).
- Banner: compact, ink on parchment, dismissible, auto-advances at reading pace; history is a collapsible
  list. **Placement (review 3, recorded 2026-10-17):** an own fixed top-centre region (portal) so it never
  displaces the consequence/approval controls; it may sit over map tokens near the top edge, never over
  controls (the combat timeline stays above it).

## 6. Acceptance

| ID | Check |
|---|---|
| N1 | P12A hit floats the creature's actual HP drop; narration names weapon, attacker, target and AP |
| N2 | Temp split: `3 absorbed` for a supported damage target; neutral `−3 temp HP` for a GM direct change |
| N3 | Overkill floats the actual drop; healing floats `+N HP` |
| N4 | Pending approvals/proposals publish nothing |
| N5 | Ack + broadcast of one receipt: one float, one banner, one announcement |
| N6 | Reload, reconnect, explicit recovery: no float/banner/announcement; history-only entry for recoveries |
| N7 | Hidden or fogged creature: nothing about it on any surface for a player; a visible target's own change is reported without naming the hidden source; GM sees all |
| N8 | Revision gap: no number |
| N9 | Burst of five on one token: readable stack with `+N`; no overlap with controls |
| N10 | Reduced motion and zoom |
| N11 | P8, P9, P12A, P12B App regressions unchanged |
