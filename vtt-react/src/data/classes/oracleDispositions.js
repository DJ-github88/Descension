const ORACLE_CLASS_ID = 'oracle';
const NEW_ORACLE_CLASS_ID = 'oracle';

const HISTORICAL_ORACLE_SPELL_IDS = [
  'oracle_foresight', 'oracle_shared_vision', 'oracle_prophecy_of_doom',
  'oracle_reveal_truth', 'oracle_past_sight', 'oracle_piercing_gaze',
  'oracle_twist_fate', 'oracle_sever_thread', 'oracle_destiny_lock',
  'oracle_unmask', 'oracle_past_sins', 'oracle_detect_fate',
  'oracle_omen_reading', 'oracle_future_strike', 'oracle_reveal_weakness',
  'oracle_destiny_shift', 'oracle_prescient_dodge', 'oracle_expose_secrets',
  'oracle_threads_of_fate', 'oracle_perfect_foresight', 'oracle_psychic_assault',
  'oracle_alter_destiny', 'oracle_timeline_split', 'oracle_omniscience',
  'oracle_weave_destiny', 'oracle_future_self', 'oracle_absolute_truth',
  'oracle_master_of_fate', 'oracle_fate_whisper_strike', 'oracle_divine_insight',
  'oracle_prophetic_shield', 'oracle_fate_strike', 'oracle_chrono_wound',
  'oracle_failed_prophecy', 'oracle_debt_overload'
];

const HISTORICAL_ORACLE_TREES = {
  seer: [
    'seer_t0_clairvoyance', 'seer_t1_future_vision', 'seer_t1_prescience',
    'seer_t1_fortune_telling', 'seer_t1_prophecy', 'seer_t2_foresight',
    'seer_t2_true_seeing', 'seer_t2_scrying', 'seer_t3_oracle_of_fate',
    'seer_t3_fate_reveal', 'seer_t4_timeless_body', 'seer_t4_foresight_supreme',
    'seer_t4_prophetic_visions', 'seer_t5_divine_omniscience'
  ],
  truthseeker: [
    'truth_t0_detect_lies', 'truth_t1_reveal_hidden', 'truth_t1_past_vision',
    'truth_t1_exploit_weakness', 'truth_t2_zone_of_truth', 'truth_t2_mind_reading',
    'truth_t2_historical_knowledge', 'truth_t3_discern_lies', 'truth_t3_true_sight',
    'truth_t4_legend_lore', 'truth_t4_deep_memory', 'truth_t4_reality_check',
    'truth_t5_omniscient_truth'
  ],
  fateseer: [
    'fate_t0_fate_binding', 'fate_t1_lucky_break', 'fate_t1_ill_omen',
    'fate_t1_fate_link', 'fate_t2_twist_fate', 'fate_t2_cursed_fate',
    'fate_t3_fate_sever', 'fate_t3_destiny_weave', 'fate_t4_rewrite_fate',
    'fate_t4_fate_shield', 'fate_t5_fateseer_supreme'
  ]
};

const historical = (sourceType, sourceId, rationale, extra = {}) => ({
  sourceType,
  sourceId,
  sourceClassId: ORACLE_CLASS_ID,
  disposition: 'legacy-only',
  destinationClassId: null,
  destinationId: null,
  rationale,
  automaticConversion: false,
  ...extra
});

export const ORACLE_RECORD_DISPOSITIONS = [
  ...HISTORICAL_ORACLE_SPELL_IDS.map(spellId => historical(
    'historical-spell',
    spellId,
    `Preserve historical Oracle spell ${spellId} as legacy evidence only. The restored Oracle uses a new cr1_oracle_* record; no automatic conversion is authored.`
  )),
  ...Object.entries(HISTORICAL_ORACLE_TREES).flatMap(([treeId, nodeIds]) => nodeIds.map(nodeId => historical(
    'historical-talent-node',
    nodeId,
    `Preserve historical Oracle node ${nodeId} in the ${treeId} tree as legacy evidence only. The restored Oracle uses separate seer, witness and pathfinder nodes.`,
    { treeId }
  ))),
  ...Object.keys(HISTORICAL_ORACLE_TREES).map(treeId => historical(
    'historical-talent-tree',
    treeId,
    `Preserve the historical ${treeId} tree as legacy evidence. The restored Oracle's tree IDs and rank values are separately authored.`,
    { treeId }
  )),
  historical(
    'historical-resource',
    'omenDebt',
    'Preserve the historical Omen Debt record as legacy evidence only. The restored Oracle has two forecast slots, no debt economy and no debt eruption.'
  ),
  historical(
    'historical-specialization',
    'seer',
    'The restored Oracle keeps a Seer tree name but authors new node IDs, ranks and a bounded forecast benefit; the historical Seer content is not converted.'
  ),
  historical(
    'historical-specialization',
    'truthseeker',
    'The historical Truthseeker is not restored as a hidden-information or mind-reading tree. Its records remain legacy evidence only.'
  ),
  historical(
    'historical-specialization',
    'fateseer',
    'The historical Fateseer is not restored as a die-manipulation or reroll tree. Its records remain legacy evidence only.'
  ),
  historical(
    'legacy-alias',
    'augur-omen-debt',
    `Do not alias the restored ${NEW_ORACLE_CLASS_ID} to Augur, its Benediction/Malediction banks or its Omen Debt. The historical relationship remains evidence only.`
  )
];
