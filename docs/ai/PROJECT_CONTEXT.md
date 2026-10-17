# Project context

**Mythrill** is a tabletop RPG (the Prism rules) and a browser VTT that plays it. React/Zustand client (`vtt-react/`), Socket.IO server (`server/`), Firebase for auth, Firestore, Storage and Functions.

## Tabletop principle

Every supported feature must produce the same choices and outcomes with the VTT removed (roadmap §18). Bookkeeping can be fast and rich; the rule must still be explainable from a printed card. The VTT never decides GM intent, uncertain defense or line-of-effect, social meaning, canon, or creature tactics.

## Franchise vs canon

- Current world facts: [`docs/CORE_LORE_FRAMEWORK.md`](../CORE_LORE_FRAMEWORK.md). Ancestry/class targets: [`LORE_CANON_AND_HERITAGE_BLUEPRINT.md`](../../LORE_CANON_AND_HERITAGE_BLUEPRINT.md).
- Older lore docs and audits are evidence of prior versions, not competing canon. Attributed in-world claims (rumor, doctrine, a predator's boast) may contradict author truth if labelled.
- Custom worlds and user content are never overwritten by canon edits.

## Rules sources

- Player Laws: `vtt-react/public/data/rules.json` (served with `DATA_VERSIONS.rules`); lexicon: `public/data/lore.json`.
- First-table baseline constants: `vtt-react/src/data/firstTableRules.js` (4 AP per PC turn, heritage AP set aside, strike 2 AP, Defend 1 AP, elixirs 0 AP, tracker default Restore to Maximum).
- Creator-approved combat decisions and open items: `docs/laws-drafts/MYTHRILL_COMBAT_LAWS_PLAYER_DRAFT_20261015.md` and the rev3 proposal. Only approved lines are published.

## Supported vs manual (as of P10)

| Automated end to end | Played by hand (GM enters the result) |
|---|---|
| Branvig's Feather Slash (P8): GM target, one roll, GM-confirmed final amount, one P7 commit | Every other creature ability and spell, with a diagnostic |
| Supported spells (P9): Marrow-Piercing Slug, Restorative Prayer, Opening Chord, Harmonic Strike | Defense: blocking piece, DR roll, Defend, wear, Evasion |
| Turn order and AP refill in the tracker | Reactions (no timer yet), elixirs, per-turn conditions in shared rooms |

## Design principles (short)

- Class resources are distinct economies; a common tracker library does not mean common gameplay.
- Prefer one owning value referenced by summaries over duplicated literals.
- Visuals and audio never change eligibility, timing, result or information entitlement.
