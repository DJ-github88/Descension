# Mythrill World Lore Quality Audit Prompt

> **Purpose:** A ruthlessly thorough audit framework for evaluating the quality, consistency, depth, and integration of the Mythrill VTT worldbuilding. This prompt is designed to be given to an AI auditor who has access to the full codebase and lore documents. The audit should produce a brutally honest report with specific line-number citations and concrete fixes.

---

## Instructions to the Auditor

You have access to the full Mythrill VTT codebase. Your job is to conduct a **ruthless, unsparing audit** of the world lore. Do not be kind. Do not congratulate. Do not soft-pedal. Every inconsistency, every lazy sentence, every gap in logic, every missed opportunity for depth — find it, cite it, and propose a fix.

**You are not reviewing for typos. You are reviewing for whether this world holds together as a living, breathing place that a Game Master could run a campaign in without tripping over contradictions.**

Read every file listed in the **Source Files** section. Then produce the audit report structured as defined below.

---

## Source Files

### Primary Lore Files
- `vtt-react/src/data/rulesData.js` — Canonical in-app lore (~5,200 lines). Contains cosmic mythos, world state, Wyrd mechanics, 7 regional gazetteers, race overviews, timeline.
- `vtt-react/src/data/loreDictionary.js` — Cross-referenced dictionary entries for regions, houses, locations, races, classes, creatures, events, concepts.
- `vtt-react/src/data/zoneData.js` — 86 zone/location definitions across 7 regions with descriptions, danger levels, factions, connections, Wyrd creatures.
- `vtt-react/src/data/deepLocationData.js` — 11 deep location profiles with heraldry, population, leadership, economy, atmosphere, history, sub-locations, NPCs.
- `docs/GM_WORLD_GUIDE.md` — Master prose world bible (narrative format).

### Supporting Lore Files
- `vtt-react/src/data/races/human.js` — Human race with 7 subraces, cultural backgrounds, major locations, current crisis.
- `vtt-react/src/data/races/mimir.js`, `emberth.js`, `fexrick.js`, `neth.js`, `groven.js`, `myrathil.js`, `astril.js`, `vreken.js`, `briaran.js` — Individual race files with subraces, traits, lore.
- `vtt-react/src/data/biomeData.js` — 6-7 biomes mapped to regions with weather, encounters, terrain, atmosphere.
- `vtt-react/src/data/creatureData.js` — Region-indexed creature stat blocks and lore.
- `vtt-react/src/data/creatureLibraryData.js` — Extended creature library entries.
- `vtt-react/src/data/languages.js` — 32+ languages with phonetic descriptions and in-world context.
- `vtt-react/src/data/backgroundData.js` — 15 character backgrounds tied to world lore.
- `vtt-react/src/utils/nameGenerator.js` — Per-race naming conventions.
- `vtt-react/src/store/factionStore.js` — Faction definitions with members, territories, relationships.
- `vtt-react/src/store/worldStore.js` — Region metadata and state.
- `vtt-react/src/data/regionPolygons.js` — Map polygon definitions.
- `vtt-react/src/data/explorationRules.js` — Region-specific exploration mechanics.

### Design Documents
- `docs/RACE_BUILDING_SESSION_PROMPT.md` — Race design philosophy and framework.
- `docs/PHASE_7_INTERACTIVE_WORLD_MAP.md` — World map design doc.
- `docs/CONSOLIDATION_MASTER_PLAN.md` — Project consolidation history.

---

## Audit Categories

### 1. CANONICAL CONSISTENCY

**Question: Does the world agree with itself?**

Check every factual claim across all files. If File A says X happened in Year 5 and File B says it happened in Year 7, that's a breach. If a race is described as having 3 subraces in one file and 2 in another, that's a breach.

Specifically audit:
- **Timeline consistency:** Does the timeline in `rulesData.js` match every dated event in `deepLocationData.js`, `loreDictionary.js`, `GM_WORLD_GUIDE.md`, and race files? List every date that appears in more than one place and verify they match.
- **Population numbers:** Do population figures in `deepLocationData.js` make sense relative to each other and relative to the described scale of settlements? A "city" of 200 people is a village. A "settlement" of 50,000 would dwarf everything.
- **Geographic consistency:** Do travel times and distances in `deepLocationData.js` travelConnections make sense? Can you actually get from Location A to Location B via the described route in the described time? Are connection chains in `zoneData.js` geographically plausible (no teleporting across the map)?
- **Faction territory claims:** Does every faction's territory array in `factionStore.js` only contain zones that exist in `zoneData.js`? Do any two factions claim the same zone without explanation of shared control?
- **Race-region associations:** Is every race consistently associated with the same home region across all files? Check `rulesData.js` race-overview, individual race files, `loreDictionary.js`, `GM_WORLD_GUIDE.md`, and `human.js` subrace descriptions.
- **House-region associations:** Same check for noble houses. Each house should have one home region, consistently stated.
- **Wyrd creature assignments:** Are Wyrd creatures in `zoneData.js` actually from the correct region's creature pool in `creatureData.js`? No tropical creatures in arctic zones, no volcanic creatures in ocean zones, etc.
- **Class-region associations:** Do `classPresence` arrays in `deepLocationData.js` match the classes described as practiced in that region in `rulesData.js` and `GM_WORLD_GUIDE.md`?
- **The Dark Bargains:** Each house made exactly one bargain. Are the terms of each bargain stated consistently across `loreDictionary.js` (house entries), `GM_WORLD_GUIDE.md`, `rulesData.js` regional sections, and `factionStore.js`?
- **The Sundered Monoliths:** There are exactly 7, one per region. Are their locations described consistently everywhere they're mentioned? Check `rulesData.js` world-state, `loreDictionary.js`, and `GM_WORLD_GUIDE.md`.

### 2. NARRATIVE DEPTH & VOICE

**Question: Is the writing good enough to run a campaign from?**

- **Voice consistency:** Does every file maintain the same solemn, atmospheric Mythrill voice? Or do some entries read like Wikipedia summaries while others read like novel excerpts? Flag every entry that breaks tone.
- **Show vs. Tell:** Flag every instance where the lore *tells* you something is dangerous/ancient/sacred without *showing* it through specific, concrete detail. "The bog is treacherous" is telling. "The bog swallowed a merchant caravan whole in Year 412; their lead mule is still visible, preserved upright in the peat, its harness tangled in roots that were not there before" is showing.
- **Cliche detection:** Flag every phrase that reads like generic fantasy filler: "ancient evil," "dark forces," "mysterious ruins," "long-forgotten," "powerful magic," "legendary warrior." Every one of these is a missed opportunity for specificity.
- **Atmospheric density:** For each deep location, evaluate the atmosphere block (mood, architecture, sounds, smells, lighting). Does it give a GM enough sensory detail to *run a scene*? Or is it vague? Flag any atmosphere block that a GM could not immediately use to describe what players see, hear, and smell when they walk in.
- **NPC voice:** Do named NPCs have distinct personalities, or are they all "stoic leader types"? Flag any NPC described in more than one place whose characterization contradicts itself.

### 3. CROSS-REFERENCE INTEGRITY

**Question: Does the web of references actually connect?**

- **relatedTerms chains:** For every entry in `loreDictionary.js`, follow its `relatedTerms` to the referenced entries. Do the referenced entries link back? Are there one-way references (A references B but B doesn't reference A)? These are missed connections.
- **Zone connection graphs:** Build the connection graph for each region from `zoneData.js`. Is the graph connected (can you reach every zone from every other zone)? Are there isolated zones with no path? Are there dead-end zones that connect to nothing?
- **Faction-territory-connection triad:** For each faction, its territory zones should make geographic sense -- they should be adjacent or connected, not scattered randomly. Check if faction territories form coherent geographic clusters.
- **Orphaned locations:** Are there any locations in `zoneData.js` that are never referenced in `loreDictionary.js`, `rulesData.js`, `factionStore.js`, or `GM_WORLD_GUIDE.md`? These are orphaned -- they exist in data but not in the world.
- **Orphaned lore:** Are there any `loreDictionary.js` entries that no other entry references? These are islands of lore disconnected from the web.

### 4. WORLD BUILDING GAPS

**Question: What does a GM need that isn't here?**

- **Missing race details:** For each of the 10 playable races, check if they have: a clear physical description, a cultural practice section, at least one internal conflict, at least one external relationship (ally/enemy with another race), a naming convention, a language, a relationship with the Wyrd, a relationship with their region's noble house. Flag anything missing.
- **Missing region details:** For each of the 7 regions, check if they have: a clear geographic boundary (what's north, south, east, west), at least one internal conflict, a trade relationship with at least 2 other regions, a food source that makes ecological sense, a water source, a travel route connecting to at least 2 other regions. Flag anything missing.
- **Missing faction details:** For each faction in `factionStore.js`, check if they have: a clear goal, an internal schism or tension, at least one enemy, at least one ally, a territory that makes geographic sense, named leadership. Flag anything missing.
- **Missing creature ecology:** For each Wyrd creature in `creatureData.js`, check if it has: a clear Wyrd-origin (which local fear spawned it), a relationship with the Law of Somatic Echoes/Names/Resonating Guilt, a habitat that matches its region, a reason it hasn't wiped out the local population. Flag anything missing.
- **Missing inter-regional dynamics:** How do the 7 regions actually interact? Trade routes, military tensions, diplomatic relationships, cultural exchanges. Are these described anywhere? If not, that's a gap.
- **Missing everyday life:** Can a GM describe what a common person eats, wears, does for work, and fears in each region? If the lore only describes nobles, heroes, and monsters but never mentions how ordinary people survive, that's a gap.
- **Missing map geography:** Are the spatial relationships between regions clear? Which regions border which? What are the travel routes between them? Is the world map coherent or just a collection of unrelated zones?

### 5. ECONOMIC & ECOLOGICAL VIABILITY

**Question: Could this world actually sustain itself?**

- **Food chains:** Each region needs a credible food source. Check if the described food in `rulesData.js` and `GM_WORLD_GUIDE.md` makes ecological sense for the biome. No growing crops on frozen tundra without explanation. No grazing herds on volcanic badlands without explanation.
- **Trade balance:** Each region exports something and imports something. Check if the trade relationships are described and make economic sense. If Region A exports timber but has no trees described, that's a problem.
- **Population sustainability:** Do the population numbers and the described birth/death rates (especially the Frost-Tithe, the Fungal Hush, the fog's memory-erosion) allow for stable populations? If each generation loses 30% of mothers in childbirth and has no immigration, the population should be crashing. Is that addressed?
- **Resource scarcity:** The world has been sunless for 800 years. What powers the forges? What fuels the lamps? What provides warmth? Are energy sources described and are they credible for an 800-year timeline? If everyone burns wood, the forests should be gone. If everyone uses geothermal, who maintains the infrastructure?
- **Technology level consistency:** Is the described technology consistent? If one region has clockwork automata and another uses stone tools, that disparity needs explanation. If Fexrick have industrial machinery powered by geothermal steam but Tessen humans live in medieval keeps, why haven't the Fexrick conquered everything?

### 6. NAMING & LINGUISTIC QUALITY

**Question: Do the names feel like they belong to a coherent world or a random generator?**

- **Naming convention consistency:** Each human subrace has a linguistic fingerprint (Thalren = Germanic, Skald = Old Norse, Solvarn = Latin, Merryn = Celtic, Tessen = Anglo-Saxon, Ordan = Mongolian, Morren = Gothic). Check every location name in every region -- does it match the dominant naming convention? Flag any name that sounds like it belongs to a different culture without explanation (e.g., a Norse-sounding name in Sundale with no Skald diaspora explanation).
- **Non-human naming quality:** Mimir names should feel abstract/fluid. Neth names should use hyphenation (Vel-Keth, Aran-Glen). Vreken names should feel predatory. Emberth names should reference fire/forge. Groven names should reference nature/stone. Check every NPC and location name for consistency with these conventions.
- **Name redundancy:** Are any two locations too similarly named? "Black Fen" and "Black Firth" in different regions is fine. "The Shallows" and "The Shifting Fen" in the same region might confuse players. Flag potential confusions.
- **Terrain glossary usage:** Were the terrain glossary terms (fjord, caldera, fen, gorge, steppe, etc.) used correctly? A fen is not a bog. A firth is not a sound. A mesa is not a butte. Flag any incorrect usage.

### 7. WYRD SYSTEM INTEGRITY

**Question: Do the supernatural mechanics hold up under scrutiny?**

- **Law of Somatic Echoes:** The Wyrd manifests from local fears. Check: does every Wyrd creature's origin match the specific fears of its home region? A face-stealing creature in a fog-amnesia region makes sense. A face-stealing creature in a volcanic forge region does not.
- **Law of Names:** Wyrd creatures can be destroyed by discovering their first-given name. Is this mechanic consistent across all creature descriptions? Does any creature description contradict this?
- **Law of Resonating Guilt:** The Wyrd is attracted to hidden shame and broken promises. Check: are there any described Wyrd manifestations that don't connect to guilt/shame/debt? The Gambrel (broken oaths) fits. A random monster that attacks everyone equally might not.
- **Regional Wyrd folklore:** Each region draws from specific real-world folklore traditions (Germanic/Celtic for Frostwood, Norse for Nordhalla, Japanese/Yokai for Cragjaw, etc.). Check: do the Wyrd creatures in each region actually reflect their assigned folklore? Are there tonal mismatches?
- **Exorcism consistency:** The described exorcism protocol (starve the legend, resolve the debt, deploy cold iron/salt) -- is this consistently referenced across all class descriptions that deal with the Wyrd? Do the Exorcist, Covenbane, and Inquisitor all handle Wyrd creatures in ways consistent with these laws?

### 8. PLAYABILITY & GM USABILITY

**Question: Can a Game Master actually use this to run a game?**

- **Scene-ready descriptions:** Can a GM read any location description aloud to players without rewriting it? Or does the GM need to translate "prose lore" into "what the players see"? Flag descriptions that are pure backstory with no sensory detail.
- **Adventure hooks:** Does each location implicitly or explicitly suggest something the players could DO there? Or are there locations that are just... described? Flag locations with no implied adventure potential.
- **NPC usability:** For every named NPC across all files, can a GM portray them? Do they have: a clear role, a personality trait, a motivation, a secret? Flag any NPC that is just a name and a title.
- **Conflict accessibility:** Can a GM immediately identify at least 3 active conflicts in each region that could drive a campaign? Or is the conflict buried in lore and hard to extract? Flag regions where the adventure potential is unclear.
- **Scale clarity:** Is it clear how big each region is? How far apart the locations are? How long travel takes? Can a GM answer "how long to get from Greymark to Merrowport" from the existing lore, or would they have to make it up?

### 9. THE 800-YEAR PROBLEM

**Question: Has anything actually changed in 800 years?**

Eight hundred years is a *long* time. For reference, 800 years ago in our world was the 1200s -- before the printing press, before gunpowder was common in Europe, before most nation-states existed.

- **Technological stasis:** Has technology genuinely not advanced in 800 years? If the Fexrick have had geothermal-powered machinery for centuries, why haven't they industrialized? If the answer is "the cold prevents it," explain why.
- **Cultural stasis:** Have the 7 human subcultures genuinely not mixed, merged, or splintered in 800 years of shared geography? The diaspora exists (all subraces have cities in all regions), but do diaspora communities develop new cultural practices? Or are Merryn in Frostwood Reach identical to Merryn in the Iceheart Sea?
- **Political stasis:** Have the noble houses genuinely held power for 800 years without a single successful revolution, coup, or succession crisis? The Vat-Breakers' revolt happened, but that was the Groven, not humans. Where is the human political dynamism?
- **Linguistic stasis:** Have the 32 languages genuinely not evolved, merged, or spawned dialects in 800 years? Is there no creole, no pidgin, no regional slang? The Shanty-Patois is mentioned -- are there others?
- **Generational math:** 800 years is roughly 25-30 generations. How many generations of each subrace are described? Do the founding events feel like they happened 25 generations ago, or do they feel like they happened last week?
- **Memory erosion:** The fog in Frostwood Reach eats memories. In 800 years, how much of the original history should be lost? Is the amount of preserved knowledge credible, or should most of the ancient history be myth and legend by now?

### 10. THE "SO WHAT" TEST

**Question: Does any of this matter to a player?**

For every lore entry, ask: **If a player never learned this, would their experience be worse?** If the answer is no, the lore is decoration, not foundation.

- **Actionable lore:** What percentage of the lore directly translates to game mechanics, character choices, or scene-setting? What percentage is pure backstory that never surfaces in play?
- **Player-facing hooks:** Can a player read any of this and immediately know what kind of character they want to play? Or is the lore so GM-focused that players never engage with it?
- **Choice consequence:** Do the described regional differences (cultural, political, ecological) actually create different play experiences? If a campaign set in Nordhalla plays exactly the same as one set in Sundale, the regional differentiation has failed.

---

## Output Format

Produce the audit as a structured report with the following sections:

### Section 1: Critical Breaches
Factual contradictions between files. Things that are stated differently in different places. These must be fixed immediately because they make the world incoherent.

Format:
```
BREACH #[number]: [Brief description]
- File A, line X: Says [thing]
- File B, line Y: Says [contradictory thing]
- Impact: [Why this matters]
- Fix: [Specific recommendation]
```

### Section 2: Narrative Weaknesses
Writing quality issues -- telling instead of showing, cliches, voice breaks, missing sensory detail.

Format:
```
WEAKNESS #[number]: [Brief description]
- Location: [File, line/entry]
- Problem: [What's wrong]
- Example: [The weak text]
- Fix: [Suggested rewrite or approach]
```

### Section 3: Cross-Reference Gaps
Missing connections, orphaned entries, one-way references.

Format:
```
GAP #[number]: [Brief description]
- Source: [Entry that should connect]
- Missing: [Entry it should connect to but doesn't]
- Fix: [What to add and where]
```

### Section 4: World Building Holes
Missing information that a GM would need.

Format:
```
HOLE #[number]: [Brief description]
- Category: [Race/Region/Faction/Economy/Ecology/Technology/Wyrd]
- What's missing: [Specific gap]
- Why it matters: [Campaign impact]
- Suggestion: [What to add]
```

### Section 5: Naming & Linguistic Issues
Names that break convention, incorrect terrain terms, cultural mismatches.

Format:
```
NAME #[number]: [Brief description]
- Location: [File, entry]
- Issue: [What's wrong]
- Convention: [What it should follow]
- Fix: [Suggested change]
```

### Section 6: Playability Flags
Lore that's hard to use at the table.

Format:
```
PLAY #[number]: [Brief description]
- Location: [File, entry]
- Issue: [Why a GM struggles]
- Fix: [How to make it usable]
```

### Section 7: Priority Rankings

Rank ALL findings by severity:

| Priority | Category | Issue # | Description | Effort |
|---|---|---|---|---|
| P0 (Must Fix) | Breach | | | |
| P1 (Should Fix) | | | | |
| P2 (Nice to Have) | | | | |
| P3 (Future Polish) | | | | |

### Section 8: Overall Assessment

A single paragraph summarizing: What is the overall quality of the lore? What are its greatest strengths? What are its most dangerous weaknesses? What would a GM at the table actually struggle with? Be honest. Be brutal. Be specific.

---

## Final Instruction

The value of this audit is directly proportional to its honesty. If you find 5 problems, you weren't looking hard enough. If you find 50, you're getting warmer. The goal is not to tear down the work -- it is to make it bulletproof. A world that survives this audit is a world a GM can run with confidence. A world that doesn't is a world that will fall apart at the table.
