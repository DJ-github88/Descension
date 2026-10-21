# Ancestral Gifts: draft loadouts for the remaining 23 heritages

Status: **draft for creator review**. Nothing here is in code yet. Ids in `code` are existing race-file traits. **NEW** marks a gift that still has to be written. For NEW gifts only the name and intent are fixed; numbers come after approval, like the six Groven gifts.

## Rules I applied
- **Shape:** one locked core, then 3 rows of 2 options, pick one per row (same as Morgh and Amordjin).
- **Core:** the heritage's signature beneficial trait.
- **Always-on:** drawbacks and pure lore traits are left out of the loadout. The engine keeps traits that are not in a loadout, so they stay granted. Examples: Cold Vulnerability, Dehydration, Hush Vulnerability, Contractual Lock, Mechanical Interference, Conductive Frame, The Short Straw, Deep-Curse, Severed, Mote, Lumia's Echo.
- **Existing traits first:** NEW gifts only fill the gaps (0 to 3 per heritage; 38 in total).
- **Rows:** each row pairs two options on one theme, so the choice is a real trade-off.

## Myrathil (always-on: Dehydration)
| Heritage | Core | Row 1 | Row 2 | Row 3 |
|---|---|---|---|---|
| Corali `shoreling_myrathil` | `amphibious_shore` | Weather: `storm_blood_shore` / NEW Squall-Caller | Voice: `tide_tongue_shore` / `spindrift_diplomacy` | Reef: NEW Coral-Hide / NEW Riptide Lunge |
| Nereid `deepling_myrathil` | `amphibious_deep` | Depths: `abyssal_adaptation_deep` / NEW Pressure-Born | Voice: `deep_hum` / `mareths_hum` | Hunt: NEW Lantern-Lure / NEW Drowning Grip |
| Ondine `riverling_myrathil` | `amphibious_brook` | Blood: `brackish_heritage_brook` / NEW Silt-Skin | Face: `mask_estuary_brook` / NEW Current-Tongue | Lore: `fresh_water_memory` / NEW Eddy-Step |

## Mimir (always-on: Unanchored Archive)
| Heritage | Core | Row 1 | Row 2 | Row 3 |
|---|---|---|---|---|
| Arch Mimir `veiled_mimir` | `mask_bound_mimir` | Lineage: `heartwood_lineage_maskborne` / NEW Porcelain Ward | Sight: `fog_piercing_sight_maskborne` / `inscribed_memory_maskborne` | Face: `borrowed_face_maskborne` / NEW Name-Keeper |
| Broken Mimir `tethered_mimir` | `mote_mimir` (see Q2) | Senses: `storm_glass_senses_mistwoven` / `first_alert_mistwoven` | Reach: `rope_runner_mistwoven` / NEW Tether-Leap | Strike: `glass_shard_volley_mistwoven` / NEW Fulgurite Edge |

## Florae (always-on: none)
| Heritage | Core | Row 1 | Row 2 | Row 3 |
|---|---|---|---|---|
| Briaren `viridian_florae` | `branch_arm_brawn_florae` | Body: `thorn_barb_bristle_viridian` / `hearth_water_vitality_florae` | Sense: `unwritten_word_viridian` / `nature_attunement_florae` | Will: `fog_compact_refusal_viridian` / NEW Briar-Oath |
| Oaken `florae_unified` | `branch_arm_brawn_florae` | Body: `heartwood_durability_oken` / `hearth_water_vitality_florae` | Reach: `canopy_reach_oken` / `nature_attunement_florae` | Root: `deep_root_anchor_oken` / NEW Sap-Surge |

## Solari (always-on: Cold Vulnerability, plus Deep-Curse for Korr)
| Heritage | Core | Row 1 | Row 2 | Row 3 |
|---|---|---|---|---|
| Korr `korr_solari` | `vault_breath_solari` | Breath: `ash_lung_solari` / `vault_breath_exhale_korr` | Senses: `listening_dark_korr` / NEW Ember-Sense | Pulse: `sols_breath_pulse_korr` / NEW Cinder-Ward |
| Anhur `thrask_solari` | `vault_breath_solari` | Breath: `ash_lung_solari` / NEW Smoke-Veil | Blood: `border_blood_thrask` / `obsidian_graft_thrask` | Stride: `ash_skimmer_thrask` / `scree_sprint_thrask` |

## Vreken (always-on: Hush Vulnerability)
| Heritage | Core | Row 1 | Row 2 | Row 3 |
|---|---|---|---|---|
| Bedel `clean_vreken` | `lantern_eyes_vreken` | Blood: `deep_glow_blood_clean` / `crypt_record_clean` | Song: `crypt_chant_clean` / `crypt_pulse_clean` | Sense: `spore_sense_vreken` / NEW Mourner's Bloom |
| Cromyx `marked_vreken` | `lantern_eyes_vreken` | Sight: `ghost_mycelium_sight_marked` / `spore_sense_vreken` | Veil: `hush_temptation_marked` / `root_veil_echo_vreken` | Mark: `death_mark_strike_marked` / NEW Spore-Cloak |

## Neth (always-on: Contractual Lock; Severed for Riven)
| Heritage | Core | Row 1 | Row 2 | Row 3 |
|---|---|---|---|---|
| Nethien `velun_neth` | `pact_stillness_neth` | Word: `bound_tongue_velun` / `clause_of_binding_velun` | Lore: `memory_glass_training_velun` / `returned_count_neth` | Flame: `pact_flame_velun` / NEW Oath-Ward |
| Weft `kessen_neth` | `pact_stillness_neth` | Sight: `keepers_sight_kessen` / `returned_count_neth` | Thread: `probability_weave_kessen` / `thread_snap_kessen` | Ledger: `chronometric_intuition_kessen` / NEW Loose-Thread |
| Riven `drun_neth` | `pact_stillness_neth` (see Q3) | Silence: `silence_walker_drun` / NEW Unsigned Step | Body: `bog_survival_drun` / `returned_count_neth` | Strike: `null_strike_drun` / NEW Pact-Breaker |

## Astril (always-on: Lumia's Echo; no new gifts needed)
| Heritage | Core | Row 1 | Row 2 | Row 3 |
|---|---|---|---|---|
| Lumian `vashir_astril` | `selunis_quest_astril` | Light: `star_burst_vashir` / `luminous_eyes_astril` | Night: `lumian_vigil_vashir` / `inverted_vision_astril` | Blood: `starlight_resonance_vashir` / `constellation_reading_vashir` |
| Kordak `silath_astril` | `selunis_quest_astril` | Tide: `read_the_tide_silath` / `lunar_attunement_silath` | Dream: `memory_of_lumia_silath` / `silver_eyes_silath` | Sight: `inverted_vision_astril` / `luminous_eyes_astril` |

## Fexrick (always-on: Mechanical Interference, Conductive Frame)
| Heritage | Core | Row 1 | Row 2 | Row 3 |
|---|---|---|---|---|
| Brasskin `kethrin_fexric` | `still_air_sense_fexric` | Craft: `guild_precision_kethrin` / `machine_song_kethrin` | Burst: `neural_overclock_kethrin` / NEW Cold-Iron Focus | Secret: `hoarded_secret_kethrin` / NEW Ledger of Hands |
| Alchemite `drall_fexric` | `still_air_sense_fexric` | Blood: `sump_acclimation_drall` / NEW Sump-Taste | Salvage: `sump_salvage_drall` / `scrap_shield_drall` | Rig: `jury_rig_drall` / NEW Slag-Cast |

## Human (always-on: The Short Straw)
Core is `desperate_will_human` for all five. Row 3 is two NEW gifts in each case, because each bloodline has only four own traits.

| Heritage | Row 1 | Row 2 | Row 3 (both NEW) |
|---|---|---|---|
| Tallyn `thalren_human` | Mind: `lineage_recall_thalren` / `written_word_thalren` | Fog: `fog_sense_thalren` / `fog_step_thalren` | Quill: Ink-Stained Hand / Archivist's Gaze |
| Skald `skald_human` | Cold: `cold_endurance_skald` / `glacier_rage_skald` | Pride: `bloodline_pride_skald` / `frost_knuckle_skald` | Saga: Saga-Memory / Shield-Brother's Oath |
| Tessic `tessen_human` | Shadow: `keep_rat_tessen` / `sealed_silence_tessen` | Debt: `favor_debt_tessen` / `geothermal_sense_tessen` | Lock: Keyhole Eye / Tinker's Fingers |
| Merryn `merryn_human` | Sea: `sea_legs_merryn` / `storm_luck_merryn` | Deal: `tattoo_contract_merryn` / `salt_cut_merryn` | Rope: Rope-Hand / Harbor Talk |
| Ordu `ordan_human` | March: `endless_march_ordan` / `herd_instinct_ordan` | Song: `throat_song_ordan` / `mound_offering_ordan` | Steppe: Horizon-Eye / Saddle-Born |

## Questions for the creator
1. **Core choice.** Is "signature beneficial trait" the right core, or should a heritage's defining drawback be the locked birthright (as Cold Vulnerability is today for Anhur)?
2. **Broken Mimir.** Is Mask-Bound correct for them, or is Mote the better core?
3. **Riven.** Do they keep The Returned Count and Pact's Stillness despite Severed?
4. **Pairing.** Are the row pairings real trade-offs? A passive against an active is the intent.
5. **Numbers.** NEW gifts need numbers and rules text before they can ship (38 total).

## Implementation when approved
1. Add the loadouts to `ANCESTRY_LOADOUTS` in `data/ancestryLoadouts.js`.
2. Add the NEW gift records to `ANCESTRY_GIFTS`.
3. Add a test that every loadout resolves to a real trait or gift, with 3 rows of 2 and no duplicates.
4. No UI changes. The picker already reads the loadout.

Until a heritage is added, it keeps the old behaviour (all traits granted, "Canonical traits" in the dialog).
