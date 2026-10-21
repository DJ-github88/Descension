import {
  FATE_WEAVER_TREE_META, FATE_WEAVER_TREES, FATE_WEAVER_TALENT_NODES,
  FATE_WEAVER_PASSIVE_RECORDS, FATE_WEAVER_TALENT_CAPACITY
} from '../talentTrees/fateWeaver';

export const FATE_WEAVER_CLASS_ID = 'fate-weaver';
export const FATE_WEAVER_RULESET_VERSION = 'cr-review-r1';
export const FATE_WEAVER_ICON = 'Psychic/Psychic Telepathy';
export const FATE_WEAVER_MANUAL_NOTICE = 'Manual tabletop only. No automatic AP, HP, movement, link, token, ward, transfer, expiry or settlement.';

const flags = {
  classId: FATE_WEAVER_CLASS_ID, rulesetVersion: FATE_WEAVER_RULESET_VERSION,
  authoredOnly: true, manualOnly: true, executionEnabled: false,
  applicationMode: 'manual-tabletop', automatedCapabilities: [],
  manualNotice: FATE_WEAVER_MANUAL_NOTICE
};
const id = suffix => `cr1_fate_weaver_${suffix}`;
const NEXT = 'next_caster_turn_start';
const instant = { durationType: 'instant', durationValue: 0, durationUnit: 'instant' };
const nextStart = { durationType: 'own_turns', durationValue: 1, durationUnit: NEXT };
const minutes = (value = 10) => ({ durationType: 'minutes', durationValue: value, durationUnit: 'minutes' });
const self = () => ({ targetingType: 'self', rangeType: 'self', rangeDistance: 0, targetRestrictions: ['self'], maxTargets: 1 });
const target = (roles, maxTargets = 1, rangeDistance = 30) => ({
  targetingType: maxTargets > 1 ? 'multiple' : 'single', rangeType: 'ranged',
  rangeDistance, targetRestrictions: roles, maxTargets
});
const ally = (n = 1, feet = 30) => target(['ally', 'self'], n, feet);
const otherAlly = (n = 1, feet = 30) => target(['ally'], n, feet);
const enemy = (n = 1, feet = 30) => target(['enemy'], n, feet);
const somaticText = 'Trace the declared thread and speak its public term; exact choices precede resolution.';
const apCost = actionPoints => ({
  actionPoints, mana: 0, resourceTypes: ['actionPoints'],
  resourceValues: { actionPoints, mana: 0 }, useFormulas: {}, components: ['somatic'], somaticText
});
const damage = formula => ({ formula, damageTypes: ['wyrd'], resolution: 'DICE' });
const cooldownNone = { cooldownType: 'none', cooldownValue: 0 };
const cooldownLongRest = { cooldownType: 'long_rest', cooldownValue: 1 };

const linkEffect = (op, args, description) => ({
  kind: 'fate-link', operation: op, args, description, executable: false
});

const record = (level, suffix, name, ap, targetingConfig, effectTypes, program, description, effects = [], options = {}) => ({
  ...flags, id: id(suffix), name, level, specialization: options.specialization || null,
  treeId: options.treeId || null,
  source: options.source || 'optional', spellType: 'ACTION', icon: FATE_WEAVER_ICON,
  resourceCost: apCost(ap), targetingConfig, effectTypes,
  damageConfig: options.damageConfig || null, durationConfig: options.durationConfig || instant,
  cooldownConfig: options.cooldownConfig || cooldownNone,
  reactionTiming: null, savingThrow: null, conditions: options.conditions || [], area: null,
  description,
  classResourceProgram: program ? { version: 1, domain: 'fate-links', ...program } : null,
  manualMechanics: {
    price: { actionPoints: ap, mana: 0, tokens: program?.args?.tokens || 0 },
    effects: effects.length ? effects : [linkEffect(program?.op || 'link.none', program?.args || {}, description)],
    executable: false
  },
  sourceRefs: ['Phase 2B content lock']
});

export const FATE_WEAVER_COMMON_MECHANICS = {
  price: 'AP and mana are explicit; links reserve thread tokens, never a second resource bank.',
  consent: 'Every link and covenant requires recorded consent from both actors. Consent can be withdrawn; withdrawal ends the link immediately.',
  tokens: 'Exactly three tokens in free, reserved or recovering. One token per link. Max three links. Expired links recover only on a completed long rest; cut links recover per their authored rule.',
  links: 'Distinct endpoints, maximum 60 ft formation range unless a record says otherwise, one consequence per link per round, and no recursive transfer.',
  damage: 'Only original assigned damage after normal mitigation can be transferred; derived damage never qualifies. A transfer moves at most three points and is not a new damage event.',
  expiry: 'Own-turn and explicit completed-long-rest timing only. No reconnect, initiative, class-change or scene-change refill.',
  information: 'Only visible links, observable endpoints and public terms. No mind reading, hidden clauses or future certainty.',
  recovery: 'A completed long rest returns all recovering tokens to free. Eternal Tapestry and Eternal Thread change only their authored recovery cases.',
  native: 'Fate Weaver has no registered native heritage edge. Kessen Neth access is not implied, and no heritage benefit or cost is granted.'
};

export const FATE_WEAVER_CORE_RECORDS = [
  record(1, 'tie_thread', 'Tie the Thread', 1, ally(), ['utility'], {
    op: 'link.tie', args: { tokens: 1, maxLinks: 3, rangeFeet: 60, consentRequired: true, uses: 1, expires: NEXT }
  }, 'Reserve one free thread token and link yourself to one willing ally within 60 ft. The link records both endpoints, public purpose, consent, one use and expiry at the start of your next turn. It transfers no damage by itself.', [
    linkEffect('link.tie', { tokens: 1, maxLinks: 3, rangeFeet: 60, consentRequired: true, uses: 1, expires: NEXT }, 'Create one consented link; reserve one token.')
  ], { source: 'core' }),
  record(1, 'cut_clean', 'Cut Clean', 1, ally(), ['utility'], {
    op: 'link.cut', args: { tokens: 0, maxLinks: 3, target: 'one-link', refund: 'free', rangeFeet: 60 }
  }, 'End one link you created. Its token becomes free immediately; any remaining uses or unspent consequence are lost. No damage, transfer, extra attack or renewed link.', [
    linkEffect('link.cut', { target: 'one-link', refund: 'free', rangeFeet: 60 }, 'Sever one existing link and free its token.')
  ], { source: 'core' })
];

const optional = [
  record(1, 'trace_the_line', 'Trace the Line', 1, self(), ['utility'], {
    op: 'link.read', args: { inspect: 'one-visible-link', rangeFeet: 30, reveals: ['endpoints', 'public-purpose'], hiddenInformation: false }
  }, 'Inspect one visible link or covenant within 30 ft. Learn its endpoints and declared public purpose, not hidden thoughts or private clauses.', [
    linkEffect('link.read', { rangeFeet: 30, reveals: ['endpoints', 'public-purpose'] }, 'Read one visible link public term.')
  ]),
  record(1, 'steady_the_hand', 'Steady the Hand', 1, ally(), ['buff'], null, 'One ally within 30 ft gains +2 to its next otherwise legal check or save before the start of your next turn. One use; a check and a save cannot both use it.', [
    { kind: 'check-bonus', target: 'one-ally', bonus: 2, uses: 1, expires: NEXT, scope: 'next-check-or-save' }
  ], { durationConfig: nextStart }),
  record(1, 'borrowed_step', 'Borrowed Step', 1, ally(), ['utility'], null, 'One willing ally within 30 ft moves up to 10 ft using remaining legal movement. Ordinary consequences apply; no teleport, disengage or reaction immunity.', [
    { kind: 'voluntary-movement', target: 'one-ally', distanceFeet: 10, consumesRemainingAllowance: true }
  ]),
  record(1, 'fraying_lash', 'Fraying Lash', 2, enemy(), ['damage', 'control'], null, 'One enemy within 30 ft takes 1d6 wyrd and has -1 to its next save before your next turn. One damage event and one save penalty.', [
    { kind: 'damage', formula: '1d6', damageTypes: ['wyrd'] },
    { kind: 'save-penalty', amount: -1, uses: 1, expires: NEXT }
  ], { damageConfig: damage('1d6'), durationConfig: nextStart }),

  record(2, 'read_bond', 'Read the Bond', 2, self(), ['utility'], {
    op: 'bond.read', args: { inspect: 'one-visible-bond', rangeFeet: 30, reveals: ['public-purpose', 'consent-state', 'remaining-uses', 'expiry'], hiddenInformation: false }
  }, 'Inspect one visible bond within 30 ft: public purpose, consent state, remaining uses and expiry. No private memory, hidden clause or future certainty.', [
    linkEffect('bond.read', { rangeFeet: 30, reveals: ['public-purpose', 'consent-state', 'remaining-uses', 'expiry'] }, 'Read one visible bond public state.')
  ]),
  record(2, 'shared_burden', 'Shared Burden', 1, ally(), ['utility'], {
    op: 'link.transfer', args: { tokens: 0, target: 'linked-ally', amountMax: 2, event: 'original-assigned-damage', uses: 1, expires: NEXT, recursive: false }
  }, 'Choose one linked ally within 30 ft. The next time that ally takes original assigned damage before your next turn, redirect up to 2 of it to you after normal mitigation. One use; no derived damage and no recursive transfer.', [
    linkEffect('link.transfer', { amountMax: 2, event: 'original-assigned-damage', uses: 1, expires: NEXT }, 'Redirect up to 2 original damage to the caster.')
  ], { durationConfig: nextStart }),
  record(2, 'thread_sense', 'Thread Sense', 1, self(), ['utility'], {
    op: 'link.detect', args: { rangeFeet: 30, reveals: ['presence', 'direction'], identities: 'observable-endpoints-only', hiddenInformation: false }
  }, 'Detect the presence and direction of links and covenants within 30 ft. No identities beyond observable endpoints and no thoughts.', [
    linkEffect('link.detect', { rangeFeet: 30, reveals: ['presence', 'direction'] }, 'Sense nearby links.')
  ]),
  record(2, 'guiding_pull', 'Guiding Pull', 1, ally(), ['utility'], {
    op: 'link.move', args: { tokens: 0, target: 'linked-willing-ally', distanceFeet: 10, legalPath: true, harmfulDestination: false }
  }, 'One linked willing ally within 30 ft moves up to 10 ft along a legal path using remaining movement. It cannot be pulled through an obstacle or into obvious harm.', [
    linkEffect('link.move', { distanceFeet: 10, legalPath: true }, 'Move a linked ally 10 ft.')
  ]),

  record(3, 'fray_the_edge', 'Fray the Edge', 1, enemy(), ['control'], {
    op: 'link.fray', args: { tokens: 0, target: 'linked-enemy', savePenalty: -2, uses: 1, expires: NEXT }
  }, 'One linked enemy within 30 ft has -2 to its next save before your next turn. One use; no condition unless the table applies one separately.', [
    linkEffect('link.fray', { savePenalty: -2, uses: 1, expires: NEXT }, 'Weaken a linked enemy next save.')
  ], { durationConfig: nextStart }),
  record(3, 'anchored_step', 'Anchored Step', 1, ally(), ['buff'], null, 'One ally within 30 ft gains +10 ft to its remaining movement this turn. No extra action, disengage or teleport.', [
    { kind: 'movement-bonus', target: 'one-ally', distanceFeet: 10, expires: 'end-current-turn' }
  ]),
  record(3, 'covenant_of_silence', 'Covenant of Silence', 2, ally(), ['buff'], null, 'One ally within 30 ft gains +2 to one Stealth check and one Deception check made within 10 minutes. Each check must be declared separately.', [
    { kind: 'check-bonus', target: 'one-ally', bonus: 2, uses: 1, skill: 'stealth', expiresMinutes: 10 },
    { kind: 'check-bonus', target: 'one-ally', bonus: 2, uses: 1, skill: 'deception', expiresMinutes: 10 }
  ], { durationConfig: minutes() }),
  record(3, 'witness_echo', 'Witness Echo', 1, self(), ['utility'], null, 'Replay one observable visual or audible event you witnessed within the last minute. It does not recover hidden information or create evidence.', [
    { kind: 'observable-replay', windowMinutes: 1, hiddenInformation: false, createsEvidence: false }
  ]),

  record(4, 'cut_and_run', 'Cut and Run', 1, self(), ['utility'], {
    op: 'link.cut', args: { tokens: 0, target: 'one-own-link', refund: 'recovering', moveFeet: 15 }
  }, 'End one link you created and move up to 15 ft using remaining legal movement. No extra severance effect and no immediate token refund.', [
    linkEffect('link.cut', { target: 'one-own-link', refund: 'recovering', moveFeet: 15 }, 'Cut a link and move.')
  ]),
  record(4, 'twin_threads', 'Twin Threads', 2, otherAlly(2), ['utility'], {
    op: 'link.tie', args: { tokens: 2, maxLinks: 3, rangeFeet: 30, consentRequired: true, uses: 1, expires: NEXT, links: 2 }
  }, 'Create two links to two willing allies within 30 ft, one token each. Both require consent and count against the three-link cap.', [
    linkEffect('link.tie', { tokens: 2, links: 2, rangeFeet: 30, consentRequired: true }, 'Create two separate links.')
  ]),
  record(4, 'soothing_weave', 'Soothing Weave', 1, ally(), ['buff'], {
    op: 'link.ward', args: { tokens: 0, target: 'linked-ally', reduction: 3, uses: 1, expires: NEXT, event: 'original-damage' }
  }, 'One linked ally within 30 ft reduces the next original damage it takes before your next turn by 3. One use; not healing or temporary HP.', [
    linkEffect('link.ward', { reduction: 3, uses: 1, expires: NEXT }, 'Reduce next original damage by 3.')
  ], { durationConfig: nextStart }),
  record(4, 'read_the_room', 'Read the Room', 1, self(), ['utility'], null, 'Gain +3 to one Investigation or Insight check about observable links, obligations or conduct within 30 ft. Declare the check before rolling.', [
    { kind: 'check-bonus', target: 'self', bonus: 3, uses: 1, scope: 'investigation-or-insight', rangeFeet: 30 }
  ]),

  record(5, 'bind_the_blow', 'Bind the Blow', 2, ally(), ['buff'], {
    op: 'link.ward', args: { tokens: 0, target: 'linked-ally', capacity: 4, uses: 1, expires: NEXT, timing: 'after-mitigation-before-fate-routing' }
  }, 'One linked ally within 30 ft gains a capacity-4, one-use damage ward until your next turn starts. It applies after normal mitigation and before Fate routing or temporary HP.', [
    linkEffect('link.ward', { capacity: 4, uses: 1, expires: NEXT }, 'Capacity-4 one-use ward.')
  ], { durationConfig: nextStart }),
  record(5, 'redirect_fate', 'Redirect Fate', 2, ally(), ['utility'], {
    op: 'link.transfer', args: { tokens: 0, target: 'linked-ally', amountMax: 3, event: 'original-assigned-damage', uses: 1, expires: NEXT, recursive: false }
  }, 'Transfer up to 3 original assigned damage from one linked ally within 30 ft to you after mitigation. One use; no recursive transfer.', [
    linkEffect('link.transfer', { amountMax: 3, uses: 1, expires: NEXT }, 'Transfer up to 3 original damage.')
  ], { durationConfig: nextStart }),
  record(5, 'thread_of_haste', 'Thread of Haste', 1, ally(), ['buff'], null, 'One ally within 30 ft gains +15 ft to its remaining legal movement this turn. No extra action and no ignoring obstacles.', [
    { kind: 'movement-bonus', target: 'one-ally', distanceFeet: 15, expires: 'end-current-turn' }
  ]),
  record(5, 'quiet_covenant', 'Quiet Covenant', 1, ally(), ['buff'], null, 'One ally within 30 ft gains +2 to one Stealth check and one Sleight of Hand check within 10 minutes. Each check declared separately.', [
    { kind: 'check-bonus', target: 'one-ally', bonus: 2, uses: 1, skill: 'stealth', expiresMinutes: 10 },
    { kind: 'check-bonus', target: 'one-ally', bonus: 2, uses: 1, skill: 'sleight_of_hand', expiresMinutes: 10 }
  ], { durationConfig: minutes() }),

  record(6, 'severing_word', 'Severing Word', 2, enemy(), ['control'], {
    op: 'link.sever', args: { tokens: 0, target: 'linked-enemy', savePenalty: -2, uses: 1, expires: NEXT }
  }, 'End one link to an enemy within 30 ft and impose -2 on that target next save before your next turn. No damage by itself.', [
    linkEffect('link.sever', { savePenalty: -2, uses: 1, expires: NEXT }, 'Sever and penalize next save.')
  ], { durationConfig: nextStart }),
  record(6, 'woven_guard', 'Woven Guard', 2, ally(), ['buff'], {
    op: 'link.ward', args: { tokens: 0, target: 'ally', reduction: 2, events: 2, expires: NEXT, pooling: false }
  }, 'One ally within 30 ft reduces each of the next two original damage events before your next turn by 2. Separate events; no pooling.', [
    linkEffect('link.ward', { reduction: 2, events: 2, expires: NEXT }, 'Reduce two separate events by 2.')
  ], { durationConfig: nextStart }),
  record(6, 'distant_thread', 'Distant Thread', 1, self(), ['utility'], {
    op: 'link.range', args: { tokens: 0, nextLinkOnly: true, rangeBonusFeet: 60, maximumRangeFeet: 90, expires: 'end-current-turn' }
  }, 'The next link you create this turn may form 60 ft beyond its normal range, to a maximum of 90 ft. It still requires consent and a slot.', [
    linkEffect('link.range', { rangeBonusFeet: 60, maximumRangeFeet: 90 }, 'Extend the next link range.')
  ]),
  record(6, 'borrowed_eyes', 'Borrowed Eyes', 1, ally(1, 60), ['utility'], {
    op: 'link.sense', args: { tokens: 0, target: 'linked-willing-ally', share: 'visual-perspective', durationMinutes: 1, telepathy: false }
  }, 'Share one linked willing ally visual perspective within 60 ft for 1 minute. No telepathy, memory access or hidden information.', [
    linkEffect('link.sense', { share: 'visual-perspective', durationMinutes: 1 }, 'Share visual perspective.')
  ], { durationConfig: minutes(1) }),

  record(7, 'covenant_of_steel', 'Covenant of Steel', 2, ally(), ['buff'], {
    op: 'link.ward', args: { tokens: 0, target: 'ally', reduction: 3, events: 2, expires: NEXT, stacking: 'none' }
  }, 'One ally within 30 ft reduces each of the next two original damage events before your next turn by 3. No stacking with itself.', [
    linkEffect('link.ward', { reduction: 3, events: 2, expires: NEXT }, 'Reduce two events by 3.')
  ], { durationConfig: nextStart }),
  record(7, 'cut_the_current', 'Cut the Current', 2, enemy(), ['damage', 'control'], {
    op: 'link.sever', args: { tokens: 0, target: 'linked-enemy', damage: '2d6', damageType: 'wyrd', secondary: false }
  }, 'End one link to an enemy within 30 ft and deal 2d6 wyrd. One damage event; no transfer or secondary effect.', [
    linkEffect('link.sever', { damage: '2d6', secondary: false }, 'Sever and deal 2d6 wyrd.')
  ], { damageConfig: damage('2d6') }),
  record(7, 'tapestry_step', 'Tapestry Step', 1, self(), ['utility'], null, 'Move up to 20 ft along a visible legal path using remaining movement. No teleport, phasing or opportunity immunity.', [
    { kind: 'voluntary-movement', target: 'self', distanceFeet: 20, visibleLegalPath: true }
  ]),
  record(7, 'fate_read', 'Fate Read', 2, self(), ['utility'], null, 'Ask one bounded question about the likely immediate physical consequence of a declared action. The GM answers from observable evidence; no certainty, hidden plans or future outcomes.', [
    { kind: 'bounded-consequence-read', questions: 1, certainty: false, evidenceOnly: true }
  ]),

  record(8, 'threefold_knot', 'Threefold Knot', 2, otherAlly(3), ['utility'], {
    op: 'link.tie', args: { tokens: 3, maxLinks: 3, rangeFeet: 30, consentRequired: true, uses: 1, expires: NEXT, links: 3 }
  }, 'Create three links to three willing allies within 30 ft, one token each, up to the three-link cap. Each link remains separately severable.', [
    linkEffect('link.tie', { tokens: 3, links: 3, rangeFeet: 30 }, 'Create three separate links.')
  ]),
  record(8, 'sever_the_anchor', 'Sever the Anchor', 2, enemy(), ['control'], {
    op: 'link.sever', args: { tokens: 0, target: 'linked-enemy', savePenalty: -3, uses: 1, expires: NEXT, damage: null }
  }, 'End one link to an enemy within 30 ft and impose -3 on that target next save before your next turn. No damage by itself.', [
    linkEffect('link.sever', { savePenalty: -3, uses: 1, expires: NEXT }, 'Sever and penalize next save by 3.')
  ], { durationConfig: nextStart }),
  record(8, 'shared_fate', 'Shared Fate', 2, ally(), ['utility'], {
    op: 'link.transfer', args: { tokens: 0, target: 'linked-pair', amountMax: 2, event: 'original-assigned-damage', uses: 1, eitherEndpoint: true, expires: NEXT }
  }, 'Choose one linked ally within 30 ft. The next time either endpoint takes original assigned damage before your next turn, the other may take up to 2 of it after mitigation. One use total.', [
    linkEffect('link.transfer', { amountMax: 2, eitherEndpoint: true, uses: 1 }, 'One reciprocal 2-point transfer.')
  ], { durationConfig: nextStart }),
  record(8, 'woven_sight', 'Woven Sight', 2, self(), ['utility'], null, 'Gain +3 to one Perception check to notice visible links, wards or deliberate concealment within 60 ft. Declare before rolling.', [
    { kind: 'check-bonus', target: 'self', bonus: 3, uses: 1, skill: 'perception', rangeFeet: 60 }
  ]),

  record(9, 'grand_covenant', 'Grand Covenant', 3, otherAlly(2), ['buff'], {
    op: 'link.ward', args: { tokens: 0, targets: 2, capacity: 6, uses: 1, expires: NEXT, separateWards: true }
  }, 'Two willing allies within 30 ft each gain a capacity-6, one-use damage ward until your next turn starts. Separate wards; no shared pool.', [
    linkEffect('link.ward', { targets: 2, capacity: 6, separateWards: true }, 'Two separate capacity-6 wards.')
  ], { durationConfig: nextStart }),
  record(9, 'sever_all', 'Sever All', 3, self(), ['damage', 'control'], {
    op: 'link.sever-all', args: { tokens: 0, rangeFeet: 30, damagePerEnemy: '1d4', damageType: 'wyrd', oneEventPerEnemy: true, refund: 'normal-recovery' }
  }, 'End any number of links you created within 30 ft. Each affected enemy takes 1d4 wyrd as one event. Tokens recover normally; no immediate refund.', [
    linkEffect('link.sever-all', { damagePerEnemy: '1d4', oneEventPerEnemy: true }, 'Sever all links and deal 1d4 per affected enemy.')
  ], { damageConfig: damage('1d4') }),
  record(9, 'tapestry_ward', 'Tapestry Ward', 2, ally(), ['buff'], {
    op: 'link.ward', args: { tokens: 0, target: 'ally', capacity: 6, uses: 1, expires: NEXT }
  }, 'One ally within 30 ft gains a capacity-6, one-use damage ward until your next turn starts. It applies after normal mitigation.', [
    linkEffect('link.ward', { capacity: 6, uses: 1, expires: NEXT }, 'Capacity-6 one-use ward.')
  ], { durationConfig: nextStart }),
  record(9, 'fate_audit', 'Fate Audit', 2, self(), ['utility'], {
    op: 'link.audit', args: { rangeFeet: 60, scope: 'all-visible-links', reveals: ['endpoints', 'consent-state', 'public-purpose'], hiddenInformation: false }
  }, 'Inspect every visible link within 60 ft and learn endpoints, consent state and public purpose. No hidden clauses or private intentions.', [
    linkEffect('link.audit', { rangeFeet: 60, reveals: ['endpoints', 'consent-state', 'public-purpose'] }, 'Audit visible links.')
  ]),

  record(10, 'final_weave', 'Final Weave', 3, otherAlly(3), ['buff', 'utility'], {
    op: 'link.ward', args: { tokens: 0, targets: 3, capacity: 6, uses: 1, moveFeet: 10, expires: NEXT, separateWards: true }
  }, 'Three willing allies within 30 ft each gain a capacity-6, one-use ward and may move 10 ft using remaining movement. Separate wards; no shared damage pool.', [
    linkEffect('link.ward', { targets: 3, capacity: 6, moveFeet: 10, separateWards: true }, 'Three wards and 10 ft movement.')
  ], { durationConfig: nextStart }),
  record(10, 'cut_the_last_thread', 'Cut the Last Thread', 3, enemy(), ['damage', 'control'], {
    op: 'link.sever', args: { tokens: 0, target: 'linked-enemy', damage: '3d8', damageType: 'wyrd', execution: false, recursion: false }
  }, 'End one link to an enemy within 30 ft and deal 3d8 wyrd. One damage event; no execution, recursion or extra severance.', [
    linkEffect('link.sever', { damage: '3d8', execution: false }, 'Sever and deal 3d8 wyrd.')
  ], { damageConfig: damage('3d8') }),
  record(10, 'eternal_tapestry', 'Eternal Tapestry', 3, self(), ['utility'], {
    op: 'link.recover', args: { tokens: 0, target: 'self', recover: 'all-recovering', once: 'completed-long-rest' }
  }, 'Return all recovering thread tokens to free immediately. Once per completed long rest; no extra tokens or links.', [
    linkEffect('link.recover', { recover: 'all-recovering' }, 'Recover all recovering tokens once per long rest.')
  ], { cooldownConfig: cooldownLongRest }),
  record(10, 'read_the_whole', 'Read the Whole', 2, self(), ['utility'], {
    op: 'link.read', args: { rangeFeet: 120, scope: 'visible-link-map', reveals: ['endpoints', 'public-purpose'], hiddenInformation: false }
  }, 'Reveal the visible link map within 120 ft, including endpoints and public purposes. No hidden links, thoughts or future outcomes.', [
    linkEffect('link.read', { rangeFeet: 120, scope: 'visible-link-map' }, 'Read the visible link map.')
  ])
];

const signature = (suffix, name, treeId, ap, program, description, effects, options = {}) => record(
  3, suffix, name, ap, options.target || otherAlly(options.targets || 1, options.rangeFeet || 30),
  options.effectTypes || ['utility'], program, description, effects, {
    source: 'talent-signature', specialization: treeId, treeId,
    durationConfig: options.durationConfig || nextStart, conditions: options.conditions || []
  }
);

const capstone = (suffix, name, treeId, ap, targetingConfig, program, description, effects, options = {}) => record(
  10, suffix, name, ap, targetingConfig, options.effectTypes || ['utility'], program, description, effects, {
    source: 'talent-capstone', specialization: treeId, treeId,
    cooldownConfig: cooldownLongRest, durationConfig: options.durationConfig || instant
  }
);

export const FATE_WEAVER_TALENT_ACTIVES = [
  signature('witnessed_covenant', 'Witnessed Covenant', 'covenant', 2, {
    op: 'link.covenant', args: { tokens: 1, maxLinks: 3, rangeFeet: 60, consentRequired: true, reciprocalObligation: true, usesMax: 2, expires: 'end-second-subsequent-turn' }
  }, 'Create one covenant link to a willing ally within 60 ft. Both actors consent to one declared reciprocal obligation. Reserve one token; the link has at most two uses and expires at the end of the second subsequent turn. A broken obligation ends the link and sends its token to recovering.', [
    linkEffect('link.covenant', { reciprocalObligation: true, usesMax: 2, expires: 'end-second-subsequent-turn' }, 'Create a consented reciprocal covenant.')
  ], { effectTypes: ['utility'], target: otherAlly(1, 60), durationConfig: { durationType: 'own_turns', durationValue: 2, durationUnit: 'subsequent_turn_end' } }),
  signature('sever_borrowed_crown', 'Sever the Borrowed Crown', 'severance', 2, {
    op: 'link.sever', args: { tokens: 0, target: 'one-link', rangeFeet: 30, suppress: 'one-declared-benefit', suppressUntil: 'end-target-next-turn', damage: null }
  }, 'End one link within 30 ft and suppress one declared benefit or condition sourced from that link until the end of the target next turn. No damage and no transfer.', [
    linkEffect('link.sever', { suppress: 'one-declared-benefit', suppressUntil: 'end-target-next-turn' }, 'Sever and suppress one linked benefit.')
  ], { effectTypes: ['control'], target: enemy() }),
  signature('reanchor_tapestry', 'Reanchor the Tapestry', 'tapestry', 1, {
    op: 'link.reanchor', args: { tokens: 0, target: 'one-own-link', newEndpoint: 'willing-actor', rangeFeet: 30, preserve: ['source', 'token', 'uses', 'absoluteExpiry'], renewal: false }
  }, 'Move one existing link you created to a willing actor within 30 ft, preserving its source, token, remaining uses and absolute expiry. No renewal, extra use or consent bypass.', [
    linkEffect('link.reanchor', { rangeFeet: 30, preserve: ['source', 'token', 'uses', 'absoluteExpiry'] }, 'Move one link endpoint.')
  ], { effectTypes: ['utility'], target: ally() }),
  capstone('threefold_compact', 'Threefold Compact', 'covenant', 2, otherAlly(3), {
    op: 'link.threefold', args: { tokens: 3, maxLinks: 3, rangeFeet: 30, consentRequired: true, links: 3, sharedObligation: true, separateSeverance: true, sharedDamagePool: false, once: 'completed-long-rest' }
  }, 'Create up to three covenant links to willing allies within 30 ft, one token each, under one declared shared obligation. Each link remains separately severable; no shared damage pool and no fourth link. Once per completed long rest.', [
    linkEffect('link.threefold', { links: 3, sharedObligation: true, separateSeverance: true }, 'Create up to three separately severable covenants.')
  ]),
  capstone('sever_throughline', 'Sever the Throughline', 'severance', 2, enemy(), {
    op: 'link.sever-sustained', args: { tokens: 0, target: 'one-linked-enemy', rangeFeet: 30, suppress: 'one-source-benefit', maxRounds: 2, damage: null, permanent: false, once: 'completed-long-rest' }
  }, 'End one link and suppress its source benefit for up to two rounds, then the link closes normally. No damage, recursion or permanent removal. Once per completed long rest.', [
    linkEffect('link.sever-sustained', { suppress: 'one-source-benefit', maxRounds: 2, permanent: false }, 'Sever and suppress for up to two rounds.')
  ], { effectTypes: ['control'] }),
  capstone('grand_relay', 'The Grand Relay', 'tapestry', 2, ally(2), {
    op: 'link.relay', args: { tokens: 0, target: 'up-to-two-own-links', newEndpoint: 'willing-actor', rangeFeet: 30, links: 2, preserve: ['source', 'token', 'uses', 'absoluteExpiry'], newLinks: false, renewal: false, once: 'completed-long-rest' }
  }, 'Reanchor up to two links you created to willing actors within 30 ft, preserving each source, token, remaining uses and expiry. No new links, renewal or extra tokens. Once per completed long rest.', [
    linkEffect('link.relay', { links: 2, preserve: ['source', 'token', 'uses', 'absoluteExpiry'] }, 'Reanchor up to two existing links.')
  ])
];

export const FATE_WEAVER_OPTIONAL_RECORDS = optional;
export const FATE_WEAVER_AUTHORED_RECORDS = [
  ...FATE_WEAVER_CORE_RECORDS, ...FATE_WEAVER_OPTIONAL_RECORDS,
  ...FATE_WEAVER_TALENT_ACTIVES, ...FATE_WEAVER_PASSIVE_RECORDS
];

const nodeForRecord = record => FATE_WEAVER_TALENT_NODES.find(node =>
  node.grantId === record.id || node.passiveSpellId === record.id
);

export function describeFateWeaverPrice(record) {
  const tokens = record.classResourceProgram?.args?.tokens || 0;
  return `${record.resourceCost.actionPoints} AP; 0 mana${tokens ? `; reserve ${tokens} thread token(s)` : '; no thread token'}; manual resolution.`;
}

export const FATE_WEAVER_PROJECTED_SPELLS = FATE_WEAVER_AUTHORED_RECORDS.map(record => {
  const node = nodeForRecord(record);
  return {
    ...flags, id: record.id, name: record.name, class: 'Fate Weaver', level: record.level,
    source: `fate-weaver-${record.source}`, sourceRecordSource: record.source,
    spellType: record.spellType, icon: FATE_WEAVER_ICON, description: record.description,
    specialization: node?.treeId || 'core', treeId: node?.treeId || null,
    typeConfig: {
      school: 'wyrd', castTimeType: record.spellType === 'PASSIVE' ? 'PASSIVE' : 'IMMEDIATE',
      tags: ['fate-weaver', 'manual-only', record.source]
    },
    resourceCost: apCost(record.resourceCost.actionPoints),
    targetingConfig: record.targetingConfig, effectTypes: record.effectTypes,
    resolution: record.damageConfig ? 'DICE' : 'MANUAL', damageConfig: record.damageConfig,
    durationConfig: record.durationConfig, cooldownConfig: record.cooldownConfig,
    reactionTiming: null, savingThrow: null, conditions: record.conditions, area: null,
    manualRequirements: [FATE_WEAVER_MANUAL_NOTICE, describeFateWeaverPrice(record), ...Object.values(FATE_WEAVER_COMMON_MECHANICS)],
    tags: ['fate-weaver', 'manual-only', record.source], categoryIds: [],
    specialMechanics: {
      fateWeaver: {
        ...flags, sourceRecordId: record.id, priceSummary: describeFateWeaverPrice(record),
        authoredSpell: record, commonRules: FATE_WEAVER_COMMON_MECHANICS,
        rankValues: record.rankValues || null, requires: record.requires || null
      }
    }
  };
});
export const FATE_WEAVER_PROJECTED_SPELLS_BY_ID = Object.fromEntries(
  FATE_WEAVER_PROJECTED_SPELLS.map(spell => [spell.id, spell])
);

export const FATE_WEAVER_SPELL_POOLS = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => {
    const level = index + 1;
    return [level, FATE_WEAVER_OPTIONAL_RECORDS.filter(spell => spell.level === level).map(spell => spell.id)];
  })
);

export const FATE_WEAVER_PROGRESSION_POLICY = {
  classId: FATE_WEAVER_CLASS_ID, rulesetVersion: FATE_WEAVER_RULESET_VERSION,
  levelCap: 10, startingSpellPicks: 1, optionalPicksPerLevel: 1,
  allowEarlierUnchosen: true, grantedCoreSpellIds: FATE_WEAVER_CORE_RECORDS.map(spell => spell.id),
  randomizeStartingSpells: false, autoTopUpOnLoad: false, talentActivesAreGrants: true,
  manualOnly: true
};

const findDuplicateEndpoint = links => {
  if (!Array.isArray(links)) return false;
  return links.some((link, index) => !link || !link.sourceId || !link.targetId || link.sourceId === link.targetId ||
    links.findIndex(other => other && other.sourceId === link.sourceId && other.targetId === link.targetId) !== index);
};

// Shape checks only. Never create, settle, move or repair a stored link.
export function validateFateWeaverState(state) {
  const errors = [];
  if (!state || typeof state !== 'object') return { valid: false, errors: ['state must be an object'] };
  if (!Array.isArray(state.tokens) || state.tokens.length !== 3) errors.push('exactly three thread tokens required');
  if (state.links != null && !Array.isArray(state.links)) errors.push('links must be an array');
  const links = Array.isArray(state.links) ? state.links : [];
  if (links.length > 3) errors.push('at most three links');
  if (findDuplicateEndpoint(links)) errors.push('links require distinct endpoints');
  links.forEach(link => {
    if (!link || typeof link !== 'object') { errors.push('link must be an object'); return; }
    if (!['free', 'reserved', 'recovering'].includes(link.tokenState)) errors.push('invalid token state');
    if (link.amountMax != null && (!Number.isFinite(link.amountMax) || link.amountMax > 3)) errors.push('transfer amount exceeds 3');
    if (link.uses != null && (link.uses < 1 || link.uses > 2)) errors.push('uses must be 1 or 2');
    if (link.recursive === true) errors.push('recursive transfer is not allowed');
  });
  return { valid: errors.length === 0, errors };
}

export function projectFateWeaverResource(resource, isOwner = false) {
  const state = resource?.state ?? null;
  if (!state) return { initialized: false, valid: true, errors: [], tokens: { free: 0, reserved: 0, recovering: 0 }, links: [], maxLinks: 3 };
  const check = validateFateWeaverState(state);
  const tokens = [0, 1, 2].map(index => state.tokens?.[index]?.state).filter(value => ['free', 'reserved', 'recovering'].includes(value));
  const links = Array.isArray(state.links) ? state.links.map(link => ({
    id: link?.id || null,
    sourceName: isOwner ? link?.sourceName || link?.source || 'Unknown endpoint' : 'Endpoint hidden',
    targetName: isOwner ? link?.targetName || link?.target || 'Unknown endpoint' : 'Endpoint hidden',
    purpose: link?.purpose || link?.publicPurpose || 'Unrecorded public purpose',
    tokenState: link?.tokenState || 'unknown',
    usesRemaining: Number.isFinite(link?.usesRemaining) ? link.usesRemaining : null,
    expiresAt: link?.expiresAt || null
  })) : [];
  return { initialized: true, valid: check.valid, errors: check.errors, maxLinks: 3,
    tokens: { free: tokens.filter(value => value === 'free').length, reserved: tokens.filter(value => value === 'reserved').length, recovering: tokens.filter(value => value === 'recovering').length },
    links };
}

export const FATE_WEAVER_RESOURCE_RULES = {
  tokenCount: 3, tokenStates: ['free', 'reserved', 'recovering'], maxLinks: 3,
  formationRangeFeet: 60, transferAmountMax: 3, usesMin: 1, usesMax: 2,
  recovery: 'completed-long-rest', refreshOnReconnect: false, refreshOnInitiative: false,
  recursiveTransfer: false, derivedDamageEligible: false,
  mechanicalHeritageBenefits: false
};

export const FATE_WEAVER_RESOURCE_SYSTEM = {
  id: 'fate-links', name: 'Fate Links', type: 'fate-links', base: 0, max: 3,
  generationNote: 'Three tokens. A link reserves one token; an expired link leaves its token recovering until a completed long rest.',
  tokens: 3, maxLinks: 3, manualOnly: true
};

const variants = {};

export const FATE_WEAVER_DATA = {
  ...flags, id: FATE_WEAVER_CLASS_ID, name: 'Fate Weaver', variantName: 'Fate Weaver',
  icon: FATE_WEAVER_ICON, imageIcon: '/assets/icons/classes/fate_weaver.png',
  role: 'Positional support / control / investigation', damageTypes: ['wyrd'],
  resource: 'Fate Links', primaryStat: 'Charisma', secondaryStat: 'Intelligence',
  developmentStatus: 'development', statusLabel: 'Development - manual tabletop',
  heritageEffectsImplemented: false,
  classResource: { type: 'fate-links', base: 0, max: 3, initialized: false, state: null,
    generationNote: 'Uninitialized until actual table state is recorded. Three tokens, max three links.' },
  restrictions: {
    allowedSubraces: [], hardBlocks: [], narrativeUnlock: true,
    acquisition: { records: [
      { id: 'witnessed_link', label: 'Witnessed link', text: 'Observed and recorded a real consented link or covenant with a public obligation and a visible cost.' },
      { id: 'severance_training', label: 'Severance training', text: 'Demonstrated a clean voluntary severance without harming either endpoint.' },
      { id: 'anchor_discipline', label: 'Anchor discipline', text: 'Maintained one link across two real rounds without inventing consent, uses or expiry.' },
      { id: 'thread_accounting', label: 'Thread accounting', text: 'Recorded all three tokens, every state change and the completed-long-rest recovery exactly once.' }
    ] },
    justification: 'Fate Weaver is development and qualification-gated; it grants no native heritage access or edge.'
  },
  equipment: { weapons: ['dagger', 'staff'], protectiveGear: ['light_ward', 'robes'], offHand: ['empty', 'tome'] },
  subraceVariants: variants,
  overview: {
    title: 'The Fate Weaver', subtitle: 'A promise is a position; a thread is a price.',
    description: 'A positional support/controller who reserves three finite threads, chooses who bears risk and severs or re-anchors before an event lands. Repeated decisions: which thread to reserve, whether a longer covenant is worth a token, and when to cut the tie.',
    quickOverview: { title: 'Class Overview', content: 'Three tokens, three links, no extra bank. Tie and Cut are core. Four optional records at every level, two talent actives (signature and capstone) per tree, and one bounded consequence per link. Manual tabletop only.' },
    playstyle: { title: 'Turn 1', content: 'Inspect the actual link and token record. Choose consenting endpoints and a public purpose before any consequence. Record every use once; do not refresh on reconnect, initiative or class change.' },
    roleplayIdentity: { title: 'A visible promise, not a secret debt', content: 'Fate Weaver is a separate new class. It does not import Augur Benediction, Malediction or Omen Debt, and it does not claim Kessen Neth native access.' },
    currentCrisis: 'Development class; no native heritage access is registered. Qualification requires actual records, not ancestry alone.'
  },
  characterCreation: {
    title: 'Fate Weaver',
    description: 'Choose one level-1 optional; Tie the Thread and Cut Clean are core grants. Record all acquisition requirements. Link state remains uninitialized until actual table state exists.'
  },
  specializations: {
    title: 'Three Thread Disciplines',
    description: 'First investment chooses primary tree. Five talent points per level, global cap fifty. Signatures require ten same-tree points at level three; capstones forty-five at level ten.',
    specs: FATE_WEAVER_TREE_META.map(meta => ({
      id: meta.id, name: meta.name, icon: FATE_WEAVER_ICON, theme: meta.tagline,
      description: meta.tagline, playstyle: meta.tagline
    }))
  },
  spells: FATE_WEAVER_PROJECTED_SPELLS, spellPools: FATE_WEAVER_SPELL_POOLS,
  progression: {
    levelCap: 10, policy: FATE_WEAVER_PROGRESSION_POLICY,
    levels: Array.from({ length: 10 }, (_, index) => ({
      level: index + 1, newChoiceIds: FATE_WEAVER_SPELL_POOLS[index + 1],
      optionalPicks: 1, talentBudget: (index + 1) * 5
    }))
  },
  talentTrees: FATE_WEAVER_TALENT_CAPACITY,
  resourceSystem: FATE_WEAVER_RESOURCE_SYSTEM
};

export const FATE_WEAVER_MANIFEST = {
  ...flags, contentLock: 'Phase 2B content lock',
  optional: FATE_WEAVER_OPTIONAL_RECORDS.map(record => record.id),
  core: FATE_WEAVER_CORE_RECORDS.map(record => record.id),
  talentActives: FATE_WEAVER_TALENT_ACTIVES.map(record => record.id),
  passives: FATE_WEAVER_PASSIVE_RECORDS.map(record => record.id),
  records: FATE_WEAVER_AUTHORED_RECORDS.map(record => ({
    id: record.id, name: record.name, level: record.level, source: record.source,
    treeId: nodeForRecord(record)?.treeId || null, ap: record.resourceCost.actionPoints, mana: 0
  })),
  nodes: FATE_WEAVER_TALENT_NODES.map(node => ({
    id: node.id, treeId: node.treeId, spellId: node.grantId || node.passiveSpellId,
    ranks: node.maxRanks, minimumLevel: node.minLevel, requiresPoints: node.requiresPoints,
    prerequisites: node.requires
  })),
  uniqueRecords: 96, activeRecords: 48, passiveRecords: 48,
  talentNodes: 54, talentCapacity: FATE_WEAVER_TALENT_CAPACITY,
  nativeAccess: [], acquisitionRequirements: FATE_WEAVER_DATA.restrictions.acquisition.records.map(record => record.id),
  heritageEffectsImplemented: false, resourceRules: FATE_WEAVER_RESOURCE_RULES,
  trees: FATE_WEAVER_TREES.map(tree => tree.id),
  dependencies: ['CR-R1', 'Phase 2A materialisation', 'manual-tabletop'],
  automaticConversion: false
};

export default FATE_WEAVER_DATA;
