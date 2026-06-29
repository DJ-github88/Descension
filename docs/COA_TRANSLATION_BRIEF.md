# Conquest of Azeroth — Mythrill Translation Brief

## Purpose

This document extracts design ideas from Ascension WoW's **Conquest of Azeroth** (CoA) — a custom server with 21 new classes, 70 specializations, and a modernized talent/combat system — and translates them into Mythrill-native proposals. Every extraction is filtered through Mythrill's design constraints:

- **8 damage types**: physical, ember, rime, storm, arcane, primal, blight, wyrd
- **Kinetic/high-exertion tone** (no grimdark visceral horror)
- **Mythrill-native naming** (no WoW or D&D generic terms)
- **3 specializations per class** (talent trees on hold)
- **One spell chosen per level-up** with tight drawback economy
- **Each spec anchored by one specPassive**

The goal is to sharpen the identity, flair, and ability concepts of all 20 existing Mythrill classes by mining CoA's design patterns. No new specs, no talent-tree work — pure enrichment of what's already here.

---

## Tone Guardrails: CoA Terms → Mythrill Equivalents

| CoA / WoW Term | Mythrill Translation |
|---|---|
| Holy / Light | Ember (Sol's warmth / divine fire) |
| Shadow / Void | Wyrd (spiritual rot / Keth-Amar corruption) |
| Frost | Rime (the frozen world's grip) |
| Nature / Poison | Blight / Primal (Keth-Amar decay / living world) |
| Arcane / Magic | Arcane (binding ritual residue) |
| Lightning / Force | Storm (kinetic fury) |
| Elune / Lunar deity | Sol / Lunarch's parasite-as-eldritch-moon |
| Old Gods / Void Lords | Keth-Amar / the Voice / the Unmaker |
| Xoroth / Burning Legion | Scathrach (Pyrofiend's demon-parasite) |
| Blood magic / viscera | Sanguine exertion, metabolic strain, kinetic overdrive |
| Holy Light paladin | Ember-wielding crusader / Martyr theology |
| Spirit / Loa | Ancestral Resonance, animistic totemic forces |
| Hex / Voodoo | Primal binding, ancestral curse-weaving |
| Necromancy | Blight-channeling, Death Toll resource, spectral binding |
| Rune magic / Inscription | Runic inscription, Ancestral Resonance runes |
| Worgen curse / San'layn | Sanguine transformation, metabolic feral state |
| Vrykul ancestry | Ancestral spirit-channeling, totemic lineage |

---

## Identity Toolkits: System-Level Features Serving All Specs

These are reusable design patterns extracted from CoA that every class can draw on to sharpen its spec identity.

### 1. Damage-Type Strength/Weakness Chart

CoA's core insight: different classes/specs should *feel* differently depending on what they're fighting. Formalize a rock-paper-scissors chart for Mythrill's 8 types.

| Damage Type | Strong Against | Weak Against |
|---|---|---|
| Physical | Blight, Primal (flesh) | Ember (burns through armor), Storm (shatters) |
| Ember | Blight (purges corruption), Rime (melts frost) | Storm (disperses heat), Primal (endures) |
| Rime | Storm (freezes kinetic fury), Arcane (slows flow) | Ember (melts), Physical (cracks permafrost) |
| Storm | Arcane (disrupts rituals), Physical (shatters metal) | Rime (freezes kinetic energy), Primal (grounds) |
| Arcane | Wyrd (stabilizes chaos), Ember | Storm (disrupted), Blight (corrupts magic) |
| Primal | Ember (endures), Storm (grounds lightning) | Blight (rots life), Physical (cuts) |
| Blight | Primal (rots organic), Arcane (corrupts foci) | Ember (purges), Primal (resists decay) |
| Wyrd | Arcane (unmakes order), Physical (warps flesh) | Ember (burns away chaos), Storm (grounds) |

**Translation to spec identity**: Each spec's `strongAgainst` / `weakAgainst` becomes a clickable tooltip in the class card. "I am a Berserker Savage — I shred low-armor Primal creatures, but Ember-wielding enemies burn through my rage economy."

### 2. Stance / Loadout-Swap Combat Loops

CoA's Ranger quiver-swap (Swift/Searing/Poison) and Barbarian weapon-switch (melee cleave vs ranged kite) are reusable patterns.

**Mythrill applications**:
- **Apex**: swap between glaive-loadouts — *Razor Glaive* (chain damage), *Ember-Edged Glaive* (bonus ember vs blight foes), *Glaive of Venom* (blight DoT) — each switch costs a minor resource.
- **Berserker**: toggle between *Unbridled Fury* (cleave, max speed, 0 armor) and *Calloused Grip* (throwing axes, bleed-on-crit, slowed).
- **Plaguebringer**: swap affliction types — *Swift Rot* (fast DoT, low damage) vs *Permanent Decay* (slow DoT, stacks forever).
- **Inquisitor**: toggle *Hollow Pursuit* (max mobility vs single target) or *Smite Ground* (anti-magic zone, lower speed).

Each spec can have one unique stance-swap axis that defines its tactical "mode shift."

### 3. Stat-by-Silhouette Creature Logic

CoA redesigns creatures so that *what they look like determines their stats*. Plate + 2H = high armor, slow, high str/parry. Leather daggers = low armor, fast, high crit.

**Translation**: Add a "Stat Silhouette" template to `docs/CREATURE_COMPENDIUM.md`.

| Silhouette | Armor | Speed | Primary Stat | Weakness | Drops |
|---|---|---|---|---|---|
| Plate + 2H | High (DR 4+) | Slow (-10ft) | STR, Parry | Storm (shatters armor) | Plate gear, 2H weapons |
| Leather + daggers | Low (DR 1) | Fast (+10ft) | AGI, Dodge | Physical (bleeds) | Leather, daggers |
| Cloth + staff | None | Medium | INT, Spirit | Physical (interrupt) | Staves, cloth |
| Chain + bow | Medium | Medium-med | DEX, Crit | Ember (ignites) | Chain, bows |
| Plate + shield | Very High | Very Slow | STR, Block | Storm + Wyrd | Shields, plate |
| Hide + claws (beast) | Medium | Fast | STR, Bleed | Primal (endures) | Raw materials |

Each spec can reference this: *"As a Plaguebringer Decay Harbinger, I am strong against slow armored foes (plate+shield) — my rot stacks while they lumber."*

### 4. Signature First-Session Moment

CoA gives each class a *first combat hook*: Necromancer raises a skeleton, Tinker builds a turret. This is onboarding flair.

| Mythrill Class | Signature First Moment |
|---|---|
| Berserker | Your first killing blow sends blood-spray in an arc — gain +2 Blood-Heat instantly. |
| Apex | Your glaive ricochets off your first target and clips a second. Your companion finishes it. |
| Revenant | Your first death (from a rat, whatever) triggers Death Shroud — you rise, frost covers the ground. |
| Arcanoneer | Your first sphere-combo triggers: two Ember spheres produce a fire burst that catches your target. |
| Chronarch | Your first hit rewinds a fraction of a second — the enemy's attack misses. |
| Pyrofiend | Your first spell ignites a patch of ground that burns for 1 round after. |
| Inquisitor | Your first demon binds — a tiny Minor wretch that nibbles your enemy's ankles. |
| Animist | Your first totem pulses — healing or damage, depending on placement. |
| False Prophet | Your first sermon — 1 random Madness Point, and the enemy flinches. |
| Minstrel | Your first cadence — 2 random notes appear in your gauge. |
| Gambit | Your first Lucky Strike — the die lands on 20, the table gasps. |
| Martyr | Your first Intervene — you take 3 damage meant for an ally. The party looks at you sideways. |
| Toxicologist | Your first poison applied — your blade drips green. |

*These are one-liner hooks to include in each class's overview, not mechanics to build.*

---

## System-Level Features from CoA

### A. The Support Role (Flavor Framework Only)

CoA's headline is a 4th role: **Support** — empowering allies, mitigating damage, snaring enemies, dealing damage while buffing. Mythrill currently has Tank / DPS / Heal. Adopting a Support tag is a naming/identity change, not a spec overhaul.

**Natural Support-fit specs**:
- **Minstrel**: Battlechoir (damage amp), Soulsinger (healing support)
- **Martyr**: Redemption (heal-support), Zealot (damage-support)
- **Gambit**: Probability Savant (buff/debuff support)
- **Chronarch**: Arc of Rewinding (heal-reversal support)
- **Animist**: Stormscribe (inscribed buffs + healing totems)
- **False Prophet**: Deceiver (mind-control support)
- **Plaguebringer**: Torment Weaver (debuff-support via psychic links)

**Proposal**: Add a `role: "support"` tag to class data for these specs. In the UI, show a Support icon (e.g., crossed banner and arrow) next to their card. No mechanical changes — purely classification that helps players build teams.

### B. Worldforged Relics — Mythrill Equivalent

CoA has 1,800 handplaced "worldforged" items with unique procs tied to class/spec themes. Mythrill equivalent: **Relic items** with class-tagged proc effects that drop from thematic locations.

| CoA Worldforged Item | Mythrill Translation |
|---|---|
| Ring that fears attackers on hit (Reaper) | *Hollowed Band* — when you take melee damage, target makes a Spirit save or flees 10ft (Revenant / Harbinger favored) |
| Amulet that petrifies on DoT ticks (Rotweaver) | *Fossil-Shard Pendant* — enemies afflicted by your DoTs make a CON save or slow by 10ft (Plaguebringer / Toxicologist favored) |
| Boots that leave flame-trails (Hellfire Knight) | *Cinder-Tread Greaves* — your movement leaves an ember trail that burns enemies for 1d4 for 1 round (Pyrofiend favored) |
| Blazing ring (Xoroth) | *Scathrach-Hot Ring* — on kill, your next spell within 2 rounds gains +2d6 ember (Pyrofiend / Berserker favored) |

**Proposal**: Create a `relicsData.js` with ~30-50 handplaced relic items, each with a classTag for thematic filtering. Place them in `deepLocationData.js` locations (abandoned towers, forgotten vaults, caverns). They scale via Runes of Ascension equivalent at max level.

### C. Class-Profession Synergy

CoA gives each class unique profession interactions. Mythrill already has some of this baked into class identity. Formalizing it adds flavor.

| Mythrill Class | Profession Synergy |
|---|---|
| Berserker | Skinning: can harvest bone-plates from fallen creatures for +2 temporary AC |
| Apex | Skinning: can craft predator-lure baits from harvested glands; Leatherworking: quivers with capacity bonuses |
| Arcanoneer | Engineering: sphere-manipulation tools cost 1 less mana when crafted personally; Woodworking: can craft sphere-focus staves |
| Animist | Alchemy: totem paints that alter element type; Inscription: totem sigils |
| Augur | Alchemy: boiling blood for omens gives +1 to next omen roll; Inscription: omen-scrolls |
| Berserker | Skinning: adrenaline-harvesting from kills |
| Chronarch | Jewelcrafting: temporal-crystal trinkets; Enchanting: chronal weapon oils |
| False Prophet | Alchemy: Madness-concoctions; Inscription: sermon scrolls |
| Gambit | Jewelcrafting: loaded dice; Enchanting: fate-woven cards |
| Harbinger | Enchanting: doom-runes; Inscription: prophecy scrolls |
| Inquisitor | Engineering: silver-manacles; Blacksmithing: bind-rivets for demon collars |
| Lunarch | Jewelcrafting: starlight-lens goggles; Alchemy: parasite-dampening tonics |
| Martyr | Alchemy: suffering-tonics (self-damage = temp healing); Blacksmithing: reactive armor |
| Minstrel | Engineering: instrument tuning-forks; Woodworking: custom instruments |
| Plaguebringer | Alchemy: plague-brews; Herbalism: rot-resistant flora |
| Pyrofiend | Engineering: Inferno-level dampeners; Blacksmithing: heat-conductive armor |
| Revenant | Alchemy: phylactery-enriching reagents; Inscription: death-mark scrolls |
| Shaper | Leatherworking: form-enhancing straps; Alchemy: mutation-tonics |
| Spellguard | Enchanting: void-contamination seals; Blacksmithing: lead-lined plate |
| Toxicologist | Alchemy: toxin-extraction; Herbalism: venomous plant cultivation |
| Warden | Blacksmithing: chain upgrades for extra reach; Leatherworking: stealth-harnesses |

### D. Woodworking Profession

CoA introduces Woodworking as a new secondary profession. Mythrill could adopt this.

**Woodworking crafts**:
- Staves (arcane/storm focus)
- Wands (quick-cast foci)
- Bows and crossbows (Apex, Warden ranged options)
- Throwing weapons (Berserker, Apex)
- Shields (wooden variants with primal/storm resistance)
- Off-hand items (totems, foci, instruments)
- Arrows and bolts (quiver refills with element-tipped variants)

It pairs with **Woodcutting** (secondary gathering). Trees in different biomes yield different wood types:
- *Ironbark* (Basalt Shyr) → high durability
- *Void-Twisted Timber* (Bryngloom) → wyrd-channeling
- *Frostwood* (Nordhalla) → rime-resistant
- *Ashwood* (Emberspire) → ember-conductive

### E. RPG Creature Overhaul — GM Template

CoA's "creatures reflect their equipment" is directly translatable. It's not a code change — it's a GM-facing template.

**Proposed addition to CREATURE_COMPENDIUM.md**: For every creature entry, add a line:

`Stat Silhouette: Plate+2H (High DR, slow, Storm-vulnerable) | Drops: [2H weapon, plate gear]`

The GM reads the silhouette and knows at a glance:
- How armored the creature is (DR 4+)
- How fast it moves (slow)
- What it's weak to (Storm damage)
- What it drops (the weapons/armor it visibly wears)

### F. Damage-Type Resistance / Vulnerability Per Creature

Expand creature stat blocks with `primaryResistance` and `primaryVulnerability` fields tied to the 8-type system. This lets every spec's damage-type choice matter.

**Example creature**: *Basalt Shyr Warder*
- Armor: Plate + Tower Shield (DR 6, Block)
- Vulnerable: Storm (armor is brittle, -2 DR vs storm)
- Resistant: Ember (stone is fireproof, half ember damage)
- Weakness exploit: An Ember-building Pyrofiend should switch to a different strategy. A Storm-called Chronarch should lean in.

### G. Support Role — First-Contact Mechanic: The "Empower" Keyword

As a lightweight mechanic expandable across all specs that fit a support identity: introduce the **Empower** keyword. When a spell or passive says "Empower X", it means the next ally who attacks the same target gets a bonus.

Example:
- *Minstrel Battlechoir*: "Empower War Drums — next ally to hit your target deals +1d8 thunder"
- *False Prophet Deceiver*: "Empower Doubt — next ally's attack against the target has advantage"
- *Animist Stormscribe*: "Empower Stormbrand — next ally to hit deals +1d6 lightning"

This gives a concrete, low-cost mechanical hook for "I am a support" without building a full resource system.

---

## Cross-Class Note: Son of Arugal

The **Son of Arugal** is a CoA class built around the Worgen curse — a constant struggle between human caster and feral wolf. It has **no single Mythrill equivalent** but its four specs map across multiple existing classes as *flavor enrichment*:

| Son of Arugal Spec | Thematic Core | Mythrill Class(es) That Can Borrow This Flavor |
|---|---|---|
| Ferocity | Build rage in caster form, transform into Worgen for savage melee | **Berserker** — the caster→feral transformation mirrors Blood-Heat building toward a high-heat state |
| Blood | San'layn blood magic — HP as resource, blood bombs, life siphons | **Martyr / Revenant** — HP-as-resource identity, sanguine drains |
| Packleader | Permanent worgen form + summon shadow wolf pack on damage/kills | **Apex** (Beastmaster) — companion-summoning from combat momentum |
| Fleshweaver | Blood healing — pool Vitality from self-harm to fuel massive party heals | **Martyr** (Redemption) — convert personal suffering into party recovery |

**Key flavor extraction**: The Worgen curse as a *class resource pendulum* — players start as a caster, build a resource (Rage), then transform into a melee beast with a new ability set. This mechanic could enrich Berserker's Blood-Heat: once Blood-Heat hits 100, you "transform" (enter Overdrive) with a different ability bar for 2 rounds.

---

## Per-Class Deep Dives

Each entry follows this structure:
1. **CoA source class(es)** — which CoA class(es) map to this Mythrill class
2. **Current 3 specs recap** — identity, theme, playstyle (from your actual *Data.js files)
3. **CoA-extracted ideas** — what CoA does that Mythrill can borrow
4. **Spec polish proposals** — per-existing-spec: tightened identity, flair upgrades, 2-4 named ability concepts

---

### 1. Arcanoneer

**CoA Source**: Rune Master (spellslinger / riftblade / conjuration) + Tinker (demolition / mechanics / invention) + Stormbringer (elemental fury)

**Class Mechanic: Attunement + Inscribe Rune** — Runemasters cycle through Fire/Frost/Arcane Attunement (every 8s, slightly alters abilities) and store up to 4 runes for mana regen + ability fuel. This dual-resource (cycling element + stored runes) is a different approach than Arcanoneer's sphere matrix, but the "elemental attunement cycle" could inspire a Prism Mage flavor upgrade: your active element slowly cycles unless you lock it.

**Current 3 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Prism Mage | Pure Element Mastery | Focus one element, reroll spheres, pure combos deal +50% |
| Entropy Weaver | Embrace Randomness | 5d8 spheres, chaos combos double damage, wild magic surge |
| Sphere Architect | Precise Control & Manipulation | Swap spheres, lock element, reduce Recipe costs |

**CoA-Extracted Ideas**:
- Rune Master's "Spellslinger" spec — *raw caster using shifting runes to alter and empower a Thaumaturgy spell* — is already Prism Mage's identity. The "Thaumaturgy" concept (a core spell that changes based on active runes) is a good frame for Arcanoneer's basic attack: your basic sphere-shot changes element based on your matrix.
- Rune Master's "Rift Blade" — *melee assassin cycling Fire/Frost/Arcane weapons in different orders to create combo spells* — gives Arcanoneer a *melee-range option*: sphere-fused weapon strikes that consume spheres for on-hit effects. Different sphere orders produce different combo finishers.
- Rune Master's "Conjuration" spec — *pet-focused with a Runic Familiar that can be displaced, repositioned, and used to teleport around* — is a different summoner fantasy. For Arcanoneer, this could be a Sphere Familiar (a sentient sphere construct) that holds 1-2 banked spheres and can cast them at a target you designate.
- CoA's Tinker "Rounds" mechanic — *different bullet types that change your gun's behavior* — is already conceptually close to Arcanoneer's spheres. Each "round type" = each sphere element.
- CoA's Stormbringer "Winds" spec — *Air Elemental grows stronger in combat* — could inspire an Archivist choice: your matrix "awakens" the longer combat goes, granting bonus spheres after round 3.

**Spec Polish Proposals**:

**Prism Mage** — *Elemental Purist*
- **Identity tighten**: You do not adapt to elements — you *choose one and transcend it*. Your identity is obsession, not versatility.
- **Flair upgrade**: Your sphere generation visuals change based on your chosen element. Ember = molten iron; Rime = frozen mercury; Storm = crackling glass.
- **Ability concept — Elemental Apotheosis**: Once per combat, lock your sphere generation to one element for 3 rounds. All pure combos crit on 19-20. You cannot generate other elements during this time.
- **Ability concept — Prism Shield**: Consume 2 spheres of your chosen element to create a reactive barrier. Enemies that hit you take your element's damage (ember = burn, rime = slow, storm = knockback).
- **Ability concept — Signature Refraction**: Your signature move creates an elemental after-image that attacks the same target for half damage on your next turn.

**Entropy Weaver** — *Chaos Alchemist*
- **Identity tighten**: You are not unlucky — you are *lucky in the direction of maximum destruction*. You embrace the Combinatorial Matrix as a gamble, not a puzzle.
- **Flair upgrade**: Chaos spheres visibly writhe with unstable energy. On a Wild Magic Surge, the sphere-screen glitches with alternative-timeline combos.
- **Ability concept — Chaotic Cascade**: When you complete a Chaos combo, there is a 30% chance the same combo fires again at a random enemy within range for free.
- **Ability concept — Surge Conductor**: Instead of resolving a Wild Magic Surge immediately, you can bank it for 1 round. Next turn, the surge fires alongside your next cast as a free action.
- **Ability concept — Gambler's Detonation**: Spend 3+ Chaos spheres to detonate them all at once. Each Chaos sphere above 3 adds +1d6 to the explosion. No combo matrix — pure chaos.

**Sphere Architect** — *Rune Mechanist*
- **Identity tighten**: You build combos like a siege engineer builds a trebuchet — deliberately, efficiently, with devastating payoff. You do not guess; you *calculate*.
- **Flair upgrade**: Your spheres hover around you in ordered geometric lattices. Locked spheres glow with inscribed runes.
- **Ability concept — Runic Forge**: Spend 1 turn and 3 mana to pre-set a combo. Your next cast within 2 rounds uses that combo instantly as a free action.
- **Ability concept — Sphere Anchor**: Lock a sphere's element indefinitely. It stays in your matrix until you release it. Max 2 Anchored spheres.
- **Ability concept — Calculated Overcharge**: Your next 3-sphere Recipe costs 3 less mana and deals +4 damage per sphere consumed. Requires one full round of prep (cannot move).

---

### 2. Animist

**CoA Source**: Rune Master (Inscriptor runes) + Primalist (totemic animals / stone / wild walker) + Witch Doctor (voodoo / hexes / wards)

**Current 3 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Thornwarden | Bone Cages, Runic Walls, Apex Isolation | Zone control, defensive barriers, choke point lockdown |
| Spirit Binder | Beast Specters, Death Curses, Loa Invocation | Summon-and-slay, curse spreading, specter army |
| Stormscribe | Lightning Fury, Healing Totems, Inscribed Buffs | Aggressive support, ally buff inscription, healing totems |

**CoA-Extracted Ideas**:
- CoA's Primalist has a "Mountain King" spec — big, armored, earth-shaking dwarf/WC3 fantasy. The Thornwarden already has this feel, but could lean harder into *immovable object* identity.
- CoA's Witch Doctor has "Hexing Effigy" — temporarily turn an enemy into an ally. Great for Spirit Binder's control toolkit.
- CoA's Primalist "Grove Keeper" and "Wild Walker" specs offer nature-healing and wild-shape angles that Stormscribe can partial-absorb as flavor.

**Spec Polish Proposals**:

**Thornwarden** — *The Immovable Bulwark*
- **Identity tighten**: You do not move. Enemies move around you, or they do not move at all. Your totems are not tools — they are *territorial claims*.
- **Flair upgrade**: Your bone barriers grow moss and small crystals over time. Old totems develop faces in the grain.
- **Ability concept — Claim Territory**: As a free action, plant your staff/totem into the ground. While within 15ft of it, you are rooted but gain +3 DR and cannot be pushed. The claim lasts until you move or plant elsewhere.
- **Ability concept — Runic Feedback Loop**: When an enemy damages your barrier, the rune on it pulses, dealing 1d6 storm damage to the attacker and healing the barrier for half that.
- **Ability concept — Calcified Presence**: Enemies that start their turn within 10ft of you have their speed halved. Stacks with terrain barriers.

**Spirit Binder** — *The Spectral General*
- **Identity tighten**: You are not a summoner — you are a *general of the dead*. Your specters are extensions of your will, and when one falls, another rises.
- **Flair upgrade**: Your summoned specters are semi-transparent and share your facial features. When one dies, it whispers a death-rattle in your voice.
- **Ability concept — Spectral Relay**: When a specter dies, its death rattle curses the nearest enemy (disadvantage on next attack). That specter reforms at your location at half HP.
- **Ability concept — Shared Feast**: When a cursed enemy dies, all your active specters heal for 1d6. If you have 3+ specters active, they gain +1 to all attacks for 1 round.
- **Ability concept — Soul-Dredge Pulse**: Sacrifice 1 specter (it explodes in a 10ft radius) to deal 2d6 blight and heal you for 2d6. If the target was cursed, the heal is 3d6.

**Stormscribe** — *The Battle-Inscriber*
- **Identity tighten**: You do not cast directly — you *inscribe your allies' weapons with fury*. Your damage comes through them.
- **Flair upgrade**: Inscribed weapons glow with blue-white runes that pulse with the ally's heartbeat. Healing totems hum at a frequency that vibrates in the teeth.
- **Ability concept — Stormbrand Transfer**: When an ally kills an enemy with an inscribed weapon, the Stormbrand jumps to a nearby enemy. Track the chain; each jump reduces damage by 1d4 but costs no resonance.
- **Ability concept — Galvanic Overcharge**: Overcharge your Storm Totem. For 2 rounds, it deals +2d6 lightning, deals 1d6 to you per round, and generates +2 Ancestral Resonance per pulse. High risk, high generation.
- **Ability concept — Inscribe: Fleet-Sigil**: Inscribe an ally's boots. For 3 rounds, they gain +15ft speed and leave a lightning trail that damages pursuers.

---

### 3. Apex

**CoA Source**: Ranger (archery / brigand / farst rider) + Barbarian (headhunter throwing weapons)

**Current 3 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Bladestorm | Multi-Target Devastation | Chain glaive, momentum, AoE whirlwind |
| Beastmaster | Companion & Synergy | Animal companion, coordinated strikes, pack tactics |
| Shadowblade | Stealth & Mobility | Shadowstep, burst from stealth, assassination |

**CoA-Extracted Ideas**:
- The **Quiver-Swap stance system** is the single richest extraction for Apex. CoA's Ranger swaps between Swift Quiver (attack speed), Searing Quiver (ember damage vs fire-weak enemies), and Poison Quiver (bypass armor). This gives every Apex spec a *stance identity*.
- CoA's Ranger "Brigand" spec (melee + poison) directly feeds Shadowblade's bleed/botany toolkit.
- CoA's "Farstrider" spec (mounted archer) is less relevant — Apex is glaive-focused, not mounted.
- CoA's "switch to throwing axes/spears to kite" (Barbarian) is a ranged option Bladestorm can adopt.

**Spec Polish Proposals**:

**Bladestorm** — *The Glaive Dancer*
- **Identity tighten**: You are not a hunter — you are a *living blender*. Enemies should fear getting close, not crave it.
- **Flair upgrade**: Your glaive leaves a visible arc of after-images on each chain hit. Momentum stacks are visible as a growing aura.
- **Ability concept — Glaive-Swap (stance)**: Toggle between *Razor Edge* (chain damage +2 per bounce, but glaive returns one turn later) and *Whirlwind Edge* (all chains become 5ft AoE around each target, but damage per target is 1d4 instead of 1d6). Switch at the start of turn.
- **Ability concept — Ricochet Mark**: Mark one enemy. Your glaive chains to them last, dealing +2d6 bonus damage on the final bounce.
- **Ability concept — Momentum Cascade**: At 3 Momentum stacks, your next glaive attack crits on 18-20. At 5 stacks, your next glaive attack is a guaranteed crit that bounces twice on the same target.

**Beastmaster** — *The Pack Leader*
- **Identity tighten**: You and your companion are one combatant split across two bodies. The companion is not a pet — it is *your other half*.
- **Flair upgrade**: Your companion shares your resource bar — it glows when you have Quarry Marks, and its attacks mirror your last glaive throw.
- **Ability concept — Coordinated Volley**: You throw your glaive at one target; your companion attacks a different target simultaneously. Both attacks roll separately but share your damage bonus pool.
- **Ability concept — Pack Bond**: Your companion can take one Quarry Mark from you. While it holds the mark, both you and the companion deal +1d6 to the marked target.
- **Ability concept — Feral Rescue**: When an ally within 15ft would take damage, your companion can intercept, taking the damage instead. Companion cannot use this again until after your next turn.

**Shadowblade** — *The Silent Tracker*
- **Identity tighten**: You do not fight fair. You stalk, wait, strike, vanish. Every fight is a hunt, and the enemy does not know they are the prey.
- **Flair upgrade**: When stealthed, your silhouette is just slightly wrong — a flicker of heat haze, a momentary double-shadow.
- **Ability concept — Venom Edge**: Apply poison to your glaive as a bonus action (costs 1 Vial). Next attack deals +2d6 blight and the target cannot heal until the end of your next turn. Stacks with stealth bonus.
- **Ability concept — Shadow Pool**: When you kill an enemy from stealth, you leave a pool of shadow on their corpse. You can teleport to any shadow pool within 60ft as a free action once per pool.
- **Ability concept — Hunter's Patience**: If you spend one full turn without attacking (moving or hiding only), your next stealth attack auto-crits and refunds the AP spent on hiding.

---

### 4. Augur

**CoA Source**: Cultist (old-god corruption / void sermon) + Witch Hunter (bolts, tonics, darkness) + Blood Mage (sanguine flesh-weaving)

**Current 3 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Auspex | Balanced Haruspex | 10/10 dual caps, dual-cost spells, balanced control |
| Harbinger | Prophet of the Black Ash | 5/15 dual caps, wyrd ignores resistances, high damage |
| Hierophant | (protection / warding focus) | 15/5 dual caps, defensive warding |

**CoA-Extracted Ideas**:
- CoA's Cultist "Godblade" spec — *melee void channeler* — gives the Augur Hierophant a more aggressive warden identity.
- CoA's Blood Mage "Fleshweaving" — using blood to *heal while dealing damage* — parallels the Augur's dual nature of blessing+cursing.
- CoA's Witch Hunter "Boltser" — crossbow+tonics anti-mage — gives Harbinger a ranged executioner angle.

**Spec Polish Proposals**:

**Auspex** — *The Balanced Blade*
- **Identity tighten**: You walk the knife-edge between life and death. One foot in each. When you lean too far, the universe corrects you — violently.
- **Flair upgrade**: Your omens manifest as physical blood-writing on your skin. Balanced pools = calm script. Unbalanced pools = screaming scrawl.
- **Ability concept — Equilibrium Strike**: Spend 1 BN and 1 ML as a free action. Your next attack deals +3d6 wyrd if BN > ML, or heals an ally 3d6 if ML > BN. If they are equal, it does both.
- **Ability concept — Gore-Scale**: Your DR becomes equal to (current BN) + (current ML). When either drops to 0, your DR drops by half until you rebalance.
- **Ability concept — Omen of Duality**: Mark a target. For 3 rounds, whenever they attack, they take 1d6 wyrd. Whenever they heal, you gain 1 BN. At the end, if they are alive, you gain 2 ML.

**Harbinger** — *The Black Prophet*
- **Identity tighten**: You have seen the ending. It comes whether they're ready or not. Your role is to *speed it up*.
- **Flair upgrade**: Your blood runs black. When you walk, flies circle. Spells leave scorch-marks in the air that look like screaming faces.
- **Ability concept — Rot Nails**: Your ranged bolt attack carries blight. On hit, target has disadvantage on Spirit saves for 1 round. If they fail a save while Rot Nails is active, they take 2d6 wyrd.
- **Ability concept — The Unraveling**: Target takes 1d6 wyrd at the start of each of your turns for 3 rounds. Each tick reduces their highest stat by 1. If any stat hits 0, they are incapacitated for 1 round.
- **Ability concept — Black Siphon**: When a cursed enemy dies, you regain 2 ML and 1d6 HP. If you killed them, regain 4 ML instead.

**Hierophant** — *The Warding Father*
- **Identity tighten**: You do not attack — you *contain*. Your curses are not meant to kill; they are meant to bound. The enemy is not dead — they are held.
- **Flair upgrade**: Your wards appear as semi-transparent geometries of dried blood. Protective runes glow on your allies' backs.
- **Ability concept — Ward of Thorns**: Consume 2 BN to create a 15ft radius ward. Enemies inside take 1d6 primal when they attack. Allies inside gain +2 to all saves.
- **Ability concept — Binding Mark**: Spend 2 ML to bind one enemy to a 15ft radius zone. They cannot leave. If they try, they take 4d6 wyrd and are pulled back to center.
- **Ability concept — Purge the Wound**: Spend 1 BN to cleanse an ally of one debuff. If the debuff was blight or wyrd, they recover 2d6 temporary HP and you gain 1 ML.

---

### 5. Berserker

**CoA Source**: Barbarian (headhunting / brutality / ancestry) + Blood Mage (self-damage scaling)

**Current 3 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Savage | Hemorrhagic Ruin | Fast Blood-Heat, execute scaling below 30% HP |
| Juggernaut | Calloused Husk | Convert damage to barriers, slower decay |
| Warlord | Tyrannical Dirge | Tactical support, AoE roars, team-wide frenzy |

**CoA-Extracted Ideas**:
- CoA's Barbarian "Headhunting" spec — *throwing axes, ranged kiting, bleed-on-distance* — is a new angle for Savage (ranged execute).
- CoA's Barbarian "Brutality" spec — *cleave through low-armor, switch to ranged vs high-armor* — gives Warlord a more tactical stance-swap.
- CoA's Barbarian "Ancestry" spec — *ancestral totems, spirit warriors* — gives Juggernaut a spiritual/ancestral charge option.
- CoA's "weapon-switch to bleed from range vs kite armored foes" is the core tactical loop Berserker is missing: a reason to switch between melee and ranged.

**Spec Polish Proposals**:

**Savage** — *The Unstoppable Executioner*
- **Identity tighten**: You do not defend. You do not retreat. Every hit you take makes your next hit harder. You are a *transaction engine* trading HP for damage.
- **Flair upgrade**: As Blood-Heat rises, your skin smokes. At high heat, your eyes bleed light.
- **Ability concept — Flesh Toll Pact**: Permanently reduce your max HP by 5. In exchange, your Blood-Heat cap is 120 instead of 100. At 100+ heat, every attack costs 1d4 HP but deals +2d8 unresistable physical.
- **Ability concept — Execute Threshold**: Below 30% HP, your Rending Throw (ranged axe) deals +3d6 bleed and returns to your hand. If it kills, you regain 1d6 HP and 10 Blood-Heat.
- **Ability concept — Reckless Overdrive**: Spend one action to double your Blood-Heat generation for 2 rounds. During this time, you cannot dodge and all attacks against you have advantage.

**Juggernaut** — *The Calcified Mountain*
- **Identity tighten**: You do not die — you *petrify*. Each wound is a layer of armor. Each scar is a shield.
- **Flair upgrade**: Grey-white calluses grow visibly thicker during combat. At high Blood-Heat, your silhouette becomes blockier, more stone-like.
- **Ability concept — Scar-Thickened Hide**: Every time you take damage and survive, gain +1 permanent DR for that combat (max 5). Resets when combat ends.
- **Ability concept — Petrification Rush**: Charge forward 20ft. Enemies in your path take 2d6 physical and are pushed aside. You cannot be stopped during the charge.
- **Ability concept — Ancestral Shell**: Your calcified skin absorbs one critical hit per combat, turning it into a normal hit. Recharges when you kill an enemy.

**Warlord** — *The Battle-Chanter*
- **Identity tighten**: Your voice is a weapon. You scream, enemies falter. You roar, allies surge. You do not swing — you *command*.
- **Flair upgrade**: Your voice has a physical presence — visible shockwaves on shouts, audible subsonic rumble on roars.
- **Ability concept — Tyrant's Roar**: All enemies in 30ft make a Spirit save or are Frightened of you for 1 round. All allies in the same radius gain +1 to hit for 2 rounds.
- **Ability concept — Blood Frenzy (point)**: Designate one ally within 30ft. They gain +10 Blood-Heat and +2d6 on their next attack. You take 1d6 recoil. Can target enemies at +1d6 cost to you (they take 1d6 wyrd instead).
- **Ability concept — War-Leader's Exchange**: When an ally within 30ft is targeted by an attack, you can bellow to redirect it to yourself. Gain 15 Blood-Heat and DR 5 against that attack.

---

### 6. Chronarch

**CoA Source**: Chronomancer (duality / artificer / displacement) + Stormbringer (lightning / thunder / winds)

**Class Mechanic: Static** — Stormbringers build Static (0-100 stacks) from abilities. Higher static = more spell proc chances and bonus damage. This is a "ramp-up" resource similar to Chronarch's Temporal Strain but inverted (Strain is risk, Static is reward). Could inspire a Chronarch "Time Static" resource: build charges from temporal manipulation, spend for burst.

**Current 3 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Arc of Stasis | Warden of Still Moments | Freeze/CC, zone control, debuff retention |
| Arc of Displacement | The Shattered Pace | High mobility, coordinate swap, AP generation |
| Arc of Rewinding | The Harrowing Martyr | Healing, debuff cleanse, state reversal, self-blight cost |

**CoA-Extracted Ideas**:
- CoA's Chronomancer "Duality" spec — *balance Order (direct damage) and Chaos (DoT/execute) to unmake foes* — gives Arc of Stasis a dual-resource identity: "Order charges" for freezing, "Chaos charges" for shattering.
- CoA's Chronomancer "Artificer" spec — *wand-based auto-attack build that ramps attack speed over time, culminating in a torrential barrage* — gives Arc of Displacement a "build-up then explode" mobility loop: each teleport makes the next teleport stronger.
- CoA's Chronomancer "Displacement" spec — *utility spells to confuse enemies, Aeon effects that modify heals, Bronze Whelp pet for healing assistance* — gives Arc of Rewinding a pet-healer angle: a temporal familiar that replicates your heals at 50% power.
- CoA's "reverse wounds on adventurers" support loop directly reinforces Arc of Rewinding's healing identity.
- CoA's Stormbringer "Winds" spec — *Air Elemental pet that grows in strength over time, able to Unleash for a huge power boost* — is a fun flavor overlay for Displacement: the "whelp" grows stronger the longer combat lasts.
- CoA's Stormbringer "lightning speed" mobility is a good cross-spec flair additive.

**Spec Polish Proposals**:

**Arc of Stasis** — *The Frozen Hourglass*
- **Identity tighten**: You stop things. Not through brute force — through *temporal friction*. The enemy simply does not get to act.
- **Flair upgrade**: Frozen enemies are encased in amber-tinted crystallized time, not ice. They are visible but unmoving.
- **Ability concept — Temporal Stack**: Each round an enemy remains frozen or slowed, they accumulate a Time Stack. When you break the freeze, you deal +1d6 storm per stack (max 5).
- **Ability concept — Stasis Anchor**: Designate a 10ft radius zone. Enemies entering it are Slowed. Enemies inside at the start of your turn are frozen for 1 round. Costs 1 Temporal Strain per round maintained.
- **Ability concept — Debuff Preservation**: When an ally's buff would expire, you can spend 1 Temporal Strain to freeze its duration for one additional round.

**Arc of Displacement** — *The Shattered Pace*
- **Identity tighten**: You are everywhere and nowhere. You do not walk — you *swap coordinates* with anything within line of sight.
- **Flair upgrade**: Your movement leaves after-images that persist for half a second. When you swap, you and the target blur and exchange positions before the eye can track.
- **Ability concept — Rapid Exchange**: As a reaction when an ally is attacked, swap positions with them. You take the attack. Gain 1 Temporal Strain.
- **Ability concept — Coordinate Scramble**: Swap positions of two enemies within 30ft of each other. They are Confused for 1 round (disoriented by the sudden relocation).
- **Ability concept — Temporal Gate**: Create a portal at your current location and a linked portal at a target location within 60ft. Until your next turn, moving into one portal exits from the other. Costs 2 Temporal Strain per round.

**Arc of Rewinding** — *The Harrowing Martyr*
- **Identity tighten**: You carry the wounds of others as your own. Each heal is a scar on your timeline. But the party survives.
- **Flair upgrade**: When you rewind damage, the wound transfers visibly — a gash on an ally closes as a matching mark appears on you.
- **Ability concept — Wound Graft (upgrade)**: When you heal an ally, you can also transfer one debuff from them to yourself. You take the debuff for 1 round. If it was a blight or wyrd dot, you take half damage.
- **Ability concept — Borrowed Time**: Target ally gets an extra action this turn. At the start of your next turn, you are Stunned for 1 round as the temporal debt comes due. Costs 4 Temporal Strain.
- **Ability concept — Rewind Burst**: All allies within 30ft regain 2d6 HP and are cleansed of one non-permanent debuff each. You take 3d6 blight and gain 3 Temporal Strain. 1/combat.

---

### 7. False Prophet

**CoA Source**: Cultist (godblade / corruption / influence / dreadnought) + Felsworn (infernal / slayer / tyrant) + Blood Mage (eternal)

**Class Mechanic: Insanity** — Cultists generate Insanity when using powerful abilities. Higher Insanity = more damage. Full Insanity = death (mind-shatter). Players must balance between high power and self-destruction. This is already Mythrill's Madness Points under a different name.

**CoA Cultist sub-god pact flavor** — Each Cultist chooses an Old God (N'zoth, Y'Shaarj, C'thun, Yogg-Saron) which changes their abilities. This could translate to False Prophet choosing which aspect of Keth-Amar / the Voice they serve, granting different passive bonuses.

**Current 3 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Voidcaller | Fire-and-Brimstone Preaching | High-damage sermons, rapid Madness, wyrd burst |
| Deceiver | Whispered Corruption | Mind control, charm, turn enemies, debuff transfer |
| Cultist | Dark Ritual & Ceremony | Sustained decay, dark rites, empathetic transfer |

**CoA-Extracted Ideas**:
- CoA's Cultist "Godblade" spec — *melee void channeler with a pact blade that summons tentacles and builds void runes for unholy strikes* — is a missing melee-fantasy that any False Prophet spec could adopt as a stance: ranged sermon vs. melee blade-channeling.
- CoA's Cultist "Dreadnought" spec — *heavy armor void tank with absorption shields and punishment nullification* — gives Voidcaller a "desperate survival" option: when Madness is too high, enter a defensive state that burns it off safely.
- CoA's Cultist "Influence" spec — *dark healer with absorb shields, Edict spells that grant allies procs, Yogg-Saron devotion* — is a healer variant the Cultist spec can reference for its empathetic/transfer themes.
- CoA's Cultist "Corruption" spec — *caster weaving shadow DoTs + direct damage, balancing Insanity for massive damage boost without dying* — this is pure Voidcaller's core loop. The "balance on the knife's edge" is the spec's identity anchor.
- CoA's Cultist "shadow bursts vs holy enemies" translates to "wyrd bursts vs ember-wielding enemies" — a damage-type exploitation. All three specs can reference this.

**Spec Polish Proposals**:

**Voidcaller** — *The Screaming Evangelist*
- **Identity tighten**: Your faith is loud because doubt is louder. You drown out the silence by smashing pulpits. You are not a priest — you are a *cathedral collapse*.
- **Flair upgrade**: Your voice echoes with a secondary tone — the Voice's answer. At high Madness, your silhouette has a second shadow that moves independently.
- **Ability concept — Pulpit Shatter**: Slam your focus/staff into the ground. All enemies in 20ft take 3d6 storm and are Deafened for 1 round. Generates 2 Madness.
- **Ability concept — Void Echo**: After you cast a spell, you may spend 2 Madness to cast it again at half power (half dice, same target or nearest valid target).
- **Ability concept — Crescendo of Madness**: When you reach 15+ Madness, your next spell within 2 rounds is a guaranteed crit and produces a 5ft explosion centered on the target dealing half damage to adjacent enemies.

**Deceiver** — *The Whisper Behind the Throne*
- **Identity tighten**: You do not need to kill them. You need them to *kill each other*. Every word you speak is a seed of betrayal.
- **Flair upgrade**: Your voice is always slightly too quiet. Listeners must lean in to hear your — and then they cannot unhear.
- **Ability concept — Fractured Loyalty**: Target enemy makes a Spirit save. On fail, they attack the nearest creature (ally or enemy) for 1 round. If they have no allies, they attack themselves for 1d6 wyrd. Costs 3 Madness.
- **Ability concept — Doubt Injection**: As a free action, whisper to one enemy. Their next attack roll is at disadvantage (they hesitate). If it misses, they take 1d6 wyrd (self-doubt). Costs 1 Madness.
- **Ability concept — Maddening Transfer**: Remove one debuff from an ally and transfer it to an enemy. If the debuff was mind-affecting, it lasts 1 round longer on the enemy.

**Cultist** — *The Patient Shepherd*
- **Identity tighten**: Your rituals do not end. They *linger*. You apply decay like a gardener applies mulch — slowly, inevitably, covering everything.
- **Flair upgrade**: Your dark rites leave visible sigils on the ground that fade over time. They pulse with a slow, heartbeat rhythm.
- **Ability concept — Lingering Rite**: Cast a ritual that lasts 4 rounds. Each round, it deals 1d6 blight to all enemies in the zone and heals you for 1d6. You cannot move while channeling. Can be cancelled early for a 3d6 burst.
- **Ability concept — Empathetic Covenant**: Link yourself to one ally. For 3 rounds, 50% of damage they take is redirected to you (reduced by your DR). You gain 1 Madness per redirection. If you die, the link breaks and they take no further damage for 1 round.
- **Ability concept — Rite of Unmaking**: Target enemy takes 1d6 wyrd at the start of each of your turns. Each tick reduces their saves by 1. After 4 ticks, they make a CON save or are Petrified for 1 round.

---

### 8. Gambit

**CoA Source**: Rune Master (glyphic — rules manipulation) + Chronomancer (artificer — fate control)

**Current 3 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Probability Savant | Mathematical Foresight | 13 FP cap, peek at enemy saves, fixed psychic cost |
| High Roller | Apocalyptic Stakes | 21 FP cap, self-damage = FP, high volatility |
| Karmic Weaver | Thread Manipulation | 15 FP cap, link creatures, debt = blight damage |

**CoA-Extracted Ideas**:
- CoA's Rune Master "Engravement" spec — *weapon-enhancement runes* — gives Gambit a "loaded weapon" feel: spend FP to temporarily enchant an ally's weapon.
- CoA's Chronomancer "Artificer" — *time-constructs* — gives Karmic Weaver a "fate-construct" summon angle.
- The core CoA-Rune-Master idea of *carving rules into reality* directly maps to Gambit's deck-as-reality-manipulation aesthetic.

**Spec Polish Proposals**:

**Probability Savant** — *The Calculating Architect*
- **Identity tighten**: Fate is not random. It is a *function*, and you have solved the equation. Every die roll is a variable you have accounted for.
- **Flair upgrade**: Your floating cards constantly shift and reorganize. Numbers flicker on their faces as you recalculate odds.
- **Ability concept — Pre-Roll**: Spend 2 FP. The next d20 roll you make within 1 round can be replaced with a 15. Only useable once per turn.
- **Ability concept — Calculated Gambit**: At the start of combat, predict the outcome of one event: "first enemy to die," "largest hit dealt," "first crit." If correct at end of combat, gain a permanent +1 FP cap for the next combat. If wrong, lose 2 FP.
- **Ability concept — Safe Bet**: Spend 3 FP. You gain +3 to your next save. If the save succeeds, regain 1 FP.

**High Roller** — *The Unstable Element*
- **Identity tighten**: You do not calculate odds. You *defy* them. Pascal's Wager was for people who were afraid to bet everything.
- **Flair upgrade**: When you deal self-damage, your cards burst into flame and reform. At max Karmic Debt, the cards bleed.
- **Ability concept — All-In**: Spend ALL your FP (minimum 5). Gain a single use of a spell that deals 2d8 per FP spent (choose one target) or 1d8 per FP spent (all enemies in 15ft). Take 1d6 self-damage. Cannot be used below 50% HP.
- **Ability concept — Debt Spiral**: When you gain Karmic Debt from self-damage, gain +2 FP instead of +1. The debt doubles on your next failed save.
- **Ability concept — Dead Man's Hand**: When you are reduced to 0 HP, you can spend 10 FP to stay at 1 HP instead. Lose all FP. This triggers Cosmic Bankruptcy if it would put you over debt cap.

**Karmic Weaver** — *The Twisted Thread*
- **Identity tighten**: What happens to one happens to all. You are not a gambler — you are a *fisher of consequences*, pulling the line tight until everything is tangled together.
- **Flair upgrade**: Linked targets have a visible glowing thread connecting them. The thread pulses faster as debt accumulates.
- **Ability concept — Shared Karma**: Link two enemies. When one takes damage, the other takes 1d6 wyrd. When you spend FP, both linked enemies take 1d4 wyrd. Max 2 links.
- **Ability concept — Thread Sever**: Spend 5 FP to instantly deal damage to an enemy equal to the Karmic Debt of the highest-debt creature in your link network (minimum 2d6). Resets that creature's debt.
- **Ability concept — Fate's Bargain**: Transfer up to 3 FP to an ally. For the next 2 rounds, any time that ally rolls a natural 1, you gain 1 Karmic Debt and they reroll. If they roll a natural 20, you gain 1 FP instead.

---

### 9. Harbinger

**CoA Source**: Reaper (harvest / souls / domination) + Felsworn (infernal / slayer / tyrant) + Witch Hunter (darkness)

**Current 3 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Wild Prophet | Area Surges & Prophecy Shrapnel | AoE prophecies, Mayhem per target, volatility |
| Death's Seer | Single-Target Death Prophecies | Stacked doom, armor shred, precision nuke |
| Fate Rift | Table Manipulation & Escalating Doom | Doom aura, escalating damage, late spike |

**CoA-Extracted Ideas**:
- CoA's Reaper "Harvest" spec — *soul collection, stealth, bleed-fear* — gives Death's Seer a "soul executioner" lean: kill to collect, collected souls fuel bigger kills.
- CoA's Reaper "Souls" spec — *soul resource management* — gives Wild Prophet a way to bank and spend "soul fragments" (Mayhem shards) for controlled bursts.
- CoA's Reaper "Domination" spec — *fear, control, master-slave* — gives Fate Rift a fear-aura control angle alongside its damage.
- CoA's Felsworn "Infernal" — *demon-pact, infernal armor* — gives Wild Prophet a survivability toggle.

**Spec Polish Proposals**:

**Wild Prophet** — *The Uncontainable Eruption*
- **Identity tighten**: You are a walking apocalypse hypothesis. Prophecies do not predict disaster — they *leak* disaster into the present.
- **Flair upgrade**: Mayhem manifests as visible fractures in the air around you — small spatial cracks that weep purple light.
- **Ability concept — Prophetic Overload**: When an area prophecy hits 3+ targets, you can detonate it early. It deals +2d6 per target caught in the initial blast but no longer ticks. You gain 3 bonus Mayhem.
- **Ability concept — Cascade Prophecy**: Your first area prophecy that hits a target applies a secondary 1d4 storm/tick prophecy on that target. If the secondary also hits, it spreads to two adjacent enemies.
- **Ability concept — Doom Leak**: Once per turn, when you take damage, generate 1 Mayhem. If the damage was from an enemy hit, generate 2 Mayhem.

**Death's Seer** — *The Soul Executioner*
- **Identity tighten**: You do not fight until the enemy is dead. You *name the hour of their death*, and reality obliges. Each prophecy is a countdown the universe respects.
- **Flair upgrade**: Enemies you have prophesied develop a visible black hourglass above their head. Each tick breaks off a piece of the glass.
- **Ability concept — Naming Hour**: Spend 1 turn marking a target (free action). Your next spell against that target has a bonus 2d8 blight. If it kills them, gain 3 bonus Mayhem. Cannot be used against same target twice.
- **Ability concept — Armor Erosion**: Every prophecy tick on a target reduces their DR by 1 (max 5). Ticks from different prophecies stack the erosion.
- **Ability concept — Death's Due**: When a prophesied enemy dies, you can transfer 1 remaining tick to a new enemy within 30ft. The new enemy takes damage as if the prophecy had been on them for 2 ticks already.

**Fate Rift** — *The Crushing Presence*
- **Identity tighten**: You do not need to attack. Your *existence* is a pressure front. Enemies near you feel the weight of every wrong choice they have ever made.
- **Flair upgrade**: Your Doom Aura is visible as a shimmering distortion — heat-haze that smells of ozone and old regret.
- **Ability concept — Doom Aura (upgrade)**: Enemies within 15ft have -1 to all saves per 4 Mayhem you hold (max -5). At 20 Mayhem, the aura's radius expands to 25ft.
- **Ability concept — Weight of Years**: Target enemy is Slowed by 15ft and has disadvantage on concentration checks for 1 round. Costs 3 Mayhem. If they fail a check, they take 2d6 wyrd.
- **Ability concept — Inevitable End**: As a reaction when a creature within 30ft dies, spend 5 Mayhem to force all enemies within 20ft of the death to make a Spirit save or be Frightened of you for 2 rounds.

---

### 10. Inquisitor

**CoA Source**: Witch Hunter (boltser / inquisitor / black knight / darkness) + Templar (oathkeeper / zealot / crusader) + Felsworn (slayer)

**Current 3 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Witch Hammer | Stealth Assassination + Demon Swarm | Bind 4 demons, stealth auto-crit, swarm damage |
| Iron Verdict | Anti-Magic Bulwark + Single Powerful Demon | Bind 1 greater demon, anti-magic zones, spell counter |
| Hollow Saint | Relentless Pursuit + Internal Demon Channeling | Internal demon channeling, stat buffs, cannot be slowed |

**CoA-Extracted Ideas**:
- CoA's Witch Hunter "Black Knight" spec — *dodge/parry melee bruiser* — gives Hollow Saint a tankier, riposte-focused play pattern alongside its internal demon.
- CoA's Witch Hunter "Boltser" — *crossbow executioner with tonics* — gives Witch Hammer a ranged execution angle: silver bolts that punish supernatural targets.
- CoA's Templar "Oathkeeper" — *holy guardian, shield and sword* — gives Iron Verdict a stronger "warden of magic" identity: they do not just counter spells, they *guard allies from magic entirely*.
- CoA's Templar "Crusader" — *two-handed holy juggernaut* — gives Hollow Saint a more aggressive, less stealthy option.

**Spec Polish Proposals**:

**Witch Hammer** — *The Shadow Executioner*
- **Identity tighten**: You do not fight fair. You mark your target from darkness, loose your demons to soften them, then step from shadow to deliver the killing stroke.
- **Flair upgrade**: Your bound demons are semi-phantom — visible only when they attack. Your Authority manifests as a slow-burning silver flame in your eyes.
- **Ability concept — Silver Bolt**: Your ranged attack deals +2d6 ember to supernatural enemies (demons, void-touched, undead). On a crit, it also Stuns them for 1 round. Costs 1 Authority.
- **Ability concept — Pack Hunter**: When 3+ demons attack the same target, they gain Pack Tactics (advantage on attacks). On kill, the target is torn apart, scattering a 10ft radius hazard that Slows enemies for 1 round.
- **Ability concept — Shadow Recall**: As a free action, recall all bound demons to your position. They arrive instantly, dealing 1d6 blight to enemies within 5ft of you upon arrival.

**Iron Verdict** — *The Anti-Magic Fortress*
- **Identity tighten**: Magic dies where you stand. Spellcasters look at you and see their own mortality reflected. You are a walking dead zone.
- **Flair upgrade**: Your anti-magic zones look like heat shimmer — air visibly thickens, sounds muffle within, colors desaturate.
- **Ability concept — Null-Salts Strike**: Your melee attack dispels one active buff on the target. If the target is a spellcaster, they lose 1d4 mana. Costs 1 Authority.
- **Ability concept — Greater Dead Zone**: Create a 20ft radius anti-magic zone centered on you. Spellcasters inside take 2d6 storm per round. Spells cast into the zone have a 25% failure chance. Costs 2 Authority to maintain per round.
- **Ability concept — Demon's Shield**: Your bound greater demon can take one attack meant for you per round. If it does, the demon takes the damage and becomes Frenzied (+1d8 damage on its next attack).

**Hollow Saint** — *The Unstoppable Hunter*
- **Identity tighten**: The demon is inside you. You do not control it — you *aim* it. It makes you faster, harder, more vicious. The cost is that it is always listening.
- **Flair upgrade**: When your Internal Dominance Die degrades, your eyes change color — from natural to pale silver to full black. At d6 or lower, your voice has a secondary tone.
- **Ability concept — Internal Channel Overload**: When your Internal DD drops to d4 or lower, your melee attacks deal +3d8 blight but you take 1d6 wyrd per attack. You cannot end combat early.
- **Ability concept — Relentless Pursuit**: You gain +5ft speed per Authority level. While at 3+ Authority, you can move through enemy spaces and do not provoke opportunity attacks.
- **Ability concept — Hollow Sacrifice**: As a reaction when an ally within 10ft takes damage, you can step in and take the damage instead. If you do, your Internal DD degrades by 1 step. The ally gains +2 to their next attack.

---

### 11. Lunarch

**CoA Source**: Star Caller (moon priest / sentinel / warden / moon guard) + Sun Cleric (piety / valkyrie / saraphim)

**Current 3 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Hollow Sentinel | Precision Killer | Ranged armor-ignoring strikes, mark targets, Full Moon crits |
| Void Caller | (alien geometry / parasite casting) | Ranged wyrd caster, phase-manipulation |
| Sanguine Warden | (parasite tank / sustain) | Melee range, parasite-fueled durability |

**CoA-Extracted Ideas**:
- CoA's Star Caller has *four* specs (moon priest / sentinel / warden / moon guard), offering 4 distinct lunar identities. Two of them — sentinel and warden — already match Hollow Sentinel and Sanguine Warden. The "moon priest" (healing/support) angle is the lane your specs could expand into via ability choices.
- CoA's "channeling the moon's magic into arrows and glaives" is *already* Lunarch's Hollow Sentinel identity. Double down on the archer-moon harmony: the parasite does not corrupt the Lunarch — it *resonates* with lunar cycles.
- CoA's Sun Cleric "Valkyrie" spec (dual-wield DPS) and "Seraphim" spec (shield tank) are inversions — holy instead of void, but mechanically parallel to Void Caller (DPS) and Sanguine Warden (tank). This parallelism is useful for designing ember-based counters.

**Spec Polish Proposals**:

**Hollow Sentinel** — *The Starlight Marksman*
- **Identity tighten**: Your eyes are gone — replaced by starlight geometry. You do not aim; you *calculate trajectories through the parasite's lattice*. Every shot is inevitable.
- **Flair upgrade**: During Full Moon, your arrows leave visible starlight trails. Marked targets glow with a pinprick of light at their weak point.
- **Ability concept — Gravity Shot**: Your ranged attack ignores 50% DR against a Marked target. If it kills, the mark transfers to the nearest enemy. Costs 1 Sanity.
- **Ability concept — Three-Shot Sequence**: Spend a full action to fire three shots. First shot: mark. Second shot: deal +1d6 wyrd. Third shot: auto-crit if all three hit the same target. Cannot move between shots.
- **Ability concept — Lunar Phase Shift**: As a free action, consume 1 Full Moon charge to make your next shot phase through cover. The arrow ignores half cover and deals +2d6 to targets in full cover.

**Void Caller** — *The Alien Geometry*
- **Identity tighten**: You do not shoot arrows — you *tear holes in reality* and let the void bleed through. The parasite sees the world as a lattice of angles; you attack the angles themselves.
- **Flair upgrade**: Your spells do not fly in straight lines — they turn corners, split, and rejoin. The air smells of ozone and distant stone.
- **Ability concept — Phase Bolt**: Your bolt deals 2d6 wyrd and phases through the first enemy it hits to strike a second enemy behind them for 1d6. If only one target is available, the second hit doubles back for 2d6.
- **Ability concept — Reality Tear**: Create a 10ft dimensional tear at a point within 60ft. Enemies within 10ft of the tear are Pulled 5ft toward it. The tear lasts 2 rounds. Costs 1 Sanity per round.
- **Ability concept — Transition Shock**: When an enemy moves through your Reality Tear, they take 2d6 storm and are Slowed for 1 round. You can trigger this as a reaction.

**Sanguine Warden** — *The Feeding Guardian*
- **Identity tighten**: The parasite wants to feed. You let it feed on your enemies while it protects your allies. Every drop of blood your enemy loses is a drop the parasite returns to you.
- **Flair upgrade**: Your attacks leave a faint red mist. The parasite's tendrils extend from your arms to siphon blood from wounded enemies at range.
- **Ability concept — Blood Siphon (parasite pull)**: Pull a bleeding enemy 10ft toward you. If they end the pull within 5ft, the parasite drains them for 1d6 and heals you for the same. Costs 1 Sanity.
- **Ability concept — Parasitic Bulwark**: While you have 3+ Sanity, the parasite forms a protective membrane under your skin. You gain DR 3 against physical attacks. When you take damage, the parasite screeches, dealing 1d4 wyrd to the attacker.
- **Ability concept — Feeding Frenzy**: When you kill an enemy, the parasite feasts. You regain 2 Sanity and gain +10ft speed for 1 round. If you kill with a melee attack, the feast also heals you for 1d6.

---

### 12. Martyr

**CoA Source**: Sun Cleric (piety / valkyrie / blessings / saraphim) + Guardian (gladiator / inspiration / vanguard) + Blood Mage (eternal)

**Current 3+1 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Redemption | Healing Through Sacrifice | Convert HP to healing, protective buffs, ally range |
| Zealot | Righteous Fury | Wrath Tithe self-harm for ember damage, offensive suffering |
| Ascetic | (self-purification / debuff tank) | Debuff removal, self-cleansing, damage reduction |
| Ironclad | (absorbed Dreadnaught — 4th spec) | Devotion-scaled DR, heat aura, CC immunity |

**CoA-Extracted Ideas**:
- CoA's Guardian "Inspiration" spec — *rallying allies with buffs* — gives Redemption a more proactive buff identity: heal by *inspiring*, not just by bleeding.
- CoA's Guardian "Gladiator" spec — *weapon-master tank* — gives Zealot a "righteous weapon-master" option (shield + sword combo with holy flourishes).
- CoA's Sun Cleric "Seraphim" spec — *righteous slam, seraphic bulwark, tank* — directly parallels Ironclad. Lean into the wing motif for flair.
- CoA's Blood Mage "Eternal" spec — *sustain through endless rebirth* — gives Ascetic a harder-to-kill regenerative identity.

**Spec Polish Proposals**:

**Redemption** — *The Wounded Shepherd*
- **Identity tighten**: You do not heal with magic. You heal with *transfer*. Every wound on an ally is a wound you chose. Every scar on your body is someone else who lived.
- **Flair upgrade**: When you heal, the wound transfers visibly — it opens on your flesh as it closes on theirs. Your body is a medical ledger of the party's survival.
- **Ability concept — Rallying Cry**: As a free action, all allies within 30ft gain +2 to attack rolls for 1 round. You take 1d4 recoil. If anyone kills an enemy this round, you regain 1 Devotion.
- **Ability concept — Shared Vigor**: Spend 2 Devotion to grant one ally temporary HP equal to your current HP (up to 10). While they have this HP, they also have your DR for physical damage.
- **Ability concept — Martyr's Covenant**: Designate a covenant partner. For 3 rounds, 50% of damage they take is redirected to you (reduced by your DR). When you heal yourself during this period, they heal for half. The covenant breaks if you go below 25% HP.

**Zealot** — *The Burning Scourge*
- **Identity tighten**: Your faith is a *blade*, and every swing cuts both ways. You do not ask whether the suffering is worth it — you ask only *how much more you can spend*.
- **Flair upgrade**: When you deal Wrath Tithe ember damage, your weapon glows orange-hot. Self-harm damage manifests as steam rising from your own wounds.
- **Ability concept — Flaming Flourish**: After a melee hit, you may spin your weapon. All enemies within 5ft take 1d6 ember. Costs 1 Devotion. If you took self-damage this turn, the flourish deals +1d6.
- **Ability concept — Wrath Cascade**: When Wrath Tithe procs, you may redirect half the self-damage to one enemy within 5ft as bonus ember damage. They must make a CON save or be Blinded by holy light for 1 round.
- **Ability concept — Purifying Charge**: Charge up to 30ft in a straight line. Enemies in your path take 2d6 ember + 1d6 per Devotion spent (max 3). You take half the damage you deal as self-harm.

**Ascetic** — *The Fortress of Will*
- **Identity tighten**: Pain is not power — it is *fuel*. You do not spend your suffering; you *store* it. Layers of scarred flesh that grow thicker with every blow you refuse to feel.
- **Flair upgrade**: Your skin is a map of pale, layered scar tissue. Debuffs you cleanse leave visible burn marks. At high Devotion, your silhouette glows with a faint internal light.
- **Ability concept — Cleanse Purge**: As a free action, remove one debuff from yourself. You take 1d6 radiant damage. If the debuff was magical (blight/wyrd), you cleanse it and deal 1d6 to the caster.
- **Ability concept — Steel Constitution**: When you fail a save against a physical condition (stun, slow, fear), you may reroll at the cost of 2 Devotion. If the second roll succeeds, the condition is negated entirely, but you are Exhausted for 1 round.
- **Ability concept — Will-Forged Shell**: While you have 5+ Devotion, you cannot be reduced below 1 HP by a single instance of damage. The shell shatters (reducing Devotion to 0) but you survive. 1/combat.

---

### 13. Minstrel

**CoA Source**: Guardian (inspiration — empowering allies) + Star Caller (moon priest — healing through song/chant) + Rune Master (glyphic — rules manipulation through sound)

**Current 3 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Battlechoir | War Songs & Aggressive Support | Damage amplification, offensive cadences, war drums |
| Soulsinger | Healing Melodies & Emotional Magic | Sustained healing, emotional manipulation, protective support |
| Dissonance | (discord / debuff / psychological warfare) | Debuff through sound, confusion, enemy disruption |

**CoA-Extracted Ideas**:
- CoA's Guardian "Inspiration" spec — *rally allies with buffs* — is exactly Battlechoir. Lean harder: Battlechoir should be the spec that makes *the whole party deal more damage*, not just one target.
- CoA's "support role" concept of *dealing damage while buffing allies* is Dissonance's lane. They should be the "I hurt you AND help them" spec.
- CoA's Star Caller "moon priest" — *healing through lunar chants* — maps to Soulsinger. The moon/parasite angle fits Lunarch better, but the *chant-as-healing* mechanic is pure Soulsinger.

**Spec Polish Proposals**:

**Battlechoir** — *The War Drummer*
- **Identity tighten**: You do not play for an audience. You play for *victory*. Every beat is a command, every chord a tactical order. The party moves to your rhythm.
- **Flair upgrade**: War drums vibrate visibly in the air. Allies affected by your cadences move in sync with the beat.
- **Ability concept — Tactical March**: All allies within 30ft gain +10ft speed and +1 AC for 2 rounds. You cannot move during this time (locked in the drum groove).
- **Ability concept — Crescendo of War**: After 3 successful ally attacks while under your buffs, your next cadence is free and affects an additional 15ft radius.
- **Ability concept — The Killing Note**: Your offensive cadence deals 3d6 storm to all enemies in a 20ft cone. Allies in the cone gain +2 to hit for 1 round. Costs 1 Cadence charge.

**Soulsinger** — *The Grief-Weaver*
- **Identity tighten**: Your songs are not beautiful. They are *necessary*. Each melody is a thread pulled from the fabric of loss, woven back into living flesh.
- **Flair upgrade**: When you heal, the melody is audible as a low, resonant hum. It does not cheer — it *insists*. "Stay. Stay. Stay."
- **Ability concept — Lament of the Wounded**: All allies within 30ft regain 1d6 HP. The melody lingers for 2 rounds — allies who take damage during this time regain another 1d6 at the start of your next turn.
- **Ability concept — Harmony of Burden**: Share the HP recovery from your next heal with all allies within 15ft. Each ally gains half the heal value. Your instrument takes 1d4 stress damage (cannot use this ability if instrument is damaged).
- **Ability concept — Soulsinger's Reprieve**: Target ally recovers from one non-permanent status condition (Stun, Fear, Charm, Poison, Bleed). They gain 1d6 temp HP. You take 1d4 psychic (the memory of their pain).

**Dissonance** — *The Discordant Shriek*
- **Identity tighten**: You play the notes *between* the notes. The frequencies that make teeth ache. The sounds that crawl under the skin and live there.
- **Flair upgrade**: Your spells sound like nails on slate, feedback loops, the scrape of bone on stone. Enemies flinch when you play.
- **Ability concept — Destabilizing Frequency**: Target enemy has disadvantage on their next attack and takes 1d6 wyrd. If the attack misses, the wyrd damage doubles. Costs 1 Cadence.
- **Ability concept — Cacophony**: All enemies in 20ft make a CON save or are Deafened and take 2d6 storm. Deafened enemies have disadvantage on concentration checks and cannot benefit from allied Bardic Inspiration-type effects.
- **Ability concept — Resonant Feedback**: When an enemy hits an ally, you can play a shriek as a reaction. The attacker takes 1d6 storm per stack of Dissonance you have (max 3). The stacks reset.

---

### 14. Plaguebringer

**CoA Source**: Venomancer (fortitude / stalking / rotweaving / vazier) + Necromancer (death / animation / rhyme) + Blood Mage (fleshweaving)

**Current 3 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Virulent Spreader | The Swarm Gardener | Cascade contagion, AoE blight, exponential spread |
| Torment Weaver | The Psychic Spider | Linked minds, psychic web, shared rot |
| Decay Harbinger | The Devastating Attritionist | Permanent stacks, permanent stat deterioration |

**CoA-Extracted Ideas**:
- CoA's Venomancer "Rotweaving" spec — *petrification through decay* — is pure Decay Harbinger. Add a capstone: at Stage 4+ on any target, they begin Petrifying (paralyzed, takes bonus damage from shattering).
- CoA's Venomancer "Vazier" spec — *commander of insect swarms, tactical plague-general* — is a flavor overlay any Plaguebringer can use: your plague is your army.
- CoA's Venomancer "Parasite" ability — *burrow into an enemy, control them from inside* — is an endgame ultimate for Torment Weaver: infest the biggest enemy, puppet them.
- CoA's Necromancer multi-pet command — *fight alongside your minions* — is less relevant since Plaguebringer doesn't summon minions, but the *affliction-as-minion* metaphor (each DoT is a "pet" that attacks) is a fun framing.

**Spec Polish Proposals**:

**Virulent Spreader** — *The Contagion*
- **Identity tighten**: You do not attack enemies. You *inoculate the battlefield*. Given enough time, everything in your zone will be bleeding from the same wound.
- **Flair upgrade**: Your plagues are visible as a faint green-grey haze. Infected enemies cough, stumble, and leave trails of spore-cloud.
- **Ability concept — Plague Cascade**: When one of your DoTs ticks on an enemy, it has a 25% chance to jump to an adjacent enemy as a Stage 0 seed. The chance increases to 50% if the original target dies.
- **Ability concept — Field Seeding**: As a standard action, apply your base affliction to all enemies within 15ft. Cost: 3 Virulence. Spread chance doubled for 1 round.
- **Ability concept — Plague Burst**: Detonate all active plagues in a 15ft radius. Each Stage deals 1d6 blight per active affliction (max 4d6 per enemy). All plagues on affected targets are consumed.

**Torment Weaver** — *The Psychic Spider*
- **Identity tighten**: You do not kill bodies. You collapse *minds*. Your targets are connected by a web; damage one, and the whole web screams.
- **Flair upgrade**: The psychic web is visible as shimmering threads between linked targets. When a link activates, the thread pulses with light.
- **Ability concept — Neural Link**: Link up to 3 enemies. When you apply a DoT to one, all linked targets receive a Stage 0 version. If the DoT ticks on one, all linked targets take 1d4 wyrd per linked target (max 3d4). Costs 1 Virulence per link per turn.
- **Ability concept — Mind Fracture**: Target linked enemy makes a WIS save. On fail, they are Confused for 1 round (attack nearest creature). On success, they take 2d6 wyrd but are not confused. Costs 2 Virulence.
- **Ability concept — Parasitic Puppet**: Target an enemy that has been afflicted for 3+ rounds. Make a contested WILL save. On success, you control their movement for 1 round. They cannot attack allies, but you can make them attack enemies. On failure, you take 3d6 psychic backlash.

**Decay Harbinger** — *The Eternal Rot*
- **Identity tighten**: Your rot does not end. It does not climax. It *persists*. Other Plaguebringers kill their enemies — you make them *wish* they were dead.
- **Flair upgrade**: Permanently decayed targets develop visible black veins, withered limbs, and a sunken pallor that does not recover.
- **Ability concept — Permanent Stage**: When you push an affliction past Stage 3, it becomes Permanent. It does not expire and cannot be dispelled. The target takes ongoing damage each round equal to the Stage 3 value + 1 per round the permanent state lasts.
- **Ability concept — Attrition Harvest**: When a permanently decayed enemy dies, you regain 2 Virulence and the enemy's corpse explodes, applying Stage 0 affliction to all enemies within 10ft.
- **Ability concept — Withering Presence**: Enemies within 15ft of you have their healing reduced by 50%. Afflicted enemies within this radius take +1d6 per tick. You move at half speed while this aura is active.

---

### 15. Pyrofiend

**CoA Source**: Pyromancer (flame weaving / incineration / draconic) + Knight of Xoroth (war / hellfire / defiance) + Stormbringer (maltorm)

**Current 3 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Inferno | Pure Destruction | Burst damage, fast ascension, execute |
| Wildfire | Spreading Chaos | AoE, DoT spread, cascading fire |
| The Apostate's Path | (resistance / demonic defiance) | Scathrach resistance, inverted ascension |

**CoA-Extracted Ideas**:
- CoA's Pyromancer "Phoenix Feather" healing — *fire that heals instead of damages* — is the single richest extraction for Pyrofiend. Give Apostate (or any spec) an ability that converts Inferno Level into *healing* instead of damage for one turn.
- CoA's Pyromancer "Draconic" spec — *dragon-themed fire, breath weapons, scales* — is a strong flair upgrade for Wildfire. Your fire is not demonic — it is *draconic*.
- CoA's Knight of Xoroth "Hellfire" — *searing foes with hellfire, carving flesh* — is Inferno's lane. Lean into the "hellfire" vs "holy ember" distinction.
- CoA's Knight of Xoroth "War" — *melee bleeds, butcher hooks, health regen from flaying* — gives Inferno a bleed-and-drag angle alongside its burn.
- CoA's Knight of Xoroth "Defiance" — *demon-pact tank with Hellgates, imps, abyssal infernals* — gives Wildfire a demon-summoning flair option.
- CoA's Knight of Xoroth "Shadowflame Heart" — *ring that increases chase-down damage* — is a relic item idea (see Worldforged section).

**Spec Polish Proposals**:

**Inferno** — *The Demon's Vessel*
- **Identity tighten**: Scathrach does not whisper. Scathrach *screams*. You are the vessel for an apocalypse that wants out. Every ascension is a compromise with the thing inside you.
- **Flair upgrade**: At Inferno Level 5+, your shadow has horns. At Level 8+, your voice doubles. At Level 10, your eyes are solid ember.
- **Ability concept — Hellfire Surge**: At Inferno Level 5+, your next spell deals +3d6 ember and ignores fire resistance. You take 1d6 recoil (Scathrach's hunger). Costs 1 Ascension level.
- **Ability concept — Infernal Execute**: When you cast a fire spell against a target below 30% HP, you may spend 2 Inferno Levels to double the spell's fire damage dice (e.g., 4d6 becomes 8d6). If the target survives, you lose an additional 2 levels.
- **Ability concept — Scathrach's Demand**: Once per combat, when you would be reduced to 0 HP, you may spend all your Inferno Levels to stay at 1 HP instead. Scathrach roars through you — all enemies within 20ft take 1d6 ember per level spent (max 10d6). You descend to Level 0.

**Wildfire** — *The Dragon's Breath*
- **Identity tighten**: Your fire is not borrowed from a demon. It is *yours*. It spreads because fire spreads. It burns because things burn.
- **Flair upgrade**: Wildfire flames are bright orange-gold (not the red-black of Inferno). They catch naturally — dry grass, wood, cloth — and spread realistically.
- **Ability concept — Cinder Jump**: When your DoT ticks on an enemy, it has a 30% chance to jump to a creature within 5ft of the target as a 1-round DoT (half damage). Flame-Wreathed enemies always trigger the jump.
- **Ability concept — Breath of Embers**: 15ft cone, 3d6 ember damage. Enemies hit are Flame-Wreathed (take +1d6 ember from your next fire spell). Costs 1 Inferno Level. Can be used as a free action if you are at Level 6+.
- **Ability concept — Living Wildfire**: Your fire spells leave patches of burning ground (5ft radius, 1d4 ember per turn, 2 rounds). Enemies moving through take damage. Allies are unaffected. Max 3 patches.

**The Apostate's Path** — *The Heretic's Furnace*
- **Identity tighten**: Scathrach says you are its vessel. You disagree. Every scrap of power you take from the demon is turned against it. You are not possessed — you are *poisoning the demon*.
- **Flair upgrade**: Apostate flames are pale blue-white (not red, not gold). They burn things that should not burn — stone, water, air. Scathrach's voice, when it comes, sounds *worried*.
- **Ability concept — Phoenix's Mercy**: Instead of dealing damage with a fire spell, you may convert the spell's ember damage into healing. For every 2d6 damaged that would have been dealt, heal the target for 1d6. Costs 1 Inferno Level and 1d6 self-harm. The flame is cool to the touch.
- **Ability concept — Burnout Purge**: As a free action, reset your Inferno Level to 0. For each level lost, you cleanse one debuff from yourself and gain +1 to saves for 2 rounds. Scathrach hisses but cannot stop you.
- **Ability concept — Heretic's Rebuke**: When a demonic or infernal enemy attacks you, you may spend 2 Inferno Levels as a reaction. The attacker takes 3d6 ember damage and is Frightened of you for 1 round. Apostates do not bow.

---

### 16. Revenant

**CoA Source**: Necromancer (death / animation / rhyme) + Reaper (harvest / souls) + Blood Mage (sanguine / eternal)

**Current 3 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Sanguine Harvest | Aggressive Life Drain + Spectral Army | Melee drain, HP sacrifice, specters from kills |
| Frost Sovereign | Freeze-Shatter Loop + Frost Control | Ranged frost/blight caster, freeze-detonate loop |
| Phylactery Anchor | Enhanced Resurrection + Psychic/Frost Control | Tankiest Revenant, strategic death, phylactery management |

**CoA-Extracted Ideas**:
- CoA's Necromancer "multi-pet command" — *multiple undead minions with tactical control* — is already Sanguine Harvest's spectral army. Lean into tactical minion micro: "Rally Specters" — all specters attack the same target.
- CoA's Necromancer "Rhyme" spec — *runic necromancy, chant-based death magic* — is a flavor overlay for Frost Sovereign. The "freeze-shatter" loop becomes a "chant-death" loop: each spell is a verse, and the shatter is the final rhyme.
- CoA's Reaper "Souls" — *soul resource as currency* — is already Death Toll. Give each spec a unique spend: Sanguine Harvest spends Death Toll for specters, Frost Sovereign for freeze duration, Phylactery Anchor for phylactery capacity.
- CoA's Blood Mage "Eternal" — *sustain through endless rebirth* — directly maps to Phylactery Anchor. Every death is a planned tactical event.

**Spec Polish Proposals**:

**Sanguine Harvest** — *The Bleeding General*
- **Identity tighten**: Your blood is a currency. Your specters are an army. You trade one for the other, and the battlefield is your treasury.
- **Flair upgrade**: Your specters share your face — hollow-eyed, warped versions of you. When they attack, they mimic your last gesture.
- **Ability concept — Blood Tithe**: Pay 1d6 HP to grant all active specters +2 to attack for 2 rounds. While the tithe is active, each specter kill refunds 1d4 HP. Death Toll generated by specter kills is shared with you.
- **Ability concept — Sanguine Phalanx**: Specters you control within 15ft of you gain DR 2 and cannot be individually targeted (must target you or the phalanx as a group). The phalanx deals +1d6 on coordinated attacks.
- **Ability concept — Crimson Harvest**: When you kill an enemy, you may choose: gain a specter (if under cap) or heal 2d6. If the kill was with a melee attack, do both.

**Frost Sovereign** — *The Rhyming Dirge*
- **Identity tighten**: You do not cast spells. You recite *verses of ending*. Each verse freezes your target a little more. The last verse shatters them.
- **Flair upgrade**: Your spells have audible rhyme-schemes — each line of the "chant" is a different frost spell. The third verse always arrives faster.
- **Ability concept — Verse of Hoarfrost**: Your first spell against a target applies Rime (frost vulnerability — they take +1d6 from your next frost spell). Your second spell freezes them for 1 round. Your third spell shatters them for 4d6 bonus damage. The rhyme resets if you target someone else.
- **Ability concept — Chant of Unmaking**: In Death Shroud, your next 3 spells are cast with +1 dice and cost 1d4 HP less. The third shatters automatically on hit, refunding 1 Death Toll.
- **Ability concept — Permafrost Echo**: When a frozen enemy is killed, their corpse remains frozen for 2 rounds. Enemies moving within 5ft of the corpse are Slowed. You can detonate the corpse early for 2d6 frost in a 10ft radius.

**Phylactery Anchor** — *The Unkillable Strategist*
- **Identity tighten**: You have died before. You will die again. Each death is a planned tactical event. You are not afraid — you are *prepared*.
- **Flair upgrade**: Your phylactery is visible as a faint glow beneath your skin. When it charges, it pulses with a slow, deliberate rhythm.
- **Ability concept — Calculated Demise**: As a free action, designate a "death zone" within 20ft. If you die while within that zone, you resurrect there instantly with 50% of your phylactery's stored HP and freeze all enemies within 15ft for 1 round.
- **Ability concept — Phylactery Transfer**: Store up to 5 HP in an allied creature. If they fall below 0 HP, the phylactery charge activates, healing them for 5 HP instead. Costs 10 Death Toll to set. The charge lasts until used or you rest.
- **Ability concept — Death Toll Overcharge**: When your Death Toll is maxed (20), you may overcharge your phylactery. Until your next death, your spells deal +1d6 blight and your phylactery capacity is doubled. On death, you explode for 5d6 rime in a 20ft radius.

---

### 17. Shaper

**CoA Source**: Venomancer (fortitude / stalking — insectoid shapeshift) + Barbarian (ancestry — primal form) + Primalist (wild walker — animal forms)

**Current 3 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Flow Master | Chimeric Kinetic Fluidity | Rapid shifts, form fusion, reduced transition costs |
| Iron Dancer | Precision Striking & Stolen Traits | Expanded crit, ripostes, harvest enemy traits |
| Primal Shadow | Stealth Burst & Shadow Forms | Stealth burst, Void Predator access, shadow ambush |

**CoA-Extracted Ideas**:
- CoA's Venomancer "insect shapeshift" — *poisonous insect druid with multiple insect forms* — gives Shaper's existing form system a *venomous insectoid* aesthetic for a new form type: "Swarm Form" (poison aura, flight, split into many small pieces).
- CoA's Primalist "Wild Walker" — *wild-shape into totemic animals* — gives Flow Master more distinct form visuals: each form is a different totemic beast, not just a generic "mutated shape."
- CoA's Barbarian "Ancestry" — *spirit warrior channeling ancestors* — gives Iron Dancer a trait-harvest identity: the traits you steal are not biological; they are *ancestral echoes of the enemy's lineage*.

**Spec Polish Proposals**:

**Flow Master** — *The Chimeric Torrent*
- **Identity tighten**: Your body is not one shape. It is *all shapes*. You do not shift between forms — you *flow through them* as a liquid changes vessel.
- **Flair upgrade**: When you transition between forms, intermediate shapes are visible — a humanoid arm becomes a claw becomes a wing becomes a blade, all in one fluid motion.
- **Ability concept — Chimeric Burst**: When you shift forms, deal 1d6 storm to all enemies within 5ft (the sonic boom of your reshaping body). The damage type changes based on the form you shift into (Primal = primal, Void = wyrd, etc.).
- **Ability concept — Dual-Form Stance**: Maintain two forms simultaneously (e.g., Ataxic Flow + Centrifugal Fury). You gain the passive benefits of both but at +1 Body Toll per round. Costs 2 extra Flux to shift while dual.
- **Ability concept — Sonnet of Flesh**: Shift through 3 forms in one turn. Each shift costs 1 less Flux than the last. The third shift triggers a Chimeric Burst that also heals you for 1d6 per form passed through.

**Iron Dancer** — *The Trait Thief*
- **Identity tighten**: Every enemy you kill teaches you something. You do not just survive combat — you *improve*. The enemy's strengths become yours.
- **Flair upgrade**: Harvested traits manifest as temporary physical changes: if you kill a spider, your fingers grow bristles; if you kill a bear, your shoulders broaden.
- **Ability concept — Harvest Essence**: When you kill an enemy, you may take one of their traits. Bear = +2 STR (1 round). Spider = +10ft climb speed (1 round). Troll = regen 1 HP/round (2 rounds). Costs 1 Body Toll per harvest.
- **Ability concept — Essence Parry**: As a reaction, you may adapt your form to an incoming attack. If the attack is physical, gain +2 DR against it (the Iron Dancer grows a carapace). If magical, gain +2 to save (the flesh becomes spell-resistant). Costs 1 Flux.
- **Ability concept — Stolen Momentum**: After a successful riposte, your next attack deals +1d6 per harvested trait currently active (max 3d6).

**Primal Shadow** — *The Void Stalker*
- **Identity tighten**: You are not a person who enters shadows. You are a *shadow that learned to be a person*. The Void Predator is not a form — it is your natural state, and the "human" shape is the mask.
- **Flair upgrade**: When you enter Void Predator, your silhouette stretches, your eyes become hollow, and your movements become angular and insectile — a perfect predator shape.
- **Ability concept — Ambush Cascade**: When you attack from Void Predator, gain +1d6 damage. If the attack kills, you may immediately re-enter Void Predator (free action) and move up to 20ft to a new hiding spot.
- **Ability concept — Shadow Form Mastery**: While in Void Predator, you can pass through enemy spaces and terrain obstacles as if they were difficult terrain (you phase through them). Leaving void predator next to an enemy triggers an Ambush Cascade.
- **Ability concept — Predator's Feast**: When you kill an enemy from Void Predator, you regain 2 Flux and 1 Body Toll is refunded. If the kill was a critical hit, you also regain 1d6 HP (the Void feeds on their life, not yours).

---

### 18. Spellguard

**CoA Source**: Guardian (gladiator / vanguard — tank + protect) + Templar (oathkeeper / crusader — holy defender) + Primalist (mountain king — immovable tank)

**Current 3 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Void-Scarred Bastion | Maximum Containment | Intercept damage, generate Resonance, delayed detonation |
| Entropic Eraser | Violent Refraction | Reflect spells, anti-mage dueling, rapid purge |
| Leyline Devourer | (mana drain / absorption) | Absorb enemy magic, convert to personal mana |

**CoA-Extracted Ideas**:
- CoA's Guardian "Gladiator" spec — *weapon-master tank with dual-wield and taunt* — gives Void-Scarred Bastion a more aggressive tank identity: they do not just absorb damage, they *provoke* it.
- CoA's Guardian "Vanguard" spec — *charge-first, shield-wall tank* — maps to the Bastion's "lead-lined ribcage" identity: they stand at the front and intake magic meant for the party.
- CoA's Templar "Oathkeeper" — *holy shield guardian* — gives Entropic Eraser a Righteous angle: reflecting spells is not just defense — it is *judgment*.
- CoA's Templar "Crusader" — *two-handed holy juggernaut* — is less relevant; Spellguard uses void-glass plating, not holy magic.

**Spec Polish Proposals**:

**Void-Scarred Bastion** — *The Lead-Lined Wall*
- **Identity tighten**: Your job is simple: stand between the party and the apocalypse. Magic enters your chest and does not leave. You are the party's bullet-catcher, and you are very good at it.
- **Flair upgrade**: Absorbed magic is visible as pulsing void-energy under your skin. When you purge, it erupts in a black-violet burst.
- **Ability concept — Gravity Intercept**: As a reaction, redirect any single-target spell targeting an ally within 30ft to yourself. You take the damage at half intensity (reduced by your DR). Gain 1 Resonance.
- **Ability concept — Lead-Lined Cage**: Create a 5ft radius void-ward around you. Allies inside take half magic damage. Magic attacks against anyone inside have a 20% failure chance. You take 1d6 blight per round maintained.
- **Ability concept — Delayed Purge**: Instead of purging immediately, store your accumulated Resonance. When you release (free action), deal 2d6 storm per Resonance stored (max 5) in a 15ft radius centered on you. Allies take half.

**Entropic Eraser** — *The Mirror Knight*
- **Identity tighten**: You do not block magic. You *return it*. Every spell an enemy casts is an invitation for you to show them how it feels on the receiving end.
- **Flair upgrade**: When you reflect a spell, it twists in mid-air — the enemy's own magic contorted and thrown back with interest.
- **Ability concept — Rebound Protocol**: When you make a save against a spell, on success the spell is reflected at the caster at 125% power. On failure, the spell hits you but you take half damage (you redirect part of it away from your body).
- **Ability concept — Counterspell Purge**: As a reaction to an enemy casting within 60ft, you may attempt to counter. Roll a dice-off: your WILL vs their DC. If you win, the spell fizzles and you gain 1 Resonance. If you lose, you take 2d6 storm and the spell resolves.
- **Ability concept — Refraction Field**: For 1 round, any single-target spell targeting you has a 50% chance to instead hit a random enemy within 30ft (you choose which). Costs 2 Resonance per round.

**Leyline Devourer** — *The Mana Leech*
- **Identity tighten**: Magic is a resource. You consume it. Spellcasters are not combatants to you — they are *fuel sources*. Every spell they cast is a gift you take.
- **Flair upgrade**: Your weapon/gloves glow with stolen magic. The more you drain, the brighter they burn. When you purge, the excess energy arcs visibly.
- **Ability concept — Mana Drain**: Your melee attack against a spellcaster drains 1d4 mana from them and adds it to your pool. If you are at max mana, gain 1 Resonance instead.
- **Ability concept — Leeching Field**: Create a 15ft aura. Enemy spells cast within the aura cost 2 extra mana. You gain 1 Resonance each time a spell is cast inside. Allies inside regenerate 1 mana per round.
- **Ability concept — Devour Surge**: When you purge Resonance, you may convert half the purge damage into healing for yourself. The void-glass shatters and reforms, scarred but functional.

---

### 19. Toxicologist

**CoA Source**: Venomancer (rot / stalking / vizier / fortitude) + Tinker (demolition / mechanics / invention) + Witch Doctor (brewing)

**Class Mechanic: Shapeshift Forms** — CoA's Venomancer has multiple poison-themed forms: Spider (stealth assassin), Scorpion (tank with reflecting exoskeleton), Snake (DoT caster), Nerubian (Vizier healing form). Each form changes your ability bar. This is a different approach than Toxicologist's fixed spec — it's a *form-swapping* class.

**Current 3 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Venomancer | Poison Embodiment | Super-concentrated toxins, potent DoTs, poison immunity |
| Gadgeteer | Contraptions & Machines | Deployable traps, contraption network, rapid deployment |
| Saboteur | (sabotage / debuff / disruption) | Enemy debilitation, equipment sabotage, grenadier |

**CoA-Extracted Ideas**:
- CoA's Venomancer "Rot" spec — *Rotweaver form, spread poisons, debilitate with toxic mayhem* — gives Venomancer a "decay-stacking" identity alongside poison: poison does damage, rot (blight) reduces stats. Two-layer DoT system = set up poison, then let rot eat through.
- CoA's Venomancer "Stalking" spec — *Spider Form, burrow underground for invisibility, inject horrific toxins, progression to Serpent Lord / Nerubian / Spider Lord* — gives Saboteur a "shapeshift ambusher" angle: briefly become a venomous creature for one devastating strike.
- CoA's Venomancer "Vizier" spec — *Nerubian healing form, Shadra's Vigil on allies, ritual chanting to speed recovery* — is a healer variant. For Toxicologist, this could add a "potion-master" identity to any spec: you can prepare 1-2 healing concoctions per rest regardless of spec.
- CoA's Venomancer "Fortitude" spec — *Scorpion Form, natural armor, reflect damage through exoskeleton molting stages, block then dish back* — gives Gadgeteer a "reactive armor" gadget: a deployable that absorbs damage and deals it back when destroyed.
- CoA's Tinker "Demolition" spec — *explosive rounds, sapper charges, rocket launchers, hand cannons, cannonballs* — gives Saboteur a "demolitions expert" identity: your saboteur kit is about *controlled demolition* of enemy formations.
- CoA's Tinker "Invention" spec — *deployable beacons with radius effects, nanobots for healing, healing gun* — is a pure-support angle any Toxicologist can reference for their gadget/flask system.
- CoA's Witch Doctor "Brewing" — *mix different potions mid-combat for different buffs, channel voodoo energy beams, place Healing Wards* — is a cross-spec utility all Toxicologists can share: the "Potion Belt" (3 ready-use concoctions per rest, mixed from vials during short rests).

**Spec Polish Proposals**:

**Venomancer** — *The Living Toxin*
- **Identity tighten**: Your blood is poison. Your sweat is poison. Your breath is poison. You are not a person who uses toxins — you are a *person who has become a toxin*.
- **Flair upgrade**: Venomancer's veins are visibly green. When they bleed, the blood sizzles on the ground. Their touch leaves a faint green residue.
- **Ability concept — Potent Rot**: Your blight DoTs also reduce the target's STR or CON by 1 per stage (your choice when you apply). This decay is permanent until the target rests. Max reduction: 5.
- **Ability concept — Venom Cascade**: When a target with your poison is hit by a physical attack, the poison concentrates. Their next poison tick deals +2d6. Cascades can stack (max 3).
- **Ability concept — Lethal Injection**: Melee-range application. The target takes 4d10 blight immediately and 2d10 per round for 3 rounds. DC 18 CON to halve initial damage and reduce DoT to 1d10. Costs 3 Toxin Vials.

**Gadgeteer** — *The Contraption Master*
- **Identity tighten**: You build solutions to problems that do not exist yet. Your contraptions are not weapons — they are *answers* to questions like "what if there were a spike trap here?"
- **Flair upgrade**: Your contraptions are visible as mechanical structures — gears, pistons, glowing vials. They hum and tick audibly. Networked contraptions synchronize their sounds into a rhythm.
- **Ability concept — Rapid Construction**: As a standard action, deploy 2 contraptions within 30ft (one must be within 15ft of you). The second costs 1 less Contraption Part. Max 4 contraptions active.
- **Ability concept — Network Overcharge**: When 3+ contraptions are active and within 20ft of each other, they form a Network. Networked contraptions share trigger zones (triggering one triggers all) and deal +1d6 damage.
- **Ability concept — Scrap Mech**: When you have 4 contraptions deployed, you can collapse them into a wearable mech. For 2 rounds, you gain +2 DR, your melee attacks deal 2d8 storm, and you can move 20ft without provoking. The contraptions are consumed.

**Saboteur** — *The Demolition Expert*
- **Identity tighten**: You do not win by killing enemies. You win by *taking away everything they relied on*. Their armor? Your acid. Their weapon? Your jammer. Their confidence? The explosion they did not hear coming.
- **Flair upgrade**: Your deployed traps are near-invisible — a faint shimmer, a loose stone. Enemies who trigger them are visibly humiliated.
- **Ability concept — Acid Bomb**: Throw an acid vial. 10ft radius. Enemies take 2d6 blight immediately and their DR is reduced by 2 for 2 rounds (the acid eats their armor). Structures take double damage.
- **Ability concept — Trap Network**: Set up to 3 traps as a standard action. Each trap triggers independently. Trap types: *Blast* (2d6 storm, 10ft), *Gas* (1d6 blight + Poisoned, 15ft, 2 rounds), *Net* (Restrained, 1 round, DEX save to break). Costs 2 Contraption Parts per trap.
- **Ability concept — Sabotage Payload**: Your next trap that triggers also applies a debuff based on target type: *Spellcaster* = silence 1 round, *Warrior* = disarmed (weapon dropped), *Beast* = Frightened (runs 30ft away from trap center).

---

### 20. Warden

**CoA Source**: Star Caller (warden — moon-infused guardian) + Guardian (vanguard — defensive frontline) + Templar (oathkeeper — binding oath)

**Current 3+1 Specs**:
| Spec | Theme | Playstyle |
|---|---|---|
| Flayed Stalker | Pain-Channeled Stealth | Stealth lockdown, bleed assassin, chain ambush |
| Iron Gaoler | Spectral Iron Cages | Crowd control, sentinel defense, cage lockdown |
| Relentless Tormentor | (sustained pressure / chain damage) | Sustained damage, chain chases, Tension generation |
| Monolith | (absorbed Titan — 4th spec) | Calcified armor, massive DR, immovable tank |

**CoA-Extracted Ideas**:
- CoA's Star Caller "Warden" — *moon-touched guardian with glaive and moon-magic* — gives Monolith a *lunar guardian* aesthetic alongside its calcified armor.
- CoA's Guardian "Vanguard" — *charge, shield-wall, frontline* — maps to Monolith: they do not deal the most damage, but nothing *moves* past them.
- CoA's Templar "Oathkeeper" — *binding oath, sworn protection* — gives Iron Gaoler a more *oath-based* identity: the cages are not chains — they are *promises of containment* made manifest.
- CoA's Reaper "Harvest" stealth + bleed is already Flayed Stalker's core loop. The "rending throw" (ranged chain attack) is a good addition for Stalker's opener.

**Spec Polish Proposals**:

**Flayed Stalker** — *The Silent Rending*
- **Identity tighten**: You are not an assassin. You are a *ripper*. You do not kill quietly — you kill fast, and the only sound is the chains singing.
- **Flair upgrade**: When you attack from stealth, your chains glow red-hot for a fraction of a second — friction from the speed of the ambush. They cool before they hit the ground.
- **Ability concept — Ambush Tether**: From stealth, throw a chain to tether a target. If it hits, they are pulled 10ft toward you and take 1d6 bleed. You gain 1 Tension. On the next round, your follow-up attack against the tethered target deals +2d6.
- **Ability concept — Rending Throw**: Ranged chain attack (20ft). On hit, deal 1d8 + bleed 1d4 per round for 3 rounds. If the target moves, the chain rips — they take an additional 1d6 and the bleed refreshes.
- **Ability concept — Shed the Coil (upgrade)**: When you hide after a strike, leave a shadow-chain copy of yourself in your previous position. The next enemy to approach the copy takes 1d6 wyrd and is marked, granting you advantage on your next attack against them.

**Iron Gaoler** — *The Oathkeeper*
- **Identity tighten**: Your chains are not weapons. They are *vows*. Every enemy you cage is an oath you have made to your party: "This one will not harm you."
- **Flair upgrade**: Your spectral cages have a faint blue-white glow, like starlight on iron. They hum with a low, resonant tone — the sound of a promise held.
- **Ability concept — Binding Oath**: Designate one enemy as your Oathbound. They have disadvantage on attacks against anyone but you. If they attack an ally, your chains lash them for 2d6 storm as punishment. Costs 2 Tension to maintain per round.
- **Ability concept — Cage Cascade**: When an enemy breaks out of your cage (destroying it), the cage fragments scatter, creating a 10ft difficult terrain zone. Enemies entering the zone are Slowed for 1 round.
- **Ability concept — Oathkeeper's Stand**: When an ally within 15ft of your cage is attacked, you may spend 1 Tension to swap places with the caged enemy. The enemy takes the attack instead. You are now inside the cage — but it is your cage, so you can leave for free.

**Relentless Tormentor** — *The Inevitable Pursuer*
- **Identity tighten**: They can run. They can hide. They can beg. You will find them. Your chains are longer than their hope.
- **Flair upgrade**: Relentless Tormentor's chains are visibly longer than other Gaolers' — they trail behind them like snake tails. When they pursue, the chains rattle with a hunting rhythm.
- **Ability concept — Unending Pursuit**: When you hit a target with a chain attack, gain +10ft movement speed against that target until the end of combat (stacks with itself, max +30ft). You cannot gain this bonus against a new target until the old one is dead.
- **Ability concept — Chain Harvest**: Your chain attacks deal +1d6 per consecutive hit on the same target (max +3d6). Resets if you attack a different target or miss.
- **Ability concept — Ironshawl Defense**: When you take damage, your chains wrap around you automatically, granting DR 2 against the triggering attack and DR 1 for the rest of the round. Costs 1 Tension per activation.

**Monolith** — *The Unmoving Guardian*
- **Identity tighten**: You do not move. You do not fall. You are not a wall — you are a *mountain range*. Enemies break against you, and the tide of battle flows around your stillness.
- **Flair upgrade**: Monolith Warden's calcified armor pulses with a slow, geological rhythm — like the heartbeat of stone. When hit, chips of rock fly off, but the surface underneath is the same.
- **Ability concept — Terminal Density**: Your base DR is increased by +3. Whenever an enemy tries to move you, they must succeed on a STR check against you. On failure, they cannot move you and are Staggered for 1 round.
- **Ability concept — Iron Prison Realm**: Create a 30ft radius zone centered on yourself. Enemies inside cannot teleport, phase, or move faster than their base speed. Allies inside gain +1 DR. You are rooted in place and cannot leave the zone while it is active.
- **Ability concept — Gaol Shatter**: Once per combat, you may detonate your accumulated calcified armor. You lose DR 5 for 2 rounds, but deal 5d6 physical in a 20ft radius and Stun all enemies hit for 1 round. Your armor regrows after combat (or 3 rounds if you survive the cooldown).

---

## Quick-Win vs. Bigger-Build Triage

| Proposal | Effort | Impact | Type |
|---|---|---|---|
| Damage-type weakness chart | Low | High | Add to rulesData.js / class cards |
| Signature first-session moment text | Low | Medium | One-liner per overview entry |
| Stance-swap axes (Apex, Berserker) | Medium | High | 2-3 new spells per class |
| Empower keyword (support specs) | Medium | High | ~3 new passives per support spec |
| Worldforged relic items (30-50) | Medium | Medium | New relicsData.js + placement |
| Profession synergy table | Low | Medium | Add to class data narrative |
| Stat-by-silhouette creature template | Low | Medium | Add to CREATURE_COMPENDIUM |
| Woodworking profession | High | Medium | New profession data file |
| Support role tag | Low | Low | Add `role: "support"` field to specs |
| Per-class ability proposals (this doc) | Varies | High | Triage per class individually |

---

## Appendix: Deferred CoA Ideas

These are larger CoA system concepts not directly tied to polishing the 3 existing specs, flagged for future consideration.

### 1. Class-Tree + Spec-Tree Talent System
CoA's "one shared class tree + one unique spec tree" is the architectural fix for Mythrill's on-hold talent trees. Each class gets a shared pool of ~15 talents (same for all specs) + ~10 spec-specific talents. Players pick from both pools as they level.

### 2. 4th Specializations (Tank / Heal / Support)
- CoA proves that adding a 4th spec to unlock a missing role works (Sun Cleric Seraphim = tank from a DPS/heal class).
- Mythrill already does this for Warden (Monolith) and Martyr (Ironclad).
- 4th spec candidates: Berserker (tank), Chronarch (support), False Prophet (healer), Apex (support via traps/utility).

### 3. Hardcore Trials
CoA's "Pair Layer" (2-man dungeons), "Lonely Artisan" (crafting XP only), "Gatlazoth" (kill specific armored foes). Could translate to Mythrill campaign modifiers: "Only Duo: all content scales for 2 players," "No Vendors: craft everything," "Armored Hunt: kill 50 plate-wearing enemies."

### 4. Prestige / Rebirth
Reset to level 1 while keeping gear, bank, professions, and reputation. Earn a chest of spoils at each recapped level. Rewards repeat playthroughs.

### 5. Toggleable PvE/PvP/High-Risk Modes
Mythrill sessions could adopt CoA's PvE / War Mode (XP+ / PvP) / High Risk (more XP, loot-on-death) toggles that the GM can set per session.

---
