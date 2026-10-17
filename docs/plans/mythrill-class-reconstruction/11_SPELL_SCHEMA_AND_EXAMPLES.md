# Spell schema and example-authoring contract

**Active seven-candidate review specification:** [R1 canonical envelope/closed opcodes](29_PRIORITY_REVIEW_RULES_AND_SERIALIZATION.md), [42 complete proposed records](evidence/headq-seven-abilities.json) and [authoring-to-execution admission](implementation/CR-A1-AUTHORED-SPELL-ADMISSION.md). New fields are explicitly proposed extensions, preserved separately from current validation/admission claims.

## Current authored envelope

**AUTHORED:** current class spells use `id`, `name`, `description`, `level`, `spellType`, `typeConfig`, `targetingConfig`, `resourceCost`, `effectTypes` and effect-specific configs, plus per-class dedicated fields. Full examples are retained in `evidence/authored-spells.json`. `docs/SPELL_DATA_REFERENCE.md` is an authoring reference, not proof of authoritative support; it still needs full reconciliation against the current normalizer and consumers.

**CONFIRMED:** the P9 support whitelist is narrower (`services/spellConsequence.js:130–181`). It requires immediate ACTION, single target, exactly damage or direct healing, DICE resolution, supported formula and payment encoding. Adding an unrecognized top-level class operation makes a spell manual under P9; that guard is valuable and must remain.

## Proposed example format

Keep the existing spell envelope and any new typed resource program explicitly separate in planning artifacts until CR1 approves the extension. For each representative example supply:

- stable proposed ID reserved against current and historical IDs;
- base/tree ownership and unlock level;
- complete AP/mana, components and exact class operation;
- category/effects and exact damage expression/types where applicable;
- exact target slots, kinds, restrictions, range and area (or explicit none);
- duration, expiry, check semantics, conditions, reaction window and cooldown;
- player description matching operations without executing prose;
- talent/heritage modifications with bounded paired costs;
- runtime dependencies and manual fallback;
- positive, refusal, duplicate and reopen witnesses.

Do not label a structured proposed spell “validated current schema” until it passes the actual authoring validators and save/reopen checks. Do not hide the important mechanic in mechanicsText: that text teaches the operation, but is not an executor.

## Numerical balancing defaults

Any AP/mana/damage amounts in proposed dossiers are **playtest tuning**, not new universal Prism rules. Retain current cap 10, one pick per level and 5 talent points per level only after confirming the current level/talent consumers. Proposals may reserve a baseline feature outside the pick pool, but must state the choice economy and not grant every library option automatically.

## Remaining examples

The current extraction contains1,026 authored records. The seven priority classes now have42 independently structured R1 representatives and21 signatures. All other candidates, complete restored libraries and final implemented schema/compiler validation remain open. Names/prose alone do not satisfy a structured example, and parsing review JSON is not application execution proof.
