# P12 — creator decisions needed (Targeting and Defense Resolution)

Revision 3, 2026-10-16 (correction: "top face always hits" is labelled as proposed, and the D-F1
comparisons as conditional on it). Prepared from authored data, published Laws and source in `D:\VTT`.
Contract draft: [MYTHRILL_PROJECT_12_CONTRACT.md](MYTHRILL_PROJECT_12_CONTRACT.md). Read-only
audit: `vtt-react/verification/p12/defense_data_audit.py` (results outside Git,
`D:/AppData/Temp/opencode/p12-prep-20261016/`). **Nothing here is approved.** Each decision is
independent.

**Approved 2026-10-16 (HQ): C1 = D-E.** The item's current authored die (`durability`, or `maxDurability`
while unworn) is its blocking die and wear track. The Laws category table and the wizard quality table are
authoring guidance, not overrides. No item changes. Every other decision below remains open and GM-adjudicated.

Confirmed decisions are not asked again:
- no AC, Armor score or hidden rating;
- 4 AP; strike 2 AP; authored costs stand;
- favored blocking piece chosen on your own turn, and "Don't block" allowed;
- equipment DR die and rare flat DR are separate;
- wear reads the natural face (armor 1–2, shield 1);
- Defend 1 AP doubles equipment DR and prevents wear until your next turn;
- Riposte ignores flat DR and Defend's extra;
- piercing criticals lower flat DR only;
- Evasion adds missed faces beyond natural 1;
- creatures use flat DR, resistances/vulnerabilities and authored defensive effects;
- attack card, proficiency rank and weapon outcome table are separate.

## Which slice each decision gates

| Decision | 12A (PC strike → creature) | 12B (creature → blocking PC) |
|---|---|---|
| D-A off-tier resistance values | automates those 30 library entries; GM-ruled until then | same |
| D-B mitigation order | automates instance flat DR combined with a tier; GM-ruled until then | required |
| D-C DR vs non-physical | — | required |
| D-D criticals vs shields | — | required |
| D-E which armor die | — | required |
| D-F1 Evasion cap/stacking | — (creatures have no structured Evasion) | required |
| D-F2 Evasion vs formula attacks | — | required (72% of creature damage abilities are formulas) |
| D-G obsolete AC/to-hit text | shown as `[Open]` | shown as `[Open]` |
| D-H creature Defend | GM-ruled | GM-ruled |
| D-I homebrew resistance encoding | automates wizard-made creatures; GM-ruled until then | same |
| D-J prose vs structured defenses | GM-ruled per strike either way | same |

**12A can be frozen with no decision answered.** Every undecided item is a visible GM ruling, not an omission. Each answer only moves an item from "GM-ruled" to "automated".

---

## D-A. Library resistance values that are not on the published tiers

- **Existing rule.** Laws › Damage Modifiers publishes:
  - Guarded −25%, Resistant −50% (both round down), Immune;
  - Susceptible +25%, Exposed +50%, Vulnerable +100% (round up).
- **Conflict.** 30 library entries use resistance 75% (21), 30% (3), 40% (1) and vulnerability 20% (4), 10% (1).
  - The creature wizard *does* offer a **"Highly Resistant (takes 25%)"** level, which equals a 75% reduction.
  - The 75% entries therefore match an authored wizard tier that the Laws don't publish. 30/40/20/10 match no tier anywhere.
- **Example.** Ilsa hits Jotkall (smashing 75%) for 9 smashing.
  - Exact 75%: 2 (9 × 0.25 = 2.25, round down).
  - Treated as Resistant: 4.
- **Recommendation.** Publish "Highly Resistant (−75%, round down)" as a fourth reduction tier, since the creature tool already uses it. Apply the remaining 30/40/20/10 values exactly, with the table's rounding direction, and list those nine entries for your review. No creature is changed.
- **Alternatives.**
  - Map every value to the nearest published tier (changes outcomes silently).
  - Keep all off-tier values GM-ruled.
- **Depends on it.** Automating those 30 entries in 12A/12B. Every other creature is unaffected.

## D-B. Mitigation order, including where conversion goes

- **Existing rule.** The Damage Modifiers sequence (base → tiers → conversion → final) has no place for equipment DR or flat DR.
- **Conversion effects that actually exist come in two kinds:**
  - **Attacker side, "heal for part of the damage dealt":**
    - False Prophet `vampiricHealing` ("heals caster for damage dealt");
    - Lunarch Waning Moon ("heal for 25% of damage dealt");
    - Martyr's mark (allies heal 25% of damage dealt to the marked target);
    - an Arcanoneer drain granting temporary HP equal to damage dealt;
    - the spell wizard's lifesteal effect (percent, dice, critical multiplier).
  - **Defender side, "the target heals from damage it takes":**
    - the creature wizard's Siphoning 25%, Draining 50%, Absorbing 100% and Vampiric 200% levels;
    - these are stored in the same resistance field as negative "damage taken" values.
  - The Laws' conversion table (Leech/Absorb/Invert, "heals attacker") uses names that clash with the wizard's defender-side "Absorbing".
- **Example (subtractions vs tiers).** A bandit hits Ilsa for 10 slicing. She rolls 3 on her vest's d10, has Aegis Ward (flat DR 3), and a ring makes her Resistant.
  - Subtractions first: 10 − 3 − 3 = 4 → **2**.
  - Tiers first: 10 → 5 → 5 − 3 − 3 → **0**.
- **Example (conversion).** Lunarch Waning Moon hits a Resistant creature for 12 rolled.
  - If "damage dealt" means after resistance: 6 dealt, heals 25% of 6 = 1.5 (rounding also unstated).
  - If before: heals 25% of 12 = 3.
- **Recommendation.**
  1. Equipment DR die, then flat DR, then resistance/vulnerability tiers.
  2. Attacker-side conversion is computed from the **final damage actually dealt** (after all reductions, counting damage to temporary HP), because every authored text says "damage dealt".
  3. Defender-side healing is **not** a conversion step: it is the target's own tier for that damage type, replacing the reduction tier at step 1's tier position.
  4. Rename or clarify the Laws' conversion table so "Absorb" is not used for two opposite things.
- **Alternatives.** Tiers before subtractions. Or conversion from rolled damage.
- **Depends on it.** 12A automation of flat DR combined with a tier, and 12B arithmetic. Conversion stays GM-applied in 12A either way.

## D-C. Does equipment DR reduce non-physical damage? (separate from order)

- **Existing rule.** Open. Damage types include physical (smashing, slicing, stabbing) and others (ember, rime, storm, blight, sacred, wyrd, arcane …). Items already carry authored elemental resistances (for example, Ash-Weave Mantle: ember +5).
- **Example.** A hypothetical 8-ember attack hits Ilsa, whose favored vest is d10. Does she roll the d10?
- **Recommendation.** The equipment DR die applies to physical damage only. Elemental protection comes from authored resistances. Flat DR follows its card.
- **Alternatives.** DR applies to all damage from attack rolls. Or to all damage.
- **Depends on it.** 12B.

## D-D. Criticals and shields

- **Existing rule.** A critical goes around armor (no DR roll, no wear). Shields are open. (Moorboggle's authored passive "immune to critical hits" is a separate creature trait and stays GM-ruled.)
- **Example.** A goblin's d6 rolls 6, then 3, plus 1 = 10, against Ilsa's d8 buckler.
  - If shields still block: she rolls d8, and a 1 wears it.
  - If not: she takes 10.
- **Recommendation.** Shields still roll against criticals and wear only on a natural 1. Armor stays bypassed.
- **Alternatives.** Criticals bypass shields. Or shields roll but cannot wear on a critical.
- **Depends on it.** 12B.

## D-E. "The three armor die tables": which die does a piece use?

**APPROVED 2026-10-16: the item's current authored die (recommendation below). The rest of this section is the preparation record.**

- **What it means.** One piece can take its DR die from three places that disagree:
  1. the Laws category table (Cloth d4, Leather d6, Mail d8, Plate d10, Masterwork/Artifact d12–d20);
  2. the item wizards' quality table (poor d4, common d6, uncommon d8, rare d10, epic/legendary d12, artifact d20);
  3. the die written on the item (`durability`/`maxDurability`), which is what wears today.

  An older numeric converter (30 → d4 … 150 → d12) exists for legacy values only.
- **Conflict.** 84 armor/shield pieces: 16 agree with both tables; in 42 the listed die differs from both.
  - Ash-Weave Mantle (cloth, uncommon) lists d10 against d4/d8.
  - Weathered Hide (leather, common) lists d8 against d6/d6.
  - Shields have no category row.
- **Example.** Ilsa's Weathered Hide blocks 6 damage. On the listed d8 she can absorb up to 8, with a 25% wear chance. On the tables' d6, up to 6, with 33% wear.
- **Recommendation.** The die written on the item is authoritative. The two tables become authoring guidance for new items. No item changes.
- **Alternatives.** Category table wins (52 pieces change). Or quality table wins (58 change).
- **Depends on it.** 12B.

## D-F. Evasion — two separate questions

### D-F1. Cap and stacking

- **Existing rule.** +1 Evasion adds one missed face beyond natural 1. The cap and stacking are open.
  - No item, talent, heritage or class stores a structured Evasion value.
  - Creature evasion exists only as prose: Banshrond "ranged attacks have a 50% miss chance"; Gref's "veil of evasion".
- **Consequences, as the chance a single-die attack misses.** These figures are **conditional on the
  proposed rule that the top face always hits** (part of the recommendation below; not an existing or
  approved rule). Without that rule, the cells marked † become 100% (every face misses); the capped
  columns do not change.

| Attack die | E+0 | E+1 | E+2 | E+3 | E+5 | E+1 capped | E+2 capped | E+3 capped | E+5 capped |
|---|---|---|---|---|---|---|---|---|---|
| d4 | 25% | 50% | 75% | 75%† | 75%† | 50% | 50% | 50% | 50% |
| d6 | 17% | 33% | 50% | 67% | 83%† | 33% | 50% | 50% | 50% |
| d8 | 12% | 25% | 38% | 50% | 75% | 25% | 38% | 50% | 50% |
| d10 | 10% | 20% | 30% | 40% | 60% | 20% | 30% | 40% | 50% |
| d12 | 8% | 17% | 25% | 33% | 50% | 17% | 25% | 33% | 50% |
| d20 | 5% | 10% | 15% | 20% | 30% | 10% | 15% | 20% | 30% |

  "Capped" means missed faces may not exceed half the die (the Dodge card's half-die idea).
- **What the cap does at the table.**
  - Without a cap, two stacked +1 sources make a dagger (d4) user miss 75% of the time, and +3 makes small-die attackers nearly useless.
  - With the cap, Evasion stops helping against d4 at +1 and against d6 at +2, while still scaling against d10–d20.
  - Small, fast weapons keep a guaranteed half chance to land; heavy dice are the ones Evasion counters best. This is a real identity choice, not a balance fix.
- **Recommendation.**
  - Sum all sources.
  - Cap at half the attack die.
  - **Proposed (not an existing rule):** the top face always hits, so a critical can never be evaded.
    The comparisons above assume it.
  - For the first build, one Evasion number per character, entered by the owner or GM (no data owner exists yet).
- **Alternatives.** Highest source only (stacking can't build up). Or sum with no cap (Evasion builds can lock out small weapons).

### D-F2. Formula attacks and attacks without a roll

- **Existing rule.** Open. Of 195 creature damage abilities, **141 (72%) roll several dice** (for example Feather Slash 2d8 + 5) and 54 roll one die. Many spells have no attack roll. Today (accepted P8) a formula attack has no miss rule at all.
- **Options and consequences** (Feather Slash 2d8 + 5, average 14, against Ilsa with Evasion +1, where faces 1–2 count as "missed"):

| Option | Miss chance / effect | Consequence |
|---|---|---|
| (i) Evasion does not apply to formula attacks unless the card says so | 0% | Evasion does nothing against 72% of creature attacks. This must be a stated rule, not a gap. |
| (ii) Miss if **any** die shows a missed face | 44% (vs 25% for one d8) | Multi-dice monsters become much easier to evade. Even at Evasion +0, natural 1s would make 2d8 attacks miss 23% of the time, a large change to accepted P8 behaviour. |
| (iii) Miss only if **all** dice show missed faces | 6% (E+0: 1.6%) | Evasion barely matters against big formulas; it matters against single dice. |
| (iv) Each low die counts 0 (no full miss) | average 14 → 13.25 | Evasion becomes mild damage reduction, not avoidance. |
| (v) The card names its attack die (for example "attack: d8"), which then works like a weapon die | as the d8 row above: 25% | Faithful to each creature's design. Needs creator wording on up to 141 cards. |
| (vi) GM rules each formula attack against Evasion until one of the above is chosen | GM | Honest initial boundary. The panel prompts: "Defender has Evasion +1 — GM rules on this formula attack". |

- **Recommendation.** Use (vi) as the 12B starting boundary, never a silent immunity. Choose between (v) and (iii) as the lasting rule. (v) preserves distinctive creature attacks; (iii) is the low-effort option.
- **Depends on it.** 12B hit/miss for creature formula attacks, and whether P8's accepted Feather Slash flow gains a miss check.

## D-G. Obsolete AC / to-hit text

- **Existing.**
  - 23 weapon outcome faces name Armor Class or "−2 to hit" (for example "gaining +1 Armor Class (AC) until your next turn").
  - 90 inline creature attack descriptions in `creatures.json` say "+N to hit".
- **Recommendation.** Supply replacement wording in Prism terms. Until then the faces are shown with `[Open: obsolete wording]` in 12A's proficiency step, and the inline creature text is never parsed. No silent reinterpretation (+1 AC is not quietly turned into DR).
- **Depends on it.** Only the clarity of those faces. Automation reads neither.

## D-H. Generic creature Defend

- **Existing rule.** Creature Defend "improves damage reduction"; the GM applies the creature's authored benefit or adjudicates one. No library creature has a flat DR value to raise.
- **Example.** Grimmstalk Defends; Ilsa hits it for 9 slicing.
- **Recommendation.** GM-applied in P12. A generic value can come later, for example +2 flat DR until its next turn as an instance condition.
- **Depends on it.** A future automated creature Defend.

## D-I. Homebrew creature resistance encoding (new)

- **Conflict.** The library stores "percent reduced". The creature wizard stores "percent of damage taken": 100 normal, 50 Resistant, 25 Highly Resistant, 0 Immune, 125/150/200 increased, negative = heals.
  - The same number can mean opposite things: a wizard "25" is Highly Resistant (takes 25%), while a library "25" is Guarded (takes 75%).
  - Today's tooltip and over-time code read both as "percent reduced", so a wizard "Vulnerable" (200) displays as Resistant.
  - Campaign homebrew monsters use free text ("Rime 50%", "Ember 150%").
- **Example.** A hypothetical homebrew Ember Wisp set to Vulnerable (200) to rime takes Ilsa's 6 rime as 12. The current tooltip shows it as rime-Resistant, which would give 3.
- **Recommendation.** Treat wizard-made creatures' values as "percent taken", as the wizard defines them. Record an explicit encoding marker when creatures are saved, so old records stay readable. Fixing the tooltip is separate, explicit work. P12 never guesses the encoding: unmarked homebrew values stay GM-ruled.
- **Alternatives.** Convert wizard data to the library encoding (a data migration needing approval). Or keep all homebrew GM-ruled.
- **Depends on it.** Automating homebrew creatures in 12A/12B.

## D-J. Prose defensive passives vs structured fields (new)

- **Conflict.** 35 creatures have defensive prose in their authored abilities, often disagreeing with their structured resistances:
  - Dullahan: prose "immune to smashing, stabbing and slicing"; structured smashing 50% only.
  - Sirrush: prose "resistant to ember and rime"; structured ember 50% and rime *vulnerable* 25%.
  - Daeva: prose "all non-sacred damage reduced 75%"; structured smashing 75%, rime and ember 50%.
- **Example.** Ilsa's sword hits Dullahan for 8 slicing. Structured fields say 8; the prose says 0.
- **Recommendation.** In P12 the GM rules whenever defensive prose exists for the target (12A already requires that tick). Later, a content pass reconciles each creature, with the prose as your intent, as separate approved data work.
- **Alternatives.** Structured fields win automatically (prose becomes flavour). Or prose wins (needs parsing, which P12 excludes).
- **Depends on it.** How many 12A/12B strikes need a GM ruling. Correctness is protected either way.
