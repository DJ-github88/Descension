# Mythrill VTT — Lore Consistency Audit v3

Use this prompt to scour the Mythrill codebase for inconsistencies at a level deeper than v1 and v2 caught. v3 targets categories of bugs discovered in production across two full audit cycles.

## AUDIT PROTOCOL

For every finding: **Severity** (CRITICAL/MAJOR/MINOR), **File:Line**, **Problem**, **Expected**, **Category**

---

## CATEGORY A: AGE MATH — "HOW OLD IS THIS ACTUALLY?"

Every claim about an entity's age must be mathematically consistent with its founding date and the present year (~800).

### A.1 — "X centuries old" vs founding year
Grep all files for "centuries", "hundred years", "generations". For each:
- Extract the founding year for that entity (from timeline or class/race file)
- Calculate: present year (~800) minus founding year = actual age
- Flag any overstatement or understatement by more than 10%.

### A.2 — "Still alive since Year X" lifespan math
For every NPC/founder described as alive: calculate age (800 minus founding/major-event year plus assumed adult age at that time). Compare to race lifespan. Flag exceedance without explanation.

### A.3 — "For X generations" demographic math
For any claim about "generations" (e.g., "eleven generations of Mask-Borne carvings"), verify: generation count × typical generation span (~25-30 years for humans, longer for longer-lived races) ≈ the time elapsed. Flag math that doesn't add up.

### A.4 — "Eight hundred years" audit
Grep ALL files for "800", "eight hundred", "eight centuries". For each, answer: is the thing being described actually ~800 years old? If the founding year is later (e.g., Plaguebringer Year 500 = 300 years), flag it.

---

## CATEGORY B: EVENT ORDER — "COULD THIS HAVE HAPPENED?"

### B.1 — Entity appears in event before it existed
For every entity (class, faction, subrace, location) referenced in a timeline event, verify it existed at that time. Flag any anachronism.

### B.2 — Creation before preconditions
For every entity's founding/emergence, verify all its preconditions existed first. E.g., the Mimir Purge (Year ~220) could not happen before the Fog Compact (Year 5) created the fog. The Over-Shanty (Year 412) could not exist before Bryngloom was settled. Flag logically impossible sequences.

### B.3 — Death before life
For every NPC, verify they didn't "die" or "fall" before events they're described as participating in. Flag timeline impossibilities.

### B.4 — Governance before territory existed
For each region, verify its noble house existed before or at the same time as the regional bargain that defined the territory. Flag any house "ruling" a region before the bargain that created it.

---

## CATEGORY C: ATTRIBUTION — "WHO ACTUALLY DID THIS?"

### C.1 — Bargain attribution
For each of the 7 regional dark bargains, verify the correct house/entity is named as the bargain-maker across all files. Flag any file crediting the wrong house.

### C.2 — Founder attribution
For each of the 20 class traditions, verify the founder name is consistent across: the class file's `originStory`, `loreDictionary.js`, and `timelineStore.js` events. Flag any file naming a different founder.

### C.3 — Event participant attribution
For each timeline event's `factionIds` and `classIds`, verify the listed entities actually participated (per their own lore). Flag any event listing a faction or class that, per its own file, was not involved.

### C.4 — Kill attribution
For significant deaths (Aex's flaying, the heirs' sacrifice), verify the killer/perpetrator is consistently named across all files. Flag contradictions.

---

## CATEGORY D: NUMERIC CONSISTENCY — "DO THE NUMBERS MATCH?"

### D.1 — Population claims
Grep for any population number (e.g., "4,000" for Solvan's Stand, "30,000" for pre-decline). Verify the number is plausible for the described settlement type, era, and conditions. Flag implausible populations.

### D.2 — Distance claims
Grep for mileage/distance (e.g., "ninety-mile Basalt Shyr", "three miles"). Do they match the world map layout? Flag geographic impossibilities.

### D.3 — Duration claims
Grep for time durations (e.g., "three days", "seven years", "within a decade"). Are they consistent with the described events? E.g., if a migration "took decades" but the start and end points are 93 years apart, does "decades" understate the duration?

### D.4 — Quantity claims
Grep for specific quantities (e.g., "47 active Inquisitors", "seven Sundered Monoliths", "six noble houses capitulated"). Verify the number is correct and consistent across all files.

---

## CATEGORY E: SPATIAL CONSISTENCY — "WHERE IS THIS?"

### E.1 — Region adjacency
For every subregion, verify its described neighbors and borders are physically possible given the known world layout. Flag geographic impossibilities.

### E.2 — Location proximity claims
For any claim like "within sight of", "a day's ride from", "visible from" — verify the two locations are in the same or adjacent subregions.

### E.3 — Climate consistency
For each location, verify its described climate matches its region's biome. E.g., no tropical paradises in Nordhalla, no frozen tundras in Sundale's caldera.

### E.4 — Route coherence
For each trade route in `timelineStore.js`, verify its `origin`, `destination`, and `via` locations form a physically traversable path. No route should jump across impassable terrain without explanation.

---

## CATEGORY F: HIERARCHY AND SCOPE — "DOES THE SCALE MAKE SENSE?"

### F.1 — Settlement classification
Verify that the settlement type (city, town, keep, outpost, camp) matches its described population, political importance, and region size. Flag a "city" with 500 people or a "camp" with 10,000.

### F.2 — Faction scope
Verify a faction's described reach (local, regional, continental) matches its membership, resources, and headquarters. Flag a "continent-spanning cartel" with only one office.

### F.3 — Class rarity vs ubiquity
For each class, verify its described prevalence matches its lore. If a class is described as "only 47 remain" (Inquisitor) but appears in every region's ClassOriginsDisplay as a native class, flag the tension.

---

## CATEGORY G: EMOTIONAL AND TONAL CONSISTENCY — "DOES THIS FEEL RIGHT?"

### G.1 — Tonal clash
Flag any passage where the tone contradicts the established grim-dark setting. E.g., cheerful optimism about Sol's return in the Sundrift Vale when the 40th Rebirth Window produced nothing.

### G.2 — Motivation contradiction
For any NPC described with a goal or motivation, verify it doesn't contradict their faction's stated goals. Flag a Scribe-Sentinel who wants to "abolish the Sovereign Ledger."

### G.3 — Knowledge anachronism
Flag any character described as knowing something they couldn't know. E.g., a Year 100 character knowing about the Year 500 Great Revision.

---

## CATEGORY H: DEPRECATED AND LEGACY — "IS THIS STILL CANON?"

### H.1 — Merged class names
Grep for "Bladedancer", "Formbender", "Covenbane", "Exorcist", "Deathcaller", "Lichborne", "Dreadnaught", "Titan", "Doomsayer", "Chaos Weaver", "Gambler", "Fate Weaver". Flag any that appear as active classes rather than as historical footnotes or merged-into references.

### H.2 — Obsolete name variants
Grep for "Solbound" (should be Sol), "Thrum" (should be Thrumm). Flag remaining instances.

### H.3 — Old era labels
Grep for any era label that predates the current 3-era system (Before the Deepening, The Deepening, Age of the Dimming). Flag any non-standard era names.

### H.4 — Superseded descriptions
Compare each entity's description in `.md` documentation files against the canonical data files. Flag any `.md` file that hasn't been updated to reflect recent lore changes.

---

## CATEGORY I: GAP DETECTION — "WHAT'S MISSING?"

### I.1 — Undated entities
List every class, subrace, faction, institution, and major location that lacks a founding year or date range.

### I.2 — Undescribed entities
List every named entity referenced in prose that has no entry in `loreDictionary.js`, `npcStore.js`, or `factionStore.js`.

### I.3 — Unlinked LoreLink targets
List every proper noun in display-component prose that SHOULD be a `<LoreLink>` but isn't.

### I.4 — Missing causal links
In `timelineStore.js`, flag any event whose `causes` or `effects` arrays are empty when they logically should have entries.

### I.5 — Undocumented folklore pairs
For any creature whose `heritage` field doesn't reference either of its region's designated folklore traditions, flag it as needing documentation.

---

## CATEGORY J: CROSS-FILE IDENTITY — "IS THIS THE SAME THING?"

### J.1 — Same name, different IDs
Search for entities that have the same display name but different IDs across files (e.g., "The Warden" as both a cosmic entity and a class, or two different creatures both named "Sluagh").

### J.2 — Same ID, different names
Search for entities that have the same ID but different display names across files.

### J.3 — Same concept, different terms
Search for lore concepts described with different terminology in different files. E.g., is "the hunger" in one file the same as "the Hunger Pact" in another?

---

## FINAL REPORT FORMAT

### A. CRITICAL (must fix — lore is wrong)
### B. MAJOR (should fix — misleading or inconsistent)
### C. MINOR (polish — wording, style)
### D. GAPS (missing content)
### E. METRICS
- Total checks performed
- Total entities verified
- Issues found (by severity and category)
- Files with zero issues
- Files with the most issues
- New categories discovered (for v4)
