# RI-5 Doomsayer and Oracle — complete content lock

Generated from `CONTENT-LOCK.json` on 2026-10-25T19:18:17.306Z. Ruleset `cr-review-r1`. Manual tabletop only; no commit, push or deploy.

## Shared boundaries

- Doomsayer is the approved player-facing successor name for Harbinger. Legacy `harbinger` data, Mayhem, spells, trees, nodes, variants and saved IDs remain resolvable with no automatic conversion.
- Oracle is independent. It does not inherit Augur Benediction/Malediction, Omen Debt, Fate Weaver links or any die-replacement economy.
- Both classes are `development` status and register through the normal catalogue, detail, spell generation, creation, level-up, talent, resource, sheet and HUD seams.
- Neither class registers a native heritage edge. Recommendations are evidence-based but pending approval.
- No automatic combat, resource, save/reopen, account/cloud persistence or migration behavior is claimed.

## Doomsayer

- Class ID: `doomsayer`
- Role: Doom Caster / Control
- Resource: Calamities & Havoc
- Primary / secondary: Intelligence / Spirit
- Heritage recommendation: skald_human, thrask_solari, tessen_human (not registered)
- Acquisition records: witnessed_calamity, doom_arithmetic, disruption_method, forewarning_accounting
- Status: development; heritage effects implemented: false

### Counts

| Metric | Count |
|---|---:|
| Core grants | 2 |
| Optional records | 40 |
| Optional records per level | 4 |
| Signature actives | 3 |
| Capstone actives | 3 |
| Passive records | 48 |
| Talent nodes | 54 |
| Talent ranks | 150 |
| Unique authored records | 96 |
| Action records | 48 |
| Passive records (authored) | 48 |

### Core grants

- `cr1_doomsayer_plant_calamity` — Plant the Calamity (1 AP)
- `cr1_doomsayer_dismantle_calamity` — Dismantle the Sign (1 AP)

### Optional pool by level

| Level | IDs | Names |
|---:|---|---|
| 1 | `cr1_doomsayer_doom_bolt`<br>`cr1_doomsayer_omen_of_ash`<br>`cr1_doomsayer_forewarned_step`<br>`cr1_doomsayer_read_the_ledger` | Doom Bolt<br>Omen of Ash<br>Forewarned Step<br>Read the Ledger |
| 2 | `cr1_doomsayer_doom_countdown`<br>`cr1_doomsayer_calamity_zone`<br>`cr1_doomsayer_death_mark`<br>`cr1_doomsayer_prophets_warning` | Doom Countdown<br>Calamity Zone<br>Death Mark<br>Prophet's Warning |
| 3 | `cr1_doomsayer_havoc_blast`<br>`cr1_doomsayer_escalating_doom`<br>`cr1_doomsayer_rain_of_doom`<br>`cr1_doomsayer_requiem_of_silence` | Havoc Blast<br>Escalating Doom<br>Rain of Doom<br>Requiem of Silence |
| 4 | `cr1_doomsayer_requiem_of_death`<br>`cr1_doomsayer_doom_aura`<br>`cr1_doomsayer_cataclysm_blast`<br>`cr1_doomsayer_disruption_ward` | Requiem of Death<br>Doom Aura<br>Cataclysm Blast<br>Disruption Ward |
| 5 | `cr1_doomsayer_prophecy_of_ruin`<br>`cr1_doomsayer_stacked_doom`<br>`cr1_doomsayer_doom_nova`<br>`cr1_doomsayer_foretold_escape` | Prophecy of Ruin<br>Stacked Doom<br>Doom Nova<br>Foretold Escape |
| 6 | `cr1_doomsayer_cascade_doom`<br>`cr1_doomsayer_endbringer_finale`<br>`cr1_doomsayer_execution_prophecy`<br>`cr1_doomsayer_omen_shield` | Cascade Doom<br>Endbringer Finale<br>Execution Prophecy<br>Omen Shield |
| 7 | `cr1_doomsayer_armageddon_herald`<br>`cr1_doomsayer_apocalypse_zone`<br>`cr1_doomsayer_prophecy_of_annihilation`<br>`cr1_doomsayer_forewarned_retreat` | Armageddon Herald<br>Apocalypse Zone<br>Prophecy of Annihilation<br>Forewarned Retreat |
| 8 | `cr1_doomsayer_twist_of_doom`<br>`cr1_doomsayer_doom_legion`<br>`cr1_doomsayer_death_sentence`<br>`cr1_doomsayer_calamity_ward` | Twist of Doom<br>Doom Legion<br>Death Sentence<br>Calamity Ward |
| 9 | `cr1_doomsayer_the_end`<br>`cr1_doomsayer_cataclysm_incarnate`<br>`cr1_doomsayer_requiem_absolute`<br>`cr1_doomsayer_last_forewarning` | The End<br>Cataclysm Incarnate<br>Requiem Absolute<br>Last Forewarning |
| 10 | `cr1_doomsayer_herald_of_the_end`<br>`cr1_doomsayer_end_of_all_things`<br>`cr1_doomsayer_final_requiem`<br>`cr1_doomsayer_unmaking_word` | Herald of the End<br>End of All Things<br>Final Requiem<br>Unmaking Word |

### Trees and gates

| Tree | ID | Nodes | Ranks | Signature | Capstone |
|---|---|---:|---:|---|---|
| Requiem | `requiem` | 18 | 50 | `cr1_doomsayer_requiem_signature` → `quiet_requiem` | `cr1_doomsayer_requiem_capstone` → `absolute_requiem` |
| Endbringer | `endbringer` | 18 | 50 | `cr1_doomsayer_endbringer_signature` → `lengthen_the_hour` | `cr1_doomsayer_endbringer_capstone` → `the_last_hour` |
| Forewarner | `forewarner` | 18 | 50 | `cr1_doomsayer_forewarner_signature` → `sound_the_warning` | `cr1_doomsayer_forewarner_capstone` → `the_published_doom` |

#### Requiem — Finish one declared ending before it can be answered.

| Slot | Node ID | Passive ID | Name | Ranks | Min level | In-tree points | Prerequisites | Rank values |
|---|---|---|---|---:|---:|---:|---|---|
| p01 | `cr1_doomsayer_requiem_p01` | `cr1_doomsayer_rq_first_knife` | First Knife | 3 | 1 | 0 | — | 1 / 2 / 3 |
| p02 | `cr1_doomsayer_requiem_p02` | `cr1_doomsayer_rq_narrow_hour` | Narrow Hour | 3 | 1 | 0 | — | 1 / 2 / 3 |
| p03 | `cr1_doomsayer_requiem_p03` | `cr1_doomsayer_rq_sorrow_harvest` | Sorrow Harvest | 3 | 1 | 0 | — | 1 / 2 / 3 |
| p04 | `cr1_doomsayer_requiem_p04` | `cr1_doomsayer_rq_death_mark` | Death Mark | 3 | 2 | 5 | `cr1_doomsayer_requiem_p01` | 1 / 2 / 3 |
| p05 | `cr1_doomsayer_requiem_p05` | `cr1_doomsayer_rq_last_word` | Last Word | 3 | 3 | 10 | `cr1_doomsayer_requiem_p03` | 1 / 2 / 3 |
| p06 | `cr1_doomsayer_requiem_p06` | `cr1_doomsayer_rq_requiem_range` | Requiem Range | 3 | 3 | 10 | `cr1_doomsayer_requiem_p04` | 5 / 10 / 15 |
| p07 | `cr1_doomsayer_requiem_p07` | `cr1_doomsayer_rq_binding_omen` | Binding Omen | 3 | 4 | 15 | `cr1_doomsayer_requiem_p05`, `cr1_doomsayer_requiem_signature` | 1 / 2 / 3 |
| p08 | `cr1_doomsayer_requiem_p08` | `cr1_doomsayer_rq_silent_count` | Silent Count | 3 | 4 | 15 | `cr1_doomsayer_requiem_p06` | 1 / 2 / 3 |
| p09 | `cr1_doomsayer_requiem_p09` | `cr1_doomsayer_rq_steadfast_doom` | Steadfast Doom | 3 | 5 | 20 | `cr1_doomsayer_requiem_p07` | 1 / 2 / 3 |
| p10 | `cr1_doomsayer_requiem_p10` | `cr1_doomsayer_rq_executioner` | Executioner | 3 | 5 | 20 | `cr1_doomsayer_requiem_p08` | 1 / 2 / 3 |
| p11 | `cr1_doomsayer_requiem_p11` | `cr1_doomsayer_rq_second_verse` | Second Verse | 3 | 6 | 25 | `cr1_doomsayer_requiem_p09` | 1 / 2 / 3 |
| p12 | `cr1_doomsayer_requiem_p12` | `cr1_doomsayer_rq_grave_patience` | Grave Patience | 3 | 6 | 25 | `cr1_doomsayer_requiem_p10` | 1 / 2 / 3 |
| p13 | `cr1_doomsayer_requiem_p13` | `cr1_doomsayer_rq_pallbearer` | Pallbearer | 3 | 7 | 30 | `cr1_doomsayer_requiem_p11` | 5 / 10 / 15 |
| p14 | `cr1_doomsayer_requiem_p14` | `cr1_doomsayer_rq_final_measure` | Final Measure | 3 | 8 | 35 | `cr1_doomsayer_requiem_p12` | 1 / 2 / 3 |
| p15 | `cr1_doomsayer_requiem_p15` | `cr1_doomsayer_rq_unbroken_verse` | Unbroken Verse | 3 | 9 | 40 | `cr1_doomsayer_requiem_p13` | 1 / 2 / 3 |
| p16 | `cr1_doomsayer_requiem_p16` | `cr1_doomsayer_rq_requiem_mastery` | Requiem Mastery | 3 | 10 | 45 | `cr1_doomsayer_requiem_p14` | 1 / 2 / 3 |
Signature: `cr1_doomsayer_requiem_signature` (level 3, 10 in-tree points, prerequisites `cr1_doomsayer_requiem_p01`, `cr1_doomsayer_requiem_p02`).
Capstone: `cr1_doomsayer_requiem_capstone` (level 10, 45 in-tree points, prerequisites `cr1_doomsayer_requiem_p15`, `cr1_doomsayer_requiem_signature`).

#### Endbringer — Make a public calamity heavier, wider and later.

| Slot | Node ID | Passive ID | Name | Ranks | Min level | In-tree points | Prerequisites | Rank values |
|---|---|---|---|---:|---:|---:|---|---|
| p01 | `cr1_doomsayer_endbringer_p01` | `cr1_doomsayer_eb_widened_hour` | Widened Hour | 3 | 1 | 0 | — | 5 / 10 / 15 |
| p02 | `cr1_doomsayer_endbringer_p02` | `cr1_doomsayer_eb_slow_bell` | Slow Bell | 3 | 1 | 0 | — | 1 / 2 / 3 |
| p03 | `cr1_doomsayer_endbringer_p03` | `cr1_doomsayer_eb_escalation` | Escalation | 3 | 1 | 0 | — | 1 / 2 / 3 |
| p04 | `cr1_doomsayer_endbringer_p04` | `cr1_doomsayer_eb_havoc_overflow` | Havoc Overflow | 3 | 2 | 5 | `cr1_doomsayer_endbringer_p01` | 1 / 2 / 3 |
| p05 | `cr1_doomsayer_endbringer_p05` | `cr1_doomsayer_eb_doom_aura` | Doom Aura | 3 | 3 | 10 | `cr1_doomsayer_endbringer_p03` | 5 / 10 / 15 |
| p06 | `cr1_doomsayer_endbringer_p06` | `cr1_doomsayer_eb_second_clock` | Second Clock | 3 | 3 | 10 | `cr1_doomsayer_endbringer_p04` | 1 / 2 / 3 |
| p07 | `cr1_doomsayer_endbringer_p07` | `cr1_doomsayer_eb_ruin_range` | Ruin Range | 3 | 4 | 15 | `cr1_doomsayer_endbringer_p05`, `cr1_doomsayer_endbringer_signature` | 5 / 10 / 15 |
| p08 | `cr1_doomsayer_endbringer_p08` | `cr1_doomsayer_eb_crushing_weight` | Crushing Weight | 3 | 4 | 15 | `cr1_doomsayer_endbringer_p06` | 1 / 2 / 3 |
| p09 | `cr1_doomsayer_endbringer_p09` | `cr1_doomsayer_eb_enduring_doom` | Enduring Doom | 3 | 5 | 20 | `cr1_doomsayer_endbringer_p07` | 1 / 2 / 3 |
| p10 | `cr1_doomsayer_endbringer_p10` | `cr1_doomsayer_eb_field_of_ash` | Field of Ash | 3 | 5 | 20 | `cr1_doomsayer_endbringer_p08` | 5 / 10 / 15 |
| p11 | `cr1_doomsayer_endbringer_p11` | `cr1_doomsayer_eb_delayed_payoff` | Delayed Payoff | 3 | 6 | 25 | `cr1_doomsayer_endbringer_p09` | 1 / 2 / 3 |
| p12 | `cr1_doomsayer_endbringer_p12` | `cr1_doomsayer_eb_cataclysm_mark` | Cataclysm Mark | 3 | 6 | 25 | `cr1_doomsayer_endbringer_p10` | 1 / 2 / 3 |
| p13 | `cr1_doomsayer_endbringer_p13` | `cr1_doomsayer_eb_tolling_bell` | Tolling Bell | 3 | 7 | 30 | `cr1_doomsayer_endbringer_p11` | 1 / 2 / 3 |
| p14 | `cr1_doomsayer_endbringer_p14` | `cr1_doomsayer_eb_wide_warning` | Wide Warning | 3 | 8 | 35 | `cr1_doomsayer_endbringer_p12` | 5 / 10 / 15 |
| p15 | `cr1_doomsayer_endbringer_p15` | `cr1_doomsayer_eb_last_quake` | Last Quake | 3 | 9 | 40 | `cr1_doomsayer_endbringer_p13` | 1 / 2 / 3 |
| p16 | `cr1_doomsayer_endbringer_p16` | `cr1_doomsayer_eb_endbringer_mastery` | Endbringer Mastery | 3 | 10 | 45 | `cr1_doomsayer_endbringer_p14` | 1 / 2 / 3 |
Signature: `cr1_doomsayer_endbringer_signature` (level 3, 10 in-tree points, prerequisites `cr1_doomsayer_endbringer_p01`, `cr1_doomsayer_endbringer_p02`).
Capstone: `cr1_doomsayer_endbringer_capstone` (level 10, 45 in-tree points, prerequisites `cr1_doomsayer_endbringer_p15`, `cr1_doomsayer_endbringer_signature`).

#### Forewarner — Publish the ending early enough that allies can survive it.

| Slot | Node ID | Passive ID | Name | Ranks | Min level | In-tree points | Prerequisites | Rank values |
|---|---|---|---|---:|---:|---:|---|---|
| p01 | `cr1_doomsayer_forewarner_p01` | `cr1_doomsayer_fw_clear_signal` | Clear Signal | 3 | 1 | 0 | — | 5 / 10 / 15 |
| p02 | `cr1_doomsayer_forewarner_p02` | `cr1_doomsayer_fw_sheltered_ally` | Sheltered Ally | 3 | 1 | 0 | — | 1 / 2 / 3 |
| p03 | `cr1_doomsayer_forewarner_p03` | `cr1_doomsayer_fw_public_omen` | Public Omen | 3 | 1 | 0 | — | 1 / 2 / 3 |
| p04 | `cr1_doomsayer_forewarner_p04` | `cr1_doomsayer_fw_read_the_sky` | Read the Sky | 3 | 2 | 5 | `cr1_doomsayer_forewarner_p01` | 1 / 2 / 3 |
| p05 | `cr1_doomsayer_forewarner_p05` | `cr1_doomsayer_fw_guided_step` | Guided Step | 3 | 3 | 10 | `cr1_doomsayer_forewarner_p03` | 5 / 10 / 15 |
| p06 | `cr1_doomsayer_forewarner_p06` | `cr1_doomsayer_fw_steady_voice` | Steady Voice | 3 | 3 | 10 | `cr1_doomsayer_forewarner_p04` | 1 / 2 / 3 |
| p07 | `cr1_doomsayer_forewarner_p07` | `cr1_doomsayer_fw_shared_portent` | Shared Portent | 3 | 4 | 15 | `cr1_doomsayer_forewarner_p05`, `cr1_doomsayer_forewarner_signature` | 1 / 2 / 3 |
| p08 | `cr1_doomsayer_forewarner_p08` | `cr1_doomsayer_fw_shelter_line` | Shelter Line | 3 | 4 | 15 | `cr1_doomsayer_forewarner_p06` | 1 / 2 / 3 |
| p09 | `cr1_doomsayer_forewarner_p09` | `cr1_doomsayer_fw_forewarned` | Forewarned | 3 | 5 | 20 | `cr1_doomsayer_forewarner_p07` | 1 / 2 / 3 |
| p10 | `cr1_doomsayer_forewarner_p10` | `cr1_doomsayer_fw_mercy_of_the_bell` | Mercy of the Bell | 3 | 5 | 20 | `cr1_doomsayer_forewarner_p08` | 1 / 2 / 3 |
| p11 | `cr1_doomsayer_forewarner_p11` | `cr1_doomsayer_fw_loud_and_clear` | Loud and Clear | 3 | 6 | 25 | `cr1_doomsayer_forewarner_p09` | 5 / 10 / 15 |
| p12 | `cr1_doomsayer_forewarner_p12` | `cr1_doomsayer_fw_no_panic` | No Panic | 3 | 6 | 25 | `cr1_doomsayer_forewarner_p10` | 1 / 2 / 3 |
| p13 | `cr1_doomsayer_forewarner_p13` | `cr1_doomsayer_fw_herald_memory` | Herald Memory | 3 | 7 | 30 | `cr1_doomsayer_forewarner_p11` | 1 / 2 / 3 |
| p14 | `cr1_doomsayer_forewarner_p14` | `cr1_doomsayer_fw_sheltering_word` | Sheltering Word | 3 | 8 | 35 | `cr1_doomsayer_forewarner_p12` | 1 / 2 / 3 |
| p15 | `cr1_doomsayer_forewarner_p15` | `cr1_doomsayer_fw_last_warning` | Last Warning | 3 | 9 | 40 | `cr1_doomsayer_forewarner_p13` | 1 / 2 / 3 |
| p16 | `cr1_doomsayer_forewarner_p16` | `cr1_doomsayer_fw_forewarner_mastery` | Forewarner Mastery | 3 | 10 | 45 | `cr1_doomsayer_forewarner_p14` | 1 / 2 / 3 |
Signature: `cr1_doomsayer_forewarner_signature` (level 3, 10 in-tree points, prerequisites `cr1_doomsayer_forewarner_p01`, `cr1_doomsayer_forewarner_p02`).
Capstone: `cr1_doomsayer_forewarner_capstone` (level 10, 45 in-tree points, prerequisites `cr1_doomsayer_forewarner_p15`, `cr1_doomsayer_forewarner_signature`).

### Talent actives

| ID | Name | Source | AP |
|---|---|---|---:|
| `cr1_doomsayer_quiet_requiem` | Quiet Requiem | talent-signature | 2 |
| `cr1_doomsayer_lengthen_the_hour` | Lengthen the Hour | talent-signature | 2 |
| `cr1_doomsayer_sound_the_warning` | Sound the Warning | talent-signature | 1 |
| `cr1_doomsayer_absolute_requiem` | Absolute Requiem | talent-capstone | 3 |
| `cr1_doomsayer_the_last_hour` | The Last Hour | talent-capstone | 3 |
| `cr1_doomsayer_the_published_doom` | The Published Doom | talent-capstone | 3 |

### Resource rules

```json
{
  "calamityMax": 2,
  "clockMin": 1,
  "clockMax": 3,
  "havocMin": 0,
  "havocMax": 15,
  "havocOnTrigger": 3,
  "havocOnExpiry": 1,
  "havocOnDismantle": 0,
  "statuses": [
    "active",
    "resolved",
    "dismantled",
    "expired"
  ],
  "publicDeclarations": true,
  "refreshOnLongRest": true,
  "refreshHavocOnLongRest": true,
  "refreshOnReconnect": false,
  "refreshOnInitiative": false,
  "automaticResolution": false,
  "automaticClockAdvance": false,
  "hiddenInformation": false,
  "mechanicalHeritageBenefits": false,
  "manualOnly": true
}
```

### Resource system summary

- State type: `doom-calamities`
- Manual only: true
- Summon/Forecast state starts uninitialized and never invents a record.

## Oracle

- Class ID: `oracle`
- Role: Support / Insight
- Resource: Forecasts
- Primary / secondary: Spirit / Intelligence
- Heritage recommendation: vashir_astril, ordan_human (not registered)
- Acquisition records: observed_omen, forecast_discipline, expiry_accounting, bounded_reading
- Status: development; heritage effects implemented: false

### Counts

| Metric | Count |
|---|---:|
| Core grants | 2 |
| Optional records | 40 |
| Optional records per level | 4 |
| Signature actives | 3 |
| Capstone actives | 3 |
| Passive records | 48 |
| Talent nodes | 54 |
| Talent ranks | 150 |
| Unique authored records | 96 |
| Action records | 48 |
| Passive records (authored) | 48 |

### Core grants

- `cr1_oracle_commit_forecast` — Commit a Forecast (1 AP)
- `cr1_oracle_release_forecast` — Release the Forecast (1 AP)

### Optional pool by level

| Level | IDs | Names |
|---:|---|---|
| 1 | `cr1_oracle_shared_vision`<br>`cr1_oracle_omen_reading`<br>`cr1_oracle_fates_whisper_strike`<br>`cr1_oracle_prophetic_shield` | Shared Vision<br>Omen Reading<br>Fate's Whisper Strike<br>Prophetic Shield |
| 2 | `cr1_oracle_foresight`<br>`cr1_oracle_past_sight`<br>`cr1_oracle_read_the_public_line`<br>`cr1_oracle_reveal_weakness` | Foresight<br>Past Sight<br>Read the Public Line<br>Reveal Weakness |
| 3 | `cr1_oracle_piercing_gaze`<br>`cr1_oracle_prophecy_of_doom`<br>`cr1_oracle_fate_strike`<br>`cr1_oracle_guided_step` | Piercing Gaze<br>Prophecy of Doom<br>Fate Strike<br>Guided Step |
| 4 | `cr1_oracle_warding_vision`<br>`cr1_oracle_expose_secrets`<br>`cr1_oracle_foretold_opening`<br>`cr1_oracle_fate_strike_greater` | Warding Vision<br>Expose Secrets<br>Foretold Opening<br>Fate Strike, Greater |
| 5 | `cr1_oracle_past_sins`<br>`cr1_oracle_future_strike`<br>`cr1_oracle_prophetic_ward`<br>`cr1_oracle_far_sight` | Past Sins<br>Future Strike<br>Prophetic Ward<br>Far Sight |
| 6 | `cr1_oracle_foretold_opening_greater`<br>`cr1_oracle_timeline_anchor`<br>`cr1_oracle_expose_weakness_greater`<br>`cr1_oracle_fate_strike_major` | Foretold Opening, Greater<br>Timeline Anchor<br>Expose Weakness, Greater<br>Fate Strike, Major |
| 7 | `cr1_oracle_prescient_dodge`<br>`cr1_oracle_expose_secrets_greater`<br>`cr1_oracle_shared_portent`<br>`cr1_oracle_destiny_lock` | Prescient Dodge<br>Expose Secrets, Greater<br>Shared Portent<br>Destiny Lock |
| 8 | `cr1_oracle_perfect_foresight`<br>`cr1_oracle_psychic_assault`<br>`cr1_oracle_rewrite_preparation`<br>`cr1_oracle_prophets_refuge` | Perfect Foresight<br>Psychic Assault<br>Rewrite Preparation<br>Prophet's Refuge |
| 9 | `cr1_oracle_the_widest_reading`<br>`cr1_oracle_the_prepared_hour`<br>`cr1_oracle_immediate_forecast`<br>`cr1_oracle_the_clear_answer` | The Widest Reading<br>The Prepared Hour<br>Immediate Forecast<br>The Clear Answer |
| 10 | `cr1_oracle_the_final_forecast`<br>`cr1_oracle_the_unwritten_hour`<br>`cr1_oracle_the_open_book`<br>`cr1_oracle_fate_strike_ultimate` | The Final Forecast<br>The Unwritten Hour<br>The Open Book<br>Fate Strike, Ultimate |

### Trees and gates

| Tree | ID | Nodes | Ranks | Signature | Capstone |
|---|---|---:|---:|---|---|
| Seer | `seer` | 18 | 50 | `cr1_oracle_seer_signature` → `read_the_next_step` | `cr1_oracle_seer_capstone` → `the_clear_moment` |
| Witness of Peril | `witness` | 18 | 50 | `cr1_oracle_witness_signature` → `witness_the_blow` | `cr1_oracle_witness_capstone` → `the_watched_thread` |
| Pathfinder | `pathfinder` | 18 | 50 | `cr1_oracle_pathfinder_signature` → `chart_the_safe_line` | `cr1_oracle_pathfinder_capstone` → `the_certain_road` |

#### Seer — Prepare one personal certainty before the next step.

| Slot | Node ID | Passive ID | Name | Ranks | Min level | In-tree points | Prerequisites | Rank values |
|---|---|---|---|---:|---:|---:|---|---|
| p01 | `cr1_oracle_seer_p01` | `cr1_oracle_se_quick_reading` | Quick Reading | 3 | 1 | 0 | — | 1 / 2 / 3 |
| p02 | `cr1_oracle_seer_p02` | `cr1_oracle_se_personal_ward` | Personal Ward | 3 | 1 | 0 | — | 1 / 2 / 3 |
| p03 | `cr1_oracle_seer_p03` | `cr1_oracle_se_measured_step` | Measured Step | 3 | 1 | 0 | — | 5 / 10 / 15 |
| p04 | `cr1_oracle_seer_p04` | `cr1_oracle_se_clear_omen` | Clear Omen | 3 | 2 | 5 | `cr1_oracle_seer_p01` | 1 / 2 / 3 |
| p05 | `cr1_oracle_seer_p05` | `cr1_oracle_se_forecast_range` | Forecast Range | 3 | 3 | 10 | `cr1_oracle_seer_p03` | 5 / 10 / 15 |
| p06 | `cr1_oracle_seer_p06` | `cr1_oracle_se_steady_mind` | Steady Mind | 3 | 3 | 10 | `cr1_oracle_seer_p04` | 1 / 2 / 3 |
| p07 | `cr1_oracle_seer_p07` | `cr1_oracle_se_read_the_room` | Read the Room | 3 | 4 | 15 | `cr1_oracle_seer_p05`, `cr1_oracle_seer_signature` | 1 / 2 / 3 |
| p08 | `cr1_oracle_seer_p08` | `cr1_oracle_se_early_warning` | Early Warning | 3 | 4 | 15 | `cr1_oracle_seer_p06` | 1 / 2 / 3 |
| p09 | `cr1_oracle_seer_p09` | `cr1_oracle_se_quiet_certainty` | Quiet Certainty | 3 | 5 | 20 | `cr1_oracle_seer_p07` | 1 / 2 / 3 |
| p10 | `cr1_oracle_seer_p10` | `cr1_oracle_se_second_look` | Second Look | 3 | 5 | 20 | `cr1_oracle_seer_p08` | 1 / 2 / 3 |
| p11 | `cr1_oracle_seer_p11` | `cr1_oracle_se_patient_reader` | Patient Reader | 3 | 6 | 25 | `cr1_oracle_seer_p09` | 1 / 2 / 3 |
| p12 | `cr1_oracle_seer_p12` | `cr1_oracle_se_practical_foresight` | Practical Foresight | 3 | 6 | 25 | `cr1_oracle_seer_p10` | 1 / 2 / 3 |
| p13 | `cr1_oracle_seer_p13` | `cr1_oracle_se_swift_preparation` | Swift Preparation | 3 | 7 | 30 | `cr1_oracle_seer_p11` | 1 / 2 / 3 |
| p14 | `cr1_oracle_seer_p14` | `cr1_oracle_se_unshaken` | Unshaken | 3 | 8 | 35 | `cr1_oracle_seer_p12` | 1 / 2 / 3 |
| p15 | `cr1_oracle_seer_p15` | `cr1_oracle_se_last_inference` | Last Inference | 3 | 9 | 40 | `cr1_oracle_seer_p13` | 1 / 2 / 3 |
| p16 | `cr1_oracle_seer_p16` | `cr1_oracle_se_seer_mastery` | Seer Mastery | 3 | 10 | 45 | `cr1_oracle_seer_p14` | 1 / 2 / 3 |
Signature: `cr1_oracle_seer_signature` (level 3, 10 in-tree points, prerequisites `cr1_oracle_seer_p01`, `cr1_oracle_seer_p02`).
Capstone: `cr1_oracle_seer_capstone` (level 10, 45 in-tree points, prerequisites `cr1_oracle_seer_p15`, `cr1_oracle_seer_signature`).

#### Witness of Peril — Name one danger to one ally and prepare the answer.

| Slot | Node ID | Passive ID | Name | Ranks | Min level | In-tree points | Prerequisites | Rank values |
|---|---|---|---|---:|---:|---:|---|---|
| p01 | `cr1_oracle_witness_p01` | `cr1_oracle_wi_guardian_reading` | Guardian Reading | 3 | 1 | 0 | — | 1 / 2 / 3 |
| p02 | `cr1_oracle_witness_p02` | `cr1_oracle_wi_watching_brief` | Watching Brief | 3 | 1 | 0 | — | 1 / 2 / 3 |
| p03 | `cr1_oracle_witness_p03` | `cr1_oracle_wi_shared_warning` | Shared Warning | 3 | 1 | 0 | — | 1 / 2 / 3 |
| p04 | `cr1_oracle_witness_p04` | `cr1_oracle_wi_sheltering_forecast` | Sheltering Forecast | 3 | 2 | 5 | `cr1_oracle_witness_p01` | 1 / 2 / 3 |
| p05 | `cr1_oracle_witness_p05` | `cr1_oracle_wi_close_watch` | Close Watch | 3 | 3 | 10 | `cr1_oracle_witness_p03` | 5 / 10 / 15 |
| p06 | `cr1_oracle_witness_p06` | `cr1_oracle_wi_urgent_warning` | Urgent Warning | 3 | 3 | 10 | `cr1_oracle_witness_p04` | 1 / 2 / 3 |
| p07 | `cr1_oracle_witness_p07` | `cr1_oracle_wi_defensive_position` | Defensive Position | 3 | 4 | 15 | `cr1_oracle_witness_p05`, `cr1_oracle_witness_signature` | 1 / 2 / 3 |
| p08 | `cr1_oracle_witness_p08` | `cr1_oracle_wi_read_the_blow` | Read the Blow | 3 | 4 | 15 | `cr1_oracle_witness_p06` | 1 / 2 / 3 |
| p09 | `cr1_oracle_witness_p09` | `cr1_oracle_wi_steady_ally` | Steady Ally | 3 | 5 | 20 | `cr1_oracle_witness_p07` | 1 / 2 / 3 |
| p10 | `cr1_oracle_witness_p10` | `cr1_oracle_wi_interpose` | Interpose | 3 | 5 | 20 | `cr1_oracle_witness_p08` | 5 / 10 / 15 |
| p11 | `cr1_oracle_witness_p11` | `cr1_oracle_wi_second_witness` | Second Witness | 3 | 6 | 25 | `cr1_oracle_witness_p09` | 1 / 2 / 3 |
| p12 | `cr1_oracle_witness_p12` | `cr1_oracle_wi_hold_the_line` | Hold the Line | 3 | 6 | 25 | `cr1_oracle_witness_p10` | 1 / 2 / 3 |
| p13 | `cr1_oracle_witness_p13` | `cr1_oracle_wi_watchful_rest` | Watchful Rest | 3 | 7 | 30 | `cr1_oracle_witness_p11` | 1 / 2 / 3 |
| p14 | `cr1_oracle_witness_p14` | `cr1_oracle_wi_shared_courage` | Shared Courage | 3 | 8 | 35 | `cr1_oracle_witness_p12` | 1 / 2 / 3 |
| p15 | `cr1_oracle_witness_p15` | `cr1_oracle_wi_last_guard` | Last Guard | 3 | 9 | 40 | `cr1_oracle_witness_p13` | 1 / 2 / 3 |
| p16 | `cr1_oracle_witness_p16` | `cr1_oracle_wi_witness_mastery` | Witness Mastery | 3 | 10 | 45 | `cr1_oracle_witness_p14` | 1 / 2 / 3 |
Signature: `cr1_oracle_witness_signature` (level 3, 10 in-tree points, prerequisites `cr1_oracle_witness_p01`, `cr1_oracle_witness_p02`).
Capstone: `cr1_oracle_witness_capstone` (level 10, 45 in-tree points, prerequisites `cr1_oracle_witness_p15`, `cr1_oracle_witness_signature`).

#### Pathfinder — Commit to a route and make the prepared way real.

| Slot | Node ID | Passive ID | Name | Ranks | Min level | In-tree points | Prerequisites | Rank values |
|---|---|---|---|---:|---:|---:|---|---|
| p01 | `cr1_oracle_pathfinder_p01` | `cr1_oracle_pa_route_memory` | Route Memory | 3 | 1 | 0 | — | 1 / 2 / 3 |
| p02 | `cr1_oracle_pathfinder_p02` | `cr1_oracle_pa_safe_line` | Safe Line | 3 | 1 | 0 | — | 5 / 10 / 15 |
| p03 | `cr1_oracle_pathfinder_p03` | `cr1_oracle_pa_quick_step` | Quick Step | 3 | 1 | 0 | — | 5 / 10 / 15 |
| p04 | `cr1_oracle_pathfinder_p04` | `cr1_oracle_pa_read_terrain` | Read Terrain | 3 | 2 | 5 | `cr1_oracle_pathfinder_p01` | 1 / 2 / 3 |
| p05 | `cr1_oracle_pathfinder_p05` | `cr1_oracle_pa_group_route` | Group Route | 3 | 3 | 10 | `cr1_oracle_pathfinder_p03` | 1 / 2 / 3 |
| p06 | `cr1_oracle_pathfinder_p06` | `cr1_oracle_pa_sheltered_path` | Sheltered Path | 3 | 3 | 10 | `cr1_oracle_pathfinder_p04` | 1 / 2 / 3 |
| p07 | `cr1_oracle_pathfinder_p07` | `cr1_oracle_pa_no_wrong_turn` | No Wrong Turn | 3 | 4 | 15 | `cr1_oracle_pathfinder_p05`, `cr1_oracle_pathfinder_signature` | 1 / 2 / 3 |
| p08 | `cr1_oracle_pathfinder_p08` | `cr1_oracle_pa_early_arrival` | Early Arrival | 3 | 4 | 15 | `cr1_oracle_pathfinder_p06` | 1 / 2 / 3 |
| p09 | `cr1_oracle_pathfinder_p09` | `cr1_oracle_pa_quiet_travel` | Quiet Travel | 3 | 5 | 20 | `cr1_oracle_pathfinder_p07` | 1 / 2 / 3 |
| p10 | `cr1_oracle_pathfinder_p10` | `cr1_oracle_pa_steady_pace` | Steady Pace | 3 | 5 | 20 | `cr1_oracle_pathfinder_p08` | 1 / 2 / 3 |
| p11 | `cr1_oracle_pathfinder_p11` | `cr1_oracle_pa_shortcut` | Shortcut | 3 | 6 | 25 | `cr1_oracle_pathfinder_p09` | 5 / 10 / 15 |
| p12 | `cr1_oracle_pathfinder_p12` | `cr1_oracle_pa_waypoint` | Waypoint | 3 | 6 | 25 | `cr1_oracle_pathfinder_p10` | 1 / 2 / 3 |
| p13 | `cr1_oracle_pathfinder_p13` | `cr1_oracle_pa_return_line` | Return Line | 3 | 7 | 30 | `cr1_oracle_pathfinder_p11` | 5 / 10 / 15 |
| p14 | `cr1_oracle_pathfinder_p14` | `cr1_oracle_pa_shared_map` | Shared Map | 3 | 8 | 35 | `cr1_oracle_pathfinder_p12` | 1 / 2 / 3 |
| p15 | `cr1_oracle_pathfinder_p15` | `cr1_oracle_pa_last_mile` | Last Mile | 3 | 9 | 40 | `cr1_oracle_pathfinder_p13` | 1 / 2 / 3 |
| p16 | `cr1_oracle_pathfinder_p16` | `cr1_oracle_pa_pathfinder_mastery` | Pathfinder Mastery | 3 | 10 | 45 | `cr1_oracle_pathfinder_p14` | 1 / 2 / 3 |
Signature: `cr1_oracle_pathfinder_signature` (level 3, 10 in-tree points, prerequisites `cr1_oracle_pathfinder_p01`, `cr1_oracle_pathfinder_p02`).
Capstone: `cr1_oracle_pathfinder_capstone` (level 10, 45 in-tree points, prerequisites `cr1_oracle_pathfinder_p15`, `cr1_oracle_pathfinder_signature`).

### Talent actives

| ID | Name | Source | AP |
|---|---|---|---:|
| `cr1_oracle_read_the_next_step` | Read the Next Step | talent-signature | 1 |
| `cr1_oracle_witness_the_blow` | Witness the Blow | talent-signature | 1 |
| `cr1_oracle_chart_the_safe_line` | Chart the Safe Line | talent-signature | 1 |
| `cr1_oracle_the_clear_moment` | The Clear Moment | talent-capstone | 3 |
| `cr1_oracle_the_watched_thread` | The Watched Thread | talent-capstone | 3 |
| `cr1_oracle_the_certain_road` | The Certain Road | talent-capstone | 3 |

### Resource rules

```json
{
  "slotMax": 2,
  "expiryMinOwnTurns": 1,
  "expiryMaxOwnTurns": 2,
  "categories": [
    "attack-roll",
    "save",
    "check",
    "damage",
    "movement",
    "forced-movement",
    "environmental-hazard"
  ],
  "statuses": [
    "prepared",
    "fulfilled",
    "failed",
    "expired"
  ],
  "noDebt": true,
  "noDiceReplacement": true,
  "noOmniscience": true,
  "hiddenInformation": false,
  "publicDeclarations": true,
  "automaticFulfillment": false,
  "refreshOnLongRest": false,
  "refreshOnReconnect": false,
  "refreshOnInitiative": false,
  "mechanicalHeritageBenefits": false,
  "manualOnly": true
}
```

### Resource system summary

- State type: `oracle-forecasts`
- Manual only: true
- Summon/Forecast state starts uninitialized and never invents a record.

## Compatibility mappings

- Harbinger legacy dispositions: 414. All are `keep` under `harbinger` with `destinationId: null` and `automaticConversion: false`.
- Oracle historical dispositions: 81. All are `legacy-only` with `destinationId: null` and `automaticConversion: false`.
- Harbinger row relationship: `successor-name`; successors: `doomsayer` only.
- Oracle row relationship: `independent`; no successors.

## Manual limits

- No automatic calamity creation, clock advance, resolution, Havoc gain/spend, damage, ward, movement or expiry.
- No automatic forecast creation, fulfillment, failure, expiry, benefit, damage, ward, movement or hidden information.
- No dice replacement, reroll, banking or reuse in either class.
- No account/cloud persistence claim; the Plaguebringer shared wizard/view defects remain carry-forward items.
- No commit, push or deploy.