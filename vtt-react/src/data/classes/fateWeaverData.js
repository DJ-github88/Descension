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
  targetingType: maxTargets > 1 ? 'multi' : 'single', rangeType: 'ranged',
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
    price: { actionPoints: ap, mana: 0,
      tokens: program?.args?.threadReservation || program?.args?.threadPrice || program?.args?.tokens || 0 },
    effects: effects.length ? effects : [linkEffect(program?.op || 'link.none', program?.args || {}, description)],
    executable: false
  },
  sourceRefs: ['R1 review payload']
});

export const FATE_WEAVER_COMMON_MECHANICS = {
  price: 'AP and mana are explicit; links reserve thread tokens, never a second resource bank.',
  consent: 'Every link and covenant requires recorded consent from both actors. Consent can be withdrawn; withdrawal ends the link immediately.',
  tokens: 'Exactly three tokens in free, reserved or recovering. One token per link, except an authored covenant may reserve two. Max three links. Reserved tokens become recovering only when the link is closed and its uses are exhausted, returning to free at the start of the owning caster next own turn.',
  links: 'Distinct endpoints, 30 ft formation range each and 60 ft maintenance separation unless a record says otherwise, one consequence per link per round, and no recursive transfer.',
  damage: 'Only original assigned damage after normal mitigation can be transferred; derived damage never qualifies. A transfer moves at most three points and is not a new damage event.',
  expiry: 'Own-turn and explicitly authored expiry timing only. No long rest, reconnect, initiative, class-change or scene-change refill.',
  information: 'Only visible links, observable endpoints and public terms. No mind reading, hidden clauses or future certainty.',
  recovery: 'Recovery begins only after the link is closed and its uses are exhausted; the reserved token then returns at the start of the owning caster next own turn. Eternal Tapestry changes only its authored immediate recovery case.',
  native: 'Fate Weaver has no registered native heritage edge. Kessen Neth access is not implied, and no heritage benefit or cost is granted.'
};

const subsequentTurnEnd = { durationType: 'own_turns', durationValue: 2, durationUnit: 'subsequent_caster_turn_end' };

export const FATE_WEAVER_CORE_RECORDS = [
  record(1, 'tie_thread', 'Tie the Thread', 1, target(['ally', 'self'], 2, 30), ['buff'], {
    op: 'link.tie', args: {
      threadReservation: 1, fromSlot: 0, toSlot: 1, distinctEndpoints: true, consent: 'both',
      formationRangeEach: 30, maintenanceSeparation: 60, uses: 1, transferMax: 3,
      expiry: 'end-second-subsequent-caster-turn', event: 'original-assigned-damage', derivedEvents: false
    }
  }, 'Reserve one of three threads between two willing lives. On the next eligible original damage event, assign up to three of the protected actor post-mitigation damage to the bearer before temp HP.', [
    linkEffect('link.tie', {
      threadReservation: 1, fromSlot: 0, toSlot: 1, distinctEndpoints: true, consent: 'both',
      formationRangeEach: 30, maintenanceSeparation: 60, uses: 1, transferMax: 3,
      expiry: 'end-second-subsequent-caster-turn', event: 'original-assigned-damage', derivedEvents: false
    }, 'Create one consented protective link; reserve one thread.')
  ], { source: 'core', durationConfig: subsequentTurnEnd }),
  record(1, 'cut_clean', 'Cut Clean', 1, self(), ['utility'], {
    op: 'link.cut', args: {
      target: 'own-active-link', threadDestination: 'recovering',
      recoverAt: 'next-caster-own-turn', undoAcceptedConsequences: false
    }
  }, 'End one of your own untriggered links and recover its reserved threads at the start of your next own turn. Cutting is not an immediate refund or a reversal of damage.', [
    linkEffect('link.cut', {
      target: 'own-active-link', threadDestination: 'recovering',
      recoverAt: 'next-caster-own-turn', undoAcceptedConsequences: false
    }, 'End one owned link; its reserved threads become recovering.')
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

  record(2, 'read_bond', 'Read the Bond', 2, target(['perceptible-bond'], 1, 30), ['utility'], {
    op: 'bond.read', args: {
      range: 30, targetKind: 'perceptible-bond',
      reveals: ['endpoints-if-perceptible', 'public-event', 'remaining-public-uses', 'declared-expiry'],
      hiddenKnowledge: false, createLink: false
    }
  }, 'Read the declared terms of one perceptible registered magical fate link or a witnessed voluntary obligation. This does not reveal unknown secrets or create a new bond.', [
    linkEffect('bond.read', {
      range: 30, targetKind: 'perceptible-bond',
      reveals: ['endpoints-if-perceptible', 'public-event', 'remaining-public-uses', 'declared-expiry'],
      hiddenKnowledge: false, createLink: false
    }, 'Read one perceptible bond public terms.')
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
    durationConfig: options.durationConfig || instant, conditions: options.conditions || []
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
    op: 'link.covenant', args: {
      threadReservation: 2, fromSlot: 0, toSlot: 1, consent: 'both',
      formationRangeEach: 30, maintenanceSeparation: 60, uses: 2, transferMax: 3,
      expiry: 'end-second-subsequent-caster-turn', releaseOnlyWhenUsesZero: true,
      threadRecovery: 'next-caster-own-turn-after-closure'
    }
  }, 'Reserve two threads in one protective covenant with two uses. Each eligible event transfers at most three; the two threads remain occupied until both uses are spent or the covenant ends.', [
    linkEffect('link.covenant', {
      threadReservation: 2, consent: 'both', formationRangeEach: 30, maintenanceSeparation: 60,
      uses: 2, transferMax: 3, expiry: 'end-second-subsequent-caster-turn',
      releaseOnlyWhenUsesZero: true, threadRecovery: 'next-caster-own-turn-after-closure'
    }, 'Create one consented two-thread covenant.')
  ], { effectTypes: ['buff'], target: target(['ally', 'self'], 2, 30), durationConfig: subsequentTurnEnd }),
  signature('sever_borrowed_crown', 'Sever the Borrowed Crown', 'severance', 2, {
    op: 'link.sever', args: {
      threadPrice: 1, priceDestination: 'recovering', range: 30,
      allowedObjectKind: 'fate-link-v1', requiresIdentifiedObject: true,
      enemyReservedThreads: 'recover-on-their-next-own-turn', automaticWithinScope: true
    }
  }, 'Sever one identified registered fate-link object within range. Commit one thread to recovering as the price; this does not dispel unrelated magic, bloodlines, gods or ordinary affection.', [
    linkEffect('link.sever', {
      threadPrice: 1, priceDestination: 'recovering', range: 30,
      allowedObjectKind: 'fate-link-v1', requiresIdentifiedObject: true,
      enemyReservedThreads: 'recover-on-their-next-own-turn', automaticWithinScope: true
    }, 'Sever one identified fate link; pay one recovering thread.')
  ], { effectTypes: ['control'], target: target(['identified-fate-link'], 1, 30) }),
  signature('reanchor_tapestry', 'Reanchor the Tapestry', 'tapestry', 1, {
    op: 'link.reanchor', args: {
      target: 'own-active-link', replaceEndpointsMax: 1, formationRangeNew: 30,
      maintenanceSeparation: 60, requiresNewConsent: true, resetUses: false,
      extendExpiry: false, afterTriggerBegins: false
    }
  }, 'Change one endpoint of your own existing link to a willing legal actor. The original event, use count and expiry remain unchanged; the link cannot be moved after its triggering event begins.', [
    linkEffect('link.reanchor', {
      target: 'own-active-link', replaceEndpointsMax: 1, formationRangeNew: 30,
      maintenanceSeparation: 60, requiresNewConsent: true, resetUses: false,
      extendExpiry: false, afterTriggerBegins: false
    }, 'Move one endpoint of an owned link without renewal.')
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
  const args = record.classResourceProgram?.args || {};
  const reservation = args.threadReservation || args.tokens || 0;
  const price = args.threadPrice || 0;
  const threadTerm = reservation
    ? `; reserve ${reservation} thread token(s)`
    : price ? `; pay ${price} thread token(s) to recovering` : '; no thread token';
  return `${record.resourceCost.actionPoints} AP; 0 mana${threadTerm}; manual resolution.`;
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

const fateNodeById = Object.fromEntries(FATE_WEAVER_TALENT_NODES.map(node => [node.id, node]));
const fateTreePoints = (ranks, treeId) => FATE_WEAVER_TALENT_NODES
  .filter(node => node.treeId === treeId)
  .reduce((total, node) => total + (ranks[node.id] || 0), 0);

// Reconcile a stored Fate allocation to the 5-point-per-level budget and the
// same-tree level/prerequisite gates. Deterministic: highest-gated ranks are
// removed first, then structurally invalid dependants.
export const pruneFateWeaverTalents = (talents, characterLevel) => {
  const ranks = talents && typeof talents === 'object' ? { ...talents } : {};
  const level = Number.isInteger(characterLevel) ? Math.max(1, characterLevel) : 10;
  Object.keys(ranks).forEach(nodeId => {
    const node = fateNodeById[nodeId];
    if (!node || !Number.isInteger(ranks[nodeId]) || ranks[nodeId] < 1 || ranks[nodeId] > node.maxRanks) {
      delete ranks[nodeId];
    }
  });

  const pruneStructure = () => {
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of FATE_WEAVER_TALENT_NODES) {
        const rank = ranks[node.id];
        if (!rank) continue;
        const gatePoints = fateTreePoints(ranks, node.treeId) - rank;
        const predecessorMissing = node.requires.some(predecessorId => {
          const predecessor = fateNodeById[predecessorId];
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
    FATE_WEAVER_TALENT_NODES.forEach(node => {
      if (!ranks[node.id]) return;
      if (target === null || node.minLevel >= fateNodeById[target].minLevel) target = node.id;
    });
    if (target === null) break;
    ranks[target] -= 1;
    if (ranks[target] === 0) delete ranks[target];
    pruneStructure();
  }
  return ranks;
};

const TOKEN_STATES = ['free', 'reserved', 'recovering'];
const isIdentifier = value => (typeof value === 'string' && value.trim().length > 0) || Number.isFinite(value);
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

const reservationAliases = link => {
  const tokenIdsPresent = link.tokenIds != null;
  const tokenIdPresent = link.tokenId != null;
  const reservationIdPresent = link.reservationId != null;
  const errors = [];
  if (tokenIdsPresent && !Array.isArray(link.tokenIds)) {
    errors.push('tokenIds must be an array');
  }
  const tokenIds = Array.isArray(link.tokenIds) ? link.tokenIds : [];
  if (tokenIdsPresent) {
    if (tokenIdPresent && !tokenIds.includes(link.tokenId)) {
      errors.push('tokenId conflicts with tokenIds');
    }
    if (reservationIdPresent && !tokenIds.includes(link.reservationId)) {
      errors.push('reservationId conflicts with tokenIds');
    }
  }
  if (tokenIdPresent && reservationIdPresent && link.tokenId !== link.reservationId) {
    errors.push('tokenId conflicts with reservationId');
  }
  const ids = tokenIdsPresent ? tokenIds
    : tokenIdPresent ? [link.tokenId]
      : reservationIdPresent ? [link.reservationId] : [];
  return { ids, errors, aliasesPresent: tokenIdsPresent || tokenIdPresent || reservationIdPresent };
};

const consentSide = (consent, keys) => {
  const values = keys.filter(key => hasOwn(consent, key)).map(key => consent[key]);
  if (values.length === 0) return { present: false, granted: false, contradictory: false, values };
  const contradictory = values.some(value => typeof value !== 'boolean')
    || (values.some(value => value === true) && values.some(value => value === false));
  return { present: true, granted: !contradictory && values.every(value => value === true), contradictory, values };
};

const consentEndpoint = (link, consent, keys, topLevelKey) => {
  const nested = consent && typeof consent === 'object'
    ? consentSide(consent, keys)
    : { present: false, granted: false, contradictory: false, values: [] };
  const values = [
    ...nested.values,
    ...(hasOwn(link || {}, topLevelKey) ? [link[topLevelKey]] : [])
  ];
  if (values.length === 0) return { present: false, granted: false, contradictory: false };
  const contradictory = values.some(value => typeof value !== 'boolean')
    || (values.some(value => value === true) && values.some(value => value === false));
  return { present: true, granted: !contradictory && values.every(value => value === true), contradictory };
};

const hasBothConsent = link => {
  const consent = link?.consent;
  const namedConsent = consent === 'both' || consent === 'mutual';
  if (consent !== undefined && consent !== null && typeof consent !== 'object' && !namedConsent) return false;
  const source = consentEndpoint(link, consent, ['source', 'sourceId', 'from'], 'sourceConsent');
  const target = consentEndpoint(link, consent, ['target', 'targetId', 'to'], 'targetConsent');
  if (source.contradictory || target.contradictory) return false;
  if (namedConsent) {
    return !(source.present && !source.granted) && !(target.present && !target.granted);
  }
  const both = consent && typeof consent === 'object' && hasOwn(consent, 'both') ? consent.both : undefined;
  if (both !== undefined && typeof both !== 'boolean') return false;
  if (both === false && (source.granted || target.granted)) return false;
  if (both === true && ((source.present && !source.granted) || (target.present && !target.granted))) return false;
  const sourceOk = source.present ? source.granted : both === true;
  const targetOk = target.present ? target.granted : both === true;
  return sourceOk && targetOk && (source.present || target.present || both === true);
};

const expiryAliases = link => {
  const entries = ['expiresAt', 'expiry', 'expires', 'expiryAt']
    .filter(key => link[key] !== undefined)
    .map(key => [key, link[key]]);
  const normalized = entries.map(([, value]) => JSON.stringify(value));
  return {
    values: entries,
    conflict: new Set(normalized).size > 1,
    valid: entries.some(([, value]) => (typeof value === 'string' && value.trim().length > 0) || Number.isFinite(value))
  };
};

// Shape checks only. Never create, settle, move or repair a stored link.
export function validateFateWeaverState(state) {
  const errors = [];
  if (!state || typeof state !== 'object') return { valid: false, errors: ['state must be an object'] };
  if (!Array.isArray(state.tokens) || state.tokens.length !== 3) errors.push('exactly three thread tokens required');
  if (state.links != null && !Array.isArray(state.links)) errors.push('links must be an array');
  const tokens = Array.isArray(state.tokens) ? state.tokens : [];
  const links = Array.isArray(state.links) ? state.links : [];
  if (links.length > 3) errors.push('at most three links');

  const tokenById = new Map();
  tokens.forEach((token, index) => {
    if (!token || typeof token !== 'object') { errors.push(`token ${index} must be an object`); return; }
    if (!isIdentifier(token.id)) errors.push(`token ${index} requires an id`);
    else if (tokenById.has(token.id)) errors.push(`duplicate token id ${token.id}`);
    else tokenById.set(token.id, token);
    if (!TOKEN_STATES.includes(token.state)) errors.push(`token ${token.id ?? index} has invalid token state`);
  });

  const reservations = new Map();
  const linkIds = new Set();
  const linkReservations = new Map();
  links.forEach((link, index) => {
    if (!link || typeof link !== 'object') { errors.push(`link ${index} must be an object`); return; }
    if (!isIdentifier(link.id)) errors.push(`link ${index} requires an id`);
    else if (linkIds.has(link.id)) errors.push(`duplicate link id ${link.id}`);
    else linkIds.add(link.id);
    if (!isIdentifier(link.sourceId) || !isIdentifier(link.targetId)) {
      errors.push(`link ${link.id ?? index} requires both endpoint ids`);
    } else if (link.sourceId === link.targetId) {
      errors.push(`link ${link.id ?? index} requires distinct endpoints`);
    }
    if (!hasBothConsent(link)) errors.push(`link ${link.id ?? index} requires recorded consent from both endpoints`);

    const reservation = reservationAliases(link);
    reservation.errors.forEach(message => errors.push(`link ${link.id ?? index} ${message}`));
    const tokenIds = reservation.ids;
    if (!reservation.aliasesPresent) errors.push(`link ${link.id ?? index} requires a reserved token association`);
    if (tokenIds.length === 0) errors.push(`link ${link.id ?? index} requires a reserved token association`);
    if (new Set(tokenIds).size !== tokenIds.length) errors.push(`link ${link.id ?? index} repeats a reservation`);
    if (link.threadReservation != null && link.threadReservation !== tokenIds.length) {
      errors.push(`link ${link.id ?? index} reservation count is inconsistent`);
    }
    if (link.tokenState != null && link.tokenState !== 'reserved') {
      errors.push(`link ${link.id ?? index} active token state must be reserved`);
    }
    tokenIds.forEach(tokenId => {
      if (!isIdentifier(tokenId)) { errors.push(`link ${link.id ?? index} has an invalid reservation id`); return; }
      const token = tokenById.get(tokenId);
      if (!token) errors.push(`link ${link.id ?? index} references a missing reservation ${tokenId}`);
      else {
        if (token.state !== 'reserved') errors.push(`link ${link.id ?? index} references a ${token.state} reservation ${tokenId}`);
        if (token.linkId != null && token.linkId !== link.id) {
          errors.push(`link ${link.id ?? index} reservation ${tokenId} points to another link`);
        }
      }
      if (reservations.has(tokenId)) errors.push(`reservation ${tokenId} is associated with more than one link`);
      else reservations.set(tokenId, link.id);
    });
    if (isIdentifier(link.id)) linkReservations.set(link.id, tokenIds);

    const uses = link.uses;
    if (!Number.isInteger(uses) || uses < 1 || uses > 2) errors.push(`link ${link.id ?? index} uses must be 1 or 2`);
    if (link.usesRemaining != null && link.remainingUses != null && link.usesRemaining !== link.remainingUses) {
      errors.push(`link ${link.id ?? index} remaining-use aliases conflict`);
    }
    const usesRemaining = link.usesRemaining ?? link.remainingUses;
    if (!Number.isInteger(usesRemaining) || usesRemaining < 0 || (Number.isInteger(uses) && usesRemaining > uses)) {
      errors.push(`link ${link.id ?? index} remaining uses are inconsistent`);
    }
    const expiry = expiryAliases(link);
    if (expiry.conflict) errors.push(`link ${link.id ?? index} expiry aliases conflict`);
    if (!expiry.valid) errors.push(`link ${link.id ?? index} requires an explicit expiry`);
    if (link.amountMax != null && (!Number.isFinite(link.amountMax) || link.amountMax > 3)) errors.push('transfer amount exceeds 3');
    if (link.recursive === true) errors.push('recursive transfer is not allowed');
  });

  tokenById.forEach(token => {
    if (token.state === 'reserved' && !reservations.has(token.id)) {
      errors.push(`reserved token ${token.id} is not associated with a link`);
    }
    if (token.linkId != null) {
      const linkedTokenIds = linkReservations.get(token.linkId);
      if (!linkedTokenIds) errors.push(`token ${token.id} points to a missing link`);
      else if (!linkedTokenIds.includes(token.id)) {
        errors.push(`token ${token.id} backreference is not included by link ${token.linkId}`);
      }
    }
  });
  return { valid: errors.length === 0, errors };
}

export function projectFateWeaverResource(resource, isOwner = false) {
  const state = resource?.state ?? null;
  if (!state) return { initialized: false, valid: true, errors: [], tokens: { free: 0, reserved: 0, recovering: 0 }, links: [], maxLinks: 3 };
  const check = validateFateWeaverState(state);
  const rawTokens = Array.isArray(state.tokens) ? state.tokens : [];
  const tokens = rawTokens.slice(0, 3)
    .map(token => token && typeof token === 'object' ? token.state : null)
    .filter(value => ['free', 'reserved', 'recovering'].includes(value));
  const links = Array.isArray(state.links) ? state.links.map(entry => {
    const link = entry && typeof entry === 'object' ? entry : {};
    const reservationId = Array.isArray(link.tokenIds) ? link.tokenIds[0] : (link.tokenId ?? link.reservationId);
    const reservation = rawTokens.find(token => token && typeof token === 'object' && token.id === reservationId);
    const remaining = link.usesRemaining ?? link.remainingUses;
    return {
      id: link.id || null,
      sourceName: isOwner ? link.sourceName || link.source || 'Unknown endpoint' : 'Endpoint hidden',
      targetName: isOwner ? link.targetName || link.target || 'Unknown endpoint' : 'Endpoint hidden',
      purpose: link.purpose || link.publicPurpose || 'Unrecorded public purpose',
      tokenState: link.tokenState || reservation?.state || 'unknown',
      usesRemaining: Number.isFinite(remaining) ? remaining : null,
      expiresAt: link.expiresAt || link.expiry || null
    };
  }) : [];
  return { initialized: true, valid: check.valid, errors: check.errors, maxLinks: 3,
    tokens: { free: tokens.filter(value => value === 'free').length, reserved: tokens.filter(value => value === 'reserved').length, recovering: tokens.filter(value => value === 'recovering').length },
    links };
}

export const FATE_WEAVER_RESOURCE_RULES = {
  tokenCount: 3, tokenStates: ['free', 'reserved', 'recovering'], maxLinks: 3,
  formationRangeEachFeet: 30, maintenanceSeparationFeet: 60, transferAmountMax: 3, usesMin: 1, usesMax: 2,
  recovery: 'next-caster-own-turn-after-closure-and-uses-exhausted',
  refreshOnLongRest: false, refreshOnReconnect: false, refreshOnInitiative: false,
  recursiveTransfer: false, derivedDamageEligible: false,
  mechanicalHeritageBenefits: false
};

export const FATE_WEAVER_RESOURCE_SYSTEM = {
  id: 'fate-links', name: 'Fate Links', type: 'fate-links', base: 0, max: 3,
  generationNote: 'Three tokens. A link reserves one token, except an authored covenant may reserve two; a link recovers only after it is closed and its uses are exhausted, returning its token at the start of the owning caster next own turn.',
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
    generationNote: 'Uninitialized until actual table state is recorded. Three tokens, max three links; a link recovers only after it is closed and its uses are exhausted, returning its token at the start of the owning caster next own turn.' },
  restrictions: {
    allowedSubraces: [], hardBlocks: [], narrativeUnlock: true,
    acquisition: { records: [
      { id: 'witnessed_link', label: 'Witnessed link', text: 'Observed and recorded a real consented link or covenant with a public obligation and a visible cost.' },
      { id: 'severance_training', label: 'Severance training', text: 'Demonstrated a clean voluntary severance without harming either endpoint.' },
      { id: 'anchor_discipline', label: 'Anchor discipline', text: 'Maintained one link across two real rounds without inventing consent, uses or expiry.' },
      { id: 'thread_accounting', label: 'Thread accounting', text: 'Recorded all three tokens, every state change and the next-own-turn recovery exactly once.' }
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
