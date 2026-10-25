import {
  ORACLE_TREE_META, ORACLE_TREES, ORACLE_TALENT_NODES,
  ORACLE_PASSIVE_RECORDS, ORACLE_TALENT_CAPACITY
} from '../talentTrees/oracle';

export const ORACLE_CLASS_ID = 'oracle';
export const ORACLE_RULESET_VERSION = 'cr-review-r1';
export const ORACLE_ICON = 'Psychic/Psychic Telepathy';
export const ORACLE_MANUAL_NOTICE = 'Manual tabletop only. No automatic forecast, slot, benefit, expiry, damage, ward, movement or hidden information.';

const flags = {
  classId: ORACLE_CLASS_ID, rulesetVersion: ORACLE_RULESET_VERSION,
  authoredOnly: true, manualOnly: true, executionEnabled: false,
  applicationMode: 'manual-tabletop', automatedCapabilities: [],
  manualNotice: ORACLE_MANUAL_NOTICE
};
const id = suffix => `cr1_oracle_${suffix}`;
const instant = { durationType: 'instant', durationValue: 0, durationUnit: 'instant' };
const nextStart = { durationType: 'own_turns', durationValue: 1, durationUnit: 'next_caster_turn_start' };
const selfTarget = { targetingType: 'self', rangeType: 'self', rangeDistance: 0, targetRestrictions: ['self'], maxTargets: 1 };
const target = (roles, maxTargets = 1, rangeDistance = 30) => ({
  targetingType: maxTargets > 1 ? 'multi' : 'single', rangeType: 'ranged',
  rangeDistance, targetRestrictions: roles, maxTargets
});
const enemy = (n = 1, feet = 30) => target(['enemy'], n, feet);
const ally = (n = 1, feet = 30) => target(['ally', 'self'], n, feet);
const apCost = actionPoints => ({
  actionPoints, mana: 0, resourceTypes: ['actionPoints'],
  resourceValues: { actionPoints, mana: 0 }, useFormulas: {}, components: ['somatic'],
  somaticText: 'State the observed subject, the named event category and the prepared benefit before resolution.'
});
const damage = (formula, damageTypes = ['wyrd']) => ({ formula, damageTypes, resolution: 'DICE' });
const cooldownNone = { cooldownType: 'turn_based', cooldownValue: 0 };
const cooldownLongRest = { cooldownType: 'long_rest', cooldownValue: 1 };

const effect = (kind, args, description) => ({ kind, args, description, executable: false });

const record = (level, suffix, name, ap, targetingConfig, effectTypes, program, description, effects = [], options = {}) => ({
  ...flags, id: id(suffix), name, level, specialization: options.specialization || null,
  treeId: options.treeId || null, source: options.source || 'optional', spellType: 'ACTION',
  icon: ORACLE_ICON, resourceCost: apCost(ap), targetingConfig, effectTypes,
  damageConfig: options.damageConfig || null,
  durationConfig: options.durationConfig || instant,
  cooldownConfig: options.cooldownConfig || cooldownNone,
  reactionTiming: null, savingThrow: null, conditions: options.conditions || [], area: null,
  description,
  classResourceProgram: program ? { version: 1, domain: 'oracle-forecasts', ...program } : null,
  manualMechanics: {
    price: {
      actionPoints: ap, mana: 0, forecastSlots: program?.op === 'forecast.commit' ? 1 : 0
    },
    effects: effects.length ? effects : [effect(program?.op || 'forecast.none', program?.args || {}, description)],
    executable: false
  },
  sourceRefs: ['RI-5 Oracle content lock']
});

export const ORACLE_FORECAST_CATEGORIES = [
  'attack-roll', 'save', 'check', 'damage', 'movement', 'forced-movement', 'environmental-hazard'
];

export const ORACLE_COMMON_MECHANICS = {
  slots: 'Exactly two forecast slots. A prepared forecast occupies one slot until it fulfills, fails, expires or is released; no third slot exists.',
  subject: 'Every forecast names one exact subject and one event category from the closed list. A forecast without an exact subject or category is rejected unchanged.',
  expiry: 'A forecast expires after one or two own turns. Expiry is counted only on the caster own turn. No long rest, reconnect, initiative, class change or scene change refreshes or extends it.',
  benefit: 'The benefit is published before the event and applies once when the named category occurs. A failed or expired forecast releases no reward and cannot be retroactively fulfilled.',
  information: 'A forecast never reveals hidden plans, private intentions, unrolled outcomes or information the table has not authored. Reading abilities use observable evidence or GM-provided bounded visions only.',
  dice: 'No forecast, talent or record replaces, rerolls, banks or frees a die result. The class never touches the dice economy.',
  debt: 'Oracle has no Omen Debt, no debt thresholds and no debt eruption. It does not inherit Augur Benediction, Malediction or Omen Debt.',
  native: 'Oracle has no registered native heritage edge. Lumian and Ordu are recommendations only; acquisition must be recorded.'
};

export const ORACLE_CORE_RECORDS = [
  record(1, 'commit_forecast', 'Commit a Forecast', 1, selfTarget, ['utility'], {
    op: 'forecast.commit', args: {
      slotMax: 2, expiryMaxOwnTurns: 2, categories: [...ORACLE_FORECAST_CATEGORIES],
      subjectRequired: true, benefitRequired: true, public: true,
      hiddenInformation: false, diceReplacement: false, automatic: false
    }
  }, 'Name one exact subject, one event category and one published benefit. The forecast occupies one of two slots for one or two own turns. If the named event occurs, the benefit applies once; if it fails or expires, no reward is granted.', [
    effect('forecast.commit', {
      slotMax: 2, expiryMaxOwnTurns: 2, categories: [...ORACLE_FORECAST_CATEGORIES],
      subjectRequired: true, benefitRequired: true, hiddenInformation: false
    }, 'Prepare one public forecast in an empty slot.')
  ], { source: 'core' }),
  record(1, 'release_forecast', 'Release the Forecast', 1, selfTarget, ['utility'], {
    op: 'forecast.release', args: {
      target: 'one-own-prepared-forecast', freesSlot: true,
      grantBenefit: false, reversesEvent: false, automatic: false
    }
  }, 'Release one prepared forecast you own. Its slot frees only after the table records the release. No benefit is granted and no resolved event is reversed.', [
    effect('forecast.release', { target: 'one-own-prepared-forecast', freesSlot: true, grantBenefit: false }, 'Close one prepared forecast without a reward.')
  ], { source: 'core' })
];

const optional = [
  record(1, 'shared_vision', 'Shared Vision', 1, ally(), ['buff'], null,
    'One ally within 30 ft adds 1 to its next check before the end of your next turn. The ally must be able to see or hear the shared warning; one use.', [
      effect('forecast.share', { rangeFeet: 30, bonus: 1, scope: 'next-check', expires: 'end-next-caster-turn' }, 'Grant +1 to one ally next check.')
    ], { durationConfig: nextStart }),
  record(1, 'omen_reading', 'Omen Reading', 1, selfTarget, ['utility'], {
    op: 'forecast.read', args: { rangeFeet: 30, reveals: ['observable-signs', 'public-weather'], hiddenInformation: false }
  }, 'Read observable signs and public weather within 30 ft. The GM answers from authored, visible evidence; no hidden plans or future certainty are revealed.', [
    effect('forecast.read', { rangeFeet: 30, reveals: ['observable-signs', 'public-weather'] }, 'Read only observable signs.')
  ]),
  record(1, 'fates_whisper_strike', "Fate's Whisper Strike", 1, enemy(), ['damage'], null,
    'One enemy within 30 ft takes 1d6 wyrd. If an ally has a prepared forecast naming that enemy, add 1 once; the forecast is not consumed by this attack.', [
      effect('forecast.strike', { rangeFeet: 30, damage: '1d6', bonusIfForecastSubject: 1 }, 'Deal 1d6 wyrd, +1 if the target is a forecast subject.')
    ], { damageConfig: damage('1d6') }),
  record(1, 'prophetic_shield', 'Prophetic Shield', 1, ally(), ['buff'], null,
    'One ally within 30 ft gains a 4-point one-use ward against the next damage event before your next turn. Apply after mitigation; no healing and no stacking.', [
      effect('forecast.ward', { rangeFeet: 30, capacity: 4, uses: 1, expires: 'end-next-caster-turn' }, 'Capacity-4 one-use ward.')
    ], { durationConfig: nextStart }),

  record(2, 'foresight', 'Foresight', 1, selfTarget, ['buff'], {
    op: 'forecast.prepare', args: { bonus: 2, scope: 'next-attack-or-save', expires: 'end-next-caster-turn' }
  }, 'Prepare one personal certainty: add 2 to your next attack or save before the end of your next turn. One use; no die replacement.', [
    effect('forecast.prepare', { bonus: 2, scope: 'next-attack-or-save' }, 'Gain +2 to one next attack or save.')
  ], { durationConfig: nextStart }),
  record(2, 'past_sight', 'Past Sight', 1, selfTarget, ['utility'], {
    op: 'forecast.read', args: {
      target: 'one-visible-object-or-location', windowHours: 24,
      reveals: ['observable-history'], hiddenInformation: false
    }
  }, 'Read the observable history of one visible object or location from the last 24 hours. The GM describes what left visible evidence; no hidden thoughts, private conversations or unwritten facts.', [
    effect('forecast.read', { windowHours: 24, reveals: ['observable-history'] }, 'Read observable recent history.')
  ]),
  record(2, 'read_the_public_line', 'Read the Public Line', 1, selfTarget, ['utility'], {
    op: 'forecast.read', args: {
      rangeFeet: 30, reveals: ['public-actions', 'visible-intent'],
      hiddenInformation: false, prediction: false
    }
  }, 'Read the public actions and visible intent of creatures within 30 ft. This is not mind reading and reveals no hidden plans or future outcomes.', [
    effect('forecast.read', { rangeFeet: 30, reveals: ['public-actions', 'visible-intent'] }, 'Read visible action and intent.')
  ]),
  record(2, 'reveal_weakness', 'Reveal Weakness', 1, enemy(), ['control'], {
    op: 'forecast.expose', args: { rangeFeet: 30, savePenalty: -1, expires: 'end-target-next-turn' }
  }, 'One enemy within 30 ft has -1 to its next save before the end of its next turn. No damage, no condition and no hidden information.', [
    effect('forecast.expose', { rangeFeet: 30, savePenalty: -1 }, 'Penalize one next save.')
  ], { durationConfig: nextStart }),

  record(3, 'piercing_gaze', 'Piercing Gaze', 1, selfTarget, ['utility'], {
    op: 'forecast.read', args: { rangeFeet: 30, reveals: ['visible-illusions', 'visible-concealment'], hiddenInformation: false }
  }, 'Examine visible illusions and concealment within 30 ft. The GM reveals only what authored evidence supports; no invisible creatures or hidden text are invented.', [
    effect('forecast.read', { rangeFeet: 30, reveals: ['visible-illusions', 'visible-concealment'] }, 'Examine visible deception.')
  ]),
  record(3, 'prophecy_of_doom', 'Prophecy of Doom', 2, enemy(), ['damage', 'control'], {
    op: 'forecast.expose', args: { rangeFeet: 30, damage: '1d6', savePenalty: -2, expires: 'end-target-next-turn' }
  }, 'One enemy within 30 ft takes 1d6 wyrd and has -2 to its next save before the end of its next turn. One damage event and one save penalty.', [
    effect('forecast.expose', { damage: '1d6', savePenalty: -2 }, 'Deal 1d6 and penalize one save.')
  ], { damageConfig: damage('1d6'), durationConfig: nextStart }),
  record(3, 'fate_strike', 'Fate Strike', 2, enemy(), ['damage'], null,
    'One enemy within 30 ft takes 2d6 wyrd. The strike uses an ordinary attack or save as the table declares; it is not an automatic hit.', [
      effect('forecast.strike', { rangeFeet: 30, damage: '2d6' }, 'Deal 2d6 wyrd with a declared attack or save.')
    ], { damageConfig: damage('2d6') }),
  record(3, 'guided_step', 'Guided Step', 1, ally(), ['utility'], null,
    'One willing ally within 30 ft adds 10 ft to its remaining movement this turn. Ordinary movement and reactions apply; no teleport.', [
      effect('forecast.guide', { rangeFeet: 30, moveFeet: 10 }, 'Grant 10 ft of remaining movement.')
    ]),

  record(4, 'warding_vision', 'Warding Vision', 2, ally(), ['buff'], null,
    'One ally within 30 ft gains a 6-point one-use ward against the next damage event before your next turn. Apply after mitigation; no healing and no stacking.', [
      effect('forecast.ward', { rangeFeet: 30, capacity: 6, uses: 1 }, 'Capacity-6 one-use ward.')
    ], { durationConfig: nextStart }),
  record(4, 'expose_secrets', 'Expose Secrets', 2, enemy(), ['control'], {
    op: 'forecast.expose', args: {
      rangeFeet: 30, reveal: 'one-public-weakness', savePenalty: -2,
      hiddenInformation: false, expires: 'end-target-next-turn'
    }
  }, 'Reveal one public weakness of an enemy within 30 ft: a visible gap, a declared vulnerability or a known condition. It has -2 to its next save. No secret weakness is invented.', [
    effect('forecast.expose', { reveal: 'one-public-weakness', savePenalty: -2 }, 'Reveal one public weakness and penalize one save.')
  ], { durationConfig: nextStart }),
  record(4, 'foretold_opening', 'Foretold Opening', 1, ally(), ['buff'], null,
    'One ally within 30 ft adds 2 to its next attack against a named enemy before your next turn. One use; no extra action.', [
      effect('forecast.opening', { rangeFeet: 30, bonus: 2, uses: 1 }, 'Grant +2 to one ally next attack.')
    ], { durationConfig: nextStart }),
  record(4, 'fate_strike_greater', 'Fate Strike, Greater', 2, enemy(), ['damage'], null,
    'One enemy within 30 ft takes 3d6 wyrd. The strike uses an ordinary attack or save as the table declares; it is not an automatic hit.', [
      effect('forecast.strike', { rangeFeet: 30, damage: '3d6' }, 'Deal 3d6 wyrd with a declared attack or save.')
    ], { damageConfig: damage('3d6') }),

  record(5, 'past_sins', 'Past Sins', 2, enemy(), ['damage', 'control'], {
    op: 'forecast.expose', args: { rangeFeet: 30, damage: '2d6', savePenalty: -2, requiresVisibleHistory: true }
  }, 'One enemy within 30 ft with visible evidence of past conduct takes 2d6 wyrd and has -2 to its next save. No hidden history is fabricated and no condition is applied.', [
    effect('forecast.expose', { damage: '2d6', savePenalty: -2, requiresVisibleHistory: true }, 'Deal 2d6 and penalize one save.')
  ], { damageConfig: damage('2d6'), durationConfig: nextStart }),
  record(5, 'future_strike', 'Future Strike', 2, enemy(), ['damage'], null,
    'One enemy within 30 ft takes 3d6 wyrd. The strike ignores half cover only; it is not an automatic hit and does not bypass full cover or concealment.', [
      effect('forecast.strike', { rangeFeet: 30, damage: '3d6', ignoresHalfCover: true }, 'Deal 3d6 wyrd, ignoring half cover.')
    ], { damageConfig: damage('3d6') }),
  record(5, 'prophetic_ward', 'Prophetic Ward', 2, ally(), ['buff'], null,
    'One ally within 30 ft gains an 8-point one-use ward against the next damage event before your next turn. Apply after mitigation; no healing and no stacking.', [
      effect('forecast.ward', { rangeFeet: 30, capacity: 8, uses: 1 }, 'Capacity-8 one-use ward.')
    ], { durationConfig: nextStart }),
  record(5, 'far_sight', 'Far Sight', 1, selfTarget, ['utility'], {
    op: 'forecast.read', args: { rangeFeet: 120, reveals: ['visible-layout', 'public-activity'], hiddenInformation: false }
  }, 'Study a visible area up to 120 ft away: layout, cover, light and public activity. The GM reveals only what is visible from your position; no hidden rooms or private speech.', [
    effect('forecast.read', { rangeFeet: 120, reveals: ['visible-layout', 'public-activity'] }, 'Read a distant visible area.')
  ]),

  record(6, 'foretold_opening_greater', 'Foretold Opening, Greater', 2, ally(), ['buff'], null,
    'One ally within 30 ft adds 3 to its next attack against a named enemy before your next turn. One use; no extra action.', [
      effect('forecast.opening', { rangeFeet: 30, bonus: 3, uses: 1 }, 'Grant +3 to one ally next attack.')
    ], { durationConfig: nextStart }),
  record(6, 'timeline_anchor', 'Timeline Anchor', 2, ally(), ['buff'], null,
    'One ally within 30 ft adds 2 to one save before your next turn and cannot be moved against its will by the named event. One use; no immunity to all movement.', [
      effect('forecast.anchor', { rangeFeet: 30, saveBonus: 2, forcedMovement: false, uses: 1 }, 'Grant +2 save and resist one named forced movement.')
    ], { durationConfig: nextStart }),
  record(6, 'expose_weakness_greater', 'Expose Weakness, Greater', 2, enemy(), ['control'], {
    op: 'forecast.expose', args: { rangeFeet: 30, savePenalty: -3, expires: 'end-target-next-turn', hiddenInformation: false }
  }, 'One enemy within 30 ft has -3 to its next save before the end of its next turn. No damage and no hidden information.', [
    effect('forecast.expose', { rangeFeet: 30, savePenalty: -3 }, 'Penalize one next save by 3.')
  ], { durationConfig: nextStart }),
  record(6, 'fate_strike_major', 'Fate Strike, Major', 3, enemy(), ['damage'], null,
    'One enemy within 30 ft takes 4d6 wyrd. The strike uses an ordinary attack or save as the table declares; it is not an automatic hit.', [
      effect('forecast.strike', { rangeFeet: 30, damage: '4d6' }, 'Deal 4d6 wyrd with a declared attack or save.')
    ], { damageConfig: damage('4d6') }),

  record(7, 'prescient_dodge', 'Prescient Dodge', 1, selfTarget, ['buff'], null,
    'Until the start of your next turn, add 2 to one defense or Agility save against a visible attack. One use; no invisibility or automatic miss.', [
      effect('forecast.dodge', { bonus: 2, uses: 1, expires: 'start-next-caster-turn' }, 'Add +2 to one defense or Agility save.')
    ], { durationConfig: nextStart }),
  record(7, 'expose_secrets_greater', 'Expose Secrets, Greater', 2, enemy(), ['control'], {
    op: 'forecast.expose', args: {
      rangeFeet: 30, reveal: 'one-public-weakness', savePenalty: -2,
      removesReactions: true, hiddenInformation: false
    }
  }, 'Reveal one public weakness of an enemy within 30 ft. It has -2 to its next save and cannot take reactions until the end of its next turn. No hidden weakness is invented.', [
    effect('forecast.expose', { reveal: 'one-public-weakness', savePenalty: -2, removesReactions: true }, 'Reveal a weakness and suppress reactions.')
  ], { durationConfig: nextStart }),
  record(7, 'shared_portent', 'Shared Portent', 2, ally(), ['buff'], null,
    'One ally within 30 ft adds 3 to one check, attack or save before your next turn. The ally must be able to see or hear the warning; one use.', [
      effect('forecast.share', { rangeFeet: 30, bonus: 3, scope: 'one-check-attack-or-save', uses: 1 }, 'Grant +3 to one ally roll.')
    ], { durationConfig: nextStart }),
  record(7, 'destiny_lock', 'Destiny Lock', 2, enemy(), ['control'], {
    op: 'forecast.lock', args: { rangeFeet: 30, blocksReactions: true, blocksMovement: false, expires: 'end-target-next-turn' }
  }, 'One enemy within 30 ft cannot take reactions until the end of its next turn. It can still move and act normally; no automatic hit or condition.', [
    effect('forecast.lock', { blocksReactions: true }, 'Suppress one enemy reactions.')
  ], { durationConfig: nextStart }),

  record(8, 'perfect_foresight', 'Perfect Foresight', 2, selfTarget, ['buff'], null,
    'Add 3 to one attack or save you make before the end of your next turn. One use; no die replacement and no extra action.', [
      effect('forecast.prepare', { bonus: 3, scope: 'one-attack-or-save', uses: 1 }, 'Gain +3 to one attack or save.')
    ], { durationConfig: nextStart }),
  record(8, 'psychic_assault', 'Psychic Assault', 3, enemy(), ['damage', 'control'], null,
    'One enemy within 30 ft takes 4d8 wyrd and has -2 to one save against being stunned until the end of its next turn. One damage event and one save penalty.', [
      effect('forecast.assault', { rangeFeet: 30, damage: '4d8', savePenalty: -2, condition: 'stunned' }, 'Deal 4d8 and penalize one stun save.')
    ], { damageConfig: damage('4d8'), conditions: ['stunned'], durationConfig: nextStart }),
  record(8, 'rewrite_preparation', 'Rewrite Preparation', 2, selfTarget, ['utility'], {
    op: 'forecast.rewrite', args: {
      target: 'one-own-prepared-forecast', changeBenefit: true, changeCategory: false,
      preserveSubject: true, preserveExpiry: true, diceReplacement: false
    }
  }, 'Change the published benefit of one prepared forecast you own before its named event occurs. The subject, category and expiry stay unchanged; no die is rerolled or replaced.', [
    effect('forecast.rewrite', { changeBenefit: true, preserveSubject: true, preserveExpiry: true }, 'Replace one prepared benefit before the event.')
  ]),
  record(8, 'prophets_refuge', "Prophet's Refuge", 2, ally(), ['buff'], null,
    'One ally within 30 ft gains a 10-point one-use ward against the next damage event before your next turn. Apply after mitigation; no healing and no stacking.', [
      effect('forecast.ward', { rangeFeet: 30, capacity: 10, uses: 1 }, 'Capacity-10 one-use ward.')
    ], { durationConfig: nextStart }),

  record(9, 'the_widest_reading', 'The Widest Reading', 2, selfTarget, ['utility'], {
    op: 'forecast.read', args: {
      rangeFeet: 60, reveals: ['public-weaknesses', 'visible-conditions'],
      hiddenInformation: false, prediction: false
    }
  }, 'Read the public weaknesses and visible conditions of enemies within 60 ft. No hidden weakness, private plan or future outcome is revealed.', [
    effect('forecast.read', { rangeFeet: 60, reveals: ['public-weaknesses', 'visible-conditions'] }, 'Read visible weaknesses.')
  ]),
  record(9, 'the_prepared_hour', 'The Prepared Hour', 2, ally(3), ['buff'], null,
    'Up to three allies within 30 ft each add 2 to one save before your next turn. Separate uses; no shared pool and no extra action.', [
      effect('forecast.share', { rangeFeet: 30, maxTargets: 3, bonus: 2, scope: 'one-save', separateUses: true }, 'Grant +2 to three separate saves.')
    ], { durationConfig: nextStart }),
  record(9, 'immediate_forecast', 'Immediate Forecast', 1, selfTarget, ['utility'], {
    op: 'forecast.commit', args: {
      slotMax: 2, expiryMaxOwnTurns: 1, categories: [...ORACLE_FORECAST_CATEGORIES],
      subjectRequired: true, benefitRequired: true, oncePerLongRest: true, hiddenInformation: false
    }
  }, 'Commit one forecast with a one-own-turn expiry as part of this action. It still occupies one of two slots. Once per completed long rest.', [
    effect('forecast.commit', { expiryMaxOwnTurns: 1, oncePerLongRest: true }, 'Prepare one short forecast once per long rest.')
  ], { cooldownConfig: cooldownLongRest }),
  record(9, 'the_clear_answer', 'The Clear Answer', 2, selfTarget, ['utility'], {
    op: 'forecast.ask', args: {
      scope: 'one-observable-fact', answers: ['yes', 'no', 'unknown'],
      hiddenInformation: false, prediction: false
    }
  }, 'Ask one yes-or-no question about an observable fact the table has already authored. The GM may answer yes, no or unknown. Hidden plans, private intentions and future outcomes are out of scope.', [
    effect('forecast.ask', { scope: 'one-observable-fact', answers: ['yes', 'no', 'unknown'] }, 'Ask one bounded question about observable fact.')
  ]),

  record(10, 'the_final_forecast', 'The Final Forecast', 3, ally(), ['buff'], null,
    'One ally within 30 ft adds 4 to one check, attack or save before your next turn. One use; no die replacement. Once per completed long rest.', [
      effect('forecast.share', { rangeFeet: 30, bonus: 4, scope: 'one-roll', uses: 1 }, 'Grant +4 to one ally roll.')
    ], { durationConfig: nextStart, cooldownConfig: cooldownLongRest }),
  record(10, 'the_unwritten_hour', 'The Unwritten Hour', 3, ally(), ['buff'], null,
    'Prepare one ally for a named fatal event. The next time that ally would drop to 0 health from the named category before your next turn, it remains at 1 health instead. Once per completed long rest; this is not resurrection and restores no other resource.', [
      effect('forecast.refuge', { rangeFeet: 30, trigger: 'would-drop-to-0', remainAt: 1, oncePerLongRest: true }, 'Prevent one drop to 0 health once.')
    ], { durationConfig: nextStart, cooldownConfig: cooldownLongRest }),
  record(10, 'the_open_book', 'The Open Book', 3, selfTarget, ['utility'], {
    op: 'forecast.read', args: {
      rangeFeet: 60, reveals: ['public-weaknesses', 'visible-conditions', 'public-defenses'],
      hiddenInformation: false, prediction: false
    }
  }, 'Reveal the public weaknesses, visible conditions and public defenses of enemies within 60 ft to the table. No hidden information or future certainty.', [
    effect('forecast.read', { rangeFeet: 60, reveals: ['public-weaknesses', 'visible-conditions', 'public-defenses'] }, 'Reveal public defensive information.')
  ]),
  record(10, 'fate_strike_ultimate', 'Fate Strike, Ultimate', 3, enemy(), ['damage'], null,
    'One enemy within 30 ft takes 6d6 wyrd. The strike uses an ordinary attack or save as the table declares; it is not an automatic hit. Once per completed long rest.', [
      effect('forecast.strike', { rangeFeet: 30, damage: '6d6', oncePerLongRest: true }, 'Deal 6d6 wyrd once per long rest.')
    ], { damageConfig: damage('6d6'), cooldownConfig: cooldownLongRest })
];

const signature = (suffix, name, treeId, ap, targetingConfig, program, description, effects, options = {}) => record(
  3, suffix, name, ap, targetingConfig, options.effectTypes || ['utility'], program, description, effects, {
    source: 'talent-signature', specialization: treeId, treeId,
    durationConfig: options.durationConfig || instant
  }
);

const capstone = (suffix, name, treeId, ap, targetingConfig, program, description, effects, options = {}) => record(
  10, suffix, name, ap, targetingConfig, options.effectTypes || ['utility'], program, description, effects, {
    source: 'talent-capstone', specialization: treeId, treeId,
    cooldownConfig: cooldownLongRest, durationConfig: options.durationConfig || instant
  }
);

export const ORACLE_TALENT_ACTIVES = [
  signature('read_the_next_step', 'Read the Next Step', 'seer', 1, selfTarget, {
    op: 'forecast.prepare', args: {
      bonus: 2, scope: 'one-attack-or-save', expires: 'end-next-caster-turn',
      slotMax: 2, hiddenInformation: false, diceReplacement: false
    }
  }, 'Prepare one personal certainty: add 2 to your next attack or save before the end of your next turn. It does not occupy a forecast slot unless the table records it as one; no die is replaced.', [
    effect('forecast.prepare', { bonus: 2, scope: 'one-attack-or-save' }, 'Gain +2 to one next attack or save.')
  ], { effectTypes: ['buff'], durationConfig: nextStart }),
  signature('witness_the_blow', 'Witness the Blow', 'witness', 1, ally(), {
    op: 'forecast.ward', args: {
      rangeFeet: 30, capacity: 5, uses: 1, category: 'attack-roll',
      expires: 'end-next-caster-turn', hiddenInformation: false
    }
  }, 'Name one ally within 30 ft and the next attack-roll event against it. Reduce that event damage by 5 once. The forecast is public; no die is replaced and no automatic dodge occurs.', [
    effect('forecast.ward', { capacity: 5, uses: 1, category: 'attack-roll' }, 'Reduce one named attack event by 5.')
  ], { effectTypes: ['buff'], durationConfig: nextStart }),
  signature('chart_the_safe_line', 'Chart the Safe Line', 'pathfinder', 1, ally(), {
    op: 'forecast.commit', args: {
      slotMax: 2, expiryMaxOwnTurns: 2, category: 'movement',
      benefit: 'ignore-10-feet-difficult-terrain-and-add-2-to-one-check',
      subjectRequired: true, public: true, hiddenInformation: false
    }
  }, 'Name one willing ally and a declared route. While the forecast is prepared, that ally ignores 10 ft of difficult terrain along the route and adds 2 to one check. One skill use; no teleport and no extra movement.', [
    effect('forecast.commit', { category: 'movement', benefit: 'route-benefit', expiryMaxOwnTurns: 2 }, 'Prepare one route benefit.')
  ], { effectTypes: ['buff'], durationConfig: nextStart }),
  capstone('the_clear_moment', 'The Clear Moment', 'seer', 3, selfTarget, {
    op: 'forecast.prepare', args: {
      bonus: 4, scope: 'one-attack-or-save', moveFeet: 10, wardCapacity: 4,
      expires: 'start-next-caster-turn', oncePerLongRest: true, diceReplacement: false
    }
  }, 'Prepare one clear personal moment: add 4 to your next attack or save, move 10 ft and gain a 4-point one-use ward before the start of your next turn. Once per completed long rest; no die replacement.', [
    effect('forecast.prepare', { bonus: 4, moveFeet: 10, wardCapacity: 4, oncePerLongRest: true }, 'Gain +4, 10 ft movement and a 4-point ward.')
  ], { effectTypes: ['buff'], durationConfig: nextStart }),
  capstone('the_watched_thread', 'The Watched Thread', 'witness', 3, ally(), {
    op: 'forecast.refuge', args: {
      rangeFeet: 30, category: 'damage', trigger: 'would-drop-to-0',
      remainAt: 1, oncePerLongRest: true, resurrection: false
    }
  }, 'Name one ally within 30 ft and one damage category. The next time that ally would drop to 0 health from that category before your next turn, it remains at 1 health instead. Once per completed long rest; not resurrection.', [
    effect('forecast.refuge', { trigger: 'would-drop-to-0', remainAt: 1, oncePerLongRest: true }, 'Prevent one drop to 0 health.')
  ], { effectTypes: ['buff'], durationConfig: nextStart }),
  capstone('the_certain_road', 'The Certain Road', 'pathfinder', 3, ally(3), {
    op: 'forecast.route', args: {
      rangeFeet: 30, maxTargets: 3, moveFeet: 15, difficultTerrainFeet: 10,
      routeMustBeVisible: true, teleport: false, oncePerLongRest: true
    }
  }, 'Declare one visible route. Up to three willing allies within 30 ft may move 15 ft along it and ignore 10 ft of difficult terrain, using their remaining movement. No teleport, extra action or off-route movement. Once per completed long rest.', [
    effect('forecast.route', { maxTargets: 3, moveFeet: 15, difficultTerrainFeet: 10, teleport: false }, 'Three allies move along one declared route.')
  ], { effectTypes: ['utility'], durationConfig: nextStart })
];

export const ORACLE_OPTIONAL_RECORDS = optional;
export const ORACLE_AUTHORED_RECORDS = [
  ...ORACLE_CORE_RECORDS, ...ORACLE_OPTIONAL_RECORDS,
  ...ORACLE_TALENT_ACTIVES, ...ORACLE_PASSIVE_RECORDS
];

const nodeForRecord = recordEntry => ORACLE_TALENT_NODES.find(node =>
  node.grantId === recordEntry.id || node.passiveSpellId === recordEntry.id
);

export function describeOraclePrice(recordEntry) {
  const slot = recordEntry.classResourceProgram?.op === 'forecast.commit' ? '; occupy 1 forecast slot' : '; no forecast slot';
  return `${recordEntry.resourceCost.actionPoints} AP; 0 mana${slot}; manual resolution.`;
}

export const ORACLE_PROJECTED_SPELLS = ORACLE_AUTHORED_RECORDS.map(recordEntry => {
  const node = nodeForRecord(recordEntry);
  return {
    ...flags, id: recordEntry.id, name: recordEntry.name, class: 'Oracle', level: recordEntry.level,
    source: `oracle-${recordEntry.source}`, sourceRecordSource: recordEntry.source,
    spellType: recordEntry.spellType, icon: ORACLE_ICON, description: recordEntry.description,
    specialization: node?.treeId || recordEntry.treeId || 'core', treeId: node?.treeId || recordEntry.treeId || null,
    typeConfig: {
      school: 'wyrd', castTimeType: recordEntry.spellType === 'PASSIVE' ? 'PASSIVE' : 'IMMEDIATE',
      tags: ['oracle', 'manual-only', recordEntry.source]
    },
    resourceCost: apCost(recordEntry.resourceCost.actionPoints),
    targetingConfig: recordEntry.targetingConfig, effectTypes: recordEntry.effectTypes,
    resolution: recordEntry.damageConfig ? 'DICE' : 'MANUAL', damageConfig: recordEntry.damageConfig,
    durationConfig: recordEntry.durationConfig, cooldownConfig: recordEntry.cooldownConfig,
    reactionTiming: null, savingThrow: null, conditions: recordEntry.conditions, area: recordEntry.area,
    manualRequirements: [ORACLE_MANUAL_NOTICE, describeOraclePrice(recordEntry), ...Object.values(ORACLE_COMMON_MECHANICS)],
    tags: ['oracle', 'manual-only', recordEntry.source], categoryIds: [],
    specialMechanics: {
      oracle: {
        ...flags, sourceRecordId: recordEntry.id, priceSummary: describeOraclePrice(recordEntry),
        authoredSpell: recordEntry, commonRules: ORACLE_COMMON_MECHANICS,
        rankValues: recordEntry.rankValues || null, requires: recordEntry.requires || null
      }
    }
  };
});

export const ORACLE_PROJECTED_SPELLS_BY_ID = Object.fromEntries(
  ORACLE_PROJECTED_SPELLS.map(spell => [spell.id, spell])
);

export const ORACLE_SPELL_POOLS = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => {
    const level = index + 1;
    return [level, ORACLE_OPTIONAL_RECORDS.filter(spell => spell.level === level).map(spell => spell.id)];
  })
);

export const ORACLE_PROGRESSION_POLICY = {
  classId: ORACLE_CLASS_ID, rulesetVersion: ORACLE_RULESET_VERSION,
  levelCap: 10, startingSpellPicks: 1, optionalPicksPerLevel: 1,
  allowEarlierUnchosen: true, grantedCoreSpellIds: ORACLE_CORE_RECORDS.map(spell => spell.id),
  randomizeStartingSpells: false, autoTopUpOnLoad: false, talentActivesAreGrants: true,
  manualOnly: true
};

const oracleNodeById = Object.fromEntries(ORACLE_TALENT_NODES.map(node => [node.id, node]));
const oracleTreePoints = (ranks, treeId) => ORACLE_TALENT_NODES
  .filter(node => node.treeId === treeId)
  .reduce((total, node) => total + (ranks[node.id] || 0), 0);

export const pruneOracleTalents = (talents, characterLevel) => {
  const ranks = talents && typeof talents === 'object' ? { ...talents } : {};
  const level = Number.isInteger(characterLevel) ? Math.max(1, characterLevel) : 10;
  Object.keys(ranks).forEach(nodeId => {
    const node = oracleNodeById[nodeId];
    if (!node || !Number.isInteger(ranks[nodeId]) || ranks[nodeId] < 1 || ranks[nodeId] > node.maxRanks) {
      delete ranks[nodeId];
    }
  });
  const pruneStructure = () => {
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of ORACLE_TALENT_NODES) {
        const rank = ranks[node.id];
        if (!rank) continue;
        const gatePoints = oracleTreePoints(ranks, node.treeId) - rank;
        const predecessorMissing = node.requires.some(predecessorId => {
          const predecessor = oracleNodeById[predecessorId];
          return !predecessor || (ranks[predecessorId] || 0) !== predecessor.maxRanks;
        });
        if (node.minLevel > level || gatePoints < node.requiresPoints || predecessorMissing) {
          delete ranks[node.id];
          changed = true;
        }
      }
    }
  };
  pruneStructure();
  const budget = Math.min(50, level * 5);
  let guard = 0;
  while (Object.values(ranks).reduce((total, rank) => total + rank, 0) > budget && guard < 200) {
    guard += 1;
    let target = null;
    ORACLE_TALENT_NODES.forEach(node => {
      if (!ranks[node.id]) return;
      if (target === null || node.minLevel >= oracleNodeById[target].minLevel) target = node.id;
    });
    if (target === null) break;
    ranks[target] -= 1;
    if (ranks[target] === 0) delete ranks[target];
    pruneStructure();
  }
  return ranks;
};

const FORECAST_STATUSES = ['prepared', 'fulfilled', 'failed', 'expired'];
const isText = value => typeof value === 'string' && value.trim().length > 0;
const integerBetween = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;

export function validateOracleState(state) {
  const errors = [];
  if (!state || typeof state !== 'object') return { valid: false, errors: ['state must be an object'] };
  if (!Array.isArray(state.slots)) errors.push('slots must be an array');
  const slots = Array.isArray(state.slots) ? state.slots : [];
  const prepared = slots.filter(slot => slot?.status === 'prepared');
  if (prepared.length > 2) errors.push('at most two prepared forecasts');
  if (state.maxSlots !== undefined && state.maxSlots !== 2) errors.push('maxSlots must be 2');
  const ids = new Set();
  slots.forEach((slot, index) => {
    if (!slot || typeof slot !== 'object') { errors.push(`forecast ${index} must be an object`); return; }
    if (!isText(slot.id)) errors.push(`forecast ${index} requires an id`);
    else if (ids.has(slot.id)) errors.push(`duplicate forecast id ${slot.id}`);
    else ids.add(slot.id);
    if (!isText(slot.subject)) errors.push(`forecast ${slot.id ?? index} requires a subject`);
    if (!ORACLE_FORECAST_CATEGORIES.includes(slot.category)) errors.push(`forecast ${slot.id ?? index} has an invalid category`);
    if (!isText(slot.benefit)) errors.push(`forecast ${slot.id ?? index} requires a benefit`);
    if (!integerBetween(slot.expiresInOwnTurns, 1, 2)) errors.push(`forecast ${slot.id ?? index} expiry must be 1 or 2 own turns`);
    if (!FORECAST_STATUSES.includes(slot.status)) errors.push(`forecast ${slot.id ?? index} has an invalid status`);
    if (slot.diceReplacement === true) errors.push(`forecast ${slot.id ?? index} cannot replace a die`);
  });
  return { valid: errors.length === 0, errors };
}

export function projectOracleResource(resource, isOwner = false) {
  const state = resource?.state ?? null;
  if (!state) {
    return { initialized: false, valid: true, errors: [], preparedCount: 0, maxSlots: 2, forecasts: [] };
  }
  const check = validateOracleState(state);
  const raw = Array.isArray(state.slots) ? state.slots : [];
  const forecasts = raw.map(entry => {
    const slot = entry && typeof entry === 'object' ? entry : {};
    return {
      id: slot.id || null,
      subject: slot.subject || 'Unrecorded subject',
      category: ORACLE_FORECAST_CATEGORIES.includes(slot.category) ? slot.category : 'unknown',
      benefit: slot.benefit || 'Unrecorded benefit',
      expiresInOwnTurns: integerBetween(slot.expiresInOwnTurns, 1, 2) ? slot.expiresInOwnTurns : null,
      status: FORECAST_STATUSES.includes(slot.status) ? slot.status : 'unknown',
      ...(isOwner && Number.isInteger(slot.createdTurn) ? { createdTurn: slot.createdTurn } : {})
    };
  });
  return {
    initialized: true, valid: check.valid, errors: check.errors,
    preparedCount: forecasts.filter(forecast => forecast.status === 'prepared').length,
    maxSlots: 2, forecasts
  };
}

export const ORACLE_RESOURCE_RULES = {
  slotMax: 2, expiryMinOwnTurns: 1, expiryMaxOwnTurns: 2,
  categories: ORACLE_FORECAST_CATEGORIES, statuses: FORECAST_STATUSES,
  noDebt: true, noDiceReplacement: true, noOmniscience: true, hiddenInformation: false,
  publicDeclarations: true, automaticFulfillment: false,
  refreshOnLongRest: false, refreshOnReconnect: false, refreshOnInitiative: false,
  mechanicalHeritageBenefits: false, manualOnly: true
};

export const ORACLE_RESOURCE_SYSTEM = {
  id: 'oracle-forecasts', name: 'Forecasts', shortName: 'Forecast', type: 'oracle-forecasts',
  title: 'Forecast Slots', subtitle: 'Two prepared possibilities, no debt and no dice.',
  base: 0, max: 2, slotMax: 2, manualOnly: true,
  description: 'Record at most two prepared forecasts. Each names one exact subject, one event category, one published benefit and a one-or-two own-turn expiry. Fulfillment grants the benefit once; failure or expiry grants nothing. There is no Omen Debt and no die replacement.',
  cards: [
    { title: 'Forecast Slots (0-2)', stats: 'Two prepared possibilities', details: 'A forecast occupies one slot until it fulfills, fails, expires or is released. No third slot exists.' },
    { title: 'Exact Terms', stats: 'Subject, category, benefit, expiry', details: 'Each forecast is published before the event. The table records fulfillment once; a failed or expired forecast awards nothing.' },
    { title: 'No Debt, No Dice', stats: 'No Omen Debt, no rerolls', details: 'Oracle does not accumulate debt and never replaces, banks or rerolls a die result. Reading uses observable evidence or bounded GM vision.' }
  ],
  generationTable: {
    headers: ['Outcome', 'Benefit', 'Record treatment'],
    rows: [
      ['Named event occurs', 'Apply once', 'Mark fulfilled and free the slot after resolution'],
      ['Named event fails', 'None', 'Mark failed and free the slot'],
      ['Expiry reached', 'None', 'Mark expired and free the slot'],
      ['Invalid or duplicate declaration', 'None', 'Reject the whole declaration; keep existing slots unchanged']
    ]
  },
  usage: {
    momentum: 'Prepare a forecast before the event, keep its terms public and spend the benefit only when the named category actually occurs.',
    flourish: 'Use two slots for one personal preparation and one ally protection, or commit to a route; never assume an event happened without the table confirming it.'
  },
  mechanics: {
    title: 'Manual Forecast Ledger',
    content: 'At most two prepared forecasts. Each has an exact subject, one event category from the closed list, one published benefit and a one-or-two own-turn expiry. Fulfillment, failure and expiry are table events, never hidden timers.',
    sections: [
      { label: 'Slots', mechanics: [{ text: 'Exactly two. A third prepared forecast is rejected unchanged.' }, { text: 'A released forecast frees its slot but grants no benefit.' }] },
      { label: 'Information', mechanics: [{ text: 'Only observable evidence or a bounded GM vision; no hidden plans or future certainty.' }, { text: 'No die is replaced, rerolled or banked.' }] }
    ]
  },
  overheatRules: {
    title: 'Failed Prophecy',
    content: 'A forecast that fails or expires grants nothing. It is not converted into debt, damage or a replacement slot. A duplicate or invalid declaration is rejected without changing the two existing slots.'
  },
  playingInPerson: {
    title: 'The Two-Slot Table',
    subtitle: 'Two forecast cards and a visible expiry marker',
    content: 'Use two forecast cards. Write the exact subject, category, benefit and own-turn expiry on each. Turn the card over only when the event is confirmed. On failure or expiry, write the outcome and clear the card. Never add a third card or a debt track.'
  },
  nativeNote: 'No native heritage edge is registered. Lumian and Ordu are recommendations only.'
};

export const ORACLE_DATA = {
  ...flags, id: ORACLE_CLASS_ID, name: 'Oracle', variantName: 'Oracle',
  icon: ORACLE_ICON, imageIcon: '/assets/icons/classes/oracle.png',
  role: 'Support / Insight', damageTypes: ['wyrd', 'storm'],
  resource: 'Forecasts', primaryStat: 'Spirit', secondaryStat: 'Intelligence',
  developmentStatus: 'development', statusLabel: 'Development - manual tabletop',
  heritageEffectsImplemented: false, nativeAccess: [],
  classResource: {
    type: 'oracle-forecasts', base: 0, max: 2,
    initialized: false, state: null,
    generationNote: 'Uninitialized until the table records an actual forecast. At most two slots; a forecast grants its benefit only once when its named event occurs.'
  },
  restrictions: {
    allowedSubraces: [], hardBlocks: [], narrativeUnlock: true,
    acquisition: {
      status: 'proposed',
      records: [
        { id: 'observed_omen', label: 'Observed omen', text: 'Recorded one actual observable sign or bounded GM vision and the evidence that supported it.' },
        { id: 'forecast_discipline', label: 'Forecast discipline', text: 'Named an exact subject, category, benefit and expiry before the event without adding hidden information.' },
        { id: 'expiry_accounting', label: 'Expiry accounting', text: 'Closed fulfilled, failed and expired forecasts exactly once across one full session.' },
        { id: 'bounded_reading', label: 'Bounded reading', text: 'Demonstrated a reading that used only observable evidence or a GM-authored bounded vision.' }
      ]
    },
    justification: 'Oracle is an independent development class. It does not inherit Augur Benediction, Malediction or Omen Debt and grants no native heritage edge.'
  },
  equipment: { weapons: ['staff', 'dagger'], protectiveGear: ['robes', 'light_ward'], offHand: ['empty', 'tome'] },
  subraceVariants: {},
  overview: {
    title: 'The Oracle', subtitle: 'Two possible futures, carefully prepared.',
    description: 'An Oracle commits one or two exact forecasts, names the event that would fulfill each and prepares a bounded benefit. No debt, no dice replacement and no hidden omniscience.',
    quickOverview: {
      title: 'Class Overview',
      content: 'Two forecast slots, each with an exact subject, category, benefit and one-or-two own-turn expiry. Commit a Forecast and Release the Forecast are core. Four optional records at every level and one bounded signature and capstone per tree. Manual tabletop only.'
    },
    combatRole: 'Prepared support and insight: personal preparation, named ally protection and declared route benefits.',
    playstyle: {
      title: 'Turn 1',
      content: 'Choose a subject and a category before the event. Publish the benefit and expiry. When the event occurs, apply the benefit once and close the slot; if it fails or expires, record that and grant nothing.'
    },
    roleplayIdentity: {
      title: 'A prepared reading, not a debt or a die swap',
      content: 'Oracle is independent of Augur and Fate Weaver. It does not restore Omen Debt, Benediction, Malediction or consequence threads. It reads observable evidence and prepares a limited response.'
    },
    currentCrisis: 'Development class; no native heritage access is registered. Lumian star-watching and Ordu route-reading are recommendations pending approval.'
  },
  characterCreation: {
    title: 'Oracle',
    description: 'Choose one level-1 optional; Commit a Forecast and Release the Forecast are core grants. Record acquisition requirements. Forecast state stays uninitialized until the table records a declaration.'
  },
  specializations: {
    title: 'Three Reading Disciplines',
    description: 'First investment chooses a primary tree. Five talent points per level, global cap fifty. Signatures require ten same-tree points at level three; capstones forty-five at level ten.',
    specs: ORACLE_TREE_META.map(meta => ({
      id: meta.id, name: meta.name, icon: ORACLE_ICON, theme: meta.tagline,
      description: meta.tagline, playstyle: meta.tagline
    }))
  },
  spells: ORACLE_PROJECTED_SPELLS, spellPools: ORACLE_SPELL_POOLS,
  progression: {
    levelCap: 10, policy: ORACLE_PROGRESSION_POLICY,
    levels: Array.from({ length: 10 }, (_, index) => ({
      level: index + 1, newChoiceIds: ORACLE_SPELL_POOLS[index + 1],
      optionalPicks: 1, talentBudget: (index + 1) * 5
    }))
  },
  talentTrees: ORACLE_TALENT_CAPACITY,
  resourceSystem: { ...ORACLE_RESOURCE_SYSTEM },
  heritageRecommendation: ['vashir_astril', 'ordan_human']
};

export const ORACLE_MANIFEST = {
  ...flags, contentLock: 'RI-5 Oracle complete content lock',
  optional: ORACLE_OPTIONAL_RECORDS.map(recordEntry => recordEntry.id),
  core: ORACLE_CORE_RECORDS.map(recordEntry => recordEntry.id),
  talentActives: ORACLE_TALENT_ACTIVES.map(recordEntry => recordEntry.id),
  passives: ORACLE_PASSIVE_RECORDS.map(recordEntry => recordEntry.id),
  records: ORACLE_AUTHORED_RECORDS.map(recordEntry => ({
    id: recordEntry.id, name: recordEntry.name, level: recordEntry.level, source: recordEntry.source,
    treeId: nodeForRecord(recordEntry)?.treeId || null,
    ap: recordEntry.resourceCost.actionPoints, mana: 0
  })),
  nodes: ORACLE_TALENT_NODES.map(node => ({
    id: node.id, treeId: node.treeId, spellId: node.grantId || node.passiveSpellId,
    ranks: node.maxRanks, minimumLevel: node.minLevel, requiresPoints: node.requiresPoints,
    prerequisites: node.requires
  })),
  uniqueRecords: 96, activeRecords: 48, passiveRecords: 48,
  talentNodes: 54, talentCapacity: ORACLE_TALENT_CAPACITY,
  nativeAccess: [], acquisitionRequirements: ORACLE_DATA.restrictions.acquisition.records.map(recordEntry => recordEntry.id),
  heritageEffectsImplemented: false, resourceRules: ORACLE_RESOURCE_RULES,
  trees: ORACLE_TREES.map(tree => tree.id),
  dependencies: ['CR-R1', 'RI-5 content lock', 'manual-tabletop'],
  automaticConversion: false
};

export default ORACLE_DATA;
