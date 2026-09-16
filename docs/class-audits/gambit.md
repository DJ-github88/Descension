# Gambit — Deep Dive

- Date: 2026-09-14
- Auditor: Phase 2 C3 cluster (spell-floor + talent audit, validated)
- Status: **implemented — awaiting Daniel review**

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | 3 | The Wagering Architect / Merrowport House: probability treated as an instrument, a wager, and a weapon. Compelling maritime and gambling lore (founders Jax and Lyra, Harbor-Master Merr-Cael's solvent middle odds) |
| 2 | Group function & exclusive utility | 3 | Real-time d20 roll manipulation and card-drawn overrides: nudging rolls, stealing luck, bluffing attacks, forcing competitive wagers (Death Roll), and restructuring party action economy |
| 3 | Resource loop design | 3 | Dual-currency gamble: Fortune Points (spend to tilt odds, suffer self-damage on bankruptcy) vs Karmic Debt (overflow triggers Wyrd Collapse). The archetypal proactive wager system |
| 4 | Spell-curve quality | 3 | 58 authored spells; 0 pool-floor gaps across all levels 1–10 (L1: 12\|7, L2: 7\|7, L3: 4\|2, L4: 4\|3, L5: 5\|5, L6: 6\|4, L7: 5\|4, L8: 5\|4, L9: 6\|3, L10: 5\|5) |
| 5 | Utility identity per level | 3 | At least 2 to 7 non-damage options at every level: cheats, card manipulation, poker faces, sleight-of-hand tricks, and tactical deck-cutting |
| 6 | Combat decision density | 3 | Maximum decision density: every d20 roll presents a wager decision, risk calculation, and debt management puzzle |
| 7 | Talent-tree integration | 3 | Three complete 50-pt trees; 0 validator errors, 0 warnings; all icons localized; 0 free-cast ACTIVE talents |
| 8 | UI expression | 3 | Custom Fortune & Karmic Debt UI with dice and card motifs; live card deck integration |
| 9 | Anti-overlap distance | 3 | C3 probability cluster: Gambit is *the hand that cheats fate* (proactive card overrides, high-stakes wagers, bankruptcy risk); cleanly separated from Augur's *ledger that records fate* |
| 10 | Beginner legibility | 2 | Dual resource bankruptcy rules and probability math demand attentive tactical play |
| | **Total** | **28/30** | Exceeds charter target (>= 24/30) |

## 2. Utility Ledger row

- Primary / secondary role: Damage / Control (Probability & Wagers)
- Exclusive territory: **proactive d20 overrides, card deck mechanics & competitive wagers** — spending Fortune and taking on Karmic Debt to directly rewrite rolls and force high-stakes duels
- Conflicts to resolve: C3 probability cluster (Augur overlap), card-system element domains (`cardSystem.js`)
- Resolution: keep; emphasize the active wager, sleight of hand, and karmic debt over Augur's sacrificial entrail-reading

## 3. Findings

### Talent trees
- All three trees (`gambit.js`) are valid 50-pt trees under the v2 validator.
- 0 validator warnings, 0 invalid trees.
- Free-cast sweep completed: all active talents carry appropriate Fortune or mana costs.
- All talent icons verified local assets.

### Spellbook
- 58 total spells in `gambitData.js`.
- Cleaned pick pools: unslotted 4 weakness passives from L1 (`gambler_calculated_risk`, `gambler_house_edge`, `fate_weaver_deck_exhaustion`, `fate_weaver_fates_wrath`) and 2 from L3 (`gambler_busted`, `fate_weaver_empty_hand`).
- Authored 1 new L3 active spell: [`gambler_cut_the_deck`](file:///d:/VTT/vtt-react/src/data/classes/gambitData.js) (*Cut the Deck* — tactical AP drain and party drift).
- Pool map: L1 (12\|7), L2 (7\|7), L3 (4\|2), L4 (4\|3), L5 (5\|5), L6 (6\|4), L7 (5\|4), L8 (5\|4), L9 (6\|3), L10 (5\|5).
- 0 pool-floor gaps, 0 warnings.

### Resource / data
- Card-suit domains review item: open decision on `cardSystem.js` element domains (`water`, `earth`, `air` in deck mechanics) pending consolidation.

## 4. Change list

| Item | Action | Rationale | Status |
|---|---|---|---|
| L1 & L3 passives in pools | unslotted 6 weakness passives | Clean pick pool standards | done |
| L3 active option | authored `gambler_cut_the_deck` | Maintain floor >=4 options after passive removal | done |
| Free-cast ACTIVE talents | costed with Fortune/mana | Resource loop integrity | done |
| C3 ledger-vs-wager prose | sharpen vs Augur | Anti-overlap clarity | queued |
| Card-suit domain audit | decide canonical alignment in `cardSystem.js` | Damage type review item | queued |

## 5. Evidence

- `node scripts/audit-classes.mjs --class Gambit`: 0 integrity errors, 0 pool-floor gaps, 0 warnings.
- `node vtt-react/src/utils/talentTreeValidator.mjs --file gambit`: 3 valid / 0 invalid, 0 warnings.
- `npm run audit:damage-types`: 0 non-canonical errors.
- `npm run audit:spell-variety`: 0 upgrade traps.

## 6. Mind memory

- `gambit-deep-dive-2026-09-14`, `class-deep-dive-policies-2026-09-13`

### Pass 4 — 2026-09-16 (verbosity trim)

52 descriptions over 200 chars rewritten to ≤200, preserving every mechanic, number, and the class voice. Full global spell-card QA is now **0 errors / 0 warnings** across all 21 classes (1,026 spells).
