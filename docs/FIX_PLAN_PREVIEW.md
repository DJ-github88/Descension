# FIX PLAN — PREVIEW FOR REVIEW

## CRITICAL

### 1. Dead Moon egg vs. corpse
**Wrong:** lunarchData.js says both "dead body whose ghost orbits" (line 226) and "it was an egg, not a celestial body" (line 232). Direct contradiction in the same file.
**Fix:** Keep the egg as absolute truth. The "dead moon" poetry becomes in-world theology that the Lunarchs now know was wrong. Rewrite line 226's philosophy section from "the moon is dead" to "we thought the moon was dead." The beauty stays; the contradiction vanishes.

### 2. Wyrd is 3 incompatible things
**Wrong:** rulesData.js says primordial rot. animistData.js says inhaled fungal spores. falseProphetData.js says cosmic void-speech. Three ontologies for one word.
**Fix:** CORE_LORE_FRAMEWORK.md's definition ("spiritual detritus of the Breach") is the only true one. Spores become an *interface* to sense the Wyrd. The Void becomes a separate phenomenon the False Prophets channel (renamed "the Silence" to avoid confusion). Add a hierarchy paragraph to CORE_LORE_FRAMEWORK.md.

### 3. The Watcher doesn't exist in any data
**Wrong:** Named in CORE_LORE_FRAMEWORK.md as "the entity that reached Viridane before Keth-Amar." Zero mentions in loreDictionary.js, rulesData.js, timelineStore.js, or any class file.
**Fix:** Add entries to loreDictionary.js (historical_figure), rulesData.js (cosmic mythos section), timelineStore.js (crisis event), and a reference in lunarchData.js/briaran.js (since Viridane bloodline = Briaran/Lunarch).

## MODERATE

### 4. 6 classes have no political faction
**Wrong:** Chronarch, Gambit, Minstrel, Shaper, Toxicologist, Revenant have mechanics but no worldFriction — no stance, no enemies, no side.
**Fix:** Each gets a 2-3 line worldFriction block. Examples:
- Chronarch: pro-timeline-stabilizers vs. pro-accelerators
- Minstrel: The Last Verse as oral-resistance against the Scribe-Cartel
- Revenant: voluntary Debt-Revenants vs. escaped dead hunted by the Keeper
- (Gambit, Shaper, Toxicologist similarly)

### 5. Timeline fracture is scattered
**Wrong:** The "something is breaking time" crisis appears in augurData.js (accuracy 93%→41%) and timelineStore.js fragments but has no single reference section.
**Fix:** Add a `cosmic-crisis` section to rulesData.js that consolidates: "The timeline is fracturing. Every class that touches time (Augur, Chronarch, Lunarch, False Prophet, Animist) is experiencing interference."

### 6. Myrathil has no land motivation
**Wrong:** Fully aquatic race with zero explanation for why a player would adventure on dry land.
**Fix:** Add 3 sentences. "Myrathil leave the vents for: a Deep-Queen death-command, a bond-debt, or the Dimming."

### 7. Groven & Fexrick don't acknowledge each other
**Wrong:** Two artificial-humanoid races in the same region (Cragjaw Peaks) with zero cross-references.
**Fix:** Add 3 lines to groven.js explaining they distrust Fexrick as non-biological dead. Add 3 lines to fexrick.js explaining they salvage Groven bone for carbon reinforcement.

## MINOR

### 8. Aex's silence is a dangling thread
**Fix:** One sentence. "The silence is not death. Aex is listening."

### 9. "Deepening" capitalization ambiguous
**Fix:** "The Deepening" = Sol's specific event. "deepening" = universal star cycle. One line in cosmic mythos.

### 10. Combat examples tonal collision
**Fix:** 2-line tone-setting intro to each combat example before the mechanics.

## STRUCTURAL

### 11. No connective thread between the 7 secrets
**Fix:** Add paragraph to CORE_LORE_FRAMEWORK.md: "The Watcher causes the timeline fracture. The fracture accelerates the moon-egg hatching. Selene translates the egg for the Watcher. All 7 secrets are one secret."

### 12. Dead moon has no name
**Fix:** Add name (e.g. "Vael") to lunarchData.js and loreDictionary.js.

---

**Total: 12 fixes, ~20 files, ~1.5 hours**

Want me to proceed file by file, or batch them? I'd recommend walking through in priority order (Critical → Moderate → Minor → Structural) so you can approve or adjust each step before we move on.