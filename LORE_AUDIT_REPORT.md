# LORE CONSISTENCY & CONTINUITY AUDIT

**Audit date:** 2026-09-30. **Decision state:** all findings await creator review. **Mode:** static, read-only audit of the working tree, including uncommitted and untracked lore. This report is the only repository file created by this audit.

## 1. Lore Sources Manifest

### Coverage and evidentiary rules

- Recursive discovery covered `.md`, `.txt`, `.json`, `.js`, `.jsx`, `.ts`, `.tsx`, `.yaml`, and `.yml`, including hidden and Git-ignored project material. The nonempty project-text discovery screen covered **1,769 files**. Two complementary content screens used setting names and lore/mechanics vocabulary; targeted reads then examined definitions, restrictions, consumers, and competing claims.
- The **Lore File Manifest** below individually indexes retained lore sources and rule-bearing consumers. A consumer is included where it grants, labels, selects, or displays lore even when it imports the prose. Historical sources and draft/art references are retained rather than silently treated as current canon.
- Exclusions from the authored-source census: `.git`, `node_modules`, generated `build`/`dist`/`coverage`, assistant telemetry under `.gemini`/`.vibemole`, and Playwright recordings under `.playwright-mcp`. These are repository metadata, dependencies, generated copies, or session captures rather than independent authored game sources. Images/models were not interpreted as textual canon. Backup extensions such as `.bak-*` are outside the requested text-extension census; the audit-work Markdown and JSON sources are indexed below.
- **Authority is itself contested.** `docs/CORE_LORE_FRAMEWORK.md:2–6` calls itself the single source of truth and requires database/UI alignment. Runtime data also make canonical claims. This audit records collisions without choosing a winner. A newer file, an untracked file, or a statement in durable project memory does not by itself settle a creator question.
- Exact quoted passages below are **literal excerpts**, not paraphrases. JSON escape sequences and source spelling are retained where material. Line numbers refer to this working-tree snapshot, not historical commits. A semantic contradiction, a naming drift, and a missing catalogue/selection path are different findings; absence is not presented as a second invented statement.
- Historical banners in `docs/LORE_*` explicitly mark older audits superseded. Their old claims are inventory evidence, not fresh collisions merely because current lore differs. Legacy internal IDs such as `velun_neth`, `kessen_neth`, `fexrick`, and `tethered_mimir` are not automatically display-name errors.
- Reference verification: `node vtt-react/src/data/_verify_lore.mjs` reported **436 lore entries**, **2,517 `relatedTerms` references**, **0 ID mismatches**, **0 missing relatedTerms arrays**, and **0 broken relatedTerms references**. This validates that reference graph only; it does not validate prose claims, embedded `LoreLink` labels, other registries, or creator intent.

### Lore File Manifest — prose, world references, and archival sources

| File path | Lore housed / audit role |
|---|---|
| `class-layout-document.md` | Class identities, variants, restrictions, equipment and resources |
| `class-lore-compendium.md` | Class origins, founders, orders and cultural variants |
| `ascension_spells_compendium.md` | Ascension abilities and resource terminology |
| `barbarian_spells_compendium.md` | Barbarian/Berserker ability and archetype prose |
| `CONTINENT_CARTOGRAPHY_SHEETS.md` | Cartographic geography and location labels |
| `SEVEN_CONTINENTS_MASTER_REFERENCE.md` | World bible, peoples, regional geography and creatures |
| `Nordhalla_Complete_Lore.md` | Northern history, places, peoples and factions |
| `WORLD_MAP_MAKER_BRIEF.md` | World geography and map-facing flavor |
| `LORE_STYLE_GUIDE.md` | Naming/time conventions, cosmology rules and worked lore examples |
| `LORE_AUDIT_SUMMARY.md` | Earlier lore findings and resolutions |
| `LIQUIDATE_OUR_LORE.md` | Lore audit/reconciliation brief and setting claims |
| `STRATEGIC_ROADMAP.md` | Planned classes and lore-facing system scope |
| `CLASS_AUDIT_PROMPT.md` | Class terminology and audit assumptions |
| `AUDIT_REPORT.md` | Earlier mechanics/source findings |
| `AUDIT_REPORT_DETAILED.md` | Earlier class/resource findings |
| `TODO_DATA_EXTRACTION.md` | Historical lore-data source map |
| `dice-ui-v3.yml` | Captured UI terminology; snapshot rather than independent canon |
| `docs/CORE_LORE_FRAMEWORK.md` | Canonical cosmology, pacts, ancestry, class heritage and economy |
| `docs/GM_WORLD_GUIDE.md` | GM-facing history, politics, geography, lore and adventure hooks |
| `docs/CREATURE_COMPENDIUM.md` | Bestiary identities and creature cosmology |
| `docs/CREATURE_ABILITIES.md` | Creature ability flavor and mechanics |
| `docs/CREATURE_ASSESSMENT.md` | Bestiary classification and coverage assessment |
| `docs/MYTHRILL_BESTIARY_LORE_PLAN.md` | Proposed bestiary layers and creature source rules |
| `docs/CLASS_DESIGN_CHARTER.md` | Class identity and mechanical design conventions |
| `docs/CLASS_AUDIT_STANDARDS.md` | Class/resource audit terminology |
| `docs/ABILITY_AUDIT.md` | Ability/resource consistency evidence |
| `docs/CONSOLIDATION_MASTER_PLAN.md` | Class mergers and retired identities |
| `docs/COA_IMPROVEMENT_SUMMARY.md` | Class-origin presentation assumptions |
| `docs/COA_SPEC_ANALYSIS.md` | Class specializations and origin presentation |
| `docs/COA_TRANSLATION_BRIEF.md` | Class-cultural affiliation and origin copy |
| `docs/FIX_PLAN_PREVIEW.md` | Earlier lore/mechanics correction proposals |
| `docs/LORE_AUDIT_FINDINGS.md` | Historical, explicitly superseded lore audit |
| `docs/LORE_CONSISTENCY_AUDIT_PROMPT.md` | Historical, explicitly superseded audit instructions |
| `docs/LORE_CONSISTENCY_AUDIT_v2.md` | Historical, explicitly superseded collisions |
| `docs/LORE_CONSISTENCY_AUDIT_v3.md` | Historical, explicitly superseded audit |
| `docs/LORE_CONSISTENCY_AUDIT_v3_FINDINGS.md` | Historical, explicitly superseded findings |
| `docs/LORE_CRITICAL_ASSESSMENT.md` | Historical, explicitly superseded critique |
| `docs/LORE_DEEPENING_PART1_AUDIT.md` | Historical, explicitly superseded cross-reference results |
| `docs/LORE_DEEPENING_AND_UI_PASS_PROMPT.md` | Historical lore/UI rewrite brief |
| `docs/LORE_FIX_MASTER.md` | Historical, explicitly superseded correction plan |
| `docs/LORE_LIQUIDATION_AUDIT.md` | Historical, explicitly superseded class/lore findings |
| `docs/LORE_QUALITY_AUDIT_PROMPT.md` | Historical quality and continuity conventions |
| `docs/PASS_3_AUDIT_PROMPT.md` | Earlier lore source/audit brief |
| `docs/RACE_LORE_REWORK.md` | Race origin and taxonomy rewrite brief |
| `docs/RACE_BUILDING_SESSION_PROMPT.md` | Ancestry authoring conventions and source assumptions |
| `docs/INDIVIDUAL_CLASS_AUDIT_PROMPT.md` | Class audit requirements and terminology |
| `docs/RESOURCE_BAR_IMPROVEMENT_PLAN.md` | Resource-system presentation and terminology |
| `docs/SPELL_DATA_REFERENCE.md` | Spell schools, resources and schemas |
| `docs/SPELL_AUDIT_REPORT_2026-06.md` | Historical spell/mechanic findings |
| `docs/SPELL_CLASS_AUDIT_AGENT_PROMPT.md` | Class-spell audit assumptions |
| `docs/SPELL_CARD_AUDIT_PROMPT.md` | Spell terminology and presentation assumptions |
| `docs/SPELL_WIZARD_AUDIT_REPORT.md` | Spell mechanics audit evidence |
| `docs/PHASE_7_INTERACTIVE_WORLD_MAP.md` | World-map entity/source coverage |
| `docs/ULTIMATE_WORLD_BUILDER_PLAN.md` | Proposed worldbuilding/entity scope |
| `docs/WHAT_TO_FIX_AND_HOW.md` | Prior lore/mechanical findings |
| `docs/MASTER_SUBRACE_LOCATIONS_AND_FIGURES.md` | Art master census, capitals, notable figures and ancestry names |
| `docs/subrace_capitals_and_shared_settlements.md` | Capitals, shared settlements, architecture and culture |
| `docs/subraces_culture_society_prompts.md` | Cultural/anatomical art specifications |
| `docs/subrace_lore_compendium/MASTER_SUBRACE_LOCATIONS_AND_FIGURES.md` | Second master index/census |
| `docs/subrace_lore_compendium/01_myrathil_locations_and_figures.md` | Myrathil spawning, anatomy, settlements and figures |
| `docs/subrace_lore_compendium/02_human_locations_and_figures.md` | Human cultures, capitals and figures |
| `docs/subrace_lore_compendium/03_astril_locations_and_figures.md` | Astril anatomy, capitals, astronomy and figures |
| `docs/subrace_lore_compendium/04_fexric_locations_and_figures.md` | Fexric technology, capitals, guilds and figures |
| `docs/subrace_lore_compendium/05_florae_locations_and_figures.md` | Florae anatomy, settlements, industry and figures |
| `docs/subrace_lore_compendium/06_groven_locations_and_figures.md` | Groven anatomy, cities and named figures |
| `docs/subrace_lore_compendium/07_mimir_locations_and_figures.md` | Mimir masks, cultures, capitals and figures |
| `docs/subrace_lore_compendium/08_nethien_locations_and_figures.md` | Nethien bloodlines, capitals, law and figures |
| `docs/subrace_lore_compendium/09_vreken_locations_and_figures.md` | Vreken strains, purification, capitals and figures |
| `docs/subrace_lore_compendium/10_solari_locations_and_figures.md` | Solari anatomy, heat physiology, capitals and figures |
| `docs/continents/bryngloom_forest/OVERARCHING_LORE.md` | Bryngloom regional lore |
| `docs/continents/bryngloom_forest/subregions/blightmire_hollows.md` | Subregion geography and lore |
| `docs/continents/bryngloom_forest/subregions/morrath_ruins.md` | Subregion history and lore |
| `docs/continents/bryngloom_forest/subregions/rotting_canopy.md` | Subregion geography and lore |
| `docs/continents/bryngloom_forest/subregions/shadowfen_bogs.md` | Subregion geography and lore |
| `docs/continents/bryngloom_forest/subregions/sunken_spires.md` | Subregion geography and lore |
| `docs/continents/bryngloom_forest/subregions/veilwood_thickets.md` | Subregion geography and lore |
| `docs/continents/cragjaw_peaks/OVERARCHING_LORE.md` | Cragjaw origins and regional law |
| `docs/continents/cragjaw_peaks/subregions/ironspire_canyons.md` | Subregion geography and lore |
| `docs/continents/cragjaw_peaks/subregions/stormbound_heights.md` | Subregion geography and lore |
| `docs/continents/cragjaw_peaks/subregions/wailing_gorges.md` | Subregion geography and lore |
| `docs/continents/frostwood_reach/OVERARCHING_LORE.md` | Frostwood history and peoples |
| `docs/continents/frostwood_reach/subregions/drowned_fens.md` | Subregion geography and lore |
| `docs/continents/frostwood_reach/subregions/frostfang_wastes.md` | Subregion geography and lore |
| `docs/continents/frostwood_reach/subregions/ironheart_vales.md` | Subregion geography and lore |
| `docs/continents/iceheart_sea/OVERARCHING_LORE.md` | Maritime region, pacts and peoples |
| `docs/continents/iceheart_sea/subregions/abyssal_trench.md` | Deep-sea subregion lore |
| `docs/continents/iceheart_sea/subregions/frozen_straits.md` | Maritime geography and lore |
| `docs/continents/iceheart_sea/subregions/glacier_bay.md` | Maritime geography and lore |
| `docs/continents/iceheart_sea/subregions/mistral_reach.md` | Maritime geography and lore |
| `docs/continents/iceheart_sea/subregions/shattered_floes.md` | Maritime geography and lore |
| `docs/continents/iceheart_sea/subregions/tidefall_archipelago.md` | Maritime geography and lore |
| `docs/continents/nordhalla/OVERARCHING_LORE.md` | Northern history, economy, launch peoples and law |
| `docs/continents/nordhalla/subregions/frostfang_wastes.md` | Northern subregion lore |
| `docs/continents/nordhalla/subregions/rime_spire_peaks.md` | Northern subregion lore |
| `docs/continents/nordhalla/subregions/skaldfjord_dal.md` | Northern settlements and lore |
| `docs/continents/sundale/OVERARCHING_LORE.md` | Solari region, pacts and volcano history |
| `docs/continents/sundale/subregions/ashfall_basin.md` | Volcanic subregion lore |
| `docs/continents/sundale/subregions/emberspire_crater.md` | Volcanic subregion lore |
| `docs/continents/sundale/subregions/obsidian_reaches.md` | Volcanic subregion lore |
| `docs/continents/sundale/subregions/sunscar_wastes.md` | Volcanic subregion lore |
| `docs/continents/sundrift_vale/OVERARCHING_LORE.md` | Astril/Ordan region and history |
| `docs/continents/sundrift_vale/subregions/astril_enclaves.md` | Astril settlements and lore |
| `docs/continents/sundrift_vale/subregions/ordan_ruins.md` | Ordan history and ruins |
| `docs/continents/sundrift_vale/subregions/silver_basins.md` | Steppe subregion lore |
| `docs/continents/sundrift_vale/subregions/starlight_steppes.md` | Steppe subregion lore |
| `docs/continents/sundrift_vale/subregions/whispering_savanna.md` | Steppe subregion lore |
| `docs/class-audits/README.md` | Class audit source map |
| `docs/class-audits/animist.md` | Class identity/resource audit |
| `docs/class-audits/apex.md` | Class identity/resource audit |
| `docs/class-audits/arcanoneer.md` | Class identity/resource audit |
| `docs/class-audits/augur.md` | Class identity/resource audit |
| `docs/class-audits/berserker.md` | Class identity/resource audit |
| `docs/class-audits/chronarch.md` | Class identity/resource audit |
| `docs/class-audits/crusader.md` | Class identity/resource audit |
| `docs/class-audits/false_prophet.md` | Class identity/resource audit |
| `docs/class-audits/gambit.md` | Class identity/resource audit |
| `docs/class-audits/harbinger.md` | Class identity/resource audit |
| `docs/class-audits/inquisitor.md` | Class identity/resource audit |
| `docs/class-audits/lunarch.md` | Class identity/resource audit |
| `docs/class-audits/martyr.md` | Class identity/resource audit |
| `docs/class-audits/minstrel.md` | Class identity/resource audit |
| `docs/class-audits/plaguebringer.md` | Class identity/resource audit |
| `docs/class-audits/pyrofiend.md` | Class identity/resource audit |
| `docs/class-audits/revenant.md` | Class identity/resource audit |
| `docs/class-audits/shaper.md` | Class identity/resource audit |
| `docs/class-audits/spellguard.md` | Class identity/resource audit |
| `docs/class-audits/toxicologist.md` | Class identity/resource audit |
| `docs/class-audits/warden.md` | Class identity/resource audit |
| `docs/class-audits/overlap-matrix.md` | Class/archetype overlap |
| `docs/class-audits/phase2-workboard.md` | Class identity decisions/progress |
| `docs/class-audits/spell-card-qa-report.md` | Spell and resource QA |
| `docs/class-audits/spell-variety-report.md` | Class spell identity/coverage |
| `.lore-audit-work/0_MASTER_LORE_MAP_AND_AUDIT.md` | Archival master lore/source map |
| `.lore-audit-work/0B_MASTER_PASS2_ADDENDUM.md` | Archival audit addendum |
| `.lore-audit-work/0C_MASTER_AUDIT_2026-08-17.md` | Archival master audit |
| `.lore-audit-work/1_COSMOLOGY.md` | Archival cosmology decisions |
| `.lore-audit-work/2_HOUSES_REGIONS_GEOGRAPHY.md` | Archival houses/geography |
| `.lore-audit-work/3_RACES.md` | Archival ancestry claims |
| `.lore-audit-work/4_CLASSES.md` | Archival class claims |
| `.lore-audit-work/5_NPCS.md` | Archival figure claims |
| `.lore-audit-work/6_HISTORY_FACTIONS_TIMELINE.md` | Archival chronology/factions |
| `.lore-audit-work/7_CREATURES_ABILITIES.md` | Archival creature claims |
| `.lore-audit-work/8_ITEMS_EQUIPMENT.md` | Archival item claims |
| `.lore-audit-work/9_SPELLS_SPELLCRAFTING.md` | Archival magic/mechanics |
| `.lore-audit-work/10_TALENT_TREES_PATHS.md` | Archival specialization/path claims |
| `.lore-audit-work/11_BACKGROUNDS_MISC.md` | Archival background/language claims |
| `.lore-audit-work/12_LORE_INFRASTRUCTURE.md` | Archival source/authority map |
| `.lore-audit-work/CANON_REFERENCE.md` | Earlier canon reference |
| `.lore-audit-work/CANON_REFERENCE_v5.md` | Earlier ratified reconciliation layer; superseded cosmology present |
| `.lore-audit-work/COMPREHENSIVE_LORE_AUDIT_PROMPT_v2.md` | Archival audit scope/conventions |
| `.lore-audit-work/CONTINUE_PROMPT.md` | Archival continuity brief |
| `.lore-audit-work/DECISIONS.md` | Archival creator decisions |
| `.lore-audit-work/RESOLUTIONS.md` | Archival resolutions |
| `.lore-audit-work/dimension2_audit.md` | Archival cross-reference findings |
| `.lore-audit-work/dimension3_audit.md` | Archival race findings |
| `.lore-audit-work/dimension4_audit.md` | Archival faction/history findings |
| `.lore-audit-work/dimension5_audit.md` | Archival language/world findings |
| `.lore-audit-work/dimension6_audit.md` | Archival mechanic findings |
| `.lore-audit-work/florae-schism-drafts.md` | Draft Florae schism prose |
| `.lore-audit-work/prose-enrichment-drafts.md` | Draft lore entries |
| `.lore-audit-work/prose-enrichment-round2-drafts.md` | Draft lore entries |
| `.lore-audit-work/seelie-accord-directions.md` | Archival fae pact directions |
| `.lore-audit-work/seelie-accord-implementation.md` | Archival fae pact implementation |
| `.lore-audit-work/generated_entries.json` | Generated draft lore entries |
| `.lore-audit-work/new_creature_entries.json` | Generated draft creature entries |
| `.lore-audit-work/new_entries_obj.json` | Generated draft lore entries |
| `.lore-audit-work/lore-classes-extract.txt` | Historical extracted class prose |
| `.lore-audit-work/v5_migration_sites.txt` | Historical lore replacement sites |
| `.lore-audit-work/apply-canon-locks.js` | Archived replacement strings; not executed |
| `.lore-audit-work/generate-micro-pois.js` | Generated location flavor/templates; not executed |
| `scripts/apply_all.js` | Historical lore replacement strings; not executed |
| `scripts/finish_up.js` | Historical lore replacement strings; not executed |
| `scripts/post.js` | Historical world/timeline/bestiary replacement prose; not executed |
| `scripts/validateLoreConsistency.js` | Lore validator's historical founding/era assumptions; not used as canon |
| `scripts/validation_output.txt` | Historical chronology/entity validation claims |
| `scripts/qa-after-fix1.txt` | Historical class/lore validation output |
| `scripts/qa-after-fix2.txt` | Historical class/lore validation output |
| `scripts/qa-after-fix3.txt` | Historical class/lore validation output |
| `vtt-react/scratch/updateClassLore.js` | Historical class prose/update script; not executed |
| `vtt-react/scratch/syncClassOrigins.js` | Historical class/region mappings; not executed |
| `vtt-react/_debug_out.jsx` | Archived resource UI copy/consumer, not runtime canon |

### Lore File Manifest — runtime data, mechanics and language/naming tables

| File path | Lore housed / audit role |
|---|---|
| `vtt-react/public/data/lore.json` | Laws & Lore lexicon, cosmology, histories, classes, languages and entities |
| `vtt-react/public/data/rules.json` | Rulebook/primer, world history, peoples, laws and mechanic copy |
| `vtt-react/public/data/creatures.json` | Bestiary prose, creature origins and mechanics |
| `vtt-react/public/data/abilities.json` | Creature ability text |
| `vtt-react/src/data/creatureData.json` | Creature-library records and flavor |
| `vtt-react/src/data/rulesData.js` | Runtime rulebook loader/consumer |
| `vtt-react/src/data/raceData.js` | Race/subrace aggregation and inherited trait/language rules |
| `vtt-react/src/data/raceMechanics.js` | Echo-Submersion and Unraveling escalation lore |
| `vtt-react/src/data/races/index.js` | Ancestry registry |
| `vtt-react/src/data/races/astril.js` | Astril origin, anatomy, languages and traits |
| `vtt-react/src/data/races/fexrick.js` | Fexric origins, guilds, anatomy and traits |
| `vtt-react/src/data/races/florae.js` | Florae ancestry, settlements, cultures and traits |
| `vtt-react/src/data/races/groven.js` | Groven origins, figures, social castes and traits |
| `vtt-react/src/data/races/human.js` | Human regional cultures, houses, history and traits |
| `vtt-react/src/data/races/mimir.js` | Mimir masks, castes, figures and traits |
| `vtt-react/src/data/races/myrathil.js` | Myrathil spawning, culture, figures and traits |
| `vtt-react/src/data/races/neth.js` | Nethien bloodlines, law, origins, preservation and traits |
| `vtt-react/src/data/races/solari.js` | Solari origin, physiology, faith and traits |
| `vtt-react/src/data/races/vreken.js` | Vreken origins, fungal strains, figures and traits |
| `vtt-react/src/data/backgroundData.js` | Background origins, restrictions, affiliations and bonuses |
| `vtt-react/src/data/backgroundAbilities.js` | Background ability flavor and rules |
| `vtt-react/src/data/backgroundAssets.js` | Background-associated identity/art labels |
| `vtt-react/src/data/languages.js` | Player language catalogue, dialects, speech samples and cultural definitions |
| `vtt-react/src/data/seedLanguages.js` | World-builder canon tongues, scripts, lexicons and cult practices |
| `vtt-react/src/data/legacyDisciplineData.js` | Legacy discipline and background rules |
| `vtt-react/src/data/pathData.js` | Paths, flavor and former character-creation benefits |
| `vtt-react/src/data/startingCurrencyData.js` | Background/path currency and regional coin flavor |
| `vtt-react/src/data/startingEquipmentData.js` | Creation equipment grants and flavor |
| `vtt-react/src/data/equipment/backgroundEquipment.js` | Background equipment and regional flavor |
| `vtt-react/src/data/equipment/classEquipment.js` | Class equipment/proficiency identity |
| `vtt-react/src/data/equipment/raceEquipment.js` | Ancestral gear, house labels and cultural flavor |
| `vtt-react/src/data/biomeData.js` | Biome ecology and environmental flavor |
| `vtt-react/src/data/deepLocationData.js` | Named locations, sanctums, class sites and local lore |
| `vtt-react/src/data/locationCoordinates.js` | Location identity/geography |
| `vtt-react/src/data/regionPolygons.js` | Regional geographic registry |
| `vtt-react/src/data/subregions.js` | Subregion descriptions and cultural geography |
| `vtt-react/src/data/subregionMaps.js` | Regional map descriptions and lore labels |
| `vtt-react/src/data/zoneData.js` | Zones, settlements, rulers, encounters and history |
| `vtt-react/src/data/explorationRules.js` | Regional navigation/travel laws and environment flavor |
| `vtt-react/src/data/rollableTables.js` | Encounter and worldbuilding tables |
| `vtt-react/src/data/lootItemsData.js` | Loot descriptions and regional flavor |
| `vtt-react/src/data/damageTypes.js` | Damage schools/types and elemental definitions |
| `vtt-react/src/data/auraTypes.js` | Aura identity and mechanical definitions |
| `vtt-react/src/data/conditionsData.js` | Conditions and supernatural effect definitions |
| `vtt-react/src/data/statusEffects.js` | Status rules and effect terminology |
| `vtt-react/src/data/triggerTypes.js` | Magic trigger definitions |
| `vtt-react/src/data/summonableTokens.js` | Summoned creature identities and descriptions |
| `vtt-react/src/data/creatureAbilityBuilders.js` | Creature power descriptions/templates |
| `vtt-react/src/data/classResources.js` | Class resource definitions, lore names, specializations and thresholds |
| `vtt-react/src/data/classResourceAliases.js` | Resource naming compatibility |
| `vtt-react/src/data/classSpellCategories.js` | Class-spell taxonomy |
| `vtt-react/src/data/classSpellGenerator.js` | Generated class ability prose/identity |
| `vtt-react/src/data/classSpellTemplates.js` | Class spell templates and descriptions |
| `vtt-react/src/data/customSpellLibraryData.js` | Custom spell descriptions |
| `vtt-react/src/data/generalSpellsData.js` | General magic descriptions |
| `vtt-react/src/data/skillAbilitiesData.js` | Skill abilities and supernatural restrictions |
| `vtt-react/src/data/skillBasedActionsData.js` | Skill-based mechanic copy |
| `vtt-react/src/data/spellLibraryData.js` | Spell catalogue and schools |
| `vtt-react/src/data/spellTemplates.js` | Magic templates and flavor |
| `vtt-react/src/data/spells/utilitySpells.js` | Utility magic names and rules |
| `vtt-react/src/data/universalCombatSpells.js` | Universal combat ability descriptions |
| `vtt-react/src/data/weaponActionSpells.js` | Weapon disciplines/actions |
| `vtt-react/src/data/testSpells.js` | Sample/test spell copy, not independent canon |
| `vtt-react/src/data/windowIntros.js` | Lamplighter guide identity and UI introductory flavor |
| `vtt-react/src/data/THEMATIC_AUDIT.md` | Historical class identity/thematic review |
| `vtt-react/src/data/classes/index.js` | Playable class registry and Deepling-specific variants |
| `vtt-react/src/data/classes/classDisplayData.js` | Class display/roleplay copy |
| `vtt-react/src/data/classes/classFlavorProfiles.js` | Class-specific art/flavor profiles |
| `vtt-react/src/data/classes/animistData.js` | Animist origins, cultural variants, resource and powers |
| `vtt-react/src/data/classes/apexData.js` | Apex origins, cultural variants, resource and powers |
| `vtt-react/src/data/classes/arcanoneerData.js` | Arcanoneer origins, traditions, schools and resource |
| `vtt-react/src/data/classes/augurData.js` | Augur origins, divination, variants and resource |
| `vtt-react/src/data/classes/berserkerData.js` | Berserker Hunger Pact, cultural variants and Rage |
| `vtt-react/src/data/classes/chronarchData.js` | Chronarch origins, temporal laws and resource |
| `vtt-react/src/data/classes/crusaderData.js` | Crusader Sol-bound origins, Fervor and restrictions |
| `vtt-react/src/data/classes/falseProphetData.js` | False Prophet origins, Silence and Madness |
| `vtt-react/src/data/classes/gambitData.js` | Gambit, the House, Fortune and Karmic Debt |
| `vtt-react/src/data/classes/harbingerData.js` | Harbinger doom-arithmetic, entropy and Mayhem |
| `vtt-react/src/data/classes/inquisitorData.js` | Inquisitor orders, Barbed Vow and Authority |
| `vtt-react/src/data/classes/lunarchData.js` | Lunarch lunar parasites, cultures and phases |
| `vtt-react/src/data/classes/martyrData.js` | Martyr Witness theology, variants and Devotion |
| `vtt-react/src/data/classes/minstrelData.js` | Minstrel stolen voice, traditions, Notes and Cadences |
| `vtt-react/src/data/classes/plaguebringerData.js` | Plaguebringer origins, rot and Virulence |
| `vtt-react/src/data/classes/pyrofiendData.js` | Pyrofiend origins, Scathrach and Inferno Veil |
| `vtt-react/src/data/classes/revenantData.js` | Revenant origins, obligation, undeath and resource |
| `vtt-react/src/data/classes/shaperData.js` | Shaper form changes, origins and body costs |
| `vtt-react/src/data/classes/spellguardData.js` | Spellguard origins, absorption and restrictions |
| `vtt-react/src/data/classes/toxicologistData.js` | Toxicologist traditions, reagent culture and resource |
| `vtt-react/src/data/classes/wardenData.js` | Warden chain-graft origins, cultures and Tether-Tension |
| `vtt-react/src/data/resourceSystems/animistResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/apexResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/arcanoneerResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/augurResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/berserkerResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/chronarchResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/crusaderResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/falseProphetResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/gambitResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/harbingerResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/inquisitorResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/lunarchResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/martyrResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/minstrelResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/plaguebringerResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/pyrofiendResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/revenantResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/shaperResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/spellguardResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/toxicologistResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/resourceSystems/wardenResourceGuide.js` | Player resource explanation/examples |
| `vtt-react/src/data/items/itemLoreData.js` | Item lore registry, histories and cultural ties |
| `vtt-react/src/data/items/enrichItemsWithLore.js` | Item lore attachment/consumer |
| `vtt-react/src/data/items/weapons/index.js` | Weapon flavor, origins and regional manufacture |
| `vtt-react/src/data/items/weapons/factionWeapons.js` | Faction equipment and lore |
| `vtt-react/src/data/items/weapons/enrichedWeapons.js` | Lore-enriched weapon consumer |
| `vtt-react/src/data/items/armor/index.js` | Armor descriptions |
| `vtt-react/src/data/items/armor/enrichedArmor.js` | Lore-enriched armor consumer |
| `vtt-react/src/data/items/accessories/index.js` | Accessory descriptions |
| `vtt-react/src/data/items/accessories/enrichedAccessories.js` | Lore-enriched accessory consumer |
| `vtt-react/src/data/items/consumables/index.js` | Consumable descriptions |
| `vtt-react/src/data/items/consumables/enrichedConsumables.js` | Lore-enriched consumable consumer |
| `vtt-react/src/data/items/containers/index.js` | Container descriptions |
| `vtt-react/src/data/items/curios/absurdist-arms.js` | Curio flavor and supernatural effects |
| `vtt-react/src/data/items/curios/chance-curios.js` | Luck-related item flavor |
| `vtt-react/src/data/items/curios/cosmic-knickknacks.js` | Cosmic item flavor |
| `vtt-react/src/data/items/curios/deck-oddities.js` | Card/deck item flavor |
| `vtt-react/src/data/items/curios/living-anomalies.js` | Living item/anomaly flavor |
| `vtt-react/src/data/items/curios/vessels-containment.js` | Containment item flavor |
| `vtt-react/src/data/items/curios/wardrobe.js` | Clothing curio flavor |
| `vtt-react/src/data/items/currency/index.js` | Currency descriptions and naming |
| `vtt-react/src/data/items/miscellaneous/alchemy-supplies.js` | Alchemical material flavor |
| `vtt-react/src/data/items/miscellaneous/cooking-supplies.js` | Food/material flavor |
| `vtt-react/src/data/items/miscellaneous/crafting-components.js` | Craft component flavor |
| `vtt-react/src/data/items/miscellaneous/enchanting-materials.js` | Enchantment material flavor |
| `vtt-react/src/data/items/miscellaneous/gathering.js` | Gathered material flavor |
| `vtt-react/src/data/items/miscellaneous/keys.js` | Keys and associated item flavor |
| `vtt-react/src/data/items/miscellaneous/mining.js` | Mineral/material flavor |
| `vtt-react/src/data/items/miscellaneous/quest-items.js` | Quest relic flavor |
| `vtt-react/src/data/items/miscellaneous/skins.js` | Skin/material flavor |
| `vtt-react/src/data/items/miscellaneous/textiles.js` | Textile/material flavor |
| `vtt-react/src/data/items/miscellaneous/tools.js` | Tool flavor |
| `vtt-react/src/data/items/miscellaneous/trade-goods.js` | Economic/trade flavor |
| `vtt-react/src/data/items/miscellaneous/trash-loot.js` | Salvage/loot flavor |
| `vtt-react/src/data/items/recipes.js` | Recipe definitions and craft flavor |
| `vtt-react/src/data/recipes/alchemy.js` | Alchemical recipes and descriptions |
| `vtt-react/src/data/recipes/blacksmithing.js` | Smithing recipes and descriptions |
| `vtt-react/src/data/recipes/cooking.js` | Food recipes and descriptions |
| `vtt-react/src/data/recipes/enchanting.js` | Magic craft recipes and descriptions |
| `vtt-react/src/data/recipes/engineering.js` | Engineering recipes and descriptions |
| `vtt-react/src/data/recipes/jewelcrafting.js` | Jewelcraft recipes and descriptions |
| `vtt-react/src/data/recipes/leatherworking.js` | Leathercraft recipes and descriptions |
| `vtt-react/src/data/recipes/masonry.js` | Stonecraft recipes and descriptions |
| `vtt-react/src/data/recipes/tailoring.js` | Textile recipes and descriptions |
| `vtt-react/src/data/talentTreeData.js` | Talent specialization catalogue |
| `vtt-react/src/data/talentTrees/animist.js` | Talent identities and ability descriptions |
| `vtt-react/src/data/talentTrees/apex.js` | Talent identities and ability descriptions |
| `vtt-react/src/data/talentTrees/arcanoneer.js` | Talent identities and ability descriptions |
| `vtt-react/src/data/talentTrees/arcanoneerEntropyWeaver.js` | Entropy Weaver talents |
| `vtt-react/src/data/talentTrees/arcanoneerPrismMage.js` | Prism Mage talents |
| `vtt-react/src/data/talentTrees/arcanoneerSphereArchitect.js` | Sphere Architect talents |
| `vtt-react/src/data/talentTrees/augur.js` | Augur talents |
| `vtt-react/src/data/talentTrees/augurAuspice.js` | Augur specialization talents |
| `vtt-react/src/data/talentTrees/augurHarbinger.js` | Augur specialization talents |
| `vtt-react/src/data/talentTrees/augurHierophant.js` | Augur specialization talents |
| `vtt-react/src/data/talentTrees/berserker.js` | Berserker talents |
| `vtt-react/src/data/talentTrees/berserkerJuggernaut.js` | Juggernaut talents |
| `vtt-react/src/data/talentTrees/berserkerSavage.js` | Savage talents |
| `vtt-react/src/data/talentTrees/berserkerWarlord.js` | Warlord talents |
| `vtt-react/src/data/talentTrees/chronarch.js` | Chronarch talents |
| `vtt-react/src/data/talentTrees/crusader.js` | Crusader talents |
| `vtt-react/src/data/talentTrees/crusaderDawnBastion.js` | Dawn Bastion talents |
| `vtt-react/src/data/talentTrees/crusaderHarmonicInquisitor.js` | Harmonic Inquisitor talents |
| `vtt-react/src/data/talentTrees/crusaderSolarJusticiar.js` | Solar Justiciar talents |
| `vtt-react/src/data/talentTrees/falseprophet.js` | False Prophet talents |
| `vtt-react/src/data/talentTrees/falseprophetCultist.js` | Cultist talents |
| `vtt-react/src/data/talentTrees/falseprophetDeceiver.js` | Deceiver talents |
| `vtt-react/src/data/talentTrees/falseprophetSilenceSpeaker.js` | Silence Speaker talents |
| `vtt-react/src/data/talentTrees/gambit.js` | Gambit talents |
| `vtt-react/src/data/talentTrees/harbinger.js` | Harbinger talents |
| `vtt-react/src/data/talentTrees/inquisitor.js` | Inquisitor talents |
| `vtt-react/src/data/talentTrees/inquisitorHollowSaint.js` | Hollow Saint talents |
| `vtt-react/src/data/talentTrees/inquisitorIronVerdict.js` | Iron Verdict talents |
| `vtt-react/src/data/talentTrees/inquisitorWitchHammer.js` | Witch Hammer talents |
| `vtt-react/src/data/talentTrees/lunarch.js` | Lunarch talents |
| `vtt-react/src/data/talentTrees/lunarchHollowSentinel.js` | Hollow Sentinel talents |
| `vtt-react/src/data/talentTrees/lunarchSanguineWarden.js` | Sanguine Warden talents |
| `vtt-react/src/data/talentTrees/lunarchSilenceSpeaker.js` | Silence Speaker talents |
| `vtt-react/src/data/talentTrees/martyr.js` | Martyr talents |
| `vtt-react/src/data/talentTrees/martyrAscetic.js` | Ascetic talents |
| `vtt-react/src/data/talentTrees/martyrIronclad.js` | Ironclad talents |
| `vtt-react/src/data/talentTrees/martyrRedemption.js` | Redemption talents |
| `vtt-react/src/data/talentTrees/martyrZealot.js` | Zealot talents |
| `vtt-react/src/data/talentTrees/minstrel.js` | Minstrel talents |
| `vtt-react/src/data/talentTrees/minstrelChordCombinations.js` | Cadence/chord combination lore |
| `vtt-react/src/data/talentTrees/minstrelHarmonicWeaving.js` | Harmonic Weaving talents |
| `vtt-react/src/data/talentTrees/minstrelMusicalMagic.js` | Musical Magic talents |
| `vtt-react/src/data/talentTrees/plaguebringer.js` | Plaguebringer talents |
| `vtt-react/src/data/talentTrees/plaguebringerDecayHarbinger.js` | Decay Harbinger talents |
| `vtt-react/src/data/talentTrees/plaguebringerTormentWeaver.js` | Torment Weaver talents |
| `vtt-react/src/data/talentTrees/plaguebringerVirulentSpreader.js` | Virulent Spreader talents |
| `vtt-react/src/data/talentTrees/pyrofiend.js` | Pyrofiend talents |
| `vtt-react/src/data/talentTrees/pyrofiendHellfire.js` | Hellfire talents |
| `vtt-react/src/data/talentTrees/pyrofiendInferno.js` | Inferno talents |
| `vtt-react/src/data/talentTrees/pyrofiendWildfire.js` | Wildfire talents |
| `vtt-react/src/data/talentTrees/revenant.js` | Revenant talents |
| `vtt-react/src/data/talentTrees/shaper.js` | Shaper talents |
| `vtt-react/src/data/talentTrees/shaperFlowMaster.js` | Flow Master talents |
| `vtt-react/src/data/talentTrees/shaperIronDancer.js` | Iron Dancer talents |
| `vtt-react/src/data/talentTrees/shaperPrimalShadow.js` | Primal Shadow talents |
| `vtt-react/src/data/talentTrees/spellguard.js` | Spellguard talents |
| `vtt-react/src/data/talentTrees/spellguardArcaneWarden.js` | Arcane Warden talents |
| `vtt-react/src/data/talentTrees/spellguardManaReaver.js` | Mana Reaver talents |
| `vtt-react/src/data/talentTrees/spellguardSpellBreaker.js` | Spell Breaker talents |
| `vtt-react/src/data/talentTrees/toxicologist.js` | Toxicologist talents |
| `vtt-react/src/data/talentTrees/toxicologistGadgeteer.js` | Gadgeteer talents |
| `vtt-react/src/data/talentTrees/toxicologistSaboteur.js` | Saboteur talents |
| `vtt-react/src/data/talentTrees/toxicologistVenomancer.js` | Venomancer talents |
| `vtt-react/src/data/talentTrees/warden.js` | Warden talents |
| `vtt-react/src/data/talentTrees/wardenJailer.js` | Jailer talents |
| `vtt-react/src/data/talentTrees/wardenMonolith.js` | Monolith talents |
| `vtt-react/src/data/talentTrees/wardenShadowblade.js` | Shadowblade talents |
| `vtt-react/src/data/talentTrees/wardenVengeanceSeeker.js` | Vengeance Seeker talents |
| `vtt-react/src/constants/acrobaticsTables.js` | Skill outcome descriptions |
| `vtt-react/src/constants/alchemyTables.js` | Alchemy outcome descriptions |
| `vtt-react/src/constants/animalHandlingTables.js` | Beast-handling outcome descriptions |
| `vtt-react/src/constants/arcanaTables.js` | Magical knowledge/outcome descriptions |
| `vtt-react/src/constants/arcaneKnowledgeTables.js` | Arcane lore outcomes |
| `vtt-react/src/constants/athleticsTables.js` | Skill outcome descriptions |
| `vtt-react/src/constants/historyTables.js` | Historical knowledge outcomes |
| `vtt-react/src/constants/insightTables.js` | Social/insight outcome descriptions |
| `vtt-react/src/constants/intimidationTables.js` | Cultural/social outcome descriptions |
| `vtt-react/src/constants/investigationTables.js` | Investigation outcome descriptions |
| `vtt-react/src/constants/loreConstants.js` | World/lore entity terminology |
| `vtt-react/src/constants/medicineTables.js` | Medical outcome descriptions |
| `vtt-react/src/constants/natureTables.js` | Ecological knowledge outcomes |
| `vtt-react/src/constants/perceptionTables.js` | Perception outcome descriptions |
| `vtt-react/src/constants/performanceTables.js` | Performance outcome descriptions |
| `vtt-react/src/constants/religionTables.js` | Religious/cosmological knowledge outcomes |
| `vtt-react/src/constants/ritualMagicTables.js` | Ritual magic outcomes |
| `vtt-react/src/constants/rollableTables.js` | Skill/table registry |
| `vtt-react/src/constants/skillDefinitions.js` | Skill knowledge and terminology |
| `vtt-react/src/constants/skillQuests.js` | Skill quest flavor and cultural references |
| `vtt-react/src/constants/sleightOfHandTables.js` | Skill outcome descriptions |
| `vtt-react/src/constants/socialSkillTables.js` | Social outcome descriptions |
| `vtt-react/src/constants/stealthTables.js` | Stealth outcome descriptions |
| `vtt-react/src/constants/survivalTables.js` | Survival/environment outcome descriptions |
| `vtt-react/src/constants/tacticalCombatTables.js` | Tactical outcome descriptions |
| `vtt-react/src/constants/weaponTypeMeta.js` | Weapon discipline descriptions |
| `vtt-react/src/constants/weaponTypeQuests.js` | Weapon quest flavor |
| `vtt-react/src/constants/weaponTypeSimpleTables.js` | Weapon outcome descriptions |
| `vtt-react/src/store/classLoreStore.js` | Class lore adapter/registry consumer |
| `vtt-react/src/store/deityStore.js` | Seeded deity descriptions, doctrine and worship |
| `vtt-react/src/store/factionStore.js` | Faction histories, rulers, allegiances and goals |
| `vtt-react/src/store/npcStore.js` | Named figure identities, histories and affiliations |
| `vtt-react/src/store/timelineStore.js` | Calendar eras, dated internal events and history |
| `vtt-react/src/store/worldStore.js` | World/entity descriptions and cross-reference consumers |
| `vtt-react/src/store/languageStore.js` | Canon seeded languages and user language registry |
| `vtt-react/src/store/customLineageStore.js` | Custom ancestry traits/defaults and identity rules |
| `vtt-react/src/utils/nameGenerator.js` | Race name lists and shared surname syntax |
| `vtt-react/src/utils/raceDisplayNames.js` | Canon display names and legacy bloodline aliases |
| `vtt-react/src/utils/resourceStatusFlavor.js` | Hardcoded resource-state worldbuilding flavor |
| `vtt-react/src/utils/pointBuySystem.js` | Heritage compatibility and race/background bonuses |
| `vtt-react/src/utils/loreAutoLinker.js` | Lore term aliases and automatic references |
| `vtt-react/src/data/__tests__/races.test.js` | Ancestry/trait expectation fixtures |
| `vtt-react/src/data/__tests__/raceTraitIntegration.test.js` | Ancestry rule/inheritance fixtures |
| `vtt-react/src/data/classes/__tests__/deeplingClasses.temp.test.js` | Deepling class identity/eligibility expectations |
| `vtt-react/src/utils/__tests__/raceDisplayNames.test.js` | Canon name/alias expectation fixtures |
| `vtt-react/src/data/resourceSystems/__tests__/allGuides.test.js` | Resource-guide expectations |
| `vtt-react/src/data/resourceSystems/__tests__/normalizeResourceSystem.test.js` | Resource interpretation expectations |
| `vtt-react/src/components/world/__tests__/WorldDashboard.test.jsx` | World/ancestry UI fixture identities |
| `vtt-react/src/components/world-map/__tests__/LoreSidebar.test.jsx` | Map lore fixture identities |
| `vtt-react/src/components/hud/__tests__/PartyHUD.test.jsx` | Saved character/resource identity fixtures |
| `vtt-react/src/data/classes/animist/components/AnimistResourceBar.jsx` | Ancestral resonance labels, thresholds and tooltip copy |
| `vtt-react/src/data/classes/apex/components/ApexResourceBar.jsx` | Companion/quarry resource labels and tooltip copy |
| `vtt-react/src/data/classes/arcanoneer/components/ArcanoneerResourceBar.jsx` | Elemental sphere, formulation and backlash copy |
| `vtt-react/src/data/classes/arcanoneer/components/SphereComboFinder.jsx` | Elemental combination/formulation catalogue copy |
| `vtt-react/src/data/classes/augur/components/AugurResourceBar.jsx` | Fate pool, Blood Price and Omen Debt copy |
| `vtt-react/src/data/classes/berserker/components/BerserkerResourceBar.jsx` | Rage/Overheat resource rules and copy |
| `vtt-react/src/data/classes/crusader/components/CrusaderResourceBar.jsx` | Fervor and Judgment resource copy |
| `vtt-react/src/data/classes/gambit/components/GambitResourceBar.jsx` | Fortune/Karmic Debt resource copy |
| `vtt-react/src/data/classes/harbinger/components/HarbingerResourceBar.jsx` | Mayhem/entropy resource copy |
| `vtt-react/src/data/classes/inquisitor/components/InquisitorResourceBar.jsx` | Authority/Vow resource copy |
| `vtt-react/src/data/classes/lunarch/components/LunarchResourceBar.jsx` | Parasite and lunar-cycle resource copy |
| `vtt-react/src/data/classes/martyr/components/MartyrResourceBar.jsx` | Devotion and sacrifice resource copy |
| `vtt-react/src/data/classes/minstrel/components/MinstrelResourceBar.jsx` | Notes/Cadence and stolen-voice copy |
| `vtt-react/src/data/classes/plaguebringer/components/PlaguebringerResourceBar.jsx` | Virulence and disease-resource copy |
| `vtt-react/src/data/classes/pyrofiend/components/PyrofiendResourceBar.jsx` | Inferno Veil/Rings/debt resource copy |
| `vtt-react/src/data/classes/revenant/components/RevenantResourceBar.jsx` | Death-Toll/phylactery resource copy |
| `vtt-react/src/data/classes/shaper/components/ShaperResourceBar.jsx` | Flux/Body Toll and form-rule copy |
| `vtt-react/src/data/classes/spellguard/components/SpellguardResourceBar.jsx` | AEP/absorption resource copy |
| `vtt-react/src/data/classes/toxicologist/components/ToxicologistResourceBar.jsx` | Vials, brewing and contraption copy |
| `vtt-react/src/data/classes/warden/components/GaolerResourceBar.jsx` | Tether-Tension and chain-graft resource copy |
| `vtt-react/src/data/classes/animist/__tests__/AnimistResourceBar.test.jsx` | Resource/threshold expectations |
| `vtt-react/src/data/classes/apex/__tests__/ApexResourceBar.test.jsx` | Resource/threshold expectations |
| `vtt-react/src/data/classes/arcanoneer/__tests__/ArcanoneerResourceBar.test.jsx` | Resource/threshold expectations |
| `vtt-react/src/data/classes/augur/__tests__/AugurResourceBar.test.jsx` | Resource/threshold expectations |
| `vtt-react/src/data/classes/berserker/__tests__/BerserkerResourceBar.test.jsx` | Resource/threshold expectations |
| `vtt-react/src/data/classes/crusader/__tests__/CrusaderResourceBar.test.jsx` | Resource/threshold expectations |
| `vtt-react/src/data/classes/gambit/__tests__/GambitResourceBar.test.jsx` | Resource/threshold expectations |
| `vtt-react/src/data/classes/gambit/__tests__/GambitSvgSmoke.test.jsx` | Resource presentation expectation fixtures |
| `vtt-react/src/data/classes/harbinger/__tests__/HarbingerResourceBar.test.jsx` | Resource/threshold expectations |
| `vtt-react/src/data/classes/inquisitor/__tests__/InquisitorResourceBar.test.jsx` | Resource/threshold expectations |
| `vtt-react/src/data/classes/lunarch/__tests__/LunarchResourceBar.test.jsx` | Resource/threshold expectations |
| `vtt-react/src/data/classes/martyr/__tests__/MartyrResourceBar.test.jsx` | Resource/threshold expectations |
| `vtt-react/src/data/classes/minstrel/components/__tests__/MinstrelStaveSmoke.test.jsx` | Cadence/resource expectation fixtures |
| `vtt-react/src/data/classes/plaguebringer/__tests__/PlaguebringerResourceBar.test.jsx` | Resource/threshold expectations |
| `vtt-react/src/data/classes/pyrofiend/__tests__/PyrofiendResourceBar.test.jsx` | Resource/threshold expectations |
| `vtt-react/src/data/classes/revenant/__tests__/RevenantResourceBar.test.jsx` | Resource/threshold expectations |
| `vtt-react/src/data/classes/shaper/__tests__/ShaperResourceBar.test.jsx` | Resource/threshold expectations |
| `vtt-react/src/data/classes/spellguard/__tests__/SpellguardResourceBar.test.jsx` | Resource/threshold expectations |
| `vtt-react/src/data/classes/toxicologist/__tests__/ToxicologistResourceBar.test.jsx` | Resource/threshold expectations |
| `vtt-react/src/data/classes/warden/__tests__/GaolerResourceBar.test.jsx` | Resource/threshold expectations |

### Lore File Manifest — UI, creation/account consumers and hardcoded flavor

| File path | Lore housed / audit role |
|---|---|
| `vtt-react/src/components/character-creation-wizard/CharacterCreationWizard.jsx` | Creation flow and selection semantics |
| `vtt-react/src/components/character-creation-wizard/context/CharacterWizardContext.js` | Selected ancestry/class/languages and grants |
| `vtt-react/src/components/character-creation-wizard/steps/Step1CoreDraft.jsx` | Race/class/background lore, heritage gates and naming |
| `vtt-react/src/components/character-creation-wizard/steps/Step7SkillsLanguages.jsx` | Racial language grants and selectable tongues |
| `vtt-react/src/components/character-creation-wizard/steps/Step8LoreDetails.jsx` | Character origins/backstory prompts |
| `vtt-react/src/components/character-creation-wizard/steps/Step9CharacterSummary.jsx` | Final identity, ancestry and trait summary |
| `vtt-react/src/components/character-creation-wizard/steps/Step10EquipmentSelection.jsx` | Ancestral/background gear selection |
| `vtt-react/src/components/character-creation-wizard/components/tabs/OverviewTab.jsx` | Race lore and lifespan display |
| `vtt-react/src/components/character-creation-wizard/components/tabs/SubraceTab.jsx` | Subrace definitions and traits |
| `vtt-react/src/components/auth/CharacterManager.jsx` | Account character ancestry labels/filter catalogue |
| `vtt-react/src/components/account/AccountDashboard.jsx` | Profile/character identity normalization |
| `vtt-react/src/components/account/CharacterCreationPage.jsx` | Account creation-flow consumer |
| `vtt-react/src/components/account/CharacterManagement.jsx` | Saved character bloodline/race labels |
| `vtt-react/src/components/account/CharacterViewPage.jsx` | Profile heritage label and class display |
| `vtt-react/src/components/account/AccountJournalManager.jsx` | Character/campaign lore-bearing journal consumer |
| `vtt-react/src/components/account/CampaignManager.jsx` | Campaign ancestry/entity selectors |
| `vtt-react/src/components/character-sheet/Lore.jsx` | Ancestry/background/classes, birthrights and origin lore |
| `vtt-react/src/components/character-sheet/Languages.jsx` | Saved language display/definitions |
| `vtt-react/src/components/character-sheet/CharacterStats.jsx` | Racial and class rule display |
| `vtt-react/src/components/character-sheet/CharacterPanel.jsx` | Character identity and resource terminology |
| `vtt-react/src/components/common/LoreTooltip.jsx` | Lexicon lore and nativeWeaving rendering |
| `vtt-react/src/components/common/LoreLink.jsx` | Lore-link lookup/definition consumer |
| `vtt-react/src/components/common/CodexLoreEditor.jsx` | Hardcoded lore authoring examples |
| `vtt-react/src/components/rules/RulesPage.jsx` | Laws & Lore navigation and source consumers |
| `vtt-react/src/components/rules/ClassesDisplay.jsx` | Class catalogue/identity consumer |
| `vtt-react/src/components/rules/ClassDetailDisplay.jsx` | Class lore and hardcoded ancestry/art captions |
| `vtt-react/src/components/rules/ClassOriginsDisplay.jsx` | Hardcoded regional bargains and class-cultural mapping |
| `vtt-react/src/components/rules/RaceSelector.jsx` | Race/subrace lore, lifespan and trait consumer |
| `vtt-react/src/components/rules/RaceEpicLore.jsx` | Race epic history/figures consumer |
| `vtt-react/src/components/rules/LanguagesDisplay.jsx` | Language acquisition laws, speakers and script copy |
| `vtt-react/src/components/rules/LexiconDisplay.jsx` | Lexicon catalogue consumer |
| `vtt-react/src/components/rules/BestiaryDisplay.jsx` | Creature origin rules and layer explanation |
| `vtt-react/src/components/rules/DramatisPersonaeDisplay.jsx` | Named figures and hardcoded portraits/captions |
| `vtt-react/src/components/rules/TimelineDisplay.jsx` | Era-relative history display |
| `vtt-react/src/components/rules/SkillsDisplay.jsx` | Skill/lore knowledge consumer |
| `vtt-react/src/components/rules/resource-system/ResourceSystemTab.jsx` | Resource guide consumer |
| `vtt-react/src/components/world/ClassLoreDetail.jsx` | Hardcoded fallback orders, leaders and doctrine |
| `vtt-react/src/components/world/WorldDashboard.jsx` | World canon/race/language registry consumer |
| `vtt-react/src/components/world/CustomLineageWizard.jsx` | Worldbuilding ancestry prompts and lifespan defaults |
| `vtt-react/src/components/world/RegionDetail.jsx` | Regional lore consumer |
| `vtt-react/src/components/world/LocationDetail.jsx` | Named location/class-site lore consumer |
| `vtt-react/src/components/world/FactionDetail.jsx` | Faction lore/relationships consumer |
| `vtt-react/src/components/world/TimelineView.jsx` | Historical event/era consumer |
| `vtt-react/src/components/world/FamilyTreeStudio.jsx` | House/member identity and lifespan consumer |
| `vtt-react/src/components/world-map/LoreSidebar.jsx` | Map-facing location/lore copy |
| `vtt-react/src/components/world-map/WorldMapImmerse.jsx` | World-map lore consumer |
| `vtt-react/src/components/landing/MapMakingSection.jsx` | Hardcoded world geography, houses and cosmological flavor |
| `vtt-react/src/components/landing/LandingPage.jsx` | Player-facing setting/product introduction |
| `vtt-react/src/components/gm-tools/SocialEncounterGenerator.jsx` | Hardcoded cultures, racial names and encounter flavor |
| `vtt-react/src/components/level-editor/GMNotesWindow.jsx` | Hardcoded lineage/epithet suggestions |
| `vtt-react/src/components/books/BookDocumentEditor.jsx` | Seed/sample ancestry, languages, houses and noble figures |
| `vtt-react/src/components/books/BookTtrpgBlocks.jsx` | Book rule/ancestry/house block defaults |
| `vtt-react/src/components/books/BookImagePickerModal.jsx` | Hardcoded ancestry/class image identity labels |
| `vtt-react/src/components/books/BookLorePickerModal.jsx` | Book lore source consumer |
| `vtt-react/src/components/creature-wizard/components/steps/Step1BasicInfo.jsx` | Creature layer/type taxonomy |
| `vtt-react/src/components/creature-wizard/components/common/EnhancedCreatureInspectView.jsx` | Creature origin/lore consumer |
| `vtt-react/src/components/hud/ClassResourceBar.jsx` | Resource names and lore/tooltips |
| `vtt-react/src/components/hud/ResourceTooltip.jsx` | Resource explanation copy |
| `vtt-react/src/components/hud/PartyHUD.jsx` | Party heritage labels/resource flavor consumer |
| `vtt-react/src/components/hud/AncestralResonanceResourceBar.jsx` | Spirit/ancestor resource text |
| `vtt-react/src/components/hud/AscensionBloodResourceBar.jsx` | Undeath/ascension resource text |
| `vtt-react/src/components/hud/DevotionGaugeResourceBar.jsx` | Martyr resource text |
| `vtt-react/src/components/hud/DominanceDieResourceBar.jsx` | Dominance resource text |
| `vtt-react/src/components/hud/DRPResilienceResourceBar.jsx` | Resilience resource text |
| `vtt-react/src/components/hud/EternalFrostPhylacteryResourceBar.jsx` | Frost/undeath resource text |
| `vtt-react/src/components/hud/FortunePointsResourceBar.jsx` | Fortune/Karmic Debt resource text |
| `vtt-react/src/components/hud/HexbreakerChargesResourceBar.jsx` | Hexbreaking resource text |
| `vtt-react/src/components/hud/LunarPhasesResourceBar.jsx` | Lunar phase resource text |
| `vtt-react/src/components/hud/MadnessGaugeResourceBar.jsx` | Madness resource text |
| `vtt-react/src/components/hud/MayhemModifiersResourceBar.jsx` | Mayhem resource text |
| `vtt-react/src/components/hud/PropheticVisionsResourceBar.jsx` | Prophetic resource text |
| `vtt-react/src/components/hud/QuarryMarksResourceBar.jsx` | Quarry/companion resource text |
| `vtt-react/src/components/hud/RageBarResourceBar.jsx` | Rage/Hunger Pact resource text |
| `vtt-react/src/components/hud/StanceFlowResourceBar.jsx` | Form/stance resource text |
| `vtt-react/src/components/hud/ThreadsOfDestinyResourceBar.jsx` | Fate thread resource text |
| `vtt-react/src/components/hud/TimeShardsStrainResourceBar.jsx` | Temporal resource text |
| `vtt-react/src/components/spellcrafting-wizard/core/data/resourceTypes.js` | Resource taxonomy/descriptions |
| `vtt-react/src/components/spellcrafting-wizard/components/steps/Step5Resources.jsx` | Custom-magic resource choices and copy |
| `vtt-react/src/components/spellcrafting-wizard/data/effects/UtilityEffects.jsx` | Utility magic capabilities and language effects |

## 2. Executive Issue Checklist

**Unchecked means unresolved.** “Critical Collision” denotes a direct collision with core world identity, origin, law, or operative ancestry rules. “Minor Drift” also includes moderate localized mismatches; the detailed log gives the finer Critical/Moderate/Minor rank. “Dangling Reference” denotes a missing definition, registration, mapping, or promised selectable route. No path below has been adopted.

| Reviewed | Issue ID | Category | Severity | Decision status |
|---|---|---|---|---|
| [ ] | ISSUE-001 | World History/Laws | Critical Collision | Awaiting creator |
| [ ] | ISSUE-002 | World History/Laws | Critical Collision | Awaiting creator |
| [ ] | ISSUE-003 | World History/Laws | Critical Collision | Awaiting creator |
| [ ] | ISSUE-004 | World History/Laws | Critical Collision | Awaiting creator |
| [ ] | ISSUE-005 | World History/Laws | Critical Collision | Awaiting creator |
| [ ] | ISSUE-006 | World History/Laws | Critical Collision | Awaiting creator |
| [ ] | ISSUE-007 | Race/Species | Critical Collision | Awaiting creator |
| [ ] | ISSUE-008 | Race/Species | Critical Collision | Awaiting creator |
| [ ] | ISSUE-009 | Race/Species | Minor Drift | Awaiting creator |
| [ ] | ISSUE-010 | Race/Species | Minor Drift | Awaiting creator |
| [ ] | ISSUE-011 | Race/Species | Critical Collision | Awaiting creator |
| [ ] | ISSUE-012 | Race/Species | Critical Collision | Awaiting creator |
| [ ] | ISSUE-013 | Race/Species | Critical Collision | Awaiting creator |
| [ ] | ISSUE-014 | Background/Language | Critical Collision | Awaiting creator |
| [ ] | ISSUE-015 | Race/Species | Minor Drift | Awaiting creator |
| [ ] | ISSUE-016 | Race/Species | Minor Drift | Awaiting creator |
| [ ] | ISSUE-017 | Race/Species | Minor Drift | Awaiting creator |
| [ ] | ISSUE-018 | World History/Laws | Critical Collision | Awaiting creator |
| [ ] | ISSUE-019 | Race/Species | Minor Drift | Awaiting creator |
| [ ] | ISSUE-020 | Race/Species | Critical Collision | Awaiting creator |
| [ ] | ISSUE-021 | Mechanics | Critical Collision | Awaiting creator |
| [ ] | ISSUE-022 | Mechanics | Critical Collision | Awaiting creator |
| [ ] | ISSUE-023 | Background/Language | Dangling Reference | Awaiting creator |
| [ ] | ISSUE-024 | Background/Language | Dangling Reference | Awaiting creator |
| [ ] | ISSUE-025 | Background/Language | Critical Collision | Awaiting creator |
| [ ] | ISSUE-026 | Background/Language | Critical Collision | Awaiting creator |
| [ ] | ISSUE-027 | World History/Laws | Critical Collision | Awaiting creator |
| [ ] | ISSUE-028 | World History/Laws | Critical Collision | Awaiting creator |
| [ ] | ISSUE-029 | Race/Species | Minor Drift | Awaiting creator |
| [ ] | ISSUE-030 | Race/Species | Minor Drift | Awaiting creator |
| [ ] | ISSUE-031 | Race/Species | Critical Collision | Awaiting creator |
| [ ] | ISSUE-032 | World History/Laws | Minor Drift | Awaiting creator |
| [ ] | ISSUE-033 | Race/Species | Minor Drift | Awaiting creator |
| [ ] | ISSUE-034 | Race/Species | Critical Collision | Awaiting creator |
| [ ] | ISSUE-035 | Race/Species | Critical Collision | Awaiting creator |
| [ ] | ISSUE-036 | Race/Species | Critical Collision | Awaiting creator |
| [ ] | ISSUE-037 | Race/Species | Critical Collision | Awaiting creator |
| [ ] | ISSUE-038 | Race/Species | Critical Collision | Awaiting creator |
| [ ] | ISSUE-039 | Class Lore | Dangling Reference | Awaiting creator |
| [ ] | ISSUE-040 | Class Lore | Critical Collision | Awaiting creator |
| [ ] | ISSUE-041 | Class Lore | Critical Collision | Awaiting creator |
| [ ] | ISSUE-042 | Class Lore | Minor Drift | Awaiting creator |
| [ ] | ISSUE-043 | Class Lore | Critical Collision | Awaiting creator |
| [ ] | ISSUE-044 | Background/Language | Minor Drift | Awaiting creator |
| [ ] | ISSUE-045 | Class Lore | Minor Drift | Awaiting creator |
| [ ] | ISSUE-046 | World History/Laws | Critical Collision | Awaiting creator |
| [ ] | ISSUE-047 | World History/Laws | Minor Drift | Awaiting creator |
| [ ] | ISSUE-048 | Race/Species | Minor Drift | Awaiting creator |
| [ ] | ISSUE-049 | World History/Laws | Minor Drift | Awaiting creator |
| [ ] | ISSUE-050 | Background/Language | Dangling Reference | Awaiting creator |
| [ ] | ISSUE-051 | Class Lore | Dangling Reference | Awaiting creator |
| [ ] | ISSUE-052 | Class Lore | Dangling Reference | Awaiting creator |
| [ ] | ISSUE-053 | Mechanics | Minor Drift | Awaiting creator |
| [ ] | ISSUE-054 | World History/Laws | Minor Drift | Awaiting creator |
| [ ] | ISSUE-055 | World History/Laws | Critical Collision | Awaiting creator |
| [ ] | ISSUE-056 | Race/Species | Critical Collision | Awaiting creator |
| [ ] | ISSUE-057 | World History/Laws | Minor Drift | Awaiting creator |
| [ ] | ISSUE-058 | World History/Laws | Critical Collision | Awaiting creator |
| [ ] | ISSUE-059 | World History/Laws | Critical Collision | Awaiting creator |
| [ ] | ISSUE-060 | Race/Species | Critical Collision | Awaiting creator |
| [ ] | ISSUE-061 | Background/Language | Minor Drift | Awaiting creator |

## 3. Detailed Collision Log

For Path C in every entry, **the creator must supply the exact distinction or custom rule**. No hybrid explanation is asserted or drafted by this audit.

### ISSUE-001: Does folklore create native life, or merely describe it?
- **Category:** World History/Laws
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `docs/CORE_LORE_FRAMEWORK.md` (lines 20–22): "Collective belief, folklore, myth, fear, and vow organically manifest into living creatures and native races."
  - Source B: `vtt-react/public/data/rules.json` (line 143): "Folklore records, translates, and camouflages what people encounter." / "it does not create native creatures or Ancient Cosmic Wyrdkin."
  - Also: `vtt-react/public/data/lore.json` (lines 1549–1550, 6426–6427) supports A; `rules.json:32` states "Folklore is a clue, not a source."
- **Contradiction Breakdown:** These are opposing causal rules, not synonyms. Native beasts cannot both be produced by repeated belief and categorically not be produced by folklore. The scope expressly includes native creatures in both statements.
- **Clarification Question for Creator:** Is belief-generated native life still canonical, or is folklore exclusively a record/camouflage of independently existing creatures?
- **Possible Paths:**
  - Path A: Retain the Primordial Loom's generative rule; revise the rulebook's categorical denial.
  - Path B: Retain the non-generative creature model; revise the framework and lexicon's origin rules.
  - Path C: Supply an explicit creature-layer distinction and its limits.

### ISSUE-002: Aethil is a personal father in the lexicon but an impersonal law in the deity registry
- **Category:** World History/Laws
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/public/data/lore.json` (line 1505): "Aethil is Sol's father. Not a metaphor — a celestial deity who chose to become a wall." / "Aethil is not a mechanism."
  - Source B: `vtt-react/src/store/deityStore.js` (lines 79–85): "name: 'Aethil, the Warden'" / "The Warden is not a god. It is the rule that gods bargain under"
- **Contradiction Breakdown:** The same seeded named entity has mutually exclusive ontologies. Source A explicitly identifies impersonal descriptions as Keth Amar's impersonation; B presents that description unqualified as the current deity's nature. That already-written impersonation framing does not make the unqualified registry accurate.
- **Clarification Question for Creator:** Should the deity record represent the actual father or the false doctrine recorded during the impersonation?
- **Possible Paths:**
  - Path A: Adopt the personal father; align deity description/title with it.
  - Path B: Adopt the impersonal Warden; revise father identity and cosmological relationships.
  - Path C: Specify distinct records and their epistemic status.

### ISSUE-003: The Counterfeit is Keth Amar's forgery or a deception aimed at Keth Amar
- **Category:** World History/Laws
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `docs/CORE_LORE_FRAMEWORK.md` (lines 124–127): "Keth Amar's whisper-cult" / "They serve the Counterfeit Monolith and, through it, the thing that forged it."
  - Source B: `vtt-react/public/data/rules.json` (line 28): "An Predatory Wyrd intelligence behind the Counterfeit interjected a counterfeit 7th House (Masked Acolytes) and forged a **7th Monolith**, fooling Keth Amar so he cannot discern the genuine key from the counterfeit."
- **Contradiction Breakdown:** The primer makes the counterfeit a shell game against the predator; the core account makes the cult and forgery instruments of that predator. No independent deceiver relationship is specified that would establish both accounts as true.
- **Clarification Question for Creator:** Who forged the Counterfeit, whom is it intended to deceive, and whom do the Acolytes ultimately serve?
- **Possible Paths:**
  - Path A: Adopt Keth's forgery/cult; revise the primer's deception target.
  - Path B: Adopt an independently motivated deceiver; revise core cult allegiance.
  - Path C: Supply the precise creator, patron and deception relationships.

### ISSUE-004: Monoliths are explicitly not keys, while Viridane's fragment is a cleansing key
- **Category:** World History/Laws
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `docs/CORE_LORE_FRAMEWORK.md` (lines 108–110): "They are pieces of a mother's armour, not keys to a lock"
  - Source B: `vtt-react/public/data/lore.json` (line 3020): "Viridane's true Monolith fragment — the uncorrupted seventh, never breached because Viridane's heir never marched" / "It is the cleansing key, carried in Florae thorn-blood"
  - Related: `rules.json:28` refers to the "genuine key"; core §1.6 lists seven seats with one counterfeit, while the older fragment account introduces a hidden genuine seventh.
- **Contradiction Breakdown:** The key-based lineage-fragment model and the explicitly non-key fallen-armour model assign different functions and counts to the same Monolith scheme. “Cleansing key” could be metaphorical, but the source does not say so; the audit cannot supply that distinction.
- **Clarification Question for Creator:** Is the hidden Viridane fragment a functional key, and how many genuine great shards exist alongside the Counterfeit?
- **Possible Paths:**
  - Path A: Adopt fallen armour/non-key Monoliths; revise key/hidden-seventh claims.
  - Path B: Adopt lineage-linked keys; revise the core prohibition and enumeration.
  - Path C: Define an exact counting and functional rule.

### ISSUE-005: Explicitly scrapped heir-devouring remains in the player origin background
- **Category:** World History/Laws
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `docs/CORE_LORE_FRAMEWORK.md` (lines 170–172): "Keth Amar devoured the heirs to shatter the vault." is labelled "**SCRAPPED**"; "the Purge was the *preparation* for the strike, not the strike itself."
  - Source B: `vtt-react/src/data/backgroundData.js` (line 206): "Six of them broke and fed their heirs to Keth Amar"
  - Also: `vtt-react/public/data/rules.json:57` contains "With claws as wide as mountains, I devoured them upon the frozen granite!" in a predator proclamation; `human.js:15` retains mass firstborn offerings. The proclamation is attributed speech; the background is an unqualified player origin.
- **Contradiction Breakdown:** The operative Noble Scion description repeats the retired devouring account as history, rather than the specified seal-breaking sequence. Attributed villain testimony alone would not establish a contradiction, but the background independently asserts it.
- **Clarification Question for Creator:** Were heirs actually devoured at the summit, and was that event a seal-breaking preparation or the action that shattered the vault?
- **Possible Paths:**
  - Path A: Adopt the core Purge/Strike sequence; revise the player-origin claim.
  - Path B: Restore literal summit devouring; revise the scrapped-lore directive and chronology.
  - Path C: Specify which attributed accounts are false and the actual sequence.

### ISSUE-006: The Sleeping Soul cannot act, but actively helps forge the Secret Aegis
- **Category:** World History/Laws
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `docs/CORE_LORE_FRAMEWORK.md` (line 18): "It does not speak, act, or answer."
  - Source B: `vtt-react/src/data/races/human.js` (line 85): "with the Sleeping Soul's aid forged the Secret Aegis."
  - `lore.json:6413` repeats "It does not act."
- **Contradiction Breakdown:** Direct aid to a specific family is an action absent any defined intermediary or impersonal-process distinction. B also identifies Viridane with the secret lineage; the core keeps that lineage unrecorded. The identity difference requires review, but the demonstrable collision here is the Soul's agency.
- **Clarification Question for Creator:** Did the Sleeping Soul knowingly help Viridane, or should the aid be attributed to another defined power or process?
- **Possible Paths:**
  - Path A: Retain the non-acting Soul; correct the aid attribution.
  - Path B: Retain direct aid; revise the non-intervention rule.
  - Path C: Supply an explicit agency/identity distinction.

### ISSUE-007: The same First Contract is both pre-entombment and founded in the Freezing Era
- **Category:** Race/Species
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/neth.js` (line 25): "That was before the sun was buried. The First Contract still rests in the heart of Atropolis"
  - Source B: `vtt-react/src/data/classes/arcanoneerData.js` (line 157): "Founded in the first centuries of the Freezing Era by Valerius, a Nethien archivist who drafted the First Contract with Morvane."
  - `lore.json:4907` likewise says Valerius drafted it in the early Freezing Era; `races/vreken.js:163` places Nethien arrival three centuries after the Great Binding.
- **Contradiction Breakdown:** The Contract's founding cannot be before entombment and after the Blind Strike/Freezing Era under the same event sequence. No separate first pact and later codification are defined in these statements.
- **Clarification Question for Creator:** When was the First Contract made, and did Valerius originate it or later adapt an existing pact?
- **Possible Paths:**
  - Path A: Adopt the pre-entombment Contract; revise class founder/era claims.
  - Path B: Adopt the Freezing-Era Contract; revise ancestry chronology.
  - Path C: Define distinct events and their names, actors and order.

### ISSUE-008: Vreken are transformed human Houses or an older elven people who never bargained
- **Category:** Race/Species
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `docs/CORE_LORE_FRAMEWORK.md` (line 299): "**VREKEN:** Former humans altered by Blight magic."
  - Source B: `vtt-react/src/data/races/vreken.js` (line 19): "Once an elegant elven people devoted to Morvane"
  - Source B: same file (line 161): "They did not choose this. They did not bargain for it."
- **Contradiction Breakdown:** Different original species and causes of transformation are asserted. A is a human pact/Blight lineage; B is an involuntarily corrupted pre-existing elven people. The core's Vreken extortion and noble slaughter also conflict with B's denial of bargaining and its non-war history.
- **Clarification Question for Creator:** Are Vreken human pact-descendants or native elven people transformed through Morvane's wound?
- **Possible Paths:**
  - Path A: Adopt human/Blight ancestry; revise race origin and history.
  - Path B: Adopt native elven ancestry; revise core extortion/House lineage claims.
  - Path C: Define any distinct populations explicitly.

### ISSUE-009: Which people preceded the other in Cragjaw: Thrumm or Fexric?
- **Category:** Race/Species
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/groven.js` (lines 49–51): "They were the mountain's first children, its sovereign inhabitants" / "The Fexric arrived later."
  - Source B: `vtt-react/src/data/races/fexrick.js` (line 13): "before the Thrumm crawled through the deep crags" / "They did not arrive in the peaks"
- **Contradiction Breakdown:** Each origin account gives a mutually exclusive settlement/order claim for the same mountain. This is not resolved by Fexric later discovering Thrumm; A expressly places Fexric arrival later, while B expressly denies an arrival.
- **Clarification Question for Creator:** Which ancestry occupied Cragjaw first, and did the Fexric migrate there?
- **Possible Paths:**
  - Path A: Adopt Thrumm priority and later Fexric arrival; revise Fexric prose.
  - Path B: Adopt Fexric priority; revise Groven/Thrumm history.
  - Path C: Specify the exact geographic or chronological distinction.

### ISSUE-010: Seven current Human subraces versus five, with Solvarn and Morren absorbed
- **Category:** Race/Species
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `docs/CORE_LORE_FRAMEWORK.md` (lines 308–317): "**HUMANS (7 Regional Subraces):**" includes "**Solvarn:**" and "**Morren:**"
  - Source B: `vtt-react/src/data/races/human.js` (line 49): "Humanity is divided into five regional bloodlines" / "The Solvarn of Sundale were transformed by Ember into the Solari, a separate race no longer human. The Morren of Bryngloom were absorbed into the Vreken"
- **Contradiction Breakdown:** The present-tense ancestry census counts two groups that the creation race text explicitly removes from humanity. They may be retained as historical peoples, but the core does not label its seven-subrace list historical.
- **Clarification Question for Creator:** Is the current Human census five or seven, and should Solvarn/Morren be historical entries only?
- **Possible Paths:**
  - Path A: Adopt seven current subraces; revise the absorption claims and playable census.
  - Path B: Adopt five current cultures; label/revise the core census.
  - Path C: Supply a precise historical-versus-playable taxonomy.

### ISSUE-011: Solari exist centuries before the pact that supposedly creates them
- **Category:** Race/Species
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `docs/CORE_LORE_FRAMEWORK.md` (lines 62–66): "giving rise to distinct altered human sub-races" / "Mutated directly into distinct magical lineages (*Solari*, *Vreken*"
  - Source B: `vtt-react/src/data/races/solari.js` (line 57): "For centuries before the seven noble families gathered to discuss their desperate ritual, the Solari were already excavating the thermal deep beneath Sundale"
- **Contradiction Breakdown:** A makes Solari a product of the Bloodline Pacts; B assigns already-Solari clans, Sun-Speakers and a civilization centuries before that ritual. The source does not distinguish retrospectively named human ancestors from already-transformed Solari.
- **Clarification Question for Creator:** Did the pact create Solari, or transform an already existing Solari people?
- **Possible Paths:**
  - Path A: Adopt pact-created Solari; revise pre-pact ancestry naming/history.
  - Path B: Adopt pre-pact Solari; revise their core origin.
  - Path C: Define the predecessor people and transformation boundary.

### ISSUE-012: Broken Mimir proudly reject masks but inherit maskless incapacities
- **Category:** Race/Species
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/mimir.js` (lines 563–566): "They wear NO masks whatsoever." / "unburdened by ancestral guilt"
  - Source B: same file (line 185): "Without a mask, you cannot cast identity-based spells, shapeshift, or use Mimir racial traits that require the mask-bond. Disadvantage on Charisma checks as the inherited shame surfaces unfiltered"
  - `raceData.js:146–169` combines shared and subrace traits by ID; it does not remove `maskless_frailty_mimir` for Broken Mimir.
- **Contradiction Breakdown:** The new subrace rejects inherited shame and never wears a mask, while the shared rule imposes shame-driven disability whenever maskless. No Broken exemption is specified. The race overview's "no Mimir" face-exposure assertions also contradict the subrace's proud public exposure.
- **Clarification Question for Creator:** Are Broken Mimir exempt from maskless restrictions and inherited shame, or do they knowingly live under those restrictions?
- **Possible Paths:**
  - Path A: Adopt liberated Broken identity; specify the corresponding trait exception and revise universal prose.
  - Path B: Adopt universal mask dependence; revise Broken identity and capabilities.
  - Path C: Supply a precise subrace/trait override rule.

### ISSUE-013: Arch Mimir masks simultaneously conceal everything, expose faces, and are featureless porcelain
- **Category:** Race/Species
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/mimir.js` (line 331): "towering, ancient heartwood masks" / "The female's mask is a domino style, showing her peaceful eyes, nose, and mouth beneath."
  - Source B: `docs/subrace_lore_compendium/07_mimir_locations_and_figures.md` (line 74): "Flawless, unblemished white porcelain face-masks with ZERO eyeholes or mouth openings"
  - Also: `mimir.js:14` says the mask wraps completely around the head and no Mimir has seen their own features.
- **Contradiction Breakdown:** Material, openings and coverage are incompatible anatomical locks for the same Arch people. The race overview also denies the visible facial features its own subrace explicitly displays.
- **Clarification Question for Creator:** What material, coverage and openings define Arch masks, and which face-exposure assertions apply?
- **Possible Paths:**
  - Path A: Adopt partial heartwood masks; align overview and art specifications.
  - Path B: Adopt sealed porcelain masks; align race definitions.
  - Path C: Specify distinct authorized mask types and their contexts.

### ISSUE-014: Mask-making is lost with the last Mask-Mothers, yet a living forger trains apprentices
- **Category:** Background/Language
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/backgroundData.js` (line 827): "the last Mask-Mothers (the only ones who could craft new masks)"
  - Source B: `vtt-react/src/data/races/mimir.js` (lines 90–94): "The Tethered are the only Mimir subrace that still crafts masks." / "Tallen has trained eleven apprentices."
- **Contradiction Breakdown:** The creation background makes all new mask-making unavailable through the death of its only practitioners; the ancestry's notable-figure account expressly preserves an active tradition. A different lost kind of mask is not defined in A.
- **Clarification Question for Creator:** Is all new mask-making lost, or only a specific Mask-Mother craft?
- **Possible Paths:**
  - Path A: Adopt complete loss; revise living forging claims.
  - Path B: Adopt surviving craft; revise the background's exclusivity claim.
  - Path C: Define which masks each tradition can actually make.

### ISSUE-015: Vaelith Thread-Speaker is recast from canopy scholar to unmasked carnival sovereign
- **Category:** Race/Species
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/mimir.js` (lines 74–82): "Vaelith Thread-Speaker" / "Of the Veiled scholars" / "Seventy years in the canopy archives"
  - Source B: `docs/subrace_lore_compendium/07_mimir_locations_and_figures.md` (lines 41–44): "Vaelith Thread-Speaker (The Last Reader — Sovereign Storyteller)" / "Venerable unmasked bard" / "Legendary Female Broken Mimir Storyteller"
- **Contradiction Breakdown:** The same exact named figure/title is assigned a different caste, occupation, location and presentation. An exile or transition could explain it, but none is stated; it is therefore an unresolved identity collision, not proof of an impossible lifetime.
- **Clarification Question for Creator:** Which identity is current for Vaelith, and is any transition actually part of canon?
- **Possible Paths:**
  - Path A: Adopt the canopy scholar; revise art biography/caste.
  - Path B: Adopt the Broken storyteller; revise ancestry biography.
  - Path C: Supply a documented identity/history distinction.

### ISSUE-016: Tallen Glass-Hand's caste and role are reversed
- **Category:** Race/Species
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/mimir.js` (lines 86–94): "Tallen Glass-Hand" / "Only other Tethered wear Tallen's work"
  - Source B: `docs/subrace_lore_compendium/07_mimir_locations_and_figures.md` (lines 103–104): "Tallen Glass-Hand (The Living Tradition — Sovereign Arch-Mask)" / "Supreme sovereign of the Arch Mimir court."
- **Contradiction Breakdown:** The forger whose masks the Veiled refuse to wear is presented as their supreme sovereign without any stated change in caste or status. This is a competing current identity, not an authorized alias established by the text.
- **Clarification Question for Creator:** Is Tallen the marginal forger or the Arch court's sovereign?
- **Possible Paths:**
  - Path A: Adopt the forger account; revise art court identity.
  - Path B: Adopt the sovereign account; revise race biography and caste relationships.
  - Path C: Supply the exact relationship between these accounts.

### ISSUE-017: Retired “High Nethien” returns as a canonical bloodline label
- **Category:** Race/Species
- **Severity:** Minor
- **Colliding Sources:**
  - Source A: `vtt-react/src/utils/raceDisplayNames.js` (lines 19–23): "'high nethien': 'Nethien'"
  - Source A: `docs/CORE_LORE_FRAMEWORK.md` (line 281): "the bloodlines are **Nethien, Veldun, Withered**."
  - Source B: `vtt-react/src/data/races/neth.js` (line 49): "High Nethien (The Loyalists)"
  - Source B: `docs/MASTER_SUBRACE_LOCATIONS_AND_FIGURES.md:19` and `docs/subrace_lore_compendium/08_nethien_locations_and_figures.md:11` use High as a current subrace.
- **Contradiction Breakdown:** Creation/account normalization collapses the retired label, while new race prose and art census promote it back to a canonical current label. Internal `velun_neth` IDs are a separate compatibility concern and are not this finding.
- **Clarification Question for Creator:** Is High Nethien a retired label, a permitted epithet, or the current bloodline name?
- **Possible Paths:**
  - Path A: Adopt Nethien as the bloodline display name; align current prose/art census.
  - Path B: Restore High Nethien; align normalization and core naming rules.
  - Path C: Define allowed epithet versus selector-label usage.

### ISSUE-018: Atropolis is never built from stone, but is a marble metropolis in new lore
- **Category:** World History/Laws
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/public/data/lore.json` (line 2447): "Atropolis was never quarried or built. It was grown."
  - Source B: `docs/subrace_lore_compendium/08_nethien_locations_and_figures.md` (lines 19–20): "The monumental limestone and marble plateau overlooking the coastal trade estuary." / "A grand neoclassical metropolis constructed of white marble colonnades"
  - `races/neth.js:604` now places "gleaming marble spires above" its canal undercity, while the same race's overview places its archive in living heartwood.
- **Contradiction Breakdown:** The same capital is given incompatible construction history, substrate and geographic placement. An added stone district would need explicit boundaries; it cannot be inferred against A's categorical “never.”
- **Clarification Question for Creator:** Is Atropolis the grown ironwood canopy-city or the coastal marble law-city?
- **Possible Paths:**
  - Path A: Adopt living ironwood; align new city/canal descriptions.
  - Path B: Adopt marble/coastal Atropolis; revise the lexicon and Contract's Heart-Vault setting.
  - Path C: Define precisely separate places or districts.

### ISSUE-019: Nethien eyes are solid black pools or silver/amber eyes
- **Category:** Race/Species
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/neth.js` (line 8): "Their eyes are solid obsidian-black without sclera or pupils"
  - Source B: `docs/subrace_lore_compendium/08_nethien_locations_and_figures.md` (line 12): "Eyes: Piercing mercury-silver or cold amber eyes"
- **Contradiction Breakdown:** The anatomical locks for the high/Nethien presentation specify incompatible eye coloration and structure. The race file already separately specifies silver eyes for Veldun; the art claim is explicitly for High Nethien.
- **Clarification Question for Creator:** What are the canonical eyes of the Nethien bloodline?
- **Possible Paths:**
  - Path A: Adopt black pool eyes; revise the art lock.
  - Path B: Adopt silver/amber eyes; revise race anatomy and associated captions.
  - Path C: Supply a defined variation rule.

### ISSUE-020: Withered chose legal severance, or lost their souls through an ancestral magical sin
- **Category:** Race/Species
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `docs/CORE_LORE_FRAMEWORK.md` (lines 278–280): "Descend from Saren-Vel, who burned her own name from the First Contract" / "no longer preserved by Morvane's pact"
  - Source B: `vtt-react/src/data/races/neth.js` (line 798): "their ancestors' grave sin—a catastrophic magical breach that severed their bloodline's souls"
- **Contradiction Breakdown:** The cause and desired resolution of Withering differ: deliberate emancipation from legal preservation versus soul-loss from an inherited catastrophe with a quest for reversal. The latter is not identified as an in-world accusation or alternative belief.
- **Clarification Question for Creator:** Is Withering voluntary contract-severance or an inherited soul-loss curse?
- **Possible Paths:**
  - Path A: Adopt legal severance; revise new origin/reversal language.
  - Path B: Adopt catastrophic soul loss; revise core and Severed trait rationale.
  - Path C: Define any distinct cases and their consequences.

### ISSUE-021: Withered immunity and mortality are overridden by shared pact traits and a universal escalation track
- **Category:** Mechanics
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/neth.js` (line 805): "the Unraveling cannot affect you" / "must eat, drink, and sleep normally and will eventually age to death."
  - Source B: same file (lines 114–128): "Morvane's pact sustains you. You require no food, water, or sleep"
  - Source B: `vtt-react/src/data/raceMechanics.js` (lines 69–70): "applicableRace: 'neth'" / "applicableSubrace: 'all'"
  - `raceData.js:146–169` merges the differently identified shared and Severed traits; `neth.js:64` supplies an indefinite pact-bound lifespan without a Withered lifespan override.
- **Contradiction Breakdown:** The same character receives positive shared preservation/tether rules and a universal Fraying track, while its subrace says those rules cannot apply. No shared-trait replacement/exclusion rule resolves the conflict. This is a data-level rule collision, not a claim that every engine automatically executes the escalation.
- **Clarification Question for Creator:** Which shared traits, lifespan and escalation rules are removed for Withered characters?
- **Possible Paths:**
  - Path A: Adopt Withered exceptions; explicitly exclude incompatible inherited traits/track.
  - Path B: Adopt universal preservation/track; revise Withered immunity and mortality.
  - Path C: Supply an explicit inheritance/precedence contract.

### ISSUE-022: Fraying has two different thresholds, penalties and recovery rules
- **Category:** Mechanics
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/neth.js` (line 76): "-1 to Charisma checks per breach (stacking, max -3). After 3 unresolved breaches, Fading begins: -1 to Intelligence checks"
  - Source B: `vtt-react/src/data/raceMechanics.js` (lines 88–113): "range: [1, 2]" gives Agility/Intelligence buffs; "range: [3, 4]" gives thread/social effects; "range: [5, 6]" is "Fading Begins"
  - Source B: same file (line 84): "Honor 10 consecutive contracts without breach (recovery)"; A's effect expires "until_contract_resolved" at `neth.js:107`.
- **Contradiction Breakdown:** Three breaches cannot simultaneously begin Fading under A and only begin the earlier Thinning band under B. The early effects and recovery conditions are also materially different. No rule labels one a summary of the other.
- **Clarification Question for Creator:** Which Fraying track, threshold and recovery mechanism governs play?
- **Possible Paths:**
  - Path A: Adopt the racial three-breach rule; align the escalation definition.
  - Path B: Adopt the ten-step escalation; align racial trait copy/data.
  - Path C: Define separate counters and their exact interaction.

### ISSUE-023: Astril automatically know an undefined “Lumian” tongue
- **Category:** Background/Language
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/astril.js` (line 65): "languages: ['Common', 'Lumian']"
  - Source B: `vtt-react/src/data/languages.js` (lines 132–134): "The Astril people have no dedicated language id of their own." / "No Astril-specific language is defined."
- **Contradiction Breakdown:** The race grants a named tongue without a language-catalogue definition; the catalogue explicitly denies one and instead identifies Synod-Speak, Celestial and Ethereal. This is both a direct registry-policy mismatch and a dangling granted language, not evidence that Lumia itself lacks lore.
- **Clarification Question for Creator:** Is Lumian a separate language, or should Astril inherit one or more existing tongues?
- **Possible Paths:**
  - Path A: Retain Lumian; define/register it and revise the catalogue note.
  - Path B: Retain the existing catalogue model; revise Astril grants.
  - Path C: Specify a precise alias/dialect mapping.

### ISSUE-024: World-builder canonical tongues have no character-language catalogue mapping
- **Category:** Background/Language
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/seedLanguages.js` (lines 4–7): "Canon tongues and writing systems for the World > Tongues & Scripts tab."
  - Source A: same file (lines 13, 31, 49, 67, 85, 103, 121, 139, 157): Gjaldmál, Dauðrsöngr, Vent-Cant, Shard-Whisper, Vale-Ink, Current-Cant, Crown-Whisper, Vigil-Cant, Kessen-Weave.
  - Source B: `vtt-react/src/components/character-creation-wizard/steps/Step7SkillsLanguages.jsx` (lines 11, 78–79): "import { LANGUAGES } from '../../../data/languages';" / "const COMMON_LANGUAGES = LANGUAGES;"
- **Contradiction Breakdown:** Source A defines backstories and families, so these are not loreless languages. The gap is that the separate `LANGUAGES` catalogue has none of these nine names and no dialect/fluency mapping; creation and world-building expose different canon inventories. Whether a register requires separate proficiency is unspecified.
- **Clarification Question for Creator:** Do these nine tongues require separate proficiency, or are they dialects/scripts automatically covered by existing tongues?
- **Possible Paths:**
  - Path A: Make separate proficiencies; register them in the player catalogue.
  - Path B: Treat them as registers/scripts; document mappings in both catalogues.
  - Path C: Supply per-tongue acquisition and comprehension rules.

### ISSUE-025: Creation promises racial languages but drops base-race grants for many subraces
- **Category:** Background/Language
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/components/rules/LanguagesDisplay.jsx` (line 71): "Your race speaks first" / "granted automatically and always legible on your sheet."
  - Source A: `vtt-react/src/data/raceData.js` (line 199): "languages: subrace.languages || race.baseTraits?.languages || ['Common']"
  - Source B: `vtt-react/src/components/character-creation-wizard/steps/Step7SkillsLanguages.jsx` (line 115): "const racialLanguages = React.useMemo(() => subraceData?.languages || [], [subraceData]);"
  - Source B: same file (lines 136–137): "const allLanguages = [...new Set([...racialLanguages, ...selectedLanguages])];" / "setLanguages(allLanguages)"
- **Contradiction Breakdown:** The wizard step does not use the defined race fallback, despite loading `raceData`. Groven, Florae, Fexric and Astril rely on base-race language declarations; Human Tessen/Merryn also lack subrace declarations. Their ancestry grants are therefore omitted from this step's grant/dispatch logic. This is a static source finding, not a browser-observed saved-character outcome.
- **Clarification Question for Creator:** Should every subrace inherit base-race tongues unless it explicitly overrides them?
- **Possible Paths:**
  - Path A: Adopt automatic inheritance; align wizard grant logic with the race rule.
  - Path B: Adopt subrace-only grants; revise base declarations and player guidance.
  - Path C: Define explicit per-subrace inheritance.

### ISSUE-026: Secret tongues require initiation, but creation offers them as unrestricted learned choices
- **Category:** Background/Language
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/components/rules/LanguagesDisplay.jsx` (line 73): "Secret & exotic tongues" / "demand a teacher, an oath, or a debt — they are never free."
  - Source A: `vtt-react/src/data/languages.js` (line 175): Druidic is "forbidden to non-druids by ancient oath" and "Cannot be learned from books."
  - Source B: `vtt-react/src/components/character-creation-wizard/steps/Step7SkillsLanguages.jsx` (lines 198–204, 240–242): the toggle and disabled check use only already-granted tongues and `languageCount`, with no class, initiation or language-category condition.
- **Contradiction Breakdown:** The selection rules allow any ungranted tongue from the catalogue within a background allowance, whereas the rulebook says category-specific conditions apply. A backstory teacher could satisfy them, but no acquisition field or requirement establishes that in this flow.
- **Clarification Question for Creator:** Does a background language allowance automatically include the necessary initiation, or should forbidden/secret tongues be gated?
- **Possible Paths:**
  - Path A: Adopt initiation restrictions; represent/check them in creation.
  - Path B: Adopt freely selectable background tongues; revise the acquisition law.
  - Path C: Define exact background/teacher/oath exceptions.

### ISSUE-027: The Sundrift sky has no stars, while its Astril rituals and observatory use visible constellations
- **Category:** World History/Laws
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/public/data/rules.json` (line 192): "No stars. No constellations. No navigable heavens."
  - Source B: `vtt-react/src/data/races/astril.js` (line 49): "By night they gather in their moon-courtyards and read the stars" / "which phase of which constellation permits which step of the rite."
  - Source B: `vtt-react/src/data/classes/arcanoneerData.js` (line 260): "A wind-scoured observatory on the Sundrift Vale" / "the stars are the record"
- **Contradiction Breakdown:** Present-day local ritual and training depend on celestial features the same region's geography explicitly removes. Historical charts, inherited perception or restored stars could be distinctions, but none is specified for these present-tense activities.
- **Clarification Question for Creator:** What do present-day Astril actually observe above Sundrift, and where can constellations be seen?
- **Possible Paths:**
  - Path A: Adopt the starless sky; revise observation/ritual descriptions.
  - Path B: Adopt visible stars; revise the region's absolute absence.
  - Path C: Define a precise visibility/perception rule.

### ISSUE-028: An all-knowing predator fails to know the surviving seal
- **Category:** World History/Laws
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/astril.js` (line 53): "Keth Amar is all-knowing"
  - Source B: `docs/CORE_LORE_FRAMEWORK.md` (lines 93–99): "Believing all lineage oaths were severed" / "A single, hidden family" / "the surviving secret seal held."
- **Contradiction Breakdown:** Literal omniscience excludes a mistaken belief about the seal's existence, a load-bearing cause of the Blind Strike's failure. `astril.js:37` gives “or near enough” in a different paragraph, but line 53 states omniscience without that qualification.
- **Clarification Question for Creator:** Is Keth Amar literally omniscient, or merely perceived that way by the Astril?
- **Possible Paths:**
  - Path A: Retain literal omniscience; revise the hidden-seal explanation.
  - Path B: Retain the predator's ignorance; revise absolute omniscience claims.
  - Path C: Define exact knowledge limits and whose belief each account expresses.

### ISSUE-029: Great-Grove is exclusively ground-level or a high canopy city
- **Category:** Race/Species
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/florae.js` (line 50): "they live exclusively on the forest ground floor"
  - Source A: `docs/subrace_lore_compendium/05_florae_locations_and_figures.md` (line 20): "built strictly on the forest ground floor" / "strictly no treetop living"
  - Source B: `docs/subrace_capitals_and_shared_settlements.md` (line 331): "standing on a high hollowed bough" / "The awe-inspiring canopy city of Great-Grove"
- **Contradiction Breakdown:** The same Oken capital is placed high in a canopy contrary to explicit ground-floor exclusivity. The conflicting guide is not labelled as an earlier rejected version.
- **Clarification Question for Creator:** Is Oken habitation strictly ground-level, including Great-Grove?
- **Possible Paths:**
  - Path A: Adopt ground-level habitation; revise the canopy capital prompt/index.
  - Path B: Adopt canopy habitation; revise race and compendium prohibitions.
  - Path C: Define allowed elevated structures versus living quarters.

### ISSUE-030: Caustic Fexric claim no capital, but receive a sovereign capital
- **Category:** Race/Species
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/fexrick.js` (line 58): "a Caustic Fexric speaks seven regional dialects and claims no capital."
  - Source B: `docs/subrace_capitals_and_shared_settlements.md` (line 303): "The Sovereign Capital — Slag-Deep (The Sump-Foundry)"
  - `docs/MASTER_SUBRACE_LOCATIONS_AND_FIGURES.md:71` also assigns Slag-Deep as the sovereign capital.
- **Contradiction Breakdown:** A categorically rejects a claimed capital; B explicitly supplies one. A common gathering site would be compatible, but B calls it sovereign, and no political exception is defined.
- **Clarification Question for Creator:** Is Slag-Deep a Caustic capital, or a non-sovereign common workshop/market?
- **Possible Paths:**
  - Path A: Adopt capital-less nomads; revise sovereign labels.
  - Path B: Adopt a sovereign capital; revise diaspora/political identity.
  - Path C: Define the settlement's precise jurisdiction and claimed status.

### ISSUE-031: Sealed Tessen who have never met Fexric routinely work in mixed outposts
- **Category:** Race/Species
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/human.js` (line 39): "They depend entirely on Fexric geothermal pipes purchased through intermediaries they have never met." / "The Tessen do not know what the Fexric look like."
  - Source A: same file (line 133): "a gate that has not been opened from the outside in four hundred years."
  - Source B: `docs/subrace_capitals_and_shared_settlements.md` (lines 174–176): "Clockwork Fexric and Ithran Groven" co-inhabit the station; "Tessen engineers construct the monumental stone foundations and manage geothermal steam boilers; Clockwork Fexric install precision gearboxes"
- **Contradiction Breakdown:** The shared-settlement model establishes direct daily cooperation and population outside the sealed keep, against the general never-met/never-seen claims. Rare Tessen envoys are separately acknowledged in regional documents, but no diaspora exception scopes A's categorical statements.
- **Clarification Question for Creator:** How absolute is Tessen isolation, and can a known diaspora directly work with Fexric?
- **Possible Paths:**
  - Path A: Adopt total isolation; revise shared-settlement inhabitants.
  - Path B: Adopt mixed Tessen outposts; revise universal isolation claims.
  - Path C: Define which Tessen populations remain sealed and which do not.

### ISSUE-032: Salt-Hinge changes from an estuary stilt settlement into a limestone fortress
- **Category:** World History/Laws
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/myrathil.js` (line 150): "Salt-Hinge is built on stilts over a tidal estuary, half submerged, half above water"
  - Source B: `docs/subrace_capitals_and_shared_settlements.md` (lines 74–75): "Monolithic coastal limestone cliffs overlooking crashing oceanic breakers." / "Monumental white calcified stone sea-walls"
- **Contradiction Breakdown:** The art guide and ancestry present competing principal geographic/construction identities for the same settlement. Both could be parts of an expanded port, but neither source defines that expansion or division; this is a localized continuity mismatch rather than proof that stilts and cliffs can never coexist.
- **Clarification Question for Creator:** What is Salt-Hinge's canonical physical layout and construction history?
- **Possible Paths:**
  - Path A: Adopt the estuary stilt layout; align the art guide.
  - Path B: Adopt the cliff-fortress layout; align ancestry geography.
  - Path C: Supply a documented map/layout joining distinct parts.

### ISSUE-033: Ithra-Mal's pronouns and specified figure gender disagree
- **Category:** Race/Species
- **Severity:** Minor
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/groven.js` (line 87): "Her voice is the voice of the bridge, when she sets a toll, it is binding."
  - Source B: `docs/subrace_lore_compendium/06_groven_locations_and_figures.md` (lines 104–106): "He personally engineered" / "Legendary Male Ithran Groven Warlord, Ithra-Mal"
- **Contradiction Breakdown:** The same full named figure and title use incompatible unqualified identity specifications. The sources define no identity transition or intentional pronoun variation.
- **Clarification Question for Creator:** What gender and pronouns should all Ithra-Mal references use?
- **Possible Paths:**
  - Path A: Adopt the race biography's specification; revise art copy.
  - Path B: Adopt the art specification; revise the race biography.
  - Path C: Supply an explicit identity/pronoun convention.

### ISSUE-034: Geth-Run is an excluded solitary exile or a respected travelling mediator
- **Category:** Race/Species
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/groven.js` (line 103): "answers the questions but never descends to the warrens or the bridge-towns."
  - Source B: `docs/subrace_lore_compendium/06_groven_locations_and_figures.md` (lines 109–110): "Geth-Run, the Murmur-Blooded" / "He travels continuously between the deep quarries and the high bridges, settling disputes between the clans."
- **Contradiction Breakdown:** The current biography's explicit never-descends condition conflicts with continual civic mediation between the settlements. A later reconciliation is possible but is not written anywhere in these accounts.
- **Clarification Question for Creator:** Is Geth-Run still a solitary exile, or now an accepted mediator among the clans?
- **Possible Paths:**
  - Path A: Adopt the exile; revise civic-travel biography.
  - Path B: Adopt the mediator; revise rejection and never-descends claims.
  - Path C: Supply a defined historical transition.

### ISSUE-035: Clean Vreken immunity is inherited biological luck or an achieved purification
- **Category:** Race/Species
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/vreken.js` (lines 293–295): "not morally superior, merely less entangled in Morvane's wound, carrying a strain that does not intoxicate."
  - Source A: same file (line 201): "Isara was born nine generations after Aedris over-lit, into a Clean bloodline that had never produced a single case of the hush."
  - Source B: `docs/subrace_lore_compendium/09_vreken_locations_and_figures.md` (line 42): "she purified the parasitic blight from her own bloodstream, founding the Clean covenant"
  - Source B: same file (line 12) says Clean have purified their mycelium through sacred singing and spring water.
- **Contradiction Breakdown:** A makes Isara born into an already-Clean lineage and explicitly rejects virtue as the cause; B makes her purification the founding cause of Clean status. This changes whether character ancestry is hereditary, curable or an earned covenant.
- **Clarification Question for Creator:** Can Marked become Clean by purification, and did Isara found Clean status or justify its existing hierarchy?
- **Possible Paths:**
  - Path A: Adopt inherited strains; revise purification/founding claims.
  - Path B: Adopt achieved purification; revise racial biology and Isara's history.
  - Path C: Define biological strain versus religious covenant explicitly.

### ISSUE-036: Aedris the First-Lit is a dying female Veil-Speaker or a male sovereign warlord
- **Category:** Race/Species
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/vreken.js` (lines 176–177): "Aedris was a Marked Veil-Speaker of extraordinary devotion" / "For forty years she served as the crypt-speaker of the Sunken Spire"
  - Source A: same file (lines 180–181): "Aedris lived for another eleven years before the hush completed its hollowing."
  - Source B: `docs/subrace_lore_compendium/09_vreken_locations_and_figures.md` (lines 103–106): "Sovereign Blight-Lord" / "Legendary founder of Mirehollow" / "Legendary Male Marked Vreken Warlord, Aedris the First-Lit"
- **Contradiction Breakdown:** Name and epithet match, but gender, role, defining catastrophe and civic legacy do not. The art biography replaces the first Over-Lit warning figure with a settlement-founding martial sovereign, without defining a separate namesake.
- **Clarification Question for Creator:** Which Aedris identity and fate are canonical?
- **Possible Paths:**
  - Path A: Adopt the female Veil-Speaker; revise the art biography.
  - Path B: Adopt the male Blight-Lord; revise race history and epidemic founding.
  - Path C: Define separate named figures and non-confusable identifiers.

### ISSUE-037: Solari are flesh-bodied, dark-eyed nomads or living lava-rock beings
- **Category:** Race/Species
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/solari.js` (line 8): "warm, earthy dark brown-beige" skin / "eyes are enormous and solid black, absorbing light rather than reflecting it"
  - Source A: same file (line 13): "not a metabolic dependence on forge-flame."
  - Source B: `docs/subrace_lore_compendium/10_solari_locations_and_figures.md` (line 12): "Deep charcoal-and-basalt rock-textured skin with incandescent volcanic lava fissures" / "Glowing hot-coal amber or fiery orange eyes"
  - Source B: same file (lines 34, 74) describes replenishing internal cores and Waste-Solari obsidian skin, crimson eyes and smoking vent-horns.
- **Contradiction Breakdown:** These are incompatible canonical anatomical locks, with distinct implied thermal biology. The newer source does not present lava-rock forms as Pyrofiend transformations or other defined class-specific states.
- **Clarification Question for Creator:** Which body, eyes and thermal physiology define ordinary Hollow/Waste-Solari?
- **Possible Paths:**
  - Path A: Adopt ash-dusted flesh and black eyes; revise art/metabolic specifications.
  - Path B: Adopt lava-rock physiology; revise ancestry and associated traits.
  - Path C: Supply explicit subrace/class/state distinctions.

### ISSUE-038: Thaeron has tended for sixty years or for three hundred, beyond the stated lifespan
- **Category:** Race/Species
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/solari.js` (line 78): Thaeron's biography states he has tended "for sixty years."
  - Source A: same file (line 48): "lifespan: '90-130 years'"
  - Source B: `docs/subrace_lore_compendium/10_solari_locations_and_figures.md` (line 42): "He has guarded the Primordial Hearth for three hundred years"
- **Contradiction Breakdown:** The same named contemporary figure receives different service durations, and B's minimum age exceeds the ordinary biological range by more than a century. No longevity exception is supplied. The duration collision also accompanies promotion from Sun-Speaker to supreme sovereign.
- **Clarification Question for Creator:** What are Thaeron's age, tenure, role and any actual longevity exception?
- **Possible Paths:**
  - Path A: Adopt sixty-year service and ordinary lifespan; revise the art biography.
  - Path B: Adopt three-hundred-year service; establish/revise lifespan rules and biography.
  - Path C: Supply the exact age/tenure exception.

### ISSUE-039: The “all playable classes” heritage taxonomy leaves five classes unassigned
- **Category:** Class Lore
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `docs/CORE_LORE_FRAMEWORK.md` (line 232): "All 20+ playable classes fall into five distinct metaphysical heritages"
  - Source B: `vtt-react/src/data/classes/index.js` (lines 51–72) includes "Animist: ANIMIST_DATA", "Augur: AUGUR_DATA", "Inquisitor: INQUISITOR_DATA", "Lunarch: LUNARCH_DATA", and '"False Prophet": FALSE_PROPHET_DATA'.
- **Contradiction Breakdown:** Those five registered base classes are absent from the heritage table at core lines 234–240. They have extensive lore elsewhere; the dangling reference is the missing taxonomy assignment, not an absence of class backstory. “Blight-Weaving Orders” does not explicitly assign any of them.
- **Clarification Question for Creator:** Which heritage or heritages govern Animist, Augur, Inquisitor, Lunarch and False Prophet?
- **Possible Paths:**
  - Path A: Keep an exhaustive five-heritage model; supply all missing assignments.
  - Path B: Make the table explicitly partial or revise the model.
  - Path C: Supply multi-heritage rules and per-class classifications.

### ISSUE-040: Arcanoneer is Nethien-only and incapable of improvisation, or a four-tradition adaptive class
- **Category:** Class Lore
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/public/data/lore.json` (line 1656): "Only the Nethien carry the contract-locked neurology that can submit a clause without breaching."
  - Source A: same file (line 1662): "An Arcanoneer cannot improvise. Every spell must be prepared, structured, and filed before it can be cast."
  - Source B: `vtt-react/src/data/classes/arcanoneerData.js` (lines 10–14, 169): allowed Nethien, two Fexric bloodlines and Stargazer Astril; "you combine raw elemental spheres to create devastating compound spellcraft on the fly."
  - Source B: same file (lines 102–105) explicitly gives Caustic improvisation and non-standard weaves.
- **Contradiction Breakdown:** Nethien contract restrictions are applied to the class universally in the lexicon despite independently described engineering/astronomical traditions and adaptive mechanics. Lore statements cannot simultaneously exclude all non-Nethien and register them as normal class variants.
- **Clarification Question for Creator:** Are contract-syntax and no-improvisation Nethien-specific, or class-wide restrictions?
- **Possible Paths:**
  - Path A: Adopt exclusive prepared Nethien Arcanoneers; revise allowed variants and adaptive class copy.
  - Path B: Adopt four traditions; scope lexicon statements to the Nethien tradition.
  - Path C: Define per-tradition capabilities and resource/backlash rules.

### ISSUE-041: Waste-Solari are an allowed Apex lineage and simultaneously hard-blocked
- **Category:** Class Lore
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/classes/apexData.js` (lines 11–19, 28): the allowed list includes "thrask_solari"; justification describes "Waste-Solari Ash-Rangers" as trackers.
  - Source B: same file (lines 21–25): "hardBlocks" includes "solari".
  - Source B: `vtt-react/src/utils/pointBuySystem.js` (lines 333–336): "Hard blocks always trump" / "if (hardBlocks.includes(raceId)) return false;"
- **Contradiction Breakdown:** Under the documented compatibility function, every Solari—including the listed Waste-Solari—is incompatible before its subrace allowance can be considered. The UI can offer a narrative justification for incompatible classes, but that does not make this listed native culture compatible or award its compatibility bonus.
- **Clarification Question for Creator:** Are Waste-Solari ordinary compatible Apex, or explicitly off-list narrative exceptions?
- **Possible Paths:**
  - Path A: Adopt the Waste-Solari allowance; revise the conflicting race-level block.
  - Path B: Adopt the Solari prohibition; revise allowance and cultural justification.
  - Path C: Define subrace-versus-race block precedence explicitly.

### ISSUE-042: Race-recommended classes are not normal compatible choices
- **Category:** Class Lore
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/astril.js` (line 60): "Brutish Astril favor Wardens, Apex, and Animists"
  - Source B: `vtt-react/src/data/classes/wardenData.js` (lines 20–24): the hard-block list includes "astril"; `apexData.js:11–19` admits Stargazer (`vashir_astril`), not Brutish (`silath_astril`).
  - Additional A: `races/human.js:54–58` calls Thalren Wardens an established garrison tradition and recommends Spellguard/Warden to Tessen; `races/florae.js:55` recommends Wardens. The normal Warden allowance at `wardenData.js:11–18` contains none of these.
- **Contradiction Breakdown:** Culture descriptions tell players these paths are favored/native, while normal compatibility does not recognize them, and an entire named race is hard-blocked. This is not a claim that the UI can never select them: `Step1CoreDraft.jsx:1183–1187` routes incompatible choices to justification. The inconsistency is whether a favored path is native or exceptional.
- **Clarification Question for Creator:** Which race-class recommendations are ordinary cultural paths, and which require exceptional access?
- **Possible Paths:**
  - Path A: Adopt the race recommendations; align native class eligibility/variants.
  - Path B: Adopt current normal eligibility; revise favored/native recommendations.
  - Path C: Supply an explicit native-versus-exception matrix.

### ISSUE-043: Class portraits depict excluded lineages and use retired display identities
- **Category:** Class Lore
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/classes/arcanoneerData.js` (lines 25–30): Withered (`drun_neth`) are hard-blocked and "excluded for now"; `narrativeUnlock` is false.
  - Source B: `vtt-react/src/components/rules/ClassDetailDisplay.jsx` (line 740): "A Withered Arcanoneer venting green acid and steam through gnarled oak pipes in a peat bog."
  - Further B: same file (lines 751, 755, 780, 800–807, 815–837) retains Mistwoven, Maskborne, Trueborn, Brook, Deepborn and excluded combinations such as Waste-Solari/Ordan Wardens.
- **Contradiction Breakdown:** The class's illustration catalogue presents an explicitly excluded lineage as an example of the class. Other captions preserve retired caste labels or undocumented exceptions. This is hardcoded player-facing identity copy, not merely an old filename or internal ID.
- **Clarification Question for Creator:** Should any portraits represent exceptional/nonplayable historical figures, or must all depict current compatible lineages?
- **Possible Paths:**
  - Path A: Adopt class eligibility/current names; revise contradictory captions/catalogue.
  - Path B: Adopt the depicted variants; revise eligibility and supporting lore.
  - Path C: Define and label each intentional historical/exceptional depiction.

### ISSUE-044: Frost-Tithe is a birth-debt or an annual tribute of lives and resources
- **Category:** Background/Language
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `docs/GM_WORLD_GUIDE.md` (line 131): "Keth Amar's birth-debt on Rime-Born mothers, draining their warmth to collect the bargain's interest."
  - Source B: `vtt-react/src/data/backgroundData.js` (line 301): "The Frost-Tithe, a yearly tribute of lives and resources to the encroaching cold"
- **Contradiction Breakdown:** The same proper noun names two different collection triggers, payers and costs. Ordinary resource taxation and childbirth harm could both occur, but the text supplies no distinction between them. Removal of fixed maternal mortality quotas does not resolve this semantic mismatch.
- **Clarification Question for Creator:** Does Frost-Tithe mean childbirth warmth-debt, annual tribute, or both under separately defined terms?
- **Possible Paths:**
  - Path A: Adopt birth-debt meaning; revise Veteran background.
  - Path B: Adopt annual tribute meaning; revise GM and birth-lore definitions.
  - Path C: Define separate meanings and unambiguous names/contexts.

### ISSUE-045: The player rulebook alternates between twenty and thirty classes, while the registry has twenty-one base classes
- **Category:** Class Lore
- **Severity:** Minor
- **Colliding Sources:**
  - Source A: `vtt-react/public/data/rules.json` (line 1035): "Mythrill features **20 unique classes**"
  - Source B: same file (line 2187): "Thirty classes is a lot."
  - Source C: `vtt-react/src/data/classes/index.js` (lines 51–75): 21 base class entries plus three named Deepling cultural variants; Crusader is included.
- **Contradiction Breakdown:** The two player census statements disagree with one another and with the base-class registry. Cultural variants, specialization names and base classes need distinct counting rules.
- **Clarification Question for Creator:** What number should player-facing “classes” count, and are cultural variants included?
- **Possible Paths:**
  - Path A: Adopt twenty; reconcile the registry and thirty-class copy.
  - Path B: Adopt the current twenty-one base classes; align census text.
  - Path C: Define and display separate base-class/variant counts.

### ISSUE-046: Skraik means both an ice-dragon and a drowned undead sailor
- **Category:** World History/Laws
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `SEVEN_CONTINENTS_MASTER_REFERENCE.md` (line 105): "Glacier Wyrm / **Skreika** (ice-dragon)"
  - Source B: `vtt-react/public/data/lore.json` (lines 5970–5974): "Skraik" / "A waterlogged, blue-skinned undead sailor that rises from freezing fjords to spread frost-fever."
  - Master reference line 117 separately uses "Skrei" for drowned Skald; GM guide line 161 instead assigns that drowned-warrior role to Skraik.
- **Contradiction Breakdown:** The creature name collides across different species, creature types and encounter expectations. No authorized homonym or Skrei/Skreika distinction is defined consistently.
- **Clarification Question for Creator:** Which creature is Skraik, and is Skrei a separate species or a spelling drift?
- **Possible Paths:**
  - Path A: Adopt ice-dragon Skraik; revise undead names/definitions.
  - Path B: Adopt undead Skraik; revise the master-reference dragon label and Skrei usage.
  - Path C: Define two distinct names and creature identities.

### ISSUE-047: Exact chronology remains in sources labelled era-relative
- **Category:** World History/Laws
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `LORE_STYLE_GUIDE.md` (line 184): "**Exact years go nowhere.**"
  - Source B: `docs/CORE_LORE_FRAMEWORK.md` (lines 84, 104): "The Whispered Purge (Years 300 – 325)" / "The Freezing Era (Years 325 – 475 / Present Day)"
  - Additional B: `rules.json:24` says "150th year of the Freezing Era"; `races/groven.js:65` has "Years 210-340, Freezing Era"; `arcanoneerData.js:161` has "Toll Wars (Years 280-340)"; `lore.json:6480` has "Years 300-325".
- **Contradiction Breakdown:** These are current prose/display content, not hidden sort keys. They violate the explicit era-relative convention and retain multiple numeric frameworks. The Toll War ranges also differ; their relationship needs creator confirmation rather than silent rescaling.
- **Clarification Question for Creator:** Should exact dates be removed from current lore, and which underlying event ordering/duration should be retained?
- **Possible Paths:**
  - Path A: Adopt the no-exact-years rule; revise live prose while preserving approved chronology.
  - Path B: Permit exact years; revise the style/source notices and reconcile date systems.
  - Path C: Specify allowed date contexts and an authoritative chronology map.

### ISSUE-048: Thalren is a people, but equipment calls its House “Thalren”
- **Category:** Race/Species
- **Severity:** Minor
- **Colliding Sources:**
  - Source A: `LORE_STYLE_GUIDE.md` (line 662): "Thalreth | Frostwood Reach | Kaelen Thalreth"
  - Source B: `vtt-react/src/data/equipment/raceEquipment.js` (line 18): "standard issue for the lineage-keeps of House Thalren."
- **Contradiction Breakdown:** The ancestry/culture label replaces the established house surname in a gear origin. No House Thalren is separately defined in the current house census.
- **Clarification Question for Creator:** Is House Thalren an intended distinct house, or should the equipment refer to House Thalreth?
- **Possible Paths:**
  - Path A: Adopt Thalreth; correct the gear origin label.
  - Path B: Establish House Thalren; revise/extend house definitions.
  - Path C: Define a deliberate alternate-name convention.

### ISSUE-049: Atropolis bloodline governance uses Frostwood's Sovereign Ledger name
- **Category:** World History/Laws
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/backgroundData.js` (line 353): "Regent Morrath's Great Registry (a total debt-and-citizenship registry)"
  - Source A: `vtt-react/public/data/rules.json` (line 664): Sovereign Ledger is "a centralized registry" sealed at "Greymark Keep" in Frostwood Reach.
  - Source B: `vtt-react/src/data/races/neth.js` (line 49): "They inhabit Atropolis canopy spires in ghost-silk robes, governing the Sovereign Ledger."
- **Contradiction Breakdown:** The new bloodline description assigns Atropolis nobles governance of a separately located Thalreth institution, rather than their defined Great Registry. Cross-regional authority could be intentional, but it is not established here.
- **Clarification Question for Creator:** Do Atropolis Nethien govern Greymark's Sovereign Ledger, or is this a registry-name substitution?
- **Possible Paths:**
  - Path A: Adopt separate regional registries; align the bloodline description.
  - Path B: Adopt Nethien cross-regional governance; revise political relationships explicitly.
  - Path C: Define the exact institutional relationship and jurisdiction.

### ISSUE-050: Acolyte/Hollow Sight is promised as playable but has no defined creation origin/grant
- **Category:** Background/Language
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `docs/CORE_LORE_FRAMEWORK.md` (lines 128–131): "Playable Origin (the Hollow Sight)" / "Players can carry this **Hollow Sight**"
  - Source A: same file (lines 322–323): "7TH HOUSE ACOLYTES (Playable)"
  - Source B: `vtt-react/src/data/raceData.js` (lines 26–36) enumerates ten canonical races; `backgroundData.js` (lines 45–1190) defines the 25 current background records, with no Acolyte/Hollow Sight origin or graft grant. `Step1CoreDraft.jsx:22` imports that `BACKGROUND_DATA` for selection.
- **Contradiction Breakdown:** This is a reverse dangling playable promise: the world lore defines the cult and power, but the canonical ancestry/background creation catalogues do not define its promised origin or mechanical acquisition. A manually written custom character is not evidence of an implemented canonical grant.
- **Clarification Question for Creator:** What creation option or explicit acquisition rule should make Hollow Sight playable?
- **Possible Paths:**
  - Path A: Keep the playable promise; define its origin and graft mechanics/selection route.
  - Path B: Treat it as GM-assigned world lore only; revise the creation promise.
  - Path C: Supply an explicit custom-origin acquisition procedure.

### ISSUE-051: Hardcoded class organizations and named leaders exist only in a UI fallback
- **Category:** Class Lore
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `vtt-react/src/components/world/ClassLoreDetail.jsx` (lines 102–117, 123–136): "The Order of the Iron Martyr", "High Prelate Theresa Solvan", "Brother Kenneth the Shield-Bearer", "The Silver Brand Inquisitorial Synod", "Inquisitor Daniel the Stern", "Elder Cassandra", "The Timewatch Convent".
  - Source B: `vtt-react/src/data/classes/arcanoneerData.js` (lines 141–146) defines "Ledger-Prime Vel-Otharen" and the Heart-Vault as a structured order/leader model; the fallback instead labels him "Jarl-Archivist Vel-Otharen" at `ClassLoreDetail.jsx:68`.
  - Absence evidence: exact-name searches for Theresa Solvan, Timewatch Convent, Silver Brand Inquisitorial Synod, Brother Kenneth, Fex-Krohn, Elder Cassandra and Inquisitor Daniel found only their seven occurrences in this UI file, with no matches in authored `docs` or `public/data`, or other `src` definitions.
- **Contradiction Breakdown:** The fallback introduces orders/leaders with no independently registered history, founder relationships or faction definitions. Its re-title of a defined leader is additional terminology drift. A fallback appearing conditionally does not make its embedded claims canonical.
- **Clarification Question for Creator:** Are these fallback organizations canon, provisional placeholders, or replacements for established living orders?
- **Possible Paths:**
  - Path A: Adopt the fallback entities; define/register their histories and relationships.
  - Path B: Adopt structured living orders; replace unsupported fallback claims.
  - Path C: Specify which fallback entities are canon and the exact mappings.

### ISSUE-052: Florae are recommended to play “Mages,” but no base class has that name
- **Category:** Class Lore
- **Severity:** Minor
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/florae.js` (line 55): "Florae make outstanding Animists, Apex trackers, Wardens, and Mages"
  - Source B: `vtt-react/src/data/classes/index.js` (lines 51–75) registers the playable classes, with no Mage/Mages entry.
- **Contradiction Breakdown:** Animist, Apex and Warden are class names in a field called classCompatibility; Mages is not. Generic “mage” elsewhere is not automatically an error, but this selection-oriented list leaves the recommended mechanical path unmapped.
- **Clarification Question for Creator:** Is Mages a generic category here, and if so which compatible classes does it mean?
- **Possible Paths:**
  - Path A: Define Mages as an explicit category and map its members.
  - Path B: Use the intended registered class name(s) in the recommendation.
  - Path C: Supply a new class only if the creator actually intends one.

### ISSUE-053: Spectral Sight is labelled “At Will” and limited to once per short rest
- **Category:** Mechanics
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/backgroundAbilities.js` (lines 164–166): "name: 'Spectral Sight'" / "usage: 'At Will'"
  - Source B: same file (line 168): "Once used, you must finish a short rest before using this ability again."
- **Contradiction Breakdown:** These describe the same Hush Survivor ability. An at-will use label and a mandatory rest recharge are incompatible availability rules, affecting what the player is told the background can do.
- **Clarification Question for Creator:** Is Spectral Sight at will or once per short rest?
- **Possible Paths:**
  - Path A: Adopt at-will use; revise the rest requirement.
  - Path B: Adopt rest-limited use; revise usage label and related summaries.
  - Path C: Define separate modes with explicit costs and limits.

### ISSUE-054: The Shyr's toll monopoly belongs to Hollow-Solari or Waste-Solari
- **Category:** World History/Laws
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/backgroundData.js` (line 116): "the Sulfur Cartel (the Hollow-Solari monopoly that controls it) taxes every mile."
  - Source B: `vtt-react/public/data/rules.json` (line 408): "The Shyr (the basalt trade route) is controlled by the Waste-Solari, who demand heavy tolls."
- **Contradiction Breakdown:** Background origin and GM adventure guidance assign route control to opposing subraces. Different checkpoints or delegated collection could coexist, but neither account identifies divided control or delegation.
- **Clarification Question for Creator:** Who controls the Shyr's tolls: the Hollow cartel, Waste-Solari stations, or a defined split?
- **Possible Paths:**
  - Path A: Adopt Hollow cartel control; revise adventure guidance.
  - Path B: Adopt Waste-Solari control; revise Courier origin and cartel jurisdiction.
  - Path C: Define an exact route/checkpoint authority map.

### ISSUE-055: Who entombed Sol: Aex or House Solvan?
- **Category:** World History/Laws
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `docs/CORE_LORE_FRAMEWORK.md` (lines 53–55): "**Aex (The Mother)** sacrificed her divine form to **entomb and protect Sol within the molten core**"
  - Source B: `vtt-react/src/components/rules/ClassOriginsDisplay.jsx` (line 19): "House Solvan entombed Sol beneath the crust to save it from Keth Amar, trading their firstborn heirs for geothermal heat."
- **Contradiction Breakdown:** The hardcoded class-origin card changes both the actor and transaction: Aex's protective sacrifice/lineage wards become House Solvan's firstborn-for-heat bargain. Participation in anchoring rites is described elsewhere, but it is not the same claim as doing the entombment or paying this specific price.
- **Clarification Question for Creator:** What exact role and price did House Solvan have in Sol's entombment?
- **Possible Paths:**
  - Path A: Adopt Aex as the entombing actor; distinguish and align Solvan's actual contribution.
  - Path B: Adopt the Solvan account; revise core actors and pact costs.
  - Path C: Define the precise participants, actions and exchanges.

### ISSUE-056: Orven the Still-Handed changes from Marked founder to Clean guardian
- **Category:** Race/Species
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/vreken.js` (line 189): "Orven was a Marked Vreken whose twin sister, Seris, over-lit"
  - Source A: same file (line 193): "He is not confirmed dead. The Inquisitors wait for word that may never come."
  - Source B: `docs/subrace_lore_compendium/09_vreken_locations_and_figures.md` (lines 47–50): "Orven the Still-Handed (The First Inquisitor)" / "Legendary Male Clean Vreken Inquisitor, Orven the Still-Handed"
- **Contradiction Breakdown:** The exact named founder switches hereditary strain and current disposition from missing deep-grove seeker to active capital gatekeeper. No return or Marked-to-Clean transition is documented; assuming one would invent a major rule also implicated in ISSUE-035.
- **Clarification Question for Creator:** Is Orven Marked and missing, or Clean and guarding Spore-Sanctum?
- **Possible Paths:**
  - Path A: Adopt the Marked founder/missing state; revise art biography.
  - Path B: Adopt the Clean guardian; revise founder history and strain rules.
  - Path C: Supply a canonical transition with explicit dates/era and mechanism.

### ISSUE-057: The world's name loses an “l” in a class's geographic lore
- **Category:** World History/Laws
- **Severity:** Minor
- **Colliding Sources:**
  - Source A: `docs/CORE_LORE_FRAMEWORK.md` (line 1): "CORE LORE FRAMEWORK — MYTHRILL VTT"
  - Source B: `vtt-react/src/data/classes/minstrelData.js` (line 85): "The Thaw-Run is the longest continuous river on Mythril"
- **Contradiction Breakdown:** The same world has a spelling drift in player-facing class lore. No alternate world name is defined.
- **Clarification Question for Creator:** Should all setting-name occurrences use Mythrill with two final l's?
- **Possible Paths:**
  - Path A: Adopt Mythrill; correct the class passage.
  - Path B: Adopt Mythril; revise the established setting spelling globally.
  - Path C: Define any deliberate alternate spelling and its permitted context.

### ISSUE-058: Sol is awake in the dark or a sleeping infant sun
- **Category:** World History/Laws
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `docs/CORE_LORE_FRAMEWORK.md` (lines 36–38): "Sol is the Sun of Mythrill — a living, unhatched celestial infant" / "he has been awake in the dark for four hundred and seventy-five years."
  - Source B: `vtt-react/src/store/deityStore.js` (line 40): "an infant sun sleeping in the volcanic core"
- **Contradiction Breakdown:** The present state of consciousness is explicitly opposite. Being unhatched or entombed does not itself determine sleeping/awake status, and neither passage identifies the other as mortal misconception.
- **Clarification Question for Creator:** Is Sol conscious throughout his entombment, asleep, or subject to a defined cycle?
- **Possible Paths:**
  - Path A: Adopt conscious Sol; revise the deity state and literal sleeping claims.
  - Path B: Adopt sleeping Sol; revise the core awake assertion.
  - Path C: Supply exact state/cycle and attribution rules.

### ISSUE-059: The drafter of the First Contract changes from Valerius to Vaelis
- **Category:** World History/Laws
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/classes/arcanoneerData.js` (line 206): "Valerius the Scriptor" / "First Nethien archivist to draft the First Contract with Morvane"
  - Source B: `docs/subrace_lore_compendium/08_nethien_locations_and_figures.md` (lines 41–42): "Vaelis the Scribe (The One Who Drafted the First Contract — Sovereign Notary)" / "Mythic founder of Nethien contract law who drafted the First Accord that ended the War of Ashes."
- **Contradiction Breakdown:** The same founding document/role is assigned to different named people, and B switches from First Contract in its title to First Accord in its biography. No alias, coauthorship or separate-document relationship is defined. This is a founding-attribution collision distinct from ISSUE-007's date collision.
- **Clarification Question for Creator:** Who drafted the First Contract, and is the First Accord a different document?
- **Possible Paths:**
  - Path A: Adopt Valerius as the drafter; revise Vaelis attribution/document labels.
  - Path B: Adopt Vaelis as the drafter; revise class and lexicon founder records.
  - Path C: Define the two people/documents and their exact roles.

### ISSUE-060: Astril have slit pupils or entirely pupilless celestial eyes
- **Category:** Race/Species
- **Severity:** Critical
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/astril.js` (line 8): "Their eyes are reptilian, with slit pupils"
  - Source B: `docs/subrace_lore_compendium/03_astril_locations_and_figures.md` (line 12): "Solid glowing starlight-cyan/white pupilless celestial orbs"
  - Source B: same file (line 74) also specifies Brutish "pupilless eyes."
- **Contradiction Breakdown:** Both named Astril subraces are given baseline anatomy that removes the defining pupils of the race overview. These are ordinary anatomical locks, not described as a spell or transformation state.
- **Clarification Question for Creator:** Do Stargazer and Brutish Astril have reptilian pupils or pupil-free luminous eyes?
- **Possible Paths:**
  - Path A: Adopt slit pupils; align subrace art specifications.
  - Path B: Adopt pupilless eyes; revise race anatomy and vision descriptions.
  - Path C: Supply explicit subrace/state-specific anatomy.

### ISSUE-061: Foam-spawned Myrathil without mothers learn Aquan “in the womb”
- **Category:** Background/Language
- **Severity:** Moderate
- **Colliding Sources:**
  - Source A: `vtt-react/src/data/races/myrathil.js` (line 27): "They rise from storm-foam fully formed, with no parents, no bloodline"
  - Source B: `vtt-react/src/data/languages.js` (line 285): "Myrathil Deep-Born learn it in the womb."
- **Contradiction Breakdown:** The racial language description invokes gestation despite the ancestry's explicit parentless foam-spawning. A metaphorical womb could be intended, but the language file does not mark that usage as metaphor or define a sea-womb developmental stage.
- **Clarification Question for Creator:** Is “in the womb” metaphorical, or do Deeplings have a different gestation rule?
- **Possible Paths:**
  - Path A: Adopt parentless foam-spawning; align acquisition phrasing.
  - Path B: Adopt gestation for Deeplings; revise spawning universals.
  - Path C: Define the actual developmental stage and terminology.

### Cross-reference closure notes

- **No unsupported zero-backstory allegation:** the registered base classes and 25 current creation backgrounds have substantive descriptions; the nine seeded tongues have substantive definitions. Findings above identify missing taxonomy/selection/mapping or conflicting claims, rather than falsely asserting those entities have no lore anywhere.
- **No automatic lifespan collision from exceptional elders:** a named elder living beyond a normal range is not by itself an error. ISSUE-038 combines an explicit incompatible tenure with an unqualified biological range and asks whether an exception exists. Human prose already admits exceptional century-lived people; it is not flagged merely because Thalra is exceptionally old.
- **Narrative unlocks matter:** incompatibility is not synonymous with total UI impossibility. The wizard permits justification for certain off-list choices. ISSUE-041/042 concern contradictory native classification; ISSUE-043 includes Withered Arcanoneer, whose class explicitly sets `narrativeUnlock: false` and excludes Withered.
- **Naming syntax evidence:** `nameGenerator.js:88–93` generates a race-list first name plus a shared surname. Nethien and Groven lore commonly use hyphenated names, but no universal enforceable first/surname prohibition was found. No invented prefix/suffix law is imposed. Legacy IDs, legitimate in-world epithets and archival quotations are not globally condemned as spelling errors.
- **Attribution matters:** source passages clearly presented as rumor, theological dispute or a character's belief are not automatically treated as omniscient factual contradictions. Conditional contradictions in the log are labelled localized mismatches or dangling mappings rather than harmonized by new lore.
- **Art references carry claims:** the settlement/figure documents describe themselves as canonical locks and supply backstories. Their architectural, anatomical and identity claims therefore belong in the audit even though their format is an image-generation prompt.

## 4. Review Boundary / Halt

**572 files are individually indexed; 61 issues are flagged.** The broader authored-text discovery screen covered 1,769 nonempty files. Each issue remains unresolved; all checklist rows await the creator's decision. No Source A, Source B, or Path C has been adopted. No existing source file was edited, deleted, renamed, regenerated or deployed by this audit. Review the questions before authorizing any reconciliation work.
