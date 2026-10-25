# RI-8 Plaguebringer Content Lock

**Date:** 2026-10-23  
**Status:** locked snapshot of the implemented legacy records; no commit, push or deploy.  
**Authority:** `plaguebringerData.js`, its three talent-tree modules, and `plaguebringerResourceContract.js`.

This lock preserves the existing Plaguebringer IDs and effects. It does not rename, delete or automatically convert legacy records. The complete machine-readable snapshot is `CONTENT-LOCK.json`.

## Identity and progression

- Core grants: `pb_curse_of_agony`, `pb_whisper_of_decay`.
- Optional records: 46; one starting pick and one pick per level, with earlier unchosen pools legal.
- Talent budget: 5 points per level, 50 total; 57 nodes across three trees, 19 nodes and 50 ranks per tree.
- Tier gates use the existing 5-point ladder. Tier 7 passives unlock at level 8; the tier-7 one-rank capstone requires level 10 and 45 same-tree points.
- Resource: Virulence 0-100, afflictions 0-10, thresholds at 25/50/75, manual tabletop only.
- No automatic contagion, spread, lifecycle, damage or condition execution is claimed.

## Core grants

| ID | Name | Level | Cost | Targeting |
|---|---|---:|---|---|
| `pb_curse_of_agony` | Wasting Curse | 1 | 1 AP, 3 mana, +15 Vir | single, ranged, 40 ft |
| `pb_whisper_of_decay` | Whisper of Decay | 1 | 1 AP, 4 mana, +15 Vir | single, ranged, 50 ft |

## Optional spells (46)

| ID | Name | Level | Cost | Targeting | Timing |
|---|---|---:|---|---|---|
| `virulent-lavender_mask` | Lavender Mask | 1 | 1 AP, 3 mana | area, self_centered, circle | IMMEDIATE 1 |
| `pb_mycelium_sense` | Mycelium-Web Sense | 1 | 1 AP, 4 mana | self, self | IMMEDIATE 1 |
| `pb_rot_touch` | Rot-Touch | 1 | 1 AP, 4 mana | single, touch | IMMEDIATE 1 |
| `pb_spore_scout` | Spore Scout | 1 | 1 AP, 4 mana, +5 Vir | single, ranged, 80 ft | IMMEDIATE 1 |
| `pb_venomous_touch` | Venomous Touch | 1 | 1 AP, 4 mana, +10 Vir | single, melee, 5 ft | IMMEDIATE 1 |
| `pb_counter_culture` | Counter-Culture | 2 | 1 AP, 8 mana | single, touch | MINUTES 10 / 1 long_rest |
| `pb_enfeebling_fog` | Enfeebling Fog | 2 | 1 AP, 4 mana, +10 Vir | area, ranged, 45 ft | IMMEDIATE 1 / 3 turn_based |
| `pb_fever_dream` | Fever Dream | 2 | 1 AP, 6 mana, +15 Vir | single, ranged, 40 ft | IMMEDIATE 1 / 2 turn_based |
| `pb_mark_of_the_pestilent` | Mark of the Pestilent | 2 | 1 AP, 6 mana, +15 Vir | single, ranged, 30 ft | IMMEDIATE 1 / 2 turn_based |
| `pb_miasma_veil` | Miasma Veil | 2 | 1 AP, 6 mana, 10 Vir | area, self | IMMEDIATE 1 / 1 turn_based |
| `pb_plague_reader` | Plague-Reader | 2 | 1 AP, 5 mana | single, touch | IMMEDIATE 1 |
| `pb_cadaver_puppet` | Cadaver-Puppet | 3 | 1 AP, 10 mana, 15 Vir | single, touch | MINUTES 10 |
| `pb_drain_vitality` | Drain Vitality | 3 | 1 AP, 8 mana, +15 Vir | single, ranged, 35 ft | IMMEDIATE 1 / 2 turn_based |
| `pb_hallucinogenic_spores` | Hallucinogenic Spores | 3 | 1 AP, 6 mana, +15 Vir | area, ranged, 30 ft | IMMEDIATE 1 / 3 turn_based |
| `pb_miasma_form` | Miasma Form | 3 | 1 AP, 5 mana | self, self | IMMEDIATE 1 / 2 turn_based |
| `pb_agonizing_wail` | Wail of Decay | 3 | 2 AP, 9 mana, +15 Vir | area, ranged, 15 ft | IMMEDIATE 1 / 4 turn_based |
| `pb_infectious_sores` | Infectious Sores | 4 | 1 AP, 6 mana, +20 Vir | single, ranged, 35 ft | IMMEDIATE 1 / 3 turn_based |
| `pb_necrotic_burst` | Necrotic Burst | 4 | 1 AP, 9 mana, +20 Vir | area, ranged, 45 ft | IMMEDIATE 1 / 3 turn_based |
| `pb_plague_of_flies` | Plague of Flies | 4 | 1 AP, 8 mana, +15 Vir | area, ranged, 40 ft | IMMEDIATE 1 / 4 turn_based |
| `pb_septic_shroud` | Septic Shroud | 4 | 1 AP, 7 mana, +15 Vir | area, self | IMMEDIATE 1 / 3 turn_based |
| `pb_dark_rejuvenation` | Dark Rejuvenation | 5 | 1 AP, 8 mana, +10 Vir | self, self | IMMEDIATE 1 / 4 turn_based |
| `pb_parasitic_graft` | Parasitic Graft | 5 | 1 AP, 9 mana, 20 Vir | single, ranged, 25 ft | IMMEDIATE 1 / 3 turn_based |
| `pb_sufferings_echo` | Suffering's Echo | 5 | 1 AP, 9 mana, +20 Vir | single, ranged, 45 ft | IMMEDIATE 1 / 3 turn_based |
| `pb_wither_touch` | Wither Touch | 5 | 1 AP, 10 mana, +15 Vir | single, melee, 5 ft | IMMEDIATE 1 / 3 turn_based |
| `pb_affliction_mark` | Affliction Mark | 6 | 1 AP, 10 mana, +20 Vir | single, ranged, 45 ft | IMMEDIATE 1 / 4 turn_based |
| `pb_calcifying_rot` | Calcifying Rot | 6 | 1 AP, 12 mana, +25 Vir | single, ranged, 40 ft | IMMEDIATE 1 / 4 turn_based |
| `pb_essence_corruption` | Essence Corruption | 6 | 1 AP, 14 mana, +15 Vir | single, ranged, 50 ft | IMMEDIATE 1 / 4 turn_based |
| `pb_pain_magnification` | Pain Magnification | 6 | 2 AP, 12 mana, +20 Vir | area, self_centered | IMMEDIATE 1 / 4 turn_based |
| `pb_decay_field` | Decay Field | 7 | 2 AP, 22 mana, +20 Vir | area, ranged, 40 ft | IMMEDIATE 1 / 4 turn_based |
| `pb_gardens_wrath` | Garden's Wrath | 7 | 2 AP, 26 mana, +10 Vir | self, self_centered | IMMEDIATE 1 / 5 turn_based |
| `pb_mass_affliction` | Mass Affliction | 7 | 2 AP, 18 mana, +25 Vir | area, self_centered | IMMEDIATE 1 / 5 turn_based |
| `pb_mind_plague` | Mind Plague | 7 | 2 AP, 27 mana, +5 Vir | area, ranged, 50 ft | IMMEDIATE 1 / 5 turn_based |
| `pb_pandemic` | Pandemic | 7 | 2 AP, 20 mana, +25 Vir | area, self_centered | IMMEDIATE 1 / 5 turn_based |
| `pb_plague_burst` | Plague Burst | 7 | 2 AP, 15 mana, +20 Vir | area, ranged, 40 ft | IMMEDIATE 1 / 4 turn_based |
| `pb_bubonic_detonation` | Bubonic Detonation | 8 | 2 AP, 16 mana, 40 Vir | area, ranged, 60 ft | IMMEDIATE 1 / 4 turn_based |
| `pb_epidemic` | Epidemic | 8 | 2 AP, 30 mana, +5 Vir | single, ranged, 50 ft | IMMEDIATE 1 / 5 turn_based |
| `pb_plague_incarnate` | Plague Incarnate | 8 | 2 AP, 32 mana, +25 Vir | self, self | IMMEDIATE 1 / 5 turn_based |
| `pb_spore_hive_quarantine` | Spore-Hive Quarantine | 8 | 1 AP, 15 mana, 35 Vir | area, ranged, 50 ft | IMMEDIATE 1 / 4 turn_based |
| `pb_black_death` | Black Death | 9 | 3 AP, 36 mana, +10 Vir | area, ranged, 60 ft | IMMEDIATE 1 / 6 turn_based |
| `pb_chitinous_carapace` | Chitinous Mycocarapace | 9 | 1 AP, 18 mana, 50 Vir | self, self | IMMEDIATE 1 / 5 turn_based |
| `pb_necrotic_eruption` | Necrotic Eruption | 9 | 3 AP, 34 mana | self, self_centered | IMMEDIATE 1 / 6 turn_based |
| `pb_symbiotic_resurrection` | Symbiotic Re-Germination | 9 | 2 AP, 20 mana, 60 Vir | single, touch | IMMEDIATE 2 / 1 long_rest |
| `pb_apotheosis_of_rot` | Apotheosis of Rot | 10 | 2 AP, 25 mana, 100 Vir | self, self | IMMEDIATE 2 / 1 long_rest |
| `pb_plague_god` | Plague God | 10 | 3 AP, 40 mana, +25 Vir | self, self | IMMEDIATE 1 / 1 long_rest |
| `pb_ultimate_affliction` | Ultimate Affliction | 10 | 3 AP, 36 mana, +25 Vir | single, ranged, 60 ft | IMMEDIATE 1 / 1 long_rest |
| `pb_world_blight_cataclysm` | World-Blight Cataclysm | 10 | 2 AP, 24 mana, 80 Vir | area, ranged, 100 ft | IMMEDIATE 2 / 1 long_rest |

## Unslotted authored passives (2)

These records are present in the class catalogue but are not granted by the level curve or optional pools.

| ID | Name | Level | Description |
|---|---|---:|---|
| `plague_incubation_period` | Incubation Period | 1 | All diseases have a 1-round delay before dealing damage or applying debuffs. Enemies can seek cures or kill you before the plague takes hold. |
| `plague_sterile_environment` | Sterile Environment | 3 | In cleansed areas (primal magic, healing, alchemical purification), diseases are suppressed. Cannot apply new diseases; existing ones stop dealing damage. Purity is your weakness. |

## Talent nodes (57)

| ID | Name | Tree | Tier | Ranks | Type | Min level | Point gate | Capstone | Grant |
|---|---|---:|---:|---:|---|---:|---:|---|---|
| `vs_t1_spore_volley` | Spore Volley | virulent_spreader | 1 | 3 | ACTIVE | 1 | 0 |  | `talent-spell-vs_t1_spore_volley` |
| `vs_t1_rapid_contagion` | Rapid Contagion | virulent_spreader | 1 | 3 | PASSIVE | 1 | 0 |  | `talent-spell-vs_t1_rapid_contagion` |
| `vs_t1_virulence_surge` | Airborne Proliferation | virulent_spreader | 1 | 2 | PASSIVE | 1 | 0 |  | `talent-spell-vs_t1_virulence_surge` |
| `vs_t2_vector_detonation` | Vector Detonation | virulent_spreader | 2 | 3 | ACTIVE | 2 | 5 |  | `talent-spell-vs_t2_vector_detonation` |
| `vs_t2_chain_infection` | Chain Contagion | virulent_spreader | 2 | 3 | PASSIVE | 2 | 5 |  | `talent-spell-vs_t2_chain_infection` |
| `vs_t3_pandemic_wave` | Pandemic Gale | virulent_spreader | 3 | 3 | ACTIVE | 3 | 10 |  | `talent-spell-vs_t3_pandemic_wave` |
| `vs_t3_infectious_aura` | Infectious Miasma | virulent_spreader | 3 | 3 | PASSIVE | 3 | 10 |  | `talent-spell-vs_t3_infectious_aura` |
| `vs_t4_plague_zone` | Plague Zone | virulent_spreader | 4 | 3 | ACTIVE | 4 | 15 |  | `talent-spell-vs_t4_plague_zone` |
| `vs_t4_viral_burst` | Spore Multiplication | virulent_spreader | 4 | 2 | PASSIVE | 4 | 15 |  | `talent-spell-vs_t4_viral_burst` |
| `vs_t5_epidemic_surge` | Epidemic Surge | virulent_spreader | 5 | 2 | ACTIVE | 5 | 20 |  | `talent-spell-vs_t5_epidemic_surge` |
| `vs_t5_strain_banking` | Pathogen Reservoir | virulent_spreader | 5 | 3 | PASSIVE | 5 | 20 |  | `talent-spell-vs_t5_strain_banking` |
| `vs_t6_global_pandemic` | Global Pandemic | virulent_spreader | 6 | 1 | ACTIVE | 6 | 25 |  | `talent-spell-vs_t6_global_pandemic` |
| `vs_t6_cross_infection` | Vector Cascade | virulent_spreader | 6 | 2 | PASSIVE | 6 | 25 |  | `talent-spell-vs_t6_cross_infection` |
| `vs_t6_superbug_mutation` | Superbug Mutation | virulent_spreader | 6 | 2 | PASSIVE | 6 | 25 |  | `talent-spell-vs_t6_superbug_mutation` |
| `vs_t7_patient_zero` | Patient Zero | virulent_spreader | 7 | 1 | ACTIVE | 10 | 45 | yes | `talent-spell-vs_t7_patient_zero` |
| `vs_t7_waste_spore_doctrine` | Waste Spore Doctrine | virulent_spreader | 7 | 5 | PASSIVE | 8 | 30 |  | `talent-spell-vs_t7_waste_spore_doctrine` |
| `vs_t7_continuous_blooming` | Continuous Blooming | virulent_spreader | 7 | 3 | PASSIVE | 8 | 30 |  | `talent-spell-vs_t7_continuous_blooming` |
| `vs_t7_plague_wind` | Pandemic Overdrive | virulent_spreader | 7 | 3 | PASSIVE | 8 | 30 |  | `talent-spell-vs_t7_plague_wind` |
| `vs_t7_spore_carrier` | Living Pathogen | virulent_spreader | 7 | 3 | PASSIVE | 8 | 30 |  | `talent-spell-vs_t7_spore_carrier` |
| `tw_t1_agony_tether` | Agony Tether | torment_weaver | 1 | 3 | ACTIVE | 1 | 0 |  | `talent-spell-tw_t1_agony_tether` |
| `tw_t1_resonance_damage` | Resonant Agony | torment_weaver | 1 | 3 | PASSIVE | 1 | 0 |  | `talent-spell-tw_t1_resonance_damage` |
| `tw_t1_shared_torment` | Shared Torment | torment_weaver | 1 | 2 | PASSIVE | 1 | 0 |  | `talent-spell-tw_t1_shared_torment` |
| `tw_t2_synaptic_siphon` | Synaptic Siphon | torment_weaver | 2 | 3 | ACTIVE | 2 | 5 |  | `talent-spell-tw_t2_synaptic_siphon` |
| `tw_t2_nightmare_fuel` | Psychic Vulnerability | torment_weaver | 2 | 3 | PASSIVE | 2 | 5 |  | `talent-spell-tw_t2_nightmare_fuel` |
| `tw_t3_torment_web` | Torment Web | torment_weaver | 3 | 3 | ACTIVE | 3 | 10 |  | `talent-spell-tw_t3_torment_web` |
| `tw_t3_cascade_finale` | Sympathetic Cascade | torment_weaver | 3 | 3 | PASSIVE | 3 | 10 |  | `talent-spell-tw_t3_cascade_finale` |
| `tw_t4_psychic_storm` | Psychic Storm | torment_weaver | 4 | 3 | ACTIVE | 4 | 15 |  | `talent-spell-tw_t4_psychic_storm` |
| `tw_t4_sympathetic_pain` | Nerve Relay | torment_weaver | 4 | 2 | PASSIVE | 4 | 15 |  | `talent-spell-tw_t4_sympathetic_pain` |
| `tw_t5_mass_resonance` | Mass Resonance | torment_weaver | 5 | 2 | ACTIVE | 5 | 20 |  | `talent-spell-tw_t5_mass_resonance` |
| `tw_t5_torment_economy` | Agony Harvest | torment_weaver | 5 | 3 | PASSIVE | 5 | 20 |  | `talent-spell-tw_t5_torment_economy` |
| `tw_t6_sympathetic_collapse` | Sympathetic Collapse | torment_weaver | 6 | 1 | ACTIVE | 6 | 25 |  | `talent-spell-tw_t6_sympathetic_collapse` |
| `tw_t6_web_reinforcement` | Unbreakable Lattice | torment_weaver | 6 | 2 | PASSIVE | 6 | 25 |  | `talent-spell-tw_t6_web_reinforcement` |
| `tw_t6_synaptic_overload` | Synaptic Overload | torment_weaver | 6 | 2 | PASSIVE | 6 | 25 |  | `talent-spell-tw_t6_synaptic_overload` |
| `tw_t7_grand_puppet` | The Grand Puppet | torment_weaver | 7 | 1 | ACTIVE | 10 | 45 | yes | `talent-spell-tw_t7_grand_puppet` |
| `tw_t7_agony_doctrine` | Agony Doctrine | torment_weaver | 7 | 5 | PASSIVE | 8 | 30 |  | `talent-spell-tw_t7_agony_doctrine` |
| `tw_t7_infinite_lattice` | Infinite Lattice | torment_weaver | 7 | 3 | PASSIVE | 8 | 30 |  | `talent-spell-tw_t7_infinite_lattice` |
| `tw_t7_psychic_scourge` | Psychic Scourge | torment_weaver | 7 | 3 | PASSIVE | 8 | 30 |  | `talent-spell-tw_t7_psychic_scourge` |
| `tw_t7_vampiric_mesh` | Vampiric Mesh | torment_weaver | 7 | 3 | PASSIVE | 8 | 30 |  | `talent-spell-tw_t7_vampiric_mesh` |
| `dh_t1_cultivate_rot` | Cultivate Rot | decay_harbinger | 1 | 3 | ACTIVE | 1 | 0 |  | `talent-spell-dh_t1_cultivate_rot` |
| `dh_t1_infinite_growth` | Infinite Rooting | decay_harbinger | 1 | 3 | PASSIVE | 1 | 0 |  | `talent-spell-dh_t1_infinite_growth` |
| `dh_t1_dark_rejuvenation` | Dark Rejuvenation | decay_harbinger | 1 | 2 | PASSIVE | 1 | 0 |  | `talent-spell-dh_t1_dark_rejuvenation` |
| `dh_t2_withering_siphon` | Withering Siphon | decay_harbinger | 2 | 3 | ACTIVE | 2 | 5 |  | `talent-spell-dh_t2_withering_siphon` |
| `dh_t2_necrotic_burst` | Necrotic Cyst | decay_harbinger | 2 | 3 | PASSIVE | 2 | 5 |  | `talent-spell-dh_t2_necrotic_burst` |
| `dh_t3_rupture_cyst` | Rupture Cyst | decay_harbinger | 3 | 3 | ACTIVE | 3 | 10 |  | `talent-spell-dh_t3_rupture_cyst` |
| `dh_t3_withering_aura` | Withering Atmosphere | decay_harbinger | 3 | 3 | PASSIVE | 3 | 10 |  | `talent-spell-dh_t3_withering_aura` |
| `dh_t4_organ_collapse` | Organ Collapse | decay_harbinger | 4 | 3 | ACTIVE | 4 | 15 |  | `talent-spell-dh_t4_organ_collapse` |
| `dh_t4_vampiric_decay` | Symbiotic Rot | decay_harbinger | 4 | 2 | PASSIVE | 4 | 15 |  | `talent-spell-dh_t4_vampiric_decay` |
| `dh_t5_miasmic_shroud` | Miasmic Shroud | decay_harbinger | 5 | 2 | ACTIVE | 5 | 20 |  | `talent-spell-dh_t5_miasmic_shroud` |
| `dh_t5_total_collapse` | Corpse Bloom | decay_harbinger | 5 | 3 | PASSIVE | 5 | 20 |  | `talent-spell-dh_t5_total_collapse` |
| `dh_t6_apocalyptic_decay` | Apocalyptic Decay | decay_harbinger | 6 | 1 | ACTIVE | 6 | 25 |  | `talent-spell-dh_t6_apocalyptic_decay` |
| `dh_t6_deep_rooted` | Deep-Rooted Weeds | decay_harbinger | 6 | 2 | PASSIVE | 6 | 25 |  | `talent-spell-dh_t6_deep_rooted` |
| `dh_t6_rot_memory` | Rot Memory | decay_harbinger | 6 | 2 | PASSIVE | 6 | 25 |  | `talent-spell-dh_t6_rot_memory` |
| `dh_t7_the_deep_garden` | The Deep Garden | decay_harbinger | 7 | 1 | ACTIVE | 10 | 45 | yes | `talent-spell-dh_t7_the_deep_garden` |
| `dh_t7_peat_heart` | Peat-Heart Doctrine | decay_harbinger | 7 | 5 | PASSIVE | 8 | 30 |  | `talent-spell-dh_t7_peat_heart` |
| `dh_t7_slow_gardener` | Rot Acceleration | decay_harbinger | 7 | 3 | PASSIVE | 8 | 30 |  | `talent-spell-dh_t7_slow_gardener` |
| `dh_t7_compost_engine` | Compost Engine | decay_harbinger | 7 | 3 | PASSIVE | 8 | 30 |  | `talent-spell-dh_t7_compost_engine` |
| `dh_t7_eternal_gardener` | Eternal Gardener | decay_harbinger | 7 | 3 | PASSIVE | 8 | 30 |  | `talent-spell-dh_t7_eternal_gardener` |

## Capstones

| ID | Name | Tree | Ranks | Min level | Point gate | Grant |
|---|---|---|---:|---:|---:|---|
| `vs_t7_patient_zero` | Patient Zero | virulent_spreader | 1 | 10 | 45 | `talent-spell-vs_t7_patient_zero` |
| `tw_t7_grand_puppet` | The Grand Puppet | torment_weaver | 1 | 10 | 45 | `talent-spell-tw_t7_grand_puppet` |
| `dh_t7_the_deep_garden` | The Deep Garden | decay_harbinger | 1 | 10 | 45 | `talent-spell-dh_t7_the_deep_garden` |

## Failure cases and runtime limits

- Contagion, spread, lifecycle, damage, and condition execution are manual tabletop operations. The lock does not claim automated combat execution.
- Virulence application is manual; the resource bar and planner expose costs and affordability but do not auto-run spell effects.
- The two unslotted passives above are catalogue records only. They are not granted by level-up or the optional pick curve.
- Existing saves that hold a capstone below level 10, or below the 45-point in-tree gate, are pruned by the shared pruner. No automatic migration or refund is performed.
- Legacy trees have no separate level-3 signature node; the tier-7 capstone is the only explicitly marked capstone.

## Source hashes

- `vtt-react/src/data/classes/plaguebringerData.js`: `1daffb16c51e43e1937ef65d32652f269c88a9abb1a7f8c097664cdf1f34fc98`
- `vtt-react/src/data/plaguebringerResourceContract.js`: `6bd3ba21f103a771328af7b53e6fc5508debe1feb3a704d7352d6a8a2625e6e8`
- `vtt-react/src/data/talentTrees/plaguebringerVirulentSpreader.js`: `b0f1df840c743acaba6d3164f95f91108524aac827fcf1b7ccc01028429e298d`
- `vtt-react/src/data/talentTrees/plaguebringerTormentWeaver.js`: `efe1faa3fa0f6c2e55ed55e76704c6b07200115f674092e4b144cf30d492d1fc`
- `vtt-react/src/data/talentTrees/plaguebringerDecayHarbinger.js`: `686ee6baefd8086cd8785e4ca9973cfc036787d531a405b7ef7874e079e87fcc`

## Known limits

- This is a legacy-content lock, not a CR1 96-record package. The audit records 50 authored spells and three 50-point legacy trees.
- The tier-7 capstone is the only explicitly marked capstone; legacy trees have no separate level-3 signature node.
- Runtime resource application and combat execution remain manual. The lock does not claim automated lifecycle, balance validation or production admission.
