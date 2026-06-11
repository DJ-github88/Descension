# MYTHRILL CONSOLIDATION MASTER PLAN

> Last updated: 2026-06-10
> Status: **Phase 7 complete. 30→20 classes. 16→8 damage types. 12→10 playable races. 15 Mythrill-native backgrounds. Library window consolidated. Target HUD tooltips implemented. Interactive World Map with region soft-lock fully integrated.**

---

## NEW SESSION PROMPT

Copy the block below into a fresh opencode session to continue from the exact point we left off:

> We are executing Phase 7 of Mythrill VTT's class consolidation plan. Phases 1-6 fully complete. Full plan at docs/CONSOLIDATION_MASTER_PLAN.md.
>
> Phase 7 goal: Interactive world map.
>
> **DONE:**
> - **Phase 1**: 10 class merges. 30→20 classes.
> - **Phase 2**: 16 damage types consolidated to 8 (physical, ember, rime, storm, arcane, primal, blight, wyrd). LEGACY_TYPE_MAP (22 entries). ~80+ files updated.
> - **Phase 3**: Race trait cap at 5/race. 12→11 active files (neth.js deleted). 5 new traits added. "Cannot lie" replacements verified.
> - **Phase 4**: 15 D&D SRD backgrounds replaced with 15 Mythrill-native backgrounds. 10 D&D-generic language names replaced. Shared languages.js created. backgroundEquipment.js updated.
> - **Phase 5**: Corvani demoted to Nordhalla subfolk (10 playable races). Zhentarim replaced with Unlit Veil (Unlit Astril intelligence network). Solvarn Dawn Vigil active agenda. Iceheart Shard-Window designed. Myrathil "Deep Speech" → "Sea-Call". SocialEncounterGenerator "Goblin Stack" → "Fexric Scrap-Gang". Lore synced across GM_WORLD_GUIDE.md, rulesData.js, loreDictionary.js. 15 files modified, corvani.js deleted.
> - **Phase 6**: Library window consolidated (Bestiary/Armory/Atlas under one GM-only tab). Target HUD buff/debuff tooltips implemented (hover shows name, description, stat effects, duration). GM mode toggle and window position persistence deferred (not needed).
>
> **Phase 7 key tasks from the plan:**
> - Design map component using existing landing page background
> - Wire to zone/location data (deepLocationData.js, rulesData.js regions)
> - Add region soft-lock integration (recommended, not enforced; toggle to unlock)
>
> **Build command:** `cd vtt-react; npx craco build` (PowerShell — no `&&`)
> **Build verification:** Skip during session. Verify syntax manually.
> **Known pre-existing issue:** Cannot access '__WEBPACK_DEFAULT_EXPORT__' before initialization in HUDContainer chunk (Phase 1 deleted classes, not current work).
>
> **Key files for Phase 7:**
> - Landing page background: search for existing map image in `vtt-react/public/` or `vtt-react/src/`
> - Location data: `vtt-react/src/data/deepLocationData.js`
> - Region data: `vtt-react/src/data/rulesData.js` (region sections)
> - Lore: `vtt-react/src/data/loreDictionary.js`
> - World guide: `docs/GM_WORLD_GUIDE.md`
>
> **Key constraints:**
> - Keep 2 tabs open (rules + game), not an in-game overlay
> - No new keyboard shortcuts
> - Follow existing Zustand store patterns for state management
> - Use Bootstrap for responsive UI
> - Region soft-lock: recommended, not enforced; toggle to unlock

---

## THE GOAL

Merge 30 classes down to 20, collapse 16 damage types to 8, cap racial traits at 5, rewrite backgrounds, improve UI/UX, and fix lore consistency based on a five-pillar audit.

---

## FINAL 20-CLASS ROSTER

| # | Final Name | Source Classes | Merge Type | Status |
|---|---|---|---|---|
| 1 | Arcanoneer | Standalone | Keep | Kept (no changes) |
| 2 | Augur | Augur + Oracle | Absorb Oracle | Completed |
| 3 | Berserker | Standalone | Keep (rename TBD) | Kept (no changes) |
| 4 | Shaper | Bladedancer + Formbender | New file | Completed |
| 5 | Harbinger | Chaos Weaver + Doomsayer | New file | Completed |
| 6 | Chronarch | Standalone | Keep | Kept (no changes) |
| 7 | Inquisitor | Covenbane + Exorcist | New file | Completed |
| 8 | Revenant | Deathcaller + Lichborne | New file | Completed |
| 9 | False Prophet | Standalone | Keep | Kept (no changes) |
| 10 | Gambit | Gambler + Fate Weaver | New file | Completed |
| 11 | Apex | Huntress (renamed) | Rename | Completed |
| 12 | Lunarch | Standalone | Keep | Kept (no changes) |
| 13 | Martyr | Martyr + Dreadnaught | Absorb Dreadnaught | Completed |
| 14 | Minstrel | Standalone | Keep | Kept (no changes) |
| 15 | Plaguebringer | Standalone | Keep | Kept (no changes) |
| 16 | Animist | Primalist + WD + Inscriptor | Triple merge | Completed |
| 17 | Pyrofiend | Standalone | Keep | Kept (no changes) |
| 18 | Spellguard | Standalone | Keep | Kept (no changes) |
| 19 | Toxicologist | Standalone | Keep | Kept (no changes) |
| 20 | Warden | Warden + Titan | Absorb Titan | Completed |

---

## MERGE TYPES EXPLAINED

**Rename merges:** Change class name + file name. All internal references updated. No content change.
- Huntress -> Apex

**Absorb merges:** Keep the surviving class's identity. Add absorbed class's mechanics as a new specialization.
- Augur absorbs Oracle -> Seer specialization
- Warden absorbs Titan -> Monolith specialization
- Martyr absorbs Dreadnaught -> Ironclad specialization

**New-file merges:** Create a new class data file combining the mechanics and lore of both source classes. Delete source files.
- All 6 remaining merges are this type

---

## 8 DAMAGE TYPES (Mythrill-Native)

| Type | Absorbs | Source |
|---|---|---|
| Physical | Bludgeoning + Piercing + Slashing (become weapon properties) | Mortal combat |
| Ember | Fire + Radiant | Sol's buried warmth |
| Rime | Frost | The frozen world's grip |
| Storm | Lightning + Force | Kinetic fury |
| Arcane | Pure magic | Binding ritual residue |
| Primal | Living things, growth | The world's refusal to die |
| Blight | Necrotic + Void + Poison | Keth-Amar's corruption |
| Wyrd | Chaos + Psychic | Spiritual rot |
Magic should likewise physical be the super category as physical is, but for our magic damage types 
Healing stays as a separate restorative category.

---

## "CANNOT LIE" FIX

- **Keep:** Neth (pact-enforced truth)
- **Replace:** Briaran (thorns track broken promises), Myrathil (storm-blood weather prediction), Groven (bone-reading divination)

---

## PHASE 1: CLASS CONSOLIDATION [COMPLETED]

### 1A. Merge Data Files (10 merges)

1. **Apex** -- Huntress renamed. Create `apexData.js` from `huntressData.js`. Update all 145+ references across 30+ files. Delete `huntressData.js`. **COMPLETED**

2. **Augur absorbs Oracle** -- Oracle removed from all registries, stores, components, race/path files, and CSS. Oracle lore card updated to Augur (Oracle/Seer). `oracleData.js`, `talentTrees/oracle.js`, and `oracle.css` deleted. Narrative/concept references preserved (NPC titles, subrace name, creature tags). **COMPLETED**

3. **Warden absorbs Titan** -- Titan removed from all registries, stores, components, race/path files, and CSS. Titan lore card updated to Warden (Monolith). `titanData.js`, `talentTrees/titan.js`, `titan/` subdirectory, `TitanResourceBar.jsx`, and `TitanResourceBar.css` deleted. Monolith specialization added to `wardenData.js` with Calcified Armor and Terminal Density passives. Emberth and Groven race compatibility updated. Narrative/concept references preserved (Inscribed Titan creature, Titanic bridges, TimelineDisplay lore). **COMPLETED**

4. **Martyr absorbs Dreadnaught** -- Dreadnaught removed from all registries, stores, components, race/path files, and CSS. Dreadnaught lore card updated to Martyr (Ironclad). `dreadnaughtData.js` and `talentTrees/dreadnaught.js` deleted. Ironclad specialization added to `martyrData.js` with Ironclad Vow passive (Devotion-scaled DR, heat aura, CC immunity, Lightning vuln, movement penalty). Race compatibility updated for mimir, groven, neth, human and 8 subraces. RulesData class count updated 30→28. Dead DRP CSS/JSX left in place. Narrative references preserved in Ironclad spec description. **COMPLETED**

5. **Harbinger** -- New file: CW + Doomsayer. Resource: Mayhem (unified pressure + prophecy currency). 3 specs: Wild Prophet, Death's Seer, Fate Rift. Deleted `chaosWeaverData.js`, `doomsayerData.js`, `talentTrees/chaosweaver.js`, `talentTrees/doomsayer.js`, CSS, DoomsayerResourceBar component. Updated all 31+ registry locations. **COMPLETED**

6. **Gambit** -- New file: Gambler + Fate Weaver. Dual resource: Fortune Points (nudge d20) + Karmic Debt (vulnerability + strain). 3 specs: Probability Savant, High Roller, Karmic Weaver. Deleted `gamblerData.js`, `fateWeaverData.js`, `talentTrees/gambler.js`, `talentTrees/fateweaver.js`, `gambler/` component dir, `fateWeaverThreadsRenderer.js`. Updated all 31+ registry locations. **COMPLETED**

7. **Animist** -- New file: Primalist + WD + Inscriptor. Triple merge. Resource: Ancestral Resonance (unified 0-20 from Totemic Synergy + Voodoo + Runic). Triple catastrophic flaw: Spirit Erosion. Deleted all 3 source data files, talent trees, and component dirs. Updated all 31+ registry locations. **COMPLETED**

8. **Shaper** -- New file: Bladedancer + Formbender. Resource: Kinetic Flux (0-20 unified from Momentum + Wild Instinct) + Body Toll (0-10 from Trauma/Humanity Erosion). 6 Shaping Forms. 3 specs: Flow Master, Iron Dancer, Primal Shadow. Deleted `bladedancerData.js`, `formbenderData.js`, both talent trees, renamed renderer. Updated all 31+ registry locations. **COMPLETED**

9. **Inquisitor** -- New file: Covenbane + Exorcist. Resource: Righteous Authority (0-8 unified from Hexbreaker Charges anti-magic friction + Divine Dominance demon command). Fatal flaws: cannot receive magic (1d10 psychic), 50% physical vulnerability, no mundane resource generation, demon rebellion at 0. 3 specs: Witch Hammer (Shadowbane + Demonologist), Iron Verdict (Spellbreaker + Demon Lord), Hollow Saint (Demonhunter + Possessed). Deleted `covenbaneData.js`, `exorcistData.js`, both talent trees. Updated all 31+ registry locations. Current class count: 22.

10. **Revenant** -- New file: Deathcaller + Lichborne. Resource: Death Toll (0-20 volatile, from HP sacrifice + kills, decays without action) + Death Shroud toggle (HP casting, +1d6 frost+necrotic, chill on hit) + Phylactery (kill-charged resurrection, Death Trigger freeze). 5 Death Marks (permanent bargains). 3 specs: Sanguine Harvest (life drain + spectral army), Frost Sovereign (freeze-shatter loop), Phylactery Anchor (enhanced phylactery + psychic). Deleted `deathcallerData.js`, `lichborneData.js`, both talent trees. Updated all 31+ registry locations. **COMPLETED**

### 1B.-1G. Follow-Up Tasks
- Update resource bars for all merges
- Merge talent tree data files
- Update spell wizard resources
- Write founding narratives for all 20 classes
- Update lore dictionary
- Update class index to 20

---

## PHASE 2: DAMAGE TYPE CONSOLIDATION [COMPLETED]

- Define 8-type schema (physical, ember, rime, storm, arcane, primal, blight, wyrd) + healing (separate)
- Create migration map (16 -> 8) with LEGACY_TYPE_MAP (22 entries)
- Update all systems referencing damage types

### 2.1: Primary damageTypes.js Rewritten [COMPLETED]
- `vtt-react/src/data/damageTypes.js`: 8 types + LEGACY_TYPE_MAP (22 entries mapping all old types to new)
- Healing stays as separate restorative category

### 2.2: Secondary damageTypes.js Synced [COMPLETED]
- `vtt-react/src/components/spellcrafting-wizard/core/data/damageTypes.js`: Same 8 types, added WEAPON_PROPERTIES export

### 2.3: Hardcoded 15-type Arrays Updated [COMPLETED]
- characterStore.js: 5x damageTypes array + spellDamageTypes + 4x resistanceMap + 2x immunityMap + 2x vulnerabilityLegacyMap
- UnifiedSpellCard.jsx: validDamageTypes + normalization + name detection + formula parsing + spell text parsing + effect parsing
- BasicAbilityCreator.jsx, utilityTypes.js, ProphecySummary.jsx
- QuickItemWizard.jsx (3 arrays), NewQuickItemWizard.jsx (2 arrays), EnhancedQuickItemWizard.jsx (2 arrays)
- CharacterStats.jsx, spellLibraryGenerator.js, healingTypes.js, arcanistPath.js, characterUtils.js

### 2.4: Class Data Files Updated [COMPLETED]
- All 20 class data files: class-level damageTypes arrays, 434+ spell-level damageTypes refs migrated via regex
- Duplicate entries fixed (apexData, berserkerData, plaguebringerData, toxicologistData, falseProphetData)

### 2.5: ClassesDisplay.jsx Updated [COMPLETED]
- DAMAGE_COLORS map: 15 old types -> 9 new types
- All 20 class damageTypes arrays migrated

### 2.6: Equipment Data Updated [COMPLETED]
- classEquipment.js: ~37 damageType refs + 2 resistance keys + 2 spellDamage keys
- backgroundEquipment.js, pathEquipment.js, raceEquipment.js: damageType values
- items/weapons/index.js: ~80+ damageType values + ~20 resistance keys
- items/armor/index.js: damageType values + resistance keys
- items/accessories/index.js: damageType values + resistance keys
- items/consumables/index.js: resistance keys
- startingEquipmentData.js, lootItemsData.js: damageType values

### 2.7: Race Data Updated [COMPLETED]
- groven.js: damageType + damageTypes references

### 2.8: Path Data Updated [COMPLETED]
- arcanistPath, harrowPath, hexerPath, mercenaryPath, mysticPath, reaverPath, tricksterPath, enhancedPathData
- damageTypes arrays + dotDamageType values migrated

### 2.9: Spellcrafting Wizard Components Updated [COMPLETED]
- spellNormalizer.js, BuffEffects.jsx, enhancedEffectSystemData.js: damageTypes arrays
- healingTypes.js: explosionDamageType
- spellCardTransformer.js: damageType values (capital Force)
- arcanoneerSphereRenderer.js: ELEMENT_DEFS keys migrated

### 2.10: Item Wizard Updated [COMPLETED]
- EnhancedQuickItemWizard.jsx: weapon template damageType values + DAMAGE_TYPES options map

### 2.11: Creature Wizard Updated [COMPLETED]
- Step4LootTable.jsx: damageType value

### 2.12: UI Components Updated [COMPLETED]
- CharacterStats.jsx: DAMAGE_TYPES config map (15 old -> 9 new entries)
- ClassResourceBar.jsx, PartyHUD.jsx, TargetHUD.jsx: no structural damage type refs found (already migrated in 2.3/2.4)
- ClassDetailDisplay.jsx, RaceSelector.jsx: no structural damage type refs found

### 2.13: Utils/Constants Updated [COMPLETED]
- weaponIntegration.js: damageType value
- Effect processing services, item constants, alchemy tables, levelEditorStore: no structural damage type refs found

### 2.14: Remaining Data Updated [COMPLETED]
- spellTemplates.js, testSpells.js: damageTypes arrays
- statusEffects.js: damageType values
- universalCombatSpells.js: damageType values
- creatureData.js, creatureLibraryData.js, summonableTokens.js, backgroundAbilities.js, biomeData.js, rollableTables.js, classResources.js: no structural damage type refs found
- rulesData.js: narrative references preserved (not changed)

### 2.15: Icon Folder Structure [NOTE]
- Icon paths in code still reference old folder names (e.g., `Fire/Volcanic Corruption`) which function correctly since files exist
- Creating Ember, Rime, Storm, Primal, Blight, Wyrd folders is optional; old paths work via LEGACY_TYPE_MAP at runtime

### 2.16: Legacy Map Verification [COMPLETED]
- LEGACY_TYPE_MAP (22 entries) covers all 16 old damage types
- All normalization functions confirmed pointing to LEGACY_TYPE_MAP

### 2.17: Master Plan Updated [COMPLETED]

---

## PHASE 3: RACE TRAIT CAP [COMPLETED]

- Audit current trait counts per race (12 races)
- Cap at 5 traits per race
- Implement "cannot lie" replacements

### 3.1: Audit Complete [COMPLETED]
- 9 races already at 5 traits: astril, briaran, corvani, emberth, fexrick, human, mimir, neth
- 3 races under target: groven (3), myrathil (4), vreken (4)
- morthel.js was renamed to neth.js in PASS 1; all morthel references updated to neth in PASS 2

### 3.2: Renamed morthel.js → neth.js [COMPLETED]
- morthel.js was renamed to neth.js in PASS 1
- All morthel references in Step1CoreDraft, Step9Summary, startingCurrency, CharacterManager, raceEquipment, summonableTokens, LanguagesDisplay updated to neth in PASS 2

### 3.3: Trait Additions [COMPLETED]

**Groven (+2 shared):**
- Vat-Sleep: Monthly ancestral dream. Advantage on History checks (Groven/Thrumm lore); disoriented on waking (-2 Perception, 10 min)
- Still-Claiming: Reaction at 0 HP — petrify for 1 round instead of falling Unconscious. Half Cover to adjacent allies. Immune to damage. 1/long rest.

**Myrathil (+1 per subrace):**
- Breakers-Born: Spindrift Diplomacy — Advantage on Persuasion during mediation; 1 psychic on failed mediation
- Deep-Born: Sea Mother's Hum — 1-minute trance to sense creatures in same body of water (100ft); DC 10 Spirit save for long rest without salt water
- River-Fed: Fresh-Water Memory — Advantage on History/Survival for freshwater geography; 1/long rest perfectly retrace a river route

**Vreken (+1 per subrace):**
- Clean: Veil-Speaker's Chant — 1/short rest, 1-min ancestral chant grants ally advantage on next save; announces location within 120ft
- Marked: Root-Veil Echo — 1/long rest touch surface to sense creatures present in last hour + emotional state + shadow of intent; 1 level Exhaustion cost

### 3.4: "Cannot Lie" Replacements Verified [COMPLETED]
- **Neth (neth.js)**: Bound Tongue (Velun) — cannot speak lies, 1d4 psychic on falsehood ✓
- **Briaran**: Thorn-Born (shared) — disadvantage on Deception, thorns physically betray lies ✓
- **Myrathil**: Tide-Tongue (Breakers-Born) — disadvantage on Deception, vein-colors shift with emotion ✓
- **Groven**: Toll-Keeper's Eye (Ithran) — scales grind audibly when lying, other Groven auto-detect ✓
- **Human (Skald)**: Bloodline Pride (Skald) — disadvantage on Deception, "A Skald does not lie" ✓

---

## PHASE 4: BACKGROUND REWRITE [COMPLETED]

- Replaced all 15 D&D SRD backgrounds with 15 Mythrill-native backgrounds
- All backgrounds applicable to ANY class/subrace combo (not race-locked)
- Backgrounds draw from established Mythrill lore: Emberspire, Basalt Shyr, Frostwood Reach ledgers, noble houses' Dark Bargains, Synod-Hold archives, Bloodhammer Sump veterans, Neth contract law, Nordhalla oral-history traditions, Harath-Vault forges, fungal hush survivors, Cragjaw Peaks navigation, Iceheart Sea sailors, Bryngloom trade routes, Over-Shanty survival, and Sundered Monolith research
- Updated backgroundEquipment.js (14 equipment sections + combined export) to match new IDs
- Old D&D SRD entries preserved in comments for reference

### New Background Roster

| # | New ID | Name | Replaces |
|---|--------|------|----------|
| 1 | emberspirePilgrim | Emberspire Pilgrim | Acolyte |
| 2 | shyrRunner | Shyr Runner | Criminal |
| 3 | ledgerKeeper | Ledger Keeper | Folk Hero |
| 4 | bloodlineHeir | Bloodline Heir | Noble |
| 5 | synodAcademic | Synod Academic | Sage |
| 6 | sumpsVeteran | Sumps Veteran | Soldier |
| 7 | debtNegotiator | Debt Negotiator | Charlatan |
| 8 | frostChanter | Frost Chanter | Entertainer |
| 9 | forgeWright | Forge Wright | Guild Artisan |
| 10 | hushSurvivor | Hush Survivor | Hermit |
| 11 | peakTracker | Peak Tracker | Outlander |
| 12 | merrowSailor | Merrow Sailor | Sailor |
| 13 | gloomwayTrader | Gloomway Trader | Merchant |
| 14 | shantyRat | Shanty Rat | Urchin |
| 15 | monolithHunter | Monolith Hunter | Scholar |

---

## PHASE 5: LORE CONSISTENCY [COMPLETED]

### 5.1: Corvani Demoted to Nordhalla Subfolk [COMPLETED]
- Corvani removed as a standalone playable race (corvani.js deleted, raceData.js updated: 11→10 races)
- Reclassified as Nordhalla subfolk — glacier-dwelling raven-marked messengers bound to Corvid Fate-Spirits
- Region changed from frostwood-reach/cragjaw-peaks to nordhalla in loreDictionary.js
- All Cragjaw Peaks references removed from GM_WORLD_GUIDE.md and rulesData.js
- Corvid-Speech language preserved and rewritten with Nordhalla context in languages.js
- LanguagesDisplay.jsx updated (Auran speakers and Corvid-Speech speakers)
- Name generator kept for NPC generation (subfolk)
- Complete Race List table in rulesData.js updated (10 races)

### 5.2: Zhentarim Replaced with Unlit Veil [COMPLETED]
- D&D-derived "Zhentarim Network" faction replaced with Mythrill-native "Unlit Veil"
- The Unlit Veil is an Unlit Astril intelligence network leveraging their unique ability to lie
- factionStore.js: Full faction rewrite (zhentarim-network → unlit-veil)
- deepLocationData.js: All Synod Hold Zhentarim references migrated (8 locations)
- npcStore.js: "The Factotum" → "The First Liar" as faction leader
- TimelineDisplay.jsx: Two timeline events updated
- All 24 Zhentarim references fully purged

### 5.3: Solvarn Active Agenda — The Dawn Vigil [COMPLETED]
- Added the Dawn Vigil: a militant Solvarn faction seeking to reforge the Sundered Monoliths
- Added to GM_WORLD_GUIDE.md Sundale section and rulesData.js Sundale region lore
- Dawn Vigil sends expeditionary companies into all regions; clashes with Korr and Unwoven Emberth
- Sigil: rising sun pierced by obsidian

### 5.4: Iceheart Shard Surface Window [COMPLETED]
- Designed the Shard-Window: a permanent 3-mile-wide storm-vortex above the Treakous Rift
- Glass-flat water disc below, bioluminescent at night tracing rift contours
- Shard-Song: icebergs within 50 miles hum audibly, growing louder over the past decade
- Added to GM_WORLD_GUIDE.md and rulesData.js Iceheart Sea sections

### 5.5: Source of Truth Synced [COMPLETED]
- GM_WORLD_GUIDE.md and rulesData.js aligned for all Phase 5 changes
- loreDictionary.js region entries updated for Corvani (nordhalla)

### 5.6: Loose Ends [COMPLETED]
- **Myrathil "Deep Speech" renamed to "Sea-Call"** (myrathil.js line 732) — avoids D&D confusion
- **SocialEncounterGenerator.jsx "Goblin Stack" → "Fexric Scrap-Gang"** — Mythrill-native equivalent
- **Creature icon selectors**: D&D names (Halfling, Goblin, Orc) remain as icon folder names — icon folders not migrated; file paths functional. Migrate folders in a future phase if desired.
---

## PHASE 6: UI/UX IMPROVEMENTS [COMPLETED]

### 6.1: Library Window Consolidation [COMPLETED]
- Single "Library" tab (L shortcut, GM-only) in navigation bar
- Three sub-sections: Bestiary (Creatures), Armory (Items), Atlas (Maps)
- Grand Library hub page with themed cards, drill-down navigation
- `LibraryWindow.jsx` (325 lines) renders all three sections
- Dead code remaining: `CreatureWindowWrapper` in Navigation.jsx, `LibraryContent.jsx` (orphaned)

### 6.2: Target HUD Buff/Debuff Tooltips [COMPLETED]
- Full hover tooltip system in `TargetHUD.jsx`
- Shows: name, description, stat effect summary, remaining duration
- Color-coded (green buffs, red debuffs) with parchment WoW-style theme
- Right-click context menu for remove/edit

### 6.3: GM Mode Toggle [DEFERRED]
- Not needed. Toggle via right-click on party members in PartyHUD is sufficient.
- `GMPlayerToggle.jsx` component exists but unused (dead code).

### 6.4: Window Position Persistence [DEFERRED]
- Not needed. `windowStore.js` with localStorage exists for some windows; others use volatile state. User preference: not a priority.

---

## PHASE 7: INTERACTIVE WORLD MAP [COMPLETED]

- Design map component using existing landing page background [COMPLETED]
- Wire to zone/location data [COMPLETED]
- Add region soft-lock integration [COMPLETED]

---

## KEY ARCHITECTURAL NOTES

### File Locations
- Class data: `vtt-react/src/data/classes/` (30 files, 466-4719 lines each)
- Talent trees: `vtt-react/src/data/talentTrees/` (30 files)
- Race data: `vtt-react/src/data/races/` (11 active files, 5 traits each)
- Rules: `vtt-react/src/data/rulesData.js` (5,130 lines)
- Backgrounds: `vtt-react/src/data/backgroundData.js` (15 D&D SRD backgrounds)
- Lore: `vtt-react/src/data/loreDictionary.js`
- Equipment: `vtt-react/src/data/equipment/classEquipment.js`
- Damage: `vtt-react/src/data/damageTypes.js` (16 types)
- World guide: `D:\VTT\docs\GM_WORLD_GUIDE.md`

### All 31 Locations That Must Be Updated Per Class Merge

1. `data/classes/index.js` -- import + export map
2. `data/classSpellGenerator.js` -- import + CLASS_DATA_MAP
3. `components/rules/RulesPage.jsx` -- lazy loader + icon
4. `components/character-creation-wizard/steps/Step1CoreDraft.jsx` -- import + map + role arrays + subrace arrays + heritage checks
5. `components/rules/ClassesDisplay.jsx` -- card array
6. `components/rules/ClassDetailDisplay.jsx` -- region config + illustrations + icon
7. `components/rules/ClassOriginsDisplay.jsx` -- classNameMap + classIds
8. `components/modals/LevelUpChoiceModal.jsx` -- import + map
9. `components/account/CharacterManagement.jsx` -- abbreviation map
10. `components/auth/CharacterManager.jsx` -- emoji map + dropdown
11. `components/character-sheet/Equipment.jsx` -- dropdown
12. `components/character-sheet/Lore.jsx` -- class list array
13. `store/characterStore.js` -- 3x lazy requires
14. `store/classLoreStore.js` -- NAME_TO_ID
15. `store/timelineStore.js` -- classIds
16. `store/factionStore.js` -- classAffinities
17. `data/startingCurrencyData.js` -- gold amounts
18. `data/loreDictionary.js` -- class entry
19. `data/classSpellCategories.js` -- CLASS_SPECIALIZATIONS
20. `data/classResources.js` -- CLASS_RESOURCE_TYPES
21. `components/spellcrafting-wizard/core/data/resourceTypes.js` -- definitions + stat tables
22. `data/summonableTokens.js` -- tokens + CLASS_ID_MAP
23. `data/equipment/classEquipment.js` -- items + spread refs
24. `data/rulesData.js` -- listings + lore cards + tables
25. `data/talentTreeData.js` -- imports + backdrops + tree map
26. `components/hud/ClassResourceBar.jsx` -- state, renders, tooltips, is* checks
27. `components/spellcrafting-wizard/components/common/UnifiedSpellCard.jsx` -- resource comments
28. 8+ race files -- classCompatibility strings
29. 5+ path files -- classCompatibility strings
30. 3+ CSS files -- class-specific CSS classes
31. `components/rules/TimelineDisplay.jsx` -- event text

### Schema Inconsistencies to Normalize
- Not all class files have `id` fields
- Spell storage varies: `spells`, `spellPools`, `exampleSpells`
- Some have `typeConfig`, `resources`, `stats`, `characterCreation`, `equipment` -- others don't

---

## USER PREFERENCES
- Professional, immersive, analytical tone; no em-dashes
- No D&D-generic names; everything Mythrill-native
- Talent trees ON HOLD (visible but inactive)
- 3 specializations per class for variety
- Backgrounds: Mythrill-native, NOT region-locked
- Region soft-lock: recommended, not enforced; toggle to unlock
- Interactive world map desired (background map already exists)
- Keep 2 tabs open (rules + game), not an in-game overlay
- No new keyboard shortcuts
- Consolidated nav bar (Library = Creatures/Items/Maps; Quest + Campaign separate)
- Spell wizard spellcard MD formatting preserved during merges
