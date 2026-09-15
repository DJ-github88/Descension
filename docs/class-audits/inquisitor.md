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
