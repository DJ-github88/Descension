# Class Design Charter — Mythrill VTT

> **Status:** DRAFT for Daniel's review (2026-09-13)
> **Companions:** `docs/CLASS_AUDIT_STANDARDS.md` (class data schema), `docs/SPELL_DATA_REFERENCE.md` (spell schema), `docs/INDIVIDUAL_CLASS_AUDIT_PROMPT.md` (per-file workflow)
> **Mind:** `class-polish-pass-21-classes`, `class-system-audit-snapshot-2026-09-13`

---

## 0. Mission

Every one of the 21 classes must feel like a vanilla-WoW-class choice: a distinct fantasy, a distinct group function, a distinct resource loop, and distinct utility decisions from level 1 to 10. We reject homogenization. We kill darlings — mechanics, spells, names, specs — never classes. All 21 stay, and the weak ones (Berserker, Lunarch, Apex, Warden) get brought up to strength.

**Locked canon (unchanged):** level cap 10; exactly one spell pick per level; 5 talent points per level (50 max, one full tree or a hybrid); every talent is a real spell; 12 canonical damage types; durability-dice defense; 5 attributes. See `talent-system-v2-talents-are-spells` and `class-data-deep-dive-2026-07-28`.

---

## 1. The Eight Pillars

1. **One Fantasy, One Sentence.** Every class must own a pitch no other class can claim. If two classes can share the sentence, one of them is wrong.
2. **Exclusive Group Function.** Each class owns at least one group-facing utility verb that no other class can replicate (the vanilla "only mage portals / only warlock healthstones / only rogue lockpicking" rule). Tracked in the Utility Ledger (§2).
3. **Utility at Every Level.** Levels 1–10 each offer **≥4 spell options, ≥2 of them non-damage** (utility, control, defense, support). Utility must express the class fantasy, not generic filler. Class passives and weaknesses never occupy pick slots.
4. **Resource = Loop.** Every resource has explicit gain rules, spend rules, threshold states, and a failure state. Every spell either feeds, spends, or interacts with the resource — or is a deliberate, documented basic. If a spell ignores the bar, it must have a reason.
5. **Drawback Economy.** Risk buys spectacle. A drawback spell must be mathematically massive and visually spectacular, never a tax on fun. Avoid pure-downside picks.
6. **Asymmetric Niches, Real Taxes.** Classes may be the best in the game at their niche, but every strength carries a real, legible cost (fragility, no self-heal, brittle magic defense, disengagement decay). No class is strong everywhere.
7. **Kill Your Darlings.** Per spell/talent/spec, ask: *does this earn its slot, its complexity, and its name?* Cut, merge, retheme, or keep — never keep out of sentiment. Duplicated verbs across classes are resolved, not tolerated.
8. **Tooltip as Teacher.** The resource bar tooltip and menu must answer, in themed language: what this resource is, how you gain it, what it enables right now, what happens at each threshold, and what you should do next. The bar is the class's identity card.

---

## 2. Utility Ledger (draft — validated per class in Phase 2)

Each class gets a reserved territory and a differentiation direction against its nearest neighbor. "Exclusive territory" is the space no other class may enter without a design decision.

| Class | Primary / Secondary | Exclusive territory (draft) | Conflict to resolve |
|---|---|---|---|
| Animist | Support / Control | Ancestral spirit network: bone terraforming, spirit courts, ancestor summons | Generic-summoner drift |
| Apex | DPS / Skirmish | The mobile hunt: cross-terrain tracking, companion scouting, fog ambush | Warden (designate → execute) |
| Arcanoneer | DPS / Control | Elemental sphere combinatrix: rolled 4d8 pool, 36-combo weaving | Spreadsheet-class risk |
| Augur | Support / Debuff | Fate ledger: reads actual d20 results (even/odd) into reactive interception | Gambit (d20 meta) |
| Berserker | DPS / Bruiser | Dual-pressure resource: starvation at the floor, burnout at the cap; sustain through aggression | Cap-punishment cluster |
| Chronarch | Support / Control | Authored time control: banking, rewind, turn-economy surgery | Lunarch (forced cycle) |
| Crusader | Tank / Vanguard | Consecrated territory + solar judgment burst; offense and defense share one bar | Martyr, False Prophet |
| False Prophet | Control / Support | Manufactured faith: congregation positioning and enemy-facing redirection via believers | Martyr, Crusader |
| Gambit | DPS / Support | The wager: fate deck, debt, stolen luck; deliberately *manipulates* outcomes | Augur |
| Harbinger | DPS / Control | Scheduled doom: prophecies planted now that detonate later | Cap-punishment cluster |
| Inquisitor | Tank / Nullifier | Cold-iron arbitration: sever contracts, execute the supernatural, nullify entities | Spellguard |
| Lunarch | Control / Support | The forced cycle: involuntary moon phases, gravity fields, phase-shift shock | Chronarch |
| Martyr | Tank / Support | Damage interception: absorb ally pain and convert it into protection | Crusader, False Prophet |
| Minstrel | Support / Commander | Note banking and cadences: sequenced party tempo and morale control | Generic-support drift |
| Plaguebringer | DPS / Attrition | Living affliction: evolving diseases that grow on hosts and spread | Toxicologist |
| Pyrofiend | DPS / Hazard | Permanent escalation: heat never resets, debt transfers on death | Cap-punishment cluster |
| Revenant | DPS / Bruiser | Death banking: HP-as-mana, phylactery resurrection, undying predator | None major |
| Shaper | DPS / Hybrid | Six-form stance matrix: the toolkit itself morphs per form | Berserker stances |
| Spellguard | Tank / Nullifier | Energy absorption: intercept hostile magic and vent/redirect it | Inquisitor |
| Toxicologist | DPS / Preparation | Prepared alchemy: vials, coatings, traps, bench crafting before the fight | Plaguebringer |
| Warden | Control / Bruiser | Territorial duel: 15 ft forced 1v1, drag and execute | Apex |

**Known duplicates to resolve (Kill Your Darlings):** `Judgment Day` ×3 (Inquisitor L8 / Martyr L9 / Revenant L8), `Pandemic` ×2 (Plaguebringer L7 / Toxicologist L8), `Null Field` ×2 (Inquisitor / Spellguard), plus `Chaos Bolt`, `Dimensional Rift`, `Primal Cataclysm`, `Phase Shift`, `Bone-Reading`.

---

## 3. Per-Class Audit Rubric (0–3 each; target ≥24/30, no dimension ≤1)

Every class is scored during its deep dive. Any 0 or 1 automatically spawns a change item.

| # | Dimension | 3 = | 1 = |
|---|---|---|---|
| 1 | Identity & fantasy | One-sentence pitch no other class can claim; unique vocabulary | Fantasy present but interchangeable |
| 2 | Group function & exclusive utility | Exclusive verb(s) + ledger entry; no replacement | Shares function; verbs duplicated elsewhere |
| 3 | Resource loop design | Round-to-round decisions, threshold states, meaningful failure | Passive bar; few spells interact |
| 4 | Spell-curve quality | ≥4 options + ≥2 non-damage every level; deliberate spikes; no autopicks | Single-option levels; dead or trap picks |
| 5 | Utility identity per level | Utility teaches/requires the class loop and fantasy | Utility generic or stapled onto damage |
| 6 | Combat decision density | Reactive depth: interrupts, telegraphs, positioning, combo branches | Rotation spam |
| 7 | Talent-tree integration | Build-defining choices, named synergies, transforming capstones | Valid but generic rank bumps |
| 8 | UI expression | Bar teaches at a glance; tooltip/menu are accurate, themed, spec-aware | Flat tooltip; wrong or missing data |
| 9 | Anti-overlap distance | Clearly separated verbs and decisions from every other class | Reskinned neighbor |
| 10 | Beginner legibility | Instantly graspable fantasy and loop, depth underneath | Requires outside explanation |

---

## 4. Locked Policies (2026-09-13)

1. **Spec roster:** 3 core specs per class. A 4th spec is allowed only where exceptional (current candidates: Martyr Ironclad, Warden Iron Jailer) and only if it passes the full rubric with a valid 50-point tree; otherwise its best nodes fold into the core trees and the spec is retired. Berserker/Lunarch's 6 tree files resolve to one canonical set of 3. **Exercised:** Warden Iron Jailer promoted 2026-09-13 (wired through classSpellCategories, TALENT_TREES, backdrop, and the Gaoler bar; canonical names = classData lore set: Iron Stalker / Iron Jailer / Relentless Tormentor / Monolith).
2. **Pool floor:** levels 1–10 each offer ≥4 spell options, ≥2 non-damage. Class passives and weaknesses never occupy pick slots (drawbacks live inside spells); toggleable stance spells are legitimate picks and are exempt.
3. **Exclusive verbs:** enforced. Build the ledger (§2) and resolve every duplicate signature (name and/or mechanic).
4. **Keep all 21 classes;** prioritize bringing Berserker, Lunarch, Apex, and Warden up to the strength and distinctness of the best classes.
5. **P0 bugs first (Phase 0):** broken pools, invalid trees, leaks/gating, uninitialized resources, duplicate config — before any redesign.

---

## 5. Execution Plan

### Phase 0 — Truth & Foundations (start immediately)
1. Build `scripts/audit-classes.mjs` + `npm run audit:classes`: pool floor check, per-level utility census, spec-name consistency across the 4 sources, resource-loop coverage, orphan/unwired detection.
2. Patch `talentTreeValidator.mjs` blind spot (re-export shims report 0 trees); wire both validators into CI alongside `spell-qa` and `check-class-structure`.
3. Fix broken level-up pools: Revenant L4/L5/L7/L9, Spellguard L6–L10, Inquisitor L9 (needs a new spell), pool omissions and level mismatches, Martyr L2 inline object.
4. Fix leaks/gating/initializer: Martyr demo damage leak, Berserker owner gate, Shaper/Augur/Toxicologist initialization, Revenant duplicate `classResources.js` key.
5. Baseline the 21×21 overlap matrix (signature verbs/mechanics) and create the per-class audit sheet template under `docs/class-audits/`.

### Phase 1 — Pilots (calibrate the rubric)
Berserker and Lunarch (broken wired trees), Apex and Warden (overlap + thin identity). Full deep dives, Daniel reviews, rubric locked.

### Phase 2 — All 21, in overlap-cluster order
1. Cap-punishment cluster (Berserker, Harbinger, Pyrofiend, Spellguard, Chronarch, Lunarch)
2. Mark-execute (Apex, Warden)
3. Probability (Augur, Gambit)
4. Affliction (Plaguebringer, Toxicologist)
5. Anti-magic (Inquisitor, Spellguard)
6. Sacrifice-redirect (Martyr, Crusader, False Prophet)
7. Remaining classes.

Per class: scored assessment sheet → change list (cut / merge / retheme / keep) → implementation → validation → Mind memory → Daniel sign-off.

### Phase 3 — Cross-Class & UI Polish
Exclusive-verb enforcement, resource tooltip/menu standardization (single data source; spec-aware menus; threshold + failure-state teaching), Playwright visual pass, final rubric audit.

---

## 6. Definition of Done (per class)

- [ ] Audit script clean: pool floor met, no orphans, spec names consistent across all sources
- [ ] Structure check + spell QA + talent validator (0 errors, no unresolved warnings)
- [ ] Rubric ≥24/30 with no dimension ≤1
- [ ] Utility Ledger row filled and conflict resolved
- [ ] Resource bar tooltip/menu accurate, themed, spec-aware (Playwright verified)
- [ ] Jest suites pass; `docs/class-audits/<class>.md` completed
- [ ] Mind memory updated; Daniel has reviewed the class hands-on
