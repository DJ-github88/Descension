# RI-8 — Inquisitor + Spellguard + Toxicologist complete content lock

**Date:** 2026-10-28  
**Status:** IMPLEMENTED — retained legacy roster content integrated with explicit progression; unsupported mechanics remain manual.  
**Machine-readable lock:** [CONTENT-LOCK.json](CONTENT-LOCK.json)  
**Evidence report:** [REPORT.md](REPORT.md)

## Scope

This lock covers the three remaining RI-8 retained-roster classes. Plaguebringer RI-8 work is preserved separately at `../RI-8-plaguebringer/` and is not reopened or modified. The authored spell libraries, trees, resource systems, guides and HUDs already existed; this cohort adds the missing explicit progression/manifest layer, integration tests and verification. No class was rebuilt, truncated, renamed or converted, and no legacy save data was migrated.

| Class | Authored spells | Pools (L1…L10) | Trees | Nodes | Ranks | Resource |
|---|---:|---|---:|---:|---:|---|
| Inquisitor | 46 | 8/6/4/4/4/4/4/4/4/4 | 3 | 57 | 150 | authority |
| Spellguard | 48 | 8/6/4/4/4/4/4/4/4/4 | 3 | 58 | 150 | aep |
| Toxicologist | 50 | 8/5/6/4/4/4/4/4/4/4 | 3 | 54 | 150 | vials |

Each class keeps three complete 50-point trees. Node counts differ because the retained classes have richer node layouts; existing content was preserved rather than truncated.

## Explicit progression policy

All three classes expose `progression.policy`:

- `startingSpellPicks: 3`.
- `optionalPicksPerLevel: 1`.
- `allowEarlierUnchosen: true`.
- `grantedCoreSpellIds: []` — these retained classes have no separately granted core spell.
- `randomizeStartingSpells: false` and `autoTopUpOnLoad: false` — no random or automatic top-up; existing saved spell lists are not rewritten.
- `talentActivesAreGrants: false`; `manualOnly: true`.

Level pools remain exactly as authored. The policy stops default auto-assignment for new choices without deleting any known spell from an existing character.

## Inquisitor

- Class ID: `inquisitor`; role: Occult Arbiter / Demon Handler.
- Resource: **authority** (`authority`), base 0, max 8.
- Specializations/trees: Witch Hammer (`witch_hammer`), Iron Verdict (`iron_verdict`), Hollow Saint (`hollow_saint`).
- Native access retained: `marked_vreken`, `clean_vreken`, `thalren_human`, `tethered_mimir`.
- Manifest: `INQUISITOR_MANIFEST`; policy: `INQUISITOR_PROGRESSION_POLICY`.

### Spell pools

| Level | Pool size | IDs |
|---:|---:|---|
| 1 | 8 | `inq_iron_interrogation`, `inq_detect_corruption`, `inq_scent_of_ash`, `inq_null_salts_strike`, `inq_purge_the_defiled`, `inq_silver_blade`, `inq_witch_sight`, `inq_null_salt_ward` |
| 2 | 6 | `inq_iron_adjudication`, `inq_ash_step`, `inq_sigil_of_rotting_mana`, `inq_scourge_of_submission`, `inq_bind_interrogate`, `inq_exorcise_place` |
| 3 | 4 | `inq_curse_eater`, `inq_shadow_ambush`, `inq_anti_magic_barrier`, `inq_barbed_interdict` |
| 4 | 4 | `inq_wyrd_banish`, `inq_silver_hex`, `inq_shackles_of_searing_iron`, `inq_spirit_shackle` |
| 5 | 4 | `inq_inquisitors_judgment`, `inq_anti_magic_field`, `inq_severing_shackles`, `inq_cold_iron_brand` |
| 6 | 4 | `inq_inquisitors_storm`, `inq_ward_of_cold_iron`, `inq_null_zone_anchor`, `inq_heretic_brand` |
| 7 | 4 | `inq_righteous_storm`, `inq_aura_of_the_iron_vow`, `inq_barbed_excommunication`, `inq_soul_scour_brand` |
| 8 | 4 | `inq_judgment_day`, `inq_anathema_seal`, `inq_immutable_bastion`, `inq_cold_iron_crucible` |
| 9 | 4 | `inq_absolute_severance`, `inq_avatar_of_inquisition`, `inq_final_confession`, `inq_apocalypse_of_salt` |
| 10 | 4 | `inq_hexbreaker_armageddon`, `inq_the_grand_interdict`, `inq_eternal_cold_iron`, `inq_wrath_of_the_seven_vows` |

### Authored spells (46)

| ID | Name | Lvl | Type | AP | Mana | Class resource | Targeting | Timing | Cooldown | Tags |
|---|---|---:|---|---:|---:|---|---|---|---|---|
| `inq_iron_interrogation` | Cold-Iron Interrogation | 1 | ACTION | 1 | 3 |  | single, touch | MINUTES 1 | turn_based 0 | utility, social, interrogation, inquisitor |
| `inq_iron_adjudication` | Iron Adjudication | 2 | REACTION | 0 | 5 | authority +1 | single, ranged, 30 ft | IMMEDIATE 0 | turn_based 1 | reaction, counter, silence, inquisitor |
| `inq_detect_corruption` | Detect Corruption | 1 | ACTION | 1 |  |  | area, self_centered | IMMEDIATE 1 | turn_based 1 | utility, detect, inquisitor |
| `inq_wyrd_banish` | Wyrd Banish | 4 | ACTION | 2 |  |  | single, ranged, 30 ft | IMMEDIATE 1 | turn_based 3 | utility, banish, inquisitor |
| `inq_scent_of_ash` | Scent of Ash | 1 | ACTION | 1 |  |  | single, ranged, 60 ft | IMMEDIATE 1 | turn_based 0 | tracking, marking, utility |
| `inq_null_salts_strike` | Null-Salts Strike | 1 | ACTION | 1 |  |  | self, self | IMMEDIATE 1 | turn_based 0 | damage, weapon, authority generation |
| `inq_purge_the_defiled` | Purge the Defiled | 1 | ACTION | 1 |  |  | single, touch, 5 ft | IMMEDIATE 1 | turn_based 1 | purification, dispel, utility |
| `inq_silver_blade` | Constricting Silver Binding | 1 | ACTION | 1 |  |  | self, self | IMMEDIATE 1 | turn_based 0 | weapon, anti magic, resistance piercing |
| `inq_ash_step` | Ash Step | 2 | ACTION | 1 |  |  | self, self | ACTION 1 | turn_based 0 | mobility, speed, utility |
| `inq_sigil_of_rotting_mana` | Sigil of Rotting Mana | 2 | ACTION | 1 |  |  | single, ranged, 30 ft | ACTION 1 | turn_based 0 | debuff, curse, anti magic |
| `inq_scourge_of_submission` | Scourge of Submission | 2 | ACTION | 1 | 3 |  | single, ranged, 60 ft | IMMEDIATE 1 | turn_based 0 | nullification, counter, anti magic, discipline |
| `inq_curse_eater` | Curse Eater | 3 | ACTION | 1 |  |  | single, touch, 5 ft | ACTION 1 | short_rest 1 | dispel, anti magic, healing |
| `inq_shadow_ambush` | Shadow Ambush | 3 | ACTION | 1 |  |  | self, self | IMMEDIATE 1 | turn_based 0 | stealth, utility |
| `inq_anti_magic_barrier` | Anti-Magic Ward | 3 | ACTION | 1 |  |  | area, self_centered | ACTION 1 | turn_based 2 | protection, anti magic |
| `inq_silver_hex` | Silver Hex | 4 | ACTION | 1 |  |  | single, ranged, 30 ft | ACTION 1 | turn_based 1 | debuff, curse, anti magic |
| `inq_shackles_of_searing_iron` | Shackles of Searing Iron | 4 | ACTION | 1 | 5 |  | single, ranged, 60 ft | IMMEDIATE 1 | turn_based 0 | restraint, execute, shackles, anti magic |
| `inq_spirit_shackle` | Spirit Shackle | 4 | ACTION | 2 |  |  | single, ranged, 30 ft | ACTION 1 | turn_based 2 | crowd control, root, silence, control |
| `inq_inquisitors_judgment` | Inquisitor's Judgment | 5 | ACTION | 2 |  |  | single, melee, 5 ft | ACTION 1 | turn_based 2 | execute, control, melee |
| `inq_anti_magic_field` | Anti-Magic Field | 5 | ACTION | 2 |  |  | area, self_centered | ACTION 1 | long_rest 1 | aoe, anti magic, suppression |
| `inq_inquisitors_storm` | Inquisitor's Storm | 6 | ACTION | 2 |  |  | area, self_centered | ACTION 1 | long_rest 1 | aoe, damage, stun, ultimate |
| `inq_righteous_storm` | Righteous Storm | 7 | ACTION | 2 |  |  | area, ranged, 60 ft | ACTION 1 | long_rest 1 | aoe, damage over time, anti magic |
| `inq_judgment_day` | Judgment Day | 8 | ACTION | 2 |  |  | area, ranged, 60 ft | ACTION 1 | long_rest 1 | aoe, damage, judgment |
| `inq_hexbreaker_armageddon` | Armageddon Edict | 10 | ACTION | 2 |  |  | area, self_centered | ACTION 1 | long_rest 1 | aoe, damage, permanent, anti magic |
| `inq_witch_sight` | Witch-Sight | 1 | ACTION | 1 | 4 |  | self, self | IMMEDIATE 1 | turn_based 0 | utility, detection, investigation, exploration, anti magic |
| `inq_null_salt_ward` | Null-Salt Ward | 1 | ACTION | 1 | 5 |  | area, touch, line | MINUTES 1 | turn_based 0 | utility, ward, exploration, rest, anti magic |
| `inq_bind_interrogate` | Bind and Interrogate | 2 | ACTION | 1 | 8 |  | single, touch | MINUTES 1 | turn_based 0 | utility, divination, investigation, social, binding, anti magic |
| `inq_exorcise_place` | Exorcise | 2 | ACTION | 1 | 10 |  | single, touch | MINUTES 10 | turn_based 0 | utility, exorcism, exploration, investigation, anti magic |
| `inq_barbed_interdict` | Barbed Interdict | 3 | ACTION | 1 | 6 |  | self, self | IMMEDIATE 1 | long_rest 1 | utility, social, authority, anti magic |
| `inq_severing_shackles` | Severing Cold-Iron Shackles | 5 | ACTION | 1 | 9 | authority 2 | single, ranged, 40 ft | IMMEDIATE 1 | turn_based 3 | control, debuff, anti magic, shackles, inquisitor |
| `inq_cold_iron_brand` | Cold-Iron Brand | 5 | ACTION | 1 | 10 | authority +1 | single, ranged, 30 ft | IMMEDIATE 1 | turn_based 3 | damage, debuff, dispel, inquisitor |
| `inq_ward_of_cold_iron` | Ward of the Cold-Iron Aegis | 6 | ACTION | 1 | 14 | authority 2 | area, self | IMMEDIATE 1 | turn_based 4 | buff, defense, ward, anti magic, inquisitor |
| `inq_null_zone_anchor` | Null-Zone Anchor | 6 | ACTION | 1 | 11 | authority 2 | area, ranged, 45 ft | IMMEDIATE 1 | turn_based 4 | control, utility, anti magic, zone, inquisitor |
| `inq_heretic_brand` | Heretic's Scourge | 6 | ACTION | 1 | 13 | authority +1 | single, ranged, 35 ft | IMMEDIATE 1 | turn_based 4 | damage, control, duel, sacred, inquisitor |
| `inq_aura_of_the_iron_vow` | Aura of the Iron Vow | 7 | ACTION | 1 | 14 | authority 3 | area, self | IMMEDIATE 1 | turn_based 5 | buff, aura, protection, sacred, inquisitor |
| `inq_barbed_excommunication` | Barbed Excommunication | 7 | ACTION | 1 | 15 | authority 3 | single, ranged, 40 ft | IMMEDIATE 1 | turn_based 5 | control, utility, banish, inquisitor |
| `inq_soul_scour_brand` | Soul-Scourge Purge | 7 | ACTION | 2 | 16 | authority 2 | single, ranged, 40 ft | IMMEDIATE 2 | turn_based 4 | damage, debuff, mana burn, ember, inquisitor |
| `inq_anathema_seal` | Seal of Absolute Anathema | 8 | ACTION | 1 | 17 | authority 4 | single, ranged, 40 ft | IMMEDIATE 1 | turn_based 5 | control, debuff, anti magic, seal, inquisitor |
| `inq_immutable_bastion` | Immutable Bastion of Truth | 8 | ACTION | 1 | 18 | authority 4 | area, self | IMMEDIATE 1 | turn_based 5 | buff, defense, bastion, sacred, inquisitor |
| `inq_cold_iron_crucible` | Cold-Iron Crucible | 8 | ACTION | 2 | 19 | authority 3 | area, ranged, 50 ft | IMMEDIATE 2 | turn_based 5 | damage, control, aoe, smashing, inquisitor |
| `inq_absolute_severance` | Absolute Supernatural Severance | 9 | ACTION | 2 | 22 | authority 5 | single, ranged, 50 ft | IMMEDIATE 2 | long_rest 1 | control, debuff, paralysis, anti magic, inquisitor |
| `inq_avatar_of_inquisition` | Avatar of the Barbed Edict | 9 | ACTION | 2 | 24 | authority 6 | self, self | IMMEDIATE 2 | long_rest 1 | buff, transformation, ultimate, sacred, inquisitor |
| `inq_final_confession` | The Final Confession | 9 | ACTION | 1 | 20 | authority 5 | single, ranged, 40 ft | IMMEDIATE 1 | turn_based 5 | control, debuff, confession, inquisitor |
| `inq_apocalypse_of_salt` | Apocalypse of Salt | 9 | ACTION | 2 | 25 | authority 5 | area, ranged, 60 ft | IMMEDIATE 2 | long_rest 1 | damage, control, aoe, sacred, inquisitor |
| `inq_the_grand_interdict` | The Grand Interdict | 10 | ACTION | 2 | 28 | authority 8 | area, ranged, 100 ft | IMMEDIATE 2 | long_rest 1 | control, utility, ultimate, anti magic, inquisitor |
| `inq_eternal_cold_iron` | Eternity of Cold Iron | 10 | ACTION | 2 | 30 | authority 7 | area, self | IMMEDIATE 2 | long_rest 1 | buff, defense, ultimate, sacred, inquisitor |
| `inq_wrath_of_the_seven_vows` | Wrath of the Seven Vows | 10 | ACTION | 2 | 30 | authority 8 | area, ranged, 80 ft | IMMEDIATE 2 | long_rest 1 | damage, control, ultimate, ember, inquisitor |

### Talent trees

#### Witch Hammer (`witch_hammer`) — 19 nodes / 50 points

| ID | Name | Tier | Ranks | Type | Requires | Capstone |
|---|---|---:|---:|---|---|---|
| `wh_t1_wyrd_pack` | Wyrd Pack | 1 | 3 | PASSIVE |  |  |
| `wh_t1_bind_hound` | Bind Wyrd-hound | 1 | 3 | ACTIVE |  |  |
| `wh_t1_shadow_mastery` | Shadow Mastery | 1 | 2 | PASSIVE |  |  |
| `wh_t2_pack_mind` | Pack Mind | 2 | 3 | PASSIVE | `wh_t1_wyrd_pack` |  |
| `wh_t2_swarm_tactics` | Swarm Tactics | 2 | 3 | PASSIVE | `wh_t1_bind_hound` |  |
| `wh_t3_steady_rein` | Steady Rein | 3 | 3 | ACTIVE | `wh_t2_pack_mind` |  |
| `wh_t3_silent_execution` | Silent Execution | 3 | 3 | PASSIVE | `wh_t2_swarm_tactics` |  |
| `wh_t4_mass_restoration` | Mass Restoration | 4 | 3 | PASSIVE | `wh_t3_steady_rein` |  |
| `wh_t4_wyrd_cyclone` | Wyrd Cyclone | 4 | 2 | ACTIVE | `wh_t3_silent_execution` |  |
| `wh_t5_pack_alpha` | Pack Alpha | 5 | 3 | PASSIVE | `wh_t4_mass_restoration` |  |
| `wh_t5_hunters_authority` | Hunter's Authority | 5 | 2 | PASSIVE | `wh_t4_wyrd_cyclone` |  |
| `wh_t6_cold_iron_doctrine` | Cold Iron Doctrine | 6 | 1 | ACTIVE | `wh_t5_pack_alpha` |  |
| `wh_t6_undisputed` | Undisputed | 6 | 2 | PASSIVE | `wh_t5_hunters_authority` |  |
| `wh_t6_shared_stealth` | Shared Stealth | 6 | 2 | PASSIVE | `wh_t5_pack_alpha` |  |
| `wh_t7_the_purging` | The Purging | 7 | 1 | ACTIVE | `wh_t6_cold_iron_doctrine` | yes |
| `wh_t7_writ_of_binding` | Writ of Binding | 7 | 5 | PASSIVE | `wh_t6_shared_stealth` | yes |
| `wh_t7_houndmaster_general` | Houndmaster General | 7 | 3 | PASSIVE | `wh_t6_shared_stealth` | yes |
| `wh_t7_first_name_iron` | First-Name Iron | 7 | 3 | PASSIVE | `wh_t6_undisputed` | yes |
| `wh_t7_quiet_writ` | Quiet Writ | 7 | 3 | PASSIVE | `wh_t6_undisputed` | yes |

#### Iron Verdict (`iron_verdict`) — 19 nodes / 50 points

| ID | Name | Tier | Ranks | Type | Requires | Capstone |
|---|---|---:|---:|---|---|---|
| `iv_t1_covenant_of_iron` | Covenant of Iron | 1 | 3 | PASSIVE |  |  |
| `iv_t1_spell_intercept` | Spell Intercept | 1 | 3 | PASSIVE |  |  |
| `iv_t1_iron_grip` | Iron Grip | 1 | 2 | ACTIVE |  |  |
| `iv_t2_mana_vortex` | Mana Vortex | 2 | 3 | PASSIVE | `iv_t1_spell_intercept` |  |
| `iv_t2_empowered_strikes` | Empowered Strikes | 2 | 3 | PASSIVE | `iv_t1_iron_grip` |  |
| `iv_t3_spell_nullification` | Spell Nullification | 3 | 3 | PASSIVE | `iv_t2_mana_vortex` |  |
| `iv_t3_dominant_wrath` | Dominant Wrath | 3 | 3 | PASSIVE | `iv_t2_empowered_strikes` |  |
| `iv_t4_hounds_verdict` | Hound's Verdict | 4 | 3 | ACTIVE | `iv_t3_spell_nullification` |  |
| `iv_t4_dispel_field` | Dispel Field | 4 | 2 | ACTIVE | `iv_t3_dominant_wrath` |  |
| `iv_t5_arcane_dominator` | Arcane Dominator | 5 | 2 | PASSIVE | `iv_t4_hounds_verdict` |  |
| `iv_t5_counters_doctrine` | Counter's Doctrine | 5 | 3 | PASSIVE | `iv_t4_dispel_field` |  |
| `iv_t6_the_bench` | The Bench | 6 | 1 | ACTIVE | `iv_t5_arcane_dominator` |  |
| `iv_t6_iron_ledger` | Iron Ledger | 6 | 2 | PASSIVE | `iv_t5_counters_doctrine` |  |
| `iv_t6_verdant_null` | Verdant Null | 6 | 2 | PASSIVE | `iv_t5_arcane_dominator` |  |
| `iv_t7_final_verdict` | Final Verdict | 7 | 1 | ACTIVE | `iv_t6_the_bench` | yes |
| `iv_t7_long_writ` | Long Writ | 7 | 5 | PASSIVE | `iv_t6_iron_ledger` | yes |
| `iv_t7_contempt_power` | Contempt of Power | 7 | 3 | PASSIVE | `iv_t6_iron_ledger` |  |
| `iv_t7_iron_sanction` | Iron Sanction | 7 | 3 | PASSIVE | `iv_t6_verdant_null` | yes |
| `iv_t7_stand_verdict` | The Stand | 7 | 3 | PASSIVE | `iv_t6_verdant_null` | yes |

#### Hollow Saint (`hollow_saint`) — 19 nodes / 50 points

| ID | Name | Tier | Ranks | Type | Requires | Capstone |
|---|---|---:|---:|---|---|---|
| `hsw_t1_hollow_pursuit` | Hollow Pursuit | 1 | 3 | PASSIVE |  |  |
| `hsw_t1_wyrd_embrace` | Wyrd Embrace | 1 | 3 | PASSIVE |  |  |
| `hsw_t1_pursuit_mastery` | Pursuit Mastery | 1 | 2 | PASSIVE |  |  |
| `hsw_t2_corruption_aura` | Corruption Aura | 2 | 3 | PASSIVE | `hsw_t1_wyrd_embrace` |  |
| `hsw_t2_condemn` | Condemn | 2 | 3 | ACTIVE | `hsw_t1_pursuit_mastery` |  |
| `hsw_t3_inner_peace` | Inner Peace | 3 | 3 | PASSIVE | `hsw_t2_corruption_aura` |  |
| `hsw_t3_marked_for_death` | Marked for Death | 3 | 3 | ACTIVE | `hsw_t2_condemn` |  |
| `hsw_t4_rein_in_fury` | Rein In Fury | 4 | 3 | ACTIVE | `hsw_t3_inner_peace` |  |
| `hsw_t4_corruption_nova` | Corruption Nova | 4 | 2 | ACTIVE | `hsw_t3_marked_for_death` |  |
| `hsw_t5_hounds_endurance` | Hound's Endurance | 5 | 3 | PASSIVE | `hsw_t4_rein_in_fury` |  |
| `hsw_t5_no_escape` | No Escape | 5 | 2 | PASSIVE | `hsw_t4_corruption_nova` |  |
| `hsw_t6_ascended_form` | Hollow Sovereign | 6 | 1 | PASSIVE | `hsw_t5_hounds_endurance` |  |
| `hsw_t6_confession` | Confession | 6 | 2 | PASSIVE | `hsw_t5_no_escape` |  |
| `hsw_t6_hollow_bones` | Hollow Bones | 6 | 2 | PASSIVE | `hsw_t5_hounds_endurance` |  |
| `hsw_t7_saint_and_hound` | Saint and Hound | 7 | 1 | ACTIVE | `hsw_t6_ascended_form` | yes |
| `hsw_t7_writ_of_hunger` | Writ of Hunger | 7 | 5 | PASSIVE | `hsw_t6_hollow_bones` | yes |
| `hsw_t7_tireless_pursuer` | Tireless Pursuer | 7 | 3 | PASSIVE | `hsw_t6_hollow_bones` | yes |
| `hsw_t7_rot_crown` | Rot Crown | 7 | 3 | PASSIVE | `hsw_t6_confession` | yes |
| `hsw_t7_last_confession` | Last Confession | 7 | 3 | PASSIVE | `hsw_t6_confession` | yes |

### Capstones

| ID | Name | Tree | Tier | Ranks |
|---|---|---|---:|---:|
| `wh_t7_the_purging` | The Purging | Witch Hammer | 7 | 1 |
| `wh_t7_writ_of_binding` | Writ of Binding | Witch Hammer | 7 | 5 |
| `wh_t7_houndmaster_general` | Houndmaster General | Witch Hammer | 7 | 3 |
| `wh_t7_first_name_iron` | First-Name Iron | Witch Hammer | 7 | 3 |
| `wh_t7_quiet_writ` | Quiet Writ | Witch Hammer | 7 | 3 |
| `iv_t7_final_verdict` | Final Verdict | Iron Verdict | 7 | 1 |
| `iv_t7_long_writ` | Long Writ | Iron Verdict | 7 | 5 |
| `iv_t7_iron_sanction` | Iron Sanction | Iron Verdict | 7 | 3 |
| `iv_t7_stand_verdict` | The Stand | Iron Verdict | 7 | 3 |
| `hsw_t7_saint_and_hound` | Saint and Hound | Hollow Saint | 7 | 1 |
| `hsw_t7_writ_of_hunger` | Writ of Hunger | Hollow Saint | 7 | 5 |
| `hsw_t7_tireless_pursuer` | Tireless Pursuer | Hollow Saint | 7 | 3 |
| `hsw_t7_rot_crown` | Rot Crown | Hollow Saint | 7 | 3 |
| `hsw_t7_last_confession` | Last Confession | Hollow Saint | 7 | 3 |

## Spellguard

- Class ID: `spellguard`; role: Silence-Scarred Aegis.
- Resource: **aep** (`aep`), base 0, max 100.
- Specializations/trees: Arcane Warden (`arcane_warden`), Spell Breaker (`spell_breaker`), Mana Reaver (`mana_reaver`).
- Native access retained: `velun_neth`, `thalren_human`, `korr_solari`, `thrask_solari`.
- Manifest: `SPELLGUARD_MANIFEST`; policy: `SPELLGUARD_PROGRESSION_POLICY`.

### Spell pools

| Level | Pool size | IDs |
|---:|---:|---|
| 1 | 8 | `spg_aegis_ward`, `sg_void_siphon`, `sg_entropic_aegis`, `sg_refract_kinetic`, `sg_leyline_rift`, `spellguard_ley_reading`, `spellguard_aegis_ward`, `spellguard_glow_lantern` |
| 2 | 6 | `spg_spell_break`, `sg_agonizing_intercept`, `sg_shattered_mirror_ward`, `spellguard_aegis_beacon`, `spellguard_resonance_discharge`, `spellguard_disenchant` |
| 3 | 4 | `sg_warding_ribcage`, `sg_void_suppression`, `sg_containment_cycle`, `sg_spell_riposte` |
| 4 | 4 | `sg_kinetic_discharge`, `sg_null_field_bastion`, `sg_entropic_supernova`, `sg_spellward_bond` |
| 5 | 4 | `sg_radiation_quench`, `sg_tomb_of_the_aegis`, `sg_violent_purge`, `sg_prism_cocoon` |
| 6 | 4 | `sg_prismatic_mirror_bastion`, `sg_anti_magic_shackle`, `sg_kinetic_reversal`, `sg_scrying_blackout` |
| 7 | 4 | `sg_overload_shockwave`, `sg_leyline_blackout`, `sg_saturation_flush`, `sg_entropy_lance` |
| 8 | 4 | `sg_fortress_of_nullification`, `sg_warding_verge`, `sg_mirror_phalanx`, `sg_ley_fracture_hammer` |
| 9 | 4 | `sg_leyline_devourer_nova`, `sg_void_anchor`, `sg_resonance_bastion`, `sg_devouring_grasp` |
| 10 | 4 | `sg_singularity_aegis`, `sg_cosmic_unraveling`, `sg_criticality_halo`, `sg_echo_exodus` |

### Authored spells (48)

| ID | Name | Lvl | Type | AP | Mana | Class resource | Targeting | Timing | Cooldown | Tags |
|---|---|---:|---|---:|---:|---|---|---|---|---|
| `sg_kinetic_discharge` | Kinetic Discharge | 4 | ACTION | 1 | 6 |  | cone, melee, 5 ft | IMMEDIATE 1 | turn_based 1 | damage, cone, storm, knockback, spellguard |
| `sg_null_field_bastion` | Null Field Bastion | 4 | ACTION | 1 | 8 |  | area, self, circle 10 | IMMEDIATE 1 | turn_based 2 | buff, aoe, defense, anti_magic, spellguard |
| `sg_radiation_quench` | Radiation Quench | 5 | ACTION | 1 | 8 |  | area, self, circle 10 | IMMEDIATE 1 | turn_based 2 | damage, aoe, cleanse, spellguard |
| `sg_prismatic_mirror_bastion` | Prismatic Mirror Bastion | 6 | ACTION | 1 | 9 |  | single, ranged, 40 ft | IMMEDIATE 1 | turn_based 2 | reaction, reflect, defense, spellguard |
| `sg_anti_magic_shackle` | Anti-Magic Shackle | 6 | ACTION | 1 | 9 |  | single, ranged, 30 ft | IMMEDIATE 1 | turn_based 3 | silence, debuff, single_target, spellguard |
| `sg_overload_shockwave` | Overload Shockwave | 7 | ACTION | 1 | 11 | arcane_energy_points 50 | area, self, circle 30 | IMMEDIATE 1 | turn_based 2 | damage, aoe, storm, knockdown, spellguard |
| `sg_fortress_of_nullification` | Fortress of Nullification | 8 | ACTION | 1 | 13 |  | self, self | IMMEDIATE 1 | turn_based 3 | buff, invulnerable, defense, spellguard |
| `sg_leyline_devourer_nova` | Leyline Devourer Nova | 9 | ACTION | 1 | 15 |  | area, self, circle 40 | IMMEDIATE 1 | long_rest 1 | damage, aoe, dispel, apocalypse, spellguard |
| `sg_singularity_aegis` | Singularity Aegis | 10 | ACTION | 1 | 18 |  | self, self | IMMEDIATE 1 | long_rest 1 | buff, ultimate, defense, spellguard |
| `spg_aegis_ward` | Aegis Ward | 1 | REACTION | 1 |  |  | self, self | IMMEDIATE 1 | turn_based 1 | utility, shield, spellguard |
| `spg_spell_break` | Spell Break | 2 | REACTION | 1 |  |  | single, ranged, 30 ft | IMMEDIATE 1 | turn_based 2 | utility, counterspell, spellguard |
| `spellguard_arcane_radiation` | Arcane Radiation | 1 | PASSIVE | 0 |  |  | self | PASSIVE 0 |  | passive, spellguard, weakness |
| `spellguard_kinetic_fragility` | Brittle Kinetic Shell | 1 | PASSIVE | 0 |  |  | self | PASSIVE 0 |  | passive, spellguard, weakness |
| `sg_void_siphon` | Silence Siphon | 1 | ACTION | 1 |  | arcane_energy_points -15 | single, melee, 5 ft | IMMEDIATE 1 | turn_based 0 | melee, drain, resonance generation, spellguard |
| `sg_entropic_aegis` | Entropic Aegis | 1 | ACTION | 1 |  | arcane_energy_points 10 | self, self | IMMEDIATE 1 | turn_based 2 | shield, defense, spellguard |
| `sg_refract_kinetic` | Refract Kinetic | 1 | ACTION | 1 |  | arcane_energy_points 10 | self, self | IMMEDIATE 1 | turn_based 3 | defense, survival, self damage, spellguard |
| `sg_leyline_rift` | Leyline Rift | 1 | ACTION | 1 |  | arcane_energy_points -10 | single, ranged, 30 ft | IMMEDIATE 1 | turn_based 1 | mobility, teleport, self damage, spellguard |
| `sg_agonizing_intercept` | Silence Intercept | 2 | REACTION | 1 |  | arcane_energy_points 0 | single, ranged, 15 ft | IMMEDIATE 1 | turn_based 0 | reaction, interception, spellguard |
| `sg_shattered_mirror_ward` | Shattered Mirror Ward | 2 | REACTION | 1 |  | arcane_energy_points 15 | self, self | IMMEDIATE 1 | turn_based 2 | reaction, reflection, self damage, spellguard |
| `sg_warding_ribcage` | Warding Ribcage | 3 | ACTION | 1 |  | arcane_energy_points 20 | area, self_centered, circle 15 | IMMEDIATE 1 | turn_based 3 | aoe, shield, feedback, spellguard |
| `sg_void_suppression` | Silence Suppression | 3 | REACTION | 1 |  | arcane_energy_points 15 | single, ranged, 60 ft | IMMEDIATE 1 | turn_based 2 | reaction, counterspell, spellguard |
| `sg_entropic_supernova` | Entropic Supernova | 4 | ACTION | 1 |  | arcane_energy_points 40 | area, self_centered, circle 20 | IMMEDIATE 1 | turn_based 3 | aoe, purge, detonation, spellguard |
| `sg_tomb_of_the_aegis` | Tomb of the Aegis | 5 | ACTION | 1 |  | arcane_energy_points 50 | self, self | IMMEDIATE 1 | long_rest 1 | defense, immunity, self damage, spellguard |
| `sg_violent_purge` | Violent Purge | 5 | ACTION | 2 |  | arcane_energy_points 100 | area, self_centered, circle 20 | IMMEDIATE 2 | short_rest 1 | ultimate, purge, aoe, spellguard |
| `sg_leyline_blackout` | Leyline Blackout | 7 | ACTION | 2 |  | arcane_energy_points 35 | area, self_centered, circle 60 | IMMEDIATE 2 | long_rest 1 | zone, anti magic, ultimate, spellguard |
| `sg_cosmic_unraveling` | Cosmic Unraveling | 10 | ACTION | 3 |  | arcane_energy_points 100 | area, self_centered, circle 200 | IMMEDIATE 3 | long_rest 1 | ultimate, dispel, suicide, spellguard |
| `spellguard_aegis_beacon` | Aegis Beacon | 2 | ACTION | 1 | 4 |  | self, self | IMMEDIATE 1 | turn_based 0 | utility, roleplay, spellguard |
| `spellguard_ley_reading` | Ley-Reading | 1 | ACTION | 1 | 3 |  | self, self | IMMEDIATE 1 | turn_based 0 | utility, detection, investigation, spellguard |
| `spellguard_aegis_ward` | Aegis-Ward | 1 | ACTION | 1 | 6 |  | area, touch, circle 15 | MINUTES 10 | turn_based 0 | utility, ward, exploration, rest, spellguard |
| `spellguard_resonance_discharge` | Resonance Discharge | 2 | ACTION | 1 |  | arcane_energy_points 3 | single, touch | IMMEDIATE 1 | turn_based 1 | utility, exploration, investigation, spellguard |
| `spellguard_disenchant` | Disenchant | 2 | ACTION | 1 | 8 |  | single, touch | MINUTES 1 | turn_based 0 | utility, investigation, exploration, spellguard |
| `spellguard_glow_lantern` | Glow-Lantern | 1 | ACTION | 0 |  |  | self, self | IMMEDIATE 1 | turn_based 0 | utility, exploration, rest, spellguard |
| `sg_containment_cycle` | Containment Cycle | 3 | ACTION | 1 | 10 | arcane_energy_points 15 | self, self | IMMEDIATE 1 | turn_based 2 | utility, containment, aep, spellguard |
| `sg_spell_riposte` | Spell Riposte | 3 | REACTION | 1 | 10 | arcane_energy_points -10 | single, ranged, 40 ft | IMMEDIATE 1 | turn_based 2 | reaction, reflection, control, spellguard |
| `sg_spellward_bond` | Spellward Bond | 4 | ACTION | 1 | 12 | arcane_energy_points 10 | single, ranged, 30 ft | IMMEDIATE 1 | turn_based 2 | buff, interception, protection, spellguard |
| `sg_prism_cocoon` | Prism Cocoon | 5 | REACTION | 1 | 16 | arcane_energy_points 20 | single, ranged, 30 ft | IMMEDIATE 1 | turn_based 3 | reaction, protection, immunity, spellguard |
| `sg_kinetic_reversal` | Kinetic Reversal | 6 | ACTION | 1 | 14 | arcane_energy_points -10 | single, melee, 5 ft | IMMEDIATE 1 | turn_based 1 | melee, anti_caster, kinetic, spellguard |
| `sg_scrying_blackout` | Scrying Blackout | 6 | ACTION | 1 | 16 | arcane_energy_points 10 | area, self_centered, circle 30 | IMMEDIATE 1 | turn_based 3 | utility, anti_scrying, zone, spellguard |
| `sg_saturation_flush` | Saturation Flush | 7 | ACTION | 1 | 20 | arcane_energy_points 40 | self, self | IMMEDIATE 2 | short_rest 1 | healing, recovery, aep, spellguard |
| `sg_entropy_lance` | Entropy Lance | 7 | ACTION | 1 | 20 | arcane_energy_points 0 | line, ranged, 60 ft | IMMEDIATE 2 | turn_based 2 | damage, line, disruption, spellguard |
| `sg_warding_verge` | Warding Verge | 8 | ACTION | 1 | 22 | arcane_energy_points 20 | area, ranged, 30 ft, circle 15 | IMMEDIATE 2 | turn_based 3 | utility, ward, protection, spellguard |
| `sg_mirror_phalanx` | Mirror Phalanx | 8 | ACTION | 1 | 24 | arcane_energy_points 15 | area, self_centered, circle 15 | IMMEDIATE 1 | turn_based 3 | buff, retaliation, protection, spellguard |
| `sg_ley_fracture_hammer` | Ley-Fracture Hammer | 8 | ACTION | 1 | 24 | arcane_energy_points -10 | single, melee, 5 ft | IMMEDIATE 1 | turn_based 2 | melee, anti_ward, smashing, spellguard |
| `sg_void_anchor` | Void Anchor | 9 | ACTION | 2 | 30 | arcane_energy_points 25 | single, ranged, 60 ft | IMMEDIATE 2 | turn_based 3 | control, lockdown, anti_caster, spellguard |
| `sg_resonance_bastion` | Resonance Bastion | 9 | ACTION | 1 | 30 | arcane_energy_points -30 | area, self_centered, circle 20 | IMMEDIATE 1 | long_rest 1 | buff, immunity, protection, overload, spellguard |
| `sg_devouring_grasp` | Devouring Grasp | 9 | ACTION | 1 | 26 | arcane_energy_points 0 | single, melee, 5 ft | IMMEDIATE 1 | turn_based 2 | melee, drain, anti_caster, spellguard |
| `sg_criticality_halo` | Criticality Halo | 10 | ACTION | 1 | 35 | arcane_energy_points 20 | self, self | IMMEDIATE 2 | long_rest 1 | buff, damage, meltdown, spellguard |
| `sg_echo_exodus` | Echo Exodus | 10 | ACTION | 2 | 40 | arcane_energy_points 10 | area, self_centered, circle 20 | IMMEDIATE 1 | long_rest 1 | utility, teleport, decoy, spellguard |

### Catalogue-only records not granted by pools (2)

| ID | Name | Lvl | Type | Description |
|---|---|---:|---|---|
| `spellguard_arcane_radiation` | Arcane Radiation | 1 | PASSIVE | Absorbed magic is radioactive poison: at your turn's end, unspent AEP deals blight equal to (AEP / 10, rounded down) and reduces max HP by the same until a long rest. |
| `spellguard_kinetic_fragility` | Brittle Kinetic Shell | 1 | PASSIVE | Your silence-glass plating is hyper-specialized for absorbing energy, leaving you catastrophically vulnerable to martial trauma: permanent +50% vulnerability to all smashing and slicing damage. |

### Talent trees

#### Arcane Warden (`arcane_warden`) — 20 nodes / 50 points

| ID | Name | Tier | Ranks | Type | Requires | Capstone |
|---|---|---:|---:|---|---|---|
| `aw_t1_oath_steel` | Oath-Steel Bond | 1 | 3 | PASSIVE |  |  |
| `aw_t1_arcane_absorption` | Arcane Absorption | 1 | 3 | PASSIVE |  |  |
| `aw_t1_arcane_shield` | Arcane Shield | 1 | 2 | ACTIVE |  |  |
| `aw_t2_reinforced_wards` | Reinforced Wards | 2 | 3 | PASSIVE | `aw_t1_oath_steel` |  |
| `aw_t2_wardens_fortitude` | Warden's Fortitude | 2 | 3 | PASSIVE | `aw_t1_arcane_shield` |  |
| `aw_t3_barrier_of_protection` | Barrier of Protection | 3 | 2 | ACTIVE | `aw_t2_reinforced_wards` |  |
| `aw_t3_absorption_mastery` | Absorption Mastery | 3 | 2 | PASSIVE | `aw_t2_reinforced_wards` |  |
| `aw_t3_elemental_ward` | Elemental Ward | 3 | 2 | ACTIVE | `aw_t2_wardens_fortitude` |  |
| `aw_t4_mass_shielding` | Mass Shielding | 4 | 3 | ACTIVE | `aw_t3_barrier_of_protection` |  |
| `aw_t4_anti_magic_zone` | Anti-Magic Zone | 4 | 2 | ACTIVE | `aw_t3_absorption_mastery` |  |
| `aw_t5_overflow` | Overflowing Reservoir | 5 | 2 | PASSIVE | `aw_t4_mass_shielding` |  |
| `aw_t5_wardens_sacrifice` | Warden's Sacrifice | 5 | 3 | ACTIVE | `aw_t4_anti_magic_zone` |  |
| `aw_t6_fortress_mode` | Fortress Mode | 6 | 1 | ACTIVE | `aw_t5_overflow` |  |
| `aw_t6_bulwark_doctrine` | Bulwark Doctrine | 6 | 2 | PASSIVE | `aw_t5_wardens_sacrifice` |  |
| `aw_t6_reflective_ward` | Reflective Ward | 6 | 2 | ACTIVE | `aw_t5_overflow` |  |
| `aw_t7_ultimate_ward` | Ultimate Ward | 7 | 1 | ACTIVE | `aw_t6_fortress_mode` | yes |
| `aw_t7_aegis_eternal` | Aegis Eternal | 7 | 5 | PASSIVE | `aw_t6_bulwark_doctrine` | yes |
| `aw_t7_prismatic_bulwark` | Prismatic Bulwark | 7 | 3 | ACTIVE | `aw_t6_bulwark_doctrine` | yes |
| `aw_t7_oathbound` | Oathbound | 7 | 3 | PASSIVE | `aw_t6_reflective_ward` | yes |
| `aw_t7_unchanging_vow` | Unchanging Vow | 7 | 3 | PASSIVE | `aw_t6_reflective_ward` | yes |

#### Spell Breaker (`spell_breaker`) — 19 nodes / 50 points

| ID | Name | Tier | Ranks | Type | Requires | Capstone |
|---|---|---:|---:|---|---|---|
| `sb_t1_reflective_barrier` | Reflective Barrier | 1 | 3 | ACTIVE |  |  |
| `sb_t1_spell_disruption` | Spell Disruption | 1 | 3 | ACTIVE |  |  |
| `sb_t1_counter_magic` | Counter Magic | 1 | 2 | PASSIVE |  |  |
| `sb_t2_mirror_shield` | Mirror Shield | 2 | 3 | ACTIVE | `sb_t1_reflective_barrier` |  |
| `sb_t2_echo_damage` | Echo Damage | 2 | 3 | PASSIVE | `sb_t1_spell_disruption` |  |
| `sb_t3_perfect_reflection` | Perfect Reflection | 3 | 3 | PASSIVE | `sb_t2_echo_damage` |  |
| `sb_t3_mana_burn` | Mana Burn | 3 | 3 | PASSIVE | `sb_t1_counter_magic` |  |
| `sb_t4_mirror_field` | Mirror Field | 4 | 2 | ACTIVE | `sb_t2_mirror_shield` |  |
| `sb_t4_spell_nullification` | Spell Nullification | 4 | 3 | ACTIVE | `sb_t3_mana_burn` |  |
| `sb_t5_unbreakable_mirror` | Unbreakable Mirror | 5 | 2 | PASSIVE | `sb_t3_perfect_reflection` |  |
| `sb_t5_reciprocal_ward` | Reciprocal Ward | 5 | 3 | ACTIVE | `sb_t4_mirror_field` |  |
| `sb_t6_reflection_nova` | Reflection Nova | 6 | 1 | ACTIVE | `sb_t4_mirror_field` |  |
| `sb_t6_mirror_soul` | Mirror Soul | 6 | 2 | PASSIVE | `sb_t5_unbreakable_mirror` |  |
| `sb_t6_prismatic_shear` | Prismatic Shear | 6 | 2 | ACTIVE | `sb_t4_spell_nullification` |  |
| `sb_t7_perfect_mirror` | Perfect Mirror | 7 | 1 | ACTIVE | `sb_t6_reflection_nova` | yes |
| `sb_t7_mirror_mastery` | Mirror Mastery | 7 | 5 | PASSIVE | `sb_t6_mirror_soul` | yes |
| `sb_t7_arcane_retribution` | Arcane Retribution | 7 | 3 | PASSIVE | `sb_t6_mirror_soul` | yes |
| `sb_t7_thousand_faces` | Thousand Faces | 7 | 3 | ACTIVE | `sb_t6_prismatic_shear` | yes |
| `sb_t7_eternal_vigil` | Eternal Vigil | 7 | 3 | PASSIVE | `sb_t6_prismatic_shear` | yes |

#### Mana Reaver (`mana_reaver`) — 19 nodes / 50 points

| ID | Name | Tier | Ranks | Type | Requires | Capstone |
|---|---|---:|---:|---|---|---|
| `mr_t1_arcane_strike` | Arcane Strike | 1 | 3 | ACTIVE |  |  |
| `mr_t1_mana_vampirism` | Mana Vampirism | 1 | 3 | PASSIVE |  |  |
| `mr_t1_reavers_edge` | Reaver's Edge | 1 | 2 | PASSIVE |  |  |
| `mr_t2_empowered_strike` | Empowered Strike | 2 | 3 | ACTIVE | `mr_t1_arcane_strike` |  |
| `mr_t2_burst_damage` | Siphoned Fury | 2 | 3 | PASSIVE | `mr_t1_mana_vampirism` |  |
| `mr_t3_overcharge` | Overcharge | 3 | 3 | PASSIVE | `mr_t2_empowered_strike` |  |
| `mr_t3_mana_burn` | Wicked Draft | 3 | 3 | PASSIVE | `mr_t2_burst_damage` |  |
| `mr_t4_energy_surge` | Energy Surge | 4 | 2 | ACTIVE | `mr_t3_overcharge` |  |
| `mr_t4_arcane_combustion` | Arcane Combustion | 4 | 3 | PASSIVE | `mr_t3_mana_burn` |  |
| `mr_t5_spell_theft` | Spell Theft | 5 | 2 | ACTIVE | `mr_t3_mana_burn` |  |
| `mr_t5_vampiric_empowerment` | Vampiric Empowerment | 5 | 3 | PASSIVE | `mr_t4_energy_surge` |  |
| `mr_t6_mana_rend` | Mana Rend | 6 | 1 | ACTIVE | `mr_t5_vampiric_empowerment` |  |
| `mr_t6_leech_ward` | Leech Ward | 6 | 2 | ACTIVE | `mr_t5_spell_theft` |  |
| `mr_t6_hungering_blade` | Hungering Blade | 6 | 2 | PASSIVE | `mr_t5_vampiric_empowerment` |  |
| `mr_t7_aether_reaper` | Aether Reaper | 7 | 1 | ACTIVE | `mr_t6_mana_rend` | yes |
| `mr_t7_deep_siphon` | Deep Siphon | 7 | 5 | PASSIVE | `mr_t6_hungering_blade` | yes |
| `mr_t7_arcane_hunger` | Arcane Hunger | 7 | 3 | PASSIVE | `mr_t6_leech_ward` | yes |
| `mr_t7_reavers_momentum` | Reaver's Momentum | 7 | 3 | PASSIVE | `mr_t6_hungering_blade` | yes |
| `mr_t7_reservoir_bloom` | Reservoir Bloom | 7 | 3 | PASSIVE | `mr_t6_leech_ward` | yes |

### Capstones

| ID | Name | Tree | Tier | Ranks |
|---|---|---|---:|---:|
| `aw_t7_ultimate_ward` | Ultimate Ward | Arcane Warden | 7 | 1 |
| `aw_t7_aegis_eternal` | Aegis Eternal | Arcane Warden | 7 | 5 |
| `aw_t7_prismatic_bulwark` | Prismatic Bulwark | Arcane Warden | 7 | 3 |
| `aw_t7_oathbound` | Oathbound | Arcane Warden | 7 | 3 |
| `aw_t7_unchanging_vow` | Unchanging Vow | Arcane Warden | 7 | 3 |
| `sb_t7_perfect_mirror` | Perfect Mirror | Spell Breaker | 7 | 1 |
| `sb_t7_mirror_mastery` | Mirror Mastery | Spell Breaker | 7 | 5 |
| `sb_t7_arcane_retribution` | Arcane Retribution | Spell Breaker | 7 | 3 |
| `sb_t7_thousand_faces` | Thousand Faces | Spell Breaker | 7 | 3 |
| `sb_t7_eternal_vigil` | Eternal Vigil | Spell Breaker | 7 | 3 |
| `mr_t7_aether_reaper` | Aether Reaper | Mana Reaver | 7 | 1 |
| `mr_t7_deep_siphon` | Deep Siphon | Mana Reaver | 7 | 5 |
| `mr_t7_arcane_hunger` | Arcane Hunger | Mana Reaver | 7 | 3 |
| `mr_t7_reavers_momentum` | Reaver's Momentum | Mana Reaver | 7 | 3 |
| `mr_t7_reservoir_bloom` | Reservoir Bloom | Mana Reaver | 7 | 3 |

## Toxicologist

- Class ID: `toxicologist`; role: Damage/Support.
- Resource: **vials** (`vials`), base 4, max 10.
- Secondary resource: `contraption_parts`, max 5.
- Specializations/trees: Venomancer (`venomancer`), Gadgeteer (`gadgeteer`), Saboteur (`saboteur`).
- Native access retained: `thalren_human`, `tethered_mimir`, `viridian_florae`, `florae_unified`, `drun_neth`.
- Manifest: `TOXICOLOGIST_MANIFEST`; policy: `TOXICOLOGIST_PROGRESSION_POLICY`.

### Spell pools

| Level | Pool size | IDs |
|---:|---:|---|
| 1 | 8 | `tox_acid_unlocking`, `tox_apply_poison`, `tox_antidote`, `tox_poison_dart`, `tox_noxious_fumes`, `tox_purifying_antidote`, `tox_chemical_analysis`, `tox_caustic_flask` |
| 2 | 5 | `tox_venom_strike`, `tox_poison_trap`, `tox_smoke_bomb`, `tox_smoke_screen`, `tox_brew_antidote` |
| 3 | 6 | `tox_false_death`, `tox_crippling_toxin`, `tox_explosive_concoction`, `tox_venom_blast`, `tox_toxic_shock`, `tox_slow_taint` |
| 4 | 4 | `tox_toxic_cloud`, `tox_poison_bomb`, `tox_alchemical_adhesive`, `tox_vapor_veil` |
| 5 | 4 | `tox_contraption_network`, `tox_chaos_grenade`, `tox_deadly_toxin`, `tox_narcotic_vapor` |
| 6 | 4 | `tox_overcharged_trap`, `tox_toxic_wave`, `tox_calcified_antidote`, `tox_pneumatic_stasis_piston` |
| 7 | 4 | `tox_total_shutdown`, `tox_virulent_plague`, `tox_cryogenic_distillate`, `tox_caustic_deluge` |
| 8 | 4 | `tox_alchemical_outbreak`, `tox_mechanical_monstrosity`, `tox_sabotage_supreme`, `tox_biochemical_siphon` |
| 9 | 4 | `tox_extinction_toxin`, `tox_war_machine`, `tox_total_system_failure`, `tox_stasis_gas_dispersal` |
| 10 | 4 | `tox_apocalypse_plague`, `tox_mechanical_army`, `tox_reality_bomb`, `tox_panacea_concoction` |

### Authored spells (50)

| ID | Name | Lvl | Type | AP | Mana | Class resource | Targeting | Timing | Cooldown | Tags |
|---|---|---:|---|---:|---:|---|---|---|---|---|
| `tox_acid_unlocking` | Acid Unlocking | 1 | ACTION | 1 |  |  | single, touch, 5 ft | IMMEDIATE 1 | turn_based 1 | utility, lockpick, acid, toxicologist |
| `tox_false_death` | False Death | 3 | REACTION | 1 |  |  | self, self | IMMEDIATE 1 | short_rest 1 | utility, feign_death, toxicologist |
| `tox_venom_strike` | Venom Strike | 2 | ACTION | 1 |  | vials 2 | single, melee, 5 ft | IMMEDIATE 1 | turn_based 1 | melee, blight, damage, dot, venomancer |
| `tox_toxic_cloud` | Toxic Cloud | 4 | ACTION | 1 |  | vials 3 | area, ranged, 30 ft | IMMEDIATE 1 | turn_based 4 | aoe, blight, damage, debuff, dot, venomancer |
| `tox_poison_trap` | Poison Gas Trap | 2 | ACTION | 1 |  | contraption_parts 1 | area, ranged, 30 ft | IMMEDIATE 1 | turn_based 0 | trap, blight, damage, debuff, gadgeteer |
| `tox_contraption_network` | Contraption Network | 5 | ACTION | 2 |  | contraption_parts 4 | self, self | IMMEDIATE 1 | turn_based 8 | utility, contraption, combo, gadgeteer |
| `tox_overcharged_trap` | Overcharged Trap | 6 | ACTION | 2 |  | contraption_parts 3 | area, ranged, 30 ft | IMMEDIATE 1 | turn_based 5 | trap, ember, damage, debuff, aoe, gadgeteer |
| `tox_crippling_toxin` | Crippling Toxin | 3 | ACTION | 1 |  | vials 2 | single, melee, 5 ft | IMMEDIATE 1 | turn_based 0 | melee, blight, debuff, saboteur |
| `tox_chaos_grenade` | Chaos Grenade | 5 | ACTION | 2 |  | vials 3 | area, ranged, 30 ft | IMMEDIATE 1 | turn_based 4 | aoe, blight, ember, damage, confusion, saboteur |
| `tox_total_shutdown` | Total Shutdown | 7 | ACTION | 2 |  | vials 4 | single, ranged, 30 ft | IMMEDIATE 1 | turn_based 6 | single target, debuff, incapacitate, ultimate, saboteur |
| `tox_apply_poison` | Apply Weapon Poison | 1 | ACTION | 1 |  | vials 1 | self, self | IMMEDIATE 1 | turn_based 0 | utility, blight, weapon enhancement, universal |
| `tox_antidote` | Antidote | 1 | ACTION | 1 |  | vials 1 | single, touch, 5 ft | IMMEDIATE 1 | turn_based 0 | utility, healing, cure, universal |
| `tox_explosive_concoction` | Explosive Concoction | 3 | ACTION | 1 |  | vials 3 | area, ranged, 30 ft | IMMEDIATE 1 | turn_based 2 | aoe, ember, damage, explosive, universal |
| `tox_smoke_bomb` | Smoke Bomb | 2 | ACTION | 1 |  | vials 1 | area, ranged, 20 ft | IMMEDIATE 1 | turn_based 1 | utility, obscurement, tactical, universal |
| `tox_alchemical_outbreak` | Alchemical Outbreak | 8 | ACTION | 2 | 24 |  | single, ranged, 60 ft | IMMEDIATE 1 | turn_based 5 | damage, debuff, spreading, blight, level 8, toxicologist |
| `tox_mechanical_monstrosity` | Mechanical Monstrosity | 8 | ACTION | 2 | 32 |  | area, ranged, 30 ft | IMMEDIATE 1 | turn_based 6 | summoning, construct, level 8, toxicologist |
| `tox_sabotage_supreme` | Sabotage Supreme | 8 | ACTION | 2 | 32 |  | area, ranged, 60 ft | IMMEDIATE 1 | turn_based 5 | debuff, aoe, sabotage, level 8, toxicologist |
| `tox_extinction_toxin` | Extinction Toxin | 9 | ACTION | 3 | 27 |  | single, ranged, 60 ft | IMMEDIATE 1 | long_rest 1 | damage, blight, ultimate, level 9, toxicologist |
| `tox_war_machine` | War Machine | 9 | ACTION | 3 | 36 |  | area, ranged, 30 ft | IMMEDIATE 2 | long_rest 1 | summoning, construct, ultimate, level 9, toxicologist |
| `tox_total_system_failure` | Total System Failure | 9 | ACTION | 3 | 36 |  | area, ranged, 90 ft | IMMEDIATE 1 | long_rest 1 | debuff, aoe, dispel, ultimate, level 9, toxicologist |
| `tox_apocalypse_plague` | Apocalypse Plague | 10 | ACTION | 3 | 30 |  | area, self_centered | IMMEDIATE 2 | long_rest 1 | damage, debuff, aoe, ultimate, level 10, toxicologist |
| `tox_mechanical_army` | Mechanical Army | 10 | ACTION | 3 | 40 |  | area, ranged, 60 ft | IMMEDIATE 2 | long_rest 1 | summoning, army, construct, ultimate, level 10, toxicologist |
| `tox_reality_bomb` | Reality Bomb | 10 | ACTION | 3 | 40 |  | area, ranged, 120 ft | IMMEDIATE 1 | long_rest 1 | damage, control, anti magic, ultimate, level 10, toxicologist |
| `tox_poison_dart` | Poison Dart | 1 | ACTION | 1 | 2 |  | single, ranged, 40 ft | IMMEDIATE 1 | turn_based 0 | damage, blight, dart, universal |
| `tox_noxious_fumes` | Noxious Fumes | 1 | ACTION | 1 | 2 |  | area, ranged, 30 ft | IMMEDIATE 1 | turn_based 2 | damage, blight, zone, universal |
| `tox_purifying_antidote` | Purifying Antidote | 1 | ACTION | 1 | 2 |  | single, touch, 5 ft | IMMEDIATE 1 | turn_based 0 | purification, healing, antidote, universal |
| `tox_venom_blast` | Venom Blast | 3 | ACTION | 1 | 8 |  | single, ranged, 40 ft | IMMEDIATE 1 | turn_based 2 | damage, blight, venom, universal |
| `tox_toxic_shock` | Toxic Shock | 3 | ACTION | 1 | 8 |  | single, ranged, 30 ft | IMMEDIATE 1 | turn_based 3 | damage, blight, control, stun, universal |
| `tox_poison_bomb` | Poison Bomb | 4 | ACTION | 2 | 10 |  | area, ranged, 40 ft | IMMEDIATE 1 | turn_based 3 | damage, blight, aoe, bomb, universal |
| `tox_deadly_toxin` | Deadly Toxin | 5 | ACTION | 1 | 12 |  | single, ranged, 40 ft | IMMEDIATE 1 | turn_based 4 | damage, blight, dot, deadly, universal |
| `tox_toxic_wave` | Toxic Wave | 6 | ACTION | 2 | 14 |  | area, ranged, 60 ft | IMMEDIATE 1 | turn_based 4 | damage, blight, line, wave, universal |
| `tox_virulent_plague` | Virulent Plague | 7 | ACTION | 2 | 16 |  | chain, ranged, 50 ft | IMMEDIATE 1 | turn_based 6 | damage, blight, spreading, plague, universal |
| `tox_vial_dependency` | Vial Dependency | 1 | PASSIVE | 0 |  |  | self | PASSIVE 0 |  | passive, resource, vials, poison dependency, toxicologist |
| `tox_concoction_instability` | Concoction Instability | 3 | PASSIVE | 0 |  |  | self | PASSIVE 0 |  | passive, weakness, fire vulnerability, backlash, toxicologist |
| `tox_no_hard_cc` | Poison, Not Paralysis | 1 | PASSIVE | 0 |  |  | self | PASSIVE 0 |  | passive, restriction, no hard cc, nauseated, toxicologist |
| `tox_chemical_analysis` | Chemical Analysis | 1 | ACTION | 1 | 3 |  | single, touch | MINUTES 1 | turn_based 0 | utility, investigation, toxicologist |
| `tox_caustic_flask` | Caustic Flask | 1 | ACTION | 1 | 4 | vials 1 | single, touch | IMMEDIATE 1 | turn_based 0 | utility, exploration, infiltration, toxicologist |
| `tox_smoke_screen` | Smoke Screen | 2 | ACTION | 1 | 5 | vials 1 | area, ranged, 30 ft, circle 20 | IMMEDIATE 1 | turn_based 1 | utility, exploration, infiltration, toxicologist |
| `tox_brew_antidote` | Brew Antidote | 2 | ACTION | 1 | 6 | vials 1 | single, touch | MINUTES 10 | turn_based 0 | utility, investigation, exploration, toxicologist |
| `tox_slow_taint` | Slow Taint | 3 | ACTION | 1 | 8 | vials 2 | single, touch | IMMEDIATE 1 | turn_based 1 | utility, social, infiltration, toxicologist |
| `tox_alchemical_adhesive` | Alchemical Adhesive | 4 | ACTION | 1 | 8 |  | area, ranged, 35 ft | IMMEDIATE 1 | turn_based 3 | control, debuff, aoe, gadget, toxicologist |
| `tox_vapor_veil` | Vapor Veil | 4 | ACTION | 1 | 7 |  | area, self | IMMEDIATE 1 | turn_based 3 | buff, utility, aura, protection, toxicologist |
| `tox_narcotic_vapor` | Narcotic Vapor | 5 | ACTION | 1 | 10 |  | area, ranged, 40 ft | IMMEDIATE 1 | turn_based 4 | control, debuff, aoe, narcotic, toxicologist |
| `tox_calcified_antidote` | Calcified Antidote | 6 | ACTION | 1 | 11 |  | single, touch | IMMEDIATE 1 | turn_based 4 | buff, cleanse, defense, toxicologist |
| `tox_pneumatic_stasis_piston` | Pneumatic Stasis Piston | 6 | ACTION | 1 | 12 |  | single, ranged, 40 ft | IMMEDIATE 1 | turn_based 4 | control, debuff, gadget, sabotage, toxicologist |
| `tox_cryogenic_distillate` | Cryogenic Distillate | 7 | ACTION | 1 | 15 |  | area, ranged, 50 ft | IMMEDIATE 1 | turn_based 4 | control, aoe, environment, rime, toxicologist |
| `tox_caustic_deluge` | Caustic Deluge | 7 | ACTION | 2 | 16 |  | area, ranged, 45 ft | IMMEDIATE 2 | turn_based 4 | damage, debuff, aoe, blight, toxicologist |
| `tox_biochemical_siphon` | Biochemical Siphon | 8 | ACTION | 1 | 18 |  | single, ranged, 40 ft | IMMEDIATE 1 | turn_based 5 | buff, debuff, healing, tether, toxicologist |
| `tox_stasis_gas_dispersal` | Stasis Gas Dispersal | 9 | ACTION | 2 | 25 |  | area, ranged, 60 ft | IMMEDIATE 2 | long_rest 1 | control, aoe, stasis, ultimate, toxicologist |
| `tox_panacea_concoction` | Panacea Concoction | 10 | ACTION | 2 | 30 |  | area, self | IMMEDIATE 2 | long_rest 1 | buff, healing, cleanse, ultimate, toxicologist |

### Catalogue-only records not granted by pools (3)

| ID | Name | Lvl | Type | Description |
|---|---|---:|---|---|
| `tox_vial_dependency` | Vial Dependency | 1 | PASSIVE | Your poisons need reagents. Begin each encounter with 5 Vials; each poison spell costs 1. At 0 Vials, poison spells have a 50% chance to fail. Regain 1 Vial per enemy killed within 30ft. |
| `tox_concoction_instability` | Concoction Instability | 3 | PASSIVE | When you take fire or ember damage, one random poison active on an enemy prematurely detonates, dealing its remaining damage to YOU instead of the target. Your concoctions react poorly to heat. |
| `tox_no_hard_cc` | Poison, Not Paralysis | 1 | PASSIVE | No Stun, Paralyze, or Freeze. Your poisons NAUSEATE: disadvantage on attacks and checks, halved movement. Targets can still move and act; they just do it badly. You weaken, never lock down. |

### Talent trees

#### Venomancer (`venomancer`) — 18 nodes / 50 points

| ID | Name | Tier | Ranks | Type | Requires | Capstone |
|---|---|---:|---:|---|---|---|
| `vn_t1_venomous_core` | Envenomed Edge | 1 | 3 | PASSIVE |  |  |
| `vn_t1_venom_channels` | Venom Channels | 1 | 3 | PASSIVE |  |  |
| `vn_t1_neurotoxin` | Paralytic Tincture | 1 | 2 | PASSIVE |  |  |
| `vn_t2_hemotoxin` | Hemotoxin Needle | 2 | 3 | ACTIVE | `vn_t1_venomous_core` |  |
| `vn_t2_toxin_mastery` | Metabolic Drain | 2 | 3 | PASSIVE | `vn_t1_neurotoxin` |  |
| `vn_t3_toxic_cloud` | Noxious Cloud | 3 | 3 | ACTIVE | `vn_t2_hemotoxin` |  |
| `vn_t3_virulent_outbreak` | Virulent Spores | 3 | 3 | PASSIVE | `vn_t2_toxin_mastery` |  |
| `vn_t4_terminal_dosage` | Terminal Dosage | 4 | 2 | ACTIVE | `vn_t3_toxic_cloud,vn_t3_virulent_outbreak` |  |
| `vn_t5_viper_strike` | Viper Reflexes | 5 | 3 | PASSIVE | `vn_t4_terminal_dosage` |  |
| `vn_t5_immunological_breakdown` | Immunological Ruin | 5 | 2 | PASSIVE | `vn_t4_terminal_dosage` |  |
| `vn_t6_plague_mist` | Plague Mist Eruption | 6 | 3 | ACTIVE | `vn_t5_viper_strike,vn_t5_immunological_breakdown` |  |
| `vn_t4_mastery_focus` | Terminal Dosage Resonance | 4 | 3 | PASSIVE | `vn_t3_virulent_outbreak` |  |
| `vn_t6_unyielding_mastery` | Unyielding Resolve | 6 | 2 | PASSIVE | `vn_t5_immunological_breakdown` |  |
| `vn_t7_avatar_of_venom` | Avatar of the Viper | 7 | 1 | ACTIVE | `vn_t6_plague_mist` | yes |
| `vn_t7_doctrine_mastery` | Toxicologist Doctrine | 7 | 5 | PASSIVE | `vn_t6_plague_mist` | yes |
| `vn_t7_miasma_heart` | Miasma Heart | 7 | 3 | PASSIVE | `vn_t6_plague_mist` |  |
| `vn_t7_catalytic_detonation` | Catalytic Shock | 7 | 3 | PASSIVE | `vn_t6_plague_mist` |  |
| `vn_t7_capstone_gamma` | Transcendent Precision | 7 | 3 | PASSIVE | `vn_t6_plague_mist` | yes |

#### Gadgeteer (`gadgeteer`) — 18 nodes / 50 points

| ID | Name | Tier | Ranks | Type | Requires | Capstone |
|---|---|---:|---:|---|---|---|
| `gd_t1_quick_snare` | Spring Snare | 1 | 3 | ACTIVE |  |  |
| `gd_t1_armature` | Spring Armature | 1 | 3 | PASSIVE |  |  |
| `gd_t1_clockwork_plating` | Reinforced Bracing | 1 | 2 | PASSIVE |  |  |
| `gd_t2_smoke_canister` | Alchemical Smoke | 2 | 3 | ACTIVE | `gd_t1_quick_snare` |  |
| `gd_t2_dart_turret` | Miniature Turret | 2 | 3 | ACTIVE | `gd_t1_clockwork_plating` |  |
| `gd_t3_flashbang` | Flashbang Grenade | 3 | 3 | ACTIVE | `gd_t2_smoke_canister` |  |
| `gd_t3_overclock_gears` | Pneumatic Thrusters | 3 | 3 | PASSIVE | `gd_t2_dart_turret` |  |
| `gd_t4_grapnel_wire` | Grapnel Winch | 4 | 2 | ACTIVE | `gd_t3_flashbang,gd_t3_overclock_gears` |  |
| `gd_t5_shrapnel_mine` | Claymore Mine | 5 | 3 | ACTIVE | `gd_t4_grapnel_wire` |  |
| `gd_t5_overclocked_core` | Clockwork Exoskeleton | 5 | 2 | PASSIVE | `gd_t4_grapnel_wire` |  |
| `gd_t6_automaton_colossus` | Deployable Automaton | 6 | 3 | ACTIVE | `gd_t5_shrapnel_mine,gd_t5_overclocked_core` |  |
| `gd_t4_mastery_focus` | Grapnel Winch Resonance | 4 | 3 | PASSIVE | `gd_t3_overclock_gears` |  |
| `gd_t6_unyielding_mastery` | Unyielding Resolve | 6 | 2 | PASSIVE | `gd_t5_overclocked_core` |  |
| `gd_t7_grand_mechanic` | Grand Mechanist Overdrive | 7 | 1 | ACTIVE | `gd_t6_automaton_colossus` | yes |
| `gd_t7_doctrine_mastery` | Toxicologist Doctrine | 7 | 5 | PASSIVE | `gd_t6_automaton_colossus` | yes |
| `gd_t7_salvage_protocol` | Salvage Protocol | 7 | 3 | PASSIVE | `gd_t6_automaton_colossus` |  |
| `gd_t7_hypercharged_munitions` | Tungsten Munitions | 7 | 3 | PASSIVE | `gd_t6_automaton_colossus` |  |
| `gd_t7_capstone_gamma` | Transcendent Precision | 7 | 3 | PASSIVE | `gd_t6_automaton_colossus` | yes |

#### Saboteur (`saboteur`) — 18 nodes / 50 points

| ID | Name | Tier | Ranks | Type | Requires | Capstone |
|---|---|---:|---:|---|---|---|
| `sb_t1_corrosive_flask` | Vitriol Flask | 1 | 3 | ACTIVE |  |  |
| `sb_t1_caustic_coating` | Caustic Coating | 1 | 3 | PASSIVE |  |  |
| `sb_t1_demolition_insight` | Demolition Insight | 1 | 2 | PASSIVE |  |  |
| `sb_t2_breaching_charge` | Breaching Charge | 2 | 3 | ACTIVE | `sb_t1_corrosive_flask` |  |
| `sb_t2_corrosive_puddle` | Acid Trap | 2 | 3 | ACTIVE | `sb_t1_demolition_insight` |  |
| `sb_t3_vitriol_stream` | Vitriol Torrent | 3 | 3 | ACTIVE | `sb_t2_breaching_charge` |  |
| `sb_t3_reactive_coating` | Ablative Slag Plating | 3 | 3 | PASSIVE | `sb_t2_corrosive_puddle` |  |
| `sb_t4_thermite_blast` | Thermite Core Bomb | 4 | 2 | ACTIVE | `sb_t3_vitriol_stream,sb_t3_reactive_coating` |  |
| `sb_t5_corrosive_fumes` | Caustic Fumes | 5 | 3 | PASSIVE | `sb_t4_thermite_blast` |  |
| `sb_t5_structural_collapse` | Structural Shatter | 5 | 2 | PASSIVE | `sb_t4_thermite_blast` |  |
| `sb_t6_obliteration_payload` | Obliteration Payload | 6 | 3 | ACTIVE | `sb_t5_corrosive_fumes,sb_t5_structural_collapse` |  |
| `sb_t4_mastery_focus` | Thermite Core Bomb Resonance | 4 | 3 | PASSIVE | `sb_t3_reactive_coating` |  |
| `sb_t6_unyielding_mastery` | Unyielding Resolve | 6 | 2 | PASSIVE | `sb_t5_structural_collapse` |  |
| `sb_t7_master_saboteur` | Master of Cataclysm | 7 | 1 | ACTIVE | `sb_t6_obliteration_payload` | yes |
| `sb_t7_doctrine_mastery` | Toxicologist Doctrine | 7 | 5 | PASSIVE | `sb_t6_obliteration_payload` | yes |
| `sb_t7_chain_detonation` | Chain Detonation | 7 | 3 | PASSIVE | `sb_t6_obliteration_payload` |  |
| `sb_t7_impervious_hazmat` | Impervious Hazmat Suit | 7 | 3 | PASSIVE | `sb_t6_obliteration_payload` |  |
| `sb_t7_capstone_gamma` | Transcendent Precision | 7 | 3 | PASSIVE | `sb_t6_obliteration_payload` | yes |

### Capstones

| ID | Name | Tree | Tier | Ranks |
|---|---|---|---:|---:|
| `vn_t7_avatar_of_venom` | Avatar of the Viper | Venomancer | 7 | 1 |
| `vn_t7_doctrine_mastery` | Toxicologist Doctrine | Venomancer | 7 | 5 |
| `vn_t7_capstone_gamma` | Transcendent Precision | Venomancer | 7 | 3 |
| `gd_t7_grand_mechanic` | Grand Mechanist Overdrive | Gadgeteer | 7 | 1 |
| `gd_t7_doctrine_mastery` | Toxicologist Doctrine | Gadgeteer | 7 | 5 |
| `gd_t7_capstone_gamma` | Transcendent Precision | Gadgeteer | 7 | 3 |
| `sb_t7_master_saboteur` | Master of Cataclysm | Saboteur | 7 | 1 |
| `sb_t7_doctrine_mastery` | Toxicologist Doctrine | Saboteur | 7 | 5 |
| `sb_t7_capstone_gamma` | Transcendent Precision | Saboteur | 7 | 3 |

## Failure cases and runtime limits

- Spell execution, damage, conditions, contagion/spread, containment outcomes and resource application remain manual tabletop operations. This lock does not claim automated combat execution.
- Inquisitor Authority, Spellguard AEP intake/venting and Toxicologist vial/part expenditure are tracked through their existing contracts, but the contracts do not auto-run spell effects or infer damage.
- No starting spell is randomly assigned and no automatic top-up occurs. Existing known spells are preserved.
- Existing saves are not migrated, renamed or converted. Legacy IDs remain the authored identifiers.
- The tree nodes retain their existing 5-point-ladder layout; no new level gate, `requiresPoints` or `minLevel` metadata was authored for these three retained classes in this cohort.
- Spellguard uses legacy `aep` in `classResource` and `arcane_energy_points` in spell costs while the initialized engine resource is `arcaneEnergyPoints`; this lock preserves the existing IDs rather than silently canonicalizing them.

## Source hashes

The JSON lock lists all hashed authority files. Core executable sources:

| Path | SHA-256 |
|---|---|
| `vtt-react/src/data/classes/inquisitorData.js` | `72212b3d6bdc3087679fe42088d75534066437b2a120ee488a23df380d30e28a` |
| `vtt-react/src/data/classes/spellguardData.js` | `3b1e01b76db7d028e6bf1f148f8b2b48b0f91e19a1207dca4c4f2d0e959e548c` |
| `vtt-react/src/data/classes/toxicologistData.js` | `0d25b0092dc843ac579b42442a3c101205c0872e47fb3c6a44f8470b23b648fd` |
| `vtt-react/src/data/talentTrees/inquisitor.js` | `2ba6362de7c51b7157a153f7c3ec6a0ae684b9f5d707cd130e8649316bab4f42` |
| `vtt-react/src/data/talentTrees/inquisitorWitchHammer.js` | `a6c12c875e8a353c60395963b6f1cc6bf52d76dda2438c30605521d240ba3328` |
| `vtt-react/src/data/talentTrees/inquisitorIronVerdict.js` | `b5df1685479feae356548c17ccc338a247010c59b764e7aeb849bf307f63eaf5` |
| `vtt-react/src/data/talentTrees/inquisitorHollowSaint.js` | `04d0169559039b04f276c359556f99dcfcf6dbd27c5e29aac8ca195ae28e6a9a` |
| `vtt-react/src/data/talentTrees/spellguard.js` | `7833e863d3635633359d27fe49b98daea11449787a6f1fda2e0e3ab905cfe668` |
| `vtt-react/src/data/talentTrees/spellguardArcaneWarden.js` | `f745b7ca35326ae2b4bcbb569a8e518cdd340b0a878fc05f1ad76344a0a2f442` |
| `vtt-react/src/data/talentTrees/spellguardSpellBreaker.js` | `47294b9db59a2317122a4da432d7d3716f1301f9fba83d2f1c5c6d32d372db99` |
| `vtt-react/src/data/talentTrees/spellguardManaReaver.js` | `ca6d0c388591cc6bd0466e09bdc0b316b42edba40dae1a2c7d71061f6509d330` |
| `vtt-react/src/data/talentTrees/toxicologist.js` | `7ac9e7c12c19e58107485f59724163ec82fc21712d85f6fde823cfa4faf90c09` |
| `vtt-react/src/data/talentTrees/toxicologistVenomancer.js` | `6bc4e6fbf9eb67344cb611f5f83c10125aeefc3e8e2872e344254015a0ae3139` |
| `vtt-react/src/data/talentTrees/toxicologistGadgeteer.js` | `e785ec0560be4bb8acb6d3a5f700c6c45cd7226e3467885bbabcccdf3efaef96` |
| `vtt-react/src/data/talentTrees/toxicologistSaboteur.js` | `c95e24ae389a1fc5a01df4602ed035295477ea94a2559f8607aecbb97324c314` |
| `vtt-react/src/data/inquisitorResourceContract.js` | `f8dcf0c354bad2ac259ce0c20431aba25e66cb60347b924e76369fabf6cc49af` |
| `vtt-react/src/data/spellguardResourceContract.js` | `52bf08fcdaea7d7fd6cf03369125a185f77084b575481ea5847e7db0f9304387` |
| `vtt-react/src/data/toxicologistResourceContract.js` | `a4bdb11c8702bc58093b689c96120b3e5fd6acaa39d519ab318e1211ad3548b1` |
| `vtt-react/src/data/resourceSystems/inquisitorResourceGuide.js` | `4e6ca39c76a6cb32907798e355a3c490096313afd86f79918465cdc22ebfc599` |
| `vtt-react/src/data/resourceSystems/spellguardResourceGuide.js` | `a2ff96001e1faa037533c0efdc1690d2502e3057f63e917a7b4fcb51025b895a` |
| `vtt-react/src/data/resourceSystems/toxicologistResourceGuide.js` | `fa676cdf1ada4e4e3ce3c225709405b5066390207fd99413e212a0dfa4b8f9a8` |
| `vtt-react/src/data/classes/inquisitor/components/InquisitorResourceBar.jsx` | `7b3412d8930652cd7ebc8e13d44510f736dbc99c6aa478654cdca2fade4ebb51` |
| `vtt-react/src/data/classes/spellguard/components/SpellguardResourceBar.jsx` | `1db3a1cc99b689441ebd8a7fdf9e5c8d9be4eca1a110bde7c923288ec3a05189` |
| `vtt-react/src/data/classes/toxicologist/components/ToxicologistResourceBar.jsx` | `cb68f6b60e12ef4ea8e11ea12f2fb882d229767475b821f2d30a307f24ceebdc` |

## Known limits

- This is a legacy-content lock, not a new CR1 96-record package.
- The three classes keep their existing tree gates and legacy resource-key spellings.
- Guest/local persistence is verified separately in the report; cloud persistence, migration, balance validation and production admission are not claimed.
- No commit, push or deploy is part of this lock.
