# PASS 3 AUDIT — MYTHRILL VTT RULES CONSISTENCY & GAP ANALYSIS

You are performing a PASS 3 audit of the Mythrill VTT codebase at D:\VTT. This is a RUTHLESS rules-consistency audit. Previous passes fixed mechanical-lore alignment, cross-references, naming conventions, path redesign, and lore expansion. Now dig into what we HAVEN'T checked.

## CONTEXT: WHAT WAS FIXED IN PASSES 1-2

PASS 1 fixed: cosmology layering, fabricated factions, morthel→neth rename, Sylvain/Sylvanus collision, False Prophet founder (Li Wei), Augur Harbinger text, 30+ loreDictionary entries, biome encounter tables (43 creatures), language merges, Sundrift Vale biome, 7 seeded factions, NPC rewrites, timeline events, Nesta/Nyssa collision, human subrace languages, nameGenerator.

PASS 2 fixed: Petrified condition added to statusEffects, emberspire loreDictionary entry, 8+ ghost faction IDs replaced, morthel→neth refactor across 8 files, savingThrowModifiers normalized to valid categories, +3/-2 stat outliers capped to +2/-1, 5 malformed LoreLink closing tags fixed, faction type 'ally'→'allied', reciprocal faction relationships, stale 'tempest' class→'gambit', loreDictionary entries for House Viridane/Root-Veil/Thrumm/Deep Alchemists/Keeper/Vault-Breath/Dawn Vigil/Vat-Breakers, zone ID convention documented, Lunarch resource renamed to Lunar Flux, duplicate animist removed, petrified added to spellcrafting wizard, pathData.js fully rewritten with 9 Mythrill-native paths (vessel/bound/unseen/scarred/archive_sworn/indebted/frostborn/wayfarer/threshold_watcher), raceMechanics.js created (Over-Sung/Unraveling), explorationRules.js created (Sundrift Vale + Lost Brood arc), backgroundEquipment.js path refs updated, GM_WORLD_GUIDE.md canonical-source notice added.

---

## AUDIT TARGETS

### A. RULES ENGINE CONSISTENCY

1. **Damage type propagation**: Do ALL spell/ability data files (testSpells.js, class data ability sections, creatureLibraryData.js abilities) use ONLY the 8 valid damage types (physical, ember, rime, storm, arcane, primal, blight, wyrd)? Or do some still use legacy terms (fire, necrotic, psychic, radiant, cold, lightning, thunder, poison, acid, force, holy)? Check testSpells.js specifically — it was built before the damage type refactor.

2. **Status effect propagation**: Do spell/ability effects reference ONLY the 25 valid status effects from statusEffects.js (stun, slow, root, knockback, pull, silence, disarm, blind, fear, charm, confuse, sleep, bleed, poison, burning, disease, weakness, vulnerability, curse, disoriented, marked, taunt, haste, strengthened, resistance, immune, regen, shielded, petrified)? Or do they reference D&D conditions (grappled, paralyzed, restrained, blinded, frightened, charmed, poisoned, incapacitated, prone, concentration, invisible, flying, truesight)?

3. **Save type propagation**: Do ALL spells/abilities that call for saving throws use ONLY the 6 valid base stats (strength, agility, constitution, intelligence, spirit, charisma)? Or do some reference D&D saves (fortitude, reflex, will, dexterity, wisdom)?

4. **Creature stat consistency**: Does creatureLibraryData.js use the same damage types, status effects, and save types as the player-facing systems? Are creature CR/challenge ratings internally consistent?

### B. CLASS DATA INTEGRITY

5. **Complete class audit**: For ALL 20 classes in vtt-react/src/data/classes/, verify each has: id, name, role, resource gauge name, resource range, description, combat overview, origin story, notable figures, races/cultural affiliation, city reception, recommended ability scores, key abilities list. Flag any class missing required fields.

6. **Class resource gauge consistency**: For each class's primary resource, verify:
   - The resource name in the class data file matches what's displayed in ClassResourceBar.jsx
   - The resource range (min/max) is defined and referenced
   - Resource regeneration rules are stated somewhere

7. **Class ability score recommendations vs. subrace modifiers**: Do the ability score recommendations in each class file create viable archetypes with the CORRECTED subrace stat modifiers? After PASS 2 fixed Deep-Born (spirit 2/agi 1/con 1/cha -1), Solvarn (spirit 2/con 1/agi -1), and Morren (int 2/spirit 1/str -1), are there recommended class/subrace combos that are now suboptimal or broken?

### C. EQUIPMENT & ECONOMY

8. **Equipment damage types**: Do weapons in the equipment data reference valid damage types? Search for any "slashing", "piercing", "bludgeoning" references (D&D terms) — the Mythrill system uses "physical" for all martial damage per damageTypes.js.

9. **Starting currency completeness**: Does startingCurrencyData.js have entries for ALL 10 races × ALL their subraces? After the morthel→neth fix, verify no subrace is missing a gold amount.

10. **Race equipment completeness**: Does raceEquipment.js have base items and subrace items for ALL 10 races × ALL their subraces? After the MORTHEL→NETH variable rename, verify Neth entries work.

### D. ZONE & ENCOUNTER INTEGRITY

11. **Zone faction validation**: Do ALL zones in zoneData.js reference ONLY faction IDs that exist in factionStore.js's SEEDED_FACTIONS? After PASS 2 replaced ghost faction IDs, zone-level faction references may still be stale.

12. **Zone connection bidirectionality (ALL regions)**: PASS 2 only verified Sundrift Vale zones. Check ALL 35 zones for bidirectional connections. If zone A lists zone B in its connections array, does zone B list zone A?

13. **Creature encounter table validation**: Do the biome encounter tables in biomeData.js reference creatures that actually exist in creatureLibraryData.js? The PASS 1 fix replaced 43 D&D creatures with Mythrill-native ones — verify the replacement creature IDs are real.

### E. LORE DICTIONARY COMPLETENESS

14. **Orphaned relatedTerms**: Every entry in loreDictionary.js has a `relatedTerms` array. Do ALL relatedTerms reference termIds that actually exist in the dictionary? This was NOT checked in PASS 2.

15. **LoreLink coverage in race files**: Do race data files (vtt-react/src/data/races/) use LoreLink tags for major lore references, or are important terms just plain text? Check if race lore text mentions regions, houses, locations, or historical figures that SHOULD be LoreLinked but aren't.

16. **LoreLink coverage in class files**: Same check for class data files — are there proper nouns that lack LoreLink wrapping?

### F. PASS 2 REGRESSION CHECKS

17. **Faction store description coherence**: The PASS 2 faction fixes used blunt bash replacements to change targetFactionId values. Some descriptions may now be nonsensical (e.g., a description mentioning "The Myrathil claim the deep ocean" now targeting deep-alchemists instead). Read ALL faction relationship descriptions and flag any where the description text doesn't match the target faction.

18. **backgroundEquipment.js path mapping accuracy**: After replacing old path IDs with new ones (mystic→vessel, zealot→bound, etc.), do the equipment items make sense for the new path themes? A "Holy symbol" under what was 'zealot' (now 'bound') may or may not fit — but "Crystal focus" under what was 'mystic' (now 'vessel') needs to match the new equipment list in pathData.js.

19. **New loreDictionary entries validation**: Do the 10+ new entries added in PASS 2 have internally consistent lore? Do they contradict anything in race files, class files, or rulesData.js? Check specifically: the emberspire entry vs. what sundale and house_solvan say about Emberspire; the root_veil entry vs. what neth.js says about the Root-Veil.

### G. UNEXPLORED SYSTEMS

20. **Spellcrafting wizard system**: The spellcrafting wizard at vtt-react/src/components/spellcrafting-wizard/ has its OWN data files for damage types, status effects, etc. Is this system consistent with the main game data? After PASS 2 added 'petrified' to the spellcrafting wizard, are there other status effects or damage types that are still out of sync?

21. **Talent tree data**: Check vtt-react/src/data/talentTrees/ — do talent effects reference valid damage types, status effects, and save types? Are talent prerequisites internally consistent (no circular dependencies, no references to non-existent talents)?

22. **Level progression system**: Does the level-up system (pointBuySystem.js, levelData.js, or equivalent) handle the corrected stat modifiers correctly? Are there any hardcoded stat bonus expectations that assume the old +3 values?

23. **Token/summonable creatures**: Does summonableTokens.js reference valid races, damage types, and abilities? After the morthel→neth fix, verify all Neth tokens are correct.

24. **Name generator completeness**: Does nameGenerator.js have naming tables for ALL 10 races and their subraces? After the morthel→neth fix, do Neth name tables generate lore-appropriate names?

25. **Timeline event consistency**: Do timeline events in timelineStore.js reference valid locations, factions, and NPCs? Do dates form a coherent chronological sequence?

---

## OUTPUT FORMAT

For each finding:
- Quote EXACT text with file path and line number
- Categorize as CRITICAL / MAJOR / MINOR / OPPORTUNITY
- CRITICAL = will cause runtime error or data corruption
- MAJOR = mechanical inconsistency that affects gameplay
- MINOR = cosmetic inconsistency or maintenance hazard
- OPPORTUNITY = system gap that should be addressed for completeness

Be ruthless. Be specific. Cite line numbers. Quote exact text. Do not speculate — verify every claim against the actual file contents.
