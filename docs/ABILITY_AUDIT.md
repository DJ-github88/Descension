# Mythrill Ability & Spell Audit

Assessment of whether existing spells properly fit each class's fantasy and philosophy, using the formatting standards from `SPELL_DATA_REFERENCE.md` and the design mandate from `CLASS_AUDIT_STANDARDS.md`.

---

## Critical Issues (Class-Breaking)

### 1. Animist — Zero Functional Spells

**The Problem**: The Animist's `spellPools` object (lines 251-303 of `animistData.js`) contains ONLY string references to spells from deleted source classes:
- `primalist_*` (14+ references)
- `witch_doctor_*` (14+ references)
- `inscriptor_*` (13+ references)

These source files were deleted during Phase 1 consolidation. The spell definitions DO NOT EXIST anywhere in the codebase. The Animist is effectively a class with a character sheet, resource system, and specializations — but NO abilities to cast.

**Confirmed by**: `SPELL_DATA_REFERENCE.md` Section 8 states: *"implemented: false — class has no spells; gated out of selection."*

**Impact**: Animist cannot be played. It needs ~30-50 original spells created from scratch, themed around Ancestral Resonance, totems, specters, and runic inscription — NOT just re-referencing old class spell IDs.

**Fix Priority**: P0 — highest priority in the entire roster.

---

### 2. Augur — Worst Grimdark Violator

**The Problem**: The `CLASS_AUDIT_STANDARDS.md` explicitly mandates toning down visceral horror. The Augur is the single worst offender, with spell names that read like a horror anatomical chart:

| Current Spell Name | Standard Violated |
|---|---|
| Read the Guts | "AVOID: raw bone-snapping, muscle-flaying" |
| Gore-Sown Foresight | Excessive gore terminology |
| Arterial Curse | Anatomical horror |
| Splintered Bone Portent | "AVOID: bone-snapping" |
| Lance of Fractured Marrow | "AVOID: bone marrow collapse" |
| Flayed Eyes Gaze | "AVOID: flaying" |
| Ruinous Flaying Hex | "AVOID: flaying" (literally in the name) |
| Fleshy Consecration | Anatomical |
| Congealed Aegis | Visceral |
| Gore-Mist Tempests | Excessive gore |
| Agonizing Sanctuary | "AVOID: agony, grotesque torture" |
| Bleeding Altar of Grace | "AVOID: internal bleeding" |
| Splitting of the Flesh | "AVOID: flaying, lacerating" |

**The Standards Say**: Replace with "kinetic sweep," "steely riposte," "intense focus," "physical endurance." The Augur should feel like a scholar of fate who reads signs in blood — NOT a butcher.

**Fix**: Rename and reflavor every grimdark spell. Keep the haruspex (divination through entrails) CONCEPT but express it through focused, intense, scholarly language. Examples:
- "Read the Guts" → "Read the Omen" or "Haruspex's Reading"
- "Lance of Fractured Marrow" → "Lance of Bitter Truth" or "Omen Lance"
- "Flayed Eyes Gaze" → "Inner Sight" or "The Unblinking Eye"
- "Ruinous Flaying Hex" → "Ruinous Fate Hex"
- "Gore-Sown Foresight" → "Blood-Read Foresight"

**Fix Priority**: P1 — high priority, affects the entire class's tone.

---

### 3. Warden — Excessive Flaying/Flesh Language

**The Problem**: Similar to Augur. The Warden's fantasy is "iron-chain penitent tracker" but the spell names lean heavily into flaying and flesh-mutilation:

| Current Spell Name | Issue |
|---|---|
| Flayed Jailer Plate | "AVOID: flaying" |
| Flesh Tether | Anatomical |
| Flayed Stalker | "AVOID: flaying" |
| Flayed Leap | "AVOID: flaying" |
| Lacerating Ambush | "AVOID: lacerating" |
| Flayed Shadow Assault | "AVOID: flaying" |
| Flayed Ascendancy | "AVOID: flaying" |
| Brutal Whipping | "AVOID: grotesque torture" |
| Penitent Judgment | Acceptable (religious connotation, not anatomical) |
| Iron Gaol | Good — fits the jailer theme |
| Cruel Tracker | Good — fits the tracker theme |

**Fix**: Replace "flayed" with "iron," "chain," "shadow," or "penitent." The Warden's pain should come from the CHAINS and IRON, not from skin removal.
- "Flayed Stalker" → "Iron Stalker" or "Chain Stalker"
- "Flayed Leap" → "Chain Leap" or "Iron Pounce"
- "Flesh Tether" → "Chain Tether" or "Iron Bond"
- "Lacerating Ambush" → "Crushing Ambush" or "Iron Ambush"

**Fix Priority**: P1.

---

## Systemic Issues (Affects Multiple Classes)

### 4. Declared-But-Unmodeled Resources

Four classes declare a secondary resource in their `resourceSystem` lore but NO spell in their file actually costs or generates it:

| Class | Phantom Resource | Impact |
|---|---|---|
| Chronarch | Temporal Strain | Every spell references Time Shards but never Strain. The "risk" dimension of chronomancy doesn't exist mechanically. |
| Gambit | Karmic Debt | Fortune Points are modeled, but Debt (the "cost" of fate manipulation) is pure flavor. No spell generates or spends it. |
| Revenant | Phylactery HP Pool | Declared as a kill-charged resurrection battery, but no spell interacts with it. |
| Toxicologist | Contraption Parts | Declared as a resource for the Gadgeteer spec, but no spell costs Contraption Parts — only Toxin Vials are modeled. |

**Fix**: Either model these resources in spells (add `classResource` costs/gains), or remove them from the `resourceSystem` documentation to stop misleading players.

**Fix Priority**: P2 — players reading the class sheet see these resources but they do nothing.

---

### 5. Spell Storage Format Inconsistency

Classes use three different formats to store spells, making any cross-class tooling unreliable:

| Format | Classes |
|---|---|
| `spells: [...]` (inline array) | Apex, False Prophet, Inquisitor, Lunarch, Toxicologist, Warden |
| `spellPools: { 1: [...], 2: [...] }` (level-keyed ID arrays) | Animist, Arcanoneer, Augur, Berserker, Chronarch, Gambit, Harbinger, Martyr, Minstrel, Plaguebringer, Pyrofiend, Revenant, Shaper, Spellguard |
| `exampleSpells: [...]` (inline, labeled as examples) | Revenant (uses both spellPools AND exampleSpells) |

**Impact**: The `spellPools` format references spell IDs that MUST be defined elsewhere. For most classes this works (spells are defined inline earlier in the file). For Animist, it's broken (references deleted files).

**Fix Priority**: P3 — standardize when convenient, not urgent unless tooling breaks.

---

### 6. Shaper — Severely Undertooled

**The Problem**: `shaperData.js` is 244 lines total — the smallest class file in the roster by far (next smallest is Animist at 304). It has approximately 12 spells across levels 1-10. Most classes have 25-100+ spells.

**Impact**: Shaper players have very few level-up choices. The "pick one spell per level" economy breaks down when there are only 1-2 options per level.

**Fix**: Add ~15-20 more Shaper spells, focused on the 6 Shaping Forms (Ataxic Flow, Arterial Strike, Centrifugal Fury, Deadened Bastion, Void Predator, and one more). Each form needs at least 3-4 dedicated spells.

**Fix Priority**: P1 — the class is playable but severely limited.

---

## Thematic Fit Assessment (Per Class)

### Classes With Strong Thematic Fit (No Issues)

| Class | Assessment |
|---|---|
| **Berserker** | Excellent. Pain Is Fuel, Blood-Heat escalation, self-damage tradeoffs — every spell reinforces the rage fantasy. |
| **Pyrofiend** | Excellent. Inferno Veil, Scathrach's demon, ember escalation — the fire/demon pact is consistent throughout. |
| **Plaguebringer** | Strong. Garden/cultivation metaphor, five-category system, Virulence escalation — thematically tight. |
| **False Prophet** | Strong. Madness/void preaching, sermon/rite/congregation language — fits the false-god fantasy well. |
| **Inquisitor** | Strong. Cold iron, bound demons, Authority, witch hunting — consistent throughout. |
| **Harbinger** | Strong. Prophecy, Mayhem, doom escalation — coherent chaos/doomsayer theme. |
| **Toxicologist** | Strong. Vials, contraptions, poisons, sabotage — three distinct spec flavors. |
| **Martyr** | Good. Devotion, sacrifice, healing-through-suffering. "Suffering" passive name is repeated 4x (once per spec) but thematically appropriate. |
| **Lunarch** | Good. Parasite/moon/phase-shift theme is consistent. "Parasitic Bond" repeated 4x (shared passive). |
| **Chronarch** | Good. Time manipulation, temporal friction, rewind/stasis/displacement — clean. |
| **Minstrel** | Good. Musical notes, cadences, performance language — fits the bard fantasy. |
| **Gambit** | Good. Fortune, cards, dice, debt — consistent gambler/fate-weaver theme. |
| **Arcanoneer** | Good. Spheres, combos, matrix, recipes — strong tinker/elemental-engineer identity. |
| **Apex** | Good. Glaive, quarry marks, companion, stealth — clean hunter identity. |

### Classes Needing Thematic Work

| Class | Issue | Priority |
|---|---|---|
| **Animist** | No spells exist. All spell pools are phantom references. Needs full spell suite. | P0 |
| **Augur** | Excessive grimdark/visceral language. 12+ spell names violate tone standards. | P1 |
| **Warden** | Excessive flaying/flesh language. 8+ spell names violate tone standards. | P1 |
| **Shaper** | Severely undertooled. ~12 spells total, needs ~15-20 more. | P1 |
| **Revenant** | Phylactery resource is phantom (declared but no spell uses it). | P2 |
| **Spellguard** | Thin spell count. Functional but could use more variety per spec. | P3 |

---

## Spell Reference Documentation Gap

### `divine` Damage Type Missing from Valid Schools List

`SPELL_DATA_REFERENCE.md` Section 2, Rule 3 lists valid school IDs as:
> `physical, ember, rime, storm, arcane, primal, blight, wyrd`

But `damageTypes.js` defines **9 types** including `divine`. The `LEGACY_TYPE_MAP` maps `holy` and `radiant` to `divine`. 

**Impact**: Any spell using `school: 'divine'` may not be recognized by tools that validate against the 8-type list from the spell reference.

**Fix**: Update `SPELL_DATA_REFERENCE.md` to include `divine` in the valid schools list.

---

## Recommended Action Order

1. **P0 — Animist spell creation**: Write 30-50 original Animist spells themed around Ancestral Resonance, totems, specters, and runes. This is the only class that is literally unplayable.

2. **P1a — Augur grimdark cleanup**: Rename and reflavor all visceral spell names to match the kinetic/high-exertion mandate. ~12-15 spells need renaming.

3. **P1b — Warden grimdark cleanup**: Replace "flayed/flesh/lacerating" with "iron/chain/crushing." ~8 spells need renaming.

4. **P1c — Shaper spell expansion**: Add 15-20 new spells across the 6 Shaping Forms.

5. **P2 — Model phantom resources**: Add `classResource` costs/gains for Temporal Strain (Chronarch), Karmic Debt (Gambit), Contraption Parts (Toxicologist), and Phylactery (Revenant) in their spells.

6. **P3 — Update spell reference doc**: Add `divine` to valid school IDs list.
