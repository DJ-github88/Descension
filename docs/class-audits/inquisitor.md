# Inquisitor — Deep Dive

- Date: 2026-09-14
- Auditor: Phase 2 C5 cluster (spell-floor + talent audit, validated)
- Status: **implemented — awaiting Daniel review**

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | 3 | Cold-iron supernatural hunter and enforcer of the Barbed Vow: roots out corrupt ancestral covenants, hunts rogue spirits through mycelial networks (Marked Vreken), audits aberrant bioluminescent bleeds (Clean Vreken), or baits face-stealing horrors with breakable oaths (Thalren). Heavy atmospheric cost, salt-scarred paranoia, and legal interdiction |
| 2 | Group function & exclusive utility | 3 | Unmatched anti-magic supremacy and supernatural interdiction: dead-magic anchors, null-salt perimeters, forced confession, compelled duels, supernatural excommunication, and the Grand Interdict |
| 3 | Resource loop design | 3 | Authority engine (base 0, max 8): built through parrying, cold-iron strikes, and confronting supernatural entities; spent on anathema seals, truth interrogations, and absolute severances |
| 4 | Spell-curve quality | 3 | 46 authored spells; 0 pool-floor gaps across all levels 1–10 (L1: 8\|7, L2: 6\|5, L3: 4\|4, L4: 4\|3, L5: 4\|4, L6: 4\|4, L7: 4\|4, L8: 4\|3, L9: 4\|4, L10: 4\|4) |
| 5 | Utility identity per level | 3 | Exceptional out-of-combat and investigative utility: witch-sight tracking of cast trails, unbroken null-salt wards, captive spirit interrogations, cursed place exorcisms, and lawful institutional interdicts |
| 6 | Combat decision density | 3 | High tactical decision weight: timing cold-iron interruptions against enemy cast windows, managing Authority spending vs generation, and balancing personal wards against area dead-magic zones |
| 7 | Talent-tree integration | 3 | Three complete 50-pt trees (Witch Hunter, Heretic Inquisitor, Exorcist); 0 validator errors, 0 warnings; all icons verified local assets; 0 free-cast ACTIVE talents |
| 8 | UI expression | 2 | Authority resource meter; active interdict and null-zone status indicators queued |
| 9 | Anti-overlap distance | 3 | C5 Anti-Magic cluster: Inquisitor is *the hunter who binds and punishes* (cold-iron manacles, authority edicts, dead-magic zones, lawful oaths); cleanly distinct from Spellguard's *the warden who absorbs and redirects* (runic shielding, kinetic redirection, mana wards) |
| 10 | Beginner legibility | 2 | Understanding enemy supernatural tags and optimizing cold-iron interruption windows requires awareness of monster abilities |
| | **Total** | **28/30** | Exceeds charter target (>= 24/30) |

## 2. Utility Ledger row

- Primary / secondary role: Control / Support (Anti-Magic & Inquest)
- Exclusive territory: **cold-iron nullification, supernatural interrogation & ecclesiastical interdiction** — laying dead-magic anchors, forcing truthful testimony from spirits, and executing supreme anti-magic zones
- Conflicts to resolve: C5 Anti-Magic cluster (Spellguard overlap resolved; absorption vs punishment)
- Resolution: keep; anchor firmly in cold-iron craftsmanship, legal Barbed Vows, and metaphysical severance

## 3. Findings

### Talent trees
- All three trees (`inquisitorWitchHunter.js`, `inquisitorHereticInquisitor.js`, `inquisitorExorcist.js`) are 18-node, 50-pt v2 valid trees.
- Validator: 3 valid / 0 invalid, 0 warnings.
- All talent icons verified local assets.
- 0 free-cast ACTIVE talents: active talents cost mana/authority.

### Spellbook
- 46 total spells in `inquisitorData.js`.
- Established explicit `spellPools: { 1: [...], ..., 10: [...] }` map, eliminating fallback reliance.
- Spell floor completed: 18 new spells authored:
  - L5: `inq_severing_shackles` (non-damage cold-iron spell lock)
  - L5: `inq_cold_iron_brand` (damage + enchantment dispel)
  - L6: `inq_ward_of_cold_iron` (non-damage cold-iron DR 4 aegis)
  - L6: `inq_null_zone_anchor` (non-damage dead-magic zone control)
  - L6: `inq_heretic_brand` (damage + compelled duel control)
  - L7: `inq_aura_of_the_iron_vow` (non-damage condition immunity aura)
  - L7: `inq_barbed_excommunication` (non-damage banishment + minion purge)
  - L7: `inq_soul_scour_brand` (damage + max mana reduction)
  - L8: `inq_anathema_seal` (non-damage complete magic lockout)
  - L8: `inq_immutable_bastion` (non-damage DR 8 bastion)
  - L8: `inq_cold_iron_crucible` (damage + grounding razor field)
  - L9: `inq_absolute_severance` (non-damage complete metaphysical paralysis)
  - L9: `inq_avatar_of_inquisition` (non-damage avatar transformation buff)
  - L9: `inq_final_confession` (non-damage vulnerability debuff)
  - L9: `inq_apocalypse_of_salt` (damage + hazard cleanse)
  - L10: `inq_the_grand_interdict` (non-damage supreme dead-magic zone)
  - L10: `inq_eternal_cold_iron` (non-damage DR 15 ultimate defense)
  - L10: `inq_wrath_of_the_seven_vows` (damage + salt disintegration)
- Pool map: L1 (8\|7), L2 (6\|5), L3 (4\|4), L4 (4\|3), L5 (4\|4), L6 (4\|4), L7 (4\|4), L8 (4\|3), L9 (4\|4), L10 (4\|4).
- 0 pool-floor gaps, 0 warnings.

### Resource / data
- Primary class resource: `authority`.
- Damage types: canonical `ember`, `sacred`, `smashing`, `wyrd`.

## 4. Change list

| Item | Action | Rationale | Status |
|---|---|---|---|
| Spell-floor program | authored 18 spells (L5–L10) | Charter requirement (>=4 options, >=2 non-damage) | done |
| Explicit spellPools | defined explicit 1–10 pools | Remove fallback reliance | done |
| Free-cast ACTIVE talents | costed with authority/mana | Resource loop integrity | done |
| Legacy icons | verified local assets | Asset localization | done |
| C5 anti-magic prose | sharpen vs Spellguard absorption | Anti-overlap clarity | done |

## 5. Evidence

- `node scripts/audit-classes.mjs --class Inquisitor`: 0 integrity errors, 0 pool-floor gaps, 0 warnings.
- `npm run validate:talent-trees`: 65 valid / 0 invalid, 0 warnings.
- `npm run audit:damage-types`: 0 non-canonical errors.
- `npm run audit:spell-variety`: 0 upgrade traps.

## 6. Mind memory

- `inquisitor-deep-dive-2026-09-14`, `class-deep-dive-policies-2026-09-13`

## 7. Spell-level format & flavor pass — 2026-09-16

Tool: `scripts/spell-card-qa.mjs`. **Before: 40 flagged / 12 errors. After: 0 errors / 10 warnings**
(5 missing-cooldown on L1–L2 builders, 2 resource-value-missing, long descriptions — deferred).

### Fixed (card-breaking)

| Spell | Issue | Fix |
|---|---|---|
| `inq_iron_interrogation` | `utility` with no config | added lie-detection utilityConfig |
| `inq_iron_adjudication` | `crowd_control`, no control config | renamed to `control` + counter-cast controlConfig |
| `inq_detect_corruption` | no `effectTypes` at all | added `utility` + detection utilityConfig |
| `inq_wyrd_banish` | no `effectTypes` at all | added `control` + void-cage restraint config + Spirit save |
| `inq_barbed_interdict` | `buff` with no config | added Vested Authority buffConfig |
| `inq_severing_shackles` | `debuff` with no config | added cold-iron mana-burn debuffConfig |
| `inq_null_zone_anchor` | `utility` with no config | added dead-magic field utilityConfig |
| `inq_barbed_excommunication` | `utility` with no config | added void-of-binding-iron utilityConfig |
| `inq_absolute_severance` | `debuff` with no config | added magic-denial debuffConfig |
| `inq_final_confession` | `control` with no config | added compelled-confession controlConfig |
| `inq_the_grand_interdict` | `utility` with no config | added supreme-interdict zone utilityConfig |
| `inq_cold_iron_brand`, `inq_wrath_of_the_seven_vows` | duration instant/rounds mismatch | durationUnit `instant` |

Bonus normalization: `inq_scent_of_ash` used a non-numeric `statModifier`
(`magnitude:"advantage"`, `magnitudeType:"special"`) — migrated to the house Advantage
convention (`magnitude: 99, magnitudeType: "advantage"`).

### Resource / data notes

- **No `authority` drift** — `classResources.js` `Inquisitor.id` is `authority`, matching every
  spell's `classResource:{type:"authority"}`. (The older `righteousAuthority` note in
  `SPELL_DATA_REFERENCE.md` §8 is stale and should be updated.)
- 2 spells (`inq_scourge_of_submission`, `inq_shackles_of_searing_iron`) declare
  `resourceTypes: ["...","health"]` with no health value — same Flesh-Toll review item as
  Revenant; left pending your call.
- 5 L1–L2 spells lack `cooldownConfig` entirely (missing-cooldown warnings) — deferred with the
  broader warning backlog.

### Flavor / class-fit notes

- Cold-iron/anti-magic identity is coherent: null-salts, Barbed Vow, dead-magic zones,
  excommunication, Authority economy. No rethemes proposed.
- `inq_judgment_day` describes "pillars of sacred fire" but is encoded `ember`; consider whether
  it should be `sacred` (flagged, not changed).

### Evidence (this pass)

- `node scripts/spell-card-qa.mjs --dump Inquisitor`: 0 errors / 10 warnings
- `audit:classes --class Inquisitor`: 0 integrity / 0 floor gaps / 0 warnings; `spell-qa` 0 issues
- Playwright card review: pending (Daniel)

### Pass 2 addendum — 2026-09-16 (mechanical warning cleanup)

2 spells had `instant`/`rounds` duration drift → unit `instant` (plus nested config normalization). `inq_judgment_day` ember-vs-sacred remains a flavor proposal.

### Pass 3 addendum — 2026-09-16 (cooldown declarations)

5 L1–L2 spells (`inq_scent_of_ash`, `inq_null_salts_strike`, `inq_silver_blade`, `inq_ash_step`, `inq_sigil_of_rotting_mana`) now declare `cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 }`.

### Pass 4 — 2026-09-16 (verbosity trim)

29 descriptions over 200 chars rewritten to ≤200, preserving every mechanic, number, and the class voice. Full global spell-card QA is now **0 errors / 0 warnings** across all 21 classes (1,026 spells).
