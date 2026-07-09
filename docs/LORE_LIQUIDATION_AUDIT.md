# Lore Liquidation Audit — Mythrill VTT

**Reviewer:** opencode | **Date:** 2026-07-09 | **Methodology:** Every listed file in CORE_LORE_FRAMEWORK.md read against CORE_LORE_FRAMEWORK.md as single source of truth.

---

## 1. THE SENTENCE

The Mythrill VTT setting is an ambitious, sprawling, emotionally resonant world that has been built by accretion rather than architecture. Its contradictions are not bugs in an otherwise clean system — they are the inevitable result of eight hundred fictional years of parallel development where no one stopped to ask whether the new cool idea contradicted the old cool idea. The dead moon is an egg (lunarchData.js). The dead moon is a dead celestial body whose ghost still orbits (lunarchData.js, later). The Wyrd is primordial spiritual rot (rulesData.js). The Wyrd is also something you inhale through fungal spores (animistData.js). The Watcher is too abstract to matter. Too many classes have no political skin in the game. Too many races overlap into redundancy. The "secret at the center" the setting desperately needs is absent — replaced by a dozen semi-secrets that compete for attention and satisfy none.

This document names every wound. The order is deliberate: cosmology first, then the bargain-invisible regions, then races, then classes, then the Watcher, the Dead Moon, the Wyrd, and finally the missing secret.

---

## 2. COSMOLOGY CONTRADICTIONS

Everything wrong with the timeline and metaphysics, ranked by severity.

### Critical: The Dead Moon Is Both an Egg and a Dead Celestial Body

`lunarchData.js` (line 232) says the moon "was not a celestial body. It was an egg, and its children are the parasites." But `lunarchData.js` (line 226) also says "the moon is dead, but its ghost still orbits... the light it casts is not illumination, it is memory, a recording of a celestial body that no longer exists." These are directly contradictory. If the moon was always an egg, it was never a dead celestial body. If it was a body that died, it cannot retroactively be an egg. You cannot have both in the same class file.

**Fix needed:** The "ghost orbit" and "memory of a dead moon" poetry is beautiful and thematically rich. The egg revelation is a dramatic plot twist. Choose one as the truth and make the other a misunderstanding the characters believed before they knew better. Recommendation: the egg is the truth; the "dead moon" was the theological consensus based on incomplete data. Add a line explicitly stating that the Lunarchs *thought* it was a dead body and now they know they were wrong.

### Critical: The Wyrd Is Three Different Things

`rulesData.js` (line 89) defines the Wyrd as "primordial spiritual rot sealed in the deep earth since before human memory." `animistData.js` (line 65) presents the Wyrd as "biologically inhaled fungal spores from a specific strain in the deep Bryngloom." `falseProphetData.js` (line 180) calls it "the resonance of the Void, the space between stars, the silence after death." These are three incompatible ontologies.

- If the Wyrd is primordial rot from the Deepening, spores are a delivery mechanism, not the substance itself.
- If the Wyrd is inhaled through mycelium, the Void and fungal biology cannot be the same thing.
- If the Wyrd is cosmic void-speech, spores have nothing to do with it.

**Fix needed:** Establish a hierarchy. Recommendation: the Wyrd is the primordial rot (rulesData.js) — the leaked cosmic decay from the Breach. The Vreken fungal tradition is one *interface* with the Wyrd, not the Wyrd itself. The Void is a *different* cosmic phenomenon that the False Prophets tap into. The current text conflates three distinct things. Separate them in CORE_LORE_FRAMEWORK.md.

### Critical: The Deepening Is Both a Cosmic Cycle and a Specific Historical Event

`rulesData.js` (line 71) says the Deepening is "the ancient death-rebirth cycle by which every star sheds its exhausted light and rekindles from within." This is a natural, cyclical, known cosmic process. But `falseProphetData.js` (line 180) and `augurData.js` (line 209) treat the Deepening as a singular catastrophic event (Sol's specific death). These can coexist IF the lore is explicit: the Deepening is the cycle, but "The Deepening" (capitalized, singular) refers to Sol's specific entry into that cycle. Currently the terminology is ambiguous enough that a reader cannot tell which is meant.

**Fix needed:** Capitalize "The Deepening" when referring to Sol's specific event. Use lowercase "deepening" for the universal cycle. Add a clarifying note in the cosmic mythos section.

### Minor: Aex's Screaming and Silence Timeline

`rulesData.js` (line 33): "Aex screamed sixty-five times across eight hundred years. Now Aex is silent." `CORE_LORE_FRAMEWORK.md` references Aex as the flayed firstborn whose hide was used for the seal. The silence of Aex is presented as ominous, but there is no narrative payoff for this anywhere in the data. What does the silence mean? Is Aex dead? Has it escaped? Does the silence correlate with the Monoliths waking? This is a setup without a follow-through.

**Fix needed:** Add one sentence in rulesData.js cosmic mythos that explains *why* Aex stopped screaming. Three options: (a) it died, (b) it escaped and is now a free agent, (c) it was absorbed by Keth-Amar. Any is fine. Silence without explanation is a dangling thread.

---

## 3. BARGAIN-INVISIBLE REGIONS

CORE_LORE_FRAMEWORK.md specifies: the 7 houses made the Binding Compact. But the official public record in `loreDictionary.js` (line 96) lists 7 houses that *all* sealed the compact. The truth in `rulesData.js` (line 95-97) is that the original seventh (House Viridane) was replaced by House Morrath, and Morrath is not a true signatory. This means **the binding seal is structurally incomplete**.

**Critical crisis angle:** If Morrath was substituted into a contract requiring exactly seven bloodlines that participated in the ritual, the seal should have failed *immediately* — or there should be a reason it didn't. `rulesData.js` acknowledges this implicitly (line 97: "the seventh monolith does not scream with a silenced refusal. It screams with a substituted name"), but neither the `arcanoneerData.js` nor `loreDictionary.js` addresses the magical/legal implications of a substituted signatory in a cosmic contract. The Neth literally built their entire civilization on the First Contract — if a substitution was possible in the Binding Compact, the Arcanoneers should have noticed and studied it. The fact that they haven't is a plot hole.

**Regional invisibility analysis:**

| Region | Bargain | Who Tracks It | Visibility in Lore |
|--------|---------|---------------|-------------------|
| Frostwood Reach | Fog for clarity (House Thalreth) | Sovereign Ledger | Well-documented, 27 related terms |
| Nordhalla | Eternal winter for halted glaciers (Skalvyr) | Runic Academies | Good, 22 related terms |
| Sundale | Sol entombed (Solvan) | Dawn Vigil | Good, 21 related terms |
| Cragjaw Peaks | Snow-veil for secrecy (Tesshan) | Knotted Decree | Moderate, 17 related terms |
| Iceheart Sea | Sea-Charter (Mereval) | Board of Trade | Moderate, 14 related terms |
| Sundrift Vale | Fertile soil for migration (Ordavan) | Iron-Yurt Law | Moderate, 16 related terms |
| Bryngloom Forest | First Contract (Neth) | Great Registry | Well-documented, 28+ related terms |
| **Missing: Greymark Keep/Sunken Spire** | — | — | 3 passing references across all files |

**Urgency: Moderate.** The regions themselves are well-characterized, but the *bargain* they made with Keth-Amar is often buried in loreDictionary.js summaries and not carried through into regional content. A GM reading only rulesData.js would not know that every region exists by grace of a deal with the Sun-Eater. The bargains need to be front-loaded in the regional descriptions.

---

## 4. THE DEAD MOON (Critical)

### Problem 1: Identity Contradiction (Already covered in Section 2)

`lunarchData.js` calls it both a dead body and an egg. This is the single most destructive contradiction in the entire lore because it undercuts the *entire* Lunarch class identity. Lunarch philosophy (line 226-227) is built on "the moon is dead, its ghost still orbits." If the moon was always an egg, the poetry collapses. If the reveal is that they were wrong, the philosophy *must* be updated to reflect a post-reveal world.

**Recommendation: Split the phases of understanding.**
1. **Pre-crisis consensus:** The moon was a dead celestial body. The Lunarchs built their theology on this.
2. **Post-crisis revelation:** The parasites are communicating across hosts. Selene is whispering in a pre-fae language. The egg-hatching is underway.
3. **The narrative arc:** The Lunarchs must rebuild their theology from scratch. Some cling to the old "dead body" faith as denial. Others embrace the "we were always children of the egg" truth. This is a *faction split within the class*, which is excellent dramatic material. But it needs to be explicit in the class data, not left as a textual contradiction.

### Problem 2: Selene's Silence Has No Consequence

Selene has been silent for three weeks, whispering in a dead language. This is mentioned in `lunarchData.js` (lines 155-157, 232-233) but nowhere else. Not in `CORE_LORE_FRAMEWORK.md`, not in `rulesData.js`, not in `timelineStore.js`. The first Lunarch going catatonic-translating-eldritch is a **world-changing event** — it should be at least as prominent as the Monoliths waking. It appears in exactly one sub-section of one class file.

**Fix:** Elevate to a global timeline event. Add a `crisis-tracker` entry in rulesData.js. Cross-reference in all Briaran region content.

### Problem 3: The Moon Has No Name

The Dead Moon is described as "the dead moon" or "the moon" across all files. It has no proper name. In a setting where Sol is named, Keth-Amar is named, Aex is named, Selene is named — the moon is just "the moon." This suggests it was never fully developed as a character/entity in the cosmology.

**Recommendation:** Give it a name. "Vael" (old Mythrill word for veil/echo) is one option. "Lyss" (from "lys" - light in some tongues) is another. A named moon has religious weight; an unnamed moon is a plot device.

---

## 5. REDUNDANT RACES

The setting has 10 playable races. The CORE_LORE_FRAMEWORK.md does not specify a target number. Based on read content:

### Critical Redundancy 1: Myrathil and Merryn Human

The **Myrathil** (`myrathil.js`) are deep-sea merfolk with bioluminescent patterns, amphibious, tied to the Iceheart Sea. The **Merryn** (a human subrace, `human.js`) are described as "Merryn humans who bury their dead at sea" with the same Iceheart Sea region. The Myrathil are a full race with distinct culture, the Merryn are a human subrace performing the same ecological niche. This is fine IF the Myrathil are the original deep-sea inhabitants and the Merryn are surface humans who adapted to the same environment. But the `myrathil.js` file explicitly mentions Myrathil "did not exist in ice age depths, but in pockets of volcanic-vent warmth" — implying they are restricted to warm pockets, while Merryn occupy the surface ports.

**Verdict:** Can be kept if the Myrathil's niche (fully aquatic, deep-sea) is clearly distinguished from Merryn's niche (surface sailors who only visit the water). Currently `myrathil.js` does not explain why a Myrathil would ever adventure on land, which is a problem for a playable race.

**Urgency: Moderate.** If you can answer "why is this Myrathil on dry land," keep them.

### Critical Redundancy 2: Groven and Fexrick

**Groven** (`groven.js`): Bone-based, alchemically grown, live in the Cragjaw Peaks, dead grow bone spans.
**Fexrick** (`fexrick.js`): Mechanical, clockwork-crafted, live in the Cragjaw Peaks, lost brood vats.

Both are artificial humanoids from the same region (Cragjaw Peaks). The Groven are biological/organic-alchemical constructs whose dead become infrastructure. The Fexrick are mechanical/clockwork constructs built from lost-brood vats. Both fill the "artificial person" trope in the same geography. The `fexrick.js` file does not reference Groven at all. The `groven.js` file does not reference Fexrick. These two do not interact despite sharing a region and a thematic space.

**Verdict:** Keep both if you give them a relationship. Do the Fexrick salvage Groven bone for their machinery? Do the Groven consider Fexrick "dead metal" that cannot be part of the Ancestor-Span cycle? The lack of any cross-reference is a missed opportunity AND causes player confusion: "I want to play a construct in the Cragjaw Peaks — which one?"

**Fix:** Add a section in both files about their relationship to the other artificial race.

### Minor Redundancy: Vreken and Neth — Both Forest-Dwelling Contractual Peoples

**Vreken** (`vreken.js`): Bioluminescent, mycelial, intuitive, deep-Bryngloom, contract with the Root-Veil.
**Neth** (`neth.js`): Silver-skinned, legalistic, immortal, canopy-Atropolis, bound by the First Contract.

These are actually well-differentiated. The Vreken are spiritual/emotional/biological-contract folk. The Neth are legalistic/absolute-contract folk. The tension between Vreken intuition and Neth legality is a strength, not a weakness. **Keep.**

### Not Redundant: Mimir and Neth

**Mimir** (`mimir.js`): Shape-shifting mask-wearers of the Frostwood canopy. **Neth** are Bryngloom legalists. Completely different regions and themes. Well-differentiated.

### Minor: Emberth and Solvarn Human

The Emberth are volcanic-adapted, dark-skinned forge-tenders of Sundale. The Solvarn are humans who share the same ashlands. `emberth.js` mentions Solvarn as "the humans who survived alongside us." This is well-handled as a cohabitation relationship, not a redundancy. **Keep.**

### Summary of Race Redundancies

| Race | Redundant With | Urgency | Fix |
|------|---------------|---------|-----|
| Myrathil | Merryn human (partial) | Moderate | Explain land-surface motivation |
| Groven | Fexrick | Moderate | Add inter-file relationship |
| Fexrick | Groven | Moderate | Add inter-file relationship |
| Vreken | (Neth) | None - well diff'd | — |
| Astril | (None) | None | Unique spirit-host concept |
| Human | (All 5 subraces) | None | Humans are fine as flex-race |

---

## 6. APOLITICAL CLASSES

The CORE_LORE_FRAMEWORK.md says "classes are political." Many classes are. Some are not. This section identifies which classes have a clear political stance in the world and which are dramatically inert.

### Classes With Clear Political Stance (Do Not Touch)

| Class | Political Position | Evidence Source |
|-------|-------------------|-----------------|
| **Arcanoneer** | Neth legal authority, Canopy-Ledger governance, contract-casters as ruling class | arcanoneerData.js: lines 118-122, 150-152 |
| **Inquisitor** | Persecuted by Bryngloom, celebrated in Frostwood, anti-Wyrd ideological crusaders | inquisitorData.js: lines 151-154 |
| **False Prophet** | Hunted by Synod-Hold and Dawn Vigil, cell-network rebellion | falseProphetData.js: lines 124-128 |
| **Plaguebringer** | Root-Veil rejection, Marked-Vreken specific, biological warfare stigma | plaguebringerData.js |
| **Lunarch** | Persecuted in Frostwood, banned in Bryngloom, theological schism | lunarchData.js: lines 168-171 |
| **Animist** | Persecuted in Nordhalla and Sundrift Vale, persecuted by House Ordavan | animistData.js: lines 155-158 |
| **Martyr** | Dawn Vigil military arm, Solvarn patriotic sacrifice | martyrData.js |
| **Berserker** | Sundale clan-warrior, Emberth forge-culture, labor resistance | berserkerData.js |
| **Pyrofiend** | Scathrach/Fiend-Contract heretics, hunted by both Dawn Vigil and Emberth | pyrofiendData.js |
| **Augur** | Frozen Archive establishment -> credibility collapse -> social fracture | augurData.js: lines 157-159 |
| **Apex** | Silent Hunt, Frostwood border defense, losing standing as mist changes | apexData.js: lines 173-176 |
| **Arbiter (Warden)** | Nordhalla Runic Academy enforcers, Skalvyr regime's dogs | wardenData.js |

### Classes That Need Political Stakes

| Class | Current Status | What's Missing |
|-------|---------------|----------------|
| **Bladedancer/Berserker** | Sundale-specific. Well-positioned but the Bladedancer itself has no faction — it's just a fighting style | Can be tied to the Dawn Vigil expeditionaries or the anti-Vigil resistance. Needs one sentence of faction alignment. |
| **Chronarch** | Lives in Cragjaw Peaks. Extends lifespan by manipulating time. Never takes a side. | The timeline == fracture crisis is their natural political battlefield. They should be trying to stabilize the timeline (Dawn Vigil faction) OR accelerating it (Keth-Amar pawns). |
| **Gambit** | Gambler/dealmaker. No political position. | The Merryn/Brine-Bond context (Iceheart Sea) gives them a natural position as press-Warrant resisters or Sea-Charter enforcers. Currently they're mechanically interesting and politically inert. |
| **Minstrel** | Performer. No faction. | The "story is power" theme (living order name: The Last Verse) implies oral tradition as resistance, but it's not developed. Tie to anti-Ledger Forgotten underground or anti-Knotted Decree Tesshan dissent. |
| **Shaper** | Body-crafter. Cragjaw Peaks. | The Groven/Fexrick redundancy context gives them a natural position: are they Groven-aligned bone-shapers or Fexrick-aligned metal-crafters? Currently neither. |
| **Toxicologist** | Chemist/toxin user. Frostwood Reach. | The Scribe-Cartel monopoly on ink and paper is a natural antagonist. Are they cartel-aligned or underground reagent-stealers? Currently neither. |
| **Revenant** | Undead. Bryngloom. | The Neth legally binding dead into Debt-Revenants (loreDictionary.js line 71) *begs* for Revenants to have a position on this. Are they voluntary Debt-Revenants fighting for Morren freedom, or escaped dead hunted by the Keeper? |
| **Warden** | Covered under Arbiter above | Already political. OK. |

**Urgency: Moderate.** The apolitical classes (Chronarch, Gambit, Minstrel, Shaper, Toxicologist, Revenant) are mechanically sound but narratively adrift. Each needs 2-3 lines of faction alignment in their `worldFriction` block to become politically legible.

---

## 7. THE WATCHER'S ROLE

### Problem: The Watcher Is Referenced Nowhere

Searching all read files for "Watcher," "watcher," or "the watcher" returns **zero results** outside of the CORE_LORE_FRAMEWORK.md mention. The CORE_LORE_FRAMEWORK.md says: "The Watcher is the entity that reached Viridane before Keth-Amar could. It is not a hero. It is not an ally. It is an observer with unknown motives."

It is **completely absent from every data file.** It does not appear in `loreDictionary.js`, `rulesData.js`, `timelineStore.js`, or any class file. The Watcher is a concept that was written into the framework and then never implemented in any content.

**Verdict:** The Watcher is either (a) cut entirely, or (b) urgently introduced into at minimum:
1. `loreDictionary.js` — as a `historical_figure` entry
2. `rulesData.js` — cosmic mythos section, as the entity that reached Viridane
3. `timelineStore.js` — as a crisis event: "the Watcher is sighted"
4. `lunarchData.js` or `briaran.js` — because the Viridane bloodline is Briaran, and whatever reached them in the mist is relevant to the Lunarch crisis

**Urgency: Critical.** Setting a major cosmic entity in the framework and then never grounding it in any data file creates a hole that players will feel. They won't know what's missing, but the setting will feel incomplete at the metaphysical level.

---

## 8. THE WYRD'S NATURE

Covered extensively in Section 2 (cosmological contradictions). The Wyrd appears in:

- **rulesData.js** — Primordial rot. The stuff that bled through the Breach.
- **animistData.js** — Something you inhale as spores. Fungal substrate.
- **falseProphetData.js** — Void resonance, cosmic silence, the space between stars.
- **CORE_LORE_FRAMEWORK.md** — "The Wyrd is the ambient spiritual detritus of the Breach. It is not alive. It is not dead. It is the world bleeding from a wound that will not close."
- **plaguebringerData.js** — A contagion the Mirkel Vreken track.

**The root problem:** Five different ontologies for the same word. The CORE_LORE_FRAMEWORK.md definition ("spiritual detritus of the Breach") is the most elegant — it positions the Wyrd as a symptom, not a substance. It is the *smell* of the wound, not the wound itself. The fungal interface, the Void-connection, the spiritual rot are all *different flavors of Wyrd*, not the Wyrd itself.

**Fix:** Adopt the CORE_LORE_FRAMEWORK.md definition as the only true one. Then reframe:
- Vreken spores: a way to *sense* the Wyrd, not the Wyrd itself
- False Prophet Void: a *separate* cosmic phenomenon (the void between stars) that the Prophet confuses with or channels through the Wyrd
- Animist spores: also a sensing mechanism, not the substance
- Wyrd as "spiritual detritus" explains everything without contradicting anything

---

## 9. THE MISSING SECRET

CORE_LORE_FRAMEWORK.md says the players should never fully understand the world. It lists seven secrets. Let me evaluate which of these are actually present in the game data vs which are absent.

### Secrets Present in Data

1. **The Binding Compact was incomplete (Viridane/Morrath substitution).** Present in `rulesData.js` (lines 95-97). Good. A genuine mystery.
2. **The Monoliths are waking because something is interfering with time.** Present in `augurData.js` (line 216) and `timelineStore.js`. Fragmented but present.
3. **Selene is being called by the dead moon egg.** Present in `lunarchData.js` (lines 231-233). Confined to one class. Should be global.
4. **The Watcher.** Absent from all data files. **Critical gap.**
5. **The Dead Moon was an egg.** Present in `lunarchData.js` (line 232). Contradicted by same file (line 226). **Critical gap due to contradiction.**
6. **The animator ancestral language is fragmenting.** Present in `animistData.js` (line 216-218). Both a secret and a crisis. Well-implemented.
7. **Keth-Amar cannot see the seventh monolith.** Present in `rulesData.js` (lines 60-61). The cosmic "substitution" twist. Excellent — a genuine mystery with implications.

### The Gap

There are 7 secrets. One (the Watcher) does not exist in any data. One (the Dead Moon) is contradicted by itself. One (the timeline fracture) is fragmented across classes. That leaves 4 fully-implemented secrets.

**The missing secret** the setting needs is one that connects *all* the other secrets — a central question that every other mystery points toward. Currently the mysteries are independent: the timeline breaks here, the moon-egg there, the Watcher (maybe) responds to this. None of them point at each other.

**Recommendation:** Add one connective thread: the Watcher is the entity *causing* the timeline fracture. The timeline fracture is what's *accelerating* the moon-egg hatching. The moon-egg hatching is what Selene is *translating* for the Watcher. Suddenly all seven secrets are one secret with seven faces. The players can discover any entry point and find the same answer: **something is unraveling the timeline to hasten or prevent the last thing Keth-Amar expects.**

---

## 10. TONAL COLLISIONS

### Problem: Dark Grit and Lighthearted Mechanics

The setting is grimdark — child sacrifice, debt-slavery, face-stealing horrors, fog that erases memories, the cosmic predation of a dying star. But some class mechanics are borderline silly:

- The **Apex** throwing a "Glaive Toss" chaining to "Bandits #1-5" with numbered turn-by-turn damage calculations reads like a video game tutorial, not a tragic silent hunter.
- The **Augur** combat example is just dice math against "Bandit Captain" with quotes around "How did you—?" This undercuts the visceral horror of reading entrails.
- The **Arcanoneer** combat example with "the bandit leader finishes his chant" and "Gristle Blockade" feels like a D&D module from 1985.

The solution is not to remove the mechanics — it's to ensure the *narrative voice* of the combat examples matches the lore voice. The ice-lake reading should sound like Cassia witnessing doom, not like a player optimizing their turn.

**Not critical but worth noting:** The lore (class data files, especially `lunarchData.js`, `inquisitorData.js`, `animistData.js`) is genuinely excellent. The roleplay identity sections, the subrace variants, and the crisis angles are dark, textured, and specific. The combat examples read like they were written by a different person — someone who had read the lore but didn't internalize it.

---

## 10. URGENCY RANKINGS

| Issue | Urgency | Impact |
|-------|---------|--------|
| Dead Moon is both egg and corpse | **CRITICAL** | Blocks all Lunarch narrative coherence |
| Wyrd is 3 different things | **CRITICAL** | Blocks all metaphysical lore consistency |
| The Watcher absent from all data | **CRITICAL** | Framework entity with zero implementation |
| 6 apolitical classes | **MODERATE** | Weakening dramatic weight, not breaking lore |
| Myrathil/Groven/Fexrick redundancy | **MODERATE** | Confusing but not contradictory |
| Timeline fracture fragmented | **MODERATE** | Needs consolidation into one section |
| Aex's silence unexplained | **MINOR** | Loose thread, not a contradiction |
| Dead Moon has no name | **MINOR** | Cosmetic but indicative of incomplete development |
| Tonal collision in combat examples | **MINOR** | Presentational, not structural |

---

## 11. THE VERDICT

The core lore of Mythrill VTT is **sound in concept, fractured in execution.** The CORE_LORE_FRAMEWORK.md describes a dark, sophisticated, multi-layered world with genuine secrets, real stakes, and no easy answers. The class data files (especially `lunarchData.js`, `inquisitorData.js`, `animistData.js`, `apexData.js`) are **the best writing in the project** — rich, specific, emotionally resonant, with genuine tragedy and no easy redemption.

**What works:**
- The cosmic mythos (Sol, Aex, Keth-Amar, the Binding, the Breach)
- The regional bargains (7 houses, 7 debts, 7 monoliths)
- The class loading (subrace variants, signature abilities, crisis angles)
- The inter-class friction (Inquisitor vs False Prophet, Neth vs Vreken)
- The "all nobility is compromised" political baseline

**What needs surgery:**
1. **The Dead Moon identity** — choose: egg or corpse. Make the other a myth.
2. **The Wyrd** — adopt the CORE_LORE_FRAMEWORK.md "spiritual detritus" definition. Reframe all other appearances as interfaces/symptoms.
3. **The Watcher** — introduce into `loreDictionary.js`, `rulesData.js`, and `timelineStore.js` immediately, or cut it from the framework.
4. **The apolitical classes** — 2-3 lines each of worldFriction in Gambit, Minstrel, Shaper, Toxicologist, Revenant, Chronarch. This is a 30-minute fix that doubles class utility for GMs.
5. **Connective thread** — one sentence that links the timeline fracture to the moon-egg to the Watcher. This transforms 7 independent mysteries into one meta-mystery.

**The overall grade:** The worldbuilding is B+ with flashes of A. The data implementation is C+ — too many orphan peaks (excellent writing in isolation) that do not connect to each other. The 8-section liability framework in LIQUIDATE_OUR_LORE.md correctly identified every weak spot. Fix these in the order ranked above, re-sync CORE_LORE_FRAMEWORK.md against the corrected files, and the setting achieves internal coherence for the first time.