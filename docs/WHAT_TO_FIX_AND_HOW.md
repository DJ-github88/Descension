# WHAT TO FIX AND HOW

## CRITICAL (fix immediately, blocks coherence)

### 1. Dead Moon Identity Crisis
**Files:** `lunarchData.js` (lines 226, 232)
**Problem:** Same file says moon is a dead celestial body AND an egg. Mutually exclusive.
**Fix:** Pick egg as truth. Rewrite line 226 from "the moon is dead, its ghost still orbits" to "the moon was *thought* dead  -  a celestial corpse. We now know it was an egg. The ghost-orbit theology was our ancestors' best guess." The poetry stays as character-belief, not world-fact.

### 2. The Wyrd Has 3 Ontologies
**Files:** `rulesData.js` (line 89), `animistData.js` (line 65), `falseProphetData.js` (line 180), `CORE_LORE_FRAMEWORK.md`
**Problem:** Wyrd = primordial rot ≠ inhaled spores ≠ cosmic void-speech. Three incompatible definitions.
**Fix:** Adopt core framework definition ("spiritual detritus of the Breach") as the only truth. Reframe:
- Vreken spores = a method of *sensing* the Wyrd, not the Wyrd itself
- False Prophet Void = a *separate* cosmic phenomenon the Prophets channel (rename to "the Silence" to distinguish from Wyrd)
- Animist inhalants = also a sensing/interface mechanism
- Add 2 lines to CORE_LORE_FRAMEWORK.md making the hierarchy explicit

### 3. The Watcher Doesn't Exist Anywhere
**Files:** Needs to be in `loreDictionary.js`, `rulesData.js`, `timelineStore.js`, `lunarchData.js`
**Problem:** Named in framework as "entity that reached Viridane before Keth-Amar." Zero references in any data file.
**Fix:** Add to minimum 3 files:
- `loreDictionary.js`: new `historical_figure` entry for "The Watcher"  -  entity of unknown origin, reached House Viridane in the mist during the Binding
- `rulesData.js`: cosmic mythos section, 3 sentences: who it is, what it did, why it's relevant to the current crisis
- `timelineStore.js`: crisis event  -  "first confirmed Watcher sighting in [region]"

## MODERATE (fix next, improves dramatic weight)

### 4. 7 Apolitical Classes Need Faction Alignment
**Files:** `chronarchData.js`, `gambitData.js`, `minstrelData.js`, `shaperData.js`, `toxicologistData.js`, `revenantData.js`  -  each needs a `worldFriction` block (2-3 lines)
**Fix per class:**
- **Chronarch:** Pro-timeline-stabilization (allied with Augurs seeking unified timeline) vs. pro-accelerators (hired by Keth-Amar adherents to fracture time faster)
- **Gambit:** Sea-Charter enforcers (Mereval loyalists) vs. Press-Warrant resisters (Brine-Bond underground smuggling undocumented refugees)
- **Minstrel:** The Last Verse as oral-resistance network against the Sovereign Ledger  -  they remember what the ink erases. Anti-Scribe-Cartel.
- **Shaper:** Are they Groven-aligned (bone-sculpting Ancestor-Spans) or Fexrick-aligned (Lost Brood vat mechanics)? Pick one or make it a faction split.
- **Toxicologist:** Scribe-Cartel chemist vs. underground reagent-stealer supplying Forgotten settlements
- **Revenant:** Voluntary Debt-Revenant (Morren fighting Neth bondage by legally dying) vs. escaped dead (hunted by the Keeper, freedom-fighters)

### 5. Timeline Fracture Is Fragmented Across Files
**Files:** `augurData.js` (line 216), `timelineStore.js`
**Problem:** The "something is breaking time" revelation appears in two places but is never consolidated into a single section a GM can reference.
**Fix:** Add a `cosmic-crisis` entry in `rulesData.js` that explicitly states: "The timeline is fracturing. The Augurs' accuracy dropped from 93% to 41%. The Chronarchs' temporal stitching is failing. Every class that touches time (Lunarch phases, False Prophet visions, Animist ancestral dialects) is experiencing interference."

### 6. Myrathil Has No Land Motivation
**File:** `myrathil.js`
**Problem:** Fully aquatic merfolk with no explanation for why a player would adventure on dry land.
**Fix:** Add 2-3 sentences to the opening description: "Myrathil adventurers leave the vents for three reasons: a death-command from the Deep-Queen, a bond-debt to a surface dweller, or the Dimming  -  the vents are cooling, and the surface is the only direction left."

### 7. Groven & Fexrick Need a Relationship
**Files:** `groven.js`, `fexrick.js`
**Problem:** Two artificial-humanoid races in the same region with zero cross-references.
**Fix:** Add 3 lines to each:
- `groven.js`: "The Groven do not trust the Fexrick  -  their clockwork bodies cannot be added to the Ancestor-Spans, and a dead machine is simply dead, not remembered."
- `fexrick.js`: "The Fexrick salvage Groven bone-slag for carbon-fiber reinforcement. Some Groven call this desecration. The Fexrick call it the only way to build a bridge that doesn't scream."

## MINOR (fix when convenient, tightens the world)

### 8. Aex's Silence Is Unexplained
**File:** `rulesData.js` (line 33)
**Fix:** Add one sentence after "Now Aex is silent"  -  e.g. "The silence is not death. Aex is listening."

### 9. The Deepening Capitalization Is Ambiguous
**Files:** `rulesData.js`, `falseProphetData.js`, `augurData.js`
**Fix:** Capitalize "The Deepening" for Sol's specific event. Use lowercase "star's deepening" for the universal cycle. Add 1 line to cosmic mythos clarifying this.

### 10. Combat Examples Tonal Whiplash
**Files:** `apexData.js`, `augurData.js`, `arcanoneerData.js` (combat example sections)
**Fix:** Don't rewrite  -  just add a 2-line intro to each combat example that sets the tone. e.g. for Apex: "This is not a game of numbers. This is a hunt. The bandits are prey, and you are the thing that ends prey." Then the mechanics follow.

## STRUCTURAL (architectural, not file-level)

### 11. Add Connective Thread Between All 7 Secrets
**File:** `CORE_LORE_FRAMEWORK.md`
**Fix:** Add this paragraph to the "Secrets" section:
> "None of these mysteries is independent. The Watcher is causing the timeline fracture. The timeline fracture is accelerating the moon-egg's hatching. The moon-egg's hatching is what Selene is translating for the Watcher. The players can discover any entry point and find the same answer: something is unraveling the timeline to hasten or prevent the last thing Keth-Amar expects."

### 12. Name the Dead Moon
**Files:** `lunarchData.js`, `loreDictionary.js`
**Fix:** Add a name. "Vael" (veil/echo). Then the egg-revelation has a named parent, which gives it weight.

---

## ONE-PAGE EXECUTION PLAN

| Step | What | Files Touched | Time |
|------|------|---------------|------|
| 1 | Wyrd: adopt CORE def, reframe all others | CORE_LORE_FRAMEWORK.md, animistData.js, falseProphetData.js | 15min |
| 2 | Dead Moon egg/corpse: rewrite as belief-vs-truth | lunarchData.js | 10min |
| 3 | The Watcher: create entries in 3 files | loreDictionary.js, rulesData.js, timelineStore.js | 15min |
| 4 | 6 apolitical classes: add worldFriction blocks | chronarchData.js, gambitData.js, minstrelData.js, shaperData.js, toxicologistData.js, revenantData.js | 30min |
| 5 | Timeline fracture: consolidate into rulesData.js | rulesData.js, augurData.js | 10min |
| 6 | Myrathil land motivation: add 3 sentences | myrathil.js | 5min |
| 7 | Groven/Fexrick cross-reference | groven.js, fexrick.js | 5min |
| 8 | Aex silence: one sentence | rulesData.js | 2min |
| 9 | Deepening capitalization: clarify | rulesData.js, CORE_LORE_FRAMEWORK.md | 5min |
| 10 | Connective thread: add to CORE | CORE_LORE_FRAMEWORK.md | 5min |
| 11 | Name the dead moon | lunarchData.js, loreDictionary.js | 5min |
| **Total** | | **~20 files** | **~1.5 hours** |