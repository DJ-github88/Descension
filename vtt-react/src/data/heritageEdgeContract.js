import { resolveClassHeritageName, resolveClassHeritageId } from './classHeritageRegistry';

// Blueprint §5.2 / §12 Pass 5: each native/adopted heritage has ONE narrowly
// bounded class-specific advantage and ONE paired genuine limitation. Exact
// tuning uses existing engine units and a written, typed effect schema. These
// are conditional capability edges, not new resource pools, and never bypass a
// class-wide cap, collapse, death-call or companion dependency.
export const HERITAGE_EDGE_KINDS = Object.freeze({
  attack_bonus: { unit: 'flat', max: 3 },
  damage_bonus: { unit: 'flat', max: 4 },
  damage_dice: { unit: 'dice', maxDice: 2, sides: [4, 6, 8] },
  defense_bonus: { unit: 'flat', max: 3 },
  save_bonus: { unit: 'flat', max: 3 },
  movement: { unit: 'feet', max: 15 },
  resource_gain: { unit: 'flat', max: 5 },
  resource_discount: { unit: 'flat', max: 3 },
  critical_threshold: { unit: 'flat', max: 1 },
  healing: { unit: 'flat', max: 10 },
  capability: { unit: 'capability' }
});

export const HERITAGE_COST_KINDS = Object.freeze({
  self_damage: { unit: 'dice', maxDice: 2, sides: [4, 6] },
  resource_loss: { unit: 'flat', max: 5 },
  mobility_penalty: { unit: 'feet', max: 15 },
  vulnerability: { unit: 'capability' },
  healing_lockout: { unit: 'capability' },
  obligation: { unit: 'capability' },
  risk: { unit: 'capability' }
});

export const HERITAGE_CONDITION_TYPES = Object.freeze(['position', 'medium', 'equipment', 'bond', 'target', 'state', 'terrain', 'rest']);

const FORBIDDEN = /(unlimited|invulnerab|omnipotent|guaranteed?\s+prophe|automatic\s+resurrect|permanent\s+immun|negates?\s+(?:the\s+)?class)/i;

const edge = (kind, extra = {}) => ({ kind, unit: HERITAGE_EDGE_KINDS[kind].unit, ...extra });
const cost = (kind, extra = {}) => ({ kind, unit: HERITAGE_COST_KINDS[kind].unit, ...extra });
const condition = (type, value) => ({ type, value });

// Native/adopted batches: Animist, Berserker, Crusader, Augur, Harbinger,
// Revenant (batch 1); Apex, Arcanoneer, Chronarch, False Prophet, Gambit
// (batch 2); Inquisitor, Lunarch, Martyr, Minstrel, Plaguebringer (batch 3);
// Pyrofiend, Shaper, Spellguard, Toxicologist, Warden (batch 4 - complete
// native coverage). E-route rows are qualification-gated (access: 'E') and
// authored in batches: 1 = Spellguard/Toxicologist, 2 = Inquisitor/Lunarch/
// Minstrel/Shaper, 3 = Berserker/Crusader/Harbinger. More classes are authored
// in later batches.
export const HERITAGE_EDGES = Object.freeze({
  'Animist|ordan_human': {
    className: 'Animist', heritageId: 'ordan_human',
    description: 'Ancestor overtones preserve migration routes; an invocation can be carried through a moving camp.',
    costDescription: 'Voice or attention disruption breaks the anchor.',
    edge: edge('capability', { capability: 'carry_invocation_through_moving_camp', condition: condition('state', 'moving_camp') }),
    cost: cost('risk', { capability: 'anchor_broken_by_voice_disruption' })
  },
  'Animist|clean_vreken': {
    className: 'Animist', heritageId: 'clean_vreken',
    description: 'Deep-Glow spores make a named ancestral channel visibly diagnosable.',
    costDescription: 'The glow exposes the invocation to everyone nearby.',
    edge: edge('capability', { capability: 'visibly_diagnose_ancestral_channel', condition: condition('medium', 'deep_glow') }),
    cost: cost('vulnerability', { capability: 'glow_exposes_invocation' })
  },
  'Animist|velun_neth': {
    className: 'Animist', heritageId: 'velun_neth',
    description: 'A precise archive citation stabilizes the requested spirit.',
    costDescription: 'A bad citation must be resolved, not casually dismissed.',
    edge: edge('capability', { capability: 'precise_citation_stabilizes_spirit', condition: condition('equipment', 'archive_citation') }),
    cost: cost('obligation', { capability: 'bad_citation_must_be_resolved' })
  },
  'Animist|deepling_myrathil': {
    className: 'Animist', heritageId: 'deepling_myrathil',
    description: 'A prepared pressure-resonant token preserves a drowned witness.',
    costDescription: 'Favored at depth; the token needs care to keep baseline land play viable.',
    edge: edge('capability', { capability: 'pressure_resonant_token_preserves_witness', condition: condition('medium', 'depth_token') }),
    cost: cost('obligation', { capability: 'token_care_maintenance' })
  },
  'Berserker|skald_human': {
    className: 'Berserker', heritageId: 'skald_human',
    description: 'Hunger-Pact memory responds rapidly to an endangered ally or line.',
    costDescription: 'Requires real danger; intensified heat still risks burnout.',
    edge: edge('capability', { capability: 'rapid_response_to_endangered_ally', condition: condition('target', 'endangered_ally') }),
    cost: cost('risk', { capability: 'requires_real_danger_and_heat_burnout' })
  },
  'Crusader|thrask_solari': {
    className: 'Crusader', heritageId: 'thrask_solari',
    description: 'A defined radiant discharge can be redirected into heat.',
    costDescription: 'Foregoes part of the relic plate\'s protective/radiant function; no Scathrach patron switch.',
    edge: edge('capability', { capability: 'redirect_defined_discharge_into_heat', condition: condition('equipment', 'consecrated_plate') }),
    cost: cost('vulnerability', { capability: 'forego_protective_radiant_function' })
  },
  'Augur|skald_human': {
    className: 'Augur', heritageId: 'skald_human',
    description: 'Cold-preserved fresh sacrifice yields a longer usable observation window.',
    costDescription: 'Requires the prepared material; cold alone is not prophecy.',
    edge: edge('capability', { capability: 'longer_observation_window', condition: condition('medium', 'cold_preserved_sacrifice') }),
    cost: cost('obligation', { capability: 'requires_prepared_material' })
  },
  'Augur|korr_solari': {
    className: 'Augur', heritageId: 'korr_solari',
    description: 'Long vigil records interpret Sol\'s Breath thermal trend.',
    costDescription: 'Long trends are not guaranteed short-term combat omens.',
    edge: edge('capability', { capability: 'interpret_thermal_trend', condition: condition('medium', 'sols_breath') }),
    cost: cost('obligation', { capability: 'long_trend_not_short_omen' })
  },
  'Augur|kessen_neth': {
    className: 'Augur', heritageId: 'kessen_neth',
    description: 'Obligation-web strain lets the Augur audit a specific impending failure.',
    costDescription: 'The ledger has scope and can contain forged or altered data.',
    edge: edge('capability', { capability: 'audit_impending_obligation_failure', condition: condition('bond', 'obligation_ledger') }),
    cost: cost('vulnerability', { capability: 'ledger_scope_forged_data' })
  },
  'Augur|deepling_myrathil': {
    className: 'Augur', heritageId: 'deepling_myrathil',
    description: 'A marine-preserved witness keeps an offering\'s pattern stable.',
    costDescription: 'Depth and care requirements; baseline carried focus still works on land.',
    edge: edge('capability', { capability: 'stabilize_offering_pattern', condition: condition('medium', 'marine_preserved_witness') }),
    cost: cost('obligation', { capability: 'depth_care_requirements' })
  },
  'Harbinger|skald_human': {
    className: 'Harbinger', heritageId: 'skald_human',
    description: 'The Archive root prepares a measured local collapse sequence.',
    costDescription: 'Setup and anchoring costs; no prophecy overrides unknown inputs.',
    edge: edge('capability', { capability: 'prepare_measured_local_collapse', condition: condition('equipment', 'archive_anchor') }),
    cost: cost('obligation', { capability: 'setup_anchoring_costs' })
  },
  'Harbinger|silath_astril': {
    className: 'Harbinger', heritageId: 'silath_astril',
    description: 'Disciplined echo bindings hold a declared entropic release.',
    costDescription: 'Suppression strain returns into the caster\'s Mayhem.',
    edge: edge('capability', { capability: 'hold_declared_entropic_release', condition: condition('bond', 'echo_binding') }),
    cost: cost('resource_loss', { magnitude: 2, resource: 'mayhemGauge', involuntaryGain: true })
  },
  'Revenant|clean_vreken': {
    className: 'Revenant', heritageId: 'clean_vreken',
    description: 'A named spirit helps stabilize one return.',
    costDescription: 'Reciprocity and finite stored vitality.',
    edge: edge('capability', { capability: 'named_spirit_stabilizes_return', condition: condition('bond', 'named_spirit') }),
    cost: cost('resource_loss', { magnitude: 5, resource: 'phylacteryHP' })
  },
  'Revenant|tessen_human': {
    className: 'Revenant', heritageId: 'tessen_human',
    description: 'A consecrated keep-keystone stabilizes a local return near the prepared node.',
    costDescription: 'Finite keystone; the whole keep is not an infinite phylactery.',
    edge: edge('capability', { capability: 'stabilize_local_return_near_node', condition: condition('position', 'keep_keystone') }),
    cost: cost('obligation', { capability: 'keystone_finite' })
  },
  'Revenant|velun_neth': {
    className: 'Revenant', heritageId: 'velun_neth',
    description: 'A filed soul anchor with reliable provenance maintains the unlife state.',
    costDescription: 'Its existence does not release old obligations.',
    edge: edge('capability', { capability: 'filed_soul_anchor_reliable_provenance', condition: condition('equipment', 'archive_filed_anchor') }),
    cost: cost('obligation', { capability: 'old_obligations_released' })
  },
  'Apex|veiled_mimir': {
    className: 'Apex', heritageId: 'veiled_mimir',
    description: 'Stable lineage archive hunt discipline distinguishes a track from an identity disturbance.',
    costDescription: 'Protect and care for the selected anchor; no mask-induced omniscience.',
    edge: edge('capability', { capability: 'distinguish_track_from_identity_disturbance', condition: condition('medium', 'lineage_archive') }),
    cost: cost('obligation', { capability: 'selected_anchor_care' })
  },
  'Apex|tethered_mimir': {
    className: 'Apex', heritageId: 'tethered_mimir',
    description: 'Unmasked sentinel perception reads a declared perimeter\'s disturbances.',
    costDescription: 'Coverage depends on an actual maintained perimeter.',
    edge: edge('capability', { capability: 'read_declared_perimeter_disturbances', condition: condition('position', 'maintained_perimeter') }),
    cost: cost('obligation', { capability: 'perimeter_maintenance' })
  },
  'Apex|deepling_myrathil': {
    className: 'Apex', heritageId: 'deepling_myrathil',
    description: 'Salt-Hinge trench hunting reads a current-shear trace.',
    costDescription: 'Land travel needs a maintained amphibious or supported companion.',
    edge: edge('capability', { capability: 'read_current_shear_trace', condition: condition('medium', 'current_shear') }),
    cost: cost('obligation', { capability: 'companion_amphibious_support' })
  },
  'Arcanoneer|velun_neth': {
    className: 'Arcanoneer', heritageId: 'velun_neth',
    description: 'Filed syntax and Mnemonic Shards stabilize a declared, prepared formulation.',
    costDescription: 'Filed parameters cannot be freely amended in the field.',
    edge: edge('capability', { capability: 'stabilize_filed_formulation', condition: condition('equipment', 'mnemonic_shard') }),
    cost: cost('obligation', { capability: 'filed_parameters_fixed' })
  },
  'Arcanoneer|kethrin_fexric': {
    className: 'Arcanoneer', heritageId: 'kethrin_fexric',
    description: 'Proving Grounds certified regulators give predictable operation of a rated recipe.',
    costDescription: 'The governor limits modifications; certification is a method/device rule.',
    edge: edge('capability', { capability: 'predictable_rated_recipe', condition: condition('equipment', 'certified_regulator') }),
    cost: cost('obligation', { capability: 'governor_limits_modifications' })
  },
  'Arcanoneer|drall_fexric': {
    className: 'Arcanoneer', heritageId: 'drall_fexric',
    description: 'Salvaged regulators let the Alchemite method attempt a defined experimental modification.',
    costDescription: 'Explicit backlash and repair cost; no infinite combination catalogue.',
    edge: edge('capability', { capability: 'defined_experimental_modification', condition: condition('equipment', 'salvaged_regulator') }),
    cost: cost('risk', { capability: 'explicit_backlash_repair' })
  },
  'Arcanoneer|vashir_astril': {
    className: 'Arcanoneer', heritageId: 'vashir_astril',
    description: 'Carried Lumian charts let the Lumian exploit a declared transit window.',
    costDescription: 'A missing or mistimed window reduces the edge.',
    edge: edge('capability', { capability: 'exploit_declared_transit_window', condition: condition('state', 'transit_window') }),
    cost: cost('obligation', { capability: 'window_mistiming' })
  },
  'Chronarch|kethrin_fexric': {
    className: 'Chronarch', heritageId: 'kethrin_fexric',
    description: 'Nesta\'s calibrated gear interface retunes a prepared local effect.',
    costDescription: 'The maintenance interval exposes and destabilizes the caster.',
    edge: edge('capability', { capability: 'retune_prepared_local_effect', condition: condition('equipment', 'calibrated_gear_interface') }),
    cost: cost('vulnerability', { capability: 'maintenance_interval_exposure' })
  },
  'False Prophet|ordan_human': {
    className: 'False Prophet', heritageId: 'ordan_human',
    description: 'Li Wei\'s route carries a prepared link with a moving migration group.',
    costDescription: 'Dispersion or communication loss disrupts the link.',
    edge: edge('capability', { capability: 'carry_prepared_link_with_moving_group', condition: condition('state', 'moving_congregation') }),
    cost: cost('vulnerability', { capability: 'dispersion_disrupts_link' })
  },
  'Gambit|merryn_human': {
    className: 'Gambit', heritageId: 'merryn_human',
    description: 'Sea-peril wager craft reads and structures a defined maritime wager.',
    costDescription: 'Chasing Losses concerns abandoning risk/obligation.',
    edge: edge('capability', { capability: 'structure_maritime_wager', condition: condition('state', 'maritime_wager') }),
    cost: cost('obligation', { capability: 'chasing_losses' })
  },
  'Gambit|kessen_neth': {
    className: 'Gambit', heritageId: 'kessen_neth',
    description: 'Fate-thread collateral structures a truthful wager through visible obligations.',
    costDescription: 'Cannot knowingly make a false pact assertion; collateral can fray independently.',
    edge: edge('capability', { capability: 'structure_truthful_wager', condition: condition('bond', 'visible_obligations') }),
    cost: cost('obligation', { capability: 'no_false_pact_assertion' })
  },
  'Gambit|drall_fexric': {
    className: 'Gambit', heritageId: 'drall_fexric',
    description: 'Jix\'s Ironjaw contact builds intentional variance into a prepared device or game.',
    costDescription: 'Tilt makes ordinary deterministic operation unreliable for this practitioner.',
    edge: edge('capability', { capability: 'build_intentional_variance', condition: condition('equipment', 'prepared_device') }),
    cost: cost('risk', { capability: 'tilt_unreliable_deterministic' })
  },
  'Inquisitor|marked_vreken': {
    className: 'Inquisitor', heritageId: 'marked_vreken',
    description: 'Orven\'s network diagnosis and severance can reach one connected infected bond.',
    costDescription: 'The cut damages the local conduit; no miles-wide universal purge.',
    edge: edge('capability', { capability: 'reach_connected_infected_bond', condition: condition('bond', 'connected_infected_bond') }),
    cost: cost('vulnerability', { capability: 'conduit_damage_local' })
  },
  'Inquisitor|thalren_human': {
    className: 'Inquisitor', heritageId: 'thalren_human',
    description: 'The Bait-Vow lures a specific oath-hunting entity into a prepared confrontation.',
    costDescription: 'Genuine personal/civic consequence; cannot manufacture costless trivial broken promises.',
    edge: edge('capability', { capability: 'lure_oath_hunting_entity', condition: condition('position', 'prepared_confrontation') }),
    cost: cost('obligation', { capability: 'genuine_personal_consequence' })
  },
  'Lunarch|viridian_florae': {
    className: 'Lunarch', heritageId: 'viridian_florae',
    description: 'A declared grove or contract anchor stabilizes one phase operation.',
    costDescription: 'Extra blood and anchor stress; not every fae debt is a parasite\'s loan.',
    edge: edge('capability', { capability: 'grove_anchor_stabilizes_phase', condition: condition('bond', 'grove_contract_anchor') }),
    cost: cost('self_damage', { dice: 1, sides: 4 })
  },
  'Martyr|korr_solari': {
    className: 'Martyr', heritageId: 'korr_solari',
    description: 'Vault-Breath Witness discipline stabilizes absorption while holding still.',
    costDescription: 'Movement sacrifices that added efficiency.',
    edge: edge('capability', { capability: 'stabilize_absorption_while_stationary', condition: condition('position', 'stationary_guard') }),
    cost: cost('vulnerability', { capability: 'movement_ends_stabilized_absorption' })
  },
  'Martyr|thrask_solari': {
    className: 'Martyr', heritageId: 'thrask_solari',
    description: 'The open-caldera Witness order intercepts an exposed named ally through a defined line.',
    costDescription: 'Forgoes cover and position safety; no automatic heat immunity.',
    edge: edge('capability', { capability: 'intercept_exposed_named_ally', condition: condition('target', 'exposed_named_ally') }),
    cost: cost('vulnerability', { capability: 'forgoes_cover_position' })
  },
  'Martyr|morgh_groven': {
    className: 'Martyr', heritageId: 'morgh_groven',
    description: 'Forge and bridge contact braces a guard position for nearby allies.',
    costDescription: 'Retreat or repositioning ends the brace.',
    edge: edge('capability', { capability: 'brace_guard_position_for_allies', condition: condition('position', 'guard_position') }),
    cost: cost('vulnerability', { capability: 'retreat_ends_brace' })
  },
  'Martyr|ithran_groven': {
    className: 'Martyr', heritageId: 'ithran_groven',
    description: 'Bridge guarantees distribute a finite protective release across a declared span.',
    costDescription: 'Wider distribution reduces per-target protection.',
    edge: edge('capability', { capability: 'distribute_protective_release', condition: condition('position', 'declared_span') }),
    cost: cost('vulnerability', { capability: 'wider_distribution_reduces_protection' })
  },
  'Martyr|skald_human': {
    className: 'Martyr', heritageId: 'skald_human',
    description: 'Cragjaw furnace training converts a finite chosen burden into a controlled offensive vent (Ironclad).',
    costDescription: 'Heat and equipment strain with reduced healing emphasis; Ironclad cost stays finite.',
    edge: edge('capability', { capability: 'convert_finite_burden_to_offensive_vent', condition: condition('state', 'furnace_burden') }),
    cost: cost('risk', { capability: 'heat_equipment_strain' })
  },
  'Minstrel|merryn_human': {
    className: 'Minstrel', heritageId: 'merryn_human',
    description: 'Lyris\'s ship and crew cadence coordinates a prepared rhythm in active weather.',
    costDescription: 'Interruption and breath strain; a gale is not mandatory for baseline play.',
    edge: edge('capability', { capability: 'coordinate_prepared_rhythm_in_weather', condition: condition('state', 'active_weather') }),
    cost: cost('vulnerability', { capability: 'interruption_breath_strain' })
  },
  'Minstrel|shoreling_myrathil': {
    className: 'Minstrel', heritageId: 'shoreling_myrathil',
    description: 'Surf and sea-boundary traditions work across a waterline boundary.',
    costDescription: 'The boundary must actually exist; no unlimited inland or full-sea superiority.',
    edge: edge('capability', { capability: 'work_across_waterline_boundary', condition: condition('terrain', 'waterline') }),
    cost: cost('obligation', { capability: 'boundary_must_exist' })
  },
  'Minstrel|riverling_myrathil': {
    className: 'Minstrel', heritageId: 'riverling_myrathil',
    description: 'Maritime technique relays a prepared current cadence inland up the Thaw-Run.',
    costDescription: 'Stagnation or remoteness removes the current edge.',
    edge: edge('capability', { capability: 'relay_current_cadence_inland', condition: condition('medium', 'living_current') }),
    cost: cost('obligation', { capability: 'stagnation_removes_edge' })
  },
  'Minstrel|deepling_myrathil': {
    className: 'Minstrel', heritageId: 'deepling_myrathil',
    description: 'Deep acoustic practice uses pressure vibration despite ordinary deafness or ear protection.',
    costDescription: 'Does not bypass every magical silence or range/medium rule.',
    edge: edge('capability', { capability: 'pressure_vibration_acoustic', condition: condition('medium', 'pressure_vibration') }),
    cost: cost('obligation', { capability: 'silence_and_range_still_apply' })
  },
  'Plaguebringer|drun_neth': {
    className: 'Plaguebringer', heritageId: 'drun_neth',
    description: 'Refugee culture incubates a defined strain in unpreserved flesh.',
    costDescription: 'Accelerates finite bodily decay; no universal immunity.',
    edge: edge('capability', { capability: 'incubate_defined_strain', condition: condition('state', 'unpreserved_flesh') }),
    cost: cost('vulnerability', { capability: 'accelerated_finite_decay' })
  },
  'Plaguebringer|clean_vreken': {
    className: 'Plaguebringer', heritageId: 'clean_vreken',
    description: 'Vespera\'s Cultivar with Deep-Glow diagnosis observes a fluorescent strain\'s progress.',
    costDescription: 'Visible confession; nonfluorescent contamination defeats the extra information.',
    edge: edge('capability', { capability: 'observe_fluorescent_strain', condition: condition('medium', 'deep_glow') }),
    cost: cost('vulnerability', { capability: 'visible_confession' })
  },
  'Plaguebringer|marked_vreken': {
    className: 'Plaguebringer', heritageId: 'marked_vreken',
    description: 'Cultivar applied to the mycelial connection seeds through a prepared nearby node.',
    costDescription: 'Local network strain and controllable range; no invisible miles-wide plague.',
    edge: edge('capability', { capability: 'seed_through_connected_node', condition: condition('bond', 'prepared_connected_node') }),
    cost: cost('vulnerability', { capability: 'local_network_strain_limited_range' })
  },
  'Pyrofiend|korr_solari': {
    className: 'Pyrofiend', heritageId: 'korr_solari',
    description: 'Deep-vault restraint and Vault-Breath give more controlled banking and cooling while still.',
    costDescription: 'Gives up burst and movement opportunity; ordinary restraint cannot revoke a latched call.',
    edge: edge('capability', { capability: 'controlled_banking_while_stationary', condition: condition('position', 'still_not_attacking') }),
    cost: cost('vulnerability', { capability: 'foregoes_burst_movement' })
  },
  'Pyrofiend|thrask_solari': {
    className: 'Pyrofiend', heritageId: 'thrask_solari',
    description: 'Forge-conversion discipline directly banks one limited protective conversion.',
    costDescription: 'Irreversible tissue/heat cost; not free armor nor immunity to rime.',
    edge: edge('capability', { capability: 'direct_limited_protective_conversion', condition: condition('state', 'breach_heat') }),
    cost: cost('vulnerability', { capability: 'irreversible_tissue_heat_cost' })
  },
  'Pyrofiend|kethrin_fexric': {
    className: 'Pyrofiend', heritageId: 'kethrin_fexric',
    description: 'Mineral stabilization and heat-sinks make a limited vent predictable through a prepared governor.',
    costDescription: 'Mana and structural strain with maintenance; no permanent immunity to forced ascent.',
    edge: edge('capability', { capability: 'prepared_governor_predictable_vent', condition: condition('equipment', 'prepared_governor') }),
    cost: cost('obligation', { capability: 'mana_structural_strain_maintenance' })
  },
  'Shaper|morgh_groven': {
    className: 'Shaper', heritageId: 'morgh_groven',
    description: 'The reclaimed vat-derived interface holds one deliberate load-bearing form.',
    costDescription: 'Reserve/tissue cost and risk of old conditioning under overload.',
    edge: edge('capability', { capability: 'hold_load_bearing_form', condition: condition('state', 'deliberate_form') }),
    cost: cost('risk', { capability: 'reserve_tissue_cost_conditioning' })
  },
  'Shaper|ithran_groven': {
    className: 'Shaper', heritageId: 'ithran_groven',
    description: 'Bridge-running adaptation flows through a prepared momentum route.',
    costDescription: 'Bracing or restraint interrupts the momentum edge.',
    edge: edge('capability', { capability: 'flow_prepared_momentum_route', condition: condition('position', 'prepared_route') }),
    cost: cost('vulnerability', { capability: 'bracing_interrupts_momentum' })
  },
  'Shaper|veiled_mimir': {
    className: 'Shaper', heritageId: 'veiled_mimir',
    description: 'Veyra\'s transmitted forms and heirloom anchor stabilize a declared transition against an identity reference.',
    costDescription: 'The reference is vulnerable; the mask is not biological permission for all shifting.',
    edge: edge('capability', { capability: 'stabilize_transition_against_reference', condition: condition('equipment', 'heirloom_anchor') }),
    cost: cost('vulnerability', { capability: 'vulnerable_identity_reference' })
  },
  'Shaper|tethered_mimir': {
    className: 'Shaper', heritageId: 'tethered_mimir',
    description: 'Community training changes a sensory posture without a lineage mask, anchored by self or Mote.',
    costDescription: 'Repeated shifts stress self-reference and Body Toll.',
    edge: edge('capability', { capability: 'change_sensory_posture_without_mask', condition: condition('state', 'self_or_mote_reference') }),
    cost: cost('resource_loss', { magnitude: 2, resource: 'kineticFluxBodyToll' })
  },
  'Spellguard|korr_solari': {
    className: 'Spellguard', heritageId: 'korr_solari',
    description: 'Vault-Breath shielding stabilizes an interception while holding still.',
    costDescription: 'Moving removes the extra efficiency; ambient saturation still applies.',
    edge: edge('capability', { capability: 'stabilize_interception_while_still', condition: condition('position', 'stationary_guard') }),
    cost: cost('vulnerability', { capability: 'movement_removes_efficiency' })
  },
  'Spellguard|thrask_solari': {
    className: 'Spellguard', heritageId: 'thrask_solari',
    description: 'Practical forge-rupture shielding angles a defined discharge away from an ally.',
    costDescription: 'Redirected energy must go somewhere; account for terrain/collateral and reduced yield.',
    edge: edge('capability', { capability: 'angle_defined_discharge', condition: condition('target', 'ally') }),
    cost: cost('vulnerability', { capability: 'redirected_energy_terrain_collateral' })
  },
  'Toxicologist|thalren_human': {
    className: 'Toxicologist', heritageId: 'thalren_human',
    description: 'Varis\'s prepared fog-predator chemistry prepares a local area-denial compound.',
    costDescription: 'Time and reagent dependency with detectable residue.',
    edge: edge('capability', { capability: 'prepare_area_denial_compound', condition: condition('equipment', 'prepared_reagents') }),
    cost: cost('obligation', { capability: 'time_reagent_detectable_residue' })
  },
  'Toxicologist|viridian_florae': {
    className: 'Toxicologist', heritageId: 'viridian_florae',
    description: 'Bri-Aethren\'s Thornwood exchange tunes a dose to actual thorn-sap chemistry.',
    costDescription: 'Personal vitality and a specific reagent; not universal unbeatable poison.',
    edge: edge('capability', { capability: 'tune_dose_to_thorn_sap', condition: condition('medium', 'thorn_sap') }),
    cost: cost('self_damage', { dice: 1, sides: 4 })
  },
  'Toxicologist|florae_unified': {
    className: 'Toxicologist', heritageId: 'florae_unified',
    description: 'Timber/resin craft conceals a carefully prepared resin-derived formulation.',
    costDescription: 'Lower immediate potency/preparation cost; no automatic thorn-blood anatomy.',
    edge: edge('capability', { capability: 'conceal_resin_formulation', condition: condition('medium', 'resin_sap') }),
    cost: cost('vulnerability', { capability: 'lower_immediate_potency' })
  },
  'Warden|morgh_groven': {
    className: 'Warden', heritageId: 'morgh_groven',
    description: 'Alaric\'s chosen scar and load-bearing physiology brace one declared containment point.',
    costDescription: 'Commitment with drag/recoil risk.',
    edge: edge('capability', { capability: 'brace_declared_containment_point', condition: condition('position', 'containment_point') }),
    cost: cost('risk', { capability: 'commitment_drag_recoil' })
  },
  'Warden|ithran_groven': {
    className: 'Warden', heritageId: 'ithran_groven',
    description: 'Bridge/load knowledge distributes a finite holding load across a declared span.',
    costDescription: 'Additional targets divide the available tension.',
    edge: edge('capability', { capability: 'distribute_finite_holding_load', condition: condition('position', 'declared_span') }),
    cost: cost('vulnerability', { capability: 'targets_divide_tension' })
  },
  // E-route batch 1 (qualification-gated): Spellguard and Toxicologist outsiders.
  'Spellguard|velun_neth': {
    className: 'Spellguard', heritageId: 'velun_neth',
    description: 'Adapting Damon\'s structural analysis resolves one legible clause-bound attack precisely.',
    costDescription: 'Lower captured yield; wild/foreign structures need ordinary containment instead.',
    edge: edge('capability', { capability: 'resolve_clause_bound_attack', condition: condition('equipment', 'contract_clause') }),
    cost: cost('vulnerability', { capability: 'lower_captured_yield' })
  },
  'Spellguard|thalren_human': {
    className: 'Spellguard', heritageId: 'thalren_human',
    description: 'Frontier sapper contact analyzes a prepared layered trigger.',
    costDescription: 'Analysis takes setup and attention; unknown structure defeats the edge.',
    edge: edge('capability', { capability: 'analyze_prepared_layered_trigger', condition: condition('equipment', 'layered_trigger') }),
    cost: cost('obligation', { capability: 'analysis_setup_attention' })
  },
  'Spellguard|kethrin_fexric': {
    className: 'Spellguard', heritageId: 'kethrin_fexric',
    description: 'Aegis apparatus collaboration gives predictable shield-regulator operation.',
    costDescription: 'Equipment rating/maintenance limits; not all-spell immunity.',
    edge: edge('capability', { capability: 'predictable_shield_regulator', condition: condition('equipment', 'certified_regulator') }),
    cost: cost('obligation', { capability: 'equipment_rating_maintenance' })
  },
  'Toxicologist|tethered_mimir': {
    className: 'Toxicologist', heritageId: 'tethered_mimir',
    description: 'Mir-Haeth\'s Falling Lesson cultivates a persistent floor-derived agent.',
    costDescription: 'Setup and decay conditions; no mask requirement.',
    edge: edge('capability', { capability: 'cultivate_floor_derived_agent', condition: condition('medium', 'poisoned_corpses') }),
    cost: cost('obligation', { capability: 'setup_decay_conditions' })
  },
  'Toxicologist|clean_vreken': {
    className: 'Toxicologist', heritageId: 'clean_vreken', access: 'E',
    description: 'Hael the Split-Hand\'s debt-worker transmission diagnoses a prepared dose through stable fluorescence.',
    costDescription: 'Visible/detectable evidence; not immunity to every toxin.',
    edge: edge('capability', { capability: 'diagnose_fluorescence_dose', condition: condition('medium', 'deep_glow') }),
    cost: cost('vulnerability', { capability: 'visible_detectable_evidence' })
  },
  'Toxicologist|marked_vreken': {
    className: 'Toxicologist', heritageId: 'marked_vreken', access: 'E',
    description: 'Heightened substrate perception identifies a local active reagent or contamination.',
    costDescription: 'Sensory overload/network dependence; no free pathogen incubation.',
    edge: edge('capability', { capability: 'identify_local_active_reagent', condition: condition('bond', 'connected_network') }),
    cost: cost('vulnerability', { capability: 'sensory_overload_network_dependence' })
  },
  // E-route batch 2: Inquisitor, Lunarch, Minstrel, Shaper.
  'Inquisitor|clean_vreken': {
    className: 'Inquisitor', heritageId: 'clean_vreken', access: 'E',
    description: 'Disciplined Deep-Glow observation diagnoses a readable corruption signature.',
    costDescription: 'The signature must exist and be legible; the glow exposes the observer.',
    edge: edge('capability', { capability: 'diagnose_corruption_signature', condition: condition('medium', 'deep_glow') }),
    cost: cost('vulnerability', { capability: 'glow_exposes_observer' })
  },
  'Inquisitor|tethered_mimir': {
    className: 'Inquisitor', heritageId: 'tethered_mimir',
    description: 'Sentinel training recognizes a defined incursion warning in mist.',
    costDescription: 'Warnings can be old or forged; no infallible detection.',
    edge: edge('capability', { capability: 'recognize_incursion_warning', condition: condition('medium', 'mist') }),
    cost: cost('vulnerability', { capability: 'warnings_old_forged' })
  },
  'Lunarch|veiled_mimir': {
    className: 'Lunarch', heritageId: 'veiled_mimir',
    description: 'Canopy archive contact maintains a defined identity reference during phase stress.',
    costDescription: 'Parasite memories contaminate the archive; no biological death from removing a mask.',
    edge: edge('capability', { capability: 'maintain_identity_reference', condition: condition('equipment', 'canopy_archive') }),
    cost: cost('vulnerability', { capability: 'archive_contamination' })
  },
  'Lunarch|tethered_mimir': {
    className: 'Lunarch', heritageId: 'tethered_mimir', access: 'E',
    description: 'A declared vigil or Mote reference resists confusion without a mask.',
    costDescription: 'The vigil is chosen behavior, not power erased for leaving a post.',
    edge: edge('capability', { capability: 'vigil_mote_reference', condition: condition('state', 'declared_vigil') }),
    cost: cost('obligation', { capability: 'chosen_vigil_behavior' })
  },
  'Lunarch|thalren_human': {
    className: 'Lunarch', heritageId: 'thalren_human', access: 'E',
    description: 'Disciplined journal protocol uses memory-fog impressions as local resonance input.',
    costDescription: 'Loses reliable personal memory unless actively verified.',
    edge: edge('capability', { capability: 'memory_fog_resonance_input', condition: condition('state', 'memory_fog') }),
    cost: cost('vulnerability', { capability: 'personal_memory_loss' })
  },
  'Minstrel|clean_vreken': {
    className: 'Minstrel', heritageId: 'clean_vreken', access: 'E',
    description: 'Ysenil Deep-Glow adapts performances into a defined living mycelial relay.',
    costDescription: 'A dead or damaged network interrupts it; no maritime-only eligibility.',
    edge: edge('capability', { capability: 'conduct_mycelial_relay', condition: condition('medium', 'living_mycelial_network') }),
    cost: cost('vulnerability', { capability: 'network_damage_interrupts' })
  },
  'Shaper|marked_vreken': {
    className: 'Shaper', heritageId: 'marked_vreken', access: 'E',
    description: 'Root-Veil contact assists one defined transition through mycelium.',
    costDescription: 'Uses finite living substrate that requires regrowth and care.',
    edge: edge('capability', { capability: 'assist_transition_through_mycelium', condition: condition('bond', 'living_substrate') }),
    cost: cost('obligation', { capability: 'substrate_regrowth_care' })
  },
  // E-route batch 3: Berserker, Crusader, Harbinger.
  'Berserker|thrask_solari': {
    className: 'Berserker', heritageId: 'thrask_solari', access: 'E',
    description: 'Bloodhammer contact and geothermal adaptation channel a nearby heat gradient.',
    costDescription: 'Greater heat intake needs greater venting; no infinite caldera battery.',
    edge: edge('capability', { capability: 'channel_nearby_heat_gradient', condition: condition('terrain', 'heat_gradient') }),
    cost: cost('vulnerability', { capability: 'greater_heat_venting' })
  },
  'Berserker|morgh_groven': {
    className: 'Berserker', heritageId: 'morgh_groven',
    description: 'Serum overclock converts a defined regenerative event into Rage.',
    costDescription: 'Consumes biological reserve; healing cannot infinitely loop generation.',
    edge: edge('capability', { capability: 'convert_regeneration_to_rage', condition: condition('state', 'regenerative_event') }),
    cost: cost('vulnerability', { capability: 'consumes_biological_reserve' })
  },
  'Crusader|skald_human': {
    className: 'Crusader', heritageId: 'skald_human', access: 'E',
    description: 'Shared forge training vents a limited hearth protection effect.',
    costDescription: 'Fervor spent here is unavailable for a Judgment.',
    edge: edge('capability', { capability: 'vent_limited_hearth_protection', condition: condition('state', 'hearth_protection') }),
    cost: cost('resource_loss', { magnitude: 2, resource: 'radiantFervor' })
  },
  'Crusader|korr_solari': {
    className: 'Crusader', heritageId: 'korr_solari', access: 'E',
    description: 'Deep forge keepers consecrate relic plate and stabilize a held defensive stance.',
    costDescription: 'Stationary duty sacrifices mobility and attack opportunity.',
    edge: edge('capability', { capability: 'stabilize_held_defensive_stance', condition: condition('position', 'stationary_guard') }),
    cost: cost('mobility_penalty', { magnitude: 10 })
  },
  'Harbinger|thrask_solari': {
    className: 'Harbinger', heritageId: 'thrask_solari', access: 'E',
    description: 'Solvan/Xyris vent-survey contact couples a prepared sequence to an actual heat gradient.',
    costDescription: 'The source cools; no limitless negative heat battery.',
    edge: edge('capability', { capability: 'couple_sequence_to_heat_gradient', condition: condition('terrain', 'heat_gradient') }),
    cost: cost('obligation', { capability: 'source_cools' })
  },
  'Harbinger|vashir_astril': {
    className: 'Harbinger', heritageId: 'vashir_astril',
    description: 'Imported causal patterns read a resonant instability window.',
    costDescription: 'Drawing through Lumia damages and stresses its finite witness.',
    edge: edge('capability', { capability: 'read_resonant_instability_window', condition: condition('state', 'instability_window') }),
    cost: cost('vulnerability', { capability: 'lumia_witness_strain' })
  },
  'Harbinger|tessen_human': {
    className: 'Harbinger', heritageId: 'tessen_human',
    description: 'Suppressed papers and keep-repair contacts plan a local structural collapse.',
    costDescription: 'Must preserve a viable anchor and accept recoil.',
    edge: edge('capability', { capability: 'plan_local_structural_collapse', condition: condition('position', 'prepared_anchor') }),
    cost: cost('risk', { capability: 'anchor_recoil' })
  },
  'Animist|vashir_astril': {
    className: "Animist", heritageId: 'vashir_astril',
    description: "The Lumia heritage is itself the ancestor; a symbiotic host channels a dead world's memory as self.",
    costDescription: "The heritage cannot be separated from the host.",
    edge: edge('capability', { capability: 'commune_with_lumia_heritage_as_ancestor', condition: condition('medium', 'crystalline_blood') }),
    cost: cost('vulnerability', { capability: 'heritage_is_self_not_separable' })
  },
  'Animist|silath_astril': {
    className: "Animist", heritageId: 'silath_astril',
    description: "The dead star speaks through crystalline markings held in ritual stillness.",
    costDescription: "Movement or agitation disrupts the prepared anchor.",
    edge: edge('capability', { capability: 'call_dead_star_witness_in_stillness', condition: condition('state', 'ritual_stillness') }),
    cost: cost('risk', { capability: 'movement_breaks_stillness' })
  },
  'Animist|florae_unified': {
    className: "Animist", heritageId: 'florae_unified',
    description: "Pocket splinter-grafts carry ancestors, the only form that can practice inside a city.",
    costDescription: "The graft needs periodic rooting and care.",
    edge: edge('capability', { capability: 'portable_grove_ancestor_anchor', condition: condition('equipment', 'splinter_graft') }),
    cost: cost('obligation', { capability: 'graft_requires_periodic_rooting' })
  },
  'Animist|riverling_myrathil': {
    className: "Animist", heritageId: 'riverling_myrathil',
    description: "You read the standing memory a river confluence carries downstream.",
    costDescription: "The bond needs renewal in living water.",
    edge: edge('capability', { capability: 'read_confluence_memory', condition: condition('terrain', 'river_confluence') }),
    cost: cost('obligation', { capability: 'requires_living_water_renewal' })
  },
  'Augur|vashir_astril': {
    className: "Augur", heritageId: 'vashir_astril',
    description: "You read near-term futures through stress-fractures forming in your own crystalline skin.",
    costDescription: "Reading exacts physical strain and fragmentary memory.",
    edge: edge('capability', { capability: 'read_crystalline_stress_futures', condition: condition('medium', 'crystalline_skin') }),
    cost: cost('vulnerability', { capability: 'physical_strain_from_reading' })
  },
  'Augur|silath_astril': {
    className: "Augur", heritageId: 'silath_astril',
    description: "You force prophecy from the suppressed alien memory locked in your bone marrow.",
    costDescription: "You cannot control every involuntary image.",
    edge: edge('capability', { capability: 'force_suppressed_prophecy', condition: condition('state', 'suppressed_heritage') }),
    cost: cost('risk', { capability: 'uncontrolled_involuntary_image' })
  },
  'Augur|shoreling_myrathil': {
    className: "Augur", heritageId: 'shoreling_myrathil',
    description: "You read the future in what the sea returns to the tide-line, and in what order it surrenders it.",
    costDescription: "The tide is not an instant correspondent.",
    edge: edge('capability', { capability: 'read_tide_returned_future', condition: condition('terrain', 'tide_line') }),
    cost: cost('obligation', { capability: 'tide_is_not_instant_correspondent' })
  },
  'Augur|riverling_myrathil': {
    className: "Augur", heritageId: 'riverling_myrathil',
    description: "You read the interacting currents at a river confluence.",
    costDescription: "Drought removes the edge.",
    edge: edge('capability', { capability: 'read_confluence_current_patterns', condition: condition('terrain', 'river_confluence') }),
    cost: cost('risk', { capability: 'drought_removes_edge' })
  },
  'False Prophet|vashir_astril': {
    className: "False Prophet", heritageId: 'vashir_astril',
    description: "You conceal a prepared psychic link inside genuine Lumia resonance.",
    costDescription: "The host's real echo can contradict the sermon.",
    edge: edge('capability', { capability: 'conceal_link_in_genuine_resonance', condition: condition('medium', 'lumia_resonance') }),
    cost: cost('vulnerability', { capability: 'host_echo_can_contradict_sermon' })
  },
  'False Prophet|silath_astril': {
    className: "False Prophet", heritageId: 'silath_astril',
    description: "A declared binding helps contain one psychic surge.",
    costDescription: "Repressed echo pressure increases the same Madness risk.",
    edge: edge('capability', { capability: 'contain_psychic_surge_by_binding', condition: condition('state', 'declared_binding') }),
    cost: cost('risk', { capability: 'repressed_echo_raises_madness' })
  },
  'False Prophet|drun_neth': {
    className: "False Prophet", heritageId: 'drun_neth',
    description: "Struck from the First Contract, you escape First Contract-keyed scrutiny of your faith.",
    costDescription: "No immunity to the Voice, Madness, or ordinary witnesses.",
    edge: edge('capability', { capability: 'escape_first_contract_scrutiny', condition: condition('state', 'severed_contract') }),
    cost: cost('vulnerability', { capability: 'no_immunity_to_voice_or_witness' })
  },
  'Chronarch|tessen_human': {
    className: "Chronarch", heritageId: 'tessen_human',
    description: "You anchor a local rewind to the keystone of a sealed keep.",
    costDescription: "Setup and maintenance cost; leaving home removes only the extra edge.",
    edge: edge('capability', { capability: 'anchor_local_rewind_to_keep', condition: condition('equipment', 'keep_keystone') }),
    cost: cost('obligation', { capability: 'setup_and_maintenance_cost' })
  },
  'Spellguard|tessen_human': {
    className: "Spellguard", heritageId: 'tessen_human',
    description: "You ground intercepted magic through prepared gates and chambers.",
    costDescription: "Fixed infrastructure does not travel with you.",
    edge: edge('capability', { capability: 'ground_spell_into_prepared_gate', condition: condition('equipment', 'grounding_chamber') }),
    cost: cost('obligation', { capability: 'fixed_infrastructure_does_not_travel' })
  },
  'Spellguard|drall_fexric': {
    className: "Spellguard", heritageId: 'drall_fexric',
    description: "You retune a salvaged regulator to catch a spell the guild would call uncatchable.",
    costDescription: "Extra instability and repair load.",
    edge: edge('capability', { capability: 'retune_prepared_vent_profile', condition: condition('equipment', 'salvaged_regulator') }),
    cost: cost('risk', { capability: 'extra_instability_and_repair_load' })
  },
  'Warden|tessen_human': {
    className: "Warden", heritageId: 'tessen_human',
    description: "You brace a taught containment point in sealed architecture.",
    costDescription: "You sacrifice mobility for holding power.",
    edge: edge('capability', { capability: 'brace_architectural_containment_point', condition: condition('position', 'prepared_containment_point') }),
    cost: cost('mobility_penalty', { magnitude: 15 })
  },
  'Warden|drall_fexric': {
    className: "Warden", heritageId: 'drall_fexric',
    description: "You retune one chain configuration mid-combat as engineering.",
    costDescription: "Setup and holding-power tradeoff.",
    edge: edge('capability', { capability: 'retune_chain_configuration', condition: condition('equipment', 'ratchet_chain') }),
    cost: cost('risk', { capability: 'setup_holding_power_tradeoff' })
  },
  'Crusader|silath_astril': {
    className: "Crusader", heritageId: 'silath_astril',
    description: "You refract a bounded spell impact into Fervor through your crystalline lattice.",
    costDescription: "Lattice strain limits the conversion.",
    edge: edge('capability', { capability: 'refract_impact_into_fervor', condition: condition('state', 'lattice_strain') }),
    cost: cost('vulnerability', { capability: 'lattice_strain_limit' })
  },
  'Apex|florae_unified': {
    className: "Apex", heritageId: 'florae_unified',
    description: "You read a quarry's passage through prepared roots and wood.",
    costDescription: "Roots are local, not a map-wide sensor.",
    edge: edge('capability', { capability: 'read_contact_through_prepared_roots', condition: condition('terrain', 'prepared_roots') }),
    cost: cost('obligation', { capability: 'roots_are_local_not_mapwide' })
  },
  'Lunarch|florae_unified': {
    className: "Lunarch", heritageId: 'florae_unified',
    description: "You contain the parasite's outward signs through a prepared timber restraint.",
    costDescription: "Releasing the restraint exacts strain.",
    edge: edge('capability', { capability: 'contain_phase_through_timber_restraint', condition: condition('equipment', 'prepared_restraint') }),
    cost: cost('risk', { capability: 'release_exacts_strain' })
  },
  'Revenant|drun_neth': {
    className: "Revenant", heritageId: 'drun_neth',
    description: "Legally dead and severed, you avoid First Contract-keyed sanctions on your return.",
    costDescription: "Ordinary death and anchor destruction still apply.",
    edge: edge('capability', { capability: 'avoid_first_contract_sanctions', condition: condition('state', 'severed_contract') }),
    cost: cost('vulnerability', { capability: 'ordinary_death_still_applies' })
  },
  'Revenant|shoreling_myrathil': {
    className: "Revenant", heritageId: 'shoreling_myrathil',
    description: "You renew your return at a prepared tidal node.",
    costDescription: "A waterline care obligation binds the anchor.",
    edge: edge('capability', { capability: 'renew_return_at_tidal_node', condition: condition('terrain', 'tidal_node') }),
    cost: cost('obligation', { capability: 'waterline_care_obligation' })
  },
  'Revenant|riverling_myrathil': {
    className: "Revenant", heritageId: 'riverling_myrathil',
    description: "You follow a linked watercourse to a prepared weir node.",
    costDescription: "Drought threatens maintenance, not the whole anchor.",
    edge: edge('capability', { capability: 'follow_watercourse_to_weir_node', condition: condition('terrain', 'weir_node') }),
    cost: cost('obligation', { capability: 'drought_threatens_maintenance' })
  },
  'Toxicologist|drun_neth': {
    className: "Toxicologist", heritageId: 'drun_neth',
    description: "You brew a null-distillate that registers as nothing on the First Contract.",
    costDescription: "Faster finite bodily decline; the substance still exists.",
    edge: edge('capability', { capability: 'brew_untraceable_null_distillate', condition: condition('state', 'severed_contract') }),
    cost: cost('obligation', { capability: 'faster_finite_bodily_decline' })
  },
  'Warden|thalren_human': {
    className: "Warden", heritageId: 'thalren_human',
    description: "You brace a Greymark garrison chokepoint you helped hold.",
    costDescription: "Position commitment sacrifices mobility.",
    edge: edge('capability', { capability: 'brace_garrison_chokepoint', condition: condition('position', 'prepared_garrison_point') }),
    cost: cost('mobility_penalty', { magnitude: 15 })
  },
  'Warden|skald_human': {
    className: "Warden", heritageId: 'skald_human',
    description: "Your Frozen Archive graft maintains grip in the cold, biting deeper as temperature drops.",
    costDescription: "Heat removes the cold edge.",
    edge: edge('capability', { capability: 'maintain_grip_in_cold', condition: condition('terrain', 'frozen_ground') }),
    cost: cost('obligation', { capability: 'heat_removes_cold_edge' })
  },
  'Warden|kethrin_fexric': {
    className: "Warden", heritageId: 'kethrin_fexric',
    description: "You hold a certified chain at a documented load-rating.",
    costDescription: "Ratings and equipment geometry restrict improvisation.",
    edge: edge('capability', { capability: 'rated_tension_under_load', condition: condition('equipment', 'certified_chain') }),
    cost: cost('obligation', { capability: 'ratings_restrict_improvisation' })
  },
  'Warden|veiled_mimir': {
    className: "Warden", heritageId: 'veiled_mimir',
    description: "You detect Wyrd incursions before they manifest, reading shifts in the fog’s memory.",
    costDescription: "Warnings can be old or forged.",
    edge: edge('capability', { capability: 'detect_incursion_through_fog', condition: condition('medium', 'fog') }),
    cost: cost('risk', { capability: 'warnings_can_be_forged' })
  },
  'Revenant|merryn_human': {
    className: "Revenant", heritageId: 'merryn_human',
    description: "You carry your soul-anchor in maintained mortuary ink.",
    costDescription: "The ink fades and the stored reserve stays finite.",
    edge: edge('capability', { capability: 'carry_anchor_in_mortuary_ink', condition: condition('equipment', 'maintained_ink') }),
    cost: cost('obligation', { capability: 'ink_fades_and_reserve_finite' })
  },
  'Revenant|kessen_neth': {
    className: "Revenant", heritageId: 'kessen_neth',
    description: "You audit one binding obligation through a prepared ledger.",
    costDescription: "Completing the covenant can release the anchor.",
    edge: edge('capability', { capability: 'audit_obligation_through_ledger', condition: condition('equipment', 'prepared_ledger') }),
    cost: cost('obligation', { capability: 'completing_covenant_releases_anchor' })
  },
  'Apex|ordan_human': {
    className: "Apex", heritageId: 'ordan_human',
    description: "You track game across open steppe by crushed grass and thermal wind.",
    costDescription: "Enclosed terrain limits the route edge.",
    edge: edge('capability', { capability: 'track_by_steppe_scent', condition: condition('terrain', 'open_steppe') }),
    cost: cost('obligation', { capability: 'enclosed_terrain_limits_route' })
  },
  'Apex|viridian_florae': {
    className: "Apex", heritageId: 'viridian_florae',
    description: "You read living growth disturbed by a quarry.",
    costDescription: "Cut or sterile ground removes the edge.",
    edge: edge('capability', { capability: 'read_disturbed_growth', condition: condition('terrain', 'living_growth') }),
    cost: cost('risk', { capability: 'cut_ground_removes_edge' })
  },
  'Apex|marked_vreken': {
    className: "Apex", heritageId: 'marked_vreken',
    description: "You read moving quarry through connected fungal substrate.",
    costDescription: "Stationary or disconnected prey needs ordinary tracking.",
    edge: edge('capability', { capability: 'read_quarry_on_substrate', condition: condition('medium', 'mycelium') }),
    cost: cost('obligation', { capability: 'stationary_prey_needs_ordinary_tracking' })
  },
  'Animist|viridian_florae': {
    className: "Animist", heritageId: 'viridian_florae',
    description: "You summon the erased Viridane dead held in thorn and blood.",
    costDescription: "Named, finite bonds with a blood and attention cost.",
    edge: edge('capability', { capability: 'summon_erased_viridane_ancestor', condition: condition('equipment', 'thorn_blood') }),
    cost: cost('obligation', { capability: 'named_finite_bonds_blood_cost' })
  },
  'Animist|veiled_mimir': {
    className: "Animist", heritageId: 'veiled_mimir',
    description: "A known heirloom indexes an ancestral witness in the canopy archive.",
    costDescription: "Archive coverage is finite; unknown ancestors cannot be invented.",
    edge: edge('capability', { capability: 'index_ancestral_witness_by_heirloom', condition: condition('equipment', 'known_heirloom') }),
    cost: cost('obligation', { capability: 'archive_coverage_finite' })
  },
  'Animist|tethered_mimir': {
    className: "Animist", heritageId: 'tethered_mimir',
    description: "Your Mote separates self from a visiting voice.",
    costDescription: "Over-channeling risks the personal memory anchor.",
    edge: edge('capability', { capability: 'separate_self_from_voice_by_mote', condition: condition('equipment', 'personal_mote') }),
    cost: cost('risk', { capability: 'overchannel_risks_anchor' })
  },
  'Chronarch|ithran_groven': {
    className: "Chronarch", heritageId: 'ithran_groven',
    description: "Your living-bone interface stabilizes an explicitly bounded wider field.",
    costDescription: "Requires a braced posture.",
    edge: edge('capability', { capability: 'stabilize_bounded_wider_field', condition: condition('position', 'braced_posture') }),
    cost: cost('mobility_penalty', { magnitude: 15 })
  },
  'Chronarch|velun_neth': {
    className: "Chronarch", heritageId: 'velun_neth',
    description: "You store and retrieve a witnessed local state from a memory-glass lattice.",
    costDescription: "Finite archive and processing burden; Strain still applies.",
    edge: edge('capability', { capability: 'restore_witnessed_local_state', condition: condition('equipment', 'memory_glass_lattice') }),
    cost: cost('obligation', { capability: 'strain_still_applies' })
  },
  'Minstrel|tethered_mimir': {
    className: "Minstrel", heritageId: 'tethered_mimir',
    description: "You sing a community vigil through the fog without a mask.",
    costDescription: "The fog can imitate or carry the signal astray.",
    edge: edge('capability', { capability: 'sing_vigil_through_fog', condition: condition('medium', 'fog') }),
    cost: cost('risk', { capability: 'fog_can_imitate_signal' })
  },
  'Augur|marked_vreken': {
    className: "Augur", heritageId: 'marked_vreken',
    description: "You read incoming danger through the flashing pulses of subterranean root mushrooms.",
    costDescription: "The glow exposes the reader and is vulnerable to corrupted input.",
    edge: edge('capability', { capability: 'read_root_mushroom_pulses', condition: condition('medium', 'mycelium') }),
    cost: cost('vulnerability', { capability: 'glow_exposes_reader' })
  }
});

const key = (className, heritageId) => `${className}|${heritageId}`;

export function getHeritageEdge(className, heritageId) {
  const base = resolveClassHeritageName(className);
  if (!base || !heritageId) return null;
  return HERITAGE_EDGES[key(base, heritageId)] || null;
}

export function getCharacterHeritageEdge(character = {}) {
  const base = resolveClassHeritageName(character.class);
  const heritageId = resolveClassHeritageId(character.race, character.subrace);
  return base && heritageId ? getHeritageEdge(base, heritageId) : null;
}

export function getAuthoredHeritageEdgeClasses() {
  return [...new Set(Object.values(HERITAGE_EDGES).map(entry => entry.className))].sort();
}

const withinNumber = (value, max) => Number.isFinite(value) && Math.abs(value) <= max;

export function validateHeritageEdge(entry) {
  const problems = [];
  if (!entry || typeof entry !== 'object') return ['entry must be an object'];
  const { edge: e, cost: c } = entry;
  if (!e || !c) return ['entry needs exactly one edge and one cost'];
  if (!HERITAGE_EDGE_KINDS[e.kind]) problems.push(`unknown edge kind: ${e.kind}`);
  if (!HERITAGE_COST_KINDS[c.kind]) problems.push(`unknown cost kind: ${c.kind}`);
  if (e.magnitude !== undefined && HERITAGE_EDGE_KINDS[e.kind] && !withinNumber(e.magnitude, HERITAGE_EDGE_KINDS[e.kind].max)) problems.push('edge magnitude out of bounds');
  if (c.magnitude !== undefined && HERITAGE_COST_KINDS[c.kind] && !withinNumber(c.magnitude, HERITAGE_COST_KINDS[c.kind].max)) problems.push('cost magnitude out of bounds');
  if (e.kind === 'capability' && !e.condition) problems.push('capability edge needs a checkable condition');
  if (e.condition && !HERITAGE_CONDITION_TYPES.includes(e.condition.type)) problems.push(`unknown condition type: ${e.condition?.type}`);
  if (c.kind === 'capability' && !c.capability) problems.push('capability cost needs a declared limitation');
  const text = `${e.capability || ''} ${c.capability || ''}`;
  if (FORBIDDEN.test(text)) problems.push('forbidden unbounded/unlimited claim');
  if (entry.description && FORBIDDEN.test(entry.description)) problems.push('forbidden unbounded claim in description');
  return problems;
}

// Conditions gate the edge. A missing condition always applies; otherwise the
// context must name the same value for the condition type.
export function conditionSatisfied(edgeDef, context = {}) {
  const cond = edgeDef?.condition;
  if (!cond) return true;
  const current = context[cond.type];
  if (Array.isArray(current)) return current.includes(cond.value);
  return current === cond.value;
}

export function evaluateHeritageEdge(entry, context = {}) {
  if (!entry) return { applies: false, reason: 'no-edge' };
  const applies = conditionSatisfied(entry.edge, context);
  return {
    applies,
    reason: applies ? 'edge-condition-met' : 'edge-condition-unmet',
    edge: entry.edge,
    cost: entry.cost,
    events: applies
      ? [{ type: 'heritage-edge', capability: entry.edge.capability, kind: entry.edge.kind },
        { type: 'heritage-cost', capability: entry.cost.capability, kind: entry.cost.kind }]
      : []
  };
}

export function summarizeHeritageEdge(entry) {
  if (!entry) return null;
  return { edge: entry.description, cost: entry.costDescription, kind: entry.edge.kind, costKind: entry.cost.kind };
}
