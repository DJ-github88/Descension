# P12B — first creator decision batch (blocking and equipment wear)

2026-10-16 · preparation only · **nothing in this file is approved, and nothing here authorizes P12B.**
It narrows the full brief [MYTHRILL_P12_CREATOR_DECISIONS.md](MYTHRILL_P12_CREATOR_DECISIONS.md)
(revision 3) to the smallest set that lets blocking and wear be built. Wear storage draft:
[MYTHRILL_P12B_EQUIPMENT_WEAR_EXTENSION_DRAFT.md](MYTHRILL_P12B_EQUIPMENT_WEAR_EXTENSION_DRAFT.md).

## Already approved or published (not asked again)

- No AC, Armor score or hidden rating.
- Favored blocking piece plus ordered backups, or "Don't block", set on your own turn. "If it can't
  block, your first available backup does." (Laws › Defense)
- Equipment DR die and rare flat DR are separate. Flat DR never wears.
- Wear reads the natural face: armor on 1–2, shield on 1, one die size; below d4 the piece breaks.
  Broken pieces are unequipped automatically and can't be re-equipped until mended to d4.
- Defend (1 AP, own turn) doubles the blocking roll and prevents wear until your next turn.
- Critical hits go around **armor**: no DR roll, no wear.
- Riposte ignores flat DR and Defend's extra. Piercing criticals lower flat DR only.
- Laws › Durability & Repair: "The durability die IS your defense die."
- Published open list: *criticals against shields, Raise Shield wear, DR against non-physical damage,
  and the order of resistances and DR.*

## The first batch (four decisions, in dependency order)

### 1 · D-E — Which die does a blocking piece roll and wear?

- **Open.** Three sources disagree: the item's own `durability`/`maxDurability`, the Laws category
  table (Cloth d4 … Plate d10), and the wizard quality table (common d6 … artifact d20). In 42 of 84
  armor/shield pieces, the listed die differs from both tables.
- **Example.** Weathered Hide lists d8; both tables say d6. Hit for 6 → on d8: absorbs up to 8, wears
  on 1–2 (25%). On d6: up to 6, wears 33% of the time.
- **Recommendation (not approved).** The item's **current** die (`durability`, or `maxDurability` while
  unworn) is both the roll and the wear track. The two tables become authoring guidance. No item
  changes. It steps down the existing ladder `d20 → d12 → d10 → d8 → d6 → d4 → broken`. A piece without a
  ladder die (legacy number, object, missing) cannot be declared; it stays GM-manual.
- **Why first.** It is the only decision the wear record itself depends on. Any other answer means
  the rolled die and the worn die are different values, and the wear record would need both.

### 2 · D-C — Does equipment DR reduce non-physical damage?

- **Open.** Physical = smashing, slicing, stabbing. Others: ember, rime, storm, blight, sacred, wyrd, arcane …
- **Example.** 8 ember hits Ilsa (favored vest d10). Roll the d10 (and risk wear), or not?
- **Recommendation (not approved).** Equipment DR applies to physical damage only. Non-physical:
  no block roll and no wear. Authored resistances and flat DR (per its card) still apply.
- **Until decided.** For non-physical hits the panel asks the GM "Does the block apply?". If yes, roll
  and wear go through the same record. The wear storage is unaffected either way.

### 3 · D-B (subtraction part only) — Order of equipment DR, flat DR and resistance tiers

- **Open.** The Damage Modifiers sequence has no place for either subtraction.
- **Example.** 10 slicing. Ilsa rolls 3 on her d10 vest, has flat DR 3 (Aegis Ward) and is Resistant.
  - Subtractions first: 10 − 3 − 3 = 4 → **2**.
  - Tier first: 10 → 5 → 5 − 3 − 3 → **0**.
- **Recommendation (not approved).** Order:
  1. equipment DR face (doubled if Defending);
  2. flat DR;
  3. tiers with Laws rounding;
  4. never below 0.
- **Not affected.** Wear depends only on the natural face, so no order changes wear.
- **Until decided.** With no tier for that damage type, the two subtractions commute and are
  automated. With a tier as well, the GM rules the final amount (exactly as 12A does).
- **Kept separate.** Conversion (see below) is not part of this decision.

### 4 · D-D — Do criticals bypass shields?

- **Open.** Criticals bypass armor (approved). Shields are not covered.
- **Example.** A goblin's d6 crits 6, 3, +1 = 10 against Ilsa's favored d8 buckler.
  - Shield rolls: she rolls d8, and a natural 1 wears it.
  - Bypass: she takes 10.
- **Recommendation (not approved).** On a critical, a favored shield still rolls and wears only on a
  natural 1, while armor stays bypassed. A bypassed armor piece does **not** hand off to a backup
  shield, because backups replace only a piece that can't block (broken or no longer in its slot).
- **Until decided.** Favored armor + critical → no roll, no wear (approved, automated). Favored shield +
  critical → the GM chooses "shield rolls" or "no block". If it rolls, wear follows the face.
- **Carried manual item.** Flat DR on a critical stays a GM ruling, as in 12A.

## Separately identified — not in this batch

| Decision | Interim handling in 12B | Touches wear? |
|---|---|---|
| **D-F1** Evasion cap/stacking | GM declares hit/miss when the defender has Evasion; single-die natural 1 still misses | No: blocking starts only after a declared hit |
| **D-F2** Evasion vs formula attacks (72% of creature attacks) | Option (vi): GM declares hit/miss, with a visible prompt, never a silent immunity | No |
| **D-B conversion** (attacker heals from "damage dealt"; defender-side healing tiers) | GM applies separately; recorded as not applied | No: it changes creature HP, never the block or wear |
| **Raise Shield wear** (Laws open) | Reaction, P13 | Later only |
| D-A, D-I, D-J (creature resistance data), D-G (obsolete text), D-H (creature Defend) | 12A-side creature defenses | No |

## What can proceed without waiting for every combat question

- **Now, with no decision:** the wear-extension contract text (public declaration, owner sync, block
  approval, typed wear entry, receipt, owner-device reconciliation). Freezing it needs HQ, not the creator.
- **After D-E alone:** a usable thin 12B slice — a physical, non-critical creature attack (GM declares
  the hit) → owner block roll → HP + wear in one receipt. Every other branch is a visible GM ruling.
- **D-C, D-B order and D-D:** each only turns one GM-ruled branch into automation. None changes the
  wear record's shape.
- **Evasion and conversion** sit before (hit/miss) or beside (attacker healing) the block step. They
  never block wear.
