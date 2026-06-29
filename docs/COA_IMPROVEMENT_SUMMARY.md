# CoA → Mythrill: Improvement Rundown

This file distills every actionable improvement from `COA_TRANSLATION_BRIEF.md` into a categorized checklist. Use it to triage what to implement.

---

## 1. Class Identity & Flavor (Quick Wins)

### Every Spec Needs a "Why Bring Me" Sentence
CoA's strength is that each spec has a one-line hook. Audit yours for the same.

| Current Spec | Tightened Identity Hook |
|---|---|
| Berserker Savage | "I trade my HP for unresistable damage when I'm near death." |
| Apex Bladestorm | "My glaive bounces through 5 enemies before returning." |
| Chronarch Rewinding | "I heal by reversing time on wounds — it costs me, not them." |
| Pyrofiend Inferno | "Scathrach screams through me. Every cast is a negotiation." |
| False Prophet Voidcaller | "I balance on the edge of madness — the more insane I get, the more damage I deal. If I go over, I die." |

**What to do**: Add the one-liner to each spec's `description` field. 5 minutes per class.

### Signature First-Session Moment
CoA gives every class a "first combat hook" — Necromancer raises a skeleton on their first kill, Tinker builds a turret. Add one line to each class's `overview.immersiveCombatExample`:

- **Berserker**: First killing blow sprays blood — gain +2 Blood-Heat immediately.
- **Apex**: First glaive throw ricochets to a second target.
- **Revenant**: First death = Death Shroud triggers, frost spreads under you.
- **Pyrofiend**: First spell ignites the ground for 1 round.
- **Chronarch**: First hit rewinds a fraction of a second — an enemy attack misses.

**What to do**: Add as a bullet in each class's overview. 1-2 lines each.

### Profession Synergy Table
Every class gets one unique profession interaction. Already documented in the brief (e.g., Apex=skinning predator-lures, Pyrofiend=engineering dampeners). Add as a `professionHooks` array to each class data file.

---

## 2. Class Structure Improvements

### Add the Support Role Tag
CoA's headline innovation is the **Support role**. Mythrill's specs already fit this — they just aren't tagged:
- Minstrel Battlechoir (damage amp support)
- Minstrel Soulsinger (heal support)
- Martyr Redemption (heal/tank support)
- Gambit Probability Savant (buff/debuff support)
- Chronarch Rewinding (heal-reversal support)
- False Prophet Deceiver (control support)

**What to do**: Add `role: "support"` to these specs in `classSpellCategories.js` and show a Support icon in the UI card.

### Stance-Swap / Loadout Axes
CoA's Ranger swaps quivers (Swift/Searing/Poison) to exploit enemy weaknesses. Give each class **one stance-swap axis**:

| Class | Stance Tradeoff |
|---|---|
| Apex | Glaive: Razor Edge (chain +2, slow return) vs. Whirlwind (AoE, lower per-target) |
| Berserker | Melee (cleave, zero armor) vs. Throwing (bleed, kite, slowed) |
| Pyrofiend | Inferno (red, demonic, burst) vs. Apostate (blue-white, healing, resistant) |
| Plaguebringer | Swift Rot (fast ticks, low damage) vs. Permanent Decay (slow, stacks forever) |
| Inquisitor | Hollow Pursuit (mobility, stealth) vs. Smite Ground (anti-magic zone, lower speed) |

**What to do**: Add 2 toggleable stance spells per spec in their spell pool. Medium effort, high impact.

### Two-Layer DoT System
CoA's Venomancer layers poison (immediate damage) + rot (stat reduction). Mythrill's Plaguebringer already has this potential. Apply it:

- **Plaguebringer**: Every DoT applies a **Seed** (damage layer). Seeds that reach Stage 3 also apply a **Rot** layer (stat reduction: -1 STR/CON per stage). Rot is permanent until rest.
- **Toxicologist**: Poisons deal immediate blight damage + leave lingering **Toxin** that debuffs saves.

**What to do**: Add a `secondaryLayer` field to DoT spells that activates at Stage 3. Small data change, big strategic depth.

---

## 3. Ability Design Patterns

### The Empower Keyword
CoA's support role deals damage while buffing allies. Propose a reusable **Empower** keyword:

> **Empower**: When you cast this spell, your next ally to hit the same target gains a bonus.

Specs that should use Empower:
- Minstrel Battlechoir: cadences that Empower the next ally attack
- Gambit Karmic Weaver: links that Empower linked allies
- Animist Stormscribe: inscriptions that Empower the inscribed ally
- False Prophet Deceiver: mind-control spells that Empower allies

### Resource-as-Transformation
CoA's Son of Arugal builds Rage in caster form, then transforms into a Worgen with a new ability bar. Mythrill's Berserker can borrow this:

- **Berserker**: At 100 Blood-Heat, enter **Overdrive**. For 2 rounds, your ability bar changes: melee attacks deal +2d6, you cannot be healed, but every attack costs 1d4 HP. This is already partially in the "Boiling Veins" stance — codify it as a transformation state with visual flair.

### Damage-Type Exploitation
CoA's core combat depth: different classes are strong against different creature types. Formalize this:

- **Wyrd-users** (False Prophet, Harbinger): strong against ember-wielding enemies
- **Ember-users** (Pyrofiend, Martyr): strong against blight creatures (purges corruption)
- **Rime-users** (Chronarch): strong against storm enemies (freezes kinetic energy)
- **Storm-users** (Chronarch, Arcanoneer): strong against arcane (disrupts rituals)

Add a `strongAgainst` and `weakAgainst` field to each spec. The UI shows it as a tooltip.

---

## 4. System-Level Additions (What to Build Next)

| Priority | Feature | What It Is | Effort |
|---|---|---|---|
| P0 | Damage-type weakness chart | One table in `rulesData.js` + tooltip on class cards | 1 day |
| P0 | Empower keyword | ~3-5 new passives across support specs | 2 days |
| P1 | Signature first-session moments | One-liners in each overview | 1 day |
| P1 | Profession synergy table | `professionHooks` array + GM-facing table | 2 days |
| P1 | Stance-swap spells | 2 per spec that needs one | 3-5 days |
| P2 | Worldforged relics | `relicsData.js` with ~30 items placed in locations | 5 days |
| P2 | Stat-by-silhouette creatures | Template in GM_WORLD_GUIDE.md for creature generation | 2 days |
| P3 | Woodworking profession | New profession data + recipes | 5-7 days |
| P3 | Two-layer DoT system | `secondaryLayer` field on DoT spells | 3 days |

---

## 5. Per-Class Quick-Reference: What to Add

| Class | 1 Thing to Add (P0) | 1 Thing to Add (P1) |
|---|---|---|
| Arcanoneer | Sphere-stance flavor (elemental attunement cycle) | Entropy Weaver Wild Magic Surge table expansion |
| Animist | Thornwarden "Claim Territory" rooted buff | Stormscribe "Stormbrand Transfer" jump mechanic |
| Apex | Quiver-swap stance (Razor / Whirlwind / Venom) | Beastmaster "Feral Rescue" companion intercept |
| Augur | Gore-Scale DR = BN + ML | Equilibrium Strike (double-conditional) |
| Berserker | Overdrive transformation at 100 Blood-Heat | Reckless Overdrive (2x generation, no dodge) |
| Chronarch | Time Stack damage escalation over freeze cycles | Temporal Gate portal system |
| False Prophet | Insanity balance-window mechanic (15-19 MP = peak) | God-pact choice (4 pantheon options = diff passives) |
| Gambit | Fate's Bargain (transfer FP to ally) | Loaded Deck (draw 2 choose 1) |
| Harbinger | Doom Aura (enemies within 15ft take -1 per 4 Mayhem) | Prophecy escalation (+1d6 per round active) |
| Inquisitor | Silver Bolt (anti-supernatural execution) | Greater Dead Zone (anti-magic field) |
| Lunarch | Gravity Shot (ignores 50% DR on marked target) | Phase Bolt (phases through first hit to second) |
| Martyr | Rallying Cry (free AoE buff, self-recoil) | Wrath Cascade (redirect half Wrath Tithe to enemy) |
| Minstrel | Empower keyword on cadences | Dissonance "Resonant Feedback" reaction |
| Plaguebringer | Two-layer DoT (Seed + Rot) | Permanent Stage (affliction never expires) |
| Pyrofiend | Phoenix's Mercy (convert ember damage to healing) | Scathrach's Demand (spend all levels to survive) |
| Revenant | Phylactery Transfer (store HP in ally) | Specter Rally (all specters attack same target) |
| Shaper | Chimeric Burst (AoE on form shift) | Harvest Essence (gain temporary enemy trait) |
| Spellguard | Gravity Intercept (redirect ally-targeting spell to self) | Rebound Protocol (reflect at 125%) |
| Toxicologist | Potent Rot (blight DoTs reduce CON/STR per stage) | Scrap Mech (collapse 4 contraptions into suit) |
| Warden | Binding Oath (force enemy to target you) | Gaol Shatter (detonate armor for AoE + Stun) |

---

## 6. What NOT to Do (From CoA)

| Don't Do | Why |
|---|---|
| 4th specs (yet) | You chose "polish existing 3 specs" — adding 4th specs is a separate project |
| Talent trees (yet) | On hold by design — revisit after core spec identities are tight |
| PvP modes / Hardcore trials | These are system features, not class improvements. Deferred. |
| Rename everything | Keep Mythrill-native names (Keth-Amar, not Old Gods; Scathrach, not Xoroth) |

---

## 7. Implementation Order I'd Recommend

**Week 1 (P0):**
1. Damage-type weakness chart → `rulesData.js` + class card tooltips
2. Empower keyword → 5 new passives across support specs
3. Overdrive transformation → Berserker Blood-Heat capstone

**Week 2 (P1):**
4. Signature first-session moments → all 20 overviews (1-2 lines each)
5. Profession synergy table → class data + GM-facing doc
6. Stance-swap spells → Apex, Berserker, Plaguebringer (2 spells each)

**Week 3 (P2):**
7. Worldforged relics → `relicsData.js` + placement in `deepLocationData.js`
8. Stat-by-silhouette → CREATURE_COMPENDIUM template

**Later (P3):**
9. Two-layer DoT system → Plaguebringer + Toxicologist
10. Woodworking profession → new profession file
11. Remaining ability concepts from the CoA brief → one class at a time
